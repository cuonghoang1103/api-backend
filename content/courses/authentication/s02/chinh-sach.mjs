/**
 * Authentication · Chương 2 · 2.4 — Chính sách mật khẩu theo NIST, không theo thói quen. Slug giữ: auth-2-4-chinh-sach.
 * NIST SP 800-63B-4 (đọc 01/11/2026): ≥ 15 ký tự khi là yếu tố duy nhất, ≥ 8 khi có MFA, cho phép ≥ 64, KHÔNG luật pha trộn, KHÔNG
 * hết hạn định kỳ, so NGUYÊN mật khẩu với danh sách chặn, NFC. Đo thật: top-10k qua luật cổ điển 0, ≥ 15 ký tự 1; top-1000 "Viết hoa + 1!"
 * 756 qua; HIBP thật: 123456 = 210.461.208, Password1! = 584.516, P@ssw0rd! = 119.515, iloveyouiloveyou = 4.707, câu tiếng Việt 0;
 * phản hồi 2.094–2.202 hậu tố (tài liệu: đệm 800–1.000); API treo ⇒ null sau 1.503 ms (mở); đăng ký thật 422/422/422/201.
 */
import G from '../giang/auth-02-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const POL = CODE.policy.split('\n');
const CHECK = POL.slice(POL.findIndex((l) => l.startsWith('export const MIN_LENGTH')), POL.length).join('\n')
  .replace(/\/\*\* The blocklist[\s\S]*?\n}\n\n/, '');
const PW = CODE.pwned.split('\n');
const PWNED = PW.slice(PW.findIndex((l) => l.startsWith('export async function')), PW.length).join('\n');

const NGUON_EN = [
  nguon('🏛️', 'NIST SP 800-63B-4 — §3.1.1.2 Password Verifiers', '15 characters minimum as a single factor (8 with MFA), allow ≥ 64, no composition rules, no periodic change, blocklist of the whole password, NFC (read 01/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
  nguon('🔐', 'Have I Been Pwned — API v3, Pwned Passwords', 'GET /range/{first 5 SHA-1 chars}, no API key, no rate limit; Add-Padding pads to 800–1,000 records (read 01/11/2026).', 'https://haveibeenpwned.com/API/v3'),
  nguon('📚', 'SecLists — 10k-most-common.txt', 'The 10,001-line list used as the blocklist and as the attacker’s list in this chapter (read 01/11/2026).', 'https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt'),
].join('\n');
const NGUON_VI = [
  nguon('🏛️', 'NIST SP 800-63B-4 — §3.1.1.2 Bên kiểm mật khẩu', 'Tối thiểu 15 ký tự khi là yếu tố duy nhất (8 khi có MFA), cho phép ≥ 64, không luật pha trộn, không đổi định kỳ, so nguyên mật khẩu với danh sách chặn, NFC (đọc 01/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
  nguon('🔐', 'Have I Been Pwned — API v3, Pwned Passwords', 'GET /range/{5 ký tự đầu của SHA-1}, không cần khoá API, không giới hạn tần suất; Add-Padding đệm thành 800–1.000 bản ghi (đọc 01/11/2026).', 'https://haveibeenpwned.com/API/v3'),
  nguon('📚', 'SecLists — 10k-most-common.txt', 'Danh sách 10.001 dòng dùng làm danh sách chặn và làm danh sách của kẻ tấn công trong chương này (đọc 01/11/2026).', 'https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Rule you may be asked for</th><th>NIST 800-63B-4</th><th>LabFlow ID v0.2</th></tr></thead>
<tbody>
<tr><td>minimum length</td><td>15 as the only factor, 8 with MFA</td><td>15 (passwords are the only factor until Chapter 7)</td></tr>
<tr><td>maximum length</td><td>allow at least 64; never truncate</td><td>128 code points (body ≤ 8 kB — lesson 2.3)</td></tr>
<tr><td>“an upper-case letter, a digit and a symbol”</td><td><strong>SHALL NOT</strong></td><td>none</td></tr>
<tr><td>change every 90 days</td><td><strong>SHALL NOT</strong>; force a change on evidence of compromise</td><td><code>must_change_password</code> when found on the blocklist</td></tr>
<tr><td>blocklist</td><td>SHALL — whole password, say why it was rejected</td><td>SecLists top 10,001 + context words + HIBP at sign-up</td></tr>
<tr><td>hints, security questions</td><td><strong>SHALL NOT</strong></td><td>none</td></tr>
<tr><td>paste, password managers</td><td>SHALL allow</td><td>allowed (nothing to block on the server)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Luật bạn có thể được yêu cầu</th><th>NIST 800-63B-4</th><th>LabFlow ID v0.2</th></tr></thead>
<tbody>
<tr><td>độ dài tối thiểu</td><td>15 khi là yếu tố duy nhất, 8 khi có MFA</td><td>15 (mật khẩu là yếu tố duy nhất tới Chương 7)</td></tr>
<tr><td>độ dài tối đa</td><td>cho phép ít nhất 64; không bao giờ cắt bớt</td><td>128 code point (thân request ≤ 8 kB — bài 2.3)</td></tr>
<tr><td>"một chữ hoa, một chữ số và một ký hiệu"</td><td><strong>SHALL NOT</strong> (không được)</td><td>không có</td></tr>
<tr><td>đổi mỗi 90 ngày</td><td><strong>SHALL NOT</strong>; buộc đổi khi có bằng chứng bị lộ</td><td><code>must_change_password</code> khi nằm trong danh sách chặn</td></tr>
<tr><td>danh sách chặn</td><td>SHALL — so nguyên mật khẩu, nói lý do từ chối</td><td>top 10.001 của SecLists + từ ngữ ngữ cảnh + HIBP lúc đăng ký</td></tr>
<tr><td>gợi ý, câu hỏi bảo mật</td><td><strong>SHALL NOT</strong></td><td>không có</td></tr>
<tr><td>dán, trình quản lý mật khẩu</td><td>SHALL cho phép</td><td>cho phép (máy chủ chẳng có gì để chặn)</td></tr>
</tbody>
</table>`;

export default {
  title: '2.4 — A password policy from NIST, not from habit|||2.4 — Chính sách mật khẩu theo NIST, không theo thói quen',
  slug: 'auth-2-4-chinh-sach',
  type: 'LESSON',
  isFreePreview: true,
  description: 'NIST SP 800-63B-4 (2025) nói gì thật: ≥ 15 ký tự khi mật khẩu là yếu tố duy nhất, cho phép ≥ 64, KHÔNG luật hoa-thường-số-ký-hiệu, KHÔNG đổi định kỳ, so nguyên mật khẩu với danh sách chặn. Đo thật: 756/1.000 mật khẩu phổ biến qua luật cổ điển sau khi "viết hoa + 1!"; Password1! có 584.516 lần trong các vụ lộ. Kiểm mật khẩu đã lộ qua HIBP chỉ gửi 5 ký tự hex (k-ẩn danh, gọi API thật), mở hay đóng khi dịch vụ treo, checkNewPassword của LabFlow ID v0.2 và tài khoản cũ của Bình.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>A password policy from NIST, not from habit</h2>
<p class="lead">Lesson 2.1 ended with an uncomfortable result: argon2id makes each guess cost 86 ms and 64 MiB, and Bình's <code>123456</code> still fell after <strong>2</strong> guesses. No hash protects a password that sits near the top of every attacker's list. The only defence is not to accept it in the first place — and the usual rules for that (“one upper-case letter, one digit, one symbol”, “change every 90 days”) come from habit. This lesson replaces them with the current NIST guideline and checks each rule against real lists and real breach data.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>state what NIST SP 800-63B-4 requires and forbids for passwords, with the section number;</li>
<li>show with a list why composition rules fail and length works;</li>
<li>check whether a password has leaked by sending only 5 hex characters (k-anonymity);</li>
<li>decide — on purpose — what sign-up does when the breach service is down;</li>
<li>handle existing accounts with weak passwords without locking anyone out.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> every project gets a “password must contain…” request; you will answer it with the standard and with numbers.</p>
</div>

<h3>An everyday picture first</h3>
<p>A shared gate has a 4-digit code. The landlord's rule “the code must contain a 0 and a 9” produces <code>0009</code> and <code>9000</code> — which is exactly what a burglar tries first. A rule “not 1234, not 0000, not the house number” removes the guesses burglars really make, and a 6-digit code has 100 times as many possibilities whatever the digits. Passwords are the same: <strong>rules change how people write a common password; lists and length change whether it is common.</strong></p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Length</span><span class="lz-d">15+ characters when the password is the only factor. Removes almost the whole common-password list at once.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Blocklist</span><span class="lz-d">The whole password against a list of common ones + context words (the service name, the email's local part).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Breach check</span><span class="lz-d">Has this exact password leaked anywhere? Ask HIBP with 5 hex characters.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nothing else</span><span class="lz-d">No composition rules, no expiry, no hints. Allow paste and password managers.</span></div>
</div>

<h3>What NIST SP 800-63B-4 actually says</h3>
${BANG_EN}
<p>Revision 4 (2025) raised the minimum for a password used <em>alone</em> to 15 (8 with a second factor); LabFlow ID has no second factor until Chapter 7. The <em>SHALL NOT</em> rows are not “optional to skip” — the standard forbids them, because they make passwords weaker in practice.</p>

<h3>Do composition rules keep common passwords out? Measure.</h3>
${ra(OUT['24-composition'])}
<p>At first sight the classic rule works: <strong>0</strong> of the 10,001 common passwords pass it, because the list is mostly lower-case. But people do not abandon their password when a form refuses it; they capitalise the first letter and add <code>1!</code>. Do exactly that to the top 1,000 and <strong>756</strong> pass — <code>Password1!</code>, <code>Qwerty1!</code>, <code>Dragon1!</code>. Length is different: only <strong>1</strong> of the 10,001 has 15 characters or more.</p>

<h3>Rules say yes, breach data says no</h3>
<p>Have I Been Pwned (HIBP) keeps hundreds of millions of passwords from real breaches. Its <strong>range API</strong> answers “how many times has this password appeared?” without ever receiving the password:</p>
${ra(OUT['24-hibp'])}
<p><code>Password1!</code> and <code>P@ssw0rd!</code> satisfy every classic rule and appear <strong>584,516</strong> and <strong>119,515</strong> times. A lower-case Vietnamese sentence of 33 characters fails the classic rules — and appears <strong>0</strong> times. The old rules were measuring the wrong thing.</p>

<h3>How the breach check keeps the password secret (k-anonymity)</h3>
${ma('javascript', PWNED)}
<ol>
<li>SHA-1 the password (NFC first): <code>123456</code> → <code>7C4A8D09CA37…</code>.</li>
<li>Send only the first <strong>5 hex characters</strong> (<code>7C4A8</code>, 20 bits). Every password whose SHA-1 starts with them gets the same answer.</li>
<li>HIBP returns every suffix with that prefix and its count — 2,094 to 2,202 lines in our runs.</li>
<li>Look for your suffix <em>locally</em>. The server never learns which of the ~2,100 you meant.</li>
</ol>
<p>The <code>Add-Padding: true</code> header adds fake lines with count 0 so that response sizes do not hint at the prefix. The documentation says padding brings responses to 800–1,000 records; on 01/11/2026 we received over 2,000 real suffixes and a single padding line — the corpus has outgrown the padding size.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — sending the full hash.</strong> “We only send the SHA-1, not the password” is not privacy: an unsalted SHA-1 of a human password is cracked in milliseconds (lesson 2.1). The prefix-only API exists so that you never have to send it.</p>
</div>

<h3>When the breach service hangs</h3>
${ra(OUT['24-down'])}
<p>A server on port 4801 accepts and never answers; <code>AbortSignal.timeout(1500)</code> gives up after 1.5 s with <code>null</code> — “could not ask”. LabFlow ID <strong>fails open</strong>: the local blocklist still applies, the sign-up goes through, and a warning is logged so that a silent outage is visible. Failing closed is also defensible for high-value accounts — but then someone else's outage stops your sign-ups, so decide and write it down. Without a timeout at all, a hung API hangs every sign-up request.</p>

<h3>LabFlow ID v0.2's policy, all of it</h3>
${ma('javascript', CHECK)}
<p>Length counts <strong>code points after NFC</strong> (<code>[...pw].length</code>), as NIST asks. The blocklist compares the <em>whole</em> password, case-insensitively — not substrings, so a long sentence that contains “love” is fine. Context words catch the service name or the email's local part dressed up with digits and symbols. Then, at sign-up, the server adds the HIBP count. Four real sign-ups:</p>
${ra(OUT['24-signup'])}
<p>Every rejection says <em>why</em> (NIST requires it); the form shows a sentence such as “This password has appeared in data breaches”, not a code.</p>

<h3>Existing accounts: Bình's <code>123456</code></h3>
<p>The policy applies to <strong>new</strong> passwords — sign-up, change, reset. It would be wrong to lock Bình out because the rules changed. Instead, at her next successful sign-in the server notices her password on the blocklist and sets <code>must_change_password</code>; lesson 2.3's run showed her sign-in answering <code>"mustChangePassword":true</code>. That is NIST's “force a change on evidence of compromise”, as opposed to the forbidden calendar-based expiry.</p>

<h3>When to use which</h3>
<ul>
<li><strong>Local blocklist</strong> — always, at sign-up, change, reset and (to flag) at sign-in. No network, no latency.</li>
<li><strong>HIBP range API</strong> — at sign-up, change and reset, with a timeout and a logged fail-open. Not on every sign-in: it adds a network call to the hot path.</li>
<li><strong>Composition rules, expiry, hints</strong> — never.</li>
</ul>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What password rules should we enforce?”</strong> — NIST 800-63B-4: 15+ characters when it is the only factor, allow 64+, blocklist the whole password and check breaches; no composition rules, no forced periodic changes.</li>
<li><strong>“The PM wants a symbol rule.”</strong> — Show 756/1,000 passing after “Capital + 1!” and <code>Password1!</code> at 584,516 breaches; offer length + blocklist instead.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo2/hibp.mjs</code> on three passwords you would have chosen at 15 (do <em>not</em> use your real current passwords). How many requests did the server get, and what did it learn?</li>
<li>Extend <code>demo2/composition.mjs</code>: of the top 1,000 after “Capital + 1!”, how many are 15+ characters?</li>
<li>Make <code>checkNewPassword</code> reject <code>"an-lab-2026an-lab"</code> for An (email <code>an@student.labflow.example</code>) as <code>CONTEXT_WORD</code>. Is that what NIST asks, or too strict?</li>
</ol>
<p><strong>Solution:</strong> one request per password, carrying 5 hex characters; the server learns a prefix shared by ~2,000 hashes. For 2 we ran it: <strong>0</strong> of the 1,000 reach 15 characters — length does the work the rules could not. For 3, the current rule returns <code>[]</code> (we ran it): the letters are <code>anlaban</code>, not <code>an</code>; NIST asks for context words “and derivatives”, so rejecting passwords that are mostly the user's name is reasonable — but keep the rule about the <em>whole</em> password, not substrings.</p>
<p><strong>Done when:</strong> you can recite the four SHALL NOT items, you have called the range API and seen the suffix list, and your policy returns a reason for every rejection.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NIST SP 800-63B-4</span><span class="v">US guideline for authenticators (2025); the reference most companies and auditors use.</span></div>
  <div class="kv"><span class="k">composition rules</span><span class="v">“Must contain upper, digit, symbol” — forbidden by NIST.</span></div>
  <div class="kv"><span class="k">blocklist</span><span class="v">Common, expected or compromised passwords that are refused as a whole.</span></div>
  <div class="kv"><span class="k">k-anonymity (range query)</span><span class="v">Sending a prefix shared by many items, so the server cannot tell which one you asked about.</span></div>
  <div class="kv"><span class="k">fail open / fail closed</span><span class="v">What to do when a check cannot run: allow (and log) or refuse.</span></div>
  <div class="kv"><span class="k">evidence of compromise</span><span class="v">A reason to force a password change — e.g. the password is on a breach list — instead of a calendar.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>NIST 800-63B-4: ≥ 15 characters as the only factor, allow ≥ 64, NFC; no composition rules, no periodic expiry, no hints.</li>
<li>Classic rules: 0/10,001 pass, but 756/1,000 pass after “Capital + 1!”; only 1/10,001 has 15+ characters.</li>
<li>HIBP: Password1! 584,516 times; a Vietnamese sentence 0 — sent as 5 hex characters only.</li>
<li>Timeout + logged fail-open (or a deliberate fail-closed).</li>
<li>New passwords are checked; old weak ones are flagged at sign-in, not locked out.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Applied in Node.js — lesson 8.1: password rules that help, and rules that hurt', sub: 'Same: no composition rules, no forced rotation, block breached passwords with the HIBP k-anonymity API. That lesson gives the rules as a short list (minimum 8–12, from the previous NIST revision); this one measures each rule on real lists, calls the API for real and applies revision 4’s 15-character minimum.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Chính sách mật khẩu theo NIST, không theo thói quen</h2>
<p class="lead">Bài 2.1 kết thúc bằng một kết quả khó chịu: argon2id làm mỗi lần đoán tốn 86 ms và 64 MiB, vậy mà <code>123456</code> của Bình vẫn sụp sau <strong>2</strong> lần đoán. Không hàm băm nào bảo vệ được mật khẩu nằm gần đầu danh sách của mọi kẻ tấn công. Cách phòng duy nhất là đừng chấp nhận nó ngay từ đầu — mà các luật quen thuộc cho việc đó ("một chữ hoa, một chữ số, một ký hiệu", "đổi mỗi 90 ngày") đến từ thói quen. Bài này thay chúng bằng hướng dẫn NIST hiện hành và kiểm từng luật bằng danh sách thật và dữ liệu rò rỉ thật.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nói NIST SP 800-63B-4 yêu cầu và cấm gì với mật khẩu, kèm số mục;</li>
<li>chứng minh bằng danh sách vì sao luật pha trộn ký tự thất bại còn độ dài thì có tác dụng;</li>
<li>kiểm một mật khẩu đã lộ hay chưa mà chỉ gửi 5 ký tự hex (k-ẩn danh — k-anonymity);</li>
<li>quyết định — có chủ đích — luồng đăng ký làm gì khi dịch vụ kiểm rò rỉ không phản hồi;</li>
<li>xử lý tài khoản cũ có mật khẩu yếu mà không khoá ai ra ngoài.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> dự án nào cũng có người đòi "mật khẩu phải chứa…"; bạn sẽ trả lời bằng tiêu chuẩn và bằng số.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Một cổng chung có mã 4 số. Luật của chủ nhà "mã phải có số 0 và số 9" sinh ra <code>0009</code> và <code>9000</code> — đúng những mã kẻ trộm thử đầu tiên. Luật "không 1234, không 0000, không số nhà" loại đúng những lần đoán kẻ trộm hay làm, và mã 6 số có gấp 100 lần khả năng dù chữ số là gì. Mật khẩu cũng vậy: <strong>luật thay đổi cách người ta viết một mật khẩu phổ biến; danh sách và độ dài thay đổi việc nó có phổ biến hay không.</strong></p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Độ dài</span><span class="lz-d">15+ ký tự khi mật khẩu là yếu tố duy nhất. Loại gần như cả danh sách mật khẩu phổ biến trong một nhát.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Danh sách chặn</span><span class="lz-d">So nguyên mật khẩu với danh sách mật khẩu phổ biến + từ ngữ ngữ cảnh (tên dịch vụ, phần trước @ của email).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm rò rỉ</span><span class="lz-d">Đúng mật khẩu này đã lộ ở đâu chưa? Hỏi HIBP bằng 5 ký tự hex.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Không gì khác</span><span class="lz-d">Không luật pha trộn, không hết hạn, không gợi ý. Cho dán và cho dùng trình quản lý mật khẩu.</span></div>
</div>

<h3>NIST SP 800-63B-4 thật sự nói gì</h3>
${BANG_VI}
<p>Bản sửa đổi 4 (2025) nâng mức tối thiểu cho mật khẩu dùng <em>một mình</em> lên 15 (8 khi có yếu tố thứ hai); LabFlow ID chưa có yếu tố thứ hai tới Chương 7. Các dòng <em>SHALL NOT</em> không phải "bỏ qua cũng được" — tiêu chuẩn cấm chúng, vì trên thực tế chúng làm mật khẩu yếu đi.</p>

<h3>Luật pha trộn có giữ mật khẩu phổ biến ở ngoài không? Đo.</h3>
${ra(OUT['24-composition'])}
<p>Thoạt nhìn luật cổ điển có tác dụng: <strong>0</strong> trong 10.001 mật khẩu phổ biến qua được nó, vì danh sách phần lớn là chữ thường. Nhưng người ta không bỏ mật khẩu quen khi form từ chối; họ viết hoa chữ đầu và thêm <code>1!</code>. Làm đúng như thế với top 1.000 thì <strong>756</strong> cái qua — <code>Password1!</code>, <code>Qwerty1!</code>, <code>Dragon1!</code>. Độ dài thì khác: chỉ <strong>1</strong> trong 10.001 cái dài từ 15 ký tự trở lên.</p>

<h3>Luật nói có, dữ liệu rò rỉ nói không</h3>
<p>Have I Been Pwned (HIBP) giữ hàng trăm triệu mật khẩu từ các vụ rò rỉ thật. <strong>Range API</strong> của nó trả lời "mật khẩu này đã xuất hiện bao nhiêu lần?" mà không bao giờ nhận mật khẩu:</p>
${ra(OUT['24-hibp'])}
<p><code>Password1!</code> và <code>P@ssw0rd!</code> thoả mọi luật cổ điển và xuất hiện <strong>584.516</strong> và <strong>119.515</strong> lần. Một câu tiếng Việt chữ thường dài 33 ký tự trượt luật cổ điển — và xuất hiện <strong>0</strong> lần. Luật cũ đo sai thứ cần đo.</p>

<h3>Phép kiểm rò rỉ giữ bí mật mật khẩu thế nào (k-ẩn danh)</h3>
${ma('javascript', PWNED)}
<ol>
<li>Băm SHA-1 mật khẩu (NFC trước): <code>123456</code> → <code>7C4A8D09CA37…</code>.</li>
<li>Chỉ gửi <strong>5 ký tự hex</strong> đầu (<code>7C4A8</code>, 20 bit). Mọi mật khẩu có SHA-1 bắt đầu bằng chúng đều nhận cùng một câu trả lời.</li>
<li>HIBP trả về mọi phần đuôi có tiền tố đó kèm số lần — 2.094 tới 2.202 dòng trong các lần chạy của mình.</li>
<li>Tìm phần đuôi của bạn <em>tại chỗ</em>. Máy chủ không bao giờ biết bạn hỏi cái nào trong ~2.100 cái.</li>
</ol>
<p>Header <code>Add-Padding: true</code> thêm các dòng giả có số lần 0 để kích thước phản hồi không gợi ý tiền tố. Tài liệu nói phần đệm đưa phản hồi về 800–1.000 bản ghi; ngày 01/11/2026 mình nhận hơn 2.000 phần đuôi thật và đúng một dòng đệm — kho dữ liệu đã lớn hơn cỡ đệm.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — gửi cả giá trị băm.</strong> "Bọn em chỉ gửi SHA-1 chứ đâu gửi mật khẩu" không phải là riêng tư: SHA-1 không muối của một mật khẩu do người chọn bị bẻ trong vài mili giây (bài 2.1). API theo tiền tố tồn tại để bạn không bao giờ phải gửi nó.</p>
</div>

<h3>Khi dịch vụ kiểm rò rỉ treo</h3>
${ra(OUT['24-down'])}
<p>Một máy chủ ở cổng 4801 nhận kết nối mà không bao giờ trả lời; <code>AbortSignal.timeout(1500)</code> bỏ cuộc sau 1,5 s với <code>null</code> — "không hỏi được". LabFlow ID <strong>chọn mở (fail open)</strong>: danh sách chặn cục bộ vẫn áp, lượt đăng ký đi qua, và một cảnh báo được ghi log để sự cố âm thầm hiện ra. Chọn đóng (fail closed) cũng bảo vệ được cho tài khoản giá trị cao — nhưng khi đó sự cố của người khác chặn luôn việc đăng ký của bạn, nên hãy quyết định và ghi lại. Không có timeout thì một API treo sẽ treo luôn mọi request đăng ký.</p>

<h3>Chính sách của LabFlow ID v0.2, toàn bộ</h3>
${ma('javascript', CHECK)}
<p>Độ dài đếm theo <strong>code point sau NFC</strong> (<code>[...pw].length</code>), đúng như NIST yêu cầu. Danh sách chặn so <em>nguyên</em> mật khẩu, không phân biệt hoa thường — không so chuỗi con, nên một câu dài có chứa "love" vẫn ổn. Từ ngữ ngữ cảnh bắt tên dịch vụ hay phần trước @ của email được trang điểm thêm số và ký hiệu. Rồi khi đăng ký, máy chủ thêm số lần từ HIBP. Bốn lượt đăng ký thật:</p>
${ra(OUT['24-signup'])}
<p>Lần từ chối nào cũng nói <em>vì sao</em> (NIST bắt buộc); form hiện một câu như "Mật khẩu này đã xuất hiện trong các vụ rò rỉ dữ liệu", không hiện mã.</p>

<h3>Tài khoản đã có: <code>123456</code> của Bình</h3>
<p>Chính sách áp cho mật khẩu <strong>mới</strong> — đăng ký, đổi, đặt lại. Khoá Bình ra ngoài chỉ vì luật đổi là sai. Thay vào đó, ở lần đăng nhập thành công kế tiếp, máy chủ thấy mật khẩu của cô nằm trong danh sách chặn và đặt <code>must_change_password</code>; lần chạy ở bài 2.3 cho thấy lượt đăng nhập của cô trả <code>"mustChangePassword":true</code>. Đó là "buộc đổi khi có bằng chứng bị lộ" của NIST, đối lập với việc hết hạn theo lịch mà NIST cấm.</p>

<h3>Khi nào dùng cái gì</h3>
<ul>
<li><strong>Danh sách chặn cục bộ</strong> — luôn luôn, khi đăng ký, đổi, đặt lại và (để đánh dấu) khi đăng nhập. Không mạng, không trễ.</li>
<li><strong>HIBP range API</strong> — khi đăng ký, đổi và đặt lại, có timeout và chọn mở kèm log. Không gọi ở mọi lượt đăng nhập: nó thêm một lần gọi mạng vào đường nóng.</li>
<li><strong>Luật pha trộn, hết hạn, gợi ý</strong> — không bao giờ.</li>
</ul>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Nên áp luật mật khẩu nào?"</strong> — NIST 800-63B-4: 15+ ký tự khi là yếu tố duy nhất, cho phép 64+, chặn nguyên mật khẩu theo danh sách và kiểm rò rỉ; không luật pha trộn, không bắt đổi định kỳ.</li>
<li><strong>"PM muốn luật ký hiệu."</strong> — Cho xem 756/1.000 qua được sau "viết hoa + 1!" và <code>Password1!</code> với 584.516 lần rò rỉ; đề xuất độ dài + danh sách chặn thay thế.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo2/hibp.mjs</code> với ba mật khẩu bạn từng chọn năm 15 tuổi (<em>đừng</em> dùng mật khẩu thật đang dùng). Máy chủ nhận bao nhiêu request, và biết được gì?</li>
<li>Mở rộng <code>demo2/composition.mjs</code>: trong top 1.000 sau "viết hoa + 1!", bao nhiêu cái dài từ 15 ký tự?</li>
<li>Sửa <code>checkNewPassword</code> để từ chối <code>"an-lab-2026an-lab"</code> của An (email <code>an@student.labflow.example</code>) với lý do <code>CONTEXT_WORD</code>. NIST có yêu cầu vậy không, hay quá chặt?</li>
</ol>
<p><strong>Lời giải:</strong> mỗi mật khẩu một request, mang 5 ký tự hex; máy chủ biết một tiền tố được ~2.000 giá trị băm chia sẻ. Câu 2 mình đã chạy: <strong>0</strong> trong 1.000 cái đạt 15 ký tự — độ dài làm được việc mà luật không làm được. Câu 3: luật hiện tại trả <code>[]</code> (mình đã chạy): chữ cái là <code>anlaban</code>, không phải <code>an</code>; NIST yêu cầu từ ngữ ngữ cảnh "và các biến thể", nên từ chối mật khẩu chủ yếu là tên người dùng là hợp lý — nhưng hãy giữ luật trên <em>nguyên</em> mật khẩu, không theo chuỗi con.</p>
<p><strong>Đạt khi:</strong> bạn đọc thuộc bốn mục SHALL NOT, đã gọi range API và nhìn thấy danh sách phần đuôi, và chính sách của bạn trả lý do cho mọi lần từ chối.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NIST SP 800-63B-4</span><span class="v">Hướng dẫn của Mỹ về yếu tố xác thực (2025); tài liệu tham chiếu mà phần lớn công ty và kiểm toán dùng.</span></div>
  <div class="kv"><span class="k">composition rules (luật pha trộn ký tự)</span><span class="v">"Phải có chữ hoa, chữ số, ký hiệu" — NIST cấm.</span></div>
  <div class="kv"><span class="k">blocklist (danh sách chặn)</span><span class="v">Mật khẩu phổ biến, dễ đoán hoặc đã lộ, bị từ chối khi trùng nguyên.</span></div>
  <div class="kv"><span class="k">k-anonymity (k-ẩn danh, truy vấn theo khoảng)</span><span class="v">Gửi một tiền tố được nhiều phần tử chia sẻ, để máy chủ không biết bạn hỏi cái nào.</span></div>
  <div class="kv"><span class="k">fail open / fail closed (chọn mở / chọn đóng)</span><span class="v">Làm gì khi một phép kiểm không chạy được: cho qua (và ghi log) hay từ chối.</span></div>
  <div class="kv"><span class="k">evidence of compromise (bằng chứng bị lộ)</span><span class="v">Lý do để buộc đổi mật khẩu — ví dụ mật khẩu nằm trong danh sách rò rỉ — thay cho lịch định kỳ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>NIST 800-63B-4: ≥ 15 ký tự khi là yếu tố duy nhất, cho phép ≥ 64, NFC; không luật pha trộn, không hết hạn định kỳ, không gợi ý.</li>
<li>Luật cổ điển: 0/10.001 qua, nhưng 756/1.000 qua sau "viết hoa + 1!"; chỉ 1/10.001 dài 15+ ký tự.</li>
<li>HIBP: Password1! 584.516 lần; một câu tiếng Việt 0 lần — chỉ gửi 5 ký tự hex.</li>
<li>Timeout + chọn mở có ghi log (hoặc chọn đóng có chủ đích).</li>
<li>Mật khẩu mới thì kiểm; mật khẩu cũ yếu thì đánh dấu khi đăng nhập, không khoá ra ngoài.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Áp vào Node.js — bài 8.1: luật mật khẩu nào giúp ích, luật nào gây hại', sub: 'Giống: không luật pha trộn, không bắt đổi định kỳ, chặn mật khẩu đã lộ bằng API k-ẩn danh của HIBP. Bài đó nêu luật thành một danh sách ngắn (tối thiểu 8–12, theo bản NIST trước); bài này đo từng luật trên danh sách thật, gọi API thật và áp mức tối thiểu 15 ký tự của bản sửa đổi 4.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
