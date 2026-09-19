/**
 * Web Foundations — Chương 11: JavaScript nâng cao (closure, this, prototype &
 * class, Map/Set, regex, bất biến). Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery } from './_slides.mjs';

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
${gallery('wf-js3', [
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

    {
      title: '11.1 — Closure: a function that remembers|||11.1 — Closure: hàm nhớ được nơi nó sinh ra',
      slug: 'wf-11-1-closure',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Closure là gì, vì sao nó tồn tại, và ba chỗ bạn đã dùng nó mà không biết: bộ đếm riêng tư, hàm sinh hàm, và mọi callback trong React.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>A closure is a function plus the variables it was born with</h2>
<p class="lead">When a function is created inside another function, it keeps a live link to that outer function's variables — even after the outer function has finished. That bundle is called a <strong>closure</strong>. You have already used closures dozens of times; this lesson just gives the thing a name.</p>

<h3>The smallest example that shows it</h3>
<pre><code>function makeCounter() {
  let count = 0;              // lives in makeCounter's scope
  return function () {
    count = count + 1;        // still reachable, after makeCounter returned
    return count;
  };
}

const next = makeCounter();
next();   // 1
next();   // 2
next();   // 3
// count is NOT reachable from outside — there is no way to set it to 100</code></pre>
<p><code>makeCounter</code> finished running long ago. Normally its local variables would be gone. They are not, because the returned function still refers to <code>count</code>, so JavaScript keeps that variable alive for as long as the function exists.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">What it gives you</span><span class="v">Private state. <code>count</code> cannot be read or written from outside — only through the function you returned.</span></div>
  <div class="kv"><span class="k">What it costs</span><span class="v">Memory. The variable cannot be freed while the closure lives. This matters only when you create thousands of them.</span></div>
</div>

<h3>Two closures do not share state</h3>
<pre><code>const a = makeCounter();
const b = makeCounter();
a(); a(); a();   // 3
b();             // 1  — b has its OWN count</code></pre>
<p class="note-ct">This is exactly why two <code>&lt;Counter /&gt;</code> components in React keep separate numbers. Same mechanism, different wrapper.</p>

<h3>The classic interview trap</h3>
<pre><code>// With var — all three print 3
for (var i = 0; i &lt; 3; i++) {
  setTimeout(() =&gt; console.log(i), 0);
}
// 3, 3, 3   — there is ONE i, and by the time the timers run it is 3

// With let — prints 0, 1, 2
for (let i = 0; i &lt; 3; i++) {
  setTimeout(() =&gt; console.log(i), 0);
}
// 0, 1, 2   — let creates a NEW i for each turn of the loop</code></pre>
<p>This single example is why <code>let</code> replaced <code>var</code>. It is not style; it changes what the program does.</p>

<h3>A function that builds functions</h3>
<pre><code>function multiplyBy(factor) {
  return (n) =&gt; n * factor;     // factor is captured
}
const double = multiplyBy(2);
const triple = multiplyBy(3);
double(5);   // 10
triple(5);   // 15</code></pre>

<div class="pitfall"><strong>Trap:</strong> a closure captures the <em>variable</em>, not a snapshot of its value. If the outer variable changes later, the closure sees the new value. That is what makes the <code>var</code> loop above print 3 three times, and it is the source of "my handler uses stale data" bugs in React (the fix there is the functional update form: <code>setCount(c =&gt; c + 1)</code>).</div>

<div class="link-card"><a href="https://javascript.info/closure" target="_blank" rel="noopener">javascript.info — Variable scope, closure (with exercises)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Closure là một hàm cộng với những biến nó sinh ra cùng</h2>
<p class="lead">Khi một hàm được tạo bên trong một hàm khác, nó giữ một đường dẫn <strong>sống</strong> tới các biến của hàm ngoài — kể cả sau khi hàm ngoài đã chạy xong. Gói đó gọi là <strong>closure</strong>. Bạn đã dùng closure hàng chục lần rồi; bài này chỉ đặt tên cho nó.</p>

<h3>Ví dụ nhỏ nhất cho thấy điều đó</h3>
<pre><code>function taoBoDem() {
  let dem = 0;                // sống trong phạm vi của taoBoDem
  return function () {
    dem = dem + 1;            // vẫn với tới được, dù taoBoDem đã return
    return dem;
  };
}

const tiep = taoBoDem();
tiep();   // 1
tiep();   // 2
tiep();   // 3
// KHÔNG với tới dem từ bên ngoài — không có cách nào đặt nó thành 100</code></pre>
<p><code>taoBoDem</code> chạy xong từ lâu. Bình thường biến cục bộ của nó phải biến mất. Nhưng không, vì hàm được trả về vẫn tham chiếu tới <code>dem</code>, nên JavaScript giữ biến đó sống chừng nào hàm còn tồn tại.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Nó cho bạn gì</span><span class="v">State riêng tư. <code>dem</code> không đọc/ghi được từ ngoài — chỉ qua đúng cái hàm bạn trả về.</span></div>
  <div class="kv"><span class="k">Nó tốn gì</span><span class="v">Bộ nhớ. Biến không được giải phóng chừng nào closure còn sống. Chỉ đáng lo khi bạn tạo hàng nghìn cái.</span></div>
</div>

<h3>Hai closure KHÔNG dùng chung state</h3>
<pre><code>const a = taoBoDem();
const b = taoBoDem();
a(); a(); a();   // 3
b();             // 1  — b có dem RIÊNG của nó</code></pre>
<p class="note-ct">Đây đúng là lý do hai component <code>&lt;Counter /&gt;</code> trong React giữ hai con số riêng. Cùng một cơ chế, khác cái vỏ.</p>

<h3>Cái bẫy phỏng vấn kinh điển</h3>
<pre><code>// Với var — cả ba đều in ra 3
for (var i = 0; i &lt; 3; i++) {
  setTimeout(() =&gt; console.log(i), 0);
}
// 3, 3, 3   — chỉ có MỘT i, và tới lúc hẹn giờ chạy thì i đã là 3

// Với let — in ra 0, 1, 2
for (let i = 0; i &lt; 3; i++) {
  setTimeout(() =&gt; console.log(i), 0);
}
// 0, 1, 2   — let tạo một i MỚI cho mỗi vòng lặp</code></pre>
<p>Riêng ví dụ này là lý do <code>let</code> thay thế <code>var</code>. Không phải chuyện phong cách — nó đổi kết quả chương trình.</p>

<h3>Hàm sinh ra hàm</h3>
<pre><code>function nhanVoi(heSo) {
  return (n) =&gt; n * heSo;      // heSo bị "bắt giữ"
}
const gap2 = nhanVoi(2);
const gap3 = nhanVoi(3);
gap2(5);   // 10
gap3(5);   // 15</code></pre>

<div class="pitfall"><strong>Bẫy:</strong> closure bắt giữ <em>cái biến</em>, không phải bản chụp giá trị của nó. Biến ngoài đổi về sau thì closure thấy giá trị mới. Đó là lý do vòng lặp <code>var</code> ở trên in ra 3 ba lần, và cũng là nguồn của lỗi "handler của tôi dùng dữ liệu cũ" trong React (cách chữa ở đó là dạng hàm: <code>setCount(c =&gt; c + 1)</code>).</div>

<div class="link-card"><a href="https://javascript.info/closure" target="_blank" rel="noopener">javascript.info — Phạm vi biến và closure (có bài tập)</a></div>
</div>
`,
    },

    {
      title: '11.2 — this: four rules that explain everything|||11.2 — this: bốn luật giải thích tất cả',
      slug: 'wf-11-2-this',
      type: 'DOCUMENT',
      description: 'Vì sao this lúc đúng lúc sai, bốn luật quyết định giá trị của nó, và vì sao arrow function không có this của riêng mình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2><code>this</code> is decided by HOW a function is called, not where it is written</h2>
<p class="lead">This one sentence explains almost every confusing <code>this</code> bug. The same function can have four different <code>this</code> values depending on the call.</p>

<h3>The four rules, in priority order</h3>
<pre><code>// 1. new binding — this = the newly created object
function Person(name) { this.name = name; }
const p = new Person('Lan');      // this === p

// 2. explicit binding — you choose it
function hi() { return this.name; }
hi.call({ name: 'An' });          // "An"
hi.apply({ name: 'An' });         // "An"  (same, args as array)
const bound = hi.bind({ name: 'Bình' });
bound();                          // "Bình"  — locked forever

// 3. method call — this = the object BEFORE the dot
const user = { name: 'Chi', greet() { return this.name; } };
user.greet();                     // "Chi"

// 4. plain call — this = undefined (strict) or globalThis (sloppy)
const fn = user.greet;
fn();
// In a module or "use strict":  TypeError: Cannot read properties of undefined
// In a plain script (sloppy):   undefined  — this is globalThis, which has no name
// Both verified by running it. Modules are strict by default, so in any modern
// project you get the TypeError — which is the better outcome: it tells you.</code></pre>

<div class="pitfall"><strong>Rule 4 is where people lose hours.</strong> Pulling a method out of its object breaks it: <code>const g = user.greet</code> then <code>g()</code> loses <code>this</code>. Passing a method as a callback does the same thing — <code>setTimeout(user.greet, 100)</code> is a detached call.</div>

<h3>Arrow functions do not have their own <code>this</code></h3>
<pre><code>const timer = {
  count: 0,
  startBroken() {
    setInterval(function () {
      this.count++;        // ❌ this is NOT timer here
    }, 1000);
  },
  startFixed() {
    setInterval(() =&gt; {
      this.count++;        // ✅ arrow borrows this from startFixed
    }, 1000);
  },
};</code></pre>
<p>An arrow function takes <code>this</code> from the scope where it was <em>written</em>. That is why arrows are the default for callbacks — and also why you must never use an arrow for an object method that needs <code>this</code>.</p>

<h3>The one-line summary</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Regular function</span><span class="v"><code>this</code> depends on the call site. Flexible, and easy to break.</span></div>
  <div class="kv"><span class="k">Arrow function</span><span class="v"><code>this</code> is fixed at write time. Predictable, and wrong for methods.</span></div>
</div>
<p class="note-ct">Modern React function components avoid <code>this</code> entirely — that is one of the reasons hooks replaced class components. You still need to read <code>this</code> because you will meet older code, and because every other language you learn has its own version of this question.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2><code>this</code> do CÁCH GỌI hàm quyết định, không phải nơi viết hàm</h2>
<p class="lead">Riêng câu này giải thích gần như mọi lỗi khó hiểu liên quan tới <code>this</code>. Cùng một hàm có thể cho bốn giá trị <code>this</code> khác nhau tuỳ cách gọi.</p>

<h3>Bốn luật, theo thứ tự ưu tiên</h3>
<pre><code>// 1. new — this = object vừa được tạo
function Person(ten) { this.ten = ten; }
const p = new Person('Lan');      // this === p

// 2. gán thẳng — bạn tự chọn
function hi() { return this.ten; }
hi.call({ ten: 'An' });           // "An"
hi.apply({ ten: 'An' });          // "An"  (giống, tham số dạng mảng)
const daGan = hi.bind({ ten: 'Bình' });
daGan();                          // "Bình"  — khoá vĩnh viễn

// 3. gọi như method — this = object TRƯỚC dấu chấm
const user = { ten: 'Chi', chao() { return this.ten; } };
user.chao();                      // "Chi"

// 4. gọi trơn — this = undefined (strict) hoặc globalThis (sloppy)
const fn = user.chao;
fn();
// Trong module hoặc "use strict":  TypeError: Cannot read properties of undefined
// Trong script thường (sloppy):    undefined — this là globalThis, vốn không có ten
// Cả hai đều đã CHẠY THẬT để kiểm. Module mặc định là strict, nên trong dự án
// hiện đại bạn nhận TypeError — và đó là kết quả TỐT HƠN: ít nhất nó báo cho bạn.</code></pre>

<div class="pitfall"><strong>Luật 4 là chỗ người ta mất hàng giờ.</strong> Lôi một method ra khỏi object là nó hỏng: <code>const g = user.chao</code> rồi <code>g()</code> làm mất <code>this</code>. Truyền method làm callback cũng vậy — <code>setTimeout(user.chao, 100)</code> là một lời gọi đã tách rời.</div>

<h3>Arrow function KHÔNG có <code>this</code> của riêng nó</h3>
<pre><code>const dongHo = {
  dem: 0,
  chayHong() {
    setInterval(function () {
      this.dem++;          // ❌ this ở đây KHÔNG phải dongHo
    }, 1000);
  },
  chayDung() {
    setInterval(() =&gt; {
      this.dem++;          // ✅ arrow mượn this từ chayDung
    }, 1000);
  },
};</code></pre>
<p>Arrow lấy <code>this</code> từ nơi nó được <em>viết ra</em>. Đó là lý do arrow là lựa chọn mặc định cho callback — và cũng là lý do tuyệt đối không dùng arrow cho method của object cần <code>this</code>.</p>

<h3>Tóm một dòng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hàm thường</span><span class="v"><code>this</code> tuỳ chỗ gọi. Linh hoạt, và dễ hỏng.</span></div>
  <div class="kv"><span class="k">Arrow function</span><span class="v"><code>this</code> cố định ngay lúc viết. Đoán được, và sai nếu dùng làm method.</span></div>
</div>
<p class="note-ct">Component hàm của React hiện đại tránh <code>this</code> hoàn toàn — đó là một trong những lý do hooks thay thế class component. Vẫn cần đọc hiểu <code>this</code> vì bạn sẽ gặp mã cũ, và vì mọi ngôn ngữ khác đều có phiên bản riêng của câu hỏi này.</p>
</div>
`,
    },

    {
      title: '11.3 — Prototype and class: how objects inherit|||11.3 — Prototype và class: object kế thừa thế nào',
      slug: 'wf-11-3-prototype-class',
      type: 'DOCUMENT',
      description: 'Chuỗi prototype là gì, class chỉ là lớp vỏ đường cho nó, và cách đọc mã kế thừa của người khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Every object has a hidden link to another object</h2>
<p class="lead">JavaScript does not copy methods into each object. Instead every object holds a link — its <strong>prototype</strong> — to another object, and missing properties are looked up along that chain. Understanding the chain explains why <code>[].map</code> works even though you never defined it.</p>

<h3>The lookup chain</h3>
<pre><code>const arr = [1, 2, 3];
arr.map(...)
// 1. Does arr itself have "map"?          no
// 2. Does Array.prototype have "map"?     YES → use it
// 3. (otherwise Object.prototype, then null → undefined)

Object.getPrototypeOf(arr) === Array.prototype;          // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true</code></pre>

<h3>class is sugar over the same machinery</h3>
<pre><code>class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
  static create(name) { return new Animal(name); }   // called on the class
}

class Dog extends Animal {
  speak() { return this.name + ' barks'; }           // overrides
  speakBoth() { return super.speak() + ' and barks'; }
}

const d = new Dog('Rex');
d.speak();                 // "Rex barks"
d instanceof Animal;       // true — Dog.prototype links to Animal.prototype</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">constructor</span><span class="v">Runs on <code>new</code>. Sets up the instance's own data.</span></div>
  <div class="kv"><span class="k">method</span><span class="v">Lives on the prototype — shared by every instance, defined once.</span></div>
  <div class="kv"><span class="k">static</span><span class="v">Lives on the class itself, not on instances.</span></div>
  <div class="kv"><span class="k">#private</span><span class="v"><code>#count</code> is genuinely private — unreachable from outside, unlike an underscore convention.</span></div>
</div>

<div class="pitfall"><strong>Do not extend built-in prototypes.</strong> <code>Array.prototype.last = ...</code> looks clever and breaks the whole page: every array everywhere gets the property, <code>for...in</code> starts seeing it, and two libraries doing this with different behaviour will fight. Write a plain function instead.</div>

<p class="note-ct">You will meet classes in older React code (<code>class App extends React.Component</code>), in Node libraries, and in every error you throw (<code>class AppError extends Error</code>). Reading them is the goal; you rarely need to design deep hierarchies yourself.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Mọi object đều có một đường dẫn ngầm tới một object khác</h2>
<p class="lead">JavaScript không chép method vào từng object. Thay vào đó mỗi object giữ một đường dẫn — <strong>prototype</strong> của nó — tới một object khác, và thuộc tính không có sẵn thì được tìm dọc theo chuỗi đó. Hiểu chuỗi này là hiểu vì sao <code>[].map</code> chạy được dù bạn chưa định nghĩa nó bao giờ.</p>

<h3>Chuỗi tra cứu</h3>
<pre><code>const arr = [1, 2, 3];
arr.map(...)
// 1. Bản thân arr có "map" không?          không
// 2. Array.prototype có "map" không?        CÓ → dùng
// 3. (nếu không thì Object.prototype, rồi null → undefined)

Object.getPrototypeOf(arr) === Array.prototype;          // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true</code></pre>

<h3>class chỉ là lớp vỏ đường của đúng cơ chế đó</h3>
<pre><code>class DongVat {
  constructor(ten) { this.ten = ten; }
  keu() { return this.ten + ' phát ra tiếng'; }
  static tao(ten) { return new DongVat(ten); }   // gọi trên CLASS
}

class Cho extends DongVat {
  keu() { return this.ten + ' sủa'; }            // ghi đè
  keuCaHai() { return super.keu() + ' và sủa'; }
}

const d = new Cho('Rex');
d.keu();                 // "Rex sủa"
d instanceof DongVat;    // true — Cho.prototype nối tới DongVat.prototype</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">constructor</span><span class="v">Chạy khi <code>new</code>. Dựng dữ liệu riêng của từng thực thể.</span></div>
  <div class="kv"><span class="k">method</span><span class="v">Nằm trên prototype — mọi thực thể dùng chung, chỉ định nghĩa một lần.</span></div>
  <div class="kv"><span class="k">static</span><span class="v">Nằm trên chính class, không nằm trên thực thể.</span></div>
  <div class="kv"><span class="k">#private</span><span class="v"><code>#dem</code> riêng tư THẬT — không với tới từ ngoài, khác hẳn quy ước gạch dưới.</span></div>
</div>

<div class="pitfall"><strong>Đừng mở rộng prototype có sẵn.</strong> <code>Array.prototype.cuoi = ...</code> trông thông minh nhưng phá cả trang: mọi mảng ở mọi nơi đều mọc thêm thuộc tính đó, <code>for...in</code> bắt đầu nhìn thấy nó, và hai thư viện cùng làm vậy với hành vi khác nhau sẽ đánh nhau. Viết một hàm thường là xong.</div>

<p class="note-ct">Bạn sẽ gặp class trong mã React cũ (<code>class App extends React.Component</code>), trong thư viện Node, và trong mọi lỗi bạn tự ném ra (<code>class AppError extends Error</code>). Mục tiêu là ĐỌC HIỂU; hiếm khi bạn cần tự thiết kế cây kế thừa sâu.</p>
</div>
`,
    },

    {
      title: '11.4 — Map, Set and immutability|||11.4 — Map, Set và tư duy bất biến',
      slug: 'wf-11-4-map-set-immutable',
      type: 'DOCUMENT',
      description: 'Khi nào Map tốt hơn object, Set để khử trùng lặp, và vì sao "không sửa dữ liệu cũ" là luật sống còn trong React.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Two collections you should reach for, and one habit that prevents bugs</h2>

<h3>Map — a dictionary with real keys</h3>
<pre><code>const m = new Map();
m.set('a', 1);
m.set(42, 'number key');       // keys can be ANY type, not just strings
m.set({ id: 1 }, 'object key');

m.get('a');        // 1
m.has(42);         // true
m.size;            // 3
m.delete('a');

for (const [k, v] of m) console.log(k, v);   // insertion order guaranteed</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Use Map when</span><span class="v">Keys are not strings, you add/remove often, or you need <code>.size</code> and a guaranteed order.</span></div>
  <div class="kv"><span class="k">Use a plain object when</span><span class="v">The shape is fixed and known — a config, a record, anything you would write as JSON.</span></div>
</div>

<h3>Set — values with no duplicates</h3>
<pre><code>const s = new Set([1, 2, 2, 3, 3, 3]);
s.size;                    // 3
s.has(2);                  // true

// The idiom you will actually use:
const unique = [...new Set(arr)];       // remove duplicates from an array</code></pre>

<h3>Immutability — do not edit, replace</h3>
<pre><code>// ❌ mutating
const arr = [1, 2, 3];
arr.push(4);               // changes the SAME array
obj.name = 'new';          // changes the SAME object

// ✅ replacing
const arr2 = [...arr, 4];              // new array
const obj2 = { ...obj, name: 'new' };  // new object

// Array methods that MUTATE:  push pop shift unshift splice sort reverse
// Array methods that RETURN NEW:  map filter slice concat  (and toSorted, toReversed)</code></pre>
<p class="note-ct"><strong>Why this matters more than it looks.</strong> React decides whether to re-render by comparing the old value with the new one. If you mutate an array in state, the old and new references are the <em>same object</em>, React sees no change, and the screen does not update — with no error to tell you why. "I updated the data but nothing happened" is almost always this.</p>

<div class="pitfall"><strong>Spread is shallow.</strong> <code>{ ...user }</code> copies the top level only; <code>copy.address</code> and <code>user.address</code> still point at the same nested object, so editing one edits both. For nested data, copy each level you change: <code>{ ...user, address: { ...user.address, city } }</code>, or use <code>structuredClone(user)</code> for a full deep copy.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Hai kiểu tập hợp nên dùng, và một thói quen chặn được cả loạt lỗi</h2>

<h3>Map — từ điển với khoá thật</h3>
<pre><code>const m = new Map();
m.set('a', 1);
m.set(42, 'khoá là số');        // khoá là KIỂU GÌ cũng được, không chỉ chuỗi
m.set({ id: 1 }, 'khoá là object');

m.get('a');        // 1
m.has(42);         // true
m.size;            // 3
m.delete('a');

for (const [k, v] of m) console.log(k, v);   // đúng thứ tự thêm vào</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng Map khi</span><span class="v">Khoá không phải chuỗi, thêm/xoá liên tục, hoặc cần <code>.size</code> và thứ tự bảo đảm.</span></div>
  <div class="kv"><span class="k">Dùng object thường khi</span><span class="v">Hình dáng cố định và biết trước — một cấu hình, một bản ghi, thứ gì viết được thành JSON.</span></div>
</div>

<h3>Set — tập giá trị không trùng</h3>
<pre><code>const s = new Set([1, 2, 2, 3, 3, 3]);
s.size;                    // 3
s.has(2);                  // true

// Cách dùng bạn sẽ gặp nhiều nhất:
const khongTrung = [...new Set(arr)];    // khử trùng lặp trong mảng</code></pre>

<h3>Bất biến — đừng sửa, hãy thay</h3>
<pre><code>// ❌ sửa tại chỗ
const arr = [1, 2, 3];
arr.push(4);               // đổi CHÍNH mảng đó
obj.ten = 'mới';           // đổi CHÍNH object đó

// ✅ thay bằng cái mới
const arr2 = [...arr, 4];             // mảng mới
const obj2 = { ...obj, ten: 'mới' };  // object mới

// Method mảng SỬA tại chỗ:  push pop shift unshift splice sort reverse
// Method mảng TRẢ CÁI MỚI:  map filter slice concat  (và toSorted, toReversed)</code></pre>
<p class="note-ct"><strong>Vì sao điều này quan trọng hơn vẻ ngoài của nó.</strong> React quyết định có vẽ lại hay không bằng cách SO SÁNH giá trị cũ với giá trị mới. Nếu bạn sửa tại chỗ một mảng đang nằm trong state, tham chiếu cũ và mới là <em>cùng một object</em>, React thấy không có gì đổi, và màn hình đứng im — không có lỗi nào báo cho bạn biết vì sao. Câu "em cập nhật dữ liệu rồi mà không thấy gì" gần như luôn là chuyện này.</p>

<div class="pitfall"><strong>Spread chỉ chép NÔNG.</strong> <code>{ ...user }</code> chỉ chép tầng trên cùng; <code>copy.diaChi</code> và <code>user.diaChi</code> vẫn trỏ chung một object con, nên sửa cái này là sửa luôn cái kia. Với dữ liệu lồng nhau, chép từng tầng bạn đụng tới: <code>{ ...user, diaChi: { ...user.diaChi, thanhPho } }</code>, hoặc dùng <code>structuredClone(user)</code> để chép sâu hoàn toàn.</div>
</div>
`,
    },

    {
      title: '11.5 — Regular expressions, just enough|||11.5 — Biểu thức chính quy, vừa đủ dùng',
      slug: 'wf-11-5-regex',
      type: 'DOCUMENT',
      description: 'Bảy ký hiệu regex chiếm 90% nhu cầu thực tế, cách dùng với JavaScript, và vì sao đừng tự viết regex kiểm email.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>A regular expression is a pattern for finding text</h2>
<p class="lead">Regex has a reputation for being unreadable, and long ones are. But you only need a small part of it, and that part pays for itself the first time you validate a form or clean up user input.</p>

<h3>The symbols worth memorising</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">\\d \\w \\s</span><span class="v">A digit · a word character (letter, digit, _) · a whitespace</span></div>
  <div class="kv"><span class="k">. </span><span class="v">Any single character</span></div>
  <div class="kv"><span class="k">+ * ?</span><span class="v">One or more · zero or more · zero or one</span></div>
  <div class="kv"><span class="k">^ $</span><span class="v">Start of string · end of string</span></div>
  <div class="kv"><span class="k">[abc] [^abc]</span><span class="v">Any of these · none of these</span></div>
  <div class="kv"><span class="k">( )</span><span class="v">A capture group — the part you want to pull out</span></div>
  <div class="kv"><span class="k">{2,4}</span><span class="v">Between 2 and 4 repetitions</span></div>
</div>

<h3>Using it in JavaScript</h3>
<pre><code>const re = /^\\d{10}$/;           // exactly ten digits, nothing else
re.test('0912345678');           // true
re.test('09123');                // false

'a1b2c3'.replace(/\\d/g, '#');    // "a#b#c#"   — g = replace ALL
'2026-09-19'.split(/-/);         // ['2026','09','19']

const m = '2026-09-19'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
m[1];  // "2026"   ← capture groups start at index 1

// Flags: g = global, i = ignore case, m = multiline
/hello/i.test('HELLO');          // true</code></pre>

<h3>Three patterns you will actually reuse</h3>
<pre><code>const slug   = /^[a-z0-9-]+$/;              // url-friendly text
const phone  = /^0\\d{9}$/;                  // Vietnamese mobile, simple form
const spaces = /\\s+/g;                      // collapse runs of whitespace
'  nhiều   khoảng  trắng '.trim().replace(spaces, ' ');</code></pre>

<div class="pitfall"><strong>Do not write your own email regex.</strong> The "complete" one is hundreds of characters long, still rejects valid addresses, and gives you nothing. Use a minimal shape check — <code>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/</code> — and then prove the address is real by sending a confirmation email. That is what every serious system does.</div>

<p class="note-ct"><strong>Debug regex visually.</strong> Paste your pattern into <em>regex101.com</em>: it explains each token in plain English and highlights what matches as you type. Guessing at a regex in your editor is slow; watching it match is fast.</p>
<div class="link-card"><a href="https://regex101.com" target="_blank" rel="noopener">regex101.com — build and explain patterns interactively</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Biểu thức chính quy là một khuôn mẫu để tìm chữ</h2>
<p class="lead">Regex nổi tiếng là khó đọc, và mấy cái dài thì đúng vậy thật. Nhưng bạn chỉ cần một phần nhỏ của nó, và phần nhỏ đó hoàn vốn ngay lần đầu bạn kiểm tra một biểu mẫu hoặc dọn dữ liệu người dùng nhập.</p>

<h3>Những ký hiệu đáng thuộc</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">\\d \\w \\s</span><span class="v">Một chữ số · một ký tự từ (chữ, số, _) · một khoảng trắng</span></div>
  <div class="kv"><span class="k">. </span><span class="v">Một ký tự bất kỳ</span></div>
  <div class="kv"><span class="k">+ * ?</span><span class="v">Một hoặc nhiều · không hoặc nhiều · không hoặc một</span></div>
  <div class="kv"><span class="k">^ $</span><span class="v">Đầu chuỗi · cuối chuỗi</span></div>
  <div class="kv"><span class="k">[abc] [^abc]</span><span class="v">Một trong các ký tự này · không phải các ký tự này</span></div>
  <div class="kv"><span class="k">( )</span><span class="v">Nhóm bắt — phần bạn muốn lấy ra</span></div>
  <div class="kv"><span class="k">{2,4}</span><span class="v">Lặp từ 2 tới 4 lần</span></div>
</div>

<h3>Dùng trong JavaScript</h3>
<pre><code>const re = /^\\d{10}$/;           // đúng mười chữ số, không gì khác
re.test('0912345678');           // true
re.test('09123');                // false

'a1b2c3'.replace(/\\d/g, '#');    // "a#b#c#"   — g = thay TẤT CẢ
'2026-09-19'.split(/-/);         // ['2026','09','19']

const m = '2026-09-19'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
m[1];  // "2026"   ← nhóm bắt đánh số từ 1

// Cờ: g = toàn cục, i = không phân biệt hoa thường, m = nhiều dòng
/hello/i.test('HELLO');          // true</code></pre>

<h3>Ba mẫu bạn sẽ dùng lại thật</h3>
<pre><code>const slug   = /^[a-z0-9-]+$/;              // chữ hợp cho URL
const dienThoai = /^0\\d{9}$/;               // số di động Việt Nam, dạng đơn giản
const khoangTrang = /\\s+/g;                 // gộp nhiều khoảng trắng liền
'  nhiều   khoảng  trắng '.trim().replace(khoangTrang, ' ');</code></pre>

<div class="pitfall"><strong>Đừng tự viết regex kiểm email.</strong> Cái "đầy đủ" dài hàng trăm ký tự, vẫn loại nhầm địa chỉ hợp lệ, và chẳng đem lại gì. Dùng một phép kiểm hình dáng tối thiểu — <code>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/</code> — rồi chứng minh địa chỉ có thật bằng cách gửi email xác nhận. Mọi hệ thống nghiêm túc đều làm vậy.</div>

<p class="note-ct"><strong>Gỡ regex bằng mắt.</strong> Dán mẫu của bạn vào <em>regex101.com</em>: nó giải thích từng ký hiệu bằng tiếng Anh dễ hiểu và tô sáng phần khớp ngay khi bạn gõ. Ngồi đoán regex trong editor thì chậm; nhìn nó khớp thì nhanh.</p>
<div class="link-card"><a href="https://regex101.com" target="_blank" rel="noopener">regex101.com — dựng và giải thích mẫu regex ngay trên trình duyệt</a></div>
</div>
`,
    },

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
