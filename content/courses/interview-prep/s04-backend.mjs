/**
 * IT Interview Prep — Chương 4: Vòng kỹ thuật backend (soạn 15/11/2026, nhánh B).
 * Node.js · SQL/PostgreSQL · API + bảo mật · testing · Java/OOP + Spring Boot · lab mock 45 phút · quiz.
 * Câu hỏi viết MỘT lần dạng song ngữ (mảng [EN, VI]) rồi in hai lần qua qs('en'|'vi', …) để hai khối luôn khớp ý.
 * LUẬT: backtick → &#96;; không viết "${" trong chữ; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 */
import { ma, ra, lienKet, nguon, yt, flow, stack, kv, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/** In một bộ câu hỏi song ngữ: mỗi phần tử { so, q:[en,vi], chu:[en,vi], a:[en,vi], sau:[[en…],[vi…]], loi:[en,vi] }. */
const qs = (L, arr) => arr.map((x) => {
  const i = L === 'en' ? 0 : 1;
  return qa(L, { so: x.so, q: x.q[i], chu: x.chu ? x.chu[i] : '', a: x.a[i], sau: x.sau ? x.sau[i] : [], loi: x.loi ? x.loi[i] : '' });
}).join('\n');

/** Khung trả lời một câu kỹ thuật — dùng chung cả chương. */
const khungTraLoi = (L) => L === 'en' ? flow([
  ['1 · Define', 'one sentence, in your own words', 'Shows you know what the thing is, not just its name.'],
  ['2 · Mechanism', 'how it works underneath', 'One level deeper than the definition — this is where intern answers separate.'],
  ['3 · Example', 'from a project you did', '"In my project…" is worth more than any textbook example.'],
  ['4 · Trade-off', 'when it is the wrong choice', 'Saying when NOT to use something is the strongest signal of real understanding.'],
]) : flow([
  ['1 · Định nghĩa', 'một câu, bằng lời của bạn', 'Cho thấy bạn biết nó là gì, chứ không chỉ thuộc tên.'],
  ['2 · Cơ chế', 'bên dưới nó chạy thế nào', 'Sâu hơn định nghĩa một tầng — đây là chỗ câu trả lời của intern tách nhau ra.'],
  ['3 · Ví dụ', 'từ một dự án bạn đã làm', '"Trong dự án của em…" đáng giá hơn mọi ví dụ sách giáo khoa.'],
  ['4 · Đánh đổi', 'khi nào nó là lựa chọn SAI', 'Nói được khi nào KHÔNG nên dùng là tín hiệu mạnh nhất của hiểu thật.'],
]);

/* ═══════════════════════ 4.1 — Node.js và JavaScript ═══════════════════════ */
const NODE_THU_TU = `
console.log('A');
setTimeout(() => console.log('B'), 0);
setImmediate(() => console.log('C'));
Promise.resolve().then(() => console.log('D'));
process.nextTick(() => console.log('E'));
console.log('F');
`;

const NODE_CHAN = `
// Chặn event loop: 1 request tính 2 giây ⇒ MỌI request khác chờ 2 giây
app.get('/report', (req, res) => {
  const rows = buildHugeReportSync();   // CPU 2 s trên luồng chính
  res.json(rows);
});

// Cách sửa 1: đẩy việc nặng sang worker thread
const { Worker } = require('node:worker_threads');
app.get('/report', (req, res) => {
  const w = new Worker('./report-worker.js');
  w.once('message', (rows) => res.json(rows));
  w.once('error', (err) => res.status(500).json({ error: 'REPORT_FAILED' }));
});
// Cách sửa 2 (việc rất nặng): đưa vào hàng đợi (BullMQ), trả 202 + id việc
`;

const NODE_AWAIT = `
// Chậm: chờ tuần tự, 3 lời gọi x 200 ms = ~600 ms
const user = await getUser(id);
const posts = await getPosts(id);
const stats = await getStats(id);

// Nhanh: ba lời gọi độc lập chạy song song = ~200 ms
const [user2, posts2, stats2] = await Promise.all([getUser(id), getPosts(id), getStats(id)]);
// Một cái hỏng là cả Promise.all hỏng; cần từng kết quả riêng thì dùng Promise.allSettled
`;

const QNODE = [
  {
    so: '4.1-1',
    q: ['"Node.js is single-threaded" — is that true? Explain the event loop.', '"Node.js chạy đơn luồng" — đúng không? Giải thích event loop.'],
    chu: ['Whether you know the difference between "JavaScript runs on one thread" and "Node does everything on one thread".', 'Bạn có phân biệt "JavaScript chạy trên một luồng" với "Node làm mọi thứ trên một luồng" không.'],
    a: [
      '<p><strong>Half true.</strong> Your JavaScript runs on one main thread, so two callbacks never run at the same time. But Node itself is not one thread: network I/O is handed to the operating system (epoll on Linux, kqueue on macOS), and some work that has no async OS API — file system calls, <code>dns.lookup</code>, <code>crypto.pbkdf2</code>, zlib — goes to libuv’s thread pool (4 threads by default, <code>UV_THREADPOOL_SIZE</code>).</p><p>The <strong>event loop</strong> is the cycle that picks up finished work and runs its callback. It has phases: <em>timers</em> (setTimeout/setInterval), <em>pending callbacks</em>, <em>poll</em> (new I/O events — where it waits when idle), <em>check</em> (setImmediate) and <em>close</em>. Between callbacks Node drains the microtask queues: first <code>process.nextTick</code>, then Promise callbacks.</p><p>Consequence: Node is excellent for many concurrent I/O-bound requests — an API waiting on PostgreSQL and Redis — and bad at CPU-heavy work on the main thread, because while one callback computes, nothing else runs.</p>',
      '<p><strong>Đúng một nửa.</strong> Mã JavaScript của bạn chạy trên một luồng chính, nên hai callback không bao giờ chạy cùng lúc. Nhưng bản thân Node không phải một luồng: I/O mạng được giao cho hệ điều hành (epoll trên Linux, kqueue trên macOS), còn những việc không có API bất đồng bộ của hệ điều hành — gọi file system, <code>dns.lookup</code>, <code>crypto.pbkdf2</code>, zlib — đi vào thread pool của libuv (mặc định 4 luồng, chỉnh bằng <code>UV_THREADPOOL_SIZE</code>).</p><p><strong>Event loop</strong> (vòng lặp sự kiện) là vòng quay nhặt những việc đã xong và chạy callback của chúng. Nó có các pha: <em>timers</em> (setTimeout/setInterval), <em>pending callbacks</em>, <em>poll</em> (sự kiện I/O mới — chỗ nó ngồi chờ khi rảnh), <em>check</em> (setImmediate) và <em>close</em>. Giữa các callback, Node xả hết hàng microtask: trước là <code>process.nextTick</code>, sau là callback của Promise.</p><p>Hệ quả: Node rất hợp với nhiều request đồng thời nặng về I/O — một API chờ PostgreSQL và Redis — và rất dở với việc nặng CPU trên luồng chính, vì trong lúc một callback đang tính, không gì khác chạy được.</p>',
    ],
    sau: [
      ['Which operations use the thread pool, and what happens if you hash 100 passwords with bcrypt at once?', 'Where do microtasks run relative to the phases?', 'Is Node a good fit for video transcoding?'],
      ['Thao tác nào dùng thread pool, và chuyện gì xảy ra nếu bạn băm 100 mật khẩu bằng bcrypt cùng lúc?', 'Microtask chạy ở đâu so với các pha?', 'Node có hợp để chuyển mã video không?'],
    ],
    loi: ['Saying "Node is single-threaded so it can only handle one request at a time" — that is exactly the misconception the question is fishing for.', 'Nói "Node đơn luồng nên chỉ xử lý được một request một lúc" — đúng cái hiểu sai mà câu hỏi đang câu.'],
  },
  {
    so: '4.1-2',
    q: ['What does this print, and why?', 'Đoạn này in ra gì, và vì sao?'],
    chu: ['Whether you can reason with the queues instead of guessing.', 'Bạn có suy luận bằng các hàng đợi thay vì đoán không.'],
    a: [
      '<p>Run it in your head phase by phase:</p><ol><li>Synchronous code first: <strong>A</strong>, <strong>F</strong>.</li><li>Then the microtasks, nextTick before Promises: <strong>E</strong>, <strong>D</strong>.</li><li>Then the loop: <strong>B</strong> (timer) and <strong>C</strong> (setImmediate). In the main module their order is <em>not guaranteed</em> — it depends on whether the 1 ms timer threshold has passed when the loop starts. Inside an I/O callback, setImmediate always runs first.</li></ol><p>So: A F E D, then B C or C B. Saying "the last two may swap, and here is why" scores more than reciting one fixed order.</p>',
      '<p>Chạy trong đầu theo từng pha:</p><ol><li>Mã đồng bộ trước: <strong>A</strong>, <strong>F</strong>.</li><li>Rồi tới microtask, nextTick trước Promise: <strong>E</strong>, <strong>D</strong>.</li><li>Rồi tới vòng lặp: <strong>B</strong> (timer) và <strong>C</strong> (setImmediate). Ở module chính, thứ tự hai cái này <em>không được bảo đảm</em> — tuỳ ngưỡng 1 ms của timer đã qua hay chưa lúc vòng lặp bắt đầu. Bên trong một callback I/O thì setImmediate luôn chạy trước.</li></ol><p>Vậy: A F E D, rồi B C hoặc C B. Nói được "hai cái cuối có thể đổi chỗ, vì thế này" được điểm cao hơn đọc thuộc một thứ tự cố định.</p>',
    ],
    sau: [['What if the Promise callback itself schedules another nextTick?', 'Can recursive nextTick starve the event loop?'], ['Nếu chính callback của Promise lại đặt thêm một nextTick thì sao?', 'nextTick đệ quy có làm event loop chết đói không?']],
    loi: ['Answering "B before C because setTimeout was written first" — order in the source is not order of execution.', 'Trả lời "B trước C vì setTimeout viết trước" — thứ tự trong mã nguồn không phải thứ tự chạy.'],
  },
  {
    so: '4.1-3',
    q: ['What blocks the event loop? How would you notice it in production, and how do you fix it?', 'Cái gì làm nghẽn event loop? Trên production bạn nhận ra bằng cách nào, và sửa ra sao?'],
    chu: ['Practical experience — symptoms, measurement and fixes, not just theory.', 'Kinh nghiệm thực tế — triệu chứng, đo đạc và cách sửa, không chỉ lý thuyết.'],
    a: [
      '<p><strong>What blocks:</strong> any long synchronous work on the main thread — a big <code>JSON.parse</code>, sorting a huge array, <code>bcrypt.hashSync</code>, <code>fs.readFileSync</code> in a request, a catastrophic regular expression (ReDoS).</p><p><strong>Symptom:</strong> <em>every</em> endpoint gets slow at the same moment, even the health check, while CPU on one core is at 100%. That pattern — "everything slow together" — is the signature.</p><p><strong>Measure:</strong> event-loop delay with <code>perf_hooks.monitorEventLoopDelay()</code>, or a profiler (<code>node --cpu-prof</code>, clinic).</p><p><strong>Fix by size:</strong> use the async version; split the work into chunks; move it to a <code>worker_thread</code>; or — for work that takes seconds — put it in a queue (BullMQ) and return <code>202 Accepted</code> with a job id.</p>',
      '<p><strong>Cái gì làm nghẽn:</strong> bất kỳ việc đồng bộ dài nào trên luồng chính — một <code>JSON.parse</code> rất lớn, sắp xếp một mảng khổng lồ, <code>bcrypt.hashSync</code>, <code>fs.readFileSync</code> trong request, một biểu thức chính quy thảm hoạ (ReDoS).</p><p><strong>Triệu chứng:</strong> <em>mọi</em> endpoint cùng chậm một lúc, kể cả health check, trong khi một nhân CPU chạy 100%. Dấu hiệu "mọi thứ cùng chậm" chính là chữ ký của nó.</p><p><strong>Đo:</strong> độ trễ event loop bằng <code>perf_hooks.monitorEventLoopDelay()</code>, hoặc profiler (<code>node --cpu-prof</code>, clinic).</p><p><strong>Sửa theo cỡ:</strong> dùng bản async; chia việc thành từng mẩu; chuyển sang <code>worker_thread</code>; hoặc — việc mất vài giây — đưa vào hàng đợi (BullMQ) và trả <code>202 Accepted</code> kèm id việc.</p>',
    ],
    sau: [['Why does a worker thread help but adding more async/await does not?', 'When would you choose a queue over a worker thread?'], ['Vì sao worker thread giúp được còn thêm async/await thì không?', 'Khi nào chọn hàng đợi thay vì worker thread?']],
    loi: ['"Just make the function async" — wrapping CPU work in async changes nothing; it still runs on the same thread.', '"Cứ cho hàm thành async là xong" — bọc việc CPU trong async không đổi gì; nó vẫn chạy trên cùng luồng đó.'],
  },
  {
    so: '4.1-4',
    q: ['Callbacks, Promises, async/await — what is the difference, and how do you handle errors with each?', 'Callback, Promise, async/await — khác nhau thế nào, và xử lý lỗi với từng cái ra sao?'],
    chu: ['That you can write correct async code, including the error path.', 'Bạn viết đúng mã bất đồng bộ, kể cả nhánh lỗi.'],
    a: [
      '<p>All three express "run this later". <strong>Callbacks</strong> pass a function, error first (<code>(err, data)</code>); nesting leads to "callback hell" and errors are easy to drop. A <strong>Promise</strong> is an object for a future value, chainable with <code>.then/.catch</code>. <strong>async/await</strong> is syntax on top of Promises: an async function always returns a Promise, and <code>await</code> pauses only that function, not the thread.</p><p>Errors: callbacks — check <code>err</code> every time; Promises — <code>.catch</code> at the end of the chain; async/await — <code>try/catch</code>. An unhandled rejected Promise crashes the process by default since Node 15, so in Express 4 you must forward errors with <code>next(err)</code> (Express 5 does it for rejected async handlers automatically).</p><p>A detail that shows experience: awaiting independent calls one by one is slow; start them together with <code>Promise.all</code>:</p>',
      '<p>Cả ba đều diễn đạt "chạy cái này sau". <strong>Callback</strong> truyền vào một hàm, lỗi đứng đầu (<code>(err, data)</code>); lồng nhau sinh ra "callback hell" và lỗi rất dễ bị bỏ rơi. <strong>Promise</strong> là một đối tượng đại diện cho giá trị tương lai, nối chuỗi bằng <code>.then/.catch</code>. <strong>async/await</strong> là cú pháp dựng trên Promise: hàm async luôn trả về một Promise, và <code>await</code> chỉ tạm dừng hàm đó, không dừng luồng.</p><p>Lỗi: callback — kiểm <code>err</code> mỗi lần; Promise — <code>.catch</code> ở cuối chuỗi; async/await — <code>try/catch</code>. Một Promise bị reject mà không ai bắt sẽ làm sập tiến trình theo mặc định từ Node 15, nên với Express 4 bạn phải chuyển lỗi bằng <code>next(err)</code> (Express 5 tự làm việc đó với handler async bị reject).</p><p>Chi tiết cho thấy kinh nghiệm: await từng lời gọi độc lập một là chậm; hãy khởi động chúng cùng lúc bằng <code>Promise.all</code>:</p>',
    ],
    sau: [['Promise.all vs Promise.allSettled vs Promise.race?', 'What happens to the other promises when one in Promise.all rejects?'], ['Promise.all khác Promise.allSettled và Promise.race thế nào?', 'Khi một promise trong Promise.all bị reject thì các promise kia ra sao?']],
    loi: ['Saying await "blocks the thread". It suspends the function; the thread keeps serving other requests.', 'Nói await "chặn luồng". Nó chỉ tạm dừng hàm; luồng vẫn phục vụ request khác.'],
  },
  {
    so: '4.1-5',
    q: ['How does Express middleware work? Where does the error handler go?', 'Middleware của Express hoạt động thế nào? Error handler đặt ở đâu?'],
    chu: ['Whether you understand the request pipeline of the framework you list on your CV.', 'Bạn có hiểu đường đi của request trong framework mình ghi trên CV không.'],
    a: [
      '<p>A middleware is a function <code>(req, res, next)</code>. Express runs them <strong>in the order they are registered</strong>; each one either ends the response or calls <code>next()</code> to pass control on. Typical order: request id and logging → security headers and CORS → body parser with a size limit → rate limit → authentication → routes → 404 handler → error handler.</p><p>The <strong>error handler</strong> has four parameters <code>(err, req, res, next)</code> and must be registered <strong>last</strong>. Calling <code>next(err)</code> anywhere skips straight to it. It should log the full error with the request id and return a safe, consistent body — never a stack trace to the client.</p>',
      '<p>Middleware là một hàm <code>(req, res, next)</code>. Express chạy chúng <strong>theo đúng thứ tự đăng ký</strong>; mỗi cái hoặc kết thúc response, hoặc gọi <code>next()</code> để chuyển tiếp. Thứ tự điển hình: request id và log → header bảo mật và CORS → body parser có giới hạn kích thước → rate limit → xác thực → route → handler 404 → error handler.</p><p><strong>Error handler</strong> có bốn tham số <code>(err, req, res, next)</code> và phải đăng ký <strong>cuối cùng</strong>. Gọi <code>next(err)</code> ở bất kỳ đâu sẽ nhảy thẳng tới nó. Nó nên ghi log đầy đủ lỗi kèm request id và trả về một thân phản hồi an toàn, thống nhất — không bao giờ gửi stack trace cho client.</p>',
    ],
    sau: [['What happens if a middleware neither responds nor calls next()?', 'Why put authentication before the routes but after the body parser?'], ['Chuyện gì xảy ra nếu một middleware không trả lời cũng không gọi next()?', 'Vì sao đặt xác thực trước route nhưng sau body parser?']],
    loi: ['Forgetting that the error handler needs exactly four parameters — with three, Express treats it as a normal middleware.', 'Quên rằng error handler cần đúng bốn tham số — có ba thì Express coi nó là middleware thường.'],
  },
  {
    so: '4.1-6',
    q: ['How do you shut down a Node server gracefully during a deploy?', 'Làm sao tắt một server Node "êm" khi deploy?'],
    chu: ['Production awareness — a question that separates people who have deployed from people who have only run npm start.', 'Ý thức production — câu tách người đã từng deploy khỏi người chỉ từng chạy npm start.'],
    a: [
      '<p>On deploy, Docker (or systemd) sends <code>SIGTERM</code>, waits a grace period — 10 seconds by default for <code>docker stop</code> — then sends <code>SIGKILL</code>. A graceful shutdown: on SIGTERM stop accepting new connections (<code>server.close()</code>), let in-flight requests finish, close long-lived connections (WebSocket, SSE) yourself, close the database pool and queues, flush logs, then exit with code 0. Keep your own forced timeout <strong>shorter</strong> than Docker’s.</p><p><strong>A real case from my project:</strong> the backend was being SIGKILLed on every deploy. <code>server.close()</code> never completed because upgraded WebSocket connections do not end by themselves, and our forced timeout (30 s) was longer than Docker’s 10 s. The fix was to close the Socket.IO engine and the collaborative-editing WebSocket servers explicitly on SIGTERM and lower the forced exit to 8 s; shutdown went from about 8 seconds to a few milliseconds.</p>',
      '<p>Khi deploy, Docker (hoặc systemd) gửi <code>SIGTERM</code>, chờ một khoảng ân hạn — mặc định 10 giây với <code>docker stop</code> — rồi gửi <code>SIGKILL</code>. Tắt êm nghĩa là: nhận SIGTERM thì ngừng nhận kết nối mới (<code>server.close()</code>), cho các request đang chạy làm xong, tự đóng các kết nối dài (WebSocket, SSE), đóng pool CSDL và hàng đợi, đẩy hết log, rồi thoát mã 0. Hạn ép của chính mình phải <strong>ngắn hơn</strong> hạn của Docker.</p><p><strong>Chuyện thật trong dự án của em:</strong> backend bị SIGKILL mỗi lần deploy. <code>server.close()</code> không bao giờ xong vì kết nối WebSocket đã nâng cấp không tự kết thúc, và hạn ép của bọn em (30 giây) lại dài hơn 10 giây của Docker. Cách sửa là đóng engine Socket.IO và các máy chủ WebSocket đồng soạn thảo ngay khi nhận SIGTERM, hạ hạn ép xuống 8 giây; thời gian tắt từ khoảng 8 giây xuống vài mili giây.</p>',
    ],
    sau: [['What do clients connected by WebSocket experience during that shutdown?', 'How does a load balancer know to stop sending traffic to the old container?'], ['Client đang nối WebSocket thấy gì trong lúc tắt?', 'Load balancer biết ngừng gửi lưu lượng vào container cũ bằng cách nào?']],
    loi: ['Never having thought about it: "the container just restarts". That answer tells the interviewer you have not run anything in production.', 'Chưa từng nghĩ tới: "container tự khởi động lại thôi ạ". Câu đó báo cho người phỏng vấn biết bạn chưa vận hành gì trên production.'],
  },
  {
    so: '4.1-7',
    q: ['CommonJS vs ES Modules — what is the difference in practice?', 'CommonJS và ES Modules khác nhau thế nào trong thực tế?'],
    chu: ['Familiarity with the everyday friction of the ecosystem.', 'Bạn có quen với những va chạm hằng ngày của hệ sinh thái không.'],
    a: [
      '<p><strong>CommonJS</strong> (<code>require</code>/<code>module.exports</code>) loads synchronously at run time; <code>require</code> can be called anywhere. <strong>ESM</strong> (<code>import</code>/<code>export</code>) is the standard: imports are static and resolved before code runs, which enables tree-shaking and top-level <code>await</code>. A package chooses with <code>"type": "module"</code> in package.json or the extensions <code>.mjs</code>/<code>.cjs</code>. In ESM there is no <code>__dirname</code> (use <code>import.meta.url</code>), and relative imports need the file extension. Mixing them is the usual source of "require is not defined" or "Cannot use import statement outside a module".</p>',
      '<p><strong>CommonJS</strong> (<code>require</code>/<code>module.exports</code>) nạp đồng bộ lúc chạy; gọi <code>require</code> ở đâu cũng được. <strong>ESM</strong> (<code>import</code>/<code>export</code>) là chuẩn: import là tĩnh và được phân giải trước khi mã chạy, nhờ vậy có tree-shaking và <code>await</code> ở cấp cao nhất. Một gói chọn kiểu bằng <code>"type": "module"</code> trong package.json hoặc đuôi <code>.mjs</code>/<code>.cjs</code>. Trong ESM không có <code>__dirname</code> (dùng <code>import.meta.url</code>), và import tương đối phải ghi cả đuôi tệp. Trộn hai kiểu là nguồn quen thuộc của lỗi "require is not defined" hay "Cannot use import statement outside a module".</p>',
    ],
    sau: [['What does TypeScript compile your imports into?', 'Why are circular imports dangerous in both?'], ['TypeScript biên dịch import của bạn thành gì?', 'Vì sao import vòng tròn nguy hiểm ở cả hai kiểu?']],
    loi: ['"They are the same, just different syntax." The loading model is the real difference.', '"Hai cái như nhau, khác cú pháp thôi." Cơ chế nạp mới là khác biệt thật.'],
  },
  {
    so: '4.1-8',
    q: ['How do you run Node on a machine with 8 CPU cores? What changes when you have several instances?', 'Chạy Node trên máy 8 nhân thế nào? Có nhiều instance thì điều gì thay đổi?'],
    chu: ['A first step into scaling — the "to score points" question for interns.', 'Bước đầu vào chuyện mở rộng — câu "ghi điểm" cho intern.'],
    a: [
      '<p>One Node process uses one core for JavaScript, so to use eight cores you run several processes: the <code>cluster</code> module, PM2 in cluster mode, or several containers behind nginx or a load balancer. The important consequence is that <strong>state can no longer live in process memory</strong>: sessions, rate-limit counters, caches and WebSocket rooms must move to shared storage — usually Redis — and WebSocket needs either sticky sessions or an adapter (for Socket.IO, the Redis adapter) so a message published on one instance reaches users connected to another.</p><p>A real lesson from my project: when Redis started more slowly than the backend, the Socket.IO adapter was swapped after users had already connected, and realtime messages silently stopped reaching them. Replacing the machinery under a running system loses its state; we added a 5-second limit and kept the in-memory adapter if Redis was late.</p>',
      '<p>Một tiến trình Node dùng một nhân cho JavaScript, nên để dùng tám nhân bạn chạy nhiều tiến trình: module <code>cluster</code>, PM2 ở chế độ cluster, hoặc nhiều container phía sau nginx hay load balancer. Hệ quả quan trọng là <strong>trạng thái không còn được sống trong bộ nhớ tiến trình</strong>: phiên đăng nhập, bộ đếm rate limit, cache và room WebSocket phải chuyển ra kho dùng chung — thường là Redis — và WebSocket cần sticky session hoặc một adapter (với Socket.IO là Redis adapter) để tin phát ở instance này tới được người đang nối vào instance khác.</p><p>Một bài học thật từ dự án của em: khi Redis khởi động chậm hơn backend, adapter của Socket.IO bị thay SAU khi người dùng đã nối vào, và tin realtime âm thầm không tới họ nữa. Thay "bộ máy" bên dưới một hệ đang chạy là mất trạng thái của nó; bọn em đặt hạn 5 giây và giữ adapter trong RAM nếu Redis tới muộn.</p>',
    ],
    sau: [['What is a sticky session and what breaks without it?', 'Why must a rate limiter be shared across instances?'], ['Sticky session là gì và thiếu nó thì hỏng gì?', 'Vì sao bộ giới hạn tần suất phải dùng chung giữa các instance?']],
    loi: ['"Node can’t use multiple cores." It can — with multiple processes or worker threads.', '"Node không dùng được nhiều nhân." Dùng được — bằng nhiều tiến trình hoặc worker thread.'],
  },
];

const L41 = {
  title: '4.1 — Node.js and JavaScript questions: event loop, async, Express, shutdown, scaling|||4.1 — Câu hỏi Node.js và JavaScript: event loop, bất đồng bộ, Express, tắt êm, mở rộng',
  slug: 'pv-4-1-node',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám câu hỏi Node.js hay gặp nhất ở vòng kỹ thuật backend — event loop, thứ tự microtask, nghẽn event loop, Promise và async/await, middleware Express, tắt server êm khi deploy, CommonJS và ESM, chạy nhiều instance — mỗi câu có câu trả lời mẫu, câu đào sâu và lỗi hay gặp, kèm ví dụ thật từ hệ thống đang chạy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Node.js and JavaScript questions — the eight that come up most</h2>
<p class="lead">If your CV says Node.js, these are the questions you will meet in some form. None of them asks you to memorise an API. They ask whether you understand how Node runs your code — because that understanding is what prevents the outages a backend intern could cause on their first week.</p>

<h3>How a technical round treats your answers</h3>
${doiThuong('en', 'A technical interview is like a driving test, not a written exam. The examiner does not care whether you can recite the traffic code; they watch whether you check the mirror before turning. For Node, "checking the mirror" is knowing that a long loop on the main thread freezes every user — and saying so before you are asked.')}
<p>Answer every technical question with the same four-step frame. It keeps you from rambling and makes the interviewer’s follow-up questions predictable:</p>
${khungTraLoi('en')}

<h3>The questions</h3>
<p>Say your answer out loud first, then open the sample. Code for question 4.1-2:</p>
${ma('js', NODE_THU_TU)}
${qs('en', QNODE.slice(0, 3))}
<p>Blocking and its fixes, as code:</p>
${ma('js', NODE_CHAN)}
${qs('en', QNODE.slice(3, 4))}
${ma('js', NODE_AWAIT)}
${qs('en', QNODE.slice(4))}

${bay('en', 'answering with the vocabulary but not the consequence.', '"The event loop has six phases: timers, pending callbacks, idle/prepare, poll, check, close" — and then silence. The interviewer then asks "so what?" and the answer is gone. Always end with the practical consequence: "…so a CPU-heavy loop in one request freezes every other request".')}
${neu('en', 'the interviewer asks something you have never seen, like "what is <code>AsyncLocalStorage</code>"? Say what you do know and reason: "I have not used it. From the name, I would guess it keeps data per async call chain — something like a request id that follows a request through all its awaits without passing it as a parameter. I would check the docs." That is correct, and it shows exactly the reasoning they want.')}
${keXau('en', 'Node-specific attacks interviewers like: <strong>ReDoS</strong> — a regular expression with nested quantifiers that a crafted input makes run for seconds, freezing the single thread for everyone; <strong>prototype pollution</strong> — merging untrusted JSON with <code>__proto__</code> keys into objects; and unbounded request bodies that exhaust memory. Defences: limit body size, validate input with a schema, avoid hand-written regex on user input, keep dependencies updated.')}

${thucHanh('en', { phut: '30–40', steps: [
  'Run the ordering snippet with <code>node</code> five times. Then wrap it inside <code>fs.readFile(__filename, () => { … })</code> and run again. Write down why B and C behave differently.',
  'Write a tiny Express route that blocks for 2 seconds with a busy loop. Call it, and at the same time call a second route that returns immediately. Measure both with <code>curl -w "%{time_total}"</code>.',
  'Answer questions 4.1-1, 4.1-3 and 4.1-6 out loud, recorded on your phone, each under 2 minutes, using the four-step frame.',
], dat: 'you can explain from your own measurement why the fast route waited, and your three recordings each have a definition, a mechanism, an example and a trade-off.' })}
${thuatNgu('en', [
  ['Event loop', 'The cycle that picks finished work and runs its callback, phase by phase.'],
  ['libuv thread pool', 'Four background threads (by default) for file system, DNS lookup, crypto and zlib work.'],
  ['Microtask', 'A callback queued by a Promise or process.nextTick, run before the loop moves on.'],
  ['Blocking', 'Synchronous work long enough to stop the loop from serving anyone else.'],
  ['Worker thread', 'A separate JavaScript thread for CPU-heavy work.'],
  ['Graceful shutdown', 'Stopping a server so in-flight work finishes and connections close cleanly.'],
  ['SIGTERM / SIGKILL', 'The polite "please stop" signal, and the forced kill that follows after a timeout.'],
])}
${tomTat('en', [
  'Your JavaScript runs on one thread; I/O and some work run elsewhere — that is the honest answer to "single-threaded?".',
  'Sync code, then nextTick, then Promises, then loop phases; setTimeout 0 vs setImmediate order is not guaranteed in the main module.',
  'Everything-slow-at-once means a blocked loop: measure loop delay, then chunk, worker thread or queue.',
  'Middleware runs in registration order; the four-argument error handler goes last.',
  'Graceful shutdown must close long-lived connections and finish before Docker’s timeout.',
  'Several instances mean shared state in Redis, and an adapter or sticky sessions for WebSocket.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-2-2-event-loop', L: 'en', title: 'Node.js 2.2 — The event loop, phase by phase', sub: 'The full mechanism behind question 4.1-1, measured.' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', L: 'en', title: 'Node.js 1.4 — Async: callbacks, Promises, async/await', sub: 'The ground under question 4.1-4.' }),
  yt('eiC58R16hb8', 'Lydia Hallie', 'JavaScript Visualized — Event Loop, Web APIs, (Micro)task Queue', 13, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Câu hỏi Node.js và JavaScript — tám câu hay gặp nhất</h2>
<p class="lead">Nếu CV của bạn ghi Node.js, bạn sẽ gặp những câu này dưới dạng này hay dạng khác. Không câu nào bắt bạn thuộc lòng API. Chúng hỏi xem bạn có hiểu Node chạy mã của bạn thế nào không — vì chính sự hiểu đó ngăn những sự cố mà một intern backend có thể gây ra ngay tuần đầu.</p>

<h3>Vòng kỹ thuật đối xử với câu trả lời của bạn thế nào</h3>
${doiThuong('vi', 'Phỏng vấn kỹ thuật giống thi sát hạch lái xe, không giống thi viết. Giám khảo không quan tâm bạn đọc thuộc luật giao thông; họ nhìn xem bạn có nhìn gương trước khi rẽ không. Với Node, "nhìn gương" là biết rằng một vòng lặp dài trên luồng chính làm đơ mọi người dùng — và tự nói ra điều đó trước khi bị hỏi.')}
<p>Trả lời mọi câu hỏi kỹ thuật bằng cùng một khung bốn bước. Nó giữ bạn khỏi nói lan man, và làm các câu hỏi đào sâu tiếp theo trở nên đoán trước được:</p>
${khungTraLoi('vi')}

<h3>Các câu hỏi</h3>
<p>Tự nói câu trả lời thành tiếng trước, rồi mới mở mẫu. Mã cho câu 4.1-2:</p>
${ma('js', NODE_THU_TU)}
${qs('vi', QNODE.slice(0, 3))}
<p>Nghẽn event loop và cách sửa, viết thành mã:</p>
${ma('js', NODE_CHAN)}
${qs('vi', QNODE.slice(3, 4))}
${ma('js', NODE_AWAIT)}
${qs('vi', QNODE.slice(4))}

${bay('vi', 'trả lời bằng từ vựng mà thiếu hệ quả.', '"Event loop có sáu pha: timers, pending callbacks, idle/prepare, poll, check, close" — rồi im lặng. Người phỏng vấn hỏi tiếp "thì sao?" và câu trả lời biến mất. Luôn kết bằng hệ quả thực tế: "…nên một vòng lặp nặng CPU trong một request làm đơ mọi request khác".')}
${neu('vi', 'người phỏng vấn hỏi một thứ bạn chưa từng thấy, ví dụ "<code>AsyncLocalStorage</code> là gì"? Nói những gì bạn biết và suy luận: "Em chưa dùng. Nhìn tên thì em đoán nó giữ dữ liệu theo từng chuỗi gọi bất đồng bộ — kiểu một request id đi theo request qua mọi lần await mà không phải truyền làm tham số. Em sẽ đọc tài liệu để chắc." Câu đó đúng, và cho thấy đúng kiểu suy luận họ muốn.')}
${keXau('vi', 'Những đòn tấn công riêng của Node mà người phỏng vấn thích hỏi: <strong>ReDoS</strong> — một biểu thức chính quy có lượng từ lồng nhau mà một đầu vào được chế tạo làm nó chạy vài giây, đóng băng cái luồng duy nhất cho mọi người; <strong>prototype pollution</strong> (đầu độc prototype) — gộp JSON không tin cậy chứa khoá <code>__proto__</code> vào object; và thân request không giới hạn làm cạn bộ nhớ. Cách phòng: giới hạn kích thước body, kiểm đầu vào bằng schema, tránh regex tự viết trên dữ liệu người dùng, cập nhật thư viện.')}

${thucHanh('vi', { phut: '30–40', steps: [
  'Chạy đoạn mã thứ tự bằng <code>node</code> năm lần. Rồi bọc nó trong <code>fs.readFile(__filename, () => { … })</code> và chạy lại. Ghi ra vì sao B và C cư xử khác nhau.',
  'Viết một route Express nhỏ chặn 2 giây bằng vòng lặp bận. Gọi nó, đồng thời gọi một route thứ hai trả về ngay. Đo cả hai bằng <code>curl -w "%{time_total}"</code>.',
  'Trả lời thành tiếng câu 4.1-1, 4.1-3 và 4.1-6, ghi âm bằng điện thoại, mỗi câu dưới 2 phút, dùng khung bốn bước.',
], dat: 'bạn giải thích được từ số đo của chính mình vì sao route nhanh phải chờ, và ba bản ghi âm mỗi bản đều có định nghĩa, cơ chế, ví dụ và đánh đổi.' })}
${thuatNgu('vi', [
  ['Event loop (vòng lặp sự kiện)', 'Vòng quay nhặt việc đã xong và chạy callback của nó, theo từng pha.'],
  ['libuv thread pool (bể luồng của libuv)', 'Bốn luồng nền (mặc định) cho việc file system, tra DNS, mã hoá và nén.'],
  ['Microtask (vi tác vụ)', 'Callback được Promise hoặc process.nextTick xếp hàng, chạy trước khi vòng lặp đi tiếp.'],
  ['Blocking (chặn/nghẽn)', 'Việc đồng bộ đủ dài để vòng lặp không phục vụ được ai khác.'],
  ['Worker thread (luồng phụ)', 'Một luồng JavaScript riêng cho việc nặng CPU.'],
  ['Graceful shutdown (tắt êm)', 'Dừng server sao cho việc đang dở làm xong và kết nối đóng gọn.'],
  ['SIGTERM / SIGKILL', 'Tín hiệu lịch sự "xin dừng", và lệnh giết cưỡng bức theo sau khi hết hạn.'],
])}
${tomTat('vi', [
  'JavaScript của bạn chạy trên một luồng; I/O và một số việc chạy ở chỗ khác — đó là câu trả lời trung thực cho "đơn luồng?".',
  'Mã đồng bộ, rồi nextTick, rồi Promise, rồi các pha của vòng lặp; thứ tự setTimeout 0 với setImmediate ở module chính không được bảo đảm.',
  'Mọi thứ cùng chậm một lúc nghĩa là event loop bị nghẽn: đo độ trễ vòng lặp, rồi chia mẩu, worker thread hoặc hàng đợi.',
  'Middleware chạy theo thứ tự đăng ký; error handler bốn tham số đặt cuối cùng.',
  'Tắt êm phải đóng cả kết nối dài và xong trước hạn của Docker.',
  'Nhiều instance nghĩa là trạng thái dùng chung trong Redis, và adapter hoặc sticky session cho WebSocket.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-2-2-event-loop', title: 'Node.js 2.2 — Event loop, từng pha một', sub: 'Toàn bộ cơ chế đứng sau câu 4.1-1, có số đo.' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Node.js 1.4 — Bất đồng bộ: callback, Promise, async/await', sub: 'Phần nền dưới câu 4.1-4.' }),
  yt('eiC58R16hb8', 'Lydia Hallie', 'JavaScript Visualized — Event Loop, Web APIs, (Micro)task Queue', 13),
])}
</div>
`,
};

/* ═══════════════════════ 4.2 — SQL ═══════════════════════ */
const SQL_INDEX = `
-- Chậm: quét cả bảng 1 triệu đơn
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;
--  Seq Scan on orders  (rows=1000000) ... Execution Time: 180 ms     (minh hoạ)

CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);

EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;
--  Index Scan using idx_orders_customer_created ... Execution Time: 0.1 ms (minh hoạ)

-- Chỉ mục KHÔNG được dùng:
SELECT * FROM users WHERE lower(email) = 'a@b.c';     -- hàm bọc cột ⇒ cần index trên lower(email)
SELECT * FROM products WHERE name LIKE '%phone';      -- ký tự đại diện ở đầu
SELECT * FROM orders WHERE created_at::date = '2026-11-20'; -- ép kiểu cột
`;

const SQL_JOIN = `
-- Mọi khách hàng, kèm số đơn (kể cả khách chưa có đơn)
SELECT c.id, c.name, COUNT(o.id) AS so_don
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'PAID'   -- điều kiện bảng phải đặt ở ON
GROUP BY c.id, c.name;

-- SAI: điều kiện trên bảng bên phải đặt ở WHERE ⇒ LEFT JOIN thành INNER JOIN, khách 0 đơn biến mất
SELECT c.id, COUNT(o.id) FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'PAID'
GROUP BY c.id;
`;

const SQL_KHOA = `
-- Hai người cùng đặt chiếc máy cuối cùng trong phòng lab
-- Cách 1: cập nhật nguyên tử có điều kiện (đơn giản nhất)
UPDATE devices SET available = available - 1
WHERE id = 7 AND available > 0
RETURNING available;          -- 0 dòng trả về ⇒ đã hết, báo 409

-- Cách 2: khoá dòng trong giao dịch
BEGIN;
SELECT available FROM devices WHERE id = 7 FOR UPDATE;   -- người thứ hai chờ ở đây
-- kiểm tra, ghi bản đặt chỗ ...
UPDATE devices SET available = available - 1 WHERE id = 7;
COMMIT;

-- Cách 3: khoá lạc quan bằng cột version
UPDATE bookings SET status = 'APPROVED', version = version + 1
WHERE id = 15 AND version = 3;  -- 0 dòng ⇒ ai đó đã sửa trước, đọc lại rồi thử lại
`;

const QSQL = [
  {
    so: '4.2-1',
    q: ['What is an index, how does it make a query faster, and what does it cost?', 'Chỉ mục (index) là gì, nó làm truy vấn nhanh hơn thế nào, và nó tốn gì?'],
    chu: ['The single most common database question for interns.', 'Câu hỏi CSDL hay gặp nhất với intern.'],
    a: [
      '<p>An index is a separate, sorted structure — in PostgreSQL usually a <strong>B-tree</strong> — that maps column values to the rows that contain them. Instead of reading every row (a <em>sequential scan</em>), the database walks down a few levels of the tree to the matching entries: roughly logarithmic instead of linear. Like the index at the back of a textbook: you find "transaction, page 212" instead of reading every page.</p><p><strong>Costs:</strong> every INSERT, UPDATE and DELETE must also update every index on the table, so writes get slower; indexes take disk and memory; and an index the planner never uses is pure cost. So you index the columns you actually filter, join and sort on — foreign keys, frequent WHERE columns — and check with <code>EXPLAIN ANALYZE</code> that it is used.</p>',
      '<p>Chỉ mục là một cấu trúc riêng, đã sắp xếp — trong PostgreSQL thường là <strong>B-tree</strong> — ánh xạ giá trị của cột tới các dòng chứa nó. Thay vì đọc mọi dòng (<em>quét tuần tự</em>), CSDL đi xuống vài tầng của cây tới đúng các mục khớp: xấp xỉ logarit thay vì tuyến tính. Giống trang mục lục cuối giáo trình: bạn tra "giao dịch, trang 212" thay vì đọc từng trang.</p><p><strong>Cái giá:</strong> mọi INSERT, UPDATE và DELETE phải cập nhật luôn mọi chỉ mục của bảng, nên ghi chậm đi; chỉ mục tốn đĩa và bộ nhớ; và một chỉ mục bộ lập kế hoạch không bao giờ dùng là chi phí thuần. Vì vậy bạn đánh chỉ mục cho những cột thật sự dùng để lọc, join và sắp xếp — khoá ngoại, cột WHERE hay dùng — và kiểm bằng <code>EXPLAIN ANALYZE</code> rằng nó được dùng.</p>',
    ],
    sau: [['When will PostgreSQL ignore your index?', 'Why is an index on a boolean "is_deleted" column usually useless?', 'What does a composite index (a, b) help, and what does it not?'], ['Khi nào PostgreSQL bỏ qua chỉ mục của bạn?', 'Vì sao chỉ mục trên cột boolean "is_deleted" thường vô dụng?', 'Chỉ mục ghép (a, b) giúp được truy vấn nào, không giúp được truy vấn nào?']],
    loi: ['"Indexes make everything faster, so index every column." It ignores the write cost and selectivity.', '"Chỉ mục làm mọi thứ nhanh hơn nên đánh hết các cột." Bỏ qua cái giá khi ghi và độ chọn lọc.'],
  },
  {
    so: '4.2-2',
    q: ['Your index exists but the query is still slow. What do you check?', 'Chỉ mục có rồi mà truy vấn vẫn chậm. Bạn kiểm gì?'],
    chu: ['Whether you debug with evidence (EXPLAIN) or by guessing.', 'Bạn gỡ lỗi bằng bằng chứng (EXPLAIN) hay bằng đoán.'],
    a: [
      '<p>First <code>EXPLAIN ANALYZE</code> the real query with real parameters. Then look for the usual reasons the index is skipped: a <strong>function or cast on the column</strong> (<code>lower(email)</code>, <code>created_at::date</code>) — fix with an expression index or by rewriting the condition as a range; a <strong>leading wildcard</strong> (<code>LIKE \'%phone\'</code>) — needs a trigram index; <strong>wrong column order</strong> in a composite index — (customer_id, created_at) helps "WHERE customer_id = ?" but not "WHERE created_at &gt; ?" alone; <strong>low selectivity</strong> — if the condition matches a large part of the table, a sequential scan really is cheaper; and <strong>stale statistics</strong> — estimated rows far from actual rows, fixed by <code>ANALYZE</code>.</p>',
      '<p>Trước tiên <code>EXPLAIN ANALYZE</code> đúng truy vấn thật với tham số thật. Rồi tìm những lý do quen thuộc khiến chỉ mục bị bỏ qua: <strong>hàm hoặc phép ép kiểu bọc lấy cột</strong> (<code>lower(email)</code>, <code>created_at::date</code>) — sửa bằng chỉ mục biểu thức hoặc viết lại điều kiện thành một khoảng; <strong>ký tự đại diện ở đầu</strong> (<code>LIKE \'%phone\'</code>) — cần chỉ mục trigram; <strong>sai thứ tự cột</strong> trong chỉ mục ghép — (customer_id, created_at) giúp "WHERE customer_id = ?" nhưng không giúp "WHERE created_at &gt; ?" đứng một mình; <strong>độ chọn lọc thấp</strong> — điều kiện khớp phần lớn bảng thì quét tuần tự thật sự rẻ hơn; và <strong>thống kê cũ</strong> — số dòng ước lượng lệch xa số dòng thật, sửa bằng <code>ANALYZE</code>.</p>',
    ],
    sau: [['In EXPLAIN output, what does a big gap between "rows" estimated and actual tell you?', 'What is a covering index?'], ['Trong output EXPLAIN, chênh lệch lớn giữa "rows" ước lượng và thực tế nói lên điều gì?', 'Covering index là gì?']],
    loi: ['Adding another index without reading the plan first.', 'Thêm một chỉ mục nữa mà chưa đọc kế hoạch thực thi.'],
  },
  {
    so: '4.2-3',
    q: ['Explain INNER, LEFT, RIGHT and FULL JOIN. What goes wrong in the second query below?', 'Giải thích INNER, LEFT, RIGHT và FULL JOIN. Truy vấn thứ hai bên dưới sai ở đâu?'],
    chu: ['Whether you have written real reports — this exact bug is everywhere.', 'Bạn đã từng viết báo cáo thật chưa — đúng lỗi này có ở khắp nơi.'],
    a: [
      '<p><strong>INNER</strong> keeps only pairs that match on both sides. <strong>LEFT</strong> keeps every row of the left table, with NULLs where the right side has no match; <strong>RIGHT</strong> is the mirror; <strong>FULL</strong> keeps unmatched rows from both sides.</p><p>In the second query the condition <code>o.status = \'PAID\'</code> is in WHERE. For customers with no orders, <code>o.status</code> is NULL, the condition is not true, and the row is removed — the LEFT JOIN silently became an INNER JOIN and customers with zero paid orders disappear from the report. Conditions on the right-hand table belong in the <code>ON</code> clause (first query). Also note <code>COUNT(o.id)</code>, not <code>COUNT(*)</code>, so a customer with no orders counts 0 instead of 1.</p>',
      '<p><strong>INNER</strong> chỉ giữ những cặp khớp ở cả hai phía. <strong>LEFT</strong> giữ mọi dòng của bảng trái, điền NULL chỗ bảng phải không có dòng khớp; <strong>RIGHT</strong> là ảnh gương; <strong>FULL</strong> giữ dòng không khớp của cả hai phía.</p><p>Ở truy vấn thứ hai, điều kiện <code>o.status = \'PAID\'</code> nằm trong WHERE. Với khách chưa có đơn, <code>o.status</code> là NULL, điều kiện không đúng, và dòng bị loại — LEFT JOIN âm thầm biến thành INNER JOIN, khách có 0 đơn đã thanh toán biến khỏi báo cáo. Điều kiện trên bảng bên phải phải đặt trong mệnh đề <code>ON</code> (truy vấn đầu). Để ý thêm <code>COUNT(o.id)</code>, không phải <code>COUNT(*)</code>, để khách không có đơn đếm ra 0 chứ không phải 1.</p>',
    ],
    sau: [['WHERE vs HAVING?', 'Why can a JOIN make SUM() too large, and how do you avoid it?'], ['WHERE khác HAVING thế nào?', 'Vì sao một JOIN có thể làm SUM() lớn quá, và tránh thế nào?']],
    loi: ['Drawing Venn diagrams but missing the NULL behaviour, which is the whole point.', 'Vẽ biểu đồ Venn nhưng bỏ sót cách NULL hoạt động — đó mới là trọng tâm.'],
  },
  {
    so: '4.2-4',
    q: ['What is a transaction? Explain ACID in plain words.', 'Giao dịch (transaction) là gì? Giải thích ACID bằng lời thường.'],
    chu: ['Whether ACID means something to you beyond four words.', 'ACID với bạn có ý nghĩa gì ngoài bốn chữ không.'],
    a: [
      '<p>A transaction groups several statements into one unit: all of them happen or none do. Classic example: moving money — subtract from A and add to B must never half-happen.</p><ul><li><strong>Atomicity</strong> — all or nothing; an error rolls everything back.</li><li><strong>Consistency</strong> — constraints (foreign keys, CHECK, UNIQUE) hold before and after.</li><li><strong>Isolation</strong> — concurrent transactions do not see each other’s half-done work, to a degree set by the isolation level.</li><li><strong>Durability</strong> — once COMMIT returns, the data survives a crash (PostgreSQL writes the WAL to disk first).</li></ul><p>In application code: keep transactions <strong>short</strong>, never wait for an external API call or user input inside one, and put the whole business operation — not each statement — inside it.</p>',
      '<p>Giao dịch gộp nhiều câu lệnh thành một đơn vị: hoặc tất cả xảy ra, hoặc không gì cả. Ví dụ kinh điển: chuyển tiền — trừ của A và cộng cho B không bao giờ được xảy ra một nửa.</p><ul><li><strong>Atomicity (nguyên tử)</strong> — tất cả hoặc không; lỗi thì quay lui hết.</li><li><strong>Consistency (nhất quán)</strong> — ràng buộc (khoá ngoại, CHECK, UNIQUE) đúng cả trước và sau.</li><li><strong>Isolation (cô lập)</strong> — giao dịch chạy đồng thời không thấy phần làm dở của nhau, ở mức do isolation level quy định.</li><li><strong>Durability (bền vững)</strong> — COMMIT trả về rồi thì dữ liệu sống sót qua sự cố (PostgreSQL ghi WAL xuống đĩa trước).</li></ul><p>Trong mã ứng dụng: giữ giao dịch <strong>ngắn</strong>, không bao giờ chờ gọi API bên ngoài hay chờ người dùng bên trong một giao dịch, và đặt cả nghiệp vụ — không phải từng câu lệnh — vào trong nó.</p>',
    ],
    sau: [['What is the default isolation level in PostgreSQL, and which anomaly can still happen there?', 'Why is calling a payment API inside a transaction a bad idea?'], ['Isolation level mặc định của PostgreSQL là gì, và dị thường nào vẫn có thể xảy ra ở đó?', 'Vì sao gọi API thanh toán bên trong giao dịch là ý tồi?']],
    loi: ['Reciting the four words with textbook definitions and no example.', 'Đọc bốn chữ kèm định nghĩa sách giáo khoa mà không có ví dụ.'],
  },
  {
    so: '4.2-5',
    q: ['Two users book the last available device at the same moment. How do you prevent double booking?', 'Hai người cùng đặt chiếc máy cuối cùng đúng một lúc. Làm sao chặn đặt trùng?'],
    chu: ['Concurrency thinking — the "to score points" question. It fits a lab-booking capstone perfectly.', 'Tư duy đồng thời — câu "ghi điểm". Nó khớp hoàn hảo với đồ án mượn thiết bị phòng lab.'],
    a: [
      '<p>Reading the count, checking it in code and then writing is a <strong>race</strong>: both requests read "1 available", both write. Three correct options, from simplest:</p><ol><li><strong>Atomic conditional update</strong> — let the database do the check and the write in one statement (<code>WHERE available &gt; 0</code>); zero rows updated means it was taken → return 409.</li><li><strong>Pessimistic lock</strong> — <code>SELECT … FOR UPDATE</code> inside a transaction; the second request waits until the first commits, then sees the new value.</li><li><strong>Optimistic lock</strong> — a <code>version</code> column; update only if the version is unchanged, otherwise re-read and retry. Good when conflicts are rare.</li></ol><p>And a <strong>UNIQUE constraint</strong> as the last line of defence where the rule can be expressed as one (one active booking per device per time slot). In my capstone, LabFlow AI, device borrowing is exactly this problem.</p>',
      '<p>Đọc số lượng, kiểm trong mã rồi mới ghi là một <strong>race</strong> (cuộc đua): cả hai request cùng đọc "còn 1", cả hai cùng ghi. Ba cách đúng, từ đơn giản nhất:</p><ol><li><strong>Cập nhật nguyên tử có điều kiện</strong> — để CSDL vừa kiểm vừa ghi trong một câu lệnh (<code>WHERE available &gt; 0</code>); cập nhật 0 dòng nghĩa là đã hết → trả 409.</li><li><strong>Khoá bi quan</strong> — <code>SELECT … FOR UPDATE</code> trong một giao dịch; request thứ hai chờ tới khi cái đầu commit, rồi thấy giá trị mới.</li><li><strong>Khoá lạc quan</strong> — một cột <code>version</code>; chỉ cập nhật nếu version chưa đổi, không thì đọc lại và thử lại. Hợp khi xung đột hiếm.</li></ol><p>Và một <strong>ràng buộc UNIQUE</strong> làm tuyến phòng thủ cuối khi luật diễn đạt được như thế (mỗi thiết bị một lượt mượn đang hiệu lực trong một khung giờ). Trong đồ án của em, LabFlow AI, việc mượn thiết bị đúng là bài toán này.</p>',
    ],
    sau: [['What is a deadlock and how do you avoid one?', 'Why not just use SERIALIZABLE everywhere?'], ['Deadlock là gì và tránh thế nào?', 'Sao không dùng SERIALIZABLE ở mọi chỗ cho xong?']],
    loi: ['"Check availability in the code first, then insert" — that is the race itself.', '"Kiểm còn hàng trong mã trước rồi mới insert" — đó chính là cuộc đua.'],
  },
  {
    so: '4.2-6',
    q: ['What is the N+1 query problem? How do you spot and fix it with an ORM?', 'Vấn đề truy vấn N+1 là gì? Nhận ra và sửa thế nào khi dùng ORM?'],
    chu: ['Whether you know what your ORM sends to the database.', 'Bạn có biết ORM của mình gửi gì xuống CSDL không.'],
    a: [
      '<p>You load a list of N posts with one query, then — in a loop, often hidden inside a serializer or a lazy relation — load each post’s author with one more query: N+1 round trips. With 50 posts that is 51 queries; each is fast, but the total latency adds up and the database connection pool fills.</p><p><strong>Spot it:</strong> turn on query logging in development and count queries per request. <strong>Fix it:</strong> load the relation in the same request — Prisma <code>include</code>/<code>select</code> (one extra query with <code>IN (...)</code>), JPA <code>JOIN FETCH</code> or an entity graph — or batch with a DataLoader. Then re-count.</p>',
      '<p>Bạn tải danh sách N bài viết bằng một truy vấn, rồi — trong một vòng lặp, thường giấu trong serializer hay quan hệ lazy — tải tác giả của từng bài bằng thêm một truy vấn nữa: N+1 lượt đi-về. Với 50 bài là 51 truy vấn; từng cái thì nhanh, nhưng tổng độ trễ cộng dồn và pool kết nối CSDL bị đầy.</p><p><strong>Nhận ra:</strong> bật log truy vấn khi dev và đếm số truy vấn mỗi request. <strong>Sửa:</strong> nạp quan hệ trong cùng request — Prisma <code>include</code>/<code>select</code> (thêm đúng một truy vấn với <code>IN (...)</code>), JPA <code>JOIN FETCH</code> hoặc entity graph — hoặc gom lô bằng DataLoader. Rồi đếm lại.</p>',
    ],
    sau: [['Is a JOIN always better than two queries?', 'Why does lazy loading make N+1 easy to write by accident?'], ['JOIN có luôn tốt hơn hai truy vấn không?', 'Vì sao lazy loading làm N+1 dễ vô tình viết ra?']],
    loi: ['Knowing the name but never having measured it — say how you counted.', 'Biết tên nhưng chưa từng đo — hãy nói bạn đã đếm bằng cách nào.'],
  },
  {
    so: '4.2-7',
    q: ['What is normalization? When would you denormalize?', 'Chuẩn hoá là gì? Khi nào thì phi chuẩn hoá?'],
    chu: ['Design sense — not reciting 1NF/2NF/3NF definitions.', 'Óc thiết kế — không phải đọc thuộc định nghĩa 1NF/2NF/3NF.'],
    a: [
      '<p>Normalization means storing each fact in exactly one place, so an update cannot leave two copies disagreeing. Roughly: 1NF — atomic values, no repeating groups; 2NF — no column depends on only part of a composite key; 3NF — no column depends on another non-key column (a customer’s city belongs in the customer table, not copied into every order).</p><p><strong>Denormalize</strong> deliberately when reads dominate and the copy is cheap to keep correct: a <code>comment_count</code> on posts updated in the same transaction, a snapshot of the price on an order line (which <em>should</em> not change when the product price changes later), or a materialized view for a report. Always say how the copy stays correct.</p>',
      '<p>Chuẩn hoá nghĩa là lưu mỗi sự thật ở đúng một chỗ, để một lần cập nhật không thể để lại hai bản sao mâu thuẫn. Đại khái: 1NF — giá trị nguyên tử, không nhóm lặp; 2NF — không cột nào chỉ phụ thuộc một phần của khoá ghép; 3NF — không cột nào phụ thuộc một cột không-khoá khác (thành phố của khách thuộc về bảng khách, không chép vào từng đơn hàng).</p><p><strong>Phi chuẩn hoá</strong> có chủ đích khi đọc chiếm ưu thế và bản sao dễ giữ đúng: một cột <code>comment_count</code> trên bài viết được cập nhật trong cùng giao dịch, ảnh chụp giá trên dòng đơn hàng (thứ <em>không được</em> đổi khi giá sản phẩm đổi sau này), hay một materialized view cho báo cáo. Luôn nói rõ bản sao được giữ đúng bằng cách nào.</p>',
    ],
    sau: [['Why is copying the price into the order line not a normalization mistake?', 'Where would you put JSONB in a relational design?'], ['Vì sao chép giá vào dòng đơn hàng không phải lỗi chuẩn hoá?', 'Bạn đặt JSONB ở đâu trong một thiết kế quan hệ?']],
    loi: ['Treating denormalization as always wrong — real systems do it on purpose.', 'Coi phi chuẩn hoá luôn là sai — hệ thống thật làm nó có chủ đích.'],
  },
  {
    so: '4.2-8',
    q: ['How do you change the schema of a production database safely?', 'Bạn thay đổi lược đồ của một CSDL production an toàn thế nào?'],
    chu: ['Production maturity — interns who can answer this stand out.', 'Độ chín về production — intern trả lời được câu này rất nổi bật.'],
    a: [
      '<p>Through <strong>migrations</strong>: versioned SQL files in the repository, applied in order by a tool (Prisma Migrate, Flyway, Liquibase) and recorded in a history table, so every environment has the same schema. Rules: never edit a migration that is already deployed — add a new one; make changes backward-compatible (add a nullable column, deploy code that writes it, backfill, then add NOT NULL) so old and new code can run during the switch; and test the migration on a copy of real data.</p><p><strong>From my project:</strong> <code>prisma migrate dev</code> cannot replay our history on a shadow database because an old, already-deployed migration reuses a constraint name — and deployed migrations must not be edited. So we hand-write the SQL for each new migration, apply it with <code>prisma migrate deploy</code>, and verify with <code>prisma migrate diff</code> that the schema has no drift. Another lesson: renaming an enum value passed every type check but broke the seed script on production, because the seed had its own copy of the enum and was excluded from type checking; we added a separate type-check for the seed.</p>',
      '<p>Bằng <strong>migration</strong>: các tệp SQL có đánh phiên bản trong repo, được một công cụ (Prisma Migrate, Flyway, Liquibase) áp theo thứ tự và ghi vào bảng lịch sử, để mọi môi trường có cùng một lược đồ. Luật: không bao giờ sửa migration đã deploy — thêm migration mới; thay đổi phải tương thích ngược (thêm cột cho phép NULL, deploy mã ghi vào nó, điền dữ liệu cũ, rồi mới thêm NOT NULL) để mã cũ và mã mới cùng chạy được trong lúc chuyển; và thử migration trên bản sao dữ liệu thật.</p><p><strong>Từ dự án của em:</strong> <code>prisma migrate dev</code> không phát lại được lịch sử trên shadow database vì một migration cũ, đã deploy, dùng trùng tên ràng buộc — mà migration đã deploy thì không được sửa. Nên bọn em viết tay SQL cho mỗi migration mới, áp bằng <code>prisma migrate deploy</code>, và kiểm bằng <code>prisma migrate diff</code> rằng lược đồ không lệch. Một bài học khác: đổi tên một giá trị enum qua sạch mọi bước kiểm kiểu nhưng làm vỡ script seed trên production, vì seed tự chép lại enum và bị loại khỏi bước kiểm kiểu; bọn em thêm một bước kiểm kiểu riêng cho seed.</p>',
    ],
    sau: [['How would you rename a column without downtime?', 'What do you do if a migration fails halfway on production?'], ['Đổi tên một cột mà không dừng dịch vụ thế nào?', 'Một migration hỏng giữa chừng trên production thì bạn làm gì?']],
    loi: ['"I just change the table in pgAdmin." That is exactly how environments drift apart.', '"Em sửa bảng trực tiếp trong pgAdmin." Đó đúng là cách các môi trường lệch nhau.'],
  },
];

const L42 = {
  title: '4.2 — Database and SQL questions: indexes, joins, transactions, concurrency, migrations|||4.2 — Câu hỏi cơ sở dữ liệu và SQL: chỉ mục, join, giao dịch, đồng thời, migration',
  slug: 'pv-4-2-sql',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám câu SQL/PostgreSQL hay gặp ở vòng backend: chỉ mục và cái giá của nó, vì sao chỉ mục không được dùng, JOIN và cái bẫy LEFT JOIN + WHERE, ACID, chặn đặt trùng khi hai người cùng đặt, N+1, chuẩn hoá và phi chuẩn hoá, đổi lược đồ production an toàn — kèm mã SQL và chuyện thật từ dự án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Database and SQL questions — what they ask, and what a deep answer sounds like</h2>
<p class="lead">Almost every backend interview has a database part, and for interns it is often the deciding one: the interviewer can tell in two questions whether you have only written SELECT * in a lab, or have watched a real query get slow. This lesson covers the eight questions that appear most, with SQL you can run on any PostgreSQL.</p>
${doiThuong('en', 'A database is a library. The table is the shelves, the index is the catalogue at the entrance, a transaction is borrowing three books at the desk — either the librarian stamps all three or none — and the "last copy" problem is two students reaching for the same book at the same second. Every question below is one of these scenes.')}
${khungTraLoi('en')}
<h3>Indexes</h3>
${ma('sql', SQL_INDEX)}
${qs('en', QSQL.slice(0, 2))}
<h3>Joins</h3>
${ma('sql', SQL_JOIN)}
${qs('en', QSQL.slice(2, 3))}
<h3>Transactions and concurrency</h3>
${qs('en', QSQL.slice(3, 4))}
${ma('sql', SQL_KHOA)}
${qs('en', QSQL.slice(4, 5))}
<h3>ORM, design and change</h3>
${qs('en', QSQL.slice(5))}
<h3>Isolation levels on one page</h3>
${bang(['Level', 'Prevents', 'Still possible', 'Note'], [
  ['READ COMMITTED', 'dirty reads', 'non-repeatable reads, phantoms, lost updates in read-then-write code', 'PostgreSQL default'],
  ['REPEATABLE READ', '+ non-repeatable reads (and phantoms in PostgreSQL)', 'write skew', 'one snapshot for the whole transaction'],
  ['SERIALIZABLE', 'all anomalies', 'nothing — but transactions may fail and must be retried', 'needs retry logic in the app'],
])}
${bay('en', 'answering "use a transaction" to the double-booking question.', 'A transaction at the default READ COMMITTED level does not stop two transactions from both reading "1 available" and both writing. You need the atomic conditional update, a row lock, a version check or a constraint. Interviewers ask this exact follow-up because so many candidates stop at "transaction".')}
${keXau('en', 'SQL injection is still the classic: string-concatenating user input into SQL lets an attacker change the query (<code>\' OR 1=1 --</code>). Always use parameterised queries — Prisma, JPA and every driver do this when you use their placeholders — and never build ORDER BY or table names from raw input; map them through an allow-list.')}
${thucHanh('en', { phut: '40–50', steps: [
  'In a local PostgreSQL (Docker: <code>docker run --rm -e POSTGRES_PASSWORD=pw -p 15432:5432 postgres:17</code>), create an <code>orders</code> table, insert 200,000 rows with <code>generate_series</code>, and run the slow query from the example with EXPLAIN ANALYZE before and after the index.',
  'Reproduce the LEFT JOIN bug: three customers, one without orders. Show that the WHERE version loses them and the ON version keeps them.',
  'Open two psql sessions and reproduce the double booking with a read-then-write, then fix it with the atomic UPDATE.',
  'Answer 4.2-1, 4.2-5 and 4.2-8 out loud, recorded, under two minutes each.',
], dat: 'you have your own before/after EXPLAIN numbers, a reproduction of the JOIN bug and of the race, and three recordings that each include an example from your projects.' })}
${thuatNgu('en', [
  ['Index (B-tree)', 'A sorted structure that lets the database jump to matching rows instead of scanning all.'],
  ['Sequential scan', 'Reading every row of the table.'],
  ['Selectivity', 'How small a fraction of rows a condition matches; low selectivity makes indexes useless.'],
  ['Transaction / ACID', 'An all-or-nothing unit of work; atomic, consistent, isolated, durable.'],
  ['Isolation level', 'How much concurrent transactions may see of each other.'],
  ['Race condition', 'A bug that depends on the timing of two operations.'],
  ['N+1 problem', 'One query for a list plus one query per item.'],
  ['Migration', 'A versioned, ordered change to the database schema kept in the repository.'],
])}
${tomTat('en', [
  'An index trades slower writes and more space for fast reads; prove it is used with EXPLAIN ANALYZE.',
  'Functions on columns, leading wildcards, wrong composite order and low selectivity make indexes useless.',
  'Conditions on the right table of a LEFT JOIN go in ON, not WHERE.',
  'A transaction alone does not stop double booking — use an atomic conditional update, a lock, a version or a constraint.',
  'Count queries per request to catch N+1; fix with include/JOIN FETCH or batching.',
  'Change production schemas only through versioned, backward-compatible migrations; never edit a deployed one.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', L: 'en', title: 'PostgreSQL 9.1 — What an index is', sub: 'B-tree, sequential vs index scan — measured.' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-3-muc-co-lap', L: 'en', title: 'PostgreSQL 11.3 — Isolation levels and the anomalies they stop', sub: 'The table above, reproduced with two sessions.' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-10-1-doc-explain', L: 'en', title: 'PostgreSQL 10.1 — Reading a plan', sub: 'EXPLAIN vs EXPLAIN ANALYZE, line by line.' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-7-4-quan-he-va-n-plus-1', L: 'en', title: 'Node.js 7.4 — Relations, and the N+1 problem measured', sub: 'Question 4.2-6 with Prisma.' }),
  yt('YuRO9-rOgv4', 'kudvenkat', 'How do SQL Indexes Work', 12, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Câu hỏi cơ sở dữ liệu và SQL — họ hỏi gì, và một câu trả lời sâu nghe ra sao</h2>
<p class="lead">Gần như buổi phỏng vấn backend nào cũng có phần cơ sở dữ liệu, và với intern nó thường là phần quyết định: chỉ qua hai câu, người phỏng vấn biết bạn mới chỉ viết SELECT * trong giờ lab, hay đã từng nhìn một truy vấn thật chậm dần. Bài này đi qua tám câu hay gặp nhất, kèm SQL chạy được trên bất kỳ PostgreSQL nào.</p>
${doiThuong('vi', 'Cơ sở dữ liệu là một thư viện. Bảng là các kệ sách, chỉ mục là tủ phiếu tra cứu ở cửa, giao dịch là mượn ba cuốn ở quầy — thủ thư đóng dấu cả ba hoặc không cuốn nào — còn bài toán "cuốn cuối cùng" là hai sinh viên cùng với tay lấy một cuốn trong cùng một giây. Mỗi câu hỏi dưới đây là một trong những cảnh đó.')}
${khungTraLoi('vi')}
<h3>Chỉ mục</h3>
${ma('sql', SQL_INDEX)}
${qs('vi', QSQL.slice(0, 2))}
<h3>Join</h3>
${ma('sql', SQL_JOIN)}
${qs('vi', QSQL.slice(2, 3))}
<h3>Giao dịch và đồng thời</h3>
${qs('vi', QSQL.slice(3, 4))}
${ma('sql', SQL_KHOA)}
${qs('vi', QSQL.slice(4, 5))}
<h3>ORM, thiết kế và thay đổi</h3>
${qs('vi', QSQL.slice(5))}
<h3>Các mức cô lập trên một trang</h3>
${bang(['Mức', 'Chặn được', 'Vẫn có thể xảy ra', 'Ghi chú'], [
  ['READ COMMITTED', 'đọc bẩn (dirty read)', 'đọc không lặp lại, bóng ma (phantom), mất cập nhật trong mã đọc-rồi-ghi', 'mặc định của PostgreSQL'],
  ['REPEATABLE READ', '+ đọc không lặp lại (và phantom trong PostgreSQL)', 'write skew (lệch ghi)', 'một ảnh chụp cho cả giao dịch'],
  ['SERIALIZABLE', 'mọi dị thường', 'không gì — nhưng giao dịch có thể bị huỷ và phải thử lại', 'ứng dụng cần logic thử lại'],
])}
${bay('vi', 'trả lời "dùng transaction" cho câu đặt trùng.', 'Một giao dịch ở mức mặc định READ COMMITTED KHÔNG chặn được hai giao dịch cùng đọc "còn 1" rồi cùng ghi. Bạn cần cập nhật nguyên tử có điều kiện, khoá dòng, kiểm version hoặc một ràng buộc. Người phỏng vấn hỏi đúng câu đào sâu này vì rất nhiều ứng viên dừng ở chữ "transaction".')}
${keXau('vi', 'SQL injection vẫn là kinh điển: nối chuỗi đầu vào của người dùng vào SQL cho phép kẻ tấn công đổi luôn câu truy vấn (<code>\' OR 1=1 --</code>). Luôn dùng truy vấn tham số hoá — Prisma, JPA và mọi driver đều làm vậy khi bạn dùng chỗ giữ chỗ của chúng — và không bao giờ dựng ORDER BY hay tên bảng từ đầu vào thô; ánh xạ chúng qua một danh sách cho phép.')}
${thucHanh('vi', { phut: '40–50', steps: [
  'Trên PostgreSQL cục bộ (Docker: <code>docker run --rm -e POSTGRES_PASSWORD=pw -p 15432:5432 postgres:17</code>), tạo bảng <code>orders</code>, chèn 200.000 dòng bằng <code>generate_series</code>, và chạy truy vấn chậm trong ví dụ với EXPLAIN ANALYZE trước và sau khi tạo chỉ mục.',
  'Tái hiện lỗi LEFT JOIN: ba khách, một khách chưa có đơn. Cho thấy bản WHERE làm mất họ còn bản ON giữ lại.',
  'Mở hai phiên psql và tái hiện đặt trùng bằng kiểu đọc-rồi-ghi, rồi sửa bằng UPDATE nguyên tử.',
  'Trả lời thành tiếng câu 4.2-1, 4.2-5 và 4.2-8, có ghi âm, mỗi câu dưới hai phút.',
], dat: 'bạn có số đo EXPLAIN trước/sau của chính mình, bản tái hiện lỗi JOIN và lỗi race, và ba bản ghi âm mỗi bản có một ví dụ từ dự án của bạn.' })}
${thuatNgu('vi', [
  ['Index / B-tree (chỉ mục / cây B)', 'Cấu trúc đã sắp xếp cho CSDL nhảy thẳng tới dòng khớp thay vì quét hết.'],
  ['Sequential scan (quét tuần tự)', 'Đọc mọi dòng của bảng.'],
  ['Selectivity (độ chọn lọc)', 'Tỉ lệ dòng mà một điều kiện khớp; chọn lọc thấp làm chỉ mục vô dụng.'],
  ['Transaction / ACID (giao dịch)', 'Một đơn vị công việc tất-cả-hoặc-không; nguyên tử, nhất quán, cô lập, bền vững.'],
  ['Isolation level (mức cô lập)', 'Các giao dịch đồng thời được thấy nhau tới mức nào.'],
  ['Race condition (tình trạng đua)', 'Lỗi phụ thuộc vào thời điểm của hai thao tác.'],
  ['N+1 problem', 'Một truy vấn lấy danh sách cộng một truy vấn cho mỗi phần tử.'],
  ['Migration (di trú lược đồ)', 'Một thay đổi lược đồ có phiên bản, có thứ tự, lưu trong repo.'],
])}
${tomTat('vi', [
  'Chỉ mục đổi ghi chậm hơn và tốn chỗ hơn lấy đọc nhanh; chứng minh nó được dùng bằng EXPLAIN ANALYZE.',
  'Hàm bọc cột, ký tự đại diện ở đầu, sai thứ tự chỉ mục ghép và độ chọn lọc thấp làm chỉ mục vô dụng.',
  'Điều kiện trên bảng bên phải của LEFT JOIN đặt ở ON, không ở WHERE.',
  'Chỉ một giao dịch không chặn được đặt trùng — dùng cập nhật nguyên tử có điều kiện, khoá, version hoặc ràng buộc.',
  'Đếm truy vấn mỗi request để bắt N+1; sửa bằng include/JOIN FETCH hoặc gom lô.',
  'Chỉ đổi lược đồ production qua migration có phiên bản, tương thích ngược; không bao giờ sửa migration đã deploy.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', title: 'PostgreSQL 9.1 — Chỉ mục là gì', sub: 'B-tree, quét tuần tự với quét chỉ mục — có số đo.' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-3-muc-co-lap', title: 'PostgreSQL 11.3 — Các mức cô lập và dị thường chúng chặn', sub: 'Bảng ở trên, tái hiện bằng hai phiên.' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-10-1-doc-explain', title: 'PostgreSQL 10.1 — Đọc một kế hoạch thực thi', sub: 'EXPLAIN với EXPLAIN ANALYZE, từng dòng.' }),
  lienKet({ khoa: 'introduction-to-databases', bai: 'dbi202-chuan-hoa-vi-du', academy: true, title: 'Academy · DBI202 4.4 — Chuẩn hoá một bảng từ 1NF tới BCNF', sub: 'Phần lý thuyết ở trường cho câu 4.2-7 — đi làm thì cần thêm góc phi chuẩn hoá trong bài này.' }),
  yt('YuRO9-rOgv4', 'kudvenkat', 'How do SQL Indexes Work', 12),
])}
</div>
`,
};

/* ═══════════════════════ 4.3 — API và bảo mật ═══════════════════════ */
const API_CURL = `
# Chẩn đoán "route này có thật sự được gắn trên server đang chạy không?" bằng mã trạng thái
curl -s -o /dev/null -w "%{http_code}" https://example.com/api/v1/gifs/trending
# 401 ⇒ route CÓ (chỉ là cần đăng nhập)   200 ⇒ route CÓ, công khai
# 404 ⇒ route KHÔNG có trên bản đang chạy ⇒ nghi bản build cũ / deploy dở
`;

const API_BOLA = `
// SAI: chỉ kiểm "đã đăng nhập", không kiểm "của ai"
router.get('/bookings/:id', requireAuth, async (req, res) => {
  const b = await prisma.booking.findUnique({ where: { id: Number(req.params.id) } });
  res.json(b);   // đổi id trên URL là đọc được đơn của người khác (BOLA / IDOR)
});

// ĐÚNG: điều kiện sở hữu nằm ngay trong truy vấn
router.get('/bookings/:id', requireAuth, async (req, res) => {
  const b = await prisma.booking.findFirst({ where: { id: Number(req.params.id), userId: req.user.id } });
  if (!b) return res.status(404).json({ error: 'NOT_FOUND' });   // 404, không tiết lộ là đơn có tồn tại
  res.json(b);
});
`;

const QAPI = [
  {
    so: '4.3-1',
    q: ['What makes an API "RESTful"? PUT vs PATCH vs POST?', 'Thế nào thì một API là "RESTful"? PUT, PATCH và POST khác nhau thế nào?'],
    chu: ['Whether you design with resources and HTTP semantics, or with verbs in URLs.', 'Bạn thiết kế theo tài nguyên và ngữ nghĩa HTTP, hay nhét động từ vào URL.'],
    a: [
      '<p>REST models the system as <strong>resources</strong> identified by URLs (<code>/devices/7/bookings</code>), manipulated with the standard HTTP <strong>methods</strong>, with <strong>stateless</strong> requests (each carries everything needed, such as the token) and meaningful <strong>status codes</strong>. Nouns in the path, verbs in the method: <code>POST /bookings</code>, not <code>/createBooking</code>.</p><p>GET reads and is <em>safe</em> (no side effects). <strong>PUT</strong> replaces the whole resource and is <em>idempotent</em> — sending it twice gives the same state. <strong>PATCH</strong> changes some fields. <strong>POST</strong> creates or triggers an action and is <em>not</em> idempotent — sending it twice may create two bookings, which is why payments need idempotency keys. DELETE is idempotent: deleting twice leaves the same state.</p>',
      '<p>REST mô hình hoá hệ thống thành các <strong>tài nguyên</strong> định danh bằng URL (<code>/devices/7/bookings</code>), thao tác bằng các <strong>phương thức</strong> HTTP chuẩn, với request <strong>phi trạng thái</strong> (mỗi request mang đủ mọi thứ cần, ví dụ token) và <strong>mã trạng thái</strong> có nghĩa. Danh từ ở đường dẫn, động từ ở phương thức: <code>POST /bookings</code>, không phải <code>/createBooking</code>.</p><p>GET để đọc và là <em>safe</em> (an toàn — không tác dụng phụ). <strong>PUT</strong> thay toàn bộ tài nguyên và là <em>idempotent</em> (luỹ đẳng) — gửi hai lần cho cùng một trạng thái. <strong>PATCH</strong> sửa vài trường. <strong>POST</strong> tạo mới hoặc kích hoạt một hành động và <em>không</em> luỹ đẳng — gửi hai lần có thể tạo hai lượt đặt, vì vậy thanh toán cần idempotency key. DELETE luỹ đẳng: xoá hai lần vẫn để lại cùng một trạng thái.</p>',
    ],
    sau: [['Is PATCH idempotent?', 'How would you design "approve a booking" — PATCH status or POST /bookings/15/approve?'], ['PATCH có luỹ đẳng không?', 'Bạn thiết kế "duyệt một lượt đặt" thế nào — PATCH status hay POST /bookings/15/approve?']],
    loi: ['Defining REST as "an API that returns JSON".', 'Định nghĩa REST là "API trả về JSON".'],
  },
  {
    so: '4.3-2',
    q: ['Which status codes do you use, and what is the difference between 401 and 403, 400 and 422, 502 and 504?', 'Bạn dùng những mã trạng thái nào, và 401 khác 403, 400 khác 422, 502 khác 504 thế nào?'],
    chu: ['Precision, and whether you have used status codes to debug.', 'Độ chính xác, và bạn đã từng dùng mã trạng thái để gỡ lỗi chưa.'],
    a: [
      '<p>201 Created after POST, 204 No Content after a delete, 400 for malformed input, 422 for well-formed input that breaks a rule (some teams use 400 for both — be consistent), <strong>401 = who are you?</strong> (not authenticated or token expired), <strong>403 = I know who you are, and you may not</strong>, 404 not found (also used to hide resources the user may not see), 409 conflict (the device was just booked), 429 too many requests, 500 a bug on our side. <strong>502</strong> means a proxy got a bad or no answer from the upstream server (the app crashed or is restarting); <strong>504</strong> means the proxy waited and the upstream did not answer in time.</p><p>I also use them to diagnose: after a deploy, an unauthenticated <code>curl</code> to a protected route should return 401 — that proves the route exists. A 404 means the running build does not have the route at all, which in my project once revealed a stale build being served.</p>',
      '<p>201 Created sau POST, 204 No Content sau khi xoá, 400 cho đầu vào sai định dạng, 422 cho đầu vào đúng định dạng nhưng phạm luật (có đội dùng 400 cho cả hai — miễn nhất quán), <strong>401 = bạn là ai?</strong> (chưa xác thực hoặc token hết hạn), <strong>403 = tôi biết bạn là ai, và bạn không được phép</strong>, 404 không tìm thấy (cũng dùng để giấu tài nguyên người dùng không được thấy), 409 xung đột (máy vừa bị người khác đặt), 429 quá nhiều request, 500 là lỗi phía mình. <strong>502</strong> nghĩa là proxy nhận được câu trả lời hỏng hoặc không nhận được gì từ server phía sau (ứng dụng sập hoặc đang khởi động lại); <strong>504</strong> nghĩa là proxy đã chờ mà server phía sau không trả lời kịp.</p><p>Em còn dùng chúng để chẩn đoán: sau deploy, gọi <code>curl</code> không đăng nhập vào một route cần xác thực phải ra 401 — chứng tỏ route có tồn tại. Ra 404 nghĩa là bản đang chạy không hề có route đó; trong dự án của em, chính điều này từng lộ ra server đang chạy một bản build cũ.</p>',
    ],
    sau: [['Should "wrong password" return 401 or 400?', 'Why might you return 404 instead of 403 for someone else’s booking?'], ['"Sai mật khẩu" nên trả 401 hay 400?', 'Vì sao có thể trả 404 thay vì 403 cho đơn đặt của người khác?']],
    loi: ['Returning 200 with <code>{ "success": false }</code> for every error — clients, caches and monitoring can no longer tell failures apart.', 'Trả 200 kèm <code>{ "success": false }</code> cho mọi lỗi — client, cache và giám sát không còn phân biệt được lỗi gì.'],
  },
  {
    so: '4.3-3',
    q: ['Sessions or JWT? Where should the browser keep the token?', 'Session hay JWT? Trình duyệt nên giữ token ở đâu?'],
    chu: ['Whether you understand the trade-off rather than the fashion.', 'Bạn hiểu sự đánh đổi chứ không chạy theo mốt.'],
    a: [
      '<p>A <strong>server session</strong> stores the login state on the server (database or Redis); the browser holds only a random id in a cookie. Easy to revoke (delete the row), but every request looks up the store. A <strong>JWT</strong> is a signed token that carries the user id and expiry; the server verifies the signature without a lookup, which suits several services — but you cannot easily revoke it before it expires, so access tokens are kept short-lived and paired with a revocable refresh token.</p><p><strong>Where to keep it:</strong> an <code>HttpOnly; Secure; SameSite</code> cookie cannot be read by JavaScript, so an XSS bug cannot steal it; you then need CSRF protection (SameSite plus a token for sensitive actions). <code>localStorage</code> is readable by any script on the page — one XSS and the token is gone. For a typical web app, an HttpOnly cookie is the safer default.</p>',
      '<p><strong>Session phía server</strong> lưu trạng thái đăng nhập trên server (CSDL hoặc Redis); trình duyệt chỉ giữ một id ngẫu nhiên trong cookie. Dễ thu hồi (xoá dòng), nhưng mỗi request phải tra kho. <strong>JWT</strong> là một token có chữ ký, mang id người dùng và hạn dùng; server kiểm chữ ký mà không cần tra cứu, hợp với nhiều dịch vụ — nhưng khó thu hồi trước khi hết hạn, nên access token để sống ngắn và đi kèm một refresh token thu hồi được.</p><p><strong>Giữ ở đâu:</strong> cookie <code>HttpOnly; Secure; SameSite</code> thì JavaScript không đọc được, nên một lỗi XSS không lấy cắp được nó; khi đó bạn cần chống CSRF (SameSite cộng token cho thao tác nhạy cảm). <code>localStorage</code> thì mọi script trên trang đều đọc được — một lỗi XSS là mất token. Với web app thông thường, cookie HttpOnly là lựa chọn mặc định an toàn hơn.</p>',
    ],
    sau: [['How do you log a user out everywhere with JWT?', 'What does SameSite=Lax actually block?'], ['Đăng xuất người dùng khỏi mọi thiết bị khi dùng JWT thế nào?', 'SameSite=Lax thật ra chặn được gì?']],
    loi: ['"JWT is more secure than sessions." Neither is more secure by itself; the storage and revocation decide.', '"JWT an toàn hơn session." Không cái nào tự nó an toàn hơn; cách lưu và cách thu hồi mới quyết định.'],
  },
  {
    so: '4.3-4',
    q: ['Why access and refresh tokens? Tell me about a bug you had with authentication.', 'Vì sao có access token và refresh token? Kể một lỗi bạn từng gặp với xác thực.'],
    chu: ['Real experience — the question is half technical, half behavioural.', 'Kinh nghiệm thật — câu này nửa kỹ thuật, nửa hành vi.'],
    a: [
      '<p>The <strong>access token</strong> is short-lived (minutes) and sent with every request, so if it leaks the damage window is small. The <strong>refresh token</strong> lives longer, is sent only to the refresh endpoint, is stored server-side so it can be revoked, and is <em>rotated</em> on each use — if an old one is reused, that signals theft and the whole family is revoked.</p><p><strong>My bug:</strong> users of my web platform were silently logged out after 24 hours. The JWT expired at 24h but the cookie lived 7 days, and the refresh route the frontend called did not exist on the backend — so every call returned 401 while the cookie was still there. I added a real <code>POST /auth/refresh</code> that verifies the old token and re-checks the account, and an HTTP-client interceptor that, on a 401, refreshes <em>once</em> and retries the request. Sessions now heal themselves. The lesson: token lifetime, cookie lifetime and the refresh path must be designed together.</p>',
      '<p><strong>Access token</strong> sống ngắn (vài phút) và đi kèm mọi request, nên nếu lộ thì khoảng thiệt hại nhỏ. <strong>Refresh token</strong> sống lâu hơn, chỉ gửi tới endpoint làm mới, được lưu phía server để thu hồi được, và được <em>xoay vòng</em> mỗi lần dùng — nếu một token cũ bị dùng lại, đó là dấu hiệu bị trộm và cả "họ" token bị thu hồi.</p><p><strong>Lỗi của em:</strong> người dùng nền tảng web của em bị đăng xuất âm thầm sau 24 giờ. JWT hết hạn lúc 24 giờ nhưng cookie sống 7 ngày, và route làm mới mà frontend gọi lại không tồn tại ở backend — nên mọi lời gọi trả 401 trong khi cookie vẫn còn đó. Em thêm một <code>POST /auth/refresh</code> thật, kiểm token cũ và kiểm lại tài khoản, cùng một interceptor ở HTTP client: gặp 401 thì làm mới <em>một lần</em> rồi gửi lại request. Phiên giờ tự lành. Bài học: thời hạn token, thời hạn cookie và đường làm mới phải được thiết kế cùng nhau.</p>',
    ],
    sau: [['Why refresh only once and not in a loop?', 'Two tabs refresh at the same moment — what can go wrong?'], ['Vì sao chỉ làm mới một lần mà không lặp?', 'Hai tab cùng làm mới một lúc thì có thể hỏng gì?']],
    loi: ['Telling the story without the lesson — the interviewer wants to hear what you changed so it cannot happen again.', 'Kể chuyện mà thiếu bài học — người phỏng vấn muốn nghe bạn đã thay đổi gì để nó không lặp lại.'],
  },
  {
    so: '4.3-5',
    q: ['Authentication vs authorization. What is BOLA (IDOR), and how do you prevent it?', 'Xác thực khác phân quyền thế nào? BOLA (IDOR) là gì, và chặn ra sao?'],
    chu: ['The number-one API vulnerability. Interns who answer it well are rare.', 'Lỗ hổng API số một. Intern trả lời tốt câu này rất hiếm.'],
    a: [
      '<p><strong>Authentication</strong> answers "who are you?"; <strong>authorization</strong> answers "may you do this, to this object?". <strong>BOLA</strong> (Broken Object Level Authorization, also called IDOR) is when the API checks that you are logged in but not that the object is yours: change <code>/bookings/15</code> to <code>/bookings/16</code> and read someone else’s booking. It is number one in the OWASP API Security Top 10 (2023).</p><p>Prevention: put the ownership condition <strong>in the query itself</strong> (<code>where: { id, userId }</code>), centralise authorization in one place so it cannot be forgotten on a new route, and write tests that log in as user A and try user B’s ids. A case from my project, caught during a review: an upload "complete" endpoint accepted a storage key that belonged to another user; a cleanup job could then have deleted that user’s file. The fix was an ownership check returning 403 before writing anything.</p>',
      '<p><strong>Xác thực</strong> trả lời "bạn là ai?"; <strong>phân quyền</strong> trả lời "bạn có được làm việc này, với đối tượng này không?". <strong>BOLA</strong> (Broken Object Level Authorization — phân quyền cấp đối tượng bị hỏng, còn gọi là IDOR) là khi API kiểm bạn đã đăng nhập mà không kiểm đối tượng có phải của bạn: đổi <code>/bookings/15</code> thành <code>/bookings/16</code> là đọc được đơn của người khác. Nó đứng số một trong OWASP API Security Top 10 (2023).</p><p>Cách chặn: đặt điều kiện sở hữu <strong>ngay trong truy vấn</strong> (<code>where: { id, userId }</code>), gom việc phân quyền về một chỗ để không thể quên ở route mới, và viết test đăng nhập bằng người A rồi thử id của người B. Một trường hợp trong dự án của em, bắt được khi rà soát: endpoint "hoàn tất tải lên" chấp nhận một khoá lưu trữ thuộc về người dùng khác; một job dọn dẹp sau đó có thể đã xoá tệp của người kia. Cách sửa là kiểm quyền sở hữu, trả 403 trước khi ghi bất cứ thứ gì.</p>',
    ],
    sau: [['Why are sequential ids not the real problem?', 'How would you test authorization automatically?'], ['Vì sao id tăng dần không phải là vấn đề thật?', 'Bạn kiểm thử phân quyền tự động thế nào?']],
    loi: ['"Use UUIDs so nobody can guess ids." Hard-to-guess ids slow attackers down but do not replace the ownership check.', '"Dùng UUID để không ai đoán được id." Id khó đoán chỉ làm chậm kẻ tấn công, không thay được việc kiểm sở hữu.'],
  },
  {
    so: '4.3-6',
    q: ['How should passwords be stored?', 'Mật khẩu nên được lưu thế nào?'],
    chu: ['A basic security reflex.', 'Một phản xạ bảo mật cơ bản.'],
    a: [
      '<p>Never in plain text and never with reversible encryption or a fast hash like MD5/SHA-256. Use a <strong>slow, salted password hash</strong>: argon2id or bcrypt (scrypt is also fine). The salt is random per user, so identical passwords produce different hashes and precomputed tables are useless; the cost factor makes each guess slow for an attacker who has stolen the database. Login compares with the library’s verify function. Also: rate-limit login, give the same error for "no such user" and "wrong password", and support a second factor.</p>',
      '<p>Không bao giờ ở dạng rõ, không bao giờ bằng mã hoá đảo ngược được hay hàm băm nhanh như MD5/SHA-256. Dùng <strong>hàm băm mật khẩu chậm, có salt</strong>: argon2id hoặc bcrypt (scrypt cũng được). Salt ngẫu nhiên cho từng người, nên hai mật khẩu giống nhau ra hai mã băm khác nhau và bảng tính sẵn trở nên vô dụng; hệ số chi phí làm mỗi lần đoán chậm đi với kẻ đã lấy được CSDL. Khi đăng nhập thì so bằng hàm verify của thư viện. Thêm nữa: giới hạn tần suất đăng nhập, trả cùng một thông báo cho "không có người dùng này" và "sai mật khẩu", và hỗ trợ yếu tố thứ hai.</p>',
    ],
    sau: [['Why is SHA-256 a bad password hash when it is a good hash?', 'What is credential stuffing?'], ['Vì sao SHA-256 là hàm băm tốt nhưng lại là hàm băm mật khẩu tồi?', 'Credential stuffing là gì?']],
    loi: ['"I encrypt passwords." Encryption can be reversed with the key; hashing is one-way.', '"Em mã hoá mật khẩu." Mã hoá đảo ngược được nếu có khoá; băm là một chiều.'],
  },
  {
    so: '4.3-7',
    q: ['A mobile client retries a POST /payments after a timeout, and the user is charged twice. How do you design against this?', 'Client di động gửi lại POST /payments sau khi timeout, và người dùng bị trừ tiền hai lần. Thiết kế thế nào để chặn?'],
    chu: ['Reliability thinking — a "to score points" question.', 'Tư duy độ tin cậy — câu "ghi điểm".'],
    a: [
      '<p>The first request succeeded but the response was lost, so the client cannot tell. Make the POST <strong>idempotent</strong> with an <strong>idempotency key</strong>: the client generates a unique key per user action and sends it in a header; the server stores the key with the result (unique constraint) and, if the same key arrives again, returns the stored result instead of charging again. Combine with timeouts and retries with backoff on the client, and a unique constraint in the database as a last guard.</p>',
      '<p>Request đầu đã thành công nhưng response bị mất, nên client không biết. Hãy làm POST <strong>luỹ đẳng</strong> bằng một <strong>idempotency key</strong>: client sinh một khoá duy nhất cho mỗi thao tác của người dùng và gửi trong header; server lưu khoá cùng kết quả (ràng buộc unique) và, nếu cùng khoá tới lần nữa, trả lại kết quả đã lưu thay vì trừ tiền lần hai. Kết hợp với timeout và thử lại có giãn cách ở client, và một ràng buộc unique trong CSDL làm chốt cuối.</p>',
    ],
    sau: [['What should happen if the second request arrives while the first is still processing?', 'How long do you keep idempotency keys?'], ['Nếu request thứ hai tới khi request đầu còn đang xử lý thì sao?', 'Giữ idempotency key bao lâu?']],
    loi: ['"Disable the button after the first click." Helpful for UX, useless against network retries.', '"Khoá nút sau lần bấm đầu." Có ích cho trải nghiệm, vô dụng trước việc mạng tự gửi lại.'],
  },
  {
    so: '4.3-8',
    q: ['What is CORS, and does it protect your API?', 'CORS là gì, và nó có bảo vệ API của bạn không?'],
    chu: ['A classic misconception check.', 'Câu kiểm một hiểu nhầm kinh điển.'],
    a: [
      '<p>CORS is a <strong>browser</strong> rule: by default a page from origin A cannot read responses from origin B; the server at B can relax that with headers such as <code>Access-Control-Allow-Origin</code>, and for non-simple requests the browser first sends a preflight <code>OPTIONS</code>. It protects <em>users’ browsers</em> from malicious pages reading data with their cookies. It does <strong>not</strong> protect your API from curl, Postman or a server — those ignore CORS. Authentication and authorization protect the API. Never answer an origin with <code>*</code> while also allowing credentials.</p>',
      '<p>CORS là luật của <strong>trình duyệt</strong>: mặc định một trang từ origin A không đọc được response từ origin B; server ở B có thể nới luật bằng header như <code>Access-Control-Allow-Origin</code>, và với request không "đơn giản", trình duyệt gửi trước một preflight <code>OPTIONS</code>. Nó bảo vệ <em>trình duyệt của người dùng</em> khỏi trang độc đọc dữ liệu bằng cookie của họ. Nó <strong>không</strong> bảo vệ API của bạn khỏi curl, Postman hay một server khác — mấy thứ đó bỏ qua CORS. Xác thực và phân quyền mới bảo vệ API. Đừng bao giờ trả origin <code>*</code> trong khi vẫn cho phép gửi kèm credentials.</p>',
    ],
    sau: [['Why does Postman work when the browser shows a CORS error?', 'What is a preflight request?'], ['Vì sao Postman chạy được trong khi trình duyệt báo lỗi CORS?', 'Preflight request là gì?']],
    loi: ['"CORS blocks hackers from calling my API."', '"CORS chặn hacker gọi API của em."'],
  },
  {
    so: '4.3-9',
    q: ['Name some items of the OWASP Top 10 and how your project handles them.', 'Kể vài mục trong OWASP Top 10 và dự án của bạn xử lý chúng thế nào.'],
    chu: ['Security awareness applied to your own code, not a memorised list.', 'Ý thức bảo mật áp vào chính mã của bạn, không phải danh sách học thuộc.'],
    a: [
      '<p>Pick three you can connect to your project. <strong>Broken access control</strong> (first in the 2021 list) — ownership checks in queries, one central permission function. <strong>Injection</strong> — parameterised queries through the ORM, schema validation of every input. <strong>Security misconfiguration / vulnerable components</strong> — no stack traces to clients, secrets only in environment files outside the repository, dependency updates and audit. Add one thing you actually did, for example rate limiting on login, or storing tokens in HttpOnly cookies.</p>',
      '<p>Chọn ba mục bạn nối được với dự án của mình. <strong>Broken access control</strong> (phân quyền hỏng — đứng đầu bản 2021) — kiểm sở hữu trong truy vấn, một hàm phân quyền tập trung. <strong>Injection</strong> — truy vấn tham số hoá qua ORM, kiểm mọi đầu vào bằng schema. <strong>Cấu hình sai / thành phần có lỗ hổng</strong> — không gửi stack trace cho client, bí mật chỉ nằm trong tệp môi trường ngoài repo, cập nhật và audit thư viện. Thêm một việc bạn thật sự đã làm, ví dụ giới hạn tần suất đăng nhập, hay lưu token trong cookie HttpOnly.</p>',
    ],
    sau: [['What is SSRF?', 'How do you keep secrets out of Git, and what if one leaks?'], ['SSRF là gì?', 'Giữ bí mật khỏi Git thế nào, và lỡ lộ thì làm gì?']],
    loi: ['Listing ten names with no connection to anything you built.', 'Liệt kê mười cái tên mà không nối được với thứ gì bạn đã làm.'],
  },
];

const L43 = {
  title: '4.3 — API design and security questions: REST, status codes, auth, BOLA, CORS|||4.3 — Câu hỏi thiết kế API và bảo mật: REST, mã trạng thái, xác thực, BOLA, CORS',
  slug: 'pv-4-3-api',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chín câu hỏi API và bảo mật hay gặp: REST và PUT/PATCH/POST, mã trạng thái (401/403, 502/504) và dùng chúng để chẩn đoán, session hay JWT, access/refresh token kèm lỗi thật "đăng xuất sau 24 giờ", BOLA kèm lỗi thật ở endpoint tải lên, lưu mật khẩu, idempotency key, CORS, OWASP Top 10.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>API design and security questions</h2>
<p class="lead">An API is the contract your backend signs with every client, and security is the part of that contract attackers read most carefully. Interviewers use this topic to find out two things: whether you design with HTTP rather than against it, and whether you have the reflex to ask "whose data is this?" on every endpoint.</p>
${doiThuong('en', 'An API is the counter of a bank. Authentication is showing your ID card at the counter; authorization is the clerk checking that the account you ask about is yours; a status code is the clerk’s short answer ("done", "not yours", "come back later"); an idempotency key is the numbered ticket that stops the clerk from paying the same cheque twice when you ask again.')}
${khungTraLoi('en')}
<h3>Design</h3>
${qs('en', QAPI.slice(0, 2))}
${ma('bash', API_CURL)}
<h3>Authentication</h3>
${qs('en', QAPI.slice(2, 4))}
<h3>Authorization</h3>
${ma('js', API_BOLA)}
${qs('en', QAPI.slice(4, 5))}
<h3>Security reflexes</h3>
${qs('en', QAPI.slice(5))}
${bay('en', 'stopping at "authenticated".', 'Most real API breaches are not about broken login; they are about a logged-in user reaching an object that is not theirs. In every endpoint you describe in an interview, say where the ownership check happens. It costs one sentence and puts you above most candidates.')}
${keXau('en', 'Attackers enumerate ids (/orders/1, /orders/2, …), replay requests with an old token, brute-force login with leaked password lists (credential stuffing), and read error messages for hints ("user not found" tells them which emails exist). Each has a matching defence in this lesson: ownership in the query, short-lived rotated tokens, rate limits and second factors, uniform error messages.')}
${thucHanh('en', { phut: '40–50', steps: [
  'Take one endpoint from your own project that returns a single object by id. Write down where the ownership check is. If there is none, write the fixed query.',
  'With curl, call three routes of your API without logging in. Write down the status codes and what each proves (401 = mounted and protected, 404 = missing).',
  'Draw the refresh-token flow of your project on paper: lifetimes of the access token, the refresh token and the cookie. Find one way it could fail.',
  'Answer 4.3-2, 4.3-4 and 4.3-5 out loud, recorded, each with an example from your own code.',
], dat: 'you can point at the ownership check in your own code (or have fixed it), you have three curl results interpreted correctly, and your recordings use your own examples.' })}
${thuatNgu('en', [
  ['Resource', 'A thing the API exposes, addressed by a URL.'],
  ['Idempotent', 'Doing it twice leaves the same state as doing it once.'],
  ['Authentication / authorization', 'Who you are / what you may do to which object.'],
  ['BOLA / IDOR', 'Accessing another user’s object by changing its id in the request.'],
  ['Access / refresh token', 'Short-lived proof sent with every request / longer-lived credential used only to get new access tokens.'],
  ['HttpOnly cookie', 'A cookie that page scripts cannot read.'],
  ['CORS', 'A browser rule about which origins may read responses.'],
  ['Idempotency key', 'A unique key per client action so a retried POST is processed once.'],
])}
${tomTat('en', [
  'Resources in URLs, verbs in HTTP methods; know which methods are safe and idempotent.',
  'Use precise status codes — and use them to diagnose (401 proves a route exists, 404 suggests a stale build).',
  'Sessions vs JWT is a trade-off of revocation vs lookups; HttpOnly cookies beat localStorage for tokens.',
  'Design token lifetime, cookie lifetime and refresh together; refresh once on 401, then retry.',
  'Every object endpoint needs an ownership check in the query — BOLA is the top API risk.',
  'Hash passwords with argon2id/bcrypt; make payments idempotent; CORS protects browsers, not your API.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'api-design', bai: 'api-1-3-status', L: 'en', title: 'API Design 1.3 — Status codes that mean something', sub: '201, 400 vs 422, 401 vs 403, 404 vs 410 — in depth.' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', L: 'en', title: 'API Design 6.2 — Authorisation and object-level access (BOLA)', sub: 'Exploit, fix, and an access matrix.' }),
  lienKet({ khoa: 'api-design', bai: 'api-5-1-idempotency', L: 'en', title: 'API Design 5.1 — Idempotency keys for POST', sub: 'A lost response, measured and fixed.' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', L: 'en', title: 'Node.js 8.2 — JWT, refresh tokens and rotation', sub: 'Question 4.3-4 built step by step.' }),
  yt('faMdrSCVDzc', 'Aced (formerly Exponent)', 'REST API Interview Questions (Beginner Level)', 7, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Câu hỏi thiết kế API và bảo mật</h2>
<p class="lead">API là bản hợp đồng backend ký với mọi client, và bảo mật là phần của hợp đồng đó mà kẻ tấn công đọc kỹ nhất. Người phỏng vấn dùng chủ đề này để tìm ra hai điều: bạn thiết kế thuận theo HTTP hay chống lại nó, và bạn có phản xạ hỏi "dữ liệu này của ai?" ở mọi endpoint không.</p>
${doiThuong('vi', 'API là quầy giao dịch của ngân hàng. Xác thực là đưa căn cước ở quầy; phân quyền là nhân viên kiểm xem tài khoản bạn hỏi có phải của bạn không; mã trạng thái là câu trả lời ngắn của nhân viên ("xong rồi", "không phải của anh", "lát quay lại"); idempotency key là tờ phiếu có số thứ tự giúp nhân viên không chi cùng một tấm séc hai lần khi bạn hỏi lại.')}
${khungTraLoi('vi')}
<h3>Thiết kế</h3>
${qs('vi', QAPI.slice(0, 2))}
${ma('bash', API_CURL)}
<h3>Xác thực</h3>
${qs('vi', QAPI.slice(2, 4))}
<h3>Phân quyền</h3>
${ma('js', API_BOLA)}
${qs('vi', QAPI.slice(4, 5))}
<h3>Phản xạ bảo mật</h3>
${qs('vi', QAPI.slice(5))}
${bay('vi', 'dừng ở chữ "đã xác thực".', 'Phần lớn vụ lộ dữ liệu API thật không phải do đăng nhập hỏng; mà do một người đã đăng nhập với tới đối tượng không phải của mình. Ở mọi endpoint bạn mô tả trong buổi phỏng vấn, hãy nói việc kiểm sở hữu nằm ở đâu. Tốn một câu, và đưa bạn lên trên phần lớn ứng viên.')}
${keXau('vi', 'Kẻ tấn công dò id (/orders/1, /orders/2, …), phát lại request bằng token cũ, dò mật khẩu đăng nhập bằng danh sách mật khẩu bị lộ (credential stuffing — nhồi thông tin đăng nhập), và đọc thông báo lỗi để tìm gợi ý ("không tìm thấy người dùng" cho họ biết email nào tồn tại). Mỗi đòn có một cách phòng tương ứng trong bài: kiểm sở hữu trong truy vấn, token sống ngắn có xoay vòng, giới hạn tần suất và yếu tố thứ hai, thông báo lỗi thống nhất.')}
${thucHanh('vi', { phut: '40–50', steps: [
  'Lấy một endpoint trong dự án của bạn trả về một đối tượng theo id. Ghi ra việc kiểm sở hữu nằm ở đâu. Nếu không có, viết lại truy vấn đã sửa.',
  'Dùng curl gọi ba route của API mà không đăng nhập. Ghi mã trạng thái và mỗi mã chứng minh điều gì (401 = route có và được bảo vệ, 404 = không có).',
  'Vẽ ra giấy luồng refresh token của dự án: thời hạn của access token, refresh token và cookie. Tìm một cách nó có thể hỏng.',
  'Trả lời thành tiếng câu 4.3-2, 4.3-4 và 4.3-5, có ghi âm, mỗi câu kèm một ví dụ từ mã của chính bạn.',
], dat: 'bạn chỉ được vào chỗ kiểm sở hữu trong mã của mình (hoặc đã sửa), có ba kết quả curl giải thích đúng, và bản ghi âm dùng ví dụ của chính bạn.' })}
${thuatNgu('vi', [
  ['Resource (tài nguyên)', 'Một thứ API phơi ra, định danh bằng URL.'],
  ['Idempotent (luỹ đẳng)', 'Làm hai lần để lại cùng trạng thái như làm một lần.'],
  ['Authentication / authorization (xác thực / phân quyền)', 'Bạn là ai / bạn được làm gì với đối tượng nào.'],
  ['BOLA / IDOR', 'Truy cập đối tượng của người khác bằng cách đổi id trong request.'],
  ['Access / refresh token', 'Bằng chứng sống ngắn gửi kèm mọi request / thông tin sống lâu hơn chỉ dùng để lấy access token mới.'],
  ['HttpOnly cookie', 'Cookie mà script trên trang không đọc được.'],
  ['CORS', 'Luật của trình duyệt về việc origin nào được đọc response.'],
  ['Idempotency key', 'Khoá duy nhất cho mỗi thao tác của client để POST bị gửi lại chỉ được xử lý một lần.'],
])}
${tomTat('vi', [
  'Tài nguyên ở URL, động từ ở phương thức HTTP; biết phương thức nào an toàn và luỹ đẳng.',
  'Dùng mã trạng thái chính xác — và dùng chúng để chẩn đoán (401 chứng minh route tồn tại, 404 gợi ý bản build cũ).',
  'Session hay JWT là đánh đổi giữa thu hồi và tra cứu; cookie HttpOnly hơn localStorage khi giữ token.',
  'Thiết kế thời hạn token, thời hạn cookie và đường làm mới cùng nhau; gặp 401 thì làm mới một lần rồi gửi lại.',
  'Mọi endpoint theo đối tượng cần kiểm sở hữu trong truy vấn — BOLA là rủi ro API số một.',
  'Băm mật khẩu bằng argon2id/bcrypt; làm thanh toán luỹ đẳng; CORS bảo vệ trình duyệt, không bảo vệ API của bạn.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'api-design', bai: 'api-1-3-status', title: 'API Design 1.3 — Mã trạng thái có ý nghĩa', sub: '201, 400 với 422, 401 với 403, 404 với 410 — đi sâu.' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'API Design 6.2 — Phân quyền và truy cập cấp đối tượng (BOLA)', sub: 'Khai thác, vá, và ma trận quyền.' }),
  lienKet({ khoa: 'api-design', bai: 'api-6-3-owasp-api', title: 'API Design 6.3 — OWASP API Security Top 10 (2023) trên LabFlow', sub: 'Cả danh sách, thành một bản kiểm tự động.' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Node.js 8.2 — JWT, refresh token và xoay vòng', sub: 'Câu 4.3-4 dựng từng bước.' }),
  yt('faMdrSCVDzc', 'Aced (formerly Exponent)', 'REST API Interview Questions (Beginner Level)', 7),
])}
</div>
`,
};

/* ═══════════════════════ 4.4 — Testing ═══════════════════════ */
const TEST_UNIT = `
// Hàm thuần: tính phí trả trễ thiết bị (LabFlow) — dễ test nhất
export function phiTre(soNgayTre) {
  if (soNgayTre < 0) throw new RangeError('soNgayTre >= 0');
  if (soNgayTre === 0) return 0;
  return Math.min(soNgayTre * 10000, 200000);   // 10k/ngày, trần 200k
}

import { describe, it, expect } from 'vitest';
describe('phiTre', () => {
  it('không trễ thì không phí', () => expect(phiTre(0)).toBe(0));
  it('trễ 1 ngày = 10.000', () => expect(phiTre(1)).toBe(10000));
  it('chạm trần ở ngày 20', () => expect(phiTre(20)).toBe(200000));
  it('quá trần vẫn là 200.000', () => expect(phiTre(21)).toBe(200000));
  it('số âm là lỗi', () => expect(() => phiTre(-1)).toThrow(RangeError));
});
`;

const TEST_API = `
import request from 'supertest';
import { app } from '../src/app.js';

it('người B KHÔNG đọc được lượt mượn của người A', async () => {
  const tokenA = await dangNhap('a@test.local');
  const tokenB = await dangNhap('b@test.local');
  const tao = await request(app).post('/bookings').set('Authorization', 'Bearer ' + tokenA).send({ deviceId: 7 });
  expect(tao.status).toBe(201);

  const doc = await request(app).get('/bookings/' + tao.body.id).set('Authorization', 'Bearer ' + tokenB);
  expect(doc.status).toBe(404);   // không lộ cả việc đơn đó tồn tại
});
`;

const QTEST = [
  {
    so: '4.4-1',
    q: ['Unit, integration and end-to-end tests — what is the difference, and what is the test pyramid?', 'Unit test, integration test và end-to-end test khác nhau thế nào, kim tự tháp test là gì?'],
    chu: ['Vocabulary plus judgement about where tests pay off.', 'Từ vựng, cộng với óc phán đoán test ở đâu thì đáng.'],
    a: [
      '<p>A <strong>unit test</strong> checks one small piece — a function or class — in isolation, in milliseconds. An <strong>integration test</strong> checks pieces working together with real dependencies — the API route plus a real database. An <strong>end-to-end test</strong> drives the whole system like a user, through a browser (Playwright, Cypress). The <strong>pyramid</strong> says: many fast unit tests at the base, fewer integration tests, very few slow and brittle E2E tests at the top. Many teams today argue for a "trophy" with more integration tests, because those catch the bugs that actually happen between the code and the database. The point is cost versus confidence, not the exact shape.</p>',
      '<p><strong>Unit test</strong> kiểm một mẩu nhỏ — một hàm hay một lớp — tách riêng, chạy trong vài mili giây. <strong>Integration test</strong> kiểm các mẩu chạy cùng nhau với phụ thuộc thật — route API cộng một CSDL thật. <strong>End-to-end test</strong> điều khiển cả hệ thống như người dùng, qua trình duyệt (Playwright, Cypress). <strong>Kim tự tháp</strong> nói: đáy là nhiều unit test nhanh, giữa ít integration test hơn, đỉnh là rất ít E2E chậm và dễ gãy. Nhiều đội ngày nay ủng hộ hình "chiếc cúp" với nhiều integration test hơn, vì chúng bắt đúng những lỗi thật hay xảy ra giữa mã và CSDL. Trọng tâm là chi phí so với độ tin cậy, không phải hình dáng chính xác.</p>',
    ],
    sau: [['Which kind of test would have caught a missing ownership check?', 'Why are E2E tests flaky more often?'], ['Loại test nào sẽ bắt được việc thiếu kiểm sở hữu?', 'Vì sao E2E hay chập chờn hơn?']],
    loi: ['Giving definitions but no example of a test you wrote.', 'Đưa định nghĩa mà không có ví dụ một test bạn đã viết.'],
  },
  {
    so: '4.4-2',
    q: ['Walk me through how you would unit-test this function.', 'Nói qua cách bạn unit test hàm này.'],
    chu: ['Test design — partitions and boundaries, which your SWT301 course taught.', 'Thiết kế test — phân hoạch và giá trị biên, thứ môn SWT301 đã dạy.'],
    a: [
      '<p>I split the inputs into <strong>equivalence partitions</strong> — negative (error), zero (no fee), normal (fee per day), above the cap (capped) — and test the <strong>boundaries</strong> between them: −1, 0, 1, 20, 21. Each test follows <strong>Arrange–Act–Assert</strong>, checks one behaviour, and its name says the rule in plain words, so a failure reads like a bug report. Because the function is pure — no database, no clock — it needs no mocks at all. That is also a design point: keep business rules in pure functions so they are cheap to test.</p>',
      '<p>Em chia đầu vào thành các <strong>lớp tương đương</strong> — số âm (lỗi), bằng 0 (không phí), bình thường (phí theo ngày), vượt trần (bị chặn trần) — và test các <strong>giá trị biên</strong> giữa chúng: −1, 0, 1, 20, 21. Mỗi test theo <strong>Arrange–Act–Assert</strong> (chuẩn bị – thực hiện – khẳng định), kiểm một hành vi, và tên nói ra luật bằng lời thường, nên khi hỏng nó đọc như một báo cáo lỗi. Vì hàm là hàm thuần — không CSDL, không đồng hồ — nó không cần mock nào. Đó cũng là một điểm thiết kế: giữ luật nghiệp vụ trong hàm thuần để test rẻ.</p>',
    ],
    sau: [['What if the fee depended on today’s date?', 'How many tests is enough?'], ['Nếu phí phụ thuộc vào ngày hôm nay thì sao?', 'Bao nhiêu test là đủ?']],
    loi: ['Testing only the happy path with one random value.', 'Chỉ test đường suôn sẻ với một giá trị ngẫu nhiên.'],
  },
  {
    so: '4.4-3',
    q: ['Mock, stub, spy, fake — what are they, and what should you NOT mock?', 'Mock, stub, spy, fake là gì, và cái gì KHÔNG nên mock?'],
    chu: ['Whether your tests test the code or just the mocks.', 'Test của bạn test mã, hay chỉ test cái mock.'],
    a: [
      '<p>All are <strong>test doubles</strong>. A <em>stub</em> returns canned answers; a <em>mock</em> also verifies it was called in a certain way; a <em>spy</em> wraps a real function and records calls; a <em>fake</em> is a working lightweight implementation (an in-memory repository, a local storage server). Mock what is slow, non-deterministic or external: the clock, random numbers, an email or payment provider, a third-party API. Avoid mocking what you own and what the bug is likely to be in — especially the database: a mocked query "passes" even when the real SQL is wrong. Too many mocks make tests that break on harmless refactors and stay green on real bugs.</p>',
      '<p>Tất cả đều là <strong>test double</strong> (vật thay thế khi test). <em>Stub</em> trả về câu trả lời soạn sẵn; <em>mock</em> còn kiểm nó được gọi theo một cách nhất định; <em>spy</em> bọc một hàm thật và ghi lại các lần gọi; <em>fake</em> là một bản cài đặt nhẹ chạy được (repository trong bộ nhớ, server lưu trữ cục bộ). Mock những thứ chậm, không tất định hoặc bên ngoài: đồng hồ, số ngẫu nhiên, nhà cung cấp email hay thanh toán, API bên thứ ba. Tránh mock thứ bạn sở hữu và thứ mà lỗi hay nằm trong đó — nhất là CSDL: một truy vấn bị mock vẫn "qua" kể cả khi SQL thật sai. Mock quá nhiều sinh ra test gãy khi refactor vô hại và vẫn xanh khi có lỗi thật.</p>',
    ],
    sau: [['How would you test code that sends email without sending email?', 'What is MSW?'], ['Test mã gửi email mà không gửi email thật thế nào?', 'MSW là gì?']],
    loi: ['"I mock everything so tests are fast."', '"Em mock hết cho test chạy nhanh."'],
  },
  {
    so: '4.4-4',
    q: ['How do you test code that talks to the database or to external services?', 'Bạn test mã nói chuyện với CSDL hoặc dịch vụ bên ngoài thế nào?'],
    chu: ['Practical integration testing, and safety around real services.', 'Integration test thực tế, và sự cẩn thận quanh dịch vụ thật.'],
    a: [
      '<p>For the database: a <strong>real</strong> PostgreSQL started for the tests — Docker Compose or Testcontainers — with migrations applied, and each test isolated by a transaction rolled back at the end or by truncating tables. For external services: a fake or sandbox, never production.</p><p><strong>From my project:</strong> the local environment file carried real cloud-storage keys, and test runs had been uploading junk into the production bucket — about a hundred files had to be cleaned by hand. We added a storage sandbox that switches on automatically whenever tests run, refuses to start if someone forces it off, and a tripwire that fails the whole test run if any connection to the real storage endpoint is opened. Same idea for email: outside production, mails are written to local files instead of being sent.</p>',
      '<p>Với CSDL: một PostgreSQL <strong>thật</strong> khởi động cho riêng việc test — Docker Compose hoặc Testcontainers — đã chạy migration, và mỗi test được cô lập bằng một giao dịch quay lui ở cuối hoặc bằng truncate bảng. Với dịch vụ bên ngoài: một bản giả hoặc sandbox, không bao giờ là production.</p><p><strong>Từ dự án của em:</strong> tệp môi trường ở máy local mang khoá thật của kho lưu trữ đám mây, và các lượt chạy test đã đẩy rác lên bucket production — khoảng một trăm tệp phải dọn tay. Bọn em thêm một sandbox lưu trữ tự bật mỗi khi chạy test, từ chối khởi động nếu ai đó ép tắt nó, và một dây bẫy làm đỏ cả lượt test nếu có bất kỳ kết nối nào tới endpoint lưu trữ thật. Cùng ý tưởng cho email: ngoài production, thư được ghi ra tệp cục bộ thay vì gửi thật.</p>',
    ],
    sau: [['Why roll back a transaction instead of deleting rows after each test?', 'What makes integration tests slow, and how do you speed them up?'], ['Vì sao quay lui giao dịch thay vì xoá dòng sau mỗi test?', 'Điều gì làm integration test chậm, và tăng tốc thế nào?']],
    loi: ['Running tests against the shared development or production database.', 'Chạy test vào CSDL dev dùng chung hoặc CSDL production.'],
  },
  {
    so: '4.4-5',
    q: ['Which tests would you write for this API endpoint?', 'Bạn sẽ viết những test nào cho endpoint API này?'],
    chu: ['Whether you think of the unhappy paths — that is where bugs live.', 'Bạn có nghĩ tới các đường không suôn sẻ không — lỗi sống ở đó.'],
    a: [
      '<p>For <code>GET /bookings/:id</code>: owner gets 200 with the right fields; no token gives 401; <strong>another user gets 404</strong> (the BOLA test); a non-existent id gives 404; an invalid id (<code>abc</code>) gives 400. For the POST: valid body 201; missing field 400/422; device already booked 409; and the same idempotency key twice creates one booking. I write these with supertest against the app object, with a real test database.</p>',
      '<p>Với <code>GET /bookings/:id</code>: chủ sở hữu nhận 200 với đúng các trường; không token nhận 401; <strong>người dùng khác nhận 404</strong> (test BOLA); id không tồn tại nhận 404; id sai dạng (<code>abc</code>) nhận 400. Với POST: body hợp lệ 201; thiếu trường 400/422; thiết bị đã bị đặt 409; và cùng một idempotency key gửi hai lần chỉ tạo một lượt đặt. Em viết bằng supertest gọi thẳng vào object app, với CSDL test thật.</p>',
    ],
    sau: [['Where do these tests run before code is merged?', 'How do you create the logged-in users quickly?'], ['Những test này chạy ở đâu trước khi mã được merge?', 'Tạo người dùng đã đăng nhập nhanh thế nào?']],
    loi: ['Listing only "it returns 200".', 'Chỉ liệt kê "nó trả 200".'],
  },
  {
    so: '4.4-6',
    q: ['Is 100% code coverage a good goal?', '100% độ phủ mã có phải mục tiêu tốt không?'],
    chu: ['Nuance — knowing what a metric does not measure.', 'Sự tinh tế — biết một số đo KHÔNG đo được gì.'],
    a: [
      '<p>Coverage tells you which lines ran during tests, not whether the tests <em>checked</em> anything. A test with no assertions can give 100%. It is useful to find untested code, and a floor (say 70–80% on business logic) can stop regressions, but chasing 100% leads to tests of getters and generated code. A stronger check is <strong>mutation testing</strong>: a tool changes your code slightly (<code>&gt;</code> into <code>&gt;=</code>) and sees whether some test fails; surviving mutants show weak tests.</p>',
      '<p>Độ phủ cho biết dòng nào đã chạy trong lúc test, không cho biết test có <em>kiểm</em> gì không. Một test không có assertion nào vẫn có thể cho 100%. Nó có ích để tìm mã chưa được test, và một mức sàn (ví dụ 70–80% trên logic nghiệp vụ) chặn được thụt lùi, nhưng chạy theo 100% dẫn tới test cả getter và mã sinh tự động. Một phép kiểm mạnh hơn là <strong>mutation testing</strong> (kiểm thử đột biến): công cụ sửa nhẹ mã của bạn (<code>&gt;</code> thành <code>&gt;=</code>) và xem có test nào hỏng không; "đột biến sống sót" chỉ ra test yếu.</p>',
    ],
    sau: [['What is a flaky test and how do you fix one?', 'Line coverage vs branch coverage?'], ['Flaky test là gì và sửa thế nào?', 'Line coverage khác branch coverage thế nào?']],
    loi: ['"Yes, more coverage means fewer bugs."', '"Có ạ, phủ càng nhiều càng ít lỗi."'],
  },
  {
    so: '4.4-7',
    q: ['A test passes locally and fails randomly in CI. What do you do?', 'Một test qua ở máy và hỏng ngẫu nhiên trên CI. Bạn làm gì?'],
    chu: ['Debugging method under uncertainty.', 'Phương pháp gỡ lỗi khi chưa chắc chắn.'],
    a: [
      '<p>Treat it as a real bug, not bad luck. Usual causes: <strong>time</strong> (tests depending on "now", time zones — CI runs in UTC while my laptop is UTC+7), <strong>order and shared state</strong> (one test leaves data another reads), <strong>concurrency</strong> (no await on an async call, a race), <strong>network or ports</strong>, and <strong>resource limits</strong> on the CI machine. Steps: rerun the single test many times, run the suite in random order, compare environment (Node version, time zone), add logs; then fix the cause — freeze time, isolate data, await properly. Quarantining a flaky test is a temporary measure with an owner and a date, never a permanent skip.</p>',
      '<p>Coi nó là lỗi thật, không phải xui. Nguyên nhân quen thuộc: <strong>thời gian</strong> (test phụ thuộc "bây giờ", múi giờ — CI chạy UTC còn laptop của em UTC+7), <strong>thứ tự và trạng thái dùng chung</strong> (test này để lại dữ liệu test kia đọc), <strong>đồng thời</strong> (thiếu await cho lời gọi bất đồng bộ, race), <strong>mạng hoặc cổng</strong>, và <strong>giới hạn tài nguyên</strong> của máy CI. Các bước: chạy lại riêng test đó nhiều lần, chạy cả bộ theo thứ tự ngẫu nhiên, so môi trường (phiên bản Node, múi giờ), thêm log; rồi sửa đúng nguyên nhân — đóng băng thời gian, cô lập dữ liệu, await đúng chỗ. Cách ly một test chập chờn là biện pháp tạm, có người chịu trách nhiệm và hạn chót, không bao giờ là bỏ qua vĩnh viễn.</p>',
    ],
    sau: [['How would you freeze time in a test?', 'What is the danger of retrying failed tests automatically?'], ['Đóng băng thời gian trong test thế nào?', 'Tự động chạy lại test hỏng có nguy hiểm gì?']],
    loi: ['"Just rerun the pipeline until it is green."', '"Chạy lại pipeline tới khi xanh là được."'],
  },
  {
    so: '4.4-8',
    q: ['Have you done TDD?', 'Bạn đã làm TDD chưa?'],
    chu: ['Honesty, plus whether you understand the idea.', 'Sự trung thực, cộng với hiểu ý tưởng không.'],
    a: [
      '<p>Answer truthfully. If not in a real project: "Not on a whole project. I understand the cycle — write a failing test (red), the smallest code to pass it (green), then clean up (refactor) — and I used it for small pure functions such as a fee calculation, where writing the boundary cases first helped me find a rule I had not thought of. On larger features I write tests right after the code, before opening the pull request." That is honest, shows understanding, and does not pretend.</p>',
      '<p>Trả lời thật. Nếu chưa làm trong dự án thật: "Chưa làm trên cả một dự án ạ. Em hiểu chu trình — viết một test hỏng (đỏ), viết đoạn mã nhỏ nhất cho nó qua (xanh), rồi dọn lại (refactor) — và em đã dùng cho các hàm thuần nhỏ như tính phí, chỗ mà viết các ca biên trước giúp em phát hiện một luật em chưa nghĩ tới. Với tính năng lớn hơn, em viết test ngay sau khi viết mã, trước khi mở pull request." Câu đó trung thực, cho thấy hiểu, và không giả vờ.</p>',
    ],
    sau: [['When is TDD a poor fit?'], ['Khi nào TDD không hợp?']],
    loi: ['Claiming "I always do TDD" and then not being able to describe the cycle.', 'Tự nhận "em luôn làm TDD" rồi không mô tả nổi chu trình.'],
  },
];

const L44 = {
  title: '4.4 — Testing questions: the pyramid, test design, mocks, coverage, flaky tests|||4.4 — Câu hỏi về testing: kim tự tháp, thiết kế test, mock, độ phủ, test chập chờn',
  slug: 'pv-4-4-testing',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám câu testing hay gặp ở vòng backend: unit/integration/E2E và kim tự tháp, thiết kế test bằng lớp tương đương và giá trị biên, mock cái gì và không mock cái gì, test với CSDL thật và chuyện "test đẩy rác lên bucket production", test cho một endpoint, độ phủ và mutation testing, test chập chờn trên CI, và trả lời trung thực về TDD.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Testing questions — showing you can prove your code works</h2>
<p class="lead">Interns are often asked about testing for a simple reason: in their first weeks, the safest useful work a company can give them is writing tests and fixing small bugs. If you can design good test cases and explain what not to mock, you look like someone who can contribute on day one. Your SWT301 course gave you the vocabulary; this lesson turns it into answers.</p>
${doiThuong('en', 'Testing code is like a restaurant kitchen tasting a dish before it goes out. A unit test is tasting the sauce alone; an integration test is tasting the sauce on the meat; an end-to-end test is a waiter eating the full plate at a table. You taste the sauce many times, the full plate a few times — and you never taste with plastic food (a mocked database) and call it done.')}
${khungTraLoi('en')}
${ma('js', TEST_UNIT)}
${qs('en', QTEST.slice(0, 3))}
${qs('en', QTEST.slice(3, 4))}
${ma('js', TEST_API)}
${qs('en', QTEST.slice(4))}
${bay('en', 'treating "all tests green" as proof.', 'Green tests prove only what they check. A suite with mocked database calls, no unhappy paths and no authorization tests can be 100% green while users read each other’s data. In interviews, talk about what your tests check, not how many there are.')}
${keXau('en', 'Tests are part of security: a test that logs in as user B and requests user A’s object is the cheapest way to make sure a BOLA bug never returns. Tests can also leak secrets — fixtures with real tokens, CI logs printing environment variables — so use fake credentials and masked secrets.')}
${thucHanh('en', { phut: '40–60', steps: [
  'Copy <code>phiTre</code> and its tests into a fresh folder (<code>npm init -y &amp;&amp; npm i -D vitest</code>), run <code>npx vitest run</code>, then change <code>Math.min</code> to <code>Math.max</code> and check that a test fails.',
  'Pick one function from your own project with a business rule. List its partitions and boundaries, and write 5 tests.',
  'For one endpoint of your project, write the list of cases from question 4.4-5 (owner, no token, other user, not found, invalid id).',
  'Answer 4.4-3 and 4.4-7 out loud, recorded.',
], dat: 'your five tests run green, the mutated version turns at least one red, and you have a written case list for a real endpoint.' })}
${thuatNgu('en', [
  ['Unit / integration / E2E test', 'One piece alone / pieces with real dependencies / the whole system as a user.'],
  ['Equivalence partition', 'A group of inputs the code should treat the same way.'],
  ['Boundary value', 'An input at the edge between two partitions — where off-by-one bugs live.'],
  ['Test double', 'Any stand-in for a real dependency: stub, mock, spy, fake.'],
  ['Arrange–Act–Assert', 'The three-part structure of a clear test.'],
  ['Code coverage', 'The share of code executed by tests — not the share verified.'],
  ['Mutation testing', 'Changing the code on purpose to see whether the tests notice.'],
  ['Flaky test', 'A test that passes and fails without any code change.'],
])}
${tomTat('en', [
  'Many fast unit tests, enough integration tests with a real database, a few E2E tests for key journeys.',
  'Design cases with partitions and boundaries; one behaviour per test; names that read like rules.',
  'Mock the clock, randomness and third parties — not your own database queries.',
  'Tests must never touch production services; sandboxes and tripwires make that automatic.',
  'Cover the unhappy paths of every endpoint, including another user’s id.',
  'Coverage is a floor, not proof; flaky tests are real bugs in the test or the code.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'testing', bai: 'tst-0-1-kim-tu-thap', L: 'en', title: 'Testing 0.2 — The test pyramid (and the trophy), measured', sub: 'Question 4.4-1 with numbers.' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-1-phan-loai', L: 'en', title: 'Testing 3.1 — Stub, mock, spy, fake', sub: 'Question 4.4-3 in depth.' }),
  lienKet({ khoa: 'testing', bai: 'tst-10-4-phong-van', L: 'en', title: 'Testing 10.4 — Testing interview questions', sub: 'More questions in the same style.' }),
  yt('YaXJeUkBe4Y', 'Alex Hyett', '5 Types of Testing Software Every Developer Needs to Know', 6, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Câu hỏi về testing — cho thấy bạn chứng minh được mã của mình chạy đúng</h2>
<p class="lead">Intern hay bị hỏi về testing vì một lý do đơn giản: trong mấy tuần đầu, việc hữu ích an toàn nhất công ty giao được là viết test và sửa lỗi nhỏ. Nếu bạn thiết kế được ca kiểm thử tốt và giải thích được cái gì không nên mock, bạn trông như người đóng góp được ngay từ ngày đầu. Môn SWT301 đã cho bạn từ vựng; bài này biến nó thành câu trả lời.</p>
${doiThuong('vi', 'Test mã giống bếp nhà hàng nếm món trước khi bưng ra. Unit test là nếm riêng nước sốt; integration test là nếm sốt rưới trên thịt; end-to-end test là một bồi bàn ngồi ăn cả đĩa ở bàn khách. Bạn nếm sốt nhiều lần, nếm cả đĩa vài lần — và không bao giờ nếm bằng đồ ăn nhựa (CSDL bị mock) rồi bảo là xong.')}
${khungTraLoi('vi')}
${ma('js', TEST_UNIT)}
${qs('vi', QTEST.slice(0, 3))}
${qs('vi', QTEST.slice(3, 4))}
${ma('js', TEST_API)}
${qs('vi', QTEST.slice(4))}
${bay('vi', 'coi "test xanh hết" là bằng chứng.', 'Test xanh chỉ chứng minh đúng những gì nó kiểm. Một bộ test mock lời gọi CSDL, không có đường không suôn sẻ, không có test phân quyền vẫn có thể xanh 100% trong khi người dùng đọc được dữ liệu của nhau. Khi phỏng vấn, hãy nói test của bạn kiểm cái gì, không phải có bao nhiêu test.')}
${keXau('vi', 'Test là một phần của bảo mật: một test đăng nhập bằng người B rồi đòi đối tượng của người A là cách rẻ nhất để chắc chắn lỗi BOLA không bao giờ quay lại. Test cũng có thể làm lộ bí mật — dữ liệu mẫu chứa token thật, log CI in ra biến môi trường — nên hãy dùng thông tin đăng nhập giả và che bí mật.')}
${thucHanh('vi', { phut: '40–60', steps: [
  'Chép <code>phiTre</code> và các test vào một thư mục mới (<code>npm init -y &amp;&amp; npm i -D vitest</code>), chạy <code>npx vitest run</code>, rồi đổi <code>Math.min</code> thành <code>Math.max</code> và kiểm rằng có test hỏng.',
  'Chọn một hàm có luật nghiệp vụ trong dự án của bạn. Liệt kê các lớp tương đương và giá trị biên, rồi viết 5 test.',
  'Với một endpoint trong dự án, viết danh sách ca như câu 4.4-5 (chủ sở hữu, không token, người khác, không tồn tại, id sai dạng).',
  'Trả lời thành tiếng câu 4.4-3 và 4.4-7, có ghi âm.',
], dat: 'năm test của bạn chạy xanh, bản bị sửa làm ít nhất một test đỏ, và bạn có danh sách ca viết sẵn cho một endpoint thật.' })}
${thuatNgu('vi', [
  ['Unit / integration / E2E test', 'Một mẩu riêng / các mẩu với phụ thuộc thật / cả hệ thống như người dùng.'],
  ['Equivalence partition (lớp tương đương)', 'Một nhóm đầu vào mà mã phải xử lý giống nhau.'],
  ['Boundary value (giá trị biên)', 'Đầu vào nằm ở mép giữa hai lớp — nơi lỗi lệch một sống.'],
  ['Test double (vật thay thế khi test)', 'Bất kỳ thứ gì đứng thay một phụ thuộc thật: stub, mock, spy, fake.'],
  ['Arrange–Act–Assert', 'Cấu trúc ba phần của một test rõ ràng.'],
  ['Code coverage (độ phủ mã)', 'Tỉ lệ mã được chạy bởi test — không phải tỉ lệ được kiểm.'],
  ['Mutation testing (kiểm thử đột biến)', 'Cố ý sửa mã để xem test có nhận ra không.'],
  ['Flaky test (test chập chờn)', 'Test lúc qua lúc hỏng mà mã không hề đổi.'],
])}
${tomTat('vi', [
  'Nhiều unit test nhanh, đủ integration test với CSDL thật, vài E2E cho các hành trình chính.',
  'Thiết kế ca bằng lớp tương đương và giá trị biên; mỗi test một hành vi; tên đọc lên như luật.',
  'Mock đồng hồ, tính ngẫu nhiên và bên thứ ba — không mock truy vấn CSDL của chính mình.',
  'Test không bao giờ được chạm dịch vụ production; sandbox và dây bẫy làm điều đó tự động.',
  'Phủ các đường không suôn sẻ của mọi endpoint, kể cả id của người khác.',
  'Độ phủ là mức sàn, không phải bằng chứng; test chập chờn là lỗi thật của test hoặc của mã.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'testing', bai: 'tst-0-1-kim-tu-thap', title: 'Testing 0.2 — Kim tự tháp test (và chiếc cúp), có số đo', sub: 'Câu 4.4-1 kèm con số.' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-1-phan-loai', title: 'Testing 3.1 — Stub, mock, spy, fake', sub: 'Câu 4.4-3 đi sâu.' }),
  lienKet({ khoa: 'software-testing', bai: 'swt301-blackbox-ep-bva', academy: true, title: 'Academy · SWT301 4.2 — Phân hoạch tương đương', sub: 'Lý thuyết ở trường đứng sau câu 4.4-2 — ở đây bạn dùng nó để trả lời phỏng vấn.' }),
  lienKet({ khoa: 'testing', bai: 'tst-10-4-phong-van', title: 'Testing 10.4 — Câu hỏi phỏng vấn về testing', sub: 'Thêm câu hỏi cùng kiểu.' }),
  yt('YaXJeUkBe4Y', 'Alex Hyett', '5 Types of Testing Software Every Developer Needs to Know', 6),
])}
</div>
`,
};

/* ═══════════════════════ 4.5 — Java, OOP và Spring Boot ═══════════════════════ */
const JAVA_EQUALS = `
public class Device {
    private final String serial;   // định danh nghiệp vụ
    private String name;

    public Device(String serial, String name) { this.serial = serial; this.name = name; }

    // THIẾU equals/hashCode ⇒ hai object cùng serial là "khác nhau":
    //   Set<Device> s = new HashSet<>();
    //   s.add(new Device("OSC-01", "Oscilloscope"));
    //   s.contains(new Device("OSC-01", "Oscilloscope"))  ⇒ false  (!)

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Device other)) return false;
        return serial.equals(other.serial);
    }

    @Override
    public int hashCode() { return serial.hashCode(); }   // cùng trường với equals
}
`;

const JAVA_SPRING = `
@RestController
@RequestMapping("/api/bookings")
public class BookingController {                 // tầng web: HTTP vào, DTO ra
    private final BookingService service;
    public BookingController(BookingService service) { this.service = service; }   // constructor injection

    @PostMapping
    public ResponseEntity<BookingDto> create(@Valid @RequestBody CreateBookingRequest req, Principal user) {
        return ResponseEntity.status(201).body(service.create(req, user.getName()));
    }
}

@Service
public class BookingService {                    // tầng nghiệp vụ: luật + giao dịch
    private final BookingRepository bookings;
    private final DeviceAvailability devices;    // interface do module "inventory" công bố
    public BookingService(BookingRepository bookings, DeviceAvailability devices) {
        this.bookings = bookings; this.devices = devices;
    }

    @Transactional
    public BookingDto create(CreateBookingRequest req, String username) {
        if (!devices.reserve(req.deviceId(), req.slot())) throw new DeviceUnavailableException(req.deviceId());
        Booking b = bookings.save(Booking.pending(req, username));
        return BookingDto.from(b);
    }
}

public interface BookingRepository extends JpaRepository<Booking, Long> {   // tầng truy cập dữ liệu
    @Query("select b from Booking b join fetch b.device where b.username = :u")
    List<Booking> findMineWithDevice(@Param("u") String username);           // JOIN FETCH ⇒ không N+1
}
`;

const QJAVA = [
  {
    so: '4.5-1',
    q: ['Explain the four principles of OOP with an example from your own project.', 'Giải thích bốn tính chất của OOP bằng ví dụ từ dự án của bạn.'],
    chu: ['Not the definitions — whether you can apply them to real classes.', 'Không phải định nghĩa — mà bạn có áp được vào các lớp thật không.'],
    a: [
      '<p>Using a lab-equipment system as the example:</p><ul><li><strong>Encapsulation</strong> — a <code>Device</code> keeps its <code>status</code> private and changes it only through methods like <code>borrow()</code> and <code>returnBack()</code> that enforce the rules (you cannot borrow a device under maintenance). The rule lives in one place.</li><li><strong>Abstraction</strong> — the booking service depends on an interface <code>DeviceAvailability</code>, not on how availability is computed.</li><li><strong>Inheritance</strong> — <code>Oscilloscope</code> and <code>Microcontroller</code> could extend an abstract <code>Device</code> — but I would use it sparingly; composition is often better.</li><li><strong>Polymorphism</strong> — a list of <code>Device</code> where each subtype implements <code>maintenanceInterval()</code> differently, and the scheduler calls it without knowing the type.</li></ul>',
      '<p>Lấy một hệ thống quản lý thiết bị phòng lab làm ví dụ:</p><ul><li><strong>Đóng gói (encapsulation)</strong> — <code>Device</code> giữ <code>status</code> ở private và chỉ đổi nó qua các phương thức như <code>borrow()</code> và <code>returnBack()</code> vốn áp luật (không thể mượn thiết bị đang bảo trì). Luật nằm ở một chỗ.</li><li><strong>Trừu tượng (abstraction)</strong> — service đặt lịch phụ thuộc vào interface <code>DeviceAvailability</code>, không phụ thuộc cách tính còn trống.</li><li><strong>Kế thừa (inheritance)</strong> — <code>Oscilloscope</code> và <code>Microcontroller</code> có thể kế thừa một <code>Device</code> trừu tượng — nhưng em dùng tiết chế; thường thì kết hợp (composition) tốt hơn.</li><li><strong>Đa hình (polymorphism)</strong> — một danh sách <code>Device</code> mà mỗi kiểu con cài <code>maintenanceInterval()</code> khác nhau, và bộ lập lịch gọi nó mà không cần biết kiểu.</li></ul>',
    ],
    sau: [['Why prefer composition over inheritance?', 'What is the difference between abstraction and encapsulation?'], ['Vì sao ưu tiên kết hợp hơn kế thừa?', 'Trừu tượng khác đóng gói ở đâu?']],
    loi: ['Using "Animal → Dog → bark()" — it shows you memorised a textbook, not that you design.', 'Dùng ví dụ "Animal → Dog → bark()" — cho thấy bạn thuộc sách, không cho thấy bạn thiết kế.'],
  },
  {
    so: '4.5-2',
    q: ['Abstract class vs interface? Overloading vs overriding?', 'Lớp trừu tượng khác interface thế nào? Overloading khác overriding thế nào?'],
    chu: ['Core Java precision — very common at outsourcing companies.', 'Độ chính xác về Java lõi — rất hay gặp ở công ty outsource.'],
    a: [
      '<p>An <strong>abstract class</strong> can have state (fields), constructors and implemented methods; a class extends only one. An <strong>interface</strong> is a contract; a class implements many; since Java 8 it can have <code>default</code> and <code>static</code> methods but no instance state. Use an interface for a capability ("can be reserved"), an abstract class for a shared base with common state.</p><p><strong>Overloading</strong> is several methods with the same name but different parameters in one class, chosen at <em>compile time</em>. <strong>Overriding</strong> is a subclass replacing a parent method with the same signature, chosen at <em>run time</em> by the object’s real type — that is runtime polymorphism. Use <code>@Override</code> so the compiler catches signature mistakes.</p>',
      '<p><strong>Lớp trừu tượng</strong> có thể có trạng thái (trường), constructor và phương thức đã cài; một lớp chỉ kế thừa được một. <strong>Interface</strong> là một hợp đồng; một lớp cài được nhiều; từ Java 8 nó có phương thức <code>default</code> và <code>static</code> nhưng không có trạng thái instance. Dùng interface cho một năng lực ("có thể được đặt"), lớp trừu tượng cho một nền chung có trạng thái chung.</p><p><strong>Overloading</strong> (nạp chồng) là nhiều phương thức cùng tên khác tham số trong một lớp, được chọn lúc <em>biên dịch</em>. <strong>Overriding</strong> (ghi đè) là lớp con thay phương thức của lớp cha cùng chữ ký, được chọn lúc <em>chạy</em> theo kiểu thật của object — đó là đa hình lúc chạy. Dùng <code>@Override</code> để trình biên dịch bắt lỗi sai chữ ký.</p>',
    ],
    sau: [['Can a static method be overridden?', 'What happens with two default methods of the same name from two interfaces?'], ['Phương thức static có ghi đè được không?', 'Hai interface có hai phương thức default trùng tên thì sao?']],
    loi: ['"Interfaces cannot have any method bodies" — outdated since Java 8.', '"Interface không được có thân phương thức" — đã lỗi thời từ Java 8.'],
  },
  {
    so: '4.5-3',
    q: ['What is the contract between equals() and hashCode()? What breaks if you override only one?', 'Hợp đồng giữa equals() và hashCode() là gì? Chỉ ghi đè một cái thì hỏng gì?'],
    chu: ['A favourite Java question, because the bug is silent.', 'Câu Java được ưa chuộng, vì lỗi này câm lặng.'],
    a: [
      '<p>If <code>a.equals(b)</code> is true, then <code>a.hashCode() == b.hashCode()</code> must be true (the reverse is not required). <code>HashMap</code> and <code>HashSet</code> first use the hash code to pick a bucket, then <code>equals</code> inside it. Override <code>equals</code> but not <code>hashCode</code>, and two "equal" devices land in different buckets: <code>contains</code> returns false and the set holds duplicates. Base both on the same immutable fields — for an entity, a business key such as a serial number — and do not put mutable objects in a set and then change the fields used in the hash.</p>',
      '<p>Nếu <code>a.equals(b)</code> đúng thì <code>a.hashCode() == b.hashCode()</code> phải đúng (chiều ngược lại không bắt buộc). <code>HashMap</code> và <code>HashSet</code> dùng hash code để chọn ngăn (bucket) trước, rồi mới dùng <code>equals</code> trong ngăn đó. Ghi đè <code>equals</code> mà không ghi đè <code>hashCode</code> thì hai thiết bị "bằng nhau" rơi vào hai ngăn khác nhau: <code>contains</code> trả false và set chứa bản trùng. Dựa cả hai trên cùng các trường bất biến — với entity là một khoá nghiệp vụ như số serial — và đừng cho object có thể đổi vào set rồi sửa trường đang dùng để băm.</p>',
    ],
    sau: [['How does HashMap handle collisions? What changed in Java 8?', 'Why is using a JPA auto-generated id in equals tricky?'], ['HashMap xử lý va chạm thế nào? Java 8 thay đổi gì?', 'Vì sao dùng id tự sinh của JPA trong equals thì rắc rối?']],
    loi: ['Knowing that both must be overridden but not why — the bucket explanation is the answer.', 'Biết phải ghi đè cả hai nhưng không biết vì sao — giải thích về ngăn băm mới là câu trả lời.'],
  },
  {
    so: '4.5-4',
    q: ['ArrayList vs LinkedList? HashMap vs TreeMap vs ConcurrentHashMap?', 'ArrayList khác LinkedList thế nào? HashMap, TreeMap và ConcurrentHashMap khác nhau ra sao?'],
    chu: ['Choosing the right collection for a reason.', 'Chọn đúng collection, có lý do.'],
    a: [
      '<p><strong>ArrayList</strong> is a resizable array: O(1) access by index, appends are amortised O(1), inserting in the middle shifts elements. <strong>LinkedList</strong> has O(n) access by index and poor cache locality; in practice ArrayList wins almost always (ArrayDeque for queues). <strong>HashMap</strong>: average O(1) get/put, no order. <strong>TreeMap</strong>: a red-black tree, O(log n), keys sorted — use when you need ranges or ordering. <strong>LinkedHashMap</strong> keeps insertion order. A plain HashMap is not thread-safe; for shared maps use <strong>ConcurrentHashMap</strong>, not <code>Collections.synchronizedMap</code> when you need concurrency.</p>',
      '<p><strong>ArrayList</strong> là mảng tự giãn: truy cập theo chỉ số O(1), thêm vào cuối O(1) trung bình, chèn giữa phải dời phần tử. <strong>LinkedList</strong> truy cập theo chỉ số O(n) và kém thân thiện với cache; thực tế ArrayList thắng gần như mọi lúc (dùng ArrayDeque cho hàng đợi). <strong>HashMap</strong>: get/put O(1) trung bình, không thứ tự. <strong>TreeMap</strong>: cây đỏ-đen, O(log n), khoá được sắp — dùng khi cần khoảng hoặc thứ tự. <strong>LinkedHashMap</strong> giữ thứ tự chèn. HashMap thường không an toàn luồng; với map dùng chung giữa các luồng hãy dùng <strong>ConcurrentHashMap</strong>.</p>',
    ],
    sau: [['What is the load factor of a HashMap?', 'Why does iterating and removing from an ArrayList throw ConcurrentModificationException?'], ['Load factor của HashMap là gì?', 'Vì sao vừa duyệt vừa xoá phần tử ArrayList lại ném ConcurrentModificationException?']],
    loi: ['"LinkedList is faster for inserts" without saying that finding the position is O(n).', '"LinkedList chèn nhanh hơn" mà không nói việc tìm tới vị trí đã là O(n).'],
  },
  {
    so: '4.5-5',
    q: ['Checked vs unchecked exceptions? How do you handle errors in a Spring REST API?', 'Checked exception khác unchecked thế nào? Xử lý lỗi trong một REST API Spring ra sao?'],
    chu: ['Clean error design, not try/catch everywhere.', 'Thiết kế lỗi gọn gàng, không phải try/catch ở khắp nơi.'],
    a: [
      '<p><strong>Checked</strong> exceptions (subclasses of <code>Exception</code> but not <code>RuntimeException</code>, such as <code>IOException</code>) must be declared or caught — the compiler forces you. <strong>Unchecked</strong> ones (<code>RuntimeException</code> and subclasses) need not be. Modern Spring code mostly uses unchecked business exceptions (<code>DeviceUnavailableException</code>) thrown from the service, and one <code>@RestControllerAdvice</code> with <code>@ExceptionHandler</code> methods that maps each to a status code and a consistent body (for example Problem Details). Never swallow an exception with an empty catch; never return the stack trace to the client.</p>',
      '<p>Exception <strong>checked</strong> (lớp con của <code>Exception</code> nhưng không phải <code>RuntimeException</code>, như <code>IOException</code>) phải khai báo hoặc bắt — trình biên dịch ép bạn. Loại <strong>unchecked</strong> (<code>RuntimeException</code> và lớp con) thì không. Mã Spring hiện đại chủ yếu dùng exception nghiệp vụ unchecked (<code>DeviceUnavailableException</code>) ném ra từ service, và một <code>@RestControllerAdvice</code> có các phương thức <code>@ExceptionHandler</code> ánh xạ từng loại sang mã trạng thái và một thân phản hồi thống nhất (ví dụ Problem Details). Không bao giờ nuốt exception bằng catch rỗng; không bao giờ trả stack trace cho client.</p>',
    ],
    sau: [['Which exceptions make @Transactional roll back by default?', 'What is try-with-resources for?'], ['Exception nào làm @Transactional quay lui theo mặc định?', 'try-with-resources dùng để làm gì?']],
    loi: ['<code>catch (Exception e) { e.printStackTrace(); }</code> and carrying on.', '<code>catch (Exception e) { e.printStackTrace(); }</code> rồi chạy tiếp như không có gì.'],
  },
  {
    so: '4.5-6',
    q: ['What are the SOLID principles? Show one you applied.', 'SOLID là gì? Cho xem một nguyên tắc bạn đã áp dụng.'],
    chu: ['One principle applied well beats five recited.', 'Một nguyên tắc áp dụng tốt hơn năm nguyên tắc đọc thuộc.'],
    a: [
      '<p>Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion. Then go deep on one: <strong>Dependency inversion</strong> — in my capstone the booking module depends on an interface <code>DeviceAvailability</code> published by the inventory module, not on its classes or tables. Spring injects the implementation. That lets me test booking with a fake availability, and if the inventory module is ever split into its own service, only the implementation behind the interface changes. <strong>Single responsibility</strong> shows in the layers: the controller handles HTTP, the service the business rules, the repository the data access.</p>',
      '<p>Single responsibility (một trách nhiệm), Open/closed (mở để mở rộng, đóng để sửa), Liskov substitution (thay thế Liskov), Interface segregation (tách interface), Dependency inversion (đảo ngược phụ thuộc). Rồi đi sâu một cái: <strong>Đảo ngược phụ thuộc</strong> — trong đồ án của em, module đặt lịch phụ thuộc vào interface <code>DeviceAvailability</code> do module kho thiết bị công bố, không phụ thuộc lớp hay bảng của nó. Spring tiêm phần cài đặt vào. Nhờ vậy em test được module đặt lịch với một bản giả, và nếu sau này tách module kho thành dịch vụ riêng thì chỉ phần cài đặt sau interface thay đổi. <strong>Một trách nhiệm</strong> thể hiện ở các tầng: controller lo HTTP, service lo luật nghiệp vụ, repository lo truy cập dữ liệu.</p>',
    ],
    sau: [['Give an example that violates Liskov.', 'Can following SOLID make code worse?'], ['Cho một ví dụ vi phạm Liskov.', 'Theo SOLID có thể làm mã tệ đi không?']],
    loi: ['Reciting the five names with no example.', 'Đọc năm cái tên mà không có ví dụ.'],
  },
  {
    so: '4.5-7',
    q: ['What are IoC and dependency injection in Spring? What is a bean?', 'IoC và dependency injection trong Spring là gì? Bean là gì?'],
    chu: ['Whether "Spring Boot" on your CV goes beyond annotations.', '"Spring Boot" trên CV của bạn có vượt quá mức gắn annotation không.'],
    a: [
      '<p><strong>Inversion of control</strong>: instead of my code creating its dependencies with <code>new</code>, the framework’s container creates objects and wires them together. <strong>Dependency injection</strong> is how: the container passes dependencies in — preferably through the <strong>constructor</strong>, so fields can be final, dependencies are explicit and tests can pass fakes. A <strong>bean</strong> is an object managed by the container, registered by component scanning (<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@RestController</code>) or by <code>@Bean</code> methods in a <code>@Configuration</code> class. Default scope is <strong>singleton</strong> — one instance shared by all requests — so beans must not keep per-request state in fields.</p>',
      '<p><strong>Đảo ngược điều khiển (IoC)</strong>: thay vì mã của em tự tạo phụ thuộc bằng <code>new</code>, container của framework tạo object và nối chúng với nhau. <strong>Dependency injection (tiêm phụ thuộc)</strong> là cách làm: container đưa phụ thuộc vào — tốt nhất qua <strong>constructor</strong>, để trường có thể final, phụ thuộc hiện rõ và test truyền được bản giả. <strong>Bean</strong> là object do container quản lý, được đăng ký qua component scanning (<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@RestController</code>) hoặc qua phương thức <code>@Bean</code> trong lớp <code>@Configuration</code>. Scope mặc định là <strong>singleton</strong> — một instance dùng chung cho mọi request — nên bean không được giữ trạng thái riêng của từng request trong trường.</p>',
    ],
    sau: [['Why is field injection with @Autowired discouraged?', 'What happens with two beans of the same type?'], ['Vì sao không khuyến khích tiêm vào trường bằng @Autowired?', 'Có hai bean cùng kiểu thì sao?']],
    loi: ['"@Autowired makes it work" — without explaining what the container does.', '"Gắn @Autowired là chạy" — mà không giải thích container làm gì.'],
  },
  {
    so: '4.5-8',
    q: ['How do you structure a Spring Boot project? Monolith or microservices for your capstone?', 'Bạn tổ chức một dự án Spring Boot thế nào? Đồ án của bạn chọn monolith hay microservices?'],
    chu: ['Architecture judgement proportional to the problem — a strong "to score points" answer.', 'Óc phán đoán kiến trúc tương xứng với bài toán — câu "ghi điểm" mạnh.'],
    a: [
      '<p>Layers inside each feature: <strong>controller</strong> (HTTP, validation of the request DTO), <strong>service</strong> (business rules, transactions), <strong>repository</strong> (data access); entities never leak to the API — DTOs go out. For my capstone I chose a <strong>modular monolith</strong>: one deployable application, split into modules by business domain (inventory, booking, users…). The rules that keep it clean: modules talk only through published interfaces, no module joins another module’s tables, no transaction spans modules, and each module owns its migrations. Microservices would add network calls, distributed transactions and deployment work that a small team over twenty weeks cannot justify; the module boundaries mean that if splitting is ever needed, it is cheap.</p>',
      '<p>Các tầng trong mỗi tính năng: <strong>controller</strong> (HTTP, kiểm DTO của request), <strong>service</strong> (luật nghiệp vụ, giao dịch), <strong>repository</strong> (truy cập dữ liệu); entity không bao giờ lọt ra API — trả ra DTO. Với đồ án, em chọn <strong>modular monolith</strong> (khối nguyên có chia module): một ứng dụng deploy duy nhất, chia module theo miền nghiệp vụ (kho thiết bị, đặt lịch, người dùng…). Những luật giữ nó sạch: module chỉ nói chuyện qua interface đã công bố, không module nào join bảng của module khác, không giao dịch nào trải qua nhiều module, và mỗi module sở hữu migration của mình. Microservices sẽ thêm lời gọi mạng, giao dịch phân tán và việc deploy mà một nhóm nhỏ trong hai mươi tuần không biện minh được; ranh giới module khiến nếu có ngày cần tách thì tách rẻ.</p>',
    ],
    sau: [['Why not return the JPA entity directly from the controller?', 'How would you know it is time to split a module out?'], ['Sao không trả thẳng entity JPA từ controller?', 'Làm sao biết đã tới lúc tách một module ra?']],
    loi: ['"Microservices, because big companies use them" — with no reason tied to your project’s size.', '"Microservices, vì công ty lớn dùng" — không có lý do nào gắn với quy mô dự án của bạn.'],
  },
  {
    so: '4.5-9',
    q: ['What does @Transactional do, and when does it NOT work?', '@Transactional làm gì, và khi nào nó KHÔNG có tác dụng?'],
    chu: ['A classic Spring trap — knowing it marks real experience.', 'Một cái bẫy kinh điển của Spring — biết nó là dấu hiệu kinh nghiệm thật.'],
    a: [
      '<p>Spring wraps the bean in a <strong>proxy</strong>; calling a <code>@Transactional</code> method through the proxy opens a transaction, commits on success and rolls back on <strong>unchecked</strong> exceptions by default (checked ones only with <code>rollbackFor</code>). It does <em>not</em> work when: the method is called from <strong>inside the same class</strong> (self-invocation bypasses the proxy), the method is private, or the exception is caught and swallowed inside. Also keep transactions short — no remote calls inside — and put them on service methods, not controllers.</p>',
      '<p>Spring bọc bean trong một <strong>proxy</strong>; gọi phương thức <code>@Transactional</code> qua proxy sẽ mở giao dịch, commit khi thành công và quay lui khi gặp exception <strong>unchecked</strong> theo mặc định (checked thì chỉ khi có <code>rollbackFor</code>). Nó <em>không</em> có tác dụng khi: phương thức được gọi từ <strong>bên trong cùng lớp</strong> (tự gọi đi vòng qua proxy), phương thức là private, hoặc exception bị bắt và nuốt ngay bên trong. Thêm nữa, giữ giao dịch ngắn — không gọi dịch vụ xa bên trong — và đặt nó ở phương thức của service, không ở controller.</p>',
    ],
    sau: [['What is LAZY vs EAGER loading, and what is LazyInitializationException?', 'What does propagation REQUIRES_NEW do?'], ['LAZY và EAGER loading khác nhau thế nào, LazyInitializationException là gì?', 'Propagation REQUIRES_NEW làm gì?']],
    loi: ['"It makes the method atomic" — without the proxy and rollback rules.', '"Nó làm phương thức thành nguyên tử" — mà không nói về proxy và luật quay lui.'],
  },
];

const L45 = {
  title: '4.5 — Java, OOP and Spring Boot questions for Java companies|||4.5 — Câu hỏi Java, OOP và Spring Boot cho công ty dùng Java',
  slug: 'pv-4-5-java-oop',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài mới cho công ty dùng Java (rất nhiều nơi nhận thực tập ở Việt Nam): bốn tính chất OOP bằng ví dụ thật, abstract class và interface, equals/hashCode, collections, exception và xử lý lỗi Spring, SOLID, IoC/DI và bean, tổ chức dự án và modular monolith của đồ án LabFlow, @Transactional và những lúc nó không chạy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Java, OOP and Spring Boot questions — for the many companies that hire Java interns</h2>
<p class="lead">A large share of internship postings in Vietnam, especially at outsourcing companies, ask for Java and Spring Boot. Their technical round usually starts with core Java and OOP — the material of PRO192 — and then moves to Spring. If your capstone is a Spring Boot application, this lesson is where your strongest evidence lives: you coded it yourself, so you can answer every follow-up.</p>
${doiThuong('en', 'A Spring Boot application is a restaurant. The controller is the waiter who takes the order and brings the plate; the service is the chef who knows the recipes and the rules ("no fish on Monday"); the repository is the storeroom clerk. Dependency injection is the manager hiring and assigning staff so the chef never has to recruit a clerk himself. And a modular monolith is one restaurant with separate kitchens that pass dishes only through a hatch — never by walking into each other’s fridge.')}
${khungTraLoi('en')}
<h3>Core Java and OOP</h3>
${qs('en', QJAVA.slice(0, 2))}
${ma('java', JAVA_EQUALS)}
${qs('en', QJAVA.slice(2, 5))}
<h3>Design and Spring</h3>
${qs('en', QJAVA.slice(5, 7))}
${ma('java', JAVA_SPRING)}
${qs('en', QJAVA.slice(7))}
${stack([
  ['Controller (web layer)', 'HTTP in, validation of the request DTO, status codes; no business rules.'],
  ['Service (business layer)', 'Rules and transactions; calls other modules only through their interfaces.'],
  ['Repository (data layer)', 'JPA queries; JOIN FETCH where a list needs its relations.'],
  ['Database', 'Each module owns its own tables and migrations.'],
])}
${bay('en', 'putting Spring Boot at the top of your CV after following one tutorial.', 'Java interviewers go straight from "what is a bean" to "why is my @Transactional not rolling back". If your Spring project is one CRUD tutorial, say "basic Spring Boot" and talk mostly about core Java and SQL, which you know better. If you built your capstone by hand, lead with it — and be ready to open the code.')}
${keXau('en', 'Java web risks interviewers like: mass assignment (binding a request straight onto an entity lets an attacker set <code>role=ADMIN</code> — use request DTOs), SQL injection through string-built JPQL (use parameters), and exposing Spring Boot Actuator endpoints publicly (they can reveal environment details). Mentioning one of these, with its fix, is a strong signal.')}
${thucHanh('en', { phut: '45–60', steps: [
  'Write the <code>Device</code> class without equals/hashCode, put two devices with the same serial in a <code>HashSet</code>, print <code>size()</code>; then add the methods and print again.',
  'Open your capstone (or any Spring project) and draw its layers and modules on one page. Mark one place where a module reaches into another’s classes or tables, if any.',
  'Find one <code>@Transactional</code> method and check: is it public, called from another bean, and does it throw unchecked exceptions on failure?',
  'Answer 4.5-1, 4.5-3 and 4.5-8 out loud with examples from your own project, recorded.',
], dat: 'your HashSet prints 2 then 1, you have a one-page diagram of your project, and your recordings use your own classes as examples.' })}
${thuatNgu('en', [
  ['Encapsulation', 'Hiding state behind methods that enforce the rules.'],
  ['Polymorphism', 'One call, different behaviour depending on the object’s real type.'],
  ['equals/hashCode contract', 'Equal objects must have equal hash codes, or hash collections break.'],
  ['IoC / DI', 'The container creates and wires objects; dependencies are passed in, ideally by constructor.'],
  ['Bean', 'An object managed by the Spring container; singleton by default.'],
  ['DTO', 'A data transfer object shaped for the API, separate from the entity.'],
  ['Modular monolith', 'One deployable app split into domain modules with strict boundaries.'],
  ['@Transactional proxy', 'The wrapper that starts and ends transactions — bypassed by self-invocation.'],
])}
${tomTat('en', [
  'Explain OOP with your own classes, not animals; prefer composition over deep inheritance.',
  'Interfaces for capabilities, abstract classes for shared state; overloading is compile-time, overriding is run-time.',
  'Override equals and hashCode together, on the same immutable fields.',
  'Choose collections for a reason: ArrayList by default, TreeMap for order, ConcurrentHashMap for shared maps.',
  'Constructor injection, singleton beans without per-request state, DTOs at the API boundary.',
  '@Transactional works through a proxy: public methods, called from another bean, unchecked exceptions roll back.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'object-oriented-programming', bai: 'pro192-4-2-da-hinh', academy: true, L: 'en', title: 'Academy · PRO192 4.2 — Polymorphism', sub: 'The school foundation for questions 4.5-1 and 4.5-2.' }),
  lienKet({ khoa: 'object-oriented-programming', bai: 'pro192-8-1-collections', academy: true, L: 'en', title: 'Academy · PRO192 8.1 — List, Set and Map', sub: 'Collections, hashing and equals/hashCode.' }),
  lienKet({ khoa: 'java-web-application-development', bai: 'prj301-jpa', academy: true, L: 'en', title: 'Academy · PRJ301 7.1 — Entities and the EntityManager', sub: 'JPA under Spring Data.' }),
  yt('yL1D0opZwwA', 'Java Guides', 'Java OOP Interview Questions and Answers for Beginners and Experienced', 18, 'en'),
  yt('cNzFPWuju8k', 'Amigoscode', 'Top 10 Spring Boot Interview Questions and Answers', 13, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Câu hỏi Java, OOP và Spring Boot — cho rất nhiều công ty nhận thực tập Java</h2>
<p class="lead">Một phần lớn tin tuyển thực tập ở Việt Nam, nhất là ở công ty outsource, đòi Java và Spring Boot. Vòng kỹ thuật của họ thường mở đầu bằng Java lõi và OOP — chính là nội dung PRO192 — rồi chuyển sang Spring. Nếu đồ án của bạn là một ứng dụng Spring Boot, bài này là nơi bằng chứng mạnh nhất của bạn nằm: bạn tự code nó, nên bạn trả lời được mọi câu đào sâu.</p>
${doiThuong('vi', 'Một ứng dụng Spring Boot là một nhà hàng. Controller là bồi bàn nhận gọi món và bưng đĩa ra; service là đầu bếp biết công thức và luật ("thứ Hai không có cá"); repository là người giữ kho. Dependency injection là quản lý tuyển và phân công nhân viên, để đầu bếp không bao giờ phải tự đi tuyển người giữ kho. Còn modular monolith là một nhà hàng có nhiều bếp riêng, chỉ chuyền món qua ô cửa — không bao giờ đi thẳng vào tủ lạnh của bếp bên cạnh.')}
${khungTraLoi('vi')}
<h3>Java lõi và OOP</h3>
${qs('vi', QJAVA.slice(0, 2))}
${ma('java', JAVA_EQUALS)}
${qs('vi', QJAVA.slice(2, 5))}
<h3>Thiết kế và Spring</h3>
${qs('vi', QJAVA.slice(5, 7))}
${ma('java', JAVA_SPRING)}
${qs('vi', QJAVA.slice(7))}
${stack([
  ['Controller (tầng web)', 'HTTP vào, kiểm DTO của request, mã trạng thái; không chứa luật nghiệp vụ.'],
  ['Service (tầng nghiệp vụ)', 'Luật và giao dịch; gọi module khác chỉ qua interface của chúng.'],
  ['Repository (tầng dữ liệu)', 'Truy vấn JPA; JOIN FETCH khi một danh sách cần quan hệ của nó.'],
  ['Cơ sở dữ liệu', 'Mỗi module sở hữu bảng và migration của riêng mình.'],
])}
${bay('vi', 'đặt Spring Boot lên đầu CV sau khi làm theo một video hướng dẫn.', 'Người phỏng vấn Java đi thẳng từ "bean là gì" sang "vì sao @Transactional của em không quay lui". Nếu dự án Spring của bạn là một bài CRUD theo hướng dẫn, hãy ghi "Spring Boot cơ bản" và nói chủ yếu về Java lõi và SQL, thứ bạn chắc hơn. Nếu bạn tự tay code đồ án, hãy đưa nó lên đầu — và sẵn sàng mở mã ra.')}
${keXau('vi', 'Rủi ro web Java người phỏng vấn thích hỏi: mass assignment (gán hàng loạt — bind request thẳng vào entity cho phép kẻ tấn công đặt <code>role=ADMIN</code>; hãy dùng DTO cho request), SQL injection qua JPQL nối chuỗi (dùng tham số), và để lộ endpoint Spring Boot Actuator ra công khai (có thể lộ thông tin môi trường). Nhắc được một trong số này kèm cách sửa là tín hiệu mạnh.')}
${thucHanh('vi', { phut: '45–60', steps: [
  'Viết lớp <code>Device</code> chưa có equals/hashCode, cho hai thiết bị cùng serial vào <code>HashSet</code>, in <code>size()</code>; rồi thêm hai phương thức và in lại.',
  'Mở đồ án của bạn (hoặc dự án Spring bất kỳ) và vẽ các tầng và module trên một trang. Đánh dấu một chỗ module này thò vào lớp hay bảng của module khác, nếu có.',
  'Tìm một phương thức <code>@Transactional</code> và kiểm: nó public không, được gọi từ một bean khác không, và khi hỏng có ném exception unchecked không?',
  'Trả lời thành tiếng câu 4.5-1, 4.5-3 và 4.5-8 bằng ví dụ từ dự án của chính bạn, có ghi âm.',
], dat: 'HashSet của bạn in 2 rồi 1, bạn có sơ đồ một trang của dự án, và bản ghi âm dùng chính các lớp của bạn làm ví dụ.' })}
${thuatNgu('vi', [
  ['Encapsulation (đóng gói)', 'Giấu trạng thái sau các phương thức áp luật.'],
  ['Polymorphism (đa hình)', 'Một lời gọi, hành vi khác nhau tuỳ kiểu thật của object.'],
  ['Hợp đồng equals/hashCode', 'Object bằng nhau phải có hash code bằng nhau, không thì collection băm hỏng.'],
  ['IoC / DI (đảo ngược điều khiển / tiêm phụ thuộc)', 'Container tạo và nối object; phụ thuộc được truyền vào, tốt nhất qua constructor.'],
  ['Bean', 'Object do container Spring quản lý; mặc định là singleton.'],
  ['DTO (đối tượng truyền dữ liệu)', 'Dữ liệu có hình dạng dành cho API, tách khỏi entity.'],
  ['Modular monolith', 'Một ứng dụng deploy duy nhất, chia thành module theo miền với ranh giới chặt.'],
  ['Proxy của @Transactional', 'Lớp bọc mở và đóng giao dịch — bị đi vòng khi tự gọi trong cùng lớp.'],
])}
${tomTat('vi', [
  'Giải thích OOP bằng chính các lớp của bạn, không phải con vật; ưu tiên kết hợp hơn kế thừa sâu.',
  'Interface cho năng lực, lớp trừu tượng cho trạng thái chung; nạp chồng chọn lúc biên dịch, ghi đè chọn lúc chạy.',
  'Ghi đè equals và hashCode cùng nhau, trên cùng các trường bất biến.',
  'Chọn collection có lý do: mặc định ArrayList, TreeMap khi cần thứ tự, ConcurrentHashMap cho map dùng chung.',
  'Tiêm qua constructor, bean singleton không giữ trạng thái theo request, DTO ở ranh giới API.',
  '@Transactional chạy qua proxy: phương thức public, gọi từ bean khác, exception unchecked thì quay lui.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'object-oriented-programming', bai: 'pro192-4-2-da-hinh', academy: true, title: 'Academy · PRO192 4.2 — Đa hình', sub: 'Nền ở trường cho câu 4.5-1 và 4.5-2 — bài này thêm góc trả lời phỏng vấn.' }),
  lienKet({ khoa: 'object-oriented-programming', bai: 'pro192-8-1-collections', academy: true, title: 'Academy · PRO192 8.1 — List, Set và Map', sub: 'Collections, băm và equals/hashCode.' }),
  lienKet({ khoa: 'java-web-application-development', bai: 'prj301-jpa', academy: true, title: 'Academy · PRJ301 7.1 — Entity và EntityManager', sub: 'JPA nằm bên dưới Spring Data.' }),
  yt('yL1D0opZwwA', 'Java Guides', 'Java OOP Interview Questions and Answers for Beginners and Experienced', 18),
  yt('cNzFPWuju8k', 'Amigoscode', 'Top 10 Spring Boot Interview Questions and Answers', 13),
])}
</div>
`,
};

/* ═══════════════════════ 4.6 — Lab: mock backend 45 phút ═══════════════════════ */
const KICH_BAN_EN = `
MOCK INTERVIEW — BACKEND INTERN (45 min)          Interviewer: read aloud, keep time

00:00  Warm-up (5 min)
       "Introduce yourself in about 90 seconds."
       "Which project on your CV are you proudest of?"

05:00  Project deep-dive (10 min)  — pick the candidate's top project
       "Draw the architecture: client, server, database, anything else."
       "Walk me through one request end to end, e.g. creating a booking."
       "What was the hardest bug? How did you find the cause?"
       "What would you change if you started again?"

15:00  Fundamentals (20 min)  — 6 questions, 3 minutes each, follow-up once
       Node track: 4.1-1, 4.1-3, 4.2-1, 4.2-5, 4.3-2, 4.3-5
       Java track: 4.5-1, 4.5-3, 4.5-7, 4.2-1, 4.2-5, 4.3-5

35:00  Code review exercise (5 min) — show the snippet below
       "This endpoint is in a pull request. What would you comment?"

40:00  Candidate's questions (5 min)
       "Do you have any questions for us?"
`;

const KICH_BAN_VI = `
PHỎNG VẤN THỬ — THỰC TẬP BACKEND (45 phút)       Người hỏi: đọc to, canh giờ

00:00  Khởi động (5 phút)
       "Em giới thiệu bản thân trong khoảng 90 giây nhé."
       "Dự án nào trong CV em tự hào nhất?"

05:00  Đào sâu dự án (10 phút)  — chọn dự án đầu CV của ứng viên
       "Em vẽ kiến trúc giúp anh: client, server, CSDL, còn gì nữa."
       "Đi qua một request từ đầu tới cuối, ví dụ tạo một lượt đặt."
       "Lỗi khó nhất là gì? Em tìm ra nguyên nhân thế nào?"
       "Nếu làm lại từ đầu em sẽ đổi gì?"

15:00  Kiến thức nền (20 phút)  — 6 câu, mỗi câu 3 phút, đào sâu một lần
       Nhánh Node: 4.1-1, 4.1-3, 4.2-1, 4.2-5, 4.3-2, 4.3-5
       Nhánh Java: 4.5-1, 4.5-3, 4.5-7, 4.2-1, 4.2-5, 4.3-5

35:00  Bài review code (5 phút) — đưa đoạn mã bên dưới
       "Endpoint này nằm trong một pull request. Em sẽ góp ý gì?"

40:00  Ứng viên hỏi lại (5 phút)
       "Em có câu hỏi gì cho bên anh chị không?"
`;

const MA_REVIEW = `
router.get('/devices/search', async (req, res) => {
  const rows = await db.query("SELECT * FROM devices WHERE name LIKE '%" + req.query.q + "%'");
  res.json(rows);
});

router.delete('/bookings/:id', requireAuth, async (req, res) => {
  db.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
  res.status(200).json({ ok: true });
});
`;

const L46 = {
  title: '4.6 — Lab: a 45-minute backend mock interview with a script and a score sheet|||4.6 — Lab: phỏng vấn thử backend 45 phút có kịch bản và phiếu chấm',
  slug: 'pv-4-6-lab-mock-backend',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab: chạy một buổi phỏng vấn thử backend 45 phút với bạn bè (hoặc tự quay), theo kịch bản canh giờ, nhánh Node hoặc Java, có bài review code bắt lỗi SQL injection/thiếu kiểm quyền/thiếu await, phiếu chấm theo năm tín hiệu, gợi ý đáp án và thử thách thêm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab</span>
<h2>Lab — A 45-minute backend mock interview</h2>
<p class="lead">Reading answers is not the same as giving them. In this lab you sit a real-length backend interview: a timed script, a project deep-dive, six fundamentals questions from this chapter, a code-review exercise and your own questions at the end — then you score yourself on the five signals from Section 0.</p>
<h3>Setting it up</h3>
${flow([
  ['1 · Partner', 'a classmate, a senior, or yourself', 'Best: a friend plays the interviewer with the script below. Alone: put the questions on cards, shuffle, and record yourself on video.'],
  ['2 · Conditions', 'like the real thing', 'Online call or a quiet room, 45 minutes uninterrupted, camera on, no notes except your CV.'],
  ['3 · Run', 'follow the script and the clock', 'The interviewer asks one follow-up per question, using the "likely follow-ups" in Lessons 4.1–4.5.'],
  ['4 · Score', 'right after, while you remember', 'Both of you fill the score sheet; compare. Re-watch the recording at 1.5× speed.'],
])}
${ra(KICH_BAN_EN)}
<h3>The code-review snippet (minute 35)</h3>
${ma('js', MA_REVIEW)}
<details><summary>Hint 1 — how many problems?</summary><p>At least four, in two endpoints. Look at how the query is built, who may delete, whether the delete is awaited, and what is returned.</p></details>
<details><summary>Hint 2 — the full answer</summary><ol><li><strong>SQL injection</strong> in the search: user input concatenated into SQL. Use a parameter: <code>... WHERE name ILIKE $1</code> with <code>[\'%\' + q + \'%\']</code>, and limit the length of <code>q</code>.</li><li><strong>No authentication</strong> on search, and <code>SELECT *</code> may return internal columns — select explicit fields.</li><li><strong>BOLA</strong> on delete: any logged-in user can delete any booking. Add <code>AND user_id = $2</code> (or an admin check) and return 404 when nothing was deleted.</li><li><strong>Missing await</strong>: the response is sent before the delete finishes and errors are lost (an unhandled rejection). Await it and check the affected row count.</li><li>Return <strong>204</strong> (or 200 with the deleted resource); validate that <code>id</code> is a number.</li></ol></details>
<h3>Score sheet (out of 20)</h3>
${rubric('en', [
  ['Fundamentals', 'Wrong or no answer on most questions', 'Correct definitions, little mechanism', 'Definition + mechanism + trade-off on most'],
  ['Reasoning out loud', 'Long silences', 'Thinks aloud sometimes', 'Says what they are checking and why, throughout'],
  ['Ownership of the project', 'Cannot explain parts of own CV', 'Explains the happy path', 'Explains design choices, a real bug and what they would change'],
  ['Code review', 'Found 0–1 issues', 'Found 2–3', 'Found 4+, ordered by severity, with fixes'],
  ['Communication', 'Rambling or one-word answers', 'Mostly clear', 'Structured answers under ~2 minutes, asks when unclear'],
  ['Security reflex', 'Never mentions it', 'When asked', 'Raises ownership/injection unprompted'],
  ['Honesty', 'Bluffs', 'Admits gaps but stops there', 'Admits gaps and reasons toward an answer'],
  ['Questions at the end', 'None', 'Generic', 'Specific to the team and the work'],
  ['Time management', 'Ran out of time', 'Some answers too long', 'Every section on time'],
  ['Overall impression', '"Not yet"', '"Maybe, with mentoring"', '"I would take this intern"'],
])}
<p>Below 10: redo Lessons 4.1–4.3 and run the mock again in three days. 10–15: fix your two lowest rows. Above 15: you are ready for real interviews — book them.</p>
<p><strong>Extra challenge:</strong> run the mock a second time with the other track (Node ↔ Java), or ask your partner to choose questions you have not prepared.</p>
${bay('en', 'grading yourself on how you felt instead of what the recording shows.', 'Almost everyone feels they rambled less and explained more than they did. Score from the recording, with the timer visible. The first time is uncomfortable; it is also the fastest improvement you will get from this whole course.')}
${neu('en', 'you go blank on a question during the mock? Practise the recovery line now, because you will need it in a real interview: "Let me think for a moment… I don’t remember the exact detail, but here is how I would reason about it." Then reason. Silence is the only truly wrong answer.')}
${thucHanh('en', { phut: '60–75', steps: [
  'Book 45 minutes with a partner (or prepare cards and a camera) and choose the Node or Java track.',
  'Run the mock exactly as scripted, including the code review and your questions at the end.',
  'Fill the score sheet independently, compare, and write your two lowest rows with one action each.',
  'Save the recording and the sheet in <code>~/interview-kit/mock/</code> with the date.',
], dat: 'a recorded 45-minute mock exists, both score sheets are filled, and you have two concrete actions from your lowest rows.' })}
${thuatNgu('en', [
  ['Mock interview', 'A practice interview run under real conditions.'],
  ['Deep-dive', 'The part where the interviewer explores one project in detail.'],
  ['Code review', 'Reading someone’s change and commenting on problems and improvements.'],
  ['Score sheet / rubric', 'A fixed table of criteria and levels, so scoring is consistent.'],
  ['Severity', 'How serious a problem is — security bugs first, style last.'],
])}
${tomTat('en', [
  'Practise at full length and under real conditions; reading answers is not practice.',
  'The script mirrors real rounds: warm-up, project deep-dive, fundamentals, code review, your questions.',
  'In code review, look for injection, missing ownership checks, missing awaits and wrong status codes — in that order of severity.',
  'Score from the recording, not from memory; act on the two lowest rows.',
  'Have a recovery line ready for when you go blank.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'git', bai: 'git-6-1-giai-phau-pr', L: 'en', title: 'Git 6.1 — Anatomy of a pull request that gets reviewed', sub: 'The context of the code-review exercise.' }),
  yt('PnQY02QQrYQ', 'theSeniorDev', 'Backend Interview Questions (Junior and Mid)', 19, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab</span>
<h2>Lab — Phỏng vấn thử backend 45 phút</h2>
<p class="lead">Đọc câu trả lời khác hẳn với nói ra câu trả lời. Trong lab này bạn ngồi một buổi phỏng vấn backend dài đúng như thật: kịch bản canh giờ, đào sâu dự án, sáu câu kiến thức nền của chương này, một bài review code và câu hỏi của chính bạn ở cuối — rồi tự chấm theo năm tín hiệu ở Mục 0.</p>
<h3>Chuẩn bị</h3>
${flow([
  ['1 · Bạn tập', 'bạn cùng lớp, anh chị khoá trên, hoặc chính bạn', 'Tốt nhất: một người bạn đóng vai người phỏng vấn theo kịch bản dưới đây. Một mình: chép câu hỏi ra thẻ, xáo lên, và tự quay video.'],
  ['2 · Điều kiện', 'giống như thật', 'Gọi online hoặc phòng yên tĩnh, 45 phút liền không gián đoạn, bật camera, không ghi chú ngoài CV.'],
  ['3 · Chạy', 'theo kịch bản và đồng hồ', 'Người hỏi đào sâu một lần mỗi câu, dùng phần "câu đào sâu hay gặp" ở các bài 4.1–4.5.'],
  ['4 · Chấm', 'ngay sau đó, khi còn nhớ', 'Cả hai cùng điền phiếu chấm rồi so. Xem lại bản quay ở tốc độ 1,5×.'],
])}
${ra(KICH_BAN_VI)}
<h3>Đoạn mã review (phút thứ 35)</h3>
${ma('js', MA_REVIEW)}
<details><summary>Gợi ý 1 — có bao nhiêu lỗi?</summary><p>Ít nhất bốn, trong hai endpoint. Nhìn cách dựng câu truy vấn, ai được xoá, lệnh xoá có được await không, và trả về cái gì.</p></details>
<details><summary>Gợi ý 2 — đáp án đầy đủ</summary><ol><li><strong>SQL injection</strong> ở tìm kiếm: đầu vào của người dùng bị nối vào SQL. Dùng tham số: <code>... WHERE name ILIKE $1</code> với <code>[\'%\' + q + \'%\']</code>, và giới hạn độ dài <code>q</code>.</li><li><strong>Không xác thực</strong> ở tìm kiếm, và <code>SELECT *</code> có thể trả cả cột nội bộ — chọn đúng các trường cần.</li><li><strong>BOLA</strong> ở xoá: mọi người đã đăng nhập đều xoá được lượt đặt bất kỳ. Thêm <code>AND user_id = $2</code> (hoặc kiểm admin) và trả 404 khi không xoá được dòng nào.</li><li><strong>Thiếu await</strong>: response được gửi trước khi xoá xong và lỗi bị mất (một rejection không ai bắt). Hãy await và kiểm số dòng bị ảnh hưởng.</li><li>Trả <strong>204</strong> (hoặc 200 kèm tài nguyên đã xoá); kiểm <code>id</code> là số.</li></ol></details>
<h3>Phiếu chấm (thang 20)</h3>
${rubric('vi', [
  ['Kiến thức nền', 'Sai hoặc không trả lời phần lớn câu', 'Định nghĩa đúng, ít cơ chế', 'Định nghĩa + cơ chế + đánh đổi ở phần lớn câu'],
  ['Suy luận thành tiếng', 'Im lặng lâu', 'Thỉnh thoảng nghĩ thành tiếng', 'Luôn nói mình đang kiểm gì và vì sao'],
  ['Làm chủ dự án', 'Không giải thích nổi phần trong CV của mình', 'Giải thích được đường suôn sẻ', 'Giải thích lựa chọn thiết kế, một lỗi thật và điều sẽ đổi'],
  ['Review code', 'Tìm được 0–1 lỗi', 'Tìm được 2–3', 'Tìm được 4+, xếp theo độ nghiêm trọng, kèm cách sửa'],
  ['Giao tiếp', 'Lan man hoặc trả lời cụt một chữ', 'Phần lớn rõ ràng', 'Câu trả lời có cấu trúc, dưới ~2 phút, hỏi lại khi chưa rõ'],
  ['Phản xạ bảo mật', 'Không bao giờ nhắc', 'Khi được hỏi', 'Tự nêu chuyện kiểm sở hữu/injection'],
  ['Trung thực', 'Chém gió', 'Nhận chưa biết rồi dừng', 'Nhận chưa biết và suy luận tiến tới câu trả lời'],
  ['Câu hỏi cuối buổi', 'Không có', 'Chung chung', 'Cụ thể về đội và công việc'],
  ['Quản lý thời gian', 'Hết giờ giữa chừng', 'Vài câu quá dài', 'Mọi phần đúng giờ'],
  ['Ấn tượng chung', '"Chưa được"', '"Có thể, nếu có người kèm"', '"Mình sẽ nhận bạn intern này"'],
])}
<p>Dưới 10: làm lại bài 4.1–4.3 và chạy lại buổi thử sau ba ngày. 10–15: sửa hai dòng thấp nhất. Trên 15: bạn sẵn sàng cho phỏng vấn thật — đặt lịch đi.</p>
<p><strong>Thử thách thêm:</strong> chạy buổi thử lần hai với nhánh còn lại (Node ↔ Java), hoặc nhờ bạn tập chọn những câu bạn chưa chuẩn bị.</p>
${bay('vi', 'tự chấm theo cảm giác thay vì theo bản quay.', 'Gần như ai cũng cảm thấy mình nói ít lan man hơn và giải thích nhiều hơn thực tế. Hãy chấm từ bản quay, có đồng hồ hiện trên màn hình. Lần đầu sẽ khó chịu; nó cũng là bước tiến nhanh nhất bạn có được từ cả khoá này.')}
${neu('vi', 'bạn bị trống rỗng ở một câu trong buổi thử? Tập ngay câu cứu nguy, vì bạn sẽ cần nó trong buổi thật: "Cho em nghĩ một chút… Em không nhớ chính xác chi tiết, nhưng em sẽ suy luận thế này." Rồi suy luận. Im lặng mới là câu trả lời sai duy nhất.')}
${thucHanh('vi', { phut: '60–75', steps: [
  'Hẹn 45 phút với một bạn tập (hoặc chuẩn bị thẻ câu hỏi và camera) và chọn nhánh Node hoặc Java.',
  'Chạy buổi thử đúng kịch bản, kể cả bài review code và phần bạn hỏi lại ở cuối.',
  'Mỗi người tự điền phiếu chấm, rồi so, và ghi hai dòng thấp nhất kèm mỗi dòng một việc cần làm.',
  'Lưu bản quay và phiếu vào <code>~/interview-kit/mock/</code> kèm ngày.',
], dat: 'có một bản quay buổi thử 45 phút, cả hai phiếu chấm đã điền, và bạn có hai việc cụ thể từ hai dòng thấp nhất.' })}
${thuatNgu('vi', [
  ['Mock interview (phỏng vấn thử)', 'Buổi phỏng vấn tập chạy trong điều kiện như thật.'],
  ['Deep-dive (đào sâu)', 'Phần người phỏng vấn khám phá chi tiết một dự án.'],
  ['Code review (rà soát mã)', 'Đọc thay đổi của người khác và góp ý về lỗi và chỗ cải thiện.'],
  ['Score sheet / rubric (phiếu chấm)', 'Bảng tiêu chí và mức cố định, để chấm nhất quán.'],
  ['Severity (mức nghiêm trọng)', 'Một vấn đề nghiêm trọng tới đâu — lỗi bảo mật trước, văn phong sau.'],
])}
${tomTat('vi', [
  'Tập đủ độ dài và trong điều kiện như thật; đọc câu trả lời không phải là tập.',
  'Kịch bản phản chiếu vòng thật: khởi động, đào sâu dự án, kiến thức nền, review code, câu hỏi của bạn.',
  'Khi review code, tìm injection, thiếu kiểm sở hữu, thiếu await và sai mã trạng thái — theo thứ tự nghiêm trọng đó.',
  'Chấm từ bản quay, không từ trí nhớ; hành động ở hai dòng thấp nhất.',
  'Luôn có sẵn câu cứu nguy cho lúc đầu óc trống rỗng.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'git', bai: 'git-6-1-giai-phau-pr', title: 'Git 6.1 — Giải phẫu một pull request được review', sub: 'Bối cảnh của bài review code.' }),
  yt('PnQY02QQrYQ', 'theSeniorDev', 'Backend Interview Questions (Junior and Mid)', 19),
])}
</div>
`,
};

/* ═══════════════════════ 4.7 — Quiz ═══════════════════════ */
const Q47 = {
  title: '4.7 — Chapter 4 check|||4.7 — Kiểm tra Chương 4',
  slug: 'pv-4-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về vòng kỹ thuật backend: event loop bị nghẽn, thứ tự microtask, chỉ mục không được dùng, LEFT JOIN, đặt trùng, mã trạng thái, BOLA, refresh token, mock CSDL, equals/hashCode và @Transactional.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Chapter 4 check — the backend round</h2>
<p class="lead">Ten situations taken from real backend interviews and real incidents. Read every explanation — the wrong options are the answers candidates actually give.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the event loop and what blocks it, with a fix for each size of problem.</li>
<li>I can say why an index is not used and prove it with EXPLAIN ANALYZE.</li>
<li>I can prevent double booking in three ways.</li>
<li>I can point at the ownership check in my own endpoints.</li>
<li>I can explain equals/hashCode and when @Transactional does not work.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Kiểm tra Chương 4 — vòng backend</h2>
<p class="lead">Mười tình huống lấy từ phỏng vấn backend thật và sự cố thật. Đọc mọi lời giải thích — các phương án sai chính là câu trả lời ứng viên hay đưa ra.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được event loop và thứ làm nó nghẽn, kèm cách sửa cho từng cỡ vấn đề.</li>
<li>Tôi nói được vì sao chỉ mục không được dùng và chứng minh bằng EXPLAIN ANALYZE.</li>
<li>Tôi chặn được đặt trùng bằng ba cách.</li>
<li>Tôi chỉ được vào chỗ kiểm sở hữu trong endpoint của chính mình.</li>
<li>Tôi giải thích được equals/hashCode và khi nào @Transactional không có tác dụng.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('Every endpoint of a Node API, including /health, becomes slow at the same moment while one CPU core sits at 100%. What is the most likely cause?|||Mọi endpoint của một API Node, kể cả /health, cùng chậm một lúc trong khi một nhân CPU chạy 100%. Nguyên nhân khả dĩ nhất là gì?', [
        'The database connection pool is too small|||Pool kết nối CSDL quá nhỏ',
        'Synchronous CPU-heavy work is blocking the event loop|||Một việc đồng bộ nặng CPU đang chặn event loop',
        'The network between client and server is congested|||Mạng giữa client và server bị nghẽn',
        'Too many Promises are pending at once|||Có quá nhiều Promise đang chờ cùng lúc',
      ], 1, 'EN: "Everything slow together" plus one core at 100% is the signature of a blocked loop. A small pool would slow database routes, not /health. Pending Promises cost almost nothing while they wait.|||VI: "Mọi thứ cùng chậm" cộng một nhân 100% là chữ ký của event loop bị chặn. Pool nhỏ chỉ làm chậm route dùng CSDL, không làm chậm /health. Promise đang chờ gần như không tốn gì.'),
      cau('In the main module: console.log(1); setTimeout(() => log(2)); Promise.resolve().then(() => log(3)); process.nextTick(() => log(4)); console.log(5). Which prefix of the output is guaranteed?|||Ở module chính: console.log(1); setTimeout(() => log(2)); Promise.resolve().then(() => log(3)); process.nextTick(() => log(4)); console.log(5). Phần đầu nào của output được bảo đảm?', [
        '1 5 3 4',
        '1 2 3 4 5',
        '1 5 4 3',
        '1 4 3 5',
      ], 2, 'EN: Synchronous code first (1, 5), then the nextTick queue (4) before Promise microtasks (3), then the timer (2). "1 5 3 4" is tempting but puts Promises before nextTick.|||VI: Mã đồng bộ trước (1, 5), rồi hàng nextTick (4) trước microtask của Promise (3), rồi mới tới timer (2). "1 5 3 4" hấp dẫn nhưng đặt Promise trước nextTick.'),
      cau('There is an index on users(email), yet EXPLAIN shows a sequential scan for WHERE lower(email) = $1. Why?|||Có chỉ mục trên users(email), nhưng EXPLAIN cho thấy quét tuần tự với WHERE lower(email) = $1. Vì sao?', [
        'The table statistics are always wrong for text columns|||Thống kê bảng luôn sai với cột text',
        'B-tree indexes cannot store text|||Chỉ mục B-tree không lưu được text',
        'The query needs ORDER BY to use an index|||Truy vấn phải có ORDER BY mới dùng được chỉ mục',
        'The function wraps the column, so the index on the raw column cannot be used — create an index on lower(email)|||Hàm bọc lấy cột nên chỉ mục trên cột gốc không dùng được — hãy tạo chỉ mục trên lower(email)',
      ], 3, 'EN: The index stores email values, not lower(email) values. An expression index (or storing a normalised column) fixes it. Statistics can be stale, but they are not the reason here.|||VI: Chỉ mục lưu giá trị email, không lưu giá trị lower(email). Chỉ mục biểu thức (hoặc lưu sẵn một cột đã chuẩn hoá) sẽ sửa được. Thống kê có thể cũ, nhưng không phải lý do ở đây.'),
      cau('A report must list ALL customers with their number of PAID orders, including customers with zero. Which query is correct?|||Báo cáo phải liệt kê MỌI khách kèm số đơn ĐÃ THANH TOÁN, kể cả khách có 0 đơn. Truy vấn nào đúng?', [
        'LEFT JOIN orders o ON o.customer_id = c.id AND o.status = \'PAID\', then COUNT(o.id)',
        'LEFT JOIN orders o ON o.customer_id = c.id WHERE o.status = \'PAID\', then COUNT(o.id)',
        'INNER JOIN orders o ON o.customer_id = c.id AND o.status = \'PAID\', then COUNT(*)',
        'LEFT JOIN orders o ON o.customer_id = c.id AND o.status = \'PAID\', then COUNT(*)',
      ], 0, 'EN: The status filter must be in ON so unmatched customers survive, and COUNT(o.id) counts 0 for them. Putting it in WHERE turns the LEFT JOIN into an INNER JOIN; COUNT(*) would count 1 for a customer with no orders.|||VI: Điều kiện status phải ở ON để khách không khớp vẫn còn, và COUNT(o.id) đếm ra 0 cho họ. Đặt ở WHERE biến LEFT JOIN thành INNER JOIN; COUNT(*) sẽ đếm 1 cho khách không có đơn.'),
      cau('Two students book the last oscilloscope at the same moment. The code runs SELECT available, checks it is > 0 in Java, then UPDATE — inside @Transactional with the default isolation. What happens?|||Hai sinh viên cùng đặt chiếc máy hiện sóng cuối cùng đúng một lúc. Mã chạy SELECT available, kiểm > 0 trong Java, rồi UPDATE — bên trong @Transactional với mức cô lập mặc định. Chuyện gì xảy ra?', [
        'The transaction prevents it; one of them gets an error|||Giao dịch chặn được; một người nhận lỗi',
        'PostgreSQL detects the conflict and retries automatically|||PostgreSQL phát hiện xung đột và tự thử lại',
        'Both can succeed — use an atomic conditional UPDATE, SELECT … FOR UPDATE, a version column or a constraint|||Cả hai có thể cùng thành công — hãy dùng UPDATE nguyên tử có điều kiện, SELECT … FOR UPDATE, cột version hoặc một ràng buộc',
        'Only the first one can read the row|||Chỉ người đầu đọc được dòng đó',
      ], 2, 'EN: At READ COMMITTED both transactions can read "1" before either writes. "The transaction prevents it" is the most common wrong answer in real interviews.|||VI: Ở READ COMMITTED, cả hai giao dịch có thể đọc ra "1" trước khi bên nào ghi. "Giao dịch chặn được" là câu trả lời sai hay gặp nhất trong phỏng vấn thật.'),
      cau('After a deploy, an unauthenticated curl to a protected route returns 404 instead of the expected 401. What does it most likely mean?|||Sau deploy, curl không đăng nhập vào một route cần xác thực trả 404 thay vì 401 như mong đợi. Điều đó nhiều khả năng nghĩa là gì?', [
        'The route is not mounted in the running build — suspect a stale or partial build|||Route không được gắn trên bản đang chạy — nghi bản build cũ hoặc dở dang',
        'Authentication works correctly|||Xác thực đang chạy đúng',
        'The database is down|||CSDL đang sập',
        'The user does not exist|||Người dùng không tồn tại',
      ], 0, 'EN: 401 would prove the route exists and is protected; 404 says the router does not know the path at all. A database outage would usually produce 500 or 503, not 404.|||VI: 401 sẽ chứng minh route tồn tại và được bảo vệ; 404 nói bộ định tuyến hoàn toàn không biết đường dẫn đó. CSDL sập thường ra 500 hoặc 503, không ra 404.'),
      cau('GET /bookings/:id requires login, but any logged-in user can read any booking by changing the id. Which fix is right?|||GET /bookings/:id cần đăng nhập, nhưng ai đã đăng nhập cũng đọc được mọi lượt đặt bằng cách đổi id. Cách sửa nào đúng?', [
        'Switch ids to UUIDs|||Đổi id sang UUID',
        'Add CORS so only our frontend can call it|||Thêm CORS để chỉ frontend của mình gọi được',
        'Hide the id from the URL and send it in the body|||Giấu id khỏi URL và gửi trong body',
        'Put the ownership condition in the query (id AND userId) and return 404 when not found|||Đặt điều kiện sở hữu trong truy vấn (id VÀ userId) và trả 404 khi không thấy',
      ], 3, 'EN: This is BOLA; only an ownership check fixes it. UUIDs make guessing harder but do not stop someone who has an id; CORS does not stop curl or scripts at all.|||VI: Đây là BOLA; chỉ kiểm sở hữu mới sửa được. UUID làm khó đoán hơn nhưng không chặn người đã có id; CORS hoàn toàn không chặn curl hay script.'),
      cau('Users get logged out after exactly 24 hours although the cookie lives 7 days. The JWT expires at 24h and the frontend calls a refresh route that does not exist. What is the best fix?|||Người dùng bị đăng xuất sau đúng 24 giờ dù cookie sống 7 ngày. JWT hết hạn sau 24 giờ và frontend gọi một route làm mới không tồn tại. Cách sửa tốt nhất?', [
        'Make the JWT last 7 days|||Cho JWT sống 7 ngày',
        'Implement a real refresh endpoint and have the client refresh once on 401, then retry|||Làm endpoint làm mới thật và để client làm mới một lần khi gặp 401, rồi gửi lại',
        'Shorten the cookie to 24 hours|||Rút cookie xuống 24 giờ',
        'Store the token in localStorage instead|||Chuyển token sang localStorage',
      ], 1, 'EN: A refresh path keeps access tokens short-lived and sessions alive. A 7-day JWT "works" but widens the damage window if it leaks; a 24h cookie just makes the logout official; localStorage adds XSS risk and fixes nothing.|||VI: Có đường làm mới thì access token vẫn sống ngắn mà phiên vẫn còn. JWT 7 ngày thì "chạy" nhưng nới rộng khoảng thiệt hại nếu bị lộ; cookie 24 giờ chỉ biến việc đăng xuất thành chính thức; localStorage thêm rủi ro XSS mà không sửa gì.'),
      cau('Your unit tests mock every Prisma call and are all green, yet a wrong WHERE clause reached production. What would have caught it?|||Unit test của bạn mock mọi lời gọi Prisma và đều xanh, vậy mà một mệnh đề WHERE sai vẫn lọt lên production. Cái gì đã có thể bắt được nó?', [
        'More mocks with stricter call assertions|||Thêm mock với assertion về lời gọi chặt hơn',
        'Raising coverage to 100%|||Nâng độ phủ lên 100%',
        'An integration test against a real test database|||Một integration test chạy với CSDL test thật',
        'Running the tests twice in CI|||Chạy test hai lần trên CI',
      ], 2, 'EN: Only a real database executes the real SQL. Stricter mocks still test your assumptions about the query, and 100% coverage can be reached by the same mocked tests.|||VI: Chỉ CSDL thật mới chạy SQL thật. Mock chặt hơn vẫn chỉ kiểm giả định của bạn về truy vấn, và 100% độ phủ có thể đạt bằng chính những test đã mock đó.'),
      cau('A Spring service method calls this.saveAll() — annotated @Transactional — from inside the same class, and a failure halfway does not roll back. Why?|||Một phương thức service Spring gọi this.saveAll() — có @Transactional — từ bên trong cùng lớp, và lỗi giữa chừng không quay lui. Vì sao?', [
        'Self-invocation bypasses the Spring proxy, so no transaction was started|||Tự gọi trong cùng lớp đi vòng qua proxy của Spring, nên không giao dịch nào được mở',
        '@Transactional only works on repositories|||@Transactional chỉ chạy trên repository',
        'PostgreSQL does not support rollbacks for batch inserts|||PostgreSQL không hỗ trợ quay lui cho chèn hàng loạt',
        'The method must also be annotated @Service|||Phương thức phải gắn thêm @Service',
      ], 0, 'EN: Transactions are applied by the proxy around the bean; this.saveAll() calls the raw object. Move the method to another bean or call it through the proxy. The other options describe rules that do not exist.|||VI: Giao dịch được áp bởi proxy bọc quanh bean; this.saveAll() gọi thẳng object gốc. Chuyển phương thức sang bean khác hoặc gọi qua proxy. Các phương án còn lại mô tả những luật không có thật.'),
    ],
  },
};

export default {
  title: 'Chapter 4 — Backend technical round|||Chương 4 — Vòng kỹ thuật backend',
  description: 'Node.js, SQL, API, bảo mật, testing, Java/OOP và Spring Boot: mỗi bài là bộ câu hỏi thật hay gặp kèm câu trả lời mẫu có chiều sâu, câu đào sâu tiếp và lỗi trả lời hay gặp, dựa trên sự cố thật của một hệ thống đang chạy; kết thúc bằng buổi phỏng vấn thử 45 phút có phiếu chấm và quiz 10 câu.',
  lessons: [L41, L42, L43, L44, L45, L46, Q47],
};
