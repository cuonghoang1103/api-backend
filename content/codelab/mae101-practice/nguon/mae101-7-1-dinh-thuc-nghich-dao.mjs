/** MAE101 · 7.1 — Determinants and inverses (bài mae101-7-1-dinh-thuc-nghich-dao). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Determinants 1 — Properties',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on determinants and invertibility.</p>', '<p>Câu hỏi khái niệm về định thức và tính khả nghịch.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A square matrix A is invertible exactly when …', 'Ma trận vuông A khả nghịch đúng khi …'], ['det A ≠ 0', 'det A = 0', 'A has no zero entry', 'A is symmetric'], ['det A = 0 means the columns are dependent and Ax = 0 has non-zero solutions.', 'det A = 0 nghĩa là các cột phụ thuộc và Ax = 0 có nghiệm khác 0.']),
    q('c2', ['Swapping two rows of A changes det A by …', 'Đổi chỗ hai hàng của A làm det A …'], ['a factor −1', 'nothing', 'a factor 2', 'setting it to 0'], ['Adding a multiple of a row changes nothing; scaling a row by k multiplies det by k; a swap flips the sign.', 'Cộng bội của một hàng không đổi gì; nhân một hàng với k thì det nhân k; đổi chỗ thì đổi dấu.']),
    q('c3', ['det(AB) = …', 'det(AB) = …'], ['det A · det B', 'det A + det B', 'det A − det B', 'det(A + B)'], ['The determinant is multiplicative; in general det(A + B) ≠ det A + det B.', 'Định thức có tính nhân; nói chung det(A + B) ≠ det A + det B.']),
    q('c4', ['A is 3 × 3 with det A = 2. det(2A) = …', 'A cỡ 3 × 3 với det A = 2. det(2A) = …'], ['16', '4', '8', '6'], ['Each of the 3 rows is scaled by 2: 2³ · 2 = 16.', 'Cả 3 hàng đều nhân 2: 2³ · 2 = 16.']),
    q('c5', ['For A = [a b; c d] with ad − bc ≠ 0, A⁻¹ = …', 'Với A = [a b; c d] và ad − bc ≠ 0, A⁻¹ = …'], ['(1/(ad − bc))·[d −b; −c a]', '(1/(ad − bc))·[a b; c d]', '[1/a 1/b; 1/c 1/d]', '(ad − bc)·[d −b; −c a]'], ['Swap the diagonal, negate the off-diagonal, divide by the determinant.', 'Đổi chỗ đường chéo chính, đổi dấu đường chéo phụ, chia cho định thức.']),
  ],
  goiY: ['Row swaps flip the sign; scaling scales.', 'det(kA) = kⁿ det A for n × n.'],
  loiHayGap: ['det(2A) = 2·det A for a 3 × 3.', 'Inverting entry by entry.'],
  thuatNgu: [tn('determinant', 'định thức'), tn('invertible', 'khả nghịch'), tn('cofactor', 'phần bù đại số')],
  khaiNiem: ['determinant properties'],
});

// Định thức do MÃ tính (khai triển cofactor), không tính tay.
function det(m) {
  if (m.length === 1) return m[0][0];
  let s = 0;
  for (let j = 0; j < m.length; j++) {
    const minor = m.slice(1).map((r) => r.filter((_, k) => k !== j));
    s += (j % 2 ? -1 : 1) * m[0][j] * det(minor);
  }
  return s;
}
const hien = (m) => '[' + m.map((r) => r.join(' ')).join('; ').replace(/-/g, '−') + ']';
const DS = [[[3, 8], [4, 6]], [[2, 0, 0], [0, 3, 0], [0, 0, 4]], [[1, 2, 3], [0, 4, 5], [0, 0, 6]], [[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[2, 1, 3], [0, -1, 4], [1, 2, 0]]];
const A = [[4, 7], [2, 6]];
const dA = det(A);
const INV = [[A[1][1] / dA, -A[0][1] / dA], [-A[1][0] / dA, A[0][0] / dA]];
const E2 = tinh({
  tieuDe: 'Determinants 2 — Compute det and a 2 × 2 inverse',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p><b>Part A.</b> Compute each determinant (rows separated by ";"). <b>Part B.</b> Give the entries of A⁻¹ for A = [4 7; 2 6] as decimals.</p>', '<p><b>Phần A.</b> Tính mỗi định thức (các hàng cách nhau bằng ";"). <b>Phần B.</b> Cho các phần tử của A⁻¹ với A = [4 7; 2 6] dưới dạng số thập phân.</p>'),
  loai: 'table',
  bang: [
    bang1('b1', ['Determinants', 'Định thức'], [{ ma: 'm', ten: 'Matrix' }, { ma: 'd', ten: 'det' }],
      DS.map((m) => ({ o: { m: hien(m) }, a: { d: so(det(m)) } })),
      [DS.map((m) => `det ${hien(m)} = ${det(m)}`).join('; ') + '. Triangular or diagonal ⇒ product of the diagonal; in [1 2 3; 4 5 6; 7 8 9] row 3 − row 2 = row 2 − row 1, so the rows are dependent and det = 0.', DS.map((m) => `det ${hien(m)} = ${det(m)}`).join('; ') + '. Tam giác hoặc chéo ⇒ tích đường chéo; ở [1 2 3; 4 5 6; 7 8 9] hàng 3 − hàng 2 = hàng 2 − hàng 1, các hàng phụ thuộc nên det = 0.']),
    bang1('b2', ['Inverse of A = [4 7; 2 6]', 'Nghịch đảo của A = [4 7; 2 6]'], [{ ma: 'r', ten: 'Row' }, { ma: 'x', ten: 'column 1' }, { ma: 'y', ten: 'column 2' }],
      INV.map((r, i) => ({ o: { r: 'row ' + (i + 1) }, a: { x: so(r[0]), y: so(r[1]) } })),
      [`det A = 4·6 − 7·2 = ${dA}; A⁻¹ = (1/${dA})·[6 −7; −2 4] = [${INV[0].join(' ')}; ${INV[1].join(' ')}]. Check: A·A⁻¹ = I.`, `det A = 4·6 − 7·2 = ${dA}; A⁻¹ = (1/${dA})·[6 −7; −2 4] = [${INV[0].join(' ')}; ${INV[1].join(' ')}]. Kiểm: A·A⁻¹ = I.`]),
  ],
  goiY: ['Triangular ⇒ product of the diagonal.', 'Expand along the row or column with the most zeros.'],
  loiHayGap: ['Forgetting the alternating signs in cofactor expansion.', 'Computing ad + bc.'],
  thuatNgu: [],
  khaiNiem: ['computing determinants'],
});

export default doiDau({
  slug: 'mae101-7-1-dinh-thuc-nghich-dao',
  ten: '7.1 Determinants & inverses',
  khoa: KHOA,
  baiHoc: 'mae101-7-1-dinh-thuc-nghich-dao',
  de: [E1, E2],
});
