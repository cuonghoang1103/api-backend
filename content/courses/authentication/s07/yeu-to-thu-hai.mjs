/**
 * Authentication · Chương 7 · 7.1 — Yếu tố thứ hai mua được gì, và KHÔNG mua được gì. Slug giữ: auth-7-1-yeu-to-thu-hai. Bài đầu chương.
 * Output thật (_ma.mjs, LabFlow ID v0.7): bước step-up sau phép kiểm mật khẩu trả { ok, via: 'totp' } hoặc { via: 'recovery' }.
 */
import G from '../giang/auth-07-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SV = CODE.server07.split('\n');
const STEPUP = SV.slice(SV.findIndex((l) => l.includes('lesson 7.1/7.3: the step-up')), SV.findIndex((l) => l.includes('lesson 7.4/7.5: passkeys'))).join('\n').trim();

const NGUON_EN = [
  nguon('🏛️', 'NIST SP 800-63B — Digital Identity Guidelines (authenticators & AAL)', 'The factor families (something you know/have/are) and why SMS (restricted) is weaker than an app or a hardware authenticator (read 04/11/2026).', 'https://pages.nist.gov/800-63-3/sp800-63b.html'),
  nguon('🦉', 'OWASP — Multifactor Authentication Cheat Sheet', 'When to require a second factor, step-up for sensitive actions, and the trade-offs of each factor type (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🏛️', 'NIST SP 800-63B — Hướng dẫn danh tính số (bộ xác thực & AAL)', 'Các họ yếu tố (biết/có/là) và vì sao SMS (hạn chế) yếu hơn một app hay một bộ xác thực phần cứng (đọc 04/11/2026).', 'https://pages.nist.gov/800-63-3/sp800-63b.html'),
  nguon('🦉', 'OWASP — Multifactor Authentication Cheat Sheet', 'Khi nào đòi một yếu tố thứ hai, step-up cho hành động nhạy cảm, và đánh đổi của mỗi kiểu yếu tố (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Factor</th><th>Family</th><th>Phishable?</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>password</td><td>know</td><td>yes</td><td>the first factor; everything here is a SECOND one</td></tr>
<tr><td>TOTP app</td><td>have</td><td>yes (relay in 30s)</td><td>cheap, offline, no SMS risk (7.2)</td></tr>
<tr><td>push approval</td><td>have</td><td>yes (+ fatigue)</td><td>easy, but "approve?" spam wears users down</td></tr>
<tr><td>SMS code</td><td>have</td><td>yes</td><td>SIM-swap / SS7 — offer last, never only</td></tr>
<tr><td>passkey</td><td>have/are</td><td><strong>no</strong></td><td>signed over the origin — phishing fails (7.4)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Yếu tố</th><th>Họ</th><th>Lừa được?</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>mật khẩu</td><td>biết</td><td>có</td><td>yếu tố đầu; mọi thứ ở đây là yếu tố THỨ HAI</td></tr>
<tr><td>app TOTP</td><td>có</td><td>có (chuyển tiếp trong 30s)</td><td>rẻ, ngoại tuyến, không rủi ro SMS (7.2)</td></tr>
<tr><td>phê duyệt push</td><td>có</td><td>có (+ mệt mỏi)</td><td>dễ, nhưng spam "duyệt?" làm người dùng rã</td></tr>
<tr><td>mã SMS</td><td>có</td><td>có</td><td>tráo SIM / SS7 — mời cuối, không bao giờ duy nhất</td></tr>
<tr><td>passkey</td><td>có/là</td><td><strong>không</strong></td><td>ký lên origin — lừa đảo thất bại (7.4)</td></tr>
</tbody>
</table>`;

export default {
  title: '7.1 — What a second factor buys, and what it does not|||7.1 — Yếu tố thứ hai mua được gì, và KHÔNG mua được gì',
  slug: 'auth-7-1-yeu-to-thu-hai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một yếu tố thứ hai chặn kẻ tấn công ĐÃ CÓ mật khẩu — bị lộ, dùng lại, bị đoán, bị lừa — bằng cách đòi một thứ chúng KHÔNG có. Nó không chặn mã độc trên máy đã mở khoá, một phiên đã trộm, hay (với TOTP/push) lừa đảo thời gian thực. Bài này phân ba họ yếu tố (biết/có/là — hai yếu tố nghĩa là hai HỌ khác nhau), nói rõ cái mua được và cái không, và đặt bước step-up đúng chỗ: lúc đăng nhập và trước vài hành động nhạy cảm, không phải mỗi request. LabFlow ID v0.7 kiểm mã SAU phép kiểm mật khẩu, trả { ok, via: "totp" | "recovery" }. SMS là yếu nhất (tráo SIM); passkey là cái duy nhất không lừa được (7.4). Theo NIST SP 800-63B + OWASP.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>What a second factor buys, and what it does not</h2>
<p class="lead">Chapters 1–6 made the password as strong as a password can be, and the account around it recoverable. But a password is a secret the user can be tricked into giving away, or that leaks from someone else's breach. A second factor is the answer to exactly one problem — an attacker who has the password — and this chapter is about knowing precisely which problem that is, and which it is not.</p>

<div class="callout ok">
<p><strong>After Chapter 7 you can:</strong> add TOTP you wrote yourself (checked against the RFC vectors), issue recovery codes that are the real way back in, and add passkeys whose origin binding makes phishing impossible — proven with a real browser. Lab 7 grades a from-scratch TOTP against the published standard.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>name the three factor families and say why two of the same family is still one factor;</li>
<li>state what a second factor defends against — and the three things it does not;</li>
<li>place the step-up at login and before sensitive actions, not on every request;</li>
<li>rank TOTP, push, SMS and passkeys by phishing resistance, and say why "we have MFA" is not an answer.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> most "we enabled MFA" rollouts still get phished, because the type of factor was never the question anyone asked. After this lesson it is the first one you ask.</p>
</div>

<h3>An everyday picture first</h3>
<p>A second lock on a door helps only if it <strong>fails differently</strong> from the first. A deadbolt you open with the same key you already lost adds nothing; a deadbolt with its own key, kept somewhere else, is real defence in depth. A second factor is that second key — and it only helps to the extent that losing the password does not also lose it. Two passwords are two locks with the same key. A password plus a phone are two locks with two keys.</p>

<h3>The three families, and what "two factors" means</h3>
<p>Authenticators come in three families: something you <strong>know</strong> (a password), something you <strong>have</strong> (a phone, a security key), something you <strong>are</strong> (a fingerprint). Multi-factor means two <em>different</em> families. A password plus a security question is still one factor — both are things you know, and both leak the same way. The whole value is in the second family failing on a different day from the first.</p>

<h3>What it defends against — and what it does not</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Reused / leaked password</span><span class="lz-t">Defended</span><span class="lz-d">The password from another site's breach is useless without the factor the attacker does not have.</span></div>
  <div class="lz-step"><span class="lz-k">Guessed / sprayed / phished password</span><span class="lz-t">Defended (mostly)</span><span class="lz-d">Even a password the user typed into a fake site is stopped — unless the factor is relayed in real time (TOTP/push).</span></div>
  <div class="lz-step"><span class="lz-k">Malware on the unlocked device</span><span class="lz-t">NOT defended</span><span class="lz-d">If the attacker is already inside the device, they have the factor too.</span></div>
  <div class="lz-step"><span class="lz-k">A stolen live session</span><span class="lz-t">NOT defended</span><span class="lz-d">A session token is not re-challenged; step up before sensitive actions to shrink this (below).</span></div>
</div>

<h3>Step up — not on every request</h3>
<p>You do not demand the second factor on every click; the session carries it after login. You ask at login, and again before a handful of high-value actions — changing the password, adding a passkey, deleting the account. LabFlow ID's step-up runs after the password check and accepts a TOTP code or a single-use recovery code:</p>
${ma('javascript', STEPUP)}
${ra(OUT['73-totp-enroll'])}
<p>The output is the enrollment demo from 7.3, but the two <code>verify</code> lines are the point here: a correct code returns <code>{ ok: true, via: 'totp' }</code>; when the phone is gone, a recovery code returns <code>{ via: 'recovery' }</code>; and a spent recovery code returns <code>BAD_CODE</code>. One endpoint, two ways to satisfy it, both proving the second factor.</p>

<h3>Ranking the factors (this is the real question)</h3>
${BANG_EN}
<div class="pitfall co-tieu-de">
<p><strong>Trap — "we have MFA, so we are safe from phishing."</strong> TOTP and push are second factors, and both are phishable: a convincing fake site collects the password AND the code (or triggers the push) and relays them to the real site within the 30-second window. MFA raises the bar; only a factor <em>bound to the origin</em> — a passkey (7.4) — removes phishing entirely. The label "MFA" does not tell you which you have; the type does.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Is a password plus a PIN two-factor?"</strong> — No — both are things you know, so they leak together. Two factors means two different families.</li>
<li><strong>"We turned on TOTP but users still got phished — why?"</strong> — TOTP is relayable in real time. Only an origin-bound factor (passkey) stops phishing (7.4).</li>
<li><strong>"Should we offer SMS 2FA?"</strong> — Only as a last resort and never as the only option: SIM-swap and SS7 make the delivery channel the weak link (NIST restricts it).</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>bash demo7/totp-enroll.sh</code>. After enrollment, what does the step-up return for a valid code vs a recovery code? What about the same recovery code twice?</li>
<li>For each factor in the table, say which family it is and whether it is phishable. Which single one is not?</li>
<li>Name one attack a second factor does <em>not</em> stop, and explain why stepping up before a sensitive action helps with it.</li>
</ol>
<p><strong>Solution:</strong> (1) a valid code → <code>{ via: 'totp' }</code>, a recovery code → <code>{ via: 'recovery', remaining: 9 }</code>, the reused recovery code → <code>BAD_CODE</code> (single-use). (2) password=know; TOTP/push/SMS=have and all phishable; passkey=have/are and NOT phishable. (3) a stolen live session — re-prompting for the factor before a sensitive action forces the attacker to prove the factor they do not have.</p>
<p><strong>Done when:</strong> you can say, for any factor, which family it is and whether it resists phishing.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">factor family</span><span class="v">Know (password), have (phone/key), are (biometric); MFA needs two different ones.</span></div>
  <div class="kv"><span class="k">second factor (2FA)</span><span class="v">A second proof from a different family, defending against a stolen password.</span></div>
  <div class="kv"><span class="k">step-up authentication</span><span class="v">Re-asking for the factor at login and before sensitive actions, not every request.</span></div>
  <div class="kv"><span class="k">phishing resistance</span><span class="v">Whether a factor survives a convincing fake site relaying it in real time.</span></div>
  <div class="kv"><span class="k">MFA fatigue</span><span class="v">Users approving a spammed push prompt just to make it stop.</span></div>
  <div class="kv"><span class="k">AAL (NIST)</span><span class="v">Authenticator Assurance Level — how strong the authentication is, SMS being restricted.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A second factor answers one problem: an attacker who has the password.</li>
<li>Two factors means two <strong>different</strong> families; two things you know is one factor.</li>
<li>It does not stop device malware, a stolen live session, or real-time phishing of TOTP/push.</li>
<li>Step up at login and before sensitive actions — the session carries the factor in between.</li>
<li>The <em>type</em> is the security: SMS is weakest, passkeys are the only phishing-proof one (7.4).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Compare in API Design — lesson 6.1: authenticating API callers', sub: 'There, machine callers prove identity with keys and signatures (no second factor to prompt); here, a human proves a second factor interactively. Different callers, different tools. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Yếu tố thứ hai mua được gì, và KHÔNG mua được gì</h2>
<p class="lead">Chương 1–6 làm mật khẩu mạnh hết mức một mật khẩu có thể, và tài khoản quanh nó khôi phục được. Nhưng mật khẩu là một bí mật người dùng có thể bị lừa trao đi, hoặc rò từ vụ lộ của người khác. Một yếu tố thứ hai là câu trả lời cho đúng một vấn đề — một kẻ tấn công ĐÃ CÓ mật khẩu — và chương này nói về việc biết chính xác đó là vấn đề nào, và không phải vấn đề nào.</p>

<div class="callout ok">
<p><strong>Học xong Chương 7 bạn làm được:</strong> thêm TOTP tự viết (kiểm với vector RFC), phát mã khôi phục là đường quay lại thật, và thêm passkey mà việc gắn origin khiến lừa đảo bất khả thi — chứng minh bằng một trình duyệt thật. Lab 7 chấm một TOTP viết từ gốc với chuẩn công bố.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>gọi tên ba họ yếu tố và nói vì sao hai cái cùng họ vẫn là một yếu tố;</li>
<li>nêu một yếu tố thứ hai phòng cái gì — và ba thứ nó không phòng;</li>
<li>đặt step-up lúc đăng nhập và trước hành động nhạy cảm, không phải mỗi request;</li>
<li>xếp TOTP, push, SMS và passkey theo khả năng chống lừa đảo, và nói vì sao "chúng tôi có MFA" không phải một câu trả lời.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> phần lớn các đợt "bật MFA" vẫn bị lừa đảo, vì kiểu yếu tố chưa bao giờ là câu ai đó đã hỏi. Học xong bài này nó là câu đầu tiên bạn hỏi.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Một cái khoá thứ hai trên cửa chỉ giúp nếu nó <strong>hỏng khác</strong> cái đầu. Một chốt bạn mở bằng đúng cái chìa đã mất chẳng thêm gì; một chốt có chìa riêng, cất chỗ khác, mới là phòng thủ chiều sâu thật. Một yếu tố thứ hai là cái chìa thứ hai đó — và nó chỉ giúp tới mức mất mật khẩu không đồng thời mất luôn nó. Hai mật khẩu là hai khoá cùng một chìa. Một mật khẩu cộng một điện thoại là hai khoá hai chìa.</p>

<h3>Ba họ, và "hai yếu tố" nghĩa là gì</h3>
<p>Bộ xác thực có ba họ: thứ bạn <strong>biết</strong> (mật khẩu), thứ bạn <strong>có</strong> (điện thoại, khoá bảo mật), thứ bạn <strong>là</strong> (vân tay). Đa yếu tố nghĩa là hai họ <em>khác nhau</em>. Một mật khẩu cộng một câu hỏi bảo mật vẫn là một yếu tố — cả hai là thứ bạn biết, và cả hai rò cùng kiểu. Toàn bộ giá trị nằm ở họ thứ hai hỏng vào một ngày khác với họ đầu.</p>

<h3>Nó phòng cái gì — và không phòng cái gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Mật khẩu dùng lại / bị lộ</span><span class="lz-t">Có phòng</span><span class="lz-d">Mật khẩu từ vụ lộ của site khác vô dụng nếu thiếu cái yếu tố kẻ tấn công không có.</span></div>
  <div class="lz-step"><span class="lz-k">Mật khẩu đoán / phun / lừa</span><span class="lz-t">Phòng (phần lớn)</span><span class="lz-d">Kể cả mật khẩu người dùng gõ vào site giả cũng bị chặn — trừ khi yếu tố bị chuyển tiếp thời gian thực (TOTP/push).</span></div>
  <div class="lz-step"><span class="lz-k">Mã độc trên máy đã mở khoá</span><span class="lz-t">KHÔNG phòng</span><span class="lz-d">Nếu kẻ tấn công đã ở trong máy, chúng có luôn cả yếu tố.</span></div>
  <div class="lz-step"><span class="lz-k">Một phiên sống bị trộm</span><span class="lz-t">KHÔNG phòng</span><span class="lz-d">Một token phiên không bị hỏi lại; step-up trước hành động nhạy cảm để thu nhỏ điều này (dưới).</span></div>
</div>

<h3>Step up — không phải mỗi request</h3>
<p>Bạn không đòi yếu tố thứ hai ở mỗi cú bấm; phiên mang nó sau đăng nhập. Bạn hỏi lúc đăng nhập, và lại trước một nhúm hành động giá trị cao — đổi mật khẩu, thêm passkey, xoá tài khoản. Step-up của LabFlow ID chạy sau phép kiểm mật khẩu và nhận một mã TOTP hoặc một mã khôi phục dùng một lần:</p>
${ma('javascript', STEPUP)}
${ra(OUT['73-totp-enroll'])}
<p>Output là demo đăng ký của 7.3, nhưng hai dòng <code>verify</code> mới là điểm ở đây: một mã đúng trả <code>{ ok: true, via: 'totp' }</code>; khi mất điện thoại, một mã khôi phục trả <code>{ via: 'recovery' }</code>; và một mã khôi phục đã tiêu trả <code>BAD_CODE</code>. Một tuyến, hai cách thoả nó, cả hai chứng minh yếu tố thứ hai.</p>

<h3>Xếp hạng các yếu tố (đây mới là câu hỏi thật)</h3>
${BANG_VI}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "chúng tôi có MFA, nên an toàn trước lừa đảo."</strong> TOTP và push là yếu tố thứ hai, và cả hai lừa được: một site giả thuyết phục thu mật khẩu VÀ mã (hoặc kích push) rồi chuyển tiếp tới site thật trong cửa sổ 30 giây. MFA nâng rào; chỉ một yếu tố <em>gắn với origin</em> — một passkey (7.4) — mới gỡ bỏ hoàn toàn lừa đảo. Nhãn "MFA" không nói bạn có cái nào; kiểu mới nói.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Mật khẩu cộng một mã PIN có phải hai yếu tố?"</strong> — Không — cả hai là thứ bạn biết, nên rò cùng nhau. Hai yếu tố nghĩa là hai họ khác nhau.</li>
<li><strong>"Bật TOTP rồi mà người dùng vẫn bị lừa — vì sao?"</strong> — TOTP chuyển tiếp được thời gian thực. Chỉ một yếu tố gắn origin (passkey) chặn lừa đảo (7.4).</li>
<li><strong>"Có nên mời SMS 2FA?"</strong> — Chỉ như phương án cuối và không bao giờ là duy nhất: tráo SIM và SS7 biến kênh chuyển phát thành mắt xích yếu (NIST hạn chế nó).</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>bash demo7/totp-enroll.sh</code>. Sau khi đăng ký, step-up trả gì cho một mã hợp lệ đối lại một mã khôi phục? Còn cùng một mã khôi phục hai lần?</li>
<li>Với mỗi yếu tố trong bảng, nói nó thuộc họ nào và có lừa được không. Cái duy nhất nào không lừa được?</li>
<li>Gọi tên một cú tấn công mà một yếu tố thứ hai <em>không</em> chặn, và giải thích vì sao step-up trước một hành động nhạy cảm giúp với nó.</li>
</ol>
<p><strong>Lời giải:</strong> (1) một mã hợp lệ → <code>{ via: 'totp' }</code>, một mã khôi phục → <code>{ via: 'recovery', remaining: 9 }</code>, mã khôi phục dùng lại → <code>BAD_CODE</code> (dùng một lần). (2) mật khẩu=biết; TOTP/push/SMS=có và đều lừa được; passkey=có/là và KHÔNG lừa được. (3) một phiên sống bị trộm — hỏi lại yếu tố trước một hành động nhạy cảm buộc kẻ tấn công chứng minh cái yếu tố chúng không có.</p>
<p><strong>Đạt khi:</strong> bạn nói được, với bất kỳ yếu tố nào, nó thuộc họ nào và có chống lừa đảo không.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">factor family (họ yếu tố)</span><span class="v">Biết (mật khẩu), có (điện thoại/khoá), là (sinh trắc); MFA cần hai họ khác nhau.</span></div>
  <div class="kv"><span class="k">second factor / 2FA (yếu tố thứ hai)</span><span class="v">Một bằng chứng thứ hai từ một họ khác, phòng một mật khẩu bị trộm.</span></div>
  <div class="kv"><span class="k">step-up authentication (xác thực nâng cấp)</span><span class="v">Hỏi lại yếu tố lúc đăng nhập và trước hành động nhạy cảm, không mỗi request.</span></div>
  <div class="kv"><span class="k">phishing resistance (chống lừa đảo)</span><span class="v">Một yếu tố có sống qua một site giả chuyển tiếp nó thời gian thực không.</span></div>
  <div class="kv"><span class="k">MFA fatigue (mệt mỏi MFA)</span><span class="v">Người dùng duyệt một prompt push bị spam chỉ để nó dừng.</span></div>
  <div class="kv"><span class="k">AAL (NIST)</span><span class="v">Mức bảo đảm bộ xác thực — xác thực mạnh cỡ nào, SMS bị hạn chế.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một yếu tố thứ hai trả lời một vấn đề: một kẻ tấn công đã có mật khẩu.</li>
<li>Hai yếu tố nghĩa là hai họ <strong>khác nhau</strong>; hai thứ bạn biết là một yếu tố.</li>
<li>Nó không chặn mã độc trên máy, một phiên sống bị trộm, hay lừa đảo thời gian thực của TOTP/push.</li>
<li>Step up lúc đăng nhập và trước hành động nhạy cảm — phiên mang yếu tố ở giữa.</li>
<li><em>Kiểu</em> mới là bảo mật: SMS yếu nhất, passkey là cái duy nhất chống-lừa-đảo (7.4).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'So với API Design — bài 6.1: xác thực bên gọi API', sub: 'Ở đó, bên gọi là máy chứng minh danh tính bằng khoá và chữ ký (không có yếu tố thứ hai để hỏi); ở đây, một con người chứng minh một yếu tố thứ hai tương tác. Bên gọi khác, công cụ khác. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
