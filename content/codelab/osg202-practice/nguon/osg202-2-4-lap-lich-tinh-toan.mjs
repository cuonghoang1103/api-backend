/**
 * OSG202 · 2.4 — Scheduling algorithms, calculated (FCFS · SJF · SRTF · RR · Priority). Mọi con số do _sim.mjs tính.
 */
import { doiDau, KHOA, S, bi, hai, giai, lc, tab, so, gantt, theoDonVi, tinh, jsDe, dat, nguon, L } from './_os.mjs';

const CONV = 'Ties: earlier arrival first, then the order listed. Context-switch time is 0. In Round Robin a process that arrives at the exact instant a quantum ends is queued <b>before</b> the preempted process.';
const CONV_VI = 'Hoà: đến trước chạy trước, rồi theo thứ tự liệt kê. Thời gian chuyển ngữ cảnh = 0. Với Round Robin, tiến trình đến đúng lúc hết lượt được xếp vào hàng <b>trước</b> tiến trình bị cắt.';
const dsProc = (ps, pr) => tab(['Process', 'Arrival', 'Burst', ...(pr ? ['Priority (1 = highest)'] : [])], ps.map((p) => [p.id, p.at, p.bt, ...(pr ? [p.pr] : [])]));

/* ── Bài 1 (EASY): FCFS ── */
const P1 = [{ id: 'P1', at: 0, bt: 5 }, { id: 'P2', at: 1, bt: 3 }, { id: 'P3', at: 2, bt: 8 }, { id: 'P4', at: 3, bt: 2 }];
const r1 = S.schedule('FCFS', P1);
const E1 = tinh({
  tieuDe: 'Scheduling 1 — FCFS: completion, turnaround and waiting time',
  doKho: 'EASY', phut: 8,
  moTa: bi(`<p>Four processes arrive at a single CPU. Schedule them with <b>First-Come First-Served</b> (non-preemptive) and fill in the table. Turnaround = completion − arrival; waiting = turnaround − burst.</p>${dsProc(P1)}<p>${CONV}</p>`,
    `<p>Bốn tiến trình đến một CPU. Lập lịch <b>First-Come First-Served</b> (không ngắt) rồi điền bảng. Turnaround = hoàn thành − đến; waiting = turnaround − burst.</p>${dsProc(P1)}<p>${CONV_VI}</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('FCFS results', 'Kết quả FCFS'),
    cot: [{ ma: 'p', ten: 'Process' }, { ma: 'ct', ten: 'Completion' }, { ma: 'tat', ten: 'Turnaround' }, { ma: 'wt', ten: 'Waiting' }],
    hang: P1.map((p) => ({ ma: p.id, o: { p: p.id } })),
    dapAn: Object.fromEntries(P1.flatMap((p) => [[`${p.id}.ct`, String(r1.ct[p.id])], [`${p.id}.tat`, String(r1.tat[p.id])], [`${p.id}.wt`, String(r1.wt[p.id])]])),
    giaiThich: giai(`Gantt: ${gantt(r1.gantt)}. The CPU never idles because each process has already arrived when its turn comes. Sum of waiting times = ${r1.sumWt}, average ${r1.avgWt}.`, `Gantt: ${gantt(r1.gantt)}. CPU không rảnh vì khi tới lượt, tiến trình nào cũng đã đến. Tổng waiting = ${r1.sumWt}, trung bình ${r1.avgWt}.`),
  }],
  goiY: ['Draw the Gantt chart first: the order is just the arrival order.', 'Waiting time = start time − arrival time for a non-preemptive algorithm (a process only waits before it first runs).'],
  loiHayGap: ['Computing waiting time as completion − burst (forgetting to subtract the arrival time).', 'Starting P2 at time 0 instead of when P1 finishes.'],
  giaiThich: `<p>${gantt(r1.gantt)}. Waiting: ${P1.map((p) => `${p.id}=${r1.wt[p.id]}`).join(', ')}.</p>`,
  thuatNgu: [{ en: 'turnaround time', vi: 'thời gian hoàn thành: từ lúc đến tới lúc xong' }, { en: 'waiting time', vi: 'thời gian chờ trong hàng đợi sẵn sàng' }, { en: 'FCFS', vi: 'đến trước phục vụ trước' }],
  khaiNiem: ['FCFS', 'turnaround time', 'waiting time'],
});

/* ── Bài 2 (EASY): lý thuyết, choice ── */
const E2 = tinh({
  tieuDe: 'Scheduling 2 — Which algorithm? (convoy effect, starvation, quantum)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five short questions on the properties of the classic CPU-scheduling algorithms.</p>', '<p>Năm câu ngắn về tính chất của các thuật toán lập lịch CPU kinh điển.</p>'),
  loai: 'choice',
  cauHoi: [
    { ma: 'c1', de: hai('One CPU-bound process holds the CPU for a long time while many short I/O-bound processes queue behind it. This is called the …', 'Một tiến trình nặng CPU giữ CPU rất lâu trong khi nhiều tiến trình I/O ngắn xếp hàng sau nó. Hiện tượng này gọi là …'),
      luaChon: lc(['a', 'Convoy effect'], ['b', 'Thrashing'], ['c', 'Belady anomaly'], ['d', 'Priority inversion']), dapAn: ['a'], giaiThich: giai('The convoy effect appears with FCFS: short jobs wait behind one long job.', 'Convoy effect xảy ra với FCFS: việc ngắn chờ sau một việc dài.') },
    { ma: 'c2', de: hai('Which non-preemptive algorithm gives the MINIMUM average waiting time when all burst times are known and all processes arrive together?', 'Thuật toán không ngắt nào cho thời gian chờ trung bình NHỎ NHẤT khi biết trước burst và mọi tiến trình đến cùng lúc?'),
      luaChon: lc(['a', 'FCFS'], ['b', 'SJF'], ['c', 'Round Robin'], ['d', 'Priority']), dapAn: ['b'], giaiThich: giai('SJF is provably optimal for average waiting time (running short jobs first lowers the waiting of every job behind them).', 'SJF tối ưu về waiting trung bình (chạy việc ngắn trước làm giảm chờ của mọi việc phía sau).') },
    { ma: 'c3', de: hai('A low-priority process may never get the CPU while higher-priority processes keep arriving. The usual cure is …', 'Tiến trình ưu tiên thấp có thể không bao giờ được CPU khi tiến trình ưu tiên cao liên tục đến. Cách chữa thường dùng là …'),
      luaChon: lc(['a', 'Aging — gradually raise the priority of waiting processes'], ['b', 'A bigger quantum'], ['c', 'Switching to FCFS in the same queue'], ['d', 'Disabling interrupts']), dapAn: ['a'], giaiThich: giai('Starvation is cured by aging: priority grows with waiting time.', 'Đói tài nguyên (starvation) được chữa bằng aging: ưu tiên tăng theo thời gian chờ.') },
    { ma: 'c4', de: hai('Round Robin with a very LARGE quantum behaves like …', 'Round Robin với quantum RẤT LỚN hoạt động giống …'),
      luaChon: lc(['a', 'FCFS'], ['b', 'SJF'], ['c', 'SRTF'], ['d', 'Priority scheduling']), dapAn: ['a'], giaiThich: giai('If the quantum exceeds every burst, each process finishes in its first turn, so the order is the arrival order: FCFS.', 'Quantum lớn hơn mọi burst thì mỗi tiến trình xong ngay lượt đầu, thứ tự = thứ tự đến: FCFS.') },
    { ma: 'c5', de: hai('Which statement about preemptive SJF (SRTF) is TRUE?', 'Phát biểu nào về SJF có ngắt (SRTF) là ĐÚNG?'),
      luaChon: lc(['a', 'A newly arrived process with a shorter remaining time takes the CPU at once'], ['b', 'It can never starve a long process'], ['c', 'It needs no knowledge of burst times'], ['d', 'It has fewer context switches than non-preemptive SJF']), dapAn: ['a'], giaiThich: giai('SRTF compares the new arrival with the REMAINING time of the running process and preempts if shorter. It must know (estimate) burst times, can starve long processes, and switches more often than SJF.', 'SRTF so burst của tiến trình mới với thời gian CÒN LẠI của tiến trình đang chạy và ngắt nếu ngắn hơn. Nó cần biết (ước lượng) burst, có thể làm đói việc dài, và chuyển ngữ cảnh nhiều hơn SJF.') },
  ],
  goiY: ['Read the key words: “long job blocks short jobs”, “optimal”, “never gets the CPU”.', 'Think about the extreme quantum values for Round Robin: 1 unit vs infinity.'],
  loiHayGap: ['Confusing starvation (priority scheduling, SRTF) with deadlock (circular wait).', 'Believing that Round Robin is “better than FCFS” for every metric — it usually has a larger average turnaround for equal bursts.'],
  giaiThich: '<p>a · b · a · a · a.</p>',
  thuatNgu: [{ en: 'convoy effect', vi: 'hiệu ứng đoàn xe: việc ngắn kẹt sau việc dài' }, { en: 'starvation', vi: 'đói: tiến trình chờ vô hạn' }, { en: 'aging', vi: 'lão hoá: tăng ưu tiên theo thời gian chờ' }],
  khaiNiem: ['convoy effect', 'starvation', 'aging'],
});

/* ── Bài 3 (MEDIUM): SJF vs SRTF ── */
const P3 = [{ id: 'P1', at: 0, bt: 7 }, { id: 'P2', at: 2, bt: 4 }, { id: 'P3', at: 4, bt: 1 }, { id: 'P4', at: 5, bt: 4 }];
const sjf = S.schedule('SJF', P3); const srt = S.schedule('SRTF', P3);
const E3 = tinh({
  tieuDe: 'Scheduling 3 — SJF (non-preemptive) versus SRTF (preemptive)',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Schedule the same four processes with non-preemptive <b>SJF</b> and with preemptive <b>SJF = SRTF</b>. Fill in completion and waiting times and the average waiting time (2 decimals).</p>${dsProc(P3)}<p>${CONV}</p>`,
    `<p>Lập lịch cùng bốn tiến trình bằng <b>SJF</b> không ngắt và <b>SJF có ngắt = SRTF</b>. Điền thời gian hoàn thành, waiting và waiting trung bình (2 chữ số thập phân).</p>${dsProc(P3)}<p>${CONV_VI}</p>`),
  loai: 'table',
  bang: [{
    ma: 'sjf', de: hai('Non-preemptive SJF', 'SJF không ngắt'),
    cot: [{ ma: 'p', ten: 'Process' }, { ma: 'ct', ten: 'Completion' }, { ma: 'wt', ten: 'Waiting' }],
    hang: [...P3.map((p) => ({ ma: p.id, o: { p: p.id } })), { ma: 'avg', o: { p: 'Average waiting', ct: '—' } }],
    dapAn: { ...Object.fromEntries(P3.flatMap((p) => [[`${p.id}.ct`, String(sjf.ct[p.id])], [`${p.id}.wt`, String(sjf.wt[p.id])]])), 'avg.wt': so(sjf.avgWt) },
    giaiThich: giai(`Gantt: ${gantt(sjf.gantt)}. P1 starts at 0 (the only process) and cannot be preempted, so P2/P3/P4 are chosen by shortest burst when it ends at ${sjf.ct.P1}.`, `Gantt: ${gantt(sjf.gantt)}. P1 chạy từ 0 (lúc đó chỉ có nó) và không bị ngắt; khi P1 xong ở ${sjf.ct.P1} mới chọn theo burst ngắn nhất.`),
  }, {
    ma: 'srt', de: hai('Preemptive SJF (SRTF)', 'SJF có ngắt (SRTF)'),
    cot: [{ ma: 'p', ten: 'Process' }, { ma: 'ct', ten: 'Completion' }, { ma: 'wt', ten: 'Waiting' }],
    hang: [...P3.map((p) => ({ ma: p.id, o: { p: p.id } })), { ma: 'avg', o: { p: 'Average waiting', ct: '—' } }],
    dapAn: { ...Object.fromEntries(P3.flatMap((p) => [[`${p.id}.ct`, String(srt.ct[p.id])], [`${p.id}.wt`, String(srt.wt[p.id])]])), 'avg.wt': so(srt.avgWt) },
    giaiThich: giai(`Gantt: ${gantt(srt.gantt)}. Every time unit the process with the shortest REMAINING time runs; P1 is preempted at t=2 (remaining 5 > 4).`, `Gantt: ${gantt(srt.gantt)}. Mỗi đơn vị thời gian chạy tiến trình có thời gian CÒN LẠI ngắn nhất; P1 bị ngắt ở t=2 (còn 5 > 4).`),
  }],
  goiY: ['For SRTF re-decide at every arrival: compare the new burst with the REMAINING time of the running process.', 'Average waiting = (sum of waiting) / 4. SRTF is never worse than SJF for this metric.'],
  loiHayGap: ['In SRTF comparing the new process’s burst with the running process’s ORIGINAL burst instead of its remaining time.', 'In non-preemptive SJF switching to P3 the moment it arrives at t=4 although P1 is still running.'],
  giaiThich: `<p>SJF: ${gantt(sjf.gantt)} avg wait ${sjf.avgWt}. SRTF: ${gantt(srt.gantt)} avg wait ${srt.avgWt}.</p>`,
  thuatNgu: [{ en: 'SRTF', vi: 'shortest remaining time first — SJF có ngắt' }, { en: 'preemption', vi: 'ngắt/chiếm quyền CPU' }],
  khaiNiem: ['SJF', 'SRTF', 'preemption'],
});

/* ── Bài 4 (MEDIUM): RR q = 3 ── */
const P4 = [{ id: 'P1', at: 0, bt: 8 }, { id: 'P2', at: 1, bt: 4 }, { id: 'P3', at: 2, bt: 9 }, { id: 'P4', at: 3, bt: 5 }];
const rr = S.schedule('RR', P4, 3);
const dsLat = rr.gantt.map(([id, s, e]) => `${id}@${s}`);
const E4 = tinh({
  tieuDe: 'Scheduling 4 — Round Robin (q = 3): the order of the time slices',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Round Robin with quantum <b>q = 3</b>. Put the first <b>eight time slices</b> of the Gantt chart in order (each item is “process@start time”), then answer the questions below.</p>${dsProc(P4)}<p>${CONV}</p>`,
    `<p>Round Robin với quantum <b>q = 3</b>. Xếp <b>tám lát thời gian đầu tiên</b> của biểu đồ Gantt theo thứ tự (mỗi mục là “tiến trình@thời điểm bắt đầu”), rồi trả lời các câu sau.</p>${dsProc(P4)}<p>${CONV_VI}</p>`),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('First eight slices of the RR (q = 3) Gantt chart', 'Tám lát đầu của biểu đồ Gantt RR (q = 3)'),
    muc: (() => { const ds = dsLat.slice(0, 8).map((t, i) => ({ ma: `s${i + 1}`, noiDung: t })); return [5, 2, 7, 0, 3, 6, 1, 4].map((k) => ds[k]); })(),
    dapAn: dsLat.slice(0, 8).map((_, i) => `s${i + 1}`),
    giaiThich: giai(`Full Gantt: ${gantt(rr.gantt)}. Queue after t=0: P1 runs 0–3, meanwhile P2 (t=1), P3 (t=2) arrive; P4 arrives at t=3 exactly when P1 is preempted, so P4 is queued BEFORE P1.`, `Gantt đầy đủ: ${gantt(rr.gantt)}. P1 chạy 0–3; P2 (t=1), P3 (t=2) đến trong lúc đó; P4 đến đúng t=3 lúc P1 bị cắt nên P4 xếp trước P1.`),
  }, {
    ma: 'q2', de: hai('Order in which the four processes COMPLETE (first to last)', 'Thứ tự bốn tiến trình HOÀN THÀNH (sớm nhất đến muộn nhất)'),
    muc: (() => { const xs = Object.keys(rr.ct).sort((a, b) => rr.ct[a] - rr.ct[b]); return ['P3', 'P1', 'P4', 'P2'].map((id) => ({ ma: id, noiDung: `${id}` })).sort((a, b) => xs.indexOf(b.ma) - xs.indexOf(a.ma)).map((m) => m); })(),
    dapAn: Object.keys(rr.ct).sort((a, b) => rr.ct[a] - rr.ct[b]),
    giaiThich: giai(`Completion times: ${P4.map((p) => `${p.id}=${rr.ct[p.id]}`).join(', ')} (average waiting ${rr.avgWt}).`, `Thời điểm xong: ${P4.map((p) => `${p.id}=${rr.ct[p.id]}`).join(', ')} (waiting TB ${rr.avgWt}).`),
  }],
  goiY: ['Keep a queue on paper. At the end of each slice first add the processes that have arrived by then, THEN put the preempted process at the back.', 'A process with remaining time < q uses only what it needs; the next one starts immediately.'],
  loiHayGap: ['Putting the preempted process back before the process that arrived at the same instant.', 'Giving a process a full quantum when it only needs 1 more unit (the slice is shorter).'],
  giaiThich: `<p>${gantt(rr.gantt)}.</p>`,
  thuatNgu: [{ en: 'quantum (time slice)', vi: 'lượng tử thời gian mỗi lượt' }, { en: 'ready queue', vi: 'hàng đợi sẵn sàng' }],
  khaiNiem: ['Round Robin', 'time quantum', 'ready queue'],
});

/* ── Bài 5 (MEDIUM): RR choose q, metrics ── */
const P5 = [{ id: 'A', at: 0, bt: 6 }, { id: 'B', at: 0, bt: 3 }, { id: 'C', at: 0, bt: 1 }, { id: 'D', at: 0, bt: 7 }];
const qs = [1, 2, 4, 8];
const cs = (r) => r.gantt.length - 1;
const E5 = tinh({
  tieuDe: 'Scheduling 5 — How the quantum changes Round Robin',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Four processes arrive together at t = 0 (bursts A=6, B=3, C=1, D=7). For each quantum, compute the average waiting time (2 decimals) and the number of <b>context switches</b> between different processes (count each boundary between two consecutive Gantt slices of <i>different</i> processes).</p>${dsProc(P5)}`,
    `<p>Bốn tiến trình cùng đến t = 0 (burst A=6, B=3, C=1, D=7). Với mỗi quantum hãy tính waiting trung bình (2 chữ số thập phân) và số lần <b>chuyển ngữ cảnh</b> giữa các tiến trình khác nhau (đếm mỗi ranh giới giữa hai lát Gantt liên tiếp của tiến trình <i>khác nhau</i>).</p>${dsProc(P5)}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Effect of q', 'Ảnh hưởng của q'),
    cot: [{ ma: 'q', ten: 'Quantum' }, { ma: 'w', ten: 'Average waiting' }, { ma: 'cs', ten: 'Context switches' }],
    hang: qs.map((q) => ({ ma: `q${q}`, o: { q: String(q) } })),
    dapAn: Object.fromEntries(qs.flatMap((q) => { const r = S.schedule('RR', P5, q); return [[`q${q}.w`, so(r.avgWt)], [`q${q}.cs`, String(cs(r))]]; })),
    giaiThich: giai(qs.map((q) => { const r = S.schedule('RR', P5, q); return `q=${q}: avg wait ${r.avgWt}, ${cs(r)} switches`; }).join('; ') + '. A larger quantum means fewer switches; at q ≥ 7 it equals FCFS.', qs.map((q) => { const r = S.schedule('RR', P5, q); return `q=${q}: waiting TB ${r.avgWt}, ${cs(r)} lần chuyển`; }).join('; ') + '. Quantum lớn ⇒ ít chuyển hơn; từ q ≥ 7 giống FCFS.'),
  }],
  goiY: ['With q = 1 every slice is one unit: the Gantt chart is a rotation A B C D A B D A B D A D A D D.', 'The switches are (number of Gantt slices − 1) once adjacent slices of the same process are merged.'],
  loiHayGap: ['Counting a “switch” when the same process simply continues into a new quantum (it is not a switch if the ready queue is empty).', 'Averaging completion times instead of waiting times.'],
  giaiThich: '<p>' + qs.map((q) => { const r = S.schedule('RR', P5, q); return `q=${q}: ${r.avgWt} / ${cs(r)}`; }).join(' · ') + '</p>',
  thuatNgu: [{ en: 'context switch', vi: 'chuyển ngữ cảnh: lưu/nạp trạng thái tiến trình' }],
  khaiNiem: ['Round Robin', 'quantum', 'context switch overhead'],
});

/* ── Bài 6 (MEDIUM): Priority ── */
const P6 = [{ id: 'P1', at: 0, bt: 6, pr: 3 }, { id: 'P2', at: 1, bt: 4, pr: 1 }, { id: 'P3', at: 2, bt: 3, pr: 4 }, { id: 'P4', at: 3, bt: 5, pr: 2 }];
const pn = S.schedule('PRIORITY', P6); const pp = S.schedule('PRIORITY_P', P6);
const E6 = tinh({
  tieuDe: 'Scheduling 6 — Priority scheduling: non-preemptive and preemptive',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>A smaller number means a higher priority. Compute the completion time of each process under non-preemptive and preemptive priority scheduling.</p>${dsProc(P6, true)}<p>${CONV}</p>`,
    `<p>Số nhỏ = ưu tiên cao. Tính thời điểm hoàn thành của từng tiến trình khi lập lịch ưu tiên không ngắt và có ngắt.</p>${dsProc(P6, true)}<p>${CONV_VI}</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Completion times', 'Thời điểm hoàn thành'),
    cot: [{ ma: 'p', ten: 'Process' }, { ma: 'np', ten: 'Non-preemptive' }, { ma: 'pp', ten: 'Preemptive' }],
    hang: P6.map((p) => ({ ma: p.id, o: { p: p.id } })),
    dapAn: Object.fromEntries(P6.flatMap((p) => [[`${p.id}.np`, String(pn.ct[p.id])], [`${p.id}.pp`, String(pp.ct[p.id])]])),
    giaiThich: giai(`Non-preemptive: ${gantt(pn.gantt)} (avg wait ${pn.avgWt}). Preemptive: ${gantt(pp.gantt)} (avg wait ${pp.avgWt}). P2 (priority 1) preempts P1 at t=1 in the preemptive version.`, `Không ngắt: ${gantt(pn.gantt)} (waiting TB ${pn.avgWt}). Có ngắt: ${gantt(pp.gantt)} (waiting TB ${pp.avgWt}). P2 (ưu tiên 1) chiếm CPU của P1 ở t=1 khi có ngắt.`),
  }],
  goiY: ['Non-preemptive: when the CPU becomes free pick the highest priority among those that have ALREADY ARRIVED.', 'Preemptive: whenever a process arrives with a better priority than the running one it takes over immediately.'],
  loiHayGap: ['Reading “priority 4” as the highest priority (the convention here is 1 = highest).', 'Letting a process that has not arrived yet compete when the CPU becomes free.'],
  giaiThich: `<p>NP: ${P6.map((p) => `${p.id}=${pn.ct[p.id]}`).join(', ')} · P: ${P6.map((p) => `${p.id}=${pp.ct[p.id]}`).join(', ')}.</p>`,
  thuatNgu: [{ en: 'priority inversion', vi: 'đảo ngược ưu tiên: việc ưu tiên cao chờ việc thấp giữ khoá' }],
  khaiNiem: ['priority scheduling', 'preemption'],
});

/* ── Bài 7 (HARD): viết hàm schedule ── */
const refSched = (algo, procs, q) => { const r = S.schedule(algo, procs, q); return { ct: r.ct, wt: r.wt, avgWt: r.avgWt }; };
const case1 = [{ id: 'A', at: 0, bt: 5 }, { id: 'B', at: 1, bt: 3 }, { id: 'C', at: 2, bt: 1 }];
const case2 = [{ id: 'P1', at: 0, bt: 7 }, { id: 'P2', at: 2, bt: 4 }, { id: 'P3', at: 4, bt: 1 }, { id: 'P4', at: 5, bt: 4 }];
const case3 = [{ id: 'X', at: 0, bt: 4, pr: 2 }, { id: 'Y', at: 1, bt: 2, pr: 1 }, { id: 'Z', at: 20, bt: 3, pr: 1 }];
const E7 = jsDe({
  tieuDe: 'Scheduling 7 — Write a CPU-scheduler simulator',
  doKho: 'HARD', phut: 30,
  moTa: bi(`<p>Write <code>schedule(algo, procs, quantum)</code>. <code>procs</code> is an array of <code>{ id, at, bt, pr }</code> (<code>pr</code> may be missing: use 0). <code>algo</code> is one of <code>'FCFS'</code>, <code>'SJF'</code>, <code>'SRTF'</code>, <code>'PRIORITY'</code> (non-preemptive), <code>'PRIORITY_P'</code> (preemptive), <code>'RR'</code> (uses <code>quantum</code>).</p>
<p>Return <code>{ ct, wt, avgWt }</code>: <code>ct[id]</code> completion time, <code>wt[id]</code> waiting time (turnaround − burst), <code>avgWt</code> the average waiting time rounded to 2 decimals (<code>Math.round(x*100)/100</code>). The CPU may be idle if nothing has arrived. ${CONV}</p>`,
    `<p>Viết <code>schedule(algo, procs, quantum)</code>. <code>procs</code> là mảng <code>{ id, at, bt, pr }</code> (<code>pr</code> có thể thiếu: coi là 0). <code>algo</code> là một trong <code>'FCFS'</code>, <code>'SJF'</code>, <code>'SRTF'</code>, <code>'PRIORITY'</code> (không ngắt), <code>'PRIORITY_P'</code> (có ngắt), <code>'RR'</code> (dùng <code>quantum</code>).</p>
<p>Trả về <code>{ ct, wt, avgWt }</code>: <code>ct[id]</code> thời điểm xong, <code>wt[id]</code> waiting (turnaround − burst), <code>avgWt</code> waiting trung bình làm tròn 2 chữ số. CPU có thể rảnh khi chưa ai đến. ${CONV_VI}</p>`),
  yeuCau: [bi('Implement all six algorithms in one function.', 'Cài cả sáu thuật toán trong một hàm.'), bi('Return plain objects keyed by process id.', 'Trả đối tượng thường, khoá là id tiến trình.')],
  viDu: [{ input: "schedule('FCFS', [{id:'A',at:0,bt:5},{id:'B',at:1,bt:3},{id:'C',at:2,bt:1}])", output: JSON.stringify(refSched('FCFS', case1)), explanation: 'A 0–5, B 5–8, C 8–9: waiting 0, 4, 6, average 3.33.|||A 0–5, B 5–8, C 8–9: waiting 0, 4, 6, trung bình 3,33.' }],
  goiY: ['Build one loop over time: “which process is READY now?” (at ≤ t and remaining > 0), then each algorithm is just a different sort key.', 'SRTF and PRIORITY_P re-decide every time unit; RR keeps a queue and pushes newly arrived processes before the preempted one.', 'Waiting time = completion − arrival − burst. Do not forget the idle jump when nothing is ready.'],
  loiHayGap: ['Letting a process that has not arrived (at > t) run, or never advancing the clock when the ready set is empty (infinite loop).', 'In Round Robin re-queueing the preempted process before adding the processes that arrived during its slice.', 'Rounding each waiting time instead of only the average.'],
  giaiThich: '<p>One generic simulator: the ready set depends only on <code>at ≤ t</code> and remaining burst; the algorithms differ in the sort key and in whether the decision is re-made every unit (SRTF, PRIORITY_P) or only when the CPU is free (FCFS, SJF, PRIORITY). RR keeps its own queue.</p><p><i>VI: Một bộ mô phỏng chung: tập sẵn sàng chỉ phụ thuộc at ≤ t và burst còn lại; các thuật toán khác nhau ở khoá sắp xếp và việc quyết định lại mỗi đơn vị (SRTF, PRIORITY_P) hay chỉ khi CPU rảnh (FCFS, SJF, PRIORITY). RR có hàng đợi riêng.</i></p>',
  thuatNgu: [{ en: 'ready set', vi: 'tập tiến trình sẵn sàng: đã đến và còn burst' }],
  khaiNiem: ['CPU scheduling', 'simulation'],
  fn: 'schedule',
  dau: "// Return { ct, wt, avgWt }. See the statement for the tie-break rules.\nfunction schedule(algo, procs, quantum) {\n  // TODO: simulate the CPU clock\n  return { ct: {}, wt: {}, avgWt: 0 };\n}\n",
  giaiMa: '// Reference solution: a generic discrete-time simulator.\n' + dat(S.schedule, 'schedule').replace('return { gantt, ct, tat, wt, rt, sumWt: sw, sumTat: st, avgWt: lam2(sw / n), avgTat: lam2(st / n), avgRt: lam2(sr / n), end: t };', 'return { ct, wt, avgWt: lam2(sw / n) };'),
  ref: refSched,
  cases: [
    { args: ['FCFS', case1] },
    { args: ['SJF', case2] },
    { args: ['SRTF', case2] },
    { args: ['RR', case2, 3] },
    { args: ['PRIORITY', [{ id: 'P1', at: 0, bt: 6, pr: 3 }, { id: 'P2', at: 1, bt: 4, pr: 1 }, { id: 'P3', at: 2, bt: 3, pr: 4 }, { id: 'P4', at: 3, bt: 5, pr: 2 }]] },
    { args: ['PRIORITY_P', case3], moTa: bi('Preemptive priority with an idle gap (Z arrives at t = 20)', 'Ưu tiên có ngắt, có khoảng CPU rảnh (Z đến ở t = 20)') },
    { args: ['RR', [{ id: 'A', at: 0, bt: 5 }, { id: 'B', at: 1, bt: 3 }, { id: 'C', at: 2, bt: 1 }, { id: 'D', at: 3, bt: 2 }, { id: 'E', at: 9, bt: 2 }], 2], an: true },
    { args: ['SRTF', [{ id: 'A', at: 3, bt: 2 }, { id: 'B', at: 0, bt: 9 }, { id: 'C', at: 1, bt: 3 }, { id: 'D', at: 30, bt: 1 }]], an: true },
    { args: ['SJF', [{ id: 'A', at: 5, bt: 2 }, { id: 'B', at: 5, bt: 2 }, { id: 'C', at: 0, bt: 3 }]], an: true },
  ],
});

export default doiDau({
  slug: 'osg202-2-4-lap-lich-tinh-toan',
  ten: '2.4 Scheduling algorithms, calculated',
  khoa: KHOA,
  baiHoc: 'osg202-2-4-lap-lich-tinh-toan',
  de: [E1, E2, E3, E4, E5, E6, E7],
});
void L;
