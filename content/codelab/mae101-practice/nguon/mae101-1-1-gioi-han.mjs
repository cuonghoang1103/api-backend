/** MAE101 · 1.1 — Limits: meaning, one-sided limits, continuity (bài mae101-1-1-gioi-han). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1 } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Limits 1 — What a limit means',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on limits, one-sided limits and continuity.</p>', '<p>Câu hỏi khái niệm về giới hạn, giới hạn một phía và tính liên tục.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['lim x→a f(x) = L means …', 'lim x→a f(x) = L nghĩa là …'], ['f(x) gets arbitrarily close to L as x gets close to a (x ≠ a)', 'f(a) must be defined and equal to L, nothing more', 'f(x) equals L exactly for every x in some interval around a', 'L is the largest value that f takes on an interval around a'], ['A limit is about values NEAR a, never AT a: f(a) may be undefined or different.', 'Giới hạn nói về các giá trị GẦN a, không phải TẠI a: f(a) có thể không xác định hoặc khác L.']),
    q('c2', ['The two-sided limit at a exists exactly when …', 'Giới hạn hai phía tại a tồn tại đúng khi …'], ['both one-sided limits exist and are equal', 'f(a) is defined', 'the left-hand limit exists', 'f is a polynomial'], ['lim exists ⟺ lim x→a⁻ = lim x→a⁺ (both finite).', 'Tồn tại giới hạn ⟺ giới hạn trái = giới hạn phải (cả hai hữu hạn).']),
    q('c3', ['f is continuous at a when …', 'f liên tục tại a khi …'], ['f(a) is defined, the limit exists, and lim x→a f(x) = f(a)', 'f(a) is defined', 'the limit at a exists', 'f has no vertical asymptote anywhere'], ['All three conditions are required; a "hole" fails the last one.', 'Cần đủ ba điều kiện; một "lỗ thủng" làm hỏng điều kiện cuối.']),
    q('c4', ['g(x) = (x² − 1)/(x − 1) at x = 1 is …', 'g(x) = (x² − 1)/(x − 1) tại x = 1 là …'], ['undefined, yet lim x→1 g(x) = 2', 'equal to 2', 'undefined, and the limit does not exist', 'equal to 0'], ['For x ≠ 1, g(x) = x + 1, so the limit is 2 while g(1) is 0/0.', 'Với x ≠ 1, g(x) = x + 1, nên giới hạn là 2 trong khi g(1) là 0/0.']),
    q('c5', ['As x → 0, 1/x² …', 'Khi x → 0, 1/x² …'], ['grows without bound (limit +∞)', 'tends to 0', 'tends to 1', 'has left limit −∞ and right limit +∞'], ['x² is positive on both sides, so 1/x² → +∞ from both sides; it is 1/x that splits into −∞ and +∞.', 'x² dương ở cả hai phía nên 1/x² → +∞ từ cả hai phía; 1/x mới tách thành −∞ và +∞.']),
  ],
  goiY: ['Separate "near a" from "at a".', 'Check left and right separately when the formula changes at a.'],
  loiHayGap: ['Answering f(a) when the question asks for the limit.', 'Declaring a limit exists from one side only.'],
  thuatNgu: [tn('one-sided limit', 'giới hạn một phía'), tn('continuous', 'liên tục'), tn('removable discontinuity', 'gián đoạn bỏ được')],
  khaiNiem: ['limit', 'continuity'],
});

// f(x) = x + 1 (x < 1) · 3 (x = 1) · 2x (x > 1);  g(x) = x² (x < 2) · x + 2 (x ≥ 2);  h(x) = |x|/x
const E2 = tinh({
  tieuDe: 'Limits 2 — Read one-sided limits from a piecewise function',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>For each function give the left limit, the right limit, the two-sided limit (or DNE), the value at the point (or DNE) and whether it is continuous there.</p><ul><li>f(x) = x + 1 for x &lt; 1, f(1) = 3, f(x) = 2x for x &gt; 1 — at a = 1</li><li>g(x) = x² for x &lt; 2, g(x) = x + 2 for x ≥ 2 — at a = 2</li><li>h(x) = |x| / x — at a = 0</li></ul>', '<p>Với mỗi hàm cho giới hạn trái, giới hạn phải, giới hạn hai phía (hoặc DNE), giá trị tại điểm đó (hoặc DNE) và có liên tục tại đó không.</p><ul><li>f(x) = x + 1 khi x &lt; 1, f(1) = 3, f(x) = 2x khi x &gt; 1 — tại a = 1</li><li>g(x) = x² khi x &lt; 2, g(x) = x + 2 khi x ≥ 2 — tại a = 2</li><li>h(x) = |x| / x — tại a = 0</li></ul>'),
  loai: 'table',
  bang: [bang1('b1', ['One-sided limits and continuity (write numbers, or DNE)', 'Giới hạn một phía và liên tục (ghi số, hoặc DNE)'],
    [{ ma: 'f', ten: 'Function @ a' }, { ma: 'l', ten: 'Left limit' }, { ma: 'r', ten: 'Right limit' }, { ma: 'L', ten: 'Limit' }, { ma: 'v', ten: 'Value' }, { ma: 'c', ten: 'Continuous?', luaChon: ['yes', 'no'] }],
    [
      { o: { f: 'f @ 1' }, a: { l: '2', r: '2', L: '2', v: '3', c: 'no' } },
      { o: { f: 'g @ 2' }, a: { l: '4', r: '4', L: '4', v: '4', c: 'yes' } },
      { o: { f: 'h @ 0' }, a: { l: '-1', r: '1', L: ['DNE', 'dne'], v: ['DNE', 'dne'], c: 'no' } },
    ],
    ['f: both sides give 2 but f(1) = 3 — a removable discontinuity. g: 2² = 4 and 2 + 2 = 4, g(2) = 4 — continuous. h: −1 for x < 0 and +1 for x > 0, so the limit does not exist, and h(0) is 0/0.', 'f: hai phía cùng ra 2 nhưng f(1) = 3 — gián đoạn bỏ được. g: 2² = 4 và 2 + 2 = 4, g(2) = 4 — liên tục. h: −1 khi x < 0 và +1 khi x > 0, nên giới hạn không tồn tại, còn h(0) là 0/0.'])],
  goiY: ['Use the formula that applies on each side of a.', 'Continuity needs limit = value, not just "both sides agree".'],
  loiHayGap: ['Using the formula for x > a to compute the left limit.', 'Calling f continuous because the limit exists.'],
  thuatNgu: [tn('piecewise function', 'hàm từng khúc'), tn('DNE (does not exist)', 'không tồn tại')],
  khaiNiem: ['one-sided limits'],
});

export default doiDau({
  slug: 'mae101-1-1-gioi-han',
  ten: '1.1 What a limit is',
  khoa: KHOA,
  baiHoc: 'mae101-1-1-gioi-han',
  de: [E1, E2],
});
