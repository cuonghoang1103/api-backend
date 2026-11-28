/**
 * MAE101 · Lab Ma trận (Ch5–7) — viết hàm chạy thật: định thức bằng khử Gauss, giải Ax = b bằng khử Gauss có chọn trụ.
 * Kết quả làm tròn 6 chữ số để không vướng sai số dấu phẩy động; mongDoi do hàm tham chiếu tính (jsDe).
 */
import { doiDau, KHOA, bi, jsDe, dat } from './_mae.mjs';

function determinant(A) {
  // Khử về tam giác trên (chọn trụ có |giá trị| lớn nhất); đổi hàng ⇒ đổi dấu; det = tích đường chéo.
  var n = A.length, M = A.map(function (r) { return r.slice(); }), det = 1;
  for (var c = 0; c < n; c++) {
    var p = c;
    for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return 0;
    if (p !== c) { var t = M[p]; M[p] = M[c]; M[c] = t; det = -det; }
    det *= M[c][c];
    for (var r2 = c + 1; r2 < n; r2++) {
      var f = M[r2][c] / M[c][c];
      for (var k = c; k < n; k++) M[r2][k] -= f * M[c][k];
    }
  }
  var out = Math.round(det * 1e6) / 1e6;
  return out === 0 ? 0 : out;
}
const L1 = jsDe({
  tieuDe: 'Matrix lab 1 — Determinant by elimination',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Write <code>determinant(A)</code> for a square matrix (array of rows, n ≤ 6) using Gaussian elimination: reduce to upper-triangular form, flip the sign at every row swap, and multiply the diagonal. Do not modify A. Round to 6 decimals with <code>Math.round(d * 1e6) / 1e6</code>; a singular matrix returns 0.</p>', '<p>Viết <code>determinant(A)</code> cho ma trận vuông (mảng các hàng, n ≤ 6) bằng khử Gauss: đưa về tam giác trên, đổi dấu mỗi lần đổi hàng, rồi nhân đường chéo. Không sửa A. Làm tròn 6 chữ số bằng <code>Math.round(d * 1e6) / 1e6</code>; ma trận suy biến trả 0.</p>'),
  yeuCau: [bi('Cofactor expansion is O(n!); elimination is O(n³).', 'Khai triển phần bù là O(n!); khử Gauss là O(n³).')],
  viDu: [{ input: 'determinant([[2, 1, 3], [0, -1, 4], [1, 2, 0]])', output: String(determinant([[2, 1, 3], [0, -1, 4], [1, 2, 0]])), explanation: 'Same matrix as exercise 7.1: −9.|||Cùng ma trận với bài 7.1: −9.' }],
  goiY: ['Copy the rows before eliminating.', 'Track the sign of every swap.'],
  loiHayGap: ['Forgetting the sign flip on a row swap.', 'Dividing by a zero pivot instead of swapping.'],
  giaiThich: '<p>Adding a multiple of one row to another leaves det unchanged and a swap negates it, so after elimination det A = ± (product of the pivots) — the property table of lesson 7.1 turned into an algorithm.</p>',
  khaiNiem: ['determinant', 'elimination'],
  fn: 'determinant',
  dau: 'function determinant(A) {\n  return 0;\n}\n',
  giaiMa: dat(determinant, 'determinant'),
  ref: determinant,
  cases: [{ args: [[[3, 8], [4, 6]]] }, { args: [[[2, 1, 3], [0, -1, 4], [1, 2, 0]]] }, { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]] }, { args: [[[0, 1], [1, 0]]], an: true }, { args: [[[2, 0, 1, 3], [1, 1, 0, 2], [0, 3, 1, 1], [4, 1, 2, 0]]], an: true }],
});

function solveLinear(A, b) {
  // Khử Gauss có chọn trụ trên [A | b]; trụ ≈ 0 ⇒ hệ không có nghiệm duy nhất ⇒ null; rồi thế ngược.
  var n = A.length, M = A.map(function (r, i) { return r.concat([b[i]]); });
  for (var c = 0; c < n; c++) {
    var p = c;
    for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null;
    var t = M[p]; M[p] = M[c]; M[c] = t;
    for (var r2 = c + 1; r2 < n; r2++) {
      var f = M[r2][c] / M[c][c];
      for (var k = c; k <= n; k++) M[r2][k] -= f * M[c][k];
    }
  }
  var x = new Array(n);
  for (var i = n - 1; i >= 0; i--) {
    var s = M[i][n];
    for (var j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x.map(function (v) { var o = Math.round(v * 1e6) / 1e6; return o === 0 ? 0 : o; });
}
const L2 = jsDe({
  tieuDe: 'Matrix lab 2 — Solve Ax = b',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>solveLinear(A, b)</code>: solve the n × n system Ax = b by Gaussian elimination with partial pivoting and back-substitution. Return the solution as an array rounded to 6 decimals, or <code>null</code> if A is singular (no unique solution). Do not modify the inputs.</p>', '<p>Viết <code>solveLinear(A, b)</code>: giải hệ n × n Ax = b bằng khử Gauss có chọn trụ và thế ngược. Trả nghiệm dạng mảng làm tròn 6 chữ số, hoặc <code>null</code> nếu A suy biến (không có nghiệm duy nhất). Không sửa đầu vào.</p>'),
  yeuCau: [bi('Partial pivoting: pick the row with the largest |entry| in the current column.', 'Chọn trụ: lấy hàng có |phần tử| lớn nhất ở cột đang xét.')],
  viDu: [{ input: 'solveLinear([[1, 2], [3, -1]], [5, 1])', output: JSON.stringify(solveLinear([[1, 2], [3, -1]], [5, 1])), explanation: 'The system of lesson 5.1: x = 1, y = 2.|||Hệ của bài 5.1: x = 1, y = 2.' }],
  goiY: ['Work on the augmented matrix.', 'Back-substitute from the last row up.'],
  loiHayGap: ['Not swapping when the pivot is 0.', 'Forgetting to eliminate in the b column.'],
  giaiThich: '<p>Elimination makes the system upper-triangular without changing its solutions (elementary row operations), so the last equation has one unknown, the one above it two, and so on. A pivot that cannot be made non-zero means rank &lt; n.</p>',
  khaiNiem: ['Gaussian elimination', 'back substitution'],
  fn: 'solveLinear',
  dau: 'function solveLinear(A, b) {\n  return null;\n}\n',
  giaiMa: dat(solveLinear, 'solveLinear'),
  ref: solveLinear,
  cases: [{ args: [[[1, 2], [3, -1]], [5, 1]] }, { args: [[[0, 1], [1, 0]], [3, 4]] }, { args: [[[1, 2], [2, 4]], [3, 6]] }, { args: [[[2, 1, -1], [-3, -1, 2], [-2, 1, 2]], [8, -11, -3]], an: true }, { args: [[[4, -2, 1], [-2, 4, -2], [1, -2, 4]], [11, -16, 17]], an: true }],
});

export default doiDau({
  slug: 'mae101-7-lab-ma-tran',
  ten: 'Lab 7 Matrices in code: determinant and Ax = b',
  khoa: KHOA,
  baiHoc: 'mae101-7-1-dinh-thuc-nghich-dao',
  de: [L1, L2],
});
