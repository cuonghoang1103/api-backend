/**
 * Web Foundations — Chương 3: CSS + responsive (làm cho trang đẹp và vừa mọi màn hình).
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L35 from './s03/wf-3-5-responsive.mjs';
import L34 from './s03/wf-3-4-css-grid.mjs';
import L33 from './s03/wf-3-3-flexbox.mjs';
import L32 from './s03/wf-3-2-box-model.mjs';
import L31 from './s03/wf-3-1-css-basics.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 3 — CSS & responsive design|||Chương 3 — CSS & thiết kế responsive',
  description: 'Nếu HTML là bộ xương, CSS là làn da và trang phục: màu sắc, phông chữ, khoảng cách và — quan trọng nhất — bố cục. Học chọn phần tử, hộp (box model), hai hệ dàn trang hiện đại Flexbox và Grid, rồi làm trang vừa vặn từ điện thoại tới màn hình lớn.',
  lessons: [
    /* ─────────────────── 3.0 slide bài giảng ─────────────────── */
    {
      title: '3.0 — Lecture slides: CSS in 14 slides|||3.0 — Slide bài giảng: CSS trong 14 slide',
      slug: 'wf-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ chọn, box model, Flexbox, Grid và responsive — nền để hiểu các class của Bootstrap.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: CSS in 14 slides</h2>
<p>Slides 7 and 10 (Flexbox and breakpoints) are what Bootstrap wraps up into class names. Understand them and Bootstrap stops being magic.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: CSS trong 14 slide</h2>
<p>Slide 7 và 10 (Flexbox và breakpoint) chính là thứ Bootstrap gói lại thành tên class. Hiểu hai cái đó thì Bootstrap hết là phép thuật.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-css', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Ba cách gắn CSS"],
  [4, "Bộ chọn — bốn loại dùng nhiều nhất"],
  [5, "Xếp tầng & độ ưu tiên — vì sao CSS không ăn"],
  [6, "Box model và một dòng chữa hết"],
  [7, "Flexbox — xếp theo một chiều ⭐"],
  [8, "Canh giữa — bài toán kinh điển"],
  [9, "CSS Grid — dàn trang hai chiều"],
  [10, "Responsive — mobile first ⭐⭐"],
  [11, "Đơn vị — dùng cái nào khi nào"],
  [12, "Biến CSS — đổi màu cả trang một dòng"],
  [13, "Bốn lỗi CSS hay gặp"],
  [14, "Tự luyện"],
])}
`,
    },

    /* ─────────────────────────── 3.1 ─────────────────────────── */
    L31,

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    L32,

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    L33,

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    L34,

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    L35,

    /* ─────────────────── 3.5b wireframe (thêm 17/10/2026) ─────────────────── */
    // Bài chen giữa 3.5 và quiz 3.6 — số "3.5b" để KHÔNG đổi tiêu đề/slug các bài đã có (syncOrder giữ đúng thứ tự file).
    // Ảnh mẫu: images/academy/WIREFRAME/v1/nha-tro-sv/001.webp (dùng chung với PRJ301 ASM.2b), đẩy bằng
    // scripts/upload-academy-slides.mjs --prefix WIREFRAME/v1 — dựng lại thì sang v2, đừng ghi đè (cache Cloudflare).
    {
      title: '3.5b — Wireframes for developers: draw the page before you code it|||3.5b — Wireframe cho lập trình viên: vẽ trang trước khi code',
      slug: 'wf-3-5b-wireframes',
      type: 'DOCUMENT',
      description: 'Wireframe là bản vẽ mặt bằng của một trang: hộp, nút, bấm đi đâu, ai được mở. Phân biệt low-fi/hi-fi/mockup/prototype, quy ước vẽ, ví dụ trang chủ "Nhà trọ sinh viên", cách đổi từng hộp thành HTML/CSS, công cụ (giấy, draw.io, Figma), dùng AI có trách nhiệm và bài thực hành tự kiểm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5b · added</span>
<h2>Draw the page before you code it</h2>
<p class="lead">You now know enough HTML and CSS to build a real page. The fastest way to build the <em>wrong</em> page is to open the editor first. A <strong>wireframe</strong> is a ten-minute drawing that decides what goes where, what every click does and who may see the page — before a single tag is written.</p>

<h3>What a wireframe is</h3>
<p>Think of a house. Nobody pours concrete first and decides where the kitchen goes later; an architect draws a <strong>floor plan</strong>: rooms as rectangles, doors as gaps, labels on everything. No paint colours, no furniture brands. The plan exists so that everyone — owner, builder, electrician — agrees on the layout while changing it still costs an eraser.</p>
<p>A wireframe is the floor plan of one page. It shows four things:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Boxes</span><span class="v">Which blocks exist and where they sit: header, filter panel, list of cards, pagination, footer.</span></div>
  <div class="kv"><span class="k">Controls</span><span class="v">Every button, link, input and dropdown — with the real words written on it.</span></div>
  <div class="kv"><span class="k">Where clicks go</span><span class="v">Each clickable spot gets a number, and a note says which URL it opens or what it does.</span></div>
  <div class="kv"><span class="k">Who may open it</span><span class="v">The page URL and the roles allowed: everyone, logged-in users only, admin only.</span></div>
</div>
<p>It deliberately leaves out colours, fonts, real photos and exact pixel sizes. Those come later, and arguing about them too early is how teams waste a week.</p>

<h3>Five words people mix up</h3>
<table>
<thead><tr><th>Stage</th><th>What it looks like</th><th>The question it answers</th><th>Typical tool · time</th></tr></thead>
<tbody>
<tr><td><strong>Sketch</strong></td><td>Pen on paper, rough boxes</td><td>"Roughly what is on this page?"</td><td>Paper · 2–5 min</td></tr>
<tr><td><strong>Low-fidelity wireframe</strong></td><td>Grey boxes, real labels, numbered clicks</td><td>"What goes where, and where does each click go?"</td><td>draw.io, Figma, paper · 10–30 min</td></tr>
<tr><td><strong>High-fidelity wireframe</strong></td><td>Real spacing and text sizes, still mostly grey</td><td>"Does the content actually fit?"</td><td>Figma · 1–2 h</td></tr>
<tr><td><strong>Mockup</strong></td><td>Final colours, fonts, icons, images — a static picture</td><td>"What will it look like?"</td><td>Figma · hours</td></tr>
<tr><td><strong>Prototype</strong></td><td>Mockups (or wireframes) linked so you can click through</td><td>"Does the flow feel right to a user?"</td><td>Figma prototype mode · hours</td></tr>
<tr><td><strong>Final UI</strong></td><td>Real HTML/CSS/JS with real data</td><td>"Does it work?"</td><td>Your code · days</td></tr>
</tbody>
</table>
<p>As a developer, the low-fidelity wireframe is the one you will draw most. It is cheap enough to throw away and precise enough to code from.</p>

<h3>Why a developer should bother</h3>
<ul>
<li><strong>The team agrees before anyone codes.</strong> "Is the filter on the left or on top?" takes one minute at a whiteboard and an afternoon of rewritten CSS after the fact. With a wireframe, three people build three pages that look like one site.</li>
<li><strong>Fewer rewrites.</strong> Drawing forces questions you would otherwise discover halfway through coding: what is shown when nothing matches the filter? Where does "Back" go? Does a guest see the "Book" button?</li>
<li><strong>It becomes a document.</strong> University project reports ask for screen designs: at FPTU the SWP391 and SEP490 reports include screen layouts and flows, and SWR302 asks for mockups of the requirements. A clean wireframe is that section, already done.</li>
<li><strong>Real jobs often have no designer.</strong> In small companies, freelance work and internal tools, the developer is the designer. A client who sees a wireframe on day one will tell you what is wrong while it is still free to fix.</li>
<li><strong>It reveals the data you need.</strong> Every box on screen shows data from somewhere. "Area: 20 m²" on a card means a field called something like <code>area</code> must exist in the database or the API.</li>
</ul>

<h3>Conventions that make a wireframe readable</h3>
<p>These are habits most teams share, not laws. Adapt them, but agree on them inside your team.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Grey by default</span><span class="lz-d">Black, white and greys. Use colour only when it carries meaning: the one primary action of the page, or a status (available / rented). If everything is coloured, nothing stands out.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A crossed box means an image</span><span class="lz-d">A rectangle with an X through it is the universal sign for "a picture goes here". No need to find real photos yet.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Real words, not "Button"</span><span class="lz-d">Write "View details", "Filter", "Log in". Real labels expose unclear wording early and become the text you will type into the HTML.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Number every clickable spot</span><span class="lz-d">Put a number on it and write the target beside the drawing: "② Filter ⇒ GET /rooms?typeId=…". Unnumbered clicks are the ones nobody implements.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Write the URL and who may open it</span><span class="lz-d">At the top: the page's address and the roles allowed. This line later becomes your route and your access check.</span></div>
</div>
<p>Two more that save arguments: draw the <strong>empty state</strong> (no results, no data yet) and sketch the <strong>phone version</strong> — usually one column — next to the desktop one.</p>

<h3>Worked example: the home page of "Nhà trọ sinh viên"</h3>
<p>A student team building a room-rental site (<em>Nhà trọ sinh viên</em> — student lodging) drew this before writing any code. It is the home page: a list of available rooms with a filter and pagination. Read it slowly — every convention above is in it.</p>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/WIREFRAME/v1/nha-tro-sv/001.webp" alt="Low-fidelity wireframe of the student-lodging home page: navbar, filter panel on the left, a 3 by 2 grid of room cards with crossed image boxes, pagination, footer, and seven numbered notes on the right" loading="lazy" width="1600" height="1150" /><p class="chu-thich">🖼️ Wireframe, home page of a student-lodging site: grey boxes, crossed images, real labels, seven numbered clicks with their targets, URL and access written at the top.</p></div>
<p>What each part tells the developer:</p>
<ul>
<li><strong>The header line</strong> — URL <code>/rooms?typeId=&amp;minPrice=&amp;maxPrice=&amp;floor=&amp;page=</code>, open to everyone, even guests. You already know the route, its query parameters and that it needs no login.</li>
<li><strong>① Navbar</strong> — shared by every page; after login the two buttons are replaced by the user's name and "Log out". One drawing, two states.</li>
<li><strong>② Filter</strong> — a form sent with GET to the same URL, keeping the values the user typed. GET because filtering only <em>reads</em>: the URL can be bookmarked, shared and reloaded (lessons 2.4 and 6.5).</li>
<li><strong>③ Cards</strong> — one card per room that is active and not already rented. That is a business rule hiding in a drawing; it becomes a condition in the database query.</li>
<li><strong>④ "View details"</strong> — goes to <code>/rooms/detail?id=3</code>, the next page to wireframe.</li>
<li><strong>⑤ Pagination</strong> — six rooms per page, <code>?page=2</code>, and the filter values must survive the page change.</li>
<li><strong>⑥ Empty state</strong> — "No matching rooms" plus a "Clear filters" link. Without this note, someone would ship a blank page.</li>
<li><strong>⑦ Log in / Sign up</strong> — <code>/login</code> and <code>/register</code>.</li>
</ul>
<p>Only the "Filter" button and the current page number are shaded darker: those are the only places where emphasis means something.</p>

<h3>From wireframe to HTML and CSS</h3>
<p>A good wireframe translates almost box by box. A useful rule from the numbers: <strong>a note that says "⇒ some URL" is a link (<code>&lt;a&gt;</code>); a note that sends data or changes something is a button inside a form.</strong></p>
<table>
<thead><tr><th>Wireframe box</th><th>HTML</th><th>CSS (Chapter 3)</th></tr></thead>
<tbody>
<tr><td>① Top bar</td><td><code>&lt;header&gt;</code> + <code>&lt;nav&gt;</code> with <code>&lt;a&gt;</code> links</td><td>Flexbox, <code>justify-content: space-between</code></td></tr>
<tr><td>Title + "14 rooms found"</td><td><code>&lt;h1&gt;</code> + <code>&lt;p&gt;</code></td><td>—</td></tr>
<tr><td>② Filter panel</td><td><code>&lt;aside&gt;</code> &gt; <code>&lt;form method="get" action="/rooms"&gt;</code>, <code>&lt;label&gt;</code> + <code>&lt;select&gt;</code>/<code>&lt;input&gt;</code></td><td>Left column of a grid</td></tr>
<tr><td>③ Card grid</td><td><code>&lt;section&gt;</code> holding six <code>&lt;article class="card"&gt;</code></td><td>Grid: 1 column on phones, 2 on tablets, 3 on desktop</td></tr>
<tr><td>Crossed box</td><td><code>&lt;img alt="…"&gt;</code></td><td><code>max-width: 100%</code></td></tr>
<tr><td>④ View details</td><td><code>&lt;a href="/rooms/detail?id=1"&gt;</code> styled as a button</td><td>A class like <code>.btn</code></td></tr>
<tr><td>⑤ Pagination</td><td><code>&lt;nav aria-label="Pages"&gt;</code> with links <code>?page=2</code></td><td>Flexbox, centred</td></tr>
<tr><td>⑥ Empty state</td><td><code>&lt;p&gt;</code> + a "Clear filters" link, shown instead of the grid</td><td>—</td></tr>
<tr><td>Footer</td><td><code>&lt;footer&gt;</code></td><td>—</td></tr>
</tbody>
</table>
<p>The skeleton below is the wireframe turned into semantic HTML. The visible text stays in Vietnamese because the site is Vietnamese:</p>
<pre><code class="language-html">&lt;header class="topbar"&gt;
  &lt;a class="logo" href="/"&gt;Nhà Trọ SV&lt;/a&gt;
  &lt;nav class="menu"&gt;
    &lt;a href="/rooms"&gt;Phòng trống&lt;/a&gt;
    &lt;a href="/about"&gt;Giới thiệu&lt;/a&gt;
  &lt;/nav&gt;
  &lt;div class="auth"&gt;
    &lt;a href="/login"&gt;Đăng nhập&lt;/a&gt;                     &lt;!-- ⑦ --&gt;
    &lt;a class="btn" href="/register"&gt;Đăng ký&lt;/a&gt;
  &lt;/div&gt;
&lt;/header&gt;

&lt;main class="page"&gt;
  &lt;h1&gt;Phòng còn trống&lt;/h1&gt;
  &lt;p class="muted"&gt;Tìm thấy 14 phòng&lt;/p&gt;

  &lt;div class="layout"&gt;
    &lt;aside class="filter"&gt;                              &lt;!-- ② --&gt;
      &lt;form method="get" action="/rooms"&gt;
        &lt;label for="typeId"&gt;Loại phòng&lt;/label&gt;
        &lt;select id="typeId" name="typeId"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Phòng đơn&lt;/option&gt;
          &lt;option value="2"&gt;Phòng đôi&lt;/option&gt;
        &lt;/select&gt;
        &lt;label for="minPrice"&gt;Giá từ (đ)&lt;/label&gt;
        &lt;input id="minPrice" name="minPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="maxPrice"&gt;đến&lt;/label&gt;
        &lt;input id="maxPrice" name="maxPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="floor"&gt;Tầng&lt;/label&gt;
        &lt;select id="floor" name="floor"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Tầng 1&lt;/option&gt;
          &lt;option value="2"&gt;Tầng 2&lt;/option&gt;
        &lt;/select&gt;
        &lt;button class="btn btn-primary" type="submit"&gt;Lọc&lt;/button&gt;
        &lt;a href="/rooms"&gt;Xoá bộ lọc&lt;/a&gt;
      &lt;/form&gt;
    &lt;/aside&gt;

    &lt;section class="cards" aria-label="Danh sách phòng"&gt;  &lt;!-- ③ --&gt;
      &lt;article class="card"&gt;
        &lt;img src="/img/p101.jpg" alt="Phòng P101" width="400" height="250"&gt;
        &lt;div class="card-head"&gt;
          &lt;h2&gt;P101&lt;/h2&gt;
          &lt;span class="badge badge-free"&gt;Còn trống&lt;/span&gt;
        &lt;/div&gt;
        &lt;p&gt;Loại: Phòng đôi · Tầng 1&lt;/p&gt;
        &lt;p&gt;Diện tích: 20 m²&lt;/p&gt;
        &lt;p class="price"&gt;2.500.000 đ / tháng&lt;/p&gt;
        &lt;a class="btn" href="/rooms/detail?id=1"&gt;Xem chi tiết&lt;/a&gt;   &lt;!-- ④ --&gt;
      &lt;/article&gt;
      &lt;!-- five more cards with the same shape --&gt;
    &lt;/section&gt;
  &lt;/div&gt;

  &lt;nav class="pager" aria-label="Phân trang"&gt;           &lt;!-- ⑤ --&gt;
    &lt;a href="/rooms?page=1" aria-current="page"&gt;1&lt;/a&gt;
    &lt;a href="/rooms?page=2"&gt;2&lt;/a&gt;
    &lt;a href="/rooms?page=3"&gt;3&lt;/a&gt;
  &lt;/nav&gt;
&lt;/main&gt;

&lt;footer class="site-footer"&gt;© 2026 Nhà Trọ SV&lt;/footer&gt;</code></pre>
<p>And the layout, mobile-first as in lesson 3.5 — the wireframe's "filter left, three cards per row" is the desktop rule; the phone gets one column:</p>
<pre><code class="language-css">.topbar { display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: 16px; padding: 12px 24px; }
.menu   { display: flex; gap: 24px; }
.layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
.cards  { display: grid; grid-template-columns: 1fr; gap: 16px; }
.card img { max-width: 100%; height: auto; }
.pager  { display: flex; justify-content: center; gap: 8px; margin: 24px 0; }

/* colour only where it means something: the primary action and the status */
.btn-primary { background: #2563eb; color: #fff; }
.badge-free  { border: 1px solid #16a34a; color: #16a34a; }

@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .layout { grid-template-columns: 260px 1fr; }   /* filter left, cards right */
  .cards  { grid-template-columns: repeat(3, 1fr); }
}</code></pre>
<div class="pitfall"><p><strong>Trap — pagination that forgets the filter.</strong> The static links above say <code>?page=2</code>. On a real site, page 2 of "double rooms under 3 million" must be <code>/rooms?typeId=2&amp;maxPrice=3000000&amp;page=2</code>, otherwise clicking "2" silently drops the filter. Note ⑤ in the wireframe says exactly this, which is why the server (Node.js course) or JavaScript (Chapter 4) has to build those links from the current URL — plain HTML cannot.</p></div>

<h3>Tools</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Paper</span><span class="v">The fastest. Draw three versions in ten minutes, photograph the winner, post it in the team chat. Perfect for the first idea.</span></div>
  <div class="kv"><span class="k">draw.io (diagrams.net)</span><span class="v">Free, in the browser or as a desktop app. Has a "Mockups" shape library (buttons, inputs, browser window). Saves a .drawio file you can commit next to the code, so the drawing has a history like the code.</span></div>
  <div class="kv"><span class="k">Figma</span><span class="v">Free starter plan, plus an education plan for verified students. Several people can edit at once, and the same file can grow from wireframe to mockup to clickable prototype.</span></div>
  <div class="kv"><span class="k">Others</span><span class="v">Excalidraw (hand-drawn look, free), Penpot (open-source Figma alternative). Pick one tool per team and stick to it.</span></div>
</div>

<h3>Using AI to turn a wireframe into code — responsibly</h3>
<p>Modern AI assistants can read an image of a wireframe and produce HTML/CSS in seconds. That is genuinely useful — and genuinely risky if you skip the thinking. The rule: <strong>you design, the AI types, you verify and can explain every line.</strong></p>
<ol>
<li>Draw the wireframe yourself. The decisions (what is on the page, where clicks go, who may see it) are the part that is your work.</li>
<li>Give the AI the image <em>and</em> your constraints: plain HTML and CSS, semantic tags, mobile-first, no framework, the field names you actually have.</li>
<li>Ask for a skeleton, not a finished site. Smaller output is easier to check.</li>
<li>Check it against the numbered notes: every number must exist in the code with the right target. Anything in the code that is not in the wireframe gets questioned or deleted.</li>
<li>Open it at 375 px and at 1280 px wide. Read it line by line. If you cannot explain a line, you do not own it yet.</li>
</ol>
<pre><code class="language-plaintext">Here is a wireframe of one page (image attached).
Build ONLY the HTML skeleton + one CSS file:
- semantic tags (header, nav, main, aside, section, article, footer)
- mobile-first: one column by default, filter left + 3 cards per row from 1024px
- the filter is a GET form to /rooms with fields typeId, minPrice, maxPrice, floor
- no framework, no JavaScript, no inline style
- keep the Vietnamese labels exactly as written in the wireframe
Mark each numbered element from the wireframe with an HTML comment (1)…(7).</code></pre>
<div class="pitfall"><p><strong>Trap — accepting what the AI adds.</strong> Typical extras: a search box nobody drew, a rating field the database does not have, an inline <code>style=""</code> on every element, a div where a button belongs, a link to a URL that does not exist. Each one looks harmless and each one is a bug, a lie in your report, or a question you cannot answer when a teacher or a colleague asks "why is this here?".</p></div>

<h3>🧪 Practice</h3>
<p>Wireframe <strong>two pages</strong> of a small app, a "Recipe notebook":</p>
<ol>
<li><strong>Recipe list</strong> — search by name, filter by category (breakfast, main, dessert), recipe cards (photo, cooking time, difficulty), pagination. Everyone may open it.</li>
<li><strong>Recipe detail</strong> — photo, ingredients, numbered steps, and a "Save to favourites" button that only logged-in users see.</li>
</ol>
<p>Use paper or draw.io, 20–30 minutes in total. Then build page 1 in HTML and CSS using the mapping table above.</p>
<p><strong>Check yourself before calling it done:</strong></p>
<ul>
<li>☐ The URL and who may open it are written at the top of each page.</li>
<li>☐ Every clickable spot has a number and a target (URL, or what it does).</li>
<li>☐ Buttons and headings carry real words, not "Button" or "Title".</li>
<li>☐ Grey only; colour appears only for the primary action or a status.</li>
<li>☐ Images are crossed boxes.</li>
<li>☐ The empty state is drawn ("No recipes match").</li>
<li>☐ A phone version (one column) is sketched next to the desktop one.</li>
<li>☐ For every box you can say where its data comes from.</li>
<li>☐ A classmate can explain the page from your drawing without you talking.</li>
</ul>

<h3>Going further</h3>
<p>This lesson is the developer's minimum. The UX/UI for Developers course goes deeper — sketching techniques, low- and high-fidelity wireframes, Figma, prototypes and testing them with users — in Chapter 4. Note: that course is still an outline; its lessons are being written.</p>
<div class="link-card"><a href="/courses/ux-ui-for-developers/learn?lessonSlug=uxui-4-1-phac-thao">UX/UI for Developers — 4.1 Sketching and low-fidelity wireframes (outline)</a></div>
<div class="link-card"><a href="https://www.drawio.com/" target="_blank" rel="noopener">draw.io — free diagram and wireframe editor</a></div>
<div class="link-card"><a href="https://www.figma.com/education/" target="_blank" rel="noopener">Figma for Education — free plan for students</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5b · bài bổ sung</span>
<h2>Vẽ trang trước khi code</h2>
<p class="lead">Tới đây bạn đã biết đủ HTML và CSS để dựng một trang thật. Cách nhanh nhất để dựng <em>sai</em> trang là mở editor ra trước. <strong>Wireframe</strong> (bản phác khung giao diện) là một hình vẽ mười phút quyết định cái gì nằm ở đâu, mỗi cú bấm làm gì và ai được xem trang — trước khi gõ một thẻ nào.</p>

<h3>Wireframe là gì</h3>
<p>Hãy nghĩ tới một ngôi nhà. Không ai đổ bê tông trước rồi mới tính bếp đặt đâu; kiến trúc sư vẽ <strong>bản vẽ mặt bằng</strong>: phòng là hình chữ nhật, cửa là khoảng hở, chỗ nào cũng có nhãn. Không màu sơn, không hiệu nội thất. Bản vẽ có để mọi người — chủ nhà, thợ xây, thợ điện — thống nhất bố cục khi việc sửa vẫn chỉ tốn một cục tẩy.</p>
<p>Wireframe là bản vẽ mặt bằng của một trang. Nó cho thấy bốn thứ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Hộp</span><span class="v">Có những khối nào và nằm ở đâu: thanh trên cùng, khung bộ lọc, danh sách thẻ, phân trang, chân trang.</span></div>
  <div class="kv"><span class="k">Điều khiển</span><span class="v">Mọi nút, liên kết, ô nhập và ô chọn — ghi đúng chữ thật sẽ hiện trên đó.</span></div>
  <div class="kv"><span class="k">Bấm đi đâu</span><span class="v">Mỗi chỗ bấm được đánh một số, và một ghi chú nói nó mở URL nào hoặc làm việc gì.</span></div>
  <div class="kv"><span class="k">Ai được mở</span><span class="v">URL của trang và các vai trò được vào: mọi người, chỉ người đã đăng nhập, chỉ admin.</span></div>
</div>
<p>Nó cố ý bỏ qua màu sắc, phông chữ, ảnh thật và kích thước pixel chính xác. Mấy thứ đó tính sau, và cãi nhau về chúng quá sớm là cách một nhóm mất toi một tuần.</p>

<h3>Năm từ hay bị lẫn</h3>
<table>
<thead><tr><th>Giai đoạn</th><th>Trông như thế nào</th><th>Trả lời câu hỏi gì</th><th>Công cụ · thời gian</th></tr></thead>
<tbody>
<tr><td><strong>Phác thảo (sketch)</strong></td><td>Bút trên giấy, hộp nguệch ngoạc</td><td>"Đại khái trang này có gì?"</td><td>Giấy · 2–5 phút</td></tr>
<tr><td><strong>Wireframe độ trung thực thấp (low-fidelity)</strong></td><td>Hộp xám, chữ thật, chỗ bấm có đánh số</td><td>"Cái gì ở đâu, bấm vào thì đi đâu?"</td><td>draw.io, Figma, giấy · 10–30 phút</td></tr>
<tr><td><strong>Wireframe độ trung thực cao (high-fidelity)</strong></td><td>Khoảng cách và cỡ chữ thật, vẫn chủ yếu là xám</td><td>"Nội dung có vừa thật không?"</td><td>Figma · 1–2 giờ</td></tr>
<tr><td><strong>Mockup</strong></td><td>Màu, phông, icon, ảnh đúng bản cuối — một bức ảnh tĩnh</td><td>"Trông nó sẽ ra sao?"</td><td>Figma · vài giờ</td></tr>
<tr><td><strong>Prototype (bản mẫu bấm được)</strong></td><td>Các mockup (hoặc wireframe) nối với nhau để bấm thử</td><td>"Người dùng đi qua luồng có thuận không?"</td><td>Chế độ prototype của Figma · vài giờ</td></tr>
<tr><td><strong>Giao diện thật (final UI)</strong></td><td>HTML/CSS/JS thật, dữ liệu thật</td><td>"Nó có chạy không?"</td><td>Code của bạn · nhiều ngày</td></tr>
</tbody>
</table>
<p>Là lập trình viên, bạn sẽ vẽ wireframe low-fidelity nhiều nhất. Nó đủ rẻ để vứt đi và đủ chính xác để code theo.</p>

<h3>Vì sao lập trình viên nên vẽ</h3>
<ul>
<li><strong>Cả nhóm thống nhất trước khi code.</strong> "Bộ lọc nằm bên trái hay ở trên?" mất một phút trước bảng trắng, nhưng mất cả buổi chiều viết lại CSS nếu để sau. Có wireframe thì ba người làm ba trang vẫn ra một website.</li>
<li><strong>Ít phải làm lại.</strong> Vẽ buộc bạn trả lời những câu mà nếu không thì nửa chừng code mới lòi ra: lọc không ra kết quả thì hiện gì? Nút "Quay lại" về đâu? Khách chưa đăng nhập có thấy nút "Đặt phòng" không?</li>
<li><strong>Nó thành tài liệu.</strong> Báo cáo đồ án ở trường đòi phần thiết kế màn hình: ở FPTU, báo cáo SWP391 và SEP490 có bố cục và luồng màn hình, còn SWR302 yêu cầu mockup cho các yêu cầu. Một wireframe gọn gàng chính là phần đó, làm sẵn rồi.</li>
<li><strong>Đi làm thật thường không có designer.</strong> Ở công ty nhỏ, việc freelance hay công cụ nội bộ, lập trình viên kiêm luôn thiết kế. Khách hàng xem wireframe ngay ngày đầu sẽ chỉ ra chỗ sai khi sửa vẫn còn miễn phí.</li>
<li><strong>Nó lộ ra dữ liệu bạn cần.</strong> Mỗi hộp trên màn hình hiện dữ liệu lấy từ đâu đó. "Diện tích: 20 m²" trên thẻ nghĩa là phải có một trường kiểu <code>area</code> trong cơ sở dữ liệu hoặc API.</li>
</ul>

<h3>Quy ước giúp wireframe dễ đọc</h3>
<p>Đây là thói quen đa số nhóm dùng chung, không phải luật. Cứ điều chỉnh, nhưng trong nhóm phải thống nhất với nhau.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mặc định là xám</span><span class="lz-d">Đen, trắng và các sắc xám. Chỉ dùng màu khi màu mang nghĩa: hành động chính duy nhất của trang, hoặc trạng thái (còn trống / đã thuê). Cái gì cũng có màu thì chẳng cái gì nổi bật.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hộp gạch chéo là ảnh</span><span class="lz-d">Hình chữ nhật có dấu X là ký hiệu chung của "chỗ này đặt ảnh". Chưa cần đi tìm ảnh thật.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chữ thật, không phải "Button"</span><span class="lz-d">Ghi "Xem chi tiết", "Lọc", "Đăng nhập". Chữ thật làm lộ sớm những nhãn khó hiểu, và chính là chữ bạn sẽ gõ vào HTML.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đánh số mọi chỗ bấm được</span><span class="lz-d">Gắn số lên nó và ghi đích đến bên cạnh hình: "② Lọc ⇒ GET /rooms?typeId=…". Chỗ bấm không đánh số là chỗ không ai làm.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ghi URL và ai được mở</span><span class="lz-d">Ở trên cùng: địa chỉ của trang và các vai trò được vào. Dòng này về sau thành route và phép kiểm quyền của bạn.</span></div>
</div>
<p>Thêm hai thói quen bớt cãi nhau: vẽ <strong>trạng thái rỗng</strong> (không có kết quả, chưa có dữ liệu) và phác <strong>bản điện thoại</strong> — thường là một cột — đặt cạnh bản máy tính.</p>

<h3>Ví dụ: trang chủ "Nhà trọ sinh viên"</h3>
<p>Một nhóm sinh viên làm web cho thuê phòng trọ đã vẽ hình này trước khi viết dòng code nào. Đây là trang chủ: danh sách phòng còn trống, có bộ lọc và phân trang. Đọc chậm — mọi quy ước ở trên đều có trong đó.</p>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/WIREFRAME/v1/nha-tro-sv/001.webp" alt="Wireframe độ trung thực thấp trang chủ Nhà trọ sinh viên: thanh điều hướng, bộ lọc bên trái, lưới 3 x 2 thẻ phòng với ô ảnh gạch chéo, phân trang, chân trang và bảy ghi chú đánh số bên phải" loading="lazy" width="1600" height="1150" /><p class="chu-thich">🖼️ Wireframe trang chủ web Nhà trọ sinh viên: hộp xám, ảnh gạch chéo, chữ thật, bảy chỗ bấm đánh số kèm đích đến, URL và quyền truy cập ghi ở trên cùng.</p></div>
<p>Mỗi phần nói gì với người code:</p>
<ul>
<li><strong>Dòng đầu</strong> — URL <code>/rooms?typeId=&amp;minPrice=&amp;maxPrice=&amp;floor=&amp;page=</code>, ai cũng vào được, kể cả khách chưa đăng nhập. Bạn đã biết route, các tham số query và việc nó không cần đăng nhập.</li>
<li><strong>① Thanh điều hướng</strong> — dùng chung cho mọi trang; đăng nhập rồi thì hai nút được thay bằng tên người dùng và "Đăng xuất". Một hình vẽ, hai trạng thái.</li>
<li><strong>② Bộ lọc</strong> — một form gửi bằng GET về chính URL đó, giữ nguyên giá trị người dùng đã nhập. Dùng GET vì lọc chỉ <em>đọc</em>: URL lưu dấu trang được, gửi cho bạn được, tải lại được (bài 2.4 và 6.5).</li>
<li><strong>③ Thẻ phòng</strong> — mỗi thẻ là một phòng đang hoạt động và chưa có người thuê. Đó là một luật nghiệp vụ nấp trong hình vẽ; nó sẽ thành một điều kiện trong câu truy vấn cơ sở dữ liệu.</li>
<li><strong>④ "Xem chi tiết"</strong> — đi tới <code>/rooms/detail?id=3</code>, cũng chính là trang tiếp theo cần vẽ.</li>
<li><strong>⑤ Phân trang</strong> — sáu phòng mỗi trang, <code>?page=2</code>, và giá trị bộ lọc phải còn nguyên khi chuyển trang.</li>
<li><strong>⑥ Trạng thái rỗng</strong> — "Không tìm thấy phòng phù hợp" kèm liên kết "Xoá bộ lọc". Không có ghi chú này, sẽ có người giao một trang trắng trơn.</li>
<li><strong>⑦ Đăng nhập / Đăng ký</strong> — <code>/login</code> và <code>/register</code>.</li>
</ul>
<p>Chỉ nút "Lọc" và số trang hiện tại được tô đậm hơn: đó là hai chỗ duy nhất mà sự nhấn mạnh có ý nghĩa.</p>

<h3>Từ wireframe sang HTML và CSS</h3>
<p>Một wireframe tốt dịch ra gần như từng hộp một. Một quy tắc hữu ích rút từ các con số: <strong>ghi chú nói "⇒ một URL" là liên kết (<code>&lt;a&gt;</code>); ghi chú gửi dữ liệu hoặc làm thay đổi gì đó là nút nằm trong form.</strong></p>
<table>
<thead><tr><th>Hộp trên wireframe</th><th>HTML</th><th>CSS (Chương 3)</th></tr></thead>
<tbody>
<tr><td>① Thanh trên cùng</td><td><code>&lt;header&gt;</code> + <code>&lt;nav&gt;</code> chứa các <code>&lt;a&gt;</code></td><td>Flexbox, <code>justify-content: space-between</code></td></tr>
<tr><td>Tiêu đề + "Tìm thấy 14 phòng"</td><td><code>&lt;h1&gt;</code> + <code>&lt;p&gt;</code></td><td>—</td></tr>
<tr><td>② Khung bộ lọc</td><td><code>&lt;aside&gt;</code> &gt; <code>&lt;form method="get" action="/rooms"&gt;</code>, <code>&lt;label&gt;</code> + <code>&lt;select&gt;</code>/<code>&lt;input&gt;</code></td><td>Cột trái của một lưới grid</td></tr>
<tr><td>③ Lưới thẻ</td><td><code>&lt;section&gt;</code> chứa sáu <code>&lt;article class="card"&gt;</code></td><td>Grid: điện thoại 1 cột, tablet 2, máy tính 3</td></tr>
<tr><td>Hộp gạch chéo</td><td><code>&lt;img alt="…"&gt;</code></td><td><code>max-width: 100%</code></td></tr>
<tr><td>④ Xem chi tiết</td><td><code>&lt;a href="/rooms/detail?id=1"&gt;</code> trang trí như nút</td><td>Một class kiểu <code>.btn</code></td></tr>
<tr><td>⑤ Phân trang</td><td><code>&lt;nav aria-label="Phân trang"&gt;</code> chứa liên kết <code>?page=2</code></td><td>Flexbox, căn giữa</td></tr>
<tr><td>⑥ Trạng thái rỗng</td><td><code>&lt;p&gt;</code> + liên kết "Xoá bộ lọc", hiện thay cho lưới</td><td>—</td></tr>
<tr><td>Chân trang</td><td><code>&lt;footer&gt;</code></td><td>—</td></tr>
</tbody>
</table>
<p>Bộ khung dưới đây là wireframe đổi thành HTML ngữ nghĩa:</p>
<pre><code class="language-html">&lt;header class="topbar"&gt;
  &lt;a class="logo" href="/"&gt;Nhà Trọ SV&lt;/a&gt;
  &lt;nav class="menu"&gt;
    &lt;a href="/rooms"&gt;Phòng trống&lt;/a&gt;
    &lt;a href="/about"&gt;Giới thiệu&lt;/a&gt;
  &lt;/nav&gt;
  &lt;div class="auth"&gt;
    &lt;a href="/login"&gt;Đăng nhập&lt;/a&gt;                     &lt;!-- ⑦ --&gt;
    &lt;a class="btn" href="/register"&gt;Đăng ký&lt;/a&gt;
  &lt;/div&gt;
&lt;/header&gt;

&lt;main class="page"&gt;
  &lt;h1&gt;Phòng còn trống&lt;/h1&gt;
  &lt;p class="muted"&gt;Tìm thấy 14 phòng&lt;/p&gt;

  &lt;div class="layout"&gt;
    &lt;aside class="filter"&gt;                              &lt;!-- ② --&gt;
      &lt;form method="get" action="/rooms"&gt;
        &lt;label for="typeId"&gt;Loại phòng&lt;/label&gt;
        &lt;select id="typeId" name="typeId"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Phòng đơn&lt;/option&gt;
          &lt;option value="2"&gt;Phòng đôi&lt;/option&gt;
        &lt;/select&gt;
        &lt;label for="minPrice"&gt;Giá từ (đ)&lt;/label&gt;
        &lt;input id="minPrice" name="minPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="maxPrice"&gt;đến&lt;/label&gt;
        &lt;input id="maxPrice" name="maxPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="floor"&gt;Tầng&lt;/label&gt;
        &lt;select id="floor" name="floor"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Tầng 1&lt;/option&gt;
          &lt;option value="2"&gt;Tầng 2&lt;/option&gt;
        &lt;/select&gt;
        &lt;button class="btn btn-primary" type="submit"&gt;Lọc&lt;/button&gt;
        &lt;a href="/rooms"&gt;Xoá bộ lọc&lt;/a&gt;
      &lt;/form&gt;
    &lt;/aside&gt;

    &lt;section class="cards" aria-label="Danh sách phòng"&gt;  &lt;!-- ③ --&gt;
      &lt;article class="card"&gt;
        &lt;img src="/img/p101.jpg" alt="Phòng P101" width="400" height="250"&gt;
        &lt;div class="card-head"&gt;
          &lt;h2&gt;P101&lt;/h2&gt;
          &lt;span class="badge badge-free"&gt;Còn trống&lt;/span&gt;
        &lt;/div&gt;
        &lt;p&gt;Loại: Phòng đôi · Tầng 1&lt;/p&gt;
        &lt;p&gt;Diện tích: 20 m²&lt;/p&gt;
        &lt;p class="price"&gt;2.500.000 đ / tháng&lt;/p&gt;
        &lt;a class="btn" href="/rooms/detail?id=1"&gt;Xem chi tiết&lt;/a&gt;   &lt;!-- ④ --&gt;
      &lt;/article&gt;
      &lt;!-- năm thẻ nữa cùng hình dạng --&gt;
    &lt;/section&gt;
  &lt;/div&gt;

  &lt;nav class="pager" aria-label="Phân trang"&gt;           &lt;!-- ⑤ --&gt;
    &lt;a href="/rooms?page=1" aria-current="page"&gt;1&lt;/a&gt;
    &lt;a href="/rooms?page=2"&gt;2&lt;/a&gt;
    &lt;a href="/rooms?page=3"&gt;3&lt;/a&gt;
  &lt;/nav&gt;
&lt;/main&gt;

&lt;footer class="site-footer"&gt;© 2026 Nhà Trọ SV&lt;/footer&gt;</code></pre>
<p>Và bố cục, mobile-first đúng như bài 3.5 — "bộ lọc bên trái, ba thẻ một hàng" trên wireframe là luật cho máy tính; điện thoại chỉ một cột:</p>
<pre><code class="language-css">.topbar { display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: 16px; padding: 12px 24px; }
.menu   { display: flex; gap: 24px; }
.layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
.cards  { display: grid; grid-template-columns: 1fr; gap: 16px; }
.card img { max-width: 100%; height: auto; }
.pager  { display: flex; justify-content: center; gap: 8px; margin: 24px 0; }

/* màu chỉ đặt ở chỗ có nghĩa: hành động chính và trạng thái */
.btn-primary { background: #2563eb; color: #fff; }
.badge-free  { border: 1px solid #16a34a; color: #16a34a; }

@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .layout { grid-template-columns: 260px 1fr; }   /* bộ lọc trái, thẻ phải */
  .cards  { grid-template-columns: repeat(3, 1fr); }
}</code></pre>
<div class="pitfall"><p><strong>Bẫy — phân trang quên mất bộ lọc.</strong> Các liên kết tĩnh ở trên ghi <code>?page=2</code>. Trên web thật, trang 2 của "phòng đôi dưới 3 triệu" phải là <code>/rooms?typeId=2&amp;maxPrice=3000000&amp;page=2</code>, nếu không thì bấm "2" là bộ lọc lặng lẽ biến mất. Ghi chú ⑤ trên wireframe nói đúng điều này, và đó là lý do server (khoá Node.js) hoặc JavaScript (Chương 4) phải dựng các liên kết đó từ URL hiện tại — HTML thuần không làm được.</p></div>

<h3>Công cụ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Giấy</span><span class="v">Nhanh nhất. Vẽ ba phương án trong mười phút, chụp ảnh bản thắng, gửi vào nhóm chat. Hợp nhất cho ý tưởng đầu tiên.</span></div>
  <div class="kv"><span class="k">draw.io (diagrams.net)</span><span class="v">Miễn phí, chạy trên trình duyệt hoặc cài bản máy tính. Có thư viện hình "Mockups" (nút, ô nhập, khung trình duyệt). Lưu thành file .drawio commit được cạnh code, nên hình vẽ cũng có lịch sử như code.</span></div>
  <div class="kv"><span class="k">Figma</span><span class="v">Có gói miễn phí, và gói Education miễn phí cho sinh viên đã xác minh. Nhiều người sửa cùng lúc, và cùng một file có thể lớn dần từ wireframe lên mockup rồi prototype bấm được.</span></div>
  <div class="kv"><span class="k">Khác</span><span class="v">Excalidraw (nét vẽ tay, miễn phí), Penpot (mã nguồn mở, thay thế Figma). Mỗi nhóm chọn một công cụ rồi dùng thống nhất.</span></div>
</div>

<h3>Dùng AI đổi wireframe thành code — có trách nhiệm</h3>
<p>Trợ lý AI bây giờ đọc được ảnh wireframe và sinh HTML/CSS trong vài giây. Việc đó thật sự có ích — và thật sự rủi ro nếu bạn bỏ qua phần suy nghĩ. Luật là: <strong>bạn thiết kế, AI gõ phím, bạn kiểm và giải thích được từng dòng.</strong></p>
<ol>
<li>Tự vẽ wireframe. Các quyết định (trang có gì, bấm đi đâu, ai được xem) mới là phần việc của bạn.</li>
<li>Đưa AI ảnh wireframe <em>kèm</em> ràng buộc: HTML và CSS thuần, thẻ ngữ nghĩa, mobile-first, không framework, đúng tên trường dữ liệu bạn thật sự có.</li>
<li>Xin bộ khung, đừng xin cả website. Kết quả nhỏ thì dễ kiểm.</li>
<li>So với các ghi chú đánh số: số nào cũng phải có trong code với đúng đích đến. Thứ gì có trong code mà không có trên wireframe thì phải hỏi lại hoặc xoá.</li>
<li>Mở ở bề ngang 375 px và 1280 px. Đọc từng dòng. Dòng nào bạn chưa giải thích được thì nó chưa phải của bạn.</li>
</ol>
<pre><code class="language-plaintext">Đây là wireframe của một trang (ảnh đính kèm).
CHỈ dựng bộ khung HTML + một file CSS:
- thẻ ngữ nghĩa (header, nav, main, aside, section, article, footer)
- mobile-first: mặc định một cột; từ 1024px bộ lọc bên trái + 3 thẻ một hàng
- bộ lọc là form GET tới /rooms với các trường typeId, minPrice, maxPrice, floor
- không framework, không JavaScript, không style inline
- giữ nguyên các nhãn tiếng Việt đúng như trên wireframe
Đánh dấu mỗi phần tử có số trên wireframe bằng một chú thích HTML (1)…(7).</code></pre>
<div class="pitfall"><p><strong>Bẫy — nhận hết những gì AI tự thêm.</strong> Mấy thứ hay gặp: một ô tìm kiếm không ai vẽ, một trường đánh giá sao mà cơ sở dữ liệu không có, <code>style=""</code> inline trên mọi phần tử, một thẻ div ở chỗ đáng lẽ là nút, một liên kết tới URL không tồn tại. Từng cái trông vô hại, nhưng mỗi cái là một lỗi, một điều sai trong báo cáo, hoặc một câu bạn không trả lời được khi thầy cô hay đồng nghiệp hỏi "cái này để làm gì?".</p></div>

<h3>🧪 Thực hành</h3>
<p>Vẽ wireframe <strong>hai trang</strong> của một app nhỏ, "Sổ công thức nấu ăn":</p>
<ol>
<li><strong>Danh sách công thức</strong> — tìm theo tên, lọc theo loại (bữa sáng, món chính, tráng miệng), thẻ công thức (ảnh, thời gian nấu, độ khó), phân trang. Ai cũng mở được.</li>
<li><strong>Chi tiết công thức</strong> — ảnh, nguyên liệu, các bước đánh số, và nút "Lưu vào yêu thích" mà chỉ người đã đăng nhập mới thấy.</li>
</ol>
<p>Dùng giấy hoặc draw.io, tổng cộng 20–30 phút. Sau đó dựng trang 1 bằng HTML và CSS theo bảng đối chiếu ở trên.</p>
<p><strong>Tự kiểm trước khi coi là xong:</strong></p>
<ul>
<li>☐ URL và ai được mở ghi ở trên cùng mỗi trang.</li>
<li>☐ Mọi chỗ bấm được đều có số và đích đến (URL, hoặc nó làm gì).</li>
<li>☐ Nút và tiêu đề mang chữ thật, không phải "Button" hay "Tiêu đề".</li>
<li>☐ Chỉ có xám; màu chỉ xuất hiện ở hành động chính hoặc trạng thái.</li>
<li>☐ Ảnh là hộp gạch chéo.</li>
<li>☐ Có vẽ trạng thái rỗng ("Không có công thức phù hợp").</li>
<li>☐ Có phác bản điện thoại (một cột) đặt cạnh bản máy tính.</li>
<li>☐ Với mỗi hộp, bạn nói được dữ liệu của nó lấy từ đâu.</li>
<li>☐ Một bạn cùng lớp nhìn hình của bạn là giải thích được trang, không cần bạn nói.</li>
</ul>

<h3>Đi xa hơn</h3>
<p>Bài này là mức tối thiểu cho lập trình viên. Khoá UX/UI cho lập trình viên đi sâu hơn — kỹ thuật phác thảo, wireframe độ trung thực thấp và cao, Figma, prototype và thử với người dùng — ở Chương 4. Lưu ý: khoá đó hiện mới có đề cương, các bài đang được soạn.</p>
<div class="link-card"><a href="/courses/ux-ui-for-developers/learn?lessonSlug=uxui-4-1-phac-thao">UX/UI cho lập trình viên — 4.1 Phác thảo và wireframe độ trung thực thấp (đề cương)</a></div>
<div class="link-card"><a href="https://www.drawio.com/" target="_blank" rel="noopener">draw.io — trình vẽ sơ đồ và wireframe miễn phí</a></div>
<div class="link-card"><a href="https://www.figma.com/education/" target="_blank" rel="noopener">Figma for Education — gói miễn phí cho sinh viên</a></div>
</div>
`,
    },

    /* ─────────────────────────── 3.6 quiz ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra chương 3',
      slug: 'wf-3-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về bộ chọn và cascade, box model, Flexbox, Grid và thiết kế responsive.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 3: selectors and the cascade, the box model and box-sizing, Flexbox axes, CSS Grid, relative units and media queries.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> CSS layout only clicks once you push pixels yourself. On Code Lab, style and lay out real elements — box model, Flexbox, Grid and responsive — with instant feedback.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Cascade</span><span class="lz-t">Specificity, then source order</span><span class="lz-d">DevTools strikes through the rules that lost. Read it before reaching for <code>!important</code>, which hides the cause rather than fixing it.</span></div>
<div class="lz-node"><span class="lz-k">Box model</span><span class="lz-t">border-box, once, at the top</span><span class="lz-d"><code>* { box-sizing: border-box }</code> makes <code>width</code> mean the visible box. Without it, padding pushes columns past 100%.</span></div>
<div class="lz-node"><span class="lz-k">Flexbox</span><span class="lz-t">One direction, and the axis matters</span><span class="lz-d">Set <code>flex-direction</code> first: <code>justify-content</code> and <code>align-items</code> swap meaning between row and column.</span></div>
<div class="lz-node"><span class="lz-k">Grid &amp; responsive</span><span class="lz-t">Two directions; mobile as the default</span><span class="lz-d">Grid for the page skeleton, flexbox inside it. Write the one-column layout first, then add <code>min-width</code> queries where the design breaks.</span></div>
</div>
<p class="note-ct"><strong>Do not memorise CSS properties.</strong> Nobody does. Learn the four models above — cascade, box, flex axis, grid tracks — and look the properties up. The models are what let you read someone else's stylesheet.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-3-0-slides&amp;khoa=web-foundations">Practice on Code Lab → the Chapter 3 set, easy to hard</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 3: bộ chọn và cascade, box model và box-sizing, các trục Flexbox, CSS Grid, đơn vị tương đối và media query.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Bố cục CSS chỉ thật sự thông khi bạn tự tay đẩy từng pixel. Trên Code Lab, hãy tạo kiểu và dàn các phần tử thật — box model, Flexbox, Grid và responsive — với phản hồi tức thì.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Đổ tầng (cascade)</span><span class="lz-t">Độ đặc hiệu, rồi tới thứ tự trong mã</span><span class="lz-d">DevTools gạch ngang những luật đã thua. Hãy đọc nó trước khi với tay lấy <code>!important</code>, thứ giấu nguyên nhân đi chứ không sửa nó.</span></div>
<div class="lz-node"><span class="lz-k">Mô hình hộp</span><span class="lz-t">border-box, một lần, ở trên cùng</span><span class="lz-d"><code>* { box-sizing: border-box }</code> làm <code>width</code> nghĩa là cái hộp nhìn thấy được. Thiếu nó, padding đẩy các cột vượt quá 100%.</span></div>
<div class="lz-node"><span class="lz-k">Flexbox</span><span class="lz-t">Một chiều, và cái trục có ý nghĩa</span><span class="lz-d">Hãy đặt <code>flex-direction</code> trước: <code>justify-content</code> và <code>align-items</code> đổi nghĩa cho nhau giữa row và column.</span></div>
<div class="lz-node"><span class="lz-k">Grid &amp; responsive</span><span class="lz-t">Hai chiều; điện thoại làm mặc định</span><span class="lz-d">Grid cho bộ khung trang, flexbox bên trong nó. Hãy viết bố cục một cột trước, rồi thêm query <code>min-width</code> ở chỗ thiết kế vỡ.</span></div>
</div>
<p class="note-ct"><strong>Đừng học thuộc các thuộc tính CSS.</strong> Chẳng ai làm thế. Hãy học bốn mô hình ở trên — cascade, hộp, trục flex, rãnh grid — rồi tra thuộc tính khi cần. Chính các mô hình mới là thứ giúp bạn đọc được bảng kiểu của người khác.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-3-0-slides&amp;khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 3, từ dễ đến khó</a></div></div>
${onTapBai('wf-3-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which selector matches every element with class="card"?|||Bộ chọn nào khớp mọi phần tử có class="card"?',
            options: [
              '.card|||.card',
              '#card|||#card',
              'card|||card',
              '*card|||*card',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The recommended way to add CSS to a real site is…|||Cách được khuyến nghị để thêm CSS cho một site thật là…',
            options: [
              'An external .css file linked from <head>|||Một file .css riêng liên kết từ <head>',
              'An inline style="" on every element|||Một style="" inline trên mọi phần tử',
              'A <style> block repeated on each page|||Một khối <style> lặp lại trên từng trang',
              'Writing CSS inside the JavaScript file|||Viết CSS bên trong file JavaScript',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What are the four layers of the box model, inside to outside?|||Bốn lớp của box model, từ trong ra ngoài, là gì?',
            options: [
              'content, padding, border, margin|||content, padding, border, margin',
              'margin, border, padding, content|||margin, border, padding, content',
              'padding, content, margin, border|||padding, content, margin, border',
              'border, margin, content, padding|||border, margin, content, padding',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does box-sizing: border-box do?|||box-sizing: border-box làm gì?',
            options: [
              'Makes width include padding and border, so sizes are predictable|||Khiến width bao gồm padding và border, nên kích thước dễ đoán',
              'Removes all borders|||Xoá mọi đường viền',
              'Doubles the element width|||Nhân đôi chiều rộng phần tử',
              'Turns the element into a flex container|||Biến phần tử thành flex container',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In Flexbox, justify-content positions items along which axis?|||Trong Flexbox, justify-content đặt vị trí các mục dọc theo trục nào?',
            options: [
              'The main axis|||Trục chính',
              'The cross axis|||Trục phụ',
              'Both axes at once|||Cả hai trục cùng lúc',
              'Neither — it sets colours|||Không trục nào — nó đặt màu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which pair of properties perfectly centres a child with Flexbox?|||Cặp thuộc tính nào căn giữa hoàn hảo một phần tử con bằng Flexbox?',
            options: [
              'justify-content: center; align-items: center;|||justify-content: center; align-items: center;',
              'text-align: center; margin: 0;|||text-align: center; margin: 0;',
              'float: center; clear: both;|||float: center; clear: both;',
              'position: center; top: 50%;|||position: center; top: 50%;',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the fr unit mean in CSS Grid?|||Đơn vị fr trong CSS Grid nghĩa là gì?',
            options: [
              'A fraction of the available free space|||Một phần của không gian trống có sẵn',
              'A fixed number of pixels|||Một số pixel cố định',
              'The font size|||Cỡ chữ',
              'A French locale setting|||Một thiết lập ngôn ngữ tiếng Pháp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'For a one-dimensional row (like a navbar), which tool fits best?|||Với một hàng một chiều (như thanh điều hướng), công cụ nào hợp nhất?',
            options: [
              'Flexbox|||Flexbox',
              'A table|||Một cái bảng',
              'Absolute positioning of every item|||Định vị tuyệt đối từng mục',
              'Nothing — HTML aligns rows by itself|||Không cần gì — HTML tự căn hàng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which meta tag is required for responsive design to work on phones?|||Thẻ meta nào bắt buộc để responsive hoạt động trên điện thoại?',
            options: [
              '<meta name="viewport" content="width=device-width, initial-scale=1">|||<meta name="viewport" content="width=device-width, initial-scale=1">',
              '<meta charset="UTF-8">|||<meta charset="UTF-8">',
              '<meta name="description" content="...">|||<meta name="description" content="...">',
              '<meta name="mobile" content="yes">|||<meta name="mobile" content="yes">',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is a "mobile-first" media query strategy?|||Chiến lược media query "mobile-first" là gì?',
            options: [
              'Write base CSS for phones, then use min-width queries to add for larger screens|||Viết CSS nền cho điện thoại, rồi dùng query min-width để thêm cho màn hình lớn hơn',
              'Write for desktop, then hide things on mobile|||Viết cho desktop, rồi ẩn bớt trên di động',
              'Only support mobile and block desktops|||Chỉ hỗ trợ di động và chặn desktop',
              'Use a completely separate mobile website|||Dùng một website di động hoàn toàn tách biệt',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
