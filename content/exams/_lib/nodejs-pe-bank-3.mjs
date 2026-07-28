/**
 * Ngân hàng đề PE khoá Node.js — phần 3 (PE-08 … PE-10).
 * Xem chú thích ở `nodejs-pe-bank-1.mjs`: file này là NGUỒN, `expectedOutput`
 * do `scripts/exam-build-pe.mjs` chạy thật rồi sinh ra.
 */
export default [
  {
    code: 'PE-08',
    title: { en: 'Practical Exam 08 — realtime and shared state', vi: 'Thi thực hành 08 — realtime và trạng thái dùng chung' },
    desc: {
      en: 'Chapters 11 and 12: rooms and who receives what, atomic counters, rate limiting done three ways, and backpressure.',
      vi: 'Chương 11 và 12: phòng và ai nhận được gì, bộ đếm nguyên tử, ba cách giới hạn tần suất, và áp lực ngược.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Model Socket.IO rooms. Read commands: <code>join &lt;socket&gt; &lt;room&gt;</code>, <code>leave &lt;socket&gt; &lt;room&gt;</code>, <code>io &lt;room&gt; &lt;from&gt;</code> (broadcast to the whole room, sender INCLUDED) and <code>socket &lt;room&gt; &lt;from&gt;</code> (broadcast to the room EXCEPT the sender). For each broadcast print <code>&lt;room&gt; -&gt; &lt;receiving sockets, comma separated in join order&gt;</code>, or <code>&lt;room&gt; -&gt; (nobody)</code>.</p>',
        vi: '<p><b>Câu 1.</b> Mô hình hoá phòng của Socket.IO. Đọc các lệnh: <code>join &lt;socket&gt; &lt;phòng&gt;</code>, <code>leave &lt;socket&gt; &lt;phòng&gt;</code>, <code>io &lt;phòng&gt; &lt;người gửi&gt;</code> (phát cho cả phòng, TÍNH CẢ người gửi) và <code>socket &lt;phòng&gt; &lt;người gửi&gt;</code> (phát cho cả phòng TRỪ người gửi). Mỗi lần phát thì in <code>&lt;phòng&gt; -&gt; &lt;các socket nhận được, cách nhau bởi dấu phẩy theo thứ tự vào phòng&gt;</code>, hoặc <code>&lt;phòng&gt; -&gt; (nobody)</code>.</p>',
        stdin: 'join s1 thread:42\njoin s2 thread:42\njoin s3 thread:99\nio thread:42 s1\nsocket thread:42 s1\nleave s2 thread:42\nsocket thread:42 s1\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const rooms = new Map();   // room -> array of socket ids (giữ thứ tự vào phòng)\n' +
          'for (const line of lines) {\n' +
          "  const [cmd, a, b] = line.trim().split(/\\s+/);\n" +
          "  if (cmd === 'join') {\n" +
          '    if (!rooms.has(b)) rooms.set(b, []);\n' +
          '    if (!rooms.get(b).includes(a)) rooms.get(b).push(a);\n' +
          '    continue;\n' +
          '  }\n' +
          "  if (cmd === 'leave') {\n" +
          '    rooms.set(b, (rooms.get(b) ?? []).filter((s) => s !== a));\n' +
          '    continue;\n' +
          '  }\n' +
          '  const members = rooms.get(a) ?? [];\n' +
          "  const targets = cmd === 'io' ? members : members.filter((s) => s !== b);\n" +
          "  console.log(`${a} -> ${targets.length ? targets.join(',') : '(nobody)'}`);\n" +
          '}\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Bound the send queue. Read a limit in bytes on line 1, then lines <code>&lt;socket&gt; &lt;messageBytes&gt; &lt;drainedBytes&gt;</code> meaning: this socket is asked to send that many bytes, and the client has acknowledged <code>drainedBytes</code> since the last line. Track <code>bufferedAmount</code> per socket: if it would exceed the limit BEFORE the write, drop the message. Print <code>&lt;socket&gt; &lt;sent|dropped&gt; buffered=&lt;bytes&gt;</code>, and a final line <code>dropped=&lt;n&gt;</code>.</p>',
        vi: '<p><b>Câu 2.</b> Chặn hàng đợi gửi. Dòng 1 đọc giới hạn tính bằng byte, rồi các dòng <code>&lt;socket&gt; &lt;sốByteTinNhắn&gt; &lt;sốByteĐãThoát&gt;</code> nghĩa là: socket này được yêu cầu gửi từng ấy byte, và client đã nhận xong <code>sốByteĐãThoát</code> kể từ dòng trước. Hãy theo dõi <code>bufferedAmount</code> của từng socket: nếu TRƯỚC khi ghi mà nó đã vượt giới hạn thì bỏ tin. In <code>&lt;socket&gt; &lt;sent|dropped&gt; buffered=&lt;byte&gt;</code>, và dòng cuối <code>dropped=&lt;n&gt;</code>.</p>',
        stdin: '1000\ns1 400 0\ns1 400 0\ns1 400 0\ns1 300 900\ns2 100 0\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const LIMIT = Number(lines[0].trim());\n' +
          'const buffered = new Map();\n' +
          'let dropped = 0;\n' +
          'for (const line of lines.slice(1)) {\n' +
          "  const [socket, sizeStr, drainedStr] = line.trim().split(/\\s+/);\n" +
          '  const size = Number(sizeStr), drained = Number(drainedStr);\n' +
          '  let buf = buffered.get(socket) ?? 0;\n' +
          '  buf = Math.max(0, buf - drained);\n' +
          '  // Nhìn TRƯỚC khi ghi: send() không bao giờ báo lỗi, nó chỉ phình bộ nhớ.\n' +
          '  if (buf > LIMIT) {\n' +
          '    dropped++;\n' +
          '    buffered.set(socket, buf);\n' +
          '    console.log(`${socket} dropped buffered=${buf}`);\n' +
          '    continue;\n' +
          '  }\n' +
          '  buf += size;\n' +
          '  buffered.set(socket, buf);\n' +
          '  console.log(`${socket} sent buffered=${buf}`);\n' +
          '}\n' +
          'console.log(`dropped=${dropped}`);\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Fixed-window rate limiting, and the hole at the boundary. Read <code>&lt;limit&gt; &lt;windowMs&gt;</code> on line 1, then requests <code>&lt;key&gt; &lt;timestampMs&gt;</code>. Bucket by <code>Math.floor(ts / windowMs)</code> and print <code>&lt;key&gt; &lt;200|429&gt; remaining=&lt;n&gt;</code>. Finish with <code>boundary=&lt;the largest number of requests any key got through in ANY windowMs-long span&gt;</code> — on the sample it exceeds the configured limit, which is the whole point of the algorithm.</p>',
        vi: '<p><b>Câu 3.</b> Giới hạn tần suất bằng cửa sổ cố định, và cái lỗ ở ranh giới. Dòng 1 đọc <code>&lt;giớiHạn&gt; &lt;độDàiCửaSổMs&gt;</code>, rồi tới các request <code>&lt;khoá&gt; &lt;mốcThờiGianMs&gt;</code>. Chia ô theo <code>Math.floor(ts / windowMs)</code> và in <code>&lt;khoá&gt; &lt;200|429&gt; remaining=&lt;n&gt;</code>. Kết thúc bằng <code>boundary=&lt;số request nhiều nhất mà một khoá lọt qua được trong BẤT KỲ khoảng nào dài đúng windowMs&gt;</code> — với dữ liệu mẫu, con số đó vượt giới hạn đã đặt, và đó chính là điểm yếu của thuật toán này.</p>',
        stdin: '3 1000\nbob 800\nbob 850\nbob 900\nbob 950\nbob 1010\nbob 1050\nbob 1100\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const [limit, windowMs] = lines[0].trim().split(/\\s+/).map(Number);\n" +
          'const counters = new Map();\n' +
          'const allowed = [];\n' +
          'for (const line of lines.slice(1)) {\n' +
          "  const [key, tsStr] = line.trim().split(/\\s+/);\n" +
          '  const ts = Number(tsStr);\n' +
          '  const bucket = `${key}:${Math.floor(ts / windowMs)}`;\n' +
          '  const used = counters.get(bucket) ?? 0;\n' +
          '  if (used >= limit) {\n' +
          '    console.log(`${key} 429 remaining=0`);\n' +
          '    continue;\n' +
          '  }\n' +
          '  counters.set(bucket, used + 1);\n' +
          '  allowed.push({ key, ts });\n' +
          '  console.log(`${key} 200 remaining=${limit - used - 1}`);\n' +
          '}\n' +
          'let worst = 0;\n' +
          'for (const a of allowed) {\n' +
          '  const inSpan = allowed.filter((b) => b.key === a.key && b.ts >= a.ts && b.ts < a.ts + windowMs).length;\n' +
          '  if (inSpan > worst) worst = inSpan;\n' +
          '}\n' +
          'console.log(`boundary=${worst}`);\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Token bucket — the limiter that allows a burst. Read <code>&lt;capacity&gt; &lt;refillPerSecond&gt;</code> on line 1, then requests <code>&lt;key&gt; &lt;timestampMs&gt;</code>. A bucket starts full; it refills continuously at the given rate and never exceeds capacity; a request costs one token. Print <code>&lt;key&gt; &lt;200|429&gt; tokens=&lt;remaining, 2 decimals&gt;</code>. This is what you want for a public API: a page firing eight requests on load succeeds, a script hammering steadily does not.</p>',
        vi: '<p><b>Câu 4.</b> Token bucket — bộ giới hạn cho phép bùng ngắn. Dòng 1 đọc <code>&lt;sứcChứa&gt; &lt;tokenNạpMỗiGiây&gt;</code>, rồi tới các request <code>&lt;khoá&gt; &lt;mốcThờiGianMs&gt;</code>. Bình bắt đầu ở trạng thái đầy; nó nạp liên tục theo tốc độ đã cho và không bao giờ vượt sức chứa; mỗi request tốn một token. In <code>&lt;khoá&gt; &lt;200|429&gt; tokens=&lt;còn lại, 2 chữ số thập phân&gt;</code>. Đây chính là thứ bạn cần cho một API công khai: một trang bắn tám request lúc tải thì qua được, còn một script gõ đều đều thì không.</p>',
        stdin: '5 5\na 0\na 0\na 0\na 0\na 0\na 0\na 600\na 600\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const [capacity, ratePerSec] = lines[0].trim().split(/\\s+/).map(Number);\n" +
          'const buckets = new Map();   // key -> { tokens, ts }\n' +
          'for (const line of lines.slice(1)) {\n' +
          "  const [key, tsStr] = line.trim().split(/\\s+/);\n" +
          '  const ts = Number(tsStr);\n' +
          '  const b = buckets.get(key) ?? { tokens: capacity, ts };\n' +
          '  const refill = ((ts - b.ts) / 1000) * ratePerSec;\n' +
          '  b.tokens = Math.min(capacity, b.tokens + refill);\n' +
          '  b.ts = ts;\n' +
          '  if (b.tokens >= 1) {\n' +
          '    b.tokens -= 1;\n' +
          '    console.log(`${key} 200 tokens=${b.tokens.toFixed(2)}`);\n' +
          '  } else {\n' +
          '    console.log(`${key} 429 tokens=${b.tokens.toFixed(2)}`);\n' +
          '  }\n' +
          '  buckets.set(key, b);\n' +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> A distributed lock done right. Read <code>&lt;now&gt; &lt;command&gt; &lt;args…&gt;</code> per line, where <code>now</code> is a millisecond clock. <code>acquire &lt;key&gt; &lt;worker&gt; &lt;ttlMs&gt;</code> succeeds only when no live lock exists (a lock whose deadline has passed is gone) — print <code>&lt;worker&gt; acquired &lt;token&gt;</code> using tokens <code>k1, k2, …</code> in order, or <code>&lt;worker&gt; blocked</code>. <code>release &lt;key&gt; &lt;token&gt;</code> must delete the lock ONLY if it still holds that exact token — print <code>released=&lt;1|0&gt;</code>. Finish with <code>holder=&lt;token|none&gt;</code>.</p>',
        vi: '<p><b>Câu 5.</b> Khoá phân tán làm cho đúng. Mỗi dòng đọc <code>&lt;now&gt; &lt;lệnh&gt; &lt;tham số…&gt;</code>, trong đó <code>now</code> là đồng hồ tính bằng mili-giây. <code>acquire &lt;khoá&gt; &lt;worker&gt; &lt;ttlMs&gt;</code> chỉ thành công khi không còn khoá nào còn sống (khoá đã quá hạn coi như không còn) — in <code>&lt;worker&gt; acquired &lt;token&gt;</code> với token đánh số <code>k1, k2, …</code> theo thứ tự, hoặc in <code>&lt;worker&gt; blocked</code>. <code>release &lt;khoá&gt; &lt;token&gt;</code> chỉ được xoá khoá NẾU khoá đó vẫn đang mang đúng token ấy — in <code>released=&lt;1|0&gt;</code>. Kết thúc bằng <code>holder=&lt;token|none&gt;</code>.</p>',
        stdin: '0 acquire job:1 worker-1 300\n10 acquire job:1 worker-2 300\n400 acquire job:1 worker-2 300\n420 release job:1 k1\n430 release job:1 k2\n440 acquire job:1 worker-3 300\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const locks = new Map();   // key -> { token, expiresAt }\n' +
          'let n = 0;\n' +
          'let lastKey = null;\n' +
          'for (const line of lines) {\n' +
          "  const [nowStr, cmd, key, arg, ttlStr] = line.trim().split(/\\s+/);\n" +
          '  const now = Number(nowStr);\n' +
          '  lastKey = key;\n' +
          '  const cur = locks.get(key);\n' +
          '  const alive = cur && cur.expiresAt > now;\n' +
          "  if (cmd === 'acquire') {\n" +
          '    if (alive) { console.log(`${arg} blocked`); continue; }\n' +
          '    const token = `k${++n}`;\n' +
          '    locks.set(key, { token, expiresAt: now + Number(ttlStr) });\n' +
          '    console.log(`${arg} acquired ${token}`);\n' +
          '    continue;\n' +
          '  }\n' +
          '  // So khớp token RỒI mới xoá, trong cùng một bước — đúng như script Lua.\n' +
          '  if (alive && cur.token === arg) {\n' +
          '    locks.delete(key);\n' +
          "    console.log('released=1');\n" +
          '  } else {\n' +
          "    console.log('released=0');\n" +
          '  }\n' +
          '}\n' +
          'const final = locks.get(lastKey);\n' +
          "console.log(`holder=${final ? final.token : 'none'}`);\n",
      },
    ],
  },

  {
    code: 'PE-09',
    title: { en: 'Practical Exam 09 — background jobs that survive failure', vi: 'Thi thực hành 09 — tác vụ nền sống sót qua sự cố' },
    desc: {
      en: 'Chapter 13: enqueue instead of doing, retry with backoff, stay idempotent, schedule, and recover a stalled job.',
      vi: 'Chương 13: đẩy vào hàng đợi thay vì làm ngay, thử lại có backoff, giữ tính idempotent, hẹn lịch, và cứu một job bị treo.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> A worker with a concurrency limit. Read <code>&lt;concurrency&gt;</code> on line 1, then jobs <code>&lt;id&gt; &lt;durationMs&gt;</code>. Simulate the clock: at any moment at most <code>concurrency</code> jobs run, and the next job starts the instant a slot frees. Print <code>&lt;id&gt; start=&lt;ms&gt; end=&lt;ms&gt;</code> in start order, then <code>total=&lt;ms&gt;</code>.</p>',
        vi: '<p><b>Câu 1.</b> Một worker có giới hạn đồng thời. Dòng 1 đọc <code>&lt;concurrency&gt;</code>, rồi tới các job <code>&lt;id&gt; &lt;thờiGianMs&gt;</code>. Hãy mô phỏng đồng hồ: tại mọi thời điểm chỉ có tối đa <code>concurrency</code> job chạy, và job kế tiếp bắt đầu ngay khi có chỗ trống. In <code>&lt;id&gt; start=&lt;ms&gt; end=&lt;ms&gt;</code> theo thứ tự bắt đầu, rồi in <code>total=&lt;ms&gt;</code>.</p>',
        stdin: '2\na 100\nb 50\nc 30\nd 40\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const concurrency = Number(lines[0].trim());\n' +
          "const jobs = lines.slice(1).map((l) => { const [id, ms] = l.trim().split(/\\s+/); return { id, ms: Number(ms) }; });\n" +
          'const slots = new Array(concurrency).fill(0);\n' +
          'let total = 0;\n' +
          'for (const job of jobs) {\n' +
          '  const i = slots.indexOf(Math.min(...slots));\n' +
          '  const start = slots[i];\n' +
          '  const end = start + job.ms;\n' +
          '  slots[i] = end;\n' +
          '  total = Math.max(total, end);\n' +
          '  console.log(`${job.id} start=${start} end=${end}`);\n' +
          '}\n' +
          'console.log(`total=${total}`);\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Compute the retry schedule before writing any retry code. Read <code>&lt;attempts&gt; &lt;baseDelayMs&gt; &lt;fixed|exponential&gt;</code> per line and print the delays between attempts, comma separated, then the total wait: <code>&lt;delays&gt; total=&lt;ms&gt;</code>. There are <code>attempts - 1</code> delays — nobody waits after the last attempt. Exponential means <code>base * 2 ** (k - 1)</code> for the k-th delay.</p>',
        vi: '<p><b>Câu 2.</b> Tính lịch thử lại trước khi viết bất kỳ dòng mã thử lại nào. Mỗi dòng đọc <code>&lt;sốLầnThử&gt; &lt;baseDelayMs&gt; &lt;fixed|exponential&gt;</code> và in các khoảng chờ giữa những lần thử, cách nhau bởi dấu phẩy, rồi in tổng thời gian chờ: <code>&lt;các khoảng chờ&gt; total=&lt;ms&gt;</code>. Có đúng <code>attempts - 1</code> khoảng chờ — không ai chờ sau lần thử cuối. Kiểu exponential nghĩa là khoảng chờ thứ k bằng <code>base * 2 ** (k - 1)</code>.</p>',
        stdin: '5 200 exponential\n4 300 fixed\n1 500 exponential\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'for (const line of lines) {\n' +
          "  const [attemptsStr, baseStr, kind] = line.trim().split(/\\s+/);\n" +
          '  const attempts = Number(attemptsStr), base = Number(baseStr);\n' +
          '  const delays = [];\n' +
          '  for (let k = 1; k <= attempts - 1; k++) {\n' +
          "    delays.push(kind === 'exponential' ? base * 2 ** (k - 1) : base);\n" +
          '  }\n' +
          '  const total = delays.reduce((a, b) => a + b, 0);\n' +
          "  console.log(`${delays.join(',') || '(none)'} total=${total}`);\n" +
          '}\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Deduplicate at the door AND in the handler. Read <code>&lt;jobId&gt; &lt;orderId&gt; &lt;amount&gt;</code> per line. Adding a job whose <code>jobId</code> is already waiting must not create a second one (print <code>dedup &lt;jobId&gt;</code>). Then process the queue in order: a handler that has already charged that <code>orderId</code> prints <code>skip &lt;orderId&gt;</code>, otherwise <code>charge &lt;orderId&gt; &lt;amount&gt;</code>. Finish with <code>total=&lt;sum actually charged&gt;</code>.</p>',
        vi: '<p><b>Câu 3.</b> Khử trùng ngay ở cửa VÀ trong handler. Mỗi dòng đọc <code>&lt;jobId&gt; &lt;orderId&gt; &lt;sốTiền&gt;</code>. Thêm một job có <code>jobId</code> đang chờ sẵn thì không được tạo thêm cái thứ hai (in <code>dedup &lt;jobId&gt;</code>). Sau đó xử lý hàng đợi theo thứ tự: handler nào đã trừ tiền cho <code>orderId</code> đó rồi thì in <code>skip &lt;orderId&gt;</code>, ngược lại in <code>charge &lt;orderId&gt; &lt;sốTiền&gt;</code>. Kết thúc bằng <code>total=&lt;tổng đã thật sự trừ&gt;</code>.</p>',
        stdin: 'invoice-777 777 100000\ninvoice-777 777 100000\ninvoice-778 778 250000\ninvoice-779 777 100000\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const waiting = new Map();   // jobId -> job\n' +
          'const queue = [];\n' +
          'for (const line of lines) {\n' +
          "  const [jobId, orderId, amount] = line.trim().split(/\\s+/);\n" +
          '  if (waiting.has(jobId)) { console.log(`dedup ${jobId}`); continue; }\n' +
          '  const job = { jobId, orderId, amount: Number(amount) };\n' +
          '  waiting.set(jobId, job);\n' +
          '  queue.push(job);\n' +
          '}\n' +
          'const charged = new Set();\n' +
          'let total = 0;\n' +
          'for (const job of queue) {\n' +
          '  // jobId chỉ chặn trùng ở CỬA; handler vẫn phải tự idempotent.\n' +
          '  if (charged.has(job.orderId)) { console.log(`skip ${job.orderId}`); continue; }\n' +
          '  charged.add(job.orderId);\n' +
          '  total += job.amount;\n' +
          '  console.log(`charge ${job.orderId} ${job.amount}`);\n' +
          '}\n' +
          'console.log(`total=${total}`);\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Rescue stalled jobs. Read <code>&lt;lockDurationMs&gt;</code> on line 1, then events <code>&lt;time&gt; &lt;start|renew|finish|check&gt; &lt;jobId&gt;</code>. A <code>start</code> takes a lock expiring at <code>time + lockDuration</code>; <code>renew</code> extends it from the current time; <code>finish</code> completes the job. A <code>check</code> lists every job whose lock has expired without finishing: print <code>stalled &lt;jobId&gt;</code> for each (in start order) and requeue it — its next <code>start</code> is a second run. End with <code>completed=&lt;n&gt; stalled=&lt;n&gt;</code>.</p>',
        vi: '<p><b>Câu 4.</b> Cứu những job bị treo. Dòng 1 đọc <code>&lt;lockDurationMs&gt;</code>, rồi tới các sự kiện <code>&lt;thờiĐiểm&gt; &lt;start|renew|finish|check&gt; &lt;jobId&gt;</code>. Lệnh <code>start</code> giữ một khoá hết hạn ở <code>thờiĐiểm + lockDuration</code>; <code>renew</code> gia hạn tính từ thời điểm hiện tại; <code>finish</code> hoàn tất job. Lệnh <code>check</code> liệt kê mọi job có khoá đã hết hạn mà chưa xong: in <code>stalled &lt;jobId&gt;</code> cho từng cái (theo thứ tự bắt đầu) rồi đưa lại vào hàng đợi — lần <code>start</code> kế tiếp của nó là một lần chạy thứ hai. Kết thúc bằng <code>completed=&lt;n&gt; stalled=&lt;n&gt;</code>.</p>',
        stdin: '1000\n0 start j1\n0 start j2\n500 renew j1\n1200 check x\n1300 finish j1\n1300 start j2\n1400 finish j2\n2500 check x\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const LOCK = Number(lines[0].trim());\n' +
          'const active = new Map();   // jobId -> expiresAt\n' +
          'const order = [];\n' +
          'let completed = 0, stalled = 0;\n' +
          'for (const line of lines.slice(1)) {\n' +
          "  const [timeStr, cmd, jobId] = line.trim().split(/\\s+/);\n" +
          '  const time = Number(timeStr);\n' +
          "  if (cmd === 'start') {\n" +
          '    if (!order.includes(jobId)) order.push(jobId);\n' +
          '    active.set(jobId, time + LOCK);\n' +
          "  } else if (cmd === 'renew') {\n" +
          '    if (active.has(jobId)) active.set(jobId, time + LOCK);\n' +
          "  } else if (cmd === 'finish') {\n" +
          '    if (active.delete(jobId)) completed++;\n' +
          '  } else {\n' +
          '    for (const id of order) {\n' +
          '      const exp = active.get(id);\n' +
          '      if (exp !== undefined && exp <= time) {\n' +
          '        // Khoá hết hạn mà job chưa xong = worker đã chết hoặc đã chặn event loop.\n' +
          '        active.delete(id);\n' +
          '        stalled++;\n' +
          '        console.log(`stalled ${id}`);\n' +
          '      }\n' +
          '    }\n' +
          '  }\n' +
          '}\n' +
          'console.log(`completed=${completed} stalled=${stalled}`);\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> A scheduler that fans out instead of doing the work itself. Read <code>&lt;tzOffsetHours&gt;</code> on line 1 and a cron-ish spec <code>&lt;hour&gt; &lt;minute&gt;</code> (local time) on line 2, then UTC timestamps <code>YYYY-MM-DDTHH:mm</code>, one per line. For each timestamp print <code>&lt;utc&gt; local=&lt;local HH:mm&gt; &lt;fire|skip&gt;</code>. Every time it fires, fan out one job per user from the JSON array on the LAST line, printing <code>enqueue digest-&lt;userId&gt;-&lt;local date YYYY-MM-DD&gt;</code>. End with <code>jobs=&lt;n&gt;</code>.</p>',
        vi: '<p><b>Câu 5.</b> Một bộ hẹn lịch biết RẢI việc thay vì tự ôm. Dòng 1 đọc <code>&lt;chênhLệchMúiGiờ&gt;</code> (giờ), dòng 2 đọc lịch kiểu cron <code>&lt;giờ&gt; &lt;phút&gt;</code> (giờ địa phương), rồi tới các mốc thời gian UTC <code>YYYY-MM-DDTHH:mm</code>, mỗi dòng một cái. Với mỗi mốc, in <code>&lt;utc&gt; local=&lt;giờ địa phương HH:mm&gt; &lt;fire|skip&gt;</code>. Mỗi lần nổ thì rải ra mỗi người dùng một job từ mảng JSON ở dòng CUỐI, in <code>enqueue digest-&lt;idNgườiDùng&gt;-&lt;ngày địa phương YYYY-MM-DD&gt;</code>. Kết thúc bằng <code>jobs=&lt;n&gt;</code>.</p>',
        stdin: '7\n3 0\n2026-07-27T20:00\n2026-07-28T03:00\n2026-07-28T20:00\n[1,2]\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const offset = Number(lines[0].trim());\n' +
          "const [hour, minute] = lines[1].trim().split(/\\s+/).map(Number);\n" +
          'const users = JSON.parse(lines[lines.length - 1]);\n' +
          'const stamps = lines.slice(2, lines.length - 1);\n' +
          'let jobs = 0;\n' +
          'for (const utc of stamps) {\n' +
          "  const local = new Date(new Date(utc + ':00Z').getTime() + offset * 3600_000);\n" +
          "  const hh = String(local.getUTCHours()).padStart(2, '0');\n" +
          "  const mm = String(local.getUTCMinutes()).padStart(2, '0');\n" +
          '  const fire = local.getUTCHours() === hour && local.getUTCMinutes() === minute;\n' +
          "  console.log(`${utc} local=${hh}:${mm} ${fire ? 'fire' : 'skip'}`);\n" +
          '  if (!fire) continue;\n' +
          '  const day = local.toISOString().slice(0, 10);\n' +
          '  // Job định kỳ chỉ RẢI việc: mỗi người một job, thử lại và theo dõi được riêng.\n' +
          '  for (const u of users) { jobs++; console.log(`enqueue digest-${u}-${day}`); }\n' +
          '}\n' +
          'console.log(`jobs=${jobs}`);\n',
      },
    ],
  },

  {
    code: 'PE-10',
    title: { en: 'Practical Exam 10 — reading production', vi: 'Thi thực hành 10 — đọc hiểu production' },
    desc: {
      en: 'Chapters 15 to 17: percentiles from a real log, metric cardinality, the profile that names the hot path, and diagnosing a deploy.',
      vi: 'Chương 15 tới 17: tính phân vị từ log thật, số chiều của nhãn metric, ảnh chụp CPU chỉ đúng điểm nóng, và chẩn đoán một lần deploy.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Read one JSON log line per request and print, per URL sorted by count DESC then URL ASC: <code>&lt;url&gt; n=&lt;count&gt; p50=&lt;ms&gt; p95=&lt;ms&gt; max=&lt;ms&gt;</code>. Use the nearest-rank percentile: sort ascending and take index <code>Math.floor(n * q)</code>, clamped to the last element.</p>',
        vi: '<p><b>Câu 1.</b> Mỗi dòng đọc một bản ghi log JSON và in ra, theo từng URL sắp xếp theo số lượng GIẢM DẦN rồi URL TĂNG DẦN: <code>&lt;url&gt; n=&lt;số lượng&gt; p50=&lt;ms&gt; p95=&lt;ms&gt; max=&lt;ms&gt;</code>. Dùng phân vị theo thứ hạng gần nhất: sắp tăng dần rồi lấy chỉ số <code>Math.floor(n * q)</code>, kẹp lại ở phần tử cuối.</p>',
        stdin: '{"url":"/feed","durationMs":60}\n{"url":"/feed","durationMs":8241}\n{"url":"/feed","durationMs":55}\n{"url":"/notes","durationMs":12}\n{"url":"/feed","durationMs":58}\n{"url":"/notes","durationMs":30}\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const byUrl = new Map();\n' +
          'for (const line of lines) {\n' +
          '  const r = JSON.parse(line);\n' +
          '  if (!byUrl.has(r.url)) byUrl.set(r.url, []);\n' +
          '  byUrl.get(r.url).push(r.durationMs);\n' +
          '}\n' +
          'const pct = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];\n' +
          '[...byUrl.entries()]\n' +
          '  .sort((a, b) => b[1].length - a[1].length || (a[0] < b[0] ? -1 : 1))\n' +
          '  .forEach(([url, values]) => {\n' +
          '    const s = [...values].sort((x, y) => x - y);\n' +
          '    console.log(`${url} n=${s.length} p50=${pct(s, 0.5)} p95=${pct(s, 0.95)} max=${s[s.length - 1]}`);\n' +
          '  });\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Normalise URLs into route templates before they become metric labels. Read one path per line and replace any segment that is all digits with <code>:id</code>, and any segment that looks like a UUID (8-4-4-4-12 hex) with <code>:uuid</code>. Print the template. Then print <code>series=&lt;number of DISTINCT templates&gt;</code> and <code>raw=&lt;number of distinct input paths&gt;</code> — the gap is the cardinality explosion you just avoided.</p>',
        vi: '<p><b>Câu 2.</b> Chuẩn hoá URL thành mẫu route trước khi chúng trở thành nhãn metric. Mỗi dòng đọc một đường dẫn và thay mọi đoạn toàn chữ số bằng <code>:id</code>, mọi đoạn trông như UUID (hex 8-4-4-4-12) bằng <code>:uuid</code>. In ra mẫu route. Sau đó in <code>series=&lt;số mẫu KHÁC NHAU&gt;</code> và <code>raw=&lt;số đường dẫn khác nhau ở đầu vào&gt;</code> — khoảng cách giữa hai con số chính là vụ nổ số chiều mà bạn vừa tránh được.</p>',
        stdin: '/api/v1/notes/1\n/api/v1/notes/2\n/api/v1/notes/8412/comments\n/api/v1/users/3f6b2c1a-9d4e-4f7a-8b1c-2e5d7a9f0c31\n/api/v1/health\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;\n' +
          'const templates = new Set();\n' +
          'const raw = new Set();\n' +
          'for (const line of lines) {\n' +
          '  const p = line.trim();\n' +
          '  raw.add(p);\n' +
          "  const t = p.split('/').map((seg) => {\n" +
          "    if (/^\\d+$/.test(seg)) return ':id';\n" +
          "    if (UUID.test(seg)) return ':uuid';\n" +
          '    return seg;\n' +
          "  }).join('/');\n" +
          '  templates.add(t);\n' +
          '  console.log(t);\n' +
          '}\n' +
          'console.log(`series=${templates.size}`);\n' +
          'console.log(`raw=${raw.size}`);\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Read a CPU profile as lines <code>&lt;percent&gt; &lt;function&gt;</code> and a target speed-up factor on the FIRST line. For each function print <code>&lt;function&gt; &lt;percent&gt;% -&gt; saves &lt;x&gt;%</code> where <code>x</code> is the whole-request saving if that function became <code>factor</code>× faster, to two decimals. Then print <code>focus=&lt;function with the largest saving&gt;</code>. Amdahl, in ten lines: making 0,5% of the time twice as fast cannot buy more than 0,25%.</p>',
        vi: '<p><b>Câu 3.</b> Đọc một ảnh chụp CPU dạng các dòng <code>&lt;phầnTrăm&gt; &lt;tênHàm&gt;</code>, với hệ số tăng tốc mục tiêu nằm ở dòng ĐẦU. Với mỗi hàm, in <code>&lt;tênHàm&gt; &lt;phầnTrăm&gt;% -&gt; saves &lt;x&gt;%</code> trong đó <code>x</code> là phần tiết kiệm trên toàn request nếu hàm đó nhanh lên <code>factor</code> lần, lấy hai chữ số thập phân. Rồi in <code>focus=&lt;hàm tiết kiệm được nhiều nhất&gt;</code>. Định luật Amdahl gói trong mười dòng: làm cho 0,5% thời gian nhanh gấp đôi thì không thể mua nổi quá 0,25%.</p>',
        stdin: '2\n16.9 stringify\n15.9 renderNote\n14.5 cryptoHash\n0.5 regexSlugify\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const factor = Number(lines[0].trim());\n' +
          'let best = null;\n' +
          'for (const line of lines.slice(1)) {\n' +
          "  const [pctStr, name] = line.trim().split(/\\s+/);\n" +
          '  const pct = Number(pctStr);\n' +
          '  const saves = pct - pct / factor;\n' +
          '  if (!best || saves > best.saves) best = { name, saves };\n' +
          '  console.log(`${name} ${pct}% -> saves ${saves.toFixed(2)}%`);\n' +
          '}\n' +
          'console.log(`focus=${best.name}`);\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Diagnose a deploy from status codes alone. Read <code>&lt;route&gt; &lt;status&gt;</code> per line and print, per route, <code>&lt;route&gt; &lt;verdict&gt;</code> where 200 → <code>mounted-public</code>, 401 or 403 → <code>mounted-auth</code>, 404 → <code>MISSING</code>, 502 or 503 → <code>app-down</code>, anything else → <code>unknown</code>. Then <code>smoke=&lt;PASS|FAIL&gt;</code>: the deploy FAILS if any route is MISSING, because a 404 means the route was never mounted in the running process.</p>',
        vi: '<p><b>Câu 4.</b> Chẩn đoán một lần deploy chỉ bằng mã trạng thái. Mỗi dòng đọc <code>&lt;route&gt; &lt;mã&gt;</code> và in theo từng route <code>&lt;route&gt; &lt;kết luận&gt;</code>, trong đó 200 → <code>mounted-public</code>, 401 hoặc 403 → <code>mounted-auth</code>, 404 → <code>MISSING</code>, 502 hoặc 503 → <code>app-down</code>, còn lại → <code>unknown</code>. Sau đó in <code>smoke=&lt;PASS|FAIL&gt;</code>: lần deploy HỎNG nếu có bất kỳ route nào MISSING, vì 404 nghĩa là route đó chưa từng được gắn vào tiến trình đang chạy.</p>',
        stdin: 'gifs 404\nmessages/threads 401\ncourses 200\nfeed/posts 401\nhealth 200\nsnippets 502\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'let failed = false;\n' +
          'for (const line of lines) {\n' +
          "  const [route, codeStr] = line.trim().split(/\\s+/);\n" +
          '  const code = Number(codeStr);\n' +
          "  let verdict = 'unknown';\n" +
          "  if (code === 200) verdict = 'mounted-public';\n" +
          "  else if (code === 401 || code === 403) verdict = 'mounted-auth';\n" +
          "  else if (code === 404) { verdict = 'MISSING'; failed = true; }\n" +
          "  else if (code === 502 || code === 503) verdict = 'app-down';\n" +
          '  console.log(`${route} ${verdict}`);\n' +
          '}\n' +
          "console.log(`smoke=${failed ? 'FAIL' : 'PASS'}`);\n",
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Decide whether a memory series is a leak. Read <code>&lt;thresholdMB&gt;</code> on line 1, then samples <code>&lt;requests&gt; &lt;rssMB&gt;</code> in increasing request order. Print <code>&lt;requests&gt; &lt;rssMB&gt; delta=&lt;change since previous, or -&gt;</code> for each. Then classify: if the LAST THIRD of the samples grew by more than <code>thresholdMB</code>, print <code>verdict=LEAK growth=&lt;MB&gt;</code>; otherwise <code>verdict=PLATEAU growth=&lt;MB&gt;</code>. A doubling at the start followed by a flat line is V8 sizing its heap, not a leak.</p>',
        vi: '<p><b>Câu 5.</b> Quyết định xem một dãy số liệu bộ nhớ có phải rò rỉ không. Dòng 1 đọc <code>&lt;ngưỡngMB&gt;</code>, rồi tới các mẫu <code>&lt;sốRequest&gt; &lt;rssMB&gt;</code> theo thứ tự request tăng dần. In cho từng mẫu <code>&lt;sốRequest&gt; &lt;rssMB&gt; delta=&lt;thay đổi so với mẫu trước, hoặc -&gt;</code>. Sau đó phân loại: nếu MỘT PHẦN BA CUỐI của dãy tăng thêm quá <code>ngưỡngMB</code> thì in <code>verdict=LEAK growth=&lt;MB&gt;</code>; ngược lại in <code>verdict=PLATEAU growth=&lt;MB&gt;</code>. Tăng gấp đôi lúc đầu rồi đi ngang là V8 đang mở heap tới cỡ làm việc, không phải rò rỉ.</p>',
        stdin: '10\n0 56.6\n20000 122.5\n50000 123.3\n80000 123.4\n100000 123.4\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const threshold = Number(lines[0].trim());\n' +
          "const samples = lines.slice(1).map((l) => { const [reqs, rss] = l.trim().split(/\\s+/); return { reqs: Number(reqs), rss: Number(rss) }; });\n" +
          'samples.forEach((s, i) => {\n' +
          "  const delta = i === 0 ? '-' : (s.rss - samples[i - 1].rss).toFixed(1);\n" +
          '  console.log(`${s.reqs} ${s.rss} delta=${delta}`);\n' +
          '});\n' +
          '// Chỉ nhìn phần ĐUÔI: cú tăng đầu tiên là V8 mở heap, không phải rò rỉ.\n' +
          'const tailStart = Math.floor((samples.length * 2) / 3);\n' +
          'const growth = samples[samples.length - 1].rss - samples[tailStart].rss;\n' +
          "console.log(`verdict=${growth > threshold ? 'LEAK' : 'PLATEAU'} growth=${growth.toFixed(1)}`);\n",
      },
    ],
  },
];
