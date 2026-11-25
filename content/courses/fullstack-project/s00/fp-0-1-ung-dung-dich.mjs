/**
 * 0.1 — Ứng dụng đích ChiaSe (soạn 24/11/2026, agent fsp). Danh sách tính năng = README của dự án mẫu (scratchpad/fsp/chiase, tag ch1).
 * Sự cố có nguồn (GET 200, 24/11/2026): Wired, Andy Greenberg, 12/01/2021 "An Absurdly Basic Bug Let Anyone Grab All of Parler's Data";
 * Wikipedia "Parler" (mục Content scraping: xoá mềm, ~99% bài công khai bị cào, video giữ siêu dữ liệu GPS).
 * Ảnh chụp giao diện thật: bổ sung khi Chương 6 soạn xong (hiện là bản phác dạng chữ).
 */
import { nguon, lienKet, spring, esc } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-6-1-tai-nguyen-phuong-thuc', title: 'Node.js 6.1 — Tài nguyên, phương thức, và REST thật sự là gì', sub: 'Vì sao API của ChiaSe đặt tên theo tài nguyên (/posts, /comments) chứ không theo hành động.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'object-storage', bai: 'os-0-0-bat-dau-tai-day', title: 'Object storage — Bắt đầu tại đây', sub: 'Vì sao ảnh không nằm trong PostgreSQL mà nằm trong kho kiểu S3/R2.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'Wired (12/01/2021) — An Absurdly Basic Bug Let Anyone Grab All of Parler\'s Data', 'ID bài tăng dần, không cần đăng nhập, không giới hạn tần suất, ảnh/video giữ vị trí GPS.', 'https://www.wired.com/story/parler-hack-data-public-posts-images-video/'),
  nguon('📖', 'Wikipedia — Parler (Content scraping)', 'Bài "đã xoá" chỉ bị gắn cờ ẩn (xoá mềm); khoảng 99% bài công khai bị cào trước khi trang sập.', 'https://en.wikipedia.org/wiki/Parler'),
].join('\n');

const KIEN_TRUC_EN = `flowchart LR
  B[Browser - React SPA] -->|HTTPS| N[Nginx]
  N -->|/| W[Static web files]
  N -->|/api and /socket.io| A[Express API]
  A --> P[(PostgreSQL)]
  A -->|presign| S[(S3 / R2 storage)]
  B -->|PUT image with presigned URL| S`;

const KIEN_TRUC_VI = `flowchart LR
  B[Trình duyệt - React SPA] -->|HTTPS| N[Nginx]
  N -->|/| W[Tệp web tĩnh]
  N -->|/api và /socket.io| A[API Express]
  A --> P[(PostgreSQL)]
  A -->|ký URL| S[(Kho ảnh S3 / R2)]
  B -->|PUT ảnh bằng URL đã ký| S`;

const PHAC = `┌───────────────────────────────────────────────┐
│ ChiaSe                     [Viết bài] [An ▾]  │
├───────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ │
│ │ Bình · 5 phút trước                       │ │
│ │ Sân bóng KTX mở lại tối nay               │ │
│ │ [            ảnh 16:9               ]     │ │
│ │ ♥ 12   💬 4                               │ │
│ └───────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────┐ │
│ │ An · 1 giờ trước                          │ │
│ │ Ai có đề PE môn PRJ301 kỳ trước không?    │ │
│ │ ♥ 3    💬 9                               │ │
│ └───────────────────────────────────────────┘ │
│            ( cuộn xuống để tải thêm )         │
└───────────────────────────────────────────────┘`;

export default {
  title: '0.1 — The target app: a small post-sharing network|||0.1 — Ứng dụng đích: mạng chia sẻ bài viết nhỏ',
  slug: 'fp-0-1-ung-dung-dich',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chín user story của ChiaSe, những gì CỐ TÌNH bỏ ra và vì sao, sơ đồ kiến trúc, bản phác giao diện, sáu đề tài cùng khuôn để tự chọn — và bài học Parler 2021 biến thành quyết định thiết kế.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · The target</span>
<h2>ChiaSe: small enough to finish, big enough to teach every join</h2>
<p class="lead">Before building, see the destination. ChiaSe is a small network where a class or a club shares short posts with one photo, comments and likes. It is chosen on purpose: it has <strong>every kind of join</strong> a real product has — users and ownership, files outside the database, one-to-many and many-to-many data, pagination, login that survives a refresh, live updates — and nothing that would take months.</p>

<h3>Everyday picture</h3>
<p>Think of your class Facebook group, minus the ads and the algorithm: a feed of posts, newest first; each post may have a picture; people comment and react. You use such a thing every day. Now you build it, and you will never look at a "like" button the same way again.</p>

<h3>The final feature list (v1)</h3>
<table>
<thead><tr><th>#</th><th>As a…</th><th>I want to…</th><th>Priority</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>U1</td><td>visitor</td><td>sign up with email + password</td><td>Must</td><td>3</td></tr>
<tr><td>U2</td><td>user</td><td>log in and stay logged in after a page reload</td><td>Must</td><td>3, 6</td></tr>
<tr><td>U3</td><td>user</td><td>create a post (title, body, at most one image), as draft or published</td><td>Must</td><td>4, 6</td></tr>
<tr><td>U4</td><td>author</td><td>edit / delete <strong>my own</strong> posts only</td><td>Must</td><td>4</td></tr>
<tr><td>U5</td><td>anyone</td><td>read the feed of published posts, newest first, scrolling loads more</td><td>Must</td><td>5, 6</td></tr>
<tr><td>U6</td><td>user</td><td>comment, and see comment counts in the feed</td><td>Must</td><td>5</td></tr>
<tr><td>U7</td><td>user</td><td>like / unlike a post, once per person</td><td>Should</td><td>5, 7</td></tr>
<tr><td>U8</td><td>reader of a post</td><td>see new comments appear without reloading</td><td>Should</td><td>7</td></tr>
<tr><td>U9</td><td>user</td><td>have location (GPS) data removed from my uploaded photos</td><td>Should</td><td>4</td></tr>
</tbody>
</table>

<h3>What is deliberately left out — and why</h3>
<ul>
<li><strong>Follow / friends</strong>: turns the feed into a per-user query with fan-out problems; a whole topic of its own.</li>
<li><strong>Private messages</strong>: different privacy rules, delivery receipts, abuse reporting.</li>
<li><strong>Several images, video</strong>: video needs transcoding; several images multiply every upload edge case.</li>
<li><strong>Search</strong>: needs full-text indexing (PostgreSQL course, chapter 13) — a good extension after the course.</li>
<li><strong>Password reset by email</strong>: needs an email provider and token flows; listed as an extension.</li>
<li><strong>Admin pages, i18n</strong>: useful, but they add screens, not new joins.</li>
</ul>
<p>Cutting is a skill, not laziness. Most student projects fail not because the team is weak but because v1 tried to be v3. Chapter 1 teaches how to cut.</p>

<h3>Architecture at a glance</h3>
<pre><code class="language-mermaid">${esc(KIEN_TRUC_EN)}</code></pre>
<ul>
<li>The browser loads a React single-page app (static files), then talks JSON to the API under <code>/api</code>.</li>
<li>The API owns business rules and the PostgreSQL database. Every route is under <code>/api</code> from day one, so in production one domain serves both (Nginx routes by path, no CORS needed).</li>
<li>Images never pass through the API: the API signs a short-lived upload URL, the browser uploads straight to S3-compatible storage (MinIO on your machine, Cloudflare R2 or S3 in production), and the database stores only the image <em>key</em>.</li>
</ul>

<h3>What the main screen will look like</h3>
<pre><code class="language-text">${PHAC}</code></pre>
<p>This is a sketch; a real screenshot is added when Chapter 6 is finished.</p>
<h3>The journey of one post with a photo</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Ask for an upload URL</span><span class="lz-d">POST /api/uploads/presign → the API checks you are logged in and returns a URL valid for a few minutes.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Upload the file</span><span class="lz-d">The browser PUTs the image straight to storage — the API never touches the bytes.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Create the post</span><span class="lz-d">POST /api/posts with title, body and the image key; the API checks the object exists.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Show it</span><span class="lz-d">GET /api/posts returns the post; the image URL is built from the key.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "v1 can have everything".</strong> The surest way not to finish is a v1 with follow, chat, search and video. Ship the nine stories; extensions come after Checkpoint 11.</p></div>

<h3>⚠️ Real incident: Parler, January 2021 — and the decisions it gives us</h3>
<p>In January 2021, just before the social network Parler went offline, a researcher downloaded about 99% of its public posts, including more than a million videos. Wired (Andy Greenberg, 12 January 2021) explained why it was easy: post URLs were <strong>sequential</strong> — "increase a value in a Parler post url by one, and you'd get the next post"; viewing public posts needed <strong>no authentication</strong>; there was <strong>no rate limiting</strong>; and images and videos kept their <strong>GPS metadata</strong>, exposing where users lived. Wikipedia adds that "deleted" posts were only flagged as hidden (soft delete), so they were downloaded too. Each mistake becomes a design decision in ChiaSe:</p>
<table>
<thead><tr><th>Parler's mistake</th><th>ChiaSe's decision</th><th>Where</th></tr></thead>
<tbody>
<tr><td>IDs 1, 2, 3… guessable</td><td>UUIDv7 ids (time-ordered, not guessable); access rules checked on every route anyway</td><td>1.2, 4.1</td></tr>
<tr><td>No rate limiting</td><td>Rate limit login and write routes</td><td>3, 5</td></tr>
<tr><td>GPS kept in photos</td><td>Strip metadata from uploaded images (U9)</td><td>4.3</td></tr>
<tr><td>"Deleted" = hidden flag, still served</td><td>Deleting a post really deletes it and its comments (cascade); the image is removed from storage</td><td>4.4, 5.1</td></tr>
</tbody>
</table>

<h3>Six topics with the same shape — pick yours</h3>
<p>All six share the same model (user → item with one photo → comments → likes), so every lesson applies unchanged. Lessons show ChiaSe; rename freely.</p>
<ol>
<li><strong>ChiaSe</strong> — class/club post feed (default).</li>
<li><strong>Dorm flea market</strong> — second-hand listings with a photo; comments to negotiate.</li>
<li><strong>Canteen reviews</strong> — a dish photo, a review, likes as "useful".</li>
<li><strong>Course Q&amp;A</strong> — a question with a screenshot; answers as comments.</li>
<li><strong>Lost &amp; found</strong> — a photo of the item, where it was found; comments to claim.</li>
<li><strong>Club events</strong> — event posts with a poster; comments to sign up.</li>
</ol>

${spring(true, 'The same feature list and architecture is exactly what an SWP391 team builds with Spring Boot. The capstone of the Spring Boot course (LabFlow) uses the same planning approach.', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — SPA + API architecture: dev proxy, CORS or same origin'],
])}

<h3>🎤 Interview corner</h3>
<ul>
<li><strong>"Describe the architecture of your project."</strong> — A React SPA served as static files; an Express API under /api; PostgreSQL via Prisma; images uploaded directly to S3-compatible storage with presigned URLs; Nginx in front routing by path; all in Docker, deployed by CI.</li>
<li><strong>"Why not store images in the database?"</strong> — Large binary rows bloat backups and the DB cache, and every download would go through the API. Object storage is cheaper, served by a CDN, and the DB keeps only the key.</li>
<li><strong>"What did you leave out and why?"</strong> — Show the "Won't" list. Interviewers like candidates who can scope.</li>
</ul>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok">
<ol>
<li>Pick a topic (ChiaSe or one of the six). Write the problem in <strong>one sentence</strong>: who, what they need, what you will not do.</li>
<li>Copy the table of nine user stories and rename the nouns for your topic.</li>
<li>Add one story you want, then decide honestly: Must, Should, or Won't for v1?</li>
</ol>
<p><strong>Done when:</strong> one sentence + nine (or ten) stories, each with a priority, saved in <code>docs/nhat-ky.md</code>.</p>
</div>
<details><summary>Example (Dorm flea market)</summary>
<p>"Students in one dormitory need a place to sell second-hand items with one photo and chat publicly about price; v1 has no payments and no private messages." Story U3 becomes "As a seller I want to list an item (name, price, description, one photo)…"; U7 "like" becomes "save for later". Payments: Won't — needs a payment provider and refunds.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user story</span><span class="v">"As a …, I want …, so that …" — one need, from the user's view.</span></div>
  <div class="kv"><span class="k">MoSCoW</span><span class="v">Must / Should / Could / Won't — a simple way to prioritise.</span></div>
  <div class="kv"><span class="k">SPA</span><span class="v">Single-page application: the page loads once, then JavaScript draws screens and calls the API.</span></div>
  <div class="kv"><span class="k">presigned URL</span><span class="v">A short-lived URL that lets the browser upload one file directly to storage.</span></div>
  <div class="kv"><span class="k">IDOR</span><span class="v">Insecure direct object reference: changing an id in a URL gives access to someone else's data.</span></div>
  <div class="kv"><span class="k">soft delete</span><span class="v">Marking a row as deleted instead of removing it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>ChiaSe = users, posts with one image, comments, likes, live comments — nine stories, six deliberate cuts.</li>
<li>React SPA + Express API under /api + PostgreSQL + direct-to-storage image upload, behind Nginx.</li>
<li>Parler 2021: sequential ids, no auth, no rate limit, GPS in photos, soft delete — each becomes a ChiaSe decision.</li>
<li>Six topics share the same model; pick one and rename.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Đích đến</span>
<h2>ChiaSe: đủ nhỏ để làm xong, đủ lớn để dạy mọi mối nối</h2>
<p class="lead">Trước khi xây, hãy nhìn đích đến. ChiaSe là một mạng nhỏ nơi một lớp học hay một câu lạc bộ chia sẻ bài viết ngắn kèm một ảnh, bình luận và thả tim. Đề tài này được chọn có chủ ý: nó có <strong>đủ mọi loại mối nối</strong> mà sản phẩm thật có — người dùng và quyền sở hữu, tệp nằm ngoài cơ sở dữ liệu, dữ liệu một-nhiều và nhiều-nhiều, phân trang, đăng nhập sống sót qua F5, cập nhật tức thời — và không có thứ gì tốn hàng tháng.</p>

<h3>Liên tưởng đời thường</h3>
<p>Hãy nghĩ tới nhóm Facebook của lớp bạn, bỏ quảng cáo và thuật toán: một bảng tin, bài mới nhất ở trên; bài có thể kèm ảnh; mọi người bình luận và thả cảm xúc. Ngày nào bạn cũng dùng thứ như vậy. Giờ bạn tự xây nó, và sẽ không bao giờ nhìn nút "thích" theo cách cũ nữa.</p>

<h3>Danh sách tính năng cuối cùng (v1)</h3>
<table>
<thead><tr><th>#</th><th>Là…</th><th>tôi muốn…</th><th>Ưu tiên</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>U1</td><td>khách</td><td>đăng ký bằng email + mật khẩu</td><td>Phải có</td><td>3</td></tr>
<tr><td>U2</td><td>người dùng</td><td>đăng nhập và vẫn còn đăng nhập sau khi tải lại trang</td><td>Phải có</td><td>3, 6</td></tr>
<tr><td>U3</td><td>người dùng</td><td>tạo bài (tiêu đề, nội dung, tối đa một ảnh), lưu nháp hoặc đăng</td><td>Phải có</td><td>4, 6</td></tr>
<tr><td>U4</td><td>tác giả</td><td>sửa / xoá <strong>chỉ bài của mình</strong></td><td>Phải có</td><td>4</td></tr>
<tr><td>U5</td><td>bất kỳ ai</td><td>xem bảng tin bài đã đăng, mới nhất trước, cuộn để tải thêm</td><td>Phải có</td><td>5, 6</td></tr>
<tr><td>U6</td><td>người dùng</td><td>bình luận, và thấy số bình luận ngay ở bảng tin</td><td>Phải có</td><td>5</td></tr>
<tr><td>U7</td><td>người dùng</td><td>thích / bỏ thích một bài, mỗi người một lần</td><td>Nên có</td><td>5, 7</td></tr>
<tr><td>U8</td><td>người đang đọc bài</td><td>thấy bình luận mới hiện ra không cần tải lại</td><td>Nên có</td><td>7</td></tr>
<tr><td>U9</td><td>người dùng</td><td>ảnh mình tải lên được xoá thông tin vị trí (GPS)</td><td>Nên có</td><td>4</td></tr>
</tbody>
</table>

<h3>Những gì CỐ TÌNH bỏ ra — và vì sao</h3>
<ul>
<li><strong>Theo dõi / kết bạn</strong>: biến bảng tin thành truy vấn riêng cho từng người, kéo theo bài toán "fan-out"; là cả một chủ đề riêng.</li>
<li><strong>Nhắn tin riêng</strong>: luật riêng tư khác hẳn, trạng thái đã nhận/đã xem, báo cáo lạm dụng.</li>
<li><strong>Nhiều ảnh, video</strong>: video cần chuyển mã; nhiều ảnh nhân mọi trường hợp lỗi khi tải lên.</li>
<li><strong>Tìm kiếm</strong>: cần chỉ mục toàn văn (khoá PostgreSQL, chương 13) — hướng mở rộng tốt sau khoá.</li>
<li><strong>Quên mật khẩu qua email</strong>: cần nhà cung cấp email và luồng token; để vào danh sách mở rộng.</li>
<li><strong>Trang quản trị, đa ngôn ngữ</strong>: có ích, nhưng chỉ thêm màn hình, không thêm mối nối mới.</li>
</ul>
<p>Cắt bớt là một kỹ năng, không phải lười. Phần lớn đồ án sinh viên hỏng không phải vì nhóm yếu mà vì bản 1 cố làm thành bản 3. Chương 1 dạy cách cắt.</p>

<h3>Kiến trúc nhìn một lượt</h3>
<pre><code class="language-mermaid">${esc(KIEN_TRUC_VI)}</code></pre>
<ul>
<li>Trình duyệt tải một ứng dụng React một trang (tệp tĩnh), rồi trao đổi JSON với API dưới đường dẫn <code>/api</code>.</li>
<li>API giữ luật nghiệp vụ và cơ sở dữ liệu PostgreSQL. Mọi route nằm dưới <code>/api</code> ngay từ ngày đầu, để trên production một tên miền phục vụ cả hai (Nginx chia theo đường dẫn, không cần CORS).</li>
<li>Ảnh không bao giờ đi qua API: API ký một URL tải lên sống ngắn, trình duyệt tải thẳng lên kho kiểu S3 (MinIO trên máy bạn, Cloudflare R2 hoặc S3 trên production), và cơ sở dữ liệu chỉ lưu <em>khoá</em> (key) của ảnh.</li>
</ul>

<h3>Màn hình chính sẽ trông thế nào</h3>
<pre><code class="language-text">${PHAC}</code></pre>
<p>Đây là bản phác; ảnh chụp thật được thêm khi Chương 6 xong.</p>
<h3>Hành trình của một bài viết có ảnh</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xin URL tải lên</span><span class="lz-d">POST /api/uploads/presign → API kiểm bạn đã đăng nhập và trả một URL có hạn vài phút.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tải tệp</span><span class="lz-d">Trình duyệt PUT ảnh thẳng lên kho — API không hề chạm vào các byte của ảnh.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tạo bài</span><span class="lz-d">POST /api/posts kèm tiêu đề, nội dung và khoá ảnh; API kiểm đối tượng có tồn tại.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hiển thị</span><span class="lz-d">GET /api/posts trả bài; URL ảnh được dựng từ khoá.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "v1 có đủ mọi thứ".</strong> Cách chắc chắn nhất để không làm xong là một v1 có theo dõi, nhắn tin, tìm kiếm và video. Giao chín story trước; phần mở rộng để sau Checkpoint 11.</p></div>

<h3>⚠️ Sự cố thật: Parler, tháng 1/2021 — và những quyết định nó cho ta</h3>
<p>Tháng 1/2021, ngay trước khi mạng xã hội Parler sập, một nhà nghiên cứu đã tải về khoảng 99% bài công khai của nó, gồm hơn một triệu video. Wired (Andy Greenberg, 12/01/2021) giải thích vì sao dễ vậy: địa chỉ bài viết <strong>tăng dần</strong> — "tăng giá trị trong URL bài Parler lên một là ra bài kế tiếp"; xem bài công khai <strong>không cần đăng nhập</strong>; <strong>không giới hạn tần suất</strong>; và ảnh, video còn giữ <strong>siêu dữ liệu GPS</strong>, làm lộ nơi người dùng sống. Wikipedia bổ sung: bài "đã xoá" chỉ bị gắn cờ ẩn (xoá mềm), nên cũng bị tải về. Mỗi sai lầm thành một quyết định thiết kế của ChiaSe:</p>
<table>
<thead><tr><th>Sai lầm của Parler</th><th>Quyết định của ChiaSe</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>ID 1, 2, 3… đoán được</td><td>ID dạng UUIDv7 (tăng theo thời gian, không đoán được); dù vậy mọi route vẫn kiểm quyền</td><td>1.2, 4.1</td></tr>
<tr><td>Không giới hạn tần suất</td><td>Giới hạn tần suất route đăng nhập và route ghi</td><td>3, 5</td></tr>
<tr><td>Ảnh giữ GPS</td><td>Xoá siêu dữ liệu ảnh tải lên (U9)</td><td>4.3</td></tr>
<tr><td>"Đã xoá" = cờ ẩn, vẫn phục vụ</td><td>Xoá bài là xoá thật, kéo theo bình luận (cascade); ảnh bị gỡ khỏi kho</td><td>4.4, 5.1</td></tr>
</tbody>
</table>

<h3>Sáu đề tài cùng khuôn — chọn của bạn</h3>
<p>Cả sáu dùng cùng một mô hình (người dùng → mục có một ảnh → bình luận → lượt thích), nên mọi bài áp dụng nguyên vẹn. Bài giảng dùng ChiaSe; bạn cứ đổi tên.</p>
<ol>
<li><strong>ChiaSe</strong> — bảng tin của lớp/CLB (mặc định).</li>
<li><strong>Chợ đồ cũ KTX</strong> — đăng đồ cũ kèm ảnh; bình luận để trả giá.</li>
<li><strong>Review căng tin</strong> — ảnh món, bài nhận xét, lượt thích là "hữu ích".</li>
<li><strong>Hỏi đáp môn học</strong> — câu hỏi kèm ảnh chụp màn hình; câu trả lời là bình luận.</li>
<li><strong>Đồ thất lạc</strong> — ảnh đồ vật, nơi nhặt được; bình luận để nhận lại.</li>
<li><strong>Sự kiện CLB</strong> — bài sự kiện kèm poster; bình luận để đăng ký.</li>
</ol>

${spring(false, 'Đúng danh sách tính năng và kiến trúc này là thứ một nhóm SWP391 xây bằng Spring Boot. Dự án cuối khoá Spring Boot (LabFlow) dùng cùng cách lên kế hoạch.', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — Kiến trúc SPA + API: dev proxy, CORS hay cùng origin'],
])}

<h3>🎤 Góc phỏng vấn</h3>
<ul>
<li><strong>"Mô tả kiến trúc dự án của bạn."</strong> — SPA React phục vụ dạng tệp tĩnh; API Express dưới /api; PostgreSQL qua Prisma; ảnh tải thẳng lên kho kiểu S3 bằng presigned URL; Nginx đứng trước chia theo đường dẫn; tất cả trong Docker, deploy bằng CI.</li>
<li><strong>"Sao không lưu ảnh trong cơ sở dữ liệu?"</strong> — Dòng nhị phân lớn làm phình bản sao lưu và bộ đệm CSDL, mỗi lần tải ảnh lại phải đi qua API. Object storage rẻ hơn, phục vụ qua CDN, CSDL chỉ giữ khoá.</li>
<li><strong>"Bạn đã bỏ gì ra, vì sao?"</strong> — Đưa danh sách "Không làm". Nhà tuyển dụng thích ứng viên biết khoanh phạm vi.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chọn đề tài (ChiaSe hoặc một trong sáu). Viết bài toán trong <strong>một câu</strong>: ai, họ cần gì, bạn sẽ KHÔNG làm gì.</li>
<li>Chép bảng chín user story và đổi danh từ theo đề tài của bạn.</li>
<li>Thêm một story bạn muốn, rồi quyết định thật lòng: Phải có, Nên có, hay Không làm ở v1?</li>
</ol>
<p><strong>Xong khi:</strong> một câu + chín (hoặc mười) story, mỗi story có mức ưu tiên, lưu trong <code>docs/nhat-ky.md</code>.</p>
</div>
<details><summary>Ví dụ (Chợ đồ cũ KTX)</summary>
<p>"Sinh viên một KTX cần chỗ bán đồ cũ kèm một ảnh và trao đổi giá công khai; v1 không có thanh toán và không nhắn riêng." Story U3 thành "Là người bán, tôi muốn đăng một món (tên, giá, mô tả, một ảnh)…"; U7 "thích" thành "lưu để xem sau". Thanh toán: Không làm — cần nhà cung cấp thanh toán và hoàn tiền.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user story</span><span class="v">"Là …, tôi muốn …, để …" — một nhu cầu, nhìn từ phía người dùng.</span></div>
  <div class="kv"><span class="k">MoSCoW</span><span class="v">Must / Should / Could / Won't — cách xếp ưu tiên đơn giản.</span></div>
  <div class="kv"><span class="k">SPA</span><span class="v">Ứng dụng một trang: tải trang một lần, sau đó JavaScript vẽ màn hình và gọi API.</span></div>
  <div class="kv"><span class="k">presigned URL</span><span class="v">URL sống ngắn cho phép trình duyệt tải một tệp thẳng lên kho.</span></div>
  <div class="kv"><span class="k">IDOR</span><span class="v">Tham chiếu đối tượng trực tiếp không an toàn: đổi id trên URL là xem được dữ liệu người khác.</span></div>
  <div class="kv"><span class="k">soft delete (xoá mềm)</span><span class="v">Đánh dấu một dòng là đã xoá thay vì xoá thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>ChiaSe = người dùng, bài có một ảnh, bình luận, lượt thích, bình luận tức thời — chín story, sáu chỗ cố tình cắt.</li>
<li>SPA React + API Express dưới /api + PostgreSQL + tải ảnh thẳng lên kho, đứng sau Nginx.</li>
<li>Parler 2021: ID tăng dần, không xác thực, không giới hạn tần suất, ảnh giữ GPS, xoá mềm — mỗi lỗi thành một quyết định của ChiaSe.</li>
<li>Sáu đề tài cùng mô hình; chọn một và đổi tên.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
