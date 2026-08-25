/**
 * Authentication — Mục 0: Bài toán, và dựng môi trường chạy được.
 * Vì sao HTTP không nhớ ai · ba bài toán bị gộp làm một · dựng dự án chạy thật · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Section 0 — The problem, and a setup that runs|||Mục 0 — Bài toán, và một môi trường chạy được',
  description: 'Vì sao một giao thức không nhớ gì lại buộc mọi sản phẩm phải tự phát minh lại danh tính, ba bài toán mà chữ "login" gộp làm một, một dự án Node + Postgres chạy thật trong mười phút, và cú đăng nhập đầu tiên — cố ý làm SAI để thấy rõ từng thứ sẽ vá ở các chương sau.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — A protocol that forgets everything|||0.1 — Một giao thức quên sạch mọi thứ',
      slug: 'auth-0-1-giao-thuc-quen',
      type: 'LESSON',
      isFreePreview: true,
      description: 'HTTP không nhớ request trước, nên mọi sản phẩm đều phải tự dựng lại danh tính từ con số không. Bài này chỉ ra chính xác cái lỗ đó bằng hai lệnh curl, rồi giải thích vì sao mọi giải pháp — cookie, token, phiên — đều là biến thể của cùng một mẹo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>A protocol that forgets everything</h2>
<p class="lead">HTTP has no memory. Each request arrives as if it were the first one, from a stranger, with no connection to anything that came before. Every login system ever built exists to work around that single fact — and almost every authentication vulnerability is a bug in the workaround, not in the login.</p>

<h3>See the hole</h3>
<pre><code><span class="tok-comment"># Two requests to the same server, one second apart</span>
curl -s https://cuongthai.com/api/v1/auth/me
curl -s https://cuongthai.com/api/v1/auth/me</code></pre>
<div class="out">{"error":"Unauthorized","message":"Khong co token"}
{"error":"Unauthorized","message":"Khong co token"}</div>
<pre><code><span class="tok-comment"># The server's view of both requests, in full</span>
GET /api/v1/auth/me HTTP/1.1
Host: cuongthai.com
User-Agent: curl/8.5.0
Accept: */*

<span class="tok-comment"># That is everything. There is no "who".</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Stateless by design</span><span class="lz-t">Not an oversight</span><span class="lz-d">HTTP was specified to be stateless so that any server could answer any request. That is what makes load balancers, CDNs and horizontal scaling possible at all — and it is why the server cannot simply remember you.</span></div>
  <div class="lz-step"><span class="lz-k">The TCP connection is not identity</span><span class="lz-t">A common wrong assumption</span><span class="lz-d">HTTP/1.1 keep-alive and HTTP/2 multiplexing reuse a connection, but a proxy, a retry or a second tab breaks that. Anything built on "same connection means same user" fails the first time it meets real infrastructure.</span></div>
  <div class="lz-step"><span class="lz-k">The IP address is not identity</span><span class="lz-t">Worse than useless</span><span class="lz-d">Carrier NAT puts thousands of phones behind one address; a laptop moving from wifi to 4G changes address mid-session. Using IP as identity locks out real users and lets in strangers, simultaneously.</span></div>
  <div class="lz-step"><span class="lz-k">So the client must carry proof</span><span class="lz-t">The whole idea</span><span class="lz-d">If the server cannot remember, the client has to bring something with every request. Everything in this course — cookies, sessions, tokens, JWTs — is a variation on <em>what</em> that something is and <em>how hard it is to steal</em>.</span></div>
</div>

<h3>The workaround, in one line</h3>
<pre><code><span class="tok-comment"># The same request, carrying proof</span>
curl -s https://cuongthai.com/api/v1/auth/me \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"</code></pre>
<div class="out">{"id":"clx7…","username":"cuongthai","email":"cuong…@gmail.com","role":"ADMIN"}</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Once</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Prove who you are</span><span class="lz-nsub">Password, one-time code, passkey, another provider</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Receive a credential</span><span class="lz-nsub">A session id, or a signed token</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Every request after</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Present the credential</span><span class="lz-nsub">Cookie header, or Authorization header</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Server verifies it</span><span class="lz-nsub">Look it up, or check a signature</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Eventually</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Expire or revoke it</span><span class="lz-nsub">The half nobody designs until an incident</span></div></div>
  </div>
</div>
<div class="callout ok">
<p><strong>That diagram is the entire course.</strong> Chapter 2 is the "prove who you are" box. Chapters 3 and 4 are the two competing answers to "what credential". Chapter 5 is the expire-and-revoke box that almost everyone leaves for later. Chapters 7 and 8 replace the password in the first box with something better. Everything else is what happens when one of these boxes is built wrong.</p>
</div>

<h3>Why the workaround is where the bugs live</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The credential is a bearer credential</span><span class="v">Whoever holds it <em>is</em> you, as far as the server can tell. There is no second check. That is why stealing one is the goal of most attacks in Chapter 10, and why every design decision comes back to "how hard is this to steal".</span></div>
  <div class="kv"><span class="k">The browser sends it automatically</span><span class="v">Cookies are attached to requests the browser makes on your behalf — including requests another site caused. That single convenience is the entire reason CSRF exists, and <code>SameSite</code> in Chapter 3 is the fix.</span></div>
  <div class="kv"><span class="k">JavaScript can read it, or not</span><span class="v">A token in <code>localStorage</code> is readable by any script on the page, so one XSS is total account takeover. An <code>HttpOnly</code> cookie is not readable by script at all. This is the trade-off Chapter 4 spends its whole length on.</span></div>
  <div class="kv"><span class="k">Nothing expires by itself</span><span class="v">A session row sits in the database until something deletes it; a signed token is valid until its <code>exp</code> passes, and there is no way to un-issue it. Revocation is a feature you build, not a property you get.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — "we will add authentication later" is not a schedule, it is a rewrite.</strong> Authentication decides your data model (who owns a row), your API shape (which endpoints take a user), your caching (what is per-user and therefore uncacheable), and your test setup (every test now needs a logged-in fixture). Retrofitting it touches every file that reads data. Decide the shape in the first week even if you build it in the fourth.</p>
</div>
<div class="note-ct">
<p><strong>A real example of how far this reaches.</strong> On CuongThai, the Notes API originally had a hard-coded <code>AUTHOR_ID = 1</code> — a placeholder for "the logged-in user" while auth did not exist yet. Removing it was not a one-line change: every query needed a user, every route needed a middleware, every test fixture needed a session, and the ownership checks had to be added to endpoints that previously had nothing to check. That is what "add it later" actually costs, on a small codebase.</p>
</div>

<h3>What this course is, and is not</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It is about the mechanism</span><span class="lz-lnote">How a password is stored so a database leak is not a disaster, what is really inside a JWT, why a refresh token needs rotation, how OAuth's authorization code flow prevents the attack that killed the implicit flow. The parts you can get wrong silently.</span></div>
  <div class="lz-layer"><span class="lz-lname">It is not a library tutorial</span><span class="lz-lnote">Passport, NextAuth, Lucia, Auth0, Clerk and Supabase Auth all implement what is in here. Knowing the mechanism is what lets you configure one correctly, evaluate whether it fits, and debug it when it does not.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not duplicate the Node.js course</span><span class="lz-lnote">That course's Chapter 8 builds JWT auth for a specific API, as one step in building that API. This course is about the problem itself — with more depth on each piece, and the pieces that project never needed.</span></div>
  <div class="lz-layer"><span class="lz-lname">The examples are Node, the ideas are not</span><span class="lz-lnote">Argon2 parameters, <code>SameSite</code>, PKCE, TOTP drift windows and reuse detection are the same in Go, Python and Rust. The code is Node because you need <em>some</em> language to show a real output.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — Authentication Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · The single most useful page on this subject; read it twice</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Session_management" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — HTTP and session management</span><span class="lc-sub">developer.mozilla.org · How a stateless protocol is made to carry state</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B — Digital Identity Guidelines</span><span class="lc-sub">pages.nist.gov · The document that killed forced password rotation and composition rules</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web foundations</span><span class="lc-sub">HTTP, headers and status codes, if the curl output above is unfamiliar</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Watch a server fail to recognise you, then give it exactly one thing to change that</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Một giao thức quên sạch mọi thứ</h2>
<p class="lead">HTTP KHÔNG có trí nhớ. Mỗi request tới nơi như thể nó là cái đầu tiên, từ một người lạ, không dính dáng gì tới bất cứ thứ gì đã xảy ra trước đó. Mọi hệ đăng nhập từng được dựng ra đều tồn tại để đi vòng qua đúng một sự thật đó — và gần như mọi lỗ hổng xác thực đều là bug trong CÁCH ĐI VÒNG, chứ không phải trong cái đăng nhập.</p>

<h3>Nhìn thấy cái lỗ</h3>
<pre><code><span class="tok-comment"># Hai request tới cùng một máy chủ, cách nhau một giây</span>
curl -s https://cuongthai.com/api/v1/auth/me
curl -s https://cuongthai.com/api/v1/auth/me</code></pre>
<div class="out">{"error":"Unauthorized","message":"Khong co token"}
{"error":"Unauthorized","message":"Khong co token"}</div>
<pre><code><span class="tok-comment"># Toàn bộ những gì máy chủ nhìn thấy ở cả hai request</span>
GET /api/v1/auth/me HTTP/1.1
Host: cuongthai.com
User-Agent: curl/8.5.0
Accept: */*

<span class="tok-comment"># Hết. Không có chỗ nào nói "AI".</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Phi trạng thái là CỐ Ý</span><span class="lz-t">Không phải sơ suất</span><span class="lz-d">HTTP được đặc tả là phi trạng thái để BẤT KỲ máy chủ nào cũng trả lời được BẤT KỲ request nào. Chính điều đó làm cho cân bằng tải, CDN và mở rộng ngang trở nên khả thi — và cũng chính nó khiến máy chủ không thể đơn giản là NHỚ bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Kết nối TCP KHÔNG phải danh tính</span><span class="lz-t">Một giả định sai rất phổ biến</span><span class="lz-d">Keep-alive của HTTP/1.1 và ghép kênh của HTTP/2 có dùng lại kết nối, nhưng một proxy, một lần thử lại hay một tab thứ hai là phá vỡ ngay. Mọi thứ dựng trên "cùng kết nối nghĩa là cùng người dùng" đều hỏng ngay lần đầu gặp hạ tầng thật.</span></div>
  <div class="lz-step"><span class="lz-k">Địa chỉ IP KHÔNG phải danh tính</span><span class="lz-t">Tệ hơn cả vô dụng</span><span class="lz-d">NAT của nhà mạng nhét hàng nghìn điện thoại sau một địa chỉ; một laptop chuyển từ wifi sang 4G là đổi địa chỉ giữa phiên. Dùng IP làm danh tính vừa CHẶN người dùng thật vừa CHO người lạ vào, cùng một lúc.</span></div>
  <div class="lz-step"><span class="lz-k">Nên phía client phải MANG THEO bằng chứng</span><span class="lz-t">Toàn bộ ý tưởng</span><span class="lz-d">Nếu máy chủ không nhớ được thì client phải mang theo thứ gì đó ở MỌI request. Mọi thứ trong khoá này — cookie, phiên, token, JWT — đều là biến thể của câu hỏi <em>thứ đó là gì</em> và <em>ăn cắp nó khó tới đâu</em>.</span></div>
</div>

<h3>Cách đi vòng, gói trong một dòng</h3>
<pre><code><span class="tok-comment"># Cũng request đó, có mang bằng chứng</span>
curl -s https://cuongthai.com/api/v1/auth/me \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"</code></pre>
<div class="out">{"id":"clx7…","username":"cuongthai","email":"cuong…@gmail.com","role":"ADMIN"}</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Một lần</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chứng minh bạn là ai</span><span class="lz-nsub">Mật khẩu, mã một lần, passkey, hoặc một nhà cung cấp khác</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nhận một tín vật</span><span class="lz-nsub">Một mã phiên, hoặc một token có chữ ký</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Mọi request sau đó</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Trình tín vật ra</span><span class="lz-nsub">Header Cookie, hoặc header Authorization</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Máy chủ xác minh nó</span><span class="lz-nsub">Tra trong kho, hoặc kiểm chữ ký</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Rồi tới lúc</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Hết hạn hoặc bị thu hồi</span><span class="lz-nsub">Nửa mà gần như không ai thiết kế cho tới lúc có sự cố</span></div></div>
  </div>
</div>
<div class="callout ok">
<p><strong>Cái sơ đồ đó CHÍNH LÀ toàn bộ khoá học.</strong> Chương 2 là cái ô "chứng minh bạn là ai". Chương 3 và 4 là hai câu trả lời cạnh tranh nhau cho "tín vật là cái gì". Chương 5 là cái ô hết-hạn-và-thu-hồi mà gần như ai cũng để lại sau. Chương 7 và 8 thay cái mật khẩu trong ô đầu tiên bằng thứ tốt hơn. Mọi phần còn lại là chuyện xảy ra khi một trong những cái ô này bị dựng sai.</p>
</div>

<h3>Vì sao cách đi vòng lại là chỗ bug sinh sống</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín vật là tín vật KIỂU MANG THEO</span><span class="v">Ai cầm nó thì người đó <em>LÀ</em> bạn, theo cách nhìn của máy chủ. Không có phép kiểm thứ hai nào. Đó là lý do ăn cắp một cái là mục tiêu của phần lớn tấn công ở Chương 10, và là lý do mọi quyết định thiết kế đều quay về câu "ăn cắp cái này khó tới đâu".</span></div>
  <div class="kv"><span class="k">Trình duyệt TỰ ĐỘNG gửi nó đi</span><span class="v">Cookie được gắn vào những request mà trình duyệt thay mặt bạn gửi đi — kể cả những request do một trang KHÁC gây ra. Đúng một tiện nghi đó là toàn bộ lý do CSRF tồn tại, và <code>SameSite</code> ở Chương 3 là cách vá.</span></div>
  <div class="kv"><span class="k">JavaScript đọc được nó, hoặc không</span><span class="v">Một token trong <code>localStorage</code> thì MỌI script trên trang đều đọc được, nên một lỗ XSS là chiếm tài khoản toàn phần. Một cookie <code>HttpOnly</code> thì script hoàn toàn không đọc nổi. Đó là đánh đổi mà cả Chương 4 dành để nói.</span></div>
  <div class="kv"><span class="k">Không có gì TỰ hết hạn</span><span class="v">Một hàng phiên nằm trong cơ sở dữ liệu cho tới khi có thứ gì đó xoá nó; một token có chữ ký thì hợp lệ cho tới khi <code>exp</code> trôi qua, và không có cách nào "rút lại" nó. Thu hồi là một TÍNH NĂNG bạn phải dựng, không phải một tính chất bạn tự có.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — "để sau rồi thêm xác thực" không phải một lịch trình, đó là một lần viết lại.</strong> Xác thực quyết định mô hình dữ liệu của bạn (ai sở hữu một hàng), hình dạng API (endpoint nào nhận một người dùng), cách cache (cái gì riêng từng người và do đó KHÔNG cache được), và cách dựng test (mọi bài test giờ cần một fixture đã đăng nhập). Lắp ngược vào sau nghĩa là đụng vào mọi file có đọc dữ liệu. Hãy quyết HÌNH DẠNG của nó ngay tuần đầu, dù tới tuần thứ tư mới dựng.</p>
</div>
<div class="note-ct">
<p><strong>Một ví dụ thật về chuyện này lan xa tới đâu.</strong> Trên CuongThai, Notes API ban đầu có một hằng số <code>AUTHOR_ID = 1</code> viết cứng — chỗ giữ chỗ cho "người dùng đang đăng nhập" trong lúc chưa có xác thực. Gỡ nó ra không phải sửa một dòng: mọi truy vấn cần một người dùng, mọi route cần một middleware, mọi fixture test cần một phiên, và những phép kiểm quyền sở hữu phải được thêm vào những endpoint mà trước đó chẳng có gì để kiểm. Đó là cái giá THẬT của "để sau", trên một kho mã nhỏ.</p>
</div>

<h3>Khoá này là gì, và KHÔNG là gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó nói về CƠ CHẾ</span><span class="lz-lnote">Mật khẩu cất thế nào để một cú rò cơ sở dữ liệu không thành thảm hoạ, bên trong một JWT thật ra có gì, vì sao refresh token cần xoay vòng, luồng authorization code của OAuth chặn được cú tấn công đã giết luồng implicit ra sao. Những phần bạn có thể làm sai một cách LẶNG LẼ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG phải hướng dẫn dùng thư viện</span><span class="lz-lnote">Passport, NextAuth, Lucia, Auth0, Clerk và Supabase Auth đều cài đặt đúng những thứ trong này. Biết cơ chế mới là thứ cho bạn cấu hình một cái cho ĐÚNG, đánh giá xem nó có hợp không, và gỡ rối khi nó không hợp.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG trùng khoá Node.js</span><span class="lz-lnote">Chương 8 của khoá đó dựng xác thực JWT cho một API cụ thể, như một bước trong việc dựng cái API ấy. Khoá này nói về CHÍNH bài toán — sâu hơn ở từng mảnh, và có cả những mảnh mà dự án kia không bao giờ cần tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ví dụ viết bằng Node, còn Ý TƯỞNG thì không</span><span class="lz-lnote">Tham số Argon2, <code>SameSite</code>, PKCE, cửa sổ trôi của TOTP và phát hiện tái dùng token đều y hệt nhau trong Go, Python và Rust. Mã viết bằng Node vì bạn cần MỘT ngôn ngữ nào đó để có output thật mà nhìn.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — Authentication Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Trang hữu ích nhất về chủ đề này; hãy đọc hai lần</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Session_management" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — HTTP và quản lý phiên</span><span class="lc-sub">developer.mozilla.org · Làm sao bắt một giao thức phi trạng thái cõng được trạng thái</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B — Digital Identity Guidelines</span><span class="lc-sub">pages.nist.gov · Tài liệu đã khai tử việc bắt đổi mật khẩu định kỳ và luật thành phần ký tự</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Lập trình Web</span><span class="lc-sub">HTTP, header và status code, nếu mấy dòng curl ở trên còn lạ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Xem một máy chủ không nhận ra bạn, rồi đưa cho nó ĐÚNG MỘT thứ để đổi điều đó</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Three problems hiding in the word "login"|||0.2 — Ba bài toán trốn trong chữ "đăng nhập"',
      slug: 'auth-0-2-ba-bai-toan',
      type: 'LESSON',
      description: 'Nhận diện, xác thực và phân quyền là ba câu hỏi khác nhau, và gộp chúng lại là nguồn gốc của lỗ hổng phổ biến nhất trong danh sách OWASP. Kèm bộ từ vựng mà cả khoá dùng, ba yếu tố xác thực, và một endpoint xác thực đúng nhưng phân quyền sai — chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Three problems hiding in the word "login"</h2>
<p class="lead">"Is the user logged in?" is three questions wearing one coat. Separating them is not pedantry: OWASP's number-one category is <em>Broken Access Control</em>, and the most common shape of it is code that answered the second question and assumed it had answered the third.</p>

<h3>The three gates</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Identification</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Who do you claim to be?</span><span class="lz-nsub">A username, an email, a user id. Just a claim — anyone can type it.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Authentication</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Prove it</span><span class="lz-nsub">A password, a code, a passkey signature. Chapters 2, 7 and 8.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Authorization</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">May you do THIS, to THIS?</span><span class="lz-nsub">Per action, per resource, every time. Chapter 9.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// The mistake, in four lines. It authenticates. It does not authorize.</span>
app.get('/api/orders/:id', requireAuth, async (req, res) =&gt; {
  const don = await prisma.donHang.findUnique({ where: { id: req.params.id } });
  res.json(don);                       <span class="tok-comment">// ← whose order is this?</span>
});</code></pre>
<div class="out">$ curl -s /api/don-hang/clx7… -H "Authorization: Bearer &lt;token cua AN&gt;"
{"id":"clx7…","userId":"clx9…","tong":2490000,"diaChi":"…","dienThoai":"09…"}

# Cai don nay thuoc ve clx9 — KHONG phai An. An van doc duoc.
# Doi id trong URL la doc duoc don cua bat ky ai. Day la IDOR.</div>
<pre><code><span class="tok-comment">// The fix is one clause, and it belongs in the query, not after it</span>
app.get('/api/orders/:id', requireAuth, async (req, res) =&gt; {
  const don = await prisma.donHang.findFirst({
    where: { id: req.params.id, userId: req.user.id },   <span class="tok-comment">// ← gate 3</span>
  });
  if (!don) return res.status(404).json({ error: 'Khong tim thay' });
  res.json(don);
});</code></pre>
<div class="callout ok">
<p><strong>Put the ownership check inside the <code>where</code>, not in an <code>if</code> after the fetch.</strong> A filter cannot be forgotten by a later refactor the way a separate <code>if</code> can, it cannot be bypassed by an early return someone adds above it, and it returns 404 rather than 403 — which does not confirm to an attacker that the id exists. One clause, three benefits.</p>
</div>

<h3>The vocabulary this course uses</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Principal / subject</span><span class="v">The entity doing something — usually a user, sometimes a service or a background job. "Subject" is the word JWT uses, in the <code>sub</code> claim.</span></div>
  <div class="kv"><span class="k">Credential</span><span class="v">The thing presented as proof. A password, a session id, a token, a signature. If holding it is enough, it is a <em>bearer</em> credential — and almost all of them are.</span></div>
  <div class="kv"><span class="k">Factor</span><span class="v">A <em>category</em> of proof, not an instance. Two passwords are not two factors. A password plus an SMS code is two, because they can be stolen in different ways.</span></div>
  <div class="kv"><span class="k">Claim</span><span class="v">A statement inside a token: "sub is clx7", "role is ADMIN", "exp is 1756000000". A claim is only worth what the signature over it is worth — Chapter 4.</span></div>
  <div class="kv"><span class="k">Scope</span><span class="v">What a credential is <em>allowed</em> to be used for, usually in OAuth: <code>read:posts</code>, <code>write:comments</code>. A narrower scope makes a stolen token less useful.</span></div>
  <div class="kv"><span class="k">Audience</span><span class="v">Who a token was minted for, the <code>aud</code> claim. Checking it is what stops a token issued for service A being replayed against service B.</span></div>
  <div class="kv"><span class="k">Session</span><span class="v">A period of authenticated activity, and the server-side record of it. Chapter 3. Note that "session" and "session cookie" are different things.</span></div>
  <div class="kv"><span class="k">Revocation</span><span class="v">Ending a credential's validity before it expires on its own. Easy with sessions, genuinely hard with signed tokens — Chapter 5 exists for this.</span></div>
</div>

<h3>The three factors, and what each actually resists</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Know</span><span class="lz-t">Password, PIN, security question</span><span class="lz-d">Cheap and universal. Resists nothing on its own: it can be guessed, reused from another site's breach, phished, or read from a keylogger. Everything in Chapter 2 is damage limitation for this factor.</span></div>
  <div class="lz-step"><span class="lz-k">Have</span><span class="lz-t">Phone, TOTP app, security key</span><span class="lz-d">Resists remote guessing and credential stuffing, because the attacker needs the device. SMS resists least (SIM swap); a TOTP app resists more; a hardware key resists phishing entirely — Chapter 7.</span></div>
  <div class="lz-step"><span class="lz-k">Are</span><span class="lz-t">Fingerprint, face</span><span class="lz-d">Convenient, and almost never sent to your server. Face ID unlocks the passkey <em>on the device</em>; what reaches you is a signature. Treat biometrics as a local unlock, never as a credential you receive.</span></div>
  <div class="lz-step"><span class="lz-k">Not a factor</span><span class="lz-t">IP, device fingerprint, "remember me"</span><span class="lz-d">Useful <em>signals</em> for risk scoring — a login from a new country deserves a second look. But they are not proof of anything, and treating them as a factor is how "trusted device" becomes a bypass.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a security question is a password with a much smaller keyspace.</strong> "Your mother's maiden name" is guessable, public on social media, identical across every site that asks, and unchangeable after a breach. NIST SP 800-63B explicitly forbids them as an authenticator. If you must offer account recovery, use recovery codes (Chapter 7) or a verified email, and treat that path as the account's real security level — because it is.</p>
</div>

<h3>Why the separation matters in code</h3>
<pre><code><span class="tok-comment">// Middleware answers gate 2 — and only gate 2.</span>
function requireAuth(req, res, next) {
  const token = layToken(req);
  if (!token) return res.status(401).json({ error: 'Chua dang nhap' });
  try {
    req.user = xacMinh(token);         <span class="tok-comment">// authenticated: we know WHO</span>
    next();
  } catch {
    return res.status(401).json({ error: 'Token khong hop le' });
  }
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">401 and 403 mean different things</span><span class="lz-lnote"><code>401 Unauthorized</code> means "I do not know who you are" — gate 2 failed, and a login might fix it. <code>403 Forbidden</code> means "I know who you are and the answer is no" — gate 3 failed, and logging in again will not help. Sending 401 for a permission failure sends users into a login loop.</span></div>
  <div class="lz-layer"><span class="lz-lname">Gate 3 cannot live in middleware alone</span><span class="lz-lnote">A middleware knows the route, not the row. <code>requireRole('ADMIN')</code> is a coarse gate that belongs in middleware; "is this <em>your</em> order" is a per-resource question that belongs in the query. Both are needed, and the second is the one that gets forgotten.</span></div>
  <div class="lz-layer"><span class="lz-lname">The gates run in order, every request</span><span class="lz-lnote">Not once at login. A user whose role was revoked one minute ago still holds a valid token; if the role lives only inside that token, gate 3 is answering with stale information until it expires — a direct consequence of Chapter 4's design, and the reason Chapter 5 exists.</span></div>
  <div class="lz-layer"><span class="lz-lname">Deny by default</span><span class="lz-lnote">A new route should be inaccessible until someone explicitly opens it, not accessible until someone remembers to close it. Mount <code>requireAuth</code> on the router, then opt specific routes out — the opposite order eventually ships a route with no gate at all.</span></div>
</div>
<div class="note-ct">
<p><strong>How the confusion shows up in a real product.</strong> On CuongThai, support threads and direct messages share one <code>MessageThread</code> model with a <code>type</code> of <code>ADMIN</code> or <code>USER</code>. Whether an admin can see a thread is a gate-3 question, and it is answered by a filter inside <code>listThreadsForUser</code> — not by a separate admin page. When those threads once appeared to have vanished, the cause was that filter, not lost data. Authorization logic that lives in a query is authorization logic you can read; when it lives across three files, "why can this person not see that" becomes an afternoon.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/" target="_blank" rel="noopener"><span class="lc-ico">🥇</span><span class="lc-body"><span class="lc-title">OWASP Top 10 — A01 Broken Access Control</span><span class="lc-sub">owasp.org · The number-one category, and IDOR is its most common shape</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🚪</span><span class="lc-body"><span class="lc-title">OWASP — Authorization Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Deny by default, and enforcing on the server every time</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#sec5" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §5 — Authenticators</span><span class="lc-sub">pages.nist.gov · The factor taxonomy, and why security questions are banned</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">MDN — 401 versus 403</span><span class="lc-sub">developer.mozilla.org · What each status actually means, and when to send which</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Find the IDOR in a working API, then fix it with one clause in the right place</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Ba bài toán trốn trong chữ "đăng nhập"</h2>
<p class="lead">"Người dùng đã đăng nhập chưa?" là BA câu hỏi khoác chung một cái áo. Tách chúng ra không phải chuyện bắt bẻ chữ nghĩa: hạng mục số một của OWASP là <em>Broken Access Control</em>, và hình dạng phổ biến nhất của nó là đoạn mã đã trả lời câu hỏi thứ hai rồi TƯỞNG là đã trả lời luôn câu thứ ba.</p>

<h3>Ba cái cổng</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Nhận diện</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn XƯNG mình là ai?</span><span class="lz-nsub">Một tên đăng nhập, một email, một id. Chỉ là lời XƯNG — ai gõ vào cũng được.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Xác thực</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chứng minh đi</span><span class="lz-nsub">Một mật khẩu, một mã, một chữ ký passkey. Chương 2, 7 và 8.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Phân quyền</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn được làm VIỆC NÀY, lên THỨ NÀY, không?</span><span class="lz-nsub">Theo từng hành động, từng tài nguyên, MỖI lần. Chương 9.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Cái sai, gói trong bốn dòng. Nó XÁC THỰC. Nó KHÔNG phân quyền.</span>
app.get('/api/orders/:id', requireAuth, async (req, res) =&gt; {
  const don = await prisma.donHang.findUnique({ where: { id: req.params.id } });
  res.json(don);                       <span class="tok-comment">// ← đơn này của AI?</span>
});</code></pre>
<div class="out">$ curl -s /api/don-hang/clx7… -H "Authorization: Bearer &lt;token cua AN&gt;"
{"id":"clx7…","userId":"clx9…","tong":2490000,"diaChi":"…","dienThoai":"09…"}

# Cai don nay thuoc ve clx9 — KHONG phai An. An van doc duoc.
# Doi id trong URL la doc duoc don cua bat ky ai. Day la IDOR.</div>
<pre><code><span class="tok-comment">// Cách vá là MỘT mệnh đề, và nó thuộc về câu truy vấn, không phải sau nó</span>
app.get('/api/orders/:id', requireAuth, async (req, res) =&gt; {
  const don = await prisma.donHang.findFirst({
    where: { id: req.params.id, userId: req.user.id },   <span class="tok-comment">// ← cổng 3</span>
  });
  if (!don) return res.status(404).json({ error: 'Khong tim thay' });
  res.json(don);
});</code></pre>
<div class="callout ok">
<p><strong>Hãy đặt phép kiểm quyền sở hữu BÊN TRONG <code>where</code>, đừng đặt vào một <code>if</code> sau khi đã lấy dữ liệu.</strong> Một bộ lọc thì không thể bị một lần refactor sau này QUÊN mất như một cái <code>if</code> rời, nó không bị vượt qua bởi một lệnh return sớm mà ai đó thêm vào phía trên, và nó trả 404 chứ không phải 403 — tức là không XÁC NHẬN với kẻ tấn công rằng cái id đó có thật. Một mệnh đề, ba cái lợi.</p>
</div>

<h3>Bộ từ vựng cả khoá này dùng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chủ thể (principal / subject)</span><span class="v">Thực thể đang làm gì đó — thường là một người dùng, đôi khi là một dịch vụ hay một job chạy nền. "Subject" là chữ mà JWT dùng, trong claim <code>sub</code>.</span></div>
  <div class="kv"><span class="k">Tín vật (credential)</span><span class="v">Thứ được trình ra làm bằng chứng. Một mật khẩu, một mã phiên, một token, một chữ ký. Nếu chỉ cần CẦM nó là đủ thì đó là tín vật <em>kiểu mang theo</em> — và gần như tất cả đều vậy.</span></div>
  <div class="kv"><span class="k">Yếu tố (factor)</span><span class="v">Một <em>LOẠI</em> bằng chứng, không phải một thể hiện. Hai cái mật khẩu KHÔNG phải hai yếu tố. Mật khẩu cộng một mã SMS mới là hai, vì chúng bị ăn cắp theo hai cách khác nhau.</span></div>
  <div class="kv"><span class="k">Claim</span><span class="v">Một lời khẳng định bên trong token: "sub là clx7", "role là ADMIN", "exp là 1756000000". Một claim chỉ đáng giá bằng đúng cái chữ ký phủ lên nó — Chương 4.</span></div>
  <div class="kv"><span class="k">Scope</span><span class="v">Cái mà một tín vật ĐƯỢC PHÉP dùng để làm, thường gặp trong OAuth: <code>read:posts</code>, <code>write:comments</code>. Scope hẹp hơn làm một token bị cắp trở nên ít hữu dụng hơn.</span></div>
  <div class="kv"><span class="k">Audience</span><span class="v">Token được đúc ra cho AI, tức claim <code>aud</code>. Kiểm nó chính là thứ chặn một token phát cho dịch vụ A bị phát lại vào dịch vụ B.</span></div>
  <div class="kv"><span class="k">Phiên (session)</span><span class="v">Một quãng hoạt động đã xác thực, và bản ghi phía máy chủ của nó. Chương 3. Lưu ý "phiên" và "cookie phiên" là hai thứ KHÁC nhau.</span></div>
  <div class="kv"><span class="k">Thu hồi (revocation)</span><span class="v">Chấm dứt hiệu lực của một tín vật TRƯỚC khi nó tự hết hạn. Dễ với phiên, khó thật sự với token có chữ ký — Chương 5 tồn tại vì chuyện này.</span></div>
</div>

<h3>Ba yếu tố, và mỗi cái THẬT SỰ chống được gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">BIẾT</span><span class="lz-t">Mật khẩu, mã PIN, câu hỏi bảo mật</span><span class="lz-d">Rẻ và phổ biến. Tự nó chống được... không gì cả: có thể bị đoán, bị lấy lại từ một cú rò của trang khác, bị lừa đảo, hoặc bị đọc từ một keylogger. Mọi thứ ở Chương 2 là việc HẠN CHẾ THIỆT HẠI cho cái yếu tố này.</span></div>
  <div class="lz-step"><span class="lz-k">CÓ</span><span class="lz-t">Điện thoại, app TOTP, khoá cứng</span><span class="lz-d">Chống được đoán từ xa và nhồi tín vật, vì kẻ tấn công cần chính CÁI THIẾT BỊ. SMS chống yếu nhất (tráo SIM); app TOTP chống khá hơn; khoá phần cứng chống được HẲN lừa đảo — Chương 7.</span></div>
  <div class="lz-step"><span class="lz-k">LÀ</span><span class="lz-t">Vân tay, khuôn mặt</span><span class="lz-d">Tiện, và gần như KHÔNG BAO GIỜ được gửi tới máy chủ của bạn. Face ID mở khoá cái passkey <em>NGAY TRÊN THIẾT BỊ</em>; thứ tới được bạn là một chữ ký. Hãy coi sinh trắc học là một cách mở khoá cục bộ, đừng bao giờ coi nó là tín vật bạn NHẬN được.</span></div>
  <div class="lz-step"><span class="lz-k">KHÔNG phải yếu tố</span><span class="lz-t">IP, dấu vân thiết bị, "nhớ tôi"</span><span class="lz-d">Là những <em>TÍN HIỆU</em> hữu ích để chấm điểm rủi ro — một lần đăng nhập từ nước khác đáng để nhìn kỹ. Nhưng chúng không chứng minh điều gì cả, và coi chúng là yếu tố chính là cách "thiết bị tin cậy" biến thành một đường vòng.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — câu hỏi bảo mật là một cái mật khẩu với không gian khoá bé hơn rất nhiều.</strong> "Tên thời con gái của mẹ bạn" thì đoán được, công khai trên mạng xã hội, GIỐNG NHAU ở mọi trang có hỏi, và không đổi được sau một cú rò. NIST SP 800-63B cấm hẳn nó với vai trò một bộ xác thực. Nếu bạn buộc phải có đường khôi phục tài khoản, hãy dùng mã khôi phục (Chương 7) hoặc một email đã xác minh, và hãy coi ĐƯỜNG ĐÓ là mức bảo mật thật của tài khoản — vì đúng là như vậy.</p>
</div>

<h3>Vì sao việc tách bạch lại quan trọng trong mã</h3>
<pre><code><span class="tok-comment">// Middleware trả lời cổng 2 — và CHỈ cổng 2.</span>
function requireAuth(req, res, next) {
  const token = layToken(req);
  if (!token) return res.status(401).json({ error: 'Chua dang nhap' });
  try {
    req.user = xacMinh(token);         <span class="tok-comment">// đã xác thực: ta biết AI</span>
    next();
  } catch {
    return res.status(401).json({ error: 'Token khong hop le' });
  }
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">401 và 403 nghĩa KHÁC nhau</span><span class="lz-lnote"><code>401 Unauthorized</code> nghĩa là "tôi không biết bạn là ai" — cổng 2 trượt, và đăng nhập có thể chữa được. <code>403 Forbidden</code> nghĩa là "tôi biết bạn là ai và câu trả lời là không" — cổng 3 trượt, và đăng nhập lại chẳng ích gì. Trả 401 cho một cú trượt quyền là đẩy người dùng vào vòng lặp đăng nhập.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cổng 3 KHÔNG sống nổi chỉ trong middleware</span><span class="lz-lnote">Một middleware biết cái ROUTE, không biết cái HÀNG. <code>requireRole('ADMIN')</code> là cái cổng thô, thuộc về middleware; còn "đơn này CÓ PHẢI của bạn không" là câu hỏi theo từng tài nguyên, thuộc về câu truy vấn. Cần cả hai, và cái thứ hai mới là cái hay bị quên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Các cổng chạy theo thứ tự, ở MỌI request</span><span class="lz-lnote">Không phải một lần lúc đăng nhập. Một người dùng vừa bị tước vai trò một phút trước vẫn đang cầm một token hợp lệ; nếu vai trò chỉ nằm BÊN TRONG token đó thì cổng 3 đang trả lời bằng thông tin CŨ cho tới khi token hết hạn — hệ quả trực tiếp của thiết kế ở Chương 4, và là lý do Chương 5 tồn tại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mặc định là TỪ CHỐI</span><span class="lz-lnote">Một route mới phải KHÔNG vào được cho tới khi có người mở nó ra, chứ không phải vào được cho tới khi có người nhớ ra mà đóng lại. Hãy gắn <code>requireAuth</code> lên router rồi cho từng route cụ thể được miễn — thứ tự ngược lại rốt cuộc sẽ ship một cái route không có cổng nào.</span></div>
</div>
<div class="note-ct">
<p><strong>Sự lẫn lộn đó hiện ra thế nào trong một sản phẩm thật.</strong> Trên CuongThai, luồng hỗ trợ và tin nhắn riêng dùng CHUNG một model <code>MessageThread</code> với <code>type</code> là <code>ADMIN</code> hoặc <code>USER</code>. Việc một admin có được thấy một luồng hay không là câu hỏi CỔNG 3, và nó được trả lời bằng một bộ lọc bên trong <code>listThreadsForUser</code> — không phải bằng một trang admin riêng. Cái lần những luồng đó tưởng như đã biến mất, thủ phạm là chính bộ lọc ấy, không phải mất dữ liệu. Logic phân quyền sống trong một câu truy vấn là logic phân quyền bạn ĐỌC ĐƯỢC; khi nó nằm rải ba file thì "vì sao người này không thấy cái kia" thành một buổi chiều.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/" target="_blank" rel="noopener"><span class="lc-ico">🥇</span><span class="lc-body"><span class="lc-title">OWASP Top 10 — A01 Broken Access Control</span><span class="lc-sub">owasp.org · Hạng mục số một, và IDOR là hình dạng phổ biến nhất của nó</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🚪</span><span class="lc-body"><span class="lc-title">OWASP — Authorization Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Mặc định từ chối, và cưỡng chế ở máy chủ MỖI lần</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#sec5" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §5 — Bộ xác thực</span><span class="lc-sub">pages.nist.gov · Phân loại yếu tố, và vì sao câu hỏi bảo mật bị cấm</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403" target="_blank" rel="noopener"><span class="lc-ico">🚫</span><span class="lc-body"><span class="lc-title">MDN — 401 đối lại 403</span><span class="lc-sub">developer.mozilla.org · Mỗi mã trạng thái THẬT SỰ nghĩa là gì, và khi nào gửi cái nào</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Tìm ra lỗ IDOR trong một API chạy được, rồi vá nó bằng một mệnh đề đặt đúng chỗ</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — A login that runs, and is wrong in six ways|||0.3 — Một cái đăng nhập chạy được, và sai sáu chỗ',
      slug: 'auth-0-3-dang-nhap-sai',
      type: 'LESSON',
      description: 'Dựng Node 22 + Express + PostgreSQL trong mười phút, viết đăng ký và đăng nhập ngắn nhất có thể, chạy thật — rồi đọc ra SÁU lỗi trong hai mươi dòng đó, mỗi lỗi ứng với một chương sau. Đây là bộ xương của cả khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>A login that runs, and is wrong in six ways</h2>
<p class="lead">The fastest way to understand what a login system is <em>for</em> is to write one without any of the protections, run it, and then count what is missing. The twenty lines below work. They also contain six distinct vulnerabilities, and each one is a chapter of this course — so this lesson is the table of contents, written as code.</p>

<h3>Ten minutes to a running project</h3>
<pre><code>mkdir hoc-auth &amp;&amp; cd hoc-auth
npm init -y
npm i express@5 pg prisma @prisma/client
npm i -D tsx typescript @types/node @types/express
npx prisma init --datasource-provider postgresql</code></pre>
<pre><code><span class="tok-comment"># docker-compose.yml — một Postgres, không hơn</span>
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau
      POSTGRES_DB: hocauth
    ports: ['5432:5432']</code></pre>
<pre><code>docker compose up -d
echo 'DATABASE_URL="postgresql://postgres:matkhau@localhost:5432/hocauth"' &gt; .env</code></pre>
<pre><code><span class="tok-comment">// prisma/schema.prisma</span>
model NguoiDung {
  id       String   @id @default(cuid())
  email    String   @unique
  matKhau  String
  taoLuc   DateTime @default(now())
  phien    Phien[]
}

model Phien {
  id         String    @id
  nguoiDungId String
  nguoiDung  NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  taoLuc     DateTime  @default(now())
}</code></pre>
<pre><code>npx prisma migrate dev --name khoi_tao</code></pre>
<div class="out">Applying migration &#96;20260823150000_khoi_tao&#96;
✔ Generated Prisma Client (v6.4.1) in 241ms

Your database is now in sync with your schema.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dependencies</span><span class="lz-d">Express 5 for the routes, Prisma for the database, <code>tsx</code> so TypeScript runs without a build step. Nothing security-related yet — that is deliberate.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A database in one file</span><span class="lz-d">Compose gives you PostgreSQL 16 on port 5432 in about eight seconds. Keep it local: everything in this course writes real rows, and you want to be able to delete them.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Two models</span><span class="lz-d">A user and a session. That is the minimum shape of every login system, and the rest of the course adds columns to exactly these two tables.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Migrate, then run</span><span class="lz-d"><code>migrate dev</code> is fine here — this is a throwaway local database, which is the only place that command belongs.</span></div>
</div>

<h3>The twenty lines</h3>
<pre><code><span class="tok-comment">// src/index.ts — đừng dùng cái này ở đâu cả</span>
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post('/sign-up', async (req, res) =&gt; {
  const { email, matKhau } = req.body;
  const nd = await prisma.nguoiDung.create({ data: { email, matKhau } });
  res.json({ id: nd.id });
});

app.post('/sign-in', async (req, res) =&gt; {
  const { email, matKhau } = req.body;
  const nd = await prisma.nguoiDung.findUnique({ where: { email } });
  if (!nd) return res.status(401).json({ loi: 'Email khong ton tai' });
  if (nd.matKhau !== matKhau) return res.status(401).json({ loi: 'Sai mat khau' });

  const phien = await prisma.phien.create({
    data: { id: String(Date.now()), nguoiDungId: nd.id },
  });
  res.json({ phien: phien.id });
});

app.get('/me', async (req, res) =&gt; {
  const phien = await prisma.phien.findUnique({
    where: { id: String(req.headers['x-phien']) },
    include: { nguoiDung: true },
  });
  if (!phien) return res.status(401).json({ loi: 'Chua dang nhap' });
  res.json({ email: phien.nguoiDung.email });
});

app.listen(3000, () =&gt; console.log('http://localhost:3000'));</code></pre>
<pre><code>npx tsx watch src/index.ts

curl -s localhost:3000/dang-ky -H 'content-type: application/json' \\
  -d '{"email":"an@vidu.com","matKhau":"khongaidoanduoc"}'
curl -s localhost:3000/dang-nhap -H 'content-type: application/json' \\
  -d '{"email":"an@vidu.com","matKhau":"khongaidoanduoc"}'
curl -s localhost:3000/toi -H 'x-phien: 1756000123456'</code></pre>
<div class="out">{"id":"clx7a2b1c0000abcdefghijkl"}
{"phien":"1756000123456"}
{"email":"an@vidu.com"}</div>
<div class="callout ok">
<p><strong>It works. That is the point.</strong> Every one of the six problems below is invisible from the outside: the endpoints return the right thing, the tests would pass, and a demo would go fine. Authentication bugs are almost never crashes — they are systems behaving exactly as written, where what was written is not what was meant.</p>
</div>

<h3>Six problems, six chapters</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · The password is stored as typed → Chapter 2</span><span class="lz-lnote"><code>SELECT email, "matKhau" FROM "NguoiDung"</code> prints everyone's password. One leaked backup, one SQL injection, one curious employee, and every account is gone — plus every other site where that person reused the password.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · The error says which half was wrong → Chapter 6</span><span class="lz-lnote">"Email khong ton tai" versus "Sai mat khau" turns the login form into a membership oracle: an attacker learns which of a million leaked emails have accounts here, before trying a single password. Both branches must return the same message, in the same time.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · The session id is <code>Date.now()</code> → Chapter 3</span><span class="lz-lnote">Guessable to the millisecond. An attacker who knows roughly when you logged in can brute-force a few thousand candidates. A session id must come from a cryptographic random source, with enough bits that guessing is hopeless.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · The session never expires and cannot be revoked → Chapter 5</span><span class="lz-lnote">No <code>expiresAt</code>, no logout, no "sign out everywhere". A session created today is still valid next year, and a stolen one is valid forever. Expiry and revocation are features, and this code has neither.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · The credential travels in a custom header → Chapter 4</span><span class="lz-lnote"><code>x-phien</code> means the browser will not send it automatically, so a real front end must store it in JavaScript — which means one XSS reads it. A cookie with <code>HttpOnly</code>, <code>Secure</code> and <code>SameSite</code> is a different trade, and Chapter 4 is where you choose.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Nothing limits attempts → Chapter 10 and 11</span><span class="lz-lnote">A script can try ten thousand passwords a second against this endpoint. Rate limiting per account and per IP, lockout with backoff, and a check against known-breached passwords are what make an online guessing attack pointless.</span></div>
</div>
<pre><code><span class="tok-comment">-- Problem 1, demonstrated in one query</span>
psql "$DATABASE_URL" -c 'SELECT email, "matKhau" FROM "NguoiDung";'</code></pre>
<div class="out">     email     |     matKhau
---------------+------------------
 an@vidu.com   | khongaidoanduoc
 binh@vidu.com | 123456
 chi@vidu.com  | Matkhau@2026</div>
<pre><code><span class="tok-comment"># Problem 2, demonstrated in two requests</span>
curl -s localhost:3000/dang-nhap -d '{"email":"co-that@vidu.com","matKhau":"x"}' -H 'content-type: application/json'
curl -s localhost:3000/dang-nhap -d '{"email":"khong-co@vidu.com","matKhau":"x"}' -H 'content-type: application/json'</code></pre>
<div class="out">{"loi":"Sai mat khau"}          ← tai khoan NAY co ton tai
{"loi":"Email khong ton tai"}   ← tai khoan nay khong

# Mot vong lap qua mot trieu email ro ri = danh sach nguoi dung cua ban.</div>
<div class="pitfall">
<p><strong>Trap — the fix for problem 2 is not just one message, it is one message <em>and</em> one duration.</strong> If the "no such user" branch returns in 3 ms and the "wrong password" branch takes 80 ms because it hashed something, the timing difference leaks the same information the message used to. Chapter 6 shows the fix: hash a dummy value on the missing-user path so both branches cost the same.</p>
</div>
<div class="note-ct">
<p><strong>Keep this project. You will rewrite it six times.</strong> Each chapter fixes one of these lines and explains why the obvious fix is usually incomplete — hashing that is not slow enough, an expiry with no revocation, a cookie flag that silently does nothing on localhost. By Chapter 11 the same twenty lines will be about ninety, and every extra line will have a specific attack behind it. That is the shape of the course.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://expressjs.com/en/5x/api.html" target="_blank" rel="noopener"><span class="lc-ico">🚂</span><span class="lc-body"><span class="lc-title">Express 5 — API reference</span><span class="lc-sub">expressjs.com · What changed from 4, including async error handling</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/getting-started/quickstart-sqlite" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Prisma — quickstart</span><span class="lc-sub">prisma.io/docs · If schema, migrate and generate are new to you</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">OWASP — Session Management Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Session id entropy, lifetime and the properties problem 3 violates</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">The schema, migrations and queries used throughout this course</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">If the compose file above is unfamiliar</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Run this exact project, then find all six problems before reading the list</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Một cái đăng nhập chạy được, và sai sáu chỗ</h2>
<p class="lead">Cách nhanh nhất để hiểu một hệ đăng nhập TỒN TẠI ĐỂ LÀM GÌ là viết một cái KHÔNG có bất kỳ lớp bảo vệ nào, chạy nó, rồi đếm xem thiếu những gì. Hai mươi dòng bên dưới CHẠY ĐƯỢC. Chúng cũng chứa sáu lỗ hổng riêng biệt, và mỗi lỗ ứng với một chương của khoá này — nên bài này chính là mục lục, viết dưới dạng mã.</p>

<h3>Mười phút để có một dự án chạy được</h3>
<pre><code>mkdir hoc-auth &amp;&amp; cd hoc-auth
npm init -y
npm i express@5 pg prisma @prisma/client
npm i -D tsx typescript @types/node @types/express
npx prisma init --datasource-provider postgresql</code></pre>
<pre><code><span class="tok-comment"># docker-compose.yml — một Postgres, không hơn</span>
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau
      POSTGRES_DB: hocauth
    ports: ['5432:5432']</code></pre>
<pre><code>docker compose up -d
echo 'DATABASE_URL="postgresql://postgres:matkhau@localhost:5432/hocauth"' &gt; .env</code></pre>
<pre><code><span class="tok-comment">// prisma/schema.prisma</span>
model NguoiDung {
  id       String   @id @default(cuid())
  email    String   @unique
  matKhau  String
  taoLuc   DateTime @default(now())
  phien    Phien[]
}

model Phien {
  id         String    @id
  nguoiDungId String
  nguoiDung  NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  taoLuc     DateTime  @default(now())
}</code></pre>
<pre><code>npx prisma migrate dev --name khoi_tao</code></pre>
<div class="out">Applying migration &#96;20260823150000_khoi_tao&#96;
✔ Generated Prisma Client (v6.4.1) in 241ms

Your database is now in sync with your schema.</div>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Các gói phụ thuộc</span><span class="lz-d">Express 5 cho route, Prisma cho cơ sở dữ liệu, <code>tsx</code> để TypeScript chạy mà không cần bước build. Chưa có gì liên quan tới bảo mật — đó là CỐ Ý.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một cơ sở dữ liệu gói trong một file</span><span class="lz-d">Compose cho bạn PostgreSQL 16 ở cổng 5432 trong khoảng tám giây. Hãy để nó ở máy: mọi thứ trong khoá này đều ghi hàng THẬT, và bạn cần xoá chúng được.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hai model</span><span class="lz-d">Một người dùng và một phiên. Đó là hình dạng TỐI THIỂU của mọi hệ đăng nhập, và phần còn lại của khoá chỉ thêm cột vào đúng hai cái bảng này.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Migrate, rồi chạy</span><span class="lz-d"><code>migrate dev</code> dùng được ở đây — đây là một cơ sở dữ liệu tại máy dùng xong bỏ, và đó là chỗ DUY NHẤT câu lệnh ấy thuộc về.</span></div>
</div>

<h3>Hai mươi dòng đó</h3>
<pre><code><span class="tok-comment">// src/index.ts — đừng dùng cái này ở bất cứ đâu</span>
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post('/sign-up', async (req, res) =&gt; {
  const { email, matKhau } = req.body;
  const nd = await prisma.nguoiDung.create({ data: { email, matKhau } });
  res.json({ id: nd.id });
});

app.post('/sign-in', async (req, res) =&gt; {
  const { email, matKhau } = req.body;
  const nd = await prisma.nguoiDung.findUnique({ where: { email } });
  if (!nd) return res.status(401).json({ loi: 'Email khong ton tai' });
  if (nd.matKhau !== matKhau) return res.status(401).json({ loi: 'Sai mat khau' });

  const phien = await prisma.phien.create({
    data: { id: String(Date.now()), nguoiDungId: nd.id },
  });
  res.json({ phien: phien.id });
});

app.get('/me', async (req, res) =&gt; {
  const phien = await prisma.phien.findUnique({
    where: { id: String(req.headers['x-phien']) },
    include: { nguoiDung: true },
  });
  if (!phien) return res.status(401).json({ loi: 'Chua dang nhap' });
  res.json({ email: phien.nguoiDung.email });
});

app.listen(3000, () =&gt; console.log('http://localhost:3000'));</code></pre>
<pre><code>npx tsx watch src/index.ts

curl -s localhost:3000/dang-ky -H 'content-type: application/json' \\
  -d '{"email":"an@vidu.com","matKhau":"khongaidoanduoc"}'
curl -s localhost:3000/dang-nhap -H 'content-type: application/json' \\
  -d '{"email":"an@vidu.com","matKhau":"khongaidoanduoc"}'
curl -s localhost:3000/toi -H 'x-phien: 1756000123456'</code></pre>
<div class="out">{"id":"clx7a2b1c0000abcdefghijkl"}
{"phien":"1756000123456"}
{"email":"an@vidu.com"}</div>
<div class="callout ok">
<p><strong>Nó CHẠY. Đó mới là điểm mấu chốt.</strong> Mọi lỗi trong sáu lỗi bên dưới đều VÔ HÌNH nhìn từ bên ngoài: các endpoint trả về đúng thứ cần trả, test sẽ xanh, và một buổi demo sẽ trôi chảy. Bug xác thực gần như không bao giờ là một cú sập — chúng là những hệ thống chạy CHÍNH XÁC như đã viết, nơi thứ đã viết không phải thứ đã định.</p>
</div>

<h3>Sáu vấn đề, sáu chương</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Mật khẩu cất y như lúc gõ vào → Chương 2</span><span class="lz-lnote"><code>SELECT email, "matKhau" FROM "NguoiDung"</code> in ra mật khẩu của TẤT CẢ mọi người. Một bản sao lưu rò ra, một lỗ SQL injection, một nhân viên tò mò — là mất sạch mọi tài khoản, cộng thêm mọi trang khác nơi người ta dùng lại mật khẩu đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Thông báo lỗi NÓI RA nửa nào sai → Chương 6</span><span class="lz-lnote">"Email khong ton tai" đối lại "Sai mat khau" biến cái form đăng nhập thành một cỗ máy tra cứu thành viên: kẻ tấn công biết được trong một triệu email rò rỉ thì email nào có tài khoản ở đây, TRƯỚC KHI thử một mật khẩu nào. Cả hai nhánh phải trả về CÙNG một thông báo, trong CÙNG một khoảng thời gian.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Mã phiên là <code>Date.now()</code> → Chương 3</span><span class="lz-lnote">Đoán được tới từng mili giây. Kẻ tấn công biết đại khái lúc bạn đăng nhập là dò được vài nghìn ứng viên. Một mã phiên phải tới từ nguồn ngẫu nhiên mật mã, với đủ số bit để việc đoán là vô vọng.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Phiên không bao giờ hết hạn và không thu hồi được → Chương 5</span><span class="lz-lnote">Không có <code>expiresAt</code>, không có đăng xuất, không có "thoát khỏi mọi thiết bị". Một phiên tạo hôm nay vẫn còn hiệu lực sang năm sau, và một phiên bị cắp thì hiệu lực MÃI MÃI. Hết hạn và thu hồi là TÍNH NĂNG, và đoạn mã này không có cái nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Tín vật đi trong một header tự chế → Chương 4</span><span class="lz-lnote"><code>x-phien</code> nghĩa là trình duyệt sẽ KHÔNG tự gửi nó, nên một front end thật buộc phải cất nó trong JavaScript — tức là một lỗ XSS là đọc được. Một cookie có <code>HttpOnly</code>, <code>Secure</code> và <code>SameSite</code> là một đánh đổi KHÁC, và Chương 4 là chỗ bạn chọn.</span></div>
  <div class="lz-layer"><span class="lz-lname">6 · Không có gì giới hạn số lần thử → Chương 10 và 11</span><span class="lz-lnote">Một script thử được mười nghìn mật khẩu mỗi giây lên cái endpoint này. Giới hạn tốc độ theo tài khoản và theo IP, khoá tạm có lùi dần, và một phép đối chiếu với danh sách mật khẩu đã lộ — đó là những thứ làm cho một cú dò trực tuyến trở nên vô nghĩa.</span></div>
</div>
<pre><code><span class="tok-comment">-- Vấn đề 1, chứng minh bằng một câu truy vấn</span>
psql "$DATABASE_URL" -c 'SELECT email, "matKhau" FROM "NguoiDung";'</code></pre>
<div class="out">     email     |     matKhau
---------------+------------------
 an@vidu.com   | khongaidoanduoc
 binh@vidu.com | 123456
 chi@vidu.com  | Matkhau@2026</div>
<pre><code><span class="tok-comment"># Vấn đề 2, chứng minh bằng hai request</span>
curl -s localhost:3000/dang-nhap -d '{"email":"co-that@vidu.com","matKhau":"x"}' -H 'content-type: application/json'
curl -s localhost:3000/dang-nhap -d '{"email":"khong-co@vidu.com","matKhau":"x"}' -H 'content-type: application/json'</code></pre>
<div class="out">{"loi":"Sai mat khau"}          ← tai khoan NAY co ton tai
{"loi":"Email khong ton tai"}   ← tai khoan nay khong

# Mot vong lap qua mot trieu email ro ri = danh sach nguoi dung cua ban.</div>
<div class="pitfall">
<p><strong>Bẫy — cách vá vấn đề 2 không phải chỉ MỘT thông báo, mà là một thông báo <em>VÀ</em> một khoảng thời gian.</strong> Nếu nhánh "không có người dùng" trả về trong 3 ms còn nhánh "sai mật khẩu" mất 80 ms vì nó có băm thứ gì đó, thì chênh lệch THỜI GIAN rò ra đúng cái thông tin mà thông báo lỗi vừa thôi rò. Chương 6 chỉ cách vá: băm một giá trị giả trên nhánh không-tìm-thấy để cả hai nhánh tốn như nhau.</p>
</div>
<div class="note-ct">
<p><strong>Hãy GIỮ dự án này lại. Bạn sẽ viết lại nó sáu lần.</strong> Mỗi chương vá một trong những dòng này và giải thích vì sao cách vá hiển nhiên thường là chưa đủ — băm chưa đủ chậm, hết hạn mà không thu hồi được, một cờ cookie lặng lẽ chẳng làm gì trên localhost. Tới Chương 11 thì hai mươi dòng đó sẽ thành khoảng chín mươi, và mỗi dòng thêm vào đều có một cú tấn công cụ thể đứng sau. Đó là hình dạng của cả khoá.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://expressjs.com/en/5x/api.html" target="_blank" rel="noopener"><span class="lc-ico">🚂</span><span class="lc-body"><span class="lc-title">Express 5 — tra cứu API</span><span class="lc-sub">expressjs.com · Có gì đổi so với bản 4, kể cả cách xử lý lỗi async</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/getting-started/quickstart-sqlite" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Prisma — bắt đầu nhanh</span><span class="lc-sub">prisma.io/docs · Nếu schema, migrate và generate còn mới với bạn</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🎫</span><span class="lc-body"><span class="lc-title">OWASP — Session Management Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Độ ngẫu nhiên của mã phiên, tuổi thọ, và những tính chất mà vấn đề 3 vi phạm</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Lược đồ, migration và truy vấn được dùng xuyên suốt khoá này</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Nếu cái file compose ở trên còn lạ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chạy đúng dự án này, rồi tự tìm đủ sáu vấn đề trước khi đọc danh sách</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Quiz: the problem|||0.4 — Quiz: bài toán',
      slug: 'auth-0-4-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về vì sao HTTP không nhớ ai, ba cổng nhận diện/xác thực/phân quyền, và sáu lỗi trong cái đăng nhập ở Bài 0.3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Quiz: the problem</h2>
<p class="lead">Six questions on the setup. None of them need code — they check that the three gates and the six problems landed, because every later chapter builds on both.</p>
<div class="callout">
<p><strong>What Section 0 established.</strong> HTTP forgets, so the client must carry proof, and that proof is a bearer credential someone will try to steal (0.1). "Login" is three separate questions, and skipping the third is the most common vulnerability there is (0.2). A working login can still be wrong in six ways, none of them visible from the outside (0.3).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Quiz: bài toán</h2>
<p class="lead">Sáu câu về phần dựng nền. Không câu nào cần mã — chúng kiểm xem BA CỔNG và SÁU VẤN ĐỀ đã đọng lại chưa, vì mọi chương sau đều dựng trên cả hai.</p>
<div class="callout">
<p><strong>Mục 0 đã xác lập điều gì.</strong> HTTP quên hết, nên phía client phải MANG THEO bằng chứng, và bằng chứng đó là một tín vật kiểu mang theo mà sẽ có người tìm cách ăn cắp (0.1). "Đăng nhập" là ba câu hỏi tách bạch, và bỏ qua câu thứ ba là lỗ hổng phổ biến nhất hiện có (0.2). Một cái đăng nhập CHẠY ĐƯỢC vẫn có thể sai sáu chỗ, mà không chỗ nào nhìn từ ngoài thấy được (0.3).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 540,
        questions: [
          {
            question: 'Why can a server not simply remember who you are between two requests?|||Vì sao một máy chủ không thể đơn giản là NHỚ bạn là ai giữa hai request?',
            options: [
              'Because HTTP is stateless by design — each request arrives with no link to any earlier one, which is what makes load balancers and CDNs possible|||Vì HTTP phi trạng thái theo THIẾT KẾ — mỗi request tới nơi mà không dính dáng gì tới request trước, và chính điều đó làm cho cân bằng tải và CDN khả thi',
              'Because servers do not have enough memory|||Vì máy chủ không đủ bộ nhớ',
              'Because browsers block it for privacy reasons|||Vì trình duyệt chặn chuyện đó vì lý do riêng tư',
              'It can, using the TCP connection|||Có thể chứ, dùng kết nối TCP',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which of these is a valid way to identify a returning user?|||Cái nào sau đây là cách HỢP LỆ để nhận ra một người dùng quay lại?',
            options: [
              'The IP address|||Địa chỉ IP',
              'The TCP connection it arrived on|||Cái kết nối TCP mà request đi tới',
              'A credential the client presents on every request — a session id or a signed token|||Một tín vật mà client TRÌNH RA ở mọi request — một mã phiên hoặc một token có chữ ký',
              'The User-Agent header|||Header User-Agent',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A route has requireAuth and then fetches an order by the id in the URL. What is missing?|||Một route có requireAuth rồi lấy đơn hàng theo id trong URL. Nó thiếu gì?',
            options: [
              'Nothing; requireAuth is enough|||Không thiếu gì; requireAuth là đủ',
              'Authorization: it knows WHO you are but never checks whether this order is YOURS — that is IDOR, and the fix belongs in the where clause|||Phân quyền: nó biết bạn LÀ AI nhưng chưa bao giờ kiểm cái đơn này CÓ PHẢI của bạn không — đó là IDOR, và cách vá thuộc về mệnh đề where',
              'Rate limiting|||Giới hạn tốc độ',
              'An index on the id column|||Một chỉ mục trên cột id',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When should a server send 403 rather than 401?|||Khi nào máy chủ nên gửi 403 thay vì 401?',
            options: [
              'When it knows who you are and the answer is still no — logging in again would not help|||Khi nó BIẾT bạn là ai và câu trả lời vẫn là không — đăng nhập lại cũng chẳng ích gì',
              'Whenever authentication fails|||Bất cứ khi nào xác thực thất bại',
              'Only for admin routes|||Chỉ với các route quản trị',
              'They are interchangeable|||Hai cái đó thay nhau được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Lesson 0.3 used Date.now() as the session id. Why is that a vulnerability?|||Bài 0.3 dùng Date.now() làm mã phiên. Vì sao đó là một lỗ hổng?',
            options: [
              'It collides when two users log in at once|||Nó trùng khi hai người cùng đăng nhập một lúc',
              'It is guessable: an attacker who knows roughly when someone logged in can brute-force a few thousand candidates — a session id needs cryptographic randomness|||Nó ĐOÁN ĐƯỢC: kẻ tấn công biết đại khái lúc ai đó đăng nhập là dò được vài nghìn ứng viên — một mã phiên cần độ ngẫu nhiên mật mã',
              'It is too long for a cookie|||Nó quá dài để nhét vào cookie',
              'It cannot be stored in PostgreSQL|||Nó không lưu được trong PostgreSQL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The login returns "Email khong ton tai" or "Sai mat khau" depending on which failed. What does an attacker gain?|||Cái đăng nhập trả "Email khong ton tai" hoặc "Sai mat khau" tuỳ nhánh nào trượt. Kẻ tấn công được gì?',
            options: [
              'Nothing; the password is still required|||Không được gì; vẫn phải có mật khẩu mà',
              'A membership oracle: they learn which of a million leaked emails have accounts here before trying any password — and equalising the message is not enough, the timing must match too|||Một cỗ máy tra thành viên: họ biết trong một triệu email rò rỉ thì email nào có tài khoản ở đây, trước khi thử mật khẩu nào — và làm cho thông báo giống nhau là CHƯA đủ, thời gian cũng phải khớp',
              'The password hash|||Chuỗi băm của mật khẩu',
              'The session id|||Mã phiên',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
