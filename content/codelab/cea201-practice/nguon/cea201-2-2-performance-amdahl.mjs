/** CEA201 · 2.2 — Performance: clock, CPI, MIPS, Amdahl. Mọi số do _sim.mjs tính. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, so, tab } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Performance 1 — Clock, CPI, instruction count: who controls what?',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five concept questions on the CPU performance equation <code>T = IC × CPI / f</code>.</p>', '<p>Năm câu khái niệm về công thức hiệu năng CPU <code>T = IC × CPI / f</code>.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Which factor of T = IC × CPI / f is mainly decided by the compiler and the ISA?', 'Thừa số nào của T = IC × CPI / f chủ yếu do trình biên dịch và ISA quyết định?'], ['IC (instruction count)', 'f (clock rate)', 'The size of the main memory', 'The bus width only'], ['IC depends on the ISA and on how well the compiler uses it; f depends on the technology; CPI on the organization.', 'IC phụ thuộc ISA và chất lượng trình biên dịch; f phụ thuộc công nghệ; CPI phụ thuộc tổ chức CPU.']),
    q('c2', ['A faster clock always makes a program run proportionally faster.', 'Clock nhanh hơn luôn làm chương trình chạy nhanh tỉ lệ thuận.'], ['False: CPI and memory stalls may grow, and IC does not change', 'True: T is inversely proportional to f in every case', 'True, but only for integer programs', 'False: clock rate has no influence on T'], ['T ∝ 1/f only if IC and CPI stay fixed; memory does not speed up with the clock.', 'T ∝ 1/f chỉ khi IC và CPI giữ nguyên; bộ nhớ không nhanh lên theo clock.']),
    q('c3', ['Why can MIPS be a misleading way to compare two different ISAs?', 'Vì sao MIPS có thể gây hiểu lầm khi so sánh hai ISA khác nhau?'], ['Instructions of different ISAs do different amounts of work', 'MIPS counts only floating-point operations', 'MIPS ignores the clock rate', 'MIPS is always larger for CISC'], ['One CISC instruction may do the work of several RISC instructions, so a higher MIPS rating need not mean a shorter run time.', 'Một lệnh CISC có thể làm việc của vài lệnh RISC, nên MIPS cao chưa chắc chạy ngắn hơn.']),
    q('c4', ['The best way to compare the performance of two computers for your workload is …', 'Cách tốt nhất để so sánh hiệu năng hai máy cho khối lượng công việc của bạn là …'], ['to run your real programs (or a benchmark suite that represents them) and compare execution time', 'to compare the clock rates', 'to compare the number of cores', 'to compare MIPS ratings'], ['Execution time of representative programs is the only consistent measure.', 'Thời gian chạy của các chương trình đại diện là thước đo nhất quán duy nhất.']),
    q('c5', ['Which change lowers CPI without changing the ISA?', 'Thay đổi nào làm giảm CPI mà không đổi ISA?'], ['A deeper pipeline with better branch prediction and a larger cache', 'Adding more instructions to the ISA', 'Lowering the clock rate', 'Using a bigger hard disk'], ['CPI is an organization property: caches, pipelining and prediction reduce stall cycles.', 'CPI là thuộc tính tổ chức: cache, pipeline và dự đoán rẽ nhánh giảm chu kỳ chờ.']),
  ],
  goiY: ['Write T = IC × CPI / f and ask which term a change touches.', 'MIPS = f / (CPI × 10⁶) hides how much work each instruction does.'],
  loiHayGap: ['Believing T depends on the clock rate alone.', 'Comparing machines with different ISAs by MIPS or by GHz.'],
  thuatNgu: [tn('CPI', 'số chu kỳ trung bình trên một lệnh'), tn('benchmark', 'chương trình đo chuẩn')],
  khaiNiem: ['CPU time equation', 'CPI', 'MIPS'],
});

const T = [[2e9, 1.5, 3e9], [5e8, 2.0, 2e9], [1.2e10, 0.8, 4e9], [3e9, 4.0, 1.5e9]];
const E2 = tinh({
  tieuDe: 'Performance 2 — CPU time from IC, CPI and clock rate',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Compute the CPU time <b>T = IC × CPI / f</b> in seconds for each program (give 3 decimals, e.g. <code>0.667</code>).</p>', '<p>Tính thời gian CPU <b>T = IC × CPI / f</b> (giây) cho từng chương trình (3 chữ số thập phân, vd <code>0.667</code>).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['CPU time', 'Thời gian CPU'], [{ ma: 'p', ten: 'Program' }, { ma: 't', ten: 'T (s)' }],
    T.map(([ic, cpi, f], i) => ({ o: { p: `P${i + 1}: IC = ${ic.toExponential(1)}, CPI = ${cpi}, f = ${f / 1e9} GHz` }, a: { t: r2(S.cpuTime(ic, cpi, f), 3) } })),
    ['T = IC × CPI / f. ' + T.map(([ic, cpi, f], i) => `P${i + 1}: ${S.cpuTime(ic, cpi, f).toFixed(3)} s`).join('; ') + '.', 'T = IC × CPI / f. ' + T.map(([ic, cpi, f], i) => `P${i + 1}: ${S.cpuTime(ic, cpi, f).toFixed(3)} s`).join('; ') + '.'])],
  goiY: ['Multiply IC by CPI to get the total number of cycles, then divide by f in Hz.', 'Convert GHz to Hz: × 10⁹.'],
  loiHayGap: ['Dividing by f in GHz while IC is in plain instructions (a factor of 10⁹ off).', 'Forgetting CPI.'],
  thuatNgu: [tn('IC (instruction count)', 'số lệnh thực hiện'), tn('clock rate', 'tần số xung nhịp')],
  khaiNiem: ['CPU time'],
});

const MIX = [[[0.5, 1], [0.3, 2], [0.2, 4]], [[0.4, 1], [0.4, 3], [0.2, 5]], [[0.6, 1], [0.25, 2], [0.1, 3], [0.05, 8]]];
const E3 = tinh({
  tieuDe: 'Performance 3 — Weighted CPI of an instruction mix and MIPS',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Each program is an instruction mix given as <i>fraction × CPI</i>. For a 2 GHz processor compute the average CPI (2 decimals) and the MIPS rating = f / (CPI × 10⁶) (1 decimal).</p>', '<p>Mỗi chương trình là một hỗn hợp lệnh dạng <i>tỉ lệ × CPI</i>. Với bộ xử lý 2 GHz, tính CPI trung bình (2 chữ số) và MIPS = f / (CPI × 10⁶) (1 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Average CPI and MIPS at 2 GHz', 'CPI trung bình và MIPS ở 2 GHz'], [{ ma: 'm', ten: 'Mix (fraction × CPI)' }, { ma: 'c', ten: 'Average CPI' }, { ma: 'p', ten: 'MIPS' }],
    MIX.map((mx, i) => ({ o: { m: `P${i + 1}: ` + mx.map(([a, b]) => `${a}×${b}`).join(' + ') }, a: { c: r2(S.avgCpi(mx), 2), p: r2(S.mips(2e9, S.avgCpi(mx)), 1) } })),
    ['CPI = Σ fraction × CPI. ' + MIX.map((mx, i) => `P${i + 1}: CPI ${S.avgCpi(mx).toFixed(2)}, MIPS ${S.mips(2e9, S.avgCpi(mx)).toFixed(1)}`).join('; ') + '.', 'CPI = Σ tỉ lệ × CPI. ' + MIX.map((mx, i) => `P${i + 1}: CPI ${S.avgCpi(mx).toFixed(2)}, MIPS ${S.mips(2e9, S.avgCpi(mx)).toFixed(1)}`).join('; ') + '.'])],
  goiY: ['Weighted average: multiply each fraction by its CPI and add.', 'MIPS = 2000 / CPI when f = 2 GHz.'],
  loiHayGap: ['Averaging the CPIs without weights.', 'Using f in GHz directly in the MIPS formula.'],
  thuatNgu: [tn('instruction mix', 'tỉ lệ các loại lệnh')],
  khaiNiem: ['weighted CPI', 'MIPS'],
});

const AM = [[0.5, 2], [0.8, 4], [0.9, 10], [0.95, 20]];
const E4 = tinh({
  tieuDe: 'Performance 4 — Amdahl’s law: overall speedup and its limit',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>A fraction <b>f</b> of the run time is made <b>s</b> times faster. Give the overall speedup 1 / ((1 − f) + f / s) (2 decimals) and the limit when s → ∞, i.e. 1 / (1 − f).</p>', '<p>Một phần <b>f</b> của thời gian chạy được tăng tốc <b>s</b> lần. Cho tăng tốc tổng thể 1 / ((1 − f) + f / s) (2 chữ số) và giới hạn khi s → ∞, tức 1 / (1 − f).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Speedup and limit', 'Tăng tốc và giới hạn'], [{ ma: 'p', ten: 'f, s' }, { ma: 'u', ten: 'Speedup' }, { ma: 'l', ten: 'Limit (s → ∞)' }],
    AM.map(([f, s]) => ({ o: { p: `f = ${f}, s = ${s}` }, a: { u: r2(S.amdahl(f, s), 2), l: r2(1 / (1 - f), 2) } })),
    [AM.map(([f, s]) => `f=${f}, s=${s}: ${S.amdahl(f, s).toFixed(2)} (limit ${(1 / (1 - f)).toFixed(2)})`).join('; ') + '. The serial part (1 − f) caps the benefit.', AM.map(([f, s]) => `f=${f}, s=${s}: ${S.amdahl(f, s).toFixed(2)} (giới hạn ${(1 / (1 - f)).toFixed(2)})`).join('; ') + '. Phần tuần tự (1 − f) chặn trần lợi ích.'])],
  goiY: ['Time after = (1 − f) + f / s of the old time; speedup is the reciprocal.', 'As s grows, f / s → 0.'],
  loiHayGap: ['Multiplying f by s instead of dividing.', 'Using f as the portion that is NOT improved.'],
  thuatNgu: [tn('speedup', 'hệ số tăng tốc'), tn('serial fraction', 'phần tuần tự')],
  khaiNiem: ['Amdahl’s law'],
});

const A = { name: 'A', f: 2.5e9, cpi: 1.6, ic: 1.0e9 }, B = { name: 'B', f: 3.2e9, cpi: 2.4, ic: 0.9e9 };
const tA = S.cpuTime(A.ic, A.cpi, A.f), tB = S.cpuTime(B.ic, B.cpi, B.f);
const E5 = tinh({
  tieuDe: 'Performance 5 — Which machine is faster, and by how much?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>The same program runs on two machines. ${tab(['', 'IC', 'CPI', 'f'], [['A', '1.0 × 10⁹', A.cpi, '2.5 GHz'], ['B', '0.9 × 10⁹', B.cpi, '3.2 GHz']])} Compute both CPU times (3 decimals), the speedup of the faster over the slower (2 decimals) and the MIPS of each (1 decimal).</p>`, `<p>Cùng một chương trình chạy trên hai máy. ${tab(['', 'IC', 'CPI', 'f'], [['A', '1.0 × 10⁹', A.cpi, '2.5 GHz'], ['B', '0.9 × 10⁹', B.cpi, '3.2 GHz']])} Tính thời gian CPU của cả hai (3 chữ số), hệ số nhanh hơn của máy nhanh so với máy chậm (2 chữ số) và MIPS mỗi máy (1 chữ số).</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Machine A and B', 'Máy A và B'], [{ ma: 'm', ten: 'Machine' }, { ma: 't', ten: 'T (s)' }, { ma: 'p', ten: 'MIPS' }],
    [A, B].map((x) => ({ o: { m: x.name }, a: { t: r2(S.cpuTime(x.ic, x.cpi, x.f), 3), p: r2(S.mips(x.f, x.cpi), 1) } })),
    [`T_A = ${tA.toFixed(3)} s, T_B = ${tB.toFixed(3)} s. ${tB < tA ? 'B' : 'A'} is faster by ${(Math.max(tA, tB) / Math.min(tA, tB)).toFixed(2)}×; B has the higher clock and the higher MIPS, but compare T, not GHz.`, `T_A = ${tA.toFixed(3)} s, T_B = ${tB.toFixed(3)} s. Máy ${tB < tA ? 'B' : 'A'} nhanh hơn ${(Math.max(tA, tB) / Math.min(tA, tB)).toFixed(2)} lần.`]),
  bang1('b2', ['Speedup of the faster machine', 'Hệ số nhanh hơn của máy nhanh'], [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }], [{ o: { k: 'T(slower) / T(faster)' }, a: { v: r2(Math.max(tA, tB) / Math.min(tA, tB), 2) } }], [`${Math.max(tA, tB).toFixed(3)} / ${Math.min(tA, tB).toFixed(3)} = ${(Math.max(tA, tB) / Math.min(tA, tB)).toFixed(2)}.`, `${Math.max(tA, tB).toFixed(3)} / ${Math.min(tA, tB).toFixed(3)} = ${(Math.max(tA, tB) / Math.min(tA, tB)).toFixed(2)}.`])],
  goiY: ['Compute T for each machine first; only then compare.', 'Speedup = T(slower) / T(faster).'],
  loiHayGap: ['Declaring the machine with the higher clock the winner without computing T.', 'Inverting the ratio (faster / slower).'],
  thuatNgu: [tn('speedup', 'hệ số tăng tốc')],
  khaiNiem: ['CPU time', 'speedup'],
});

const coresNeeded = function coresNeeded(f, target) {
  if (1 / (1 - f) <= target) return -1;
  var n = 1;
  while (1 / ((1 - f) + f / n) < target) n++;
  return n;
};
const E6 = jsDe({
  tieuDe: 'Performance 6 — How many cores do you need? (Amdahl, solved in code)',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>coresNeeded(f, target)</code>: the <b>smallest integer number of cores n</b> such that the Amdahl speedup <code>1 / ((1 − f) + f / n)</code> reaches <b>at least</b> <code>target</code>. If even infinitely many cores cannot reach the target (that is, <code>1 / (1 − f) ≤ target</code>), return <code>-1</code>.</p>', '<p>Viết <code>coresNeeded(f, target)</code>: <b>số nhân nguyên nhỏ nhất n</b> sao cho tăng tốc Amdahl <code>1 / ((1 − f) + f / n)</code> đạt <b>ít nhất</b> <code>target</code>. Nếu ngay cả vô hạn nhân cũng không đạt (tức <code>1 / (1 − f) ≤ target</code>) thì trả <code>-1</code>.</p>'),
  yeuCau: [bi('<code>0 &lt; f &lt; 1</code>, <code>target &gt; 1</code>.', '<code>0 &lt; f &lt; 1</code>, <code>target &gt; 1</code>.'), bi('Return an integer or -1.', 'Trả số nguyên hoặc -1.')],
  viDu: [{ input: 'coresNeeded(0.9, 5)', output: String(coresNeeded(0.9, 5)), explanation: 'With 9 cores: 1 / (0.1 + 0.9/9) = 5.0 exactly, with 8 cores only 4.7.|||Với 9 nhân: 1 / (0.1 + 0,9/9) = 5,0; với 8 nhân chỉ 4,7.' }],
  goiY: ['If 1 / (1 − f) ≤ target the answer is −1 (the serial part blocks you).', 'Otherwise increase n from 1 until the speedup reaches the target — it always terminates.', 'Beware of floating-point: compare with a tiny epsilon (1e-12) so that an exact 5.0 counts.'],
  loiHayGap: ['Forgetting the −1 case and looping forever.', 'Using “>” instead of “≥” so the exact target is missed.'],
  giaiThich: '<p>Speedup(n) is increasing in n and bounded by 1/(1−f). The loop finds the first n that reaches the target; for exact targets use a small epsilon because of floating point.</p>',
  khaiNiem: ['Amdahl', 'parallel speedup'],
  fn: 'coresNeeded',
  dau: 'function coresNeeded(f, target) {\n  return 0;\n}\n',
  giaiMa: 'function coresNeeded(f, target) {\n  // Even with infinitely many cores the speedup is capped at 1/(1-f).\n  if (1 / (1 - f) <= target) return -1;\n  var n = 1;\n  // epsilon: 1/(0.1+0.9/9) is 5 up to rounding error\n  while (1 / ((1 - f) + f / n) < target - 1e-12) n++;\n  return n;\n}\n',
  ref: (f, t) => { if (1 / (1 - f) <= t) return -1; let n = 1; while (1 / ((1 - f) + f / n) < t - 1e-12) n++; return n; },
  cases: [{ args: [0.9, 5] }, { args: [0.95, 10] }, { args: [0.5, 2] }, { args: [0.99, 50] }, { args: [0.8, 4], an: true }, { args: [0.75, 3], an: true }, { args: [0.999, 100], an: true }, { args: [0.6, 1.5], an: true }],
});

export default doiDau({
  slug: 'cea201-2-2-performance-amdahl',
  ten: '2.2 Performance: clock, CPI, MIPS & Amdahl’s law',
  khoa: KHOA,
  baiHoc: 'cea201-2-2-performance-amdahl',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai; void giai; void mc; void so;
