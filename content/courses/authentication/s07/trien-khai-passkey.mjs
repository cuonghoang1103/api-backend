/**
 * Authentication · Chương 7 · 7.5 — Đưa passkey lên production: các bảng, hai nghi thức, và cuộc di trú. Slug giữ: auth-7-5-trien-khai-passkey.
 * Output thật (_ma.mjs, 74-passkey): một dòng/bộ xác thực (khoá công khai + counter); hai nghi thức = bốn tuyến; counter bắt bản sao.
 */
import G from '../giang/auth-07-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const S = CODE.sql005.split('\n');
const TBL = S.slice(S.findIndex((l) => l.includes('CREATE TABLE passkeys')), S.findIndex((l) => l.includes('passkeys_user'))).join('\n').trim();
const SV = CODE.server07.split('\n');
const ROUTES = SV.slice(SV.findIndex((l) => l.includes('lesson 7.4/7.5: passkeys')), SV.findIndex((l) => l.includes("app.use((err"))).join('\n').trim();

const NGUON_EN = [
  nguon('🔐', 'W3C — WebAuthn Level 3 (signature counter, §6.1.1)', 'The authenticator signature counter and how a server uses it to detect a cloned credential (read 04/11/2026).', 'https://www.w3.org/TR/webauthn-3/'),
  nguon('🧰', 'SimpleWebAuthn — server docs', 'The library LabFlow ID wraps: generate/verify options for both ceremonies, and the credential record you store (read 04/11/2026).', 'https://simplewebauthn.dev/docs/packages/server'),
].join('\n');
const NGUON_VI = [
  nguon('🔐', 'W3C — WebAuthn Level 3 (signature counter, §6.1.1)', 'Bộ đếm chữ ký của bộ xác thực và cách máy chủ dùng nó để phát hiện một credential bị sao chép (đọc 04/11/2026).', 'https://www.w3.org/TR/webauthn-3/'),
  nguon('🧰', 'SimpleWebAuthn — tài liệu server', 'Thư viện LabFlow ID bọc: sinh/xác minh options cho cả hai nghi thức, và bản ghi credential bạn lưu (đọc 04/11/2026).', 'https://simplewebauthn.dev/docs/packages/server'),
].join('\n');

export default {
  title: '7.5 — Shipping passkeys: the tables, the two ceremonies, the migration|||7.5 — Đưa passkey lên production: các bảng, hai nghi thức, và cuộc di trú',
  slug: 'auth-7-5-trien-khai-passkey',
  type: 'LESSON',
  isFreePreview: false,
  description: '7.4 cho thấy VÌ SAO passkey chạy; bài này là cách chúng SỐNG trong một hệ thật. Một dòng mỗi bộ xác thực: credential id (tra lúc đăng nhập), khoá công khai, một counter, transports — khoá riêng KHÔNG bao giờ trong cơ sở dữ liệu. Hai nghi thức = bốn tuyến (register options/verify, auth options/verify); thư viện (@simplewebauthn) phân tích CBOR, LabFlow ID giữ kho challenge và chính sách origin. Challenge phải do MÁY CHỦ tạo và dùng-một-lần (client chọn ⇒ ký trước). Bộ đếm chữ ký tăng mỗi lần ký ⇒ counter đi lùi = credential bị sao chép (bumpCounter). auth/options trả cùng hình dạng dù có passkey hay không (luật dò tài khoản Chương 6). Di trú mật-khẩu→passkey: mời song song, nhắc sau đăng nhập, cho thêm nhiều, chỉ bỏ mật khẩu sau khi có HAI passkey chạy được; luôn giữ đường khôi phục (mép mất-thiết-bị sắc). Theo W3C WebAuthn L3 + SimpleWebAuthn.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Shipping passkeys: the tables, the two ceremonies, the migration</h2>
<p class="lead">7.4 showed why passkeys resist phishing. This lesson is the engineering: what you store, how the two ceremonies become four routes, the counter that catches a cloned authenticator, and — the part that sinks real rollouts — how you move a population off passwords without locking anyone out on a lost phone.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> design the <code>passkeys</code> table (public key + counter + transports); wire the four routes for the two ceremonies with a server-made one-shot challenge; use the signature counter for clone detection; and plan a gradual password→passkey migration that always keeps a recovery path.</p>
</div>

<h3>One row per authenticator</h3>
<p>A user has many passkeys — a phone, a laptop, a hardware key in a drawer. Each is one row, keyed by the credential id you look up at login. You store the public key, a signature counter, and the transports; you never store anything that can be replayed.</p>
${ma('sql', TBL)}

<h3>Two ceremonies, four routes</h3>
<p>Registration is <code>options</code> then <code>verify</code> (store the public key); authentication is <code>options</code> then <code>verify</code> (check the signature, return who it was). The library parses the CBOR/COSE and attestation; LabFlow ID owns the two things a library must not decide for you — the challenge store and the origin policy.</p>
${ma('javascript', ROUTES)}
${ra(OUT['74-passkey'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Server-made, one-shot challenge</span><span class="v">Each <code>options</code> call mints a fresh random challenge, stored server-side; <code>verify</code> checks exactly that one. A reused or client-chosen challenge lets an attacker pre-sign — freshness is half the security.</span></div>
  <div class="kv"><span class="k">The signature counter</span><span class="v">Each authenticator increments a counter per signature; <code>bumpCounter</code> stores the new value and the library flags a counter that goes backwards — a sign of a cloned credential.</span></div>
  <div class="kv"><span class="k">Do not leak at the door</span><span class="v"><code>auth/options</code> returns the same shape whether or not the email has passkeys — the Chapter 6 enumeration rule, at the login door.</span></div>
  <div class="kv"><span class="k">The private key is never yours</span><span class="v">You store a public key and a counter. Even a full database dump leaves an attacker unable to produce a single valid signature.</span></div>
</div>

<h3>Migrating off passwords, without the cliff</h3>
<div class="pitfall co-tieu-de">
<p><strong>Trap — a single passkey on a single device is one dropped phone from a lockout.</strong> The convenience of passkeys hides a sharp recovery edge: delete the password, enroll one passkey, lose the phone, and the account is gone. So migrate gradually — offer passkeys <em>alongside</em> the password; prompt enrollment after a successful login; encourage a second authenticator; and only offer to drop the password once a user has two working passkeys. Keep the recovery codes from 7.3 alive throughout. "Passwordless" is a destination you walk to, not a switch you flip.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What do you store for a passkey, and where is the private key?"</strong> — Credential id, public key, counter, transports; the private key never leaves the authenticator.</li>
<li><strong>"Why must the challenge come from the server?"</strong> — A client-chosen or reused challenge can be pre-signed; a fresh server challenge makes each assertion one-shot.</li>
<li><strong>"How do you go passwordless safely?"</strong> — Gradually: passkeys alongside the password, a second authenticator, recovery codes, and drop the password only after two passkeys work.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Read the four routes. Which one stores a public key, and which one bumps the counter? Where is the challenge created and checked?</li>
<li>Make <code>auth/options</code> return a 404 when the email has no passkeys. Describe the enumeration oracle you just built (6.4).</li>
<li>Sketch the migration steps from "password only" to "passwordless" for one user, naming where the recovery path lives at each step.</li>
</ol>
<p><strong>Solution:</strong> (1) <code>register/verify</code> stores the public key; <code>auth/verify</code> calls <code>bumpCounter</code>; the challenge is minted in each <code>options</code> and checked in the matching <code>verify</code>. (2) a 404 for "no passkeys" lets an attacker enumerate which emails have passkeys — return the same shape either way. (3) offer passkey alongside password → prompt after login → add a second passkey → recovery codes throughout → drop password once two passkeys verify.</p>
<p><strong>Done when:</strong> you can trace a login through the four routes and say where the challenge, the counter and the origin check each live.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">credential id</span><span class="v">The per-authenticator key looked up at login; the <code>passkeys</code> primary key.</span></div>
  <div class="kv"><span class="k">signature counter</span><span class="v">A per-signature counter; going backwards signals a cloned authenticator.</span></div>
  <div class="kv"><span class="k">transports</span><span class="v">How an authenticator is reachable (internal, usb, nfc, ble) — a UI hint.</span></div>
  <div class="kv"><span class="k">attestation</span><span class="v">Optional proof of the authenticator's make; LabFlow ID uses <code>none</code>.</span></div>
  <div class="kv"><span class="k">resident key / discoverable credential</span><span class="v">A passkey the authenticator can list without a username — usernameless login.</span></div>
  <div class="kv"><span class="k">passwordless migration</span><span class="v">Moving users off passwords gradually, keeping a recovery path throughout.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One row per authenticator: credential id, public key, counter, transports — never the private key.</li>
<li>Two ceremonies become four routes; the library parses CBOR, you own the challenge store and origin policy.</li>
<li>The challenge must be server-made and one-shot; the signature counter catches clones.</li>
<li><code>auth/options</code> must not reveal who has passkeys — the Chapter 6 enumeration rule at the door.</li>
<li>Migrate gradually and always keep a recovery path — a single passkey on one device is a lockout waiting to happen.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-6-5-doi-email-va-xoa', title: 'Revisit Chapter 6 — lesson 6.5: deleting an account', soft: true, sub: 'A deleted user cascades to their passkeys (ON DELETE CASCADE in sql/005); account lifecycle and factor storage meet here. Each stands on its own.', cta: 'OPEN LESSON 6.5 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Đưa passkey lên production: các bảng, hai nghi thức, và cuộc di trú</h2>
<p class="lead">7.4 cho thấy vì sao passkey chống lừa đảo. Bài này là phần kỹ thuật: bạn lưu gì, hai nghi thức thành bốn tuyến ra sao, cái counter bắt một bộ xác thực bị sao chép, và — phần nhấn chìm các đợt triển khai thật — cách chuyển một cộng đồng rời mật khẩu mà không khoá ai ra ngoài vì một cú rơi điện thoại.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> thiết kế bảng <code>passkeys</code> (khoá công khai + counter + transports); nối bốn tuyến cho hai nghi thức với một challenge do máy chủ tạo, dùng-một-lần; dùng bộ đếm chữ ký để phát hiện bản sao; và lên kế hoạch một cuộc di trú mật-khẩu→passkey từ từ luôn giữ một đường khôi phục.</p>
</div>

<h3>Một dòng mỗi bộ xác thực</h3>
<p>Một người dùng có nhiều passkey — một điện thoại, một laptop, một khoá phần cứng trong ngăn kéo. Mỗi cái là một dòng, khoá theo credential id bạn tra lúc đăng nhập. Bạn lưu khoá công khai, một bộ đếm chữ ký, và transports; bạn không bao giờ lưu gì phát lại được.</p>
${ma('sql', TBL)}

<h3>Hai nghi thức, bốn tuyến</h3>
<p>Đăng ký là <code>options</code> rồi <code>verify</code> (lưu khoá công khai); xác thực là <code>options</code> rồi <code>verify</code> (kiểm chữ ký, trả về đó là ai). Thư viện phân tích CBOR/COSE và attestation; LabFlow ID giữ hai thứ một thư viện không được quyết hộ bạn — kho challenge và chính sách origin.</p>
${ma('javascript', ROUTES)}
${ra(OUT['74-passkey'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Challenge do máy chủ tạo, dùng-một-lần</span><span class="v">Mỗi lời gọi <code>options</code> đúc một challenge ngẫu nhiên mới, lưu phía máy chủ; <code>verify</code> kiểm đúng cái đó. Một challenge dùng lại hay do client chọn cho kẻ tấn công ký trước — độ tươi là nửa sự an toàn.</span></div>
  <div class="kv"><span class="k">Bộ đếm chữ ký</span><span class="v">Mỗi bộ xác thực tăng một counter mỗi chữ ký; <code>bumpCounter</code> lưu giá trị mới và thư viện báo một counter đi lùi — dấu hiệu một credential bị sao chép.</span></div>
  <div class="kv"><span class="k">Đừng rò ở cửa</span><span class="v"><code>auth/options</code> trả cùng hình dạng dù email có passkey hay không — luật dò tài khoản của Chương 6, ngay cửa đăng nhập.</span></div>
  <div class="kv"><span class="k">Khoá riêng không bao giờ của bạn</span><span class="v">Bạn lưu một khoá công khai và một counter. Kể cả một bản dump cơ sở dữ liệu đầy đủ cũng để kẻ tấn công không tạo nổi một chữ ký hợp lệ.</span></div>
</div>

<h3>Di trú rời mật khẩu, không có vách đứng</h3>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một passkey duy nhất trên một thiết bị duy nhất là cách một cú rơi điện thoại khỏi bị khoá.</strong> Sự tiện lợi của passkey giấu một mép khôi phục sắc: xoá mật khẩu, đăng ký một passkey, mất điện thoại, và tài khoản biến mất. Nên di trú từ từ — mời passkey <em>song song</em> mật khẩu; nhắc đăng ký sau một lần đăng nhập thành công; khuyến khích một bộ xác thực thứ hai; và chỉ mời bỏ mật khẩu một khi một người có hai passkey chạy được. Giữ mã khôi phục của 7.3 sống xuyên suốt. "Không mật khẩu" là một đích bạn đi tới, không phải một công tắc bạn bật.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn lưu gì cho một passkey, và khoá riêng ở đâu?"</strong> — Credential id, khoá công khai, counter, transports; khoá riêng không bao giờ rời bộ xác thực.</li>
<li><strong>"Vì sao challenge phải đến từ máy chủ?"</strong> — Một challenge do client chọn hay dùng lại có thể ký trước; một challenge máy chủ mới khiến mỗi assertion dùng-một-lần.</li>
<li><strong>"Đi không-mật-khẩu an toàn thế nào?"</strong> — Từ từ: passkey song song mật khẩu, một bộ xác thực thứ hai, mã khôi phục, và bỏ mật khẩu chỉ sau khi hai passkey chạy.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Đọc bốn tuyến. Tuyến nào lưu một khoá công khai, và tuyến nào tăng counter? Challenge được tạo và kiểm ở đâu?</li>
<li>Làm <code>auth/options</code> trả 404 khi email không có passkey. Mô tả nhà tiên tri dò tài khoản bạn vừa dựng (6.4).</li>
<li>Phác các bước di trú từ "chỉ mật khẩu" tới "không mật khẩu" cho một người dùng, gọi tên đường khôi phục ở mỗi bước.</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>register/verify</code> lưu khoá công khai; <code>auth/verify</code> gọi <code>bumpCounter</code>; challenge đúc ở mỗi <code>options</code> và kiểm ở <code>verify</code> tương ứng. (2) một 404 cho "không passkey" cho kẻ tấn công dò email nào có passkey — trả cùng hình dạng dù thế nào. (3) mời passkey song song mật khẩu → nhắc sau đăng nhập → thêm một passkey thứ hai → mã khôi phục xuyên suốt → bỏ mật khẩu một khi hai passkey verify.</p>
<p><strong>Đạt khi:</strong> bạn lần được một lần đăng nhập qua bốn tuyến và nói được challenge, counter và phép kiểm origin mỗi cái ở đâu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">credential id</span><span class="v">Khoá mỗi-bộ-xác-thực tra lúc đăng nhập; khoá chính của <code>passkeys</code>.</span></div>
  <div class="kv"><span class="k">signature counter (bộ đếm chữ ký)</span><span class="v">Một counter mỗi chữ ký; đi lùi báo một bộ xác thực bị sao chép.</span></div>
  <div class="kv"><span class="k">transports</span><span class="v">Cách một bộ xác thực với tới được (internal, usb, nfc, ble) — một gợi ý UI.</span></div>
  <div class="kv"><span class="k">attestation</span><span class="v">Bằng chứng tuỳ chọn về hãng của bộ xác thực; LabFlow ID dùng <code>none</code>.</span></div>
  <div class="kv"><span class="k">resident key / discoverable credential</span><span class="v">Một passkey bộ xác thực liệt kê được mà không cần tên — đăng nhập không tên.</span></div>
  <div class="kv"><span class="k">passwordless migration (di trú không mật khẩu)</span><span class="v">Chuyển người dùng rời mật khẩu từ từ, giữ một đường khôi phục xuyên suốt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một dòng mỗi bộ xác thực: credential id, khoá công khai, counter, transports — không bao giờ khoá riêng.</li>
<li>Hai nghi thức thành bốn tuyến; thư viện phân tích CBOR, bạn giữ kho challenge và chính sách origin.</li>
<li>Challenge phải do máy chủ tạo và dùng-một-lần; bộ đếm chữ ký bắt bản sao.</li>
<li><code>auth/options</code> không được lộ ai có passkey — luật dò tài khoản Chương 6 ngay cửa.</li>
<li>Di trú từ từ và luôn giữ một đường khôi phục — một passkey trên một thiết bị là một cú khoá chờ sẵn.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-6-5-doi-email-va-xoa', title: 'Xem lại Chương 6 — bài 6.5: xoá một tài khoản', soft: true, sub: 'Một người dùng bị xoá cascade tới passkey của họ (ON DELETE CASCADE trong sql/005); vòng đời tài khoản và lưu trữ yếu tố gặp nhau ở đây. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 6.5 →' })}
</div>
`,
};
