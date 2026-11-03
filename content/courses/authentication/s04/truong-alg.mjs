/**
 * Authentication · Chương 4 · 4.2 — Cái token TỰ NÓI cho máy chủ cách kiểm nó. Slug giữ: auth-4-2-truong-alg.
 * Output thật (_ma.mjs): bộ xác minh ngây thơ (_naive.mjs) chấp nhận alg:none ⇒ chiếm usr_3; và HS256 ký bằng khoá công
 * khai ⇒ nhầm lẫn thuật toán. LabFlow ID lấy alg từ KHOÁ (kid ⇒ keyring) ⇒ cả hai trả ALG_MISMATCH. RFC 8725 + OWASP.
 */
import G from '../giang/auth-04-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const V = CODE.verify.split('\n');
const ALG = V.slice(V.findIndex((l) => l.includes('1) ALGORITHM')), V.findIndex((l) => l.includes('2) SIGNATURE'))).join('\n').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 8725 — JSON Web Token Best Current Practices (BCP 225)', '§2.1 the "none" and RS/HS confusion attacks (CVE-2015-9235); §3.1 “use algorithms … the application decides”, bind each key to one algorithm (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8725'),
  nguon('🦉', 'OWASP — JSON Web Token Cheat Sheet', '“A relying party … must not rely on the information of the JWT header to select the verification algorithm”; hardcode algorithms, do not mix MAC and public-key (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 8725 — Thực hành tốt nhất hiện hành cho JWT (BCP 225)', '§2.1 tấn công "none" và nhầm lẫn RS/HS (CVE-2015-9235); §3.1 "dùng thuật toán … do ứng dụng quyết định", gắn mỗi khoá với một thuật toán (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8725'),
  nguon('🦉', 'OWASP — JSON Web Token Cheat Sheet', '"Bên tin tưởng … không được dựa vào thông tin trong header của JWT để chọn thuật toán xác minh"; cố định thuật toán, không trộn MAC và khoá công khai (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Attack</th><th>Forged header</th><th>Why a naive verifier falls</th><th>LabFlow ID</th></tr></thead>
<tbody>
<tr><td><code>alg: none</code></td><td><code>{"alg":"none",…}</code>, empty signature</td><td>treats it as an “unsecured JWT” and skips the signature</td><td><code>ALG_MISMATCH</code> — no key is “none”</td></tr>
<tr><td>HS/RS confusion</td><td><code>{"alg":"HS256",…}</code>, HMAC with the public key</td><td>uses the public key as a shared secret</td><td><code>ALG_MISMATCH</code> — the kid is an EdDSA key</td></tr>
<tr><td>case tricks</td><td><code>"None"</code>, <code>"nOnE"</code></td><td>a string compare that forgot to normalise</td><td><code>ALG_MISMATCH</code> — never equal to <code>EdDSA</code></td></tr>
<tr><td>signature strip/swap</td><td>another token's signature</td><td>— (reaches the signature check)</td><td><code>BAD_SIGNATURE</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Tấn công</th><th>Header giả</th><th>Vì sao bộ xác minh ngây thơ gục</th><th>LabFlow ID</th></tr></thead>
<tbody>
<tr><td><code>alg: none</code></td><td><code>{"alg":"none",…}</code>, chữ ký rỗng</td><td>coi là "JWT không bảo vệ" và bỏ qua chữ ký</td><td><code>ALG_MISMATCH</code> — không khoá nào là "none"</td></tr>
<tr><td>nhầm lẫn HS/RS</td><td><code>{"alg":"HS256",…}</code>, HMAC bằng khoá công khai</td><td>dùng khoá công khai làm bí mật chung</td><td><code>ALG_MISMATCH</code> — kid là một khoá EdDSA</td></tr>
<tr><td>mẹo viết hoa</td><td><code>"None"</code>, <code>"nOnE"</code></td><td>so chuỗi mà quên chuẩn hoá</td><td><code>ALG_MISMATCH</code> — không bao giờ bằng <code>EdDSA</code></td></tr>
<tr><td>bóc/tráo chữ ký</td><td>chữ ký của token khác</td><td>— (đi tới được bước kiểm chữ ký)</td><td><code>BAD_SIGNATURE</code></td></tr>
</tbody>
</table>`;

export default {
  title: '4.2 — The token tells the server how to check it|||4.2 — Cái token TỰ NÓI cho máy chủ cách kiểm nó',
  slug: 'auth-4-2-truong-alg',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Header có một trường alg, và thiết kế để token tự chọn cách kiểm nó là nơi hai cú giả mạo kinh điển sống: alg:none (xoá chữ ký, bộ xác minh ngây thơ coi là token không bảo vệ) và nhầm lẫn thuật toán HS/RS (ký HS256 bằng khoá công khai lấy từ JWKS). Cả hai chạy thật trên _naive.mjs và chiếm usr_3; LabFlow ID lấy thuật toán từ KHOÁ tra theo kid ⇒ cả hai trả ALG_MISMATCH. Theo RFC 8725 (BCP 225) và OWASP: cố định thuật toán, không lấy alg từ token.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The token tells the server how to check it</h2>
<p class="lead">Lesson 4.1 ended on one rule: the signature covers <code>header.payload</code>, so editing the payload breaks it. But the header is part of that signed input — and it carries a field, <code>alg</code>, that names the algorithm. A whole family of real-world breaks comes from one tempting shortcut: letting the <em>token</em> decide how it is verified. This lesson runs the two classic forgeries against a naive verifier, watches them take over Cô Lan's account, then runs the exact same tokens against LabFlow ID.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>carry out the <code>alg: none</code> forgery and the HS/RS algorithm-confusion forgery;</li>
<li>explain why a verifier must take the algorithm from the key it looked up, never from the header;</li>
<li>recognise the one line of code that makes a JWT library safe or catastrophic;</li>
<li>cite the rule from RFC 8725 and OWASP that forbids header-chosen algorithms.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> <code>alg: none</code> and RS/HS confusion are still found in audits and bug bounties years after they were named (CVE-2015-9235). They are a one-line mistake, and after this lesson it is a one-line mistake you will never ship.</p>
</div>

<h3>An everyday picture first</h3>
<p>Picture a door whose lock is chosen by a note the visitor tapes to it. “Use the paper lock today,” says the note, and a careless guard complies. Or: “use the lock whose key is printed on this public poster.” The absurdity is clear — <strong>the building decides the lock, not the visitor</strong>. A JWT's <code>alg</code> header is that note. A safe verifier ignores it and uses the lock the building chose for that door (the key it holds under that <code>kid</code>).</p>

<h3>The naive verifier — the habit both attacks exploit</h3>
<p>This is the verifier a hundred tutorials teach: read <code>alg</code> from the header, then verify with that algorithm and one blob of “key material”.</p>
${ma('javascript', CODE.naive)}
<p>It looks reasonable. It is the single mistake that makes both forgeries below work.</p>

<h3>Attack 1 — <code>alg: none</code></h3>
<p>RFC 7519 defines an “unsecured JWT”: <code>alg</code> is <code>none</code> and there is no signature. It exists for tokens already protected another way (e.g. by TLS), but a verifier that trusts the header will accept one from anybody. The attacker reads An's token, raises the claims to <code>sub: usr_3, role: LAB_MANAGER</code>, sets <code>alg: none</code>, and deletes the signature:</p>
${ra(OUT['42-none'])}
<p>The naive verifier returns the claims — a full account takeover with <strong>no key at all</strong>. LabFlow ID looks up the <code>kid</code>, finds an EdDSA key, and the header's <code>none</code> is not <code>EdDSA</code>: <code>ALG_MISMATCH</code>, before a signature is even considered.</p>

<h3>Attack 2 — algorithm confusion (HS/RS)</h3>
<p>This one is subtler and is why the default public-key choice matters. LabFlow ID verifies <strong>EdDSA</strong> with a <em>public</em> key — and that key is published in the JWKS (lesson 4.4), so it is not secret. The attacker downloads it and signs an <strong>HS256</strong> token using that public key as the HMAC secret. HMAC uses one key to sign and to verify, so a naive verifier that reuses the same public key gets a match:</p>
${ra(OUT['42-confusion'])}
<p>The public key, meant only for verifying signatures, became a shared secret the attacker also knows. The same shape afflicts the classic RSA case (CVE-2015-9235): an <code>RS256</code> deployment, confused into <code>HS256</code>, verifies with its RSA public key. LabFlow ID again returns <code>ALG_MISMATCH</code>: the <code>kid</code> names an EdDSA key, and the header says HS256.</p>

<h3>One rule kills both</h3>
<p>The whole defence is three lines at the top of the verifier — the algorithm comes from the <strong>key</strong>, looked up by <code>kid</code> in a fixed keyring, never from the token:</p>
${ma('javascript', ALG)}
<p>No <code>kid</code> ⇒ <code>NO_KID</code>; a <code>kid</code> we do not hold ⇒ <code>UNKNOWN_KID</code>; a header <code>alg</code> that differs from the key's own <code>alg</code> ⇒ <code>ALG_MISMATCH</code>. Only a key we hold, used with exactly its own algorithm, ever reaches the signature check. The case tricks (<code>None</code>, <code>nOnE</code>) die here too, because neither equals <code>EdDSA</code>.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">kid → key</span><span class="lz-d">Look the <code>kid</code> up in the keyring. Missing or unknown ⇒ reject (never a file path, 4.4).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">alg from the key</span><span class="lz-d">The header's <code>alg</code> must equal the key's <code>alg</code>, or <code>ALG_MISMATCH</code> — this stops <code>none</code> and confusion.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">signature</span><span class="lz-d">Verify with that key, before any claim is read.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">claims</span><span class="lz-d">Only now is the payload trustworthy (lesson 4.3).</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — passing a good library the token's own algorithm.</strong> Even a correct, modern JWT library is unsafe if you call it like <code>verify(token, key)</code> and let it read <code>alg</code> from the header. You must pass an <strong>allow-list you decided in advance</strong> (<code>algorithms: ['EdDSA']</code>) and never register one key for both a public-key algorithm and HMAC. This is exactly what LabFlow ID's keyring enforces: one entry, one <code>alg</code>.</p>
</div>

<h3>When it goes wrong, and what the standard says</h3>
${BANG_EN}
<p>RFC 8725 (JWT Best Current Practices, BCP 225) §3.1 says the library “MUST enable the caller to specify a supported set of algorithms” and bind each key to exactly one algorithm; §2.1 names both attacks above. OWASP's JWT Cheat Sheet is blunter: a relying party “must not rely on the information of the JWT header to select the verification algorithm,” and should hardcode the accepted algorithms and never mix public-key and MAC algorithms.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What is the <code>alg: none</code> attack?”</strong> — Set the header algorithm to <code>none</code>, drop the signature; a verifier that trusts the header accepts an unsigned token. Fix: never accept <code>none</code>; choose the algorithm from the key.</li>
<li><strong>“How does RS/HS confusion work?”</strong> — The server verifies RS256/EdDSA with a public key; the attacker HMAC-signs an HS256 token with that public key. Fix: bind each key to one algorithm and pass an allow-list.</li>
<li><strong>“You use library X — are you safe?”</strong> — Only if we pass an explicit algorithm allow-list and never let the token pick. The library is not the control; the call site is.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo4/alg-none.mjs</code> and <code>node demo4/confusion.mjs</code>. For each, note which verifier accepted and which rejected, and the exact rejection code.</li>
<li>In <code>demo4/confusion.mjs</code>, change the forged <code>role</code> to <code>STUDENT</code>. Does LabFlow ID's answer change? Why not?</li>
<li>Edit <code>demo4/_naive.mjs</code> to reject <code>alg: 'none'</code>. Does that fix the confusion attack too? Explain why one patch does not cover the other.</li>
</ol>
<p><strong>Solution:</strong> (1) the naive verifier accepts both; LabFlow ID rejects both with <code>ALG_MISMATCH</code>. (2) no — the rejection happens at the algorithm check, before any claim is read, so the <code>role</code> value is irrelevant. (3) blocking <code>none</code> stops attack 1 but not attack 2: confusion uses a <em>real</em> algorithm (HS256) with the wrong key, so only binding each key to one algorithm stops it.</p>
<p><strong>Done when:</strong> you can state the one rule — algorithm from the key, not the token — and show it defeats both forgeries.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>alg</code> header</span><span class="v">The algorithm named in the token header. Attacker-controlled input — never the basis for choosing how to verify.</span></div>
  <div class="kv"><span class="k">unsecured JWT (<code>alg: none</code>)</span><span class="v">A JWT with no signature. Accept it only when another layer already protects it, which an API almost never does.</span></div>
  <div class="kv"><span class="k">algorithm confusion</span><span class="v">Making a verifier use a public key as an HMAC secret by switching the token to HS256.</span></div>
  <div class="kv"><span class="k">algorithm allow-list</span><span class="v">The fixed set of algorithms the application accepts, decided in advance, independent of the token.</span></div>
  <div class="kv"><span class="k">kid (key id)</span><span class="v">A header hint naming which key to use. Looked up in a fixed keyring — never turned into a file path (4.4).</span></div>
  <div class="kv"><span class="k">key/algorithm binding</span><span class="v">Each key is usable with exactly one algorithm; the rule behind <code>ALG_MISMATCH</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The header's <code>alg</code> is attacker input; never pick the verification algorithm from it.</li>
<li><code>alg: none</code> drops the signature; a header-trusting verifier accepts an unsigned forgery.</li>
<li>HS/RS confusion HMAC-signs a token with the server's public key; a header-trusting verifier matches it.</li>
<li>One rule stops both: look up the <code>kid</code>, take the algorithm from the key, reject on <code>ALG_MISMATCH</code>.</li>
<li>Even a good library needs an explicit allow-list and one algorithm per key (RFC 8725, OWASP).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Compare in API Design — lesson 6.1: authenticating an API', sub: 'Same world (LabFlow), same HS256 built by hand. That lesson signs with one shared HMAC secret; this one shows why a shared secret becomes dangerous the moment you move to public keys and let the token name the algorithm. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Cái token TỰ NÓI cho máy chủ cách kiểm nó</h2>
<p class="lead">Bài 4.1 khép lại bằng một luật: chữ ký bảo vệ <code>header.payload</code>, nên sửa payload là vỡ nó. Nhưng header là một phần của cái signing input đó — và nó mang một trường, <code>alg</code>, nêu tên thuật toán. Cả một họ lỗ hổng thực tế đến từ một lối tắt hấp dẫn: để <em>cái token</em> quyết định nó được kiểm thế nào. Bài này chạy hai cú giả mạo kinh điển trước một bộ xác minh ngây thơ, nhìn chúng chiếm tài khoản Cô Lan, rồi chạy đúng những token đó trước LabFlow ID.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>thực hiện cú giả mạo <code>alg: none</code> và cú nhầm lẫn thuật toán HS/RS;</li>
<li>giải thích vì sao bộ xác minh phải lấy thuật toán từ khoá tra được, không bao giờ từ header;</li>
<li>nhận ra dòng mã duy nhất khiến một thư viện JWT an toàn hay thảm hoạ;</li>
<li>dẫn luật của RFC 8725 và OWASP cấm chọn thuật toán từ header.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> <code>alg: none</code> và nhầm lẫn RS/HS vẫn bị phát hiện trong kiểm toán và săn lỗi nhiều năm sau khi được đặt tên (CVE-2015-9235). Chúng là lỗi một dòng, và học xong bài này nó thành lỗi một dòng mà bạn sẽ không bao giờ đẩy lên.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Hình dung một cánh cửa mà ổ khoá do một tờ giấy khách dán lên quyết định. "Hôm nay dùng ổ khoá giấy nhé," tờ giấy ghi, và một người gác bất cẩn làm theo. Hoặc: "dùng ổ khoá mà chìa in trên tấm áp phích công khai này." Sự vô lý đã rõ — <strong>toà nhà quyết định ổ khoá, không phải khách</strong>. Trường <code>alg</code> của một JWT là tờ giấy đó. Một bộ xác minh an toàn phớt lờ nó và dùng ổ khoá mà toà nhà đã chọn cho cánh cửa đó (khoá nó giữ dưới <code>kid</code> đó).</p>

<h3>Bộ xác minh ngây thơ — thói quen cả hai cú tấn công khai thác</h3>
<p>Đây là bộ xác minh mà cả trăm hướng dẫn dạy: đọc <code>alg</code> từ header, rồi kiểm bằng thuật toán đó với một cục "key material".</p>
${ma('javascript', CODE.naive)}
<p>Trông có vẻ hợp lý. Nó là lỗi duy nhất khiến cả hai cú giả mạo dưới đây chạy được.</p>

<h3>Tấn công 1 — <code>alg: none</code></h3>
<p>RFC 7519 định nghĩa một "JWT không bảo vệ": <code>alg</code> là <code>none</code> và không có chữ ký. Nó tồn tại cho token đã được bảo vệ cách khác (ví dụ bằng TLS), nhưng một bộ xác minh tin header sẽ chấp nhận một cái từ bất kỳ ai. Kẻ tấn công đọc token của An, nâng các claim lên <code>sub: usr_3, role: LAB_MANAGER</code>, đặt <code>alg: none</code>, và xoá chữ ký:</p>
${ra(OUT['42-none'])}
<p>Bộ xác minh ngây thơ trả về các claim — chiếm trọn tài khoản mà <strong>không cần khoá nào</strong>. LabFlow ID tra <code>kid</code>, thấy một khoá EdDSA, và <code>none</code> trong header không phải <code>EdDSA</code>: <code>ALG_MISMATCH</code>, trước khi một chữ ký nào được xét tới.</p>

<h3>Tấn công 2 — nhầm lẫn thuật toán (HS/RS)</h3>
<p>Cú này tinh vi hơn và là lý do lựa chọn mặc định khoá-công-khai quan trọng. LabFlow ID kiểm <strong>EdDSA</strong> bằng một khoá <em>công khai</em> — và khoá đó công bố trong JWKS (bài 4.4), nên không bí mật. Kẻ tấn công tải nó về và ký một token <strong>HS256</strong> dùng chính khoá công khai đó làm bí mật HMAC. HMAC dùng một khoá để ký và để kiểm, nên một bộ xác minh ngây thơ dùng lại đúng khoá công khai đó sẽ khớp:</p>
${ra(OUT['42-confusion'])}
<p>Khoá công khai, vốn chỉ để kiểm chữ ký, trở thành một bí mật chung mà kẻ tấn công cũng biết. Cùng dáng đó hành hạ trường hợp RSA kinh điển (CVE-2015-9235): một hệ <code>RS256</code>, bị dụ sang <code>HS256</code>, kiểm bằng khoá công khai RSA của mình. LabFlow ID lại trả <code>ALG_MISMATCH</code>: <code>kid</code> nêu một khoá EdDSA, còn header nói HS256.</p>

<h3>Một luật chặn cả hai</h3>
<p>Toàn bộ phòng thủ là ba dòng ở đầu bộ xác minh — thuật toán đến từ <strong>khoá</strong>, tra theo <code>kid</code> trong một keyring cố định, không bao giờ từ token:</p>
${ma('javascript', ALG)}
<p>Không có <code>kid</code> ⇒ <code>NO_KID</code>; một <code>kid</code> ta không giữ ⇒ <code>UNKNOWN_KID</code>; một <code>alg</code> trong header khác <code>alg</code> của chính khoá ⇒ <code>ALG_MISMATCH</code>. Chỉ một khoá ta giữ, dùng với đúng thuật toán của nó, mới đi tới bước kiểm chữ ký. Các mẹo viết hoa (<code>None</code>, <code>nOnE</code>) cũng chết ở đây, vì không cái nào bằng <code>EdDSA</code>.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">kid → khoá</span><span class="lz-d">Tra <code>kid</code> trong keyring. Thiếu hoặc lạ ⇒ từ chối (không bao giờ là đường dẫn tệp, 4.4).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">alg từ khoá</span><span class="lz-d"><code>alg</code> trong header phải bằng <code>alg</code> của khoá, không thì <code>ALG_MISMATCH</code> — chặn <code>none</code> và nhầm lẫn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">chữ ký</span><span class="lz-d">Xác minh bằng khoá đó, trước khi đọc claim nào.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">claim</span><span class="lz-d">Chỉ giờ payload mới đáng tin (bài 4.3).</span></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đưa cho một thư viện tốt chính thuật toán của token.</strong> Ngay cả một thư viện JWT đúng và hiện đại cũng không an toàn nếu bạn gọi kiểu <code>verify(token, key)</code> và để nó đọc <code>alg</code> từ header. Bạn phải đưa một <strong>danh sách cho phép quyết định trước</strong> (<code>algorithms: ['EdDSA']</code>) và đừng bao giờ đăng ký một khoá cho cả thuật toán khoá-công-khai lẫn HMAC. Đó chính là điều keyring của LabFlow ID bắt buộc: một entry, một <code>alg</code>.</p>
</div>

<h3>Khi nó hỏng, và chuẩn nói gì</h3>
${BANG_VI}
<p>RFC 8725 (Thực hành tốt nhất hiện hành cho JWT, BCP 225) §3.1 nói thư viện "PHẢI cho phép người gọi nêu một tập thuật toán được hỗ trợ" và gắn mỗi khoá với đúng một thuật toán; §2.1 gọi tên cả hai cú tấn công trên. OWASP JWT Cheat Sheet nói thẳng hơn: bên tin tưởng "không được dựa vào thông tin trong header của JWT để chọn thuật toán xác minh", và nên cố định các thuật toán được chấp nhận, không bao giờ trộn thuật toán khoá-công-khai với MAC.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Tấn công <code>alg: none</code> là gì?"</strong> — Đặt thuật toán trong header thành <code>none</code>, bỏ chữ ký; bộ xác minh tin header chấp nhận một token không ký. Sửa: không bao giờ chấp nhận <code>none</code>; chọn thuật toán từ khoá.</li>
<li><strong>"Nhầm lẫn RS/HS hoạt động thế nào?"</strong> — Máy chủ kiểm RS256/EdDSA bằng khoá công khai; kẻ tấn công HMAC-ký một token HS256 bằng khoá công khai đó. Sửa: gắn mỗi khoá với một thuật toán và đưa danh sách cho phép.</li>
<li><strong>"Bạn dùng thư viện X — có an toàn không?"</strong> — Chỉ khi ta đưa một danh sách cho phép thuật toán tường minh và không bao giờ để token tự chọn. Thư viện không phải là chốt chặn; chỗ gọi mới là.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo4/alg-none.mjs</code> và <code>node demo4/confusion.mjs</code>. Mỗi cái, ghi bộ xác minh nào chấp nhận và cái nào từ chối, cùng mã từ chối chính xác.</li>
<li>Trong <code>demo4/confusion.mjs</code>, đổi <code>role</code> giả thành <code>STUDENT</code>. Câu trả lời của LabFlow ID có đổi không? Vì sao không?</li>
<li>Sửa <code>demo4/_naive.mjs</code> để từ chối <code>alg: 'none'</code>. Nó có sửa luôn cú nhầm lẫn không? Giải thích vì sao một bản vá không bao được cái kia.</li>
</ol>
<p><strong>Lời giải:</strong> (1) bộ xác minh ngây thơ chấp nhận cả hai; LabFlow ID từ chối cả hai với <code>ALG_MISMATCH</code>. (2) không — việc từ chối xảy ra ở bước kiểm thuật toán, trước khi đọc claim nào, nên giá trị <code>role</code> không liên quan. (3) chặn <code>none</code> dừng tấn công 1 nhưng không dừng tấn công 2: nhầm lẫn dùng một thuật toán <em>thật</em> (HS256) với sai khoá, nên chỉ việc gắn mỗi khoá với một thuật toán mới dừng được nó.</p>
<p><strong>Đạt khi:</strong> bạn phát biểu được luật duy nhất — thuật toán từ khoá, không từ token — và chỉ ra nó đánh bại cả hai cú giả mạo.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">header <code>alg</code></span><span class="v">Thuật toán nêu trong header của token. Dữ liệu do kẻ tấn công kiểm soát — không bao giờ là căn cứ để chọn cách kiểm.</span></div>
  <div class="kv"><span class="k">unsecured JWT (<code>alg: none</code>)</span><span class="v">Một JWT không có chữ ký. Chỉ chấp nhận khi một lớp khác đã bảo vệ nó, điều một API gần như không bao giờ có.</span></div>
  <div class="kv"><span class="k">algorithm confusion (nhầm lẫn thuật toán)</span><span class="v">Làm bộ xác minh dùng khoá công khai làm bí mật HMAC bằng cách chuyển token sang HS256.</span></div>
  <div class="kv"><span class="k">algorithm allow-list (danh sách thuật toán cho phép)</span><span class="v">Tập thuật toán cố định ứng dụng chấp nhận, quyết định trước, độc lập với token.</span></div>
  <div class="kv"><span class="k">kid (key id)</span><span class="v">Gợi ý trong header nêu dùng khoá nào. Tra trong một keyring cố định — không bao giờ biến thành đường dẫn tệp (4.4).</span></div>
  <div class="kv"><span class="k">key/algorithm binding (gắn khoá với thuật toán)</span><span class="v">Mỗi khoá chỉ dùng được với đúng một thuật toán; luật đứng sau <code>ALG_MISMATCH</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>alg</code> trong header là dữ liệu của kẻ tấn công; không bao giờ chọn thuật toán xác minh từ nó.</li>
<li><code>alg: none</code> bỏ chữ ký; một bộ xác minh tin header chấp nhận một cú giả mạo không ký.</li>
<li>Nhầm lẫn HS/RS HMAC-ký một token bằng khoá công khai của máy chủ; bộ xác minh tin header khớp nó.</li>
<li>Một luật chặn cả hai: tra <code>kid</code>, lấy thuật toán từ khoá, từ chối với <code>ALG_MISMATCH</code>.</li>
<li>Ngay cả thư viện tốt cũng cần một danh sách cho phép tường minh và một thuật toán cho mỗi khoá (RFC 8725, OWASP).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'So với API Design — bài 6.1: xác thực một API', sub: 'Cùng thế giới (LabFlow), cùng HS256 dựng tay. Bài đó ký bằng một bí mật HMAC dùng chung; bài này chỉ ra vì sao một bí mật chung thành nguy hiểm ngay khi bạn chuyển sang khoá công khai và để token nêu tên thuật toán. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
