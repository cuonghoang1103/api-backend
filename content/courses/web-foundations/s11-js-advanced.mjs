/**
 * Web Foundations — Chương 11: JavaScript nâng cao (closure, this, prototype &
 * class, Map/Set, regex, bất biến). Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L115 from './s11/wf-11-5-regex.mjs';
import L114 from './s11/wf-11-4-map-set-immutable.mjs';
import L113 from './s11/wf-11-3-prototype-class.mjs';
import L112 from './s11/wf-11-2-this.mjs';
import L111 from './s11/wf-11-1-closure.mjs';

export default {
  title: 'Chapter 11 — Advanced JavaScript|||Chương 11 — JavaScript nâng cao',
  description: 'Chương 4 cho bạn viết được JavaScript. Chương này cho bạn ĐỌC được JavaScript của người khác — closure, this, prototype và class, Map/Set, biểu thức chính quy, và tư duy bất biến. Đây là ranh giới giữa "dùng được ngôn ngữ" và "hiểu ngôn ngữ".',
  lessons: [
    /* ─────────────────── 11.0 slide bài giảng ─────────────────── */
    {
      title: '11.0 — Advanced JavaScript in 12 slides|||11.0 — JavaScript nâng cao trong 12 slide',
      slug: 'wf-11-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Closure, this, prototype & class, Map/Set, bất biến và regex — gói cả chương vào 12 slide có mã tô màu.',
      content: `
<div class="ml-en"><h2>📑 Advanced JavaScript in 12 slides</h2>
<p>Slide 4 (var vs let) and slide 8 (immutability) are the two that change how you write React.</p>
<p>Skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 JavaScript nâng cao trong 12 slide</h2>
<p>Slide 4 (var vs let) và slide 8 (bất biến) là hai cái đổi hẳn cách bạn viết React.</p>
<p>Lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-js3', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Closure — ví dụ nhỏ nhất"],
  [4, "Bẫy closure: var vs let ⭐"],
  [5, "this — bốn luật"],
  [6, "Arrow function không có this riêng"],
  [7, "Chuỗi prototype"],
  [8, "Bất biến — luật sống còn với React ⭐"],
  [9, "Spread chỉ chép NÔNG"],
  [10, "Map và Set"],
  [11, "Regex — bảy ký hiệu đủ dùng"],
  [12, "Tự luyện"],
])}
`,
    },

    L111,

    L112,

    L113,

    L114,

    L115,

    {
      title: '11.6 — Chapter 11 quiz|||11.6 — Kiểm tra chương 11',
      slug: 'wf-11-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về closure, this, prototype/class, Map/Set, bất biến và regex — gồm câu "in ra gì" đã chạy thật.',
      content: `
<div class="ml-en"><p class="lead">Eight questions covering closures, <code>this</code>, prototypes and classes, Map/Set, immutability and regex. The "what does this print" answers were verified by running the code.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">A closure captures the variable</span><span class="lz-t">not a copy of its value</span><span class="lz-d">That is why the <code>var</code> loop prints 3,3,3 and why stale-data bugs appear in callbacks.</span></div>
<div class="lz-node"><span class="lz-k">this depends on the call</span><span class="lz-t">not on where the function lives</span><span class="lz-d">Detach a method from its object and <code>this</code> is gone. Arrows have no <code>this</code> of their own.</span></div>
<div class="lz-node"><span class="lz-k">class is sugar</span><span class="lz-t">the prototype chain is the real thing</span><span class="lz-d">Methods live once on the prototype; instances borrow them through the chain.</span></div>
<div class="lz-node"><span class="lz-k">Replace, do not mutate</span><span class="lz-t">and remember spread is shallow</span><span class="lz-d">React compares references. Same reference means "nothing changed", even when the contents differ.</span></div>
</div>
<p class="note-ct">If you predicted a "what does this print" wrongly, paste the snippet into the browser console and change one thing at a time until the behaviour makes sense. Reading the answer teaches much less than watching it happen.</p></div>
<div class="ml-vi"><p class="lead">Tám câu về closure, <code>this</code>, prototype và class, Map/Set, bất biến và regex. Các câu "in ra gì" đều đã được xác minh bằng cách chạy code thật.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Closure bắt giữ CÁI BIẾN</span><span class="lz-t">không phải bản chụp giá trị</span><span class="lz-d">Đó là lý do vòng lặp <code>var</code> in ra 3,3,3 và lý do callback hay dùng nhầm dữ liệu cũ.</span></div>
<div class="lz-node"><span class="lz-k">this tuỳ CÁCH GỌI</span><span class="lz-t">không tuỳ nơi viết hàm</span><span class="lz-d">Tách method khỏi object là mất <code>this</code>. Arrow không có <code>this</code> riêng.</span></div>
<div class="lz-node"><span class="lz-k">class chỉ là lớp vỏ đường</span><span class="lz-t">chuỗi prototype mới là thứ thật</span><span class="lz-d">Method nằm một lần trên prototype; các thực thể mượn qua chuỗi.</span></div>
<div class="lz-node"><span class="lz-k">Thay, đừng sửa</span><span class="lz-t">và nhớ spread chỉ chép NÔNG</span><span class="lz-d">React so sánh tham chiếu. Cùng tham chiếu nghĩa là "không có gì đổi", dù ruột đã khác.</span></div>
</div>
<p class="note-ct">Câu "in ra gì" nào bạn đoán sai thì dán đoạn code vào Console và đổi từng thứ một cho tới khi hiểu vì sao. Đọc đáp án dạy được ít hơn nhiều so với tự nhìn nó xảy ra.</p></div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'What does this print?  for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);|||Đoạn này in ra gì?  for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);',
            options: ['3, 3, 3|||3, 3, 3', '0, 1, 2|||0, 1, 2', '2, 2, 2|||2, 2, 2', 'undefined ba lần|||undefined ba lần'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Changing var to let in that loop prints 0, 1, 2. Why?|||Đổi var thành let trong vòng lặp đó thì in ra 0, 1, 2. Vì sao?',
            options: [
              'let creates a new binding for each iteration|||let tạo một biến MỚI cho mỗi vòng lặp',
              'let makes setTimeout run immediately|||let làm setTimeout chạy ngay lập tức',
              'let copies the value instead of the variable|||let chép giá trị thay vì chép biến',
              'let disables closures|||let tắt closure đi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'const user = { name: "Chi", greet() { return this.name; } }; const g = user.greet; What does g() return in strict mode?|||const user = { ten: "Chi", chao() { return this.ten; } }; const g = user.chao; Trong strict mode, g() trả về gì?',
            options: [
              'It throws, because this is undefined|||Ném lỗi, vì this là undefined',
              '"Chi"|||"Chi"',
              'undefined, silently|||undefined, không báo gì',
              'The global object|||Object toàn cục',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which function should you NOT use as an object method that needs this?|||Loại hàm nào KHÔNG được dùng làm method của object cần this?',
            options: ['Arrow function|||Arrow function', 'Hàm khai báo bằng function|||Hàm khai báo bằng function', 'Hàm async|||Hàm async', 'Hàm generator|||Hàm generator'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Where does the map method of an array actually live?|||Method map của một mảng thật ra nằm ở đâu?',
            options: [
              'On Array.prototype, found through the prototype chain|||Trên Array.prototype, tìm thấy qua chuỗi prototype',
              'Copied into every array when it is created|||Được chép vào từng mảng lúc tạo',
              'On Object.prototype|||Trên Object.prototype',
              'It is a keyword built into the language|||Nó là từ khoá của ngôn ngữ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'const copy = { ...user }; copy.address.city = "Hue"; What happens to user.address.city?|||const copy = { ...user }; copy.diaChi.thanhPho = "Huế"; user.diaChi.thanhPho thì sao?',
            options: [
              'It also becomes "Hue" — spread is shallow|||Cũng thành "Huế" — spread chỉ chép NÔNG',
              'It stays unchanged|||Giữ nguyên',
              'It becomes undefined|||Thành undefined',
              'It throws a TypeError|||Ném TypeError',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which set of array methods returns a NEW array instead of mutating?|||Nhóm method mảng nào TRẢ VỀ mảng mới thay vì sửa tại chỗ?',
            options: [
              'map, filter, slice, concat|||map, filter, slice, concat',
              'push, pop, splice, sort|||push, pop, splice, sort',
              'forEach, reverse, shift|||forEach, reverse, shift',
              'unshift, splice, sort|||unshift, splice, sort',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is [...new Set([1, 2, 2, 3])] ?|||[...new Set([1, 2, 2, 3])] cho ra gì?',
            options: ['[1, 2, 3]|||[1, 2, 3]', '[1, 2, 2, 3]|||[1, 2, 2, 3]', '{1, 2, 3}|||{1, 2, 3}', '3|||3'],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
