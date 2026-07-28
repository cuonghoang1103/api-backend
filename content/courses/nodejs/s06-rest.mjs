/**
 * Node.js — Chương 6: Thiết kế REST API.
 * Output đo thật: Node v22.21.0, express 5.2.1, zod 4.4.3,
 * PostgreSQL 1.000.000 dòng cho phần phân trang.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 6 — Designing a REST API|||Chương 6 — Thiết kế REST API',
  description: 'Tài nguyên, phương thức, mã trạng thái, validate bằng lược đồ, phân trang đo bằng số thật, và hợp đồng API không làm vỡ client.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Resources, methods and what REST actually means|||6.1 — Tài nguyên, phương thức, và REST thật sự là gì',
      slug: 'nodejs-6-1-tai-nguyen-phuong-thuc',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-1-tai-nguyen-phuong-thuc.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-1-tai-nguyen-phuong-thuc.jpg',
        scenario: 'rest-api',
        durationSeconds: 24,
        caption: { en: "One request end to end: DNS, proxy, middleware, handler, database", vi: "Trọn một request: DNS, proxy, middleware, handler, cơ sở dữ liệu" },
      },
      type: 'VIDEO',
      description: 'Đặt tên URL bằng danh từ, chọn đúng phương thức, và hiểu hai tính chất an toàn (safe) — bất biến (idempotent) bằng thí nghiệm thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Resources, methods, and what REST actually means</h2>
<p class="lead">Chapter 5 gave you the machinery to answer any HTTP request. This chapter is about deciding <em>which</em> requests to answer, and it is the part that outlives the framework: the API you design today will be called by a mobile app in three years, long after this Express version is gone.</p>

<h3>The one idea: nouns, not verbs</h3>
<p>A REST API exposes <strong>resources</strong> — things — and uses HTTP methods as the verbs. Most bad APIs are bad because they put the verb in the URL:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">✗ <code>POST /getNotes</code></span><span class="v">✓ <code>GET /notes</code></span></div>
  <div class="kv"><span class="k">✗ <code>POST /createNote</code></span><span class="v">✓ <code>POST /notes</code></span></div>
  <div class="kv"><span class="k">✗ <code>POST /deleteNote?id=42</code></span><span class="v">✓ <code>DELETE /notes/42</code></span></div>
  <div class="kv"><span class="k">✗ <code>POST /notes/42/updateTitle</code></span><span class="v">✓ <code>PATCH /notes/42</code></span></div>
</div>
<p>Why this matters beyond taste: HTTP already assigns meaning to the methods, and every layer between your client and your server acts on that meaning. A proxy will cache a <code>GET</code> and never cache a <code>POST</code>. A browser will re-issue a <code>GET</code> on a back button without asking, and will warn before re-issuing a <code>POST</code>. A retry policy in a mobile SDK will safely repeat a <code>PUT</code> and refuse to repeat a <code>POST</code>. If your delete is a POST to <code>/deleteNote</code>, none of that machinery can help you — you have hidden the meaning inside a string only your code understands.</p>

<h3>Naming URLs</h3>
<pre><code>GET    /api/v1/notes              <span class="tok-comment"># collection</span>
POST   /api/v1/notes              <span class="tok-comment"># create in the collection</span>
GET    /api/v1/notes/42           <span class="tok-comment"># one item</span>
PATCH  /api/v1/notes/42           <span class="tok-comment"># partial update</span>
PUT    /api/v1/notes/42           <span class="tok-comment"># full replace</span>
DELETE /api/v1/notes/42           <span class="tok-comment"># remove</span>
GET    /api/v1/notes/42/comments  <span class="tok-comment"># sub-collection of an item</span>
POST   /api/v1/notes/42/comments  <span class="tok-comment"># create inside it</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Plural nouns</span><span class="v"><code>/notes</code>, not <code>/note</code>. Consistency is worth more than grammar debates — pick plural and never think again.</span></div>
  <div class="kv"><span class="k">Lower case, hyphens</span><span class="v"><code>/note-templates</code>, not <code>/noteTemplates</code>. Paths are case-sensitive on the wire and camelCase in a URL invites typo bugs.</span></div>
  <div class="kv"><span class="k">Nest at most one level</span><span class="v"><code>/notes/42/comments</code> is fine. <code>/users/7/notes/42/comments/9/likes</code> is a URL nobody can read — expose <code>/comments/9/likes</code> instead.</span></div>
  <div class="kv"><span class="k">Filters go in the query</span><span class="v"><code>/notes?tag=work&amp;pinned=true</code>, not <code>/notes/tag/work/pinned/true</code>. Filters are optional and combinable; path segments are neither.</span></div>
</div>
<div class="callout">Some actions genuinely are not CRUD: publishing, archiving, sending, retrying. The pragmatic pattern is a sub-resource that reads like a noun — <code>POST /notes/42/publication</code> — or, where that gets contrived, an explicit action endpoint like <code>POST /notes/42/publish</code>. Purists dislike the second form; a team that ships prefers a clear verb over a tortured noun. Just keep it rare and keep it consistent.</div>

<h3>Safe and idempotent — the two properties that matter</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Safe</span><span class="v">Does not change anything. <code>GET</code>, <code>HEAD</code>, <code>OPTIONS</code>. Calling it a thousand times must be harmless.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Calling it N times leaves the same state as calling it once. <code>GET</code>, <code>PUT</code>, <code>DELETE</code> — and NOT <code>POST</code>.</span></div>
</div>
<p>That is not a definition to memorise; it is a property you can test. Same server, three experiments:</p>
<pre><code><span class="tok-comment"># POST twice with the same body</span>
curl -X POST /notes -d '{"title":"A"}'
curl -X POST /notes -d '{"title":"A"}'</code></pre>
<div class="out">{"id":1,"title":"A","version":1}
{"id":2,"title":"A","version":1}     ← two notes exist now</div>
<pre><code><span class="tok-comment"># PUT twice with the same body</span>
curl -X PUT /settings/theme -d '{"theme":"dark"}'
curl -X PUT /settings/theme -d '{"theme":"dark"}'</code></pre>
<div class="out">{"theme":"dark"}
{"theme":"dark"}                     ← same state, no duplicate</div>
<pre><code><span class="tok-comment"># DELETE twice</span>
curl -X DELETE /notes/1
curl -X DELETE /notes/1</code></pre>
<div class="out">first  : 204
second : 404</div>
<div class="callout ok">Different status codes, same <em>state</em> — the note is gone either way, so <code>DELETE</code> is still idempotent. Both 404 and 204 on the second call are defensible; 404 is more informative, 204 is friendlier to clients that retry. Pick one and document it.</div>
<div class="pitfall">This is why "the user got charged twice" happens. A mobile client on a flaky network sends <code>POST /payments</code>, the response is lost, the SDK retries — and a second payment is created, because POST is not idempotent and the server has no way to recognise the repeat. Lesson 6.5 fixes it properly with an <code>Idempotency-Key</code>. Until then, never make a retry-prone client call a non-idempotent endpoint.</div>

<h3>PATCH vs PUT — and the update everyone gets wrong</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PUT</span><span class="v">"Make the resource be exactly this." Fields you omit are <strong>erased</strong>. Idempotent by definition.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">"Change these fields, leave the rest." Fields you omit are untouched. Usually what a form wants.</span></div>
</div>
<p>Use PUT and you inherit a classic bug. Two people open the same note; both send a full object back:</p>
<div class="out">A reads : {"id":1,"title":"Original","body":"original content"}
B reads : {"id":1,"title":"Original","body":"original content"}

A changes the title, sends the WHOLE object:
  → {"id":1,"title":"A changed the title","body":"original content"}

B changes the body, sends the WHOLE object (based on the copy from BEFORE A's edit):
  → {"id":1,"title":"Original","body":"B changed the content"}

A's change is GONE.</div>
<div class="pitfall">This is the <strong>lost update</strong> problem, and note what did <em>not</em> happen: no error, no conflict, no log line. The server did exactly what it was told, twice. PATCH reduces the damage (B would only have sent <code>body</code>) but does not fix it — two people editing the same field still overwrite each other silently. The real fix is optimistic concurrency with <code>ETag</code> + <code>If-Match</code>, which lesson 6.5 demonstrates returning a 412.</div>

<h3>Two things Express gives you for free</h3>
<pre><code>curl -I /notes/1                       <span class="tok-comment"># HEAD</span></code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 50
(no body)</div>
<p>You never wrote a HEAD route. Express answers HEAD from your GET route, runs the same handler, and drops the body — so <code>Content-Length</code> is correct without transferring anything. Clients use it to check existence or freshness cheaply.</p>
<pre><code>curl -i -X OPTIONS /only-get</code></pre>
<div class="out">HTTP/1.1 200 OK
Allow: GET, HEAD</div>
<div class="callout warn">What Express does <em>not</em> do for free: 405. Send <code>DELETE</code> to a path that only has a GET route and you get <strong>404</strong>, not <code>405 Method Not Allowed</code> — because Express matches on method+path together and simply finds nothing. It is technically defensible and practically confusing: a client debugging "404 on an endpoint I can see working in the browser" is almost always sending the wrong method. Worth remembering the next time a frontend developer swears the URL is right.</div>
<div class="note-ct">The URLs on cuongthai.com follow exactly the table above, with one deliberate exception: a handful of action endpoints such as restoring a deleted conversation, which reads as <code>POST /threads/:id/restore</code>. A pure-noun version of that would be worse to read and worse to search for in the codebase. Consistency is the goal; purity is not.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — RESTful API Design and Implementation</span><span class="lc-sub">10 exercises on resources, methods and API structure.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Tài nguyên, phương thức, và REST thật sự là gì</h2>
<p class="lead">Chương 5 đã cho bạn bộ máy để trả lời bất kỳ request HTTP nào. Chương này bàn chuyện quyết định <em>nên</em> trả lời những request nào, và đây là phần sống lâu hơn cả framework: cái API bạn thiết kế hôm nay sẽ được một ứng dụng di động gọi tới sau ba năm, rất lâu sau khi phiên bản Express này không còn.</p>

<h3>Ý tưởng duy nhất: danh từ, không phải động từ</h3>
<p>Một REST API phơi ra các <strong>tài nguyên</strong> — các "thứ" — và dùng phương thức HTTP làm động từ. Phần lớn API tệ đều tệ vì nhét động từ vào URL:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">✗ <code>POST /getNotes</code></span><span class="v">✓ <code>GET /notes</code></span></div>
  <div class="kv"><span class="k">✗ <code>POST /createNote</code></span><span class="v">✓ <code>POST /notes</code></span></div>
  <div class="kv"><span class="k">✗ <code>POST /deleteNote?id=42</code></span><span class="v">✓ <code>DELETE /notes/42</code></span></div>
  <div class="kv"><span class="k">✗ <code>POST /notes/42/updateTitle</code></span><span class="v">✓ <code>PATCH /notes/42</code></span></div>
</div>
<p>Vì sao chuyện này quan trọng hơn chuyện thẩm mỹ: HTTP đã gán sẵn ý nghĩa cho các phương thức, và mọi tầng nằm giữa client với server của bạn đều hành động dựa trên ý nghĩa đó. Một proxy sẽ cache <code>GET</code> và không bao giờ cache <code>POST</code>. Trình duyệt sẽ tự gửi lại <code>GET</code> khi bấm nút Back mà không hỏi, nhưng sẽ cảnh báo trước khi gửi lại <code>POST</code>. Chính sách thử lại trong một SDK di động sẽ yên tâm lặp lại <code>PUT</code> và từ chối lặp lại <code>POST</code>. Nếu lệnh xoá của bạn là POST tới <code>/deleteNote</code> thì không bộ máy nào ở trên giúp được bạn — bạn đã giấu ý nghĩa vào trong một chuỗi mà chỉ code của bạn hiểu.</p>

<h3>Đặt tên URL</h3>
<pre><code>GET    /api/v1/notes              <span class="tok-comment"># tập hợp</span>
POST   /api/v1/notes              <span class="tok-comment"># tạo trong tập hợp</span>
GET    /api/v1/notes/42           <span class="tok-comment"># một phần tử</span>
PATCH  /api/v1/notes/42           <span class="tok-comment"># cập nhật một phần</span>
PUT    /api/v1/notes/42           <span class="tok-comment"># thay toàn bộ</span>
DELETE /api/v1/notes/42           <span class="tok-comment"># xoá</span>
GET    /api/v1/notes/42/comments  <span class="tok-comment"># tập hợp con của một phần tử</span>
POST   /api/v1/notes/42/comments  <span class="tok-comment"># tạo bên trong nó</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Danh từ số nhiều</span><span class="v"><code>/notes</code>, không phải <code>/note</code>. Sự nhất quán đáng giá hơn mấy cuộc tranh cãi ngữ pháp — chọn số nhiều rồi thôi không nghĩ nữa.</span></div>
  <div class="kv"><span class="k">Chữ thường, nối bằng gạch ngang</span><span class="v"><code>/note-templates</code>, không phải <code>/noteTemplates</code>. Đường dẫn phân biệt hoa thường trên đường truyền, và camelCase trong URL là mời gọi lỗi gõ nhầm.</span></div>
  <div class="kv"><span class="k">Lồng nhiều nhất một cấp</span><span class="v"><code>/notes/42/comments</code> thì ổn. <code>/users/7/notes/42/comments/9/likes</code> là cái URL không ai đọc nổi — hãy phơi ra <code>/comments/9/likes</code> thay vì vậy.</span></div>
  <div class="kv"><span class="k">Bộ lọc nằm ở query</span><span class="v"><code>/notes?tag=work&amp;pinned=true</code>, không phải <code>/notes/tag/work/pinned/true</code>. Bộ lọc thì tuỳ chọn và kết hợp được; còn đoạn đường dẫn thì không được cả hai.</span></div>
</div>
<div class="callout">Có những hành động thật sự không phải CRUD: xuất bản, lưu trữ, gửi đi, thử lại. Cách làm thực dụng là dựng một tài nguyên con đọc lên nghe như danh từ — <code>POST /notes/42/publication</code> — hoặc, ở chỗ nào làm vậy thành gượng ép, thì dùng thẳng một endpoint hành động kiểu <code>POST /notes/42/publish</code>. Người theo trường phái thuần khiết không ưa dạng thứ hai; còn một đội cần ra sản phẩm thì thích một động từ rõ ràng hơn là một danh từ vặn vẹo. Chỉ cần dùng ít và dùng nhất quán.</div>

<h3>An toàn và bất biến — hai tính chất đáng nhớ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">An toàn (safe)</span><span class="v">Không thay đổi gì cả. <code>GET</code>, <code>HEAD</code>, <code>OPTIONS</code>. Gọi một nghìn lần vẫn phải vô hại.</span></div>
  <div class="kv"><span class="k">Bất biến (idempotent)</span><span class="v">Gọi N lần để lại đúng trạng thái như gọi một lần. <code>GET</code>, <code>PUT</code>, <code>DELETE</code> — và KHÔNG phải <code>POST</code>.</span></div>
</div>
<p>Đó không phải định nghĩa để học thuộc; đó là tính chất bạn thử được. Cùng một server, ba thí nghiệm:</p>
<pre><code><span class="tok-comment"># POST hai lần với cùng một body</span>
curl -X POST /notes -d '{"title":"A"}'
curl -X POST /notes -d '{"title":"A"}'</code></pre>
<div class="out">{"id":1,"title":"A","version":1}
{"id":2,"title":"A","version":1}     ← giờ tồn tại hai ghi chú</div>
<pre><code><span class="tok-comment"># PUT hai lần với cùng một body</span>
curl -X PUT /settings/theme -d '{"theme":"dark"}'
curl -X PUT /settings/theme -d '{"theme":"dark"}'</code></pre>
<div class="out">{"theme":"dark"}
{"theme":"dark"}                     ← cùng một trạng thái, không nhân bản</div>
<pre><code><span class="tok-comment"># DELETE hai lần</span>
curl -X DELETE /notes/1
curl -X DELETE /notes/1</code></pre>
<div class="out">lần 1 : 204
lần 2 : 404</div>
<div class="callout ok">Mã trạng thái khác nhau, nhưng <em>trạng thái</em> thì như nhau — ghi chú biến mất trong cả hai trường hợp, nên <code>DELETE</code> vẫn là bất biến. Trả 404 hay 204 ở lần thứ hai đều bảo vệ được: 404 cho nhiều thông tin hơn, 204 thì dễ chịu hơn với client hay thử lại. Chọn một và ghi vào tài liệu.</div>
<div class="pitfall">Đây chính là lý do có chuyện "khách hàng bị trừ tiền hai lần". Một client di động trên mạng chập chờn gửi <code>POST /payments</code>, phản hồi bị mất, SDK thử lại — và một giao dịch thứ hai được tạo ra, vì POST không bất biến còn server thì không có cách nào nhận ra đó là lần lặp. Bài 6.5 sẽ chữa tận gốc bằng <code>Idempotency-Key</code>. Từ giờ tới đó: đừng bao giờ để một client hay thử lại gọi vào một endpoint không bất biến.</div>

<h3>PATCH và PUT — và cú cập nhật ai cũng làm sai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PUT</span><span class="v">"Hãy làm cho tài nguyên đúng bằng cái này." Trường nào bạn không gửi sẽ bị <strong>xoá trắng</strong>. Bất biến theo đúng định nghĩa.</span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">"Đổi mấy trường này, phần còn lại giữ nguyên." Trường không gửi thì không đụng tới. Thường là thứ mà một cái form cần.</span></div>
</div>
<p>Dùng PUT là bạn thừa hưởng luôn một con bug kinh điển. Hai người cùng mở một ghi chú; cả hai gửi trả về nguyên object:</p>
<div class="out">A đọc được : {"id":1,"title":"Bản gốc","body":"nội dung gốc"}
B đọc được : {"id":1,"title":"Bản gốc","body":"nội dung gốc"}

A đổi tiêu đề, gửi lên CẢ object:
  → {"id":1,"title":"A đổi tiêu đề","body":"nội dung gốc"}

B đổi nội dung, gửi lên CẢ object (dựa trên bản chép từ TRƯỚC khi A sửa):
  → {"id":1,"title":"Bản gốc","body":"B đổi nội dung"}

Thay đổi của A đã BIẾN MẤT.</div>
<div class="pitfall">Đây là vấn đề <strong>mất bản ghi (lost update)</strong>, và hãy để ý điều đã <em>không</em> xảy ra: không lỗi, không xung đột, không một dòng log. Server làm đúng y những gì được bảo, hai lần. PATCH làm giảm thiệt hại (B sẽ chỉ gửi mỗi <code>body</code>) nhưng không chữa được: hai người cùng sửa một trường vẫn đè lên nhau trong im lặng. Cách chữa thật sự là kiểm soát đồng thời lạc quan bằng <code>ETag</code> + <code>If-Match</code>, bài 6.5 sẽ trình diễn nó trả về mã 412.</div>

<h3>Hai thứ Express tặng bạn miễn phí</h3>
<pre><code>curl -I /notes/1                       <span class="tok-comment"># HEAD</span></code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 50
(không có body)</div>
<p>Bạn chưa hề viết route HEAD nào. Express trả lời HEAD bằng chính route GET của bạn, chạy đúng handler đó, rồi bỏ phần body đi — nên <code>Content-Length</code> vẫn đúng mà không phải truyền gì. Client dùng nó để kiểm tra sự tồn tại hoặc độ mới với chi phí rẻ.</p>
<pre><code>curl -i -X OPTIONS /only-get</code></pre>
<div class="out">HTTP/1.1 200 OK
Allow: GET, HEAD</div>
<div class="callout warn">Còn thứ Express <em>không</em> tặng miễn phí: mã 405. Gửi <code>DELETE</code> tới một đường dẫn chỉ có route GET thì bạn nhận <strong>404</strong>, chứ không phải <code>405 Method Not Allowed</code> — vì Express khớp method và path cùng lúc, và đơn giản là không tìm thấy gì. Về lý thì bảo vệ được, về thực tế thì gây rối: một người đang gỡ lỗi "404 ở cái endpoint mà tôi mở trình duyệt thấy chạy ngon" gần như luôn là đang gửi sai phương thức. Đáng nhớ cho lần sau khi một bạn frontend thề sống thề chết là URL đúng rồi.</div>
<div class="note-ct">Các URL trên cuongthai.com đi theo đúng bảng ở trên, với một ngoại lệ cố ý: vài endpoint hành động chẳng hạn khôi phục một cuộc trò chuyện đã xoá, viết là <code>POST /threads/:id/restore</code>. Một phiên bản thuần danh từ cho việc đó vừa khó đọc hơn vừa khó tìm hơn trong code base. Mục tiêu là sự nhất quán, không phải sự thuần khiết.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — Thiết kế &amp; hiện thực REST API</span><span class="lc-sub">10 bài tập về tài nguyên, phương thức và cấu trúc API.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Status codes and response shape|||6.2 — Mã trạng thái và hình dạng phản hồi',
      slug: 'nodejs-6-2-ma-trang-thai',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-2-ma-trang-thai.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-2-ma-trang-thai.jpg',
        scenario: 'rest-api',
        durationSeconds: 21,
        caption: { en: "Where each status code actually stops the chain", vi: "Mỗi mã trạng thái thực sự chết ở chặng nào" },
      },
      type: 'VIDEO',
      description: 'Chọn đúng mã trong 2xx/4xx/5xx, phân biệt 401/403 và 409/422, và thiết kế một hình dạng JSON mà frontend chỉ phải học một lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Status codes and response shape</h2>
<p class="lead">The status code is the first thing every client reads, and for most of them it is the <em>only</em> thing they branch on. Getting it right costs nothing; getting it wrong means a client that retries a permanent failure forever, or gives up on a temporary one.</p>

<h3>The codes you actually need</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">200 OK</span><span class="v">Successful GET, PATCH, PUT. Body contains the resource.</span></div>
  <div class="kv"><span class="k">201 Created</span><span class="v">POST created something. Include a <code>Location</code> header and the new resource.</span></div>
  <div class="kv"><span class="k">204 No Content</span><span class="v">Success with nothing to say — DELETE. The body MUST be empty.</span></div>
  <div class="kv"><span class="k">400 Bad Request</span><span class="v">The request itself is malformed — unparseable JSON, missing required header.</span></div>
  <div class="kv"><span class="k">401 Unauthorized</span><span class="v">"I do not know who you are." No token, expired token, bad token.</span></div>
  <div class="kv"><span class="k">403 Forbidden</span><span class="v">"I know who you are and you may not do this." Never use 401 for this.</span></div>
  <div class="kv"><span class="k">404 Not Found</span><span class="v">No such resource. Also the right answer for "exists but you may not even know it exists".</span></div>
  <div class="kv"><span class="k">409 Conflict</span><span class="v">Valid request, but it collides with current state — duplicate email, already published.</span></div>
  <div class="kv"><span class="k">422 Unprocessable</span><span class="v">Syntactically fine, semantically invalid — title empty, price negative.</span></div>
  <div class="kv"><span class="k">429 Too Many Requests</span><span class="v">Rate limited. Always pair it with a <code>Retry-After</code> header.</span></div>
  <div class="kv"><span class="k">500 Internal</span><span class="v">Our bug. Never use it for a bad request — a 500 tells the client "try again", which is wrong.</span></div>
  <div class="kv"><span class="k">503 Unavailable</span><span class="v">Temporarily down — dependency unreachable, shutting down. This one really does mean "retry later".</span></div>
</div>

<h3>The three distinctions people get wrong</h3>
<h4>401 vs 403</h4>
<div class="out">401 = authentication failed  → the client should log in / refresh the token
403 = authorisation failed   → logging in again will NOT help</div>
<p>Getting this backwards has a concrete cost: a frontend with a 401 interceptor (like the one in lesson 5.1's stack) will try to refresh the token and retry. Answer 401 for a permissions problem and you have built an infinite refresh loop that hammers your auth endpoint.</p>
<h4>400 vs 422</h4>
<div class="out">400 = I could not even parse this      ({title:} → not JSON)
422 = I parsed it, the values are wrong  ({"title":""} → empty)</div>
<p>Some teams use 400 for everything and it is a defensible simplification. What is not defensible is using them randomly — the client cannot tell "fix your code" from "fix your input".</p>
<h4>409 vs 422</h4>
<div class="out">422 = the data is invalid on its own    (email has no @)
409 = the data is fine, the WORLD disagrees (that email is already registered)</div>
<div class="callout ok">The practical test for 409: could this exact request have succeeded a minute ago, or succeed a minute from now? If yes, it is a conflict with state, not a validation error. Chapter 7 maps Prisma's unique-constraint error <code>P2002</code> onto 409 for precisely this reason.</div>

<h3>201 done properly</h3>
<pre><code>res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>)
   .<span class="tok-fn">location</span>(\`/api/v1/notes/\${note.id}\`)
   .<span class="tok-fn">json</span>(note);</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /api/v1/notes/1
Content-Type: application/json; charset=utf-8

{"id":1,"title":"Learning Express","body":"chapter 5","createdAt":"…"}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Return the created object</span><span class="v">The client needs the server-generated <code>id</code> and <code>createdAt</code>. Returning <code>{"ok":true}</code> forces an extra round trip.</span></div>
  <div class="kv"><span class="k">Send Location</span><span class="v">Cheap, standard, and it tells any generic client where the thing now lives.</span></div>
  <div class="kv"><span class="k">204 means EMPTY</span><span class="v"><code>res.status(204).json({ok:true})</code> is a contradiction — a body with "no content". Use <code>res.status(204).end()</code>.</span></div>
</div>

<h3>One response shape, decided once</h3>
<p>Two decisions, and the only wrong answer is "different per endpoint".</p>
<pre><code><span class="tok-comment">// Success — the resource itself, or a collection envelope</span>
{ "id": 1, "title": "…" }
{ "items": [ … ], "page": 1, "limit": 10, "total": 128 }

<span class="tok-comment">// Error — ALWAYS this shape, for every 4xx and 5xx</span>
{ "error": { "code": "NOTE_NOT_FOUND", "message": "Note 42 does not exist" } }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">A stable <code>code</code></span><span class="v">The client branches on <code>code</code>, never on <code>message</code>. Messages get rewritten and translated; codes are a contract.</span></div>
  <div class="kv"><span class="k">A human <code>message</code></span><span class="v">For your logs and for developers. It is not UI text — the frontend maps the code to its own translated string.</span></div>
  <div class="kv"><span class="k">Optional <code>fields</code></span><span class="v">For validation errors, one entry per bad field. Lesson 6.3 builds this from a schema automatically.</span></div>
  <div class="kv"><span class="k">Never a 200 with an error inside</span><span class="v"><code>200 {"success":false}</code> defeats every HTTP-aware layer: monitoring sees zero errors, retries never trigger, caches store the failure.</span></div>
</div>
<div class="pitfall">The envelope question — <code>{data: …}</code> around every success or not — has no right answer, but it must be answered once. Half-enveloped APIs are the ones where the frontend ends up writing <code>const note = res.data.data ?? res.data</code>, and that line eventually appears in forty files.</div>

<h3>Field conventions worth fixing early</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Timestamps in ISO 8601 UTC</span><span class="v"><code>"2026-07-27T15:00:00.000Z"</code> — exactly what <code>JSON.stringify</code> does to a <code>Date</code>. Never send a local-time string, never send a raw epoch number without saying so.</span></div>
  <div class="kv"><span class="k">Money in the smallest unit, as an integer</span><span class="v"><code>{"amount": 250000, "currency": "VND"}</code>. Floats and money do not mix — that is a lesson 1.1 problem arriving in your invoices.</span></div>
  <div class="kv"><span class="k">Booleans named for what is true</span><span class="v"><code>isPublished</code>, not <code>status: 1</code>. And avoid negatives: <code>isDisabled: false</code> is a double negative waiting to be misread.</span></div>
  <div class="kv"><span class="k">Big ids as strings</span><span class="v">JavaScript loses precision above 2^53. If your ids are 64-bit, serialise them as strings — silently rounded ids are a very expensive bug to find.</span></div>
  <div class="kv"><span class="k">Explicit null over missing</span><span class="v">A field that is sometimes absent forces every client to handle two shapes. Send <code>"body": null</code>.</span></div>
</div>
<div class="note-ct">Every API on this site answers errors with <code>{ error: { code, message } }</code> and nothing else, which is why the frontend has exactly one axios interceptor: it reads the status for the transport decision (401 → refresh and retry once) and the <code>code</code> for the UI decision. Endpoints added years apart still work with that one interceptor — that is what the consistency buys.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — RESTful API Design and Implementation</span><span class="lc-sub">Status codes, response shapes and REST conventions.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Mã trạng thái và hình dạng phản hồi</h2>
<p class="lead">Mã trạng thái là thứ đầu tiên mọi client đọc, và với phần lớn client thì đó là thứ <em>duy nhất</em> chúng dùng để rẽ nhánh. Chọn đúng thì không tốn gì; chọn sai nghĩa là một client cứ thử lại mãi một lỗi vĩnh viễn, hoặc bỏ cuộc trước một lỗi chỉ tạm thời.</p>

<h3>Những mã bạn thật sự cần</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">200 OK</span><span class="v">GET, PATCH, PUT thành công. Body chứa tài nguyên.</span></div>
  <div class="kv"><span class="k">201 Created</span><span class="v">POST đã tạo ra một thứ. Kèm header <code>Location</code> và tài nguyên mới.</span></div>
  <div class="kv"><span class="k">204 No Content</span><span class="v">Thành công mà không có gì để nói — DELETE. Body BẮT BUỘC rỗng.</span></div>
  <div class="kv"><span class="k">400 Bad Request</span><span class="v">Bản thân request bị hỏng — JSON không phân tích được, thiếu header bắt buộc.</span></div>
  <div class="kv"><span class="k">401 Unauthorized</span><span class="v">"Tôi không biết bạn là ai." Không có token, token hết hạn, token sai.</span></div>
  <div class="kv"><span class="k">403 Forbidden</span><span class="v">"Tôi biết bạn là ai và bạn không được làm việc này." Đừng bao giờ dùng 401 cho tình huống này.</span></div>
  <div class="kv"><span class="k">404 Not Found</span><span class="v">Không có tài nguyên đó. Cũng là câu trả lời đúng cho "có tồn tại nhưng bạn thậm chí không được biết là nó tồn tại".</span></div>
  <div class="kv"><span class="k">409 Conflict</span><span class="v">Request hợp lệ nhưng đụng với trạng thái hiện tại — email trùng, bài đã xuất bản rồi.</span></div>
  <div class="kv"><span class="k">422 Unprocessable</span><span class="v">Cú pháp thì ổn, ngữ nghĩa thì sai — tiêu đề rỗng, giá âm.</span></div>
  <div class="kv"><span class="k">429 Too Many Requests</span><span class="v">Bị giới hạn tần suất. Luôn đi kèm header <code>Retry-After</code>.</span></div>
  <div class="kv"><span class="k">500 Internal</span><span class="v">Bug của mình. Đừng bao giờ dùng cho một request sai — mã 500 bảo client "thử lại đi", mà như thế là sai.</span></div>
  <div class="kv"><span class="k">503 Unavailable</span><span class="v">Tạm thời chết — không gọi được dịch vụ phụ thuộc, đang tắt máy. Cái này mới thật sự có nghĩa "lát nữa thử lại".</span></div>
</div>

<h3>Ba chỗ phân biệt mà người ta hay nhầm</h3>
<h4>401 và 403</h4>
<div class="out">401 = xác thực thất bại  → client nên đăng nhập lại / làm mới token
403 = phân quyền thất bại → đăng nhập lại cũng KHÔNG giúp được gì</div>
<p>Nhầm hai cái này có một cái giá rất cụ thể: một frontend có bộ chặn 401 (như trong chồng công nghệ ở bài 5.1) sẽ thử làm mới token rồi gọi lại. Trả 401 cho một vấn đề quyền hạn là bạn vừa dựng nên một vòng lặp làm mới token vô tận nện thẳng vào endpoint xác thực của mình.</p>
<h4>400 và 422</h4>
<div class="out">400 = tôi còn không phân tích nổi cái này  ({title:} → không phải JSON)
422 = tôi phân tích được, nhưng giá trị sai  ({"title":""} → rỗng)</div>
<p>Vài đội dùng 400 cho tất cả, và đó là một sự đơn giản hoá bảo vệ được. Cái không bảo vệ được là dùng chúng một cách ngẫu hứng — client không thể phân biệt "hãy sửa code của bạn" với "hãy sửa dữ liệu bạn nhập".</p>
<h4>409 và 422</h4>
<div class="out">422 = tự thân dữ liệu đã sai         (email không có @)
409 = dữ liệu ổn, nhưng THẾ GIỚI không đồng ý (email đó đã có người đăng ký)</div>
<div class="callout ok">Phép thử thực dụng cho 409: đúng cái request này có thể đã thành công một phút trước, hoặc sẽ thành công một phút nữa không? Nếu có thì đó là xung đột với trạng thái, không phải lỗi dữ liệu. Chương 7 ánh xạ lỗi vi phạm ràng buộc duy nhất <code>P2002</code> của Prisma sang 409 chính vì lý do này.</div>

<h3>Trả 201 cho đúng cách</h3>
<pre><code>res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>)
   .<span class="tok-fn">location</span>(\`/api/v1/notes/\${note.id}\`)
   .<span class="tok-fn">json</span>(note);</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /api/v1/notes/1
Content-Type: application/json; charset=utf-8

{"id":1,"title":"Học Express","body":"chương 5","createdAt":"…"}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Trả về đối tượng vừa tạo</span><span class="v">Client cần <code>id</code> và <code>createdAt</code> do server sinh ra. Trả <code>{"ok":true}</code> là ép nó phải gọi thêm một vòng nữa.</span></div>
  <div class="kv"><span class="k">Gửi kèm Location</span><span class="v">Rẻ, chuẩn mực, và nó cho mọi client tổng quát biết cái vừa tạo giờ nằm ở đâu.</span></div>
  <div class="kv"><span class="k">204 nghĩa là RỖNG</span><span class="v"><code>res.status(204).json({ok:true})</code> là một câu tự mâu thuẫn — có body trong một mã "không nội dung". Hãy dùng <code>res.status(204).end()</code>.</span></div>
</div>

<h3>Một hình dạng phản hồi, quyết một lần</h3>
<p>Hai quyết định, và câu trả lời sai duy nhất là "mỗi endpoint một kiểu".</p>
<pre><code><span class="tok-comment">// Thành công — chính tài nguyên đó, hoặc một vỏ bọc cho tập hợp</span>
{ "id": 1, "title": "…" }
{ "items": [ … ], "page": 1, "limit": 10, "total": 128 }

<span class="tok-comment">// Lỗi — LUÔN hình dạng này, cho mọi 4xx và 5xx</span>
{ "error": { "code": "NOTE_NOT_FOUND", "message": "Không tìm thấy ghi chú 42" } }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Một <code>code</code> ổn định</span><span class="v">Client rẽ nhánh theo <code>code</code>, không bao giờ theo <code>message</code>. Câu chữ thì bị viết lại và bị dịch; còn mã là một bản hợp đồng.</span></div>
  <div class="kv"><span class="k">Một <code>message</code> cho người</span><span class="v">Dành cho log của bạn và cho lập trình viên. Nó không phải chữ hiển thị trên giao diện — frontend tự ánh xạ mã sang chuỗi đã dịch của nó.</span></div>
  <div class="kv"><span class="k">Tuỳ chọn <code>fields</code></span><span class="v">Cho lỗi kiểm tra dữ liệu, mỗi trường sai một mục. Bài 6.3 sẽ dựng phần này tự động từ lược đồ.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ trả 200 kèm lỗi bên trong</span><span class="v"><code>200 {"success":false}</code> vô hiệu hoá mọi tầng hiểu HTTP: giám sát thấy không có lỗi nào, cơ chế thử lại không kích hoạt, cache thì lưu lại chính cái thất bại đó.</span></div>
</div>
<div class="pitfall">Câu hỏi về vỏ bọc — có bọc <code>{data: …}</code> quanh mọi phản hồi thành công hay không — không có đáp án đúng, nhưng bắt buộc phải trả lời một lần cho xong. Những API bọc nửa vời chính là nơi frontend cuối cùng phải viết <code>const note = res.data.data ?? res.data</code>, và dòng đó rồi sẽ xuất hiện trong bốn mươi file.</div>

<h3>Quy ước đặt trường nên chốt sớm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Thời gian theo ISO 8601 UTC</span><span class="v"><code>"2026-07-27T15:00:00.000Z"</code> — đúng thứ <code>JSON.stringify</code> làm với một <code>Date</code>. Đừng gửi chuỗi giờ địa phương, cũng đừng gửi số epoch trần mà không nói rõ.</span></div>
  <div class="kv"><span class="k">Tiền tính bằng đơn vị nhỏ nhất, kiểu số nguyên</span><span class="v"><code>{"amount": 250000, "currency": "VND"}</code>. Số thực và tiền bạc không đi chung được — đó là bài toán của bài 1.1 đang tìm đường vào hoá đơn của bạn.</span></div>
  <div class="kv"><span class="k">Boolean đặt tên theo điều đang đúng</span><span class="v"><code>isPublished</code>, không phải <code>status: 1</code>. Và tránh phủ định: <code>isDisabled: false</code> là một câu phủ định kép đang chờ bị đọc nhầm.</span></div>
  <div class="kv"><span class="k">ID lớn thì gửi dạng chuỗi</span><span class="v">JavaScript mất chính xác trên mốc 2^53. Nếu id của bạn là 64-bit, hãy tuần tự hoá thành chuỗi — id bị làm tròn âm thầm là một con bug cực kỳ đắt để tìm ra.</span></div>
  <div class="kv"><span class="k">Null tường minh hơn là thiếu trường</span><span class="v">Một trường lúc có lúc không buộc mọi client phải xử lý hai hình dạng. Hãy gửi <code>"body": null</code>.</span></div>
</div>
<div class="note-ct">Mọi API trên website này trả lỗi bằng đúng <code>{ error: { code, message } }</code> và không gì khác, nhờ vậy frontend chỉ có duy nhất một bộ chặn axios: nó đọc mã trạng thái để quyết định ở tầng vận chuyển (401 → làm mới token và gọi lại một lần) và đọc <code>code</code> để quyết định ở tầng giao diện. Những endpoint viết cách nhau nhiều năm vẫn chạy được với đúng bộ chặn đó — đó chính là thứ mà sự nhất quán mua được.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — Thiết kế &amp; hiện thực REST API</span><span class="lc-sub">Mã trạng thái, hình dạng phản hồi và quy ước REST.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Validation with a schema|||6.3 — Kiểm tra dữ liệu bằng lược đồ',
      slug: 'nodejs-6-3-validate-schema',
      type: 'VIDEO',
      description: 'Thay validate viết tay bằng zod: một lược đồ khai báo luật, ép kiểu query, chặn mass-assignment và sinh lỗi nhất quán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Validation with a schema</h2>
<p class="lead">Lesson 5.5 validated by hand: <code>if (typeof title !== 'string' || title.trim() === '')</code>. That works for one field. For a real endpoint with eight fields, hand validation becomes a wall of ifs where each one reports errors slightly differently and half of them are missing.</p>

<h3>The rule this lesson enforces</h3>
<div class="callout danger"><strong>Everything from the client is hostile until proven otherwise</strong> — body, query, params, headers. Not because every user is an attacker, but because the honest majority send you malformed data by accident, and the code path is the same. The question is never "will bad input arrive?" — it is "does bad input hit my database or my validator first?"</div>

<h3>A schema replaces the wall of ifs</h3>
<pre><code>npm i zod</code></pre>
<pre><code><span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;      <span class="tok-comment">// zod 4.4.3</span>

<span class="tok-keyword">const</span> CreateNote = z.<span class="tok-fn">object</span>({
  title:  z.<span class="tok-fn">string</span>().<span class="tok-fn">min</span>(<span class="tok-number">1</span>, <span class="tok-string">'title must not be empty'</span>).<span class="tok-fn">max</span>(<span class="tok-number">200</span>),
  body:   z.<span class="tok-fn">string</span>().<span class="tok-fn">max</span>(<span class="tok-number">10_000</span>).<span class="tok-fn">default</span>(<span class="tok-string">''</span>),
  tags:   z.<span class="tok-fn">array</span>(z.<span class="tok-fn">string</span>()).<span class="tok-fn">max</span>(<span class="tok-number">5</span>).<span class="tok-fn">optional</span>(),
  pinned: z.<span class="tok-fn">boolean</span>().<span class="tok-fn">default</span>(<span class="tok-keyword">false</span>),
});</code></pre>
<p>Four lines that a human can read as a specification, and that a machine can enforce. Now the route:</p>
<pre><code>app.<span class="tok-fn">post</span>(<span class="tok-string">'/notes'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> parsed = CreateNote.<span class="tok-fn">safeParse</span>(req.body);
  <span class="tok-keyword">if</span> (!parsed.success) {
    <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">422</span>).<span class="tok-fn">json</span>({
      error: {
        code: <span class="tok-string">'VALIDATION_FAILED'</span>,
        message: <span class="tok-string">'The submitted data is not valid'</span>,
        fields: parsed.error.issues.<span class="tok-fn">map</span>((i) =&gt; ({ path: i.path.<span class="tok-fn">join</span>(<span class="tok-string">'.'</span>), message: i.message })),
      },
    });
  }
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">create</span>(parsed.data);   <span class="tok-comment">// clean, typed, defaults applied</span>
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>(note);
});</code></pre>

<h3>What it produces — real output</h3>
<p>One request with three different problems at once:</p>
<pre><code>curl -X POST /v2/notes -H 'Content-Type: application/json' \\
  -d '{"title":"","tags":["a","b","c","d","e","f"],"pinned":"yes"}'</code></pre>
<div class="out">{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The submitted data is not valid",
    "fields": [
      { "path": "title",  "message": "title must not be empty" },
      { "path": "tags",   "message": "Too big: expected array to have &lt;=5 items" },
      { "path": "pinned", "message": "Invalid input: expected boolean, received string" }
    ]
  }
}</div>
<div class="callout ok">Note <code>safeParse</code>, not <code>parse</code>. <code>parse</code> throws; <code>safeParse</code> returns <code>{success, data|error}</code>. Both are fine — throwing an <code>AppError</code> from a thrown zod error also works with lesson 5.4's handler — but <code>safeParse</code> keeps the control flow visible in the route, and it reports <strong>all</strong> the problems at once. A form that reveals its errors one per submit is a form users abandon.</div>
<p>A valid request, showing what the schema adds:</p>
<pre><code>curl -X POST /v2/notes -H 'Content-Type: application/json' -d '{"title":"A valid note"}'</code></pre>
<div class="out">{"id":3,"title":"A valid note","body":"","pinned":false,"version":1}</div>
<p><code>body</code> and <code>pinned</code> were never sent — <code>.default()</code> filled them in. Downstream code no longer needs <code>?? ''</code> in five places, because by the time the data reaches a service it is guaranteed complete.</p>

<h3>The query string problem, solved</h3>
<p>Lesson 5.2 showed that everything in <code>req.query</code> is a string. A schema can coerce and clamp in the same breath:</p>
<pre><code><span class="tok-keyword">const</span> ListQuery = z.<span class="tok-fn">object</span>({
  page:  z.coerce.<span class="tok-fn">number</span>().<span class="tok-fn">int</span>().<span class="tok-fn">min</span>(<span class="tok-number">1</span>).<span class="tok-fn">default</span>(<span class="tok-number">1</span>),
  limit: z.coerce.<span class="tok-fn">number</span>().<span class="tok-fn">int</span>().<span class="tok-fn">min</span>(<span class="tok-number">1</span>).<span class="tok-fn">max</span>(<span class="tok-number">50</span>).<span class="tok-fn">default</span>(<span class="tok-number">10</span>),
  sort:  z.<span class="tok-fn">enum</span>([<span class="tok-string">'createdAt'</span>, <span class="tok-string">'title'</span>]).<span class="tok-fn">default</span>(<span class="tok-string">'createdAt'</span>),
  order: z.<span class="tok-fn">enum</span>([<span class="tok-string">'asc'</span>, <span class="tok-string">'desc'</span>]).<span class="tok-fn">default</span>(<span class="tok-string">'desc'</span>),
});</code></pre>
<pre><code>curl "/v2/notes?page=3&amp;limit=25&amp;order=asc"</code></pre>
<div class="out">{
  "appliedQuery": { "page": 3, "limit": 25, "sort": "createdAt", "order": "asc" },
  "types":        { "page": "number", "limit": "number", "sort": "string", "order": "string" }
}</div>
<p>Strings in, numbers out, missing fields defaulted. And when the client sends nonsense:</p>
<pre><code>curl "/v2/notes?limit=500&amp;sort=colour"</code></pre>
<div class="out">{
  "error": { "code": "INVALID_QUERY", "fields": [
    { "path": "limit", "message": "Too big: expected number to be &lt;=50" },
    { "path": "sort",  "message": "Invalid option: expected one of \\"createdAt\\"|\\"title\\"" }
  ]}
}</div>
<div class="callout warn"><p>That <code>limit</code> rejection is not pedantry — it is the difference between an endpoint and a denial-of-service tool. <code>?limit=1000000</code> against an unclamped list endpoint asks your database for a million rows and your server to serialise them into one JSON string. One request, one dead process. The <code>.max(50)</code> is a load-bearing character.</p>
<p>A softer alternative is to <em>clamp</em> instead of reject — <code>Math.min(50, limit)</code> — which never fails a client that asked for too much. Reject when the client should learn; clamp when the client is a browser you also wrote. Just do one of the two.</p></div>

<h3>The attack a schema quietly blocks</h3>
<pre><code><span class="tok-comment">// The lazy version — every field the client sent goes in</span>
<span class="tok-keyword">const</span> note = <span class="tok-keyword">await</span> db.note.<span class="tok-fn">create</span>({ data: { ...req.body, authorId: user.id } });</code></pre>
<pre><code>curl -X POST /notes -d '{"title":"hi","isAdmin":true,"authorId":1,"createdAt":"2020-01-01"}'</code></pre>
<div class="pitfall">This is <strong>mass assignment</strong>. The client sets fields you never intended to expose — a role flag, another user's id, a "verified" boolean, a price. It is not exotic: it is what happens the first time someone opens devtools and edits the request body. A schema fixes it structurally, because zod's <code>.object()</code> <strong>strips unknown keys by default</strong>: <code>parsed.data</code> contains exactly the fields you declared and nothing else. Spreading <code>req.body</code> is the bug; spreading <code>parsed.data</code> is safe.</div>
<div class="callout">If you want unknown fields to be an explicit error rather than silently dropped, use <code>.strict()</code>. That is the right choice for an internal API where a typo in a field name should fail loudly instead of being ignored — <code>{"titel":"x"}</code> otherwise validates as "title missing" and confuses everyone.</div>

<h3>Making it a middleware</h3>
<p>The same six lines in every route is still duplication. Lesson 5.3's tool applies here:</p>
<pre><code><span class="tok-keyword">export const</span> <span class="tok-fn">validate</span> = (schemas) =&gt; (req, res, next) =&gt; {
  <span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> key <span class="tok-keyword">of</span> [<span class="tok-string">'body'</span>, <span class="tok-string">'query'</span>, <span class="tok-string">'params'</span>]) {
    <span class="tok-keyword">if</span> (!schemas[key]) <span class="tok-keyword">continue</span>;
    <span class="tok-keyword">const</span> r = schemas[key].<span class="tok-fn">safeParse</span>(req[key]);
    <span class="tok-keyword">if</span> (!r.success) <span class="tok-keyword">return</span> <span class="tok-fn">next</span>(<span class="tok-fn">validationError</span>(r.error));
    req.<span class="tok-fn">valid</span> ??= {};
    req.valid[key] = r.data;          <span class="tok-comment">// NOT req.query = … (read-only in Express 5)</span>
  }
  <span class="tok-fn">next</span>();
};</code></pre>
<pre><code>router.<span class="tok-fn">post</span>(<span class="tok-string">'/'</span>, <span class="tok-fn">validate</span>({ body: CreateNote }), (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">create</span>(req.valid.body);      <span class="tok-comment">// always clean</span>
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>(note);
});</code></pre>
<div class="callout warn">Write the result to <code>req.valid</code>, not back onto <code>req.query</code>. In Express 5 <code>req.query</code> became a lazily-computed getter — assigning to it throws or silently does nothing depending on the path. This is another v4 snippet that stops working when you upgrade.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">One schema, two uses</span><span class="v">The same file documents the endpoint and enforces it. Documentation that cannot drift, because it is the code.</span></div>
  <div class="kv"><span class="k">TypeScript for free</span><span class="v"><code>z.infer&lt;typeof CreateNote&gt;</code> gives you the static type of validated data — one definition, no duplicate interface.</span></div>
  <div class="kv"><span class="k">Validate at the edge</span><span class="v">Once, in the route. Services then trust their inputs instead of re-checking defensively at every layer.</span></div>
  <div class="kv"><span class="k">Not a replacement for DB constraints</span><span class="v">Validation catches the honest mistakes; the unique index catches the race between two simultaneous requests. Chapter 7 needs both.</span></div>
</div>
<div class="note-ct">Every write endpoint on this site validates at the router with a declared schema, and the API returns the same <code>fields[]</code> array you saw above — which is how a form can highlight three inputs in red from one response. The endpoints that predate that convention are exactly the ones where a bad request produced a 500 from deep inside a database driver, with a message no user should ever see.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — RESTful API Design and Implementation</span><span class="lc-sub">Validation, error shapes and safe input handling.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Kiểm tra dữ liệu bằng lược đồ</h2>
<p class="lead">Bài 5.5 kiểm tra dữ liệu bằng tay: <code>if (typeof title !== 'string' || title.trim() === '')</code>. Cách đó ổn với một trường. Với một endpoint thật có tám trường, kiểm tra thủ công biến thành một bức tường lệnh if, mà mỗi cái lại báo lỗi theo một kiểu hơi khác nhau và một nửa thì thiếu hẳn.</p>

<h3>Quy tắc mà bài này áp đặt</h3>
<div class="callout danger"><strong>Mọi thứ từ client đều là thù địch cho tới khi chứng minh được ngược lại</strong> — body, query, params, header. Không phải vì người dùng nào cũng là kẻ tấn công, mà vì phần đông người ngay thẳng vẫn gửi cho bạn dữ liệu hỏng một cách vô tình, và đường đi trong code thì y hệt nhau. Câu hỏi không bao giờ là "liệu dữ liệu xấu có tới không?" — mà là "dữ liệu xấu đụng vào cơ sở dữ liệu của tôi trước, hay đụng vào bộ kiểm trước?"</div>

<h3>Một lược đồ thay cho cả bức tường if</h3>
<pre><code>npm i zod</code></pre>
<pre><code><span class="tok-keyword">import</span> { z } <span class="tok-keyword">from</span> <span class="tok-string">'zod'</span>;      <span class="tok-comment">// zod 4.4.3</span>

<span class="tok-keyword">const</span> CreateNote = z.<span class="tok-fn">object</span>({
  title:  z.<span class="tok-fn">string</span>().<span class="tok-fn">min</span>(<span class="tok-number">1</span>, <span class="tok-string">'title không được rỗng'</span>).<span class="tok-fn">max</span>(<span class="tok-number">200</span>),
  body:   z.<span class="tok-fn">string</span>().<span class="tok-fn">max</span>(<span class="tok-number">10_000</span>).<span class="tok-fn">default</span>(<span class="tok-string">''</span>),
  tags:   z.<span class="tok-fn">array</span>(z.<span class="tok-fn">string</span>()).<span class="tok-fn">max</span>(<span class="tok-number">5</span>).<span class="tok-fn">optional</span>(),
  pinned: z.<span class="tok-fn">boolean</span>().<span class="tok-fn">default</span>(<span class="tok-keyword">false</span>),
});</code></pre>
<p>Bốn dòng mà người đọc lên được như một bản đặc tả, còn máy thì thi hành được. Giờ tới route:</p>
<pre><code>app.<span class="tok-fn">post</span>(<span class="tok-string">'/notes'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> parsed = CreateNote.<span class="tok-fn">safeParse</span>(req.body);
  <span class="tok-keyword">if</span> (!parsed.success) {
    <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">422</span>).<span class="tok-fn">json</span>({
      error: {
        code: <span class="tok-string">'VALIDATION_FAILED'</span>,
        message: <span class="tok-string">'Dữ liệu gửi lên không hợp lệ'</span>,
        fields: parsed.error.issues.<span class="tok-fn">map</span>((i) =&gt; ({ path: i.path.<span class="tok-fn">join</span>(<span class="tok-string">'.'</span>), message: i.message })),
      },
    });
  }
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">create</span>(parsed.data);   <span class="tok-comment">// sạch, đúng kiểu, đã điền mặc định</span>
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>(note);
});</code></pre>

<h3>Nó cho ra cái gì — output thật</h3>
<p>Một request mắc ba lỗi khác nhau cùng lúc:</p>
<pre><code>curl -X POST /v2/notes -H 'Content-Type: application/json' \\
  -d '{"title":"","tags":["a","b","c","d","e","f"],"pinned":"có"}'</code></pre>
<div class="out">{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Dữ liệu gửi lên không hợp lệ",
    "fields": [
      { "path": "title",  "message": "title không được rỗng" },
      { "path": "tags",   "message": "Too big: expected array to have &lt;=5 items" },
      { "path": "pinned", "message": "Invalid input: expected boolean, received string" }
    ]
  }
}</div>
<div class="callout ok">Để ý là <code>safeParse</code> chứ không phải <code>parse</code>. <code>parse</code> thì ném lỗi; <code>safeParse</code> trả về <code>{success, data|error}</code>. Cả hai đều dùng được — ném một <code>AppError</code> từ lỗi zod cũng hoạt động ngon với handler của bài 5.4 — nhưng <code>safeParse</code> giữ cho luồng điều khiển hiện rõ ngay trong route, và nó báo <strong>TẤT CẢ</strong> vấn đề cùng một lúc. Một cái form mà mỗi lần bấm gửi chỉ lòi ra một lỗi là cái form người ta bỏ đi giữa chừng.</div>
<p>Một request hợp lệ, để thấy lược đồ thêm vào những gì:</p>
<pre><code>curl -X POST /v2/notes -H 'Content-Type: application/json' -d '{"title":"Ghi chú hợp lệ"}'</code></pre>
<div class="out">{"id":3,"title":"Ghi chú hợp lệ","body":"","pinned":false,"version":1}</div>
<p><code>body</code> và <code>pinned</code> chưa từng được gửi lên — <code>.default()</code> đã điền vào. Code phía sau không còn phải rải <code>?? ''</code> ở năm chỗ nữa, bởi vì lúc dữ liệu tới được service thì nó đã chắc chắn đầy đủ.</p>

<h3>Bài toán query string, đã có lời giải</h3>
<p>Bài 5.2 đã cho thấy mọi thứ trong <code>req.query</code> đều là chuỗi. Một lược đồ có thể vừa ép kiểu vừa chặn trần trong cùng một hơi:</p>
<pre><code><span class="tok-keyword">const</span> ListQuery = z.<span class="tok-fn">object</span>({
  page:  z.coerce.<span class="tok-fn">number</span>().<span class="tok-fn">int</span>().<span class="tok-fn">min</span>(<span class="tok-number">1</span>).<span class="tok-fn">default</span>(<span class="tok-number">1</span>),
  limit: z.coerce.<span class="tok-fn">number</span>().<span class="tok-fn">int</span>().<span class="tok-fn">min</span>(<span class="tok-number">1</span>).<span class="tok-fn">max</span>(<span class="tok-number">50</span>).<span class="tok-fn">default</span>(<span class="tok-number">10</span>),
  sort:  z.<span class="tok-fn">enum</span>([<span class="tok-string">'createdAt'</span>, <span class="tok-string">'title'</span>]).<span class="tok-fn">default</span>(<span class="tok-string">'createdAt'</span>),
  order: z.<span class="tok-fn">enum</span>([<span class="tok-string">'asc'</span>, <span class="tok-string">'desc'</span>]).<span class="tok-fn">default</span>(<span class="tok-string">'desc'</span>),
});</code></pre>
<pre><code>curl "/v2/notes?page=3&amp;limit=25&amp;order=asc"</code></pre>
<div class="out">{
  "appliedQuery": { "page": 3, "limit": 25, "sort": "createdAt", "order": "asc" },
  "types":        { "page": "number", "limit": "number", "sort": "string", "order": "string" }
}</div>
<p>Chuỗi đi vào, số đi ra, trường thiếu thì được điền mặc định. Và khi client gửi thứ vô nghĩa:</p>
<pre><code>curl "/v2/notes?limit=500&amp;sort=mau"</code></pre>
<div class="out">{
  "error": { "code": "INVALID_QUERY", "fields": [
    { "path": "limit", "message": "Too big: expected number to be &lt;=50" },
    { "path": "sort",  "message": "Invalid option: expected one of \\"createdAt\\"|\\"title\\"" }
  ]}
}</div>
<div class="callout warn"><p>Việc từ chối <code>limit</code> đó không phải là khó tính — đó là ranh giới giữa một endpoint và một công cụ tấn công từ chối dịch vụ. Gọi <code>?limit=1000000</code> vào một endpoint danh sách không chặn trần là bảo cơ sở dữ liệu lấy về một triệu dòng và bảo server tuần tự hoá chúng thành một chuỗi JSON. Một request, một tiến trình chết. Cái <code>.max(50)</code> là một ký tự chịu lực.</p>
<p>Một lựa chọn mềm hơn là <em>chặn trần</em> thay vì từ chối — <code>Math.min(50, limit)</code> — cách này không bao giờ làm hỏng request của một client đòi quá nhiều. Hãy từ chối khi bạn muốn client học được điều gì đó; hãy chặn trần khi client cũng là trình duyệt do chính bạn viết. Chỉ cần làm một trong hai.</p></div>

<h3>Đòn tấn công mà lược đồ lặng lẽ chặn đứng</h3>
<pre><code><span class="tok-comment">// Bản lười — trường nào client gửi cũng vào tuốt</span>
<span class="tok-keyword">const</span> note = <span class="tok-keyword">await</span> db.note.<span class="tok-fn">create</span>({ data: { ...req.body, authorId: user.id } });</code></pre>
<pre><code>curl -X POST /notes -d '{"title":"hi","isAdmin":true,"authorId":1,"createdAt":"2020-01-01"}'</code></pre>
<div class="pitfall">Đây là <strong>mass assignment</strong> (gán ồ ạt). Client tự đặt những trường mà bạn chưa bao giờ định phơi ra — một cờ phân quyền, id của người khác, một boolean "đã xác minh", một mức giá. Chuyện này không hề xa vời: nó xảy ra ngay lần đầu có người mở devtools và sửa body của request. Một lược đồ chữa được tận gốc về mặt cấu trúc, vì <code>.object()</code> của zod <strong>mặc định vứt bỏ các khoá lạ</strong>: <code>parsed.data</code> chứa đúng những trường bạn đã khai báo và không gì khác. Rải <code>req.body</code> ra là con bug; rải <code>parsed.data</code> ra thì an toàn.</div>
<div class="callout">Nếu bạn muốn trường lạ trở thành lỗi tường minh thay vì bị âm thầm bỏ đi, hãy dùng <code>.strict()</code>. Đó là lựa chọn đúng cho một API nội bộ, nơi gõ sai tên trường phải nổ to lên thay vì bị lờ đi — vì nếu không thì <code>{"titel":"x"}</code> sẽ được báo là "thiếu title" và làm tất cả mọi người bối rối.</div>

<h3>Biến nó thành middleware</h3>
<p>Sáu dòng giống hệt nhau ở mọi route thì vẫn là lặp lại. Công cụ của bài 5.3 dùng được ngay ở đây:</p>
<pre><code><span class="tok-keyword">export const</span> <span class="tok-fn">validate</span> = (schemas) =&gt; (req, res, next) =&gt; {
  <span class="tok-keyword">for</span> (<span class="tok-keyword">const</span> key <span class="tok-keyword">of</span> [<span class="tok-string">'body'</span>, <span class="tok-string">'query'</span>, <span class="tok-string">'params'</span>]) {
    <span class="tok-keyword">if</span> (!schemas[key]) <span class="tok-keyword">continue</span>;
    <span class="tok-keyword">const</span> r = schemas[key].<span class="tok-fn">safeParse</span>(req[key]);
    <span class="tok-keyword">if</span> (!r.success) <span class="tok-keyword">return</span> <span class="tok-fn">next</span>(<span class="tok-fn">validationError</span>(r.error));
    req.<span class="tok-fn">valid</span> ??= {};
    req.valid[key] = r.data;          <span class="tok-comment">// KHÔNG phải req.query = … (chỉ đọc ở Express 5)</span>
  }
  <span class="tok-fn">next</span>();
};</code></pre>
<pre><code>router.<span class="tok-fn">post</span>(<span class="tok-string">'/'</span>, <span class="tok-fn">validate</span>({ body: CreateNote }), (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">create</span>(req.valid.body);      <span class="tok-comment">// luôn sạch</span>
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>(note);
});</code></pre>
<div class="callout warn">Hãy ghi kết quả vào <code>req.valid</code>, đừng ghi ngược lại lên <code>req.query</code>. Ở Express 5, <code>req.query</code> đã trở thành một getter tính toán trễ — gán giá trị cho nó sẽ ném lỗi hoặc âm thầm không làm gì, tuỳ đường đi. Đây lại là một đoạn code v4 nữa ngừng chạy khi bạn nâng cấp.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một lược đồ, hai công dụng</span><span class="v">Cùng một file vừa mô tả endpoint vừa thi hành nó. Tài liệu không thể lệch được, vì nó chính là code.</span></div>
  <div class="kv"><span class="k">Có TypeScript miễn phí</span><span class="v"><code>z.infer&lt;typeof CreateNote&gt;</code> cho bạn kiểu tĩnh của dữ liệu đã kiểm — một định nghĩa duy nhất, không cần interface trùng lặp.</span></div>
  <div class="kv"><span class="k">Kiểm ở vành ngoài</span><span class="v">Một lần, ngay tại route. Các service sau đó tin tưởng đầu vào của mình thay vì phải kiểm phòng thủ lại ở từng tầng.</span></div>
  <div class="kv"><span class="k">Không thay thế được ràng buộc ở CSDL</span><span class="v">Kiểm dữ liệu bắt được những nhầm lẫn ngay thẳng; còn chỉ mục duy nhất mới bắt được cuộc đua giữa hai request đồng thời. Chương 7 cần cả hai.</span></div>
</div>
<div class="note-ct">Mọi endpoint ghi dữ liệu trên website này đều kiểm tra ngay tại router bằng một lược đồ khai báo, và API trả về đúng mảng <code>fields[]</code> mà bạn vừa thấy — nhờ vậy một cái form có thể tô đỏ ba ô nhập chỉ từ một phản hồi. Những endpoint có từ trước quy ước đó đúng là những chỗ mà một request sai sinh ra lỗi 500 từ tận sâu trong trình điều khiển cơ sở dữ liệu, kèm một câu thông báo mà không người dùng nào nên nhìn thấy.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — Thiết kế &amp; hiện thực REST API</span><span class="lc-sub">Kiểm tra dữ liệu, hình dạng lỗi và xử lý đầu vào an toàn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Pagination, filtering and sorting|||6.4 — Phân trang, lọc và sắp xếp',
      slug: 'nodejs-6-4-phan-trang',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-4-phan-trang.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-4-phan-trang.jpg',
        scenario: 'nodejs-pagination',
        durationSeconds: 15,
        caption: { en: "Pagination — OFFSET versus cursor", vi: "Phân trang — OFFSET so với cursor" },
      },
      type: 'VIDEO',
      description: 'OFFSET và cursor đo trên 1.000.000 dòng PostgreSQL: 167ms so với 0,015ms — và con bug trùng bản ghi mà OFFSET gây ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Pagination, filtering and sorting</h2>
<p class="lead">Every list endpoint starts life returning everything, because during development the table has twelve rows. This lesson is what happens at a million — measured on a real PostgreSQL table with exactly that many rows, not estimated.</p>

<h3>Rule zero: a list endpoint always has a limit</h3>
<pre><code><span class="tok-comment">// The endpoint that takes the site down at 3am</span>
router.<span class="tok-fn">get</span>(<span class="tok-string">'/'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; res.<span class="tok-fn">json</span>(<span class="tok-keyword">await</span> db.note.<span class="tok-fn">findMany</span>()));</code></pre>
<p>It is correct, it passes review, and it works perfectly for a year. Then the table grows and one request tries to load every row into RAM, serialise it into a single JSON string, and push it through a socket — while the event loop (lesson 2.4) is blocked for the entire <code>JSON.stringify</code>. Not slow: <em>stopped</em>, for every other user at the same time.</p>

<h3>Offset pagination — the obvious one</h3>
<pre><code>GET /notes?page=3&amp;limit=20</code></pre>
<pre><code>SELECT * FROM notes ORDER BY id LIMIT 20 OFFSET 40;</code></pre>
<p>Simple, gives you numbered pages and a "jump to page 57" control. Here is the cost, measured with <code>EXPLAIN ANALYZE</code> on a table of <strong>1,000,000 rows</strong> with an index on the sort column, warm cache:</p>
<div class="out">OFFSET 0       (page 1)      →   0.048 ms    scanned 20 rows
OFFSET 500000  (page 25001)  →  98.117 ms    scanned 500,020 rows
OFFSET 999980  (last page)   → 166.815 ms    scanned 1,000,000 rows</div>
<div class="callout danger">Read the third column. <code>OFFSET 999980</code> did not skip a million rows cheaply — the database <strong>read every one of them</strong>, in order, and threw away all but the last twenty. OFFSET is not a seek; it is a count-and-discard. The cost of page N grows linearly with N, which means your slowest queries are on the pages nobody looks at, and your database is doing its heaviest work for your least valuable traffic.</div>

<h3>Cursor pagination — ask for what comes after</h3>
<pre><code>GET /notes?limit=20&amp;after=999980</code></pre>
<pre><code>SELECT * FROM notes WHERE id &gt; 999980 ORDER BY id LIMIT 20;</code></pre>
<p>Same table, same index, same 20 rows returned:</p>
<div class="out">cursor id &gt; 500000  →  0.029 ms    scanned 20 rows
cursor id &gt; 999980  →  0.015 ms    scanned 20 rows</div>
<div class="out">                    OFFSET        CURSOR      ratio
page 25001        98.117 ms     0.029 ms     ~3,400×
last page        166.815 ms     0.015 ms    ~11,000×</div>
<p>And the number that explains the number: the cursor query scanned <strong>20 rows</strong> where OFFSET scanned <strong>1,000,000</strong>. This is not a database being clever — it is an index doing the one thing indexes are for, jumping straight to a key. Cursor pagination is O(limit); offset pagination is O(offset + limit).</p>

<h3>The bug offset has that has nothing to do with speed</h3>
<p>Feeds are sorted newest first, and new rows arrive while a user scrolls. Reproduced exactly:</p>
<pre><code><span class="tok-comment">-- user reads page 1</span>
SELECT id FROM notes ORDER BY id DESC LIMIT 3 OFFSET 0;</code></pre>
<div class="out">page 1: 1000000, 999999, 999998</div>
<pre><code><span class="tok-comment">-- someone posts a new note (id 1000001)</span>
INSERT INTO notes … ;

<span class="tok-comment">-- user scrolls: page 2</span>
SELECT id FROM notes ORDER BY id DESC LIMIT 3 OFFSET 3;</code></pre>
<div class="out">page 2: 999998, 999997, 999996
         ↑ ALREADY SHOWN on page 1</div>
<p>The insert pushed everything down by one, so the row at position 3 is now the row the user already saw. With cursor pagination, the same scroll:</p>
<pre><code>SELECT id FROM notes WHERE id &lt; 999998 ORDER BY id DESC LIMIT 3;</code></pre>
<div class="out">page 2: 999997, 999996, 999995
         no duplicate — the cursor is anchored to a row, not a position</div>
<div class="pitfall">This is why users report "the same post keeps appearing" and "posts disappear when I scroll" on busy feeds, and why the bug never reproduces on a test database where nothing is being written. Deletes cause the mirror image: rows shift up and an item is skipped entirely, so the user never sees it at all. Offset pagination is correct only over data that does not change while you page through it.</div>

<h3>Which one to use</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Offset</span><span class="v">Admin tables, search results, anything where the user expects page numbers and the dataset is small or static. Simple, and simple has value.</span></div>
  <div class="kv"><span class="k">Cursor</span><span class="v">Feeds, infinite scroll, messages, anything append-heavy or large. Required if the data changes while paging.</span></div>
  <div class="kv"><span class="k">Cursor limitation</span><span class="v">No "jump to page 57", and no total page count — you can only go forward and back. Usually an acceptable trade for a feed; unacceptable for an admin table.</span></div>
  <div class="kv"><span class="k">Tie-breaker matters</span><span class="v">Sorting by <code>createdAt</code> alone breaks when two rows share a timestamp — the cursor may skip or repeat. Always sort by <code>(createdAt, id)</code> and put both in the cursor.</span></div>
</div>
<pre><code><span class="tok-comment">// A cursor is an opaque string, not a number the client can invent</span>
<span class="tok-keyword">const</span> cursor = Buffer.<span class="tok-fn">from</span>(JSON.<span class="tok-fn">stringify</span>({ createdAt, id })).<span class="tok-fn">toString</span>(<span class="tok-string">'base64url'</span>);

<span class="tok-comment">// SQL for the "next page" of a newest-first feed</span>
WHERE (created_at, id) &lt; ($1, $2)  ORDER BY created_at DESC, id DESC  LIMIT $3</code></pre>
<div class="callout ok">Return the cursor, do not make the client build it: <code>{ "items": [...], "nextCursor": "eyJjcmVh…", "hasMore": true }</code>. Then the shape of the cursor stays yours to change — you can add a tie-breaker field later without touching a single client.</div>

<h3>The hidden cost: <code>total</code></h3>
<p>Every offset-paginated response wants to say "page 3 of 500", which means a <code>COUNT(*)</code>. On the same million-row table:</p>
<div class="out">SELECT count(*) FROM notes;             →  45.071 ms   (parallel seq scan, ALL rows)
SELECT reltuples FROM pg_class …        →   0.025 ms   (estimate from statistics)</div>
<div class="callout warn">The count is often more expensive than the page itself — 45ms of pure overhead attached to every list request, to render a number most users never read. Three ways out, in order of preference: drop <code>total</code> and return <code>hasMore</code> (compute it by fetching <code>limit + 1</code> rows and checking whether you got the extra one); use the estimate for a "~1.2M results" display; or cache the exact count for a minute. Google itself shows you an estimate — "About 12,400,000 results" — for exactly this reason.</div>

<h3>Filtering and sorting, safely</h3>
<pre><code><span class="tok-comment">// SQL injection with extra steps</span>
<span class="tok-keyword">const</span> rows = <span class="tok-keyword">await</span> db.<span class="tok-fn">$queryRawUnsafe</span>(\`SELECT * FROM notes ORDER BY \${req.query.sort}\`);</code></pre>
<div class="pitfall">Column names cannot be passed as query parameters — a placeholder works for <em>values</em>, never for identifiers. So a sort field taken from the query string is string-concatenated into SQL, which is injection. The fix is not escaping; it is an <strong>allow-list</strong>, which is exactly what <code>z.enum(['createdAt','title'])</code> from lesson 6.3 already gives you. Anything not on the list never reaches the query.</div>
<pre><code>GET /notes?tag=work&amp;pinned=true&amp;q=express&amp;sort=title&amp;order=asc&amp;limit=20</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Allow-list every sortable field</span><span class="v">And every filterable one. The set of things a client may sort by is a deliberate API decision, not whatever columns happen to exist.</span></div>
  <div class="kv"><span class="k">Index what you allow</span><span class="v">Every sortable column needs an index, or you have shipped a table scan behind a friendly query parameter.</span></div>
  <div class="kv"><span class="k">Give sort a stable default</span><span class="v">Without <code>ORDER BY</code>, a database may return rows in any order — including a different one each call, which makes pagination silently lossy.</span></div>
  <div class="kv"><span class="k">Text search is not <code>LIKE '%q%'</code></span><span class="v">A leading wildcard cannot use a normal index. Small tables survive it; past that you need full-text search or a trigram index.</span></div>
</div>
<div class="note-ct">The feed on cuongthai.com is cursor-paginated for exactly the reason demonstrated above — an offset feed was showing repeated posts whenever someone published while a visitor was scrolling. The admin tables stayed on offset pagination on purpose: they need page numbers, the row counts are small, and nobody is inserting into them mid-scroll. Two mechanisms, chosen per use case, is the correct answer here — not a rule that one is better.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — RESTful API Design and Implementation</span><span class="lc-sub">Pagination, filtering and query design.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Phân trang, lọc và sắp xếp</h2>
<p class="lead">Mọi endpoint danh sách đều bắt đầu đời mình bằng cách trả về tất cả, vì lúc đang phát triển thì bảng có mười hai dòng. Bài này nói về chuyện gì xảy ra ở mốc một triệu — đo trên một bảng PostgreSQL thật với đúng chừng đó dòng, không phải ước lượng.</p>

<h3>Quy tắc số không: endpoint danh sách luôn phải có giới hạn</h3>
<pre><code><span class="tok-comment">// Endpoint sẽ kéo sập website lúc 3 giờ sáng</span>
router.<span class="tok-fn">get</span>(<span class="tok-string">'/'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; res.<span class="tok-fn">json</span>(<span class="tok-keyword">await</span> db.note.<span class="tok-fn">findMany</span>()));</code></pre>
<p>Nó đúng, nó qua được review, và nó chạy hoàn hảo suốt một năm. Rồi bảng lớn dần và một request cố nạp toàn bộ số dòng vào RAM, tuần tự hoá thành một chuỗi JSON duy nhất, rồi đẩy qua socket — trong khi event loop (bài 2.4) bị chặn suốt cả lệnh <code>JSON.stringify</code> đó. Không phải chậm: là <em>đứng hình</em>, với tất cả người dùng khác cùng lúc.</p>

<h3>Phân trang bằng OFFSET — cách hiển nhiên</h3>
<pre><code>GET /notes?page=3&amp;limit=20</code></pre>
<pre><code>SELECT * FROM notes ORDER BY id LIMIT 20 OFFSET 40;</code></pre>
<p>Đơn giản, cho bạn số trang và cái nút "nhảy tới trang 57". Còn đây là cái giá của nó, đo bằng <code>EXPLAIN ANALYZE</code> trên bảng <strong>1.000.000 dòng</strong> có chỉ mục trên cột sắp xếp, cache đã nóng:</p>
<div class="out">OFFSET 0       (trang 1)      →   0,048 ms    quét 20 dòng
OFFSET 500000  (trang 25001)  →  98,117 ms    quét 500.020 dòng
OFFSET 999980  (trang cuối)   → 166,815 ms    quét 1.000.000 dòng</div>
<div class="callout danger">Hãy đọc cột thứ ba. <code>OFFSET 999980</code> không hề bỏ qua một triệu dòng một cách rẻ tiền — cơ sở dữ liệu đã <strong>đọc hết từng dòng một</strong>, theo thứ tự, rồi vứt đi tất cả trừ hai mươi dòng cuối. OFFSET không phải phép nhảy tới; nó là phép đếm-rồi-vứt-bỏ. Chi phí của trang N tăng tuyến tính theo N, nghĩa là những truy vấn chậm nhất của bạn nằm ở các trang chẳng ai xem, và cơ sở dữ liệu đang gồng sức nặng nhất cho phần lưu lượng ít giá trị nhất.</div>

<h3>Phân trang bằng con trỏ — hỏi cái nằm SAU một mốc</h3>
<pre><code>GET /notes?limit=20&amp;after=999980</code></pre>
<pre><code>SELECT * FROM notes WHERE id &gt; 999980 ORDER BY id LIMIT 20;</code></pre>
<p>Cùng bảng, cùng chỉ mục, cùng trả về 20 dòng:</p>
<div class="out">cursor id &gt; 500000  →  0,029 ms    quét 20 dòng
cursor id &gt; 999980  →  0,015 ms    quét 20 dòng</div>
<div class="out">                    OFFSET        CURSOR      tỉ lệ
trang 25001       98,117 ms     0,029 ms     ~3.400×
trang cuối       166,815 ms     0,015 ms    ~11.000×</div>
<p>Và con số giải thích cho con số kia: truy vấn cursor quét <strong>20 dòng</strong> trong khi OFFSET quét <strong>1.000.000</strong>. Đây không phải cơ sở dữ liệu thông minh — đây là chỉ mục đang làm đúng việc mà chỉ mục sinh ra để làm: nhảy thẳng tới một khoá. Phân trang bằng con trỏ là O(limit); phân trang bằng offset là O(offset + limit).</p>

<h3>Con bug của OFFSET, chẳng liên quan gì tới tốc độ</h3>
<p>Bảng tin sắp xếp mới nhất trước, và các dòng mới cứ tới trong lúc người dùng đang cuộn. Tái hiện chính xác:</p>
<pre><code><span class="tok-comment">-- người dùng đọc trang 1</span>
SELECT id FROM notes ORDER BY id DESC LIMIT 3 OFFSET 0;</code></pre>
<div class="out">trang 1: 1000000, 999999, 999998</div>
<pre><code><span class="tok-comment">-- có người đăng một ghi chú mới (id 1000001)</span>
INSERT INTO notes … ;

<span class="tok-comment">-- người dùng cuộn tiếp: trang 2</span>
SELECT id FROM notes ORDER BY id DESC LIMIT 3 OFFSET 3;</code></pre>
<div class="out">trang 2: 999998, 999997, 999996
          ↑ ĐÃ HIỆN ở trang 1</div>
<p>Dòng mới chèn vào đẩy mọi thứ xuống một bậc, nên dòng ở vị trí thứ 3 giờ lại chính là dòng người dùng vừa xem. Với phân trang bằng con trỏ, cũng cú cuộn đó:</p>
<pre><code>SELECT id FROM notes WHERE id &lt; 999998 ORDER BY id DESC LIMIT 3;</code></pre>
<div class="out">trang 2: 999997, 999996, 999995
          không trùng — con trỏ neo vào một DÒNG, không phải một VỊ TRÍ</div>
<div class="pitfall">Đây là lý do người dùng báo "cùng một bài cứ hiện đi hiện lại" và "bài viết biến mất khi tôi cuộn" trên những bảng tin đông người, và cũng là lý do con bug đó không bao giờ tái hiện được trên cơ sở dữ liệu thử nghiệm nơi chẳng ai ghi gì cả. Xoá dòng gây ra hiện tượng ngược lại: các dòng dịch lên và một mục bị nhảy cóc hoàn toàn, nên người dùng không bao giờ nhìn thấy nó. Phân trang bằng OFFSET chỉ đúng trên dữ liệu không thay đổi trong lúc bạn lật trang.</div>

<h3>Dùng cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OFFSET</span><span class="v">Bảng quản trị, kết quả tìm kiếm, mọi chỗ người dùng cần số trang và tập dữ liệu nhỏ hoặc tĩnh. Đơn giản, và sự đơn giản có giá trị của nó.</span></div>
  <div class="kv"><span class="k">Con trỏ</span><span class="v">Bảng tin, cuộn vô tận, tin nhắn, mọi thứ hay ghi thêm hoặc rất lớn. Bắt buộc nếu dữ liệu thay đổi trong lúc lật trang.</span></div>
  <div class="kv"><span class="k">Hạn chế của con trỏ</span><span class="v">Không có "nhảy tới trang 57", cũng không có tổng số trang — bạn chỉ đi tới và lui được. Thường là cái giá chấp nhận được cho bảng tin; nhưng không chấp nhận được cho bảng quản trị.</span></div>
  <div class="kv"><span class="k">Khoá phá hoà rất quan trọng</span><span class="v">Sắp xếp chỉ theo <code>createdAt</code> sẽ hỏng khi hai dòng trùng mốc thời gian — con trỏ có thể nhảy cóc hoặc lặp. Luôn sắp theo <code>(createdAt, id)</code> và đưa cả hai vào con trỏ.</span></div>
</div>
<pre><code><span class="tok-comment">// Con trỏ là một chuỗi mờ đục, không phải con số client tự bịa ra được</span>
<span class="tok-keyword">const</span> cursor = Buffer.<span class="tok-fn">from</span>(JSON.<span class="tok-fn">stringify</span>({ createdAt, id })).<span class="tok-fn">toString</span>(<span class="tok-string">'base64url'</span>);

<span class="tok-comment">// SQL cho "trang kế tiếp" của một bảng tin mới-nhất-trước</span>
WHERE (created_at, id) &lt; ($1, $2)  ORDER BY created_at DESC, id DESC  LIMIT $3</code></pre>
<div class="callout ok">Hãy trả con trỏ về, đừng bắt client tự dựng: <code>{ "items": [...], "nextCursor": "eyJjcmVh…", "hasMore": true }</code>. Nhờ vậy hình dạng của con trỏ vẫn thuộc quyền bạn sửa — sau này thêm một trường phá hoà vào cũng không phải đụng tới một client nào.</div>

<h3>Chi phí ẩn: trường <code>total</code></h3>
<p>Mọi phản hồi phân trang bằng OFFSET đều muốn nói "trang 3 trên 500", mà như thế nghĩa là một lệnh <code>COUNT(*)</code>. Trên cùng bảng một triệu dòng:</p>
<div class="out">SELECT count(*) FROM notes;             →  45,071 ms   (quét song song TOÀN BỘ dòng)
SELECT reltuples FROM pg_class …        →   0,025 ms   (ước lượng từ thống kê)</div>
<div class="callout warn">Phép đếm thường còn đắt hơn cả trang dữ liệu — 45ms phụ trội thuần tuý gắn vào mọi request danh sách, chỉ để hiển thị một con số mà phần lớn người dùng không bao giờ đọc. Có ba lối thoát, xếp theo thứ tự ưu tiên: bỏ <code>total</code> và trả về <code>hasMore</code> (tính bằng cách lấy <code>limit + 1</code> dòng rồi xem có dư ra một dòng không); dùng con số ước lượng cho kiểu hiển thị "~1,2 triệu kết quả"; hoặc cache con số chính xác trong một phút. Chính Google cũng chỉ cho bạn xem ước lượng — "Khoảng 12.400.000 kết quả" — đúng vì lý do này.</div>

<h3>Lọc và sắp xếp cho an toàn</h3>
<pre><code><span class="tok-comment">// SQL injection, chỉ là vòng vo hơn chút</span>
<span class="tok-keyword">const</span> rows = <span class="tok-keyword">await</span> db.<span class="tok-fn">$queryRawUnsafe</span>(\`SELECT * FROM notes ORDER BY \${req.query.sort}\`);</code></pre>
<div class="pitfall">Tên cột không thể truyền vào như tham số truy vấn — dấu giữ chỗ chỉ dùng được cho <em>giá trị</em>, không bao giờ cho định danh. Nên một trường sắp xếp lấy từ query string sẽ bị nối chuỗi thẳng vào SQL, và đó là injection. Cách chữa không phải là escape; mà là một <strong>danh sách trắng</strong>, đúng thứ mà <code>z.enum(['createdAt','title'])</code> ở bài 6.3 đã cho bạn sẵn. Cái gì không nằm trong danh sách thì không bao giờ tới được câu truy vấn.</div>
<pre><code>GET /notes?tag=work&amp;pinned=true&amp;q=express&amp;sort=title&amp;order=asc&amp;limit=20</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Danh sách trắng mọi trường sắp xếp được</span><span class="v">Và mọi trường lọc được. Tập những thứ client được phép sắp xếp theo là một quyết định thiết kế API có chủ đích, không phải "trong bảng có cột nào thì cho cột đó".</span></div>
  <div class="kv"><span class="k">Cho phép cái gì thì đánh chỉ mục cái đó</span><span class="v">Mọi cột sắp xếp được đều cần chỉ mục, nếu không bạn vừa ship ra một phép quét toàn bảng núp sau một tham số truy vấn thân thiện.</span></div>
  <div class="kv"><span class="k">Sắp xếp phải có mặc định ổn định</span><span class="v">Không có <code>ORDER BY</code> thì cơ sở dữ liệu được phép trả về theo thứ tự bất kỳ — kể cả khác nhau ở mỗi lần gọi, khiến việc phân trang âm thầm làm rơi mất dữ liệu.</span></div>
  <div class="kv"><span class="k">Tìm kiếm chữ không phải <code>LIKE '%q%'</code></span><span class="v">Ký tự đại diện đứng đầu thì không dùng được chỉ mục thường. Bảng nhỏ thì còn sống được; qua mốc đó bạn cần full-text search hoặc chỉ mục trigram.</span></div>
</div>
<div class="note-ct">Bảng tin trên cuongthai.com phân trang bằng con trỏ đúng vì lý do vừa trình diễn ở trên — bản dùng OFFSET đã hiện lặp bài viết mỗi khi có người đăng bài trong lúc khách đang cuộn. Còn các bảng quản trị thì cố ý giữ nguyên OFFSET: chúng cần số trang, số dòng thì nhỏ, và không ai chèn dữ liệu vào giữa lúc cuộn cả. Hai cơ chế, chọn theo từng ca sử dụng — đó mới là câu trả lời đúng ở đây, chứ không phải một quy tắc kiểu "cái này tốt hơn cái kia".</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — Thiết kế &amp; hiện thực REST API</span><span class="lc-sub">Phân trang, lọc và thiết kế truy vấn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — The API contract: versions, ETag, idempotency|||6.5 — Hợp đồng API: phiên bản, ETag, idempotency',
      slug: 'nodejs-6-5-hop-dong-api',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-5-hop-dong-api.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-6-5-hop-dong-api.jpg',
        scenario: 'nodejs-contract',
        durationSeconds: 19,
        caption: { en: "The API contract — idempotency and ETag", vi: "Hợp đồng API — idempotency và ETag" },
      },
      type: 'VIDEO',
      description: 'Thay đổi API mà không làm vỡ client cũ, chặn mất bản ghi bằng ETag/If-Match (412), và chặn trừ tiền hai lần bằng Idempotency-Key.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>The API contract: versions, ETag, idempotency</h2>
<p class="lead">An API is a promise to code you do not control. A web app you can redeploy in a minute; a mobile app sits on phones running a version from eight months ago, and an integration partner will read your email about the change three weeks after their integration breaks. This lesson is about keeping promises.</p>

<h3>What counts as a breaking change</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✗ Breaking</span><span class="v">Removing a field · renaming a field · changing a type (<code>"42"</code> → <code>42</code>) · adding a required request field · tightening validation · changing a status code · changing the meaning of an existing value.</span></div>
  <div class="kv"><span class="k">✓ Safe</span><span class="v">Adding an optional response field · adding an optional request field with a default · adding a new endpoint · adding a new enum value <em>if</em> clients were told to ignore unknown ones.</span></div>
</div>
<div class="pitfall">The one everybody underestimates: <strong>tightening validation is a breaking change</strong>. Adding <code>.max(200)</code> to a title that used to accept anything will start rejecting requests that worked yesterday, from a client you cannot update. The same is true of making an optional field required. Loosening is safe; tightening is not — and neither shows up in a code review as "breaking".</div>

<h3>Versioning</h3>
<pre><code>app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v1/notes'</span>, notesRouterV1);
app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v2/notes'</span>, notesRouterV2);   <span class="tok-comment">// old clients keep working</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">In the URL</span><span class="v"><code>/api/v1/…</code>. Ugly to purists, trivially visible in logs, easy to route, easy to curl. This is what most APIs do, including this one.</span></div>
  <div class="kv"><span class="k">In a header</span><span class="v"><code>Accept: application/vnd.api+json;version=2</code>. Cleaner URLs; harder to debug, harder to cache, and impossible to paste into a browser.</span></div>
  <div class="kv"><span class="k">Best of all: do not version</span><span class="v">Add, never remove. A v2 means maintaining two code paths forever — most "breaking" changes can be expressed as an added field plus a deprecation window.</span></div>
</div>
<div class="callout ok">Start at <code>/api/v1</code> on day one even if you never ship a v2. Adding a version prefix later means changing every client; having one from the start costs three characters.</div>

<h3>Optimistic concurrency: <code>ETag</code> + <code>If-Match</code></h3>
<p>Lesson 6.1 demonstrated the lost update — A's edit silently erased by B. Here is the fix, and it costs one header in each direction.</p>
<pre><code><span class="tok-keyword">const</span> <span class="tok-fn">etagOf</span> = (note) =&gt;
  \`"\${crypto.<span class="tok-fn">createHash</span>(<span class="tok-string">'sha1'</span>).<span class="tok-fn">update</span>(JSON.<span class="tok-fn">stringify</span>(note)).<span class="tok-fn">digest</span>(<span class="tok-string">'hex'</span>).<span class="tok-fn">slice</span>(<span class="tok-number">0</span>, <span class="tok-number">12</span>)}"\`;

app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">get</span>(+req.params.id);
  res.<span class="tok-fn">set</span>(<span class="tok-string">'ETag'</span>, <span class="tok-fn">etagOf</span>(note)).<span class="tok-fn">json</span>(note);
});

app.<span class="tok-fn">patch</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">get</span>(+req.params.id);
  <span class="tok-keyword">const</span> ifMatch = req.headers[<span class="tok-string">'if-match'</span>];
  <span class="tok-keyword">if</span> (!ifMatch)                  <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">428</span>).<span class="tok-fn">json</span>({ error: { code: <span class="tok-string">'PRECONDITION_REQUIRED'</span> } });
  <span class="tok-keyword">if</span> (ifMatch !== <span class="tok-fn">etagOf</span>(note)) <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">412</span>).<span class="tok-fn">json</span>({ error: { code: <span class="tok-string">'PRECONDITION_FAILED'</span> } });
  Object.<span class="tok-fn">assign</span>(note, req.body, { version: note.version + <span class="tok-number">1</span> });
  res.<span class="tok-fn">set</span>(<span class="tok-string">'ETag'</span>, <span class="tok-fn">etagOf</span>(note)).<span class="tok-fn">json</span>(note);
});</code></pre>
<p>The same two-editor scenario, run for real:</p>
<div class="out">GET  /notes/1                 → 200, ETag: "5e921251bfda"
     (A and B both hold that ETag)

A: PATCH If-Match: "5e921251bfda"  → 200  {"id":1,"title":"A edited","version":2}
B: PATCH If-Match: "5e921251bfda"  → 412  {"error":{"code":"PRECONDITION_FAILED",
                                            "message":"Someone else edited this note, reload"}}
C: PATCH (no If-Match)             → 428  {"error":{"code":"PRECONDITION_REQUIRED"}}

final state: {"id":1,"title":"A edited","version":2}   ← A's edit survived</div>
<div class="callout ok">B gets a 412 instead of silently destroying A's work, and the client knows exactly what to do: reload, show the difference, let the human decide. This is <strong>optimistic</strong> concurrency — no locks, no waiting, and a conflict is only detected when it actually happens. The pessimistic alternative (lock the row while someone edits) means one forgotten browser tab blocks the note for everyone.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">412 vs 428</span><span class="v">412 = you sent a precondition and it failed. 428 = you sent no precondition and this endpoint requires one. Requiring it is a deliberate choice; it makes the safe path the only path.</span></div>
  <div class="kv"><span class="k">A version column works too</span><span class="v"><code>UPDATE … WHERE id=$1 AND version=$2</code> — zero rows affected means someone beat you to it. Same idea, enforced by the database. Chapter 7 uses this.</span></div>
  <div class="kv"><span class="k">Set the ETag before <code>res.json</code></span><span class="v">Express generates its own ETag in <code>send()</code> if none is set — set yours first, or you get a hash of the serialised body instead of the identity you meant.</span></div>
</div>

<h3>Idempotency keys — the double charge, prevented</h3>
<p>Lesson 6.1 showed that POST is not idempotent, so a retry creates a second resource. For a note that is annoying; for a payment it is a refund request and an apology. The standard fix is a client-generated key:</p>
<pre><code>app.<span class="tok-fn">post</span>(<span class="tok-string">'/payments'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> key = req.headers[<span class="tok-string">'idempotency-key'</span>];
  <span class="tok-keyword">if</span> (!key) <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">400</span>).<span class="tok-fn">json</span>({ error: { code: <span class="tok-string">'IDEMPOTENCY_KEY_REQUIRED'</span> } });

  <span class="tok-keyword">if</span> (store.<span class="tok-fn">has</span>(key)) {                       <span class="tok-comment">// seen it — replay, do NOT re-charge</span>
    <span class="tok-keyword">const</span> saved = store.<span class="tok-fn">get</span>(key);
    <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(saved.status).<span class="tok-fn">set</span>(<span class="tok-string">'Idempotent-Replay'</span>, <span class="tok-string">'true'</span>).<span class="tok-fn">json</span>(saved.body);
  }
  <span class="tok-keyword">const</span> payment = <span class="tok-fn">charge</span>(req.body.amount);
  store.<span class="tok-fn">set</span>(key, { status: <span class="tok-number">201</span>, body: payment });
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>(payment);
});</code></pre>
<div class="out">call 1  Idempotency-Key: 7f3a…  → 201  {"id":"27d79403","amount":250000,"charged":true}
call 2  Idempotency-Key: 7f3a…  → 201  {"id":"27d79403","amount":250000,"charged":true}
                                   Idempotent-Replay: true      ← same id, charged ONCE
call 3  Idempotency-Key: 91b2…  → 201  {"id":"4e7e8308","amount":250000,"charged":true}
                                                                  ← new key = new payment</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The client generates the key</span><span class="v">One UUID per user intent — created when the button is pressed, reused by every retry of that same press.</span></div>
  <div class="kv"><span class="k">Store it where it survives</span><span class="v">A <code>Map</code> works in a demo; in production it is a table or a Redis key with a TTL (24h is typical). An in-memory map is per-process, so with two containers the retry can land on the one that has never seen the key.</span></div>
  <div class="kv"><span class="k">Save the response, not just the key</span><span class="v">A retry must get the same body, not a 409. The client cannot tell the difference between "lost response" and "never sent".</span></div>
  <div class="kv"><span class="k">Guard the race too</span><span class="v">Two retries can arrive simultaneously. Insert the key with a unique constraint <em>before</em> doing the work, so the second one loses the insert and waits or replays.</span></div>
</div>
<div class="callout warn">Payment providers require this header for exactly this reason. If you are writing a client for one, generate the key at the moment of user intent — not inside the retry loop, which would produce a fresh key per attempt and defeat the entire mechanism.</div>

<h3>Documenting the contract</h3>
<pre><code><span class="tok-comment"># OpenAPI — generated from the same zod schemas, never hand-written</span>
paths:
  /api/v1/notes:
    get:  { summary: List notes,  parameters: [page, limit, sort, order] }
    post: { summary: Create note, requestBody: CreateNote, responses: { 201, 422 } }</code></pre>
<div class="callout">Hand-written API docs are wrong within a month — this is not a discipline problem, it is that nothing forces them to be right. Generate them from the schemas you already wrote in lesson 6.3 (<code>zod-to-openapi</code> and friends), so the documentation cannot drift from the validator without the build failing. Documentation that is a by-product of the code is the only kind that stays true.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Deprecate before removing</span><span class="v">Announce, add a <code>Deprecation</code> header, log who is still calling it, remove only when the log is empty.</span></div>
  <div class="kv"><span class="k">Log the client version</span><span class="v">You cannot plan a removal if you cannot answer "who still uses v1?"</span></div>
  <div class="kv"><span class="k">Additive by default</span><span class="v">The cheapest migration is the one where old clients never notice.</span></div>
</div>
<div class="note-ct">Everything on this site lives under <code>/api/v1</code> and has never needed a v2 — because every change so far has been expressible as an added optional field. The one place with a genuine contract obligation is media upload, where a retry after a dropped connection must not create a second file; the pattern there is exactly the key-then-work ordering described above.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — RESTful API Design and Implementation</span><span class="lc-sub">Versioning, caching headers and API contracts.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Hợp đồng API: phiên bản, ETag, idempotency</h2>
<p class="lead">Một API là lời hứa với thứ code mà bạn không kiểm soát. Ứng dụng web thì bạn deploy lại trong một phút; còn ứng dụng di động thì nằm trên điện thoại người ta với một phiên bản từ tám tháng trước, và một đối tác tích hợp sẽ đọc cái email bạn thông báo thay đổi sau khi tích hợp của họ vỡ được ba tuần. Bài này nói về chuyện giữ lời hứa.</p>

<h3>Thế nào là một thay đổi phá vỡ tương thích</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✗ Phá vỡ</span><span class="v">Bỏ một trường · đổi tên trường · đổi kiểu (<code>"42"</code> → <code>42</code>) · thêm một trường bắt buộc vào request · siết chặt luật kiểm tra · đổi mã trạng thái · đổi ý nghĩa của một giá trị đang có.</span></div>
  <div class="kv"><span class="k">✓ An toàn</span><span class="v">Thêm một trường tuỳ chọn vào phản hồi · thêm một trường tuỳ chọn có mặc định vào request · thêm endpoint mới · thêm một giá trị enum mới <em>nếu</em> client đã được dặn phải bỏ qua giá trị lạ.</span></div>
</div>
<div class="pitfall">Cái mà ai cũng đánh giá thấp: <strong>siết chặt luật kiểm tra cũng là thay đổi phá vỡ tương thích</strong>. Thêm <code>.max(200)</code> vào một trường title vốn nhận mọi độ dài sẽ bắt đầu từ chối những request hôm qua vẫn chạy, từ một client mà bạn không cập nhật được. Chuyện tương tự với việc biến một trường tuỳ chọn thành bắt buộc. Nới lỏng thì an toàn; siết chặt thì không — mà cả hai đều không hiện lên trong buổi review code với nhãn "phá vỡ tương thích".</div>

<h3>Đánh phiên bản</h3>
<pre><code>app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v1/notes'</span>, notesRouterV1);
app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v2/notes'</span>, notesRouterV2);   <span class="tok-comment">// client cũ vẫn chạy</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nằm trong URL</span><span class="v"><code>/api/v1/…</code>. Xấu với người thuần khiết, nhưng nhìn thấy ngay trong log, định tuyến dễ, curl dễ. Phần lớn API làm thế, kể cả API này.</span></div>
  <div class="kv"><span class="k">Nằm trong header</span><span class="v"><code>Accept: application/vnd.api+json;version=2</code>. URL sạch hơn; nhưng khó gỡ lỗi hơn, khó cache hơn, và không dán được vào trình duyệt.</span></div>
  <div class="kv"><span class="k">Tốt nhất: đừng đánh phiên bản</span><span class="v">Chỉ thêm, không bao giờ bỏ. Có v2 nghĩa là nuôi hai nhánh code mãi mãi — phần lớn thay đổi "phá vỡ" đều diễn đạt lại được thành một trường thêm vào cộng với một giai đoạn báo ngừng dùng.</span></div>
</div>
<div class="callout ok">Hãy bắt đầu ở <code>/api/v1</code> ngay từ ngày đầu kể cả khi bạn không bao giờ ra v2. Thêm tiền tố phiên bản về sau nghĩa là sửa mọi client; còn có sẵn nó từ đầu thì tốn ba ký tự.</div>

<h3>Kiểm soát đồng thời lạc quan: <code>ETag</code> + <code>If-Match</code></h3>
<p>Bài 6.1 đã trình diễn cú mất bản ghi — sửa đổi của A bị B xoá sạch trong im lặng. Đây là cách chữa, và nó tốn đúng một header mỗi chiều.</p>
<pre><code><span class="tok-keyword">const</span> <span class="tok-fn">etagOf</span> = (note) =&gt;
  \`"\${crypto.<span class="tok-fn">createHash</span>(<span class="tok-string">'sha1'</span>).<span class="tok-fn">update</span>(JSON.<span class="tok-fn">stringify</span>(note)).<span class="tok-fn">digest</span>(<span class="tok-string">'hex'</span>).<span class="tok-fn">slice</span>(<span class="tok-number">0</span>, <span class="tok-number">12</span>)}"\`;

app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">get</span>(+req.params.id);
  res.<span class="tok-fn">set</span>(<span class="tok-string">'ETag'</span>, <span class="tok-fn">etagOf</span>(note)).<span class="tok-fn">json</span>(note);
});

app.<span class="tok-fn">patch</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">get</span>(+req.params.id);
  <span class="tok-keyword">const</span> ifMatch = req.headers[<span class="tok-string">'if-match'</span>];
  <span class="tok-keyword">if</span> (!ifMatch)                  <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">428</span>).<span class="tok-fn">json</span>({ error: { code: <span class="tok-string">'PRECONDITION_REQUIRED'</span> } });
  <span class="tok-keyword">if</span> (ifMatch !== <span class="tok-fn">etagOf</span>(note)) <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">412</span>).<span class="tok-fn">json</span>({ error: { code: <span class="tok-string">'PRECONDITION_FAILED'</span> } });
  Object.<span class="tok-fn">assign</span>(note, req.body, { version: note.version + <span class="tok-number">1</span> });
  res.<span class="tok-fn">set</span>(<span class="tok-string">'ETag'</span>, <span class="tok-fn">etagOf</span>(note)).<span class="tok-fn">json</span>(note);
});</code></pre>
<p>Vẫn kịch bản hai người sửa đó, chạy thật:</p>
<div class="out">GET  /notes/1                 → 200, ETag: "5e921251bfda"
     (A và B cùng giữ ETag đó)

A: PATCH If-Match: "5e921251bfda"  → 200  {"id":1,"title":"A sửa","version":2}
B: PATCH If-Match: "5e921251bfda"  → 412  {"error":{"code":"PRECONDITION_FAILED",
                                            "message":"Ghi chú đã bị người khác sửa, hãy tải lại"}}
C: PATCH (không gửi If-Match)      → 428  {"error":{"code":"PRECONDITION_REQUIRED"}}

trạng thái cuối: {"id":1,"title":"A sửa","version":2}   ← sửa đổi của A sống sót</div>
<div class="callout ok">B nhận mã 412 thay vì âm thầm phá huỷ công sức của A, và client biết chính xác phải làm gì: tải lại, cho xem chỗ khác nhau, để con người quyết định. Đây là kiểm soát đồng thời <strong>lạc quan</strong> — không khoá, không chờ, và xung đột chỉ bị phát hiện khi nó thật sự xảy ra. Phương án bi quan (khoá dòng dữ liệu suốt lúc ai đó đang sửa) nghĩa là một tab trình duyệt bỏ quên sẽ chặn ghi chú đó với tất cả mọi người.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">412 và 428</span><span class="v">412 = bạn có gửi điều kiện tiên quyết và nó không thoả. 428 = bạn không gửi điều kiện nào mà endpoint này thì bắt buộc phải có. Việc bắt buộc là một lựa chọn có chủ đích; nó biến con đường an toàn thành con đường duy nhất.</span></div>
  <div class="kv"><span class="k">Một cột version cũng làm được</span><span class="v"><code>UPDATE … WHERE id=$1 AND version=$2</code> — không dòng nào bị ảnh hưởng nghĩa là có người nhanh tay hơn. Cùng ý tưởng, do cơ sở dữ liệu thi hành. Chương 7 dùng cách này.</span></div>
  <div class="kv"><span class="k">Đặt ETag TRƯỚC <code>res.json</code></span><span class="v">Express tự sinh ETag riêng trong <code>send()</code> nếu chưa có — hãy đặt của bạn trước, không thì bạn nhận về một mã băm của phần body đã tuần tự hoá chứ không phải cái định danh bạn muốn.</span></div>
</div>

<h3>Khoá idempotency — chặn đứng cú trừ tiền hai lần</h3>
<p>Bài 6.1 đã cho thấy POST không bất biến, nên một lần thử lại sẽ tạo ra tài nguyên thứ hai. Với một ghi chú thì chỉ khó chịu; với một giao dịch thanh toán thì đó là một yêu cầu hoàn tiền kèm một lời xin lỗi. Cách chữa tiêu chuẩn là một khoá do client sinh ra:</p>
<pre><code>app.<span class="tok-fn">post</span>(<span class="tok-string">'/payments'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> key = req.headers[<span class="tok-string">'idempotency-key'</span>];
  <span class="tok-keyword">if</span> (!key) <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">400</span>).<span class="tok-fn">json</span>({ error: { code: <span class="tok-string">'IDEMPOTENCY_KEY_REQUIRED'</span> } });

  <span class="tok-keyword">if</span> (store.<span class="tok-fn">has</span>(key)) {                       <span class="tok-comment">// đã gặp rồi — phát lại, KHÔNG trừ tiền nữa</span>
    <span class="tok-keyword">const</span> saved = store.<span class="tok-fn">get</span>(key);
    <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(saved.status).<span class="tok-fn">set</span>(<span class="tok-string">'Idempotent-Replay'</span>, <span class="tok-string">'true'</span>).<span class="tok-fn">json</span>(saved.body);
  }
  <span class="tok-keyword">const</span> payment = <span class="tok-fn">charge</span>(req.body.amount);
  store.<span class="tok-fn">set</span>(key, { status: <span class="tok-number">201</span>, body: payment });
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>(payment);
});</code></pre>
<div class="out">lần 1  Idempotency-Key: 7f3a…  → 201  {"id":"27d79403","amount":250000,"charged":true}
lần 2  Idempotency-Key: 7f3a…  → 201  {"id":"27d79403","amount":250000,"charged":true}
                                  Idempotent-Replay: true    ← cùng id, chỉ trừ tiền MỘT lần
lần 3  Idempotency-Key: 91b2…  → 201  {"id":"4e7e8308","amount":250000,"charged":true}
                                                             ← khoá mới = giao dịch mới</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Client sinh ra khoá</span><span class="v">Một UUID cho mỗi ý định của người dùng — tạo ra lúc bấm nút, và mọi lần thử lại của chính cú bấm đó đều dùng lại nó.</span></div>
  <div class="kv"><span class="k">Lưu ở nơi sống sót được</span><span class="v">Một <code>Map</code> thì đủ cho bản demo; còn trên production đó là một bảng hoặc một khoá Redis có TTL (24 giờ là thường thấy). Map trong bộ nhớ là của riêng từng tiến trình, nên với hai container thì cú thử lại có thể rơi vào con chưa từng thấy khoá đó.</span></div>
  <div class="kv"><span class="k">Lưu cả phản hồi, không chỉ khoá</span><span class="v">Lần thử lại phải nhận đúng body cũ, không phải một mã 409. Client không phân biệt được "mất phản hồi" với "chưa từng gửi".</span></div>
  <div class="kv"><span class="k">Chặn cả cuộc đua</span><span class="v">Hai lần thử lại có thể tới cùng lúc. Hãy chèn khoá kèm ràng buộc duy nhất <em>trước khi</em> làm việc chính, để cái thứ hai thua ở phép chèn rồi chờ hoặc phát lại.</span></div>
</div>
<div class="callout warn">Các nhà cung cấp thanh toán bắt buộc header này đúng vì lý do trên. Nếu bạn đang viết client cho một trong số họ, hãy sinh khoá tại thời điểm người dùng có ý định — đừng sinh bên trong vòng lặp thử lại, vì như vậy mỗi lần thử lại sẽ ra một khoá mới và vô hiệu hoá toàn bộ cơ chế.</div>

<h3>Viết tài liệu cho bản hợp đồng</h3>
<pre><code><span class="tok-comment"># OpenAPI — sinh ra từ chính các lược đồ zod, không bao giờ viết tay</span>
paths:
  /api/v1/notes:
    get:  { summary: Liệt kê ghi chú, parameters: [page, limit, sort, order] }
    post: { summary: Tạo ghi chú,     requestBody: CreateNote, responses: { 201, 422 } }</code></pre>
<div class="callout">Tài liệu API viết tay sẽ sai trong vòng một tháng — đó không phải vấn đề kỷ luật, mà là vì chẳng có gì bắt nó phải đúng. Hãy sinh nó từ những lược đồ bạn đã viết ở bài 6.3 (dùng <code>zod-to-openapi</code> và các thư viện tương tự), để tài liệu không thể lệch khỏi bộ kiểm mà bản build vẫn xanh. Tài liệu là sản phẩm phụ của code mới là loại tài liệu duy nhất giữ được sự thật.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Báo ngừng dùng trước khi xoá</span><span class="v">Thông báo, thêm header <code>Deprecation</code>, ghi log xem ai còn gọi, và chỉ xoá khi log đã sạch.</span></div>
  <div class="kv"><span class="k">Ghi log phiên bản client</span><span class="v">Bạn không lên kế hoạch gỡ bỏ được nếu không trả lời nổi câu "ai còn dùng v1?"</span></div>
  <div class="kv"><span class="k">Mặc định là chỉ thêm vào</span><span class="v">Cuộc di trú rẻ nhất là cuộc di trú mà client cũ không hề hay biết.</span></div>
</div>
<div class="note-ct">Mọi thứ trên website này nằm dưới <code>/api/v1</code> và chưa bao giờ cần tới v2 — vì tới giờ mọi thay đổi đều diễn đạt được thành một trường tuỳ chọn thêm vào. Chỗ duy nhất có nghĩa vụ hợp đồng thật sự là phần tải file lên, nơi một lần thử lại sau khi rớt kết nối không được phép tạo ra file thứ hai; khuôn mẫu ở đó đúng là thứ tự ghi-khoá-trước-làm-việc-sau mô tả ở trên.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — Thiết kế &amp; hiện thực REST API</span><span class="lc-sub">Đánh phiên bản, header cache và hợp đồng API.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 6.6 QUIZ ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra chương 6',
      slug: 'nodejs-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về phương thức, mã trạng thái, kiểm tra dữ liệu, phân trang và hợp đồng API.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">This chapter has no framework in it — every answer here would be the same in Go, Java or Python. That is the point: chapter 5 taught you a tool, chapter 6 taught you a set of decisions that outlive the tool.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Chương này không có framework nào bên trong — mọi câu trả lời ở đây sẽ y hệt nếu bạn viết bằng Go, Java hay Python. Đó chính là ý đồ: chương 5 dạy bạn một công cụ, chương 6 dạy bạn một tập quyết định sống lâu hơn công cụ đó.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which HTTP method is NOT idempotent?|||Phương thức HTTP nào KHÔNG bất biến (không idempotent)?',
            options: ['GET', 'PUT', 'DELETE', 'POST'],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A logged-in user requests something they lack permission for. Which status?|||Một người dùng đã đăng nhập gọi tới thứ họ không có quyền. Trả mã nào?',
            options: [
              '401 — so the client refreshes the token and retries|||401 — để client làm mới token rồi gọi lại',
              '403 — logging in again would not help|||403 — đăng nhập lại cũng không giúp được gì',
              '400 — the request is bad|||400 — request bị sai',
              '500 — the server refused|||500 — server đã từ chối',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A user registers with an email that already exists. Which status fits best?|||Người dùng đăng ký bằng một email đã tồn tại. Mã nào hợp nhất?',
            options: [
              '422 — the data is invalid|||422 — dữ liệu không hợp lệ',
              '409 — the data is fine but it conflicts with current state|||409 — dữ liệu ổn nhưng xung đột với trạng thái hiện tại',
              '400 — bad request|||400 — request sai',
              '404 — not found|||404 — không tìm thấy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On a 1,000,000-row table, how many rows does "LIMIT 20 OFFSET 999980" make PostgreSQL read?|||Trên bảng 1.000.000 dòng, lệnh "LIMIT 20 OFFSET 999980" khiến PostgreSQL đọc bao nhiêu dòng?',
            options: [
              '20 — the index jumps straight there|||20 — chỉ mục nhảy thẳng tới đó',
              '1,000 — one page worth|||1.000 — vừa đúng một trang',
              '1,000,000 — every row, discarding all but the last 20|||1.000.000 — mọi dòng, rồi vứt hết trừ 20 dòng cuối',
              '0 — the result is cached|||0 — kết quả đã được cache',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why does offset pagination show duplicate items on a busy feed?|||Vì sao phân trang bằng OFFSET lại hiện trùng bản ghi trên một bảng tin đông người?',
            options: [
              'The database cache is stale|||Cache của cơ sở dữ liệu bị cũ',
              'A row inserted between page 1 and page 2 shifts every position down by one|||Một dòng chèn vào giữa lúc lật trang 1 sang trang 2 đẩy mọi vị trí xuống một bậc',
              'The client requested the same page twice|||Client đã gọi cùng một trang hai lần',
              'LIMIT and OFFSET cannot be combined|||LIMIT và OFFSET không dùng chung được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'zod\'s .object() strips unknown keys by default. Which attack does that prevent?|||Hàm .object() của zod mặc định vứt bỏ khoá lạ. Điều đó ngăn được đòn tấn công nào?',
            options: [
              'SQL injection|||Tiêm nhiễm SQL',
              'Mass assignment — the client setting fields like isAdmin that you never exposed|||Mass assignment — client tự đặt những trường như isAdmin mà bạn chưa bao giờ phơi ra',
              'Cross-site scripting|||Tấn công chạy mã trên trình duyệt (XSS)',
              'Brute-force login|||Dò mật khẩu bằng vét cạn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two users edit the same note. B sends If-Match with an ETag that is now stale. What should the server return?|||Hai người cùng sửa một ghi chú. B gửi If-Match kèm một ETag đã cũ. Server nên trả về gì?',
            options: [
              '200 — last write wins|||200 — ai ghi sau thì thắng',
              '409 Conflict, and apply the change anyway|||409 Conflict, nhưng vẫn áp dụng thay đổi',
              '412 Precondition Failed, and reject the write|||412 Precondition Failed, và từ chối ghi',
              '428 Precondition Required|||428 Precondition Required',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Which of these is a BREAKING change for existing clients?|||Thay đổi nào sau đây LÀ phá vỡ tương thích với client hiện có?',
            options: [
              'Adding a new optional field to the response|||Thêm một trường tuỳ chọn mới vào phản hồi',
              'Adding a brand new endpoint|||Thêm một endpoint hoàn toàn mới',
              'Adding max length validation to a field that previously accepted any length|||Thêm luật giới hạn độ dài cho một trường vốn nhận mọi độ dài',
              'Adding an optional request field with a default value|||Thêm một trường tuỳ chọn có giá trị mặc định vào request',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
