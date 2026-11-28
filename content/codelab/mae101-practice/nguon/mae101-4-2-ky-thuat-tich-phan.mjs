/** MAE101 · 4.2 — Substitution and integration by parts (bài mae101-4-2-ky-thuat-tich-phan). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Techniques 1 — Substitution or by parts?',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Choose the technique and the right first step.</p>', '<p>Chọn kỹ thuật và bước đầu đúng.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['For ∫ 2x(x² + 1)³ dx the right substitution is …', 'Với ∫ 2x(x² + 1)³ dx, phép đổi biến đúng là …'], ['u = x² + 1, du = 2x dx', 'u = 2x', 'u = (x² + 1)³', 'u = x³'], ['The inner function\'s derivative 2x is present, so the integral becomes ∫u³ du.', 'Đạo hàm 2x của hàm trong có sẵn, nên tích phân thành ∫u³ du.']),
    q('c2', ['Integration by parts is ∫ u dv = …', 'Tích phân từng phần là ∫ u dv = …'], ['uv − ∫ v du', 'uv + ∫ v du', 'u′v′', '∫ u du · ∫ dv'], ['It is the product rule run backwards.', 'Đó là quy tắc tích chạy ngược.']),
    q('c3', ['By LIATE, in ∫ x·ln x dx you choose u = …', 'Theo LIATE, trong ∫ x·ln x dx chọn u = …'], ['ln x', 'x', 'x·ln x', '1'], ['Logarithms come first in LIATE; ln x simplifies when differentiated (1/x).', 'Logarit đứng đầu trong LIATE; ln x đơn giản đi khi lấy đạo hàm (1/x).']),
    q('c4', ['∫ x·eˣ dx = …', '∫ x·eˣ dx = …'], ['x·eˣ − eˣ + C', 'x²eˣ/2 + C', 'eˣ + C', 'x·eˣ + eˣ + C'], ['u = x, dv = eˣ dx ⇒ x·eˣ − ∫eˣ dx.', 'u = x, dv = eˣ dx ⇒ x·eˣ − ∫eˣ dx.']),
    q('c5', ['In a DEFINITE integral by substitution, the cleanest habit is to …', 'Trong tích phân XÁC ĐỊNH bằng đổi biến, thói quen gọn nhất là …'], ['change the bounds to u and never return to x', 'keep the x-bounds for the u-integral', 'drop the bounds and add C', 'substitute twice'], ['Converting the bounds avoids back-substitution and sign mistakes (lesson 4.2, ★).', 'Đổi cận sang u giúp khỏi thế ngược và tránh sai dấu (bài 4.2, ★).']),
  ],
  goiY: ['Function + its derivative together ⇒ substitution.', 'Product of unlike factors ⇒ by parts, u by LIATE.'],
  loiHayGap: ['Keeping x-bounds after substituting u.', 'Choosing u = eˣ in ∫x·eˣ (it never simplifies).'],
  thuatNgu: [tn('substitution', 'đổi biến'), tn('integration by parts', 'tích phân từng phần')],
  khaiNiem: ['integration techniques'],
});

const ROWS = [
  ['∫₀¹ 2x(x² + 1)³ dx', [...so(3.75), '15/4'], 'u = x² + 1: ∫₁² u³ du = 15/4'],
  ['∫₀¹ x·eˣ dx', so(1), '[x·eˣ − eˣ]₀¹ = 0 − (−1)'],
  ['∫₁ᵉ ln x dx', so(1), '[x ln x − x]₁ᵉ = 0 − (−1)'],
  ['∫₀^(π/2) sin x · cos x dx', [...so(0.5), '1/2'], 'u = sin x: ∫₀¹ u du'],
  ['∫₀¹ 3x²·e^(x³) dx', so(Math.E - 1), 'u = x³: e − 1 ≈ 1.72'],
];
const E2 = tinh({
  tieuDe: 'Techniques 2 — Five definite integrals',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Evaluate. Write an integer, a fraction, or a decimal rounded to 2 digits (e ≈ 2.71828).</p>', '<p>Tính. Ghi số nguyên, phân số, hoặc số thập phân làm tròn 2 chữ số (e ≈ 2,71828).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Substitution and by parts', 'Đổi biến và từng phần'], [{ ma: 'i', ten: 'Integral' }, { ma: 'v', ten: 'Value' }],
    ROWS.map(([i, v]) => ({ o: { i }, a: { v } })),
    [ROWS.map(([i, , how]) => `${i}: ${how}`).join('; ') + '.', ROWS.map(([i, , how]) => `${i}: ${how}`).join('; ') + '.'])],
  goiY: ['Change the bounds with the substitution.', 'By parts: u = x or u = ln x.'],
  loiHayGap: ['Forgetting to evaluate the boundary term uv.', 'Rounding e too early.'],
  thuatNgu: [],
  khaiNiem: ['definite integrals by technique'],
});

export default doiDau({
  slug: 'mae101-4-2-ky-thuat-tich-phan',
  ten: '4.2 Integration techniques',
  khoa: KHOA,
  baiHoc: 'mae101-4-2-ky-thuat-tich-phan',
  de: [E1, E2],
});
