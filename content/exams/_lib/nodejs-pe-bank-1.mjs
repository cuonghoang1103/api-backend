/**
 * Ngân hàng đề PE khoá Node.js — phần 1 (PE-01 … PE-04).
 *
 * Đây là NGUỒN, không phải file seed. `scripts/exam-build-pe.mjs` chạy từng
 * `solution` với `stdin` tương ứng để lấy output thật rồi mới sinh ra
 * `content/exams/NODEJS-PE.mjs`. Nhờ vậy không có `expectedOutput` nào được
 * gõ tay — cái nào cũng là kết quả `node` in ra.
 *
 * Mỗi đề: 5 câu · 2 câu nền tảng→trung bình (1,5đ) · 1 câu trung bình–khá (2đ)
 * · 2 câu khó (2,5đ) — tổng 10 điểm.
 */
export default [
  {
    code: 'PE-01',
    title: { en: 'Practical Exam 01 — JavaScript foundations for the backend', vi: 'Thi thực hành 01 — JavaScript nền tảng cho backend' },
    desc: {
      en: 'Chapter 1: scope and closures, references and copying, async orchestration, and the errors nobody owns.',
      vi: 'Chương 1: phạm vi và closure, tham chiếu và sao chép, điều phối bất đồng bộ, và những lỗi không ai nhận.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Read one line of comma-separated integers from stdin. Print, on one line, the count of numbers, their sum, and their average rounded to two decimals, separated by spaces. An empty line means <code>0 0 0.00</code>.</p>',
        vi: '<p><b>Câu 1.</b> Đọc một dòng gồm các số nguyên cách nhau bởi dấu phẩy từ stdin. In trên một dòng: số lượng số, tổng của chúng, và trung bình cộng làm tròn hai chữ số thập phân, cách nhau bằng dấu cách. Dòng rỗng thì in <code>0 0 0.00</code>.</p>',
        stdin: '4,8,15,16,23,42\n',
        solution:
          "const line = require('node:fs').readFileSync(0, 'utf8').trim();\n" +
          "const nums = line ? line.split(',').map(Number) : [];\n" +
          'const sum = nums.reduce((a, b) => a + b, 0);\n' +
          "const avg = nums.length ? sum / nums.length : 0;\n" +
          'console.log(nums.length, sum, avg.toFixed(2));\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Write <code>createCounter()</code>: it returns a function that returns 1, 2, 3… on successive calls, and two counters created separately must NOT share state. Read one integer <code>n</code> from stdin, call counter A <code>n</code> times and counter B twice, then print <code>A=&lt;last A&gt; B=&lt;last B&gt; leak=&lt;typeof count outside&gt;</code>.</p>',
        vi: '<p><b>Câu 2.</b> Viết <code>createCounter()</code>: nó trả về một hàm mà mỗi lần gọi lần lượt cho 1, 2, 3…, và hai bộ đếm tạo riêng thì KHÔNG dùng chung trạng thái. Đọc một số nguyên <code>n</code> từ stdin, gọi bộ đếm A <code>n</code> lần và bộ đếm B hai lần, rồi in <code>A=&lt;giá trị A cuối&gt; B=&lt;giá trị B cuối&gt; leak=&lt;typeof count ở ngoài&gt;</code>.</p>',
        stdin: '5\n',
        solution:
          "const n = Number(require('node:fs').readFileSync(0, 'utf8').trim());\n" +
          'function createCounter() {\n' +
          '  let count = 0;\n' +
          '  return () => ++count;\n' +
          '}\n' +
          'const a = createCounter(), b = createCounter();\n' +
          'let last = 0;\n' +
          'for (let i = 0; i < n; i++) last = a();\n' +
          'b();\n' +
          'const lastB = b();\n' +
          "console.log(`A=${last} B=${lastB} leak=${typeof count}`);\n",
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Read a JSON object from stdin. Produce a DEEP copy, then set <code>copy.address.city = "Da Nang"</code> and push <code>"new"</code> onto <code>copy.tags</code>. Print the original as JSON on line 1 and the copy on line 2 — the original must be unchanged. A shallow spread will fail this.</p>',
        vi: '<p><b>Câu 3.</b> Đọc một object JSON từ stdin. Tạo bản sao SÂU, rồi gán <code>copy.address.city = "Da Nang"</code> và thêm <code>"new"</code> vào <code>copy.tags</code>. In bản gốc dạng JSON ở dòng 1 và bản sao ở dòng 2 — bản gốc phải nguyên vẹn. Dùng spread nông sẽ trượt câu này.</p>',
        stdin: '{"name":"An","address":{"city":"Ha Noi"},"tags":["a"]}\n',
        solution:
          "const original = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));\n" +
          'const copy = structuredClone(original);\n' +
          "copy.address.city = 'Da Nang';\n" +
          "copy.tags.push('new');\n" +
          'console.log(JSON.stringify(original));\n' +
          'console.log(JSON.stringify(copy));\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Read lines of the form <code>&lt;name&gt; &lt;ms&gt; &lt;ok|fail&gt;</code>. Run every task IN PARALLEL (each task is a promise that settles after <code>ms</code> milliseconds; a <code>fail</code> task rejects with the message <code>&lt;name&gt; failed</code>) and never let one failure cancel the others. Print one line per task in INPUT order: <code>&lt;name&gt; ok</code> or <code>&lt;name&gt; error &lt;message&gt;</code>, then a last line <code>ok=&lt;n&gt; failed=&lt;n&gt;</code>. Total runtime must be about the slowest task, not the sum.</p>',
        vi: '<p><b>Câu 4.</b> Đọc các dòng dạng <code>&lt;tên&gt; &lt;ms&gt; &lt;ok|fail&gt;</code>. Chạy mọi tác vụ SONG SONG (mỗi tác vụ là một promise kết thúc sau <code>ms</code> mili-giây; tác vụ <code>fail</code> thì ném lỗi với thông điệp <code>&lt;tên&gt; failed</code>) và không để một lỗi làm hỏng những cái còn lại. In mỗi tác vụ một dòng theo ĐÚNG thứ tự đầu vào: <code>&lt;tên&gt; ok</code> hoặc <code>&lt;tên&gt; error &lt;thông điệp&gt;</code>, rồi dòng cuối <code>ok=&lt;n&gt; failed=&lt;n&gt;</code>. Tổng thời gian chạy phải xấp xỉ tác vụ chậm nhất, không phải tổng các tác vụ.</p>',
        stdin: 'user 60 ok\ndb 30 fail\nnotes 50 ok\nreport 40 fail\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const tasks = lines.map((l) => { const [name, ms, kind] = l.trim().split(/\\s+/); return { name, ms: Number(ms), kind }; });\n" +
          'const run = (t) => new Promise((res, rej) => setTimeout(() => {\n' +
          "  if (t.kind === 'fail') rej(new Error(`${t.name} failed`)); else res(t.name);\n" +
          '}, t.ms));\n' +
          '(async () => {\n' +
          '  // Gọi run() cho TẤT CẢ trước rồi mới await — đó là chỗ quyết định song song.\n' +
          '  const settled = await Promise.allSettled(tasks.map(run));\n' +
          '  let ok = 0, failed = 0;\n' +
          '  settled.forEach((r, i) => {\n' +
          "    if (r.status === 'fulfilled') { ok++; console.log(`${tasks[i].name} ok`); }\n" +
          '    else { failed++; console.log(`${tasks[i].name} error ${r.reason.message}`); }\n' +
          '  });\n' +
          "  console.log(`ok=${ok} failed=${failed}`);\n" +
          '})();\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Read lines <code>&lt;id&gt; &lt;ms&gt;</code>. Process them with a concurrency LIMIT of 2: never more than two in flight, start the next as soon as a slot frees. Each job resolves with its id after <code>ms</code>. Print results in COMPLETION order, one per line, then <code>done=&lt;count&gt;</code>. (A plain <code>Promise.all</code> over all of them would run five at once and fail this.)</p>',
        vi: '<p><b>Câu 5.</b> Đọc các dòng <code>&lt;id&gt; &lt;ms&gt;</code>. Xử lý chúng với GIỚI HẠN đồng thời bằng 2: không bao giờ có quá hai việc đang chạy, và có chỗ trống là bắt đầu ngay việc kế tiếp. Mỗi việc trả về id của nó sau <code>ms</code>. In kết quả theo thứ tự HOÀN THÀNH, mỗi dòng một cái, rồi in <code>done=&lt;số lượng&gt;</code>. (Dùng <code>Promise.all</code> cho tất cả sẽ chạy năm việc cùng lúc và trượt câu này.)</p>',
        stdin: 'a 500\nb 100\nc 150\nd 100\ne 60\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const jobs = lines.map((l) => { const [id, ms] = l.trim().split(/\\s+/); return { id, ms: Number(ms) }; });\n" +
          'const sleep = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));\n' +
          '(async () => {\n' +
          '  const LIMIT = 2;\n' +
          '  const out = [];\n' +
          '  let next = 0;\n' +
          '  async function worker() {\n' +
          '    while (next < jobs.length) {\n' +
          '      const job = jobs[next++];\n' +
          '      const id = await sleep(job.ms, job.id);\n' +
          '      out.push(id);\n' +
          '      console.log(id);\n' +
          '    }\n' +
          '  }\n' +
          '  await Promise.all(Array.from({ length: LIMIT }, worker));\n' +
          "  console.log(`done=${out.length}`);\n" +
          '})();\n',
      },
    ],
  },

  {
    code: 'PE-02',
    title: { en: 'Practical Exam 02 — the runtime and the core modules', vi: 'Thi thực hành 02 — runtime và các module lõi' },
    desc: {
      en: 'Chapters 2 and 3: bytes versus characters, path safety, event emitters, and chunked processing.',
      vi: 'Chương 2 và 3: byte so với ký tự, an toàn đường dẫn, EventEmitter, và xử lý theo khối.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Read one line of UTF-8 text. Print three lines: the number of CHARACTERS, the number of BYTES, and the first 8 bytes in hex (lowercase, no separator).</p>',
        vi: '<p><b>Câu 1.</b> Đọc một dòng văn bản UTF-8. In ba dòng: số KÝ TỰ, số BYTE, và 8 byte đầu tiên dưới dạng hex (chữ thường, không dấu phân cách).</p>',
        stdin: 'Xin chào\n',
        solution:
          "const s = require('node:fs').readFileSync(0, 'utf8').replace(/\\n$/, '');\n" +
          "const b = Buffer.from(s, 'utf8');\n" +
          'console.log(s.length);\n' +
          'console.log(b.length);\n' +
          "console.log(b.subarray(0, 8).toString('hex'));\n",
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> The upload directory is <code>/var/app/uploads</code>. Read one filename per line and print <code>&lt;name&gt; -&gt; OK &lt;resolved path&gt;</code> if the resolved path stays inside the upload directory, or <code>&lt;name&gt; -&gt; REJECT</code> if it escapes. Use <code>path.resolve</code> and compare against the directory plus <code>path.sep</code>.</p>',
        vi: '<p><b>Câu 2.</b> Thư mục upload là <code>/var/app/uploads</code>. Mỗi dòng đọc một tên file và in <code>&lt;tên&gt; -&gt; OK &lt;đường dẫn đã resolve&gt;</code> nếu đường dẫn sau khi resolve vẫn nằm trong thư mục upload, hoặc <code>&lt;tên&gt; -&gt; REJECT</code> nếu nó thoát ra ngoài. Hãy dùng <code>path.resolve</code> và so với thư mục cộng <code>path.sep</code>.</p>',
        stdin: 'anh.png\n../../etc/passwd\nsub/dir/b.jpg\n..%2Fx\n/etc/hosts\n',
        solution:
          "const path = require('node:path');\n" +
          "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\n" +
          "const DIR = '/var/app/uploads';\n" +
          'const base = path.resolve(DIR) + path.sep;\n' +
          'for (const name of lines) {\n' +
          '  const full = path.resolve(DIR, name);\n' +
          "  console.log(full.startsWith(base) ? `${name} -> OK ${full}` : `${name} -> REJECT`);\n" +
          '}\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Build a tiny event bus on <code>EventEmitter</code>. Read lines: <code>on &lt;event&gt;</code> adds a permanent listener, <code>once &lt;event&gt;</code> adds a one-shot listener, <code>emit &lt;event&gt;</code> fires it. For every emit print <code>&lt;event&gt; handled=&lt;how many listeners ran&gt; left=&lt;listenerCount after&gt;</code>. Attach an <code>error</code> listener so emitting <code>error</code> does not kill the process; print <code>caught &lt;event&gt;</code> for it.</p>',
        vi: '<p><b>Câu 3.</b> Dựng một bus sự kiện nhỏ trên <code>EventEmitter</code>. Đọc từng dòng: <code>on &lt;sự kiện&gt;</code> thêm listener thường trực, <code>once &lt;sự kiện&gt;</code> thêm listener chạy một lần, <code>emit &lt;sự kiện&gt;</code> phát sự kiện. Mỗi lần emit thì in <code>&lt;sự kiện&gt; handled=&lt;số listener đã chạy&gt; left=&lt;listenerCount sau đó&gt;</code>. Nhớ gắn listener cho <code>error</code> để việc phát <code>error</code> không giết tiến trình; với nó thì in <code>caught &lt;sự kiện&gt;</code>.</p>',
        stdin: 'on saved\nonce saved\nemit saved\nemit saved\nemit error\n',
        solution:
          "const { EventEmitter } = require('node:events');\n" +
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const bus = new EventEmitter();\n' +
          'let ran = 0;\n' +
          "bus.on('error', () => { console.log('caught error'); });\n" +
          'for (const line of lines) {\n' +
          "  const [cmd, ev] = line.trim().split(/\\s+/);\n" +
          "  if (cmd === 'on') bus.on(ev, () => { ran++; });\n" +
          "  else if (cmd === 'once') bus.once(ev, () => { ran++; });\n" +
          '  else {\n' +
          '    ran = 0;\n' +
          '    bus.emit(ev);\n' +
          "    if (ev !== 'error') console.log(`${ev} handled=${ran} left=${bus.listenerCount(ev)}`);\n" +
          '  }\n' +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Read a line of text and a number <code>k</code> on the next line. Cut the text to at most <code>k</code> BYTES without ever splitting a multi-byte character (no <code>\\uFFFD</code> in the output). Print the cut string, then its byte length. Cutting the Buffer blindly is the trap.</p>',
        vi: '<p><b>Câu 4.</b> Đọc một dòng văn bản và một số <code>k</code> ở dòng kế. Cắt văn bản còn tối đa <code>k</code> BYTE mà tuyệt đối không cắt ngang một ký tự nhiều byte (kết quả không được có <code>\\uFFFD</code>). In chuỗi đã cắt, rồi in độ dài byte của nó. Cắt thẳng trên Buffer chính là cái bẫy.</p>',
        stdin: 'Xin chào các bạn\n10\n',
        solution:
          "const [text, kLine] = require('node:fs').readFileSync(0, 'utf8').split('\\n');\n" +
          'const k = Number(kLine);\n' +
          "let out = '';\n" +
          'for (const ch of text) {\n' +
          "  if (Buffer.byteLength(out + ch, 'utf8') > k) break;\n" +
          '  out += ch;\n' +
          '}\n' +
          'console.log(out);\n' +
          "console.log(Buffer.byteLength(out, 'utf8'));\n",
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Read a number <code>n</code>, then accumulate the sum of squares of 1..n in CHUNKS of 1000, yielding to the event loop between chunks with <code>setImmediate</code>. A competing task also reschedules itself with <code>setImmediate</code> and counts its own runs until the chunked work is done. Print <code>sum=&lt;value&gt;</code>, then <code>chunks=&lt;how many chunks&gt;</code>, then <code>yielded=true</code> if the competing task ran at least <code>chunks - 1</code> times — which can only happen if you really did give the loop its turn between chunks.</p>',
        vi: '<p><b>Câu 5.</b> Đọc một số <code>n</code>, rồi cộng dồn tổng bình phương của 1..n theo KHỐI 1000 phần tử, giữa các khối thì nhường lượt cho event loop bằng <code>setImmediate</code>. Một tác vụ cạnh tranh cũng tự hẹn lại chính nó bằng <code>setImmediate</code> và đếm số lần nó chạy, cho tới khi phần việc chia khối xong. In <code>sum=&lt;giá trị&gt;</code>, rồi <code>chunks=&lt;số khối&gt;</code>, rồi <code>yielded=true</code> nếu tác vụ cạnh tranh chạy được ít nhất <code>chunks - 1</code> lần — điều chỉ xảy ra khi bạn thật sự nhường lượt cho event loop giữa các khối.</p>',
        stdin: '200000\n',
        solution:
          "const n = Number(require('node:fs').readFileSync(0, 'utf8').trim());\n" +
          'const CHUNK = 1000;\n' +
          'let i = 1, sum = 0, chunks = 0, otherRuns = 0, done = false;\n' +
          'function otherTask() {\n' +
          '  if (done) return;\n' +
          '  otherRuns++;\n' +
          '  setImmediate(otherTask);\n' +
          '}\n' +
          'function runChunk() {\n' +
          '  const end = Math.min(i + CHUNK - 1, n);\n' +
          '  for (; i <= end; i++) sum += i * i;\n' +
          '  chunks++;\n' +
          '  if (i <= n) return setImmediate(runChunk);   // nhường lượt cho event loop\n' +
          '  done = true;\n' +
          "  console.log(`sum=${sum}`);\n" +
          "  console.log(`chunks=${chunks}`);\n" +
          "  console.log(`yielded=${otherRuns >= chunks - 1}`);\n" +
          '}\n' +
          'otherTask();\n' +
          'runChunk();\n',
      },
    ],
  },

  {
    code: 'PE-03',
    title: { en: 'Practical Exam 03 — routing, middleware and status codes', vi: 'Thi thực hành 03 — định tuyến, middleware và mã trạng thái' },
    desc: {
      en: 'Chapters 5 and 6 without a framework: match routes the way Express does, run a middleware chain, and choose the right status code.',
      vi: 'Chương 5 và 6 nhưng không dùng framework: khớp route đúng như Express làm, chạy một dây chuyền middleware, và chọn đúng mã trạng thái.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Read a route table (lines <code>&lt;METHOD&gt; &lt;pattern&gt; &lt;handlerName&gt;</code>) until a line <code>---</code>, then read requests (<code>&lt;METHOD&gt; &lt;path&gt;</code>). Match in DECLARATION ORDER, first match wins, where a segment starting with <code>:</code> matches any single segment. Print <code>&lt;handlerName&gt; &lt;params as JSON&gt;</code> or <code>404</code>.</p>',
        vi: '<p><b>Câu 1.</b> Đọc bảng route (các dòng <code>&lt;METHOD&gt; &lt;mẫu&gt; &lt;tênHandler&gt;</code>) cho tới dòng <code>---</code>, rồi đọc các request (<code>&lt;METHOD&gt; &lt;đường dẫn&gt;</code>). Khớp theo ĐÚNG THỨ TỰ KHAI BÁO, ai khớp trước thì thắng, trong đó đoạn bắt đầu bằng <code>:</code> khớp với một đoạn bất kỳ. In <code>&lt;tênHandler&gt; &lt;params dạng JSON&gt;</code> hoặc <code>404</code>.</p>',
        stdin: 'GET /notes/:id getNote\nGET /notes/new newNote\nGET /notes/:id/comments listComments\n---\nGET /notes/42\nGET /notes/new\nGET /notes/7/comments\nPOST /notes/42\nGET /notes\n',
        solution:
          "const raw = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const sep = raw.indexOf('---');\n" +
          "const routes = raw.slice(0, sep).map((l) => { const [method, pattern, name] = l.trim().split(/\\s+/); return { method, parts: pattern.split('/').filter(Boolean), name }; });\n" +
          'const reqs = raw.slice(sep + 1);\n' +
          'for (const line of reqs) {\n' +
          "  const [method, url] = line.trim().split(/\\s+/);\n" +
          "  const parts = url.split('/').filter(Boolean);\n" +
          '  let hit = null;\n' +
          '  for (const r of routes) {\n' +
          '    if (r.method !== method || r.parts.length !== parts.length) continue;\n' +
          '    const params = {};\n' +
          '    let ok = true;\n' +
          '    for (let i = 0; i < parts.length; i++) {\n' +
          "      if (r.parts[i].startsWith(':')) params[r.parts[i].slice(1)] = parts[i];\n" +
          '      else if (r.parts[i] !== parts[i]) { ok = false; break; }\n' +
          '    }\n' +
          '    if (ok) { hit = { name: r.name, params }; break; }\n' +
          '  }\n' +
          "  console.log(hit ? `${hit.name} ${JSON.stringify(hit.params)}` : '404');\n" +
          '}\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Read query strings, one per line, and normalise them the way a list endpoint must: <code>page</code> defaults to 1 and is at least 1; <code>limit</code> defaults to 10 and is clamped to 1..50; <code>sort</code> must be one of <code>createdAt|title</code> (anything else falls back to <code>createdAt</code>). Print the result as JSON with keys in the order page, limit, sort. A repeated key (<code>a=1&amp;a=2</code>) must use the LAST value.</p>',
        vi: '<p><b>Câu 2.</b> Đọc các chuỗi truy vấn, mỗi dòng một cái, và chuẩn hoá đúng như một endpoint danh sách phải làm: <code>page</code> mặc định 1 và tối thiểu 1; <code>limit</code> mặc định 10 và kẹp trong 1..50; <code>sort</code> phải thuộc <code>createdAt|title</code> (khác đi thì quay về <code>createdAt</code>). In kết quả dạng JSON với thứ tự khoá page, limit, sort. Khoá lặp lại (<code>a=1&amp;a=2</code>) thì lấy giá trị CUỐI.</p>',
        stdin: 'page=3&limit=25&sort=title\nlimit=500\npage=0&limit=0\nsort=colour\npage=2&page=9\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const SORTABLE = ['createdAt', 'title'];\n" +
          'for (const line of lines) {\n' +
          '  const q = Object.fromEntries(new URLSearchParams(line.trim()));\n' +
          '  const rawPage = Number(q.page ?? 1);\n' +
          '  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;\n' +
          '  const rawLimit = Number(q.limit ?? 10);\n' +
          '  const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.floor(rawLimit))) : 10;\n' +
          "  const sort = SORTABLE.includes(q.sort) ? q.sort : 'createdAt';\n" +
          '  console.log(JSON.stringify({ page, limit, sort }));\n' +
          '}\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Implement a middleware chain. Middlewares are given as lines <code>&lt;name&gt; &lt;action&gt;</code> where action is <code>next</code>, <code>respond &lt;code&gt;</code>, <code>error &lt;code&gt;</code> or <code>hang</code>. Run them in order. Print each middleware name as it runs. Then print the outcome: <code>RESPONSE &lt;code&gt;</code>, or <code>ERROR &lt;code&gt;</code> (an <code>error</code> jumps straight to the error handler, skipping the rest), or <code>HANG</code> if a middleware neither responded nor called next, or <code>404</code> if the chain finished with no response.</p>',
        vi: '<p><b>Câu 3.</b> Cài đặt một dây chuyền middleware. Mỗi middleware cho dưới dạng dòng <code>&lt;tên&gt; &lt;hành động&gt;</code> với hành động là <code>next</code>, <code>respond &lt;mã&gt;</code>, <code>error &lt;mã&gt;</code> hoặc <code>hang</code>. Chạy chúng theo thứ tự. In tên từng middleware khi nó chạy. Sau đó in kết cục: <code>RESPONSE &lt;mã&gt;</code>, hoặc <code>ERROR &lt;mã&gt;</code> (gặp <code>error</code> thì nhảy thẳng tới error handler, bỏ qua phần còn lại), hoặc <code>HANG</code> nếu một middleware không trả lời cũng không gọi next, hoặc <code>404</code> nếu chạy hết dây chuyền mà chưa ai trả lời.</p>',
        stdin: 'logger next\ncors next\nauth error 401\nhandler respond 200\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "let outcome = '404';\n" +
          'for (const line of lines) {\n' +
          "  const [name, action, code] = line.trim().split(/\\s+/);\n" +
          '  console.log(name);\n' +
          "  if (action === 'respond') { outcome = `RESPONSE ${code}`; break; }\n" +
          "  if (action === 'error') { outcome = `ERROR ${code}`; break; }\n" +
          "  if (action === 'hang') { outcome = 'HANG'; break; }\n" +
          '}\n' +
          'console.log(outcome);\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Read one JSON body per line for <code>POST /notes</code> and decide the status code exactly as chapter 6 prescribes. Rules, checked in this order: body is not valid JSON → <code>400 INVALID_JSON</code>; <code>title</code> missing or not a string or empty after trim → <code>422 VALIDATION_FAILED title</code>; <code>title</code> longer than 200 → <code>422 VALIDATION_FAILED title</code>; the title already exists (case-insensitive, among the ones accepted so far) → <code>409 DUPLICATE</code>; otherwise <code>201 /api/v1/notes/&lt;id&gt;</code> with ids starting at 1. Print one line per request.</p>',
        vi: '<p><b>Câu 4.</b> Mỗi dòng đọc một thân JSON của <code>POST /notes</code> và quyết định mã trạng thái đúng như chương 6 quy định. Luật, kiểm theo đúng thứ tự này: thân không phải JSON hợp lệ → <code>400 INVALID_JSON</code>; <code>title</code> thiếu, không phải chuỗi, hoặc rỗng sau khi trim → <code>422 VALIDATION_FAILED title</code>; <code>title</code> dài quá 200 → <code>422 VALIDATION_FAILED title</code>; tiêu đề đã tồn tại (không phân biệt hoa thường, trong số những cái đã được chấp nhận) → <code>409 DUPLICATE</code>; còn lại → <code>201 /api/v1/notes/&lt;id&gt;</code> với id bắt đầu từ 1. In mỗi request một dòng.</p>',
        stdin: '{"title":"Learning Express"}\n{"title":"   "}\n{"body":"no title"}\n{title:}\n{"title":"learning express"}\n{"title":"Second note"}\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const seen = new Set();\n' +
          'let id = 0;\n' +
          'for (const line of lines) {\n' +
          '  let body;\n' +
          "  try { body = JSON.parse(line); } catch { console.log('400 INVALID_JSON'); continue; }\n" +
          '  const title = body?.title;\n' +
          "  if (typeof title !== 'string' || title.trim() === '' || title.length > 200) {\n" +
          "    console.log('422 VALIDATION_FAILED title');\n" +
          '    continue;\n' +
          '  }\n' +
          '  const key = title.trim().toLowerCase();\n' +
          "  if (seen.has(key)) { console.log('409 DUPLICATE'); continue; }\n" +
          '  seen.add(key);\n' +
          "  console.log(`201 /api/v1/notes/${++id}`);\n" +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Implement optimistic concurrency. State starts as <code>{ id: 1, title: "Original", version: 1 }</code>. Read lines <code>&lt;actor&gt; &lt;ifMatchVersion|none&gt; &lt;newTitle&gt;</code>. If <code>none</code> → print <code>&lt;actor&gt; 428</code>. If the version does not match the current one → <code>&lt;actor&gt; 412</code>. Otherwise apply the change, bump the version and print <code>&lt;actor&gt; 200 v&lt;newVersion&gt;</code>. Finish with a line <code>final &lt;title&gt; v&lt;version&gt;</code>.</p>',
        vi: '<p><b>Câu 5.</b> Cài đặt điều khiển đồng thời lạc quan. Trạng thái ban đầu là <code>{ id: 1, title: "Original", version: 1 }</code>. Đọc các dòng <code>&lt;người&gt; &lt;phiênBảnIfMatch|none&gt; &lt;tiêuĐềMới&gt;</code>. Nếu là <code>none</code> → in <code>&lt;người&gt; 428</code>. Nếu phiên bản không khớp phiên bản hiện tại → <code>&lt;người&gt; 412</code>. Còn lại thì áp dụng thay đổi, tăng phiên bản và in <code>&lt;người&gt; 200 v&lt;phiênBảnMới&gt;</code>. Kết thúc bằng dòng <code>final &lt;tiêuĐề&gt; v&lt;phiênBản&gt;</code>.</p>',
        stdin: 'A 1 A-changed\nB 1 B-changed\nC none C-changed\nB 2 B-again\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          "const note = { id: 1, title: 'Original', version: 1 };\n" +
          'for (const line of lines) {\n' +
          "  const [actor, ifMatch, ...rest] = line.trim().split(/\\s+/);\n" +
          "  const title = rest.join(' ');\n" +
          "  if (ifMatch === 'none') { console.log(`${actor} 428`); continue; }\n" +
          '  if (Number(ifMatch) !== note.version) { console.log(`${actor} 412`); continue; }\n' +
          '  note.title = title;\n' +
          '  note.version += 1;\n' +
          '  console.log(`${actor} 200 v${note.version}`);\n' +
          '}\n' +
          'console.log(`final ${note.title} v${note.version}`);\n',
      },
    ],
  },

  {
    code: 'PE-04',
    title: { en: 'Practical Exam 04 — data access without the N+1', vi: 'Thi thực hành 04 — truy cập dữ liệu mà không dính N+1' },
    desc: {
      en: 'Chapter 7 in plain JavaScript: join in memory, aggregate, paginate by cursor, and translate database errors into HTTP.',
      vi: 'Chương 7 bằng JavaScript thuần: gộp dữ liệu trong bộ nhớ, tổng hợp, phân trang bằng con trỏ, và dịch lỗi cơ sở dữ liệu sang HTTP.',
    },
    questions: [
      {
        points: 1.5,
        en: '<p><b>Q1.</b> Read a JSON array of notes. Print, sorted by count DESC then authorId ASC, one line per author: <code>&lt;authorId&gt; &lt;count&gt;</code>. This is the <code>groupBy</code> that replaces fetching every row to call <code>.length</code>.</p>',
        vi: '<p><b>Câu 1.</b> Đọc một mảng JSON các ghi chú. In ra, sắp xếp theo số lượng GIẢM DẦN rồi theo authorId TĂNG DẦN, mỗi tác giả một dòng: <code>&lt;authorId&gt; &lt;số lượng&gt;</code>. Đây chính là phép <code>groupBy</code> thay cho việc lấy hết mọi dòng về rồi gọi <code>.length</code>.</p>',
        stdin: '[{"id":1,"authorId":7},{"id":2,"authorId":3},{"id":3,"authorId":7},{"id":4,"authorId":9},{"id":5,"authorId":3},{"id":6,"authorId":7}]\n',
        solution:
          "const notes = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));\n" +
          'const counts = new Map();\n' +
          'for (const n of notes) counts.set(n.authorId, (counts.get(n.authorId) ?? 0) + 1);\n' +
          '[...counts.entries()]\n' +
          '  .sort((a, b) => b[1] - a[1] || a[0] - b[0])\n' +
          '  .forEach(([authorId, count]) => console.log(authorId, count));\n',
      },
      {
        points: 1.5,
        en: '<p><b>Q2.</b> Read two JSON arrays on two lines: users, then notes. Stitch them WITHOUT a nested scan per user (index the notes by authorId once — this is the dataloader shape). Print one line per user in input order: <code>&lt;name&gt;: &lt;note titles joined by ", "&gt;</code>, or <code>&lt;name&gt;: (none)</code>.</p>',
        vi: '<p><b>Câu 2.</b> Đọc hai mảng JSON trên hai dòng: users, rồi notes. Ghép chúng lại mà KHÔNG quét lồng nhau cho từng người dùng (hãy lập chỉ mục notes theo authorId đúng một lần — đây chính là hình dạng của dataloader). In mỗi người dùng một dòng theo thứ tự đầu vào: <code>&lt;tên&gt;: &lt;các tiêu đề nối bằng ", "&gt;</code>, hoặc <code>&lt;tên&gt;: (none)</code>.</p>',
        stdin: '[{"id":1,"name":"An"},{"id":2,"name":"Binh"},{"id":3,"name":"Chi"}]\n[{"id":10,"authorId":1,"title":"a1"},{"id":11,"authorId":3,"title":"c1"},{"id":12,"authorId":1,"title":"a2"}]\n',
        solution:
          "const [uLine, nLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const users = JSON.parse(uLine);\n' +
          'const notes = JSON.parse(nLine);\n' +
          'const byAuthor = new Map(users.map((u) => [u.id, []]));\n' +
          'for (const n of notes) byAuthor.get(n.authorId)?.push(n.title);\n' +
          'for (const u of users) {\n' +
          '  const titles = byAuthor.get(u.id) ?? [];\n' +
          "  console.log(`${u.name}: ${titles.length ? titles.join(', ') : '(none)'}`);\n" +
          '}\n',
      },
      {
        points: 2,
        en: '<p><b>Q3.</b> Cursor pagination. Read a JSON array of notes (each with <code>id</code> and <code>createdAt</code>) on line 1, then a page size on line 2. Walk the whole set newest-first, ordered by <code>(createdAt DESC, id DESC)</code>, printing one page per line as <code>&lt;ids joined by ","&gt; next=&lt;cursor|null&gt;</code> where the cursor is <code>&lt;createdAt&gt;|&lt;id&gt;</code> of the last row on the page. Fetch <code>limit + 1</code> rows to decide <code>hasMore</code> — never a count.</p>',
        vi: '<p><b>Câu 3.</b> Phân trang bằng con trỏ. Dòng 1 đọc một mảng JSON các ghi chú (mỗi cái có <code>id</code> và <code>createdAt</code>), dòng 2 đọc kích thước trang. Duyệt toàn bộ tập dữ liệu từ mới tới cũ, sắp theo <code>(createdAt GIẢM, id GIẢM)</code>, mỗi trang in một dòng dạng <code>&lt;các id nối bằng ","&gt; next=&lt;con trỏ|null&gt;</code> với con trỏ là <code>&lt;createdAt&gt;|&lt;id&gt;</code> của dòng cuối trang. Hãy lấy <code>limit + 1</code> dòng để biết <code>hasMore</code> — tuyệt đối không đếm tổng.</p>',
        stdin: '[{"id":1,"createdAt":"2026-01-01"},{"id":2,"createdAt":"2026-01-03"},{"id":3,"createdAt":"2026-01-03"},{"id":4,"createdAt":"2026-01-02"},{"id":5,"createdAt":"2026-01-05"}]\n2\n',
        solution:
          "const [rowsLine, limitLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const rows = JSON.parse(rowsLine);\n' +
          'const limit = Number(limitLine);\n' +
          'const sorted = [...rows].sort((a, b) =>\n' +
          '  (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0) || (b.id - a.id));\n' +
          'let cursor = null;\n' +
          'while (true) {\n' +
          '  const start = cursor ? sorted.findIndex((r) => `${r.createdAt}|${r.id}` === cursor) + 1 : 0;\n' +
          '  const slice = sorted.slice(start, start + limit + 1);\n' +
          '  if (!slice.length) break;\n' +
          '  const hasMore = slice.length > limit;\n' +
          '  const page = hasMore ? slice.slice(0, limit) : slice;\n' +
          '  const last = page[page.length - 1];\n' +
          '  cursor = hasMore ? `${last.createdAt}|${last.id}` : null;\n' +
          "  console.log(`${page.map((r) => r.id).join(',')} next=${cursor ?? 'null'}`);\n" +
          '  if (!hasMore) break;\n' +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q4.</b> Translate database errors into HTTP the way the service layer must. Read lines <code>&lt;code&gt; &lt;detail&gt;</code> and print: <code>P2002</code> → <code>409 DUPLICATE &lt;detail&gt; already exists</code>; <code>P2025</code> → <code>404 NOT_FOUND</code>; <code>P2000</code> → <code>422 VALUE_TOO_LONG &lt;detail&gt;</code>; <code>P2028</code> → <code>503 TX_TIMEOUT</code>; anything else → <code>500 INTERNAL</code> and the detail must NOT appear in the output.</p>',
        vi: '<p><b>Câu 4.</b> Dịch lỗi cơ sở dữ liệu sang HTTP đúng như tầng service phải làm. Đọc các dòng <code>&lt;mã&gt; &lt;chi tiết&gt;</code> và in: <code>P2002</code> → <code>409 DUPLICATE &lt;chi tiết&gt; already exists</code>; <code>P2025</code> → <code>404 NOT_FOUND</code>; <code>P2000</code> → <code>422 VALUE_TOO_LONG &lt;chi tiết&gt;</code>; <code>P2028</code> → <code>503 TX_TIMEOUT</code>; còn lại → <code>500 INTERNAL</code> và chi tiết KHÔNG được xuất hiện trong kết quả.</p>',
        stdin: 'P2002 slug\nP2025 note\nP2000 title\nP2028 tx\nP1001 postgres://prod:sieu-mat@db:5432/app\n',
        solution:
          "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'for (const line of lines) {\n' +
          "  const [code, ...rest] = line.trim().split(/\\s+/);\n" +
          "  const detail = rest.join(' ');\n" +
          '  switch (code) {\n' +
          "    case 'P2002': console.log(`409 DUPLICATE ${detail} already exists`); break;\n" +
          "    case 'P2025': console.log('404 NOT_FOUND'); break;\n" +
          "    case 'P2000': console.log(`422 VALUE_TOO_LONG ${detail}`); break;\n" +
          "    case 'P2028': console.log('503 TX_TIMEOUT'); break;\n" +
          '    // 5xx không bao giờ dội chi tiết ra ngoài: nó lộ host, cổng, tên bảng.\n' +
          "    default: console.log('500 INTERNAL');\n" +
          '  }\n' +
          '}\n',
      },
      {
        points: 2.5,
        en: '<p><b>Q5.</b> Count queries like the N+1 experiment does. You are given a JSON array of users and one of notes (two lines). Implement <code>loadNaive()</code> (one query for users, then one per user) and <code>loadBatched()</code> (one for users, one for all their notes with an <code>IN</code> list). Both must return the same result. Print <code>naive queries=&lt;n&gt;</code>, <code>batched queries=&lt;n&gt;</code>, <code>same=&lt;true|false&gt;</code>, comparing the two results as JSON.</p>',
        vi: '<p><b>Câu 5.</b> Đếm số câu truy vấn đúng như thí nghiệm N+1. Bạn được cho một mảng JSON users và một mảng notes (trên hai dòng). Hãy cài <code>loadNaive()</code> (một câu lấy users, rồi mỗi user một câu) và <code>loadBatched()</code> (một câu lấy users, một câu lấy toàn bộ notes của họ bằng danh sách <code>IN</code>). Cả hai phải cho cùng kết quả. In <code>naive queries=&lt;n&gt;</code>, <code>batched queries=&lt;n&gt;</code>, <code>same=&lt;true|false&gt;</code>, so sánh hai kết quả dưới dạng JSON.</p>',
        stdin: '[{"id":1,"name":"An"},{"id":2,"name":"Binh"}]\n[{"id":10,"authorId":1,"title":"a1"},{"id":11,"authorId":2,"title":"b1"},{"id":12,"authorId":1,"title":"a2"}]\n',
        solution:
          "const [uLine, nLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\n" +
          'const USERS = JSON.parse(uLine);\n' +
          'const NOTES = JSON.parse(nLine);\n' +
          'let queries = 0;\n' +
          'const db = {\n' +
          '  users() { queries++; return USERS; },\n' +
          '  notesByAuthor(id) { queries++; return NOTES.filter((n) => n.authorId === id); },\n' +
          '  notesByAuthors(ids) { queries++; return NOTES.filter((n) => ids.includes(n.authorId)); },\n' +
          '};\n' +
          'function loadNaive() {\n' +
          '  const users = db.users();\n' +
          '  return users.map((u) => ({ ...u, notes: db.notesByAuthor(u.id).map((n) => n.title) }));\n' +
          '}\n' +
          'function loadBatched() {\n' +
          '  const users = db.users();\n' +
          '  const notes = db.notesByAuthors(users.map((u) => u.id));\n' +
          '  const byAuthor = new Map(users.map((u) => [u.id, []]));\n' +
          '  for (const n of notes) byAuthor.get(n.authorId).push(n.title);\n' +
          '  return users.map((u) => ({ ...u, notes: byAuthor.get(u.id) }));\n' +
          '}\n' +
          'queries = 0; const a = loadNaive(); const qa = queries;\n' +
          'queries = 0; const b = loadBatched(); const qb = queries;\n' +
          'console.log(`naive queries=${qa}`);\n' +
          'console.log(`batched queries=${qb}`);\n' +
          'console.log(`same=${JSON.stringify(a) === JSON.stringify(b)}`);\n',
      },
    ],
  },
];
