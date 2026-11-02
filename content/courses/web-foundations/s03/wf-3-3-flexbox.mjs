/**
 * Bài 3.3 — Flexbox (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/3-3; _demo/_t3/chay.mjs đo phím Tab thật với order).
 * Deck: scripts/slides-src/wf-3-3.mjs (10 slide, WF/v1/wf-3-3). Code Lab: module 3.3 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-3-3', 'Flexbox', 'Flexbox', [
  [1, 'Flexbox',
    '<p>Flexbox is how you arrange items in one line: a navigation bar, a row of buttons, a card with its footer pinned at the bottom. It solved problems that once needed awful hacks, such as vertical centring. Today you learn the model, not a list of properties.</p>',
    '<p>Flexbox là cách bạn xếp các mục trên một đường: thanh điều hướng, hàng nút, thẻ có chân ghim ở đáy. Nó giải quyết những vấn đề từng cần mẹo rất xấu, như căn giữa theo chiều dọc. Hôm nay bạn học mô hình, không phải một danh sách thuộc tính.</p>'],
  [2, 'After this lesson you can…',
    '<p>Every outcome maps to something you will build this week. The last one, <code>min-width: 0</code>, is the fix for the most confusing Flexbox bug of all: a child that refuses to shrink and pushes the whole layout off the screen.</p>',
    '<p>Mỗi kết quả ứng với thứ bạn sẽ dựng ngay tuần này. Điều cuối, <code>min-width: 0</code>, là cách sửa lỗi Flexbox khó hiểu nhất: một phần tử con không chịu co lại và đẩy cả bố cục ra khỏi màn hình.</p>'],
  [3, 'Two axes',
    '<p>One declaration, <code>display: flex</code>, makes a container and turns its direct children into flex items. Everything then depends on two axes. The main axis follows <code>flex-direction</code>; the cross axis is perpendicular. <code>justify-content</code> works along the main axis, <code>align-items</code> along the cross axis.</p>',
    '<p>Một khai báo, <code>display: flex</code>, tạo ra một container và biến các con trực tiếp thành flex item. Mọi thứ sau đó phụ thuộc vào hai trục. Trục chính theo <code>flex-direction</code>; trục chéo vuông góc với nó. <code>justify-content</code> làm việc dọc trục chính, <code>align-items</code> dọc trục chéo.</p>'],
  [4, 'Measured on a real page',
    '<p>Four containers in Chromium, with the real position and size of each item. Look at the first: <code>stretch</code> is the default, so every item is 90 pixels tall. Centre moves them. In column direction the axes swap, and <code>justify-content</code> becomes vertical. That swap is what confuses people.</p>',
    '<p>Bốn container trong Chromium, kèm vị trí và kích thước thật của từng mục. Nhìn cái đầu: <code>stretch</code> là mặc định, nên mục nào cũng cao 90 điểm ảnh. Center dời chúng đi. Ở hướng cột, hai trục đổi chỗ, và <code>justify-content</code> thành chiều dọc. Sự đổi chỗ đó là điều làm mọi người rối.</p>'],
  [5, 'Perfect centring, a real navbar',
    '<p>Two everyday recipes. Centring: 150 pixels left and right, 120 top and bottom, in two lines. A navbar: one <code>margin-left: auto</code> pushes everything after it to the far right. The sign-up button ends exactly 16 pixels from the edge, the same as the padding.</p>',
    '<p>Hai công thức hằng ngày. Căn giữa: 150 điểm ảnh hai bên, 120 trên dưới, chỉ với hai dòng. Thanh điều hướng: một <code>margin-left: auto</code> đẩy mọi thứ sau nó sang tận bên phải. Nút đăng ký kết thúc đúng cách mép 16 điểm ảnh, bằng padding.</p>'],
  [6, 'grow, shrink, basis',
    '<p><code>flex</code> is three numbers: how much to grow, how much to shrink, and the starting size. Here are the real widths in a 600-pixel row. <code>flex: 1</code> shares equally; 2, 1, 1 gives one item double; a fixed sidebar plus <code>flex: 1</code> is the classic layout. Refusing to shrink overflows.</p>',
    '<p><code>flex</code> là ba con số: lớn thêm bao nhiêu, co lại bao nhiêu, và kích thước khởi đầu. Đây là bề rộng thật trong một hàng 600 điểm ảnh. <code>flex: 1</code> chia đều; 2, 1, 1 cho một mục gấp đôi; thanh bên cố định cộng <code>flex: 1</code> là bố cục kinh điển. Không chịu co lại thì tràn.</p>'],
  [7, 'Wrapping and gap',
    '<p>By default flex items stay on one line, however little room there is. With <code>flex-wrap: wrap</code> they move to the next line, and <code>flex: 1 1 180px</code> means "at least about 180 pixels, and share the rest". <code>gap</code> gives clean spacing without margin tricks.</p>',
    '<p>Mặc định các flex item nằm trên một dòng, dù chỗ có ít thế nào. Với <code>flex-wrap: wrap</code> chúng xuống dòng tiếp theo, và <code>flex: 1 1 180px</code> nghĩa là "khoảng 180 điểm ảnh, và chia phần còn lại". <code>gap</code> cho khoảng cách gọn gàng mà không cần mẹo margin.</p>'],
  [8, 'The min-width bug',
    '<p>A long code line inside a flex item: the row is 420 pixels, but the item grew to 593 and pushed everything out. A flex item refuses to shrink below its content. One line, <code>min-width: 0</code>, gives it permission, and the code scrolls inside as intended.</p>',
    '<p>Một dòng mã dài trong flex item: hàng rộng 420 điểm ảnh, nhưng mục đó phình tới 593 và đẩy mọi thứ ra ngoài. Flex item từ chối co nhỏ hơn nội dung của nó. Một dòng, <code>min-width: 0</code>, cho phép nó co, và mã cuộn bên trong đúng ý.</p>'],
  [9, 'order changes the look, not the keyboard',
    '<p>We reversed three links with <code>order</code>. On screen they read three, two, one. The real Tab key still visits one, two, three. Keyboard and screen-reader users follow the HTML, so use <code>order</code> sparingly. If the order matters, change the HTML.</p>',
    '<p>Ta đảo ngược ba liên kết bằng <code>order</code>. Trên màn hình đọc là three, two, one. Phím Tab thật vẫn đi one, two, three. Người dùng bàn phím và trình đọc màn hình đi theo HTML, nên hãy dùng <code>order</code> dè dặt. Nếu thứ tự quan trọng, hãy sửa HTML.</p>'],
  [10, 'Summary & practice',
    '<p>The practice builds a page header and a row of cards. "Done when" asks you to resize the window from wide to narrow and watch nothing break. That is the real test of a flexible layout.</p>',
    '<p>Bài luyện dựng phần đầu trang và một hàng thẻ. "Xong khi" yêu cầu bạn kéo cửa sổ từ rộng tới hẹp và thấy không gì vỡ. Đó là phép thử thật của một bố cục linh hoạt.</p>'],
]);

export default {
  title: '3.3 — Flexbox: one-dimensional layout|||3.3 — Flexbox: bố cục một chiều',
  slug: 'wf-3-3-flexbox',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/fYq5PXgSsbE', durationSeconds: 0 },
  description: 'Hai trục của Flexbox đo trên trang thật, justify-content và align-items, căn giữa hoàn hảo, thanh điều hướng với margin-left: auto, flex: grow shrink basis (bề rộng đo được), wrap và gap, lỗi min-width: 0, order không đổi thứ tự Tab (đo bằng phím thật).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Arranging things in one line</h2>
<p class="lead">After this lesson you can lay out a row or a column of anything, centre an item perfectly in both directions, build a navigation bar, control exactly how items share space, make a row wrap on small screens, and fix the classic overflow bug. You need this because almost every component on a modern web page is a Flexbox: headers, menus, button groups, cards, form rows, chat bubbles. It replaced a decade of hacks with a small number of properties.</p>

<h3>Step 1 — the model: a container, items, two axes</h3>
<p>One declaration does the work. <code>display: flex</code> on a parent makes it a <strong>flex container</strong>, and its <em>direct</em> children become <strong>flex items</strong>, sitting side by side.</p>
<pre><code class="language-css">.toolbar {
  display: flex;      /* the children are now in a row */
  gap: 12px;          /* space between them */
}</code></pre>
<p>Everything else depends on two axes:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Main axis</span><span class="lz-t">the direction items flow</span><span class="lz-d"><code>flex-direction: row</code> (default) makes it horizontal; <code>column</code> makes it vertical. <code>justify-content</code> works along it.</span></div>
<div class="lz-layer"><span class="lz-k">Cross axis</span><span class="lz-t">perpendicular to it</span><span class="lz-d">Vertical in a row, horizontal in a column. <code>align-items</code> works along it.</span></div>
</div>
<p>Remember it like this: <strong>justify = along the flow, align = across the flow</strong>. If you change the direction, they change roles.</p>

<h3>Step 2 — alignment, measured</h3>
${ma('css', CODE['3-3/truc.html'], [6, 11])}
${ra(OUT['3-3/truc'])}
<p>Each line gives every item's position inside its container, and its size. The screenshot is on slide 3. Read the output carefully:</p>
<ul>
<li><strong>.a</strong>: all items are 90 tall, the full height. <code>align-items: stretch</code> is the default, which is why two cards in a row match in height automatically.</li>
<li><strong>.b</strong>: both axes centred.</li>
<li><strong>.c</strong>: <code>space-between</code> pins the first and last to the edges; <code>flex-end</code> puts them at the bottom (y = 72).</li>
<li><strong>.d</strong>: <code>column</code>. Now <code>justify-content: center</code> moves things vertically, and <code>align-items: flex-start</code> moves them to the left. The axes swapped.</li>
</ul>
<table>
<thead><tr><th>Property</th><th>Common values</th></tr></thead>
<tbody>
<tr><td><code>justify-content</code></td><td><code>flex-start</code>, <code>center</code>, <code>flex-end</code>, <code>space-between</code>, <code>space-around</code>, <code>space-evenly</code></td></tr>
<tr><td><code>align-items</code></td><td><code>stretch</code> (default), <code>center</code>, <code>flex-start</code>, <code>flex-end</code>, <code>baseline</code></td></tr>
<tr><td><code>align-self</code></td><td>On one item: overrides <code>align-items</code></td></tr>
</tbody>
</table>

<h3>Step 3 — two everyday recipes</h3>
<p><strong>Perfect centring.</strong> For decades, centring vertically was a running joke. Now:</p>
${ma('css', CODE['3-3/can-giua.html'], [5, 6])}
${ra(OUT['3-3/can-giua'])}
<p>Note that the container needs a height bigger than the item, or there is nothing to centre in.</p>
<p><strong>A navigation bar.</strong> The trick is one <code>auto</code> margin:</p>
${ma('css', CODE['3-3/thanh-nav.html'], [6, 10])}
${ma('html', CODE['3-3/thanh-nav.html'], [13, 19])}
${ra(OUT['3-3/thanh-nav'])}
<p>In Flexbox, an <code>auto</code> margin takes up all the free space on that side. So <code>margin-left: auto</code> on "Log in" pushes it and everything after it to the right, with no extra wrapper. The last item ends at 744 of 760: exactly the 16 pixels of padding.</p>

<h3>Step 4 — how items share space: <code>flex</code></h3>
<p><code>flex</code> is a shorthand for three numbers: <strong>flex-grow</strong> (take a share of spare space), <strong>flex-shrink</strong> (give up space when short), <strong>flex-basis</strong> (the starting size). Each line below is a real row, 600 pixels wide:</p>
${ma('css', CODE['3-3/co-gian.html'], [7, 15])}
${ra(OUT['3-3/co-gian'])}
<table>
<thead><tr><th>You want</th><th>Write</th></tr></thead>
<tbody>
<tr><td>Equal columns</td><td><code>flex: 1</code> on each</td></tr>
<tr><td>A column twice as wide</td><td><code>flex: 2</code> on it, <code>flex: 1</code> on the others</td></tr>
<tr><td>Fixed sidebar, flexible content</td><td><code>flex: 0 0 200px</code> and <code>flex: 1</code></td></tr>
<tr><td>A size that may shrink</td><td><code>flex: 0 1 300px</code> (this is the default behaviour)</td></tr>
<tr><td>A size that never shrinks</td><td><code>flex: 0 0 300px</code>: careful, it can overflow</td></tr>
</tbody>
</table>

<h3>Step 5 — wrapping, and <code>gap</code></h3>
${ma('css', CODE['3-3/xuong-dong.html'], [6, 9])}
${ra(OUT['3-3/xuong-dong'])}
<p>By default, items stay on one line and overflow if they must. <code>flex-wrap: wrap</code> lets them continue on the next line, as on slide 7. Combined with <code>flex: 1 1 180px</code>, cards keep a sensible width and fill each line, which gives you a simple responsive row without a single media query.</p>
<p><code>gap</code> sets the space <em>between</em> items, never at the outer edges, and works in Flexbox and Grid. It replaces the old <code>margin-right</code> on every item except the last.</p>

<h3>Step 6 — the most confusing Flexbox bug</h3>
${ma('css', CODE['3-3/min-width.html'], [6, 10])}
${ra(OUT['3-3/min-width'])}
<p>The row is 420 pixels wide, but the main column became 593 and the whole row overflowed, although the <code>pre</code> even has <code>overflow: auto</code>. Why? A flex item has <code>min-width: auto</code> by default, which means "never shrink below my content". The long line of code sets the minimum.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a child that will not shrink.</strong> The page gets a horizontal scrollbar, usually from a long URL, a code block or a table inside a flex item. The fix is one line on the flex item: <code>min-width: 0</code>. In a column layout, the same applies to <code>min-height: 0</code>. If you remember one thing from this lesson, remember this: the bug occurs in real projects every month.</p></div>

<h3>Step 7 — <code>order</code> and the keyboard</h3>
${ma('html', CODE['3-3/thu-tu.html'], [5, 14])}
${ra(OUT['_t3/out/order-tab'])}
<div class="pitfall co-tieu-de"><p><strong>Trap — using <code>order</code> or <code>row-reverse</code> for important content.</strong> They change only what you see. Screen readers and the Tab key follow the HTML, so the focus jumps backwards across the screen. Use them for small visual tweaks. If the reading order matters, change the HTML.</p></div>

<h3>Flexbox or Grid?</h3>
<p>A simple rule: <strong>Flexbox for a line</strong> of things whose size comes from their content (a menu, buttons, tags). <strong>Grid for a two-dimensional layout</strong>, where rows and columns must line up (Lesson 3.4). They work together: a Grid page, with Flexbox inside each card.</p>
<p>DevTools helps here: in Elements, a <code>flex</code> badge appears next to the container. Click it to see the item outlines, and the Styles panel offers buttons that try each alignment.</p>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — a header and a row of cards</strong></p>
<ol>
<li>Build a site header: a logo on the left, three links next to it, "Log in" and a "Sign up" button at the far right, all vertically centred.</li>
<li>Below it, a row of three cards with <code>flex-wrap: wrap</code>, <code>gap</code>, and <code>flex: 1 1 240px</code>.</li>
<li>In each card (make the card a column with <code>display: flex; flex-direction: column</code>) put a title, a paragraph of a different length, and a button. Pin the buttons to the bottom with <code>margin-top: auto</code>.</li>
<li>Put a very long URL into one card, and fix it.</li>
</ol>
<p>Hint: the three cards are equal height thanks to <code>stretch</code>. The button's <code>margin-top: auto</code> takes all the free space above it.</p>
<p><strong>Done when:</strong> resizing from wide to phone width never shows a horizontal scrollbar; the cards go from three to two to one per row; all buttons line up at the bottom of their cards; and <code>document.documentElement.scrollWidth === innerWidth</code> is <code>true</code> in the Console. Then Code Lab module 3.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flex container / item</span><span class="v">vùng chứa flex / mục flex — con trực tiếp.</span></div>
  <div class="kv"><span class="k">main axis</span><span class="v">trục chính — hướng các mục chảy.</span></div>
  <div class="kv"><span class="k">cross axis</span><span class="v">trục chéo — vuông góc trục chính.</span></div>
  <div class="kv"><span class="k">justify-content</span><span class="v">căn dọc trục chính.</span></div>
  <div class="kv"><span class="k">align-items</span><span class="v">căn dọc trục chéo.</span></div>
  <div class="kv"><span class="k">flex-grow / shrink / basis</span><span class="v">lớn thêm / co lại / kích thước khởi đầu.</span></div>
  <div class="kv"><span class="k">flex-wrap</span><span class="v">cho phép xuống dòng.</span></div>
  <div class="kv"><span class="k">gap</span><span class="v">khoảng cách giữa các mục.</span></div>
  <div class="kv"><span class="k">min-content</span><span class="v">kích thước tối thiểu theo nội dung.</span></div>
  <div class="kv"><span class="k">order</span><span class="v">thứ tự hiển thị — không đổi thứ tự đọc.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>display: flex</code> on the parent turns direct children into items in a row.</li>
  <li><code>justify-content</code> = along the main axis; <code>align-items</code> = across. They swap with <code>flex-direction: column</code>.</li>
  <li>Stretch is the default: cards in a row match in height.</li>
  <li><code>margin-left: auto</code> pushes items away; centring takes two lines.</li>
  <li><code>flex: grow shrink basis</code>; <code>flex: 1</code> shares the free space.</li>
  <li><code>flex-wrap: wrap</code> plus a basis gives a responsive row; <code>gap</code> replaces margins.</li>
  <li>An item that will not shrink needs <code>min-width: 0</code>.</li>
  <li><code>order</code> changes the look, not the Tab order.</li>
</ul>
${nguon('📗', 'MDN — Flexbox', 'The learning guide, with live editors', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox')}
${nguon('🎮', 'Flexbox Froggy', 'A free game that drills justify and align', 'https://flexboxfroggy.com/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-flexbox-grid', title: 'WED201c (Academy) — Flexbox and Grid', sub: 'Both layouts in the university syllabus', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Xếp các thứ trên một đường</h2>
<p class="lead">Học xong bài này bạn xếp được một hàng hay một cột của bất cứ thứ gì, căn giữa hoàn hảo theo cả hai chiều, dựng được thanh điều hướng, điều khiển chính xác cách các mục chia chỗ, cho hàng xuống dòng trên màn hình nhỏ, và sửa được lỗi tràn kinh điển. Bạn cần điều này vì gần như mọi thành phần trên trang web hiện đại đều là Flexbox: header, menu, nhóm nút, thẻ, hàng trong form, bong bóng chat. Nó thay một thập kỷ mẹo vặt bằng một số ít thuộc tính.</p>

<h3>Bước 1 — mô hình: một container, các mục, hai trục</h3>
<p>Một khai báo làm hết việc. <code>display: flex</code> trên phần tử cha biến nó thành <strong>flex container</strong>, và các con <em>trực tiếp</em> thành <strong>flex item</strong>, nằm cạnh nhau.</p>
<pre><code class="language-css">.toolbar {
  display: flex;      /* các con giờ nằm trên một hàng */
  gap: 12px;          /* khoảng cách giữa chúng */
}</code></pre>
<p>Mọi thứ còn lại phụ thuộc vào hai trục:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Trục chính</span><span class="lz-t">hướng các mục chảy</span><span class="lz-d"><code>flex-direction: row</code> (mặc định) là ngang; <code>column</code> là dọc. <code>justify-content</code> làm việc dọc theo nó.</span></div>
<div class="lz-layer"><span class="lz-k">Trục chéo</span><span class="lz-t">vuông góc với nó</span><span class="lz-d">Dọc trong hàng, ngang trong cột. <code>align-items</code> làm việc dọc theo nó.</span></div>
</div>
<p>Nhớ thế này: <strong>justify = dọc theo dòng chảy, align = ngang qua dòng chảy</strong>. Đổi hướng là chúng đổi vai.</p>

<h3>Bước 2 — căn chỉnh, có đo đạc</h3>
${ma('css', CODE['3-3/truc.html'], [6, 11])}
${ra(OUT['3-3/truc'])}
<p>Mỗi dòng cho biết vị trí của từng mục trong container, và kích thước. Ảnh chụp ở slide 3. Đọc kỹ output:</p>
<ul>
<li><strong>.a</strong>: mục nào cũng cao 90, bằng cả container. <code>align-items: stretch</code> là mặc định, vì vậy hai thẻ trong một hàng tự cao bằng nhau.</li>
<li><strong>.b</strong>: căn giữa cả hai trục.</li>
<li><strong>.c</strong>: <code>space-between</code> ghim mục đầu và cuối vào hai mép; <code>flex-end</code> đưa chúng xuống đáy (y = 72).</li>
<li><strong>.d</strong>: <code>column</code>. Giờ <code>justify-content: center</code> di chuyển theo chiều dọc, còn <code>align-items: flex-start</code> đưa sang trái. Hai trục đã đổi chỗ.</li>
</ul>
<table>
<thead><tr><th>Thuộc tính</th><th>Giá trị thường dùng</th></tr></thead>
<tbody>
<tr><td><code>justify-content</code></td><td><code>flex-start</code>, <code>center</code>, <code>flex-end</code>, <code>space-between</code>, <code>space-around</code>, <code>space-evenly</code></td></tr>
<tr><td><code>align-items</code></td><td><code>stretch</code> (mặc định), <code>center</code>, <code>flex-start</code>, <code>flex-end</code>, <code>baseline</code></td></tr>
<tr><td><code>align-self</code></td><td>Trên một mục: ghi đè <code>align-items</code></td></tr>
</tbody>
</table>

<h3>Bước 3 — hai công thức hằng ngày</h3>
<p><strong>Căn giữa hoàn hảo.</strong> Suốt nhiều thập kỷ, căn giữa theo chiều dọc là một trò đùa. Giờ thì:</p>
${ma('css', CODE['3-3/can-giua.html'], [5, 6])}
${ra(OUT['3-3/can-giua'])}
<p>Lưu ý container cần cao hơn mục bên trong, nếu không chẳng có gì để căn.</p>
<p><strong>Thanh điều hướng.</strong> Mẹo nằm ở một margin <code>auto</code>:</p>
${ma('css', CODE['3-3/thanh-nav.html'], [6, 10])}
${ma('html', CODE['3-3/thanh-nav.html'], [13, 19])}
${ra(OUT['3-3/thanh-nav'])}
<p>Trong Flexbox, margin <code>auto</code> chiếm toàn bộ khoảng trống ở phía đó. Nên <code>margin-left: auto</code> trên "Log in" đẩy nó và mọi thứ sau nó sang phải, không cần lớp bọc nào. Mục cuối kết thúc ở 744 trên 760: đúng 16 điểm ảnh padding.</p>

<h3>Bước 4 — các mục chia chỗ thế nào: <code>flex</code></h3>
<p><code>flex</code> viết tắt ba con số: <strong>flex-grow</strong> (lấy một phần chỗ dư), <strong>flex-shrink</strong> (nhường chỗ khi thiếu), <strong>flex-basis</strong> (kích thước khởi đầu). Mỗi dòng dưới đây là một hàng thật, rộng 600 điểm ảnh:</p>
${ma('css', CODE['3-3/co-gian.html'], [7, 15])}
${ra(OUT['3-3/co-gian'])}
<table>
<thead><tr><th>Bạn muốn</th><th>Viết</th></tr></thead>
<tbody>
<tr><td>Các cột bằng nhau</td><td><code>flex: 1</code> trên mỗi cột</td></tr>
<tr><td>Một cột rộng gấp đôi</td><td><code>flex: 2</code> trên nó, <code>flex: 1</code> cho còn lại</td></tr>
<tr><td>Thanh bên cố định, nội dung co giãn</td><td><code>flex: 0 0 200px</code> và <code>flex: 1</code></td></tr>
<tr><td>Kích thước có thể co</td><td><code>flex: 0 1 300px</code> (đây là hành vi mặc định)</td></tr>
<tr><td>Kích thước không bao giờ co</td><td><code>flex: 0 0 300px</code>: cẩn thận, có thể tràn</td></tr>
</tbody>
</table>

<h3>Bước 5 — xuống dòng, và <code>gap</code></h3>
${ma('css', CODE['3-3/xuong-dong.html'], [6, 9])}
${ra(OUT['3-3/xuong-dong'])}
<p>Mặc định, các mục ở trên một dòng và tràn nếu buộc phải vậy. <code>flex-wrap: wrap</code> cho chúng tiếp tục ở dòng sau, như ở slide 7. Kết hợp với <code>flex: 1 1 180px</code>, các thẻ giữ bề rộng hợp lý và lấp đầy mỗi dòng, cho bạn một hàng responsive đơn giản mà không cần media query nào.</p>
<p><code>gap</code> đặt khoảng cách <em>giữa</em> các mục, không bao giờ ở mép ngoài, và dùng được cho cả Flexbox lẫn Grid. Nó thay cho kiểu cũ <code>margin-right</code> trên mọi mục trừ mục cuối.</p>

<h3>Bước 6 — lỗi Flexbox khó hiểu nhất</h3>
${ma('css', CODE['3-3/min-width.html'], [6, 10])}
${ra(OUT['3-3/min-width'])}
<p>Hàng rộng 420 điểm ảnh, nhưng cột chính thành 593 và cả hàng tràn, dù <code>pre</code> đã có <code>overflow: auto</code>. Vì sao? Flex item mặc định có <code>min-width: auto</code>, nghĩa là "không bao giờ co nhỏ hơn nội dung". Dòng mã dài đã đặt ra mức tối thiểu đó.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — phần tử con không chịu co.</strong> Trang có thanh cuộn ngang, thường do một URL dài, khối mã hay bảng nằm trong flex item. Cách sửa là một dòng trên flex item: <code>min-width: 0</code>. Trong bố cục cột, tương tự với <code>min-height: 0</code>. Nếu chỉ nhớ một điều từ bài này, hãy nhớ điều này: lỗi này xuất hiện trong dự án thật hằng tháng.</p></div>

<h3>Bước 7 — <code>order</code> và bàn phím</h3>
${ma('html', CODE['3-3/thu-tu.html'], [5, 14])}
${ra(OUT['_t3/out/order-tab'])}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng <code>order</code> hay <code>row-reverse</code> cho nội dung quan trọng.</strong> Chúng chỉ đổi thứ bạn nhìn thấy. Trình đọc màn hình và phím Tab đi theo HTML, nên tiêu điểm nhảy ngược trên màn hình. Hãy dùng cho tinh chỉnh thị giác nhỏ. Nếu thứ tự đọc quan trọng, hãy sửa HTML.</p></div>

<h3>Flexbox hay Grid?</h3>
<p>Một quy tắc đơn giản: <strong>Flexbox cho một đường</strong> các thứ có kích thước theo nội dung (menu, nút, nhãn). <strong>Grid cho bố cục hai chiều</strong>, khi hàng và cột phải thẳng hàng (Bài 3.4). Chúng làm việc cùng nhau: trang dùng Grid, trong mỗi thẻ dùng Flexbox.</p>
<p>DevTools giúp được ở đây: trong Elements, huy hiệu <code>flex</code> xuất hiện cạnh container. Bấm vào để thấy viền các mục, và ngăn Styles có nút để thử từng kiểu căn.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — một header và một hàng thẻ</strong></p>
<ol>
<li>Dựng header: logo bên trái, ba liên kết cạnh đó, "Log in" và nút "Sign up" ở tận bên phải, tất cả căn giữa theo chiều dọc.</li>
<li>Bên dưới là một hàng ba thẻ với <code>flex-wrap: wrap</code>, <code>gap</code>, và <code>flex: 1 1 240px</code>.</li>
<li>Trong mỗi thẻ (cho thẻ thành cột với <code>display: flex; flex-direction: column</code>) đặt tiêu đề, một đoạn văn độ dài khác nhau, và một nút. Ghim các nút xuống đáy bằng <code>margin-top: auto</code>.</li>
<li>Đặt một URL rất dài vào một thẻ, và sửa nó.</li>
</ol>
<p>Gợi ý: ba thẻ cao bằng nhau nhờ <code>stretch</code>. <code>margin-top: auto</code> của nút chiếm hết khoảng trống phía trên nó.</p>
<p><strong>Xong khi:</strong> kéo từ rộng tới bề rộng điện thoại không bao giờ có thanh cuộn ngang; thẻ đi từ ba xuống hai rồi một mỗi hàng; mọi nút thẳng hàng ở đáy thẻ; và <code>document.documentElement.scrollWidth === innerWidth</code> là <code>true</code> trong Console. Sau đó làm module Code Lab 3.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">flex container / item</span><span class="v">vùng chứa flex / mục flex — con trực tiếp.</span></div>
  <div class="kv"><span class="k">main axis</span><span class="v">trục chính — hướng các mục chảy.</span></div>
  <div class="kv"><span class="k">cross axis</span><span class="v">trục chéo — vuông góc trục chính.</span></div>
  <div class="kv"><span class="k">justify-content</span><span class="v">căn dọc trục chính.</span></div>
  <div class="kv"><span class="k">align-items</span><span class="v">căn dọc trục chéo.</span></div>
  <div class="kv"><span class="k">flex-grow / shrink / basis</span><span class="v">lớn thêm / co lại / kích thước khởi đầu.</span></div>
  <div class="kv"><span class="k">flex-wrap</span><span class="v">cho phép xuống dòng.</span></div>
  <div class="kv"><span class="k">gap</span><span class="v">khoảng cách giữa các mục.</span></div>
  <div class="kv"><span class="k">min-content</span><span class="v">kích thước tối thiểu theo nội dung.</span></div>
  <div class="kv"><span class="k">order</span><span class="v">thứ tự hiển thị — không đổi thứ tự đọc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>display: flex</code> trên cha biến các con trực tiếp thành mục xếp hàng.</li>
  <li><code>justify-content</code> = dọc trục chính; <code>align-items</code> = ngang qua. Chúng đổi vai với <code>flex-direction: column</code>.</li>
  <li>Stretch là mặc định: thẻ trong một hàng cao bằng nhau.</li>
  <li><code>margin-left: auto</code> đẩy các mục ra xa; căn giữa chỉ cần hai dòng.</li>
  <li><code>flex: grow shrink basis</code>; <code>flex: 1</code> chia chỗ trống.</li>
  <li><code>flex-wrap: wrap</code> cộng basis cho hàng responsive; <code>gap</code> thay margin.</li>
  <li>Mục không chịu co cần <code>min-width: 0</code>.</li>
  <li><code>order</code> đổi giao diện, không đổi thứ tự Tab.</li>
</ul>
${nguon('📗', 'MDN — Flexbox', 'Hướng dẫn học, có khung sửa trực tiếp', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox')}
${nguon('🎮', 'Flexbox Froggy', 'Trò chơi miễn phí luyện justify và align', 'https://flexboxfroggy.com/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-flexbox-grid', title: 'WED201c (Academy) — Flexbox và Grid', sub: 'Cả hai bố cục trong đề cương môn học ở trường', cta: 'Mở bài' })}
</div>
`,
};
