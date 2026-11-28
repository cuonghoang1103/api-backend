/**
 * MAE101 · Lab Giải tích (Ch1–4) — viết hàm chạy thật: đạo hàm & tích phân đa thức, phương pháp Newton, tổng Riemann điểm giữa.
 * Đa thức là mảng hệ số TĂNG DẦN theo bậc: [c0, c1, c2] = c0 + c1·x + c2·x². mongDoi do chính hàm tham chiếu tính (jsDe).
 */
import { doiDau, KHOA, bi, jsDe, dat } from './_mae.mjs';

function polyDerivative(c) {
  // d/dx Σ cₖ xᵏ = Σ k·cₖ xᵏ⁻¹  — bỏ hằng số; đạo hàm của hằng là [0].
  var out = [];
  for (var k = 1; k < c.length; k++) out.push(k * c[k]);
  return out.length ? out : [0];
}
const L1 = jsDe({
  tieuDe: 'Calculus lab 1 — Differentiate a polynomial',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>A polynomial is given by its coefficients in increasing degree: <code>[c0, c1, c2, …]</code> means c0 + c1·x + c2·x² + …. Write <code>polyDerivative(c)</code> returning the coefficients of its derivative in the same format. The derivative of a constant is <code>[0]</code>.</p>', '<p>Một đa thức cho bằng hệ số theo bậc tăng dần: <code>[c0, c1, c2, …]</code> nghĩa là c0 + c1·x + c2·x² + …. Viết <code>polyDerivative(c)</code> trả hệ số của đạo hàm cùng định dạng. Đạo hàm của hằng số là <code>[0]</code>.</p>'),
  yeuCau: [bi('Power rule term by term: d/dx (cₖxᵏ) = k·cₖ·xᵏ⁻¹.', 'Quy tắc luỹ thừa từng hạng tử: d/dx (cₖxᵏ) = k·cₖ·xᵏ⁻¹.')],
  viDu: [{ input: 'polyDerivative([5, -3, 0, 2])', output: JSON.stringify(polyDerivative([5, -3, 0, 2])), explanation: '5 − 3x + 2x³ → −3 + 6x².|||5 − 3x + 2x³ → −3 + 6x².' }],
  goiY: ['Skip index 0 (the constant).', 'Multiply each coefficient by its index.'],
  loiHayGap: ['Returning an empty array for a constant.', 'Keeping the constant term.'],
  giaiThich: '<p>The derivative is linear, so it acts term by term; the constant term vanishes and every other coefficient is multiplied by its exponent and shifted down one degree.</p>',
  khaiNiem: ['power rule'],
  fn: 'polyDerivative',
  dau: 'function polyDerivative(c) {\n  return c;\n}\n',
  giaiMa: dat(polyDerivative, 'polyDerivative'),
  ref: polyDerivative,
  cases: [{ args: [[5, -3, 0, 2]] }, { args: [[7]] }, { args: [[0, 1]] }, { args: [[1, 1, 1, 1, 1]], an: true }, { args: [[0, 0, 3]], an: true }],
});

function polyIntegral(c, a, b) {
  // ∫ₐᵇ Σ cₖ xᵏ dx = Σ cₖ (b^(k+1) − a^(k+1)) / (k + 1)  — định lý cơ bản của giải tích.
  var s = 0;
  for (var k = 0; k < c.length; k++) s += c[k] * (Math.pow(b, k + 1) - Math.pow(a, k + 1)) / (k + 1);
  return Math.round(s * 1e9) / 1e9;
}
const L2 = jsDe({
  tieuDe: 'Calculus lab 2 — Definite integral of a polynomial (exact)',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Write <code>polyIntegral(c, a, b)</code> returning ∫ₐᵇ p(x) dx exactly by the Fundamental Theorem (antiderivative evaluated at the bounds), rounded to 9 decimal places with <code>Math.round(s * 1e9) / 1e9</code>. If a &gt; b the result is negative, as the theorem says.</p>', '<p>Viết <code>polyIntegral(c, a, b)</code> trả ∫ₐᵇ p(x) dx chính xác bằng định lý cơ bản (nguyên hàm tính tại hai cận), làm tròn 9 chữ số thập phân bằng <code>Math.round(s * 1e9) / 1e9</code>. Nếu a &gt; b thì kết quả âm, đúng như định lý.</p>'),
  yeuCau: [bi('Antiderivative of cₖxᵏ is cₖxᵏ⁺¹/(k + 1).', 'Nguyên hàm của cₖxᵏ là cₖxᵏ⁺¹/(k + 1).')],
  viDu: [{ input: 'polyIntegral([1, 2], 0, 2)', output: String(polyIntegral([1, 2], 0, 2)), explanation: '∫₀² (1 + 2x) dx = [x + x²]₀² = 6.|||∫₀² (1 + 2x) dx = [x + x²]₀² = 6.' }],
  goiY: ['Sum the contribution of every coefficient.', 'Use Math.pow(b, k + 1) − Math.pow(a, k + 1).'],
  loiHayGap: ['Dividing by k instead of k + 1.', 'Swapping a and b.'],
  giaiThich: '<p>F(x) = Σ cₖxᵏ⁺¹/(k + 1) is an antiderivative, and the integral is F(b) − F(a). Rounding removes floating-point noise such as 0.33333333333333337.</p>',
  khaiNiem: ['FTC'],
  fn: 'polyIntegral',
  dau: 'function polyIntegral(c, a, b) {\n  return 0;\n}\n',
  giaiMa: dat(polyIntegral, 'polyIntegral'),
  ref: polyIntegral,
  cases: [{ args: [[1, 2], 0, 2] }, { args: [[0, 0, 1], 0, 1] }, { args: [[0, -2, 1], 0, 3] }, { args: [[0, 0, 0, 1], -1, 1], an: true }, { args: [[3, 0, 1], 2, -1], an: true }],
});

function newtonRoot(c, x0, steps) {
  // xₙ₊₁ = xₙ − p(xₙ)/p′(xₙ); dừng sớm nếu p′ = 0 (trả về null).
  function val(cs, x) { var s = 0; for (var k = cs.length - 1; k >= 0; k--) s = s * x + cs[k]; return s; }
  var d = [];
  for (var k = 1; k < c.length; k++) d.push(k * c[k]);
  var x = x0;
  for (var i = 0; i < steps; i++) {
    var dv = val(d, x);
    if (dv === 0) return null;
    x = x - val(c, x) / dv;
  }
  return Math.round(x * 1e9) / 1e9;
}
const L3 = jsDe({
  tieuDe: 'Calculus lab 3 — Newton\'s method for a root',
  doKho: 'HARD', phut: 18,
  moTa: bi('<p>Write <code>newtonRoot(c, x0, steps)</code>: start at x0 and apply Newton\'s update xₙ₊₁ = xₙ − p(xₙ)/p′(xₙ) exactly <code>steps</code> times, then return x rounded to 9 decimals. If p′(xₙ) = 0 at some step, return <code>null</code> (the tangent is horizontal). Evaluate the polynomial with Horner\'s rule.</p>', '<p>Viết <code>newtonRoot(c, x0, steps)</code>: bắt đầu từ x0 và áp phép cập nhật Newton xₙ₊₁ = xₙ − p(xₙ)/p′(xₙ) đúng <code>steps</code> lần, rồi trả x làm tròn 9 chữ số. Nếu p′(xₙ) = 0 ở bước nào thì trả <code>null</code> (tiếp tuyến nằm ngang). Tính giá trị đa thức bằng sơ đồ Horner.</p>'),
  yeuCau: [bi('Newton uses the tangent line at xₙ: its x-intercept is the next guess.', 'Newton dùng tiếp tuyến tại xₙ: giao điểm của nó với trục x là lần đoán sau.')],
  viDu: [{ input: 'newtonRoot([-2, 0, 1], 1, 5)', output: String(newtonRoot([-2, 0, 1], 1, 5)), explanation: 'x² − 2 = 0 from 1: 1.5, 1.41667, 1.414216… → √2.|||x² − 2 = 0 từ 1: 1,5; 1,41667; 1,414216… → √2.' }],
  goiY: ['Compute p′ coefficients once (lab 1).', 'Check p′(x) === 0 before dividing.'],
  loiHayGap: ['Running steps + 1 or steps − 1 iterations.', 'Dividing by zero instead of returning null.'],
  giaiThich: '<p>Each step replaces the curve by its tangent line (Chapter 2) and jumps to where that line crosses zero; near a simple root the number of correct digits roughly doubles each step.</p>',
  khaiNiem: ['Newton\'s method', 'tangent line'],
  fn: 'newtonRoot',
  dau: 'function newtonRoot(c, x0, steps) {\n  return x0;\n}\n',
  giaiMa: dat(newtonRoot, 'newtonRoot'),
  ref: newtonRoot,
  cases: [{ args: [[-2, 0, 1], 1, 5] }, { args: [[-1, 0, 0, 1], 2, 6] }, { args: [[1, 0, 1], 0, 3] }, { args: [[-5, 0, 1], 3, 6], an: true }, { args: [[6, -5, 1], 0, 8], an: true }],
});

export default doiDau({
  slug: 'mae101-4-lab-giai-tich-so',
  ten: 'Lab 4 Calculus in code: derivative, integral, Newton',
  khoa: KHOA,
  baiHoc: 'mae101-4-2-ky-thuat-tich-phan',
  de: [L1, L2, L3],
});
