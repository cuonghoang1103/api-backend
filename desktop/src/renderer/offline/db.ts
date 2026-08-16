/**
 * Cơ sở dữ liệu cục bộ (IndexedDB qua Dexie).
 *
 * Hai bảng, hai mục đích khác hẳn nhau — đừng gộp:
 *
 *   • `cache`  — bản sao dữ liệu của MÁY CHỦ. Mất là không sao, tải lại được.
 *   • `queue`  — thao tác của NGƯỜI DÙNG chưa gửi đi được. Mất là mất dữ liệu
 *                thật, không cách nào lấy lại.
 *
 * Vì thế mọi thao tác dọn dẹp chỉ được đụng tới `cache`. Nút "xoá dữ liệu" nào
 * quét cả hai bảng đều phải hỏi lại người dùng, kèm số lượng mục sắp mất.
 *
 * Tách dữ liệu theo người dùng: MỌI bản ghi mang `userId`, và mọi truy vấn đi
 * qua chỉ mục ghép bắt đầu bằng `userId`. Không dùng mỗi người một database:
 * đổi tài khoản sẽ phải mở/đóng database, mà Dexie xử lý việc đó bất đồng bộ
 * nên có khoảng thời gian truy vấn chạy trên database cũ.
 */
import Dexie, { type Table } from 'dexie';

/** Trạng thái vòng đời của một thao tác trong hàng đợi. */
export type SyncStatus =
  /** Đã lưu cục bộ, đang chờ tới lượt gửi. */
  | 'pending'
  /** Đang gửi lên máy chủ, chưa biết kết quả. */
  | 'syncing'
  /** Máy chủ ĐÃ XÁC NHẬN. Chỉ đặt sau khi có phản hồi 2xx. */
  | 'synced'
  /** Gửi thất bại, còn thử lại. */
  | 'failed'
  /** Máy chủ từ chối vĩnh viễn (4xx). Không thử lại; cần người dùng xử lý. */
  | 'rejected'
  /** Máy chủ có bản mới hơn; cần hợp nhất. */
  | 'conflict';

export type OperationType = 'create' | 'update' | 'delete';

export interface SyncRecord {
  id?: number;
  userId: number;
  operationType: OperationType;
  /** Ví dụ: 'cv', 'note', 'message'. Quyết định transport nào xử lý. */
  entityType: string;
  /**
   * Định danh thực thể. Với `create` thì đây là id tạm do client sinh — máy chủ
   * sẽ trả về id thật, và `onSynced` của transport có nhiệm vụ ánh xạ lại.
   */
  entityId: string;
  payload: unknown;
  createdAt: number;
  updatedAt: number;
  retryCount: number;
  lastError: string | null;
  status: SyncStatus;
  /**
   * Sinh MỘT LẦN lúc xếp hàng và giữ nguyên qua mọi lần thử lại.
   *
   * Đây là thứ duy nhất chống được tin nhắn nhân đôi: khi mạng chập chờn, máy
   * chủ có thể đã nhận và ghi xong nhưng phản hồi không về tới nơi. Client thấy
   * timeout, thử lại — nếu không có khoá này thì máy chủ ghi lần hai. Sinh khoá
   * mới ở mỗi lần thử lại cũng vô dụng y như không có.
   */
  idempotencyKey: string;
  /** Thời điểm sớm nhất được thử lại (backoff). */
  nextAttemptAt: number;
}

export interface CacheRecord {
  /** `${userId}:${key}` — khoá chính, đảm bảo không lẫn giữa các tài khoản. */
  id: string;
  userId: number;
  key: string;
  value: unknown;
  /** Lúc ghi vào cache. */
  cachedAt: number;
  /** Sau mốc này thì dữ liệu bị coi là cũ (vẫn dùng được, nhưng phải làm mới). */
  staleAt: number;
}

export class OfflineDatabase extends Dexie {
  cache!: Table<CacheRecord, string>;
  queue!: Table<SyncRecord, number>;

  constructor(name = 'cuongthai-offline') {
    super(name);
    this.version(1).stores({
      // `[userId+key]` cho tra cứu, `cachedAt` cho việc dọn theo tuổi.
      cache: 'id, [userId+key], userId, cachedAt',
      // `[userId+status]` là truy vấn nóng nhất (lấy việc chờ gửi của người
      // đang đăng nhập). `[entityType+entityId]` phục vụ gộp trùng.
      queue:
        '++id, [userId+status], [userId+entityType+entityId], [entityType+entityId], userId, status, nextAttemptAt',
    });
  }
}

export const db = new OfflineDatabase();

/**
 * Xoá toàn bộ dữ liệu của MỘT người dùng — dùng khi đăng xuất và người dùng
 * chọn "xoá dữ liệu cục bộ".
 *
 * Trả về số mục đã xoá ở từng bảng, để giao diện nói được "sẽ mất 3 nháp chưa
 * gửi" thay vì một câu cảnh báo chung chung.
 */
export async function clearUserData(userId: number): Promise<{
  cache: number;
  queue: number;
}> {
  const [cacheCount, queueCount] = await Promise.all([
    db.cache.where('userId').equals(userId).delete(),
    db.queue.where('userId').equals(userId).delete(),
  ]);
  return { cache: cacheCount, queue: queueCount };
}

/** Đếm việc chưa gửi xong — dùng để cảnh báo TRƯỚC khi đăng xuất. */
export async function countUnsynced(userId: number): Promise<number> {
  return db.queue
    .where('userId')
    .equals(userId)
    .filter((record) => record.status !== 'synced')
    .count();
}
