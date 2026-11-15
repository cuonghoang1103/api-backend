/** Hàm riêng của Chương 4 (đề xuất đưa vào _chung.mjs: xem _tien-do/ch04.md). */
import { oMang, bangVet } from '../_chung.mjs';

/**
 * Bảng vết của khuôn firstTrue trên một mảng: mỗi dòng = một vòng, hàng ô có thêm một ô "·" ở chỉ số n (hi = n nằm
 * NGOÀI mảng — chỗ người học hay lệch một). Tô: [lo, hi) xanh lá, mid cam; nhãn lo/mid/hi trên ô.
 * vet = kết quả vetFirstTrue(); giaTri = hàm in giá trị ở mid (mặc định A[mid]); hanhDong = chữ cho cột cuối.
 */
export function bangFirstTrue(A, vet, { cotGt = 'a[mid]', giaTri = (m) => String(A[m]), coLinh = true } = {}) {
  const O = coLinh ? [...A, '·'] : A;
  const nhanCua = (lo, mid, hi) => {
    const n = {};
    const them = (i, s) => { if (i < O.length) n[i] = n[i] ? `${n[i]},${s}` : s; };
    them(lo, 'lo'); if (mid !== null) them(mid, 'mid'); them(hi, 'hi');
    return n;
  };
  const hang = vet.hang.map((h) => [
    String(h.vong),
    oMang(O, { tu: h.lo, den: h.hi - 1, to: { [h.mid]: 'r' }, nhan: nhanCua(h.lo, h.mid, h.hi), chiSo: true }),
    giaTri(h.mid),
    h.t ? 'T ⇒ hi = mid' : 'F ⇒ lo = mid + 1',
    `[${h.loMoi}, ${h.hiMoi})`,
  ]);
  const kq = vet.ketQua;
  hang.push(['end', oMang(O, { to: kq < A.length ? { [kq]: 'ok' } : {}, nhan: nhanCua(kq, null, kq), chiSo: true }), '', 'lo == hi', `⇒ ${kq}`]);
  return bangVet(['round', '[lo, hi) · mid', cotGt, 'ok(mid)', 'next [lo, hi)'], hang);
}
