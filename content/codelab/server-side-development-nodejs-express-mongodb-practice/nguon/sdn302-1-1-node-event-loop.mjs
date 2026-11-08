/** SDN302 · 1.1 — Node.js, event loop & module: blocking vs non-blocking, thứ tự microtask/timer (đã chạy Node 22.23.3), callback → Promise, song song bằng Promise.all, CommonJS vs ESM. */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn, maNguon } from './_sdn.mjs';

const J = String.raw;

/* ── 1 ── */
const E1 = cs({
  ten: 'One thread, non-blocking I/O, and two module systems', kho: 'EASY', phut: 10,
  en: 'Questions on the ideas of the lesson. The snippets were run with Node 22.23.3 on 08/11/2026.',
  vi: 'Câu hỏi về các ý của bài. Các đoạn mã đã chạy bằng Node 22.23.3 ngày 08/11/2026.',
  cau: [
    q('n1', ['How can one Node.js thread serve thousands of connections at the same time?', 'Vì sao một luồng Node.js phục vụ được hàng nghìn kết nối cùng lúc?'],
      ['While waiting for I/O it registers a callback and moves on; the event loop runs callbacks when results are ready', 'It starts one operating-system thread per connection behind the scenes', 'It answers requests one after another so quickly that they never overlap', 'JavaScript on the server runs on every CPU core automatically'],
      ['Waiting (disk, network, database) is handed to the system; the thread is free for other requests in the meantime. Only your JavaScript runs on the single thread.', 'Việc chờ (đĩa, mạng, CSDL) được giao cho hệ thống; trong lúc đó luồng rảnh để lo request khác. Chỉ JavaScript của bạn chạy trên luồng duy nhất.']),
    q('n2', ['<code>const data = fs.readFileSync(\'big.txt\')</code> inside a request handler. What is the real problem?', '<code>const data = fs.readFileSync(\'big.txt\')</code> trong một request handler. Vấn đề thật là gì?'],
      ['The only thread is frozen during the read, so every other request waits too', 'readFileSync returns a Promise that must be awaited', 'It reads the file twice, once for each CPU core', 'It cannot read files larger than 64 KB'],
      ['Sync calls are fine at startup (reading a config once) but block everyone when used per request.', 'Gọi đồng bộ thì ổn lúc khởi động (đọc cấu hình một lần) nhưng chặn tất cả khi dùng cho mỗi request.']),
    q('n3', ['A script starts a <code>setTimeout(…, 0)</code>, then runs a 50 ms <code>while</code> loop. When does the timer callback run? (measured)', 'Một script đặt <code>setTimeout(…, 0)</code>, rồi chạy vòng <code>while</code> 50 ms. Khi nào callback hẹn giờ chạy? (đã đo)'],
      ['Only after the loop and the rest of the script finish — at least 50 ms late', 'At 0 ms, interrupting the loop', 'At 1 ms, because the minimum timer delay is 1 ms', 'Never: a busy loop cancels pending timers'],
      ['The event loop can only run callbacks when the call stack is empty. This is why CPU-heavy work must leave the main thread (worker thread, separate service).', 'Event loop chỉ chạy callback khi call stack trống. Vì vậy việc nặng CPU phải rời luồng chính (worker thread, dịch vụ riêng).']),
    q('n4', ['<code>package.json</code> has <code>"type": "module"</code>, and <code>app.js</code> says <code>const express = require(\'express\')</code>. What happens? (measured)', '<code>package.json</code> có <code>"type": "module"</code>, và <code>app.js</code> viết <code>const express = require(\'express\')</code>. Chuyện gì xảy ra? (đã đo)'],
      ['<code>ReferenceError: require is not defined</code> — in an ES module use <code>import express from \'express\'</code>', 'It works: Node converts require to import automatically', 'Express is loaded twice, once per module system', '<code>SyntaxError: Unexpected token \'const\'</code>'],
      ['CommonJS (<code>require</code> / <code>module.exports</code>) and ES Modules (<code>import</code> / <code>export</code>) are chosen per file. With <code>"type": "module"</code>, every .js file is ESM and <code>require</code> does not exist there.', 'CommonJS (<code>require</code> / <code>module.exports</code>) và ES Modules (<code>import</code> / <code>export</code>) được chọn theo từng tệp. Có <code>"type": "module"</code> thì mọi tệp .js là ESM và ở đó không có <code>require</code>.']),
    qn('n5', ['Which of these make the event loop stall for EVERY client? (choose all)', 'Cái nào làm event loop đứng hình với MỌI client? (chọn hết)'],
      ['Resizing a 20 MB image with a pure-JavaScript loop inside a route', '<code>fs.readFileSync</code> of a big file in every request', 'A <code>while</code> loop that hashes 10 million strings', '<code>await Product.find()</code> on a slow database', '<code>fs.readFile(path, callback)</code> on a big file'],
      [0, 1, 2],
      ['Awaiting I/O only pauses THAT request; the thread keeps serving others. Synchronous CPU work and sync I/O pause the thread itself.', 'Await I/O chỉ tạm dừng CHÍNH request đó; luồng vẫn phục vụ request khác. Việc CPU đồng bộ và I/O đồng bộ thì tạm dừng chính luồng.']),
  ],
  goiY: [['Separate "waiting" (I/O) from "working" (CPU).', 'Tách "chờ" (I/O) khỏi "làm" (CPU).'], ['Callbacks only run when the stack is empty.', 'Callback chỉ chạy khi stack trống.']],
  loi: [['Thinking await blocks the whole server.', 'Tưởng await chặn cả server.'], ['Mixing require and import in one ESM file.', 'Trộn require và import trong một tệp ESM.']],
  tns: [tn('event loop', 'vòng lặp sự kiện'), tn('non-blocking I/O', 'I/O không chặn'), tn('CommonJS / ES Modules', 'hai hệ module của Node')],
  kn: ['event loop', 'modules'],
});

/* ── 2 ── order */
const E2 = cs({
  ten: 'Predict the output: sync code, promises and timers', kho: 'MEDIUM', phut: 10, loai: 'order',
  en: 'Each snippet is a CommonJS file run with <code>node file.js</code> (Node 22.23.3). Put the printed lines in order — work it out before running anything.',
  vi: 'Mỗi đoạn là một tệp CommonJS chạy bằng <code>node file.js</code> (Node 22.23.3). Sắp các dòng in ra theo thứ tự — tự suy ra trước khi chạy thử.',
  cau: [
    ord('p1', [`<pre>console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');</pre>The snippet of the lesson (★ note).`, 'Đoạn của bài (mục ★).'],
      ['A', 'D', 'C', 'B'],
      ['Synchronous code first (A, D). Then the microtask queue is drained completely (C) before the event loop moves to timers (B) — that is the ★ note of the lesson.', 'Mã đồng bộ trước (A, D). Rồi hàng microtask được xả hết (C) trước khi event loop sang timer (B) — đúng ghi chú ★ của bài.']),
    ord('p2', [`<pre>async function f() {\n  console.log('1');\n  await null;\n  console.log('2');\n}\nconsole.log('0');\nf();\nconsole.log('3');</pre>await splits the function in two.`, 'await chia hàm làm hai.'],
      ['0', '1', '3', '2'],
      ['An async function runs synchronously until its first <code>await</code>; the rest continues as a microtask after the current script. Calling <code>f()</code> without awaiting it does not wait for "2".', 'Hàm async chạy đồng bộ tới <code>await</code> đầu tiên; phần còn lại tiếp tục như một microtask sau script hiện tại. Gọi <code>f()</code> mà không await thì không chờ "2".']),
    ord('p3', [`<pre>setTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promise'));\nprocess.nextTick(() => console.log('nextTick'));\nconsole.log('sync');</pre>Now with process.nextTick (a CommonJS file).`, 'Thêm process.nextTick (tệp CommonJS).'],
      ['sync', 'nextTick', 'promise', 'timeout'],
      ['In a CommonJS script the nextTick queue runs before the promise microtasks, and both before any timer. (Run the same lines as an .mjs ES module and "promise" prints before "nextTick" — measured; do not build logic on that difference.)', 'Trong script CommonJS, hàng nextTick chạy trước microtask của promise, và cả hai trước mọi timer. (Chạy cùng các dòng đó dưới dạng ES module .mjs thì "promise" in trước "nextTick" — đã đo; đừng xây logic dựa trên khác biệt đó.)']),
  ],
  goiY: [['Three levels: synchronous code → microtasks → timers.', 'Ba tầng: mã đồng bộ → microtask → timer.'], ['await = "the rest of this function is a microtask".', 'await = "phần còn lại của hàm là một microtask".']],
  loi: [['Thinking setTimeout(…, 0) runs immediately.', 'Tưởng setTimeout(…, 0) chạy ngay.'], ['Thinking an un-awaited async call finishes before the next line.', 'Tưởng lời gọi async không await chạy xong trước dòng sau.']],
  tns: [tn('microtask', 'vi tác vụ', 'callback của Promise/await'), tn('macrotask', 'tác vụ', 'timer, I/O…')],
  kn: ['event loop order'],
});

/* ── 3 ── non-blocking read */
const E3 = bai({
  ten: 'From readFileSync to a non-blocking fs.readFile', kho: 'MEDIUM', phut: 12, lib: [],
  en: J`<p>The starter is the "blocking" example of the lesson: it reads <code>big.txt</code> with <code>fs.readFileSync</code>, so <code>doNext</code> waits for the disk. Rewrite <code>main()</code> the Node way:</p>
<ol><li>print <code>start</code>;</li>
<li>start reading <code>big.txt</code> with <code>fs.readFile(path, 'utf8', callback)</code>;</li>
<li>print <code>doNext</code> <b>immediately</b>, without waiting;</li>
<li>in the callback print <code>loaded N chars</code> (N = length of the text), or <code>error: CODE</code> (e.g. <code>error: ENOENT</code>) if reading failed.</li></ol>
<p>The disk here is simulated: <code>big.txt</code> takes 50 ms to read.</p>`,
  vi: J`<p>Code khởi đầu là ví dụ "chặn" của bài: đọc <code>big.txt</code> bằng <code>fs.readFileSync</code>, nên <code>doNext</code> phải chờ đĩa. Viết lại <code>main()</code> theo kiểu Node:</p>
<ol><li>in <code>start</code>;</li>
<li>bắt đầu đọc <code>big.txt</code> bằng <code>fs.readFile(path, 'utf8', callback)</code>;</li>
<li>in <code>doNext</code> <b>ngay</b>, không chờ;</li>
<li>trong callback in <code>loaded N chars</code> (N = độ dài chữ), hoặc <code>error: CODE</code> (vd <code>error: ENOENT</code>) nếu đọc hỏng.</li></ol>
<p>Ổ đĩa ở đây là giả lập: <code>big.txt</code> mất 50 ms để đọc.</p>`,
  yc: [
    ['No <code>readFileSync</code> anywhere.', 'Không có <code>readFileSync</code> ở đâu cả.'],
    ['Node callbacks are <b>error-first</b>: <code>(err, data) => { if (err) … }</code>.', 'Callback của Node là <b>lỗi-trước</b>: <code>(err, data) => { if (err) … }</code>.'],
    ['Pass <code>\'utf8\'</code> so <code>data</code> is a string, not a Buffer.', 'Truyền <code>\'utf8\'</code> để <code>data</code> là chuỗi, không phải Buffer.'],
  ],
  viDu: [['main() with big.txt = "hello world"', 'start\ndoNext\nloaded 11 chars', 'doNext is printed while the disk is still reading.', 'doNext được in trong lúc đĩa vẫn đang đọc.'], ['main() without big.txt', 'start\ndoNext\nerror: ENOENT', 'The error arrives in the callback, not as a throw.', 'Lỗi đến trong callback, không phải bị ném ra.']],
  goiY: [
    ['Move the code that needs the file INTO the callback; everything after the <code>fs.readFile(…)</code> call runs right away.', 'Đưa phần mã cần nội dung tệp VÀO callback; mọi thứ sau lời gọi <code>fs.readFile(…)</code> chạy ngay.'],
    ['<code>fs.readFile(\'big.txt\', \'utf8\', (err, data) => { if (err) return console.log(\'error: \' + err.code); console.log(´loaded @{data.length} chars´); });</code>', '<code>fs.readFile(\'big.txt\', \'utf8\', (err, data) => { if (err) return console.log(\'error: \' + err.code); console.log(´loaded @{data.length} chars´); });</code>'],
  ],
  loi: [
    ['Printing <code>doNext</code> inside the callback — it is non-blocking code that behaves like blocking code.', 'In <code>doNext</code> trong callback — mã không chặn mà hành xử y như mã chặn.'],
    ['Reading <code>data</code> outside the callback: <code>let data; fs.readFile(…, (e, d) => { data = d; }); console.log(data.length)</code> → TypeError, data is still undefined.', 'Đọc <code>data</code> bên ngoài callback: <code>let data; fs.readFile(…, (e, d) => { data = d; }); console.log(data.length)</code> → TypeError, data vẫn undefined.'],
    ['Ignoring <code>err</code>: a missing file then crashes on <code>data.length</code>.', 'Bỏ qua <code>err</code>: tệp không có thì sập ở <code>data.length</code>.'],
  ],
  gt: [
    '<code>fs.readFile</code> hands the read to the system and returns at once, so <code>doNext</code> prints at time 0; 50 ms later the event loop calls the callback with <code>(err, data)</code>. The error-first convention means a failure is a value you check, not an exception you catch — <code>try/catch</code> around <code>fs.readFile</code> would never see it.',
    '<code>fs.readFile</code> giao việc đọc cho hệ thống và trả về ngay, nên <code>doNext</code> in ở thời điểm 0; 50 ms sau event loop gọi callback với <code>(err, data)</code>. Quy ước lỗi-trước nghĩa là lỗi là một giá trị bạn kiểm tra, không phải ngoại lệ bạn bắt — <code>try/catch</code> quanh <code>fs.readFile</code> sẽ không bao giờ thấy nó.',
  ],
  kn: ['non-blocking', 'callbacks'],
  tns: [tn('error-first callback', 'callback lỗi-trước', '(err, data)'), tn('blocking', 'chặn', 'luồng đứng chờ')],
  dau: J`const fs = require('fs');

function main() {
  console.log('start');
  const data = fs.readFileSync('big.txt', 'utf8');   // the thread is frozen here
  console.log(´loaded @{data.length} chars´);
  console.log('doNext');
}
`,
  giai: J`const fs = require('fs');

function main() {
  console.log('start');
  // non-blocking: hand the read to the system and continue immediately
  fs.readFile('big.txt', 'utf8', (err, data) => {   // error-first callback, runs ~50 ms later
    if (err) {
      console.log('error: ' + err.code);              // e.g. ENOENT — a value, not a throw
      return;
    }
    console.log(´loaded @{data.length} chars´);
  });
  console.log('doNext');                              // runs before the file arrives
}
`,
  chuanBi: `__disk.put('big.txt', 'hello world', 50);`,
  cases: [
    { goi: `(main(), await __sleep(100), __log)`, moTa: ['start, doNext, then loaded 11 chars', 'start, doNext, rồi loaded 11 chars'] },
    { chuanBi: `__disk.del('big.txt');`, goi: `(main(), await __sleep(100), __log)`, moTa: ['Missing file → error: ENOENT in the callback', 'Thiếu tệp → error: ENOENT trong callback'] },
    { goi: `(__disk.put('big.txt', 'x'.repeat(2048), 50), main(), await __sleep(100), __log)`, an: true },
    { goi: `(main(), __log.slice())`, an: true, moTa: ['doNext is printed synchronously, before any waiting', 'doNext được in đồng bộ, trước mọi chờ đợi'] },
  ],
  kiemThem: [maNguon(['No readFileSync', 'Không dùng readFileSync'], 'readFileSync', { phuDinh: true })],
});
/* ── 4 ── promise wrapper */
const E4 = bai({
  ten: 'Wrap a callback API in a Promise: readJson(path)', kho: 'MEDIUM', phut: 15, lib: [],
  en: J`<p>Mongoose, fetch and Express all speak Promises, but <code>fs.readFile</code> speaks callbacks. Write <code>readJson(path)</code> that returns a <b>Promise</b>:</p>
<ul><li>resolves with the parsed JSON of the file;</li>
<li>rejects with the original error when the file cannot be read (so <code>err.code === 'ENOENT'</code> still works);</li>
<li>rejects with the <code>SyntaxError</code> when the text is not valid JSON.</li></ul>
<p>Build it with <code>new Promise((resolve, reject) => …)</code> around <code>fs.readFile</code>, or with <code>util.promisify(fs.readFile)</code>. Then <code>await readJson('config.json')</code> works anywhere.</p>`,
  vi: J`<p>Mongoose, fetch và Express đều nói "Promise", còn <code>fs.readFile</code> nói "callback". Viết <code>readJson(path)</code> trả về một <b>Promise</b>:</p>
<ul><li>resolve với JSON đã parse của tệp;</li>
<li>reject với lỗi gốc khi không đọc được tệp (để <code>err.code === 'ENOENT'</code> vẫn dùng được);</li>
<li>reject với <code>SyntaxError</code> khi chữ không phải JSON hợp lệ.</li></ul>
<p>Dựng bằng <code>new Promise((resolve, reject) => …)</code> quanh <code>fs.readFile</code>, hoặc bằng <code>util.promisify(fs.readFile)</code>. Rồi <code>await readJson('config.json')</code> dùng được ở mọi nơi.</p>`,
  yc: [
    ['Do not use <code>readFileSync</code>.', 'Không dùng <code>readFileSync</code>.'],
    ['<code>JSON.parse</code> can throw — make sure that becomes a rejection, not an uncaught exception inside the callback.', '<code>JSON.parse</code> có thể ném lỗi — bảo đảm nó thành reject, không phải ngoại lệ không ai bắt trong callback.'],
  ],
  viDu: [['await readJson(\'config.json\')  // {"port":3000}', '{ port: 3000 }', 'The parsed object.', 'Đối tượng đã parse.'], ['await readJson(\'nope.json\')', 'rejects: Error ENOENT', 'err.code is "ENOENT".', 'err.code là "ENOENT".']],
  goiY: [
    ['<code>return new Promise((resolve, reject) => { fs.readFile(path, \'utf8\', (err, text) => { if (err) return reject(err); … }); });</code>', '<code>return new Promise((resolve, reject) => { fs.readFile(path, \'utf8\', (err, text) => { if (err) return reject(err); … }); });</code>'],
    ['Inside the callback: <code>try { resolve(JSON.parse(text)); } catch (e) { reject(e); }</code>', 'Trong callback: <code>try { resolve(JSON.parse(text)); } catch (e) { reject(e); }</code>'],
    ['Or: <code>const readFile = util.promisify(fs.readFile); async function readJson(p) { return JSON.parse(await readFile(p, \'utf8\')); }</code> — an async function turns a throw into a rejection for you.', 'Hoặc: <code>const readFile = util.promisify(fs.readFile); async function readJson(p) { return JSON.parse(await readFile(p, \'utf8\')); }</code> — hàm async tự biến lỗi ném thành reject.'],
  ],
  loi: [
    ['Calling <code>JSON.parse</code> in the callback without try/catch: the SyntaxError is thrown inside the event loop, nobody can catch it, and a real server crashes.', 'Gọi <code>JSON.parse</code> trong callback không có try/catch: SyntaxError bị ném trong event loop, không ai bắt được, server thật sập.'],
    ['Returning from the callback (<code>return JSON.parse(text)</code>) and expecting readJson to return it — the callback\'s return value goes nowhere.', 'Return trong callback (<code>return JSON.parse(text)</code>) và mong readJson trả về nó — giá trị return của callback chẳng đi đâu cả.'],
  ],
  gt: [
    'A Promise is a box that is filled later: <code>resolve</code> and <code>reject</code> are the two ways to fill it, and the callback of <code>fs.readFile</code> decides which. Catching the parse error and rejecting keeps every failure on one channel, so the caller writes one <code>try { await readJson(p) } catch (e) { … }</code>. This "promisify" step is exactly what Mongoose did for you: its queries return Promises, so you <code>await</code> them.',
    'Promise là một chiếc hộp được lấp sau: <code>resolve</code> và <code>reject</code> là hai cách lấp, và callback của <code>fs.readFile</code> quyết định cách nào. Bắt lỗi parse rồi reject giữ mọi thất bại trên một kênh, nên bên gọi chỉ viết một <code>try { await readJson(p) } catch (e) { … }</code>. Bước "promisify" này chính là thứ Mongoose đã làm sẵn cho bạn: truy vấn của nó trả Promise nên bạn <code>await</code> được.',
  ],
  kn: ['promises', 'promisify'],
  tns: [tn('promisify', 'chuyển callback thành Promise'), tn('reject', 'từ chối', 'đặt Promise vào trạng thái lỗi')],
  dau: J`const fs = require('fs');

function readJson(path) {
  fs.readFile(path, 'utf8', (err, text) => {
    return JSON.parse(text);
  });
}
`,
  giai: J`const fs = require('fs');

// returns a Promise: resolve(parsed JSON) | reject(read error or SyntaxError)
function readJson(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, text) => {      // error-first callback
      if (err) return reject(err);                    // keep the ORIGINAL error (err.code === 'ENOENT')
      try {
        resolve(JSON.parse(text));
      } catch (parseError) {
        reject(parseError);                           // a throw here would escape into the event loop
      }
    });
  });
}
`,
  chuanBi: `__disk.put('config.json', '{"port":3000,"db":"mongodb://localhost/shop"}', 20); __disk.put('broken.json', '{"port": 3000,', 20); __disk.put('list.json', '[1,2,3]', 20);`,
  cases: [
    { goi: `await readJson('config.json')`, moTa: ['config.json → the parsed object', 'config.json → đối tượng đã parse'] },
    { goi: `readJson('config.json') instanceof Promise`, moTa: ['readJson returns a Promise', 'readJson trả về một Promise'] },
    { goi: `await readJson('nope.json').catch((e) => e.code)`, moTa: ['Missing file → rejects with code ENOENT', 'Thiếu tệp → reject với code ENOENT'] },
    { goi: `await readJson('broken.json')`, nem: 'SyntaxError', moTa: ['Broken JSON → rejects with SyntaxError', 'JSON hỏng → reject với SyntaxError'] },
    { goi: `await readJson('list.json')`, an: true },
    { goi: `await readJson('/app/missing/x.json').then(() => 'resolved', (e) => e.name + ':' + e.code)`, an: true },
  ],
  kiemThem: [maNguon(['No readFileSync', 'Không dùng readFileSync'], 'readFileSync', { phuDinh: true })],
});

/* ── 5 ── parallel */
const E5 = bai({
  ten: 'Sequential vs parallel: load three files with Promise.all', kho: 'HARD', phut: 20, lib: [],
  en: J`<p>A dashboard needs three files; each takes <b>100 ms</b> to read. The starter awaits them one by one: 300 ms. Rewrite <code>loadAll(paths)</code> so the reads run <b>at the same time</b> (≈100 ms in total) and it resolves with</p>
<pre>{ files: [text or null, …],   // same order as paths
  missing: ['…'] }             // paths that could not be read, in input order</pre>
<p>A missing file must not make the whole call fail. Use <code>fs.promises.readFile(path, 'utf8')</code>.</p>`,
  vi: J`<p>Một dashboard cần ba tệp; mỗi tệp đọc mất <b>100 ms</b>. Code khởi đầu await lần lượt từng cái: 300 ms. Viết lại <code>loadAll(paths)</code> để các lần đọc chạy <b>cùng lúc</b> (≈100 ms tổng) và resolve với</p>
<pre>{ files: [chữ hoặc null, …],   // cùng thứ tự với paths
  missing: ['…'] }               // các đường không đọc được, theo thứ tự đầu vào</pre>
<p>Một tệp thiếu không được làm cả lời gọi thất bại. Dùng <code>fs.promises.readFile(path, 'utf8')</code>.</p>`,
  yc: [
    ['Start every read before awaiting any of them (<code>paths.map(…)</code>), then await all of them together.', 'Bắt đầu mọi lần đọc trước khi await cái nào (<code>paths.map(…)</code>), rồi await tất cả cùng lúc.'],
    ['Keep the order of <code>paths</code> in <code>files</code>, whatever order the reads finish in.', 'Giữ thứ tự của <code>paths</code> trong <code>files</code>, dù các lần đọc xong theo thứ tự nào.'],
    ['One failure ⇒ <code>null</code> at its position + its path in <code>missing</code> (look at <code>Promise.allSettled</code>).', 'Một thất bại ⇒ <code>null</code> ở vị trí của nó + đường dẫn của nó trong <code>missing</code> (xem <code>Promise.allSettled</code>).'],
  ],
  viDu: [['await loadAll([\'a.txt\', \'b.txt\', \'c.txt\'])', '{"files":["A","B","C"],"missing":[]}  in ≈100 ms', 'All three reads overlap.', 'Ba lần đọc chồng lên nhau.'], ['await loadAll([\'a.txt\', \'nope.txt\'])', '{"files":["A",null],"missing":["nope.txt"]}', 'The missing file does not reject the whole call.', 'Tệp thiếu không làm cả lời gọi reject.']],
  goiY: [
    ['<code>const jobs = paths.map((p) => fs.promises.readFile(p, \'utf8\'));</code> starts all reads now.', '<code>const jobs = paths.map((p) => fs.promises.readFile(p, \'utf8\'));</code> bắt đầu mọi lần đọc ngay.'],
    ['<code>Promise.all</code> rejects on the first failure; <code>Promise.allSettled</code> gives <code>[{ status: \'fulfilled\', value } | { status: \'rejected\', reason }]</code> in input order.', '<code>Promise.all</code> reject ở thất bại đầu tiên; <code>Promise.allSettled</code> trả <code>[{ status: \'fulfilled\', value } | { status: \'rejected\', reason }]</code> theo thứ tự đầu vào.'],
  ],
  loi: [
    ['<code>for (const p of paths) out.push(await read(p))</code> — correct result, three times slower.', '<code>for (const p of paths) out.push(await read(p))</code> — kết quả đúng, chậm gấp ba.'],
    ['<code>paths.forEach(async (p) => out.push(await read(p)))</code> — forEach does not wait, so <code>out</code> is returned empty.', '<code>paths.forEach(async (p) => out.push(await read(p)))</code> — forEach không chờ, nên <code>out</code> trả về rỗng.'],
    ['<code>Promise.all</code> without handling failures: one missing file loses the two that were read.', '<code>Promise.all</code> không xử lý thất bại: một tệp thiếu làm mất cả hai tệp đã đọc được.'],
  ],
  gt: [
    'Calling <code>readFile</code> three times in a row starts three reads that wait in parallel — the single thread is free while the disk works. Awaiting <code>Promise.allSettled(jobs)</code> waits for the slowest one (100 ms), not for the sum (300 ms), and its results come back in input order, which fills <code>files</code> and <code>missing</code> in one pass. This is the same move as <code>await Promise.all([User.find(), Post.find()])</code> in a controller that needs two independent queries.',
    'Gọi <code>readFile</code> ba lần liền nhau là bắt đầu ba lần đọc chờ song song — luồng duy nhất rảnh trong lúc đĩa làm. Await <code>Promise.allSettled(jobs)</code> chờ cái chậm nhất (100 ms), không phải tổng (300 ms), và kết quả về theo thứ tự đầu vào, nên một vòng là điền xong <code>files</code> và <code>missing</code>. Đây cũng là nước đi <code>await Promise.all([User.find(), Post.find()])</code> trong controller cần hai truy vấn độc lập.',
  ],
  kn: ['Promise.all', 'Promise.allSettled', 'concurrency'],
  tns: [tn('concurrent', 'đồng thời', 'nhiều việc chờ cùng lúc'), tn('settled', 'đã xong', 'fulfilled hoặc rejected')],
  dau: J`const fs = require('fs');

async function loadAll(paths) {
  const files = [];
  for (const p of paths) {
    files.push(await fs.promises.readFile(p, 'utf8'));   // one after another
  }
  return { files, missing: [] };
}
`,
  giai: J`const fs = require('fs');

async function loadAll(paths) {
  // 1) START every read now — they wait for the disk at the same time
  const jobs = paths.map((p) => fs.promises.readFile(p, 'utf8'));
  // 2) wait for all of them; allSettled never rejects and keeps the input order
  const results = await Promise.allSettled(jobs);
  const files = [];
  const missing = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') files.push(r.value);
    else { files.push(null); missing.push(paths[i]); }
  });
  return { files, missing };
}
`,
  chuanBi: `__disk.put('a.txt', 'A', 100); __disk.put('b.txt', 'B', 100); __disk.put('c.txt', 'C', 100); __disk.put('slow.txt', 'S', 180); const t0 = Date.now();`,
  cases: [
    { goi: `[await loadAll(['a.txt', 'b.txt', 'c.txt']), Date.now() - t0]`, moTa: ['Three files in ≈100 ms, not 300', 'Ba tệp trong ≈100 ms, không phải 300'] },
    { goi: `await loadAll(['a.txt', 'nope.txt', 'c.txt'])`, moTa: ['A missing file → null + listed in missing', 'Tệp thiếu → null + có trong missing'] },
    { goi: `[await loadAll(['slow.txt', 'a.txt']), Date.now() - t0]`, an: true, moTa: ['Order follows paths even if the first file is the slowest', 'Thứ tự theo paths dù tệp đầu chậm nhất'] },
    { goi: `[await loadAll([]), Date.now() - t0]`, an: true },
    { goi: `await loadAll(['x.txt', 'y.txt'])`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-1-1-node-event-loop',
  ten: '1.1 Node.js, the event loop & modules',
  khoa: KHOA,
  baiHoc: 'sdn302-1-1-node-event-loop',
  de: [E1, E2, E3, E4, E5],
});
