// Node.js 2.5 — Getting heavy work off the loop. Máy chấm không có worker_threads/cluster/setImmediate thật ⇒ phần "chọn cách chữa"
// hỏi bằng table/choice; phần code mô hình hoá đúng ý bài: nhường lượt tiêm vào (yieldToLoop), kho đếm dùng chung giữa các
// "process" (vai trò Redis), nhóm worker cố định (không sinh worker cho mỗi request). Hẹn giờ/đồng hồ là giờ ảo của máy chấm.
import { modul, cs, jsBai, q, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('worker thread', 'luồng worker', 'A separate JS thread with its own V8 instance and event loop; talks to the main thread by messages.'),
  tn('chunking', 'chia lát', 'Split a long loop into slices and yield to the loop (setImmediate) between them.'),
  tn('cluster', 'cluster', 'Several Node processes sharing one port — one per core; in-memory state is per process.'),
  tn('message passing', 'truyền thông điệp', 'postMessage copies data between threads; no shared variables.'),
  tn('worker pool', 'nhóm worker', 'A small fixed set of workers reused for many jobs — never one worker per request.'),
];

export default modul('nodejs-2-5-worker-threads', '2.5 Getting heavy work off the loop', [
  cs({
    ten: 'Pick the cure: worker, chunks, cluster or queue',
    kho: 'EASY', phut: 6, loai: 'table',
    en: 'The lesson\'s "How to choose" table as decisions. For each situation, pick the cure the lesson recommends.',
    vi: 'Bảng "Chọn thế nào" của bài dưới dạng quyết định. Chọn cách chữa bài học khuyên cho từng tình huống.',
    bang: [bang1('c1', ['Choose the cure.', 'Chọn cách chữa.'],
      [{ ma: 'tinh', ten: 'Situation|||Tình huống' }, { ma: 'cure', ten: 'Cure|||Cách chữa', luaChon: ['worker thread', 'chunk it with setImmediate', 'cluster (more processes)', 'background queue'] }],
      [
        { o: { tinh: 'Parsing a 200 MB CSV upload takes 4 s of CPU; the user waits for the parsed result' }, a: { cure: 'worker thread' } },
        { o: { tinh: 'A loop you wrote over 2 million notes to rebuild a search index; it can be paused at any item' }, a: { cure: 'chunk it with setImmediate' } },
        { o: { tinh: 'The API is healthy but one process uses 1 of the server\'s 8 cores at 100%' }, a: { cure: 'cluster (more processes)' } },
        { o: { tinh: 'Generating video thumbnails after upload; the user only needs the upload to succeed' }, a: { cure: 'background queue' } },
        { o: { tinh: 'Sending a weekly email to 30 000 users; must survive a server restart halfway' }, a: { cure: 'background queue' } },
        { o: { tinh: 'Hashing with a pure-JS library inside the request, 300 ms of CPU each time' }, a: { cure: 'worker thread' } },
      ],
      ['Genuine CPU work the request needs now ⇒ a worker thread (a small pool). A loop you control and can pause ⇒ slices with setImmediate. Spare cores and healthy code ⇒ cluster, which multiplies capacity but never fixes a blocking endpoint. Work that outlives the request (or must survive a restart) ⇒ a queue (chapter 13). Best of all: do not compute during the request.', 'Việc CPU thật mà request cần ngay ⇒ luồng worker (một nhóm nhỏ). Vòng lặp bạn kiểm soát và tạm dừng được ⇒ chia lát với setImmediate. Còn lõi rảnh, code khoẻ ⇒ cluster, nhân năng lực nhưng không bao giờ chữa endpoint chặn. Việc sống lâu hơn request (hoặc phải sống qua khởi động lại) ⇒ hàng đợi (chương 13). Tốt nhất: đừng tính toán trong request.'])],
    goiY: [['Ask two questions: does the user need the answer in this response? Is the work CPU or waiting?', 'Hỏi hai câu: người dùng có cần kết quả trong response này không? Việc là CPU hay chờ?'], ['Cluster is about using cores, not about one slow handler.', 'Cluster là để dùng hết lõi, không phải để chữa một handler chậm.']],
    loi: [['Using cluster to "fix" a blocking endpoint — you get one frozen process out of four instead of one out of one.', 'Dùng cluster để "chữa" endpoint chặn — được một process đông cứng trên bốn thay vì một trên một.'], ['Doing work that must survive a restart inside the process (worker or chunks) — only a queue keeps it.', 'Làm việc phải sống qua khởi động lại ngay trong process (worker hay chia lát) — chỉ hàng đợi giữ được nó.']],
    tns: TN,
  }),

  cs({
    ten: 'The price of each cure',
    kho: 'MEDIUM', phut: 7,
    en: 'Every cure has a price, says the lesson. Pick the correct statement.',
    vi: 'Bài học nói mỗi cách chữa đều có giá. Chọn phát biểu đúng.',
    cau: [
      q('k1', ['You spawn <code>new Worker(\'./resize.js\')</code> inside every request. What goes wrong first?', 'Bạn tạo new Worker(\'./resize.js\') trong mỗi request. Cái gì hỏng trước?'],
        ['Each worker costs ~10–30 ms to start plus its own V8 heap; under load that adds up — keep a small pool', 'Workers share variables with the main thread, so two requests corrupt each other', 'Each worker blocks the main event loop for as long as its computation runs', 'Node allows only one worker per process, so the second request crashes'],
        ['A worker is a fresh V8 instance: start-up time and memory per worker. One per request multiplies both by your traffic. The lesson: do not spawn one per request — keep a small pool.', 'Worker là một bản V8 mới: tốn thời gian khởi động và bộ nhớ cho mỗi cái. Một cái mỗi request là nhân cả hai theo lưu lượng. Bài học: đừng sinh mỗi request một cái — giữ một nhóm nhỏ.']),
      q('k2', ['A worker computes a result object. How does the main thread get it?', 'Worker tính ra một object kết quả. Luồng chính nhận nó thế nào?'],
        ['parentPort.postMessage(result) — the data is copied to the main thread', 'It writes to a global variable the main thread reads', 'It returns the object from the worker file', 'Through process.env'],
        ['"Workers don\'t share variables. You pass messages (data is copied), or use SharedArrayBuffer for raw bytes."', '"Worker không dùng chung biến. Bạn truyền thông điệp (dữ liệu được sao chép), hoặc dùng SharedArrayBuffer cho byte thô."']),
      q('k3', ['After switching to 4 cluster processes, the in-memory rate limiter lets users through 4× too often. Why?', 'Sau khi chuyển sang 4 process cluster, rate limiter trong RAM cho người dùng qua gấp 4 lần. Vì sao?'],
        ['Each process has its own counter variable — four processes, four counters', 'cluster resets variables every second', 'The load balancer sends every request to all four processes', 'Rate limiting does not work with Express'],
        ['"With multiple processes, in-memory state stops working": a counter in a JS variable is per process. That is why shared state moves to Redis (chapter 12) — the next exercise models exactly this.', '"Nhiều process thì trạng thái trong RAM hết đúng": bộ đếm trong biến JS là của từng process. Vì vậy trạng thái dùng chung chuyển sang Redis (chương 12) — bài kế tiếp mô hình đúng chuyện này.']),
      q('k4', ['The chunked loop took 20 408 ms instead of 2 903 ms. The lesson\'s diagnosis?', 'Vòng lặp chia lát mất 20 408 ms thay vì 2 903 ms. Chẩn đoán của bài?'],
        ['The hot loop updated the outer i and s; captured variables live on the heap, so copy them into locals', 'Too many setImmediate calls: each yield costs about 0.2 ms, which adds up', 'The chunk size was too large, so each slice spilled out of the CPU cache', 'V8 refuses to optimise any function that schedules a setImmediate callback'],
        ['Not the yielding: the same slices back-to-back without setImmediate still took 19 772 ms. Variables captured from an outer scope cannot stay in registers. Work on local copies (<code>let j = i, acc = s</code>) and save progress after each slice.', 'Không phải do nhường lượt: cùng các lát chạy liền không setImmediate vẫn mất 19 772 ms. Biến bị bắt từ phạm vi ngoài không ở được trong thanh ghi. Làm trên bản sao cục bộ (let j = i, acc = s) và lưu tiến độ sau mỗi lát.']),
    ],
    goiY: [['Workers: separate V8, separate memory, messages only.', 'Worker: V8 riêng, bộ nhớ riêng, chỉ có thông điệp.'], ['Cluster: separate processes, so every in-memory variable is per process.', 'Cluster: process riêng, nên mọi biến trong RAM là của từng process.']],
    loi: [['Expecting a worker to read the main thread\'s variables.', 'Tưởng worker đọc được biến của luồng chính.'], ['Blaming setImmediate for slow chunking instead of the captured loop variables.', 'Đổ lỗi cho setImmediate thay vì biến vòng lặp bị bắt từ ngoài.']],
    tns: TN,
  }),

  jsBai({
    ten: 'Cure 2: count words in slices and let the loop breathe',
    kho: 'MEDIUM', phut: 14,
    en: `<p>Rebuilding statistics over every note is a big loop you control, so the lesson's Cure 2 fits: slice it and yield between slices. Write <code>async countWords(notes, chunkSize, yieldToLoop)</code>:</p>
<ul><li>Count the words of every note (<code>note.body.trim().split(/\\s+/)</code>, an empty body has 0 words). Return <code>{ words, slices }</code>.</li>
<li>Process at most <code>chunkSize</code> notes per slice, then <code>await yieldToLoop()</code> before the next slice — but <b>not</b> after the last slice.</li>
<li>Inside a slice, work on <b>local</b> variables and save progress after the slice (the lesson's 7× trap).</li></ul>
<p>In real Node <code>yieldToLoop</code> is <code>() =&gt; new Promise((r) =&gt; setImmediate(r))</code>. Here the tests pass a fake that records how many notes were done at each yield — so they can check that no slice was too big and that other work really ran in between.</p>${pre("await countWords([{ body: 'buy milk' }, { body: 'call Binh now' }, { body: '' }], 2, yieldToLoop)\n// { words: 5, slices: 2 }   — yieldToLoop was called once, after 2 notes")}`,
    vi: `<p>Dựng lại thống kê trên mọi ghi chú là vòng lặp lớn bạn kiểm soát ⇒ hợp Cách 2 của bài: chia lát và nhường lượt giữa các lát. Viết async countWords(notes, chunkSize, yieldToLoop): đếm từ của mọi ghi chú, trả { words, slices }; mỗi lát tối đa chunkSize ghi chú, rồi await yieldToLoop() trước lát kế — nhưng KHÔNG sau lát cuối; trong lát làm trên biến CỤC BỘ và lưu tiến độ sau lát.</p>`,
    yc: [
      ['Correct total of words; <code>slices</code> = number of slices processed.', 'Tổng số từ đúng; slices = số lát đã xử lý.'],
      ['At most <code>chunkSize</code> notes between two yields; exactly <code>slices - 1</code> yields.', 'Tối đa chunkSize ghi chú giữa hai lần nhường; đúng slices - 1 lần nhường.'],
      ['Empty or whitespace-only body ⇒ 0 words.', 'Thân rỗng hoặc chỉ khoảng trắng ⇒ 0 từ.'],
    ],
    goiY: [
      ['Outer loop over slice starts: <code>for (let start = 0; start &lt; notes.length; start += chunkSize)</code>.', 'Vòng ngoài theo điểm bắt đầu lát: for (let start = 0; start < notes.length; start += chunkSize).'],
      ['Inside: <code>let acc = 0;</code> sum the slice into <code>acc</code>, then <code>words += acc; slices++;</code>, then <code>if (start + chunkSize &lt; notes.length) await yieldToLoop();</code>', 'Bên trong: let acc = 0; cộng lát vào acc, rồi words += acc; slices++; rồi nếu còn lát thì await yieldToLoop();'],
    ],
    loi: [
      ['One plain loop over everything (the starter): correct number, but the loop never breathes — every other request waits for the whole job.', 'Một vòng lặp thường qua hết (code khởi đầu): số đúng nhưng vòng lặp không bao giờ được thở — mọi request khác chờ hết việc.'],
      ['Calling <code>yieldToLoop()</code> without <code>await</code> — the Promise is created and ignored, so nothing yields.', 'Gọi yieldToLoop() không await — Promise được tạo rồi bỏ qua, nên không nhường gì.'],
      ['<code>\'\'.split(/\\s+/)</code> is <code>[\'\']</code> — length 1, not 0. Trim and test for empty first.', '\'\'.split(/\\s+/) là [\'\'] — dài 1, không phải 0. Trim và kiểm rỗng trước.'],
    ],
    gt: ['Between two <code>await yieldToLoop()</code> calls the function runs synchronously, so the slice size bounds how long the loop is blocked at a time (the lesson: 2 873 ms of lag became 23 ms). Awaiting a setImmediate-based Promise hands control back to the event loop, which runs pending I/O and timers before resuming. Accumulating into a local and writing back once per slice keeps the hot loop on locals, avoiding the 7× slowdown measured in the lesson. Yielding after the last slice would only delay the result.',
      'Giữa hai lần await yieldToLoop() hàm chạy đồng bộ, nên cỡ lát giới hạn mỗi lần chặn vòng lặp bao lâu (bài: trễ 2 873 ms còn 23 ms). Await một Promise dựa trên setImmediate trả quyền cho event loop chạy I/O và timer đang chờ rồi mới tiếp. Cộng vào biến cục bộ rồi ghi lại một lần mỗi lát giữ vòng nóng trên biến cục bộ, tránh chậm 7× như bài đo. Nhường sau lát cuối chỉ làm chậm kết quả.'],
    kn: ['chunking', 'yielding to the event loop', 'async loops'],
    tns: TN,
    viDu: [{ input: "await countWords([{ body: 'buy milk' }, { body: 'call Binh now' }, { body: '' }], 2, yieldToLoop)", output: '{"words":5,"slices":2}', explanation: 'yieldToLoop was called once, after 2 notes.|||yieldToLoop được gọi một lần, sau 2 ghi chú.' }],
    chung: `const seen = []; let processed = 0; let other = 0;
const mkNotes = (bodies) => bodies.map((b) => ({ get body() { processed++; return b; } }));
const yieldToLoop = () => { seen.push(processed); return new Promise((r) => setTimeout(() => { other++; r(); }, 0)); };`,
    dau: `async function countWords(notes, chunkSize, yieldToLoop) {
  let words = 0;
  for (const note of notes) {
    words += note.body.trim().split(/\\s+/).length;
  }
  return { words, slices: 1 };
}
`,
    giai: `// Cure 2 from lesson 2.5: slice a loop you control and yield between slices.
async function countWords(notes, chunkSize, yieldToLoop) {
  let words = 0;
  let slices = 0;
  for (let start = 0; start < notes.length; start += chunkSize) {
    const end = Math.min(start + chunkSize, notes.length);
    let acc = 0;                            // hot loop on a LOCAL variable
    for (let i = start; i < end; i++) {
      const text = notes[i].body.trim();
      acc += text === '' ? 0 : text.split(/\\s+/).length; // ''.split(...) would give 1
    }
    words += acc;                           // save progress once per slice
    slices += 1;
    if (end < notes.length) await yieldToLoop(); // let I/O and timers run; not after the last slice
  }
  return { words, slices };
}
`,
    cases: [
      { moTa: ['3 notes, chunk 2 ⇒ 5 words, 2 slices, one yield after 2 notes', '3 ghi chú, lát 2'], chuanBi: "const r = await countWords(mkNotes(['buy milk', 'call Binh now', '']), 2, yieldToLoop);", goi: '[r, seen]' },
      { moTa: ['other work ran between the slices', 'việc khác đã chạy giữa các lát'], chuanBi: "const r = await countWords(mkNotes(Array.from({ length: 10 }, () => 'a b')), 3, yieldToLoop);", goi: '[r, seen, other]' },
      { moTa: ['whitespace-only body counts 0', 'thân chỉ khoảng trắng tính 0'], chuanBi: "const r = await countWords(mkNotes(['   ', ' one  two\\tthree ', 'x']), 5, yieldToLoop);", goi: '[r, seen]' },
      { an: true, chuanBi: "const r = await countWords(mkNotes(Array.from({ length: 25 }, (_, i) => 'w '.repeat(i % 4))), 4, yieldToLoop);", goi: '[r, seen, other]' },
      { an: true, chuanBi: 'const r = await countWords([], 4, yieldToLoop);', goi: '[r, seen]' },
    ],
  }),

  jsBai({
    ten: 'Four processes, one counter: a limiter that survives cluster',
    kho: 'MEDIUM', phut: 14,
    en: `<p>Lesson 2.5: "A rate-limit counter in a plain JavaScript variable is now per-process — four processes, four different counters." Model it. Every cluster process calls <code>createLimiter({ store, limit, windowMs })</code> once and gets <code>async allow(userId)</code>. The <code>store</code> is shared by all processes (it plays Redis): <code>await store.incr(key)</code> adds 1 to a key and returns the new value, atomically.</p>
<ul><li>Use a fixed window: the key for a user is <code>'rl:' + userId + ':' + Math.floor(Date.now() / windowMs)</code>.</li>
<li><code>allow</code> resolves <code>true</code> while the shared count for that key is ≤ <code>limit</code>, then <code>false</code>.</li>
<li>Keep NO counter in the process itself.</li></ul>${pre("const store = mkStore();                       // shared, like one Redis\nconst p = [1, 2, 3, 4].map(() => createLimiter({ store, limit: 5, windowMs: 60000 }));  // 4 processes\n// 8 requests from 'u1', spread round-robin over the 4 processes:\n// starter: 8 × true   ·   goal: 5 × true, then false, false, false")}`,
    vi: `<p>Bài 2.5: "Bộ đếm rate limit trong biến JavaScript giờ là của từng process — bốn process, bốn bộ đếm khác nhau." Hãy mô hình nó. Mỗi process cluster gọi createLimiter({ store, limit, windowMs }) một lần và nhận async allow(userId). store dùng chung cho mọi process (đóng vai Redis): await store.incr(key) cộng 1 và trả giá trị mới, nguyên tử. Dùng cửa sổ cố định với khoá 'rl:' + userId + ':' + Math.floor(Date.now() / windowMs); allow resolve true khi số đếm chung ≤ limit, rồi false; KHÔNG giữ bộ đếm nào trong process.</p>`,
    yc: [
      ['All limiters that share a store share the count.', 'Mọi limiter dùng chung store thì dùng chung số đếm.'],
      ['Key: <code>rl:&lt;userId&gt;:&lt;window number&gt;</code>; a new window starts a new count.', 'Khoá: rl:&lt;userId&gt;:&lt;số cửa sổ&gt;; cửa sổ mới bắt đầu số đếm mới.'],
      ['<code>allow</code> is async and resolves a boolean.', 'allow là async và resolve một boolean.'],
    ],
    goiY: [
      ['<code>const n = await store.incr(key); return n &lt;= limit;</code> — the store does the counting.', 'const n = await store.incr(key); return n <= limit; — store đếm hộ.'],
      ['Do not read-then-write (<code>get</code> then <code>set</code>): two processes could read the same value. A single atomic <code>incr</code> avoids that race.', 'Đừng đọc rồi ghi (get rồi set): hai process có thể đọc cùng một giá trị. Một lệnh incr nguyên tử tránh được cuộc đua đó.'],
    ],
    loi: [
      ['A <code>Map</code> inside <code>createLimiter</code> (the starter) — correct on one process, ×4 too permissive on four.', 'Map bên trong createLimiter (code khởi đầu) — đúng với một process, dễ dãi gấp 4 với bốn.'],
      ['Forgetting the window in the key — the user is limited forever after the first 5 calls.', 'Quên cửa sổ trong khoá — người dùng bị chặn mãi sau 5 lần đầu.'],
      ['<code>store.get</code> then <code>store.set(n + 1)</code> — two concurrent requests both read 4 and both get through.', 'store.get rồi store.set(n + 1) — hai request đồng thời cùng đọc 4 và cùng lọt qua.'],
    ],
    gt: ['The count has to live where every process can see it; a closure variable lives inside one process only. Delegating the increment to the shared store makes the limiter stateless per process, so 1 or 40 processes give the same answer. <code>incr</code> being atomic is the second half: a read followed by a write leaves a gap where two processes interleave. In chapter 12 the store becomes Redis (<code>INCR</code> + <code>EXPIRE</code>).',
      'Số đếm phải nằm ở nơi mọi process thấy được; biến closure chỉ sống trong một process. Giao việc cộng cho store dùng chung làm limiter không còn trạng thái riêng trong process, nên 1 hay 40 process cho cùng đáp án. incr nguyên tử là nửa còn lại: đọc rồi ghi để hở một khe cho hai process chen nhau. Chương 12 store thành Redis (INCR + EXPIRE).'],
    kn: ['cluster', 'shared state', 'atomic increment'],
    tns: TN,
    viDu: [{ input: "8 calls of allow('u1') spread over 4 limiters sharing one store, limit 5", output: '[true,true,true,true,true,false,false,false]', explanation: 'The starter allows all 8 (each process counts 2).|||Code khởi đầu cho qua cả 8 (mỗi process đếm 2).' }],
    chung: `const mkStore = () => { const m = new Map(); const log = [];
  return { log, incr: (k) => new Promise((ok) => setTimeout(() => { const n = (m.get(k) || 0) + 1; m.set(k, n); log.push(k); ok(n); }, 1)),
    get: (k) => new Promise((ok) => setTimeout(() => ok(m.get(k) || 0), 1)),
    set: (k, v) => new Promise((ok) => setTimeout(() => { m.set(k, v); ok('OK'); }, 1)) }; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const spread = async (procs, user, n) => { const out = []; for (let i = 0; i < n; i++) out.push(await procs[i % procs.length](user)); return out; };`,
    dau: `function createLimiter({ store, limit, windowMs }) {
  const counts = new Map(); // per-process counter
  return async function allow(userId) {
    const n = (counts.get(userId) || 0) + 1;
    counts.set(userId, n);
    return n <= limit;
  };
}
`,
    giai: `// The count lives in the SHARED store (Redis in chapter 12), never in the process,
// so 1 process or 40 processes give the same answer.
function createLimiter({ store, limit, windowMs }) {
  return async function allow(userId) {
    const windowNo = Math.floor(Date.now() / windowMs);  // fixed window number
    const key = 'rl:' + userId + ':' + windowNo;
    const n = await store.incr(key);  // ONE atomic step: no read-then-write race
    return n <= limit;
  };
}
`,
    cases: [
      { moTa: ['4 processes share one count (limit 5)', '4 process dùng chung số đếm (limit 5)'], chuanBi: 'const store = mkStore(); const procs = [1, 2, 3, 4].map(() => createLimiter({ store, limit: 5, windowMs: 60000 }));', goi: "await spread(procs, 'u1', 8)" },
      { moTa: ['the key includes the window; a new window starts over', 'khoá có cửa sổ; cửa sổ mới đếm lại'], chuanBi: "const store = mkStore(); const procs = [1, 2].map(() => createLimiter({ store, limit: 1, windowMs: 1000 })); const a = await spread(procs, 'u7', 2); await sleep(1000); const b = await spread(procs, 'u7', 2);", goi: '[a, b, [...new Set(store.log)]]' },
      { an: true, chuanBi: "const store = mkStore(); const procs = [1, 2, 3].map(() => createLimiter({ store, limit: 2, windowMs: 60000 })); const res = await Promise.all([procs[0]('a'), procs[1]('a'), procs[2]('a'), procs[0]('b'), procs[1]('a')]);", goi: 'res' },
      { an: true, chuanBi: "const s1 = mkStore(), s2 = mkStore(); const x = createLimiter({ store: s1, limit: 1, windowMs: 60000 }); const y = createLimiter({ store: s2, limit: 1, windowMs: 60000 });", goi: "[await x('u'), await y('u'), await x('u')]" },
    ],
  }),

  jsBai({
    ten: 'A small worker pool, not one worker per request',
    kho: 'HARD', phut: 22,
    en: `<p>"Don't spawn one per request — keep a small pool." Build the pool's scheduler. <code>createPool(size, runTask)</code> returns <code>{ run(job), stats() }</code>:</p>
<ul><li><code>run(job)</code> returns a Promise for that job's result. At most <code>size</code> jobs run at the same time; the rest wait in a FIFO queue and start as soon as a slot frees.</li>
<li><code>runTask(job)</code> is the (fake) worker: it returns a Promise that resolves with the result or rejects with an Error. A failing job rejects only <b>its own</b> Promise; the pool keeps going.</li>
<li><code>stats()</code> returns <code>{ running, queued, peak }</code> — <code>peak</code> is the highest number of jobs that ran simultaneously.</li></ul>${pre("const pool = createPool(4, runTask);          // runTask takes 100 ms per job\nconst t = Date.now();\nawait Promise.all([1,2,3,4,5,6,7,8].map((n) => pool.run(n)));\nDate.now() - t;      // 200 — two waves of four (one-per-job: 100 ms but 8 workers)\npool.stats();        // { running: 0, queued: 0, peak: 4 } (once everything settled)")}`,
    vi: `<p>"Đừng sinh mỗi request một worker — giữ một nhóm nhỏ." Dựng bộ lập lịch của nhóm. createPool(size, runTask) trả { run(job), stats() }: run(job) trả Promise kết quả; tối đa size việc chạy cùng lúc, còn lại chờ trong hàng FIFO và bắt đầu ngay khi có chỗ trống. runTask(job) là worker giả: Promise resolve kết quả hoặc reject Error; việc lỗi chỉ reject Promise CỦA NÓ, nhóm vẫn chạy tiếp. stats() trả { running, queued, peak }.</p>`,
    yc: [
      ['Never more than <code>size</code> jobs at once; FIFO start order.', 'Không bao giờ quá size việc cùng lúc; bắt đầu theo FIFO.'],
      ['Each <code>run(job)</code> resolves/rejects with that job\'s own outcome; a failure frees its slot.', 'Mỗi run(job) resolve/reject theo kết quả của chính nó; việc lỗi vẫn trả chỗ.'],
      ['<code>stats()</code> is accurate at any moment.', 'stats() đúng ở mọi thời điểm.'],
    ],
    goiY: [
      ['State: <code>let running = 0, peak = 0; const queue = [];</code>. <code>run</code> pushes <code>{ job, resolve, reject }</code> and calls <code>pump()</code>.', 'Trạng thái: running, peak, queue. run đẩy { job, resolve, reject } rồi gọi pump().'],
      ['<code>pump()</code>: <code>while (running &lt; size &amp;&amp; queue.length)</code> take the first item, <code>running++</code>, update peak, then <code>runTask(item.job).then(item.resolve, item.reject).finally(() =&gt; { running--; pump(); })</code>.', 'pump(): khi còn chỗ và còn việc, lấy việc đầu, running++, cập nhật peak, rồi runTask(...).then(resolve, reject).finally(() => { running--; pump(); }).'],
      ['<code>run</code> returns <code>new Promise((resolve, reject) =&gt; { queue.push({ job, resolve, reject }); pump(); })</code>.', 'run trả new Promise((resolve, reject) => { queue.push(...); pump(); }).'],
    ],
    loi: [
      ['Starting every job immediately (the starter) — that is "one worker per request": 8 workers, 8 V8 heaps.', 'Chạy mọi việc ngay (code khởi đầu) — đó là "mỗi request một worker": 8 worker, 8 heap V8.'],
      ['Freeing the slot only on success — one failed job leaks a slot forever and the pool slowly stops.', 'Chỉ trả chỗ khi thành công — một việc lỗi giữ mất một chỗ mãi và nhóm dần dừng hẳn.'],
      ['Starting queued jobs only when a whole wave finished (batches of 4) — a slow job then holds three free slots hostage.', 'Chỉ chạy việc trong hàng khi cả đợt xong (lô 4) — một việc chậm giữ ba chỗ trống làm con tin.'],
    ],
    gt: ['The pool is a counter plus a queue. <code>pump()</code> fills free slots from the head of the queue, and every job — success or failure — gives its slot back in <code>finally</code> and pumps again, so the next waiting job starts the moment a worker is free (not when a whole wave finished). Wiring each job\'s own <code>resolve</code>/<code>reject</code> keeps failures isolated. With size 4 and 100 ms jobs, eight jobs take two waves = 200 ms while using four workers instead of eight — the trade the lesson recommends.',
      'Nhóm là một bộ đếm cộng một hàng đợi. pump() lấp chỗ trống từ đầu hàng, và mọi việc — thành công hay lỗi — trả chỗ trong finally rồi pump lại, nên việc chờ kế tiếp bắt đầu ngay khi có worker rảnh (không đợi cả đợt xong). Nối resolve/reject riêng của từng việc giữ lỗi tách biệt. Với size 4 và việc 100 ms, tám việc mất hai đợt = 200 ms nhưng chỉ dùng bốn worker thay vì tám — đúng đánh đổi bài học khuyên.'],
    kn: ['worker pool', 'concurrency limit', 'Promise plumbing'],
    tns: TN,
    viDu: [{ input: 'await Promise.all([1..8].map((n) => pool.run(n)))  // size 4, 100 ms each', output: 'results in order, 200 ms, stats().peak === 4', explanation: 'The starter finishes in 100 ms but with peak 8.|||Code khởi đầu xong 100 ms nhưng peak 8.' }],
    chung: `const mkTask = (ms = 100) => (job) => new Promise((ok, ko) => setTimeout(() => (job === 'bad' || (job && job.fail) ? ko(new Error('worker crashed on ' + JSON.stringify(job))) : ok(typeof job === 'number' ? job * job : job.ms ? 'done ' + job.ms : job)), job && job.ms ? job.ms : ms));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));`,
    dau: `function createPool(size, runTask) {
  let running = 0, peak = 0;
  return {
    run(job) {
      running++;
      peak = Math.max(peak, running);
      return runTask(job).finally(() => { running--; });
    },
    stats() { return { running, queued: 0, peak }; },
  };
}
`,
    giai: `// A fixed-size pool: at most "size" jobs run at once, the rest wait in FIFO order.
function createPool(size, runTask) {
  let running = 0;
  let peak = 0;
  const queue = []; // waiting jobs: { job, resolve, reject }

  function pump() {
    // fill every free slot from the head of the queue
    while (running < size && queue.length > 0) {
      const item = queue.shift();
      running += 1;
      peak = Math.max(peak, running);
      runTask(item.job)
        .then(item.resolve, item.reject)   // each job settles ITS OWN promise
        .finally(() => {
          running -= 1;                     // success or failure: give the slot back
          pump();                           // and start the next waiting job at once
        });
    }
  }

  return {
    run(job) {
      return new Promise((resolve, reject) => {
        queue.push({ job, resolve, reject });
        pump();
      });
    },
    stats() {
      return { running, queued: queue.length, peak };
    },
  };
}
`,
    cases: [
      { moTa: ['8 jobs, size 4: correct results, two waves (200 ms), peak 4', '8 việc, size 4: hai đợt, peak 4'], chuanBi: 'const pool = createPool(4, mkTask(100)); const t = Date.now(); const r = await Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map((n) => pool.run(n))); const ms = Date.now() - t; await sleep(1);', goi: '[r, ms, pool.stats()]' },
      { moTa: ['stats while busy: running and queued', 'stats khi bận: running và queued'], chuanBi: 'const pool = createPool(2, mkTask(100)); const ps = [1, 2, 3, 4, 5].map((n) => pool.run(n)); await sleep(50); const mid = pool.stats(); await Promise.all(ps); await sleep(1);', goi: '[mid, pool.stats()]' },
      { moTa: ['a failing job rejects only itself, the pool keeps going', 'việc lỗi chỉ reject chính nó'], chuanBi: "const pool = createPool(1, mkTask(10)); const out = await Promise.allSettled([pool.run(1), pool.run('bad'), pool.run(3)]);", goi: 'out.map((x) => x.status === "fulfilled" ? x.value : "rejected: " + x.reason.message)' },
      { an: true, chuanBi: 'const pool = createPool(2, mkTask()); const t = Date.now(); const done = []; await Promise.all([{ ms: 300 }, { ms: 100 }, { ms: 100 }, { ms: 100 }].map((j, i) => pool.run(j).then((v) => done.push([i, Date.now() - t]))));', goi: '[done, pool.stats().peak]' },
      { an: true, chuanBi: "const pool = createPool(3, mkTask(50)); const res = await Promise.allSettled(Array.from({ length: 7 }, (_, i) => pool.run(i % 3 === 1 ? { fail: true, ms: 20 } : i))); const after = await pool.run(9); await sleep(1);", goi: '[res.map((x) => x.status), after, pool.stats()]' },
    ],
  }),
]);
