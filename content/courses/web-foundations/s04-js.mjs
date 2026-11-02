/**
 * Web Foundations — Chương 4: JavaScript nền tảng (biến, kiểu, điều kiện, vòng lặp,
 * hàm, mảng/đối tượng, DOM). Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 * Mọi câu "in ra gì" đã CHẠY THẬT bằng node để lấy đáp án. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L45 from './s04/wf-4-5-dom-events.mjs';
import L44 from './s04/wf-4-4-arrays-objects.mjs';
import L43 from './s04/wf-4-3-functions.mjs';
import L42 from './s04/wf-4-2-conditions-loops.mjs';
import L41 from './s04/wf-4-1-variables-types.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 4 — JavaScript fundamentals|||Chương 4 — JavaScript nền tảng',
  description: 'HTML là cấu trúc, CSS là vẻ ngoài, còn JavaScript là hành vi: nó khiến trang phản ứng, tính toán, đổi nội dung theo thời gian thực. Học biến và kiểu dữ liệu, điều kiện và vòng lặp, hàm, mảng và đối tượng, rồi dùng DOM để biến HTML tĩnh thành trang tương tác — nền cho cả Node.js lẫn React.',
  lessons: [
    /* ─────────────────────── 4.0 slide bài giảng ─────────────────────── */
    {
      title: '4.0 — Lecture slides: the whole chapter in 22 slides|||4.0 — Slide bài giảng: cả chương trong 22 slide',
      slug: 'wf-4-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ slide bài giảng chương 4 — xem trước để nắm bản đồ cả chương, hoặc xem lại để ôn nhanh. Mã nguồn tô màu như trong VS Code, có đánh dấu ⭐ những kiến thức sẽ gặp lại ở môn FER202.',
      content: `
<div class="ml-en"><h2>📑 Chapter 4 in 22 slides</h2>
<p>Two good ways to use this deck. <strong>Before the chapter</strong> — scroll through once to see the map: what is coming and in what order. <strong>After the chapter</strong> — come back and use it to revise; if a slide does not make sense yet, the lesson that covers it is right below.</p>
<p>The <strong>⭐ FER202</strong> badge marks the things you will meet again in the React course — arrow functions, <code>.map()</code>, destructuring and spread. Those are the ones to make sure you really own.</p></div>
<div class="ml-vi"><h2>📑 Chương 4 trong 22 slide</h2>
<p>Có hai cách dùng bộ slide này. <strong>Trước khi học chương</strong> — lướt một lượt để thấy bản đồ: sắp học gì, theo thứ tự nào. <strong>Sau khi học xong</strong> — quay lại ôn; slide nào chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p>
<p>Nhãn <strong>⭐ FER202</strong> đánh dấu những thứ bạn sẽ gặp lại ở môn React — arrow function, <code>.map()</code>, destructuring và spread. Đó là những chỗ cần nắm chắc nhất.</p></div>
${galleryGiang('wf-js1', [
  [1, 'Bìa chương'],
  [2, 'Nội dung chương — tám phần'],
  [3, 'JavaScript chạy ở đâu: trình duyệt và Node.js'],
  [4, 'Biến — const, let, và vì sao tránh var'],
  [5, 'const khoá CÁI TÊN, không khoá giá trị'],
  [6, 'Sáu kiểu dữ liệu gặp đầu tiên · typeof'],
  [7, 'Chuỗi và template literal ⭐'],
  [8, 'Bẫy: dấu + vừa cộng vừa nối chuỗi'],
  [9, 'So sánh — dùng === chứ không dùng =='],
  [10, 'Điều kiện: if / else · ba ngôi · ?? · ?. ⭐'],
  [11, 'Vòng lặp: for · for...of · while'],
  [12, 'Hàm — tham số, return, giá trị mặc định'],
  [13, 'Arrow function — ba cách viết một hàm ⭐'],
  [14, 'Mảng — chỉ số từ 0, length, push'],
  [15, 'map / filter / find / some / every ⭐⭐'],
  [16, 'reduce · sort và hai cái bẫy của sort'],
  [17, 'Object · destructuring · spread ⭐'],
  [18, 'DOM — querySelector và addEventListener'],
  [19, 'Bốn lỗi người mới hay gặp'],
  [20, 'Bảng đối chiếu: chương 4 dùng ở đâu trong FER202'],
  [21, 'Tự luyện — năm bài làm ngay trong Console'],
  [22, 'Học thêm ở đâu'],
])}
`,
    },

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    L41,

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    L42,

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    L43,

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    L44,

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    L45,

    /* ─────────────────────────── 4.6 quiz ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra chương 4',
      slug: 'wf-4-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về biến và kiểu, so sánh, vòng lặp, hàm, mảng/đối tượng và DOM — có câu "in ra gì" đã chạy thật.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 4: variables and types, strict equality, loops, functions, array methods, objects, and the DOM. Several ask what a snippet prints — the answers were verified by running the code.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> JavaScript only sticks when you write it. Head to Code Lab and solve real problems — variables, loops, functions and array methods — run your code to check the output, then mark the exercise solved yourself (automatic grading is still being built).</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">const, then let</span><span class="lz-t">And === always</span><span class="lz-d"><code>const</code> locks the name, not the value. <code>==</code> converts before comparing, and the rules are not worth memorising.</span></div>
<div class="lz-node"><span class="lz-k">Six falsy values</span><span class="lz-t">false, 0, '', null, undefined, NaN</span><span class="lz-d">Everything else is truthy, including <code>[]</code>. Use <code>??</code> for defaults so a legitimate <code>0</code> survives.</span></div>
<div class="lz-node"><span class="lz-k">Arrow bodies</span><span class="lz-t">Braces mean you must return</span><span class="lz-d"><code>n =&gt; n * 2</code> returns; <code>n =&gt; { n * 2 }</code> returns <code>undefined</code>, silently, and it becomes <code>NaN</code> further down.</span></div>
<div class="lz-node"><span class="lz-k">Copies are shallow</span><span class="lz-t">{...obj} shares nested data</span><span class="lz-d">Mutating <code>copy.tags</code> also mutates <code>original.tags</code>. This is the source of "editing one changed all of them".</span></div>
</div>
<p class="note-ct"><strong>The questions that ask what a snippet prints are the important ones.</strong> If your prediction is wrong, do not just read the answer — paste the snippet into a Node REPL or the browser console and change one thing at a time until the behaviour makes sense.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-4-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 4 practice set</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 4: biến và kiểu, bằng nghiêm ngặt, vòng lặp, hàm, phương thức mảng, đối tượng, và DOM. Vài câu hỏi một đoạn code in ra gì — đáp án đã được xác minh bằng cách chạy code.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> JavaScript chỉ thấm khi bạn tự viết. Hãy sang Code Lab giải bài thật — biến, vòng lặp, hàm và phương thức mảng — chạy thử để xem kết quả, rồi tự đánh dấu đã giải (máy chấm tự động đang được làm).</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">const, rồi mới let</span><span class="lz-t">Và luôn dùng ===</span><span class="lz-d"><code>const</code> khoá cái tên, không khoá giá trị. <code>==</code> chuyển đổi trước khi so, và luật của nó không đáng để học thuộc.</span></div>
<div class="lz-node"><span class="lz-k">Sáu giá trị falsy</span><span class="lz-t">false, 0, '', null, undefined, NaN</span><span class="lz-d">Còn lại đều truthy, kể cả <code>[]</code>. Hãy dùng <code>??</code> cho giá trị mặc định để một số <code>0</code> hợp lệ sống sót.</span></div>
<div class="lz-node"><span class="lz-k">Thân arrow function</span><span class="lz-t">Có ngoặc nhọn là phải return</span><span class="lz-d"><code>n =&gt; n * 2</code> có trả về; <code>n =&gt; { n * 2 }</code> trả về <code>undefined</code>, lặng lẽ, rồi thành <code>NaN</code> ở phía dưới.</span></div>
<div class="lz-node"><span class="lz-k">Bản chép là chép nông</span><span class="lz-t">{...obj} dùng chung dữ liệu lồng</span><span class="lz-d">Sửa <code>copy.tags</code> là sửa luôn <code>original.tags</code>. Đây là nguồn gốc của cảnh "sửa một cái thì cả đám cùng đổi".</span></div>
</div>
<p class="note-ct"><strong>Những câu hỏi "đoạn này in ra gì" mới là câu quan trọng.</strong> Nếu bạn đoán sai, đừng chỉ đọc đáp án — hãy dán đoạn đó vào Node REPL hoặc console của trình duyệt rồi đổi từng thứ một cho tới khi hành vi của nó trở nên có lý.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-4-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 4</a></div></div>
${onTapBai('wf-4-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which keyword should be your default for a value that will NOT be reassigned?|||Từ khoá nào nên là mặc định cho một giá trị SẼ KHÔNG bị gán lại?',
            options: [
              'const|||const',
              'let|||let',
              'var|||var',
              'function|||function',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does this print?  console.log(2 + 2 + "1");|||Đoạn này in ra gì?  console.log(2 + 2 + "1");',
            options: [
              '"41"|||"41"',
              '"221"|||"221"',
              '5|||5',
              '"5"|||"5"',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the result of  "5" === 5 ?|||Kết quả của  "5" === 5  là gì?',
            options: [
              'false — different types|||false — khác kiểu',
              'true|||true',
              'An error|||Một lỗi',
              '"5"|||"5"',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does  typeof [1, 2, 3]  return?|||typeof [1, 2, 3]  trả về gì?',
            options: [
              '"object"|||"object"',
              '"array"|||"array"',
              '"list"|||"list"',
              '"number"|||"number"',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does this print?  console.log([1, 2, 3, 4].filter(n => n % 2 === 0));|||Đoạn này in ra gì?  console.log([1, 2, 3, 4].filter(n => n % 2 === 0));',
            options: [
              '[2, 4]|||[2, 4]',
              '[1, 3]|||[1, 3]',
              '[2, 4, 6, 8]|||[2, 4, 6, 8]',
              '10|||10',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does  [1, 2, 3].map(n => n * 2)  produce?|||[1, 2, 3].map(n => n * 2)  tạo ra gì?',
            options: [
              '[2, 4, 6]|||[2, 4, 6]',
              '[1, 2, 3]|||[1, 2, 3]',
              '6|||6',
              '[1, 4, 9]|||[1, 4, 9]',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A function with no return statement returns what?|||Một hàm không có câu lệnh return thì trả về gì?',
            options: [
              'undefined|||undefined',
              '0|||0',
              'null|||null',
              'An empty string|||Một chuỗi rỗng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Given  const o = { name: "Lan" };  what is  o.age ?|||Cho  const o = { name: "Lan" };  thì  o.age  là gì?',
            options: [
              'undefined — the property does not exist|||undefined — thuộc tính không tồn tại',
              'An error is thrown|||Ném ra một lỗi',
              'null|||null',
              '0|||0',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which method attaches a click handler to a button element  btn ?|||Phương thức nào gắn một bộ xử lý click vào phần tử nút  btn ?',
            options: [
              'btn.addEventListener("click", handler)|||btn.addEventListener("click", handler)',
              'btn.onClick = handler()|||btn.onClick = handler()',
              'btn.click(handler)|||btn.click(handler)',
              'btn.on("click")|||btn.on("click")',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you select the element with id="save" in the DOM?|||Làm sao chọn phần tử có id="save" trong DOM?',
            options: [
              'document.querySelector("#save")|||document.querySelector("#save")',
              'document.querySelector(".save")|||document.querySelector(".save")',
              'document.querySelector("save")|||document.querySelector("save")',
              'document.getElement("save")|||document.getElement("save")',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
