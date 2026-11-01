/**
 * Authentication · Chương 2 · 2.1 — Kẻ tấn công ĐÃ CÓ cơ sở dữ liệu của bạn. Slug giữ: auth-2-1-da-co-csdl.
 * Bài đầu chương (có khối "Học xong Chương 2"). Mọi code/output lấy từ ./_ma.mjs (LabFlow ID v0.2 + PostgreSQL 17.11 chạy thật
 * trong env -i, Node 22.23.3, Apple M1 Max). Số đo: SHA-256 không muối 10.001 băm 15 ms bẻ 701/1.003; có muối 4.960.404 băm
 * 2.425 ms vẫn 701; argon2id 51,2 lần đoán/giây (10 luồng) ⇒ ≈ 54 giờ, Bình rơi sau 2 lần đoán; bảng thời gian (RTX 4090 từ hashcat).
 */
import G from '../giang/auth-02-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const CUT = (t) => t.replace(/(\$argon2id\$v=19\$m=65536,p=1,t=2\$[A-Za-z0-9+/]{6})[A-Za-z0-9+/$]+/g, '$1…');
const V02 = CUT(OUT['21-migrate'] + '\n' + OUT['21-v02-dump']);
const CR = CODE.crack.split('\n');
const CR_SALT = CR.slice(CR.findIndex((l) => l.startsWith('// 3.')), CR.findIndex((l) => l.startsWith('// 4.'))).join('\n').trim();
const HASH_TOP = CODE.hash.split('\n').slice(0, 12).join('\n');

const NGUON_EN = [
  nguon('🦉', 'OWASP — Password Storage Cheat Sheet', 'Salt is unique per password and stored with it; argon2id minimum m=19 MiB t=2 p=1; a pepper is defence in depth (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'),
  nguon('⚡', 'hashcat 6.2.6 benchmark — one RTX 4090 (Chick3nman)', 'SHA2-256 21,975.5 MH/s, MD5 164.1 GH/s, bcrypt 184.0 kH/s at 32 iterations (read 01/11/2026).', 'https://gist.github.com/Chick3nman/32e662a5bb63bc4f51b847bb422222fd'),
  nguon('🧾', 'Troy Hunt — Adobe credentials and the serious insecurity of password hints (12/11/2013)', '153 million records; passwords encrypted, not hashed — the same password gave the same ciphertext; hints in plain text (read 01/11/2026).', 'https://www.troyhunt.com/adobe-credentials-and-serious/'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Password Storage Cheat Sheet', 'Muối riêng cho từng mật khẩu và lưu cạnh nó; argon2id tối thiểu m=19 MiB t=2 p=1; pepper là lớp phòng thêm (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'),
  nguon('⚡', 'Benchmark hashcat 6.2.6 — một card RTX 4090 (Chick3nman)', 'SHA2-256 21.975,5 MH/s, MD5 164,1 GH/s, bcrypt 184,0 kH/s ở 32 vòng (đọc 01/11/2026).', 'https://gist.github.com/Chick3nman/32e662a5bb63bc4f51b847bb422222fd'),
  nguon('🧾', 'Troy Hunt — Adobe và sự nguy hiểm của gợi ý mật khẩu (12/11/2013)', '153 triệu bản ghi; mật khẩu được MÃ HOÁ chứ không băm — cùng mật khẩu ra cùng bản mã; gợi ý để chữ thường (đọc 01/11/2026).', 'https://www.troyhunt.com/adobe-credentials-and-serious/'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Stored as…</th><th>What the stolen table gives (measured, 1,003 accounts)</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>plain text</td><td>every password, no work</td><td>never</td></tr>
<tr><td>encrypted (AES, 3DES…)</td><td>everything, as soon as the key leaks too; equal passwords look equal (Adobe 2013)</td><td>never — passwords are hashed, not encrypted</td></tr>
<tr><td>MD5 / SHA-1 / SHA-256, no salt</td><td>701 cracked after 10,001 hashes (15 ms); repeated hashes show who shares a password</td><td>never</td></tr>
<tr><td>SHA-256 + salt</td><td>the same 701, after 4.96 million hashes (2.4 s on one core; a GPU does 22 billion/s)</td><td>never for passwords — right for random tokens (lesson 1.3)</td></tr>
<tr><td>argon2id, measured parameters</td><td>~51 guesses/s on 10 threads ⇒ the list against everyone ≈ 54 h; weak passwords still fall</td><td>yes — plus a blocklist (2.4)</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Lưu dạng…</th><th>Bảng bị trộm cho kẻ tấn công gì (đo thật, 1.003 tài khoản)</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>chữ thường</td><td>mọi mật khẩu, chẳng tốn công</td><td>không bao giờ</td></tr>
<tr><td>mã hoá (AES, 3DES…)</td><td>tất cả, ngay khi khoá cũng lộ; mật khẩu giống nhau thì bản mã giống nhau (Adobe 2013)</td><td>không bao giờ — mật khẩu phải băm, không mã hoá</td></tr>
<tr><td>MD5 / SHA-1 / SHA-256, không muối</td><td>701 bị bẻ sau 10.001 lần băm (15 ms); băm trùng nhau lộ ai dùng chung mật khẩu</td><td>không bao giờ</td></tr>
<tr><td>SHA-256 + muối</td><td>vẫn 701 đó, sau 4,96 triệu lần băm (2,4 s trên một nhân; GPU làm 22 tỉ/giây)</td><td>không cho mật khẩu — đúng cho token ngẫu nhiên (bài 1.3)</td></tr>
<tr><td>argon2id, tham số chọn theo đo</td><td>~51 lần đoán/giây trên 10 luồng ⇒ cả danh sách cho mọi người ≈ 54 giờ; mật khẩu yếu vẫn rơi</td><td>có — cộng danh sách chặn (2.4)</td></tr>
</tbody>
</table>`;

export default {
  title: '2.1 — The attacker already has your database|||2.1 — Kẻ tấn công ĐÃ CÓ cơ sở dữ liệu của bạn',
  slug: 'auth-2-1-da-co-csdl',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Giả định duy nhất đáng thiết kế quanh nó: bảng users đã bị chép. LabFlow ID chuyển sang PostgreSQL 17; cùng 1.003 tài khoản, cùng danh sách 10.001 mật khẩu, bốn cách lưu bị bẻ cạnh nhau (đo thật: SHA-256 không muối 15 ms bẻ 701; có muối 2,4 s vẫn 701; argon2id ~51 lần đoán/giây ⇒ ≈ 54 giờ nhưng 123456 rơi sau 2 lần); muối giải quyết gì và không giải quyết gì; bảng thời gian vét cạn (CPU đo trên máy, GPU RTX 4090 từ hashcat); v0.2 lưu chuỗi argon2id tự mô tả.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The attacker already has your database</h2>
<p class="lead">Lessons 0.3 and 1.3 left one hole wide open: LabFlow ID still keeps An's password exactly as she typed it. This lesson starts Chapter 2 from the assumption every serious team designs for — <strong>someone already has a copy of the users table</strong> — and measures, on the same 1,003 accounts and the same list of 10,001 common passwords, how much work each way of storing passwords leaves to the attacker.</p>

<div class="callout ok">
<p><strong>After Chapter 2 you can:</strong> store passwords with argon2id at parameters you measured; build a sign-in whose answers and timings do not reveal who has an account; apply NIST SP 800-63B-4's password rules (length, blocklist, breach check — no composition rules); and move a table of old MD5/bcrypt hashes to argon2id without asking anyone to reset. Lab 2 grades your password module with a script that dumps, cracks and times it.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>state the threat model of password storage in one sentence, and say why it is not “stop the leak”;</li>
<li>crack plain, unsalted and salted SHA-256 tables yourself and explain the numbers;</li>
<li>say exactly what a salt does — and what it does not do;</li>
<li>read a time-to-crack table and see why no hash rescues <code>123456</code>;</li>
<li>run LabFlow ID v0.2 on PostgreSQL 17 with argon2id strings in the users table.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> every project you ship (SWP391, SEP490, the first job) has a users table, and “how do you store passwords?” is the most asked authentication question in backend interviews. After this lesson you answer it with numbers you measured.</p>
</div>

<h3>An everyday picture first</h3>
<p>A hotel keeps a spare key for every room in a cabinet behind the desk. A thief does not have to carry the cabinet out — one photo of the keys is enough to cut copies at home, slowly, with nobody watching. A leaked users table is that photo: one SQL injection, one backup left in a public bucket, one ex-employee's laptop. You are rarely told when it happens. So the useful question is not “how do I stop the leak?” (Chapters 9–11) but: <strong>once they have the copy, how long until it turns into passwords?</strong> And because people reuse passwords, a password cracked from LabFlow ID opens their Gmail and their bank — damage that lands far outside your service.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The copy leaves</span><span class="lz-d">SQL injection, a backup, a laptop. Every row, including the password column, is now offline — no rate limit, no lock-out, no log.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Guess, hash, compare</span><span class="lz-d">The attacker takes likely passwords (a list of 10,001), stores each the same way you did, and looks for equal rows.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Your only lever</span><span class="lz-d">How much each guess costs. That is the whole design space of this lesson.</span></div>
</div>

<h3>Step 1 — LabFlow ID moves to PostgreSQL, “as it was”</h3>
<p>From this chapter LabFlow ID keeps users in PostgreSQL 17 (a container on port 4832; setup in Lab 2). The hurried migration copies v0.1's users into a table unchanged. To make the numbers meaningful we add 1,000 made-up accounts whose passwords follow a rough real-world shape (30% from the top 100, 40% from the rest of the top 10,000, 30% random 12-character strings — <code>demo2/population.mjs</code>). Then the attacker's view: one SELECT.</p>
${ra(OUT['21-naive'])}
<p>No cracking at all. Adobe (2013) is the same failure in a different costume: it <em>encrypted</em> 153 million passwords instead of hashing them, so the same password always produced the same ciphertext, and the plain-text password hints next to it did the rest. Encryption is reversible by design; a password never needs to be read back, only checked.</p>

<h3>Step 2 — four storages, one attacker, one list</h3>
<p>Same 1,003 people, same list (SecLists' 10,001 most common passwords). Only the storage changes. The salted version is the part worth reading:</p>
${ma('javascript', CR_SALT)}
${ra(OUT['21-crack'])}
<ul>
<li><strong>SHA-256, no salt:</strong> the attacker hashes the list <em>once</em> (15 ms) and every account becomes a dictionary lookup — 701 of 1,003 fall. Worse, 271 rows repeat another row's hash: without cracking anything, the table already tells who shares a password with whom.</li>
<li><strong>SHA-256 + a 16-byte salt per account:</strong> the stored value is <code>sha256(salt + password)</code>, so the list must be hashed again for <em>every</em> account — 4,960,404 hashes instead of 10,001 (the loop stops at the first hit). Still 2.4 s on one core, and still the same 701.</li>
<li><strong>argon2id</strong> (LabFlow ID's parameters, chosen in 2.2): about 51 guesses per second on 10 threads — trying the whole list against all 1,003 accounts takes ≈ 54 hours instead of 2.4 seconds. And yet Bình's <code>123456</code> is the <strong>second</strong> word of the list: found after 2 guesses, 166 ms.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Trap — “salted, so it is safe”.</strong> Salt removes two shortcuts: precomputed tables (rainbow tables) and doing the work once for everyone. It does <em>nothing</em> to the cost of one guess. Salted SHA-256 still runs at about 2 million guesses per second on one CPU core and 22 billion on one GPU. A salted fast hash of a weak password is a weak password with an extra step.</p>
</div>

<h3>Step 3 — how long to try a whole space?</h3>
<p>One salted account; how long to try <em>every</em> password of a given shape? The CPU rates below were measured on this machine (Apple M1 Max, 10 threads); the GPU rates are a public hashcat 6.2.6 benchmark on one RTX 4090. bcrypt there runs at 32 iterations (cost 5), so cost 12 (4,096 iterations) is 2<sup>7</sup> = 128 times slower: 184,000 / 128 ≈ 1,438 per second.</p>
${ra(OUT['21-table'])}
<p>Read it by row. A fast hash on one gaming card empties every 8-letter lower-case password in <strong>9.5 seconds</strong>; with argon2id on this Mac the same space takes <strong>131 years</strong>. The first column is the honest part: the top-10k list falls in minutes whatever you choose. The hash only buys time for passwords that are not on a list — keeping list passwords out is lesson 2.4's job.</p>

<h3>Step 4 — LabFlow ID v0.2 stores argon2id strings</h3>
<p>v0.2 creates the users table with a migration (<code>sql/001_users.sql</code>: id, email, name, role, <code>password_hash</code>, <code>must_change_password</code>; applied once by <code>scripts/migrate.mjs</code>) and imports An, Bình and Cô Lan as existing accounts:</p>
${ma('javascript', HASH_TOP)}
${ra(V02)}
<p>Each value is one <strong>self-describing string</strong>: algorithm (<code>argon2id</code>), version, parameters (64 MiB of memory, 2 passes, 1 lane), a 16-byte random salt and the 32-byte hash. Nothing to store in other columns, nothing to forget when you change parameters — lesson 2.2 reads these fields and lesson 2.5 upgrades rows by them.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — reusing the token recipe for passwords.</strong> Chapter 1 stored session tokens as plain SHA-256 and that was right: a token is 256 random bits, there is no list to try. A password is chosen by a person, so a list of guesses is a real attack. The test is one question: <em>can an attacker enumerate the likely inputs?</em> If yes, the hash must be slow.</p>
</div>

<h3>When to use which</h3>
${BANG_EN}

<h3>In interviews / at work</h3>
<ul>
<li><strong>“How do you store passwords?”</strong> — argon2id with a per-password random salt, parameters measured on our hardware, the self-describing string in one column; bcrypt or scrypt only if argon2id is unavailable. Never encrypted, never a fast hash.</li>
<li><strong>“What does a salt protect against?”</strong> — Precomputed tables and amortising work across users; it is public and does not slow a single guess. Speed per guess is the slow hash's job.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start PostgreSQL and LabFlow ID v0.2 (Lab 2 → Setup), then run <code>npm run migrate</code>, <code>npm run seed</code> and <code>node demo2/dump.mjs users</code>. Confirm that hashing the same password twice gives two different strings: <code>node -e "import('./src/passwords/index.js').then(async m =&gt; console.log(await m.hashPassword('x'), await m.hashPassword('x')))"</code>.</li>
<li>Run <code>UV_THREADPOOL_SIZE=10 node demo2/crack.mjs</code>. Then change the population so that 50% of passwords are random (edit the <code>k &lt; 7</code> line). Predict the new cracked count before you run it.</li>
<li>Using the table above, how long does one RTX 4090 need for every 8-character lower-case password stored with plain SHA-256 — and with argon2id at our parameters?</li>
</ol>
<p><strong>Solution</strong> (our machine): two different strings, both <code>$argon2id$v=19$m=65536,p=1,t=2$…</code>. With <code>k &lt; 5</code> only 50% of passwords come from the list, and our run cracked 501 of 1,003, unsalted and salted alike — the count depends on the passwords, never on the salt. Plain SHA-256 on a 4090: 9.5 s; argon2id on this Mac: 131 years (a 4090 runs argon2id too, but each guess needs 64 MiB of memory, which is what keeps that number large).</p>
<p><strong>Done when:</strong> your users table holds three different argon2id strings, your crack run reports the same shape as ours (unsalted ≈ salted count, argon2id finds Bình in 2 guesses), and you can explain to a classmate why salt does not slow a guess.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">threat model</span><span class="v">The attacker you design for. Here: someone holding a copy of the users table, offline, with unlimited tries.</span></div>
  <div class="kv"><span class="k">salt</span><span class="v">Random bytes stored next to each hash, mixed into it so equal passwords give different hashes. Public; at least 32 bits (NIST), 16 bytes here.</span></div>
  <div class="kv"><span class="k">rainbow table</span><span class="v">A precomputed map from hash to password for a fast unsalted hash; useless against salted rows.</span></div>
  <div class="kv"><span class="k">slow (memory-hard) hash</span><span class="v">A password hash built to cost time and memory per guess: argon2id, scrypt, bcrypt (time only).</span></div>
  <div class="kv"><span class="k">self-describing hash string</span><span class="v"><code>$argon2id$v=19$m=…,p=…,t=…$salt$hash</code> — algorithm, parameters and salt travel with the hash.</span></div>
  <div class="kv"><span class="k">credential stuffing</span><span class="v">Trying passwords cracked from one site on other sites — why your leak hurts users elsewhere (Chapter 10).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Design for the copy that already left: how slowly does it turn into passwords?</li>
<li>Plain or encrypted: no work. Unsalted SHA-256: 701 of 1,003 in 15 ms, plus “who shares a password”.</li>
<li>Salt forces work per account (4.96 M hashes) but does not slow one guess: 2 M/s per core, 22 B/s per GPU.</li>
<li>argon2id at measured parameters: ~51 guesses/s here; the list against everyone ≈ 54 h.</li>
<li>No hash saves <code>123456</code> — found in 2 guesses — so 2.4 adds a blocklist.</li>
<li>LabFlow ID v0.2: PostgreSQL 17, one self-describing argon2id string per user.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Applied in Node.js — lesson 8.1: storing passwords', sub: 'Same: the threat is a copied table, a fast hash is the wrong tool, salt per row. That lesson measures SHA-256 at 2,010,039/s vs bcrypt cost 12 ≈ 3.6/s and builds a 1-million-entry rainbow table; this one cracks four storages on 1,003 accounts and adds the GPU table. Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Kẻ tấn công ĐÃ CÓ cơ sở dữ liệu của bạn</h2>
<p class="lead">Bài 0.3 và 1.3 để ngỏ một lỗ: LabFlow ID vẫn giữ mật khẩu của An đúng như cô gõ. Bài này mở đầu Chương 2 bằng giả định mà mọi đội làm nghiêm túc đều thiết kế quanh nó — <strong>ai đó đã có bản chép của bảng users</strong> — rồi đo, trên cùng 1.003 tài khoản và cùng danh sách 10.001 mật khẩu phổ biến, mỗi cách lưu mật khẩu còn để lại cho kẻ tấn công bao nhiêu việc.</p>

<div class="callout ok">
<p><strong>Học xong Chương 2 bạn làm được:</strong> lưu mật khẩu bằng argon2id với tham số tự đo; dựng luồng đăng nhập mà câu trả lời lẫn thời gian không khai ra ai có tài khoản; áp luật mật khẩu của NIST SP 800-63B-4 (độ dài, danh sách chặn, kiểm mật khẩu đã lộ — không luật pha trộn ký tự); và chuyển một bảng băm MD5/bcrypt cũ sang argon2id mà không bắt ai đặt lại. Lab 2 chấm module mật khẩu của bạn bằng một script dump, bẻ và bấm giờ nó.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nói mô hình mối đe doạ (threat model) của việc lưu mật khẩu trong một câu, và vì sao nó không phải "chặn rò rỉ";</li>
<li>tự bẻ bảng chữ thường, SHA-256 không muối và có muối, rồi giải thích các con số;</li>
<li>nói chính xác muối (salt) làm được gì — và không làm được gì;</li>
<li>đọc bảng thời gian bẻ khoá và thấy vì sao không hàm băm nào cứu được <code>123456</code>;</li>
<li>chạy LabFlow ID v0.2 trên PostgreSQL 17 với chuỗi argon2id trong bảng users.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> dự án nào bạn làm (SWP391, SEP490, công việc đầu tiên) cũng có bảng users, và "lưu mật khẩu thế nào?" là câu phỏng vấn xác thực hay gặp nhất ở vị trí backend. Học xong bài này bạn trả lời bằng số tự đo.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Khách sạn giữ một chìa dự phòng cho mỗi phòng trong cái tủ sau quầy lễ tân. Kẻ trộm chẳng cần khiêng tủ đi — chụp một tấm ảnh là đủ để về nhà làm chìa, thong thả, không ai canh. Bảng users bị lộ chính là tấm ảnh đó: một lỗi SQL injection, một bản sao lưu để ở bucket công khai, một chiếc laptop của nhân viên cũ. Hiếm khi bạn được báo lúc nó xảy ra. Nên câu hỏi hữu ích không phải "chặn rò rỉ thế nào?" (Chương 9–11) mà là: <strong>khi họ đã có bản chép, bao lâu nữa thì nó thành mật khẩu?</strong> Và vì người ta dùng lại mật khẩu, một mật khẩu bẻ được từ LabFlow ID sẽ mở Gmail và tài khoản ngân hàng của họ — thiệt hại rơi xuống ngoài dịch vụ của bạn.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bản chép rời đi</span><span class="lz-d">SQL injection, bản sao lưu, laptop. Mọi dòng, kể cả cột mật khẩu, giờ nằm ngoại tuyến — không giới hạn lượt thử, không khoá tài khoản, không log.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đoán, băm, so</span><span class="lz-d">Kẻ tấn công lấy các mật khẩu khả dĩ (danh sách 10.001), lưu mỗi cái đúng như cách bạn lưu, rồi tìm dòng trùng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đòn bẩy duy nhất của bạn</span><span class="lz-d">Mỗi lần đoán tốn bao nhiêu. Đó là toàn bộ không gian thiết kế của bài này.</span></div>
</div>

<h3>Bước 1 — LabFlow ID chuyển sang PostgreSQL, "giữ nguyên như cũ"</h3>
<p>Từ chương này LabFlow ID giữ người dùng trong PostgreSQL 17 (một container ở cổng 4832; cách dựng ở Lab 2). Lần chuyển vội vàng chép người dùng của v0.1 sang một bảng, không đổi gì. Để con số có nghĩa, ta thêm 1.000 tài khoản bịa có mật khẩu theo hình dạng gần thực tế (30% từ top 100, 40% từ phần còn lại của top 10.000, 30% chuỗi ngẫu nhiên 12 ký tự — <code>demo2/population.mjs</code>). Rồi góc nhìn của kẻ tấn công: một câu SELECT.</p>
${ra(OUT['21-naive'])}
<p>Chẳng cần bẻ gì. Adobe (2013) là cùng lỗi đó trong một bộ áo khác: họ <em>mã hoá</em> 153 triệu mật khẩu thay vì băm, nên cùng một mật khẩu luôn ra cùng bản mã, và gợi ý mật khẩu để chữ thường nằm ngay cạnh lo nốt phần còn lại. Mã hoá được thiết kế để đảo ngược được; mật khẩu thì không bao giờ cần đọc lại, chỉ cần kiểm.</p>

<h3>Bước 2 — bốn cách lưu, một kẻ tấn công, một danh sách</h3>
<p>Cùng 1.003 người, cùng danh sách (10.001 mật khẩu phổ biến nhất của SecLists). Chỉ cách lưu thay đổi. Phần đáng đọc là bản có muối:</p>
${ma('javascript', CR_SALT)}
${ra(OUT['21-crack'])}
<ul>
<li><strong>SHA-256, không muối:</strong> kẻ tấn công băm danh sách <em>một lần</em> (15 ms) và mọi tài khoản thành một phép tra từ điển — 701 trên 1.003 sụp. Tệ hơn, 271 dòng lặp lại giá trị băm của dòng khác: chưa bẻ gì, bảng đã khai ra ai dùng chung mật khẩu với ai.</li>
<li><strong>SHA-256 + muối 16 byte mỗi tài khoản:</strong> giá trị lưu là <code>sha256(salt + password)</code>, nên danh sách phải băm lại cho <em>từng</em> tài khoản — 4.960.404 lần băm thay vì 10.001 (vòng lặp dừng ở lần trúng đầu). Vẫn chỉ 2,4 s trên một nhân, và vẫn đúng 701.</li>
<li><strong>argon2id</strong> (tham số của LabFlow ID, chọn ở 2.2): khoảng 51 lần đoán mỗi giây trên 10 luồng — thử cả danh sách với cả 1.003 tài khoản mất ≈ 54 giờ thay vì 2,4 giây. Vậy mà <code>123456</code> của Bình là từ <strong>thứ hai</strong> trong danh sách: tìm ra sau 2 lần đoán, 166 ms.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "có muối rồi, an toàn".</strong> Muối gỡ đi hai lối tắt: bảng tính sẵn (rainbow table — bảng cầu vồng) và làm việc một lần cho tất cả. Nó <em>không</em> làm một lần đoán đắt hơn chút nào. SHA-256 có muối vẫn chạy khoảng 2 triệu lần đoán mỗi giây trên một nhân CPU và 22 tỉ trên một GPU. Băm nhanh có muối của một mật khẩu yếu vẫn là mật khẩu yếu, thêm một bước.</p>
</div>

<h3>Bước 3 — vét cả một không gian mất bao lâu?</h3>
<p>Một tài khoản có muối; thử <em>mọi</em> mật khẩu có một dạng nào đó mất bao lâu? Tốc độ CPU dưới đây đo trên chính máy này (Apple M1 Max, 10 luồng); tốc độ GPU lấy từ một benchmark hashcat 6.2.6 công khai trên một card RTX 4090. bcrypt ở đó chạy 32 vòng (cost 5), nên cost 12 (4.096 vòng) chậm gấp 2<sup>7</sup> = 128 lần: 184.000 / 128 ≈ 1.438 lần mỗi giây.</p>
${ra(OUT['21-table'])}
<p>Đọc theo hàng. Băm nhanh trên một card chơi game vét sạch mọi mật khẩu 8 chữ thường trong <strong>9,5 giây</strong>; với argon2id trên máy Mac này, cùng không gian mất <strong>131 năm</strong>. Cột đầu tiên là phần nói thật: danh sách top 10k rơi trong vài phút dù bạn chọn gì. Hàm băm chỉ mua thời gian cho những mật khẩu không nằm trong danh sách — giữ mật khẩu-trong-danh-sách ở ngoài là việc của bài 2.4.</p>

<h3>Bước 4 — LabFlow ID v0.2 lưu chuỗi argon2id</h3>
<p>v0.2 tạo bảng users bằng một migration (<code>sql/001_users.sql</code>: id, email, name, role, <code>password_hash</code>, <code>must_change_password</code>; <code>scripts/migrate.mjs</code> áp đúng một lần) và nhập An, Bình, Cô Lan như những tài khoản đã có:</p>
${ma('javascript', HASH_TOP)}
${ra(V02)}
<p>Mỗi giá trị là một <strong>chuỗi tự mô tả (self-describing)</strong>: thuật toán (<code>argon2id</code>), phiên bản, tham số (64 MiB bộ nhớ, 2 lượt, 1 làn), 16 byte muối ngẫu nhiên và 32 byte kết quả băm. Không có gì phải lưu ở cột khác, không có gì để quên khi đổi tham số — bài 2.2 đọc các trường này và bài 2.5 nâng cấp từng dòng theo chúng.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — dùng lại công thức của token cho mật khẩu.</strong> Chương 1 lưu token phiên bằng SHA-256 thường và như thế là đúng: token là 256 bit ngẫu nhiên, chẳng có danh sách nào để thử. Mật khẩu do người chọn, nên một danh sách đoán là đòn tấn công thật. Phép thử chỉ là một câu hỏi: <em>kẻ tấn công có liệt kê được các đầu vào khả dĩ không?</em> Nếu có, hàm băm phải chậm.</p>
</div>

<h3>Khi nào dùng cái gì</h3>
${BANG_VI}

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Lưu mật khẩu thế nào?"</strong> — argon2id với muối ngẫu nhiên riêng từng mật khẩu, tham số đo trên phần cứng của mình, chuỗi tự mô tả trong một cột; bcrypt hay scrypt chỉ khi không có argon2id. Không bao giờ mã hoá, không bao giờ băm nhanh.</li>
<li><strong>"Muối chống được gì?"</strong> — Bảng tính sẵn và việc chia sẻ công sức giữa nhiều người dùng; nó công khai và không làm chậm một lần đoán. Tốc độ mỗi lần đoán là việc của hàm băm chậm.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Bật PostgreSQL và LabFlow ID v0.2 (Lab 2 → Chuẩn bị), rồi chạy <code>npm run migrate</code>, <code>npm run seed</code> và <code>node demo2/dump.mjs users</code>. Xác nhận băm cùng một mật khẩu hai lần ra hai chuỗi khác nhau: <code>node -e "import('./src/passwords/index.js').then(async m =&gt; console.log(await m.hashPassword('x'), await m.hashPassword('x')))"</code>.</li>
<li>Chạy <code>UV_THREADPOOL_SIZE=10 node demo2/crack.mjs</code>. Rồi sửa tập người dùng để 50% mật khẩu là ngẫu nhiên (sửa dòng <code>k &lt; 7</code>). Đoán số bị bẻ mới trước khi chạy.</li>
<li>Dùng bảng ở trên: một RTX 4090 cần bao lâu cho mọi mật khẩu 8 chữ thường lưu bằng SHA-256 thường — và bằng argon2id với tham số của ta?</li>
</ol>
<p><strong>Lời giải</strong> (máy của mình): hai chuỗi khác nhau, đều <code>$argon2id$v=19$m=65536,p=1,t=2$…</code>. Với <code>k &lt; 5</code> chỉ 50% mật khẩu lấy từ danh sách, và lần chạy của mình bẻ được 501 trên 1.003, không muối hay có muối như nhau — con số phụ thuộc mật khẩu, không bao giờ phụ thuộc muối. SHA-256 thường trên 4090: 9,5 s; argon2id trên máy Mac này: 131 năm (4090 cũng chạy được argon2id, nhưng mỗi lần đoán cần 64 MiB bộ nhớ — đó là thứ giữ con số này lớn).</p>
<p><strong>Đạt khi:</strong> bảng users của bạn có ba chuỗi argon2id khác nhau, lần bẻ của bạn ra cùng hình dạng với của mình (không muối ≈ có muối, argon2id tìm ra Bình sau 2 lần đoán), và bạn giải thích được cho bạn cùng lớp vì sao muối không làm chậm một lần đoán.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">threat model (mô hình mối đe doạ)</span><span class="v">Kẻ tấn công mà bạn thiết kế để chống. Ở đây: người cầm bản chép bảng users, ngoại tuyến, thử bao nhiêu lần cũng được.</span></div>
  <div class="kv"><span class="k">salt (muối)</span><span class="v">Byte ngẫu nhiên lưu cạnh mỗi giá trị băm, trộn vào để mật khẩu giống nhau ra giá trị băm khác nhau. Công khai; tối thiểu 32 bit (NIST), ở đây 16 byte.</span></div>
  <div class="kv"><span class="k">rainbow table (bảng cầu vồng)</span><span class="v">Bảng tính sẵn từ giá trị băm về mật khẩu cho một hàm băm nhanh không muối; vô dụng với dòng có muối.</span></div>
  <div class="kv"><span class="k">slow / memory-hard hash (băm chậm, tốn bộ nhớ)</span><span class="v">Hàm băm mật khẩu được thiết kế để mỗi lần đoán tốn thời gian và bộ nhớ: argon2id, scrypt, bcrypt (chỉ tốn thời gian).</span></div>
  <div class="kv"><span class="k">self-describing hash string (chuỗi băm tự mô tả)</span><span class="v"><code>$argon2id$v=19$m=…,p=…,t=…$salt$hash</code> — thuật toán, tham số và muối đi cùng giá trị băm.</span></div>
  <div class="kv"><span class="k">credential stuffing (nhồi mật khẩu)</span><span class="v">Đem mật khẩu bẻ được ở trang này thử sang trang khác — lý do vụ lộ của bạn làm hại người dùng ở nơi khác (Chương 10).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thiết kế cho bản chép đã rời đi: nó biến thành mật khẩu chậm tới mức nào?</li>
<li>Chữ thường hay mã hoá: chẳng tốn công. SHA-256 không muối: 701/1.003 trong 15 ms, kèm "ai dùng chung mật khẩu".</li>
<li>Muối bắt làm việc riêng từng tài khoản (4,96 triệu lần băm) nhưng không làm chậm một lần đoán: 2 triệu/s mỗi nhân, 22 tỉ/s mỗi GPU.</li>
<li>argon2id với tham số tự đo: ~51 lần đoán/giây ở đây; cả danh sách với mọi người ≈ 54 giờ.</li>
<li>Không hàm băm nào cứu <code>123456</code> — tìm ra sau 2 lần đoán — nên bài 2.4 thêm danh sách chặn.</li>
<li>LabFlow ID v0.2: PostgreSQL 17, mỗi người dùng một chuỗi argon2id tự mô tả.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Áp vào Node.js — bài 8.1: lưu mật khẩu', sub: 'Giống: mối đe doạ là bảng bị chép, băm nhanh là sai công cụ, muối riêng từng dòng. Bài đó đo SHA-256 2.010.039/s đối lại bcrypt cost 12 ≈ 3,6/s và dựng bảng cầu vồng 1 triệu mục; bài này bẻ bốn cách lưu trên 1.003 tài khoản và thêm bảng GPU. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
