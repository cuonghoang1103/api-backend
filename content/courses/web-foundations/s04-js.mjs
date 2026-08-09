/**
 * Web Foundations — Chương 4: JavaScript nền tảng (biến, kiểu, điều kiện, vòng lặp,
 * hàm, mảng/đối tượng, DOM). Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 * Mọi câu "in ra gì" đã CHẠY THẬT bằng node để lấy đáp án. Quiz có field content.
 */

export default {
  title: 'Chapter 4 — JavaScript fundamentals|||Chương 4 — JavaScript nền tảng',
  description: 'HTML là cấu trúc, CSS là vẻ ngoài, còn JavaScript là hành vi: nó khiến trang phản ứng, tính toán, đổi nội dung theo thời gian thực. Học biến và kiểu dữ liệu, điều kiện và vòng lặp, hàm, mảng và đối tượng, rồi dùng DOM để biến HTML tĩnh thành trang tương tác — nền cho cả Node.js lẫn React.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Variables and data types|||4.1 — Biến và kiểu dữ liệu',
      slug: 'wf-4-1-variables-types',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/DHjqpvDnNGE', durationSeconds: 0 },
      description: 'let và const, các kiểu cơ bản (string, number, boolean, null, undefined), typeof, và template literals — cách JavaScript lưu và gắn tên cho dữ liệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>A variable is a labelled box that holds a value</h2>
<p class="lead">JavaScript is the language that makes web pages <em>do</em> things. The first skill is storing data: a <strong>variable</strong> gives a name to a value so you can use and change it later. Everything else builds on this.</p>

<h3>Declaring variables: const first, let when it changes</h3>
<pre><code>const name = "Lan";      // a value that will not be reassigned
let score = 0;           // a value you intend to change
score = score + 10;      // now 10

// const does NOT mean frozen — it means the name cannot be re-pointed:
const total = 5;
// total = 6;            // ❌ TypeError: Assignment to constant variable</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">const</span><span class="v">Default choice. The name cannot be reassigned. Use it unless you know it must change.</span></div>
  <div class="kv"><span class="k">let</span><span class="v">For a value that will be reassigned (a counter, a running total).</span></div>
  <div class="kv"><span class="k">var</span><span class="v">The old way. Avoid in new code — it has confusing scope rules let/const fixed.</span></div>
</div>

<h3>The data types you will meet first</h3>
<pre><code>const text    = "Hello";      // string  — text, in quotes
const age     = 25;           // number  — integers and decimals, one type
const isOpen  = true;         // boolean — true or false
const nothing = null;         // null    — an intentional "no value"
let notSet;                   // undefined — declared but no value yet
console.log(typeof text);     // "string"  — typeof tells you the type</code></pre>
<p>Unlike many languages, JavaScript has a <strong>single number type</strong> — no separate int and float. And a variable can even change type (though it is cleaner not to).</p>

<h3>Working with strings</h3>
<pre><code>const first = "Nguyen";
const last  = "Lan";
const full  = first + " " + last;   // "Nguyen Lan"  — + joins strings

// Template literals: backticks let you embed values with \${ }
const name2 = "Lan";
const hi = &#96;Hello, \${name2}!&#96;;      // "Hello, Lan!"
console.log(hi.length);             // 11  — strings know their length</code></pre>
<p class="pitfall"><strong>+ is overloaded, and it surprises beginners.</strong> With numbers it adds; with a string on either side it joins as text. So <code>2 + 2 + "1"</code> is <code>"41"</code> — the first <code>2 + 2</code> is <code>4</code>, then <code>4 + "1"</code> becomes the string <code>"41"</code>. Watch the types.</p>

<p class="note-ct"><strong>Try it now:</strong> open your browser, press F12, click the <strong>Console</strong> tab, and type these lines one by one. The console is a live JavaScript playground — the fastest way to build intuition.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Một biến là cái hộp có dán nhãn, giữ một giá trị</h2>
<p class="lead">JavaScript là ngôn ngữ khiến trang web <em>làm</em> được việc. Kỹ năng đầu tiên là lưu dữ liệu: một <strong>biến (variable)</strong> đặt tên cho một giá trị để bạn dùng và đổi nó về sau. Mọi thứ khác đều dựng trên điều này.</p>

<h3>Khai báo biến: const trước, let khi cần đổi</h3>
<pre><code>const name = "Lan";      // một giá trị sẽ không bị gán lại
let score = 0;           // một giá trị bạn định thay đổi
score = score + 10;      // giờ là 10

// const KHÔNG có nghĩa là đóng băng — nghĩa là cái tên không trỏ lại được:
const total = 5;
// total = 6;            // ❌ TypeError: gán vào hằng số</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">const</span><span class="v">Lựa chọn mặc định. Tên không gán lại được. Dùng nó trừ khi biết chắc phải đổi.</span></div>
  <div class="kv"><span class="k">let</span><span class="v">Cho giá trị sẽ bị gán lại (một bộ đếm, một tổng đang chạy).</span></div>
  <div class="kv"><span class="k">var</span><span class="v">Cách cũ. Tránh trong code mới — nó có luật phạm vi khó hiểu mà let/const đã sửa.</span></div>
</div>

<h3>Các kiểu dữ liệu bạn gặp đầu tiên</h3>
<pre><code>const text    = "Hello";      // string  — chữ, trong dấu nháy
const age     = 25;           // number  — số nguyên và số thập phân, chung một kiểu
const isOpen  = true;         // boolean — true hoặc false
const nothing = null;         // null    — cố ý "không có giá trị"
let notSet;                   // undefined — đã khai báo nhưng chưa có giá trị
console.log(typeof text);     // "string"  — typeof cho biết kiểu</code></pre>
<p>Khác nhiều ngôn ngữ, JavaScript chỉ có <strong>một kiểu số duy nhất</strong> — không tách int và float riêng. Và một biến thậm chí có thể đổi kiểu (dù giữ nguyên kiểu thì sạch hơn).</p>

<h3>Làm việc với chuỗi (string)</h3>
<pre><code>const first = "Nguyen";
const last  = "Lan";
const full  = first + " " + last;   // "Nguyen Lan"  — dấu + nối chuỗi

// Template literal: dấu huyền cho phép nhúng giá trị bằng \${ }
const name2 = "Lan";
const hi = &#96;Hello, \${name2}!&#96;;      // "Hello, Lan!"
console.log(hi.length);             // 11  — chuỗi biết độ dài của mình</code></pre>
<p class="pitfall"><strong>Dấu + mang hai vai, và làm người mới bất ngờ.</strong> Với số thì cộng; với một chuỗi ở bất kỳ bên nào thì nối thành chữ. Nên <code>2 + 2 + "1"</code> ra <code>"41"</code> — <code>2 + 2</code> trước là <code>4</code>, rồi <code>4 + "1"</code> thành chuỗi <code>"41"</code>. Để ý kiểu.</p>

<p class="note-ct"><strong>Thử ngay:</strong> mở trình duyệt, bấm F12, chọn thẻ <strong>Console</strong>, gõ từng dòng trên. Console là một sân chơi JavaScript trực tiếp — cách nhanh nhất để xây trực giác.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Operators, conditions and loops|||4.2 — Toán tử, điều kiện và vòng lặp',
      slug: 'wf-4-2-conditions-loops',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/Zg4-uSjxosE', durationSeconds: 0 },
      description: 'So sánh === vs ==, toán tử logic, if/else if/else, switch, toán tử ba ngôi, và vòng lặp for/while/for...of — cách chương trình ra quyết định và lặp lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Programs make decisions and repeat work</h2>
<p class="lead">Storing data is not enough — code needs to branch ("if logged in, show the dashboard") and repeat ("for each product, print a row"). Conditions and loops are how logic actually happens.</p>

<h3>Comparison — and the === rule that saves you bugs</h3>
<pre><code>5 &gt; 3          // true
5 === 5        // true   — strict equality: same value AND same type
"5" === 5      // false  — different types (string vs number)
"5" == 5       // true   — loose equality converts types first (avoid!)
5 !== 6        // true   — strict "not equal"</code></pre>
<p class="pitfall"><strong>Always use === and !==, never == and !=.</strong> Loose equality silently converts types, giving surprises like <code>"5" == 5</code> being <code>true</code> and <code>0 == ""</code> being <code>true</code>. Strict equality compares value <em>and</em> type — predictable. Make it a habit from day one.</p>

<h3>Logical operators</h3>
<pre><code>const age = 20;
age &gt;= 18 &amp;&amp; age &lt; 65    // AND: both must be true  → true
isWeekend || isHoliday   // OR: at least one true
!isOpen                  // NOT: flips true/false</code></pre>

<h3>if / else if / else</h3>
<pre><code>const score = 72;
if (score &gt;= 80) {
  console.log("Distinction");
} else if (score &gt;= 50) {
  console.log("Pass");        // this runs
} else {
  console.log("Retake");
}</code></pre>
<p>For a quick either/or, the <strong>ternary operator</strong> is a one-line if/else:</p>
<pre><code>const status = age &gt;= 18 ? "adult" : "minor";</code></pre>

<h3>Loops — repeat without copy-paste</h3>
<pre><code>// for: when you know how many times
for (let i = 0; i &lt; 3; i++) {
  console.log(i);        // 0, then 1, then 2
}

// while: repeat as long as a condition holds
let n = 3;
while (n &gt; 0) {
  console.log(n);        // 3, 2, 1
  n--;
}

// for...of: the cleanest way to walk through a list
const fruits = ["apple", "pear", "plum"];
for (const fruit of fruits) {
  console.log(fruit);
}</code></pre>
<p class="note-ct"><strong>for...of is your everyday loop.</strong> Once you meet arrays in Lesson 4.4, you will loop over them constantly — reach for <code>for...of</code> when you just need each item, and the classic <code>for</code> when you need the index counter.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Chương trình ra quyết định và lặp lại công việc</h2>
<p class="lead">Lưu dữ liệu thôi chưa đủ — code cần rẽ nhánh ("nếu đã đăng nhập, hiện bảng điều khiển") và lặp ("với mỗi sản phẩm, in một dòng"). Điều kiện và vòng lặp là nơi logic thật sự diễn ra.</p>

<h3>So sánh — và luật === giúp bạn tránh lỗi</h3>
<pre><code>5 &gt; 3          // true
5 === 5        // true   — bằng nghiêm ngặt: cùng giá trị VÀ cùng kiểu
"5" === 5      // false  — khác kiểu (chuỗi vs số)
"5" == 5       // true   — bằng lỏng lẻo chuyển kiểu trước (tránh!)
5 !== 6        // true   — "khác nhau" nghiêm ngặt</code></pre>
<p class="pitfall"><strong>Luôn dùng === và !==, đừng bao giờ == và !=.</strong> Bằng lỏng lẻo âm thầm chuyển kiểu, gây bất ngờ như <code>"5" == 5</code> ra <code>true</code> và <code>0 == ""</code> ra <code>true</code>. Bằng nghiêm ngặt so cả giá trị <em>lẫn</em> kiểu — dễ đoán. Hãy thành thói quen ngay từ ngày đầu.</p>

<h3>Toán tử logic</h3>
<pre><code>const age = 20;
age &gt;= 18 &amp;&amp; age &lt; 65    // VÀ: cả hai phải đúng  → true
isWeekend || isHoliday   // HOẶC: ít nhất một cái đúng
!isOpen                  // KHÔNG: đảo true/false</code></pre>

<h3>if / else if / else</h3>
<pre><code>const score = 72;
if (score &gt;= 80) {
  console.log("Giỏi");
} else if (score &gt;= 50) {
  console.log("Đạt");         // dòng này chạy
} else {
  console.log("Học lại");
}</code></pre>
<p>Cho một lựa chọn nhanh hai nhánh, <strong>toán tử ba ngôi (ternary)</strong> là if/else một dòng:</p>
<pre><code>const status = age &gt;= 18 ? "người lớn" : "trẻ vị thành niên";</code></pre>

<h3>Vòng lặp — lặp mà không sao chép-dán</h3>
<pre><code>// for: khi bạn biết lặp bao nhiêu lần
for (let i = 0; i &lt; 3; i++) {
  console.log(i);        // 0, rồi 1, rồi 2
}

// while: lặp chừng nào điều kiện còn đúng
let n = 3;
while (n &gt; 0) {
  console.log(n);        // 3, 2, 1
  n--;
}

// for...of: cách gọn nhất để đi qua một danh sách
const fruits = ["apple", "pear", "plum"];
for (const fruit of fruits) {
  console.log(fruit);
}</code></pre>
<p class="note-ct"><strong>for...of là vòng lặp hằng ngày của bạn.</strong> Khi gặp mảng ở Bài 4.4, bạn sẽ lặp qua chúng liên tục — dùng <code>for...of</code> khi chỉ cần từng phần tử, và <code>for</code> cổ điển khi cần biến đếm chỉ số.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Functions: reusable blocks of logic|||4.3 — Hàm: khối logic tái dùng',
      slug: 'wf-4-3-functions',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/xUI5Tsl2JpY', durationSeconds: 0 },
      description: 'Khai báo hàm, hàm mũi tên, tham số và giá trị trả về, tham số mặc định, và phạm vi (scope) — cách đóng gói và tái dùng logic.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>A function packages logic so you can reuse it</h2>
<p class="lead">Instead of repeating the same steps, you wrap them in a <strong>function</strong> — give it a name, feed it inputs (parameters), and get back a result (return value). Functions are the building blocks of every program; you will write thousands.</p>

<h3>Declaring and calling</h3>
<pre><code>function add(a, b) {     // a and b are parameters (inputs)
  return a + b;          // return sends a value back
}

const sum = add(2, 3);   // calling it with arguments 2 and 3
console.log(sum);        // 5</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Parameter</span><span class="v">A named input in the function definition (a, b).</span></div>
  <div class="kv"><span class="k">Argument</span><span class="v">The actual value you pass when calling (2, 3).</span></div>
  <div class="kv"><span class="k">return</span><span class="v">Hands a value back to the caller and ends the function. No return → the function gives undefined.</span></div>
</div>

<h3>Arrow functions — the modern short form</h3>
<pre><code>const add = (a, b) =&gt; a + b;         // one expression: auto-returns it
const square = n =&gt; n * n;           // one parameter: parentheses optional
const greet = name =&gt; {              // a block needs an explicit return
  const msg = "Hi " + name;
  return msg;
};</code></pre>
<p>Arrow functions are everywhere in modern JavaScript, especially with array methods (next lesson) and in React. Learn to read both forms — they mean the same thing.</p>

<h3>Default parameters</h3>
<pre><code>function greet(name = "friend") {
  return "Hello, " + name;
}
greet();          // "Hello, friend"  — used the default
greet("Lan");     // "Hello, Lan"</code></pre>

<h3>Scope — where a variable is visible</h3>
<pre><code>const globalMsg = "seen everywhere";

function demo() {
  const localMsg = "only inside demo";
  console.log(globalMsg);   // ✅ works
}
demo();
// console.log(localMsg);   // ❌ ReferenceError — it does not exist out here</code></pre>
<p class="note-ct"><strong>Keep functions small and single-purpose.</strong> A good function does one thing, has a clear name that says what it returns, and does not secretly depend on outside state. This is the single habit that most improves your code as programs grow — and it is exactly how you will structure Express routes and React components later.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Hàm đóng gói logic để bạn tái dùng</h2>
<p class="lead">Thay vì lặp lại cùng các bước, bạn gói chúng trong một <strong>hàm (function)</strong> — đặt tên, đưa vào đầu vào (tham số), và nhận lại kết quả (giá trị trả về). Hàm là viên gạch của mọi chương trình; bạn sẽ viết hàng nghìn cái.</p>

<h3>Khai báo và gọi</h3>
<pre><code>function add(a, b) {     // a và b là tham số (đầu vào)
  return a + b;          // return gửi một giá trị trở lại
}

const sum = add(2, 3);   // gọi nó với đối số 2 và 3
console.log(sum);        // 5</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tham số (parameter)</span><span class="v">Một đầu vào có tên trong định nghĩa hàm (a, b).</span></div>
  <div class="kv"><span class="k">Đối số (argument)</span><span class="v">Giá trị thật bạn truyền khi gọi (2, 3).</span></div>
  <div class="kv"><span class="k">return</span><span class="v">Trả một giá trị về cho nơi gọi và kết thúc hàm. Không return → hàm cho undefined.</span></div>
</div>

<h3>Hàm mũi tên (arrow) — dạng ngắn hiện đại</h3>
<pre><code>const add = (a, b) =&gt; a + b;         // một biểu thức: tự động trả về nó
const square = n =&gt; n * n;           // một tham số: ngoặc tuỳ chọn
const greet = name =&gt; {              // một khối cần return tường minh
  const msg = "Hi " + name;
  return msg;
};</code></pre>
<p>Hàm mũi tên có mặt khắp nơi trong JavaScript hiện đại, nhất là với các phương thức mảng (bài kế) và trong React. Hãy đọc được cả hai dạng — chúng cùng một ý nghĩa.</p>

<h3>Tham số mặc định</h3>
<pre><code>function greet(name = "bạn") {
  return "Hello, " + name;
}
greet();          // "Hello, bạn"  — dùng giá trị mặc định
greet("Lan");     // "Hello, Lan"</code></pre>

<h3>Phạm vi (scope) — nơi một biến nhìn thấy được</h3>
<pre><code>const globalMsg = "thấy ở mọi nơi";

function demo() {
  const localMsg = "chỉ trong demo";
  console.log(globalMsg);   // ✅ chạy được
}
demo();
// console.log(localMsg);   // ❌ ReferenceError — nó không tồn tại ngoài này</code></pre>
<p class="note-ct"><strong>Giữ hàm nhỏ và một mục đích.</strong> Một hàm tốt làm một việc, có tên rõ nói nó trả về gì, và không âm thầm phụ thuộc trạng thái bên ngoài. Đây là thói quen cải thiện code nhiều nhất khi chương trình lớn dần — và đúng là cách bạn sẽ tổ chức route Express và component React về sau.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Arrays and objects|||4.4 — Mảng và đối tượng',
      slug: 'wf-4-4-arrays-objects',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/R8rmfD9Y5-c', durationSeconds: 0 },
      description: 'Mảng và các phương thức map/filter/forEach/reduce; đối tượng, truy cập bằng dấu chấm và ngoặc vuông — hai cấu trúc dữ liệu bạn dùng mỗi ngày.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Arrays hold lists; objects hold labelled properties</h2>
<p class="lead">Almost all real data is a list of things, or a thing with named fields. <strong>Arrays</strong> and <strong>objects</strong> are those two shapes — and the API response from any backend (including your future Node.js server) is exactly arrays of objects.</p>

<h3>Arrays — ordered lists</h3>
<pre><code>const scores = [90, 72, 85];
scores[0];          // 90    — index starts at 0
scores.length;      // 3
scores.push(60);    // add to the end → [90, 72, 85, 60]</code></pre>

<h3>The four array methods you will use forever</h3>
<pre><code>const nums = [1, 2, 3, 4];

nums.forEach(n =&gt; console.log(n));      // do something with each (no new array)
nums.map(n =&gt; n * 2);                   // [2, 4, 6, 8]   — transform each
nums.filter(n =&gt; n % 2 === 0);          // [2, 4]         — keep the ones that pass
nums.reduce((sum, n) =&gt; sum + n, 0);    // 10            — boil down to one value</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">forEach</span><span class="v">Run a function for each item. Returns nothing — use for side effects.</span></div>
  <div class="kv"><span class="k">map</span><span class="v">Build a NEW array by transforming every item. Same length.</span></div>
  <div class="kv"><span class="k">filter</span><span class="v">Build a NEW array of only the items where the test is true.</span></div>
  <div class="kv"><span class="k">reduce</span><span class="v">Combine all items into one value (a sum, a max, a joined string).</span></div>
</div>
<p>These pair perfectly with arrow functions — and they are the exact tools you will use in React to turn a list of data into a list of UI elements.</p>

<h3>Objects — labelled data</h3>
<pre><code>const user = {
  name: "Lan",
  age: 25,
  isAdmin: false,
};

user.name;              // "Lan"        — dot notation
user["age"];            // 25           — bracket notation (needed for dynamic keys)
user.email;             // undefined    — a missing property is not an error
user.city = "Hanoi";    // add a new property</code></pre>

<h3>The shape you will see everywhere: an array of objects</h3>
<pre><code>const users = [
  { name: "Lan", age: 25 },
  { name: "Minh", age: 30 },
];
const names = users.map(u =&gt; u.name);   // ["Lan", "Minh"]</code></pre>
<p class="note-ct"><strong>This is the heart of web data.</strong> A blog is an array of post objects; a chat is an array of message objects. Master <code>map</code>/<code>filter</code> over arrays of objects here, and the Node.js and React courses will feel like using tools you already own.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Mảng giữ danh sách; đối tượng giữ các thuộc tính có nhãn</h2>
<p class="lead">Gần như mọi dữ liệu thật là một danh sách các thứ, hoặc một thứ có các trường có tên. <strong>Mảng (array)</strong> và <strong>đối tượng (object)</strong> là hai hình dạng đó — và phản hồi API từ bất kỳ backend nào (kể cả server Node.js tương lai của bạn) chính là các mảng đối tượng.</p>

<h3>Mảng — danh sách có thứ tự</h3>
<pre><code>const scores = [90, 72, 85];
scores[0];          // 90    — chỉ số bắt đầu từ 0
scores.length;      // 3
scores.push(60);    // thêm vào cuối → [90, 72, 85, 60]</code></pre>

<h3>Bốn phương thức mảng bạn dùng mãi mãi</h3>
<pre><code>const nums = [1, 2, 3, 4];

nums.forEach(n =&gt; console.log(n));      // làm gì đó với từng cái (không tạo mảng mới)
nums.map(n =&gt; n * 2);                   // [2, 4, 6, 8]   — biến đổi từng cái
nums.filter(n =&gt; n % 2 === 0);          // [2, 4]         — giữ những cái thoả điều kiện
nums.reduce((sum, n) =&gt; sum + n, 0);    // 10            — gộp lại thành một giá trị</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">forEach</span><span class="v">Chạy một hàm cho mỗi phần tử. Không trả về gì — dùng cho tác dụng phụ.</span></div>
  <div class="kv"><span class="k">map</span><span class="v">Tạo mảng MỚI bằng cách biến đổi mọi phần tử. Cùng độ dài.</span></div>
  <div class="kv"><span class="k">filter</span><span class="v">Tạo mảng MỚI chỉ gồm phần tử mà phép thử đúng.</span></div>
  <div class="kv"><span class="k">reduce</span><span class="v">Gộp mọi phần tử thành một giá trị (một tổng, một max, một chuỗi nối).</span></div>
</div>
<p>Chúng ghép hoàn hảo với hàm mũi tên — và đúng là công cụ bạn sẽ dùng trong React để biến một danh sách dữ liệu thành một danh sách phần tử giao diện.</p>

<h3>Đối tượng — dữ liệu có nhãn</h3>
<pre><code>const user = {
  name: "Lan",
  age: 25,
  isAdmin: false,
};

user.name;              // "Lan"        — truy cập bằng dấu chấm
user["age"];            // 25           — bằng ngoặc vuông (cần cho khoá động)
user.email;             // undefined    — thuộc tính thiếu không phải lỗi
user.city = "Hanoi";    // thêm một thuộc tính mới</code></pre>

<h3>Hình dạng bạn thấy khắp nơi: một mảng các đối tượng</h3>
<pre><code>const users = [
  { name: "Lan", age: 25 },
  { name: "Minh", age: 30 },
];
const names = users.map(u =&gt; u.name);   // ["Lan", "Minh"]</code></pre>
<p class="note-ct"><strong>Đây là trái tim của dữ liệu web.</strong> Một blog là một mảng các đối tượng bài viết; một cuộc trò chuyện là một mảng các đối tượng tin nhắn. Thạo <code>map</code>/<code>filter</code> trên mảng đối tượng ở đây, thì khoá Node.js và React sẽ như dùng công cụ bạn đã có sẵn.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — The DOM: making HTML interactive|||4.5 — DOM: làm cho HTML tương tác',
      slug: 'wf-4-5-dom-events',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/y17RuWkWdn8', durationSeconds: 0 },
      description: 'querySelector, đọc/đổi textContent và các thuộc tính, addEventListener để bắt sự kiện — cách JavaScript đọc và thay đổi trang đang hiển thị.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>The DOM is your HTML, as objects JavaScript can touch</h2>
<p class="lead">When the browser loads your HTML, it builds a live tree of objects called the <strong>DOM</strong> (Document Object Model). JavaScript reads and changes that tree — and the page updates instantly. This is the moment your static pages come alive.</p>

<h3>Selecting an element</h3>
<pre><code>// querySelector takes any CSS selector (from Chapter 3!)
const title = document.querySelector("h1");
const btn   = document.querySelector("#save");     // by id
const cards = document.querySelectorAll(".card");  // all matches (a list)</code></pre>
<p>Notice you already know the selectors — <code>#save</code>, <code>.card</code> — from CSS. The DOM reuses them.</p>

<h3>Reading and changing content</h3>
<pre><code>const title = document.querySelector("h1");
title.textContent = "Updated!";            // change the text
title.classList.add("highlight");          // add a CSS class
const input = document.querySelector("#name");
console.log(input.value);                   // read what the user typed</code></pre>

<h3>Events — reacting to the user</h3>
<p>An <strong>event</strong> is something that happens: a click, a keypress, a form submit. You attach a function (a "handler") that runs when it fires:</p>
<pre><code>const btn = document.querySelector("#save");

btn.addEventListener("click", () =&gt; {
  console.log("Button clicked!");
});</code></pre>

<h3>Putting it together: a live counter</h3>
<pre><code>&lt;button id="inc"&gt;Add one&lt;/button&gt;
&lt;span id="count"&gt;0&lt;/span&gt;

&lt;script&gt;
  let count = 0;
  const btn = document.querySelector("#inc");
  const out = document.querySelector("#count");

  btn.addEventListener("click", () =&gt; {
    count = count + 1;
    out.textContent = count;   // the page updates on every click
  });
&lt;/script&gt;</code></pre>
<p>Every variable, function, event and DOM idea from this chapter, in twelve lines — a button that actually does something.</p>
<p class="note-ct"><strong>This is the bridge to frameworks.</strong> React exists precisely because updating the DOM by hand gets hard as apps grow — it lets you describe what the UI should look like and updates the DOM for you. But it is DOM updates underneath. Understand this lesson and React stops being magic.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" target="_blank" rel="noopener">MDN — Introduction to the DOM</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>DOM là HTML của bạn, dưới dạng đối tượng mà JavaScript chạm được</h2>
<p class="lead">Khi trình duyệt tải HTML, nó dựng một cây đối tượng sống gọi là <strong>DOM</strong> (Document Object Model — mô hình đối tượng tài liệu). JavaScript đọc và thay đổi cây đó — và trang cập nhật tức thì. Đây là khoảnh khắc trang tĩnh của bạn trở nên sống động.</p>

<h3>Chọn một phần tử</h3>
<pre><code>// querySelector nhận bất kỳ bộ chọn CSS nào (từ Chương 3!)
const title = document.querySelector("h1");
const btn   = document.querySelector("#save");     // theo id
const cards = document.querySelectorAll(".card");  // tất cả cái khớp (một danh sách)</code></pre>
<p>Để ý bạn đã biết các bộ chọn — <code>#save</code>, <code>.card</code> — từ CSS. DOM tái dùng chúng.</p>

<h3>Đọc và đổi nội dung</h3>
<pre><code>const title = document.querySelector("h1");
title.textContent = "Đã cập nhật!";        // đổi chữ
title.classList.add("highlight");          // thêm một class CSS
const input = document.querySelector("#name");
console.log(input.value);                   // đọc thứ người dùng đã gõ</code></pre>

<h3>Sự kiện — phản ứng với người dùng</h3>
<p>Một <strong>sự kiện (event)</strong> là một điều xảy ra: một cú bấm, một phím gõ, một form gửi đi. Bạn gắn một hàm ("bộ xử lý") chạy khi nó kích hoạt:</p>
<pre><code>const btn = document.querySelector("#save");

btn.addEventListener("click", () =&gt; {
  console.log("Đã bấm nút!");
});</code></pre>

<h3>Ghép lại: một bộ đếm sống</h3>
<pre><code>&lt;button id="inc"&gt;Thêm một&lt;/button&gt;
&lt;span id="count"&gt;0&lt;/span&gt;

&lt;script&gt;
  let count = 0;
  const btn = document.querySelector("#inc");
  const out = document.querySelector("#count");

  btn.addEventListener("click", () =&gt; {
    count = count + 1;
    out.textContent = count;   // trang cập nhật sau mỗi cú bấm
  });
&lt;/script&gt;</code></pre>
<p>Mọi ý tưởng về biến, hàm, sự kiện và DOM trong chương này, gói trong mười hai dòng — một cái nút thật sự làm được việc.</p>
<p class="note-ct"><strong>Đây là cây cầu tới các framework.</strong> React ra đời chính vì cập nhật DOM bằng tay trở nên khó khi app lớn lên — nó cho bạn mô tả giao diện nên trông thế nào rồi tự cập nhật DOM giúp bạn. Nhưng bên dưới vẫn là cập nhật DOM. Hiểu bài này thì React hết còn là phép màu.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" target="_blank" rel="noopener">MDN — Giới thiệu về DOM</a></div>
</div>
`,
    },

    /* ─────────────────────────── 4.6 quiz ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra chương 4',
      slug: 'wf-4-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về biến và kiểu, so sánh, vòng lặp, hàm, mảng/đối tượng và DOM — có câu "in ra gì" đã chạy thật.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 4: variables and types, strict equality, loops, functions, array methods, objects, and the DOM. Several ask what a snippet prints — the answers were verified by running the code.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> JavaScript only sticks when you write it. Head to Code Lab and solve real problems — variables, loops, functions and array methods — with instant checks.</p>
<div class="link-card"><a href="/code-lab/javascript">Practice on Code Lab → JavaScript track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 4: biến và kiểu, bằng nghiêm ngặt, vòng lặp, hàm, phương thức mảng, đối tượng, và DOM. Vài câu hỏi một đoạn code in ra gì — đáp án đã được xác minh bằng cách chạy code.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> JavaScript chỉ thấm khi bạn tự viết. Hãy sang Code Lab giải bài thật — biến, vòng lặp, hàm và phương thức mảng — với chấm điểm tức thì.</p>
<div class="link-card"><a href="/code-lab/javascript">Luyện tập ở Code Lab → track JavaScript</a></div></div>
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
