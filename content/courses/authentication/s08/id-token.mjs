/**
 * Authentication · Chương 8 · 8.4 — ID token so với access token, và bảy phép kiểm. Slug giữ: auth-8-4-id-token.
 * Output thật (_ma.mjs, 81-oidc-flow): id_token verified {ok,sub,email}; bad_aud; bad_nonce. Core: src/oidc/verify.js.
 */
import G from '../giang/auth-08-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const VERIFY = CODE.verify.split('\n');
const CHECKS = VERIFY.slice(VERIFY.findIndex((l) => l.includes('export function verifyIdToken')), VERIFY.findIndex((l) => l.includes('return { ok: true'))+1).join('\n').trim();

const NGUON_EN = [
  nguon('🆔', 'OpenID Connect Core §3.1.3.7 — ID Token Validation', 'The official list of ID-token checks a client must perform (read 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation'),
  nguon('📜', 'RFC 8725 — JWT Best Current Practices', 'Verify the signature and the claims; never trust alg from the header (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8725'),
].join('\n');
const NGUON_VI = [
  nguon('🆔', 'OpenID Connect Core §3.1.3.7 — Xác thực ID Token', 'Danh sách chính thức các phép kiểm ID token một client phải làm (đọc 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation'),
  nguon('📜', 'RFC 8725 — Thực hành tốt nhất cho JWT', 'Kiểm chữ ký và các claim; không bao giờ tin alg từ header (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8725'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th></th><th>ID token</th><th>Access token</th></tr></thead>
<tbody>
<tr><td>Answers</td><td>who logged in</td><td>what the bearer may do</td></tr>
<tr><td>Audience (<code>aud</code>)</td><td>the CLIENT id</td><td>the resource server / API</td></tr>
<tr><td>Consumed by</td><td>the client (read its claims)</td><td>the API (treat as opaque)</td></tr>
<tr><td>Used to</td><td>know the user, start a session</td><td>call the API as Authorization: Bearer</td></tr>
<tr><td>Confusing them</td><td colspan="2">authenticating with an access token is a classic bypass (6.1 of API Design)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th></th><th>ID token</th><th>Access token</th></tr></thead>
<tbody>
<tr><td>Trả lời</td><td>ai đã đăng nhập</td><td>người giữ được làm gì</td></tr>
<tr><td>Audience (<code>aud</code>)</td><td>id của CLIENT</td><td>máy chủ tài nguyên / API</td></tr>
<tr><td>Ai tiêu</td><td>client (đọc claim của nó)</td><td>API (coi là mờ đục)</td></tr>
<tr><td>Dùng để</td><td>biết người dùng, bắt đầu một phiên</td><td>gọi API dạng Authorization: Bearer</td></tr>
<tr><td>Lẫn chúng</td><td colspan="2">xác thực bằng một access token là một cú bypass kinh điển (6.1 của API Design)</td></tr>
</tbody>
</table>`;

export default {
  title: '8.4 — ID token vs access token, and the seven checks|||8.4 — ID token so với access token, và bảy phép kiểm',
  slug: 'auth-8-4-id-token',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai token trở về, cho hai việc. ID token nói cho CLIENT biết ai đã đăng nhập (aud = id của client, client đọc claim); access token để client gọi máy chủ tài nguyên (aud = API, client coi là mờ đục). Lẫn chúng — xác thực người dùng bằng một access token — là một cú bypass kinh điển. Trước khi tin một ID token, client chạy BẢY phép kiểm (OIDC Core §3.1.3.7): 1 giải mã được · 2 chữ ký (JWKS, theo kid) · 3 iss là provider mong đợi · 4 aud chứa id client của ta · 5 chưa hết hạn · 6 không đề ngày tương lai · 7 nonce là của ta. Chữ ký là tối quan trọng — bỏ nó thì ai cũng đúc một ID token cho bất kỳ sub nào. Core thuần: src/oidc/verify.js. Đo thật: id_token verified {ok,sub,email}; sai aud ⇒ bad_aud; sai nonce ⇒ bad_nonce. Theo OIDC Core + RFC 8725.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>ID token vs access token, and the seven checks</h2>
<p class="lead">The token exchange in 8.2 returned two tokens, and they are for two completely different jobs. One tells the <em>client</em> who just signed in; the other lets the client <em>call an API</em>. Mixing them up — authenticating a user by reading an access token, or shipping an ID token to an API — is one of the most common and most serious bugs in federated login. This lesson separates them, then gives the seven checks a client must run before it believes an ID token at all.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> say which token is for whom and why you never authenticate with an access token; and implement the seven ID-token checks, knowing which one is load-bearing and why.</p>
</div>

<h3>Two tokens, two jobs</h3>
${BANG_EN}
<p>The short version: the <strong>ID token</strong> is an identity statement for the client to read once; the <strong>access token</strong> is a pass the client carries to the API and should treat as opaque. If your client decodes the access token to decide who the user is, you have coupled your login to the internals of a token that was never meant for you — and an API that issues access tokens without the identity claims you assumed will silently log the wrong person in.</p>

<h3>The seven checks</h3>
<p>An ID token is a signed JWT, and a signature alone is not enough — you must check <em>what</em> it says and <em>who</em> it was for. LabFlow API's client runs all seven, as a pure function:</p>
${ma('javascript', CHECKS)}
${ra(OUT['81-oidc-flow'])}
<p>The run shows the valid token verifying to <code>{ ok, sub: usr_1, email }</code>, and two of the checks failing on purpose: the same token re-verified with <code>expectedAudience: 'other-app'</code> → <code>bad_aud</code>, and with a different nonce → <code>bad_nonce</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — skipping the signature, or the audience.</strong> Skip the <strong>signature</strong> (check 2) and anyone can mint an ID token claiming to be any user — the "yeu" client in Lab 8 does exactly this and accepts a forgery. Skip the <strong>audience</strong> (check 4) and a token minted for a <em>different</em> client is accepted by yours: app A's token logs the user into app B. And verify the signature against the provider's JWKS <em>by kid</em>, choosing the algorithm from the key, never from the token header (lesson 4.2) — <code>alg: none</code> and HS/RS confusion live exactly here.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Difference between an ID token and an access token?"</strong> — The ID token says who logged in (audience = the client, read it); the access token is a pass for the API (audience = the API, opaque to the client).</li>
<li><strong>"Which checks does a client run on an ID token?"</strong> — Signature (JWKS by kid), iss, aud, exp, iat, nonce — plus that it decoded at all. Seven in total.</li>
<li><strong>"Can I authenticate a user with an access token?"</strong> — No. It is for the resource server and may be opaque; use the ID token's verified claims.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo8/oidc-flow.mjs</code>. Confirm the valid token verifies, then find <code>bad_aud</code> and <code>bad_nonce</code>. What single value differs in each case?</li>
<li>In <code>src/oidc/verify.js</code>, which check is the one that, if removed, lets an attacker forge an ID token for any user?</li>
<li>Give a concrete scenario where accepting a token with the wrong <code>aud</code> logs the wrong person in.</li>
</ol>
<p><strong>Solution:</strong> (1) <code>bad_aud</code> changes only the expected audience; <code>bad_nonce</code> changes only the expected nonce — the token is otherwise identical and validly signed. (2) the signature check (<code>signatureValid</code>) — without it a forged, unsigned token is accepted. (3) if client B accepts a token whose <code>aud</code> is client A, then anyone who can obtain an A-token (e.g. their own login at A) can present it to B and be logged in as that user at B.</p>
<p><strong>Done when:</strong> you can list the seven checks and name the two whose omission is a full bypass.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ID token</span><span class="v">A signed JWT stating who logged in; audience is the client; the client reads it.</span></div>
  <div class="kv"><span class="k">access token</span><span class="v">A pass for the resource server; audience is the API; opaque to the client.</span></div>
  <div class="kv"><span class="k">audience (<code>aud</code>)</span><span class="v">Who a token is for; an ID token's must contain the client's own id.</span></div>
  <div class="kv"><span class="k">JWKS verification</span><span class="v">Checking the signature against the provider's public keys by <code>kid</code> (4.4).</span></div>
  <div class="kv"><span class="k">token confusion</span><span class="v">Using one token where the other belongs — a classic auth bypass.</span></div>
  <div class="kv"><span class="k">claims</span><span class="v">The ID token's statements: <code>iss</code>, <code>sub</code>, <code>aud</code>, <code>exp</code>, <code>iat</code>, <code>nonce</code>, <code>email</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The ID token says <em>who</em> (audience = client); the access token is a pass for the API (audience = API, opaque).</li>
<li>Never authenticate a user by reading an access token.</li>
<li>Run the seven checks: decode, signature, iss, aud, exp, iat, nonce.</li>
<li>The signature and the audience are the two whose omission is a complete bypass.</li>
<li>Verify the signature by <code>kid</code> against the JWKS, choosing the algorithm from the key (4.2).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-4-4-khoa-va-jwks', title: 'Revisit Chapter 4 — lesson 4.4: keys, kid and JWKS', sub: 'Check 2 is exactly the JWKS verification you built in Chapter 4, now used by a client to trust another service’s tokens. Each stands on its own.', cta: 'OPEN LESSON 4.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>ID token so với access token, và bảy phép kiểm</h2>
<p class="lead">Lần đổi token ở 8.2 trả về hai token, và chúng cho hai việc hoàn toàn khác nhau. Một cái nói cho <em>client</em> biết ai vừa đăng nhập; cái kia để client <em>gọi một API</em>. Lẫn chúng — xác thực một người dùng bằng cách đọc một access token, hay gửi một ID token tới một API — là một trong những lỗi phổ biến và nghiêm trọng nhất của đăng nhập liên kết. Bài này tách chúng ra, rồi cho bảy phép kiểm một client phải chạy trước khi tin một ID token.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> nói token nào cho ai và vì sao không bao giờ xác thực bằng một access token; và cài bảy phép kiểm ID token, biết cái nào then chốt và vì sao.</p>
</div>

<h3>Hai token, hai việc</h3>
${BANG_VI}
<p>Bản ngắn: <strong>ID token</strong> là một lời khai danh tính cho client đọc một lần; <strong>access token</strong> là một tấm vé client mang tới API và nên coi là mờ đục. Nếu client của bạn giải mã access token để quyết định người dùng là ai, bạn đã gắn đăng nhập của mình vào ruột của một token chưa bao giờ dành cho bạn — và một API phát access token mà không có các claim danh tính bạn tưởng sẽ lặng lẽ đăng nhập sai người.</p>

<h3>Bảy phép kiểm</h3>
<p>Một ID token là một JWT đã ký, và chỉ chữ ký thôi là chưa đủ — bạn phải kiểm nó nói <em>gì</em> và dành cho <em>ai</em>. Client của LabFlow API chạy đủ bảy, dạng một hàm thuần:</p>
${ma('javascript', CHECKS)}
${ra(OUT['81-oidc-flow'])}
<p>Lượt chạy cho thấy token hợp lệ verify thành <code>{ ok, sub: usr_1, email }</code>, và hai phép kiểm thất bại có chủ đích: cùng token verify lại với <code>expectedAudience: 'other-app'</code> → <code>bad_aud</code>, và với một nonce khác → <code>bad_nonce</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — bỏ chữ ký, hay audience.</strong> Bỏ <strong>chữ ký</strong> (phép 2) và ai cũng đúc được một ID token khai là bất kỳ người dùng nào — client "yếu" ở Lab 8 làm đúng điều này và nhận một bản giả. Bỏ <strong>audience</strong> (phép 4) và một token đúc cho một client <em>khác</em> được client của bạn nhận: token của app A đăng nhập người dùng vào app B. Và kiểm chữ ký với JWKS của provider <em>theo kid</em>, chọn thuật toán từ khoá, không bao giờ từ header token (bài 4.2) — <code>alg: none</code> và nhầm lẫn HS/RS sống đúng ở đây.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Khác biệt giữa ID token và access token?"</strong> — ID token nói ai đã đăng nhập (audience = client, đọc nó); access token là một tấm vé cho API (audience = API, mờ đục với client).</li>
<li><strong>"Client chạy những phép kiểm nào trên một ID token?"</strong> — Chữ ký (JWKS theo kid), iss, aud, exp, iat, nonce — cộng việc nó giải mã được. Bảy cả thảy.</li>
<li><strong>"Tôi xác thực một người dùng bằng một access token được không?"</strong> — Không. Nó dành cho máy chủ tài nguyên và có thể mờ đục; dùng các claim đã xác minh của ID token.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo8/oidc-flow.mjs</code>. Xác nhận token hợp lệ verify, rồi tìm <code>bad_aud</code> và <code>bad_nonce</code>. Mỗi trường hợp khác đúng một giá trị nào?</li>
<li>Trong <code>src/oidc/verify.js</code>, phép kiểm nào mà nếu bỏ sẽ cho kẻ tấn công giả một ID token cho bất kỳ người dùng nào?</li>
<li>Cho một tình huống cụ thể mà nhận một token sai <code>aud</code> đăng nhập sai người.</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>bad_aud</code> chỉ đổi audience mong đợi; <code>bad_nonce</code> chỉ đổi nonce mong đợi — token còn lại y hệt và ký hợp lệ. (2) phép kiểm chữ ký (<code>signatureValid</code>) — không có nó một token giả, không ký được nhận. (3) nếu client B nhận một token có <code>aud</code> là client A, thì ai lấy được một token-A (vd đăng nhập của chính họ ở A) có thể nộp nó cho B và được đăng nhập như người dùng đó ở B.</p>
<p><strong>Đạt khi:</strong> bạn liệt kê được bảy phép kiểm và gọi tên hai cái mà bỏ đi là một cú bypass trọn vẹn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ID token</span><span class="v">Một JWT đã ký nói ai đã đăng nhập; audience là client; client đọc nó.</span></div>
  <div class="kv"><span class="k">access token</span><span class="v">Một tấm vé cho máy chủ tài nguyên; audience là API; mờ đục với client.</span></div>
  <div class="kv"><span class="k">audience (<code>aud</code>)</span><span class="v">Một token dành cho ai; aud của một ID token phải chứa id của chính client.</span></div>
  <div class="kv"><span class="k">JWKS verification</span><span class="v">Kiểm chữ ký với các khoá công khai của provider theo <code>kid</code> (4.4).</span></div>
  <div class="kv"><span class="k">token confusion (lẫn token)</span><span class="v">Dùng một token ở chỗ của cái kia — một cú bypass xác thực kinh điển.</span></div>
  <div class="kv"><span class="k">claims</span><span class="v">Các lời khai của ID token: <code>iss</code>, <code>sub</code>, <code>aud</code>, <code>exp</code>, <code>iat</code>, <code>nonce</code>, <code>email</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>ID token nói <em>ai</em> (audience = client); access token là một tấm vé cho API (audience = API, mờ đục).</li>
<li>Không bao giờ xác thực một người dùng bằng cách đọc một access token.</li>
<li>Chạy bảy phép kiểm: giải mã, chữ ký, iss, aud, exp, iat, nonce.</li>
<li>Chữ ký và audience là hai cái mà bỏ đi là một cú bypass trọn vẹn.</li>
<li>Kiểm chữ ký theo <code>kid</code> với JWKS, chọn thuật toán từ khoá (4.2).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-4-4-khoa-va-jwks', title: 'Xem lại Chương 4 — bài 4.4: khoá, kid và JWKS', sub: 'Phép kiểm 2 đúng là phần xác minh JWKS bạn dựng ở Chương 4, nay được một client dùng để tin token của một service khác. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 4.4 →' })}
</div>
`,
};
