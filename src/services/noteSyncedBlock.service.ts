/**
 * Synced block — nội dung dùng chung giữa nhiều trang ghi chú.
 *
 * Bề mặt cố ý nhỏ: tạo, đọc, ghi. Không có "danh sách" và không có "xoá".
 *
 * Vì sao KHÔNG có xoá: một khối có thể đang được nhúng ở nhiều ghi chú, và
 * máy chủ không có cách nào biết còn bao nhiêu chỗ đang trỏ tới nó — tham
 * chiếu nằm rải trong `contentJson` của từng ghi chú, không phải trong một
 * bảng đếm được. Xoá bản ghi là để lại những khối trống rỗng ở các trang mà
 * người dùng không hề mở. Gỡ khối khỏi MỘT trang chỉ là xoá node trong trang
 * đó, và việc ấy không cần đi qua đây.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export interface SyncedBlockDto {
  id: number;
  contentJson: unknown;
  updatedAt: Date;
}

/**
 * Trần kích thước nội dung một khối.
 *
 * `contentJson` là JSON tự do đến từ client, và Postgres sẽ nhận bất cứ thứ gì
 * vừa cột JSONB — tức là hàng chục MB nếu không ai chặn. Một khối dùng chung
 * mà phình ra như thế sẽ được tải lại ở MỌI trang nhúng nó.
 */
const MAX_CONTENT_BYTES = 512 * 1024;

function assertSize(contentJson: unknown): void {
  const size = Buffer.byteLength(JSON.stringify(contentJson ?? null), 'utf8');
  if (size > MAX_CONTENT_BYTES) {
    throw new AppError('Noi dung khoi dung chung qua lon', 413, 'SYNCED_BLOCK_TOO_LARGE');
  }
}

export async function createSyncedBlock(userId: number, contentJson?: unknown): Promise<SyncedBlockDto> {
  assertSize(contentJson);
  const row = await prisma.noteSyncedBlock.create({
    data: { userId, contentJson: (contentJson ?? null) as never },
    select: { id: true, contentJson: true, updatedAt: true },
  });
  return row;
}

export async function getSyncedBlock(userId: number, blockId: number): Promise<SyncedBlockDto> {
  if (!Number.isInteger(blockId) || blockId <= 0) {
    throw new AppError('blockId khong hop le', 400, 'INVALID_BLOCK_ID');
  }
  const row = await prisma.noteSyncedBlock.findFirst({
    // Lọc theo `userId` NGAY TRONG truy vấn chứ không đọc rồi so sánh sau:
    // đọc trước rồi mới kiểm sẽ để lộ sự tồn tại của khối người khác qua
    // khác biệt giữa 403 và 404.
    where: { id: blockId, userId },
    select: { id: true, contentJson: true, updatedAt: true },
  });
  if (!row) throw new AppError('Khong tim thay khoi dung chung', 404, 'SYNCED_BLOCK_NOT_FOUND');
  return row;
}

export async function updateSyncedBlock(
  userId: number,
  blockId: number,
  contentJson: unknown,
): Promise<SyncedBlockDto> {
  assertSize(contentJson);
  // `updateMany` + kiểm `count` thay vì `update`: `update` cần khoá chính duy
  // nhất nên không nhét được điều kiện chủ sở hữu vào cùng câu, và tách thành
  // hai câu là mở ra khe TOCTOU.
  const result = await prisma.noteSyncedBlock.updateMany({
    where: { id: blockId, userId },
    data: { contentJson: (contentJson ?? null) as never },
  });
  if (result.count === 0) {
    throw new AppError('Khong tim thay khoi dung chung', 404, 'SYNCED_BLOCK_NOT_FOUND');
  }
  return getSyncedBlock(userId, blockId);
}
