/**
 * Kiểm bảng menu chuột phải của robot.
 *
 * ⚠️ `Menu.popup()` là MODAL — nó chặn tiến trình tới khi người dùng chọn xong,
 * nên không bộ kiểm tự động nào lái được nó (đo thật: phép thử đầu tiên của tôi
 * treo cứng 120 giây rồi bị giết). Nên phần quyết định nằm ở hàm thuần này, và
 * đây là chỗ duy nhất canh được nó.
 */
import { describe, expect, it, vi } from 'vitest';
import { bangMenuRobot, MUC_CO, type TuyChonMenuRobot } from './robotMenu';

const goc = (): TuyChonMenuRobot => ({
  trongApp: false,
  tiengAnh: false,
  phanTram: 100,
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
  it('cỡ ĐANG dùng được chấm dấu, và chỉ một mục', () => {
    // Chấm sai thì người dùng đổi cỡ xong mở lại menu thấy dấu ở chỗ khác, và
    // họ không còn tin cái menu nữa.
    const b = bangMenuRobot({ ...goc(), phanTram: 60 });
    const con = muc(b, 'Cỡ')?.submenu as { label: string; checked: boolean }[];
    expect(con).toHaveLength(MUC_CO.length);
    expect(con.filter((m) => m.checked).map((m) => m.label)).toEqual(['60%']);
  });

  it('cỡ lẻ bước 5 (85%) ⇒ có một dòng nói cỡ thật, không chấm bừa mục khác', () => {
    const con = muc(bangMenuRobot({ ...goc(), phanTram: 85 }), 'Cỡ')?.submenu as
      { label: string; checked: boolean; enabled?: boolean }[];
    expect(con.filter((m) => m.checked).map((m) => m.label)).toEqual(['85%']);
    expect(con[0]!.enabled).toBe(false);
  });

  it('menu cỡ đi trọn 20–100%', () => {
    expect(Math.min(...MUC_CO)).toBe(20);
    expect(Math.max(...MUC_CO)).toBe(100);
  });

  it('ô "dính mép" theo đúng thiết đặt', () => {
    expect(muc(bangMenuRobot({ ...goc(), bamMep: false }), 'Tự dính mép màn hình')?.checked)
      .toBe(false);
    expect(muc(bangMenuRobot(goc()), 'Tự dính mép màn hình')?.checked).toBe(true);
  });
});

describe('bấm thì gọi đúng việc', () => {
  it('chọn một mức cỡ ⇒ `datCo` nhận đúng SỐ %, không phải nhãn hay chỉ số', () => {
    const o = goc();
    const con = muc(bangMenuRobot(o), 'Cỡ')?.submenu as { label: string; click: () => void }[];
    con.find((m) => m.label === '30%')!.click();
    expect(o.datCo).toHaveBeenCalledWith(30);
  });

  it('con nổi có "Chỉnh vị trí & cỡ…" và "Về góc mặc định"; con trong app thì không', () => {
    const o = { ...goc(), chinh: vi.fn(), veMacDinh: vi.fn() };
    const b = bangMenuRobot(o);
    (muc(b, 'Chỉnh vị trí & cỡ…')!.click as () => void)();
    (muc(b, 'Về góc mặc định')!.click as () => void)();
    expect(o.chinh).toHaveBeenCalled();
    expect(o.veMacDinh).toHaveBeenCalled();
    const trong = bangMenuRobot({ ...o, trongApp: true });
    expect(muc(trong, 'Chỉnh vị trí & cỡ…')?.visible).toBe(false);
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

describe('menu theo ngôn ngữ', () => {
  it('⛔ đổi sang tiếng Anh thì MENU cũng phải đổi', () => {
    // Main không dùng được `useT()` của renderer. Bỏ qua chỗ này thì người dùng
    // đổi ngôn ngữ xong vẫn thấy một menu tiếng Việt — đúng kiểu "đổi rồi mà
    // một chỗ chưa đổi", và chỗ ấy lại là chỗ hay bấm nhất.
    const b = bangMenuRobot({ ...goc(), tiengAnh: true });
    expect(b.map((m) => m.label)).toContain('Open AI Chat');
    expect(muc(b, 'Snap to screen edge')).toBeTruthy();
    expect(muc(b, 'Turn off the floating robot')).toBeTruthy();
  });

  it('tiếng Việt giữ nguyên', () => {
    expect(muc(bangMenuRobot(goc()), 'Mở AI Chat')).toBeTruthy();
  });
});
