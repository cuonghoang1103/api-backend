/**
 * Bài 3.4 — CSS Grid (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/3-4).
 * Deck: scripts/slides-src/wf-3-4.mjs (10 slide, WF/v1/wf-3-4). Code Lab: module 3.4 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-3-4', 'CSS Grid', 'CSS Grid', [
  [1, 'CSS Grid',
    '<p>Flexbox arranges things along one line. Grid arranges them in rows and columns at the same time, like a spreadsheet. It is the tool for page layouts and card galleries, and with one remarkable line it can make a layout responsive without any media query.</p>',
    '<p>Flexbox xếp các thứ dọc một đường. Grid xếp chúng theo hàng và cột cùng lúc, giống bảng tính. Đây là công cụ cho bố cục trang và thư viện thẻ, và với một dòng đáng kinh ngạc, nó làm bố cục responsive mà không cần media query nào.</p>'],
  [2, 'After this lesson you can…',
    '<p>The outcome to look forward to is the third: a card gallery that adapts its number of columns to any screen by itself. We measure that at four window widths, and we also find out why percentages and gaps do not mix.</p>',
    '<p>Kết quả đáng mong chờ là điều thứ ba: một thư viện thẻ tự đổi số cột theo mọi màn hình. Ta đo điều đó ở bốn bề rộng cửa sổ, và cũng tìm ra vì sao phần trăm với gap không hợp nhau.</p>'],
  [3, 'Tracks, fr and gap',
    '<p>A grid is defined by its tracks. <code>grid-template-columns</code> lists the columns; <code>fr</code> means a share of the free space. In a 600-pixel grid with two 8-pixel gaps, 1fr 2fr 1fr computes to 146, 292, 146. Gaps are taken out first, then the shares are calculated.</p>',
    '<p>Một lưới được định nghĩa bởi các track. <code>grid-template-columns</code> liệt kê các cột; <code>fr</code> nghĩa là một phần của chỗ trống. Trong lưới 600 điểm ảnh có hai gap 8, 1fr 2fr 1fr tính ra 146, 292, 146. Gap được trừ trước, rồi mới chia phần.</p>'],
  [4, 'Items span tracks',
    '<p>An item can stretch across several columns with <code>span</code>. Notice that we never declared any rows, yet two appeared: extra items create implicit rows automatically. This is what lets a grid accept any number of items.</p>',
    '<p>Một mục có thể trải qua nhiều cột bằng <code>span</code>. Để ý rằng ta không hề khai báo hàng nào, vậy mà có hai hàng: các mục thừa tự tạo hàng ngầm định. Đó là thứ giúp lưới nhận bao nhiêu mục cũng được.</p>'],
  [5, 'Named areas: a page layout',
    '<p>The most readable CSS you will ever write. You draw the layout as text, with names, and then place each element by name. The measurements show the real boxes: the header spans the full width, the sidebar is 180 wide, and the footer sits at the bottom.</p>',
    '<p>Đoạn CSS dễ đọc nhất bạn từng viết. Bạn vẽ bố cục bằng chữ, có tên, rồi đặt từng phần tử theo tên. Số đo cho thấy các hộp thật: header trải hết bề rộng, thanh bên rộng 180, và footer nằm dưới đáy.</p>'],
  [6, 'A responsive gallery in one line',
    '<p><code>repeat(auto-fit, minmax(200px, 1fr))</code> means: as many columns as fit, each at least 200 pixels, sharing the rest. Here is the same page at four window widths: one, three, four and six columns. Not a single media query.</p>',
    '<p><code>repeat(auto-fit, minmax(200px, 1fr))</code> nghĩa là: nhiều cột nhất có thể, mỗi cột ít nhất 200 điểm ảnh, chia phần còn lại. Đây là cùng một trang ở bốn bề rộng cửa sổ: một, ba, bốn và sáu cột. Không có media query nào.</p>'],
  [7, 'auto-fit or auto-fill?',
    '<p>The difference only shows with few items. Both created five columns here, but <code>auto-fit</code> collapses the empty ones, so the two items stretch to 362 pixels. <code>auto-fill</code> keeps the empty columns, and the items stay at 140. Pick by what you want a lone item to do.</p>',
    '<p>Khác biệt chỉ lộ ra khi có ít mục. Cả hai đều tạo năm cột ở đây, nhưng <code>auto-fit</code> gộp các cột trống, nên hai mục giãn tới 362 điểm ảnh. <code>auto-fill</code> giữ cột trống, và các mục ở mức 140. Hãy chọn theo điều bạn muốn một mục lẻ làm.</p>'],
  [8, 'Percentages plus gap overflow',
    '<p>Four columns of 25 percent add up to 100, and the three gaps are added on top, so the content needs 460 pixels in a 400-pixel box. The <code>fr</code> unit divides what is left after the gaps, and fits exactly. In Grid, prefer <code>fr</code>.</p>',
    '<p>Bốn cột 25 phần trăm cộng lại đúng 100, và ba gap cộng thêm vào, nên nội dung cần 460 điểm ảnh trong hộp 400. Đơn vị <code>fr</code> chia phần còn lại sau gap, và vừa khít. Trong Grid, hãy ưu tiên <code>fr</code>.</p>'],
  [9, 'Grid or Flexbox?',
    '<p>Use Flexbox when the content decides the size and things sit in a line. Use Grid when the layout decides the size and rows and columns must line up. Real pages use both: Grid for the page and the gallery, Flexbox inside each card.</p>',
    '<p>Dùng Flexbox khi nội dung quyết định kích thước và các thứ nằm trên một đường. Dùng Grid khi bố cục quyết định kích thước và hàng cột phải thẳng hàng. Trang thật dùng cả hai: Grid cho trang và thư viện, Flexbox trong mỗi thẻ.</p>'],
  [10, 'Summary & practice',
    '<p>The practice builds a complete page layout with named areas, plus a product gallery. "Done when" checks the number of columns at several widths, measured in the Console, which is the same check as in this lesson.</p>',
    '<p>Bài luyện dựng một bố cục trang đầy đủ với vùng có tên, cộng một thư viện sản phẩm. "Xong khi" kiểm số cột ở vài bề rộng, đo trong Console, đúng phép kiểm trong bài.</p>'],
]);

export default {
  title: '3.4 — CSS Grid: two-dimensional layout|||3.4 — CSS Grid: bố cục hai chiều',
  slug: 'wf-3-4-css-grid',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/9zBsdzdE4sM', durationSeconds: 0 },
  description: 'Track, fr và gap (đo bề rộng đã tính), span và hàng ngầm định, vùng có tên cho bố cục trang, thư viện responsive một dòng repeat(auto-fit, minmax()) đo ở bốn bề rộng, auto-fit vs auto-fill, bẫy phần trăm cộng gap, khi nào Grid khi nào Flexbox, Grid Inspector.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Rows and columns at the same time</h2>
<p class="lead">After this lesson you can define a grid with exact and flexible columns, place items across several tracks, write a whole page layout as a readable text map, build a gallery that picks its own number of columns, and choose between Grid and Flexbox. You need this because Flexbox thinks in one line, and many layouts are two-dimensional: a dashboard, a product list, a page with a header, a sidebar and a footer. Grid makes these short, readable, and responsive almost for free.</p>

<h3>Step 1 — tracks, <code>fr</code> and <code>gap</code></h3>
<p><code>display: grid</code> on a parent makes it a <strong>grid container</strong>. You then describe its columns, called <strong>tracks</strong>. Each direct child falls into the next free cell.</p>
${ma('css', CODE['3-4/luoi.html'], [6, 11])}
${ra(OUT['3-4/luoi'])}
<p>The browser reports each track's computed size. The grids are 600 pixels wide with 8-pixel gaps. Look at the first line:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Take out the gaps</span><span class="lz-d">600 − 2 × 8 = 584 free pixels.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Take out fixed tracks</span><span class="lz-d">In the second grid, the 200px column first.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Count the shares</span><span class="lz-d">1 + 2 + 1 = 4 shares.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Divide</span><span class="lz-d">584 ÷ 4 = 146. So 146, 292, 146.</span></div>
</div>
<p><code>fr</code> ("fraction") is a share of the free space, and exists only in Grid. <code>repeat(4, 1fr)</code> is a short way of writing four equal columns. You can mix: <code>200px 1fr</code> is the classic fixed sidebar with flexible content.</p>

<h3>Step 2 — spanning, and implicit rows</h3>
<p>The third grid has <code>grid-column: span 2</code> on its first item: it stretches over two columns (screenshot on slide 4). Look at the last line of the output: we declared four columns and no rows, and yet there are two rows of 32 pixels. A grid creates <strong>implicit rows</strong> for as many items as you give it. That is why a grid suits a list of unknown length.</p>
<pre><code class="language-css">.featured { grid-column: span 2; }         /* two columns wide */
.banner   { grid-column: 1 / -1; }         /* from the first line to the last: full width */
.tall     { grid-row: span 2; }            /* two rows tall */
.gallery  { grid-auto-rows: 180px; }       /* the height of implicit rows */</code></pre>
<p>Grid lines are numbered from 1, and <code>-1</code> means the last line, so <code>1 / -1</code> is a reliable way to say "the whole width".</p>

<h3>Step 3 — named areas: draw the layout</h3>
<p>This is the most readable CSS you will write. You literally draw the page:</p>
${ma('css', CODE['3-4/vung.html'], [6, 19])}
${ma('html', CODE['3-4/vung.html'], [23, 28])}
${ra(OUT['3-4/vung'])}
<p>Each string is a row, each word a cell, and a repeated word stretches that area. <code>grid-area</code> places each element by name. The measurements show that the header and footer span the full 640 pixels, and the middle row takes the remaining height, 200 pixels. The order of the elements in the HTML no longer matters visually, and to change the layout on a phone you redefine only that text map (Lesson 3.5).</p>

<h3>Step 4 — a gallery that picks its own columns</h3>
<p>One line replaces several media queries:</p>
<pre><code class="language-css">.gallery {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}</code></pre>
<p>Read it from the inside out: each column is <code>minmax(200px, 1fr)</code>, meaning at least 200 pixels and at most one share of the free space; <code>repeat(auto-fit, …)</code> means as many as fit. Six items, at four real window widths:</p>
${ra(OUT['3-4/tu-dong'])}
<p>From one to six columns, with no media query. Note that this is a container-based decision: it adapts to the space the grid actually has, which also makes it work inside a sidebar.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>minmax(300px, 1fr)</code> on a 320-pixel phone.</strong> If the container is narrower than the minimum, the column overflows and the page scrolls sideways: padding included, 300 does not fit in 288. Protect it: <code>minmax(min(300px, 100%), 1fr)</code> means "300, but never wider than the container".</p></div>

<h3>Step 5 — <code>auto-fit</code> or <code>auto-fill</code>?</h3>
${ma('css', CODE['3-4/fit-fill.html'], [7, 8])}
${ra(OUT['3-4/fit-fill'])}
<p>Both computed five columns of space. With only two items, <code>auto-fit</code> collapses the three empty columns, so the items stretch to fill the row (362 pixels each). <code>auto-fill</code> keeps the empty columns, so items stay at 140 and line up with what would be there. Use <code>auto-fit</code> for most galleries; use <code>auto-fill</code> when a single leftover item should not become huge.</p>

<h3>Step 6 — percentages and gaps do not add up</h3>
${ma('css', CODE['3-4/bay-phan-tram.html'], [6, 7])}
${ra(OUT['3-4/bay-phan-tram'])}
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>repeat(4, 25%)</code> plus a gap.</strong> Four 25% columns fill 100% of the box, and the gaps are added on top: 60 pixels of overflow here. You will not see an error, just a horizontal scrollbar on the whole page. <code>fr</code> divides only what is left after the gaps. In Grid, reach for <code>fr</code> rather than percentages.</p></div>

<h3>Alignment in a grid</h3>
<table>
<thead><tr><th>Property</th><th>Aligns</th></tr></thead>
<tbody>
<tr><td><code>justify-items</code>, <code>align-items</code></td><td>Items inside their cells (default: <code>stretch</code>)</td></tr>
<tr><td><code>justify-content</code>, <code>align-content</code></td><td>The whole grid inside its container</td></tr>
<tr><td><code>justify-self</code>, <code>align-self</code></td><td>One item inside its cell</td></tr>
<tr><td><code>place-items: center</code></td><td>Shorthand: centre both ways. The shortest way to centre anything</td></tr>
</tbody>
</table>

<h3>Step 7 — Grid or Flexbox?</h3>
<table>
<thead><tr><th></th><th>Flexbox</th><th>Grid</th></tr></thead>
<tbody>
<tr><td>Dimensions</td><td>One line (can wrap)</td><td>Rows and columns together</td></tr>
<tr><td>Who decides the size</td><td>Mostly the content</td><td>Mostly the layout</td></tr>
<tr><td>Examples</td><td>Menu, buttons, tags, form row</td><td>Page shell, gallery, dashboard</td></tr>
<tr><td>Items line up across rows?</td><td>Not guaranteed</td><td>Yes</td></tr>
</tbody>
</table>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Page</span><span class="lz-t">Grid</span><span class="lz-d">Header, sidebar, main, footer.</span></div>
<div class="lz-layer"><span class="lz-k">Gallery</span><span class="lz-t">Grid</span><span class="lz-d"><code>auto-fit</code> cards.</span></div>
<div class="lz-layer"><span class="lz-k">Card</span><span class="lz-t">Flexbox</span><span class="lz-d">Column with a footer pinned to the bottom.</span></div>
<div class="lz-layer"><span class="lz-k">Card footer</span><span class="lz-t">Flexbox</span><span class="lz-d">A row with a price and a button.</span></div>
</div>
<p>Do not treat them as rivals; real pages nest them. In DevTools, click the <code>grid</code> badge next to a container in Elements to overlay the tracks, line numbers and area names on the page.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — only direct children are grid items.</strong> A grid applies to children, not grandchildren. Wrapping your cards in one extra <code>div</code> makes that <code>div</code> the single item, and everything collapses into one cell. If a layout looks strange, open Elements and check who the direct children are. It is the same in Flexbox.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — a shop page</strong></p>
<ol>
<li>Build a page shell with named areas: <code>header</code> across the top, <code>aside</code> 220 pixels wide on the left, <code>main</code>, and <code>footer</code> across the bottom, at <code>min-height: 100vh</code>.</li>
<li>In <code>main</code>, add a gallery of eight product cards with <code>repeat(auto-fit, minmax(220px, 1fr))</code> and a <code>gap</code>.</li>
<li>Make the first card span two columns.</li>
<li>Use Flexbox inside each card so that the button sits at the bottom.</li>
</ol>
<p>Hint: run this in the Console while you resize: <code>getComputedStyle(document.querySelector('.gallery')).gridTemplateColumns.split(' ').length</code>.</p>
<p><strong>Done when:</strong> that line reports different numbers as you resize; there is no horizontal scrollbar at 360 pixels (use DevTools' device toolbar); the footer sits at the bottom even when the content is short; and the Grid overlay in DevTools shows your area names. Then Code Lab module 3.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">grid container / item</span><span class="v">vùng chứa lưới / mục lưới — con trực tiếp.</span></div>
  <div class="kv"><span class="k">track</span><span class="v">đường ray — một hàng hoặc một cột.</span></div>
  <div class="kv"><span class="k">fr</span><span class="v">một phần chỗ trống.</span></div>
  <div class="kv"><span class="k">cell / area</span><span class="v">ô / vùng gồm nhiều ô.</span></div>
  <div class="kv"><span class="k">grid line</span><span class="v">đường lưới — đánh số từ 1, −1 là cuối.</span></div>
  <div class="kv"><span class="k">implicit track</span><span class="v">track ngầm định — tự tạo cho mục thừa.</span></div>
  <div class="kv"><span class="k">span</span><span class="v">trải qua nhiều track.</span></div>
  <div class="kv"><span class="k">minmax()</span><span class="v">khoảng nhỏ nhất và lớn nhất của một track.</span></div>
  <div class="kv"><span class="k">auto-fit / auto-fill</span><span class="v">gộp / giữ các cột trống.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>display: grid</code> + <code>grid-template-columns</code>; direct children fall into cells.</li>
  <li><code>fr</code> shares the space left after gaps and fixed tracks.</li>
  <li><code>span</code> stretches an item; extra items create implicit rows.</li>
  <li><code>grid-template-areas</code> lets you draw a page as text.</li>
  <li><code>repeat(auto-fit, minmax(200px, 1fr))</code> gives a responsive gallery with no media query.</li>
  <li><code>auto-fit</code> collapses empty columns; <code>auto-fill</code> keeps them.</li>
  <li>Percentages plus gap overflow; prefer <code>fr</code>.</li>
  <li>Grid for the page, Flexbox for the line; nest them freely.</li>
</ul>
${nguon('📗', 'MDN — Grids', 'Tracks, areas and auto-placement, with live examples', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids')}
${nguon('🎮', 'Grid Garden', 'A free game for learning grid lines', 'https://cssgridgarden.com/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-flexbox-grid', title: 'WED201c (Academy) — Flexbox and Grid', sub: 'Both layouts in the university syllabus', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Hàng và cột cùng một lúc</h2>
<p class="lead">Học xong bài này bạn định nghĩa được lưới với cột cố định và co giãn, đặt mục trải qua nhiều track, viết cả bố cục trang thành một bản đồ chữ dễ đọc, dựng thư viện tự chọn số cột, và quyết định giữa Grid và Flexbox. Bạn cần điều này vì Flexbox nghĩ theo một đường, trong khi nhiều bố cục là hai chiều: dashboard, danh sách sản phẩm, trang có header, thanh bên và footer. Grid làm chúng ngắn, dễ đọc, và gần như tự responsive.</p>

<h3>Bước 1 — track, <code>fr</code> và <code>gap</code></h3>
<p><code>display: grid</code> trên cha biến nó thành <strong>grid container</strong>. Rồi bạn mô tả các cột, gọi là <strong>track</strong>. Mỗi con trực tiếp rơi vào ô trống tiếp theo.</p>
${ma('css', CODE['3-4/luoi.html'], [6, 11])}
${ra(OUT['3-4/luoi'])}
<p>Trình duyệt báo kích thước đã tính của từng track. Các lưới rộng 600 điểm ảnh với gap 8. Nhìn dòng đầu:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trừ gap</span><span class="lz-d">600 − 2 × 8 = 584 điểm ảnh trống.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trừ track cố định</span><span class="lz-d">Ở lưới thứ hai, trừ cột 200px trước.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đếm số phần</span><span class="lz-d">1 + 2 + 1 = 4 phần.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chia</span><span class="lz-d">584 ÷ 4 = 146. Vậy 146, 292, 146.</span></div>
</div>
<p><code>fr</code> ("fraction" — phần) là một phần của chỗ trống, và chỉ có trong Grid. <code>repeat(4, 1fr)</code> là cách viết ngắn cho bốn cột bằng nhau. Bạn có thể trộn: <code>200px 1fr</code> là kiểu kinh điển thanh bên cố định, nội dung co giãn.</p>

<h3>Bước 2 — trải rộng, và hàng ngầm định</h3>
<p>Lưới thứ ba có <code>grid-column: span 2</code> ở mục đầu: nó trải qua hai cột (ảnh chụp ở slide 4). Nhìn dòng cuối của output: ta khai báo bốn cột và không có hàng nào, vậy mà có hai hàng cao 32 điểm ảnh. Lưới tạo <strong>hàng ngầm định (implicit row)</strong> cho bao nhiêu mục bạn đưa. Vì thế lưới hợp với danh sách không biết trước độ dài.</p>
<pre><code class="language-css">.featured { grid-column: span 2; }         /* rộng hai cột */
.banner   { grid-column: 1 / -1; }         /* từ đường đầu tới đường cuối: hết bề rộng */
.tall     { grid-row: span 2; }            /* cao hai hàng */
.gallery  { grid-auto-rows: 180px; }       /* chiều cao các hàng ngầm định */</code></pre>
<p>Đường lưới đánh số từ 1, và <code>-1</code> nghĩa là đường cuối, nên <code>1 / -1</code> là cách chắc chắn để nói "toàn bộ bề rộng".</p>

<h3>Bước 3 — vùng có tên: vẽ bố cục</h3>
<p>Đây là đoạn CSS dễ đọc nhất bạn sẽ viết. Bạn vẽ trang theo đúng nghĩa đen:</p>
${ma('css', CODE['3-4/vung.html'], [6, 19])}
${ma('html', CODE['3-4/vung.html'], [23, 28])}
${ra(OUT['3-4/vung'])}
<p>Mỗi chuỗi là một hàng, mỗi từ là một ô, từ lặp lại sẽ kéo dài vùng đó. <code>grid-area</code> đặt từng phần tử theo tên. Số đo cho thấy header và footer trải hết 640 điểm ảnh, hàng giữa nhận phần chiều cao còn lại, 200 điểm ảnh. Thứ tự phần tử trong HTML không còn quan trọng về mặt hiển thị, và muốn đổi bố cục trên điện thoại bạn chỉ định nghĩa lại bản đồ chữ đó (Bài 3.5).</p>

<h3>Bước 4 — thư viện tự chọn số cột</h3>
<p>Một dòng thay được vài media query:</p>
<pre><code class="language-css">.gallery {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}</code></pre>
<p>Đọc từ trong ra ngoài: mỗi cột là <code>minmax(200px, 1fr)</code>, nghĩa là ít nhất 200 điểm ảnh và nhiều nhất một phần chỗ trống; <code>repeat(auto-fit, …)</code> nghĩa là nhiều nhất có thể. Sáu mục, ở bốn bề rộng cửa sổ thật:</p>
${ra(OUT['3-4/tu-dong'])}
<p>Từ một tới sáu cột, không media query nào. Lưu ý đây là quyết định theo vùng chứa: nó thích ứng với chỗ lưới thật sự có, nên chạy được cả trong thanh bên.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>minmax(300px, 1fr)</code> trên điện thoại 320 điểm ảnh.</strong> Nếu vùng chứa hẹp hơn mức tối thiểu, cột tràn và trang cuộn ngang: tính cả padding, 300 không vừa 288. Hãy bảo vệ nó: <code>minmax(min(300px, 100%), 1fr)</code> nghĩa là "300, nhưng không bao giờ rộng hơn vùng chứa".</p></div>

<h3>Bước 5 — <code>auto-fit</code> hay <code>auto-fill</code>?</h3>
${ma('css', CODE['3-4/fit-fill.html'], [7, 8])}
${ra(OUT['3-4/fit-fill'])}
<p>Cả hai đều tính ra chỗ cho năm cột. Chỉ với hai mục, <code>auto-fit</code> gộp ba cột trống, nên các mục giãn lấp đầy hàng (362 điểm ảnh mỗi mục). <code>auto-fill</code> giữ cột trống, nên các mục ở mức 140 và thẳng hàng với thứ có thể xuất hiện. Dùng <code>auto-fit</code> cho đa số thư viện; dùng <code>auto-fill</code> khi không muốn một mục lẻ bị phình to.</p>

<h3>Bước 6 — phần trăm và gap không cộng được</h3>
${ma('css', CODE['3-4/bay-phan-tram.html'], [6, 7])}
${ra(OUT['3-4/bay-phan-tram'])}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>repeat(4, 25%)</code> cộng gap.</strong> Bốn cột 25% lấp đầy 100% hộp, và gap cộng thêm vào: tràn 60 điểm ảnh ở đây. Bạn không thấy lỗi nào, chỉ thấy thanh cuộn ngang trên cả trang. <code>fr</code> chỉ chia phần còn lại sau gap. Trong Grid, hãy dùng <code>fr</code> thay vì phần trăm.</p></div>

<h3>Căn chỉnh trong lưới</h3>
<table>
<thead><tr><th>Thuộc tính</th><th>Căn gì</th></tr></thead>
<tbody>
<tr><td><code>justify-items</code>, <code>align-items</code></td><td>Các mục trong ô của chúng (mặc định: <code>stretch</code>)</td></tr>
<tr><td><code>justify-content</code>, <code>align-content</code></td><td>Cả lưới trong vùng chứa</td></tr>
<tr><td><code>justify-self</code>, <code>align-self</code></td><td>Một mục trong ô của nó</td></tr>
<tr><td><code>place-items: center</code></td><td>Viết tắt: căn giữa cả hai chiều. Cách ngắn nhất để căn giữa mọi thứ</td></tr>
</tbody>
</table>

<h3>Bước 7 — Grid hay Flexbox?</h3>
<table>
<thead><tr><th></th><th>Flexbox</th><th>Grid</th></tr></thead>
<tbody>
<tr><td>Chiều</td><td>Một đường (có thể xuống dòng)</td><td>Hàng và cột cùng lúc</td></tr>
<tr><td>Ai quyết định kích thước</td><td>Chủ yếu nội dung</td><td>Chủ yếu bố cục</td></tr>
<tr><td>Ví dụ</td><td>Menu, nút, nhãn, hàng form</td><td>Khung trang, thư viện, dashboard</td></tr>
<tr><td>Các mục thẳng hàng giữa các hàng?</td><td>Không chắc</td><td>Có</td></tr>
</tbody>
</table>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Trang</span><span class="lz-t">Grid</span><span class="lz-d">Header, thanh bên, main, footer.</span></div>
<div class="lz-layer"><span class="lz-k">Thư viện</span><span class="lz-t">Grid</span><span class="lz-d">Các thẻ <code>auto-fit</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Thẻ</span><span class="lz-t">Flexbox</span><span class="lz-d">Cột có chân ghim ở đáy.</span></div>
<div class="lz-layer"><span class="lz-k">Chân thẻ</span><span class="lz-t">Flexbox</span><span class="lz-d">Một hàng gồm giá và nút.</span></div>
</div>
<p>Đừng coi chúng là đối thủ; trang thật lồng chúng vào nhau. Trong DevTools, bấm huy hiệu <code>grid</code> cạnh container trong Elements để phủ các track, số đường và tên vùng lên trang.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ con trực tiếp mới là mục lưới.</strong> Lưới áp dụng cho con, không cho cháu. Bọc các thẻ trong thêm một <code>div</code> sẽ biến <code>div</code> đó thành mục duy nhất, và mọi thứ dồn vào một ô. Nếu bố cục trông lạ, mở Elements và kiểm xem ai là con trực tiếp. Flexbox cũng vậy.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — trang cửa hàng</strong></p>
<ol>
<li>Dựng khung trang với vùng có tên: <code>header</code> trên cùng, <code>aside</code> rộng 220 điểm ảnh bên trái, <code>main</code>, và <code>footer</code> dưới cùng, với <code>min-height: 100vh</code>.</li>
<li>Trong <code>main</code>, thêm thư viện tám thẻ sản phẩm với <code>repeat(auto-fit, minmax(220px, 1fr))</code> và <code>gap</code>.</li>
<li>Cho thẻ đầu trải qua hai cột.</li>
<li>Dùng Flexbox trong mỗi thẻ để nút nằm ở đáy.</li>
</ol>
<p>Gợi ý: chạy dòng này trong Console khi kéo cửa sổ: <code>getComputedStyle(document.querySelector('.gallery')).gridTemplateColumns.split(' ').length</code>.</p>
<p><strong>Xong khi:</strong> dòng đó báo các số khác nhau khi kéo cửa sổ; không có thanh cuộn ngang ở 360 điểm ảnh (dùng thanh thiết bị của DevTools); footer nằm dưới đáy kể cả khi nội dung ngắn; và lớp phủ Grid trong DevTools hiện tên các vùng. Sau đó làm module Code Lab 3.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">grid container / item</span><span class="v">vùng chứa lưới / mục lưới — con trực tiếp.</span></div>
  <div class="kv"><span class="k">track</span><span class="v">đường ray — một hàng hoặc một cột.</span></div>
  <div class="kv"><span class="k">fr</span><span class="v">một phần chỗ trống.</span></div>
  <div class="kv"><span class="k">cell / area</span><span class="v">ô / vùng gồm nhiều ô.</span></div>
  <div class="kv"><span class="k">grid line</span><span class="v">đường lưới — đánh số từ 1, −1 là cuối.</span></div>
  <div class="kv"><span class="k">implicit track</span><span class="v">track ngầm định — tự tạo cho mục thừa.</span></div>
  <div class="kv"><span class="k">span</span><span class="v">trải qua nhiều track.</span></div>
  <div class="kv"><span class="k">minmax()</span><span class="v">khoảng nhỏ nhất và lớn nhất của một track.</span></div>
  <div class="kv"><span class="k">auto-fit / auto-fill</span><span class="v">gộp / giữ các cột trống.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>display: grid</code> + <code>grid-template-columns</code>; con trực tiếp rơi vào ô.</li>
  <li><code>fr</code> chia chỗ còn lại sau gap và track cố định.</li>
  <li><code>span</code> trải rộng một mục; mục thừa tạo hàng ngầm định.</li>
  <li><code>grid-template-areas</code> cho phép vẽ trang bằng chữ.</li>
  <li><code>repeat(auto-fit, minmax(200px, 1fr))</code> cho thư viện responsive không cần media query.</li>
  <li><code>auto-fit</code> gộp cột trống; <code>auto-fill</code> giữ chúng.</li>
  <li>Phần trăm cộng gap sẽ tràn; ưu tiên <code>fr</code>.</li>
  <li>Grid cho trang, Flexbox cho đường; lồng thoải mái.</li>
</ul>
${nguon('📗', 'MDN — Grids', 'Track, vùng và tự đặt mục, kèm ví dụ trực tiếp', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids')}
${nguon('🎮', 'Grid Garden', 'Trò chơi miễn phí để học đường lưới', 'https://cssgridgarden.com/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-flexbox-grid', title: 'WED201c (Academy) — Flexbox và Grid', sub: 'Cả hai bố cục trong đề cương môn học ở trường', cta: 'Mở bài' })}
</div>
`,
};
