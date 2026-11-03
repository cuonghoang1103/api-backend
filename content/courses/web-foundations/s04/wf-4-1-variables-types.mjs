/**
 * Bài 4.1 — Biến và kiểu dữ liệu (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/4-1).
 * Deck: scripts/slides-src/wf-4-1.mjs (10 slide, WF/v1/wf-4-1). Code Lab: module 4.1 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-4-1', 'Variables and types', 'Biến và kiểu dữ liệu', [
  [1, 'Variables and types',
    '<p>JavaScript is the first real programming language in this course. Every program stores values and works on them, so we start there: how to name a value, which kinds of value exist, and the surprising ways JavaScript converts one kind into another.</p>',
    '<p>JavaScript là ngôn ngữ lập trình thật sự đầu tiên trong khoá. Mọi chương trình đều lưu giá trị và làm việc trên chúng, nên ta bắt đầu từ đó: đặt tên cho một giá trị thế nào, có những loại giá trị nào, và JavaScript đổi loại này sang loại khác theo những cách bất ngờ ra sao.</p>'],
  [2, 'After this lesson you can…',
    '<p>These outcomes protect you from the bugs that fill beginner code: a price that becomes "1020" instead of 30, a comparison that is true for the wrong reason, and two variables that secretly point to the same object. All of them have an exact explanation.</p>',
    '<p>Những kết quả này bảo vệ bạn khỏi các lỗi đầy rẫy trong mã người mới: giá tiền thành "1020" thay vì 30, một phép so sánh đúng vì lý do sai, và hai biến ngầm trỏ vào cùng một đối tượng. Tất cả đều có lời giải thích chính xác.</p>'],
  [3, 'let, const and the end of var',
    '<p>A variable is a named box. Use <code>const</code> by default and <code>let</code> only if the value must change. <code>var</code> is the old keyword: it ignores blocks, as the output shows. Note that <code>const</code> protects the name, not the object inside.</p>',
    '<p>Biến là một cái hộp có tên. Mặc định dùng <code>const</code>, chỉ dùng <code>let</code> khi giá trị cần đổi. <code>var</code> là từ khoá cũ: nó phớt lờ khối, như output cho thấy. Lưu ý <code>const</code> bảo vệ cái tên, không bảo vệ đối tượng bên trong.</p>'],
  [4, 'The types',
    '<p>Seven primitive types plus objects. <code>typeof</code> tells you which you have, and it has one famous lie: <code>typeof null</code> says object. It is a bug from 1995 that can never be fixed, because the web depends on it. For arrays, use <code>Array.isArray</code>.</p>',
    '<p>Bảy kiểu nguyên thuỷ cộng với object. <code>typeof</code> cho biết bạn đang có kiểu gì, và nó có một lời nói dối nổi tiếng: <code>typeof null</code> nói là object. Đó là lỗi từ 1995 không bao giờ sửa được, vì web phụ thuộc vào nó. Với mảng, dùng <code>Array.isArray</code>.</p>'],
  [5, 'Numbers have surprises',
    '<p>All numbers are binary floating point, so 0.1 plus 0.2 is not exactly 0.3. <code>toFixed</code> returns a string. <code>Number</code> is strict and <code>parseInt</code> forgiving. NaN is not equal even to itself. For money, calculate in whole units such as dong or cents.</p>',
    '<p>Mọi số đều là dấu phẩy động nhị phân, nên 0,1 cộng 0,2 không đúng bằng 0,3. <code>toFixed</code> trả về chuỗi. <code>Number</code> nghiêm ngặt còn <code>parseInt</code> dễ dãi. NaN không bằng cả chính nó. Với tiền, hãy tính bằng đơn vị nguyên như đồng hay xu.</p>'],
  [6, 'Strings',
    '<p>Strings are text. Methods return a new string, because strings can never be changed in place: assigning to one letter does nothing at all. Template literals with backticks are how you build text in modern code. Notice that one emoji has length 2.</p>',
    '<p>Chuỗi là chữ. Các phương thức trả về chuỗi mới, vì chuỗi không bao giờ đổi được tại chỗ: gán vào một chữ cái chẳng có tác dụng gì. Template literal với dấu backtick là cách dựng chữ trong mã hiện đại. Để ý một emoji có độ dài 2.</p>'],
  [7, 'Type coercion',
    '<p>Predict each line before reading the output. The plus sign joins text if either side is a string; every other arithmetic operator tries numbers. That is the source of "5" plus 1 being 51. This is why you convert input explicitly with <code>Number</code>.</p>',
    '<p>Hãy đoán từng dòng trước khi đọc output. Dấu cộng nối chữ nếu một trong hai vế là chuỗi; mọi toán tử số học khác đều cố đổi sang số. Đó là lý do "5" cộng 1 ra 51. Vì vậy bạn cần đổi dữ liệu nhập một cách tường minh bằng <code>Number</code>.</p>'],
  [8, '== and truthiness',
    '<p>Double equals converts types first, and gives results nobody can remember. Triple equals compares type and value: always use it. In conditions, only eight values are falsy. An empty array is truthy, so check its length.</p>',
    '<p>Hai dấu bằng đổi kiểu trước, và cho ra những kết quả không ai nhớ nổi. Ba dấu bằng so cả kiểu lẫn giá trị: hãy luôn dùng nó. Trong điều kiện, chỉ có tám giá trị là falsy. Mảng rỗng là truthy, nên hãy kiểm độ dài của nó.</p>'],
  [9, 'Values and references',
    '<p>Primitives are copied. Objects are shared: the variable holds a reference, like two people holding the address of one house. Change the house through one name and the other sees it. Two objects with the same content are still different objects.</p>',
    '<p>Giá trị nguyên thuỷ được sao chép. Object thì dùng chung: biến giữ một tham chiếu, như hai người cùng giữ địa chỉ của một ngôi nhà. Sửa nhà qua tên này thì tên kia cũng thấy. Hai object cùng nội dung vẫn là hai object khác nhau.</p>'],
  [10, 'Summary & practice',
    '<p>The practice writes a small price calculator that reads strings the way a form delivers them. "Done when" includes an exact total, which only comes out right if you convert the types and avoid the floating-point trap.</p>',
    '<p>Bài luyện viết một máy tính giá nhỏ, đọc chuỗi đúng như form trao tới. "Xong khi" gồm một tổng chính xác, chỉ ra đúng nếu bạn đổi kiểu và tránh bẫy dấu phẩy động.</p>'],
]);

export default {
  title: '4.1 — Variables, types, and the console|||4.1 — Biến, kiểu dữ liệu và console',
  slug: 'wf-4-1-variables-types',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/DHjqpvDnNGE', durationSeconds: 0 },
  description: 'let, const và var; các kiểu và typeof; số dấu phẩy động, NaN, toFixed trả chuỗi; chuỗi bất biến và template literal; ép kiểu với dấu + ; == và ===; truthy/falsy; giá trị vs tham chiếu. Mọi output chạy thật trong Chromium, kèm các bẫy người mới.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Naming values, and knowing what kind they are</h2>
<p class="lead">After this lesson you can store values in variables and choose the right keyword, name every JavaScript type, predict what happens when types mix, compare values safely, and explain why changing one variable can change another. You need this because every program in every later chapter is built from these values, and the classic beginner bugs — a total of "1020" instead of 30, a check that passes for the wrong reason — all come from this lesson's rules.</p>

<h3>Where to run this code</h3>
<p>You can try every line right now. Open any page, press <strong>F12</strong>, choose <strong>Console</strong> and type. The Console is a place to experiment: it runs a line and prints the result. For longer code, put a file next to your page with <code>&lt;script src="app.js"&gt;&lt;/script&gt;</code>, or run <code>node app.js</code> in a terminal. <code>console.log</code> prints a value, and is the most-used debugging tool there is.</p>

<h3>Step 1 — variables: <code>let</code>, <code>const</code>, and the end of <code>var</code></h3>
${ma('javascript', CODE['4-1/bien.js'])}
${ra(OUT['4-1/bien'])}
<table>
<thead><tr><th>Keyword</th><th>Can reassign?</th><th>Scope</th><th>Use</th></tr></thead>
<tbody>
<tr><td><code>const</code></td><td>No</td><td>Block</td><td>Your default</td></tr>
<tr><td><code>let</code></td><td>Yes</td><td>Block</td><td>Counters, values that really change</td></tr>
<tr><td><code>var</code></td><td>Yes</td><td>Function</td><td>Do not use. You will still see it in old code</td></tr>
</tbody>
</table>
<p>Start with <code>const</code> everywhere and change to <code>let</code> only when the code needs it. A reader then knows that everything else stays the same. Notice the third output line: <code>const user</code> protects the <em>name</em>; the object it points to can still change. Names in JavaScript are <code>camelCase</code>, case-sensitive, and cannot start with a digit. Name them by meaning: <code>totalPrice</code>, not <code>x</code>.</p>
<p>A word about order. Declarations are found before the code runs, which is called <strong>hoisting</strong>, and each keyword behaves differently:</p>
${ma('javascript', CODE['4-1/truoc-khai-bao.js'])}
${ra(OUT['4-1/truoc-khai-bao'])}
<p><code>var</code> quietly gives you <code>undefined</code>. <code>let</code> gives you a clear error. That is better: a loud error beats a silent wrong value.</p>

<h3>Step 2 — the types</h3>
${ma('javascript', CODE['4-1/kieu.js'])}
${ra(OUT['4-1/kieu'])}
<div class="kv-grid">
  <div class="kv"><span class="k">number</span><span class="v">Integers and decimals share one type.</span></div>
  <div class="kv"><span class="k">string</span><span class="v">Text, in quotes or backticks.</span></div>
  <div class="kv"><span class="k">boolean</span><span class="v"><code>true</code> or <code>false</code>.</span></div>
  <div class="kv"><span class="k">undefined</span><span class="v">No value yet: the variable exists but was never given one.</span></div>
  <div class="kv"><span class="k">null</span><span class="v">Deliberately empty. You choose to write it.</span></div>
  <div class="kv"><span class="k">bigint, symbol</span><span class="v">Huge integers and unique keys. Rare.</span></div>
  <div class="kv"><span class="k">object</span><span class="v">Everything else: objects, arrays, dates, functions.</span></div>
</div>
<p>Look at line 6 of the output: <code>typeof null</code> says <code>object</code>. It is a bug from the first version of JavaScript, in 1995, and can never be fixed, since old sites depend on it. To check for null, write <code>x === null</code>; to check for an array, <code>Array.isArray(x)</code>.</p>

<h3>Step 3 — numbers have surprises</h3>
${ma('javascript', CODE['4-1/so.js'])}
${ra(OUT['4-1/so'])}
<ul>
<li><strong>0.1 + 0.2:</strong> computers store numbers in binary, and 0.1 has no exact binary form, the way 1/3 has no exact decimal form. This happens in almost every language.</li>
<li><strong>toFixed</strong> returns a <em>string</em>: use it for display, not for further maths.</li>
<li><strong>Number</strong> is strict: <code>Number('12px')</code> is <code>NaN</code>. <strong>parseInt</strong> reads what it can and stops. Note that <code>Number('')</code> is 0, not NaN.</li>
<li><strong>NaN</strong> means "not a number", the result of failed maths. It is the only value not equal to itself, so test it with <code>Number.isNaN</code>.</li>
<li>Above <code>MAX_SAFE_INTEGER</code>, adding 1 can do nothing: the output shows the sum unchanged. Very long ids should stay strings.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — calculating money in decimals.</strong> <code>0.1 + 0.2</code> does not equal <code>0.3</code>, and those tiny errors add up in carts and invoices: a comparison fails, or a total is off by one. Calculate in the smallest whole unit (Vietnamese dong has no decimals; for dollars, use cents), and format only for display. Serious systems store money as integers or use a decimal type.</p></div>

<h3>Step 4 — strings</h3>
${ma('javascript', CODE['4-1/chuoi.js'])}
${ra(OUT['4-1/chuoi'])}
<p>Three quote styles exist. Single and double are the same; <strong>backticks</strong> make a <strong>template literal</strong>, which can contain <code>&#36;{expression}</code> and span several lines. Use it instead of chains of <code>+</code>.</p>
<p>Strings are <strong>immutable</strong>: they cannot be changed in place. <code>word[0] = 'b'</code> did nothing, and raised no error. Every method (<code>trim</code>, <code>toUpperCase</code>, <code>replaceAll</code>…) returns a new string, so you must keep the result: <code>name = name.trim();</code>. The last output line shows that <code>length</code> counts code units, so one emoji counts as 2; <code>[...text]</code> counts real characters.</p>

<h3>Step 5 — type coercion</h3>
<p>When an operator gets the "wrong" type, JavaScript quietly converts it. Predict each line before reading the output:</p>
${ma('javascript', CODE['4-1/ep-kieu.js'])}
${ra(OUT['4-1/ep-kieu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">+</span><span class="lz-t">Is either side a string?</span><span class="lz-d">Then join as text: <code>'5' + 1</code> is <code>'51'</code>.</span></div>
<div class="lz-step"><span class="lz-k">− * /</span><span class="lz-t">Always numbers</span><span class="lz-d"><code>'5' - 1</code> is 4; <code>'abc' * 2</code> is <code>NaN</code>.</span></div>
<div class="lz-step"><span class="lz-k">Left to right</span><span class="lz-t">One step at a time</span><span class="lz-d"><code>1 + 2 + '3'</code> is 3 + '3' = <code>'33'</code>, while <code>'1' + 2 + 3</code> is <code>'123'</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — the form value is always a string.</strong> <code>input.value</code> is text, even in <code>type="number"</code>. So <code>a.value + b.value</code> for 10 and 20 gives <code>'1020'</code>. Convert on the way in: <code>Number(a.value) + Number(b.value)</code>, and check for <code>NaN</code>. Do not rely on coercion on purpose: write what you mean.</p></div>

<h3>Step 6 — <code>===</code>, and what counts as true</h3>
<p>The second half of the output above compares <code>==</code> and <code>===</code>. Double equals converts types first, which gives <code>0 == ''</code> and <code>false == '0'</code> as true. <strong>Always use <code>===</code> and <code>!==</code></strong>, which compare without conversion. The one common exception is <code>x == null</code>, which matches both null and undefined.</p>
<p>In an <code>if</code>, every value counts as true or false:</p>
${ma('javascript', CODE['4-1/dung-sai.js'])}
${ra(OUT['4-1/dung-sai'])}
<p>Exactly eight values are <strong>falsy</strong>. Everything else is <strong>truthy</strong>, including <code>'0'</code>, <code>'false'</code>, an empty array and an empty object.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>if (items)</code> on an empty array.</strong> An empty array is truthy, so this block always runs, and your "no results" message never appears. Check <code>items.length</code> instead. The opposite trap: <code>if (count)</code> treats a real value of 0 as missing. When 0 or an empty string are valid, compare explicitly: <code>count !== undefined</code>.</p></div>

<h3>Step 7 — values and references</h3>
${ma('javascript', CODE['4-1/tham-chieu.js'])}
${ra(OUT['4-1/tham-chieu'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Primitive</span><span class="lz-t">the box holds the value</span><span class="lz-d"><code>b = a</code> copies it. Numbers, strings, booleans.</span></div>
<div class="lz-layer"><span class="lz-k">Object</span><span class="lz-t">the box holds an address</span><span class="lz-d"><code>user2 = user1</code> copies the address: two names, one house.</span></div>
</div>
<p>This explains the last two lines: <code>===</code> on objects compares <em>addresses</em>, so two objects with the same content are not equal. It also explains why <code>const user</code> could change: the address stayed the same. Lesson 4.4 and Lesson 11.4 return to this, and React's state rules depend on it.</p>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — a price calculator</strong></p>
<p>Create <code>price.js</code>. Values below are strings, the way a form delivers them:</p>
<pre><code class="language-javascript">const qtyInput = '3';
const priceInput = '19.99';
const discountInput = '';     // the user left it empty</code></pre>
<ol>
<li>Convert the inputs. If the discount is empty, treat it as 0 percent. Check each with <code>Number.isNaN</code>.</li>
<li>Calculate in whole cents: <code>Math.round(Number(priceInput) * 100)</code>.</li>
<li>Print the total with a template literal, as <code>Total: $59.97</code>.</li>
<li>Copy a <code>cart</code> object with spread, and change the copy without changing the original.</li>
</ol>
<p>Hint: <code>Number('')</code> is 0, which is convenient here but dangerous elsewhere. Check with <code>typeof</code> at each step.</p>
<p><strong>Done when:</strong> the program prints exactly <code>Total: $59.97</code> with no long decimals; <code>qtyInput = 'abc'</code> prints a clear error message, not <code>NaN</code>; the original <code>cart</code> is unchanged; and every comparison uses <code>===</code>. Code Lab module 4.1 then grades seven exercises on this.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">variable</span><span class="v">biến — cái hộp có tên.</span></div>
  <div class="kv"><span class="k">const / let / var</span><span class="v">không gán lại / gán lại được / kiểu cũ.</span></div>
  <div class="kv"><span class="k">primitive</span><span class="v">kiểu nguyên thuỷ — giá trị đơn, không đổi được.</span></div>
  <div class="kv"><span class="k">object</span><span class="v">đối tượng — nhóm dữ liệu, được dùng chung qua tham chiếu.</span></div>
  <div class="kv"><span class="k">hoisting</span><span class="v">nâng khai báo — khai báo được tìm trước khi chạy.</span></div>
  <div class="kv"><span class="k">template literal</span><span class="v">chuỗi mẫu — dấu backtick, có nội suy.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">bất biến — không đổi được tại chỗ.</span></div>
  <div class="kv"><span class="k">NaN</span><span class="v">không phải số — kết quả phép toán hỏng.</span></div>
  <div class="kv"><span class="k">coercion</span><span class="v">ép kiểu — tự đổi kiểu.</span></div>
  <div class="kv"><span class="k">truthy / falsy</span><span class="v">coi là đúng / coi là sai trong điều kiện.</span></div>
  <div class="kv"><span class="k">reference</span><span class="v">tham chiếu — địa chỉ của object.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>const</code> by default, <code>let</code> when it must change, never <code>var</code>.</li>
  <li><code>const</code> protects the name, not the object.</li>
  <li>Numbers are floating point: 0.1 + 0.2 ≠ 0.3. Calculate money in whole units.</li>
  <li>Strings are immutable; keep what methods return. Use template literals.</li>
  <li><code>+</code> joins if either side is a string. Convert form input with <code>Number</code>.</li>
  <li>Always <code>===</code>. Eight falsy values; an empty array is truthy.</li>
  <li>Primitives copy; objects share a reference.</li>
</ul>
${nguon('📗', 'MDN — JavaScript data types and data structures', 'All the types, in detail', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures')}
${nguon('📘', 'javascript.info — The JavaScript language', 'Variables, types and conversions, with tasks', 'https://javascript.info/first-steps')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-js-co-ban', title: 'WED201c (Academy) — JavaScript basics', sub: 'The same foundations in the university syllabus', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Đặt tên cho giá trị, và biết chúng thuộc loại gì</h2>
<p class="lead">Học xong bài này bạn lưu được giá trị vào biến và chọn đúng từ khoá, gọi tên được mọi kiểu của JavaScript, đoán được chuyện gì xảy ra khi các kiểu trộn lẫn, so sánh giá trị an toàn, và giải thích vì sao đổi một biến có thể đổi luôn biến khác. Bạn cần điều này vì mọi chương trình ở mọi chương sau đều dựng từ các giá trị này, và những lỗi kinh điển của người mới — tổng ra "1020" thay vì 30, một phép kiểm đúng vì lý do sai — đều bắt nguồn từ các luật trong bài.</p>

<h3>Chạy mã này ở đâu</h3>
<p>Bạn thử được mọi dòng ngay bây giờ. Mở một trang bất kỳ, nhấn <strong>F12</strong>, chọn <strong>Console</strong> rồi gõ. Console là chỗ thí nghiệm: nó chạy một dòng và in kết quả. Với mã dài hơn, đặt tệp cạnh trang của bạn bằng <code>&lt;script src="app.js"&gt;&lt;/script&gt;</code>, hoặc chạy <code>node app.js</code> trong terminal. <code>console.log</code> in ra một giá trị, và là công cụ gỡ lỗi được dùng nhiều nhất.</p>

<h3>Bước 1 — biến: <code>let</code>, <code>const</code>, và dấu chấm hết cho <code>var</code></h3>
${ma('javascript', CODE['4-1/bien.js'])}
${ra(OUT['4-1/bien'])}
<table>
<thead><tr><th>Từ khoá</th><th>Gán lại?</th><th>Phạm vi</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>const</code></td><td>Không</td><td>Khối</td><td>Mặc định của bạn</td></tr>
<tr><td><code>let</code></td><td>Có</td><td>Khối</td><td>Bộ đếm, giá trị thật sự thay đổi</td></tr>
<tr><td><code>var</code></td><td>Có</td><td>Hàm</td><td>Đừng dùng. Bạn vẫn sẽ gặp trong mã cũ</td></tr>
</tbody>
</table>
<p>Bắt đầu bằng <code>const</code> ở mọi nơi và chỉ đổi sang <code>let</code> khi mã cần. Người đọc sẽ biết mọi thứ khác đứng yên. Để ý dòng output thứ ba: <code>const user</code> bảo vệ <em>cái tên</em>; object nó trỏ tới vẫn đổi được. Tên trong JavaScript viết <code>camelCase</code>, phân biệt hoa thường, và không bắt đầu bằng chữ số. Đặt theo ý nghĩa: <code>totalPrice</code>, không phải <code>x</code>.</p>
<p>Một chút về thứ tự. Khai báo được tìm trước khi mã chạy, gọi là <strong>hoisting (nâng khai báo)</strong>, và mỗi từ khoá cư xử khác nhau:</p>
${ma('javascript', CODE['4-1/truoc-khai-bao.js'])}
${ra(OUT['4-1/truoc-khai-bao'])}
<p><code>var</code> âm thầm cho bạn <code>undefined</code>. <code>let</code> cho một lỗi rõ ràng. Như vậy tốt hơn: lỗi to tiếng hơn hẳn một giá trị sai im lặng.</p>

<h3>Bước 2 — các kiểu</h3>
${ma('javascript', CODE['4-1/kieu.js'])}
${ra(OUT['4-1/kieu'])}
<div class="kv-grid">
  <div class="kv"><span class="k">number</span><span class="v">Số nguyên và số thập phân chung một kiểu.</span></div>
  <div class="kv"><span class="k">string</span><span class="v">Chữ, trong dấu nháy hoặc backtick.</span></div>
  <div class="kv"><span class="k">boolean</span><span class="v"><code>true</code> hoặc <code>false</code>.</span></div>
  <div class="kv"><span class="k">undefined</span><span class="v">Chưa có giá trị: biến có đó nhưng chưa từng được gán.</span></div>
  <div class="kv"><span class="k">null</span><span class="v">Cố ý để trống. Bạn tự chọn viết nó.</span></div>
  <div class="kv"><span class="k">bigint, symbol</span><span class="v">Số nguyên cực lớn và khoá duy nhất. Hiếm gặp.</span></div>
  <div class="kv"><span class="k">object</span><span class="v">Mọi thứ khác: đối tượng, mảng, ngày, hàm.</span></div>
</div>
<p>Nhìn dòng 6 của output: <code>typeof null</code> nói <code>object</code>. Đó là lỗi từ phiên bản đầu của JavaScript, năm 1995, và không bao giờ sửa được, vì các trang cũ phụ thuộc vào nó. Muốn kiểm null, viết <code>x === null</code>; muốn kiểm mảng, <code>Array.isArray(x)</code>.</p>

<h3>Bước 3 — số có những bất ngờ</h3>
${ma('javascript', CODE['4-1/so.js'])}
${ra(OUT['4-1/so'])}
<ul>
<li><strong>0.1 + 0.2:</strong> máy tính lưu số ở hệ nhị phân, và 0,1 không có dạng nhị phân chính xác, giống 1/3 không có dạng thập phân chính xác. Điều này xảy ra ở gần như mọi ngôn ngữ.</li>
<li><strong>toFixed</strong> trả về <em>chuỗi</em>: dùng để hiển thị, không dùng để tính tiếp.</li>
<li><strong>Number</strong> nghiêm ngặt: <code>Number('12px')</code> là <code>NaN</code>. <strong>parseInt</strong> đọc được tới đâu thì đọc rồi dừng. Lưu ý <code>Number('')</code> là 0, không phải NaN.</li>
<li><strong>NaN</strong> nghĩa là "không phải số", kết quả của phép toán hỏng. Nó là giá trị duy nhất không bằng chính nó, nên hãy kiểm bằng <code>Number.isNaN</code>.</li>
<li>Vượt <code>MAX_SAFE_INTEGER</code>, cộng 1 có thể không có tác dụng: output cho thấy tổng không đổi. Mã số rất dài nên giữ ở dạng chuỗi.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tính tiền bằng số thập phân.</strong> <code>0.1 + 0.2</code> không bằng <code>0.3</code>, và các sai số nhỏ đó cộng dồn trong giỏ hàng, hoá đơn: một phép so sánh sai, hay tổng lệch một đơn vị. Hãy tính theo đơn vị nguyên nhỏ nhất (tiền Việt không có phần lẻ; với đô la, dùng xu), và chỉ định dạng khi hiển thị. Hệ thống nghiêm túc lưu tiền bằng số nguyên hoặc kiểu decimal.</p></div>

<h3>Bước 4 — chuỗi</h3>
${ma('javascript', CODE['4-1/chuoi.js'])}
${ra(OUT['4-1/chuoi'])}
<p>Có ba kiểu dấu nháy. Nháy đơn và nháy kép như nhau; <strong>backtick</strong> tạo <strong>template literal</strong>, chứa được <code>&#36;{biểu thức}</code> và viết được nhiều dòng. Hãy dùng nó thay cho chuỗi <code>+</code> dài.</p>
<p>Chuỗi là <strong>bất biến (immutable)</strong>: không đổi được tại chỗ. <code>word[0] = 'b'</code> không làm gì, và không báo lỗi. Mọi phương thức (<code>trim</code>, <code>toUpperCase</code>, <code>replaceAll</code>…) đều trả về chuỗi mới, nên bạn phải giữ kết quả: <code>name = name.trim();</code>. Dòng output cuối cho thấy <code>length</code> đếm đơn vị mã, nên một emoji tính là 2; <code>[...text]</code> đếm ký tự thật.</p>

<h3>Bước 5 — ép kiểu</h3>
<p>Khi một toán tử gặp kiểu "sai", JavaScript âm thầm đổi nó. Hãy đoán từng dòng trước khi đọc output:</p>
${ma('javascript', CODE['4-1/ep-kieu.js'])}
${ra(OUT['4-1/ep-kieu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">+</span><span class="lz-t">Một vế là chuỗi?</span><span class="lz-d">Thì nối thành chữ: <code>'5' + 1</code> là <code>'51'</code>.</span></div>
<div class="lz-step"><span class="lz-k">− * /</span><span class="lz-t">Luôn là số</span><span class="lz-d"><code>'5' - 1</code> là 4; <code>'abc' * 2</code> là <code>NaN</code>.</span></div>
<div class="lz-step"><span class="lz-k">Trái sang phải</span><span class="lz-t">Từng bước một</span><span class="lz-d"><code>1 + 2 + '3'</code> là 3 + '3' = <code>'33'</code>, còn <code>'1' + 2 + 3</code> là <code>'123'</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — giá trị từ form luôn là chuỗi.</strong> <code>input.value</code> là chữ, kể cả với <code>type="number"</code>. Nên <code>a.value + b.value</code> với 10 và 20 cho <code>'1020'</code>. Hãy đổi ngay khi nhận: <code>Number(a.value) + Number(b.value)</code>, và kiểm <code>NaN</code>. Đừng cố tình dựa vào ép kiểu: hãy viết đúng điều bạn muốn.</p></div>

<h3>Bước 6 — <code>===</code>, và cái gì được coi là đúng</h3>
<p>Nửa sau output ở trên so <code>==</code> với <code>===</code>. Hai dấu bằng đổi kiểu trước, khiến <code>0 == ''</code> và <code>false == '0'</code> đều đúng. <strong>Luôn dùng <code>===</code> và <code>!==</code></strong>, so sánh không đổi kiểu. Ngoại lệ phổ biến duy nhất là <code>x == null</code>, khớp cả null lẫn undefined.</p>
<p>Trong một <code>if</code>, mọi giá trị đều được coi là đúng hoặc sai:</p>
${ma('javascript', CODE['4-1/dung-sai.js'])}
${ra(OUT['4-1/dung-sai'])}
<p>Có đúng tám giá trị <strong>falsy</strong>. Mọi thứ khác đều <strong>truthy</strong>, kể cả <code>'0'</code>, <code>'false'</code>, mảng rỗng và object rỗng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>if (items)</code> với mảng rỗng.</strong> Mảng rỗng là truthy, nên khối này luôn chạy, và thông báo "không có kết quả" không bao giờ hiện. Hãy kiểm <code>items.length</code>. Bẫy ngược lại: <code>if (count)</code> coi giá trị thật là 0 như bị thiếu. Khi 0 hay chuỗi rỗng là hợp lệ, hãy so sánh tường minh: <code>count !== undefined</code>.</p></div>

<h3>Bước 7 — giá trị và tham chiếu</h3>
${ma('javascript', CODE['4-1/tham-chieu.js'])}
${ra(OUT['4-1/tham-chieu'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Nguyên thuỷ</span><span class="lz-t">hộp chứa giá trị</span><span class="lz-d"><code>b = a</code> sao chép nó. Số, chuỗi, boolean.</span></div>
<div class="lz-layer"><span class="lz-k">Object</span><span class="lz-t">hộp chứa địa chỉ</span><span class="lz-d"><code>user2 = user1</code> sao chép địa chỉ: hai cái tên, một ngôi nhà.</span></div>
</div>
<p>Điều này giải thích hai dòng cuối: <code>===</code> trên object so <em>địa chỉ</em>, nên hai object cùng nội dung không bằng nhau. Nó cũng giải thích vì sao <code>const user</code> đổi được: địa chỉ vẫn nguyên. Bài 4.4 và Bài 11.4 quay lại chủ đề này, và luật state của React phụ thuộc vào nó.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — máy tính giá</strong></p>
<p>Tạo <code>price.js</code>. Các giá trị dưới đây là chuỗi, đúng như form trao tới:</p>
<pre><code class="language-javascript">const qtyInput = '3';
const priceInput = '19.99';
const discountInput = '';     // người dùng để trống</code></pre>
<ol>
<li>Đổi các giá trị nhập. Nếu giảm giá trống, coi là 0 phần trăm. Kiểm từng cái bằng <code>Number.isNaN</code>.</li>
<li>Tính bằng xu nguyên: <code>Math.round(Number(priceInput) * 100)</code>.</li>
<li>In tổng bằng template literal, dạng <code>Total: $59.97</code>.</li>
<li>Sao chép một object <code>cart</code> bằng spread, và đổi bản sao mà không đổi bản gốc.</li>
</ol>
<p>Gợi ý: <code>Number('')</code> là 0, tiện ở đây nhưng nguy hiểm ở chỗ khác. Kiểm bằng <code>typeof</code> ở mỗi bước.</p>
<p><strong>Xong khi:</strong> chương trình in đúng <code>Total: $59.97</code>, không có phần lẻ dài; <code>qtyInput = 'abc'</code> in ra thông báo lỗi rõ ràng, không phải <code>NaN</code>; <code>cart</code> gốc không đổi; và mọi phép so sánh dùng <code>===</code>. Sau đó module Code Lab 4.1 chấm bảy bài về chủ đề này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">variable</span><span class="v">biến — cái hộp có tên.</span></div>
  <div class="kv"><span class="k">const / let / var</span><span class="v">không gán lại / gán lại được / kiểu cũ.</span></div>
  <div class="kv"><span class="k">primitive</span><span class="v">kiểu nguyên thuỷ — giá trị đơn, không đổi được.</span></div>
  <div class="kv"><span class="k">object</span><span class="v">đối tượng — nhóm dữ liệu, được dùng chung qua tham chiếu.</span></div>
  <div class="kv"><span class="k">hoisting</span><span class="v">nâng khai báo — khai báo được tìm trước khi chạy.</span></div>
  <div class="kv"><span class="k">template literal</span><span class="v">chuỗi mẫu — dấu backtick, có nội suy.</span></div>
  <div class="kv"><span class="k">immutable</span><span class="v">bất biến — không đổi được tại chỗ.</span></div>
  <div class="kv"><span class="k">NaN</span><span class="v">không phải số — kết quả phép toán hỏng.</span></div>
  <div class="kv"><span class="k">coercion</span><span class="v">ép kiểu — tự đổi kiểu.</span></div>
  <div class="kv"><span class="k">truthy / falsy</span><span class="v">coi là đúng / coi là sai trong điều kiện.</span></div>
  <div class="kv"><span class="k">reference</span><span class="v">tham chiếu — địa chỉ của object.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mặc định <code>const</code>, <code>let</code> khi cần đổi, không bao giờ <code>var</code>.</li>
  <li><code>const</code> bảo vệ cái tên, không bảo vệ object.</li>
  <li>Số là dấu phẩy động: 0.1 + 0.2 ≠ 0.3. Tính tiền bằng đơn vị nguyên.</li>
  <li>Chuỗi bất biến; giữ kết quả phương thức trả về. Dùng template literal.</li>
  <li><code>+</code> nối chữ nếu một vế là chuỗi. Đổi dữ liệu form bằng <code>Number</code>.</li>
  <li>Luôn <code>===</code>. Tám giá trị falsy; mảng rỗng là truthy.</li>
  <li>Nguyên thuỷ thì sao chép; object thì dùng chung tham chiếu.</li>
</ul>
${nguon('📗', 'MDN — JavaScript data types and data structures', 'Mọi kiểu dữ liệu, chi tiết', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures')}
${nguon('📘', 'javascript.info — The JavaScript language', 'Biến, kiểu và chuyển đổi, kèm bài tập', 'https://javascript.info/first-steps')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-js-co-ban', title: 'WED201c (Academy) — JavaScript cơ bản', sub: 'Cùng nền tảng này trong đề cương môn học ở trường', cta: 'Mở bài' })}
</div>
`,
};
