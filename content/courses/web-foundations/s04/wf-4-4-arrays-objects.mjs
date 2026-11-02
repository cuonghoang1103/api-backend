/**
 * Bài 4.4 — Mảng và object (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/4-4).
 * Deck: scripts/slides-src/wf-4-4.mjs (9 slide, WF/v1/wf-4-4). Code Lab: module 4.4 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-4-4', 'Arrays and objects', 'Mảng và object', [
  [1, 'Arrays and objects',
    '<p>Real data is never one number. It is a list of orders, a user with a name and an address, a product with tags. Arrays hold ordered lists; objects hold named fields. Almost all data from an API arrives as a mix of the two, in a format called JSON.</p>',
    '<p>Dữ liệu thật không bao giờ là một con số. Nó là danh sách đơn hàng, một người dùng có tên và địa chỉ, một sản phẩm có nhãn. Mảng giữ danh sách có thứ tự; object giữ các trường có tên. Gần như mọi dữ liệu từ API đều tới dưới dạng hỗn hợp của hai thứ này, theo định dạng gọi là JSON.</p>'],
  [2, 'After this lesson you can…',
    '<p>The methods <code>map</code>, <code>filter</code> and <code>reduce</code> are the most important tools here. Once you are fluent with them you rarely write a manual loop again, and you will see them on nearly every page of React code.</p>',
    '<p>Các phương thức <code>map</code>, <code>filter</code> và <code>reduce</code> là công cụ quan trọng nhất ở đây. Khi đã thạo chúng, bạn hiếm khi phải viết vòng lặp tay nữa, và bạn sẽ gặp chúng ở gần như mọi trang mã React.</p>'],
  [3, 'Array basics',
    '<p>Indexes start at zero, <code>at(-1)</code> reads the last item, and reading past the end gives <code>undefined</code>, not an error. The important distinction: some methods change the array, like push and splice; others return a new one, like slice and concat. The output shows both kinds.</p>',
    '<p>Chỉ số bắt đầu từ 0, <code>at(-1)</code> đọc phần tử cuối, và đọc lố cuối mảng cho <code>undefined</code>, không phải lỗi. Khác biệt quan trọng: một số phương thức sửa mảng, như push và splice; số khác trả về mảng mới, như slice và concat. Output cho thấy cả hai loại.</p>'],
  [4, 'map, filter, find, reduce',
    '<p>Four real orders. <code>map</code> turns each item into something else. <code>filter</code> keeps some. <code>find</code> returns the first match or undefined. <code>reduce</code> combines everything into one value: here the revenue, and a total per customer. Each takes a callback.</p>',
    '<p>Bốn đơn hàng thật. <code>map</code> biến từng phần tử thành thứ khác. <code>filter</code> giữ lại một số. <code>find</code> trả về phần tử khớp đầu tiên hoặc undefined. <code>reduce</code> gộp mọi thứ thành một giá trị: ở đây là doanh thu, và tổng theo từng khách. Mỗi cái nhận một callback.</p>'],
  [5, 'Sorting has traps',
    '<p>Default sort compares as text, so 100 comes before 9. Pass a compare function to sort numbers. Sort also changes the array in place. And Vietnamese names need <code>localeCompare</code>, or Đ ends up after Z. The output shows each of these.</p>',
    '<p>Sort mặc định so sánh như chữ, nên 100 đứng trước 9. Truyền một hàm so sánh để sắp số. Sort còn sửa mảng tại chỗ. Và tên tiếng Việt cần <code>localeCompare</code>, nếu không Đ sẽ nằm sau Z. Output cho thấy từng điều này.</p>'],
  [6, 'Objects',
    '<p>Read with a dot or with brackets. Brackets are needed when the key is in a variable or has a space. Add, update and delete fields; list keys with <code>Object.keys</code>; read safely with <code>?.</code>. Destructuring pulls out several fields at once, with renames and defaults.</p>',
    '<p>Đọc bằng dấu chấm hoặc ngoặc vuông. Cần ngoặc vuông khi khoá nằm trong biến hoặc có dấu cách. Thêm, sửa và xoá trường; liệt kê khoá bằng <code>Object.keys</code>; đọc an toàn bằng <code>?.</code>. Destructuring lấy nhiều trường cùng lúc, có đổi tên và giá trị mặc định.</p>'],
  [7, 'Copies are shallow',
    '<p>Spread makes a new object, so changing the age of the copy left the original alone. But nested objects are still shared: changing the city through the copy changed the original too. <code>structuredClone</code> makes a full deep copy when you need one.</p>',
    '<p>Spread tạo object mới, nên đổi tuổi của bản sao để yên bản gốc. Nhưng object lồng bên trong vẫn dùng chung: đổi thành phố qua bản sao cũng đổi bản gốc. <code>structuredClone</code> tạo bản sao sâu đầy đủ khi bạn cần.</p>'],
  [8, 'JSON',
    '<p>JSON is how data travels between browser and server: text that looks like JavaScript objects. <code>stringify</code> turns data into text and <code>parse</code> turns it back. Notice what is lost: <code>undefined</code> and functions disappear, and a date becomes a string. JSON also needs double quotes.</p>',
    '<p>JSON là cách dữ liệu đi giữa trình duyệt và máy chủ: chữ trông giống object JavaScript. <code>stringify</code> biến dữ liệu thành chữ, <code>parse</code> biến ngược lại. Để ý thứ bị mất: <code>undefined</code> và hàm biến mất, còn ngày thành chuỗi. JSON cũng bắt buộc nháy kép.</p>'],
  [9, 'Summary & practice',
    '<p>The practice works on a small list of products: filter, transform, total and group them without a single manual loop. "Done when" gives exact numbers to match, and checks that the original list is untouched.</p>',
    '<p>Bài luyện làm việc trên một danh sách sản phẩm nhỏ: lọc, biến đổi, cộng tổng và nhóm chúng mà không có vòng lặp tay nào. "Xong khi" cho con số chính xác cần khớp, và kiểm rằng danh sách gốc không bị đụng tới.</p>'],
]);

export default {
  title: '4.4 — Arrays and objects: real data|||4.4 — Mảng và object: dữ liệu thật',
  slug: 'wf-4-4-arrays-objects',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/R8rmfD9Y5-c', durationSeconds: 0 },
  description: 'Mảng: chỉ số, phương thức sửa tại chỗ vs trả mảng mới; map/filter/find/reduce trên đơn hàng thật; bẫy sort (so như chữ, sửa tại chỗ, tên tiếng Việt cần localeCompare); object: chấm vs ngoặc, ?., destructuring; sao chép nông; JSON stringify/parse và thứ bị mất. Output chạy thật trong Chromium.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Lists and records: the shape of real data</h2>
<p class="lead">After this lesson you can create and change arrays, transform lists with <code>map</code>, <code>filter</code>, <code>find</code> and <code>reduce</code>, sort correctly (including Vietnamese names), read and update objects safely, copy data without changing the original, and convert data to and from JSON. You need this because the data your pages show — products, posts, users, orders — always arrives as arrays of objects, usually as JSON from an API (Chapter 5). Turning that data into what the page needs is most of front-end work.</p>

<h3>Step 1 — arrays</h3>
<p>An array is an ordered list. Positions, called <strong>indexes</strong>, start at 0.</p>
${ma('javascript', CODE['4-4/mang.js'])}
${ra(OUT['4-4/mang'])}
<table>
<thead><tr><th>Changes the array</th><th>Returns a new one (or a value)</th></tr></thead>
<tbody>
<tr><td><code>push</code>, <code>pop</code>, <code>shift</code>, <code>unshift</code></td><td><code>slice</code>, <code>concat</code>, <code>[...a, x]</code></td></tr>
<tr><td><code>splice</code>, <code>sort</code>, <code>reverse</code></td><td><code>map</code>, <code>filter</code>, <code>toSorted</code>, <code>toReversed</code></td></tr>
<tr><td><code>a[i] = x</code></td><td><code>a.with(i, x)</code>, <code>includes</code>, <code>indexOf</code>, <code>join</code></td></tr>
</tbody>
</table>
<p>The names are confusingly similar: <code>slice</code> copies part of the array, <code>splice</code> cuts it out of the original. When in doubt, check whether the original changed, as the output does. Reading <code>a[99]</code> gives <code>undefined</code>, silently.</p>

<h3>Step 2 — the four methods you will use every day</h3>
${ma('javascript', CODE['4-4/map-filter-reduce.js'])}
${ra(OUT['4-4/map-filter-reduce'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">map</span><span class="lz-t">transform each</span><span class="lz-d">Same length, new values. <code>orders.map(o =&gt; o.total)</code>.</span></div>
<div class="lz-step"><span class="lz-k">filter</span><span class="lz-t">keep some</span><span class="lz-d">Same values, fewer items. The callback returns true or false.</span></div>
<div class="lz-step"><span class="lz-k">find</span><span class="lz-t">the first match</span><span class="lz-d">One item, or <code>undefined</code>. Always handle the second case.</span></div>
<div class="lz-step"><span class="lz-k">reduce</span><span class="lz-t">combine into one</span><span class="lz-d">A sum, a maximum, an object. Carries an accumulator from item to item.</span></div>
</div>
<p>They <strong>chain</strong>: filter the paid orders, then reduce them to a revenue of 360. Each step returns a new array and leaves <code>orders</code> untouched. <code>some</code> and <code>every</code> answer yes/no questions about the whole list.</p>
<p>The second <code>reduce</code> builds an object, a total per customer. Read the accumulator <code>acc</code> as "the result so far": it starts as <code>{}</code> and each order adds to it. <code>?? 0</code> handles the first time a customer appears.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>reduce</code> without a starting value.</strong> Without the second argument, <code>reduce</code> uses the first item as the start. On an empty list it throws "Reduce of empty array with no initial value", as the last line shows; on a list of objects it adds an object to a number. Always pass the start: <code>reduce((sum, o) =&gt; sum + o.total, 0)</code>.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>map</code> used as a loop.</strong> <code>orders.map(o =&gt; console.log(o))</code> works but builds a useless array of <code>undefined</code>, and tells the reader you wanted a new list. Use <code>map</code> when you need the result, and <code>for...of</code> or <code>forEach</code> for side effects.</p></div>

<h3>Step 3 — sorting has three traps</h3>
${ma('javascript', CODE['4-4/sap-xep.js'])}
${ra(OUT['4-4/sap-xep'])}
<ol>
<li><strong>Text comparison:</strong> without a compare function, items are compared as strings, so "100" comes before "9". For numbers, pass <code>(a, b) =&gt; a - b</code>: a negative result puts <code>a</code> first.</li>
<li><strong>In place:</strong> <code>sort</code> changes the array and returns the same array (<code>a === b</code> is true). Copy first with <code>[...a].sort(…)</code>, or use the newer <code>toSorted</code>.</li>
<li><strong>Language:</strong> by default, letters are compared by their code number, so "Đức" sorts after "Bình" and even after lowercase letters. <code>localeCompare(y, 'vi')</code> uses Vietnamese alphabet rules.</li>
</ol>

<h3>Step 4 — objects</h3>
${ma('javascript', CODE['4-4/doi-tuong.js'])}
${ra(OUT['4-4/doi-tuong'])}
<div class="kv-grid">
  <div class="kv"><span class="k">user.name</span><span class="v">Dot: the key is written literally.</span></div>
  <div class="kv"><span class="k">user[field]</span><span class="v">Brackets: the key comes from a variable, or has spaces or dashes. <code>user.field</code> looks for a key named "field" (the second <code>undefined</code>).</span></div>
  <div class="kv"><span class="k">Object.keys / values / entries</span><span class="v">Turn an object into arrays, so the array methods work on it.</span></div>
  <div class="kv"><span class="k">'age' in user</span><span class="v">Does the key exist? Different from "is its value undefined".</span></div>
  <div class="kv"><span class="k">user.phone?.number</span><span class="v">Stops at a missing level instead of crashing.</span></div>
  <div class="kv"><span class="k">const { name, age: years, phone = 'none' } = user</span><span class="v"><strong>Destructuring</strong>: pick fields into variables, rename, give a default. Arrays too: <code>const [first, second] = list</code>.</span></div>
</div>

<h3>Step 5 — copies are shallow</h3>
<p>Look at the last two lines of that output. <code>{ ...user, age: 22 }</code> made a new object, so <code>user.age</code> stayed 21. But changing <code>shallow.address.city</code> changed <code>user.address.city</code> too: spread copies only the top level. The nested <code>address</code> object is still shared (Lesson 4.1).</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Top level</span><span class="lz-t">copied by spread</span><span class="lz-d"><code>name</code>, <code>age</code>: independent in the copy.</span></div>
<div class="lz-layer"><span class="lz-k">Nested objects</span><span class="lz-t">shared</span><span class="lz-d"><code>address</code>: one object, two paths to it.</span></div>
</div>
<p>To change a nested field without touching the original, copy each level you change: <code>{ ...user, address: { ...user.address, city: 'Huế' } }</code>. For a full deep copy, use <code>structuredClone(user)</code>. This pattern, called an <strong>immutable update</strong>, is how React state is updated (Lesson 11.4).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "I copied it, why did the original change?"</strong> Spread, <code>Object.assign</code>, <code>slice</code> and <code>concat</code> all make shallow copies. If your data has objects inside arrays — a cart of items, a user with an address — and you change an inner object through the "copy", the original changes as well. Copy every level you modify, or use <code>structuredClone</code>.</p></div>

<h3>Step 6 — JSON: data as text</h3>
${ma('javascript', CODE['4-4/json.js'])}
${ra(OUT['4-4/json'])}
<p><strong>JSON</strong> (JavaScript Object Notation) is the text format that browsers and servers exchange (Chapter 6). <code>JSON.stringify</code> turns data into text; the extra arguments <code>null, 2</code> indent it for reading. <code>JSON.parse</code> turns text back into data. Look at what did not survive: <code>stock: undefined</code> and the function vanished, and the date became a string. JSON's rules are stricter than JavaScript's: keys in double quotes, strings in double quotes, no trailing commas, no comments.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>JSON.parse</code> on bad input crashes your page.</strong> Data from a server, from <code>localStorage</code> or from a user can be malformed or empty. <code>JSON.parse('')</code> throws a <code>SyntaxError</code>, and an uncaught error stops your script. Wrap parsing of data you do not control in <code>try/catch</code>, and check the shape of what you get.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — a product list without loops</strong></p>
<pre><code class="language-javascript">const products = [
  { name: 'Áo thun', price: 150000, category: 'clothes', stock: 12 },
  { name: 'Bút bi', price: 5000, category: 'office', stock: 0 },
  { name: 'Đèn bàn', price: 320000, category: 'home', stock: 3 },
  { name: 'Quần jean', price: 450000, category: 'clothes', stock: 5 },
];</code></pre>
<ol>
<li>Names of products in stock, with <code>filter</code> and <code>map</code>.</li>
<li>The value of all stock (price × stock), with <code>reduce</code> and a starting value.</li>
<li>Products sorted by name in Vietnamese order, without changing <code>products</code>.</li>
<li>An object counting products per category, with <code>reduce</code>.</li>
<li>Raise every price by 10% into a new array, then save it with <code>JSON.stringify</code> and read it back.</li>
</ol>
<p>Hint: write and check one step at a time in the Console; print the intermediate arrays.</p>
<p><strong>Done when:</strong> step 1 gives <code>['Áo thun', 'Đèn bàn', 'Quần jean']</code>; step 2 gives 5010000; step 3 starts with "Áo thun" and ends with "Quần jean"; step 4 gives <code>{ clothes: 2, office: 1, home: 1 }</code>; and <code>products[0].price</code> is still 150000 at the end. Then Code Lab module 4.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">array / index</span><span class="v">mảng / chỉ số — bắt đầu từ 0.</span></div>
  <div class="kv"><span class="k">object / key / value</span><span class="v">đối tượng / khoá / giá trị.</span></div>
  <div class="kv"><span class="k">mutate</span><span class="v">sửa tại chỗ.</span></div>
  <div class="kv"><span class="k">map / filter / reduce</span><span class="v">biến đổi / lọc / gộp.</span></div>
  <div class="kv"><span class="k">accumulator</span><span class="v">biến tích luỹ — kết quả tới lúc này.</span></div>
  <div class="kv"><span class="k">compare function</span><span class="v">hàm so sánh cho sort.</span></div>
  <div class="kv"><span class="k">destructuring</span><span class="v">phân rã — lấy trường ra biến.</span></div>
  <div class="kv"><span class="k">spread</span><span class="v">trải — <code>...</code> sao chép phần tử/trường.</span></div>
  <div class="kv"><span class="k">shallow / deep copy</span><span class="v">sao chép nông / sâu.</span></div>
  <div class="kv"><span class="k">immutable update</span><span class="v">cập nhật bất biến — tạo bản mới thay vì sửa.</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">định dạng chữ để trao đổi dữ liệu.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Indexes start at 0; reading past the end gives <code>undefined</code>.</li>
  <li>Know which methods change the array (push, splice, sort) and which return a new one (slice, map, filter).</li>
  <li><code>map</code> transforms, <code>filter</code> keeps, <code>find</code> returns one or undefined, <code>reduce</code> combines — always with a starting value.</li>
  <li>Sort numbers with <code>(a, b) =&gt; a - b</code>, copy before sorting, use <code>localeCompare(…, 'vi')</code> for names.</li>
  <li>Dot for literal keys, brackets for variables; <code>?.</code> for missing levels; destructure to pick fields.</li>
  <li>Spread copies one level; nested objects stay shared. Copy every level you change.</li>
  <li>JSON is text: double quotes, no functions or undefined, dates become strings. Parse inside <code>try/catch</code>.</li>
</ul>
${nguon('📗', 'MDN — Arrays', 'Every method, grouped and with examples', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array')}
${nguon('📘', 'javascript.info — Array methods', 'map, filter, reduce, sort, with tasks', 'https://javascript.info/array-methods')}
${lienKet({ khoa: 'react', bai: 'rx-0-3-js-cho-react', title: 'React 0.3 — the JavaScript React needs', sub: 'map, filter, spread and destructuring as React uses them', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Danh sách và bản ghi: hình dạng của dữ liệu thật</h2>
<p class="lead">Học xong bài này bạn tạo và sửa được mảng, biến đổi danh sách bằng <code>map</code>, <code>filter</code>, <code>find</code> và <code>reduce</code>, sắp xếp đúng (kể cả tên tiếng Việt), đọc và cập nhật object an toàn, sao chép dữ liệu mà không đổi bản gốc, và chuyển dữ liệu sang và từ JSON. Bạn cần điều này vì dữ liệu trang hiển thị — sản phẩm, bài viết, người dùng, đơn hàng — luôn tới dưới dạng mảng các object, thường là JSON từ API (Chương 5). Biến dữ liệu đó thành thứ trang cần là phần lớn công việc front-end.</p>

<h3>Bước 1 — mảng</h3>
<p>Mảng là một danh sách có thứ tự. Các vị trí, gọi là <strong>chỉ số (index)</strong>, bắt đầu từ 0.</p>
${ma('javascript', CODE['4-4/mang.js'])}
${ra(OUT['4-4/mang'])}
<table>
<thead><tr><th>Sửa mảng</th><th>Trả mảng mới (hoặc một giá trị)</th></tr></thead>
<tbody>
<tr><td><code>push</code>, <code>pop</code>, <code>shift</code>, <code>unshift</code></td><td><code>slice</code>, <code>concat</code>, <code>[...a, x]</code></td></tr>
<tr><td><code>splice</code>, <code>sort</code>, <code>reverse</code></td><td><code>map</code>, <code>filter</code>, <code>toSorted</code>, <code>toReversed</code></td></tr>
<tr><td><code>a[i] = x</code></td><td><code>a.with(i, x)</code>, <code>includes</code>, <code>indexOf</code>, <code>join</code></td></tr>
</tbody>
</table>
<p>Tên giống nhau đến khó chịu: <code>slice</code> sao chép một phần mảng, <code>splice</code> cắt nó khỏi bản gốc. Khi nghi ngờ, hãy kiểm bản gốc có đổi không, như output đã làm. Đọc <code>a[99]</code> cho <code>undefined</code>, im lặng.</p>

<h3>Bước 2 — bốn phương thức dùng hằng ngày</h3>
${ma('javascript', CODE['4-4/map-filter-reduce.js'])}
${ra(OUT['4-4/map-filter-reduce'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">map</span><span class="lz-t">biến đổi từng cái</span><span class="lz-d">Cùng độ dài, giá trị mới. <code>orders.map(o =&gt; o.total)</code>.</span></div>
<div class="lz-step"><span class="lz-k">filter</span><span class="lz-t">giữ lại một số</span><span class="lz-d">Giá trị giữ nguyên, ít phần tử hơn. Callback trả true hoặc false.</span></div>
<div class="lz-step"><span class="lz-k">find</span><span class="lz-t">cái khớp đầu tiên</span><span class="lz-d">Một phần tử, hoặc <code>undefined</code>. Luôn xử lý trường hợp thứ hai.</span></div>
<div class="lz-step"><span class="lz-k">reduce</span><span class="lz-t">gộp thành một</span><span class="lz-d">Một tổng, một giá trị lớn nhất, một object. Mang theo biến tích luỹ từ phần tử này sang phần tử kia.</span></div>
</div>
<p>Chúng <strong>nối chuỗi</strong> được: lọc các đơn đã trả, rồi gộp thành doanh thu 360. Mỗi bước trả về mảng mới và để yên <code>orders</code>. <code>some</code> và <code>every</code> trả lời câu hỏi có/không về cả danh sách.</p>
<p><code>reduce</code> thứ hai dựng một object, tổng theo từng khách. Hãy đọc biến tích luỹ <code>acc</code> là "kết quả tới lúc này": nó bắt đầu là <code>{}</code> và mỗi đơn cộng thêm vào. <code>?? 0</code> xử lý lần đầu một khách xuất hiện.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>reduce</code> không có giá trị khởi đầu.</strong> Thiếu đối số thứ hai, <code>reduce</code> dùng phần tử đầu làm khởi đầu. Với danh sách rỗng nó ném lỗi "Reduce of empty array with no initial value", như dòng cuối cho thấy; với danh sách object nó cộng một object với một số. Luôn truyền giá trị khởi đầu: <code>reduce((sum, o) =&gt; sum + o.total, 0)</code>.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng <code>map</code> như vòng lặp.</strong> <code>orders.map(o =&gt; console.log(o))</code> chạy được nhưng dựng một mảng <code>undefined</code> vô dụng, và nói với người đọc rằng bạn muốn một danh sách mới. Dùng <code>map</code> khi cần kết quả, và <code>for...of</code> hay <code>forEach</code> cho tác dụng phụ.</p></div>

<h3>Bước 3 — sắp xếp có ba bẫy</h3>
${ma('javascript', CODE['4-4/sap-xep.js'])}
${ra(OUT['4-4/sap-xep'])}
<ol>
<li><strong>So sánh như chữ:</strong> thiếu hàm so sánh, các phần tử được so như chuỗi, nên "100" đứng trước "9". Với số, truyền <code>(a, b) =&gt; a - b</code>: kết quả âm đặt <code>a</code> lên trước.</li>
<li><strong>Tại chỗ:</strong> <code>sort</code> sửa mảng và trả về chính mảng đó (<code>a === b</code> là true). Sao chép trước bằng <code>[...a].sort(…)</code>, hoặc dùng <code>toSorted</code> mới hơn.</li>
<li><strong>Ngôn ngữ:</strong> mặc định, chữ cái được so theo mã số, nên "Đức" đứng sau "Bình" và còn sau cả chữ thường. <code>localeCompare(y, 'vi')</code> dùng luật bảng chữ cái tiếng Việt.</li>
</ol>

<h3>Bước 4 — object</h3>
${ma('javascript', CODE['4-4/doi-tuong.js'])}
${ra(OUT['4-4/doi-tuong'])}
<div class="kv-grid">
  <div class="kv"><span class="k">user.name</span><span class="v">Dấu chấm: khoá được viết nguyên văn.</span></div>
  <div class="kv"><span class="k">user[field]</span><span class="v">Ngoặc vuông: khoá lấy từ một biến, hoặc có dấu cách, gạch ngang. <code>user.field</code> tìm khoá tên "field" (cái <code>undefined</code> thứ hai).</span></div>
  <div class="kv"><span class="k">Object.keys / values / entries</span><span class="v">Biến object thành mảng, để phương thức mảng dùng được.</span></div>
  <div class="kv"><span class="k">'age' in user</span><span class="v">Khoá có tồn tại không? Khác với "giá trị của nó là undefined".</span></div>
  <div class="kv"><span class="k">user.phone?.number</span><span class="v">Dừng ở tầng bị thiếu thay vì sập.</span></div>
  <div class="kv"><span class="k">const { name, age: years, phone = 'none' } = user</span><span class="v"><strong>Destructuring (phân rã)</strong>: lấy trường ra biến, đổi tên, cho giá trị mặc định. Mảng cũng vậy: <code>const [first, second] = list</code>.</span></div>
</div>

<h3>Bước 5 — bản sao là nông</h3>
<p>Nhìn hai dòng cuối của output đó. <code>{ ...user, age: 22 }</code> tạo object mới, nên <code>user.age</code> vẫn là 21. Nhưng đổi <code>shallow.address.city</code> lại đổi luôn <code>user.address.city</code>: spread chỉ sao chép tầng trên cùng. Object <code>address</code> lồng bên trong vẫn dùng chung (Bài 4.1).</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Tầng trên cùng</span><span class="lz-t">spread sao chép</span><span class="lz-d"><code>name</code>, <code>age</code>: độc lập trong bản sao.</span></div>
<div class="lz-layer"><span class="lz-k">Object lồng</span><span class="lz-t">dùng chung</span><span class="lz-d"><code>address</code>: một object, hai đường tới nó.</span></div>
</div>
<p>Muốn đổi trường lồng mà không đụng bản gốc, hãy sao chép mọi tầng bạn đổi: <code>{ ...user, address: { ...user.address, city: 'Huế' } }</code>. Muốn bản sao sâu đầy đủ, dùng <code>structuredClone(user)</code>. Mẫu này, gọi là <strong>cập nhật bất biến (immutable update)</strong>, là cách cập nhật state trong React (Bài 11.4).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "mình đã sao chép rồi, sao bản gốc vẫn đổi?"</strong> Spread, <code>Object.assign</code>, <code>slice</code> và <code>concat</code> đều tạo bản sao nông. Nếu dữ liệu có object bên trong mảng — giỏ hàng các món, người dùng có địa chỉ — và bạn đổi object bên trong qua "bản sao", bản gốc cũng đổi theo. Hãy sao chép mọi tầng bạn sửa, hoặc dùng <code>structuredClone</code>.</p></div>

<h3>Bước 6 — JSON: dữ liệu dạng chữ</h3>
${ma('javascript', CODE['4-4/json.js'])}
${ra(OUT['4-4/json'])}
<p><strong>JSON</strong> (JavaScript Object Notation) là định dạng chữ mà trình duyệt và máy chủ trao đổi (Chương 6). <code>JSON.stringify</code> biến dữ liệu thành chữ; đối số thêm <code>null, 2</code> thụt lề cho dễ đọc. <code>JSON.parse</code> biến chữ trở lại dữ liệu. Nhìn thứ không sống sót: <code>stock: undefined</code> và hàm biến mất, còn ngày thành chuỗi. Luật của JSON chặt hơn JavaScript: khoá trong nháy kép, chuỗi trong nháy kép, không dấu phẩy thừa ở cuối, không chú thích.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>JSON.parse</code> dữ liệu xấu làm sập trang.</strong> Dữ liệu từ máy chủ, từ <code>localStorage</code> hay từ người dùng có thể sai định dạng hoặc rỗng. <code>JSON.parse('')</code> ném <code>SyntaxError</code>, và lỗi không được bắt sẽ dừng script. Hãy bọc việc đọc dữ liệu bạn không kiểm soát trong <code>try/catch</code>, và kiểm hình dạng thứ nhận được.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — danh sách sản phẩm không vòng lặp</strong></p>
<pre><code class="language-javascript">const products = [
  { name: 'Áo thun', price: 150000, category: 'clothes', stock: 12 },
  { name: 'Bút bi', price: 5000, category: 'office', stock: 0 },
  { name: 'Đèn bàn', price: 320000, category: 'home', stock: 3 },
  { name: 'Quần jean', price: 450000, category: 'clothes', stock: 5 },
];</code></pre>
<ol>
<li>Tên các sản phẩm còn hàng, bằng <code>filter</code> và <code>map</code>.</li>
<li>Giá trị toàn bộ hàng tồn (giá × tồn kho), bằng <code>reduce</code> có giá trị khởi đầu.</li>
<li>Sản phẩm sắp theo tên đúng thứ tự tiếng Việt, không đổi <code>products</code>.</li>
<li>Một object đếm số sản phẩm theo danh mục, bằng <code>reduce</code>.</li>
<li>Tăng mọi giá 10% vào mảng mới, rồi lưu bằng <code>JSON.stringify</code> và đọc lại.</li>
</ol>
<p>Gợi ý: viết và kiểm từng bước trong Console; in các mảng trung gian.</p>
<p><strong>Xong khi:</strong> bước 1 cho <code>['Áo thun', 'Đèn bàn', 'Quần jean']</code>; bước 2 cho 5010000; bước 3 bắt đầu bằng "Áo thun" và kết thúc bằng "Quần jean"; bước 4 cho <code>{ clothes: 2, office: 1, home: 1 }</code>; và <code>products[0].price</code> vẫn là 150000 ở cuối. Sau đó làm module Code Lab 4.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">array / index</span><span class="v">mảng / chỉ số — bắt đầu từ 0.</span></div>
  <div class="kv"><span class="k">object / key / value</span><span class="v">đối tượng / khoá / giá trị.</span></div>
  <div class="kv"><span class="k">mutate</span><span class="v">sửa tại chỗ.</span></div>
  <div class="kv"><span class="k">map / filter / reduce</span><span class="v">biến đổi / lọc / gộp.</span></div>
  <div class="kv"><span class="k">accumulator</span><span class="v">biến tích luỹ — kết quả tới lúc này.</span></div>
  <div class="kv"><span class="k">compare function</span><span class="v">hàm so sánh cho sort.</span></div>
  <div class="kv"><span class="k">destructuring</span><span class="v">phân rã — lấy trường ra biến.</span></div>
  <div class="kv"><span class="k">spread</span><span class="v">trải — <code>...</code> sao chép phần tử/trường.</span></div>
  <div class="kv"><span class="k">shallow / deep copy</span><span class="v">sao chép nông / sâu.</span></div>
  <div class="kv"><span class="k">immutable update</span><span class="v">cập nhật bất biến — tạo bản mới thay vì sửa.</span></div>
  <div class="kv"><span class="k">JSON</span><span class="v">định dạng chữ để trao đổi dữ liệu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chỉ số bắt đầu từ 0; đọc lố cuối mảng cho <code>undefined</code>.</li>
  <li>Biết phương thức nào sửa mảng (push, splice, sort) và cái nào trả mảng mới (slice, map, filter).</li>
  <li><code>map</code> biến đổi, <code>filter</code> giữ lại, <code>find</code> trả một cái hoặc undefined, <code>reduce</code> gộp — luôn có giá trị khởi đầu.</li>
  <li>Sắp số bằng <code>(a, b) =&gt; a - b</code>, sao chép trước khi sắp, dùng <code>localeCompare(…, 'vi')</code> cho tên.</li>
  <li>Dấu chấm cho khoá nguyên văn, ngoặc vuông cho biến; <code>?.</code> cho tầng thiếu; destructuring để lấy trường.</li>
  <li>Spread sao chép một tầng; object lồng vẫn dùng chung. Sao chép mọi tầng bạn đổi.</li>
  <li>JSON là chữ: nháy kép, không hàm hay undefined, ngày thành chuỗi. Parse trong <code>try/catch</code>.</li>
</ul>
${nguon('📗', 'MDN — Arrays', 'Mọi phương thức, phân nhóm kèm ví dụ', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array')}
${nguon('📘', 'javascript.info — Array methods', 'map, filter, reduce, sort, kèm bài tập', 'https://javascript.info/array-methods')}
${lienKet({ khoa: 'react', bai: 'rx-0-3-js-cho-react', title: 'React 0.3 — JavaScript mà React cần', sub: 'map, filter, spread và destructuring theo cách React dùng chúng', cta: 'Mở bài' })}
</div>
`,
};
