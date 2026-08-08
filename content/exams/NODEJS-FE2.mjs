/**
 * Node.js — Final Exam 2 (FE-2): 50 câu trắc nghiệm phủ cả 18 chương.
 *
 * Đề tự soạn, bám sát `content/courses/nodejs/s01…s18`. Mọi đoạn mã hỏi
 * "in ra gì" đều đã CHẠY THẬT bằng `node` v22.21.0 (harness
 * scratchpad/fe2-verify*.mjs), không đoán theo trực giác.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-FE2.mjs --apply
 */
import { B, EX, code, mcq } from './_lib/nodejs-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam 2</b> — 50 multiple-choice questions across all 18 chapters. This paper leans on <em>reading code</em>: many questions show a snippet and ask what it prints, and every one of those outputs was produced by running the snippet on Node v22, so trust the code over your intuition.</p>' +
  '<p>A few questions say "choose TWO" — they only count as correct when both answers are selected. You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá 2</b> — 50 câu trắc nghiệm phủ cả 18 chương. Đề này nặng về <em>đọc mã</em>: nhiều câu cho sẵn một đoạn mã và hỏi nó in ra gì, và mọi kết quả đó đều lấy từ việc chạy thật đoạn mã trên Node v22, nên hãy tin vào mã hơn cảm tính.</p>' +
  '<p>Vài câu ghi "chọn HAI" — chỉ đúng khi chọn đủ cả hai đáp án. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-2',
      source: 'SAMPLE',
      sortOrder: 5,
      title: B(
        'Final Exam 2 — the whole Node.js course (50 questions)',
        'Thi cuối khoá 2 — toàn bộ khoá Node.js (50 câu)',
      ),
      description: B(
        'A second full-course final: fifty multiple-choice questions across all eighteen chapters, heavier on reading real code — coercion, the event loop, streams, Express, PostgreSQL, auth, security, Redis, queues, testing, observability, performance, Docker and architecture.',
        'Đề cuối khoá thứ hai: năm mươi câu trắc nghiệm phủ cả mười tám chương, nặng về đọc mã thật — ép kiểu, vòng lặp sự kiện, stream, Express, PostgreSQL, xác thực, bảo mật, Redis, hàng đợi, kiểm thử, quan sát hệ thống, hiệu năng, Docker và kiến trúc.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Chương 1 — JavaScript ───────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code("console.log([1, 2, 3] + [4, 5, 6]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([1, 2, 3] + [4, 5, 6]);"),
          ),
          options: [
            B('<code>[1,2,3,4,5,6]</code>', '<code>[1,2,3,4,5,6]</code>'),
            B('<code>1,2,34,5,6</code>', '<code>1,2,34,5,6</code>'),
            B('<code>[5,7,9]</code>', '<code>[5,7,9]</code>'),
            B('A TypeError', 'Một lỗi TypeError'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. The <code>+</code> operator has no meaning for arrays, so each side is coerced to a string first: <code>[1,2,3]</code> becomes <code>&#x27;1,2,3&#x27;</code> and <code>[4,5,6]</code> becomes <code>&#x27;4,5,6&#x27;</code>, then they are concatenated into <code>&#x27;1,2,34,5,6&#x27;</code>. There is no array addition in JavaScript.',
            'Đã chạy thật. Toán tử <code>+</code> không có nghĩa với mảng, nên mỗi vế bị ép về chuỗi trước: <code>[1,2,3]</code> thành <code>&#x27;1,2,3&#x27;</code> và <code>[4,5,6]</code> thành <code>&#x27;4,5,6&#x27;</code>, rồi nối lại thành <code>&#x27;1,2,34,5,6&#x27;</code>. JavaScript không có phép cộng mảng.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([10, 1, 2, 20, 3].sort());"),
            'Đoạn mã sau in ra gì?' + code("console.log([10, 1, 2, 20, 3].sort());"),
          ),
          options: [
            B('<code>[1, 2, 3, 10, 20]</code>', '<code>[1, 2, 3, 10, 20]</code>'),
            B('<code>[1, 10, 2, 20, 3]</code>', '<code>[1, 10, 2, 20, 3]</code>'),
            B('<code>[10, 1, 2, 20, 3]</code> (unchanged)', '<code>[10, 1, 2, 20, 3]</code> (giữ nguyên)'),
            B('<code>[20, 10, 3, 2, 1]</code>', '<code>[20, 10, 3, 2, 1]</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. Default <code>sort()</code> compares elements as <em>strings</em>, so <code>&#x27;10&#x27;</code> sorts before <code>&#x27;2&#x27;</code> because <code>&#x27;1&#x27;</code> &lt; <code>&#x27;2&#x27;</code>. To sort numbers you must pass a comparator: <code>arr.sort((a, b) =&gt; a - b)</code>.',
            'Đã chạy thật. Mặc định <code>sort()</code> so sánh phần tử như <em>chuỗi</em>, nên <code>&#x27;10&#x27;</code> đứng trước <code>&#x27;2&#x27;</code> vì <code>&#x27;1&#x27;</code> &lt; <code>&#x27;2&#x27;</code>. Muốn sắp số phải truyền hàm so sánh: <code>arr.sort((a, b) =&gt; a - b)</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const fns = [];\n" +
              "for (var i = 0; i < 3; i++) fns.push(() => i);\n" +
              "console.log(fns.map(f => f()));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const fns = [];\n" +
              "for (var i = 0; i < 3; i++) fns.push(() => i);\n" +
              "console.log(fns.map(f => f()));",
            ),
          ),
          options: [
            B('<code>[0, 1, 2]</code>', '<code>[0, 1, 2]</code>'),
            B('<code>[3, 3, 3]</code>', '<code>[3, 3, 3]</code>'),
            B('<code>[undefined, undefined, undefined]</code>', '<code>[undefined, undefined, undefined]</code>'),
            B('<code>[2, 2, 2]</code>', '<code>[2, 2, 2]</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>var</code> has one function-scoped binding shared by all three closures; by the time they run the loop has finished and <code>i</code> is 3. Change <code>var</code> to <code>let</code> and each iteration gets its own binding, printing <code>[0, 1, 2]</code>.',
            'Đã chạy thật. <code>var</code> chỉ có một liên kết phạm vi hàm dùng chung cho cả ba closure; khi chúng chạy thì vòng lặp đã xong và <code>i</code> bằng 3. Đổi <code>var</code> thành <code>let</code> thì mỗi vòng có liên kết riêng, in ra <code>[0, 1, 2]</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log(JSON.stringify({ a: undefined, b: () => 1, c: NaN, d: Infinity, e: [undefined] }));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log(JSON.stringify({ a: undefined, b: () => 1, c: NaN, d: Infinity, e: [undefined] }));",
            ),
          ),
          options: [
            B('<code>{"a":null,"c":null,"d":null,"e":[null]}</code>', '<code>{"a":null,"c":null,"d":null,"e":[null]}</code>'),
            B('<code>{"c":null,"d":null,"e":[null]}</code>', '<code>{"c":null,"d":null,"e":[null]}</code>'),
            B('<code>{"c":NaN,"d":Infinity,"e":[null]}</code>', '<code>{"c":NaN,"d":Infinity,"e":[null]}</code>'),
            B('<code>{"e":[]}</code>', '<code>{"e":[]}</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. In an <em>object</em>, keys whose value is <code>undefined</code> or a function are dropped entirely (so <code>a</code> and <code>b</code> vanish). <code>NaN</code> and <code>Infinity</code> are not valid JSON, so they serialise to <code>null</code>. Inside an <em>array</em>, a hole/undefined becomes <code>null</code> because an array cannot drop an index.',
            'Đã chạy thật. Trong một <em>object</em>, khoá có giá trị <code>undefined</code> hoặc hàm bị bỏ hẳn (nên <code>a</code> và <code>b</code> biến mất). <code>NaN</code> và <code>Infinity</code> không phải JSON hợp lệ nên thành <code>null</code>. Trong một <em>mảng</em>, phần tử undefined thành <code>null</code> vì mảng không thể bỏ một chỉ số.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log([ [1] == 1, null == undefined, null == 0, NaN === NaN ]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log([ [1] == 1, null == undefined, null == 0, NaN === NaN ]);",
            ),
          ),
          options: [
            B('<code>[true, true, true, true]</code>', '<code>[true, true, true, true]</code>'),
            B('<code>[true, true, false, false]</code>', '<code>[true, true, false, false]</code>'),
            B('<code>[false, true, false, false]</code>', '<code>[false, true, false, false]</code>'),
            B('<code>[true, false, true, false]</code>', '<code>[true, false, true, false]</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>[1] == 1</code> is true (the array coerces to the string <code>&#x27;1&#x27;</code> then the number 1). <code>null == undefined</code> is true by a special rule, but <code>null</code> equals <em>nothing else</em> loosely, so <code>null == 0</code> is false. <code>NaN</code> is never equal to anything, even itself.',
            'Đã chạy thật. <code>[1] == 1</code> là true (mảng ép về chuỗi <code>&#x27;1&#x27;</code> rồi số 1). <code>null == undefined</code> là true theo một luật riêng, nhưng <code>null</code> lỏng lẻo <em>không bằng thứ gì khác</em>, nên <code>null == 0</code> là false. <code>NaN</code> không bao giờ bằng bất cứ thứ gì, kể cả chính nó.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log((0.1 + 0.2).toFixed(2), 0.1 + 0.2 === 0.3);"),
            'Đoạn mã sau in ra gì?' + code("console.log((0.1 + 0.2).toFixed(2), 0.1 + 0.2 === 0.3);"),
          ),
          options: [
            B('<code>0.30 true</code>', '<code>0.30 true</code>'),
            B('<code>0.30 false</code>', '<code>0.30 false</code>'),
            B('<code>0.3 true</code>', '<code>0.3 true</code>'),
            B('<code>0.30000000000000004 false</code>', '<code>0.30000000000000004 false</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. IEEE-754 doubles cannot represent <code>0.1</code> or <code>0.2</code> exactly, so their sum is <code>0.30000000000000004</code> and the strict comparison to <code>0.3</code> is false. <code>toFixed(2)</code> rounds to a string <code>&#x27;0.30&#x27;</code>. For money, store integer cents rather than trusting float arithmetic.',
            'Đã chạy thật. Số thực IEEE-754 không biểu diễn chính xác <code>0.1</code> hay <code>0.2</code>, nên tổng là <code>0.30000000000000004</code> và phép so sánh chặt với <code>0.3</code> là false. <code>toFixed(2)</code> làm tròn thành chuỗi <code>&#x27;0.30&#x27;</code>. Với tiền, hãy lưu số nguyên đơn vị xu thay vì tin phép tính số thực.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const o = { v: 42, reg() { return this.v; }, arr: () => this?.v };\n" +
              "console.log(o.reg(), o.arr());",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const o = { v: 42, reg() { return this.v; }, arr: () => this?.v };\n" +
              "console.log(o.reg(), o.arr());",
            ),
          ),
          options: [
            B('<code>42 42</code>', '<code>42 42</code>'),
            B('<code>42 undefined</code>', '<code>42 undefined</code>'),
            B('<code>undefined 42</code>', '<code>undefined 42</code>'),
            B('<code>42 null</code>', '<code>42 null</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. A regular method sets <code>this</code> to the object it was called on, so <code>reg()</code> returns 42. An arrow function has no <code>this</code> of its own — it captures the surrounding module scope, where <code>this</code> is <code>undefined</code> (or module.exports at top level, whose <code>v</code> is undefined). This is why you never write object methods as arrows.',
            'Đã chạy thật. Method thường gán <code>this</code> là object nó được gọi trên đó, nên <code>reg()</code> trả 42. Hàm mũi tên không có <code>this</code> riêng — nó bắt <code>this</code> của phạm vi module bao quanh, mà ở đó <code>this</code> là <code>undefined</code>. Đây là lý do không bao giờ viết method của object bằng hàm mũi tên.',
          ),
        }),

        // ── Chương 2 — Runtime / event loop ─────────────────────────────
        mcq({
          prompt: B(
            'In what order does this print?' + code(
              "Promise.resolve().then(() => console.log('promise'));\n" +
              "process.nextTick(() => console.log('nextTick'));\n" +
              "console.log('sync');",
            ),
            'Đoạn mã sau in ra theo thứ tự nào?' + code(
              "Promise.resolve().then(() => console.log('promise'));\n" +
              "process.nextTick(() => console.log('nextTick'));\n" +
              "console.log('sync');",
            ),
          ),
          options: [
            B('promise, nextTick, sync', 'promise, nextTick, sync'),
            B('sync, nextTick, promise', 'sync, nextTick, promise'),
            B('sync, promise, nextTick', 'sync, promise, nextTick'),
            B('nextTick, promise, sync', 'nextTick, promise, sync'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. Synchronous code runs first (<code>sync</code>). Then, before returning to the event loop, Node drains the <code>process.nextTick</code> queue <em>before</em> the Promise microtask queue — so <code>nextTick</code> beats <code>promise</code>. Both run before any timer or I/O callback.',
            'Đã chạy thật. Mã đồng bộ chạy trước (<code>sync</code>). Sau đó, trước khi quay lại vòng lặp sự kiện, Node vét hàng đợi <code>process.nextTick</code> <em>trước</em> hàng đợi microtask của Promise — nên <code>nextTick</code> thắng <code>promise</code>. Cả hai đều chạy trước mọi callback timer hay I/O.',
          ),
        }),

        mcq({
          prompt: B(
            'Inside an I/O callback, what prints first?' + code(
              "const fs = require('fs');\n" +
              "fs.readFile(__filename, () => {\n" +
              "  setTimeout(() => console.log('timeout'), 0);\n" +
              "  setImmediate(() => console.log('immediate'));\n" +
              "});",
            ),
            'Bên trong một callback I/O, cái nào in ra trước?' + code(
              "const fs = require('fs');\n" +
              "fs.readFile(__filename, () => {\n" +
              "  setTimeout(() => console.log('timeout'), 0);\n" +
              "  setImmediate(() => console.log('immediate'));\n" +
              "});",
            ),
          ),
          options: [
            B('<code>timeout</code> then <code>immediate</code>', '<code>timeout</code> rồi <code>immediate</code>'),
            B('<code>immediate</code> then <code>timeout</code>', '<code>immediate</code> rồi <code>timeout</code>'),
            B('The order is random each run', 'Thứ tự ngẫu nhiên mỗi lần chạy'),
            B('Only <code>immediate</code> ever runs', 'Chỉ <code>immediate</code> chạy'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. At the top level the order of a 0ms timer versus <code>setImmediate</code> is not guaranteed, but <em>inside an I/O callback</em> it is deterministic: the loop is already past the poll phase, so the <code>check</code> phase (<code>setImmediate</code>) runs before it loops back to the <code>timers</code> phase. So <code>immediate</code> always wins here.',
            'Đã chạy thật. Ở cấp cao nhất, thứ tự giữa timer 0ms và <code>setImmediate</code> không chắc chắn, nhưng <em>bên trong một callback I/O</em> thì tất định: vòng lặp đã qua pha poll, nên pha <code>check</code> (<code>setImmediate</code>) chạy trước khi quay lại pha <code>timers</code>. Vậy <code>immediate</code> luôn thắng ở đây.',
          ),
        }),

        mcq({
          prompt: B(
            'In what order does this print?' + code(
              "console.log('A');\n" +
              "(async () => { console.log('B'); await null; console.log('C'); })();\n" +
              "Promise.resolve().then(() => console.log('D'));\n" +
              "console.log('E');",
            ),
            'Đoạn mã sau in ra theo thứ tự nào?' + code(
              "console.log('A');\n" +
              "(async () => { console.log('B'); await null; console.log('C'); })();\n" +
              "Promise.resolve().then(() => console.log('D'));\n" +
              "console.log('E');",
            ),
          ),
          options: [
            B('A B C D E', 'A B C D E'),
            B('A B E C D', 'A B E C D'),
            B('A B E D C', 'A B E D C'),
            B('A E B D C', 'A E B D C'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>A</code>, then the async function runs synchronously up to <code>await</code>, printing <code>B</code>. <code>await null</code> suspends and schedules the rest (<code>C</code>) as a microtask. Synchronous code continues: <code>E</code>. Now microtasks drain in the order they were queued: <code>C</code> was queued at the <code>await</code> (before the <code>.then</code>), so <code>C</code> then <code>D</code>.',
            'Đã chạy thật. <code>A</code>, rồi hàm async chạy đồng bộ tới <code>await</code>, in <code>B</code>. <code>await null</code> tạm dừng và xếp phần còn lại (<code>C</code>) làm microtask. Mã đồng bộ tiếp: <code>E</code>. Giờ microtask vét theo thứ tự đã xếp: <code>C</code> được xếp tại <code>await</code> (trước <code>.then</code>), nên <code>C</code> rồi <code>D</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about the Node.js event loop.',
            'Chọn HAI phát biểu ĐÚNG về vòng lặp sự kiện của Node.js.',
          ),
          options: [
            B('A long synchronous loop blocks timers, I/O callbacks and incoming requests', 'Một vòng lặp đồng bộ dài chặn cả timer, callback I/O lẫn request tới'),
            B('<code>process.nextTick</code> callbacks run after the current Promise microtasks', '<code>process.nextTick</code> chạy sau các microtask Promise hiện tại'),
            B('Microtasks (Promises) drain completely before the loop moves to the next phase', 'Microtask (Promise) vét cạn trước khi vòng lặp sang pha kế tiếp'),
            B('<code>setTimeout(fn, 0)</code> guarantees <code>fn</code> runs in exactly 0ms', '<code>setTimeout(fn, 0)</code> bảo đảm <code>fn</code> chạy đúng sau 0ms'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Node runs your JavaScript on one thread, so any long synchronous work freezes everything until it returns. Between event-loop phases, the microtask queue is drained to empty. <code>nextTick</code> actually runs <em>before</em> Promise microtasks, and a 0ms timer only means "not before 0ms" — it is clamped to a minimum and waits its phase.',
            'Node chạy JavaScript của bạn trên một luồng, nên mọi công việc đồng bộ dài đóng băng tất cả cho tới khi nó trả về. Giữa các pha vòng lặp, hàng đợi microtask được vét sạch. <code>nextTick</code> thực ra chạy <em>trước</em> microtask Promise, và timer 0ms chỉ nghĩa là "không sớm hơn 0ms" — nó bị kẹp về mức tối thiểu và chờ tới pha của nó.',
          ),
        }),

        // ── Chương 3 — Core modules ─────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log(Buffer.from('café').length, Buffer.byteLength('café'), 'café'.length);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log(Buffer.from('café').length, Buffer.byteLength('café'), 'café'.length);",
            ),
          ),
          options: [
            B('<code>4 4 4</code>', '<code>4 4 4</code>'),
            B('<code>5 5 4</code>', '<code>5 5 4</code>'),
            B('<code>4 4 5</code>', '<code>4 4 5</code>'),
            B('<code>5 5 5</code>', '<code>5 5 5</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. A Buffer counts <em>bytes</em>. In UTF-8 the character <code>é</code> is two bytes, so the buffer length and byte length are both 5. A JavaScript string counts UTF-16 code units, and <code>é</code> is a single unit, so <code>&#x27;café&#x27;.length</code> is 4. String length is not byte length.',
            'Đã chạy thật. Buffer đếm <em>byte</em>. Trong UTF-8, ký tự <code>é</code> chiếm hai byte, nên độ dài buffer và số byte đều là 5. Chuỗi JavaScript đếm đơn vị mã UTF-16, mà <code>é</code> là một đơn vị, nên <code>&#x27;café&#x27;.length</code> là 4. Độ dài chuỗi không phải số byte.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const p = require('path');\n" +
              "console.log(p.join('/a', 'b', '../c'), p.resolve('/a', '/b'), p.extname('a.test.js'));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const p = require('path');\n" +
              "console.log(p.join('/a', 'b', '../c'), p.resolve('/a', '/b'), p.extname('a.test.js'));",
            ),
          ),
          options: [
            B('<code>/a/b/../c /a/b .test.js</code>', '<code>/a/b/../c /a/b .test.js</code>'),
            B('<code>/a/c /b .js</code>', '<code>/a/c /b .js</code>'),
            B('<code>/a/c /a/b .test.js</code>', '<code>/a/c /a/b .test.js</code>'),
            B('<code>/a/b/c /b .js</code>', '<code>/a/b/c /b .js</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. <code>join</code> normalises the segments, so <code>../c</code> cancels <code>b</code> to give <code>/a/c</code>. <code>resolve</code> processes right-to-left and stops at the first absolute path, so a second absolute argument <code>/b</code> throws away <code>/a</code>. <code>extname</code> returns only the last extension, <code>.js</code>.',
            'Đã chạy thật. <code>join</code> chuẩn hoá các đoạn, nên <code>../c</code> triệt tiêu <code>b</code> cho ra <code>/a/c</code>. <code>resolve</code> xử lý từ phải sang trái và dừng ở đường dẫn tuyệt đối đầu tiên, nên đối số tuyệt đối thứ hai <code>/b</code> vứt bỏ <code>/a</code>. <code>extname</code> chỉ trả phần mở rộng cuối, <code>.js</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const u = new URL('https://x.com/a/b?q=1&q=2#top');\n" +
              "console.log(u.pathname, u.searchParams.getAll('q').length, u.hash);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const u = new URL('https://x.com/a/b?q=1&q=2#top');\n" +
              "console.log(u.pathname, u.searchParams.getAll('q').length, u.hash);",
            ),
          ),
          options: [
            B('<code>/a/b 2 #top</code>', '<code>/a/b 2 #top</code>'),
            B('<code>/a/b 1 top</code>', '<code>/a/b 1 top</code>'),
            B('<code>/a/b?q=1&q=2 2 #top</code>', '<code>/a/b?q=1&q=2 2 #top</code>'),
            B('<code>a/b 2 top</code>', '<code>a/b 2 top</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The WHATWG <code>URL</code> parser splits the parts cleanly: <code>pathname</code> excludes the query, a repeated key <code>q</code> yields two values via <code>getAll</code> (whereas <code>.get(&#x27;q&#x27;)</code> returns only the first), and <code>hash</code> keeps the leading <code>#</code>.',
            'Đã chạy thật. Bộ phân tích <code>URL</code> theo chuẩn WHATWG tách các phần sạch sẽ: <code>pathname</code> không gồm query, một khoá lặp <code>q</code> cho hai giá trị qua <code>getAll</code> (còn <code>.get(&#x27;q&#x27;)</code> chỉ trả cái đầu), và <code>hash</code> giữ dấu <code>#</code> ở đầu.',
          ),
        }),

        // ── Chương 4 — npm ──────────────────────────────────────────────
        mcq({
          prompt: B(
            'A dependency is pinned as <code>"^1.4.2"</code>. Which versions will <code>npm install</code> accept?',
            'Một phụ thuộc ghi <code>"^1.4.2"</code>. <code>npm install</code> sẽ chấp nhận những phiên bản nào?',
          ),
          options: [
            B('Only exactly 1.4.2', 'Chỉ đúng 1.4.2'),
            B('Anything &gt;= 1.4.2 and &lt; 2.0.0', 'Bất kỳ &gt;= 1.4.2 và &lt; 2.0.0'),
            B('Anything &gt;= 1.4.2 and &lt; 1.5.0', 'Bất kỳ &gt;= 1.4.2 và &lt; 1.5.0'),
            B('Anything &gt;= 1.4.2, including 3.x', 'Bất kỳ &gt;= 1.4.2, kể cả 3.x'),
          ],
          correct: 1,
          explanation: EX(
            'The caret <code>^</code> allows updates that do not change the left-most non-zero version part — for <code>1.4.2</code> that means minor and patch, i.e. up to but not including <code>2.0.0</code>. The tilde <code>~1.4.2</code> is stricter, allowing only patch updates (&lt; <code>1.5.0</code>). <code>package-lock.json</code> then pins the exact resolved version.',
            'Dấu mũ <code>^</code> cho phép cập nhật không đổi phần phiên bản khác 0 tận cùng bên trái — với <code>1.4.2</code> nghĩa là minor và patch, tức tới nhưng không gồm <code>2.0.0</code>. Dấu ngã <code>~1.4.2</code> chặt hơn, chỉ cho cập nhật patch (&lt; <code>1.5.0</code>). Rồi <code>package-lock.json</code> khoá đúng phiên bản đã giải.',
          ),
        }),

        mcq({
          prompt: B(
            'On a CI server building for production, which is the best install command and why?',
            'Trên máy CI dựng cho production, lệnh cài nào tốt nhất và vì sao?',
          ),
          options: [
            B('<code>npm install</code> — it always fetches the newest versions', '<code>npm install</code> — luôn lấy phiên bản mới nhất'),
            B('<code>npm ci</code> — it installs exactly what <code>package-lock.json</code> pins, reproducibly', '<code>npm ci</code> — cài đúng những gì <code>package-lock.json</code> khoá, tái lập được'),
            B('<code>npm update</code> — it keeps dependencies fresh', '<code>npm update</code> — giữ phụ thuộc luôn mới'),
            B('<code>npm install --force</code> — it resolves conflicts automatically', '<code>npm install --force</code> — tự giải xung đột'),
          ],
          correct: 1,
          explanation: EX(
            '<code>npm ci</code> deletes <code>node_modules</code> and installs the exact tree from the lockfile, failing if <code>package.json</code> and the lock disagree. That reproducibility is exactly what a build needs. <code>npm install</code> may bump versions within the semver range and rewrite the lockfile — fine locally, risky in CI.',
            '<code>npm ci</code> xoá <code>node_modules</code> và cài đúng cây từ lockfile, báo lỗi nếu <code>package.json</code> và lock lệch nhau. Tính tái lập đó chính là thứ một bản build cần. <code>npm install</code> có thể nâng phiên bản trong khoảng semver và ghi lại lockfile — ổn ở máy local, rủi ro trên CI.',
          ),
        }),

        // ── Chương 5 — Express ──────────────────────────────────────────
        mcq({
          prompt: B(
            'A middleware forgets to call <code>next()</code>. What does this hand-rolled chain print?' + code(
              "const out = [];\n" +
              "const mws = [\n" +
              "  (q, s, n) => { out.push('A'); n(); },\n" +
              "  (q, s, n) => { out.push('B'); /* forgot next() */ },\n" +
              "  (q, s, n) => { out.push('C'); n(); },\n" +
              "];\n" +
              "let i = 0;\n" +
              "const next = () => { const m = mws[i++]; if (m) m({}, {}, next); };\n" +
              "next();\n" +
              "console.log(out);",
            ),
            'Một middleware quên gọi <code>next()</code>. Chuỗi tự dựng sau in ra gì?' + code(
              "const out = [];\n" +
              "const mws = [\n" +
              "  (q, s, n) => { out.push('A'); n(); },\n" +
              "  (q, s, n) => { out.push('B'); /* quên next() */ },\n" +
              "  (q, s, n) => { out.push('C'); n(); },\n" +
              "];\n" +
              "let i = 0;\n" +
              "const next = () => { const m = mws[i++]; if (m) m({}, {}, next); };\n" +
              "next();\n" +
              "console.log(out);",
            ),
          ),
          options: [
            B("<code>['A', 'B', 'C']</code>", "<code>['A', 'B', 'C']</code>"),
            B("<code>['A', 'B']</code>", "<code>['A', 'B']</code>"),
            B("<code>['A']</code>", "<code>['A']</code>"),
            B("<code>['A', 'C']</code>", "<code>['A', 'C']</code>"),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. The chain only advances when a middleware calls <code>next()</code>. The second one forgets, so <code>C</code> never runs — and in a real Express app the request would hang forever with no response, until it times out. This is the single most common Express bug.',
            'Đã chạy thật. Chuỗi chỉ tiến khi một middleware gọi <code>next()</code>. Cái thứ hai quên, nên <code>C</code> không bao giờ chạy — và trong một app Express thật, request sẽ treo mãi không có phản hồi, cho tới khi hết giờ. Đây là lỗi Express phổ biến nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'How does Express tell an error-handling middleware apart from a normal one?' + code(
              "function a(req, res, next) {}\n" +
              "function b(err, req, res, next) {}\n" +
              "console.log(a.length, b.length);",
            ),
            'Express phân biệt middleware xử lý lỗi với middleware thường bằng cách nào?' + code(
              "function a(req, res, next) {}\n" +
              "function b(err, req, res, next) {}\n" +
              "console.log(a.length, b.length);",
            ),
          ),
          options: [
            B('By the function name matching a convention such as <code>errorHandler</code>', 'Theo tên hàm khớp một quy ước như <code>errorHandler</code>'),
            B('By its arity — a callback with 4 parameters marks an error handler (here <code>3 4</code>)', 'Theo số tham số — một callback 4 tham số đánh dấu là bộ xử lý lỗi (ở đây <code>3 4</code>)'),
            B('By a special <code>app.useError(fn)</code> registration call, not the shape', 'Bằng một lời gọi đăng ký riêng <code>app.useError(fn)</code>, không phải hình dạng'),
            B('There is no difference in shape; only being registered last decides', 'Không có khác biệt về hình dạng; chỉ việc đăng ký cuối cùng quyết định'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it: <code>a.length</code> is 3 and <code>b.length</code> is 4. Express inspects <code>fn.length</code>; a middleware declared with four parameters <code>(err, req, res, next)</code> is only invoked when something calls <code>next(err)</code>. Omit that first param and your error handler silently never runs.',
            'Đã chạy thật: <code>a.length</code> là 3 và <code>b.length</code> là 4. Express xét <code>fn.length</code>; middleware khai báo bốn tham số <code>(err, req, res, next)</code> chỉ được gọi khi có ai đó gọi <code>next(err)</code>. Bỏ tham số đầu đó thì bộ xử lý lỗi âm thầm không bao giờ chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'In Express 5, an async route handler throws (rejects). What happens by default versus in Express 4?',
            'Trong Express 5, một route handler async ném lỗi (reject). Mặc định điều gì xảy ra so với Express 4?',
          ),
          options: [
            B('Both versions await handlers and forward the rejection to the error middleware automatically', 'Cả hai phiên bản đều await handler và tự chuyển rejection tới middleware lỗi'),
            B('Express 5 forwards a rejected promise to the error handler; Express 4 does not, so it hangs unless you catch and call <code>next(err)</code>', 'Express 5 chuyển promise bị reject tới bộ xử lý lỗi; Express 4 thì không, nên treo trừ khi bạn bắt và gọi <code>next(err)</code>'),
            B('Both versions crash the process with an unhandledRejection and no route to recovery', 'Cả hai phiên bản làm sập tiến trình bằng unhandledRejection và không có đường phục hồi'),
            B('Neither supports async handlers; route callbacks must always be synchronous', 'Cả hai đều không hỗ trợ handler async; callback route luôn phải đồng bộ'),
          ],
          correct: 1,
          explanation: EX(
            'Express 5 was rewritten to await route handlers, so a rejected promise is routed to your error-handling middleware. In Express 4 an unhandled rejection in a handler leaves the request hanging — you had to wrap handlers in a <code>catch</code> that calls <code>next(err)</code> (or use a helper).',
            'Express 5 được viết lại để await các route handler, nên promise bị reject được đưa tới middleware xử lý lỗi. Ở Express 4, rejection không được bắt trong handler khiến request treo — bạn phải bọc handler trong một <code>catch</code> gọi <code>next(err)</code> (hoặc dùng một helper).',
          ),
        }),

        // ── Chương 6 — REST ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const pick = (m, found) => m === 'POST' ? 201 : m === 'DELETE' ? 204 : found ? 200 : 404;\n" +
              "console.log(pick('POST', false), pick('GET', false), pick('GET', true), pick('DELETE', true));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const pick = (m, found) => m === 'POST' ? 201 : m === 'DELETE' ? 204 : found ? 200 : 404;\n" +
              "console.log(pick('POST', false), pick('GET', false), pick('GET', true), pick('DELETE', true));",
            ),
          ),
          options: [
            B('<code>201 404 200 204</code>', '<code>201 404 200 204</code>'),
            B('<code>200 200 200 200</code>', '<code>200 200 200 200</code>'),
            B('<code>201 200 200 204</code>', '<code>201 200 200 204</code>'),
            B('<code>201 404 404 204</code>', '<code>201 404 404 204</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it, and it mirrors correct REST semantics: <code>201 Created</code> after a POST that made a resource, <code>404 Not Found</code> for a GET that found nothing, <code>200 OK</code> for a GET that found the resource, and <code>204 No Content</code> for a successful DELETE with an empty body.',
            'Đã chạy thật, và nó phản ánh đúng ngữ nghĩa REST: <code>201 Created</code> sau POST tạo được tài nguyên, <code>404 Not Found</code> cho GET không thấy gì, <code>200 OK</code> cho GET tìm thấy tài nguyên, và <code>204 No Content</code> cho DELETE thành công với thân rỗng.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO statements that correctly describe idempotency in HTTP.',
            'Chọn HAI phát biểu MÔ TẢ ĐÚNG về tính idempotent trong HTTP.',
          ),
          options: [
            B('Sending the same <code>PUT</code> twice leaves the resource in the same state as sending it once', 'Gửi cùng một <code>PUT</code> hai lần để lại tài nguyên ở cùng trạng thái như gửi một lần'),
            B('<code>POST</code> is idempotent — repeating it never creates duplicates', '<code>POST</code> là idempotent — lặp lại không bao giờ tạo bản trùng'),
            B('<code>DELETE</code> is idempotent — deleting an already-deleted resource still leaves it deleted', '<code>DELETE</code> là idempotent — xoá một tài nguyên đã bị xoá vẫn để nó ở trạng thái đã xoá'),
            B('<code>GET</code> is idempotent because it changes the resource in a fixed way', '<code>GET</code> idempotent vì nó thay đổi tài nguyên theo một cách cố định'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Idempotent means repeating the request has the same effect as making it once. <code>PUT</code> (replace) and <code>DELETE</code> qualify; <code>GET</code> is idempotent (and <em>safe</em>) precisely because it changes nothing. <code>POST</code> is not idempotent — two POSTs typically create two resources, which is why you add an idempotency key to protect against retries.',
            'Idempotent nghĩa là lặp lại request cho cùng hiệu ứng như làm một lần. <code>PUT</code> (thay thế) và <code>DELETE</code> thoả; <code>GET</code> idempotent (và <em>an toàn</em>) chính vì nó không đổi gì. <code>POST</code> không idempotent — hai POST thường tạo hai tài nguyên, nên người ta thêm khoá idempotency để chống việc thử lại.',
          ),
        }),

        // ── Chương 7 — PostgreSQL / Prisma ──────────────────────────────
        mcq({
          prompt: B(
            'A list endpoint loads 50 posts, then for each post runs a separate query to fetch its author. What is this, and the fix?',
            'Một endpoint danh sách nạp 50 bài, rồi với mỗi bài chạy một truy vấn riêng để lấy tác giả. Đây là gì, và cách sửa?',
          ),
          options: [
            B('A deadlock between transactions; fix it by raising the lock timeout so queries wait', 'Một deadlock giữa các transaction; sửa bằng cách tăng lock timeout để truy vấn chờ'),
            B('The N+1 query problem; fix with a JOIN / Prisma <code>include</code> or a single <code>WHERE id IN (...)</code>', 'Vấn đề truy vấn N+1; sửa bằng JOIN / Prisma <code>include</code> hoặc một <code>WHERE id IN (...)</code>'),
            B('A cache miss on each author lookup; fix by putting the whole endpoint behind Redis', 'Một cache miss ở mỗi lần tra tác giả; sửa bằng cách đặt cả endpoint sau Redis'),
            B('Nothing is wrong; one query per related row is the normal, expected pattern', 'Không có gì sai; một truy vấn cho mỗi dòng liên quan là mẫu bình thường, đúng như dự kiến'),
          ],
          correct: 1,
          explanation: EX(
            'One query for the list plus N queries for the children is the classic N+1: 51 round-trips where 1 or 2 would do. Fix it by joining (Prisma <code>include</code>/<code>select</code>) or by collecting the author ids and issuing a single <code>IN</code> query. Each round-trip adds real latency, so N+1 quietly dominates the response time.',
            'Một truy vấn cho danh sách cộng N truy vấn cho phần con chính là N+1 kinh điển: 51 lượt đi-về trong khi 1 hoặc 2 là đủ. Sửa bằng cách join (Prisma <code>include</code>/<code>select</code>) hoặc gom các id tác giả rồi ra một truy vấn <code>IN</code> duy nhất. Mỗi lượt đi-về thêm độ trễ thật, nên N+1 âm thầm chi phối thời gian phản hồi.',
          ),
        }),

        mcq({
          prompt: B(
            'Two requests read a balance of 100, each add 50, and each write 150. Money is lost. Which mechanism prevents this?',
            'Hai request đọc số dư 100, mỗi bên cộng 50, và mỗi bên ghi 150. Tiền bị mất. Cơ chế nào ngăn được?',
          ),
          options: [
            B('A row lock inside a transaction (<code>SELECT ... FOR UPDATE</code>) or an atomic <code>UPDATE ... SET balance = balance + 50</code>', 'Khoá dòng trong một transaction (<code>SELECT ... FOR UPDATE</code>) hoặc một <code>UPDATE ... SET balance = balance + 50</code> nguyên tử'),
            B('Adding an index on the balance column so the two writes cannot overlap in time', 'Thêm chỉ mục lên cột số dư để hai lần ghi không thể chồng lấn thời gian'),
            B('Increasing the connection pool size so each request gets its own isolated connection', 'Tăng kích thước connection pool để mỗi request có kết nối cô lập riêng'),
            B('Retrying the request on the client until the two writes happen to serialise', 'Thử lại request ở client cho tới khi hai lần ghi tình cờ tuần tự hoá'),
          ],
          correct: 0,
          explanation: EX(
            'This is a lost update from a read-modify-write race. The robust fix is to do the arithmetic in the database atomically (<code>balance = balance + 50</code>) or to take a row lock inside a transaction so the second request waits. A bigger pool or an index does not remove the race — it may make it more likely.',
            'Đây là mất cập nhật do đua đọc-sửa-ghi. Cách sửa vững là làm phép tính ngay trong CSDL một cách nguyên tử (<code>balance = balance + 50</code>) hoặc khoá dòng bên trong transaction để request thứ hai chờ. Tăng pool hay thêm chỉ mục không loại bỏ cuộc đua — có khi còn làm nó dễ xảy ra hơn.',
          ),
        }),

        mcq({
          prompt: B(
            'You need raw SQL in Prisma with a user-supplied <code>email</code>. Which is safe?',
            'Bạn cần SQL thô trong Prisma với <code>email</code> do người dùng nhập. Cách nào an toàn?',
          ),
          options: [
            B('<code>prisma.$queryRawUnsafe(`SELECT * FROM u WHERE email = &#x27;${email}&#x27;`)</code>', '<code>prisma.$queryRawUnsafe(`SELECT * FROM u WHERE email = &#x27;${email}&#x27;`)</code>'),
            B('<code>prisma.$queryRaw`SELECT * FROM u WHERE email = ${email}`</code> (tagged template → parameterised)', '<code>prisma.$queryRaw`SELECT * FROM u WHERE email = ${email}`</code> (tagged template → tham số hoá)'),
            B('Both are equally safe', 'Cả hai an toàn như nhau'),
            B('Neither; raw SQL is always unsafe', 'Không cái nào; SQL thô luôn không an toàn'),
          ],
          correct: 1,
          explanation: EX(
            'The tagged-template form <code>$queryRaw`... ${email}`</code> sends the value as a bound parameter, so it can never break out of the string context — that stops SQL injection. <code>$queryRawUnsafe</code> with string interpolation splices the input straight into the SQL text; a crafted email can rewrite the query.',
            'Dạng tagged-template <code>$queryRaw`... ${email}`</code> gửi giá trị như một tham số ràng buộc, nên nó không thể thoát khỏi ngữ cảnh chuỗi — chặn được SQL injection. <code>$queryRawUnsafe</code> với nội suy chuỗi nhét thẳng input vào văn bản SQL; một email được dàn dựng có thể viết lại truy vấn.',
          ),
        }),

        // ── Chương 8 — Auth ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print, and why does it matter for JWT?' + code(
              "const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');\n" +
              "console.log(header);",
            ),
            'Đoạn mã sau in ra gì, và vì sao nó quan trọng với JWT?' + code(
              "const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');\n" +
              "console.log(header);",
            ),
          ),
          options: [
            B('<code>eyJhbGciOiJub25lIn0</code> — a JWT is just base64url JSON, readable by anyone', '<code>eyJhbGciOiJub25lIn0</code> — JWT chỉ là JSON mã base64url, ai cũng đọc được'),
            B('<code>eyJhbGciOiJub25lIn0</code> — the header is encrypted', '<code>eyJhbGciOiJub25lIn0</code> — phần header được mã hoá'),
            B('A random string that changes each run', 'Một chuỗi ngẫu nhiên đổi mỗi lần chạy'),
            B('An error, because <code>alg</code> cannot be <code>none</code>', 'Một lỗi, vì <code>alg</code> không thể là <code>none</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. base64url is <em>encoding</em>, not encryption — decode it and you read the JSON straight back. So never put secrets in a JWT payload, and always verify the signature server-side with a fixed algorithm; a server that trusts a client-supplied <code>alg: none</code> can be tricked into accepting unsigned tokens.',
            'Đã chạy thật. base64url là <em>mã hoá dạng biểu diễn</em>, không phải mã hoá bí mật — giải nó ra là đọc lại JSON ngay. Nên đừng bao giờ để bí mật trong payload JWT, và luôn xác minh chữ ký ở phía server với một thuật toán cố định; một server tin vào <code>alg: none</code> do client gửi có thể bị lừa chấp nhận token không chữ ký.',
          ),
        }),

        mcq({
          prompt: B(
            'Why store password hashes with bcrypt/argon2 rather than a fast SHA-256?',
            'Vì sao lưu băm mật khẩu bằng bcrypt/argon2 thay vì SHA-256 nhanh?',
          ),
          options: [
            B('SHA-256 output is only 256 bits, which is too short to store safely in a column', 'Kết quả SHA-256 chỉ 256 bit, quá ngắn để lưu an toàn trong một cột'),
            B('bcrypt/argon2 are deliberately slow and salted, so brute-forcing stolen hashes is expensive', 'bcrypt/argon2 cố ý chậm và có salt, nên phá vét cạn các băm bị đánh cắp rất tốn kém'),
            B('SHA-256 cannot hash arbitrary text, only fixed-size binary blocks', 'SHA-256 không băm được văn bản tuỳ ý, chỉ băm các khối nhị phân cố định'),
            B('bcrypt is reversible, so you can decrypt and recover the original password later', 'bcrypt đảo ngược được, nên có thể giải mã và khôi phục mật khẩu gốc về sau'),
          ],
          correct: 1,
          explanation: EX(
            'A general-purpose hash like SHA-256 is fast, so an attacker with the hash file can try billions of guesses per second. bcrypt/argon2 have a tunable cost factor (and a per-password salt), making each guess slow and rainbow tables useless. Neither is reversible — you verify by hashing the candidate and comparing.',
            'Một hàm băm đa dụng như SHA-256 rất nhanh, nên kẻ tấn công có tệp băm có thể thử hàng tỉ lần mỗi giây. bcrypt/argon2 có hệ số chi phí điều chỉnh được (và salt riêng cho mỗi mật khẩu), khiến mỗi lần thử chậm và bảng cầu vồng vô dụng. Cả hai đều không đảo ngược — bạn xác minh bằng cách băm ứng viên rồi so.',
          ),
        }),

        mcq({
          prompt: B(
            'A stateless JWT was issued with a 7-day expiry. The user changes their password. Why can the old token still work, and what fixes it?',
            'Một JWT stateless được cấp với hạn 7 ngày. Người dùng đổi mật khẩu. Vì sao token cũ vẫn dùng được, và cách khắc phục?',
          ),
          options: [
            B('It cannot still work; changing the password immediately invalidates every token ever issued', 'Không thể còn dùng được; đổi mật khẩu vô hiệu ngay mọi token từng cấp'),
            B('A JWT is self-contained and not re-checked against the DB, so it stays valid until it expires; fix with short expiry + refresh tokens or a token-version claim', 'JWT tự chứa và không được đối chiếu lại DB, nên còn hiệu lực tới khi hết hạn; khắc phục bằng hạn ngắn + refresh token hoặc một claim token-version'),
            B('The signature is recomputed automatically on the server whenever the password changes', 'Chữ ký được server tự tính lại mỗi khi mật khẩu thay đổi'),
            B('Only cookies carry an expiry; the token itself never expires once issued', 'Chỉ cookie mang hạn dùng; bản thân token không bao giờ hết hạn khi đã cấp'),
          ],
          correct: 1,
          explanation: EX(
            'Statelessness is the whole point of a JWT — the server trusts the signature and does not look it up, so a valid unexpired token keeps working after a password change. Mitigations: keep access tokens short-lived and rotate with refresh tokens, embed a token version that you bump on password change, or maintain a deny-list of revoked ids.',
            'Tính stateless chính là điểm mấu chốt của JWT — server tin chữ ký và không tra cứu, nên một token hợp lệ chưa hết hạn vẫn chạy sau khi đổi mật khẩu. Cách giảm thiểu: giữ access token ngắn hạn và xoay bằng refresh token, nhúng một token version tăng lên khi đổi mật khẩu, hoặc giữ danh sách chặn các id đã thu hồi.',
          ),
        }),

        // ── Chương 9 — Security ─────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print, and what does it demonstrate?' + code(
              "const id = '1 OR 1=1';\n" +
              "const naive = 'SELECT * FROM u WHERE id=' + id;\n" +
              "console.log(naive);",
            ),
            'Đoạn mã sau in ra gì, và nó minh hoạ điều gì?' + code(
              "const id = '1 OR 1=1';\n" +
              "const naive = 'SELECT * FROM u WHERE id=' + id;\n" +
              "console.log(naive);",
            ),
          ),
          options: [
            B('<code>SELECT * FROM u WHERE id=1</code> — safe', '<code>SELECT * FROM u WHERE id=1</code> — an toàn'),
            B('<code>SELECT * FROM u WHERE id=1 OR 1=1</code> — SQL injection returning every row', '<code>SELECT * FROM u WHERE id=1 OR 1=1</code> — SQL injection trả về mọi dòng'),
            B('A syntax error', 'Một lỗi cú pháp'),
            B('<code>SELECT * FROM u WHERE id=&#x27;1 OR 1=1&#x27;</code> — quoted and safe', '<code>SELECT * FROM u WHERE id=&#x27;1 OR 1=1&#x27;</code> — đã đóng nháy, an toàn'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. String concatenation lets the input become SQL syntax: the <code>OR 1=1</code> makes the WHERE always true, dumping the whole table. Parameterised queries (bound values) keep the input as <em>data</em> so it can never turn into code — this is the only reliable defence.',
            'Đã chạy thật. Nối chuỗi khiến input trở thành cú pháp SQL: <code>OR 1=1</code> làm mệnh đề WHERE luôn đúng, xả cả bảng. Truy vấn tham số hoá (giá trị ràng buộc) giữ input là <em>dữ liệu</em> nên nó không thể biến thành mã — đây là biện pháp phòng vệ đáng tin duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'Comparing two secrets, what does this print and why is it the right tool?' + code(
              "const crypto = require('crypto');\n" +
              "try {\n" +
              "  crypto.timingSafeEqual(Buffer.from('ab'), Buffer.from('abc'));\n" +
              "  console.log('ok');\n" +
              "} catch (e) { console.log(e.constructor.name); }",
            ),
            'So sánh hai bí mật, đoạn mã sau in ra gì và vì sao đây là công cụ đúng?' + code(
              "const crypto = require('crypto');\n" +
              "try {\n" +
              "  crypto.timingSafeEqual(Buffer.from('ab'), Buffer.from('abc'));\n" +
              "  console.log('ok');\n" +
              "} catch (e) { console.log(e.constructor.name); }",
            ),
          ),
          options: [
            B('<code>ok</code> — it quietly returns false whenever the two lengths differ', '<code>ok</code> — nó lặng lẽ trả false mỗi khi hai độ dài khác nhau'),
            B('<code>RangeError</code> — inputs must be equal length; it compares in constant time to avoid timing attacks', '<code>RangeError</code> — hai đầu vào phải cùng độ dài; nó so trong thời gian hằng để tránh tấn công định thời'),
            B('<code>TypeError</code> — it only accepts strings, not Buffer objects, as arguments', '<code>TypeError</code> — nó chỉ nhận chuỗi, không nhận Buffer, làm đối số'),
            B('<code>ok</code> — the two lengths never matter to the comparison result', '<code>ok</code> — hai độ dài không bao giờ ảnh hưởng kết quả so sánh'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it: unequal lengths throw <code>RangeError</code>, so hash both sides to a fixed length first (or length-check without leaking). The point of <code>timingSafeEqual</code> is that it always scans the full buffer, so an attacker cannot learn how many leading bytes matched from the response time — a plain <code>===</code> can bail out early and leak that.',
            'Đã chạy thật: khác độ dài thì ném <code>RangeError</code>, nên hãy băm cả hai vế về độ dài cố định trước (hoặc kiểm độ dài mà không rò rỉ). Điểm mấu chốt của <code>timingSafeEqual</code> là nó luôn quét trọn buffer, nên kẻ tấn công không thể suy ra bao nhiêu byte đầu khớp qua thời gian phản hồi — một phép <code>===</code> thường có thể thoát sớm và làm rò điều đó.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO defences that belong on a public JSON API.',
            'Chọn HAI biện pháp phòng vệ nên có trên một API JSON công khai.',
          ),
          options: [
            B('Rate limiting to blunt brute-force and abuse', 'Giới hạn tần suất để làm cùn tấn công vét cạn và lạm dụng'),
            B('Reflecting the request <code>Origin</code> back as <code>Access-Control-Allow-Origin: *</code> together with <code>credentials: true</code>', 'Phản chiếu <code>Origin</code> của request lại thành <code>Access-Control-Allow-Origin: *</code> kèm <code>credentials: true</code>'),
            B('Validating and narrowing every input (e.g. with a schema) before it reaches the DB', 'Xác thực và thu hẹp mọi input (ví dụ bằng schema) trước khi tới DB'),
            B('Returning full stack traces to the client to aid debugging', 'Trả nguyên stack trace về client để dễ gỡ lỗi'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Rate limiting and strict input validation are core defences. Sending <code>Allow-Origin: *</code> with credentials is actually forbidden by browsers and, if forced, dangerous — it is not a defence. Full stack traces leak internal paths and library versions to attackers; return a generic error and log the detail server-side.',
            'Giới hạn tần suất và xác thực input chặt chẽ là phòng vệ cốt lõi. Gửi <code>Allow-Origin: *</code> kèm credentials thực ra bị trình duyệt cấm và nếu ép làm thì nguy hiểm — không phải phòng vệ. Trả nguyên stack trace làm rò đường dẫn nội bộ và phiên bản thư viện cho kẻ tấn công; hãy trả lỗi chung chung và ghi chi tiết ở phía server.',
          ),
        }),

        // ── Chương 10 — Upload ──────────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const { Readable } = require('stream');\n" +
              "(async () => {\n" +
              "  const r = Readable.from(['he', 'llo', ' world']);\n" +
              "  let chunks = 0, bytes = 0;\n" +
              "  for await (const ch of r) { chunks++; bytes += ch.length; }\n" +
              "  console.log(chunks, bytes);\n" +
              "})();",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const { Readable } = require('stream');\n" +
              "(async () => {\n" +
              "  const r = Readable.from(['he', 'llo', ' world']);\n" +
              "  let chunks = 0, bytes = 0;\n" +
              "  for await (const ch of r) { chunks++; bytes += ch.length; }\n" +
              "  console.log(chunks, bytes);\n" +
              "})();",
            ),
          ),
          options: [
            B('<code>1 11</code>', '<code>1 11</code>'),
            B('<code>3 11</code>', '<code>3 11</code>'),
            B('<code>3 3</code>', '<code>3 3</code>'),
            B('<code>11 11</code>', '<code>11 11</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. The stream yields three chunks (<code>&#x27;he&#x27;</code>, <code>&#x27;llo&#x27;</code>, <code>&#x27; world&#x27;</code>) whose lengths sum to 11. Consuming a stream chunk by chunk is exactly how you handle a large upload without loading the whole file into memory — the reason multipart uploads pipe to disk/R2 rather than buffering.',
            'Đã chạy thật. Stream phát ba mẩu (<code>&#x27;he&#x27;</code>, <code>&#x27;llo&#x27;</code>, <code>&#x27; world&#x27;</code>) có tổng độ dài 11. Tiêu thụ stream từng mẩu chính là cách xử lý một upload lớn mà không nạp cả tệp vào bộ nhớ — lý do upload multipart được pipe thẳng ra đĩa/R2 thay vì gom vào buffer.',
          ),
        }),

        mcq({
          prompt: B(
            'Why enforce a file-size limit while streaming an upload, rather than checking <code>size</code> after it finishes?',
            'Vì sao áp giới hạn kích thước NGAY trong lúc stream upload, thay vì kiểm <code>size</code> sau khi xong?',
          ),
          options: [
            B('Checking the size after the upload finishes is faster and simpler to code', 'Kiểm kích thước sau khi upload xong thì nhanh hơn và dễ viết hơn'),
            B('A client can stream gigabytes; without an inline limit you buffer/spool it all first and can exhaust memory or disk (a DoS)', 'Client có thể stream hàng gigabyte; không có giới hạn tại chỗ thì bạn gom/đổ hết ra trước và có thể cạn bộ nhớ hoặc đĩa (một DoS)'),
            B('The reported <code>size</code> field is always wrong and cannot be trusted at all', 'Trường <code>size</code> báo về luôn sai và hoàn toàn không tin được'),
            B('There is no way to know the file size in advance of the transfer', 'Không có cách nào biết kích thước tệp trước khi truyền'),
          ],
          correct: 1,
          explanation: EX(
            'If you only check after receiving the file, you have already accepted the whole thing — a malicious client sends an enormous body and fills your memory or disk before the check runs. Enforcing the cap as bytes arrive lets you abort the connection early. The <code>Content-Length</code> header can be spoofed, so the streaming counter is the real guard.',
            'Nếu chỉ kiểm sau khi nhận tệp, bạn đã chấp nhận trọn gói — một client ác ý gửi một thân khổng lồ và lấp đầy bộ nhớ hoặc đĩa trước khi phép kiểm chạy. Áp trần theo từng byte tới cho phép bạn huỷ kết nối sớm. Header <code>Content-Length</code> có thể bị giả, nên bộ đếm khi stream mới là chốt chặn thật.',
          ),
        }),

        // ── Chương 11 — Realtime ────────────────────────────────────────
        mcq({
          prompt: B(
            'You need the <em>server</em> to push frequent updates to browsers, bidirectionally. Which transport fits best?',
            'Bạn cần <em>server</em> đẩy cập nhật liên tục xuống trình duyệt, theo hai chiều. Kênh truyền nào hợp nhất?',
          ),
          options: [
            B('Short polling every second', 'Short polling mỗi giây'),
            B('A WebSocket — one persistent, full-duplex connection', 'Một WebSocket — kết nối bền, song công'),
            B('A fresh HTTP request per update', 'Một request HTTP mới cho mỗi cập nhật'),
            B('Server-Sent Events, because they are bidirectional', 'Server-Sent Events, vì chúng hai chiều'),
          ],
          correct: 1,
          explanation: EX(
            'A WebSocket upgrades one connection to full-duplex, so either side can send at any time with tiny framing overhead — ideal for chat or live updates. Polling wastes requests and adds latency. SSE is a good one-way (server→client) option but is <em>not</em> bidirectional, so it does not fit a two-way requirement.',
            'WebSocket nâng một kết nối lên song công, nên bên nào cũng gửi được bất cứ lúc nào với chi phí đóng khung nhỏ — lý tưởng cho chat hay cập nhật trực tiếp. Polling phí request và thêm độ trễ. SSE là lựa chọn một chiều (server→client) tốt nhưng <em>không</em> hai chiều, nên không hợp yêu cầu hai chiều.',
          ),
        }),

        mcq({
          prompt: B(
            'You scale Socket.IO to 3 Node processes behind a load balancer. A message emitted on process A never reaches a client connected to process B. Why, and the standard fix?',
            'Bạn mở rộng Socket.IO thành 3 tiến trình Node sau bộ cân bằng tải. Một message phát trên tiến trình A không tới được client nối vào tiến trình B. Vì sao, và cách sửa chuẩn?',
          ),
          options: [
            B('It is a bug in Socket.IO itself; downgrade to an earlier version to fix it', 'Là lỗi của chính Socket.IO; hạ xuống một phiên bản cũ hơn để sửa'),
            B('Each process only knows its own sockets; use the Redis adapter (pub/sub) so an emit fans out to all processes', 'Mỗi tiến trình chỉ biết socket của mình; dùng Redis adapter (pub/sub) để một emit lan ra mọi tiến trình'),
            B('Enable sticky sessions, which by itself makes an emit reach every process', 'Bật sticky session, tự nó khiến một emit tới được mọi tiến trình'),
            B('Increase the ping timeout so slow cross-process messages have time to arrive', 'Tăng ping timeout để message chậm giữa các tiến trình có thời gian tới'),
          ],
          correct: 1,
          explanation: EX(
            'In-memory, a process only holds the connections it accepted, so a broadcast on A cannot reach B&#x27;s clients. The Redis adapter publishes emits over pub/sub so every process delivers to its own sockets. (Sticky sessions solve a different problem — keeping one client&#x27;s handshake on one process — and are still needed with polling transport.)',
            'Trong bộ nhớ, một tiến trình chỉ giữ các kết nối nó nhận, nên broadcast trên A không với tới client của B. Redis adapter phát các emit qua pub/sub để mọi tiến trình giao tới socket của mình. (Sticky session giải một vấn đề khác — giữ bắt tay của một client trên một tiến trình — và vẫn cần khi dùng kênh polling.)',
          ),
        }),

        // ── Chương 12 — Redis ───────────────────────────────────────────
        mcq({
          prompt: B(
            'This uses a Map as a tiny LRU cache (capacity 2). What does it print?' + code(
              "const m = new Map();\n" +
              "const put = (k, v) => { if (m.has(k)) m.delete(k); m.set(k, v); if (m.size > 2) m.delete(m.keys().next().value); };\n" +
              "put('a', 1); put('b', 2); put('a', 9); put('c', 3);\n" +
              "console.log([...m.keys()]);",
            ),
            'Đoạn này dùng Map làm một LRU cache nhỏ (sức chứa 2). Nó in ra gì?' + code(
              "const m = new Map();\n" +
              "const put = (k, v) => { if (m.has(k)) m.delete(k); m.set(k, v); if (m.size > 2) m.delete(m.keys().next().value); };\n" +
              "put('a', 1); put('b', 2); put('a', 9); put('c', 3);\n" +
              "console.log([...m.keys()]);",
            ),
          ),
          options: [
            B("<code>['a', 'c']</code>", "<code>['a', 'c']</code>"),
            B("<code>['b', 'c']</code>", "<code>['b', 'c']</code>"),
            B("<code>['a', 'b', 'c']</code>", "<code>['a', 'b', 'c']</code>"),
            B("<code>['c', 'a']</code>", "<code>['c', 'a']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A Map keeps insertion order. Re-putting <code>a</code> deletes and re-adds it, moving it to the most-recent end, so when <code>c</code> overflows capacity the oldest key is <code>b</code>, which is evicted. This is the recency logic Redis implements with real LRU/LFU eviction policies.',
            'Đã chạy thật. Map giữ thứ tự chèn. Đặt lại <code>a</code> xoá rồi thêm lại nó, đẩy nó về đầu mới-nhất, nên khi <code>c</code> tràn sức chứa thì khoá cũ nhất là <code>b</code>, và bị trục xuất. Đây chính là logic gần-đây mà Redis hiện thực bằng các chính sách trục xuất LRU/LFU thật.',
          ),
        }),

        mcq({
          prompt: B(
            'Which is a correct, safe use of Redis?',
            'Đâu là một cách dùng Redis đúng và an toàn?',
          ),
          options: [
            B('<code>SET key val NX EX 30</code> to acquire a short-lived lock / cache entry that auto-expires', '<code>SET key val NX EX 30</code> để giành một khoá / mục cache ngắn hạn tự hết hạn'),
            B('Use it as the only durable store for financial records with no database', 'Dùng làm kho bền duy nhất cho hồ sơ tài chính, không cần CSDL'),
            B('Cache values forever without a TTL to maximise hit rate', 'Cache mãi mãi không đặt TTL để tối đa tỉ lệ trúng'),
            B('Store per-user data under one shared key for all users', 'Lưu dữ liệu từng người dưới một khoá chung cho mọi người'),
          ],
          correct: 0,
          explanation: EX(
            '<code>SET ... NX EX</code> sets a key only if absent and gives it a TTL in one atomic step — the basis of simple locks and self-expiring caches. Redis is primarily in-memory, so it is not a system-of-record for money on its own; caching without any TTL risks serving stale data forever; and a shared key would leak data between users.',
            '<code>SET ... NX EX</code> đặt khoá chỉ khi chưa có và gán TTL trong một bước nguyên tử — nền tảng của khoá đơn giản và cache tự hết hạn. Redis chủ yếu ở trong bộ nhớ, nên tự nó không phải nơi lưu gốc cho tiền; cache không TTL thì có nguy cơ phục vụ dữ liệu cũ mãi; và một khoá chung sẽ làm rò dữ liệu giữa những người dùng.',
          ),
        }),

        // ── Chương 13 — Jobs / queues ───────────────────────────────────
        mcq({
          prompt: B(
            'A concurrency limiter of 2 runs 5 tasks. What does it print?' + code(
              "const order = [];\n" +
              "async function run() {\n" +
              "  const tasks = [1, 2, 3, 4, 5];\n" +
              "  let i = 0;\n" +
              "  async function worker() {\n" +
              "    while (i < tasks.length) {\n" +
              "      const t = tasks[i++];\n" +
              "      order.push('start' + t);\n" +
              "      await new Promise(r => setTimeout(r, 10));\n" +
              "    }\n" +
              "  }\n" +
              "  await Promise.all([worker(), worker()]);\n" +
              "  console.log(order.slice(0, 3));\n" +
              "}\n" +
              "run();",
            ),
            'Một bộ giới hạn đồng thời bằng 2 chạy 5 tác vụ. Nó in ra gì?' + code(
              "const order = [];\n" +
              "async function run() {\n" +
              "  const tasks = [1, 2, 3, 4, 5];\n" +
              "  let i = 0;\n" +
              "  async function worker() {\n" +
              "    while (i < tasks.length) {\n" +
              "      const t = tasks[i++];\n" +
              "      order.push('start' + t);\n" +
              "      await new Promise(r => setTimeout(r, 10));\n" +
              "    }\n" +
              "  }\n" +
              "  await Promise.all([worker(), worker()]);\n" +
              "  console.log(order.slice(0, 3));\n" +
              "}\n" +
              "run();",
            ),
          ),
          options: [
            B("<code>['start1', 'start2', 'start3']</code>", "<code>['start1', 'start2', 'start3']</code>"),
            B("<code>['start1', 'start1', 'start2']</code>", "<code>['start1', 'start1', 'start2']</code>"),
            B("<code>['start1', 'start3', 'start5']</code>", "<code>['start1', 'start3', 'start5']</code>"),
            B("<code>['start1', 'start2', 'start4']</code>", "<code>['start1', 'start2', 'start4']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Two workers start synchronously: the first takes task 1 (i→1), the second takes task 2 (i→2), each then awaits. When the first timer fires it takes the next available task, 3. Because <code>i</code> is shared and incremented before the await, no task is processed twice and none is skipped — the essence of a bounded worker pool.',
            'Đã chạy thật. Hai worker khởi động đồng bộ: cái đầu lấy tác vụ 1 (i→1), cái sau lấy tác vụ 2 (i→2), rồi mỗi cái await. Khi timer đầu tiên nổ, nó lấy tác vụ khả dụng kế, số 3. Vì <code>i</code> dùng chung và tăng trước khi await, không tác vụ nào bị xử lý hai lần và không cái nào bị bỏ sót — cốt lõi của một worker pool có chặn.',
          ),
        }),

        mcq({
          prompt: B(
            'A job queue promises "at-least-once" delivery. What must the job handler be, and why?',
            'Một hàng đợi job hứa giao "ít nhất một lần". Bộ xử lý job phải thế nào, và vì sao?',
          ),
          options: [
            B('Fast, so it always finishes before the visibility timeout and is never retried', 'Nhanh, để luôn xong trước visibility timeout và không bao giờ bị giao lại'),
            B('Idempotent, because the same job may be delivered more than once (retries, crashes) and must not double-charge/double-send', 'Idempotent, vì cùng một job có thể được giao hơn một lần (thử lại, sập) và không được tính tiền/gửi hai lần'),
            B('Synchronous, so jobs always run one at a time in their original enqueue order', 'Đồng bộ, để job luôn chạy từng cái theo đúng thứ tự đưa vào hàng đợi'),
            B('Stateless, so it never writes to the database and therefore cannot create duplicates', 'Stateless, để không bao giờ ghi vào CSDL và do đó không thể tạo bản trùng'),
          ],
          correct: 1,
          explanation: EX(
            'At-least-once means duplicates are expected: a worker may crash after doing the work but before acknowledging, so the queue re-delivers. The handler must be idempotent — guard with a unique job/operation id, an upsert, or a "already processed?" check — so a repeat is a no-op rather than a second email or a second charge.',
            'Ít-nhất-một-lần nghĩa là bản trùng là điều dự kiến: một worker có thể sập sau khi làm xong việc nhưng trước khi báo nhận, nên hàng đợi giao lại. Bộ xử lý phải idempotent — chốt bằng một id job/thao tác duy nhất, một upsert, hoặc một phép kiểm "đã xử lý chưa?" — để một lần lặp là vô tác dụng thay vì email thứ hai hay lần tính tiền thứ hai.',
          ),
        }),

        // ── Chương 14 — Testing ─────────────────────────────────────────
        mcq({
          prompt: B(
            'A test uses a fake repository. What does this print, and what risk does it show?' + code(
              "let calls = 0;\n" +
              "const fakeCreate = () => { calls++; return 201; };\n" +
              "console.log(fakeCreate(), fakeCreate(), fakeCreate(), calls);",
            ),
            'Một test dùng repository giả. Đoạn mã in ra gì, và nó cho thấy rủi ro gì?' + code(
              "let calls = 0;\n" +
              "const fakeCreate = () => { calls++; return 201; };\n" +
              "console.log(fakeCreate(), fakeCreate(), fakeCreate(), calls);",
            ),
          ),
          options: [
            B('<code>201 201 201 3</code> — the fake always "succeeds", hiding a real unique-constraint violation', '<code>201 201 201 3</code> — bản giả luôn "thành công", che mất vi phạm ràng buộc UNIQUE thật'),
            B('<code>201 409 409 3</code> — the fake enforces uniqueness like a real table', '<code>201 409 409 3</code> — bản giả có ép tính duy nhất như bảng thật'),
            B('<code>201 undefined undefined 1</code> — only the first call actually runs', '<code>201 undefined undefined 1</code> — chỉ lời gọi đầu tiên thật sự chạy'),
            B('A TypeError, because <code>calls</code> is read before it is defined', 'Một lỗi TypeError, vì <code>calls</code> bị đọc trước khi được định nghĩa'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The fake returns 201 every call because it has no database and no constraints. A real table with a unique index would reject the 2nd and 3rd inserts (Postgres error <code>23505</code>) and your handler should map that to 409. Over-mocking makes green tests that lie — some integration tests must hit a real database.',
            'Đã chạy thật. Bản giả trả 201 mỗi lần vì nó không có CSDL và không có ràng buộc. Một bảng thật với chỉ mục UNIQUE sẽ từ chối lần chèn thứ 2 và 3 (lỗi Postgres <code>23505</code>) và handler của bạn nên ánh xạ đó thành 409. Giả lập quá đà tạo ra test xanh nhưng dối — một số integration test phải chạm CSDL thật.',
          ),
        }),

        mcq({
          prompt: B(
            'A module shows 100% line coverage, yet a privilege-escalation bug survives. How is that possible?',
            'Một module đạt 100% độ phủ dòng, nhưng một lỗi leo thang quyền vẫn sống sót. Sao có thể thế?',
          ),
          options: [
            B('Coverage numbers are computed by the runtime and cannot be inflated by a test', 'Số độ phủ do runtime tính và một test không thể thổi phồng'),
            B('Coverage counts whether a line was executed, not whether you asserted the right outcome; a test can run a line and check nothing meaningful', 'Độ phủ đếm xem một dòng có được chạy hay không, không đếm bạn có kiểm đúng kết cục hay không; một test có thể chạy một dòng mà chẳng kiểm gì có ý nghĩa'),
            B('100% line coverage is a mathematical guarantee that no bug can remain', '100% độ phủ dòng là bảo đảm toán học rằng không lỗi nào còn sót'),
            B('The coverage tool was misconfigured and counted lines that never actually ran', 'Công cụ đo độ phủ bị cấu hình sai và đếm cả những dòng chưa từng chạy'),
          ],
          correct: 1,
          explanation: EX(
            'Coverage measures execution, not correctness. A test that calls a function and asserts nothing (or asserts something trivially true) still lights up every line as "covered" while never checking that <code>canEdit</code> actually returns false for the wrong user. High coverage is necessary hygiene, not proof — the assertions are what catch bugs.',
            'Độ phủ đo sự thực thi, không đo tính đúng. Một test gọi hàm mà không kiểm gì (hoặc kiểm điều hiển nhiên đúng) vẫn làm sáng mọi dòng thành "đã phủ" trong khi không hề kiểm rằng <code>canEdit</code> thật sự trả false cho người dùng sai. Độ phủ cao là vệ sinh cần thiết, không phải bằng chứng — chính các phép khẳng định mới bắt lỗi.',
          ),
        }),

        // ── Chương 15 — Observability ───────────────────────────────────
        mcq({
          prompt: B(
            'What does this print, and why prefer it to <code>console.log("req", 200)</code> in production?' + code(
              "console.log(JSON.stringify({ level: 'info', msg: 'req', status: 200, ms: 5 }));",
            ),
            'Đoạn mã in ra gì, và vì sao ưu tiên nó hơn <code>console.log("req", 200)</code> ở production?' + code(
              "console.log(JSON.stringify({ level: 'info', msg: 'req', status: 200, ms: 5 }));",
            ),
          ),
          options: [
            B('<code>{"level":"info","msg":"req","status":200,"ms":5}</code> — structured logs are machine-queryable by field', '<code>{"level":"info","msg":"req","status":200,"ms":5}</code> — log có cấu trúc truy vấn được theo trường'),
            B('<code>[object Object]</code> — the object is coerced to a plain string', '<code>[object Object]</code> — object bị ép về một chuỗi thường'),
            B('A pretty multi-line table with one aligned column per field', 'Một bảng nhiều dòng đẹp mắt, mỗi trường một cột thẳng hàng'),
            B('Nothing prints, because <code>JSON.stringify</code> returns undefined here', 'Không in gì, vì <code>JSON.stringify</code> trả undefined ở đây'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. One JSON object per line lets a log system filter and aggregate by <code>status</code>, <code>ms</code> or <code>level</code> without brittle text parsing — the point of structured logging. A libraries like pino write these fast; you would also attach a request id so all lines from one request can be joined.',
            'Đã chạy thật. Mỗi dòng một object JSON cho phép hệ thống log lọc và tổng hợp theo <code>status</code>, <code>ms</code> hay <code>level</code> mà không cần phân tích văn bản mong manh — điểm mấu chốt của log có cấu trúc. Thư viện như pino ghi chúng rất nhanh; bạn cũng nên gắn một request id để nối mọi dòng của cùng một request.',
          ),
        }),

        mcq({
          prompt: B(
            'A dashboard shows p95 latency of 114ms and everyone is happy, but a few users report 8-second waits. What is the trap?',
            'Bảng theo dõi hiện p95 độ trễ 114ms và ai cũng vui, nhưng vài người dùng báo chờ 8 giây. Cạm bẫy là gì?',
          ),
          options: [
            B('The dashboard is broken and is under-reporting the true latency numbers', 'Bảng theo dõi bị hỏng và báo thiếu con số độ trễ thật'),
            B('A percentile hides the tail: p95 says nothing about the slowest 5%; you must also watch p99/max and per-route breakdowns', 'Phân vị che phần đuôi: p95 không nói gì về 5% chậm nhất; phải theo dõi thêm p99/max và phân tách theo route'),
            B('8 seconds still falls within the p95 bucket, so it is nothing to worry about', '8 giây vẫn nằm trong khoảng p95, nên không có gì phải lo'),
            B('Latency simply cannot be measured reliably under real production load', 'Độ trễ đơn giản là không thể đo đáng tin dưới tải production thật'),
          ],
          correct: 1,
          explanation: EX(
            'p95 means 95% of requests were faster than 114ms — it deliberately ignores the slow tail where real users get hurt. A single 8s outlier is invisible at p95 and may only surface at p99.99 or in max. Watch tail percentiles, alert on them, and break latency down per route to find the culprit endpoint.',
            'p95 nghĩa là 95% request nhanh hơn 114ms — nó cố ý bỏ qua phần đuôi chậm nơi người dùng thật bị ảnh hưởng. Một điểm ngoại lệ 8s vô hình ở p95 và có thể chỉ lộ ở p99.99 hoặc trong max. Hãy theo dõi các phân vị đuôi, đặt cảnh báo cho chúng, và phân tách độ trễ theo route để tìm endpoint thủ phạm.',
          ),
        }),

        // ── Chương 16 — Performance ─────────────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const a = new Array(3);\n" +
              "const b = Array.from({ length: 3 }, (_, i) => i);\n" +
              "console.log(a.length, JSON.stringify(a), JSON.stringify(b));",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const a = new Array(3);\n" +
              "const b = Array.from({ length: 3 }, (_, i) => i);\n" +
              "console.log(a.length, JSON.stringify(a), JSON.stringify(b));",
            ),
          ),
          options: [
            B('<code>3 [null,null,null] [0,1,2]</code>', '<code>3 [null,null,null] [0,1,2]</code>'),
            B('<code>3 [] [0,1,2]</code>', '<code>3 [] [0,1,2]</code>'),
            B('<code>0 [] [0,1,2]</code>', '<code>0 [] [0,1,2]</code>'),
            B('<code>3 [undefined,undefined,undefined] [0,1,2]</code>', '<code>3 [undefined,undefined,undefined] [0,1,2]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>new Array(3)</code> creates a sparse array of length 3 with holes — iteration methods like <code>map</code> skip the holes, a classic surprise. <code>JSON.stringify</code> renders holes as <code>null</code>. <code>Array.from({length:3}, fn)</code> actually fills each slot, which is the reliable way to build an initialised array.',
            'Đã chạy thật. <code>new Array(3)</code> tạo một mảng thưa độ dài 3 với các lỗ trống — các phương thức lặp như <code>map</code> bỏ qua lỗ, một bất ngờ kinh điển. <code>JSON.stringify</code> hiện lỗ thành <code>null</code>. <code>Array.from({length:3}, fn)</code> mới thật sự lấp từng ô, là cách đáng tin để dựng một mảng đã khởi tạo.',
          ),
        }),

        mcq({
          prompt: B(
            'Profiling shows an endpoint spends 97% of its time waiting on the database, 1% in JSON serialisation. Where should you optimise first?',
            'Đo hiệu năng cho thấy một endpoint dành 97% thời gian chờ CSDL, 1% ở tuần tự hoá JSON. Nên tối ưu chỗ nào trước?',
          ),
          options: [
            B('Replace <code>JSON.stringify</code> with a faster serialiser to shave off the 1%', 'Thay <code>JSON.stringify</code> bằng bộ tuần tự hoá nhanh hơn để cạo bớt 1%'),
            B('The query/index and round-trips — the 97%; shaving the 1% cannot help much (Amdahl&#x27;s law)', 'Truy vấn/chỉ mục và các lượt đi-về — phần 97%; cạo phần 1% không giúp được bao nhiêu (định luật Amdahl)'),
            B('Rewrite the route in a compiled language so the JavaScript overhead disappears', 'Viết lại route bằng ngôn ngữ biên dịch để chi phí JavaScript biến mất'),
            B('Add more CPU cores so the serialisation step can run in parallel', 'Thêm nhân CPU để bước tuần tự hoá chạy song song'),
          ],
          correct: 1,
          explanation: EX(
            'Optimise where the time actually goes. If 97% is database wait, the whole possible win from the 1% serialiser is under 1% end-to-end — so profile, then attack the query, the missing index, or the N+1. "Measure before you optimise" is the chapter&#x27;s core lesson; intuition about hotspots is usually wrong.',
            'Tối ưu ở nơi thời gian thật sự trôi. Nếu 97% là chờ CSDL, toàn bộ phần thắng khả dĩ từ bộ tuần tự hoá 1% là dưới 1% toàn cục — nên hãy đo, rồi tấn công truy vấn, chỉ mục thiếu, hoặc N+1. "Đo trước khi tối ưu" là bài học cốt lõi của chương; trực giác về điểm nóng thường sai.',
          ),
        }),

        // ── Chương 17 — Docker / deploy ─────────────────────────────────
        mcq({
          prompt: B(
            'In a Dockerfile, why copy <code>package.json</code> and run <code>npm ci</code> <em>before</em> <code>COPY . .</code>?',
            'Trong Dockerfile, vì sao copy <code>package.json</code> và chạy <code>npm ci</code> <em>trước</em> <code>COPY . .</code>?',
          ),
          options: [
            B('It makes the final image smaller by de-duplicating the dependency layers', 'Làm ảnh cuối nhỏ hơn bằng cách khử trùng lặp các tầng phụ thuộc'),
            B('Layer caching — the cached <code>npm ci</code> layer is reused unless the manifest changes, so rebuilds are far faster', 'Cache tầng — tầng <code>npm ci</code> đã cache được tái dùng trừ khi manifest đổi, nên build lại nhanh hơn nhiều'),
            B('npm requires the manifest to be copied before any install can run', 'npm bắt buộc phải copy manifest trước khi chạy cài đặt'),
            B('It has no real effect; Docker rebuilds every layer regardless of order', 'Không có tác dụng thật; Docker dựng lại mọi tầng bất kể thứ tự'),
          ],
          correct: 1,
          explanation: EX(
            'Docker caches each layer by its inputs. If you <code>COPY . .</code> first, any source edit invalidates the layer and forces a full reinstall. Copying just the manifest first means the expensive install layer is reused whenever only source changes — the chapter measured this as roughly a 5-6× faster rebuild.',
            'Docker cache mỗi tầng theo đầu vào của nó. Nếu <code>COPY . .</code> trước, mọi chỉnh sửa mã nguồn làm mất hiệu lực tầng và ép cài lại toàn bộ. Copy riêng manifest trước nghĩa là tầng cài đặt tốn kém được tái dùng mỗi khi chỉ mã nguồn đổi — chương đã đo được điều này giúp build lại nhanh cỡ 5-6 lần.',
          ),
        }),

        mcq({
          prompt: B(
            'Why prefer <code>CMD ["node", "server.js"]</code> over <code>CMD ["npm", "start"]</code> in a container?',
            'Vì sao ưu tiên <code>CMD ["node", "server.js"]</code> hơn <code>CMD ["npm", "start"]</code> trong container?',
          ),
          options: [
            B('npm is not installed in slim production images, so the container fails to start', 'npm không được cài trong ảnh production gọn, nên container không khởi động được'),
            B('With node as PID 1 the process receives <code>SIGTERM</code> directly and shuts down gracefully; npm in front often swallows the signal', 'Với node là PID 1, tiến trình nhận <code>SIGTERM</code> trực tiếp và tắt êm; npm ở phía trước thường nuốt mất tín hiệu'),
            B('node starts several seconds faster than npm, cutting container boot time', 'node khởi động nhanh hơn npm vài giây, giảm thời gian khởi động container'),
            B('There is no practical difference; both forward signals to the app identically', 'Không có khác biệt thực tế; cả hai chuyển tín hiệu tới app y như nhau'),
          ],
          correct: 1,
          explanation: EX(
            'On <code>docker stop</code> the runtime sends <code>SIGTERM</code> to PID 1. If npm is PID 1 it does not forward the signal to your node child, so your graceful-shutdown handler never runs and the container is <code>SIGKILL</code>ed after the grace period — dropping in-flight requests. Running node directly (or with a tiny init) makes your app PID 1 and lets it drain cleanly.',
            'Khi <code>docker stop</code>, runtime gửi <code>SIGTERM</code> tới PID 1. Nếu npm là PID 1, nó không chuyển tiếp tín hiệu tới node con, nên bộ xử lý tắt êm của bạn không bao giờ chạy và container bị <code>SIGKILL</code> sau thời gian ân hạn — làm rớt các request đang dở. Chạy node trực tiếp (hoặc với một init nhỏ) khiến app của bạn là PID 1 và tắt sạch được.',
          ),
        }),

        // ── Chương 18 — Kiến trúc ───────────────────────────────────────
        mcq({
          prompt: B(
            'Business rules keep getting duplicated because they live directly in route handlers that also touch the database. What layering fixes this?',
            'Quy tắc nghiệp vụ cứ bị lặp lại vì chúng nằm thẳng trong route handler mà handler đó cũng đụng CSDL. Cách phân tầng nào khắc phục?',
          ),
          options: [
            B('Put every route and query in one big file so the logic is easy to find', 'Dồn mọi route và truy vấn vào một tệp lớn cho dễ tìm logic'),
            B('Extract a service layer: routes handle HTTP, services hold business logic and orchestrate data access, so rules live in one reusable place', 'Tách một tầng service: route lo HTTP, service giữ logic nghiệp vụ và điều phối truy cập dữ liệu, nên quy tắc nằm ở một chỗ tái dùng được'),
            B('Move all business logic into the database using triggers and stored procedures', 'Chuyển hết logic nghiệp vụ vào CSDL bằng trigger và stored procedure'),
            B('Keep duplicating the rules in each handler but add comments to track them', 'Cứ lặp quy tắc trong từng handler nhưng thêm ghi chú để theo dõi'),
          ],
          correct: 1,
          explanation: EX(
            'When a route both parses HTTP and enforces business rules and runs queries, the rules cannot be reused by another route or a background job, so they get copy-pasted and drift. A service layer holds the logic once; routes become thin adapters that validate input, call a service, and shape the response. The chapter measured this repo at roughly a 1.9:1 service-to-route ratio.',
            'Khi một route vừa phân tích HTTP vừa ép quy tắc nghiệp vụ vừa chạy truy vấn, quy tắc không thể tái dùng bởi route khác hay một job nền, nên bị chép-dán và trôi dạt. Tầng service giữ logic một lần; route thành lớp chuyển đổi mỏng: xác thực input, gọi service, và định hình phản hồi. Chương đã đo repo này ở tỉ lệ service:route khoảng 1,9:1.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about splitting a monolith into services.',
            'Chọn HAI phát biểu ĐÚNG về việc tách một monolith thành các service.',
          ),
          options: [
            B('It trades in-process calls for network calls, adding latency, partial failure and the need for distributed tracing', 'Nó đánh đổi lời gọi trong-tiến-trình lấy lời gọi mạng, thêm độ trễ, lỗi cục bộ và nhu cầu truy vết phân tán'),
            B('It always makes the system faster', 'Nó luôn làm hệ thống nhanh hơn'),
            B('A well-structured monolith is a reasonable default until scaling or team boundaries force a split', 'Một monolith có cấu trúc tốt là mặc định hợp lý cho tới khi quy mô hoặc ranh giới đội buộc phải tách'),
            B('Each service should share one database schema for consistency', 'Mỗi service nên dùng chung một schema CSDL để nhất quán'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Splitting turns a function call into a network hop — now you handle timeouts, retries, partial failure and tracing, and it is usually slower, not faster. A modular monolith is a sound default; split when a component needs independent scaling or a team needs an independent deploy boundary. Sharing one schema across services recreates tight coupling, defeating the point.',
            'Tách biến một lời gọi hàm thành một chặng mạng — giờ bạn phải lo timeout, thử lại, lỗi cục bộ và truy vết, và thường chậm hơn chứ không nhanh hơn. Một monolith mô-đun hoá là mặc định vững; hãy tách khi một thành phần cần mở rộng độc lập hoặc một đội cần ranh giới deploy độc lập. Dùng chung một schema giữa các service tái tạo sự ghép chặt, làm mất ý nghĩa của việc tách.',
          ),
        }),

        // ── Bổ sung — trải rộng thêm Chương 1-3 ─────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              "console.log([parseInt('08'), parseInt('0x10'), parseInt('12px'), Number('12px'), Number('')]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "console.log([parseInt('08'), parseInt('0x10'), parseInt('12px'), Number('12px'), Number('')]);",
            ),
          ),
          options: [
            B('<code>[8, 16, 12, NaN, 0]</code>', '<code>[8, 16, 12, NaN, 0]</code>'),
            B('<code>[0, 16, 12, 12, 0]</code>', '<code>[0, 16, 12, 12, 0]</code>'),
            B('<code>[8, 0, NaN, NaN, NaN]</code>', '<code>[8, 0, NaN, NaN, NaN]</code>'),
            B('<code>[8, 16, NaN, NaN, NaN]</code>', '<code>[8, 16, NaN, NaN, NaN]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>parseInt</code> reads leading digits and stops: <code>&#x27;08&#x27;</code>→8 (no longer octal in modern JS), <code>&#x27;0x10&#x27;</code>→16 (it detects hex), <code>&#x27;12px&#x27;</code>→12 (stops at <code>p</code>). <code>Number</code> is all-or-nothing: <code>&#x27;12px&#x27;</code>→NaN, but the empty string coerces to 0. That last one bites validation code that treats <code>Number(&#x27;&#x27;)</code> as invalid.',
            'Đã chạy thật. <code>parseInt</code> đọc các chữ số đầu rồi dừng: <code>&#x27;08&#x27;</code>→8 (không còn là bát phân trong JS hiện đại), <code>&#x27;0x10&#x27;</code>→16 (nó nhận ra hệ 16), <code>&#x27;12px&#x27;</code>→12 (dừng ở <code>p</code>). <code>Number</code> thì được-ăn-cả-ngã-về-không: <code>&#x27;12px&#x27;</code>→NaN, nhưng chuỗi rỗng ép về 0. Cái cuối này cắn vào mã kiểm tra vốn coi <code>Number(&#x27;&#x27;)</code> là không hợp lệ.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const { a = 1, b = 2, c = 3 } = { a: undefined, b: null, c: 0 };\n" +
              "console.log([a, b, c]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const { a = 1, b = 2, c = 3 } = { a: undefined, b: null, c: 0 };\n" +
              "console.log([a, b, c]);",
            ),
          ),
          options: [
            B('<code>[1, 2, 3]</code>', '<code>[1, 2, 3]</code>'),
            B('<code>[1, null, 0]</code>', '<code>[1, null, 0]</code>'),
            B('<code>[undefined, null, 0]</code>', '<code>[undefined, null, 0]</code>'),
            B('<code>[1, 2, 0]</code>', '<code>[1, 2, 0]</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running it. A destructuring default applies only when the value is <code>undefined</code>. So <code>a</code> gets its default 1, but <code>b</code> stays <code>null</code> and <code>c</code> stays <code>0</code> — those are defined values. This is the same rule as <code>??</code>, and the same reason a legitimate <code>0</code> survives while an explicit <code>undefined</code> does not.',
            'Đã chạy thật. Giá trị mặc định khi phá cấu trúc chỉ áp dụng khi giá trị là <code>undefined</code>. Nên <code>a</code> nhận mặc định 1, nhưng <code>b</code> vẫn là <code>null</code> và <code>c</code> vẫn là <code>0</code> — đó là các giá trị đã xác định. Đây cùng luật với <code>??</code>, và cùng lý do một số <code>0</code> hợp lệ sống sót trong khi một <code>undefined</code> tường minh thì không.',
          ),
        }),
      ],
    },
  ],
};
