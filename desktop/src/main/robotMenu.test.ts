/**
 * Kiểm bảng menu chuột phải của robot.
 *
 * ⚠️ `Menu.popup()` là MODAL — nó chặn tiến trình tới khi người dùng chọn xong,
 * nên không bộ kiểm tự động nào lái được nó (đo thật: phép thử đầu tiên của tôi
 * treo cứng 120 giây rồi bị giết). Nên phần quyết định nằm ở hàm thuần này, và
 * đây là chỗ duy nhất canh được nó.
 */
import { describe, expect, it, vi } from 'vitest';
import { bangMenuRobot, NHAN_CO, type TuyChonMenuRobot } from './robotMenu';

const goc = (): TuyChonMenuRobot => ({
  trongApp: false,
  nacCo: 0,
  bamMep: true,
  moChat: vi.fn(),
  datCo: vi.fn(),
  datBamMep: vi.fn(),
  tat: vi.fn(),
});

/** Tìm một mục theo nhãn, bỏ qua các vạch ngăn. */
const muc = (b: ReturnType<typeof bangMenuRobot>, nhan: string) =>
  b.find((m) => m.label === nhan);

describe('mục trong menu', () => {
  it('có đủ bốn việc người dùng cần: mở chat, đổi cỡ, dính mép, tắt', () => {
    const b = bangMenuRobot(goc());
    expect(muc(b, 'Mở AI Chat')).toBeTruthy();
    expect(muc(b, 'Cỡ')).toBeTruthy();
    expect(muc(b, 'Tự dính mép màn hình')).toBeTruthy();
    expect(muc(b, 'Tắt robot nổi')).toBeTruthy();
  });

  it('⛔ con TRONG APP không được bày mục "dính mép màn hình"', () => {
    // Nó dính mép CỬA SỔ và đi theo luật riêng của renderer. Bày mục này cho
    // nó là hứa một thứ nút không làm được.
    const b = bangMenuRobot({ ...goc(), trongApp: true });
    expect(muc(b, 'Tự dính mép màn hình')?.visible).toBe(false);
    expect(muc(b, 'Tắt robot trong app')).toBeTruthy();
    expect(muc(b, 'Tắt robot nổi')).toBeUndefined();
  });
});

describe('trạng thái hiện đúng', () => {
  it('nấc cỡ ĐANG dùng được chấm dấu, và chỉ một nấc', () => {
    // Chấm sai thì người dùng đổi cỡ xong mở lại menu thấy dấu ở chỗ khác, và
    // họ không còn tin cái menu nữa.
    const b = bangMenuRobot({ ...goc(), nacCo: 2 });
    const con = muc(b, 'Cỡ')?.submenu as { label: string; checked: boolean }[];
    expect(con).toHaveLength(NHAN_CO.length);
    expect(con.filter((m) => m.checked).map((m) => m.label)).toEqual(['66%']);
  });

  it('ô "dính mép" theo đúng thiết đặt', () => {
    expect(muc(bangMenuRobot({ ...goc(), bamMep: false }), 'Tự dính mép màn hình')?.checked)
      .toBe(false);
    expect(muc(bangMenuRobot(goc()), 'Tự dính mép màn hình')?.checked).toBe(true);
  });
});

describe('bấm thì gọi đúng việc', () => {
  it('chọn một nấc cỡ ⇒ `datCo` nhận đúng CHỈ SỐ nấc, không phải nhãn', () => {
    const o = goc();
    const con = muc(bangMenuRobot(o), 'Cỡ')?.submenu as { click: () => void }[];
    con[3]!.click();
    expect(o.datCo).toHaveBeenCalledWith(3);
  });

  it('bật/tắt dính mép ⇒ truyền trạng thái MỚI của ô, không phải trạng thái cũ', () => {
    // `m.checked` mà Electron đưa vào là giá trị SAU khi bấm. Đọc nhầm sang cờ
    // cũ thì mỗi lần bấm lại ghi đúng cái giá trị đang có ⇒ nút chết câm.
    const o = goc();
    const m = muc(bangMenuRobot(o), 'Tự dính mép màn hình')!;
    (m.click as (x: { checked: boolean }) => void)({ checked: false });
    expect(o.datBamMep).toHaveBeenCalledWith(false);
  });

  it('mở chat và tắt robot gọi đúng hàm', () => {
    const o = goc();
    const b = bangMenuRobot(o);
    (muc(b, 'Mở AI Chat')!.click as () => void)();
    (muc(b, 'Tắt robot nổi')!.click as () => void)();
    expect(o.moChat).toHaveBeenCalled();
    expect(o.tat).toHaveBeenCalled();
  });
});
