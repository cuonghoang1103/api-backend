/**
 * Authentication · Chương 2 · 2.3 — Luồng đăng nhập, với mọi nhánh bằng nhau. Slug giữ: auth-2-3-luong-dang-nhap.
 * Output thật (_ma.mjs): bản ngây thơ :4802 email không tồn tại 2,3/2,2 ms vs sai mật khẩu 86,5/85,9 ms ⇒ 37,3×/39,0×; v0.2 :4800
 * (băm giả) 86,3/86,8 và 85,8/87,1 ms ⇒ 1,0×; NFC vs NFD 25/27 byte, verify false ⇒ chuẩn hoá NFC true (NIST 800-63B-4 nói NFC, không
 * NFKC — sửa bản cũ); mật khẩu 10 triệu ký tự argon2 121 ms (không phải chỗ nguy); thân 20 kB ⇒ 413; pepper: bảng một mình 0/20.
 */
import G from '../giang/auth-02-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NAIVE = CODE.signinNaive.split('\n').slice(7, 14).join('\n');
const SIGNIN = CODE.signin.split('\n').slice(3).join('\n');
const PEP = CODE.pepper.split('\n').slice(7, 11).join('\n');

const NGUON_EN = [
  nguon('🏛️', 'NIST SP 800-63B-4 — Digital Identity Guidelines: Authentication', '§3.1.1.2: apply Unicode normalisation NFC before hashing; an optional keyed hash with a secret key known only to the verifier (read 01/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
  nguon('🦉', 'OWASP — Authentication Cheat Sheet: authentication and error messages', 'Return the same generic message for “no such user” and “wrong password”, and keep the response time the same (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🐍', 'Django security release, 15/09/2013 (CVE-2013-1443)', 'A 1 MB password took about a minute to check with the default PBKDF2 hasher; Django now fails any password over 4,096 bytes (read 01/11/2026).', 'https://www.djangoproject.com/weblog/2013/sep/15/security/'),
].join('\n');
const NGUON_VI = [
  nguon('🏛️', 'NIST SP 800-63B-4 — Hướng dẫn danh tính số: xác thực', '§3.1.1.2: chuẩn hoá Unicode NFC trước khi băm; thêm một lớp băm có khoá bí mật chỉ bên kiểm biết (đọc 01/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
  nguon('🦉', 'OWASP — Authentication Cheat Sheet: thông báo lỗi khi xác thực', 'Trả cùng một thông báo chung cho "không có người dùng" và "sai mật khẩu", và giữ thời gian trả lời như nhau (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('🐍', 'Bản vá bảo mật Django, 15/09/2013 (CVE-2013-1443)', 'Mật khẩu 1 MB tốn khoảng một phút để kiểm với hàm PBKDF2 mặc định; Django từ chối mọi mật khẩu quá 4.096 byte (đọc 01/11/2026).', 'https://www.djangoproject.com/weblog/2013/sep/15/security/'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Branch of sign-in</th><th>Must it look the same from outside?</th><th>How v0.2 does it</th></tr></thead>
<tbody>
<tr><td>no such email · wrong password</td><td><strong>yes</strong> — same status, body and time</td><td>one message; <code>DUMMY</code> hash ⇒ one real verify either way (1.0×)</td></tr>
<tr><td>password &gt; 128 characters · body &gt; 8 kB</td><td>no — the length is the caller's own input</td><td>rejected before hashing (401 / 413)</td></tr>
<tr><td>success with an old hash</td><td>no — the caller already knows the password</td><td>rehash with today's PARAMS, after the verify</td></tr>
<tr><td>password on the blocklist (Bình)</td><td>no — only after a correct password</td><td><code>mustChangePassword: true</code> (lesson 2.4)</td></tr>
<tr><td>rows with cheaper legacy hashes</td><td><strong>yes</strong> — otherwise “never signed in since the migration” leaks</td><td>wrap every row at the same cost (lesson 2.5)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Nhánh của đăng nhập</th><th>Nhìn từ ngoài phải giống nhau?</th><th>v0.2 làm thế nào</th></tr></thead>
<tbody>
<tr><td>email không tồn tại · sai mật khẩu</td><td><strong>có</strong> — cùng mã trạng thái, nội dung và thời gian</td><td>một thông báo; băm giả <code>DUMMY</code> ⇒ đằng nào cũng một lần kiểm thật (1,0×)</td></tr>
<tr><td>mật khẩu &gt; 128 ký tự · thân &gt; 8 kB</td><td>không — độ dài là đầu vào của chính người gọi</td><td>từ chối trước khi băm (401 / 413)</td></tr>
<tr><td>thành công với giá trị băm cũ</td><td>không — người gọi đã biết mật khẩu</td><td>băm lại bằng PARAMS hiện hành, sau khi kiểm</td></tr>
<tr><td>mật khẩu nằm trong danh sách chặn (Bình)</td><td>không — chỉ sau khi mật khẩu đúng</td><td><code>mustChangePassword: true</code> (bài 2.4)</td></tr>
<tr><td>dòng băm bằng hàm cũ rẻ hơn</td><td><strong>có</strong> — không thì lộ "chưa đăng nhập từ hồi chuyển đổi"</td><td>bọc mọi dòng với cùng chi phí (bài 2.5)</td></tr>
</tbody>
</table>`;

export default {
  title: '2.3 — The login flow, with every branch equal|||2.3 — Luồng đăng nhập, với mọi nhánh bằng nhau',
  slug: 'auth-2-3-luong-dang-nhap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Viết lại phần mật khẩu của bài 0.3 cho đúng: cùng một thông báo vẫn rò qua đồng hồ (đo thật 37–39× trên bản ngây thơ), băm giả DUMMY ⇒ 1,0×; chỉ quyết định điều riêng của tài khoản SAU khi kiểm; chuẩn hoá Unicode NFC (Unikey dựng sẵn vs tổ hợp: 25 vs 27 byte); giới hạn đầu vào (argon2 10 triệu ký tự chỉ 121 ms — giới hạn thật là thân request 8 kB ⇒ 413) và logger đặt trước bộ đọc; pepper — mua được gì, tốn gì, và vì sao LabFlow ID v0.2 chưa dùng.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The login flow, with every branch equal</h2>
<p class="lead">LabFlow ID now hashes with argon2id at measured parameters. The sign-in route around it can still give the game away: through which message it returns, through <em>how long</em> it takes, through bytes that look equal and are not, and through what it does with a 20 kB request. This lesson rewrites the sign-in so that every failure looks the same from outside — and measures that it does.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>measure an account-enumeration timing leak through HTTP and close it with a dummy hash;</li>
<li>decide which branches may differ and which must not, with a rule you can state in one sentence;</li>
<li>normalise passwords to NFC so Vietnamese typed two ways signs in the same;</li>
<li>put input limits where they help (the body parser), and still log the requests they reject;</li>
<li>explain what a pepper buys, what it costs, and when to add one.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> most sign-ins pass the “same error message” checklist and fail the stopwatch. Here you learn to check with the stopwatch.</p>
</div>

<h3>An everyday picture first</h3>
<p>You phone a hotel: “Is Mr. Bình staying with you?” A good receptionist answers everyone the same way: “I'm sorry, I can't say.” But if she answers in one second when there is no Bình and in ten seconds when she had to look him up in the register, the <em>delay</em> answers your question. A sign-in route that returns early for an unknown email is that receptionist. The list of emails that have accounts is worth something: it is the first step of credential stuffing (Chapter 10) and of phishing that names the right service.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Same answer</span><span class="lz-d">One status, one body for “no such email” and “wrong password”.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Same work</span><span class="lz-d">Every failure performs exactly one real verify — a dummy one when there is no user.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Same bytes</span><span class="lz-d">Normalise the input (NFC, trimmed lower-case email) before you look anything up or hash anything.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Decide after</span><span class="lz-d">Anything account-specific — rehash, must-change, disabled — only after the password verified.</span></div>
</div>

<h3>The tutorial version leaks through the clock</h3>
<p><code>demo2/signin-naive.js</code> (port 4802) does what most tutorials do — the same message for both failures, and an early return when the email is unknown:</p>
${ma('javascript', NAIVE)}
${ra(OUT['23-naive'])}
<p>Every response is <code>401 {"error":"Email or password is incorrect"}</code>, and still: 2.2 ms for an unknown email, 86 ms for An — <strong>37× and 39×</strong> in two runs of 60 requests each. One request per email is enough to sort a list into “has an account” and “does not”. (Node.js 8.1 measured 27.4× with its own parameters — the same leak, a different hash cost.)</p>

<h3>LabFlow ID v0.2: a dummy hash for the missing user</h3>
${ma('javascript', SIGNIN)}
${ra(OUT['23-v02'])}
<p><code>DUMMY</code> is hashed once at startup with today's <code>PARAMS</code>, so a missing user costs exactly what a wrong password costs: one argon2id verify. Two runs: <strong>1.0×</strong>. Note what is <em>not</em> there: no <code>if (!user) return</code> before the verify, and the rehash happens only after <code>ok</code> — the caller already knows the password, so nothing leaks.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — a dummy hash with the wrong cost.</strong> A dummy made with a different algorithm — say bcrypt cost 10 — took 71–74 ms here against 83–90 ms for a wrong password: <strong>1.2×</strong> in two runs. Smaller, still a signal for a patient attacker. Hash the dummy at startup with the same <code>PARAMS</code> as real users — and when real rows still use cheaper legacy hashes, those rows answer faster too, which is why lesson 2.5 wraps every row at once.</p>
</div>

<h3>Same password, two Vietnamese keyboards</h3>
<p>Unikey and EVKey can type “ì” in two ways: “Unicode dựng sẵn” (one code point, U+00EC) or “Unicode tổ hợp” (“i” followed by U+0300, a combining grave accent). An registers on her phone and signs in from a lab PC set to the other mode:</p>
${ra(OUT['23-unicode'])}
<p>Same picture, 25 vs 27 bytes, and the verify fails — a “wrong password” support ticket that nobody can reproduce. NIST SP 800-63B-4 says verifiers <em>SHOULD</em> apply <strong>NFC</strong> (canonical composition) before hashing. Note: NFC, not NFKC — the old version of this lesson said NFKC; NFKC also folds characters such as full-width letters into others, which NIST does not ask for. LabFlow ID calls <code>password.normalize('NFC')</code> in <code>hashPassword</code> and <code>verifyPassword</code>, and trims and lower-cases the email.</p>

<h3>Input limits — measured, not assumed</h3>
<p>A common worry: “someone sends a 10 MB password and the server hashes for minutes”. That was true for Django in 2013 (CVE-2013-1443: a 1 MB password took about a minute with PBKDF2). For argon2id it is not:</p>
${ra(OUT['23-long'])}
<p>argon2 pre-hashes its input, so 10 million characters cost 121 ms versus 85 ms. The real cost of a huge password is reading and parsing the request body. So LabFlow ID limits the body (<code>express.json({ limit: '8kb' })</code>) and the password (128 characters — NIST asks to allow at least 64). Here is v0.2 answering six sign-ins, the last one with a 20 kB password:</p>
${ra(OUT['23-signin'])}
<p>An signs in; Bình signs in and is told to change <code>123456</code> (lesson 2.4); a messy <code>" An@Student.LabFlow.example "</code> finds An; both failures are identical; the 20 kB body gets <strong>413</strong> before any JSON parsing. One detail from the repo's own history: the request logger is now mounted <em>before</em> <code>express.json()</code> — mounted after, a request rejected by the parser (413, broken JSON) never reached it and left no log line. The server log now shows the 413 with <code>"body":null</code> and the password of every sign-in as <code>"[redacted]"</code>.</p>

<h3>A pepper: what it buys, what it costs</h3>
<p>A <strong>pepper</strong> is a secret key kept <em>outside</em> the database (environment, secret manager, HSM) and mixed in before the slow hash: <code>argon2(HMAC(pepper, password))</code>. NIST calls it an optional keyed hash; OWASP calls it defence in depth.</p>
${ma('javascript', PEP)}
${ra(OUT['23-pepper'])}
<ul>
<li><strong>Buys:</strong> a leaked table <em>alone</em> (SQL injection, a stolen backup) is useless — not even <code>123456</code> matches without the key.</li>
<li><strong>Costs:</strong> lose the key and <em>nobody</em> can sign in; leak it together with the table and you gained nothing; rotating it means every user must sign in again (or a second wrapping layer).</li>
<li><strong>LabFlow ID v0.2 decides: no pepper yet.</strong> The database and the app run on one VPS, so a full compromise leaks both; Chapter 11 builds key management (key ids, rotation, a secret store) first, then a pepper is one line before <code>argon2.hash</code>.</li>
</ul>

<h3>When to use which</h3>
${BANG_EN}

<h3>In interviews / at work</h3>
<ul>
<li><strong>“How do you prevent user enumeration at login?”</strong> — One generic message <em>and</em> constant work: verify against a dummy hash made with the current parameters when the user does not exist; then measure both cases through HTTP.</li>
<li><strong>“Should passwords be normalised?”</strong> — Yes, NFC before hashing (NIST 800-63B-4), on both sign-up and sign-in; count length in code points.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start <code>node demo2/signin-naive.js</code> and <code>node src/server.js</code>, then run <code>node demo2/timing-signin.mjs 4802</code> and <code>… 4800</code> twice each.</li>
<li>In a copy of <code>src/passwords/signin.js</code>, replace <code>DUMMY</code> with a bcrypt cost-10 hash made at startup. Predict the ratio, then measure.</li>
<li>Sign up a Vietnamese password typed in NFD (<code>'Bình-thích-hoa-sen-2026'.normalize('NFD')</code>) and sign in with the NFC form. What happens with and without <code>normalize</code>?</li>
</ol>
<p><strong>Solution</strong> (our machine — outputs above): 37–39× on 4802, 1.0× on 4800. With a bcrypt-10 dummy we measured 70.8 vs 83.4 ms and 73.8 vs 89.7 ms: <strong>1.2×</strong> — the leak is back, smaller; hash the dummy with <code>PARAMS</code>. With normalize both forms sign in; without, the NFD/NFC pair fails exactly like <code>demo2/unicode.mjs</code>.</p>
<p><strong>Done when:</strong> you have two runs at ~1.0× on your machine, you can say which branches may differ and why, and your own sign-in passes the NFD/NFC test.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account enumeration</span><span class="v">Learning which emails have accounts — from messages, status codes or timing.</span></div>
  <div class="kv"><span class="k">dummy hash</span><span class="v">A hash made at startup with today's parameters, verified when no user exists, so both failures cost the same.</span></div>
  <div class="kv"><span class="k">Unicode normalisation (NFC)</span><span class="v">Rewriting text so letters with marks use their composed form; same picture ⇒ same bytes.</span></div>
  <div class="kv"><span class="k">413 Payload Too Large</span><span class="v">The status for a body over the parser's limit — answered before parsing and hashing.</span></div>
  <div class="kv"><span class="k">pepper</span><span class="v">A secret key outside the database, mixed in before the slow hash; defence in depth.</span></div>
  <div class="kv"><span class="k">rehash on login</span><span class="v">After a successful verify of an outdated hash, store a new one with today's parameters.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One message is not enough: the naive route leaks 37–39× through timing.</li>
<li>A dummy hash with today's PARAMS makes both failures cost one verify: 1.0×.</li>
<li>Decide anything account-specific only after the password verified.</li>
<li>NFC on both sides (NIST), trimmed lower-case email.</li>
<li>argon2 makes long passwords cheap; limit the body (8 kB ⇒ 413) and log before the parser.</li>
<li>Pepper: real value with key management and a separate DB — Chapter 11.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Also in API Design — lesson 6.1: authentication for an API', sub: 'Same: passwords are hashed, never stored; one login endpoint returns a token. Different: that lesson hashes with scryptSync at Node’s defaults and moves on to JWT; this one measures what the login route itself leaks (37–39× → 1.0×), normalises Unicode and limits input.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Luồng đăng nhập, với mọi nhánh bằng nhau</h2>
<p class="lead">LabFlow ID giờ đã băm bằng argon2id với tham số tự đo. Nhưng route đăng nhập bao quanh nó vẫn có thể lộ bài: qua thông báo nó trả về, qua <em>thời gian</em> nó tốn, qua những chuỗi byte trông bằng nhau mà không bằng, và qua cách nó xử lý một request 20 kB. Bài này viết lại luồng đăng nhập để mọi lần thất bại nhìn từ ngoài đều như nhau — và đo để chắc chắn là như vậy.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>đo một chỗ rò dò tài khoản (account enumeration) qua thời gian bằng HTTP và bịt nó bằng băm giả;</li>
<li>quyết định nhánh nào được khác, nhánh nào không, bằng một luật nói được trong một câu;</li>
<li>chuẩn hoá mật khẩu về NFC để tiếng Việt gõ theo hai kiểu vẫn đăng nhập như nhau;</li>
<li>đặt giới hạn đầu vào đúng chỗ có ích (bộ đọc thân request), mà vẫn ghi log những request bị nó từ chối;</li>
<li>giải thích pepper mua được gì, tốn gì, và khi nào nên thêm.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> phần lớn luồng đăng nhập qua được bảng kiểm "cùng một thông báo lỗi" nhưng trượt chiếc đồng hồ bấm giờ. Ở đây bạn học cách kiểm bằng đồng hồ.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Bạn gọi cho khách sạn: "Anh Bình có ở chỗ chị không?" Lễ tân giỏi trả lời ai cũng như nhau: "Xin lỗi, em không tiện cho biết." Nhưng nếu cô trả lời sau một giây khi không có ai tên Bình và sau mười giây khi phải lật sổ tìm anh ấy, thì <em>độ trễ</em> đã trả lời câu hỏi của bạn. Route đăng nhập trả về sớm với email lạ chính là cô lễ tân đó. Danh sách email có tài khoản là thứ có giá: nó là bước đầu của nhồi mật khẩu (credential stuffing — Chương 10) và của email lừa đảo gọi đúng tên dịch vụ.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cùng câu trả lời</span><span class="lz-d">Một mã trạng thái, một nội dung cho "email không tồn tại" và "sai mật khẩu".</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cùng công sức</span><span class="lz-d">Lần thất bại nào cũng làm đúng một lần kiểm thật — kiểm với băm giả khi không có người dùng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cùng chuỗi byte</span><span class="lz-d">Chuẩn hoá đầu vào (NFC, email đã cắt khoảng trắng và viết thường) trước khi tra hay băm bất cứ thứ gì.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Quyết định sau</span><span class="lz-d">Mọi thứ riêng của tài khoản — băm lại, buộc đổi, bị khoá — chỉ sau khi mật khẩu đã khớp.</span></div>
</div>

<h3>Bản theo hướng dẫn rò qua đồng hồ</h3>
<p><code>demo2/signin-naive.js</code> (cổng 4802) làm đúng như phần lớn bài hướng dẫn — cùng một thông báo cho cả hai kiểu thất bại, và trả về sớm khi không biết email:</p>
${ma('javascript', NAIVE)}
${ra(OUT['23-naive'])}
<p>Mọi phản hồi đều là <code>401 {"error":"Email or password is incorrect"}</code>, vậy mà: 2,2 ms với email lạ, 86 ms với An — <strong>37× và 39×</strong> trong hai lần chạy, mỗi lần 60 request. Một request cho mỗi email là đủ để chia một danh sách thành "có tài khoản" và "không có". (Node.js 8.1 đo được 27,4× với tham số của bài đó — cùng chỗ rò, chi phí băm khác.)</p>

<h3>LabFlow ID v0.2: băm giả cho người dùng không tồn tại</h3>
${ma('javascript', SIGNIN)}
${ra(OUT['23-v02'])}
<p><code>DUMMY</code> được băm một lần lúc khởi động bằng <code>PARAMS</code> hiện hành, nên người dùng không tồn tại tốn đúng bằng sai mật khẩu: một lần kiểm argon2id. Hai lần chạy: <strong>1,0×</strong>. Để ý thứ <em>không</em> có ở đó: không có <code>if (!user) return</code> trước lần kiểm, và việc băm lại chỉ xảy ra sau <code>ok</code> — người gọi đã biết mật khẩu, nên chẳng có gì rò.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — băm giả sai chi phí.</strong> Một giá trị giả làm bằng thuật toán khác — ví dụ bcrypt cost 10 — tốn 71–74 ms ở đây so với 83–90 ms cho sai mật khẩu: <strong>1,2×</strong> trong hai lần chạy. Nhỏ hơn, nhưng vẫn là tín hiệu cho kẻ tấn công kiên nhẫn. Hãy băm giá trị giả lúc khởi động bằng đúng <code>PARAMS</code> của người dùng thật — và khi dòng thật còn dùng hàm băm cũ rẻ hơn, những dòng đó cũng trả lời nhanh hơn, đó là lý do bài 2.5 bọc mọi dòng một lượt.</p>
</div>

<h3>Cùng mật khẩu, hai kiểu bộ gõ tiếng Việt</h3>
<p>Unikey và EVKey gõ được "ì" theo hai cách: "Unicode dựng sẵn" (một mã, U+00EC) hoặc "Unicode tổ hợp" ("i" theo sau là U+0300, dấu huyền tổ hợp). An đăng ký trên điện thoại rồi đăng nhập từ máy phòng lab đặt kiểu còn lại:</p>
${ra(OUT['23-unicode'])}
<p>Nhìn y hệt, 25 với 27 byte, và lần kiểm trượt — một phiếu hỗ trợ "sai mật khẩu" chẳng ai tái hiện được. NIST SP 800-63B-4 nói bên kiểm <em>SHOULD</em> (nên) áp chuẩn hoá <strong>NFC</strong> (ghép chính tắc) trước khi băm. Lưu ý: NFC, không phải NFKC — bản cũ của bài này ghi NFKC; NFKC còn gộp các ký tự như chữ toàn độ rộng (full-width) thành ký tự khác, điều NIST không yêu cầu. LabFlow ID gọi <code>password.normalize('NFC')</code> trong <code>hashPassword</code> và <code>verifyPassword</code>, và cắt khoảng trắng + viết thường email.</p>

<h3>Giới hạn đầu vào — đo, không đoán</h3>
<p>Một nỗi lo quen thuộc: "ai đó gửi mật khẩu 10 MB và máy chủ băm mất cả phút". Điều đó đúng với Django năm 2013 (CVE-2013-1443: mật khẩu 1 MB mất khoảng một phút với PBKDF2). Với argon2id thì không:</p>
${ra(OUT['23-long'])}
<p>argon2 băm sơ bộ đầu vào, nên 10 triệu ký tự tốn 121 ms so với 85 ms. Cái giá thật của một mật khẩu khổng lồ là đọc và phân tích thân request. Nên LabFlow ID giới hạn thân request (<code>express.json({ limit: '8kb' })</code>) và mật khẩu (128 ký tự — NIST yêu cầu cho phép ít nhất 64). Đây là v0.2 trả lời sáu lần đăng nhập, lần cuối với mật khẩu 20 kB:</p>
${ra(OUT['23-signin'])}
<p>An đăng nhập được; Bình đăng nhập được và được yêu cầu đổi <code>123456</code> (bài 2.4); email lộn xộn <code>" An@Student.LabFlow.example "</code> vẫn tìm ra An; hai lần thất bại giống hệt nhau; thân 20 kB nhận <strong>413</strong> trước khi phân tích JSON. Một chi tiết từ chính lịch sử của repo: logger request giờ được gắn <em>trước</em> <code>express.json()</code> — gắn sau thì request bị bộ đọc từ chối (413, JSON hỏng) không bao giờ tới logger và không để lại dòng log nào. Log máy chủ giờ có dòng 413 với <code>"body":null</code>, và mật khẩu của mọi lần đăng nhập là <code>"[redacted]"</code>.</p>

<h3>Pepper: mua được gì, tốn gì</h3>
<p><strong>Pepper</strong> là một khoá bí mật giữ <em>ngoài</em> cơ sở dữ liệu (biến môi trường, kho bí mật, HSM) và trộn vào trước hàm băm chậm: <code>argon2(HMAC(pepper, password))</code>. NIST gọi đó là lớp băm có khoá tuỳ chọn; OWASP gọi là phòng thủ nhiều lớp.</p>
${ma('javascript', PEP)}
${ra(OUT['23-pepper'])}
<ul>
<li><strong>Mua được:</strong> riêng cái bảng bị lộ (SQL injection, bản sao lưu bị trộm) là vô dụng — không có khoá thì đến <code>123456</code> cũng không khớp.</li>
<li><strong>Tốn:</strong> mất khoá thì <em>không ai</em> đăng nhập được; lộ khoá cùng bảng thì chẳng được gì; xoay khoá nghĩa là mọi người phải đăng nhập lại (hoặc thêm một lớp bọc nữa).</li>
<li><strong>LabFlow ID v0.2 quyết định: chưa dùng pepper.</strong> Cơ sở dữ liệu và ứng dụng chạy trên một VPS, nên bị chiếm trọn thì lộ cả hai; Chương 11 dựng quản lý khoá (mã khoá, xoay khoá, kho bí mật) trước, rồi pepper chỉ là một dòng trước <code>argon2.hash</code>.</li>
</ul>

<h3>Khi nào dùng cái gì</h3>
${BANG_VI}

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Chống dò tài khoản ở màn đăng nhập thế nào?"</strong> — Một thông báo chung <em>và</em> công sức không đổi: kiểm với băm giả tạo bằng tham số hiện hành khi người dùng không tồn tại; rồi đo cả hai trường hợp qua HTTP.</li>
<li><strong>"Có nên chuẩn hoá mật khẩu không?"</strong> — Có, NFC trước khi băm (NIST 800-63B-4), cả lúc đăng ký lẫn đăng nhập; đếm độ dài theo code point.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Bật <code>node demo2/signin-naive.js</code> và <code>node src/server.js</code>, rồi chạy <code>node demo2/timing-signin.mjs 4802</code> và <code>… 4800</code>, mỗi cái hai lần.</li>
<li>Trong một bản sao của <code>src/passwords/signin.js</code>, thay <code>DUMMY</code> bằng một giá trị bcrypt cost 10 tạo lúc khởi động. Đoán tỉ lệ, rồi đo.</li>
<li>Đăng ký một mật khẩu tiếng Việt gõ dạng NFD (<code>'Bình-thích-hoa-sen-2026'.normalize('NFD')</code>) rồi đăng nhập bằng dạng NFC. Có và không có <code>normalize</code> thì chuyện gì xảy ra?</li>
</ol>
<p><strong>Lời giải</strong> (máy của mình — output ở trên): 37–39× ở 4802, 1,0× ở 4800. Với giá trị giả bcrypt-10 mình đo được 70,8 so với 83,4 ms và 73,8 so với 89,7 ms: <strong>1,2×</strong> — chỗ rò quay lại, nhỏ hơn; hãy băm giá trị giả bằng <code>PARAMS</code>. Có normalize thì cả hai dạng đều đăng nhập được; không có thì cặp NFD/NFC trượt đúng như <code>demo2/unicode.mjs</code>.</p>
<p><strong>Đạt khi:</strong> bạn có hai lần chạy ~1,0× trên máy mình, nói được nhánh nào được khác và vì sao, và luồng đăng nhập của bạn qua được phép thử NFD/NFC.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account enumeration (dò tài khoản)</span><span class="v">Biết được email nào có tài khoản — qua thông báo, mã trạng thái hay thời gian.</span></div>
  <div class="kv"><span class="k">dummy hash (băm giả)</span><span class="v">Giá trị băm tạo lúc khởi động bằng tham số hiện hành, đem kiểm khi không có người dùng, để hai kiểu thất bại tốn như nhau.</span></div>
  <div class="kv"><span class="k">Unicode normalisation NFC (chuẩn hoá Unicode)</span><span class="v">Viết lại chữ để chữ có dấu dùng dạng dựng sẵn; nhìn giống nhau ⇒ byte giống nhau.</span></div>
  <div class="kv"><span class="k">413 Payload Too Large</span><span class="v">Mã trạng thái cho thân request vượt giới hạn của bộ đọc — trả lời trước khi phân tích và băm.</span></div>
  <div class="kv"><span class="k">pepper</span><span class="v">Khoá bí mật ngoài cơ sở dữ liệu, trộn vào trước hàm băm chậm; phòng thủ nhiều lớp.</span></div>
  <div class="kv"><span class="k">rehash on login (băm lại khi đăng nhập)</span><span class="v">Sau khi kiểm thành công một giá trị băm đã cũ, lưu giá trị mới bằng tham số hiện hành.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một thông báo là chưa đủ: route ngây thơ rò 37–39× qua thời gian.</li>
<li>Băm giả bằng PARAMS hiện hành làm cả hai kiểu thất bại tốn một lần kiểm: 1,0×.</li>
<li>Chỉ quyết định điều riêng của tài khoản sau khi mật khẩu đã khớp.</li>
<li>NFC ở cả hai phía (NIST), email cắt khoảng trắng và viết thường.</li>
<li>argon2 làm mật khẩu dài rẻ; giới hạn thân request (8 kB ⇒ 413) và log trước bộ đọc.</li>
<li>Pepper: có giá trị thật khi có quản lý khoá và CSDL tách riêng — Chương 11.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-1-xac-thuc', title: 'Cũng có ở API Design — bài 6.1: xác thực cho một API', sub: 'Giống: mật khẩu chỉ băm, không bao giờ lưu; một endpoint đăng nhập trả token. Khác: bài đó băm bằng scryptSync với mặc định của Node rồi chuyển sang JWT; bài này đo chính route đăng nhập rò gì (37–39× → 1,0×), chuẩn hoá Unicode và giới hạn đầu vào.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
