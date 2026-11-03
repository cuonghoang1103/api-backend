/**
 * Authentication · Chương 7 · 7.4 — Passkey, và một dòng duy nhất giết chết lừa đảo. Slug giữ: auth-7-4-passkey.
 * Output thật (_ma.mjs, 74-passkey): Chromium thật + virtual authenticator đăng ký + xác thực verified=true; CÙNG chữ ký đó
 * xác minh lại với origin https://evil.example ⇒ verified=false. Gắn origin = chống lừa đảo.
 */
import G from '../giang/auth-07-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const W = CODE.webauthn.split('\n');
const VERIFY = W.slice(W.findIndex((l) => l.includes('Authentication ceremony, step 2')), W.findIndex((l) => l.includes('  };'))).join('\n').trim();

const NGUON_EN = [
  nguon('🔐', 'W3C — Web Authentication (WebAuthn) Level 3', 'The browser API and the ceremonies; the signature covers the challenge AND the relying-party origin (read 04/11/2026).', 'https://www.w3.org/TR/webauthn-3/'),
  nguon('🔑', 'FIDO Alliance — Passkeys', 'What a passkey is and why origin binding makes it phishing-resistant by construction (read 04/11/2026).', 'https://fidoalliance.org/passkeys/'),
].join('\n');
const NGUON_VI = [
  nguon('🔐', 'W3C — Web Authentication (WebAuthn) Level 3', 'API trình duyệt và các nghi thức; chữ ký phủ challenge VÀ origin của bên tin cậy (đọc 04/11/2026).', 'https://www.w3.org/TR/webauthn-3/'),
  nguon('🔑', 'FIDO Alliance — Passkeys', 'Passkey là gì và vì sao gắn origin khiến nó chống-lừa-đảo từ thiết kế (đọc 04/11/2026).', 'https://fidoalliance.org/passkeys/'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Attack on the login</th><th>Password / TOTP</th><th>Passkey</th></tr></thead>
<tbody>
<tr><td>fake site collects the secret</td><td>relays it to the real site, logs in</td><td>no secret to collect — only a signature</td></tr>
<tr><td>fake site relays the challenge</td><td>TOTP code still valid for 30s</td><td>signature is over the FAKE origin ⇒ rejected</td></tr>
<tr><td>server database is dumped</td><td>hashes to crack / codes to replay</td><td>public keys only — useless to an attacker</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Tấn công vào đăng nhập</th><th>Mật khẩu / TOTP</th><th>Passkey</th></tr></thead>
<tbody>
<tr><td>site giả thu bí mật</td><td>chuyển tiếp tới site thật, đăng nhập</td><td>không có bí mật để thu — chỉ một chữ ký</td></tr>
<tr><td>site giả chuyển tiếp challenge</td><td>mã TOTP vẫn hợp lệ 30s</td><td>chữ ký ký lên origin GIẢ ⇒ bị từ chối</td></tr>
<tr><td>cơ sở dữ liệu máy chủ bị dump</td><td>băm để bẻ / mã để phát lại</td><td>chỉ khoá công khai — vô dụng với kẻ tấn công</td></tr>
</tbody>
</table>`;

export default {
  title: '7.4 — Passkeys, and the one line that kills phishing|||7.4 — Passkey, và một dòng duy nhất giết chết lừa đảo',
  slug: 'auth-7-4-passkey',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mọi yếu tố tới giờ đều lừa được: mật khẩu, mã TOTP, cú chạm push đều được một bản giả thuyết phục chuyển tiếp tới site thật. Một passkey thì không — vì bộ xác thực KÝ lên cả origin. Passkey là một cặp khoá: nửa riêng không bao giờ rời thiết bị (trong phần cứng) và ký các challenge; máy chủ chỉ lưu khoá công khai (dump cũng vô dụng). Hai nghi thức (đăng ký tạo cặp khoá; xác thực ký một challenge). Một dòng — expectedOrigin / expectedRPID khi xác minh — khiến một chữ ký làm cho evil.example không thoả phép kiểm cho origin thật. Đo thật bằng Chromium + virtual authenticator: đăng ký + xác thực verified=true; CÙNG chữ ký đó xác minh lại với https://evil.example ⇒ verified=false. Trình duyệt cũng không dùng credential sai RP ID. Theo W3C WebAuthn L3 + FIDO.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Passkeys, and the one line that kills phishing</h2>
<p class="lead">Everything in this chapter so far can be phished. A password is a secret you can be tricked into typing into a fake site; a TOTP code and a push approval can be relayed to the real site within their window. Passkeys are different in kind, not degree: the authenticator signs over the <em>origin that asked</em>, so a signature produced for a phishing site cannot satisfy your real site — and no convincing fake can change that.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> explain a passkey as a key pair whose private half never leaves the device; describe the two ceremonies; and point to the single property — origin binding — that makes a relayed challenge worthless, proven against a real browser.</p>
</div>

<h3>A wax seal, not a shared word</h3>
<p>A password is a word you say: overhear it and you can repeat it anywhere. A passkey is a wax seal — a private stamp that never leaves your pocket, pressed onto <em>this</em> letter addressed to <em>this</em> recipient. Someone who photographs the imprint has proof of nothing, because they cannot press the stamp onto their own letter. The "recipient" baked into the seal is the website's origin, and that is the whole of the phishing defence.</p>

<h3>A key pair, not a secret</h3>
<p>At registration the authenticator (your phone's secure element, a laptop's TPM, a hardware key) generates a public/private key pair. The public key goes to the server; the private key stays on the device, in hardware, and only ever produces signatures. There is no shared secret — so a database dump gives an attacker public keys, which are useless to impersonate anyone. This is the structural difference from a password or a TOTP seed, both of which the server must hold in a form that is dangerous if leaked.</p>

<h3>Two ceremonies, and the one line</h3>
<p>Registration: the server sends a challenge; the authenticator makes a key pair, signs, and returns the public key. Authentication: the server sends a challenge; the authenticator signs it with the private key. In both, the authenticator signs over the challenge <strong>and the origin of the page that asked</strong>, and the server verifies against its own expected origin and RP ID. That verification is the one line that matters:</p>
${ma('javascript', VERIFY)}
${ra(OUT['74-passkey'])}
<p>The demo drives a <strong>real Chromium</strong> with a virtual authenticator: registration and authentication both verify. Then the identical, real assertion is verified a second time with <code>expectedOrigin = https://evil.example</code> — and it fails. The authenticator signed over the true origin; no verification against a different origin can accept that signature. That is phishing resistance you can watch happen.</p>

<h3>Why phishing dies</h3>
${BANG_EN}
<div class="pitfall co-tieu-de">
<p><strong>Not magic — know the two caveats.</strong> Passkeys sync across a platform account (iCloud Keychain, Google Password Manager) so a user is not locked out when they lose one device — convenient, but your trust now includes that cloud account's security. And a <em>resident</em> passkey on an unlocked, stolen device is the whole credential: the screen lock and the authenticator's user-verification (a PIN or biometric) are what stop a thief, so do not disable user verification to "reduce friction". Passkeys remove phishing; they do not remove the need to protect the device.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Why can't a passkey be phished like TOTP?"</strong> — The authenticator signs over the page's origin; a signature made for the phishing origin fails verification against the real one. There is no code to relay.</li>
<li><strong>"What does the server store for a passkey?"</strong> — Only the public key, a counter, and the credential id — nothing that can be replayed if the database leaks.</li>
<li><strong>"Is a passkey one factor or two?"</strong> — The private key is something you have; unlocking it with a biometric/PIN adds something you are/know — so a passkey is often two factors in one tap.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo7/passkey-ceremony.mjs</code>. Confirm both ceremonies verify, then that the same assertion fails when re-verified against <code>https://evil.example</code>.</li>
<li>In <code>verifyAuthentication</code>, what two values bind the signature to your site? What does the authenticator sign that the server re-checks?</li>
<li>Explain why dumping the <code>passkeys</code> table does not let an attacker log in as anyone, unlike dumping a password-hash table.</li>
</ol>
<p><strong>Solution:</strong> (1) register + authenticate verified=true; the <code>evil.example</code> re-verify returns false. (2) <code>expectedOrigin</code> and <code>expectedRPID</code>; the authenticator signs the challenge + the requesting origin's hash, which the server re-checks. (3) the table holds only public keys; a signature still requires the private key, which never left the user's device.</p>
<p><strong>Done when:</strong> you can state, in one sentence, why a relayed challenge is worthless to a phishing site.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">passkey</span><span class="v">A WebAuthn credential: a key pair whose private half stays on the device.</span></div>
  <div class="kv"><span class="k">origin binding</span><span class="v">The authenticator signs over the requesting origin; the server verifies it — the anti-phishing property.</span></div>
  <div class="kv"><span class="k">RP ID</span><span class="v">The relying party (your site's) identifier a credential is scoped to.</span></div>
  <div class="kv"><span class="k">ceremony</span><span class="v">Registration (make a key pair) or authentication (sign a challenge).</span></div>
  <div class="kv"><span class="k">challenge</span><span class="v">A fresh server random the authenticator signs, so a signature cannot be pre-made.</span></div>
  <div class="kv"><span class="k">user verification</span><span class="v">A PIN/biometric unlocking the private key — the "are/know" half of a passkey.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A passkey is a key pair; the private half never leaves the device and only signs.</li>
<li>The server stores only the public key — a database dump cannot impersonate anyone.</li>
<li>Two ceremonies; in both the authenticator signs over the requesting origin.</li>
<li>One line — <code>expectedOrigin</code>/<code>expectedRPID</code> — makes a phishing site's relayed challenge unverifiable.</li>
<li>Passkeys remove phishing, not the need to protect the device and keep user verification on.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Revisit Chapter 3 — lesson 3.4: CSRF and the origin', sub: 'CSRF defence also leans on the request origin (Sec-Fetch-Site / Origin). Passkeys push that same idea into the signature itself. Each stands on its own.', cta: 'OPEN LESSON 3.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Passkey, và một dòng duy nhất giết chết lừa đảo</h2>
<p class="lead">Mọi thứ trong chương này tới giờ đều lừa được. Mật khẩu là một bí mật bạn có thể bị lừa gõ vào một site giả; một mã TOTP và một phê duyệt push chuyển tiếp được tới site thật trong cửa sổ của chúng. Passkey khác về BẢN CHẤT, không phải mức độ: bộ xác thực ký lên cả <em>origin đã hỏi</em>, nên một chữ ký tạo cho một site lừa đảo không thể thoả site thật của bạn — và không bản giả thuyết phục nào đổi được điều đó.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> giải thích một passkey là một cặp khoá mà nửa riêng không bao giờ rời thiết bị; mô tả hai nghi thức; và chỉ ra cái tính chất duy nhất — gắn origin — khiến một challenge chuyển tiếp vô giá trị, chứng minh với một trình duyệt thật.</p>
</div>

<h3>Một con dấu sáp, không phải một từ chung</h3>
<p>Mật khẩu là một từ bạn nói: nghe lỏm được là lặp lại được ở bất cứ đâu. Passkey là một con dấu sáp — một con dấu riêng không bao giờ rời túi bạn, ấn lên <em>lá thư này</em> gửi <em>người nhận này</em>. Ai chụp ảnh vết dấu cũng chẳng có bằng chứng gì, vì họ không thể ấn con dấu lên lá thư của chính họ. Cái "người nhận" nướng vào con dấu là origin của website, và đó là toàn bộ sự phòng thủ lừa đảo.</p>

<h3>Một cặp khoá, không phải một bí mật</h3>
<p>Lúc đăng ký bộ xác thực (phần tử bảo mật của điện thoại, TPM của laptop, một khoá phần cứng) sinh một cặp khoá công khai/riêng. Khoá công khai tới máy chủ; khoá riêng ở lại thiết bị, trong phần cứng, và chỉ bao giờ tạo chữ ký. Không có bí mật chung — nên một bản dump cơ sở dữ liệu cho kẻ tấn công các khoá công khai, vô dụng để giả danh ai. Đây là khác biệt cấu trúc so với một mật khẩu hay một hạt giống TOTP, cả hai máy chủ phải giữ ở dạng nguy hiểm nếu rò.</p>

<h3>Hai nghi thức, và một dòng</h3>
<p>Đăng ký: máy chủ gửi một challenge; bộ xác thực tạo một cặp khoá, ký, và trả về khoá công khai. Xác thực: máy chủ gửi một challenge; bộ xác thực ký nó bằng khoá riêng. Ở cả hai, bộ xác thực ký lên challenge <strong>và origin của trang đã hỏi</strong>, và máy chủ xác minh với origin và RP ID mong đợi của chính nó. Phép xác minh đó là một dòng quan trọng:</p>
${ma('javascript', VERIFY)}
${ra(OUT['74-passkey'])}
<p>Demo điều khiển một <strong>Chromium thật</strong> với một bộ xác thực ảo: đăng ký và xác thực đều verify. Rồi đúng cái chữ ký thật đó được xác minh lần hai với <code>expectedOrigin = https://evil.example</code> — và nó thất bại. Bộ xác thực đã ký lên origin thật; không phép xác minh nào với một origin khác nhận được chữ ký đó. Đó là chống lừa đảo bạn xem được tận mắt.</p>

<h3>Vì sao lừa đảo chết</h3>
${BANG_VI}
<div class="pitfall co-tieu-de">
<p><strong>Không phải phép màu — biết hai điều lưu ý.</strong> Passkey đồng bộ qua một tài khoản nền tảng (iCloud Keychain, Google Password Manager) nên người dùng không bị khoá khi mất một thiết bị — tiện, nhưng niềm tin của bạn giờ gồm cả an toàn của tài khoản đám mây đó. Và một passkey <em>thường trú</em> trên một thiết bị đã mở khoá, bị trộm là cả cái tín vật: khoá màn hình và xác minh người dùng của bộ xác thực (một PIN hay sinh trắc) mới chặn một tên trộm, nên đừng tắt xác minh người dùng để "giảm ma sát". Passkey gỡ bỏ lừa đảo; chúng không gỡ bỏ nhu cầu bảo vệ thiết bị.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Vì sao một passkey không lừa được như TOTP?"</strong> — Bộ xác thực ký lên origin của trang; một chữ ký làm cho origin lừa đảo thất bại khi xác minh với origin thật. Không có mã để chuyển tiếp.</li>
<li><strong>"Máy chủ lưu gì cho một passkey?"</strong> — Chỉ khoá công khai, một counter, và credential id — không gì phát lại được nếu cơ sở dữ liệu rò.</li>
<li><strong>"Một passkey là một yếu tố hay hai?"</strong> — Khoá riêng là thứ bạn có; mở khoá nó bằng một sinh trắc/PIN thêm một thứ bạn là/biết — nên một passkey thường là hai yếu tố trong một cú chạm.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo7/passkey-ceremony.mjs</code>. Xác nhận cả hai nghi thức verify, rồi cùng chữ ký thất bại khi xác minh lại với <code>https://evil.example</code>.</li>
<li>Trong <code>verifyAuthentication</code>, hai giá trị nào gắn chữ ký với site của bạn? Bộ xác thực ký cái gì mà máy chủ kiểm lại?</li>
<li>Giải thích vì sao dump bảng <code>passkeys</code> không cho kẻ tấn công đăng nhập như ai, khác với dump một bảng băm-mật-khẩu.</li>
</ol>
<p><strong>Lời giải:</strong> (1) đăng ký + xác thực verified=true; lần xác minh lại với <code>evil.example</code> trả false. (2) <code>expectedOrigin</code> và <code>expectedRPID</code>; bộ xác thực ký challenge + băm của origin đã hỏi, máy chủ kiểm lại. (3) bảng chỉ giữ khoá công khai; một chữ ký vẫn cần khoá riêng, vốn không bao giờ rời thiết bị người dùng.</p>
<p><strong>Đạt khi:</strong> bạn nêu được, trong một câu, vì sao một challenge chuyển tiếp vô giá trị với một site lừa đảo.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">passkey</span><span class="v">Một credential WebAuthn: một cặp khoá mà nửa riêng ở lại thiết bị.</span></div>
  <div class="kv"><span class="k">origin binding (gắn origin)</span><span class="v">Bộ xác thực ký lên origin đã hỏi; máy chủ xác minh nó — tính chất chống lừa đảo.</span></div>
  <div class="kv"><span class="k">RP ID</span><span class="v">Định danh bên tin cậy (site của bạn) mà một credential bị giới hạn vào.</span></div>
  <div class="kv"><span class="k">ceremony (nghi thức)</span><span class="v">Đăng ký (tạo một cặp khoá) hoặc xác thực (ký một challenge).</span></div>
  <div class="kv"><span class="k">challenge</span><span class="v">Một ngẫu nhiên mới của máy chủ mà bộ xác thực ký, để một chữ ký không thể làm trước.</span></div>
  <div class="kv"><span class="k">user verification (xác minh người dùng)</span><span class="v">Một PIN/sinh trắc mở khoá khoá riêng — nửa "là/biết" của một passkey.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một passkey là một cặp khoá; nửa riêng không bao giờ rời thiết bị và chỉ ký.</li>
<li>Máy chủ chỉ lưu khoá công khai — một bản dump cơ sở dữ liệu không giả danh được ai.</li>
<li>Hai nghi thức; ở cả hai bộ xác thực ký lên origin đã hỏi.</li>
<li>Một dòng — <code>expectedOrigin</code>/<code>expectedRPID</code> — khiến challenge chuyển tiếp của site lừa đảo không xác minh được.</li>
<li>Passkey gỡ bỏ lừa đảo, không gỡ bỏ nhu cầu bảo vệ thiết bị và giữ xác minh người dùng bật.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Xem lại Chương 3 — bài 3.4: CSRF và origin', sub: 'Phòng CSRF cũng dựa vào origin của request (Sec-Fetch-Site / Origin). Passkey đẩy cùng ý đó vào trong chính chữ ký. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 3.4 →' })}
</div>
`,
};
