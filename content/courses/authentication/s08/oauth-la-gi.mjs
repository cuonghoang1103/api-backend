/**
 * Authentication · Chương 8 · 8.1 — OAuth dùng để làm gì, và ba thứ nó bị lẫn với. Slug giữ: auth-8-1-oauth-la-gi. Bài đầu chương.
 * Output thật (_ma.mjs, LabFlow ID v0.8): discovery /.well-known/openid-configuration (code_challenge_methods ["S256"]).
 */
import G from '../giang/auth-08-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.provider.split('\n');
const DISCOVERY = P.slice(P.findIndex((l) => l.includes('discovery()')), P.findIndex((l) => l.includes('authorize(client'))).join('\n').replace(/^\s*\n/gm, '').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 9700 — Best Current Practice for OAuth 2.0 Security (BCP 240, Jan 2025)', 'The modern baseline: authorization code + PKCE for all clients, implicit removed, exact redirect URIs (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
  nguon('🆔', 'OpenID Connect Core 1.0', 'How OIDC adds an ID token and discovery on top of OAuth; the difference this lesson draws (read 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 9700 — Thực hành bảo mật OAuth 2.0 (BCP 240, 01/2025)', 'Mốc hiện đại: authorization code + PKCE cho mọi client, bỏ implicit, redirect URI khớp chính xác (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
  nguon('🆔', 'OpenID Connect Core 1.0', 'OIDC thêm một ID token và discovery lên trên OAuth ra sao; khác biệt bài này vẽ (đọc 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Often confused with OAuth</th><th>What it actually is</th></tr></thead>
<tbody>
<tr><td>"login" / authentication</td><td>that is OpenID Connect (an ID token) — raw OAuth never says WHO you are</td></tr>
<tr><td>a session</td><td>Chapter 3 — what your own app keeps after the login moment</td></tr>
<tr><td>an API key</td><td>a client credential (machine-to-machine), not a user delegating access</td></tr>
<tr><td>"implicit flow"</td><td>dead (OAuth 2.1) — tokens in the URL fragment leaked; use code + PKCE</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Hay bị lẫn với OAuth</th><th>Thực ra là gì</th></tr></thead>
<tbody>
<tr><td>"đăng nhập" / xác thực</td><td>đó là OpenID Connect (một ID token) — OAuth thuần không bao giờ nói bạn LÀ AI</td></tr>
<tr><td>một phiên</td><td>Chương 3 — thứ app của bạn giữ sau khoảnh khắc đăng nhập</td></tr>
<tr><td>một API key</td><td>một tín vật của client (máy-với-máy), không phải người dùng uỷ quyền truy cập</td></tr>
<tr><td>"luồng implicit"</td><td>đã chết (OAuth 2.1) — token trong fragment URL rò; dùng code + PKCE</td></tr>
</tbody>
</table>`;

export default {
  title: '8.1 — What OAuth is for, and the three things it is confused with|||8.1 — OAuth dùng để làm gì, và ba thứ nó bị lẫn với',
  slug: 'auth-8-1-oauth-la-gi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'OAuth là UỶ QUYỀN TRUY CẬP được uỷ thác: cho một app hành động trên tài nguyên của người dùng ở một nơi khác, có phạm vi và thu hồi được, mà không cần mật khẩu. Nó KHÔNG phải đăng nhập (đó là OpenID Connect + một ID token), không phải một phiên (Chương 3), không phải một API key (tín vật máy-với-máy). Bốn vai: chủ tài nguyên, client, máy chủ uỷ quyền (LabFlow ID), máy chủ tài nguyên (LabFlow API). OIDC = OAuth + danh tính (ID token). Discovery: một tài liệu /.well-known/openid-configuration khai mọi endpoint — của LabFlow ID khai code_challenge_methods_supported ["S256"] (PKCE bắt buộc). Luồng implicit đã chết (OAuth 2.1): mọi client dùng authorization code + PKCE. Theo RFC 9700 + OpenID Connect Core.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>What OAuth is for, and the three things it is confused with</h2>
<p class="lead">By now LabFlow ID can prove who a user is, keep them signed in, and recover their account. Chapter 8 asks a different question: how does a <em>different</em> application — LabFlow API, a mobile app, "Sign in with LabFlow" on a partner site — let a user bring that identity along, without ever seeing the password? That is OAuth, and almost everything said about it confuses it with three other things.</p>

<div class="callout ok">
<p><strong>After Chapter 8 you can:</strong> run the authorization-code-with-PKCE flow end to end with LabFlow ID as the provider and LabFlow API as the client; explain what state, nonce and redirect_uri each defend; and verify an ID token with all seven checks. Lab 8 grades that verification against a valid token and every tampered one.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>say what OAuth actually delegates — scoped, revocable access, not identity;</li>
<li>distinguish OAuth from authentication, a session, and an API key;</li>
<li>name the four roles and place LabFlow ID and LabFlow API in them;</li>
<li>explain how OIDC adds an ID token, and read a discovery document.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> "Sign in with Google" is on half the web, and most teams who add it cannot say whether they are doing authentication or authorization — which is exactly the confusion that produces the bypass bugs in 8.3 and 8.4.</p>
</div>

<h3>An everyday picture first</h3>
<p>A <strong>valet key</strong> starts the car and opens the door, but not the trunk or the glovebox. You hand it to someone to do one job, it works only for that, and you can take it back. OAuth is that valet key for your data: you let an app do <em>some</em> things — read your calendar, post on your behalf — scoped and revocable, without giving it your password or letting it become you. The app never learns your credential; it holds a token that says "allowed to do X, until revoked".</p>

<h3>The three things OAuth is not</h3>
${BANG_EN}
<p>The first row is the one that bites. Raw OAuth answers "is this app <em>allowed</em> to do X?" — never "<em>who</em> is the user?". Teams that read the user's identity out of an OAuth access token are building on sand: that token is for the resource server, may be opaque, and says nothing reliable about identity. Answering "who" is a separate job, and it has a name.</p>

<h3>OIDC = OAuth + identity</h3>
<p>OpenID Connect is a thin, standard layer on top of OAuth: the <em>same</em> authorization-code flow, plus one addition — an <strong>ID token</strong>, a signed JWT that states who logged in (<code>sub</code>, <code>email</code>, a <code>nonce</code>). "Sign in with…" is OIDC, not bare OAuth. The access token is still there, for calling APIs; the ID token is the new part, for the client to know who the user is. Lesson 8.4 is entirely about not confusing the two.</p>

<h3>The four roles, in LabFlow</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Resource owner</span><span class="lz-lnote">The user — An, who owns her LabFlow data and is the only one who can authorize access to it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Client</span><span class="lz-lnote">LabFlow API (the API Design course's project), the app that wants to act for An. It never sees her password.</span></div>
  <div class="lz-layer"><span class="lz-lname">Authorization server</span><span class="lz-lnote">LabFlow ID — it authenticates An (Chapters 1–7) and issues tokens. In OIDC it is also the "provider".</span></div>
  <div class="lz-layer"><span class="lz-lname">Resource server</span><span class="lz-lnote">The API holding the data, which accepts the access token. Often the same service as the client, but a distinct role.</span></div>
</div>

<h3>Discovery: one document a client reads once</h3>
<p>A client does not hardcode endpoints; it reads LabFlow ID's discovery document and learns them, plus which algorithms and PKCE methods are supported.</p>
${ma('javascript', DISCOVERY)}
${ra(OUT['81-oidc-flow'])}
<p>The measured discovery (line 1 of the demo) advertises <code>code_challenge_methods_supported: ["S256"]</code> — PKCE is required and <code>plain</code> is deliberately absent. The rest of the run is the full login and the attacks the parameters stop; the next four lessons take it apart.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "the implicit flow is simpler for a SPA."</strong> The implicit flow returned tokens directly in the URL fragment, where they landed in browser history, server logs and the <code>Referer</code> header. OAuth 2.1 removes it entirely: <em>every</em> client, single-page apps included, uses the authorization code flow with PKCE (lesson 8.2). If a tutorial tells you to use implicit, it is describing a web that no longer exists.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Is OAuth authentication or authorization?"</strong> — Authorization (delegated access). Authentication ("who are you") is OpenID Connect, which adds an ID token on top.</li>
<li><strong>"Can I read the user's identity from the access token?"</strong> — No — the access token is for the resource server and may be opaque. Use the ID token for identity (8.4).</li>
<li><strong>"Which flow should a single-page app use?"</strong> — Authorization code with PKCE. Implicit is dead (OAuth 2.1 / RFC 9700).</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo8/oidc-flow.mjs</code>. In the discovery output, what does <code>code_challenge_methods_supported</code> contain, and what does its lack of <code>"plain"</code> tell you?</li>
<li>For each of the four roles, name the LabFlow component that plays it.</li>
<li>Explain, in one sentence each, why an access token is the wrong thing to authenticate a user with, and why the implicit flow was removed.</li>
</ol>
<p><strong>Solution:</strong> (1) <code>["S256"]</code> only — PKCE is mandatory and the weaker <code>plain</code> method is not offered. (2) owner = the user (An); client = LabFlow API; authorization server/provider = LabFlow ID; resource server = the API holding the data. (3) an access token is for the resource server and may be opaque, so it says nothing reliable about identity; implicit put tokens in the URL where they leaked.</p>
<p><strong>Done when:</strong> you can state what OAuth delegates and how OIDC differs, without using the word "login" for both.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OAuth 2.1</span><span class="v">Delegated authorization: an app acts on a user's resource, scoped and revocable, without the password.</span></div>
  <div class="kv"><span class="k">OpenID Connect (OIDC)</span><span class="v">A thin identity layer on OAuth that adds an ID token and discovery.</span></div>
  <div class="kv"><span class="k">authorization server / provider</span><span class="v">Issues tokens and (for OIDC) authenticates the user — LabFlow ID.</span></div>
  <div class="kv"><span class="k">client / relying party</span><span class="v">The app that wants access — LabFlow API; never sees the password.</span></div>
  <div class="kv"><span class="k">discovery document</span><span class="v"><code>/.well-known/openid-configuration</code> — the endpoints and algorithms a client reads once.</span></div>
  <div class="kv"><span class="k">implicit flow</span><span class="v">The removed flow that returned tokens in the URL; replaced by code + PKCE.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>OAuth delegates scoped, revocable access — it is authorization, not identity.</li>
<li>It is not a session, not an API key, and not login; login is OIDC + an ID token.</li>
<li>Four roles: owner, client, authorization server, resource server — LabFlow ID is the server, LabFlow API the client.</li>
<li>Discovery advertises the endpoints and PKCE methods; LabFlow ID offers <code>S256</code> only.</li>
<li>The implicit flow is dead — every client uses authorization code with PKCE (8.2).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Compare in API Design — lesson 6.1: authenticating API callers', sub: 'There, the resource server’s side — accepting a bearer token and checking it. Here, how that token is obtained via OAuth/OIDC. The two halves meet at the access token. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>OAuth dùng để làm gì, và ba thứ nó bị lẫn với</h2>
<p class="lead">Tới giờ LabFlow ID chứng minh được một người dùng là ai, giữ họ đăng nhập, và khôi phục tài khoản họ. Chương 8 hỏi một câu khác: làm sao một ứng dụng <em>khác</em> — LabFlow API, một app di động, "Đăng nhập bằng LabFlow" trên một site đối tác — cho một người dùng mang danh tính đó theo, mà không bao giờ thấy mật khẩu? Đó là OAuth, và gần như mọi điều người ta nói về nó đều lẫn nó với ba thứ khác.</p>

<div class="callout ok">
<p><strong>Học xong Chương 8 bạn làm được:</strong> chạy luồng authorization-code-kèm-PKCE từ đầu tới cuối với LabFlow ID là provider và LabFlow API là client; giải thích state, nonce và redirect_uri mỗi cái phòng gì; và xác minh một ID token với đủ bảy phép kiểm. Lab 8 chấm phần xác minh đó với một token hợp lệ và mỗi cái bị sửa.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nói OAuth thực sự uỷ quyền cái gì — truy cập có phạm vi, thu hồi được, không phải danh tính;</li>
<li>phân biệt OAuth với xác thực, một phiên, và một API key;</li>
<li>gọi tên bốn vai và đặt LabFlow ID và LabFlow API vào đó;</li>
<li>giải thích OIDC thêm một ID token ra sao, và đọc một tài liệu discovery.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "Đăng nhập bằng Google" có mặt trên một nửa web, và phần lớn các đội thêm nó không nói được họ đang làm xác thực hay uỷ quyền — đúng là sự lẫn lộn đẻ ra các lỗi bypass ở 8.3 và 8.4.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Một <strong>chìa valet</strong> nổ máy và mở cửa, nhưng không mở cốp hay hộc đồ. Bạn đưa nó cho ai đó làm một việc, nó chỉ chạy cho việc đó, và bạn lấy lại được. OAuth là cái chìa valet đó cho dữ liệu của bạn: bạn cho một app làm <em>một số</em> việc — đọc lịch, đăng hộ — có phạm vi và thu hồi được, mà không đưa mật khẩu hay để nó trở thành bạn. App không bao giờ biết tín vật của bạn; nó giữ một token nói "được làm X, tới khi bị thu hồi".</p>

<h3>Ba thứ OAuth KHÔNG phải</h3>
${BANG_VI}
<p>Dòng đầu mới là cái cắn. OAuth thuần trả lời "app này có <em>được phép</em> làm X không?" — không bao giờ "<em>ai</em> là người dùng?". Các đội đọc danh tính người dùng ra từ một access token OAuth đang xây trên cát: token đó dành cho máy chủ tài nguyên, có thể mờ đục, và không nói gì đáng tin về danh tính. Trả lời "ai" là một việc riêng, và nó có tên.</p>

<h3>OIDC = OAuth + danh tính</h3>
<p>OpenID Connect là một lớp mỏng, chuẩn, trên OAuth: <em>cùng</em> luồng authorization-code, cộng một thứ — một <strong>ID token</strong>, một JWT đã ký nói ai đã đăng nhập (<code>sub</code>, <code>email</code>, một <code>nonce</code>). "Đăng nhập bằng…" là OIDC, không phải OAuth trần. Access token vẫn ở đó, để gọi API; ID token là phần mới, để client biết người dùng là ai. Bài 8.4 nói trọn về việc đừng lẫn hai cái.</p>

<h3>Bốn vai, trong LabFlow</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chủ tài nguyên</span><span class="lz-lnote">Người dùng — An, người sở hữu dữ liệu LabFlow của mình và là người duy nhất uỷ quyền truy cập được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Client</span><span class="lz-lnote">LabFlow API (dự án của khoá API Design), app muốn hành động cho An. Nó không bao giờ thấy mật khẩu của cô.</span></div>
  <div class="lz-layer"><span class="lz-lname">Máy chủ uỷ quyền</span><span class="lz-lnote">LabFlow ID — nó xác thực An (Chương 1–7) và phát token. Trong OIDC nó cũng là "provider".</span></div>
  <div class="lz-layer"><span class="lz-lname">Máy chủ tài nguyên</span><span class="lz-lnote">API giữ dữ liệu, chấp nhận access token. Thường cùng một service với client, nhưng là một vai riêng.</span></div>
</div>

<h3>Discovery: một tài liệu client đọc một lần</h3>
<p>Một client không hardcode endpoint; nó đọc tài liệu discovery của LabFlow ID và biết chúng, cộng thuật toán và phương pháp PKCE được hỗ trợ.</p>
${ma('javascript', DISCOVERY)}
${ra(OUT['81-oidc-flow'])}
<p>Discovery đo được (dòng 1 của demo) khai <code>code_challenge_methods_supported: ["S256"]</code> — PKCE bắt buộc và <code>plain</code> cố ý vắng. Phần còn lại của lượt chạy là đăng nhập đầy đủ và các cú tấn công mà tham số chặn; bốn bài tới mổ nó ra.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "luồng implicit đơn giản hơn cho một SPA."</strong> Luồng implicit trả token thẳng trong fragment URL, nơi chúng rơi vào lịch sử trình duyệt, log máy chủ và header <code>Referer</code>. OAuth 2.1 bỏ nó hoàn toàn: <em>mọi</em> client, kể cả ứng dụng một trang, dùng luồng authorization code kèm PKCE (bài 8.2). Nếu một hướng dẫn bảo bạn dùng implicit, nó đang mô tả một web không còn tồn tại.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"OAuth là xác thực hay uỷ quyền?"</strong> — Uỷ quyền (truy cập được uỷ thác). Xác thực ("bạn là ai") là OpenID Connect, thêm một ID token lên trên.</li>
<li><strong>"Tôi đọc danh tính người dùng từ access token được không?"</strong> — Không — access token dành cho máy chủ tài nguyên và có thể mờ đục. Dùng ID token cho danh tính (8.4).</li>
<li><strong>"Một ứng dụng một trang nên dùng luồng nào?"</strong> — Authorization code kèm PKCE. Implicit đã chết (OAuth 2.1 / RFC 9700).</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo8/oidc-flow.mjs</code>. Trong output discovery, <code>code_challenge_methods_supported</code> chứa gì, và việc thiếu <code>"plain"</code> nói lên điều gì?</li>
<li>Với mỗi vai trong bốn vai, gọi tên thành phần LabFlow đóng nó.</li>
<li>Giải thích, mỗi cái một câu, vì sao một access token là thứ sai để xác thực một người dùng, và vì sao luồng implicit bị bỏ.</li>
</ol>
<p><strong>Lời giải:</strong> (1) chỉ <code>["S256"]</code> — PKCE bắt buộc và phương pháp <code>plain</code> yếu hơn không được mời. (2) chủ = người dùng (An); client = LabFlow API; máy chủ uỷ quyền/provider = LabFlow ID; máy chủ tài nguyên = API giữ dữ liệu. (3) một access token dành cho máy chủ tài nguyên và có thể mờ đục, nên không nói gì đáng tin về danh tính; implicit đặt token trong URL nơi chúng rò.</p>
<p><strong>Đạt khi:</strong> bạn nói được OAuth uỷ quyền cái gì và OIDC khác ra sao, mà không dùng từ "đăng nhập" cho cả hai.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OAuth 2.1</span><span class="v">Uỷ quyền truy cập: một app hành động trên tài nguyên của người dùng, có phạm vi và thu hồi được, không cần mật khẩu.</span></div>
  <div class="kv"><span class="k">OpenID Connect (OIDC)</span><span class="v">Một lớp danh tính mỏng trên OAuth thêm một ID token và discovery.</span></div>
  <div class="kv"><span class="k">authorization server / provider</span><span class="v">Phát token và (với OIDC) xác thực người dùng — LabFlow ID.</span></div>
  <div class="kv"><span class="k">client / relying party</span><span class="v">App muốn truy cập — LabFlow API; không bao giờ thấy mật khẩu.</span></div>
  <div class="kv"><span class="k">discovery document</span><span class="v"><code>/.well-known/openid-configuration</code> — các endpoint và thuật toán một client đọc một lần.</span></div>
  <div class="kv"><span class="k">implicit flow (luồng implicit)</span><span class="v">Luồng bị bỏ trả token trong URL; thay bằng code + PKCE.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>OAuth uỷ quyền truy cập có phạm vi, thu hồi được — là uỷ quyền, không phải danh tính.</li>
<li>Nó không phải một phiên, không phải một API key, và không phải đăng nhập; đăng nhập là OIDC + một ID token.</li>
<li>Bốn vai: chủ, client, máy chủ uỷ quyền, máy chủ tài nguyên — LabFlow ID là máy chủ, LabFlow API là client.</li>
<li>Discovery khai các endpoint và phương pháp PKCE; LabFlow ID chỉ mời <code>S256</code>.</li>
<li>Luồng implicit đã chết — mọi client dùng authorization code kèm PKCE (8.2).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'So với API Design — bài 6.1: xác thực bên gọi API', sub: 'Ở đó, phía máy chủ tài nguyên — nhận một bearer token và kiểm nó. Ở đây, cách token đó được lấy qua OAuth/OIDC. Hai nửa gặp nhau ở access token. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
