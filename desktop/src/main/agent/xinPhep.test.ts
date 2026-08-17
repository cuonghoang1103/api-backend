/**
 * Kiểm môi giới xin phép.
 *
 * Hai thứ ở đây không nhìn ra được bằng mắt trên màn hình:
 *  1. Nút "cho phép cả …" có THẬT SỰ nhớ không — nếu không, nó trông y hệt nút
 *     "cho phép", chỉ khác là lần sau lại hỏi. Đúng lỗi đã lọt vào P2.
 *  2. Lời hứa có được giải phóng ở CẢ BA đường thoát không — rò một đường thì
 *     vòng lặp treo vĩnh viễn, và app trông như chết chứ không báo gì.
 */
import { describe, expect, it, vi } from 'vitest';
import { daChoPhepCaFile, hoiNguoiDung, huyTatCa, soDangCho, traLoi, xoaQuyenDaCap } from './xinPhep';

/** Bắt lấy id mà môi giới phát ra, để trả lời đúng yêu cầu đó. */
function hoi(duongDan: string, opts: { choNho?: boolean } = {}) {
  let id = '';
  const signal = new AbortController().signal;
  const p = hoiNguoiDung(
    { ten: 'edit_file', duongDan, ...(opts.choNho === false ? { choNho: false } : {}) },
    (y) => { id = y.id; },
    signal,
  );
  return { p, layId: () => id };
}

describe('hoiNguoiDung — đường thoát', () => {
  it('người dùng đồng ý ⇒ lời hứa giải phóng, sổ chờ sạch', async () => {
    xoaQuyenDaCap(); huyTatCa();
    const { p, layId } = hoi('a.ts');
    expect(soDangCho()).toBe(1);
    expect(traLoi(layId(), 'choPhep')).toBe(true);
    await expect(p).resolves.toBe('choPhep');
    expect(soDangCho()).toBe(0);
  });

  it('người dùng bấm Dừng ⇒ coi như từ chối, KHÔNG treo', async () => {
    xoaQuyenDaCap(); huyTatCa();
    const dk = new AbortController();
    const p = hoiNguoiDung({ ten: 'edit_file', duongDan: 'b.ts' }, () => {}, dk.signal);
    dk.abort();
    await expect(p).resolves.toBe('tuChoi');
    expect(soDangCho()).toBe(0);
  });

  it('huyTatCa ⇒ mọi yêu cầu đang treo đều được giải phóng', async () => {
    xoaQuyenDaCap(); huyTatCa();
    const a = hoi('c.ts');
    const b = hoi('d.ts');
    expect(soDangCho()).toBe(2);
    huyTatCa();
    await expect(a.p).resolves.toBe('tuChoi');
    await expect(b.p).resolves.toBe('tuChoi');
    expect(soDangCho()).toBe(0);
  });

  it('hết giờ ⇒ tự từ chối', async () => {
    vi.useFakeTimers();
    xoaQuyenDaCap(); huyTatCa();
    const { p } = hoi('e.ts');
    vi.advanceTimersByTime(5 * 60_000 + 100);
    await expect(p).resolves.toBe('tuChoi');
    expect(soDangCho()).toBe(0);
    vi.useRealTimers();
  });

  it('trả lời một id không tồn tại ⇒ false, không nổ', () => {
    expect(traLoi('xp_khong_co', 'choPhep')).toBe(false);
  });
});

describe('hoiNguoiDung — GHI NHỚ (chỗ P2 từng hỏng)', () => {
  it('"cho phép cả file" ⇒ lần sau KHÔNG hỏi lại nữa', async () => {
    xoaQuyenDaCap(); huyTatCa();
    const lan1 = hoi('src/x.ts');
    traLoi(lan1.layId(), 'choPhepCaFile');
    await lan1.p;
    expect(daChoPhepCaFile('src/x.ts')).toBe(true);

    // Lần hai: không được phát thẻ nào, và phải tự giải quyết ngay.
    let daPhat = false;
    const lan2 = await hoiNguoiDung(
      { ten: 'edit_file', duongDan: 'src/x.ts' },
      () => { daPhat = true; },
      new AbortController().signal,
    );
    expect(lan2).toBe('choPhepCaFile');
    expect(daPhat).toBe(false);
  });

  it('nhớ file NÀY không làm file KHÁC được nhớ theo', async () => {
    xoaQuyenDaCap(); huyTatCa();
    const l = hoi('src/y.ts');
    traLoi(l.layId(), 'choPhepCaFile');
    await l.p;
    expect(daChoPhepCaFile('src/z.ts')).toBe(false);
  });

  it('choNho:false ⇒ vẫn CHO ĐI, nhưng KHÔNG nhớ (lệnh nguy hiểm)', async () => {
    xoaQuyenDaCap(); huyTatCa();
    const l = hoi('rm -rf build', { choNho: false });
    traLoi(l.layId(), 'choPhepCaFile');
    await expect(l.p).resolves.toBe('choPhepCaFile');
    expect(daChoPhepCaFile('rm -rf build')).toBe(false);
  });

  it('việc mới ⇒ quên sạch quyền đã cấp', async () => {
    xoaQuyenDaCap(); huyTatCa();
    const l = hoi('src/w.ts');
    traLoi(l.layId(), 'choPhepCaFile');
    await l.p;
    expect(daChoPhepCaFile('src/w.ts')).toBe(true);
    xoaQuyenDaCap();
    expect(daChoPhepCaFile('src/w.ts')).toBe(false);
  });
});
