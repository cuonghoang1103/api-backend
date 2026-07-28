/**
 * Node.js — Progress Test 1 (chương 1–6).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/nodejs/s01…s06`. 30 câu trắc
 * nghiệm + 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI đoạn mã hỏi "in ra gì" và cả hai lời giải mẫu đều đã được CHẠY THẬT
 * bằng `node` (v22) để lấy kết quả — không suy đoán.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-PT1.mjs --apply
 */
import { B, EX, code, sim, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/nodejs-exam-kit.mjs';

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 1–6 (JavaScript, runtime, core modules, npm, Express, REST)',
        'Kiểm tra tiến độ 1 — Chương 1–6 (JavaScript, runtime, module lõi, npm, Express, REST)',
      ),
      description: B(
        'First third of the Node.js course: JavaScript for backend, the event loop, core modules, npm, Express and REST design. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Node.js: JavaScript cho backend, event loop, module lõi, npm, Express và thiết kế REST. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '1–6'),
      questions: [
        // ── Chương 1 — JavaScript nền tảng ──────────────────────────────
        mcq({
          prompt: B(
            'What does this program print?' + code(
              "for (var i = 0; i < 3; i++) setTimeout(() => process.stdout.write('A' + i + ' '), 0);\n" +
              "for (let j = 0; j < 3; j++) setTimeout(() => process.stdout.write('B' + j + ' '), 0);",
            ),
            'Chương trình sau in ra gì?' + code(
              "for (var i = 0; i < 3; i++) setTimeout(() => process.stdout.write('A' + i + ' '), 0);\n" +
              "for (let j = 0; j < 3; j++) setTimeout(() => process.stdout.write('B' + j + ' '), 0);",
            ),
          ),
          options: [
            B('A0 A1 A2 B0 B1 B2', 'A0 A1 A2 B0 B1 B2'),
            B('A3 A3 A3 B0 B1 B2', 'A3 A3 A3 B0 B1 B2'),
            B('A3 A3 A3 B3 B3 B3', 'A3 A3 A3 B3 B3 B3'),
            B('A0 A1 A2 B3 B3 B3', 'A0 A1 A2 B3 B3 B3'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>var</code> has ONE binding shared by all three callbacks; by the time the timers fire the loop is over and <code>i</code> is 3. <code>let</code> creates a fresh binding per iteration, so B keeps 0/1/2. Replace <code>setTimeout</code> with "save this row to the database" and you get three writes that all reference the last item — a silent data bug, not a crash.',
            'Đã chạy thật để lấy kết quả. <code>var</code> chỉ có MỘT biến dùng chung cho cả ba callback; lúc timer chạy thì vòng lặp đã xong và <code>i</code> = 3. <code>let</code> tạo binding mới mỗi vòng nên B giữ 0/1/2. Thay <code>setTimeout</code> bằng "ghi bản ghi này xuống cơ sở dữ liệu" là ba lần ghi đều trỏ vào phần tử cuối — lỗi dữ liệu âm thầm, không hề báo lỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'Which statement about <code>const</code> is correct?' + code(
              "const user = { name: 'An' };",
            ),
            'Phát biểu nào về <code>const</code> là ĐÚNG?' + code(
              "const user = { name: 'An' };",
            ),
          ),
          options: [
            B('<code>user.name = &quot;Bình&quot;</code> throws, because const makes the object immutable', '<code>user.name = &quot;Bình&quot;</code> sẽ báo lỗi, vì const làm object bất biến'),
            B('<code>user.name = &quot;Bình&quot;</code> is allowed; <code>user = {}</code> throws TypeError', '<code>user.name = &quot;Bình&quot;</code> được phép; <code>user = {}</code> ném TypeError'),
            B('Both assignments are allowed — const only affects primitives', 'Cả hai phép gán đều được phép — const chỉ ảnh hưởng kiểu nguyên thuỷ'),
            B('<code>Object.freeze(user)</code> makes the whole object tree immutable, including nested objects', '<code>Object.freeze(user)</code> làm bất biến toàn bộ cây object, kể cả object lồng bên trong'),
          ],
          correct: 1,
          explanation: EX(
            '<code>const</code> freezes the BINDING, not the value: mutating a property is fine, reassigning the variable throws <code>TypeError: Assignment to constant variable</code>. And <code>Object.freeze</code> is shallow — it protects the top level only, and in non-strict code a failed write is silently ignored, which is worse than an error.',
            '<code>const</code> khoá LIÊN KẾT (binding), không khoá giá trị: sửa thuộc tính thì được, gán lại biến sẽ ném <code>TypeError: Assignment to constant variable</code>. Còn <code>Object.freeze</code> chỉ NÔNG — bảo vệ đúng tầng ngoài cùng, và ở chế độ không strict thì phép ghi hỏng bị bỏ qua im lặng, còn tệ hơn báo lỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const original = { name: 'An', address: { city: 'Ha Noi' }, tags: ['a'] };\n" +
              'const copy = { ...original };\n' +
              "copy.name = 'Binh';\n" +
              "copy.address.city = 'Da Nang';\n" +
              "copy.tags.push('b');\n" +
              "console.log(original.name, '|', original.address.city, '|', original.tags.join(','));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const original = { name: 'An', address: { city: 'Ha Noi' }, tags: ['a'] };\n" +
              'const copy = { ...original };\n' +
              "copy.name = 'Binh';\n" +
              "copy.address.city = 'Da Nang';\n" +
              "copy.tags.push('b');\n" +
              "console.log(original.name, '|', original.address.city, '|', original.tags.join(','));",
            ),
          ),
          options: [
            B('An | Ha Noi | a', 'An | Ha Noi | a'),
            B('Binh | Da Nang | a,b', 'Binh | Da Nang | a,b'),
            B('An | Da Nang | a,b', 'An | Da Nang | a,b'),
            B('An | Da Nang | a', 'An | Da Nang | a'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it. Spread copies ONE level: <code>name</code> is a primitive so the copy is independent, but <code>address</code> and <code>tags</code> are still the SAME objects — editing them through the copy edits the original. Use <code>structuredClone()</code> for a real deep copy (<code>JSON.parse(JSON.stringify(x))</code> destroys Date, Map, Set and undefined).',
            'Đã chạy thật. Spread chỉ chép MỘT tầng: <code>name</code> là kiểu nguyên thuỷ nên bản chép độc lập, nhưng <code>address</code> và <code>tags</code> vẫn là CÙNG object — sửa qua bản chép là sửa luôn bản gốc. Muốn chép sâu thật thì dùng <code>structuredClone()</code> (<code>JSON.parse(JSON.stringify(x))</code> làm hỏng Date, Map, Set và undefined).',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              'const sleep = (ms) => new Promise(r => setTimeout(r, ms));\n' +
              'const out = [];\n' +
              '[1, 2, 3].forEach(async (n) => { await sleep(10); out.push(n); });\n' +
              "console.log('A:', JSON.stringify(out));\n" +
              "setTimeout(() => console.log('B:', JSON.stringify(out)), 50);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              'const sleep = (ms) => new Promise(r => setTimeout(r, ms));\n' +
              'const out = [];\n' +
              '[1, 2, 3].forEach(async (n) => { await sleep(10); out.push(n); });\n' +
              "console.log('A:', JSON.stringify(out));\n" +
              "setTimeout(() => console.log('B:', JSON.stringify(out)), 50);",
            ),
          ),
          options: [
            B('A: [1,2,3] then B: [1,2,3]', 'A: [1,2,3] rồi B: [1,2,3]'),
            B('A: [] then B: [1,2,3]', 'A: [] rồi B: [1,2,3]'),
            B('A: [] then B: []', 'A: [] rồi B: []'),
            B('It throws — you cannot pass an async function to forEach', 'Báo lỗi — không thể truyền hàm async vào forEach'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>forEach</code> does not await the async callbacks it calls — it fires all three and returns immediately, so line A sees an empty array. 50 ms later the pushes have landed. This is the classic "the loop finished but nothing was saved" bug; use <code>for…of</code> with <code>await</code> (sequential) or <code>await Promise.all(arr.map(fn))</code> (parallel).',
            'Đã chạy thật. <code>forEach</code> KHÔNG chờ các callback async mà nó gọi — nó bắn cả ba rồi trả về ngay, nên dòng A thấy mảng rỗng. 50 ms sau thì các lệnh push đã xong. Đây chính là lỗi kinh điển "vòng lặp chạy xong mà chẳng lưu được gì"; hãy dùng <code>for…of</code> kèm <code>await</code> (tuần tự) hoặc <code>await Promise.all(arr.map(fn))</code> (song song).',
          ),
        }),

        mcq({
          prompt: B(
            'You send 10 notifications in parallel. Some are allowed to fail, and you need to know the outcome of EVERY one. Which combinator fits?',
            'Bạn gửi 10 thông báo song song. Một vài cái được phép thất bại, và bạn cần biết kết quả của TỪNG cái. Dùng hàm nào?',
          ),
          options: [
            B('<code>Promise.all</code> — it waits for all of them', '<code>Promise.all</code> — vì nó chờ tất cả'),
            B('<code>Promise.allSettled</code>', '<code>Promise.allSettled</code>'),
            B('<code>Promise.race</code>', '<code>Promise.race</code>'),
            B('<code>Promise.any</code>', '<code>Promise.any</code>'),
          ],
          correct: 1,
          explanation: EX(
            '<code>Promise.all</code> rejects the moment ONE fails, so you lose the results of the other nine. <code>allSettled</code> never rejects and reports <code>{status, value|reason}</code> for each. <code>race</code> = first to settle (the standard timeout trick), <code>any</code> = first to SUCCEED.',
            '<code>Promise.all</code> ném lỗi ngay khi MỘT cái hỏng, nên bạn mất kết quả của chín cái còn lại. <code>allSettled</code> không bao giờ ném và báo <code>{status, value|reason}</code> cho từng cái. <code>race</code> = ai xong trước (mẹo đặt timeout), <code>any</code> = ai THÀNH CÔNG trước.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about ES Modules (ESM) versus CommonJS (CJS) in Node.',
            'Chọn HAI phát biểu ĐÚNG về ES Modules (ESM) so với CommonJS (CJS) trong Node.',
          ),
          options: [
            B('<code>__dirname</code> is available in ESM exactly as in CJS', '<code>__dirname</code> có sẵn trong ESM y như trong CJS'),
            B('Top-level <code>await</code> works in ESM but is a SyntaxError in CJS', '<code>await</code> ở cấp cao nhất chạy được trong ESM nhưng là SyntaxError trong CJS'),
            B('A <code>.js</code> file is ESM only if the nearest package.json has <code>&quot;type&quot;: &quot;module&quot;</code>', 'File <code>.js</code> chỉ là ESM khi package.json gần nhất có <code>&quot;type&quot;: &quot;module&quot;</code>'),
            B('ESM lets you omit the file extension in relative imports', 'ESM cho phép bỏ phần mở rộng file khi import tương đối'),
          ],
          correct: [1, 2],
          explanation: EX(
            'ESM has no <code>__dirname</code> (rebuild it with <code>path.dirname(fileURLToPath(import.meta.url))</code>) and it REQUIRES the extension — <code>import &quot;./math.js&quot;</code>, not <code>&quot;./math&quot;</code>. Top-level await is ESM-only, and <code>.js</code> takes its mode from the nearest package.json (<code>.mjs</code> is always ESM, <code>.cjs</code> always CJS). "Cannot use import statement outside a module" means you wrote <code>import</code> in a file Node is treating as CommonJS.',
            'ESM không có <code>__dirname</code> (phải dựng lại bằng <code>path.dirname(fileURLToPath(import.meta.url))</code>) và BẮT BUỘC ghi phần mở rộng — <code>import &quot;./math.js&quot;</code> chứ không phải <code>&quot;./math&quot;</code>. Top-level await chỉ ESM mới có, còn file <code>.js</code> lấy chế độ từ package.json gần nhất (<code>.mjs</code> luôn ESM, <code>.cjs</code> luôn CJS). Lỗi "Cannot use import statement outside a module" nghĩa là bạn viết <code>import</code> trong file mà Node đang coi là CommonJS.',
          ),
        }),

        // ── Chương 2 — Bên trong runtime ────────────────────────────────
        mcq({
          prompt: B(
            'Inside an I/O callback the order is deterministic. What does this print?' + code(
              "const fs = require('node:fs');\n" +
              'fs.readFile(__filename, () => {\n' +
              "  setTimeout(() => process.stdout.write('timeout '), 0);\n" +
              "  setImmediate(() => process.stdout.write('immediate '));\n" +
              "  process.nextTick(() => process.stdout.write('nextTick '));\n" +
              "  Promise.resolve().then(() => process.stdout.write('promise '));\n" +
              "  process.stdout.write('sync ');\n" +
              '});',
            ),
            'Bên trong một callback I/O thì thứ tự là xác định. Đoạn mã sau in ra gì?' + code(
              "const fs = require('node:fs');\n" +
              'fs.readFile(__filename, () => {\n' +
              "  setTimeout(() => process.stdout.write('timeout '), 0);\n" +
              "  setImmediate(() => process.stdout.write('immediate '));\n" +
              "  process.nextTick(() => process.stdout.write('nextTick '));\n" +
              "  Promise.resolve().then(() => process.stdout.write('promise '));\n" +
              "  process.stdout.write('sync ');\n" +
              '});',
            ),
          ),
          options: [
            B('sync nextTick promise immediate timeout', 'sync nextTick promise immediate timeout'),
            B('sync promise nextTick timeout immediate', 'sync promise nextTick timeout immediate'),
            B('sync timeout immediate nextTick promise', 'sync timeout immediate nextTick promise'),
            B('nextTick sync promise immediate timeout', 'nextTick sync promise immediate timeout'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it five times — identical every time. Synchronous code always finishes first, then the <code>nextTick</code> queue is drained completely, then microtasks (Promises). Only then does the loop continue: we are already past <b>poll</b>, so <b>check</b> (setImmediate) comes before the next <b>timers</b> phase.' +
              sim('nodejs-event-loop', 'nodejs-2-2-event-loop', 'Watch the six phases'),
            'Đã chạy thật năm lần — lần nào cũng y hệt. Mã đồng bộ luôn chạy xong trước, rồi hàng đợi <code>nextTick</code> được vét SẠCH, rồi tới microtask (Promise). Sau đó vòng lặp mới đi tiếp: ta đang ở sau pha <b>poll</b> nên <b>check</b> (setImmediate) đến trước pha <b>timers</b> kế tiếp.' +
              sim('nodejs-event-loop', 'nodejs-2-2-event-loop', 'Xem mô phỏng sáu pha'),
          ),
        }),

        mcq({
          prompt: B(
            'At the TOP LEVEL of a file (not inside an I/O callback), what is the order of these two lines?' + code(
              "setTimeout(() => process.stdout.write('timeout '), 0);\n" +
              "setImmediate(() => process.stdout.write('immediate '));",
            ),
            'Ở CẤP CAO NHẤT của file (không nằm trong callback I/O), hai dòng sau chạy theo thứ tự nào?' + code(
              "setTimeout(() => process.stdout.write('timeout '), 0);\n" +
              "setImmediate(() => process.stdout.write('immediate '));",
            ),
          ),
          options: [
            B('timeout always first — 0 ms has already elapsed', 'timeout luôn trước — vì 0 ms đã trôi qua'),
            B('immediate always first — check runs before timers', 'immediate luôn trước — pha check chạy trước timers'),
            B('Not guaranteed: it depends on how long the process took to start', 'Không đảm bảo: tuỳ tiến trình khởi động mất bao lâu'),
            B('They run at exactly the same time, in declaration order', 'Chúng chạy cùng lúc, theo thứ tự khai báo'),
          ],
          correct: 2,
          explanation: EX(
            '<code>setTimeout(fn, 0)</code> means "after AT LEAST 0 ms". Whether that deadline has already passed when the loop first reaches the timers phase is a matter of microseconds of startup luck, so running the same two lines five times gives different answers. Never write code whose correctness depends on timer ordering — express order with <code>await</code>.',
            '<code>setTimeout(fn, 0)</code> nghĩa là "sau ÍT NHẤT 0 ms". Deadline đó đã trôi qua hay chưa khi vòng lặp lần đầu tới pha timers là chuyện may rủi vài micro-giây lúc khởi động, nên chạy đúng hai dòng đó năm lần sẽ ra các thứ tự khác nhau. Đừng bao giờ viết mã mà tính đúng đắn phụ thuộc thứ tự timer — cần thứ tự thì dùng <code>await</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A route runs a synchronous loop that takes 2871 ms of CPU. During that time, which of these can the same Node process still do?',
            'Một route chạy vòng lặp đồng bộ tốn 2871 ms CPU. Trong khoảng thời gian đó, tiến trình Node ấy vẫn làm được việc nào sau đây?',
          ),
          options: [
            B('Answer other requests, because Node is asynchronous', 'Trả lời request khác, vì Node là bất đồng bộ'),
            B('Answer the health check, because health checks have priority', 'Trả lời health check, vì health check được ưu tiên'),
            B('Nothing — no request, no response, no health check, no timer callback', 'Không làm được gì — không nhận request, không trả lời, không health check, không callback timer'),
            B('Everything, as long as there are at least 4 CPU cores', 'Mọi thứ, miễn máy có ít nhất 4 nhân CPU'),
          ],
          correct: 2,
          explanation: EX(
            'Measured in the course: the computation took 2871 ms and the 100 ms heartbeat arrived 2873 ms late — the same number. There is ONE thread running your JavaScript, so while it computes, nothing else in the process runs. With 200 concurrent users they do not each wait 2.9 s; they queue, and the 200th waits about ten minutes.' +
              sim('nodejs-blocking', 'nodejs-2-4-chan-event-loop', 'Watch the loop freeze'),
            'Bài học đã đo: phép tính mất 2871 ms và nhịp tim 100 ms đến trễ tới 2873 ms — đúng bằng nhau. Chỉ có MỘT luồng chạy JavaScript của bạn, nên khi nó đang tính thì không gì khác trong tiến trình chạy được. Với 200 người dùng đồng thời, họ không phải mỗi người chờ 2,9 giây mà xếp hàng — người thứ 200 chờ khoảng mười phút.' +
              sim('nodejs-blocking', 'nodejs-2-4-chan-event-loop', 'Xem mô phỏng event loop bị chặn'),
          ),
        }),

        mcq({
          prompt: B(
            "libuv keeps a thread pool (4 threads by default, <code>UV_THREADPOOL_SIZE</code>). Which work actually runs on it?",
            'libuv có một thread pool (mặc định 4 luồng, <code>UV_THREADPOOL_SIZE</code>). Việc nào THỰC SỰ chạy trên pool đó?',
          ),
          options: [
            B('Every asynchronous operation, including network requests', 'Mọi thao tác bất đồng bộ, kể cả request mạng'),
            B('File I/O, DNS lookups, zlib and crypto — but never your own JavaScript loops', 'File I/O, tra cứu DNS, zlib và crypto — nhưng không bao giờ là vòng lặp JavaScript của bạn'),
            B('Your route handlers, one per request', 'Các hàm xử lý route của bạn, mỗi request một luồng'),
            B('Nothing — Node is strictly single-threaded', 'Không gì cả — Node đơn luồng tuyệt đối'),
          ],
          correct: 1,
          explanation: EX(
            'Firing eight <code>crypto.pbkdf2</code> calls at once produces two clean waves (tasks 1–4 at ~50–63 ms, tasks 5–8 at ~100–131 ms) — you are literally watching four workers. Raising <code>UV_THREADPOOL_SIZE</code> to 8 flattens the waves. But your own <code>for</code> loop never goes to the pool: only file I/O, DNS, zlib and crypto do.',
            'Bắn tám lệnh <code>crypto.pbkdf2</code> cùng lúc sẽ ra hai đợt rõ rệt (việc 1–4 xong ở ~50–63 ms, việc 5–8 ở ~100–131 ms) — đúng là đang nhìn bốn thợ làm việc. Nâng <code>UV_THREADPOOL_SIZE</code> lên 8 thì hết chia đợt. Nhưng vòng <code>for</code> của bạn thì không bao giờ ra pool: chỉ file I/O, DNS, zlib và crypto mới ra.',
          ),
        }),

        mcq({
          prompt: B(
            'The course moves one 2871 ms computation off the main thread two ways. Which comparison is correct?',
            'Bài học đưa một phép tính 2871 ms ra khỏi luồng chính bằng hai cách. So sánh nào ĐÚNG?',
          ),
          options: [
            B('Worker: lag 2 ms, job 2883 ms. Chunking: lag 194 ms, job 19580 ms', 'Worker: trễ 2 ms, việc 2883 ms. Cắt nhỏ: trễ 194 ms, việc 19580 ms'),
            B('Worker: lag 2 ms, job 2883 ms. Chunking: lag 194 ms, job 2871 ms', 'Worker: trễ 2 ms, việc 2883 ms. Cắt nhỏ: trễ 194 ms, việc 2871 ms'),
            B('Worker: lag 2873 ms, job 2883 ms. Chunking: lag 2 ms, job 19580 ms', 'Worker: trễ 2873 ms, việc 2883 ms. Cắt nhỏ: trễ 2 ms, việc 19580 ms'),
            B('Worker: lag 2 ms, job 410 ms. Chunking: lag 0 ms, job 380 ms', 'Worker: trễ 2 ms, việc 410 ms. Cắt nhỏ: trễ 0 ms, việc 380 ms'),
          ],
          correct: 0,
          explanation: EX(
            'Both numbers come from the lesson. A worker keeps the server responsive at the cost of ~10–30 ms startup and its own V8 heap, and it does NOT share variables (messages are copied). Chunking keeps the loop breathing but yielding constantly costs real throughput — it is a compromise, not a free win.' +
              sim('nodejs-worker', 'nodejs-2-5-worker-threads', 'Watch worker vs chunking'),
            'Cả hai con số đều lấy từ bài học. Worker giữ server còn phản hồi, đổi lại tốn ~10–30 ms khởi động và một vùng nhớ V8 riêng, và nó KHÔNG dùng chung biến (dữ liệu được sao chép qua message). Cắt nhỏ giúp event loop thở được nhưng nhường lượt liên tục thì mất thông lượng thật — là sự đánh đổi chứ không phải lợi ích miễn phí.' +
              sim('nodejs-worker', 'nodejs-2-5-worker-threads', 'Xem mô phỏng worker và cắt nhỏ'),
          ),
        }),

        // ── Chương 3 — Module lõi ───────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const s = 'Xin chào';\n" +
              "const b = Buffer.from(s, 'utf8');\n" +
              'console.log(s.length, b.length);',
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const s = 'Xin chào';\n" +
              "const b = Buffer.from(s, 'utf8');\n" +
              'console.log(s.length, b.length);',
            ),
          ),
          options: [
            B('8 8', '8 8'),
            B('8 9', '8 9'),
            B('9 9', '9 9'),
            B('8 16', '8 16'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. Eight characters, nine bytes: in UTF-8 an ASCII character costs 1 byte but <code>à</code> costs 2 (the bytes <code>c3 a0</code>); emoji cost 4. Characters are not bytes — which is why <code>buffer.subarray(0, 100)</code> is a dangerous way to "keep the first 100 characters".',
            'Đã chạy thật. Tám ký tự, chín byte: trong UTF-8 một ký tự ASCII tốn 1 byte nhưng <code>à</code> tốn 2 (hai byte <code>c3 a0</code>); emoji tốn 4. Ký tự không phải byte — nên <code>buffer.subarray(0, 100)</code> là cách nguy hiểm để "giữ lại 100 ký tự đầu".',
          ),
        }),

        mcq({
          prompt: B(
            'Continuing from the same buffer, what is <code>b.subarray(0, 7).toString(&quot;utf8&quot;)</code>?',
            'Vẫn buffer đó, <code>b.subarray(0, 7).toString(&quot;utf8&quot;)</code> cho ra gì?',
          ),
          options: [
            B('&quot;Xin chà&quot;', '&quot;Xin chà&quot;'),
            B('&quot;Xin cho&quot;', '&quot;Xin cho&quot;'),
            B('&quot;Xin ch&#xFFFD;&quot; (replacement character)', '&quot;Xin ch&#xFFFD;&quot; (ký tự thay thế)'),
            B('It throws RangeError: index out of range', 'Ném lỗi RangeError: index out of range'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it: 7 bytes slices through the two bytes of <code>à</code> and produces <code>&#xFFFD;</code>. This is the real cause of the mangled text you sometimes see on websites. Truncate the STRING, not the buffer.',
            'Đã chạy thật: cắt ở 7 byte là cắt ngang hai byte của chữ <code>à</code> nên ra <code>&#xFFFD;</code>. Đây chính là nguyên nhân thật của những đoạn chữ bị vỡ mà bạn thỉnh thoảng thấy trên web. Hãy cắt CHUỖI, đừng cắt buffer.' +
              sim('nodejs-buffer', 'nodejs-3-2-buffer', 'Xem mô phỏng byte và ký tự'),
          ),
        }),

        mcq({
          prompt: B(
            'Why should you always use <code>pipeline(a, b, c)</code> instead of <code>a.pipe(b).pipe(c)</code>?',
            'Vì sao luôn phải dùng <code>pipeline(a, b, c)</code> thay cho <code>a.pipe(b).pipe(c)</code>?',
          ),
          options: [
            B('pipeline uses bigger chunks, so it is measurably faster', 'pipeline dùng khối dữ liệu lớn hơn nên nhanh hơn rõ rệt'),
            B('pipe() forwards no errors and never cleans up the chain', 'pipe() không chuyển tiếp lỗi và không bao giờ dọn dẹp chuỗi'),
            B('pipe() was removed in Node 22 and now throws', 'pipe() đã bị bỏ trong Node 22 và giờ sẽ ném lỗi'),
            B('pipeline buffers the whole file first, which is safer', 'pipeline nạp cả file vào bộ nhớ trước cho an toàn hơn'),
          ],
          correct: 1,
          explanation: EX(
            '<code>pipeline</code> destroys the whole chain properly and gives you ONE place to catch errors; <code>.pipe()</code> does neither. Streaming is also why the 348 MB experiment used 120 MB of RAM instead of 395 MB — and why gzipping the same file peaked at only 75 MB.' +
              sim('nodejs-stream', 'nodejs-3-3-stream', 'Watch buffering vs streaming'),
            '<code>pipeline</code> huỷ đúng cách toàn bộ chuỗi và cho bạn MỘT chỗ bắt lỗi; <code>.pipe()</code> thì không làm cả hai. Streaming cũng là lý do thí nghiệm file 348 MB chỉ tốn 120 MB RAM thay vì 395 MB — và nén gzip cùng file đó đỉnh điểm chỉ 75 MB.' +
              sim('nodejs-stream', 'nodejs-3-3-stream', 'Xem mô phỏng nạp hết vs streaming'),
          ),
        }),

        mcq({
          prompt: B(
            'A download endpoint does <code>path.join(uploadDir, req.params.filename)</code>. A client asks for <code>../../etc/passwd</code>. What is the correct fix?',
            'Một endpoint tải file dùng <code>path.join(uploadDir, req.params.filename)</code>. Client yêu cầu <code>../../etc/passwd</code>. Cách sửa ĐÚNG là gì?',
          ),
          options: [
            B('Nothing: path.join already resolves &quot;..&quot; safely', 'Không cần sửa: path.join đã xử lý &quot;..&quot; an toàn'),
            B('Replace path.join with plain string concatenation', 'Thay path.join bằng nối chuỗi thủ công'),
            B('Resolve it, then check it is still inside the upload dir', 'Resolve ra rồi kiểm tra nó vẫn nằm trong thư mục upload'),
            B('URL-encode the filename before joining it', 'Mã hoá URL tên file trước khi ghép'),
          ],
          correct: 2,
          explanation: EX(
            '<code>path.join</code> resolves <code>..</code> — that is exactly the problem: it happily walks OUT of your directory. The guard is <code>const full = path.resolve(uploadDir, name); if (!full.startsWith(path.resolve(uploadDir) + path.sep)) throw …</code>. This is path traversal, one of the oldest bugs in web software.',
            '<code>path.join</code> có xử lý <code>..</code> — và đó chính là vấn đề: nó vui vẻ đi RA khỏi thư mục của bạn. Lá chắn là <code>const full = path.resolve(uploadDir, name); if (!full.startsWith(path.resolve(uploadDir) + path.sep)) throw …</code>. Đây là lỗi path traversal, một trong những lỗi cổ nhất của phần mềm web.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about EventEmitter.',
            'Chọn HAI phát biểu ĐÚNG về EventEmitter.',
          ),
          options: [
            B('<code>emit()</code> is synchronous: it returns only after every listener has finished', '<code>emit()</code> là đồng bộ: nó chỉ trả về sau khi mọi listener chạy xong'),
            B('Emitting <code>&quot;error&quot;</code> with no error listener attached throws and can kill the process', 'Phát sự kiện <code>&quot;error&quot;</code> mà không có listener nào lắng nghe sẽ ném lỗi và có thể giết tiến trình'),
            B('<code>MaxListenersExceededWarning</code> is properly fixed with <code>setMaxListeners(100)</code>', '<code>MaxListenersExceededWarning</code> được sửa đúng bằng <code>setMaxListeners(100)</code>'),
            B('<code>emit()</code> queues listeners as microtasks, so they run after the current function returns', '<code>emit()</code> xếp listener vào microtask nên chúng chạy sau khi hàm hiện tại trả về'),
          ],
          correct: [0, 1],
          explanation: EX(
            '<code>emit</code> is synchronous — a slow listener blocks the emitter and the event loop, and a listener that throws propagates back to whoever called <code>emit()</code>. The warning at 11 listeners almost always means you are adding listeners without removing them (typically per request); the fix is <code>off()</code>/<code>once()</code>, not raising the limit.',
            '<code>emit</code> chạy đồng bộ — một listener chậm sẽ chặn cả emitter lẫn event loop, và listener ném lỗi thì lỗi dội ngược về chỗ gọi <code>emit()</code>. Cảnh báo ở listener thứ 11 gần như luôn có nghĩa bạn thêm listener mà không gỡ (thường là mỗi request thêm một cái); cách sửa là <code>off()</code>/<code>once()</code> chứ không phải nâng giới hạn.',
          ),
        }),

        // ── Chương 4 — npm ──────────────────────────────────────────────
        mcq({
          prompt: B(
            'package.json says <code>&quot;express&quot;: &quot;^4.18.0&quot;</code>. Which versions may npm install?',
            'package.json ghi <code>&quot;express&quot;: &quot;^4.18.0&quot;</code>. npm được phép cài những phiên bản nào?',
          ),
          options: [
            B('Only 4.18.0 — the caret pins it exactly', 'Chỉ 4.18.0 — dấu mũ ghim chính xác bản đó'),
            B('Only 4.18.x — patch may move, minor may not', 'Chỉ 4.18.x — patch được tăng, minor thì không'),
            B('Any 4.x.x from 4.18.0 up, e.g. 4.22.2', 'Bất kỳ 4.x.x từ 4.18.0 trở lên, ví dụ 4.22.2'),
            B('Any version at all, including 5.x majors', 'Bất kỳ phiên bản nào, kể cả bản lớn 5.x'),
          ],
          correct: 2,
          explanation: EX(
            'Caret <code>^</code> allows minor and patch (it resolved to 4.22.2 in the lesson — four minor versions ahead); tilde <code>~4.18.0</code> allows patch only (4.18.3); a bare <code>4.18.0</code> is exact. This is the mechanism behind "but it works on my machine": nobody edited package.json, yet two machines run different code.' +
              sim('nodejs-semver', 'nodejs-4-2-semver-lockfile', 'Watch semver ranges resolve'),
            'Dấu mũ <code>^</code> cho phép tăng minor và patch (trong bài học nó ra 4.22.2 — vượt bốn bản minor); dấu ngã <code>~4.18.0</code> chỉ cho tăng patch (4.18.3); ghi trần <code>4.18.0</code> là chính xác bản đó. Đây chính là cơ chế đằng sau câu "máy tôi chạy được mà": không ai sửa package.json, vậy mà hai máy chạy hai bộ mã khác nhau.' +
              sim('nodejs-semver', 'nodejs-4-2-semver-lockfile', 'Xem mô phỏng phạm vi semver'),
          ),
        }),

        mcq({
          prompt: B(
            'What is the practical difference between <code>npm ci</code> and <code>npm install</code>?',
            'Khác biệt thực tế giữa <code>npm ci</code> và <code>npm install</code> là gì?',
          ),
          options: [
            B('<code>ci</code> installs exactly the lockfile and never rewrites it', '<code>ci</code> cài đúng theo lockfile và không bao giờ ghi lại nó'),
            B('<code>ci</code> is only an alias of <code>install</code> inside CI', '<code>ci</code> chỉ là tên gọi khác của <code>install</code> khi ở trong CI'),
            B('<code>ci</code> skips devDependencies, <code>install</code> keeps them', '<code>ci</code> bỏ qua devDependencies, <code>install</code> thì giữ'),
            B('<code>install</code> is faster: it reads the lockfile directly', '<code>install</code> nhanh hơn: nó đọc thẳng lockfile'),
          ],
          correct: 0,
          explanation: EX(
            'Use <code>npm ci</code> everywhere — CI, Docker, and whenever you just want the project running — and <code>npm install</code> only when you deliberately add or upgrade a package. It is also faster, because it skips resolution entirely. (Skipping dev deps is a separate flag: <code>--omit=dev</code>.)',
            'Dùng <code>npm ci</code> ở mọi nơi — CI, Docker, và bất cứ khi nào bạn chỉ muốn chạy dự án — còn <code>npm install</code> chỉ dùng khi cố ý thêm hoặc nâng cấp gói. Nó cũng nhanh hơn vì bỏ hẳn bước giải phiên bản. (Bỏ qua devDependencies là cờ riêng: <code>--omit=dev</code>.)',
          ),
        }),

        mcq({
          prompt: B(
            'A backend works locally but crashes right after deploy with <code>Cannot find module &quot;zod&quot;</code>. The Docker image builds with <code>npm ci --omit=dev</code>. What is the most likely cause?',
            'Một backend chạy tốt ở máy local nhưng sập ngay sau khi deploy với lỗi <code>Cannot find module &quot;zod&quot;</code>. Ảnh Docker build bằng <code>npm ci --omit=dev</code>. Nguyên nhân khả dĩ nhất?',
          ),
          options: [
            B('The lockfile was not committed', 'Lockfile chưa được commit'),
            B('zod is listed in devDependencies but is imported by code in src/', 'zod nằm trong devDependencies nhưng lại được mã trong src/ import'),
            B('The Node version on the server is too new', 'Phiên bản Node trên máy chủ quá mới'),
            B('npm ci cannot install packages that have install scripts', 'npm ci không cài được gói có script cài đặt'),
          ],
          correct: 1,
          explanation: EX(
            'It works locally because everything is installed there; production installs with <code>--omit=dev</code> and the package is gone. Rule of thumb: if <code>src/</code> imports it, it belongs in <code>dependencies</code>. devDependencies is for tools that never run in production — linters, test runners, build tools.',
            'Ở local chạy được vì máy đã cài đủ; production cài với <code>--omit=dev</code> nên gói đó biến mất. Nguyên tắc: hễ <code>src/</code> có import thì gói đó thuộc <code>dependencies</code>. devDependencies chỉ dành cho công cụ không bao giờ chạy trên production — lint, chạy test, build.',
          ),
        }),

        mcq({
          prompt: B(
            'You run <code>npm install ./some-package</code> and never import it anywhere. Can that package execute code on your machine?',
            'Bạn chạy <code>npm install ./some-package</code> và không import nó ở đâu cả. Gói đó có thể chạy mã trên máy bạn không?',
          ),
          options: [
            B('No — a package only runs when you import it', 'Không — một gói chỉ chạy khi bạn import nó'),
            B('Yes — its <code>postinstall</code> script runs at install time', 'Có — script <code>postinstall</code> của nó chạy ngay lúc cài'),
            B('Only if the package was installed globally with -g', 'Chỉ khi gói được cài toàn cục bằng -g'),
            B('Only after npm audit reports a vulnerability in it', 'Chỉ sau khi npm audit báo gói đó có lỗ hổng'),
          ],
          correct: 1,
          explanation: EX(
            'The lesson proves it: a package with only a <code>postinstall</code> script wrote a file into HOME during <code>npm install</code>, with nothing imported. A real attacker would read your environment variables, SSH keys or cloud credentials instead. <code>--ignore-scripts</code> is a strong default for CI — but some legitimate packages (sharp, bcrypt, better-sqlite3) need install scripts to compile native code, so test before enforcing it globally.',
            'Bài học đã chứng minh: một gói chỉ có script <code>postinstall</code> đã ghi được file vào thư mục HOME ngay trong lúc <code>npm install</code>, chẳng import gì cả. Kẻ tấn công thật sẽ đọc biến môi trường, khoá SSH hoặc thông tin đăng nhập cloud của bạn. <code>--ignore-scripts</code> là mặc định tốt cho CI — nhưng vài gói chính đáng (sharp, bcrypt, better-sqlite3) cần script cài đặt để biên dịch mã máy, nên phải thử trước khi bật toàn cục.',
          ),
        }),

        // ── Chương 5 — Express ──────────────────────────────────────────
        mcq({
          prompt: B(
            'Two routes are declared in this order. What does <code>GET /notes/new</code> return?' + code(
              "app.get('/notes/:id', (req, res) => res.json({ handler: ':id', params: req.params }));\n" +
              "app.get('/notes/new', (req, res) => res.json({ handler: 'new' }));",
            ),
            'Hai route được khai báo theo thứ tự này. <code>GET /notes/new</code> trả về gì?' + code(
              "app.get('/notes/:id', (req, res) => res.json({ handler: ':id', params: req.params }));\n" +
              "app.get('/notes/new', (req, res) => res.json({ handler: 'new' }));",
            ),
          ),
          options: [
            B('<code>{&quot;handler&quot;:&quot;new&quot;}</code> — Express prefers the more specific route', '<code>{&quot;handler&quot;:&quot;new&quot;}</code> — Express ưu tiên route cụ thể hơn'),
            B('<code>{&quot;handler&quot;:&quot;:id&quot;,&quot;params&quot;:{&quot;id&quot;:&quot;new&quot;}}</code>', '<code>{&quot;handler&quot;:&quot;:id&quot;,&quot;params&quot;:{&quot;id&quot;:&quot;new&quot;}}</code>'),
            B('404, because &quot;new&quot; is not a number', '404, vì &quot;new&quot; không phải số'),
            B('Express refuses to start: duplicate route', 'Express không khởi động được: trùng route'),
          ],
          correct: 1,
          explanation: EX(
            'Express keeps routes in an ORDERED list and the first match wins — there is no "more specific" logic and no duplicate-route warning. <code>:id</code> happily matches the literal segment <code>new</code>, and the handler then runs <code>WHERE id = Number(&quot;new&quot;)</code> = NaN. Declare specific routes BEFORE parameterised ones.',
            'Express giữ các route trong một danh sách CÓ THỨ TỰ và ai khớp trước thì thắng — không có logic "cụ thể hơn" và cũng không cảnh báo trùng route. <code>:id</code> khớp luôn đoạn chữ <code>new</code>, rồi handler chạy <code>WHERE id = Number(&quot;new&quot;)</code> = NaN. Hãy khai báo route cụ thể TRƯỚC route có tham số.',
          ),
        }),

        mcq({
          prompt: B(
            'What is wrong with this handler, and what does the server log?' + code(
              "app.get('/double', (req, res) => {\n" +
              "  if (!req.query.token) res.status(401).json({ error: 'Unauthorized' });\n" +
              "  res.json({ secret: 'private data' });\n" +
              '});',
            ),
            'Handler này sai ở đâu, và máy chủ ghi log gì?' + code(
              "app.get('/double', (req, res) => {\n" +
              "  if (!req.query.token) res.status(401).json({ error: 'Unauthorized' });\n" +
              "  res.json({ secret: 'private data' });\n" +
              '});',
            ),
          ),
          options: [
            B('Nothing is wrong — the 401 already ended the request', 'Không sai gì — lệnh 401 đã kết thúc request rồi'),
            B('The secret leaks to the client inside the 401 body', 'Dữ liệu bí mật lọt tới client ngay trong thân phản hồi 401'),
            B('Missing <code>return</code> → <code>ERR_HTTP_HEADERS_SENT</code> in the log', 'Thiếu <code>return</code> → log ghi <code>ERR_HTTP_HEADERS_SENT</code>'),
            B('<code>req.query</code> is undefined without <code>express.json()</code>', '<code>req.query</code> là undefined nếu chưa dùng <code>express.json()</code>'),
          ],
          correct: 2,
          explanation: EX(
            'The client sees the correct 401, so the bug hides for months — but the handler continued and Node raised <code>ERR_HTTP_HEADERS_SENT</code> into the error handler. On a route where the second <code>res.json</code> came after an expensive database write, you would also be doing that write for a request you had already rejected. Rule: every response-ending <code>res.*</code> gets a <code>return</code> in front of it.',
            'Client vẫn nhận đúng mã 401 nên lỗi này ẩn mình hàng tháng trời — nhưng handler đã chạy tiếp và Node ném <code>ERR_HTTP_HEADERS_SENT</code> vào error handler. Nếu trước <code>res.json</code> thứ hai còn có một lệnh ghi cơ sở dữ liệu tốn kém thì bạn vẫn ghi cho một request đã bị từ chối. Nguyên tắc: mọi lệnh <code>res.*</code> kết thúc request đều phải có <code>return</code> đứng trước.',
          ),
        }),

        mcq({
          prompt: B(
            'Errors "never reach" this handler. Why?' + code(
              "app.use((err, req, res) => {\n" +
              "  res.status(500).json({ error: 'Internal server error' });\n" +
              '});',
            ),
            'Lỗi "không bao giờ tới" handler này. Vì sao?' + code(
              "app.use((err, req, res) => {\n" +
              "  res.status(500).json({ error: 'Internal server error' });\n" +
              '});',
            ),
          ),
          options: [
            B('It must be registered with <code>app.useError()</code> instead', 'Phải đăng ký bằng <code>app.useError()</code> mới đúng'),
            B('It declares three parameters; an error handler needs four', 'Nó khai báo ba tham số; error handler cần bốn'),
            B('It is registered after the routers; it must come before', 'Nó đăng ký sau các router; đáng lẽ phải trước'),
            B('An error handler may not send JSON, only plain text', 'Error handler không được gửi JSON, chỉ được gửi văn bản thuần'),
          ],
          correct: 1,
          explanation: EX(
            'Express decides a function is an error handler by counting its declared parameters at registration time (<code>fn.length</code>). Drop the unused <code>next</code> and your error handling quietly disappears — no warning at startup. Keep the 4th parameter even when unused, and register the handler LAST (after the JSON 404).',
            'Express xác định một hàm là error handler bằng cách đếm số tham số khai báo lúc đăng ký (<code>fn.length</code>). Bỏ tham số <code>next</code> không dùng tới là toàn bộ phần xử lý lỗi âm thầm biến mất — không có cảnh báo nào lúc khởi động. Hãy giữ tham số thứ 4 dù không dùng, và đăng ký handler CUỐI CÙNG (sau lệnh 404 JSON).' +
              sim('nodejs-error-handling', 'nodejs-5-4-xu-ly-loi', 'Xem mô phỏng đường đi của lỗi'),
          ),
        }),

        mcq({
          prompt: B(
            'The same async route runs on Express 4.22.2 and Express 5.2.1:' + code(
              "app.get('/async-throw', async (req, res) => {\n" +
              '  await new Promise((r) => setTimeout(r, 10));\n' +
              "  throw new Error('blew up AFTER an await');\n" +
              '});',
            ) + 'What is the difference?',
            'Cùng một route async chạy trên Express 4.22.2 và Express 5.2.1:' + code(
              "app.get('/async-throw', async (req, res) => {\n" +
              '  await new Promise((r) => setTimeout(r, 10));\n' +
              "  throw new Error('blew up AFTER an await');\n" +
              '});',
            ) + 'Khác nhau ở chỗ nào?',
          ),
          options: [
            B('Both answer 500 — Express always caught async errors', 'Cả hai đều trả 500 — Express xưa nay vẫn bắt lỗi async'),
            B('Express 4 never answers at all; Express 5 answers 500', 'Express 4 không trả lời gì cả; Express 5 trả 500'),
            B('Express 4 answers 500; Express 5 crashes the process', 'Express 4 trả 500; Express 5 làm sập tiến trình'),
            B('Both crash the process with an uncaught exception', 'Cả hai đều làm sập tiến trình vì lỗi không bắt được'),
          ],
          correct: 1,
          explanation: EX(
            'Since every real route is async (you await the database), this is the single most common cause of "our API randomly hangs" in Express 4 codebases. The old fix was to wrap every handler: <code>const wrap = fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next)</code>. Note the limit even on Express 5: an error thrown inside a callback you scheduled yourself (<code>setTimeout(() =&gt; { throw … })</code>) still kills the process.',
            'Vì mọi route thật đều là async (bạn await cơ sở dữ liệu), đây là nguyên nhân phổ biến số một của chuyện "API thỉnh thoảng treo" trong các mã nguồn Express 4. Cách sửa cũ là bọc mọi handler: <code>const wrap = fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next)</code>. Lưu ý giới hạn ngay cả với Express 5: lỗi ném bên trong callback do bạn tự hẹn giờ (<code>setTimeout(() =&gt; { throw … })</code>) vẫn giết tiến trình.',
          ),
        }),

        mcq({
          prompt: B(
            'A single endpoint "hangs forever" while every other endpoint works. The middleware for it looks like this:' + code(
              "app.use('/hang', (req, res, next) => {\n" +
              "  console.log('middleware ran');\n" +
              '});',
            ) + 'What happens, and why is it dangerous?',
            'Một endpoint duy nhất "treo mãi mãi" trong khi mọi endpoint khác vẫn chạy. Middleware của nó như sau:' + code(
              "app.use('/hang', (req, res, next) => {\n" +
              "  console.log('middleware ran');\n" +
              '});',
            ) + 'Chuyện gì xảy ra, và vì sao nguy hiểm?',
          ),
          options: [
            B('Express times the request out after 2 minutes and answers 408', 'Express tự hết giờ sau 2 phút và trả về 408'),
            B('It never responds and never calls next(): the request hangs', 'Nó không trả lời cũng không gọi next(): request treo mãi'),
            B('Express skips it and moves on to the next route by itself', 'Express tự bỏ qua nó và chuyển sang route kế tiếp'),
            B('The process crashes with ERR_MIDDLEWARE_NO_NEXT', 'Tiến trình sập với lỗi ERR_MIDDLEWARE_NO_NEXT'),
          ],
          correct: 1,
          explanation: EX(
            'A middleware has exactly three legal endings: call <code>next()</code>, send a response, or call <code>next(err)</code>. Doing none of them is the fourth, illegal one — no error, no log, no crash, and the hardest bug to spot by reading code. Worse, the connection stays open, so enough of these exhaust the connection pool and take the whole API down. The real-world version is an async middleware whose early-return branch forgets both <code>res</code> and <code>next</code>.' +
              sim('nodejs-middleware', 'nodejs-5-3-middleware', 'Watch the middleware chain'),
            'Một middleware chỉ có đúng ba cách kết thúc hợp lệ: gọi <code>next()</code>, gửi phản hồi, hoặc gọi <code>next(err)</code>. Không làm gì trong ba cách đó là cách thứ tư — bất hợp lệ: không lỗi, không log, không sập, và là loại lỗi khó nhìn ra nhất khi đọc mã. Tệ hơn, kết nối vẫn mở, nên đủ nhiều request kiểu này là cạn sạch nguồn kết nối và cả API sập theo. Ngoài đời thường gặp ở middleware async có nhánh return sớm quên cả <code>res</code> lẫn <code>next</code>.' +
              sim('nodejs-middleware', 'nodejs-5-3-middleware', 'Xem mô phỏng dây chuyền middleware'),
          ),
        }),

        mcq({
          prompt: B(
            '<code>req.body</code> is <code>undefined</code> in a POST handler. Choose the TWO causes described in the course.',
            '<code>req.body</code> là <code>undefined</code> trong một handler POST. Chọn HAI nguyên nhân đã nêu trong giáo trình.',
          ),
          options: [
            B('The route was registered ABOVE <code>app.use(express.json())</code>', 'Route được đăng ký PHÍA TRÊN <code>app.use(express.json())</code>'),
            B('The client did not send <code>Content-Type: application/json</code>, so the parser deliberately ignored the body', 'Client không gửi <code>Content-Type: application/json</code> nên bộ phân tích cố ý bỏ qua thân request'),
            B('The body is larger than 100kb, so Express replaces it with undefined', 'Thân request lớn hơn 100kb nên Express thay nó bằng undefined'),
            B('You must call <code>await req.json()</code> first, like in the browser fetch API', 'Phải gọi <code>await req.json()</code> trước, giống fetch API trên trình duyệt'),
          ],
          correct: [0, 1],
          explanation: EX(
            'The three classic causes are: you forgot <code>express.json()</code>, you registered the route above it (order IS the program in Express), or the client sent the wrong Content-Type. A body over the limit is not silently dropped — body-parser raises <code>entity.too.large</code>, which you map to 413. In Express 5 an unparsed body is <code>undefined</code>, so <code>const { title } = req.body</code> throws on the destructure — write <code>req.body ?? {}</code>.',
            'Ba nguyên nhân kinh điển là: quên <code>express.json()</code>, đăng ký route phía trên nó (trong Express thì THỨ TỰ chính là chương trình), hoặc client gửi sai Content-Type. Thân request vượt giới hạn thì không bị bỏ im lặng — body-parser ném <code>entity.too.large</code> và bạn ánh xạ nó thành 413. Ở Express 5, thân chưa được phân tích là <code>undefined</code> nên <code>const { title } = req.body</code> sẽ ném lỗi ngay lúc destructure — hãy viết <code>req.body ?? {}</code>.',
          ),
        }),

        // ── Chương 6 — Thiết kế REST ────────────────────────────────────
        mcq({
          prompt: B(
            'A frontend has an interceptor that refreshes the token and retries once on 401. Your API answers 401 when a logged-in user tries to edit someone else\'s note. What happens?',
            'Frontend có bộ chặn: gặp 401 thì làm mới token rồi thử lại một lần. API của bạn trả 401 khi một người đã đăng nhập cố sửa ghi chú của người khác. Chuyện gì xảy ra?',
          ),
          options: [
            B('Nothing bad — the retry simply fails again and stops', 'Không sao cả — lần thử lại chỉ hỏng tiếp rồi dừng'),
            B('An endless refresh loop; 403 is the correct status here', 'Vòng lặp làm mới token vô tận; ở đây 403 mới là mã đúng'),
            B('The browser blocks the retry, so nothing happens', 'Trình duyệt chặn lần thử lại nên không có gì xảy ra'),
            B('Nothing: 401 is correct, the refresh just renews it', 'Không sao: 401 là đúng, việc làm mới chỉ gia hạn token'),
          ],
          correct: 1,
          explanation: EX(
            '401 = "I do not know who you are" (authentication) → refresh or log in. 403 = "I know who you are and you may not do this" (authorisation) → refreshing changes nothing. Getting this backwards has a concrete cost, and it is the exact loop described above. (404 is legitimate for "exists but you may not even know it exists".)',
            '401 = "tôi không biết bạn là ai" (xác thực) → làm mới token hoặc đăng nhập. 403 = "tôi biết bạn là ai và bạn không được phép" (phân quyền) → làm mới token chẳng thay đổi gì. Nhầm hai mã này có cái giá rất cụ thể, đúng bằng cái vòng lặp nói trên. (404 hợp lệ cho trường hợp "có tồn tại nhưng bạn không được phép biết là nó tồn tại".)',
          ),
        }),

        mcq({
          prompt: B(
            'A registration endpoint receives a syntactically valid email that is already registered. Which status code is correct?',
            'Một endpoint đăng ký nhận được email đúng cú pháp nhưng đã có người dùng. Mã trạng thái nào là ĐÚNG?',
          ),
          options: [
            B('422 — the value itself is semantically invalid', '422 — bản thân giá trị đó sai về mặt ngữ nghĩa'),
            B('409 — the data is fine, it conflicts with current state', '409 — dữ liệu vẫn ổn, nó xung đột với trạng thái hiện tại'),
            B('400 — the request could not even be parsed', '400 — request thậm chí không phân tích nổi'),
            B('500 — the database raised a unique-constraint error', '500 — cơ sở dữ liệu ném lỗi ràng buộc duy nhất'),
          ],
          correct: 1,
          explanation: EX(
            'The practical test: could this exact request have succeeded a minute ago, or succeed a minute from now? If yes it is a conflict with state, not a validation error. 422 is for data that is invalid on its own (an email with no @). Chapter 7 maps Prisma\'s unique-constraint error <code>P2002</code> onto 409 for exactly this reason — and note that a 500 here would tell the client "try again", which is wrong.',
            'Phép thử thực tế: đúng request này có thể đã thành công một phút trước, hoặc sẽ thành công một phút sau, hay không? Nếu có thì đó là xung đột trạng thái chứ không phải lỗi dữ liệu. 422 dành cho dữ liệu tự nó đã sai (email không có @). Chương 7 ánh xạ lỗi ràng buộc duy nhất <code>P2002</code> của Prisma thành 409 đúng vì lý do này — và lưu ý trả 500 ở đây là bảo client "thử lại đi", điều đó sai.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on a 1,000,000-row PostgreSQL table with an index on the sort column: <code>OFFSET 999980 LIMIT 20</code> took 166.815 ms and scanned 1,000,000 rows, while <code>WHERE id &gt; 999980 LIMIT 20</code> took 0.015 ms and scanned 20 rows. Which conclusion is correct?',
            'Đo trên bảng PostgreSQL 1.000.000 dòng có chỉ mục trên cột sắp xếp: <code>OFFSET 999980 LIMIT 20</code> mất 166,815 ms và quét 1.000.000 dòng, còn <code>WHERE id &gt; 999980 LIMIT 20</code> mất 0,015 ms và quét 20 dòng. Kết luận nào ĐÚNG?',
          ),
          options: [
            B('OFFSET is a seek: it jumps straight to row 999980', 'OFFSET là phép nhảy: nó nhảy thẳng tới dòng 999980'),
            B('OFFSET counts and discards, so cost grows with the page number', 'OFFSET đếm rồi vứt bỏ, nên chi phí tăng theo số trang'),
            B('Cursors are strictly better and should replace offset everywhere', 'Con trỏ tốt hơn tuyệt đối và nên thay OFFSET ở mọi nơi'),
            B('The gap disappears as soon as you add the right index', 'Khoảng cách biến mất ngay khi thêm đúng chỉ mục'),
          ],
          correct: 1,
          explanation: EX(
            'The index was already there — OFFSET still reads and discards every skipped row, so it is O(offset + limit) while a cursor is O(limit). And the correctness bug is separate from speed: an insert shifts every row down by one, so page 2 repeats an item from page 1. Cursors are not universally better though — they cannot do "jump to page 57" or a total page count, which admin tables need.' +
              sim('nodejs-pagination', 'nodejs-6-4-phan-trang', 'Watch offset vs cursor'),
            'Chỉ mục đã có sẵn — OFFSET vẫn phải đọc rồi vứt bỏ mọi dòng bị bỏ qua, nên nó là O(offset + limit) trong khi con trỏ là O(limit). Còn lỗi sai kết quả thì tách biệt với chuyện chậm: một dòng mới chèn vào đẩy mọi dòng xuống một bậc, nên trang 2 lặp lại một mục của trang 1. Nhưng con trỏ không phải lúc nào cũng hơn — nó không làm được "nhảy tới trang 57" và không có tổng số trang, thứ mà bảng quản trị cần.' +
              sim('nodejs-pagination', 'nodejs-6-4-phan-trang', 'Xem mô phỏng OFFSET và con trỏ'),
          ),
        }),

        mcq({
          prompt: B(
            'Two editors hold the same ETag <code>&quot;5e921251bfda&quot;</code>. A sends <code>PATCH</code> with <code>If-Match</code> and succeeds. What do B (same If-Match) and C (no If-Match at all) get?',
            'Hai người cùng giữ ETag <code>&quot;5e921251bfda&quot;</code>. A gửi <code>PATCH</code> kèm <code>If-Match</code> và thành công. B (cùng If-Match) và C (không gửi If-Match) nhận được gì?',
          ),
          options: [
            B('B → 412 Precondition Failed; C → 428 Precondition Required', 'B → 412 Precondition Failed; C → 428 Precondition Required'),
            B('B → 409 Conflict; C → 400 Bad Request', 'B → 409 Conflict; C → 400 Bad Request'),
            B('Both succeed — ETags are only a caching hint', 'Cả hai đều thành công — ETag chỉ là gợi ý cho cache'),
            B('B → 304 Not Modified; C → 200 OK', 'B → 304 Not Modified; C → 200 OK'),
          ],
          correct: 0,
          explanation: EX(
            'This is optimistic concurrency: 412 = you sent a precondition and it failed (someone edited first — reload and let the human decide); 428 = you sent no precondition and this endpoint requires one, which makes the safe path the only path. Without it you get the lost update — B silently erases A\'s work with no error and no log line. One more trap: set your ETag BEFORE <code>res.json</code>, or Express generates its own from the serialised body.' +
              sim('nodejs-contract', 'nodejs-6-5-hop-dong-api', 'Watch ETag / If-Match'),
            'Đây là điều khiển đồng thời lạc quan: 412 = bạn có gửi điều kiện và điều kiện sai (người khác sửa trước — hãy tải lại và để con người quyết định); 428 = bạn không gửi điều kiện mà endpoint này bắt buộc phải có, khiến con đường an toàn trở thành con đường duy nhất. Không có nó thì xảy ra lost update — B xoá trắng công sức của A mà không lỗi, không log. Thêm một cái bẫy: phải đặt ETag TRƯỚC <code>res.json</code>, nếu không Express tự sinh ETag từ thân phản hồi.' +
              sim('nodejs-contract', 'nodejs-6-5-hop-dong-api', 'Xem mô phỏng ETag / If-Match'),
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — List endpoint rules (chapters 5 + 6).</b> Implement <code>listNotes(notes, query)</code>, the core of a list endpoint. <code>query</code> is <code>req.query</code>, so <b>every value is a string</b> and any field may be missing.</p>' +
            '<ul>' +
            '<li><code>page</code>: <code>Number(query.page ?? 1)</code>. If it is not a finite number, or is &lt; 1, use <b>1</b>. Floor it.</li>' +
            '<li><code>limit</code>: <code>Number(query.limit ?? 10)</code>. If not a finite number use <b>10</b>; then <b>clamp to 1…50</b> (do not reject).</li>' +
            '<li><code>q</code>: if it is a non-empty string, keep only notes whose <code>title</code> contains it, <b>case-insensitive</b>.</li>' +
            '<li><code>sort</code>: allow-list <code>[&quot;createdAt&quot;, &quot;title&quot;]</code> — anything else falls back to <code>createdAt</code>.</li>' +
            '<li><code>order</code>: <code>&quot;asc&quot;</code> or <code>&quot;desc&quot;</code>, default <code>&quot;desc&quot;</code>. Compare the two strings with <code>&lt;</code> / <code>&gt;</code> (NOT <code>localeCompare</code>, whose result depends on the platform).</li>' +
            '<li>Return <code>{ items, page, limit, total, hasMore }</code> where <code>items</code> is the array of <b>ids</b> on this page, <code>total</code> is the count AFTER filtering, and <code>hasMore</code> says whether a next page exists.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Quy tắc của một endpoint danh sách (chương 5 + 6).</b> Cài đặt <code>listNotes(notes, query)</code>, phần lõi của một endpoint danh sách. <code>query</code> chính là <code>req.query</code> nên <b>mọi giá trị đều là chuỗi</b> và trường nào cũng có thể thiếu.</p>' +
            '<ul>' +
            '<li><code>page</code>: <code>Number(query.page ?? 1)</code>. Nếu không phải số hữu hạn, hoặc &lt; 1, thì lấy <b>1</b>. Làm tròn xuống.</li>' +
            '<li><code>limit</code>: <code>Number(query.limit ?? 10)</code>. Không phải số hữu hạn thì lấy <b>10</b>; sau đó <b>kẹp về 1…50</b> (không từ chối request).</li>' +
            '<li><code>q</code>: nếu là chuỗi khác rỗng thì chỉ giữ những ghi chú có <code>title</code> chứa nó, <b>không phân biệt hoa thường</b>.</li>' +
            '<li><code>sort</code>: danh sách cho phép <code>[&quot;createdAt&quot;, &quot;title&quot;]</code> — giá trị khác thì quay về <code>createdAt</code>.</li>' +
            '<li><code>order</code>: <code>&quot;asc&quot;</code> hoặc <code>&quot;desc&quot;</code>, mặc định <code>&quot;desc&quot;</code>. So sánh hai chuỗi bằng toán tử <code>&lt;</code> / <code>&gt;</code> (KHÔNG dùng <code>localeCompare</code> vì kết quả phụ thuộc nền tảng).</li>' +
            '<li>Trả về <code>{ items, page, limit, total, hasMore }</code> với <code>items</code> là mảng <b>id</b> của trang hiện tại, <code>total</code> là số bản ghi SAU khi lọc, và <code>hasMore</code> cho biết còn trang sau hay không.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            'const NOTES = [\n' +
            "  { id: 1, title: 'Express routing',  createdAt: '2026-01-05' },\n" +
            "  { id: 2, title: 'Event loop',       createdAt: '2026-01-09' },\n" +
            "  { id: 3, title: 'express.json()',   createdAt: '2026-01-02' },\n" +
            "  { id: 4, title: 'Buffer & stream',  createdAt: '2026-01-11' },\n" +
            "  { id: 5, title: 'REST status code', createdAt: '2026-01-07' },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function listNotes(notes, query = {}) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CASES = [\n' +
            '  {},\n' +
            "  { page: '2', limit: '2' },\n" +
            "  { limit: '500' },\n" +
            "  { limit: '0' },\n" +
            "  { page: '0' },\n" +
            "  { q: 'EXPRESS' },\n" +
            "  { sort: 'title', order: 'asc', limit: '3' },\n" +
            "  { sort: 'colour' },\n" +
            "  { page: 'abc' },\n" +
            '];\n' +
            "for (const c of CASES) console.log(JSON.stringify(c), '=>', JSON.stringify(listNotes(NOTES, c)));\n",
          expectedOutput:
            '{} => {"items":[4,2,5,1,3],"page":1,"limit":10,"total":5,"hasMore":false}\n' +
            '{"page":"2","limit":"2"} => {"items":[5,1],"page":2,"limit":2,"total":5,"hasMore":true}\n' +
            '{"limit":"500"} => {"items":[4,2,5,1,3],"page":1,"limit":50,"total":5,"hasMore":false}\n' +
            '{"limit":"0"} => {"items":[4],"page":1,"limit":1,"total":5,"hasMore":true}\n' +
            '{"page":"0"} => {"items":[4,2,5,1,3],"page":1,"limit":10,"total":5,"hasMore":false}\n' +
            '{"q":"EXPRESS"} => {"items":[1,3],"page":1,"limit":10,"total":2,"hasMore":false}\n' +
            '{"sort":"title","order":"asc","limit":"3"} => {"items":[4,2,1],"page":1,"limit":3,"total":5,"hasMore":true}\n' +
            '{"sort":"colour"} => {"items":[4,2,5,1,3],"page":1,"limit":10,"total":5,"hasMore":false}\n' +
            '{"page":"abc"} => {"items":[4,2,5,1,3],"page":1,"limit":10,"total":5,"hasMore":false}',
          sampleSolution:
            'function listNotes(notes, query = {}) {\n' +
            "  const SORTABLE = ['createdAt', 'title'];\n\n" +
            '  const rawPage = Number(query.page ?? 1);\n' +
            '  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;\n\n' +
            '  const rawLimit = Number(query.limit ?? 10);\n' +
            '  const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.floor(rawLimit))) : 10;\n\n' +
            "  const sort = SORTABLE.includes(query.sort) ? query.sort : 'createdAt';\n" +
            "  const order = query.order === 'asc' ? 'asc' : 'desc';\n\n" +
            '  let rows = notes;\n' +
            "  if (typeof query.q === 'string' && query.q !== '') {\n" +
            '    const needle = query.q.toLowerCase();\n' +
            '    rows = rows.filter((n) => n.title.toLowerCase().includes(needle));\n' +
            '  }\n\n' +
            '  rows = [...rows].sort((a, b) => {\n' +
            '    const x = String(a[sort]), y = String(b[sort]);\n' +
            '    const cmp = x < y ? -1 : x > y ? 1 : 0;\n' +
            "    return order === 'asc' ? cmp : -cmp;\n" +
            '  });\n\n' +
            '  const total = rows.length;\n' +
            '  const start = (page - 1) * limit;\n' +
            '  const items = rows.slice(start, start + limit);\n' +
            '  return {\n' +
            '    items: items.map((n) => n.id),\n' +
            '    page, limit, total,\n' +
            '    hasMore: start + items.length < total,\n' +
            '  };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Parallel work that never takes the process down (chapter 1 + 2).</b> A dashboard endpoint loads four things. They do not depend on each other, some are allowed to fail, and one is slow enough that it must be abandoned. Implement two functions.</p>' +
            '<p><code>withTimeout(promise, ms)</code> — resolves with the promise\'s value, or rejects with <code>new Error(&quot;TIMEOUT&quot;)</code> if <code>ms</code> passes first. Clear the timer afterwards so the process can exit.</p>' +
            '<p><code>runAll(tasks, timeoutMs)</code> — <code>tasks</code> is an array of functions returning a Promise. Start them <b>all in parallel</b> (total time ≈ the slowest, not the sum), apply <code>withTimeout</code> to each, and <b>never reject</b>. Return</p>' +
            code('{ results: [ { status: "ok", value } | { status: "error", reason } ], ok, failed }') +
            '<p><code>results</code> must be in the SAME order as <code>tasks</code>; <code>reason</code> is the error <b>message</b> (a string). <code>ok</code> and <code>failed</code> are counts.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Chạy song song mà không kéo sập tiến trình (chương 1 + 2).</b> Một endpoint bảng điều khiển nạp bốn thứ. Chúng không phụ thuộc nhau, vài cái được phép hỏng, và một cái chậm tới mức phải bỏ dở. Hãy cài đặt hai hàm.</p>' +
            '<p><code>withTimeout(promise, ms)</code> — trả về giá trị của promise, hoặc ném <code>new Error(&quot;TIMEOUT&quot;)</code> nếu quá <code>ms</code> mili-giây. Nhớ xoá timer sau đó để tiến trình có thể thoát.</p>' +
            '<p><code>runAll(tasks, timeoutMs)</code> — <code>tasks</code> là mảng các hàm trả về Promise. Khởi động <b>tất cả song song</b> (tổng thời gian ≈ cái chậm nhất, không phải tổng cộng), bọc <code>withTimeout</code> cho từng cái, và <b>không bao giờ ném lỗi</b>. Trả về</p>' +
            code('{ results: [ { status: "ok", value } | { status: "error", reason } ], ok, failed }') +
            '<p><code>results</code> phải ĐÚNG thứ tự như <code>tasks</code>; <code>reason</code> là <b>message</b> của lỗi (một chuỗi). <code>ok</code> và <code>failed</code> là số lượng.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const sleep = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));\n' +
            'const fail  = (ms, msg)   => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));\n\n' +
            'const TASKS = [\n' +
            "  () => sleep(120, 'user'),\n" +
            "  () => fail(60, 'db down'),\n" +
            "  () => sleep(100, 'notes'),\n" +
            "  () => sleep(300, 'slow report'),\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function withTimeout(promise, ms) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'async function runAll(tasks, timeoutMs) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const t0 = Date.now();\n' +
            'runAll(TASKS, 200).then((out) => {\n' +
            '  const ms = Date.now() - t0;\n' +
            '  console.log(JSON.stringify(out.results));\n' +
            "  console.log('ok=' + out.ok + ' failed=' + out.failed);\n" +
            "  console.log('parallel=' + (ms < 250));\n" +
            '});\n',
          expectedOutput:
            '[{"status":"ok","value":"user"},{"status":"error","reason":"db down"},{"status":"ok","value":"notes"},{"status":"error","reason":"TIMEOUT"}]\n' +
            'ok=2 failed=2\n' +
            'parallel=true',
          sampleSolution:
            'function withTimeout(promise, ms) {\n' +
            '  let timer;\n' +
            '  const timeout = new Promise((_, rej) => {\n' +
            "    timer = setTimeout(() => rej(new Error('TIMEOUT')), ms);\n" +
            '  });\n' +
            '  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));\n' +
            '}\n\n' +
            'async function runAll(tasks, timeoutMs) {\n' +
            '  // Gọi t() TRƯỚC rồi mới await — đó là chỗ quyết định song song hay tuần tự.\n' +
            '  const started = tasks.map((t) => withTimeout(t(), timeoutMs));\n' +
            '  const settled = await Promise.allSettled(started);\n' +
            '  const results = settled.map((r) =>\n' +
            "    r.status === 'fulfilled'\n" +
            "      ? { status: 'ok', value: r.value }\n" +
            "      : { status: 'error', reason: r.reason.message });\n" +
            '  return {\n' +
            '    results,\n' +
            "    ok: results.filter((r) => r.status === 'ok').length,\n" +
            "    failed: results.filter((r) => r.status === 'error').length,\n" +
            '  };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
