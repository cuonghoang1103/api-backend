/**
 * OSG202 · LAB chương 2 — So sánh các thuật toán lập lịch trên cùng một tải (báo cáo giống phần “Result analysis” của lab).
 */
import { doiDau, KHOA, S, bi, tab, jsDe, dat } from './_os.mjs';

const ALGOS = ['FCFS', 'SJF', 'SRTF', 'RR'];
const w1 = [{ id: 'A', at: 0, bt: 8 }, { id: 'B', at: 1, bt: 4 }, { id: 'C', at: 2, bt: 9 }, { id: 'D', at: 3, bt: 5 }];
const w2 = [{ id: 'A', at: 0, bt: 24 }, { id: 'B', at: 0, bt: 3 }, { id: 'C', at: 0, bt: 3 }];
const w3 = [{ id: 'A', at: 0, bt: 5 }, { id: 'B', at: 2, bt: 2 }, { id: 'C', at: 4, bt: 1 }, { id: 'D', at: 20, bt: 3 }];
const w4 = [{ id: 'P1', at: 0, bt: 6 }, { id: 'P2', at: 1, bt: 6 }, { id: 'P3', at: 2, bt: 6 }, { id: 'P4', at: 3, bt: 6 }];
const w5 = [{ id: 'X', at: 0, bt: 1 }, { id: 'Y', at: 0, bt: 1 }, { id: 'Z', at: 0, bt: 10 }, { id: 'W', at: 5, bt: 2 }, { id: 'V', at: 5, bt: 2 }];

// ref chạy ở Node: dựng từ cùng mã
const refReport = (procs, q) => {
  const out = { algos: {}, bestWt: null, bestRt: null };
  ALGOS.forEach((a) => { const r = S.schedule(a, procs, q); out.algos[a] = { avgWt: r.avgWt, avgTat: r.avgTat, avgRt: r.avgRt, switches: r.gantt.length - 1 }; });
  ALGOS.forEach((a) => {
    if (out.bestWt === null || out.algos[a].avgWt < out.algos[out.bestWt].avgWt) out.bestWt = a;
    if (out.bestRt === null || out.algos[a].avgRt < out.algos[out.bestRt].avgRt) out.bestRt = a;
  });
  return out;
};

const REPORT_SRC = `function report(procs, q) {
  var out = { algos: {}, bestWt: null, bestRt: null };
  var names = ['FCFS', 'SJF', 'SRTF', 'RR'];
  names.forEach(function (a) {
    var r = schedule(a, procs, q);
    out.algos[a] = { avgWt: r.avgWt, avgTat: r.avgTat, avgRt: r.avgRt, switches: r.gantt.length - 1 };
  });
  names.forEach(function (a) {
    if (out.bestWt === null || out.algos[a].avgWt < out.algos[out.bestWt].avgWt) out.bestWt = a;
    if (out.bestRt === null || out.algos[a].avgRt < out.algos[out.bestRt].avgRt) out.bestRt = a;
  });
  return out;
}
`;

const dsP = (ps) => tab(['Process', 'Arrival', 'Burst'], ps.map((p) => [p.id, p.at, p.bt]));
const LAB = jsDe({
  tieuDe: 'Lab 2 — CPU scheduler comparison report',
  doKho: 'HARD', phut: 45, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> The operations team of CuongThai.com wants to choose a scheduling policy for a build server. You must write a small tool that runs the same workload under <b>FCFS, SJF (non-preemptive), SRTF and Round Robin</b> and prints the numbers used in the lab report: average waiting, turnaround and response time and the number of context switches.</p>
<p><b>Task.</b> You are given a working helper <code>schedule(algo, procs, quantum)</code> in <code>scheduler.js</code> (it returns <code>{ gantt, ct, tat, wt, rt, avgWt, avgTat, avgRt, … }</code>; <code>gantt</code> is a list of <code>[id, start, end]</code> slices). In <code>answer.js</code> write <code>report(procs, q)</code> returning</p>
<pre>{ algos: { FCFS: { avgWt, avgTat, avgRt, switches }, SJF: {…}, SRTF: {…}, RR: {…} }, bestWt, bestRt }</pre>
<p><code>switches</code> = number of Gantt slices − 1. <code>bestWt</code> / <code>bestRt</code> = name of the algorithm with the smallest average waiting / response time; ties go to the algorithm listed first in the order FCFS, SJF, SRTF, RR. Round Robin uses quantum <code>q</code>. Rules: lowest-index tie-breaks, context-switch time 0 (see exercise “Scheduling 7”).</p>
<h4>Workloads used by the checks</h4>${dsP(w1)}<p>Workload 2 is the classic convoy case (24, 3, 3 arriving together).</p>`,
    `<p><b>Tình huống.</b> Đội vận hành CuongThai.com muốn chọn chính sách lập lịch cho máy chủ build. Bạn viết một công cụ nhỏ chạy cùng một tải với <b>FCFS, SJF (không ngắt), SRTF và Round Robin</b> và in các con số dùng trong báo cáo lab: thời gian chờ (waiting), thời gian quay vòng (turnaround = từ lúc đến tới lúc xong), thời gian phản hồi (response) trung bình và số lần chuyển ngữ cảnh.</p>
<p><b>Nhiệm vụ.</b> Tệp <code>scheduler.js</code> cho sẵn hàm chạy được <code>schedule(algo, procs, quantum)</code> (trả <code>{ gantt, ct, tat, wt, rt, avgWt, avgTat, avgRt, … }</code>; <code>gantt</code> là danh sách lát <code>[id, bắt đầu, kết thúc]</code>). Trong <code>answer.js</code> viết <code>report(procs, q)</code> trả</p>
<pre>{ algos: { FCFS: { avgWt, avgTat, avgRt, switches }, SJF: {…}, SRTF: {…}, RR: {…} }, bestWt, bestRt }</pre>
<p><code>switches</code> = số lát Gantt − 1. <code>bestWt</code> / <code>bestRt</code> = tên thuật toán có waiting / response trung bình nhỏ nhất; hoà thì chọn thuật toán đứng trước theo thứ tự FCFS, SJF, SRTF, RR. Round Robin dùng quantum <code>q</code>. Luật: hoà thì chọn tiến trình có chỉ số nhỏ hơn, thời gian chuyển ngữ cảnh bằng 0 (xem bài “Scheduling 7”).</p>
<h4>Tải dùng trong các kiểm</h4>${dsP(w1)}<p>Tải 2 là ca “convoy” kinh điển (24, 3, 3 đến cùng lúc).</p>`),
  yeuCau: [bi('Call the provided <code>schedule</code>; do not rewrite it.', 'Gọi hàm <code>schedule</code> cho sẵn; đừng viết lại.'), bi('Return numbers, not strings.', 'Trả số, không phải chuỗi.')],
  viDu: [{ input: "report([{id:'A',at:0,bt:24},{id:'B',at:0,bt:3},{id:'C',at:0,bt:3}], 4).bestWt", output: JSON.stringify(refReport(w2, 4).bestWt), explanation: 'SJF/SRTF run the short jobs first, so the convoy disappears.|||SJF/SRTF chạy việc ngắn trước nên hết hiện tượng convoy.' }],
  goiY: ['Loop over the four names, call schedule once per name and copy the four numbers.', 'Pick the winners in a second loop with strict “<” so that ties keep the earlier algorithm.', 'switches = r.gantt.length - 1.'],
  loiHayGap: ['Using “<=” when searching for the minimum: the LAST tied algorithm wins instead of the first.', 'Forgetting that RR needs the quantum argument.', 'Counting context switches as the number of processes.'],
  giaiThich: '<p>The report is a thin layer over the scheduler: run every policy on the same workload, then compare. The interesting part of the lab is reading the table: SJF/SRTF win on waiting time, RR wins on response time and pays with many more context switches, FCFS is the baseline.</p>',
  khaiNiem: ['scheduling comparison', 'report'],
  fn: 'report',
  tep: 'answer.js',
  dau: "// scheduler.js (loaded before this file) provides schedule(algo, procs, quantum)\nfunction report(procs, q) {\n  return { algos: {}, bestWt: null, bestRt: null };\n}\n",
  giaiMa: REPORT_SRC,
  thuVien: { 'scheduler.js': '// Provided: a correct scheduler (do not edit)\n' + dat(S.schedule, 'schedule') },
  ref: refReport,
  cases: [{ args: [w1, 3] }, { args: [w2, 4] }, { args: [w3, 2] }, { args: [w4, 3], an: true }, { args: [w5, 2], an: true }, { args: [w5, 4], an: true }],
});
// thứ tự nạp: scheduler.js trước answer.js (thuVien đặt trước trong tepNap); mở tệp answer.js trước
LAB.khoiDau = { 'answer.js': LAB.khoiDau['answer.js'], 'scheduler.js': LAB.khoiDau['scheduler.js'] };
LAB.loiGiai = { 'answer.js': LAB.loiGiai['answer.js'], 'scheduler.js': LAB.loiGiai['scheduler.js'] };

export default doiDau({
  slug: 'osg202-2-lab-scheduler-comparison',
  ten: 'Lab 2 — CPU scheduler comparison report',
  khoa: KHOA,
  baiHoc: 'osg202-on-ch2',
  de: [LAB],
});
