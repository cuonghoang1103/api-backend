/**
 * Authentication · Chương 5 · 5.1 — Hai token, vì một cái không làm nổi cả hai việc. Slug giữ: auth-5-1-hai-token. Bài đầu chương.
 * Output thật (_ma.mjs, LabFlow ID v0.5 + PostgreSQL 17.11, env -i): access JWT 376 ký tự (15 phút) vs refresh opaque lfid_rt_
 * (30 ngày, lưu digest SHA-256); /sign-in phát cả hai (refresh trong cookie __Host- HttpOnly); /refresh xoay token + mint access mới.
 */
import G from '../giang/auth-05-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const L = CODE.layer.split('\n');
const ISSUE = L.slice(L.findIndex((l) => l.includes('async function issue')), L.findIndex((l) => l.includes('/** Rotate a presented'))).join('\n').trim();
const SV = CODE.server05.split('\n');
const SIGNIN = SV.slice(SV.findIndex((l) => l.startsWith("app.post('/sign-in'")), SV.findIndex((l) => l.includes("lesson 5.1, 5.2: exchange"))).join('\n').trim();
const REFRESH = SV.slice(SV.findIndex((l) => l.startsWith("app.post('/refresh'")), SV.findIndex((l) => l.startsWith("app.get('/me'"))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet (token-based)', 'A short-lived access token plus a long-lived, revocable refresh token; store the refresh token hashed and rotate it (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📜', 'RFC 9700 — Best Current Practice for OAuth 2.0 Security', '§4.14 refresh tokens: rotate them, and either sender-constrain or detect reuse; this chapter builds the reuse-detection path (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet (dựa trên token)', 'Một access token ngắn hạn cộng một refresh token dài hạn, thu hồi được; lưu refresh token đã băm và xoay vòng nó (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📜', 'RFC 9700 — Thực hành tốt nhất cho bảo mật OAuth 2.0', '§4.14 refresh token: xoay vòng, và hoặc ràng theo người gửi hoặc phát hiện tái dùng; chương này dựng đường phát hiện tái dùng (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th></th><th>Access token</th><th>Refresh token</th></tr></thead>
<tbody>
<tr><td>Form</td><td>a JWT — header.payload.signature (Chapter 4)</td><td>one opaque random secret (<code>lfid_rt_…</code>)</td></tr>
<tr><td>Lifetime</td><td>15 minutes</td><td>30 days (rotated on every use)</td></tr>
<tr><td>Verified by</td><td>signature, no DB lookup (stateless)</td><td>a row keyed by its digest (stateful)</td></tr>
<tr><td>Revocable?</td><td>no — only expiry (lesson 4.3)</td><td><strong>yes, instantly</strong> — delete/flag the row</td></tr>
<tr><td>Sent on</td><td>every API request, in <code>Authorization</code></td><td>only to <code>/refresh</code>, in an HttpOnly cookie</td></tr>
<tr><td>Stored by the client</td><td>in memory</td><td>in an HttpOnly cookie no script can read</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th></th><th>Access token</th><th>Refresh token</th></tr></thead>
<tbody>
<tr><td>Dạng</td><td>một JWT — header.payload.signature (Chương 4)</td><td>một bí mật ngẫu nhiên mờ đục (<code>lfid_rt_…</code>)</td></tr>
<tr><td>Tuổi thọ</td><td>15 phút</td><td>30 ngày (xoay vòng mỗi lần dùng)</td></tr>
<tr><td>Xác minh bằng</td><td>chữ ký, không tra DB (không trạng thái)</td><td>một dòng khoá theo digest (có trạng thái)</td></tr>
<tr><td>Thu hồi được?</td><td>không — chỉ hết hạn (bài 4.3)</td><td><strong>được, tức thì</strong> — xoá/đánh dấu dòng</td></tr>
<tr><td>Gửi khi</td><td>mọi request API, trong <code>Authorization</code></td><td>chỉ tới <code>/refresh</code>, trong một cookie HttpOnly</td></tr>
<tr><td>Client cất ở</td><td>trong bộ nhớ</td><td>một cookie HttpOnly không script nào đọc được</td></tr>
</tbody>
</table>`;

export default {
  title: '5.1 — Two tokens, because one cannot do both jobs|||5.1 — Hai token, vì một cái không làm nổi cả hai việc',
  slug: 'auth-5-1-hai-token',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Access token phải ngắn (một cái bị trộm chết nhanh), nhưng đăng nhập lại mỗi 15 phút thì không chịu nổi — nên có token thứ hai, refresh token, dài hạn và thu hồi được, mua access token mới mà không cần mật khẩu. LabFlow ID v0.5: access JWT 15 phút không trạng thái vs refresh opaque 30 ngày lưu dạng digest SHA-256; /sign-in phát cả hai (refresh trong cookie __Host- HttpOnly); /refresh xoay token và mint access mới. Vì sao một token không làm nổi cả hai việc, và mỗi token cất ở đâu.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Two tokens, because one cannot do both jobs</h2>
<p class="lead">Chapter 4 ended with a tension. An access token must be <strong>short</strong> — it cannot be revoked (lesson 4.3), so 15 minutes is the cap on a stolen one. But asking a user to sign in every 15 minutes is unusable. Chapter 5 resolves it with a <strong>second token</strong>: a long-lived, revocable <em>refresh token</em> whose only job is to buy new access tokens without the password. This lesson puts the two side by side and watches LabFlow ID v0.5 issue and exchange them.</p>

<div class="callout ok">
<p><strong>After Chapter 5 you can:</strong> run an access + refresh token pair; rotate the refresh token on every use and detect reuse as theft, revoking the whole family; enumerate the five events that must end a session; show a user their devices and revoke one; and handle the refresh race without logging the real user out. Lab 5 grades a refresh layer against rotation, reuse and the race.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>say what each of the two tokens is for, and why one token cannot do both jobs;</li>
<li>describe the shape, lifetime, storage and revocability of each;</li>
<li>point to where LabFlow ID issues both at sign-in and exchanges the refresh token at <code>/refresh</code>;</li>
<li>explain why the refresh token is stored as a digest and kept in an HttpOnly cookie.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> every SEP490 app that uses JWTs hits the “my login expires too fast / never” wall. After this lesson you have the standard two-token answer, and you can defend where each token lives.</p>
</div>

<h3>An everyday picture first</h3>
<p>Think of a <strong>day pass</strong> and a <strong>membership card</strong>. The day pass opens every door today and is useless tomorrow; if you drop it, you have lost one day. The membership card lives in a drawer, never swipes a door, and does exactly one thing: it proves you may print a new day pass — and it can be cancelled the instant you report it lost. The access token is the day pass (short, used everywhere, not worth stealing for long); the refresh token is the membership card (long, used once in a while, revocable).</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">access</span><span class="lz-d">JWT · 15 min · stateless (signature only) · sent on every request · <strong>cannot be revoked</strong></span></div>
  <div class="lz-layer"><span class="lz-k">refresh</span><span class="lz-d">opaque · 30 days · stateful (a row) · sent only to /refresh · <strong>revocable, rotated each use</strong></span></div>
</div>

<h3>Two tokens, two shapes</h3>
${BANG_EN}
<p>The access token is the JWT of Chapter 4. The refresh token is new: a random secret like a session id, so LabFlow ID stores only its SHA-256 (lesson 1.3) and rotates it on every use (lesson 5.2). The <code>issue()</code> that starts a family:</p>
${ma('javascript', ISSUE)}
<p>A <strong>family</strong> is one login on one device; every refresh token minted from it shares a <code>familyId</code> (lessons 5.2, 5.4 use it). The token goes to the client; the row keeps the digest.</p>

<h3>Why not one token for both jobs</h3>
<p>The two jobs pull in opposite directions. Put the <em>long</em> life on the JWT and a stolen one is valid for 30 days with no way to revoke it (lesson 4.3). Put the <em>short</em> life on the refresh token and the user re-enters their password every 15 minutes. One token cannot be both un-revocable-and-short and long-and-safe. Splitting them lets each be simple: the access token short and stateless, the refresh token long and revocable.</p>

<h3>Sign-in hands out both</h3>
${ma('javascript', SIGNIN)}
${ra(OUT['51-sign-in'])}
<p>The response body carries the <code>access_token</code>; the refresh token goes back <strong>only</strong> in a <code>__Host-lfid_rt</code> HttpOnly cookie (lesson 4.5), so no script can read it and the browser sends it by itself to <code>/refresh</code>. When the access token expires, the client exchanges the cookie:</p>
${ma('javascript', REFRESH)}
<p>Each <code>/refresh</code> rotates the token — the old cookie value is now spent, a new one is set — and returns a fresh 15-minute access token. The user sees nothing; no password, no prompt. Rotation and what happens when a spent token comes back is lesson 5.2.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the refresh token in a readable place.</strong> The whole point of the split is that the <em>long-lived</em> token is the hard one to steal. Keep it in <code>localStorage</code> or a non-HttpOnly cookie and an XSS now steals a 30-day token — strictly worse than the 15-minute access token the design was protecting. The refresh token belongs in an HttpOnly cookie scoped to the refresh route, and nowhere else.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Why two tokens?”</strong> — A short access token so a stolen one dies fast and needs no DB lookup; a long refresh token so the user is not prompted constantly, kept revocable to undo the first token's un-revocability.</li>
<li><strong>“Where do you store the refresh token?”</strong> — In an HttpOnly cookie scoped to <code>/refresh</code>; never localStorage. The access token stays in memory as a bearer header.</li>
<li><strong>“How is the refresh token stored server-side?”</strong> — As its SHA-256 digest, one row per token, in families keyed to a login/device.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start v0.5 and run <code>bash demo5/sign-in-refresh.sh</code>. Confirm the refresh cookie value changes after <code>/refresh</code>. Why must it change?</li>
<li>Run <code>node demo5/two-tokens.mjs</code>. Decode the access token's payload yourself (lesson 4.1). Can you decode the refresh token? Why not?</li>
<li>Look at <code>sql/003_refresh.sql</code>. Which column lets “sign out this device” and which lets “sign out everywhere”?</li>
</ol>
<p><strong>Solution:</strong> (1) rotation — the old refresh token is marked used and must be rejected on reuse (5.2); a new one is issued, so the cookie changes. (2) the access token is base64url JSON (readable); the refresh token is opaque random bytes with no structure — there is nothing to decode. (3) <code>family_id</code> for one device, <code>user_id</code> for everywhere.</p>
<p><strong>Done when:</strong> you can state each token's job in one sentence, and say where each is stored and why.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">access token</span><span class="v">A short (15-min) JWT sent on every request; stateless, cannot be revoked before it expires.</span></div>
  <div class="kv"><span class="k">refresh token</span><span class="v">A long-lived opaque secret used only to get new access tokens; revocable, stored as a digest.</span></div>
  <div class="kv"><span class="k">family</span><span class="v">All refresh tokens from one login on one device, sharing a <code>family_id</code>.</span></div>
  <div class="kv"><span class="k">rotation</span><span class="v">Issuing a new refresh token and retiring the old one on every use (lesson 5.2).</span></div>
  <div class="kv"><span class="k">stateless vs stateful</span><span class="v">The access token needs no lookup; the refresh token is a row, so it can be revoked.</span></div>
  <div class="kv"><span class="k">__Host- cookie</span><span class="v">A Secure, Path=/, no-Domain cookie the browser enforces (lesson 3.2); here HttpOnly too.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two tokens: a short stateless access token for every request, a long revocable refresh token for <code>/refresh</code> only.</li>
<li>One token cannot be both short-and-unrevocable-safe and long-and-convenient; splitting them makes each simple.</li>
<li>The refresh token is random, stored as a SHA-256 digest, in families keyed to a login/device.</li>
<li>Sign-in returns the access token in the body and the refresh token in an HttpOnly cookie; <code>/refresh</code> rotates it.</li>
<li>Never keep the refresh token anywhere a script can read — it is the long-lived one.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Applied in Node.js — lesson 8.2: JWT, access and refresh tokens', sub: 'Same two-token split on the Notes API with jsonwebtoken. That lesson wires access + refresh into Express end to end; this one measures the shapes, stores the refresh token as a digest in families, and builds rotation with reuse detection (5.2). Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hai token, vì một cái không làm nổi cả hai việc</h2>
<p class="lead">Chương 4 khép lại bằng một căng thẳng. Access token phải <strong>ngắn</strong> — nó không thu hồi được (bài 4.3), nên 15 phút là cái trần cho một cái bị trộm. Nhưng bắt người dùng đăng nhập mỗi 15 phút thì không dùng được. Chương 5 giải nó bằng một <strong>token thứ hai</strong>: một <em>refresh token</em> dài hạn, thu hồi được, mà việc duy nhất là mua access token mới không cần mật khẩu. Bài này đặt hai cái cạnh nhau và nhìn LabFlow ID v0.5 phát và đổi chúng.</p>

<div class="callout ok">
<p><strong>Học xong Chương 5 bạn làm được:</strong> chạy cặp access + refresh token; xoay refresh token mỗi lần dùng và phát hiện tái dùng như trộm, thu hồi cả họ; liệt kê năm sự kiện bắt buộc kết thúc một phiên; cho người dùng thấy các thiết bị của họ và thu hồi một cái; và xử lý cuộc đua refresh mà không đăng xuất người thật. Lab 5 chấm một lớp refresh trước xoay vòng, tái dùng và cuộc đua.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nói mỗi token trong hai cái để làm gì, và vì sao một token không làm nổi cả hai việc;</li>
<li>mô tả dạng, tuổi thọ, nơi cất và khả năng thu hồi của mỗi cái;</li>
<li>chỉ được chỗ LabFlow ID phát cả hai lúc đăng nhập và đổi refresh token ở <code>/refresh</code>;</li>
<li>giải thích vì sao refresh token lưu dạng digest và giữ trong một cookie HttpOnly.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> app SEP490 nào dùng JWT cũng đụng bức tường "đăng nhập hết hạn quá nhanh / không bao giờ". Học xong bài này, bạn có câu trả lời hai token chuẩn, và bảo vệ được chỗ cất mỗi token.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Hãy nghĩ tới một <strong>vé ngày</strong> và một <strong>thẻ hội viên</strong>. Vé ngày mở mọi cửa hôm nay và vô dụng ngày mai; đánh rơi nó thì bạn mất một ngày. Thẻ hội viên nằm trong ngăn kéo, không bao giờ quẹt cửa, và làm đúng một việc: chứng minh bạn được in một vé ngày mới — và huỷ được ngay khi bạn báo mất. Access token là vé ngày (ngắn, dùng khắp nơi, không đáng trộm lâu); refresh token là thẻ hội viên (dài, thỉnh thoảng mới dùng, thu hồi được).</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">access</span><span class="lz-d">JWT · 15 phút · không trạng thái (chỉ chữ ký) · gửi mọi request · <strong>không thu hồi được</strong></span></div>
  <div class="lz-layer"><span class="lz-k">refresh</span><span class="lz-d">opaque · 30 ngày · có trạng thái (một dòng) · chỉ gửi tới /refresh · <strong>thu hồi được, xoay mỗi lần dùng</strong></span></div>
</div>

<h3>Hai token, hai dạng</h3>
${BANG_VI}
<p>Access token là JWT của Chương 4. Refresh token là mới: một bí mật ngẫu nhiên như một id phiên, nên LabFlow ID chỉ lưu SHA-256 của nó (bài 1.3) và xoay nó mỗi lần dùng (bài 5.2). Hàm <code>issue()</code> mở một họ:</p>
${ma('javascript', ISSUE)}
<p>Một <strong>họ (family)</strong> là một lần đăng nhập trên một thiết bị; mọi refresh token đúc từ nó chia sẻ một <code>familyId</code> (bài 5.2, 5.4 dùng nó). Token đi tới client; dòng giữ digest.</p>

<h3>Vì sao một token không làm nổi cả hai việc</h3>
<p>Hai việc kéo về hai hướng ngược nhau. Đặt tuổi thọ <em>dài</em> lên JWT thì một cái bị trộm sống 30 ngày không cách nào thu hồi (bài 4.3). Đặt tuổi thọ <em>ngắn</em> lên refresh token thì người dùng nhập lại mật khẩu mỗi 15 phút. Một token không thể vừa không-thu-hồi-được-mà-ngắn vừa dài-và-an-toàn. Tách chúng cho phép mỗi cái đơn giản: access token ngắn và không trạng thái, refresh token dài và thu hồi được.</p>

<h3>Đăng nhập phát cả hai</h3>
${ma('javascript', SIGNIN)}
${ra(OUT['51-sign-in'])}
<p>Thân phản hồi mang <code>access_token</code>; refresh token quay về <strong>chỉ</strong> trong một cookie <code>__Host-lfid_rt</code> HttpOnly (bài 4.5), nên không script nào đọc được và trình duyệt tự gửi nó tới <code>/refresh</code>. Khi access token hết hạn, client đổi cái cookie:</p>
${ma('javascript', REFRESH)}
<p>Mỗi <code>/refresh</code> xoay token — giá trị cookie cũ giờ bị tiêu, một cái mới được đặt — và trả về một access token 15 phút mới. Người dùng không thấy gì; không mật khẩu, không hỏi. Xoay vòng và chuyện gì xảy ra khi một token đã tiêu quay lại là bài 5.2.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — refresh token ở một chỗ đọc được.</strong> Cả ý nghĩa của việc tách là token <em>dài hạn</em> mới là cái khó trộm. Giữ nó trong <code>localStorage</code> hay một cookie không HttpOnly thì một XSS giờ trộm một token 30 ngày — tệ hơn hẳn access token 15 phút mà thiết kế đang bảo vệ. Refresh token thuộc về một cookie HttpOnly giới hạn ở tuyến refresh, và không đâu khác.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Vì sao hai token?"</strong> — Một access token ngắn để một cái bị trộm chết nhanh và không cần tra DB; một refresh token dài để người dùng không bị hỏi liên tục, giữ thu hồi được để bù cho việc token đầu không thu hồi được.</li>
<li><strong>"Bạn cất refresh token ở đâu?"</strong> — Trong một cookie HttpOnly giới hạn ở <code>/refresh</code>; không bao giờ localStorage. Access token nằm trong bộ nhớ làm header bearer.</li>
<li><strong>"Refresh token lưu phía máy chủ thế nào?"</strong> — Dạng digest SHA-256, một dòng cho mỗi token, trong các họ khoá theo một lần đăng nhập/thiết bị.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Khởi động v0.5 và chạy <code>bash demo5/sign-in-refresh.sh</code>. Xác nhận giá trị cookie refresh đổi sau <code>/refresh</code>. Vì sao nó phải đổi?</li>
<li>Chạy <code>node demo5/two-tokens.mjs</code>. Tự giải mã payload của access token (bài 4.1). Bạn giải mã refresh token được không? Vì sao không?</li>
<li>Nhìn <code>sql/003_refresh.sql</code>. Cột nào cho "đăng xuất thiết bị này" và cột nào cho "đăng xuất mọi nơi"?</li>
</ol>
<p><strong>Lời giải:</strong> (1) xoay vòng — refresh token cũ bị đánh dấu đã dùng và phải bị từ chối khi tái dùng (5.2); một cái mới được phát, nên cookie đổi. (2) access token là JSON base64url (đọc được); refresh token là byte ngẫu nhiên mờ đục không cấu trúc — chẳng có gì để giải mã. (3) <code>family_id</code> cho một thiết bị, <code>user_id</code> cho mọi nơi.</p>
<p><strong>Đạt khi:</strong> bạn nói được việc của mỗi token trong một câu, và nói nơi cất mỗi cái và vì sao.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">access token</span><span class="v">Một JWT ngắn (15 phút) gửi mọi request; không trạng thái, không thu hồi được trước khi hết hạn.</span></div>
  <div class="kv"><span class="k">refresh token</span><span class="v">Một bí mật mờ đục dài hạn chỉ dùng để lấy access token mới; thu hồi được, lưu dạng digest.</span></div>
  <div class="kv"><span class="k">family (họ token)</span><span class="v">Mọi refresh token từ một lần đăng nhập trên một thiết bị, chung một <code>family_id</code>.</span></div>
  <div class="kv"><span class="k">rotation (xoay vòng)</span><span class="v">Phát một refresh token mới và cho cái cũ nghỉ mỗi lần dùng (bài 5.2).</span></div>
  <div class="kv"><span class="k">stateless vs stateful</span><span class="v">Access token không cần tra; refresh token là một dòng, nên thu hồi được.</span></div>
  <div class="kv"><span class="k">__Host- cookie</span><span class="v">Cookie Secure, Path=/, không Domain do trình duyệt bắt buộc (bài 3.2); ở đây HttpOnly nữa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai token: một access token ngắn không trạng thái cho mọi request, một refresh token dài thu hồi được chỉ cho <code>/refresh</code>.</li>
<li>Một token không thể vừa ngắn-và-không-thu-hồi-an-toàn vừa dài-và-tiện; tách chúng làm mỗi cái đơn giản.</li>
<li>Refresh token là ngẫu nhiên, lưu dạng digest SHA-256, trong các họ khoá theo một lần đăng nhập/thiết bị.</li>
<li>Đăng nhập trả access token trong thân và refresh token trong một cookie HttpOnly; <code>/refresh</code> xoay nó.</li>
<li>Không bao giờ giữ refresh token ở chỗ script đọc được — nó là cái dài hạn.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Áp vào Node.js — bài 8.2: JWT, access và refresh token', sub: 'Cùng cách tách hai token trên Notes API với jsonwebtoken. Bài đó ráp access + refresh vào Express từ đầu tới cuối; bài này đo các dạng, lưu refresh token dạng digest trong các họ, và dựng xoay vòng có phát hiện tái dùng (5.2). Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
