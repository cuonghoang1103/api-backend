/**
 * FER202 · Chapter 2 additions — the ES6 half of the Slot 2–3 deck
 * (slides 1–24: arrow functions, let/const, rest, destructuring, default
 * params, template literals, Promises, sync vs async, classes). The JSX half
 * (slides 25–42) is Chapter 3. Grounded slide-by-slide in
 * Slot2,3_ES6_Rendering-with-JSX.pptx. Exported as NEW lessons spliced into
 * Chapter 2 before its quiz; existing 2.1 / 2.2 concept lessons are untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/javascript${REF}`;

const SLIDES = {
  title: '2.3 — Slide by slide: ES6 for React (Slot 2–3, part 1)|||2.3 — Học theo từng slide: ES6 cho React (Slot 2–3, phần 1)',
  slug: 'fer202-2-3-slot2-es6-slides',
  type: 'DOCUMENT',
  description: 'Nửa ES6 của bộ slide Slot 2–3 (slide 1–24): lịch sử ECMAScript, arrow function, let/const, rest, destructuring, default params, template literal, Promise, đồng bộ vs bất đồng bộ, class — mỗi slide kèm giải thích và code song ngữ.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 2 · Lesson 2.3 · Slot 2–3 deck, slides 1–24</span>
<h2>The ES6 lecture, slide by slide</h2>
<p class="lead">React code is modern JavaScript. This is the first half of your lecturer's Slot 2–3 deck — the exact ES6 features React leans on. The second half (JSX, slides 25–42) is Chapter 3.</p>`,
      `<span class="eyebrow">Chương 2 · Bài 2.3 · Bộ slide Slot 2–3, slide 1–24</span>
<h2>Buổi học ES6, theo từng slide</h2>
<p class="lead">Code React là JavaScript hiện đại. Đây là nửa đầu bộ slide Slot 2–3 của thầy/cô — đúng các tính năng ES6 mà React dựa vào. Nửa sau (JSX, slide 25–42) là Chương 3.</p>`,
    ),
    walkHead('slot2_3', 1, 24, 'The deck is one file for two slots; here we cover its ES6 slides.', 'Bộ slide là một file cho hai slot; ở đây ta học phần ES6 của nó.'),
    walk('slot2_3', [
      [1, 'Getting started with ES6 and Rendering with JSX',
        `<p>Title slide for the combined Slot 2–3 deck: ES6 first, then JSX.</p>`,
        `<p>Slide bìa cho bộ Slot 2–3 gộp: ES6 trước, rồi JSX.</p>`],
      [2, 'Objectives',
        `<p>The ES6 half covers: an overview of ES6/ECMAScript 6 and its features; the JSX half covers rendering HTML, describing UI structure, creating JSX elements, JavaScript expressions and fragments. Your checklist for two lectures.</p>`,
        `<p>Nửa ES6 gồm: tổng quan ES6/ECMAScript 6 và các tính năng; nửa JSX gồm render HTML, mô tả cấu trúc UI, tạo phần tử JSX, biểu thức JavaScript và fragment. Checklist cho hai buổi học.</p>`],
      [3, 'What is ES6?',
        `<p><strong>ES6 (ECMAScript 6)</strong> is the 2015 version of the ECMAScript standard — the specification the JavaScript language follows. A common standard matters because many browsers run JS; without one, the same site would behave differently in each. ECMAScript is the standard, JavaScript is the implementation.</p>`,
        `<p><strong>ES6 (ECMAScript 6)</strong> là phiên bản 2015 của chuẩn ECMAScript — bản đặc tả mà ngôn ngữ JavaScript tuân theo. Cần một chuẩn chung vì nhiều trình duyệt chạy JS; không có chuẩn thì cùng một trang sẽ chạy khác nhau ở mỗi trình duyệt. ECMAScript là chuẩn, JavaScript là bản hiện thực.</p>`],
      [4, 'The history of ECMAScript',
        `<p>Timeline: 1995 LiveScript → 1997 the ECMAScript standard → 1999 ES3 → 2000–2005 AJAX (XMLHttpRequest) powers Gmail and Google Maps → 2009 ES5 (forEach, Object.keys, JSON) → <strong>2015 ES6/ECMAScript 2015</strong>. Since 2015 the standard is a yearly release (ES2016, ES2017…), but "ES6" is shorthand for "modern JS".</p>`,
        `<p>Dòng thời gian: 1995 LiveScript → 1997 chuẩn ECMAScript → 1999 ES3 → 2000–2005 AJAX (XMLHttpRequest) chạy Gmail và Google Maps → 2009 ES5 (forEach, Object.keys, JSON) → <strong>2015 ES6/ECMAScript 2015</strong>. Từ 2015 chuẩn ra mỗi năm (ES2016, ES2017…), nhưng "ES6" là cách nói gọn cho "JS hiện đại".</p>`],
      [5, 'Some features of ES6',
        `<p>The menu for this chapter: arrow functions, template literals, destructuring, classes, modules, enhanced array manipulation, Promises, enhanced object manipulation, default parameters, rest &amp; spread. The bolded ones appear in almost every React file.</p>`,
        `<p>Danh mục của chương: arrow function, template literal, destructuring, class, modules, thao tác mảng nâng cao, Promise, thao tác object nâng cao, default parameter, rest &amp; spread. Những mục này xuất hiện trong gần như mọi file React.</p>`],
      [6, 'Arrow functions — syntax',
        `<p>A shorter way to write functions. Two forms: with a body <code>(a, b) =&gt; { return a + b; }</code>, or the concise expression form <code>(a, b) =&gt; a + b</code> (implicit return, no braces). React event handlers and array callbacks are almost always arrow functions.</p>`,
        `<p>Cách viết hàm ngắn gọn hơn. Hai dạng: có thân <code>(a, b) =&gt; { return a + b; }</code>, hoặc dạng biểu thức gọn <code>(a, b) =&gt; a + b</code> (return ngầm, không ngoặc). Handler sự kiện và callback mảng trong React gần như luôn là arrow function.</p>`],
      [7, 'Arrow functions — multiple parameters',
        `<p>With two or more parameters, keep the parentheses: <code>const add = (a, b) =&gt; a + b;</code>. Call <code>add(2, 3)</code> → <code>5</code>.</p>`,
        `<p>Với hai tham số trở lên, giữ dấu ngoặc: <code>const add = (a, b) =&gt; a + b;</code>. Gọi <code>add(2, 3)</code> → <code>5</code>.</p>`],
      [8, 'Arrow functions — a single parameter',
        `<p>With exactly one parameter the parentheses are optional: <code>const square = n =&gt; n * n;</code>. Many code styles keep the parens for consistency (<code>(n) =&gt; n * n</code>).</p>`,
        `<p>Với đúng một tham số, dấu ngoặc là tuỳ chọn: <code>const square = n =&gt; n * n;</code>. Nhiều quy ước vẫn giữ ngoặc cho nhất quán (<code>(n) =&gt; n * n</code>).</p>`],
      [9, 'Arrow functions — no parameters',
        `<p>With no parameters you must write empty parentheses: <code>const greet = () =&gt; "Hi";</code>. To return an object literal, wrap it in parens so it is not read as a block: <code>() =&gt; ({ ok: true })</code>.</p>`,
        `<p>Không tham số thì phải viết cặp ngoặc rỗng: <code>const greet = () =&gt; "Hi";</code>. Muốn trả về object literal, bọc trong ngoặc để không bị hiểu là khối lệnh: <code>() =&gt; ({ ok: true })</code>.</p>`],
      [10, 'Arrow functions within object literals',
        `<p>Arrow functions have <strong>no own <code>this</code></strong> — they capture <code>this</code> from the surrounding scope. That is exactly why they are perfect for callbacks (no more <code>const self = this</code>), but a <em>caveat</em> inside object literals: an arrow used as a method cannot use <code>this</code> to mean the object. For object methods use a normal function; for callbacks use an arrow.</p>`,
        `<p>Arrow function <strong>không có <code>this</code> riêng</strong> — nó lấy <code>this</code> từ phạm vi bao quanh. Chính vì thế nó hoàn hảo cho callback (khỏi cần <code>const self = this</code>), nhưng có một <em>lưu ý</em> trong object literal: arrow dùng làm method thì không dùng <code>this</code> để chỉ chính object được. Method của object dùng hàm thường; callback dùng arrow.</p>`],
      [11, 'Block-scoped constructs — let and const',
        `<p><code>let</code> and <code>const</code> are <strong>block-scoped</strong>: a variable only exists inside the <code>{ … }</code> block it was declared in — unlike the old <code>var</code>, which was function-scoped and leaked. <code>const</code> is a block-scoped constant that cannot be reassigned.</p>`,
        `<p><code>let</code> và <code>const</code> có <strong>phạm vi khối</strong>: biến chỉ tồn tại trong khối <code>{ … }</code> nơi khai báo — khác <code>var</code> cũ vốn theo phạm vi hàm và rò rỉ ra ngoài. <code>const</code> là hằng số phạm vi khối, không gán lại được.</p>`],
      [12, 'let',
        `<p><code>let</code> declares a reassignable block-scoped variable. Outside its block it does not exist — a <code>let</code> inside an <code>if</code> or a <code>for</code> is invisible after the closing brace. This kills a whole class of loop bugs that <code>var</code> caused.</p>`,
        `<p><code>let</code> khai báo biến phạm vi khối, gán lại được. Ngoài khối thì nó không tồn tại — <code>let</code> trong <code>if</code> hay <code>for</code> là vô hình sau dấu ngoặc đóng. Điều này diệt cả một lớp lỗi vòng lặp mà <code>var</code> gây ra.</p>`],
      [13, 'const',
        `<p><code>const</code> declares a constant that cannot be <em>reassigned</em>. Note carefully: the <em>binding</em> is fixed, not the value — a <code>const</code> array or object can still be mutated (<code>arr.push(1)</code> is fine; <code>arr = []</code> is not). Default to <code>const</code>, use <code>let</code> only when you truly reassign.</p>`,
        `<p><code>const</code> khai báo hằng <em>không gán lại</em> được. Chú ý kỹ: cái bị cố định là <em>liên kết</em>, không phải giá trị — mảng hay object <code>const</code> vẫn thay đổi nội dung được (<code>arr.push(1)</code> được; <code>arr = []</code> thì không). Mặc định dùng <code>const</code>, chỉ dùng <code>let</code> khi thực sự gán lại.</p>`],
      [14, 'Rest parameter',
        `<p>The <code>...</code> before the last parameter gathers all remaining arguments into a real array: <code>function sum(...nums) { return nums.reduce((a, b) =&gt; a + b, 0); }</code>. It replaces the awkward old <code>arguments</code> object and, unlike it, is a genuine array with all array methods.</p>`,
        `<p>Dấu <code>...</code> trước tham số cuối gom mọi đối số còn lại vào một mảng thật: <code>function sum(...nums) { return nums.reduce((a, b) =&gt; a + b, 0); }</code>. Nó thay cho object <code>arguments</code> cũ vụng về và, khác object đó, là mảng thật có đủ method mảng.</p>`],
      [15, 'Destructuring assignment',
        `<p>Unpack values from arrays or objects into variables in one line. <strong>Array:</strong> <code>const [first, second] = arr;</code>. <strong>Object:</strong> <code>const { name, age } = person;</code>. This is everywhere in React — <code>const [count, setCount] = useState(0)</code> is array destructuring, and <code>function Card({ title })</code> is object destructuring of props.</p>`,
        `<p>Bóc giá trị từ mảng hoặc object ra biến trong một dòng. <strong>Mảng:</strong> <code>const [first, second] = arr;</code>. <strong>Object:</strong> <code>const { name, age } = person;</code>. Nó có mặt khắp React — <code>const [count, setCount] = useState(0)</code> là destructuring mảng, còn <code>function Card({ title })</code> là destructuring object của props.</p>`],
      [16, 'Default parameters',
        `<p>Give a parameter a fallback used when the argument is missing or <code>undefined</code>: <code>function greet(name = "friend") { … }</code>. Defaults can reference earlier parameters. In React you often see <code>function List({ items = [] })</code> to avoid crashing on undefined props.</p>`,
        `<p>Cho tham số một giá trị dự phòng khi đối số bị thiếu hoặc <code>undefined</code>: <code>function greet(name = "friend") { … }</code>. Giá trị mặc định có thể tham chiếu tham số trước đó. Trong React hay thấy <code>function List({ items = [] })</code> để không sập khi props undefined.</p>`],
      [17, 'Template literals',
        `<p>Backtick strings with three powers: <strong>expression interpolation</strong> <code>\`Hi \${name}\`</code>, <strong>multi-line</strong> strings without <code>\\n</code>, and readable composition. React status text like <code>\`\${count} items left\`</code> uses these constantly.</p>`,
        `<p>Chuỗi dùng dấu backtick với ba sức mạnh: <strong>nội suy biểu thức</strong> <code>\`Hi \${name}\`</code>, chuỗi <strong>nhiều dòng</strong> không cần <code>\\n</code>, và ghép chuỗi dễ đọc. Text trạng thái trong React như <code>\`\${count} items left\`</code> dùng liên tục.</p>`],
      [18, 'Promises',
        `<p>A <strong>Promise</strong> represents the eventual result of an async operation — its completion or failure. Three parts you will meet: <em>creating</em> a promise (<code>new Promise((resolve, reject) =&gt; …)</code>), <em>handling</em> it (<code>.then()</code>/<code>.catch()</code>), and <em>chaining</em> several. Every <code>fetch()</code> in Chapter 11 returns a promise.</p>`,
        `<p><strong>Promise</strong> đại diện cho kết quả cuối cùng của một thao tác bất đồng bộ — hoàn thành hoặc thất bại. Ba phần bạn sẽ gặp: <em>tạo</em> promise (<code>new Promise((resolve, reject) =&gt; …)</code>), <em>xử lý</em> (<code>.then()</code>/<code>.catch()</code>), và <em>nối chuỗi</em> nhiều promise. Mọi <code>fetch()</code> ở Chương 11 đều trả về một promise.</p>`],
      [19, 'Promises — creating, handling, chaining',
        `<p>Chaining lets each <code>.then</code> return a value the next <code>.then</code> receives, turning nested callbacks into a flat pipeline. A single <code>.catch</code> at the end handles any failure in the chain — cleaner than a try/catch per step.</p>`,
        `<p>Nối chuỗi cho mỗi <code>.then</code> trả về một giá trị mà <code>.then</code> kế tiếp nhận, biến callback lồng nhau thành một đường ống phẳng. Một <code>.catch</code> ở cuối xử lý mọi lỗi trong chuỗi — gọn hơn try/catch từng bước.</p>`],
      [20, 'Promises — Promise.all',
        `<p><code>Promise.all([p1, p2])</code> runs promises in parallel and resolves with an array of all results once <em>all</em> finish — great for firing several API calls at once. Caveat on the slide: if <em>any</em> promise rejects, <code>Promise.all</code> rejects immediately with that first error. The example resolves to <code>["Promise 1 resolved", "Promise 2 resolved"]</code> — note the order matches the input array, not which finished first.</p>`,
        `<p><code>Promise.all([p1, p2])</code> chạy các promise song song và resolve với mảng tất cả kết quả khi <em>tất cả</em> xong — rất hợp để bắn nhiều lời gọi API cùng lúc. Lưu ý trên slide: nếu <em>bất kỳ</em> promise nào reject, <code>Promise.all</code> reject ngay với lỗi đầu tiên đó. Ví dụ resolve ra <code>["Promise 1 resolved", "Promise 2 resolved"]</code> — chú ý thứ tự khớp mảng đầu vào, không phải cái nào xong trước.</p>`],
      [21, 'Sync vs Async — synchronous',
        `<p><strong>Synchronous</strong> code runs line by line; a long task <em>blocks</em> everything after it. The slide's loop building a string finishes before the next <code>console.log</code> runs. In a browser, a long sync task freezes the UI — which is why data-loading must be async.</p>`,
        `<p>Code <strong>đồng bộ</strong> chạy từng dòng; một tác vụ dài <em>chặn</em> mọi thứ phía sau. Vòng lặp dựng chuỗi trên slide chạy xong mới tới <code>console.log</code> kế tiếp. Trong trình duyệt, tác vụ đồng bộ dài làm đơ UI — nên việc tải dữ liệu phải bất đồng bộ.</p>`],
      [22, 'Sync vs Async — asynchronous (Promise & async/await)',
        `<p>The same job two ways. <strong>Promise:</strong> <code>myPromise.then(v =&gt; console.log(v))</code>. <strong>async/await:</strong> inside an <code>async</code> function, <code>const v = await myPromise;</code> reads like synchronous code but does not block. async/await is syntactic sugar over promises — you will use it for every API call in Chapter 11.</p>`,
        `<p>Cùng một việc hai cách. <strong>Promise:</strong> <code>myPromise.then(v =&gt; console.log(v))</code>. <strong>async/await:</strong> trong hàm <code>async</code>, <code>const v = await myPromise;</code> đọc như code đồng bộ nhưng không chặn. async/await là "đường ngọt" trên promise — bạn sẽ dùng cho mọi lời gọi API ở Chương 11.</p>`],
      [23, 'Classes',
        `<p>ES6 <code>class</code> is syntactic sugar over JavaScript's prototype OOP. Three parts: <em>declaration</em> (<code>class Animal { constructor(name) { … } }</code>), <em>creating objects</em> (<code>new Animal("cat")</code>), and <em>inheritance</em> (<code>class Dog extends Animal</code>). React's old class components used this; modern React uses function components + hooks, but you still read class code.</p>`,
        `<p><code>class</code> ES6 là "đường ngọt" trên OOP theo prototype của JavaScript. Ba phần: <em>khai báo</em> (<code>class Animal { constructor(name) { … } }</code>), <em>tạo object</em> (<code>new Animal("cat")</code>), và <em>kế thừa</em> (<code>class Dog extends Animal</code>). Class component cũ của React dùng cái này; React hiện đại dùng function component + hooks, nhưng bạn vẫn cần đọc được code class.</p>`],
      [24, 'Classes — declaration, objects, inheritance',
        `<p>Inheritance detail: a subclass calls <code>super(...)</code> in its constructor to run the parent's setup before using <code>this</code>. <code>extends</code> + <code>super</code> is the same pattern you saw in OOP (PRO192) — React class components extend <code>React.Component</code> and call <code>super(props)</code>.</p>`,
        `<p>Chi tiết kế thừa: lớp con gọi <code>super(...)</code> trong constructor để chạy phần khởi tạo của lớp cha trước khi dùng <code>this</code>. <code>extends</code> + <code>super</code> đúng mẫu bạn gặp trong OOP (PRO192) — class component React kế thừa <code>React.Component</code> và gọi <code>super(props)</code>.</p>`],
    ]),
    books([
      ['reactdoc', '“JavaScript in JSX with Curly Braces” and the ES6 refresher on react.dev', '“JavaScript in JSX with Curly Braces” và phần ôn ES6 trên react.dev'],
      ['mdn', 'Arrow functions, let/const, Destructuring, Promises, async/await', 'Arrow function, let/const, Destructuring, Promise, async/await'],
    ]),
    bi(
      `<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Practise ES6 in the browser</span><span class="lc-sub">Arrow functions, destructuring, promises — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
      `<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Luyện ES6 trên trình duyệt</span><span class="lc-sub">Arrow function, destructuring, promise — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
    ),
  ].join('\n'),
};

export default [SLIDES];
