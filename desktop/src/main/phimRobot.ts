/**
 * ============================================================
 * PHÍM TẮT TOÀN CỤC — ẨN/HIỆN CON ROBOT
 * ============================================================
 *
 * Phải là phím TOÀN CỤC, không phải phím của menu app. Cả điểm của con robot
 * nổi là nó nằm trên mọi ứng dụng khác, nên lúc người dùng muốn tống nó đi thì
 * thứ đang có tiêu điểm gần như chắc chắn KHÔNG phải app này. Một accelerator
 * trong menu chỉ chạy khi app ở trước — tức là đúng lúc không ai cần nó.
 *
 * ⚠️⚠️ "Cmd + C + T" KHÔNG TỒN TẠI TRONG ELECTRON — và nó hỏng ÂM THẦM.
 *
 * Người dùng yêu cầu `Cmd+C+T` (Windows/Linux: `Ctrl+C+T`). Accelerator của
 * Electron là "các phím bổ trợ + ĐÚNG MỘT phím thường", nên chuỗi đó được đọc
 * thành `Cmd` + `C` + `T` với `C` và `T` cùng là phím thường — bộ phân tích
 * lấy cái cuối và cho ra `Cmd+T`. Đo thật: đăng ký `"CommandOrControl+C+T"`
 * trả về `true` (nghe như đã xong!), rồi đăng ký tiếp `"CommandOrControl+T"`
 * trả về `false` — bằng chứng cái trước đã chiếm đúng `Cmd+T`. Mà `Cmd+T` là
 * "tab mới" của mọi trình duyệt: giữ nó toàn cục là cướp phím của cả máy.
 *
 * Nên ở đây là một DANH SÁCH ỨNG VIÊN thật, thử lần lượt:
 *
 *  • `CommandOrControl+Alt+O` — O của Odin. Không trùng phím hệ thống nào của
 *    macOS, Windows hay GNOME.
 *  • `CommandOrControl+Alt+J` — dự phòng.
 *  • `CommandOrControl+Shift+F10` — dự phòng cuối, gần như không ai giữ.
 *
 * ⛔ Những phím ĐÃ LOẠI, ghi lại để đừng ai "sửa" nó về sau:
 *  `Ctrl+Alt+T` mở Terminal trên GNOME (Linux) · `Cmd/Ctrl+Shift+T` mở lại tab
 *  vừa đóng của trình duyệt · `Cmd+T`/`Ctrl+T` mở tab mới. Giữ toàn cục bất kỳ
 *  phím nào trong số đó là làm hỏng máy người dùng để đổi lấy một tiện ích nhỏ.
 *
 * ⚠️ `globalShortcut.register()` TRẢ VỀ `false` KHI HỎNG, KHÔNG NÉM — cùng bài
 * học đã trả giá ở `phimMedia.ts`. Vì thế phải đọc giá trị trả về, và phải
 * CÔNG BỐ phím thật sự giữ được (`phimRobotHienTai()`): trang Cài đặt hướng
 * dẫn người dùng bấm phím nào thì phải là phím ĐANG chạy, không phải phím đầu
 * danh sách. Không giữ được cái nào thì Cài đặt nói thẳng là không có.
 */
import { globalShortcut } from 'electron';

export const UNG_VIEN = [
  'CommandOrControl+Alt+O',
  'CommandOrControl+Alt+J',
  'CommandOrControl+Shift+F10',
] as const;

let dangGiu: string | null = null;

/** Phím ĐANG giữ được, hoặc `null` nếu cả ba ứng viên đều bị máy từ chối. */
export function phimRobotHienTai(): string | null {
  return dangGiu;
}

/**
 * Đăng ký. Trả về phím giữ được, hoặc `null`.
 *
 * `lat` là hàm lật công tắc — truyền vào thay vì import thẳng `batTatRobot` để
 * mô-đun này kiểm được mà không cần dựng cả cửa sổ robot.
 */
export function dangKyPhimRobot(lat: () => void): string | null {
  goPhimRobot();
  for (const ma of UNG_VIEN) {
    try {
      /* Phím đã bị app KHÁC giữ thì `register` trả false. Nhưng nếu chính app
         này đang giữ nó (gọi hai lần), Electron cũng trả false — nên phải
         `goPhimRobot()` ở trên, không thì lần đăng ký thứ hai tụt xuống ứng
         viên dự phòng và phím trong Cài đặt đổi sau lưng người dùng. */
      if (globalShortcut.register(ma, lat)) { dangGiu = ma; return ma; }
    } catch {
      /* hệ điều hành từ chối — thử ứng viên kế */
    }
  }
  dangGiu = null;
  console.warn(
    '[robot] không giữ được phím tắt nào trong '
    + `${UNG_VIEN.join(' · ')} — app khác đang giữ cả ba. `
    + 'Vẫn bật/tắt được bằng bốn cú bấm lên robot, menu chuột phải, hoặc Cài đặt.',
  );
  return null;
}

export function goPhimRobot(): void {
  if (!dangGiu) return;
  try { globalShortcut.unregister(dangGiu); } catch { /* thoát rồi thì thôi */ }
  dangGiu = null;
}

/** Dạng ĐỌC ĐƯỢC cho người dùng: `CommandOrControl+Alt+O` → `⌘ + ⌥ + O`. */
export function phimDeDoc(ma: string, mac: boolean): string {
  return ma
    .split('+')
    .map((p) => (p === 'CommandOrControl' ? (mac ? '⌘' : 'Ctrl')
      : p === 'Alt' ? (mac ? '⌥' : 'Alt')
        : p === 'Shift' ? (mac ? '⇧' : 'Shift')
          : p))
    .join(' + ');
}
