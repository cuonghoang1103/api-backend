/**
 * OSG202 · 3.4 — Working set, thrashing and frame allocation.
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const REF = [1, 2, 1, 3, 2, 4, 4, 4, 5, 1, 2, 1, 6, 6, 7, 6, 6, 6, 5, 1];
const pts = [[7, 4], [12, 5], [16, 4], [19, 6], [19, 3]];
const E1 = tinh({
  tieuDe: 'Working set 1 — Compute W(t, Δ)',
  doKho: 'EASY', phut: 10,
  moTa: bi(`<p>Reference string (positions 0…19): <code>${REF.join(' ')}</code>. The working set W(t, Δ) is the set of DISTINCT pages among the last Δ references ending at position t (inclusive). For each (t, Δ) give the size |W| and the pages (sorted, separated by commas, no spaces).</p>`,
    `<p>Chuỗi tham chiếu (vị trí 0…19): <code>${REF.join(' ')}</code>. Tập làm việc W(t, Δ) là tập các trang KHÁC NHAU trong Δ tham chiếu gần nhất kết thúc tại vị trí t (gồm cả t). Với mỗi (t, Δ) cho kích thước |W| và các trang (sắp tăng dần, cách nhau bằng dấu phẩy, không dấu cách).</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Working sets', 'Tập làm việc'),
    cot: [{ ma: 'q', ten: '(t, Δ)' }, { ma: 'n', ten: '|W|' }, { ma: 'w', ten: 'Pages' }],
    hang: pts.map(([t, d]) => ({ ma: `p${t}_${d}`, o: { q: `t = ${t}, Δ = ${d}` } })),
    dapAn: Object.fromEntries(pts.flatMap(([t, d]) => { const w = S.workingSet(REF, t, d); return [[`p${t}_${d}.n`, String(w.length)], [`p${t}_${d}.w`, w.join(',')]]; })),
    giaiThich: giai(pts.map(([t, d]) => `t=${t}, Δ=${d}: refs ${REF.slice(Math.max(0, t - d + 1), t + 1).join(' ')} → {${S.workingSet(REF, t, d).join(',')}}`).join('; ') + '.', pts.map(([t, d]) => `t=${t}, Δ=${d}: {${S.workingSet(REF, t, d).join(',')}}`).join('; ') + '.'),
  }],
  goiY: ['Take the window of Δ references that ends at t (t−Δ+1 … t) and remove duplicates.', 'The working-set size is the number of frames the process needs to run without many faults.'],
  loiHayGap: ['Starting the window at t instead of ending it at t.', 'Counting repeated references (list length) instead of distinct pages.'],
  giaiThich: '<p>' + pts.map(([t, d]) => S.workingSet(REF, t, d).length).join(' · ') + '</p>',
  thuatNgu: [tn('working set', 'tập làm việc: các trang đang dùng gần đây'), tn('locality', 'tính cục bộ của tham chiếu')],
  khaiNiem: ['working set', 'locality'],
});

const prop = [[62, [10, 127]], [64, [10, 20, 30]], [100, [5, 15, 80]], [30, [40, 40, 20]]];
const E2 = tinh({
  tieuDe: 'Working set 2 — Proportional frame allocation',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>The OS shares <b>m</b> frames among processes in proportion to their sizes: process i gets ⌊size_i × m / Σsize⌋ frames. Any frames left over are handed out one at a time, starting with the largest process (ties: lower index first). Give each process’s allocation.</p>', '<p>OS chia <b>m</b> khung cho các tiến trình theo tỉ lệ kích thước: tiến trình i nhận ⌊size_i × m / Σsize⌋ khung. Khung còn dư được phát từng khung một, bắt đầu từ tiến trình lớn nhất (hoà: chỉ số nhỏ trước). Cho phần cấp phát của từng tiến trình.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Allocation', 'Cấp phát'),
    cot: [{ ma: 'c', ten: 'Frames m and process sizes' }, { ma: 'a', ten: 'Allocation (comma separated)' }],
    hang: prop.map(([m, s], i) => ({ ma: `c${i}`, o: { c: `m = ${m}, sizes = ${s.join(', ')}` } })),
    dapAn: Object.fromEntries(prop.map(([m, s], i) => [`c${i}.a`, S.proportional(m, s).join(',')])),
    giaiThich: giai(prop.map(([m, s]) => `m=${m}, sizes ${s.join('/')}: ${S.proportional(m, s).join(', ')}`).join('; ') + '.', prop.map(([m, s]) => `m=${m}, kích thước ${s.join('/')}: ${S.proportional(m, s).join(', ')}`).join('; ') + '.'),
  }],
  goiY: ['Compute the exact shares first, then floor them and look at what is left.', 'The leftover goes to the biggest processes first.'],
  loiHayGap: ['Rounding to nearest instead of flooring, so the total exceeds m.', 'Forgetting to distribute the leftover frames.'],
  giaiThich: '<p>' + prop.map(([m, s]) => S.proportional(m, s).join('+')).join(' · ') + '</p>',
  thuatNgu: [tn('proportional allocation', 'cấp phát theo tỉ lệ'), tn('equal allocation', 'cấp phát chia đều')],
  khaiNiem: ['frame allocation'],
});

const E3 = tinh({
  tieuDe: 'Working set 3 — Recognising and curing thrashing',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five questions on thrashing.</p>', '<p>Năm câu về thrashing.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which symptom pair signals thrashing?', 'Cặp triệu chứng nào báo hiệu thrashing?'], [['a', 'Very high page-fault rate and LOW CPU utilisation'], ['b', 'High CPU utilisation and few page faults'], ['c', 'Low page-fault rate and low disk use'], ['d', 'High CPU utilisation and high page-fault rate']], 'a', ['Processes spend their time waiting for the paging disk, so the CPU idles.', 'Tiến trình dành thời gian chờ đĩa phân trang nên CPU rảnh.']),
    mc('c2', ['The OS sees low CPU utilisation and, naively, starts MORE processes. What happens?', 'OS thấy CPU rảnh và ngây thơ khởi động THÊM tiến trình. Hậu quả?'], [['a', 'Even fewer frames per process → more faults → worse thrashing'], ['b', 'More work to do → the CPU is busier → utilisation rises at once'], ['c', 'Same frames per process → same faults → nothing changes'], ['d', 'More address spaces → more TLB entries → the TLB grows']], 'a', ['This feedback loop is why the long-term scheduler must watch the page-fault rate.', 'Vòng phản hồi này là lý do bộ lập lịch dài hạn phải theo dõi tỉ lệ lỗi trang.']),
    mc('c3', ['The working-set model avoids thrashing by …', 'Mô hình tập làm việc tránh thrashing bằng cách …'], [['a', 'running a process only if its working set fits in memory'], ['b', 'always using FIFO, whose faults stay low when many processes run'], ['c', 'doubling the page size each time a process starts to fault often'], ['d', 'disabling virtual memory while the fault rate of a process is high']], 'a', ['If Σ|WSS| > available frames the OS suspends (swaps out) a process.', 'Nếu Σ|WSS| > số khung hiện có, OS đình chỉ (swap out) một tiến trình.']),
    mc('c4', ['Page-fault frequency (PFF) control: a process faulting ABOVE the upper bound should …', 'Điều khiển tần suất lỗi trang (PFF): tiến trình lỗi VƯỢT cận trên nên …'], [['a', 'be given more frames'], ['b', 'lose frames'], ['c', 'be killed'], ['d', 'be given a bigger quantum']], 'a', ['Too many faults → it needs more frames; too few faults → take frames away.', 'Lỗi quá nhiều → cần thêm khung; quá ít → lấy bớt khung.']),
    mc('c5', ['Why does locality of reference make demand paging usable?', 'Vì sao tính cục bộ tham chiếu làm demand paging dùng được?'], [['a', 'Programs reuse a small set of pages, so faults are rare after warm-up'], ['b', 'Programs touch all their pages equally, so no page is ever wasted'], ['c', 'The TLB is large enough to keep every page of every running program'], ['d', 'Disks are nearly as fast as RAM, so a fault costs almost nothing']], 'a', ['Without locality (random access) nearly every reference would fault.', 'Không có tính cục bộ (truy cập ngẫu nhiên) thì gần như mọi tham chiếu đều gây lỗi.']),
  ],
  goiY: ['Thrashing = the system pages more than it computes.', 'More processes + fixed RAM = fewer frames each.'],
  loiHayGap: ['Thinking high CPU use accompanies thrashing.', 'Curing thrashing by adding more processes.'],
  thuatNgu: [tn('thrashing', 'tình trạng hệ thống thay trang liên tục, không làm việc có ích'), tn('PFF', 'tần suất lỗi trang')],
  khaiNiem: ['thrashing', 'working set', 'PFF'],
});

const sizes4 = (refs, d) => refs.map((_, t) => S.workingSet(refs, t, d).length);
const E4 = jsDe({
  tieuDe: 'Working set 4 — Working-set sizes over time and the thrashing test',
  doKho: 'HARD', phut: 20,
  moTa: bi(`<p>Write <code>wssSeries(refs, delta)</code>: for every position <code>t</code> of the reference string return the size of the working set W(t, Δ) (distinct pages among the last Δ references ending at t; at the start fewer than Δ references exist). Then write <code>mustSuspend(wssList, frames)</code>: given the working-set sizes of the running processes, return <code>true</code> when their sum exceeds the available frames (the OS must suspend a process to avoid thrashing).</p>`,
    `<p>Viết <code>wssSeries(refs, delta)</code>: với mỗi vị trí <code>t</code> của chuỗi tham chiếu, trả kích thước tập làm việc W(t, Δ) (số trang khác nhau trong Δ tham chiếu gần nhất kết thúc tại t; lúc đầu có ít hơn Δ tham chiếu). Rồi viết <code>mustSuspend(wssList, frames)</code>: cho kích thước tập làm việc của các tiến trình đang chạy, trả <code>true</code> khi tổng vượt số khung hiện có (OS phải đình chỉ một tiến trình để tránh thrashing).</p>`),
  yeuCau: [bi('<code>wssSeries</code> returns an array of the same length as <code>refs</code>.', '<code>wssSeries</code> trả mảng cùng độ dài với <code>refs</code>.')],
  viDu: [{ input: 'wssSeries([1,2,1,3], 2)', output: JSON.stringify(sizes4([1, 2, 1, 3], 2)), explanation: 'Windows: {1}, {1,2}, {2,1}, {1,3}.|||Cửa sổ: {1}, {1,2}, {2,1}, {1,3}.' }],
  goiY: ['For each t slice refs from max(0, t − Δ + 1) to t and build a Set.', 'mustSuspend is just a comparison of a sum with a number.'],
  loiHayGap: ['Using a window of Δ + 1 references.', 'Comparing the maximum WSS instead of the SUM.'],
  giaiThich: '<p>The set of a window is its distinct pages; the OS invariant is Σ WSS_i ≤ m.</p>',
  khaiNiem: ['working set', 'thrashing'],
  fn: 'wssSeries',
  dau: "function wssSeries(refs, delta) {\n  return [];\n}\nfunction mustSuspend(wssList, frames) {\n  return false;\n}\n",
  giaiMa: "function wssSeries(refs, delta) {\n  return refs.map(function (_, t) {\n    var s = {};\n    for (var i = Math.max(0, t - delta + 1); i <= t; i++) s[refs[i]] = true;\n    return Object.keys(s).length;\n  });\n}\nfunction mustSuspend(wssList, frames) {\n  return wssList.reduce(function (a, b) { return a + b; }, 0) > frames;\n}\n",
  ref: sizes4,
  cases: [{ args: [[1, 2, 1, 3], 2] }, { args: [REF, 4] }, { args: [REF, 8] }, { args: [[5, 5, 5, 5], 3], an: true }, { args: [[1, 2, 3, 4, 5], 1], an: true }],
  kiemThem: [
    { moTa: bi('mustSuspend: sum 70 > 64', 'mustSuspend: tổng 70 > 64'), goi: 'mustSuspend([30, 25, 15], 64)', mongDoi: true },
    { moTa: bi('mustSuspend: exactly fits', 'mustSuspend: vừa khít'), goi: 'mustSuspend([30, 25, 9], 64)', mongDoi: false, an: true },
  ],
});

export default doiDau({
  slug: 'osg202-3-4-thrashing',
  ten: '3.4 Working set, thrashing & frame allocation',
  khoa: KHOA,
  baiHoc: 'osg202-3-4-thrashing',
  de: [E1, E2, E3, E4],
});
void hai; void dat;
