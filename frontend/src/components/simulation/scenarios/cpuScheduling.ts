/**
 * Hệ điều hành · OSG202 — bộ lập lịch CPU chọn ai chạy tiếp.
 *
 * Máy có bốn lõi nhưng đang mở hai trăm tiến trình. Ai được chạy, chạy bao
 * lâu, rồi tới lượt ai — đó là toàn bộ việc của bộ lập lịch, và cách nó quyết
 * định thay đổi hẳn cảm giác dùng máy.
 *
 * Kịch bản chạy CÙNG một bộ bốn tiến trình qua ba thuật toán để so trực tiếp:
 *
 *   P1 cần 24ms · P2 cần 3ms · P3 cần 3ms · P4 cần 6ms   (cùng tới lúc t=0)
 *
 *   FCFS  — ai tới trước chạy trước. Chờ trung bình 17,25ms.
 *   SJF   — việc ngắn chạy trước. Chờ trung bình 5,25ms — tốt nhất có thể.
 *   RR    — mỗi tiến trình 4ms rồi nhường. Chờ lâu hơn SJF, nhưng KHÔNG ai
 *           phải đợi 24ms mới được đụng CPU lần đầu.
 *
 * Bài học không phải "SJF thắng". Bài học là ba thuật toán tối ưu ba thứ khác
 * nhau — thời gian chờ, tính công bằng, và độ đáp ứng — và bạn không thể có cả
 * ba cùng lúc. Máy chủ tính toán chọn khác hẳn máy tính cá nhân.
 */

import { Timer } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const CODE = [
  '// Bốn tiến trình cùng tới lúc t = 0',
  '',
  '  P1   cần 24 ms   (nén video)',
  '  P2   cần  3 ms   (gõ phím)',
  '  P3   cần  3 ms   (di chuột)',
  '  P4   cần  6 ms   (tải mạng)',
  '',
  '// Thời gian CHỜ = lúc bắt đầu chạy − lúc tới',
];

const PANELS: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Bốn tiến trình cần CPU', en: 'Four processes wanting the CPU' },
    file: 'scheduler',
    x: 0,
    y: 0,
    w: 470,
    h: 244,
    lines: CODE,
  },
  {
    id: 'chart',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Thời gian chờ của từng tiến trình (ms)', en: 'Waiting time per process (ms)' },
    hint: { vi: 'càng thấp càng tốt', en: 'lower is better' },
    x: 0,
    y: 256,
    w: 470,
    h: 304,
    accent: '#f59e0b',
    max: 33,
    unit: 'ms',
  },
  {
    id: 'cpu',
    kind: 'lanes',
    title: { vi: 'CPU đang chạy gì', en: 'What the CPU is running' },
    hint: { vi: 'hàng đợi sẵn sàng → CPU → xong', en: 'ready queue → CPU → done' },
    x: 482,
    y: 0,
    w: 518,
    h: 316,
    accent: '#34d399',
    layout: 'rows',
    lanes: [
      { id: 'ready', label: 'sẵn sàng', sub: { vi: 'đang xếp hàng', en: 'queued' }, accent: '#94a3b8' },
      { id: 'run', label: 'đang chạy', sub: { vi: 'chiếm CPU', en: 'owns the CPU' }, accent: '#34d399' },
      { id: 'done', label: 'xong', sub: { vi: 'đã trả CPU', en: 'released' }, accent: '#38bdf8' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Dòng thời gian', en: 'Timeline' },
    file: 'scheduler',
    x: 482,
    y: 328,
    w: 518,
    h: 232,
    accent: '#a78bfa',
    maxLines: 6,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const bar = (key: string, value: number, label: string, tone: Tone): PanelOp => ({ p: 'chart', op: 'value', key, value, label, tone });
const put = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'cpu',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const wipe = (lane: string): PanelOp => ({ p: 'cpu', op: 'clear', lane });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/** Bốn tiến trình xếp hàng lúc đầu — dùng chung cho cả ba thuật toán. */
const QUEUE = (order: string[]): PanelOp[] => [
  wipe('ready'),
  ...order.map((p, i) => put('ready', `q${i}`, p, '', 'muted') as PanelOp),
];

/* ── A — FCFS ────────────────────────────────────────────────── */

function buildFcfs(): SimStep[] {
  const { steps, push } = collector();

  push(
    'queue',
    { vi: 'Ai tới trước chạy trước — đơn giản nhất có thể', en: 'First come, first served — as simple as it gets' },
    {
      vi: 'Một hàng đợi, lấy từ đầu, chạy tới khi xong rồi mới lấy tiếp. Không cần biết tiến trình cần bao lâu, không cần đồng hồ ngắt quãng. Đây là thuật toán mà ai cũng nghĩ ra đầu tiên, và nó công bằng theo nghĩa "không ai bị chen".',
      en: 'One queue, take from the head, run to completion, then take the next. No need to know how long anything will take, no timer interrupts required. This is the algorithm everyone invents first, and it is fair in the sense that nobody gets cut in line.',
    },
    2600,
    [lines([3, 4, 5, 6]), ...QUEUE(['P1 · 24ms', 'P2 · 3ms', 'P3 · 3ms', 'P4 · 6ms']), out('hàng đợi: P1 P2 P3 P4', 'muted')],
    { sfx: 'click' }
  );

  push(
    'p1',
    { vi: 'P1 chạy trọn 24ms — ba tiến trình kia ngồi im', en: 'P1 runs all 24ms — the other three just sit' },
    {
      vi: 'P1 là tác vụ nén video, cần 24ms. FCFS không cắt ngang, nên nó giữ CPU tới khi xong. Trong suốt 24ms đó, cú gõ phím của bạn (P2, chỉ cần 3ms) nằm chờ mà không được đụng CPU lấy một lần.',
      en: 'P1 is a video encode needing 24ms. FCFS never preempts, so it holds the CPU until finished. For those entire 24ms your keystroke (P2, needing just 3ms) waits without touching the CPU even once.',
    },
    3000,
    [
      wipe('run'),
      put('run', 'r1', 'P1', 'chạy 0 → 24ms', 'ok'),
      bar('P1', 0, '0 ms', 'ok'),
      out('t=0  → P1 bắt đầu (24ms)', 'info'),
    ],
    { sfx: 'stream' }
  );

  push(
    'convoy',
    { vi: 'Hiệu ứng đoàn xe: việc ngắn kẹt sau việc dài', en: 'The convoy effect: short jobs stuck behind a long one' },
    {
      vi: 'P2 chỉ cần 3ms nhưng phải chờ 24ms mới tới lượt. P3 chờ 27ms cho một việc 3ms. Giống như xếp hàng siêu thị sau một xe đầy ắp trong khi bạn chỉ cầm một hộp sữa — thời gian chờ chẳng liên quan gì tới việc bạn cần bao lâu.',
      en: 'P2 needs only 3ms but waits 24ms for its turn. P3 waits 27ms for 3ms of work. Like queuing behind a full trolley while holding one carton of milk — your wait has nothing to do with how long you actually need.',
    },
    3100,
    [
      wipe('run'),
      put('done', 'd1', 'P1', 'xong lúc 24ms', 'muted'),
      put('run', 'r2', 'P2', 'chạy 24 → 27ms', 'warn'),
      bar('P2', 24, '24 ms', 'err'),
      out('t=24 → P2 mới được chạy (chờ 24ms cho việc 3ms)', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Đây là convoy effect. Hỏi lớp: máy tính cá nhân dùng FCFS thì gõ phím sẽ ra sao?',
        en: 'This is the convoy effect. Ask: on a desktop using FCFS, what would typing feel like?',
      },
    }
  );

  push(
    'total',
    { vi: 'Chờ trung bình 17,25ms', en: 'Average wait: 17.25ms' },
    {
      vi: '0 + 24 + 27 + 30, chia bốn. Con số này tệ không phải vì CPU chậm — tổng công việc vẫn đúng 36ms — mà vì THỨ TỰ chọn sai. Cùng bấy nhiêu việc, xếp khác đi là ra con số khác hẳn.',
      en: '0 + 24 + 27 + 30, divided by four. This number is bad not because the CPU is slow — the total work is still exactly 36ms — but because the ORDER was wrong. The same work, arranged differently, gives a very different number.',
    },
    3000,
    [
      wipe('run'),
      put('done', 'd2', 'P3 · P4', 'xong lúc 30 và 36ms', 'muted'),
      bar('P3', 27, '27 ms', 'err'),
      bar('P4', 30, '30 ms', 'err'),
      out('chờ trung bình: (0+24+27+30)/4 = 17,25ms', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'where',
    { vi: 'Nhưng FCFS không hề vô dụng', en: 'Yet FCFS is far from useless' },
    {
      vi: 'Nó không tốn chi phí chuyển đổi, không cần đoán trước thời lượng, và không bao giờ bỏ đói ai. Với hàng đợi công việc nền — xử lý ảnh, gửi email hàng loạt — nơi không ai ngồi chờ trước màn hình, FCFS vừa đủ và đơn giản nhất. Nó chỉ sai chỗ khi có người đang chờ phản hồi.',
      en: 'It costs nothing in switching, needs no estimate of duration, and never starves anyone. For background job queues — image processing, bulk email — where nobody sits watching a screen, FCFS is sufficient and the simplest thing that works. It is only wrong when a human is waiting for a response.',
    },
    2900,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — SJF ─────────────────────────────────────────────────── */

function buildSjf(): SimStep[] {
  const { steps, push } = collector();

  push(
    'sort',
    { vi: 'Việc ngắn nhất chạy trước', en: 'Shortest job first' },
    {
      vi: 'Vẫn bốn tiến trình đó, chỉ đổi thứ tự: 3, 3, 6, rồi 24. Trực giác rất rõ — cho việc ngắn qua trước thì tổng thời gian chờ giảm, y như siêu thị mở quầy riêng cho người mua ít món.',
      en: 'The same four processes, only reordered: 3, 3, 6, then 24. The intuition is clear — letting short jobs through first cuts total waiting, exactly like a supermarket express lane.',
    },
    2700,
    [lines([3, 4, 5, 6]), ...QUEUE(['P2 · 3ms', 'P3 · 3ms', 'P4 · 6ms', 'P1 · 24ms']), out('sắp lại: P2 P3 P4 P1', 'info')],
    { sfx: 'click' }
  );

  push(
    'run',
    { vi: 'Ba việc ngắn xong trước khi P1 bắt đầu', en: 'Three short jobs finish before P1 even starts' },
    {
      vi: 'P2 xong lúc 3ms, P3 lúc 6ms, P4 lúc 12ms. Tới lúc P1 nhận CPU thì ba tiến trình kia đã xong hẳn. Chú ý P1 vẫn cần đúng 24ms như cũ — không ai chạy nhanh hơn, chỉ là thứ tự phục vụ đổi.',
      en: 'P2 finishes at 3ms, P3 at 6ms, P4 at 12ms. By the time P1 gets the CPU the other three are completely done. Note P1 still needs exactly its 24ms — nothing runs faster, only the serving order changed.',
    },
    3000,
    [
      wipe('run'),
      put('done', 'e1', 'P2 · P3 · P4', 'xong lúc 3, 6, 12ms', 'ok'),
      put('run', 'e2', 'P1', 'chạy 12 → 36ms', 'warn'),
      bar('P2', 0, '0 ms', 'ok'),
      bar('P3', 3, '3 ms', 'ok'),
      bar('P4', 6, '6 ms', 'ok'),
      out('t=12 → P1 bắt đầu · ba việc ngắn đã xong', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'optimal',
    { vi: 'Chờ trung bình 5,25ms — và đây là con số TỐI ƯU', en: 'Average wait 5.25ms — and this is PROVABLY optimal' },
    {
      vi: 'Từ 17,25 xuống 5,25, giảm hơn ba lần, mà không thêm một chút phần cứng nào. Hơn nữa đây là điều đã chứng minh được: không thuật toán nào cho thời gian chờ trung bình thấp hơn SJF với cùng bộ tiến trình. Nghe như đã xong chuyện — nhưng chưa.',
      en: 'From 17.25 down to 5.25, a threefold cut, without adding any hardware. Moreover this is a proven result: no algorithm achieves a lower average wait than SJF for a given set of processes. It sounds like the matter is settled — it is not.',
    },
    3000,
    [bar('P1', 12, '12 ms', 'warn'), out('chờ trung bình: (0+3+6+12)/4 = 5,25ms  ← tối ưu', 'ok')],
    { sfx: 'ping' }
  );

  push(
    'unknown',
    { vi: 'Vấn đề thứ nhất: không ai biết trước tiến trình cần bao lâu', en: 'Problem one: nobody knows how long a process will take' },
    {
      vi: 'SJF cần biết thời lượng TRƯỚC khi chạy, mà điều đó là không thể — một tiến trình có thể chờ mạng, có thể lặp mãi. Hệ điều hành thật phải ĐOÁN dựa trên các lần chạy trước, và đoán sai thì lợi thế biến mất. Một thuật toán tối ưu nhưng cần thông tin không tồn tại thì chỉ dùng được làm mốc so sánh.',
      en: 'SJF needs the duration BEFORE running, which is impossible — a process might wait on the network, or loop forever. Real operating systems ESTIMATE from previous runs, and a wrong estimate erases the advantage. An optimal algorithm requiring information that does not exist serves mainly as a benchmark.',
    },
    3000,
    [out('cần biết trước thời lượng · thực tế phải đoán', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'starve',
    { vi: 'Vấn đề thứ hai: bỏ đói việc dài', en: 'Problem two: long jobs starve' },
    {
      vi: 'Nếu việc ngắn cứ liên tục kéo tới — mà trên máy thật thì đúng là như vậy — thì P1 bị đẩy lùi mãi và có thể không bao giờ chạy. Cách chữa gọi là *aging*: tiến trình càng chờ lâu thì độ ưu tiên càng tăng, tới lúc nào đó nó vượt lên. Nhưng vá xong thì SJF không còn tối ưu nữa.',
      en: 'If short jobs keep arriving — and on a real machine they do — P1 is pushed back indefinitely and may never run. The remedy is *aging*: the longer a process waits the more its priority rises, until eventually it wins. But once patched, SJF is no longer optimal.',
    },
    3000,
    [out('việc ngắn tới liên tục → P1 có thể không bao giờ chạy', 'err'), out('chữa bằng aging: chờ lâu → ưu tiên tăng', 'ok')],
    { sfx: 'error' }
  );

  return steps;
}

/* ── C — ROUND ROBIN ─────────────────────────────────────────── */

function buildRr(): SimStep[] {
  const { steps, push } = collector();

  push(
    'quantum',
    { vi: 'Chia thời gian: mỗi tiến trình được 4ms rồi nhường', en: 'Time slicing: 4ms each, then hand over' },
    {
      vi: 'Một đồng hồ ngắt quãng cứ 4ms lại cắt ngang tiến trình đang chạy, đẩy nó xuống cuối hàng và gọi người kế tiếp. Không cần biết ai cần bao lâu — đây là điểm khác biệt lớn với SJF, và là lý do RR dùng được trong thực tế.',
      en: 'A timer interrupt every 4ms cuts off whoever is running, sends them to the back of the queue and calls the next. No knowledge of durations is required — the crucial difference from SJF, and why RR is actually usable.',
    },
    2800,
    [lines([3, 4, 5, 6]), ...QUEUE(['P1', 'P2', 'P3', 'P4']), out('lượng tử = 4ms · đồng hồ cắt ngang', 'info')],
    { sfx: 'click' }
  );

  push(
    'rotate',
    { vi: 'P1 chạy 4ms rồi bị cắt, dù chưa xong', en: 'P1 runs 4ms and is cut off, unfinished' },
    {
      vi: 'Đây là điểm mấu chốt: RR cắt ngang giữa chừng. P1 mới làm được 4/24 công việc đã phải nhường. Nó sẽ quay lại, nhưng phải xếp cuối hàng. Nhờ vậy P2 chỉ chờ 4ms là được đụng CPU — thay vì 24ms như FCFS.',
      en: 'This is the crux: RR preempts. P1 has done only 4 of its 24ms and must yield. It will return, but at the back of the queue. As a result P2 touches the CPU after only 4ms of waiting — instead of 24 under FCFS.',
    },
    3000,
    [
      wipe('run'),
      put('run', 'x1', 'P2', 'chạy 4 → 7ms', 'ok'),
      put('ready', 'x2', 'P1 (còn 20ms)', 'về cuối hàng', 'warn'),
      bar('P2', 4, '4 ms', 'ok'),
      out('t=0-4 P1 · t=4 cắt ngang → P2 chạy', 'ok'),
    ],
    { sfx: 'swoosh' }
  );

  push(
    'responsive',
    { vi: 'Không ai phải chờ quá 12ms để được đụng CPU lần đầu', en: 'Nobody waits more than 12ms for their first slice' },
    {
      vi: 'Đây là thứ RR tối ưu, và nó KHÁC với thời gian chờ trung bình. Với bốn tiến trình và lượng tử 4ms, chờ tối đa để được chạy lần đầu là 3 × 4 = 12ms. Con số này không phụ thuộc việc P1 cần 24ms hay 24 giây — đó chính là điều làm cho máy "mượt".',
      en: 'This is what RR optimises, and it differs from average waiting time. With four processes and a 4ms quantum, the worst wait for a first slice is 3 × 4 = 12ms. That figure does not depend on whether P1 needs 24ms or 24 seconds — which is exactly what makes a machine feel smooth.',
    },
    3100,
    [
      bar('P3', 7, '7 ms', 'ok'),
      bar('P4', 10, '10 ms', 'ok'),
      bar('P1', 20, '20 ms', 'warn'),
      out('chờ lần đầu tối đa: 3 × 4 = 12ms · không đổi theo độ dài việc', 'ok'),
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Nhấn: RR tối ưu ĐỘ ĐÁP ỨNG, không phải thời gian chờ trung bình. Ba thuật toán, ba mục tiêu.',
        en: 'Stress: RR optimises RESPONSIVENESS, not average wait. Three algorithms, three goals.',
      },
    }
  );

  push(
    'cost',
    { vi: 'Cái giá: mỗi lần đổi tiến trình đều tốn tiền', en: 'The cost: every switch is paid for' },
    {
      vi: 'Chuyển ngữ cảnh phải cất toàn bộ thanh ghi, đổi bảng trang, và làm nguội cache lẫn TLB của tiến trình cũ. Khoảng 1–5 micro giây mỗi lần — nghe nhỏ, nhưng lượng tử càng ngắn thì càng đổi nhiều. Lượng tử 1ms mà chuyển mất 5µs là đốt 0,5% CPU chỉ để chuyển qua chuyển lại.',
      en: 'A context switch must save every register, swap page tables, and leave the old process’s cache and TLB cold. Roughly 1–5 microseconds each — small, but a shorter quantum means more switches. A 1ms quantum with a 5µs switch burns 0.5% of the CPU purely on switching.',
    },
    3100,
    [out('mỗi lần chuyển: cất thanh ghi + đổi bảng trang + cache nguội', 'warn'), out('~1–5µs · lượng tử càng ngắn càng tốn', 'warn')],
    { sfx: 'buzz' }
  );

  push(
    'tune',
    { vi: 'Chọn lượng tử: quá dài thành FCFS, quá ngắn thành đốt CPU', en: 'Choosing the quantum: too long is FCFS, too short is burning CPU' },
    {
      vi: 'Lượng tử lớn hơn mọi tiến trình thì RR thoái hoá thành FCFS. Lượng tử quá nhỏ thì phần lớn thời gian dành cho chuyển đổi. Linux thực tế không dùng lượng tử cố định mà tính động theo số tiến trình đang chạy và độ ưu tiên — nhưng nguyên lý đánh đổi vẫn y nguyên như vậy.',
      en: 'A quantum larger than every process degenerates into FCFS. Too small and most time goes to switching. Linux does not use a fixed quantum at all but computes one dynamically from the number of runnable processes and their priorities — yet the trade-off is exactly the same.',
    },
    3000,
    [out('lượng tử thực tế: 1–10ms · Linux tính động', 'info')],
    { sfx: 'blip' }
  );

  push(
    'verdict',
    { vi: 'Ba thuật toán, ba mục tiêu khác nhau', en: 'Three algorithms, three different goals' },
    {
      vi: 'FCFS tối ưu sự đơn giản — hợp hàng đợi công việc nền. SJF tối ưu thời gian chờ trung bình — hợp khi ước lượng được thời lượng, như hàng đợi lô. RR tối ưu độ đáp ứng — bắt buộc với máy có người ngồi trước màn hình. Không có cái nào "đúng" nói chung; câu hỏi luôn là bạn đang tối ưu cho ai.',
      en: 'FCFS optimises simplicity — right for background job queues. SJF optimises average wait — right when durations are estimable, as in batch queues. RR optimises responsiveness — mandatory when a human is watching. None is right in general; the question is always who you are optimising for.',
    },
    3100,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

export const cpuSchedulingScenario: Scenario = {
  id: 'cpu-scheduling',
  name: { vi: 'Lập lịch CPU — ai được chạy tiếp', en: 'CPU scheduling — who runs next' },
  tagline: {
    vi: 'Cùng bốn tiến trình, cùng 36ms công việc: FCFS cho chờ trung bình 17,25ms còn SJF chỉ 5,25ms. Nhưng SJF cần biết trước thời lượng — thứ không ai biết — nên máy bạn đang dùng Round Robin.',
    en: 'The same four processes, the same 36ms of work: FCFS averages 17.25ms of waiting, SJF only 5.25ms. But SJF needs to know durations in advance — which nobody does — so your machine runs Round Robin.',
  },
  icon: Timer,
  accent: '#38bdf8',
  group: 'os',
  nodes: [],
  edges: [],
  panels: PANELS,
  options: [
    {
      id: 'algo',
      label: { vi: 'Thuật toán lập lịch', en: 'Scheduling algorithm' },
      defaultValue: 'fcfs',
      choices: [
        {
          value: 'fcfs',
          label: 'FCFS',
          fullLabel: 'Ai tới trước chạy trước',
          color: '#f43f5e',
          hint: { vi: 'chờ TB 17,25ms · hiệu ứng đoàn xe', en: '17.25ms avg · convoy effect' },
        },
        {
          value: 'sjf',
          label: 'SJF',
          fullLabel: 'Việc ngắn nhất trước',
          color: '#34d399',
          hint: { vi: 'chờ TB 5,25ms · nhưng bỏ đói việc dài', en: '5.25ms avg · but starves long jobs' },
        },
        {
          value: 'rr',
          label: 'Round Robin',
          fullLabel: 'Mỗi tiến trình 4ms rồi nhường',
          color: '#38bdf8',
          hint: { vi: 'chờ lần đầu tối đa 12ms', en: 'first slice within 12ms' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.algo === 'sjf' ? buildSjf() : opts.algo === 'rr' ? buildRr() : buildFcfs(),
};
