/**
 * FER202 · Chapter 3 additions — the JSX half of the Slot 2–3 deck
 * (slides 25–42: what is JSX, rendering HTML, tag conventions, creating your
 * own elements, namespaces, JS expressions, mapping collections, fragments)
 * plus Exercise 4 (JSX & ES6 — array-method lab). Grounded slide-by-slide in
 * Slot2,3_ES6_Rendering-with-JSX.pptx and Exercise 4 of the course folder.
 * Spliced into Chapter 3 before its quiz; existing 3.1 / 3.2 lessons untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;

const SLIDES = {
  title: '3.3 — Slide by slide: Rendering with JSX (Slot 2–3, part 2)|||3.3 — Học theo từng slide: Render bằng JSX (Slot 2–3, phần 2)',
  slug: 'fer202-3-3-slot3-jsx-slides',
  type: 'DOCUMENT',
  description: 'Nửa JSX của bộ slide Slot 2–3 (slide 25–42): JSX là gì, render HTML, quy ước thẻ (hoa/thường), tạo phần tử riêng, namespace, biểu thức JavaScript, map collection ra phần tử, và Fragment — mỗi slide kèm giải thích và code.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 3 · Lesson 3.3 · Slot 2–3 deck, slides 25–42</span>
<h2>Rendering with JSX, slide by slide</h2>
<p class="lead">The second half of the Slot 2–3 deck. Now that you have the ES6 (Chapter 2), these slides turn it into UI: JSX syntax, how it becomes HTML, and how to drive it with JavaScript expressions and collections.</p>`,
      `<span class="eyebrow">Chương 3 · Bài 3.3 · Bộ slide Slot 2–3, slide 25–42</span>
<h2>Render bằng JSX, theo từng slide</h2>
<p class="lead">Nửa sau của bộ Slot 2–3. Có ES6 (Chương 2) rồi, các slide này biến nó thành UI: cú pháp JSX, cách nó thành HTML, và cách điều khiển bằng biểu thức JavaScript và collection.</p>`,
    ),
    walkHead('slot2_3', 25, 42),
    walk('slot2_3', [
      [25, 'What is JSX?',
        `<p>Section divider — the deck switches from ES6 to JSX.</p>`,
        `<p>Slide phân mục — bộ slide chuyển từ ES6 sang JSX.</p>`],
      [26, 'What is JSX?',
        `<p><strong>JSX is the XML/HTML-like markup syntax embedded in JavaScript</strong> used to declare React components — the language you describe React UIs in. This section covers: your first JSX content and rendering HTML. Remember: JSX is not HTML and not a string; a build tool (Babel) compiles it to <code>React.createElement(...)</code> calls.</p>`,
        `<p><strong>JSX là cú pháp đánh dấu kiểu XML/HTML nhúng trong JavaScript</strong> dùng để khai báo component React — ngôn ngữ bạn dùng để mô tả UI React. Phần này gồm: nội dung JSX đầu tiên và render HTML. Nhớ: JSX không phải HTML và không phải chuỗi; một công cụ build (Babel) biên dịch nó thành các lời gọi <code>React.createElement(...)</code>.</p>`],
      [27, 'JSX content: Hello JSX',
        `<p>Your first app: <code>root.render(&lt;h1&gt;Hello JSX&lt;/h1&gt;)</code>. The <code>render()</code> takes JSX as an argument and renders it into the DOM node passed to <code>ReactDOM.createRoot()</code>. This is the minimal path from JSX to a pixel on the page.</p>`,
        `<p>App đầu tiên: <code>root.render(&lt;h1&gt;Hello JSX&lt;/h1&gt;)</code>. Hàm <code>render()</code> nhận JSX làm đối số và render vào node DOM đã truyền cho <code>ReactDOM.createRoot()</code>. Đây là đường ngắn nhất từ JSX tới một điểm ảnh trên trang.</p>`],
      [28, 'Rendering HTML — built-in tags',
        `<p>JSX for built-in HTML elements looks almost like HTML, with subtle differences in <strong>case-sensitivity</strong> and <strong>attributes</strong> (e.g. <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>, and camelCase events like <code>onClick</code>). Attributes that clash with JS reserved words were renamed.</p>`,
        `<p>JSX cho phần tử HTML dựng sẵn gần giống HTML, khác tinh tế ở <strong>phân biệt hoa/thường</strong> và <strong>thuộc tính</strong> (ví dụ <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>, sự kiện camelCase như <code>onClick</code>). Các thuộc tính trùng từ khoá JS đã được đổi tên.</p>`],
      [29, 'Rendering HTML — tag conventions',
        `<p>The rule that trips beginners: <strong>tag names are case-sensitive</strong>. Lowercase = built-in HTML (<code>&lt;button&gt;</code>); Capitalised = your React component (<code>&lt;Button&gt;</code>). React "knows about <code>&lt;button&gt;</code>" but treats <code>&lt;Button&gt;</code> as a component it must find in scope. Forget to capitalise your component and React renders an unknown HTML tag instead.</p>`,
        `<p>Quy tắc hay làm người mới vấp: <strong>tên thẻ phân biệt hoa/thường</strong>. Chữ thường = HTML dựng sẵn (<code>&lt;button&gt;</code>); Viết hoa = component React của bạn (<code>&lt;Button&gt;</code>). React "biết <code>&lt;button&gt;</code>" nhưng coi <code>&lt;Button&gt;</code> là component phải tìm trong phạm vi. Quên viết hoa component thì React render một thẻ HTML lạ.</p>`],
      [30, 'JSX content: Declarative UI structures',
        `<p>JSX describes <em>what</em> to render, not <em>how</em>. It supports the standard HTML tags but with React's conventions (slide 28–29). Declarative markup is why a JSX tree reads like the UI it produces.</p>`,
        `<p>JSX mô tả <em>render cái gì</em>, không phải <em>render thế nào</em>. Nó hỗ trợ các thẻ HTML chuẩn nhưng theo quy ước của React (slide 28–29). Chính vì khai báo mà một cây JSX đọc lên giống đúng UI nó tạo ra.</p>`],
      [31, 'Describing the UI structure',
        `<p>A larger JSX block can describe a sophisticated UI and still be easier to read than imperative DOM code — because it is XML, and XML expresses a <strong>hierarchy</strong> concisely. Indentation shows nesting the way the DOM actually nests.</p>`,
        `<p>Một khối JSX lớn có thể mô tả UI phức tạp mà vẫn dễ đọc hơn code DOM mệnh lệnh — vì nó là XML, và XML diễn đạt <strong>cấu trúc phân cấp</strong> gọn gàng. Thụt lề cho thấy lồng nhau đúng như DOM lồng nhau.</p>`],
      [32, 'Creating your own JSX elements',
        `<p>Components are React's fundamental building block. A component <strong>encapsulates HTML</strong>: <code>function Header() { return &lt;h1&gt;My App&lt;/h1&gt;; }</code>, then used as <code>&lt;Header /&gt;</code>. This is how you name and reuse a chunk of UI.</p>`,
        `<p>Component là viên gạch nền tảng của React. Một component <strong>đóng gói HTML</strong>: <code>function Header() { return &lt;h1&gt;My App&lt;/h1&gt;; }</code>, rồi dùng như <code>&lt;Header /&gt;</code>. Đây là cách bạn đặt tên và tái sử dụng một mảng UI.</p>`],
      [33, 'Creating your own elements — nesting',
        `<p>Components nest: a <code>&lt;Page&gt;</code> can render <code>&lt;Header /&gt;</code>, <code>&lt;Content /&gt;</code> and <code>&lt;Footer /&gt;</code>. This composition — small components combined into bigger ones — is the whole architecture of a React app.</p>`,
        `<p>Component lồng nhau: một <code>&lt;Page&gt;</code> có thể render <code>&lt;Header /&gt;</code>, <code>&lt;Content /&gt;</code> và <code>&lt;Footer /&gt;</code>. Kiểu kết hợp này — component nhỏ ghép thành component lớn — chính là toàn bộ kiến trúc của một app React.</p>`],
      [34, 'Creating your own elements — namespaces',
        `<p>A <strong>namespace</strong> groups related components under a shared prefix: <code>&lt;MyNamespace.MyComponent /&gt;</code> — <code>MyComponent</code> belongs to <code>MyNamespace</code>. Useful for component libraries (e.g. <code>&lt;Accordion.Item /&gt;</code>). Exercise 4 (next lesson) demonstrates namespaces in JSX.</p>`,
        `<p><strong>Namespace</strong> gom các component liên quan dưới một tiền tố chung: <code>&lt;MyNamespace.MyComponent /&gt;</code> — <code>MyComponent</code> thuộc <code>MyNamespace</code>. Hữu ích cho thư viện component (ví dụ <code>&lt;Accordion.Item /&gt;</code>). Exercise 4 (bài kế) minh hoạ namespace trong JSX.</p>`],
      [35, 'Exercise 4: Demo about Namespace in JSX',
        `<p>Hand-off to <strong>Exercise 4</strong> — a JSX + ES6 lab (namespaces, plus array-method practice). Full solved version in the lesson "Exercise 4 — JSX & ES6".</p>`,
        `<p>Chuyển sang <strong>Exercise 4</strong> — lab JSX + ES6 (namespace, cùng luyện method mảng). Bản giải đầy đủ ở bài "Exercise 4 — JSX & ES6".</p>`],
      [36, 'Using JavaScript expressions',
        `<p>The bridge from data to UI: put any valid JavaScript expression in JSX inside braces <code>{ }</code>. Two jobs coming up — dynamic property values &amp; text, and mapping collections to elements.</p>`,
        `<p>Cầu nối từ dữ liệu tới UI: đặt bất kỳ biểu thức JavaScript hợp lệ nào vào JSX trong cặp ngoặc nhọn <code>{ }</code>. Hai việc sắp tới — giá trị thuộc tính &amp; text động, và map collection ra phần tử.</p>`],
      [37, 'Dynamic property values and text',
        `<p>Anything that is a valid JS expression — including nested JSX — can go between <code>{ }</code>: <code>&lt;img src={user.avatar} alt={user.name} /&gt;</code>, <code>&lt;p&gt;Hello {name}&lt;/p&gt;</code>. Primitives are straightforward; for objects/arrays you must transform them into JSX (next slide). Note: <code>{ }</code> holds an <em>expression</em>, not a statement — no <code>if</code> or <code>for</code> inside.</p>`,
        `<p>Bất kỳ biểu thức JS hợp lệ nào — kể cả JSX lồng — đều đặt được giữa <code>{ }</code>: <code>&lt;img src={user.avatar} alt={user.name} /&gt;</code>, <code>&lt;p&gt;Hello {name}&lt;/p&gt;</code>. Giá trị nguyên thuỷ thì đơn giản; với object/mảng bạn phải biến chúng thành JSX (slide sau). Lưu ý: <code>{ }</code> chứa <em>biểu thức</em>, không phải câu lệnh — không có <code>if</code> hay <code>for</code> bên trong.</p>`],
      [38, 'Mapping collections to elements',
        `<p>To render a list, <code>.map()</code> an array into an array of JSX elements: <code>{items.map(x =&gt; &lt;li key={x.id}&gt;{x.name}&lt;/li&gt;)}</code>. This is the single most common data-to-UI pattern in React. Each element needs a stable <code>key</code> prop so React can track it across renders (covered again in Chapter 5).</p>`,
        `<p>Để render danh sách, dùng <code>.map()</code> biến một mảng thành mảng phần tử JSX: <code>{items.map(x =&gt; &lt;li key={x.id}&gt;{x.name}&lt;/li&gt;)}</code>. Đây là mẫu dữ liệu-thành-UI phổ biến nhất trong React. Mỗi phần tử cần một <code>key</code> ổn định để React theo dõi qua các lần render (nhắc lại ở Chương 5).</p>`],
      [39, 'Fragments of JSX',
        `<p>A component must return a <strong>single</strong> root element. A <strong>Fragment</strong> groups siblings without adding an extra DOM node — React renders only the children where the component is used. Solves "I need to return two elements but not wrap them in a div".</p>`,
        `<p>Một component phải trả về <strong>một</strong> phần tử gốc. <strong>Fragment</strong> gom các phần tử ngang hàng mà không thêm node DOM thừa — React chỉ render các con tại nơi component được dùng. Giải quyết "cần trả về hai phần tử mà không muốn bọc trong div".</p>`],
      [40, 'Fragments — the <> syntax',
        `<p>Instead of wrapping in <code>&lt;div&gt;</code>, use the empty tag <code>&lt;&gt;…&lt;/&gt;</code> (shorthand for <code>&lt;React.Fragment&gt;</code>). Only its children render — no wrapper div bloating your DOM or breaking fl/grid layouts. Use the long form <code>&lt;React.Fragment key={id}&gt;</code> when you need a <code>key</code> in a list.</p>`,
        `<p>Thay vì bọc trong <code>&lt;div&gt;</code>, dùng thẻ rỗng <code>&lt;&gt;…&lt;/&gt;</code> (viết tắt của <code>&lt;React.Fragment&gt;</code>). Chỉ các con render — không có div bọc làm phình DOM hay phá layout flex/grid. Dùng dạng dài <code>&lt;React.Fragment key={id}&gt;</code> khi cần <code>key</code> trong danh sách.</p>`],
      [41, 'Lab 1: JSX and ES6',
        `<p>Points to the hands-on lab — practising JSX and ES6 together. On this site it is Exercise 4 (the next lesson), fully solved.</p>`,
        `<p>Trỏ tới bài lab thực hành — luyện JSX và ES6 cùng nhau. Trên trang này là Exercise 4 (bài kế), có lời giải đầy đủ.</p>`],
      [42, 'Summary',
        `<p>Recap: ES6 overview and features (Chapter 2); JSX overview, rendering HTML, describing UI structure, creating JSX elements, JavaScript expressions and fragments (this lesson). If you can turn an array of data into a list of components with <code>.map()</code> and a <code>key</code>, you have the core of JSX.</p>`,
        `<p>Tóm tắt: tổng quan và tính năng ES6 (Chương 2); tổng quan JSX, render HTML, mô tả cấu trúc UI, tạo phần tử JSX, biểu thức JavaScript và fragment (bài này). Nếu bạn biến được một mảng dữ liệu thành danh sách component bằng <code>.map()</code> và <code>key</code>, bạn đã nắm cốt lõi JSX.</p>`],
    ]),
    books([
      ['reactdoc', '“Writing Markup with JSX”, “JavaScript in JSX with Curly Braces”, “Rendering Lists”', '“Writing Markup with JSX”, “JavaScript in JSX with Curly Braces”, “Rendering Lists”'],
    ]),
  ].join('\n'),
};

/* ═══════════════ Exercise 4 — JSX & ES6 (array-method lab) ═══════════════ */
const EX4 = {
  title: 'Exercise 4 — JSX & ES6 (array-method lab)|||Exercise 4 — JSX & ES6 (lab method mảng)',
  slug: 'fer202-3-ex4-jsx-es6',
  type: 'EXERCISE',
  description: 'Bài lab tổng hợp ES6 + JSX: dựng navbar/list bằng JSX, và luyện find/filter/every/some/reduce/forEach/sort trên dữ liệu người & công ty — có lời giải mẫu.',
  content: bi(
    `<span class="eyebrow">Chapter 3 · Exercise 4 · Slot 2–3 slides 35 &amp; 41 (Lab 1)</span>
<h2>JSX &amp; ES6 — the array-method lab</h2>
<p class="lead"><b>Goal:</b> practise the ES6 array methods React uses to turn data into UI. Below is the exercise's dataset with a worked solution for each task. Try each yourself first, then check.</p>
<h3>Part A — the <code>people</code> array</h3>
<pre><span class="hljs-keyword">const</span> people = [
  { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Jack&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">50</span> }, { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Michael&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">9</span> }, { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;John&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">40</span> },
  { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Ann&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">19</span> }, { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Elisabeth&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">16</span> }
];
<span class="hljs-keyword">const</span> <span class="hljs-title function_">isTeen</span> = p =&gt; p.<span class="hljs-property">age</span> &gt;= <span class="hljs-number">10</span> &amp;&amp; p.<span class="hljs-property">age</span> &lt;= <span class="hljs-number">20</span>;

<span class="hljs-comment">// 1) First teenager — .find returns the first match (or undefined)</span>
people.<span class="hljs-title function_">find</span>(isTeen);              <span class="hljs-comment">// { name: &#x27;Ann&#x27;, age: 19 }</span>
<span class="hljs-comment">// 2) All teenagers — .filter returns every match</span>
people.<span class="hljs-title function_">filter</span>(isTeen);           <span class="hljs-comment">// [Ann, Elisabeth]</span>
<span class="hljs-comment">// 3) Are ALL teenagers? — .every returns a boolean</span>
people.<span class="hljs-title function_">every</span>(isTeen);            <span class="hljs-comment">// false</span>
<span class="hljs-comment">// 4) Is ANY a teenager? — .some returns a boolean</span>
people.<span class="hljs-title function_">some</span>(isTeen);             <span class="hljs-comment">// true</span></pre>
<h3>Part B — <code>reduce</code> on <code>[1, 2, 3, 4]</code></h3>
<pre><span class="hljs-keyword">const</span> array = [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>];
<span class="hljs-comment">// sum: accumulator starts at 0 (2nd argument)</span>
array.<span class="hljs-title function_">reduce</span>(<span class="hljs-function">(<span class="hljs-params">acc, n</span>) =&gt;</span> acc + n, <span class="hljs-number">0</span>);     <span class="hljs-comment">// 10</span>
<span class="hljs-comment">// product: accumulator starts at 1</span>
array.<span class="hljs-title function_">reduce</span>(<span class="hljs-function">(<span class="hljs-params">acc, n</span>) =&gt;</span> acc * n, <span class="hljs-number">1</span>);     <span class="hljs-comment">// 24</span></pre>
<p>The lab hints "just try arrow functions!" — <code>reduce</code> plus a one-line arrow removes all the boilerplate a manual loop would need.</p>
<h3>Part C — the <code>companies</code> array</h3>
<pre><span class="hljs-keyword">const</span> companies = [ <span class="hljs-comment">/* Company One…Nine with category, start, end */</span> ];

<span class="hljs-comment">// print each name</span>
companies.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(c.<span class="hljs-property">name</span>));
<span class="hljs-comment">// companies that started after 1987</span>
companies.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c.<span class="hljs-property">start</span> &gt; <span class="hljs-number">1987</span>);
<span class="hljs-comment">// Retail only, +1 to start, render as JSX paragraphs</span>
companies
  .<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c.<span class="hljs-property">category</span> === <span class="hljs-string">&#x27;Retail&#x27;</span>)
  .<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> ({ ...c, <span class="hljs-attr">start</span>: c.<span class="hljs-property">start</span> + <span class="hljs-number">1</span> }))
  .<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{c.name}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.name}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.category}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.start}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.end}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  ));
<span class="hljs-comment">// sort by end date ascending (copy first — sort mutates!)</span>
[...companies].<span class="hljs-title function_">sort</span>(<span class="hljs-function">(<span class="hljs-params">a, b</span>) =&gt;</span> a.<span class="hljs-property">end</span> - b.<span class="hljs-property">end</span>);
<span class="hljs-comment">// sort the ages array descending</span>
[...ages].<span class="hljs-title function_">sort</span>(<span class="hljs-function">(<span class="hljs-params">a, b</span>) =&gt;</span> b - a);</pre>
<div class="pitfall"><b>Trap:</b> <code>Array.prototype.sort()</code> sorts <strong>in place</strong> and, with no comparator, sorts as <em>strings</em> (so <code>[10, 9, 2]</code> becomes <code>[10, 2, 9]</code>). Always pass a numeric comparator <code>(a, b) =&gt; a - b</code>, and copy with <code>[...arr]</code> first so you do not mutate props/state — mutating state is a classic React bug.</div>
<h3>Part D — JSX build tasks</h3>
<p>The exercise also asks you to build UI with JSX: design a page from a given image, a <strong>navbar</strong>, display a block of text, and render a <strong>list of courses</strong>. Use <code>.map()</code> with a <code>key</code> for the course list, and componentise the navbar (<code>&lt;NavBar /&gt;</code>).</p>
<div class="callout"><span class="badge">★ Why this matters</span> <code>filter → map → sort</code> is the exact pipeline you will run inside React components to derive what to render from raw data — chained, immutable (via spread), and expression-only so it drops straight into JSX <code>{ }</code>.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Run the array-method lab</span><span class="lc-sub">find / filter / reduce / map → JSX — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 3 · Exercise 4 · Slot 2–3 slide 35 &amp; 41 (Lab 1)</span>
<h2>JSX &amp; ES6 — lab method mảng</h2>
<p class="lead"><b>Mục tiêu:</b> luyện các method mảng ES6 mà React dùng để biến dữ liệu thành UI. Dưới đây là dữ liệu của bài kèm lời giải mẫu cho từng yêu cầu. Hãy tự làm trước rồi đối chiếu.</p>
<h3>Phần A — mảng <code>people</code></h3>
<pre><span class="hljs-keyword">const</span> people = [
  { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Jack&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">50</span> }, { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Michael&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">9</span> }, { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;John&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">40</span> },
  { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Ann&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">19</span> }, { <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;Elisabeth&#x27;</span>, <span class="hljs-attr">age</span>: <span class="hljs-number">16</span> }
];
<span class="hljs-keyword">const</span> <span class="hljs-title function_">isTeen</span> = p =&gt; p.<span class="hljs-property">age</span> &gt;= <span class="hljs-number">10</span> &amp;&amp; p.<span class="hljs-property">age</span> &lt;= <span class="hljs-number">20</span>;

<span class="hljs-comment">// 1) Teen đầu tiên — .find trả về match đầu tiên (hoặc undefined)</span>
people.<span class="hljs-title function_">find</span>(isTeen);              <span class="hljs-comment">// { name: &#x27;Ann&#x27;, age: 19 }</span>
<span class="hljs-comment">// 2) Tất cả teen — .filter trả về mọi match</span>
people.<span class="hljs-title function_">filter</span>(isTeen);           <span class="hljs-comment">// [Ann, Elisabeth]</span>
<span class="hljs-comment">// 3) Có phải TẤT CẢ đều teen? — .every trả về boolean</span>
people.<span class="hljs-title function_">every</span>(isTeen);            <span class="hljs-comment">// false</span>
<span class="hljs-comment">// 4) Có AI là teen không? — .some trả về boolean</span>
people.<span class="hljs-title function_">some</span>(isTeen);             <span class="hljs-comment">// true</span></pre>
<h3>Phần B — <code>reduce</code> trên <code>[1, 2, 3, 4]</code></h3>
<pre><span class="hljs-keyword">const</span> array = [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>];
<span class="hljs-comment">// tổng: accumulator bắt đầu từ 0 (đối số thứ 2)</span>
array.<span class="hljs-title function_">reduce</span>(<span class="hljs-function">(<span class="hljs-params">acc, n</span>) =&gt;</span> acc + n, <span class="hljs-number">0</span>);     <span class="hljs-comment">// 10</span>
<span class="hljs-comment">// tích: accumulator bắt đầu từ 1</span>
array.<span class="hljs-title function_">reduce</span>(<span class="hljs-function">(<span class="hljs-params">acc, n</span>) =&gt;</span> acc * n, <span class="hljs-number">1</span>);     <span class="hljs-comment">// 24</span></pre>
<p>Bài gợi ý "cứ thử arrow function!" — <code>reduce</code> cộng một arrow một dòng bỏ hết phần rườm rà mà vòng lặp thủ công cần.</p>
<h3>Phần C — mảng <code>companies</code></h3>
<pre><span class="hljs-keyword">const</span> companies = [ <span class="hljs-comment">/* Company One…Nine với category, start, end */</span> ];

<span class="hljs-comment">// in từng tên</span>
companies.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(c.<span class="hljs-property">name</span>));
<span class="hljs-comment">// công ty thành lập sau 1987</span>
companies.<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c.<span class="hljs-property">start</span> &gt; <span class="hljs-number">1987</span>);
<span class="hljs-comment">// chỉ Retail, +1 vào start, render thành đoạn JSX</span>
companies
  .<span class="hljs-title function_">filter</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> c.<span class="hljs-property">category</span> === <span class="hljs-string">&#x27;Retail&#x27;</span>)
  .<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> ({ ...c, <span class="hljs-attr">start</span>: c.<span class="hljs-property">start</span> + <span class="hljs-number">1</span> }))
  .<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">c</span> =&gt;</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{c.name}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.name}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.category}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.start}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>{c.end}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  ));
<span class="hljs-comment">// sắp theo end tăng dần (copy trước — sort làm biến đổi mảng!)</span>
[...companies].<span class="hljs-title function_">sort</span>(<span class="hljs-function">(<span class="hljs-params">a, b</span>) =&gt;</span> a.<span class="hljs-property">end</span> - b.<span class="hljs-property">end</span>);
<span class="hljs-comment">// sắp mảng ages giảm dần</span>
[...ages].<span class="hljs-title function_">sort</span>(<span class="hljs-function">(<span class="hljs-params">a, b</span>) =&gt;</span> b - a);</pre>
<div class="pitfall"><b>Bẫy:</b> <code>Array.prototype.sort()</code> sắp <strong>tại chỗ</strong> và, nếu không có comparator, sắp như <em>chuỗi</em> (nên <code>[10, 9, 2]</code> thành <code>[10, 2, 9]</code>). Luôn truyền comparator số <code>(a, b) =&gt; a - b</code>, và copy bằng <code>[...arr]</code> trước để không biến đổi props/state — biến đổi state là lỗi React kinh điển.</div>
<h3>Phần D — bài dựng JSX</h3>
<p>Bài còn yêu cầu dựng UI bằng JSX: thiết kế trang theo ảnh cho sẵn, một <strong>navbar</strong>, hiển thị một khối text, và render <strong>danh sách khoá học</strong>. Dùng <code>.map()</code> kèm <code>key</code> cho danh sách khoá học, và tách navbar thành component (<code>&lt;NavBar /&gt;</code>).</p>
<div class="callout"><span class="badge">★ Vì sao quan trọng</span> <code>filter → map → sort</code> đúng là đường ống bạn chạy bên trong component React để suy ra cái cần render từ dữ liệu thô — nối chuỗi, bất biến (nhờ spread), và chỉ dùng biểu thức nên đặt thẳng vào JSX <code>{ }</code> được.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Chạy lab method mảng</span><span class="lc-sub">find / filter / reduce / map → JSX — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [SLIDES, EX4];
