/**
 * FER202 · 2.3 — Slide check: ES6 for React (Slot 2–3). Bài lý thuyết ⇒ trắc nghiệm (máy chấm choice).
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-2-3-slot2-es6-slides',
  ten: '2.3 Slide check — ES6 for React',
  khoa: KHOA,
  baiHoc: 'fer202-2-3-slot2-es6-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: ES6 essentials for React',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['let/const', 'arrow', 'spread/rest', 'destructuring', 'modules', 'Promise'], the: ['es6', 'quiz'],
      moTa: {
        en: '<p>Ten quick questions on the ES6 features used on every page of a React app. Predict the output before you choose.</p>',
        vi: '<p>Mười câu nhanh về các tính năng ES6 xuất hiện trong mọi trang React. Hãy tự đoán kết quả trước khi chọn.</p>',
      },
      goiY: ['Câu hỏi về kết quả: chạy thử trong đầu từng dòng, đừng đoán theo "cảm giác".', 'Spread/rest cùng dấu ... — ở VẾ PHẢI là trải ra, ở VẾ TRÁI/tham số là gom lại.'],
      loiHayGap: ['Nghĩ <code>const</code> làm mảng/object bất biến — chỉ là không gán lại biến.', 'Nhầm export mặc định với export có tên khi viết import.'],
      giaiThich: '<p>Mỗi câu có giải thích ngắn sau khi nộp. Câu sai ⇒ xem lại đoạn tương ứng của bài 2.1–2.2.</p>',
      thuatNgu: [{ en: 'reassign', vi: 'gán lại' }, { en: 'lexical this', vi: 'this theo phạm vi bao ngoài' }],
      cauHoi: [
        q('q1', 'Which declaration can NOT be reassigned? <i>(Khai báo nào KHÔNG gán lại được?)</i>', [['a', '<code>var</code>'], ['b', '<code>let</code>'], ['c', '<code>const</code>'], ['d', '<code>function</code>']], ['c'], '<code>const</code> forbids reassignment of the binding — the object/array it points to can still change.|||const cấm gán lại biến — object/mảng nó trỏ tới vẫn thay đổi được.'),
        q('q2', 'Output of <code>const a = [1, 2]; const b = [...a, 3]; a.push(9); console.log(b)</code>?', [['a', '<code>[1, 2, 3]</code>'], ['b', '<code>[1, 2, 9, 3]</code>'], ['c', '<code>[1, 2, 3, 9]</code>'], ['d', '<code>[[1, 2], 3]</code>']], ['a'], 'Spread copies the elements at that moment into a NEW array; later pushes to <code>a</code> do not affect <code>b</code>.|||Spread chép các phần tử tại thời điểm đó vào mảng MỚI; push vào a sau đó không ảnh hưởng b.'),
        q('q3', '<code>const { a, ...rest } = { a: 1, b: 2, c: 3 }</code> — what is <code>rest</code>?', [['a', '<code>[2, 3]</code>'], ['b', '<code>{ b: 2, c: 3 }</code>'], ['c', '<code>{ a: 1, b: 2, c: 3 }</code>'], ['d', '<code>undefined</code>']], ['b'], 'Object rest collects the remaining properties into a new object.|||Object rest gom các thuộc tính còn lại thành object mới.'),
        q('q4', 'Which statement about arrow functions is TRUE?', [['a', 'They have their own <code>this</code>.'], ['b', 'They take <code>this</code> from the surrounding scope.'], ['c', 'They can be used with <code>new</code>.'], ['d', 'They always need <code>return</code>.']], ['b'], 'Arrows have no own <code>this</code>/<code>arguments</code>; a single-expression body returns implicitly.|||Arrow không có this/arguments riêng; thân một biểu thức thì trả về ngầm.'),
        q('q5', 'What does <code>´Total: @{2 * 3}´</code> evaluate to?', [['a', '<code>"Total: @{2 * 3}"</code>'], ['b', '<code>"Total: 6"</code>'], ['c', '<code>"Total: 2 * 3"</code>'], ['d', 'SyntaxError']], ['b'], 'Inside back-ticks, <code>@{…}</code> is evaluated as a JavaScript expression.|||Trong dấu huyền, ${…} được tính như biểu thức JavaScript.'),
        q('q6', '<code>App.js</code> has <code>export default function App()</code>. Which import is correct?', [['a', "<code>import { App } from './App'</code>"], ['b', "<code>import App from './App'</code>"], ['c', "<code>import * from './App'</code>"], ['d', "<code>require App from './App'</code>"]], ['b'], 'A default export is imported without braces, under any name you choose.|||Export mặc định được import không có ngoặc nhọn, tên tuỳ đặt.'),
        q('q7', 'Which are TRUE about named exports? (choose all)', [['a', 'A file can have many named exports.'], ['b', 'You can rename on import: <code>import { sum as add }</code>.'], ['c', 'A file can have many default exports.'], ['d', 'Named imports go inside <code>{ }</code>.']], [['a', 'b', 'd']], 'Many named exports per file, imported in braces (renaming with <code>as</code>); at most ONE default export.|||Một tệp có nhiều named export, import trong { } (đổi tên bằng as); tối đa MỘT default export.', true),
        q('q8', '<code>[1, 2, 3].map((x) =&gt; x * 2)</code> returns…', [['a', '<code>undefined</code>'], ['b', '<code>[2, 4, 6]</code>'], ['c', '<code>12</code>'], ['d', 'the same array, changed in place']], ['b'], '<code>map</code> returns a NEW array of the callback results — that is why JSX lists use it (forEach returns undefined).|||map trả về mảng MỚI chứa kết quả — vì vậy JSX dùng map (forEach trả undefined).'),
        q('q9', '<code>Promise.all([p1, p2])</code> when <code>p2</code> rejects:', [['a', 'Resolves with <code>[value1, undefined]</code>.'], ['b', 'Rejects with <code>p2</code>’s error.'], ['c', 'Waits forever.'], ['d', 'Ignores <code>p2</code>.']], ['b'], 'All-or-nothing: the first rejection rejects the whole <code>Promise.all</code>. Use <code>allSettled</code> to keep partial results.|||Tất cả hoặc không: lần reject đầu tiên làm cả Promise.all reject. Muốn giữ kết quả từng phần dùng allSettled.'),
        q('q10', '<code>0 ?? 5</code> and <code>0 || 5</code> are…', [['a', '<code>0</code> and <code>5</code>'], ['b', '<code>5</code> and <code>5</code>'], ['c', '<code>0</code> and <code>0</code>'], ['d', '<code>5</code> and <code>0</code>']], ['a'], '<code>??</code> falls back only on null/undefined; <code>||</code> on every falsy value (0, \'\', false).|||?? chỉ thay khi null/undefined; || thay với mọi giá trị falsy (0, \'\', false).'),
      ],
    }),
  ],
});
