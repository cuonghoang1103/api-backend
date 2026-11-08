// Node.js 2.2 — The event loop, phase by phase. Thứ tự in đã chạy bằng Node 22.23.3 (n02/kiem-node/e1.cjs, e2.cjs, e2.mjs;
// cuộc đua setTimeout(0)/setImmediate ở mô-đun chính: 1/3 lượt timeout trước ⇒ không đoán được). Máy chấm KHÔNG có setImmediate/
// nextTick ⇒ thứ tự hàng đợi chỉ hỏi bằng order/choice; bài viết hàm dùng setTimeout + await (giờ ảo).
import { modul, cs, jsBai, q, ord, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('event loop', 'vòng lặp sự kiện', 'A loop that never stops: is any work finished? run its callback; otherwise wait.'),
  tn('phase', 'pha', 'One stage of a loop turn: timers → pending → idle/prepare → poll → check → close.'),
  tn('timers phase', 'pha timers', 'Runs setTimeout/setInterval callbacks whose time has come.'),
  tn('poll phase', 'pha poll', 'Collects new I/O events, runs their callbacks, and waits here when idle.'),
  tn('check phase', 'pha check', 'Runs setImmediate callbacks — right after poll.'),
  tn('timer drift', 'trôi hẹn giờ', 'A timer fires at or AFTER its delay, never exactly on time.'),
];

export default modul('nodejs-2-2-event-loop', '2.2 The event loop, phase by phase', [
  cs({
    ten: 'The six phases, in order',
    kho: 'EASY', phut: 4, loai: 'order',
    en: 'One turn of the loop runs six phases in a fixed order, over and over, until there is nothing left to wait for. Put them in order.',
    vi: 'Một vòng của event loop chạy sáu pha theo thứ tự cố định, lặp mãi tới khi không còn gì để chờ. Sắp chúng đúng thứ tự.',
    cau: [
      ord('f1', ['Order the phases of one loop turn.', 'Sắp các pha của một vòng.'], [
        'timers — setTimeout / setInterval callbacks whose time has come',
        'pending callbacks — some system callbacks deferred from the previous turn',
        'idle / prepare — internal to Node',
        'poll — collect new I/O events, run their callbacks, wait here when idle',
        'check — setImmediate callbacks',
        'close — cleanup such as socket.on(\'close\')',
      ], ['timers → pending → idle/prepare → poll → check → close. process.nextTick and the microtask queue are NOT phases: Node empties them between every phase (and after every callback), which is why they feel instant.', 'timers → pending → idle/prepare → poll → check → close. process.nextTick và microtask KHÔNG phải pha: Node xả chúng giữa mọi pha (và sau mỗi callback), nên chúng có vẻ chạy tức thì.']),
    ],
    goiY: [
      ['The loop starts with timers and ends with cleanup.', 'Vòng bắt đầu bằng timers và kết thúc bằng dọn dẹp.'],
      ['check (setImmediate) comes directly after poll — that is the key to the next exercise.', 'check (setImmediate) đến ngay sau poll — chìa khoá cho bài kế tiếp.'],
    ],
    loi: [
      ['Adding "microtasks" or "nextTick" as a phase.', 'Thêm "microtask" hay "nextTick" như một pha.'],
      ['Putting check before poll.', 'Đặt check trước poll.'],
    ],
    tns: TN,
  }),

  cs({
    ten: 'Inside an I/O callback: write the exact order',
    kho: 'MEDIUM', phut: 6, loai: 'order',
    en: `Inside an I/O callback the lesson says the answer is always the same. Order the printed lines (CommonJS file, Node 22; run 3× — identical every time).${pre("fs.readFile(__filename, () => {\n  console.log('sync in callback');\n  setTimeout(() => console.log('setTimeout 0'), 0);\n  setImmediate(() => console.log('setImmediate'));\n  Promise.resolve().then(() => console.log('Promise.then'));\n  process.nextTick(() => console.log('nextTick'));\n  console.log('sync end');\n});")}`,
    vi: 'Trong callback I/O, bài học nói kết quả luôn như nhau. Sắp các dòng in theo thứ tự (tệp CommonJS, Node 22; chạy 3 lần — lần nào cũng giống).',
    cau: [
      ord('i1', ['Order the six lines.', 'Sắp sáu dòng.'], [
        'sync in callback', 'sync end', 'nextTick', 'Promise.then', 'setImmediate', 'setTimeout 0',
      ], ['Synchronous code first, always. Then the two priority queues: nextTick, then microtasks (Promise). We are inside the poll phase, and check comes right after it, so setImmediate runs before the loop wraps round to timers — every time.', 'Code đồng bộ trước, luôn luôn. Rồi hai hàng ưu tiên: nextTick, rồi microtask (Promise). Ta đang ở pha poll, và check đến ngay sau nó, nên setImmediate chạy trước khi vòng quay lại timers — lần nào cũng vậy.']),
    ],
    goiY: [
      ['First all synchronous lines, then nextTick, then Promise.', 'Trước hết mọi dòng đồng bộ, rồi nextTick, rồi Promise.'],
      ['Which phase are we in when the readFile callback runs? Which phase comes next?', 'Callback readFile chạy ở pha nào? Pha nào đến kế tiếp?'],
    ],
    loi: [
      ['Putting setTimeout 0 before setImmediate because "0 ms is sooner".', 'Đặt setTimeout 0 trước setImmediate vì "0 ms sớm hơn".'],
      ['Putting the Promise before nextTick — that only happens at the top level of an ES module.', 'Đặt Promise trước nextTick — chỉ xảy ra ở cấp cao nhất của ES module.'],
    ],
    tns: TN,
  }),

  cs({
    ten: 'Predictable or not? Timers, immediates and the ES module trap',
    kho: 'MEDIUM', phut: 8,
    en: `Questions about the lesson's main experiment:${pre("console.log('[1] sync: first line');\nsetTimeout(()  => console.log('[5] setTimeout 0'), 0);\nsetImmediate(() => console.log('[6] setImmediate'));\nPromise.resolve().then(() => console.log('[4] Promise.then'));\nprocess.nextTick(() => console.log('[3] process.nextTick'));\nconsole.log('[2] sync: last line');")}`,
    vi: 'Các câu hỏi về thí nghiệm chính của bài.',
    cau: [
      q('u1', ['Saved as <code>order.cjs</code> (top level, not in a callback): which part of the output is guaranteed?', 'Lưu thành order.cjs (cấp cao nhất): phần nào của output được bảo đảm?'],
        ['[1] [2] [3] [4] always; [5] and [6] can come in either order', 'All six lines, always [1]…[6]', 'All six lines, always [1] [2] [3] [4] [6] [5]', 'Nothing — every line can move'],
        ['Sync, then nextTick, then microtasks is fixed. setTimeout(0) vs setImmediate at the top level depends on whether the 1 ms timer deadline has already passed when the loop first reaches the timers phase — luck of process start-up. Measured on Node 22: 1 run in 3 printed [5] before [6].', 'Đồng bộ → nextTick → microtask là cố định. setTimeout(0) vs setImmediate ở cấp cao nhất phụ thuộc hạn 1 ms của timer đã qua chưa khi vòng tới pha timers lần đầu — may rủi lúc khởi động. Đo Node 22: 1/3 lượt in [5] trước [6].']),
      q('u2', ['The same code saved as <code>order.mjs</code> (ES module). What changes in the guaranteed part?', 'Cùng code lưu thành order.mjs (ES module). Phần bảo đảm đổi gì?'],
        ['[4] (Promise) prints before [3] (nextTick)', 'Nothing changes', 'nextTick never runs in ES modules', '[5] always beats [6]'],
        ['An ES module\'s top-level code itself runs inside a microtask, so the microtask queue is still being drained when nextTick would get its turn: [1] [2] [4] [3]. Measured on Node 22.23.3 (3 runs). In CommonJS, nextTick wins.', 'Code cấp cao nhất của ES module chạy bên trong một microtask, nên hàng microtask còn đang được xả khi tới lượt nextTick: [1] [2] [4] [3]. Đo Node 22.23.3. Ở CommonJS, nextTick thắng.']),
      q('u3', ['What does <code>setTimeout(fn, 0)</code> really mean in Node?', 'setTimeout(fn, 0) thật ra nghĩa là gì?'],
        ['After at least 1 ms — Node raises any delay below 1 ms to 1 ms', 'Exactly now, before any other callback', 'At the next microtask', 'After exactly 0 ms, in the check phase'],
        ['There is no true 0: delays under 1 ms become 1 ms. That 1 ms is what makes the top-level race with setImmediate unpredictable.', 'Không có 0 thật: độ trễ dưới 1 ms thành 1 ms. Chính 1 ms đó làm cuộc đua với setImmediate ở cấp cao nhất không đoán được.']),
      q('u4', ['<code>setTimeout(fn, 100)</code> promises…', 'setTimeout(fn, 100) hứa gì?'],
        ['Not earlier than 100 ms — later if the loop is busy when the deadline arrives', 'Exactly 100 ms — Node uses a hardware clock, so timers never drift', 'Between 90 and 110 ms — a small random jitter in both directions', 'At most 100 ms — it may fire earlier if the loop happens to be idle'],
        ['A timer callback waits its turn like everything else. Lesson 2.4 measures a 100 ms heartbeat arriving 2 873 ms late behind a blocking loop. That is why real scheduling checks the clock (cron-style) instead of trusting setInterval over hours.', 'Callback hẹn giờ chờ tới lượt như mọi thứ khác. Bài 2.4 đo một nhịp 100 ms tới muộn 2 873 ms sau một vòng lặp chặn. Vì vậy lịch thật kiểm đồng hồ (kiểu cron) thay vì tin setInterval suốt nhiều giờ.']),
      q('u5', ['When does a Node process exit on its own?', 'Khi nào process Node tự thoát?'],
        ['When the loop has nothing left to wait for: no timers, no pending I/O, no open handles', 'Right after the last line of the main file runs, even if timers are pending', 'After 5 seconds with no new requests, to free memory on the server', 'Only when you call process.exit() — otherwise it keeps running forever'],
        ['The loop keeps turning while something can still produce a callback. A pending setTimeout or an open server socket keeps the process alive after the main file finished; when nothing is left, the loop ends and the process exits.', 'Vòng lặp còn quay khi còn thứ có thể sinh callback. Một setTimeout đang chờ hay socket server mở giữ process sống sau khi tệp chính chạy xong; hết thứ để chờ thì vòng dừng và process thoát.']),
    ],
    goiY: [
      ['Separate what the language guarantees (sync → nextTick → microtasks) from what depends on timing (timers vs check at start-up).', 'Tách thứ được bảo đảm (đồng bộ → nextTick → microtask) khỏi thứ phụ thuộc thời điểm (timers vs check lúc khởi động).'],
      ['ES module top level = already inside a microtask.', 'Cấp cao nhất của ES module = đã ở trong một microtask.'],
    ],
    loi: [
      ['Writing code that depends on setTimeout(…, 0) beating setImmediate — passes on a laptop, fails on a loaded server.', 'Viết code dựa vào setTimeout(…, 0) thắng setImmediate — qua trên laptop, hỏng trên server bận.'],
      ['Quoting the CommonJS order for an .mjs file.', 'Dùng thứ tự của CommonJS cho tệp .mjs.'],
    ],
    tns: TN,
  }),

  cs({
    ten: 'Which phase runs this callback?',
    kho: 'EASY', phut: 5, loai: 'table',
    en: 'For each callback, choose the phase that runs it — or "not a phase" for the two priority queues that are emptied between phases.',
    vi: 'Với mỗi callback, chọn pha chạy nó — hoặc "không phải pha" cho hai hàng ưu tiên được xả giữa các pha.',
    bang: [bang1('ph', ['Phase of each callback.', 'Pha của từng callback.'],
      [{ ma: 'cb', ten: 'Callback|||Callback' }, { ma: 'pha', ten: 'Phase|||Pha', luaChon: ['timers', 'poll', 'check', 'close', 'not a phase (nextTick / microtask)'] }],
      [
        { o: { cb: 'setInterval(() => heartbeat(), 100)' }, a: { pha: 'timers' } },
        { o: { cb: 'fs.readFile(path, (err, data) => …)' }, a: { pha: 'poll' } },
        { o: { cb: 'setImmediate(() => nextChunk())' }, a: { pha: 'check' } },
        { o: { cb: "socket.on('close', () => cleanup())" }, a: { pha: 'close' } },
        { o: { cb: 'Promise.resolve().then(() => …) / code after an await' }, a: { pha: 'not a phase (nextTick / microtask)' } },
        { o: { cb: 'process.nextTick(() => …)' }, a: { pha: 'not a phase (nextTick / microtask)' } },
        { o: { cb: 'setTimeout(() => retry(), 0)' }, a: { pha: 'timers' } },
      ],
      ['Timers phase: setTimeout and setInterval. Poll: completed I/O callbacks (files, network). Check: setImmediate. Close: close events. Promise reactions (including the rest of an async function after await) and nextTick are queues drained between phases and after each callback, not phases of their own.', 'Pha timers: setTimeout và setInterval. Poll: callback I/O đã xong (tệp, mạng). Check: setImmediate. Close: sự kiện close. Phản ứng Promise (kể cả phần sau await) và nextTick là hàng đợi được xả giữa các pha, không phải pha riêng.'])],
    goiY: [
      ['"Imm-ediate" → check, right after poll.', '"Immediate" → check, ngay sau poll.'],
      ['The code after <code>await</code> is a Promise reaction — a microtask.', 'Code sau await là một phản ứng Promise — một microtask.'],
    ],
    loi: [
      ['Thinking setTimeout(…, 0) runs in the check phase "because it is immediate".', 'Nghĩ setTimeout(…, 0) chạy ở pha check "vì nó tức thì".'],
      ['Thinking file I/O callbacks run in a phase called "I/O" — that is poll.', 'Nghĩ callback I/O tệp chạy ở pha tên "I/O" — đó là poll.'],
    ],
    tns: TN,
  }),

  jsBai({
    ten: 'Do not trust the scheduler: boot the API with await',
    kho: 'HARD', phut: 15,
    en: `<p>The lesson's rule: "If two things must happen in order, express that with await — not by hoping the scheduler cooperates. Timing-dependent code passes on your laptop and fails on the server under load." The starter boots the Notes API like this:</p>${pre("function boot(db, server) {\n  db.connect().then(() => db.migrate());          // async — each step takes a while\n  setTimeout(() => server.listen(3000), 50);      // \"surely connected and migrated after 50 ms\"\n}")}<p>On a laptop the database answers in 10 ms and it works. On a loaded server it takes 300 ms and the API accepts requests with no database. Rewrite <code>boot(db, server)</code>:</p>
<ul><li>Await <code>db.connect()</code>, then <code>db.migrate()</code>, then call <code>server.listen(3000)</code> — always in that order, however slow each step is.</li>
<li>Resolve with <code>'ready'</code> once listening.</li>
<li>If <code>connect</code> or <code>migrate</code> rejects, <code>boot</code> rejects with that error and <code>listen</code> is never called.</li></ul>`,
    vi: `<p>Luật của bài: "Hai việc phải theo thứ tự thì diễn đạt bằng await — đừng mong bộ lập lịch hợp tác. Code phụ thuộc thời điểm qua trên laptop và hỏng trên server bận." Viết lại boot(db, server): await db.connect(), rồi db.migrate(), rồi server.listen(3000) — luôn theo thứ tự đó dù mỗi bước chậm thế nào; resolve 'ready' khi đã listen; connect hoặc migrate reject ⇒ boot reject đúng lỗi đó và không bao giờ gọi listen.</p>`,
    yc: [
      ['Order is guaranteed by <code>await</code>, not by timers: connect → migrate → listen.', 'Thứ tự được bảo đảm bằng await, không bằng hẹn giờ: connect → migrate → listen.'],
      ['Resolve <code>\'ready\'</code>; on failure reject and never listen.', 'Resolve \'ready\'; lỗi thì reject và không listen.'],
      ['No <code>setTimeout</code> in your code.', 'Không có setTimeout trong code của bạn.'],
    ],
    goiY: [
      ['Make it <code>async function boot(db, server)</code> and write the three steps as three lines.', 'Biến thành async function boot(db, server) và viết ba bước thành ba dòng.'],
      ['Do not catch the error inside <code>boot</code>: letting it propagate is what makes <code>boot</code> reject (and keeps <code>listen</code> from running).', 'Đừng bắt lỗi trong boot: để nó lan ra chính là điều làm boot reject (và chặn listen).'],
    ],
    loi: [
      ['Raising the timeout from 50 to 500 ms — it only moves the cliff; a slower day still breaks it, and every boot is now slower.', 'Tăng hẹn giờ từ 50 lên 500 ms — chỉ dời vách đá; ngày chậm hơn vẫn hỏng, và mọi lần khởi động chậm đi.'],
      ['<code>Promise.all([db.connect(), db.migrate()])</code> — migrate needs a connection, so they must not run together.', 'Promise.all([db.connect(), db.migrate()]) — migrate cần kết nối nên không được chạy cùng lúc.'],
      ['Wrapping in <code>try/catch</code> and logging — then <code>boot</code> resolves and the caller thinks the API is up.', 'Bọc try/catch rồi chỉ log — boot resolve và bên gọi tưởng API đã lên.'],
    ],
    gt: ['<code>await</code> encodes a real dependency: the next line cannot start until the previous Promise settled, regardless of how long it takes or how busy the loop is. A timer encodes a guess about duration, and durations change under load — which is why the starter passes the fast test and fails the slow one. A rejection propagates through the awaits and rejects <code>boot</code>, so a broken database stops the start-up loudly instead of serving errors.',
      'await mã hoá một phụ thuộc thật: dòng sau không bắt đầu được khi Promise trước chưa xong, bất kể nó lâu bao nhiêu hay vòng lặp bận thế nào. Hẹn giờ mã hoá một phỏng đoán về thời lượng, mà thời lượng đổi khi tải cao — vì vậy code khởi đầu qua ca nhanh và hỏng ca chậm. Reject lan qua các await và reject boot, nên CSDL hỏng làm dừng khởi động một cách ồn ào thay vì phục vụ lỗi.'],
    kn: ['await for ordering', 'timing-dependent bugs'],
    tns: TN,
    viDu: [{ input: 'await boot(db /* connect takes 300 ms */, server); events', output: '["connect start","connect done","migrate start","migrate done","listen 3000 (db ready)"]', explanation: 'The starter logs "listen 3000 (NO DB!)" before connect is done.|||Code khởi đầu ghi "listen 3000 (NO DB!)" trước khi kết nối xong.' }],
    chung: `const events = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mkDb = (ms, fail) => { const db = { connected: false, migrated: false };
  db.connect = () => { events.push('connect start'); return sleep(ms).then(() => { if (fail === 'connect') throw new Error('ECONNREFUSED 127.0.0.1:5432'); db.connected = true; events.push('connect done'); }); };
  db.migrate = () => { events.push('migrate start'); return sleep(ms / 2).then(() => { if (!db.connected) throw new Error('migrate without connection'); if (fail === 'migrate') throw new Error('migration 0007 failed'); db.migrated = true; events.push('migrate done'); }); };
  return db; };
const mkServer = (db) => ({ listen: (port) => { events.push('listen ' + port + (db.connected && db.migrated ? ' (db ready)' : ' (NO DB!)')); } });`,
    dau: `function boot(db, server) {
  db.connect().then(() => db.migrate());
  setTimeout(() => server.listen(3000), 50); // "surely connected and migrated after 50 ms"
}
`,
    giai: `// Order comes from await, not from a guess about how long things take.
async function boot(db, server) {
  await db.connect();   // however slow: the next line waits for it
  await db.migrate();   // needs the connection, so it must come after
  server.listen(3000);  // only now is it safe to accept requests
  return 'ready';
  // no try/catch: a rejection above propagates, boot rejects, listen never runs
}
`,
    cases: [
      { moTa: ['laptop speed (10 ms): connect → migrate → listen (the starter passes this one!)', 'tốc độ laptop (10 ms): code khởi đầu QUA ca này!'], chuanBi: 'const db = mkDb(10); await boot(db, mkServer(db)); await sleep(400);', goi: 'events' },
      { moTa: ['loaded server (300 ms): still in order', 'server bận (300 ms): vẫn đúng thứ tự'], chuanBi: 'const db = mkDb(300); const r = await boot(db, mkServer(db)); await sleep(400);', goi: '[r, events]' },
      { moTa: ['connect fails ⇒ boot rejects, never listens', 'connect lỗi ⇒ boot reject, không listen'], chuanBi: "const db = mkDb(20, 'connect'); let m = ''; try { await boot(db, mkServer(db)); } catch (e) { m = e.message; } await sleep(400);", goi: '[m, events]' },
      { an: true, chuanBi: "const db = mkDb(1000, 'migrate'); let m = ''; try { await boot(db, mkServer(db)); } catch (e) { m = e.message; } await sleep(2000);", goi: '[m, events]' },
      { an: true, chuanBi: 'const db = mkDb(5000); const t = Date.now(); const r = await boot(db, mkServer(db));', goi: '[r, Date.now() - t, events[events.length - 1]]' },
    ],
    kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'No setTimeout used for ordering', vi: 'Không dùng setTimeout để sắp thứ tự' }, khop: 'setTimeout', phuDinh: true }],
  }),
]);
