// Node.js 2.3 — nextTick, microtasks and starvation. Thứ tự in: n02/kiem-node/e3.cjs; bỏ đói: st.cjs (nextTick/microtask đệ quy
// ⇒ timer không bao giờ chạy trong 1,5 s; setImmediate/setTimeout đệ quy ⇒ timer vẫn chạy). Bộ mô phỏng của bài HARD đã đối chiếu
// với Node 22.23.3 thật trên 150 chương trình ngẫu nhiên (n02/kiem-node/sim.mjs): 0 lệch.
import { modul, cs, jsBai, q, ord, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('process.nextTick', 'process.nextTick', 'Node\'s highest-priority queue; drained completely before the microtask queue.'),
  tn('microtask', 'microtask', 'A Promise reaction (or queueMicrotask) — drained completely after nextTick.'),
  tn('drain', 'xả (hàng đợi)', 'Empty a queue COMPLETELY, including items added while emptying it.'),
  tn('starvation', 'bỏ đói', 'Refilling a priority queue forever, so timers and I/O never get a turn.'),
  tn('setImmediate', 'setImmediate', 'Runs in the check phase — the polite way to yield to pending I/O.'),
];

export default modul('nodejs-2-3-microtask', '2.3 nextTick, microtasks and starvation', [
  cs({
    ten: 'The priority order',
    kho: 'EASY', phut: 3, loai: 'order',
    en: 'Two queues sit outside the six phases and jump the line at every opportunity. Order the four levels of priority (CommonJS file).',
    vi: 'Hai hàng đợi nằm ngoài sáu pha và chen lên mỗi khi có dịp. Sắp bốn mức ưu tiên (tệp CommonJS).',
    cau: [
      ord('p1', ['From first to last.', 'Từ trước tới sau.'], [
        'Synchronous code — runs to completion, always',
        'process.nextTick queue — drained completely',
        'Microtask queue (Promises, queueMicrotask) — drained completely',
        'The next loop phase (timers / poll / check…)',
      ], ['"The word that matters is <b>completely</b>": Node empties each queue, including anything added while emptying it, before moving on.', '"Chữ quan trọng là <b>hoàn toàn</b>": Node xả sạch từng hàng, kể cả thứ được thêm trong lúc xả, rồi mới đi tiếp.']),
    ],
    goiY: [['Nothing interrupts synchronous code.', 'Không gì ngắt được code đồng bộ.'], ['nextTick is Node-specific and comes before the standard microtask queue.', 'nextTick là của riêng Node và đi trước hàng microtask chuẩn.']],
    loi: [['Putting Promises before nextTick (only true at the top level of an ES module, lesson 2.2).', 'Đặt Promise trước nextTick (chỉ đúng ở cấp cao nhất của ES module, bài 2.2).'], ['Thinking a timer can run "between" two microtasks.', 'Nghĩ một timer có thể chạy "giữa" hai microtask.']],
    tns: TN,
  }),

  cs({
    ten: 'When to reach for which queue',
    kho: 'EASY', phut: 5, loai: 'table',
    en: 'The lesson\'s "nextTick vs Promise: which to use" table, as decisions. For each situation choose the tool the lesson recommends.',
    vi: 'Bảng "nextTick hay Promise: dùng cái nào" của bài, dưới dạng quyết định. Chọn công cụ bài học khuyên cho từng tình huống.',
    bang: [bang1('w1', ['Pick the tool.', 'Chọn công cụ.'],
      [{ ma: 'tinh', ten: 'Situation|||Tình huống' }, { ma: 'tool', ten: 'Tool|||Công cụ', luaChon: ['await / Promise', 'queueMicrotask', 'setImmediate', 'process.nextTick'] }],
      [
        { o: { tinh: 'Ordinary application code: wait for the database, then continue' }, a: { tool: 'await / Promise' } },
        { o: { tinh: 'Split a long loop so pending I/O can run between the slices' }, a: { tool: 'setImmediate' } },
        { o: { tinh: 'You genuinely need to defer a callback to "right after this", using the standard API' }, a: { tool: 'queueMicrotask' } },
        { o: { tinh: 'Library author: make sure a callback never fires synchronously, before any other queue' }, a: { tool: 'process.nextTick' } },
        { o: { tinh: '"I\'ll make my request handler run sooner than everything else"' }, a: { tool: 'setImmediate' } },
      ],
      ['99% of the time: await. setImmediate is the tool for yielding — it waits its turn behind pending I/O. queueMicrotask is the standard equivalent of nextTick\'s job, at Promise priority. nextTick is mostly for library internals. And the instinct "run sooner than the loop" is exactly what starves the requests you serve — the lesson says stop and use setImmediate.', '99% trường hợp: await. setImmediate là công cụ nhường lượt — nó chờ sau I/O đang treo. queueMicrotask là bản chuẩn cho việc của nextTick, ở mức ưu tiên Promise. nextTick chủ yếu cho nội bộ thư viện. Còn ý "chạy sớm hơn vòng lặp" chính là thứ bỏ đói các request bạn phục vụ — bài nói: dừng lại, dùng setImmediate.'])],
    goiY: [['Ask: do I want to go BEFORE pending I/O (dangerous) or AFTER it (polite)?', 'Hỏi: muốn chạy TRƯỚC I/O đang chờ (nguy hiểm) hay SAU nó (lịch sự)?'], ['"Standard API" points at queueMicrotask, "library author" at nextTick.', '"API chuẩn" chỉ queueMicrotask, "tác giả thư viện" chỉ nextTick.']],
    loi: [['Using process.nextTick to "speed up" a handler — it starves pending I/O.', 'Dùng process.nextTick để "tăng tốc" handler — bỏ đói I/O đang chờ.'], ['Using a microtask to split heavy work — microtasks drain completely, so nothing else runs between the slices.', 'Dùng microtask để chia việc nặng — microtask xả hết một lượt nên không gì chen vào giữa các lát.']],
    tns: TN,
  }),

  cs({
    ten: 'Nested queues: predict the exact output',
    kho: 'MEDIUM', phut: 7, loai: 'order',
    en: `A nextTick that queues a Promise, and a Promise that queues a nextTick. Order the printed lines (CommonJS, Node 22).${pre("console.log('A');\nsetTimeout(() => console.log('T1'), 0);\nPromise.resolve().then(() => { console.log('P1'); process.nextTick(() => console.log('N2')); });\nprocess.nextTick(() => { console.log('N1'); Promise.resolve().then(() => console.log('P2')); });\nqueueMicrotask(() => console.log('Q1'));\nconsole.log('B');")}`,
    vi: 'Một nextTick xếp một Promise, và một Promise xếp một nextTick. Sắp các dòng in (CommonJS, Node 22).',
    cau: [
      ord('n1', ['Order all eight lines.', 'Sắp cả tám dòng.'], ['A', 'B', 'N1', 'P1', 'Q1', 'P2', 'N2', 'T1'],
        ['Sync: A, B. nextTick queue: N1 (it queues P2 behind P1 and Q1). Then the microtask queue is drained COMPLETELY, including what was added: P1 (queues N2), Q1, P2. Only then does Node look at nextTick again: N2. Both queues empty ⇒ the loop moves on to timers: T1. Real output of Node 22.23.3: A B N1 P1 Q1 P2 N2 T1.', 'Đồng bộ: A, B. Hàng nextTick: N1 (xếp P2 sau P1 và Q1). Rồi hàng microtask được xả HẾT, kể cả thứ mới thêm: P1 (xếp N2), Q1, P2. Lúc đó Node mới xem lại nextTick: N2. Hai hàng rỗng ⇒ vòng đi tiếp tới timers: T1. Output thật Node 22.23.3: A B N1 P1 Q1 P2 N2 T1.']),
    ],
    goiY: [['Keep two lists on paper, "ticks" and "micro". Each time you run an item, append whatever it schedules to the right list.', 'Giữ hai danh sách trên giấy, "tick" và "micro". Mỗi lần chạy một mục, nối thứ nó xếp vào đúng danh sách.'], ['Rule: empty ALL ticks, then ALL micro (new ones included); repeat while ticks appeared.', 'Luật: xả HẾT tick, rồi HẾT micro (kể cả mới); lặp nếu lại có tick.']],
    loi: [['Running N2 right after P1 — a nextTick queued from a microtask waits until the microtask queue is empty.', 'Chạy N2 ngay sau P1 — nextTick được xếp từ một microtask phải chờ hàng microtask rỗng.'], ['Putting P2 right after N1 — it joins the END of the microtask queue, behind P1 and Q1.', 'Đặt P2 ngay sau N1 — nó vào CUỐI hàng microtask, sau P1 và Q1.']],
    tns: TN,
  }),

  cs({
    ten: 'Starvation: which code freezes the server?',
    kho: 'MEDIUM', phut: 7,
    en: 'Each snippet keeps rescheduling the same function <code>f</code> forever, and a <code>setTimeout(…, 10)</code> is waiting. We ran each one on Node 22 with a 1.5 s guard. Decide what happens.',
    vi: 'Mỗi đoạn code lên lịch lại hàm f mãi mãi, và một setTimeout(…, 10) đang chờ. Đã chạy từng đoạn trên Node 22 với chốt 1,5 s. Quyết định chuyện gì xảy ra.',
    cau: [
      q('v1', [`${pre("function f() { process.nextTick(f); }\nf();")}`, 'nextTick tự lên lịch lại.'],
        ['The timer never runs: the process is frozen at 100% CPU, no error', 'The timer runs after a few reschedules', 'Node throws RangeError: Maximum call stack size exceeded', 'Node detects the loop and exits'],
        ['The nextTick queue is drained completely, and it is refilled on every run — the loop never reaches the timers phase. Measured: 18 million reschedules in 1.5 s and the 10 ms timer never ran. No stack overflow, because each call starts on an empty stack.', 'Hàng nextTick được xả hết, mà mỗi lần chạy lại được đổ đầy — vòng lặp không bao giờ tới pha timers. Đo: 18 triệu lần trong 1,5 s và timer 10 ms không chạy. Không tràn ngăn xếp vì mỗi lần gọi bắt đầu trên ngăn xếp rỗng.']),
      q('v2', [`${pre("function f() { Promise.resolve().then(f); }\nf();")}`, 'Microtask tự lên lịch lại.'],
        ['The timer never runs — same freeze as nextTick', 'The timer runs, because Promises are asynchronous', 'Each .then waits 1 ms, so the timer runs after 10', 'It crashes with an unhandled rejection'],
        ['"Recursion inside microtasks does the same": the microtask queue drains completely too. Measured: 25 million reschedules, timer starved.', '"Đệ quy trong microtask cũng vậy": hàng microtask cũng xả hết. Đo: 25 triệu lần, timer bị bỏ đói.']),
      q('v3', [`${pre("function f() { setImmediate(f); }\nf();")}`, 'setImmediate tự lên lịch lại.'],
        ['The timer still runs: each setImmediate waits for the next check phase, and the loop passes timers on the way', 'The timer never runs: setImmediate refills its queue just like nextTick does', 'setImmediate throws RangeError after 1000 nested calls, then the timer runs', 'The process exits immediately, because setImmediate does not keep it alive'],
        ['An immediate scheduled during the check phase runs in the NEXT turn, so every turn the loop goes through timers and poll. Measured: the 10 ms timer ran after ~600 reschedules. That is why setImmediate is the tool for yielding.', 'Một immediate được xếp trong pha check chạy ở vòng SAU, nên mỗi vòng vòng lặp đều đi qua timers và poll. Đo: timer 10 ms chạy sau ~600 lần. Vì thế setImmediate là công cụ để nhường lượt.']),
      q('v4', ['A request handler does <code>function step() { work(); if (more) process.nextTick(step); }</code> to "finish faster". What do other users see?', 'Handler dùng nextTick lặp để "xong nhanh hơn". Người dùng khác thấy gì?'],
        ['Their requests hang until the whole job finishes — no I/O is polled meanwhile', 'Nothing — nextTick is asynchronous', 'Their requests are served between the steps', 'They get a 503 automatically'],
        ['Running before the event loop means running before pending I/O: incoming requests sit unread until the queue empties. Use setImmediate between steps (or a worker, lesson 2.5).', 'Chạy trước event loop là chạy trước I/O đang chờ: request mới nằm chưa đọc tới khi hàng rỗng. Dùng setImmediate giữa các bước (hoặc worker, bài 2.5).']),
    ],
    goiY: [['Which queues are drained "completely" (refilled = never empty)? Which run once per loop turn?', 'Hàng nào được xả "hoàn toàn" (đổ lại = không bao giờ rỗng)? Hàng nào chạy một lần mỗi vòng?'], ['"Asynchronous" does not mean "lets others run" — it depends on WHICH queue.', '"Bất đồng bộ" không có nghĩa "nhường người khác" — còn tuỳ hàng đợi NÀO.']],
    loi: [['Believing anything asynchronous yields to the loop — nextTick and microtasks do not.', 'Tin mọi thứ bất đồng bộ đều nhường vòng lặp — nextTick và microtask thì không.'], ['Expecting a crash or an error — starvation is silent: a live process that answers nothing.', 'Chờ một lỗi hay sập — bỏ đói là im lặng: process còn sống nhưng không trả lời gì.']],
    tns: TN,
  }),

  jsBai({
    ten: 'Build the queue simulator (matches real Node 22)',
    kho: 'HARD', phut: 25,
    en: `<p>Write <code>simulate(program)</code>: it returns the lines a program prints when it runs inside an I/O callback (for example in <code>fs.readFile(…, () =&gt; { … })</code>), following the lesson's rules. A program is an array of <b>steps</b>:</p>
<ul><li><code>'A'</code> (a string) ⇒ <code>console.log('A')</code></li>
<li><code>{ tick: [steps] }</code> ⇒ <code>process.nextTick(() =&gt; { steps })</code></li>
<li><code>{ micro: [steps] }</code> ⇒ <code>Promise.resolve().then(() =&gt; { steps })</code></li>
<li><code>{ immediate: [steps] }</code> ⇒ <code>setImmediate(() =&gt; { steps })</code></li>
<li><code>{ timeout: [steps] }</code> ⇒ <code>setTimeout(() =&gt; { steps }, 0)</code></li></ul>
<p>Rules (from lessons 2.2–2.3): run the program\'s steps synchronously; then <b>drain</b>: empty the tick queue completely, then the micro queue completely (items added meanwhile included), and repeat while ticks appeared. Then the check phase runs every immediate in order, draining after <b>each</b> callback; then the timers phase runs every timeout in order, again draining after each. <code>immediate</code> and <code>timeout</code> appear only at the top level of a program (the grader never nests them).</p>${pre("simulate(['A', { timeout: ['T'] }, { immediate: ['I'] }, { micro: ['P'] }, { tick: ['N'] }, 'B'])\n// ['A', 'B', 'N', 'P', 'I', 'T']   — the readFile experiment from lesson 2.2")}<p>The reference solution was compared with real Node 22.23.3 on 150 random programs (each turned into JavaScript and run inside <code>fs.readFile</code>): no difference.</p>`,
    vi: `<p>Viết simulate(program): trả các dòng một chương trình in ra khi chạy trong callback I/O, theo luật của bài 2.2–2.3. Chạy các bước đồng bộ; rồi XẢ: hết hàng tick, rồi hết hàng micro (kể cả mục mới), lặp nếu lại có tick. Rồi pha check chạy mọi immediate theo thứ tự, xả sau MỖI callback; rồi pha timers chạy mọi timeout theo thứ tự, cũng xả sau mỗi cái. immediate và timeout chỉ ở cấp cao nhất. Lời giải mẫu đã đối chiếu với Node 22.23.3 thật trên 150 chương trình ngẫu nhiên: không lệch.</p>`,
    yc: [
      ['Return the printed lines in order.', 'Trả các dòng in theo thứ tự.'],
      ['Drain = all ticks, then all micro, repeat while ticks exist — after the program and after every immediate/timeout callback.', 'Xả = hết tick, rồi hết micro, lặp khi còn tick — sau chương trình và sau mỗi callback immediate/timeout.'],
      ['All immediates (check) before all timeouts (timers) — we start inside an I/O callback.', 'Mọi immediate (check) trước mọi timeout (timers) — ta bắt đầu trong callback I/O.'],
    ],
    goiY: [
      ['Keep four arrays: <code>ticks</code>, <code>micro</code>, <code>checks</code>, <code>timers</code>. A helper <code>run(steps)</code> prints strings and pushes the other steps\' inner arrays onto the right queue.', 'Giữ bốn mảng: ticks, micro, checks, timers. Hàm run(steps) in chuỗi và đẩy mảng bên trong của các bước khác vào đúng hàng.'],
      ['<code>drain()</code>: <code>do { while (ticks.length) run(ticks.shift()); while (micro.length) run(micro.shift()); } while (ticks.length);</code>', 'drain(): do { while (ticks.length) run(ticks.shift()); while (micro.length) run(micro.shift()); } while (ticks.length);'],
      ['Main: <code>run(program); drain(); for (const cb of checks) { run(cb); drain(); } for (const cb of timers) { run(cb); drain(); }</code>', 'Chính: run(program); drain(); rồi từng check, rồi từng timer, mỗi cái kèm drain().'],
    ],
    loi: [
      ['Running a tick that was queued by a microtask before the remaining microtasks — the microtask queue drains completely first.', 'Chạy tick do microtask xếp trước các microtask còn lại — hàng microtask xả hết trước.'],
      ['Draining only once after the program — the queues must also be drained after EACH immediate and EACH timeout callback (Node ≥ 11).', 'Chỉ xả một lần sau chương trình — còn phải xả sau MỖI callback immediate và timeout (Node ≥ 11).'],
      ['Running timeouts first because they were scheduled first — inside an I/O callback the check phase comes next.', 'Chạy timeout trước vì được xếp trước — trong callback I/O, pha check đến kế tiếp.'],
    ],
    gt: ['The simulator is the lesson\'s priority table turned into code. The two inner <code>while</code> loops implement "drained COMPLETELY" (items pushed during the loop are consumed by the same loop); the outer <code>do…while</code> catches ticks queued by microtasks. Running <code>drain()</code> after every macrotask callback is how Node ≥ 11 behaves: Promise reactions from one setTimeout run before the next setTimeout. Because the program starts in the poll phase, check (immediates) comes before the loop wraps to timers.',
      'Bộ mô phỏng là bảng ưu tiên của bài biến thành code. Hai vòng while bên trong hiện thực "xả HOÀN TOÀN" (mục được đẩy trong lúc lặp được chính vòng đó tiêu thụ); do…while bên ngoài bắt các tick do microtask xếp. Chạy drain() sau mỗi callback macrotask là hành vi của Node ≥ 11: phản ứng Promise của một setTimeout chạy trước setTimeout kế tiếp. Vì chương trình bắt đầu ở pha poll, check (immediate) đến trước khi vòng quay về timers.'],
    kn: ['event loop model', 'nextTick vs microtasks', 'queue draining'],
    tns: TN,
    viDu: [{ input: "simulate(['A', { timeout: ['T'] }, { immediate: ['I'] }, { micro: ['P'] }, { tick: ['N'] }, 'B'])", output: '["A","B","N","P","I","T"]', explanation: 'Same as the readFile experiment of lesson 2.2.|||Giống thí nghiệm readFile của bài 2.2.' }],
    dau: `// Runs the steps in the order they are written (wrong: ignores the queues).
function simulate(program) {
  const out = [];
  const run = (steps) => {
    for (const s of steps) {
      if (typeof s === 'string') out.push(s);
      else run(s.tick || s.micro || s.immediate || s.timeout);
    }
  };
  run(program);
  return out;
}
`,
    giai: `// Model of Node's queues for a program that runs inside an I/O callback.
function simulate(program) {
  const out = [];
  const ticks = [], micro = [], checks = [], timers = [];

  // run steps synchronously: print strings, queue everything else
  const run = (steps) => {
    for (const s of steps) {
      if (typeof s === 'string') out.push(s);
      else if (s.tick) ticks.push(s.tick);
      else if (s.micro) micro.push(s.micro);
      else if (s.immediate) checks.push(s.immediate);
      else if (s.timeout) timers.push(s.timeout);
    }
  };

  // "drained COMPLETELY": items added while draining are drained too.
  // Ticks first, then ALL microtasks; ticks queued by microtasks -> go round again.
  const drain = () => {
    do {
      while (ticks.length) run(ticks.shift());
      while (micro.length) run(micro.shift());
    } while (ticks.length);
  };

  run(program);
  drain();                                        // after the I/O callback itself
  for (const cb of checks) { run(cb); drain(); }  // check phase comes right after poll
  for (const cb of timers) { run(cb); drain(); }  // next turn: timers phase
  return out;
}
`,
    cases: [
      { moTa: ['the readFile experiment of lesson 2.2', 'thí nghiệm readFile của bài 2.2'], goi: "simulate(['A', { timeout: ['T'] }, { immediate: ['I'] }, { micro: ['P'] }, { tick: ['N'] }, 'B'])" },
      { moTa: ['nested: tick queues micro, micro queues tick', 'lồng: tick xếp micro, micro xếp tick'], goi: "simulate(['A', { timeout: ['T1'] }, { micro: ['P1', { tick: ['N2'] }] }, { tick: ['N1', { micro: ['P2'] }] }, { micro: ['Q1'] }, 'B'])" },
      { moTa: ['draining happens after EACH immediate', 'xả sau MỖI immediate'], goi: "simulate([{ immediate: ['I1', { micro: ['P after I1'] }] }, { immediate: ['I2'] }])" },
      { an: true, goi: "simulate([{ timeout: ['T1', { tick: ['N after T1'] }, { micro: ['P after T1'] }] }, { timeout: ['T2'] }, { immediate: ['I1'] }, { micro: [{ micro: [{ micro: ['deep'] }] }, 'm1'] }, { tick: [{ tick: ['tt'] }, 't1'] }])" },
      { an: true, goi: "simulate([{ micro: ['m1', { tick: ['t-from-m1'] }, { micro: ['m-from-m1'] }] }, { micro: ['m2'] }, { tick: ['t1', { tick: ['t-from-t1'] }] }, 'sync'])" },
      { an: true, goi: "simulate([{ immediate: [{ tick: ['a'] }, { micro: ['b'] }, 'c'] }, { timeout: [{ micro: ['d'] }, { tick: ['e'] }] }, { immediate: ['f'] }])" },
      { an: true, goi: 'simulate([])' },
    ],
  }),
]);
