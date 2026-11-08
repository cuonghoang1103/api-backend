// Node.js 2.1 — What Node.js actually is (V8 + libuv + bindings). Bài khái niệm ⇒ table/order/choice + một bài viết hàm nhỏ.
import { modul, cs, jsBai, q, ord, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('runtime', 'môi trường chạy', 'The whole box that executes JavaScript outside a browser: V8 + libuv + bindings + the standard library.'),
  tn('V8', 'V8', 'Google\'s JavaScript engine: compiles and runs your code, manages memory. Knows nothing about files or sockets.'),
  tn('libuv', 'libuv', 'C library giving Node its event loop, async I/O and a thread pool (4 threads by default).'),
  tn('bindings', 'lớp nối (binding)', 'C++ glue: fs.readFile in JS ends up calling the operating system.'),
  tn('single-threaded', 'đơn luồng', 'ONE thread runs your JavaScript; Node itself still uses other threads underneath.'),
  tn('thread pool', 'nhóm luồng', 'libuv worker threads for file I/O, DNS lookups, zlib and some crypto.'),
];

export default modul('nodejs-2-1-runtime-la-gi', '2.1 What Node.js actually is', [
  cs({
    ten: 'Which part of the box does the job?',
    kho: 'EASY', phut: 6, loai: 'table',
    en: 'The lesson draws Node as layers: your JavaScript → the Node standard library → C++ bindings → V8 and libuv → the operating system. For each job, choose the part that actually does it.',
    vi: 'Bài học vẽ Node thành các tầng: JavaScript của bạn → thư viện chuẩn Node → C++ bindings → V8 và libuv → hệ điều hành. Với mỗi việc, chọn phần thật sự làm việc đó.',
    bang: [bang1('p1', ['Who does it?', 'Ai làm?'],
      [{ ma: 'viec', ten: 'Job|||Việc' }, { ma: 'ai', ten: 'Part|||Phần', luaChon: ['V8', 'libuv', 'C++ bindings', 'Node standard library (fs, http, crypto…)'] }],
      [
        { o: { viec: 'Compile your JavaScript to machine code and run it' }, a: { ai: 'V8' } },
        { o: { viec: 'Garbage-collect objects you no longer reference' }, a: { ai: 'V8' } },
        { o: { viec: 'Run the event loop and notice that a socket became readable' }, a: { ai: 'libuv' } },
        { o: { viec: 'Keep a pool of 4 threads for file I/O and DNS lookups' }, a: { ai: 'libuv' } },
        { o: { viec: 'Glue: turn a JS call like fs.readFile into an operating-system call and hand the result back to V8' }, a: { ai: 'C++ bindings' } },
        { o: { viec: 'Give you the JavaScript API you actually call: readFile, createServer, randomUUID' }, a: { ai: 'Node standard library (fs, http, crypto…)' } },
      ],
      ['V8 only executes JavaScript and manages memory — it has no idea what a file is. libuv owns the loop, async I/O and the thread pool. The bindings are the bridge between the two worlds, and the standard library is the JavaScript face you program against (<code>node -p "process.versions.v8"</code> and <code>"process.versions.uv"</code> print the two engines inside your own Node).', 'V8 chỉ chạy JavaScript và quản lý bộ nhớ — không biết tệp là gì. libuv giữ vòng lặp, I/O bất đồng bộ và nhóm luồng. Bindings là cầu nối hai thế giới, còn thư viện chuẩn là bộ mặt JavaScript bạn lập trình với nó.'])],
    goiY: [
      ['If the job is about executing or memory ⇒ V8. If it is about waiting, I/O or threads ⇒ libuv.', 'Việc về thực thi hay bộ nhớ ⇒ V8. Về chờ, I/O hay luồng ⇒ libuv.'],
      ['"Glue" and "bridge" are the bindings\' words in the lesson.', '"Keo dán", "cầu nối" là từ bài học dùng cho bindings.'],
    ],
    loi: [
      ['Thinking V8 reads files — the same V8 runs in Chrome, where JavaScript is forbidden to read your disk.', 'Nghĩ V8 đọc tệp — cùng V8 đó chạy trong Chrome, nơi JavaScript bị cấm đọc ổ đĩa.'],
      ['Thinking the event loop is part of V8 — it is libuv\'s.', 'Nghĩ event loop là của V8 — nó là của libuv.'],
    ],
    tns: TN,
  }),

  cs({
    ten: '"Single-threaded" — precisely',
    kho: 'EASY', phut: 6,
    en: 'The lesson calls "Node is single-threaded" true and misleading at the same time. Pick the precise statement each time.',
    vi: 'Bài học nói "Node đơn luồng" vừa đúng vừa dễ hiểu sai. Mỗi câu chọn phát biểu chính xác.',
    cau: [
      q('s1', ['Which sentence is precise?', 'Câu nào chính xác?'],
        ['ONE thread runs your JavaScript; libuv still uses other threads underneath', 'Node uses exactly one thread for everything', 'Node runs each request on its own thread', 'Node runs JavaScript on 4 threads by default'],
        ['Your code runs on one thread, so two lines of it never execute at the same time. Underneath, libuv keeps a pool (4 by default) for file I/O, DNS and some crypto, and the OS handles sockets.', 'Code của bạn chạy trên một luồng nên hai dòng không bao giờ chạy cùng lúc. Bên dưới, libuv giữ nhóm luồng (mặc định 4) cho I/O tệp, DNS và một phần crypto; hệ điều hành lo socket.']),
      q('s2', ['Why do you never need a lock (mutex) around your own JavaScript variables in Node?', 'Vì sao không bao giờ cần khoá (mutex) quanh biến JavaScript của mình?'],
        ['Only one thread ever runs your JavaScript, so two pieces of it never touch a variable at the same moment', 'V8 silently adds a lock around every variable that two callbacks share', 'Each request gets its own copy of every variable, so nothing is ever shared', 'libuv freezes all variables while a callback runs and unfreezes them afterwards'],
        ['A callback runs to completion before the next one starts. Races can still happen across <code>await</code> points (state changed while you waited), but never in the middle of a synchronous line.', 'Một callback chạy xong mới tới cái sau. Vẫn có thể "đua" quanh các điểm await (trạng thái đổi trong lúc chờ), nhưng không bao giờ giữa một dòng đồng bộ.']),
      q('s3', ['"Brilliant at waiting, terrible at thinking." Which endpoint is the WRONG job for one Node process?', 'Endpoint nào là việc SAI cho một process Node?'],
        ['Resizing a 20 MB image with a pure-JavaScript library inside the request', 'Reading a note from PostgreSQL and returning it', 'Calling another API and forwarding the answer', 'Streaming a file from object storage to the client'],
        ['The other three are mostly waiting, which is free. A pure-JS image resize is computation on the one JS thread: while it runs, nothing else in the process can. The lesson\'s cure comes in 2.5 (worker or queue); this site uses sharp, a native library that works on libuv\'s pool.', 'Ba cái kia chủ yếu là chờ — miễn phí. Resize ảnh bằng JS thuần là tính toán trên luồng JS duy nhất: trong lúc nó chạy, không gì khác chạy được. Cách chữa ở bài 2.5; web này dùng sharp, thư viện native chạy trên nhóm luồng của libuv.']),
      q('s4', ['A login endpoint runs <code>crypto.pbkdf2</code> (async) on every request. Under load, unrelated <code>fs.readFile</code> calls get slow although the disk is idle. Why?', 'Endpoint đăng nhập chạy crypto.pbkdf2 (async) mỗi request. Khi tải cao, fs.readFile không liên quan cũng chậm dù đĩa rảnh. Vì sao?'],
        ['Both use libuv\'s 4-thread pool; the hashes occupy it, so file reads queue behind them', 'The async pbkdf2 secretly runs on the main JavaScript thread and blocks it', 'The operating system\'s disk cache is full of password hashes and must be flushed', 'V8 garbage collection pauses the process for every hash that finishes'],
        ['The lesson\'s trap: an async pbkdf2 does not block your JS thread, but it does occupy a pool thread. Four concurrent hashes fill the default pool; the next file read waits for a free thread. The knob is <code>UV_THREADPOOL_SIZE</code>.', 'Cái bẫy của bài: pbkdf2 async không chặn luồng JS nhưng chiếm một luồng của nhóm. Bốn lần băm đồng thời lấp đầy nhóm mặc định; lần đọc tệp kế tiếp chờ luồng rảnh. Núm vặn là UV_THREADPOOL_SIZE.']),
    ],
    goiY: [
      ['Keep two pictures apart: the one JS thread (your code) and the threads underneath (libuv pool, the OS).', 'Tách hai hình: một luồng JS (code của bạn) và các luồng bên dưới (nhóm libuv, hệ điều hành).'],
      ['Waiting is free for the JS thread; computing is not.', 'Chờ là miễn phí với luồng JS; tính toán thì không.'],
    ],
    loi: [
      ['Reading "single-threaded" as "Node uses one thread" and being surprised by pool exhaustion.', 'Hiểu "đơn luồng" là "Node dùng một luồng" rồi bất ngờ khi nhóm luồng cạn.'],
      ['Believing an async API is always free — pool-backed calls queue when the pool is full.', 'Tin API async luôn miễn phí — lời gọi dùng nhóm luồng xếp hàng khi nhóm đầy.'],
    ],
    tns: TN,
  }),

  cs({
    ten: 'Where the request actually goes',
    kho: 'MEDIUM', phut: 5, loai: 'order',
    en: 'Put the life of one <code>GET /notes/42</code> request in order, the way the lesson traces it.',
    vi: 'Xếp vòng đời của một request GET /notes/42 theo đúng thứ tự bài học vẽ.',
    cau: [
      ord('o1', ['Order the steps of one request.', 'Sắp các bước của một request.'], [
        'libuv sees the socket become readable and queues the callback',
        'Your handler runs on the single JavaScript thread, in V8',
        'The handler awaits the database query — it pauses, and the thread is free for other requests',
        'The database answer arrives; libuv queues your continuation',
        'The handler resumes on the JS thread and sends the response',
      ], ['Step 3 is the whole point: in a thread-per-request server the waiting thread would sit idle holding memory; in Node the one thread immediately serves the next request, which is why one process can hold tens of thousands of connections.', 'Bước 3 là điểm mấu chốt: ở server mỗi-request-một-luồng, luồng đang chờ nằm không và giữ bộ nhớ; ở Node luồng duy nhất lập tức phục vụ request kế tiếp — nhờ vậy một process giữ được hàng chục nghìn kết nối.']),
      ord('o2', ['Order the layers from your code down to the hardware.', 'Sắp các tầng từ code của bạn xuống phần cứng.'], [
        'Your JavaScript and npm packages',
        'Node standard library (fs, http, crypto…)',
        'C++ bindings',
        'V8 and libuv',
        'Operating system (files, network, processes)',
      ], ['That is the lesson\'s "three parts in one box" diagram read top to bottom: you call the standard library, it crosses the bindings, V8 runs the JS while libuv talks to the operating system.', 'Đó là sơ đồ "ba phần trong một hộp" đọc từ trên xuống: bạn gọi thư viện chuẩn, nó đi qua bindings, V8 chạy JS còn libuv nói chuyện với hệ điều hành.']),
    ],
    goiY: [
      ['The request starts outside your code (a socket) and must pass through libuv before your handler runs.', 'Request bắt đầu ngoài code của bạn (một socket) và phải qua libuv trước khi handler chạy.'],
      ['An <code>await</code> splits the handler in two: before the wait and after it.', 'Một await chia handler làm hai: trước lúc chờ và sau lúc chờ.'],
    ],
    loi: [
      ['Putting "handler runs" first — nothing runs your code until libuv reports the readable socket.', 'Đặt "handler chạy" đầu tiên — không gì chạy code của bạn trước khi libuv báo socket đọc được.'],
      ['Thinking the thread waits with the handler during the database query.', 'Nghĩ luồng chờ cùng handler trong lúc truy vấn CSDL.'],
    ],
    tns: TN,
  }),

  jsBai({
    ten: 'Waiting is free: serve 50 requests with one thread',
    kho: 'MEDIUM', phut: 12,
    en: `<p>Prove step 3 of the lesson in code. <code>handleAll(ids, db)</code> receives the ids of 50 requests; each request needs <code>await db.query(id)</code>, which waits 100 ms (I/O, not computation). Handle them so the single JS thread overlaps the waiting: all 50 must finish in about <b>100 ms</b>, not 5 000 ms. Return the answers in the order of <code>ids</code>, plus the largest number of queries that were in flight at the same moment (the fake <code>db</code> tracks it as <code>db.peak</code>).</p>${pre("const t = Date.now();\nconst out = await handleAll([1, 2, 3], db);   // { answers: ['note 1', 'note 2', 'note 3'], peak: 3 }\nDate.now() - t;                                // 100 — one thread, three waits at once")}<p>The starter handles requests one by one, like a thread-per-request server with a single thread: 100 ms × n.</p>`,
    vi: `<p>Chứng minh bước 3 của bài bằng code. handleAll(ids, db): mỗi request cần await db.query(id) chờ 100 ms (I/O, không tính toán). Xử lý sao cho luồng JS duy nhất chồng các lượt chờ lên nhau: 50 request xong trong khoảng 100 ms, không phải 5 000 ms. Trả câu trả lời theo thứ tự ids và số truy vấn đang chạy cùng lúc nhiều nhất (db.peak). Code khởi đầu xử lý lần lượt: 100 ms × n.</p>`,
    yc: [
      ['Return <code>{ answers, peak }</code>; <code>answers[i]</code> is the result for <code>ids[i]</code>.', 'Trả { answers, peak }; answers[i] là kết quả của ids[i].'],
      ['Total time ≈ one query (all waits overlap).', 'Tổng thời gian ≈ một truy vấn (mọi lượt chờ chồng nhau).'],
      ['Read <code>peak</code> from <code>db.peak</code> after everything finished.', 'Đọc peak từ db.peak sau khi mọi thứ xong.'],
    ],
    goiY: [
      ['Start every query first (<code>ids.map((id) =&gt; db.query(id))</code>), then wait for all of them.', 'Bắt đầu mọi truy vấn trước (ids.map((id) => db.query(id))), rồi chờ tất cả.'],
      ['<code>Promise.all</code> keeps the input order in its result array, whatever finished first.', 'Promise.all giữ thứ tự đầu vào trong mảng kết quả, bất kể cái nào xong trước.'],
    ],
    loi: [
      ['<code>for … of</code> + <code>await</code> (the starter): correct answers, but each request waits for the previous one — the slow model the lesson contrasts Node with.', 'for…of + await (code khởi đầu): đúng kết quả nhưng request nào cũng chờ cái trước — đúng mô hình chậm mà bài so sánh với Node.'],
      ['Reading <code>db.peak</code> before awaiting — it is still 0 or partial.', 'Đọc db.peak trước khi await — vẫn là 0 hoặc dở dang.'],
    ],
    gt: ['A query that is waiting does not need the JS thread. Starting all of them before waiting lets libuv hold 50 pending operations while the thread is idle; when the answers arrive their continuations run one after another in microseconds. That is why one Node process can keep tens of thousands of connections open — and why the same trick does nothing for CPU work, which has no waiting to overlap.',
      'Một truy vấn đang chờ không cần luồng JS. Bắt đầu tất cả trước khi chờ để libuv giữ 50 thao tác đang treo trong khi luồng rảnh; khi câu trả lời tới, phần tiếp theo của chúng chạy lần lượt trong vài micro giây. Vì vậy một process Node giữ được hàng chục nghìn kết nối — và cũng vì vậy mẹo này vô dụng với việc tính toán, vốn không có lượt chờ nào để chồng.'],
    kn: ['non-blocking I/O', 'concurrency on one thread', 'Promise.all'],
    tns: TN,
    viDu: [{ input: 'await handleAll([1, 2, 3], db)', output: '{"answers":["note 1","note 2","note 3"],"peak":3} after 100 ms', explanation: 'The starter takes 300 ms with peak 1.|||Code khởi đầu mất 300 ms, peak 1.' }],
    chung: `const mkDb = (ms = 100) => { const db = { inFlight: 0, peak: 0 };
  db.query = (id) => { db.inFlight++; db.peak = Math.max(db.peak, db.inFlight);
    return new Promise((ok) => setTimeout(() => { db.inFlight--; ok('note ' + id); }, ms)); };
  return db; };`,
    dau: `async function handleAll(ids, db) {
  const answers = [];
  for (const id of ids) {
    answers.push(await db.query(id));
  }
  return { answers, peak: db.peak };
}
`,
    giai: `// One JS thread, many waits in flight: start every query, THEN wait.
async function handleAll(ids, db) {
  const pending = ids.map((id) => db.query(id)); // all 50 are now waiting on I/O at once
  const answers = await Promise.all(pending);    // input order kept, whatever finished first
  return { answers, peak: db.peak };             // read after everything finished
}
`,
    cases: [
      { moTa: ['answers in input order', 'kết quả đúng thứ tự'], chuanBi: 'const db = mkDb();', goi: 'await handleAll([1, 2, 3], db)' },
      { moTa: ['50 requests in ≈100 ms (virtual clock)', '50 request trong ≈100 ms'], chuanBi: 'const db = mkDb(); const ids = Array.from({ length: 50 }, (_, i) => i + 1); const t = Date.now(); const r = await handleAll(ids, db);', goi: '[Date.now() - t, r.peak, r.answers.length]' },
      { an: true, chuanBi: 'const db = mkDb(250); const t = Date.now(); const r = await handleAll([9, 4, 7, 1], db);', goi: '[r, Date.now() - t]' },
      { an: true, chuanBi: 'const db = mkDb();', goi: 'await handleAll([], db)' },
    ],
  }),
]);
