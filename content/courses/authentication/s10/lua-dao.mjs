/**
 * Authentication · Chương 10 · 10.2 — Lừa đảo, và bộ công cụ chuyển tiếp NGUYÊN trang đăng nhập thật. Slug giữ: auth-10-2-lua-dao.
 * Output THẬT từ _ma.mjs: demo10/relay.mjs (password/TOTP bị relay, passkey gắn-origin bị từ chối).
 */
import G from '../giang/auth-10-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🔐', 'OWASP — Multifactor Authentication Cheat Sheet', 'Why OTP second factors are phishable and WebAuthn/passkeys are phishing-resistant (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
  nguon('📏', 'NIST SP 800-63B — Digital Identity Guidelines (Authentication)', 'Authenticator assurance and phishing resistance; the standard behind origin-bound credentials (read 04/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');
const NGUON_VI = [
  nguon('🔐', 'OWASP — Multifactor Authentication Cheat Sheet', 'Vì sao yếu tố thứ hai OTP bị lừa được còn WebAuthn/passkey kháng lừa đảo (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
  nguon('📏', 'NIST SP 800-63B — Hướng dẫn danh tính số (Xác thực)', 'Mức bảo đảm authenticator và kháng lừa đảo; chuẩn sau lưng tín vật gắn-origin (đọc 04/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');

export default {
  title: '10.2 — Phishing, and the kit that relays your real login page|||10.2 — Lừa đảo, và bộ công cụ chuyển tiếp NGUYÊN trang đăng nhập thật của bạn',
  slug: 'auth-10-2-lua-dao',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lừa đảo hiện đại không chìa trang GIẢ — nó là một relay Kẻ-đứng-giữa (AiTM): một reverse proxy trên tên miền nhìn giống chuyển tiếp TRỰC TIẾP trang đăng nhập THẬT của bạn (cả ô TOTP thật), và trộm cái phiên tạo ra. Bạn ở trên TLS thật — tới kẻ tấn công; ổ khoá xanh, "nhìn URL" thất bại trước login.labflovv.example/punycode. Bất cứ gì là BÍ MẬT PHÁT LẠI ĐƯỢC (mật khẩu, mã TOTP) relay bắt và phát lại ⇒ yếu tố thứ hai OTP không cứu. Yếu tố DUY NHẤT không relay được: passkey (WebAuthn Ch7) — trình duyệt ký lên ORIGIN nó đang ở (tên miền lừa đảo) và máy chủ thật kiểm expectedOrigin ⇒ từ chối. Đó là nghĩa cụ thể của "kháng lừa đảo": một tính chất mật mã (gắn origin), không phải "cẩn thận". Đo thật: password/TOTP bị trộm phiên, passkey cho 0. Thêm: phiên ngắn + gắn thiết bị + cảnh báo thiết bị mới. Theo OWASP MFA + NIST SP 800-63B.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Phishing, and the kit that relays your real login page</h2>
<p class="lead">Old phishing showed you a fake login page and hoped you typed your password into it. Modern phishing does not bother faking anything: it is an Adversary-in-the-Middle relay that shows you your <em>real</em> login page, forwarded live, and steals the session that results — defeating the password and most second factors at once.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> explain how an AiTM relay works and why TLS and URL-checking do not stop it; say why an OTP second factor is relayed but a passkey is not; and name origin binding as the property that makes a credential phishing-resistant.</p>
</div>

<h3>How the relay works</h3>
<p>The attacker runs a reverse proxy on a look-alike domain — <code>login.labflovv.example</code>, a punycode twin, a typo a tired person does not read. Every keystroke you type is forwarded to the real LabFlow ID; every real page it sends back (including the real TOTP prompt) is forwarded to you. You are on a genuine TLS connection with a green padlock — to the attacker's proxy. The connection is secure; it is just secure to the wrong party.</p>

<h3>Why your instincts fail</h3>
<p>"Check for HTTPS" fails: the relay has real TLS. "Check the URL" fails against a convincing look-alike at 3am. And the second factor fails too, because of what it <em>is</em>: a password and a TOTP code are both <strong>replayable secrets</strong>. Whatever you send that is just a value, the relay captures and replays to the real server, keeping the session cookie it gets back.</p>

<h3>The one factor it cannot relay</h3>
<p>A passkey (WebAuthn, Chapter 7) is not a replayable secret. The browser signs a challenge together with the <em>origin it is on</em> — the phishing domain — and the real server checks <code>expectedOrigin</code> (exactly the check Chapter 7's demo proved with a real Chromium). The assertion is signed for <code>login.labflovv.example</code>; LabFlow ID wants <code>id.labflow.example</code>, sees the mismatch, and rejects it. The measured relay:</p>
${ra(OUT['102-relay'])}
<p>Password and TOTP are both relayed — the attacker steals the session. The passkey yields nothing, because its signature is bound to the phishing origin and the real server demands its own. That is what "phishing-resistant" means, concretely: not a warning, a cryptographic property.</p>

<h3>Origin binding is the defence</h3>
<p>The defence is not "train users to be careful" — a convincing relay beats careful. It is that the credential is <em>bound to the origin</em>, so it is useless anywhere else. A human cannot be socially engineered past a key that simply does not work on the wrong domain. This is why passkeys are not just a nicer password: they remove the phishing relay entirely.</p>

<h3>What else helps for the sessions that still get stolen</h3>
<p>Not everyone has a passkey yet, so limit the damage of a relayed session: short-lived sessions with re-auth for sensitive actions; device-bound sessions (the token tied to a device, useless if relayed elsewhere); showing <em>where</em> a login came from and alerting on new devices (Chapter 5's device list). None of these stop the relay, but they shrink what a stolen cookie reaches — the subject of 10.3.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "we have MFA, so we are safe from phishing."</strong> OTP-based MFA (SMS, TOTP, push-to-approve) is relayed by every AiTM kit sold today; it is the standard way MFA is bypassed, not a rare feat. Only phishing-resistant factors — passkeys, or hardware security keys — survive a relay. "We have MFA" and "we are phishing-resistant" are different claims.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What is AiTM phishing?"</strong> — A relay that proxies the victim to the real login, forwards the real pages, and steals the resulting session — defeating passwords and OTP second factors.</li>
<li><strong>"Why doesn't TLS or checking the URL stop it?"</strong> — The victim has real TLS to the attacker's look-alike domain; the padlock is green and the URL is a convincing twin.</li>
<li><strong>"What is phishing-resistant MFA?"</strong> — A credential bound to the origin (WebAuthn/passkeys): the signature is over the phishing domain, so the real server rejects it. OTP is not phishing-resistant.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo10/relay.mjs</code>. Which factors does the relay steal, and which yields nothing — and why, in one word?</li>
<li>Explain why a green padlock gives the victim no protection against this attack.</li>
<li>A team adds TOTP and calls the login "phishing-resistant". Correct them in one sentence.</li>
</ol>
<p><strong>Solution:</strong> (1) password and TOTP are stolen; the passkey yields nothing — because of origin binding (its signature is over the phishing domain). (2) the padlock only proves TLS to <em>whatever domain you are on</em>, which is the attacker's look-alike; it says nothing about <em>who</em> that is. (3) TOTP is a replayable code, relayed by any AiTM kit; only origin-bound factors (passkeys) are phishing-resistant.</p>
<p><strong>Done when:</strong> you can explain why OTP is relayed and a passkey is not, using the word "origin".</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AiTM (Adversary-in-the-Middle)</span><span class="v">A relay proxying the victim to the real login, stealing the resulting session.</span></div>
  <div class="kv"><span class="k">replayable secret</span><span class="v">A value (password, OTP) that works wherever it is replayed — so a relay can reuse it.</span></div>
  <div class="kv"><span class="k">origin binding</span><span class="v">A WebAuthn assertion signed over the page's origin, checked by the server (<code>expectedOrigin</code>).</span></div>
  <div class="kv"><span class="k">phishing-resistant</span><span class="v">A credential a relay cannot reuse — passkeys and hardware keys; not OTP.</span></div>
  <div class="kv"><span class="k">device-bound session</span><span class="v">A session token tied to a device, useless if relayed or stolen to another.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>AiTM phishing relays your real login and steals the session; it does not fake the page.</li>
<li>TLS and URL-checking do not stop it — the victim has real TLS to a look-alike domain.</li>
<li>OTP second factors are replayable, so they are relayed; "we have MFA" is not "phishing-resistant".</li>
<li>Only an origin-bound credential — a passkey — survives, because its signature is for the wrong domain.</li>
<li>Limit the rest with short, device-bound sessions and new-device alerts (10.3).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-7-4-passkey', title: 'Back to 7.4 — passkeys and origin binding', sub: 'There, building a passkey with a real Chromium virtual authenticator and proving the server rejects an assertion for the wrong origin. Here, that exact rejection is what defeats the phishing relay. One property, two lessons.', cta: 'OPEN LESSON 7.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Lừa đảo, và bộ công cụ chuyển tiếp NGUYÊN trang đăng nhập thật của bạn</h2>
<p class="lead">Lừa đảo cũ chìa ra một trang đăng nhập giả và hy vọng bạn gõ mật khẩu vào. Lừa đảo hiện đại không buồn làm giả gì: nó là một relay Kẻ-đứng-giữa chìa ra trang đăng nhập <em>thật</em> của bạn, chuyển tiếp trực tiếp, và trộm cái phiên tạo ra — đánh bại mật khẩu và phần lớn yếu tố thứ hai cùng một lúc.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> giải thích một relay AiTM chạy ra sao và vì sao TLS và kiểm URL không chặn nó; nói vì sao một yếu tố thứ hai OTP bị relay nhưng một passkey thì không; và gọi tên gắn-origin là tính chất khiến một tín vật kháng lừa đảo.</p>
</div>

<h3>Relay chạy ra sao</h3>
<p>Kẻ tấn công chạy một reverse proxy trên một tên miền nhìn giống — <code>login.labflovv.example</code>, một bản sinh đôi punycode, một lỗi gõ mà người mệt không đọc kỹ. Mỗi phím bạn gõ được chuyển tới LabFlow ID thật; mỗi trang thật nó gửi về (kể cả ô nhập TOTP thật) được chuyển tới bạn. Bạn đang ở trên một kết nối TLS thật với một ổ khoá xanh — tới proxy của kẻ tấn công. Kết nối an toàn; chỉ là an toàn tới sai bên.</p>

<h3>Vì sao bản năng của bạn thất bại</h3>
<p>"Kiểm HTTPS" thất bại: relay có TLS thật. "Kiểm URL" thất bại trước một bản nhái thuyết phục lúc 3 giờ sáng. Và yếu tố thứ hai cũng thất bại, vì bản chất của nó: một mật khẩu và một mã TOTP đều là <strong>bí mật phát lại được</strong>. Bất cứ gì bạn gửi mà chỉ là một giá trị, relay bắt lấy và phát lại tới máy chủ thật, giữ cái cookie phiên nó nhận về.</p>

<h3>Yếu tố duy nhất nó không relay được</h3>
<p>Một passkey (WebAuthn, Chương 7) không phải một bí mật phát lại được. Trình duyệt ký một thách thức cùng với <em>origin nó đang ở</em> — tên miền lừa đảo — và máy chủ thật kiểm <code>expectedOrigin</code> (đúng phép kiểm mà demo Chương 7 đã chứng minh bằng một Chromium thật). Assertion được ký cho <code>login.labflovv.example</code>; LabFlow ID muốn <code>id.labflow.example</code>, thấy lệch, và từ chối nó. Relay đo thật:</p>
${ra(OUT['102-relay'])}
<p>Mật khẩu và TOTP đều bị relay — kẻ tấn công trộm phiên. Passkey cho ra không gì, vì chữ ký của nó gắn với origin lừa đảo và máy chủ thật đòi origin của mình. Đó là nghĩa cụ thể của "kháng lừa đảo": không phải một lời cảnh báo, một tính chất mật mã.</p>

<h3>Gắn origin là phòng thủ</h3>
<p>Phòng thủ không phải "huấn luyện người dùng cẩn thận" — một relay thuyết phục thắng sự cẩn thận. Nó là việc tín vật <em>gắn với origin</em>, nên vô dụng ở mọi nơi khác. Không thể dùng kỹ thuật xã hội để đưa một con người vượt qua một cái khoá đơn giản không chạy trên sai tên miền. Vì thế passkey không chỉ là một mật khẩu đẹp hơn: nó gỡ bỏ relay lừa đảo hoàn toàn.</p>

<h3>Còn gì giúp cho các phiên vẫn bị trộm</h3>
<p>Chưa phải ai cũng có passkey, nên hãy giới hạn thiệt hại của một phiên bị relay: phiên ngắn hạn với xác thực lại cho thao tác nhạy cảm; phiên gắn thiết bị (token buộc vào một thiết bị, vô dụng nếu bị relay sang nơi khác); hiện <em>đâu</em> là nguồn một lần đăng nhập và cảnh báo thiết bị mới (danh sách thiết bị Chương 5). Không cái nào chặn relay, nhưng chúng thu nhỏ cái một cookie bị trộm với tới — chủ đề của 10.3.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "chúng tôi có MFA, nên an toàn trước lừa đảo."</strong> MFA dựa trên OTP (SMS, TOTP, push bấm-duyệt) bị mọi bộ AiTM bán hôm nay relay; nó là cách chuẩn để vượt MFA, không phải một kỳ công hiếm. Chỉ các yếu tố kháng lừa đảo — passkey, hay khoá bảo mật phần cứng — sống sót qua một relay. "Chúng tôi có MFA" và "chúng tôi kháng lừa đảo" là hai lời khai khác nhau.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Lừa đảo AiTM là gì?"</strong> — Một relay proxy nạn nhân tới trang đăng nhập thật, chuyển tiếp các trang thật, và trộm cái phiên tạo ra — đánh bại mật khẩu và yếu tố thứ hai OTP.</li>
<li><strong>"Sao TLS hay kiểm URL không chặn được?"</strong> — Nạn nhân có TLS thật tới tên miền nhìn giống của kẻ tấn công; ổ khoá xanh và URL là một bản sinh đôi thuyết phục.</li>
<li><strong>"MFA kháng lừa đảo là gì?"</strong> — Một tín vật gắn với origin (WebAuthn/passkey): chữ ký là cho tên miền lừa đảo, nên máy chủ thật từ chối. OTP không kháng lừa đảo.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo10/relay.mjs</code>. Relay trộm những yếu tố nào, và cái nào cho ra không gì — và vì sao, trong một từ?</li>
<li>Giải thích vì sao một ổ khoá xanh không cho nạn nhân chút bảo vệ nào trước cú tấn công này.</li>
<li>Một đội thêm TOTP và gọi trang đăng nhập là "kháng lừa đảo". Chỉnh họ trong một câu.</li>
</ol>
<p><strong>Lời giải:</strong> (1) mật khẩu và TOTP bị trộm; passkey cho ra không gì — vì gắn-origin (chữ ký của nó là cho tên miền lừa đảo). (2) ổ khoá chỉ chứng minh TLS tới <em>bất kỳ tên miền nào bạn đang ở</em>, chính là bản nhái của kẻ tấn công; nó không nói gì về <em>ai</em> là bên đó. (3) TOTP là một mã phát lại được, bị mọi bộ AiTM relay; chỉ các yếu tố gắn-origin (passkey) mới kháng lừa đảo.</p>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao OTP bị relay còn passkey thì không, dùng từ "origin".</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">AiTM (Kẻ-đứng-giữa)</span><span class="v">Một relay proxy nạn nhân tới trang đăng nhập thật, trộm cái phiên tạo ra.</span></div>
  <div class="kv"><span class="k">replayable secret (bí mật phát lại được)</span><span class="v">Một giá trị (mật khẩu, OTP) chạy ở bất cứ đâu được phát lại — nên một relay dùng lại được.</span></div>
  <div class="kv"><span class="k">origin binding (gắn origin)</span><span class="v">Một assertion WebAuthn ký lên origin của trang, máy chủ kiểm (<code>expectedOrigin</code>).</span></div>
  <div class="kv"><span class="k">phishing-resistant (kháng lừa đảo)</span><span class="v">Một tín vật relay không dùng lại được — passkey và khoá phần cứng; không phải OTP.</span></div>
  <div class="kv"><span class="k">device-bound session (phiên gắn thiết bị)</span><span class="v">Một token phiên buộc vào một thiết bị, vô dụng nếu bị relay hay trộm sang nơi khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lừa đảo AiTM chuyển tiếp trang đăng nhập thật và trộm phiên; nó không làm giả trang.</li>
<li>TLS và kiểm URL không chặn — nạn nhân có TLS thật tới một tên miền nhìn giống.</li>
<li>Yếu tố thứ hai OTP phát lại được, nên bị relay; "có MFA" không phải "kháng lừa đảo".</li>
<li>Chỉ một tín vật gắn-origin — một passkey — sống sót, vì chữ ký của nó là cho sai tên miền.</li>
<li>Giới hạn phần còn lại bằng phiên ngắn, gắn thiết bị và cảnh báo thiết bị mới (10.3).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-7-4-passkey', title: 'Quay lại 7.4 — passkey và gắn origin', sub: 'Ở đó, dựng một passkey bằng một Chromium thật với virtual authenticator và chứng minh máy chủ từ chối một assertion cho sai origin. Ở đây, đúng cái từ chối đó là thứ đánh bại relay lừa đảo. Một tính chất, hai bài.', cta: 'MỞ BÀI 7.4 →' })}
</div>
`,
};
