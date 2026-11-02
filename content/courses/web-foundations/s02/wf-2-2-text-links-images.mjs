/**
 * Bài 2.2 — Chữ, liên kết, ảnh (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/2-2; _demo/_t2/chay.mjs đo
 * ảnh tới chậm 1 giây bằng page.route). Deck: scripts/slides-src/wf-2-2.mjs (11 slide, WF/v1/wf-2-2). Code Lab: module 2.2 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-2-2', 'Text, links and images', 'Chữ, liên kết và ảnh', [
  [1, 'Text, links and images',
    '<p>Ninety percent of the web is text, links and pictures. This lesson covers each one properly: how the browser treats your spaces, how a relative link turns into a real address, what happens when an image is missing, and how to stop images from making the page jump.</p>',
    '<p>Chín mươi phần trăm web là chữ, liên kết và ảnh. Bài này dạy từng thứ cho đúng: trình duyệt xử lý dấu cách của bạn thế nào, một liên kết tương đối biến thành địa chỉ thật ra sao, chuyện gì xảy ra khi thiếu ảnh, và làm sao để ảnh không khiến trang nhảy.</p>'],
  [2, 'After this lesson you can…',
    '<p>Each outcome here fixes a bug beginners really meet: a heading used only for its size, a broken link after moving a file, an image that works on your laptop but not on the server, and text that jumps while images load. All of them were measured in Chromium.</p>',
    '<p>Mỗi kết quả ở đây sửa một lỗi người mới thật sự gặp: dùng tiêu đề chỉ vì cỡ chữ, liên kết hỏng sau khi chuyển tệp, ảnh chạy trên laptop mà không chạy trên máy chủ, và chữ nhảy lúc ảnh đang tải. Tất cả đều đã được đo trong Chromium.</p>'],
  [3, 'Headings are an outline',
    '<p>Screen-reader users jump through a page by its headings, and search engines read them as the table of contents. This small script prints the outline of a page and flags the jump from h2 to h4. Choose the level by structure, never by size: CSS changes the size.</p>',
    '<p>Người dùng trình đọc màn hình nhảy qua trang theo các tiêu đề, và công cụ tìm kiếm đọc chúng như mục lục. Script nhỏ này in dàn ý của trang và đánh dấu chỗ nhảy từ h2 xuống h4. Hãy chọn cấp theo cấu trúc, đừng theo cỡ chữ: CSS mới là thứ đổi cỡ chữ.</p>'],
  [4, 'The browser collapses whitespace',
    '<p>Your file has extra spaces and three line breaks; the page shows one line. In HTML any run of spaces and newlines becomes a single space. To break a line use <code>br</code>; for a new thought use a new <code>p</code>; to keep every space, as for code, use <code>pre</code>.</p>',
    '<p>Tệp của bạn có thêm dấu cách và ba lần xuống dòng; trang chỉ hiện một dòng. Trong HTML mọi chuỗi dấu cách và xuống dòng đều gộp thành một dấu cách. Muốn ngắt dòng thì dùng <code>br</code>; ý mới thì dùng <code>p</code> mới; muốn giữ mọi dấu cách, như với mã, dùng <code>pre</code>.</p>'],
  [5, 'Lists',
    '<p>Use <code>ul</code> when order does not matter, <code>ol</code> when it does, and <code>dl</code> for terms with definitions. A nested list goes inside an <code>li</code>, not directly inside the list. The screenshot shows how each one renders without any CSS.</p>',
    '<p>Dùng <code>ul</code> khi thứ tự không quan trọng, <code>ol</code> khi có, và <code>dl</code> cho thuật ngữ kèm định nghĩa. Danh sách lồng phải nằm trong một <code>li</code>, không nằm thẳng trong danh sách. Ảnh chụp cho thấy mỗi loại hiện ra thế nào khi chưa có CSS.</p>'],
  [6, 'How a link becomes an address',
    '<p>This page lives at <code>/2-2/lien-ket.html</code>. The output is what the browser resolved for each <code>href</code>. A plain name is relative to the current folder, two dots go up one folder, a leading slash starts from the site root, and a hash stays on the page.</p>',
    '<p>Trang này nằm ở <code>/2-2/lien-ket.html</code>. Output là thứ trình duyệt phân giải được cho mỗi <code>href</code>. Tên trần tính từ thư mục hiện tại, hai dấu chấm đi lên một thư mục, gạch chéo đầu tính từ gốc trang, và dấu thăng thì ở lại trong trang.</p>'],
  [7, 'Links: details that matter',
    '<p>Good link text says where it goes, because screen readers can list links on their own. Open external links in a new tab only when there is a reason, and pair <code>target</code> with <code>rel</code>. Link to a heading with its <code>id</code>, and remember paths are case-sensitive on servers.</p>',
    '<p>Chữ liên kết tốt phải nói được nó dẫn tới đâu, vì trình đọc màn hình có thể liệt kê riêng các liên kết. Chỉ mở liên kết ngoài ở thẻ mới khi có lý do, và dùng <code>target</code> kèm <code>rel</code>. Liên kết tới một tiêu đề bằng <code>id</code> của nó, và nhớ rằng đường dẫn phân biệt hoa thường trên máy chủ.</p>'],
  [8, 'When an image fails',
    '<p>The real page with three broken images. With good <code>alt</code> text the visitor still gets the information. Without <code>alt</code> there is only a small broken icon. With an empty <code>alt</code> nothing appears at all, which is exactly right for a decorative image.</p>',
    '<p>Trang thật với ba ảnh hỏng. Có <code>alt</code> tốt thì người xem vẫn nhận được thông tin. Thiếu <code>alt</code> chỉ còn một biểu tượng vỡ nhỏ. Với <code>alt</code> rỗng thì không hiện gì cả, và điều đó hoàn toàn đúng cho ảnh trang trí.</p>'],
  [9, 'Give images a size',
    '<p>We slowed both images down by one second. While they downloaded, the text under image A sat at y=42; when the image arrived it jumped 186 pixels. Image B declared width and height, so the browser reserved the space and its text moved zero pixels. This is the layout shift users hate.</p>',
    '<p>Ta làm cả hai ảnh chậm đi một giây. Trong lúc tải, chữ dưới ảnh A nằm ở y=42; khi ảnh tới, nó nhảy 186 điểm ảnh. Ảnh B khai báo width và height, nên trình duyệt giữ sẵn chỗ và chữ của nó dịch chuyển 0 điểm ảnh. Đây là hiện tượng nhảy bố cục người dùng rất ghét.</p>'],
  [10, 'The right file for the screen',
    '<p>With <code>srcset</code> you offer several files and the browser picks. Same markup, three frame widths, three different files downloaded. Phones save data, large screens stay sharp. Add <code>loading="lazy"</code> for images far down the page, and pick the format by content.</p>',
    '<p>Với <code>srcset</code> bạn đưa ra nhiều tệp và trình duyệt tự chọn. Cùng mã, ba bề rộng khung, ba tệp khác nhau được tải. Điện thoại đỡ tốn dữ liệu, màn hình lớn vẫn nét. Thêm <code>loading="lazy"</code> cho ảnh ở sâu dưới trang, và chọn định dạng theo nội dung.</p>'],
  [11, 'Summary & practice',
    '<p>The practice is a recipe page with two folders, so that relative paths and images are real. The "Done when" is checked with the Network tab — no 404s — and by turning images off, so you see the page the way a screen reader or a slow connection does.</p>',
    '<p>Bài luyện là một trang công thức nấu ăn có hai thư mục, để đường dẫn tương đối và ảnh là thật. Phần "Xong khi" kiểm bằng thẻ Network — không có 404 — và bằng cách làm ảnh hỏng, để bạn thấy trang theo cách trình đọc màn hình hay mạng chậm nhìn thấy.</p>'],
]);

export default {
  title: '2.2 — Text, links, and images|||2.2 — Chữ, liên kết và ảnh',
  slug: 'wf-2-2-text-links-images',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/UB1O30fR-EE', durationSeconds: 0 },
  description: 'Tiêu đề là dàn ý, trình duyệt gộp khoảng trắng (đo thật), danh sách, liên kết tương đối được phân giải thế nào, chữ liên kết và target/rel, ảnh hỏng với alt, width/height chống nhảy bố cục (đo 186px vs 0px), srcset chọn đúng tệp, lazy loading, định dạng ảnh, bẫy phân biệt hoa thường.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The three things nearly every page is made of</h2>
<p class="lead">After this lesson you can structure text with the right headings and lists, predict exactly where any link will go, write useful <code>alt</code> text, stop images from making the page jump, and let the browser choose the right image file for each screen. You need this because text, links and images are most of the web, and each has one quiet rule that beginners break: choosing headings by size, moving a file and breaking every relative link, leaving out the image size so the page jumps while the visitor is reading.</p>

<h3>Step 1 — headings are an outline, not a font size</h3>
<p>HTML has six heading levels, <code>h1</code> to <code>h6</code>. They describe the structure of the page, like the headings in a book's table of contents. A screen-reader user can list the headings and jump between them. Search engines use them to understand the page. Here is a page whose author chose <code>h4</code> because it "looked the right size", and a script that prints the outline:</p>
${ma('html', CODE['2-2/dan-y.html'], [5, 9])}
${ra(OUT['2-2/dan-y'])}
<p>The rules are short: <strong>one <code>h1</code></strong> per page, naming the page; do not skip levels on the way down; never choose a level for its size. If <code>h2</code> looks too big, CSS can change it (Chapter 3). And do not fake a heading with bold text in a <code>div</code>: it looks like a heading and means nothing.</p>

<h3>Step 2 — the browser collapses whitespace</h3>
<p>Beginners are surprised that pressing Enter in a file does not create a new line on the page.</p>
${ma('html', CODE['2-2/khoang-trang.html'], [5, 10])}
${ra(OUT['2-2/khoang-trang'])}
<p>The <code>source</code> line is what was in the file; the <code>rendered</code> line is what you see. Any run of spaces, tabs and newlines becomes a single space. That is why you can indent HTML freely. To control line breaks:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;p&gt;</span><span class="v">A new paragraph: a new thought, with space around it.</span></div>
  <div class="kv"><span class="k">&lt;br&gt;</span><span class="v">A line break inside a paragraph: poems, addresses. Never use several to create vertical space; CSS does that.</span></div>
  <div class="kv"><span class="k">&lt;pre&gt;</span><span class="v">Preformatted text: every space and line break is kept. Used for code, with <code>code</code> inside.</span></div>
  <div class="kv"><span class="k">&lt;hr&gt;</span><span class="v">A thematic break between sections.</span></div>
</div>

<h3>Step 3 — lists</h3>
${ma('html', CODE['2-2/danh-sach.html'], [5, 27])}
<div class="kv-grid">
  <div class="kv"><span class="k">ul</span><span class="v">Unordered list: order does not matter. Navigation menus are also <code>ul</code>s, restyled with CSS.</span></div>
  <div class="kv"><span class="k">ol</span><span class="v">Ordered list: steps, rankings. <code>start</code> and <code>reversed</code> change the numbering.</span></div>
  <div class="kv"><span class="k">dl, dt, dd</span><span class="v">Description list: a term followed by its definition. Good for glossaries and metadata.</span></div>
</div>
<p>A nested list goes <strong>inside an <code>li</code></strong>: only <code>li</code> can be a direct child of <code>ul</code> or <code>ol</code>. That is why the output below says three direct items though there are nine <code>li</code> on the page:</p>
${ra(OUT['2-2/danh-sach'])}

<h3>Step 4 — how a link becomes an address</h3>
<p>The <code>a</code> element (<em>anchor</em>) creates a link; <code>href</code> says where it goes. The value can be written in several ways, and the browser turns each into a full address. This page lives at <code>/2-2/lien-ket.html</code>:</p>
${ma('html', CODE['2-2/lien-ket.html'], [5, 12])}
${ra(OUT['2-2/lien-ket'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">about.html</span><span class="lz-t">Relative</span><span class="lz-d">Starts from the folder of the current page.</span></div>
<div class="lz-step"><span class="lz-k">../x</span><span class="lz-t">Up one folder</span><span class="lz-d">Each <code>../</code> climbs one level.</span></div>
<div class="lz-step"><span class="lz-k">/contact</span><span class="lz-t">Root-relative</span><span class="lz-d">Starts from the root of the same website. Works from any page. Common on real sites.</span></div>
<div class="lz-step"><span class="lz-k">https://…</span><span class="lz-t">Absolute</span><span class="lz-d">The full address, for other websites.</span></div>
<div class="lz-step"><span class="lz-k">#pricing</span><span class="lz-t">Fragment</span><span class="lz-d">Scrolls to the element with <code>id="pricing"</code> on this page. No request is sent.</span></div>
</div>
<p>To check where a link really goes, hover over it (the address appears at the bottom-left of the window) or read <code>a.href</code> in the Console, as the demo does.</p>
<pre><code class="language-html">&lt;a href="/docs/guide.pdf" download&gt;Download the guide&lt;/a&gt;   &lt;!-- saves instead of opening --&gt;
&lt;a href="https://example.com" target="_blank" rel="noopener"&gt;Open in a new tab&lt;/a&gt;
&lt;h2 id="pricing"&gt;Pricing&lt;/h2&gt;  …  &lt;a href="#pricing"&gt;See pricing&lt;/a&gt;</code></pre>
<p><code>target="_blank"</code> opens a new tab. Use it only when leaving the page would lose something, such as a half-filled form. <code>rel="noopener"</code> stops the new page from getting a reference to yours; modern browsers imply it, but keep writing it for clarity.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — it works on your laptop and 404s on the server.</strong> Windows and macOS usually treat <code>Logo.PNG</code> and <code>logo.png</code> as the same file. Linux servers do not, so <code>src="images/Logo.png"</code> pointing at <code>images/logo.png</code> works at home and breaks in production. Use only lowercase letters, digits and hyphens in file and folder names; avoid spaces and accents. That is also why the file is <code>trang-chu.html</code> and not <code>Trang Chủ.html</code>.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "click here" as link text.</strong> Screen-reader users often list all the links on a page. A list of "click here, click here, read more" tells them nothing, and search engines lose a clue too. Make the link text describe the destination: not "To see the course, click here", but "See the <a href="#">Web Foundations course</a>".</p></div>

<h3>Step 5 — images, and what happens when they fail</h3>
<p><code>img</code> is a void element with two required attributes: <code>src</code> (which file) and <code>alt</code> (what to say instead). This page shows the same mistake with three kinds of <code>alt</code>:</p>
${ma('html', CODE['2-2/anh-loi.html'], [5, 8])}
${ra(OUT['2-2/anh-loi'])}
<p>The screenshot on slide 8 shows each one. Image 2 failed, but its description appears in its place (a box of 191×18). Image 3 has no <code>alt</code>: all you get is a 16×16 broken icon, and a screen reader may read out the file name. Image 4 has <code>alt=""</code>: the empty string means "decorative, skip it", so the box is 0×0.</p>
<table>
<thead><tr><th>The image is…</th><th>Write</th></tr></thead>
<tbody>
<tr><td>Content (a photo in an article)</td><td>What it shows and why it matters: <code>alt="Chocolate cake with three layers"</code></td></tr>
<tr><td>A link or button with no text</td><td>Where it goes or what it does: <code>alt="Go to the home page"</code></td></tr>
<tr><td>A chart or diagram</td><td>The conclusion, and the details nearby in text</td></tr>
<tr><td>Decoration</td><td>Empty: <code>alt=""</code>. Not missing!</td></tr>
</tbody>
</table>
<p>Do not begin with "image of": the screen reader already says "image". Lesson 2.5 returns to this.</p>

<h3>Step 6 — give images a size, or the page jumps</h3>
<p>Text arrives first and images later. If the browser does not know how tall an image will be, it reserves no space, and everything below jumps when the file arrives. We delayed two images by exactly one second and measured the text below each:</p>
${ma('html', CODE['2-2/cho-giu-cho.html'], [5, 14])}
${ra(OUT['_t2/out/anh-giu-cho'])}
<p>Image A has no size: its text moved 186 pixels while the visitor was reading. Image B declares <code>width</code> and <code>height</code>, and its text did not move at all. This jump is called <strong>layout shift</strong>; Google measures it as CLS, and you will measure it yourself in Lesson 14.4. The attributes give the browser the <em>ratio</em>, so CSS can still resize the image.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a 6 MB photo for a 300-pixel thumbnail.</strong> A phone camera produces images of several megabytes. Displayed small, it still downloads every byte, on every visit, over mobile data. Resize images to about twice their display size and compress them before uploading. Open the Network tab and look at the size column: it is usually the largest number on the page, and the easiest win.</p></div>

<h3>Step 7 — the right file for the screen</h3>
<p>A phone does not need a 1600-pixel image. With <code>srcset</code> you list the files and their real widths, and the browser chooses:</p>
<pre><code class="language-html">&lt;img src="m.jpg" alt="Banner" width="800" height="400" loading="lazy"
     srcset="s.jpg 400w, m.jpg 800w, l.jpg 1600w"
     sizes="100vw"&gt;</code></pre>
<p>We put this image into three frames of different widths and asked which file each one really used:</p>
${ra(OUT['2-2/srcset'])}
<p><code>400w</code> means "this file is 400 pixels wide"; <code>sizes</code> tells the browser how wide the image will be on the page (<code>100vw</code> = the full window width). On a phone with a high-density screen the browser may choose a larger file, because it needs more real pixels. <code>loading="lazy"</code> waits to download an image until it is close to the visible area; use it for images far down the page, not for the main image at the top.</p>
<table>
<thead><tr><th>Format</th><th>Use for</th></tr></thead>
<tbody>
<tr><td>JPEG</td><td>Photos, when compatibility matters most</td></tr>
<tr><td>PNG</td><td>Screenshots, images needing exact pixels or transparency</td></tr>
<tr><td>WebP / AVIF</td><td>Modern default for photos: much smaller than JPEG</td></tr>
<tr><td>SVG</td><td>Logos and icons: drawn from shapes, sharp at any size</td></tr>
<tr><td>GIF</td><td>Avoid it; a short video is far smaller</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — a recipe page with real folders</strong></p>
<p>Create this structure, in lowercase, and download two small photos from a free site:</p>
<pre><code>recipes/
├─ index.html          (list of recipes)
├─ banh-mi/
│  └─ index.html       (one recipe)
└─ images/
   └─ banh-mi.jpg</code></pre>
<ol>
<li><code>recipes/index.html</code>: one <code>h1</code>, and a link to the recipe.</li>
<li><code>banh-mi/index.html</code>: one <code>h1</code>; an <code>h2</code> "Ingredients" with a <code>ul</code>; an <code>h2</code> "Steps" with an <code>ol</code>; the photo with a real <code>alt</code>, <code>width</code> and <code>height</code>; a link back to the list.</li>
<li>Add a link to the "Steps" heading at the top of the recipe, using an <code>id</code>.</li>
</ol>
<p>Hint: from <code>banh-mi/index.html</code> the photo is <code>../images/banh-mi.jpg</code>, and the list is <code>../index.html</code>.</p>
<p><strong>Done when:</strong> the Network tab shows no 404 after a hard reload; every link works in both directions; the outline has one <code>h1</code> and no skipped levels; and when you rename the image for a moment, the <code>alt</code> text appears in its place. Then do Code Lab module 2.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">heading</span><span class="v">tiêu đề — h1…h6, dàn ý của trang.</span></div>
  <div class="kv"><span class="k">whitespace</span><span class="v">khoảng trắng — dấu cách, tab, xuống dòng.</span></div>
  <div class="kv"><span class="k">anchor</span><span class="v">phần tử <code>a</code> — liên kết.</span></div>
  <div class="kv"><span class="k">relative / absolute URL</span><span class="v">địa chỉ tương đối / tuyệt đối.</span></div>
  <div class="kv"><span class="k">root-relative</span><span class="v">tính từ gốc trang — bắt đầu bằng /.</span></div>
  <div class="kv"><span class="k">fragment</span><span class="v">phần băm — #id, nhảy tới một vị trí trong trang.</span></div>
  <div class="kv"><span class="k">alt text</span><span class="v">chữ thay thế — mô tả ảnh cho người không thấy nó.</span></div>
  <div class="kv"><span class="k">layout shift</span><span class="v">nhảy bố cục — nội dung dịch chuyển khi trang đang tải.</span></div>
  <div class="kv"><span class="k">srcset / sizes</span><span class="v">danh sách tệp ảnh / bề rộng hiển thị dự kiến.</span></div>
  <div class="kv"><span class="k">lazy loading</span><span class="v">tải lười — chỉ tải ảnh khi sắp nhìn thấy.</span></div>
  <div class="kv"><span class="k">case-sensitive</span><span class="v">phân biệt chữ hoa, chữ thường.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Headings are an outline: one <code>h1</code>, no skipped levels, never chosen by size.</li>
  <li>The browser collapses whitespace; use <code>p</code>, <code>br</code>, <code>pre</code> on purpose.</li>
  <li><code>ul</code> = no order, <code>ol</code> = order, nested lists go inside an <code>li</code>.</li>
  <li>Relative links start at the current folder, <code>../</code> goes up, <code>/</code> starts at the site root.</li>
  <li>Link text must describe the destination. File names: lowercase, no spaces.</li>
  <li>Every <code>img</code> needs <code>alt</code>; empty <code>alt=""</code> for decoration.</li>
  <li>Width and height stop layout shift (measured: 186 px against 0 px).</li>
  <li><code>srcset</code> lets the browser pick a file; compress images and lazy-load those far down the page.</li>
</ul>
${nguon('📗', 'MDN — Images in HTML', 'alt, width, height, figure and captions', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images')}
${nguon('📘', 'web.dev — Learn Images', 'A free course on formats, responsive images and performance', 'https://web.dev/learn/images')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-html-noi-dung', title: 'WED201c (Academy) — HTML content', sub: 'Text, links and images in the university syllabus', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Ba thứ tạo nên gần như mọi trang</h2>
<p class="lead">Học xong bài này bạn tổ chức được chữ với đúng cấp tiêu đề và danh sách, đoán chính xác mọi liên kết sẽ đi đâu, viết được chữ <code>alt</code> hữu ích, ngăn ảnh làm trang nhảy, và để trình duyệt tự chọn đúng tệp ảnh cho từng màn hình. Bạn cần điều này vì chữ, liên kết và ảnh chiếm phần lớn web, và mỗi thứ có một luật âm thầm người mới hay phá: chọn tiêu đề theo cỡ chữ, chuyển một tệp làm hỏng mọi liên kết tương đối, bỏ sót kích thước ảnh khiến trang nhảy ngay lúc người ta đang đọc.</p>

<h3>Bước 1 — tiêu đề là dàn ý, không phải cỡ chữ</h3>
<p>HTML có sáu cấp tiêu đề, từ <code>h1</code> tới <code>h6</code>. Chúng mô tả cấu trúc trang, như các tiêu đề trong mục lục một cuốn sách. Người dùng trình đọc màn hình có thể liệt kê tiêu đề và nhảy giữa chúng. Công cụ tìm kiếm dùng chúng để hiểu trang. Đây là một trang mà tác giả chọn <code>h4</code> vì "nhìn vừa cỡ", cùng một script in dàn ý:</p>
${ma('html', CODE['2-2/dan-y.html'], [5, 9])}
${ra(OUT['2-2/dan-y'])}
<p>Luật rất ngắn: <strong>một <code>h1</code></strong> mỗi trang, đặt tên cho trang; đi xuống không nhảy cấp; không bao giờ chọn cấp vì cỡ chữ. Nếu <code>h2</code> trông quá to, CSS sẽ đổi được (Chương 3). Và đừng giả tiêu đề bằng chữ đậm trong một <code>div</code>: trông giống tiêu đề mà chẳng có ý nghĩa gì.</p>

<h3>Bước 2 — trình duyệt gộp khoảng trắng</h3>
<p>Người mới ngạc nhiên khi nhấn Enter trong tệp mà trang không xuống dòng.</p>
${ma('html', CODE['2-2/khoang-trang.html'], [5, 10])}
${ra(OUT['2-2/khoang-trang'])}
<p>Dòng <code>source</code> là thứ có trong tệp; dòng <code>rendered</code> là thứ bạn thấy. Mọi chuỗi dấu cách, tab và xuống dòng đều gộp thành một dấu cách. Nhờ vậy bạn thụt lề HTML thoải mái. Để điều khiển xuống dòng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;p&gt;</span><span class="v">Đoạn văn mới: một ý mới, có khoảng cách xung quanh.</span></div>
  <div class="kv"><span class="k">&lt;br&gt;</span><span class="v">Ngắt dòng trong đoạn: thơ, địa chỉ. Đừng dùng nhiều cái để tạo khoảng trống dọc; đó là việc của CSS.</span></div>
  <div class="kv"><span class="k">&lt;pre&gt;</span><span class="v">Chữ định dạng sẵn: giữ mọi dấu cách và xuống dòng. Dùng cho mã, có <code>code</code> bên trong.</span></div>
  <div class="kv"><span class="k">&lt;hr&gt;</span><span class="v">Đường ngắt chủ đề giữa các phần.</span></div>
</div>

<h3>Bước 3 — danh sách</h3>
${ma('html', CODE['2-2/danh-sach.html'], [5, 27])}
<div class="kv-grid">
  <div class="kv"><span class="k">ul</span><span class="v">Danh sách không thứ tự: thứ tự không quan trọng. Menu điều hướng cũng là <code>ul</code>, tạo kiểu lại bằng CSS.</span></div>
  <div class="kv"><span class="k">ol</span><span class="v">Danh sách có thứ tự: các bước, xếp hạng. <code>start</code> và <code>reversed</code> đổi cách đánh số.</span></div>
  <div class="kv"><span class="k">dl, dt, dd</span><span class="v">Danh sách mô tả: thuật ngữ kèm định nghĩa. Hợp với bảng thuật ngữ và thông tin phụ.</span></div>
</div>
<p>Danh sách lồng nằm <strong>trong một <code>li</code></strong>: chỉ <code>li</code> mới được làm con trực tiếp của <code>ul</code> hay <code>ol</code>. Vì vậy output dưới đây nói có ba mục trực tiếp dù trang có chín <code>li</code>:</p>
${ra(OUT['2-2/danh-sach'])}

<h3>Bước 4 — liên kết biến thành địa chỉ thế nào</h3>
<p>Phần tử <code>a</code> (<em>anchor — mỏ neo</em>) tạo liên kết; <code>href</code> nói nó đi đâu. Giá trị viết được nhiều kiểu, và trình duyệt biến mỗi kiểu thành một địa chỉ đầy đủ. Trang này nằm ở <code>/2-2/lien-ket.html</code>:</p>
${ma('html', CODE['2-2/lien-ket.html'], [5, 12])}
${ra(OUT['2-2/lien-ket'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">about.html</span><span class="lz-t">Tương đối</span><span class="lz-d">Bắt đầu từ thư mục của trang hiện tại.</span></div>
<div class="lz-step"><span class="lz-k">../x</span><span class="lz-t">Lên một thư mục</span><span class="lz-d">Mỗi <code>../</code> leo lên một cấp.</span></div>
<div class="lz-step"><span class="lz-k">/contact</span><span class="lz-t">Từ gốc trang</span><span class="lz-d">Bắt đầu từ gốc của cùng website. Dùng được từ mọi trang. Phổ biến trên trang thật.</span></div>
<div class="lz-step"><span class="lz-k">https://…</span><span class="lz-t">Tuyệt đối</span><span class="lz-d">Địa chỉ đầy đủ, dùng cho website khác.</span></div>
<div class="lz-step"><span class="lz-k">#pricing</span><span class="lz-t">Phần băm</span><span class="lz-d">Cuộn tới phần tử có <code>id="pricing"</code> trên trang này. Không gửi request nào.</span></div>
</div>
<p>Để kiểm liên kết thật sự đi đâu, rê chuột lên nó (địa chỉ hiện ở góc dưới bên trái cửa sổ) hoặc đọc <code>a.href</code> trong Console, như bản demo đã làm.</p>
<pre><code class="language-html">&lt;a href="/docs/huong-dan.pdf" download&gt;Tải hướng dẫn&lt;/a&gt;   &lt;!-- lưu về thay vì mở --&gt;
&lt;a href="https://example.com" target="_blank" rel="noopener"&gt;Mở ở thẻ mới&lt;/a&gt;
&lt;h2 id="pricing"&gt;Bảng giá&lt;/h2&gt;  …  &lt;a href="#pricing"&gt;Xem bảng giá&lt;/a&gt;</code></pre>
<p><code>target="_blank"</code> mở thẻ mới. Chỉ dùng khi rời trang sẽ làm mất gì đó, như một form đang điền dở. <code>rel="noopener"</code> ngăn trang mới lấy được tham chiếu tới trang của bạn; trình duyệt hiện đại ngầm hiểu vậy, nhưng cứ viết cho rõ.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chạy trên laptop mà 404 trên máy chủ.</strong> Windows và macOS thường coi <code>Logo.PNG</code> và <code>logo.png</code> là một tệp. Máy chủ Linux thì không, nên <code>src="images/Logo.png"</code> trỏ tới <code>images/logo.png</code> chạy ở nhà và hỏng khi lên mạng. Chỉ dùng chữ thường, chữ số và dấu gạch ngang trong tên tệp và thư mục; tránh dấu cách và chữ có dấu. Đó cũng là lý do tệp tên là <code>trang-chu.html</code> chứ không phải <code>Trang Chủ.html</code>.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chữ liên kết "bấm vào đây".</strong> Người dùng trình đọc màn hình thường liệt kê mọi liên kết trên trang. Một danh sách "bấm vào đây, bấm vào đây, xem thêm" chẳng nói gì với họ, và công cụ tìm kiếm cũng mất đi một manh mối. Hãy để chữ liên kết mô tả đích đến: không phải "Muốn xem khoá học, bấm vào đây", mà là "Xem <a href="#">khoá Nền tảng Web</a>".</p></div>

<h3>Bước 5 — ảnh, và chuyện gì xảy ra khi ảnh hỏng</h3>
<p><code>img</code> là phần tử rỗng với hai thuộc tính bắt buộc: <code>src</code> (tệp nào) và <code>alt</code> (nói gì thay thế). Trang này cho thấy cùng một lỗi với ba kiểu <code>alt</code>:</p>
${ma('html', CODE['2-2/anh-loi.html'], [5, 8])}
${ra(OUT['2-2/anh-loi'])}
<p>Ảnh chụp ở slide 8 cho thấy từng trường hợp. Ảnh 2 hỏng, nhưng mô tả của nó hiện vào chỗ đó (hộp 191×18). Ảnh 3 không có <code>alt</code>: bạn chỉ còn một biểu tượng vỡ 16×16, và trình đọc màn hình có thể đọc ra tên tệp. Ảnh 4 có <code>alt=""</code>: chuỗi rỗng nghĩa là "trang trí, bỏ qua", nên hộp là 0×0.</p>
<table>
<thead><tr><th>Ảnh này là…</th><th>Viết</th></tr></thead>
<tbody>
<tr><td>Nội dung (ảnh trong bài viết)</td><td>Nó cho thấy gì và vì sao quan trọng: <code>alt="Bánh sô-cô-la ba tầng"</code></td></tr>
<tr><td>Liên kết hay nút không có chữ</td><td>Nó đi đâu hoặc làm gì: <code>alt="Về trang chủ"</code></td></tr>
<tr><td>Biểu đồ, sơ đồ</td><td>Kết luận, và chi tiết để ngay bên cạnh bằng chữ</td></tr>
<tr><td>Trang trí</td><td>Rỗng: <code>alt=""</code>. Không phải bỏ sót!</td></tr>
</tbody>
</table>
<p>Đừng mở đầu bằng "ảnh của": trình đọc màn hình đã nói "hình ảnh" rồi. Bài 2.5 quay lại chủ đề này.</p>

<h3>Bước 6 — cho ảnh kích thước, nếu không trang sẽ nhảy</h3>
<p>Chữ tới trước, ảnh tới sau. Nếu trình duyệt không biết ảnh cao bao nhiêu, nó không giữ chỗ, và mọi thứ bên dưới nhảy khi tệp tới. Ta làm hai ảnh chậm đúng một giây và đo phần chữ bên dưới mỗi ảnh:</p>
${ma('html', CODE['2-2/cho-giu-cho.html'], [5, 14])}
${ra(OUT['_t2/out/anh-giu-cho'])}
<p>Ảnh A không khai kích thước: chữ của nó dịch 186 điểm ảnh ngay lúc người xem đang đọc. Ảnh B khai <code>width</code> và <code>height</code>, và chữ của nó không hề xê dịch. Cú nhảy này gọi là <strong>layout shift (nhảy bố cục)</strong>; Google đo nó bằng chỉ số CLS, và bạn sẽ tự đo ở Bài 14.4. Hai thuộc tính cho trình duyệt biết <em>tỉ lệ</em>, nên CSS vẫn đổi cỡ ảnh được.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — ảnh 6 MB cho một hình thu nhỏ 300 điểm ảnh.</strong> Điện thoại chụp ra ảnh vài megabyte. Hiển thị bé, nó vẫn tải đủ từng byte, ở mọi lần ghé, trên dữ liệu di động. Hãy thu ảnh về khoảng gấp đôi cỡ hiển thị và nén trước khi tải lên. Mở thẻ Network và nhìn cột kích thước: đó thường là con số lớn nhất trang, và là chỗ cải thiện dễ nhất.</p></div>

<h3>Bước 7 — đúng tệp cho đúng màn hình</h3>
<p>Điện thoại không cần ảnh rộng 1600 điểm ảnh. Với <code>srcset</code> bạn liệt kê các tệp và bề rộng thật của chúng, trình duyệt sẽ chọn:</p>
<pre><code class="language-html">&lt;img src="m.jpg" alt="Banner" width="800" height="400" loading="lazy"
     srcset="s.jpg 400w, m.jpg 800w, l.jpg 1600w"
     sizes="100vw"&gt;</code></pre>
<p>Ta đặt ảnh này vào ba khung có bề rộng khác nhau và hỏi mỗi khung đã thật sự dùng tệp nào:</p>
${ra(OUT['2-2/srcset'])}
<p><code>400w</code> nghĩa là "tệp này rộng 400 điểm ảnh"; <code>sizes</code> cho trình duyệt biết ảnh sẽ rộng bao nhiêu trên trang (<code>100vw</code> = cả bề rộng cửa sổ). Trên điện thoại màn hình mật độ cao, trình duyệt có thể chọn tệp lớn hơn, vì nó cần nhiều điểm ảnh thật hơn. <code>loading="lazy"</code> hoãn tải ảnh tới khi nó gần vùng nhìn thấy; dùng cho ảnh ở sâu dưới trang, đừng dùng cho ảnh chính ở đầu trang.</p>
<table>
<thead><tr><th>Định dạng</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td>JPEG</td><td>Ảnh chụp, khi cần tương thích nhất</td></tr>
<tr><td>PNG</td><td>Ảnh màn hình, ảnh cần đúng từng điểm hoặc trong suốt</td></tr>
<tr><td>WebP / AVIF</td><td>Mặc định hiện đại cho ảnh chụp: nhỏ hơn JPEG nhiều</td></tr>
<tr><td>SVG</td><td>Logo và biểu tượng: vẽ từ hình khối, nét ở mọi cỡ</td></tr>
<tr><td>GIF</td><td>Nên tránh; một video ngắn nhỏ hơn nhiều</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — trang công thức với thư mục thật</strong></p>
<p>Tạo cấu trúc này, toàn chữ thường, và tải hai ảnh nhỏ từ một trang ảnh miễn phí:</p>
<pre><code>recipes/
├─ index.html          (danh sách công thức)
├─ banh-mi/
│  └─ index.html       (một công thức)
└─ images/
   └─ banh-mi.jpg</code></pre>
<ol>
<li><code>recipes/index.html</code>: một <code>h1</code>, và một liên kết tới công thức.</li>
<li><code>banh-mi/index.html</code>: một <code>h1</code>; một <code>h2</code> "Nguyên liệu" kèm <code>ul</code>; một <code>h2</code> "Các bước" kèm <code>ol</code>; ảnh với <code>alt</code> thật, <code>width</code> và <code>height</code>; một liên kết quay về danh sách.</li>
<li>Thêm một liên kết tới tiêu đề "Các bước" ở đầu công thức, dùng <code>id</code>.</li>
</ol>
<p>Gợi ý: từ <code>banh-mi/index.html</code> ảnh là <code>../images/banh-mi.jpg</code>, và danh sách là <code>../index.html</code>.</p>
<p><strong>Xong khi:</strong> thẻ Network không có 404 sau khi tải lại cứng; mọi liên kết chạy được cả hai chiều; dàn ý có một <code>h1</code> và không nhảy cấp; và khi tạm đổi tên ảnh, chữ <code>alt</code> hiện vào chỗ đó. Sau đó làm module Code Lab 2.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">heading</span><span class="v">tiêu đề — h1…h6, dàn ý của trang.</span></div>
  <div class="kv"><span class="k">whitespace</span><span class="v">khoảng trắng — dấu cách, tab, xuống dòng.</span></div>
  <div class="kv"><span class="k">anchor</span><span class="v">phần tử <code>a</code> — liên kết.</span></div>
  <div class="kv"><span class="k">relative / absolute URL</span><span class="v">địa chỉ tương đối / tuyệt đối.</span></div>
  <div class="kv"><span class="k">root-relative</span><span class="v">tính từ gốc trang — bắt đầu bằng /.</span></div>
  <div class="kv"><span class="k">fragment</span><span class="v">phần băm — #id, nhảy tới một vị trí trong trang.</span></div>
  <div class="kv"><span class="k">alt text</span><span class="v">chữ thay thế — mô tả ảnh cho người không thấy nó.</span></div>
  <div class="kv"><span class="k">layout shift</span><span class="v">nhảy bố cục — nội dung dịch chuyển khi trang đang tải.</span></div>
  <div class="kv"><span class="k">srcset / sizes</span><span class="v">danh sách tệp ảnh / bề rộng hiển thị dự kiến.</span></div>
  <div class="kv"><span class="k">lazy loading</span><span class="v">tải lười — chỉ tải ảnh khi sắp nhìn thấy.</span></div>
  <div class="kv"><span class="k">case-sensitive</span><span class="v">phân biệt chữ hoa, chữ thường.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Tiêu đề là dàn ý: một <code>h1</code>, không nhảy cấp, không chọn theo cỡ chữ.</li>
  <li>Trình duyệt gộp khoảng trắng; dùng <code>p</code>, <code>br</code>, <code>pre</code> có chủ đích.</li>
  <li><code>ul</code> = không thứ tự, <code>ol</code> = có thứ tự, danh sách lồng nằm trong một <code>li</code>.</li>
  <li>Liên kết tương đối bắt đầu từ thư mục hiện tại, <code>../</code> đi lên, <code>/</code> bắt đầu từ gốc trang.</li>
  <li>Chữ liên kết phải mô tả đích đến. Tên tệp: chữ thường, không dấu cách.</li>
  <li>Mọi <code>img</code> cần <code>alt</code>; <code>alt=""</code> rỗng cho ảnh trang trí.</li>
  <li>Width và height chống nhảy bố cục (đo được: 186 px so với 0 px).</li>
  <li><code>srcset</code> để trình duyệt chọn tệp; nén ảnh và tải lười ảnh ở sâu dưới trang.</li>
</ul>
${nguon('📗', 'MDN — Images in HTML', 'alt, width, height, figure và chú thích', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images')}
${nguon('📘', 'web.dev — Learn Images', 'Khoá miễn phí về định dạng, ảnh responsive và hiệu năng', 'https://web.dev/learn/images')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-html-noi-dung', title: 'WED201c (Academy) — Nội dung HTML', sub: 'Chữ, liên kết và ảnh trong đề cương môn học ở trường', cta: 'Mở bài' })}
</div>
`,
};
