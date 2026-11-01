/**
 * Authentication · Chương 2 · 2.5 — Chuyển khỏi hàm băm cũ, không bắt đặt lại mật khẩu. Slug giữ: auth-2-5-chuyen-doi.
 * Output thật (_ma.mjs, demo2/legacy.mjs, PostgreSQL 17.11, 10 luồng): 1.003 dòng MD5, danh sách 10k bẻ 701 dòng trong 4 ms; bọc cả
 * 1.003 dòng 17,1 s (≈ 59 dòng/s ⇒ 1 triệu dòng ≈ 4,7 giờ); An đăng nhập {ok:true, rehash:true} ⇒ 1 argon2id + 1.002 bọc; bcrypt-10 và
 * argon2id m=19 MiB đều {ok:true, rehash:true}. Sự cố: Ashley Madison 2015 (PCWorld 10/09/2015) — bcrypt 12 nhưng $loginkey MD5 còn lại.
 */
import G from '../giang/auth-02-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const H = CODE.hash.split('\n');
const VERIFY = H.slice(H.findIndex((l) => l.startsWith('/** ⇒ { ok, rehash }')), H.length).join('\n');
const NEEDS = H.slice(H.findIndex((l) => l.startsWith('/** True when the stored')), H.findIndex((l) => l.startsWith('const md5'))).join('\n').trim();
const LG = CODE.legacy.split('\n');
const STEP1 = LG.slice(LG.findIndex((l) => l.startsWith('// Step 1')), LG.findIndex((l) => l.startsWith('// Step 2'))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Password Storage Cheat Sheet: upgrading legacy hashes', '“Upgrade Method Two”: layer the old hash, e.g. md5($password) ⇒ bcrypt(md5($password)); replace with a direct hash at the next login (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'),
  nguon('📰', 'PCWorld — Ashley Madison coding blunder made over 11 million passwords easy to crack (10/09/2015)', 'bcrypt cost 12, but an MD5-based $loginkey for accounts from before June 2012 (lower-cased passwords); 11.2 million cracked in days (read 01/11/2026).', 'https://www.pcworld.com/article/423516/ashley-madison-coding-blunder-made-over-11-million-passwords-easy-to-crack.html'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Password Storage Cheat Sheet: nâng cấp băm cũ', '"Upgrade Method Two": bọc giá trị cũ, ví dụ md5($password) ⇒ bcrypt(md5($password)); thay bằng băm trực tiếp ở lần đăng nhập sau (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'),
  nguon('📰', 'PCWorld — Lỗi lập trình của Ashley Madison làm hơn 11 triệu mật khẩu dễ bẻ (10/09/2015)', 'bcrypt cost 12, nhưng còn $loginkey dựa trên MD5 cho tài khoản trước tháng 6/2012 (mật khẩu bị viết thường); 11,2 triệu mật khẩu bị bẻ trong vài ngày (đọc 01/11/2026).', 'https://www.pcworld.com/article/423516/ashley-madison-coding-blunder-made-over-11-million-passwords-easy-to-crack.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Stored today</th><th>How dangerous is a dump?</th><th>Move</th><th>When is it finished?</th></tr></thead>
<tbody>
<tr><td>argon2id with older parameters</td><td>low — still slow</td><td>rehash on the next successful login</td><td>never needs to be — old rows are fine</td></tr>
<tr><td>bcrypt (cost ≥ 10), scrypt, PBKDF2</td><td>low to medium</td><td>verify by prefix, rehash on login</td><td>when you want to drop the old library</td></tr>
<tr><td>MD5 / SHA-x without salt, or encrypted</td><td><strong>high</strong> — 701 of 1,003 in 4 ms</td><td><strong>wrap every row now</strong>, unwrap at login</td><td>when the old column, backups and exports are gone</td></tr>
<tr><td>plain text</td><td>total</td><td>hash every row now (you have the passwords) and force a reset if it ever leaked</td><td>same day</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Đang lưu</th><th>Một bản dump nguy hiểm cỡ nào?</th><th>Nước đi</th><th>Khi nào coi là xong?</th></tr></thead>
<tbody>
<tr><td>argon2id tham số cũ</td><td>thấp — vẫn chậm</td><td>băm lại ở lần đăng nhập thành công kế tiếp</td><td>không cần xong — dòng cũ vẫn ổn</td></tr>
<tr><td>bcrypt (cost ≥ 10), scrypt, PBKDF2</td><td>thấp tới vừa</td><td>kiểm theo tiền tố, băm lại khi đăng nhập</td><td>khi bạn muốn bỏ thư viện cũ</td></tr>
<tr><td>MD5 / SHA-x không muối, hoặc mã hoá</td><td><strong>cao</strong> — 701/1.003 trong 4 ms</td><td><strong>bọc mọi dòng ngay</strong>, gỡ bọc khi đăng nhập</td><td>khi cột cũ, bản sao lưu và bản xuất đã biến mất</td></tr>
<tr><td>chữ thường</td><td>toàn bộ</td><td>băm mọi dòng ngay (bạn có mật khẩu) và bắt đặt lại nếu từng bị lộ</td><td>trong ngày</td></tr>
</tbody>
</table>`;

export default {
  title: '2.5 — Moving off an old hash, without a reset|||2.5 — Chuyển khỏi hàm băm cũ, không bắt đặt lại mật khẩu',
  slug: 'auth-2-5-chuyen-doi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba tình huống — argon2id tham số cũ, một thuật toán tốt khác (bcrypt), và một sơ đồ đã HỎNG (MD5 không muối) — với một hàm verifyPassword đọc tiền tố. Kỹ thuật BỌC chạy thật trên 1.003 dòng PostgreSQL: argon2id(md5) cho mọi dòng trong 17,1 s mà không biết mật khẩu nào, xoá cột cũ trong cùng UPDATE, rồi gỡ bọc khi người dùng đăng nhập. Ashley Madison 2015: bcrypt 12 nhưng cột MD5 còn sót ⇒ hơn 11 triệu mật khẩu. Chạy ở quy mô triệu dòng (≈ 59 dòng/s) và cái đuôi dài.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Moving off an old hash, without a reset</h2>
<p class="lead">Few teams get to start with argon2id. LabFlow ran a booking system before LabFlow ID existed, built in 2019, and it kept <code>md5(password)</code> without salt for 1,003 accounts. Asking everyone to reset their password is the easy answer and a bad one: half of them will not, and the MD5 rows sit there meanwhile. This lesson moves every row to argon2id <strong>today</strong>, without knowing a single password, and finishes the job at each user's next sign-in.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>tell which of three situations a legacy table is in, and pick the move for it;</li>
<li>rehash on login safely — after a correct password, with today's parameters;</li>
<li>wrap a whole table of broken hashes in argon2id now and unwrap row by row later;</li>
<li>say when a migration is really finished (Ashley Madison's lesson);</li>
<li>estimate the time to migrate a million rows from your own measurement.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> your first job will likely inherit a users table older than you think. Migrations like this are where real breaches come from.</p>
</div>

<h3>An everyday picture first</h3>
<p>A building's locks can all be opened by any locksmith in seconds. Plan A: replace each lock when its tenant next drops by — some never come back, and their doors stay weak for years. Plan B: fit a strong outer door on every flat <em>today</em>, then swap the inner lock when each tenant arrives. Plan B is <strong>wrapping</strong>: <code>argon2id(md5(password))</code> for every row now; a plain <code>argon2id(password)</code> the moment the user signs in and you finally hold their password.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the prefix</span><span class="lz-d">Each stored string says what it is: <code>$argon2id$</code>, <code>$2b$</code>, or a bare MD5 hex.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Wrap the broken ones now</span><span class="lz-d">MD5 hex → argon2id with today's PARAMS, new prefix <code>$md5-argon2id$</code>, old column set to NULL in the same UPDATE.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Verify any shape</span><span class="lz-d"><code>verifyPassword</code> dispatches on the prefix and answers <code>{ ok, rehash }</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rehash at login</span><span class="lz-d">After a correct password, store <code>hashPassword(password)</code>: the row is now plain argon2id.</span></div>
</div>

<h3>Three situations</h3>
${BANG_EN}
<p>The first two are already slow, so they can wait for each user's next login — the stored string tells <code>needsRehash</code> what to do:</p>
${ma('javascript', NEEDS)}
<p>The third cannot wait: lesson 2.1 cracked 701 of 1,003 unsalted rows in 15 ms, and below the same list cracks the MD5 table in 4 ms.</p>

<h3>Wrap 1,003 MD5 rows, for real</h3>
<p><code>demo2/legacy.mjs</code> builds the old table in PostgreSQL (<code>pass_md5</code> = MD5 hex of each password from lesson 2.1's population), then runs the migration. Step 1 is the important part — wrap every row <em>and</em> drop the old value in the same UPDATE:</p>
${ma('javascript', STEP1)}
${ra(OUT['25-legacy'])}
<ul>
<li><strong>before:</strong> 1,003 MD5 rows; the 10k list cracks 701 of them in 4 ms.</li>
<li><strong>wrapped:</strong> all 1,003 rows in 17.1 s on 10 threads; <code>md5_left = 0</code>. Nobody's password was needed — an MD5 hex digest is just a 32-character string to hash.</li>
<li><strong>An signs in:</strong> the wrapped row verifies (<code>ok: true</code>) and asks for an upgrade (<code>rehash: true</code>); afterwards 1 row is plain argon2id and 1,002 are wrapped.</li>
<li><strong>the other two shapes:</strong> a bcrypt cost-10 row and an argon2id row with m=19 MiB both verify and both ask for a rehash.</li>
</ul>
<p>The function that makes this possible reads the prefix and handles each shape:</p>
${ma('javascript', VERIFY)}
<p>The wrapped row uses the same <code>PARAMS</code> as every other row, so it costs the same ~86 ms to verify — no timing difference between “migrated” and “not yet signed in” (lesson 2.3). And <code>rehash</code> is <code>ok &amp;&amp; needsRehash(stored)</code>: a wrong password never rewrites a row.</p>

<h3>A real migration that was not finished: Ashley Madison, 2015</h3>
<p>Ashley Madison stored passwords with bcrypt at cost 12 — 4,096 rounds, a good choice for the time. But for accounts created or changed before June 2012, the code had also stored a <code>$loginkey</code>: an MD5 built from the username and the <em>lower-cased</em> password. When the database leaked, the CynoSure Prime group ignored the bcrypt column, cracked the MD5 keys, and recovered over 11 million passwords in a few days (PCWorld, 10/09/2015). The upgrade had happened; the old value had not been removed.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — “upgrade on login” for a broken hash.</strong> Upgrading only when users sign in leaves every inactive user's MD5 row in place for years, crackable at 164 billion guesses per second on one GPU (hashcat benchmark, lesson 2.1). Those rows also answer in microseconds instead of ~86 ms, which tells an outsider who has not signed in since the migration. Lazy rehash is right for situations 1 and 2; for broken hashes, <strong>wrap first</strong>, then let logins finish the job.</p>
</div>

<h3>At scale: batches, a background job, and the long tail</h3>
<ul>
<li><strong>Time.</strong> 1,003 rows in 17.1 s ≈ <strong>59 rows/s</strong> on 10 threads. A million rows would take about 4.7 hours — a background job, not a migration file inside a deploy.</li>
<li><strong>Restartable.</strong> Work in batches of ~1,000 with <code>WHERE pass_md5 IS NOT NULL</code>; a crash just resumes. Sign-in keeps working the whole time because it understands both shapes.</li>
<li><strong>Keep the server responsive.</strong> Run it in a separate process with its own thread pool (lesson 2.2's memory maths applies), or at night.</li>
<li><strong>The long tail.</strong> After the wrap nothing is urgent. Months later, <code>password_hash LIKE '$md5-argon2id$%'</code> counts users who never came back; keep them wrapped, or send a reset link on their next visit (Chapter 6).</li>
<li><strong>Destroy the old copies.</strong> Old backups, CSV exports and staging databases that still hold <code>pass_md5</code> are the Ashley Madison column under another name.</li>
</ul>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“We have MD5 passwords from an old system. Reset everyone?”</strong> — No: wrap every row in argon2id now (no password needed), drop the MD5 column in the same update, and replace each wrapped hash with a direct argon2id hash at that user's next login.</li>
<li><strong>“How do you raise bcrypt cost / argon2 parameters later?”</strong> — The stored string carries its parameters; on a successful login, if <code>needsRehash</code>, store a new hash with today's parameters.</li>
<li><strong>“When is the migration done?”</strong> — When no copy of the old value exists anywhere: column, backups, exports, logs.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>UV_THREADPOOL_SIZE=10 node demo2/legacy.mjs</code>, then sign in Cô Lan's row three times with <code>verifyPassword</code>: right, wrong, right. Which calls change the table?</li>
<li>Add support for <code>sha1(password)</code> rows: prefix <code>$sha1-argon2id$</code>, a <code>wrapLegacySha1</code>, and one branch in <code>verifyPassword</code>. Test it on <code>an-lab-2026</code>.</li>
<li>From your own <code>wrapped … in N s</code> line, estimate the time for 250,000 rows on your machine.</li>
</ol>
<p><strong>Solution</strong> (our machine, we ran it): only the first correct sign-in rewrites the row (wrapped → argon2id); the wrong one returns <code>{ ok: false, rehash: false }</code> and touches nothing; the second correct one finds a current hash, <code>rehash: false</code>. For 2, add a branch on <code>stored.startsWith('$sha1-argon2id$')</code> that verifies <code>createHash('sha1')</code> hex — <code>needsRehash()</code> already says true for anything that is not today's argon2id, so the upgrade comes for free. For 3: 250,000 ÷ 59 rows/s ≈ 71 minutes here.</p>
<p><strong>Done when:</strong> your legacy table has <code>md5_left = 0</code>, a sign-in turns a wrapped row into plain argon2id, and you can explain why Ashley Madison's bcrypt did not save them.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rehash on login</span><span class="v">After a correct password, replace an outdated stored hash with one made today.</span></div>
  <div class="kv"><span class="k">wrapping (layering)</span><span class="v">Hashing the old hash value with a slow hash so the table is protected before anyone signs in.</span></div>
  <div class="kv"><span class="k">prefix dispatch</span><span class="v">Choosing the verify routine from the stored string's prefix (<code>$argon2id$</code>, <code>$2b$</code>, <code>$md5-argon2id$</code>).</span></div>
  <div class="kv"><span class="k">long tail</span><span class="v">Accounts that never sign in again after a migration; they stay wrapped or get a reset.</span></div>
  <div class="kv"><span class="k">leftover value</span><span class="v">The old hash surviving in a column, backup or export — what broke Ashley Madison.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Three situations: old parameters and bcrypt can wait for login; unsalted fast hashes cannot.</li>
<li>Wrap every broken row now: 1,003 rows in 17.1 s here, no password needed, old column NULL in the same UPDATE.</li>
<li><code>verifyPassword</code> dispatches on the prefix and returns <code>{ ok, rehash }</code>; rehash only after a correct password.</li>
<li>Ashley Madison: bcrypt 12, but a leftover MD5 key ⇒ 11 million passwords.</li>
<li>At scale ≈ 59 rows/s on 10 threads: restartable background batches; destroy old copies.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Applied in Node.js — lesson 8.1: upgrading cost without asking anyone to change their password', sub: 'Same: parameters live in the stored string, so you rehash at login; the same trick moves bcrypt to argon2. That lesson waits for logins and expires the long tail; this one wraps broken MD5 rows first (1,003 rows, 17.1 s) and shows why lazy-only failed Ashley Madison.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Chuyển khỏi hàm băm cũ, không bắt đặt lại mật khẩu</h2>
<p class="lead">Ít đội được bắt đầu với argon2id. Trước khi có LabFlow ID, LabFlow chạy một hệ thống đặt phòng dựng năm 2019, và nó giữ <code>md5(password)</code> không muối cho 1.003 tài khoản. Bắt mọi người đặt lại mật khẩu là câu trả lời dễ và tệ: một nửa sẽ không làm, và trong lúc chờ các dòng MD5 vẫn nằm đó. Bài này chuyển mọi dòng sang argon2id <strong>ngay hôm nay</strong>, không cần biết một mật khẩu nào, và hoàn tất ở lần đăng nhập kế tiếp của từng người.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nhận ra một bảng cũ thuộc tình huống nào trong ba tình huống, và chọn nước đi cho nó;</li>
<li>băm lại khi đăng nhập một cách an toàn — sau mật khẩu đúng, bằng tham số hiện hành;</li>
<li>bọc cả một bảng băm đã hỏng trong argon2id ngay bây giờ và gỡ bọc dần từng dòng;</li>
<li>nói được khi nào một lần chuyển đổi thật sự xong (bài học Ashley Madison);</li>
<li>ước lượng thời gian chuyển một triệu dòng từ phép đo của chính bạn.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> công việc đầu tiên của bạn nhiều khả năng thừa kế một bảng users già hơn bạn tưởng. Những lần chuyển đổi như thế này là nơi các vụ rò rỉ thật bắt nguồn.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Mọi ổ khoá trong một toà nhà đều bị thợ khoá nào cũng mở được trong vài giây. Phương án A: thay từng ổ khi người thuê ghé qua — có người không bao giờ quay lại, cửa của họ yếu suốt nhiều năm. Phương án B: lắp một cửa ngoài chắc chắn cho mọi căn <em>ngay hôm nay</em>, rồi thay ổ trong khi từng người thuê tới. Phương án B là <strong>bọc (wrapping)</strong>: <code>argon2id(md5(password))</code> cho mọi dòng ngay; <code>argon2id(password)</code> thường vào lúc người dùng đăng nhập và cuối cùng bạn cầm được mật khẩu của họ.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc tiền tố</span><span class="lz-d">Mỗi chuỗi lưu tự nói nó là gì: <code>$argon2id$</code>, <code>$2b$</code>, hay một chuỗi MD5 hex trần.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bọc ngay dòng hỏng</span><span class="lz-d">MD5 hex → argon2id với PARAMS hiện hành, tiền tố mới <code>$md5-argon2id$</code>, cột cũ đặt NULL trong cùng câu UPDATE.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm mọi dạng</span><span class="lz-d"><code>verifyPassword</code> chọn đường theo tiền tố và trả <code>{ ok, rehash }</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Băm lại khi đăng nhập</span><span class="lz-d">Sau mật khẩu đúng, lưu <code>hashPassword(password)</code>: dòng giờ là argon2id thường.</span></div>
</div>

<h3>Ba tình huống</h3>
${BANG_VI}
<p>Hai tình huống đầu vốn đã chậm, nên chờ được tới lần đăng nhập sau của từng người — chuỗi lưu cho <code>needsRehash</code> biết phải làm gì:</p>
${ma('javascript', NEEDS)}
<p>Tình huống thứ ba không chờ được: bài 2.1 bẻ 701 trên 1.003 dòng không muối trong 15 ms, và ở dưới cùng danh sách đó bẻ bảng MD5 trong 4 ms.</p>

<h3>Bọc 1.003 dòng MD5, chạy thật</h3>
<p><code>demo2/legacy.mjs</code> dựng bảng cũ trong PostgreSQL (<code>pass_md5</code> = MD5 hex của từng mật khẩu trong tập người dùng của bài 2.1), rồi chạy chuyển đổi. Bước 1 là phần quan trọng — bọc mọi dòng <em>và</em> xoá giá trị cũ trong cùng một câu UPDATE:</p>
${ma('javascript', STEP1)}
${ra(OUT['25-legacy'])}
<ul>
<li><strong>trước:</strong> 1.003 dòng MD5; danh sách 10k bẻ 701 dòng trong 4 ms.</li>
<li><strong>bọc:</strong> cả 1.003 dòng trong 17,1 s trên 10 luồng; <code>md5_left = 0</code>. Không cần mật khẩu của ai — một chuỗi MD5 hex chỉ là một chuỗi 32 ký tự để băm.</li>
<li><strong>An đăng nhập:</strong> dòng đã bọc kiểm khớp (<code>ok: true</code>) và đòi nâng cấp (<code>rehash: true</code>); sau đó 1 dòng là argon2id thường và 1.002 dòng còn bọc.</li>
<li><strong>hai dạng còn lại:</strong> một dòng bcrypt cost 10 và một dòng argon2id m=19 MiB đều kiểm khớp và đều đòi băm lại.</li>
</ul>
<p>Hàm làm được việc này đọc tiền tố và xử lý từng dạng:</p>
${ma('javascript', VERIFY)}
<p>Dòng bọc dùng cùng <code>PARAMS</code> với mọi dòng khác, nên kiểm cũng tốn ~86 ms — không có chênh lệch thời gian giữa "đã chuyển" và "chưa đăng nhập lại" (bài 2.3). Và <code>rehash</code> là <code>ok &amp;&amp; needsRehash(stored)</code>: mật khẩu sai không bao giờ ghi đè một dòng.</p>

<h3>Một lần chuyển đổi chưa xong thật: Ashley Madison, 2015</h3>
<p>Ashley Madison lưu mật khẩu bằng bcrypt cost 12 — 4.096 vòng, một lựa chọn tốt thời đó. Nhưng với tài khoản tạo hoặc sửa trước tháng 6/2012, mã nguồn còn lưu một <code>$loginkey</code>: một giá trị MD5 dựng từ tên đăng nhập và mật khẩu <em>đã bị viết thường</em>. Khi cơ sở dữ liệu bị lộ, nhóm CynoSure Prime bỏ qua cột bcrypt, bẻ các khoá MD5, và khôi phục hơn 11 triệu mật khẩu trong vài ngày (PCWorld, 10/09/2015). Việc nâng cấp đã diễn ra; giá trị cũ thì chưa bị xoá.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "nâng cấp khi đăng nhập" cho một hàm băm đã hỏng.</strong> Chỉ nâng cấp khi người dùng đăng nhập thì dòng MD5 của mọi người dùng không hoạt động nằm đó nhiều năm, bị bẻ với tốc độ 164 tỉ lần đoán mỗi giây trên một GPU (benchmark hashcat, bài 2.1). Những dòng đó còn trả lời trong vài micro giây thay vì ~86 ms, khai cho người ngoài biết ai chưa đăng nhập từ hồi chuyển đổi. Băm lại kiểu lười đúng cho tình huống 1 và 2; với hàm băm hỏng, <strong>bọc trước</strong>, rồi để các lượt đăng nhập làm nốt.</p>
</div>

<h3>Ở quy mô lớn: theo lô, chạy nền, và cái đuôi dài</h3>
<ul>
<li><strong>Thời gian.</strong> 1.003 dòng trong 17,1 s ≈ <strong>59 dòng/s</strong> trên 10 luồng. Một triệu dòng sẽ mất khoảng 4,7 giờ — một tác vụ nền, không phải một tệp migration chạy trong lúc deploy.</li>
<li><strong>Chạy lại được.</strong> Làm theo lô ~1.000 dòng với <code>WHERE pass_md5 IS NOT NULL</code>; sập giữa chừng thì chỉ việc chạy tiếp. Đăng nhập vẫn hoạt động suốt quá trình vì nó hiểu cả hai dạng.</li>
<li><strong>Giữ máy chủ phản hồi nhanh.</strong> Chạy trong một tiến trình riêng có thread pool riêng (phép tính bộ nhớ của bài 2.2 vẫn áp dụng), hoặc chạy ban đêm.</li>
<li><strong>Cái đuôi dài.</strong> Bọc xong thì chẳng còn gì gấp. Vài tháng sau, <code>password_hash LIKE '$md5-argon2id$%'</code> đếm những người không quay lại; cứ để họ ở dạng bọc, hoặc gửi link đặt lại ở lần ghé sau (Chương 6).</li>
<li><strong>Huỷ các bản chép cũ.</strong> Bản sao lưu cũ, tệp CSV xuất ra và cơ sở dữ liệu staging còn giữ <code>pass_md5</code> chính là cột của Ashley Madison dưới một cái tên khác.</li>
</ul>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bọn em có mật khẩu MD5 từ hệ cũ. Bắt mọi người đặt lại nhé?"</strong> — Không: bọc mọi dòng trong argon2id ngay (không cần mật khẩu), xoá cột MD5 trong cùng câu cập nhật, rồi thay từng giá trị bọc bằng argon2id trực tiếp ở lần đăng nhập kế tiếp của người đó.</li>
<li><strong>"Sau này nâng cost bcrypt / tham số argon2 thế nào?"</strong> — Chuỗi lưu mang theo tham số của nó; khi đăng nhập thành công, nếu <code>needsRehash</code> thì lưu giá trị mới bằng tham số hiện hành.</li>
<li><strong>"Khi nào coi là chuyển đổi xong?"</strong> — Khi không còn bản chép nào của giá trị cũ ở bất cứ đâu: cột, bản sao lưu, tệp xuất, log.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>UV_THREADPOOL_SIZE=10 node demo2/legacy.mjs</code>, rồi đăng nhập dòng của Cô Lan ba lần bằng <code>verifyPassword</code>: đúng, sai, đúng. Lần gọi nào làm bảng thay đổi?</li>
<li>Thêm hỗ trợ cho dòng <code>sha1(password)</code>: tiền tố <code>$sha1-argon2id$</code>, một hàm <code>wrapLegacySha1</code>, và một nhánh trong <code>verifyPassword</code>. Thử với <code>an-lab-2026</code>.</li>
<li>Từ dòng <code>wrapped … in N s</code> của chính bạn, ước lượng thời gian cho 250.000 dòng trên máy bạn.</li>
</ol>
<p><strong>Lời giải</strong> (máy của mình, đã chạy): chỉ lần đăng nhập đúng đầu tiên ghi lại dòng (bọc → argon2id); lần sai trả <code>{ ok: false, rehash: false }</code> và không đụng gì; lần đúng thứ hai gặp giá trị hiện hành, <code>rehash: false</code>. Câu 2: thêm một nhánh với <code>stored.startsWith('$sha1-argon2id$')</code> kiểm chuỗi hex của <code>createHash('sha1')</code> — <code>needsRehash()</code> vốn đã trả true cho mọi thứ không phải argon2id hiện hành, nên việc nâng cấp tự đến. Câu 3: 250.000 ÷ 59 dòng/s ≈ 71 phút ở đây.</p>
<p><strong>Đạt khi:</strong> bảng cũ của bạn có <code>md5_left = 0</code>, một lượt đăng nhập biến dòng bọc thành argon2id thường, và bạn giải thích được vì sao bcrypt của Ashley Madison không cứu được họ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rehash on login (băm lại khi đăng nhập)</span><span class="v">Sau mật khẩu đúng, thay giá trị băm đã cũ bằng giá trị làm hôm nay.</span></div>
  <div class="kv"><span class="k">wrapping / layering (bọc)</span><span class="v">Băm chính giá trị băm cũ bằng một hàm băm chậm để bảng được bảo vệ trước khi ai đăng nhập.</span></div>
  <div class="kv"><span class="k">prefix dispatch (chọn đường theo tiền tố)</span><span class="v">Chọn cách kiểm từ tiền tố của chuỗi lưu (<code>$argon2id$</code>, <code>$2b$</code>, <code>$md5-argon2id$</code>).</span></div>
  <div class="kv"><span class="k">long tail (cái đuôi dài)</span><span class="v">Những tài khoản không bao giờ đăng nhập lại sau khi chuyển đổi; giữ dạng bọc hoặc nhận link đặt lại.</span></div>
  <div class="kv"><span class="k">leftover value (giá trị sót lại)</span><span class="v">Giá trị băm cũ còn sống trong một cột, bản sao lưu hay tệp xuất — thứ đã đánh gục Ashley Madison.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba tình huống: tham số cũ và bcrypt chờ được tới lúc đăng nhập; băm nhanh không muối thì không.</li>
<li>Bọc ngay mọi dòng hỏng: 1.003 dòng trong 17,1 s ở đây, không cần mật khẩu, cột cũ NULL trong cùng câu UPDATE.</li>
<li><code>verifyPassword</code> chọn đường theo tiền tố và trả <code>{ ok, rehash }</code>; chỉ băm lại sau mật khẩu đúng.</li>
<li>Ashley Madison: bcrypt 12, nhưng một khoá MD5 sót lại ⇒ 11 triệu mật khẩu.</li>
<li>Quy mô lớn ≈ 59 dòng/s trên 10 luồng: chạy nền theo lô, chạy lại được; huỷ các bản chép cũ.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Áp vào Node.js — bài 8.1: nâng chi phí mà không phải bảo ai đổi mật khẩu', sub: 'Giống: tham số nằm trong chuỗi lưu, nên băm lại lúc đăng nhập; cùng mẹo đó chuyển bcrypt sang argon2. Bài đó chờ các lượt đăng nhập và cho cái đuôi dài hết hạn; bài này bọc dòng MD5 hỏng trước (1.003 dòng, 17,1 s) và cho thấy vì sao chỉ-lười đã làm hỏng Ashley Madison.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
