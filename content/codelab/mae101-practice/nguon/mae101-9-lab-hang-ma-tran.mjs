/**
 * MAE101 · Lab Không gian vector (Ch8–9) — viết hàm chạy thật: hạng ma trận, kiểm độc lập tuyến tính, rank–nullity.
 * mongDoi do hàm tham chiếu tính (jsDe).
 */
import { doiDau, KHOA, bi, jsDe, dat } from './_mae.mjs';

function matrixRank(A) {
  // Khử Gauss có chọn trụ; đếm số trụ (|trụ| > 1e-9). Không sửa A.
  var M = A.map(function (r) { return r.slice(); }), rows = M.length, cols = rows ? M[0].length : 0, r = 0;
  for (var c = 0; c < cols && r < rows; c++) {
    var p = r;
    for (var i = r + 1; i < rows; i++) if (Math.abs(M[i][c]) > Math.abs(M[p][c])) p = i;
    if (Math.abs(M[p][c]) < 1e-9) continue;
    var t = M[p]; M[p] = M[r]; M[r] = t;
    for (var i2 = r + 1; i2 < rows; i2++) {
      var f = M[i2][c] / M[r][c];
      for (var k = c; k < cols; k++) M[i2][k] -= f * M[r][k];
    }
    r++;
  }
  return r;
}
const L1 = jsDe({
  tieuDe: 'Vector space lab 1 — The rank of a matrix',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Write <code>matrixRank(A)</code> for an m × n matrix (array of rows; it may be non-square, and m may be 0). Reduce it to echelon form with partial pivoting and count the pivots, treating |value| &lt; 1e-9 as zero. Do not modify A.</p>', '<p>Viết <code>matrixRank(A)</code> cho ma trận m × n (mảng các hàng; có thể không vuông, m có thể bằng 0). Đưa về dạng bậc thang có chọn trụ và đếm số trụ, coi |giá trị| &lt; 1e-9 là 0. Không sửa A.</p>'),
  yeuCau: [bi('A column with no usable pivot is skipped; the row counter does not advance.', 'Cột không có trụ dùng được thì bỏ qua; bộ đếm hàng không tăng.')],
  viDu: [{ input: 'matrixRank([[1, 2, 3], [2, 4, 6]])', output: String(matrixRank([[1, 2, 3], [2, 4, 6]])), explanation: 'Row 2 is twice row 1.|||Hàng 2 gấp đôi hàng 1.' }],
  goiY: ['Advance the column every step, the row only when a pivot is found.', 'Compare with a tolerance, not with === 0.'],
  loiHayGap: ['Advancing the row when the column had no pivot.', 'Comparing floating values with === 0.'],
  giaiThich: '<p>Row operations do not change the row space, so the number of non-zero rows of an echelon form — the number of pivots — is the rank (lesson 5.1 and 9.1).</p>',
  khaiNiem: ['rank'],
  fn: 'matrixRank',
  dau: 'function matrixRank(A) {\n  return A.length;\n}\n',
  giaiMa: dat(matrixRank, 'matrixRank'),
  ref: matrixRank,
  cases: [{ args: [[[1, 2, 3], [2, 4, 6]]] }, { args: [[[1, 0, 1], [0, 1, 1], [1, 1, 2]]] }, { args: [[]] }, { args: [[[0, 0], [0, 0]]], an: true }, { args: [[[1, 2, 0, 1], [2, 4, 1, 3], [3, 6, 1, 4]]], an: true }, { args: [[[0, 1, 2], [1, 2, 3], [2, 3, 5]]], an: true }],
});

function isIndependent(vectors) {
  // Đặt các vector làm CỘT; độc lập ⟺ hạng = số vector.
  if (vectors.length === 0) return true;
  var dim = vectors[0].length, k = vectors.length;
  if (k > dim) return false;
  var M = [];
  for (var i = 0; i < dim; i++) { var row = []; for (var j = 0; j < k; j++) row.push(vectors[j][i]); M.push(row); }
  var r = 0;
  for (var c = 0; c < k && r < dim; c++) {
    var p = r;
    for (var i2 = r + 1; i2 < dim; i2++) if (Math.abs(M[i2][c]) > Math.abs(M[p][c])) p = i2;
    if (Math.abs(M[p][c]) < 1e-9) continue;
    var t = M[p]; M[p] = M[r]; M[r] = t;
    for (var i3 = r + 1; i3 < dim; i3++) { var f = M[i3][c] / M[r][c]; for (var q = c; q < k; q++) M[i3][q] -= f * M[r][q]; }
    r++;
  }
  return r === k;
}
const L2 = jsDe({
  tieuDe: 'Vector space lab 2 — Are these vectors independent?',
  doKho: 'HARD', phut: 15,
  moTa: bi('<p>Write <code>isIndependent(vectors)</code>: <code>vectors</code> is an array of k vectors of the same length n. Return <code>true</code> when they are linearly independent. The empty set is independent; more vectors than the dimension (k &gt; n) can never be.</p>', '<p>Viết <code>isIndependent(vectors)</code>: <code>vectors</code> là mảng k vector cùng độ dài n. Trả <code>true</code> khi chúng độc lập tuyến tính. Tập rỗng là độc lập; nhiều vector hơn số chiều (k &gt; n) thì không bao giờ độc lập.</p>'),
  yeuCau: [bi('Put the vectors as COLUMNS and compare the rank with k.', 'Đặt các vector làm CỘT và so hạng với k.')],
  viDu: [{ input: 'isIndependent([[1, 0, 1], [0, 1, 1], [1, 1, 2]])', output: String(isIndependent([[1, 0, 1], [0, 1, 1], [1, 1, 2]])), explanation: 'The third is the sum of the first two.|||Vector thứ ba là tổng hai vector đầu.' }],
  goiY: ['k > n ⇒ false immediately.', 'Reuse the rank algorithm of lab 1.'],
  loiHayGap: ['Only checking whether one vector is a multiple of another.', 'Forgetting that a zero vector makes the set dependent.'],
  giaiThich: '<p>c₁v₁ + … + cₖvₖ = 0 has only the trivial solution exactly when the matrix [v₁ … vₖ] has a pivot in every column, i.e. rank = k; by rank–nullity the nullity is then 0.</p>',
  khaiNiem: ['linear independence', 'rank–nullity'],
  fn: 'isIndependent',
  dau: 'function isIndependent(vectors) {\n  return true;\n}\n',
  giaiMa: dat(isIndependent, 'isIndependent'),
  ref: isIndependent,
  cases: [{ args: [[[1, 0, 1], [0, 1, 1], [1, 1, 2]]] }, { args: [[[1, 0], [1, 1]]] }, { args: [[[1, 2], [2, 4]]] }, { args: [[[1, 0], [0, 1], [1, 1]]], an: true }, { args: [[[0, 0, 0], [1, 2, 3]]], an: true }, { args: [[]], an: true }],
});

export default doiDau({
  slug: 'mae101-9-lab-hang-ma-tran',
  ten: 'Lab 9 Rank and independence in code',
  khoa: KHOA,
  baiHoc: 'mae101-9-1-co-so-so-chieu',
  de: [L1, L2],
});
