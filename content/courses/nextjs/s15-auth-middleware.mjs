/**
 * Next.js & React — Chương 15: Xác thực, middleware & cookie.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần kiến trúc auth — không có output console để chạy. Sự cố THẬT cuongthai.com:
 * phiên chết sau 24h (JWT_EXPIRES_IN=24h nhưng cookie 7d, KHÔNG có /auth/refresh
 * chạy được → mọi call authed 401) → vá bằng POST /auth/refresh + axios 401
 * interceptor refresh-một-lần-rồi-retry. Lồng vào .note-ct/.pitfall.
 */

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
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Reading and writing cookies on the server</h2>
<p class="lead">Next.js gives a <code>cookies()</code> helper from <code>next/headers</code> for working with cookies in server code. You <em>read</em> cookies almost anywhere on the server; you may only <em>set</em> or delete them where there is a response to attach them to — a Server Action or a Route Handler.</p>

<pre><code>import { cookies } from 'next/headers';

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
  <div class="kv"><span class="k">secure</span><span class="v">Sent only over HTTPS. On in production; can relax for local http.</span></div>
  <div class="kv"><span class="k">sameSite</span><span class="v">Controls cross-site sending — <code>lax</code>/<code>strict</code> defend against CSRF.</span></div>
  <div class="kv"><span class="k">maxAge / expires</span><span class="v">How long the cookie lives. Note this is the <em>cookie's</em> lifetime — not the token's own expiry (lesson 15.5 is where those two disagreeing caused a real outage).</span></div>
</div>

<div class="callout warn">
<p><strong>Why you cannot set a cookie in a Server Component:</strong> a Server Component only renders output; it has no response to write a <code>Set-Cookie</code> header onto. Setting cookies happens during a mutation (Server Action) or in a Route Handler that returns a response. Trying to set one while rendering will error — do it in the action that logs the user in.</p>
</div>

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

<pre><code>import { cookies } from 'next/headers';

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
  <div class="kv"><span class="k">secure</span><span class="v">Chỉ gửi qua HTTPS. Bật ở production; có thể nới cho http cục bộ.</span></div>
  <div class="kv"><span class="k">sameSite</span><span class="v">Kiểm soát gửi liên-site — <code>lax</code>/<code>strict</code> chống CSRF.</span></div>
  <div class="kv"><span class="k">maxAge / expires</span><span class="v">Cookie sống bao lâu. Để ý đây là tuổi thọ của <em>cookie</em> — không phải hạn của chính token (bài 15.5 là nơi hai cái này lệch nhau gây sự cố thật).</span></div>
</div>

<div class="callout warn">
<p><strong>Vì sao không set cookie trong một Server Component:</strong> một Server Component chỉ render output; nó không có response để ghi header <code>Set-Cookie</code>. Việc set cookie xảy ra trong một mutation (Server Action) hoặc trong một Route Handler trả về response. Cố set trong lúc render sẽ lỗi — hãy làm trong action đăng nhập người dùng.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Code that runs before the request reaches your route</h2>
<p class="lead">A single <code>middleware.ts</code> at the project root runs on matching requests <em>before</em> they hit a page or handler. It is the place for cross-cutting gate-keeping: redirect unauthenticated users, rewrite URLs, set headers, handle locale.</p>

<pre><code><span class="tok-comment">// middleware.ts (project root)</span>
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

<h3>It runs on the edge — so it is limited</h3>
<p>Middleware runs in a lightweight edge runtime, before rendering, on every matched request. That means it must be <em>fast</em> and cannot do heavy work: no database calls, no Node-only APIs, no verifying a token against a DB. Treat it as a coarse, cheap gate — "is there a token cookie at all?" — not a full auth check.</p>

<div class="pitfall">
<p><strong>Middleware alone is not authentication.</strong> A common and dangerous mistake is to protect pages <em>only</em> in middleware. Middleware can check "is a token present," but the real check — is the token valid, is this user allowed to see this data — must happen where the data is accessed: the Server Component, the Server Action, the Route Handler. Next's own guidance is to use middleware for optimistic redirects and do the authoritative check close to the data. Never let a pretty redirect stand in for server-side authorisation (the Chapter 12 rule again).</p>
</div>

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

<pre><code><span class="tok-comment">// middleware.ts (gốc dự án)</span>
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

<h3>Nó chạy trên edge — nên bị giới hạn</h3>
<p>Middleware chạy trong một runtime edge nhẹ, trước render, trên mọi request khớp. Nghĩa là nó phải <em>nhanh</em> và không làm việc nặng: không gọi database, không API chỉ-của-Node, không xác minh token với DB. Coi nó như một cổng thô, rẻ — "có cookie token nào không?" — không phải một phép kiểm auth đầy đủ.</p>

<div class="pitfall">
<p><strong>Chỉ middleware thì chưa phải xác thực.</strong> Một sai lầm phổ biến và nguy hiểm là bảo vệ trang <em>chỉ</em> trong middleware. Middleware kiểm được "có token hiện diện không", nhưng phép kiểm thật — token có hợp lệ không, người này có được phép xem dữ liệu này không — phải xảy ra nơi dữ liệu được truy cập: Server Component, Server Action, Route Handler. Chính hướng dẫn của Next là dùng middleware cho redirect lạc quan và làm phép kiểm có thẩm quyền gần dữ liệu. Đừng bao giờ để một redirect đẹp thay cho phân quyền phía server (lại là quy tắc Chương 12).</p>
</div>

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

<pre><code><span class="tok-comment">// lib/auth.ts</span>
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

<pre><code><span class="tok-comment">// lib/auth.ts</span>
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
