/**
 * Node.js · Bài 2.3 — nextTick, microtask và chuyện bỏ đói hàng đợi.
 *
 * Bài 2.2 đã chỉ ra hai hàng đợi nằm NGOÀI sáu pha. Bài này trả lời hai câu
 * còn lại: chúng chen ngang theo thứ tự nào, và điều gì xảy ra khi một hàng
 * đợi không bao giờ cạn.
 *
 * Chữ quyết định trong cả bài là "DỌN SẠCH". Node không chạy vài cái rồi đi
 * tiếp — nó vét cạn hàng đợi, kể cả những phần tử được thêm vào TRONG LÚC
 * đang vét. Đó là lý do một `process.nextTick` tự gọi lại mình mà không có
 * điều kiện dừng làm treo cứng Node: không lỗi, không sập, chỉ là một tiến
 * trình ăn 100% CPU và không trả lời gì nữa.
 *
 * Bám đúng bài 2.3 trong `content/courses/nodejs/s02-runtime.mjs`, kể cả con
 * số 1.000.000 nextTick và kết cục của bản đệ quy vô hạn.
 */

import { Layers } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const ORDER_CODE = [
  '// node order.js',
  "setTimeout(() => log('timer'), 0);",
  '',
  "process.nextTick(() => {",
  "  log('tick A');",
  "  process.nextTick(() => log('tick B'));   // thêm khi đang vét",
  '});',
  '',
  "Promise.resolve().then(() => {",
  "  log('micro A');",
  "  Promise.resolve().then(() => log('micro B'));",
  '});',
  '',
  "log('sync');",
];

const STARVE_CODE = [
  '// node starve.js',
  'let n = 0;',
  '',
  "setTimeout(() => log('timer chạy được không?'), 0);",
  '',
  'function recurse() {',
  '  if (++n < 1e6) process.nextTick(recurse);',
  '}',
  'recurse();',
  '',
  "log('đã xếp một triệu nextTick');",
];

const HANG_CODE = [
  '// node hang.js  ⚠️',
  '',
  "setTimeout(() => log('không bao giờ tới đây'), 0);",
  '',
  'function forever() {',
  '  process.nextTick(forever);   // KHÔNG có điều kiện dừng',
  '}',
  'forever();',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const buildPanels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Mã nguồn', en: 'Source' },
    x: 0,
    y: 0,
    w: 400,
    h: 344,
    lines: opts.demo === 'starve' ? STARVE_CODE : opts.demo === 'hang' ? HANG_CODE : ORDER_CODE,
    startLine: 1,
  },
  {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Đo tại chỗ', en: 'Live gauges' },
    x: 0,
    y: 356,
    w: 400,
    h: 204,
    accent: '#f59e0b',
    meters: [
      {
        id: 'queue',
        label: 'Độ dài hàng nextTick',
        max: opts.demo === 'order' ? 4 : 1_000_000,
        unit: opts.demo === 'order' ? '' : 'phần tử',
        accent: '#34d399',
      },
      {
        id: 'late',
        label: 'Timer trễ so với hạn',
        max: opts.demo === 'hang' ? 5000 : 60,
        unit: 'ms',
        threshold: opts.demo === 'hang' ? 1000 : 16,
        thresholdLabel: opts.demo === 'hang' ? '1 giây' : 'một khung hình',
        accent: '#f43f5e',
      },
    ],
  },
  {
    id: 'ladder',
    kind: 'lanes',
    title: { vi: 'Thang ưu tiên — ai được chạy trước', en: 'The priority ladder' },
    hint: { vi: 'bậc trên CẠN mới xuống được bậc dưới', en: 'a rung must EMPTY before the next one' },
    x: 412,
    y: 0,
    w: 588,
    h: 292,
    lanes: [
      { id: 'sync', label: '1 · Mã đồng bộ', sub: { vi: 'chạy tới hết, luôn luôn', en: 'runs to completion, always' }, accent: '#e8eefc' },
      { id: 'tick', label: '2 · process.nextTick', sub: { vi: 'DỌN SẠCH, kể cả cái thêm sau', en: 'drained COMPLETELY' }, accent: '#34d399' },
      { id: 'micro', label: '3 · microtask', sub: { vi: 'Promise · queueMicrotask', en: 'Promise · queueMicrotask' }, accent: '#22d3ee' },
      { id: 'phase', label: '4 · pha kế tiếp', sub: { vi: 'timers · poll · check…', en: 'timers · poll · check…' }, accent: '#f59e0b' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả in ra', en: 'Program output' },
    x: 412,
    y: 304,
    w: 588,
    h: 256,
    accent: '#34d399',
    maxLines: 7,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const line = (n: number): PanelOp => ({ p: 'code', op: 'lines', value: n > 0 ? [n] : [] });
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({
  p: 'out',
  op: 'push',
  item: { label, tone },
});
const rung = (id: string | null): PanelOp => ({ p: 'ladder', op: 'active', value: id });
const gauge = (id: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'gauges',
  op: 'value',
  key: id,
  value,
  label,
  tone,
});

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — THỨ TỰ ƯU TIÊN
   ──────────────────────────────────────────────────────────── */

function buildOrder(): SimStep[] {
  const { steps, push } = collector();

  push(
    'sync',
    { vi: 'Mã đồng bộ chạy trước, không bàn cãi', en: 'Synchronous code first, no argument' },
    {
      vi: 'Cả bốn lời gọi chỉ ĐĂNG KÝ callback rồi trả về ngay. Dòng `log("sync")` nằm cuối file lại in ra ĐẦU TIÊN — vì nó là thứ duy nhất chạy thật trong lượt này.',
      en: 'All four calls merely REGISTER callbacks and return. The `log("sync")` sitting at the bottom of the file prints FIRST — it is the only thing actually running this pass.',
    },
    2100,
    [
      lines([2, 4, 9, 14]),
      rung('sync'),
      { p: 'ladder', op: 'push', lane: 'phase', item: { id: 'q_timer', label: 'timer', sub: 'setTimeout 0', tone: 'warn' } },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_tickA', label: 'tick A', tone: 'ok' } },
      { p: 'ladder', op: 'push', lane: 'micro', item: { id: 'q_microA', label: 'micro A', tone: 'info' } },
      out('sync'),
      gauge('queue', 1),
      gauge('late', 0, '0 ms'),
    ],
    { sfx: 'click' }
  );

  push(
    'tick-a',
    { vi: 'Bậc 2 — hàng nextTick', en: 'Rung 2 — the nextTick queue' },
    {
      vi: 'Ngăn xếp trống, Node quay sang hàng ưu tiên cao nhất. `tick A` chạy — và trong lúc chạy nó xếp thêm `tick B` vào chính hàng đang được vét.',
      en: 'The stack is empty, so Node turns to the highest-priority queue. `tick A` runs — and while running it queues `tick B` into the very queue being drained.',
    },
    2100,
    [
      line(5),
      rung('tick'),
      { p: 'ladder', op: 'shift', lane: 'tick' },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_tickB', label: 'tick B', sub: 'thêm khi đang vét', tone: 'warn' } },
      out('tick A'),
      gauge('queue', 1),
    ],
    { sfx: 'ping' }
  );

  push(
    'tick-b',
    { vi: '"Dọn sạch" nghĩa là sạch thật', en: '"Drained" means drained' },
    {
      vi: 'Đây là chỗ hầu hết mọi người đoán sai: `tick B` được thêm vào SAU khi lượt vét đã bắt đầu, mà nó vẫn chạy NGAY trong lượt đó. Node không vét "một ít rồi đi tiếp" — nó vét tới khi hàng rỗng.',
      en: 'This is where most people guess wrong: `tick B` was added AFTER the drain began, and it still runs inside that same drain. Node does not run "a few and move on" — it drains until the queue is empty.',
    },
    2300,
    [line(6), { p: 'ladder', op: 'shift', lane: 'tick' }, out('tick B'), gauge('queue', 0)],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Dừng ở đây: chính tính chất "vét cạn" này là hạt giống của lỗi treo ở biến thể sau.',
        en: 'Pause here: this exhaustive-drain property is the seed of the hang in the next variant.',
      },
    }
  );

  push(
    'micro-a',
    { vi: 'Bậc 3 — microtask, cũng vét cạn y hệt', en: 'Rung 3 — microtasks, drained the same way' },
    {
      vi: 'Hàng nextTick rỗng thì mới tới microtask. `micro A` chạy và cũng xếp thêm `micro B` vào hàng của chính nó.',
      en: 'Only once nextTick is empty do microtasks get a turn. `micro A` runs and likewise queues `micro B` into its own queue.',
    },
    2000,
    [
      line(10),
      rung('micro'),
      { p: 'ladder', op: 'shift', lane: 'micro' },
      { p: 'ladder', op: 'push', lane: 'micro', item: { id: 'q_microB', label: 'micro B', tone: 'info' } },
      out('micro A'),
    ],
    { sfx: 'ping' }
  );

  push(
    'micro-b',
    { vi: 'Vét nốt microtask', en: 'Finish the microtasks' },
    {
      vi: '`micro B` chạy. Hai bậc chen ngang giờ đã sạch — và cho tới lúc này, vòng lặp vẫn CHƯA quay được vòng nào.',
      en: '`micro B` runs. Both jump-the-queue rungs are now clear — and up to this point the loop still has not turned once.',
    },
    2000,
    [line(11), { p: 'ladder', op: 'shift', lane: 'micro' }, out('micro B')],
    { sfx: 'ping' }
  );

  push(
    'timer',
    { vi: 'Bậc 4 — giờ mới tới pha timers', en: 'Rung 4 — only now the timers phase' },
    {
      vi: 'Timer hẹn 0ms rốt cuộc chạy sau CẢ BỐN callback kia. Nó không "chậm" — nó chỉ đứng ở bậc thang thấp nhất.',
      en: 'The 0ms timer finally runs after all four other callbacks. It is not "slow" — it simply stands on the lowest rung.',
    },
    2200,
    [line(2), rung('phase'), { p: 'ladder', op: 'shift', lane: 'phase' }, out('timer', 'warn'), gauge('late', 4, '≈ 4 ms')],
    { sfx: 'success' }
  );

  push(
    'verdict',
    { vi: 'Thứ tự: sync → tick A → tick B → micro A → micro B → timer', en: 'Order: sync → tick A → tick B → micro A → micro B → timer' },
    {
      vi: 'Bốn bậc, và bậc trên phải CẠN mới xuống được bậc dưới. Ở đây mọi thứ xong trong vài mili giây nên timer vẫn chạy. Biến thể sau cho thấy điều gì xảy ra khi bậc thứ hai không chịu cạn.',
      en: 'Four rungs, and a rung must EMPTY before the next one gets a turn. Here everything finished in a few milliseconds, so the timer still ran. The next variant shows what happens when rung two refuses to empty.',
    },
    2500,
    [rung(null), line(0)],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — MỘT TRIỆU NEXTTICK
   ──────────────────────────────────────────────────────────── */

function buildStarve(): SimStep[] {
  const { steps, push } = collector();

  push(
    'setup',
    { vi: 'Hẹn một timer, rồi xếp một triệu nextTick', en: 'Arm a timer, then queue a million nextTicks' },
    {
      vi: 'Timer 0ms được hẹn TRƯỚC. Ngay sau đó `recurse()` bắt đầu tự xếp lại chính nó — mỗi lần chạy lại thêm một cái nữa vào hàng.',
      en: 'The 0ms timer is armed FIRST. Then `recurse()` starts re-queuing itself — every run adds one more to the queue.',
    },
    2200,
    [
      lines([4, 6, 7, 8, 9]),
      rung('sync'),
      { p: 'ladder', op: 'push', lane: 'phase', item: { id: 'q_timer', label: 'timer', sub: 'hẹn 0ms', tone: 'warn' } },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_r1', label: 'recurse #1', tone: 'ok' } },
      gauge('queue', 1, '1'),
      gauge('late', 0, '0 ms'),
    ],
    { sfx: 'click' }
  );

  push(
    'sync-done',
    { vi: 'Mã đồng bộ xong, in dòng đầu tiên', en: 'Sync code done, first line printed' },
    {
      vi: 'Dòng `log` chạy trước mọi callback, đúng như bậc thang. Ngăn xếp trống — Node quay sang bậc 2.',
      en: 'The `log` line runs before any callback, exactly as the ladder says. Stack empty — Node turns to rung 2.',
    },
    1900,
    [line(11), out('đã xếp một triệu nextTick')],
    { sfx: 'blip' }
  );

  push(
    'drain-1',
    { vi: 'Bắt đầu vét — nhưng hàng tự mọc lại', en: 'The drain begins — but the queue regrows' },
    {
      vi: 'Lấy ra một cái, chạy nó, và chính nó xếp thêm một cái mới. Hàng đợi cứ vơi đi một rồi đầy lại một, hết lần này tới lần khác.',
      en: 'Take one out, run it, and it queues a fresh one. The queue drops by one and refills by one, over and over.',
    },
    2200,
    [
      rung('tick'),
      { p: 'ladder', op: 'shift', lane: 'tick' },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_r2', label: 'recurse #2', tone: 'ok' } },
      gauge('queue', 2, '2'),
      gauge('late', 1, '1 ms'),
    ],
    { sfx: 'blip' }
  );

  push(
    'drain-many',
    { vi: '…lặp lại 999.998 lần nữa', en: '…repeated 999,998 more times' },
    {
      vi: 'Suốt cả quãng này, pha timers không hề được chạm tới. Không phải vì timer chưa tới hạn — mà vì vòng lặp còn chưa được phép quay.',
      en: 'Throughout all of this, the timers phase is never reached. Not because the timer is not due — but because the loop is not yet allowed to turn.',
    },
    2600,
    [
      { p: 'ladder', op: 'clear', lane: 'tick' },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_rn', label: 'recurse #999.999', sub: 'còn 1 cái nữa', tone: 'warn' } },
      gauge('queue', 999_999, '999.999'),
      gauge('late', 34, '34 ms', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Nhấn mạnh: timer KHÔNG bị trễ vì hết CPU, mà vì bậc trên chưa cạn.',
        en: 'Stress: the timer is not late from lack of CPU — the rung above simply has not emptied.',
      },
    }
  );

  push(
    'empty',
    { vi: 'n chạm 1e6 — điều kiện dừng cứu cả tiến trình', en: 'n hits 1e6 — the exit condition saves the process' },
    {
      vi: 'Lần cuối cùng, `++n < 1e6` sai, không có cái nào được xếp thêm. Hàng cạn. Chỉ MỘT dòng `if` này là ranh giới giữa "chậm vài chục mili giây" và "chết hẳn".',
      en: 'On the last pass `++n < 1e6` is false, so nothing new is queued. The queue empties. That single `if` is the border between "a few dozen milliseconds late" and "dead".',
    },
    2400,
    [line(7), { p: 'ladder', op: 'shift', lane: 'tick' }, gauge('queue', 0, '0', 'ok')],
    { sfx: 'ping' }
  );

  push(
    'timer',
    { vi: 'Giờ timer mới được chạy', en: 'Only now does the timer run' },
    {
      vi: 'Vòng lặp cuối cùng cũng quay tới pha timers. Callback chạy — trễ mất ~34ms so với hạn 0ms, và đó là quãng thời gian mà một server sẽ không trả lời bất kỳ request nào.',
      en: 'The loop finally reaches the timers phase. The callback runs — about 34ms past its 0ms deadline, and that is a window in which a server answers no requests at all.',
    },
    2400,
    [rung('phase'), { p: 'ladder', op: 'shift', lane: 'phase' }, out('timer chạy được không?', 'warn')],
    { sfx: 'success' }
  );

  push(
    'verdict',
    { vi: 'Cả một triệu callback chạy TRƯỚC một timer 0ms', en: 'A million callbacks ran BEFORE a 0ms timer' },
    {
      vi: 'Lần này còn kết thúc được vì có điều kiện dừng. Bỏ điều kiện đó đi thì hàng không bao giờ cạn — chọn biến thể "Đệ quy vô hạn" để xem kết cục.',
      en: 'This one finished because there was an exit condition. Remove it and the queue never empties — pick the "Endless recursion" variant to see how that ends.',
    },
    2500,
    [rung(null), line(0)],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — ĐỆ QUY VÔ HẠN: TREO CỨNG
   ──────────────────────────────────────────────────────────── */

function buildHang(): SimStep[] {
  const { steps, push } = collector();

  push(
    'setup',
    { vi: 'Cùng đoạn mã, bỏ đi một dòng `if`', en: 'Same code, minus one `if`' },
    {
      vi: '`forever()` xếp lại chính nó mà không có điều kiện dừng nào. Trông vô hại: không vòng lặp `while`, không đệ quy sâu, ngăn xếp không hề tràn.',
      en: '`forever()` re-queues itself with no exit condition. It looks harmless: no `while` loop, no deep recursion, the stack never overflows.',
    },
    2200,
    [
      lines([3, 6, 7, 8]),
      rung('sync'),
      { p: 'ladder', op: 'push', lane: 'phase', item: { id: 'q_timer', label: 'timer', sub: 'hẹn 0ms', tone: 'warn' } },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_f1', label: 'forever', tone: 'ok' } },
      gauge('queue', 1, '1'),
      gauge('late', 0, '0 ms'),
    ],
    { sfx: 'click' }
  );

  push(
    'turn-1',
    { vi: 'Vét một cái, mọc lại một cái', en: 'Drain one, regrow one' },
    {
      vi: 'Hàng nextTick không bao giờ về 0. Bậc 2 của thang ưu tiên vĩnh viễn không cạn.',
      en: 'The nextTick queue never reaches zero. Rung 2 of the ladder never empties.',
    },
    2000,
    [
      rung('tick'),
      { p: 'ladder', op: 'shift', lane: 'tick' },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_f2', label: 'forever', tone: 'warn' } },
      gauge('queue', 1, '1'),
      gauge('late', 120, '120 ms', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'turn-2',
    { vi: 'Một giây sau: vẫn thế', en: 'One second later: unchanged' },
    {
      vi: 'CPU ăn 100%. Không có ngoại lệ nào được ném, không dòng log nào, không cảnh báo nào. Tiến trình vẫn "đang chạy" theo mọi cách đo bên ngoài.',
      en: 'CPU pegged at 100%. No exception thrown, no log line, no warning. By every external measure the process is still "running".',
    },
    2200,
    [
      { p: 'ladder', op: 'shift', lane: 'tick' },
      { p: 'ladder', op: 'push', lane: 'tick', item: { id: 'q_f3', label: 'forever', tone: 'err' } },
      gauge('late', 1000, '1.000 ms', 'err'),
      out('(không có gì được in ra)', 'muted'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'dead',
    { vi: 'Timer chết. I/O chết. Health check chết.', en: 'Timer dead. I/O dead. Health check dead.' },
    {
      vi: 'Vòng lặp không tới được pha timers, cũng không tới được pha poll — nên không socket nào được đọc, không request nào được nhận. Server còn sống trên `docker ps` mà không trả lời một byte.',
      en: 'The loop never reaches the timers phase, nor the poll phase — so no socket is read and no request is accepted. The server is alive in `docker ps` and answers not one byte.',
    },
    2600,
    [
      rung('tick'),
      { p: 'ladder', op: 'tone', lane: 'phase', key: 'q_timer', tone: 'err', sub: 'không bao giờ chạy' },
      gauge('late', 5000, '∞', 'err'),
      out('⚠ tiến trình treo — CPU 100%', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là một trong số rất ít cách làm Node chết mà không để lại lỗi nào.',
        en: 'This is one of the very few ways to kill Node without leaving any error behind.',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Muốn nhường lượt thì dùng setImmediate', en: 'To yield, use setImmediate' },
    {
      vi: 'Bản năng "dùng nextTick cho nó chạy sớm hơn" là cái bẫy: sớm hơn event loop nghĩa là sớm hơn I/O đang chờ — tức là bỏ đói đúng những request mình đang phục vụ. `setImmediate` mới là công cụ nhường lượt: nó lịch sự chờ tới phiên ở pha check.',
      en: 'The instinct "I will use nextTick so it runs sooner" is the trap: sooner than the event loop means sooner than pending I/O — starving the very requests you are serving. `setImmediate` is the yielding tool: it politely waits its turn in the check phase.',
    },
    2700,
    [rung(null), line(0)],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsMicrotaskScenario: Scenario = {
  id: 'nodejs-microtask',
  name: { vi: 'nextTick, microtask và bỏ đói hàng đợi', en: 'nextTick, microtasks and starvation' },
  tagline: {
    vi: 'Bốn bậc ưu tiên, bậc trên phải cạn mới xuống bậc dưới. Xem một triệu callback chen trước một timer 0ms — rồi xem điều gì xảy ra khi bậc ấy không chịu cạn.',
    en: 'Four rungs of priority, each must empty before the next. Watch a million callbacks cut ahead of a 0ms timer — then watch what happens when that rung never empties.',
  },
  icon: Layers,
  accent: '#22d3ee',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '2.3',
    slug: 'nodejs-2-3-microtask',
    title: { vi: 'nextTick, microtask và chuyện bỏ đói hàng đợi', en: 'nextTick, microtasks and starvation' },
  },
  nodes: [],
  edges: [],
  panels: buildPanels,
  options: [
    {
      id: 'demo',
      label: { vi: 'Đoạn mã chạy thử', en: 'Program to run' },
      defaultValue: 'order',
      choices: [
        {
          value: 'order',
          label: 'Thứ tự ưu tiên',
          fullLabel: 'order.js — bốn bậc thang',
          color: '#22d3ee',
          hint: { vi: 'kể cả callback thêm vào khi đang vét', en: 'including callbacks added mid-drain' },
        },
        {
          value: 'starve',
          label: 'Một triệu nextTick',
          fullLabel: 'starve.js — đệ quy có điểm dừng',
          color: '#f59e0b',
          hint: { vi: 'timer 0ms chờ hết một triệu callback', en: 'a 0ms timer waits out a million callbacks' },
        },
        {
          value: 'hang',
          label: 'Đệ quy vô hạn',
          fullLabel: 'hang.js — treo cứng, không lỗi',
          color: '#f43f5e',
          hint: { vi: 'CPU 100%, không ném lỗi, không trả lời', en: '100% CPU, no error, no response' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.demo === 'starve' ? buildStarve() : opts.demo === 'hang' ? buildHang() : buildOrder(),
};
