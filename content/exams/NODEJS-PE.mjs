/**
 * Node.js — 10 đề thi thực hành (PE), mỗi đề 5 câu.
 *
 * ⚠️ FILE NÀY ĐƯỢC SINH TỰ ĐỘNG — đừng sửa tay.
 * Nguồn: content/exams/_lib/nodejs-pe-bank-{1,2,3}.mjs
 * Sinh lại: node scripts/exam-build-pe.mjs
 *
 * Mọi `expectedOutput` dưới đây là stdout THẬT của `sampleSolution` tương ứng
 * khi chạy bằng `node` với đúng phần INPUT ghi kèm.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-PE.mjs --apply
 */
import { B } from './_lib/nodejs-exam-kit.mjs';

const RUBRIC = [
    { id: 'correct', criterion: B('The program produces exactly the expected output for the given input, including the edge cases named in the problem.', 'Chương trình cho đúng kết quả kỳ vọng với dữ liệu vào đã cho, kể cả các ca biên nêu trong đề.'), weight: 3, maxScore: 4 },
    { id: 'logic', criterion: B('The approach matches what the problem asks for — parallel where it says parallel, bounded where it says bounded, no hidden per-item query where it forbids one.', 'Cách làm đúng như đề yêu cầu — song song ở chỗ đề nói song song, có giới hạn ở chỗ đề nói giới hạn, không lén truy vấn theo từng phần tử ở chỗ đề cấm.'), weight: 2, maxScore: 4 },
    { id: 'quality', criterion: B('Readable Node.js: clear names, no dead code, no dependency beyond the standard library.', 'Mã Node.js dễ đọc: đặt tên rõ, không có mã thừa, không dùng thư viện ngoài thư viện chuẩn.'), weight: 1, maxScore: 4 },
  ];

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-01',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B("Practical Exam 01 — JavaScript foundations for the backend", "Thi thực hành 01 — JavaScript nền tảng cho backend"),
      description: B("Chapter 1: scope and closures, references and copying, async orchestration, and the errors nobody owns.", "Chương 1: phạm vi và closure, tham chiếu và sao chép, điều phối bất đồng bộ, và những lỗi không ai nhận."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Read one line of comma-separated integers from stdin. Print, on one line, the count of numbers, their sum, and their average rounded to two decimals, separated by spaces. An empty line means <code>0 0 0.00</code>.</p>",
            "<p><b>Câu 1.</b> Đọc một dòng gồm các số nguyên cách nhau bởi dấu phẩy từ stdin. In trên một dòng: số lượng số, tổng của chúng, và trung bình cộng làm tròn hai chữ số thập phân, cách nhau bằng dấu cách. Dòng rỗng thì in <code>0 0 0.00</code>.</p>",
          ),
          expectedOutput: "INPUT:\n4,8,15,16,23,42\nOUTPUT:\n6 108 18.00",
          sampleSolution: "const line = require('node:fs').readFileSync(0, 'utf8').trim();\nconst nums = line ? line.split(',').map(Number) : [];\nconst sum = nums.reduce((a, b) => a + b, 0);\nconst avg = nums.length ? sum / nums.length : 0;\nconsole.log(nums.length, sum, avg.toFixed(2));\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Write <code>createCounter()</code>: it returns a function that returns 1, 2, 3… on successive calls, and two counters created separately must NOT share state. Read one integer <code>n</code> from stdin, call counter A <code>n</code> times and counter B twice, then print <code>A=&lt;last A&gt; B=&lt;last B&gt; leak=&lt;typeof count outside&gt;</code>.</p>",
            "<p><b>Câu 2.</b> Viết <code>createCounter()</code>: nó trả về một hàm mà mỗi lần gọi lần lượt cho 1, 2, 3…, và hai bộ đếm tạo riêng thì KHÔNG dùng chung trạng thái. Đọc một số nguyên <code>n</code> từ stdin, gọi bộ đếm A <code>n</code> lần và bộ đếm B hai lần, rồi in <code>A=&lt;giá trị A cuối&gt; B=&lt;giá trị B cuối&gt; leak=&lt;typeof count ở ngoài&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n5\nOUTPUT:\nA=5 B=2 leak=undefined",
          sampleSolution: "const n = Number(require('node:fs').readFileSync(0, 'utf8').trim());\nfunction createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst a = createCounter(), b = createCounter();\nlet last = 0;\nfor (let i = 0; i < n; i++) last = a();\nb();\nconst lastB = b();\nconsole.log(`A=${last} B=${lastB} leak=${typeof count}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Read a JSON object from stdin. Produce a DEEP copy, then set <code>copy.address.city = \"Da Nang\"</code> and push <code>\"new\"</code> onto <code>copy.tags</code>. Print the original as JSON on line 1 and the copy on line 2 — the original must be unchanged. A shallow spread will fail this.</p>",
            "<p><b>Câu 3.</b> Đọc một object JSON từ stdin. Tạo bản sao SÂU, rồi gán <code>copy.address.city = \"Da Nang\"</code> và thêm <code>\"new\"</code> vào <code>copy.tags</code>. In bản gốc dạng JSON ở dòng 1 và bản sao ở dòng 2 — bản gốc phải nguyên vẹn. Dùng spread nông sẽ trượt câu này.</p>",
          ),
          expectedOutput: "INPUT:\n{\"name\":\"An\",\"address\":{\"city\":\"Ha Noi\"},\"tags\":[\"a\"]}\nOUTPUT:\n{\"name\":\"An\",\"address\":{\"city\":\"Ha Noi\"},\"tags\":[\"a\"]}\n{\"name\":\"An\",\"address\":{\"city\":\"Da Nang\"},\"tags\":[\"a\",\"new\"]}",
          sampleSolution: "const original = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));\nconst copy = structuredClone(original);\ncopy.address.city = 'Da Nang';\ncopy.tags.push('new');\nconsole.log(JSON.stringify(original));\nconsole.log(JSON.stringify(copy));\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Read lines of the form <code>&lt;name&gt; &lt;ms&gt; &lt;ok|fail&gt;</code>. Run every task IN PARALLEL (each task is a promise that settles after <code>ms</code> milliseconds; a <code>fail</code> task rejects with the message <code>&lt;name&gt; failed</code>) and never let one failure cancel the others. Print one line per task in INPUT order: <code>&lt;name&gt; ok</code> or <code>&lt;name&gt; error &lt;message&gt;</code>, then a last line <code>ok=&lt;n&gt; failed=&lt;n&gt;</code>. Total runtime must be about the slowest task, not the sum.</p>",
            "<p><b>Câu 4.</b> Đọc các dòng dạng <code>&lt;tên&gt; &lt;ms&gt; &lt;ok|fail&gt;</code>. Chạy mọi tác vụ SONG SONG (mỗi tác vụ là một promise kết thúc sau <code>ms</code> mili-giây; tác vụ <code>fail</code> thì ném lỗi với thông điệp <code>&lt;tên&gt; failed</code>) và không để một lỗi làm hỏng những cái còn lại. In mỗi tác vụ một dòng theo ĐÚNG thứ tự đầu vào: <code>&lt;tên&gt; ok</code> hoặc <code>&lt;tên&gt; error &lt;thông điệp&gt;</code>, rồi dòng cuối <code>ok=&lt;n&gt; failed=&lt;n&gt;</code>. Tổng thời gian chạy phải xấp xỉ tác vụ chậm nhất, không phải tổng các tác vụ.</p>",
          ),
          expectedOutput: "INPUT:\nuser 60 ok\ndb 30 fail\nnotes 50 ok\nreport 40 fail\nOUTPUT:\nuser ok\ndb error db failed\nnotes ok\nreport error report failed\nok=2 failed=2",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst tasks = lines.map((l) => { const [name, ms, kind] = l.trim().split(/\\s+/); return { name, ms: Number(ms), kind }; });\nconst run = (t) => new Promise((res, rej) => setTimeout(() => {\n  if (t.kind === 'fail') rej(new Error(`${t.name} failed`)); else res(t.name);\n}, t.ms));\n(async () => {\n  // Gọi run() cho TẤT CẢ trước rồi mới await — đó là chỗ quyết định song song.\n  const settled = await Promise.allSettled(tasks.map(run));\n  let ok = 0, failed = 0;\n  settled.forEach((r, i) => {\n    if (r.status === 'fulfilled') { ok++; console.log(`${tasks[i].name} ok`); }\n    else { failed++; console.log(`${tasks[i].name} error ${r.reason.message}`); }\n  });\n  console.log(`ok=${ok} failed=${failed}`);\n})();\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Read lines <code>&lt;id&gt; &lt;ms&gt;</code>. Process them with a concurrency LIMIT of 2: never more than two in flight, start the next as soon as a slot frees. Each job resolves with its id after <code>ms</code>. Print results in COMPLETION order, one per line, then <code>done=&lt;count&gt;</code>. (A plain <code>Promise.all</code> over all of them would run five at once and fail this.)</p>",
            "<p><b>Câu 5.</b> Đọc các dòng <code>&lt;id&gt; &lt;ms&gt;</code>. Xử lý chúng với GIỚI HẠN đồng thời bằng 2: không bao giờ có quá hai việc đang chạy, và có chỗ trống là bắt đầu ngay việc kế tiếp. Mỗi việc trả về id của nó sau <code>ms</code>. In kết quả theo thứ tự HOÀN THÀNH, mỗi dòng một cái, rồi in <code>done=&lt;số lượng&gt;</code>. (Dùng <code>Promise.all</code> cho tất cả sẽ chạy năm việc cùng lúc và trượt câu này.)</p>",
          ),
          expectedOutput: "INPUT:\na 500\nb 100\nc 150\nd 100\ne 60\nOUTPUT:\nb\nc\nd\ne\na\ndone=5",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst jobs = lines.map((l) => { const [id, ms] = l.trim().split(/\\s+/); return { id, ms: Number(ms) }; });\nconst sleep = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));\n(async () => {\n  const LIMIT = 2;\n  const out = [];\n  let next = 0;\n  async function worker() {\n    while (next < jobs.length) {\n      const job = jobs[next++];\n      const id = await sleep(job.ms, job.id);\n      out.push(id);\n      console.log(id);\n    }\n  }\n  await Promise.all(Array.from({ length: LIMIT }, worker));\n  console.log(`done=${out.length}`);\n})();\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-02',
      source: 'SAMPLE',
      sortOrder: 11,
      title: B("Practical Exam 02 — the runtime and the core modules", "Thi thực hành 02 — runtime và các module lõi"),
      description: B("Chapters 2 and 3: bytes versus characters, path safety, event emitters, and chunked processing.", "Chương 2 và 3: byte so với ký tự, an toàn đường dẫn, EventEmitter, và xử lý theo khối."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Read one line of UTF-8 text. Print three lines: the number of CHARACTERS, the number of BYTES, and the first 8 bytes in hex (lowercase, no separator).</p>",
            "<p><b>Câu 1.</b> Đọc một dòng văn bản UTF-8. In ba dòng: số KÝ TỰ, số BYTE, và 8 byte đầu tiên dưới dạng hex (chữ thường, không dấu phân cách).</p>",
          ),
          expectedOutput: "INPUT:\nXin chào\nOUTPUT:\n8\n9\n58696e206368c3a0",
          sampleSolution: "const s = require('node:fs').readFileSync(0, 'utf8').replace(/\\n$/, '');\nconst b = Buffer.from(s, 'utf8');\nconsole.log(s.length);\nconsole.log(b.length);\nconsole.log(b.subarray(0, 8).toString('hex'));\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> The upload directory is <code>/var/app/uploads</code>. Read one filename per line and print <code>&lt;name&gt; -&gt; OK &lt;resolved path&gt;</code> if the resolved path stays inside the upload directory, or <code>&lt;name&gt; -&gt; REJECT</code> if it escapes. Use <code>path.resolve</code> and compare against the directory plus <code>path.sep</code>.</p>",
            "<p><b>Câu 2.</b> Thư mục upload là <code>/var/app/uploads</code>. Mỗi dòng đọc một tên file và in <code>&lt;tên&gt; -&gt; OK &lt;đường dẫn đã resolve&gt;</code> nếu đường dẫn sau khi resolve vẫn nằm trong thư mục upload, hoặc <code>&lt;tên&gt; -&gt; REJECT</code> nếu nó thoát ra ngoài. Hãy dùng <code>path.resolve</code> và so với thư mục cộng <code>path.sep</code>.</p>",
          ),
          expectedOutput: "INPUT:\nanh.png\n../../etc/passwd\nsub/dir/b.jpg\n..%2Fx\n/etc/hosts\nOUTPUT:\nanh.png -> OK /var/app/uploads/anh.png\n../../etc/passwd -> REJECT\nsub/dir/b.jpg -> OK /var/app/uploads/sub/dir/b.jpg\n..%2Fx -> OK /var/app/uploads/..%2Fx\n/etc/hosts -> REJECT",
          sampleSolution: "const path = require('node:path');\nconst lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\nconst DIR = '/var/app/uploads';\nconst base = path.resolve(DIR) + path.sep;\nfor (const name of lines) {\n  const full = path.resolve(DIR, name);\n  console.log(full.startsWith(base) ? `${name} -> OK ${full}` : `${name} -> REJECT`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Build a tiny event bus on <code>EventEmitter</code>. Read lines: <code>on &lt;event&gt;</code> adds a permanent listener, <code>once &lt;event&gt;</code> adds a one-shot listener, <code>emit &lt;event&gt;</code> fires it. For every emit print <code>&lt;event&gt; handled=&lt;how many listeners ran&gt; left=&lt;listenerCount after&gt;</code>. Attach an <code>error</code> listener so emitting <code>error</code> does not kill the process; print <code>caught &lt;event&gt;</code> for it.</p>",
            "<p><b>Câu 3.</b> Dựng một bus sự kiện nhỏ trên <code>EventEmitter</code>. Đọc từng dòng: <code>on &lt;sự kiện&gt;</code> thêm listener thường trực, <code>once &lt;sự kiện&gt;</code> thêm listener chạy một lần, <code>emit &lt;sự kiện&gt;</code> phát sự kiện. Mỗi lần emit thì in <code>&lt;sự kiện&gt; handled=&lt;số listener đã chạy&gt; left=&lt;listenerCount sau đó&gt;</code>. Nhớ gắn listener cho <code>error</code> để việc phát <code>error</code> không giết tiến trình; với nó thì in <code>caught &lt;sự kiện&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\non saved\nonce saved\nemit saved\nemit saved\nemit error\nOUTPUT:\nsaved handled=2 left=1\nsaved handled=1 left=1\ncaught error",
          sampleSolution: "const { EventEmitter } = require('node:events');\nconst lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst bus = new EventEmitter();\nlet ran = 0;\nbus.on('error', () => { console.log('caught error'); });\nfor (const line of lines) {\n  const [cmd, ev] = line.trim().split(/\\s+/);\n  if (cmd === 'on') bus.on(ev, () => { ran++; });\n  else if (cmd === 'once') bus.once(ev, () => { ran++; });\n  else {\n    ran = 0;\n    bus.emit(ev);\n    if (ev !== 'error') console.log(`${ev} handled=${ran} left=${bus.listenerCount(ev)}`);\n  }\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Read a line of text and a number <code>k</code> on the next line. Cut the text to at most <code>k</code> BYTES without ever splitting a multi-byte character (no <code>\\uFFFD</code> in the output). Print the cut string, then its byte length. Cutting the Buffer blindly is the trap.</p>",
            "<p><b>Câu 4.</b> Đọc một dòng văn bản và một số <code>k</code> ở dòng kế. Cắt văn bản còn tối đa <code>k</code> BYTE mà tuyệt đối không cắt ngang một ký tự nhiều byte (kết quả không được có <code>\\uFFFD</code>). In chuỗi đã cắt, rồi in độ dài byte của nó. Cắt thẳng trên Buffer chính là cái bẫy.</p>",
          ),
          expectedOutput: "INPUT:\nXin chào các bạn\n10\nOUTPUT:\nXin chào \n10",
          sampleSolution: "const [text, kLine] = require('node:fs').readFileSync(0, 'utf8').split('\\n');\nconst k = Number(kLine);\nlet out = '';\nfor (const ch of text) {\n  if (Buffer.byteLength(out + ch, 'utf8') > k) break;\n  out += ch;\n}\nconsole.log(out);\nconsole.log(Buffer.byteLength(out, 'utf8'));\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Read a number <code>n</code>, then accumulate the sum of squares of 1..n in CHUNKS of 1000, yielding to the event loop between chunks with <code>setImmediate</code>. A competing task also reschedules itself with <code>setImmediate</code> and counts its own runs until the chunked work is done. Print <code>sum=&lt;value&gt;</code>, then <code>chunks=&lt;how many chunks&gt;</code>, then <code>yielded=true</code> if the competing task ran at least <code>chunks - 1</code> times — which can only happen if you really did give the loop its turn between chunks.</p>",
            "<p><b>Câu 5.</b> Đọc một số <code>n</code>, rồi cộng dồn tổng bình phương của 1..n theo KHỐI 1000 phần tử, giữa các khối thì nhường lượt cho event loop bằng <code>setImmediate</code>. Một tác vụ cạnh tranh cũng tự hẹn lại chính nó bằng <code>setImmediate</code> và đếm số lần nó chạy, cho tới khi phần việc chia khối xong. In <code>sum=&lt;giá trị&gt;</code>, rồi <code>chunks=&lt;số khối&gt;</code>, rồi <code>yielded=true</code> nếu tác vụ cạnh tranh chạy được ít nhất <code>chunks - 1</code> lần — điều chỉ xảy ra khi bạn thật sự nhường lượt cho event loop giữa các khối.</p>",
          ),
          expectedOutput: "INPUT:\n200000\nOUTPUT:\nsum=2666686666700000\nchunks=200\nyielded=true",
          sampleSolution: "const n = Number(require('node:fs').readFileSync(0, 'utf8').trim());\nconst CHUNK = 1000;\nlet i = 1, sum = 0, chunks = 0, otherRuns = 0, done = false;\nfunction otherTask() {\n  if (done) return;\n  otherRuns++;\n  setImmediate(otherTask);\n}\nfunction runChunk() {\n  const end = Math.min(i + CHUNK - 1, n);\n  for (; i <= end; i++) sum += i * i;\n  chunks++;\n  if (i <= n) return setImmediate(runChunk);   // nhường lượt cho event loop\n  done = true;\n  console.log(`sum=${sum}`);\n  console.log(`chunks=${chunks}`);\n  console.log(`yielded=${otherRuns >= chunks - 1}`);\n}\notherTask();\nrunChunk();\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-03',
      source: 'SAMPLE',
      sortOrder: 12,
      title: B("Practical Exam 03 — routing, middleware and status codes", "Thi thực hành 03 — định tuyến, middleware và mã trạng thái"),
      description: B("Chapters 5 and 6 without a framework: match routes the way Express does, run a middleware chain, and choose the right status code.", "Chương 5 và 6 nhưng không dùng framework: khớp route đúng như Express làm, chạy một dây chuyền middleware, và chọn đúng mã trạng thái."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Read a route table (lines <code>&lt;METHOD&gt; &lt;pattern&gt; &lt;handlerName&gt;</code>) until a line <code>---</code>, then read requests (<code>&lt;METHOD&gt; &lt;path&gt;</code>). Match in DECLARATION ORDER, first match wins, where a segment starting with <code>:</code> matches any single segment. Print <code>&lt;handlerName&gt; &lt;params as JSON&gt;</code> or <code>404</code>.</p>",
            "<p><b>Câu 1.</b> Đọc bảng route (các dòng <code>&lt;METHOD&gt; &lt;mẫu&gt; &lt;tênHandler&gt;</code>) cho tới dòng <code>---</code>, rồi đọc các request (<code>&lt;METHOD&gt; &lt;đường dẫn&gt;</code>). Khớp theo ĐÚNG THỨ TỰ KHAI BÁO, ai khớp trước thì thắng, trong đó đoạn bắt đầu bằng <code>:</code> khớp với một đoạn bất kỳ. In <code>&lt;tênHandler&gt; &lt;params dạng JSON&gt;</code> hoặc <code>404</code>.</p>",
          ),
          expectedOutput: "INPUT:\nGET /notes/:id getNote\nGET /notes/new newNote\nGET /notes/:id/comments listComments\n---\nGET /notes/42\nGET /notes/new\nGET /notes/7/comments\nPOST /notes/42\nGET /notes\nOUTPUT:\ngetNote {\"id\":\"42\"}\ngetNote {\"id\":\"new\"}\nlistComments {\"id\":\"7\"}\n404\n404",
          sampleSolution: "const raw = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst sep = raw.indexOf('---');\nconst routes = raw.slice(0, sep).map((l) => { const [method, pattern, name] = l.trim().split(/\\s+/); return { method, parts: pattern.split('/').filter(Boolean), name }; });\nconst reqs = raw.slice(sep + 1);\nfor (const line of reqs) {\n  const [method, url] = line.trim().split(/\\s+/);\n  const parts = url.split('/').filter(Boolean);\n  let hit = null;\n  for (const r of routes) {\n    if (r.method !== method || r.parts.length !== parts.length) continue;\n    const params = {};\n    let ok = true;\n    for (let i = 0; i < parts.length; i++) {\n      if (r.parts[i].startsWith(':')) params[r.parts[i].slice(1)] = parts[i];\n      else if (r.parts[i] !== parts[i]) { ok = false; break; }\n    }\n    if (ok) { hit = { name: r.name, params }; break; }\n  }\n  console.log(hit ? `${hit.name} ${JSON.stringify(hit.params)}` : '404');\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Read query strings, one per line, and normalise them the way a list endpoint must: <code>page</code> defaults to 1 and is at least 1; <code>limit</code> defaults to 10 and is clamped to 1..50; <code>sort</code> must be one of <code>createdAt|title</code> (anything else falls back to <code>createdAt</code>). Print the result as JSON with keys in the order page, limit, sort. A repeated key (<code>a=1&amp;a=2</code>) must use the LAST value.</p>",
            "<p><b>Câu 2.</b> Đọc các chuỗi truy vấn, mỗi dòng một cái, và chuẩn hoá đúng như một endpoint danh sách phải làm: <code>page</code> mặc định 1 và tối thiểu 1; <code>limit</code> mặc định 10 và kẹp trong 1..50; <code>sort</code> phải thuộc <code>createdAt|title</code> (khác đi thì quay về <code>createdAt</code>). In kết quả dạng JSON với thứ tự khoá page, limit, sort. Khoá lặp lại (<code>a=1&amp;a=2</code>) thì lấy giá trị CUỐI.</p>",
          ),
          expectedOutput: "INPUT:\npage=3&limit=25&sort=title\nlimit=500\npage=0&limit=0\nsort=colour\npage=2&page=9\nOUTPUT:\n{\"page\":3,\"limit\":25,\"sort\":\"title\"}\n{\"page\":1,\"limit\":50,\"sort\":\"createdAt\"}\n{\"page\":1,\"limit\":1,\"sort\":\"createdAt\"}\n{\"page\":1,\"limit\":10,\"sort\":\"createdAt\"}\n{\"page\":9,\"limit\":10,\"sort\":\"createdAt\"}",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst SORTABLE = ['createdAt', 'title'];\nfor (const line of lines) {\n  const q = Object.fromEntries(new URLSearchParams(line.trim()));\n  const rawPage = Number(q.page ?? 1);\n  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;\n  const rawLimit = Number(q.limit ?? 10);\n  const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.floor(rawLimit))) : 10;\n  const sort = SORTABLE.includes(q.sort) ? q.sort : 'createdAt';\n  console.log(JSON.stringify({ page, limit, sort }));\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Implement a middleware chain. Middlewares are given as lines <code>&lt;name&gt; &lt;action&gt;</code> where action is <code>next</code>, <code>respond &lt;code&gt;</code>, <code>error &lt;code&gt;</code> or <code>hang</code>. Run them in order. Print each middleware name as it runs. Then print the outcome: <code>RESPONSE &lt;code&gt;</code>, or <code>ERROR &lt;code&gt;</code> (an <code>error</code> jumps straight to the error handler, skipping the rest), or <code>HANG</code> if a middleware neither responded nor called next, or <code>404</code> if the chain finished with no response.</p>",
            "<p><b>Câu 3.</b> Cài đặt một dây chuyền middleware. Mỗi middleware cho dưới dạng dòng <code>&lt;tên&gt; &lt;hành động&gt;</code> với hành động là <code>next</code>, <code>respond &lt;mã&gt;</code>, <code>error &lt;mã&gt;</code> hoặc <code>hang</code>. Chạy chúng theo thứ tự. In tên từng middleware khi nó chạy. Sau đó in kết cục: <code>RESPONSE &lt;mã&gt;</code>, hoặc <code>ERROR &lt;mã&gt;</code> (gặp <code>error</code> thì nhảy thẳng tới error handler, bỏ qua phần còn lại), hoặc <code>HANG</code> nếu một middleware không trả lời cũng không gọi next, hoặc <code>404</code> nếu chạy hết dây chuyền mà chưa ai trả lời.</p>",
          ),
          expectedOutput: "INPUT:\nlogger next\ncors next\nauth error 401\nhandler respond 200\nOUTPUT:\nlogger\ncors\nauth\nERROR 401",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nlet outcome = '404';\nfor (const line of lines) {\n  const [name, action, code] = line.trim().split(/\\s+/);\n  console.log(name);\n  if (action === 'respond') { outcome = `RESPONSE ${code}`; break; }\n  if (action === 'error') { outcome = `ERROR ${code}`; break; }\n  if (action === 'hang') { outcome = 'HANG'; break; }\n}\nconsole.log(outcome);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Read one JSON body per line for <code>POST /notes</code> and decide the status code exactly as chapter 6 prescribes. Rules, checked in this order: body is not valid JSON → <code>400 INVALID_JSON</code>; <code>title</code> missing or not a string or empty after trim → <code>422 VALIDATION_FAILED title</code>; <code>title</code> longer than 200 → <code>422 VALIDATION_FAILED title</code>; the title already exists (case-insensitive, among the ones accepted so far) → <code>409 DUPLICATE</code>; otherwise <code>201 /api/v1/notes/&lt;id&gt;</code> with ids starting at 1. Print one line per request.</p>",
            "<p><b>Câu 4.</b> Mỗi dòng đọc một thân JSON của <code>POST /notes</code> và quyết định mã trạng thái đúng như chương 6 quy định. Luật, kiểm theo đúng thứ tự này: thân không phải JSON hợp lệ → <code>400 INVALID_JSON</code>; <code>title</code> thiếu, không phải chuỗi, hoặc rỗng sau khi trim → <code>422 VALIDATION_FAILED title</code>; <code>title</code> dài quá 200 → <code>422 VALIDATION_FAILED title</code>; tiêu đề đã tồn tại (không phân biệt hoa thường, trong số những cái đã được chấp nhận) → <code>409 DUPLICATE</code>; còn lại → <code>201 /api/v1/notes/&lt;id&gt;</code> với id bắt đầu từ 1. In mỗi request một dòng.</p>",
          ),
          expectedOutput: "INPUT:\n{\"title\":\"Learning Express\"}\n{\"title\":\"   \"}\n{\"body\":\"no title\"}\n{title:}\n{\"title\":\"learning express\"}\n{\"title\":\"Second note\"}\nOUTPUT:\n201 /api/v1/notes/1\n422 VALIDATION_FAILED title\n422 VALIDATION_FAILED title\n400 INVALID_JSON\n409 DUPLICATE\n201 /api/v1/notes/2",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst seen = new Set();\nlet id = 0;\nfor (const line of lines) {\n  let body;\n  try { body = JSON.parse(line); } catch { console.log('400 INVALID_JSON'); continue; }\n  const title = body?.title;\n  if (typeof title !== 'string' || title.trim() === '' || title.length > 200) {\n    console.log('422 VALIDATION_FAILED title');\n    continue;\n  }\n  const key = title.trim().toLowerCase();\n  if (seen.has(key)) { console.log('409 DUPLICATE'); continue; }\n  seen.add(key);\n  console.log(`201 /api/v1/notes/${++id}`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Implement optimistic concurrency. State starts as <code>{ id: 1, title: \"Original\", version: 1 }</code>. Read lines <code>&lt;actor&gt; &lt;ifMatchVersion|none&gt; &lt;newTitle&gt;</code>. If <code>none</code> → print <code>&lt;actor&gt; 428</code>. If the version does not match the current one → <code>&lt;actor&gt; 412</code>. Otherwise apply the change, bump the version and print <code>&lt;actor&gt; 200 v&lt;newVersion&gt;</code>. Finish with a line <code>final &lt;title&gt; v&lt;version&gt;</code>.</p>",
            "<p><b>Câu 5.</b> Cài đặt điều khiển đồng thời lạc quan. Trạng thái ban đầu là <code>{ id: 1, title: \"Original\", version: 1 }</code>. Đọc các dòng <code>&lt;người&gt; &lt;phiênBảnIfMatch|none&gt; &lt;tiêuĐềMới&gt;</code>. Nếu là <code>none</code> → in <code>&lt;người&gt; 428</code>. Nếu phiên bản không khớp phiên bản hiện tại → <code>&lt;người&gt; 412</code>. Còn lại thì áp dụng thay đổi, tăng phiên bản và in <code>&lt;người&gt; 200 v&lt;phiênBảnMới&gt;</code>. Kết thúc bằng dòng <code>final &lt;tiêuĐề&gt; v&lt;phiênBản&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\nA 1 A-changed\nB 1 B-changed\nC none C-changed\nB 2 B-again\nOUTPUT:\nA 200 v2\nB 412\nC 428\nB 200 v3\nfinal B-again v3",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst note = { id: 1, title: 'Original', version: 1 };\nfor (const line of lines) {\n  const [actor, ifMatch, ...rest] = line.trim().split(/\\s+/);\n  const title = rest.join(' ');\n  if (ifMatch === 'none') { console.log(`${actor} 428`); continue; }\n  if (Number(ifMatch) !== note.version) { console.log(`${actor} 412`); continue; }\n  note.title = title;\n  note.version += 1;\n  console.log(`${actor} 200 v${note.version}`);\n}\nconsole.log(`final ${note.title} v${note.version}`);\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-04',
      source: 'SAMPLE',
      sortOrder: 13,
      title: B("Practical Exam 04 — data access without the N+1", "Thi thực hành 04 — truy cập dữ liệu mà không dính N+1"),
      description: B("Chapter 7 in plain JavaScript: join in memory, aggregate, paginate by cursor, and translate database errors into HTTP.", "Chương 7 bằng JavaScript thuần: gộp dữ liệu trong bộ nhớ, tổng hợp, phân trang bằng con trỏ, và dịch lỗi cơ sở dữ liệu sang HTTP."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Read a JSON array of notes. Print, sorted by count DESC then authorId ASC, one line per author: <code>&lt;authorId&gt; &lt;count&gt;</code>. This is the <code>groupBy</code> that replaces fetching every row to call <code>.length</code>.</p>",
            "<p><b>Câu 1.</b> Đọc một mảng JSON các ghi chú. In ra, sắp xếp theo số lượng GIẢM DẦN rồi theo authorId TĂNG DẦN, mỗi tác giả một dòng: <code>&lt;authorId&gt; &lt;số lượng&gt;</code>. Đây chính là phép <code>groupBy</code> thay cho việc lấy hết mọi dòng về rồi gọi <code>.length</code>.</p>",
          ),
          expectedOutput: "INPUT:\n[{\"id\":1,\"authorId\":7},{\"id\":2,\"authorId\":3},{\"id\":3,\"authorId\":7},{\"id\":4,\"authorId\":9},{\"id\":5,\"authorId\":3},{\"id\":6,\"authorId\":7}]\nOUTPUT:\n7 3\n3 2\n9 1",
          sampleSolution: "const notes = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));\nconst counts = new Map();\nfor (const n of notes) counts.set(n.authorId, (counts.get(n.authorId) ?? 0) + 1);\n[...counts.entries()]\n  .sort((a, b) => b[1] - a[1] || a[0] - b[0])\n  .forEach(([authorId, count]) => console.log(authorId, count));\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Read two JSON arrays on two lines: users, then notes. Stitch them WITHOUT a nested scan per user (index the notes by authorId once — this is the dataloader shape). Print one line per user in input order: <code>&lt;name&gt;: &lt;note titles joined by \", \"&gt;</code>, or <code>&lt;name&gt;: (none)</code>.</p>",
            "<p><b>Câu 2.</b> Đọc hai mảng JSON trên hai dòng: users, rồi notes. Ghép chúng lại mà KHÔNG quét lồng nhau cho từng người dùng (hãy lập chỉ mục notes theo authorId đúng một lần — đây chính là hình dạng của dataloader). In mỗi người dùng một dòng theo thứ tự đầu vào: <code>&lt;tên&gt;: &lt;các tiêu đề nối bằng \", \"&gt;</code>, hoặc <code>&lt;tên&gt;: (none)</code>.</p>",
          ),
          expectedOutput: "INPUT:\n[{\"id\":1,\"name\":\"An\"},{\"id\":2,\"name\":\"Binh\"},{\"id\":3,\"name\":\"Chi\"}]\n[{\"id\":10,\"authorId\":1,\"title\":\"a1\"},{\"id\":11,\"authorId\":3,\"title\":\"c1\"},{\"id\":12,\"authorId\":1,\"title\":\"a2\"}]\nOUTPUT:\nAn: a1, a2\nBinh: (none)\nChi: c1",
          sampleSolution: "const [uLine, nLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst users = JSON.parse(uLine);\nconst notes = JSON.parse(nLine);\nconst byAuthor = new Map(users.map((u) => [u.id, []]));\nfor (const n of notes) byAuthor.get(n.authorId)?.push(n.title);\nfor (const u of users) {\n  const titles = byAuthor.get(u.id) ?? [];\n  console.log(`${u.name}: ${titles.length ? titles.join(', ') : '(none)'}`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Cursor pagination. Read a JSON array of notes (each with <code>id</code> and <code>createdAt</code>) on line 1, then a page size on line 2. Walk the whole set newest-first, ordered by <code>(createdAt DESC, id DESC)</code>, printing one page per line as <code>&lt;ids joined by \",\"&gt; next=&lt;cursor|null&gt;</code> where the cursor is <code>&lt;createdAt&gt;|&lt;id&gt;</code> of the last row on the page. Fetch <code>limit + 1</code> rows to decide <code>hasMore</code> — never a count.</p>",
            "<p><b>Câu 3.</b> Phân trang bằng con trỏ. Dòng 1 đọc một mảng JSON các ghi chú (mỗi cái có <code>id</code> và <code>createdAt</code>), dòng 2 đọc kích thước trang. Duyệt toàn bộ tập dữ liệu từ mới tới cũ, sắp theo <code>(createdAt GIẢM, id GIẢM)</code>, mỗi trang in một dòng dạng <code>&lt;các id nối bằng \",\"&gt; next=&lt;con trỏ|null&gt;</code> với con trỏ là <code>&lt;createdAt&gt;|&lt;id&gt;</code> của dòng cuối trang. Hãy lấy <code>limit + 1</code> dòng để biết <code>hasMore</code> — tuyệt đối không đếm tổng.</p>",
          ),
          expectedOutput: "INPUT:\n[{\"id\":1,\"createdAt\":\"2026-01-01\"},{\"id\":2,\"createdAt\":\"2026-01-03\"},{\"id\":3,\"createdAt\":\"2026-01-03\"},{\"id\":4,\"createdAt\":\"2026-01-02\"},{\"id\":5,\"createdAt\":\"2026-01-05\"}]\n2\nOUTPUT:\n5,3 next=2026-01-03|3\n2,4 next=2026-01-02|4\n1 next=null",
          sampleSolution: "const [rowsLine, limitLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst rows = JSON.parse(rowsLine);\nconst limit = Number(limitLine);\nconst sorted = [...rows].sort((a, b) =>\n  (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0) || (b.id - a.id));\nlet cursor = null;\nwhile (true) {\n  const start = cursor ? sorted.findIndex((r) => `${r.createdAt}|${r.id}` === cursor) + 1 : 0;\n  const slice = sorted.slice(start, start + limit + 1);\n  if (!slice.length) break;\n  const hasMore = slice.length > limit;\n  const page = hasMore ? slice.slice(0, limit) : slice;\n  const last = page[page.length - 1];\n  cursor = hasMore ? `${last.createdAt}|${last.id}` : null;\n  console.log(`${page.map((r) => r.id).join(',')} next=${cursor ?? 'null'}`);\n  if (!hasMore) break;\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Translate database errors into HTTP the way the service layer must. Read lines <code>&lt;code&gt; &lt;detail&gt;</code> and print: <code>P2002</code> → <code>409 DUPLICATE &lt;detail&gt; already exists</code>; <code>P2025</code> → <code>404 NOT_FOUND</code>; <code>P2000</code> → <code>422 VALUE_TOO_LONG &lt;detail&gt;</code>; <code>P2028</code> → <code>503 TX_TIMEOUT</code>; anything else → <code>500 INTERNAL</code> and the detail must NOT appear in the output.</p>",
            "<p><b>Câu 4.</b> Dịch lỗi cơ sở dữ liệu sang HTTP đúng như tầng service phải làm. Đọc các dòng <code>&lt;mã&gt; &lt;chi tiết&gt;</code> và in: <code>P2002</code> → <code>409 DUPLICATE &lt;chi tiết&gt; already exists</code>; <code>P2025</code> → <code>404 NOT_FOUND</code>; <code>P2000</code> → <code>422 VALUE_TOO_LONG &lt;chi tiết&gt;</code>; <code>P2028</code> → <code>503 TX_TIMEOUT</code>; còn lại → <code>500 INTERNAL</code> và chi tiết KHÔNG được xuất hiện trong kết quả.</p>",
          ),
          expectedOutput: "INPUT:\nP2002 slug\nP2025 note\nP2000 title\nP2028 tx\nP1001 postgres://prod:sieu-mat@db:5432/app\nOUTPUT:\n409 DUPLICATE slug already exists\n404 NOT_FOUND\n422 VALUE_TOO_LONG title\n503 TX_TIMEOUT\n500 INTERNAL",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nfor (const line of lines) {\n  const [code, ...rest] = line.trim().split(/\\s+/);\n  const detail = rest.join(' ');\n  switch (code) {\n    case 'P2002': console.log(`409 DUPLICATE ${detail} already exists`); break;\n    case 'P2025': console.log('404 NOT_FOUND'); break;\n    case 'P2000': console.log(`422 VALUE_TOO_LONG ${detail}`); break;\n    case 'P2028': console.log('503 TX_TIMEOUT'); break;\n    // 5xx không bao giờ dội chi tiết ra ngoài: nó lộ host, cổng, tên bảng.\n    default: console.log('500 INTERNAL');\n  }\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Count queries like the N+1 experiment does. You are given a JSON array of users and one of notes (two lines). Implement <code>loadNaive()</code> (one query for users, then one per user) and <code>loadBatched()</code> (one for users, one for all their notes with an <code>IN</code> list). Both must return the same result. Print <code>naive queries=&lt;n&gt;</code>, <code>batched queries=&lt;n&gt;</code>, <code>same=&lt;true|false&gt;</code>, comparing the two results as JSON.</p>",
            "<p><b>Câu 5.</b> Đếm số câu truy vấn đúng như thí nghiệm N+1. Bạn được cho một mảng JSON users và một mảng notes (trên hai dòng). Hãy cài <code>loadNaive()</code> (một câu lấy users, rồi mỗi user một câu) và <code>loadBatched()</code> (một câu lấy users, một câu lấy toàn bộ notes của họ bằng danh sách <code>IN</code>). Cả hai phải cho cùng kết quả. In <code>naive queries=&lt;n&gt;</code>, <code>batched queries=&lt;n&gt;</code>, <code>same=&lt;true|false&gt;</code>, so sánh hai kết quả dưới dạng JSON.</p>",
          ),
          expectedOutput: "INPUT:\n[{\"id\":1,\"name\":\"An\"},{\"id\":2,\"name\":\"Binh\"}]\n[{\"id\":10,\"authorId\":1,\"title\":\"a1\"},{\"id\":11,\"authorId\":2,\"title\":\"b1\"},{\"id\":12,\"authorId\":1,\"title\":\"a2\"}]\nOUTPUT:\nnaive queries=3\nbatched queries=2\nsame=true",
          sampleSolution: "const [uLine, nLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst USERS = JSON.parse(uLine);\nconst NOTES = JSON.parse(nLine);\nlet queries = 0;\nconst db = {\n  users() { queries++; return USERS; },\n  notesByAuthor(id) { queries++; return NOTES.filter((n) => n.authorId === id); },\n  notesByAuthors(ids) { queries++; return NOTES.filter((n) => ids.includes(n.authorId)); },\n};\nfunction loadNaive() {\n  const users = db.users();\n  return users.map((u) => ({ ...u, notes: db.notesByAuthor(u.id).map((n) => n.title) }));\n}\nfunction loadBatched() {\n  const users = db.users();\n  const notes = db.notesByAuthors(users.map((u) => u.id));\n  const byAuthor = new Map(users.map((u) => [u.id, []]));\n  for (const n of notes) byAuthor.get(n.authorId).push(n.title);\n  return users.map((u) => ({ ...u, notes: byAuthor.get(u.id) }));\n}\nqueries = 0; const a = loadNaive(); const qa = queries;\nqueries = 0; const b = loadBatched(); const qb = queries;\nconsole.log(`naive queries=${qa}`);\nconsole.log(`batched queries=${qb}`);\nconsole.log(`same=${JSON.stringify(a) === JSON.stringify(b)}`);\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-05',
      source: 'SAMPLE',
      sortOrder: 14,
      title: B("Practical Exam 05 — passwords, tokens and permissions", "Thi thực hành 05 — mật khẩu, token và phân quyền"),
      description: B("Chapter 8 with node:crypto only: constant-time answers, signed tokens, rotation and the ownership rule.", "Chương 8 chỉ với node:crypto: trả lời trong thời gian không đổi, token có chữ ký, xoay vòng và quy tắc sở hữu."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Read one password per line and print <code>&lt;password&gt; OK</code> or <code>&lt;password&gt; REJECT &lt;reason&gt;</code>. Rules in this order: shorter than 12 CHARACTERS → <code>too-short</code>; longer than 72 BYTES → <code>too-long-for-bcrypt</code> (remember accented Vietnamese letters cost 2 bytes); appears in the breached list <code>123456789012, matkhau12345, Password1234</code> → <code>breached</code>.</p>",
            "<p><b>Câu 1.</b> Mỗi dòng đọc một mật khẩu và in <code>&lt;mật khẩu&gt; OK</code> hoặc <code>&lt;mật khẩu&gt; REJECT &lt;lý do&gt;</code>. Luật theo đúng thứ tự: ngắn hơn 12 KÝ TỰ → <code>too-short</code>; dài hơn 72 BYTE → <code>too-long-for-bcrypt</code> (nhớ rằng chữ tiếng Việt có dấu tốn 2 byte); nằm trong danh sách đã rò rỉ <code>123456789012, matkhau12345, Password1234</code> → <code>breached</code>.</p>",
          ),
          expectedOutput: "INPUT:\nngan\n123456789012\nmot-cau-mat-khau-du-dai\nmật_khẩu_rất_dài_bằng_tiếng_Việt_có_dấu_đầy_đủ_và_còn_dài_hơn_nữa_nhé\nOUTPUT:\nngan REJECT too-short\n123456789012 REJECT breached\nmot-cau-mat-khau-du-dai OK\nmật_khẩu_rất_dài_bằng_tiếng_Việt_có_dấu_đầy_đủ_và_còn_dài_hơn_nữa_nhé REJECT too-long-for-bcrypt",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst BREACHED = new Set(['123456789012', 'matkhau12345', 'Password1234']);\nfor (const pw of lines) {\n  let reason = null;\n  if (pw.length < 12) reason = 'too-short';\n  else if (Buffer.byteLength(pw, 'utf8') > 72) reason = 'too-long-for-bcrypt';\n  else if (BREACHED.has(pw)) reason = 'breached';\n  console.log(reason ? `${pw} REJECT ${reason}` : `${pw} OK`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Compare secrets safely. Read pairs <code>&lt;a&gt; &lt;b&gt;</code>, one per line, and print <code>&lt;a&gt; &lt;b&gt; &lt;true|false&gt;</code> using <code>crypto.timingSafeEqual</code>. Guard the length yourself — <code>timingSafeEqual</code> THROWS on buffers of different lengths, and an uncaught throw here is a 500 on your login route.</p>",
            "<p><b>Câu 2.</b> So sánh bí mật một cách an toàn. Đọc từng cặp <code>&lt;a&gt; &lt;b&gt;</code> trên mỗi dòng và in <code>&lt;a&gt; &lt;b&gt; &lt;true|false&gt;</code> bằng <code>crypto.timingSafeEqual</code>. Tự kiểm độ dài trước — <code>timingSafeEqual</code> NÉM LỖI khi hai buffer khác độ dài, và một lỗi không bắt ở đây là một mã 500 trên route đăng nhập.</p>",
          ),
          expectedOutput: "INPUT:\nabc abc\nabc abcd\nkhoa-that khoa-that\nkhoa-that khoa-thax\nOUTPUT:\nabc abc true\nabc abcd false\nkhoa-that khoa-that true\nkhoa-that khoa-thax false",
          sampleSolution: "const crypto = require('node:crypto');\nconst lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst safeEqual = (a, b) => {\n  const x = Buffer.from(a), y = Buffer.from(b);\n  return x.length === y.length && crypto.timingSafeEqual(x, y);\n};\nfor (const line of lines) {\n  const [a, b] = line.trim().split(/\\s+/);\n  console.log(a, b, safeEqual(a, b));\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Implement the ownership rule as ONE function <code>canTouch(note, actor)</code>: the owner may touch it, an ADMIN may touch anything, everyone else may not. Read a JSON array of notes on line 1, then requests <code>&lt;actorId&gt; &lt;role&gt; &lt;action&gt; &lt;noteId&gt;</code>. Print <code>200</code> when allowed and <code>404</code> when not (never 403 — a 403 confirms the note exists), and <code>404</code> for an id that does not exist at all.</p>",
            "<p><b>Câu 3.</b> Cài quy tắc sở hữu thành MỘT hàm <code>canTouch(note, actor)</code>: chủ sở hữu được đụng, ADMIN được đụng mọi thứ, còn lại thì không. Dòng 1 đọc mảng JSON các ghi chú, rồi tới các request <code>&lt;idNgườiGọi&gt; &lt;vaiTrò&gt; &lt;hànhĐộng&gt; &lt;idGhiChú&gt;</code>. In <code>200</code> khi được phép và <code>404</code> khi không (tuyệt đối không 403 — vì 403 xác nhận ghi chú đó tồn tại), và cũng in <code>404</code> với id hoàn toàn không tồn tại.</p>",
          ),
          expectedOutput: "INPUT:\n[{\"id\":1,\"authorId\":1},{\"id\":2,\"authorId\":2}]\n1 USER read 1\n2 USER read 1\n2 USER delete 1\n9 ADMIN read 1\n1 USER read 99\nOUTPUT:\n200\n404\n404\n200\n404",
          sampleSolution: "const raw = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst notes = JSON.parse(raw[0]);\nconst byId = new Map(notes.map((n) => [n.id, n]));\nconst canTouch = (note, actor) => note.authorId === actor.id || actor.role === 'ADMIN';\nfor (const line of raw.slice(1)) {\n  const [actorId, role, , noteId] = line.trim().split(/\\s+/);\n  const note = byId.get(Number(noteId));\n  const actor = { id: Number(actorId), role };\n  console.log(note && canTouch(note, actor) ? '200' : '404');\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Sign and verify an access token with HMAC-SHA256 (<code>node:crypto</code>, base64url, three dot-separated parts, header <code>{\"alg\":\"HS256\"}</code> and payload <code>{ sub, role, exp }</code>). Read the shared secret on line 1, the \"current time\" as a unix second on line 2, then one task per line: <code>sign &lt;sub&gt; &lt;role&gt; &lt;ttlSeconds&gt;</code> prints the token, and <code>verify &lt;token&gt;</code> prints <code>ok &lt;sub&gt; &lt;role&gt;</code> or <code>fail &lt;MALFORMED|BAD_ALG|BAD_SIGNATURE|EXPIRED&gt;</code> — checked in that order, with the algorithm decided by the SERVER (only <code>HS256</code>), never read from the token.</p>",
            "<p><b>Câu 4.</b> Ký và kiểm một access token bằng HMAC-SHA256 (<code>node:crypto</code>, base64url, ba phần cách nhau bởi dấu chấm, header <code>{\"alg\":\"HS256\"}</code> và payload <code>{ sub, role, exp }</code>). Dòng 1 đọc khoá bí mật dùng chung, dòng 2 đọc \"thời điểm hiện tại\" tính bằng giây unix, rồi mỗi dòng một việc: <code>sign &lt;sub&gt; &lt;vaiTrò&gt; &lt;ttlGiây&gt;</code> thì in ra token, còn <code>verify &lt;token&gt;</code> thì in <code>ok &lt;sub&gt; &lt;vaiTrò&gt;</code> hoặc <code>fail &lt;MALFORMED|BAD_ALG|BAD_SIGNATURE|EXPIRED&gt;</code> — kiểm theo đúng thứ tự đó, với thuật toán do MÁY CHỦ quyết (chỉ chấp nhận <code>HS256</code>), không bao giờ đọc từ token.</p>",
          ),
          expectedOutput: "INPUT:\nkhoa-bi-mat\n1785000000\nsign 7 USER 900\nverify khong-phai-token\nverify eyJhbGciOiJub25lIn0.eyJzdWIiOiI3Iiwicm9sZSI6IkFETUlOIn0.\nOUTPUT:\neyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3Iiwicm9sZSI6IlVTRVIiLCJleHAiOjE3ODUwMDA5MDB9.kEJJBx-V2u5anm9ruocVtHyuKYwL9GJIWprwJF9lyP8\nfail MALFORMED\nfail BAD_ALG",
          sampleSolution: "const crypto = require('node:crypto');\nconst lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst SECRET = lines[0].trim();\nconst NOW = Number(lines[1].trim());\nconst b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');\nconst mac = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');\nfunction sign(sub, role, ttl) {\n  const data = b64({ alg: 'HS256' }) + '.' + b64({ sub, role, exp: NOW + ttl });\n  return data + '.' + mac(data);\n}\nfunction verify(token) {\n  const parts = String(token).split('.');\n  if (parts.length !== 3) return 'fail MALFORMED';\n  const [h, p, s] = parts;\n  let header, payload;\n  try { header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8')); }\n  catch { return 'fail MALFORMED'; }\n  // Thuật toán do máy chủ chốt — token không có quyền bỏ phiếu.\n  if (header.alg !== 'HS256') return 'fail BAD_ALG';\n  const expected = mac(h + '.' + p);\n  const a = Buffer.from(s), b = Buffer.from(expected);\n  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'fail BAD_SIGNATURE';\n  try { payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); }\n  catch { return 'fail MALFORMED'; }\n  if (typeof payload.exp !== 'number' || payload.exp <= NOW) return 'fail EXPIRED';\n  return `ok ${payload.sub} ${payload.role}`;\n}\nfor (const line of lines.slice(2)) {\n  const [cmd, ...rest] = line.trim().split(/\\s+/);\n  if (cmd === 'sign') console.log(sign(rest[0], rest[1], Number(rest[2])));\n  else console.log(verify(rest[0]));\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Refresh-token rotation with reuse detection. Every login starts a FAMILY; redeeming a refresh token marks it used and issues a new one in the same family. Read commands: <code>login &lt;user&gt;</code> prints <code>&lt;user&gt; token=&lt;t&gt; family=&lt;f&gt;</code> (tokens are <code>t1, t2, …</code> and families <code>f1, f2, …</code> in creation order); <code>refresh &lt;token&gt;</code> prints either the new token line or <code>401 REFRESH_REUSE_DETECTED revoked=&lt;n&gt;</code> when the token was already used or revoked — and revoking must kill the WHOLE family. End with <code>alive=&lt;still-valid tokens, comma separated&gt;</code>.</p>",
            "<p><b>Câu 5.</b> Xoay vòng refresh token kèm phát hiện tái sử dụng. Mỗi lần đăng nhập mở một HỌ; đổi một refresh token thì đánh dấu nó đã dùng và cấp token mới trong cùng họ. Đọc các lệnh: <code>login &lt;người dùng&gt;</code> in ra <code>&lt;người dùng&gt; token=&lt;t&gt; family=&lt;f&gt;</code> (token đánh số <code>t1, t2, …</code> và họ đánh số <code>f1, f2, …</code> theo thứ tự tạo); <code>refresh &lt;token&gt;</code> thì in dòng token mới, hoặc in <code>401 REFRESH_REUSE_DETECTED revoked=&lt;n&gt;</code> khi token đó đã dùng hoặc đã bị thu hồi — và thu hồi thì phải giết CẢ HỌ. Kết thúc bằng dòng <code>alive=&lt;các token còn hiệu lực, cách nhau bởi dấu phẩy&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\nlogin an\nlogin binh\nrefresh t1\nrefresh t1\nrefresh t2\nOUTPUT:\nan token=t1 family=f1\nbinh token=t2 family=f2\nan token=t3 family=f1\n401 REFRESH_REUSE_DETECTED revoked=2\nbinh token=t4 family=f2\nalive=t4",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst sessions = new Map();   // token -> { user, family, used, revoked }\nlet t = 0, f = 0;\nfunction issue(user, family) {\n  const token = `t${++t}`;\n  sessions.set(token, { user, family, used: false, revoked: false });\n  return token;\n}\nfor (const line of lines) {\n  const [cmd, arg] = line.trim().split(/\\s+/);\n  if (cmd === 'login') {\n    const family = `f${++f}`;\n    const token = issue(arg, family);\n    console.log(`${arg} token=${token} family=${family}`);\n    continue;\n  }\n  const s = sessions.get(arg);\n  if (!s) { console.log('401 REFRESH_REUSE_DETECTED revoked=0'); continue; }\n  if (s.used || s.revoked) {\n    // Dùng lại = hai bên cùng cầm một token. Không biết ai là kẻ trộm → đốt cả họ.\n    let revoked = 0;\n    for (const row of sessions.values()) {\n      if (row.family === s.family && !row.revoked) { row.revoked = true; revoked++; }\n    }\n    console.log(`401 REFRESH_REUSE_DETECTED revoked=${revoked}`);\n    continue;\n  }\n  s.used = true;\n  const token = issue(s.user, s.family);\n  console.log(`${s.user} token=${token} family=${s.family}`);\n}\nconst alive = [...sessions.entries()].filter(([, s]) => !s.used && !s.revoked).map(([k]) => k);\nconsole.log(`alive=${alive.join(',')}`);\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-06',
      source: 'SAMPLE',
      sortOrder: 15,
      title: B("Practical Exam 06 — hostile input", "Thi thực hành 06 — đầu vào thù địch"),
      description: B("Chapter 9: escaping, allow-lists, prototype pollution, redaction and bounding the work before a regex runs.", "Chương 9: thoát ký tự, danh sách trắng, ô nhiễm nguyên mẫu, che bí mật, và chặn khối lượng việc trước khi regex chạy."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Escape untrusted text for HTML output. Read one line per input and print it with <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>\"</code> and <code>&#x27;</code> replaced by <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code>, <code>&amp;#39;</code>. Order matters: escape the ampersand FIRST or you double-escape everything else.</p>",
            "<p><b>Câu 1.</b> Thoát ký tự cho văn bản không tin cậy trước khi in ra HTML. Mỗi dòng đọc một chuỗi và in lại nó với <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>\"</code> và <code>&#x27;</code> được thay bằng <code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code>, <code>&amp;#39;</code>. Thứ tự có ý nghĩa: phải thoát dấu &amp; TRƯỚC, nếu không mọi ký tự khác sẽ bị thoát hai lần.</p>",
          ),
          expectedOutput: "INPUT:\n<script>alert(1)</script>\nTom & Jerry\nhe said \"hi\" & left\nOUTPUT:\n&lt;script&gt;alert(1)&lt;/script&gt;\nTom &amp; Jerry\nhe said &quot;hi&quot; &amp; left",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').split('\\n').filter((l) => l.length);\nconst escapeHtml = (s) => s\n  .replace(/&/g, '&amp;')\n  .replace(/</g, '&lt;')\n  .replace(/>/g, '&gt;')\n  .replace(/\"/g, '&quot;')\n  .replace(/'/g, '&#39;');\nfor (const line of lines) console.log(escapeHtml(line));\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Validate outbound URLs for a link-preview feature. The allow-list is <code>media.cuongthai.com</code> and <code>i.giphy.com</code>. Read one URL per line and print <code>OK &lt;hostname&gt;</code> or <code>REJECT &lt;reason&gt;</code>: unparseable → <code>bad-url</code>; protocol not <code>https:</code> → <code>protocol</code>; host not on the list → <code>host</code>. Parse with <code>new URL()</code> — a regex loses to <code>http://127.1</code>.</p>",
            "<p><b>Câu 2.</b> Kiểm URL đi ra ngoài cho tính năng xem trước liên kết. Danh sách trắng gồm <code>media.cuongthai.com</code> và <code>i.giphy.com</code>. Mỗi dòng đọc một URL và in <code>OK &lt;tên miền&gt;</code> hoặc <code>REJECT &lt;lý do&gt;</code>: không phân tích được → <code>bad-url</code>; giao thức không phải <code>https:</code> → <code>protocol</code>; tên miền không nằm trong danh sách → <code>host</code>. Hãy phân tích bằng <code>new URL()</code> — regex sẽ thua trước <code>http://127.1</code>.</p>",
          ),
          expectedOutput: "INPUT:\nhttps://media.cuongthai.com/a.png\nhttp://127.0.0.1:4404/admin/config\nhttp://127.1/\nfile:///etc/hostname\nkhong-phai-url\nhttps://evil.example/x\nOUTPUT:\nOK media.cuongthai.com\nREJECT protocol\nREJECT protocol\nREJECT protocol\nREJECT bad-url\nREJECT host",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst ALLOW = new Set(['media.cuongthai.com', 'i.giphy.com']);\nfor (const line of lines) {\n  let u;\n  try { u = new URL(line.trim()); } catch { console.log('REJECT bad-url'); continue; }\n  if (u.protocol !== 'https:') { console.log('REJECT protocol'); continue; }\n  if (!ALLOW.has(u.hostname)) { console.log('REJECT host'); continue; }\n  console.log(`OK ${u.hostname}`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Write a deep merge that cannot be used to pollute the prototype. Read a base object and a patch object as JSON on two lines, merge the patch into a copy of the base recursively, and SKIP any key named <code>__proto__</code>, <code>constructor</code> or <code>prototype</code>. Print the merged object as JSON, then <code>polluted=&lt;true|false&gt;</code> where the check is <code>({}).isAdmin !== undefined</code>.</p>",
            "<p><b>Câu 3.</b> Viết một hàm trộn sâu không thể bị lợi dụng để làm ô nhiễm nguyên mẫu. Đọc object gốc và object vá dưới dạng JSON trên hai dòng, trộn bản vá vào một bản sao của object gốc theo kiểu đệ quy, và BỎ QUA mọi khoá tên <code>__proto__</code>, <code>constructor</code> hoặc <code>prototype</code>. In object đã trộn dưới dạng JSON, rồi in <code>polluted=&lt;true|false&gt;</code> với phép kiểm là <code>({}).isAdmin !== undefined</code>.</p>",
          ),
          expectedOutput: "INPUT:\n{\"name\":\"An\",\"prefs\":{\"theme\":\"dark\"}}\n{\"prefs\":{\"lang\":\"vi\"},\"__proto__\":{\"isAdmin\":true}}\nOUTPUT:\n{\"name\":\"An\",\"prefs\":{\"theme\":\"dark\",\"lang\":\"vi\"}}\npolluted=false",
          sampleSolution: "const [baseLine, patchLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst DANGEROUS = new Set(['__proto__', 'constructor', 'prototype']);\nfunction safeMerge(target, src) {\n  for (const key of Object.keys(src)) {\n    if (DANGEROUS.has(key)) continue;\n    const v = src[key];\n    if (v && typeof v === 'object' && !Array.isArray(v)) {\n      const base = target[key] && typeof target[key] === 'object' ? { ...target[key] } : {};\n      target[key] = safeMerge(base, v);\n    } else target[key] = v;\n  }\n  return target;\n}\nconst merged = safeMerge(structuredClone(JSON.parse(baseLine)), JSON.parse(patchLine));\nconsole.log(JSON.stringify(merged));\nconsole.log(`polluted=${({}).isAdmin !== undefined}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Redact before logging. Read one JSON log record per line and print it back with every value under a key named <code>password</code>, <code>token</code>, <code>authorization</code>, <code>cookie</code> or <code>secret</code> (case-insensitive, at ANY depth, inside arrays too) replaced by <code>[REDACTED]</code>. Also strip a <code>token=</code> or <code>code=</code> query parameter inside any string field named <code>url</code>, leaving <code>token=[REDACTED]</code>.</p>",
            "<p><b>Câu 4.</b> Che bí mật trước khi ghi log. Mỗi dòng đọc một bản ghi log JSON và in lại nó với mọi giá trị nằm dưới khoá tên <code>password</code>, <code>token</code>, <code>authorization</code>, <code>cookie</code> hoặc <code>secret</code> (không phân biệt hoa thường, ở MỌI độ sâu, kể cả trong mảng) được thay bằng <code>[REDACTED]</code>. Ngoài ra, với trường chuỗi tên <code>url</code> thì cắt tham số truy vấn <code>token=</code> hoặc <code>code=</code>, thay bằng <code>token=[REDACTED]</code>.</p>",
          ),
          expectedOutput: "INPUT:\n{\"msg\":\"login\",\"body\":{\"email\":\"a@b.com\",\"password\":\"MatKhauThat\"}}\n{\"headers\":{\"authorization\":\"Bearer eyJ\",\"accept\":\"*/*\"},\"url\":\"/sse?token=abc123&x=1\"}\n{\"items\":[{\"secret\":\"s1\"},{\"ok\":true}]}\nOUTPUT:\n{\"msg\":\"login\",\"body\":{\"email\":\"a@b.com\",\"password\":\"[REDACTED]\"}}\n{\"headers\":{\"authorization\":\"[REDACTED]\",\"accept\":\"*/*\"},\"url\":\"/sse?token=[REDACTED]&x=1\"}\n{\"items\":[{\"secret\":\"[REDACTED]\"},{\"ok\":true}]}",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst SECRET_KEYS = new Set(['password', 'token', 'authorization', 'cookie', 'secret']);\nfunction redact(value, key) {\n  if (key && SECRET_KEYS.has(key.toLowerCase())) return '[REDACTED]';\n  if (Array.isArray(value)) return value.map((v) => redact(v));\n  if (value && typeof value === 'object') {\n    const out = {};\n    for (const [k, v] of Object.entries(value)) out[k] = redact(v, k);\n    return out;\n  }\n  if (typeof value === 'string' && key === 'url') {\n    return value.replace(/([?&](?:token|code)=)[^&]+/gi, '$1[REDACTED]');\n  }\n  return value;\n}\nfor (const line of lines) console.log(JSON.stringify(redact(JSON.parse(line))));\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Bound the work before the regex runs. Read a max length on line 1, then one candidate per line, and decide with the pattern <code>/^(a+)+$/</code>. Print <code>&lt;len&gt; REJECT too-long</code> when the input exceeds the cap (WITHOUT running the regex), otherwise <code>&lt;len&gt; &lt;match|no-match&gt;</code>. A correct solution finishes instantly even with a 40-character input; running the regex first does not.</p>",
            "<p><b>Câu 5.</b> Chặn khối lượng công việc TRƯỚC khi regex chạy. Dòng 1 đọc độ dài tối đa, rồi mỗi dòng một chuỗi cần xét, và dùng mẫu <code>/^(a+)+$/</code> để quyết định. In <code>&lt;độ dài&gt; REJECT too-long</code> khi đầu vào vượt ngưỡng (KHÔNG được chạy regex), còn lại thì in <code>&lt;độ dài&gt; &lt;match|no-match&gt;</code>. Lời giải đúng xong tức thì ngay cả với chuỗi 40 ký tự; chạy regex trước thì không.</p>",
          ),
          expectedOutput: "INPUT:\n20\naaaa\naaaab\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nOUTPUT:\n4 match\n5 no-match\n40 REJECT too-long",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst MAX = Number(lines[0].trim());\nconst RE = /^(a+)+$/;\nfor (const s of lines.slice(1)) {\n  // Chặn độ dài TRƯỚC: tăng trưởng hàm mũ trên đầu vào có giới hạn là chi phí có giới hạn.\n  if (s.length > MAX) { console.log(`${s.length} REJECT too-long`); continue; }\n  console.log(`${s.length} ${RE.test(s) ? 'match' : 'no-match'}`);\n}\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-07',
      source: 'SAMPLE',
      sortOrder: 16,
      title: B("Practical Exam 07 — uploads and object storage", "Thi thực hành 07 — upload và object storage"),
      description: B("Chapter 10: sniff the bytes, build the key, re-check what the signature never bound, and find the orphans.", "Chương 10: đánh hơi byte thật, dựng key, kiểm lại những gì chữ ký không ràng buộc, và tìm ra các object mồ côi."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Sniff the real type from magic bytes. Read one hex string per line (the first bytes of a file) and print <code>image/jpeg</code> (starts <code>ffd8ff</code>), <code>image/png</code> (<code>89504e47</code>), <code>image/gif</code> (<code>474946383</code>), <code>application/pdf</code> (<code>25504446</code>) or <code>unknown</code>. The client's declared MIME is not an input here — that is the point.</p>",
            "<p><b>Câu 1.</b> Đánh hơi kiểu thật từ magic bytes. Mỗi dòng đọc một chuỗi hex (những byte đầu của một file) và in <code>image/jpeg</code> (bắt đầu bằng <code>ffd8ff</code>), <code>image/png</code> (<code>89504e47</code>), <code>image/gif</code> (<code>474946383</code>), <code>application/pdf</code> (<code>25504446</code>) hoặc <code>unknown</code>. Kiểu MIME do client khai KHÔNG phải đầu vào ở đây — và đó chính là điểm mấu chốt.</p>",
          ),
          expectedOutput: "INPUT:\nffd8ffdb004300030202020202030202\n89504e470d0a1a0a0000000d49484452\n4749463839612f2a2a2f3d313b3c7363\n3c3f7068702073797374656d28245f47\n255044462d312e340a25c7ec8fa2\nOUTPUT:\nimage/jpeg\nimage/png\nimage/gif\nunknown\napplication/pdf",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst SIGNATURES = [\n  ['ffd8ff', 'image/jpeg'],\n  ['89504e47', 'image/png'],\n  ['474946383', 'image/gif'],\n  ['25504446', 'application/pdf'],\n];\nfor (const line of lines) {\n  const hex = line.trim().toLowerCase();\n  const hit = SIGNATURES.find(([sig]) => hex.startsWith(sig));\n  console.log(hit ? hit[1] : 'unknown');\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Build storage keys the way the course does: <code>&lt;family&gt;/&lt;kind&gt;/u&lt;userId&gt;/&lt;timestamp&gt;-&lt;random&gt;&lt;ext&gt;</code>. Read <code>&lt;family&gt; &lt;kind&gt; &lt;userId&gt; &lt;timestamp&gt; &lt;originalName&gt;</code> per line. Take only the LAST extension from the original name, lowercase it, and never keep the rest of the name. Print the key with the random part written literally as <code>&lt;rand&gt;</code> so the output is deterministic, then on the next line <code>ownedBy=&lt;userId&gt;</code> extracted back OUT of the key with a regex.</p>",
            "<p><b>Câu 2.</b> Dựng key lưu trữ đúng như giáo trình: <code>&lt;họ&gt;/&lt;loại&gt;/u&lt;idNgườiDùng&gt;/&lt;mốcThờiGian&gt;-&lt;ngẫuNhiên&gt;&lt;đuôi&gt;</code>. Mỗi dòng đọc <code>&lt;họ&gt; &lt;loại&gt; &lt;idNgườiDùng&gt; &lt;mốcThờiGian&gt; &lt;tênFileGốc&gt;</code>. Chỉ lấy phần mở rộng CUỐI CÙNG của tên gốc, đổi sang chữ thường, và tuyệt đối không giữ lại phần tên còn lại. In key với phần ngẫu nhiên ghi đúng chữ <code>&lt;rand&gt;</code> để kết quả xác định, rồi dòng kế in <code>ownedBy=&lt;idNgườiDùng&gt;</code> trích NGƯỢC ra từ chính key bằng một biểu thức chính quy.</p>",
          ),
          expectedOutput: "INPUT:\nimages post 7 1753660000000 IMG_0001.JPG\nvideo post 42 1753660001234 anh cua toi.final.MP4\ndocuments cv 3 1753660002000 shell.php.png\nOUTPUT:\nimages/post/u7/1753660000000-<rand>.jpg\nownedBy=7\nvideo/post/u42/1753660001234-<rand>.mp4\nownedBy=42\ndocuments/cv/u3/1753660002000-<rand>.png\nownedBy=3",
          sampleSolution: "const path = require('node:path');\nconst lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nfor (const line of lines) {\n  const [family, kind, userId, ts, ...nameParts] = line.trim().split(/\\s+/);\n  const ext = path.extname(nameParts.join(' ')).toLowerCase();\n  const key = `${family}/${kind}/u${userId}/${ts}-<rand>${ext}`;\n  console.log(key);\n  const owner = key.match(/\\/u(\\d+)\\//)?.[1] ?? 'unknown';\n  console.log(`ownedBy=${owner}`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Enforce the upload policy. Read <code>&lt;declaredMime&gt; &lt;filename&gt; &lt;bytes&gt; &lt;sniffedMime&gt;</code> per line and print <code>ACCEPT</code> or <code>REJECT &lt;reason&gt;</code>, checked in this order: dangerous extension (<code>.html .htm .svg .js .mjs .php .phtml .xml</code>) → <code>active-content</code>; declared MIME in <code>text/html, image/svg+xml, application/javascript</code> → <code>active-content</code>; sniffed MIME not starting with <code>image/</code> → <code>not-an-image</code>; bytes above 10485760 → <code>too-large</code>.</p>",
            "<p><b>Câu 3.</b> Áp dụng chính sách upload. Mỗi dòng đọc <code>&lt;mimeKhaiBáo&gt; &lt;tênFile&gt; &lt;sốByte&gt; &lt;mimeĐánhHơi&gt;</code> và in <code>ACCEPT</code> hoặc <code>REJECT &lt;lý do&gt;</code>, kiểm theo đúng thứ tự: đuôi nguy hiểm (<code>.html .htm .svg .js .mjs .php .phtml .xml</code>) → <code>active-content</code>; MIME khai báo nằm trong <code>text/html, image/svg+xml, application/javascript</code> → <code>active-content</code>; MIME đánh hơi không bắt đầu bằng <code>image/</code> → <code>not-an-image</code>; số byte vượt 10485760 → <code>too-large</code>.</p>",
          ),
          expectedOutput: "INPUT:\nimage/png anh.png 204800 image/png\nimage/png shell.php.png 1024 unknown\nimage/jpeg trang.html 2048 unknown\nimage/svg+xml logo.svg 900 unknown\nimage/jpeg to-qua.jpg 20971520 image/jpeg\nOUTPUT:\nACCEPT\nREJECT not-an-image\nREJECT active-content\nREJECT active-content\nREJECT too-large",
          sampleSolution: "const path = require('node:path');\nconst lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst DANGEROUS_EXT = new Set(['.html', '.htm', '.svg', '.js', '.mjs', '.php', '.phtml', '.xml']);\nconst DANGEROUS_MIME = new Set(['text/html', 'image/svg+xml', 'application/javascript']);\nconst MAX = 10485760;\nfor (const line of lines) {\n  const [declared, name, bytes, sniffed] = line.trim().split(/\\s+/);\n  const ext = path.extname(name).toLowerCase();\n  if (DANGEROUS_EXT.has(ext)) { console.log('REJECT active-content'); continue; }\n  if (DANGEROUS_MIME.has(declared)) { console.log('REJECT active-content'); continue; }\n  if (!sniffed.startsWith('image/')) { console.log('REJECT not-an-image'); continue; }\n  if (Number(bytes) > MAX) { console.log('REJECT too-large'); continue; }\n  console.log('ACCEPT');\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Finish a presigned upload safely. Line 1 is a JSON map of the objects that really exist in storage (<code>key -&gt; size</code>), the rest are completion calls <code>&lt;key&gt; &lt;declaredSize&gt;</code>. The signature bound the method and the key, never the size or the body, so re-check everything: the key must match <code>^video/[\\w./-]+$</code> and contain no <code>..</code> → else <code>400 BAD_KEY</code>; the object must exist → else <code>404 NOT_UPLOADED</code>; the REAL size must be at most 104857600 → else <code>413 TOO_LARGE delete=&lt;key&gt;</code>; otherwise <code>201 &lt;key&gt; &lt;realSize&gt;</code>.</p>",
            "<p><b>Câu 4.</b> Hoàn tất một lần upload presigned cho an toàn. Dòng 1 là map JSON các object THẬT SỰ có trong kho (<code>key -&gt; kích thước</code>), các dòng sau là lời gọi hoàn tất <code>&lt;key&gt; &lt;kíchThướcKhaiBáo&gt;</code>. Chữ ký chỉ ràng buộc phương thức và key, không ràng buộc kích thước hay nội dung, nên phải kiểm lại tất cả: key phải khớp <code>^video/[\\w./-]+$</code> và không chứa <code>..</code> → nếu không thì <code>400 BAD_KEY</code>; object phải tồn tại → nếu không thì <code>404 NOT_UPLOADED</code>; kích thước THẬT phải tối đa 104857600 → nếu không thì <code>413 TOO_LARGE delete=&lt;key&gt;</code>; còn lại thì <code>201 &lt;key&gt; &lt;kíchThướcThật&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n{\"video/post/u7/1-a.mp4\":5242880,\"video/post/u7/2-b.mp4\":209715200}\nvideo/post/u7/1-a.mp4 5242880\nvideo/post/u7/2-b.mp4 5242880\nvideo/post/u7/3-c.mp4 1024\nvideo/../etc/passwd 10\nOUTPUT:\n201 video/post/u7/1-a.mp4 5242880\n413 TOO_LARGE delete=video/post/u7/2-b.mp4\n404 NOT_UPLOADED\n400 BAD_KEY",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst storage = JSON.parse(lines[0]);\nconst MAX = 104857600;\nfor (const line of lines.slice(1)) {\n  const [key] = line.trim().split(/\\s+/);\n  if (!/^video\\/[\\w./-]+$/.test(key) || key.includes('..')) { console.log('400 BAD_KEY'); continue; }\n  if (!(key in storage)) { console.log('404 NOT_UPLOADED'); continue; }\n  const realSize = storage[key];\n  // Kích thước client khai lúc xin ký chỉ là đầu vào cho phép kiểm CỦA BẠN.\n  if (realSize > MAX) { console.log(`413 TOO_LARGE delete=${key}`); continue; }\n  console.log(`201 ${key} ${realSize}`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Find the orphans a storage bill is made of. Line 1 is a JSON array of every key in the bucket, line 2 a JSON array of the keys referenced by rows in the database, line 3 a JSON array of <code>{ key, ageHours }</code> pending uploads. Print <code>orphan &lt;key&gt;</code> for every stored key that no row references AND that is not a pending upload younger than 24 hours (in bucket order), then <code>missing &lt;key&gt;</code> for every referenced key with no object behind it, then <code>orphans=&lt;n&gt; missing=&lt;n&gt;</code>.</p>",
            "<p><b>Câu 5.</b> Tìm những object mồ côi làm nên hoá đơn lưu trữ. Dòng 1 là mảng JSON mọi key trong bucket, dòng 2 là mảng JSON các key đang được bản ghi trong cơ sở dữ liệu tham chiếu, dòng 3 là mảng JSON các <code>{ key, ageHours }</code> đang chờ hoàn tất. In <code>orphan &lt;key&gt;</code> cho mỗi key có trong kho mà không bản ghi nào tham chiếu VÀ không phải một upload đang chờ dưới 24 giờ (theo thứ tự trong bucket), rồi in <code>missing &lt;key&gt;</code> cho mỗi key được tham chiếu mà chẳng có object nào phía sau, rồi in <code>orphans=&lt;n&gt; missing=&lt;n&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n[\"images/a.png\",\"images/b.png\",\"video/c.mp4\",\"video/d.mp4\"]\n[\"images/a.png\",\"images/z.png\"]\n[{\"key\":\"video/c.mp4\",\"ageHours\":2},{\"key\":\"video/d.mp4\",\"ageHours\":48}]\nOUTPUT:\norphan images/b.png\norphan video/d.mp4\nmissing images/z.png\norphans=2 missing=1",
          sampleSolution: "const [sLine, rLine, pLine] = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst stored = JSON.parse(sLine);\nconst referenced = new Set(JSON.parse(rLine));\nconst pending = new Map(JSON.parse(pLine).map((p) => [p.key, p.ageHours]));\nlet orphans = 0, missing = 0;\nfor (const key of stored) {\n  if (referenced.has(key)) continue;\n  const age = pending.get(key);\n  if (age !== undefined && age < 24) continue;   // còn trong hạn chờ hoàn tất\n  orphans++;\n  console.log(`orphan ${key}`);\n}\nconst storedSet = new Set(stored);\nfor (const key of referenced) {\n  if (storedSet.has(key)) continue;\n  missing++;\n  console.log(`missing ${key}`);\n}\nconsole.log(`orphans=${orphans} missing=${missing}`);\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-08',
      source: 'SAMPLE',
      sortOrder: 17,
      title: B("Practical Exam 08 — realtime and shared state", "Thi thực hành 08 — realtime và trạng thái dùng chung"),
      description: B("Chapters 11 and 12: rooms and who receives what, atomic counters, rate limiting done three ways, and backpressure.", "Chương 11 và 12: phòng và ai nhận được gì, bộ đếm nguyên tử, ba cách giới hạn tần suất, và áp lực ngược."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Model Socket.IO rooms. Read commands: <code>join &lt;socket&gt; &lt;room&gt;</code>, <code>leave &lt;socket&gt; &lt;room&gt;</code>, <code>io &lt;room&gt; &lt;from&gt;</code> (broadcast to the whole room, sender INCLUDED) and <code>socket &lt;room&gt; &lt;from&gt;</code> (broadcast to the room EXCEPT the sender). For each broadcast print <code>&lt;room&gt; -&gt; &lt;receiving sockets, comma separated in join order&gt;</code>, or <code>&lt;room&gt; -&gt; (nobody)</code>.</p>",
            "<p><b>Câu 1.</b> Mô hình hoá phòng của Socket.IO. Đọc các lệnh: <code>join &lt;socket&gt; &lt;phòng&gt;</code>, <code>leave &lt;socket&gt; &lt;phòng&gt;</code>, <code>io &lt;phòng&gt; &lt;người gửi&gt;</code> (phát cho cả phòng, TÍNH CẢ người gửi) và <code>socket &lt;phòng&gt; &lt;người gửi&gt;</code> (phát cho cả phòng TRỪ người gửi). Mỗi lần phát thì in <code>&lt;phòng&gt; -&gt; &lt;các socket nhận được, cách nhau bởi dấu phẩy theo thứ tự vào phòng&gt;</code>, hoặc <code>&lt;phòng&gt; -&gt; (nobody)</code>.</p>",
          ),
          expectedOutput: "INPUT:\njoin s1 thread:42\njoin s2 thread:42\njoin s3 thread:99\nio thread:42 s1\nsocket thread:42 s1\nleave s2 thread:42\nsocket thread:42 s1\nOUTPUT:\nthread:42 -> s1,s2\nthread:42 -> s2\nthread:42 -> (nobody)",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst rooms = new Map();   // room -> array of socket ids (giữ thứ tự vào phòng)\nfor (const line of lines) {\n  const [cmd, a, b] = line.trim().split(/\\s+/);\n  if (cmd === 'join') {\n    if (!rooms.has(b)) rooms.set(b, []);\n    if (!rooms.get(b).includes(a)) rooms.get(b).push(a);\n    continue;\n  }\n  if (cmd === 'leave') {\n    rooms.set(b, (rooms.get(b) ?? []).filter((s) => s !== a));\n    continue;\n  }\n  const members = rooms.get(a) ?? [];\n  const targets = cmd === 'io' ? members : members.filter((s) => s !== b);\n  console.log(`${a} -> ${targets.length ? targets.join(',') : '(nobody)'}`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Bound the send queue. Read a limit in bytes on line 1, then lines <code>&lt;socket&gt; &lt;messageBytes&gt; &lt;drainedBytes&gt;</code> meaning: this socket is asked to send that many bytes, and the client has acknowledged <code>drainedBytes</code> since the last line. Track <code>bufferedAmount</code> per socket: if it would exceed the limit BEFORE the write, drop the message. Print <code>&lt;socket&gt; &lt;sent|dropped&gt; buffered=&lt;bytes&gt;</code>, and a final line <code>dropped=&lt;n&gt;</code>.</p>",
            "<p><b>Câu 2.</b> Chặn hàng đợi gửi. Dòng 1 đọc giới hạn tính bằng byte, rồi các dòng <code>&lt;socket&gt; &lt;sốByteTinNhắn&gt; &lt;sốByteĐãThoát&gt;</code> nghĩa là: socket này được yêu cầu gửi từng ấy byte, và client đã nhận xong <code>sốByteĐãThoát</code> kể từ dòng trước. Hãy theo dõi <code>bufferedAmount</code> của từng socket: nếu TRƯỚC khi ghi mà nó đã vượt giới hạn thì bỏ tin. In <code>&lt;socket&gt; &lt;sent|dropped&gt; buffered=&lt;byte&gt;</code>, và dòng cuối <code>dropped=&lt;n&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n1000\ns1 400 0\ns1 400 0\ns1 400 0\ns1 300 900\ns2 100 0\nOUTPUT:\ns1 sent buffered=400\ns1 sent buffered=800\ns1 sent buffered=1200\ns1 sent buffered=600\ns2 sent buffered=100\ndropped=0",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst LIMIT = Number(lines[0].trim());\nconst buffered = new Map();\nlet dropped = 0;\nfor (const line of lines.slice(1)) {\n  const [socket, sizeStr, drainedStr] = line.trim().split(/\\s+/);\n  const size = Number(sizeStr), drained = Number(drainedStr);\n  let buf = buffered.get(socket) ?? 0;\n  buf = Math.max(0, buf - drained);\n  // Nhìn TRƯỚC khi ghi: send() không bao giờ báo lỗi, nó chỉ phình bộ nhớ.\n  if (buf > LIMIT) {\n    dropped++;\n    buffered.set(socket, buf);\n    console.log(`${socket} dropped buffered=${buf}`);\n    continue;\n  }\n  buf += size;\n  buffered.set(socket, buf);\n  console.log(`${socket} sent buffered=${buf}`);\n}\nconsole.log(`dropped=${dropped}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Fixed-window rate limiting, and the hole at the boundary. Read <code>&lt;limit&gt; &lt;windowMs&gt;</code> on line 1, then requests <code>&lt;key&gt; &lt;timestampMs&gt;</code>. Bucket by <code>Math.floor(ts / windowMs)</code> and print <code>&lt;key&gt; &lt;200|429&gt; remaining=&lt;n&gt;</code>. Finish with <code>boundary=&lt;the largest number of requests any key got through in ANY windowMs-long span&gt;</code> — on the sample it exceeds the configured limit, which is the whole point of the algorithm.</p>",
            "<p><b>Câu 3.</b> Giới hạn tần suất bằng cửa sổ cố định, và cái lỗ ở ranh giới. Dòng 1 đọc <code>&lt;giớiHạn&gt; &lt;độDàiCửaSổMs&gt;</code>, rồi tới các request <code>&lt;khoá&gt; &lt;mốcThờiGianMs&gt;</code>. Chia ô theo <code>Math.floor(ts / windowMs)</code> và in <code>&lt;khoá&gt; &lt;200|429&gt; remaining=&lt;n&gt;</code>. Kết thúc bằng <code>boundary=&lt;số request nhiều nhất mà một khoá lọt qua được trong BẤT KỲ khoảng nào dài đúng windowMs&gt;</code> — với dữ liệu mẫu, con số đó vượt giới hạn đã đặt, và đó chính là điểm yếu của thuật toán này.</p>",
          ),
          expectedOutput: "INPUT:\n3 1000\nbob 800\nbob 850\nbob 900\nbob 950\nbob 1010\nbob 1050\nbob 1100\nOUTPUT:\nbob 200 remaining=2\nbob 200 remaining=1\nbob 200 remaining=0\nbob 429 remaining=0\nbob 200 remaining=2\nbob 200 remaining=1\nbob 200 remaining=0\nboundary=6",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst [limit, windowMs] = lines[0].trim().split(/\\s+/).map(Number);\nconst counters = new Map();\nconst allowed = [];\nfor (const line of lines.slice(1)) {\n  const [key, tsStr] = line.trim().split(/\\s+/);\n  const ts = Number(tsStr);\n  const bucket = `${key}:${Math.floor(ts / windowMs)}`;\n  const used = counters.get(bucket) ?? 0;\n  if (used >= limit) {\n    console.log(`${key} 429 remaining=0`);\n    continue;\n  }\n  counters.set(bucket, used + 1);\n  allowed.push({ key, ts });\n  console.log(`${key} 200 remaining=${limit - used - 1}`);\n}\nlet worst = 0;\nfor (const a of allowed) {\n  const inSpan = allowed.filter((b) => b.key === a.key && b.ts >= a.ts && b.ts < a.ts + windowMs).length;\n  if (inSpan > worst) worst = inSpan;\n}\nconsole.log(`boundary=${worst}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Token bucket — the limiter that allows a burst. Read <code>&lt;capacity&gt; &lt;refillPerSecond&gt;</code> on line 1, then requests <code>&lt;key&gt; &lt;timestampMs&gt;</code>. A bucket starts full; it refills continuously at the given rate and never exceeds capacity; a request costs one token. Print <code>&lt;key&gt; &lt;200|429&gt; tokens=&lt;remaining, 2 decimals&gt;</code>. This is what you want for a public API: a page firing eight requests on load succeeds, a script hammering steadily does not.</p>",
            "<p><b>Câu 4.</b> Token bucket — bộ giới hạn cho phép bùng ngắn. Dòng 1 đọc <code>&lt;sứcChứa&gt; &lt;tokenNạpMỗiGiây&gt;</code>, rồi tới các request <code>&lt;khoá&gt; &lt;mốcThờiGianMs&gt;</code>. Bình bắt đầu ở trạng thái đầy; nó nạp liên tục theo tốc độ đã cho và không bao giờ vượt sức chứa; mỗi request tốn một token. In <code>&lt;khoá&gt; &lt;200|429&gt; tokens=&lt;còn lại, 2 chữ số thập phân&gt;</code>. Đây chính là thứ bạn cần cho một API công khai: một trang bắn tám request lúc tải thì qua được, còn một script gõ đều đều thì không.</p>",
          ),
          expectedOutput: "INPUT:\n5 5\na 0\na 0\na 0\na 0\na 0\na 0\na 600\na 600\nOUTPUT:\na 200 tokens=4.00\na 200 tokens=3.00\na 200 tokens=2.00\na 200 tokens=1.00\na 200 tokens=0.00\na 429 tokens=0.00\na 200 tokens=2.00\na 200 tokens=1.00",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst [capacity, ratePerSec] = lines[0].trim().split(/\\s+/).map(Number);\nconst buckets = new Map();   // key -> { tokens, ts }\nfor (const line of lines.slice(1)) {\n  const [key, tsStr] = line.trim().split(/\\s+/);\n  const ts = Number(tsStr);\n  const b = buckets.get(key) ?? { tokens: capacity, ts };\n  const refill = ((ts - b.ts) / 1000) * ratePerSec;\n  b.tokens = Math.min(capacity, b.tokens + refill);\n  b.ts = ts;\n  if (b.tokens >= 1) {\n    b.tokens -= 1;\n    console.log(`${key} 200 tokens=${b.tokens.toFixed(2)}`);\n  } else {\n    console.log(`${key} 429 tokens=${b.tokens.toFixed(2)}`);\n  }\n  buckets.set(key, b);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> A distributed lock done right. Read <code>&lt;now&gt; &lt;command&gt; &lt;args…&gt;</code> per line, where <code>now</code> is a millisecond clock. <code>acquire &lt;key&gt; &lt;worker&gt; &lt;ttlMs&gt;</code> succeeds only when no live lock exists (a lock whose deadline has passed is gone) — print <code>&lt;worker&gt; acquired &lt;token&gt;</code> using tokens <code>k1, k2, …</code> in order, or <code>&lt;worker&gt; blocked</code>. <code>release &lt;key&gt; &lt;token&gt;</code> must delete the lock ONLY if it still holds that exact token — print <code>released=&lt;1|0&gt;</code>. Finish with <code>holder=&lt;token|none&gt;</code>.</p>",
            "<p><b>Câu 5.</b> Khoá phân tán làm cho đúng. Mỗi dòng đọc <code>&lt;now&gt; &lt;lệnh&gt; &lt;tham số…&gt;</code>, trong đó <code>now</code> là đồng hồ tính bằng mili-giây. <code>acquire &lt;khoá&gt; &lt;worker&gt; &lt;ttlMs&gt;</code> chỉ thành công khi không còn khoá nào còn sống (khoá đã quá hạn coi như không còn) — in <code>&lt;worker&gt; acquired &lt;token&gt;</code> với token đánh số <code>k1, k2, …</code> theo thứ tự, hoặc in <code>&lt;worker&gt; blocked</code>. <code>release &lt;khoá&gt; &lt;token&gt;</code> chỉ được xoá khoá NẾU khoá đó vẫn đang mang đúng token ấy — in <code>released=&lt;1|0&gt;</code>. Kết thúc bằng <code>holder=&lt;token|none&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n0 acquire job:1 worker-1 300\n10 acquire job:1 worker-2 300\n400 acquire job:1 worker-2 300\n420 release job:1 k1\n430 release job:1 k2\n440 acquire job:1 worker-3 300\nOUTPUT:\nworker-1 acquired k1\nworker-2 blocked\nworker-2 acquired k2\nreleased=0\nreleased=1\nworker-3 acquired k3\nholder=k3",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst locks = new Map();   // key -> { token, expiresAt }\nlet n = 0;\nlet lastKey = null;\nfor (const line of lines) {\n  const [nowStr, cmd, key, arg, ttlStr] = line.trim().split(/\\s+/);\n  const now = Number(nowStr);\n  lastKey = key;\n  const cur = locks.get(key);\n  const alive = cur && cur.expiresAt > now;\n  if (cmd === 'acquire') {\n    if (alive) { console.log(`${arg} blocked`); continue; }\n    const token = `k${++n}`;\n    locks.set(key, { token, expiresAt: now + Number(ttlStr) });\n    console.log(`${arg} acquired ${token}`);\n    continue;\n  }\n  // So khớp token RỒI mới xoá, trong cùng một bước — đúng như script Lua.\n  if (alive && cur.token === arg) {\n    locks.delete(key);\n    console.log('released=1');\n  } else {\n    console.log('released=0');\n  }\n}\nconst final = locks.get(lastKey);\nconsole.log(`holder=${final ? final.token : 'none'}`);\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-09',
      source: 'SAMPLE',
      sortOrder: 18,
      title: B("Practical Exam 09 — background jobs that survive failure", "Thi thực hành 09 — tác vụ nền sống sót qua sự cố"),
      description: B("Chapter 13: enqueue instead of doing, retry with backoff, stay idempotent, schedule, and recover a stalled job.", "Chương 13: đẩy vào hàng đợi thay vì làm ngay, thử lại có backoff, giữ tính idempotent, hẹn lịch, và cứu một job bị treo."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> A worker with a concurrency limit. Read <code>&lt;concurrency&gt;</code> on line 1, then jobs <code>&lt;id&gt; &lt;durationMs&gt;</code>. Simulate the clock: at any moment at most <code>concurrency</code> jobs run, and the next job starts the instant a slot frees. Print <code>&lt;id&gt; start=&lt;ms&gt; end=&lt;ms&gt;</code> in start order, then <code>total=&lt;ms&gt;</code>.</p>",
            "<p><b>Câu 1.</b> Một worker có giới hạn đồng thời. Dòng 1 đọc <code>&lt;concurrency&gt;</code>, rồi tới các job <code>&lt;id&gt; &lt;thờiGianMs&gt;</code>. Hãy mô phỏng đồng hồ: tại mọi thời điểm chỉ có tối đa <code>concurrency</code> job chạy, và job kế tiếp bắt đầu ngay khi có chỗ trống. In <code>&lt;id&gt; start=&lt;ms&gt; end=&lt;ms&gt;</code> theo thứ tự bắt đầu, rồi in <code>total=&lt;ms&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n2\na 100\nb 50\nc 30\nd 40\nOUTPUT:\na start=0 end=100\nb start=0 end=50\nc start=50 end=80\nd start=80 end=120\ntotal=120",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst concurrency = Number(lines[0].trim());\nconst jobs = lines.slice(1).map((l) => { const [id, ms] = l.trim().split(/\\s+/); return { id, ms: Number(ms) }; });\nconst slots = new Array(concurrency).fill(0);\nlet total = 0;\nfor (const job of jobs) {\n  const i = slots.indexOf(Math.min(...slots));\n  const start = slots[i];\n  const end = start + job.ms;\n  slots[i] = end;\n  total = Math.max(total, end);\n  console.log(`${job.id} start=${start} end=${end}`);\n}\nconsole.log(`total=${total}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Compute the retry schedule before writing any retry code. Read <code>&lt;attempts&gt; &lt;baseDelayMs&gt; &lt;fixed|exponential&gt;</code> per line and print the delays between attempts, comma separated, then the total wait: <code>&lt;delays&gt; total=&lt;ms&gt;</code>. There are <code>attempts - 1</code> delays — nobody waits after the last attempt. Exponential means <code>base * 2 ** (k - 1)</code> for the k-th delay.</p>",
            "<p><b>Câu 2.</b> Tính lịch thử lại trước khi viết bất kỳ dòng mã thử lại nào. Mỗi dòng đọc <code>&lt;sốLầnThử&gt; &lt;baseDelayMs&gt; &lt;fixed|exponential&gt;</code> và in các khoảng chờ giữa những lần thử, cách nhau bởi dấu phẩy, rồi in tổng thời gian chờ: <code>&lt;các khoảng chờ&gt; total=&lt;ms&gt;</code>. Có đúng <code>attempts - 1</code> khoảng chờ — không ai chờ sau lần thử cuối. Kiểu exponential nghĩa là khoảng chờ thứ k bằng <code>base * 2 ** (k - 1)</code>.</p>",
          ),
          expectedOutput: "INPUT:\n5 200 exponential\n4 300 fixed\n1 500 exponential\nOUTPUT:\n200,400,800,1600 total=3000\n300,300,300 total=900\n(none) total=0",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nfor (const line of lines) {\n  const [attemptsStr, baseStr, kind] = line.trim().split(/\\s+/);\n  const attempts = Number(attemptsStr), base = Number(baseStr);\n  const delays = [];\n  for (let k = 1; k <= attempts - 1; k++) {\n    delays.push(kind === 'exponential' ? base * 2 ** (k - 1) : base);\n  }\n  const total = delays.reduce((a, b) => a + b, 0);\n  console.log(`${delays.join(',') || '(none)'} total=${total}`);\n}\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Deduplicate at the door AND in the handler. Read <code>&lt;jobId&gt; &lt;orderId&gt; &lt;amount&gt;</code> per line. Adding a job whose <code>jobId</code> is already waiting must not create a second one (print <code>dedup &lt;jobId&gt;</code>). Then process the queue in order: a handler that has already charged that <code>orderId</code> prints <code>skip &lt;orderId&gt;</code>, otherwise <code>charge &lt;orderId&gt; &lt;amount&gt;</code>. Finish with <code>total=&lt;sum actually charged&gt;</code>.</p>",
            "<p><b>Câu 3.</b> Khử trùng ngay ở cửa VÀ trong handler. Mỗi dòng đọc <code>&lt;jobId&gt; &lt;orderId&gt; &lt;sốTiền&gt;</code>. Thêm một job có <code>jobId</code> đang chờ sẵn thì không được tạo thêm cái thứ hai (in <code>dedup &lt;jobId&gt;</code>). Sau đó xử lý hàng đợi theo thứ tự: handler nào đã trừ tiền cho <code>orderId</code> đó rồi thì in <code>skip &lt;orderId&gt;</code>, ngược lại in <code>charge &lt;orderId&gt; &lt;sốTiền&gt;</code>. Kết thúc bằng <code>total=&lt;tổng đã thật sự trừ&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\ninvoice-777 777 100000\ninvoice-777 777 100000\ninvoice-778 778 250000\ninvoice-779 777 100000\nOUTPUT:\ndedup invoice-777\ncharge 777 100000\ncharge 778 250000\nskip 777\ntotal=350000",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst waiting = new Map();   // jobId -> job\nconst queue = [];\nfor (const line of lines) {\n  const [jobId, orderId, amount] = line.trim().split(/\\s+/);\n  if (waiting.has(jobId)) { console.log(`dedup ${jobId}`); continue; }\n  const job = { jobId, orderId, amount: Number(amount) };\n  waiting.set(jobId, job);\n  queue.push(job);\n}\nconst charged = new Set();\nlet total = 0;\nfor (const job of queue) {\n  // jobId chỉ chặn trùng ở CỬA; handler vẫn phải tự idempotent.\n  if (charged.has(job.orderId)) { console.log(`skip ${job.orderId}`); continue; }\n  charged.add(job.orderId);\n  total += job.amount;\n  console.log(`charge ${job.orderId} ${job.amount}`);\n}\nconsole.log(`total=${total}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Rescue stalled jobs. Read <code>&lt;lockDurationMs&gt;</code> on line 1, then events <code>&lt;time&gt; &lt;start|renew|finish|check&gt; &lt;jobId&gt;</code>. A <code>start</code> takes a lock expiring at <code>time + lockDuration</code>; <code>renew</code> extends it from the current time; <code>finish</code> completes the job. A <code>check</code> lists every job whose lock has expired without finishing: print <code>stalled &lt;jobId&gt;</code> for each (in start order) and requeue it — its next <code>start</code> is a second run. End with <code>completed=&lt;n&gt; stalled=&lt;n&gt;</code>.</p>",
            "<p><b>Câu 4.</b> Cứu những job bị treo. Dòng 1 đọc <code>&lt;lockDurationMs&gt;</code>, rồi tới các sự kiện <code>&lt;thờiĐiểm&gt; &lt;start|renew|finish|check&gt; &lt;jobId&gt;</code>. Lệnh <code>start</code> giữ một khoá hết hạn ở <code>thờiĐiểm + lockDuration</code>; <code>renew</code> gia hạn tính từ thời điểm hiện tại; <code>finish</code> hoàn tất job. Lệnh <code>check</code> liệt kê mọi job có khoá đã hết hạn mà chưa xong: in <code>stalled &lt;jobId&gt;</code> cho từng cái (theo thứ tự bắt đầu) rồi đưa lại vào hàng đợi — lần <code>start</code> kế tiếp của nó là một lần chạy thứ hai. Kết thúc bằng <code>completed=&lt;n&gt; stalled=&lt;n&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n1000\n0 start j1\n0 start j2\n500 renew j1\n1200 check x\n1300 finish j1\n1300 start j2\n1400 finish j2\n2500 check x\nOUTPUT:\nstalled j2\ncompleted=2 stalled=1",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst LOCK = Number(lines[0].trim());\nconst active = new Map();   // jobId -> expiresAt\nconst order = [];\nlet completed = 0, stalled = 0;\nfor (const line of lines.slice(1)) {\n  const [timeStr, cmd, jobId] = line.trim().split(/\\s+/);\n  const time = Number(timeStr);\n  if (cmd === 'start') {\n    if (!order.includes(jobId)) order.push(jobId);\n    active.set(jobId, time + LOCK);\n  } else if (cmd === 'renew') {\n    if (active.has(jobId)) active.set(jobId, time + LOCK);\n  } else if (cmd === 'finish') {\n    if (active.delete(jobId)) completed++;\n  } else {\n    for (const id of order) {\n      const exp = active.get(id);\n      if (exp !== undefined && exp <= time) {\n        // Khoá hết hạn mà job chưa xong = worker đã chết hoặc đã chặn event loop.\n        active.delete(id);\n        stalled++;\n        console.log(`stalled ${id}`);\n      }\n    }\n  }\n}\nconsole.log(`completed=${completed} stalled=${stalled}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> A scheduler that fans out instead of doing the work itself. Read <code>&lt;tzOffsetHours&gt;</code> on line 1 and a cron-ish spec <code>&lt;hour&gt; &lt;minute&gt;</code> (local time) on line 2, then UTC timestamps <code>YYYY-MM-DDTHH:mm</code>, one per line. For each timestamp print <code>&lt;utc&gt; local=&lt;local HH:mm&gt; &lt;fire|skip&gt;</code>. Every time it fires, fan out one job per user from the JSON array on the LAST line, printing <code>enqueue digest-&lt;userId&gt;-&lt;local date YYYY-MM-DD&gt;</code>. End with <code>jobs=&lt;n&gt;</code>.</p>",
            "<p><b>Câu 5.</b> Một bộ hẹn lịch biết RẢI việc thay vì tự ôm. Dòng 1 đọc <code>&lt;chênhLệchMúiGiờ&gt;</code> (giờ), dòng 2 đọc lịch kiểu cron <code>&lt;giờ&gt; &lt;phút&gt;</code> (giờ địa phương), rồi tới các mốc thời gian UTC <code>YYYY-MM-DDTHH:mm</code>, mỗi dòng một cái. Với mỗi mốc, in <code>&lt;utc&gt; local=&lt;giờ địa phương HH:mm&gt; &lt;fire|skip&gt;</code>. Mỗi lần nổ thì rải ra mỗi người dùng một job từ mảng JSON ở dòng CUỐI, in <code>enqueue digest-&lt;idNgườiDùng&gt;-&lt;ngày địa phương YYYY-MM-DD&gt;</code>. Kết thúc bằng <code>jobs=&lt;n&gt;</code>.</p>",
          ),
          expectedOutput: "INPUT:\n7\n3 0\n2026-07-27T20:00\n2026-07-28T03:00\n2026-07-28T20:00\n[1,2]\nOUTPUT:\n2026-07-27T20:00 local=03:00 fire\nenqueue digest-1-2026-07-28\nenqueue digest-2-2026-07-28\n2026-07-28T03:00 local=10:00 skip\n2026-07-28T20:00 local=03:00 fire\nenqueue digest-1-2026-07-29\nenqueue digest-2-2026-07-29\njobs=4",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst offset = Number(lines[0].trim());\nconst [hour, minute] = lines[1].trim().split(/\\s+/).map(Number);\nconst users = JSON.parse(lines[lines.length - 1]);\nconst stamps = lines.slice(2, lines.length - 1);\nlet jobs = 0;\nfor (const utc of stamps) {\n  const local = new Date(new Date(utc + ':00Z').getTime() + offset * 3600_000);\n  const hh = String(local.getUTCHours()).padStart(2, '0');\n  const mm = String(local.getUTCMinutes()).padStart(2, '0');\n  const fire = local.getUTCHours() === hour && local.getUTCMinutes() === minute;\n  console.log(`${utc} local=${hh}:${mm} ${fire ? 'fire' : 'skip'}`);\n  if (!fire) continue;\n  const day = local.toISOString().slice(0, 10);\n  // Job định kỳ chỉ RẢI việc: mỗi người một job, thử lại và theo dõi được riêng.\n  for (const u of users) { jobs++; console.log(`enqueue digest-${u}-${day}`); }\n}\nconsole.log(`jobs=${jobs}`);\n",
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-10',
      source: 'SAMPLE',
      sortOrder: 19,
      title: B("Practical Exam 10 — reading production", "Thi thực hành 10 — đọc hiểu production"),
      description: B("Chapters 15 to 17: percentiles from a real log, metric cardinality, the profile that names the hot path, and diagnosing a deploy.", "Chương 15 tới 17: tính phân vị từ log thật, số chiều của nhãn metric, ảnh chụp CPU chỉ đúng điểm nóng, và chẩn đoán một lần deploy."),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: '<div class="ml-en"><p><b>How to take this exam.</b></p><ol>' +
        '<li>Create five files named <code>Q1.js … Q5.js</code> in your own editor — one per question, plain Node.js, <b>no npm packages</b>.</li>' +
        '<li>Each program reads its input from <b>stdin</b> and writes the answer to <b>stdout</b>. Test it with <code>node Q1.js &lt; input.txt</code>, or just paste the input and press Ctrl+D.</li>' +
        '<li>The "expected output" block of every question shows the exact input used and the exact output required — match it line for line.</li>' +
        '<li>When you are done, compress the five files into <b>one .zip</b> and upload it in the submit box. AI grades each question against the problem, the expected output and a reference solution.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi.</b></p><ol>' +
        '<li>Tạo năm file tên <code>Q1.js … Q5.js</code> bằng trình soạn thảo của bạn — mỗi câu một file, Node.js thuần, <b>không dùng gói npm nào</b>.</li>' +
        '<li>Mỗi chương trình đọc dữ liệu từ <b>stdin</b> và in kết quả ra <b>stdout</b>. Chạy thử bằng <code>node Q1.js &lt; input.txt</code>, hoặc dán dữ liệu vào rồi bấm Ctrl+D.</li>' +
        '<li>Khối "kết quả mong đợi" của mỗi câu ghi rõ dữ liệu vào đã dùng và kết quả bắt buộc phải ra — hãy khớp từng dòng.</li>' +
        '<li>Xong xuôi, nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài. AI chấm từng câu theo đề, kết quả mong đợi và một đáp án mẫu.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q1.</b> Read one JSON log line per request and print, per URL sorted by count DESC then URL ASC: <code>&lt;url&gt; n=&lt;count&gt; p50=&lt;ms&gt; p95=&lt;ms&gt; max=&lt;ms&gt;</code>. Use the nearest-rank percentile: sort ascending and take index <code>Math.floor(n * q)</code>, clamped to the last element.</p>",
            "<p><b>Câu 1.</b> Mỗi dòng đọc một bản ghi log JSON và in ra, theo từng URL sắp xếp theo số lượng GIẢM DẦN rồi URL TĂNG DẦN: <code>&lt;url&gt; n=&lt;số lượng&gt; p50=&lt;ms&gt; p95=&lt;ms&gt; max=&lt;ms&gt;</code>. Dùng phân vị theo thứ hạng gần nhất: sắp tăng dần rồi lấy chỉ số <code>Math.floor(n * q)</code>, kẹp lại ở phần tử cuối.</p>",
          ),
          expectedOutput: "INPUT:\n{\"url\":\"/feed\",\"durationMs\":60}\n{\"url\":\"/feed\",\"durationMs\":8241}\n{\"url\":\"/feed\",\"durationMs\":55}\n{\"url\":\"/notes\",\"durationMs\":12}\n{\"url\":\"/feed\",\"durationMs\":58}\n{\"url\":\"/notes\",\"durationMs\":30}\nOUTPUT:\n/feed n=4 p50=60 p95=8241 max=8241\n/notes n=2 p50=30 p95=30 max=30",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst byUrl = new Map();\nfor (const line of lines) {\n  const r = JSON.parse(line);\n  if (!byUrl.has(r.url)) byUrl.set(r.url, []);\n  byUrl.get(r.url).push(r.durationMs);\n}\nconst pct = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];\n[...byUrl.entries()]\n  .sort((a, b) => b[1].length - a[1].length || (a[0] < b[0] ? -1 : 1))\n  .forEach(([url, values]) => {\n    const s = [...values].sort((x, y) => x - y);\n    console.log(`${url} n=${s.length} p50=${pct(s, 0.5)} p95=${pct(s, 0.95)} max=${s[s.length - 1]}`);\n  });\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'javascript',
          prompt: B(
            "<p><b>Q2.</b> Normalise URLs into route templates before they become metric labels. Read one path per line and replace any segment that is all digits with <code>:id</code>, and any segment that looks like a UUID (8-4-4-4-12 hex) with <code>:uuid</code>. Print the template. Then print <code>series=&lt;number of DISTINCT templates&gt;</code> and <code>raw=&lt;number of distinct input paths&gt;</code> — the gap is the cardinality explosion you just avoided.</p>",
            "<p><b>Câu 2.</b> Chuẩn hoá URL thành mẫu route trước khi chúng trở thành nhãn metric. Mỗi dòng đọc một đường dẫn và thay mọi đoạn toàn chữ số bằng <code>:id</code>, mọi đoạn trông như UUID (hex 8-4-4-4-12) bằng <code>:uuid</code>. In ra mẫu route. Sau đó in <code>series=&lt;số mẫu KHÁC NHAU&gt;</code> và <code>raw=&lt;số đường dẫn khác nhau ở đầu vào&gt;</code> — khoảng cách giữa hai con số chính là vụ nổ số chiều mà bạn vừa tránh được.</p>",
          ),
          expectedOutput: "INPUT:\n/api/v1/notes/1\n/api/v1/notes/2\n/api/v1/notes/8412/comments\n/api/v1/users/3f6b2c1a-9d4e-4f7a-8b1c-2e5d7a9f0c31\n/api/v1/health\nOUTPUT:\n/api/v1/notes/:id\n/api/v1/notes/:id\n/api/v1/notes/:id/comments\n/api/v1/users/:uuid\n/api/v1/health\nseries=4\nraw=5",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;\nconst templates = new Set();\nconst raw = new Set();\nfor (const line of lines) {\n  const p = line.trim();\n  raw.add(p);\n  const t = p.split('/').map((seg) => {\n    if (/^\\d+$/.test(seg)) return ':id';\n    if (UUID.test(seg)) return ':uuid';\n    return seg;\n  }).join('/');\n  templates.add(t);\n  console.log(t);\n}\nconsole.log(`series=${templates.size}`);\nconsole.log(`raw=${raw.size}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'javascript',
          prompt: B(
            "<p><b>Q3.</b> Read a CPU profile as lines <code>&lt;percent&gt; &lt;function&gt;</code> and a target speed-up factor on the FIRST line. For each function print <code>&lt;function&gt; &lt;percent&gt;% -&gt; saves &lt;x&gt;%</code> where <code>x</code> is the whole-request saving if that function became <code>factor</code>× faster, to two decimals. Then print <code>focus=&lt;function with the largest saving&gt;</code>. Amdahl, in ten lines: making 0,5% of the time twice as fast cannot buy more than 0,25%.</p>",
            "<p><b>Câu 3.</b> Đọc một ảnh chụp CPU dạng các dòng <code>&lt;phầnTrăm&gt; &lt;tênHàm&gt;</code>, với hệ số tăng tốc mục tiêu nằm ở dòng ĐẦU. Với mỗi hàm, in <code>&lt;tênHàm&gt; &lt;phầnTrăm&gt;% -&gt; saves &lt;x&gt;%</code> trong đó <code>x</code> là phần tiết kiệm trên toàn request nếu hàm đó nhanh lên <code>factor</code> lần, lấy hai chữ số thập phân. Rồi in <code>focus=&lt;hàm tiết kiệm được nhiều nhất&gt;</code>. Định luật Amdahl gói trong mười dòng: làm cho 0,5% thời gian nhanh gấp đôi thì không thể mua nổi quá 0,25%.</p>",
          ),
          expectedOutput: "INPUT:\n2\n16.9 stringify\n15.9 renderNote\n14.5 cryptoHash\n0.5 regexSlugify\nOUTPUT:\nstringify 16.9% -> saves 8.45%\nrenderNote 15.9% -> saves 7.95%\ncryptoHash 14.5% -> saves 7.25%\nregexSlugify 0.5% -> saves 0.25%\nfocus=stringify",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst factor = Number(lines[0].trim());\nlet best = null;\nfor (const line of lines.slice(1)) {\n  const [pctStr, name] = line.trim().split(/\\s+/);\n  const pct = Number(pctStr);\n  const saves = pct - pct / factor;\n  if (!best || saves > best.saves) best = { name, saves };\n  console.log(`${name} ${pct}% -> saves ${saves.toFixed(2)}%`);\n}\nconsole.log(`focus=${best.name}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q4.</b> Diagnose a deploy from status codes alone. Read <code>&lt;route&gt; &lt;status&gt;</code> per line and print, per route, <code>&lt;route&gt; &lt;verdict&gt;</code> where 200 → <code>mounted-public</code>, 401 or 403 → <code>mounted-auth</code>, 404 → <code>MISSING</code>, 502 or 503 → <code>app-down</code>, anything else → <code>unknown</code>. Then <code>smoke=&lt;PASS|FAIL&gt;</code>: the deploy FAILS if any route is MISSING, because a 404 means the route was never mounted in the running process.</p>",
            "<p><b>Câu 4.</b> Chẩn đoán một lần deploy chỉ bằng mã trạng thái. Mỗi dòng đọc <code>&lt;route&gt; &lt;mã&gt;</code> và in theo từng route <code>&lt;route&gt; &lt;kết luận&gt;</code>, trong đó 200 → <code>mounted-public</code>, 401 hoặc 403 → <code>mounted-auth</code>, 404 → <code>MISSING</code>, 502 hoặc 503 → <code>app-down</code>, còn lại → <code>unknown</code>. Sau đó in <code>smoke=&lt;PASS|FAIL&gt;</code>: lần deploy HỎNG nếu có bất kỳ route nào MISSING, vì 404 nghĩa là route đó chưa từng được gắn vào tiến trình đang chạy.</p>",
          ),
          expectedOutput: "INPUT:\ngifs 404\nmessages/threads 401\ncourses 200\nfeed/posts 401\nhealth 200\nsnippets 502\nOUTPUT:\ngifs MISSING\nmessages/threads mounted-auth\ncourses mounted-public\nfeed/posts mounted-auth\nhealth mounted-public\nsnippets app-down\nsmoke=FAIL",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nlet failed = false;\nfor (const line of lines) {\n  const [route, codeStr] = line.trim().split(/\\s+/);\n  const code = Number(codeStr);\n  let verdict = 'unknown';\n  if (code === 200) verdict = 'mounted-public';\n  else if (code === 401 || code === 403) verdict = 'mounted-auth';\n  else if (code === 404) { verdict = 'MISSING'; failed = true; }\n  else if (code === 502 || code === 503) verdict = 'app-down';\n  console.log(`${route} ${verdict}`);\n}\nconsole.log(`smoke=${failed ? 'FAIL' : 'PASS'}`);\n",
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'javascript',
          prompt: B(
            "<p><b>Q5.</b> Decide whether a memory series is a leak. Read <code>&lt;thresholdMB&gt;</code> on line 1, then samples <code>&lt;requests&gt; &lt;rssMB&gt;</code> in increasing request order. Print <code>&lt;requests&gt; &lt;rssMB&gt; delta=&lt;change since previous, or -&gt;</code> for each. Then classify: if the LAST THIRD of the samples grew by more than <code>thresholdMB</code>, print <code>verdict=LEAK growth=&lt;MB&gt;</code>; otherwise <code>verdict=PLATEAU growth=&lt;MB&gt;</code>. A doubling at the start followed by a flat line is V8 sizing its heap, not a leak.</p>",
            "<p><b>Câu 5.</b> Quyết định xem một dãy số liệu bộ nhớ có phải rò rỉ không. Dòng 1 đọc <code>&lt;ngưỡngMB&gt;</code>, rồi tới các mẫu <code>&lt;sốRequest&gt; &lt;rssMB&gt;</code> theo thứ tự request tăng dần. In cho từng mẫu <code>&lt;sốRequest&gt; &lt;rssMB&gt; delta=&lt;thay đổi so với mẫu trước, hoặc -&gt;</code>. Sau đó phân loại: nếu MỘT PHẦN BA CUỐI của dãy tăng thêm quá <code>ngưỡngMB</code> thì in <code>verdict=LEAK growth=&lt;MB&gt;</code>; ngược lại in <code>verdict=PLATEAU growth=&lt;MB&gt;</code>. Tăng gấp đôi lúc đầu rồi đi ngang là V8 đang mở heap tới cỡ làm việc, không phải rò rỉ.</p>",
          ),
          expectedOutput: "INPUT:\n10\n0 56.6\n20000 122.5\n50000 123.3\n80000 123.4\n100000 123.4\nOUTPUT:\n0 56.6 delta=-\n20000 122.5 delta=65.9\n50000 123.3 delta=0.8\n80000 123.4 delta=0.1\n100000 123.4 delta=0.0\nverdict=PLATEAU growth=0.0",
          sampleSolution: "const lines = require('node:fs').readFileSync(0, 'utf8').trim().split('\\n');\nconst threshold = Number(lines[0].trim());\nconst samples = lines.slice(1).map((l) => { const [reqs, rss] = l.trim().split(/\\s+/); return { reqs: Number(reqs), rss: Number(rss) }; });\nsamples.forEach((s, i) => {\n  const delta = i === 0 ? '-' : (s.rss - samples[i - 1].rss).toFixed(1);\n  console.log(`${s.reqs} ${s.rss} delta=${delta}`);\n});\n// Chỉ nhìn phần ĐUÔI: cú tăng đầu tiên là V8 mở heap, không phải rò rỉ.\nconst tailStart = Math.floor((samples.length * 2) / 3);\nconst growth = samples[samples.length - 1].rss - samples[tailStart].rss;\nconsole.log(`verdict=${growth > threshold ? 'LEAK' : 'PLATEAU'} growth=${growth.toFixed(1)}`);\n",
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
