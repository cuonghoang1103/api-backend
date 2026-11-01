/**
 * Authentication · Chương 2 · Lab 2 — Module mật khẩu của LabFlow ID. BÀI MỚI 01/11/2026, slug auth-2-7-lab-luu-mat-khau (trước quiz).
 * Máy chấm = scripts/cham-lab-2.mjs (9 phép, 10 điểm, đạt 7; gọi 4 hàm với kho giả, không cần CSDL). Output thật (_ma.mjs):
 * khởi đầu 0/10, lần thử đầu "chạy được" 3,5/10 (T6 4.590,6×), lời giải tham khảo src/passwords 10/10, npm test 11 pass.
 */
import G from '../giang/auth-lab-2.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader.split('\n');
const GR_T6 = GR.slice(GR.findIndex((l) => l.startsWith('// ── T6')), GR.findIndex((l) => l.startsWith('// ── T7'))).join('\n').trim();
const STARTER_HEAD = CODE.starter.split('\n').slice(0, 13).join('\n') + '\n…';
const SETUP = `docker run -d --name labflow-id-pg -p 127.0.0.1:4832:5432 \\
  -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=labflow-demo-pw -e POSTGRES_DB=labflow_id postgres:17
export DATABASE_URL=postgres://labflow:labflow-demo-pw@127.0.0.1:4832/labflow_id
npm ci && npm run migrate && npm run seed      # argon2 0.45.1, bcrypt 6.0.0, pg 8.23.1
cp -r lab2/starter lab2/my`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails, for a real user…</th></tr></thead>
<tbody>
<tr><td>T1 argon2id string, ≥ OWASP minimum, random salt</td><td>1</td><td>a parameter set nobody measured, or two users with the same row</td></tr>
<tr><td>T2 a stolen row: no plain/MD5/SHA inside, ≥ 10 ms per guess</td><td>1.5</td><td>the dump of lesson 2.1 cracks in milliseconds</td></tr>
<tr><td>T3 verify: right/wrong, never throws, NFC</td><td>1</td><td>a 500 on a missing field; An locked out on a “tổ hợp” keyboard</td></tr>
<tr><td>T4 old argon2 params, bcrypt-10, wrapped MD5 ⇒ <code>{ ok: true, rehash: true }</code></td><td>1.5</td><td>legacy users cannot sign in, or their rows never upgrade (2.5)</td></tr>
<tr><td>T5 <code>signIn</code> upgrades on success, and only then</td><td>1</td><td>a wrong password rewrites the stored hash</td></tr>
<tr><td>T6 “no such email” vs “wrong password” time ratio &lt; 1.5×</td><td>1.5</td><td>the clock lists who has an account (2.3)</td></tr>
<tr><td>T7 one answer for both failures; email trimmed + lower-case</td><td>0.5</td><td>“NO_SUCH_ACCOUNT” vs “WRONG_PASSWORD”; <code>" An@…"</code> cannot sign in</td></tr>
<tr><td>T8 NIST policy: 15–128, COMMON, CONTEXT_WORD, no composition rules</td><td>1</td><td><code>123456</code> accepted, or a 27-character sentence refused (2.4)</td></tr>
<tr><td>T9 source: no <code>*Sync</code> hashing, no <code>Math.random</code>, no password in a log call</td><td>1</td><td>one login freezes the server; passwords land in the log (1.5)</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt, với người dùng thật…</th></tr></thead>
<tbody>
<tr><td>T1 chuỗi argon2id, ≥ mức tối thiểu OWASP, muối ngẫu nhiên</td><td>1</td><td>bộ tham số chẳng ai đo, hoặc hai người dùng có cùng một dòng</td></tr>
<tr><td>T2 một dòng bị trộm: không chứa chữ thường/MD5/SHA, ≥ 10 ms mỗi lần đoán</td><td>1,5</td><td>bản dump của bài 2.1 sụp trong vài mili giây</td></tr>
<tr><td>T3 kiểm: đúng/sai, không bao giờ ném lỗi, NFC</td><td>1</td><td>lỗi 500 khi thiếu trường; An bị khoá ngoài vì bộ gõ "tổ hợp"</td></tr>
<tr><td>T4 tham số argon2 cũ, bcrypt-10, MD5 đã bọc ⇒ <code>{ ok: true, rehash: true }</code></td><td>1,5</td><td>người dùng cũ không đăng nhập được, hoặc dòng của họ không bao giờ nâng cấp (2.5)</td></tr>
<tr><td>T5 <code>signIn</code> nâng cấp khi thành công, và chỉ khi đó</td><td>1</td><td>một mật khẩu sai ghi đè giá trị băm đang lưu</td></tr>
<tr><td>T6 tỉ lệ thời gian "email không tồn tại" / "sai mật khẩu" &lt; 1,5×</td><td>1,5</td><td>đồng hồ liệt kê ai có tài khoản (2.3)</td></tr>
<tr><td>T7 một câu trả lời cho cả hai kiểu thất bại; email cắt khoảng trắng + viết thường</td><td>0,5</td><td>"NO_SUCH_ACCOUNT" khác "WRONG_PASSWORD"; <code>" An@…"</code> không đăng nhập được</td></tr>
<tr><td>T8 chính sách NIST: 15–128, COMMON, CONTEXT_WORD, không luật pha trộn</td><td>1</td><td><code>123456</code> được nhận, hoặc một câu 27 ký tự bị từ chối (2.4)</td></tr>
<tr><td>T9 mã nguồn: không băm <code>*Sync</code>, không <code>Math.random</code>, không in mật khẩu trong lệnh log</td><td>1</td><td>một lượt đăng nhập làm đứng máy chủ; mật khẩu rơi vào log (1.5)</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 2 — LabFlow ID’s password module|||Lab 2 — Module mật khẩu của LabFlow ID',
  slug: 'auth-2-7-lab-luu-mat-khau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 2, thang 10 điểm (đạt 7) chấm bằng máy: viết module mật khẩu của LabFlow ID — hashPassword (argon2id, tham số tự đo), verifyPassword ({ ok, rehash } cho argon2id cũ, bcrypt, MD5 đã bọc; không ném lỗi; NFC), checkNewPassword (NIST 800-63B-4), signIn (một câu trả lời, băm giả, nâng cấp khi thành công). Máy chấm dump/bẻ/bấm giờ; output thật của bản khởi đầu (0/10), lần thử đầu "chạy được" (3,5/10) và lời giải tham khảo (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab 2</span>
<h2>LabFlow ID’s password module</h2>
<p class="lead">60–90 minutes. You write the four functions that decide how LabFlow ID treats every password from now on: how it is stored, how it is checked (including rows from older systems), which new passwords are refused, and how sign-in answers without revealing who has an account. Then a script dumps, cracks and times your module — the attacks of lessons 2.1–2.5, automated.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> ship a password module you can defend line by line in a code review; read a grader's failure and translate it into what a user would suffer; and reuse the module in Chapter 6 (password reset, change) and Chapter 10 (credential stuffing defence).</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.2 (lesson 2.1). PostgreSQL is only needed to run the server — the grader itself uses a fake in-memory store:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once, so you know the grader runs on your machine (the 10k wordlist from lesson 0.3 must be in <code>wordlists/</code>):
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab2/my/index.js</code>; keep the four exported names. Allowed: <code>node:crypto</code> (MD5 for the legacy branch only), <code>argon2</code>, <code>bcrypt</code>.</li>
</ol>
${ma('javascript', STARTER_HEAD)}

<h3>Your task — behaviour first</h3>
<ul>
<li><code>hashPassword(password)</code> — NFC, then argon2id with parameters <strong>you measured</strong> with <code>demo2/tune.mjs</code> (write the two budgets in a comment). Why: 2.1, 2.2.</li>
<li><code>verifyPassword(stored, password)</code> → <code>{ ok, rehash }</code>. Understands today's argon2id, argon2id with lower parameters, bcrypt (<code>$2a$/$2b$/$2y$</code>) and wrapped legacy MD5 (<code>$md5-argon2id$…</code> = argon2id of the MD5 hex). <code>rehash</code> is true only when <code>ok</code> and the row is not today's argon2id. Non-strings ⇒ <code>{ ok: false, rehash: false }</code>, never a throw. Why: 2.3, 2.5.</li>
<li><code>checkNewPassword(password, { email, blocklist })</code> → <code>[]</code> or problems: <code>TOO_SHORT</code> (&lt; 15 code points), <code>TOO_LONG</code> (&gt; 128), <code>COMMON</code> (whole password in the blocklist, any case), <code>CONTEXT_WORD</code> (only the letters of <code>labflow</code>, <code>labflowid</code> or the email's local part). No composition rules. Why: 2.4.</li>
<li><code>signIn(store, email, password)</code> → <code>{ user }</code> or <code>{ error: 'INVALID_CREDENTIALS' }</code>. Trim + lower-case the email; one verify on every path (a dummy hash made at startup with your parameters); on success with <code>rehash</code>, <code>store.updateHash(id, await hashPassword(password))</code>. Why: 2.3.</li>
</ul>

<h3>How it is graded: 9 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>Two checks measure time (T2, T6), so the grader follows lesson 1.3's rule — alternate the two cases, many rounds, compare medians:</p>
${ma('javascript', GR_T6)}

<h3>A first attempt that “works”</h3>
<p>Here is a reasonable first attempt. An can sign up and sign in; a wrong password is refused.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3.5 out of 10 — the hashing itself is fine, and everything around it is not:</p>
<ul>
<li><strong>T3:</strong> <code>argon2.verify(stored, undefined)</code> throws a TypeError — a request without a password becomes a 500; and no NFC, so the “tổ hợp” typing of lesson 2.3 is refused.</li>
<li><strong>T4:</strong> <code>rehash: false</code> always — rows with old parameters are never upgraded; bcrypt and wrapped MD5 rows never verify.</li>
<li><strong>T5:</strong> Cô Lan's bcrypt row cannot sign in at all (<code>WRONG_PASSWORD</code> for the right password).</li>
<li><strong>T6:</strong> 0.0 ms for an unknown email, 35.2 ms for An — <strong>4,590.6×</strong>: the early return of lesson 2.3, measured in-process with no network noise.</li>
<li><strong>T7:</strong> <code>NO_SUCH_ACCOUNT</code> vs <code>WRONG_PASSWORD</code> — enumeration through the message itself.</li>
<li><strong>T8:</strong> the old symbol rules: <code>123456</code> is refused for being short and lacking a symbol — never for being the second most common password.</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Every check names its lesson. Rerun the lesson's demo when a check fails.</li>
<li><code>verifyPassword</code>: <code>typeof</code> guard first; read the prefix (<code>$argon2id$</code>, <code>$2</code>, <code>$md5-argon2id$</code>); for the wrapped case verify the MD5 hex of the input against the inner argon2id string.</li>
<li><code>needsRehash</code>: parse <code>m=…,p=…,t=…</code> <em>by name</em> (lesson 2.2's trap) and compare with your parameters.</li>
<li><code>signIn</code>: <code>const DUMMY = await hashPassword(randomBytes(16).toString('base64url'))</code> at module level; <code>verifyPassword(user?.passwordHash ?? DUMMY, password)</code>; decide everything else after.</li>
</ol>

<h3>Reference solution — LabFlow ID's <code>src/passwords/</code></h3>
<p>The module the server and later chapters import: <code>hash.js</code> (lessons 2.2 and 2.5), <code>policy.js</code> (2.4), <code>signin.js</code> (2.3) and <code>pwned.js</code> (HIBP — not graded, the grader runs offline). Their code is in the lessons; here is the grade and the tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-2.mjs lab2/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), on two runs in a row.</li>
<li>Your parameters come from your own <code>demo2/tune.mjs</code> run, with both budgets written in a comment.</li>
<li>No <code>hashSync</code>/<code>verifySync</code>, no <code>Math.random</code>, no password in any <code>console</code> call.</li>
<li>Optional: point <code>src/server.js</code> at your module and rerun <code>demo2/timing-signin.mjs 4800</code> — the ratio must stay ~1.0×.</li>
</ul>
<p><strong>Done when:</strong> your module scores ≥ 7/10 twice in a row, and you can explain T4 and T6 in your own words.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab 2</span>
<h2>Module mật khẩu của LabFlow ID</h2>
<p class="lead">60–90 phút. Bạn viết bốn hàm quyết định LabFlow ID đối xử với mọi mật khẩu từ nay về sau: lưu thế nào, kiểm thế nào (kể cả dòng từ hệ cũ), từ chối mật khẩu mới nào, và đăng nhập trả lời ra sao để không lộ ai có tài khoản. Rồi một script dump, bẻ và bấm giờ module của bạn — chính các đòn tấn công của bài 2.1–2.5, được tự động hoá.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> đưa lên một module mật khẩu mà bạn bảo vệ được từng dòng khi review code; đọc một dòng trượt của máy chấm và dịch nó thành điều người dùng phải chịu; và dùng lại module ở Chương 6 (đặt lại, đổi mật khẩu) và Chương 10 (chống nhồi mật khẩu).</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.2 (bài 2.1). PostgreSQL chỉ cần để chạy máy chủ — bản thân máy chấm dùng một kho giả trong bộ nhớ:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần để chắc máy chấm chạy được trên máy bạn (danh sách 10k của bài 0.3 phải nằm trong <code>wordlists/</code>):
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab2/my/index.js</code>; giữ nguyên tên bốn hàm export. Được dùng: <code>node:crypto</code> (MD5 chỉ cho nhánh dữ liệu cũ), <code>argon2</code>, <code>bcrypt</code>.</li>
</ol>
${ma('javascript', STARTER_HEAD)}

<h3>Nhiệm vụ — bắt đầu từ hành vi</h3>
<ul>
<li><code>hashPassword(password)</code> — NFC, rồi argon2id với tham số <strong>bạn tự đo</strong> bằng <code>demo2/tune.mjs</code> (ghi hai ngân sách vào chú thích). Vì sao: 2.1, 2.2.</li>
<li><code>verifyPassword(stored, password)</code> → <code>{ ok, rehash }</code>. Hiểu argon2id hiện hành, argon2id tham số thấp hơn, bcrypt (<code>$2a$/$2b$/$2y$</code>) và MD5 cũ đã bọc (<code>$md5-argon2id$…</code> = argon2id của chuỗi MD5 hex). <code>rehash</code> chỉ true khi <code>ok</code> và dòng không phải argon2id hiện hành. Không phải chuỗi ⇒ <code>{ ok: false, rehash: false }</code>, không bao giờ ném lỗi. Vì sao: 2.3, 2.5.</li>
<li><code>checkNewPassword(password, { email, blocklist })</code> → <code>[]</code> hoặc các vấn đề: <code>TOO_SHORT</code> (&lt; 15 code point), <code>TOO_LONG</code> (&gt; 128), <code>COMMON</code> (nguyên mật khẩu nằm trong danh sách chặn, không phân biệt hoa thường), <code>CONTEXT_WORD</code> (chỉ gồm chữ cái của <code>labflow</code>, <code>labflowid</code> hoặc phần trước @ của email). Không luật pha trộn. Vì sao: 2.4.</li>
<li><code>signIn(store, email, password)</code> → <code>{ user }</code> hoặc <code>{ error: 'INVALID_CREDENTIALS' }</code>. Cắt khoảng trắng + viết thường email; mọi đường đều một lần kiểm (băm giả tạo lúc khởi động bằng tham số của bạn); thành công mà có <code>rehash</code> thì <code>store.updateHash(id, await hashPassword(password))</code>. Vì sao: 2.3.</li>
</ul>

<h3>Chấm thế nào: 9 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>Hai phép đo thời gian (T2, T6), nên máy chấm theo đúng luật của bài 1.3 — xen kẽ hai trường hợp, nhiều vòng, so trung vị:</p>
${ma('javascript', GR_T6)}

<h3>Một lần thử đầu "chạy được"</h3>
<p>Đây là một lần thử đầu hợp lý. An đăng ký và đăng nhập được; mật khẩu sai bị từ chối.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3,5 trên 10 — bản thân việc băm thì ổn, còn mọi thứ quanh nó thì không:</p>
<ul>
<li><strong>T3:</strong> <code>argon2.verify(stored, undefined)</code> ném TypeError — request thiếu mật khẩu thành lỗi 500; và không có NFC, nên kiểu gõ "tổ hợp" ở bài 2.3 bị từ chối.</li>
<li><strong>T4:</strong> <code>rehash: false</code> mãi mãi — dòng tham số cũ không bao giờ được nâng cấp; dòng bcrypt và MD5 đã bọc không bao giờ kiểm khớp.</li>
<li><strong>T5:</strong> dòng bcrypt của Cô Lan hoàn toàn không đăng nhập được (<code>WRONG_PASSWORD</code> với mật khẩu đúng).</li>
<li><strong>T6:</strong> 0,0 ms với email lạ, 35,2 ms với An — <strong>4.590,6×</strong>: lối trả về sớm của bài 2.3, đo ngay trong tiến trình, không có nhiễu mạng.</li>
<li><strong>T7:</strong> <code>NO_SUCH_ACCOUNT</code> khác <code>WRONG_PASSWORD</code> — dò tài khoản ngay qua thông báo.</li>
<li><strong>T8:</strong> luật ký hiệu cũ: <code>123456</code> bị từ chối vì ngắn và thiếu ký hiệu — chưa bao giờ vì nó là mật khẩu phổ biến thứ hai.</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Phép chấm nào cũng gọi tên bài của nó. Chạy lại demo của bài đó khi trượt.</li>
<li><code>verifyPassword</code>: chặn <code>typeof</code> trước; đọc tiền tố (<code>$argon2id$</code>, <code>$2</code>, <code>$md5-argon2id$</code>); với dạng bọc thì kiểm chuỗi MD5 hex của đầu vào với chuỗi argon2id bên trong.</li>
<li><code>needsRehash</code>: đọc <code>m=…,p=…,t=…</code> <em>theo tên</em> (bẫy của bài 2.2) rồi so với tham số của bạn.</li>
<li><code>signIn</code>: <code>const DUMMY = await hashPassword(randomBytes(16).toString('base64url'))</code> ở cấp module; <code>verifyPassword(user?.passwordHash ?? DUMMY, password)</code>; mọi quyết định khác để sau.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/passwords/</code> của LabFlow ID</h3>
<p>Module mà máy chủ và các chương sau import: <code>hash.js</code> (bài 2.2 và 2.5), <code>policy.js</code> (2.4), <code>signin.js</code> (2.3) và <code>pwned.js</code> (HIBP — không chấm, máy chấm chạy ngoại tuyến). Mã của chúng nằm trong các bài; đây là điểm chấm và bộ test:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-2.mjs lab2/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Tham số lấy từ lần chạy <code>demo2/tune.mjs</code> của chính bạn, ghi cả hai ngân sách trong chú thích.</li>
<li>Không <code>hashSync</code>/<code>verifySync</code>, không <code>Math.random</code>, không in mật khẩu trong lệnh <code>console</code> nào.</li>
<li>Tuỳ chọn: trỏ <code>src/server.js</code> sang module của bạn rồi chạy lại <code>demo2/timing-signin.mjs 4800</code> — tỉ lệ phải giữ ~1,0×.</li>
</ul>
<p><strong>Đạt khi:</strong> module của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn giải thích được T4 và T6 bằng lời của mình.</p>
</div>
`,
};
