/**
 * Authentication — Chương 8: OAuth 2.1 và OpenID Connect.
 * OAuth dùng để làm gì · luồng authorization code kèm PKCE · state, nonce, redirect_uri ·
 * ID token so với access token · làm một client thật · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 8 — OAuth 2.1 and OpenID Connect|||Chương 8 — OAuth 2.1 và OpenID Connect',
  description: '"Đăng nhập bằng Google" nhìn thì đơn giản, mà bên dưới là hai đặc tả khác nhau chồng lên nhau và một danh sách dài những cách cài đặt sai vẫn CHẠY ĐƯỢC. Chương này tách rõ uỷ quyền với xác thực, chạy luồng authorization code kèm PKCE bằng số thật, và chỉ ra cú chiếm tài khoản mà mọi nút "đăng nhập bằng mạng xã hội" đều mắc nếu quên đúng một trường.',
  lessons: [

    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — What OAuth is for, and the three things it is confused with|||8.1 — OAuth dùng để làm gì, và ba thứ nó bị lẫn với',
      slug: 'auth-8-1-oauth-la-gi',
      type: 'LESSON',
      description: 'OAuth là giao thức UỶ QUYỀN: nó trả lời câu "ứng dụng này được chạm vào những gì của tôi", không phải câu "tôi là ai". Bài này tách rõ bốn vai, chỉ ra vì sao nút "đăng nhập bằng Google" thật ra là OpenID Connect chứ không phải OAuth trần, và vì sao lẫn hai thứ đó là gốc của hầu hết lỗ hổng ở chương này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>What OAuth is for, and the three things it is confused with</h2>
<p class="lead">OAuth 2.0 was designed so that one application could act on your behalf at another without you handing over your password. That is a delegation protocol, and it answers "what may this app touch". Almost every vulnerability in this chapter comes from code that used it to answer a different question — "who is this person" — which it was never built to answer on its own.</p>

<h3>The four roles, named once so the rest of the chapter reads</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Resource owner</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The user</span><span class="lz-nsub">The person who owns the data and clicks "Allow" · the only party who can grant anything</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Client</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Your application</span><span class="lz-nsub">Wants access · gets a token · is the party this chapter teaches you to be</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Authorization server</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Google, GitHub, your own IdP</span><span class="lz-nsub">Authenticates the user, shows the consent screen, issues tokens</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Resource server</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The API holding the data</span><span class="lz-nsub">Accepts the access token and enforces its scopes · often, but not always, the same company</span></div></div>
  </div>
</div>

<h3>Three questions, three answers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authorisation — "what may this app do?"</span><span class="v">Plain OAuth 2.0. The output is an access token carrying scopes: <code>repo</code>, <code>calendar.readonly</code>, <code>files.write</code>. It says nothing reliable about identity, and it is not addressed to you.</span></div>
  <div class="kv"><span class="k">Authentication — "who is this person?"</span><span class="v">OpenID Connect, a thin layer on top of OAuth. The output is an <code>id_token</code>: a signed JWT (Chapter 4) issued <em>to your client</em>, stating who signed in, when, and at which provider.</span></div>
  <div class="kv"><span class="k">Federation — "whose users are these?"</span><span class="v">SAML in enterprises, or OIDC with an organisation's own identity provider. Same protocols, different question: an employer asserting that this person belongs to them, usually with group membership attached.</span></div>
  <div class="kv"><span class="k">The everyday confusion</span><span class="v">"Login with Google" is OIDC. If you are calling Google APIs on the user's behalf, that is OAuth. Most apps want the first and configure the second, then reconstruct identity from an API call — which is Lesson 8.4's bug.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — an access token is not proof of identity, and using it as one is a real vulnerability with a name.</strong> The reasoning looks sound: the app receives an access token, calls <code>/userinfo</code>, gets back <code>cuong@cuongthai.com</code>, and logs that user in. The flaw is that an access token is a bearer credential issued to <em>some</em> client, and your server has no way to tell which. A malicious app can collect a token from a user who installs it, present that token to you, and be logged in as them. This is the confused deputy problem, and it is why OIDC exists: the <code>id_token</code> names its intended audience in the <code>aud</code> claim, so a token minted for someone else fails your check.</p>
</div>

<h3>What OAuth actually replaced</h3>
<pre><code><span class="tok-comment">// Trước OAuth, việc "cho ứng dụng này đọc danh bạ của tôi" trông như thế này:</span>
POST /nhap-danh-ba
{ "email": "cuong@gmail.com", "matKhau": "mat-khau-gmail-that" }

<span class="tok-comment">// Bên thứ ba giữ mật khẩu Gmail của bạn. Toàn quyền. Vĩnh viễn.</span>
<span class="tok-comment">// Muốn thu hồi ⇒ đổi mật khẩu ⇒ mọi ứng dụng khác cũng chết theo.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Scoped</span><span class="lz-t">Not all or nothing</span><span class="lz-d">A token for <code>contacts.readonly</code> cannot send mail. The password could do everything, and there was no way to ask for less.</span></div>
  <div class="lz-step"><span class="lz-k">Revocable individually</span><span class="lz-t">One app at a time</span><span class="lz-d">The user's account page lists every connected application with its own revoke button — the device list from Lesson 5.4, applied to third parties.</span></div>
  <div class="lz-step"><span class="lz-k">Expiring</span><span class="lz-t">Access tokens are short</span><span class="lz-d">Minutes to an hour, with a refresh token behind them. Exactly the split from Chapter 5, standardised across companies.</span></div>
  <div class="lz-step"><span class="lz-k">Auditable</span><span class="lz-t">The provider sees who used what</span><span class="lz-d">Each token identifies its client, so the authorization server can log, rate-limit and cut off one application without touching the user's own access.</span></div>
</div>

<h3>Discovery: one URL, and everything else follows</h3>
<pre><code><span class="tok-comment">// Mọi thứ bạn cần biết về một nhà cung cấp nằm ở MỘT địa chỉ cố định.</span>
curl -s https://accounts.google.com/.well-known/openid-configuration</code></pre>
<div class="out">issuer                   https://accounts.google.com
authorization_endpoint   https://accounts.google.com/o/oauth2/v2/auth
token_endpoint           https://oauth2.googleapis.com/token
userinfo_endpoint        https://openidconnect.googleapis.com/v1/userinfo
jwks_uri                 https://www.googleapis.com/oauth2/v3/certs
revocation_endpoint      https://oauth2.googleapis.com/revoke

code_challenge_methods_supported  ["plain","S256"]
grant_types_supported             ["authorization_code","refresh_token", …]
id_token_signing_alg_values       ["RS256"]

# Do that hom nay. Bon khoa dang nam trong jwks_uri:
#   kid=8ff13a6fcdabf306712e58f35668a04eb5a5fae1  alg=RS256
#   kid=d6a0e659c3392d9e592a4b0ad88e7b2b88076909  alg=RS256
#   kid=943a3a5d7d919625a454e489b75c29adab57acba  alg=RS256
#   kid=f10f87405a979c1df36df26606734f33cd85c271  alg=RS256
# Bon khoa, moi khoa mot kid — chinh la cach xoay vong o Bai 4.4.</div>
<h3>OAuth 2.1, and the flows that are now dead</h3>
<div class="callout warn">
<p><strong>Half the OAuth tutorials on the internet teach flows that current guidance removes, and they still appear to work.</strong> OAuth 2.1 consolidates fifteen years of errata into one document, and the practical effect is a short list of deletions. <strong>Implicit flow</strong> — <code>response_type=token</code>, returning an access token in the URL fragment — is gone: the token lands in browser history, in the <code>Referer</code>, and in any script on the page. <strong>Resource owner password credentials</strong> — the app collects the user's provider password and exchanges it — is gone, because it reintroduces exactly the problem OAuth was created to remove, and it cannot support MFA or passkeys. <strong>PKCE is now required for every client</strong>, not just mobile apps. <strong>Redirect URIs must match exactly</strong>, with no wildcards and no prefix matching (Lesson 8.3). If a guide tells you to use <code>response_type=token</code> or to post a password to a token endpoint, it is describing 2012.</p>
</div>
<div class="note-ct">
<p><strong>Read the chapter as a client, and stay one.</strong> Everything here is written for the application that says "sign in with Google" — the party doing the redirecting, the verifying and the account linking. Being an <em>authorization server</em> is a different and much larger job: consent screens, client registration, token introspection, key rotation, and a specification surface that is genuinely hostile to improvisation. If you find yourself building one for internal use, use an existing implementation — Keycloak, Ory, Auth0, Authentik — and spend the saved effort on Chapters 9 and 11 instead. The number of teams who have written an authorization server and been glad about it later is small.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6749" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">RFC 6749 — the OAuth 2.0 framework</span><span class="lc-sub">datatracker.ietf.org · The original, worth reading §1 and §4 at least</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1" target="_blank" rel="noopener"><span class="lc-ico">🆕</span><span class="lc-body"><span class="lc-title">OAuth 2.1</span><span class="lc-sub">datatracker.ietf.org · The consolidation, including everything it removes</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html" target="_blank" rel="noopener"><span class="lc-ico">🆔</span><span class="lc-body"><span class="lc-title">OpenID Connect Core 1.0</span><span class="lc-sub">openid.net · The identity layer, and what an ID token must contain</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">Redirects, query strings and fragments — the plumbing every flow here runs on</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Present an access token minted for a different client and watch a naive login accept it</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>OAuth dùng để làm gì, và ba thứ nó bị lẫn với</h2>
<p class="lead">OAuth 2.0 được thiết kế để một ứng dụng có thể hành động THAY MẶT bạn ở một ứng dụng khác mà bạn không phải trao mật khẩu. Đó là một giao thức UỶ QUYỀN, và nó trả lời câu "ứng dụng này được chạm vào những gì". Gần như mọi lỗ hổng trong chương này đều đến từ đoạn mã dùng nó để trả lời một câu KHÁC — "người này là ai" — thứ mà một mình nó chưa bao giờ được dựng ra để trả lời.</p>

<h3>Bốn vai, gọi tên một lần cho cả chương đọc được</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Chủ tài nguyên</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Người dùng</span><span class="lz-nsub">Người sở hữu dữ liệu và bấm "Cho phép" · bên DUY NHẤT có quyền cấp bất cứ thứ gì</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Client</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ứng dụng của bạn</span><span class="lz-nsub">Muốn có quyền truy cập · nhận về một token · là cái vai mà chương này dạy bạn đóng</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Máy chủ uỷ quyền</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Google, GitHub, hoặc IdP của chính bạn</span><span class="lz-nsub">Xác thực người dùng, hiện màn hình đồng ý, phát token</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Máy chủ tài nguyên</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">API đang giữ dữ liệu</span><span class="lz-nsub">Nhận access token và thi hành phạm vi của nó · thường, nhưng không phải luôn, cùng một công ty</span></div></div>
  </div>
</div>

<h3>Ba câu hỏi, ba câu trả lời</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Uỷ quyền — "ứng dụng này được làm gì?"</span><span class="v">OAuth 2.0 trần. Đầu ra là một access token mang theo các phạm vi: <code>repo</code>, <code>calendar.readonly</code>, <code>files.write</code>. Nó không nói gì đáng tin về danh tính cả, và nó KHÔNG được gửi cho bạn.</span></div>
  <div class="kv"><span class="k">Xác thực — "người này là ai?"</span><span class="v">OpenID Connect, một lớp mỏng đặt lên trên OAuth. Đầu ra là một <code>id_token</code>: một JWT đã ký (Chương 4) phát <em>cho client của bạn</em>, khai rõ ai vừa đăng nhập, lúc nào, và ở nhà cung cấp nào.</span></div>
  <div class="kv"><span class="k">Liên kết định danh — "đây là người dùng của ai?"</span><span class="v">SAML trong doanh nghiệp, hoặc OIDC với nhà cung cấp danh tính riêng của một tổ chức. Cùng giao thức, khác câu hỏi: một người sử dụng lao động khẳng định người này thuộc về họ, thường kèm theo thông tin nhóm.</span></div>
  <div class="kv"><span class="k">Cái nhầm lẫn thường ngày</span><span class="v">"Đăng nhập bằng Google" là OIDC. Còn nếu bạn gọi các API của Google thay mặt người dùng thì đó mới là OAuth. Phần lớn ứng dụng MUỐN cái thứ nhất mà lại CẤU HÌNH cái thứ hai, rồi dựng lại danh tính từ một lời gọi API — chính là con lỗi ở Bài 8.4.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — access token KHÔNG phải bằng chứng danh tính, và dùng nó như vậy là một lỗ hổng thật, có tên hẳn hoi.</strong> Cách suy nghĩ nghe rất xuôi: ứng dụng nhận một access token, gọi <code>/userinfo</code>, nhận về <code>cuong@cuongthai.com</code>, rồi đăng nhập người dùng đó. Chỗ hỏng nằm ở chỗ access token là một tín vật CẦM-LÀ-DÙNG-ĐƯỢC phát cho MỘT client nào đó, và máy chủ của bạn không có cách nào biết là client nào. Một ứng dụng độc hại có thể thu token từ một người dùng cài nó, đem token đó trình cho bạn, và được đăng nhập với tư cách người ấy. Đây là bài toán "kẻ thừa hành bị lẫn lộn", và nó chính là lý do OIDC tồn tại: <code>id_token</code> khai rõ bên nhận dự định trong claim <code>aud</code>, nên một token đúc cho người khác sẽ trượt phép kiểm của bạn.</p>
</div>

<h3>OAuth thật ra đã THAY THẾ cái gì</h3>
<pre><code><span class="tok-comment">// Trước OAuth, việc "cho ứng dụng này đọc danh bạ của tôi" trông như thế này:</span>
POST /nhap-danh-ba
{ "email": "cuong@gmail.com", "matKhau": "mat-khau-gmail-that" }

<span class="tok-comment">// Bên thứ ba giữ mật khẩu Gmail của bạn. Toàn quyền. Vĩnh viễn.</span>
<span class="tok-comment">// Muốn thu hồi ⇒ đổi mật khẩu ⇒ mọi ứng dụng khác cũng chết theo.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Có phạm vi</span><span class="lz-t">Không phải được tất hoặc mất tất</span><span class="lz-d">Một token cho <code>contacts.readonly</code> thì không gửi thư được. Còn cái mật khẩu thì làm được mọi thứ, và chẳng có cách nào để xin ÍT hơn.</span></div>
  <div class="lz-step"><span class="lz-k">Thu hồi được từng cái một</span><span class="lz-t">Mỗi lần một ứng dụng</span><span class="lz-d">Trang tài khoản của người dùng liệt kê mọi ứng dụng đã kết nối kèm nút thu hồi riêng — chính là danh sách thiết bị ở Bài 5.4, áp cho bên thứ ba.</span></div>
  <div class="lz-step"><span class="lz-k">Có hạn</span><span class="lz-t">Access token thì ngắn</span><span class="lz-d">Vài phút tới một giờ, có refresh token đứng sau. Đúng cái cách tách ở Chương 5, được chuẩn hoá xuyên qua các công ty.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm toán được</span><span class="lz-t">Nhà cung cấp thấy ai dùng cái gì</span><span class="lz-d">Mỗi token khai rõ client của nó, nên máy chủ uỷ quyền có thể ghi log, bóp tần suất và cắt hẳn MỘT ứng dụng mà không đụng gì tới quyền truy cập của chính người dùng.</span></div>
</div>

<h3>Discovery: một URL, và mọi thứ còn lại tự suy ra</h3>
<pre><code><span class="tok-comment">// Mọi thứ bạn cần biết về một nhà cung cấp nằm ở MỘT địa chỉ cố định.</span>
curl -s https://accounts.google.com/.well-known/openid-configuration</code></pre>
<div class="out">issuer                   https://accounts.google.com
authorization_endpoint   https://accounts.google.com/o/oauth2/v2/auth
token_endpoint           https://oauth2.googleapis.com/token
userinfo_endpoint        https://openidconnect.googleapis.com/v1/userinfo
jwks_uri                 https://www.googleapis.com/oauth2/v3/certs
revocation_endpoint      https://oauth2.googleapis.com/revoke

code_challenge_methods_supported  ["plain","S256"]
grant_types_supported             ["authorization_code","refresh_token", …]
id_token_signing_alg_values       ["RS256"]

# Do that hom nay. Bon khoa dang nam trong jwks_uri:
#   kid=8ff13a6fcdabf306712e58f35668a04eb5a5fae1  alg=RS256
#   kid=d6a0e659c3392d9e592a4b0ad88e7b2b88076909  alg=RS256
#   kid=943a3a5d7d919625a454e489b75c29adab57acba  alg=RS256
#   kid=f10f87405a979c1df36df26606734f33cd85c271  alg=RS256
# Bon khoa, moi khoa mot kid — chinh la cach xoay vong o Bai 4.4.</div>

<h3>OAuth 2.1, và những luồng nay đã CHẾT</h3>
<div class="callout warn">
<p><strong>Một nửa số bài hướng dẫn OAuth trên Internet đang dạy những luồng mà hướng dẫn hiện hành đã GỠ BỎ, và chúng vẫn có vẻ chạy được.</strong> OAuth 2.1 gom mười lăm năm đính chính vào một tài liệu, và hệ quả thực tế là một danh sách ngắn những thứ bị xoá. <strong>Luồng implicit</strong> — <code>response_type=token</code>, trả access token ngay trong phần fragment của URL — đã hết: token rơi vào lịch sử trình duyệt, vào <code>Referer</code>, và vào mọi đoạn script trên trang. <strong>Trao mật khẩu của chủ tài nguyên</strong> — ứng dụng thu mật khẩu nhà cung cấp của người dùng rồi đem đổi — đã hết, vì nó đưa lại đúng cái vấn đề mà OAuth sinh ra để dẹp, và vì nó không đỡ nổi MFA hay passkey. <strong>PKCE nay BẮT BUỘC cho MỌI client</strong>, không riêng ứng dụng di động. <strong>Redirect URI phải khớp CHÍNH XÁC</strong>, không ký tự đại diện, không khớp theo tiền tố (Bài 8.3). Nếu một bài hướng dẫn bảo bạn dùng <code>response_type=token</code> hay POST một cái mật khẩu tới endpoint token thì nó đang mô tả năm 2012.</p>
</div>
<div class="note-ct">
<p><strong>Hãy đọc chương này với tư cách một CLIENT, và giữ nguyên tư cách đó.</strong> Mọi thứ ở đây viết cho cái ứng dụng có nút "đăng nhập bằng Google" — bên đi chuyển hướng, đi kiểm chứng và đi nối tài khoản. Làm một <em>máy chủ uỷ quyền</em> lại là một công việc khác hẳn và lớn hơn nhiều: màn hình đồng ý, đăng ký client, nội soi token, xoay vòng khoá, và một bề mặt đặc tả thật sự thù địch với việc ứng biến. Nếu bạn thấy mình đang dựng một cái cho nội bộ thì hãy dùng một bản cài sẵn có — Keycloak, Ory, Auth0, Authentik — rồi dồn công sức tiết kiệm được sang Chương 9 và Chương 11. Số đội đã tự viết một máy chủ uỷ quyền rồi về sau thấy mừng vì điều đó là RẤT ÍT.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6749" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">RFC 6749 — khung OAuth 2.0</span><span class="lc-sub">datatracker.ietf.org · Bản gốc, ít nhất nên đọc §1 và §4</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1" target="_blank" rel="noopener"><span class="lc-ico">🆕</span><span class="lc-body"><span class="lc-title">OAuth 2.1</span><span class="lc-sub">datatracker.ietf.org · Bản gom lại, kể cả mọi thứ nó gỡ bỏ</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html" target="_blank" rel="noopener"><span class="lc-ico">🆔</span><span class="lc-body"><span class="lc-title">OpenID Connect Core 1.0</span><span class="lc-sub">openid.net · Lớp danh tính, và một ID token bắt buộc phải chứa gì</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Web</span><span class="lc-sub">Chuyển hướng, chuỗi truy vấn và fragment — phần đường ống mà mọi luồng ở đây chạy trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Trình ra một access token đúc cho client khác và nhìn một trang đăng nhập ngây thơ chấp nhận nó</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — The authorization code flow with PKCE, step by step|||8.2 — Luồng authorization code kèm PKCE, từng bước một',
      slug: 'auth-8-2-luong-code-pkce',
      type: 'LESSON',
      description: 'Một luồng, tám bước, và mỗi bước có một lý do. Bài này chạy nó bằng số THẬT — code_verifier và code_challenge sinh tại chỗ — rồi chỉ ra chính xác cú tấn công mà PKCE chặn, vì sao nay nó bắt buộc cả với backend giữ được bí mật, và vì sao mã uỷ quyền phải dùng đúng một lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>The authorization code flow with PKCE, step by step</h2>
<p class="lead">One flow now covers every case — web app, mobile app, single-page app, backend service. That was not true for most of OAuth's history, and the consolidation happened because every alternative turned out to leak the token somewhere. Learn these eight steps and you have learned OAuth as it is deployed today.</p>

<h3>The eight steps</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Prepare</span><span class="lz-t">Your server, before any redirect</span><span class="lz-d">Generate a <code>code_verifier</code> (random), derive the <code>code_challenge</code> from it, and generate <code>state</code> and <code>nonce</code>. Store all four server-side against the session — never in a cookie the page can read.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Redirect</span><span class="lz-t">Browser goes to the provider</span><span class="lz-d">A plain <code>302</code> to the authorization endpoint carrying <code>client_id</code>, <code>redirect_uri</code>, <code>scope</code>, <code>state</code>, <code>nonce</code> and the challenge. Nothing secret travels here — everything in this URL is visible to the user.</span></div>
  <div class="lz-step"><span class="lz-k">3 · The user authenticates</span><span class="lz-t">At the provider, not at you</span><span class="lz-d">Password, passkey, MFA, whatever they have configured. Your application never sees any of it, which is the entire point of the protocol.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Consent</span><span class="lz-t">Only for what you asked</span><span class="lz-d">The provider lists your requested scopes. Ask for the minimum — a consent screen demanding contacts and calendar access for a login button is where users abandon.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Redirect back</span><span class="lz-t">With a code, not a token</span><span class="lz-d">The browser returns to your <code>redirect_uri</code> with <code>?code=…&amp;state=…</code>. The code is short-lived, single use, and useless on its own — that is what makes putting it in a URL acceptable.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Check state</span><span class="lz-t">Before doing anything else</span><span class="lz-d">Compare the returned <code>state</code> against the one stored in step 1 and delete it. A mismatch means this callback did not come from a flow you started (Lesson 8.3).</span></div>
  <div class="lz-step"><span class="lz-k">7 · Exchange</span><span class="lz-t">Back channel, server to server</span><span class="lz-d">Your server posts the code plus the original <code>code_verifier</code> to the token endpoint. This request never touches the browser, and its response carries the tokens.</span></div>
  <div class="lz-step"><span class="lz-k">8 · Verify and log in</span><span class="lz-t">Your rules from here</span><span class="lz-d">Validate the <code>id_token</code> (Lesson 8.4), find or create the account, then issue <em>your own</em> session — the cookie from Chapter 3 or the token pair from Chapter 5. The provider's tokens are not your session.</span></div>
</div>

<h3>PKCE, with real numbers</h3>
<pre><code>const verifier  = randomBytes(32).toString('base64url');                    <span class="tok-comment">// bí mật, GIỮ LẠI</span>
const challenge = createHash('sha256').update(verifier).digest('base64url'); <span class="tok-comment">// công khai, GỬI ĐI</span>

await redis.set(&#96;oauth:\${req.phienId}&#96;, JSON.stringify({ verifier, state, nonce }), { EX: 600 });</code></pre>
<div class="out">code_verifier         : Vc0FZ5zeusRqMY_oUBI1_SoYEk5k5vbJ7bQRzfCnp50
  do dai              : 43 ky tu (chuan doi 43-128)
code_challenge        : coi0bg884uyP36FyBO_ZqDG1bbN8aqWYsYPsv0T-2jQ
code_challenge_method : S256

Kiem lai o may chu uy quyen: sha256(verifier) === challenge ? true
Voi mot verifier khac      : false

state : BzuHDh0OxTWWNSVWIEM8nQ  (chong CSRF o duong quay ve)
nonce : ijJ9VAWAMw37WJxPeMV4Fw  (chong phat lai ID token)</div>
<pre><code>https://accounts.google.com/o/oauth2/v2/auth?client_id=1234.apps.googleusercontent.com
     &amp;redirect_uri=https%3A%2F%2Fcuongthai.com%2Foauth%2Fgoogle%2Fquay-ve
     &amp;response_type=code
     &amp;scope=openid+email+profile
     &amp;state=BzuHDh0OxTWWNSVWIEM8nQ
     &amp;nonce=ijJ9VAWAMw37WJxPeMV4Fw
     &amp;code_challenge=coi0bg884uyP36FyBO_ZqDG1bbN8aqWYsYPsv0T-2jQ
     &amp;code_challenge_method=S256</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The attack it stops</span><span class="v">Interception of the authorization code. On mobile, a malicious app registering the same custom URL scheme receives the callback; on the web, the code leaks through a <code>Referer</code>, a proxy log or browser history. Without PKCE, whoever holds the code can exchange it. With PKCE, they also need the verifier, which never left your server.</span></div>
  <div class="kv"><span class="k">Why it now applies to confidential clients too</span><span class="v">A backend with a client secret was considered safe, so PKCE was originally for mobile only. Then came code injection: an attacker gets a victim's browser to deliver <em>the attacker's</em> code to your callback, and the flow completes with the wrong account. PKCE binds the code to the flow that requested it, and OAuth 2.1 requires it everywhere.</span></div>
  <div class="kv"><span class="k">S256, never plain</span><span class="v"><code>code_challenge_method=plain</code> sends the verifier itself as the challenge, which defeats the whole mechanism — anyone who sees the authorization request can replay it. Some providers still accept <code>plain</code>; never send it.</span></div>
  <div class="kv"><span class="k">The verifier lives server-side, keyed by session</span><span class="v">Same rule as the WebAuthn challenge in Lesson 7.5, for the same reason. A verifier stored in <code>sessionStorage</code> is readable by any script on the page, and one round-tripped through a URL is not a secret at all.</span></div>
</div>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Front channel</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Steps 2 and 5, through the browser</span><span class="lz-nsub">Authorization request out, code back · everything here is public by construction</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Back channel</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Step 7, server to server</span><span class="lz-nsub">Code + verifier + client secret out, tokens back · the browser never sees it</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">What binds them</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The verifier, held server-side</span><span class="lz-nsub">A stolen code from the front channel is useless without the value that never travelled</span></div></div>
  </div>
</div>
<h3>The exchange, and what comes back</h3>
<pre><code>const r = await fetch(TOKEN_ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: String(req.query.code),
    redirect_uri: REDIRECT_URI,          <span class="tok-comment">// PHẢI giống hệt bước 2</span>
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,        <span class="tok-comment">// backend mới có; SPA thuần thì không</span>
    code_verifier: luu.verifier,         <span class="tok-comment">// ← bản gốc, chưa băm</span>
  }),
});
const { access_token, id_token, refresh_token, expires_in } = await r.json();</code></pre>
<div class="out">HTTP/1.1 200 OK
{
  "access_token":  "ya29.a0AfB_by…",        &lt;- goi API cua Google. KHONG phai danh tinh.
  "expires_in":    3599,
  "refresh_token": "1//09xY…",              &lt;- chi co khi xin access_type=offline
  "scope":         "openid email profile",
  "token_type":    "Bearer",
  "id_token":      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhmZjEzYTZmY2Rh…"
}

# id_token la thu ban CAN de dang nhap nguoi dung. Bai 8.4 mo no ra.
# access_token la thu ban can neu — va CHI neu — ban se goi API cua ho.</div>
<div class="pitfall">
<p><strong>Bẫy — the authorization code is single use, and a double exchange looks exactly like an attack.</strong> Providers invalidate a code the moment it is redeemed, and some revoke the entire grant on a second attempt — the same reuse-detection logic as Lesson 5.2. The common cause is not an attacker: it is a callback handler that runs twice because the user refreshed the page, a link prefetcher hit the URL, or a client-side router mounted the component twice in development. Redirect away from the callback URL immediately after handling it, make the handler idempotent for a session that is already authenticated, and never retry a failed exchange with the same code.</p>
</div>

<h3>The three parties, and who learns what</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The browser sees the front channel only</span><span class="lz-lnote">It carries the authorization request and the code back. Everything in those URLs is public by construction — no secret is ever meant to survive a trip through the address bar, which is why the implicit flow was removed.</span></div>
  <div class="lz-layer"><span class="lz-lname">Your server owns the back channel</span><span class="lz-lnote">The exchange, the client secret and the verifier all live here. If your architecture is a single-page app, the exchange still belongs on a small backend of yours — a public client that ships no secret works, but it also means anyone can impersonate your client id.</span></div>
  <div class="lz-layer"><span class="lz-lname">The provider learns which app you used and when</span><span class="lz-lnote">Worth saying out loud to your users: signing in with Google tells Google they visited your product. For some audiences that is a reason to offer an email option alongside, and for some products it is a reason not to offer social login at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">You are not obliged to keep their tokens</span><span class="lz-lnote">If you only wanted identity, verify the <code>id_token</code>, create your session, and discard the access and refresh tokens. Storing credentials you never call is pure liability — Chapter 11's rule applied early.</span></div>
</div>
<div class="note-ct">
<p><strong>Use a certified library for this, and read this lesson anyway.</strong> <code>openid-client</code> for Node, or your framework's provider integration, handles discovery, the exchange, clock skew and the dozen small validations that make the difference between working and secure. What it cannot do is tell you where the verifier lives, whether your callback runs twice, or what happens after step 8 — and step 8 is where you stop following a specification and start making decisions about your own accounts, which is Lesson 8.5.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7636" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">RFC 7636 — PKCE</span><span class="lc-sub">datatracker.ietf.org · The mechanism, and the attack it was written for</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">RFC 9700 — OAuth 2.0 security best current practice</span><span class="lc-sub">datatracker.ietf.org · Why PKCE became universal, including code injection</span></span></a>
<a class="link-card" href="https://github.com/panva/openid-client" target="_blank" rel="noopener"><span class="lc-ico">🧰</span><span class="lc-body"><span class="lc-title">openid-client</span><span class="lc-sub">github.com · A certified OpenID Connect client for Node.js</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Server-to-server fetch, form encoding, and handling a redirect callback</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Run the eight steps against a local provider, then steal the code and try to exchange it without the verifier</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Luồng authorization code kèm PKCE, từng bước một</h2>
<p class="lead">Nay chỉ MỘT luồng phủ mọi trường hợp — ứng dụng web, ứng dụng di động, ứng dụng một trang, dịch vụ backend. Suốt phần lớn lịch sử OAuth thì không phải vậy, và việc gom lại xảy ra vì mọi phương án thay thế hoá ra đều làm rò rỉ token ở đâu đó. Học tám bước này là bạn đã học xong OAuth như nó đang được triển khai hôm nay.</p>

<h3>Tám bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Chuẩn bị</span><span class="lz-t">Ở máy chủ của bạn, trước mọi cú chuyển hướng</span><span class="lz-d">Sinh một <code>code_verifier</code> (ngẫu nhiên), suy ra <code>code_challenge</code> từ nó, rồi sinh <code>state</code> và <code>nonce</code>. Lưu cả bốn ở phía máy chủ, gắn với phiên — đừng bao giờ để trong một cookie mà trang đọc được.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Chuyển hướng</span><span class="lz-t">Trình duyệt đi tới nhà cung cấp</span><span class="lz-d">Một cú <code>302</code> thường tới endpoint uỷ quyền, mang theo <code>client_id</code>, <code>redirect_uri</code>, <code>scope</code>, <code>state</code>, <code>nonce</code> và cái challenge. Không có gì bí mật đi qua đây cả — mọi thứ trong URL này người dùng đều nhìn thấy.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Người dùng xác thực</span><span class="lz-t">Ở nhà cung cấp, không phải ở bạn</span><span class="lz-d">Mật khẩu, passkey, MFA, bất cứ thứ gì họ đã cấu hình. Ứng dụng của bạn không nhìn thấy thứ nào trong số đó, và đó chính là toàn bộ ý nghĩa của giao thức này.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Đồng ý</span><span class="lz-t">Chỉ cho đúng thứ bạn đã xin</span><span class="lz-d">Nhà cung cấp liệt kê các phạm vi bạn yêu cầu. Hãy xin TỐI THIỂU — một màn hình đồng ý đòi quyền đọc danh bạ và lịch chỉ để có một cái nút đăng nhập chính là chỗ người dùng bỏ đi.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Chuyển hướng ngược về</span><span class="lz-t">Kèm một MÃ, không phải một token</span><span class="lz-d">Trình duyệt quay về <code>redirect_uri</code> của bạn với <code>?code=…&amp;state=…</code>. Cái mã ấy ngắn hạn, dùng một lần, và vô dụng khi đứng một mình — đó là điều làm cho việc đặt nó trong một URL trở nên chấp nhận được.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Kiểm state</span><span class="lz-t">Trước khi làm bất cứ việc gì khác</span><span class="lz-d">So <code>state</code> trả về với cái đã lưu ở bước 1 rồi xoá nó đi. Lệch nhau nghĩa là cú gọi lại này KHÔNG đến từ một luồng do bạn khởi động (Bài 8.3).</span></div>
  <div class="lz-step"><span class="lz-k">7 · Đổi mã</span><span class="lz-t">Kênh sau, máy chủ nói với máy chủ</span><span class="lz-d">Máy chủ của bạn POST cái mã cộng với <code>code_verifier</code> gốc tới endpoint token. Request này không bao giờ chạm tới trình duyệt, và phản hồi của nó mang theo các token.</span></div>
  <div class="lz-step"><span class="lz-k">8 · Kiểm chứng và đăng nhập</span><span class="lz-t">Từ đây là luật của BẠN</span><span class="lz-d">Kiểm chứng <code>id_token</code> (Bài 8.4), tìm hoặc tạo tài khoản, rồi phát <em>phiên của chính bạn</em> — cookie ở Chương 3 hoặc cặp token ở Chương 5. Token của nhà cung cấp KHÔNG phải phiên của bạn.</span></div>
</div>

<h3>PKCE, bằng số thật</h3>
<pre><code>const verifier  = randomBytes(32).toString('base64url');                    <span class="tok-comment">// bí mật, GIỮ LẠI</span>
const challenge = createHash('sha256').update(verifier).digest('base64url'); <span class="tok-comment">// công khai, GỬI ĐI</span>

await redis.set(&#96;oauth:\${req.phienId}&#96;, JSON.stringify({ verifier, state, nonce }), { EX: 600 });</code></pre>
<div class="out">code_verifier         : Vc0FZ5zeusRqMY_oUBI1_SoYEk5k5vbJ7bQRzfCnp50
  do dai              : 43 ky tu (chuan doi 43-128)
code_challenge        : coi0bg884uyP36FyBO_ZqDG1bbN8aqWYsYPsv0T-2jQ
code_challenge_method : S256

Kiem lai o may chu uy quyen: sha256(verifier) === challenge ? true
Voi mot verifier khac      : false

state : BzuHDh0OxTWWNSVWIEM8nQ  (chong CSRF o duong quay ve)
nonce : ijJ9VAWAMw37WJxPeMV4Fw  (chong phat lai ID token)</div>
<pre><code>https://accounts.google.com/o/oauth2/v2/auth?client_id=1234.apps.googleusercontent.com
     &amp;redirect_uri=https%3A%2F%2Fcuongthai.com%2Foauth%2Fgoogle%2Fquay-ve
     &amp;response_type=code
     &amp;scope=openid+email+profile
     &amp;state=BzuHDh0OxTWWNSVWIEM8nQ
     &amp;nonce=ijJ9VAWAMw37WJxPeMV4Fw
     &amp;code_challenge=coi0bg884uyP36FyBO_ZqDG1bbN8aqWYsYPsv0T-2jQ
     &amp;code_challenge_method=S256</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Cú tấn công mà nó chặn</span><span class="v">Chặn bắt mã uỷ quyền. Trên di động, một ứng dụng độc hại đăng ký cùng một lược đồ URL tuỳ biến sẽ nhận được cú gọi lại; trên web, cái mã rò qua một <code>Referer</code>, một dòng log proxy hay lịch sử trình duyệt. Không có PKCE thì ai cầm cái mã cũng đổi được nó. Có PKCE thì họ còn cần cả cái verifier, thứ chưa bao giờ rời khỏi máy chủ của bạn.</span></div>
  <div class="kv"><span class="k">Vì sao nay nó áp cả cho client giữ được bí mật</span><span class="v">Một backend có client secret vốn được coi là an toàn, nên ban đầu PKCE chỉ dành cho di động. Rồi tới cú TIÊM MÃ: kẻ tấn công khiến trình duyệt của nạn nhân giao <em>cái mã của kẻ tấn công</em> vào endpoint gọi lại của bạn, và luồng hoàn tất với NHẦM tài khoản. PKCE buộc cái mã vào đúng cái luồng đã yêu cầu nó, và OAuth 2.1 bắt buộc nó ở khắp nơi.</span></div>
  <div class="kv"><span class="k">S256, đừng bao giờ plain</span><span class="v"><code>code_challenge_method=plain</code> gửi thẳng cái verifier làm challenge, tức là phá sạch cơ chế — ai nhìn thấy request uỷ quyền cũng phát lại được. Vài nhà cung cấp vẫn chấp nhận <code>plain</code>; đừng bao giờ gửi nó.</span></div>
  <div class="kv"><span class="k">Verifier sống ở phía máy chủ, lấy phiên làm khoá</span><span class="v">Cùng luật với thử thách WebAuthn ở Bài 7.5, và cùng lý do. Một verifier để trong <code>sessionStorage</code> thì mọi script trên trang đọc được, còn một cái đi vòng qua URL thì hoàn toàn không còn là bí mật.</span></div>
</div>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Kênh trước</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bước 2 và 5, đi qua trình duyệt</span><span class="lz-nsub">Request uỷ quyền đi ra, cái mã đi về · mọi thứ ở đây là công khai theo thiết kế</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Kênh sau</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bước 7, máy chủ nói với máy chủ</span><span class="lz-nsub">Mã + verifier + client secret đi ra, token đi về · trình duyệt không bao giờ thấy</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cái buộc chúng lại</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Verifier, giữ ở phía máy chủ</span><span class="lz-nsub">Một cái mã bị cắp từ kênh trước là vô dụng nếu thiếu cái giá trị chưa bao giờ đi đâu cả</span></div></div>
  </div>
</div>
<h3>Cú đổi mã, và cái trả về</h3>
<pre><code>const r = await fetch(TOKEN_ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: String(req.query.code),
    redirect_uri: REDIRECT_URI,          <span class="tok-comment">// PHẢI giống hệt bước 2</span>
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,        <span class="tok-comment">// backend mới có; SPA thuần thì không</span>
    code_verifier: luu.verifier,         <span class="tok-comment">// ← bản gốc, chưa băm</span>
  }),
});
const { access_token, id_token, refresh_token, expires_in } = await r.json();</code></pre>
<div class="out">HTTP/1.1 200 OK
{
  "access_token":  "ya29.a0AfB_by…",        &lt;- goi API cua Google. KHONG phai danh tinh.
  "expires_in":    3599,
  "refresh_token": "1//09xY…",              &lt;- chi co khi xin access_type=offline
  "scope":         "openid email profile",
  "token_type":    "Bearer",
  "id_token":      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhmZjEzYTZmY2Rh…"
}

# id_token la thu ban CAN de dang nhap nguoi dung. Bai 8.4 mo no ra.
# access_token la thu ban can neu — va CHI neu — ban se goi API cua ho.</div>
<div class="pitfall">
<p><strong>Bẫy — mã uỷ quyền dùng ĐÚNG MỘT lần, và đổi hai lần thì trông y hệt một cú tấn công.</strong> Nhà cung cấp vô hiệu hoá cái mã ngay khoảnh khắc nó được đổi, và vài nơi còn thu hồi cả cái grant khi có lần thử thứ hai — đúng logic phát hiện tái dùng ở Bài 5.2. Nguyên nhân thường gặp KHÔNG phải kẻ tấn công: đó là một bộ xử lý callback chạy hai lần vì người dùng bấm tải lại trang, vì một bộ tải trước đường dẫn đã đập vào URL, hoặc vì một router phía client gắn component hai lần trong chế độ phát triển. Hãy chuyển hướng khỏi URL callback NGAY sau khi xử lý xong, làm cho bộ xử lý bất biến khi lặp với một phiên vốn đã xác thực, và đừng bao giờ thử lại một cú đổi mã đã hỏng bằng CÙNG một cái mã.</p>
</div>

<h3>Ba bên, và ai biết được gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trình duyệt chỉ thấy KÊNH TRƯỚC</span><span class="lz-lnote">Nó chở request uỷ quyền đi và chở cái mã về. Mọi thứ trong những URL đó là công khai theo thiết kế — không bí mật nào được trông đợi sống sót qua một chuyến đi trên thanh địa chỉ, và đó là lý do luồng implicit bị gỡ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Máy chủ của bạn làm chủ KÊNH SAU</span><span class="lz-lnote">Cú đổi mã, client secret và verifier đều sống ở đây. Nếu kiến trúc của bạn là một ứng dụng một trang thì cú đổi mã vẫn thuộc về một cái backend nhỏ của bạn — một client công khai không mang bí mật thì vẫn chạy được, nhưng cũng nghĩa là ai cũng có thể mạo danh client id của bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhà cung cấp biết bạn dùng ứng dụng nào và lúc nào</span><span class="lz-lnote">Đáng nói thẳng với người dùng: đăng nhập bằng Google là nói cho Google biết họ đã ghé sản phẩm của bạn. Với vài nhóm người dùng, đó là lý do nên có thêm phương án dùng email; với vài sản phẩm, đó là lý do không nên có đăng nhập mạng xã hội chút nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bạn KHÔNG bắt buộc phải giữ token của họ</span><span class="lz-lnote">Nếu bạn chỉ cần danh tính thì hãy kiểm chứng <code>id_token</code>, tạo phiên của mình, rồi VỨT access token và refresh token đi. Lưu những tín vật mà bạn chẳng bao giờ gọi tới là gánh nợ thuần tuý — luật của Chương 11, áp sớm.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy dùng một thư viện đã được chứng nhận cho việc này, và vẫn cứ đọc bài này.</strong> <code>openid-client</code> cho Node, hoặc phần tích hợp nhà cung cấp sẵn có của framework bạn dùng, sẽ lo phần discovery, cú đổi mã, độ lệch đồng hồ và cả chục phép kiểm nhỏ tạo nên khác biệt giữa "chạy được" và "an toàn". Cái nó KHÔNG làm được là nói cho bạn biết verifier sống ở đâu, callback của bạn có chạy hai lần không, và chuyện gì xảy ra SAU bước 8 — mà bước 8 chính là chỗ bạn thôi đi theo một bản đặc tả và bắt đầu ra quyết định về tài khoản của chính mình, tức là Bài 8.5.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7636" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">RFC 7636 — PKCE</span><span class="lc-sub">datatracker.ietf.org · Cơ chế, và cú tấn công mà nó được viết ra để chặn</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">RFC 9700 — thực hành bảo mật OAuth 2.0 hiện hành</span><span class="lc-sub">datatracker.ietf.org · Vì sao PKCE thành bắt buộc khắp nơi, kể cả chuyện tiêm mã</span></span></a>
<a class="link-card" href="https://github.com/panva/openid-client" target="_blank" rel="noopener"><span class="lc-ico">🧰</span><span class="lc-body"><span class="lc-title">openid-client</span><span class="lc-sub">github.com · Một client OpenID Connect đã được chứng nhận, cho Node.js</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">fetch máy-chủ-tới-máy-chủ, mã hoá biểu mẫu, và xử lý một cú gọi lại chuyển hướng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chạy đủ tám bước với một nhà cung cấp cục bộ, rồi cắp cái mã và thử đổi nó khi không có verifier</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — state, nonce and redirect_uri: three parameters, three attacks|||8.3 — state, nonce và redirect_uri: ba tham số, ba cú tấn công',
      slug: 'auth-8-3-state-nonce-redirect',
      type: 'LESSON',
      description: 'Ba tham số mà ai cũng sao chép mà không hiểu, và mỗi cái chặn một cú tấn công khác nhau: state chặn CSRF ở đường quay về (thứ nối tài khoản Google của KẺ TẤN CÔNG vào phiên của nạn nhân), nonce chặn phát lại ID token, còn khớp chính xác redirect_uri chặn cả một họ. Kèm output thật cho thấy vì sao khớp theo TIỀN TỐ luôn thua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>state, nonce and redirect_uri: three parameters, three attacks</h2>
<p class="lead">These three appear in every OAuth example and almost every explanation lumps them together as "security parameters". They are not interchangeable: each one closes a specific attack, and a flow can have two of them perfect while the third is wide open. Learn which is which and you can audit any integration in five minutes.</p>

<h3>state — CSRF on the callback, which is worse than it sounds</h3>
<pre><code><span class="tok-comment">// Kẻ tấn công tự chạy luồng bằng tài khoản Google CỦA HẮN,</span>
<span class="tok-comment">// dừng lại ở bước 5, và giữ lại cái mã chưa dùng.</span>

<span class="tok-comment">// Rồi khiến trình duyệt của nạn nhân đi tới:</span>
GET https://cuongthai.com/oauth/quay-ve?code=&lt;MA-CUA-KE-TAN-CONG&gt;

<span class="tok-comment">// Máy chủ của bạn đổi mã, thấy tài khoản Google của kẻ tấn công,</span>
<span class="tok-comment">// và NỐI nó vào phiên đang đăng nhập của nạn nhân.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">What the attacker gains</span><span class="v">Not the victim's account — the reverse. From now on the victim is working inside an account the attacker also controls: uploaded files, saved payment details, private notes, all readable by whoever else can sign in with that Google account. It is a takeover pointing the other way, and it is easy to miss because nothing looks broken to the victim.</span></div>
  <div class="kv"><span class="k">The fix, in three lines</span><span class="v">Generate <code>state</code> as random bytes, store it server-side against the session before redirecting, and on the callback compare it and delete it. A callback with a missing or mismatched <code>state</code> is rejected before the code is exchanged — before anything is spent.</span></div>
  <div class="kv"><span class="k">It must be bound to the session, not just remembered</span><span class="v">A <code>state</code> kept in a global cache and checked for mere existence is no defence: the attacker's own flow put it there. It has to be tied to <em>this browser's</em> session, so a value created in the attacker's browser cannot validate in the victim's.</span></div>
  <div class="kv"><span class="k">It is also where you carry the return path</span><span class="v">Users start OAuth from somewhere and expect to come back there. Store the intended destination server-side alongside the state — never encode it into the <code>state</code> value itself, and never take a redirect target from the callback query string.</span></div>
</div>

<h3>nonce — replay of an ID token</h3>
<pre><code><span class="tok-comment">// nonce đi TRONG request uỷ quyền, và quay về BÊN TRONG id_token đã ký.</span>
{
  "iss": "https://accounts.google.com",
  "aud": "1234.apps.googleusercontent.com",
  "sub": "108772…",
  "nonce": "ijJ9VAWAMw37WJxPeMV4Fw",     <span class="tok-comment">// ← phải khớp cái bạn đã lưu</span>
  "email": "cuong@cuongthai.com",
  "email_verified": true,
  "iat": 1756000000, "exp": 1756003600
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">What it stops</span><span class="lz-t">A previously issued ID token, replayed</span><span class="lz-d">An <code>id_token</code> is a valid signed JWT for its whole lifetime. Anywhere one leaks — a log, a mobile app's storage, a proxy — it can be presented again. The nonce ties it to one flow that you started.</span></div>
  <div class="lz-step"><span class="lz-k">Why state does not cover it</span><span class="lz-t">Different halves of the exchange</span><span class="lz-d">The <code>state</code> protects the front-channel callback; the nonce protects the token itself, which arrives on the back channel and can be replayed into a completely different request.</span></div>
  <div class="lz-step"><span class="lz-k">Same storage rules</span><span class="lz-t">Server-side, session-bound, single use</span><span class="lz-d">Generate it in step 1 next to the verifier and the state, keep all three together, and delete the record after the exchange. One record, one flow.</span></div>
  <div class="lz-step"><span class="lz-k">Required for OIDC, ignored by plain OAuth</span><span class="lz-t">If you get an ID token, check it</span><span class="lz-d">Providers only return the claim if you sent the parameter, and a missing <code>nonce</code> claim in a token you expected one in is itself a failure — do not treat absent as acceptable.</span></div>
</div>

<h3>redirect_uri — why prefix matching always loses</h3>
<div class="out">DANG KY: https://cuongthai.com/oauth/quay-ve

chuoi thu                                               tienTo  khopHet  host that
https://cuongthai.com/oauth/quay-ve                       CHO    CHO     cuongthai.com
https://cuongthai.com/oauth/quay-ve/../../ra-ngoai        CHO    chan    cuongthai.com
https://cuongthai.com/oauth/quay-ve?next=https://ke-...   CHO    chan    cuongthai.com
https://cuongthai.com.ke-tan-cong.com/oauth/quay-ve       chan   chan    cuongthai.com.ke-tan-cong.com
https://cuongthai.com@ke-tan-cong.com/oauth/quay-ve       chan   chan    ke-tan-cong.com
https://cuongthai.com:@ke-tan-cong.com/oauth/quay-ve      chan   chan    ke-tan-cong.com
https://cuongthai.com/oauth/quay-ve#@ke-tan-cong.com      CHO    chan    cuongthai.com

# Cot "host that" la ket qua cua new URL(). Hai dong giua: chuoi BAT DAU bang
# ten mien cua ban, ma host that lai la ke-tan-cong.com — vi @ tach phan
# thong tin dang nhap ra khoi phan may chu. Khop CHINH XAC chan sach ca bay.</div>
<div class="pitfall">
<p><strong>Bẫy — every clever matching rule has a bypass, and the bypasses are already written down.</strong> Prefix matching lets an attacker append a path or a fragment. Wildcard subdomains (<code>https://*.cuongthai.com/cb</code>) become a full compromise the day one subdomain is taken over — a stale CNAME pointing at an unclaimed cloud bucket is enough. Substring checks fall to <code>cuongthai.com.attacker.com</code>. Host checks written by hand fall to the userinfo trick above, where <code>@</code> ends the credentials portion and everything before it is decoration. OAuth 2.1 settles it: the <code>redirect_uri</code> must match a registered value <em>exactly</em>, byte for byte, with no normalisation and no pattern. Register one URI per environment, and if you need a return path, keep it server-side with the <code>state</code>.</p>
</div>
<pre><code><span class="tok-comment">// Ngay cả khớp CHÍNH XÁC vẫn thua nếu ĐÍCH của bạn tự chuyển hướng đi tiếp.</span>
GET /oauth/quay-ve?code=…&amp;state=…
→ 302 /bang-dieu-khien?next=https://ke-tan-cong.com   <span class="tok-comment">// ← chuyển hướng mở</span>
→ 302 https://ke-tan-cong.com                          <span class="tok-comment">// mã đi theo trong Referer</span>

<span class="tok-comment">// Vá: mọi đích chuyển hướng phải nằm trong DANH SÁCH TRẮNG đường dẫn nội bộ.</span>
const DICH_HOP_LE = new Set(['/bang-dieu-khien', '/ho-so', '/']);
const dich = DICH_HOP_LE.has(luu.dich) ? luu.dich : '/';</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">An open redirect anywhere on your domain is an OAuth vulnerability</span><span class="lz-lnote">The registered URI is honoured, your own server then forwards the browser outward, and the code travels in the <code>Referer</code>. Audit every <code>next</code>, <code>return_to</code> and <code>continue</code> parameter in the product, not only the ones near the login code.</span></div>
  <div class="lz-layer"><span class="lz-lname">Register a separate client per environment</span><span class="lz-lnote">Development, staging and production each get their own client id and their own single redirect URI. Adding <code>http://localhost:3000/cb</code> to the production client means anybody running a local server on that port can complete a production flow.</span></div>
  <div class="lz-layer"><span class="lz-lname">Send redirect_uri again at the exchange</span><span class="lz-lnote">The token endpoint compares it with the one from the authorization request. It is one more binding that costs nothing, and providers reject the exchange when it differs — a mismatch here is usually a configuration bug you want to hear about loudly.</span></div>
  <div class="lz-layer"><span class="lz-lname">Set Referrer-Policy on the callback route</span><span class="lz-lnote">Same reasoning as the reset link in Lesson 6.3: the URL carries a credential, so <code>no-referrer</code> keeps it from leaving with any asset request, and the code should be gone from the address bar as soon as it is spent.</span></div>
</div>
<div class="note-ct">
<p><strong>The five-minute audit.</strong> Open the integration and answer four questions in order. Is <code>state</code> generated per flow, stored against the session, compared, and deleted? Is <code>nonce</code> sent and then checked inside the ID token? Is the redirect URI a single exact registered string, with no wildcard? Does the page you land on forward the browser anywhere a query parameter tells it to? Three yeses and a no still leaves an exploitable flow — which is exactly why this lesson separates them rather than calling them "the security parameters".</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-insufficient-redirect-uri-v" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">RFC 9700 — insufficient redirect URI validation</span><span class="lc-sub">datatracker.ietf.org · The exact-match requirement, and the bypasses it closes</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/oauth" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — OAuth authentication vulnerabilities</span><span class="lc-sub">portswigger.net · Labs for the state and redirect_uri attacks above</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes" target="_blank" rel="noopener"><span class="lc-ico">🎲</span><span class="lc-body"><span class="lc-title">OIDC Core — implementation notes on nonce</span><span class="lc-sub">openid.net · What the nonce must be, and how long to keep it</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">CuongThai course — Web Foundations</span><span class="lc-sub">URL parsing, the userinfo component, and why humans read hostnames wrong</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Link your own provider account into someone else's session, then add state and watch it fail</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>state, nonce và redirect_uri: ba tham số, ba cú tấn công</h2>
<p class="lead">Ba cái này xuất hiện trong mọi ví dụ OAuth và gần như mọi lời giải thích đều gộp chúng lại thành "mấy tham số bảo mật". Chúng KHÔNG thay thế được cho nhau: mỗi cái bịt một cú tấn công cụ thể, và một cái luồng hoàn toàn có thể làm đúng hai cái trong khi cái thứ ba mở toang. Nắm được cái nào là cái nào thì bạn soát được bất kỳ tích hợp nào trong năm phút.</p>

<h3>state — CSRF ở đường quay về, tệ hơn cái tên của nó</h3>
<pre><code><span class="tok-comment">// Kẻ tấn công tự chạy luồng bằng tài khoản Google CỦA HẮN,</span>
<span class="tok-comment">// dừng lại ở bước 5, và giữ lại cái mã chưa dùng.</span>

<span class="tok-comment">// Rồi khiến trình duyệt của nạn nhân đi tới:</span>
GET https://cuongthai.com/oauth/quay-ve?code=&lt;MA-CUA-KE-TAN-CONG&gt;

<span class="tok-comment">// Máy chủ của bạn đổi mã, thấy tài khoản Google của kẻ tấn công,</span>
<span class="tok-comment">// và NỐI nó vào phiên đang đăng nhập của nạn nhân.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Kẻ tấn công được gì</span><span class="v">KHÔNG phải tài khoản của nạn nhân — mà ngược lại. Từ giờ nạn nhân làm việc BÊN TRONG một tài khoản mà kẻ tấn công cũng nắm: tệp tải lên, thông tin thanh toán đã lưu, ghi chú riêng tư, tất cả đều đọc được bởi bất kỳ ai đăng nhập được bằng cái tài khoản Google ấy. Đó là một cú chiếm tài khoản CHĨA THEO CHIỀU NGƯỢC LẠI, và rất dễ bỏ sót vì với nạn nhân thì mọi thứ trông chẳng có gì hỏng cả.</span></div>
  <div class="kv"><span class="k">Cách vá, ba dòng</span><span class="v">Sinh <code>state</code> là các byte ngẫu nhiên, lưu nó ở phía máy chủ gắn với phiên TRƯỚC khi chuyển hướng, rồi ở cú gọi lại thì so nó và xoá nó. Một cú gọi lại thiếu <code>state</code> hoặc lệch <code>state</code> bị từ chối TRƯỚC khi cái mã được đem đổi — trước khi tiêu bất cứ thứ gì.</span></div>
  <div class="kv"><span class="k">Nó phải BUỘC VÀO PHIÊN, không chỉ được ghi nhớ</span><span class="v">Một cái <code>state</code> để trong một bộ nhớ đệm dùng chung rồi chỉ kiểm xem "có tồn tại không" thì không phải hàng phòng thủ: chính luồng của kẻ tấn công đã đặt nó vào đó. Nó phải gắn vào phiên của <em>chính trình duyệt này</em>, để một giá trị sinh ra trong trình duyệt kẻ tấn công không hợp lệ hoá được ở trình duyệt nạn nhân.</span></div>
  <div class="kv"><span class="k">Nó cũng là chỗ mang theo đường quay lại</span><span class="v">Người dùng khởi động OAuth từ một chỗ nào đó và mong quay về đúng chỗ ấy. Hãy lưu cái đích dự định ở phía máy chủ, ĐI KÈM cái state — đừng bao giờ nhét nó vào bên trong giá trị <code>state</code>, và đừng bao giờ lấy đích chuyển hướng từ chuỗi truy vấn của cú gọi lại.</span></div>
</div>

<h3>nonce — phát lại một ID token</h3>
<pre><code><span class="tok-comment">// nonce đi TRONG request uỷ quyền, và quay về BÊN TRONG id_token đã ký.</span>
{
  "iss": "https://accounts.google.com",
  "aud": "1234.apps.googleusercontent.com",
  "sub": "108772…",
  "nonce": "ijJ9VAWAMw37WJxPeMV4Fw",     <span class="tok-comment">// ← phải khớp cái bạn đã lưu</span>
  "email": "cuong@cuongthai.com",
  "email_verified": true,
  "iat": 1756000000, "exp": 1756003600
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nó chặn cái gì</span><span class="lz-t">Một ID token đã phát trước đó, đem phát lại</span><span class="lz-d">Một <code>id_token</code> là một JWT đã ký HỢP LỆ suốt tuổi thọ của nó. Rò ra ở đâu — một dòng log, kho lưu trữ của một ứng dụng di động, một cái proxy — là nó trình lại được. Cái nonce buộc nó vào ĐÚNG MỘT luồng do bạn khởi động.</span></div>
  <div class="lz-step"><span class="lz-k">Vì sao state không phủ được nó</span><span class="lz-t">Hai nửa khác nhau của cuộc trao đổi</span><span class="lz-d"><code>state</code> bảo vệ cú gọi lại ở kênh trước; còn nonce bảo vệ chính cái token, thứ đến qua kênh sau và có thể bị phát lại vào một request hoàn toàn khác.</span></div>
  <div class="lz-step"><span class="lz-k">Cùng luật lưu trữ</span><span class="lz-t">Phía máy chủ, gắn phiên, dùng một lần</span><span class="lz-d">Hãy sinh nó ở bước 1 ngay cạnh verifier và state, giữ cả ba cùng chỗ, rồi xoá bản ghi sau khi đổi mã xong. Một bản ghi, một luồng.</span></div>
  <div class="lz-step"><span class="lz-k">Bắt buộc với OIDC, bị OAuth trần lờ đi</span><span class="lz-t">Nhận được ID token thì phải kiểm</span><span class="lz-d">Nhà cung cấp chỉ trả về claim đó nếu bạn có gửi tham số, và một claim <code>nonce</code> BỊ THIẾU trong một token mà bạn đang mong có nó thì tự nó đã là một thất bại — đừng coi "vắng mặt" là chấp nhận được.</span></div>
</div>

<h3>redirect_uri — vì sao khớp theo TIỀN TỐ luôn thua</h3>
<div class="out">DANG KY: https://cuongthai.com/oauth/quay-ve

chuoi thu                                               tienTo  khopHet  host that
https://cuongthai.com/oauth/quay-ve                       CHO    CHO     cuongthai.com
https://cuongthai.com/oauth/quay-ve/../../ra-ngoai        CHO    chan    cuongthai.com
https://cuongthai.com/oauth/quay-ve?next=https://ke-...   CHO    chan    cuongthai.com
https://cuongthai.com.ke-tan-cong.com/oauth/quay-ve       chan   chan    cuongthai.com.ke-tan-cong.com
https://cuongthai.com@ke-tan-cong.com/oauth/quay-ve       chan   chan    ke-tan-cong.com
https://cuongthai.com:@ke-tan-cong.com/oauth/quay-ve      chan   chan    ke-tan-cong.com
https://cuongthai.com/oauth/quay-ve#@ke-tan-cong.com      CHO    chan    cuongthai.com

# Cot "host that" la ket qua cua new URL(). Hai dong giua: chuoi BAT DAU bang
# ten mien cua ban, ma host that lai la ke-tan-cong.com — vi @ tach phan
# thong tin dang nhap ra khoi phan may chu. Khop CHINH XAC chan sach ca bay.</div>
<div class="pitfall">
<p><strong>Bẫy — mọi luật khớp "thông minh" đều có đường lách, và những đường lách đó ĐÃ ĐƯỢC VIẾT RA HẾT RỒI.</strong> Khớp theo tiền tố cho phép kẻ tấn công nối thêm một đoạn đường dẫn hay một fragment. Ký tự đại diện cho tên miền con (<code>https://*.cuongthai.com/cb</code>) trở thành một cú chiếm toàn diện đúng vào ngày MỘT tên miền con bị chiếm — một bản ghi CNAME cũ trỏ vào một cái bucket đám mây chưa ai nhận là đủ. Kiểm bằng chuỗi con thì thua <code>cuongthai.com.attacker.com</code>. Kiểm host viết tay thì thua đúng cái mẹo userinfo ở trên, nơi dấu <code>@</code> kết thúc phần thông tin đăng nhập và mọi thứ trước nó chỉ là trang trí. OAuth 2.1 chốt lại: <code>redirect_uri</code> phải khớp một giá trị đã đăng ký <em>CHÍNH XÁC</em>, từng byte một, không chuẩn hoá và không mẫu. Hãy đăng ký một URI cho mỗi môi trường, và nếu cần đường quay lại thì giữ nó ở phía máy chủ cùng với <code>state</code>.</p>
</div>
<pre><code><span class="tok-comment">// Ngay cả khớp CHÍNH XÁC vẫn thua nếu ĐÍCH của bạn tự chuyển hướng đi tiếp.</span>
GET /oauth/quay-ve?code=…&amp;state=…
→ 302 /bang-dieu-khien?next=https://ke-tan-cong.com   <span class="tok-comment">// ← chuyển hướng mở</span>
→ 302 https://ke-tan-cong.com                          <span class="tok-comment">// mã đi theo trong Referer</span>

<span class="tok-comment">// Vá: mọi đích chuyển hướng phải nằm trong DANH SÁCH TRẮNG đường dẫn nội bộ.</span>
const DICH_HOP_LE = new Set(['/bang-dieu-khien', '/ho-so', '/']);
const dich = DICH_HOP_LE.has(luu.dich) ? luu.dich : '/';</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một chuyển hướng mở BẤT KỲ ĐÂU trên tên miền của bạn là một lỗ hổng OAuth</span><span class="lz-lnote">Cái URI đã đăng ký được tôn trọng, rồi chính máy chủ của bạn đẩy trình duyệt ra ngoài, và cái mã đi theo trong <code>Referer</code>. Hãy soát MỌI tham số <code>next</code>, <code>return_to</code> và <code>continue</code> trong cả sản phẩm, không chỉ những cái nằm gần đoạn mã đăng nhập.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đăng ký một client RIÊNG cho mỗi môi trường</span><span class="lz-lnote">Phát triển, thử nghiệm và production, mỗi cái một client id riêng và một redirect URI duy nhất riêng. Thêm <code>http://localhost:3000/cb</code> vào client production nghĩa là bất kỳ ai chạy một máy chủ cục bộ trên cổng đó đều hoàn tất được một luồng production.</span></div>
  <div class="lz-layer"><span class="lz-lname">Gửi lại redirect_uri ở bước đổi mã</span><span class="lz-lnote">Endpoint token so nó với cái ở request uỷ quyền. Đó là thêm một mối buộc chẳng tốn gì, và nhà cung cấp sẽ từ chối cú đổi khi nó khác đi — một chỗ lệch ở đây thường là một lỗi cấu hình mà bạn MUỐN nghe thấy thật to.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đặt Referrer-Policy trên tuyến gọi lại</span><span class="lz-lnote">Cùng lý lẽ với đường dẫn đặt lại ở Bài 6.3: cái URL đang chở một tín vật, nên <code>no-referrer</code> giữ nó khỏi đi theo mỗi lời gọi tài nguyên, và cái mã nên biến mất khỏi thanh địa chỉ ngay khi vừa tiêu xong.</span></div>
</div>
<div class="note-ct">
<p><strong>Bài soát năm phút.</strong> Hãy mở phần tích hợp ra và trả lời bốn câu, theo thứ tự. <code>state</code> có được sinh riêng cho từng luồng, lưu gắn với phiên, đem so, rồi xoá không? <code>nonce</code> có được gửi đi rồi kiểm lại BÊN TRONG ID token không? Redirect URI có phải một chuỗi đã đăng ký duy nhất, khớp chính xác, không ký tự đại diện không? Cái trang bạn rơi vào có đẩy trình duyệt đi tới bất cứ đâu mà một tham số truy vấn bảo nó đi không? Ba câu "có" và một câu "không" vẫn để lại một cái luồng khai thác được — đó chính là lý do bài này TÁCH chúng ra thay vì gọi chung là "mấy tham số bảo mật".</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-insufficient-redirect-uri-v" target="_blank" rel="noopener"><span class="lc-ico">🎯</span><span class="lc-body"><span class="lc-title">RFC 9700 — kiểm redirect URI không đủ chặt</span><span class="lc-sub">datatracker.ietf.org · Yêu cầu khớp chính xác, và những đường lách nó bịt</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/oauth" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — lỗ hổng xác thực OAuth</span><span class="lc-sub">portswigger.net · Phòng lab cho đúng các cú tấn công state và redirect_uri ở trên</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes" target="_blank" rel="noopener"><span class="lc-ico">🎲</span><span class="lc-body"><span class="lc-title">OIDC Core — ghi chú cài đặt về nonce</span><span class="lc-sub">openid.net · Nonce phải là cái gì, và giữ nó bao lâu</span></span></a>
<a class="link-card" href="/courses/web-foundations/learn${REF}"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Nền tảng Web</span><span class="lc-sub">Phân tích URL, thành phần userinfo, và vì sao con người đọc sai tên máy chủ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Nối tài khoản nhà cung cấp của chính bạn vào phiên của người khác, rồi thêm state vào và nhìn nó hỏng</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — ID token vs access token, and the seven checks|||8.4 — ID token so với access token, và bảy phép kiểm',
      slug: 'auth-8-4-id-token',
      type: 'LESSON',
      description: 'Hai token đi về cùng một lúc, phục vụ hai mục đích khác nhau, và dùng nhầm cái là một lỗ hổng. Bài này mở ID token ra, chạy đủ bảy phép kiểm với output THẬT cho bảy trường hợp, và chỉ ra vì sao thiếu đúng MỘT trường boolean là mở đường cho một cú chiếm tài khoản mà nhiều sản phẩm lớn đã dính.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>ID token vs access token, and the seven checks</h2>
<p class="lead">The token response in Lesson 8.2 contains two credentials that look similar and are not remotely the same thing. One is addressed to you and describes a person; the other is addressed to an API and describes permissions. Nearly every "sign in with X" vulnerability ever published comes from treating the second as if it were the first, or from skipping one line of validation on the first.</p>

<h3>Side by side</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">id_token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Addressed to your client</span><span class="lz-nsub">Always a signed JWT · says who signed in and when · you verify it · this is how you log someone in</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">access_token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Addressed to an API</span><span class="lz-nsub">Opaque or a JWT, your business either way · says what may be done · the resource server validates it, not you</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">The rule</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Identity from the ID token only</span><span class="lz-nsub">If you are not calling the provider's APIs, you can discard the access token entirely</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Neither is your session</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Issue your own</span><span class="lz-nsub">A cookie from Chapter 3 or the token pair from Chapter 5 · yours to revoke, on your own schedule</span></div></div>
  </div>
</div>

<h3>The seven checks, run against seven tokens</h3>
<div class="out">hop le                  CHAP NHAN
aud cua ung dung KHAC   TU CHOI  &lt;- aud: 9999.apps.googleusercontent.com
iss gia mao             TU CHOI  &lt;- iss: https://accounts.google.com.ke-tan-cong.com
da het han              TU CHOI  &lt;- het han 3610s truoc
nonce phat lai          TU CHOI  &lt;- nonce lech
email CHUA xac minh     TU CHOI  &lt;- email_verified=false

chu ky bi doi mot byte  TU CHOI  &lt;- chu ky SAI

# Bay token RS256 THAT, ky bang mot khoa sinh tai cho, kiem bang bay phep
# kiem duoi day. Moi dong bi tu choi vi mot ly do KHAC nhau — bo bat mot
# phep kiem la mot dong trong so do im lang chuyen thanh CHAP NHAN.</div>
<pre><code>const kq = await jwtVerify(idToken, JWKS, {                <span class="tok-comment">// jose, JWKS lấy từ discovery</span>
  issuer:   'https://accounts.google.com',                 <span class="tok-comment">// 2. iss — KHỚP CHÍNH XÁC</span>
  audience: CLIENT_ID,                                     <span class="tok-comment">// 3. aud — client id CỦA BẠN</span>
  algorithms: ['RS256'],                                   <span class="tok-comment">// 1. thuật toán GHIM — Bài 4.2</span>
  clockTolerance: 60,                                      <span class="tok-comment">// 4. exp/iat, cho lệch 60 giây</span>
});
const p = kq.payload;

if (p.nonce !== luu.nonce)          throw new Error('nonce lech');       <span class="tok-comment">// 5</span>
if (p.azp &amp;&amp; p.azp !== CLIENT_ID)   throw new Error('azp lech');         <span class="tok-comment">// 6</span>
if (p.email &amp;&amp; p.email_verified !== true) throw new Error('email chua xac minh'); <span class="tok-comment">// 7</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">1–2 · Signature and issuer</span><span class="v">Fetch the key by <code>kid</code> from the provider's <code>jwks_uri</code> (Lesson 4.4), pin the algorithm, and compare <code>iss</code> as an exact string. <code>https://accounts.google.com.ke-tan-cong.com</code> starts with the right characters and is a different company.</span></div>
  <div class="kv"><span class="k">3 · Audience — the check that stops the confused deputy</span><span class="v">A token minted for another client is perfectly valid and signed by the same provider. <code>aud</code> is the only thing separating "a Google token" from "a Google token for me", and it is why an ID token can be trusted where an access token cannot.</span></div>
  <div class="kv"><span class="k">4–5 · Expiry and nonce</span><span class="v">Small clock tolerance, and the nonce compared against the value stored in step 1 of the flow (Lesson 8.3). A missing <code>nonce</code> claim when you sent the parameter is a failure, not a shrug.</span></div>
  <div class="kv"><span class="k">6–7 · azp and email_verified</span><span class="v"><code>azp</code> names the party the token was issued to when <code>aud</code> holds several values. And <code>email_verified</code> is one boolean standing between you and the next section.</span></div>
</div>

<h3>The one boolean, and the takeover behind it</h3>
<pre><code><span class="tok-comment">// SAI — và đây là con lỗi đã hạ được nhiều sản phẩm lớn:</span>
const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: chuanHoa(p.email) } });
if (nd) return dangNhap(nd);          <span class="tok-comment">// ← nối tài khoản CHỈ bằng email</span>

<span class="tok-comment">// Kẻ tấn công: mở tài khoản ở một nhà cung cấp OIDC dễ dãi,</span>
<span class="tok-comment">// đặt email hồ sơ thành victim@congty.com (không ai xác minh),</span>
<span class="tok-comment">// bấm "đăng nhập bằng nhà cung cấp đó" ở trang của bạn.</span>
<span class="tok-comment">// Máy chủ của bạn thấy một email khớp và trao cho hắn tài khoản.</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — an email address inside an ID token is a claim, not a fact, until <code>email_verified</code> says otherwise.</strong> Providers differ enormously: Google verifies, GitHub distinguishes verified from unverified addresses, and a long tail of smaller providers let a user type anything into a profile field and hand it to you unchallenged. If your login matches accounts on the email alone, anyone who can register at the sloppiest provider you accept can sign in as any of your users. Two rules close it: refuse any token whose <code>email_verified</code> is not exactly <code>true</code>, and treat "which providers do we accept" as a security decision made deliberately rather than a list that grows whenever someone asks.</p>
</div>
<pre><code><span class="tok-comment">// ĐÚNG — khoá là (nhà cung cấp, sub), còn email chỉ để hiển thị.</span>
model LienKetNhaCungCap {
  id            String @id @default(cuid())
  nhaCungCap    String                         <span class="tok-comment">// 'google' | 'github' | …</span>
  subNhaCungCap String                         <span class="tok-comment">// claim 'sub' — ỔN ĐỊNH, KHÔNG ĐỔI</span>
  nguoiDungId   String
  emailLucNoi   String?                        <span class="tok-comment">// ảnh chụp, chỉ để tra cứu về sau</span>

  nguoiDung     NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  @@unique([nhaCungCap, subNhaCungCap])        <span class="tok-comment">// ← danh tính THẬT sự nằm ở đây</span>
  @@map("lien_ket_nha_cung_cap")
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">sub is the identifier; email is a display attribute</span><span class="lz-lnote">The <code>sub</code> claim is stable for the lifetime of the account at that provider. Email is not: people rename their Google Workspace address, companies reassign departed employees' mailboxes, and a personal domain changes hands. Keying on email means those events silently move accounts between people.</span></div>
  <div class="lz-layer"><span class="lz-lname">sub is only unique within one provider</span><span class="lz-lnote">Two providers can issue the same <code>sub</code> string to different people. The unique constraint must cover the pair, and the lookup must always name the provider — a query on <code>sub</code> alone is a cross-provider impersonation waiting for a coincidence.</span></div>
  <div class="lz-layer"><span class="lz-lname">A verified email may still link accounts — as a step, not a login</span><span class="lz-lnote">Matching a verified address to an existing account is reasonable, and Lesson 8.5 covers doing it safely. What is never reasonable is completing the login on that basis alone, with no confirmation from the side that already owns the account.</span></div>
  <div class="lz-layer"><span class="lz-lname">Store the email you saw, for humans</span><span class="lz-lnote">Keep a snapshot on the link row. When a support ticket says "I cannot sign in with Google any more", the answer is usually that <code>sub</code> is the same and the address changed — and having both written down turns a mystery into a sentence.</span></div>
</div>

<h3>When you still need /userinfo</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Most of the time you do not</span><span class="v">The ID token already carries <code>sub</code>, <code>email</code>, <code>name</code> and <code>picture</code> for the scopes you requested. An extra HTTP call adds latency and a failure mode for information you were already handed, signed.</span></div>
  <div class="kv"><span class="k">Use it for claims the provider omits from the token</span><span class="v">Some providers keep the ID token small and put the rest at <code>/userinfo</code>. GitHub's OAuth is the classic case of needing an API call, because it is not an OIDC provider at all and issues no ID token.</span></div>
  <div class="kv"><span class="k">Use it for freshness, not for identity</span><span class="v">A profile picture or display name may have changed since the token was issued. Refreshing those from <code>/userinfo</code> is fine; deciding <em>who the user is</em> from it is the confused-deputy problem from Lesson 8.1.</span></div>
  <div class="kv"><span class="k">Its subject must match the token's</span><span class="v">If you call it, compare the returned <code>sub</code> with the one in the ID token and reject a mismatch. The specification requires it, and it costs one line.</span></div>
</div>
<div class="note-ct">
<p><strong>Never decode without verifying, and know which function you called.</strong> Every JWT library ships a decode helper that parses the payload and checks nothing — <code>jwt.decode</code>, <code>jose.decodeJwt</code> — and it exists for debugging. Reaching for it in the callback handler produces working code, a happy test suite, and an endpoint that accepts a token anybody can author with a text editor. It is the same shape as Lesson 4.2's <code>alg</code> problem, arriving through a different door: the vulnerability is not a subtle mistake in the checks, it is that the checks were never called at all.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">OIDC Core §3.1.3.7 — ID token validation</span><span class="lc-sub">openid.net · The normative list; the seven checks above follow it</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">OIDC Core — standard claims</span><span class="lc-sub">openid.net · What sub, email and email_verified actually promise</span></span></a>
<a class="link-card" href="https://github.com/panva/jose" target="_blank" rel="noopener"><span class="lc-ico">🧰</span><span class="lc-body"><span class="lc-title">jose</span><span class="lc-sub">github.com · jwtVerify and createRemoteJWKSet, used in the code above</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Caching a remote key set, and failing safely when the fetch does</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Sign in as another user by setting an unverified email, then add the email_verified check</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>ID token so với access token, và bảy phép kiểm</h2>
<p class="lead">Cái phản hồi token ở Bài 8.2 chứa hai tín vật trông na ná nhau và hoàn toàn không phải một thứ. Một cái gửi CHO BẠN và mô tả một CON NGƯỜI; cái kia gửi cho một API và mô tả các QUYỀN. Gần như mọi lỗ hổng "đăng nhập bằng X" từng được công bố đều đến từ việc coi cái thứ hai như cái thứ nhất, hoặc từ việc bỏ sót một dòng kiểm chứng ở cái thứ nhất.</p>

<h3>Đặt cạnh nhau</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">id_token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Gửi cho CLIENT của bạn</span><span class="lz-nsub">Luôn là một JWT đã ký · khai ai vừa đăng nhập và lúc nào · BẠN kiểm chứng nó · đây là cách bạn đăng nhập một người</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">access_token</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Gửi cho một API</span><span class="lz-nsub">Mờ đục hoặc là JWT, kiểu nào cũng không phải việc của bạn · khai được làm gì · MÁY CHỦ TÀI NGUYÊN kiểm nó, không phải bạn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Luật</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Danh tính CHỈ lấy từ ID token</span><span class="lz-nsub">Nếu bạn không gọi API của nhà cung cấp thì có thể VỨT access token đi hoàn toàn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cả hai đều KHÔNG phải phiên của bạn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Hãy phát phiên của chính mình</span><span class="lz-nsub">Cookie ở Chương 3 hoặc cặp token ở Chương 5 · của bạn, bạn thu hồi, theo lịch của bạn</span></div></div>
  </div>
</div>

<h3>Bảy phép kiểm, chạy trên bảy cái token</h3>
<div class="out">hop le                  CHAP NHAN
aud cua ung dung KHAC   TU CHOI  &lt;- aud: 9999.apps.googleusercontent.com
iss gia mao             TU CHOI  &lt;- iss: https://accounts.google.com.ke-tan-cong.com
da het han              TU CHOI  &lt;- het han 3610s truoc
nonce phat lai          TU CHOI  &lt;- nonce lech
email CHUA xac minh     TU CHOI  &lt;- email_verified=false

chu ky bi doi mot byte  TU CHOI  &lt;- chu ky SAI

# Bay token RS256 THAT, ky bang mot khoa sinh tai cho, kiem bang bay phep
# kiem duoi day. Moi dong bi tu choi vi mot ly do KHAC nhau — bo bat mot
# phep kiem la mot dong trong so do im lang chuyen thanh CHAP NHAN.</div>
<pre><code>const kq = await jwtVerify(idToken, JWKS, {                <span class="tok-comment">// jose, JWKS lấy từ discovery</span>
  issuer:   'https://accounts.google.com',                 <span class="tok-comment">// 2. iss — KHỚP CHÍNH XÁC</span>
  audience: CLIENT_ID,                                     <span class="tok-comment">// 3. aud — client id CỦA BẠN</span>
  algorithms: ['RS256'],                                   <span class="tok-comment">// 1. thuật toán GHIM — Bài 4.2</span>
  clockTolerance: 60,                                      <span class="tok-comment">// 4. exp/iat, cho lệch 60 giây</span>
});
const p = kq.payload;

if (p.nonce !== luu.nonce)          throw new Error('nonce lech');       <span class="tok-comment">// 5</span>
if (p.azp &amp;&amp; p.azp !== CLIENT_ID)   throw new Error('azp lech');         <span class="tok-comment">// 6</span>
if (p.email &amp;&amp; p.email_verified !== true) throw new Error('email chua xac minh'); <span class="tok-comment">// 7</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">1–2 · Chữ ký và bên phát hành</span><span class="v">Lấy khoá theo <code>kid</code> từ <code>jwks_uri</code> của nhà cung cấp (Bài 4.4), GHIM thuật toán, và so <code>iss</code> như một chuỗi khớp chính xác. <code>https://accounts.google.com.ke-tan-cong.com</code> bắt đầu bằng đúng những ký tự cần thiết và là một công ty khác.</span></div>
  <div class="kv"><span class="k">3 · Bên nhận — phép kiểm chặn "kẻ thừa hành bị lẫn lộn"</span><span class="v">Một token đúc cho client KHÁC thì hoàn toàn hợp lệ và do CHÍNH nhà cung cấp đó ký. <code>aud</code> là thứ DUY NHẤT tách "một token của Google" khỏi "một token của Google dành cho TÔI", và đó là lý do ID token tin được ở chỗ mà access token thì không.</span></div>
  <div class="kv"><span class="k">4–5 · Hạn và nonce</span><span class="v">Dung sai đồng hồ nhỏ thôi, và nonce đem so với giá trị đã lưu ở bước 1 của luồng (Bài 8.3). Một claim <code>nonce</code> BỊ THIẾU khi bạn đã gửi tham số là một THẤT BẠI, không phải chuyện nhún vai cho qua.</span></div>
  <div class="kv"><span class="k">6–7 · azp và email_verified</span><span class="v"><code>azp</code> khai ra bên mà token được phát cho, khi <code>aud</code> chứa nhiều giá trị. Còn <code>email_verified</code> là MỘT giá trị boolean đứng giữa bạn và phần tiếp theo.</span></div>
</div>

<h3>Một giá trị boolean, và cú chiếm tài khoản đứng sau nó</h3>
<pre><code><span class="tok-comment">// SAI — và đây là con lỗi đã hạ được nhiều sản phẩm lớn:</span>
const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: chuanHoa(p.email) } });
if (nd) return dangNhap(nd);          <span class="tok-comment">// ← nối tài khoản CHỈ bằng email</span>

<span class="tok-comment">// Kẻ tấn công: mở tài khoản ở một nhà cung cấp OIDC dễ dãi,</span>
<span class="tok-comment">// đặt email hồ sơ thành victim@congty.com (không ai xác minh),</span>
<span class="tok-comment">// bấm "đăng nhập bằng nhà cung cấp đó" ở trang của bạn.</span>
<span class="tok-comment">// Máy chủ của bạn thấy một email khớp và trao cho hắn tài khoản.</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — một địa chỉ email nằm trong ID token là một LỜI KHAI, không phải một sự thật, cho tới khi <code>email_verified</code> nói khác đi.</strong> Các nhà cung cấp khác nhau một trời một vực: Google có xác minh, GitHub phân biệt địa chỉ đã xác minh với chưa xác minh, còn một cái đuôi dài các nhà cung cấp nhỏ thì cho người dùng gõ bất cứ thứ gì vào một ô hồ sơ rồi giao thẳng cho bạn mà chẳng hỏi han gì. Nếu trang đăng nhập của bạn nối tài khoản CHỈ bằng email thì bất kỳ ai đăng ký được ở cái nhà cung cấp cẩu thả nhất mà bạn chấp nhận đều đăng nhập được với tư cách BẤT KỲ người dùng nào của bạn. Hai luật bịt nó lại: từ chối mọi token có <code>email_verified</code> không đúng bằng <code>true</code>, và coi câu "chúng ta chấp nhận những nhà cung cấp nào" là một QUYẾT ĐỊNH BẢO MẬT đưa ra có chủ ý chứ không phải một danh sách cứ dài ra mỗi lần có người xin thêm.</p>
</div>
<pre><code><span class="tok-comment">// ĐÚNG — khoá là (nhà cung cấp, sub), còn email chỉ để hiển thị.</span>
model LienKetNhaCungCap {
  id            String @id @default(cuid())
  nhaCungCap    String                         <span class="tok-comment">// 'google' | 'github' | …</span>
  subNhaCungCap String                         <span class="tok-comment">// claim 'sub' — ỔN ĐỊNH, KHÔNG ĐỔI</span>
  nguoiDungId   String
  emailLucNoi   String?                        <span class="tok-comment">// ảnh chụp, chỉ để tra cứu về sau</span>

  nguoiDung     NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  @@unique([nhaCungCap, subNhaCungCap])        <span class="tok-comment">// ← danh tính THẬT sự nằm ở đây</span>
  @@map("lien_ket_nha_cung_cap")
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">sub là ĐỊNH DANH; email là một thuộc tính hiển thị</span><span class="lz-lnote">Claim <code>sub</code> ổn định suốt tuổi đời của tài khoản ở nhà cung cấp đó. Email thì không: người ta đổi tên địa chỉ Google Workspace của mình, công ty giao lại hộp thư của nhân viên đã nghỉ, và một tên miền cá nhân thì đổi chủ. Lấy email làm khoá nghĩa là những sự kiện ấy lặng lẽ chuyển tài khoản từ người này sang người khác.</span></div>
  <div class="lz-layer"><span class="lz-lname">sub chỉ DUY NHẤT trong phạm vi MỘT nhà cung cấp</span><span class="lz-lnote">Hai nhà cung cấp hoàn toàn có thể phát cùng một chuỗi <code>sub</code> cho hai người khác nhau. Ràng buộc duy nhất phải phủ lên CẶP, và câu tra cứu phải luôn khai rõ nhà cung cấp — một truy vấn chỉ theo <code>sub</code> là một cú mạo danh xuyên nhà cung cấp đang ngồi chờ một sự trùng hợp.</span></div>
  <div class="lz-layer"><span class="lz-lname">Email ĐÃ xác minh vẫn có thể dùng để NỐI tài khoản — như một bước, không phải một lần đăng nhập</span><span class="lz-lnote">Khớp một địa chỉ đã xác minh với một tài khoản đang có là hợp lý, và Bài 8.5 nói cách làm điều đó cho an toàn. Cái KHÔNG bao giờ hợp lý là HOÀN TẤT việc đăng nhập chỉ dựa trên cơ sở ấy, mà không có xác nhận nào từ phía vốn đang sở hữu tài khoản.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy lưu lại cái email bạn đã thấy, cho CON NGƯỜI đọc</span><span class="lz-lnote">Giữ một ảnh chụp trên bản ghi liên kết. Khi có một ticket hỗ trợ viết "tôi không đăng nhập bằng Google được nữa" thì câu trả lời thường là <code>sub</code> vẫn thế còn địa chỉ đã đổi — và có sẵn cả hai con số ấy biến một điều bí ẩn thành một câu nói.</span></div>
</div>

<h3>Khi nào thì vẫn cần /userinfo</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Phần lớn thời gian là KHÔNG cần</span><span class="v">ID token vốn đã mang <code>sub</code>, <code>email</code>, <code>name</code> và <code>picture</code> ứng với những phạm vi bạn đã xin. Một lời gọi HTTP thêm chỉ tăng độ trễ và thêm một cách hỏng, để lấy về thông tin mà bạn đã được trao rồi, lại còn có chữ ký.</span></div>
  <div class="kv"><span class="k">Dùng nó cho những claim mà nhà cung cấp KHÔNG nhét vào token</span><span class="v">Vài nhà cung cấp cố giữ ID token nhỏ và để phần còn lại ở <code>/userinfo</code>. OAuth của GitHub là ca kinh điển buộc phải gọi API, vì nó hoàn toàn KHÔNG phải nhà cung cấp OIDC và không phát ID token nào cả.</span></div>
  <div class="kv"><span class="k">Dùng nó cho ĐỘ TƯƠI, không dùng cho danh tính</span><span class="v">Một tấm ảnh đại diện hay một tên hiển thị có thể đã đổi kể từ lúc token được phát. Làm mới những thứ đó từ <code>/userinfo</code> thì ổn; còn quyết định <em>người dùng này là ai</em> từ đó lại chính là bài toán kẻ thừa hành bị lẫn lộn ở Bài 8.1.</span></div>
  <div class="kv"><span class="k">sub của nó phải KHỚP với sub trong token</span><span class="v">Nếu có gọi nó thì hãy so <code>sub</code> trả về với cái trong ID token và từ chối khi lệch. Đặc tả yêu cầu điều đó, và nó tốn đúng một dòng.</span></div>
</div>
<div class="note-ct">
<p><strong>Đừng bao giờ giải mã mà không kiểm chứng, và hãy BIẾT mình vừa gọi hàm nào.</strong> Mọi thư viện JWT đều kèm một hàm giải mã chỉ phân tích payload mà chẳng kiểm gì cả — <code>jwt.decode</code>, <code>jose.decodeJwt</code> — và nó tồn tại để gỡ lỗi. Với tay lấy nó trong bộ xử lý gọi lại sẽ cho ra mã chạy được, một bộ kiểm thử vui vẻ, và một endpoint chấp nhận cái token mà ai cũng soạn được bằng một trình soạn thảo văn bản. Đó đúng cái hình dạng của vấn đề <code>alg</code> ở Bài 4.2, đi vào bằng một cánh cửa khác: lỗ hổng không phải một sai sót tinh vi TRONG các phép kiểm, mà là các phép kiểm chưa bao giờ được gọi.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">OIDC Core §3.1.3.7 — kiểm chứng ID token</span><span class="lc-sub">openid.net · Danh sách chuẩn tắc; bảy phép kiểm ở trên bám theo nó</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">OIDC Core — các claim chuẩn</span><span class="lc-sub">openid.net · sub, email và email_verified thật sự HỨA điều gì</span></span></a>
<a class="link-card" href="https://github.com/panva/jose" target="_blank" rel="noopener"><span class="lc-ico">🧰</span><span class="lc-body"><span class="lc-title">jose</span><span class="lc-sub">github.com · jwtVerify và createRemoteJWKSet, dùng trong đoạn mã ở trên</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Cache một bộ khoá ở xa, và hỏng cho an toàn khi lời gọi đó hỏng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Đăng nhập với tư cách người khác bằng cách đặt một email chưa xác minh, rồi thêm phép kiểm email_verified</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Being a client for real: linking, unlinking and the day Google is down|||8.5 — Làm client thật: nối, gỡ nối, và cái ngày Google sập',
      slug: 'auth-8-5-lam-client-that',
      type: 'LESSON',
      description: 'Đặc tả dừng lại ở bước 8. Từ đó trở đi là quyết định của bạn: một người có ba cách đăng nhập thì có mấy tài khoản, nối chúng lại thế nào mà không mở đường chiếm tài khoản, gỡ nối ra sao mà không khoá ai ngoài cửa, lưu hay không lưu token của nhà cung cấp, và làm gì khi nhà cung cấp ngừng phục vụ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Being a client for real: linking, unlinking and the day Google is down</h2>
<p class="lead">Everything up to here was protocol, and protocol has right answers. This lesson is the part with no specification: one person arrives with a Google account, a GitHub account and a password, and you have to decide how many accounts that is. Get it wrong in one direction and users have three profiles and lose their data; get it wrong in the other and you have built an account takeover.</p>

<h3>The four ways a login can arrive</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Known link</span><span class="lz-t">The easy case</span><span class="lz-d">The <code>(provider, sub)</code> pair already exists in your table. Log that account in, update the last-used timestamp, and stop. No email is consulted.</span></div>
  <div class="lz-step"><span class="lz-k">2 · New person</span><span class="lz-t">Also easy</span><span class="lz-d">No link, and no account with that verified address. Create both — the account and the link — in one transaction, and treat the address as verified because the provider verified it.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Verified address matches an existing account</span><span class="lz-t">The interesting one</span><span class="lz-d">No link, but the address belongs to someone. This is where products either offer a smooth "welcome back" or hand out someone else's account, and the difference is whether the existing account can be signed into any other way.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Unverified address</span><span class="lz-t">Stop</span><span class="lz-d">Refuse to link, refuse to auto-create against that address, and say so. Lesson 8.4 covers what happens when you do not.</span></div>
</div>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Link exists</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Sign in, stop</span><span class="lz-nsub">The email is never consulted · this is the path almost every login takes</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">No link, no account</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Create both, in one transaction</span><span class="lz-nsub">Address counts as verified because the provider verified it</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">No link, account exists</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ask before linking</span><span class="lz-nsub">Automatic only when that account has no password and no other factor</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Unverified address</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Refuse</span><span class="lz-nsub">No link, no account creation, and say why · this is a hard stop</span></div></div>
  </div>
</div>
<h3>Case 3, decided properly</h3>
<pre><code><span class="tok-comment">// Địa chỉ ĐÃ xác minh, trùng một tài khoản đang có, chưa có liên kết nào.</span>
const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });

if (!nd.matKhauBam &amp;&amp; !(await coYeuToKhac(nd.id))) {
  <span class="tok-comment">// Tài khoản này KHÔNG có cách đăng nhập nào khác — không ai "sở hữu" nó</span>
  <span class="tok-comment">// theo nghĩa có thể chứng minh. Nối luôn là an toàn.</span>
  await noiVaDangNhap(nd, nhaCungCap, sub);
} else {
  <span class="tok-comment">// CÓ mật khẩu hoặc CÓ passkey ⇒ bắt bên đang sở hữu chứng minh trước.</span>
  <span class="tok-comment">// KHÔNG đăng nhập. Lưu một yêu cầu nối đang chờ, rồi hỏi.</span>
  await luuYeuCauNoiChoDuyet(nd.id, nhaCungCap, sub, p.email);
  return res.render('xac-nhan-noi-tai-khoan');   <span class="tok-comment">// "Nhập mật khẩu để nối"</span>
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — automatic linking on a matching address turns any provider compromise into a compromise of your product.</strong> The reasoning sounds airtight: the address is verified by a provider you trust, so the person on the other end owns that mailbox, so they are the account holder. The gap is that owning the mailbox <em>today</em> is not the same as being the person who created your account, and it silently makes the weakest provider you accept the security level of every account. Corporate addresses get reassigned to new employees, domains change hands, and provider accounts get taken over — and in every one of those cases automatic linking hands over an account with a password the attacker never learned. Link automatically only when the existing account has no other way in, and otherwise ask the side that can already prove ownership.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Linking from inside a session is the clean path</span><span class="v">A settings page with "connect your Google account", behind re-authentication (Lesson 7.1). The user is already proven, the flow is unambiguous, and there is no matching heuristic anywhere in it.</span></div>
  <div class="kv"><span class="k">Same sub, different account, is a conflict — never a merge</span><span class="v">If the <code>(provider, sub)</code> is already linked elsewhere, refuse and explain. Silently moving the link, or merging two accounts, destroys data and is nearly impossible to undo correctly.</span></div>
  <div class="kv"><span class="k">Mail the account on every link and unlink</span><span class="v">The sixth message in the set from Lesson 6.5. A new sign-in method is a new key to the house, and the owner should hear about it from a channel the attacker does not control.</span></div>
  <div class="kv"><span class="k">Never merge accounts automatically</span><span class="v">If a user genuinely has two, make merging an explicit, confirmed, logged operation — ideally one a human at your end can reverse. "We noticed these are the same person" is how support tickets about missing data begin.</span></div>
</div>

<h3>Unlinking, and the lockout it causes</h3>
<pre><code>app.delete('/toi/lien-ket/:nhaCungCap', doiXacThucLai({ trongVong: 300 }), async (req, res) =&gt; {
  const soCach = await demCachDangNhap(nd.id);   <span class="tok-comment">// mật khẩu + passkey + số liên kết</span>

  if (soCach &lt;= 1) {
    return res.status(409).json({
      loi: 'Đây là cách đăng nhập duy nhất của bạn. Hãy đặt mật khẩu trước.',
    });
  }
  await prisma.lienKetNhaCungCap.delete({ where: { id: lienKet.id } });
  await guiThuDaGoLienKet(nd.email);
  res.status(204).end();
});</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Count before you delete, always</span><span class="lz-lnote">An account created through Google has no password. Unlinking Google without noticing leaves a row nobody can ever sign into again — and the user did it to themselves, in a settings page, with no warning.</span></div>
  <div class="lz-layer"><span class="lz-lname">Offer the fix in the error, not just the refusal</span><span class="lz-lnote">"Set a password first" with a link is a complete answer. A bare <code>409</code> sends the user to support to be told the same thing an hour later.</span></div>
  <div class="lz-layer"><span class="lz-lname">Password reset is the escape hatch, if the address is verified</span><span class="lz-lnote">A user who lost their Google account can recover through the email flow in Lesson 6.3 — but only if the address on file is verified and still theirs. That is one more reason case 4 above is a hard stop.</span></div>
  <div class="lz-layer"><span class="lz-lname">Deleting the account deletes the links</span><span class="lz-lnote"><code>onDelete: Cascade</code> on the link rows, per Lesson 6.5. Leaving orphaned links behind means the next person to sign in with that provider account may be matched to a ghost.</span></div>
</div>

<h3>Their tokens, their outage, their rules</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Do not store what you will not call</span><span class="v">If you only wanted identity, discard the access and refresh tokens after verifying the ID token. A refresh token you never use is a long-lived third-party credential sitting in your database for an attacker to find — with none of the value that would justify the risk.</span></div>
  <div class="kv"><span class="k">If you do store them, encrypt them</span><span class="v">Same treatment as the TOTP secret in Lesson 7.2: encrypted at rest with a key from your secrets manager, never logged, never returned by an API. And expect them to be revoked without notice when the user visits their provider's security page.</span></div>
  <div class="kv"><span class="k">Provider logout does not end your session, and yours does not end theirs</span><span class="v">These are separate systems. Signing out of your product must revoke <em>your</em> session (Chapter 5); it cannot sign the user out of Google, and it should not try. If you need the reverse — the provider ending your session — that is OIDC back-channel logout, and it is a deliberate feature to implement, not a default.</span></div>
  <div class="kv"><span class="k">Plan for the provider being unavailable</span><span class="v">Outages happen, API terms change, free tiers get withdrawn, and companies discontinue products. Because the account is keyed on <code>(provider, sub)</code> and not on the provider being reachable, existing sessions keep working — but nobody can sign in fresh. Users with a second method are unaffected, which is the real argument for prompting people to add one.</span></div>
</div>
<h3>Not every provider is an OIDC provider</h3>
<pre><code><span class="tok-comment">// Đo thật: nhà cung cấp nào có tài liệu discovery của OIDC?</span>
for u in google microsoft gitlab github; do curl -s -o /dev/null -w … ; done</code></pre>
<div class="out">nha cung cap HTTP   issuer trong tai lieu discovery
Google       200    https://accounts.google.com
Microsoft    200    https://login.microsoftonline.com/{tenantid}/v2.0
GitLab       200    https://gitlab.com
GitHub       403    (khong co truong issuer)

# Ba nha cung cap dau la OIDC: mot URL la co du endpoint, JWKS va thuat toan.
# GitHub thi khong — no la OAuth 2.0 THUAN, khong phat id_token, nen danh tinh
# phai lay bang mot loi goi API va dia chi email phai xin RIENG mot lan nua.
# Issuer cua Microsoft co {tenantid} ben trong: dung so sanh chuoi ngay tho voi no.</div>
<div class="callout warn">
<p><strong>Every provider deviates from the specification somewhere, and you will find out in production.</strong> GitHub is not an OIDC provider at all — no ID token, no discovery document — so identity comes from an API call and the email needs a separate request to list verified addresses. Some providers return <code>email_verified</code> as the string <code>"true"</code> rather than a boolean, which a strict comparison correctly rejects and a loose one dangerously accepts. Apple returns the user's name exactly once, on the first authorization, and never again — miss it and it is gone. Several providers issue a refresh token only when you ask for offline access explicitly. Read each provider's own documentation on top of the specification, write an integration test per provider against their sandbox, and keep the deviations in a comment next to the code rather than in somebody's memory.</p>
</div>
<div class="note-ct">
<p><strong>Social login is a feature, not an authentication strategy.</strong> It removes a password from your database and moves the phishing surface to a provider with a security team larger than your company — both real wins. It also means an account your product cannot recover on its own, a dependency on terms you do not control, and a privacy fact you owe your users. The stable design is: offer providers, key on <code>(provider, sub)</code>, never merge on an address alone, and always give every account a second way in that belongs entirely to you.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-account-linking" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">RFC 9700 — account linking guidance</span><span class="lc-sub">datatracker.ietf.org · Why matching on an email address is not enough</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-backchannel-1_0.html" target="_blank" rel="noopener"><span class="lc-ico">🚪</span><span class="lc-body"><span class="lc-title">OIDC back-channel logout</span><span class="lc-sub">openid.net · Letting the provider end sessions in your product</span></span></a>
<a class="link-card" href="https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps" target="_blank" rel="noopener"><span class="lc-ico">🐙</span><span class="lc-body"><span class="lc-title">GitHub — authorizing OAuth apps</span><span class="lc-sub">docs.github.com · A provider that is OAuth but not OIDC, documented</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">Compound unique constraints, and transactions around account creation</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Take over an account through automatic linking, then implement case 3 correctly</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Làm client thật: nối, gỡ nối, và cái ngày Google sập</h2>
<p class="lead">Mọi thứ tới đây đều là GIAO THỨC, mà giao thức thì có câu trả lời đúng. Bài này là phần KHÔNG có đặc tả nào: một người tới với một tài khoản Google, một tài khoản GitHub và một cái mật khẩu, và bạn phải quyết định đó là mấy tài khoản. Sai theo hướng này thì người dùng có ba hồ sơ và mất dữ liệu; sai theo hướng kia thì bạn vừa dựng ra một cú chiếm tài khoản.</p>

<h3>Bốn cách một lần đăng nhập có thể tới</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Liên kết đã biết</span><span class="lz-t">Trường hợp dễ</span><span class="lz-d">Cặp <code>(nhà cung cấp, sub)</code> đã có sẵn trong bảng của bạn. Đăng nhập tài khoản đó, cập nhật mốc dùng lần cuối, và DỪNG. Không tra tới email.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Người mới hoàn toàn</span><span class="lz-t">Cũng dễ</span><span class="lz-d">Không có liên kết, và cũng không có tài khoản nào mang địa chỉ đã xác minh đó. Hãy tạo cả hai — tài khoản và liên kết — trong MỘT giao dịch, và coi địa chỉ ấy là đã xác minh vì nhà cung cấp đã xác minh nó.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Địa chỉ ĐÃ xác minh trùng một tài khoản đang có</span><span class="lz-t">Cái đáng bàn</span><span class="lz-d">Không có liên kết, nhưng địa chỉ ấy đang thuộc về ai đó. Đây là chỗ mà sản phẩm hoặc là đưa ra một câu "chào mừng bạn quay lại" mượt mà, hoặc là trao tài khoản của người khác cho ai đó — và khác biệt nằm ở chỗ cái tài khoản đang có ấy CÓ đăng nhập được bằng cách nào khác hay không.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Địa chỉ CHƯA xác minh</span><span class="lz-t">Dừng</span><span class="lz-d">Từ chối nối, từ chối tự tạo tài khoản gắn với địa chỉ đó, và nói thẳng ra. Bài 8.4 kể chuyện gì xảy ra khi bạn không làm thế.</span></div>
</div>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Đã có liên kết</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đăng nhập, dừng</span><span class="lz-nsub">Không tra tới email · đây là đường mà gần như mọi lần đăng nhập đi qua</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Chưa liên kết, chưa có tài khoản</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tạo cả hai, trong một giao dịch</span><span class="lz-nsub">Địa chỉ tính là đã xác minh vì nhà cung cấp đã xác minh nó</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Chưa liên kết, đã có tài khoản</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">HỎI trước khi nối</span><span class="lz-nsub">Chỉ tự động khi tài khoản đó không có mật khẩu và không có yếu tố nào khác</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Địa chỉ chưa xác minh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Từ chối</span><span class="lz-nsub">Không nối, không tạo tài khoản, và nói rõ vì sao · đây là điểm dừng cứng</span></div></div>
  </div>
</div>
<h3>Trường hợp 3, quyết cho đúng</h3>
<pre><code><span class="tok-comment">// Địa chỉ ĐÃ xác minh, trùng một tài khoản đang có, chưa có liên kết nào.</span>
const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });

if (!nd.matKhauBam &amp;&amp; !(await coYeuToKhac(nd.id))) {
  <span class="tok-comment">// Tài khoản này KHÔNG có cách đăng nhập nào khác — không ai "sở hữu" nó</span>
  <span class="tok-comment">// theo nghĩa có thể chứng minh. Nối luôn là an toàn.</span>
  await noiVaDangNhap(nd, nhaCungCap, sub);
} else {
  <span class="tok-comment">// CÓ mật khẩu hoặc CÓ passkey ⇒ bắt bên đang sở hữu chứng minh trước.</span>
  <span class="tok-comment">// KHÔNG đăng nhập. Lưu một yêu cầu nối đang chờ, rồi hỏi.</span>
  await luuYeuCauNoiChoDuyet(nd.id, nhaCungCap, sub, p.email);
  return res.render('xac-nhan-noi-tai-khoan');   <span class="tok-comment">// "Nhập mật khẩu để nối"</span>
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — tự động nối khi địa chỉ trùng khớp sẽ biến MỌI cú xâm nhập ở nhà cung cấp thành một cú xâm nhập vào sản phẩm của bạn.</strong> Lý lẽ nghe rất kín: địa chỉ đã được một nhà cung cấp mà bạn tin xác minh, nên người ở đầu bên kia sở hữu hộp thư đó, nên họ là chủ tài khoản. Chỗ hở nằm ở chỗ sở hữu hộp thư <em>HÔM NAY</em> không đồng nghĩa với việc là người đã tạo ra tài khoản của bạn, và nó âm thầm biến nhà cung cấp YẾU NHẤT mà bạn chấp nhận thành mức an ninh của MỌI tài khoản. Địa chỉ công ty được giao lại cho nhân viên mới, tên miền đổi chủ, và tài khoản ở nhà cung cấp thì bị chiếm — và trong mọi trường hợp ấy, việc tự động nối trao đi một tài khoản mà kẻ tấn công chưa bao giờ biết mật khẩu. Chỉ tự động nối khi tài khoản đang có KHÔNG có lối vào nào khác, còn lại thì hãy đi hỏi cái phía vốn đã chứng minh được quyền sở hữu.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nối từ BÊN TRONG một phiên là con đường sạch</span><span class="v">Một trang cài đặt có nút "kết nối tài khoản Google của bạn", đặt sau bước xác thực lại (Bài 7.1). Người dùng đã được chứng minh sẵn, luồng không mập mờ, và trong đó không có phép suy đoán khớp nào cả.</span></div>
  <div class="kv"><span class="k">Cùng sub, khác tài khoản, là XUNG ĐỘT — không bao giờ là gộp</span><span class="v">Nếu cặp <code>(nhà cung cấp, sub)</code> đã nối ở chỗ khác thì hãy từ chối và giải thích. Lặng lẽ dời cái liên kết, hoặc gộp hai tài khoản, sẽ phá dữ liệu và gần như không thể hoàn tác cho đúng.</span></div>
  <div class="kv"><span class="k">Gửi thư báo ở MỌI lần nối và gỡ nối</span><span class="v">Đó là lá thư thứ sáu trong bộ ở Bài 6.5. Một cách đăng nhập mới là một chiếc chìa khoá mới vào nhà, và chủ nhân nên nghe tin đó từ một kênh mà kẻ tấn công không nắm.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ gộp tài khoản TỰ ĐỘNG</span><span class="v">Nếu một người thật sự có hai tài khoản thì hãy biến việc gộp thành một thao tác TƯỜNG MINH, có xác nhận, có ghi log — lý tưởng nhất là thứ mà một người ở phía bạn đảo ngược được. "Chúng tôi nhận thấy đây là cùng một người" là cách những cái ticket về dữ liệu biến mất ra đời.</span></div>
</div>

<h3>Gỡ nối, và cú khoá cửa mà nó gây ra</h3>
<pre><code>app.delete('/toi/lien-ket/:nhaCungCap', doiXacThucLai({ trongVong: 300 }), async (req, res) =&gt; {
  const soCach = await demCachDangNhap(nd.id);   <span class="tok-comment">// mật khẩu + passkey + số liên kết</span>

  if (soCach &lt;= 1) {
    return res.status(409).json({
      loi: 'Đây là cách đăng nhập duy nhất của bạn. Hãy đặt mật khẩu trước.',
    });
  }
  await prisma.lienKetNhaCungCap.delete({ where: { id: lienKet.id } });
  await guiThuDaGoLienKet(nd.email);
  res.status(204).end();
});</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">ĐẾM trước khi xoá, luôn luôn</span><span class="lz-lnote">Một tài khoản tạo ra qua Google thì không có mật khẩu. Gỡ Google mà không để ý là để lại một bản ghi mà không ai còn đăng nhập vào được nữa — và người dùng TỰ LÀM điều đó với chính mình, trong một trang cài đặt, không có lời cảnh báo nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đưa CÁCH GỠ vào ngay trong lỗi, đừng chỉ từ chối</span><span class="lz-lnote">"Hãy đặt mật khẩu trước" kèm một đường dẫn là một câu trả lời trọn vẹn. Một cái <code>409</code> trần trụi chỉ đẩy người dùng sang bộ phận hỗ trợ để một tiếng sau nghe đúng câu đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đặt lại mật khẩu là lối thoát hiểm, NẾU địa chỉ đã xác minh</span><span class="lz-lnote">Một người mất tài khoản Google vẫn khôi phục được qua luồng email ở Bài 6.3 — nhưng chỉ khi địa chỉ đang lưu đã được xác minh và vẫn còn là của họ. Đó là thêm một lý do nữa để trường hợp 4 ở trên là một điểm dừng cứng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xoá tài khoản thì xoá luôn các liên kết</span><span class="lz-lnote"><code>onDelete: Cascade</code> trên các bản ghi liên kết, theo Bài 6.5. Để sót lại liên kết mồ côi nghĩa là người tiếp theo đăng nhập bằng tài khoản nhà cung cấp ấy có thể bị khớp vào một bóng ma.</span></div>
</div>

<h3>Không phải nhà cung cấp nào cũng là nhà cung cấp OIDC</h3>
<pre><code><span class="tok-comment">// Đo thật: nhà cung cấp nào có tài liệu discovery của OIDC?</span>
for u in google microsoft gitlab github; do curl -s -o /dev/null -w … ; done</code></pre>
<div class="out">nha cung cap HTTP   issuer trong tai lieu discovery
Google       200    https://accounts.google.com
Microsoft    200    https://login.microsoftonline.com/{tenantid}/v2.0
GitLab       200    https://gitlab.com
GitHub       403    (khong co truong issuer)

# Ba nha cung cap dau la OIDC: mot URL la co du endpoint, JWKS va thuat toan.
# GitHub thi khong — no la OAuth 2.0 THUAN, khong phat id_token, nen danh tinh
# phai lay bang mot loi goi API va dia chi email phai xin RIENG mot lan nua.
# Issuer cua Microsoft co {tenantid} ben trong: dung so sanh chuoi ngay tho voi no.</div>

<h3>Token của họ, sự cố của họ, luật của họ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đừng lưu thứ bạn sẽ không gọi tới</span><span class="v">Nếu bạn chỉ cần danh tính thì hãy VỨT access token và refresh token đi sau khi kiểm chứng xong ID token. Một refresh token bạn chẳng bao giờ dùng là một tín vật dài hạn của bên thứ ba nằm sẵn trong cơ sở dữ liệu chờ kẻ tấn công tìm thấy — mà không mang lại chút giá trị nào để bù cho rủi ro ấy.</span></div>
  <div class="kv"><span class="k">Nếu có lưu thì phải MÃ HOÁ</span><span class="v">Đối xử y như bí mật TOTP ở Bài 7.2: mã hoá lúc lưu bằng một khoá từ trình quản lý bí mật, không bao giờ ghi log, không bao giờ trả về qua API. Và hãy trông đợi rằng chúng bị thu hồi mà chẳng báo trước, ngay khi người dùng ghé trang bảo mật của nhà cung cấp.</span></div>
  <div class="kv"><span class="k">Đăng xuất ở nhà cung cấp KHÔNG kết thúc phiên của bạn, và ngược lại</span><span class="v">Đây là hai hệ thống riêng. Đăng xuất khỏi sản phẩm của bạn phải thu hồi phiên <em>của bạn</em> (Chương 5); nó không đăng xuất người dùng khỏi Google được, và cũng không nên cố. Nếu bạn cần chiều ngược lại — nhà cung cấp kết thúc phiên bên bạn — thì đó là back-channel logout của OIDC, một tính năng phải chủ động cài đặt chứ không phải mặc định.</span></div>
  <div class="kv"><span class="k">Hãy lường trước chuyện nhà cung cấp KHÔNG dùng được</span><span class="v">Sự cố vẫn xảy ra, điều khoản API thay đổi, gói miễn phí bị rút, và các công ty khai tử sản phẩm. Vì tài khoản lấy khoá là <code>(nhà cung cấp, sub)</code> chứ không phải "nhà cung cấp có gọi được không", các phiên đang chạy vẫn sống — nhưng không ai đăng nhập mới được. Những người có cách đăng nhập thứ hai thì không bị ảnh hưởng, và đó chính là lý lẽ THẬT để nhắc mọi người thêm một cách nữa.</span></div>
</div>
<div class="callout warn">
<p><strong>Nhà cung cấp nào cũng lệch khỏi đặc tả ở đâu đó, và bạn sẽ biết điều ấy trên production.</strong> GitHub hoàn toàn KHÔNG phải nhà cung cấp OIDC — không ID token, không tài liệu discovery — nên danh tính phải lấy bằng một lời gọi API và email cần một request riêng để liệt kê các địa chỉ đã xác minh. Vài nhà cung cấp trả <code>email_verified</code> dưới dạng CHUỖI <code>"true"</code> thay vì boolean, thứ mà một phép so sánh nghiêm ngặt từ chối đúng còn một phép so sánh lỏng lẻo thì chấp nhận một cách nguy hiểm. Apple trả về tên của người dùng ĐÚNG MỘT LẦN, ở lần uỷ quyền đầu tiên, và không bao giờ nữa — bỏ lỡ là mất. Vài nhà cung cấp chỉ phát refresh token khi bạn xin quyền truy cập ngoại tuyến một cách tường minh. Hãy đọc tài liệu riêng của TỪNG nhà cung cấp chồng lên đặc tả, viết một bài kiểm thử tích hợp cho mỗi nhà cung cấp chạy với môi trường thử của họ, và ghi những chỗ lệch ấy vào một dòng chú thích ngay cạnh mã, đừng để trong trí nhớ của ai đó.</p>
</div>
<div class="note-ct">
<p><strong>Đăng nhập mạng xã hội là một TÍNH NĂNG, không phải một chiến lược xác thực.</strong> Nó gỡ một cái mật khẩu ra khỏi cơ sở dữ liệu của bạn và dời bề mặt lừa đảo sang một nhà cung cấp có đội bảo mật đông hơn cả công ty bạn — cả hai đều là cái được thật. Nó cũng nghĩa là một tài khoản mà sản phẩm của bạn tự mình không khôi phục nổi, một sự phụ thuộc vào những điều khoản bạn không kiểm soát, và một sự thật về quyền riêng tư mà bạn nợ người dùng của mình. Thiết kế ổn định là: có cung cấp các nhà cung cấp, lấy khoá là <code>(nhà cung cấp, sub)</code>, không bao giờ gộp chỉ dựa trên một địa chỉ, và LUÔN cho mọi tài khoản một lối vào thứ hai thuộc hoàn toàn về bạn.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700#name-account-linking" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">RFC 9700 — hướng dẫn về nối tài khoản</span><span class="lc-sub">datatracker.ietf.org · Vì sao khớp theo địa chỉ email là KHÔNG đủ</span></span></a>
<a class="link-card" href="https://openid.net/specs/openid-connect-backchannel-1_0.html" target="_blank" rel="noopener"><span class="lc-ico">🚪</span><span class="lc-body"><span class="lc-title">OIDC — back-channel logout</span><span class="lc-sub">openid.net · Để nhà cung cấp kết thúc phiên bên trong sản phẩm của bạn</span></span></a>
<a class="link-card" href="https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps" target="_blank" rel="noopener"><span class="lc-ico">🐙</span><span class="lc-body"><span class="lc-title">GitHub — uỷ quyền cho ứng dụng OAuth</span><span class="lc-sub">docs.github.com · Một nhà cung cấp là OAuth mà không phải OIDC, có tài liệu hẳn hoi</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Ràng buộc duy nhất ghép, và giao dịch bao quanh việc tạo tài khoản</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chiếm một tài khoản qua cơ chế tự động nối, rồi cài trường hợp 3 cho đúng</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: 'Quiz: OAuth 2.1 and OpenID Connect|||Quiz: OAuth 2.1 và OpenID Connect',
      slug: 'auth-8-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về uỷ quyền so với xác thực, PKCE, state và nonce, khớp redirect_uri, kiểm chứng ID token, và nối tài khoản.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.6</span>
<h2>Quiz: OAuth 2.1 and OpenID Connect</h2>
<p class="lead">Eight questions. Four of them describe integrations that log users in successfully every single time and hand accounts to strangers — which is the defining property of this chapter: nothing here fails visibly.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> OAuth answers "what may this app touch" and OIDC answers "who is this person"; an access token is addressed to an API and is never proof of identity (8.1). One flow covers every client — authorization code with PKCE, with the verifier held server-side and the code exchanged once on the back channel (8.2). <code>state</code> stops a CSRF that links the attacker's provider account into the victim's session, <code>nonce</code> stops ID token replay, and <code>redirect_uri</code> must match exactly because every clever matching rule has a published bypass (8.3). Verify the ID token with all seven checks — signature, issuer, audience, expiry, nonce, azp, and <code>email_verified</code> — and never call a decode helper instead (8.4). Key accounts on <code>(provider, sub)</code>, link automatically only when the existing account has no other way in, count login methods before unlinking, and always give every account a second way in that belongs to you (8.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.6</span>
<h2>Quiz: OAuth 2.1 và OpenID Connect</h2>
<p class="lead">Tám câu. Bốn câu mô tả những bản tích hợp đăng nhập THÀNH CÔNG mọi lần và trao tài khoản cho người lạ — đó là đặc tính định danh của cả chương này: không có gì ở đây hỏng một cách nhìn thấy được.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> OAuth trả lời "ứng dụng này được chạm vào gì" còn OIDC trả lời "người này là ai"; access token được gửi cho một API và KHÔNG BAO GIỜ là bằng chứng danh tính (8.1). Một luồng phủ mọi loại client — authorization code kèm PKCE, với verifier giữ ở phía máy chủ và mã đổi ĐÚNG MỘT LẦN qua kênh sau (8.2). <code>state</code> chặn một cú CSRF nối tài khoản nhà cung cấp của KẺ TẤN CÔNG vào phiên nạn nhân, <code>nonce</code> chặn phát lại ID token, và <code>redirect_uri</code> phải khớp CHÍNH XÁC vì mọi luật khớp thông minh đều đã có đường lách được công bố (8.3). Hãy kiểm chứng ID token với đủ bảy phép kiểm — chữ ký, bên phát hành, bên nhận, hạn, nonce, azp, và <code>email_verified</code> — và đừng bao giờ gọi hàm giải mã thay cho chúng (8.4). Lấy khoá tài khoản là <code>(nhà cung cấp, sub)</code>, chỉ tự động nối khi tài khoản đang có không còn lối vào nào khác, ĐẾM số cách đăng nhập trước khi gỡ nối, và luôn cho mọi tài khoản một lối vào thứ hai thuộc về bạn (8.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your login takes an access token from the client, calls /userinfo, and signs in whoever it names. What is wrong?|||Trang đăng nhập của bạn nhận một access token từ client, gọi /userinfo, rồi đăng nhập đúng cái người mà nó khai ra. Sai ở đâu?',
            options: [
              'Nothing; the provider verified the token|||Không sai; nhà cung cấp đã kiểm chứng cái token rồi',
              'An access token is a bearer credential issued to some client, and you cannot tell which — a malicious app can present a token it collected and be logged in as that user; the ID token names its audience, which is why it exists|||Access token là tín vật cầm-là-dùng-được phát cho MỘT client nào đó mà bạn không biết là client nào — một ứng dụng độc hại có thể trình ra cái token nó thu được và được đăng nhập với tư cách người ấy; ID token khai rõ bên nhận, và đó là lý do nó tồn tại',
              'The /userinfo call is too slow|||Lời gọi /userinfo quá chậm',
              'It should use the refresh token instead|||Nên dùng refresh token thì đúng hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does OAuth 2.1 require PKCE even for a backend that holds a client secret?|||Vì sao OAuth 2.1 bắt buộc PKCE kể cả với một backend đang giữ client secret?',
            options: [
              'Because client secrets leak in configuration files|||Vì client secret hay rò ra trong các tệp cấu hình',
              'Because of code injection: an attacker can make a victim deliver the attacker’s authorization code to your callback, and PKCE binds the code to the flow that requested it|||Vì cú TIÊM MÃ: kẻ tấn công có thể khiến nạn nhân giao mã uỷ quyền CỦA HẮN vào endpoint gọi lại của bạn, còn PKCE thì buộc cái mã vào đúng cái luồng đã yêu cầu nó',
              'Because it replaces the client secret|||Vì nó thay thế cho client secret',
              'Because mobile apps share the same code path|||Vì ứng dụng di động dùng chung đường mã đó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a missing state check let an attacker do?|||Thiếu phép kiểm state thì kẻ tấn công làm được gì?',
            options: [
              'Read the victim’s authorization code|||Đọc được mã uỷ quyền của nạn nhân',
              'Deliver their own authorization code to the victim’s browser, linking the attacker’s provider account into the victim’s session so everything the victim then does lands in an account the attacker also controls|||Giao mã uỷ quyền CỦA CHÍNH HẮN vào trình duyệt nạn nhân, nối tài khoản nhà cung cấp của kẻ tấn công vào phiên của nạn nhân, để mọi việc nạn nhân làm sau đó rơi vào một tài khoản mà kẻ tấn công cũng nắm',
              'Replay an expired ID token|||Phát lại một ID token đã hết hạn',
              'Nothing, as long as PKCE is enabled|||Không gì cả, miễn là đã bật PKCE',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your registered redirect URI is https://cuongthai.com/cb and you match with startsWith. What gets through?|||Redirect URI đã đăng ký của bạn là https://cuongthai.com/cb và bạn khớp bằng startsWith. Cái gì lọt qua?',
            options: [
              'Nothing; the prefix pins the domain|||Không gì cả; cái tiền tố đã ghim tên miền rồi',
              'Anything that merely begins with that string — an appended path, a query parameter or a fragment — which is why OAuth 2.1 requires an exact registered match with no patterns|||Bất cứ thứ gì chỉ cần BẮT ĐẦU bằng chuỗi đó — nối thêm đường dẫn, thêm tham số truy vấn hay thêm fragment — và đó là lý do OAuth 2.1 đòi khớp CHÍNH XÁC với giá trị đã đăng ký, không dùng mẫu',
              'Only subdomains of cuongthai.com|||Chỉ các tên miền con của cuongthai.com',
              'Only URLs using http instead of https|||Chỉ những URL dùng http thay vì https',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which ID token claim stops a token minted for a different application from working on yours?|||Claim nào của ID token chặn được một token đúc cho ứng dụng KHÁC dùng được trên ứng dụng của bạn?',
            options: [
              'sub, the subject identifier|||sub, định danh chủ thể',
              'aud, the audience — it names the client the token was issued for, and comparing it against your own client id is what separates a valid provider token from a valid token for you|||aud, bên nhận — nó khai rõ token được phát cho client nào, và so nó với client id của chính bạn chính là thứ tách "một token hợp lệ của nhà cung cấp" khỏi "một token hợp lệ DÀNH CHO BẠN"',
              'iat, the issue time|||iat, thời điểm phát hành',
              'nonce, which is unique per flow|||nonce, thứ duy nhất cho mỗi luồng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A provider sends email: "admin@cuongthai.com" with email_verified: false. What should happen?|||Một nhà cung cấp gửi email: "admin@cuongthai.com" kèm email_verified: false. Chuyện gì nên xảy ra?',
            options: [
              'Log the user in; the provider authenticated them|||Đăng nhập người dùng đó; nhà cung cấp đã xác thực họ rồi',
              'Refuse to link or auto-create against that address — the address is an unverified claim, and matching accounts on it lets anyone who can register at the sloppiest provider sign in as any of your users|||Từ chối nối và từ chối tự tạo tài khoản gắn với địa chỉ đó — đó chỉ là một LỜI KHAI chưa xác minh, và khớp tài khoản theo nó cho phép bất kỳ ai đăng ký được ở nhà cung cấp cẩu thả nhất đăng nhập với tư cách bất kỳ người dùng nào của bạn',
              'Log them in but show a warning banner|||Cứ đăng nhập nhưng hiện một dải cảnh báo',
              'Send a verification email and log them in meanwhile|||Gửi một lá thư xác minh rồi cứ đăng nhập họ trong lúc chờ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why key the provider link on (provider, sub) rather than on the email address?|||Vì sao lấy khoá liên kết nhà cung cấp là (nhà cung cấp, sub) chứ không phải địa chỉ email?',
            options: [
              'Because sub is shorter and indexes better|||Vì sub ngắn hơn và đánh chỉ mục tốt hơn',
              'Because sub is stable for the life of that provider account while an email is reassigned, renamed and traded — and sub is unique only within one provider, so the pair is the real identity|||Vì sub ổn định suốt tuổi đời của tài khoản ở nhà cung cấp đó, còn email thì bị giao lại, bị đổi tên và bị sang tay — và sub chỉ duy nhất TRONG PHẠM VI một nhà cung cấp, nên chính CẶP đó mới là danh tính thật',
              'Because email is not always present in the token|||Vì email không phải lúc nào cũng có trong token',
              'Because the provider may change its sub format|||Vì nhà cung cấp có thể đổi định dạng sub',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A user unlinks their only provider from an account created through that provider. What must the endpoint do?|||Một người dùng gỡ nhà cung cấp DUY NHẤT khỏi một tài khoản vốn được tạo ra qua chính nhà cung cấp đó. Endpoint phải làm gì?',
            options: [
              'Unlink it; they can always use password reset|||Cứ gỡ; họ luôn có thể dùng chức năng đặt lại mật khẩu',
              'Count the remaining login methods first and refuse when it would leave zero, telling them to set a password — otherwise the row becomes permanently unreachable|||ĐẾM số cách đăng nhập còn lại trước đã, rồi từ chối khi việc đó khiến còn số không, và bảo họ đặt mật khẩu — không thì bản ghi đó thành vĩnh viễn không vào được nữa',
              'Delete the account, since it has no other credentials|||Xoá luôn tài khoản, vì nó không còn tín vật nào khác',
              'Unlink it and email a magic link|||Cứ gỡ rồi gửi một magic link qua email',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
