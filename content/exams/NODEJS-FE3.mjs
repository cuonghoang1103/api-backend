/**
 * Node.js — Final Exam 3 (FE-3): 50 câu trắc nghiệm phủ cả 18 chương.
 *
 * Đề tự soạn, bám sát `content/courses/nodejs/s01…s18`. Mọi đoạn mã hỏi
 * "in ra gì" đều đã CHẠY THẬT bằng `node` v22.21.0
 * (harness scratchpad/fe3-verify.mjs + fe2-verify*.mjs cho phần dùng lại).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-FE3.mjs --apply
 */
import { B, EX, code, mcq } from './_lib/nodejs-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam 3</b> — 50 multiple-choice questions across all 18 chapters. Like the other finals it favours reading real code over intuition: every printed output here was produced by running the snippet on Node v22.</p>' +
  '<p>A few questions say "choose TWO" — they only count as correct when both answers are selected. You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá 3</b> — 50 câu trắc nghiệm phủ cả 18 chương. Như các đề cuối khác, nó thiên về đọc mã thật hơn là đoán: mọi kết quả in ra ở đây đều lấy từ việc chạy đoạn mã trên Node v22.</p>' +
  '<p>Vài câu ghi "chọn HAI" — chỉ đúng khi chọn đủ cả hai đáp án. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-3',
      source: 'SAMPLE',
      sortOrder: 6,
      title: B(
        'Final Exam 3 — the whole Node.js course (50 questions)',
        'Thi cuối khoá 3 — toàn bộ khoá Node.js (50 câu)',
      ),
      description: B(
        'A third full-course final: fifty fresh multiple-choice questions across all eighteen chapters — coercion, the event loop, streams, Express, PostgreSQL, auth, security, Redis, queues, testing, observability, performance, Docker and architecture.',
        'Đề cuối khoá thứ ba: năm mươi câu trắc nghiệm mới phủ cả mười tám chương — ép kiểu, vòng lặp sự kiện, stream, Express, PostgreSQL, xác thực, bảo mật, Redis, hàng đợi, kiểm thử, quan sát hệ thống, hiệu năng, Docker và kiến trúc.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ═══ 29 câu MỚI (bổ sung, khác hẳn FE-1/FE-2) ═══

        // ── Ch1 ──
        mcq({
          prompt: B(
            'What does this print?' + code("console.log([typeof null, typeof NaN, typeof [], Array.isArray([])]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([typeof null, typeof NaN, typeof [], Array.isArray([])]);"),
          ),
          options: [
            B("<code>['null', 'NaN', 'array', true]</code>", "<code>['null', 'NaN', 'array', true]</code>"),
            B("<code>['object', 'number', 'object', true]</code>", "<code>['object', 'number', 'object', true]</code>"),
            B("<code>['object', 'NaN', 'array', false]</code>", "<code>['object', 'NaN', 'array', false]</code>"),
            B("<code>['null', 'number', 'object', true]</code>", "<code>['null', 'number', 'object', true]</code>"),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>typeof null</code> is <code>&#x27;object&#x27;</code> — a famous historical bug that cannot be fixed without breaking the web. <code>typeof NaN</code> is <code>&#x27;number&#x27;</code> (NaN is a numeric value). Arrays are objects, so <code>typeof []</code> is <code>&#x27;object&#x27;</code>; use <code>Array.isArray</code> to actually test for an array.',
            'Đã chạy thật. <code>typeof null</code> là <code>&#x27;object&#x27;</code> — một lỗi lịch sử nổi tiếng không thể sửa vì sẽ làm vỡ web. <code>typeof NaN</code> là <code>&#x27;number&#x27;</code> (NaN là một giá trị số). Mảng là object, nên <code>typeof []</code> là <code>&#x27;object&#x27;</code>; dùng <code>Array.isArray</code> để thật sự kiểm một mảng.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log(['1', '2', '3'].map(parseInt));"),
            'Đoạn mã sau in ra gì?' + code("console.log(['1', '2', '3'].map(parseInt));"),
          ),
          options: [
            B('<code>[1, 2, 3]</code>', '<code>[1, 2, 3]</code>'),
            B('<code>[1, NaN, NaN]</code>', '<code>[1, NaN, NaN]</code>'),
            B('<code>[NaN, NaN, NaN]</code>', '<code>[NaN, NaN, NaN]</code>'),
            B('<code>[1, 2, NaN]</code>', '<code>[1, 2, NaN]</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>map</code> calls <code>parseInt(value, index)</code>, so it passes the array index as the radix: <code>parseInt(&#x27;1&#x27;, 0)</code> → 1 (radix 0 means default 10), <code>parseInt(&#x27;2&#x27;, 1)</code> → NaN (radix 1 is invalid), <code>parseInt(&#x27;3&#x27;, 2)</code> → NaN (3 is not a base-2 digit). Use <code>.map(Number)</code> or <code>.map(x =&gt; parseInt(x, 10))</code>.',
            'Đã chạy thật. <code>map</code> gọi <code>parseInt(value, index)</code>, nên nó truyền chỉ số mảng làm cơ số: <code>parseInt(&#x27;1&#x27;, 0)</code> → 1 (cơ số 0 nghĩa là mặc định 10), <code>parseInt(&#x27;2&#x27;, 1)</code> → NaN (cơ số 1 không hợp lệ), <code>parseInt(&#x27;3&#x27;, 2)</code> → NaN (3 không phải chữ số hệ 2). Dùng <code>.map(Number)</code> hoặc <code>.map(x =&gt; parseInt(x, 10))</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([1 + 2 + '3', '1' + 2 + 3, true + true, 'b' + +'a']);"),
            'Đoạn mã sau in ra gì?' + code("console.log([1 + 2 + '3', '1' + 2 + 3, true + true, 'b' + +'a']);"),
          ),
          options: [
            B("<code>['33', '123', 2, 'bNaN']</code>", "<code>['33', '123', 2, 'bNaN']</code>"),
            B("<code>['123', '123', 2, 'ba']</code>", "<code>['123', '123', 2, 'ba']</code>"),
            B("<code>['33', '6', true, 'bNaN']</code>", "<code>['33', '6', true, 'bNaN']</code>"),
            B("<code>['6', '123', 'truetrue', 'ba']</code>", "<code>['6', '123', 'truetrue', 'ba']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>+</code> is left-associative: <code>1 + 2</code> is 3 then <code>+ &#x27;3&#x27;</code> concatenates to <code>&#x27;33&#x27;</code>; <code>&#x27;1&#x27; + 2</code> is already a string so it stays <code>&#x27;123&#x27;</code>. <code>true + true</code> coerces booleans to numbers → 2. And <code>+&#x27;a&#x27;</code> is NaN, so <code>&#x27;b&#x27; + NaN</code> is <code>&#x27;bNaN&#x27;</code>.',
            'Đã chạy thật. <code>+</code> kết hợp trái: <code>1 + 2</code> là 3 rồi <code>+ &#x27;3&#x27;</code> nối thành <code>&#x27;33&#x27;</code>; <code>&#x27;1&#x27; + 2</code> đã là chuỗi nên thành <code>&#x27;123&#x27;</code>. <code>true + true</code> ép boolean về số → 2. Và <code>+&#x27;a&#x27;</code> là NaN, nên <code>&#x27;b&#x27; + NaN</code> là <code>&#x27;bNaN&#x27;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([...'ab😀'].length, 'ab😀'.length);"),
            'Đoạn mã sau in ra gì?' + code("console.log([...'ab😀'].length, 'ab😀'.length);"),
          ),
          options: [
            B('<code>3 4</code>', '<code>3 4</code>'),
            B('<code>4 4</code>', '<code>4 4</code>'),
            B('<code>3 3</code>', '<code>3 3</code>'),
            B('<code>4 3</code>', '<code>4 3</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The emoji is a single code point but takes two UTF-16 code units (a surrogate pair), so <code>&#x27;ab😀&#x27;.length</code> counts 4. The spread operator iterates by code point, giving 3 elements. This is why <code>.length</code> and slicing can split an emoji in half — iterate or use <code>Array.from</code> when characters matter.',
            'Đã chạy thật. Emoji là một code point nhưng chiếm hai đơn vị mã UTF-16 (một cặp surrogate), nên <code>&#x27;ab😀&#x27;.length</code> đếm ra 4. Toán tử spread lặp theo code point, cho 3 phần tử. Đây là lý do <code>.length</code> và cắt chuỗi có thể xẻ đôi một emoji — hãy lặp hoặc dùng <code>Array.from</code> khi ký tự quan trọng.',
          ),
        }),

        // ── Ch2 ──
        mcq({
          prompt: B(
            'In what order does this print?' + code(
              "Promise.resolve().then(() => console.log('A')).then(() => console.log('C'));\n" +
              "Promise.resolve().then(() => console.log('B')).then(() => console.log('D'));",
            ),
            'Đoạn mã sau in ra theo thứ tự nào?' + code(
              "Promise.resolve().then(() => console.log('A')).then(() => console.log('C'));\n" +
              "Promise.resolve().then(() => console.log('B')).then(() => console.log('D'));",
            ),
          ),
          options: [
            B('A C B D', 'A C B D'),
            B('A B C D', 'A B C D'),
            B('A B D C', 'A B D C'),
            B('A C D B', 'A C D B'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. Both first <code>.then</code> callbacks (A, B) are queued as microtasks and run in order: A, B. Each schedules its next <code>.then</code> (C, D) only when it finishes, so C and D land in a later microtask round after A and B. The result interleaves to A, B, C, D — not A, C, B, D.',
            'Đã chạy thật. Cả hai callback <code>.then</code> đầu (A, B) được xếp làm microtask và chạy theo thứ tự: A, B. Mỗi cái chỉ xếp <code>.then</code> kế (C, D) khi nó xong, nên C và D rơi vào vòng microtask sau A và B. Kết quả xen kẽ thành A, B, C, D — không phải A, C, B, D.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "function f() { try { return 1; } finally { console.log('finally'); } }\n" +
              "console.log(f());",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "function f() { try { return 1; } finally { console.log('finally'); } }\n" +
              "console.log(f());",
            ),
          ),
          options: [
            B('<code>1</code> then <code>finally</code>', '<code>1</code> rồi <code>finally</code>'),
            B('<code>finally</code> then <code>1</code>', '<code>finally</code> rồi <code>1</code>'),
            B('<code>finally</code> only', 'Chỉ <code>finally</code>'),
            B('<code>1</code> only', 'Chỉ <code>1</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. The <code>finally</code> block always runs before the function actually returns, even though the return value 1 was already computed. So <code>&#x27;finally&#x27;</code> prints first (inside <code>f</code>), then the caller prints the returned <code>1</code>. Note a <code>return</code> inside <code>finally</code> would override the try&#x27;s value — a common footgun.',
            'Đã chạy thật. Khối <code>finally</code> luôn chạy trước khi hàm thật sự trả về, dù giá trị trả 1 đã được tính. Nên <code>&#x27;finally&#x27;</code> in trước (bên trong <code>f</code>), rồi bên gọi in <code>1</code> được trả. Lưu ý một <code>return</code> trong <code>finally</code> sẽ đè giá trị của try — một cái bẫy quen thuộc.',
          ),
        }),

        // ── Ch3 ──
        mcq({
          prompt: B(
            'What does this print?' + code("console.log(Buffer.from('SGVsbG8gVk4=', 'base64').toString('utf8'));"),
            'Đoạn mã sau in ra gì?' + code("console.log(Buffer.from('SGVsbG8gVk4=', 'base64').toString('utf8'));"),
          ),
          options: [
            B('<code>Hello VN</code>', '<code>Hello VN</code>'),
            B('<code>SGVsbG8gVk4=</code>', '<code>SGVsbG8gVk4=</code>'),
            B('A binary blob', 'Một khối nhị phân'),
            B('An empty string', 'Một chuỗi rỗng'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>Buffer.from(str, &#x27;base64&#x27;)</code> decodes the base64 text into raw bytes, and <code>.toString(&#x27;utf8&#x27;)</code> interprets those bytes as text — round-tripping <code>&#x27;Hello VN&#x27;</code>. Buffers are how Node moves binary data (file contents, network frames, crypto output) and convert between encodings like utf8, hex and base64.',
            'Đã chạy thật. <code>Buffer.from(str, &#x27;base64&#x27;)</code> giải văn bản base64 thành byte thô, và <code>.toString(&#x27;utf8&#x27;)</code> diễn giải các byte đó thành văn bản — quay vòng ra <code>&#x27;Hello VN&#x27;</code>. Buffer là cách Node di chuyển dữ liệu nhị phân (nội dung tệp, khung mạng, kết quả crypto) và chuyển đổi giữa các mã hoá như utf8, hex và base64.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const p = require('path');\n" +
              "console.log(p.basename('/a/b/c.js'), p.dirname('/a/b/c.js'), p.basename('/a/b/c.js', '.js'));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const p = require('path');\n" +
              "console.log(p.basename('/a/b/c.js'), p.dirname('/a/b/c.js'), p.basename('/a/b/c.js', '.js'));",
            ),
          ),
          options: [
            B('<code>c.js /a/b c</code>', '<code>c.js /a/b c</code>'),
            B('<code>c /a/b/c c.js</code>', '<code>c /a/b/c c.js</code>'),
            B('<code>c.js /a/b/c c</code>', '<code>c.js /a/b/c c</code>'),
            B('<code>/a/b/c.js /a/b c</code>', '<code>/a/b/c.js /a/b c</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>basename</code> returns the last path segment (<code>c.js</code>), or with a suffix argument strips it (<code>c</code>). <code>dirname</code> returns everything before the last segment (<code>/a/b</code>). Using the <code>path</code> module rather than string splitting keeps this correct across platforms and edge cases like trailing slashes.',
            'Đã chạy thật. <code>basename</code> trả đoạn cuối của đường dẫn (<code>c.js</code>), hoặc với đối số hậu tố thì cắt bỏ nó (<code>c</code>). <code>dirname</code> trả mọi thứ trước đoạn cuối (<code>/a/b</code>). Dùng module <code>path</code> thay vì tự cắt chuỗi giữ đúng qua mọi nền tảng và các ca biên như dấu gạch chéo cuối.',
          ),
        }),

        // ── Ch4 npm ──
        mcq({
          prompt: B(
            'What does <code>package-lock.json</code> actually guarantee that <code>package.json</code> alone does not?',
            '<code>package-lock.json</code> bảo đảm điều gì mà một mình <code>package.json</code> không có?',
          ),
          options: [
            B('It makes installs faster by compressing all dependencies into one file', 'Nó làm cài đặt nhanh hơn bằng cách nén mọi phụ thuộc vào một tệp'),
            B('It records the exact resolved version and integrity hash of every package in the whole tree, so installs are reproducible byte-for-byte', 'Nó ghi lại đúng phiên bản đã giải và hash toàn vẹn của mọi gói trong cả cây, nên cài đặt tái lập từng byte'),
            B('It lets you skip publishing a version to the registry entirely', 'Nó cho phép bỏ hẳn bước phát hành một phiên bản lên registry'),
            B('It automatically upgrades every dependency to its latest major version', 'Nó tự nâng mọi phụ thuộc lên phiên bản major mới nhất'),
          ],
          correct: 1,
          explanation: EX(
            '<code>package.json</code> only states ranges like <code>^1.4.0</code>; the lockfile pins the one version that range resolved to <em>and</em> every transitive dependency, with integrity hashes. That is what makes <code>npm ci</code> install the identical tree on every machine and CI run, so "works on my laptop" and "works in production" mean the same dependency graph.',
            '<code>package.json</code> chỉ ghi các khoảng như <code>^1.4.0</code>; lockfile khoá đúng một phiên bản mà khoảng đó giải ra <em>cùng</em> mọi phụ thuộc bắc cầu, kèm hash toàn vẹn. Đó là thứ khiến <code>npm ci</code> cài cây y hệt trên mọi máy và mọi lần chạy CI, nên "chạy trên laptop của tôi" và "chạy trên production" là cùng một đồ thị phụ thuộc.',
          ),
        }),

        // ── Ch5 Express ──
        mcq({
          prompt: B(
            'A POST route reads <code>req.body</code> but it is always <code>undefined</code>. What is the most likely cause?',
            'Một route POST đọc <code>req.body</code> nhưng luôn là <code>undefined</code>. Nguyên nhân khả dĩ nhất?',
          ),
          options: [
            B('Express cannot read POST bodies without a plugin from npm that must be paid for', 'Express không đọc được thân POST nếu thiếu một plugin trả phí từ npm'),
            B('The body-parsing middleware (<code>express.json()</code>) is missing or mounted after the route, so nothing populated <code>req.body</code>', 'Middleware phân tích thân (<code>express.json()</code>) bị thiếu hoặc gắn sau route, nên không gì điền vào <code>req.body</code>'),
            B('POST requests never carry a body; you must use GET with query parameters instead', 'Request POST không bao giờ mang thân; phải dùng GET với tham số query'),
            B('<code>req.body</code> only works when the client sends form-encoded data, never JSON', '<code>req.body</code> chỉ hoạt động khi client gửi dữ liệu form-encoded, không bao giờ với JSON'),
          ],
          correct: 1,
          explanation: EX(
            'Express does not parse request bodies by default. You must register <code>app.use(express.json())</code> (and/or <code>express.urlencoded()</code>) <em>before</em> the routes that read <code>req.body</code>; middleware runs in registration order, so mounting it after the route leaves <code>req.body</code> undefined. It also only parses when the <code>Content-Type</code> matches.',
            'Express mặc định không phân tích thân request. Bạn phải đăng ký <code>app.use(express.json())</code> (và/hoặc <code>express.urlencoded()</code>) <em>trước</em> các route đọc <code>req.body</code>; middleware chạy theo thứ tự đăng ký, nên gắn nó sau route để <code>req.body</code> là undefined. Nó cũng chỉ phân tích khi <code>Content-Type</code> khớp.',
          ),
        }),

        mcq({
          prompt: B(
            'You define <code>app.get(&#x27;/users/:id&#x27;, ...)</code> and <code>app.get(&#x27;/users/new&#x27;, ...)</code>. A request to <code>/users/new</code> hits the <code>:id</code> handler with <code>id = &#x27;new&#x27;</code>. Why, and the fix?',
            'Bạn định nghĩa <code>app.get(&#x27;/users/:id&#x27;, ...)</code> và <code>app.get(&#x27;/users/new&#x27;, ...)</code>. Một request tới <code>/users/new</code> lại vào handler <code>:id</code> với <code>id = &#x27;new&#x27;</code>. Vì sao, và cách sửa?',
          ),
          options: [
            B('Express matches routes alphabetically; rename the route to sort first', 'Express khớp route theo bảng chữ cái; đổi tên route để nó xếp trước'),
            B('Express matches in registration order and <code>:id</code> matches anything; declare <code>/users/new</code> first', 'Express khớp theo thứ tự đăng ký và <code>:id</code> khớp mọi thứ; khai báo <code>/users/new</code> trước'),
            B('It is a bug in Express routing itself, with no reliable workaround available', 'Đây là lỗi của chính định tuyến Express, không có cách khắc phục đáng tin'),
            B('Parameterised routes are always evaluated last, regardless of registration order', 'Route có tham số luôn được xét cuối, bất kể thứ tự đăng ký'),
          ],
          correct: 1,
          explanation: EX(
            'Express tries routes in the order you register them and stops at the first match. <code>/users/:id</code> matches <code>/users/new</code> too, so if it is registered first it captures the request with <code>id = &#x27;new&#x27;</code>. Put the more specific literal route (<code>/users/new</code>) above the parameterised one.',
            'Express thử route theo thứ tự bạn đăng ký và dừng ở khớp đầu tiên. <code>/users/:id</code> khớp cả <code>/users/new</code>, nên nếu đăng ký trước thì nó bắt request với <code>id = &#x27;new&#x27;</code>. Hãy đặt route chữ cụ thể hơn (<code>/users/new</code>) lên trên route có tham số.',
          ),
        }),

        // ── Ch7 ──
        mcq({
          prompt: B(
            'What does this print, and why does it matter for pagination parameters?' + code(
              "const limit = '0';\n" +
              "console.log([limit ?? 20, limit || 20, Number(limit) || 20]);",
            ),
            'Đoạn mã in ra gì, và vì sao nó quan trọng với tham số phân trang?' + code(
              "const limit = '0';\n" +
              "console.log([limit ?? 20, limit || 20, Number(limit) || 20]);",
            ),
          ),
          options: [
            B("<code>['0', '0', 20]</code>", "<code>['0', '0', 20]</code>"),
            B("<code>[20, 20, 20]</code>", "<code>[20, 20, 20]</code>"),
            B("<code>['0', 20, 0]</code>", "<code>['0', 20, 0]</code>"),
            B("<code>[0, 0, 0]</code>", "<code>[0, 0, 0]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>limit</code> is the string <code>&#x27;0&#x27;</code>, which is truthy, so both <code>??</code> and <code>||</code> pass it through unchanged as <code>&#x27;0&#x27;</code>. Only after <code>Number(&#x27;0&#x27;)</code> → 0 (falsy) does <code>|| 20</code> replace it. A raw query param is a string, so guard clamps must convert first — and decide whether <code>limit=0</code> is even allowed.',
            'Đã chạy thật. <code>limit</code> là chuỗi <code>&#x27;0&#x27;</code>, vốn truthy, nên cả <code>??</code> lẫn <code>||</code> đều để nguyên nó là <code>&#x27;0&#x27;</code>. Chỉ sau khi <code>Number(&#x27;0&#x27;)</code> → 0 (falsy) thì <code>|| 20</code> mới thay. Một tham số query thô là chuỗi, nên các phép kẹp phải chuyển đổi trước — và quyết định xem <code>limit=0</code> có được phép không.',
          ),
        }),

        // ── Ch8 ──
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const c = require('crypto');\n" +
              "console.log([c.randomBytes(16).length, c.createHmac('sha256', 'key').update('msg').digest('hex').length]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const c = require('crypto');\n" +
              "console.log([c.randomBytes(16).length, c.createHmac('sha256', 'key').update('msg').digest('hex').length]);",
            ),
          ),
          options: [
            B('<code>[16, 64]</code>', '<code>[16, 64]</code>'),
            B('<code>[16, 32]</code>', '<code>[16, 32]</code>'),
            B('<code>[32, 64]</code>', '<code>[32, 64]</code>'),
            B('<code>[16, 256]</code>', '<code>[16, 256]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>randomBytes(16)</code> is a 16-byte Buffer. A SHA-256 HMAC is 256 bits = 32 bytes, and printed as hex each byte becomes 2 characters → 64. An HMAC (keyed hash) is how you sign a message so a recipient with the same secret can verify it was not tampered with — the mechanism behind a signed JWT.',
            'Đã chạy thật. <code>randomBytes(16)</code> là một Buffer 16 byte. HMAC SHA-256 là 256 bit = 32 byte, và in ra hex thì mỗi byte thành 2 ký tự → 64. HMAC (băm có khoá) là cách bạn ký một message để bên nhận có cùng bí mật xác minh nó không bị sửa — cơ chế đằng sau một JWT đã ký.',
          ),
        }),

        // ── Ch9 ──
        mcq({
          prompt: B(
            'What does this print, and what attack does the first form defend against?' + code(
              "console.log([encodeURIComponent('a b&c=<x>'), JSON.stringify('</script>')]);",
            ),
            'Đoạn mã in ra gì, và dạng đầu tiên phòng thủ tấn công nào?' + code(
              "console.log([encodeURIComponent('a b&c=<x>'), JSON.stringify('</script>')]);",
            ),
          ),
          options: [
            B("<code>['a%20b%26c%3D%3Cx%3E', '\"</script>\"']</code>", "<code>['a%20b%26c%3D%3Cx%3E', '\"</script>\"']</code>"),
            B("<code>['a b&c=<x>', '</script>']</code> — neither input is changed at all", "<code>['a b&c=<x>', '</script>']</code> — không đầu vào nào bị đổi"),
            B("<code>['a+b+c', 'script']</code> — spaces become plus signs", "<code>['a+b+c', 'script']</code> — dấu cách thành dấu cộng"),
            B("It throws an error on the <code>&lt;</code> character", "Nó ném lỗi ở ký tự <code>&lt;</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>encodeURIComponent</code> percent-encodes characters that have meaning in a URL (space, <code>&amp;</code>, <code>=</code>, <code>&lt;</code>, <code>&gt;</code>), so user input cannot inject extra query parameters or break the URL structure. Encoding is always contextual: a value safe in a URL still needs HTML-escaping before it goes into a page, or it becomes an XSS hole.',
            'Đã chạy thật. <code>encodeURIComponent</code> mã hoá phần trăm các ký tự có nghĩa trong URL (dấu cách, <code>&amp;</code>, <code>=</code>, <code>&lt;</code>, <code>&gt;</code>), nên input người dùng không thể chèn thêm tham số query hay phá cấu trúc URL. Mã hoá luôn theo ngữ cảnh: một giá trị an toàn trong URL vẫn cần escape HTML trước khi vào trang, nếu không nó thành một lỗ XSS.',
          ),
        }),

        mcq({
          prompt: B(
            'Your Express rate limiter keys on IP but runs behind nginx, so every request looks like it comes from <code>127.0.0.1</code> and one abuser is never limited. What is the fix?',
            'Bộ giới hạn tần suất Express của bạn khoá theo IP nhưng chạy sau nginx, nên mọi request trông như từ <code>127.0.0.1</code> và một kẻ lạm dụng không bao giờ bị chặn. Cách sửa?',
          ),
          options: [
            B('Disable the rate limiter entirely, since it cannot work correctly behind any proxy', 'Tắt hẳn bộ giới hạn tần suất, vì nó không thể chạy đúng sau bất kỳ proxy nào'),
            B('Set <code>trust proxy</code> so Express reads the client IP from <code>X-Forwarded-For</code>, but only trust that header from your own proxy', 'Đặt <code>trust proxy</code> để Express đọc IP client từ <code>X-Forwarded-For</code>, nhưng chỉ tin header đó từ chính proxy của bạn'),
            B('Key the limiter on the User-Agent header string instead of the client IP address', 'Khoá bộ giới hạn theo chuỗi header User-Agent thay vì địa chỉ IP client'),
            B('Increase the limit high enough that the shared proxy IP is never blocked', 'Tăng giới hạn đủ cao để IP proxy dùng chung không bao giờ bị chặn'),
          ],
          correct: 1,
          explanation: EX(
            'Behind a reverse proxy, the socket IP is the proxy&#x27;s, so you configure <code>trust proxy</code> to read the client IP from <code>X-Forwarded-For</code>. The catch: that header is client-controlled, so you must only trust it from hops you own (your nginx), otherwise an attacker spoofs it to dodge or frame others. Keying on User-Agent is trivially forged.',
            'Sau một reverse proxy, IP socket là của proxy, nên bạn cấu hình <code>trust proxy</code> để đọc IP client từ <code>X-Forwarded-For</code>. Điều cần lưu ý: header đó do client kiểm soát, nên bạn chỉ được tin nó từ các chặng bạn sở hữu (nginx của bạn), nếu không kẻ tấn công giả nó để né hoặc gán tội cho người khác. Khoá theo User-Agent thì giả cực dễ.',
          ),
        }),

        // ── Ch10 ──
        mcq({
          prompt: B(
            'A user uploads <code>evil.exe</code> renamed to <code>photo.png</code>. Your server trusts the <code>.png</code> extension and serves it back. Why is validating by extension (or the client&#x27;s Content-Type) unsafe?',
            'Người dùng upload <code>evil.exe</code> đổi tên thành <code>photo.png</code>. Server tin phần mở rộng <code>.png</code> và phục vụ lại nó. Vì sao xác thực theo phần mở rộng (hoặc Content-Type do client gửi) là không an toàn?',
          ),
          options: [
            B('It is perfectly safe, because the file extension always reflects the real file type', 'Hoàn toàn an toàn, vì phần mở rộng luôn phản ánh đúng loại tệp thật'),
            B('Both the filename and the client Content-Type are attacker-controlled; validate the real type from the file&#x27;s magic bytes', 'Cả tên tệp lẫn Content-Type do client gửi đều do kẻ tấn công kiểm soát; hãy xác thực loại thật từ magic bytes của tệp'),
            B('The only real risk is cosmetic: the image might simply fail to display', 'Rủi ro thật duy nhất là thẩm mỹ: ảnh có thể chỉ không hiển thị được'),
            B('Renaming a file changes its actual bytes, so it becomes a genuine PNG', 'Đổi tên tệp làm đổi byte thật, nên nó trở thành một PNG thật'),
          ],
          correct: 1,
          explanation: EX(
            'The extension and the <code>Content-Type</code> header are just claims the client makes; neither reflects the bytes. Detect the true type by reading the file&#x27;s signature (magic bytes), enforce an allow-list, and serve user uploads from a location/headers that prevent execution (and ideally a separate domain). Otherwise a disguised file can lead to code execution or stored XSS.',
            'Phần mở rộng và header <code>Content-Type</code> chỉ là lời khai của client; không cái nào phản ánh byte thật. Hãy nhận diện loại thật bằng cách đọc chữ ký của tệp (magic bytes), áp một danh sách cho phép, và phục vụ upload của người dùng từ vị trí/header ngăn thực thi (và lý tưởng là một tên miền riêng). Nếu không, một tệp nguỵ trang có thể dẫn tới thực thi mã hoặc XSS lưu trữ.',
          ),
        }),

        // ── Ch11 ──
        mcq({
          prompt: B(
            'What does this print, and why does it bite realtime payloads?' + code(
              "const o = { t: new Date(0) };\n" +
              "const back = JSON.parse(JSON.stringify(o));\n" +
              "console.log([back.t, typeof back.t]);",
            ),
            'Đoạn mã in ra gì, và vì sao nó cắn vào payload realtime?' + code(
              "const o = { t: new Date(0) };\n" +
              "const back = JSON.parse(JSON.stringify(o));\n" +
              "console.log([back.t, typeof back.t]);",
            ),
          ),
          options: [
            B("<code>['1970-01-01T00:00:00.000Z', 'string']</code>", "<code>['1970-01-01T00:00:00.000Z', 'string']</code>"),
            B("<code>[1970-01-01T00:00:00.000Z, 'object']</code> — it stays a real Date object", "<code>[1970-01-01T00:00:00.000Z, 'object']</code> — nó vẫn là một Date thật"),
            B("<code>[0, 'number']</code> — a Date serialises to its epoch millis", "<code>[0, 'number']</code> — Date tuần tự hoá thành mili-giây epoch"),
            B("It throws, because a Date is not JSON-serialisable", "Nó ném lỗi, vì Date không tuần tự hoá JSON được"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>JSON.stringify</code> calls <code>Date.prototype.toJSON</code>, producing an ISO string, and <code>JSON.parse</code> has no idea it was a Date, so it comes back as a plain string. Any payload sent over a socket or HTTP as JSON loses its Date/Map/Set types — the client must re-parse dates itself. Compare <code>structuredClone</code>, which preserves them in-process.',
            'Đã chạy thật. <code>JSON.stringify</code> gọi <code>Date.prototype.toJSON</code>, tạo một chuỗi ISO, và <code>JSON.parse</code> không biết nó từng là Date, nên nó trở lại thành một chuỗi thường. Mọi payload gửi qua socket hay HTTP dạng JSON đều mất kiểu Date/Map/Set — client phải tự phân tích lại ngày. So với <code>structuredClone</code>, vốn giữ chúng trong tiến trình.',
          ),
        }),

        // ── Ch12 ──
        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log([\n" +
              "  JSON.stringify(new Map([['a', 1]])),\n" +
              "  JSON.stringify([...new Map([['a', 1]])]),\n" +
              "  JSON.stringify(Object.fromEntries(new Map([['a', 1]]))),\n" +
              "]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log([\n" +
              "  JSON.stringify(new Map([['a', 1]])),\n" +
              "  JSON.stringify([...new Map([['a', 1]])]),\n" +
              "  JSON.stringify(Object.fromEntries(new Map([['a', 1]]))),\n" +
              "]);",
            ),
          ),
          options: [
            B('<code>[&#x27;{}&#x27;, &#x27;[["a",1]]&#x27;, &#x27;{"a":1}&#x27;]</code>', '<code>[&#x27;{}&#x27;, &#x27;[["a",1]]&#x27;, &#x27;{"a":1}&#x27;]</code>'),
            B('<code>[&#x27;{"a":1}&#x27;, &#x27;{"a":1}&#x27;, &#x27;{"a":1}&#x27;]</code>', '<code>[&#x27;{"a":1}&#x27;, &#x27;{"a":1}&#x27;, &#x27;{"a":1}&#x27;]</code>'),
            B('<code>[&#x27;{"a":1}&#x27;, &#x27;[["a",1]]&#x27;, &#x27;{}&#x27;]</code>', '<code>[&#x27;{"a":1}&#x27;, &#x27;[["a",1]]&#x27;, &#x27;{}&#x27;]</code>'),
            B('It throws on the first line', 'Nó ném lỗi ở dòng đầu'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>JSON.stringify</code> does not know how to serialise a Map, so it produces <code>&#x27;{}&#x27;</code> — silently losing your data. You must convert first: spread to entries (<code>[["a",1]]</code>) or <code>Object.fromEntries</code> to a plain object (<code>{"a":1}</code>). This is why caching a Map straight to Redis or a JSON column drops everything.',
            'Đã chạy thật. <code>JSON.stringify</code> không biết cách tuần tự hoá một Map, nên nó tạo ra <code>&#x27;{}&#x27;</code> — âm thầm làm mất dữ liệu của bạn. Bạn phải chuyển đổi trước: spread thành các cặp (<code>[["a",1]]</code>) hoặc <code>Object.fromEntries</code> thành object thường (<code>{"a":1}</code>). Đây là lý do cache thẳng một Map vào Redis hay một cột JSON làm rơi hết.',
          ),
        }),

        // ── Ch13 ──
        mcq({
          prompt: B(
            'A retry policy uses exponential backoff capped at 8000ms. What does this print for attempts 0–4?' + code(
              "console.log([0, 1, 2, 3, 4].map(n => Math.min(1000 * 2 ** n, 8000)));",
            ),
            'Một chính sách thử lại dùng backoff mũ, trần 8000ms. Nó in ra gì cho các lần thử 0–4?' + code(
              "console.log([0, 1, 2, 3, 4].map(n => Math.min(1000 * 2 ** n, 8000)));",
            ),
          ),
          options: [
            B('<code>[1000, 2000, 4000, 8000, 8000]</code>', '<code>[1000, 2000, 4000, 8000, 8000]</code>'),
            B('<code>[1000, 2000, 4000, 8000, 16000]</code>', '<code>[1000, 2000, 4000, 8000, 16000]</code>'),
            B('<code>[0, 2000, 4000, 8000, 8000]</code>', '<code>[0, 2000, 4000, 8000, 8000]</code>'),
            B('<code>[1000, 1000, 1000, 1000, 1000]</code>', '<code>[1000, 1000, 1000, 1000, 1000]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The delay doubles each attempt (1000, 2000, 4000, 8000) then the <code>Math.min</code> cap holds it at 8000. Exponential backoff stops a failing dependency from being hammered by immediate retries; real systems also add jitter (randomness) so many clients do not retry in lockstep and cause a thundering herd.',
            'Đã chạy thật. Độ trễ nhân đôi mỗi lần thử (1000, 2000, 4000, 8000) rồi trần <code>Math.min</code> giữ nó ở 8000. Backoff mũ ngăn một phụ thuộc đang hỏng bị dội bởi các lần thử lại tức thì; hệ thống thật còn thêm jitter (ngẫu nhiên) để nhiều client không thử lại đồng loạt gây ra một cơn dội đồng bộ.',
          ),
        }),

        // ── Ch14 ──
        mcq({
          prompt: B(
            'A test asserts <code>0.1 + 0.2 === 0.3</code> and fails. What does this print, and what is the right way to assert on floats?' + code(
              "console.log([0.1 + 0.2 === 0.3, Math.abs((0.1 + 0.2) - 0.3) < 1e-9]);",
            ),
            'Một test khẳng định <code>0.1 + 0.2 === 0.3</code> và thất bại. Đoạn mã in ra gì, và cách đúng để khẳng định trên số thực?' + code(
              "console.log([0.1 + 0.2 === 0.3, Math.abs((0.1 + 0.2) - 0.3) < 1e-9]);",
            ),
          ),
          options: [
            B('<code>[false, true]</code> — assert floats are within a small epsilon, not exactly equal', '<code>[false, true]</code> — khẳng định số thực nằm trong một epsilon nhỏ, không bằng tuyệt đối'),
            B('<code>[true, true]</code> — both comparisons pass', '<code>[true, true]</code> — cả hai phép so đều đúng'),
            B('<code>[false, false]</code> — floats can never be compared', '<code>[false, false]</code> — số thực không bao giờ so được'),
            B('<code>[true, false]</code>', '<code>[true, false]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Exact equality fails because of floating-point representation, but the difference is tiny, so an epsilon check passes. Test frameworks provide this as <code>toBeCloseTo</code>. The wider lesson: a test that asserts on an exact float (or on iteration order, timestamps, or a generated id) is fragile and will flake.',
            'Đã chạy thật. So bằng tuyệt đối thất bại vì cách biểu diễn số thực, nhưng chênh lệch rất nhỏ, nên phép kiểm epsilon đúng. Các framework test cung cấp nó dưới dạng <code>toBeCloseTo</code>. Bài học rộng hơn: một test khẳng định trên một số thực chính xác (hoặc thứ tự lặp, dấu thời gian, hay một id sinh ra) là mong manh và sẽ chập chờn.',
          ),
        }),

        // ── Ch15 ──
        mcq({
          prompt: B(
            'Across a request that fans out to 3 services and 12 log lines, how do you reconstruct the full story of one request?',
            'Với một request toả ra 3 service và 12 dòng log, làm sao dựng lại toàn bộ câu chuyện của một request?',
          ),
          options: [
            B('Sort all logs by timestamp and read top to bottom', 'Sắp mọi log theo dấu thời gian và đọc từ trên xuống'),
            B('Generate a correlation/request id at the edge and attach it to every log line and downstream call, then filter logs by that id', 'Sinh một correlation/request id ở rìa và gắn nó vào mọi dòng log và mọi lời gọi phía sau, rồi lọc log theo id đó'),
            B('Increase the log level to debug for every request in production', 'Tăng mức log lên debug cho mọi request trên production'),
            B('Give each service its own separate log file and grep them one by one', 'Cho mỗi service một tệp log riêng và grep từng cái một'),
          ],
          correct: 1,
          explanation: EX(
            'Under concurrency, timestamps interleave requests, so sorting by time does not isolate one request. You mint a request id at the entry point, thread it through logs and calls to other services (a header), and later filter every line by that id to see the whole trace. This is the backbone of structured logging and distributed tracing.',
            'Dưới đồng thời, dấu thời gian đan xen các request, nên sắp theo thời gian không cô lập được một request. Bạn tạo một request id ở điểm vào, luồn nó qua log và các lời gọi tới service khác (một header), rồi về sau lọc mọi dòng theo id đó để thấy trọn dấu vết. Đây là xương sống của log có cấu trúc và truy vết phân tán.',
          ),
        }),

        // ── Ch16 ──
        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log([[...Array(4).keys()], Array(4).fill(0), Array.from({ length: 3 }, (_, i) => i * i)]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log([[...Array(4).keys()], Array(4).fill(0), Array.from({ length: 3 }, (_, i) => i * i)]);",
            ),
          ),
          options: [
            B('<code>[[0,1,2,3], [0,0,0,0], [0,1,4]]</code>', '<code>[[0,1,2,3], [0,0,0,0], [0,1,4]]</code>'),
            B('<code>[[1,2,3,4], [0,0,0,0], [1,4,9]]</code>', '<code>[[1,2,3,4], [0,0,0,0], [1,4,9]]</code>'),
            B('<code>[[0,1,2,3], [], [0,1,4]]</code>', '<code>[[0,1,2,3], [], [0,1,4]]</code>'),
            B('<code>[[0,1,2,3], [0,0,0,0], [0,1,2]]</code>', '<code>[[0,1,2,3], [0,0,0,0], [0,1,2]]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>[...Array(4).keys()]</code> is the standard way to make <code>[0,1,2,3]</code>. <code>Array(4).fill(0)</code> fills the holes with 0. <code>Array.from({length:3}, (_, i) =&gt; i*i)</code> maps indices to squares → <code>[0,1,4]</code>. These idioms build initialised arrays without the sparse-array holes that <code>new Array(n)</code> leaves.',
            'Đã chạy thật. <code>[...Array(4).keys()]</code> là cách chuẩn để tạo <code>[0,1,2,3]</code>. <code>Array(4).fill(0)</code> lấp các lỗ bằng 0. <code>Array.from({length:3}, (_, i) =&gt; i*i)</code> ánh xạ chỉ số thành bình phương → <code>[0,1,4]</code>. Các thành ngữ này dựng mảng đã khởi tạo mà không để lại lỗ mảng thưa như <code>new Array(n)</code>.',
          ),
        }),

        // ── Ch18 ──
        mcq({
          prompt: B(
            'Where should input validation (e.g. "email is required, age is a positive integer") primarily live in a layered Node app?',
            'Xác thực input (ví dụ "email bắt buộc, tuổi là số nguyên dương") nên nằm chủ yếu ở đâu trong một app Node phân tầng?',
          ),
          options: [
            B('Only in the frontend, since the backend can trust what the client sends', 'Chỉ ở frontend, vì backend có thể tin những gì client gửi'),
            B('At the boundary with a schema (reject bad data early), while the service layer enforces business rules and the DB keeps the final constraints', 'Ở ranh giới bằng một schema (từ chối dữ liệu xấu sớm), trong khi tầng service ép quy tắc nghiệp vụ và CSDL giữ ràng buộc cuối'),
            B('Only in the database via <code>CHECK</code> constraints, and nowhere else', 'Chỉ trong CSDL qua ràng buộc <code>CHECK</code>, không nơi nào khác'),
            B('Scattered inside each route handler, duplicated as needed', 'Rải rác trong từng route handler, lặp lại khi cần'),
          ],
          correct: 1,
          explanation: EX(
            'Validate shape at the edge with a schema (zod/Joi) so bad requests fail fast with a 400, but never rely on the client — it is attacker-controlled. Business invariants belong in the service layer where they can be reused, and the database keeps the last line of defence with constraints. Defence in depth, not one single spot.',
            'Xác thực hình dạng ở rìa bằng một schema (zod/Joi) để request xấu thất bại sớm với 400, nhưng đừng bao giờ tin client — nó do kẻ tấn công kiểm soát. Bất biến nghiệp vụ thuộc về tầng service nơi chúng tái dùng được, và CSDL giữ tuyến phòng thủ cuối bằng ràng buộc. Phòng thủ theo chiều sâu, không phải một điểm duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const a = [3, 1, 2];\n" +
              "console.log([a.push(4), a.pop(), a.length, a.slice(0, 2)]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const a = [3, 1, 2];\n" +
              "console.log([a.push(4), a.pop(), a.length, a.slice(0, 2)]);",
            ),
          ),
          options: [
            B('<code>[4, 4, 3, [3, 1]]</code>', '<code>[4, 4, 3, [3, 1]]</code>'),
            B('<code>[[3,1,2,4], 4, 3, [3, 1]]</code>', '<code>[[3,1,2,4], 4, 3, [3, 1]]</code>'),
            B('<code>[4, 2, 4, [3, 1]]</code>', '<code>[4, 2, 4, [3, 1]]</code>'),
            B('<code>[4, 4, 4, [3, 1, 2]]</code>', '<code>[4, 4, 4, [3, 1, 2]]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>push</code> returns the new length (4), not the array; <code>pop</code> returns the removed element (the 4 we just pushed); the length is back to 3; and <code>slice(0,2)</code> returns a new array <code>[3,1]</code> without mutating. Knowing which array methods mutate-and-return-length versus return-a-new-array prevents a lot of bugs.',
            'Đã chạy thật. <code>push</code> trả về độ dài mới (4), không phải mảng; <code>pop</code> trả về phần tử bị xoá (số 4 vừa push); độ dài về lại 3; và <code>slice(0,2)</code> trả một mảng mới <code>[3,1]</code> mà không sửa gốc. Biết method nào sửa-và-trả-độ-dài so với trả-mảng-mới tránh được nhiều lỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "let out = [];\n" +
              "try { JSON.parse('{a:1}'); } catch (e) { out.push(e.constructor.name); }\n" +
              "out.push(JSON.parse('\"\\u0041\"'));\n" +
              "console.log(out);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "let out = [];\n" +
              "try { JSON.parse('{a:1}'); } catch (e) { out.push(e.constructor.name); }\n" +
              "out.push(JSON.parse('\"\\u0041\"'));\n" +
              "console.log(out);",
            ),
          ),
          options: [
            B("<code>['SyntaxError', 'A']</code>", "<code>['SyntaxError', 'A']</code>"),
            B("<code>['TypeError', 'A']</code>", "<code>['TypeError', 'A']</code>"),
            B("<code>['SyntaxError', '\\u0041']</code>", "<code>['SyntaxError', '\\u0041']</code>"),
            B("<code>[{a:1}, 'A']</code>", "<code>[{a:1}, 'A']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>{a:1}</code> is valid JavaScript but not valid JSON (keys must be double-quoted), so <code>JSON.parse</code> throws a <code>SyntaxError</code>. The second string is valid JSON containing the escape <code>\\u0041</code>, which decodes to the letter <code>A</code>. Always wrap <code>JSON.parse</code> of untrusted input in try/catch — a malformed body should be a 400, not a 500.',
            'Đã chạy thật. <code>{a:1}</code> là JavaScript hợp lệ nhưng không phải JSON hợp lệ (khoá phải đóng nháy kép), nên <code>JSON.parse</code> ném <code>SyntaxError</code>. Chuỗi thứ hai là JSON hợp lệ chứa escape <code>\\u0041</code>, giải ra chữ <code>A</code>. Luôn bọc <code>JSON.parse</code> input không tin cậy trong try/catch — một thân sai định dạng nên là 400, không phải 500.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "(async () => {\n" +
              "  const nums = [];\n" +
              "  for (const n of [1, 2, 3]) { nums.push(await Promise.resolve(n * 10)); }\n" +
              "  console.log(nums);\n" +
              "})();",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "(async () => {\n" +
              "  const nums = [];\n" +
              "  for (const n of [1, 2, 3]) { nums.push(await Promise.resolve(n * 10)); }\n" +
              "  console.log(nums);\n" +
              "})();",
            ),
          ),
          options: [
            B('<code>[10, 20, 30]</code> — a for-of with await runs sequentially, preserving order', '<code>[10, 20, 30]</code> — for-of với await chạy tuần tự, giữ thứ tự'),
            B('<code>[30, 20, 10]</code>', '<code>[30, 20, 10]</code>'),
            B('<code>[]</code> — the loop finishes before the awaits resolve', '<code>[]</code> — vòng lặp xong trước khi các await resolve'),
            B('<code>[Promise, Promise, Promise]</code>', '<code>[Promise, Promise, Promise]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>await</code> inside a <code>for...of</code> pauses each iteration until the promise settles, so the results are pushed in order: <code>[10, 20, 30]</code>. This is correct but <em>serial</em> — if the operations are independent, <code>await Promise.all(arr.map(...))</code> runs them concurrently and is far faster. Accidental serial awaits are a classic performance bug.',
            'Đã chạy thật. <code>await</code> trong <code>for...of</code> tạm dừng mỗi vòng cho tới khi promise settle, nên kết quả được đẩy theo thứ tự: <code>[10, 20, 30]</code>. Điều này đúng nhưng <em>tuần tự</em> — nếu các thao tác độc lập, <code>await Promise.all(arr.map(...))</code> chạy chúng đồng thời và nhanh hơn nhiều. Await tuần tự vô tình là một lỗi hiệu năng kinh điển.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const u = new URL('https://x/y?a=1&a=2&b=');\n" +
              "console.log([u.searchParams.get('a'), u.searchParams.has('b'), u.searchParams.get('c')]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const u = new URL('https://x/y?a=1&a=2&b=');\n" +
              "console.log([u.searchParams.get('a'), u.searchParams.has('b'), u.searchParams.get('c')]);",
            ),
          ),
          options: [
            B("<code>['1', true, null]</code>", "<code>['1', true, null]</code>"),
            B("<code>['2', true, null]</code>", "<code>['2', true, null]</code>"),
            B("<code>['1', false, undefined]</code>", "<code>['1', false, undefined]</code>"),
            B("<code>[['1','2'], true, null]</code>", "<code>[['1','2'], true, null]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>.get(&#x27;a&#x27;)</code> returns only the <em>first</em> value of a repeated key (<code>&#x27;1&#x27;</code>); use <code>.getAll</code> for both. <code>b=</code> is present but empty, so <code>.has(&#x27;b&#x27;)</code> is true. A missing key returns <code>null</code> (not undefined). Treating a possibly-repeated query param as a single string is a common source of bugs.',
            'Đã chạy thật. <code>.get(&#x27;a&#x27;)</code> chỉ trả giá trị <em>đầu tiên</em> của một khoá lặp (<code>&#x27;1&#x27;</code>); dùng <code>.getAll</code> để lấy cả hai. <code>b=</code> có mặt nhưng rỗng, nên <code>.has(&#x27;b&#x27;)</code> là true. Một khoá thiếu trả <code>null</code> (không phải undefined). Coi một tham số query có thể lặp như một chuỗi đơn là nguồn lỗi thường gặp.',
          ),
        }),

        // ═══ 21 câu dùng lại (đã verify ở FE-2 harness) ═══

        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log([new Set([1, 1, 2, NaN, NaN]).size, new Map([['a', 1], ['a', 2]]).get('a')]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log([new Set([1, 1, 2, NaN, NaN]).size, new Map([['a', 1], ['a', 2]]).get('a')]);",
            ),
          ),
          options: [
            B('<code>[3, 2]</code>', '<code>[3, 2]</code>'),
            B('<code>[4, 1]</code>', '<code>[4, 1]</code>'),
            B('<code>[5, 2]</code>', '<code>[5, 2]</code>'),
            B('<code>[3, 1]</code>', '<code>[3, 1]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A Set deduplicates, and crucially it treats <code>NaN</code> as equal to <code>NaN</code> (unlike <code>===</code>), so the two NaNs collapse to one: <code>{1, 2, NaN}</code>, size 3. A Map keyed by <code>&#x27;a&#x27;</code> twice keeps the last write, so <code>get(&#x27;a&#x27;)</code> is 2.',
            'Đã chạy thật. Set khử trùng lặp, và điểm quan trọng là nó coi <code>NaN</code> bằng <code>NaN</code> (khác với <code>===</code>), nên hai NaN gộp thành một: <code>{1, 2, NaN}</code>, kích thước 3. Map có khoá <code>&#x27;a&#x27;</code> hai lần giữ lần ghi cuối, nên <code>get(&#x27;a&#x27;)</code> là 2.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const o = { a: { b: null } };\n" +
              "console.log([o?.a?.b?.c, o?.x?.y ?? 'def', typeof o?.a?.b?.c]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const o = { a: { b: null } };\n" +
              "console.log([o?.a?.b?.c, o?.x?.y ?? 'def', typeof o?.a?.b?.c]);",
            ),
          ),
          options: [
            B("<code>[undefined, 'def', 'undefined']</code>", "<code>[undefined, 'def', 'undefined']</code>"),
            B("<code>[null, 'def', 'object']</code>", "<code>[null, 'def', 'object']</code>"),
            B('A TypeError on <code>o?.a?.b?.c</code>', 'Một TypeError ở <code>o?.a?.b?.c</code>'),
            B("<code>[undefined, undefined, 'undefined']</code>", "<code>[undefined, undefined, 'undefined']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Optional chaining short-circuits to <code>undefined</code> the moment it meets <code>null</code> or <code>undefined</code>, so <code>o?.a?.b?.c</code> is <code>undefined</code> (not a crash on reading <code>.c</code> of null). <code>o?.x</code> is undefined so <code>?? &#x27;def&#x27;</code> supplies the fallback. And <code>typeof undefined</code> is the string <code>&#x27;undefined&#x27;</code>.',
            'Đã chạy thật. Optional chaining chập mạch về <code>undefined</code> ngay khi gặp <code>null</code> hay <code>undefined</code>, nên <code>o?.a?.b?.c</code> là <code>undefined</code> (không sập khi đọc <code>.c</code> của null). <code>o?.x</code> là undefined nên <code>?? &#x27;def&#x27;</code> cấp giá trị dự phòng. Và <code>typeof undefined</code> là chuỗi <code>&#x27;undefined&#x27;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log([Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2, 9007199254740993, typeof 10n]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log([Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2, 9007199254740993, typeof 10n]);",
            ),
          ),
          options: [
            B("<code>[true, 9007199254740992, 'bigint']</code>", "<code>[true, 9007199254740992, 'bigint']</code>"),
            B("<code>[false, 9007199254740993, 'number']</code>", "<code>[false, 9007199254740993, 'number']</code>"),
            B("<code>[true, 9007199254740993, 'bigint']</code>", "<code>[true, 9007199254740993, 'bigint']</code>"),
            B("<code>[false, 9007199254740992, 'number']</code>", "<code>[false, 9007199254740992, 'number']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Past <code>Number.MAX_SAFE_INTEGER</code> (2^53−1) doubles lose integer precision, so <code>+1</code> and <code>+2</code> land on the same representable value and compare equal, and the literal <code>9007199254740993</code> rounds down to <code>...992</code>. This is why 64-bit database ids are sent as strings and why <code>BigInt</code> (<code>typeof 10n === &#x27;bigint&#x27;</code>) exists.',
            'Đã chạy thật. Vượt qua <code>Number.MAX_SAFE_INTEGER</code> (2^53−1) số thực mất độ chính xác nguyên, nên <code>+1</code> và <code>+2</code> rơi vào cùng một giá trị biểu diễn được và so bằng nhau, còn literal <code>9007199254740993</code> làm tròn xuống <code>...992</code>. Đây là lý do id CSDL 64-bit được gửi dạng chuỗi và lý do <code>BigInt</code> (<code>typeof 10n === &#x27;bigint&#x27;</code>) tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const out = [];\n" +
              "const { EventEmitter } = require('events');\n" +
              "const e = new EventEmitter();\n" +
              "e.on('x', () => out.push(1));\n" +
              "e.on('x', () => out.push(2));\n" +
              "e.emit('x');\n" +
              "out.push(3);\n" +
              "console.log(out);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const out = [];\n" +
              "const { EventEmitter } = require('events');\n" +
              "const e = new EventEmitter();\n" +
              "e.on('x', () => out.push(1));\n" +
              "e.on('x', () => out.push(2));\n" +
              "e.emit('x');\n" +
              "out.push(3);\n" +
              "console.log(out);",
            ),
          ),
          options: [
            B('<code>[1, 2, 3]</code> — emit runs listeners synchronously, in registration order', '<code>[1, 2, 3]</code> — emit chạy listener đồng bộ, theo thứ tự đăng ký'),
            B('<code>[3, 1, 2]</code> — listeners run on the next tick', '<code>[3, 1, 2]</code> — listener chạy ở tick kế'),
            B('<code>[1, 3, 2]</code>', '<code>[1, 3, 2]</code>'),
            B('<code>[2, 1, 3]</code> — last registered runs first', '<code>[2, 1, 3]</code> — cái đăng ký sau chạy trước'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>emit</code> calls each listener <em>synchronously</em> in the order they were added, before <code>emit</code> returns — so <code>1</code>, <code>2</code>, then the line after emit pushes <code>3</code>. EventEmitter is not asynchronous by itself; a listener becomes async only if it schedules work.',
            'Đã chạy thật. <code>emit</code> gọi từng listener <em>đồng bộ</em> theo thứ tự được thêm, trước khi <code>emit</code> trả về — nên <code>1</code>, <code>2</code>, rồi dòng sau emit đẩy <code>3</code>. EventEmitter tự nó không bất đồng bộ; một listener chỉ thành async nếu nó tự xếp việc.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print, in order?' + code(
              "for (let i = 0; i < 3; i++) setTimeout(() => process.stdout.write(i + ''), 0);",
            ),
            'Đoạn mã sau in ra gì, theo thứ tự nào?' + code(
              "for (let i = 0; i < 3; i++) setTimeout(() => process.stdout.write(i + ''), 0);",
            ),
          ),
          options: [
            B('<code>012</code>', '<code>012</code>'),
            B('<code>333</code>', '<code>333</code>'),
            B('<code>210</code>', '<code>210</code>'),
            B('<code>000</code>', '<code>000</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. With <code>let</code>, each loop iteration has its own <code>i</code>, so the three timers capture 0, 1 and 2 respectively. They all fire after the synchronous loop finishes, in the order they were scheduled, printing <code>012</code>. With <code>var</code> it would print <code>333</code>.',
            'Đã chạy thật. Với <code>let</code>, mỗi vòng lặp có <code>i</code> riêng, nên ba timer bắt lần lượt 0, 1 và 2. Chúng đều nổ sau khi vòng lặp đồng bộ xong, theo thứ tự được lên lịch, in ra <code>012</code>. Với <code>var</code> thì sẽ in <code>333</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "(async () => {\n" +
              "  const r = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error('x'))]);\n" +
              "  console.log(r.map(x => x.status));\n" +
              "})();",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "(async () => {\n" +
              "  const r = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error('x'))]);\n" +
              "  console.log(r.map(x => x.status));\n" +
              "})();",
            ),
          ),
          options: [
            B("<code>['fulfilled', 'rejected']</code>", "<code>['fulfilled', 'rejected']</code>"),
            B('It throws, because one promise rejected', 'Nó ném lỗi, vì một promise bị reject'),
            B("<code>['fulfilled']</code> — rejected ones are skipped", "<code>['fulfilled']</code> — cái bị reject bị bỏ qua"),
            B("<code>['rejected', 'fulfilled']</code>", "<code>['rejected', 'fulfilled']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>Promise.allSettled</code> never rejects — it waits for every promise and reports each as <code>{status: &#x27;fulfilled&#x27;, value}</code> or <code>{status: &#x27;rejected&#x27;, reason}</code>, in input order. Contrast <code>Promise.all</code>, which rejects as soon as any one input rejects. Use allSettled when you want partial results rather than all-or-nothing.',
            'Đã chạy thật. <code>Promise.allSettled</code> không bao giờ reject — nó chờ mọi promise và báo từng cái là <code>{status: &#x27;fulfilled&#x27;, value}</code> hoặc <code>{status: &#x27;rejected&#x27;, reason}</code>, theo thứ tự đầu vào. Trái với <code>Promise.all</code>, vốn reject ngay khi bất kỳ đầu vào nào reject. Dùng allSettled khi bạn muốn kết quả một phần thay vì được-ăn-cả-ngã-về-không.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const slow = (v, ms) => new Promise(r => setTimeout(() => r(v), ms));\n" +
              "(async () => { console.log(await Promise.all([slow('a', 30), slow('b', 10), slow('c', 20)])); })();",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const slow = (v, ms) => new Promise(r => setTimeout(() => r(v), ms));\n" +
              "(async () => { console.log(await Promise.all([slow('a', 30), slow('b', 10), slow('c', 20)])); })();",
            ),
          ),
          options: [
            B("<code>['a', 'b', 'c']</code>", "<code>['a', 'b', 'c']</code>"),
            B("<code>['b', 'c', 'a']</code> — ordered by whichever resolves first", "<code>['b', 'c', 'a']</code> — theo thứ tự cái nào resolve trước"),
            B('It runs them sequentially and finishes after about 60ms', 'Nó chạy tuần tự và xong sau khoảng 60ms'),
            B("<code>['a']</code> — only the first promise is awaited", "<code>['a']</code> — chỉ promise đầu được await"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. All three timers start together (so it takes ~30ms, not 60ms), but <code>Promise.all</code> resolves to an array in the <em>same order as the inputs</em>, not the order they finished. So even though <code>b</code> settles first, the result is <code>[&#x27;a&#x27;, &#x27;b&#x27;, &#x27;c&#x27;]</code>. To run in parallel, start the promises before awaiting — awaiting each in a loop would serialise them.',
            'Đã chạy thật. Cả ba timer khởi động cùng lúc (nên mất ~30ms, không phải 60ms), nhưng <code>Promise.all</code> resolve thành một mảng theo <em>đúng thứ tự đầu vào</em>, không theo thứ tự hoàn thành. Nên dù <code>b</code> settle trước, kết quả vẫn là <code>[&#x27;a&#x27;, &#x27;b&#x27;, &#x27;c&#x27;]</code>. Muốn chạy song song, hãy khởi động các promise trước khi await — await từng cái trong vòng lặp sẽ làm chúng tuần tự.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log(['abc'.padStart(5, '0'), 'ab'.repeat(3), 'a,b,,c'.split(',').length]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log(['abc'.padStart(5, '0'), 'ab'.repeat(3), 'a,b,,c'.split(',').length]);",
            ),
          ),
          options: [
            B("<code>['00abc', 'ababab', 4]</code>", "<code>['00abc', 'ababab', 4]</code>"),
            B("<code>['abc00', 'ababab', 3]</code>", "<code>['abc00', 'ababab', 3]</code>"),
            B("<code>['00abc', 'ab3', 4]</code>", "<code>['00abc', 'ab3', 4]</code>"),
            B("<code>['abc', 'ababab', 4]</code>", "<code>['abc', 'ababab', 4]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>padStart(5, &#x27;0&#x27;)</code> prepends until length 5 → <code>&#x27;00abc&#x27;</code>. <code>repeat(3)</code> concatenates three copies. Splitting <code>&#x27;a,b,,c&#x27;</code> on comma keeps the empty field between the two commas, giving 4 elements <code>[&#x27;a&#x27;, &#x27;b&#x27;, &#x27;&#x27;, &#x27;c&#x27;]</code> — a common off-by-one when parsing CSV by hand.',
            'Đã chạy thật. <code>padStart(5, &#x27;0&#x27;)</code> chèn vào đầu tới độ dài 5 → <code>&#x27;00abc&#x27;</code>. <code>repeat(3)</code> nối ba bản. Tách <code>&#x27;a,b,,c&#x27;</code> theo dấu phẩy giữ lại trường rỗng giữa hai dấu phẩy, cho 4 phần tử <code>[&#x27;a&#x27;, &#x27;b&#x27;, &#x27;&#x27;, &#x27;c&#x27;]</code> — một lỗi lệch-một thường gặp khi tự phân tích CSV bằng tay.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const crypto = require('crypto');\n" +
              "console.log(crypto.createHash('sha256').update('').digest('hex').slice(0, 12));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const crypto = require('crypto');\n" +
              "console.log(crypto.createHash('sha256').update('').digest('hex').slice(0, 12));",
            ),
          ),
          options: [
            B('<code>e3b0c44298fc</code>', '<code>e3b0c44298fc</code>'),
            B('A different random value on each separate run', 'Một giá trị ngẫu nhiên khác ở mỗi lần chạy'),
            B('An empty string, because the input was empty', 'Một chuỗi rỗng, vì đầu vào rỗng'),
            B('<code>00000000</code> — hashing empty gives all zeros', '<code>00000000</code> — băm rỗng ra toàn số 0'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A cryptographic hash is a pure function: the same input always yields the same digest, so the SHA-256 of the empty string is the well-known constant beginning <code>e3b0c442…</code>. That determinism is what makes hashes useful for integrity checks and content-addressing — and why a salt is added before hashing passwords, so identical passwords do not share a digest.',
            'Đã chạy thật. Một hàm băm mật mã là hàm thuần: cùng đầu vào luôn cho cùng digest, nên SHA-256 của chuỗi rỗng là hằng số nổi tiếng bắt đầu bằng <code>e3b0c442…</code>. Tính tất định đó khiến băm hữu ích cho kiểm toàn vẹn và định địa chỉ theo nội dung — và là lý do người ta thêm salt trước khi băm mật khẩu, để những mật khẩu giống nhau không chung một digest.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const a = [1];\n" +
              "a.push(2);\n" +
              "a[0] = 9;\n" +
              "console.log(a);\n" +
              "try { a = []; } catch (e) { console.log(e.constructor.name); }",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const a = [1];\n" +
              "a.push(2);\n" +
              "a[0] = 9;\n" +
              "console.log(a);\n" +
              "try { a = []; } catch (e) { console.log(e.constructor.name); }",
            ),
          ),
          options: [
            B('<code>[9, 2]</code> then <code>TypeError</code>', '<code>[9, 2]</code> rồi <code>TypeError</code>'),
            B('<code>[1, 2]</code> then <code>TypeError</code>', '<code>[1, 2]</code> rồi <code>TypeError</code>'),
            B('<code>[9, 2]</code> then <code>[]</code>', '<code>[9, 2]</code> rồi <code>[]</code>'),
            B('A TypeError on <code>a.push(2)</code>', 'Một TypeError ở <code>a.push(2)</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>const</code> freezes the <em>binding</em>, not the object: you can still mutate the array (push, reassign an element), so it becomes <code>[9, 2]</code>. But reassigning the variable itself (<code>a = []</code>) throws <code>TypeError: Assignment to constant variable</code>. Use <code>Object.freeze</code> if you also want the contents immutable.',
            'Đã chạy thật. <code>const</code> khoá <em>liên kết</em>, không khoá object: bạn vẫn đổi được nội dung mảng (push, gán lại phần tử), nên nó thành <code>[9, 2]</code>. Nhưng gán lại chính biến (<code>a = []</code>) ném <code>TypeError: Assignment to constant variable</code>. Dùng <code>Object.freeze</code> nếu muốn cả nội dung bất biến.',
          ),
        }),

        mcq({
          prompt: B(
            'An async function throws. Why does the surrounding <code>try/catch</code> below NOT catch it?' + code(
              "async function f() { throw new Error('boom'); }\n" +
              "try { f(); } catch (e) { /* never reached */ }",
            ),
            'Một hàm async ném lỗi. Vì sao khối <code>try/catch</code> bao quanh dưới đây KHÔNG bắt được?' + code(
              "async function f() { throw new Error('boom'); }\n" +
              "try { f(); } catch (e) { /* không bao giờ tới */ }",
            ),
          ),
          options: [
            B('An async function never throws synchronously; it returns a rejected promise, so <code>await</code> it inside try or attach <code>.catch()</code>', 'Một hàm async không bao giờ ném đồng bộ; nó trả một promise bị reject, nên <code>await</code> nó trong try hoặc gắn <code>.catch()</code>'),
            B('The <code>try/catch</code> syntax is not valid when it wraps a plain function call', 'Cú pháp <code>try/catch</code> không hợp lệ khi bọc quanh một lời gọi hàm thường'),
            B('It does catch the error; the example above is simply written incorrectly', 'Nó có bắt lỗi; ví dụ ở trên chỉ đơn giản là viết sai'),
            B('The <code>throw</code> statement does not work at all inside an async function', 'Câu lệnh <code>throw</code> hoàn toàn không hoạt động bên trong một hàm async'),
          ],
          correct: 0,
          explanation: EX(
            'Calling <code>f()</code> returns immediately with a promise; the throw becomes a rejection that happens later, after the synchronous <code>try</code> block has already exited. So the catch never sees it, and you get an unhandled rejection. Fix: <code>try { await f(); } catch {}</code> or <code>f().catch(handler)</code>.',
            'Gọi <code>f()</code> trả về ngay với một promise; cú throw trở thành một rejection xảy ra sau đó, khi khối <code>try</code> đồng bộ đã thoát. Nên catch không bao giờ thấy nó, và bạn nhận một unhandled rejection. Sửa: <code>try { await f(); } catch {}</code> hoặc <code>f().catch(handler)</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about environment variables and configuration in Node.',
            'Chọn HAI phát biểu ĐÚNG về biến môi trường và cấu hình trong Node.',
          ),
          options: [
            B('<code>process.env.PORT</code> is always a string (or undefined), so <code>Number(process.env.PORT) || 3000</code> is a common pattern', '<code>process.env.PORT</code> luôn là chuỗi (hoặc undefined), nên <code>Number(process.env.PORT) || 3000</code> là mẫu quen thuộc'),
            B('Secrets belong in the committed <code>.env.example</code> with real values', 'Bí mật nên nằm trong <code>.env.example</code> đã commit kèm giá trị thật'),
            B('A <code>NEXT_PUBLIC_*</code> variable is baked into the client bundle at build time and is visible to users', 'Một biến <code>NEXT_PUBLIC_*</code> bị nướng vào bundle client lúc build và người dùng thấy được'),
            B('Changing a value in <code>process.env</code> updates the parent shell environment', 'Đổi một giá trị trong <code>process.env</code> cập nhật môi trường shell cha'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Env values are strings, so you parse and default them. <code>NEXT_PUBLIC_*</code> vars are inlined into the browser bundle at build time — never put a secret there. Real secrets stay out of the repo (<code>.env.example</code> holds placeholders, not real values), and mutating <code>process.env</code> only affects the current process, not the shell that launched it.',
            'Giá trị env là chuỗi, nên bạn phân tích và đặt mặc định. Biến <code>NEXT_PUBLIC_*</code> được nội tuyến vào bundle trình duyệt lúc build — đừng bao giờ để bí mật ở đó. Bí mật thật nằm ngoài repo (<code>.env.example</code> chỉ chứa giá trị mẫu, không phải giá trị thật), và sửa <code>process.env</code> chỉ ảnh hưởng tiến trình hiện tại, không ảnh hưởng shell đã khởi chạy nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Which statement about CommonJS (<code>require</code>) vs ES modules (<code>import</code>) in Node is correct?',
            'Phát biểu nào về CommonJS (<code>require</code>) so với ES module (<code>import</code>) trong Node là ĐÚNG?',
          ),
          options: [
            B('<code>require</code> is synchronous and resolves at call time; static <code>import</code> is hoisted and the file must be a module (<code>"type":"module"</code> or <code>.mjs</code>)', '<code>require</code> đồng bộ và giải tại thời điểm gọi; <code>import</code> tĩnh được hoisting và tệp phải là module (<code>"type":"module"</code> hoặc <code>.mjs</code>)'),
            B('<code>import</code> and <code>require</code> can be used interchangeably in any file with no setup', '<code>import</code> và <code>require</code> dùng thay nhau được trong mọi tệp không cần cấu hình'),
            B('<code>require</code> can always load ES modules synchronously with no caveats whatsoever', '<code>require</code> luôn nạp ES module đồng bộ được, không điều kiện gì'),
            B('<code>__dirname</code> and <code>__filename</code> are available by default in ES modules', '<code>__dirname</code> và <code>__filename</code> có sẵn mặc định trong ES module'),
          ],
          correct: 0,
          explanation: EX(
            '<code>require</code> is synchronous and can appear anywhere; ES <code>import</code> statements are static and hoisted, and the file must be treated as a module. In ESM there is no <code>__dirname</code> by default — you derive it from <code>import.meta.url</code>. Mixing them has real caveats (e.g. a <code>.cjs</code> file cannot use top-level <code>await</code>, as this exam&#x27;s own harness rediscovered).',
            '<code>require</code> đồng bộ và đặt ở đâu cũng được; câu lệnh <code>import</code> của ESM là tĩnh và được hoisting, và tệp phải được coi là module. Trong ESM không có <code>__dirname</code> mặc định — bạn suy ra từ <code>import.meta.url</code>. Trộn chúng có những điều kiện thật (ví dụ tệp <code>.cjs</code> không dùng được top-level <code>await</code>, như chính harness của đề này đã gặp lại).',
          ),
        }),

        mcq({
          prompt: B(
            'A GET <code>/posts?page=2&limit=20</code> handler reads <code>req.query.limit</code>. What is its type and a safe way to use it?',
            'Một handler GET <code>/posts?page=2&limit=20</code> đọc <code>req.query.limit</code>. Kiểu của nó là gì và cách dùng an toàn?',
          ),
          options: [
            B('It is a string like <code>"20"</code>; parse and clamp it, e.g. <code>Math.min(Number(req.query.limit) || 20, 100)</code>', 'Nó là chuỗi như <code>"20"</code>; hãy parse và kẹp, ví dụ <code>Math.min(Number(req.query.limit) || 20, 100)</code>'),
            B('It is already parsed to a number, so arithmetic on it works directly and safely', 'Nó đã được parse thành số, nên tính toán trực tiếp và an toàn'),
            B('It is always undefined for GET requests, which cannot carry query parameters', 'Nó luôn undefined với request GET, vốn không mang được tham số query'),
            B('It is a number when the value is numeric, and a string in every other case', 'Là số khi giá trị là chữ số, và là chuỗi trong mọi trường hợp khác'),
          ],
          correct: 0,
          explanation: EX(
            'Query-string values arrive as strings (or arrays/objects for repeated or bracketed keys), never numbers. So <code>req.query.limit</code> is <code>"20"</code>; you must convert, default and clamp it before using it in a query — both to avoid <code>NaN</code>/type bugs and to stop a client requesting <code>limit=100000</code> and hammering the database.',
            'Giá trị query-string tới dưới dạng chuỗi (hoặc mảng/object với khoá lặp hay có ngoặc), không bao giờ là số. Nên <code>req.query.limit</code> là <code>"20"</code>; bạn phải chuyển đổi, đặt mặc định và kẹp trước khi dùng trong truy vấn — vừa để tránh lỗi <code>NaN</code>/kiểu, vừa để chặn client yêu cầu <code>limit=100000</code> và dội vào CSDL.',
          ),
        }),

        mcq({
          prompt: B(
            'Which pair correctly matches an HTTP status to its meaning?',
            'Cặp nào ghép ĐÚNG một mã trạng thái HTTP với ý nghĩa của nó?',
          ),
          options: [
            B('<code>401</code> = not authenticated (who are you?); <code>403</code> = authenticated but not allowed (you cannot do this)', '<code>401</code> = chưa xác thực (bạn là ai?); <code>403</code> = đã xác thực nhưng không được phép (bạn không được làm điều này)'),
            B('<code>401</code> = server error; <code>403</code> = not found', '<code>401</code> = lỗi server; <code>403</code> = không tìm thấy'),
            B('<code>422</code> = success; <code>500</code> = created', '<code>422</code> = thành công; <code>500</code> = đã tạo'),
            B('<code>301</code> = client error; <code>404</code> = redirect', '<code>301</code> = lỗi client; <code>404</code> = chuyển hướng'),
          ],
          correct: 0,
          explanation: EX(
            '<code>401 Unauthorized</code> actually means <em>unauthenticated</em> — the request lacks valid credentials. <code>403 Forbidden</code> means the server knows who you are but you lack permission. Mixing them up leaks information or confuses clients; <code>422</code> is for a well-formed request that fails validation, and <code>5xx</code> is a server-side fault.',
            '<code>401 Unauthorized</code> thực ra nghĩa là <em>chưa xác thực</em> — request thiếu thông tin đăng nhập hợp lệ. <code>403 Forbidden</code> nghĩa là server biết bạn là ai nhưng bạn không đủ quyền. Nhầm lẫn hai cái làm rò thông tin hoặc gây rối cho client; <code>422</code> dành cho request đúng định dạng nhưng không qua xác thực, và <code>5xx</code> là lỗi phía server.',
          ),
        }),

        mcq({
          prompt: B(
            'A CPU-bound task (hashing a huge file, image resize) is blocking your Express event loop and stalling all requests. What is the idiomatic Node fix?',
            'Một tác vụ nặng CPU (băm một tệp khổng lồ, resize ảnh) đang chặn vòng lặp sự kiện Express và làm nghẽn mọi request. Cách sửa đúng kiểu Node là gì?',
          ),
          options: [
            B('Wrap the whole computation in a Promise so that it automatically becomes non-blocking', 'Bọc cả phép tính trong một Promise để nó tự thành non-blocking'),
            B('Move it off the main thread — a worker thread, a child process, or a job/queue — so the event loop stays free', 'Đưa nó ra khỏi luồng chính — một worker thread, tiến trình con, hoặc một job/hàng đợi — để vòng lặp sự kiện luôn rảnh'),
            B('Add more <code>await</code> keywords throughout the function to yield control', 'Thêm nhiều từ khoá <code>await</code> khắp hàm để nhường quyền điều khiển'),
            B('Increase the <code>--max-old-space-size</code> flag to give the loop more memory', 'Tăng cờ <code>--max-old-space-size</code> để cho vòng lặp nhiều bộ nhớ hơn'),
          ],
          correct: 1,
          explanation: EX(
            'Wrapping CPU work in a Promise does not help — the synchronous computation still runs on the one event-loop thread and blocks it. You must move the work off-thread: a <code>worker_thread</code>, a child process, or handing it to a background queue/worker. <code>await</code> only helps with I/O waits, not CPU-bound loops.',
            'Bọc công việc CPU trong một Promise không giúp gì — phép tính đồng bộ vẫn chạy trên một luồng vòng lặp sự kiện và chặn nó. Bạn phải đưa việc ra khỏi luồng: một <code>worker_thread</code>, một tiến trình con, hoặc giao cho một hàng đợi/worker nền. <code>await</code> chỉ giúp với chờ I/O, không giúp với vòng lặp nặng CPU.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO practices that make a Node service shut down gracefully on deploy.',
            'Chọn HAI thực hành giúp một service Node tắt êm khi deploy.',
          ),
          options: [
            B('Listen for <code>SIGTERM</code> and stop accepting new connections, then finish in-flight requests before exiting', 'Lắng nghe <code>SIGTERM</code> và ngừng nhận kết nối mới, rồi hoàn tất các request đang dở trước khi thoát'),
            B('Call <code>process.exit(0)</code> immediately when <code>SIGTERM</code> arrives', 'Gọi <code>process.exit(0)</code> ngay khi <code>SIGTERM</code> tới'),
            B('Drain the DB pool and close the server, then exit', 'Rút cạn DB pool và đóng server, rồi thoát'),
            B('Ignore <code>SIGTERM</code> so the process never stops', 'Bỏ qua <code>SIGTERM</code> để tiến trình không bao giờ dừng'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Graceful shutdown means: on <code>SIGTERM</code>, stop taking new work, let existing requests finish, close the HTTP server and the DB pool, then exit — behind a load balancer this yields zero-downtime deploys. Calling <code>process.exit(0)</code> at once drops in-flight requests, and ignoring the signal just gets you <code>SIGKILL</code>ed after the grace period.',
            'Tắt êm nghĩa là: khi nhận <code>SIGTERM</code>, ngừng nhận việc mới, để các request hiện có hoàn tất, đóng server HTTP và DB pool, rồi thoát — sau một bộ cân bằng tải điều này cho deploy không gián đoạn. Gọi <code>process.exit(0)</code> ngay làm rớt request đang dở, và bỏ qua tín hiệu thì chỉ khiến bạn bị <code>SIGKILL</code> sau thời gian ân hạn.',
          ),
        }),

        mcq({
          prompt: B(
            'A route sends the response then keeps working: <code>res.json(data); await audit(data);</code>. What is the subtle problem?',
            'Một route gửi phản hồi rồi vẫn làm tiếp: <code>res.json(data); await audit(data);</code>. Vấn đề tinh vi là gì?',
          ),
          options: [
            B('Nothing is wrong — this is the standard, correct way to run background work', 'Không có gì sai — đây là cách chuẩn, đúng để chạy việc nền'),
            B('The response is already sent, so a later <code>audit</code> error cannot reach the client and may crash the process', 'Phản hồi đã gửi, nên lỗi <code>audit</code> sau đó không tới được client và có thể làm sập tiến trình'),
            B('<code>res.json</code> can never be followed by an <code>await</code> statement', 'Sau <code>res.json</code> không bao giờ được có câu lệnh <code>await</code>'),
            B('It accidentally sends the HTTP response to the client twice', 'Nó vô tình gửi phản hồi HTTP cho client hai lần'),
          ],
          correct: 1,
          explanation: EX(
            'Once <code>res.json</code> is sent you have committed to a status code, so a later failure in <code>audit</code> cannot be reported to the client, and if you did not <code>await</code>/catch it the rejection may take down the process. "Fire-and-forget after responding" also has no retry or durability — if the box restarts, the work is lost. Persist to a queue and let a worker handle it.',
            'Một khi <code>res.json</code> đã gửi, bạn đã cam kết một mã trạng thái, nên lỗi sau đó trong <code>audit</code> không thể báo cho client, và nếu bạn không <code>await</code>/catch nó thì rejection có thể hạ gục tiến trình. "Bắn-rồi-quên sau khi phản hồi" cũng không có thử lại hay độ bền — nếu máy khởi động lại, công việc mất. Hãy lưu vào một hàng đợi và để worker xử lý.',
          ),
        }),

        mcq({
          prompt: B(
            'Why does the same Docker image behave identically on your laptop and the VPS, and what is the one thing that still differs and must be injected at runtime?',
            'Vì sao cùng một ảnh Docker hành xử giống nhau trên laptop của bạn và trên VPS, và một thứ vẫn khác biệt và phải được tiêm lúc chạy là gì?',
          ),
          options: [
            B('The image bundles code + deps + runtime as immutable layers; only config and secrets (env vars) must be supplied at runtime', 'Ảnh gói mã + phụ thuộc + runtime thành tầng bất biến; chỉ cấu hình và bí mật (biến env) phải cấp lúc chạy'),
            B('Docker copies the whole host operating system, so absolutely nothing ever differs', 'Docker sao chép cả hệ điều hành của host, nên tuyệt đối không gì khác biệt'),
            B('Nothing differs at all; even secrets should be baked directly into the image', 'Không gì khác cả; kể cả bí mật cũng nên nướng thẳng vào ảnh'),
            B('The database server itself is included and runs inside the image', 'Bản thân server CSDL nằm trong và chạy bên trong ảnh'),
          ],
          correct: 0,
          explanation: EX(
            'An image freezes the filesystem — code, node_modules and the Node runtime — so it runs the same everywhere, which is the whole appeal. What must stay outside are secrets and per-environment config: inject them as env vars at <code>docker run</code>/compose time. Baking secrets into layers leaks them (they persist in image history even if deleted in a later step).',
            'Một ảnh đóng băng hệ tệp — mã, node_modules và runtime Node — nên nó chạy giống nhau ở mọi nơi, đó là toàn bộ sức hấp dẫn. Thứ phải nằm ngoài là bí mật và cấu hình theo môi trường: hãy tiêm chúng như biến env lúc <code>docker run</code>/compose. Nướng bí mật vào các tầng làm rò chúng (chúng còn lại trong lịch sử ảnh dù bị xoá ở một bước sau).',
          ),
        }),

        mcq({
          prompt: B(
            'After a deploy, an unauthenticated <code>curl</code> to <code>/api/v1/gifs</code> returns 404, but <code>/api/v1/messages/threads</code> returns 401. What does that tell you?',
            'Sau một deploy, <code>curl</code> không xác thực tới <code>/api/v1/gifs</code> trả 404, còn <code>/api/v1/messages/threads</code> trả 401. Điều đó cho bạn biết gì?',
          ),
          options: [
            B('Both routes are completely down and returning errors to every caller', 'Cả hai route đều chết hẳn và trả lỗi cho mọi lời gọi'),
            B('401 = route mounted (needs auth); 404 = NOT mounted — likely a stale/partial build shipping an old image', '401 = route đã gắn (cần auth); 404 = CHƯA gắn — nhiều khả năng build cũ/thiếu ship một ảnh cũ'),
            B('The 404 simply means the current user is logged out of their session', '404 chỉ đơn giản nghĩa là người dùng hiện tại đã đăng xuất phiên'),
            B('Both status codes mean effectively the same thing in this context', 'Cả hai mã trạng thái về cơ bản nghĩa như nhau trong ngữ cảnh này'),
          ],
          correct: 1,
          explanation: EX(
            'An unauthenticated probe distinguishes "route exists" from "route missing": 401/200 means the route is mounted and simply needs auth or is public, whereas 404 means the router was never registered — the classic symptom of a stale or partial build where the new code did not actually ship. Diagnose route health with curl, not the browser.',
            'Một phép thăm dò không xác thực phân biệt "route tồn tại" với "route thiếu": 401/200 nghĩa là route đã gắn và chỉ cần auth hoặc là công khai, còn 404 nghĩa là router chưa từng được đăng ký — triệu chứng kinh điển của một build cũ hoặc thiếu, nơi mã mới thật ra chưa ship. Chẩn đoán sức khoẻ route bằng curl, không phải trình duyệt.',
          ),
        }),

        mcq({
          prompt: B(
            'Which change most directly reduces tail latency for a read-heavy endpoint that filters by <code>userId</code> and sorts by <code>createdAt</code>?',
            'Thay đổi nào giảm trực tiếp nhất độ trễ đuôi cho một endpoint đọc-nhiều lọc theo <code>userId</code> và sắp theo <code>createdAt</code>?',
          ),
          options: [
            B('A composite index on <code>(userId, createdAt)</code> so the DB seeks and returns rows already ordered', 'Một chỉ mục tổ hợp trên <code>(userId, createdAt)</code> để CSDL seek và trả các dòng đã sắp sẵn'),
            B('Selecting <code>*</code> instead of only the specific columns the endpoint needs', 'Chọn <code>*</code> thay vì chỉ các cột cụ thể mà endpoint cần'),
            B('Removing the <code>WHERE</code> clause so the database scans fewer rows', 'Bỏ mệnh đề <code>WHERE</code> để CSDL quét ít dòng hơn'),
            B('Adding <code>ORDER BY RANDOM()</code> to shuffle the result set each time', 'Thêm <code>ORDER BY RANDOM()</code> để xáo trộn tập kết quả mỗi lần'),
          ],
          correct: 0,
          explanation: EX(
            'A composite index matching the filter-then-sort shape lets Postgres jump to the user&#x27;s rows and read them in <code>createdAt</code> order without a separate sort step — the single biggest win for this query shape. <code>SELECT *</code> moves more bytes, dropping the <code>WHERE</code> scans everything, and <code>ORDER BY RANDOM()</code> forces a full sort. Verify with <code>EXPLAIN ANALYZE</code>.',
            'Một chỉ mục tổ hợp khớp hình dạng lọc-rồi-sắp cho phép Postgres nhảy tới các dòng của người dùng và đọc chúng theo thứ tự <code>createdAt</code> mà không cần bước sắp riêng — phần thắng lớn nhất cho hình dạng truy vấn này. <code>SELECT *</code> chuyển nhiều byte hơn, bỏ <code>WHERE</code> thì quét tất cả, và <code>ORDER BY RANDOM()</code> ép sắp toàn bộ. Hãy kiểm bằng <code>EXPLAIN ANALYZE</code>.',
          ),
        }),

        // ── Ch8 + Ch6 (bổ sung cho đủ 50) ──
        mcq({
          prompt: B(
            'You store a session JWT in a cookie. Which flag combination best protects it?',
            'Bạn lưu một JWT phiên trong cookie. Bộ cờ nào bảo vệ nó tốt nhất?',
          ),
          options: [
            B('<code>HttpOnly</code> + <code>Secure</code> + <code>SameSite</code> — JS cannot read it, it travels only over HTTPS, and it is not sent cross-site', '<code>HttpOnly</code> + <code>Secure</code> + <code>SameSite</code> — JS không đọc được, chỉ đi qua HTTPS, và không gửi kèm request khác site'),
            B('No flags, so the frontend JavaScript can read the token and attach it to requests itself', 'Không cờ nào, để JavaScript frontend đọc được token và tự gắn vào request'),
            B('Only <code>Domain=*</code> so every subdomain and site can share the same session cookie', 'Chỉ <code>Domain=*</code> để mọi subdomain và site dùng chung cookie phiên'),
            B('<code>Max-Age=0</code> so the cookie is deleted immediately and cannot be stolen', '<code>Max-Age=0</code> để cookie bị xoá ngay và không thể bị đánh cắp'),
          ],
          correct: 0,
          explanation: EX(
            '<code>HttpOnly</code> hides the cookie from <code>document.cookie</code>, so an XSS payload cannot exfiltrate it; <code>Secure</code> stops it leaking over plain HTTP; <code>SameSite=Lax/Strict</code> keeps the browser from sending it on cross-site requests, which is the core of CSRF defence. Reading the token from JS (no flags) re-opens the XSS theft path.',
            '<code>HttpOnly</code> giấu cookie khỏi <code>document.cookie</code>, nên một payload XSS không thể rút nó ra; <code>Secure</code> chặn rò qua HTTP thường; <code>SameSite=Lax/Strict</code> ngăn trình duyệt gửi nó trên request khác site, cốt lõi của phòng thủ CSRF. Đọc token từ JS (không cờ) mở lại đường trộm qua XSS.',
          ),
        }),

        mcq({
          prompt: B(
            'A client wants to update only a user&#x27;s email, leaving other fields untouched. Which method fits, and how does it differ from <code>PUT</code>?',
            'Một client muốn chỉ cập nhật email của user, giữ nguyên các trường khác. Method nào hợp, và nó khác <code>PUT</code> thế nào?',
          ),
          options: [
            B('<code>PATCH</code> — a partial update of the given fields, whereas <code>PUT</code> replaces the whole resource (omitted fields may be cleared)', '<code>PATCH</code> — cập nhật một phần các trường đưa vào, còn <code>PUT</code> thay thế toàn bộ tài nguyên (trường bỏ trống có thể bị xoá)'),
            B('<code>GET</code> with the new email in a query parameter, since it is a small change', '<code>GET</code> với email mới trong tham số query, vì đó là thay đổi nhỏ'),
            B('<code>POST</code> always, because any change to data must create a brand-new resource', '<code>POST</code> luôn luôn, vì mọi thay đổi dữ liệu phải tạo một tài nguyên hoàn toàn mới'),
            B('<code>DELETE</code> then re-create, as there is no way to change one field', '<code>DELETE</code> rồi tạo lại, vì không có cách nào đổi một trường'),
          ],
          correct: 0,
          explanation: EX(
            '<code>PATCH</code> applies a partial modification — send just the fields you want to change. <code>PUT</code> is a full replacement, so a <code>PUT</code> missing a field can null it out. <code>GET</code> must stay side-effect free, and deleting-then-recreating loses the id and any relations. Choosing the right verb keeps the API predictable and idempotent where it should be.',
            '<code>PATCH</code> áp một sửa đổi một phần — chỉ gửi các trường bạn muốn đổi. <code>PUT</code> là thay thế toàn bộ, nên một <code>PUT</code> thiếu một trường có thể làm null trường đó. <code>GET</code> phải không có tác dụng phụ, và xoá-rồi-tạo-lại làm mất id và mọi quan hệ. Chọn đúng động từ giữ API dễ đoán và idempotent ở nơi cần.',
          ),
        }),
      ],
    },
  ],
};
