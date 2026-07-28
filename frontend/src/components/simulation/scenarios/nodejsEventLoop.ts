/**
 * Node.js · Bài 2.2 — Event loop, đi qua từng pha.
 *
 * Kịch bản PANEL đầu tiên của studio, và là lý do panel phải tồn tại: không
 * có sơ đồ mạng nào kể được chuyện này. Ở đây không có gói tin nào đi từ máy
 * này sang máy kia — tất cả xảy ra bên trong MỘT tiến trình, giữa một ngăn
 * xếp, hai hàng đợi "chen ngang" và sáu pha của vòng lặp.
 *
 * Nội dung bám đúng bài 2.2 trong giáo trình (`content/courses/nodejs/
 * s02-runtime.mjs`): cùng đoạn mã, cùng thứ tự [1]…[6], cùng kết luận rằng
 * `setTimeout(0)` so với `setImmediate` ở mã chính là KHÔNG đoán trước được
 * — nên thứ tự ấy được đưa thành một tuỳ chọn để người học lật qua lật lại
 * và tự thấy cả hai kết cục đều hợp lệ.
 */

import { RotateCw } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ────────────────────────────────────────────────────────────
   MÃ NGUỒN HIỆN TRONG KHUNG
   ──────────────────────────────────────────────────────────── */

const ORDER_CODE = [
  '// node order.js',
  "console.log('[1] sync: first line');",
  "setTimeout(() => console.log('[5] timeout 0'), 0);",
  "setImmediate(() => console.log('[6] immediate'));",
  "Promise.resolve().then(() => console.log('[4] micro'));",
  "process.nextTick(() => console.log('[3] tick'));",
  "console.log('[2] sync: last line');",
];

const IO_CODE = [
  '// node io.js',
  "const fs = require('node:fs');",
  '',
  'fs.readFile(__filename, () => {',
  "  console.log('[1] poll: readFile done');",
  "  setTimeout(() => console.log('[3] timeout 0'), 0);",
  "  setImmediate(() => console.log('[2] immediate'));",
  '});',
];

/* ────────────────────────────────────────────────────────────
   BỐ CỤC PANEL
   ──────────────────────────────────────────────────────────── */

const buildPanels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Mã nguồn', en: 'Source' },
    hint: { vi: 'dòng đang chạy', en: 'line running' },
    x: 0,
    y: 0,
    w: 392,
    h: 318,
    lines: opts.demo === 'io' ? IO_CODE : ORDER_CODE,
    startLine: 1,
  },
  {
    id: 'stack',
    kind: 'stack',
    title: { vi: 'Ngăn xếp lời gọi', en: 'Call stack' },
    hint: { vi: 'một luồng duy nhất', en: 'single thread' },
    x: 0,
    y: 330,
    w: 392,
    h: 230,
    floor: { vi: '— ngăn xếp trống —', en: '— stack empty —' },
    accent: '#f59e0b',
  },
  {
    id: 'loop',
    kind: 'lanes',
    title: { vi: 'Sáu pha của một vòng lặp', en: 'Six phases of one turn' },
    hint: { vi: 'chạy theo đúng thứ tự này, lặp mãi', en: 'always this order, forever' },
    x: 404,
    y: 0,
    w: 596,
    h: 250,
    lanes: [
      { id: 'timers', label: '1 · timers', sub: { vi: 'setTimeout · setInterval', en: 'setTimeout · setInterval' }, accent: '#f59e0b' },
      { id: 'pending', label: '2 · pending', sub: { vi: 'callback hệ thống hoãn', en: 'deferred system callbacks' }, accent: '#7f92b4' },
      { id: 'prepare', label: '3 · idle / prepare', sub: { vi: 'nội bộ Node', en: 'Node internals' }, accent: '#4a5a78' },
      { id: 'poll', label: '4 · poll', sub: { vi: 'I/O — vòng lặp NẰM CHỜ', en: 'I/O — the loop WAITS here' }, accent: '#38bdf8' },
      { id: 'check', label: '5 · check', sub: { vi: 'setImmediate', en: 'setImmediate' }, accent: '#a855f7' },
      { id: 'close', label: '6 · close', sub: { vi: "socket.on('close')", en: "socket.on('close')" }, accent: '#7f92b4' },
    ],
  },
  {
    id: 'jump',
    kind: 'lanes',
    title: { vi: 'Hai hàng đợi chen ngang', en: 'The two jump-the-queue queues' },
    hint: { vi: 'KHÔNG phải pha — dọn sạch giữa mọi pha', en: 'NOT phases — drained between every phase' },
    x: 404,
    y: 262,
    w: 596,
    h: 108,
    accent: '#34d399',
    lanes: [
      { id: 'tick', label: 'process.nextTick', accent: '#34d399' },
      { id: 'micro', label: 'microtask (Promise)', accent: '#22d3ee' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả in ra', en: 'Program output' },
    x: 404,
    y: 382,
    w: 596,
    h: 178,
    accent: '#34d399',
    maxLines: 6,
  },
];

/* ────────────────────────────────────────────────────────────
   TIỆN ÍCH DỰNG BƯỚC
   ──────────────────────────────────────────────────────────── */

/** Sáng dòng mã số `n` (1-based theo mảng ở trên). */
const line = (n: number): PanelOp => ({ p: 'code', op: 'lines', value: n > 0 ? [n] : [] });
/** In một dòng ra cửa sổ kết quả. */
const out = (label: string, tone: 'ok' | 'warn' | 'muted' = 'ok'): PanelOp => ({
  p: 'out',
  op: 'push',
  item: { label, tone },
});
/** Chiếu sáng một pha (hoặc một hàng đợi chen ngang). */
const phase = (id: string | null): PanelOp => ({ p: 'loop', op: 'active', value: id });
const jump = (id: string | null): PanelOp => ({ p: 'jump', op: 'active', value: id });

/* ────────────────────────────────────────────────────────────
   KỊCH BẢN A — THỨ TỰ SÁU DÒNG
   ──────────────────────────────────────────────────────────── */

function buildOrder(timerWins: boolean): SimStep[] {
  const steps: SimStep[] = [];
  const push = (
    id: string,
    title: I18nText,
    detail: I18nText,
    duration: number,
    ops: PanelOp[],
    extra: Partial<SimStep> = {}
  ) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };

  push(
    'boot',
    { vi: 'Node nạp file và bắt đầu chạy', en: 'Node loads the file and starts running' },
    {
      vi: 'Trước khi có vòng lặp nào, Node đọc file, biên dịch, rồi chạy mã đồng bộ từ trên xuống trên MỘT luồng duy nhất. Toàn bộ thân module là một khung trong ngăn xếp: `main()`.',
      en: 'Before any loop turns, Node reads the file, compiles it, and runs the synchronous code top to bottom on a SINGLE thread. The whole module body is one stack frame: `main()`.',
    },
    1700,
    [
      line(1),
      { p: 'stack', op: 'push', item: { id: 'f_main', label: 'main()', sub: 'module scope', tone: 'active' } },
      out('$ node order.js', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'sync1',
    { vi: 'Dòng 2 — in ngay lập tức', en: 'Line 2 — prints immediately' },
    {
      vi: '`console.log` là lời gọi đồng bộ: nó chạy và trả về ngay trong lúc `main()` còn trên ngăn xếp. Không có hàng đợi nào tham gia.',
      en: '`console.log` is a synchronous call: it runs and returns while `main()` is still on the stack. No queue is involved.',
    },
    1500,
    [line(2), out('[1] sync: first line')],
    { sfx: 'blip' }
  );

  push(
    'timer',
    { vi: 'Dòng 3 — setTimeout KHÔNG chờ', en: 'Line 3 — setTimeout does NOT wait' },
    {
      vi: '`setTimeout` chỉ ĐĂNG KÝ một callback với hạn "sau ít nhất 0ms" rồi trả về ngay. Callback xuống nằm ở pha timers, chờ tới lượt.',
      en: '`setTimeout` merely REGISTERS a callback with an "after at least 0ms" deadline and returns instantly. The callback goes and sits in the timers phase.',
    },
    1700,
    [
      line(3),
      { p: 'loop', op: 'push', lane: 'timers', item: { id: 'q_timer', label: '[5] timeout 0', sub: '≥ 0ms', tone: 'warn' } },
    ],
    { sfx: 'ping' }
  );

  push(
    'immediate',
    { vi: 'Dòng 4 — setImmediate vào pha check', en: 'Line 4 — setImmediate goes to check' },
    {
      vi: '`setImmediate` không có hạn giờ nào cả. Nó luôn nằm ở pha check, tức là được chạy ở vòng lặp gần nhất, ngay sau khi pha poll xong.',
      en: '`setImmediate` has no deadline at all. It always sits in the check phase, i.e. it runs on the very next turn, right after poll finishes.',
    },
    1700,
    [
      line(4),
      { p: 'loop', op: 'push', lane: 'check', item: { id: 'q_imm', label: '[6] immediate', tone: 'info' } },
    ],
    { sfx: 'ping' }
  );

  push(
    'promise',
    { vi: 'Dòng 5 — microtask', en: 'Line 5 — microtask' },
    {
      vi: 'Promise đã `resolve` sẵn, nên callback `.then` được xếp vào hàng microtask. Hàng này KHÔNG phải một pha: nó được dọn sạch ở mọi cơ hội.',
      en: 'The promise is already resolved, so the `.then` callback is queued as a microtask. That queue is NOT a phase: it gets drained at every opportunity.',
    },
    1700,
    [
      line(5),
      { p: 'jump', op: 'push', lane: 'micro', item: { id: 'q_micro', label: '[4] micro', tone: 'ok' } },
    ],
    { sfx: 'blip' }
  );

  push(
    'tick',
    { vi: 'Dòng 6 — nextTick còn chen trước cả microtask', en: 'Line 6 — nextTick cuts ahead of microtasks' },
    {
      vi: '`process.nextTick` có hàng đợi RIÊNG, và hàng đó luôn được dọn TRƯỚC hàng microtask. Đây là hàng đợi ưu tiên cao nhất trong toàn bộ Node.',
      en: '`process.nextTick` has its OWN queue, and that queue is always drained BEFORE the microtask queue. It is the highest-priority queue in all of Node.',
    },
    1800,
    [
      line(6),
      { p: 'jump', op: 'push', lane: 'tick', item: { id: 'q_tick', label: '[3] tick', tone: 'ok' } },
    ],
    {
      sfx: 'blip',
      teachingNote: {
        vi: 'Dừng ở đây: hỏi học viên đoán thứ tự in ra trước khi chạy tiếp.',
        en: 'Pause here: ask the class to predict the output order before continuing.',
      },
    }
  );

  push(
    'sync2',
    { vi: 'Dòng 7 — dòng đồng bộ cuối cùng', en: 'Line 7 — the last synchronous line' },
    {
      vi: 'Ba callback đã nằm chờ, nhưng KHÔNG cái nào chạy được: `main()` vẫn đang chiếm ngăn xếp. Đây là toàn bộ luật chơi của Node gói trong một câu.',
      en: 'Three callbacks are waiting, and NONE of them can run: `main()` still owns the stack. That single fact is the whole rulebook of Node.',
    },
    1700,
    [line(7), out('[2] sync: last line')],
    { sfx: 'blip' }
  );

  push(
    'stack-empty',
    { vi: 'main() trả về — ngăn xếp trống', en: 'main() returns — the stack empties' },
    {
      vi: 'Chỉ tới khoảnh khắc này, khi không còn khung nào trên ngăn xếp, Node mới được phép nhìn tới các hàng đợi. Mọi thứ bất đồng bộ đều bắt đầu từ đây.',
      en: 'Only at this moment, with no frame left on the stack, is Node allowed to look at the queues. Everything asynchronous starts here.',
    },
    1600,
    [line(0), { p: 'stack', op: 'pop' }],
    {
      sfx: 'swoosh',
      teachingNote: {
        vi: 'Câu chốt của cả bài: callback không bao giờ cắt ngang mã đang chạy.',
        en: 'The key line of the whole lesson: a callback never interrupts running code.',
      },
    }
  );

  push(
    'drain-tick',
    { vi: 'Dọn hàng nextTick trước', en: 'Drain nextTick first' },
    {
      vi: 'Hàng `nextTick` được dọn trước tiên. Callback được đẩy lên ngăn xếp, chạy, in ra `[3]`, rồi rời đi.',
      en: 'The `nextTick` queue goes first. Its callback is pushed onto the stack, runs, prints `[3]`, and leaves.',
    },
    1800,
    [
      jump('tick'),
      { p: 'jump', op: 'shift', lane: 'tick' },
      { p: 'stack', op: 'push', item: { id: 'f_tick', label: 'tick cb', sub: 'process.nextTick', tone: 'ok' } },
      out('[3] tick'),
    ],
    { sfx: 'ping' }
  );

  push(
    'drain-micro',
    { vi: 'Rồi mới tới microtask', en: 'Then the microtasks' },
    {
      vi: 'Hàng `nextTick` sạch thì tới lượt microtask. Cũng lên ngăn xếp, cũng chạy tới khi xong. Lúc này vòng lặp VẪN CHƯA quay vòng nào.',
      en: 'With `nextTick` empty, microtasks are next. Same stack, same run-to-completion. And the loop still has not turned a single time.',
    },
    1800,
    [
      { p: 'stack', op: 'pop' },
      jump('micro'),
      { p: 'jump', op: 'shift', lane: 'micro' },
      { p: 'stack', op: 'push', item: { id: 'f_micro', label: 'micro cb', sub: 'Promise.then', tone: 'ok' } },
      out('[4] micro'),
    ],
    { sfx: 'ping' }
  );

  push(
    'turn-1',
    { vi: 'Vòng lặp bắt đầu quay — pha 1: timers', en: 'The loop starts turning — phase 1: timers' },
    timerWins
      ? {
          vi: 'Tới pha timers, hạn 0ms ĐÃ trôi qua (quá trình khởi động tốn nhiều hơn 0ms), nên callback chạy ngay trong vòng đầu tiên: `[5]` in ra trước `[6]`.',
          en: 'Reaching timers, the 0ms deadline has ALREADY passed (start-up took longer than 0ms), so the callback fires on this very first turn: `[5]` prints before `[6]`.',
        }
      : {
          vi: 'Tới pha timers, hạn 0ms CHƯA kịp trôi qua — quá trình khởi động lần này nhanh hơn một chút. Callback ở lại hàng, vòng lặp đi tiếp.',
          en: 'Reaching timers, the 0ms deadline has NOT elapsed yet — this start-up happened to be a hair faster. The callback stays queued and the loop moves on.',
        },
    2000,
    timerWins
      ? [
          { p: 'stack', op: 'pop' },
          jump(null),
          phase('timers'),
          { p: 'loop', op: 'shift', lane: 'timers' },
          out('[5] timeout 0'),
        ]
      : [
          { p: 'stack', op: 'pop' },
          jump(null),
          phase('timers'),
          { p: 'loop', op: 'tone', lane: 'timers', key: 'q_timer', tone: 'muted', sub: 'chưa tới hạn' },
        ],
    { sfx: timerWins ? 'success' : 'buzz' }
  );

  push(
    'pending',
    { vi: 'Pha 2 — pending callbacks', en: 'Phase 2 — pending callbacks' },
    {
      vi: 'Chỗ này dành cho vài callback cấp hệ thống bị hoãn từ vòng trước (ví dụ một số lỗi TCP). Lần chạy này không có gì.',
      en: 'This is where a few system-level callbacks deferred from the previous turn land (certain TCP errors, for instance). Nothing this run.',
    },
    1200,
    [phase('pending')]
  );

  push(
    'prepare',
    { vi: 'Pha 3 — idle / prepare', en: 'Phase 3 — idle / prepare' },
    {
      vi: 'Pha nội bộ của Node. Bạn không có cách nào đưa mã của mình vào đây, và cũng không cần.',
      en: "Node's internal phase. There is no way to put your own code here, and no reason to.",
    },
    1100,
    [phase('prepare')]
  );

  push(
    'poll',
    { vi: 'Pha 4 — poll, trái tim của vòng lặp', en: 'Phase 4 — poll, the heart of the loop' },
    {
      vi: 'Đây là nơi callback của I/O (đọc file, truy vấn CSDL, request mạng) được chạy. Và khi không còn gì để làm, đây cũng chính là nơi tiến trình NẰM NGỦ chờ việc — không đốt CPU.',
      en: 'This is where I/O callbacks run — file reads, database queries, network requests. And when there is nothing to do, this is exactly where the process SLEEPS waiting for work, burning no CPU.',
    },
    2000,
    [phase('poll')],
    {
      teachingNote: {
        vi: 'Nhấn mạnh: "chờ" trong Node là ngủ ở pha poll, không phải một vòng lặp quay không.',
        en: 'Stress this: "waiting" in Node means sleeping in poll, not spinning a loop.',
      },
    }
  );

  push(
    'check',
    { vi: 'Pha 5 — check: setImmediate chạy', en: 'Phase 5 — check: setImmediate runs' },
    {
      vi: 'Ngay sau poll là check. Callback của `setImmediate` lên ngăn xếp và in `[6]`.',
      en: 'Right after poll comes check. The `setImmediate` callback takes the stack and prints `[6]`.',
    },
    1800,
    [
      phase('check'),
      { p: 'loop', op: 'shift', lane: 'check' },
      { p: 'stack', op: 'push', item: { id: 'f_imm', label: 'immediate cb', sub: 'check phase', tone: 'info' } },
      out('[6] immediate'),
    ],
    { sfx: 'ping' }
  );

  push(
    'close',
    { vi: 'Pha 6 — close callbacks', en: 'Phase 6 — close callbacks' },
    {
      vi: 'Pha dọn dẹp: `socket.on("close")` và tương tự. Hết pha này là hết một vòng — rồi quay lại pha 1.',
      en: 'The cleanup phase: `socket.on("close")` and friends. When it ends, one turn is over — and phase 1 comes round again.',
    },
    1300,
    [{ p: 'stack', op: 'pop' }, phase('close')]
  );

  if (!timerWins) {
    push(
      'turn-2',
      { vi: 'Vòng thứ hai — giờ timer mới tới hạn', en: 'Second turn — now the timer is due' },
      {
        vi: 'Vòng lặp quay lại pha timers. Lần này 0ms đã trôi qua từ lâu, callback chạy và in `[5]` — SAU `[6]`. Cùng một đoạn mã, thứ tự ngược lại với lần chạy trước.',
        en: 'The loop comes back round to timers. This time 0ms has long since passed, so the callback runs and prints `[5]` — AFTER `[6]`. Same code, opposite order to the previous run.',
      },
      2100,
      [phase('timers'), { p: 'loop', op: 'shift', lane: 'timers' }, out('[5] timeout 0')],
      { sfx: 'success' }
    );
  }

  push(
    'verdict',
    { vi: 'Không còn việc — tiến trình thoát', en: 'Nothing left — the process exits' },
    timerWins
      ? {
          vi: 'Thứ tự lần này: 1 · 2 · 3 · 4 · 5 · 6. Nhưng hãy đổi tuỳ chọn "Lần chạy này" và chạy lại: `[6]` sẽ ra trước `[5]`. Cả hai đều ĐÚNG — `setTimeout(0)` nghĩa là "sau ít nhất 0ms", còn khởi động nhanh hay chậm là chuyện của vài micro giây may rủi.',
          en: 'This run: 1 · 2 · 3 · 4 · 5 · 6. Now flip the "this run" option and watch `[6]` come out before `[5]`. Both are CORRECT — `setTimeout(0)` means "after at least 0ms", and whether start-up beat that deadline is a matter of a few microseconds of luck.',
        }
      : {
          vi: 'Thứ tự lần này: 1 · 2 · 3 · 4 · 6 · 5. Đổi tuỳ chọn "Lần chạy này" thì `[5]` lại ra trước. Cả hai đều ĐÚNG: ở mã chính, `setTimeout(0)` so với `setImmediate` là cuộc đua không ai bảo đảm được. Chỉ BÊN TRONG một callback I/O thì thứ tự mới cố định — chọn kịch bản "Bên trong I/O" để thấy.',
          en: 'This run: 1 · 2 · 3 · 4 · 6 · 5. Flip the "this run" option and `[5]` wins instead. Both are CORRECT: in the main module, `setTimeout(0)` versus `setImmediate` is a race nobody can promise. Only INSIDE an I/O callback does the order become fixed — pick the "Inside I/O" scenario to see it.',
        },
    2400,
    [phase(null), jump(null), line(0)],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   KỊCH BẢN B — BÊN TRONG MỘT CALLBACK I/O
   ──────────────────────────────────────────────────────────── */

function buildIo(): SimStep[] {
  const steps: SimStep[] = [];
  const push = (
    id: string,
    title: I18nText,
    detail: I18nText,
    duration: number,
    ops: PanelOp[],
    extra: Partial<SimStep> = {}
  ) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };

  push(
    'boot',
    { vi: 'Đăng ký một lần đọc file', en: 'Register one file read' },
    {
      vi: '`fs.readFile` giao việc cho threadpool của libuv rồi trả về ngay. `main()` chạy hết và rời ngăn xếp, không chờ một mili giây nào.',
      en: '`fs.readFile` hands the work to libuv’s threadpool and returns at once. `main()` finishes and leaves the stack without waiting a millisecond.',
    },
    2000,
    [
      line(4),
      { p: 'stack', op: 'push', item: { id: 'f_main', label: 'main()', sub: 'module scope', tone: 'active' } },
      { p: 'loop', op: 'push', lane: 'poll', item: { id: 'q_read', label: 'readFile', sub: 'đang đọc đĩa', tone: 'muted' } },
      out('$ node io.js', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'idle',
    { vi: 'Ngăn xếp trống — vòng lặp ngủ ở pha poll', en: 'Stack empty — the loop sleeps in poll' },
    {
      vi: 'Không còn gì để chạy. Vòng lặp quay tới pha poll và NẰM CHỜ ở đó. Đây là trạng thái một server Node dành phần lớn đời mình trong đó.',
      en: 'Nothing left to run. The loop reaches poll and WAITS there. This is the state a Node server spends most of its life in.',
    },
    2000,
    [line(0), { p: 'stack', op: 'pop' }, phase('poll')],
    { sfx: 'swoosh' }
  );

  push(
    'ready',
    { vi: 'Đĩa trả dữ liệu — callback vào pha poll', en: 'The disk answers — callback enters poll' },
    {
      vi: 'Threadpool đọc xong, báo về. Callback được chạy NGAY trong pha poll, đẩy lên ngăn xếp và in `[1]`.',
      en: 'The threadpool is done and reports back. The callback runs right there in the poll phase, takes the stack, and prints `[1]`.',
    },
    1900,
    [
      line(5),
      { p: 'loop', op: 'shift', lane: 'poll' },
      { p: 'stack', op: 'push', item: { id: 'f_cb', label: 'readFile cb', sub: 'poll phase', tone: 'active' } },
      out('[1] poll: readFile done'),
    ],
    { sfx: 'ping' }
  );

  push(
    'register',
    { vi: 'Bên trong callback: đăng ký cả hai', en: 'Inside the callback: register both' },
    {
      vi: 'Đúng đoạn mã của kịch bản trước — một `setTimeout(0)`, một `setImmediate`. Nhưng vị trí đăng ký đã khác hẳn: ta đang đứng Ở TRONG pha poll.',
      en: 'The exact pair from the previous scenario — one `setTimeout(0)`, one `setImmediate`. But the vantage point is different: we are standing INSIDE the poll phase.',
    },
    2000,
    [
      { p: 'code', op: 'lines', value: [6, 7] },
      { p: 'loop', op: 'push', lane: 'timers', item: { id: 'q_timer', label: '[3] timeout 0', sub: '≥ 0ms', tone: 'warn' } },
      { p: 'loop', op: 'push', lane: 'check', item: { id: 'q_imm', label: '[2] immediate', tone: 'info' } },
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Hỏi lại lớp: lần này ai in trước? Và vì sao lần này CHẮC CHẮN?',
        en: 'Ask the class again: who prints first now? And why is it CERTAIN this time?',
      },
    }
  );

  push(
    'check',
    { vi: 'Ra khỏi poll là tới thẳng check', en: 'Leaving poll leads straight into check' },
    {
      vi: 'Callback trả về, ngăn xếp trống, vòng lặp đi tiếp — và pha ngay sau poll LUÔN LUÔN là check. `[2]` in ra trước.',
      en: 'The callback returns, the stack empties, the loop moves on — and the phase right after poll is ALWAYS check. `[2]` prints first.',
    },
    2000,
    [
      line(0),
      { p: 'stack', op: 'pop' },
      phase('check'),
      { p: 'loop', op: 'shift', lane: 'check' },
      { p: 'stack', op: 'push', item: { id: 'f_imm', label: 'immediate cb', tone: 'info' } },
      out('[2] immediate'),
    ],
    { sfx: 'success' }
  );

  push(
    'timers',
    { vi: 'Timer phải chờ hết vòng, sang vòng sau', en: 'The timer waits out the turn' },
    {
      vi: 'Pha timers nằm ở ĐẦU vòng, mà ta đang ở cuối vòng. Callback timer phải đợi close xong, vòng mới bắt đầu, rồi mới tới lượt: `[3]` in sau.',
      en: 'The timers phase sits at the START of a turn, and we are at the end of one. The timer callback must wait for close, for a new turn to begin, and only then run: `[3]` prints last.',
    },
    2100,
    [{ p: 'stack', op: 'pop' }, phase('close')],
    { sfx: 'blip' }
  );

  push(
    'fire',
    { vi: 'Vòng mới — timers chạy', en: 'New turn — timers fire' },
    {
      vi: 'Vòng lặp quay lại pha 1 và chạy timer. Kết quả `[1] [2] [3]` — và lần nào chạy cũng đúng thứ tự này.',
      en: 'The loop comes round to phase 1 and runs the timer. Result: `[1] [2] [3]` — and it is this order on every single run.',
    },
    2000,
    [phase('timers'), { p: 'loop', op: 'shift', lane: 'timers' }, out('[3] timeout 0')],
    { sfx: 'ping' }
  );

  push(
    'verdict',
    { vi: 'Thứ tự này thì bảo đảm được', en: 'This order is guaranteed' },
    {
      vi: 'Cùng hai dòng mã, ở mã chính thì thứ tự ngẫu nhiên, còn trong callback I/O thì cố định tuyệt đối. Không phải vì `setImmediate` "nhanh hơn", mà vì bạn đã đứng ở một vị trí xác định trong vòng lặp. Hiểu vị trí là hiểu Node.',
      en: 'The same two lines: random order in the main module, absolutely fixed inside an I/O callback. Not because `setImmediate` is "faster", but because you are standing at a known position in the loop. Understand the position and you understand Node.',
    },
    2400,
    [phase(null), line(0)],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   KỊCH BẢN
   ──────────────────────────────────────────────────────────── */

export const nodejsEventLoopScenario: Scenario = {
  id: 'nodejs-event-loop',
  name: { vi: 'Event loop, từng pha một', en: 'The event loop, phase by phase' },
  tagline: {
    vi: 'Một luồng, một ngăn xếp, sáu pha và hai hàng đợi chen ngang. Xem đúng thứ tự sáu dòng in ra — và vì sao hai dòng cuối đổi chỗ được.',
    en: 'One thread, one stack, six phases and two queues that cut ahead. Watch the exact order of six printed lines — and why the last two can swap.',
  },
  icon: RotateCw,
  accent: '#34d399',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '2.2',
    slug: 'nodejs-2-2-event-loop',
    title: { vi: 'Event loop, đi qua từng pha', en: 'The event loop, phase by phase' },
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
          label: 'Thứ tự 6 dòng',
          fullLabel: 'order.js — sáu dòng in ra',
          color: '#34d399',
          hint: { vi: 'sync · nextTick · promise · timeout · immediate', en: 'sync · nextTick · promise · timeout · immediate' },
        },
        {
          value: 'io',
          label: 'Bên trong I/O',
          fullLabel: 'io.js — bên trong callback đọc file',
          color: '#38bdf8',
          hint: { vi: 'nơi thứ tự trở nên chắc chắn', en: 'where the order becomes certain' },
        },
      ],
    },
    {
      id: 'race',
      label: { vi: 'Lần chạy này (chỉ ở mã chính)', en: 'This particular run (main module only)' },
      defaultValue: 'timeout',
      choices: [
        {
          value: 'timeout',
          label: 'timeout thắng',
          fullLabel: '[5] timeout ra trước [6] immediate',
          color: '#f59e0b',
          hint: { vi: 'khởi động lâu hơn 0ms', en: 'start-up took longer than 0ms' },
        },
        {
          value: 'immediate',
          label: 'immediate thắng',
          fullLabel: '[6] immediate ra trước [5] timeout',
          color: '#a855f7',
          hint: { vi: 'khởi động kịp trước hạn', en: 'start-up beat the deadline' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.demo === 'io' ? buildIo() : buildOrder(opts.race !== 'immediate'),
};
