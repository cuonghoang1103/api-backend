/** MAE101 · 3.2 — Optimization and limits at infinity (bài mae101-3-2-toi-uu). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so, ord } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Optimization 1 — The method',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Questions on setting up and solving optimization problems.</p>', '<p>Câu hỏi về cách lập và giải bài toán tối ưu.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['To find the absolute max of a continuous f on [a, b] you compare f at …', 'Để tìm giá trị lớn nhất của f liên tục trên [a, b], so f tại …'], ['the critical points inside (a, b) and the endpoints a, b', 'the critical points inside (a, b) only', 'the two endpoints a and b only', 'the midpoint (a + b)/2 and the endpoints'], ['Closed-interval method: the maximum is at a critical point or at an endpoint.', 'Phương pháp khoảng đóng: giá trị lớn nhất nằm ở điểm tới hạn hoặc ở đầu mút.']),
    q('c2', ['A rectangle has perimeter 20. Its maximum area is …', 'Một hình chữ nhật có chu vi 20. Diện tích lớn nhất là …'], ['25 (a 5 × 5 square)', '20', '100', '24 (a 4 × 6 rectangle)'], ['A(x) = x(10 − x), A′ = 10 − 2x = 0 at x = 5: area 25.', 'A(x) = x(10 − x), A′ = 10 − 2x = 0 tại x = 5: diện tích 25.']),
    q('c3', ['The first step of a word optimization problem is …', 'Bước đầu tiên của một bài tối ưu có lời là …'], ['write the objective as a function of one variable via the constraint', 'differentiate the constraint and set it to zero', 'set the quantity to optimise equal to 0', 'draw the graph and read the highest point'], ['Use the constraint to eliminate the extra variable, then optimise a one-variable function.', 'Dùng ràng buộc để khử biến thừa, rồi tối ưu một hàm một biến.']),
    q('c4', ['lim x→∞ (5x³ − x)/(2x³ + 7) = …', 'lim x→∞ (5x³ − x)/(2x³ + 7) = …'], ['5/2', '0', '∞', '−1/7'], ['Equal degrees: ratio of leading coefficients 5/2.', 'Bậc bằng nhau: tỉ số hệ số cao nhất 5/2.']),
    q('c5', ['For x &gt; 0, the minimum of x + 1/x is …', 'Với x &gt; 0, giá trị nhỏ nhất của x + 1/x là …'], ['2, at x = 1', '0, at x = 0', '1, at x = 1', 'there is no minimum'], ['f′ = 1 − 1/x² = 0 at x = 1 and f″ = 2/x³ > 0: minimum f(1) = 2.', 'f′ = 1 − 1/x² = 0 tại x = 1 và f″ = 2/x³ > 0: cực tiểu f(1) = 2.']),
  ],
  goiY: ['One variable, one function, then f′ = 0.', 'Do not forget the endpoints.'],
  loiHayGap: ['Ignoring endpoints on a closed interval.', 'Optimising the constraint instead of the objective.'],
  thuatNgu: [tn('objective function', 'hàm mục tiêu'), tn('constraint', 'ràng buộc'), tn('closed interval method', 'phương pháp khoảng đóng')],
  khaiNiem: ['optimization'],
});

const E2 = tinh({
  tieuDe: 'Optimization 2 — Solve four small problems',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<ol><li>Fence 100 m along three sides of a rectangle (the fourth side is a river). Maximise the area: give the side perpendicular to the river x and the area.</li><li>f(x) = x³ − 3x on [0, 2]: absolute max and min.</li><li>f(x) = x(10 − x): maximum value.</li><li>An open box from a 12 × 12 sheet by cutting squares of side x from the corners: the best x.</li></ol>', '<ol><li>Rào 100 m ba cạnh của một hình chữ nhật (cạnh thứ tư là sông). Cực đại diện tích: cho cạnh vuông góc với sông x và diện tích.</li><li>f(x) = x³ − 3x trên [0, 2]: giá trị lớn nhất và nhỏ nhất.</li><li>f(x) = x(10 − x): giá trị lớn nhất.</li><li>Hộp không nắp từ tấm 12 × 12 bằng cách cắt bốn hình vuông cạnh x ở góc: x tốt nhất.</li></ol>'),
  loai: 'table',
  bang: [bang1('b1', ['Answers', 'Đáp số'], [{ ma: 'p', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }],
    [
      { o: { p: '1. x (m)' }, a: { v: so(25) } },
      { o: { p: '1. max area (m²)' }, a: { v: so(1250) } },
      { o: { p: '2. max on [0, 2]' }, a: { v: so(2) } },
      { o: { p: '2. min on [0, 2]' }, a: { v: so(-2) } },
      { o: { p: '3. max of x(10 − x)' }, a: { v: so(25) } },
      { o: { p: '4. best x' }, a: { v: so(2) } },
    ],
    ['1) A = x(100 − 2x), A′ = 100 − 4x = 0 ⇒ x = 25, A = 25·50 = 1250. 2) f′ = 3x² − 3 = 0 ⇒ x = 1 in [0, 2]; f(0) = 0, f(1) = −2, f(2) = 2 ⇒ max 2, min −2. 3) vertex at x = 5: 25. 4) V = x(12 − 2x)², V′ = (12 − 2x)(12 − 6x) = 0 ⇒ x = 2 (x = 6 gives V = 0).', '1) A = x(100 − 2x), A′ = 100 − 4x = 0 ⇒ x = 25, A = 25·50 = 1250. 2) f′ = 3x² − 3 = 0 ⇒ x = 1 thuộc [0, 2]; f(0) = 0, f(1) = −2, f(2) = 2 ⇒ lớn nhất 2, nhỏ nhất −2. 3) đỉnh tại x = 5: 25. 4) V = x(12 − 2x)², V′ = (12 − 2x)(12 − 6x) = 0 ⇒ x = 2 (x = 6 cho V = 0).'])],
  goiY: ['Write the objective in one variable.', 'Check the endpoints in problem 2.'],
  loiHayGap: ['Reporting the critical point x = 1 as the maximum in problem 2.', 'Taking x = 6 in problem 4.'],
  thuatNgu: [],
  khaiNiem: ['applied optimization'],
});

const E3 = tinh({
  tieuDe: 'Optimization 3 — Order the method',
  doKho: 'EASY', phut: 5,
  moTa: bi('<p>Order the steps of solving an applied optimization problem.</p>', '<p>Sắp xếp các bước giải một bài tối ưu ứng dụng.</p>'),
  loai: 'order',
  cauHoi: [ord('o1', ['Steps', 'Các bước'], ['Name the variables and the quantity to optimise', 'Use the constraint to write it as a function of one variable', 'Find the critical points (f′ = 0) in the allowed domain', 'Compare with the endpoints / use the second-derivative test', 'Answer the question in its units'], ['Set up, reduce to one variable, differentiate, verify, interpret.', 'Lập bài, đưa về một biến, lấy đạo hàm, kiểm tra, diễn giải.'])],
  goiY: ['Setting up comes before calculus.', 'Verification comes before the answer.'],
  loiHayGap: ['Differentiating before eliminating the second variable.', 'Stopping at f′ = 0 without checking.'],
  thuatNgu: [],
  khaiNiem: ['optimization method'],
});

export default doiDau({
  slug: 'mae101-3-2-toi-uu',
  ten: '3.2 Optimization & limits at infinity',
  khoa: KHOA,
  baiHoc: 'mae101-3-2-toi-uu',
  de: [E1, E2, E3],
});
