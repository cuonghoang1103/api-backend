// Node.js 1.4 — Async: callbacks, Promises, async/await. Mọi hẹn giờ/đồng hồ là GIẢ (giờ ảo của máy chấm) ⇒ "900 ms vs 300 ms" đo đúng.
import { modul, jsBai, tn, pre, RES_GIA, KHO_GIA } from './_node.mjs';

const TN = [
  tn('callback (error-first)', 'callback (lỗi đứng đầu)', 'The Node convention: cb(err, result) — check err before using result.'),
  tn('Promise', 'Promise', 'An object for a future value: pending, then fulfilled or rejected.'),
  tn('async / await', 'async / await', 'An async function always returns a Promise; await pauses until it settles.'),
  tn('Promise.all', 'Promise.all', 'Waits for all; rejects as soon as ONE rejects.'),
  tn('Promise.allSettled', 'Promise.allSettled', 'Never rejects; reports { status, value | reason } for each.'),
  tn('unhandled rejection', 'rejection không ai bắt', 'A rejected Promise nobody catches — modern Node exits the process.'),
];
const SLEEP = 'const sleep = (ms) => new Promise((r) => setTimeout(r, ms));';

export default modul('nodejs-1-4-bat-dong-bo', '1.4 Async: callbacks, Promises, async/await', [
  jsBai({
    ten: 'Mistake 1: the forgotten await',
    kho: 'EASY', phut: 8,
    en: `<p>Mistake 1 of the lesson: "Forget await and you send the client a Promise object". <code>getNoteTitle(repo, id)</code> should return the title of a note, or <code>null</code> if there is no such note. <code>repo.findById(id)</code> is <b>async</b> — it returns a Promise that resolves to the note or <code>null</code> after a short wait.</p>${pre("await getNoteTitle(repo, 1);    // 'Buy milk'\nawait getNoteTitle(repo, 404);  // null")}<p>The starter forgets <code>await</code>: <code>note</code> is a pending Promise, which is truthy, so it returns <code>note.title</code> → <code>undefined</code> for every id.</p>`,
    vi: `<p>Lỗi 1 của bài: "quên await là gửi cho client một object Promise". getNoteTitle(repo, id) trả tiêu đề ghi chú hoặc null nếu không có. repo.findById(id) là ASYNC — trả Promise. Code khởi đầu quên await: note là Promise đang chờ (truthy) nên trả note.title → undefined với mọi id.</p>`,
    yc: [
      ['Return the note\'s title, or <code>null</code> when <code>findById</code> resolves to <code>null</code>.', 'Trả tiêu đề, hoặc null khi findById cho null.'],
      ['Call <code>repo.findById</code> exactly once per call.', 'Gọi repo.findById đúng một lần mỗi lần gọi.'],
    ],
    goiY: [
      ['The function is already <code>async</code>, so you may write <code>await</code> inside it.', 'Hàm đã là async nên viết được await bên trong.'],
      ['<code>const note = await repo.findById(id);</code> — now <code>note</code> is the object (or null), not a Promise.', 'const note = await repo.findById(id); — giờ note là object (hoặc null), không phải Promise.'],
    ],
    loi: [
      ['Leaving out <code>await</code>: a Promise is always truthy, so a "not found" check on it never fires.', 'Bỏ await: Promise luôn truthy nên phép kiểm "không tìm thấy" trên nó không bao giờ chạy.'],
      ['Returning <code>note</code> instead of <code>note.title</code>, or returning <code>undefined</code> instead of <code>null</code> for a missing note.', 'Trả note thay vì note.title, hoặc trả undefined thay vì null khi không có.'],
    ],
    gt: ['<code>findById</code> hands back a Promise immediately, before the data exists. <code>await</code> suspends the async function until that Promise settles and gives you the resolved value; without it you work with the Promise object itself. That is also why a handler that forgets <code>await</code> ends up sending <code>{}</code> — a Promise serialises to an empty object.',
      'findById trả về Promise ngay, khi dữ liệu chưa có. await treo hàm async tới khi Promise xong và trao giá trị; thiếu nó bạn làm việc với chính object Promise. Đó cũng là lý do handler quên await gửi {} — Promise chuyển JSON thành object rỗng.'],
    kn: ['async/await', 'Promise'],
    tns: TN,
    viDu: [{ input: "await getNoteTitle(repo, 1)  // repo has { id: 1, title: 'Buy milk' }", output: '"Buy milk"', explanation: 'The starter returns undefined.|||Code khởi đầu trả undefined.' }],
    chung: `${KHO_GIA}\nconst repo = mkRepo([{ id: 1, title: 'Buy milk' }, { id: 2, title: 'Call Binh' }]);`,
    dau: `async function getNoteTitle(repo, id) {
  const note = repo.findById(id);
  return note ? note.title : null;
}
`,
    giai: `// repo.findById returns a Promise. Without await, "note" would be that
// Promise (always truthy) and note.title would be undefined.
async function getNoteTitle(repo, id) {
  const note = await repo.findById(id); // wait for the real row (or null)
  return note ? note.title : null;
}
`,
    cases: [
      { moTa: ['existing note ⇒ its title', 'ghi chú có ⇒ tiêu đề'], goi: 'await getNoteTitle(repo, 1)' },
      { moTa: ['missing note ⇒ null', 'không có ⇒ null'], goi: 'await getNoteTitle(repo, 404)' },
      { an: true, goi: '[await getNoteTitle(repo, 2), repo.log]' },
      { an: true, chuanBi: "const r2 = mkRepo([{ id: 'n9', title: '' }]);", goi: "[await getNoteTitle(r2, 'n9'), await getNoteTitle(r2, 'x')]" },
    ],
  }),

  jsBai({
    ten: 'From callbacks to Promises: write promisify',
    kho: 'MEDIUM', phut: 12,
    en: `<p>Older Node APIs use the error-first callback: <code>fn(arg1, arg2, (err, result) =&gt; …)</code>. Write <code>promisify(fn)</code> that turns such a function into one that returns a Promise, so you can <code>await</code> it:</p>${pre("// readNote(id, cb) calls cb(null, note) or cb(new Error('ENOENT: no note 9'))\nconst readNoteAsync = promisify(readNote);\nawait readNoteAsync(1);   // { id: 1, title: 'Buy milk' }\nawait readNoteAsync(9);   // rejects with Error 'ENOENT: no note 9'")}<p>(This is what <code>util.promisify</code> does in real Node — here you build it yourself.)</p>`,
    vi: `<p>API Node cũ dùng callback lỗi-đứng-đầu: fn(a, b, (err, result) => …). Viết promisify(fn) biến hàm đó thành hàm trả Promise để await được: lỗi ⇒ reject đúng lỗi đó, thành công ⇒ resolve kết quả. (util.promisify làm đúng việc này.)</p>`,
    yc: [
      ['<code>promisify(fn)</code> returns a function that accepts the same arguments (minus the callback) and returns a Promise.', 'promisify(fn) trả hàm nhận cùng đối số (trừ callback) và trả Promise.'],
      ['If the callback gets an error, the Promise <b>rejects with that error</b>; otherwise it resolves with the result.', 'Callback nhận lỗi ⇒ Promise REJECT đúng lỗi đó; ngược lại resolve kết quả.'],
      ['Pass every argument through, in order.', 'Chuyển mọi đối số, đúng thứ tự.'],
    ],
    goiY: [
      ['<code>return (...args) =&gt; new Promise((resolve, reject) =&gt; { … })</code>', 'return (...args) => new Promise((resolve, reject) => { … })'],
      ['Inside: <code>fn(...args, (err, result) =&gt; { if (err) return reject(err); resolve(result); });</code>', 'Bên trong: fn(...args, (err, result) => { if (err) return reject(err); resolve(result); });'],
    ],
    loi: [
      ['Resolving with what <code>fn</code> RETURNS — a callback API returns <code>undefined</code>; the result only arrives in the callback (the starter\'s bug).', 'Resolve bằng giá trị fn TRẢ VỀ — API callback trả undefined; kết quả chỉ đến trong callback (bug của code khởi đầu).'],
      ['Checking <code>if (result)</code> instead of <code>if (err)</code> — a legitimate result of <code>0</code> or <code>\'\'</code> becomes a failure.', 'Kiểm if (result) thay vì if (err) — kết quả hợp lệ 0 hoặc \'\' thành thất bại.'],
      ['Forgetting <code>return</code> after <code>reject(err)</code> and calling <code>resolve</code> too (harmless here, but a sign the error path was not thought through).', 'Quên return sau reject(err) rồi gọi cả resolve.'],
    ],
    gt: ['A callback API delivers its result later, inside the callback — never as a return value. Wrapping the call in <code>new Promise</code> lets you hand that callback a small adapter: the error branch calls <code>reject</code>, the success branch calls <code>resolve</code>. Generations 1 and 2 of the lesson\'s table become generation 3: now the function works with <code>await</code> and <code>try/catch</code>.',
      'API callback trả kết quả SAU, bên trong callback — không bao giờ bằng giá trị trả về. Bọc lời gọi trong new Promise cho phép đưa callback một bộ chuyển nhỏ: nhánh lỗi gọi reject, nhánh thành công gọi resolve. Thế hệ 1 và 2 trong bảng của bài thành thế hệ 3: hàm giờ dùng được với await và try/catch.'],
    kn: ['error-first callbacks', 'Promise constructor', 'util.promisify'],
    tns: TN,
    viDu: [{ input: 'await promisify(readNote)(1)', output: '{"id":1,"title":"Buy milk"}', explanation: 'readNote calls cb(null, note) after 20 ms.|||readNote gọi cb(null, note) sau 20 ms.' }],
    chung: `const NOTES = { 1: { id: 1, title: 'Buy milk' }, 2: { id: 2, title: 'Call Binh' } };
function readNote(id, cb) { setTimeout(() => (NOTES[id] ? cb(null, NOTES[id]) : cb(new Error('ENOENT: no note ' + id))), 20); }
function add(a, b, cb) { setTimeout(() => cb(null, a + b), 5); }
function countWords(text, cb) { setTimeout(() => cb(null, text.trim() ? text.trim().split(/\\s+/).length : 0), 5); }`,
    dau: `function promisify(fn) {
  return (...args) => new Promise((resolve) => {
    resolve(fn(...args));
  });
}
`,
    giai: `// Turn fn(...args, (err, result) => ...) into (...args) => Promise.
function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    // the result only exists inside the callback, so resolve/reject from there
    fn(...args, (err, result) => {
      if (err) return reject(err); // error-first: check err, not result
      resolve(result);
    });
  });
}
`,
    cases: [
      { moTa: ['success ⇒ resolves with the result', 'thành công ⇒ resolve kết quả'], goi: 'await promisify(readNote)(1)' },
      { moTa: ['error ⇒ rejects with that error', 'lỗi ⇒ reject đúng lỗi đó'], goi: 'await promisify(readNote)(9)', nem: 'Error', thongDiep: 'ENOENT: no note 9' },
      { moTa: ['passes every argument', 'chuyển mọi đối số'], goi: 'await promisify(add)(2, 3)' },
      { an: true, goi: "[await promisify(countWords)('   '), await promisify(countWords)('read the error')]" },
      { an: true, chuanBi: "let msg = ''; try { await promisify(readNote)(42); } catch (e) { msg = e.message; }", goi: '[msg, await promisify(readNote)(2)]' },
    ],
  }),

  jsBai({
    ten: 'Mistake 2: load the dashboard in parallel (900 ms → 300 ms)',
    kho: 'MEDIUM', phut: 12,
    en: `<p>"A dashboard endpoint that loads user + notes + tags sequentially is three round-trips deep for no reason." Each of <code>api.getUser(id)</code>, <code>api.getNotes(id)</code>, <code>api.getTags(id)</code> takes 300 ms and none needs another's result. Write <code>loadDashboard(api, userId)</code> that returns <code>{ user, notes, tags }</code> and finishes in about 300 ms, not 900.</p>${pre("const t = Date.now();\nconst d = await loadDashboard(api, 1);\nDate.now() - t;   // starter: 900   ·   goal: 300")}<p>The grader's clock is virtual: <code>Date.now()</code> moves exactly by the fake 300 ms waits, so the time check is exact.</p>`,
    vi: `<p>"Endpoint dashboard tải user + notes + tags tuần tự là ba vòng khứ hồi vô cớ." Mỗi lời gọi api mất 300 ms và không cái nào cần kết quả của cái khác. Viết loadDashboard(api, userId) trả { user, notes, tags } và xong trong khoảng 300 ms, không phải 900. Đồng hồ máy chấm là ảo nên phép đo thời gian chính xác.</p>`,
    yc: [
      ['Return <code>{ user, notes, tags }</code> for the given user.', 'Trả { user, notes, tags } cho user đó.'],
      ['Start all three calls before waiting for any of them — total ≈ the slowest call.', 'Bắt đầu cả ba lời gọi trước khi chờ cái nào — tổng ≈ lời gọi chậm nhất.'],
      ['If one call fails, <code>loadDashboard</code> rejects with that error (the dashboard needs all three).', 'Một lời gọi lỗi ⇒ loadDashboard reject với lỗi đó (dashboard cần đủ ba).'],
    ],
    goiY: [
      ['<code>Promise.all([a(), b(), c()])</code> starts nothing by itself — calling <code>a()</code> starts the work. Put the three calls inside the array.', 'Promise.all tự nó không bắt đầu gì — gọi a() mới bắt đầu. Đặt ba lời gọi trong mảng.'],
      ['Destructure the result: <code>const [user, notes, tags] = await Promise.all([…]);</code>', 'Phân rã kết quả: const [user, notes, tags] = await Promise.all([…]);'],
    ],
    loi: [
      ['<code>await</code> on each line (the starter): every call waits for the previous one — 900 ms.', 'await từng dòng (code khởi đầu): mỗi lời gọi chờ cái trước — 900 ms.'],
      ['<code>Promise.all([api.getUser, api.getNotes, api.getTags])</code> — passing the functions instead of calling them; you get the functions back.', 'Promise.all([api.getUser, …]) — truyền hàm thay vì gọi; nhận lại chính các hàm.'],
      ['Using <code>allSettled</code> here: a failed call would silently give a half-empty dashboard instead of an error.', 'Dùng allSettled ở đây: một lời gọi lỗi cho dashboard thiếu một nửa thay vì báo lỗi.'],
    ],
    gt: ['A Promise represents work that has <i>already started</i>. Calling the three functions first puts all three waits in flight at once; <code>Promise.all</code> then waits for the slowest, so the total is max(300, 300, 300) = 300 ms. It also has the right failure rule for this endpoint: one rejection rejects the whole thing. The lesson\'s counter-warning still applies — this is for a handful of calls, not 5 000 queries.',
      'Một Promise đại diện cho việc ĐÃ BẮT ĐẦU. Gọi ba hàm trước đưa cả ba lượt chờ chạy cùng lúc; Promise.all chờ cái chậm nhất ⇒ tổng = max(300, 300, 300) = 300 ms. Nó cũng có luật lỗi đúng cho endpoint này: một reject là reject cả. Cảnh báo ngược của bài vẫn đúng — dùng cho vài lời gọi, không phải 5 000 truy vấn.'],
    kn: ['Promise.all', 'parallel vs sequential'],
    tns: TN,
    viDu: [{ input: 'await loadDashboard(api, 1)', output: '{"user":{"id":1,"name":"An"},"notes":[{"id":10,"ownerId":1}],"tags":["work"]} — in 300 ms', explanation: 'The starter takes 900 ms.|||Code khởi đầu mất 900 ms.' }],
    chung: `const mkApi = (fail) => {
  const later = (v, ms, name) => new Promise((ok, ko) => setTimeout(() => (fail === name ? ko(new Error(name + ' failed: DB connection lost')) : ok(v)), ms));
  return {
    getUser: (id) => later({ id, name: id === 1 ? 'An' : 'Binh' }, 300, 'getUser'),
    getNotes: (id) => later([{ id: id * 10, ownerId: id }], 300, 'getNotes'),
    getTags: (id) => later(id === 1 ? ['work'] : ['home', 'todo'], 300, 'getTags'),
  };
};`,
    dau: `async function loadDashboard(api, userId) {
  const user = await api.getUser(userId);
  const notes = await api.getNotes(userId);
  const tags = await api.getTags(userId);
  return { user, notes, tags };
}
`,
    giai: `// The three calls are independent: START all of them, then wait once.
// Total time = the slowest call (300 ms), not the sum (900 ms).
async function loadDashboard(api, userId) {
  const [user, notes, tags] = await Promise.all([
    api.getUser(userId),   // calling the function is what starts the work
    api.getNotes(userId),
    api.getTags(userId),
  ]);
  // Promise.all rejects as soon as one fails: right here, the page needs all three
  return { user, notes, tags };
}
`,
    cases: [
      { moTa: ['returns user, notes and tags', 'trả user, notes và tags'], goi: 'await loadDashboard(mkApi(), 1)' },
      { moTa: ['finishes in 300 ms (virtual clock)', 'xong trong 300 ms (đồng hồ ảo)'], chuanBi: 'const t = Date.now(); await loadDashboard(mkApi(), 1);', goi: 'Date.now() - t' },
      { moTa: ['one failed call ⇒ rejects with that error', 'một lời gọi lỗi ⇒ reject lỗi đó'], goi: "await loadDashboard(mkApi('getNotes'), 1)", nem: 'Error', thongDiep: 'getNotes failed' },
      { an: true, chuanBi: 'const t = Date.now(); const d = await loadDashboard(mkApi(), 2);', goi: '[d, Date.now() - t]' },
      { an: true, chuanBi: "const t = Date.now(); let m = ''; try { await loadDashboard(mkApi('getTags'), 1); } catch (e) { m = e.message; }", goi: '[m, Date.now() - t]' },
    ],
  }),

  jsBai({
    ten: 'Mistake 3: notify everyone, some may fail (allSettled)',
    kho: 'MEDIUM', phut: 12,
    en: `<p>"Promise.allSettled — use for 'send 10 notifications, some may fail'." Write <code>notifyAll(userIds, send)</code>: <code>send(id)</code> returns a Promise that resolves when the notification is delivered or rejects with an Error. Send to everyone in parallel and report:</p>${pre("await notifyAll([1, 2, 3], send);\n// { sent: [1, 3], failed: [{ id: 2, reason: 'mailbox full' }] }")}<ul><li><code>sent</code> and <code>failed</code> keep the order of <code>userIds</code>; <code>reason</code> is the error's <code>message</code>.</li><li><code>notifyAll</code> itself never rejects because of a failed send.</li></ul>`,
    vi: `<p>"allSettled — dùng cho 'gửi 10 thông báo, vài cái có thể lỗi'." Viết notifyAll(userIds, send): gửi song song cho mọi người và báo cáo { sent, failed: [{ id, reason }] }, giữ thứ tự userIds, reason = message của lỗi. notifyAll không bao giờ reject vì một lần gửi lỗi.</p>`,
    yc: [
      ['Send to all users in parallel.', 'Gửi cho mọi user song song.'],
      ['Return <code>{ sent: [ids], failed: [{ id, reason }] }</code> in the input order.', 'Trả { sent: [ids], failed: [{ id, reason }] } theo thứ tự đầu vào.'],
      ['Never reject because one send failed.', 'Không reject chỉ vì một lần gửi lỗi.'],
    ],
    goiY: [
      ['<code>const results = await Promise.allSettled(userIds.map((id) =&gt; send(id)));</code>', 'const results = await Promise.allSettled(userIds.map((id) => send(id)));'],
      ['<code>results[i]</code> belongs to <code>userIds[i]</code>. Each is <code>{ status: \'fulfilled\', value }</code> or <code>{ status: \'rejected\', reason }</code> — here <code>reason</code> is the Error, so take <code>.message</code>.', 'results[i] ứng với userIds[i]. Mỗi cái là { status: \'fulfilled\', value } hoặc { status: \'rejected\', reason } — reason là Error, lấy .message.'],
    ],
    loi: [
      ['<code>Promise.all</code> (the starter): the first failure rejects the whole call and you lose the list of who did get the message.', 'Promise.all (code khởi đầu): lỗi đầu tiên reject cả lời gọi và bạn mất danh sách người đã nhận.'],
      ['Putting the whole Error object in <code>reason</code> — the report should be plain data (the message).', 'Đặt cả object Error vào reason — báo cáo nên là dữ liệu thuần (message).'],
      ['Awaiting <code>send</code> in a <code>for</code> loop — correct report, but sequential: 10 users × 200 ms = 2 s.', 'await send trong vòng for — báo cáo đúng nhưng tuần tự: 10 user × 200 ms = 2 s.'],
    ],
    gt: ['<code>allSettled</code> waits for every Promise and never rejects; it returns one record per input, in input order, whatever finished first. That makes it the right tool when partial success is a valid outcome. Mapping each record back to <code>userIds[i]</code> turns the raw statuses into a report the caller can log or retry.',
      'allSettled chờ mọi Promise và không bao giờ reject; nó trả một bản ghi cho mỗi đầu vào, theo thứ tự đầu vào, bất kể cái nào xong trước. Vì vậy nó đúng công cụ khi thành công một phần là kết quả hợp lệ. Ghép từng bản ghi về userIds[i] biến trạng thái thô thành báo cáo để log hoặc thử lại.'],
    kn: ['Promise.allSettled', 'partial failure'],
    tns: TN,
    viDu: [{ input: 'await notifyAll([1, 2, 3], send)  // send(2) rejects "mailbox full"', output: '{"sent":[1,3],"failed":[{"id":2,"reason":"mailbox full"}]}', explanation: 'The starter rejects instead.|||Code khởi đầu reject.' }],
    chung: `const mkSend = (bad, ms = 200) => { const log = []; const send = (id) => new Promise((ok, ko) => { log.push(id); setTimeout(() => (bad[id] ? ko(new Error(bad[id])) : ok('delivered ' + id)), ms - (id % 3) * 10); }); send.log = log; return send; };`,
    dau: `async function notifyAll(userIds, send) {
  await Promise.all(userIds.map((id) => send(id)));
  return { sent: userIds, failed: [] };
}
`,
    giai: `// Some sends may fail and that is OK: allSettled never rejects and gives
// one { status, value | reason } per input, in INPUT order.
async function notifyAll(userIds, send) {
  const results = await Promise.allSettled(userIds.map((id) => send(id))); // all in parallel
  const report = { sent: [], failed: [] };
  results.forEach((r, i) => {
    const id = userIds[i];
    if (r.status === 'fulfilled') report.sent.push(id);
    else report.failed.push({ id, reason: r.reason.message }); // plain data, not the Error
  });
  return report;
}
`,
    cases: [
      { moTa: ['one failure is reported, the rest are sent', 'một lỗi được báo, phần còn lại đã gửi'], goi: "await notifyAll([1, 2, 3], mkSend({ 2: 'mailbox full' }))" },
      { moTa: ['all sent in parallel (≈200 ms, not 600)', 'gửi song song (≈200 ms, không phải 600)'], chuanBi: 'const t = Date.now(); await notifyAll([3, 6, 9], mkSend({}));', goi: 'Date.now() - t' },
      { an: true, goi: "await notifyAll([5, 4, 3, 2, 1], mkSend({ 4: 'unsubscribed', 1: 'bounced' }))" },
      { an: true, goi: "await notifyAll([7, 8], mkSend({ 7: 'x', 8: 'y' }))" },
      { an: true, goi: 'await notifyAll([], mkSend({}))' },
    ],
  }),

  jsBai({
    ten: 'The forEach(async …) trap: save notes in order, and really wait',
    kho: 'HARD', phut: 16,
    en: `<p>"async in array callbacks is a trap — <code>arr.forEach(async …)</code> does NOT wait." Write <code>saveNotesInOrder(notes, repo)</code>:</p>
<ul><li>Save the notes <b>one after another, in array order</b>: a save must not start before the previous one finished (each note\'s version depends on the one before, so parallel is not allowed here).</li>
<li>The returned Promise resolves only <b>after the last save finished</b>, with the number of notes saved.</li>
<li>If a save rejects, stop (do not save the rest) and reject with that error.</li></ul>${pre("// repo.save(note) takes note.ms milliseconds and records 'start id' / 'end id'\nawait saveNotesInOrder([{ id: 'a', ms: 300 }, { id: 'b', ms: 100 }], repo);   // 2\nrepo.log;   // ['start a', 'end a', 'start b', 'end b']")}<p>The starter uses <code>forEach(async …)</code>: it returns 2 immediately, while the saves are still running, and they overlap.</p>`,
    vi: `<p>"async trong callback của mảng là cái bẫy — arr.forEach(async …) KHÔNG chờ." Viết saveNotesInOrder(notes, repo): lưu LẦN LƯỢT theo thứ tự mảng (lần lưu sau chỉ bắt đầu khi lần trước xong); Promise trả về chỉ resolve SAU khi lần lưu cuối xong, với số ghi chú đã lưu; một lần lưu lỗi ⇒ dừng và reject lỗi đó. Code khởi đầu dùng forEach(async …): trả 2 ngay khi các lần lưu còn đang chạy, chồng lên nhau.</p>`,
    yc: [
      ['Sequential, in order: <code>start a, end a, start b, end b, …</code>', 'Tuần tự, đúng thứ tự: start a, end a, start b, end b, …'],
      ['Resolve with the count only after the last save finished.', 'Chỉ resolve số lượng sau khi lần lưu cuối xong.'],
      ['On a failed save: stop and reject with that error.', 'Một lần lưu lỗi: dừng và reject lỗi đó.'],
    ],
    goiY: [
      ['The lesson\'s fix: <code>for…of</code> with <code>await</code> inside an async function.', 'Cách sửa của bài: for…of với await trong hàm async.'],
      ['<code>for (const note of notes) { await repo.save(note); }</code> — an error thrown by <code>await</code> leaves the loop and rejects the async function for you.', 'for (const note of notes) { await repo.save(note); } — lỗi do await ném ra thoát vòng lặp và tự reject hàm async.'],
    ],
    loi: [
      ['<code>notes.forEach(async (n) =&gt; await repo.save(n))</code> — forEach ignores the Promises the callback returns; the function returns before anything is saved.', 'forEach bỏ qua các Promise mà callback trả; hàm trả về trước khi lưu xong cái nào.'],
      ['<code>await Promise.all(notes.map(save))</code> — it waits, but the saves run in parallel (start a, start b…), which this task forbids.', 'await Promise.all(notes.map(save)) — có chờ, nhưng chạy song song (start a, start b…), đề này cấm.'],
      ['Catching the error inside the loop and continuing — the remaining notes are saved on top of a failed one.', 'Bắt lỗi trong vòng lặp rồi tiếp tục — các ghi chú sau được lưu chồng lên một cái đã hỏng.'],
    ],
    gt: ['<code>forEach</code> calls the callback and throws its return value away, so the async callbacks all start at once and nobody waits for them. A <code>for…of</code> loop inside an <code>async</code> function is different: each <code>await</code> suspends the whole function, so the next iteration cannot start until the save settled, and a rejection propagates out of the loop and rejects the function. Use <code>map + Promise.all</code> when order does not matter, <code>for…of + await</code> when it does.',
      'forEach gọi callback rồi vứt giá trị trả về, nên mọi callback async bắt đầu cùng lúc và không ai chờ. Vòng for…of trong hàm async khác hẳn: mỗi await treo cả hàm, vòng sau không thể bắt đầu khi lần lưu chưa xong, và một reject lan ra khỏi vòng lặp và reject cả hàm. Thứ tự không quan trọng ⇒ map + Promise.all; quan trọng ⇒ for…of + await.'],
    kn: ['for…of + await', 'forEach and async', 'sequential work'],
    tns: TN,
    viDu: [{ input: "await saveNotesInOrder([{ id: 'a', ms: 300 }, { id: 'b', ms: 100 }], repo); repo.log", output: '["start a","end a","start b","end b"]', explanation: 'The starter logs start a, start b, end b, end a.|||Code khởi đầu ghi start a, start b, end b, end a.' }],
    chung: `const mkSaveRepo = (failId) => { const log = []; return { log, save: (n) => { log.push('start ' + n.id); return new Promise((ok, ko) => setTimeout(() => { if (n.id === failId) { log.push('fail ' + n.id); ko(new Error('version conflict on ' + n.id)); } else { log.push('end ' + n.id); ok(n); } }, n.ms)); } }; };`,
    dau: `async function saveNotesInOrder(notes, repo) {
  notes.forEach(async (note) => {
    await repo.save(note);
  });
  return notes.length;
}
`,
    giai: `// forEach does not wait for async callbacks. A for...of loop inside an async
// function does: each await suspends the whole function until that save settles.
async function saveNotesInOrder(notes, repo) {
  let saved = 0;
  for (const note of notes) {
    await repo.save(note); // next save starts only after this one finished
    saved += 1;            // a rejection above skips this and rejects the function
  }
  return saved;            // resolved only after the LAST save completed
}
`,
    cases: [
      { moTa: ['saves run one after another, in order', 'lưu lần lượt, đúng thứ tự'], chuanBi: "const repo = mkSaveRepo(); await saveNotesInOrder([{ id: 'a', ms: 300 }, { id: 'b', ms: 100 }], repo);", goi: 'repo.log' },
      { moTa: ['resolves only after the last save (count + log at that moment)', 'chỉ resolve sau lần lưu cuối'], chuanBi: "const repo = mkSaveRepo(); const n = await saveNotesInOrder([{ id: 'x', ms: 50 }, { id: 'y', ms: 50 }, { id: 'z', ms: 50 }], repo); const seen = repo.log.length;", goi: '[n, seen]' },
      { moTa: ['a failed save stops the rest and rejects', 'một lần lưu lỗi dừng phần còn lại và reject'], chuanBi: "const repo = mkSaveRepo('b'); let m = ''; try { await saveNotesInOrder([{ id: 'a', ms: 10 }, { id: 'b', ms: 10 }, { id: 'c', ms: 10 }], repo); } catch (e) { m = e.message; } await new Promise((r) => setTimeout(r, 100));", goi: '[m, repo.log]' },
      { an: true, chuanBi: "const repo = mkSaveRepo(); const t = Date.now(); const n = await saveNotesInOrder([{ id: 1, ms: 30 }, { id: 2, ms: 20 }, { id: 3, ms: 10 }, { id: 4, ms: 40 }], repo);", goi: '[n, Date.now() - t, repo.log]' },
      { an: true, chuanBi: 'const repo = mkSaveRepo();', goi: '[await saveNotesInOrder([], repo), repo.log]' },
    ],
  }),

  jsBai({
    ten: 'Mistake 4: asyncHandler — give every async error an owner',
    kho: 'HARD', phut: 16,
    en: `<p>"Express 4 does not catch errors thrown inside async handlers — you must wrap them." Write the classic wrapper <code>asyncHandler(fn)</code>. It returns a middleware <code>(req, res, next)</code> that runs <code>fn(req, res, next)</code> and, if anything goes wrong, calls <code>next(err)</code> so the error handler answers 500 instead of the process crashing:</p>
<ul><li><code>fn</code> returns a rejected Promise ⇒ <code>next(err)</code>.</li>
<li><code>fn</code> throws <b>synchronously</b> (a plain function, not async) ⇒ also <code>next(err)</code>.</li>
<li><code>fn</code> succeeds ⇒ <code>next</code> is <b>not</b> called by the wrapper.</li>
<li>The middleware returns a Promise that settles after <code>fn</code> is done, and that Promise never rejects.</li></ul>${pre("app.get('/notes/:id', asyncHandler(async (req, res) => {\n  const note = await repo.findById(req.params.id);   // may reject: 'DB connection lost'\n  res.json(note);\n}));")}`,
    vi: `<p>"Express 4 không bắt lỗi ném trong handler async — phải tự bọc." Viết asyncHandler(fn): trả middleware (req, res, next) chạy fn; fn reject ⇒ next(err); fn ném ĐỒNG BỘ ⇒ cũng next(err); fn thành công ⇒ wrapper không gọi next. Middleware trả một Promise xong sau khi fn xong và Promise đó không bao giờ reject.</p>`,
    yc: [
      ['Rejections and synchronous throws both end in <code>next(err)</code>.', 'Reject và ném đồng bộ đều thành next(err).'],
      ['Success: the wrapper does not call <code>next</code>.', 'Thành công: wrapper không gọi next.'],
      ['Return a Promise that never rejects.', 'Trả một Promise không bao giờ reject.'],
    ],
    goiY: [
      ['<code>Promise.resolve(fn(req, res, next)).catch(next)</code> handles rejections — but a synchronous throw happens before <code>Promise.resolve</code> even runs.', 'Promise.resolve(fn(...)).catch(next) xử lý reject — nhưng ném đồng bộ xảy ra trước khi Promise.resolve kịp chạy.'],
      ['Make the call itself happen inside a Promise chain: <code>Promise.resolve().then(() =&gt; fn(req, res, next)).catch(next)</code>, or use <code>async</code> + <code>try/catch</code>.', 'Cho chính lời gọi nằm trong chuỗi Promise: Promise.resolve().then(() => fn(...)).catch(next), hoặc async + try/catch.'],
    ],
    loi: [
      ['Returning <code>fn(req, res, next)</code> as-is (the starter): the rejection has no owner — in Node 22 an unhandled rejection exits the process.', 'Trả nguyên fn(...) (code khởi đầu): reject không có chủ — ở Node 22 unhandled rejection làm thoát process.'],
      ['Wrapping with <code>try { fn(…) } catch</code> WITHOUT <code>await</code> — try/catch only sees synchronous throws; the rejection escapes it (the lesson\'s Mistake 4).', 'Bọc try { fn(…) } catch mà KHÔNG await — try/catch chỉ thấy ném đồng bộ; reject thoát ra (Lỗi 4 của bài).'],
      ['Calling <code>next()</code> after a successful handler — the request then falls through to the 404 handler after the response was sent.', 'Gọi next() sau handler thành công — request rơi tiếp xuống handler 404 sau khi đã gửi phản hồi.'],
    ],
    gt: ['An error needs an owner: either a <code>try/catch</code> that awaits, or a <code>.catch()</code>. Starting from <code>Promise.resolve().then(() =&gt; fn(…))</code> turns BOTH failure kinds into a rejection of one chain — a synchronous throw inside <code>.then</code> becomes a rejection too — and the single <code>.catch(next)</code> forwards it to Express\'s error pipeline. Because the returned chain ends in <code>.catch</code>, it never rejects, so the wrapper can never create an unhandled rejection itself. Express 5 does this for you; this wrapper is what you will see in every Express 4 codebase.',
      'Một lỗi cần có chủ: try/catch có await, hoặc .catch(). Bắt đầu từ Promise.resolve().then(() => fn(…)) biến CẢ HAI kiểu lỗi thành reject của một chuỗi — ném đồng bộ trong .then cũng thành reject — và một .catch(next) chuyển nó vào đường xử lý lỗi của Express. Chuỗi trả về kết thúc bằng .catch nên không bao giờ reject. Express 5 tự làm việc này; wrapper này có mặt trong mọi codebase Express 4.'],
    kn: ['error propagation', 'unhandled rejection', 'Express error handling'],
    tns: TN,
    viDu: [{ input: "await asyncHandler(async () => { throw new Error('DB connection lost'); })(req, res, next); next.calls", output: '["next(DB connection lost)"]', explanation: 'The error reaches next instead of escaping.|||Lỗi tới next thay vì thoát ra ngoài.' }],
    chung: `${RES_GIA}\n${SLEEP}`,
    dau: `function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next);
}
`,
    giai: `// Express 4 does not catch async errors: give every error an owner.
function asyncHandler(fn) {
  return (req, res, next) =>
    Promise.resolve()
      // calling fn INSIDE .then: a synchronous throw also becomes a rejection
      .then(() => fn(req, res, next))
      // one owner for both kinds of failure: Express's error pipeline
      .catch(next);
  // the chain ends in .catch, so the returned Promise never rejects
}
`,
    cases: [
      { moTa: ['async rejection ⇒ next(err)', 'reject async ⇒ next(err)'], chuanBi: "const next = mkNext(); await asyncHandler(async () => { await sleep(10); throw new Error('DB connection lost'); })({}, mkRes(), next);", goi: 'next.calls' },
      { moTa: ['success ⇒ response sent, next not called', 'thành công ⇒ đã trả lời, không next'], chuanBi: "const res = mkRes(); const next = mkNext(); await asyncHandler(async (req, r) => { await sleep(10); r.status(200).json({ id: req.params.id }); })({ params: { id: '7' } }, res, next);", goi: '[res.body, next.calls]' },
      { moTa: ['synchronous throw ⇒ next(err), no crash', 'ném đồng bộ ⇒ next(err), không sập'], chuanBi: "const next = mkNext(); let escaped = null; try { await asyncHandler((req) => { throw new Error('bad id ' + req.params.id); })({ params: { id: 'x' } }, mkRes(), next); } catch (e) { escaped = e.message; }", goi: '[next.calls, escaped]' },
      { an: true, chuanBi: "const next = mkNext(); const p = asyncHandler(() => Promise.reject(new Error('timeout')))({}, mkRes(), next); const isP = p instanceof Promise; let rejected = false; await p.catch(() => { rejected = true; });", goi: '[isP, rejected, next.calls]' },
      { an: true, chuanBi: "const next = mkNext(); const res = mkRes(); await asyncHandler(async (req, r, n) => { if (!req.user) return n(); r.json('ok'); })({}, res, next);", goi: '[next.calls, res.sent]' },
    ],
  }),
]);
