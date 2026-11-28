/** MAE101 · 1.2 — Computing limits: substitution, factoring, conjugates, limits at infinity, L'Hôpital (bài mae101-1-2-tinh-gioi-han). */
import { doiDau, KHOA, bi, tinh, q, tn, bang1, so, ord } from './_mae.mjs';

const E1 = tinh({
  tieuDe: 'Computing limits 1 — Which move comes next?',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Choose the right technique for each limit.</p>', '<p>Chọn đúng kỹ thuật cho từng giới hạn.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Direct substitution into (x² − 4)/(x − 2) at x = 2 gives 0/0. This means …', 'Thế trực tiếp vào (x² − 4)/(x − 2) tại x = 2 ra 0/0. Điều đó nghĩa là …'], ['the form is indeterminate: simplify first, then substitute', 'the limit is 0, because the numerator is 0', 'the limit does not exist, because we divide by 0', 'the limit is 1, because 0/0 cancels to 1'], ['0/0 says nothing yet; factoring gives x + 2, so the limit is 4.', '0/0 chưa nói lên gì; phân tích ra x + 2, nên giới hạn là 4.']),
    q('c2', ['lim x→0 (√(x + 1) − 1)/x is best handled by …', 'lim x→0 (√(x + 1) − 1)/x nên xử lý bằng …'], ['multiplying by the conjugate √(x + 1) + 1', 'substituting x = 0 directly', 'the degree rule', 'splitting into one-sided limits'], ['The conjugate removes the root: the expression becomes 1/(√(x + 1) + 1) → 1/2.', 'Liên hợp khử căn: biểu thức thành 1/(√(x + 1) + 1) → 1/2.']),
    q('c3', ['For a rational function as x → ∞ with deg(top) &lt; deg(bottom), the limit is …', 'Với hàm hữu tỉ khi x → ∞ và bậc tử &lt; bậc mẫu, giới hạn là …'], ['0', 'the ratio of the leading coefficients', '±∞', '1'], ['The bottom grows faster. Equal degrees give the ratio of leading coefficients; a larger top degree gives ±∞.', 'Mẫu lớn nhanh hơn. Bậc bằng nhau cho tỉ số hệ số cao nhất; bậc tử lớn hơn cho ±∞.']),
    q('c4', ['Which of these is NOT an indeterminate form?', 'Dạng nào sau đây KHÔNG phải dạng vô định?'], ['1/0⁺ (it tends to +∞)', '0/0', '∞ − ∞', '1^∞'], ['A non-zero number over something tending to 0⁺ is +∞ — determined. 0/0, ∞ − ∞, 0·∞, ∞/∞, 1^∞, 0⁰ and ∞⁰ are indeterminate.', 'Một số khác 0 chia cho thứ tiến về 0⁺ là +∞ — đã xác định. 0/0, ∞ − ∞, 0·∞, ∞/∞, 1^∞, 0⁰ và ∞⁰ là vô định.']),
    q('c5', ['L\'Hôpital\'s rule may be applied to lim f/g when …', 'Quy tắc L\'Hôpital được dùng cho lim f/g khi …'], ['the form is 0/0 or ∞/∞', 'the form is any fraction', 'g(a) ≠ 0', 'f and g are polynomials of the same degree'], ['Only on 0/0 or ∞/∞; elsewhere it gives wrong answers. Example: lim x→0 sin x / x = lim cos x / 1 = 1.', 'Chỉ cho 0/0 hoặc ∞/∞; ngoài ra sẽ ra kết quả sai. Ví dụ: lim x→0 sin x / x = lim cos x / 1 = 1.']),
  ],
  goiY: ['Always try substitution first.', 'If it gives 0/0, factor, rationalise or use L\'Hôpital.'],
  loiHayGap: ['Writing "0/0 = 0" or "0/0 = 1".', 'Using L\'Hôpital on a form that is not indeterminate.'],
  thuatNgu: [tn('indeterminate form', 'dạng vô định'), tn('conjugate', 'biểu thức liên hợp'), tn('leading coefficient', 'hệ số cao nhất')],
  khaiNiem: ['limit techniques'],
});

const LIM = [
  ['lim x→3 (2x + 1)', 7, 'substitute'],
  ['lim x→2 (x² − 4)/(x − 2)', 4, 'factor (x − 2)(x + 2)'],
  ['lim x→1 (x³ − 1)/(x − 1)', 3, 'x³ − 1 = (x − 1)(x² + x + 1)'],
  ['lim x→0 (√(x + 1) − 1)/x', 0.5, 'conjugate'],
  ['lim x→∞ (3x² + 1)/(x² − 5)', 3, 'equal degrees: 3/1'],
  ['lim x→∞ (2x + 5)/(x² − 1)', 0, 'top degree smaller'],
  ['lim x→0 sin(3x)/x', 3, 'sin(3x)/(3x) → 1, times 3'],
];
const E2 = tinh({
  tieuDe: 'Computing limits 2 — Seven limits from the lesson toolkit',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Compute each limit. Write an integer, or a decimal such as 0.5.</p>', '<p>Tính mỗi giới hạn. Ghi số nguyên, hoặc số thập phân như 0.5.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Compute the limit', 'Tính giới hạn'], [{ ma: 'e', ten: 'Limit' }, { ma: 'v', ten: 'Value' }],
    LIM.map(([e, v]) => ({ o: { e }, a: { v: v === 0.5 ? ['0.5', '1/2', '0.50'] : so(v) } })),
    [LIM.map(([e, v, how]) => `${e} = ${v} (${how})`).join('; ') + '.', LIM.map(([e, v, how]) => `${e} = ${v} (${how})`).join('; ') + '.'])],
  goiY: ['Substitute; if 0/0 appears, simplify.', 'At infinity compare the highest powers.'],
  loiHayGap: ['Cancelling terms instead of factors.', 'Forgetting the factor 3 in sin(3x)/x.'],
  thuatNgu: [tn('limit at infinity', 'giới hạn ở vô cực')],
  khaiNiem: ['limit computation'],
});

const E3 = tinh({
  tieuDe: 'Computing limits 3 — Order the steps for a 0/0 limit',
  doKho: 'EASY', phut: 5,
  moTa: bi('<p>Put the steps for lim x→2 (x² − 4)/(x − 2) in order.</p>', '<p>Sắp các bước tính lim x→2 (x² − 4)/(x − 2) theo đúng thứ tự.</p>'),
  loai: 'order',
  cauHoi: [ord('o1', ['Steps', 'Các bước'], ['Substitute x = 2 and get 0/0', 'Factor the top: (x − 2)(x + 2)', 'Cancel the common factor x − 2 (allowed because x ≠ 2)', 'Substitute again: 2 + 2 = 4'], ['Substitution first tells you whether simplifying is needed; the cancellation is valid because the limit never uses x = 2 itself.', 'Thế trước để biết có cần rút gọn không; rút gọn hợp lệ vì giới hạn không bao giờ dùng chính x = 2.'])],
  goiY: ['The first step is always substitution.', 'Cancel only common factors.'],
  loiHayGap: ['Cancelling before checking the form.', 'Stopping at 0/0.'],
  thuatNgu: [],
  khaiNiem: ['0/0 procedure'],
});

export default doiDau({
  slug: 'mae101-1-2-tinh-gioi-han',
  ten: '1.2 Computing limits',
  khoa: KHOA,
  baiHoc: 'mae101-1-2-tinh-gioi-han',
  de: [E1, E2, E3],
});
