/**
 * Node.js — Final Exam 4 (FE-4): 50 câu trắc nghiệm phủ cả 18 chương.
 *
 * Đề tự soạn, bám sát `content/courses/nodejs/s01…s18`. Mọi đoạn mã hỏi
 * "in ra gì" đều đã CHẠY THẬT bằng `node` v22.21.0 (harness scratchpad/fe4-verify.mjs).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-FE4.mjs --apply
 */
import { B, EX, code, mcq } from './_lib/nodejs-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam 4</b> — 50 multiple-choice questions across all 18 chapters, and the last of the four full-course finals. As before, every printed output was produced by running the snippet on Node v22, so read the code rather than trusting a hunch.</p>' +
  '<p>A few questions say "choose TWO" — they only count as correct when both answers are selected. You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá 4</b> — 50 câu trắc nghiệm phủ cả 18 chương, và là đề cuối trong bốn đề tổng kết. Như trước, mọi kết quả in ra đều lấy từ việc chạy đoạn mã trên Node v22, nên hãy đọc mã thay vì tin cảm tính.</p>' +
  '<p>Vài câu ghi "chọn HAI" — chỉ đúng khi chọn đủ cả hai đáp án. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-4',
      source: 'SAMPLE',
      sortOrder: 7,
      title: B(
        'Final Exam 4 — the whole Node.js course (50 questions)',
        'Thi cuối khoá 4 — toàn bộ khoá Node.js (50 câu)',
      ),
      description: B(
        'The fourth and final full-course exam: fifty fresh multiple-choice questions across all eighteen chapters — JavaScript, the runtime, core modules, npm, Express, REST, PostgreSQL, auth, security, uploads, realtime, Redis, queues, testing, observability, performance, Docker and architecture.',
        'Đề tổng kết thứ tư và cuối cùng: năm mươi câu trắc nghiệm mới phủ cả mười tám chương — JavaScript, runtime, module lõi, npm, Express, REST, PostgreSQL, xác thực, bảo mật, upload, realtime, Redis, hàng đợi, kiểm thử, quan sát hệ thống, hiệu năng, Docker và kiến trúc.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Ch1 — JavaScript ──
        mcq({
          prompt: B(
            'What does this print?' + code("console.log([[1,2,3].reduce((a,b)=>a+b), [1,2,3].reduce((a,b)=>a+b,10), [5].reduce((a,b)=>a+b)]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([[1,2,3].reduce((a,b)=>a+b), [1,2,3].reduce((a,b)=>a+b,10), [5].reduce((a,b)=>a+b)]);"),
          ),
          options: [
            B('<code>[6, 16, 5]</code>', '<code>[6, 16, 5]</code>'),
            B('<code>[6, 6, 5]</code>', '<code>[6, 6, 5]</code>'),
            B('<code>[6, 16, undefined]</code>', '<code>[6, 16, undefined]</code>'),
            B('<code>[5, 16, 5]</code>', '<code>[5, 16, 5]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Without a seed, <code>reduce</code> starts from the first element (6). With a seed of 10 it adds to that (16). On a single-element array with no seed, <code>reduce</code> returns that element without ever calling the reducer (5). Note that <code>[].reduce(fn)</code> with no seed throws — always pass an initial value for possibly-empty arrays.',
            'Đã chạy thật. Không có giá trị khởi tạo, <code>reduce</code> bắt đầu từ phần tử đầu (6). Với khởi tạo 10 thì cộng vào đó (16). Trên mảng một phần tử không khởi tạo, <code>reduce</code> trả về phần tử đó mà không gọi hàm rút gọn (5). Lưu ý <code>[].reduce(fn)</code> không khởi tạo sẽ ném lỗi — luôn truyền giá trị đầu cho mảng có thể rỗng.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log(['5', '10', '1'].sort((a, b) => a - b));"),
            'Đoạn mã sau in ra gì?' + code("console.log(['5', '10', '1'].sort((a, b) => a - b));"),
          ),
          options: [
            B("<code>['1', '5', '10']</code>", "<code>['1', '5', '10']</code>"),
            B("<code>['1', '10', '5']</code>", "<code>['1', '10', '5']</code>"),
            B("<code>['10', '5', '1']</code>", "<code>['10', '5', '1']</code>"),
            B("<code>['5', '10', '1']</code>", "<code>['5', '10', '1']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Even though the elements are strings, the comparator subtracts them, which coerces each side to a number, so they sort numerically: 1, 5, 10. The array still holds strings — <code>sort</code> only reorders. Contrast the default string sort, which would give <code>[&#x27;1&#x27;, &#x27;10&#x27;, &#x27;5&#x27;]</code>.',
            'Đã chạy thật. Dù các phần tử là chuỗi, hàm so sánh trừ chúng, làm mỗi vế ép về số, nên chúng sắp theo số: 1, 5, 10. Mảng vẫn chứa chuỗi — <code>sort</code> chỉ sắp lại. Trái với sắp chuỗi mặc định, vốn cho <code>[&#x27;1&#x27;, &#x27;10&#x27;, &#x27;5&#x27;]</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([1, [2, [3, [4]]]].flat(Infinity));"),
            'Đoạn mã sau in ra gì?' + code("console.log([1, [2, [3, [4]]]].flat(Infinity));"),
          ),
          options: [
            B('<code>[1, 2, 3, 4]</code>', '<code>[1, 2, 3, 4]</code>'),
            B('<code>[1, 2, [3, [4]]]</code>', '<code>[1, 2, [3, [4]]]</code>'),
            B('<code>[1, [2, [3, [4]]]]</code>', '<code>[1, [2, [3, [4]]]]</code>'),
            B('A RangeError from <code>Infinity</code>', 'Một RangeError từ <code>Infinity</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>flat(depth)</code> flattens nested arrays up to <code>depth</code> levels; passing <code>Infinity</code> flattens completely regardless of nesting depth. The default depth is 1, which would only unwrap the first level. This is the clean way to fully flatten an arbitrarily nested array.',
            'Đã chạy thật. <code>flat(depth)</code> làm phẳng mảng lồng tới <code>depth</code> tầng; truyền <code>Infinity</code> làm phẳng hoàn toàn bất kể độ lồng. Độ sâu mặc định là 1, chỉ mở tầng đầu. Đây là cách gọn để làm phẳng trọn một mảng lồng bất kỳ.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const o = { a: 1 };\n" +
              "const o2 = { ...o, b: 2 };\n" +
              "o.a = 9;\n" +
              "console.log([o2.a, o2.b]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const o = { a: 1 };\n" +
              "const o2 = { ...o, b: 2 };\n" +
              "o.a = 9;\n" +
              "console.log([o2.a, o2.b]);",
            ),
          ),
          options: [
            B('<code>[1, 2]</code>', '<code>[1, 2]</code>'),
            B('<code>[9, 2]</code>', '<code>[9, 2]</code>'),
            B('<code>[9, undefined]</code>', '<code>[9, undefined]</code>'),
            B('<code>[1, undefined]</code>', '<code>[1, undefined]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Spreading copies the values of <code>o</code>&#x27;s own enumerable properties into <code>o2</code> at that moment, so <code>o2.a</code> is 1. Mutating <code>o.a</code> afterward does not affect the already-copied <code>o2</code>. But note the copy is shallow — nested objects would still be shared by reference.',
            'Đã chạy thật. Spread sao chép giá trị các thuộc tính own enumerable của <code>o</code> vào <code>o2</code> ngay lúc đó, nên <code>o2.a</code> là 1. Sửa <code>o.a</code> sau đó không ảnh hưởng <code>o2</code> đã sao. Nhưng lưu ý bản sao là nông — object lồng vẫn được chia sẻ theo tham chiếu.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([null, undefined, 0, '', false, NaN, 1, 'x'].filter(Boolean));"),
            'Đoạn mã sau in ra gì?' + code("console.log([null, undefined, 0, '', false, NaN, 1, 'x'].filter(Boolean));"),
          ),
          options: [
            B("<code>[1, 'x']</code>", "<code>[1, 'x']</code>"),
            B("<code>[0, '', false, NaN, 1, 'x']</code>", "<code>[0, '', false, NaN, 1, 'x']</code>"),
            B("<code>[null, undefined, 0, '', false, NaN, 1, 'x']</code>", "<code>[null, undefined, 0, '', false, NaN, 1, 'x']</code>"),
            B("<code>[1]</code>", "<code>[1]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>filter(Boolean)</code> keeps only truthy values, dropping every falsy one: <code>null</code>, <code>undefined</code>, <code>0</code>, the empty string, <code>false</code> and <code>NaN</code>. Only <code>1</code> and <code>&#x27;x&#x27;</code> survive. This is the idiomatic one-liner for removing "empty" values, but beware it also strips a legitimate <code>0</code> or <code>&#x27;&#x27;</code>.',
            'Đã chạy thật. <code>filter(Boolean)</code> chỉ giữ giá trị truthy, bỏ mọi giá trị falsy: <code>null</code>, <code>undefined</code>, <code>0</code>, chuỗi rỗng, <code>false</code> và <code>NaN</code>. Chỉ <code>1</code> và <code>&#x27;x&#x27;</code> sống sót. Đây là câu một dòng quen thuộc để bỏ giá trị "rỗng", nhưng coi chừng nó cũng loại một <code>0</code> hay <code>&#x27;&#x27;</code> hợp lệ.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log(['a', 'b', 'c'].indexOf('b'), 'abc'.indexOf('z'), [1, 2, 3].at(-1));"),
            'Đoạn mã sau in ra gì?' + code("console.log(['a', 'b', 'c'].indexOf('b'), 'abc'.indexOf('z'), [1, 2, 3].at(-1));"),
          ),
          options: [
            B('<code>1 -1 3</code>', '<code>1 -1 3</code>'),
            B('<code>2 0 3</code>', '<code>2 0 3</code>'),
            B('<code>1 -1 -1</code>', '<code>1 -1 -1</code>'),
            B('<code>1 undefined 3</code>', '<code>1 undefined 3</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>indexOf</code> returns the zero-based position (1) or <code>-1</code> when not found — <em>not</em> undefined, which is why <code>if (indexOf(...))</code> is a bug for the first element. <code>.at(-1)</code> is the modern way to read the last element (3) without <code>arr[arr.length-1]</code>.',
            'Đã chạy thật. <code>indexOf</code> trả vị trí tính từ 0 (1) hoặc <code>-1</code> khi không thấy — <em>không</em> phải undefined, đó là lý do <code>if (indexOf(...))</code> là lỗi với phần tử đầu. <code>.at(-1)</code> là cách hiện đại đọc phần tử cuối (3) mà không cần <code>arr[arr.length-1]</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log(JSON.stringify({ b: 2, a: 1 }), Object.keys({ 2: 'a', 1: 'b', x: 'c' }));"),
            'Đoạn mã sau in ra gì?' + code("console.log(JSON.stringify({ b: 2, a: 1 }), Object.keys({ 2: 'a', 1: 'b', x: 'c' }));"),
          ),
          options: [
            B("<code>{\"b\":2,\"a\":1} ['1', '2', 'x']</code>", "<code>{\"b\":2,\"a\":1} ['1', '2', 'x']</code>"),
            B("<code>{\"a\":1,\"b\":2} ['2', '1', 'x']</code>", "<code>{\"a\":1,\"b\":2} ['2', '1', 'x']</code>"),
            B("<code>{\"b\":2,\"a\":1} ['2', '1', 'x']</code>", "<code>{\"b\":2,\"a\":1} ['2', '1', 'x']</code>"),
            B("<code>{\"a\":1,\"b\":2} ['x', '1', '2']</code>", "<code>{\"a\":1,\"b\":2} ['x', '1', '2']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. String keys keep their insertion order, so the JSON is <code>{"b":2,"a":1}</code>. But <em>integer-like</em> keys are a special case: they are always ordered ascending and come first, so <code>2</code> and <code>1</code> reorder to <code>&#x27;1&#x27;, &#x27;2&#x27;</code> before the string key <code>&#x27;x&#x27;</code>. Never rely on object key order for numeric-looking keys.',
            'Đã chạy thật. Khoá chuỗi giữ thứ tự chèn, nên JSON là <code>{"b":2,"a":1}</code>. Nhưng khoá <em>giống số nguyên</em> là ca đặc biệt: chúng luôn sắp tăng dần và đứng trước, nên <code>2</code> và <code>1</code> đổi thành <code>&#x27;1&#x27;, &#x27;2&#x27;</code> trước khoá chuỗi <code>&#x27;x&#x27;</code>. Đừng bao giờ dựa vào thứ tự khoá object cho các khoá trông như số.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([0 || '' || 'x' || 'y', 1 && 2 && 3, null?.foo ?? 'z']);"),
            'Đoạn mã sau in ra gì?' + code("console.log([0 || '' || 'x' || 'y', 1 && 2 && 3, null?.foo ?? 'z']);"),
          ),
          options: [
            B("<code>['x', 3, 'z']</code>", "<code>['x', 3, 'z']</code>"),
            B("<code>['y', 1, null]</code>", "<code>['y', 1, null]</code>"),
            B("<code>['x', 6, 'z']</code>", "<code>['x', 6, 'z']</code>"),
            B("<code>[0, 3, 'z']</code>", "<code>[0, 3, 'z']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>||</code> returns the first truthy operand (or the last if none), so it skips <code>0</code> and <code>&#x27;&#x27;</code> to reach <code>&#x27;x&#x27;</code>. <code>&&</code> returns the first falsy operand or the last one, here <code>3</code>. And <code>null?.foo</code> short-circuits to undefined, so <code>?? &#x27;z&#x27;</code> supplies the fallback. These operators return operands, not booleans.',
            'Đã chạy thật. <code>||</code> trả toán hạng truthy đầu tiên (hoặc cái cuối nếu không có), nên nó bỏ <code>0</code> và <code>&#x27;&#x27;</code> để tới <code>&#x27;x&#x27;</code>. <code>&&</code> trả toán hạng falsy đầu tiên hoặc cái cuối, ở đây là <code>3</code>. Và <code>null?.foo</code> chập mạch về undefined, nên <code>?? &#x27;z&#x27;</code> cấp giá trị dự phòng. Các toán tử này trả toán hạng, không phải boolean.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([10 % 3, -10 % 3, 10 % -3]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([10 % 3, -10 % 3, 10 % -3]);"),
          ),
          options: [
            B('<code>[1, -1, 1]</code>', '<code>[1, -1, 1]</code>'),
            B('<code>[1, 2, -2]</code>', '<code>[1, 2, -2]</code>'),
            B('<code>[1, 1, 1]</code>', '<code>[1, 1, 1]</code>'),
            B('<code>[1, -1, -1]</code>', '<code>[1, -1, -1]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. In JavaScript <code>%</code> is the <em>remainder</em>, not a mathematical modulo: the result takes the sign of the <em>dividend</em> (the left operand). So <code>-10 % 3</code> is <code>-1</code> and <code>10 % -3</code> is <code>1</code>. For a always-positive modulo, use <code>((n % m) + m) % m</code>.',
            'Đã chạy thật. Trong JavaScript <code>%</code> là <em>phần dư</em>, không phải modulo toán học: kết quả mang dấu của <em>số bị chia</em> (toán hạng trái). Nên <code>-10 % 3</code> là <code>-1</code> và <code>10 % -3</code> là <code>1</code>. Muốn modulo luôn dương, dùng <code>((n % m) + m) % m</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([Math.max(), Math.min(), Math.max(1, 2, 3)]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([Math.max(), Math.min(), Math.max(1, 2, 3)]);"),
          ),
          options: [
            B('<code>[-Infinity, Infinity, 3]</code>', '<code>[-Infinity, Infinity, 3]</code>'),
            B('<code>[0, 0, 3]</code>', '<code>[0, 0, 3]</code>'),
            B('<code>[Infinity, -Infinity, 3]</code>', '<code>[Infinity, -Infinity, 3]</code>'),
            B('<code>[NaN, NaN, 3]</code>', '<code>[NaN, NaN, 3]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. With no arguments, <code>Math.max()</code> returns <code>-Infinity</code> and <code>Math.min()</code> returns <code>Infinity</code> — the identity values, so any real number will replace them. This bites when you spread an empty array: <code>Math.max(...[])</code> is <code>-Infinity</code>, not 0 or an error.',
            'Đã chạy thật. Không đối số, <code>Math.max()</code> trả <code>-Infinity</code> và <code>Math.min()</code> trả <code>Infinity</code> — giá trị đơn vị, nên bất kỳ số thật nào cũng thay chúng. Điều này cắn khi bạn spread một mảng rỗng: <code>Math.max(...[])</code> là <code>-Infinity</code>, không phải 0 hay một lỗi.',
          ),
        }),

        // ── Ch2 ──
        mcq({
          prompt: B(
            'In what order does this print?' + code(
              "async function g() { return 1; }\n" +
              "g().then(v => console.log('then', v));\n" +
              "console.log('sync');",
            ),
            'Đoạn mã sau in ra theo thứ tự nào?' + code(
              "async function g() { return 1; }\n" +
              "g().then(v => console.log('then', v));\n" +
              "console.log('sync');",
            ),
          ),
          options: [
            B('<code>sync</code> then <code>then 1</code>', '<code>sync</code> rồi <code>then 1</code>'),
            B('<code>then 1</code> then <code>sync</code>', '<code>then 1</code> rồi <code>sync</code>'),
            B('<code>then 1</code> only', 'Chỉ <code>then 1</code>'),
            B('<code>sync</code> only', 'Chỉ <code>sync</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>g()</code> returns a resolved promise; the <code>.then</code> callback is a microtask that runs only after the current synchronous code finishes. So <code>&#x27;sync&#x27;</code> prints first, then <code>&#x27;then 1&#x27;</code>. Even an already-resolved promise defers its callback — <code>.then</code> is never synchronous.',
            'Đã chạy thật. <code>g()</code> trả một promise đã resolve; callback <code>.then</code> là một microtask chỉ chạy sau khi mã đồng bộ hiện tại xong. Nên <code>&#x27;sync&#x27;</code> in trước, rồi <code>&#x27;then 1&#x27;</code>. Kể cả một promise đã resolve vẫn hoãn callback — <code>.then</code> không bao giờ đồng bộ.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([typeof (async () => {})(), (async () => {})() instanceof Promise]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([typeof (async () => {})(), (async () => {})() instanceof Promise]);"),
          ),
          options: [
            B("<code>['object', true]</code>", "<code>['object', true]</code>"),
            B("<code>['function', true]</code>", "<code>['function', true]</code>"),
            B("<code>['undefined', false]</code>", "<code>['undefined', false]</code>"),
            B("<code>['promise', true]</code>", "<code>['promise', true]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Calling an async function <em>always</em> returns a Promise, regardless of what the body returns (even nothing). <code>typeof</code> a promise is <code>&#x27;object&#x27;</code> (there is no <code>&#x27;promise&#x27;</code> type), and it is an instance of <code>Promise</code>. This is why you can always <code>await</code> or <code>.then</code> the result of an async function.',
            'Đã chạy thật. Gọi một hàm async <em>luôn</em> trả một Promise, bất kể thân trả gì (kể cả không gì). <code>typeof</code> một promise là <code>&#x27;object&#x27;</code> (không có kiểu <code>&#x27;promise&#x27;</code>), và nó là một thực thể của <code>Promise</code>. Đây là lý do bạn luôn có thể <code>await</code> hoặc <code>.then</code> kết quả của một hàm async.',
          ),
        }),

        mcq({
          prompt: B(
            'In what order does this print?' + code(
              "let x = 0;\n" +
              "Promise.resolve().then(() => { x = 1; }).then(() => console.log('after', x));\n" +
              "console.log('now', x);",
            ),
            'Đoạn mã sau in ra theo thứ tự nào?' + code(
              "let x = 0;\n" +
              "Promise.resolve().then(() => { x = 1; }).then(() => console.log('after', x));\n" +
              "console.log('now', x);",
            ),
          ),
          options: [
            B('<code>now 0</code> then <code>after 1</code>', '<code>now 0</code> rồi <code>after 1</code>'),
            B('<code>now 1</code> then <code>after 1</code>', '<code>now 1</code> rồi <code>after 1</code>'),
            B('<code>after 1</code> then <code>now 0</code>', '<code>after 1</code> rồi <code>now 0</code>'),
            B('<code>now 0</code> then <code>after 0</code>', '<code>now 0</code> rồi <code>after 0</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The synchronous <code>console.log(&#x27;now&#x27;, x)</code> runs first while <code>x</code> is still 0. The promise callbacks are microtasks: the first sets <code>x = 1</code>, the chained second then logs <code>after 1</code>. Synchronous code always completes before any <code>.then</code> callback runs.',
            'Đã chạy thật. <code>console.log(&#x27;now&#x27;, x)</code> đồng bộ chạy trước khi <code>x</code> vẫn là 0. Các callback promise là microtask: cái đầu đặt <code>x = 1</code>, cái thứ hai nối tiếp in <code>after 1</code>. Mã đồng bộ luôn hoàn tất trước khi bất kỳ callback <code>.then</code> nào chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "(async () => {\n" +
              "  const r = await Promise.race([\n" +
              "    new Promise(res => setTimeout(() => res('slow'), 50)),\n" +
              "    new Promise(res => setTimeout(() => res('fast'), 10)),\n" +
              "  ]);\n" +
              "  console.log(r);\n" +
              "})();",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "(async () => {\n" +
              "  const r = await Promise.race([\n" +
              "    new Promise(res => setTimeout(() => res('slow'), 50)),\n" +
              "    new Promise(res => setTimeout(() => res('fast'), 10)),\n" +
              "  ]);\n" +
              "  console.log(r);\n" +
              "})();",
            ),
          ),
          options: [
            B('<code>fast</code>', '<code>fast</code>'),
            B('<code>slow</code>', '<code>slow</code>'),
            B("<code>['fast', 'slow']</code>", "<code>['fast', 'slow']</code>"),
            B('Both, in sequence', 'Cả hai, theo thứ tự'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>Promise.race</code> settles with the first promise to settle — here the 10ms one wins, so <code>&#x27;fast&#x27;</code>. The slower promise still runs to completion; its result is just ignored. <code>race</code> is the standard building block for timeouts: race your work against a promise that rejects after N ms.',
            'Đã chạy thật. <code>Promise.race</code> settle theo promise settle đầu tiên — ở đây cái 10ms thắng, nên <code>&#x27;fast&#x27;</code>. Promise chậm hơn vẫn chạy tới hết; kết quả của nó chỉ bị bỏ qua. <code>race</code> là khối dựng chuẩn cho timeout: đua công việc của bạn với một promise reject sau N ms.',
          ),
        }),

        // ── Ch3 ──
        mcq({
          prompt: B(
            'What does this print?' + code("console.log(Buffer.concat([Buffer.from('ab'), Buffer.from('cd')]).toString());"),
            'Đoạn mã sau in ra gì?' + code("console.log(Buffer.concat([Buffer.from('ab'), Buffer.from('cd')]).toString());"),
          ),
          options: [
            B('<code>abcd</code>', '<code>abcd</code>'),
            B('<code>ab,cd</code>', '<code>ab,cd</code>'),
            B("<code>['ab', 'cd']</code>", "<code>['ab', 'cd']</code>"),
            B('<code>abcd</code> as two lines', '<code>abcd</code> thành hai dòng'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>Buffer.concat</code> joins an array of buffers into one contiguous buffer, and <code>toString()</code> decodes it as UTF-8, giving <code>&#x27;abcd&#x27;</code>. This is exactly how you collect a stream: push each chunk into an array, then <code>Buffer.concat</code> at the end — far more efficient than repeated string concatenation.',
            'Đã chạy thật. <code>Buffer.concat</code> nối một mảng buffer thành một buffer liền, và <code>toString()</code> giải nó thành UTF-8, cho <code>&#x27;abcd&#x27;</code>. Đây đúng là cách bạn gom một stream: đẩy từng mẩu vào một mảng, rồi <code>Buffer.concat</code> ở cuối — hiệu quả hơn nhiều so với nối chuỗi lặp lại.',
          ),
        }),

        mcq({
          prompt: B(
            'Which statement about Node streams is correct?',
            'Phát biểu nào về stream trong Node là ĐÚNG?',
          ),
          options: [
            B('Streams process data in chunks with backpressure, so you can handle a file larger than available memory', 'Stream xử lý dữ liệu theo mẩu với backpressure, nên bạn xử lý được tệp lớn hơn bộ nhớ khả dụng'),
            B('A stream always loads the entire source into memory before the first chunk is available', 'Stream luôn nạp toàn bộ nguồn vào bộ nhớ trước khi mẩu đầu tiên có sẵn'),
            B('<code>pipe</code> is only for text and cannot be used with binary data', '<code>pipe</code> chỉ dành cho văn bản và không dùng được với dữ liệu nhị phân'),
            B('Streams are synchronous and block the event loop for their whole duration', 'Stream đồng bộ và chặn vòng lặp sự kiện suốt thời gian chạy'),
          ],
          correct: 0,
          explanation: EX(
            'Streams deliver data incrementally in chunks and support backpressure — a fast producer pauses when a slow consumer cannot keep up — so memory stays bounded no matter how big the source is. <code>pipe</code> wires a readable to a writable and handles binary fine; streams are asynchronous and do not block the loop.',
            'Stream giao dữ liệu tăng dần theo mẩu và hỗ trợ backpressure — một bên sản xuất nhanh tạm dừng khi bên tiêu thụ chậm không theo kịp — nên bộ nhớ luôn có chặn dù nguồn lớn cỡ nào. <code>pipe</code> nối một readable với một writable và xử lý nhị phân tốt; stream bất đồng bộ và không chặn vòng lặp.',
          ),
        }),

        // ── Ch4 ──
        mcq({
          prompt: B(
            'Where does a package listed only under <code>devDependencies</code> (e.g. a test runner) end up?',
            'Một gói chỉ nằm trong <code>devDependencies</code> (ví dụ một test runner) rốt cuộc đi đâu?',
          ),
          options: [
            B('It is installed for development and CI but skipped by <code>npm ci --omit=dev</code> in a production image', 'Nó được cài cho phát triển và CI nhưng bị bỏ qua bởi <code>npm ci --omit=dev</code> trong ảnh production'),
            B('It is bundled into the production image exactly like a normal dependency', 'Nó được gói vào ảnh production y hệt một dependency thường'),
            B('It is uploaded to the npm registry when you publish the package', 'Nó được tải lên registry npm khi bạn phát hành gói'),
            B('It is only available when the package is imported by another project', 'Nó chỉ có sẵn khi gói được import bởi một dự án khác'),
          ],
          correct: 0,
          explanation: EX(
            'Dev dependencies (test frameworks, linters, type stubs) are needed to build and test but not to run in production. Installing with <code>--omit=dev</code> (or <code>NODE_ENV=production</code>) skips them, keeping the production image smaller and its attack surface narrower. Runtime code must never <code>require</code> a dev dependency, or production will crash.',
            'Dev dependency (framework test, linter, type stub) cần để build và test nhưng không cần để chạy ở production. Cài với <code>--omit=dev</code> (hoặc <code>NODE_ENV=production</code>) bỏ chúng, giữ ảnh production nhỏ hơn và bề mặt tấn công hẹp hơn. Mã runtime không bao giờ được <code>require</code> một dev dependency, nếu không production sẽ sập.',
          ),
        }),

        // ── Ch5 ──
        mcq({
          prompt: B(
            'You mount <code>app.use(express.static(&#x27;public&#x27;))</code> and also define API routes. A request to <code>/api/users</code> should hit your route, but <code>/logo.png</code> should serve the file. How does Express decide?',
            'Bạn gắn <code>app.use(express.static(&#x27;public&#x27;))</code> và cũng định nghĩa route API. Request tới <code>/api/users</code> nên vào route của bạn, còn <code>/logo.png</code> nên phục vụ tệp. Express quyết định thế nào?',
          ),
          options: [
            B('Middleware runs in order; static tries to match a file and calls <code>next()</code> if none exists, so order and the "file exists?" check decide', 'Middleware chạy theo thứ tự; static thử khớp một tệp và gọi <code>next()</code> nếu không có, nên thứ tự và phép kiểm "tệp tồn tại?" quyết định'),
            B('Express serves static files only from routes whose path starts with <code>/static</code>', 'Express chỉ phục vụ tệp tĩnh từ các route có đường dẫn bắt đầu bằng <code>/static</code>'),
            B('API routes always take priority over static files no matter the order', 'Route API luôn ưu tiên hơn tệp tĩnh bất kể thứ tự'),
            B('Static file serving replaces the router, so you cannot use both together', 'Phục vụ tệp tĩnh thay thế router, nên không dùng chung được cả hai'),
          ],
          correct: 0,
          explanation: EX(
            'Every middleware, including <code>express.static</code>, gets each request in registration order. Static checks whether a matching file exists in its directory; if so it serves it, otherwise it calls <code>next()</code> and the request continues to your routes. So <code>/logo.png</code> is served (file exists) while <code>/api/users</code> falls through to the API handler.',
            'Mọi middleware, kể cả <code>express.static</code>, nhận từng request theo thứ tự đăng ký. Static kiểm xem có tệp khớp trong thư mục của nó không; nếu có thì phục vụ, nếu không thì gọi <code>next()</code> và request tiếp tục tới các route của bạn. Nên <code>/logo.png</code> được phục vụ (tệp tồn tại) còn <code>/api/users</code> rơi xuống handler API.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO statements about Express middleware that are correct.',
            'Chọn HAI phát biểu ĐÚNG về middleware của Express.',
          ),
          options: [
            B('Middleware can read and modify <code>req</code> and <code>res</code> before the route handler runs', 'Middleware có thể đọc và sửa <code>req</code> và <code>res</code> trước khi route handler chạy'),
            B('Calling <code>next(err)</code> skips remaining normal middleware and jumps to error handlers', 'Gọi <code>next(err)</code> bỏ qua middleware thường còn lại và nhảy tới các bộ xử lý lỗi'),
            B('Middleware always runs after the route handler, never before', 'Middleware luôn chạy sau route handler, không bao giờ trước'),
            B('A middleware that calls <code>res.send</code> must still call <code>next()</code> to finish the response', 'Một middleware gọi <code>res.send</code> vẫn phải gọi <code>next()</code> để hoàn tất phản hồi'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Middleware sits in the request pipeline before (and around) handlers, so it can mutate <code>req</code>/<code>res</code>, short-circuit, or pass control on. Calling <code>next(err)</code> jumps straight to the error-handling middleware. Middleware runs in registration order (not always after the handler), and once you send a response you must NOT also call <code>next()</code> — that risks a double response.',
            'Middleware nằm trong đường ống request trước (và bao quanh) handler, nên nó có thể sửa <code>req</code>/<code>res</code>, chập mạch, hoặc chuyển tiếp quyền. Gọi <code>next(err)</code> nhảy thẳng tới middleware xử lý lỗi. Middleware chạy theo thứ tự đăng ký (không phải luôn sau handler), và một khi đã gửi phản hồi thì KHÔNG được gọi thêm <code>next()</code> — sẽ rủi ro phản hồi hai lần.',
          ),
        }),

        // ── Ch6 ──
        mcq({
          prompt: B(
            'A POST that creates a resource succeeds. Which response best follows REST conventions?',
            'Một POST tạo tài nguyên thành công. Phản hồi nào theo đúng quy ước REST nhất?',
          ),
          options: [
            B('<code>201 Created</code> with the new resource (or a <code>Location</code> header pointing to it)', '<code>201 Created</code> kèm tài nguyên mới (hoặc một header <code>Location</code> trỏ tới nó)'),
            B('<code>200 OK</code> with an empty body and no indication of what was created', '<code>200 OK</code> với thân rỗng và không cho biết đã tạo gì'),
            B('<code>204 No Content</code>, since creating a resource returns nothing to the client', '<code>204 No Content</code>, vì tạo một tài nguyên không trả gì cho client'),
            B('<code>302 Found</code> to redirect the client back to the create form again', '<code>302 Found</code> để chuyển client về lại trang tạo'),
          ],
          correct: 0,
          explanation: EX(
            '<code>201 Created</code> is the status that specifically means "a new resource now exists"; returning the created entity (with its server-assigned id) or a <code>Location</code> header lets the client use it immediately. <code>204</code> is for a success with genuinely no body (e.g. a DELETE), and a redirect is not how an API signals creation.',
            '<code>201 Created</code> là mã trạng thái nghĩa cụ thể là "một tài nguyên mới giờ đã tồn tại"; trả entity vừa tạo (kèm id server gán) hoặc một header <code>Location</code> cho client dùng ngay. <code>204</code> dành cho một thành công thật sự không có thân (ví dụ DELETE), và chuyển hướng không phải cách một API báo việc tạo.',
          ),
        }),

        // ── Ch7 ──
        mcq({
          prompt: B(
            'What does this print?' + code("console.log([[1,2,3].includes(2), [{id:1},{id:2}].find(x => x.id === 2)?.id, [1,2,3].findIndex(x => x === 9)]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([[1,2,3].includes(2), [{id:1},{id:2}].find(x => x.id === 2)?.id, [1,2,3].findIndex(x => x === 9)]);"),
          ),
          options: [
            B('<code>[true, 2, -1]</code>', '<code>[true, 2, -1]</code>'),
            B('<code>[true, 2, undefined]</code>', '<code>[true, 2, undefined]</code>'),
            B('<code>[2, 2, -1]</code>', '<code>[2, 2, -1]</code>'),
            B('<code>[true, {id:2}, -1]</code>', '<code>[true, {id:2}, -1]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>includes</code> returns a boolean (true). <code>find</code> returns the matching element, and <code>?.id</code> reads its id (2). <code>findIndex</code> returns <code>-1</code> when nothing matches — like <code>indexOf</code>, not undefined. Knowing whether a method returns the element, its index, or a boolean is the difference between correct and buggy list code.',
            'Đã chạy thật. <code>includes</code> trả boolean (true). <code>find</code> trả phần tử khớp, và <code>?.id</code> đọc id của nó (2). <code>findIndex</code> trả <code>-1</code> khi không khớp — như <code>indexOf</code>, không phải undefined. Biết một method trả phần tử, chỉ số của nó, hay một boolean là khác biệt giữa mã danh sách đúng và có lỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'A migration adds a <code>NOT NULL</code> column to a table that already has a million rows. Why can a naive migration lock the table and cause an outage, and what is the safer pattern?',
            'Một migration thêm một cột <code>NOT NULL</code> vào bảng đã có một triệu dòng. Vì sao migration ngây thơ có thể khoá bảng và gây gián đoạn, và mẫu an toàn hơn là gì?',
          ),
          options: [
            B('Adding <code>NOT NULL</code> with a default may rewrite/lock the table; safer is add nullable → backfill in batches → then add the constraint', 'Thêm <code>NOT NULL</code> kèm default có thể ghi lại/khoá bảng; an toàn hơn là thêm nullable → điền dần theo lô → rồi mới thêm ràng buộc'),
            B('Migrations never lock tables, so there is no risk regardless of table size', 'Migration không bao giờ khoá bảng, nên không có rủi ro bất kể kích thước bảng'),
            B('The only fix is to delete the rows first and re-insert them after the migration', 'Cách duy nhất là xoá các dòng trước rồi chèn lại sau migration'),
            B('You must always take the database offline before any migration runs', 'Bạn phải luôn đưa CSDL offline trước khi bất kỳ migration nào chạy'),
          ],
          correct: 0,
          explanation: EX(
            'On a large table, adding a <code>NOT NULL</code> column (especially with a volatile default) can force a full rewrite while holding a lock, blocking reads/writes and causing an outage. The safe pattern is incremental: add the column nullable, backfill existing rows in small batches, then add the <code>NOT NULL</code> constraint. Modern Postgres optimises some cases, but the batched approach is the reliable default.',
            'Trên một bảng lớn, thêm một cột <code>NOT NULL</code> (nhất là với default biến động) có thể ép ghi lại toàn bộ trong khi giữ khoá, chặn đọc/ghi và gây gián đoạn. Mẫu an toàn là tăng dần: thêm cột nullable, điền các dòng cũ theo lô nhỏ, rồi thêm ràng buộc <code>NOT NULL</code>. Postgres hiện đại tối ưu một số ca, nhưng cách theo lô là mặc định đáng tin.',
          ),
        }),

        // ── Ch8 ──
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const c = require('crypto');\n" +
              "const u = c.randomUUID();\n" +
              "console.log([u.length, u.split('-').length, u[14]]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const c = require('crypto');\n" +
              "const u = c.randomUUID();\n" +
              "console.log([u.length, u.split('-').length, u[14]]);",
            ),
          ),
          options: [
            B("<code>[36, 5, '4']</code>", "<code>[36, 5, '4']</code>"),
            B("<code>[32, 5, '4']</code>", "<code>[32, 5, '4']</code>"),
            B("<code>[36, 4, 'a']</code>", "<code>[36, 4, 'a']</code>"),
            B('A different length each run', 'Độ dài khác mỗi lần chạy'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A UUID v4 is always 36 characters (32 hex digits plus 4 dashes), so splitting on <code>-</code> gives 5 parts, and the version digit at index 14 is always <code>&#x27;4&#x27;</code>. Only the hex content is random; the shape is fixed. <code>crypto.randomUUID()</code> is the built-in way to mint a collision-resistant id without an extra library.',
            'Đã chạy thật. Một UUID v4 luôn dài 36 ký tự (32 chữ số hex cộng 4 dấu gạch), nên tách theo <code>-</code> cho 5 phần, và chữ số phiên bản ở vị trí 14 luôn là <code>&#x27;4&#x27;</code>. Chỉ phần hex là ngẫu nhiên; hình dạng cố định. <code>crypto.randomUUID()</code> là cách sẵn có để tạo một id chống trùng mà không cần thư viện thêm.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO statements about password authentication that are correct.',
            'Chọn HAI phát biểu ĐÚNG về xác thực mật khẩu.',
          ),
          options: [
            B('Each password should be hashed with a unique salt so identical passwords get different hashes', 'Mỗi mật khẩu nên được băm với một salt riêng để những mật khẩu giống nhau ra băm khác nhau'),
            B('You verify a login by hashing the submitted password and comparing it to the stored hash', 'Bạn xác minh đăng nhập bằng cách băm mật khẩu gửi lên và so với băm đã lưu'),
            B('The plaintext password should be stored encrypted so support staff can recover it', 'Mật khẩu dạng thô nên được lưu mã hoá để nhân viên hỗ trợ khôi phục được'),
            B('A single global salt for all users is just as safe as a per-password salt', 'Một salt chung toàn cục cho mọi người dùng cũng an toàn như salt riêng từng mật khẩu'),
          ],
          correct: [0, 1],
          explanation: EX(
            'A per-password salt means two users with the same password store different hashes, defeating precomputed rainbow tables; login works by hashing the input and comparing. You must never be able to recover the plaintext — that is the whole point of hashing, and "encrypt so support can read it" is an anti-pattern. A single shared salt loses most of the benefit.',
            'Một salt riêng từng mật khẩu nghĩa là hai người cùng mật khẩu lưu băm khác nhau, đánh bại bảng cầu vồng tính sẵn; đăng nhập hoạt động bằng cách băm đầu vào rồi so. Bạn không bao giờ được khôi phục được bản thô — đó là toàn bộ mục đích của băm, và "mã hoá để hỗ trợ đọc được" là một phản mẫu. Một salt dùng chung làm mất phần lớn lợi ích.',
          ),
        }),

        // ── Ch9 ──
        mcq({
          prompt: B(
            'An endpoint returns different responses for "email not found" vs "wrong password" on login. Why is that a security problem?',
            'Một endpoint trả phản hồi khác nhau cho "không tìm thấy email" so với "sai mật khẩu" khi đăng nhập. Vì sao đó là vấn đề bảo mật?',
          ),
          options: [
            B('It leaks which emails are registered (account enumeration); return one generic "invalid credentials" message for both', 'Nó làm rò email nào đã đăng ký (đếm tài khoản); hãy trả một thông báo chung "thông tin đăng nhập không hợp lệ" cho cả hai'),
            B('It is fine and actually more user-friendly, with no downside at all', 'Không sao và thực ra thân thiện hơn, không có nhược điểm gì'),
            B('The only issue is that the two responses have slightly different lengths', 'Vấn đề duy nhất là hai phản hồi dài khác nhau chút ít'),
            B('It slows the server down because it must run two different code paths', 'Nó làm server chậm vì phải chạy hai nhánh mã khác nhau'),
          ],
          correct: 0,
          explanation: EX(
            'Distinct messages let an attacker probe which emails have accounts — a classic account-enumeration leak that feeds credential-stuffing and phishing. Return the same generic error (and ideally similar timing) whether the email is unknown or the password is wrong. The same reasoning applies to password-reset flows.',
            'Thông báo khác nhau cho phép kẻ tấn công dò email nào có tài khoản — một rò rỉ đếm tài khoản kinh điển, tiếp sức cho nhồi thông tin đăng nhập và lừa đảo. Hãy trả cùng một lỗi chung (và lý tưởng là thời gian tương tự) dù email không tồn tại hay mật khẩu sai. Lập luận đó cũng áp dụng cho luồng đặt lại mật khẩu.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO measures that reduce the impact of a stolen database backup.',
            'Chọn HAI biện pháp giảm tác hại khi một bản sao lưu CSDL bị đánh cắp.',
          ),
          options: [
            B('Store only salted password hashes, never plaintext or reversible encryption', 'Chỉ lưu băm mật khẩu có salt, không bao giờ dùng bản thô hay mã hoá đảo ngược được'),
            B('Encrypt sensitive columns / the backup at rest so the dump is not readable on its own', 'Mã hoá các cột nhạy cảm / bản sao lưu khi nghỉ để bản dump tự nó không đọc được'),
            B('Log every user&#x27;s plaintext password so you can compare against the leak', 'Ghi log mật khẩu thô của mọi người dùng để so với bản rò rỉ'),
            B('Give every developer a permanent copy of the production backup on their laptop', 'Cấp cho mọi lập trình viên một bản sao lưu production vĩnh viễn trên laptop'),
          ],
          correct: [0, 1],
          explanation: EX(
            'If passwords are only stored as salted hashes and sensitive data / the backup is encrypted at rest, a stolen dump is far less useful — attackers cannot read secrets or trivially recover passwords. Logging plaintext passwords or spreading production copies to laptops does the opposite: it multiplies the places a single breach exposes.',
            'Nếu mật khẩu chỉ lưu dạng băm có salt và dữ liệu nhạy cảm / bản sao lưu được mã hoá khi nghỉ, một bản dump bị đánh cắp ít hữu ích hơn nhiều — kẻ tấn công không đọc được bí mật hay dễ dàng khôi phục mật khẩu. Ghi log mật khẩu thô hay phát tán bản sao production ra laptop thì ngược lại: nó nhân lên số nơi mà một lần rò rỉ phơi bày.',
          ),
        }),

        // ── Ch10 ──
        mcq({
          prompt: B(
            'Why is streaming an upload straight to object storage (R2/S3) usually better than buffering the whole file in the Node process first?',
            'Vì sao stream một upload thẳng tới kho đối tượng (R2/S3) thường tốt hơn là gom cả tệp trong tiến trình Node trước?',
          ),
          options: [
            B('Buffering large files consumes process memory and risks OOM under load; streaming keeps memory bounded and scales to big files', 'Gom tệp lớn ngốn bộ nhớ tiến trình và có nguy cơ OOM khi tải cao; stream giữ bộ nhớ có chặn và co giãn với tệp lớn'),
            B('Object storage cannot accept a fully buffered file, only a stream', 'Kho đối tượng không nhận được tệp đã gom trọn, chỉ nhận stream'),
            B('Streaming makes the upload encrypted automatically with no configuration', 'Stream tự làm upload được mã hoá không cần cấu hình'),
            B('Buffering is impossible in Node because it has no way to hold a file in memory', 'Gom là bất khả trong Node vì nó không có cách giữ một tệp trong bộ nhớ'),
          ],
          correct: 0,
          explanation: EX(
            'Reading a whole upload into a Buffer means every concurrent large upload multiplies your memory use, and enough of them will OOM the process. Piping the incoming request stream directly to storage keeps memory flat regardless of file size and concurrency. Both approaches are technically possible; streaming is the one that scales.',
            'Đọc trọn một upload vào Buffer nghĩa là mỗi upload lớn đồng thời nhân lên mức dùng bộ nhớ, và đủ nhiều thì OOM tiến trình. Pipe thẳng stream request tới kho giữ bộ nhớ phẳng bất kể kích thước tệp và mức đồng thời. Cả hai cách đều khả thi về kỹ thuật; stream là cách co giãn được.',
          ),
        }),

        // ── Ch11 ──
        mcq({
          prompt: B(
            'A chat client briefly loses network then reconnects. Messages sent during the gap are missing. What design fixes this?',
            'Một client chat mất mạng chốc lát rồi kết nối lại. Các message gửi trong lúc đứt bị thiếu. Thiết kế nào khắc phục?',
          ),
          options: [
            B('Persist messages server-side and let the client fetch anything after its last-seen id/timestamp on reconnect, rather than relying on the live socket alone', 'Lưu message ở server và cho client lấy mọi thứ sau id/thời điểm cuối nó thấy khi kết nối lại, thay vì chỉ dựa vào socket trực tiếp'),
            B('Increase the WebSocket buffer size so no message is ever dropped', 'Tăng kích thước buffer WebSocket để không message nào bị rớt'),
            B('Switch from WebSocket to plain HTTP polling, which never loses messages', 'Chuyển từ WebSocket sang HTTP polling thường, vốn không bao giờ mất message'),
            B('Nothing can be done; realtime systems always lose messages during a disconnect', 'Không thể làm gì; hệ realtime luôn mất message khi mất kết nối'),
          ],
          correct: 0,
          explanation: EX(
            'A live socket only delivers to currently-connected clients, so anything sent during a disconnect is gone unless it is stored. Persist messages with a monotonic id or timestamp; on reconnect the client requests everything after its last-seen marker. The transport (WebSocket vs polling) is not the fix — durability plus a resume cursor is.',
            'Một socket trực tiếp chỉ giao cho client đang kết nối, nên mọi thứ gửi trong lúc đứt sẽ mất trừ khi được lưu. Hãy lưu message với một id hay dấu thời gian tăng đơn điệu; khi kết nối lại client yêu cầu mọi thứ sau mốc cuối nó thấy. Kênh truyền (WebSocket hay polling) không phải cách sửa — độ bền cộng một con trỏ tiếp tục mới là.',
          ),
        }),

        // ── Ch12 ──
        mcq({
          prompt: B(
            'What does this print?' + code(
              "const s = new Set([1, 2, 2, 3]);\n" +
              "s.add(3); s.delete(1);\n" +
              "console.log([s.size, [...s], s.has(1)]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const s = new Set([1, 2, 2, 3]);\n" +
              "s.add(3); s.delete(1);\n" +
              "console.log([s.size, [...s], s.has(1)]);",
            ),
          ),
          options: [
            B('<code>[2, [2, 3], false]</code>', '<code>[2, [2, 3], false]</code>'),
            B('<code>[3, [1, 2, 3], true]</code>', '<code>[3, [1, 2, 3], true]</code>'),
            B('<code>[2, [2, 3, 3], false]</code>', '<code>[2, [2, 3, 3], false]</code>'),
            B('<code>[4, [1, 2, 2, 3], false]</code>', '<code>[4, [1, 2, 2, 3], false]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The Set constructor dedupes the input to <code>{1, 2, 3}</code>. Adding <code>3</code> again is a no-op (already present). Deleting <code>1</code> leaves <code>{2, 3}</code>, so size 2, and <code>has(1)</code> is false. A Set is the natural structure for uniqueness and membership tests — the in-memory analogue of a Redis SET.',
            'Đã chạy thật. Bộ khởi tạo Set khử trùng lặp đầu vào thành <code>{1, 2, 3}</code>. Thêm <code>3</code> lần nữa là vô tác dụng (đã có). Xoá <code>1</code> để lại <code>{2, 3}</code>, nên kích thước 2, và <code>has(1)</code> là false. Set là cấu trúc tự nhiên cho tính duy nhất và kiểm thành viên — bản trong-bộ-nhớ tương ứng của một SET Redis.',
          ),
        }),

        // ── Ch13 ──
        mcq({
          prompt: B(
            'What does this print?' + code(
              "(async () => {\n" +
              "  const r = await Promise.allSettled([Promise.resolve(5), Promise.reject('e')]);\n" +
              "  console.log([r[0].value, r[1].reason]);\n" +
              "})();",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "(async () => {\n" +
              "  const r = await Promise.allSettled([Promise.resolve(5), Promise.reject('e')]);\n" +
              "  console.log([r[0].value, r[1].reason]);\n" +
              "})();",
            ),
          ),
          options: [
            B("<code>[5, 'e']</code>", "<code>[5, 'e']</code>"),
            B("<code>[5, undefined]</code>", "<code>[5, undefined]</code>"),
            B("It throws on the rejected promise", "Nó ném lỗi ở promise bị reject"),
            B("<code>['e', 5]</code>", "<code>['e', 5]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>allSettled</code> never throws: a fulfilled result exposes <code>.value</code> (5) and a rejected one exposes <code>.reason</code> (&#x27;e&#x27;). This is the right primitive for "process all jobs and collect successes and failures separately" — unlike <code>Promise.all</code>, which rejects the moment any input fails and hides the successful ones.',
            'Đã chạy thật. <code>allSettled</code> không bao giờ ném: một kết quả fulfilled phơi <code>.value</code> (5) và một cái rejected phơi <code>.reason</code> (&#x27;e&#x27;). Đây là primitive đúng cho "xử lý mọi job và gom riêng thành công với thất bại" — khác với <code>Promise.all</code>, vốn reject ngay khi bất kỳ đầu vào nào hỏng và giấu các cái thành công.',
          ),
        }),

        // ── Ch14 ──
        mcq({
          prompt: B(
            'What does this print?' + code("console.log(JSON.stringify({ d: new Date(0), u: undefined, n: null, f() {} }));"),
            'Đoạn mã sau in ra gì?' + code("console.log(JSON.stringify({ d: new Date(0), u: undefined, n: null, f() {} }));"),
          ),
          options: [
            B('<code>{"d":"1970-01-01T00:00:00.000Z","n":null}</code>', '<code>{"d":"1970-01-01T00:00:00.000Z","n":null}</code>'),
            B('<code>{"d":"1970-01-01T00:00:00.000Z","u":null,"n":null}</code>', '<code>{"d":"1970-01-01T00:00:00.000Z","u":null,"n":null}</code>'),
            B('<code>{"d":0,"n":null}</code>', '<code>{"d":0,"n":null}</code>'),
            B('<code>{"d":{},"u":{},"n":null,"f":"fn"}</code>', '<code>{"d":{},"u":{},"n":null,"f":"fn"}</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A Date serialises via <code>toJSON</code> to an ISO string. Object keys whose value is <code>undefined</code> or a function are dropped entirely (so <code>u</code> and <code>f</code> vanish), while <code>null</code> is a real JSON value and stays. This asymmetry between <code>undefined</code> and <code>null</code> catches a lot of tests that assert on serialised output.',
            'Đã chạy thật. Một Date tuần tự hoá qua <code>toJSON</code> thành chuỗi ISO. Khoá object có giá trị <code>undefined</code> hoặc hàm bị bỏ hẳn (nên <code>u</code> và <code>f</code> biến mất), còn <code>null</code> là giá trị JSON thật và được giữ. Sự bất đối xứng giữa <code>undefined</code> và <code>null</code> này bẫy nhiều test khẳng định trên kết quả tuần tự hoá.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO statements about writing reliable tests that are correct.',
            'Chọn HAI phát biểu ĐÚNG về viết test đáng tin.',
          ),
          options: [
            B('Some tests must hit a real database, because a mock cannot reproduce unique constraints or transaction behaviour', 'Một số test phải chạm CSDL thật, vì mock không tái tạo được ràng buộc UNIQUE hay hành vi transaction'),
            B('Tests should be isolated so one test&#x27;s data does not leak into another (separate schema, transaction rollback, or cleanup)', 'Test nên được cô lập để dữ liệu của test này không rò sang test khác (schema riêng, rollback transaction, hoặc dọn dẹp)'),
            B('A test that runs a line of code but asserts nothing still proves the code is correct', 'Một test chạy một dòng mã nhưng không kiểm gì vẫn chứng minh mã đúng'),
            B('Asserting on an exact timestamp or a generated id makes a test more robust', 'Khẳng định trên một dấu thời gian chính xác hay một id sinh ra làm test vững hơn'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Integration tests against a real database catch things mocks cannot (unique violations, transaction rollbacks, real error codes), and isolation keeps tests from interfering with each other. A test with no assertion proves nothing (coverage without checking), and asserting on volatile values like timestamps or random ids makes tests flaky.',
            'Test tích hợp với CSDL thật bắt được điều mock không thể (vi phạm UNIQUE, rollback transaction, mã lỗi thật), và cô lập giữ các test không giẫm chân nhau. Một test không có khẳng định chẳng chứng minh gì (phủ mà không kiểm), và khẳng định trên giá trị biến động như dấu thời gian hay id ngẫu nhiên làm test chập chờn.',
          ),
        }),

        // ── Ch15 ──
        mcq({
          prompt: B(
            'You add a Prometheus counter labelled with the full request URL (including ids). Traffic is fine but memory climbs until the process is killed. Why?',
            'Bạn thêm một counter Prometheus gắn nhãn bằng URL đầy đủ (kèm id). Lưu lượng bình thường nhưng bộ nhớ leo tới khi tiến trình bị giết. Vì sao?',
          ),
          options: [
            B('High-cardinality labels: each unique URL creates a new time series, so unbounded ids explode memory — label with the route template instead', 'Nhãn có lực lượng cao: mỗi URL riêng tạo một chuỗi thời gian mới, nên id không chặn làm nổ bộ nhớ — hãy gắn nhãn bằng mẫu route thay vì'),
            B('Prometheus counters always leak memory and should never be used in Node', 'Counter Prometheus luôn rò bộ nhớ và không bao giờ nên dùng trong Node'),
            B('The counter increments too fast, and the number itself overflows memory', 'Counter tăng quá nhanh, và bản thân con số làm tràn bộ nhớ'),
            B('Memory climbs only because logging is enabled at the same time', 'Bộ nhớ leo chỉ vì log được bật cùng lúc'),
          ],
          correct: 0,
          explanation: EX(
            'Each distinct label combination is a separate time series held in memory. Putting an unbounded value like a per-request id or full URL in a label creates one series per request, so memory grows without limit — a cardinality explosion. Label with the route template (<code>/users/:id</code>), not the concrete path, and keep label values to a small fixed set.',
            'Mỗi tổ hợp nhãn khác nhau là một chuỗi thời gian riêng giữ trong bộ nhớ. Đặt một giá trị không chặn như id từng-request hay URL đầy đủ vào nhãn tạo một chuỗi cho mỗi request, nên bộ nhớ tăng vô hạn — một vụ nổ lực lượng. Hãy gắn nhãn bằng mẫu route (<code>/users/:id</code>), không phải đường dẫn cụ thể, và giữ giá trị nhãn ở một tập nhỏ cố định.',
          ),
        }),

        // ── Ch16 ──
        mcq({
          prompt: B(
            'What does this print?' + code(
              "let s = 'abc';\n" +
              "const up = s.toUpperCase();\n" +
              "console.log([s, up, s[0] = 'Z', s]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "let s = 'abc';\n" +
              "const up = s.toUpperCase();\n" +
              "console.log([s, up, s[0] = 'Z', s]);",
            ),
          ),
          options: [
            B("<code>['abc', 'ABC', 'Z', 'abc']</code>", "<code>['abc', 'ABC', 'Z', 'abc']</code>"),
            B("<code>['abc', 'ABC', 'Z', 'Zbc']</code>", "<code>['abc', 'ABC', 'Z', 'Zbc']</code>"),
            B("<code>['ABC', 'ABC', 'Z', 'Zbc']</code>", "<code>['ABC', 'ABC', 'Z', 'Zbc']</code>"),
            B('A TypeError on <code>s[0] = &#x27;Z&#x27;</code>', 'Một TypeError ở <code>s[0] = &#x27;Z&#x27;</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Strings are immutable primitives: <code>toUpperCase</code> returns a new string and leaves <code>s</code> unchanged, and assigning to <code>s[0]</code> is silently ignored (in non-strict mode) — the assignment expression evaluates to <code>&#x27;Z&#x27;</code> but <code>s</code> stays <code>&#x27;abc&#x27;</code>. Every "string method" returns a new string; nothing mutates in place.',
            'Đã chạy thật. Chuỗi là primitive bất biến: <code>toUpperCase</code> trả một chuỗi mới và để nguyên <code>s</code>, và gán vào <code>s[0]</code> bị âm thầm bỏ qua (ở chế độ non-strict) — biểu thức gán tính ra <code>&#x27;Z&#x27;</code> nhưng <code>s</code> vẫn là <code>&#x27;abc&#x27;</code>. Mọi "phương thức chuỗi" trả một chuỗi mới; không gì sửa tại chỗ.',
          ),
        }),

        mcq({
          prompt: B(
            'Under load a route is slow. A flame graph shows most time in <code>JSON.parse</code> of a large payload the route does not even use. What is the fix?',
            'Dưới tải một route chậm. Flame graph cho thấy phần lớn thời gian ở <code>JSON.parse</code> một payload lớn mà route thậm chí không dùng. Cách sửa?',
          ),
          options: [
            B('Stop parsing what you do not need — narrow the body limit, parse lazily, or only read the fields required', 'Đừng phân tích thứ không cần — thu hẹp giới hạn thân, parse lười, hoặc chỉ đọc các trường cần'),
            B('Add more <code>await</code> so the parse happens asynchronously off the main thread', 'Thêm nhiều <code>await</code> để việc parse xảy ra bất đồng bộ ngoài luồng chính'),
            B('Increase the heap size so the large object fits and the route speeds up', 'Tăng kích thước heap để object lớn vừa và route nhanh lên'),
            B('Switch the whole app to a faster language, since Node cannot parse JSON quickly', 'Chuyển cả app sang ngôn ngữ nhanh hơn, vì Node không parse JSON nhanh được'),
          ],
          correct: 0,
          explanation: EX(
            'The cheapest work is the work you do not do. If a large body is parsed but unused, cap the request size, skip or defer the parse, or accept only the fields you need. <code>JSON.parse</code> is synchronous and CPU-bound, so <code>await</code> does not move it off-thread, a bigger heap does not make it faster, and the language is not the bottleneck — the wasted work is.',
            'Công việc rẻ nhất là công việc bạn không làm. Nếu một thân lớn bị parse mà không dùng, hãy giới hạn kích thước request, bỏ hoặc hoãn việc parse, hoặc chỉ nhận các trường cần. <code>JSON.parse</code> đồng bộ và nặng CPU, nên <code>await</code> không đưa nó ra khỏi luồng, heap lớn hơn không làm nó nhanh hơn, và ngôn ngữ không phải nút thắt — công việc lãng phí mới là.',
          ),
        }),

        // ── Ch17 ──
        mcq({
          prompt: B(
            'Choose TWO practices that make a production Docker image smaller and safer.',
            'Chọn HAI thực hành làm ảnh Docker production nhỏ hơn và an toàn hơn.',
          ),
          options: [
            B('Use a multi-stage build so build tools and dev dependencies do not ship in the final image', 'Dùng build nhiều tầng để công cụ build và dev dependency không lên ảnh cuối'),
            B('Base the runtime stage on a slim/alpine image and run as a non-root user', 'Đặt tầng runtime trên một ảnh slim/alpine và chạy dưới người dùng không phải root'),
            B('Bake secrets into an <code>ENV</code> line so the container always has them', 'Nướng bí mật vào một dòng <code>ENV</code> để container luôn có chúng'),
            B('Run <code>npm install</code> (with dev deps) in the final stage to be safe', 'Chạy <code>npm install</code> (kèm dev dep) ở tầng cuối cho chắc'),
          ],
          correct: [0, 1],
          explanation: EX(
            'A multi-stage build compiles in one stage and copies only the runtime artefacts into a small final stage, and a slim/alpine base running as non-root shrinks both size and attack surface. Baking secrets into <code>ENV</code> leaks them in image history, and installing dev dependencies in the final stage bloats the image and widens the attack surface.',
            'Build nhiều tầng biên dịch ở một tầng và chỉ copy các artefact runtime vào một tầng cuối nhỏ, và một base slim/alpine chạy dưới non-root thu nhỏ cả kích thước lẫn bề mặt tấn công. Nướng bí mật vào <code>ENV</code> làm rò chúng trong lịch sử ảnh, và cài dev dependency ở tầng cuối làm phình ảnh và mở rộng bề mặt tấn công.',
          ),
        }),

        mcq({
          prompt: B(
            'A container keeps restarting. <code>docker logs</code> shows the app printed "listening" then exited with code 0. What is the most likely cause?',
            'Một container cứ khởi động lại. <code>docker logs</code> cho thấy app in "listening" rồi thoát với mã 0. Nguyên nhân khả dĩ nhất?',
          ),
          options: [
            B('Nothing keeps the event loop alive (the server was not actually held), so Node runs out of work and exits and the restart policy relaunches it', 'Không có gì giữ vòng lặp sự kiện sống (server không thật sự được giữ), nên Node hết việc và thoát và chính sách restart khởi chạy lại nó'),
            B('Exit code 0 always indicates the container was killed after running out of memory', 'Mã thoát 0 luôn cho biết container bị giết sau khi hết bộ nhớ'),
            B('Docker deliberately restarts every container every few seconds as part of its design', 'Docker cố ý khởi động lại mọi container mỗi vài giây như một phần thiết kế'),
            B('The image is corrupt and has to be rebuilt from scratch before every single run', 'Ảnh bị hỏng và phải dựng lại từ đầu trước mỗi lần chạy'),
          ],
          correct: 0,
          explanation: EX(
            'Node keeps running while there is a pending handle (an open server, timer, etc.). If the process reaches the end with nothing holding the loop — for example the listen call was mis-structured — Node exits cleanly with code 0, and a <code>restart: always</code> policy relaunches it, producing a restart loop. Exit 0 is a normal exit, not an OOM (that is 137).',
            'Node tiếp tục chạy khi còn một handle chờ (một server đang mở, timer, v.v.). Nếu tiến trình tới cuối mà không gì giữ vòng lặp — ví dụ lời gọi listen bị viết sai cấu trúc — Node thoát sạch với mã 0, và một chính sách <code>restart: always</code> khởi chạy lại nó, tạo một vòng lặp khởi động lại. Thoát 0 là thoát bình thường, không phải OOM (cái đó là 137).',
          ),
        }),

        // ── Ch18 ──
        mcq({
          prompt: B(
            'Two modules import each other (a circular dependency) and one gets <code>undefined</code> for the other&#x27;s export at load time. What is the cleanest fix?',
            'Hai module import nhau (phụ thuộc vòng) và một cái nhận <code>undefined</code> cho export của cái kia lúc nạp. Cách sửa gọn nhất là gì?',
          ),
          options: [
            B('Break the cycle by extracting the shared piece into a third module both depend on, so the dependency graph is acyclic', 'Phá vòng bằng cách tách phần dùng chung ra một module thứ ba mà cả hai phụ thuộc, để đồ thị phụ thuộc không có chu trình'),
            B('Import each module twice so the second import gets the finished value', 'Import mỗi module hai lần để lần import thứ hai nhận giá trị hoàn chỉnh'),
            B('Wrap every export in a <code>setTimeout</code> so it is defined later', 'Bọc mọi export trong một <code>setTimeout</code> để nó được định nghĩa sau'),
            B('Circular dependencies are impossible in Node, so the real bug is elsewhere', 'Phụ thuộc vòng là bất khả trong Node, nên lỗi thật nằm chỗ khác'),
          ],
          correct: 0,
          explanation: EX(
            'A circular import can hand a half-initialised module to the other during loading, yielding <code>undefined</code>. The robust fix is architectural: move the shared type/util/constant into a third module that both import, making the graph acyclic. Node <em>does</em> allow cycles (it returns a partial exports object), which is exactly why the bug appears — the design, not a timer hack, is the fix.',
            'Một import vòng có thể trao một module khởi tạo dở cho cái kia trong lúc nạp, cho ra <code>undefined</code>. Cách sửa vững là về kiến trúc: chuyển type/util/hằng dùng chung vào một module thứ ba mà cả hai import, làm đồ thị không chu trình. Node <em>có</em> cho phép chu trình (nó trả một object exports một phần), chính vì thế lỗi xuất hiện — thiết kế, không phải một mẹo timer, mới là cách sửa.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("const os = require('os'); console.log([typeof os.cpus, os.EOL === '\\n' || os.EOL === '\\r\\n']);"),
            'Đoạn mã sau in ra gì?' + code("const os = require('os'); console.log([typeof os.cpus, os.EOL === '\\n' || os.EOL === '\\r\\n']);"),
          ),
          options: [
            B("<code>['function', true]</code>", "<code>['function', true]</code>"),
            B("<code>['object', true]</code>", "<code>['object', true]</code>"),
            B("<code>['function', false]</code>", "<code>['function', false]</code>"),
            B("<code>['undefined', false]</code>", "<code>['undefined', false]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>os.cpus</code> is a function (you call it to get the core list), and <code>os.EOL</code> is the platform line ending — <code>&#x27;\\n&#x27;</code> on Linux/macOS or <code>&#x27;\\r\\n&#x27;</code> on Windows — so the check is true on any platform. Using <code>os.EOL</code> instead of hard-coding a newline keeps output correct across operating systems.',
            'Đã chạy thật. <code>os.cpus</code> là một hàm (bạn gọi nó để lấy danh sách nhân), và <code>os.EOL</code> là ký tự xuống dòng của nền tảng — <code>&#x27;\\n&#x27;</code> trên Linux/macOS hoặc <code>&#x27;\\r\\n&#x27;</code> trên Windows — nên phép kiểm đúng trên mọi nền tảng. Dùng <code>os.EOL</code> thay vì viết cứng một ký tự xuống dòng giữ output đúng qua các hệ điều hành.',
          ),
        }),
        // ── Bổ sung code-reading cho đủ 50 ──
        mcq({
          prompt: B(
            'What does this print?' + code("const a = [1,2,3,4]; const r = a.splice(1,2); console.log([r, a]);"),
            'Đoạn mã sau in ra gì?' + code("const a = [1,2,3,4]; const r = a.splice(1,2); console.log([r, a]);"),
          ),
          options: [
            B('<code>[[2,3], [1,4]]</code>', '<code>[[2,3], [1,4]]</code>'),
            B('<code>[[2,3], [1,2,3,4]]</code>', '<code>[[2,3], [1,2,3,4]]</code>'),
            B('<code>[[1,4], [2,3]]</code>', '<code>[[1,4], [2,3]]</code>'),
            B('<code>[[2,3,4], [1]]</code>', '<code>[[2,3,4], [1]]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>splice(1,2)</code> removes 2 elements starting at index 1, <em>mutating</em> the array in place and returning the removed elements <code>[2,3]</code>, leaving <code>[1,4]</code>. Contrast <code>slice</code>, which copies and never mutates. Confusing the two is a frequent source of "why did my array change?" bugs.',
            'Đã chạy thật. <code>splice(1,2)</code> xoá 2 phần tử bắt đầu từ chỉ số 1, <em>sửa</em> mảng tại chỗ và trả về các phần tử bị xoá <code>[2,3]</code>, để lại <code>[1,4]</code>. Trái với <code>slice</code>, vốn sao chép và không bao giờ sửa. Nhầm hai cái là nguồn lỗi "sao mảng của tôi bị đổi?" thường gặp.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([['a','b'].concat(['c'], 'd'), Array.of(3).length, Array(3).length]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([['a','b'].concat(['c'], 'd'), Array.of(3).length, Array(3).length]);"),
          ),
          options: [
            B("<code>[['a','b','c','d'], 1, 3]</code>", "<code>[['a','b','c','d'], 1, 3]</code>"),
            B("<code>[['a','b','c','d'], 3, 3]</code>", "<code>[['a','b','c','d'], 3, 3]</code>"),
            B("<code>[['a','b',['c'],'d'], 1, 1]</code>", "<code>[['a','b',['c'],'d'], 1, 1]</code>"),
            B("<code>[['a','b','c','d'], 1, 1]</code>", "<code>[['a','b','c','d'], 1, 1]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>concat</code> flattens array arguments one level (so <code>[&#x27;c&#x27;]</code> spreads) but appends non-array args as-is. The classic trap is <code>Array(3)</code> versus <code>Array.of(3)</code>: the former makes a length-3 empty array, the latter makes <code>[3]</code> with length 1.',
            'Đã chạy thật. <code>concat</code> làm phẳng đối số mảng một tầng (nên <code>[&#x27;c&#x27;]</code> trải ra) nhưng thêm đối số không phải mảng nguyên trạng. Cái bẫy kinh điển là <code>Array(3)</code> so với <code>Array.of(3)</code>: cái đầu tạo mảng rỗng độ dài 3, cái sau tạo <code>[3]</code> độ dài 1.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([Number.isNaN(NaN), Number.isNaN('x'), isNaN('x'), Number.isInteger(5.0)]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([Number.isNaN(NaN), Number.isNaN('x'), isNaN('x'), Number.isInteger(5.0)]);"),
          ),
          options: [
            B('<code>[true, false, true, true]</code>', '<code>[true, false, true, true]</code>'),
            B('<code>[true, true, true, true]</code>', '<code>[true, true, true, true]</code>'),
            B('<code>[true, false, false, false]</code>', '<code>[true, false, false, false]</code>'),
            B('<code>[true, true, false, true]</code>', '<code>[true, true, false, true]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The global <code>isNaN(&#x27;x&#x27;)</code> first coerces <code>&#x27;x&#x27;</code> to <code>NaN</code>, so it returns true — often not what you want. <code>Number.isNaN</code> does no coercion, so <code>Number.isNaN(&#x27;x&#x27;)</code> is false. And <code>5.0</code> is an integer value in JavaScript (there is one number type), so <code>Number.isInteger(5.0)</code> is true.',
            'Đã chạy thật. <code>isNaN(&#x27;x&#x27;)</code> toàn cục trước tiên ép <code>&#x27;x&#x27;</code> về <code>NaN</code>, nên trả true — thường không phải điều bạn muốn. <code>Number.isNaN</code> không ép kiểu, nên <code>Number.isNaN(&#x27;x&#x27;)</code> là false. Và <code>5.0</code> là một giá trị nguyên trong JavaScript (chỉ có một kiểu số), nên <code>Number.isInteger(5.0)</code> là true.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([[1,2,3].every(x => x > 0), [1,2,3].some(x => x > 2), [].every(x => false)]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([[1,2,3].every(x => x > 0), [1,2,3].some(x => x > 2), [].every(x => false)]);"),
          ),
          options: [
            B('<code>[true, true, true]</code>', '<code>[true, true, true]</code>'),
            B('<code>[true, true, false]</code>', '<code>[true, true, false]</code>'),
            B('<code>[true, false, true]</code>', '<code>[true, false, true]</code>'),
            B('<code>[false, true, false]</code>', '<code>[false, true, false]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>every</code> on an <em>empty</em> array is <code>true</code> — vacuously, there is no element that fails the test. This "vacuous truth" surprises people validating a list: <code>items.every(isValid)</code> passes for an empty list, so if "must have at least one" matters, check the length separately.',
            'Đã chạy thật. <code>every</code> trên một mảng <em>rỗng</em> là <code>true</code> — theo nghĩa rỗng, không có phần tử nào trượt phép kiểm. Cái "đúng do rỗng" này bất ngờ với người xác thực danh sách: <code>items.every(isValid)</code> qua với danh sách rỗng, nên nếu "phải có ít nhất một" quan trọng, hãy kiểm độ dài riêng.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("const p = require('path'); const o = p.parse('/a/b/c.txt'); console.log([o.ext, o.name, o.dir]);"),
            'Đoạn mã sau in ra gì?' + code("const p = require('path'); const o = p.parse('/a/b/c.txt'); console.log([o.ext, o.name, o.dir]);"),
          ),
          options: [
            B("<code>['.txt', 'c', '/a/b']</code>", "<code>['.txt', 'c', '/a/b']</code>"),
            B("<code>['txt', 'c.txt', '/a/b']</code>", "<code>['txt', 'c.txt', '/a/b']</code>"),
            B("<code>['.txt', 'c.txt', '/a/b/c.txt']</code>", "<code>['.txt', 'c.txt', '/a/b/c.txt']</code>"),
            B("<code>['.txt', 'c', '/a/b/c.txt']</code>", "<code>['.txt', 'c', '/a/b/c.txt']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>path.parse</code> splits a path into <code>{root, dir, base, ext, name}</code>: <code>ext</code> keeps the leading dot (<code>.txt</code>), <code>name</code> is the filename without extension (<code>c</code>), and <code>dir</code> is everything above (<code>/a/b</code>). Using the structured parser avoids the off-by-one mistakes of manual string slicing.',
            'Đã chạy thật. <code>path.parse</code> tách một đường dẫn thành <code>{root, dir, base, ext, name}</code>: <code>ext</code> giữ dấu chấm đầu (<code>.txt</code>), <code>name</code> là tên tệp không phần mở rộng (<code>c</code>), và <code>dir</code> là mọi thứ ở trên (<code>/a/b</code>). Dùng bộ phân tích có cấu trúc tránh các lỗi lệch-một khi tự cắt chuỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const m = new Map();\n" +
              "m.set('a', 1).set('b', 2);\n" +
              "console.log([m.size, m.get('c'), [...m.keys()]]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const m = new Map();\n" +
              "m.set('a', 1).set('b', 2);\n" +
              "console.log([m.size, m.get('c'), [...m.keys()]]);",
            ),
          ),
          options: [
            B("<code>[2, undefined, ['a', 'b']]</code>", "<code>[2, undefined, ['a', 'b']]</code>"),
            B("<code>[2, null, ['a', 'b']]</code>", "<code>[2, null, ['a', 'b']]</code>"),
            B("<code>[2, undefined, ['b', 'a']]</code>", "<code>[2, undefined, ['b', 'a']]</code>"),
            B("<code>[1, undefined, ['a']]</code>", "<code>[1, undefined, ['a']]</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>Map.set</code> returns the map, so calls chain. A Map preserves insertion order, so <code>keys()</code> yields <code>[&#x27;a&#x27;, &#x27;b&#x27;]</code>, and a missing key gives <code>undefined</code> (not null). Prefer a Map over a plain object when keys are dynamic or non-string, or when insertion order and a clean <code>size</code> matter.',
            'Đã chạy thật. <code>Map.set</code> trả về chính map, nên các lời gọi nối chuỗi. Map giữ thứ tự chèn, nên <code>keys()</code> cho <code>[&#x27;a&#x27;, &#x27;b&#x27;]</code>, và một khoá thiếu cho <code>undefined</code> (không phải null). Hãy ưu tiên Map hơn object thường khi khoá động hoặc không phải chuỗi, hoặc khi thứ tự chèn và một <code>size</code> gọn quan trọng.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const [a, , c] = [1, 2, 3];\n" +
              "const [x = 9, y = 9] = [undefined, 5];\n" +
              "console.log([a, c, x, y]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const [a, , c] = [1, 2, 3];\n" +
              "const [x = 9, y = 9] = [undefined, 5];\n" +
              "console.log([a, c, x, y]);",
            ),
          ),
          options: [
            B('<code>[1, 3, 9, 5]</code>', '<code>[1, 3, 9, 5]</code>'),
            B('<code>[1, 2, 9, 9]</code>', '<code>[1, 2, 9, 9]</code>'),
            B('<code>[1, 3, undefined, 5]</code>', '<code>[1, 3, undefined, 5]</code>'),
            B('<code>[1, 3, 9, 9]</code>', '<code>[1, 3, 9, 9]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The empty slot in <code>[a, , c]</code> skips the second element, so <code>c</code> is 3. An array-destructuring default applies only when the value is <code>undefined</code>: <code>x</code> gets its default 9, but <code>y</code> keeps the real value 5. Same rule as object defaults and <code>??</code>.',
            'Đã chạy thật. Ô trống trong <code>[a, , c]</code> bỏ qua phần tử thứ hai, nên <code>c</code> là 3. Giá trị mặc định khi phá cấu trúc mảng chỉ áp dụng khi giá trị là <code>undefined</code>: <code>x</code> nhận mặc định 9, còn <code>y</code> giữ giá trị thật 5. Cùng luật với mặc định object và <code>??</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log([Boolean('false'), Boolean(''), Boolean('0'), Boolean([]), Boolean(0)]);"),
            'Đoạn mã sau in ra gì?' + code("console.log([Boolean('false'), Boolean(''), Boolean('0'), Boolean([]), Boolean(0)]);"),
          ),
          options: [
            B('<code>[true, false, true, true, false]</code>', '<code>[true, false, true, true, false]</code>'),
            B('<code>[false, false, false, false, false]</code>', '<code>[false, false, false, false, false]</code>'),
            B('<code>[true, false, false, false, false]</code>', '<code>[true, false, false, false, false]</code>'),
            B('<code>[true, true, true, true, false]</code>', '<code>[true, true, true, true, false]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Only a specific set of values is falsy: <code>false</code>, <code>0</code>, <code>&#x27;&#x27;</code>, <code>null</code>, <code>undefined</code> and <code>NaN</code>. Any non-empty string is truthy — including <code>&#x27;false&#x27;</code> and <code>&#x27;0&#x27;</code> — and, crucially, an empty array and empty object are truthy too. This is why <code>if (arr)</code> never tests "is the array empty".',
            'Đã chạy thật. Chỉ một tập giá trị cụ thể là falsy: <code>false</code>, <code>0</code>, <code>&#x27;&#x27;</code>, <code>null</code>, <code>undefined</code> và <code>NaN</code>. Mọi chuỗi không rỗng đều truthy — kể cả <code>&#x27;false&#x27;</code> và <code>&#x27;0&#x27;</code> — và quan trọng là mảng rỗng và object rỗng cũng truthy. Đây là lý do <code>if (arr)</code> không bao giờ kiểm "mảng có rỗng không".',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const a = [1, 2, 3];\n" +
              "const b = a;\n" +
              "b.push(4);\n" +
              "console.log([a.length, a === b]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const a = [1, 2, 3];\n" +
              "const b = a;\n" +
              "b.push(4);\n" +
              "console.log([a.length, a === b]);",
            ),
          ),
          options: [
            B('<code>[4, true]</code>', '<code>[4, true]</code>'),
            B('<code>[3, false]</code>', '<code>[3, false]</code>'),
            B('<code>[4, false]</code>', '<code>[4, false]</code>'),
            B('<code>[3, true]</code>', '<code>[3, true]</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>b = a</code> copies the reference, not the array, so <code>a</code> and <code>b</code> point at the same object; pushing through <code>b</code> is visible through <code>a</code> (length 4) and <code>a === b</code> is true. To get an independent copy, use <code>[...a]</code> or <code>a.slice()</code>. Aliasing bugs like this are common when passing arrays around.',
            'Đã chạy thật. <code>b = a</code> sao chép tham chiếu, không phải mảng, nên <code>a</code> và <code>b</code> trỏ tới cùng một object; push qua <code>b</code> thấy được qua <code>a</code> (độ dài 4) và <code>a === b</code> là true. Muốn một bản sao độc lập, dùng <code>[...a]</code> hoặc <code>a.slice()</code>. Lỗi bí danh kiểu này thường gặp khi truyền mảng đi.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code(
              "const o = Object.freeze({ a: 1 });\n" +
              "o.a = 9; o.b = 2;\n" +
              "console.log([o.a, o.b, Object.isFrozen(o)]);",
            ),
            'Đoạn mã sau in ra gì?' + code(
              "const o = Object.freeze({ a: 1 });\n" +
              "o.a = 9; o.b = 2;\n" +
              "console.log([o.a, o.b, Object.isFrozen(o)]);",
            ),
          ),
          options: [
            B('<code>[1, undefined, true]</code>', '<code>[1, undefined, true]</code>'),
            B('<code>[9, 2, true]</code>', '<code>[9, 2, true]</code>'),
            B('<code>[1, undefined, false]</code>', '<code>[1, undefined, false]</code>'),
            B('A TypeError on <code>o.a = 9</code>', 'Một TypeError ở <code>o.a = 9</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>Object.freeze</code> makes an object immutable: writes to existing properties and additions of new ones are silently ignored in non-strict mode (they would throw in strict mode), so <code>o.a</code> stays 1 and <code>o.b</code> is undefined. Note freeze is shallow — a nested object is still mutable unless you freeze it too.',
            'Đã chạy thật. <code>Object.freeze</code> làm một object bất biến: ghi vào thuộc tính đã có và thêm thuộc tính mới bị âm thầm bỏ qua ở chế độ non-strict (sẽ ném ở chế độ strict), nên <code>o.a</code> vẫn là 1 và <code>o.b</code> là undefined. Lưu ý freeze là nông — một object lồng vẫn sửa được trừ khi bạn cũng freeze nó.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code("console.log(['1-2-3'.split('-').map(Number), [1, 2, 3].join('-')]);"),
            'Đoạn mã sau in ra gì?' + code("console.log(['1-2-3'.split('-').map(Number), [1, 2, 3].join('-')]);"),
          ),
          options: [
            B("<code>[[1, 2, 3], '1-2-3']</code>", "<code>[[1, 2, 3], '1-2-3']</code>"),
            B("<code>[['1', '2', '3'], '1-2-3']</code>", "<code>[['1', '2', '3'], '1-2-3']</code>"),
            B("<code>[[1, 2, 3], [1, 2, 3]]</code>", "<code>[[1, 2, 3], [1, 2, 3]]</code>"),
            B("<code>[[1, 2, 3], '123']</code>", "<code>[[1, 2, 3], '123']</code>"),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>split(&#x27;-&#x27;)</code> gives string parts, and <code>.map(Number)</code> converts each to a number, so you get <code>[1, 2, 3]</code>. <code>join(&#x27;-&#x27;)</code> does the reverse, stitching elements with the separator into <code>&#x27;1-2-3&#x27;</code>. This split/map/join trio is the everyday way to parse and format delimited data.',
            'Đã chạy thật. <code>split(&#x27;-&#x27;)</code> cho các phần chuỗi, và <code>.map(Number)</code> chuyển mỗi phần thành số, nên bạn được <code>[1, 2, 3]</code>. <code>join(&#x27;-&#x27;)</code> làm ngược lại, khâu các phần tử bằng dấu phân cách thành <code>&#x27;1-2-3&#x27;</code>. Bộ ba split/map/join là cách thường ngày để phân tích và định dạng dữ liệu có phân cách.',
          ),
        }),
      ],
    },
  ],
};
