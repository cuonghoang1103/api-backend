/**
 * Authentication · Chương 1 · 1.4 — Băm, MAC, chữ ký: ba công cụ, một sự nhầm lẫn. Slug giữ: auth-1-4-bam-mac-chu-ky.
 * Soạn lại 01/11/2026 (đợt mẫu). Mọi code/output từ ./_ma.mjs (LabFlow ID chạy thật trong env -i, Node 22.23.3).
 * Số đo: length extension thật (SHA-256 tự viết, khớp node:crypto) — sha256(secret+msg) NHẬN role=LAB_MANAGER, HMAC từ chối;
 * khoá 18 byte đoán ra ở lần thử 18; AES-CTR lật admin false→true, GCM từ chối; Ed25519 ký bằng khoá công khai ⇒
 * ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE. Bỏ output giả của bản cũ (mã HMAC "8f1a2c05…", "<Buffer 3d 9c…>") và các khẳng định
 * về hạ tầng CuongThai không kiểm được.
 */
import G from '../giang/auth-01-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const LE = CODE.lengthExt.split('\n');
const LE_CORE = [...LE.slice(4, 8), '…', ...LE.slice(16, 31)].join('\n');
const SK = CODE.sharedKey.split('\n');
const SK_CORE = [SK[7], SK[9], SK[14], '', SK[18], SK[19], SK[20], SK[21]].join('\n');
const EN = CODE.encrypt.split('\n');
const ENC = [...EN.slice(6, 17), '// … then the same edit on AES-256-GCM (lines 20–31 of the file)'].join('\n');
const SIGNED = CODE.signed.split('\n').slice(17).join('\n');
const GUESS = OUT['14-thuc-hanh-ma'].split('\n').slice(1).join('\n');

const NGUON_EN = [
  nguon('🔏', 'RFC 2104 — HMAC: Keyed-Hashing for Message Authentication (1997)', 'Krawczyk, Bellare, Canetti: H(K ⊕ opad, H(K ⊕ ipad, text)), ipad 0x36, opad 0x5C (read 01/11/2026).', 'https://datatracker.ietf.org/doc/html/rfc2104'),
  nguon('➕', 'Wikipedia — Length extension attack', 'MD5, SHA-1 and most of SHA-2 are vulnerable; SHA-3, truncated SHA-2 and HMAC are not; cites the 2009 Flickr API forgery by Thai Duong and Juliano Rizzo (read 01/11/2026).', 'https://en.wikipedia.org/wiki/Length_extension_attack'),
  nguon('✍️', 'Node.js 22 docs — crypto (sign, verify, GCM auth tag)', 'decipher.final() throws if the GCM ciphertext was tampered with (read 01/11/2026).', 'https://nodejs.org/docs/latest-v22.x/api/crypto.html'),
].join('\n');
const NGUON_VI = [
  nguon('🔏', 'RFC 2104 — HMAC: băm có khoá để xác thực thông điệp (1997)', 'Krawczyk, Bellare, Canetti: H(K ⊕ opad, H(K ⊕ ipad, text)), ipad 0x36, opad 0x5C (đọc 01/11/2026).', 'https://datatracker.ietf.org/doc/html/rfc2104'),
  nguon('➕', 'Wikipedia — Length extension attack', 'MD5, SHA-1 và phần lớn SHA-2 dính; SHA-3, SHA-2 cắt ngắn và HMAC thì không; dẫn vụ giả chữ ký API Flickr 2009 của Thai Duong và Juliano Rizzo (đọc 01/11/2026).', 'https://en.wikipedia.org/wiki/Length_extension_attack'),
  nguon('✍️', 'Tài liệu Node.js 22 — crypto (sign, verify, thẻ xác thực GCM)', 'decipher.final() ném lỗi nếu bản mã GCM đã bị sửa (đọc 01/11/2026).', 'https://nodejs.org/docs/latest-v22.x/api/crypto.html'),
].join('\n');


export default {
  title: '1.4 — Hash, MAC, signature: three tools, one confusion|||1.4 — Băm, MAC, chữ ký: ba công cụ, một sự nhầm lẫn',
  slug: 'auth-1-4-bam-mac-chu-ky',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Băm, MAC và chữ ký trả lời ba câu hỏi khác nhau — chạy thật cả ba trên cùng một thông điệp; tấn công length extension THẬT lên sha256(bí mật + thông điệp) (đổi role thành LAB_MANAGER, HMAC thì chặn); một khoá HMAC dùng chung cho mọi dịch vụ = ai kiểm được cũng giả được, Ed25519 thì không; mã hoá không phải toàn vẹn (AES-CTR bị lật false→true, GCM từ chối); giá trị có ký kèm hạn và kid của LabFlow ID.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Hash, MAC, signature: three tools, one confusion</h2>
<p class="lead">Hashes, MACs and signatures all turn a message into a short string of bytes, so they look interchangeable. They are not: each answers a different question, and picking the wrong one rarely throws an error — it ships a system that looks secure and lets someone forge a role. This lesson runs all three on one LabFlow message, then breaks the two classic mix-ups for real.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>say what a hash, a MAC and a signature each prove — and what they do not;</li>
<li>show, with a working forgery, why <code>sha256(secret + message)</code> is not a MAC and HMAC is;</li>
<li>decide between HS256-style shared keys and Ed25519/RSA keys when several services verify tokens;</li>
<li>explain why encryption without authentication lets an attacker edit data they cannot read;</li>
<li>use LabFlow ID's <code>signValue</code>/<code>verifyValue</code>: a value with an expiry and a key id.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> every JWT (Chapter 4), signed cookie (Chapter 3), webhook (lesson 1.3) and OIDC token (Chapter 8) is one of these three tools. Interviewers love “what is the difference between hashing, encryption and signing?”.</p>
</div>

<h3>Three questions, three tools</h3>
<p>A <strong>hash</strong> is a fingerprint: anyone can take one, a forger too. A <strong>MAC</strong> (message authentication code) is a wax seal from a stamp you share with a colleague: only stamp holders make it, but either could have. A <strong>signature</strong> is a notary seal: one stamp, a public specimen anyone can compare.</p>
${ma('javascript', CODE.threeTools)}
${ra(OUT['14-ba-cong-cu'])}
<p>One changed character changes the whole SHA-256 — but the attacker can compute the new one too, so a hash beside its data proves nothing. The HMAC needs <code>DEMO_HMAC_KEY</code> to make <em>and</em> to check. The Ed25519 signature verifies with the public key, fails on a changed message, and the public key <strong>cannot sign</strong> (<code>ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE</code>).</p>
<p>None of the three hides anything. A signed or MAC-ed value is still readable — that is why Chapter 4 says never to put secrets inside a JWT.</p>

<h3>The broken MAC that has a name: length extension</h3>
<p>The homemade MAC everyone writes first is <code>sha256(secret + message)</code>: the attacker lacks the secret, so surely they cannot hash. But SHA-256 works in 64-byte blocks and its output <strong>is</strong> its internal state after the last block. Load a digest back as the state, keep hashing, and you get a valid digest for <code>secret + message + padding + anything</code> — no secret needed.</p>
<p>To show this is no trick, <code>demo1/sha256.mjs</code> writes SHA-256 out in ~45 lines with one extra ability: <code>sha256(data, fromDigest, doneLen)</code> starts from a given digest. The attack:</p>
${ma('javascript', LE_CORE)}
${ra(OUT['14-noi-dai'])}
<p>Our SHA-256 agrees with Node's. An appended SHA-256's own padding (<code>\\x80</code>, zeros, the length in bits) plus <code>&amp;role=LAB_MANAGER</code>, computed a new tag from the old one, and the server accepted it; <code>URLSearchParams</code> keeps the last <code>role=</code>, so An is a lab manager. HMAC hashes twice with the key at both ends — <code>H(K ⊕ opad, H(K ⊕ ipad, message))</code>, RFC 2104 — so the outer hash hides the inner state and the same arithmetic fails.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — “but the attacker does not know the key length”.</strong> They do not need to: they try 1, 2, 3… bytes and keep the guess the server accepts (the practice task below finds an 18-byte key on try 18). This is not theory — a 2009 forgery against Flickr's API signatures used exactly this construction (Thai Duong and Juliano Rizzo). Use <code>createHmac</code>; it costs the same.</p>
</div>

<h3>One shared key across services: whoever checks can forge</h3>
<p>A MAC makes and checks with the same key — fine while LabFlow ID checks its own values, not fine once a <em>second</em> service must check them. LabFlow ID issues JWT-shaped tokens (<code>payload.tag</code>); billing gets the key “only to verify” (design A) or only a public key (design B):</p>
${ma('javascript', SK_CORE)}
${ra(OUT['14-khoa-chung'])}
<ul>
<li><strong>Design A (shared HMAC key):</strong> billing minted <code>role: 'LAB_MANAGER'</code> and it checks out exactly like a real token. Any bug in any service that holds the key — or any contractor who works on it — can issue tokens for everybody.</li>
<li><strong>Design B (Ed25519):</strong> billing holds only the public key. It verifies An's token, cannot sign, and cannot move An's signature onto a new payload.</li>
</ul>
<table>
<thead><tr><th>Situation</th><th>Choose</th></tr></thead>
<tbody>
<tr><td>One service issues <em>and</em> verifies (LabFlow ID's own cookies, Lab 1)</td><td>HMAC (HS256) — simpler, one secret</td></tr>
<tr><td>Other services must verify but must not issue</td><td>Signatures: Ed25519 (EdDSA), then ES256, then RS256 for widest support</td></tr>
<tr><td>Third parties verify (OIDC clients — Chapter 8)</td><td>Signatures + public keys published as a JWKS URL (Chapter 4)</td></tr>
</tbody>
</table>

<h3>Encryption is a fourth tool — and not a seal</h3>
<p>A common reflex: “the client must not change it, so let's encrypt it.” Encryption hides content; on its own it does not detect changes. In counter mode (AES-CTR) the ciphertext is the plaintext XOR a keystream, so flipping a bit in the ciphertext flips the same bit in the plaintext. If the attacker knows the format, they can edit it blind:</p>
${ma('javascript', ENC)}
${ra(OUT['14-ma-hoa'])}
<p>The attacker never learned the key, yet <code>"admin":false</code> decrypted as <code>"admin":true </code> (the space keeps the length and JSON still parses). AES-GCM is an <strong>AEAD</strong> mode (authenticated encryption): it adds a tag, and Node's <code>decipher.final()</code> throws when the ciphertext was touched. Rule: never encrypt without authenticating — and before encrypting at all, ask whether the client needs the value; a random id that means something only on the server needs no encryption.</p>

<h3>LabFlow ID's tool: a signed value with an expiry and a key id</h3>
<p>The shape LabFlow ID reuses for cookies (Chapter 3) and you build in Lab 1: <code>base64url(value).exp.kid.HMAC</code>. The <strong>key id</strong> (<code>kid</code>) lets you rotate keys — sign with the new one while values signed with the old one live until you remove it (Chapter 11). <code>signValue</code> builds the string; here is the check, and <code>demo1/signed-demo.mjs</code> run against a fixed clock:</p>
${ma('javascript', SIGNED)}
${ra(OUT['14-ky-gia-tri'])}
<p>Changing the value or pushing the expiry later both break the HMAC; at exactly <code>exp</code> the value is dead (+899 s alive, +900 s null); removing <code>k1</code> retires every value it signed. Two details matter: the signature is checked <em>before</em> the expiry is trusted, and <code>Object.hasOwn</code> stops a kid like <code>toString</code> from finding a function on the prototype.</p>

<h3>Which tool for which question</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Random token on file?</span><span class="lz-d">Store its SHA-256, look it up (lesson 1.3).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Your own value, your own check?</span><span class="lz-d">HMAC — <code>signValue</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Others must check, not issue?</span><span class="lz-d">Signature, public key published.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Client must not READ it?</span><span class="lz-d">AEAD (AES-GCM) — after asking if they need it at all.</span></div>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Hashing vs encryption vs signing?”</strong> — Hashing is one-way with no key (integrity only if the hash is trusted); encryption is reversible with a key (secrecy); signing proves who made it (private key signs, public key verifies). A MAC is a keyed hash that proves integrity to key holders.</li>
<li><strong>“HS256 or RS256 for our JWTs?”</strong> — HS256 when the issuer is the only verifier; asymmetric (EdDSA/ES256/RS256) as soon as another service verifies, because with HS256 every verifier can mint tokens.</li>
<li><strong>“Why HMAC and not sha256(key + message)?”</strong> — Length extension: the digest is the internal state, so the attacker can append data and compute a valid tag. I forged one in under 60 lines.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo1/length-extension.mjs</code>, then change <code>tagNaive</code> to <code>createHmac</code> and run again: the forgery must fail.</li>
<li>Write <code>demo1/guess-key-length.mjs</code>: the server's key is 16–32 random bytes; try every length from 1 to 64 until the server accepts a forged <code>&amp;role=LAB_MANAGER</code>.</li>
<li>With <code>signValue</code>, sign <code>usr_2|STUDENT</code> for 60 seconds with kid <code>k2</code>, then show that it is valid at +59 s and <code>null</code> at +60 s.</li>
</ol>
<p><strong>Solution for step 2 and real output:</strong></p>
${ma('javascript', GUESS)}
${ra(OUT['14-thuc-hanh-do-dai'])}
<p><strong>Done when:</strong> the HMAC version prints <code>false</code>, your loop finds the key length (ours: try 18, real 18) without knowing the key, and your <code>usr_2</code> value dies exactly at its expiry, like the +899/+900 rows above.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash</span><span class="v">A keyless, one-way fingerprint of bytes (SHA-256). Proves “same bytes”, never “who”.</span></div>
  <div class="kv"><span class="k">MAC / HMAC</span><span class="v">A keyed hash; HMAC (RFC 2104) is the standard construction, immune to length extension.</span></div>
  <div class="kv"><span class="k">digital signature</span><span class="v">Made with a private key, checked with the public key (Ed25519, ECDSA, RSA).</span></div>
  <div class="kv"><span class="k">length extension</span><span class="v">Continuing a Merkle–Damgård hash (MD5, SHA-1, SHA-256) from a known digest to forge <code>hash(secret + msg + extra)</code>.</span></div>
  <div class="kv"><span class="k">AEAD</span><span class="v">Authenticated encryption (AES-GCM, ChaCha20-Poly1305): secrecy plus a tag that detects changes.</span></div>
  <div class="kv"><span class="k">kid (key id)</span><span class="v">A label inside a signed value that says which key made it — what makes rotation possible.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Hash = same bytes (anyone can make it); MAC = a key holder made it; signature = this private key made it, anyone can check.</li>
<li><code>sha256(secret + message)</code> was forged for real; HMAC refused the same forgery.</li>
<li>A shared HMAC key turns every verifier into an issuer; use signatures when others verify.</li>
<li>Encryption without a tag is editable (CTR: false → true); use AES-GCM, and first ask if you need encryption at all.</li>
<li>LabFlow ID's <code>signValue</code>: base64url value + expiry + kid + HMAC; check the signature, then the expiry.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Applied in API Design — lesson 6.1: a JWT built by hand', sub: 'Same: HS256 is HMAC-SHA256 over header.payload, the server (not the token) picks the algorithm, a changed payload fails. That lesson issues 15-minute tokens for LabFlow API and attacks them (alg none); this one explains which primitive to choose and why a shared HMAC key is dangerous. Each stands on its own; Chapter 4 goes deeper.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Băm, MAC, chữ ký: ba công cụ, một sự nhầm lẫn</h2>
<p class="lead">Băm, MAC và chữ ký đều biến một thông điệp thành một chuỗi byte ngắn, nên trông như thay nhau được. Không phải vậy: mỗi cái trả lời một câu hỏi khác nhau, và chọn sai hiếm khi ném lỗi — nó cho ra một hệ thống trông an toàn mà để người khác giả được vai trò. Bài này chạy cả ba trên cùng một thông điệp của LabFlow, rồi phá thật hai kiểu nhầm lẫn kinh điển.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nói được băm, MAC và chữ ký mỗi cái chứng minh gì — và không chứng minh gì;</li>
<li>chỉ ra bằng một lần giả mạo chạy thật vì sao <code>sha256(bí mật + thông điệp)</code> không phải MAC còn HMAC thì phải;</li>
<li>chọn giữa khoá dùng chung kiểu HS256 và khoá Ed25519/RSA khi nhiều dịch vụ cùng kiểm token;</li>
<li>giải thích vì sao mã hoá mà không xác thực thì kẻ tấn công sửa được dữ liệu họ không đọc được;</li>
<li>dùng <code>signValue</code>/<code>verifyValue</code> của LabFlow ID: một giá trị có hạn dùng và mã khoá.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> JWT (Chương 4), cookie có ký (Chương 3), webhook (bài 1.3) và token OIDC (Chương 8) đều là một trong ba công cụ này. Người phỏng vấn rất thích hỏi "băm, mã hoá và ký khác nhau thế nào?".</p>
</div>

<h3>Ba câu hỏi, ba công cụ</h3>
<p><strong>Hash (băm)</strong> là dấu vân tay: ai cũng lấy được, kẻ giả mạo cũng vậy. <strong>MAC</strong> (message authentication code — mã xác thực thông điệp) là dấu niêm phong từ con dấu bạn dùng chung với đồng nghiệp: chỉ người có dấu mới tạo được, nhưng ai trong hai người cũng có thể là người tạo. <strong>Chữ ký</strong> là dấu công chứng: một con dấu, một mẫu công khai ai cũng so được.</p>
${ma('javascript', CODE.threeTools)}
${ra(OUT['14-ba-cong-cu'])}
<p>Đổi một ký tự là cả SHA-256 đổi — nhưng kẻ tấn công cũng tự tính được bản mới, nên bản băm nằm cạnh dữ liệu thì không chứng minh gì. HMAC cần <code>DEMO_HMAC_KEY</code> để tạo <em>và</em> để kiểm. Chữ ký Ed25519 kiểm đúng bằng khoá công khai, trượt khi thông điệp bị đổi, và khoá công khai <strong>không ký được</strong> (<code>ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE</code>).</p>
<p>Không cái nào trong ba giấu được gì. Giá trị có ký hay có MAC vẫn đọc được — vì thế Chương 4 dặn đừng bao giờ nhét bí mật vào JWT.</p>

<h3>Cái MAC hỏng có hẳn tên riêng: length extension</h3>
<p>MAC tự chế ai cũng viết đầu tiên là <code>sha256(bí mật + thông điệp)</code>: kẻ tấn công không có bí mật thì sao băm được. Nhưng SHA-256 chạy theo khối 64 byte và đầu ra của nó <strong>chính là</strong> trạng thái bên trong sau khối cuối. Nạp lại bản băm làm trạng thái rồi băm tiếp, ta được bản băm hợp lệ cho <code>bí mật + thông điệp + phần đệm + bất cứ gì</code> — chẳng cần bí mật (length extension — tấn công nối dài).</p>
<p>Để chứng minh không phải mẹo, <code>demo1/sha256.mjs</code> viết SHA-256 ra trong khoảng 45 dòng với đúng một khả năng thêm: <code>sha256(data, fromDigest, doneLen)</code> bắt đầu từ một bản băm cho trước. Đòn tấn công:</p>
${ma('javascript', LE_CORE)}
${ra(OUT['14-noi-dai'])}
<p>SHA-256 tự viết khớp với của Node. An nối phần đệm của chính SHA-256 (<code>\\x80</code>, các số 0, độ dài tính bằng bit) cộng <code>&amp;role=LAB_MANAGER</code>, tính thẻ mới từ thẻ cũ, và máy chủ nhận; <code>URLSearchParams</code> giữ <code>role=</code> cuối cùng nên An thành quản lý phòng lab. HMAC băm hai lần với khoá ở cả hai đầu — <code>H(K ⊕ opad, H(K ⊕ ipad, thông điệp))</code>, RFC 2104 — nên lớp ngoài giấu trạng thái bên trong và phép tính y hệt thất bại.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "nhưng kẻ tấn công đâu biết độ dài khoá".</strong> Họ không cần biết: thử 1, 2, 3… byte rồi giữ lần đoán mà máy chủ chấp nhận (bài thực hành dưới đây tìm ra khoá 18 byte ở lần thử 18). Đây không phải lý thuyết — năm 2009 chữ ký API của Flickr bị giả mạo đúng bằng kiểu ghép này (Thai Duong và Juliano Rizzo). Hãy dùng <code>createHmac</code>; chi phí như nhau.</p>
</div>

<h3>Một khoá dùng chung cho nhiều dịch vụ: ai kiểm được là giả được</h3>
<p>MAC tạo và kiểm bằng cùng một khoá — ổn khi LabFlow ID tự kiểm giá trị của mình, hết ổn khi một dịch vụ <em>thứ hai</em> phải kiểm. LabFlow ID cấp token dạng giống JWT (<code>payload.tag</code>); dịch vụ thanh toán (billing) được giao khoá "chỉ để kiểm" (thiết kế A) hoặc chỉ một khoá công khai (thiết kế B):</p>
${ma('javascript', SK_CORE)}
${ra(OUT['14-khoa-chung'])}
<ul>
<li><strong>Thiết kế A (khoá HMAC dùng chung):</strong> billing tự đúc <code>role: 'LAB_MANAGER'</code> và nó qua kiểm y như token thật. Một con bug ở bất kỳ dịch vụ nào giữ khoá — hay bất kỳ nhà thầu nào làm dịch vụ đó — đều cấp được token cho mọi người.</li>
<li><strong>Thiết kế B (Ed25519):</strong> billing chỉ giữ khoá công khai. Nó kiểm được token của An, không ký được, và không chuyển được chữ ký của An sang một payload mới.</li>
</ul>
<table>
<thead><tr><th>Tình huống</th><th>Chọn</th></tr></thead>
<tbody>
<tr><td>Một dịch vụ vừa cấp <em>vừa</em> kiểm (cookie của chính LabFlow ID, Lab 1)</td><td>HMAC (HS256) — đơn giản, một bí mật</td></tr>
<tr><td>Dịch vụ khác phải kiểm nhưng không được cấp</td><td>Chữ ký: Ed25519 (EdDSA), rồi ES256, rồi RS256 khi cần hỗ trợ rộng nhất</td></tr>
<tr><td>Bên thứ ba kiểm (client OIDC — Chương 8)</td><td>Chữ ký + khoá công khai công bố qua một URL JWKS (Chương 4)</td></tr>
</tbody>
</table>

<h3>Mã hoá là công cụ thứ tư — và không phải con dấu</h3>
<p>Phản xạ hay gặp: "client không được sửa nó, vậy mã hoá đi." Mã hoá giấu nội dung; tự nó không phát hiện thay đổi. Ở chế độ đếm (AES-CTR), bản mã là bản rõ XOR với một dòng khoá, nên lật một bit trong bản mã là lật đúng bit đó trong bản rõ. Biết định dạng là kẻ tấn công sửa được mà không cần nhìn thấy gì:</p>
${ma('javascript', ENC)}
${ra(OUT['14-ma-hoa'])}
<p>Kẻ tấn công chưa từng biết khoá, vậy mà <code>"admin":false</code> giải mã thành <code>"admin":true </code> (dấu cách giữ nguyên độ dài và JSON vẫn parse được). AES-GCM là chế độ <strong>AEAD</strong> (mã hoá có xác thực): nó thêm một thẻ, và <code>decipher.final()</code> của Node ném lỗi khi bản mã bị đụng tới. Luật: không bao giờ mã hoá mà không xác thực — và trước khi mã hoá, hãy hỏi client có cần giá trị đó không; một id ngẫu nhiên chỉ có nghĩa ở máy chủ thì chẳng cần mã hoá.</p>

<h3>Công cụ của LabFlow ID: giá trị có ký, kèm hạn dùng và mã khoá</h3>
<p>Hình dạng LabFlow ID dùng lại cho cookie (Chương 3) và bạn tự dựng ở Lab 1: <code>base64url(giá trị).exp.kid.HMAC</code>. <strong>Key id</strong> (<code>kid</code> — mã khoá) cho phép xoay khoá — ký bằng khoá mới trong khi giá trị ký bằng khoá cũ còn sống tới khi bạn gỡ nó (Chương 11). <code>signValue</code> dựng chuỗi; đây là phần kiểm, và <code>demo1/signed-demo.mjs</code> chạy với một đồng hồ cố định:</p>
${ma('javascript', SIGNED)}
${ra(OUT['14-ky-gia-tri'])}
<p>Đổi giá trị hay đẩy hạn dùng ra sau đều làm hỏng HMAC; đúng lúc <code>exp</code> giá trị hết hiệu lực (+899 s còn sống, +900 s ra null); gỡ <code>k1</code> là cho nghỉ mọi giá trị nó từng ký. Hai chi tiết quan trọng: chữ ký được kiểm <em>trước</em> khi tin hạn dùng, và <code>Object.hasOwn</code> chặn một kid như <code>toString</code> lôi ra một hàm trên prototype.</p>

<h3>Câu hỏi nào, công cụ nào</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Token ngẫu nhiên đang lưu?</span><span class="lz-d">Lưu SHA-256 của nó, tra theo đó (bài 1.3).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giá trị của mình, mình tự kiểm?</span><span class="lz-d">HMAC — <code>signValue</code>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Người khác phải kiểm, không được cấp?</span><span class="lz-d">Chữ ký, công bố khoá công khai.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Client không được ĐỌC?</span><span class="lz-d">AEAD (AES-GCM) — sau khi hỏi họ có cần nó không.</span></div>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Băm, mã hoá, ký khác nhau thế nào?"</strong> — Băm là một chiều, không khoá (chỉ chứng minh toàn vẹn nếu bản băm đáng tin); mã hoá đảo ngược được bằng khoá (giữ bí mật); ký chứng minh ai đã tạo (khoá riêng ký, khoá công khai kiểm). MAC là băm có khoá, chứng minh toàn vẹn với những người giữ khoá.</li>
<li><strong>"JWT của mình dùng HS256 hay RS256?"</strong> — HS256 khi bên cấp là bên kiểm duy nhất; bất đối xứng (EdDSA/ES256/RS256) ngay khi có dịch vụ khác kiểm, vì với HS256 bên kiểm nào cũng đúc được token.</li>
<li><strong>"Sao phải HMAC mà không sha256(khoá + thông điệp)?"</strong> — Length extension: bản băm chính là trạng thái bên trong, nên kẻ tấn công nối thêm dữ liệu và tính được thẻ hợp lệ. Mình đã giả được một cái trong chưa tới 60 dòng.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo1/length-extension.mjs</code>, rồi đổi <code>tagNaive</code> sang <code>createHmac</code> và chạy lại: lần giả mạo phải thất bại.</li>
<li>Viết <code>demo1/guess-key-length.mjs</code>: khoá của máy chủ dài 16–32 byte ngẫu nhiên; thử mọi độ dài từ 1 tới 64 tới khi máy chủ nhận một <code>&amp;role=LAB_MANAGER</code> giả.</li>
<li>Dùng <code>signValue</code>, ký <code>usr_2|STUDENT</code> trong 60 giây với kid <code>k2</code>, rồi chứng minh nó còn hiệu lực ở +59 s và ra <code>null</code> ở +60 s.</li>
</ol>
<p><strong>Lời giải bước 2 và output thật:</strong></p>
${ma('javascript', GUESS)}
${ra(OUT['14-thuc-hanh-do-dai'])}
<p><strong>Đạt khi:</strong> bản HMAC in <code>false</code>, vòng lặp của bạn tìm ra độ dài khoá (của mình: lần thử 18, thật là 18) mà không biết khoá, và giá trị <code>usr_2</code> của bạn chết đúng lúc hết hạn, như hai dòng +899/+900 ở trên.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash (hàm băm)</span><span class="v">Dấu vân tay một chiều, không khoá, của các byte (SHA-256). Chứng minh "cùng byte", không bao giờ chứng minh "ai".</span></div>
  <div class="kv"><span class="k">MAC / HMAC (mã xác thực thông điệp)</span><span class="v">Băm có khoá; HMAC (RFC 2104) là cách dựng chuẩn, miễn nhiễm với length extension.</span></div>
  <div class="kv"><span class="k">digital signature (chữ ký số)</span><span class="v">Tạo bằng khoá riêng, kiểm bằng khoá công khai (Ed25519, ECDSA, RSA).</span></div>
  <div class="kv"><span class="k">length extension (tấn công nối dài)</span><span class="v">Băm tiếp một hàm Merkle–Damgård (MD5, SHA-1, SHA-256) từ bản băm đã biết để giả <code>hash(bí mật + msg + phần thêm)</code>.</span></div>
  <div class="kv"><span class="k">AEAD (mã hoá có xác thực)</span><span class="v">AES-GCM, ChaCha20-Poly1305: giữ bí mật kèm một thẻ phát hiện thay đổi.</span></div>
  <div class="kv"><span class="k">kid (mã khoá)</span><span class="v">Nhãn nằm trong giá trị có ký, cho biết khoá nào đã tạo nó — thứ giúp xoay khoá được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Băm = cùng byte (ai cũng tạo được); MAC = một người giữ khoá đã tạo; chữ ký = khoá riêng này đã tạo, ai cũng kiểm được.</li>
<li><code>sha256(bí mật + thông điệp)</code> đã bị giả thật; HMAC từ chối đúng lần giả đó.</li>
<li>Khoá HMAC dùng chung biến mọi bên kiểm thành bên cấp; người khác cần kiểm thì dùng chữ ký.</li>
<li>Mã hoá không có thẻ thì sửa được (CTR: false → true); dùng AES-GCM, và hỏi trước xem có cần mã hoá không.</li>
<li><code>signValue</code> của LabFlow ID: giá trị base64url + hạn dùng + kid + HMAC; kiểm chữ ký trước, hạn dùng sau.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Áp vào API Design — bài 6.1: tự dựng JWT bằng tay', sub: 'Giống: HS256 là HMAC-SHA256 trên header.payload, máy chủ (không phải token) chọn thuật toán, đổi payload là trượt. Bài đó cấp token 15 phút cho LabFlow API và tấn công chúng (alg none); bài này giải thích nên chọn nguyên hàm nào và vì sao khoá HMAC dùng chung là nguy hiểm. Mỗi bài tự đứng được; Chương 4 đi sâu hơn.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
