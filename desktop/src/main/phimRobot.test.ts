/**
 * Phím tắt toàn cục ẩn/hiện robot.
 *
 * Kiểm cái ĐẮT NHẤT khi sai: một phím tắt toàn cục cướp phím khỏi MỌI app trên
 * máy người dùng, và `register()` hỏng thì trả `false` chứ không ném.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const daGiu = new Set<string>();
const dangKy = vi.fn((ma: string, _cb: () => void) => {
  if (daGiu.has(ma)) return false;   // app khác đang chiếm — đúng như Electron
  daGiu.add(ma);
  return true;
});

vi.mock('electron', () => ({
  globalShortcut: {
    register: (ma: string, cb: () => void) => dangKy(ma, cb),
    unregister: (ma: string) => { daGiu.delete(ma); },
  },
}));

const { dangKyPhimRobot, goPhimRobot, phimRobotHienTai, phimDeDoc, UNG_VIEN } =
  await import('./phimRobot');

beforeEach(() => { daGiu.clear(); dangKy.mockClear(); goPhimRobot(); });

describe('chọn phím tắt', () => {
  it('giữ được ứng viên đầu ⇒ dùng nó và không thử tiếp', () => {
    expect(dangKyPhimRobot(() => {})).toBe(UNG_VIEN[0]);
    expect(phimRobotHienTai()).toBe(UNG_VIEN[0]);
    expect(dangKy).toHaveBeenCalledTimes(1);
  });

  it('⭐ ứng viên đầu bị app khác chiếm ⇒ LÙI xuống cái sau, không im lặng bỏ cuộc', () => {
    // `register` trả `false` chứ không ném. Bản đầu của `phimMedia.ts` chỉ bọc
    // try/catch nên mọi thất bại đều vô hình — đừng lặp lại ở đây.
    daGiu.add(UNG_VIEN[0]);
    expect(dangKyPhimRobot(() => {})).toBe(UNG_VIEN[1]);
    expect(phimRobotHienTai()).toBe(UNG_VIEN[1]);
  });

  it('cả ba đều bị chiếm ⇒ trả null, và Cài đặt phải NÓI RA là không có', () => {
    for (const ma of UNG_VIEN) daGiu.add(ma);
    expect(dangKyPhimRobot(() => {})).toBeNull();
    expect(phimRobotHienTai()).toBeNull();
  });

  it('⭐ đăng ký hai lần KHÔNG được tụt xuống ứng viên dự phòng', () => {
    // Electron trả `false` cả khi CHÍNH app này đang giữ phím. Không gỡ trước
    // thì lần gọi thứ hai thấy "bận" và lùi — phím in trong Cài đặt đổi sau
    // lưng người dùng dù chẳng có app nào tranh.
    expect(dangKyPhimRobot(() => {})).toBe(UNG_VIEN[0]);
    expect(dangKyPhimRobot(() => {})).toBe(UNG_VIEN[0]);
  });

  it('gỡ xong thì không còn giữ phím nào', () => {
    dangKyPhimRobot(() => {});
    goPhimRobot();
    expect(phimRobotHienTai()).toBeNull();
    expect(daGiu.size).toBe(0);
  });

  it('phím lật ĐÚNG hàm được truyền vào', () => {
    const lat = vi.fn();
    dangKyPhimRobot(lat);
    dangKy.mock.calls[0]![1]!();
    expect(lat).toHaveBeenCalledOnce();
  });
});

describe('⛔ những tổ hợp KHÔNG được phép xuất hiện trong danh sách', () => {
  /**
   * Phím toàn cục cướp phím khỏi mọi app. Ba tổ hợp dưới đây đều là phím người
   * dùng bấm hàng ngày ở app khác, nên giữ bất kỳ cái nào là làm hỏng máy họ.
   *
   * `Cmd+C+T` (thứ được yêu cầu ban đầu) không có trong danh sách vì Electron
   * KHÔNG hiểu hai phím thường trong một accelerator — nó đọc thành `Cmd+T`,
   * tức là đúng cái mục cuối bảng này.
   */
  const CAM = [
    'CommandOrControl+T',          // tab mới của mọi trình duyệt
    'CommandOrControl+Shift+T',    // mở lại tab vừa đóng
    'CommandOrControl+Alt+T',      // mở Terminal trên GNOME (Linux)
    'CommandOrControl+C',
  ];
  for (const ma of CAM) {
    it(`không dùng ${ma}`, () => { expect(UNG_VIEN as readonly string[]).not.toContain(ma); });
  }

  it('mỗi ứng viên chỉ có ĐÚNG MỘT phím thường — dạng Electron hiểu được', () => {
    // `Cmd+C+T` trông hợp lệ và `register()` còn trả `true`, nhưng thứ nó giữ
    // là `Cmd+T`. Chốt này bắt mọi mục có từ hai phím thường trở lên.
    const BO_TRO = new Set(['CommandOrControl', 'Command', 'Control', 'Alt', 'Option', 'Shift', 'Super']);
    for (const ma of UNG_VIEN) {
      const thuong = ma.split('+').filter((p) => !BO_TRO.has(p));
      expect(thuong, ma).toHaveLength(1);
    }
  });
});

describe('hiện cho người đọc', () => {
  it('macOS dùng ký hiệu phím', () => {
    expect(phimDeDoc('CommandOrControl+Alt+O', true)).toBe('⌘ + ⌥ + O');
  });
  it('Windows/Linux viết chữ', () => {
    expect(phimDeDoc('CommandOrControl+Alt+O', false)).toBe('Ctrl + Alt + O');
  });
});
