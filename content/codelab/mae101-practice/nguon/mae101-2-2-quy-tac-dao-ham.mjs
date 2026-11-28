/** MAE101 · 2.2 — Differentiation rules: product, quotient, chain (bài mae101-2-2-quy-tac-dao-ham). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Rules 1 — Product, quotient and chain rule',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Pick the correct derivative.</p>', '<p>Chọn đạo hàm đúng.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['(f·g)′ = …', '(f·g)′ = …'], ['f′g + fg′', 'f′g′', 'f′g − fg′', '(f′g − fg′)/g²'], ['Product rule. f′g′ is the most common wrong guess.', 'Quy tắc tích. f′g′ là cách đoán sai phổ biến nhất.']),
    q('c2', ['(f/g)′ = …', '(f/g)′ = …'], ['(f′g − fg′)/g²', '(f′g + fg′)/g²', 'f′/g′', '(fg′ − f′g)/g²'], ['Quotient rule: "low d-high minus high d-low, over low squared". The order of the subtraction matters.', 'Quy tắc thương: "mẫu nhân đạo hàm tử trừ tử nhân đạo hàm mẫu, chia mẫu bình phương". Thứ tự phép trừ là quan trọng.']),
    q('c3', ['d/dx (x² + 1)³ = …', 'd/dx (x² + 1)³ = …'], ['6x(x² + 1)²', '3(x² + 1)²', '3(2x)²', '6x(x² + 1)³'], ['Chain rule: 3(x² + 1)² times the inner derivative 2x.', 'Quy tắc chuỗi: 3(x² + 1)² nhân đạo hàm hàm trong 2x.']),
    q('c4', ['d/dx e^(3x) = …', 'd/dx e^(3x) = …'], ['3e^(3x)', 'e^(3x)', '3x·e^(3x − 1)', 'e^3'], ['eᵘ differentiates to eᵘ·u′, and u′ = 3. The power rule does not apply to exponentials.', 'eᵘ có đạo hàm eᵘ·u′, mà u′ = 3. Quy tắc luỹ thừa không áp dụng cho hàm mũ.']),
    q('c5', ['d/dx ln(x² + 1) = …', 'd/dx ln(x² + 1) = …'], ['2x/(x² + 1)', '1/(x² + 1)', '2x·ln(x² + 1)', '1/(2x)'], ['(ln u)′ = u′/u with u = x² + 1.', '(ln u)′ = u′/u với u = x² + 1.']),
  ],
  goiY: ['Identify the outermost operation first.', 'For compositions multiply by the inner derivative.'],
  loiHayGap: ['Forgetting the inner derivative in the chain rule.', 'Swapping the terms of the quotient rule numerator.'],
  thuatNgu: [tn('product rule', 'quy tắc tích'), tn('quotient rule', 'quy tắc thương'), tn('chain rule', 'quy tắc hàm hợp (chuỗi)')],
  khaiNiem: ['differentiation rules'],
});

const ROWS = [
  ['(x² + 1)³ at x = 1', 24, '3·2²·2'],
  ['x·eˣ at x = 0', 1, '(1 + x)eˣ'],
  ['sin(2x) at x = 0', 2, '2cos(2x)'],
  ['ln(x² + 1) at x = 1', 1, '2x/(x² + 1)'],
  ['x/(x + 1) at x = 1', 0.25, '1/(x + 1)²'],
  ['e^(3x) at x = 0', 3, '3e^(3x)'],
  ['x²·sin x at x = 0', 0, '2x sin x + x² cos x'],
];
const E2 = tinh({
  tieuDe: 'Rules 2 — Evaluate f′ at a point',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Differentiate, then evaluate at the given point. Write an integer or a decimal.</p>', '<p>Lấy đạo hàm rồi tính tại điểm cho sẵn. Ghi số nguyên hoặc số thập phân.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['f′ at the point', 'f′ tại điểm cho sẵn'], [{ ma: 'f', ten: 'Function and point' }, { ma: 'v', ten: "f'(point)" }],
    ROWS.map(([f, v]) => ({ o: { f }, a: { v: v === 0.25 ? ['0.25', '1/4'] : so(v) } })),
    [ROWS.map(([f, v, d]) => `${f}: f′ = ${d} → ${v}`).join('; ') + '.', ROWS.map(([f, v, d]) => `${f}: f′ = ${d} → ${v}`).join('; ') + '.'])],
  goiY: ['Write f′ symbolically first, then substitute.', 'sin 0 = 0, cos 0 = 1, e⁰ = 1.'],
  loiHayGap: ['Substituting before differentiating.', 'Using (x + 1)/(x + 1)² instead of the quotient rule.'],
  thuatNgu: [],
  khaiNiem: ['chain rule'],
});

export default doiDau({
  slug: 'mae101-2-2-quy-tac-dao-ham',
  ten: '2.2 Differentiation rules',
  khoa: KHOA,
  baiHoc: 'mae101-2-2-quy-tac-dao-ham',
  de: [E1, E2],
});
