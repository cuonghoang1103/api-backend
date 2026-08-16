/**
 * Hàng đợi đồng bộ.
 *
 * QUY TẮC TỐI CAO: không bản ghi nào được chuyển sang `synced` trước khi máy
 * chủ xác nhận. Mọi thứ khác trong file này chỉ là chi tiết; cái này mà sai
 * thì người dùng tin là đã lưu trong khi dữ liệu chưa bao giờ rời khỏi máy.
 *
 * Bốn cơ chế phối hợp, mỗi cái chống một kiểu hỏng:
 *
 *  1. Idempotency key — chống NHÂN ĐÔI. Máy chủ ghi xong nhưng phản hồi lạc
 *     đường là chuyện thường; client thử lại với cùng khoá thì máy chủ nhận ra
 *     và không ghi lần hai. Khoá sinh một lần lúc xếp hàng, giữ nguyên qua mọi
 *     lần thử lại — sinh mới mỗi lần thử thì vô dụng y như không có.
 *  2. Gộp trùng lúc xếp hàng — chống PHÌNH hàng đợi. Sửa một bản nháp 40 lần
 *     khi offline phải ra 1 việc mang nội dung mới nhất, không phải 40 việc.
 *  3. Backoff luỹ thừa — chống ĐẬP máy chủ. Mất mạng 2 tiếng mà thử lại mỗi
 *     giây là 7200 lần gọi vô ích.
 *  4. Tách 4xx khỏi 5xx — chống THỬ LẠI VÔ VỌNG. 400/422 nghĩa là dữ liệu sai;
 *     thử lại 1000 lần vẫn sai. Chỉ 5xx và lỗi mạng mới đáng thử lại.
 */
import { db, type OperationType, type SyncRecord, type SyncStatus } from './db';

/** Kết quả transport trả về. Đây là hợp đồng giữa hàng đợi và tầng API. */
export type TransportResult =
  /** Máy chủ đã xác nhận. `serverId` dùng để ánh xạ id tạm → id thật. */
  | { outcome: 'confirmed'; serverId?: string }
  /** Lỗi tạm (mạng, 5xx, 429). Đáng thử lại. */
  | { outcome: 'retry'; message: string }
  /** Máy chủ từ chối vĩnh viễn (4xx trừ 409). Thử lại vô nghĩa. */
  | { outcome: 'rejected'; message: string }
  /** Máy chủ có bản mới hơn (409). Cần hợp nhất. */
  | { outcome: 'conflict'; message: string; serverVersion?: unknown };

export type Transport = (record: SyncRecord) => Promise<TransportResult>;

/** Backoff: 2s, 8s, 32s, 2min, 8min, rồi chốt ở 30 phút. */
const BASE_DELAY_MS = 2000;
const MAX_DELAY_MS = 30 * 60 * 1000;
const MAX_RETRIES = 8;

function backoffDelay(retryCount: number): number {
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 4 ** retryCount);
}

/**
 * Sinh idempotency key. Dùng `crypto.randomUUID` — có sẵn trong Electron và
 * mọi trình duyệt hiện đại, không cần thêm thư viện uuid.
 */
function newIdempotencyKey(): string {
  return crypto.randomUUID();
}

export interface EnqueueInput {
  userId: number;
  operationType: OperationType;
  entityType: string;
  entityId: string;
  payload: unknown;
}

/**
 * Xếp một thao tác vào hàng đợi.
 *
 * Gộp trùng: nếu đã có việc CHƯA GỬI cho cùng (userId, entityType, entityId)
 * thì cập nhật payload của việc đó thay vì thêm việc mới.
 *
 * Chỉ gộp khi trạng thái là `pending` hoặc `failed`. KHÔNG gộp vào việc đang
 * `syncing`: lúc đó yêu cầu đã bay lên mạng rồi, sửa payload của nó nghĩa là
 * máy chủ nhận nội dung A còn ta ghi sổ là đã gửi nội dung B.
 */
export async function enqueue(input: EnqueueInput): Promise<number> {
  const now = Date.now();

  const existing = await db.queue
    .where('[userId+entityType+entityId]')
    .equals([input.userId, input.entityType, input.entityId])
    .filter((record) => record.status === 'pending' || record.status === 'failed')
    .first();

  if (existing?.id !== undefined) {
    // `delete` sau `create` chưa gửi = huỷ luôn cả hai. Thực thể chưa từng tồn
    // tại trên máy chủ nên không có gì để xoá; gửi lệnh xoá một id tạm chỉ tổ
    // nhận 404.
    if (existing.operationType === 'create' && input.operationType === 'delete') {
      await db.queue.delete(existing.id);
      return existing.id;
    }

    await db.queue.update(existing.id, {
      payload: input.payload,
      updatedAt: now,
      // Nội dung mới thì cho thử lại từ đầu: lần hỏng trước là của nội dung cũ.
      status: 'pending' as SyncStatus,
      retryCount: 0,
      lastError: null,
      nextAttemptAt: now,
      // `create` rồi `update` vẫn là `create` — máy chủ chưa hề biết thực thể
      // này, gửi `update` sẽ 404.
      operationType:
        existing.operationType === 'create' ? 'create' : input.operationType,
    });
    return existing.id;
  }

  return db.queue.add({
    userId: input.userId,
    operationType: input.operationType,
    entityType: input.entityType,
    entityId: input.entityId,
    payload: input.payload,
    createdAt: now,
    updatedAt: now,
    retryCount: 0,
    lastError: null,
    status: 'pending',
    idempotencyKey: newIdempotencyKey(),
    nextAttemptAt: now,
  });
}

export interface SyncSummary {
  attempted: number;
  confirmed: number;
  retrying: number;
  rejected: number;
  conflicted: number;
}

/**
 * Chạy một lượt đồng bộ.
 *
 * Tuần tự, không song song. Các thao tác trên cùng một thực thể có thứ tự
 * (tạo trước, sửa sau); gửi song song thì `update` có thể tới trước `create`.
 * Hàng đợi ở đây luôn nhỏ (việc người dùng làm lúc offline), nên tuần tự không
 * phải nút thắt.
 */
export async function runSync(options: {
  userId: number;
  transport: Transport;
  online: boolean;
  now?: number;
}): Promise<SyncSummary> {
  const { userId, transport, online } = options;
  const now = options.now ?? Date.now();

  const summary: SyncSummary = {
    attempted: 0,
    confirmed: 0,
    retrying: 0,
    rejected: 0,
    conflicted: 0,
  };

  // Không có mạng thì không thử. Gọi mạng lúc offline chỉ tăng `retryCount` vô
  // ích và đẩy backoff lên cao, khiến lúc CÓ mạng trở lại app lại ngồi đợi.
  if (!online) return summary;

  const due = await db.queue
    .where('[userId+status]')
    .anyOf([
      [userId, 'pending'],
      [userId, 'failed'],
    ])
    .filter((record) => record.nextAttemptAt <= now)
    .sortBy('createdAt');

  for (const record of due) {
    if (record.id === undefined) continue;
    summary.attempted += 1;

    await db.queue.update(record.id, { status: 'syncing' as SyncStatus });

    let result: TransportResult;
    try {
      result = await transport(record);
    } catch (error) {
      // Transport ném lỗi = lỗi ngoài dự kiến (mạng đứt giữa chừng, JSON hỏng).
      // Coi như tạm thời: thà thử lại thừa còn hơn vứt dữ liệu người dùng.
      result = {
        outcome: 'retry',
        message: error instanceof Error ? error.message : String(error),
      };
    }

    switch (result.outcome) {
      case 'confirmed': {
        // CHỈ tới đây mới được đánh dấu đã đồng bộ.
        await db.queue.update(record.id, {
          status: 'synced' as SyncStatus,
          lastError: null,
          updatedAt: Date.now(),
        });
        summary.confirmed += 1;
        break;
      }

      case 'retry': {
        const retryCount = record.retryCount + 1;
        const exhausted = retryCount >= MAX_RETRIES;
        await db.queue.update(record.id, {
          // Hết lượt thử vẫn để `failed`, KHÔNG xoá. Dữ liệu còn đó để người
          // dùng thử tay hoặc chép ra. Xoá là mất vĩnh viễn thứ họ đã gõ.
          status: 'failed' as SyncStatus,
          retryCount,
          lastError: result.message,
          updatedAt: Date.now(),
          nextAttemptAt: exhausted
            ? Number.MAX_SAFE_INTEGER // chỉ chạy lại khi người dùng bấm tay
            : Date.now() + backoffDelay(retryCount),
        });
        summary.retrying += 1;
        break;
      }

      case 'rejected': {
        await db.queue.update(record.id, {
          status: 'rejected' as SyncStatus,
          lastError: result.message,
          updatedAt: Date.now(),
        });
        summary.rejected += 1;
        break;
      }

      case 'conflict': {
        await db.queue.update(record.id, {
          status: 'conflict' as SyncStatus,
          lastError: result.message,
          updatedAt: Date.now(),
        });
        summary.conflicted += 1;
        break;
      }
    }
  }

  return summary;
}

/**
 * Người dùng bấm "Thử lại" — đặt lại backoff cho mọi việc đang hỏng.
 *
 * Không đụng `rejected` và `conflict`: hai cái đó cần người dùng sửa nội dung
 * hoặc chọn bản nào thắng, thử lại nguyên si chỉ hỏng y như cũ.
 */
export async function retryFailed(userId: number): Promise<number> {
  const failed = await db.queue
    .where('[userId+status]')
    .equals([userId, 'failed'])
    .toArray();

  const now = Date.now();
  await Promise.all(
    failed.map((record) =>
      record.id === undefined
        ? Promise.resolve()
        : db.queue.update(record.id, {
            status: 'pending' as SyncStatus,
            retryCount: 0,
            nextAttemptAt: now,
          }),
    ),
  );
  return failed.length;
}

export interface QueueCounts {
  pending: number;
  syncing: number;
  failed: number;
  rejected: number;
  conflict: number;
}

/** Số liệu cho thanh trạng thái. `synced` không đếm — việc xong thì hết chuyện. */
export async function queueCounts(userId: number): Promise<QueueCounts> {
  const records = await db.queue.where('userId').equals(userId).toArray();
  const counts: QueueCounts = {
    pending: 0,
    syncing: 0,
    failed: 0,
    rejected: 0,
    conflict: 0,
  };
  for (const record of records) {
    if (record.status === 'synced') continue;
    counts[record.status] += 1;
  }
  return counts;
}

/** Dọn việc đã xong quá `maxAgeMs` — giữ lại một ít để người dùng còn thấy lịch sử. */
export async function pruneSynced(
  userId: number,
  maxAgeMs = 24 * 60 * 60 * 1000,
): Promise<number> {
  const cutoff = Date.now() - maxAgeMs;
  return db.queue
    .where('[userId+status]')
    .equals([userId, 'synced'])
    .filter((record) => record.updatedAt < cutoff)
    .delete();
}
