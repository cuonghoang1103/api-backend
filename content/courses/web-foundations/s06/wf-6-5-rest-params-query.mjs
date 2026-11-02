/**
 * Bài 6.5 — REST, tham số đường dẫn và query string (nâng cấp 02/11/2026). Output thật: _demo/_t6/chay.sh (curl → API Node
 * _t6/server.mjs: lọc/sắp/phân trang, %20 vs dấu cách, limit=abc), _demo/_t6/chay.mjs (Chromium: form GET → query string),
 * _demo/6-5/tham-so.js (URLSearchParams), _demo/_t6/idor.mjs (id trong URL không phải quyền). Deck: scripts/slides-src/wf-6-5.mjs
 * (10 slide, WF/v1/wf-6-5). Code Lab: wf-6-5-rest-params-query.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-6-5', 'REST, params and query', 'REST, tham số và query', [
  [1, 'REST, path parameters and query strings',
    '<p>REST is a convention, not a library: name your resources with nouns in the path, act on them with methods, and refine a request with a query string. Follow it and other developers can guess your API. This lesson builds on the product API and ends with a security bug that the convention alone does not prevent.</p>',
    '<p>REST là một quy ước, không phải thư viện: đặt tên tài nguyên bằng danh từ trong đường dẫn, hành động lên chúng bằng method, và tinh chỉnh request bằng query string. Theo nó thì lập trình viên khác đoán được API của bạn. Bài này dựa trên API sản phẩm và kết thúc bằng một lỗi bảo mật mà riêng quy ước không ngăn được.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to design clean URLs for a resource and its children, decide whether a value belongs in the path or the query, build and read query strings safely with URLSearchParams, validate values that always arrive as strings, and check ownership instead of trusting an id.</p>',
    '<p>Bạn sẽ thiết kế được URL gọn cho một tài nguyên và các tài nguyên con, quyết định một giá trị thuộc về đường dẫn hay query, dựng và đọc query string an toàn bằng URLSearchParams, kiểm tra giá trị luôn đến dưới dạng chuỗi, và kiểm quyền sở hữu thay vì tin vào một id.</p>'],
  [3, 'Nouns in the path, verbs in the method',
    '<p>Plural nouns name collections, an id names one item, and nesting shows ownership, like the comments of post seventeen. Verbs such as get, create or delete never appear in the path, because the method already says that.</p>',
    '<p>Danh từ số nhiều gọi tên tập hợp, id gọi tên một phần tử, và lồng nhau thể hiện quan hệ sở hữu, như các bình luận của bài viết mười bảy. Động từ như get, create hay delete không bao giờ xuất hiện trong đường dẫn, vì method đã nói điều đó.</p>'],
  [4, 'Path or query?',
    '<p>If the value changes which thing you mean, it goes in the path: product three. If it only filters, sorts or pages the same collection, it goes in the query: office products, most expensive first, page two. Query values are optional and should all have sensible defaults.</p>',
    '<p>Nếu giá trị đổi việc bạn đang nói tới thứ nào, nó vào đường dẫn: sản phẩm ba. Nếu nó chỉ lọc, sắp xếp hay phân trang cùng một tập hợp, nó vào query: sản phẩm văn phòng, đắt nhất trước, trang hai. Giá trị query là tuỳ chọn và đều nên có mặc định hợp lý.</p>'],
  [5, 'Filtering, sorting, paging',
    '<p>Real output from our API: category equals office returns three items; adding sort minus price orders them from most to least expensive; page two with limit two returns items three and four, plus the total so the page can draw its pagination.</p>',
    '<p>Output thật từ API của ta: category bằng office trả ba món; thêm sort trừ price xếp từ đắt nhất tới rẻ nhất; trang hai với limit hai trả món ba và bốn, kèm tổng số để trang vẽ được thanh phân trang.</p>'],
  [6, 'Encoding the query',
    '<p>A space, an ampersand or a Vietnamese letter cannot travel raw in a URL. curl refused the unencoded space outright. URLSearchParams encodes everything for you, and a form with method get does the same automatically, writing spaces as plus signs.</p>',
    '<p>Dấu cách, dấu và hay chữ tiếng Việt không đi trần trong URL được. curl từ chối thẳng dấu cách chưa mã hoá. URLSearchParams mã hoá mọi thứ cho bạn, và một form với method get cũng tự làm vậy, viết dấu cách thành dấu cộng.</p>'],
  [7, 'Everything arrives as a string',
    '<p>Path and query values are always strings. Our API turned limit equals abc into NaN and silently returned an empty list. Convert on purpose, check the result, apply defaults and limits: a client asking for a thousand items got fifty.</p>',
    '<p>Giá trị trong đường dẫn và query luôn là chuỗi. API của ta biến limit bằng abc thành NaN và lặng lẽ trả danh sách rỗng. Hãy đổi kiểu có chủ ý, kiểm kết quả, áp mặc định và giới hạn: một client xin một nghìn món chỉ nhận năm mươi.</p>'],
  [8, 'An id is not permission',
    '<p>Logged in as An, we asked for note twelve, which is hers, and note thirteen, which belongs to Binh. Without an owner check the server returned Binh\'s private note. With the check, it answered 404. This bug is the most common serious flaw in real APIs.</p>',
    '<p>Đăng nhập là An, ta xin ghi chú mười hai, của An, và ghi chú mười ba, của Bình. Không kiểm chủ sở hữu, máy chủ trả ghi chú riêng của Bình. Có kiểm, nó trả 404. Lỗi này là lỗ hổng nghiêm trọng phổ biến nhất trong API thật.</p>'],
  [9, 'The whole chapter in one request',
    '<p>Method and path, query, headers, a JSON body, and a status code with headers and a body coming back. Every request you will send or build from now on is made of these pieces, including every Express route in the Node.js course.</p>',
    '<p>Method và đường dẫn, query, header, một phần thân JSON, và mã trạng thái cùng header và phần thân trả về. Mọi request bạn sẽ gửi hay dựng từ giờ đều làm từ những mảnh này, kể cả mọi route Express trong khoá Node.js.</p>'],
  [10, 'Summary & practice',
    '<p>The practice asks you to design the URLs for a small library API, add a validated filter to the product API, and fix an owner check. "Done when" checks a 400 for a bad limit and a 404 for another user\'s note.</p>',
    '<p>Bài luyện yêu cầu bạn thiết kế URL cho một API thư viện nhỏ, thêm một bộ lọc có kiểm tra vào API sản phẩm, và sửa một phép kiểm chủ sở hữu. "Xong khi" kiểm 400 cho limit sai và 404 cho ghi chú của người khác.</p>'],
]);

export default {
  title: '6.5 — REST APIs, path parameters and query strings|||6.5 — REST API, tham số đường dẫn và query string',
  slug: 'wf-6-5-rest-params-query',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/-MTSQjw5DrM', durationSeconds: 0 },
  description: 'Quy ước REST (danh từ trong đường dẫn, method là động từ, lồng nhau); đường dẫn hay query; lọc/sắp/phân trang thật trên API Node; mã hoá query (curl từ chối dấu cách, URLSearchParams, form GET viết + trong Chromium); mọi giá trị là chuỗi (limit=abc ⇒ danh sách rỗng, trần limit 50); IDOR: id trong URL không phải quyền (đọc được ghi chú người khác ⇒ sửa bằng kiểm chủ sở hữu).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>REST: predictable addresses for things, and options for how to see them</h2>
<p class="lead">After this lesson you can design the URLs of an API so that other developers can guess them, decide whether a value belongs in the path or the query string, build and read query strings without encoding bugs, treat every incoming value as an untrusted string, and avoid the most common serious API vulnerability: trusting an id in the URL as if it were permission. In Express you will write exactly these routes — <code>app.get('/api/products/:id', …)</code> — and read <code>req.params</code> and <code>req.query</code>.</p>

<h3>Step 1 — resources are nouns, methods are verbs</h3>
<table>
<thead><tr><th>Request</th><th>Means</th></tr></thead>
<tbody>
<tr><td><code>GET /posts</code></td><td>The collection of posts</td></tr>
<tr><td><code>POST /posts</code></td><td>Create a post in it</td></tr>
<tr><td><code>GET /posts/17</code></td><td>One post</td></tr>
<tr><td><code>PATCH /posts/17</code> · <code>DELETE /posts/17</code></td><td>Change it · delete it</td></tr>
<tr><td><code>GET /posts/17/comments</code></td><td>The comments that belong to post 17</td></tr>
<tr><td><code>POST /posts/17/comments</code></td><td>Add a comment to post 17</td></tr>
</tbody>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">Plural nouns</span><span class="v"><code>/products</code>, <code>/users</code> — the same word for the list and its items.</span></div>
  <div class="kv"><span class="k">No verbs in paths</span><span class="v"><code>/getProducts</code>, <code>/deleteProduct?id=3</code> repeat what the method already says (and the second is a GET that deletes — Lesson 6.2).</span></div>
  <div class="kv"><span class="k">Nest one level</span><span class="v"><code>/posts/17/comments</code> is clear; <code>/users/1/posts/17/comments/4/likes</code> is not. Deep items get their own top-level path: <code>/comments/4</code>.</span></div>
  <div class="kv"><span class="k">lower-case-with-dashes</span><span class="v"><code>/order-items</code>, not <code>/OrderItems</code> — paths are case-sensitive on most servers.</span></div>
  <div class="kv"><span class="k">Actions that are not CRUD</span><span class="v">Model them as a sub-resource: <code>POST /orders/9/cancellation</code> or <code>POST /orders/9/cancel</code>. Pragmatic is fine; consistent is required.</span></div>
</div>

<h3>Step 2 — path parameter or query string?</h3>
<p>Our server reads both from the same <code>URL</code> object: the path is split into parts, and the id is the third part; options come from <code>searchParams</code>:</p>
${ma('javascript', CODE['_t6/server.mjs'], [35, 37])}
${ma('javascript', CODE['_t6/server.mjs'], [55, 71])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Path</span><span class="lz-t">identifies the thing</span><span class="lz-d"><code>/api/products/3</code> — remove the 3 and you mean a different resource (the whole list).</span></div>
<div class="lz-step"><span class="lz-k">Query</span><span class="lz-t">refines the view</span><span class="lz-d"><code>?category=office&amp;sort=-price&amp;page=2</code> — the same collection, filtered, ordered, paged.</span></div>
<div class="lz-step"><span class="lz-k">Defaults</span><span class="lz-t">every option optional</span><span class="lz-d">No <code>page</code> → 1, no <code>limit</code> → 10, no <code>sort</code> → stored order.</span></div>
</div>
<p>Rule of thumb: if removing the value points at a different <em>thing</em>, it is a path parameter; if it only filters, sorts, searches or pages the same collection, it is a query parameter.</p>

<h3>Step 3 — filtering, sorting and paging (real output)</h3>
${ra(doan('_t6/out/query', 0, 1, 2))}
<p>Three conventions you will meet in most APIs: a field name as a filter (<code>category=office</code>), <code>sort</code> with a minus sign for descending, and <code>page</code> + <code>limit</code> with the <code>total</code> returned so the front-end can show "page 2 of 4". Large APIs often use <em>cursor</em> paging instead (<code>?after=abc123</code>), which stays correct when items are added while you page.</p>

<h3>Step 4 — encoding: what a URL can carry</h3>
<p>A URL may contain only a limited set of characters. Spaces, <code>&amp;</code>, <code>#</code>, <code>/</code> inside a value and every non-ASCII letter must be <em>percent-encoded</em>:</p>
${ra(doan('_t6/out/query', 3, 4))}
<p>curl refused the raw space. Browsers are more forgiving in the address bar, but code that glues strings together breaks as soon as a value contains <code>&amp;</code> or <code>#</code>. Let <code>URLSearchParams</code> do it (real Chromium output):</p>
${ma('javascript', CODE['6-5/tham-so.js'])}
${ra(OUT['6-5/tham-so'])}
<p>"by hand" would send <code>q=bút </code> and then a broken parameter named <code> sổ tay</code>, because <code>&amp;</code> starts a new pair. A form with <code>method="get"</code> encodes for you too — in Chromium, submitting "desk lamp" and "home":</p>
${ra(OUT['_t6/out/form-get'])}
<p>In a query string a space may be written <code>+</code> (forms, <code>URLSearchParams</code>) or <code>%20</code> (<code>encodeURIComponent</code>); servers accept both. In a <em>path</em> segment, use <code>encodeURIComponent</code>: it also encodes <code>/</code>, so a value cannot add an extra segment.</p>

<h3>Step 5 — every value arrives as a string</h3>
${ra(doan('_t6/out/query', 5, 6, 7))}
<p>Three real problems in one block. <code>/api/products/abc</code> became <code>Number('abc')</code> = <code>NaN</code> and got a 404 with a confusing message (Lesson 6.3's practice turns it into a 400). <code>limit=abc</code> also became <code>NaN</code>, slipped through <code>Math.min</code>, and returned an empty list with <code>"limit":null</code> — no error, just wrong data. Only the cap worked: asking for 1000 items gave 50.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting query values to be numbers.</strong> <code>req.query.page</code> in Express is <code>'2'</code>, not <code>2</code>; <code>'2' + 1</code> is <code>'21'</code>. Missing values are <code>undefined</code>, repeated keys may become arrays, and anyone can send <code>limit=999999</code> to make your database return everything. For each parameter: convert on purpose, check (<code>Number.isInteger</code>, allowed list for <code>sort</code>), apply a default, apply a maximum, and answer 400 with a clear message when it is invalid.</p></div>

<h3>Step 6 — an id in the URL is not permission</h3>
<p>Two versions of <code>GET /api/notes/:id</code>. Both require a login. The user <code>an</code> asks for note 12 (hers) and note 13 (Bình's):</p>
${ma('javascript', CODE['_t6/idor.mjs'])}
${ra(OUT['_t6/out/idor'])}
<div class="pitfall co-tieu-de"><p><strong>Trap — IDOR (Insecure Direct Object Reference).</strong> Without the owner check, changing 12 to 13 in the address returned someone else's private note. Being logged in answered "who are you?", not "may you see <em>this</em>?". This is the most common serious flaw found in real APIs (OWASP API Security #1, "Broken Object Level Authorization"). Every query that loads a resource by id must also filter by what the caller is allowed to see — and answering 404 rather than 403 avoids confirming that note 13 exists.</p></div>

<h3>Step 7 — the whole chapter in one request</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Request line</span><span class="lz-t">POST /api/products?notify=false HTTP/1.1</span><span class="lz-d">Method (6.2) + path with a query (6.5).</span></div>
<div class="lz-layer"><span class="lz-k">Headers</span><span class="lz-t">Content-Type · Accept · Authorization</span><span class="lz-d">How to read the body, what to send back, who is asking (6.4, Chapter 7).</span></div>
<div class="lz-layer"><span class="lz-k">Body</span><span class="lz-t">{"name":"Tape","price":15000}</span><span class="lz-d">JSON, stringified (6.4).</span></div>
<div class="lz-layer"><span class="lz-k">Response</span><span class="lz-t">201 Created · Location · JSON</span><span class="lz-d">Status (6.3), headers, the created resource.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — design, validate, protect</strong></p>
<ol>
<li>On paper, design the URLs and methods for a small library API: books, authors, loans of a book, returning a loan. Use only nouns in paths.</li>
<li>In the Chapter 6 server, validate <code>limit</code> and <code>page</code>: not a whole number, or below 1 → 400 <code>{"error":"limit must be a whole number from 1 to 50"}</code>.</li>
<li>Add a <code>minPrice</code> filter and allow <code>sort=name</code>; reject any other <code>sort</code> value with 400.</li>
<li>In the browser console, build <code>/api/products?q=đèn bàn &amp; ghế&amp;page=1</code> with <code>URLSearchParams</code> and fetch it.</li>
<li>Copy <code>idor.mjs</code>, add <code>DELETE /api/notes/:id</code>, and make sure <code>an</code> cannot delete note 13.</li>
</ol>
<p>Hint: <code>const n = Number(value); if (!Number.isInteger(n) || n &lt; 1 || n &gt; 50) …</code>. For the sort whitelist: <code>['price', '-price', 'name'].includes(sort)</code>.</p>
<p><strong>Done when:</strong> your library design has no verb in any path; <code>?limit=abc</code> and <code>?page=0</code> return 400 with your message; <code>?minPrice=50000&amp;sort=name</code> returns only products from 50 000, ordered by name; the encoded URL contains <code>%26</code> where the <code>&amp;</code> of the search text was; and <code>an</code>'s DELETE of note 13 returns 404 while note 13 still exists for <code>binh</code>. Then Code Lab module 6.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">REST</span><span class="v">phong cách thiết kế API: tài nguyên + method.</span></div>
  <div class="kv"><span class="k">resource / collection</span><span class="v">tài nguyên / tập hợp — <code>/products/3</code>, <code>/products</code>.</span></div>
  <div class="kv"><span class="k">path parameter</span><span class="v">tham số đường dẫn — <code>:id</code>, đọc bằng <code>req.params</code>.</span></div>
  <div class="kv"><span class="k">query string</span><span class="v">chuỗi truy vấn — sau dấu <code>?</code>, đọc bằng <code>req.query</code>.</span></div>
  <div class="kv"><span class="k">percent-encoding</span><span class="v">mã hoá phần trăm — <code>%20</code>, <code>%26</code>…</span></div>
  <div class="kv"><span class="k">URLSearchParams</span><span class="v">đối tượng dựng/đọc query string an toàn.</span></div>
  <div class="kv"><span class="k">pagination / cursor</span><span class="v">phân trang theo trang / theo con trỏ.</span></div>
  <div class="kv"><span class="k">validation</span><span class="v">kiểm tra dữ liệu vào — đổi kiểu, kiểm, mặc định, giới hạn.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">truy cập đối tượng bằng id mà không kiểm quyền.</span></div>
  <div class="kv"><span class="k">nested resource</span><span class="v">tài nguyên lồng — <code>/posts/17/comments</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Paths are plural nouns; methods are the verbs; nest one level for ownership.</li>
  <li>Path = which thing; query = how to filter, sort, search or page it — with defaults.</li>
  <li>Return <code>total</code> (or a cursor) with paged lists.</li>
  <li>Never glue query strings by hand: <code>URLSearchParams</code> / <code>encodeURIComponent</code>.</li>
  <li>Every path and query value is a string: convert, check, default, cap, and 400 when invalid.</li>
  <li>An id in the URL is not permission: always filter by owner (IDOR / BOLA).</li>
  <li>Method + path + query + headers + body → status + headers + body: the whole of HTTP.</li>
</ul>
${nguon('📗', 'MDN — URLSearchParams', 'Build and read query strings correctly', 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams')}
${nguon('📘', 'OWASP API Security Top 10 — API1: Broken Object Level Authorization', 'The IDOR bug, with real-world examples', 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-5-2-dinh-tuyen', title: 'Node.js 5.2 — Routing in Express', sub: 'The same routes with req.params and req.query on a real Express server', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>REST: địa chỉ đoán được cho đồ vật, và tuỳ chọn để xem chúng</h2>
<p class="lead">Học xong bài này bạn thiết kế được URL của một API sao cho lập trình viên khác đoán ra, quyết định một giá trị thuộc đường dẫn hay query string, dựng và đọc query string không dính lỗi mã hoá, coi mọi giá trị đi vào là chuỗi không đáng tin, và tránh lỗ hổng API nghiêm trọng phổ biến nhất: tin một id trong URL như thể đó là quyền. Trong Express bạn sẽ viết đúng những route này — <code>app.get('/api/products/:id', …)</code> — và đọc <code>req.params</code> với <code>req.query</code>.</p>

<h3>Bước 1 — tài nguyên là danh từ, method là động từ</h3>
<table>
<thead><tr><th>Request</th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td><code>GET /posts</code></td><td>Tập hợp bài viết</td></tr>
<tr><td><code>POST /posts</code></td><td>Tạo một bài trong đó</td></tr>
<tr><td><code>GET /posts/17</code></td><td>Một bài</td></tr>
<tr><td><code>PATCH /posts/17</code> · <code>DELETE /posts/17</code></td><td>Sửa nó · xoá nó</td></tr>
<tr><td><code>GET /posts/17/comments</code></td><td>Các bình luận thuộc bài 17</td></tr>
<tr><td><code>POST /posts/17/comments</code></td><td>Thêm bình luận vào bài 17</td></tr>
</tbody>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">Danh từ số nhiều</span><span class="v"><code>/products</code>, <code>/users</code> — cùng một từ cho danh sách và các phần tử.</span></div>
  <div class="kv"><span class="k">Không động từ trong đường dẫn</span><span class="v"><code>/getProducts</code>, <code>/deleteProduct?id=3</code> lặp lại điều method đã nói (và cái thứ hai là GET làm xoá — Bài 6.2).</span></div>
  <div class="kv"><span class="k">Lồng một cấp</span><span class="v"><code>/posts/17/comments</code> rõ ràng; <code>/users/1/posts/17/comments/4/likes</code> thì không. Phần tử sâu có đường dẫn cấp cao riêng: <code>/comments/4</code>.</span></div>
  <div class="kv"><span class="k">chu-thuong-gach-noi</span><span class="v"><code>/order-items</code>, không phải <code>/OrderItems</code> — đường dẫn phân biệt hoa thường trên đa số máy chủ.</span></div>
  <div class="kv"><span class="k">Hành động không phải CRUD</span><span class="v">Mô hình hoá thành tài nguyên con: <code>POST /orders/9/cancellation</code> hoặc <code>POST /orders/9/cancel</code>. Thực dụng thì được; nhất quán là bắt buộc.</span></div>
</div>

<h3>Bước 2 — tham số đường dẫn hay query string?</h3>
<p>Máy chủ của ta đọc cả hai từ cùng một đối tượng <code>URL</code>: đường dẫn được tách thành các phần, id là phần thứ ba; các tuỳ chọn lấy từ <code>searchParams</code>:</p>
${ma('javascript', CODE['_t6/server.mjs'], [35, 37])}
${ma('javascript', CODE['_t6/server.mjs'], [55, 71])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Đường dẫn</span><span class="lz-t">chỉ đích đồ vật</span><span class="lz-d"><code>/api/products/3</code> — bỏ số 3 là bạn nói tới tài nguyên khác (cả danh sách).</span></div>
<div class="lz-step"><span class="lz-k">Query</span><span class="lz-t">tinh chỉnh cách xem</span><span class="lz-d"><code>?category=office&amp;sort=-price&amp;page=2</code> — cùng tập hợp, đã lọc, sắp, chia trang.</span></div>
<div class="lz-step"><span class="lz-k">Mặc định</span><span class="lz-t">mọi tuỳ chọn đều tuỳ chọn</span><span class="lz-d">Không có <code>page</code> → 1, không có <code>limit</code> → 10, không có <code>sort</code> → thứ tự lưu.</span></div>
</div>
<p>Quy tắc nhanh: nếu bỏ giá trị đi mà trỏ sang một <em>đồ vật</em> khác, đó là tham số đường dẫn; nếu nó chỉ lọc, sắp, tìm hay chia trang cùng một tập hợp, đó là tham số query.</p>

<h3>Bước 3 — lọc, sắp xếp và phân trang (output thật)</h3>
${ra(doan('_t6/out/query', 0, 1, 2))}
<p>Ba quy ước bạn sẽ gặp ở đa số API: tên trường làm bộ lọc (<code>category=office</code>), <code>sort</code> với dấu trừ cho giảm dần, và <code>page</code> + <code>limit</code> kèm <code>total</code> trả về để front-end hiện "trang 2 trên 4". API lớn thường dùng phân trang theo <em>con trỏ</em> (<code>?after=abc123</code>), vẫn đúng khi có phần tử được thêm trong lúc bạn lật trang.</p>

<h3>Bước 4 — mã hoá: URL chở được gì</h3>
<p>URL chỉ được chứa một tập ký tự giới hạn. Dấu cách, <code>&amp;</code>, <code>#</code>, <code>/</code> bên trong một giá trị và mọi chữ ngoài ASCII phải được <em>mã hoá phần trăm</em>:</p>
${ra(doan('_t6/out/query', 3, 4))}
<p>curl từ chối dấu cách trần. Thanh địa chỉ trình duyệt dễ tính hơn, nhưng mã ghép chuỗi bằng tay sẽ hỏng ngay khi một giá trị chứa <code>&amp;</code> hay <code>#</code>. Hãy để <code>URLSearchParams</code> làm (output Chromium thật):</p>
${ma('javascript', CODE['6-5/tham-so.js'])}
${ra(OUT['6-5/tham-so'])}
<p>Bản "by hand" sẽ gửi <code>q=bút </code> rồi một tham số hỏng tên <code> sổ tay</code>, vì <code>&amp;</code> mở một cặp mới. Form với <code>method="get"</code> cũng mã hoá giúp bạn — trong Chromium, gửi "desk lamp" và "home":</p>
${ra(OUT['_t6/out/form-get'])}
<p>Trong query string, dấu cách có thể viết <code>+</code> (form, <code>URLSearchParams</code>) hoặc <code>%20</code> (<code>encodeURIComponent</code>); máy chủ nhận cả hai. Trong một đoạn <em>đường dẫn</em>, dùng <code>encodeURIComponent</code>: nó mã hoá cả <code>/</code>, nên một giá trị không thể thêm đoạn đường dẫn.</p>

<h3>Bước 5 — mọi giá trị đều đến dưới dạng chuỗi</h3>
${ra(doan('_t6/out/query', 5, 6, 7))}
<p>Ba vấn đề thật trong một khối. <code>/api/products/abc</code> thành <code>Number('abc')</code> = <code>NaN</code> và nhận 404 với câu khó hiểu (bài luyện của Bài 6.3 đổi nó thành 400). <code>limit=abc</code> cũng thành <code>NaN</code>, lọt qua <code>Math.min</code>, và trả danh sách rỗng với <code>"limit":null</code> — không lỗi, chỉ là dữ liệu sai. Chỉ có trần hoạt động: xin 1000 món nhận 50.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin giá trị query là số.</strong> <code>req.query.page</code> trong Express là <code>'2'</code>, không phải <code>2</code>; <code>'2' + 1</code> là <code>'21'</code>. Giá trị thiếu là <code>undefined</code>, khoá lặp có thể thành mảng, và ai cũng gửi được <code>limit=999999</code> để bắt cơ sở dữ liệu trả mọi thứ. Với mỗi tham số: đổi kiểu có chủ ý, kiểm (<code>Number.isInteger</code>, danh sách cho phép cho <code>sort</code>), áp mặc định, áp giới hạn trên, và trả 400 kèm câu rõ ràng khi không hợp lệ.</p></div>

<h3>Bước 6 — id trong URL không phải là quyền</h3>
<p>Hai phiên bản của <code>GET /api/notes/:id</code>. Cả hai đều đòi đăng nhập. Người dùng <code>an</code> xin ghi chú 12 (của An) và ghi chú 13 (của Bình):</p>
${ma('javascript', CODE['_t6/idor.mjs'])}
${ra(OUT['_t6/out/idor'])}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — IDOR (Insecure Direct Object Reference).</strong> Không kiểm chủ sở hữu, đổi 12 thành 13 trên địa chỉ là đọc được ghi chú riêng của người khác. Đăng nhập trả lời "bạn là ai?", không trả lời "bạn có được xem <em>cái này</em> không?". Đây là lỗ hổng nghiêm trọng phổ biến nhất trong API thật (OWASP API Security #1, "Broken Object Level Authorization"). Mọi truy vấn tải tài nguyên theo id đều phải lọc thêm theo thứ người gọi được phép xem — và trả 404 thay vì 403 để khỏi xác nhận rằng ghi chú 13 có tồn tại.</p></div>

<h3>Bước 7 — cả chương trong một request</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Dòng request</span><span class="lz-t">POST /api/products?notify=false HTTP/1.1</span><span class="lz-d">Method (6.2) + đường dẫn kèm query (6.5).</span></div>
<div class="lz-layer"><span class="lz-k">Header</span><span class="lz-t">Content-Type · Accept · Authorization</span><span class="lz-d">Cách đọc phần thân, muốn nhận gì, ai đang hỏi (6.4, Chương 7).</span></div>
<div class="lz-layer"><span class="lz-k">Phần thân</span><span class="lz-t">{"name":"Tape","price":15000}</span><span class="lz-d">JSON, đã stringify (6.4).</span></div>
<div class="lz-layer"><span class="lz-k">Response</span><span class="lz-t">201 Created · Location · JSON</span><span class="lz-d">Mã trạng thái (6.3), header, tài nguyên vừa tạo.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — thiết kế, kiểm tra, bảo vệ</strong></p>
<ol>
<li>Trên giấy, thiết kế URL và method cho một API thư viện nhỏ: sách, tác giả, lượt mượn của một cuốn, trả sách. Chỉ dùng danh từ trong đường dẫn.</li>
<li>Trong máy chủ Chương 6, kiểm <code>limit</code> và <code>page</code>: không phải số nguyên, hoặc nhỏ hơn 1 → 400 <code>{"error":"limit must be a whole number from 1 to 50"}</code>.</li>
<li>Thêm bộ lọc <code>minPrice</code> và cho phép <code>sort=name</code>; từ chối mọi giá trị <code>sort</code> khác bằng 400.</li>
<li>Trong console trình duyệt, dựng <code>/api/products?q=đèn bàn &amp; ghế&amp;page=1</code> bằng <code>URLSearchParams</code> và fetch nó.</li>
<li>Chép <code>idor.mjs</code>, thêm <code>DELETE /api/notes/:id</code>, và bảo đảm <code>an</code> không xoá được ghi chú 13.</li>
</ol>
<p>Gợi ý: <code>const n = Number(value); if (!Number.isInteger(n) || n &lt; 1 || n &gt; 50) …</code>. Danh sách cho phép của sort: <code>['price', '-price', 'name'].includes(sort)</code>.</p>
<p><strong>Xong khi:</strong> thiết kế thư viện không có động từ trong đường dẫn nào; <code>?limit=abc</code> và <code>?page=0</code> trả 400 kèm câu của bạn; <code>?minPrice=50000&amp;sort=name</code> chỉ trả sản phẩm từ 50 000, xếp theo tên; URL đã mã hoá chứa <code>%26</code> ở chỗ dấu <code>&amp;</code> của chữ tìm kiếm; và DELETE ghi chú 13 của <code>an</code> trả 404 trong khi ghi chú 13 vẫn còn với <code>binh</code>. Sau đó làm module Code Lab 6.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">REST</span><span class="v">phong cách thiết kế API: tài nguyên + method.</span></div>
  <div class="kv"><span class="k">resource / collection</span><span class="v">tài nguyên / tập hợp — <code>/products/3</code>, <code>/products</code>.</span></div>
  <div class="kv"><span class="k">path parameter</span><span class="v">tham số đường dẫn — <code>:id</code>, đọc bằng <code>req.params</code>.</span></div>
  <div class="kv"><span class="k">query string</span><span class="v">chuỗi truy vấn — sau dấu <code>?</code>, đọc bằng <code>req.query</code>.</span></div>
  <div class="kv"><span class="k">percent-encoding</span><span class="v">mã hoá phần trăm — <code>%20</code>, <code>%26</code>…</span></div>
  <div class="kv"><span class="k">URLSearchParams</span><span class="v">đối tượng dựng/đọc query string an toàn.</span></div>
  <div class="kv"><span class="k">pagination / cursor</span><span class="v">phân trang theo trang / theo con trỏ.</span></div>
  <div class="kv"><span class="k">validation</span><span class="v">kiểm tra dữ liệu vào — đổi kiểu, kiểm, mặc định, giới hạn.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">truy cập đối tượng bằng id mà không kiểm quyền.</span></div>
  <div class="kv"><span class="k">nested resource</span><span class="v">tài nguyên lồng — <code>/posts/17/comments</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đường dẫn là danh từ số nhiều; method là động từ; lồng một cấp để thể hiện sở hữu.</li>
  <li>Đường dẫn = đồ vật nào; query = lọc, sắp, tìm hay chia trang thế nào — có mặc định.</li>
  <li>Trả <code>total</code> (hoặc con trỏ) kèm danh sách chia trang.</li>
  <li>Đừng bao giờ ghép query string bằng tay: <code>URLSearchParams</code> / <code>encodeURIComponent</code>.</li>
  <li>Mọi giá trị đường dẫn và query là chuỗi: đổi kiểu, kiểm, mặc định, giới hạn, và 400 khi sai.</li>
  <li>Id trong URL không phải quyền: luôn lọc theo chủ sở hữu (IDOR / BOLA).</li>
  <li>Method + đường dẫn + query + header + phần thân → mã + header + phần thân: toàn bộ HTTP.</li>
</ul>
${nguon('📗', 'MDN — URLSearchParams', 'Dựng và đọc query string đúng cách', 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams')}
${nguon('📘', 'OWASP API Security Top 10 — API1: Broken Object Level Authorization', 'Lỗi IDOR, kèm ví dụ thực tế', 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-5-2-dinh-tuyen', title: 'Node.js 5.2 — Định tuyến trong Express', sub: 'Cùng các route đó với req.params và req.query trên máy chủ Express thật', cta: 'Mở bài' })}
</div>
`,
};
