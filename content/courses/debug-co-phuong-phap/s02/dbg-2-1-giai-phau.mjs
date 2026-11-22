/**
 * 2.1 — Giải phẫu stack trace (soạn 22/11/2026). Output chạy THẬT /tmp/dbg-lab/ch2/2-1 (Node v26.8.1): 3 tệp + một
 * "thư viện" giả trong node_modules/mini-tien; lọc dòng của mình bằng grep. Đúng 10 dòng "at" = Error.stackTraceLimit mặc định.
 * Không trùng web-foundations 10.2 (stack trace qua 3 tệp mức nhập môn) — ở đây: frame trên cùng ≠ nguyên nhân, lọc, giới hạn.
 */
import { nguon, lienKet } from '../_chung.mjs';

const MA = `<pre><code class="language-js">// node_modules/mini-tien/index.js — "someone else's" library: format VND
function dinhDang(soTien) {
  return soTien.toLocaleString('vi-VN') + ' ₫';
}
module.exports = { dinhDang };</code></pre>
<pre><code class="language-js">// dich-vu/hoa-don.js
const { dinhDang } = require('mini-tien');

function dongHoaDon(mon) {
  return &#96;&#36;{mon.ten}: &#36;{dinhDang(mon.gia)}&#96;;
}
function inHoaDon(gioHang) {
  return gioHang.map(dongHoaDon).join('\\n');
}
module.exports = { inHoaDon };</code></pre>
<pre><code class="language-js">// app.js
const { inHoaDon } = require('./dich-vu/hoa-don.js');

const gioHang = [
  { ten: 'Cà phê', gia: 35000 },
  { ten: 'Bánh mì', giaTien: 25000 },      // someone used a different field name
];
console.log(inHoaDon(gioHang));</code></pre>`;

const OUT = `<div class="out">$ node app.js
/private/tmp/dbg-lab/ch2/2-1/node_modules/mini-tien/index.js:3
  return soTien.toLocaleString('vi-VN') + ' ₫';
                ^

TypeError: Cannot read properties of undefined (reading 'toLocaleString')
    at dinhDang (/private/tmp/dbg-lab/ch2/2-1/node_modules/mini-tien/index.js:3:17)
    at dongHoaDon (/private/tmp/dbg-lab/ch2/2-1/dich-vu/hoa-don.js:4:25)
    at Array.map (&lt;anonymous&gt;)
    at inHoaDon (/private/tmp/dbg-lab/ch2/2-1/dich-vu/hoa-don.js:7:18)
    at Object.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch2/2-1/app.js:7:13)
    at Module._compile (node:internal/modules/cjs/loader:1934:14)
    at Object..js (node:internal/modules/cjs/loader:2074:10)
    at Module.load (node:internal/modules/cjs/loader:1656:32)
    at Module._load (node:internal/modules/cjs/loader:1448:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)

Node.js v26.8.1</div>`;

const OUT_LOC = `<div class="out">$ node app.js 2&gt;&amp;1 | grep -E "^\\s+at " | grep -v -E "node_modules|node:"
    at dongHoaDon (/private/tmp/dbg-lab/ch2/2-1/dich-vu/hoa-don.js:4:25)
    at Array.map (&lt;anonymous&gt;)
    at inHoaDon (/private/tmp/dbg-lab/ch2/2-1/dich-vu/hoa-don.js:7:18)
    at Object.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch2/2-1/app.js:7:13)</div>`;

const NGUON = [
  nguon('🟢', 'Node.js — Errors: error.stack and Error.stackTraceLimit', 'Định dạng mỗi dòng "at …", và giới hạn mặc định 10 khung.', 'https://nodejs.org/api/errors.html#errorstack'),
  nguon('📗', 'MDN — Call stack', 'Ngăn xếp lời gọi là gì, giải thích ngắn gọn.', 'https://developer.mozilla.org/en-US/docs/Glossary/Call_stack'),
  lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Web Foundations 10.2 — đọc một stack trace qua ba tệp', sub: 'Bản nhập môn. Bài này thêm: frame trên cùng không phải nguyên nhân, lọc theo dự án, giới hạn số khung.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '2.1 — Anatomy of a stack trace: frames, order, and which line is yours|||2.1 — Giải phẫu stack trace: frame, thứ tự đọc, dòng nào là code của bạn',
  slug: 'dbg-2-1-giai-phau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Call stack như chồng đĩa, mỗi dòng "at" là một frame; frame trên cùng là nơi lỗi NỔ chứ chưa chắc là nơi lỗi SINH (chạy thật: lỗi nổ trong node_modules, nguyên nhân ở app.js); lọc dòng của dự án bằng grep; giới hạn 10 khung; thứ tự đọc Java/JS vs Python.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>A stack trace is a list of who called whom — and the top line is rarely the culprit</h2>
<p class="lead">A stack trace looks like a wall of text, but it has a simple structure: one line per function call that was in progress when the error happened. Once you see that structure, a 40-line trace usually shrinks to two or three lines that matter — the ones in <em>your</em> code. This lesson teaches the structure on a real Node.js trace where the error explodes inside a library but was caused in your own file.</p>

<h3>An everyday picture: a stack of plates</h3>
<p>In a restaurant kitchen, each new plate goes on top of the stack, and you can only take the top one off. A program's <strong>call stack</strong> works the same way: <code>app.js</code> calls <code>inHoaDon</code> (a plate), which calls <code>dongHoaDon</code> (another plate on top), which calls <code>dinhDang</code> (on top). When <code>dinhDang</code> crashes, the runtime photographs the whole stack, top to bottom. That photo is the stack trace. Each plate is a <strong>frame</strong>: one function, with the file, line and column where it currently is.</p>

<h3>A real trace</h3>
<p>Three files: your app, your invoice service, and a small currency library in <code>node_modules</code> (written by "someone else").</p>
${MA}
${OUT}

<h3>Reading it part by part</h3>
<table>
<thead><tr><th>Part</th><th>Here</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Source excerpt + <code>^</code></td><td><code>soTien.toLocaleString</code></td><td>The exact column where it exploded</td></tr>
<tr><td>Type: message</td><td><code>TypeError: Cannot read properties of undefined (reading 'toLocaleString')</code></td><td>Something was <code>undefined</code>, and we tried to read <code>.toLocaleString</code> from it</td></tr>
<tr><td>Top frame</td><td><code>dinhDang … mini-tien/index.js:3:17</code></td><td>Where it exploded (most recent call)</td></tr>
<tr><td>Next frames</td><td><code>dongHoaDon</code> → <code>Array.map</code> → <code>inHoaDon</code> → <code>app.js:7</code></td><td>Who called whom, newest first</td></tr>
<tr><td>Runtime frames</td><td><code>node:internal/…</code></td><td>Node itself loading your file — almost never relevant</td></tr>
</tbody>
</table>
<p>Format of one frame: <code>at functionName (path:line:column)</code>. <code>&lt;anonymous&gt;</code> means no file (here: the built-in <code>Array.map</code>); <code>Object.&lt;anonymous&gt;</code> is the top level of a CommonJS file.</p>

<h3>The top frame is where it exploded, not where it was caused</h3>
<p>The top frame points into the library. A beginner opens <code>mini-tien/index.js</code>, sees nothing wrong, and starts blaming the library — or worse, edits it. But the library did its job: it was handed <code>undefined</code>. Walk down the stack and ask at each of <em>your</em> frames: "what did I pass?" At <code>hoa-don.js:4:25</code> we pass <code>mon.gia</code>. For the second item, <code>gia</code> does not exist — the data in <code>app.js</code> says <code>giaTien</code>. The <strong>cause</strong> is in the data (<code>app.js</code>), the <strong>explosion</strong> in the library, and the right fix is in your code: correct the field name, and validate input at the boundary.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "the library is broken".</strong> Widely used libraries do have bugs, but when the top frame is in a library, the overwhelmingly likely cause is the value your code passed into it. Check your first frame below the library before suspecting the library.</p></div>

<h3>Find your lines fast: filter by your project</h3>
<p>In a real Spring or Express app, a trace can be 100+ lines and only 2–5 are yours. Filter out what is not yours — the library folder and the runtime:</p>
${OUT_LOC}
<p>Four lines, and the first of them is where to start reading. IDEs do the same visually: IntelliJ greys out library frames and highlights your own in blue; VS Code's call stack panel collapses library frames (Chapter 3). In Java the filter is your package name, for example <code>grep "com.ctw."</code>.</p>

<h3>Two details that catch people</h3>
<ul>
<li><strong>The trace is cut at 10 frames by default</strong> in Node (and V8 browsers): count the "at" lines above — exactly ten. In deep call chains your own frame may be cut off. Run with <code>node --stack-trace-limit=50 app.js</code> to see more. Java prints all frames but folds repeated ones as <code>... 14 more</code> (lesson 2.2).</li>
<li><strong>Order differs by language.</strong> Java and JavaScript print the most recent call <em>first</em> (top). Python prints it <em>last</em> ("most recent call last", lesson 2.4). Always check which way you are reading.</li>
</ul>

<h3>🧪 Practice (15 min) — highlight your lines in five real traces</h3>
<div class="callout ok">
<ol>
<li>Recreate the three files above in <code>~/dbg-lab/ch2/2-1</code> (create <code>node_modules/mini-tien/index.js</code> by hand) and run <code>node app.js</code>.</li>
<li>Copy the trace into a text file and mark each line as <em>mine</em>, <em>library</em> or <em>runtime</em>. Then run the <code>grep</code> filter and compare.</li>
<li>Do the same for the three traces you produced in lesson 0.1 (<code>tong-tien.js</code> has none — why?), <code>nguoi_dung.py</code> and <code>DonHang.java</code>.</li>
<li>For the Node trace, write one sentence for each: where it <em>exploded</em>, where it was <em>caused</em>, and the fix you would make.</li>
</ol>
<p><strong>Done when:</strong> each trace has its own lines marked, you explained why <code>tong-tien.js</code> produced no trace (wrong result, no exception), and your three sentences name <code>mini-tien/index.js:3</code> as explosion and the <code>giaTien</code> field in <code>app.js</code> as cause.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">call stack</span><span class="v">The calls currently in progress, newest on top.</span></div>
  <div class="kv"><span class="k">frame</span><span class="v">One entry of the stack: a function plus file:line:column.</span></div>
  <div class="kv"><span class="k">stack trace</span><span class="v">A snapshot of the call stack at the moment of the error.</span></div>
  <div class="kv"><span class="k">top frame</span><span class="v">The most recent call — where the error was thrown.</span></div>
  <div class="kv"><span class="k">library frame</span><span class="v">A frame from code you did not write (node_modules, a JAR, the runtime).</span></div>
  <div class="kv"><span class="k">stack trace limit</span><span class="v">The maximum frames recorded (Node default: 10).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One "at" line = one frame = one function call in progress.</li>
<li>Java/JS: newest first; Python: newest last.</li>
<li>The top frame shows where it exploded; walk down to your first frame to find where it was caused.</li>
<li>Filter out library and runtime frames (<code>grep -v node_modules</code>, your Java package name).</li>
<li>Node keeps only 10 frames by default; raise it with <code>--stack-trace-limit</code>.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Stack trace là danh sách ai gọi ai — và dòng trên cùng hiếm khi là thủ phạm</h2>
<p class="lead">Stack trace (dấu vết ngăn xếp lời gọi) trông như một bức tường chữ, nhưng cấu trúc của nó đơn giản: mỗi dòng là một lời gọi hàm đang dở dang lúc lỗi xảy ra. Thấy được cấu trúc đó rồi thì một trace 40 dòng thường co lại còn hai ba dòng đáng đọc — những dòng thuộc code <em>của bạn</em>. Bài này dạy cấu trúc đó trên một trace Node.js thật, nơi lỗi nổ bên trong thư viện nhưng nguyên nhân lại nằm trong tệp của chính bạn.</p>

<h3>Liên tưởng đời thường: chồng đĩa</h3>
<p>Trong bếp nhà hàng, đĩa mới luôn đặt lên trên cùng, và chỉ lấy được đĩa trên cùng. <strong>Call stack (ngăn xếp lời gọi)</strong> của chương trình cũng vậy: <code>app.js</code> gọi <code>inHoaDon</code> (một đĩa), hàm này gọi <code>dongHoaDon</code> (đĩa nữa đặt lên trên), hàm này gọi <code>dinhDang</code> (trên cùng). Khi <code>dinhDang</code> sập, môi trường chạy chụp lại cả chồng đĩa, từ trên xuống. Tấm ảnh đó là stack trace. Mỗi đĩa là một <strong>frame (khung)</strong>: một hàm, kèm tệp, dòng, cột mà nó đang đứng.</p>

<h3>Một trace thật</h3>
<p>Ba tệp: ứng dụng của bạn, service hoá đơn của bạn, và một thư viện tiền tệ nhỏ trong <code>node_modules</code> (do "người khác" viết).</p>
${MA}
${OUT}

<h3>Đọc từng phần</h3>
<table>
<thead><tr><th>Phần</th><th>Ở đây</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td>Trích mã nguồn + <code>^</code></td><td><code>soTien.toLocaleString</code></td><td>Đúng cột nơi nó nổ</td></tr>
<tr><td>Loại: thông điệp</td><td><code>TypeError: Cannot read properties of undefined (reading 'toLocaleString')</code></td><td>Có thứ là <code>undefined</code>, và ta cố đọc <code>.toLocaleString</code> từ nó</td></tr>
<tr><td>Frame trên cùng</td><td><code>dinhDang … mini-tien/index.js:3:17</code></td><td>Nơi nó nổ (lời gọi gần nhất)</td></tr>
<tr><td>Các frame sau</td><td><code>dongHoaDon</code> → <code>Array.map</code> → <code>inHoaDon</code> → <code>app.js:7</code></td><td>Ai gọi ai, mới nhất trước</td></tr>
<tr><td>Frame của môi trường chạy</td><td><code>node:internal/…</code></td><td>Node đang nạp tệp của bạn — gần như không bao giờ liên quan</td></tr>
</tbody>
</table>
<p>Dạng của một frame: <code>at tênHàm (đường-dẫn:dòng:cột)</code>. <code>&lt;anonymous&gt;</code> nghĩa là không có tệp (ở đây: hàm có sẵn <code>Array.map</code>); <code>Object.&lt;anonymous&gt;</code> là phần cấp cao nhất của một tệp CommonJS.</p>

<h3>Frame trên cùng là nơi NỔ, không phải nơi SINH ra lỗi</h3>
<p>Frame trên cùng chỉ vào thư viện. Người mới mở <code>mini-tien/index.js</code>, không thấy gì sai, rồi bắt đầu đổ cho thư viện — tệ hơn nữa là sửa nó. Nhưng thư viện đã làm đúng việc: nó được đưa vào <code>undefined</code>. Đi dần xuống stack và hỏi ở mỗi frame <em>của bạn</em>: "mình đã truyền gì?" Ở <code>hoa-don.js:4:25</code> ta truyền <code>mon.gia</code>. Với món thứ hai, <code>gia</code> không tồn tại — dữ liệu trong <code>app.js</code> ghi là <code>giaTien</code>. <strong>Nguyên nhân</strong> nằm ở dữ liệu (<code>app.js</code>), <strong>chỗ nổ</strong> ở thư viện, còn bản sửa đúng nằm trong code của bạn: sửa tên trường, và kiểm dữ liệu đầu vào ngay ở ranh giới.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "thư viện bị lỗi".</strong> Thư viện phổ biến cũng có bug, nhưng khi frame trên cùng nằm trong thư viện, khả năng áp đảo là do giá trị code của bạn truyền vào. Kiểm frame đầu tiên của bạn nằm ngay dưới thư viện trước khi nghi ngờ thư viện.</p></div>

<h3>Tìm nhanh dòng của mình: lọc theo dự án</h3>
<p>Trong một ứng dụng Spring hay Express thật, trace có thể dài hơn 100 dòng mà chỉ 2–5 dòng là của bạn. Lọc bỏ những gì không phải của mình — thư mục thư viện và môi trường chạy:</p>
${OUT_LOC}
<p>Còn bốn dòng, và dòng đầu là chỗ bắt đầu đọc. IDE làm việc này bằng mắt: IntelliJ tô xám frame thư viện, tô xanh frame của bạn; bảng call stack của VS Code thu gọn frame thư viện (Chương 3). Trong Java, bộ lọc là tên package của bạn, ví dụ <code>grep "com.ctw."</code>.</p>

<h3>Hai chi tiết hay làm người ta vấp</h3>
<ul>
<li><strong>Trace bị cắt ở 10 frame theo mặc định</strong> trong Node (và trình duyệt dùng V8): đếm các dòng "at" ở trên — đúng mười. Chuỗi gọi sâu thì frame của bạn có thể bị cắt mất. Chạy <code>node --stack-trace-limit=50 app.js</code> để thấy nhiều hơn. Java in hết các frame nhưng gộp phần lặp lại thành <code>... 14 more</code> (bài 2.2).</li>
<li><strong>Thứ tự khác nhau theo ngôn ngữ.</strong> Java và JavaScript in lời gọi gần nhất <em>trước</em> (trên cùng). Python in nó <em>sau cùng</em> ("most recent call last", bài 2.4). Luôn kiểm mình đang đọc theo chiều nào.</li>
</ul>

<h3>🧪 Thực hành (15 phút) — tô dòng của mình trong năm trace thật</h3>
<div class="callout ok">
<ol>
<li>Dựng lại ba tệp trên trong <code>~/dbg-lab/ch2/2-1</code> (tự tạo <code>node_modules/mini-tien/index.js</code> bằng tay) và chạy <code>node app.js</code>.</li>
<li>Chép trace vào một tệp chữ và đánh dấu từng dòng là <em>của mình</em>, <em>thư viện</em> hay <em>môi trường chạy</em>. Rồi chạy lệnh lọc <code>grep</code> và so sánh.</li>
<li>Làm y vậy với các trace bạn đã tạo ở bài 0.1 (<code>tong-tien.js</code> không có trace — vì sao?), <code>nguoi_dung.py</code> và <code>DonHang.java</code>.</li>
<li>Với trace Node, viết mỗi thứ một câu: lỗi <em>nổ</em> ở đâu, <em>sinh ra</em> ở đâu, và bạn sẽ sửa gì.</li>
</ol>
<p><strong>Đạt khi:</strong> trace nào cũng đã đánh dấu dòng của mình, bạn giải thích được vì sao <code>tong-tien.js</code> không có trace (kết quả sai, không có ngoại lệ), và ba câu của bạn gọi <code>mini-tien/index.js:3</code> là chỗ nổ, trường <code>giaTien</code> trong <code>app.js</code> là nguyên nhân.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">call stack (ngăn xếp lời gọi)</span><span class="v">Các lời gọi đang dở, mới nhất ở trên.</span></div>
  <div class="kv"><span class="k">frame (khung)</span><span class="v">Một mục trong ngăn xếp: một hàm kèm tệp:dòng:cột.</span></div>
  <div class="kv"><span class="k">stack trace (dấu vết ngăn xếp)</span><span class="v">Ảnh chụp ngăn xếp lời gọi đúng lúc lỗi xảy ra.</span></div>
  <div class="kv"><span class="k">top frame (frame trên cùng)</span><span class="v">Lời gọi gần nhất — nơi lỗi được ném ra.</span></div>
  <div class="kv"><span class="k">library frame (frame thư viện)</span><span class="v">Frame của code không do bạn viết (node_modules, tệp JAR, môi trường chạy).</span></div>
  <div class="kv"><span class="k">stack trace limit (giới hạn số khung)</span><span class="v">Số frame tối đa được ghi lại (Node mặc định: 10).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một dòng "at" = một frame = một lời gọi hàm đang dở.</li>
<li>Java/JS: mới nhất trước; Python: mới nhất sau cùng.</li>
<li>Frame trên cùng cho biết chỗ nổ; đi xuống tới frame đầu tiên của bạn để tìm chỗ sinh ra lỗi.</li>
<li>Lọc bỏ frame thư viện và môi trường chạy (<code>grep -v node_modules</code>, tên package Java của bạn).</li>
<li>Node chỉ giữ 10 frame theo mặc định; tăng bằng <code>--stack-trace-limit</code>.</li>
</ul>
${NGUON}
</div>
`,
};
