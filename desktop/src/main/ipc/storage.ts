/**
 * Quản lý dung lượng cục bộ — phục vụ màn hình Settings ("đang dùng bao nhiêu
 * đĩa", "xoá dữ liệu đã lưu").
 */
import { session } from 'electron';
import type { StorageUsage } from '../../shared/ipc';
import { handle } from './index';

export function registerStorageHandlers(): void {
  handle('storage:usage', async (): Promise<StorageUsage> => {
    // Chromium không phơi ra quota qua API của main process; số liệu thật lấy
    // từ `navigator.storage.estimate()` phía renderer. Ở đây trả về phần main
    // đo được là kích thước cache HTTP, để màn hình Settings có ít nhất một
    // con số đúng thay vì một con số bịa.
    const size = await session.defaultSession.getCacheSize();
    return { usage: size, quota: 0 };
  });

  handle('storage:clearCache', async () => {
    // CHỈ xoá cache HTTP. KHÔNG đụng tới IndexedDB/localStorage — đó là chỗ
    // chứa nháp chưa đồng bộ của người dùng, xoá là mất dữ liệu thật. Việc dọn
    // dữ liệu offline có nút riêng, có xác nhận riêng (Phase 3).
    await session.defaultSession.clearCache();
  });
}
