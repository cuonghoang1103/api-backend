/** MAE101 · 5.1 — Gaussian elimination, echelon forms, number of solutions, rank (bài mae101-5-1-khu-gauss). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so, ord } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Linear systems 1 — Row operations and solution count',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on Gaussian elimination.</p>', '<p>Câu hỏi khái niệm về khử Gauss.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Which is NOT an elementary row operation?', 'Phép nào KHÔNG phải phép biến đổi sơ cấp trên hàng?'], ['multiplying a row by 0', 'swapping two rows', 'adding 3 times one row to another', 'multiplying a row by −2'], ['Scaling must use a NON-ZERO constant, otherwise information is lost and the solution set changes.', 'Nhân một hàng phải với hằng số KHÁC 0, nếu không sẽ mất thông tin và tập nghiệm thay đổi.']),
    q('c2', ['An echelon form contains the row [0 0 0 | 5]. The system has …', 'Dạng bậc thang có hàng [0 0 0 | 5]. Hệ có …'], ['no solution', 'a unique solution', 'infinitely many solutions', 'exactly 5 solutions'], ['That row reads 0 = 5 — inconsistent.', 'Hàng đó đọc là 0 = 5 — hệ vô nghiệm.']),
    q('c3', ['A consistent system has 3 unknowns and only 2 pivots. It has …', 'Một hệ có nghiệm, 3 ẩn và chỉ 2 pivot. Nó có …'], ['infinitely many solutions (one free variable)', 'a unique solution, since it is consistent', 'no solution, since a pivot is missing', 'exactly 2 solutions, one per pivot'], ['Unknowns − pivots = 1 free variable, which can take any value.', 'Số ẩn − số pivot = 1 biến tự do, nhận giá trị bất kỳ.']),
    q('c4', ['The rank of a matrix is …', 'Hạng của một ma trận là …'], ['the number of pivots (non-zero rows) in an echelon form', 'the number of rows of the original matrix', 'the largest entry after elimination', 'the number of zero rows in an echelon form'], ['Rouché–Capelli: Ax = b is consistent iff rank A = rank [A | b].', 'Rouché–Capelli: Ax = b có nghiệm khi và chỉ khi hạng A = hạng [A | b].']),
    q('c5', ['In RREF every pivot is …', 'Trong dạng bậc thang rút gọn, mỗi pivot …'], ['1, with zeros above and below it', 'any non-zero number', 'on the last column', 'followed by a zero row'], ['RREF lets you read the solution off directly.', 'Dạng rút gọn cho đọc nghiệm trực tiếp.']),
  ],
  goiY: ['Read the last non-zero row carefully.', 'Count pivots versus unknowns.'],
  loiHayGap: ['Treating a zero row [0 0 0 | 0] as "no solution".', 'Scaling a row by 0.'],
  thuatNgu: [tn('augmented matrix', 'ma trận mở rộng'), tn('pivot', 'phần tử trụ (pivot)'), tn('row echelon form', 'dạng bậc thang'), tn('rank', 'hạng')],
  khaiNiem: ['Gaussian elimination'],
});

const E2 = tinh({
  tieuDe: 'Linear systems 2 — Solve and classify',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p><b>Part A.</b> Solve each system (unique solution). <b>Part B.</b> For each augmented matrix (already in echelon form) give the number of solutions and the rank of the coefficient matrix.</p>', '<p><b>Phần A.</b> Giải mỗi hệ (nghiệm duy nhất). <b>Phần B.</b> Với mỗi ma trận mở rộng (đã ở dạng bậc thang) cho số nghiệm và hạng của ma trận hệ số.</p>'),
  loai: 'table',
  bang: [
    bang1('b1', ['Solve', 'Giải'], [{ ma: 's', ten: 'System' }, { ma: 'x', ten: 'x' }, { ma: 'y', ten: 'y' }], [
      { o: { s: 'x + 2y = 5, 3x − y = 1' }, a: { x: so(1), y: so(2) } },
      { o: { s: '2x + y = 3, x − y = 0' }, a: { x: so(1), y: so(1) } },
      { o: { s: 'x + y = 10, x − y = 4' }, a: { x: so(7), y: so(3) } },
    ], ['R2 → R2 − 3R1 gives −7y = −14 ⇒ y = 2, x = 1. Adding the two equations of the second gives 3x = 3 ⇒ x = 1, y = 1. Third: 2x = 14 ⇒ x = 7, y = 3.', 'R2 → R2 − 3R1 cho −7y = −14 ⇒ y = 2, x = 1. Cộng hai phương trình của hệ thứ hai cho 3x = 3 ⇒ x = 1, y = 1. Hệ thứ ba: 2x = 14 ⇒ x = 7, y = 3.']),
    bang1('b2', ['Classify', 'Phân loại'], [{ ma: 'm', ten: 'Echelon form [A | b]' }, { ma: 'n', ten: 'Solutions', luaChon: ['unique', 'infinitely many', 'none'] }, { ma: 'r', ten: 'rank A' }], [
      { o: { m: '[1 2 3 | 4 ; 0 1 5 | 6 ; 0 0 1 | 2]' }, a: { n: 'unique', r: '3' } },
      { o: { m: '[1 2 3 | 4 ; 0 1 5 | 6 ; 0 0 0 | 0]' }, a: { n: 'infinitely many', r: '2' } },
      { o: { m: '[1 2 3 | 4 ; 0 1 5 | 6 ; 0 0 0 | 7]' }, a: { n: 'none', r: '2' } },
    ], ['Three pivots in three unknowns: unique. A zero row 0 = 0 leaves a free variable: infinitely many (rank 2). 0 = 7 is inconsistent: none — rank A = 2 but rank [A | b] = 3.', 'Ba pivot với ba ẩn: duy nhất. Hàng 0 = 0 để lại một biến tự do: vô số nghiệm (hạng 2). 0 = 7 mâu thuẫn: vô nghiệm — hạng A = 2 nhưng hạng [A | b] = 3.']),
  ],
  goiY: ['Eliminate x from the second equation.', 'Count pivots in the coefficient part only for rank A.'],
  loiHayGap: ['Counting the constant column when computing rank A.', 'Calling 0 = 0 inconsistent.'],
  thuatNgu: [tn('consistent', 'có nghiệm (tương thích)'), tn('free variable', 'biến tự do')],
  khaiNiem: ['solution count', 'rank'],
});

const E3 = tinh({
  tieuDe: 'Linear systems 3 — Order the elimination',
  doKho: 'EASY', phut: 5,
  moTa: bi('<p>Order the steps of solving Ax = b by Gaussian elimination.</p>', '<p>Sắp các bước giải Ax = b bằng khử Gauss.</p>'),
  loai: 'order',
  cauHoi: [ord('o1', ['Steps', 'Các bước'], ['Write the augmented matrix [A | b]', 'Use row operations to make zeros below each pivot', 'Check the last rows for 0 = c (c ≠ 0)', 'Back-substitute from the last pivot upwards'], ['Set up, eliminate downwards, check consistency, then substitute back.', 'Lập ma trận, khử xuống dưới, kiểm tra tính có nghiệm, rồi thế ngược lên.'])],
  goiY: ['Elimination goes top-down, substitution bottom-up.', 'Consistency is checked before solving.'],
  loiHayGap: ['Back-substituting before checking for 0 = c.', 'Eliminating above the pivots first.'],
  thuatNgu: [tn('back substitution', 'thế ngược')],
  khaiNiem: ['Gaussian elimination steps'],
});

export default doiDau({
  slug: 'mae101-5-1-khu-gauss',
  ten: '5.1 Gaussian elimination',
  khoa: KHOA,
  baiHoc: 'mae101-5-1-khu-gauss',
  de: [E1, E2, E3],
});
