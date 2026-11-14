/**
 * Next.js & React — Chương 15: Xác thực, middleware & cookie.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần kiến trúc auth — không có output console để chạy. Sự cố THẬT cuongthai.com:
 * phiên chết sau 24h (JWT_EXPIRES_IN=24h nhưng cookie 7d, KHÔNG có /auth/refresh
 * chạy được → mọi call authed 401) → vá bằng POST /auth/refresh + axios 401
 * interceptor refresh-một-lần-rồi-retry. Lồng vào .note-ct/.pitfall.
 */

import G15_1 from './giang/nxj-15-1.mjs';
import G15_2 from './giang/nxj-15-2.mjs';
import G15_3 from './giang/nxj-15-3.mjs';
export default {
  title: 'Chapter 15 — Authentication, middleware, and cookies|||Chương 15 — Xác thực, middleware và cookie',
  description: 'Nơi lưu token (httpOnly cookie, không localStorage), API cookies() của App Router, middleware chặn route trước khi tới trang, đọc người dùng trên server, và vòng đời token: hết hạn + refresh — kèm sự cố phiên-chết-sau-24h thật của cuongthai.com.',
  lessons: [
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: '15.1 — Auth foundations: sessions, JWTs, and where the token lives|||15.1 — Nền tảng auth: session, JWT, và token nằm ở đâu',
      slug: 'nextjs-15-1-nen-tang-auth',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js JWT Auth Explained: Cookies, Refresh Tokens & 2FA (No Auth.js)" — Code With Joel (oEmbed verified).
      video: { url: 'https://youtu.be/H8RxNj492PY', durationSeconds: 0 },
      description: 'Xác thực = "bạn là ai". Hai mô hình phổ biến (session lưu server vs JWT tự chứa) và câu hỏi quan trọng nhất về bảo mật: token nên nằm ở đâu — và vì sao là httpOnly cookie, không phải localStorage.',
      content: `
${G15_1}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Who is this user — and where do we keep the proof?</h2>
<p class="lead">Authentication answers "who are you"; authorisation (Chapter 12) answers "may you do this." This chapter is about the first, and its central decision: after a user logs in, how do we remember them across requests, and where do we store that proof safely?</p>

<h3>Two models</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server session</span><span class="v">The server stores session data and hands the browser a session <em>id</em>. Every request looks the id up. Easy to revoke; needs server-side storage.</span></div>
  <div class="kv"><span class="k">JWT (token)</span><span class="v">A signed token that <em>contains</em> the user info. The server verifies the signature — no lookup needed. Stateless and simple; harder to revoke before it expires.</span></div>
</div>
<p>Both are valid. A JWT in a cookie is a common, lightweight choice for an app with its own backend — which is the setup this course's site uses.</p>

<h3>Where the token must live: an httpOnly cookie</h3>
<p>The most important security call is storage. The token should go in an <strong>httpOnly cookie</strong>, not <code>localStorage</code>.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">localStorage</span><span class="v">Readable by any JavaScript on the page — so any XSS can steal the token. Also not sent automatically with requests.</span></div>
  <div class="kv"><span class="k">httpOnly cookie</span><span class="v">Not readable by JavaScript at all, so XSS cannot exfiltrate it. Sent automatically with every request. Add <code>secure</code> (HTTPS only) and <code>sameSite</code> (CSRF defence).</span></div>
</div>

<div class="callout warn">
<p><strong>Rule:</strong> auth tokens belong in httpOnly, secure, sameSite cookies. Putting a JWT in <code>localStorage</code> "because it's easier to read" trades your users' sessions for convenience — the classic beginner security hole.</p>
</div>
<div class="callout warn"><strong>Measured: httpOnly stops the theft, not the attack.</strong> In the run below, a script injected through a comment read <code>localStorage</code> and <code>document.cookie</code>. With the token in <code>localStorage</code> it was carried away and replayed from another machine (200). With an httpOnly cookie it got <code>null</code> and <code>""</code> — but the same script still called <code>/api/me</code> and got An&#39;s data, because the browser attaches the cookie by itself. httpOnly turns "steal the session" into "use it while the page is open". Fix the XSS too.</div>

<h3>The four steps of an authenticated request</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Identify once, at login</b> — Verify a password or an OAuth callback, then issue a session — a cookie holding an id, or a signed token.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Carry it on every request</b> — HTTP has no memory. The cookie travels automatically; a bearer token has to be attached by your code.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Verify on the server, every time</b> — Never trust a client-side check. The UI hiding a button is a courtesy; the handler refusing the call is the control.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Authorise per resource</b> — &quot;Logged in&quot; is not &quot;allowed to edit note 13&quot;. Scope every query to the caller rather than checking afterwards.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a route that is protected only by the component that renders its link.</strong> Hiding &#96;/admin&#96; from the navigation for non-admins hides nothing: the URL is guessable, the route still renders, and anyone can type it. In the App Router this is worse than in a classic SPA, because the page runs on the server and may query the database before anything checks who is asking — so an unauthorised visitor gets real data, rendered server-side, with no request the client could have blocked. Check the session inside the page or the layout that owns the segment, and treat middleware as a redirect convenience rather than the security boundary.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Authentication</span><span class="lc-sub">The framework&#39;s own guide: sessions, middleware, and where each check belongs.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — Authentication Cheat Sheet</span><span class="lc-sub">The practical checklist, independent of framework.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Draw the login flow: credentials → server verifies → issues a token/session → stored in a cookie → sent on each request.</li>
<li>Compare a server session (id in a store) with a stateless JWT and list one trade-off of each.</li>
<li>Decide where the token should live (an httpOnly cookie) and why not <code>localStorage</code>.</li>
</ol>
<p><strong>Done when:</strong> you can describe the auth flow and justify storing the token in an httpOnly cookie.</p></div>

<h3>🔬 Measured: a JWT, a stolen copy, and one XSS (Next.js 16.4.6 · jose 6.2.17 · next start · Chromium)</h3>
<p>A lab app with a login route that can hand out the proof three ways: a JWT in an httpOnly cookie, a JWT in the response body (for <code>localStorage</code>), or a server-session id. Every line below is real output.</p>
<p><strong>1 · A JWT is signed, not encrypted.</strong> Anyone can decode the payload without the key; nobody can change it without the key.</p>
<div class="out">$ curl -si -X POST localhost:3000/api/login -d '{"name":"An"}' | grep -i set-cookie
set-cookie: token=eyJhbGciOiJI…(JWT); Path=/; Expires=Sat, 21 Nov 2026 04:11:45 GMT; Max-Age=604800; HttpOnly; SameSite=lax
$ echo -n $T | wc -c
JWT: 161 chars · 3 parts (header.payload.signature)
$ node -e "…" $T   # base64url-decode, no key
header : {"alg":"HS256"}
payload: {"name":"An","role":"admin","sub":"1","iat":1794629505,"exp":1794633105}
# Binh (a user) edits his own payload, keeps the signature
Binh, orig : {"name":"Binh","role":"user","sub":"2","iat":1794629505,"exp":1794633105}
Binh, edit : {"name":"Binh","role":"admin","sub":"2","iat":1794629505,"exp":1794633105}
$ curl -si localhost:3000/api/me -H "Cookie: token=$FORGED" | head -1
HTTP/1.1 401 Unauthorized
# server log
[auth] verify failed: ERR_JWS_SIGNATURE_VERIFICATION_FAILED</div>
<p>Never put a password or anything private in a JWT payload — it is base64url, not a secret.</p>
<p><strong>2 · Log out, then use a copy taken before logout.</strong></p>
<div class="out"># JWT
$ curl -c jar -X POST localhost:3000/api/login -d '{"name":"An"}'
$ curl -b jar -c jar -X POST localhost:3000/api/logout
$ curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/me -b jar               # the browser
401
$ curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/me -H "Cookie: token=$COPY"  # copy taken before logout
200
# server session (sid)
$ curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/me -H "Cookie: sid=$COPY"    # copy taken before logout
401</div>
<p>This is what "harder to revoke" means in numbers: a JWT has no server-side row to delete, so a stolen copy keeps working until <code>exp</code>. Keep <code>exp</code> short and add refresh (lesson 15.5), or keep a deny-list — which is a lookup again.</p>
<p><strong>3 · Where the token lives, in Chromium.</strong> Calls to <code>/api/me</code> after logging in each way:</p>
<div class="out">localStorage:  /api/me (no header) → 401 · /api/me + Bearer header → 200 · document.cookie = "" · localStorage.token = eyJhbGciOiJIUzI1…
httpOnly cookie:  /api/me (no header) → 200 · document.cookie = "" · localStorage.token = null…</div>
<p><strong>4 · One XSS, two storage choices.</strong> A comment rendered with <code>dangerouslySetInnerHTML</code> carries <code>&lt;img src="x" onerror="…"&gt;</code>; the handler reads <code>localStorage</code> and <code>document.cookie</code>, then calls <code>/api/me</code> as the user.</p>
<div class="out"># what the attacker's server received
{"localStorage":"eyJhbGciOiJIU…","documentCookie":""}
{"actedAsUser":{"error":"unauthorized"}}
{"localStorage":null,"documentCookie":""}
{"actedAsUser":{"via":"cookie","user":{"id":1,"name":"An","role":"admin"}}}
$ curl localhost:3000/api/me -H "Authorization: Bearer $STOLEN"   # from the attacker's machine
{"via":"bearer","user":{"id":1,"name":"An","role":"admin"}}</div>
<p><strong>5 · The route only a hidden link protects.</strong></p>
<div class="out">$ curl -si localhost:3000/admin | grep -E '^HTTP|Revenue'
HTTP/1.1 200
Revenue this month: 1,250,000,000 ₫ · 3 refunds pending
$ curl -si localhost:3000/admin2 | grep -iE '^HTTP|^location|Revenue'
HTTP/1.1 307 Temporary Redirect
location: /login
$ curl -si localhost:3000/admin2 -H "Cookie: token=$AN" | grep -E '^HTTP|Revenue'
HTTP/1.1 200
Revenue this month: 1,250,000,000 ₫ · 3 refunds pending</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n -A6 'response.cookies.set("backend_token"' src/app/api/auth/login/route.ts | head -8
99:    response.cookies.set("backend_token", token, {
100-      httpOnly: true,
101-      secure: process.env.NODE_ENV === "production",
102-      sameSite: "lax",
103-      maxAge: 60 * 60 * 24 * 30, // 30 ngày (08/11/2026), gia hạn trượt: lib/hetPhien.ts
104-      path: "/",
105-    });
$ grep -n "token is NOT persisted\\|JWT lives only\\|XSS attack vector" src/store/authStore.ts
173:        // NOTE: token is NOT persisted to localStorage.
174:        // The JWT lives only in the httpOnly backend_token cookie.
176:        // Persisting the token in localStorage is an XSS attack vector.
$ grep -rnE "localStorage\\.setItem\\(['\\"](token|backend_token|accessToken)" src | wc -l | sed 's/^ */localStorage.setItem(token…) trong src: /'
localStorage.setItem(token…) trong src: 0
$ grep -n "JWT_EXPIRES_IN" ../.env.example
33:JWT_EXPIRES_IN="24h"</div><code>backend_token</code> is an httpOnly cookie with <code>secure</code> in production, <code>sameSite: "lax"</code> and a 30-day life; the persisted auth store keeps the user, not the token. Note the second clock: the JWT inside it expires after <code>24h</code> — lesson 15.5 is about what happens when nothing renews it.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx create-next-app@latest lab --ts --app --src-dir &amp;&amp; cd lab &amp;&amp; npm i jose
<span class="tok-comment"># lib/auth.ts: SignJWT / jwtVerify (HS256); app/api/login (sets an httpOnly cookie), app/api/me, app/api/logout</span>
npm run build &amp;&amp; npm start
curl -si -X POST localhost:3000/api/login -d '{"name":"An"}' | grep -i set-cookie
node -e "console.log(Buffer.from(process.argv[1].split('.')[1], 'base64url').toString())" &lt;token&gt; <span class="tok-comment">  # no key needed</span>
<span class="tok-comment"># edit one claim, keep the signature, call /api/me ⇒ expect 401; log out and replay a copy ⇒ JWT 200, session 401</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-1-bang-phien" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 3.1 — One table, and what every column is for</span><span class="lc-sub">The server-session model, column by column</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-1-giai-ma-bang-tay" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.1 — Decode one by hand</span><span class="lc-sub">Header, payload, signature</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-5-cat-token-o-dau" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.5 — Where to keep a token in the browser</span><span class="lc-sub">localStorage, memory, cookie — the trade-offs</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-2-jwt-access-refresh" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 8.2 — JWT: access and refresh tokens</span><span class="lc-sub">The same token from the Express side</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Session</span><span class="v">Server-side record of a logged-in user, referenced by an id.</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">A signed, stateless token carrying claims.</span></div>
  <div class="kv"><span class="k">httpOnly cookie</span><span class="v">A cookie JS cannot read — safer place for a token.</span></div>
  <div class="kv"><span class="k">Authentication</span><span class="v">Proving who the user is.</span></div>
  <div class="kv"><span class="k">Authorization</span><span class="v">Deciding what the user may do.</span></div>
  <div class="kv"><span class="k">Why not localStorage</span><span class="v">Tokens in <code>localStorage</code> are exposed to XSS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Auth = authentication (who you are) + authorization (what you may do).</li><li>A session stores server-side state by id; a JWT is a stateless signed token — each has trade-offs.</li><li>Store the token in an httpOnly cookie, not <code>localStorage</code>, to reduce XSS exposure.</li><li>The cookie is sent on every request so the server can identify the user.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Authentication</span><span class="lc-sub">Sessions, tokens, and the auth building blocks in the App Router.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Người dùng này là ai — và ta giữ bằng chứng ở đâu?</h2>
<p class="lead">Xác thực trả lời "bạn là ai"; phân quyền (Chương 12) trả lời "bạn được làm điều này không". Chương này về cái đầu, và quyết định trung tâm của nó: sau khi người dùng đăng nhập, làm sao ta nhớ họ qua các request, và lưu bằng chứng đó ở đâu cho an toàn?</p>

<h3>Hai mô hình</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Session phía server</span><span class="v">Server lưu dữ liệu phiên và trao cho trình duyệt một <em>id</em> phiên. Mỗi request tra id đó. Dễ thu hồi; cần lưu trữ phía server.</span></div>
  <div class="kv"><span class="k">JWT (token)</span><span class="v">Một token đã ký <em>chứa</em> thông tin người dùng. Server xác minh chữ ký — không cần tra. Không trạng thái và đơn giản; khó thu hồi trước khi hết hạn.</span></div>
</div>
<p>Cả hai đều hợp lệ. Một JWT trong cookie là lựa chọn phổ biến, nhẹ cho một app có backend riêng — đúng cấu hình mà site của khoá dùng.</p>

<h3>Token phải nằm ở đâu: một httpOnly cookie</h3>
<p>Quyết định bảo mật quan trọng nhất là chỗ lưu. Token nên vào một <strong>httpOnly cookie</strong>, không phải <code>localStorage</code>.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">localStorage</span><span class="v">Đọc được bởi mọi JavaScript trên trang — nên bất kỳ XSS nào cũng đánh cắp được token. Cũng không tự gửi kèm request.</span></div>
  <div class="kv"><span class="k">httpOnly cookie</span><span class="v">JavaScript không đọc được, nên XSS không rút được nó. Tự gửi kèm mọi request. Thêm <code>secure</code> (chỉ HTTPS) và <code>sameSite</code> (chống CSRF).</span></div>
</div>

<div class="callout warn">
<p><strong>Quy tắc:</strong> token auth thuộc về cookie httpOnly, secure, sameSite. Đặt một JWT trong <code>localStorage</code> "vì dễ đọc hơn" là đánh đổi phiên của người dùng lấy sự tiện — lỗ hổng bảo mật kinh điển của người mới.</p>
</div>
<div class="callout warn"><strong>Đo thật: httpOnly chặn được trộm, không chặn được tấn công.</strong> Trong lượt chạy bên dưới, một script chèn qua bình luận đọc <code>localStorage</code> và <code>document.cookie</code>. Token nằm ở <code>localStorage</code> thì bị mang đi và dùng lại từ một máy khác (200). Nằm trong cookie httpOnly thì script nhận <code>null</code> và <code>""</code> — nhưng chính script đó vẫn gọi <code>/api/me</code> và lấy được dữ liệu của An, vì trình duyệt tự gắn cookie. httpOnly biến "trộm phiên" thành "dùng ké phiên khi trang còn mở". Vẫn phải sửa chính lỗ XSS.</div>

<h3>Bốn bước của một request đã xác thực</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Định danh một lần, lúc đăng nhập</b> — Kiểm một mật khẩu hoặc một callback OAuth, rồi cấp một phiên — một cookie giữ một id, hoặc một token đã ký.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Mang nó theo ở mọi request</b> — HTTP không có trí nhớ. Cookie đi theo tự động; một bearer token thì phải do mã của bạn đính kèm.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Xác minh ở máy chủ, mọi lần</b> — Đừng bao giờ tin một phép kiểm phía client. Giao diện giấu một cái nút là một cử chỉ lịch sự; handler từ chối lời gọi mới là phép kiểm soát.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Phân quyền theo từng tài nguyên</b> — &quot;Đã đăng nhập&quot; không phải là &quot;được phép sửa ghi chú 13&quot;. Hãy giới hạn mọi truy vấn theo người gọi thay vì kiểm sau.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một route chỉ được bảo vệ bởi cái component vẽ ra liên kết tới nó.</strong> Giấu &#96;/admin&#96; khỏi thanh điều hướng với người không phải quản trị viên thì chẳng giấu được gì: URL đoán được, route vẫn vẽ ra, và ai cũng gõ được. Trong App Router chuyện này còn tệ hơn một SPA cổ điển, vì trang chạy trên máy chủ và có thể đã truy vấn cơ sở dữ liệu trước khi có gì kiểm xem ai đang hỏi — nên một khách không có quyền nhận được dữ liệu thật, đã vẽ sẵn ở máy chủ, mà chẳng có request nào để phía client chặn lại. Hãy kiểm phiên đăng nhập ngay trong page hoặc layout sở hữu đoạn đó, và coi middleware là một tiện ích chuyển hướng chứ không phải cái biên an toàn.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Xác thực</span><span class="lc-sub">Hướng dẫn của chính framework: phiên, middleware, và mỗi phép kiểm thuộc về đâu.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — Authentication Cheat Sheet</span><span class="lc-sub">Bản kiểm thực dụng, độc lập với framework.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Vẽ luồng đăng nhập: thông tin đăng nhập → server xác minh → cấp token/session → lưu trong cookie → gửi mỗi request.</li>
<li>So một session phía server (id trong một store) với một JWT không trạng thái và nêu một đánh đổi của mỗi cái.</li>
<li>Quyết định token nên nằm đâu (một cookie httpOnly) và vì sao không phải <code>localStorage</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn mô tả được luồng auth và biện minh việc lưu token trong cookie httpOnly.</p></div>

<h3>🔬 Đo thật: một JWT, một bản chép bị trộm, và một vụ XSS (Next.js 16.4.6 · jose 6.2.17 · next start · Chromium)</h3>
<p>Một ứng dụng lab có route đăng nhập trao bằng chứng theo ba cách: JWT trong cookie httpOnly, JWT trong thân phản hồi (để cất vào <code>localStorage</code>), hoặc mã session phía máy chủ. Mọi dòng dưới đây là output thật.</p>
<p><strong>1 · JWT có ký, không mã hoá.</strong> Ai cũng giải mã được payload mà không cần khoá; không ai sửa được nếu không có khoá.</p>
<div class="out">$ curl -si -X POST localhost:3000/api/login -d '{"name":"An"}' | grep -i set-cookie
set-cookie: token=eyJhbGciOiJI…(JWT); Path=/; Expires=Sat, 21 Nov 2026 04:11:45 GMT; Max-Age=604800; HttpOnly; SameSite=lax
$ echo -n $T | wc -c
JWT: 161 ký tự · 3 phần (header.payload.signature)
$ node -e "…" $T   # giải mã base64url, không khoá
header : {"alg":"HS256"}
payload: {"name":"An","role":"admin","sub":"1","iat":1794629505,"exp":1794633105}
# Binh (người dùng thường) sửa payload của mình, giữ chữ ký
Binh, gốc : {"name":"Binh","role":"user","sub":"2","iat":1794629505,"exp":1794633105}
Binh, sửa : {"name":"Binh","role":"admin","sub":"2","iat":1794629505,"exp":1794633105}
$ curl -si localhost:3000/api/me -H "Cookie: token=$FORGED" | head -1
HTTP/1.1 401 Unauthorized
# nhật ký máy chủ
[auth] verify failed: ERR_JWS_SIGNATURE_VERIFICATION_FAILED</div>
<p>Đừng bao giờ đặt mật khẩu hay thứ riêng tư vào payload của JWT — nó là base64url, không phải bí mật.</p>
<p><strong>2 · Đăng xuất, rồi dùng một bản chép lấy trước lúc đăng xuất.</strong></p>
<div class="out"># JWT
$ curl -c jar -X POST localhost:3000/api/login -d '{"name":"An"}'
$ curl -b jar -c jar -X POST localhost:3000/api/logout
$ curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/me -b jar               # trình duyệt
401
$ curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/me -H "Cookie: token=$COPY"  # bản chép trước logout
200
# session phía máy chủ (sid)
$ curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/me -H "Cookie: sid=$COPY"    # bản chép trước logout
401</div>
<p>Đây là "khó thu hồi" bằng con số: JWT không có dòng nào phía máy chủ để xoá, nên bản chép bị trộm vẫn chạy tới <code>exp</code>. Giữ <code>exp</code> ngắn và thêm refresh (bài 15.5), hoặc giữ một danh sách chặn — mà như thế lại là tra cứu.</p>
<p><strong>3 · Token nằm ở đâu, đo trong Chromium.</strong> Gọi <code>/api/me</code> sau khi đăng nhập theo từng cách:</p>
<div class="out">localStorage:  /api/me (no header) → 401 · /api/me + Bearer header → 200 · document.cookie = "" · localStorage.token = eyJhbGciOiJIUzI1…
httpOnly cookie:  /api/me (no header) → 200 · document.cookie = "" · localStorage.token = null…</div>
<p><strong>4 · Một vụ XSS, hai cách cất.</strong> Một bình luận vẽ bằng <code>dangerouslySetInnerHTML</code> mang <code>&lt;img src="x" onerror="…"&gt;</code>; đoạn xử lý đọc <code>localStorage</code> và <code>document.cookie</code>, rồi gọi <code>/api/me</code> dưới tên người dùng.</p>
<div class="out"># máy chủ của kẻ gian nhận được
{"localStorage":"eyJhbGciOiJIU…","documentCookie":""}
{"actedAsUser":{"error":"unauthorized"}}
{"localStorage":null,"documentCookie":""}
{"actedAsUser":{"via":"cookie","user":{"id":1,"name":"An","role":"admin"}}}
$ curl localhost:3000/api/me -H "Authorization: Bearer $STOLEN"   # từ máy của kẻ gian
{"via":"bearer","user":{"id":1,"name":"An","role":"admin"}}</div>
<p><strong>5 · Route chỉ được che bằng một liên kết ẩn.</strong></p>
<div class="out">$ curl -si localhost:3000/admin | grep -E '^HTTP|Revenue'
HTTP/1.1 200
Revenue this month: 1,250,000,000 ₫ · 3 refunds pending
$ curl -si localhost:3000/admin2 | grep -iE '^HTTP|^location|Revenue'
HTTP/1.1 307 Temporary Redirect
location: /login
$ curl -si localhost:3000/admin2 -H "Cookie: token=$AN" | grep -E '^HTTP|Revenue'
HTTP/1.1 200
Revenue this month: 1,250,000,000 ₫ · 3 refunds pending</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n -A6 'response.cookies.set("backend_token"' src/app/api/auth/login/route.ts | head -8
99:    response.cookies.set("backend_token", token, {
100-      httpOnly: true,
101-      secure: process.env.NODE_ENV === "production",
102-      sameSite: "lax",
103-      maxAge: 60 * 60 * 24 * 30, // 30 ngày (08/11/2026), gia hạn trượt: lib/hetPhien.ts
104-      path: "/",
105-    });
$ grep -n "token is NOT persisted\\|JWT lives only\\|XSS attack vector" src/store/authStore.ts
173:        // NOTE: token is NOT persisted to localStorage.
174:        // The JWT lives only in the httpOnly backend_token cookie.
176:        // Persisting the token in localStorage is an XSS attack vector.
$ grep -rnE "localStorage\\.setItem\\(['\\"](token|backend_token|accessToken)" src | wc -l | sed 's/^ */localStorage.setItem(token…) trong src: /'
localStorage.setItem(token…) trong src: 0
$ grep -n "JWT_EXPIRES_IN" ../.env.example
33:JWT_EXPIRES_IN="24h"</div><code>backend_token</code> là cookie httpOnly, <code>secure</code> khi production, <code>sameSite: "lax"</code>, sống 30 ngày; store auth được lưu giữ người dùng, không giữ token. Để ý chiếc đồng hồ thứ hai: JWT bên trong hết hạn sau <code>24h</code> — bài 15.5 nói về chuyện xảy ra khi không có gì gia hạn nó.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx create-next-app@latest lab --ts --app --src-dir &amp;&amp; cd lab &amp;&amp; npm i jose
<span class="tok-comment"># lib/auth.ts: SignJWT / jwtVerify (HS256); app/api/login (đặt cookie httpOnly), app/api/me, app/api/logout</span>
npm run build &amp;&amp; npm start
curl -si -X POST localhost:3000/api/login -d '{"name":"An"}' | grep -i set-cookie
node -e "console.log(Buffer.from(process.argv[1].split('.')[1], 'base64url').toString())" &lt;token&gt; <span class="tok-comment">  # không cần khoá</span>
<span class="tok-comment"># sửa một claim, giữ chữ ký, gọi /api/me ⇒ chờ 401; đăng xuất rồi dùng lại bản chép ⇒ JWT 200, session 401</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-1-bang-phien" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 3.1 — Một cái bảng, và mỗi cột để làm gì</span><span class="lc-sub">Mô hình session phía máy chủ, từng cột</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-1-giai-ma-bang-tay" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.1 — Tự tay giải mã một cái</span><span class="lc-sub">Header, payload, chữ ký</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-5-cat-token-o-dau" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.5 — Cất token ở đâu trong trình duyệt</span><span class="lc-sub">localStorage, bộ nhớ, cookie — các đánh đổi</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-2-jwt-access-refresh" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 8.2 — JWT: access token và refresh token</span><span class="lc-sub">Cùng loại token, nhìn từ phía Express</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Session</span><span class="v">Bản ghi phía server của một người dùng đã đăng nhập, tham chiếu bằng một id.</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">Một token đã ký, không trạng thái, mang các claim.</span></div>
  <div class="kv"><span class="k">Cookie httpOnly</span><span class="v">Một cookie JS không đọc được — chỗ an toàn hơn cho token.</span></div>
  <div class="kv"><span class="k">Xác thực</span><span class="v">Chứng minh người dùng là ai.</span></div>
  <div class="kv"><span class="k">Phân quyền</span><span class="v">Quyết định người dùng được làm gì.</span></div>
  <div class="kv"><span class="k">Vì sao không localStorage</span><span class="v">Token trong <code>localStorage</code> bị lộ cho XSS.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Auth = xác thực (bạn là ai) + phân quyền (bạn được làm gì).</li><li>Một session lưu state phía server theo id; một JWT là token đã ký không trạng thái — mỗi cái có đánh đổi.</li><li>Lưu token trong cookie httpOnly, không phải <code>localStorage</code>, để giảm phơi nhiễm XSS.</li><li>Cookie được gửi mỗi request để server nhận ra người dùng.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Authentication</span><span class="lc-sub">Session, token, và các khối xây auth trong App Router.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: '15.2 — Cookies in the App Router|||15.2 — Cookie trong App Router',
      slug: 'nextjs-15-2-cookies',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'API cookies() cho đọc cookie trong Server Component và ghi/xoá cookie trong Server Action hay Route Handler. Các cờ httpOnly, secure, sameSite, maxAge — và vì sao chỉ ghi được ở nơi có response.',
      content: `
${G15_2}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Reading and writing cookies on the server</h2>
<p class="lead">Next.js gives a <code>cookies()</code> helper from <code>next/headers</code> for working with cookies in server code. You <em>read</em> cookies almost anywhere on the server; you may only <em>set</em> or delete them where there is a response to attach them to — a Server Action or a Route Handler.</p>

<pre><code class="language-javascript">import { cookies } from 'next/headers';

<span class="tok-comment">// READ — e.g. in a Server Component</span>
const token = (await cookies()).get('token')?.value;

<span class="tok-comment">// SET — only in a Server Action or Route Handler</span>
(await cookies()).set('token', jwt, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,   <span class="tok-comment">// 7 days, in seconds</span>
  path: '/',
});</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">httpOnly</span><span class="v">JavaScript cannot read it — the XSS defence from the last lesson.</span></div>
  <div class="kv"><span class="k">secure</span><span class="v">Sent only over HTTPS. Measured in Chromium: <code>http://localhost</code> and <code>http://127.0.0.1</code> count as secure, so a <code>secure</code> cookie works in local development too — no need to switch it off.</span></div>
  <div class="kv"><span class="k">sameSite</span><span class="v">Controls cross-site sending — <code>lax</code>/<code>strict</code> defend against CSRF.</span></div>
  <div class="kv"><span class="k">maxAge / expires</span><span class="v">How long the cookie lives. Note this is the <em>cookie's</em> lifetime — not the token's own expiry (lesson 15.5 is where those two disagreeing caused a real outage).</span></div>
</div>

<div class="callout warn">
<p><strong>Why you cannot set a cookie in a Server Component:</strong> a Server Component only renders output; it has no response to write a <code>Set-Cookie</code> header onto. Setting cookies happens during a mutation (Server Action) or in a Route Handler that returns a response. Trying to set one while rendering will error — do it in the action that logs the user in.</p>
</div>
<div class="callout warn"><strong>Measured: paste the code above into a Server Action and it does not compile as-is.</strong><div class="out">src/app/c/bai/actions.ts(7,34): error TS2304: Cannot find name 'jwt'.</div><code>jwt</code> is not defined — sign the token first (lesson 15.1). And note the <code>await</code>: since Next.js 15 <code>cookies()</code> returns a Promise. The Next.js 14 call <code>cookies().get(…)</code> is a type error on 16, and forced through it crashes:<div class="out">src/app/c/cu/page.tsx(5,27): error TS2339: Property 'get' does not exist on type 'Promise&lt;ReadonlyRequestCookies&gt;'.
HTTP/1.1 500 Internal Server Error
⨯ TypeError: (0 , c.cookies)(...).get is not a function</div></div>

<h3>Reading and writing cookies in the App Router</h3>
<div class="lz-map">
  <div class="lz-stage">Where each is allowed, and what it costs</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">cookies() reads them</div><div class="lz-nsub">In a Server Component, a Server Action or a route handler. Reading it opts the route into dynamic rendering — that is deliberate.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Only actions and handlers may write</div><div class="lz-nsub">A Server Component renders during a response that may already be cached, so setting a cookie there is not allowed.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">The flags are the security</div><div class="lz-nsub">&#96;httpOnly&#96;, &#96;secure&#96;, &#96;sameSite&#96;, and an explicit &#96;maxAge&#96;. Without &#96;httpOnly&#96;, an XSS bug is a session theft.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Keep them small</div><div class="lz-nsub">Cookies travel on every request, including images and API calls. A large one is a tax on the whole site.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — a page that reads cookies and silently stops being static.</strong> Calling &#96;cookies()&#96; anywhere in a route — including in a shared helper three files deep — switches it to dynamic rendering for every visitor. It is the correct behaviour, because a cached page cannot vary per user, but nothing in the code says so: a marketing page that reads a theme cookie inside a layout quietly loses static generation and starts re-rendering on every request. The build output is where you find out — routes marked &#96;ƒ&#96; are dynamic. Check it after any change to a shared layout, and read the cookie in a small Client Component when only the browser needs it.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noopener">
  <span class="lc-ico">🍪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — cookies()</span><span class="lc-sub">Read, set and delete, with the exact rules about where each is allowed.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">MDN — HTTP cookies</span><span class="lc-sub">Every flag and what it defends against, in the general web case.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Read a cookie on the server with <code>cookies()</code> from <code>next/headers</code> in a Server Component.</li>
<li>Set a cookie from a Server Action or Route Handler with the right flags (<code>httpOnly</code>, <code>secure</code>, <code>sameSite</code>, <code>path</code>, <code>maxAge</code>).</li>
<li>Confirm you cannot set a cookie during the render of a Server Component (only in actions/handlers).</li>
</ol>
<p><strong>Done when:</strong> you can read and set cookies on the server with the correct flags.</p></div>

<h3>🔬 Measured: cookies() in Next.js 16.4.6 (next start · Chromium · a second site on 127.0.0.1)</h3>
<p><strong>1 · A Server Action sets the cookie.</strong> The action signs a JWT and calls <code>(await cookies()).set('token', jwt, { httpOnly, secure, sameSite: 'lax', maxAge })</code>:</p>
<div class="out">before:  document.cookie = ""
after Log in (POST):  document.cookie = ""
/c/doc (server):  token: eyJhbGciOiJI…
after Log out:  token: none</div>
<p><strong>2 · Every Set-Cookie on the wire.</strong> A Route Handler sets six cookies (<code>c_big</code> is 4,100 bytes):</p>
<div class="out">$ curl -si localhost:3000/api/c | grep -i set-cookie
set-cookie: c_lax=1; Path=/; SameSite=lax
set-cookie: c_strict=1; Path=/; SameSite=strict
set-cookie: c_none=1; Path=/; Secure; SameSite=none
set-cookie: c_default=1; Path=/
set-cookie: c_secure=1; Path=/; Secure
set-cookie: c_big=xxxx…(4100 x); Path=/</div>
<p>Chromium sent back <code>c_default, c_lax, c_none, c_secure, c_strict</code> — <code>c_big</code> was <strong>dropped silently</strong> (about 4 KB per cookie is the limit), and <code>c_secure</code> arrived on both <code>localhost</code> and <code>127.0.0.1</code> over plain http.</p>
<p><strong>3 · Setting a cookie while rendering a Server Component.</strong></p>
<div class="out">$ curl -si localhost:3000/c/sai | head -1
HTTP/1.1 500 Internal Server Error
# server log
⨯ Error: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options</div>
<p><strong>4 · SameSite, measured from a second site.</strong> A page on <code>127.0.0.1:19313</code> (a different <em>site</em> from <code>localhost</code>) links and posts to <code>localhost</code>; a route echoes which cookies arrived.</p>
<div style="overflow-x:auto"><table><tr><th>Cookie</th><th>same site</th><th>other site · GET link</th><th>other site · POST form</th><th>POST, 125 s later</th></tr><tr><td><code>SameSite=lax</code></td><td>sent</td><td>sent</td><td>—</td><td>—</td></tr><tr><td><code>SameSite=strict</code></td><td>sent</td><td>—</td><td>—</td><td>—</td></tr><tr><td><code>SameSite=none</code></td><td>sent</td><td>sent</td><td>sent</td><td>sent</td></tr><tr><td><code>no SameSite</code></td><td>sent</td><td>sent</td><td>sent</td><td>—</td></tr></table></div>
<div class="callout warn"><strong>The 2-minute exception.</strong> A cookie set with <em>no</em> SameSite is treated as <code>lax</code> — yet Chromium still sent it on the cross-site POST right after it was set, and stopped 125 seconds later. Always set <code>sameSite</code> explicitly; never rely on the default for CSRF.</div>
<p><strong>5 · One cookie read in a layout.</strong></p>
<div class="out">$ npm run build   # layout without cookies()
└ ○ /tinh
# the layout now reads a theme cookie
$ npm run build
└ ƒ /tinh</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -rlE "from 'next/headers'" src | xargs grep -lE "cookies\\(\\)" | wc -l | sed 's/^ */tệp gọi cookies(): /'
tệp gọi cookies(): 5
$ grep -rnE "cookies\\(\\)\\.(get|getAll|set|has)" src | wc -l | sed 's/^ */cookies().get… (kiểu đồng bộ của Next 14): /'
cookies().get… (kiểu đồng bộ của Next 14): 3
$ grep -rnE "cookies\\(\\)\\.(get|getAll|set|has)" src | cut -d: -f1,2,3 | sed -E 's/ +/ /g'
src/app/exam/[examId]/page.tsx:10: const token = cookies().get('backend_token')?.value;
src/app/exam/attempt/[attemptId]/page.tsx:8: const token = cookies().get('backend_token')?.value;
src/app/phong-video/[lessonId]/page.tsx:35: const token = cookies().get('backend_token')?.value;</div>The site runs Next.js 14, where the synchronous <code>cookies().get(…)</code> is correct. On an upgrade to 16 these three lines are the ones that break (measured above: <code>TS2339</code>, then a 500) — the fix is <code>(await cookies()).get(…)</code>.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start
curl -si localhost:3000/api/c | grep -i set-cookie      <span class="tok-comment">  # every flag on the wire</span>
python3 -m http.server 8001 --bind 127.0.0.1           <span class="tok-comment">  # site B: a page with a link and a POST form to localhost:3000</span>
<span class="tok-comment"># open http://127.0.0.1:8001, click / submit, read which cookies arrived; submit again after 2 minutes</span>
npm run build 2&gt;&amp;1 | grep -E '○|ƒ'                       <span class="tok-comment">  # add cookies() to a layout and watch ○ become ƒ</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-2-thuoc-tinh-cookie" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 3.2 — Every cookie attribute, and what it actually stops</span><span class="lc-sub">Domain, Path, Secure, HttpOnly, SameSite</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-4-csrf" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 3.4 — CSRF, and the three defences ranked</span><span class="lc-sub">Why SameSite is the first line, not the only one</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 8.4 — Cookies, CSRF, revocation and rate limiting</span><span class="lc-sub">The same flags from Express</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-1-server-action-la-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.1 — What a Server Action is</span><span class="lc-sub">Where the Set-Cookie response comes from</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">cookies()</span><span class="v">The <code>next/headers</code> helper to read/write cookies on the server.</span></div>
  <div class="kv"><span class="k">httpOnly</span><span class="v">Flag blocking JS access to the cookie.</span></div>
  <div class="kv"><span class="k">secure</span><span class="v">Only send the cookie over HTTPS.</span></div>
  <div class="kv"><span class="k">sameSite</span><span class="v">Controls cross-site sending (CSRF defense).</span></div>
  <div class="kv"><span class="k">maxAge / expires</span><span class="v">How long the cookie lives.</span></div>
  <div class="kv"><span class="k">Set in action/handler</span><span class="v">Cookies can be set in actions/handlers, not during render.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Read and write cookies on the server with <code>cookies()</code> from <code>next/headers</code>.</li><li>Set auth cookies with <code>httpOnly</code>, <code>secure</code>, <code>sameSite</code> and a sensible lifetime.</li><li>You can set cookies in Server Actions and Route Handlers, not during a Server Component's render.</li><li>These flags are the baseline defense for session cookies.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noopener">
  <span class="lc-ico">🍪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — cookies()</span><span class="lc-sub">Reading, setting, and deleting cookies, and where each is allowed.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Đọc và ghi cookie trên server</h2>
<p class="lead">Next.js cho một helper <code>cookies()</code> từ <code>next/headers</code> để làm việc với cookie trong code server. Bạn <em>đọc</em> cookie gần như ở đâu trên server cũng được; nhưng chỉ <em>ghi</em> hoặc xoá được ở nơi có một response để gắn — một Server Action hoặc một Route Handler.</p>

<pre><code class="language-javascript">import { cookies } from 'next/headers';

<span class="tok-comment">// ĐỌC — ví dụ trong một Server Component</span>
const token = (await cookies()).get('token')?.value;

<span class="tok-comment">// GHI — chỉ trong một Server Action hoặc Route Handler</span>
(await cookies()).set('token', jwt, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,   <span class="tok-comment">// 7 ngày, tính bằng giây</span>
  path: '/',
});</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">httpOnly</span><span class="v">JavaScript không đọc được — lá chắn XSS ở bài trước.</span></div>
  <div class="kv"><span class="k">secure</span><span class="v">Chỉ gửi qua HTTPS. Đo trong Chromium: <code>http://localhost</code> và <code>http://127.0.0.1</code> được coi là an toàn, nên cookie <code>secure</code> vẫn chạy khi phát triển cục bộ — không cần tắt.</span></div>
  <div class="kv"><span class="k">sameSite</span><span class="v">Kiểm soát gửi liên-site — <code>lax</code>/<code>strict</code> chống CSRF.</span></div>
  <div class="kv"><span class="k">maxAge / expires</span><span class="v">Cookie sống bao lâu. Để ý đây là tuổi thọ của <em>cookie</em> — không phải hạn của chính token (bài 15.5 là nơi hai cái này lệch nhau gây sự cố thật).</span></div>
</div>

<div class="callout warn">
<p><strong>Vì sao không set cookie trong một Server Component:</strong> một Server Component chỉ render output; nó không có response để ghi header <code>Set-Cookie</code>. Việc set cookie xảy ra trong một mutation (Server Action) hoặc trong một Route Handler trả về response. Cố set trong lúc render sẽ lỗi — hãy làm trong action đăng nhập người dùng.</p>
</div>
<div class="callout warn"><strong>Đo thật: dán đoạn mã trên vào một Server Action thì không biên dịch nguyên như vậy được.</strong><div class="out">src/app/c/bai/actions.ts(7,34): error TS2304: Cannot find name 'jwt'.</div><code>jwt</code> chưa được khai — hãy ký token trước (bài 15.1). Và để ý chữ <code>await</code>: từ Next.js 15, <code>cookies()</code> trả về một Promise. Cách gọi của Next.js 14 <code>cookies().get(…)</code> là lỗi kiểu trên bản 16, ép qua thì sập:<div class="out">src/app/c/cu/page.tsx(5,27): error TS2339: Property 'get' does not exist on type 'Promise&lt;ReadonlyRequestCookies&gt;'.
HTTP/1.1 500 Internal Server Error
⨯ TypeError: (0 , c.cookies)(...).get is not a function</div></div>

<h3>Đọc và ghi cookie trong App Router</h3>
<div class="lz-map">
  <div class="lz-stage">Mỗi việc được phép ở đâu, và tốn gì</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">cookies() đọc chúng</div><div class="lz-nsub">Trong một Server Component, một Server Action hoặc một route handler. Đọc nó sẽ đưa route sang chế độ render động — đó là chủ đích.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chỉ action và handler được GHI</div><div class="lz-nsub">Một Server Component vẽ ra trong một phản hồi có thể đã được nhớ đệm, nên đặt cookie ở đó là không được phép.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Các cờ mới là phần an toàn</div><div class="lz-nsub">&#96;httpOnly&#96;, &#96;secure&#96;, &#96;sameSite&#96;, và một &#96;maxAge&#96; tường minh. Thiếu &#96;httpOnly&#96; thì một lỗ hổng XSS là một vụ trộm phiên.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Giữ chúng nhỏ</div><div class="lz-nsub">Cookie đi theo MỌI request, kể cả ảnh và lời gọi API. Một cái cookie to là một khoản thuế đánh lên cả trang.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một trang đọc cookie rồi âm thầm thôi là trang tĩnh.</strong> Gọi &#96;cookies()&#96; ở bất cứ đâu trong một route — kể cả trong một hàm phụ dùng chung nằm sâu ba file — sẽ chuyển nó sang render động cho mọi khách. Đó là hành vi đúng, vì một trang đã nhớ đệm không thể khác nhau theo từng người, nhưng chẳng có gì trong mã nói ra điều đó: một trang giới thiệu đọc cookie chủ đề bên trong một layout sẽ lặng lẽ mất phần sinh tĩnh và bắt đầu vẽ lại ở mọi request. Đầu ra của build là chỗ bạn phát hiện ra — route đánh dấu &#96;ƒ&#96; là động. Hãy kiểm nó sau mỗi thay đổi ở một layout dùng chung, và đọc cookie trong một Client Component nhỏ khi chỉ trình duyệt cần nó.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noopener">
  <span class="lc-ico">🍪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — cookies()</span><span class="lc-sub">Đọc, đặt và xoá, kèm luật chính xác về chỗ nào được phép làm gì.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">MDN — Cookie HTTP</span><span class="lc-sub">Mọi cờ và nó phòng thủ điều gì, trong trường hợp web tổng quát.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đọc một cookie trên server bằng <code>cookies()</code> từ <code>next/headers</code> trong một Server Component.</li>
<li>Đặt một cookie từ một Server Action hoặc Route Handler với các cờ đúng (<code>httpOnly</code>, <code>secure</code>, <code>sameSite</code>, <code>path</code>, <code>maxAge</code>).</li>
<li>Xác nhận bạn không đặt được cookie trong lúc render một Server Component (chỉ trong action/handler).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc và đặt được cookie trên server với các cờ đúng.</p></div>

<h3>🔬 Đo thật: cookies() trên Next.js 16.4.6 (next start · Chromium · một site thứ hai ở 127.0.0.1)</h3>
<p><strong>1 · Server Action đặt cookie.</strong> Action ký JWT rồi gọi <code>(await cookies()).set('token', jwt, { httpOnly, secure, sameSite: 'lax', maxAge })</code>:</p>
<div class="out">trước:  document.cookie = ""
sau Đăng nhập (POST):  document.cookie = ""
/c/doc (máy chủ):  token: eyJhbGciOiJI…
sau Đăng xuất:  token: none</div>
<p><strong>2 · Mọi Set-Cookie trên đường truyền.</strong> Một Route Handler đặt sáu cookie (<code>c_big</code> dài 4.100 byte):</p>
<div class="out">$ curl -si localhost:3000/api/c | grep -i set-cookie
set-cookie: c_lax=1; Path=/; SameSite=lax
set-cookie: c_strict=1; Path=/; SameSite=strict
set-cookie: c_none=1; Path=/; Secure; SameSite=none
set-cookie: c_default=1; Path=/
set-cookie: c_secure=1; Path=/; Secure
set-cookie: c_big=xxxx…(4100 x); Path=/</div>
<p>Chromium gửi lại <code>c_default, c_lax, c_none, c_secure, c_strict</code> — <code>c_big</code> bị <strong>bỏ im lặng</strong> (giới hạn khoảng 4 KB mỗi cookie), còn <code>c_secure</code> tới được cả <code>localhost</code> lẫn <code>127.0.0.1</code> qua http thường.</p>
<p><strong>3 · Đặt cookie lúc đang render một Server Component.</strong></p>
<div class="out">$ curl -si localhost:3000/c/sai | head -1
HTTP/1.1 500 Internal Server Error
# nhật ký máy chủ
⨯ Error: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options</div>
<p><strong>4 · SameSite, đo từ một site thứ hai.</strong> Một trang ở <code>127.0.0.1:19313</code> (một <em>site</em> khác hẳn <code>localhost</code>) đặt liên kết và gửi form tới <code>localhost</code>; một route in ra cookie nào đã tới.</p>
<div style="overflow-x:auto"><table><tr><th>Cookie</th><th>cùng site</th><th>site khác · liên kết GET</th><th>site khác · form POST</th><th>POST sau 125 giây</th></tr><tr><td><code>SameSite=lax</code></td><td>đi theo</td><td>đi theo</td><td>—</td><td>—</td></tr><tr><td><code>SameSite=strict</code></td><td>đi theo</td><td>—</td><td>—</td><td>—</td></tr><tr><td><code>SameSite=none</code></td><td>đi theo</td><td>đi theo</td><td>đi theo</td><td>đi theo</td></tr><tr><td><code>không khai SameSite</code></td><td>đi theo</td><td>đi theo</td><td>đi theo</td><td>—</td></tr></table></div>
<div class="callout warn"><strong>Ngoại lệ hai phút.</strong> Cookie đặt <em>không</em> khai SameSite được coi là <code>lax</code> — vậy mà Chromium vẫn gửi nó theo POST từ site khác ngay sau khi đặt, và chỉ thôi sau 125 giây. Luôn khai <code>sameSite</code> rõ ràng; đừng dựa vào mặc định để chống CSRF.</div>
<p><strong>5 · Một lần đọc cookie trong layout.</strong></p>
<div class="out">$ npm run build   # layout chưa gọi cookies()
└ ○ /tinh
# layout giờ đọc cookie theme
$ npm run build
└ ƒ /tinh</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -rlE "from 'next/headers'" src | xargs grep -lE "cookies\\(\\)" | wc -l | sed 's/^ */tệp gọi cookies(): /'
tệp gọi cookies(): 5
$ grep -rnE "cookies\\(\\)\\.(get|getAll|set|has)" src | wc -l | sed 's/^ */cookies().get… (kiểu đồng bộ của Next 14): /'
cookies().get… (kiểu đồng bộ của Next 14): 3
$ grep -rnE "cookies\\(\\)\\.(get|getAll|set|has)" src | cut -d: -f1,2,3 | sed -E 's/ +/ /g'
src/app/exam/[examId]/page.tsx:10: const token = cookies().get('backend_token')?.value;
src/app/exam/attempt/[attemptId]/page.tsx:8: const token = cookies().get('backend_token')?.value;
src/app/phong-video/[lessonId]/page.tsx:35: const token = cookies().get('backend_token')?.value;</div>Site chạy Next.js 14, nơi <code>cookies().get(…)</code> đồng bộ là đúng. Khi nâng lên 16, đúng ba dòng này sẽ gãy (đo ở trên: <code>TS2339</code>, rồi 500) — sửa thành <code>(await cookies()).get(…)</code>.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm start
curl -si localhost:3000/api/c | grep -i set-cookie      <span class="tok-comment">  # từng cờ trên đường truyền</span>
python3 -m http.server 8001 --bind 127.0.0.1           <span class="tok-comment">  # site B: trang có liên kết và form POST tới localhost:3000</span>
<span class="tok-comment"># mở http://127.0.0.1:8001, bấm / gửi, đọc cookie nào đã tới; gửi lại sau 2 phút</span>
npm run build 2&gt;&amp;1 | grep -E '○|ƒ'                       <span class="tok-comment">  # thêm cookies() vào layout rồi xem ○ thành ƒ</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-2-thuoc-tinh-cookie" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 3.2 — Từng thuộc tính cookie, và nó THẬT SỰ chặn được gì</span><span class="lc-sub">Domain, Path, Secure, HttpOnly, SameSite</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-4-csrf" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 3.4 — CSRF, và ba lớp phòng xếp theo thứ tự</span><span class="lc-sub">Vì sao SameSite là lớp đầu, không phải lớp duy nhất</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 8.4 — Cookie, CSRF, thu hồi phiên và chặn dò mật khẩu</span><span class="lc-sub">Cùng các cờ đó, nhìn từ Express</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-1-server-action-la-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.1 — Server Action là gì</span><span class="lc-sub">Response mang Set-Cookie đến từ đâu</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">cookies()</span><span class="v">Helper của <code>next/headers</code> để đọc/ghi cookie trên server.</span></div>
  <div class="kv"><span class="k">httpOnly</span><span class="v">Cờ chặn JS truy cập cookie.</span></div>
  <div class="kv"><span class="k">secure</span><span class="v">Chỉ gửi cookie qua HTTPS.</span></div>
  <div class="kv"><span class="k">sameSite</span><span class="v">Điều khiển việc gửi chéo site (phòng CSRF).</span></div>
  <div class="kv"><span class="k">maxAge / expires</span><span class="v">Cookie sống bao lâu.</span></div>
  <div class="kv"><span class="k">Đặt trong action/handler</span><span class="v">Cookie đặt được trong action/handler, không trong lúc render.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đọc và ghi cookie trên server bằng <code>cookies()</code> từ <code>next/headers</code>.</li><li>Đặt cookie auth với <code>httpOnly</code>, <code>secure</code>, <code>sameSite</code> và thời hạn hợp lý.</li><li>Bạn đặt cookie được trong Server Action và Route Handler, không trong lúc render một Server Component.</li><li>Các cờ này là phòng thủ nền cho cookie session.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noopener">
  <span class="lc-ico">🍪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — cookies()</span><span class="lc-sub">Đọc, set, và xoá cookie, và nơi nào cho phép cái nào.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: '15.3 — Middleware: gate requests before they reach a page|||15.3 — Middleware: chặn request trước khi tới trang',
      slug: 'nextjs-15-3-middleware',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'middleware.ts chạy TRƯỚC mỗi request khớp — chỗ lý tưởng để chuyển hướng người chưa đăng nhập, đổi header, i18n. Cấu hình matcher, chạy trên edge (giới hạn), và vì sao nó KHÔNG đủ làm auth một mình.',
      content: `
${G15_3}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Code that runs before the request reaches your route</h2>
<p class="lead">A single <code>middleware.ts</code> at the project root runs on matching requests <em>before</em> they hit a page or handler. It is the place for cross-cutting gate-keeping: redirect unauthenticated users, rewrite URLs, set headers, handle locale.</p>
<div class="callout warn"><strong>Measured on Next.js 16.4.6: the file is now <code>proxy.ts</code>.</strong> The snippet below, pasted as-is, fails the type check; typed and built, it still runs but the build warns:<div class="out">middleware.ts(3,28): error TS7006: Parameter 'request' implicitly has an 'any' type.
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.</div>In Next.js 16 rename the file to <code>proxy.ts</code> (next to <code>app/</code>, so in <code>src/</code> if you use one) and the function to <code>proxy</code>:<pre><code class="language-typescript"><span class="tok-comment">// src/proxy.ts  (Next.js 16 — was middleware.ts)</span>
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next(); <span class="tok-comment">  // allow through</span>
}

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };</code></pre></div>

<pre><code class="language-javascript"><span class="tok-comment">// middleware.ts (project root)</span>
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();   <span class="tok-comment">// allow through</span>
}

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };</code></pre>
<p>The <code>matcher</code> limits which paths run the middleware — keep it tight so it does not run on every asset. It returns either <code>NextResponse.next()</code> (continue), a redirect, or a rewrite.</p>

<h3>It runs before every matched request — so keep it cheap</h3>
<p>Middleware runs before rendering, on every matched request. Up to Next.js 15 it ran on the lightweight Edge runtime by default; the Next.js 16 <code>proxy.ts</code> runs on Node.js (measured below: <code>nodejs 22.23.3</code>). Either way it must be <em>fast</em>: verifying a JWT <em>signature</em> is fine (it works on Edge too, measured), but database lookups — sessions, roles, ownership — belong near the data. Treat it as a coarse, cheap gate — "is there a token cookie at all?" — not a full auth check.</p>

<div class="pitfall">
<p><strong>Middleware alone is not authentication.</strong> A common and dangerous mistake is to protect pages <em>only</em> in middleware. Middleware can check "is a token present," but the real check — is the token valid, is this user allowed to see this data — must happen where the data is accessed: the Server Component, the Server Action, the Route Handler. Next's own guidance is to use middleware for optimistic redirects and do the authoritative check close to the data. Never let a pretty redirect stand in for server-side authorisation (the Chapter 12 rule again).</p>
</div>

<h3>What middleware is for, and what it is not</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It runs before the route, on every match</b> — Cheap redirects, locale detection, a rewrite. It sees the request and returns a response or lets it continue.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It runs on every match, before rendering</b> — Edge by default up to Next.js 15, Node.js for <code>proxy.ts</code> in 16. Either way: a signature check yes, a database round-trip per request no.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>So it can check a token&#39;s shape, not a session</b> — Verifying a signature is fine; looking a session id up in Postgres is not. That check belongs in the page.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Scope it with a matcher</b> — &#96;export const config = { matcher: [&#39;/dashboard/:path*&#39;] }&#96;. Without one it runs on every asset request too.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — treating middleware as the authorisation layer.</strong> A middleware redirect keeps honest users out of &#96;/admin&#96; and is not a security boundary: it cannot query the database, so it can only inspect what the request carries, and any gap in the matcher is an unprotected route. The failure is quiet — add a new admin path, forget the matcher entry, and it is public with nothing to show for it. Use middleware for the redirect, and repeat the real check where the data is read: in the layout or page that owns the segment, and inside every Server Action. Duplication is the point; each check protects its own entry point.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Middleware</span><span class="lc-sub">The matcher, the runtime limits, and the supported response types.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication#protecting-routes-with-middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Protecting routes</span><span class="lc-sub">The official position: middleware for optimistic checks, real checks near the data.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a <code>middleware.ts</code> that redirects unauthenticated users away from a <code>/dashboard</code> route.</li>
<li>Scope it with a <code>matcher</code> so it only runs on protected paths.</li>
<li>Note what middleware should NOT do (heavy work, DB calls) since it runs on every matched request at the edge.</li>
</ol>
<p><strong>Done when:</strong> you can gate routes with middleware and scope it with a matcher.</p></div>

<h3>🔬 Measured: what a proxy lets through, and how often it runs (Next.js 16.4.6 · next start · Chromium)</h3>
<p>The proxy above only asks "is there a <code>token</code> cookie?". The <code>/dashboard</code> page verifies the signature itself and redirects to <code>/login?from=page</code> if it fails.</p>
<div class="out">$ curl -si localhost:3000/dashboard                         # no cookie
HTTP/1.1 307 Temporary Redirect
location: /login
$ curl -si localhost:3000/dashboard -H 'Cookie: token=abc'  # any value
HTTP/1.1 307 Temporary Redirect
x-runtime: nodejs 22.23.3
location: /login?from=page
$ curl -si localhost:3000/dashboard -H "Cookie: token=$AN"   # a real token
HTTP/1.1 200
x-runtime: nodejs 22.23.3
$ curl -si localhost:3000/settings2                         # a page the matcher does not name
HTTP/1.1 200
API key: sk-live-4f9a…</div>
<p><code>token=abc</code> passed the proxy; only the page&#39;s own check stopped it. And <code>/settings2</code>, added after the matcher was written, is public — with no error and no warning.</p>
<p><strong>How often it runs — one Chromium load of a public page <code>/pub</code>:</strong></p>
<div class="out">with matcher: 0 lần proxy chạy
without matcher: 11 lần proxy chạy
1 GET /_next/static/chunks/092r-mewpaf3q.js
1 GET /_next/static/chunks/0i9bfanyibmja.js
1 GET /_next/static/chunks/0kqziy-7_gy73.js
1 GET /_next/static/chunks/395glp5--7qza.js
1 GET /_next/static/chunks/3qfy96eoyh-ek.js
1 GET /_next/static/chunks/3xofzmxl8husx.css
1 GET /_next/static/chunks/turbopack-2u1d16houkiyo.js
1 GET /_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2
1 GET /_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2
1 GET /next.svg</div>
<p><strong>Verifying on the Edge runtime — the old <code>middleware.ts</code> with <code>jose</code>:</strong></p>
<div class="out">$ curl -si localhost:3000/dashboard -H "Cookie: token=$AN"
HTTP/1.1 200 OK
x-check: edge | verified sub=1
$ curl -si localhost:3000/dashboard -H 'Cookie: token=abc'
HTTP/1.1 307 Temporary Redirect
x-check: edge | ERR_JWS_INVALID</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ ls src/middleware.ts src/proxy.ts 2&gt;&amp;1 | sed 's/^ls: //'
src/proxy.ts: No such file or directory
src/middleware.ts
$ grep -n "We can't verify the JWT signature\\|no \\&#96;jsonwebtoken\\&#96;/\\&#96;jose\\&#96;" src/middleware.ts
9: *   cookie during login. We can't verify the JWT signature in Edge
10: *   runtime (no &#96;jsonwebtoken&#96;/&#96;jose&#96; available without a custom build),
$ grep -n '"jose"' package.json
71:    "jose": "^6.2.3",
$ grep -n "if (adminRole === '1')" -A2 src/middleware.ts
131:  if (adminRole === '1') {
132-    return NextResponse.next();
133-  }
$ sed -n '/^export const config/,/^};/p' src/middleware.ts | grep -oE "'/[^']*'" | wc -l | sed 's/^ */mục trong matcher: /'
mục trong matcher: 17</div>cuongthai.com runs a Next.js 14 Edge middleware with 17 matcher entries. Its comment says the JWT cannot be verified on Edge because <code>jose</code> is unavailable, so <code>/admin</code> passes on <code>admin_role=1</code>; yet <code>jose</code> is already a dependency and verifies on Edge (measured above). It is still safe by design: the admin data comes from the backend, which verifies <code>backend_token</code> on every call — the two-gate pattern of this lesson.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># src/proxy.ts as above, plus a /dashboard page that calls verifyJwt itself</span>
npm run build &amp;&amp; npm start
curl -si localhost:3000/dashboard | grep -iE '^HTTP|^location'
curl -si localhost:3000/dashboard -H 'Cookie: token=abc' | grep -iE '^HTTP|^location' <span class="tok-comment">  # passes the proxy, stopped by the page</span>
<span class="tok-comment"># log each call in proxy(); load one page with and without config.matcher and count</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-0-0-bat-dau-2" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · Start here (2/2) — a real middleware bypass</span><span class="lc-sub">CVE-2025-29927</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-5-bao-mat-action" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.5 — An action is a public endpoint</span><span class="lc-sub">Why the check is repeated inside every action</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-3-requireauth-phan-quyen" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 8.3 — requireAuth and authorisation</span><span class="lc-sub">The same gate as Express middleware</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-1-giai-ma-bang-tay" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.1 — Decode one by hand</span><span class="lc-sub">What a signature check actually checks</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Middleware</span><span class="v">Code that runs before a request reaches a route.</span></div>
  <div class="kv"><span class="k">matcher</span><span class="v">Config that limits which paths middleware runs on.</span></div>
  <div class="kv"><span class="k">Redirect/rewrite</span><span class="v">Send the user elsewhere or serve a different path.</span></div>
  <div class="kv"><span class="k">Edge runtime</span><span class="v">Middleware runs at the edge — keep it light and fast.</span></div>
  <div class="kv"><span class="k">Route gate</span><span class="v">Block or allow a request based on auth.</span></div>
  <div class="kv"><span class="k">Not for heavy work</span><span class="v">No slow DB calls; do a quick token check only.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Middleware runs before a request reaches a route — the place to gate protected pages.</li><li>Scope it with a <code>matcher</code> so it only runs on the paths that need it.</li><li>It can redirect or rewrite based on a quick auth check.</li><li>Keep it light: it runs at the edge on every matched request, so no heavy DB work.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Middleware</span><span class="lc-sub">matcher, NextResponse, the edge runtime, and its limits.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Code chạy trước khi request tới route của bạn</h2>
<p class="lead">Một file <code>middleware.ts</code> duy nhất ở gốc dự án chạy trên các request khớp <em>trước</em> khi chúng tới một page hay handler. Đó là chỗ cho việc gác-cổng xuyên suốt: chuyển hướng người chưa đăng nhập, viết lại URL, đặt header, xử lý ngôn ngữ.</p>
<div class="callout warn"><strong>Đo trên Next.js 16.4.6: tệp giờ tên là <code>proxy.ts</code>.</strong> Đoạn mã bên dưới chép nguyên thì không qua bước kiểm kiểu; thêm kiểu rồi build thì vẫn chạy, nhưng build cảnh báo:<div class="out">middleware.ts(3,28): error TS7006: Parameter 'request' implicitly has an 'any' type.
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.</div>Ở Next.js 16 đổi tên tệp thành <code>proxy.ts</code> (cạnh <code>app/</code>, tức trong <code>src/</code> nếu bạn dùng) và đổi tên hàm thành <code>proxy</code>:<pre><code class="language-typescript"><span class="tok-comment">// src/proxy.ts  (Next.js 16 — was middleware.ts)</span>
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next(); <span class="tok-comment">  // allow through</span>
}

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };</code></pre></div>

<pre><code class="language-javascript"><span class="tok-comment">// middleware.ts (gốc dự án)</span>
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();   <span class="tok-comment">// cho đi tiếp</span>
}

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };</code></pre>
<p><code>matcher</code> giới hạn đường dẫn nào chạy middleware — giữ nó chặt để nó không chạy trên mọi asset. Nó trả về hoặc <code>NextResponse.next()</code> (tiếp tục), một redirect, hoặc một rewrite.</p>

<h3>Nó chạy trước mọi request khớp — nên giữ cho rẻ</h3>
<p>Middleware chạy trước render, trên mọi request khớp. Tới Next.js 15 nó mặc định chạy trên runtime Edge nhẹ; <code>proxy.ts</code> của Next.js 16 chạy trên Node.js (đo bên dưới: <code>nodejs 22.23.3</code>). Dù thế nào nó cũng phải <em>nhanh</em>: kiểm <em>chữ ký</em> JWT thì được (chạy cả trên Edge, đã đo), còn tra cứu cơ sở dữ liệu — phiên, vai trò, quyền sở hữu — thuộc về chỗ gần dữ liệu. Coi nó như một cổng thô, rẻ — "có cookie token nào không?" — không phải một phép kiểm auth đầy đủ.</p>

<div class="pitfall">
<p><strong>Chỉ middleware thì chưa phải xác thực.</strong> Một sai lầm phổ biến và nguy hiểm là bảo vệ trang <em>chỉ</em> trong middleware. Middleware kiểm được "có token hiện diện không", nhưng phép kiểm thật — token có hợp lệ không, người này có được phép xem dữ liệu này không — phải xảy ra nơi dữ liệu được truy cập: Server Component, Server Action, Route Handler. Chính hướng dẫn của Next là dùng middleware cho redirect lạc quan và làm phép kiểm có thẩm quyền gần dữ liệu. Đừng bao giờ để một redirect đẹp thay cho phân quyền phía server (lại là quy tắc Chương 12).</p>
</div>

<h3>Middleware dùng để làm gì, và không dùng để làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó chạy trước route, ở mọi lần khớp</b> — Chuyển hướng rẻ tiền, nhận diện ngôn ngữ, một phép viết lại đường dẫn. Nó thấy request rồi trả về một phản hồi hoặc cho đi tiếp.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó chạy ở mọi lần khớp, trước render</b> — mặc định Edge tới Next.js 15, Node.js với <code>proxy.ts</code> của bản 16. Dù thế nào: kiểm chữ ký thì có, một chuyến tới cơ sở dữ liệu mỗi request thì không.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nên nó kiểm được HÌNH DẠNG một token, không kiểm được một phiên</b> — Xác minh một chữ ký thì được; tra một id phiên trong Postgres thì không. Phép kiểm đó thuộc về trang.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Hãy giới hạn nó bằng matcher</b> — &#96;export const config = { matcher: [&#39;/dashboard/:path*&#39;] }&#96;. Không có nó thì nó chạy cả với mọi request tài nguyên tĩnh.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — coi middleware là tầng phân quyền.</strong> Một phép chuyển hướng ở middleware giữ được người dùng ngay thẳng ở ngoài &#96;/admin&#96; và không phải một biên an toàn: nó không truy vấn cơ sở dữ liệu được, nên nó chỉ soi được thứ mà request mang theo, và mọi khe hở trong matcher đều là một route không được bảo vệ. Cú hỏng thì lặng lẽ — thêm một đường quản trị mới, quên mục trong matcher, thế là nó công khai mà chẳng có gì cho thấy. Hãy dùng middleware cho phép chuyển hướng, và lặp lại phép kiểm thật ở chỗ dữ liệu được đọc: trong layout hoặc page sở hữu đoạn đó, và bên trong mọi Server Action. Sự trùng lặp ấy chính là mục đích; mỗi phép kiểm bảo vệ đúng cửa vào của mình.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Middleware</span><span class="lc-sub">Matcher, giới hạn của runtime, và các kiểu phản hồi được hỗ trợ.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication#protecting-routes-with-middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Bảo vệ route</span><span class="lc-sub">Lập trường chính thức: middleware cho phép kiểm lạc quan, phép kiểm thật đặt sát dữ liệu.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một <code>middleware.ts</code> chuyển hướng người dùng chưa xác thực khỏi một route <code>/dashboard</code>.</li>
<li>Giới hạn nó bằng một <code>matcher</code> để chỉ chạy trên các path được bảo vệ.</li>
<li>Để ý middleware KHÔNG nên làm gì (việc nặng, gọi DB) vì nó chạy mỗi request khớp ở edge.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chặn được route bằng middleware và giới hạn nó bằng matcher.</p></div>

<h3>🔬 Đo thật: proxy cho lọt gì, và chạy bao nhiêu lần (Next.js 16.4.6 · next start · Chromium)</h3>
<p>Proxy ở trên chỉ hỏi "có cookie <code>token</code> không?". Trang <code>/dashboard</code> tự kiểm chữ ký và chuyển về <code>/login?from=page</code> nếu sai.</p>
<div class="out">$ curl -si localhost:3000/dashboard                         # không cookie
HTTP/1.1 307 Temporary Redirect
location: /login
$ curl -si localhost:3000/dashboard -H 'Cookie: token=abc'  # giá trị bất kỳ
HTTP/1.1 307 Temporary Redirect
x-runtime: nodejs 22.23.3
location: /login?from=page
$ curl -si localhost:3000/dashboard -H "Cookie: token=$AN"   # token thật
HTTP/1.1 200
x-runtime: nodejs 22.23.3
$ curl -si localhost:3000/settings2                         # trang matcher không nhắc tới
HTTP/1.1 200
API key: sk-live-4f9a…</div>
<p><code>token=abc</code> lọt qua proxy; chỉ phép kiểm của chính trang chặn được nó. Còn <code>/settings2</code>, thêm sau khi viết matcher, là trang công khai — không lỗi, không cảnh báo.</p>
<p><strong>Nó chạy bao nhiêu lần — Chromium tải một trang công khai <code>/pub</code> đúng một lần:</strong></p>
<div class="out">có matcher: 0 lần proxy chạy
không matcher: 11 lần proxy chạy
1 GET /_next/static/chunks/092r-mewpaf3q.js
1 GET /_next/static/chunks/0i9bfanyibmja.js
1 GET /_next/static/chunks/0kqziy-7_gy73.js
1 GET /_next/static/chunks/395glp5--7qza.js
1 GET /_next/static/chunks/3qfy96eoyh-ek.js
1 GET /_next/static/chunks/3xofzmxl8husx.css
1 GET /_next/static/chunks/turbopack-2u1d16houkiyo.js
1 GET /_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2
1 GET /_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2
1 GET /next.svg</div>
<p><strong>Kiểm trên runtime Edge — <code>middleware.ts</code> kiểu cũ với <code>jose</code>:</strong></p>
<div class="out">$ curl -si localhost:3000/dashboard -H "Cookie: token=$AN"
HTTP/1.1 200 OK
x-check: edge | verified sub=1
$ curl -si localhost:3000/dashboard -H 'Cookie: token=abc'
HTTP/1.1 307 Temporary Redirect
x-check: edge | ERR_JWS_INVALID</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ ls src/middleware.ts src/proxy.ts 2&gt;&amp;1 | sed 's/^ls: //'
src/proxy.ts: No such file or directory
src/middleware.ts
$ grep -n "We can't verify the JWT signature\\|no \\&#96;jsonwebtoken\\&#96;/\\&#96;jose\\&#96;" src/middleware.ts
9: *   cookie during login. We can't verify the JWT signature in Edge
10: *   runtime (no &#96;jsonwebtoken&#96;/&#96;jose&#96; available without a custom build),
$ grep -n '"jose"' package.json
71:    "jose": "^6.2.3",
$ grep -n "if (adminRole === '1')" -A2 src/middleware.ts
131:  if (adminRole === '1') {
132-    return NextResponse.next();
133-  }
$ sed -n '/^export const config/,/^};/p' src/middleware.ts | grep -oE "'/[^']*'" | wc -l | sed 's/^ */mục trong matcher: /'
mục trong matcher: 17</div>cuongthai.com chạy middleware Edge của Next.js 14 với 17 mục matcher. Chú thích ghi không verify được JWT trên Edge vì không có <code>jose</code>, nên <code>/admin</code> cho qua khi <code>admin_role=1</code>; trong khi <code>jose</code> đã là phụ thuộc của dự án và verify được trên Edge (đo ở trên). Thiết kế vẫn an toàn: dữ liệu admin đến từ backend, nơi kiểm <code>backend_token</code> ở mọi lời gọi — đúng mô hình hai cổng của bài.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># src/proxy.ts as above, plus a /dashboard page that calls verifyJwt itself</span>
npm run build &amp;&amp; npm start
curl -si localhost:3000/dashboard | grep -iE '^HTTP|^location'
curl -si localhost:3000/dashboard -H 'Cookie: token=abc' | grep -iE '^HTTP|^location' <span class="tok-comment">  # lọt proxy, bị trang chặn</span>
<span class="tok-comment"># ghi log mỗi lần proxy() chạy; tải một trang khi có và không có config.matcher rồi đếm</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-0-0-bat-dau-2" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · Bắt đầu tại đây (2/2) — một lỗ vượt middleware có thật</span><span class="lc-sub">CVE-2025-29927</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-5-bao-mat-action" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.5 — Một action là endpoint công khai</span><span class="lc-sub">Vì sao phép kiểm phải lặp lại trong mọi action</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-3-requireauth-phan-quyen" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 8.3 — requireAuth và phân quyền</span><span class="lc-sub">Cùng cái cổng đó, dạng middleware Express</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-1-giai-ma-bang-tay" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">Authentication · 4.1 — Tự tay giải mã một cái</span><span class="lc-sub">Phép kiểm chữ ký thật ra kiểm gì</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Middleware</span><span class="v">Mã chạy trước khi một request tới một route.</span></div>
  <div class="kv"><span class="k">matcher</span><span class="v">Cấu hình giới hạn middleware chạy trên path nào.</span></div>
  <div class="kv"><span class="k">Redirect/rewrite</span><span class="v">Gửi người dùng đi nơi khác hoặc phục vụ một path khác.</span></div>
  <div class="kv"><span class="k">Edge runtime</span><span class="v">Middleware chạy ở edge — giữ nó nhẹ và nhanh.</span></div>
  <div class="kv"><span class="k">Cổng route</span><span class="v">Chặn hoặc cho một request dựa trên auth.</span></div>
  <div class="kv"><span class="k">Không cho việc nặng</span><span class="v">Không gọi DB chậm; chỉ kiểm token nhanh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Middleware chạy trước khi một request tới một route — chỗ để chặn các trang được bảo vệ.</li><li>Giới hạn nó bằng một <code>matcher</code> để chỉ chạy trên các path cần.</li><li>Nó redirect hoặc rewrite dựa trên một kiểm tra auth nhanh.</li><li>Giữ nó nhẹ: nó chạy ở edge mỗi request khớp, nên không làm việc DB nặng.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/middleware" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Middleware</span><span class="lc-sub">matcher, NextResponse, runtime edge, và giới hạn của nó.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: '15.4 — Reading the current user on the server|||15.4 — Đọc người dùng hiện tại trên server',
      slug: 'nextjs-15-4-doc-nguoi-dung',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một hàm getCurrentUser() đọc cookie, xác minh token, trả về người dùng — dùng trong Server Component để render theo người dùng, và trong Server Action/Route Handler để phân quyền. Kiểm auth nằm ở SERVER.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>One helper to get the user, used everywhere on the server</h2>
<p class="lead">The authoritative auth check belongs on the server, close to the data (lesson 15.3). The clean way is a single helper that reads the cookie, verifies the token, and returns the user — then call it wherever you need to know who is asking.</p>

<pre><code class="language-javascript"><span class="tok-comment">// lib/auth.ts</span>
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  const payload = verifyJwt(token);          <span class="tok-comment">// verify signature + expiry</span>
  if (!payload) return null;
  return db.user.findUnique({ where: { id: payload.sub } });
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">In a Server Component</span><span class="v">Render based on the user: show their name, or redirect to /login if <code>null</code>. The page itself enforces access.</span></div>
  <div class="kv"><span class="k">In a Server Action</span><span class="v">Authorise the mutation — the Chapter 12 pattern: <code>if (!user) throw</code>, then check ownership.</span></div>
  <div class="kv"><span class="k">In a Route Handler</span><span class="v">Guard the endpoint the same way before doing any work.</span></div>
</div>

<h3>Verify, do not just read</h3>
<p>Reading the cookie is not enough — a cookie can be forged. The helper must <em>verify</em> the JWT's signature (and its expiry) with your secret before trusting the payload. Only a token your server signed will verify; a tampered one is rejected. This verification is exactly the step that a bare middleware presence-check skips, and why the real check lives here.</p>

<div class="callout ok">
<p><strong>One source of truth for "who is the user."</strong> Centralising this in <code>getCurrentUser()</code> means every page and action checks identity the same way, and a change to how sessions work touches one function. Scatter the cookie-reading logic and you will eventually protect one route and forget another.</p>
</div>

<h3>Getting the current user where you need it</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Read the session on the server</b> — In a layout, a page, or a Server Action. One helper — &#96;getSession()&#96; — that reads the cookie and verifies it.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Do not pass the user id as a prop to actions</b> — The action reads it itself. A prop is caller-controlled; a session read is not.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Fetch once per request, not per component</b> — React&#39;s &#96;cache()&#96; deduplicates the call across a render pass, so calling &#96;getSession()&#96; in five components is one verification.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Send the client only what it displays</b> — A name and an avatar, not the whole record. Everything crossing the boundary is visible to the user.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a user object built once at module level, shared between every request.</strong> &#96;const currentUser = await getUser()&#96; at the top of a module runs once when the server starts and then serves that same user to everybody — every visitor sees the first person&#39;s name, and in the worst case their data. It looks like a caching bug and it is a lifetime bug: module scope on a server is process-wide, not per-request. The same shape appears with a module-level Zustand store, a shared Axios instance carrying an auth header, or a &#96;let&#96; used as a cache. Anything per-user must be read inside the request, every time.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/cache" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — cache()</span><span class="lc-sub">Deduplicating a server call within one render pass, without leaking across requests.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication#stateless-sessions" target="_blank" rel="noopener">
  <span class="lc-ico">🎫</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Sessions</span><span class="lc-sub">Reading and verifying a session on each request, with the helper pattern.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write a server helper <code>getCurrentUser()</code> that reads the session cookie and returns the user (or null).</li>
<li>Use it in a Server Component to render user-specific UI, and call <code>redirect('/login')</code> when null.</li>
<li>Confirm this check runs on the server, so it cannot be bypassed from the client.</li>
</ol>
<p><strong>Done when:</strong> you can read the current user on the server and protect a page with it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">getCurrentUser</span><span class="v">A server helper that resolves the user from the session cookie.</span></div>
  <div class="kv"><span class="k">Server check</span><span class="v">Auth decisions made on the server cannot be bypassed by the client.</span></div>
  <div class="kv"><span class="k">redirect()</span><span class="v">Send an unauthenticated user to <code>/login</code>.</span></div>
  <div class="kv"><span class="k">Session read</span><span class="v">Decode/verify the cookie to find the user.</span></div>
  <div class="kv"><span class="k">Protected page</span><span class="v">A Server Component that requires a user.</span></div>
  <div class="kv"><span class="k">Single helper</span><span class="v">Centralise the read so every page checks the same way.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Read the current user on the server from the session cookie, in a single <code>getCurrentUser()</code> helper.</li><li>Use it in Server Components to render user-specific UI and to <code>redirect()</code> when there is no user.</li><li>Because the check runs on the server, it cannot be bypassed from the client.</li><li>Centralising the read keeps every page's auth check consistent.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication#authorization" target="_blank" rel="noopener">
  <span class="lc-ico">👤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Authorization &amp; sessions</span><span class="lc-sub">Verifying sessions and gating data access on the server.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Một helper lấy người dùng, dùng khắp nơi trên server</h2>
<p class="lead">Phép kiểm auth có thẩm quyền thuộc về server, gần dữ liệu (bài 15.3). Cách gọn là một helper duy nhất đọc cookie, xác minh token, và trả về người dùng — rồi gọi nó ở bất cứ đâu bạn cần biết ai đang hỏi.</p>

<pre><code class="language-javascript"><span class="tok-comment">// lib/auth.ts</span>
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  const payload = verifyJwt(token);          <span class="tok-comment">// xác minh chữ ký + hạn</span>
  if (!payload) return null;
  return db.user.findUnique({ where: { id: payload.sub } });
}</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Trong Server Component</span><span class="v">Render theo người dùng: hiện tên họ, hoặc redirect tới /login nếu <code>null</code>. Chính trang thực thi quyền truy cập.</span></div>
  <div class="kv"><span class="k">Trong Server Action</span><span class="v">Phân quyền cho mutation — mẫu Chương 12: <code>if (!user) throw</code>, rồi kiểm quyền sở hữu.</span></div>
  <div class="kv"><span class="k">Trong Route Handler</span><span class="v">Gác endpoint theo cùng cách trước khi làm bất cứ việc gì.</span></div>
</div>

<h3>Xác minh, đừng chỉ đọc</h3>
<p>Đọc cookie là chưa đủ — một cookie có thể bị giả. Helper phải <em>xác minh</em> chữ ký của JWT (và hạn của nó) bằng secret của bạn trước khi tin payload. Chỉ token mà server bạn đã ký mới xác minh được; một cái bị chỉnh sửa sẽ bị từ chối. Chính bước xác minh này là thứ một phép kiểm-hiện-diện middleware trần bỏ qua, và là lý do phép kiểm thật nằm ở đây.</p>

<div class="callout ok">
<p><strong>Một nguồn sự thật cho "ai là người dùng".</strong> Gom việc này vào <code>getCurrentUser()</code> nghĩa là mọi page và action kiểm danh tính theo cùng một cách, và một thay đổi cách phiên hoạt động chỉ đụng một hàm. Rải logic đọc-cookie ra thì sớm muộn bạn sẽ bảo vệ một route và quên một route khác.</p>
</div>

<h3>Lấy người dùng hiện tại ở nơi bạn cần</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Đọc phiên đăng nhập ở máy chủ</b> — Trong một layout, một page, hoặc một Server Action. Một hàm phụ duy nhất — &#96;getSession()&#96; — đọc cookie rồi xác minh nó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đừng truyền id người dùng làm prop cho action</b> — Action tự đọc lấy. Một prop thì do người gọi điều khiển; một lần đọc phiên thì không.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Lấy một lần mỗi request, đừng lấy mỗi component</b> — &#96;cache()&#96; của React khử trùng lặp lời gọi trong một lượt render, nên gọi &#96;getSession()&#96; ở năm component chỉ là một lần xác minh.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Chỉ gửi cho client thứ nó hiển thị</b> — Một cái tên và một tấm ảnh đại diện, không phải cả bản ghi. Mọi thứ vượt qua ranh giới đều nhìn thấy được với người dùng.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một object người dùng dựng một lần ở cấp module, dùng chung giữa mọi request.</strong> &#96;const currentUser = await getUser()&#96; ở đầu một module sẽ chạy đúng một lần lúc máy chủ khởi động rồi phục vụ đúng người dùng đó cho tất cả — mọi khách đều thấy tên của người đầu tiên, và tệ nhất là thấy cả dữ liệu của họ. Nó trông như lỗi nhớ đệm mà thật ra là lỗi vòng đời: phạm vi module trên một máy chủ là phạm vi toàn tiến trình, không phải theo từng request. Cùng hình dạng ấy hiện ra với một store Zustand ở cấp module, một thực thể Axios dùng chung mang header xác thực, hay một &#96;let&#96; dùng làm bộ nhớ đệm. Mọi thứ riêng theo người dùng đều phải được đọc BÊN TRONG request, mọi lần.</p></div>
<a class="link-card dl" href="https://react.dev/reference/react/cache" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">react.dev — cache()</span><span class="lc-sub">Khử trùng lặp một lời gọi máy chủ trong một lượt render, mà không rò rỉ qua các request.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication#stateless-sessions" target="_blank" rel="noopener">
  <span class="lc-ico">🎫</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Phiên đăng nhập</span><span class="lc-sub">Đọc và xác minh một phiên ở mỗi request, kèm mẫu hàm phụ.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một helper server <code>getCurrentUser()</code> đọc cookie session và trả về người dùng (hoặc null).</li>
<li>Dùng nó trong một Server Component để render UI riêng người dùng, và gọi <code>redirect('/login')</code> khi null.</li>
<li>Xác nhận kiểm tra này chạy trên server, nên không bị bỏ qua từ client.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đọc được người dùng hiện tại trên server và bảo vệ một trang bằng nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">getCurrentUser</span><span class="v">Một helper server giải ra người dùng từ cookie session.</span></div>
  <div class="kv"><span class="k">Kiểm trên server</span><span class="v">Quyết định auth trên server không bị client bỏ qua.</span></div>
  <div class="kv"><span class="k">redirect()</span><span class="v">Gửi người dùng chưa xác thực tới <code>/login</code>.</span></div>
  <div class="kv"><span class="k">Đọc session</span><span class="v">Giải mã/xác minh cookie để tìm người dùng.</span></div>
  <div class="kv"><span class="k">Trang được bảo vệ</span><span class="v">Một Server Component yêu cầu có người dùng.</span></div>
  <div class="kv"><span class="k">Một helper</span><span class="v">Gom việc đọc để mọi trang kiểm cùng một cách.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đọc người dùng hiện tại trên server từ cookie session, trong một helper <code>getCurrentUser()</code> duy nhất.</li><li>Dùng nó trong Server Components để render UI riêng người dùng và <code>redirect()</code> khi không có người dùng.</li><li>Vì kiểm tra chạy trên server, nó không bị bỏ qua từ client.</li><li>Gom việc đọc giữ kiểm tra auth của mọi trang nhất quán.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/authentication#authorization" target="_blank" rel="noopener">
  <span class="lc-ico">👤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Authorization &amp; session</span><span class="lc-sub">Xác minh phiên và gác truy cập dữ liệu trên server.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.5 ─────────────────────────── */
    {
      title: '15.5 — Token expiry and refresh (a real outage)|||15.5 — Hết hạn token và refresh (một sự cố thật)',
      slug: 'nextjs-15-5-refresh-token',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Token hết hạn ngắn để giảm rủi ro, nhưng nếu không có cơ chế refresh thì phiên chết đột ngột giữa chừng. Sự cố thật cuongthai.com: JWT 24h nhưng cookie 7d, không có /auth/refresh → mọi call 401. Cách vá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.5</span>
<h2>A short-lived token is safer — until it expires with no way to renew</h2>
<p class="lead">Tokens are given a short expiry on purpose: if one leaks, it is useless soon. But a short expiry needs a partner — a way to <em>refresh</em> the session quietly before the user is kicked out. Miss that partner and sessions die mid-use, seemingly at random.</p>

<div class="note-ct">
<p><strong>Exactly this happened on cuongthai.com.</strong> The JWT was configured to expire in <strong>24 hours</strong>, but the cookie holding it was set to live <strong>7 days</strong> — and there was <em>no working refresh endpoint</em> (a frontend proxy pointed at a backend route that did not exist). So the cookie was still present, the user looked logged in, but after 24 hours every authenticated call returned 401: the token inside the still-present cookie had expired with nothing to renew it. Sessions "died silently" a day in — GIF picker dead, messenger 401 — with the cookie right there, which is why it was so confusing.</p>
</div>

<h3>The two-part fix</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>A refresh endpoint.</b> <code>POST /auth/refresh</code> verifies the token allowing expiry, re-checks the account is still valid, and issues a fresh token — extending the session without a re-login.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>A 401 interceptor on the client.</b> When any authenticated request returns 401, the axios interceptor calls refresh <em>once</em>, then retries the original request. If refresh also fails, then send the user to login.</div></div>
</div>
<p>With both in place the session self-heals: an expired token triggers a silent refresh-and-retry, and the user never notices. No env change was needed — the missing piece was the refresh route and the retry, not a longer expiry.</p>

<div class="pitfall">
<p><strong>The tell of this bug class:</strong> "I am clearly logged in (the cookie is there, I did not log out), but everything 401s." Suspect a token that has expired while its cookie has not, plus a missing or broken refresh path. Cookie lifetime and token expiry are two different clocks — if they disagree and nothing refreshes, the session breaks exactly when the shorter one runs out.</p>
</div>

<h3>Keeping a session alive without keeping it forever</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Short access token, long refresh token</b> — Minutes and days. The short one limits the damage of a leak; the long one keeps the user logged in.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Refresh on 401, once</b> — An interceptor catches the expiry, refreshes, and retries the original request. Once — a loop here logs everyone out.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Rotate the refresh token</b> — Issue a new one each time and invalidate the old. A replayed old token then signals theft, and you can revoke the family.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Store both httpOnly</b> — Neither belongs in &#96;localStorage&#96;, where any script on the page can read it.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a token that expires long before the cookie carrying it.</strong> A 24-hour JWT inside a 7-day cookie means that from day two the browser keeps sending a cookie that is present and worthless: the app looks logged in, every API call returns 401, and the user reports &quot;the site is broken&quot; rather than &quot;log me in again&quot;. This is not hypothetical — it is recorded in this repo&#39;s own history, together with the second half of the failure: there was no working refresh endpoint, so nothing could recover. Keep the two lifetimes in one place, implement refresh before extending either, and test by moving the clock forward rather than by waiting a day.</p></div>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🎟️</span>
  <span class="lc-body"><span class="lc-title">OWASP — JWT cheat sheet</span><span class="lc-sub">Expiry, revocation and rotation, with the attacks each one answers.</span></span>
</a>
<a class="link-card dl" href="https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">Auth0 — Refresh token rotation</span><span class="lc-sub">Why rotation plus reuse detection is the standard, explained end to end.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Make an access token expire quickly and confirm protected calls start returning 401.</li>
<li>Add a refresh flow: on 401, call a refresh endpoint once and retry the original request.</li>
<li>Reproduce the real cuongthai.com bug — a token that expired with no working refresh route — and fix it so sessions self-heal.</li>
</ol>
<p><strong>Done when:</strong> you can diagnose a silent session-death bug and add a refresh-and-retry flow.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access token</span><span class="v">Short-lived token sent on each request.</span></div>
  <div class="kv"><span class="k">Refresh token</span><span class="v">Longer-lived credential used to get a new access token.</span></div>
  <div class="kv"><span class="k">401 Unauthorized</span><span class="v">The response when a token is missing or expired.</span></div>
  <div class="kv"><span class="k">Refresh flow</span><span class="v">On 401, refresh once and retry the original request.</span></div>
  <div class="kv"><span class="k">Silent session death</span><span class="v">Sessions dying with no visible error when refresh is missing.</span></div>
  <div class="kv"><span class="k">Self-healing</span><span class="v">A working refresh path makes expiry invisible to the user.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Access tokens are short-lived; a refresh token swaps an expired one for a new access token.</li><li>On a 401, refresh once and retry the original request so the session self-heals.</li><li>cuongthai.com once had tokens expire with no working refresh route — every authed call 401'd silently.</li><li>A correct refresh-and-retry interceptor makes token expiry invisible to users.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">MDN — HTTP Cookies</span><span class="lc-sub">Cookie lifetime and attributes — distinct from what a token inside it says.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.5</span>
<h2>Token hạn ngắn thì an toàn hơn — cho tới khi nó hết hạn mà không cách nào gia hạn</h2>
<p class="lead">Token được đặt hạn ngắn có chủ đích: nếu một cái rò rỉ, nó sớm vô dụng. Nhưng hạn ngắn cần một người bạn đồng hành — một cách <em>refresh</em> phiên âm thầm trước khi người dùng bị đá ra. Thiếu người bạn đó thì phiên chết giữa chừng, tưởng như ngẫu nhiên.</p>

<div class="note-ct">
<p><strong>Đúng điều này xảy ra trên cuongthai.com.</strong> JWT được cấu hình hết hạn sau <strong>24 giờ</strong>, nhưng cookie giữ nó lại đặt sống <strong>7 ngày</strong> — và <em>không có endpoint refresh chạy được</em> (một proxy frontend trỏ tới một route backend không tồn tại). Nên cookie vẫn còn, người dùng trông như đã đăng nhập, nhưng sau 24 giờ mọi call authed trả 401: token bên trong cookie-vẫn-còn đã hết hạn mà không có gì gia hạn. Phiên "chết âm thầm" sau một ngày — GIF picker chết, messenger 401 — với cookie ngay đó, nên nó cực kỳ khó hiểu.</p>
</div>

<h3>Cách vá hai phần</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Một endpoint refresh.</b> <code>POST /auth/refresh</code> xác minh token cho phép đã hết hạn, kiểm lại tài khoản còn hợp lệ, và cấp một token mới — kéo dài phiên mà không cần đăng nhập lại.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Một interceptor 401 ở client.</b> Khi bất kỳ request authed nào trả 401, interceptor axios gọi refresh <em>một lần</em>, rồi thử lại request gốc. Nếu refresh cũng thất bại, mới đưa người dùng tới login.</div></div>
</div>
<p>Có cả hai thì phiên tự lành: một token hết hạn kích hoạt một refresh-rồi-retry âm thầm, và người dùng không hề nhận ra. Không cần đổi env — mảnh thiếu là route refresh và cú retry, không phải một hạn dài hơn.</p>

<div class="pitfall">
<p><strong>Dấu hiệu của loại bug này:</strong> "Tôi rõ ràng đã đăng nhập (cookie còn đó, tôi không đăng xuất), nhưng mọi thứ 401." Hãy nghi một token đã hết hạn trong khi cookie thì chưa, cộng một đường refresh thiếu hoặc hỏng. Tuổi thọ cookie và hạn token là hai chiếc đồng hồ khác nhau — nếu chúng lệch nhau và không gì refresh, phiên vỡ đúng lúc cái ngắn hơn hết giờ.</p>
</div>

<h3>Giữ một phiên sống mà không giữ nó mãi mãi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Token truy cập ngắn, token làm mới dài</b> — Vài phút và vài ngày. Cái ngắn giới hạn thiệt hại khi rò rỉ; cái dài giữ cho người dùng ở lại trạng thái đăng nhập.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Làm mới khi gặp 401, đúng một lần</b> — Một interceptor bắt lấy cú hết hạn, làm mới, rồi thử lại request gốc. Đúng một lần — một vòng lặp ở đây là đăng xuất tất cả mọi người.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Xoay vòng token làm mới</b> — Cấp một cái mới mỗi lần và vô hiệu hoá cái cũ. Một token cũ được phát lại khi đó là tín hiệu bị trộm, và bạn thu hồi được cả họ token đó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Lưu cả hai dạng httpOnly</b> — Chẳng cái nào thuộc về &#96;localStorage&#96;, nơi mọi script trên trang đều đọc được.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một token hết hạn sớm hơn nhiều so với cái cookie mang nó.</strong> Một JWT 24 giờ nằm trong một cookie 7 ngày nghĩa là từ ngày thứ hai trình duyệt cứ gửi đi một cái cookie có mặt mà vô giá trị: ứng dụng trông như đã đăng nhập, mọi lời gọi API trả 401, và người dùng báo &quot;trang hỏng rồi&quot; chứ không phải &quot;cho tôi đăng nhập lại&quot;. Đây không phải chuyện giả định — nó có trong lịch sử của chính kho này, cùng với nửa sau của cú hỏng: chẳng có endpoint làm mới nào chạy được, nên không gì khôi phục nổi. Hãy giữ hai tuổi thọ đó ở một chỗ, làm phần làm-mới trước khi kéo dài bất kỳ cái nào, và hãy thử bằng cách dịch đồng hồ tới trước chứ đừng ngồi chờ một ngày.</p></div>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🎟️</span>
  <span class="lc-body"><span class="lc-title">OWASP — Bản tra cứu JWT</span><span class="lc-sub">Hết hạn, thu hồi và xoay vòng, kèm những cuộc tấn công mà từng cái trả lời.</span></span>
</a>
<a class="link-card dl" href="https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">Auth0 — Xoay vòng token làm mới</span><span class="lc-sub">Vì sao xoay vòng cộng phát hiện tái sử dụng là chuẩn, giải thích từ đầu tới cuối.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Làm một access token hết hạn nhanh và xác nhận các lời gọi được bảo vệ bắt đầu trả 401.</li>
<li>Thêm một luồng refresh: khi gặp 401, gọi một endpoint refresh một lần và thử lại request gốc.</li>
<li>Tái hiện bug thật của cuongthai.com — một token hết hạn mà không có route refresh chạy được — và sửa để session tự lành.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chẩn được một bug session chết âm thầm và thêm một luồng refresh-rồi-thử-lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Access token</span><span class="v">Token sống ngắn gửi mỗi request.</span></div>
  <div class="kv"><span class="k">Refresh token</span><span class="v">Credential sống dài hơn dùng để lấy access token mới.</span></div>
  <div class="kv"><span class="k">401 Unauthorized</span><span class="v">Response khi token thiếu hoặc hết hạn.</span></div>
  <div class="kv"><span class="k">Luồng refresh</span><span class="v">Khi 401, refresh một lần và thử lại request gốc.</span></div>
  <div class="kv"><span class="k">Session chết âm thầm</span><span class="v">Session chết mà không lỗi thấy được khi thiếu refresh.</span></div>
  <div class="kv"><span class="k">Tự lành</span><span class="v">Một đường refresh chạy được làm việc hết hạn vô hình với người dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Access token sống ngắn; một refresh token đổi một cái hết hạn lấy access token mới.</li><li>Khi gặp 401, refresh một lần và thử lại request gốc để session tự lành.</li><li>cuongthai.com từng để token hết hạn mà không có route refresh chạy được — mọi lời gọi có auth 401 âm thầm.</li><li>Một interceptor refresh-rồi-thử-lại đúng làm việc token hết hạn vô hình với người dùng.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener">
  <span class="lc-ico">⏰</span>
  <span class="lc-body"><span class="lc-title">MDN — HTTP Cookies</span><span class="lc-sub">Tuổi thọ cookie và thuộc tính — khác với điều một token bên trong nói.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 15.6 QUIZ ─────────────────────────── */
    {
      title: '15.6 — Chapter 15 quiz|||15.6 — Kiểm tra chương 15',
      slug: 'nextjs-15-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về auth: session vs JWT, vì sao httpOnly cookie không localStorage, cookies() đọc/ghi ở đâu, middleware + matcher + giới hạn edge, kiểm auth ở server, và bẫy token hết hạn vs cookie + refresh.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 15: sessions vs JWTs, why httpOnly cookies over localStorage, the cookies() API, middleware and its limits, verifying the user on the server, and the token-expiry vs cookie-lifetime trap.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 15: session vs JWT, vì sao httpOnly cookie hơn localStorage, API cookies(), middleware và giới hạn, xác minh người dùng trên server, và bẫy hạn-token vs tuổi-thọ-cookie.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Where should an auth token be stored, and why?|||Token auth nên lưu ở đâu, và vì sao?',
            options: [
              'localStorage — easy to read from JS|||localStorage — dễ đọc từ JS',
              'an httpOnly cookie — JS cannot read it, so XSS cannot steal it|||một httpOnly cookie — JS không đọc được, nên XSS không đánh cắp được',
              'a global variable|||một biến toàn cục',
              'the URL|||trong URL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between a server session and a JWT?|||Khác biệt giữa session server và JWT là gì?',
            options: [
              'they are the same|||chúng giống nhau',
              'a session stores data server-side and gives an id; a JWT is a signed token that contains the info|||session lưu dữ liệu phía server và cho một id; JWT là token đã ký chứa thông tin',
              'JWTs are always insecure|||JWT luôn không an toàn',
              'sessions cannot be revoked|||session không thể thu hồi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Using cookies() in the App Router, where can you SET a cookie?|||Dùng cookies() trong App Router, bạn có thể SET cookie ở đâu?',
            options: [
              'anywhere, including a Server Component render|||đâu cũng được, kể cả lúc render Server Component',
              'only in a Server Action or Route Handler (where there is a response)|||chỉ trong Server Action hoặc Route Handler (nơi có response)',
              'only in the browser|||chỉ trong trình duyệt',
              'only in middleware|||chỉ trong middleware',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which cookie attribute makes it unreadable by JavaScript?|||Thuộc tính cookie nào làm nó không đọc được bởi JavaScript?',
            options: [
              'secure|||secure',
              'httpOnly|||httpOnly',
              'sameSite|||sameSite',
              'maxAge|||maxAge',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does middleware.ts do?|||middleware.ts làm gì?',
            options: [
              'runs after the page renders|||chạy sau khi page render',
              'runs before matching requests reach a page — good for redirects, headers, coarse gating|||chạy trước khi request khớp tới một page — hợp cho redirect, header, gác thô',
              'replaces Server Actions|||thay Server Actions',
              'styles the page|||style cho page',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is middleware alone NOT sufficient for authentication?|||Vì sao chỉ middleware là KHÔNG đủ cho xác thực?',
            options: [
              'it is too slow|||nó quá chậm',
              'it runs on a limited edge runtime and should do coarse checks; the real verify/authz must happen at the data (Server Component/Action/Handler)|||nó chạy trên runtime edge giới hạn và chỉ nên kiểm thô; xác minh/phân quyền thật phải xảy ra ở dữ liệu (Server Component/Action/Handler)',
              'middleware cannot read cookies|||middleware không đọc được cookie',
              'it only runs in development|||nó chỉ chạy ở dev',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A getCurrentUser() helper must do what beyond reading the cookie?|||Một helper getCurrentUser() phải làm gì ngoài đọc cookie?',
            options: [
              'nothing, reading is enough|||không gì, đọc là đủ',
              'verify the JWT signature and expiry before trusting the payload|||xác minh chữ ký JWT và hạn trước khi tin payload',
              'store it in localStorage|||lưu nó vào localStorage',
              'delete the cookie|||xoá cookie',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On cuongthai.com, why did sessions "die silently" after 24h with the cookie still present?|||Trên cuongthai.com, vì sao phiên "chết âm thầm" sau 24h dù cookie vẫn còn?',
            options: [
              'the cookie was deleted|||cookie bị xoá',
              'the JWT expired in 24h but the cookie lived 7d, and there was no working refresh endpoint — so every call 401\'d|||JWT hết hạn 24h nhưng cookie sống 7d, và không có endpoint refresh chạy được — nên mọi call 401',
              'the server was down|||server sập',
              'the browser blocked cookies|||trình duyệt chặn cookie',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The fix for that outage was…|||Cách vá sự cố đó là…',
            options: [
              'make the token never expire|||làm token không bao giờ hết hạn',
              'a /auth/refresh endpoint + a client 401 interceptor that refreshes once and retries|||một endpoint /auth/refresh + một interceptor 401 ở client refresh một lần rồi thử lại',
              'store the token in localStorage|||lưu token trong localStorage',
              'remove authentication|||bỏ xác thực',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The tell of the "expired token, present cookie" bug is…|||Dấu hiệu của bug "token hết hạn, cookie còn" là…',
            options: [
              'the page will not load at all|||trang không tải được gì',
              '"I am clearly logged in (cookie there, did not log out) but everything 401s"|||"tôi rõ ràng đã đăng nhập (cookie còn, không đăng xuất) nhưng mọi thứ 401"',
              'a compile error|||một lỗi biên dịch',
              'the theme changes|||theme đổi',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
