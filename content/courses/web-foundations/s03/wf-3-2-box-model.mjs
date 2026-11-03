/**
 * Bài 3.2 — Mô hình hộp (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/3-2).
 * Deck: scripts/slides-src/wf-3-2.mjs (10 slide, WF/v1/wf-3-2). Code Lab: module 3.2 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-3-2', 'The box model', 'Mô hình hộp', [
  [1, 'The box model',
    '<p>To the browser, every element is a rectangle. Once you see boxes instead of text and pictures, layout stops being mysterious. This lesson covers how a box is built, how big it really is, and why boxes sometimes do surprising things to the space around them.</p>',
    '<p>Với trình duyệt, mọi phần tử đều là một hình chữ nhật. Khi bạn nhìn thấy các hộp thay vì chữ và ảnh, bố cục không còn bí ẩn. Bài này dạy một hộp được dựng thế nào, nó thật sự lớn bao nhiêu, và vì sao đôi khi hộp làm những điều bất ngờ với khoảng trống quanh nó.</p>'],
  [2, 'After this lesson you can…',
    '<p>The biggest time-saver here is <code>box-sizing</code>: one line that makes every width mean what you think it means. The others explain common puzzles: why a gap is smaller than you asked for, why <code>width</code> does nothing on a <code>span</code>, and why a long link breaks your layout.</p>',
    '<p>Thứ tiết kiệm thời gian nhất ở đây là <code>box-sizing</code>: một dòng khiến mọi bề rộng đúng với điều bạn nghĩ. Những phần khác giải thích các câu đố thường gặp: vì sao khoảng cách nhỏ hơn bạn yêu cầu, vì sao <code>width</code> chẳng có tác dụng gì trên <code>span</code>, và vì sao một liên kết dài làm vỡ bố cục.</p>'],
  [3, 'Four layers of a box',
    '<p>From the inside out: content, padding, border, margin. Padding is inside the border and takes the background colour; margin is outside and is always transparent. DevTools draws exactly this diagram for any element in the Computed tab.</p>',
    '<p>Từ trong ra ngoài: nội dung, padding, viền, margin. Padding nằm trong viền và nhận màu nền; margin nằm ngoài và luôn trong suốt. DevTools vẽ đúng sơ đồ này cho mọi phần tử trong thẻ Computed.</p>'],
  [4, 'width: 300px is not always 300 pixels',
    '<p>Both boxes say 300 pixels. By default the browser adds padding and border on top, so the first box is drawn 350 wide. With <code>box-sizing: border-box</code> the 300 includes them, and the second box really is 300. That is why almost every project starts with this rule.</p>',
    '<p>Cả hai hộp đều ghi 300 điểm ảnh. Mặc định trình duyệt cộng thêm padding và viền, nên hộp đầu được vẽ rộng 350. Với <code>box-sizing: border-box</code>, con số 300 đã gồm chúng, và hộp thứ hai đúng là 300. Vì vậy gần như mọi dự án đều bắt đầu bằng luật này.</p>'],
  [5, 'Shorthand and centring',
    '<p>Margin and padding accept one to four values. Four go clockwise from the top; two mean vertical and horizontal. The classic way to centre a block is a width plus <code>margin: 0 auto</code>, where the browser shares the free space equally between left and right.</p>',
    '<p>Margin và padding nhận từ một tới bốn giá trị. Bốn giá trị đi theo chiều kim đồng hồ từ trên xuống; hai giá trị là dọc và ngang. Cách kinh điển để căn giữa một khối là đặt bề rộng cộng <code>margin: 0 auto</code>, trình duyệt chia đều khoảng trống cho hai bên.</p>'],
  [6, 'Margins collapse',
    '<p>One box asks for 30 pixels below, the next for 20 above, and the gap is 30, not 50. Vertical margins between blocks collapse to the larger one. Worse, a child’s top margin can escape through its parent, as the second measurement shows. A flow root or padding contains it.</p>',
    '<p>Một hộp xin 30 điểm ảnh bên dưới, hộp sau xin 20 bên trên, và khoảng cách là 30, không phải 50. Margin dọc giữa các khối gộp lại thành cái lớn hơn. Tệ hơn, margin trên của con có thể thoát qua cha, như phép đo thứ hai cho thấy. Một flow root hoặc padding sẽ giữ nó lại.</p>'],
  [7, 'block, inline, inline-block',
    '<p>Display decides how a box behaves in the flow. The block box takes a whole line and respects its size. The inline one ignored width and height completely: 120 by 40 became 48 by 28. Inline-block sits in a line and respects its size. Flex and grid come next.</p>',
    '<p>Display quyết định hộp cư xử thế nào trong luồng. Hộp block chiếm cả dòng và tôn trọng kích thước. Hộp inline bỏ qua hoàn toàn width và height: 120 nhân 40 thành 48 nhân 28. Inline-block nằm trong dòng mà vẫn tôn trọng kích thước. Flex và grid đến ở bài sau.</p>'],
  [8, 'When content does not fit',
    '<p>A long address has no spaces to break at, so it pokes out of its box. Here the content is 555 pixels in a 272-pixel box. <code>overflow-wrap: anywhere</code> lets it wrap, and <code>text-overflow: ellipsis</code> cuts a title with dots. Without a fixed height, boxes grow by themselves.</p>',
    '<p>Một địa chỉ dài không có dấu cách để ngắt, nên nó thò ra khỏi hộp. Ở đây nội dung rộng 555 điểm ảnh trong hộp 272. <code>overflow-wrap: anywhere</code> cho phép nó xuống dòng, còn <code>text-overflow: ellipsis</code> cắt tiêu đề bằng dấu ba chấm. Không đặt chiều cao cố định thì hộp tự lớn lên.</p>'],
  [9, 'Three ways to hide',
    '<p>All three make an element invisible, but they are not the same. <code>display: none</code> removes it from the page. <code>visibility: hidden</code> keeps its space. <code>opacity: 0</code> is the dangerous one: invisible, but still clickable and still reachable by Tab.</p>',
    '<p>Cả ba đều làm phần tử vô hình, nhưng không giống nhau. <code>display: none</code> gỡ nó khỏi trang. <code>visibility: hidden</code> giữ chỗ của nó. <code>opacity: 0</code> là cái nguy hiểm: vô hình mà vẫn bấm được và Tab vẫn tới được.</p>'],
  [10, 'Summary & practice',
    '<p>The practice builds a pricing card and then measures it. "Done when" uses <code>offsetWidth</code> and the box diagram in DevTools, so you confirm the numbers instead of trusting your eyes.</p>',
    '<p>Bài luyện dựng một thẻ bảng giá rồi đo nó. "Xong khi" dùng <code>offsetWidth</code> và sơ đồ hộp trong DevTools, để bạn xác nhận con số thay vì tin vào mắt.</p>'],
]);

export default {
  title: '3.2 — The box model: every element is a box|||3.2 — Mô hình hộp: mọi phần tử là một cái hộp',
  slug: 'wf-3-2-box-model',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/rIO5326FgPE', durationSeconds: 0 },
  description: 'Bốn lớp của một hộp, box-sizing (đo 350px so với 300px), viết tắt và căn giữa, margin gộp và thoát khỏi cha (đo thật), block/inline/inline-block, nội dung tràn hộp, ba cách ẩn phần tử và khác biệt đo được, đọc sơ đồ hộp trong DevTools.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Every element is a box</h2>
<p class="lead">After this lesson you can read the box of any element in DevTools, make widths mean what you think with one line of CSS, use margin and padding correctly, centre a block, explain why two margins do not add up, and handle content that does not fit. You need this because layout is arranging boxes. Almost every "why is this 20 pixels off?" question is answered by this lesson, and everything in Flexbox and Grid builds on it.</p>

<h3>Step 1 — four layers</h3>
<p>To the browser, everything is a rectangle, even a single word. Each box has four layers:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">margin</span><span class="lz-t">outside the box</span><span class="lz-d">Empty space between this box and its neighbours. Always transparent.</span></div>
<div class="lz-layer"><span class="lz-k">border</span><span class="lz-t">the edge</span><span class="lz-d">A line drawn around the padding.</span></div>
<div class="lz-layer"><span class="lz-k">padding</span><span class="lz-t">inside the box</span><span class="lz-d">Space between the content and the border. It shows the background colour.</span></div>
<div class="lz-layer"><span class="lz-k">content</span><span class="lz-t">the actual thing</span><span class="lz-d">Text, an image, child elements.</span></div>
</div>
<p>To see it, right-click any element, choose <strong>Inspect</strong>, open the <strong>Computed</strong> tab. At the top is a diagram with the real numbers of all four layers. Hovering over an element in Elements colours its margin orange and its padding green on the page. A useful trick while learning: add <code>* { outline: 1px solid red; }</code> to see every box at once. Unlike a border, an outline takes no space, so it does not change the layout.</p>

<h3>Step 2 — how wide is <code>width: 300px</code>?</h3>
${ma('html', CODE['3-2/hop.html'], [5, 8])}
${ra(OUT['3-2/hop'])}
<p>Both boxes have <code>width: 300px</code>, 20 pixels of padding and a 5-pixel border. The first is drawn <strong>350 pixels</strong> wide: 300 + 20 + 20 + 5 + 5. By default, <code>width</code> means the <em>content</em> only, and everything else is added on top. Add a padding later and your layout breaks.</p>
<p>The second uses <code>box-sizing: border-box</code>: 300 is the whole box, and the content shrinks to make room (250). This is what people expect, so nearly every project starts with these lines:</p>
<pre><code class="language-css">*, *::before, *::after {
  box-sizing: border-box;
}</code></pre>
<p>This is the first line of the starter stylesheet in Lesson 3.1, and CSS frameworks such as Tailwind and Bootstrap all include it.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — two 50% columns that do not fit.</strong> Two columns at <code>width: 50%</code> with <code>padding: 20px</code> and default sizing add up to 100% + 80 pixels, so the second column falls below the first. You then try 49%, then 48%. <code>border-box</code> makes the padding part of the 50%, and the problem disappears.</p></div>

<h3>Step 3 — shorthand, and centring a block</h3>
<table>
<thead><tr><th>You write</th><th>Top</th><th>Right</th><th>Bottom</th><th>Left</th></tr></thead>
<tbody>
<tr><td><code>margin: 10px</code></td><td>10</td><td>10</td><td>10</td><td>10</td></tr>
<tr><td><code>margin: 10px 20px</code></td><td>10</td><td>20</td><td>10</td><td>20</td></tr>
<tr><td><code>margin: 10px 20px 30px</code></td><td>10</td><td>20</td><td>30</td><td>20</td></tr>
<tr><td><code>margin: 1px 2px 3px 4px</code></td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
</tbody>
</table>
<p>Four values go <strong>clockwise from the top</strong>. <code>margin-top</code> and the like set a single side. Negative margins are allowed and pull boxes together; padding cannot be negative.</p>
<pre><code class="language-css">.page {
  max-width: 800px;     /* never wider than this */
  margin: 0 auto;       /* share the free space left and right */
  padding: 0 16px;      /* do not touch the edges on a phone */
}</code></pre>
<p><code>auto</code> tells the browser to divide the free space equally. <code>max-width</code> is better than <code>width</code> here, because on a phone the page simply becomes narrower. Note that <code>margin: auto</code> centres a <em>block</em>; to centre text inside it, use <code>text-align: center</code>.</p>

<h3>Step 4 — margins collapse</h3>
${ma('html', CODE['3-2/gop-le.html'], [6, 12])}
${ra(OUT['3-2/gop-le'])}
<p>Two surprises, both real. <strong>First:</strong> 30 and 20 did not add up to 50. When the vertical margins of two neighbouring blocks touch, they collapse into the larger one. This is deliberate: it keeps spacing between paragraphs even.</p>
<p><strong>Second:</strong> the <code>h2</code> has a top margin of 24 pixels, and yet it sits at the very top of its parent. The margin escaped through the parent, pushing the whole parent down. This is the cause of the mystery gap above many headers and sections.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Happens</span><span class="lz-t">Vertical margins only</span><span class="lz-d">Between siblings, and between a parent and its first or last child.</span></div>
<div class="lz-step"><span class="lz-k">Does not</span><span class="lz-t">Horizontal, or with something between</span><span class="lz-d">Padding or a border on the parent stops it. So does <code>display: flow-root</code>.</span></div>
<div class="lz-step"><span class="lz-k">Never</span><span class="lz-t">Flex and grid children</span><span class="lz-d">In those layouts margins add normally. Use <code>gap</code> instead.</span></div>
</div>

<h3>Step 5 — block, inline, inline-block</h3>
${ma('html', CODE['3-2/hien-thi.html'], [5, 14])}
${ra(OUT['3-2/hien-thi'])}
<table>
<thead><tr><th></th><th>block</th><th>inline</th><th>inline-block</th></tr></thead>
<tbody>
<tr><td>Examples</td><td><code>div</code>, <code>p</code>, <code>h1</code>, <code>ul</code></td><td><code>span</code>, <code>a</code>, <code>strong</code></td><td><code>button</code>, <code>input</code></td></tr>
<tr><td>New line?</td><td>Yes, full width by default</td><td>No, flows in the text</td><td>No, flows in the text</td></tr>
<tr><td><code>width</code>, <code>height</code></td><td>Respected</td><td><strong>Ignored</strong></td><td>Respected</td></tr>
<tr><td>Vertical margin</td><td>Respected</td><td><strong>Ignored</strong></td><td>Respected</td></tr>
</tbody>
</table>
<p>The inline box above asked for 120×40 and got 48×28: its width follows its text. If <code>width</code> "does nothing", check whether the element is inline. An <code>img</code> is inline too, which explains the small gap under images: they sit on the text baseline, and <code>display: block</code> removes it.</p>

<h3>Step 6 — when content does not fit</h3>
${ma('html', CODE['3-2/tran.html'], [5, 9])}
${ra(OUT['3-2/tran'])}
<div class="kv-grid">
  <div class="kv"><span class="k">overflow-wrap: anywhere</span><span class="v">Allows a break inside a long word or address. Good for user content.</span></div>
  <div class="kv"><span class="k">overflow: hidden</span><span class="v">Cuts off whatever pokes out.</span></div>
  <div class="kv"><span class="k">overflow: auto</span><span class="v">Scrollbars only when needed. Good for code and tables.</span></div>
  <div class="kv"><span class="k">text-overflow: ellipsis</span><span class="v">Ends a line with "…". Needs <code>white-space: nowrap</code> and <code>overflow: hidden</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — fixed heights.</strong> <code>height: 200px</code> on a card looks perfect with your sample text. Then real content arrives, or a longer translation, or the reader increases the text size, and it overflows. Let content decide the height. If you need a minimum, use <code>min-height</code>. Likewise, prefer <code>max-width</code> to <code>width</code>.</p></div>

<h3>Step 7 — three ways to hide, three different results</h3>
${ma('html', CODE['3-2/an-di.html'], [6, 8])}
${ra(OUT['3-2/an-di'])}
<table>
<thead><tr><th></th><th>Keeps its space</th><th>Clickable</th><th>Reached by Tab / screen reader</th></tr></thead>
<tbody>
<tr><td><code>display: none</code></td><td>No</td><td>No</td><td>No</td></tr>
<tr><td><code>visibility: hidden</code></td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td><code>opacity: 0</code></td><td>Yes</td><td><strong>Yes</strong></td><td><strong>Yes</strong></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — invisible but clickable.</strong> A menu faded out with <code>opacity: 0</code> still catches clicks: users press what they see underneath, and the invisible element reacts. Its links are also in the Tab order. When hiding something, combine it: <code>opacity: 0; visibility: hidden;</code>, or use <code>display: none</code>. Lesson 12.2 uses this in transitions.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — a pricing card, measured</strong></p>
<ol>
<li>Build a page with <code>.page</code> centred at <code>max-width: 900px</code>, and three <code>.plan</code> cards inside. Add the <code>border-box</code> rule first.</li>
<li>Each card: <code>width: 280px</code>, <code>padding: 24px</code>, a 2-pixel border, <code>display: inline-block</code>, and a heading, a price and a button.</li>
<li>Turn the <code>border-box</code> rule off and on in DevTools, and watch the card widths.</li>
<li>Add a very long word to one card and fix the overflow.</li>
</ol>
<p>Hint: Styles has a checkbox beside each declaration. Unticking it is the fastest experiment in web development.</p>
<p><strong>Done when:</strong> <code>document.querySelector('.plan').offsetWidth</code> is exactly 280 in the Console; the Computed diagram shows the 24 padding and 2 border; there is no horizontal scrollbar at any window size; and you can explain why the gap between two stacked paragraphs is not the sum of their margins. Then Code Lab module 3.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">box model</span><span class="v">mô hình hộp — content, padding, border, margin.</span></div>
  <div class="kv"><span class="k">content box</span><span class="v">vùng nội dung.</span></div>
  <div class="kv"><span class="k">padding</span><span class="v">đệm trong — nhận màu nền.</span></div>
  <div class="kv"><span class="k">border</span><span class="v">viền.</span></div>
  <div class="kv"><span class="k">margin</span><span class="v">lề ngoài — trong suốt.</span></div>
  <div class="kv"><span class="k">box-sizing</span><span class="v">cách tính bề rộng; border-box gồm cả viền và đệm.</span></div>
  <div class="kv"><span class="k">margin collapse</span><span class="v">gộp lề — hai lề dọc thành lề lớn hơn.</span></div>
  <div class="kv"><span class="k">block / inline</span><span class="v">khối — chiếm dòng / trong dòng — theo chữ.</span></div>
  <div class="kv"><span class="k">overflow</span><span class="v">tràn — nội dung lớn hơn hộp.</span></div>
  <div class="kv"><span class="k">flow root</span><span class="v">gốc luồng — hộp chặn lề thoát ra.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every element is a box: content, padding, border, margin. Inspect it in Computed.</li>
  <li>By default <code>width</code> means content only. <code>box-sizing: border-box</code> fixes that everywhere.</li>
  <li>Four values go clockwise; <code>margin: 0 auto</code> centres a block with a width.</li>
  <li>Vertical margins collapse to the larger one, and a child's margin can escape its parent.</li>
  <li>Inline boxes ignore width, height and vertical margin.</li>
  <li>Let content decide the height; use <code>overflow-wrap</code>, <code>overflow: auto</code> and <code>ellipsis</code>.</li>
  <li><code>display: none</code> removes, <code>visibility: hidden</code> keeps the space, <code>opacity: 0</code> stays clickable.</li>
</ul>
${nguon('📗', 'MDN — The box model', 'Standard and alternative box models with examples', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model')}
${nguon('📘', 'MDN — Mastering margin collapsing', 'The exact rules', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-css-basics', title: 'WED201c (Academy) — CSS basics', sub: 'The box model in the university syllabus', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Mọi phần tử là một cái hộp</h2>
<p class="lead">Học xong bài này bạn đọc được hộp của mọi phần tử trong DevTools, làm cho bề rộng đúng nghĩa bạn nghĩ bằng một dòng CSS, dùng đúng margin và padding, căn giữa một khối, giải thích vì sao hai margin không cộng lại, và xử lý nội dung không vừa. Bạn cần điều này vì bố cục là sắp xếp các hộp. Gần như mọi câu hỏi "sao cái này lệch 20 điểm ảnh?" đều được bài này trả lời, và mọi thứ trong Flexbox và Grid đều dựng trên nó.</p>

<h3>Bước 1 — bốn lớp</h3>
<p>Với trình duyệt, mọi thứ đều là hình chữ nhật, kể cả một từ đơn lẻ. Mỗi hộp có bốn lớp:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">margin</span><span class="lz-t">bên ngoài hộp</span><span class="lz-d">Khoảng trống giữa hộp này và hàng xóm. Luôn trong suốt.</span></div>
<div class="lz-layer"><span class="lz-k">border</span><span class="lz-t">cái viền</span><span class="lz-d">Đường kẻ quanh padding.</span></div>
<div class="lz-layer"><span class="lz-k">padding</span><span class="lz-t">bên trong hộp</span><span class="lz-d">Khoảng cách giữa nội dung và viền. Nó hiện màu nền.</span></div>
<div class="lz-layer"><span class="lz-k">content</span><span class="lz-t">thứ thật sự</span><span class="lz-d">Chữ, ảnh, phần tử con.</span></div>
</div>
<p>Để xem, chuột phải vào phần tử bất kỳ, chọn <strong>Inspect</strong>, mở thẻ <strong>Computed</strong>. Trên cùng là sơ đồ với con số thật của cả bốn lớp. Rê chuột trên phần tử trong Elements sẽ tô margin màu cam và padding màu xanh ngay trên trang. Một mẹo có ích khi học: thêm <code>* { outline: 1px solid red; }</code> để thấy mọi hộp cùng lúc. Khác với border, outline không chiếm chỗ, nên không làm đổi bố cục.</p>

<h3>Bước 2 — <code>width: 300px</code> rộng bao nhiêu?</h3>
${ma('html', CODE['3-2/hop.html'], [5, 8])}
${ra(OUT['3-2/hop'])}
<p>Cả hai hộp đều có <code>width: 300px</code>, padding 20 điểm ảnh và viền 5 điểm ảnh. Hộp đầu được vẽ rộng <strong>350 điểm ảnh</strong>: 300 + 20 + 20 + 5 + 5. Mặc định, <code>width</code> chỉ là phần <em>nội dung</em>, mọi thứ khác cộng thêm. Thêm padding sau đó là bố cục vỡ.</p>
<p>Hộp thứ hai dùng <code>box-sizing: border-box</code>: 300 là cả cái hộp, và nội dung co lại nhường chỗ (250). Đây là điều mọi người mong đợi, nên gần như mọi dự án bắt đầu bằng mấy dòng này:</p>
<pre><code class="language-css">*, *::before, *::after {
  box-sizing: border-box;
}</code></pre>
<p>Đây là dòng đầu của tệp CSS khởi đầu ở Bài 3.1, và các framework CSS như Tailwind, Bootstrap đều có nó.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — hai cột 50% không vừa.</strong> Hai cột <code>width: 50%</code> với <code>padding: 20px</code> và cách tính mặc định cộng lại thành 100% + 80 điểm ảnh, nên cột thứ hai rớt xuống dưới. Bạn thử 49%, rồi 48%. <code>border-box</code> đưa padding vào trong 50%, và vấn đề biến mất.</p></div>

<h3>Bước 3 — viết tắt, và căn giữa một khối</h3>
<table>
<thead><tr><th>Bạn viết</th><th>Trên</th><th>Phải</th><th>Dưới</th><th>Trái</th></tr></thead>
<tbody>
<tr><td><code>margin: 10px</code></td><td>10</td><td>10</td><td>10</td><td>10</td></tr>
<tr><td><code>margin: 10px 20px</code></td><td>10</td><td>20</td><td>10</td><td>20</td></tr>
<tr><td><code>margin: 10px 20px 30px</code></td><td>10</td><td>20</td><td>30</td><td>20</td></tr>
<tr><td><code>margin: 1px 2px 3px 4px</code></td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
</tbody>
</table>
<p>Bốn giá trị đi <strong>theo chiều kim đồng hồ từ trên xuống</strong>. <code>margin-top</code> và các bạn đặt một phía. Margin âm được phép và kéo các hộp lại gần; padding không được âm.</p>
<pre><code class="language-css">.page {
  max-width: 800px;     /* không bao giờ rộng hơn */
  margin: 0 auto;       /* chia khoảng trống cho hai bên */
  padding: 0 16px;      /* không dính mép trên điện thoại */
}</code></pre>
<p><code>auto</code> bảo trình duyệt chia đều khoảng trống. <code>max-width</code> tốt hơn <code>width</code> ở đây, vì trên điện thoại trang chỉ đơn giản hẹp lại. Lưu ý <code>margin: auto</code> căn giữa một <em>khối</em>; muốn căn giữa chữ bên trong, dùng <code>text-align: center</code>.</p>

<h3>Bước 4 — margin gộp lại</h3>
${ma('html', CODE['3-2/gop-le.html'], [6, 12])}
${ra(OUT['3-2/gop-le'])}
<p>Hai bất ngờ, đều có thật. <strong>Thứ nhất:</strong> 30 và 20 không cộng thành 50. Khi margin dọc của hai khối cạnh nhau chạm vào nhau, chúng gộp thành cái lớn hơn. Điều này có chủ đích: giữ khoảng cách giữa các đoạn văn đều nhau.</p>
<p><strong>Thứ hai:</strong> <code>h2</code> có margin trên 24 điểm ảnh, vậy mà nó nằm sát đỉnh của cha. Margin đã thoát qua cha, đẩy cả cha xuống. Đây là nguyên nhân của khoảng trống bí ẩn phía trên nhiều header và section.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Xảy ra</span><span class="lz-t">Chỉ margin dọc</span><span class="lz-d">Giữa anh em, và giữa cha với con đầu hoặc con cuối.</span></div>
<div class="lz-step"><span class="lz-k">Không xảy ra</span><span class="lz-t">Chiều ngang, hoặc có gì chen giữa</span><span class="lz-d">Padding hay viền trên cha chặn nó. <code>display: flow-root</code> cũng vậy.</span></div>
<div class="lz-step"><span class="lz-k">Không bao giờ</span><span class="lz-t">Con của flex và grid</span><span class="lz-d">Trong các bố cục đó margin cộng bình thường. Hãy dùng <code>gap</code>.</span></div>
</div>

<h3>Bước 5 — block, inline, inline-block</h3>
${ma('html', CODE['3-2/hien-thi.html'], [5, 14])}
${ra(OUT['3-2/hien-thi'])}
<table>
<thead><tr><th></th><th>block</th><th>inline</th><th>inline-block</th></tr></thead>
<tbody>
<tr><td>Ví dụ</td><td><code>div</code>, <code>p</code>, <code>h1</code>, <code>ul</code></td><td><code>span</code>, <code>a</code>, <code>strong</code></td><td><code>button</code>, <code>input</code></td></tr>
<tr><td>Xuống dòng?</td><td>Có, mặc định rộng hết</td><td>Không, chảy theo chữ</td><td>Không, chảy theo chữ</td></tr>
<tr><td><code>width</code>, <code>height</code></td><td>Có tác dụng</td><td><strong>Bị bỏ qua</strong></td><td>Có tác dụng</td></tr>
<tr><td>Margin dọc</td><td>Có tác dụng</td><td><strong>Bị bỏ qua</strong></td><td>Có tác dụng</td></tr>
</tbody>
</table>
<p>Hộp inline ở trên xin 120×40 mà nhận 48×28: bề rộng của nó theo chữ. Nếu <code>width</code> "không có tác dụng", hãy kiểm phần tử có phải inline không. <code>img</code> cũng là inline, điều này giải thích khe nhỏ dưới ảnh: ảnh nằm trên đường cơ sở của chữ, và <code>display: block</code> gỡ được nó.</p>

<h3>Bước 6 — khi nội dung không vừa</h3>
${ma('html', CODE['3-2/tran.html'], [5, 9])}
${ra(OUT['3-2/tran'])}
<div class="kv-grid">
  <div class="kv"><span class="k">overflow-wrap: anywhere</span><span class="v">Cho phép ngắt giữa một từ dài hay địa chỉ. Hợp với nội dung người dùng.</span></div>
  <div class="kv"><span class="k">overflow: hidden</span><span class="v">Cắt phần thò ra.</span></div>
  <div class="kv"><span class="k">overflow: auto</span><span class="v">Chỉ hiện thanh cuộn khi cần. Hợp với mã và bảng.</span></div>
  <div class="kv"><span class="k">text-overflow: ellipsis</span><span class="v">Kết thúc dòng bằng "…". Cần <code>white-space: nowrap</code> và <code>overflow: hidden</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chiều cao cố định.</strong> <code>height: 200px</code> trên một thẻ trông hoàn hảo với chữ mẫu. Rồi nội dung thật tới, hay bản dịch dài hơn, hay người đọc tăng cỡ chữ, và nó tràn. Hãy để nội dung quyết định chiều cao. Nếu cần tối thiểu, dùng <code>min-height</code>. Tương tự, ưu tiên <code>max-width</code> hơn <code>width</code>.</p></div>

<h3>Bước 7 — ba cách ẩn, ba kết quả khác nhau</h3>
${ma('html', CODE['3-2/an-di.html'], [6, 8])}
${ra(OUT['3-2/an-di'])}
<table>
<thead><tr><th></th><th>Giữ chỗ</th><th>Bấm được</th><th>Tab / trình đọc màn hình tới được</th></tr></thead>
<tbody>
<tr><td><code>display: none</code></td><td>Không</td><td>Không</td><td>Không</td></tr>
<tr><td><code>visibility: hidden</code></td><td>Có</td><td>Không</td><td>Không</td></tr>
<tr><td><code>opacity: 0</code></td><td>Có</td><td><strong>Có</strong></td><td><strong>Có</strong></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — vô hình mà bấm được.</strong> Một menu mờ đi bằng <code>opacity: 0</code> vẫn hứng cú bấm: người dùng bấm thứ họ thấy bên dưới, còn phần tử vô hình lại phản ứng. Các liên kết của nó cũng vẫn trong thứ tự Tab. Khi ẩn gì đó, hãy kết hợp: <code>opacity: 0; visibility: hidden;</code>, hoặc dùng <code>display: none</code>. Bài 12.2 dùng điều này trong chuyển động.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — thẻ bảng giá, có đo đạc</strong></p>
<ol>
<li>Dựng trang có <code>.page</code> căn giữa với <code>max-width: 900px</code>, trong đó ba thẻ <code>.plan</code>. Thêm luật <code>border-box</code> trước tiên.</li>
<li>Mỗi thẻ: <code>width: 280px</code>, <code>padding: 24px</code>, viền 2 điểm ảnh, <code>display: inline-block</code>, gồm tiêu đề, giá và nút.</li>
<li>Bật tắt luật <code>border-box</code> trong DevTools, và nhìn bề rộng thẻ thay đổi.</li>
<li>Thêm một từ rất dài vào một thẻ và sửa chỗ tràn.</li>
</ol>
<p>Gợi ý: Styles có ô tick cạnh mỗi khai báo. Bỏ tick là thí nghiệm nhanh nhất trong lập trình web.</p>
<p><strong>Xong khi:</strong> <code>document.querySelector('.plan').offsetWidth</code> đúng bằng 280 trong Console; sơ đồ Computed hiện padding 24 và viền 2; không có thanh cuộn ngang ở mọi cỡ cửa sổ; và bạn giải thích được vì sao khoảng cách giữa hai đoạn văn xếp chồng không phải tổng margin của chúng. Sau đó làm module Code Lab 3.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">box model</span><span class="v">mô hình hộp — content, padding, border, margin.</span></div>
  <div class="kv"><span class="k">content box</span><span class="v">vùng nội dung.</span></div>
  <div class="kv"><span class="k">padding</span><span class="v">đệm trong — nhận màu nền.</span></div>
  <div class="kv"><span class="k">border</span><span class="v">viền.</span></div>
  <div class="kv"><span class="k">margin</span><span class="v">lề ngoài — trong suốt.</span></div>
  <div class="kv"><span class="k">box-sizing</span><span class="v">cách tính bề rộng; border-box gồm cả viền và đệm.</span></div>
  <div class="kv"><span class="k">margin collapse</span><span class="v">gộp lề — hai lề dọc thành lề lớn hơn.</span></div>
  <div class="kv"><span class="k">block / inline</span><span class="v">khối — chiếm dòng / trong dòng — theo chữ.</span></div>
  <div class="kv"><span class="k">overflow</span><span class="v">tràn — nội dung lớn hơn hộp.</span></div>
  <div class="kv"><span class="k">flow root</span><span class="v">gốc luồng — hộp chặn lề thoát ra.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mọi phần tử là một hộp: content, padding, border, margin. Xem trong Computed.</li>
  <li>Mặc định <code>width</code> chỉ tính nội dung. <code>box-sizing: border-box</code> sửa điều đó ở mọi nơi.</li>
  <li>Bốn giá trị đi theo chiều kim đồng hồ; <code>margin: 0 auto</code> căn giữa khối có bề rộng.</li>
  <li>Margin dọc gộp thành cái lớn hơn, và margin của con có thể thoát khỏi cha.</li>
  <li>Hộp inline bỏ qua width, height và margin dọc.</li>
  <li>Để nội dung quyết định chiều cao; dùng <code>overflow-wrap</code>, <code>overflow: auto</code> và <code>ellipsis</code>.</li>
  <li><code>display: none</code> gỡ bỏ, <code>visibility: hidden</code> giữ chỗ, <code>opacity: 0</code> vẫn bấm được.</li>
</ul>
${nguon('📗', 'MDN — The box model', 'Mô hình hộp chuẩn và thay thế, kèm ví dụ', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model')}
${nguon('📘', 'MDN — Mastering margin collapsing', 'Luật chính xác', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-css-basics', title: 'WED201c (Academy) — CSS cơ bản', sub: 'Mô hình hộp trong đề cương môn học ở trường', cta: 'Mở bài' })}
</div>
`,
};
