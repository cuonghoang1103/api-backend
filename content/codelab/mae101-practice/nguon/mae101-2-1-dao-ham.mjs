/** MAE101 · 2.1 — The derivative as a rate of change: definition, tangent line, differentiability (bài mae101-2-1-dao-ham). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Derivatives 1 — The definition and what it means',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on the derivative.</p>', '<p>Câu hỏi khái niệm về đạo hàm.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['f′(a) is defined as …', 'f′(a) được định nghĩa là …'], ['lim h→0 [f(a + h) − f(a)] / h', '[f(a + h) − f(a)] / h for h = 1', 'lim h→0 f(a + h)', 'f(a) / a'], ['The limit of the difference quotient: the slope of secants as they shrink to the tangent.', 'Giới hạn của tỉ sai phân: độ dốc của cát tuyến khi co lại thành tiếp tuyến.']),
    q('c2', ['Geometrically, f′(a) is …', 'Về hình học, f′(a) là …'], ['the slope of the tangent line at x = a', 'the area under f up to a', 'the value of f at a', 'the y-intercept of the tangent'], ['Physically it is the instantaneous rate of change, e.g. velocity when f is position.', 'Về vật lý đó là tốc độ thay đổi tức thời, ví dụ vận tốc khi f là vị trí.']),
    q('c3', ['Which statement is TRUE?', 'Mệnh đề nào ĐÚNG?'], ['Differentiable at a implies continuous at a', 'Continuous at a implies differentiable at a', 'Every function is differentiable where it is defined', 'A corner point has derivative 0'], ['|x| is continuous at 0 but has a corner there, so no derivative: the converse fails.', '|x| liên tục tại 0 nhưng có điểm góc ở đó nên không có đạo hàm: chiều ngược lại sai.']),
    q('c4', ['The tangent line to y = f(x) at x = a is …', 'Tiếp tuyến của y = f(x) tại x = a là …'], ['y = f(a) + f′(a)(x − a)', 'y = f′(a)x', 'y = f(a)(x − a)', 'y = f′(a) + f(a)x'], ['Point–slope form: the line through the point of the curve at x = a, with slope equal to the derivative there.', 'Dạng điểm–hệ số góc: đường thẳng qua điểm của đồ thị tại x = a, có hệ số góc bằng đạo hàm tại đó.']),
    q('c5', ['s(t) = 5t² metres. The velocity at t = 2 s is …', 's(t) = 5t² mét. Vận tốc tại t = 2 s là …'], ['20 m/s', '10 m/s', '20 m', '5 m/s'], ['v(t) = s′(t) = 10t, so v(2) = 20 m/s. 20 m is the position s(2), with the wrong unit.', 'v(t) = s′(t) = 10t, nên v(2) = 20 m/s. 20 m là vị trí s(2), sai đơn vị.']),
  ],
  goiY: ['Derivative = limit of a difference quotient.', 'A corner or a jump kills differentiability.'],
  loiHayGap: ['Confusing f(a) with f′(a).', 'Believing continuity is enough for a derivative.'],
  thuatNgu: [tn('difference quotient', 'tỉ sai phân'), tn('tangent line', 'tiếp tuyến'), tn('differentiable', 'khả vi')],
  khaiNiem: ['derivative definition'],
});

// f′(a) và tiếp tuyến y = m x + c tính tay từ định nghĩa
const ROWS = [
  ['f(x) = x², a = 3', 6, 9],
  ['f(x) = x³, a = 2', 12, 8],
  ['f(x) = 1/x, a = 2', -0.25, 0.5],
  ['f(x) = √x, a = 4', 0.25, 2],
  ['f(x) = 3x − 7, a = 10', 3, 23],
];
const E2 = tinh({
  tieuDe: 'Derivatives 2 — Slope and point of the tangent',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>For each function give f′(a) and f(a). (Use the definition or the power rule.)</p>', '<p>Với mỗi hàm cho f′(a) và f(a). (Dùng định nghĩa hoặc quy tắc luỹ thừa.)</p>'),
  loai: 'table',
  bang: [bang1('b1', ['f′(a) and f(a)', 'f′(a) và f(a)'], [{ ma: 'f', ten: 'Function, point' }, { ma: 'd', ten: "f'(a)" }, { ma: 'v', ten: 'f(a)' }],
    ROWS.map(([f, d, v]) => ({ o: { f }, a: { d: d === -0.25 ? ['-0.25', '-1/4'] : d === 0.25 ? ['0.25', '1/4'] : so(d), v: v === 0.5 ? ['0.5', '1/2'] : so(v) } })),
    ['x² → 2x = 6, f = 9; x³ → 3x² = 12, f = 8; 1/x → −1/x² = −1/4, f = 1/2; √x → 1/(2√x) = 1/4, f = 2; 3x − 7 → 3, f = 23.', 'x² → 2x = 6, f = 9; x³ → 3x² = 12, f = 8; 1/x → −1/x² = −1/4, f = 1/2; √x → 1/(2√x) = 1/4, f = 2; 3x − 7 → 3, f = 23.'])],
  goiY: ['Power rule: d/dx xⁿ = n·xⁿ⁻¹ (also for n = −1 and n = 1/2).', 'f(a) is just substitution.'],
  loiHayGap: ['Dropping the minus sign of −1/x².', 'Writing 1/√x instead of 1/(2√x).'],
  thuatNgu: [tn('power rule', 'quy tắc luỹ thừa')],
  khaiNiem: ['tangent slope'],
});

export default doiDau({
  slug: 'mae101-2-1-dao-ham',
  ten: '2.1 The derivative as a rate of change',
  khoa: KHOA,
  baiHoc: 'mae101-2-1-dao-ham',
  de: [E1, E2],
});
