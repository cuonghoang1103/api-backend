/**
 * Authentication · Chương 4 · 4.1 — Tự tay giải mã một cái. Slug giữ: auth-4-1-giai-ma-bang-tay. Bài đầu chương.
 * Output thật (_ma.mjs, LabFlow ID v0.4 + jose 6.1.0, env -i): token EdDSA 381 ký tự (header 62, payload 231, sig 86 =
 * 64 byte thô); base64url giải mã payload không cần khoá; sửa role ⇒ BAD_SIGNATURE; POST /token của v0.4 phát token thật.
 */
import G from '../giang/auth-04-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const B = CODE.base64url.split('\n');
const DECODE = B.slice(B.findIndex((l) => l.includes('export function decodeJwt'))).join('\n').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 7519 — JSON Web Token (JWT)', 'The claims and the compact serialization header.payload.signature. “The JWT is represented as the concatenation … each … base64url-encoded” (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7519'),
  nguon('📜', 'RFC 7515 — JSON Web Signature (JWS)', 'What the signature covers: the signing input is the base64url header, a dot, and the base64url payload (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7515'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 7519 — JSON Web Token (JWT)', 'Các claim và cách tuần tự hoá gọn header.payload.signature. "JWT được biểu diễn là phép nối … mỗi phần … mã hoá base64url" (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7519'),
  nguon('📜', 'RFC 7515 — JSON Web Signature (JWS)', 'Chữ ký bảo vệ cái gì: signing input là base64url của header, một dấu chấm, rồi base64url của payload (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7515'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Encoding</th><th>Needs a key?</th><th>Protects what?</th><th>In a JWT</th></tr></thead>
<tbody>
<tr><td><code>base64</code> / <code>base64url</code></td><td>no</td><td>nothing — it is transport, not secrecy</td><td>the header and payload</td></tr>
<tr><td>a signature (HMAC or public-key)</td><td>yes (to make or, for HMAC, to check)</td><td><strong>integrity</strong>: you notice any change</td><td>the third part</td></tr>
<tr><td>encryption (JWE, a different standard)</td><td>yes</td><td><strong>confidentiality</strong>: others cannot read it</td><td>not used here — a JWS hides nothing</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Phép mã hoá</th><th>Cần khoá?</th><th>Bảo vệ gì?</th><th>Trong JWT</th></tr></thead>
<tbody>
<tr><td><code>base64</code> / <code>base64url</code></td><td>không</td><td>không gì — chỉ là vận chuyển, không phải bí mật</td><td>header và payload</td></tr>
<tr><td>chữ ký (HMAC hoặc khoá công khai)</td><td>có (để tạo; với HMAC thì cả để kiểm)</td><td><strong>toàn vẹn</strong>: đổi là thấy ngay</td><td>phần thứ ba</td></tr>
<tr><td>mã hoá (JWE, một chuẩn khác)</td><td>có</td><td><strong>bảo mật</strong>: người khác không đọc được</td><td>không dùng ở đây — một JWS không giấu gì</td></tr>
</tbody>
</table>`;

export default {
  title: '4.1 — Decode one by hand|||4.1 — Tự tay giải mã một cái',
  slug: 'auth-4-1-giai-ma-bang-tay',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một JWT là header.payload.signature, mỗi phần base64url. Giải mã payload chỉ bằng Buffer, không cần khoá nào — vì base64url không phải mã hoá; sửa một ký tự trong payload là chữ ký vỡ (BAD_SIGNATURE); dựng một token bằng tay với sign() sáu dòng; và LabFlow ID v0.4 phát một access token thật qua POST /token cho LabFlow API. Chốt lại: giải mã không phải xác minh, và payload là công khai.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Decode one by hand</h2>
<p class="lead">Until now LabFlow ID remembered a signed-in user with a <strong>session</strong> — a row on the server behind a cookie (Chapter 3). A session is stateful: every request costs one lookup, and revoking it is one DELETE. Chapter 4 introduces the other answer, the <strong>stateless token</strong>: a signed JSON object the client carries, that a service can trust without asking the database. To use one safely you must first stop being afraid of it — so this lesson takes a JWT apart with nothing but <code>Buffer</code>.</p>

<div class="callout ok">
<p><strong>After Chapter 4 you can:</strong> decode and hand-build a JWT; stop the two classic forgeries (<code>alg: none</code> and HS/RS confusion) by taking the algorithm from the key, not the token; validate the seven registered claims with the right clock-skew rule; publish and rotate keys through a JWKS without signing anyone out; and choose where a browser should keep a token. Lab 4 grades a verifier against a battery of hostile tokens.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>split a JWT into header, payload and signature and read the first two without any key;</li>
<li>explain why base64url is not encryption and why a JWT payload is public;</li>
<li>build a token by hand and show that editing the payload breaks the signature;</li>
<li>point to where LabFlow ID issues a real access token, and say who it is for.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> every SEP490 team that reaches for “JWT auth” copies three lines from a blog and trusts whatever comes back. After this lesson you read the token yourself, and you know that reading it proved nothing.</p>
</div>

<h3>An everyday picture first</h3>
<p>A JWT is a <strong>parcel with a wax seal</strong>, not a locked box. Anyone can read the label — sender, recipient, what is inside — because it is printed in the open. What the seal buys you is not secrecy: it is that you <em>notice the instant</em> someone opened the parcel and resealed it, because they cannot reproduce the seal. That is exactly a signed token. The claims are in plain sight; the signature only tells you whether they were changed. Keep the contrast with Chapter 3 in mind: a session is a cloakroom ticket the counter looks up; a JWT is the sealed parcel the bearer carries, that any trusting party can check on its own.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">header</span><span class="lz-d">base64url(JSON) — <code>{"alg":"EdDSA","typ":"JWT","kid":"ed-2026-11"}</code>. Which algorithm, which key.</span></div>
  <div class="lz-layer"><span class="lz-k">payload</span><span class="lz-d">base64url(JSON) — the claims: who, for whom, until when. <strong>Readable by anyone.</strong></span></div>
  <div class="lz-layer"><span class="lz-k">signature</span><span class="lz-d">raw bytes over <code>header.payload</code>, base64url. The only part a key touches.</span></div>
</div>

<h3>Three parts, two of them plain text</h3>
<p>LabFlow ID issues a token for Cô Lan and we take it apart. <code>decodeJwt</code> is the whole trick — split on the dots, base64url-decode the two JSON parts:</p>
${ma('javascript', DECODE)}
${ra(OUT['41-decode'])}
<p>No key was used, and nothing was verified. The header names the algorithm (<code>EdDSA</code>) and the key id (<code>kid</code>); the payload lists the claims (lesson 4.3); the signature decodes to exactly 64 raw bytes, because an Ed25519 signature is always 64 bytes. The <code>signingInput</code> — <code>header.payload</code> — is the string the signature actually covers.</p>

<h3>base64url is not encryption</h3>
<p><code>base64url</code> (RFC 4648 §5) is plain base64 made URL-safe: <code>+</code> and <code>/</code> become <code>-</code> and <code>_</code>, and the <code>=</code> padding is dropped. It carries bytes through a URL; it hides nothing.</p>
${BANG_EN}
<p>A JWT uses a <strong>signature</strong>, not encryption. So a JWT proves integrity, not secrecy. (There is a separate standard, JWE, that encrypts — we do not use it here, and most APIs do not.)</p>

<h3>Edit the payload, break the seal</h3>
<p>Because the payload is readable and re-encodable, An can rewrite her own role to <code>LAB_MANAGER</code>. She keeps the old signature, because she has no private key to make a new one:</p>
${ra(OUT['41-tamper'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — “the payload says admin, so I am admin”.</strong> The payload is a claim, not a fact, until the signature over it checks out. A server that reads <code>role</code> before verifying the signature is trusting the attacker's text. The verifier returns <code>BAD_SIGNATURE</code>: the signature covers <code>header.payload</code> byte for byte, so changing one character of the payload invalidates it. Decoding is free; only verifying (lesson 4.2) means anything.</p>
</div>

<h3>Building one by hand</h3>
<p>Signing is the mirror of decoding: base64url the header, base64url the payload, join with a dot, sign that string, append the signature. That is the entire <code>sign()</code>:</p>
${ma('javascript', CODE.sign)}
<p>The header carries <code>alg</code> and <code>kid</code> so a verifier knows which key to use — but, as lesson 4.2 shows, it must take the algorithm from the key it looks up, never from this attacker-writable header.</p>

<h3>LabFlow ID issues a real one</h3>
<p>Version 0.4 adds <code>POST /token</code>. An signs in (her session cookie from Chapter 3), then asks LabFlow ID for an access token for <strong>LabFlow API</strong> — a different service:</p>
${ra(OUT['41-issue'])}
<p>The <code>access_token</code> is a JWT; the client splits it and reads the payload with no key, exactly as we did. Its <code>aud</code> is <code>labflow-api</code> and it lasts <code>900</code> seconds — the 15-minute access-token lifetime the whole platform shares (lesson 1.1, API Design 6.1). The session proves who An is <em>here</em>; the token carries that fact, signed, to a service that will never see her password or her session — only her token and our public key (lesson 4.4).</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Is a JWT encrypted?”</strong> — No. A JWS is signed, not encrypted; the payload is base64url and anyone can read it. Encryption is JWE, a separate thing most APIs do not use.</li>
<li><strong>“Can I store the user's email / a flag in the JWT?”</strong> — Only if it is fine for the user and any proxy to read it. Never a secret. And remember it is frozen until the token expires.</li>
<li><strong>“Session or JWT?”</strong> — A session is revocable instantly and costs a lookup; a JWT avoids the lookup but cannot be un-issued before it expires (lesson 4.3). LabFlow ID keeps the session for itself and mints JWTs for <em>other</em> services.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo4/decode.mjs</code>. Copy the payload's base64url middle part and decode it yourself: <code>node -e "console.log(Buffer.from('&lt;paste&gt;','base64url').toString())"</code>. Did you need a key?</li>
<li>In <code>demo4/tamper.mjs</code>, change the forgery to edit <code>sub</code> instead of <code>role</code>. Predict the verifier's answer before running.</li>
<li>Start v0.4 (<code>npm start</code>) and run <code>bash demo4/issue.sh</code>. What is the token's <code>aud</code>, and why is it not <code>https://id.labflow.example</code>?</li>
</ol>
<p><strong>Solution:</strong> (1) no key — base64url decode is public, which is the whole point of the lesson. (2) <code>BAD_SIGNATURE</code> again; any change to the payload breaks the seal. (3) <code>aud</code> is <code>labflow-api</code>: the token is minted by LabFlow ID (the <code>iss</code>) <em>for</em> LabFlow API, so the audience is the API, not the issuer.</p>
<p><strong>Done when:</strong> you can decode a token's payload without a library, and you can say in one sentence why that does not make it trustworthy.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token: a set of claims as a signed (JWS) or encrypted (JWE) token. Here, always signed.</span></div>
  <div class="kv"><span class="k">JWS compact serialization</span><span class="v">The <code>header.payload.signature</code> form, each part base64url.</span></div>
  <div class="kv"><span class="k">base64url</span><span class="v">URL-safe base64 (<code>-_</code> instead of <code>+/</code>, no padding). Encoding, not encryption.</span></div>
  <div class="kv"><span class="k">claim</span><span class="v">A name/value in the payload (<code>sub</code>, <code>exp</code>, <code>role</code>…). Public and, until verified, unproven.</span></div>
  <div class="kv"><span class="k">signing input</span><span class="v">The <code>header.payload</code> string the signature is computed over.</span></div>
  <div class="kv"><span class="k">access token</span><span class="v">A short-lived token a client sends to a resource server to prove it may act (15 min here).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A JWT is <code>header.payload.signature</code>, each base64url; the first two are plain JSON.</li>
<li>Decoding needs no key — base64url is transport, not secrecy. Never put a secret in the payload.</li>
<li>The signature covers <code>header.payload</code>; editing the payload gives <code>BAD_SIGNATURE</code>.</li>
<li>Signing is six lines: encode, join, sign, append.</li>
<li>LabFlow ID v0.4 issues a 15-minute access token for LabFlow API via <code>POST /token</code>.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Compare in API Design — lesson 6.1: authenticating an API', sub: 'Same: a bearer access token, 15-minute lifetime, HS256 built from scratch. That lesson uses one shared HMAC secret for a single API; this one takes the token apart byte by byte and moves to public-key signing so other services can verify without the secret. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tự tay giải mã một cái</h2>
<p class="lead">Tới giờ LabFlow ID nhớ một người đã đăng nhập bằng <strong>phiên (session)</strong> — một dòng trên máy chủ nấp sau một cookie (Chương 3). Phiên là có trạng thái: mỗi request tốn một lần tra, và thu hồi là một lệnh DELETE. Chương 4 giới thiệu câu trả lời còn lại, <strong>token không trạng thái (stateless token)</strong>: một đối tượng JSON có ký mà client mang theo, một dịch vụ tin được mà không cần hỏi cơ sở dữ liệu. Muốn dùng nó an toàn thì trước hết đừng sợ nó — nên bài này mổ một JWT ra chỉ bằng <code>Buffer</code>.</p>

<div class="callout ok">
<p><strong>Học xong Chương 4 bạn làm được:</strong> giải mã và tự tay dựng một JWT; chặn hai cú giả mạo kinh điển (<code>alg: none</code> và nhầm lẫn thuật toán HS/RS) bằng cách lấy thuật toán từ khoá chứ không từ token; kiểm bảy claim chuẩn với đúng luật dung sai đồng hồ; phát và xoay khoá qua JWKS mà không đăng xuất ai; và chọn chỗ trình duyệt nên cất token. Lab 4 chấm một bộ xác minh trước cả một rổ token thù địch.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>tách một JWT thành header, payload, signature và đọc hai phần đầu mà không cần khoá nào;</li>
<li>giải thích vì sao base64url không phải mã hoá và vì sao payload của JWT là công khai;</li>
<li>dựng một token bằng tay và chỉ ra rằng sửa payload là vỡ chữ ký;</li>
<li>chỉ được chỗ LabFlow ID phát một access token thật, và nói nó dành cho ai.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> đội SEP490 nào động tới "JWT auth" cũng chép ba dòng từ một bài blog rồi tin vào bất cứ gì trả về. Học xong bài này, bạn tự đọc token, và bạn biết đọc được nó chẳng chứng minh điều gì.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Một JWT là một <strong>kiện hàng có niêm phong sáp</strong>, không phải một cái hộp khoá. Ai cũng đọc được cái nhãn — người gửi, người nhận, bên trong là gì — vì nó in lồ lộ. Cái niêm phong mua cho bạn không phải sự bí mật: nó cho bạn <em>biết ngay khoảnh khắc</em> có người mở kiện ra rồi niêm lại, vì họ không tái tạo được cái dấu. Đó chính là một token có ký. Các claim bày ra trước mắt; chữ ký chỉ cho bạn biết chúng có bị sửa không. Giữ sự đối lập với Chương 3 trong đầu: phiên là tấm vé gửi đồ mà quầy tra lại; JWT là kiện hàng niêm phong người cầm mang theo, mà bất cứ bên nào tin tưởng cũng tự kiểm được.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">header</span><span class="lz-d">base64url(JSON) — <code>{"alg":"EdDSA","typ":"JWT","kid":"ed-2026-11"}</code>. Thuật toán nào, khoá nào.</span></div>
  <div class="lz-layer"><span class="lz-k">payload</span><span class="lz-d">base64url(JSON) — các claim: ai, cho ai, tới khi nào. <strong>Ai cũng đọc được.</strong></span></div>
  <div class="lz-layer"><span class="lz-k">signature</span><span class="lz-d">các byte thô ký trên <code>header.payload</code>, rồi base64url. Phần duy nhất mà khoá chạm vào.</span></div>
</div>

<h3>Ba phần, hai phần là chữ thường</h3>
<p>LabFlow ID phát một token cho Cô Lan và ta mổ nó ra. <code>decodeJwt</code> là toàn bộ mánh — tách theo dấu chấm, base64url-giải mã hai phần JSON:</p>
${ma('javascript', DECODE)}
${ra(OUT['41-decode'])}
<p>Không khoá nào được dùng, và không gì được xác minh. Header nêu thuật toán (<code>EdDSA</code>) và id khoá (<code>kid</code>); payload liệt kê các claim (bài 4.3); signature giải mã đúng 64 byte thô, vì chữ ký Ed25519 luôn là 64 byte. <code>signingInput</code> — <code>header.payload</code> — là cái chuỗi mà chữ ký thật sự bảo vệ.</p>

<h3>base64url không phải mã hoá</h3>
<p><code>base64url</code> (RFC 4648 §5) là base64 thường làm cho an toàn với URL: <code>+</code> và <code>/</code> thành <code>-</code> và <code>_</code>, bỏ phần đệm <code>=</code>. Nó mang byte qua một URL; nó không giấu gì.</p>
${BANG_VI}
<p>Một JWT dùng <strong>chữ ký</strong>, không phải mã hoá. Nên một JWT chứng minh tính toàn vẹn, không phải sự bí mật. (Có một chuẩn riêng, JWE, mã hoá — ta không dùng ở đây, và phần lớn API cũng không.)</p>

<h3>Sửa payload, vỡ niêm phong</h3>
<p>Vì payload đọc được và mã hoá lại được, An có thể sửa chính role của mình thành <code>LAB_MANAGER</code>. Cô giữ chữ ký cũ, vì không có khoá riêng để tạo cái mới:</p>
${ra(OUT['41-tamper'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "payload ghi admin nên tôi là admin".</strong> Payload là một lời khai, không phải sự thật, cho tới khi chữ ký trên nó được kiểm. Một máy chủ đọc <code>role</code> trước khi xác minh chữ ký là đang tin vào chữ của kẻ tấn công. Bộ xác minh trả về <code>BAD_SIGNATURE</code>: chữ ký bảo vệ <code>header.payload</code> từng byte, nên đổi một ký tự trong payload là vô hiệu hoá nó. Giải mã thì miễn phí; chỉ xác minh (bài 4.2) mới có nghĩa.</p>
</div>

<h3>Dựng một cái bằng tay</h3>
<p>Ký là tấm gương của giải mã: base64url cái header, base64url cái payload, nối bằng dấu chấm, ký cái chuỗi đó, nối chữ ký vào. Đó là toàn bộ <code>sign()</code>:</p>
${ma('javascript', CODE.sign)}
<p>Header mang <code>alg</code> và <code>kid</code> để bộ xác minh biết dùng khoá nào — nhưng, như bài 4.2 chỉ ra, nó phải lấy thuật toán từ khoá mà nó tra được, không bao giờ từ cái header kẻ tấn công ghi được này.</p>

<h3>LabFlow ID phát một cái thật</h3>
<p>Phiên bản 0.4 thêm <code>POST /token</code>. An đăng nhập (cookie phiên của cô từ Chương 3), rồi xin LabFlow ID một access token cho <strong>LabFlow API</strong> — một dịch vụ khác:</p>
${ra(OUT['41-issue'])}
<p><code>access_token</code> là một JWT; client tách nó ra và đọc payload không cần khoá, đúng cách ta vừa làm. <code>aud</code> của nó là <code>labflow-api</code> và nó sống <code>900</code> giây — tuổi thọ access token 15 phút mà cả nền tảng dùng chung (bài 1.1, API Design 6.1). Phiên chứng minh An là ai <em>ở đây</em>; token mang sự thật đó, có ký, tới một dịch vụ sẽ không bao giờ thấy mật khẩu hay phiên của cô — chỉ thấy token của cô và khoá công khai của ta (bài 4.4).</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"JWT có được mã hoá không?"</strong> — Không. Một JWS được ký, không mã hoá; payload là base64url và ai cũng đọc được. Mã hoá là JWE, một thứ riêng mà phần lớn API không dùng.</li>
<li><strong>"Tôi để email người dùng / một cờ trong JWT được không?"</strong> — Chỉ khi để người dùng và mọi proxy đọc thấy cũng không sao. Không bao giờ để bí mật. Và nhớ rằng nó bị đóng băng tới khi token hết hạn.</li>
<li><strong>"Session hay JWT?"</strong> — Phiên thu hồi được tức thì và tốn một lần tra; JWT né được lần tra nhưng không thể bị huỷ trước khi hết hạn (bài 4.3). LabFlow ID giữ phiên cho riêng mình và phát JWT cho các dịch vụ <em>khác</em>.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo4/decode.mjs</code>. Chép phần giữa base64url của payload và tự giải mã: <code>node -e "console.log(Buffer.from('&lt;dán&gt;','base64url').toString())"</code>. Bạn có cần khoá không?</li>
<li>Trong <code>demo4/tamper.mjs</code>, đổi cú giả mạo để sửa <code>sub</code> thay vì <code>role</code>. Đoán câu trả lời của bộ xác minh trước khi chạy.</li>
<li>Khởi động v0.4 (<code>npm start</code>) và chạy <code>bash demo4/issue.sh</code>. <code>aud</code> của token là gì, và vì sao không phải <code>https://id.labflow.example</code>?</li>
</ol>
<p><strong>Lời giải:</strong> (1) không cần khoá — base64url giải mã là công khai, đó chính là ý của cả bài. (2) lại là <code>BAD_SIGNATURE</code>; mọi thay đổi payload đều vỡ niêm phong. (3) <code>aud</code> là <code>labflow-api</code>: token do LabFlow ID (cái <code>iss</code>) phát <em>cho</em> LabFlow API, nên audience là API, không phải issuer.</p>
<p><strong>Đạt khi:</strong> bạn giải mã được payload của một token mà không cần thư viện, và nói được một câu vì sao điều đó không làm nó đáng tin.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token: một bộ claim dưới dạng token có ký (JWS) hoặc mã hoá (JWE). Ở đây luôn là có ký.</span></div>
  <div class="kv"><span class="k">JWS compact serialization (tuần tự hoá gọn)</span><span class="v">Dạng <code>header.payload.signature</code>, mỗi phần base64url.</span></div>
  <div class="kv"><span class="k">base64url</span><span class="v">base64 an toàn URL (<code>-_</code> thay cho <code>+/</code>, không đệm). Là mã hoá chuyển dạng, không phải mã hoá bí mật.</span></div>
  <div class="kv"><span class="k">claim</span><span class="v">Một cặp tên/giá trị trong payload (<code>sub</code>, <code>exp</code>, <code>role</code>…). Công khai và, cho tới khi xác minh, chưa được chứng minh.</span></div>
  <div class="kv"><span class="k">signing input (chuỗi được ký)</span><span class="v">Chuỗi <code>header.payload</code> mà chữ ký được tính trên đó.</span></div>
  <div class="kv"><span class="k">access token</span><span class="v">Token ngắn hạn client gửi tới một resource server để chứng minh được phép làm (ở đây 15 phút).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một JWT là <code>header.payload.signature</code>, mỗi phần base64url; hai phần đầu là JSON thường.</li>
<li>Giải mã không cần khoá — base64url là vận chuyển, không phải bí mật. Đừng bao giờ để bí mật trong payload.</li>
<li>Chữ ký bảo vệ <code>header.payload</code>; sửa payload cho ra <code>BAD_SIGNATURE</code>.</li>
<li>Ký gồm sáu dòng: mã hoá, nối, ký, nối chữ ký.</li>
<li>LabFlow ID v0.4 phát một access token 15 phút cho LabFlow API qua <code>POST /token</code>.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'So với API Design — bài 6.1: xác thực một API', sub: 'Giống: một access token kiểu bearer, tuổi thọ 15 phút, HS256 tự dựng. Bài đó dùng một bí mật HMAC dùng chung cho một API duy nhất; bài này mổ token ra từng byte và chuyển sang ký bằng khoá công khai để dịch vụ khác xác minh được mà không cần bí mật. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
