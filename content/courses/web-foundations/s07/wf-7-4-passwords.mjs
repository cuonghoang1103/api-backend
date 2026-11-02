/**
 * Bài 7.4 — Lưu mật khẩu (nâng cấp 02/11/2026). Output thật: _demo/_t7/mat-khau.mjs (Node 22 + bcryptjs: sha256 không muối bị bảng
 * tra phá ngay, muối làm bảng vô dụng, đo tốc độ sha256 ~1,9 triệu/giây vs bcrypt cost 10 ~75 ms, giải phẫu hash bcrypt, compare),
 * app _t7/app.mjs (scrypt + muối + timingSafeEqual, đã chạy ở 7.1/7.2). Deck: scripts/slides-src/wf-7-4.mjs (9 slide, WF/v1/wf-7-4).
 * Code Lab: wf-7-4-passwords.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const dong = (key, a, b) => OUT[key].split('\n').slice(a - 1, b).join('\n');

const G = walkWf('wf-7-4', 'Storing passwords', 'Lưu mật khẩu', [
  [1, 'Storing passwords',
    '<p>Sooner or later, databases leak: a stolen backup, an SQL injection, a misconfigured server. When that happens, the only question is what the attacker finds in the password column. This lesson measures three answers — plain hashes, salted hashes and slow hashes — on a real machine.</p>',
    '<p>Sớm hay muộn, cơ sở dữ liệu cũng bị lộ: một bản sao lưu bị trộm, một lỗi SQL injection, một máy chủ cấu hình sai. Khi đó, câu hỏi duy nhất là kẻ tấn công thấy gì trong cột mật khẩu. Bài này đo ba câu trả lời — hash thường, hash có muối và hash chậm — trên một máy thật.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to explain why a password is hashed and never encrypted, show how an unsalted hash is cracked with a lookup table, explain what a salt changes, compare the speed of a fast hash and a password hash with real numbers, and write the two functions every app needs: store and check.</p>',
    '<p>Bạn sẽ giải thích được vì sao mật khẩu được hash chứ không bao giờ mã hoá, cho thấy hash không muối bị phá bằng bảng tra thế nào, giải thích muối thay đổi điều gì, so tốc độ của hash nhanh và hash cho mật khẩu bằng số thật, và viết hai hàm mọi app đều cần: lưu và kiểm.</p>'],
  [3, 'Hash, not encryption',
    '<p>Encryption can be reversed by anyone with the key — and the key sits on the same server that leaked. A hash cannot be reversed at all. To check a password at login, the server hashes what the user typed and compares the two hashes. It never needs the original.</p>',
    '<p>Mã hoá đảo ngược được bởi bất kỳ ai có khoá — và khoá nằm ngay trên chính máy chủ đã bị lộ. Hash thì không đảo ngược được. Để kiểm mật khẩu khi đăng nhập, máy chủ hash thứ người dùng gõ rồi so hai hash. Nó không bao giờ cần bản gốc.</p>'],
  [4, 'Unsalted hashes fall to a table',
    '<p>Two users chose 123456 and got identical hashes. An attacker hashes a list of common passwords once and looks up every leaked hash: all three were cracked instantly, including sunflower2009, simply because it was on the list.</p>',
    '<p>Hai người dùng chọn 123456 và có hash giống hệt nhau. Kẻ tấn công hash một danh sách mật khẩu phổ biến một lần rồi tra mọi hash bị lộ: cả ba bị phá ngay, kể cả sunflower2009, chỉ vì nó nằm trong danh sách.</p>'],
  [5, 'A salt per user',
    '<p>A salt is a random value stored next to each hash and mixed into it. The same password now gives different hashes for different users, and a table built in advance is useless. The attacker must start over for every single account.</p>',
    '<p>Muối là một giá trị ngẫu nhiên lưu cạnh mỗi hash và được trộn vào nó. Cùng một mật khẩu giờ cho hash khác nhau ở những người dùng khác nhau, và bảng dựng sẵn trở nên vô dụng. Kẻ tấn công phải bắt đầu lại cho từng tài khoản một.</p>'],
  [6, 'Fast is bad here',
    '<p>On one laptop core, SHA-256 ran almost two million times per second. bcrypt with cost 10 took about seventy-five milliseconds per hash. Trying ten thousand guesses against one account takes milliseconds with SHA-256 and over twelve minutes with bcrypt.</p>',
    '<p>Trên một nhân laptop, SHA-256 chạy gần hai triệu lần mỗi giây. bcrypt với cost 10 mất khoảng bảy mươi lăm mili giây mỗi hash. Thử mười nghìn lần đoán cho một tài khoản mất vài mili giây với SHA-256 và hơn mười hai phút với bcrypt.</p>'],
  [7, 'Inside a bcrypt hash',
    '<p>A bcrypt string carries everything needed to check it: the algorithm, the cost, the salt and the hash. Hashing the same password twice gave two different strings, yet compare returns true for the right password and false when a single letter changes case.</p>',
    '<p>Một chuỗi bcrypt mang đủ mọi thứ để kiểm nó: thuật toán, cost, muối và hash. Hash cùng một mật khẩu hai lần cho hai chuỗi khác nhau, vậy mà compare trả true cho mật khẩu đúng và false khi chỉ một chữ đổi hoa thường.</p>'],
  [8, 'Store and check',
    '<p>Our app stores scrypt hashes with a random salt and compares them with timingSafeEqual. In your projects use bcrypt or Argon2 through a library, never log password fields, allow long passphrases, and reject passwords found in breach lists.</p>',
    '<p>App của ta lưu hash scrypt kèm muối ngẫu nhiên và so bằng timingSafeEqual. Trong dự án của bạn hãy dùng bcrypt hoặc Argon2 qua thư viện, không bao giờ ghi log trường mật khẩu, cho phép cụm mật khẩu dài, và từ chối mật khẩu có trong danh sách bị lộ.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to crack a small leaked table yourself, then fix it with salts and bcrypt and measure how much slower the attack becomes. "Done when" checks your crack rate before and after.</p>',
    '<p>Bài luyện yêu cầu bạn tự phá một bảng nhỏ bị lộ, rồi sửa nó bằng muối và bcrypt và đo cuộc tấn công chậm đi bao nhiêu. "Xong khi" kiểm tỉ lệ phá được trước và sau.</p>'],
]);

export default {
  title: '7.4 — Passwords: hashing, salting, bcrypt|||7.4 — Mật khẩu: hash, muối, bcrypt',
  slug: 'wf-7-4-passwords',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/O6cmuiTBZVs', durationSeconds: 0 },
  description: 'Vì sao hash chứ không mã hoá; đo thật: sha256 không muối — hai người cùng hash, bảng tra phá cả ba ngay; muối mỗi người làm bảng vô dụng; tốc độ ~1,9 triệu sha256/giây vs bcrypt cost 10 ~75 ms (10 000 lần đoán: mili giây vs hơn 12 phút); giải phẫu hash bcrypt, compare; mã lưu/kiểm bằng scrypt + timingSafeEqual; luật mật khẩu hiện đại.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Never store a password. Store something that can only check it.</h2>
<p class="lead">After this lesson you can explain why passwords are hashed and never encrypted, demonstrate how a leaked table of plain SHA-256 hashes is cracked in milliseconds, explain what a salt changes and what it does not, compare a fast hash and a password hash with numbers measured on a real machine, read a bcrypt string, and write the store/check pair correctly. Every app with a login form needs this, and getting it wrong does not show up in testing — it shows up the day the database leaks.</p>

<h3>Step 1 — why the password column matters</h3>
<p>Databases leak through stolen backups, SQL injection (Chapter 8), misconfigured cloud storage or an insider. People also reuse passwords: a leak from a small forum gives attackers the email password and the bank password of many of its users. So the question is not "will it leak?" but "what will they find?".</p>
<table>
<thead><tr><th>Stored as</th><th>After a leak</th></tr></thead>
<tbody>
<tr><td>Plain text</td><td>Every password, instantly. Never acceptable.</td></tr>
<tr><td>Encrypted (AES…)</td><td>Every password, as soon as the key is found — and the key is on the same server.</td></tr>
<tr><td>Fast hash (MD5, SHA-1, SHA-256)</td><td>Common passwords instantly (Step 3), the rest at billions of guesses per second on a GPU.</td></tr>
<tr><td>Fast hash + salt</td><td>No shortcut tables, but still billions of guesses per second per account.</td></tr>
<tr><td>Slow password hash + salt (bcrypt, scrypt, Argon2)</td><td>Only weak passwords fall, slowly, one account at a time.</td></tr>
</tbody>
</table>

<h3>Step 2 — hashing is not encryption</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Encryption</span><span class="v">Two-way: <code>encrypt(text, key)</code> → <code>decrypt(…, key)</code> gives the text back. Right for data you must read again (messages, files).</span></div>
  <div class="kv"><span class="k">Hashing</span><span class="v">One-way: <code>hash(text)</code> → a fixed-length fingerprint. There is no "unhash". The same input always gives the same output.</span></div>
  <div class="kv"><span class="k">Checking a login</span><span class="v">Hash what the user typed with the same salt and settings, compare with the stored hash. The original password is never needed again.</span></div>
</div>
<p>This is also why "forgot password" can never email your old password on a well-built site: the site does not have it. It sends a link to set a new one.</p>

<h3>Step 3 — plain hashes fall to a lookup table (measured)</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [9, 21])}
${ra(dong('_t7/out/mat-khau', 1, 7))}
<p>An and Bình chose the same password, so their hashes are identical — the leak itself tells the attacker that two accounts share a password. The attacker hashed a list of common passwords <em>once</em> and looked every leaked hash up: three out of three cracked, with no real computing at all. Real lists contain hundreds of millions of leaked passwords, and precomputed tables for MD5 and SHA-1 can be downloaded.</p>

<h3>Step 4 — a salt per user</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [23, 29])}
${ra(dong('_t7/out/mat-khau', 9, 11))}
<p>A <strong>salt</strong> is random, unique per user, stored in plain sight next to the hash, and mixed in before hashing. The same <code>123456</code> now gives two unrelated hashes, and neither is in the table. A salt is not a secret: it only forces the attacker to attack each account separately, from scratch.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — one salt for the whole site, or a salt that is not random.</strong> A single "site salt" in the code, the username, or the user id as salt all help less than you think: the attacker builds one table for your site, or salts are predictable. Use at least 16 random bytes per user, generated at sign-up and at every password change. Good libraries do this for you — which is the main reason to use them.</p></div>

<h3>Step 5 — speed: here, fast is bad</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [31, 45])}
${ra(dong('_t7/out/mat-khau', 13, 17))}
<p>SHA-256 is <em>designed</em> to be fast — great for checking file downloads, terrible for passwords. Do the arithmetic for one salted account and a list of 10,000 likely passwords:</p>
<table>
<thead><tr><th>Hash</th><th>Speed on this laptop core</th><th>10,000 guesses for one account</th></tr></thead>
<tbody>
<tr><td>SHA-256 + salt</td><td>~1.9 million per second</td><td>about 5 milliseconds</td></tr>
<tr><td>bcrypt, cost 10</td><td>~13 per second</td><td>about 12.5 minutes</td></tr>
<tr><td>bcrypt, cost 12</td><td>~3.6 per second</td><td>about 46 minutes</td></tr>
</tbody>
</table>
<p>A GPU makes SHA-256 thousands of times faster still, while bcrypt and scrypt are built to resist that. The <strong>cost</strong> (work factor) doubles the time for each +1, so you raise it as computers get faster. Pick the highest value your login can afford: around 100–300 ms per hash on your server is a common target. (These numbers come from <code>bcryptjs</code>, a pure-JavaScript version; the native <code>bcrypt</code> package is a few times faster at the same cost.)</p>

<h3>Step 6 — inside a bcrypt hash</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [47, 55])}
${ra(dong('_t7/out/mat-khau', 19, 24))}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">$2a$</span><span class="lz-t">algorithm</span><span class="lz-d">The bcrypt version.</span></div>
<div class="lz-layer"><span class="lz-k">10$</span><span class="lz-t">cost</span><span class="lz-d">2<sup>10</sup> rounds. Stored inside, so you can raise it later and still check old hashes.</span></div>
<div class="lz-layer"><span class="lz-k">22 chars</span><span class="lz-t">salt</span><span class="lz-d">Random per hash — why hash #1 and #2 differ for the same password.</span></div>
<div class="lz-layer"><span class="lz-k">31 chars</span><span class="lz-t">hash</span><span class="lz-d"><code>compare</code> reads the cost and salt from the string, hashes the typed password the same way and compares.</span></div>
</div>
<p>One column (60 characters) stores everything. The capital C in the last line was enough to fail: hashes do not forgive "almost right".</p>

<h3>Step 7 — store and check, the way the chapter app does</h3>
<p>The app from Lesson 7.2 uses <strong>scrypt</strong>, a slow password hash built into Node, so it needs no install:</p>
${ma('javascript', CODE['_t7/app.mjs'], [5, 14])}
<ul>
<li><code>randomBytes(16)</code> — a new random salt at every sign-up or password change, stored as <code>salt:hash</code>.</li>
<li><code>timingSafeEqual</code> — compares in constant time, so the response time does not reveal how many leading bytes matched.</li>
<li>The login handler (Lesson 7.1) gives the same 401 message whether the email or the password was wrong.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — the password leaks somewhere else.</strong> Hashing correctly is wasted if the plain password ends up in request logs (<code>console.log(req.body)</code>), error trackers, analytics, a database column called <code>password_plain</code> "for support", or an email "Welcome! Your password is…". Treat the password field like cash: it arrives, it is hashed, it is forgotten. Search your code for every place <code>req.body</code> is logged.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — old rules that make passwords worse.</strong> Forcing "one capital, one digit, one symbol, change every 90 days" produces <code>Password1!</code>, <code>Password2!</code>… Current guidance (NIST SP 800-63B) is simpler: at least 8 characters (12+ better), allow long passphrases and every character, no forced periodic changes, and reject passwords that appear in breach lists. Note bcrypt only uses the first 72 bytes — a reason some apps prefer Argon2 or scrypt.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (35 minutes) — crack it, then fix it</strong></p>
<ol>
<li>In a new folder run <code>npm i bcryptjs</code>, copy the code from Steps 3–6 into <code>passwords.mjs</code> and run it. Note your machine's numbers.</li>
<li>Make a "leaked" table of 5 users with unsalted SHA-256 hashes of passwords you choose, at least 2 of them from the common list. Write a 10-line cracker that uses the lookup table. How many fall?</li>
<li>Re-hash the table with a random salt per user and run the cracker again.</li>
<li>Re-hash with <code>bcrypt.hash(pw, 10)</code> and time how long checking all 8 common passwords against one account takes.</li>
<li>Write <code>register(email, password)</code> and <code>login(email, password)</code> with bcrypt that return <code>201</code>/<code>409</code> and <code>200</code>/<code>401</code>.</li>
</ol>
<p>Hint: use the async <code>bcrypt.hash</code>/<code>bcrypt.compare</code> in a server — the sync versions block the event loop for ~75 ms (Lesson 5.1).</p>
<p><strong>Done when:</strong> your cracker breaks every common password in the unsalted table and none in the salted one; the bcrypt check of 8 guesses takes over half a second; and logging in with a wrong password, a wrong email or a wrong letter case all return the same 401. Then Code Lab module 7.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash</span><span class="v">hàm băm một chiều — không đảo ngược được.</span></div>
  <div class="kv"><span class="k">encryption</span><span class="v">mã hoá hai chiều — có khoá là giải được.</span></div>
  <div class="kv"><span class="k">salt</span><span class="v">muối — giá trị ngẫu nhiên riêng mỗi người dùng.</span></div>
  <div class="kv"><span class="k">lookup / rainbow table</span><span class="v">bảng tra tính sẵn từ hash ngược ra mật khẩu.</span></div>
  <div class="kv"><span class="k">work factor / cost</span><span class="v">hệ số công — làm hash chậm có chủ đích.</span></div>
  <div class="kv"><span class="k">bcrypt / scrypt / Argon2</span><span class="v">các hàm hash dành riêng cho mật khẩu.</span></div>
  <div class="kv"><span class="k">brute force / dictionary attack</span><span class="v">dò vét cạn / dò theo từ điển.</span></div>
  <div class="kv"><span class="k">constant-time compare</span><span class="v">so sánh thời gian cố định — không lộ qua thời gian phản hồi.</span></div>
  <div class="kv"><span class="k">credential stuffing</span><span class="v">dùng mật khẩu lộ ở trang này để vào trang khác.</span></div>
  <div class="kv"><span class="k">passphrase</span><span class="v">cụm mật khẩu — nhiều từ, dài, dễ nhớ.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Assume the database will leak; store only something that can check a password.</li>
  <li>Hash, never encrypt. To log in: hash the typed password the same way and compare.</li>
  <li>Unsalted hashes are cracked by lookup tables; a random salt per user defeats them.</li>
  <li>Use a deliberately slow hash: bcrypt, scrypt or Argon2 with a tuned cost (~1.9 M SHA-256/s vs ~13 bcrypt/s here).</li>
  <li>Compare in constant time, use the same error message, never log passwords.</li>
  <li>Modern rules: long passphrases allowed, no forced rotation, block breached passwords.</li>
</ul>
${nguon('📗', 'OWASP — Password Storage Cheat Sheet', 'Algorithms, work factors and salts recommended today', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html')}
${nguon('📘', 'NIST SP 800-63B — Memorized secrets', 'The modern password rules, from the source', 'https://pages.nist.gov/800-63-4/sp800-63b.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Node.js 8.1 — Passwords and hashing', sub: 'bcrypt in a real Express sign-up and login, with a database', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Đừng bao giờ lưu mật khẩu. Hãy lưu thứ chỉ dùng được để kiểm nó.</h2>
<p class="lead">Học xong bài này bạn giải thích được vì sao mật khẩu được hash chứ không bao giờ mã hoá, cho thấy một bảng hash SHA-256 thường bị lộ bị phá trong vài mili giây thế nào, giải thích muối thay đổi điều gì và không thay đổi điều gì, so một hash nhanh với một hash cho mật khẩu bằng số đo trên máy thật, đọc được một chuỗi bcrypt, và viết đúng cặp hàm lưu/kiểm. Mọi app có form đăng nhập đều cần điều này, và làm sai thì không lộ ra khi thử — nó lộ ra vào ngày cơ sở dữ liệu bị rò rỉ.</p>

<h3>Bước 1 — vì sao cột mật khẩu quan trọng</h3>
<p>Cơ sở dữ liệu bị lộ qua bản sao lưu bị trộm, SQL injection (Chương 8), kho lưu trữ đám mây cấu hình sai hay người bên trong. Người ta còn dùng lại mật khẩu: một vụ lộ ở một diễn đàn nhỏ cho kẻ tấn công mật khẩu email và mật khẩu ngân hàng của nhiều thành viên. Vì vậy câu hỏi không phải "có lộ không?" mà là "họ sẽ thấy gì?".</p>
<table>
<thead><tr><th>Lưu dưới dạng</th><th>Sau khi bị lộ</th></tr></thead>
<tbody>
<tr><td>Chữ thô</td><td>Mọi mật khẩu, ngay lập tức. Không bao giờ chấp nhận được.</td></tr>
<tr><td>Mã hoá (AES…)</td><td>Mọi mật khẩu, ngay khi tìm ra khoá — mà khoá nằm trên chính máy chủ đó.</td></tr>
<tr><td>Hash nhanh (MD5, SHA-1, SHA-256)</td><td>Mật khẩu phổ biến ngay lập tức (Bước 3), phần còn lại với tốc độ hàng tỉ lần đoán mỗi giây trên GPU.</td></tr>
<tr><td>Hash nhanh + muối</td><td>Không còn bảng tắt, nhưng vẫn hàng tỉ lần đoán mỗi giây cho mỗi tài khoản.</td></tr>
<tr><td>Hash chậm cho mật khẩu + muối (bcrypt, scrypt, Argon2)</td><td>Chỉ mật khẩu yếu bị phá, chậm, từng tài khoản một.</td></tr>
</tbody>
</table>

<h3>Bước 2 — hash không phải mã hoá</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mã hoá</span><span class="v">Hai chiều: <code>encrypt(chữ, khoá)</code> → <code>decrypt(…, khoá)</code> trả lại chữ. Đúng cho dữ liệu phải đọc lại (tin nhắn, tệp).</span></div>
  <div class="kv"><span class="k">Hash</span><span class="v">Một chiều: <code>hash(chữ)</code> → một dấu vân tay độ dài cố định. Không có "unhash". Cùng đầu vào luôn cho cùng đầu ra.</span></div>
  <div class="kv"><span class="k">Kiểm đăng nhập</span><span class="v">Hash thứ người dùng gõ với cùng muối và thiết lập, so với hash đã lưu. Không bao giờ cần lại mật khẩu gốc.</span></div>
</div>
<p>Đó cũng là lý do "quên mật khẩu" không bao giờ gửi được mật khẩu cũ qua email ở một trang làm đúng: trang đó không có nó. Nó gửi một liên kết để đặt mật khẩu mới.</p>

<h3>Bước 3 — hash thường gục trước bảng tra (đo thật)</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [9, 21])}
${ra(dong('_t7/out/mat-khau', 1, 7))}
<p>An và Bình chọn cùng mật khẩu, nên hash của họ giống hệt — riêng vụ lộ đã báo cho kẻ tấn công rằng hai tài khoản dùng chung mật khẩu. Kẻ tấn công hash một danh sách mật khẩu phổ biến <em>một lần</em> rồi tra mọi hash bị lộ: ba trên ba bị phá, hầu như không tốn công tính toán. Danh sách thật chứa hàng trăm triệu mật khẩu đã lộ, và bảng tính sẵn cho MD5, SHA-1 tải về được.</p>

<h3>Bước 4 — mỗi người một muối</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [23, 29])}
${ra(dong('_t7/out/mat-khau', 9, 11))}
<p><strong>Muối</strong> là ngẫu nhiên, riêng cho từng người, lưu công khai cạnh hash, và được trộn vào trước khi hash. Cùng <code>123456</code> giờ cho hai hash không liên quan, và không cái nào có trong bảng. Muối không phải bí mật: nó chỉ buộc kẻ tấn công phải đánh từng tài khoản riêng, từ đầu.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một muối cho cả trang, hoặc muối không ngẫu nhiên.</strong> Một "muối của trang" trong mã, tên đăng nhập hay id người dùng làm muối đều ít tác dụng hơn bạn tưởng: kẻ tấn công dựng một bảng riêng cho trang bạn, hoặc muối đoán được. Hãy dùng ít nhất 16 byte ngẫu nhiên cho mỗi người, sinh khi đăng ký và mỗi lần đổi mật khẩu. Thư viện tốt làm giúp bạn — đó là lý do chính để dùng chúng.</p></div>

<h3>Bước 5 — tốc độ: ở đây nhanh là xấu</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [31, 45])}
${ra(dong('_t7/out/mat-khau', 13, 17))}
<p>SHA-256 được <em>thiết kế</em> để nhanh — tuyệt cho kiểm tệp tải về, tệ cho mật khẩu. Tính thử cho một tài khoản có muối và một danh sách 10 000 mật khẩu hay gặp:</p>
<table>
<thead><tr><th>Hash</th><th>Tốc độ trên một nhân laptop này</th><th>10 000 lần đoán cho một tài khoản</th></tr></thead>
<tbody>
<tr><td>SHA-256 + muối</td><td>~1,9 triệu mỗi giây</td><td>khoảng 5 mili giây</td></tr>
<tr><td>bcrypt, cost 10</td><td>~13 mỗi giây</td><td>khoảng 12,5 phút</td></tr>
<tr><td>bcrypt, cost 12</td><td>~3,6 mỗi giây</td><td>khoảng 46 phút</td></tr>
</tbody>
</table>
<p>GPU còn làm SHA-256 nhanh hơn hàng nghìn lần nữa, trong khi bcrypt và scrypt được dựng để chống lại điều đó. <strong>Cost</strong> (hệ số công) tăng 1 là thời gian gấp đôi, nên bạn nâng nó khi máy tính nhanh lên. Chọn mức cao nhất mà việc đăng nhập chịu được: khoảng 100–300 ms mỗi hash trên máy chủ là mục tiêu phổ biến. (Các số này đo bằng <code>bcryptjs</code>, bản JavaScript thuần; gói <code>bcrypt</code> bản gốc nhanh hơn vài lần ở cùng cost.)</p>

<h3>Bước 6 — bên trong một hash bcrypt</h3>
${ma('javascript', CODE['_t7/mat-khau.mjs'], [47, 55])}
${ra(dong('_t7/out/mat-khau', 19, 24))}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">$2a$</span><span class="lz-t">thuật toán</span><span class="lz-d">Phiên bản bcrypt.</span></div>
<div class="lz-layer"><span class="lz-k">10$</span><span class="lz-t">cost</span><span class="lz-d">2<sup>10</sup> vòng. Lưu ngay bên trong, nên sau này nâng được mà vẫn kiểm được hash cũ.</span></div>
<div class="lz-layer"><span class="lz-k">22 ký tự</span><span class="lz-t">muối</span><span class="lz-d">Ngẫu nhiên mỗi lần hash — vì vậy hash #1 và #2 khác nhau với cùng mật khẩu.</span></div>
<div class="lz-layer"><span class="lz-k">31 ký tự</span><span class="lz-t">hash</span><span class="lz-d"><code>compare</code> đọc cost và muối từ chuỗi, hash mật khẩu vừa gõ cùng cách rồi so.</span></div>
</div>
<p>Một cột (60 ký tự) lưu mọi thứ. Chữ C hoa ở dòng cuối đủ để thất bại: hash không tha thứ cho "gần đúng".</p>

<h3>Bước 7 — lưu và kiểm, như app của chương làm</h3>
<p>App ở Bài 7.2 dùng <strong>scrypt</strong>, một hàm hash chậm cho mật khẩu có sẵn trong Node, nên không cần cài gì:</p>
${ma('javascript', CODE['_t7/app.mjs'], [5, 14])}
<ul>
<li><code>randomBytes(16)</code> — một muối ngẫu nhiên mới ở mỗi lần đăng ký hay đổi mật khẩu, lưu dạng <code>muối:hash</code>.</li>
<li><code>timingSafeEqual</code> — so trong thời gian cố định, nên thời gian phản hồi không để lộ bao nhiêu byte đầu đã khớp.</li>
<li>Hàm đăng nhập (Bài 7.1) trả cùng một câu 401 dù sai email hay sai mật khẩu.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — mật khẩu rò ra chỗ khác.</strong> Hash đúng cũng vô ích nếu mật khẩu thô lọt vào log request (<code>console.log(req.body)</code>), công cụ theo dõi lỗi, thống kê, một cột tên <code>password_plain</code> "để hỗ trợ", hay một email "Chào mừng! Mật khẩu của bạn là…". Hãy coi trường mật khẩu như tiền mặt: nó đến, được hash, rồi bị quên. Tìm trong mã mọi chỗ ghi log <code>req.body</code>.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — luật cũ làm mật khẩu tệ hơn.</strong> Ép "một chữ hoa, một số, một ký hiệu, đổi mỗi 90 ngày" sinh ra <code>Password1!</code>, <code>Password2!</code>… Hướng dẫn hiện nay (NIST SP 800-63B) đơn giản hơn: ít nhất 8 ký tự (12+ tốt hơn), cho phép cụm mật khẩu dài và mọi ký tự, không ép đổi định kỳ, và từ chối mật khẩu có trong danh sách bị lộ. Lưu ý bcrypt chỉ dùng 72 byte đầu — một lý do vài app chọn Argon2 hay scrypt.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (35 phút) — phá nó, rồi sửa nó</strong></p>
<ol>
<li>Trong một thư mục mới chạy <code>npm i bcryptjs</code>, chép mã ở Bước 3–6 vào <code>passwords.mjs</code> và chạy. Ghi lại số đo của máy bạn.</li>
<li>Làm một bảng "bị lộ" 5 người dùng với hash SHA-256 không muối của mật khẩu bạn chọn, ít nhất 2 cái nằm trong danh sách phổ biến. Viết một bộ phá 10 dòng dùng bảng tra. Bao nhiêu cái bị phá?</li>
<li>Hash lại bảng với muối ngẫu nhiên cho từng người rồi chạy lại bộ phá.</li>
<li>Hash lại bằng <code>bcrypt.hash(pw, 10)</code> và đo thời gian kiểm cả 8 mật khẩu phổ biến cho một tài khoản.</li>
<li>Viết <code>register(email, password)</code> và <code>login(email, password)</code> bằng bcrypt, trả <code>201</code>/<code>409</code> và <code>200</code>/<code>401</code>.</li>
</ol>
<p>Gợi ý: trong máy chủ hãy dùng bản async <code>bcrypt.hash</code>/<code>bcrypt.compare</code> — bản sync chặn event loop ~75 ms (Bài 5.1).</p>
<p><strong>Xong khi:</strong> bộ phá của bạn phá mọi mật khẩu phổ biến trong bảng không muối và không phá được cái nào trong bảng có muối; kiểm 8 lần đoán bằng bcrypt mất hơn nửa giây; và đăng nhập sai mật khẩu, sai email hay sai hoa thường đều trả cùng một 401. Sau đó làm module Code Lab 7.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash</span><span class="v">hàm băm một chiều — không đảo ngược được.</span></div>
  <div class="kv"><span class="k">encryption</span><span class="v">mã hoá hai chiều — có khoá là giải được.</span></div>
  <div class="kv"><span class="k">salt</span><span class="v">muối — giá trị ngẫu nhiên riêng mỗi người dùng.</span></div>
  <div class="kv"><span class="k">lookup / rainbow table</span><span class="v">bảng tra tính sẵn từ hash ngược ra mật khẩu.</span></div>
  <div class="kv"><span class="k">work factor / cost</span><span class="v">hệ số công — làm hash chậm có chủ đích.</span></div>
  <div class="kv"><span class="k">bcrypt / scrypt / Argon2</span><span class="v">các hàm hash dành riêng cho mật khẩu.</span></div>
  <div class="kv"><span class="k">brute force / dictionary attack</span><span class="v">dò vét cạn / dò theo từ điển.</span></div>
  <div class="kv"><span class="k">constant-time compare</span><span class="v">so sánh thời gian cố định — không lộ qua thời gian phản hồi.</span></div>
  <div class="kv"><span class="k">credential stuffing</span><span class="v">dùng mật khẩu lộ ở trang này để vào trang khác.</span></div>
  <div class="kv"><span class="k">passphrase</span><span class="v">cụm mật khẩu — nhiều từ, dài, dễ nhớ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Giả định cơ sở dữ liệu sẽ bị lộ; chỉ lưu thứ dùng được để kiểm mật khẩu.</li>
  <li>Hash, không bao giờ mã hoá. Đăng nhập: hash mật khẩu vừa gõ cùng cách rồi so.</li>
  <li>Hash không muối bị bảng tra phá; muối ngẫu nhiên riêng mỗi người đánh bại chúng.</li>
  <li>Dùng hash chậm có chủ đích: bcrypt, scrypt hoặc Argon2 với cost đã chỉnh (~1,9 triệu SHA-256/giây so với ~13 bcrypt/giây ở đây).</li>
  <li>So trong thời gian cố định, dùng cùng một câu báo lỗi, không bao giờ ghi log mật khẩu.</li>
  <li>Luật hiện đại: cho phép cụm mật khẩu dài, không ép đổi định kỳ, chặn mật khẩu đã bị lộ.</li>
</ul>
${nguon('📗', 'OWASP — Password Storage Cheat Sheet', 'Thuật toán, hệ số công và muối được khuyến nghị hiện nay', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html')}
${nguon('📘', 'NIST SP 800-63B — Memorized secrets', 'Luật mật khẩu hiện đại, từ nguồn gốc', 'https://pages.nist.gov/800-63-4/sp800-63b.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Node.js 8.1 — Mật khẩu và hàm băm', sub: 'bcrypt trong luồng đăng ký và đăng nhập Express thật, có cơ sở dữ liệu', cta: 'Mở bài' })}
</div>
`,
};
