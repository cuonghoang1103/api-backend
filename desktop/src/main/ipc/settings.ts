/**
 * Đọc/ghi cấu hình người dùng. Khoá bị giới hạn bằng enum ở shared/ipc.ts nên
 * renderer không thể tự bịa khoá mới để dùng file cấu hình làm kho lưu trữ tuỳ ý.
 */
import { getSettings, setSetting } from '../store';
import { handle } from './index';

export function registerSettingsHandlers(): void {
  handle('settings:getAll', () => getSettings());

  handle('settings:set', ({ key, value }) => {
    setSetting(key, value);
  });
}
