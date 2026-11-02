/**
 * Bài 4.2 — Điều kiện và vòng lặp (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/4-2).
 * Deck: scripts/slides-src/wf-4-2.mjs (9 slide, WF/v1/wf-4-2). Code Lab: module 4.2 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-4-2', 'Conditions and loops', 'Điều kiện và vòng lặp', [
  [1, 'Conditions and loops',
    '<p>So far a program runs top to bottom, once. Real programs make decisions and repeat work. With <code>if</code> and loops you have what you need to solve any problem. Everything else in programming is convenience on top of these two ideas.</p>',
    '<p>Tới giờ chương trình chạy từ trên xuống, một lần. Chương trình thật phải ra quyết định và lặp lại công việc. Với <code>if</code> và vòng lặp, bạn đã có đủ thứ để giải mọi bài toán. Mọi thứ khác trong lập trình chỉ là sự tiện lợi đặt trên hai ý này.</p>'],
  [2, 'After this lesson you can…',
    '<p>The hidden skill here is tracing: following a loop on paper, one step at a time. It is how you find the off-by-one mistakes that make up most loop bugs, and it is what interviewers want to see when they give you FizzBuzz.</p>',
    '<p>Kỹ năng ẩn ở đây là lần vết: theo dõi vòng lặp trên giấy, từng bước một. Đó là cách tìm ra các lỗi lệch một, chiếm phần lớn lỗi vòng lặp, và là điều người phỏng vấn muốn thấy khi cho bạn bài FizzBuzz.</p>'],
  [3, 'Order of branches',
    '<p>An <code>if</code> chain runs the first branch that is true and skips the rest. The first function checks the easier condition first, so nine points gets Pass instead of Good. The second puts the strictest condition first. Same conditions, different order, different result.</p>',
    '<p>Chuỗi <code>if</code> chạy nhánh đúng đầu tiên rồi bỏ qua phần còn lại. Hàm đầu kiểm điều kiện dễ trước, nên chín điểm nhận Pass thay vì Good. Hàm thứ hai đặt điều kiện khắt khe nhất lên trước. Cùng điều kiện, khác thứ tự, khác kết quả.</p>'],
  [4, 'Logic operators return values',
    '<p>And, or, and the nullish operator return one of their operands, not just true or false. The key difference: <code>||</code> treats 0 and an empty string as missing; <code>??</code> treats only null and undefined as missing. The output shows volume 0 being lost with one and kept with the other.</p>',
    '<p>Và, hoặc, và toán tử nullish trả về một trong các toán hạng, không chỉ đúng hay sai. Khác biệt then chốt: <code>||</code> coi 0 và chuỗi rỗng là thiếu; <code>??</code> chỉ coi null và undefined là thiếu. Output cho thấy âm lượng 0 bị mất với cái này và giữ được với cái kia.</p>'],
  [5, 'switch, and when not to use it',
    '<p><code>switch</code> compares one value against several cases using strict equality. Forget <code>break</code> and execution falls into the next case: Saturday also adds Sunday. A lookup object is usually shorter and has no such trap.</p>',
    '<p><code>switch</code> so một giá trị với nhiều case bằng so sánh nghiêm ngặt. Quên <code>break</code> là chạy tuột xuống case sau: Saturday còn cộng thêm Sunday. Một object tra cứu thường ngắn hơn và không có bẫy đó.</p>'],
  [6, 'Loops',
    '<p>Three loops, one job. A classic <code>for</code> when you need the index, <code>for...of</code> for the values, and <code>forEach</code> when calling a function. <code>while</code> is for when you do not know the count in advance. <code>continue</code> skips one round; <code>break</code> leaves the loop.</p>',
    '<p>Ba vòng lặp, một việc. <code>for</code> cổ điển khi cần chỉ số, <code>for...of</code> để lấy giá trị, và <code>forEach</code> khi gọi hàm. <code>while</code> dùng khi không biết trước số lần. <code>continue</code> bỏ qua một vòng; <code>break</code> rời khỏi vòng lặp.</p>'],
  [7, 'for...in is not for arrays',
    '<p>The names look alike and do different things. <code>for...in</code> gives keys as strings, including any extra property, and suits objects. <code>for...of</code> gives values. Look at the output: on the array, the extra key appears only in the first loop.</p>',
    '<p>Tên giống nhau mà làm việc khác nhau. <code>for...in</code> cho các khoá dạng chuỗi, kể cả thuộc tính thừa, và hợp với object. <code>for...of</code> cho giá trị. Nhìn output: trên mảng, khoá thừa chỉ xuất hiện ở vòng lặp đầu.</p>'],
  [8, 'Off by one, and tracing',
    '<p>Using less-than-or-equal with <code>length</code> reads one element too far, and you get <code>undefined</code> instead of an error. The cure is tracing: write down each variable, round by round, for a small input. The second half prints exactly such a table.</p>',
    '<p>Dùng nhỏ hơn hoặc bằng với <code>length</code> sẽ đọc lố một phần tử, và bạn nhận <code>undefined</code> thay vì lỗi. Thuốc chữa là lần vết: viết ra từng biến, từng vòng, với một đầu vào nhỏ. Nửa sau in đúng một bảng như vậy.</p>'],
  [9, 'Summary & practice',
    '<p>FizzBuzz puts both ideas together, and the order of the branches is the whole puzzle. The practice then asks you to trace a loop on paper before running it. "Done when" compares your table with the real output.</p>',
    '<p>FizzBuzz gộp cả hai ý, và thứ tự các nhánh chính là toàn bộ câu đố. Bài luyện sau đó yêu cầu lần vết một vòng lặp trên giấy trước khi chạy. "Xong khi" so bảng của bạn với output thật.</p>'],
]);

export default {
  title: '4.2 — Conditions and loops|||4.2 — Điều kiện và vòng lặp',
  slug: 'wf-4-2-conditions-loops',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/Zg4-uSjxosE', durationSeconds: 0 },
  description: 'if/else và thứ tự nhánh, && || ?? ?. trả về giá trị, toán tử ba ngôi, switch và lỗi quên break, các vòng lặp, for...in vs for...of, lỗi lệch một và cách lần vết, FizzBuzz. Mọi output chạy thật trong Chromium.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Making decisions and repeating work</h2>
<p class="lead">After this lesson you can branch with <code>if</code> and the ternary, use <code>&amp;&amp;</code>, <code>||</code>, <code>??</code> and <code>?.</code> correctly, choose the right loop, stop or skip inside a loop, and trace a loop by hand to find a bug. You need this because these two ideas, deciding and repeating, are all a computer really does. Every feature you build — validating a form, totalling a cart, rendering a list — is made of them.</p>

<h3>Step 1 — <code>if</code>, and why the order of branches matters</h3>
<pre><code class="language-javascript">if (condition) {
  // runs if the condition is truthy
} else if (otherCondition) {
  // runs if the first was false and this one is true
} else {
  // runs if none of them was
}</code></pre>
<p>Exactly one block runs: the <strong>first</strong> that is true. So the order matters:</p>
${ma('javascript', CODE['4-2/xep-loai.js'])}
${ra(OUT['4-2/xep-loai'])}
<p>A score of 9 got "Pass" from the first function: <code>score &gt;= 5</code> was already true, so the "Good" branch could never be reached. Rule: put the <strong>strictest</strong> condition first. Notice that with <code>return</code> you need no <code>else</code>: returning ends the function. This style, called an <strong>early return</strong>, keeps code flat.</p>

<h3>Step 2 — logical operators return values</h3>
<table>
<thead><tr><th>Operator</th><th>Means</th><th>Returns</th></tr></thead>
<tbody>
<tr><td><code>a &amp;&amp; b</code></td><td>and</td><td><code>a</code> if it is falsy, otherwise <code>b</code></td></tr>
<tr><td><code>a || b</code></td><td>or</td><td><code>a</code> if it is truthy, otherwise <code>b</code></td></tr>
<tr><td><code>a ?? b</code></td><td>nullish coalescing</td><td><code>a</code> unless it is null or undefined</td></tr>
<tr><td><code>a?.b</code></td><td>optional chaining</td><td><code>undefined</code> if <code>a</code> is null or undefined, otherwise <code>a.b</code></td></tr>
<tr><td><code>!a</code></td><td>not</td><td><code>true</code> or <code>false</code></td></tr>
<tr><td><code>c ? x : y</code></td><td>ternary</td><td><code>x</code> if <code>c</code> is truthy, otherwise <code>y</code></td></tr>
</tbody>
</table>
${ma('javascript', CODE['4-2/logic.js'])}
${ra(OUT['4-2/logic'])}
<p><code>&amp;&amp;</code> and <code>||</code> stop as soon as the answer is known, which is called <strong>short-circuiting</strong>. So <code>user &amp;&amp; user.name</code> never touches <code>.name</code> when <code>user</code> is empty, and in React, <code>isOpen &amp;&amp; &lt;Modal /&gt;</code> renders the modal only if open.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>||</code> for default values.</strong> <code>const volume = settings.volume || 50;</code> looks right, until a user sets the volume to 0: 0 is falsy, so they get 50. The same goes for an empty string the user typed on purpose. Use <code>??</code>, which replaces only null and undefined. The output above shows both.</p></div>

<h3>Step 3 — <code>switch</code>, and a shorter alternative</h3>
${ma('javascript', CODE['4-2/switch.js'])}
${ra(OUT['4-2/switch'])}
<p>The first line printed "Saturday Sunday": with no <code>break</code>, execution <strong>falls through</strong> into the next case. Sometimes that is on purpose, but usually it is a bug. <code>switch</code> compares with <code>===</code>, so <code>'1'</code> did not match <code>1</code>.</p>
<p>When each case only maps a key to a value, a <strong>lookup object</strong> is shorter and cannot fall through. It also means adding a case is a data change rather than a code change.</p>

<h3>Step 4 — loops</h3>
${ma('javascript', CODE['4-2/vong-lap.js'])}
${ra(OUT['4-2/vong-lap'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Start</span><span class="lz-d"><code>let i = 0</code> runs once.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Test</span><span class="lz-d"><code>i &lt; list.length</code>. If false, the loop ends.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Body</span><span class="lz-d">The code inside runs once.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Update</span><span class="lz-d"><code>i++</code>, and back to step 2.</span></div>
</div>
<table>
<thead><tr><th>You need</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Each value of a list</td><td><code>for (const x of list)</code></td></tr>
<tr><td>The index too</td><td>classic <code>for</code>, or <code>list.forEach((x, i) =&gt; …)</code></td></tr>
<tr><td>A new list from an old one</td><td><code>map</code>, <code>filter</code> (Lesson 4.4)</td></tr>
<tr><td>Repeat until something happens</td><td><code>while</code></td></tr>
<tr><td>To stop early</td><td><code>for</code> / <code>for...of</code> with <code>break</code>. <code>forEach</code> cannot stop</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — an infinite loop.</strong> <code>while (n &gt; 0) { console.log(n); }</code> forgets to change <code>n</code>. The condition stays true for ever, the page freezes, and you must close the tab. In a <code>while</code>, make sure every path through the body moves towards the exit. If your tab freezes, check the last loop you wrote.</p></div>

<h3>Step 5 — <code>for...in</code> is not for arrays</h3>
${ma('javascript', CODE['4-2/for-in-bay.js'])}
${ra(OUT['4-2/for-in-bay'])}
<p><code>for...in</code> walks over <strong>keys</strong>, as strings, including extra properties. On an array you wanted values, and <code>'0' + 1</code> would join text. Memory aid: <strong>of = values, in = keys</strong>. Use <code>for...of</code> for arrays; for objects, <code>for...in</code> or better, <code>Object.entries</code>.</p>

<h3>Step 6 — off by one, and how to trace</h3>
${ma('javascript', CODE['4-2/lech-mot.js'])}
${ra(OUT['4-2/lech-mot'])}
<p>The first loop used <code>&lt;=</code>, and read <code>nums[3]</code>, which does not exist. JavaScript does not stop you; you just get <code>undefined</code>. An array of 3 has indexes 0, 1, 2, so the standard form is <code>i &lt; list.length</code>.</p>
<p>The cure for loop bugs is <strong>tracing</strong>: take a tiny input, and write a table of every variable after each round, by hand. The bottom half of the output is such a table. If your table differs from the program's, the first differing row is where your understanding breaks.</p>

<h3>Step 7 — both ideas together: FizzBuzz</h3>
<p>This is the classic warm-up question: print 1 to 15, but multiples of 3 become Fizz, multiples of 5 become Buzz, and multiples of both become FizzBuzz.</p>
${ma('javascript', CODE['4-2/fizzbuzz.js'])}
${ra(OUT['4-2/fizzbuzz'])}
<p><code>%</code> is the remainder operator: <code>i % 3 === 0</code> means "divisible by 3". The trap is the order: check 15 <em>first</em>, or the branch for 3 catches it, exactly as in Step 1.</p>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — trace, then write</strong></p>
<p>Without running it, fill in a table of <code>i</code>, <code>total</code> and <code>max</code> for each round:</p>
<pre><code class="language-javascript">const a = [4, 9, 2];
let total = 0, max = a[0];
for (let i = 0; i &lt; a.length; i++) {
  total += a[i];
  if (a[i] &gt; max) max = a[i];
}
console.log(total, max);</code></pre>
<ol>
<li>Run it and compare with your table.</li>
<li>Write <code>grade(score)</code> returning A (9+), B (7+), C (5+), or F, using early returns.</li>
<li>Write <code>countVowels(text)</code> with <code>for...of</code>.</li>
<li>Print the first number above 100 that is divisible by 7, using a <code>while</code> or <code>break</code>.</li>
</ol>
<p>Hint: <code>'aeiou'.includes(letter.toLowerCase())</code>.</p>
<p><strong>Done when:</strong> your table matches and the output is <code>15 9</code>; <code>grade(9)</code> is A and <code>grade(4)</code> is F; <code>countVowels('Web Foundations')</code> is 6; and the last program prints 105. Then Code Lab module 4.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">condition</span><span class="v">điều kiện — biểu thức đúng hoặc sai.</span></div>
  <div class="kv"><span class="k">branch</span><span class="v">nhánh — một đường chương trình có thể đi.</span></div>
  <div class="kv"><span class="k">early return</span><span class="v">trả về sớm — thoát hàm ngay khi xong.</span></div>
  <div class="kv"><span class="k">short-circuit</span><span class="v">đoản mạch — dừng khi đã biết kết quả.</span></div>
  <div class="kv"><span class="k">nullish</span><span class="v">null hoặc undefined.</span></div>
  <div class="kv"><span class="k">optional chaining</span><span class="v">truy cập an toàn với ?.</span></div>
  <div class="kv"><span class="k">ternary</span><span class="v">toán tử ba ngôi — điều kiện ? a : b.</span></div>
  <div class="kv"><span class="k">fall through</span><span class="v">chạy tuột sang case sau.</span></div>
  <div class="kv"><span class="k">iteration</span><span class="v">một vòng lặp, một lượt.</span></div>
  <div class="kv"><span class="k">off-by-one</span><span class="v">lệch một — lỗi biên của vòng lặp.</span></div>
  <div class="kv"><span class="k">trace</span><span class="v">lần vết — theo dõi biến từng bước.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>An <code>if</code> chain runs the first true branch: put the strictest first.</li>
  <li><code>&amp;&amp;</code> and <code>||</code> return values and short-circuit.</li>
  <li>Use <code>??</code> for defaults, because <code>||</code> loses 0 and <code>''</code>.</li>
  <li><code>?.</code> stops safely at null or undefined.</li>
  <li><code>switch</code> needs <code>break</code>; a lookup object is often better.</li>
  <li><code>for...of</code> for values, <code>for...in</code> for object keys, <code>break</code> to stop, <code>continue</code> to skip.</li>
  <li>Standard loop: <code>i &lt; list.length</code>. Trace on paper to find off-by-one errors.</li>
</ul>
${nguon('📗', 'MDN — Conditionals', 'if, else, switch and the ternary', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Conditionals')}
${nguon('📘', 'MDN — Looping code', 'for, while, break and continue, with exercises', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Loops')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Ra quyết định và lặp lại công việc</h2>
<p class="lead">Học xong bài này bạn rẽ nhánh được bằng <code>if</code> và toán tử ba ngôi, dùng đúng <code>&amp;&amp;</code>, <code>||</code>, <code>??</code> và <code>?.</code>, chọn đúng vòng lặp, dừng hoặc bỏ qua trong vòng lặp, và lần vết một vòng lặp bằng tay để tìm lỗi. Bạn cần điều này vì hai ý này, quyết định và lặp lại, là tất cả những gì máy tính thật sự làm. Mọi tính năng bạn dựng — kiểm tra form, cộng giỏ hàng, hiển thị danh sách — đều tạo từ chúng.</p>

<h3>Bước 1 — <code>if</code>, và vì sao thứ tự nhánh quan trọng</h3>
<pre><code class="language-javascript">if (dieuKien) {
  // chạy nếu điều kiện truthy
} else if (dieuKienKhac) {
  // chạy nếu cái đầu sai và cái này đúng
} else {
  // chạy nếu không cái nào đúng
}</code></pre>
<p>Đúng một khối được chạy: khối <strong>đầu tiên</strong> đúng. Nên thứ tự rất quan trọng:</p>
${ma('javascript', CODE['4-2/xep-loai.js'])}
${ra(OUT['4-2/xep-loai'])}
<p>Điểm 9 nhận "Pass" từ hàm đầu: <code>score &gt;= 5</code> đã đúng rồi, nên nhánh "Good" không bao giờ tới được. Luật: đặt điều kiện <strong>khắt khe nhất</strong> lên trước. Để ý rằng với <code>return</code> bạn không cần <code>else</code>: return kết thúc hàm. Kiểu viết này gọi là <strong>early return (trả về sớm)</strong>, giữ mã phẳng.</p>

<h3>Bước 2 — toán tử logic trả về giá trị</h3>
<table>
<thead><tr><th>Toán tử</th><th>Nghĩa</th><th>Trả về</th></tr></thead>
<tbody>
<tr><td><code>a &amp;&amp; b</code></td><td>và</td><td><code>a</code> nếu nó falsy, ngược lại <code>b</code></td></tr>
<tr><td><code>a || b</code></td><td>hoặc</td><td><code>a</code> nếu nó truthy, ngược lại <code>b</code></td></tr>
<tr><td><code>a ?? b</code></td><td>gộp nullish</td><td><code>a</code> trừ khi nó là null hoặc undefined</td></tr>
<tr><td><code>a?.b</code></td><td>truy cập an toàn</td><td><code>undefined</code> nếu <code>a</code> là null hoặc undefined, ngược lại <code>a.b</code></td></tr>
<tr><td><code>!a</code></td><td>phủ định</td><td><code>true</code> hoặc <code>false</code></td></tr>
<tr><td><code>c ? x : y</code></td><td>ba ngôi</td><td><code>x</code> nếu <code>c</code> truthy, ngược lại <code>y</code></td></tr>
</tbody>
</table>
${ma('javascript', CODE['4-2/logic.js'])}
${ra(OUT['4-2/logic'])}
<p><code>&amp;&amp;</code> và <code>||</code> dừng ngay khi biết kết quả, gọi là <strong>short-circuit (đoản mạch)</strong>. Nên <code>user &amp;&amp; user.name</code> không bao giờ chạm tới <code>.name</code> khi <code>user</code> rỗng, và trong React, <code>isOpen &amp;&amp; &lt;Modal /&gt;</code> chỉ hiện hộp thoại khi đang mở.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng <code>||</code> cho giá trị mặc định.</strong> <code>const volume = settings.volume || 50;</code> trông đúng, cho tới khi người dùng đặt âm lượng về 0: 0 là falsy, nên họ nhận 50. Với chuỗi rỗng người dùng cố ý nhập cũng vậy. Hãy dùng <code>??</code>, chỉ thay null và undefined. Output ở trên cho thấy cả hai.</p></div>

<h3>Bước 3 — <code>switch</code>, và một cách ngắn hơn</h3>
${ma('javascript', CODE['4-2/switch.js'])}
${ra(OUT['4-2/switch'])}
<p>Dòng đầu in "Saturday Sunday": thiếu <code>break</code>, chương trình <strong>chạy tuột (fall through)</strong> xuống case sau. Đôi khi là cố ý, nhưng thường là lỗi. <code>switch</code> so bằng <code>===</code>, nên <code>'1'</code> không khớp <code>1</code>.</p>
<p>Khi mỗi case chỉ ánh xạ một khoá sang một giá trị, <strong>object tra cứu</strong> ngắn hơn và không thể chạy tuột. Thêm một case cũng chỉ là đổi dữ liệu, không phải đổi mã.</p>

<h3>Bước 4 — vòng lặp</h3>
${ma('javascript', CODE['4-2/vong-lap.js'])}
${ra(OUT['4-2/vong-lap'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Khởi đầu</span><span class="lz-d"><code>let i = 0</code> chạy một lần.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm</span><span class="lz-d"><code>i &lt; list.length</code>. Nếu sai, vòng lặp kết thúc.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thân</span><span class="lz-d">Mã bên trong chạy một lần.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cập nhật</span><span class="lz-d"><code>i++</code>, rồi quay lại bước 2.</span></div>
</div>
<table>
<thead><tr><th>Bạn cần</th><th>Dùng</th></tr></thead>
<tbody>
<tr><td>Từng giá trị của danh sách</td><td><code>for (const x of list)</code></td></tr>
<tr><td>Cả chỉ số</td><td><code>for</code> cổ điển, hoặc <code>list.forEach((x, i) =&gt; …)</code></td></tr>
<tr><td>Danh sách mới từ danh sách cũ</td><td><code>map</code>, <code>filter</code> (Bài 4.4)</td></tr>
<tr><td>Lặp tới khi có chuyện gì đó</td><td><code>while</code></td></tr>
<tr><td>Dừng sớm</td><td><code>for</code> / <code>for...of</code> với <code>break</code>. <code>forEach</code> không dừng được</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — vòng lặp vô hạn.</strong> <code>while (n &gt; 0) { console.log(n); }</code> quên đổi <code>n</code>. Điều kiện đúng mãi, trang đơ, và bạn phải đóng thẻ. Trong <code>while</code>, hãy chắc rằng mọi đường đi qua thân đều tiến về lối thoát. Nếu thẻ bị đơ, hãy kiểm vòng lặp bạn vừa viết.</p></div>

<h3>Bước 5 — <code>for...in</code> không dành cho mảng</h3>
${ma('javascript', CODE['4-2/for-in-bay.js'])}
${ra(OUT['4-2/for-in-bay'])}
<p><code>for...in</code> đi qua <strong>khoá</strong>, dạng chuỗi, kể cả thuộc tính thừa. Với mảng bạn muốn giá trị, và <code>'0' + 1</code> sẽ nối chữ. Mẹo nhớ: <strong>of = giá trị, in = khoá</strong>. Dùng <code>for...of</code> cho mảng; với object, dùng <code>for...in</code> hoặc tốt hơn là <code>Object.entries</code>.</p>

<h3>Bước 6 — lệch một, và cách lần vết</h3>
${ma('javascript', CODE['4-2/lech-mot.js'])}
${ra(OUT['4-2/lech-mot'])}
<p>Vòng đầu dùng <code>&lt;=</code>, và đọc <code>nums[3]</code>, thứ không tồn tại. JavaScript không chặn bạn; bạn chỉ nhận <code>undefined</code>. Mảng 3 phần tử có chỉ số 0, 1, 2, nên dạng chuẩn là <code>i &lt; list.length</code>.</p>
<p>Thuốc chữa lỗi vòng lặp là <strong>lần vết (trace)</strong>: lấy một đầu vào tí hon, và viết bảng mọi biến sau mỗi vòng, bằng tay. Nửa dưới output là một bảng như vậy. Nếu bảng của bạn khác của chương trình, dòng khác đầu tiên chính là chỗ hiểu sai.</p>

<h3>Bước 7 — cả hai ý cùng lúc: FizzBuzz</h3>
<p>Đây là câu khởi động kinh điển: in từ 1 tới 15, nhưng bội của 3 thành Fizz, bội của 5 thành Buzz, và bội của cả hai thành FizzBuzz.</p>
${ma('javascript', CODE['4-2/fizzbuzz.js'])}
${ra(OUT['4-2/fizzbuzz'])}
<p><code>%</code> là toán tử lấy dư: <code>i % 3 === 0</code> nghĩa là "chia hết cho 3". Bẫy nằm ở thứ tự: kiểm 15 <em>trước</em>, nếu không nhánh của 3 sẽ bắt mất, đúng như Bước 1.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — lần vết, rồi viết</strong></p>
<p>Không chạy, hãy điền bảng <code>i</code>, <code>total</code> và <code>max</code> sau mỗi vòng:</p>
<pre><code class="language-javascript">const a = [4, 9, 2];
let total = 0, max = a[0];
for (let i = 0; i &lt; a.length; i++) {
  total += a[i];
  if (a[i] &gt; max) max = a[i];
}
console.log(total, max);</code></pre>
<ol>
<li>Chạy và so với bảng của bạn.</li>
<li>Viết <code>grade(score)</code> trả về A (9+), B (7+), C (5+), hoặc F, dùng early return.</li>
<li>Viết <code>countVowels(text)</code> bằng <code>for...of</code>.</li>
<li>In số đầu tiên lớn hơn 100 chia hết cho 7, dùng <code>while</code> hoặc <code>break</code>.</li>
</ol>
<p>Gợi ý: <code>'aeiou'.includes(letter.toLowerCase())</code>.</p>
<p><strong>Xong khi:</strong> bảng của bạn khớp và output là <code>15 9</code>; <code>grade(9)</code> là A và <code>grade(4)</code> là F; <code>countVowels('Web Foundations')</code> là 6; và chương trình cuối in 105. Sau đó làm module Code Lab 4.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">condition</span><span class="v">điều kiện — biểu thức đúng hoặc sai.</span></div>
  <div class="kv"><span class="k">branch</span><span class="v">nhánh — một đường chương trình có thể đi.</span></div>
  <div class="kv"><span class="k">early return</span><span class="v">trả về sớm — thoát hàm ngay khi xong.</span></div>
  <div class="kv"><span class="k">short-circuit</span><span class="v">đoản mạch — dừng khi đã biết kết quả.</span></div>
  <div class="kv"><span class="k">nullish</span><span class="v">null hoặc undefined.</span></div>
  <div class="kv"><span class="k">optional chaining</span><span class="v">truy cập an toàn với ?.</span></div>
  <div class="kv"><span class="k">ternary</span><span class="v">toán tử ba ngôi — điều kiện ? a : b.</span></div>
  <div class="kv"><span class="k">fall through</span><span class="v">chạy tuột sang case sau.</span></div>
  <div class="kv"><span class="k">iteration</span><span class="v">một vòng lặp, một lượt.</span></div>
  <div class="kv"><span class="k">off-by-one</span><span class="v">lệch một — lỗi biên của vòng lặp.</span></div>
  <div class="kv"><span class="k">trace</span><span class="v">lần vết — theo dõi biến từng bước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Chuỗi <code>if</code> chạy nhánh đúng đầu tiên: đặt cái khắt khe nhất lên trước.</li>
  <li><code>&amp;&amp;</code> và <code>||</code> trả về giá trị và đoản mạch.</li>
  <li>Dùng <code>??</code> cho mặc định, vì <code>||</code> làm mất 0 và <code>''</code>.</li>
  <li><code>?.</code> dừng an toàn ở null hoặc undefined.</li>
  <li><code>switch</code> cần <code>break</code>; object tra cứu thường tốt hơn.</li>
  <li><code>for...of</code> cho giá trị, <code>for...in</code> cho khoá object, <code>break</code> để dừng, <code>continue</code> để bỏ qua.</li>
  <li>Vòng lặp chuẩn: <code>i &lt; list.length</code>. Lần vết trên giấy để tìm lỗi lệch một.</li>
</ul>
${nguon('📗', 'MDN — Conditionals', 'if, else, switch và toán tử ba ngôi', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Conditionals')}
${nguon('📘', 'MDN — Looping code', 'for, while, break và continue, kèm bài tập', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Loops')}
</div>
`,
};
