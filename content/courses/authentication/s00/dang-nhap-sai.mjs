/**
 * Authentication · Mục 0 · 0.3 — Một cái đăng nhập chạy được, và sai sáu chỗ. Slug giữ: auth-0-3-dang-nhap-sai.
 * Soạn lại 01/11/2026 (đợt mẫu). Bản cũ dùng Prisma + PostgreSQL và output bịa (Prisma 6.4.1, bảng psql) ⇒ thay bằng
 * LabFlow ID v0: Node 22.23.3 + Express 5.3.0 + tệp JSON, chạy thật trong env -i. Sáu lỗ, mỗi lỗ một output thật.
 */
import G from '../giang/auth-00-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GS = CODE.guessSession.split('\n');
const GS_CORE = [GS[3], GS[4], '…', GS[10], GS[11], GS[12], GS[13], GS[14], GS[15], GS[16], GS[17]].join('\n');
const XS = CODE.storageXss.split('\n');
const XS_CORE = XS.slice(6, 15).join('\n');
const TH = CODE.th03Server.split('\n');
const TH_SIGNIN = TH.slice(17, 23).join('\n');

const NGUON_EN = [
  nguon('🛡️', 'OWASP — Authentication Cheat Sheet', 'Answer every login failure with one generic message, e.g. “Login failed; Invalid user ID or password”, and keep the processing time the same (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🎫', 'OWASP — Session Management Cheat Sheet', 'Session ids need at least 64 bits of entropy from a CSPRNG; idle and absolute timeouts enforced server-side (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📜', 'SecLists — 10k-most-common.txt', 'The public password list used by hole 6: 10,001 lines, “123456” on line 2 (downloaded 01/11/2026).', 'https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt'),
].join('\n');
const NGUON_VI = [
  nguon('🛡️', 'OWASP — Authentication Cheat Sheet', 'Trả mọi lần đăng nhập hỏng bằng một thông điệp chung, ví dụ “Login failed; Invalid user ID or password”, và giữ thời gian xử lý như nhau (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🎫', 'OWASP — Session Management Cheat Sheet', 'Mã phiên cần ít nhất 64 bit entropy từ CSPRNG; thời hạn rảnh và tuyệt đối thi hành ở máy chủ (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('📜', 'SecLists — 10k-most-common.txt', 'Danh sách mật khẩu công khai dùng ở lỗ 6: 10.001 dòng, “123456” nằm ở dòng 2 (tải 01/11/2026).', 'https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Hole</th><th>Measured here</th><th>Fixed in</th><th>What changes</th></tr></thead>
<tbody>
<tr><td>1 · password stored as typed</td><td><code>cat data/db.json</code> prints all three</td><td>Chapter 2</td><td>argon2id hash with per-user salt, tuned by measurement; PostgreSQL</td></tr>
<tr><td>2 · error says which half was wrong</td><td>3 of 6 leaked emails confirmed</td><td>Chapter 6 (start: practice below)</td><td>one message <em>and</em> one duration</td></tr>
<tr><td>3 · session id = <code>Date.now()</code></td><td>found after 36,839 guesses in 4.37 s</td><td>Chapter 1 (lessons 1.2–1.3)</td><td>256 random bits; database keeps only the SHA-256</td></tr>
<tr><td>4 · no expiry, no sign-out</td><td><code>/sign-out</code> 404, session still works</td><td>Chapters 3 and 5</td><td>expires_at, idle timeout, revocation, device list</td></tr>
<tr><td>5 · credential in a custom header</td><td>an injected script read it from localStorage</td><td>Chapters 3 and 4</td><td>HttpOnly, Secure, SameSite cookie</td></tr>
<tr><td>6 · nothing limits attempts</td><td>10,001 guesses in 3.48 s, zero 429s</td><td>Chapters 2, 10, 11</td><td>slow hash, rate limits per account and IP, breached-password check</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Lỗ</th><th>Đo được ở đây</th><th>Vá ở</th><th>Thay đổi gì</th></tr></thead>
<tbody>
<tr><td>1 · mật khẩu lưu nguyên văn</td><td><code>cat data/db.json</code> in cả ba</td><td>Chương 2</td><td>băm argon2id có salt từng người, tham số theo số đo; PostgreSQL</td></tr>
<tr><td>2 · lỗi nói nửa nào sai</td><td>3 trên 6 email rò rỉ được xác nhận</td><td>Chương 6 (khởi đầu: bài thực hành)</td><td>một thông điệp <em>và</em> một thời gian</td></tr>
<tr><td>3 · mã phiên = <code>Date.now()</code></td><td>tìm ra sau 36.839 lần đoán, 4,37 giây</td><td>Chương 1 (bài 1.2–1.3)</td><td>256 bit ngẫu nhiên; CSDL chỉ giữ SHA-256</td></tr>
<tr><td>4 · không hết hạn, không đăng xuất</td><td><code>/sign-out</code> 404, phiên vẫn dùng được</td><td>Chương 3 và 5</td><td>expires_at, thời hạn rảnh, thu hồi, danh sách thiết bị</td></tr>
<tr><td>5 · tín vật trong header tự chế</td><td>một script chèn vào đọc được nó từ localStorage</td><td>Chương 3 và 4</td><td>cookie HttpOnly, Secure, SameSite</td></tr>
<tr><td>6 · không giới hạn lượt thử</td><td>10.001 lần đoán trong 3,48 giây, không một lần 429</td><td>Chương 2, 10, 11</td><td>băm chậm, giới hạn theo tài khoản và IP, kiểm mật khẩu đã lộ</td></tr>
</tbody>
</table>`;

export default {
  title: '0.3 — A login that runs, and is wrong in six ways|||0.3 — Một cái đăng nhập chạy được, và sai sáu chỗ',
  slug: 'auth-0-3-dang-nhap-sai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng LabFlow ID v0 từ số 0 trong 10 phút (Node 22 + Express 5.3.0 + tệp JSON, không Docker), chạy được — rồi tấn công nó bằng script thật: đọc mật khẩu thô, dò 3/6 email, đoán phiên Date.now() sau 36.839 lần trong 4,37 giây, phiên không đăng xuất được, script lấy phiên từ localStorage, thử 10.001 mật khẩu trong 3,48 giây không bị chặn. Sáu lỗ = mục lục của khoá.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>A login that runs, and is wrong in six ways</h2>
<p class="lead">The fastest way to understand what a login system is <em>for</em> is to write one with no protection at all, run it, and then attack it. The 39 lines below sign people up, sign them in and recognise them afterwards. They also contain six separate holes — and every hole is a chapter of this course. This lesson is the table of contents, written as code and proven with real output.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>set up the LabFlow ID project from an empty folder in about ten minutes (Node 22, Express 5, no database server);</li>
<li>drive a JSON API with <code>curl</code>: sign up, sign in, call a protected route;</li>
<li>run six small attack scripts and read what each one proves;</li>
<li>say which chapter fixes which hole, and why the obvious one-line fix is usually incomplete.</li>
</ul>
<p><strong>Why it is worth it:</strong> most student projects ship exactly this code. After this lesson you will see the holes in your own SWP391 login before your lecturer — or an attacker — does.</p>
</div>

<h3>Ten minutes to a running project</h3>
<p>You need Node.js 22 (check with <code>node -v</code>) and a terminal. That is all: no Docker, no database server. Data lives in one JSON file so that you can <em>see</em> it; Chapter 2 moves to PostgreSQL.</p>
${ra(OUT['03-cai-dat'])}
<p><code>npm pkg set type=module</code> lets us write <code>import</code>; <code>--save-exact</code> pins Express to exactly 5.3.0 so your run matches ours. Then add two scripts — <code>npm pkg set scripts.start="node src/server.js" scripts.seed="node scripts/seed.mjs"</code> — and three files. The “database”:</p>
${ma('javascript', CODE.store)}
<p>The server (in the course snapshot this version is kept as <code>demo0/server-v0.js</code>, because <code>src/server.js</code> moves on in Chapter 1):</p>
${ma('javascript', CODE.server0)}
<p>And <code>scripts/seed.mjs</code> (in the snapshot), which posts An, Bình and Cô Lan to the real <code>/sign-up</code> endpoint — Bình chose <code>123456</code>, as real users do.</p>
<p>Start the server with <code>npm start</code> in one terminal; in a second terminal seed, sign in and ask “who am I?”:</p>
${ra(OUT['03-seed'])}
${ra(OUT['03-an-dang-nhap'])}
${ra(OUT['03-me'])}
<p>It works. <strong>That is the point.</strong> None of the six problems below is visible from the outside: every endpoint returns the right thing, a demo would go perfectly, and a happy-path test would pass. Authentication bugs are rarely crashes; they are systems doing exactly what was written.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Store</span><span class="lz-t">Hole 1</span><span class="lz-d">Passwords as typed.</span></div>
  <div class="lz-step"><span class="lz-k">Answer</span><span class="lz-t">Holes 2 and 6</span><span class="lz-d">Says which half was wrong; never counts attempts.</span></div>
  <div class="lz-step"><span class="lz-k">Issue</span><span class="lz-t">Holes 3 and 4</span><span class="lz-d">Guessable id; lives forever.</span></div>
  <div class="lz-step"><span class="lz-k">Carry</span><span class="lz-t">Hole 5</span><span class="lz-d">Custom header ⇒ the front end must keep it in JavaScript.</span></div>
</div>

<h3>Hole 1 — the password is stored as typed</h3>
${ra(OUT['03-db-mat-khau'])}
<p>Everyone's password, readable by anyone who sees this file: a leaked backup, a copied laptop, a curious teammate, a bug that serves files. And because people reuse passwords, An's password here may also open her email. Notice the second session at the bottom — <code>usr_2</code>, Bình. Bình never signed in during this demo; the attacker of hole 6 did. <strong>Chapter 2</strong> replaces <code>password</code> with an argon2id hash and shows how fast a stolen table falls without it.</p>

<h3>Hole 2 — the error says which half was wrong</h3>
${ra(OUT['03-do-email'])}
<p>Six emails from someone else's data leak, one wrong password each. “Wrong password” means <em>this account exists</em>; “No account with that email” means it does not. The form has become a free membership checker. OWASP's rule: one generic message such as “Login failed; Invalid user ID or password” — whatever went wrong. <strong>Chapter 6</strong> finishes the job (see the trap below).</p>

<h3>Hole 3 — the session id is <code>Date.now()</code></h3>
<p>An's session id is <code>1793512776821</code>: the millisecond she signed in. An attacker who knows only the <em>minute</em> — a “new sign-in at 12:59” email, a log line, a screenshot — has 60,000 candidates:</p>
${ma('javascript', GS_CORE)}
${ra(OUT['03-doan-phien'])}
<p>Found after 36,839 guesses in 4.37 seconds, from one laptop — and the server answered every guess politely. The fix is lesson 1.2: 256 bits from the operating system's random generator, so the space is 2<sup>256</sup>, not 60,000. OWASP's floor is 64 bits of entropy; <code>Date.now()</code> within a known minute has about 16. Lesson 1.3 then stores only a hash of the id.</p>

<h3>Hole 4 — it never expires, and there is no sign-out</h3>
${ra(OUT['03-khong-dang-xuat'])}
<p>There is no <code>/sign-out</code> (Express answers 404), and the session row has no expiry. The session that hole 3 just stole works today, next month and next year; a stolen laptop is a permanent key. Throwing the id away in the browser does not help — the server's copy is the one that counts. <strong>Chapter 3</strong> adds expiry and sign-out; <strong>Chapter 5</strong> adds “sign out everywhere” and a device list.</p>

<h3>Hole 5 — the credential travels in a custom header</h3>
<p>The browser will never send <code>x-session</code> on its own, so a real front end must keep the id in JavaScript — usually <code>localStorage</code>. Then any script running on the page can read it. Here is that in real Chromium (Playwright 1.64.1), with a second server on port 4801 playing the attacker:</p>
${ma('javascript', XS_CORE)}
${ra(OUT['03-xss'])}
${ra(OUT['03-xss-evil-log'])}
<p>One injected script — a cross-site scripting bug, a compromised npm package, a dodgy browser extension — read the id and sent it away; with it, curl answers as An. A cookie marked <code>HttpOnly</code> cannot be read by page scripts at all; <strong>Chapter 3</strong> builds it and <strong>Chapter 4</strong> weighs it against tokens.</p>

<h3>Hole 6 — nothing limits attempts</h3>
${ra(OUT['03-do-mk-binh'])}
${ra(OUT['03-do-mk-an'])}
<p>Bình's <code>123456</code> is on line 2 of a public list: found on the second try. An's password is not in the list — but the script still made 10,001 attempts in 3.48 seconds (2,877 per second) and the server never once answered 429 Too Many Requests. Against a real user base, attackers try leaked email/password pairs from other sites (“credential stuffing”, Chapter 10). The defences come in layers: a slow hash makes each guess expensive (Chapter 2), limits per account and per IP stop the loop (Chapters 10–11), and a check against known-breached passwords stops <code>123456</code> at sign-up (Chapter 2).</p>

<h3>Six holes, one roadmap</h3>
${BANG_EN}
<div class="pitfall co-tieu-de">
<p><strong>Trap — fixing hole 2 with a message alone.</strong> The practice below makes both messages identical, and the enumeration script can no longer tell. But look at the code: an unknown email returns at once, while a known one goes on to compare the password. Once Chapter 2 makes that comparison a deliberately slow hash, the <em>time</em> tells what the message no longer does. OWASP warns that “the response time will be different for the same error”; Chapter 6 measures it and hashes a dummy value on the unknown-email path.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Review this login.”</strong> — Walk the six holes in order: storage, messages, id generation, lifetime, transport and storage in the client, attempt limits. It is a complete, structured answer.</li>
<li><strong>“Why not Date.now() or a counter for session ids?”</strong> — Guessable: we found a session in 4.37 s knowing only the minute. Use a CSPRNG with ≥ 128 bits.</li>
<li><strong>“Is ‘Email or password is incorrect’ enough?”</strong> — It closes the message leak, not the timing leak; both branches must cost the same.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Copy <code>src/server.js</code> to <code>demo0/th03-server.js</code> and change <code>/sign-in</code> so that an unknown email and a wrong password get the same 401 message: <em>Email or password is incorrect</em>.</li>
<li>Run it, seed, and run <code>node demo0/enumerate.mjs</code> again.</li>
<li>Write one sentence: what can the attacker still learn, and from what?</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', TH_SIGNIN)}
${ra(OUT['03-thuc-hanh'])}
<p>Every line now gets the same answer, so the script labels all six “no account” — the script simply <strong>can no longer tell</strong>. What is still leaking: the duration (an unknown email skips the password comparison), and holes 1, 3, 4, 5 and 6 are untouched — the guessing attack of hole 6 works exactly as before.</p>
<p><strong>Done when:</strong> the enumeration output shows one identical message for all six emails, and your sentence names timing as the remaining leak.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">plaintext password</span><span class="v">A password stored exactly as typed; one leak exposes every account — and every other site where it was reused.</span></div>
  <div class="kv"><span class="k">account enumeration</span><span class="v">Learning which accounts exist from different answers (messages, timing, status codes).</span></div>
  <div class="kv"><span class="k">session id entropy</span><span class="v">How many bits an attacker must guess; <code>Date.now()</code> in a known minute ≈ 16, OWASP floor 64, LabFlow ID 256.</span></div>
  <div class="kv"><span class="k">XSS (cross-site scripting)</span><span class="v">Attacker-controlled script running on your page with your page's powers, e.g. reading localStorage.</span></div>
  <div class="kv"><span class="k">brute force / credential stuffing</span><span class="v">Trying many passwords for one account / trying leaked email-password pairs across many accounts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>39 lines of Express sign people up, in and back — and pass every happy-path test.</li>
<li>Six holes, each proven: plaintext passwords, a membership oracle, a guessable session (4.37 s), no expiry or sign-out, a script-readable credential, unlimited guessing (10,001 in 3.48 s).</li>
<li>Each hole maps to a chapter; Chapter 1 already fixes hole 3.</li>
<li>One identical message closes the message leak but not the timing leak.</li>
<li>Keep this project: every chapter rewrites a few of these lines.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-0-3-du-an-labflow', title: 'Also in API Design — lesson 0.3: the LabFlow API skeleton', sub: 'Same world: LabFlow, the same An, Bình and Cô Lan, Express 5 on Node 22. That course builds the booking API; this one builds LabFlow ID, the identity service that API will trust from Chapter 8 on. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-5-1-passwords-sessions" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — 5.1: passwords, sessions and Passport</span><span class="lc-sub">Same: hash passwords, keep sessions on the server, never trust the client. Different: SDN302 shows the safe version with bcrypt and Passport-local; this lesson builds the login WITHOUT those protections and attacks each hole for real, so you see what each library line is protecting you from. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Một cái đăng nhập chạy được, và sai sáu chỗ</h2>
<p class="lead">Cách nhanh nhất để hiểu một hệ đăng nhập sinh ra <em>để làm gì</em> là viết một cái không có lớp bảo vệ nào, chạy nó, rồi tấn công nó. 39 dòng dưới đây cho người dùng đăng ký, đăng nhập và nhận ra họ về sau. Chúng cũng chứa sáu lỗ hổng riêng biệt — và mỗi lỗ là một chương của khoá. Bài này là mục lục của khoá, viết bằng mã và chứng minh bằng output thật.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>dựng dự án LabFlow ID từ một thư mục rỗng trong khoảng mười phút (Node 22, Express 5, không cần máy chủ CSDL);</li>
<li>điều khiển một API JSON bằng <code>curl</code>: đăng ký, đăng nhập, gọi route cần đăng nhập;</li>
<li>chạy sáu script tấn công nhỏ và đọc được mỗi cái chứng minh điều gì;</li>
<li>nói được chương nào vá lỗ nào, và vì sao cách vá một dòng hiển nhiên thường chưa đủ.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> phần lớn đồ án sinh viên nộp đúng đoạn mã này. Học xong bài này bạn sẽ thấy lỗ trong chức năng đăng nhập SWP391 của mình trước cả giảng viên — hay kẻ tấn công.</p>
</div>

<h3>Mười phút tới một dự án chạy được</h3>
<p>Bạn cần Node.js 22 (kiểm bằng <code>node -v</code>) và một terminal. Thế thôi: không Docker, không máy chủ CSDL. Dữ liệu nằm trong một tệp JSON để bạn <em>nhìn thấy</em> nó; Chương 2 mới chuyển sang PostgreSQL.</p>
${ra(OUT['03-cai-dat'])}
<p><code>npm pkg set type=module</code> cho phép viết <code>import</code>; <code>--save-exact</code> ghim Express đúng bản 5.3.0 để kết quả của bạn khớp của mình. Rồi thêm hai script — <code>npm pkg set scripts.start="node src/server.js" scripts.seed="node scripts/seed.mjs"</code> — và ba tệp. "Cơ sở dữ liệu":</p>
${ma('javascript', CODE.store)}
<p>Máy chủ (trong bản chụp của khoá, phiên bản này được giữ ở <code>demo0/server-v0.js</code>, vì <code>src/server.js</code> đi tiếp ở Chương 1):</p>
${ma('javascript', CODE.server0)}
<p>Và <code>scripts/seed.mjs</code> (có trong bản chụp), gửi An, Bình, Cô Lan tới chính endpoint <code>/sign-up</code> — Bình chọn <code>123456</code>, như người dùng thật vẫn làm.</p>
<p>Bật máy chủ bằng <code>npm start</code> ở một terminal; ở terminal thứ hai, seed, đăng nhập và hỏi "tôi là ai?":</p>
${ra(OUT['03-seed'])}
${ra(OUT['03-an-dang-nhap'])}
${ra(OUT['03-me'])}
<p>Nó chạy. <strong>Đó chính là vấn đề.</strong> Không lỗ nào trong sáu lỗ dưới đây nhìn thấy được từ bên ngoài: endpoint nào cũng trả đúng, buổi demo sẽ trơn tru, test đường suôn sẽ xanh. Lỗi xác thực hiếm khi là crash; chúng là hệ thống làm đúng y những gì được viết.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lưu</span><span class="lz-t">Lỗ 1</span><span class="lz-d">Mật khẩu lưu nguyên văn.</span></div>
  <div class="lz-step"><span class="lz-k">Trả lời</span><span class="lz-t">Lỗ 2 và 6</span><span class="lz-d">Nói nửa nào sai; không bao giờ đếm lượt thử.</span></div>
  <div class="lz-step"><span class="lz-k">Cấp phát</span><span class="lz-t">Lỗ 3 và 4</span><span class="lz-d">Mã đoán được; sống mãi.</span></div>
  <div class="lz-step"><span class="lz-k">Mang theo</span><span class="lz-t">Lỗ 5</span><span class="lz-d">Header tự chế ⇒ front end phải giữ nó trong JavaScript.</span></div>
</div>

<h3>Lỗ 1 — mật khẩu được lưu nguyên văn</h3>
${ra(OUT['03-db-mat-khau'])}
<p>Mật khẩu của mọi người, ai thấy tệp này là đọc được: bản sao lưu bị lộ, laptop bị chép, một bạn cùng nhóm tò mò, một con bug trả nhầm tệp. Và vì người ta dùng lại mật khẩu, mật khẩu của An ở đây có khi mở được cả email của An. Để ý phiên thứ hai ở cuối — <code>usr_2</code>, Bình. Bình không hề đăng nhập trong demo này; kẻ tấn công ở lỗ 6 đã làm. <strong>Chương 2</strong> thay <code>password</code> bằng bản băm argon2id và cho thấy một bảng bị đánh cắp sụp nhanh cỡ nào nếu không có nó.</p>

<h3>Lỗ 2 — lỗi nói nửa nào sai</h3>
${ra(OUT['03-do-email'])}
<p>Sáu email lấy từ vụ rò rỉ dữ liệu của trang khác, mỗi email một mật khẩu sai. "Wrong password" nghĩa là <em>tài khoản này có tồn tại</em>; "No account with that email" nghĩa là không. Form đăng nhập thành máy kiểm tra thành viên miễn phí. Quy tắc của OWASP: một thông điệp chung như "Login failed; Invalid user ID or password" — bất kể sai chỗ nào. <strong>Chương 6</strong> làm nốt phần còn lại (xem bẫy bên dưới).</p>

<h3>Lỗ 3 — mã phiên là <code>Date.now()</code></h3>
<p>Mã phiên của An là <code>1793512776821</code>: đúng mili giây An đăng nhập. Kẻ tấn công chỉ cần biết <em>phút</em> — một email "đăng nhập mới lúc 12:59", một dòng log, một ảnh chụp màn hình — là còn 60.000 ứng viên:</p>
${ma('javascript', GS_CORE)}
${ra(OUT['03-doan-phien'])}
<p>Tìm ra sau 36.839 lần đoán trong 4,37 giây, từ một chiếc laptop — và máy chủ lịch sự trả lời từng lần đoán. Cách vá là bài 1.2: 256 bit từ bộ sinh ngẫu nhiên của hệ điều hành, nên không gian là 2<sup>256</sup> chứ không phải 60.000. Mức sàn của OWASP là 64 bit entropy; <code>Date.now()</code> trong một phút đã biết chỉ có khoảng 16 bit. Bài 1.3 tiếp đó chỉ lưu bản băm của mã.</p>

<h3>Lỗ 4 — không bao giờ hết hạn, và không có đăng xuất</h3>
${ra(OUT['03-khong-dang-xuat'])}
<p>Không có <code>/sign-out</code> (Express trả 404), và dòng phiên không có hạn. Phiên mà lỗ 3 vừa đánh cắp dùng được hôm nay, tháng sau và năm sau; một chiếc laptop bị mất là chìa khoá vĩnh viễn. Xoá mã ở trình duyệt cũng vô ích — bản ở máy chủ mới là bản có giá trị. <strong>Chương 3</strong> thêm hạn dùng và đăng xuất; <strong>Chương 5</strong> thêm "đăng xuất mọi nơi" và danh sách thiết bị.</p>

<h3>Lỗ 5 — tín vật đi trong header tự chế</h3>
<p>Trình duyệt không bao giờ tự gửi <code>x-session</code>, nên front end thật phải giữ mã trong JavaScript — thường là <code>localStorage</code>. Khi đó script nào chạy trên trang cũng đọc được. Đây là điều đó trong Chromium thật (Playwright 1.64.1), với một máy chủ thứ hai ở cổng 4801 đóng vai kẻ tấn công:</p>
${ma('javascript', XS_CORE)}
${ra(OUT['03-xss'])}
${ra(OUT['03-xss-evil-log'])}
<p>Chỉ một script bị chèn — một lỗi XSS (cross-site scripting — chèn script vào trang), một gói npm bị chiếm, một tiện ích trình duyệt mờ ám — đọc mã và gửi đi; cầm nó, curl trả lời như An. Cookie có cờ <code>HttpOnly</code> thì script trên trang hoàn toàn không đọc được; <strong>Chương 3</strong> dựng nó và <strong>Chương 4</strong> cân nó với token.</p>

<h3>Lỗ 6 — không có gì giới hạn lượt thử</h3>
${ra(OUT['03-do-mk-binh'])}
${ra(OUT['03-do-mk-an'])}
<p><code>123456</code> của Bình nằm ở dòng 2 của một danh sách công khai: tìm ra ở lần thử thứ hai. Mật khẩu của An không có trong danh sách — nhưng script vẫn thử 10.001 lần trong 3,48 giây (2.877 lần mỗi giây) và máy chủ không một lần trả 429 Too Many Requests. Với lượng người dùng thật, kẻ tấn công thử các cặp email/mật khẩu bị lộ từ trang khác ("credential stuffing — nhồi tín vật", Chương 10). Phòng thủ có nhiều lớp: băm chậm làm mỗi lần đoán tốn kém (Chương 2), giới hạn theo tài khoản và theo IP chặn vòng lặp (Chương 10–11), và kiểm mật khẩu đã lộ chặn <code>123456</code> ngay lúc đăng ký (Chương 2).</p>

<h3>Sáu lỗ, một lộ trình</h3>
${BANG_VI}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — vá lỗ 2 chỉ bằng thông điệp.</strong> Bài thực hành bên dưới làm hai thông điệp giống hệt nhau, và script dò email không còn phân biệt được. Nhưng nhìn mã: email lạ trả về ngay, còn email có thật thì đi tiếp tới bước so mật khẩu. Khi Chương 2 biến phép so đó thành một hàm băm cố ý chậm, <em>thời gian</em> sẽ khai ra điều mà thông điệp không còn nói. OWASP cảnh báo "the response time will be different for the same error"; Chương 6 đo điều đó và băm một giá trị giả ở nhánh email lạ.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Review chức năng đăng nhập này."</strong> — Đi qua sáu lỗ theo thứ tự: lưu trữ, thông điệp, cách sinh mã, thời gian sống, cách client mang và cất tín vật, giới hạn lượt thử. Một câu trả lời đủ và có cấu trúc.</li>
<li><strong>"Sao không dùng Date.now() hay bộ đếm làm mã phiên?"</strong> — Đoán được: ta tìm ra một phiên trong 4,37 giây chỉ biết phút đăng nhập. Dùng CSPRNG với ≥ 128 bit.</li>
<li><strong>"'Email hoặc mật khẩu không đúng' đã đủ chưa?"</strong> — Nó bịt chỗ rò qua thông điệp, chưa bịt chỗ rò qua thời gian; hai nhánh phải tốn như nhau.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chép <code>src/server.js</code> sang <code>demo0/th03-server.js</code> và sửa <code>/sign-in</code> để email lạ và mật khẩu sai nhận cùng một thông điệp 401: <em>Email or password is incorrect</em>.</li>
<li>Chạy nó, seed, rồi chạy lại <code>node demo0/enumerate.mjs</code>.</li>
<li>Viết một câu: kẻ tấn công vẫn còn học được gì, và từ đâu?</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', TH_SIGNIN)}
${ra(OUT['03-thuc-hanh'])}
<p>Dòng nào cũng nhận cùng một câu trả lời, nên script gắn nhãn "no account" cho cả sáu — đơn giản là script <strong>không còn phân biệt được nữa</strong>. Thứ vẫn rò: thời gian (email lạ bỏ qua bước so mật khẩu), và lỗ 1, 3, 4, 5, 6 vẫn nguyên — đòn đoán mật khẩu của lỗ 6 chạy y như cũ.</p>
<p><strong>Đạt khi:</strong> output dò email hiện một thông điệp giống hệt nhau cho cả sáu email, và câu của bạn gọi tên thời gian là chỗ rò còn lại.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">plaintext password (mật khẩu thô)</span><span class="v">Mật khẩu lưu đúng như gõ; một lần rò là lộ mọi tài khoản — và mọi trang khác nơi nó được dùng lại.</span></div>
  <div class="kv"><span class="k">account enumeration (dò tài khoản)</span><span class="v">Biết được tài khoản nào tồn tại nhờ các câu trả lời khác nhau (thông điệp, thời gian, mã trạng thái).</span></div>
  <div class="kv"><span class="k">session id entropy (độ ngẫu nhiên của mã phiên)</span><span class="v">Số bit kẻ tấn công phải đoán; <code>Date.now()</code> trong một phút đã biết ≈ 16, sàn OWASP 64, LabFlow ID 256.</span></div>
  <div class="kv"><span class="k">XSS (chèn script vào trang)</span><span class="v">Script do kẻ tấn công điều khiển chạy trên trang của bạn với quyền của trang, ví dụ đọc localStorage.</span></div>
  <div class="kv"><span class="k">brute force / credential stuffing (dò vét / nhồi tín vật)</span><span class="v">Thử nhiều mật khẩu cho một tài khoản / thử các cặp email–mật khẩu bị lộ trên nhiều tài khoản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>39 dòng Express cho đăng ký, đăng nhập, nhận ra người dùng — và qua mọi test đường suôn.</li>
<li>Sáu lỗ, lỗ nào cũng có bằng chứng: mật khẩu thô, máy kiểm tra thành viên, phiên đoán được (4,37 giây), không hết hạn hay đăng xuất, tín vật script đọc được, đoán không giới hạn (10.001 lần trong 3,48 giây).</li>
<li>Mỗi lỗ ứng với một chương; Chương 1 vá ngay lỗ 3.</li>
<li>Một thông điệp giống nhau bịt chỗ rò qua thông điệp nhưng không bịt chỗ rò qua thời gian.</li>
<li>Giữ dự án này: chương nào cũng viết lại vài dòng trong đó.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-0-3-du-an-labflow', title: 'Cũng có ở API Design — bài 0.3: bộ khung LabFlow API', sub: 'Cùng một thế giới: LabFlow, cùng An, Bình, Cô Lan, Express 5 trên Node 22. Khoá đó dựng API đặt phòng; khoá này dựng LabFlow ID, dịch vụ danh tính mà API đó sẽ tin từ Chương 8. Mỗi bài tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-5-1-passwords-sessions" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Đã gặp ở SDN302 — 5.1: mật khẩu, session và Passport</span><span class="lc-sub">Giống: băm mật khẩu, giữ phiên ở server, không tin client. Khác: SDN302 cho xem bản an toàn với bcrypt và Passport-local; bài này dựng cái đăng nhập KHÔNG có các lớp đó rồi tấn công thật từng lỗ, để bạn thấy mỗi dòng thư viện đang bảo vệ bạn khỏi điều gì. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>
</div>
`,
};
