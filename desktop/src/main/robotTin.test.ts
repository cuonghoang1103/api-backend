/**
 * Kiểm nguồn tin của robot nổi.
 *
 * Ba hành vi ở đây đều là loại "sai thì không có lỗi nào để thấy, chỉ có người
 * dùng khó chịu": báo nhầm lúc mở app, lải nhải mỗi 25 giây, hoặc câm hẳn vì
 * đọc nhầm tên trường JSON. Nên chúng phải được kiểm bằng phản hồi THẬT của
 * máy chủ, không phải bằng đọc mã.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const daBao: Array<{ kenh: string; du: unknown }> = [];
let dangNhin = false;
let phien: { sessionToken: string } | null = { sessionToken: 'tok' };

vi.mock('./robotNoi', () => ({
  baoRobot: (kenh: string, du: unknown) => { daBao.push({ kenh, du }); },
  robotDangMo: () => true,
  cuaSoChinh: () => ({
    isMinimized: () => false,
    isVisible: () => true,
    isFocused: () => dangNhin,
  }),
}));
vi.mock('./ipc/auth', () => ({ readStoredSession: () => phien }));
vi.mock('./config', () => ({ API_ORIGIN: 'http://may-chu-gia' }));

const { _motVongChoKiemThu, baoNhac, dungTheoDoiTin } = await import('./robotTin');

/** Lấy bong bóng thứ `i`, kèm khẳng định là nó tồn tại. */
function bong(i = 0): { loai: string; chu: string } {
  const b = daBao[i];
  expect(b, `không có bong bóng thứ ${i}`).toBeDefined();
  return b!.du as { loai: string; chu: string };
}

/** Giả máy chủ: tin nhắn trả `count`, thông báo trả `unreadCount`. */
function datSo(tinNhan: number, thongBao: number): void {
  vi.stubGlobal('fetch', vi.fn(async (u: string) => ({
    ok: true,
    json: async () => u.includes('/messages/')
      ? { success: true, data: { count: tinNhan } }
      : { success: true, data: { unreadCount: thongBao } },
  })));
}

beforeEach(() => {
  daBao.length = 0;
  dangNhin = false;
  phien = { sessionToken: 'tok' };
  // `mocTruoc` là biến cấp MODULE — không xoá thì ca sau thừa hưởng mốc của ca
  // trước và "đứng yên ở 5" hoá ra là "tăng từ 3 lên 5".
  dungTheoDoiTin();
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('robotTin', () => {
  it('lần hỏi ĐẦU chỉ lấy mốc, không báo gì', async () => {
    datSo(7, 3);
    await _motVongChoKiemThu();
    expect(daBao).toEqual([]); // 7 tin cũ KHÔNG được nổ thành thông báo lúc mở app
  });

  it('báo khi số TĂNG, và báo đúng phần tăng thêm', async () => {
    datSo(7, 3);
    await _motVongChoKiemThu();
    datSo(9, 3);
    await _motVongChoKiemThu();
    expect(daBao).toHaveLength(1);
    expect(bong().loai).toBe('tin-nhan');
    expect(bong().chu).toContain('2'); // 2 mới, không phải 9
  });

  it('KHÔNG lải nhải khi số đứng yên dù đang > 0', async () => {
    datSo(5, 5);
    await _motVongChoKiemThu();
    await _motVongChoKiemThu();
    await _motVongChoKiemThu();
    expect(daBao).toEqual([]);
  });

  it('số GIẢM (đọc bớt) cũng không báo', async () => {
    datSo(5, 0);
    await _motVongChoKiemThu();
    datSo(1, 0);
    await _motVongChoKiemThu();
    expect(daBao).toEqual([]);
  });

  it('đọc ĐÚNG tên trường của từng endpoint (count vs unreadCount)', async () => {
    datSo(0, 0);
    await _motVongChoKiemThu();
    datSo(0, 4);
    await _motVongChoKiemThu();
    // Đọc nhầm khoá thì `undefined` → không bao giờ tăng → câm lặng vĩnh viễn.
    expect(daBao).toHaveLength(1);
    expect(bong().loai).toBe('thong-bao');
  });

  it('im khi người dùng đang nhìn cửa sổ chính', async () => {
    datSo(0, 0);
    await _motVongChoKiemThu();
    dangNhin = true;
    datSo(3, 3);
    await _motVongChoKiemThu();
    expect(daBao).toEqual([]);
  });

  it('nhưng VẪN cập nhật mốc lúc đang nhìn — quay đi không bị dồn tin cũ', async () => {
    datSo(0, 0);
    await _motVongChoKiemThu();
    dangNhin = true;
    datSo(3, 0);
    await _motVongChoKiemThu();
    dangNhin = false;
    await _motVongChoKiemThu(); // vẫn 3, không có gì mới kể từ mốc
    expect(daBao).toEqual([]);
  });

  it('mất mạng: giữ nguyên mốc, không báo, không vỡ', async () => {
    datSo(2, 0);
    await _motVongChoKiemThu();
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ECONNREFUSED'); }));
    await _motVongChoKiemThu();
    datSo(2, 0);
    await _motVongChoKiemThu();
    expect(daBao).toEqual([]); // mốc không bị đặt lại thành 0 rồi "tăng" lên 2
  });

  it('đăng xuất ⇒ quên mốc, đăng nhập lại không nổ dồn', async () => {
    datSo(2, 0);
    await _motVongChoKiemThu();
    phien = null;
    await _motVongChoKiemThu();
    phien = { sessionToken: 'tok2' };
    datSo(50, 0); // tài khoản khác, 50 tin cũ
    await _motVongChoKiemThu();
    expect(daBao).toEqual([]);
  });

  it('nhạc: báo khi ở app khác, im khi đang nhìn app', () => {
    dangNhin = false;
    baoNhac('Bài A');
    dangNhin = true;
    baoNhac('Bài B');
    expect(daBao).toHaveLength(1);
    expect(bong().chu).toContain('Bài A');
  });
});
