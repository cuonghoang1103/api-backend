/**
 * Authentication · Chương 4 · 4.4 — Khoá, kid, JWKS, và xoay vòng không ngừng dịch vụ. Slug giữ: auth-4-4-khoa-va-jwks.
 * Output thật (_ma.mjs): JWKS công khai (kty OKP, crv Ed25519, không có trường d); verify theo kid bằng jose; xoay hai khoá
 * sống (UNKNOWN_KID khi gỡ khoá cũ); kid path-traversal (naive đọc keys/<kid>); đối chiếu jose hai chiều; số đo alg (perf).
 */
import G from '../giang/auth-04-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const K = CODE.keyring.split('\n');
const EDDSA = K.slice(K.findIndex((l) => l.includes('export function eddsa')), K.findIndex((l) => l.includes('export const newEd25519'))).join('\n').trim();
const J = CODE.jwks.split('\n');
const PUBJWKS = J.slice(J.findIndex((l) => l.includes('export async function publicJwks')), J.findIndex((l) => l.includes('export function jwksVerifier'))).join('\n').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 7517 — JSON Web Key (JWK) and JWK Set', 'The JWKS format a signer publishes: a “keys” array of public keys, each with a “kid” and “use” (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7517'),
  nguon('📜', 'RFC 8037 — CFRG curves for JOSE (Ed25519 / EdDSA)', 'How Ed25519 is carried in JOSE: kty OKP, crv Ed25519, alg EdDSA — LabFlow ID’s signing key (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8037'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 7517 — JSON Web Key (JWK) và JWK Set', 'Định dạng JWKS mà người ký công bố: một mảng "keys" các khoá công khai, mỗi khoá có "kid" và "use" (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7517'),
  nguon('📜', 'RFC 8037 — đường cong CFRG cho JOSE (Ed25519 / EdDSA)', 'Cách mang Ed25519 trong JOSE: kty OKP, crv Ed25519, alg EdDSA — khoá ký của LabFlow ID (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8037'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Algorithm</th><th>sig bytes</th><th>sign/s</th><th>verify/s</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>HS256</code> (HMAC)</td><td>32</td><td>~790,000</td><td>~780,000</td><td>fastest, but every verifier can also forge — one shared secret</td></tr>
<tr><td><code>EdDSA</code> (Ed25519)</td><td>64</td><td>~34,000</td><td>~11,900</td><td><strong>the default</strong>: small keys, no curve/DER traps</td></tr>
<tr><td><code>ES256</code> (P-256)</td><td>70</td><td>~48,500</td><td>~17,600</td><td>common, widely supported; JOSE/DER signature gotchas</td></tr>
<tr><td><code>RS256</code> (RSA-2048)</td><td>256</td><td>~1,760</td><td>~60,000</td><td>slow to sign, big signature; still the most interoperable</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Thuật toán</th><th>sig byte</th><th>ký/s</th><th>kiểm/s</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>HS256</code> (HMAC)</td><td>32</td><td>~790.000</td><td>~780.000</td><td>nhanh nhất, nhưng mọi bộ xác minh cũng giả mạo được — một bí mật dùng chung</td></tr>
<tr><td><code>EdDSA</code> (Ed25519)</td><td>64</td><td>~34.000</td><td>~11.900</td><td><strong>mặc định</strong>: khoá nhỏ, không bẫy đường cong/DER</td></tr>
<tr><td><code>ES256</code> (P-256)</td><td>70</td><td>~48.500</td><td>~17.600</td><td>phổ biến, hỗ trợ rộng; có bẫy chữ ký JOSE/DER</td></tr>
<tr><td><code>RS256</code> (RSA-2048)</td><td>256</td><td>~1.760</td><td>~60.000</td><td>ký chậm, chữ ký to; vẫn tương tác rộng nhất</td></tr>
</tbody>
</table>`;

export default {
  title: '4.4 — Keys, kid, JWKS, and rotating without downtime|||4.4 — Khoá, kid, JWKS, và xoay vòng không ngừng dịch vụ',
  slug: 'auth-4-4-khoa-va-jwks',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một bí mật HMAC dùng chung nghĩa là mọi bộ xác minh cũng giả mạo được; ký bằng khoá công khai EdDSA sửa điều đó — LabFlow ID giữ khoá riêng và công bố khoá công khai dưới dạng JWKS (kty OKP, crv Ed25519, không có trường d). Client đọc kid trong header, tìm JWK khớp và xác minh bằng jose; kid lạ bị từ chối trước khi chạy crypto. Xoay khoá không ngừng dịch vụ bằng hai khoá sống cùng lúc; bẫy kid path-traversal (naive đọc keys/kid từ đĩa); đối chiếu hai chiều với jose; và số ký/kiểm thật của HS256/EdDSA/ES256/RS256 (macOS arm64).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Keys, kid, JWKS, and rotating without downtime</h2>
<p class="lead">Lessons 4.2 and 4.3 made a single verifier correct. A real platform has many: LabFlow API, a chat service, a jobs worker — all must verify LabFlow ID's tokens. If we signed with a shared HMAC secret, every one of them would also be able to <em>forge</em> tokens. Public-key signing removes that: LabFlow ID keeps a private key and publishes only the public half, as a <strong>JWKS</strong>, so any service can verify and none can mint. This lesson publishes the key set, verifies by <code>kid</code>, rotates a key with zero downtime, and measures four algorithms.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>publish a JWKS of public keys and verify a token by its <code>kid</code>;</li>
<li>rotate a signing key with two keys live, signing no one out;</li>
<li>recognise and block the <code>kid</code> path-traversal attack;</li>
<li>choose a signing algorithm from real sign/verify numbers, and say why EdDSA is the default.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> this is the lesson that scales a token from one service to a platform — and it is the groundwork for Chapter 8, where LabFlow ID becomes an OpenID Connect provider and LabFlow API fetches exactly this JWKS.</p>
</div>

<h3>An everyday picture first</h3>
<p>A notary keeps a private stamp and files a <strong>specimen of its mark</strong> in a public register. Anyone can hold a document up against the register and confirm the stamp is genuine; no one can reproduce the stamp from the specimen. That is public-key signing, and the register — listed by key id — is the <strong>JWKS</strong>. Contrast a shared rubber stamp kept in a drawer everyone can open (an HMAC secret): anyone who can check a document can also forge one.</p>

<h3>The signing key, and its public half</h3>
<p>LabFlow ID signs with EdDSA (Ed25519). The keyring entry holds a key pair; the <strong>private</strong> key signs, the <strong>public</strong> key — which anyone may hold — only verifies:</p>
${ma('javascript', EDDSA)}
<p>To let other services verify, we export the public keys as a JWKS. Note there is no private material in it:</p>
${ma('javascript', PUBJWKS)}
${ra(OUT['44-jwks'])}
<p>The JWK is <code>kty: OKP</code> (octet key pair), <code>crv: Ed25519</code>, a public <code>x</code> and the <code>kid</code> — the shape RFC 8037 defines for EdDSA in JOSE. There is <strong>no <code>d</code> field</strong>: the private half never leaves LabFlow ID. A client fetches this once (it is cacheable — the route sets <code>Cache-Control</code>), and a <code>kid</code> that is not in the set is refused before any signature maths runs.</p>

<h3>Rotating a key without downtime</h3>
<p>Keys get rotated — on a schedule, or after a suspected leak. The trick is to keep <strong>two keys live at once</strong>: publish the new one, let clients refresh their JWKS cache, switch signing to it, and only drop the old one once every token it signed has expired.</p>
${ra(OUT['44-rotate'])}
<p>On day 2 both keys verify, so tokens from the old key keep working — <em>no one is signed out</em>. On day 3, 15 minutes after the switch (one access-token lifetime), the old key is removed and its tokens become <code>UNKNOWN_KID</code>. The whole rotation never refused a live token. This is exactly why the <code>kid</code> exists: so a verifier can hold several keys and pick the right one per token.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Publish</span><span class="lz-d">Add the new <code>kid</code> to the JWKS; keep signing with the old key so clients can refresh their cache.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Switch</span><span class="lz-d">Sign new tokens with the new <code>kid</code>. Both keys are in the JWKS, so old tokens still verify.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Drop</span><span class="lz-d">After one token lifetime (15 min) every old-key token has expired; remove the old <code>kid</code> ⇒ <code>UNKNOWN_KID</code>.</span></div>
</div>

<h3>Trap: the kid is attacker input too</h3>
<p>The <code>kid</code> is a hint copied from the token header, so like <code>alg</code> it is attacker-controlled. A verifier that turns it into a <strong>file path</strong> — <code>keys/&lt;kid&gt;</code> — hands the attacker the key:</p>
${ra(OUT['44-kid'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>kid</code> as a path or a query.</strong> If <code>kid</code> selects a file (<code>keys/&lt;kid&gt;</code>) or a database row, the attacker points it at content they control or can read — here <code>../package.json</code>, a file in the public repo — and HMAC-signs with those exact bytes. The naive verifier re-reads the same bytes and the forgery passes. LabFlow ID's <code>kid</code> is only ever a <strong>property on a fixed object</strong>; an unknown <code>kid</code> is <code>UNKNOWN_KID</code>, full stop. Same lesson as <code>alg</code>: never let token input choose the key material.</p>
</div>

<h3>Cross-check with jose</h3>
<p>A standard is only worth it if it interoperates. We never wrote the EdDSA maths — Node's <code>crypto</code> and the <code>jose</code> library did. So a token <em>we</em> sign must verify in <code>jose</code>, and a token <code>jose</code> signs must verify in ours:</p>
${ra(OUT['44-jose'])}
<p>Both directions pass, so LabFlow ID speaks the same JWS/JWT as any compliant client (RFC 7515/7519). That interoperability is the whole point of using the standard rather than a bespoke token.</p>

<h3>How fast, how big — and why EdDSA</h3>
${BANG_EN}
<p>Measured 3 rounds each on macOS arm64, Node 22.23.3 (<code>node demo4/perf.mjs</code>). Read it this way: <strong>verify</strong> is the hot path (every request). HS256 is fastest but shares a secret, so it cannot be a platform's signing key — any verifier could forge. Of the public-key options, EdDSA signs fastest and avoids the DER/curve traps that make ES256 fiddly; RS256 verifies quickly but signs ~20× slower and carries a 256-byte signature (bigger tokens). EdDSA (Ed25519) is the modern default, and LabFlow ID's choice. The signing cost is irrelevant next to the argon2 at login (Chapter 2, ~86 ms): one token sign is tens of microseconds.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Why not HMAC for microservices?”</strong> — A shared secret lets every verifier forge. Public-key signing means only the issuer can mint; everyone else holds the public key and can only check.</li>
<li><strong>“How do you rotate a signing key?”</strong> — Publish the new key in the JWKS, let clients refresh, switch signing, then drop the old key after one token lifetime. Two keys live at once; nobody is signed out.</li>
<li><strong>“What is a JWKS?”</strong> — A JSON set of public keys, each with a <code>kid</code>, that a signer publishes (often at <code>/.well-known/jwks.json</code>) so verifiers can discover keys by id.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start v0.4 and <code>curl -s localhost:4800/.well-known/jwks.json</code>. Confirm there is no <code>d</code> field. Restart the server and curl again — why did the <code>x</code> change?</li>
<li>Run <code>node demo4/rotate.mjs</code>. At “day 2”, which <code>kid</code> signs new tokens, and why do old-<code>kid</code> tokens still verify?</li>
<li>Run <code>node demo4/perf.mjs</code> twice. Are your numbers close to the table? Which column would you optimise for an API that verifies 10,000 requests a second?</li>
</ol>
<p><strong>Solution:</strong> (1) no <code>d</code> — only the public half is published; the <code>x</code> changes because the demo server mints a fresh key at boot, which is exactly why clients must <em>fetch</em> the JWKS, not hard-code a key. (2) the new <code>kid</code> signs; old tokens verify because the old key is still in the keyring during the overlap. (3) verify/s — a resource server verifies far more often than anyone signs.</p>
<p><strong>Done when:</strong> you can publish a JWKS, explain two-key rotation, and justify EdDSA over HS256 for a platform in one sentence.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">public-key signing</span><span class="v">The private key signs; the public key only verifies. Only the issuer can mint.</span></div>
  <div class="kv"><span class="k">EdDSA / Ed25519</span><span class="v">A fast, small elliptic-curve signature (64 bytes, no DER). LabFlow ID's default.</span></div>
  <div class="kv"><span class="k">JWKS</span><span class="v">JSON Web Key Set: the public keys a signer publishes, each with a <code>kid</code>, for verifiers to fetch.</span></div>
  <div class="kv"><span class="k">kid (key id)</span><span class="v">Names which key signed a token; looked up in the keyring/JWKS, never used as a path.</span></div>
  <div class="kv"><span class="k">key rotation</span><span class="v">Replacing a signing key while keeping the old one live long enough that its tokens all expire first.</span></div>
  <div class="kv"><span class="k">jose</span><span class="v">The standard JS JOSE library; used here to publish the JWKS and cross-check our own tokens.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Sign with a private key, verify with a public JWKS: only the issuer can mint, everyone can check.</li>
<li>The JWKS is public keys by <code>kid</code> (OKP/Ed25519, no <code>d</code>); clients fetch and cache it.</li>
<li>Rotate with two keys live: publish, refresh, switch, drop after one token lifetime — no downtime.</li>
<li>Never turn <code>kid</code> into a file path; it is a property on a fixed object, or <code>UNKNOWN_KID</code>.</li>
<li>EdDSA is the default: fast to sign, small, no DER traps; HS256 can't be a platform key because it is shared.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-8-3-mo-rong', title: 'Compare in API Design — lesson 8.3: scaling out', sub: 'Same problem of state across many processes: there, a session in one process breaks with two replicas; here, a public JWKS lets any number of services verify without shared state or a shared secret. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Khoá, kid, JWKS, và xoay vòng không ngừng dịch vụ</h2>
<p class="lead">Bài 4.2 và 4.3 làm một bộ xác minh đúng. Một nền tảng thật có nhiều: LabFlow API, một dịch vụ chat, một worker chạy việc — tất cả phải xác minh token của LabFlow ID. Nếu ta ký bằng một bí mật HMAC dùng chung, mỗi dịch vụ đó cũng sẽ <em>giả mạo</em> được token. Ký bằng khoá công khai gỡ điều đó: LabFlow ID giữ một khoá riêng và chỉ công bố phần công khai, dưới dạng <strong>JWKS</strong>, nên dịch vụ nào cũng xác minh được và không ai đúc được. Bài này công bố tập khoá, xác minh theo <code>kid</code>, xoay một khoá không ngừng dịch vụ, và đo bốn thuật toán.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>công bố một JWKS các khoá công khai và xác minh một token theo <code>kid</code> của nó;</li>
<li>xoay một khoá ký với hai khoá sống, không đăng xuất ai;</li>
<li>nhận ra và chặn cú tấn công <code>kid</code> path-traversal;</li>
<li>chọn một thuật toán ký từ số ký/kiểm thật, và nói vì sao EdDSA là mặc định.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> đây là bài mở rộng một token từ một dịch vụ ra cả một nền tảng — và là nền cho Chương 8, nơi LabFlow ID thành một OpenID Connect provider và LabFlow API tải về đúng cái JWKS này.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Một công chứng viên giữ một con dấu riêng và lưu một <strong>mẫu dấu</strong> trong một cuốn sổ công khai. Ai cũng giơ một văn bản lên đối chiếu với cuốn sổ và xác nhận con dấu là thật; không ai tái tạo được con dấu từ cái mẫu. Đó là ký bằng khoá công khai, và cuốn sổ — liệt kê theo id khoá — là <strong>JWKS</strong>. Trái lại, một con dấu cao su dùng chung để trong một ngăn kéo ai cũng mở được (một bí mật HMAC): ai kiểm được một văn bản thì cũng làm giả được.</p>

<h3>Khoá ký, và phần công khai của nó</h3>
<p>LabFlow ID ký bằng EdDSA (Ed25519). Entry keyring giữ một cặp khoá; khoá <strong>riêng</strong> ký, khoá <strong>công khai</strong> — ai cũng có thể giữ — chỉ xác minh:</p>
${ma('javascript', EDDSA)}
<p>Để dịch vụ khác xác minh được, ta xuất các khoá công khai thành một JWKS. Để ý không có phần riêng nào trong đó:</p>
${ma('javascript', PUBJWKS)}
${ra(OUT['44-jwks'])}
<p>JWK là <code>kty: OKP</code> (cặp khoá octet), <code>crv: Ed25519</code>, một <code>x</code> công khai và cái <code>kid</code> — đúng dáng RFC 8037 định nghĩa cho EdDSA trong JOSE. <strong>Không có trường <code>d</code></strong>: phần riêng không bao giờ rời LabFlow ID. Client tải cái này một lần (cache được — tuyến đặt <code>Cache-Control</code>), và một <code>kid</code> không nằm trong tập bị khước từ trước khi chạy toán chữ ký nào.</p>

<h3>Xoay một khoá không ngừng dịch vụ</h3>
<p>Khoá cần được xoay — theo lịch, hoặc sau một nghi ngờ rò rỉ. Mánh là giữ <strong>hai khoá sống cùng lúc</strong>: công bố cái mới, để client làm mới cache JWKS, chuyển việc ký sang nó, và chỉ gỡ cái cũ khi mọi token nó đã ký đều hết hạn.</p>
${ra(OUT['44-rotate'])}
<p>Ngày 2 cả hai khoá đều xác minh, nên token từ khoá cũ vẫn chạy — <em>không ai bị đăng xuất</em>. Ngày 3, 15 phút sau khi chuyển (một tuổi thọ access token), khoá cũ bị gỡ và token của nó thành <code>UNKNOWN_KID</code>. Cả cuộc xoay vòng không bao giờ khước từ một token còn sống. Đây chính là vì sao <code>kid</code> tồn tại: để một bộ xác minh giữ nhiều khoá và chọn đúng cái cho mỗi token.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Công bố</span><span class="lz-d">Thêm <code>kid</code> mới vào JWKS; vẫn ký bằng khoá cũ để client làm mới cache.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chuyển</span><span class="lz-d">Ký token mới bằng <code>kid</code> mới. Cả hai khoá đều trong JWKS, nên token cũ vẫn xác minh được.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Gỡ</span><span class="lz-d">Sau một tuổi thọ token (15 phút) mọi token khoá cũ đã hết hạn; gỡ <code>kid</code> cũ ⇒ <code>UNKNOWN_KID</code>.</span></div>
</div>

<h3>Bẫy: kid cũng là dữ liệu của kẻ tấn công</h3>
<p><code>kid</code> là một gợi ý chép từ header token, nên như <code>alg</code>, nó do kẻ tấn công kiểm soát. Một bộ xác minh biến nó thành một <strong>đường dẫn tệp</strong> — <code>keys/&lt;kid&gt;</code> — là trao khoá cho kẻ tấn công:</p>
${ra(OUT['44-kid'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>kid</code> làm đường dẫn hay câu truy vấn.</strong> Nếu <code>kid</code> chọn một tệp (<code>keys/&lt;kid&gt;</code>) hay một dòng cơ sở dữ liệu, kẻ tấn công trỏ nó vào nội dung họ kiểm soát hoặc đọc được — ở đây <code>../package.json</code>, một tệp trong kho công khai — và HMAC-ký bằng đúng các byte đó. Bộ xác minh ngây thơ đọc lại đúng các byte đó và cú giả mạo qua. <code>kid</code> của LabFlow ID chỉ bao giờ là một <strong>thuộc tính trên một object cố định</strong>; một <code>kid</code> lạ là <code>UNKNOWN_KID</code>, hết. Cùng bài học với <code>alg</code>: không bao giờ để dữ liệu token chọn key material.</p>
</div>

<h3>Đối chiếu với jose</h3>
<p>Một chuẩn chỉ đáng giá nếu nó tương tác được. Ta không hề viết toán EdDSA — <code>crypto</code> của Node và thư viện <code>jose</code> làm. Nên một token <em>ta</em> ký phải xác minh được trong <code>jose</code>, và một token <code>jose</code> ký phải xác minh được trong của ta:</p>
${ra(OUT['44-jose'])}
<p>Cả hai chiều đều qua, nên LabFlow ID nói cùng một JWS/JWT như bất kỳ client tuân chuẩn nào (RFC 7515/7519). Tính tương tác đó là toàn bộ lý do dùng chuẩn thay vì một token tự chế.</p>

<h3>Nhanh cỡ nào, to cỡ nào — và vì sao EdDSA</h3>
${BANG_VI}
<p>Đo 3 lượt mỗi thuật toán trên macOS arm64, Node 22.23.3 (<code>node demo4/perf.mjs</code>). Đọc thế này: <strong>kiểm</strong> là đường nóng (mọi request). HS256 nhanh nhất nhưng dùng chung bí mật, nên không thể là khoá ký của một nền tảng — bộ xác minh nào cũng giả mạo được. Trong các lựa chọn khoá-công-khai, EdDSA ký nhanh nhất và né các bẫy DER/đường cong khiến ES256 lắt léo; RS256 kiểm nhanh nhưng ký chậm ~20× và mang chữ ký 256 byte (token to hơn). EdDSA (Ed25519) là mặc định hiện đại, và là lựa chọn của LabFlow ID. Chi phí ký không đáng kể bên cạnh argon2 lúc đăng nhập (Chương 2, ~86 ms): một lần ký token là vài chục micro giây.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Sao không dùng HMAC cho microservices?"</strong> — Một bí mật dùng chung cho mọi bộ xác minh giả mạo được. Ký bằng khoá công khai nghĩa là chỉ issuer đúc được; những người khác giữ khoá công khai và chỉ kiểm được.</li>
<li><strong>"Xoay một khoá ký thế nào?"</strong> — Công bố khoá mới trong JWKS, để client làm mới, chuyển việc ký, rồi gỡ khoá cũ sau một tuổi thọ token. Hai khoá sống cùng lúc; không ai bị đăng xuất.</li>
<li><strong>"JWKS là gì?"</strong> — Một tập JSON các khoá công khai, mỗi khoá có <code>kid</code>, mà người ký công bố (thường ở <code>/.well-known/jwks.json</code>) để bộ xác minh tìm khoá theo id.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Khởi động v0.4 và <code>curl -s localhost:4800/.well-known/jwks.json</code>. Xác nhận không có trường <code>d</code>. Khởi động lại máy chủ và curl lại — vì sao <code>x</code> đổi?</li>
<li>Chạy <code>node demo4/rotate.mjs</code>. Ở "ngày 2", <code>kid</code> nào ký token mới, và vì sao token <code>kid</code> cũ vẫn xác minh được?</li>
<li>Chạy <code>node demo4/perf.mjs</code> hai lần. Số của bạn có gần bảng không? Cột nào bạn sẽ tối ưu cho một API xác minh 10.000 request mỗi giây?</li>
</ol>
<p><strong>Lời giải:</strong> (1) không có <code>d</code> — chỉ phần công khai được công bố; <code>x</code> đổi vì máy chủ demo đúc một khoá mới lúc khởi động, đó chính là vì sao client phải <em>tải</em> JWKS, không hard-code một khoá. (2) <code>kid</code> mới ký; token cũ xác minh được vì khoá cũ vẫn trong keyring suốt lúc gối đầu. (3) kiểm/s — một resource server xác minh thường xuyên hơn nhiều so với ai đó ký.</p>
<p><strong>Đạt khi:</strong> bạn công bố được một JWKS, giải thích xoay hai khoá, và biện minh EdDSA hơn HS256 cho một nền tảng trong một câu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">public-key signing (ký bằng khoá công khai)</span><span class="v">Khoá riêng ký; khoá công khai chỉ xác minh. Chỉ issuer đúc được.</span></div>
  <div class="kv"><span class="k">EdDSA / Ed25519</span><span class="v">Một chữ ký đường cong elliptic nhanh, nhỏ (64 byte, không DER). Mặc định của LabFlow ID.</span></div>
  <div class="kv"><span class="k">JWKS</span><span class="v">JSON Web Key Set: các khoá công khai người ký công bố, mỗi khoá có <code>kid</code>, để bộ xác minh tải về.</span></div>
  <div class="kv"><span class="k">kid (key id)</span><span class="v">Nêu khoá nào đã ký một token; tra trong keyring/JWKS, không bao giờ dùng làm đường dẫn.</span></div>
  <div class="kv"><span class="k">key rotation (xoay khoá)</span><span class="v">Thay một khoá ký trong khi giữ khoá cũ sống đủ lâu để token của nó hết hạn trước.</span></div>
  <div class="kv"><span class="k">jose</span><span class="v">Thư viện JOSE chuẩn của JS; ở đây dùng để công bố JWKS và đối chiếu token của ta.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ký bằng khoá riêng, xác minh bằng JWKS công khai: chỉ issuer đúc được, ai cũng kiểm được.</li>
<li>JWKS là các khoá công khai theo <code>kid</code> (OKP/Ed25519, không <code>d</code>); client tải và cache nó.</li>
<li>Xoay với hai khoá sống: công bố, làm mới, chuyển, gỡ sau một tuổi thọ token — không ngừng dịch vụ.</li>
<li>Không bao giờ biến <code>kid</code> thành đường dẫn tệp; nó là một thuộc tính trên object cố định, hoặc <code>UNKNOWN_KID</code>.</li>
<li>EdDSA là mặc định: ký nhanh, nhỏ, không bẫy DER; HS256 không thể là khoá nền tảng vì nó dùng chung.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-8-3-mo-rong', title: 'So với API Design — bài 8.3: mở rộng quy mô', sub: 'Cùng bài toán trạng thái qua nhiều tiến trình: ở đó, một phiên trong một tiến trình hỏng khi có hai bản chạy; ở đây, một JWKS công khai cho bất kỳ số dịch vụ nào xác minh mà không cần trạng thái chung hay bí mật chung. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
