/**
 * Đọc/ghi cấu hình người dùng. Khoá bị giới hạn bằng enum ở shared/ipc.ts nên
 * renderer không thể tự bịa khoá mới để dùng file cấu hình làm kho lưu trữ tuỳ ý.
 */
import type { SettingKey } from '../../shared/ipc';
import { getSettings, setSetting } from '../store';
import { handle } from './index';

/**
 * ⛔ Khoá renderer KHÔNG được ghi, dù chúng nằm trong enum.
 *
 * Đây không phải cấu hình giao diện — đây là QUYỀN TRUY CẬP ĐĨA mà người dùng
 * đã cấp qua hộp thoại của hệ điều hành. Chỉ main được ghi chúng, và chỉ ngay
 * sau khi người dùng tự tay chọn thư mục.
 *
 * Không có danh sách này thì cả tầng nhà tù đường dẫn (`main/agent/jail.ts`)
 * trở thành trang trí: nhà tù chỉ chặn agent đi RA KHỎI thư mục gốc, còn một
 * dòng `settings.set('agentWorkspace', '/Users/x/.ssh')` từ renderer thì đổi
 * luôn CHÍNH thư mục gốc đó — hợp lệ với mọi phép kiểm bên trong. Và renderer
 * là nơi chạy nội dung do máy chủ trả về, tức là nơi ít đáng tin nhất.
 *
 * `notesFolder` cũng vào đây vì cùng một hình dạng: nó quyết định app ghi file
 * ghi chú vào đâu trên đĩa người dùng.
 *
 * Renderer chỉ thật sự ghi các khoá giao diện (theme, sidebarMode, zoomLevel,
 * lastRoute…) qua `app-state.tsx` — chặn hai khoá này không lấy đi của nó thứ
 * gì đang dùng.
 */
const KHOA_CHI_MAIN: readonly SettingKey[] = ['notesFolder', 'agentWorkspace'];

export function registerSettingsHandlers(): void {
  handle('settings:getAll', () => getSettings());

  handle('settings:set', ({ key, value }) => {
    if (KHOA_CHI_MAIN.includes(key)) {
      throw new Error(`Khoá "${key}" chỉ đổi được bằng hộp thoại chọn thư mục.`);
    }
    setSetting(key, value);
  });
}
