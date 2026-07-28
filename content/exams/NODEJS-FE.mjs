/**
 * Node.js — Final Exam (FE): 50 câu trắc nghiệm phủ cả 18 chương.
 *
 * Đề tự soạn, bám sát `content/courses/nodejs/s01…s18`. Có cả câu lý thuyết
 * lẫn câu đọc mã; mọi đoạn mã hỏi "in ra gì" đều đã CHẠY THẬT bằng `node` v22.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-FE.mjs --apply
 */
import { B, EX, code, sim, mcq } from './_lib/nodejs-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 18 chapters, from <code>var</code> in a loop to the deploy that lost 1,5% of requests. Some questions show code and ask what it prints; those outputs were produced by running the snippet, so read the code rather than the intuition.</p>' +
  '<p>A few questions say "choose TWO" — they only count as correct when both answers are selected. You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 18 chương, từ chuyện <code>var</code> trong vòng lặp tới lần deploy đánh mất 1,5% số request. Một số câu cho sẵn mã và hỏi nó in ra gì; những kết quả đó đều lấy từ việc chạy thật đoạn mã, nên hãy đọc mã thay vì đoán theo cảm tính.</p>' +
  '<p>Vài câu ghi "chọn HAI" — chỉ đúng khi chọn đủ cả hai đáp án. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-1',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Node.js course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Node.js (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all eighteen chapters: JavaScript and the runtime, core modules and npm, Express and REST, PostgreSQL, auth and security, uploads, realtime, Redis, queues, testing, observability, performance, Docker and architecture.',
        'Năm mươi câu trắc nghiệm phủ cả mười tám chương: JavaScript và runtime, module lõi và npm, Express và REST, PostgreSQL, xác thực và bảo mật, upload, realtime, Redis, hàng đợi, kiểm thử, quan sát hệ thống, hiệu năng, Docker và kiến trúc.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Chương 1 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const q = { page: '0', limit: '' };\n" +
              'console.log(JSON.stringify([q.limit ?? 20, q.limit || 20, Number(q.page ?? 1) || 1]));',
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const q = { page: '0', limit: '' };\n" +
              'console.log(JSON.stringify([q.limit ?? 20, q.limit || 20, Number(q.page ?? 1) || 1]));',
            ),
          ),
          options: [
            B('["",20,1]', '["",20,1]'),
            B('[20,20,1]', '[20,20,1]'),
            B('["","",0]', '["","",0]'),
            B('[20,20,0]', '[20,20,0]'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>??</code> only falls back on null/undefined, so an empty string passes through; <code>||</code> also replaces <code>&#x27;&#x27;</code> and <code>0</code>, which is why a legitimate <code>limit=0</code> silently becomes 20. The third value shows the standard clamp idiom: <code>Number(&#x27;0&#x27;)</code> is 0, which is falsy, so <code>|| 1</code> lifts it to 1.',
            'Đã chạy thật. <code>??</code> chỉ thay khi giá trị là null/undefined, nên chuỗi rỗng vẫn đi qua; còn <code>||</code> thay cả <code>&#x27;&#x27;</code> lẫn <code>0</code>, đó là lý do một tham số <code>limit=0</code> hợp lệ âm thầm biến thành 20. Giá trị thứ ba là mẫu kẹp giá trị quen thuộc: <code>Number(&#x27;0&#x27;)</code> là 0, mà 0 là falsy nên <code>|| 1</code> nâng nó lên 1.',
          ),
        }),

        mcq({
          prompt: B(
            'Which is true about copying <code>{ at: new Date(), tags: new Set([&#x27;a&#x27;]), n: undefined }</code>?',
            'Điều nào ĐÚNG khi sao chép <code>{ at: new Date(), tags: new Set([&#x27;a&#x27;]), n: undefined }</code>?',
          ),
          options: [
            B('<code>JSON.parse(JSON.stringify(x))</code> preserves all three fields', '<code>JSON.parse(JSON.stringify(x))</code> giữ nguyên cả ba trường'),
            B('The JSON round-trip turns Date into a string, empties the Set and drops <code>n</code>', 'Vòng JSON biến Date thành chuỗi, làm rỗng Set và đánh rơi <code>n</code>'),
            B('<code>structuredClone</code> and the JSON round-trip give identical results', '<code>structuredClone</code> và vòng JSON cho kết quả y hệt nhau'),
            B('Spread <code>{...x}</code> is a deep copy for these three types', 'Spread <code>{...x}</code> là bản sao sâu với ba kiểu này'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it: after the JSON round-trip <code>typeof at</code> is <code>&#x27;string&#x27;</code>, the Set becomes <code>{}</code> and <code>&#x27;n&#x27; in copy</code> is false. <code>structuredClone</code> keeps Date, Map and Set (and throws on functions). Spread copies one level only.',
            'Đã chạy thật: sau vòng JSON thì <code>typeof at</code> là <code>&#x27;string&#x27;</code>, Set thành <code>{}</code> và <code>&#x27;n&#x27; in copy</code> là false. <code>structuredClone</code> giữ được Date, Map và Set (và ném lỗi với hàm). Spread chỉ chép đúng một tầng.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about hoisting and the Temporal Dead Zone.',
            'Chọn HAI phát biểu ĐÚNG về hoisting và Vùng Chết Tạm Thời (TDZ).',
          ),
          options: [
            B('<code>var</code> is hoisted and pre-initialised to <code>undefined</code>', '<code>var</code> được hoisting và khởi tạo sẵn bằng <code>undefined</code>'),
            B('Touching a <code>let</code> before its declaration throws ReferenceError', 'Chạm vào một biến <code>let</code> trước dòng khai báo sẽ ném ReferenceError'),
            B('<code>let</code> and <code>const</code> are not hoisted at all', '<code>let</code> và <code>const</code> hoàn toàn không được hoisting'),
            B('<code>const</code> makes the value it points to immutable', '<code>const</code> làm cho giá trị nó trỏ tới trở nên bất biến'),
          ],
          correct: [0, 1],
          explanation: EX(
            '<code>let</code>/<code>const</code> ARE hoisted — they just stay in the TDZ until the declaration line runs, which is why the error is loud instead of a silent <code>undefined</code>. And <code>const</code> freezes the binding, not the value.',
            '<code>let</code>/<code>const</code> CÓ được hoisting — chỉ là chúng nằm trong TDZ cho tới khi chạy tới dòng khai báo, nhờ vậy lỗi nổ to thay vì im lặng trả <code>undefined</code>. Còn <code>const</code> khoá liên kết chứ không khoá giá trị.',
          ),
        }),

        // ── Chương 2 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print, in order?' + code(
              "async function f() { console.log('2'); await null; console.log('4'); }\n" +
              "console.log('1');\n" +
              'f();\n' +
              "Promise.resolve().then(() => console.log('5'));\n" +
              "console.log('3');",
            ),
            'Đoạn mã sau in ra gì, theo thứ tự nào?' + code(
              "async function f() { console.log('2'); await null; console.log('4'); }\n" +
              "console.log('1');\n" +
              'f();\n' +
              "Promise.resolve().then(() => console.log('5'));\n" +
              "console.log('3');",
            ),
          ),
          options: [
            B('1 2 3 4 5', '1 2 3 4 5'),
            B('1 2 3 5 4', '1 2 3 5 4'),
            B('1 3 2 4 5', '1 3 2 4 5'),
            B('1 2 4 3 5', '1 2 4 3 5'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. An async function body runs SYNCHRONOUSLY until the first <code>await</code> — so 2 prints before 3. The continuation after <code>await</code> is queued as a microtask before the <code>.then</code> that was registered afterwards, so 4 comes before 5.',
            'Đã chạy thật. Thân một hàm async chạy ĐỒNG BỘ cho tới <code>await</code> đầu tiên — nên 2 in trước 3. Phần tiếp sau <code>await</code> được xếp vào hàng microtask trước cái <code>.then</code> đăng ký sau đó, nên 4 ra trước 5.',
          ),
        }),

        mcq({
          prompt: B(
            'Which statement describes the division of labour inside Node correctly?',
            'Phát biểu nào mô tả ĐÚNG sự phân công bên trong Node?',
          ),
          options: [
            B('V8 provides the event loop; libuv compiles JavaScript', 'V8 cung cấp event loop; libuv biên dịch JavaScript'),
            B('V8 runs JavaScript and manages memory; libuv provides the event loop and async I/O', 'V8 chạy JavaScript và quản lý bộ nhớ; libuv cung cấp event loop và I/O bất đồng bộ'),
            B('Node is a framework built on top of Express', 'Node là một framework dựng trên nền Express'),
            B('libuv runs your JavaScript on four threads by default', 'libuv chạy JavaScript của bạn trên bốn luồng theo mặc định'),
          ],
          correct: 1,
          explanation: EX(
            'V8 knows nothing about files or networks; libuv is the C library that provides the loop, async file/network I/O and a small thread pool. "Single-threaded" means one thread runs YOUR JavaScript — Node itself uses several underneath.',
            'V8 không biết gì về file hay mạng; libuv là thư viện C cung cấp vòng lặp, I/O file/mạng bất đồng bộ và một thread pool nhỏ. "Đơn luồng" nghĩa là chỉ một luồng chạy JavaScript CỦA BẠN — bản thân Node vẫn dùng vài luồng bên dưới.',
          ),
        }),

        mcq({
          prompt: B(
            'You need to yield to the event loop in the middle of a long computation so pending I/O can run. Which do you use, and why not the others?',
            'Bạn cần nhường lượt cho event loop giữa một phép tính dài để I/O đang chờ được chạy. Dùng cái nào, và vì sao không dùng những cái kia?',
          ),
          options: [
            B('<code>process.nextTick</code> — highest priority, so it runs soonest', '<code>process.nextTick</code> — ưu tiên cao nhất nên chạy sớm nhất'),
            B('<code>setImmediate</code> — it politely waits its turn after the poll phase', '<code>setImmediate</code> — nó lịch sự chờ tới lượt, sau pha poll'),
            B('<code>queueMicrotask</code> — same queue as Promises', '<code>queueMicrotask</code> — cùng hàng đợi với Promise'),
            B('<code>setTimeout(fn, 0)</code> — guaranteed to run before I/O', '<code>setTimeout(fn, 0)</code> — bảo đảm chạy trước I/O'),
          ],
          correct: 1,
          explanation: EX(
            'nextTick and microtasks are drained COMPLETELY before the loop advances, so using them to "run sooner" starves the very I/O you are trying to serve — an unbounded nextTick recursion freezes the process at 100% CPU with no error. Chunking with setImmediate is the tool, and it is not free: the measured job went from 2871ms to 19580ms while lag dropped from 2873ms to 194ms.' +
              sim('nodejs-microtask', 'nodejs-2-3-microtask', 'Watch the queues drain'),
            'nextTick và microtask được vét SẠCH trước khi vòng lặp đi tiếp, nên dùng chúng để "chạy sớm hơn" là bỏ đói chính phần I/O bạn đang muốn phục vụ — một vòng đệ quy nextTick không có điểm dừng làm treo tiến trình ở 100% CPU mà không có lỗi nào. Cắt nhỏ bằng setImmediate mới là công cụ, và nó không miễn phí: công việc đo được đi từ 2871ms lên 19580ms trong khi độ trễ tụt từ 2873ms xuống 194ms.' +
              sim('nodejs-microtask', 'nodejs-2-3-microtask', 'Xem mô phỏng các hàng đợi'),
          ),
        }),

        // ── Chương 3 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const path = require('node:path');\n" +
              "console.log(path.join('/var/www', 'uploads', '..', 'a.png'));\n" +
              "console.log(path.extname('bao-cao.final.pdf'), path.basename('/tmp/anh/meo.jpg', '.jpg'));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const path = require('node:path');\n" +
              "console.log(path.join('/var/www', 'uploads', '..', 'a.png'));\n" +
              "console.log(path.extname('bao-cao.final.pdf'), path.basename('/tmp/anh/meo.jpg', '.jpg'));",
            ),
          ),
          options: [
            B('/var/www/uploads/../a.png then .final.pdf meo.jpg', '/var/www/uploads/../a.png rồi .final.pdf meo.jpg'),
            B('/var/www/a.png then .pdf meo', '/var/www/a.png rồi .pdf meo'),
            B('/var/www/uploads/a.png then .pdf meo.jpg', '/var/www/uploads/a.png rồi .pdf meo.jpg'),
            B('It throws because of the .. segment', 'Ném lỗi vì có đoạn ..'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>join</code> resolves <code>..</code> and collapses double slashes — useful, and exactly why <code>path.join(uploadDir, userFilename)</code> is a path-traversal hole: the same resolution walks OUT of your directory. <code>extname</code> takes the last extension only, and <code>basename</code> strips the suffix you name.',
            'Đã chạy thật. <code>join</code> xử lý <code>..</code> và gộp dấu gạch đôi — tiện, và cũng chính vì thế mà <code>path.join(uploadDir, tenFileNguoiDung)</code> là một lỗ path traversal: đúng phép xử lý ấy đi RA khỏi thư mục của bạn. <code>extname</code> chỉ lấy phần mở rộng cuối cùng, còn <code>basename</code> cắt đúng phần đuôi bạn chỉ định.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const { EventEmitter } = require('node:events');\n" +
              'const e = new EventEmitter();\n' +
              'const h = () => {};\n' +
              "e.on('x', h); e.once('x', () => {}); e.on('x', h);\n" +
              "console.log(e.listenerCount('x'));\n" +
              "e.emit('x');\n" +
              "console.log(e.listenerCount('x'));\n" +
              "e.off('x', h);\n" +
              "console.log(e.listenerCount('x'));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const { EventEmitter } = require('node:events');\n" +
              'const e = new EventEmitter();\n' +
              'const h = () => {};\n' +
              "e.on('x', h); e.once('x', () => {}); e.on('x', h);\n" +
              "console.log(e.listenerCount('x'));\n" +
              "e.emit('x');\n" +
              "console.log(e.listenerCount('x'));\n" +
              "e.off('x', h);\n" +
              "console.log(e.listenerCount('x'));",
            ),
          ),
          options: [
            B('3 then 2 then 1', '3 rồi 2 rồi 1'),
            B('3 then 3 then 2', '3 rồi 3 rồi 2'),
            B('2 then 2 then 0', '2 rồi 2 rồi 0'),
            B('3 then 2 then 0', '3 rồi 2 rồi 0'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The same function registered twice counts twice; <code>once</code> removes itself after firing (3 → 2); and <code>off</code> removes ONE registration of that exact reference (2 → 1). That last detail is why an inline arrow can never be removed — you no longer have the reference.',
            'Đã chạy thật. Cùng một hàm đăng ký hai lần thì đếm là hai; <code>once</code> tự gỡ sau khi nổ (3 → 2); và <code>off</code> gỡ MỘT lần đăng ký của đúng tham chiếu đó (2 → 1). Chi tiết cuối chính là lý do một arrow function viết thẳng tại chỗ không bao giờ gỡ được — bạn không còn giữ tham chiếu tới nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Counting lines in a 348MB file: <code>readFileSync</code> peaked at 395MB RAM in 3662ms; <code>createReadStream</code> peaked at 120MB in 2544ms. Which conclusion follows?',
            'Đếm số dòng trong file 348MB: <code>readFileSync</code> đỉnh 395MB RAM trong 3662ms; <code>createReadStream</code> đỉnh 120MB trong 2544ms. Kết luận nào ĐÚNG?',
          ),
          options: [
            B('Streaming trades speed for memory', 'Streaming đánh đổi tốc độ lấy bộ nhớ'),
            B('The stream used a third of the memory AND finished sooner', 'Stream dùng một phần ba bộ nhớ VÀ còn xong sớm hơn'),
            B('The difference disappears for any file under 2GB', 'Khác biệt biến mất với bất kỳ file nào dưới 2GB'),
            B('readFileSync is fine as long as the server has enough RAM', 'readFileSync vẫn ổn miễn máy chủ đủ RAM'),
          ],
          correct: 1,
          explanation: EX(
            'Ten users uploading that file at once needs ~3,5GB buffered and an OOM kill, versus flat memory streamed — and a single Buffer cannot exceed roughly 2GB anyway. Always use <code>pipeline</code>, never <code>a.pipe(b).pipe(c)</code>: <code>pipe</code> forwards no errors and leaks a file descriptor per failure.' +
              sim('nodejs-stream', 'nodejs-3-3-stream', 'Watch buffering vs streaming'),
            'Mười người cùng tải file đó lên thì cần ~3,5GB nếu đệm hết vào RAM và bị OOM giết, còn streaming thì bộ nhớ phẳng lì — mà dù sao một Buffer đơn cũng không vượt quá khoảng 2GB. Luôn dùng <code>pipeline</code>, đừng dùng <code>a.pipe(b).pipe(c)</code>: <code>pipe</code> không chuyển tiếp lỗi và mỗi lần hỏng là rò một file descriptor.' +
              sim('nodejs-stream', 'nodejs-3-3-stream', 'Xem mô phỏng nạp hết vs streaming'),
          ),
        }),

        // ── Chương 4 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Why must <code>package-lock.json</code> be committed for an application?',
            'Vì sao một ứng dụng BẮT BUỘC phải commit <code>package-lock.json</code>?',
          ),
          options: [
            B('It makes <code>npm install</code> noticeably faster', 'Nó làm <code>npm install</code> nhanh hơn thấy rõ'),
            B('It pins the exact version of every package, including transitive ones', 'Nó ghim phiên bản chính xác của mọi gói, kể cả gói của gói'),
            B('npm refuses to publish without it', 'npm từ chối xuất bản nếu thiếu nó'),
            B('It replaces the dependency list in package.json', 'Nó thay thế danh sách phụ thuộc trong package.json'),
          ],
          correct: 1,
          explanation: EX(
            'package.json says nothing about your dependencies\' dependencies — without the lockfile "install the same thing" is unenforceable, which is the whole mechanism behind "works on my machine" (one machine got 4.18.0, another 4.22.2, nobody edited anything). Libraries are the exception: they do not ship one, because the consuming app decides the tree.',
            'package.json không nói gì về phụ thuộc của phụ thuộc — thiếu lockfile thì "cài đúng cái đó" là điều không cưỡng chế được, và đó chính là cơ chế đằng sau câu "máy tôi chạy được" (một máy nhận 4.18.0, máy kia 4.22.2, chẳng ai sửa gì cả). Thư viện là ngoại lệ: chúng không kèm lockfile, vì ứng dụng dùng nó mới là bên quyết định cây phụ thuộc.',
          ),
        }),

        mcq({
          prompt: B(
            'Installing <code>express@4</code> alone put 67 packages and 3,9MB into <code>node_modules</code>, and <code>npm audit</code> reported 7 vulnerabilities including 3 high — none of them in code you wrote. What follows?',
            'Chỉ cài mỗi <code>express@4</code> đã kéo 67 gói và 3,9MB vào <code>node_modules</code>, và <code>npm audit</code> báo 7 lỗ hổng trong đó 3 mức cao — không lỗ nào nằm ở mã bạn viết. Suy ra điều gì?',
          ),
          options: [
            B('Pinning gives reproducibility, not immunity — you must also update on a schedule', 'Ghim phiên bản cho bạn tính tái lập, không cho bạn miễn nhiễm — vẫn phải cập nhật theo lịch'),
            B('Express should be replaced with the core http module', 'Nên thay Express bằng module http lõi'),
            B('<code>npm audit fix --force</code> is the correct response', '<code>npm audit fix --force</code> là cách xử lý đúng'),
            B('Vulnerabilities in transitive dependencies cannot affect you', 'Lỗ hổng ở gói của gói thì không ảnh hưởng tới bạn'),
          ],
          correct: 0,
          explanation: EX(
            'A pinned tree left alone for two years is a museum of known vulnerabilities. <code>audit fix --force</code> can install a major version and break your app — read what it wants to change first. And the riskiest moment is not choosing a package but the update months later: historically the damaging npm incidents were popular packages whose maintainer account was compromised.',
            'Một cây phụ thuộc đã ghim mà bỏ mặc hai năm là một bảo tàng lỗ hổng đã biết. <code>audit fix --force</code> có thể cài luôn bản lớn và làm hỏng ứng dụng — hãy đọc xem nó định đổi gì trước đã. Và khoảnh khắc rủi ro nhất không phải lúc chọn gói mà là lần cập nhật vài tháng sau: trong lịch sử, các sự cố npm gây hại đều là gói phổ biến bị chiếm tài khoản người bảo trì.',
          ),
        }),

        // ── Chương 5 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'The default body limit of <code>express.json()</code> is 100kb. A team raises it to <code>&#x27;50mb&#x27;</code> "so uploads work". What is wrong with that?',
            'Giới hạn thân request mặc định của <code>express.json()</code> là 100kb. Một nhóm nâng nó lên <code>&#x27;50mb&#x27;</code> "cho upload chạy được". Sai ở đâu?',
          ),
          options: [
            B('Nothing — the limit exists only for very old clients', 'Không sai — giới hạn đó chỉ để phục vụ client rất cũ'),
            B('Every route can now buffer 50MB of RAM before anyone is authenticated', 'Giờ mọi route đều có thể đệm 50MB RAM trước khi ai đó kịp được xác thực'),
            B('Express caps the body at 10mb regardless', 'Express vẫn chặn thân request ở 10mb bất kể cấu hình'),
            B('It only affects urlencoded bodies, never JSON ones', 'Nó chỉ ảnh hưởng thân dạng urlencoded, không ảnh hưởng JSON'),
          ],
          correct: 1,
          explanation: EX(
            'Measured in chapter 9: an 11,3MB JSON body cost the server +139MB of RSS — roughly 12× the body, because the raw buffer, the decoded string and the parsed object tree all exist at once. Mount a small global limit and a larger parser only on the route that needs it.',
            'Chương 9 đã đo: một thân JSON 11,3MB làm máy chủ tốn thêm 139MB RSS — khoảng 12 lần kích thước thân, vì buffer thô, chuỗi đã giải mã và cây object đã phân tích cùng tồn tại một lúc. Hãy đặt giới hạn nhỏ ở phạm vi toàn cục và chỉ gắn parser lớn cho đúng route cần tới nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A frontend calls <code>await r.json()</code> on a response from <code>res.send(&#x27;xin chao&#x27;)</code> and it throws. Why?',
            'Frontend gọi <code>await r.json()</code> trên phản hồi từ <code>res.send(&#x27;xin chao&#x27;)</code> và nó ném lỗi. Vì sao?',
          ),
          options: [
            B('<code>res.send</code> guesses the type: a string becomes <code>text/html</code>', '<code>res.send</code> tự đoán kiểu: chuỗi thì thành <code>text/html</code>'),
            B('<code>res.send</code> does not set Content-Length', '<code>res.send</code> không đặt Content-Length'),
            B('The response was compressed and must be decoded first', 'Phản hồi bị nén nên phải giải nén trước'),
            B('<code>res.send</code> is deprecated in Express 5', '<code>res.send</code> đã bị loại bỏ trong Express 5'),
          ],
          correct: 0,
          explanation: EX(
            '<code>res.send</code> types by argument: string → text/html, object → JSON, Buffer → octet-stream. For an API use <code>res.json()</code> everywhere and stop thinking about it. Related pairs worth knowing: <code>res.status(n)</code> only sets the code, <code>res.sendStatus(n)</code> sets AND sends, and 204 must be <code>res.status(204).end()</code> because a body with "no content" is a contradiction.',
            '<code>res.send</code> đoán kiểu theo tham số: chuỗi → text/html, object → JSON, Buffer → octet-stream. Với một API thì hãy dùng <code>res.json()</code> ở mọi nơi rồi khỏi phải nghĩ nữa. Vài cặp đáng nhớ đi kèm: <code>res.status(n)</code> chỉ đặt mã, <code>res.sendStatus(n)</code> vừa đặt vừa gửi, và 204 phải là <code>res.status(204).end()</code> vì một thân phản hồi mang nghĩa "không có nội dung" là chuyện tự mâu thuẫn.',
          ),
        }),

        mcq({
          prompt: B(
            'After a "tidy-up" commit that moved two lines, EVERY endpoint suddenly returns 404 — including ones nobody touched. What is the most likely cause?',
            'Sau một commit "dọn dẹp" chỉ dời hai dòng, MỌI endpoint bỗng trả 404 — kể cả những endpoint không ai đụng tới. Nguyên nhân khả dĩ nhất?',
          ),
          options: [
            B('The JSON 404 handler was moved ABOVE the routers', 'Handler 404 JSON bị dời LÊN TRÊN các router'),
            B('The error handler lost its fourth parameter', 'Error handler mất tham số thứ tư'),
            B('express.json() was registered twice', 'express.json() bị đăng ký hai lần'),
            B('The router was mounted with a trailing slash', 'Router bị gắn kèm dấu gạch chéo ở cuối'),
          ],
          correct: 0,
          explanation: EX(
            'In Express, order IS the program: the stack is walked top to bottom and the first match wins. The 404 must sit AFTER every route and the error handler LAST. The symptom — everything 404s, including untouched endpoints — sends people hunting in completely the wrong place.' +
              sim('nodejs-middleware', 'nodejs-5-3-middleware', 'Watch the chain'),
            'Trong Express, THỨ TỰ chính là chương trình: ngăn xếp được duyệt từ trên xuống và ai khớp trước thì thắng. Lệnh 404 phải nằm SAU mọi route và error handler thì đứng CUỐI. Triệu chứng — mọi thứ đều 404, kể cả endpoint không ai đụng — khiến người ta đi tìm ở chỗ hoàn toàn sai.' +
              sim('nodejs-middleware', 'nodejs-5-3-middleware', 'Xem mô phỏng dây chuyền middleware'),
          ),
        }),

        // ── Chương 6 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which response is correctly formed?',
            'Phản hồi nào được dựng ĐÚNG?',
          ),
          options: [
            B('<code>res.status(204).json({ ok: true })</code>', '<code>res.status(204).json({ ok: true })</code>'),
            B('<code>res.status(201).location(&#x27;/api/v1/notes/1&#x27;).json(note)</code>', '<code>res.status(201).location(&#x27;/api/v1/notes/1&#x27;).json(note)</code>'),
            B('<code>res.status(200).json({ success: false, error: &#x27;not found&#x27; })</code>', '<code>res.status(200).json({ success: false, error: &#x27;not found&#x27; })</code>'),
            B('<code>res.status(500).json({ error: err.message })</code>', '<code>res.status(500).json({ error: err.message })</code>'),
          ],
          correct: 1,
          explanation: EX(
            '201 returns the created resource (the client needs the server-generated id) plus a Location header. 204 means the body MUST be empty. A 200 carrying <code>success:false</code> defeats every HTTP-aware layer: monitoring sees zero errors, retries never trigger, caches store the failure. And echoing <code>err.message</code> on a 500 leaks table names, file paths and query fragments — log it, do not send it.',
            '201 trả về tài nguyên vừa tạo (client cần id do máy chủ sinh) kèm header Location. 204 nghĩa là thân phản hồi BẮT BUỘC rỗng. Một mã 200 mang <code>success:false</code> vô hiệu hoá mọi tầng hiểu HTTP: giám sát thấy 0 lỗi, cơ chế thử lại không bao giờ kích hoạt, cache lưu luôn cái lỗi. Còn dội <code>err.message</code> ra trong mã 500 là làm lộ tên bảng, đường dẫn file và mảnh câu truy vấn — hãy ghi log, đừng gửi đi.',
          ),
        }),

        mcq({
          prompt: B(
            'Two people open the same note and both save a full object. A\'s title change disappears with no error anywhere. What actually fixes this?',
            'Hai người cùng mở một ghi chú và cùng lưu cả object. Thay đổi tiêu đề của A biến mất mà chẳng có lỗi nào. Cái gì THẬT SỰ sửa được chuyện này?',
          ),
          options: [
            B('Use PATCH instead of PUT', 'Dùng PATCH thay cho PUT'),
            B('Optimistic concurrency: ETag + If-Match, or a version column', 'Điều khiển đồng thời lạc quan: ETag + If-Match, hoặc một cột version'),
            B('Lock the row for as long as the human is editing it', 'Khoá dòng dữ liệu suốt thời gian con người còn đang sửa'),
            B('Return 409 on every concurrent request', 'Trả 409 cho mọi request đồng thời'),
          ],
          correct: 1,
          explanation: EX(
            'PATCH reduces the damage but does not fix it — two people editing the SAME field still overwrite each other silently. Pessimistic locking means one forgotten browser tab blocks the note for everyone. The version column and the ETag are the same mechanism at two layers: server side and wire format.' +
              sim('nodejs-contract', 'nodejs-6-5-hop-dong-api', 'Watch ETag / If-Match'),
            'PATCH giảm bớt thiệt hại chứ không sửa được — hai người cùng sửa MỘT trường vẫn ghi đè nhau trong im lặng. Khoá bi quan thì một tab trình duyệt bị bỏ quên là cả ghi chú đứng hình với mọi người. Cột version và ETag là cùng một cơ chế ở hai tầng: phía máy chủ và định dạng trên đường truyền.' +
              sim('nodejs-contract', 'nodejs-6-5-hop-dong-api', 'Xem mô phỏng ETag / If-Match'),
          ),
        }),

        mcq({
          prompt: B(
            'A payment endpoint requires an <code>Idempotency-Key</code>. The client retries with the same key. What must the server return?',
            'Một endpoint thanh toán bắt buộc có <code>Idempotency-Key</code>. Client thử lại với đúng khoá đó. Máy chủ phải trả về gì?',
          ),
          options: [
            B('409 Conflict, so the client learns it already sent this', '409 Conflict, để client biết rằng nó đã gửi cái này rồi'),
            B('The SAME stored response body and status code as the first call', 'ĐÚNG thân phản hồi và mã trạng thái đã lưu của lần gọi đầu'),
            B('A new payment, since the key only prevents fraud', 'Một giao dịch mới, vì khoá đó chỉ để chống gian lận'),
            B('204 No Content', '204 No Content'),
          ],
          correct: 1,
          explanation: EX(
            'Save the RESPONSE, not just the key. Two more rules: the client generates one key per user intent — at the moment the button is pressed, not inside the retry loop, which would produce a fresh key per attempt and defeat the mechanism; and store it where it survives (a table or a Redis key with a TTL), because an in-memory map is per-process and the retry can land on the container that has never seen the key.',
            'Hãy lưu cả PHẢN HỒI chứ không chỉ lưu khoá. Thêm hai quy tắc: client sinh một khoá cho mỗi ý định của người dùng — ngay lúc bấm nút, không phải bên trong vòng thử lại, vì làm thế mỗi lần thử lại sinh khoá mới và phá tan cơ chế; và lưu nó ở chỗ sống sót được (một bảng hoặc một khoá Redis có TTL), vì một map trong bộ nhớ chỉ thuộc về một tiến trình và lần thử lại có thể rơi vào container chưa từng thấy khoá đó.',
          ),
        }),

        // ── Chương 7 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'What SQL does <code>prisma.user.findMany({ include: { notes: true } })</code> actually send?',
            '<code>prisma.user.findMany({ include: { notes: true } })</code> thực sự gửi đi câu SQL nào?',
          ),
          options: [
            B('One single query using a LEFT JOIN', 'Một câu truy vấn duy nhất dùng LEFT JOIN'),
            B('Two queries — the second one is <code>WHERE authorId IN (…)</code>', 'Hai câu truy vấn — câu thứ hai là <code>WHERE authorId IN (…)</code>'),
            B('One query per parent row', 'Mỗi dòng cha một câu truy vấn'),
            B('A single query using a lateral subquery', 'Một câu truy vấn duy nhất dùng lateral subquery'),
          ],
          correct: 1,
          explanation: EX(
            'That <code>IN</code> is the whole trick — two round trips instead of fifty-one. It is also a deliberate trade: a JOIN duplicates the parent row once per child (a user with 20 notes comes back 20 times over the wire) while two queries send each row once. On list endpoints reach for <code>select</code> or <code>omit</code>: the same 50 users and 1000 notes were 322,1KB with every column and 50,1KB with four.',
            'Chữ <code>IN</code> đó chính là toàn bộ mẹo — hai vòng đi-về thay vì năm mươi mốt. Đó cũng là một đánh đổi có chủ ý: JOIN nhân bản dòng cha theo số dòng con (một người dùng có 20 ghi chú sẽ về 20 lần trên đường truyền), còn hai câu truy vấn thì mỗi dòng chỉ gửi một lần. Với endpoint danh sách hãy dùng <code>select</code> hoặc <code>omit</code>: cũng 50 người dùng và 1000 ghi chú ấy, lấy đủ cột là 322,1KB, lấy bốn cột là 50,1KB.',
          ),
        }),

        mcq({
          prompt: B(
            'Inside <code>prisma.$transaction(async (tx) =&gt; { … })</code>, a developer writes <code>await prisma.note.create(…)</code> instead of <code>tx.note.create(…)</code>. What happens?',
            'Bên trong <code>prisma.$transaction(async (tx) =&gt; { … })</code>, lập trình viên viết <code>await prisma.note.create(…)</code> thay vì <code>tx.note.create(…)</code>. Chuyện gì xảy ra?',
          ),
          options: [
            B('Prisma throws "query outside transaction"', 'Prisma ném lỗi "query outside transaction"'),
            B('A silent bug: that query commits on its own connection', 'Một lỗi im lặng: câu đó commit trên kết nối riêng của nó'),
            B('Nothing — <code>prisma</code> and <code>tx</code> are the same client', 'Không sao — <code>prisma</code> và <code>tx</code> là cùng một client'),
            B('The transaction is upgraded to SERIALIZABLE', 'Transaction được nâng lên mức SERIALIZABLE'),
          ],
          correct: 1,
          explanation: EX(
            'No error, no warning — searching for <code>prisma.</code> inside a <code>$transaction</code> callback is one of the highest-value greps you can run. And keep transactions short: they hold a pool slot, a PostgreSQL backend and their locks the whole time, and an interactive one times out after 5 seconds with P2028. Do the HTTP call first, then open the transaction around the writes only.',
            'Không lỗi, không cảnh báo — tìm chuỗi <code>prisma.</code> bên trong callback của <code>$transaction</code> là một trong những lần grep đáng giá nhất bạn có thể chạy. Và hãy giữ transaction ngắn: nó chiếm một slot pool, một tiến trình nền PostgreSQL cùng toàn bộ khoá suốt thời gian đó, còn transaction tương tác thì quá 5 giây là hết hạn với mã P2028. Hãy gọi HTTP trước, rồi mới mở transaction bao quanh đúng phần ghi dữ liệu.',
          ),
        }),

        mcq({
          prompt: B(
            'With <code>evil = "bulk-1&#x27; OR &#x27;1&#x27;=&#x27;1"</code>, one of these returned all 751.002 rows and the other two returned 0. Which one leaked, and why?' + code(
              'A: prisma.$queryRawUnsafe(`SELECT count(*) FROM "Note" WHERE slug = \'${evil}\'`)\n' +
              'B: prisma.$queryRaw`SELECT count(*) FROM "Note" WHERE slug = ${evil}`\n' +
              'C: prisma.note.count({ where: { slug: evil } })',
            ),
            'Với <code>evil = "bulk-1&#x27; OR &#x27;1&#x27;=&#x27;1"</code>, một trong ba cách sau trả về đủ 751.002 dòng còn hai cách kia trả 0. Cách nào bị rò, và vì sao?' + code(
              'A: prisma.$queryRawUnsafe(`SELECT count(*) FROM "Note" WHERE slug = \'${evil}\'`)\n' +
              'B: prisma.$queryRaw`SELECT count(*) FROM "Note" WHERE slug = ${evil}`\n' +
              'C: prisma.note.count({ where: { slug: evil } })',
            ),
          ),
          options: [
            B('A — the value is concatenated into the SQL text; B and C bind it as a parameter', 'A — giá trị bị nối thẳng vào chuỗi SQL; B và C truyền nó dưới dạng tham số'),
            B('B — a tagged template still interpolates before sending', 'B — tagged template vẫn nội suy trước khi gửi đi'),
            B('C — Prisma escapes only strings it recognises', 'C — Prisma chỉ thoát ký tự cho những chuỗi mà nó nhận ra'),
            B('All three leak; only a prepared statement is safe', 'Cả ba đều rò; chỉ prepared statement mới an toàn'),
          ],
          correct: 0,
          explanation: EX(
            'The quote closed the string, <code>OR &#x27;1&#x27;=&#x27;1&#x27;</code> made the condition always true, and the database did exactly what it was told. Nothing about A looks alarming in a diff — it is a template literal, the same thing you write a hundred times a day. Rule: values never go into SQL text. <code>$queryRawUnsafe</code> is named that way for a reason.',
            'Dấu nháy đã đóng chuỗi lại, <code>OR &#x27;1&#x27;=&#x27;1&#x27;</code> làm điều kiện luôn đúng, và cơ sở dữ liệu làm đúng những gì được bảo. Nhìn vào diff thì A chẳng có gì đáng báo động — nó là một template literal, thứ bạn viết cả trăm lần mỗi ngày. Nguyên tắc: giá trị không bao giờ được đi vào phần chữ của câu SQL. <code>$queryRawUnsafe</code> mang chữ "unsafe" trong tên là có lý do.',
          ),
        }),

        // ── Chương 8 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Choose TWO correct statements about mounting auth middleware.',
            'Chọn HAI phát biểu ĐÚNG về việc gắn middleware xác thực.',
          ),
          options: [
            B('<code>router.use(requireAuth)</code> only protects routes declared AFTER it', '<code>router.use(requireAuth)</code> chỉ bảo vệ những route khai báo SAU nó'),
            B('<code>requireAuth</code> must run before <code>requireRole</code>, which reads <code>req.user</code>', '<code>requireAuth</code> phải chạy trước <code>requireRole</code>, vì middleware này đọc <code>req.user</code>'),
            B('Express warns at startup if a route has no auth middleware', 'Express cảnh báo lúc khởi động nếu một route không có middleware xác thực'),
            B('Protecting per route is safer than protecting at the router level', 'Bảo vệ theo từng route thì an toàn hơn bảo vệ ở cấp router'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Put the guard at the TOP of the router and let individual routes opt out — the failure mode of forgetting is then a locked door rather than an open one. Reversing the two middlewares makes every request 403, including the admin\'s, and the message sends you hunting in the wrong place. Nothing warns you about either mistake.',
            'Hãy đặt lá chắn ở ĐẦU router rồi cho từng route tự xin miễn — như vậy hậu quả của việc quên là một cánh cửa khoá chứ không phải một cánh cửa mở toang. Đảo thứ tự hai middleware thì mọi request đều 403, kể cả của admin, và thông báo lỗi sẽ dắt bạn đi tìm sai chỗ. Chẳng có gì cảnh báo bạn về cả hai lỗi đó.',
          ),
        }),

        mcq({
          prompt: B(
            'Bình is logged in and requests note 1, which belongs to An. Why does the API answer 404 rather than 403?',
            'Bình đã đăng nhập và yêu cầu ghi chú số 1 của An. Vì sao API trả 404 chứ không phải 403?',
          ),
          options: [
            B('403 confirms the note exists, so id enumeration maps the database', '403 xác nhận ghi chú đó tồn tại, nên quét id là vẽ được bản đồ dữ liệu'),
            B('403 is only for admin routes', '403 chỉ dành cho route quản trị'),
            B('404 is faster because no permission check runs', '404 nhanh hơn vì không phải chạy phép kiểm quyền'),
            B('Express cannot send 403 from a service layer', 'Express không gửi được 403 từ tầng service'),
          ],
          correct: 0,
          explanation: EX(
            'Use 403 when the user already knows the resource exists — a team workspace they can see but not edit. Use 404 when knowing it exists is itself information they should not have, which is almost always true for a private per-user resource. The rule lives in ONE function (<code>canTouch</code>) that <code>update</code> and <code>remove</code> both route through, so the day the rule changes there is one line to edit.',
            'Dùng 403 khi người dùng vốn đã biết tài nguyên đó tồn tại — ví dụ một không gian làm việc của nhóm mà họ thấy được nhưng không sửa được. Dùng 404 khi việc biết nó tồn tại tự nó đã là thông tin họ không nên có, mà với tài nguyên riêng tư của từng người thì gần như luôn là vậy. Quy tắc ấy nằm trong MỘT hàm (<code>canTouch</code>) mà cả <code>update</code> lẫn <code>remove</code> đều đi qua, nên ngày quy tắc đổi thì chỉ có một dòng phải sửa.',
          ),
        }),

        mcq({
          prompt: B(
            'A user clicks "log out all other devices". The server bumps <code>tokenVersion</code> and revokes the refresh sessions in one transaction — and the user is thrown to the login screen. What is missing?',
            'Người dùng bấm "đăng xuất mọi thiết bị khác". Máy chủ tăng <code>tokenVersion</code> và thu hồi các phiên refresh trong cùng một transaction — rồi chính người đó bị đá về màn hình đăng nhập. Thiếu cái gì?',
          ),
          options: [
            B('The handler must issue a FRESH token pair for the caller and return it', 'Handler phải cấp một cặp token MỚI cho chính người gọi và trả về'),
            B('The transaction should have been two separate statements', 'Đáng lẽ transaction đó nên tách thành hai lệnh riêng'),
            B('<code>tokenVersion</code> should be stored in the token, not in the database', '<code>tokenVersion</code> nên lưu trong token chứ không lưu trong cơ sở dữ liệu'),
            B('Access tokens should be revoked individually via a blocklist', 'Access token nên được thu hồi từng cái qua danh sách chặn'),
          ],
          correct: 0,
          explanation: EX(
            'Technically correct — the caller\'s token carries the old <code>tv</code> too — and a terrible experience that every first implementation ships. The transaction is right: revoking refresh tokens without bumping the version leaves access tokens alive, and bumping without revoking lets a refresh mint a new pair. This is also the mechanism behind "changing your password logs you out everywhere".',
            'Về mặt kỹ thuật thì đúng — token của chính người gọi cũng mang giá trị <code>tv</code> cũ — nhưng là một trải nghiệm tệ mà bản cài đặt đầu tiên nào cũng mắc. Phần transaction thì làm đúng: thu hồi refresh token mà không tăng version thì access token vẫn sống, còn tăng version mà không thu hồi thì một lần refresh lại đúc ra cặp token mới. Đây cũng là cơ chế đằng sau chuyện "đổi mật khẩu là đăng xuất khỏi mọi nơi".',
          ),
        }),

        // ── Chương 9 ────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which CSP directive decides whether stolen data can be sent OUT of the page?',
            'Chỉ thị CSP nào quyết định dữ liệu ăn cắp được có gửi RA khỏi trang hay không?',
          ),
          options: [
            B('<code>script-src</code>', '<code>script-src</code>'),
            B('<code>connect-src</code>', '<code>connect-src</code>'),
            B('<code>frame-ancestors</code>', '<code>frame-ancestors</code>'),
            B('<code>referrer-policy</code>', '<code>referrer-policy</code>'),
          ],
          correct: 1,
          explanation: EX(
            '<code>script-src</code> decides whether an injected script RUNS; <code>connect-src</code> decides where fetch/XHR/WebSocket may GO. <code>frame-ancestors</code> is the modern anti-clickjacking replacement for X-Frame-Options. Be honest about the limits: a Next.js app usually needs <code>&#x27;unsafe-inline&#x27;</code> for hydration, so CSP here is a second line of defence rather than a shield.',
            '<code>script-src</code> quyết định một script bị chèn có CHẠY hay không; <code>connect-src</code> quyết định fetch/XHR/WebSocket được ĐI tới đâu. <code>frame-ancestors</code> là bản thay thế hiện đại của X-Frame-Options để chống clickjacking. Cũng cần sòng phẳng về giới hạn: một app Next.js thường phải bật <code>&#x27;unsafe-inline&#x27;</code> cho phần hydrate, nên CSP ở đây là tuyến phòng thủ thứ hai chứ không phải một tấm khiên.',
          ),
        }),

        mcq({
          prompt: B(
            'A deep-merge helper merges <code>JSON.parse(&#x27;{"__proto__":{"isAdmin":true}}&#x27;)</code> into an object. Afterwards <code>({}).isAdmin</code> is <code>true</code> for every plain object in the process. What stops this?',
            'Một hàm trộn sâu đem <code>JSON.parse(&#x27;{"__proto__":{"isAdmin":true}}&#x27;)</code> trộn vào một object. Sau đó <code>({}).isAdmin</code> bằng <code>true</code> với mọi object thường trong tiến trình. Cái gì chặn được?',
          ),
          options: [
            B('Validating with a zod <code>.object()</code>, which drops unknown keys before the merge', 'Kiểm bằng <code>.object()</code> của zod, nó loại bỏ khoá lạ trước khi trộn'),
            B('Calling <code>Object.freeze</code> on the result', 'Gọi <code>Object.freeze</code> lên kết quả'),
            B('Using <code>JSON.parse</code> with a reviver that lowercases keys', 'Dùng <code>JSON.parse</code> với hàm reviver đổi khoá thành chữ thường'),
            B('Nothing — Express already blocks <code>__proto__</code> in bodies', 'Không cần gì — Express đã chặn <code>__proto__</code> trong thân request'),
          ],
          correct: 0,
          explanation: EX(
            'What makes prototype pollution different from an ordinary bug is that it is not scoped to the request that caused it — every plain object in the process answers true until restart. Three defences in order: a schema that drops unknown keys, explicitly skipping <code>__proto__</code>/<code>constructor</code>/<code>prototype</code> in any recursive copy, and structures with no prototype (<code>Object.create(null)</code>, <code>Map</code>) for user-controlled key/value data. Note Express\'s own query parsers do NOT pollute — the hole is in the helper you wrote afterwards.',
            'Điều khiến ô nhiễm nguyên mẫu khác một lỗi thường là nó không bị giới hạn trong cái request gây ra nó — mọi object thường trong tiến trình đều trả về true cho tới khi khởi động lại. Ba lớp phòng vệ theo thứ tự: một lược đồ loại bỏ khoá lạ, chủ động bỏ qua <code>__proto__</code>/<code>constructor</code>/<code>prototype</code> trong mọi phép sao chép đệ quy, và dùng cấu trúc không có nguyên mẫu (<code>Object.create(null)</code>, <code>Map</code>) cho dữ liệu khoá/giá trị do người dùng điều khiển. Lưu ý bộ phân tích query của chính Express KHÔNG gây ô nhiễm — lỗ hổng nằm ở hàm bạn viết sau đó.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO things that are NOT sufficient defences against SSRF in a "fetch this URL" feature.',
            'Chọn HAI thứ KHÔNG đủ để chống SSRF trong tính năng "lấy nội dung từ URL này".',
          ),
          options: [
            B('A regex on the URL string', 'Một biểu thức chính quy chạy trên chuỗi URL'),
            B('An allow-list of hostnames, on its own', 'Một danh sách trắng tên miền, dùng đơn độc'),
            B('Refusing to take a URL at all — take an identifier and build the URL server-side', 'Không nhận URL nữa — nhận một mã định danh rồi tự dựng URL ở phía máy chủ'),
            B('Following redirects manually and re-validating every hop', 'Tự đi theo chuyển hướng và kiểm lại từng chặng'),
          ],
          correct: [0, 1],
          explanation: EX(
            '<code>http://127.1</code>, <code>http://[::1]</code>, <code>http://2130706433</code> and <code>http://localhost.evil.example</code> all reach loopback and defeat naive string checks — parse with <code>new URL()</code> instead. And a hostname allow-list is necessary, not sufficient: <code>fetch</code> follows redirects by default, so an allowed host answering 302 to an internal address leaks it anyway.' +
              sim('nodejs-input-attacks', 'nodejs-9-3-dau-vao-doc-hai', 'Watch input attacks'),
            '<code>http://127.1</code>, <code>http://[::1]</code>, <code>http://2130706433</code> và <code>http://localhost.evil.example</code> đều về loopback và vượt qua mọi phép kiểm chuỗi ngây thơ — hãy phân tích bằng <code>new URL()</code>. Còn danh sách trắng tên miền là cần chứ không đủ: <code>fetch</code> mặc định đi theo chuyển hướng, nên một host hợp lệ trả 302 sang địa chỉ nội bộ vẫn làm rò như thường.' +
              sim('nodejs-input-attacks', 'nodejs-9-3-dau-vao-doc-hai', 'Xem mô phỏng tấn công đầu vào'),
          ),
        }),

        // ── Chương 10 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'A client sends a 6,85MB photo as base64 inside a JSON body. What does that cost compared with multipart?',
            'Client gửi một tấm ảnh 6,85MB dưới dạng base64 trong thân JSON. So với multipart thì tốn thêm bao nhiêu?',
          ),
          options: [
            B('+33% on the wire (arithmetic, not implementation) and ~6,9× the file in server RAM', 'Tăng 33% trên đường truyền (do số học chứ không phải do cài đặt) và ngốn RAM máy chủ khoảng 6,9 lần kích thước file'),
            B('The same bytes; base64 only changes the encoding', 'Vẫn từng ấy byte; base64 chỉ đổi cách mã hoá'),
            B('+33% on the wire but LESS memory, since there is no multipart parser', 'Tăng 33% trên đường truyền nhưng TỐN ÍT bộ nhớ hơn, vì không phải chạy bộ phân tích multipart'),
            B('It is cheaper for files under 10MB', 'Với file dưới 10MB thì cách này rẻ hơn'),
          ],
          correct: 0,
          explanation: EX(
            'Base64 turns every 3 bytes into 4 characters — exactly one third more. The RAM cost is the JSON string, express.json\'s own concatenation buffer, the decoded Buffer and uncollected garbage all at once. Multipart\'s envelope, by contrast, was 199 bytes regardless of file size.',
            'Base64 biến mỗi 3 byte thành 4 ký tự — nhiều hơn đúng một phần ba. Chi phí RAM là chuỗi JSON, buffer nối chuỗi của chính express.json, Buffer đã giải mã và phần rác chưa kịp dọn, tất cả cùng một lúc. Trong khi đó phần bao bì của multipart chỉ tốn 199 byte, bất kể file to nhỏ thế nào.',
          ),
        }),

        mcq({
          prompt: B(
            'An object key looks like <code>images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</code>. Why is the original filename deliberately absent, and what does the random suffix buy?',
            'Một key object có dạng <code>images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</code>. Vì sao tên file gốc bị cố tình bỏ đi, và phần hậu tố ngẫu nhiên mua được gì?',
          ),
          options: [
            B('User filenames carry <code>../</code> and emoji; random makes keys unguessable', 'Tên file người dùng mang theo <code>../</code> và emoji; phần ngẫu nhiên làm key không đoán được'),
            B('S3 forbids non-ASCII characters in keys', 'S3 cấm ký tự không phải ASCII trong key'),
            B('The random part is what makes the object immutable', 'Phần ngẫu nhiên là thứ làm object trở nên bất biến'),
            B('It saves storage cost, because shorter keys are billed less', 'Nó tiết kiệm chi phí lưu trữ, vì key ngắn thì tính tiền ít hơn'),
          ],
          correct: 0,
          explanation: EX(
            'Unguessable keys ARE the security model of a public bucket. The other segments earn their place too: the family prefix makes lifecycle rules and cost reports possible, and <code>u&lt;id&gt;</code> turns ownership into something checkable with a regex, without a database round trip. The uniqueness is also what makes <code>Cache-Control: immutable</code> safe — a changed image is a NEW key, never a changed object.',
            'Key không đoán được CHÍNH LÀ mô hình bảo mật của một bucket công khai. Các đoạn còn lại cũng có việc của chúng: tiền tố họ giúp đặt quy tắc vòng đời và bóc tách chi phí, còn <code>u&lt;id&gt;</code> biến quyền sở hữu thành thứ kiểm được bằng một biểu thức chính quy, khỏi phải hỏi cơ sở dữ liệu. Tính duy nhất ấy cũng là thứ khiến <code>Cache-Control: immutable</code> trở nên an toàn — ảnh đổi là một key MỚI, không bao giờ là một object bị sửa.',
          ),
        }),

        mcq({
          prompt: B(
            'Re-encoding an uploaded photo with <code>sharp</code> does three jobs at once. Which is NOT one of them?',
            'Cho ảnh tải lên đi qua <code>sharp</code> mã hoá lại làm được ba việc cùng lúc. Việc nào KHÔNG nằm trong đó?',
          ),
          options: [
            B('It proves the file really is an image — a corrupt header throws', 'Nó chứng minh file thật sự là ảnh — header hỏng là ném lỗi'),
            B('It strips appended payloads and EXIF, including GPS coordinates', 'Nó loại bỏ phần đính kèm ở đuôi file và dữ liệu EXIF, kể cả toạ độ GPS'),
            B('It bounds the CPU and memory the upload can consume', 'Nó chặn được lượng CPU và bộ nhớ mà lần upload đó tiêu tốn'),
            B('It converts and resizes, which is where most of the bytes go', 'Nó đổi định dạng và đổi kích thước, và đó là chỗ phần lớn số byte biến mất'),
          ],
          correct: 2,
          explanation: EX(
            'Re-encoding OPENS a resource problem rather than closing one: a 758KB PNG describing 16000×16000 pixels cost 99MB of RSS, and eight of them — 5,9MB of upload — cost 445MB. The bound is a pixel budget (<code>limitInputPixels</code>) plus a queue capping how many images decode at once. sharp\'s default limit (268 million pixels) let that bomb through.',
            'Mã hoá lại MỞ RA một vấn đề tài nguyên chứ không đóng nó lại: một file PNG 758KB mô tả ảnh 16000×16000 điểm ảnh ngốn 99MB RSS, và tám file như thế — vỏn vẹn 5,9MB tải lên — ngốn 445MB. Lá chắn là một hạn mức điểm ảnh (<code>limitInputPixels</code>) cộng với một hàng đợi giới hạn số ảnh giải mã cùng lúc. Giới hạn mặc định của sharp (268 triệu điểm ảnh) đã để quả bom đó lọt qua.',
          ),
        }),

        // ── Chương 11 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Users complain they see their OWN typing indicator. Which line causes that?',
            'Người dùng phàn nàn rằng họ thấy chỉ báo "đang gõ" của CHÍNH MÌNH. Dòng nào gây ra?',
          ),
          options: [
            B('<code>io.to(room)</code> includes the sender; <code>socket.to(room)</code> excludes them', '<code>io.to(room)</code> gửi cho cả người gửi; <code>socket.to(room)</code> thì trừ họ ra'),
            B('<code>socket.join(room)</code> called twice', '<code>socket.join(room)</code> bị gọi hai lần'),
            B('The Redis adapter echoing the broadcast back', 'Adapter Redis dội lại tin đã phát'),
            B('Using <code>socket.id</code> as the room name', 'Dùng <code>socket.id</code> làm tên phòng'),
          ],
          correct: 0,
          explanation: EX(
            'One character of difference. While you are there, remember <code>io.emit()</code> is a broadcast to EVERY socket on the server — a like button that woke every connected client on the site is an O(all sockets) loop on the event loop per click, and the fix was emitting only to <code>post:&lt;id&gt;</code>.',
            'Khác nhau đúng một ký tự. Nhân tiện cũng nhớ luôn: <code>io.emit()</code> là phát cho MỌI socket trên máy chủ — một nút thích đánh thức toàn bộ client đang kết nối của cả trang là một vòng lặp O(số socket) trên event loop cho mỗi lần bấm, và cách sửa là chỉ phát vào <code>post:&lt;id&gt;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A phone loses signal for a minute. Socket.IO reconnects with a NEW socket id, and the five messages emitted while it was away were received as zero. What is the correct design response?',
            'Một chiếc điện thoại mất sóng một phút. Socket.IO kết nối lại với socket id MỚI, và năm tin nhắn phát ra lúc nó offline thì nhận được con số không. Cách thiết kế đúng là gì?',
          ),
          options: [
            B('Buffer messages on the server until the client returns', 'Đệm tin nhắn ở máy chủ cho tới khi client quay lại'),
            B('The socket is a SIGNAL, REST is the truth: re-join rooms on connect and refetch with <code>?since=&lt;last id&gt;</code>', 'Socket là TÍN HIỆU, REST mới là sự thật: vào lại các phòng trong hàm connect và gọi lại <code>?since=&lt;id cuối&gt;</code>'),
            B('Raise <code>pingTimeout</code> so the connection is not considered dead', 'Nâng <code>pingTimeout</code> để kết nối không bị coi là chết'),
            B('Key server state by <code>socket.id</code> so it survives the reconnect', 'Đánh chỉ mục trạng thái phía máy chủ theo <code>socket.id</code> để nó sống sót qua lần kết nối lại'),
          ],
          correct: 1,
          explanation: EX(
            'Design so that a lost socket message is a cosmetic delay, never lost data — if correctness depends on a frame arriving, you have built a message queue out of a UI transport. Two related facts: rooms are lost on reconnect (a new socket has none), so joining belongs in the connect handler; and with default ping settings a vanished client counts as online for up to 45 seconds.',
            'Hãy thiết kế sao cho một tin nhắn socket bị mất chỉ là chậm trễ về mặt hình thức, không bao giờ là mất dữ liệu — nếu tính đúng đắn phụ thuộc vào việc một khung tin phải tới nơi thì bạn đang dựng một hàng đợi tin nhắn bằng một kênh truyền dành cho giao diện. Hai sự thật liên quan: các phòng mất hết khi kết nối lại (socket mới thì chưa ở phòng nào), nên việc join phải nằm trong hàm xử lý connect; và với thiết lập ping mặc định thì một client đã biến mất vẫn bị tính là đang online tới 45 giây.',
          ),
        }),

        // ── Chương 12 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Caching a 1,2MB result: Redis GET + JSON.parse took 6,39ms while asking PostgreSQL directly took 5,38ms. What rule does that produce?',
            'Cache một kết quả 1,2MB: Redis GET + JSON.parse mất 6,39ms trong khi hỏi thẳng PostgreSQL chỉ 5,38ms. Rút ra quy tắc gì?',
          ),
          options: [
            B('Cache what is expensive to COMPUTE, not what is merely large', 'Hãy cache thứ TỐN CÔNG TÍNH, không phải thứ chỉ đơn giản là to'),
            B('Redis is slower than PostgreSQL for reads', 'Redis đọc chậm hơn PostgreSQL'),
            B('Always compress values before caching them', 'Luôn nén giá trị trước khi đưa vào cache'),
            B('The TTL was too short', 'TTL đặt quá ngắn'),
          ],
          correct: 0,
          explanation: EX(
            'A 1KB leaderboard that takes 48ms to build is a perfect cache entry (120× faster from Redis); a 1,2MB list that takes 5ms to fetch is a second network hop with extra steps. PostgreSQL is not slow at streaming rows — it is slow at aggregating them.' +
              sim('nodejs-cache-aside', 'nodejs-12-2-cache-aside', 'Watch cache-aside'),
            'Một bảng xếp hạng 1KB tốn 48ms để dựng là một mục cache hoàn hảo (đọc từ Redis nhanh gấp 120 lần); một danh sách 1,2MB chỉ tốn 5ms để lấy thì cache chỉ là thêm một chặng mạng kèm vài bước thừa. PostgreSQL không hề chậm khi trả dòng — nó chỉ chậm khi phải tổng hợp.' +
              sim('nodejs-cache-aside', 'nodejs-12-2-cache-aside', 'Xem mô phỏng cache-aside'),
          ),
        }),

        mcq({
          prompt: B(
            'At a 90% cache hit rate 300 requests averaged 5,19ms; at 99% they averaged 0,43ms. What should you alert on?',
            'Với tỉ lệ trúng cache 90% thì 300 request trung bình 5,19ms; với 99% thì trung bình 0,43ms. Nên cảnh báo theo chỉ số nào?',
          ),
          options: [
            B('Hit percentage — 90% is already a red flag', 'Tỉ lệ phần trăm trúng — 90% đã là báo động đỏ'),
            B('Misses per second — one request in ten still pays the full 48ms', 'Số lần trượt mỗi giây — cứ mười request vẫn có một cái trả đủ 48ms'),
            B('Average latency on its own is enough', 'Chỉ cần theo dõi độ trễ trung bình là đủ'),
            B('How much memory Redis is currently using', 'Lượng bộ nhớ mà Redis đang dùng'),
          ],
          correct: 1,
          explanation: EX(
            'The arithmetic is unforgiving: 90% sounds excellent and is twelve times worse than 99%. This is why "we added caching and it is still slow" is such a common report. Two neighbouring traps: a plain <code>SET</code> over a key that had a TTL REMOVES the expiry (use <code>KEEPTTL</code>), and <code>if (!hit)</code> as the miss test breaks the moment you cache a negative result.',
            'Phép tính không khoan nhượng: 90% nghe thì tuyệt vời mà thực tế tệ hơn 99% tới mười hai lần. Đó là lý do câu than "thêm cache rồi mà vẫn chậm" phổ biến đến vậy. Hai cái bẫy ở ngay bên cạnh: một lệnh <code>SET</code> trần đè lên khoá đang có TTL sẽ XOÁ luôn hạn đó (hãy dùng <code>KEEPTTL</code>), và dùng <code>if (!hit)</code> làm phép kiểm trượt cache sẽ hỏng ngay khi bạn cache một kết quả rỗng.',
          ),
        }),

        mcq({
          prompt: B(
            'Counting 100.000 unique daily users: a Set costs 3,53MB and counts exactly; a HyperLogLog costs 0,04MB and estimates 100.165 (0,17% off). When must you still use the Set?',
            'Đếm 100.000 người dùng duy nhất trong ngày: một Set tốn 3,53MB và đếm chính xác; một HyperLogLog tốn 0,04MB và ước lượng 100.165 (lệch 0,17%). Khi nào vẫn buộc phải dùng Set?',
          ),
          options: [
            B('When you need <code>SISMEMBER</code> — a HyperLogLog can never answer "is THIS user in it?"', 'Khi cần <code>SISMEMBER</code> — HyperLogLog không bao giờ trả lời được câu "người dùng NÀY có trong đó không?"'),
            B('When the count exceeds one million', 'Khi số lượng vượt quá một triệu'),
            B('When you need to merge two days together', 'Khi cần gộp hai ngày lại với nhau'),
            B('When exact counts are required, which HLL can also give with a flag', 'Khi cần con số chính xác, mà HLL cũng cho được nếu bật cờ'),
          ],
          correct: 0,
          explanation: EX(
            'A HyperLogLog is a fixed 12KB no matter how many items you add, and merging is exactly what it is good at (<code>PFMERGE</code> is how "unique visitors this week" works). The trade is absolute: you can ask how many, never whether. For dense integer ids there is a third option — a bitmap gave exact membership for a million users in 152KB.',
            'Một HyperLogLog luôn cố định 12KB dù bạn thêm bao nhiêu phần tử, và gộp lại chính là thứ nó giỏi (<code>PFMERGE</code> là cách người ta tính "khách duy nhất trong tuần"). Sự đánh đổi là tuyệt đối: hỏi được BAO NHIÊU, không bao giờ hỏi được CÓ HAY KHÔNG. Với dải id số nguyên dày đặc còn một lựa chọn thứ ba — bitmap cho phép kiểm chính xác thành viên của một triệu người dùng trong 152KB.',
          ),
        }),

        // ── Chương 13 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Adding the same job five times with the same <code>jobId</code> produced exactly one waiting job. Why is that still not a substitute for an idempotent handler?',
            'Thêm cùng một job năm lần với cùng <code>jobId</code> chỉ tạo ra đúng một job đang chờ. Vì sao như thế vẫn chưa thay thế được một handler idempotent?',
          ),
          options: [
            B('It deduplicates only while the old job still exists in Redis', 'Nó chỉ khử trùng chừng nào job cũ vẫn còn nằm trong Redis'),
            B('<code>jobId</code> is ignored when the queue has more than one worker', '<code>jobId</code> bị bỏ qua khi hàng đợi có nhiều hơn một worker'),
            B('BullMQ only compares the first 32 characters of a jobId', 'BullMQ chỉ so sánh 32 ký tự đầu của jobId'),
            B('It works only for delayed jobs', 'Nó chỉ có tác dụng với job hẹn giờ'),
          ],
          correct: 0,
          explanation: EX(
            'Use both: <code>jobId</code> as a cheap guard against double-submit inside a short window, and an idempotent handler for everything else (retries, stalled-job reclaims after a crash). One sharp edge found the hard way: a jobId cannot contain a colon — <code>invoice-ORD-777</code>, not <code>invoice:ORD-777</code>.',
            'Hãy dùng cả hai: <code>jobId</code> như một lá chắn rẻ tiền chống bấm nút hai lần trong khoảng thời gian ngắn, và một handler idempotent cho mọi trường hợp còn lại (thử lại, job treo bị nhặt lại sau khi worker chết). Một cạnh sắc phải trả giá mới biết: jobId không được chứa dấu hai chấm — phải là <code>invoice-ORD-777</code> chứ không phải <code>invoice:ORD-777</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Which retention policy is right for a production queue?',
            'Chính sách giữ lại nào là đúng cho một hàng đợi chạy production?',
          ),
          options: [
            B('Keep completed jobs forever; they are the audit trail', 'Giữ job đã xong mãi mãi; đó là dấu vết kiểm toán'),
            B('Clean up completed jobs quickly, keep failed ones far longer', 'Dọn job đã xong thật nhanh, giữ job hỏng lâu hơn nhiều'),
            B('Remove both immediately to save memory', 'Xoá cả hai ngay lập tức để tiết kiệm bộ nhớ'),
            B('Retention does not matter; Redis evicts old keys', 'Chuyện giữ lại không quan trọng; Redis sẽ tự loại bỏ khoá cũ'),
          ],
          correct: 1,
          explanation: EX(
            'Three thousand trivial completed jobs cost 3,94MB against 0,49MB with <code>removeOnComplete: 100</code> — at production volume that is how a queue quietly consumes a 256MB Redis and starts refusing writes. A completed job is a receipt nobody reads; a failed job keeps its <code>data</code> and <code>failedReason</code>, so once the real cause is fixed one loop replays them all. And no, Redis must NOT evict here: a queue needs <code>noeviction</code>.',
            'Ba nghìn job tầm thường đã hoàn thành tốn 3,94MB, so với 0,49MB khi đặt <code>removeOnComplete: 100</code> — ở khối lượng production thì đó là cách một hàng đợi âm thầm ngốn hết một Redis 256MB rồi bắt đầu từ chối ghi. Job đã xong là cái hoá đơn chẳng ai đọc; job hỏng thì giữ nguyên <code>data</code> và <code>failedReason</code>, nên khi sửa được nguyên nhân thật thì một vòng lặp phát lại hết. Và không, Redis TUYỆT ĐỐI không được loại bỏ khoá ở đây: hàng đợi cần <code>noeviction</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A worker handler blocks the event loop for 3 seconds while <code>lockDuration</code> is 1 second. The log shows <code>Missing lock for job 1. moveToFinished</code>, the handler ran TWICE and the job ended as failed. Explain.',
            'Một handler của worker chặn event loop 3 giây trong khi <code>lockDuration</code> là 1 giây. Log hiện <code>Missing lock for job 1. moveToFinished</code>, handler chạy HAI lần và job kết thúc ở trạng thái hỏng. Giải thích?',
          ),
          options: [
            B('The lock-renewal timer runs on the event loop you blocked', 'Bộ hẹn giờ gia hạn khoá chạy trên chính event loop mà bạn đã chặn'),
            B('BullMQ retries every job that takes longer than <code>lockDuration</code>', 'BullMQ thử lại mọi job chạy lâu hơn <code>lockDuration</code>'),
            B('Redis dropped the lock key because of maxmemory', 'Redis đánh rơi khoá vì chạm maxmemory'),
            B('The worker lost its Redis connection', 'Worker mất kết nối tới Redis'),
          ],
          correct: 0,
          explanation: EX(
            'A job that AWAITS for 3 seconds is fine — the renewal timer fires while it waits. A job that BLOCKS for 3 seconds is not. The fix is a sandboxed processor, a worker thread or a separate process — never a tighter <code>lockDuration</code>, which only changes how fast you get the bug. This is also chapter 2 with a new consequence: there it cost latency, here it costs correctness.',
            'Một job AWAIT 3 giây thì không sao — bộ hẹn giờ gia hạn vẫn nổ trong lúc nó chờ. Một job CHẶN 3 giây thì có sao. Cách sửa là sandboxed processor, worker thread hoặc một tiến trình riêng — tuyệt đối không phải siết <code>lockDuration</code> nhỏ lại, làm thế chỉ khiến lỗi tới nhanh hơn. Đây cũng là chương 2 với một hậu quả mới: ở đó nó tốn độ trễ, ở đây nó làm sai kết quả.',
          ),
        }),

        // ── Chương 14 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Why must the app be built by a factory (<code>createApp()</code>) rather than calling <code>app.listen()</code> at import time?',
            'Vì sao ứng dụng phải được dựng bằng một hàm nhà máy (<code>createApp()</code>) thay vì gọi <code>app.listen()</code> ngay lúc import?',
          ),
          options: [
            B('Importing a file that listens would start a real server in the test', 'Import một file có gọi listen là khởi động một máy chủ thật ngay trong test'),
            B('Express 5 forbids top-level listen', 'Express 5 cấm gọi listen ở cấp cao nhất'),
            B('It is required for TypeScript type inference', 'Đó là điều kiện để TypeScript suy ra kiểu'),
            B('Factories are faster to start', 'Hàm nhà máy khởi động nhanh hơn'),
          ],
          correct: 0,
          explanation: EX(
            'The factory also takes its dependencies as arguments, which lets one test file run the whole app against a fake service and another against a real database — with no environment variable. <code>request(app)</code> in supertest takes the app OBJECT, not a URL: it binds an ephemeral port, sends a genuine HTTP request and closes it again.',
            'Hàm nhà máy còn nhận phụ thuộc qua tham số, nhờ đó một file test chạy cả ứng dụng với service giả còn file khác chạy với cơ sở dữ liệu thật — không cần một biến môi trường nào. <code>request(app)</code> của supertest nhận vào OBJECT app chứ không phải URL: nó gắn vào một cổng tạm, gửi một request HTTP thật rồi đóng lại.',
          ),
        }),

        mcq({
          prompt: B(
            'A route test wires <code>createApp({ service: fakeService })</code> and asserts that a duplicate slug returns 409. What has it actually proven?',
            'Một bài test route dựng <code>createApp({ service: fakeService })</code> rồi khẳng định slug trùng thì trả 409. Nó thực sự chứng minh được gì?',
          ),
          options: [
            B('Only that Express answers 409 when something throws a status 409', 'Chỉ chứng minh Express trả 409 khi có thứ gì đó ném ra status 409'),
            B('That duplicate slugs really are rejected by the system', 'Rằng slug trùng thật sự bị hệ thống từ chối'),
            B('That the unique constraint in the database works', 'Rằng ràng buộc duy nhất trong cơ sở dữ liệu hoạt động'),
            B('That the router and the service agree on the contract', 'Rằng router và service thống nhất với nhau về hợp đồng'),
          ],
          correct: 0,
          explanation: EX(
            'The rules you care about — duplicate slugs, ownership, validation — live BELOW the route. Wire the real service to a real database for tests that assert rules; wire a fake only for cases you cannot otherwise produce, such as "the database is down and the route must answer 503". And assert on the EFFECT, not just the status: an ownership test should also check the row was not modified.',
            'Những quy tắc bạn thật sự quan tâm — slug trùng, quyền sở hữu, kiểm dữ liệu — nằm BÊN DƯỚI route. Hãy nối service thật với cơ sở dữ liệu thật cho những bài test khẳng định quy tắc; chỉ dùng hàng giả cho các tình huống không tạo ra được bằng cách khác, ví dụ "cơ sở dữ liệu chết và route phải trả 503". Và hãy khẳng định trên HỆ QUẢ chứ không chỉ trên mã trạng thái: một bài test quyền sở hữu còn phải kiểm rằng dòng dữ liệu không bị sửa.',
          ),
        }),

        // ── Chương 15 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which pillar answers each question? (1) "Which users hit the error?" (2) "How many users hit the error?" (3) "Where did the 8 seconds go?"',
            'Trụ cột nào trả lời câu nào? (1) "Những người dùng nào gặp lỗi?" (2) "Bao nhiêu người dùng gặp lỗi?" (3) "Tám giây đó đi đâu?"',
          ),
          options: [
            B('(1) log · (2) metric · (3) trace', '(1) log · (2) metric · (3) trace'),
            B('(1) metric · (2) log · (3) trace', '(1) metric · (2) log · (3) trace'),
            B('(1) trace · (2) metric · (3) log', '(1) trace · (2) metric · (3) log'),
            B('All three are log questions', 'Cả ba đều là câu hỏi dành cho log'),
          ],
          correct: 0,
          explanation: EX(
            'They sound like the same question and have wildly different prices: metrics are cheap because their cost does not grow with traffic, but only if label values come from a small fixed set — one <code>user_id</code> label turned 9,7KB of metrics into 74,52MB and 939MB of RSS. Unbounded values belong in logs and traces, never in labels.',
            'Nghe thì như cùng một câu hỏi mà giá cả khác nhau một trời một vực: metric rẻ vì chi phí của nó không tăng theo lưu lượng, nhưng chỉ đúng khi giá trị nhãn đến từ một tập nhỏ và cố định — chỉ một nhãn <code>user_id</code> đã biến 9,7KB metric thành 74,52MB và 939MB RSS. Những giá trị vô hạn thuộc về log và trace, tuyệt đối không thuộc về nhãn.',
          ),
        }),

        mcq({
          prompt: B(
            'A route\'s p95 is 113,9ms — identical to every other route — while its max is 8241ms. What does that tell you?',
            'Một route có p95 là 113,9ms — y hệt mọi route khác — trong khi giá trị lớn nhất là 8241ms. Điều đó nói lên gì?',
          ),
          options: [
            B('Percentiles hide outliers by design — investigate with max', 'Phân vị vốn được thiết kế để che giá trị dị biệt — hãy điều tra bằng max'),
            B('The max is a measurement error', 'Giá trị lớn nhất là do đo sai'),
            B('The p95 must be miscalculated', 'Chắc chắn p95 tính nhầm'),
            B('One slow request means the p95 will rise shortly', 'Có một request chậm thì p95 sẽ tăng trong nay mai'),
          ],
          correct: 0,
          explanation: EX(
            'One bad request in 250.000 is the 99,9996th percentile — the p95 cannot see it, and that stability is exactly what makes percentiles useful and blind at the same time. Never conclude "everything is fine" from a healthy p95 alone.',
            'Một request tồi trong 250.000 nằm ở phân vị thứ 99,9996 — p95 không thể thấy nó, và chính sự ổn định ấy vừa làm cho phân vị hữu ích vừa làm cho nó mù. Đừng bao giờ kết luận "mọi thứ đều ổn" chỉ dựa vào một con số p95 khoẻ mạnh.',
          ),
        }),

        mcq({
          prompt: B(
            'At 24,6GB of logs per day a 100GB disk fills in four days — and a full disk kills PostgreSQL and stops Docker. Whose job is rotation?',
            'Với 24,6GB log mỗi ngày thì một đĩa 100GB đầy trong bốn ngày — mà đĩa đầy thì PostgreSQL chết và Docker không chạy được. Việc xoay vòng log là của ai?',
          ),
          options: [
            B('The application: open a file and rotate it yourself', 'Của ứng dụng: tự mở file và tự xoay vòng'),
            B('The app writes to stdout; Docker\'s json-file driver enforces the ceiling', 'Ứng dụng ghi ra stdout; trình điều khiển json-file của Docker áp trần cứng'),
            B('The log aggregator, which deletes old data remotely', 'Của hệ gom log, nó xoá dữ liệu cũ từ xa'),
            B('Nobody — logs compress themselves', 'Không của ai cả — log tự nén lấy'),
          ],
          correct: 1,
          explanation: EX(
            'The important property of that stack is failure isolation: an app that writes to stdout keeps serving when the shipper dies, while an app that writes directly to a remote log service blocks when that service is slow — which is how a logging outage becomes an application outage. Two details: the Docker setting applies only to containers created after the change, and <code>docker logs</code> only ever shows what is inside the window.',
            'Tính chất quan trọng của kiến trúc đó là cô lập lỗi: ứng dụng ghi ra stdout thì vẫn phục vụ bình thường khi bộ chuyển log chết, còn ứng dụng ghi thẳng tới một dịch vụ log từ xa sẽ bị nghẽn khi dịch vụ đó chậm — và đó là cách một sự cố log biến thành sự cố ứng dụng. Hai chi tiết: thiết lập của Docker chỉ áp cho container tạo SAU khi đổi cấu hình, và <code>docker logs</code> chỉ hiện được phần nằm trong cửa sổ ấy.',
          ),
        }),

        // ── Chương 16 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            '500 sequential HTTP calls to the same host: <code>agent: false</code> took 646ms, Node 22\'s default global agent 81ms. What is the difference?',
            '500 lời gọi HTTP tuần tự tới cùng một host: <code>agent: false</code> mất 646ms, agent toàn cục mặc định của Node 22 mất 81ms. Khác nhau ở đâu?',
          ),
          options: [
            B('Connection reuse (keep-alive)', 'Dùng lại kết nối (keep-alive)'),
            B('DNS lookup caching', 'Việc cache tra cứu DNS'),
            B('HTTP/2 multiplexing', 'Cơ chế ghép kênh của HTTP/2'),
            B('Response compression', 'Việc nén phản hồi'),
          ],
          correct: 0,
          explanation: EX(
            'Every new connection costs a TCP handshake, and over TLS a certificate exchange on top — 100–300ms on a real network rather than the 1,29ms measured on loopback. Node 22 already does the right thing (<code>globalAgent.keepAlive</code> is true, <code>fetch()</code> pools), so today\'s mistake is code that explicitly sets <code>agent: false</code>. And a humbling detail from the same lesson: a pool of 2 sockets beat a pool of 20 on loopback — benchmarks on 127.0.0.1 answer a different question than production does.',
            'Mỗi kết nối mới đều tốn một cái bắt tay TCP, và nếu chạy TLS thì cộng thêm một lượt trao đổi chứng chỉ — trên mạng thật là 100–300ms chứ không phải 1,29ms như đo trên loopback. Node 22 vốn đã làm đúng (<code>globalAgent.keepAlive</code> là true, <code>fetch()</code> có gom kết nối), nên lỗi thời nay là đoạn mã nào đó cố tình đặt <code>agent: false</code>. Và một chi tiết khiêm tốn từ cùng bài học: pool 2 socket thắng pool 20 socket khi chạy trên loopback — đo trên 127.0.0.1 là đang trả lời một câu hỏi khác với câu hỏi của production.',
          ),
        }),

        mcq({
          prompt: B(
            'On a ten-core machine, CPU-route throughput went 8.708 → 18.303 → 29.542 → 27.189 → 25.112 req/s at 1, 2, 4, 8 and 10 workers. What does the shape say?',
            'Trên máy mười nhân, thông lượng của route nặng CPU đi 8.708 → 18.303 → 29.542 → 27.189 → 25.112 req/giây với 1, 2, 4, 8 và 10 worker. Hình dạng đó nói gì?',
          ),
          options: [
            B('Start at cores − 1 and measure DOWN as well as up', 'Hãy bắt đầu ở số nhân − 1 rồi đo cả chiều GIẢM lẫn chiều tăng'),
            B('Always fork exactly <code>os.cpus().length</code> workers', 'Luôn fork đúng <code>os.cpus().length</code> worker'),
            B('The measurement is unreliable above four workers', 'Phép đo không đáng tin khi vượt bốn worker'),
            B('Throughput scales linearly with workers', 'Thông lượng tăng tuyến tính theo số worker'),
          ],
          correct: 0,
          explanation: EX(
            'The load generator wants cores too — in production that is nginx, the log shipper and the monitoring agent — plus context switching and one V8 heap per worker. Copying <code>os.cpus().length</code> from a tutorial is how you end up on the falling side of the curve. For an I/O-bound app the whole exercise buys 5,7% and breaks cron, in-memory rate limits and Socket.IO rooms.',
            'Bộ tạo tải cũng cần nhân — trên production đó là nginx, bộ chuyển log và agent giám sát — cộng thêm chi phí chuyển ngữ cảnh và một vùng nhớ V8 riêng cho mỗi worker. Chép <code>os.cpus().length</code> từ một bài hướng dẫn chính là cách bạn rơi xuống nhánh đi xuống của đường cong. Với ứng dụng nghẽn I/O thì cả việc này chỉ lời 5,7% và làm hỏng cron, giới hạn tần suất đếm trong RAM lẫn các phòng Socket.IO.',
          ),
        }),

        mcq({
          prompt: B(
            'Order these by measured payoff, largest first: (a) a faster JSON serialiser, (b) an index on a filtered column, (c) clustering a CPU-bound route, (d) pre-serialising a static response.',
            'Xếp theo mức lợi ích đã đo được, lớn nhất trước: (a) bộ tuần tự hoá JSON nhanh hơn, (b) chỉ mục cho cột đang lọc, (c) cluster cho route nặng CPU, (d) tuần tự hoá sẵn một phản hồi tĩnh.',
          ),
          options: [
            B('b (222×) → c (3,4×) → d (1,9×) → a (1,39×)', 'b (222×) → c (3,4×) → d (1,9×) → a (1,39×)'),
            B('a → b → c → d', 'a → b → c → d'),
            B('c (3,4×) → b (222×) → a (1,39×) → d (1,9×)', 'c (3,4×) → b (222×) → a (1,39×) → d (1,9×)'),
            B('d → a → b → c', 'd → a → b → c'),
          ],
          correct: 0,
          explanation: EX(
            'The pattern is not subtle: every large win REMOVES work (index 222×, cache 120×, fewer fields 2,8×, keep-alive 9,4×) or does it once; every small win makes the same work faster. "Make it faster" is the category people reach for first because it feels like engineering, and it has the worst returns — the 1,39× serialiser improved a real endpoint by 0,23%.',
            'Quy luật không hề tinh vi: mọi thắng lợi lớn đều đến từ việc BỎ BỚT việc (chỉ mục 222×, cache 120×, ít trường hơn 2,8×, keep-alive 9,4×) hoặc chỉ làm một lần; mọi thắng lợi nhỏ đều đến từ việc làm cùng công việc ấy nhanh hơn. "Làm cho nhanh hơn" là hạng mục người ta với tay tới đầu tiên vì nó có cảm giác giống làm kỹ thuật, và nó cho lợi tức tệ nhất — bộ tuần tự hoá nhanh 1,39 lần cải thiện một endpoint thật đúng 0,23%.',
          ),
        }),

        // ── Chương 17 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Adding a four-line <code>.dockerignore</code> took the build context from 64,27MB to 235 bytes and the image from 97,2MB to 79,6MB. What was that 17,6MB?',
            'Thêm một file <code>.dockerignore</code> bốn dòng đã đưa ngữ cảnh build từ 64,27MB xuống 235 byte và ảnh từ 97,2MB xuống 79,6MB. 17,6MB đó là gì?',
          ),
          options: [
            B('The HOST\'s <code>node_modules</code>, built for the wrong architecture', '<code>node_modules</code> CỦA MÁY BẠN, biên dịch cho sai kiến trúc'),
            B('Docker\'s build cache from earlier runs', 'Cache build của Docker từ những lần chạy trước'),
            B('Layer metadata Docker stores per instruction', 'Siêu dữ liệu tầng mà Docker lưu cho mỗi chỉ thị'),
            B('Part of the base image itself', 'Một phần của chính ảnh nền'),
          ],
          correct: 0,
          explanation: EX(
            'The four lines are <code>node_modules</code>, <code>.git</code> (the whole repo history, including secrets you deleted in a later commit), <code>.env</code> and <code>dist</code>. Selective <code>COPY</code> and <code>.dockerignore</code> protect against different mistakes, and the second one keeps working after somebody adds a <code>COPY . .</code> in six months.',
            'Bốn dòng đó là <code>node_modules</code>, <code>.git</code> (toàn bộ lịch sử repo, gồm cả những bí mật bạn đã xoá ở commit sau), <code>.env</code> và <code>dist</code>. Việc <code>COPY</code> có chọn lọc và file <code>.dockerignore</code> chống hai loại sai lầm khác nhau, và cái thứ hai vẫn còn tác dụng sau khi sáu tháng nữa có người thêm một dòng <code>COPY . .</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A deploy that starts the new container, health-checks it, then removes the old one and binds the real port still lost 1,6% of requests. Why, and what actually fixes it?',
            'Một quy trình deploy dựng container mới, kiểm khoẻ nó, rồi mới bỏ cái cũ và gắn cổng thật — vẫn mất 1,6% số request. Vì sao, và cái gì mới thật sự sửa được?',
          ),
          options: [
            B('The gap is the PORT REBIND — a proxy must own that port permanently', 'Khoảng trống nằm ở việc ĐỔI CỔNG — phải có proxy giữ cổng đó vĩnh viễn'),
            B('The health check was too slow', 'Phép kiểm khoẻ chạy quá chậm'),
            B('The new image was not warmed up', 'Ảnh mới chưa được làm nóng'),
            B('Docker needs <code>--force-recreate</code>', 'Docker cần thêm <code>--force-recreate</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Between the instant the old container releases the port and the instant the new one binds it, there is no listener and every request gets connection-refused. Health-checking the new container first is still valuable — a broken image means the old one keeps serving — but the outage was never about which container was healthy. With a proxy in front: 327 requests, 327 successes, 0% lost.',
            'Giữa khoảnh khắc container cũ nhả cổng và khoảnh khắc container mới gắn vào cổng đó, không có ai lắng nghe cả, và mọi request đều bị từ chối kết nối. Việc kiểm khoẻ container mới trước vẫn có giá trị — ảnh hỏng thì cái cũ vẫn phục vụ tiếp — nhưng sự cố này chưa bao giờ nằm ở chuyện container nào khoẻ. Có proxy đứng trước: 327 request, 327 lần thành công, mất 0%.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about rollback.',
            'Chọn HAI phát biểu ĐÚNG về việc quay lui (rollback).',
          ),
          options: [
            B('Tag images with something immutable (a git SHA) — <code>:latest</code> cannot be rolled back to or audited', 'Hãy gắn thẻ ảnh bằng thứ bất biến (mã git SHA) — <code>:latest</code> thì không quay lui về được và cũng không kiểm toán được'),
            B('Reverting code does not revert the database', 'Quay lui mã nguồn không quay lui cơ sở dữ liệu'),
            B('If a deploy fails, find the root cause before rolling back', 'Nếu deploy hỏng thì phải tìm ra nguyên nhân gốc rồi mới quay lui'),
            B('A rollback is always safe if the previous image still exists', 'Quay lui luôn an toàn miễn là ảnh trước đó vẫn còn'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Roll back FIRST, investigate after — production is not a place to debug, and every minute spent on the cause is a minute of outage. And a migration that drops a column or changes a type makes the rollback path unsafe: old code against a new schema can be worse than the bug you were escaping, which is exactly why the additive pattern (add nullable → backfill → switch reads → remove later) matters.',
            'QUAY LUI trước, điều tra sau — production không phải chỗ để gỡ lỗi, và mỗi phút bỏ ra truy nguyên nhân là một phút sự cố kéo dài. Còn một migration xoá cột hay đổi kiểu dữ liệu sẽ làm đường quay lui trở nên nguy hiểm: mã cũ chạy trên lược đồ mới có khi còn tệ hơn cái lỗi bạn đang chạy trốn, và đó chính là lý do mẫu cộng thêm (thêm cột nullable → điền dữ liệu → chuyển phần đọc → xoá sau) lại quan trọng.',
          ),
        }),

        // ── Chương 18 ───────────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which of these is a REAL boundary — one that a cross-module import cannot quietly violate?',
            'Cái nào dưới đây là ranh giới THẬT — thứ mà một lệnh import xuyên mô-đun không thể âm thầm vượt qua?',
          ),
          options: [
            B('A folder named <code>domain/</code> that everything may import', 'Một thư mục tên <code>domain/</code> mà mọi nơi đều import được'),
            B('A separate package, where a cross-import is a compile error', 'Một gói riêng, ở đó import xuyên qua là lỗi biên dịch'),
            B('A module that declares an explicit public export list', 'Một mô-đun có khai báo danh sách export công khai tường minh'),
            B('A comment saying "do not import from here"', 'Một dòng chú thích ghi "đừng import từ đây"'),
          ],
          correct: 1,
          explanation: EX(
            'A folder is a way of arranging things for human eyes; explicit exports are a weak boundary (people still import into the internals); a separate package is real; a separate process is harder; a separate database is final — and that is where the real pain starts, because you cannot JOIN any more. Pick the level for what you need ENFORCED, not for how it sounds.',
            'Thư mục chỉ là cách sắp xếp cho mắt người nhìn; export tường minh là ranh giới yếu (người ta vẫn import thẳng vào ruột); gói riêng mới là ranh giới thật; tiến trình riêng thì cứng hơn; cơ sở dữ liệu riêng là ranh giới cuối cùng — và đó mới là chỗ nỗi đau thật sự bắt đầu, vì bạn không JOIN được nữa. Hãy chọn mức theo thứ bạn cần CƯỠNG CHẾ, đừng chọn theo cái tên nghe cho oai.',
          ),
        }),

        mcq({
          prompt: B(
            'The largest file in the repository is a 3.607-line seed data file, and it is fine. A 2.262-line service file is not. What is the real signal?',
            'File lớn nhất trong repo là một file dữ liệu seed 3.607 dòng, và nó hoàn toàn ổn. Một file service 2.262 dòng thì không. Dấu hiệu thật sự là gì?',
          ),
          options: [
            B('The number of REASONS it has to change, not how long it is', 'Số LÝ DO khiến nó phải sửa, chứ không phải nó dài bao nhiêu'),
            B('Line count above 1000 is always a problem', 'Cứ trên 1000 dòng là có vấn đề'),
            B('Data files should always be split into modules', 'File dữ liệu thì luôn phải chẻ ra thành nhiều mô-đun'),
            B('Service files are inherently harder to read', 'File service về bản chất là khó đọc hơn'),
          ],
          correct: 0,
          explanation: EX(
            'Flat data has no branching and no interaction between entries — you search it, you do not navigate it. Logic tangles: every function can call every other. And beware the fake split: moving functions into new files with no change to who calls what gives you the same tangle spread across eight files. If the extracted piece still reaches back into the original, you found a page break, not a boundary.',
            'Dữ liệu phẳng không có nhánh rẽ và các mục không tương tác với nhau — người ta TÌM KIẾM trong đó chứ không đi lại trong đó. Logic thì rối vào nhau: hàm nào cũng gọi được hàm nào. Và hãy cảnh giác với kiểu chẻ file giả tạo: dời hàm sang file mới mà không đổi ai gọi ai thì bạn vẫn có đúng mớ bòng bong ấy, chỉ là trải ra trên tám file. Nếu phần tách ra vẫn phải với ngược về file gốc thì bạn mới tìm được một chỗ ngắt trang, chưa phải một ranh giới.',
          ),
        }),
      ],
    },
  ],
};
