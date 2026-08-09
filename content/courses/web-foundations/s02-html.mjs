/**
 * Web Foundations — Chương 2: HTML (cấu trúc của mọi trang web).
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 2 — HTML: the structure of every web page|||Chương 2 — HTML: cấu trúc của mọi trang web',
  description: 'HTML là bộ khung của mọi trang web: các thẻ đặt tên cho từng mẩu nội dung — tiêu đề, đoạn văn, ảnh, liên kết, biểu mẫu. Học viết HTML có cấu trúc, đúng ngữ nghĩa và tiếp cận được, làm nền cho CSS (Chương 3) tô điểm và JavaScript (Chương 4) làm sống động.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — What HTML is: elements, tags, attributes|||2.1 — HTML là gì: phần tử, thẻ, thuộc tính',
      slug: 'wf-2-1-html-basics',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/ok-plXXHlWw', durationSeconds: 0 },
      description: 'Phần tử, thẻ mở/đóng, thuộc tính, và bộ khung một tài liệu HTML hợp lệ — vốn từ vựng làm nền cho tất cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>HTML labels meaning; it does not decorate</h2>
<p class="lead">HTML (HyperText Markup Language) is how you tell the browser <em>what each piece of content is</em>: "this is a heading", "this is a paragraph", "this is an image". It is the skeleton. CSS (Chapter 3) paints it; JavaScript (Chapter 4) makes it move. Getting the skeleton right is what makes everything after it work.</p>

<h3>Anatomy of an element</h3>
<p>Most content is wrapped in an <strong>element</strong>: an opening tag, some content, and a closing tag. The closing tag has a slash.</p>
<pre><code>&lt;p&gt;Hello, world&lt;/p&gt;
 │   │           │
 │   │           └── closing tag (note the / )
 │   └────────────── the content
 └────────────────── opening tag</code></pre>
<p>Some elements have no content and no closing tag — they are <strong>void elements</strong>, like an image or a line break:</p>
<pre><code>&lt;img src="cat.jpg" alt="A cat"&gt;
&lt;br&gt;</code></pre>

<h3>Attributes — extra info on the opening tag</h3>
<p>An <strong>attribute</strong> configures an element. It lives in the opening tag as <code>name="value"</code>. Above, <code>src</code> and <code>alt</code> are attributes of <code>&lt;img&gt;</code>. A link uses <code>href</code>:</p>
<pre><code>&lt;a href="https://cuongthai.com"&gt;Visit CuongThai&lt;/a&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Element</span><span class="v">A whole unit: opening tag + content + closing tag.</span></div>
  <div class="kv"><span class="k">Tag</span><span class="v">The bit in angle brackets, e.g. &lt;p&gt; or &lt;/p&gt;.</span></div>
  <div class="kv"><span class="k">Attribute</span><span class="v">name="value" inside the opening tag — extra configuration.</span></div>
  <div class="kv"><span class="k">Nesting</span><span class="v">Elements inside elements. Close them in reverse order (last opened, first closed).</span></div>
</div>

<h3>The skeleton every page starts from</h3>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;title&gt;My first page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello, world&lt;/h1&gt;
    &lt;p&gt;This is my first web page.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;!DOCTYPE html&gt;</span><span class="v">Says "this is modern HTML". Always the first line.</span></div>
  <div class="kv"><span class="k">&lt;head&gt;</span><span class="v">Info the visitor does not see directly: title, character set, links to CSS.</span></div>
  <div class="kv"><span class="k">&lt;body&gt;</span><span class="v">Everything visible on the page lives here.</span></div>
  <div class="kv"><span class="k">charset / viewport</span><span class="v">UTF-8 lets you write Tiếng Việt correctly; the viewport tag makes the page fit phones.</span></div>
</div>
<p class="note-ct"><strong>Try it now:</strong> save the block above as <code>index.html</code>, then in VS Code right-click → "Open with Live Server" (from Lesson 1.2). You just built a web page. Change the text, save, and watch it reload.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>HTML đặt tên cho ý nghĩa; nó không trang trí</h2>
<p class="lead">HTML (HyperText Markup Language — ngôn ngữ đánh dấu siêu văn bản) là cách bạn nói cho trình duyệt biết <em>mỗi mẩu nội dung là gì</em>: "đây là tiêu đề", "đây là đoạn văn", "đây là ảnh". Nó là bộ xương. CSS (Chương 3) sơn màu; JavaScript (Chương 4) làm cho nó cử động. Làm đúng bộ xương chính là thứ khiến mọi thứ sau đó chạy được.</p>

<h3>Giải phẫu một phần tử</h3>
<p>Hầu hết nội dung được bọc trong một <strong>phần tử (element)</strong>: một thẻ mở, phần nội dung, và một thẻ đóng. Thẻ đóng có dấu gạch chéo.</p>
<pre><code>&lt;p&gt;Xin chào&lt;/p&gt;
 │   │        │
 │   │        └── thẻ đóng (để ý dấu / )
 │   └─────────── phần nội dung
 └─────────────── thẻ mở</code></pre>
<p>Một số phần tử không có nội dung và không có thẻ đóng — chúng là <strong>phần tử rỗng (void)</strong>, như ảnh hoặc ngắt dòng:</p>
<pre><code>&lt;img src="meo.jpg" alt="Một con mèo"&gt;
&lt;br&gt;</code></pre>

<h3>Thuộc tính — thông tin thêm trên thẻ mở</h3>
<p>Một <strong>thuộc tính (attribute)</strong> cấu hình một phần tử. Nó nằm trong thẻ mở dạng <code>tên="giá trị"</code>. Ở trên, <code>src</code> và <code>alt</code> là thuộc tính của <code>&lt;img&gt;</code>. Một liên kết dùng <code>href</code>:</p>
<pre><code>&lt;a href="https://cuongthai.com"&gt;Ghé thăm CuongThai&lt;/a&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Phần tử</span><span class="v">Một đơn vị trọn vẹn: thẻ mở + nội dung + thẻ đóng.</span></div>
  <div class="kv"><span class="k">Thẻ (tag)</span><span class="v">Phần trong dấu ngoặc nhọn, vd &lt;p&gt; hoặc &lt;/p&gt;.</span></div>
  <div class="kv"><span class="k">Thuộc tính</span><span class="v">tên="giá trị" bên trong thẻ mở — cấu hình thêm.</span></div>
  <div class="kv"><span class="k">Lồng nhau</span><span class="v">Phần tử nằm trong phần tử. Đóng theo thứ tự ngược (mở sau, đóng trước).</span></div>
</div>

<h3>Bộ khung mà mọi trang bắt đầu từ đó</h3>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;title&gt;Trang đầu tiên của tôi&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Xin chào&lt;/h1&gt;
    &lt;p&gt;Đây là trang web đầu tiên của tôi.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;!DOCTYPE html&gt;</span><span class="v">Nói "đây là HTML hiện đại". Luôn là dòng đầu tiên.</span></div>
  <div class="kv"><span class="k">&lt;head&gt;</span><span class="v">Thông tin người xem không thấy trực tiếp: tiêu đề, bộ ký tự, link tới CSS.</span></div>
  <div class="kv"><span class="k">&lt;body&gt;</span><span class="v">Mọi thứ hiển thị trên trang nằm ở đây.</span></div>
  <div class="kv"><span class="k">charset / viewport</span><span class="v">UTF-8 cho bạn gõ Tiếng Việt đúng; thẻ viewport giúp trang vừa với điện thoại.</span></div>
</div>
<p class="note-ct"><strong>Thử ngay:</strong> lưu khối trên thành <code>index.html</code>, rồi trong VS Code chuột phải → "Open with Live Server" (từ Bài 1.2). Bạn vừa dựng một trang web. Đổi chữ, lưu, và xem nó tự tải lại.</p>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Text, links and images: the content you write most|||2.2 — Chữ, liên kết và ảnh: nội dung bạn viết nhiều nhất',
      slug: 'wf-2-2-text-links-images',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/UB1O30fR-EE', durationSeconds: 0 },
      description: 'Tiêu đề h1–h6, đoạn văn, danh sách, liên kết trong/ngoài, và ảnh cùng thuộc tính alt — những thẻ bạn dùng hằng ngày.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Most of a page is headings, paragraphs, lists, links and images</h2>
<p class="lead">Master these five and you can write the bulk of any page. Each one <em>means</em> something — do not pick a tag by how it looks, pick it by what the content is. Looks are CSS's job.</p>

<h3>Headings and paragraphs</h3>
<p>There are six heading levels, <code>&lt;h1&gt;</code> (most important) down to <code>&lt;h6&gt;</code>. Use exactly <strong>one</strong> <code>&lt;h1&gt;</code> per page (the page's title), then nest lower levels like an outline. Body text goes in <code>&lt;p&gt;</code>.</p>
<pre><code>&lt;h1&gt;Bánh mì recipes&lt;/h1&gt;
&lt;h2&gt;Ingredients&lt;/h2&gt;
&lt;p&gt;You will need a baguette, pâté, and pickled carrots.&lt;/p&gt;
&lt;h2&gt;Steps&lt;/h2&gt;</code></pre>
<p class="pitfall"><strong>Do not skip levels for size.</strong> Jumping from &lt;h1&gt; straight to &lt;h4&gt; because "h4 looks smaller" breaks the outline for screen readers and SEO. Choose the level by rank; change the size with CSS.</p>

<h3>Lists — ordered and unordered</h3>
<pre><code>&lt;ul&gt;                    &lt;!-- bullets, order does not matter --&gt;
  &lt;li&gt;HTML&lt;/li&gt;
  &lt;li&gt;CSS&lt;/li&gt;
&lt;/ul&gt;

&lt;ol&gt;                    &lt;!-- numbers, order matters --&gt;
  &lt;li&gt;Wake up&lt;/li&gt;
  &lt;li&gt;Write code&lt;/li&gt;
&lt;/ol&gt;</code></pre>

<h3>Links — the "hypertext" in HTML</h3>
<p>The anchor element <code>&lt;a&gt;</code> with <code>href</code> makes clickable links. The web is a web because of these.</p>
<pre><code>&lt;a href="about.html"&gt;About us&lt;/a&gt;                &lt;!-- relative: another page in your site --&gt;
&lt;a href="https://mdn.io"&gt;MDN docs&lt;/a&gt;            &lt;!-- absolute: another site --&gt;
&lt;a href="#contact"&gt;Jump to contact&lt;/a&gt;           &lt;!-- to an id on the same page --&gt;
&lt;a href="https://mdn.io" target="_blank" rel="noopener"&gt;Open in new tab&lt;/a&gt;</code></pre>
<p>Notice relative vs absolute paths — exactly the idea from Lesson 1.1, now for links.</p>

<h3>Images — and why alt text is not optional</h3>
<pre><code>&lt;img src="images/pho.jpg" alt="A steaming bowl of phở with herbs"&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">src</span><span class="v">Where the image file is (relative path or full URL).</span></div>
  <div class="kv"><span class="k">alt</span><span class="v">Text description. Read aloud by screen readers, and shown if the image fails to load.</span></div>
  <div class="kv"><span class="k">width / height</span><span class="v">Reserve space so the page does not jump while the image loads.</span></div>
</div>
<p class="note-ct"><strong>alt text is an accessibility duty, not a nicety.</strong> A blind visitor "sees" your image only through its alt. Describe what matters; if the image is purely decorative, use an empty <code>alt=""</code> so it is skipped.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Phần lớn một trang là tiêu đề, đoạn văn, danh sách, liên kết và ảnh</h2>
<p class="lead">Thạo năm thứ này là bạn viết được phần lớn mọi trang. Mỗi thứ đều <em>mang một ý nghĩa</em> — đừng chọn thẻ theo vẻ ngoài, hãy chọn theo nội dung đó là gì. Vẻ ngoài là việc của CSS.</p>

<h3>Tiêu đề và đoạn văn</h3>
<p>Có sáu cấp tiêu đề, <code>&lt;h1&gt;</code> (quan trọng nhất) xuống tới <code>&lt;h6&gt;</code>. Mỗi trang dùng đúng <strong>một</strong> <code>&lt;h1&gt;</code> (tiêu đề của trang), rồi lồng các cấp thấp hơn như một dàn ý. Chữ thân bài đặt trong <code>&lt;p&gt;</code>.</p>
<pre><code>&lt;h1&gt;Công thức Bánh mì&lt;/h1&gt;
&lt;h2&gt;Nguyên liệu&lt;/h2&gt;
&lt;p&gt;Bạn cần một ổ bánh mì, pa-tê, và đồ chua.&lt;/p&gt;
&lt;h2&gt;Các bước&lt;/h2&gt;</code></pre>
<p class="pitfall"><strong>Đừng nhảy cấp chỉ vì cỡ chữ.</strong> Nhảy từ &lt;h1&gt; thẳng sang &lt;h4&gt; vì "h4 nhìn nhỏ hơn" làm hỏng dàn ý cho trình đọc màn hình và cho SEO. Chọn cấp theo thứ bậc; đổi cỡ chữ bằng CSS.</p>

<h3>Danh sách — có thứ tự và không thứ tự</h3>
<pre><code>&lt;ul&gt;                    &lt;!-- dấu chấm, thứ tự không quan trọng --&gt;
  &lt;li&gt;HTML&lt;/li&gt;
  &lt;li&gt;CSS&lt;/li&gt;
&lt;/ul&gt;

&lt;ol&gt;                    &lt;!-- đánh số, thứ tự quan trọng --&gt;
  &lt;li&gt;Thức dậy&lt;/li&gt;
  &lt;li&gt;Viết code&lt;/li&gt;
&lt;/ol&gt;</code></pre>

<h3>Liên kết — chữ "hypertext" trong HTML</h3>
<p>Phần tử neo <code>&lt;a&gt;</code> với <code>href</code> tạo ra liên kết bấm được. Web là một mạng lưới chính nhờ những cái này.</p>
<pre><code>&lt;a href="about.html"&gt;Về chúng tôi&lt;/a&gt;            &lt;!-- tương đối: một trang khác trong site của bạn --&gt;
&lt;a href="https://mdn.io"&gt;Tài liệu MDN&lt;/a&gt;        &lt;!-- tuyệt đối: một website khác --&gt;
&lt;a href="#contact"&gt;Nhảy tới phần liên hệ&lt;/a&gt;      &lt;!-- tới một id trên cùng trang --&gt;
&lt;a href="https://mdn.io" target="_blank" rel="noopener"&gt;Mở trong tab mới&lt;/a&gt;</code></pre>
<p>Để ý đường dẫn tương đối vs tuyệt đối — đúng ý tưởng ở Bài 1.1, giờ áp cho liên kết.</p>

<h3>Ảnh — và vì sao alt không phải tuỳ chọn</h3>
<pre><code>&lt;img src="images/pho.jpg" alt="Tô phở nóng nghi ngút kèm rau thơm"&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">src</span><span class="v">File ảnh nằm ở đâu (đường dẫn tương đối hoặc URL đầy đủ).</span></div>
  <div class="kv"><span class="k">alt</span><span class="v">Mô tả bằng chữ. Trình đọc màn hình đọc to, và hiện ra nếu ảnh tải hỏng.</span></div>
  <div class="kv"><span class="k">width / height</span><span class="v">Giữ chỗ trước để trang không bị nhảy khi ảnh đang tải.</span></div>
</div>
<p class="note-ct"><strong>alt là một trách nhiệm về khả năng tiếp cận, không phải điểm cộng.</strong> Một khách khiếm thị "thấy" ảnh của bạn chỉ qua alt. Hãy mô tả điều quan trọng; nếu ảnh chỉ để trang trí, dùng <code>alt=""</code> rỗng để nó được bỏ qua.</p>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Semantic structure: give the page real meaning|||2.3 — Cấu trúc ngữ nghĩa: cho trang một ý nghĩa thật',
      slug: 'wf-2-3-semantic-html',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/bOUhq46fd5g', durationSeconds: 0 },
      description: 'header, nav, main, section, article, aside, footer — và vì sao chúng tốt hơn một biển &lt;div&gt; cho SEO, khả năng tiếp cận và người đọc code sau này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>A &lt;div&gt; means nothing; a &lt;nav&gt; means "navigation"</h2>
<p class="lead">You <em>could</em> build an entire page out of <code>&lt;div&gt;</code>s. But a <code>&lt;div&gt;</code> is a generic box with no meaning. <strong>Semantic</strong> elements name the role of each region — and search engines, screen readers, and your future teammates all rely on those names.</p>

<h3>The landmark elements</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;header&gt;</span><span class="v">Top of the page or a section: logo, title, intro.</span></div>
  <div class="kv"><span class="k">&lt;nav&gt;</span><span class="v">A block of navigation links (the main menu).</span></div>
  <div class="kv"><span class="k">&lt;main&gt;</span><span class="v">The primary content, unique to this page. Only one per page.</span></div>
  <div class="kv"><span class="k">&lt;section&gt;</span><span class="v">A thematic grouping, usually with its own heading.</span></div>
  <div class="kv"><span class="k">&lt;article&gt;</span><span class="v">A self-contained piece that would make sense on its own (a blog post, a card).</span></div>
  <div class="kv"><span class="k">&lt;aside&gt;</span><span class="v">Tangential content: a sidebar, related links.</span></div>
  <div class="kv"><span class="k">&lt;footer&gt;</span><span class="v">Bottom of the page or section: copyright, contact, small print.</span></div>
</div>

<h3>A realistic page skeleton</h3>
<pre><code>&lt;body&gt;
  &lt;header&gt;
    &lt;h1&gt;My Blog&lt;/h1&gt;
    &lt;nav&gt;
      &lt;a href="/"&gt;Home&lt;/a&gt;
      &lt;a href="/about"&gt;About&lt;/a&gt;
    &lt;/nav&gt;
  &lt;/header&gt;

  &lt;main&gt;
    &lt;article&gt;
      &lt;h2&gt;My first post&lt;/h2&gt;
      &lt;p&gt;Today I learned HTML.&lt;/p&gt;
    &lt;/article&gt;
  &lt;/main&gt;

  &lt;footer&gt;
    &lt;p&gt;© 2026 My Blog&lt;/p&gt;
  &lt;/footer&gt;
&lt;/body&gt;</code></pre>
<p>Compare that to the same page written as <code>&lt;div class="header"&gt;</code>, <code>&lt;div class="nav"&gt;</code>… — identical on screen, but the semantic version tells machines and humans what each part <em>is</em>.</p>

<h3>Inline meaning too</h3>
<p>Semantics apply to small bits of text as well: <code>&lt;strong&gt;</code> (important), <code>&lt;em&gt;</code> (emphasis), <code>&lt;time&gt;</code>, <code>&lt;code&gt;</code>. Prefer <code>&lt;strong&gt;</code>/<code>&lt;em&gt;</code> over the purely visual <code>&lt;b&gt;</code>/<code>&lt;i&gt;</code>.</p>

<h3>When is a &lt;div&gt; still fine?</h3>
<p>When you need a box <em>only</em> for styling/layout and there is no semantic element that fits — a wrapper you will position with CSS. <code>&lt;div&gt;</code> and its inline cousin <code>&lt;span&gt;</code> are the meaningless boxes you reach for last, not first.</p>
<p class="note-ct"><strong>Rule of thumb:</strong> reach for a semantic element first; drop to <code>&lt;div&gt;</code>/<code>&lt;span&gt;</code> only when nothing else describes the content. This one habit measurably improves accessibility and SEO for free.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element" target="_blank" rel="noopener">MDN — the full HTML element reference</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Một &lt;div&gt; chẳng nghĩa gì; một &lt;nav&gt; nghĩa là "điều hướng"</h2>
<p class="lead">Bạn <em>có thể</em> dựng cả trang chỉ bằng <code>&lt;div&gt;</code>. Nhưng <code>&lt;div&gt;</code> là một cái hộp chung chung không mang ý nghĩa. Các phần tử <strong>ngữ nghĩa (semantic)</strong> đặt tên vai trò cho từng vùng — và công cụ tìm kiếm, trình đọc màn hình, cùng đồng đội tương lai của bạn đều dựa vào những cái tên đó.</p>

<h3>Các phần tử "địa danh" (landmark)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;header&gt;</span><span class="v">Đầu trang hoặc đầu một mục: logo, tiêu đề, phần mở đầu.</span></div>
  <div class="kv"><span class="k">&lt;nav&gt;</span><span class="v">Một khối các liên kết điều hướng (thực đơn chính).</span></div>
  <div class="kv"><span class="k">&lt;main&gt;</span><span class="v">Nội dung chính, riêng của trang này. Mỗi trang chỉ một.</span></div>
  <div class="kv"><span class="k">&lt;section&gt;</span><span class="v">Một nhóm theo chủ đề, thường có tiêu đề riêng.</span></div>
  <div class="kv"><span class="k">&lt;article&gt;</span><span class="v">Một mẩu độc lập, đứng một mình vẫn có nghĩa (một bài blog, một thẻ).</span></div>
  <div class="kv"><span class="k">&lt;aside&gt;</span><span class="v">Nội dung bên lề: thanh bên, các liên kết liên quan.</span></div>
  <div class="kv"><span class="k">&lt;footer&gt;</span><span class="v">Cuối trang hoặc cuối mục: bản quyền, liên hệ, ghi chú nhỏ.</span></div>
</div>

<h3>Một bộ khung trang thực tế</h3>
<pre><code>&lt;body&gt;
  &lt;header&gt;
    &lt;h1&gt;Blog của tôi&lt;/h1&gt;
    &lt;nav&gt;
      &lt;a href="/"&gt;Trang chủ&lt;/a&gt;
      &lt;a href="/about"&gt;Giới thiệu&lt;/a&gt;
    &lt;/nav&gt;
  &lt;/header&gt;

  &lt;main&gt;
    &lt;article&gt;
      &lt;h2&gt;Bài viết đầu tiên&lt;/h2&gt;
      &lt;p&gt;Hôm nay tôi học HTML.&lt;/p&gt;
    &lt;/article&gt;
  &lt;/main&gt;

  &lt;footer&gt;
    &lt;p&gt;© 2026 Blog của tôi&lt;/p&gt;
  &lt;/footer&gt;
&lt;/body&gt;</code></pre>
<p>Hãy so với cùng trang đó viết bằng <code>&lt;div class="header"&gt;</code>, <code>&lt;div class="nav"&gt;</code>… — trên màn hình y hệt, nhưng bản ngữ nghĩa nói cho máy móc và con người biết mỗi phần <em>là gì</em>.</p>

<h3>Ngữ nghĩa cả ở cấp chữ</h3>
<p>Ngữ nghĩa áp cho cả những mẩu chữ nhỏ: <code>&lt;strong&gt;</code> (quan trọng), <code>&lt;em&gt;</code> (nhấn mạnh), <code>&lt;time&gt;</code>, <code>&lt;code&gt;</code>. Ưu tiên <code>&lt;strong&gt;</code>/<code>&lt;em&gt;</code> hơn <code>&lt;b&gt;</code>/<code>&lt;i&gt;</code> vốn chỉ mang tính hình thức.</p>

<h3>Khi nào &lt;div&gt; vẫn ổn?</h3>
<p>Khi bạn cần một cái hộp <em>chỉ</em> để tạo kiểu/bố cục và không có phần tử ngữ nghĩa nào hợp — một lớp bọc bạn sẽ định vị bằng CSS. <code>&lt;div&gt;</code> và người anh em cùng dòng <code>&lt;span&gt;</code> là những cái hộp vô nghĩa bạn dùng sau cùng, không phải đầu tiên.</p>
<p class="note-ct"><strong>Quy tắc bỏ túi:</strong> tìm một phần tử ngữ nghĩa trước; chỉ hạ xuống <code>&lt;div&gt;</code>/<code>&lt;span&gt;</code> khi không gì khác mô tả được nội dung. Chỉ một thói quen này đã cải thiện đo được về khả năng tiếp cận và SEO — miễn phí.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element" target="_blank" rel="noopener">MDN — tra cứu đầy đủ các phần tử HTML</a></div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Forms: how the web collects data|||2.4 — Biểu mẫu: cách web thu thập dữ liệu',
      slug: 'wf-2-4-forms',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/fNcJuPIZ2WE', durationSeconds: 0 },
      description: 'form, input và các type, label, textarea, select, button, cùng validation cơ bản — cửa ngõ đưa dữ liệu người dùng vào một backend Node.js.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Every login, search box and checkout is a form</h2>
<p class="lead">Forms are how a user <em>gives</em> data to a site. This is the exact bridge to the Node.js course: a form collects data in the browser and sends it to a backend route that saves it. Get comfortable here and server-side handling later will click.</p>

<h3>The container and its controls</h3>
<pre><code>&lt;form action="/signup" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input id="email" name="email" type="email" required&gt;

  &lt;label for="pw"&gt;Password&lt;/label&gt;
  &lt;input id="pw" name="password" type="password" minlength="8" required&gt;

  &lt;button type="submit"&gt;Create account&lt;/button&gt;
&lt;/form&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">action</span><span class="v">The URL the data is sent to when submitted.</span></div>
  <div class="kv"><span class="k">method</span><span class="v">How to send it — usually post for data that changes something (Chapter 6 explains GET vs POST).</span></div>
  <div class="kv"><span class="k">name</span><span class="v">The key each value arrives under on the server. No name = not sent.</span></div>
</div>

<h3>label + input — always pair them</h3>
<p>The <code>for</code> of a <code>&lt;label&gt;</code> must match the <code>id</code> of its input. Then clicking the label focuses the field, and screen readers announce it. This tiny link is one of the highest-value accessibility habits there is.</p>

<h3>The input types you will use most</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">text / email / password</span><span class="v">Single-line text; email/password give the right keyboard and masking.</span></div>
  <div class="kv"><span class="k">number / date / tel / url</span><span class="v">Specialised inputs with built-in formatting and validation.</span></div>
  <div class="kv"><span class="k">checkbox / radio</span><span class="v">Multiple choices (checkbox) vs pick exactly one (radio, share a name).</span></div>
  <div class="kv"><span class="k">file / range / color</span><span class="v">Upload a file, drag a slider, pick a colour.</span></div>
</div>

<h3>Multi-line, dropdowns and buttons</h3>
<pre><code>&lt;textarea name="bio" rows="4"&gt;&lt;/textarea&gt;

&lt;select name="country"&gt;
  &lt;option value="vn"&gt;Vietnam&lt;/option&gt;
  &lt;option value="jp"&gt;Japan&lt;/option&gt;
&lt;/select&gt;

&lt;button type="submit"&gt;Send&lt;/button&gt;</code></pre>

<h3>Free validation from the browser</h3>
<p>Attributes like <code>required</code>, <code>minlength</code>, <code>maxlength</code>, <code>min</code>, <code>max</code>, <code>pattern</code>, and <code>type="email"</code> make the browser check input <em>before</em> it submits — no JavaScript needed.</p>
<p class="pitfall"><strong>Browser validation is convenience, not security.</strong> A determined user can bypass it entirely. The Node.js backend must <em>always</em> re-validate every value it receives. Client checks are for a smooth experience; server checks are for safety.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn/Forms" target="_blank" rel="noopener">MDN — Web forms, from first steps to advanced</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Mọi ô đăng nhập, ô tìm kiếm và trang thanh toán đều là một biểu mẫu</h2>
<p class="lead">Biểu mẫu là cách người dùng <em>đưa</em> dữ liệu cho một trang. Đây chính là cây cầu nối tới khoá Node.js: một form thu dữ liệu trong trình duyệt rồi gửi tới một route backend để lưu. Quen ở đây thì phần xử lý phía server sau này sẽ thông ngay.</p>

<h3>Cái vỏ và các ô điều khiển</h3>
<pre><code>&lt;form action="/signup" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input id="email" name="email" type="email" required&gt;

  &lt;label for="pw"&gt;Mật khẩu&lt;/label&gt;
  &lt;input id="pw" name="password" type="password" minlength="8" required&gt;

  &lt;button type="submit"&gt;Tạo tài khoản&lt;/button&gt;
&lt;/form&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">action</span><span class="v">URL mà dữ liệu được gửi tới khi bấm gửi.</span></div>
  <div class="kv"><span class="k">method</span><span class="v">Cách gửi — thường là post cho dữ liệu làm thay đổi thứ gì đó (Chương 6 giải thích GET vs POST).</span></div>
  <div class="kv"><span class="k">name</span><span class="v">Khoá mà mỗi giá trị xuất hiện dưới đó ở phía server. Không có name = không được gửi.</span></div>
</div>

<h3>label + input — luôn đi cặp với nhau</h3>
<p>Thuộc tính <code>for</code> của một <code>&lt;label&gt;</code> phải khớp với <code>id</code> của ô input. Khi đó bấm vào nhãn sẽ đưa con trỏ vào ô, và trình đọc màn hình đọc tên ô. Cái liên kết bé xíu này là một trong những thói quen tiếp cận đáng giá nhất.</p>

<h3>Các type input bạn dùng nhiều nhất</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">text / email / password</span><span class="v">Chữ một dòng; email/password cho bàn phím đúng và che mật khẩu.</span></div>
  <div class="kv"><span class="k">number / date / tel / url</span><span class="v">Ô chuyên biệt với định dạng và kiểm tra sẵn.</span></div>
  <div class="kv"><span class="k">checkbox / radio</span><span class="v">Nhiều lựa chọn (checkbox) vs chọn đúng một (radio, dùng chung một name).</span></div>
  <div class="kv"><span class="k">file / range / color</span><span class="v">Tải một file lên, kéo thanh trượt, chọn một màu.</span></div>
</div>

<h3>Nhiều dòng, danh sách xổ và nút bấm</h3>
<pre><code>&lt;textarea name="bio" rows="4"&gt;&lt;/textarea&gt;

&lt;select name="country"&gt;
  &lt;option value="vn"&gt;Việt Nam&lt;/option&gt;
  &lt;option value="jp"&gt;Nhật Bản&lt;/option&gt;
&lt;/select&gt;

&lt;button type="submit"&gt;Gửi&lt;/button&gt;</code></pre>

<h3>Kiểm tra miễn phí từ trình duyệt</h3>
<p>Các thuộc tính như <code>required</code>, <code>minlength</code>, <code>maxlength</code>, <code>min</code>, <code>max</code>, <code>pattern</code>, và <code>type="email"</code> khiến trình duyệt kiểm tra dữ liệu <em>trước khi</em> gửi đi — không cần JavaScript.</p>
<p class="pitfall"><strong>Kiểm tra ở trình duyệt là tiện lợi, không phải bảo mật.</strong> Một người dùng cố tình có thể bỏ qua nó hoàn toàn. Backend Node.js <em>luôn luôn</em> phải kiểm tra lại mọi giá trị nó nhận. Kiểm phía client để trải nghiệm mượt; kiểm phía server để an toàn.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn/Forms" target="_blank" rel="noopener">MDN — Biểu mẫu web, từ bước đầu tới nâng cao</a></div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Tables, media and accessibility essentials|||2.5 — Bảng, đa phương tiện và những điều cốt lõi về khả năng tiếp cận',
      slug: 'wf-2-5-tables-media-a11y',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/e2nkq3h1P68', durationSeconds: 0 },
      description: 'Bảng dữ liệu đúng cách, nhúng video/âm thanh, và một danh sách kiểm khả năng tiếp cận thực dụng — viết HTML dùng được cho tất cả mọi người.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Structure serves people — including those who cannot see the screen</h2>
<p class="lead">The last piece of HTML is the content that needs careful structure: tabular data and media. Do it right and it is automatically accessible; do it lazily and you lock people out. Accessibility is not a separate skill bolted on — it is just good HTML.</p>

<h3>Tables — for data, never for layout</h3>
<pre><code>&lt;table&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th&gt;Language&lt;/th&gt;
      &lt;th&gt;Year&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;td&gt;JavaScript&lt;/td&gt;
      &lt;td&gt;1995&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;tr&gt;</span><span class="v">A table row.</span></div>
  <div class="kv"><span class="k">&lt;th&gt;</span><span class="v">A header cell — bold and announced as a header by screen readers.</span></div>
  <div class="kv"><span class="k">&lt;td&gt;</span><span class="v">A normal data cell.</span></div>
</div>
<p class="pitfall"><strong>Never use a table to position a page.</strong> That was a 1990s hack; tables are for genuine grids of data (a price list, a schedule). Page layout is CSS's job (Chapter 3).</p>

<h3>Audio and video</h3>
<pre><code>&lt;video src="demo.mp4" controls width="640"&gt;
  Your browser cannot play this video.
&lt;/video&gt;

&lt;audio src="song.mp3" controls&gt;&lt;/audio&gt;</code></pre>
<p>The <code>controls</code> attribute shows play/pause. Text inside is the fallback if the media cannot load. Add captions for video with a <code>&lt;track&gt;</code> element.</p>

<h3>A practical accessibility checklist</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Every image</span><span class="v">Meaningful alt text (or alt="" if decorative).</span></div>
  <div class="kv"><span class="k">Every input</span><span class="v">A matching &lt;label&gt; (from Lesson 2.4).</span></div>
  <div class="kv"><span class="k">Headings</span><span class="v">In order, no skipped levels — a real outline.</span></div>
  <div class="kv"><span class="k">Landmarks</span><span class="v">header / nav / main / footer so users can jump around.</span></div>
  <div class="kv"><span class="k">Links</span><span class="v">Descriptive text ("Read the pricing"), not "click here".</span></div>
  <div class="kv"><span class="k">lang</span><span class="v">&lt;html lang="vi"&gt; so screen readers use the right pronunciation.</span></div>
</div>
<p class="note-ct"><strong>The payoff of semantic, accessible HTML compounds.</strong> The same choices that help a screen-reader user also help Google index your page and help your CSS and JavaScript target elements cleanly. Good structure is the gift that keeps giving — and it is the whole reason this chapter comes before CSS and JS.</p>

<div class="link-card"><a href="https://www.w3.org/WAI/tutorials/" target="_blank" rel="noopener">W3C — Web Accessibility Tutorials</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Cấu trúc phục vụ con người — kể cả người không nhìn được màn hình</h2>
<p class="lead">Mảnh cuối của HTML là loại nội dung cần cấu trúc cẩn thận: dữ liệu dạng bảng và đa phương tiện. Làm đúng thì nó tự khắc tiếp cận được; làm ẩu thì bạn khoá cửa với nhiều người. Khả năng tiếp cận không phải một kỹ năng riêng gắn thêm — nó chỉ là HTML tốt.</p>

<h3>Bảng — cho dữ liệu, không bao giờ để dàn trang</h3>
<pre><code>&lt;table&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th&gt;Ngôn ngữ&lt;/th&gt;
      &lt;th&gt;Năm&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;td&gt;JavaScript&lt;/td&gt;
      &lt;td&gt;1995&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;tr&gt;</span><span class="v">Một hàng của bảng.</span></div>
  <div class="kv"><span class="k">&lt;th&gt;</span><span class="v">Ô tiêu đề — in đậm và được trình đọc màn hình đọc là "tiêu đề".</span></div>
  <div class="kv"><span class="k">&lt;td&gt;</span><span class="v">Một ô dữ liệu thường.</span></div>
</div>
<p class="pitfall"><strong>Đừng bao giờ dùng bảng để dàn trang.</strong> Đó là chiêu của thập ni 1990; bảng dành cho lưới dữ liệu thật (bảng giá, thời khoá biểu). Bố cục trang là việc của CSS (Chương 3).</p>

<h3>Âm thanh và video</h3>
<pre><code>&lt;video src="demo.mp4" controls width="640"&gt;
  Trình duyệt của bạn không phát được video này.
&lt;/video&gt;

&lt;audio src="song.mp3" controls&gt;&lt;/audio&gt;</code></pre>
<p>Thuộc tính <code>controls</code> hiện nút phát/dừng. Chữ bên trong là phương án dự phòng nếu media không tải được. Thêm phụ đề cho video bằng phần tử <code>&lt;track&gt;</code>.</p>

<h3>Một danh sách kiểm khả năng tiếp cận thực dụng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi ảnh</span><span class="v">alt có nghĩa (hoặc alt="" nếu chỉ trang trí).</span></div>
  <div class="kv"><span class="k">Mọi input</span><span class="v">Một &lt;label&gt; khớp với nó (từ Bài 2.4).</span></div>
  <div class="kv"><span class="k">Tiêu đề</span><span class="v">Đúng thứ tự, không nhảy cấp — một dàn ý thật.</span></div>
  <div class="kv"><span class="k">Landmark</span><span class="v">header / nav / main / footer để người dùng nhảy quanh.</span></div>
  <div class="kv"><span class="k">Liên kết</span><span class="v">Chữ mô tả rõ ("Xem bảng giá"), không phải "bấm vào đây".</span></div>
  <div class="kv"><span class="k">lang</span><span class="v">&lt;html lang="vi"&gt; để trình đọc màn hình dùng đúng cách phát âm.</span></div>
</div>
<p class="note-ct"><strong>Lợi ích của HTML ngữ nghĩa, tiếp cận được cộng dồn lại.</strong> Chính những lựa chọn giúp người dùng trình đọc màn hình cũng giúp Google lập chỉ mục trang bạn và giúp CSS cùng JavaScript nhắm tới phần tử gọn gàng. Cấu trúc tốt là món quà cho mãi — và đó chính là lý do chương này đứng trước CSS và JS.</p>

<div class="link-card"><a href="https://www.w3.org/WAI/tutorials/" target="_blank" rel="noopener">W3C — Hướng dẫn về khả năng tiếp cận web</a></div>
</div>
`,
    },

    /* ─────────────────────────── 2.6 quiz ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra chương 2',
      slug: 'wf-2-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về phần tử và thuộc tính, tiêu đề và liên kết, HTML ngữ nghĩa, biểu mẫu, bảng và khả năng tiếp cận.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 2: element anatomy and attributes, headings and links, semantic structure, forms and inputs, tables, and accessibility.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Reading HTML is not the same as writing it. Head to Code Lab and build real markup — the exercises check your solution automatically.</p>
<div class="link-card"><a href="/code-lab/html-css">Practice on Code Lab → HTML &amp; CSS track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 2: giải phẫu phần tử và thuộc tính, tiêu đề và liên kết, cấu trúc ngữ nghĩa, biểu mẫu và input, bảng, và khả năng tiếp cận.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Đọc HTML không giống viết HTML. Hãy sang Code Lab để tự tay dựng mã thật — các bài tập tự động chấm lời giải của bạn.</p>
<div class="link-card"><a href="/code-lab/html-css">Luyện tập ở Code Lab → track HTML &amp; CSS</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is an HTML attribute?|||Một thuộc tính (attribute) HTML là gì?',
            options: [
              'Extra configuration written as name="value" in the opening tag|||Cấu hình thêm viết dạng tên="giá trị" trong thẻ mở',
              'The closing tag of an element|||Thẻ đóng của một phần tử',
              'Any text between two tags|||Bất kỳ chữ nào giữa hai thẻ',
              'A CSS style rule|||Một quy tắc kiểu CSS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which part of the document holds the visible content?|||Phần nào của tài liệu chứa nội dung hiển thị?',
            options: [
              '<body>|||<body>',
              '<head>|||<head>',
              '<title>|||<title>',
              '<meta>|||<meta>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How many <h1> elements should a page normally have?|||Một trang thường nên có bao nhiêu phần tử <h1>?',
            options: [
              'Exactly one — the page title|||Đúng một — tiêu đề của trang',
              'As many as you like|||Bao nhiêu tuỳ thích',
              'None|||Không cái nào',
              'At least six|||Ít nhất sáu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which attribute makes a link point somewhere?|||Thuộc tính nào khiến một liên kết trỏ tới đâu đó?',
            options: [
              'href on an <a> element|||href trên một phần tử <a>',
              'src on an <a> element|||src trên một phần tử <a>',
              'alt on an <a> element|||alt trên một phần tử <a>',
              'link on an <a> element|||link trên một phần tử <a>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why write alt text on images?|||Vì sao phải viết alt cho ảnh?',
            options: [
              'Screen readers read it aloud and it shows if the image fails to load|||Trình đọc màn hình đọc to nó, và nó hiện ra nếu ảnh tải hỏng',
              'It makes the image load faster|||Nó làm ảnh tải nhanh hơn',
              'It is required for the image to appear at all|||Ảnh bắt buộc phải có mới hiện ra',
              'It changes the image colour|||Nó đổi màu của ảnh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is a SEMANTIC element (has meaning), not a generic box?|||Cái nào là phần tử NGỮ NGHĨA (có ý nghĩa), không phải hộp chung chung?',
            options: [
              '<nav>|||<nav>',
              '<div>|||<div>',
              '<span>|||<span>',
              '<b>|||<b>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a form, what does the input\'s "name" attribute do?|||Trong một form, thuộc tính "name" của input làm gì?',
            options: [
              'Sets the key each value arrives under on the server|||Đặt khoá mà mỗi giá trị xuất hiện dưới đó ở phía server',
              'Sets the text shown on screen|||Đặt chữ hiện trên màn hình',
              'Styles the input|||Tạo kiểu cho ô input',
              'It is optional and has no effect|||Nó là tuỳ chọn và không có tác dụng gì',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you correctly associate a <label> with its input?|||Làm sao để gắn đúng một <label> với ô input của nó?',
            options: [
              'The label\'s for matches the input\'s id|||Thuộc tính for của label khớp với id của input',
              'They must be different values|||Chúng phải là hai giá trị khác nhau',
              'Put the label after the </form>|||Đặt label sau </form>',
              'Give both the same name|||Cho cả hai cùng name',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Can browser form validation replace server-side validation?|||Kiểm tra biểu mẫu ở trình duyệt có thể thay cho kiểm tra phía server không?',
            options: [
              'No — the server must always re-validate; client checks can be bypassed|||Không — server luôn phải kiểm lại; kiểm ở client có thể bị bỏ qua',
              'Yes — if required is set the server can trust it|||Có — nếu đặt required thì server tin được',
              'Yes — browser checks are unbreakable|||Có — kiểm ở trình duyệt không thể phá',
              'Only for email fields|||Chỉ với ô email',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What are HTML tables for?|||Bảng HTML dùng để làm gì?',
            options: [
              'Presenting genuine tabular data, not page layout|||Trình bày dữ liệu dạng bảng thật, không phải để dàn trang',
              'Positioning the whole page layout|||Định vị bố cục cả trang',
              'Making text bold|||Làm chữ đậm',
              'Embedding videos|||Nhúng video',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
