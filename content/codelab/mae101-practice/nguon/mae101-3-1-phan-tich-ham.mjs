/** MAE101 · 3.1 — Analysing a function with f′ and f″: monotonicity, extrema, concavity (bài mae101-3-1-phan-tich-ham). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Function analysis 1 — The two tests',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Read the shape of a function from its derivatives.</p>', '<p>Đọc hình dạng của hàm từ các đạo hàm.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['f′ changes sign from + to − at a critical point c. Then c is …', 'f′ đổi dấu từ + sang − tại điểm tới hạn c. Khi đó c là …'], ['a local maximum', 'a local minimum', 'an inflection point', 'neither'], ['Rising then falling = a peak (first-derivative test).', 'Đi lên rồi đi xuống = một đỉnh (phép thử đạo hàm bậc một).']),
    q('c2', ['f′(c) = 0 and f″(c) > 0. Then c is …', 'f′(c) = 0 và f″(c) > 0. Khi đó c là …'], ['a local minimum', 'a local maximum', 'an inflection point', 'impossible to decide'], ['Concave up (∪) at a flat point = a valley (second-derivative test).', 'Lõm lên (∪) tại điểm có tiếp tuyến nằm ngang = một đáy (phép thử đạo hàm bậc hai).']),
    q('c3', ['f(x) = x⁴ has f′(0) = f″(0) = 0. At x = 0, f has …', 'f(x) = x⁴ có f′(0) = f″(0) = 0. Tại x = 0, f có …'], ['a minimum (found by the first-derivative test)', 'an inflection point, because f″(0) = 0', 'a maximum, because x⁴ is even', 'no critical point, because the test fails'], ['The second-derivative test is inconclusive when f″ = 0; f′ changes − → + at 0, so it is a minimum.', 'Phép thử bậc hai không kết luận được khi f″ = 0; f′ đổi − → + tại 0, nên đó là cực tiểu.']),
    q('c4', ['An inflection point is where …', 'Điểm uốn là nơi …'], ['concavity changes', 'f′ = 0', 'f has a maximum', 'f is undefined'], ['f″ changes sign there; f′ need not be 0 (x³ − 3x has its inflection at x = 0 where f′ = −3).', 'f″ đổi dấu tại đó; f′ không cần bằng 0 (x³ − 3x có điểm uốn tại x = 0 với f′ = −3).']),
    q('c5', ['f′(x) &gt; 0 on an interval means f is … there', 'f′(x) &gt; 0 trên một khoảng nghĩa là f … ở đó'], ['increasing', 'decreasing', 'concave up', 'constant'], ['The sign of f′ gives direction; the sign of f″ gives curvature.', 'Dấu của f′ cho chiều biến thiên; dấu của f″ cho độ cong.']),
  ],
  goiY: ['f′ → direction, f″ → curvature.', 'If f″(c) = 0, fall back to the sign of f′.'],
  loiHayGap: ['Calling every critical point an extremum.', 'Requiring f′ = 0 at an inflection point.'],
  thuatNgu: [tn('critical point', 'điểm tới hạn'), tn('concave up / down', 'lõm lên / lồi xuống'), tn('inflection point', 'điểm uốn')],
  khaiNiem: ['first and second derivative tests'],
});

const E2 = tinh({
  tieuDe: 'Function analysis 2 — Classify the critical points',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For each function and critical point x = c, give the type and the value f(c).</p><ul><li>f(x) = x³ − 3x</li><li>g(x) = x⁴ − 4x³ (g′ = 4x²(x − 3))</li><li>h(x) = x² − 6x + 5</li></ul>', '<p>Với mỗi hàm và điểm tới hạn x = c, cho loại điểm và giá trị f(c).</p><ul><li>f(x) = x³ − 3x</li><li>g(x) = x⁴ − 4x³ (g′ = 4x²(x − 3))</li><li>h(x) = x² − 6x + 5</li></ul>'),
  loai: 'table',
  bang: [bang1('b1', ['Critical points', 'Điểm tới hạn'], [{ ma: 'p', ten: 'Function, c' }, { ma: 't', ten: 'Type', luaChon: ['max', 'min', 'neither'] }, { ma: 'v', ten: 'Value' }],
    [
      { o: { p: 'f, c = −1' }, a: { t: 'max', v: so(2) } },
      { o: { p: 'f, c = 1' }, a: { t: 'min', v: so(-2) } },
      { o: { p: 'g, c = 0' }, a: { t: 'neither', v: so(0) } },
      { o: { p: 'g, c = 3' }, a: { t: 'min', v: so(-27) } },
      { o: { p: 'h, c = 3' }, a: { t: 'min', v: so(-4) } },
    ],
    ['f″ = 6x: f″(−1) = −6 < 0 (max, f = 2), f″(1) = 6 > 0 (min, f = −2). g′ = 4x²(x − 3) is negative on both sides of 0 (no sign change: neither) and changes − → + at 3 (min, g(3) = 81 − 108 = −27). h′ = 2x − 6, h(3) = 9 − 18 + 5 = −4.', 'f″ = 6x: f″(−1) = −6 < 0 (cực đại, f = 2), f″(1) = 6 > 0 (cực tiểu, f = −2). g′ = 4x²(x − 3) âm ở cả hai phía của 0 (không đổi dấu: không phải cực trị) và đổi − → + tại 3 (cực tiểu, g(3) = 81 − 108 = −27). h′ = 2x − 6, h(3) = 9 − 18 + 5 = −4.'])],
  goiY: ['x² never changes sign.', 'Compute the value by substitution into the original function.'],
  loiHayGap: ['Calling x = 0 an extremum of g because g′(0) = 0.', 'Substituting into f′ instead of f for the value.'],
  thuatNgu: [],
  khaiNiem: ['classifying extrema'],
});

export default doiDau({
  slug: 'mae101-3-1-phan-tich-ham',
  ten: '3.1 Analysing a function',
  khoa: KHOA,
  baiHoc: 'mae101-3-1-phan-tich-ham',
  de: [E1, E2],
});
