/** MAE101 · 4.1 — The definite integral and the Fundamental Theorem of Calculus (bài mae101-4-1-tich-phan). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Integrals 1 — Area, antiderivatives and the FTC',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on the definite integral.</p>', '<p>Câu hỏi khái niệm về tích phân xác định.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['The Fundamental Theorem (part 2) says ∫ₐᵇ f(x) dx = …', 'Định lý cơ bản (phần 2) nói ∫ₐᵇ f(x) dx = …'], ['F(b) − F(a), where F′ = f', 'f(b) − f(a)', 'F(a) − F(b)', 'f′(b) − f′(a)'], ['Evaluate any antiderivative at the bounds and subtract.', 'Tính một nguyên hàm bất kỳ tại hai cận rồi trừ.']),
    q('c2', ['∫₋₁¹ x³ dx = …', '∫₋₁¹ x³ dx = …'], ['0', '1/2', '2', '1/4'], ['x³ is odd: the area below the axis cancels the area above.', 'x³ là hàm lẻ: phần diện tích dưới trục triệt tiêu phần phía trên.']),
    q('c3', ['A definite integral of f where f &lt; 0 is …', 'Tích phân xác định của f ở nơi f &lt; 0 là …'], ['negative (signed area)', 'always positive (area)', 'zero', 'undefined'], ['It measures signed area; geometric area needs ∫|f|.', 'Nó đo diện tích có dấu; diện tích hình học cần ∫|f|.']),
    q('c4', ['d/dx ∫₀ˣ t² dt = …', 'd/dx ∫₀ˣ t² dt = …'], ['x²', 'x³/3', '2x', '0'], ['FTC part 1: differentiating the accumulation function gives back the integrand.', 'Định lý cơ bản phần 1: lấy đạo hàm hàm tích luỹ thì được lại hàm dưới dấu tích phân.']),
    q('c5', ['A Riemann sum approximates ∫ₐᵇ f by …', 'Tổng Riemann xấp xỉ ∫ₐᵇ f bằng …'], ['adding f(xᵢ)·Δx over n thin rectangles', 'f(b) − f(a)', 'the average of f(a) and f(b)', 'the slope at the midpoint'], ['As n → ∞ (Δx → 0) the sum becomes the integral.', 'Khi n → ∞ (Δx → 0), tổng trở thành tích phân.']),
  ],
  goiY: ['Antiderivative, then F(b) − F(a).', 'Watch the sign below the x-axis.'],
  loiHayGap: ['Plugging the bounds into f instead of F.', 'Treating signed area as area.'],
  thuatNgu: [tn('antiderivative', 'nguyên hàm'), tn('definite integral', 'tích phân xác định'), tn('Riemann sum', 'tổng Riemann')],
  khaiNiem: ['FTC'],
});

const ROWS = [
  ['∫₀¹ x² dx', [...so(1 / 3), '1/3'], '[x³/3]₀¹ = 1/3'],
  ['∫₀² (2x + 1) dx', so(6), '[x² + x]₀² = 6'],
  ['∫₁ᵉ (1/x) dx', so(1), '[ln x]₁ᵉ = 1'],
  ['∫₀^π sin x dx', so(2), '[−cos x]₀^π = 1 + 1'],
  ['∫₀³ (x² − 2x) dx', so(0), '[x³/3 − x²]₀³ = 9 − 9'],
  ['∫₁⁴ √x dx', [...so(14 / 3), '14/3'], '[(2/3)x^(3/2)]₁⁴ = 16/3 − 2/3'],
];
const E2 = tinh({
  tieuDe: 'Integrals 2 — Evaluate six definite integrals',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Evaluate. Write an integer, a fraction such as 1/3, or a decimal with 2 digits.</p>', '<p>Tính. Ghi số nguyên, phân số như 1/3, hoặc số thập phân 2 chữ số.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Definite integrals', 'Tích phân xác định'], [{ ma: 'i', ten: 'Integral' }, { ma: 'v', ten: 'Value' }],
    ROWS.map(([i, v]) => ({ o: { i }, a: { v } })),
    [ROWS.map(([i, , how]) => `${i}: ${how}`).join('; ') + '.', ROWS.map(([i, , how]) => `${i}: ${how}`).join('; ') + '.'])],
  goiY: ['Power rule backwards: ∫xⁿ = xⁿ⁺¹/(n + 1).', '∫1/x = ln|x|, ∫sin = −cos.'],
  loiHayGap: ['Sign error in [−cos x].', 'Forgetting that ∫₀³ (x² − 2x) has parts below the axis.'],
  thuatNgu: [],
  khaiNiem: ['evaluating integrals'],
});

export default doiDau({
  slug: 'mae101-4-1-tich-phan',
  ten: '4.1 The definite integral & the FTC',
  khoa: KHOA,
  baiHoc: 'mae101-4-1-tich-phan',
  de: [E1, E2],
});
