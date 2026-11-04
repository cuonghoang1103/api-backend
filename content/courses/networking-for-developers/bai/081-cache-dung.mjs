/**
 * Chương 8 · 8.2 — Khoá cache, TTL và xoá cache cho đúng (slug khung netdev-8-2-cache-dung).
 * Output thật: lab/out/c82-*.out.txt (dựng lại: bash lab/code/dung-output-ch8.sh).
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-08-2.mjs';

const L = card;

export default {
  title: '8.2 — Cache keys, TTL and invalidation done right|||8.2 — Khoá cache, TTL và xoá cache cho đúng',
  slug: 'netdev-8-2-cache-dung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cache cho đúng: khoá cache = method + host + path + query (nên ?v=1 và ?v=2 là hai mục riêng — đo thật); tên tệp bất biến có mã băm để cache mãi mãi và phá bằng URL; TTL + stale-while-revalidate (phục vụ cũ tức thì, làm tươi ở nền); xoá cache theo URL/tag; và bẫy cookie biến mọi HIT thành BYPASS. Quyết ở thời điểm thiết kế, xác nhận bằng curl -I.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Cache keys, TTL and invalidation done right</h2>
<p class="lead">Turning on a cache is one line; getting it right is the difference between a site that is instant and a site that serves stale pages, or worse, never caches at all. The traps are subtle and they all come down to four questions: when are two requests the <em>same</em> object, how long does a copy stay fresh, how do you get rid of a copy, and what quietly disables caching for your whole site. This lesson answers each on the lab — including watching two identical files miss the cache because of a single query character.</p>

<h3>The cache key: a query string makes a new object</h3>
<p>A cache stores each response under a <strong>key</strong>: method + host + path + <strong>query string</strong>. Request the same bytes under <code>?v=1</code> then <code>?v=2</code>:</p>
${run('c82-key', 'curl', 3)}
<p><code>?v=1</code> misses, then hits (same key). <code>?v=2</code> is a <strong>different key</strong>, so it misses again — even though the file is byte-for-byte identical. The lesson is blunt: every distinct URL is a separate cache entry. A tracking parameter (<code>?utm_source=…</code>), a random cache-buster, or a per-user token in the query <strong>fragments your cache</strong>, multiplying storage and driving the hit rate toward zero. Keep varying junk out of cacheable URLs, and strip known-noise params at the edge.</p>

<h3>Cache forever, bust with the URL</h3>
<p>The right way to "bust" a cache is not to shorten the TTL — it is to change the URL. Build tools name a file by a hash of its content:</p>
<ul>
<li>Ship <code>app.9f3a2b.js</code> with <code>Cache-Control: public, max-age=31536000, immutable</code> — cache it for a <strong>year</strong>.</li>
<li>Change one byte → the hash changes → <code>app.7c1e04.js</code> → a brand-new URL the cache has never seen → the browser fetches it immediately.</li>
</ul>
<p>This is why a deploy goes live <em>instantly</em> and old assets stay cached a year at the same time: the HTML that references the assets is cached briefly (or not at all), and the hashed assets it points to are immutable. <strong>Never</strong> hand-edit a <code>?v=</code> query to force a refresh — that is exactly the fragmentation you just measured.</p>

<h3>TTL and stale-while-revalidate</h3>
${kv([
  ['max-age=60', 'Fresh for 60 s — served with no origin contact at all.'],
  ['s-maxage=300', 'A separate, longer TTL for shared caches (CDN) only; browsers ignore it.'],
  ['stale-while-revalidate=600', 'After expiry: serve the stale copy instantly AND refresh in the background.'],
  ['stale-if-error=86400', 'If the origin errors, keep serving the stale copy rather than failing.'],
])}
<p>For a semi-dynamic page (a product listing, a dashboard summary), a <strong>short <code>max-age</code> with a long <code>stale-while-revalidate</code></strong> is the sweet spot: every user gets an instant answer, and the origin is hit at most once per revalidation window instead of once per request.</p>

<h3>Invalidation: the genuinely hard part</h3>
<p>There are three ways to remove something from a cache:</p>
<ul>
<li><strong>By TTL</strong> — do nothing and let it expire. Simplest, but you wait out the TTL.</li>
<li><strong>Purge by URL</strong> — tell the CDN to drop one object now, right after you change it.</li>
<li><strong>Purge by tag / surrogate key</strong> — one call drops every object tagged, say, <code>product-42</code> (its page, its API response, its images) at once.</li>
</ul>
<p>"There are only two hard things in computer science: cache invalidation and naming things." The safe default sidesteps most of it: <strong>hashed URLs for assets</strong> (which never need invalidation) and <strong>short TTLs for HTML/JSON</strong>, keeping purge for the rare change that must be live immediately.</p>

<div class="pitfall co-tieu-de">
<p><strong>A stray <code>Set-Cookie</code> disables caching for the whole site.</strong> A response that sets a cookie, or a route that declares <code>Vary: Cookie</code>, is treated as per-user and cannot be stored in a shared cache — so every request becomes a <code>BYPASS</code> and hits the origin. One analytics or session cookie set on <code>/</code> can silently take your entire CDN out of the loop, and the symptom ("the CDN isn't caching anything") looks nothing like the cause. Strip cookies on static paths at the edge, or serve assets from a cookie-free host, and check with <code>curl -sD -</code>: a <code>Set-Cookie</code> on a <code>.js</code> file is the smell.</p>
</div>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a site's CDN bill is huge and its hit rate is low. You suspect the URLs.</p>
<ol>
<li>On the lab edge, request <code>/img/logo.txt?v=1</code> twice, then <code>?v=2</code> once, reading <code>X-Cache</code> each time. Explain why <code>?v=2</code> misses.</li>
<li>Describe how you would re-serve that asset so it caches for a year yet updates on deploy (hashed filename + <code>immutable</code>).</li>
<li>Write the <code>Cache-Control</code> you would set for: a hashed JS bundle, a public JSON list that changes every few minutes, and a logged-in dashboard.</li>
<li>Name one header that, if present on a static asset, would turn every request into a <code>BYPASS</code>.</li>
</ol>
<p><strong>Done when:</strong> you can state that <code>?v=1</code> and <code>?v=2</code> are different keys; your three <code>Cache-Control</code> values are roughly <code>max-age=31536000, immutable</code>, <code>max-age=60, stale-while-revalidate=600</code>, and <code>no-store</code> (or <code>private</code>); and you named <code>Set-Cookie</code>.</p>
<details><summary>Solution</summary>
<p><code>?v=1</code> → MISS then HIT; <code>?v=2</code> → MISS, because the query is part of the key, so the two are separate entries. Re-serve as <code>app.&lt;hash&gt;.js</code> with <code>public, max-age=31536000, immutable</code>; a new build changes the hash and therefore the URL. The three values: hashed bundle → a year + <code>immutable</code>; public JSON → short <code>max-age</code> + <code>stale-while-revalidate</code>; dashboard → <code>no-store</code> (or <code>private, no-cache</code>). The bypass-causing header is <code>Set-Cookie</code> (or <code>Vary: Cookie</code>).</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Cache key', 'What identifies an object: method + host + path + query.'],
  ['immutable', 'Promise that the URL’s content never changes — cache it and never revalidate.'],
  ['TTL / max-age', 'How long a copy stays fresh before it must be revalidated.'],
  ['stale-while-revalidate', 'Serve the expired copy now, refresh in the background.'],
  ['Purge / surrogate key', 'Remove one object (by URL) or a group (by tag) from the cache now.'],
  ['Vary', 'Split the cache key on a request header; Vary: Cookie makes it per-user.'],
  ['BYPASS', 'A response the shared cache refused to store (cookie, no-store, dynamic).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>The cache key is <strong>method + host + path + query</strong> — <code>?v=1</code> ≠ <code>?v=2</code>, so query noise fragments the cache (measured).</li>
<li><strong>Hashed immutable filenames</strong> + a one-year <code>max-age</code> = cache forever, bust with the URL; never hand-edit <code>?v=</code>.</li>
<li><code>max-age</code> sets freshness; <code>stale-while-revalidate</code> serves instantly and refreshes in the background.</li>
<li>Invalidation = TTL, purge-by-URL, or purge-by-tag; prefer hashed URLs so you rarely need it.</li>
<li>A <code>Set-Cookie</code> / <code>Vary: Cookie</code> turns every hit into a <code>BYPASS</code> — strip cookies on static paths.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control', '📘', 'MDN — Cache-Control', 'max-age, s-maxage, immutable, no-store, public/private — each directive.', 'Open')}
${L('https://web.dev/articles/http-cache', '📘', 'web.dev — The HTTP cache', 'The hashed-filename + long max-age pattern, explained with diagrams.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc5861.html', '📄', 'RFC 5861 — stale-while-revalidate', 'The directive that serves a stale copy while refreshing in the background.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Khoá cache, TTL và xoá cache cho đúng</h2>
<p class="lead">Bật một bộ đệm là một dòng; làm cho đúng là khác biệt giữa một site tức thì và một site phục vụ trang cũ, hoặc tệ hơn, không bao giờ cache. Các bẫy đều tinh vi và đều quy về bốn câu hỏi: khi nào hai yêu cầu là <em>cùng</em> một đối tượng, một bản sao tươi bao lâu, bạn gỡ một bản sao thế nào, và cái gì âm thầm tắt cache cho cả site. Bài này trả lời từng cái trên lab — kể cả nhìn hai tệp y hệt trượt cache chỉ vì một ký tự query.</p>

<h3>Khoá cache: một query string tạo ra một đối tượng mới</h3>
<p>Một bộ đệm lưu mỗi câu trả lời dưới một <strong>khoá</strong>: method + host + path + <strong>query string</strong>. Hỏi cùng số byte dưới <code>?v=1</code> rồi <code>?v=2</code>:</p>
${run('c82-key', 'curl', 3)}
<p><code>?v=1</code> trượt, rồi trúng (cùng khoá). <code>?v=2</code> là một <strong>khoá khác</strong>, nên nó trượt lần nữa — dù tệp giống nhau từng byte. Bài học thẳng thừng: mỗi URL khác nhau là một mục cache riêng. Một tham số theo dõi (<code>?utm_source=…</code>), một cái phá-cache ngẫu nhiên, hay một token theo-người-dùng trong query <strong>phân mảnh cache của bạn</strong>, nhân dung lượng và đẩy tỷ lệ trúng về không. Giữ rác hay đổi ra khỏi URL cache-được, và tước các tham số nhiễu đã biết ở biên.</p>

<h3>Cache mãi mãi, phá bằng URL</h3>
<p>Cách đúng để "phá" cache không phải rút ngắn TTL — mà là đổi URL. Công cụ dựng đặt tên tệp theo một mã băm nội dung của nó:</p>
<ul>
<li>Ship <code>app.9f3a2b.js</code> với <code>Cache-Control: public, max-age=31536000, immutable</code> — cache nó cả <strong>năm</strong>.</li>
<li>Đổi một byte → mã băm đổi → <code>app.7c1e04.js</code> → một URL hoàn toàn mới cache chưa từng thấy → trình duyệt lấy nó ngay.</li>
</ul>
<p>Đây là lý do một deploy lên <em>tức thì</em> và tài nguyên cũ vẫn được cache cả năm cùng lúc: HTML trỏ tới tài nguyên được cache ngắn (hoặc không), và tài nguyên có mã băm nó trỏ tới là bất biến. <strong>Đừng bao giờ</strong> sửa tay một query <code>?v=</code> để ép làm tươi — đó đúng là sự phân mảnh bạn vừa đo.</p>

<h3>TTL và stale-while-revalidate</h3>
${kv([
  ['max-age=60', 'Tươi 60 giây — phục vụ không chạm origin chút nào.'],
  ['s-maxage=300', 'Một TTL riêng, dài hơn, chỉ cho cache dùng chung (CDN); trình duyệt bỏ qua.'],
  ['stale-while-revalidate=600', 'Sau khi hết hạn: phục vụ bản cũ tức thì VÀ làm tươi ở nền.'],
  ['stale-if-error=86400', 'Nếu origin lỗi, tiếp tục phục vụ bản cũ thay vì hỏng.'],
])}
<p>Với một trang nửa-động (một danh sách sản phẩm, một tóm tắt bảng điều khiển), một <strong><code>max-age</code> ngắn với một <code>stale-while-revalidate</code> dài</strong> là điểm ngọt: mọi người dùng nhận câu trả lời tức thì, và origin bị chạm nhiều nhất một lần mỗi cửa sổ kiểm lại thay vì một lần mỗi yêu cầu.</p>

<h3>Invalidation: phần thật sự khó</h3>
<p>Có ba cách gỡ một thứ khỏi cache:</p>
<ul>
<li><strong>Theo TTL</strong> — không làm gì và để nó hết hạn. Đơn giản nhất, nhưng bạn phải chờ hết TTL.</li>
<li><strong>Purge theo URL</strong> — bảo CDN bỏ một đối tượng ngay, đúng sau khi bạn đổi nó.</li>
<li><strong>Purge theo tag / surrogate key</strong> — một lời gọi bỏ mọi đối tượng gắn tag, ví dụ <code>product-42</code> (trang của nó, câu trả lời API của nó, ảnh của nó) cùng lúc.</li>
</ul>
<p>"Chỉ có hai thứ khó trong khoa học máy tính: xoá cache và đặt tên." Mặc định an toàn né được phần lớn: <strong>URL có mã băm cho tài nguyên</strong> (không bao giờ cần invalidation) và <strong>TTL ngắn cho HTML/JSON</strong>, giữ purge cho thay đổi hiếm hoi phải lên ngay.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một <code>Set-Cookie</code> lạc tắt cache cho cả site.</strong> Một câu trả lời đặt một cookie, hay một tuyến khai <code>Vary: Cookie</code>, bị coi là theo-người-dùng và không lưu được trong một cache dùng chung — nên mọi yêu cầu thành một <code>BYPASS</code> và chạm origin. Một cookie phân tích hay phiên duy nhất đặt trên <code>/</code> có thể âm thầm đưa cả CDN của bạn ra khỏi cuộc chơi, và triệu chứng ("CDN không cache gì") trông chẳng giống nguyên nhân chút nào. Tước cookie trên các đường tĩnh ở biên, hoặc phục vụ tài nguyên từ một host không cookie, và kiểm bằng <code>curl -sD -</code>: một <code>Set-Cookie</code> trên một tệp <code>.js</code> là mùi lỗi.</p>
</div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> hoá đơn CDN của một site rất lớn và tỷ lệ trúng thấp. Bạn nghi các URL.</p>
<ol>
<li>Trên biên lab, hỏi <code>/img/logo.txt?v=1</code> hai lần, rồi <code>?v=2</code> một lần, đọc <code>X-Cache</code> mỗi lần. Giải thích vì sao <code>?v=2</code> trượt.</li>
<li>Mô tả cách bạn sẽ phục vụ lại tài nguyên đó để nó cache cả năm mà vẫn cập nhật khi deploy (tên tệp có mã băm + <code>immutable</code>).</li>
<li>Viết <code>Cache-Control</code> bạn sẽ đặt cho: một bundle JS có mã băm, một danh sách JSON công khai đổi vài phút một lần, và một bảng điều khiển đã đăng nhập.</li>
<li>Kể một header mà nếu có trên một tài nguyên tĩnh sẽ biến mọi yêu cầu thành một <code>BYPASS</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được <code>?v=1</code> và <code>?v=2</code> là hai khoá khác nhau; ba giá trị <code>Cache-Control</code> của bạn đại khái là <code>max-age=31536000, immutable</code>, <code>max-age=60, stale-while-revalidate=600</code>, và <code>no-store</code> (hoặc <code>private</code>); và bạn kể <code>Set-Cookie</code>.</p>
<details><summary>Lời giải</summary>
<p><code>?v=1</code> → MISS rồi HIT; <code>?v=2</code> → MISS, vì query là một phần của khoá, nên hai cái là hai mục riêng. Phục vụ lại là <code>app.&lt;hash&gt;.js</code> với <code>public, max-age=31536000, immutable</code>; một build mới đổi mã băm và do đó URL. Ba giá trị: bundle có mã băm → một năm + <code>immutable</code>; JSON công khai → <code>max-age</code> ngắn + <code>stale-while-revalidate</code>; bảng điều khiển → <code>no-store</code> (hoặc <code>private, no-cache</code>). Header gây bypass là <code>Set-Cookie</code> (hoặc <code>Vary: Cookie</code>).</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Cache key', 'Cái định danh một đối tượng: method + host + path + query.'],
  ['immutable', 'Lời hứa rằng nội dung của URL không bao giờ đổi — cache và không kiểm lại.'],
  ['TTL / max-age', 'Một bản sao tươi bao lâu trước khi phải kiểm lại.'],
  ['stale-while-revalidate', 'Phục vụ bản hết hạn ngay, làm tươi ở nền.'],
  ['Purge / surrogate key', 'Gỡ một đối tượng (theo URL) hay một nhóm (theo tag) khỏi cache ngay.'],
  ['Vary', 'Tách khoá cache theo một header yêu cầu; Vary: Cookie làm nó theo-người-dùng.'],
  ['BYPASS', 'Một câu trả lời cache dùng chung từ chối lưu (cookie, no-store, động).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoá cache là <strong>method + host + path + query</strong> — <code>?v=1</code> ≠ <code>?v=2</code>, nên nhiễu query phân mảnh cache (đo thật).</li>
<li><strong>Tên tệp bất biến có mã băm</strong> + một <code>max-age</code> một năm = cache mãi mãi, phá bằng URL; đừng sửa tay <code>?v=</code>.</li>
<li><code>max-age</code> đặt độ tươi; <code>stale-while-revalidate</code> phục vụ tức thì và làm tươi ở nền.</li>
<li>Invalidation = TTL, purge theo URL, hoặc purge theo tag; ưu tiên URL có mã băm để hiếm khi cần nó.</li>
<li>Một <code>Set-Cookie</code> / <code>Vary: Cookie</code> biến mọi HIT thành một <code>BYPASS</code> — tước cookie trên các đường tĩnh.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control', '📘', 'MDN — Cache-Control', 'max-age, s-maxage, immutable, no-store, public/private — từng chỉ thị.', 'Mở')}
${L('https://web.dev/articles/http-cache', '📘', 'web.dev — Cache HTTP', 'Khuôn mẫu tên-tệp-mã-băm + max-age dài, giải thích kèm sơ đồ.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc5861.html', '📄', 'RFC 5861 — stale-while-revalidate', 'Chỉ thị phục vụ bản cũ trong khi làm tươi ở nền.', 'Mở')}
</div>
`,
};
