/**
 * Bộ dựng BÀI NHỎ (luyện từng bài học) cho SWT301 — gọn, đồng nhất:
 *   tinhDe()   choice / order / table (tinh() + trường bắt buộc)
 *   kiemTuy()  một kiểm tuỳ ý: hàm TỰ CHỨA (đọc biến toàn cục của người học) trả 'OK' hoặc lời giải thích
 *   jsDe()     bài 'js' với các tệp trả lời (khoiDau/loiGiai từ cặp [đầu, giải])
 *   dotBienDe() bài VIẾT TEST bị chấm bằng mutant (lib/testkit.js + tệp tests.js)
 */
import { gon, tinh, TESTKIT_JS, kiemDotBien, tn } from './_chung.mjs';

/** Một kiểm tuỳ ý. fn: function () { … return 'OK' | 'giải thích' } — tự chứa, chỉ đọc biến của người học. */
export function kiemTuy(moTa, fn, ex = {}) {
  return {
    moTa,
    chuanBi: `const __KQ = (function () { try { return (${gon(fn)})(); } catch (e) { return (e && e.name === 'ReferenceError' ? 'missing: ' : 'error: ') + (e && e.message ? e.message : String(e)); } })();`,
    goi: '__KQ', mongDoi: 'OK', ...ex,
  };
}

const MAC_DINH_LOI = (vi) => vi;

/** Bài tĩnh: q = { tieuDe, doKho, phut, moTa:{en,vi}, loai, cauHoi|bang, goiY, loiHayGap, giaiThich, thuatNgu? } */
export function tinhDe(q) {
  const d = tinh(q);
  return { the: ['swt301'], ...d, dangBai: 'practice', thuatNgu: q.thuatNgu || [], loiHayGap: (q.loiHayGap || []).map(MAC_DINH_LOI) };
}

/**
 * Bài 'js': q = { …trường đề…, tep: { 'answer.js': [dau, giai] }, kiem: [...], thuVien?: ['testkit'] }
 * Tệp nạp theo thứ tự khai báo (thư viện trước).
 */
export function jsDe(q) {
  const { tep, kiem, ...rest } = q;
  const khoiDau = {}, loiGiai = {};
  for (const [ten, [dau, giai]] of Object.entries(tep)) { khoiDau[ten] = dau; loiGiai[ten] = giai; }
  return {
    the: ['swt301'],
    ngonNgu: 'javascript',
    dangBai: 'practice',
    ...rest,
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(tep), kiem },
    khoiDau, loiGiai,
  };
}

/**
 * Bài VIẾT TEST chấm bằng mutant. q = { …trường đề…, ten:['fn'], dung, dotBien, minTest, dauTest, giaiTest, sut?: 'mã khai báo lớp lỗi dùng chung' }
 */
export function dotBienDe(q) {
  const { ten, dung, dotBien, minTest = 4, dauTest, giaiTest, sut, ...rest } = q;
  const tep = { 'lib/testkit.js': [TESTKIT_JS, TESTKIT_JS] };
  if (sut) tep['lib/sut.js'] = [sut, sut];
  tep['tests.js'] = [dauTest, giaiTest];
  const order = ['tests.js', ...Object.keys(tep).filter((t) => t !== 'tests.js')];
  const d = jsDe({ ...rest, tep, kiem: kiemDotBien({ ten, dung, dotBien, minTest }) });
  // tệp mở trước trong editor = tests.js, nhưng thứ tự NẠP phải là thư viện trước
  d.khoiDau = Object.fromEntries(order.map((t) => [t, d.khoiDau[t]]));
  d.loiGiai = Object.fromEntries(order.map((t) => [t, d.loiGiai[t]]));
  return {
    khaiNiem: ['unit testing', 'mutation testing', 'assertion'],
    ...d,
    boYeu: [{ ten: 'chỉ bộ test khởi đầu', tep: { 'tests.js': dauTest } }, ...(q.boYeu || [])],
  };
}

/** Thuật ngữ chung cho bài viết test. */
export const TN_TEST = () => tn('mutant', 'kill', 'assertion', 'aaa', 'parameterized', 'expected');

/** Chuỗi JS cho mảng/đối tượng đáp án mẫu (dùng khi viết tệp khởi đầu/lời giải). */
export const viDuMot = (input, output, explanation) => ({ input, output, explanation });
