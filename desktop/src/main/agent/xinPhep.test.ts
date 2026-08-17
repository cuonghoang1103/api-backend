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
import { daChoPhepCaFile, hoiNguoiDung, huyTatCa, soDangCho, taoSoNho, traLoi } from './xinPhep';

/** Bắt lấy id mà môi giới phát ra, để trả lời đúng yêu cầu đó. */
/** Sổ nhớ dùng chung cho các phép kiểm — đóng vai "một cuộc hội thoại". */
let so = taoSoNho();

function hoi(duongDan: string, opts: { choNho?: boolean } = {}) {
  let id = '';
  const signal = new AbortController().signal;
  const p = hoiNguoiDung(
    { ten: 'edit_file', duongDan, ...(opts.choNho === false ? { choNho: false } : {}) },
    (y) => { id = y.id; },
    signal,
    so,
  );
  return { p, layId: () => id };
}

/** Bắt đầu một cuộc mới = sổ mới. Thay cho `xoaQuyenDaCap()` cũ. */
function cuocMoi(): void { so = taoSoNho(); huyTatCa(); }

describe('hoiNguoiDung — đường thoát', () => {
  it('người dùng đồng ý ⇒ lời hứa giải phóng, sổ chờ sạch', async () => {
    cuocMoi();
    const { p, layId } = hoi('a.ts');
    expect(soDangCho()).toBe(1);
    expect(traLoi(layId(), 'choPhep')).toBe(true);
    await expect(p).resolves.toBe('choPhep');
    expect(soDangCho()).toBe(0);
  });

  it('người dùng bấm Dừng ⇒ coi như từ chối, KHÔNG treo', async () => {
    cuocMoi();
    const dk = new AbortController();
    const p = hoiNguoiDung({ ten: 'edit_file', duongDan: 'b.ts' }, () => {}, dk.signal, so);
    dk.abort();
    await expect(p).resolves.toBe('tuChoi');
    expect(soDangCho()).toBe(0);
  });

  it('huyTatCa ⇒ mọi yêu cầu đang treo đều được giải phóng', async () => {
    cuocMoi();
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
    cuocMoi();
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
    cuocMoi();
    const lan1 = hoi('src/x.ts');
    traLoi(lan1.layId(), 'choPhepCaFile');
    await lan1.p;
    expect(daChoPhepCaFile(so, 'src/x.ts')).toBe(true);

    // Lần hai: không được phát thẻ nào, và phải tự giải quyết ngay.
    let daPhat = false;
    const lan2 = await hoiNguoiDung(
      { ten: 'edit_file', duongDan: 'src/x.ts' },
      () => { daPhat = true; },
      new AbortController().signal,
      so,
    );
    expect(lan2).toBe('choPhepCaFile');
    expect(daPhat).toBe(false);
  });

  it('nhớ file NÀY không làm file KHÁC được nhớ theo', async () => {
    cuocMoi();
    const l = hoi('src/y.ts');
    traLoi(l.layId(), 'choPhepCaFile');
    await l.p;
    expect(daChoPhepCaFile(so, 'src/z.ts')).toBe(false);
  });

  it('choNho:false ⇒ vẫn CHO ĐI, nhưng KHÔNG nhớ (lệnh nguy hiểm)', async () => {
    cuocMoi();
    const l = hoi('rm -rf build', { choNho: false });
    traLoi(l.layId(), 'choPhepCaFile');
    await expect(l.p).resolves.toBe('choPhepCaFile');
    expect(daChoPhepCaFile(so, 'rm -rf build')).toBe(false);
  });

  it('CUỘC KHÁC có sổ riêng — quyền không rò sang tab bên cạnh', async () => {
    cuocMoi();
    const l = hoi('src/chung.ts');
    traLoi(l.layId(), 'choPhepCaFile');
    await l.p;
    const soKhac = taoSoNho();
    expect(daChoPhepCaFile(so, 'src/chung.ts')).toBe(true);
    expect(daChoPhepCaFile(soKhac, 'src/chung.ts')).toBe(false);
  });

  it('việc mới ⇒ quên sạch quyền đã cấp', async () => {
    cuocMoi();
    const l = hoi('src/w.ts');
    traLoi(l.layId(), 'choPhepCaFile');
    await l.p;
    expect(daChoPhepCaFile(so, 'src/w.ts')).toBe(true);
    cuocMoi();
    expect(daChoPhepCaFile(so, 'src/w.ts')).toBe(false);
  });
});
