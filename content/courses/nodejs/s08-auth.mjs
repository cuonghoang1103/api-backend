/**
 * Node.js — Chương 8: Xác thực (authentication) và phân quyền (authorization).
 * Mọi output là đo thật: Node v22.21.0, express 5.2.1, argon2 0.45.1, bcrypt 6.0.0,
 * jsonwebtoken 9.0.3, PostgreSQL 15.4 + prisma 7.9.1, máy 10 nhân.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 8 — Authentication and authorization|||Chương 8 — Xác thực và phân quyền',
  description: 'Lưu mật khẩu cho đúng, cấp access token và refresh token có xoay vòng, dựng middleware requireAuth/requireRole, và thu hồi phiên. Notes API bỏ hằng số AUTHOR_ID = 1 để chạy trên người dùng thật.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Storing passwords: why almost every way is wrong|||8.1 — Lưu mật khẩu: vì sao gần như mọi cách đều sai',
      slug: 'nodejs-8-1-mat-khau-va-bam',
      simulation: {
        scenario: 'password-hashing',
        caption: { en: 'Plain text, then a real hash — against the same leak', vi: 'Lưu thô, rồi băm thật — trước cùng một vụ lộ CSDL' },
      },
      type: 'VIDEO',
      description: 'Đo tốc độ băm, vét cạn một triệu mật khẩu, hiểu muối và tham số argon2id, và bịt lỗ dò tài khoản qua thời gian trả lời.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Storing passwords: why almost every way is wrong</h2>
<p class="lead">Every chapter so far had a "correct" answer you could reason your way to. This one does not. Password storage is the one place in a backend where intuition is actively harmful: the fast solution is the broken one, the "clever" solution is the broken one, and the correct solution looks wasteful until you measure what it buys. So this lesson is measurements first, opinions second.</p>

<h3>The threat model — say it out loud before writing code</h3>
<p>You are not defending against someone guessing a password on your login form. Rate limiting handles that (lesson 8.4). You are defending against <strong>the day your database is copied</strong> — a leaked backup, an SQL injection, a stolen laptop, an employee. Assume the attacker has the whole <code>User</code> table on their own machine, offline, with as much time and as many GPUs as they want.</p>
<div class="callout warn">Under that assumption every question becomes concrete: how long does it take that attacker, with your table in hand, to turn a stored value back into the password a user also uses for their email?</div>

<h3>Four ways to lose</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Plain text</span><span class="v">The leak <em>is</em> the passwords. And most users reuse them — you just leaked their email accounts too.</span></div>
  <div class="kv"><span class="k">Encryption (AES…)</span><span class="v">Encryption is reversible by design — that is the whole point of it. The key lives in the same env file your app reads, so the attacker who got the table usually gets the key.</span></div>
  <div class="kv"><span class="k">MD5 / SHA-256</span><span class="v">Not reversible, but <strong>fast</strong> — and fast is the vulnerability. Measured below.</span></div>
  <div class="kv"><span class="k">SHA-256 + your own salt</span><span class="v">Better than nothing, still fast. Home-made schemes also tend to leak in other ways (no versioning, no constant-time compare, salt reused).</span></div>
</div>
<p>Rule to memorise: <strong>a password is never stored, it is verified.</strong> You keep a value that lets you check "is this the same password?" and that is worth nothing to whoever steals it.</p>

<h3>Measurement 1 — how fast is "fast"?</h3>
<p>Same machine, same Node process, hashing the same string:</p>
<pre><code>timeSync(<span class="tok-str">'sha256'</span>, (i) =&gt; crypto.createHash(<span class="tok-str">'sha256'</span>).update(PW + i).digest(<span class="tok-str">'hex'</span>), <span class="tok-num">200000</span>);
<span class="tok-kw">for</span> (<span class="tok-kw">const</span> cost <span class="tok-kw">of</span> [<span class="tok-num">8</span>, <span class="tok-num">10</span>, <span class="tok-num">12</span>, <span class="tok-num">14</span>]) bcrypt.hashSync(PW, cost);
<span class="tok-kw">await</span> argon2.hash(PW, { memoryCost: <span class="tok-num">19456</span>, timeCost: <span class="tok-num">2</span>, parallelism: <span class="tok-num">1</span> });</code></pre>
<div class="out">md5                        200000 lần = 153.2ms  →     1305689 lần/giây
sha256                     200000 lần = 196.8ms  →     1016503 lần/giây
sha512                     200000 lần = 172.1ms  →     1161853 lần/giây

bcrypt cost=8              19.4ms/lần  →        51.5 lần/giây
bcrypt cost=10             78.3ms/lần  →        12.8 lần/giây
bcrypt cost=12             324.3ms/lần  →         3.1 lần/giây
bcrypt cost=14             1424.2ms/lần  →         0.7 lần/giây
argon2id (mặc định)        65.8ms/lần  →        15.2 lần/giây
argon2id (OWASP 19MiB,t=2) 33.0ms/lần  →        30.3 lần/giây</div>
<p>One laptop core does <strong>1,016,503 SHA-256 hashes per second</strong> and <strong>3.1 bcrypt(cost=12) hashes per second</strong>. That is a factor of about <strong>328,000</strong>. A password hash function is not a hash function that happens to be slow — being slow is its entire job.</p>

<h3>Measurement 2 — a rainbow table, built live</h3>
<p>"Nobody can reverse SHA-256" is true and irrelevant. The attacker does not reverse it; they hash every candidate and look the result up. Here is the whole 6-digit password space — the PIN-style password millions of people actually use:</p>
<pre><code><span class="tok-kw">const</span> table = <span class="tok-kw">new</span> Map();
<span class="tok-kw">for</span> (<span class="tok-kw">let</span> i = <span class="tok-num">0</span>; i &lt; <span class="tok-num">1_000_000</span>; i++) {
  <span class="tok-kw">const</span> guess = String(i).padStart(<span class="tok-num">6</span>, <span class="tok-str">'0'</span>);
  table.set(crypto.createHash(<span class="tok-str">'sha256'</span>).update(guess).digest(<span class="tok-str">'hex'</span>), guess);
}
<span class="tok-comment">// "hash bị rò từ CSDL"</span>
table.get(crypto.createHash(<span class="tok-str">'sha256'</span>).update(<span class="tok-str">'123456'</span>).digest(<span class="tok-str">'hex'</span>));</code></pre>
<div class="out">dựng bảng 1.000.000 mục : 1774ms   (0.56 triệu băm/giây)
tra ngược hash bị rò    : "123456"  trong 0.0023ms

bcrypt cost=12          : 358.8ms cho MỖI lần đoán
vét cạn cùng 1.000.000 khả năng: 99.7 giờ = 4.2 ngày (1 nhân CPU)
→ chênh lệch: 202302× chậm hơn, với CÙNG một mật khẩu rác</div>
<div class="callout danger">1.8 seconds to precompute every 6-digit password, 0.0023 ms to look one up. With bcrypt cost 12 the same attack costs 4.2 days per <em>user</em> — because every user has a different salt, so the table cannot be shared.</div>

<h3>Salt: why the table stops working</h3>
<p>Without salt, one hash cracks every user who chose that password. Look at what an unsalted table leaks before you even crack anything:</p>
<div class="out">an@vd.com      8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
binh@vd.com    f1d7e9dcf81a76784e1b759815403aa87fd15406746862d1807c8777516f3818
chi@vd.com     8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92</div>
<p>You do not need to crack anything to see that An and Chi share a password. Now the same password hashed three times by bcrypt, which generates a fresh random salt each call:</p>
<div class="out">bcrypt("123456") lần 1: $2b$10$MRH7iTpyMP9El9H3RnW5fO66xOCW9YM9aVJ6zlWcPd7JckvuJwz9u
bcrypt("123456") lần 2: $2b$10$fjT.b90BeGd2LC7x.ZWWhOKs1pHRqQwniP96nFT6KUbT4GSjaryJ.
bcrypt("123456") lần 3: $2b$10$sGfJY1C3L.Kf7DzOZVRFqeRDj73jX4u4eRDSRSgDBrWqe7.lv.t9G
so khớp lại: true</div>
<p>Three different strings, and verification still works — because the salt is stored <em>inside</em> the string:</p>
<div class="out">chuỗi đầy đủ : $2b$10$a7vd/4xSVvoK5VKpGGzbD.x4Y05t1q0YIRcs.YQcb4WEtp1sivisK
thuật toán   : $2b$   (2b = bcrypt)
hệ số chi phí: 10    (2^10 = 1024 vòng)
muối (22 ký tự): a7vd/4xSVvoK5VKpGGzbD.
băm  (31 ký tự): x4Y05t1q0YIRcs.YQcb4WEtp1sivisK</div>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">$2b$</span><span class="lz-d">which algorithm — so you can migrate later</span></div>
  <div class="lz-node"><span class="lz-t">$10$</span><span class="lz-d">cost — so old hashes still verify after you raise it</span></div>
  <div class="lz-node"><span class="lz-t">salt</span><span class="lz-d">random per user — kills shared rainbow tables</span></div>
  <div class="lz-node"><span class="lz-t">hash</span><span class="lz-d">the actual derived key</span></div>
</div>
<p>This self-describing format is why you never store the salt or cost in separate columns. One <code>VARCHAR</code> holds everything <code>verify()</code> will ever need.</p>

<h3>Which function: argon2id, and bcrypt if you must</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">argon2id</span><span class="v">First choice. Tunable in <strong>memory</strong> as well as time — a GPU has thousands of cores but not thousands of independent 19 MiB scratchpads, so memory cost is what actually hurts a cracking rig.</span></div>
  <div class="kv"><span class="k">bcrypt</span><span class="v">Fine, 25 years of scrutiny, everywhere. Two real limits: it silently truncates at 72 bytes, and it is only CPU-hard, not memory-hard.</span></div>
  <div class="kv"><span class="k">scrypt</span><span class="v">Memory-hard too, and built into Node (<code>crypto.scrypt</code>) with no native module to compile. A reasonable choice when you cannot add dependencies.</span></div>
  <div class="kv"><span class="k">PBKDF2</span><span class="v">Only when a compliance rule names it. Neither memory-hard nor modern.</span></div>
</div>
<p>OWASP's 2024 baseline for argon2id is <code>m=19456 KiB (19 MiB), t=2, p=1</code>, which measured 33.0 ms above. The rule for tuning is not "copy a number off the internet" — it is: <strong>pick the largest cost your login endpoint can afford</strong>, then verify it on the machine that will actually run it.</p>

<h3>Measurement 3 — what that cost does under load</h3>
<p>Hashing is not free capacity. Sixty-four simultaneous logins on this laptop:</p>
<div class="out">UV_THREADPOOL_SIZE = 4 (mặc định)
  1 đăng nhập đồng thời: tổng    30ms | p50    30ms | chậm nhất    30ms
  4 đăng nhập đồng thời: tổng    40ms | p50    39ms | chậm nhất    40ms
 16 đăng nhập đồng thời: tổng   148ms | p50   107ms | chậm nhất   148ms
 64 đăng nhập đồng thời: tổng   582ms | p50   330ms | chậm nhất   582ms</div>
<p>Two things to read out of that. First, latency degrades gracefully, not catastrophically — that is the libuv thread pool from chapter 2 doing its job. Second, 64 × 19 MiB is 1.2 GB of memory if they ever ran truly in parallel; the pool is what keeps that bounded. This is also why <code>/auth/login</code> is the one endpoint an attacker will flood to burn your CPU — lesson 8.4 rate-limits it.</p>

<h3>Measurement 4 — the sync variant freezes the entire server</h3>
<p>Both APIs exist and the names differ by four characters. The difference is not stylistic:</p>
<pre><code><span class="tok-comment">// nhịp tim: một setInterval 50ms chạy song song, đo độ trễ</span>
<span class="tok-kw">for</span> (<span class="tok-kw">let</span> i = <span class="tok-num">0</span>; i &lt; <span class="tok-num">10</span>; i++) bcrypt.hashSync(<span class="tok-str">'pw'</span>, <span class="tok-num">12</span>);        <span class="tok-comment">// đồng bộ</span>
<span class="tok-kw">await</span> Promise.all(Array.from({ length: <span class="tok-num">10</span> }, () =&gt; bcrypt.hash(<span class="tok-str">'pw'</span>, <span class="tok-num">12</span>)));  <span class="tok-comment">// bất đồng bộ</span></code></pre>
<div class="out">bcrypt.hashSync ×10 (đồng bộ)      xong sau  3009ms | nhịp tim 50ms trễ tối đa 2959ms
bcrypt.hash ×10 (bất đồng bộ)      xong sau   978ms | nhịp tim 50ms trễ tối đa 1ms
argon2.hash ×10 (bất đồng bộ)      xong sau    94ms | nhịp tim 50ms trễ tối đa 1ms</div>
<div class="pitfall"><strong>hashSync in a request handler freezes every other request for 3 seconds.</strong> Ten users logging in at once means your health check times out and the load balancer takes the container out of rotation. The async versions run on the thread pool: the event loop stayed within 1 ms of schedule the whole time. Chapter 2's lesson, arriving with a real bill attached.</div>

<h3>The trap that lets a wrong password log in</h3>
<p>bcrypt only reads the first 72 <em>bytes</em> of its input. Everything after that is silently discarded:</p>
<pre><code><span class="tok-kw">const</span> base = <span class="tok-str">'A'</span>.repeat(<span class="tok-num">72</span>);
<span class="tok-kw">const</span> pwA = base + <span class="tok-str">'-mat-khau-that-cua-toi'</span>;
<span class="tok-kw">const</span> pwB = base + <span class="tok-str">'-KE-TAN-CONG-DOAN-BUA'</span>;
bcrypt.compareSync(pwB, bcrypt.hashSync(pwA, <span class="tok-num">10</span>));</code></pre>
<div class="out">độ dài A = 94, độ dài B = 93, 72 byte đầu giống nhau
bcrypt.compare(B, hash(A)) = true   ← ĐĂNG NHẬP ĐƯỢC bằng mật khẩu SAI
argon2.verify (không giới hạn 72 byte) = false</div>
<p>And "72 bytes" is not "72 characters" once your users type in their own language:</p>
<div class="out">"Mật_khẩu_rất_dài_bằng_tiếng_Vi…"  ký tự = 70, byte = 99</div>
<div class="callout warn">A 70-character Vietnamese passphrase is 99 bytes — bcrypt throws away the last 27 of them. If you stay on bcrypt, either cap the password length at 72 bytes with an explicit error, or pre-hash with SHA-256 and base64 the result before calling bcrypt. Do not leave it silent.</div>

<h3>The module, in full</h3>
<pre><code><span class="tok-comment">// src/auth/password.mjs</span>
<span class="tok-kw">import</span> argon2 <span class="tok-kw">from</span> <span class="tok-str">'argon2'</span>;

<span class="tok-comment">// Tham số OWASP 2024 cho argon2id: 19 MiB bộ nhớ, 2 vòng, 1 luồng.</span>
<span class="tok-kw">const</span> OPTS = { type: argon2.argon2id, memoryCost: <span class="tok-num">19456</span>, timeCost: <span class="tok-num">2</span>, parallelism: <span class="tok-num">1</span> };

<span class="tok-kw">export const</span> hashPassword = (plain) =&gt; argon2.hash(plain, OPTS);

<span class="tok-kw">export async function</span> verifyPassword(hash, plain) {
  <span class="tok-kw">if</span> (!hash) <span class="tok-kw">return false</span>;
  <span class="tok-kw">try</span> { <span class="tok-kw">return await</span> argon2.verify(hash, plain); }
  <span class="tok-kw">catch</span> { <span class="tok-kw">return false</span>; }              <span class="tok-comment">// chuỗi băm hỏng ≠ crash 500</span>
}

<span class="tok-comment">// Một chuỗi băm "giả" để so ngay cả khi email không tồn tại</span>
<span class="tok-kw">export const</span> DUMMY_HASH = <span class="tok-kw">await</span> hashPassword(<span class="tok-str">'mat-khau-khong-bao-gio-dung-den'</span>);

<span class="tok-kw">export const</span> needsRehash = (hash) =&gt; argon2.needsRehash(hash, OPTS);</code></pre>
<p>Four exports, and three of them exist because of a specific failure. <code>verifyPassword</code> returns <code>false</code> instead of throwing, so a corrupted row is a failed login and not a 500. <code>needsRehash</code> is covered at the end of this lesson. <code>DUMMY_HASH</code> is next.</p>

<h3>Measurement 5 — your login endpoint answers "does this email exist?"</h3>
<p>The obvious implementation returns early when the email is unknown. That early return is a side channel: it skips the expensive hash, so it answers faster. Thirty logins each way, median:</p>
<pre><code><span class="tok-comment">// BẢN LỖI</span>
<span class="tok-kw">const</span> user = <span class="tok-kw">await</span> prisma.user.findUnique({ where: { email } });
<span class="tok-kw">if</span> (!user) <span class="tok-kw">return</span> { ok: <span class="tok-kw">false</span> };            <span class="tok-comment">// ← không băm gì cả</span>
<span class="tok-kw">return</span> { ok: <span class="tok-kw">await</span> verifyPassword(user.passwordHash, password) };

<span class="tok-comment">// BẢN ĐÚNG</span>
<span class="tok-kw">const</span> user = <span class="tok-kw">await</span> prisma.user.findUnique({ where: { email } });
<span class="tok-kw">const</span> ok = <span class="tok-kw">await</span> verifyPassword(user?.passwordHash ?? DUMMY_HASH, password);
<span class="tok-kw">return</span> { ok: Boolean(user) &amp;&amp; ok };</code></pre>
<div class="out">loginNguyHiem: email KHÔNG tồn tại = 1.42ms | email CÓ tồn tại = 35.52ms | chênh 25.0×
loginAnToan  : email KHÔNG tồn tại = 34.73ms | email CÓ tồn tại = 36.62ms | chênh 1.1×</div>
<p>A 25× gap is not subtle — a script can classify a million email addresses into "has an account here" and "does not" without ever guessing a password. For a general web app that is a privacy leak; for a dating site, a medical portal or a political forum it can be a safety problem for real people.</p>
<div class="callout ok">Same fix, same shape, three places: identical timing, identical status code (401), identical message. "Email hoặc mật khẩu không đúng" — never "email không tồn tại".</div>

<h3>Upgrading cost without asking anyone to change their password</h3>
<p>You picked <code>t=2</code> in 2026; in 2029 the machines are faster and you want <code>t=3</code>. Because the parameters live inside every stored string, you can migrate one user at a time, at the only moment you ever hold their plain password — the instant they log in:</p>
<pre><code><span class="tok-kw">if</span> (needsRehash(user.passwordHash)) {
  <span class="tok-kw">await</span> prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: <span class="tok-kw">await</span> hashPassword(password) },
  });
}</code></pre>
<p>Same trick migrates bcrypt → argon2: verify with whichever algorithm the stored prefix names, then re-hash with the new one. After a few months the long tail of inactive accounts is all that is left, and those you expire.</p>

<h3>Password rules that help, and rules that hurt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Do: minimum length 8–12</span><span class="v">Length is the only requirement with real entropy behind it. Allow long passphrases (up to 64+) and every character, including spaces and emoji.</span></div>
  <div class="kv"><span class="k">Do: block known-breached passwords</span><span class="v">Check against the Have I Been Pwned k-anonymity API — you send 5 hex characters of the SHA-1, never the password. Stops the top few thousand instantly.</span></div>
  <div class="kv"><span class="k">Don't: force 90-day rotation</span><span class="v">NIST dropped this. Forced rotation produces <code>Password1!</code> → <code>Password2!</code>. Rotate on evidence of compromise, not on a calendar.</span></div>
  <div class="kv"><span class="k">Don't: demand 1 upper 1 digit 1 symbol</span><span class="v">Pushes everyone to the same predictable shape, and cracking rigs know that shape. Length plus a breach check beats composition rules.</span></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Passwords are argon2id at the OWASP parameters, hashed with the async API only — the <code>hashSync</code> measurement above is exactly why. Login always runs the verification, even for unknown emails, so the response time carries no information. The stored string is a single <code>passwordHash</code> column of type <code>String?</code> — nullable, because accounts created through Google OAuth have no password at all, and <code>verifyPassword</code> returning <code>false</code> for <code>null</code> is what stops "log in with an empty password" on those accounts.</p>
</div>

<h3>Recap</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Threat</span><span class="v">Offline attacker with your whole table. Design for that, not for the login form.</span></div>
  <div class="kv"><span class="k">Fast = broken</span><span class="v">1,016,503 SHA-256/s vs 3.1 bcrypt(12)/s. Slowness is the feature.</span></div>
  <div class="kv"><span class="k">Salt</span><span class="v">Per user, stored in the hash string, kills shared tables.</span></div>
  <div class="kv"><span class="k">Never sync</span><span class="v"><code>hashSync</code> ×10 froze the process 2959 ms.</span></div>
  <div class="kv"><span class="k">Constant answers</span><span class="v">Same timing, same status, same message for every failed login.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-949" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 949 — Password Hashing (bcrypt)</span><span class="lc-sub">10 bài tập: băm, so khớp, cost factor, nâng cấp hash.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Lưu mật khẩu: vì sao gần như mọi cách đều sai</h2>
<p class="lead">Mọi chương trước đều có một đáp án "đúng" mà bạn suy luận ra được. Chương này thì không. Lưu mật khẩu là chỗ duy nhất trong backend mà trực giác gây hại thật sự: cách nhanh là cách hỏng, cách "thông minh" cũng là cách hỏng, còn cách đúng thì trông rất phí phạm cho tới khi bạn đo xem nó mua được gì. Nên bài này đo trước, bàn sau.</p>

<h3>Mô hình mối đe doạ — nói thành lời trước khi viết code</h3>
<p>Bạn không phòng thủ trước một người ngồi đoán mật khẩu trên form đăng nhập. Việc đó do chặn tần suất lo (bài 8.4). Bạn phòng thủ cho <strong>cái ngày cơ sở dữ liệu bị sao chép ra ngoài</strong> — một bản sao lưu bị rò, một lỗ SQL injection, một cái laptop bị mất, một nhân viên cũ. Hãy giả định kẻ tấn công đang có nguyên bảng <code>User</code> trên máy của họ, ngoại tuyến, với bao nhiêu thời gian và bao nhiêu GPU tuỳ thích.</p>
<div class="callout warn">Dưới giả định đó mọi câu hỏi trở nên cụ thể: kẻ đó cầm bảng của bạn thì mất bao lâu để biến một giá trị đã lưu trở lại thành mật khẩu mà người dùng cũng đang dùng cho hòm thư của họ?</div>

<h3>Bốn cách thua</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Văn bản thuần</span><span class="v">Rò rỉ <em>chính là</em> mật khẩu. Mà đa số người dùng dùng lại mật khẩu — bạn vừa làm rò luôn cả hòm thư của họ.</span></div>
  <div class="kv"><span class="k">Mã hoá (AES…)</span><span class="v">Mã hoá vốn thiết kế để giải ngược được — đó là toàn bộ mục đích của nó. Khoá lại nằm trong chính tệp env mà ứng dụng đọc, nên kẻ lấy được bảng thường lấy luôn được khoá.</span></div>
  <div class="kv"><span class="k">MD5 / SHA-256</span><span class="v">Không giải ngược được, nhưng <strong>nhanh</strong> — và nhanh chính là lỗ hổng. Đo ở dưới.</span></div>
  <div class="kv"><span class="k">SHA-256 + muối tự chế</span><span class="v">Hơn không làm gì, nhưng vẫn nhanh. Sơ đồ tự chế còn hay rò theo những đường khác: không ghi phiên bản, không so sánh thời gian hằng, muối bị dùng lại.</span></div>
</div>
<p>Quy tắc cần thuộc: <strong>mật khẩu không bao giờ được lưu, nó chỉ được kiểm chứng.</strong> Bạn giữ một giá trị cho phép kiểm "có đúng mật khẩu này không?", và giá trị đó vô giá trị với kẻ lấy trộm nó.</p>

<h3>Phép đo 1 — "nhanh" là nhanh cỡ nào?</h3>
<p>Cùng một máy, cùng một tiến trình Node, băm cùng một chuỗi:</p>
<pre><code>timeSync(<span class="tok-str">'sha256'</span>, (i) =&gt; crypto.createHash(<span class="tok-str">'sha256'</span>).update(PW + i).digest(<span class="tok-str">'hex'</span>), <span class="tok-num">200000</span>);
<span class="tok-kw">for</span> (<span class="tok-kw">const</span> cost <span class="tok-kw">of</span> [<span class="tok-num">8</span>, <span class="tok-num">10</span>, <span class="tok-num">12</span>, <span class="tok-num">14</span>]) bcrypt.hashSync(PW, cost);
<span class="tok-kw">await</span> argon2.hash(PW, { memoryCost: <span class="tok-num">19456</span>, timeCost: <span class="tok-num">2</span>, parallelism: <span class="tok-num">1</span> });</code></pre>
<div class="out">md5                        200000 lần = 153.2ms  →     1305689 lần/giây
sha256                     200000 lần = 196.8ms  →     1016503 lần/giây
sha512                     200000 lần = 172.1ms  →     1161853 lần/giây

bcrypt cost=8              19.4ms/lần  →        51.5 lần/giây
bcrypt cost=10             78.3ms/lần  →        12.8 lần/giây
bcrypt cost=12             324.3ms/lần  →         3.1 lần/giây
bcrypt cost=14             1424.2ms/lần  →         0.7 lần/giây
argon2id (mặc định)        65.8ms/lần  →        15.2 lần/giây
argon2id (OWASP 19MiB,t=2) 33.0ms/lần  →        30.3 lần/giây</div>
<p>Một nhân laptop chạy được <strong>1.016.503 lần băm SHA-256 mỗi giây</strong> và <strong>3,1 lần bcrypt(cost=12) mỗi giây</strong>. Chênh nhau khoảng <strong>328.000 lần</strong>. Hàm băm mật khẩu không phải là một hàm băm tình cờ chậm — chậm chính là toàn bộ nhiệm vụ của nó.</p>

<h3>Phép đo 2 — dựng một bảng cầu vồng ngay tại chỗ</h3>
<p>"Không ai giải ngược được SHA-256" là câu đúng nhưng không liên quan. Kẻ tấn công không giải ngược; họ băm mọi ứng viên rồi tra bảng. Đây là toàn bộ không gian mật khẩu 6 chữ số — kiểu mật khẩu như mã PIN mà hàng triệu người đang dùng thật:</p>
<pre><code><span class="tok-kw">const</span> table = <span class="tok-kw">new</span> Map();
<span class="tok-kw">for</span> (<span class="tok-kw">let</span> i = <span class="tok-num">0</span>; i &lt; <span class="tok-num">1_000_000</span>; i++) {
  <span class="tok-kw">const</span> guess = String(i).padStart(<span class="tok-num">6</span>, <span class="tok-str">'0'</span>);
  table.set(crypto.createHash(<span class="tok-str">'sha256'</span>).update(guess).digest(<span class="tok-str">'hex'</span>), guess);
}
<span class="tok-comment">// "hash bị rò từ CSDL"</span>
table.get(crypto.createHash(<span class="tok-str">'sha256'</span>).update(<span class="tok-str">'123456'</span>).digest(<span class="tok-str">'hex'</span>));</code></pre>
<div class="out">dựng bảng 1.000.000 mục : 1774ms   (0.56 triệu băm/giây)
tra ngược hash bị rò    : "123456"  trong 0.0023ms

bcrypt cost=12          : 358.8ms cho MỖI lần đoán
vét cạn cùng 1.000.000 khả năng: 99.7 giờ = 4.2 ngày (1 nhân CPU)
→ chênh lệch: 202302× chậm hơn, với CÙNG một mật khẩu rác</div>
<div class="callout danger">1,8 giây để tính trước mọi mật khẩu 6 chữ số, 0,0023 ms để tra một cái. Với bcrypt cost 12, cùng đòn tấn công đó tốn 4,2 ngày cho <em>mỗi</em> người dùng — vì mỗi người có một muối khác nhau nên bảng không dùng chung được.</div>

<h3>Muối: vì sao cái bảng kia hết tác dụng</h3>
<p>Không có muối, một chuỗi băm bẻ được mọi người dùng đã chọn mật khẩu đó. Hãy nhìn xem bảng không muối làm rò cái gì trước cả khi bẻ được gì:</p>
<div class="out">an@vd.com      8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
binh@vd.com    f1d7e9dcf81a76784e1b759815403aa87fd15406746862d1807c8777516f3818
chi@vd.com     8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92</div>
<p>Bạn không cần bẻ gì cả cũng thấy An và Chi dùng chung mật khẩu. Giờ là cùng mật khẩu đó băm ba lần bằng bcrypt — hàm này sinh muối ngẫu nhiên mới ở mỗi lần gọi:</p>
<div class="out">bcrypt("123456") lần 1: $2b$10$MRH7iTpyMP9El9H3RnW5fO66xOCW9YM9aVJ6zlWcPd7JckvuJwz9u
bcrypt("123456") lần 2: $2b$10$fjT.b90BeGd2LC7x.ZWWhOKs1pHRqQwniP96nFT6KUbT4GSjaryJ.
bcrypt("123456") lần 3: $2b$10$sGfJY1C3L.Kf7DzOZVRFqeRDj73jX4u4eRDSRSgDBrWqe7.lv.t9G
so khớp lại: true</div>
<p>Ba chuỗi khác nhau, mà kiểm chứng vẫn chạy — vì muối được lưu <em>ngay bên trong</em> chuỗi:</p>
<div class="out">chuỗi đầy đủ : $2b$10$a7vd/4xSVvoK5VKpGGzbD.x4Y05t1q0YIRcs.YQcb4WEtp1sivisK
thuật toán   : $2b$   (2b = bcrypt)
hệ số chi phí: 10    (2^10 = 1024 vòng)
muối (22 ký tự): a7vd/4xSVvoK5VKpGGzbD.
băm  (31 ký tự): x4Y05t1q0YIRcs.YQcb4WEtp1sivisK</div>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">$2b$</span><span class="lz-d">thuật toán nào — để sau này còn chuyển đổi được</span></div>
  <div class="lz-node"><span class="lz-t">$10$</span><span class="lz-d">hệ số chi phí — để hash cũ vẫn kiểm được sau khi bạn nâng lên</span></div>
  <div class="lz-node"><span class="lz-t">muối</span><span class="lz-d">ngẫu nhiên theo từng người — triệt tiêu bảng cầu vồng dùng chung</span></div>
  <div class="lz-node"><span class="lz-t">băm</span><span class="lz-d">khoá dẫn xuất thật sự</span></div>
</div>
<p>Chính định dạng tự mô tả này là lý do bạn không bao giờ lưu muối hay cost thành cột riêng. Một cột <code>VARCHAR</code> chứa đủ mọi thứ mà <code>verify()</code> sẽ cần tới.</p>

<h3>Chọn hàm nào: argon2id, và bcrypt nếu buộc phải</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">argon2id</span><span class="v">Lựa chọn số một. Chỉnh được cả <strong>bộ nhớ</strong> chứ không chỉ thời gian — một GPU có hàng nghìn nhân nhưng không có hàng nghìn vùng nháp 19 MiB độc lập, nên chi phí bộ nhớ mới là thứ làm đau giàn bẻ khoá thật sự.</span></div>
  <div class="kv"><span class="k">bcrypt</span><span class="v">Vẫn tốt, 25 năm bị soi kỹ, có ở mọi nơi. Hai giới hạn thật: cắt cụt âm thầm ở 72 byte, và chỉ khó về CPU chứ không khó về bộ nhớ.</span></div>
  <div class="kv"><span class="k">scrypt</span><span class="v">Cũng khó về bộ nhớ, lại có sẵn trong Node (<code>crypto.scrypt</code>), không phải biên dịch module native nào. Lựa chọn hợp lý khi bạn không được thêm thư viện.</span></div>
  <div class="kv"><span class="k">PBKDF2</span><span class="v">Chỉ dùng khi một quy định tuân thủ gọi đích danh nó. Không khó bộ nhớ, cũng không hiện đại.</span></div>
</div>
<p>Mốc chuẩn 2024 của OWASP cho argon2id là <code>m=19456 KiB (19 MiB), t=2, p=1</code>, đo được 33,0 ms ở trên. Quy tắc chỉnh tham số không phải "chép một con số trên mạng về" — mà là: <strong>chọn chi phí lớn nhất mà endpoint đăng nhập của bạn còn chịu được</strong>, rồi kiểm lại trên đúng cái máy sẽ chạy nó.</p>

<h3>Phép đo 3 — chi phí đó gây ra gì khi có tải</h3>
<p>Băm không phải là năng lực miễn phí. Sáu mươi tư lượt đăng nhập cùng lúc trên chiếc laptop này:</p>
<div class="out">UV_THREADPOOL_SIZE = 4 (mặc định)
  1 đăng nhập đồng thời: tổng    30ms | p50    30ms | chậm nhất    30ms
  4 đăng nhập đồng thời: tổng    40ms | p50    39ms | chậm nhất    40ms
 16 đăng nhập đồng thời: tổng   148ms | p50   107ms | chậm nhất   148ms
 64 đăng nhập đồng thời: tổng   582ms | p50   330ms | chậm nhất   582ms</div>
<p>Đọc ra hai điều. Thứ nhất, độ trễ xuống dốc từ từ chứ không sụp đổ — đó là bể luồng libuv của chương 2 đang làm việc. Thứ hai, 64 × 19 MiB là 1,2 GB bộ nhớ nếu chúng thật sự chạy song song hết; chính bể luồng giữ con số đó trong tầm kiểm soát. Đây cũng là lý do <code>/auth/login</code> là endpoint mà kẻ tấn công sẽ dội vào để đốt CPU của bạn — bài 8.4 sẽ chặn tần suất nó.</p>

<h3>Phép đo 4 — bản đồng bộ đóng băng cả máy chủ</h3>
<p>Cả hai API đều tồn tại và tên chỉ khác nhau bốn ký tự. Khác biệt thì không hề mang tính thẩm mỹ:</p>
<pre><code><span class="tok-comment">// nhịp tim: một setInterval 50ms chạy song song, đo độ trễ</span>
<span class="tok-kw">for</span> (<span class="tok-kw">let</span> i = <span class="tok-num">0</span>; i &lt; <span class="tok-num">10</span>; i++) bcrypt.hashSync(<span class="tok-str">'pw'</span>, <span class="tok-num">12</span>);        <span class="tok-comment">// đồng bộ</span>
<span class="tok-kw">await</span> Promise.all(Array.from({ length: <span class="tok-num">10</span> }, () =&gt; bcrypt.hash(<span class="tok-str">'pw'</span>, <span class="tok-num">12</span>)));  <span class="tok-comment">// bất đồng bộ</span></code></pre>
<div class="out">bcrypt.hashSync ×10 (đồng bộ)      xong sau  3009ms | nhịp tim 50ms trễ tối đa 2959ms
bcrypt.hash ×10 (bất đồng bộ)      xong sau   978ms | nhịp tim 50ms trễ tối đa 1ms
argon2.hash ×10 (bất đồng bộ)      xong sau    94ms | nhịp tim 50ms trễ tối đa 1ms</div>
<div class="pitfall"><strong>hashSync trong một handler đóng băng mọi request khác suốt 3 giây.</strong> Mười người đăng nhập cùng lúc nghĩa là health check của bạn hết giờ và bộ cân bằng tải rút container ra khỏi vòng phục vụ. Bản bất đồng bộ chạy trên bể luồng: event loop lệch lịch tối đa 1 ms trong suốt thời gian đó. Bài học của chương 2, lần này kèm hoá đơn thật.</div>

<h3>Cái bẫy cho phép mật khẩu SAI đăng nhập được</h3>
<p>bcrypt chỉ đọc 72 <em>byte</em> đầu của đầu vào. Mọi thứ sau đó bị vứt đi trong im lặng:</p>
<pre><code><span class="tok-kw">const</span> base = <span class="tok-str">'A'</span>.repeat(<span class="tok-num">72</span>);
<span class="tok-kw">const</span> pwA = base + <span class="tok-str">'-mat-khau-that-cua-toi'</span>;
<span class="tok-kw">const</span> pwB = base + <span class="tok-str">'-KE-TAN-CONG-DOAN-BUA'</span>;
bcrypt.compareSync(pwB, bcrypt.hashSync(pwA, <span class="tok-num">10</span>));</code></pre>
<div class="out">độ dài A = 94, độ dài B = 93, 72 byte đầu giống nhau
bcrypt.compare(B, hash(A)) = true   ← ĐĂNG NHẬP ĐƯỢC bằng mật khẩu SAI
argon2.verify (không giới hạn 72 byte) = false</div>
<p>Và "72 byte" không phải "72 ký tự" một khi người dùng gõ bằng tiếng của họ:</p>
<div class="out">"Mật_khẩu_rất_dài_bằng_tiếng_Vi…"  ký tự = 70, byte = 99</div>
<div class="callout warn">Một cụm mật khẩu tiếng Việt 70 ký tự là 99 byte — bcrypt vứt đi 27 byte cuối. Nếu bạn ở lại với bcrypt, hoặc chặn độ dài mật khẩu ở 72 byte kèm thông báo lỗi rõ ràng, hoặc băm trước bằng SHA-256 rồi base64 kết quả trước khi gọi bcrypt. Đừng để nó im lặng.</div>

<h3>Cả module, đầy đủ</h3>
<pre><code><span class="tok-comment">// src/auth/password.mjs</span>
<span class="tok-kw">import</span> argon2 <span class="tok-kw">from</span> <span class="tok-str">'argon2'</span>;

<span class="tok-comment">// Tham số OWASP 2024 cho argon2id: 19 MiB bộ nhớ, 2 vòng, 1 luồng.</span>
<span class="tok-kw">const</span> OPTS = { type: argon2.argon2id, memoryCost: <span class="tok-num">19456</span>, timeCost: <span class="tok-num">2</span>, parallelism: <span class="tok-num">1</span> };

<span class="tok-kw">export const</span> hashPassword = (plain) =&gt; argon2.hash(plain, OPTS);

<span class="tok-kw">export async function</span> verifyPassword(hash, plain) {
  <span class="tok-kw">if</span> (!hash) <span class="tok-kw">return false</span>;
  <span class="tok-kw">try</span> { <span class="tok-kw">return await</span> argon2.verify(hash, plain); }
  <span class="tok-kw">catch</span> { <span class="tok-kw">return false</span>; }              <span class="tok-comment">// chuỗi băm hỏng ≠ crash 500</span>
}

<span class="tok-comment">// Một chuỗi băm "giả" để so ngay cả khi email không tồn tại</span>
<span class="tok-kw">export const</span> DUMMY_HASH = <span class="tok-kw">await</span> hashPassword(<span class="tok-str">'mat-khau-khong-bao-gio-dung-den'</span>);

<span class="tok-kw">export const</span> needsRehash = (hash) =&gt; argon2.needsRehash(hash, OPTS);</code></pre>
<p>Bốn thứ được export, và ba trong số đó tồn tại vì một sự cố cụ thể. <code>verifyPassword</code> trả <code>false</code> thay vì ném lỗi, nên một dòng dữ liệu hỏng là một lần đăng nhập thất bại chứ không phải lỗi 500. <code>needsRehash</code> được nói ở cuối bài. <code>DUMMY_HASH</code> thì ngay sau đây.</p>

<h3>Phép đo 5 — endpoint đăng nhập của bạn đang trả lời "email này có tồn tại không?"</h3>
<p>Cách viết hiển nhiên là thoát sớm khi email không tồn tại. Chính cái thoát sớm đó là một kênh phụ: nó bỏ qua bước băm đắt tiền nên trả lời nhanh hơn. Ba mươi lượt đăng nhập mỗi kiểu, lấy trung vị:</p>
<pre><code><span class="tok-comment">// BẢN LỖI</span>
<span class="tok-kw">const</span> user = <span class="tok-kw">await</span> prisma.user.findUnique({ where: { email } });
<span class="tok-kw">if</span> (!user) <span class="tok-kw">return</span> { ok: <span class="tok-kw">false</span> };            <span class="tok-comment">// ← không băm gì cả</span>
<span class="tok-kw">return</span> { ok: <span class="tok-kw">await</span> verifyPassword(user.passwordHash, password) };

<span class="tok-comment">// BẢN ĐÚNG</span>
<span class="tok-kw">const</span> user = <span class="tok-kw">await</span> prisma.user.findUnique({ where: { email } });
<span class="tok-kw">const</span> ok = <span class="tok-kw">await</span> verifyPassword(user?.passwordHash ?? DUMMY_HASH, password);
<span class="tok-kw">return</span> { ok: Boolean(user) &amp;&amp; ok };</code></pre>
<div class="out">loginNguyHiem: email KHÔNG tồn tại = 1.42ms | email CÓ tồn tại = 35.52ms | chênh 25.0×
loginAnToan  : email KHÔNG tồn tại = 34.73ms | email CÓ tồn tại = 36.62ms | chênh 1.1×</div>
<p>Chênh 25 lần thì không hề tinh vi — một đoạn script có thể phân loại một triệu địa chỉ email thành "có tài khoản ở đây" và "không có" mà chẳng cần đoán mật khẩu lần nào. Với một web app thông thường đó là rò rỉ riêng tư; với một trang hẹn hò, một cổng thông tin y tế hay một diễn đàn chính trị thì đó có thể là vấn đề an toàn của người thật.</p>
<div class="callout ok">Cùng một cách chữa, cùng một hình dạng, ở ba chỗ: thời gian giống nhau, mã trạng thái giống nhau (401), thông báo giống nhau. "Email hoặc mật khẩu không đúng" — đừng bao giờ viết "email không tồn tại".</div>

<h3>Nâng chi phí mà không phải bảo ai đổi mật khẩu</h3>
<p>Bạn chọn <code>t=2</code> vào năm 2026; tới 2029 máy móc nhanh hơn và bạn muốn <code>t=3</code>. Vì tham số nằm ngay trong mỗi chuỗi đã lưu, bạn có thể chuyển đổi từng người một, đúng vào khoảnh khắc duy nhất bạn cầm được mật khẩu gốc của họ — lúc họ đăng nhập:</p>
<pre><code><span class="tok-kw">if</span> (needsRehash(user.passwordHash)) {
  <span class="tok-kw">await</span> prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: <span class="tok-kw">await</span> hashPassword(password) },
  });
}</code></pre>
<p>Cùng mẹo đó chuyển bcrypt → argon2: kiểm bằng thuật toán mà tiền tố chuỗi đã lưu chỉ ra, rồi băm lại bằng thuật toán mới. Sau vài tháng chỉ còn sót lại cái đuôi dài những tài khoản không hoạt động, và những cái đó thì bạn cho hết hạn.</p>

<h3>Quy tắc mật khẩu nào giúp ích, quy tắc nào gây hại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên: tối thiểu 8–12 ký tự</span><span class="v">Độ dài là yêu cầu duy nhất có entropy thật đằng sau. Cho phép cụm mật khẩu dài (64+) và mọi ký tự, kể cả dấu cách và emoji.</span></div>
  <div class="kv"><span class="k">Nên: chặn mật khẩu đã lộ</span><span class="v">Đối chiếu với API k-anonymity của Have I Been Pwned — bạn chỉ gửi 5 ký tự hex đầu của SHA-1, không bao giờ gửi mật khẩu. Loại ngay vài nghìn mật khẩu phổ biến nhất.</span></div>
  <div class="kv"><span class="k">Đừng: bắt đổi mỗi 90 ngày</span><span class="v">NIST đã bỏ quy tắc này. Ép đổi định kỳ chỉ đẻ ra <code>Password1!</code> → <code>Password2!</code>. Hãy bắt đổi khi có bằng chứng lộ, không đổi theo lịch.</span></div>
  <div class="kv"><span class="k">Đừng: bắt 1 hoa 1 số 1 ký tự đặc biệt</span><span class="v">Đẩy mọi người về cùng một khuôn đoán được, mà giàn bẻ khoá thì thuộc cái khuôn đó. Độ dài cộng kiểm tra danh sách rò thắng xa quy tắc thành phần.</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Mật khẩu dùng argon2id với tham số OWASP, và chỉ băm bằng API bất đồng bộ — chính phép đo <code>hashSync</code> ở trên là lý do. Đăng nhập luôn chạy bước kiểm chứng, kể cả với email không tồn tại, nên thời gian trả lời không mang theo thông tin nào. Chuỗi đã lưu nằm trong một cột <code>passwordHash</code> kiểu <code>String?</code> — cho phép rỗng, vì tài khoản tạo qua Google OAuth không có mật khẩu nào cả, và việc <code>verifyPassword</code> trả <code>false</code> khi gặp <code>null</code> chính là thứ chặn kiểu "đăng nhập bằng mật khẩu rỗng" trên những tài khoản đó.</p>
</div>

<h3>Tóm lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mối đe doạ</span><span class="v">Kẻ tấn công ngoại tuyến cầm nguyên bảng của bạn. Thiết kế cho tình huống đó, không phải cho form đăng nhập.</span></div>
  <div class="kv"><span class="k">Nhanh = hỏng</span><span class="v">1.016.503 SHA-256/giây so với 3,1 bcrypt(12)/giây. Chậm là tính năng.</span></div>
  <div class="kv"><span class="k">Muối</span><span class="v">Riêng từng người, lưu trong chính chuỗi băm, triệt tiêu bảng dùng chung.</span></div>
  <div class="kv"><span class="k">Không bao giờ dùng bản sync</span><span class="v"><code>hashSync</code> ×10 đóng băng tiến trình 2959 ms.</span></div>
  <div class="kv"><span class="k">Câu trả lời như nhau</span><span class="v">Cùng thời gian, cùng mã trạng thái, cùng thông báo cho mọi lần đăng nhập thất bại.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-949" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 949 — Password Hashing (bcrypt)</span><span class="lc-sub">10 bài tập: băm, so khớp, cost factor, nâng cấp hash.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — JWT, refresh tokens and rotation|||8.2 — JWT, refresh token và xoay vòng',
      slug: 'nodejs-8-2-jwt-access-refresh',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-8-2-jwt-access-refresh.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-8-2-jwt-access-refresh.jpg',
        scenario: 'nodejs-jwt-refresh',
        durationSeconds: 23,
        caption: { en: "JWT, refresh tokens and rotation", vi: "JWT, refresh token và xoay vòng" },
      },
      type: 'VIDEO',
      description: 'Mổ xẻ một JWT bằng tay, thử ba đòn tấn công lên nó, rồi dựng cặp access + refresh có xoay vòng và phát hiện token bị đánh cắp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>JWT, refresh tokens and rotation</h2>
<p class="lead">Lesson 8.1 answered "is this the right password?". That question costs 33 ms and you cannot afford to ask it on every request. This lesson is about the thing you hand back instead — and about the fact that the popular answer, a JWT, has one property nobody warns you about until production: <strong>you cannot take it back</strong>. Everything else here follows from that single sentence.</p>

<h3>Two ways to remember a logged-in user</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server-side session</span><span class="v">Store the session in Redis/Postgres, send the client an opaque id. Every request looks it up. <strong>Revoking = deleting one row.</strong> Cost: a lookup per request.</span></div>
  <div class="kv"><span class="k">JWT (stateless)</span><span class="v">Sign the user's identity into the token itself. Verify with a secret, no lookup. <strong>Revoking = impossible</strong> until it expires. Cost: none per request.</span></div>
</div>
<p>Neither is "the modern one". They trade the same thing in opposite directions, and the design in this lesson deliberately uses <em>both</em>: a stateless short-lived access token for speed, and a stateful long-lived refresh token for control.</p>

<h3>A JWT, taken apart by hand</h3>
<pre><code><span class="tok-kw">const</span> token = jwt.sign({ sub: <span class="tok-str">'1'</span>, role: <span class="tok-str">'USER'</span>, tv: <span class="tok-num">0</span> }, SECRET,
  { expiresIn: <span class="tok-str">'15m'</span>, issuer: <span class="tok-str">'cuongthai-api'</span>, audience: <span class="tok-str">'cuongthai-web'</span> });
<span class="tok-kw">const</span> [h, p, s] = token.split(<span class="tok-str">'.'</span>);</code></pre>
<div class="out">header   : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
payload  : eyJzdWIiOiIxIiwicm9sZSI6IlVTRVIiLCJ0diI6MCwiaWF0IjoxNzg1MTcyNDE2LCJleHAiOjE3ODUxNzMzMTYsImF1ZCI6ImN1b25ndGhhaS13ZWIiLCJpc3MiOiJjdW9uZ3RoYWktYXBpIn0
signature: bSTHNBX71bo7BNN7cx7Rcc7C-nXU5WuI_8Vr-cZld2g
độ dài toàn token: 228 ký tự</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">header</span><span class="lz-d">which algorithm signed this</span></div>
  <div class="lz-step"><span class="lz-t">payload</span><span class="lz-d">the claims — who, when, until when</span></div>
  <div class="lz-step"><span class="lz-t">signature</span><span class="lz-d">HMAC(header.payload, secret) — proves the first two were not edited</span></div>
</div>

<h3>The single most misunderstood fact about JWT</h3>
<p>Base64url is an <em>encoding</em>, not encryption. Anyone holding the token — including the browser, including whoever reads your logs — can read every claim:</p>
<pre><code><span class="tok-kw">const</span> dec = (x) =&gt; Buffer.from(x, <span class="tok-str">'base64url'</span>).toString(<span class="tok-str">'utf8'</span>);</code></pre>
<div class="out">header  → {"alg":"HS256","typ":"JWT"}
payload → {"sub":"1","role":"USER","tv":0,"iat":1785172416,"exp":1785173316,"aud":"cuongthai-web","iss":"cuongthai-api"}
iat = 1785172416 → 2026-07-27T17:13:36.000Z
exp = 1785173316 → 2026-07-27T17:28:36.000Z (còn 900s)</div>
<div class="callout danger">A signature guarantees <strong>integrity</strong> (nobody changed it), never <strong>confidentiality</strong>. Never put anything in a JWT payload you would not print on the user's screen: no phone numbers, no addresses, no internal notes, no other user's id.</div>

<h3>Attack 1 — edit the payload</h3>
<p>The obvious attempt: change <code>role</code> to <code>ADMIN</code> and re-attach the original signature.</p>
<div class="out">payload đã sửa → {"sub":"1","role":"ADMIN","tv":0,"iat":1785172416,…}
jwt.verify → JsonWebTokenError: invalid signature</div>
<p>Blocked, and this is the part JWT genuinely does well. The signature covers <code>header.payload</code> exactly, so a single changed byte invalidates it and the attacker cannot recompute it without the secret.</p>

<h3>Attack 2 — decode instead of verify</h3>
<p>This one succeeds constantly, in real codebases, because the two functions sit next to each other in the same library and one of them checks nothing:</p>
<div class="out">jwt.decode(token giả) = {
  sub: '1',
  role: 'ADMIN',
  tv: 0,
  iat: 1785172416,
  …
}
→ role ADMIN được "đọc ra" bình thường. decode ≠ verify.</div>
<div class="pitfall"><strong><code>jwt.decode()</code> never validates the signature.</strong> It exists for reading a token you already trust — a client showing "logged in as…". If <code>decode</code> appears anywhere in your server's auth path, you have no authentication at all: anyone can hand-craft a payload. Grep for it today.</div>

<h3>Attack 3 — lie about the algorithm</h3>
<p>Two classic variants. <code>alg: "none"</code> claims the token needs no signature. Algorithm confusion is nastier: a server that verifies RS256 with a <em>public</em> key can be handed an HS256 token signed <em>with that same public key</em> — which the attacker has, because it is public.</p>
<pre><code><span class="tok-comment">// kẻ tấn công CHỈ có khoá công khai</span>
<span class="tok-kw">const</span> forged = jwt.sign({ sub: <span class="tok-str">'1'</span>, role: <span class="tok-str">'ADMIN'</span> }, publicKey, { algorithm: <span class="tok-str">'HS256'</span> });</code></pre>
<div class="out">--- Server KHÔNG chốt algorithms ---
jwt.verify → JsonWebTokenError: invalid algorithm

--- Server CÓ chốt algorithms: ["RS256"] ---
jwt.verify → JsonWebTokenError: invalid algorithm</div>
<p>Both rejected — jsonwebtoken 9 infers the permitted algorithms from the key type, so the library already closes this. Report it honestly: on this version, with this library, the attack fails either way. But the rule stands, and here is why. This is a hand-rolled verifier of the kind people write when they "don't want another dependency":</p>
<pre><code><span class="tok-kw">function</span> verifyNgayTho(token, key) {
  <span class="tok-kw">const</span> [h, p, s] = token.split(<span class="tok-str">'.'</span>);
  <span class="tok-kw">const</span> { alg } = JSON.parse(Buffer.from(h, <span class="tok-str">'base64url'</span>));
  <span class="tok-kw">if</span> (alg === <span class="tok-str">'none'</span>) <span class="tok-kw">return</span> JSON.parse(Buffer.from(p, <span class="tok-str">'base64url'</span>));    <span class="tok-comment">// lỗ 1</span>
  <span class="tok-kw">if</span> (alg === <span class="tok-str">'HS256'</span>) { <span class="tok-comment">/* HMAC bằng key … */</span> }                        <span class="tok-comment">// lỗ 2</span>
  <span class="tok-comment">/* … ngược lại: kiểm chữ ký RSA … */</span>
}</code></pre>
<div class="out">=== Bộ kiểm TỰ VIẾT (tin header.alg) — đây mới là nạn nhân thật ===
token giả HS256 → { sub: '1', role: 'ADMIN', iat: 1785172455, exp: 1785173355 }
token alg=none  → { sub: '1', role: 'ADMIN' }</div>
<p>Full admin, twice, in eleven lines of "obvious" code. The lesson is not "jsonwebtoken is safe" — it is that <strong>the algorithm must be decided by the server, never read from the token</strong>. Pin it and the class of bug disappears regardless of library version:</p>
<pre><code>jwt.verify(token, SECRET, {
  algorithms: [<span class="tok-str">'HS256'</span>],             <span class="tok-comment">// máy chủ quyết định, không đọc từ token</span>
  issuer: <span class="tok-str">'cuongthai-api'</span>,
  audience: <span class="tok-str">'cuongthai-web'</span>,
});</code></pre>
<p><code>issuer</code> and <code>audience</code> are the same idea one level up: they stop a valid token minted by a different system of yours (or by the same identity provider for a different app) from being replayed here.</p>
<div class="out">audience sai → jwt audience invalid. expected: app-khac</div>

<h3>Expiry, and the one flag that must stay off</h3>
<div class="out">sau 1,5s → TokenExpiredError: jwt expired | expiredAt = 2026-07-27T17:13:37.000Z
ignoreExpiration:true → { sub: '1', iat: 1785172416, exp: 1785172417 }</div>
<p><code>ignoreExpiration: true</code> is not a debugging convenience — it turns off the only revocation mechanism a stateless token has. There is exactly one legitimate use, and it is in a refresh flow that re-checks the account against the database anyway.</p>

<h3>What verification actually costs</h3>
<div class="out">jwt.sign   10.000 lần = 279ms → 35807 lần/giây
jwt.verify 10.000 lần = 383ms → 26113 lần/giây</div>
<p>26,113 verifications per second, against 30 argon2 hashes per second from lesson 8.1 — about <strong>870×</strong>. That ratio is the entire argument for tokens: pay the expensive question once at login, answer the cheap one on every request afterwards.</p>

<h3>The problem: you cannot take a JWT back</h3>
<p>A user is fired. You delete their account at 09:00. Their access token was signed at 08:58 with <code>exp</code> at 09:13. For fifteen minutes it verifies perfectly — correct signature, not expired — because verification never touches your database. That is not a bug in your code; it is the definition of stateless.</p>
<p>Three ways out, and the industry has settled on the third:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Blocklist every token</span><span class="v">Now you look up a store on every request. You have rebuilt sessions, but with worse ergonomics.</span></div>
  <div class="kv"><span class="k">Very long-lived tokens</span><span class="v">Convenient, and one stolen token is valid for weeks. No.</span></div>
  <div class="kv"><span class="k">Short access + long refresh</span><span class="v">Access token 15 minutes, unrevocable but nearly worthless. Refresh token 30 days, stored in your database, revocable in one <code>UPDATE</code>.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">login</span><span class="lz-d">33 ms argon2, returns access (15m) + refresh (30d)</span></div>
  <div class="lz-step"><span class="lz-t">every request</span><span class="lz-d">verify access — 0.04 ms, no database</span></div>
  <div class="lz-step"><span class="lz-t">401 expired</span><span class="lz-d">client calls /auth/refresh with the refresh token</span></div>
  <div class="lz-step"><span class="lz-t">rotate</span><span class="lz-d">old refresh marked used, new pair issued</span></div>
</div>

<h3>The refresh token is not a JWT</h3>
<p>It is checked against the database on every use, so signing it buys nothing — and a signed token you cannot revoke is exactly the problem you were escaping. Use 256 random bits, and store only its hash:</p>
<pre><code><span class="tok-kw">export const</span> newRefreshToken = () =&gt; crypto.randomBytes(<span class="tok-num">32</span>).toString(<span class="tok-str">'base64url'</span>);
<span class="tok-kw">export const</span> hashRefreshToken = (t) =&gt; crypto.createHash(<span class="tok-str">'sha256'</span>).update(t).digest(<span class="tok-str">'hex'</span>);</code></pre>
<div class="out">refresh token : svg1QpxPSTGleXXIJzHFCebQ0070YJkG90MVFjBuaA0 (43 ký tự, 256 bit ngẫu nhiên)
lưu vào CSDL  : 826e2f5a6db95a52a065561fec18ada271cf62cda2ca6070509f6a7e19c41b0c
→ rò bảng CSDL: kẻ trộm có chuỗi băm, KHÔNG có token, không đăng nhập được.</div>
<p>Plain SHA-256 is correct here, and it is not a contradiction of lesson 8.1. That lesson needed slowness because passwords are human-chosen and guessable. This value is 256 bits of <code>randomBytes</code> — there is nothing to guess, so all you need is a one-way function.</p>

<h3>The table</h3>
<pre><code><span class="tok-kw">model</span> RefreshSession {
  id        String    @id @default(uuid())
  userId    Int
  familyId  String                                <span class="tok-comment">// cả chuỗi xoay vòng của MỘT lần đăng nhập</span>
  tokenHash String    @unique                     <span class="tok-comment">// sha256, KHÔNG phải token</span>
  expiresAt DateTime
  usedAt    DateTime?                             <span class="tok-comment">// đã đổi lấy cặp mới chưa</span>
  revokedAt DateTime?
  userAgent String?   @db.VarChar(200)
  createdAt DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([familyId])
}</code></pre>
<p><code>familyId</code> is the interesting column. One login creates one family; every rotation adds a row to it. That is what makes theft detectable.</p>

<h3>Rotation, and why reuse means theft</h3>
<p>Each refresh token is single-use. Redeem it and it is marked <code>usedAt</code>; you get a new one in the same family. Now suppose an attacker copies a refresh token. Two parties hold it, and whoever refreshes second presents a token that is already used — which cannot happen in honest operation:</p>
<pre><code><span class="tok-kw">if</span> (session.usedAt || session.revokedAt) {
  <span class="tok-kw">const</span> killed = <span class="tok-kw">await</span> prisma.refreshSession.updateMany({
    where: { familyId: session.familyId, revokedAt: <span class="tok-kw">null</span> },
    data: { revokedAt: <span class="tok-kw">new</span> Date() },
  });
  <span class="tok-kw">throw new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'REFRESH_REUSE_DETECTED'</span>, …);
}</code></pre>
<p>You cannot tell which of the two is the thief, so you revoke the whole family. Both are logged out; the real user logs in again with their password, which the thief does not have. Running it against the real server:</p>
<div class="out">── 9. Refresh: đổi lấy cặp token mới
refresh cũ : RHCbHImxHOB--VPJgYj-5hNf…
refresh mới: r5GHhbTjHy50mAxEuVz9No39…   (khác nhau → đã XOAY)

── 10. Dùng LẠI refresh cũ (kịch bản token bị đánh cắp)
HTTP 401  {"error":{"code":"REFRESH_REUSE_DETECTED","message":"Phát hiện tái sử dụng refresh token — đã thu hồi cả họ (2 phiên)"}}

── 10b. Refresh MỚI (token của nạn nhân) sau khi cả họ bị thu hồi
HTTP 401  {"error":{"code":"REFRESH_REUSE_DETECTED","message":"Phát hiện tái sử dụng refresh token — đã thu hồi cả họ (0 phiên)"}}</div>
<p>And the table afterwards — one family from registration still alive, one family with both rows revoked by the detection:</p>
<div class="out">   fam    |     hash     | used | revoked 
----------+--------------+------+---------
 91accd90 | f76370bfd058 | f    | f
 9e7d363c | 4eac0fe14bee | t    | t
 9e7d363c | e577914aeebb | f    | t
(3 rows)</div>
<div class="callout ok">Read row two and three together: the token the thief replayed (<code>used=t</code>) and the legitimate new token the victim was holding (<code>used=f</code>) both end up <code>revoked=t</code>. That is the design working — the victim's inconvenience is one extra login, and the thief gets nothing.</div>

<h3>Issuing a session, in full</h3>
<pre><code><span class="tok-kw">async function</span> issueSession(user, { familyId = crypto.randomUUID(), userAgent } = {}) {
  <span class="tok-kw">const</span> refresh = newRefreshToken();
  <span class="tok-kw">await</span> prisma.refreshSession.create({
    data: {
      userId: user.id,
      familyId,
      tokenHash: hashRefreshToken(refresh),
      expiresAt: <span class="tok-kw">new</span> Date(Date.now() + REFRESH_TTL_DAYS * <span class="tok-num">86400_000</span>),
      userAgent: userAgent?.slice(<span class="tok-num">0</span>, <span class="tok-num">200</span>),
    },
  });
  <span class="tok-kw">return</span> { accessToken: signAccessToken(user), refreshToken: refresh };
}</code></pre>
<p>Login calls it with no <code>familyId</code>, so a new family starts. Refresh calls it with the existing one, so the chain continues. That two-line difference is the whole rotation mechanism.</p>
<p>Storing <code>userAgent</code> costs nothing and gives you the "active sessions" screen every serious app has: <em>Chrome on Windows · Hà Nội · 2 hours ago · [log out]</em>. Each row is one device, and logging one out is one <code>UPDATE</code>.</p>

<h3>The production incident this design prevents</h3>
<p>A real one, from this project, in July 2026. Users were being logged out silently after a day — every authenticated call returned 401 while the login cookie was clearly still in the browser. Two settings, each defensible alone:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>JWT_EXPIRES_IN=24h</code></span><span class="v">The access token died after a day.</span></div>
  <div class="kv"><span class="k"><code>backend_token</code> cookie: 7 days</span><span class="v">The cookie carrying it lived a week.</span></div>
  <div class="kv"><span class="k">No working <code>/auth/refresh</code></span><span class="v">The frontend proxy called a backend route that did not exist.</span></div>
</div>
<p>So for six of every seven days the browser faithfully sent a token the server had already declared dead, with no way to renew it. The user saw a logged-in interface where every button failed. Reproduced here with a 3-second access token so it fits on screen:</p>
<div class="out">── A. Tái hiện sự cố thật: access token 3s nhưng cookie sống 30 NGÀY
ngay sau đăng nhập : HTTP 200  {"items":[{"id":1,"title":"Ghi chu cua An",…
sau 4 giây         : HTTP 401  {"error":{"code":"TOKEN_EXPIRED","message":"jwt expired"}}
cookie vẫn còn nguyên trong máy: 1

── B. Cách chữa: bắt 401 → gọi /auth/refresh → thử lại
thử lại với token mới: HTTP 200  {"items":[{"id":1,"title":"Ghi chu cua An",…</div>
<div class="pitfall"><strong>The token lifetime and the cookie lifetime are two different clocks, and nothing keeps them in sync.</strong> Either they match exactly, or a refresh route exists to bridge the gap. Half of one and half of the other is a session that dies without ever saying so.</div>
<p>The fix on the client side is one interceptor: on 401, call refresh once, retry the original request, and if the refresh also fails, then log out for real. "Once" matters — without a flag, an expired refresh token produces an infinite retry loop.</p>

<h3>Secrets</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Length</span><span class="v">HS256 keys should be at least 32 random bytes: <code>openssl rand -base64 32</code>. A short human-typed secret is brute-forceable offline against any token you have ever issued.</span></div>
  <div class="kv"><span class="k">Location</span><span class="v">Environment variable, never the repository. Losing it is not "rotate later" — it is "anyone can mint admin tokens".</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Changing the secret invalidates every access token at once. With 15-minute tokens plus refresh, that is a bad quarter-hour, not an outage — another reason the access token is short.</span></div>
  <div class="kv"><span class="k">HS256 vs RS256</span><span class="v">HS256 (one shared secret) is right when one service signs and verifies. Move to RS256 when several services must verify but only one may sign — they get the public key, not the ability to forge.</span></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> Access tokens are HS256 with <code>issuer</code>, <code>audience</code> and <code>algorithms</code> all pinned at verification. <code>POST /api/v1/auth/refresh</code> exists precisely because of the incident above, and the axios layer on the frontend refreshes once on a 401 and replays the request, so a session repairs itself instead of dying quietly. Refresh tokens are opaque, stored as SHA-256, and rotated on every use — a stolen one buys the attacker at most a single refresh before the family is burned.</p>
</div>

<h3>Recap</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Readable</span><span class="v">The payload is encoded, not encrypted. No secrets in it, ever.</span></div>
  <div class="kv"><span class="k">decode ≠ verify</span><span class="v"><code>jwt.decode</code> checks nothing. It must not appear in server auth code.</span></div>
  <div class="kv"><span class="k">Pin the algorithm</span><span class="v">The server decides; the token never gets a vote. A hand-rolled verifier that trusted <code>header.alg</code> handed out ADMIN twice.</span></div>
  <div class="kv"><span class="k">Short + long</span><span class="v">15-minute access (26,113 verifications/s, no database) plus 30-day refresh (revocable, one row).</span></div>
  <div class="kv"><span class="k">Rotate</span><span class="v">Single-use refresh tokens turn theft into a detectable event, not a permanent one.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 951 — JSON Web Tokens (JWT)</span><span class="lc-sub">10 bài tập: ký, kiểm, claim, hết hạn, chốt thuật toán.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/authentication${REF}#module-952" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 952 — Refresh Tokens &amp; Rotation</span><span class="lc-sub">10 bài tập: xoay vòng, phát hiện tái sử dụng, thu hồi cả họ.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>JWT, refresh token và xoay vòng</h2>
<p class="lead">Bài 8.1 trả lời câu "mật khẩu này có đúng không?". Câu đó tốn 33 ms và bạn không thể hỏi nó ở mỗi request. Bài này nói về thứ bạn trao lại cho người dùng thay vào đó — và về một tính chất của JWT mà không ai cảnh báo bạn cho tới lúc lên production: <strong>bạn không thu hồi lại được nó</strong>. Mọi thứ còn lại trong bài đều suy ra từ đúng một câu đó.</p>

<h3>Hai cách nhớ rằng một người đã đăng nhập</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Phiên phía máy chủ</span><span class="v">Lưu phiên vào Redis/Postgres, gửi cho client một id mờ. Mỗi request tra một lần. <strong>Thu hồi = xoá một dòng.</strong> Cái giá: một lần tra ở mỗi request.</span></div>
  <div class="kv"><span class="k">JWT (không trạng thái)</span><span class="v">Ký danh tính người dùng vào chính token. Kiểm bằng khoá bí mật, không tra gì cả. <strong>Thu hồi = không thể</strong> cho tới khi nó hết hạn. Cái giá: bằng không ở mỗi request.</span></div>
</div>
<p>Không cái nào là "cái hiện đại" cả. Chúng đánh đổi cùng một thứ theo hai chiều ngược nhau, và thiết kế trong bài này cố tình dùng <em>cả hai</em>: một access token không trạng thái, sống ngắn, để nhanh; và một refresh token có trạng thái, sống dài, để kiểm soát.</p>

<h3>Mổ một JWT bằng tay</h3>
<pre><code><span class="tok-kw">const</span> token = jwt.sign({ sub: <span class="tok-str">'1'</span>, role: <span class="tok-str">'USER'</span>, tv: <span class="tok-num">0</span> }, SECRET,
  { expiresIn: <span class="tok-str">'15m'</span>, issuer: <span class="tok-str">'cuongthai-api'</span>, audience: <span class="tok-str">'cuongthai-web'</span> });
<span class="tok-kw">const</span> [h, p, s] = token.split(<span class="tok-str">'.'</span>);</code></pre>
<div class="out">header   : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
payload  : eyJzdWIiOiIxIiwicm9sZSI6IlVTRVIiLCJ0diI6MCwiaWF0IjoxNzg1MTcyNDE2LCJleHAiOjE3ODUxNzMzMTYsImF1ZCI6ImN1b25ndGhhaS13ZWIiLCJpc3MiOiJjdW9uZ3RoYWktYXBpIn0
signature: bSTHNBX71bo7BNN7cx7Rcc7C-nXU5WuI_8Vr-cZld2g
độ dài toàn token: 228 ký tự</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">header</span><span class="lz-d">thuật toán nào đã ký cái này</span></div>
  <div class="lz-step"><span class="lz-t">payload</span><span class="lz-d">các claim — ai, lúc nào, tới khi nào</span></div>
  <div class="lz-step"><span class="lz-t">signature</span><span class="lz-d">HMAC(header.payload, khoá bí mật) — chứng minh hai phần trên chưa bị sửa</span></div>
</div>

<h3>Điều bị hiểu nhầm nhiều nhất về JWT</h3>
<p>Base64url là một <em>cách mã hoá ký tự</em>, không phải mã hoá bảo mật. Bất kỳ ai cầm token — kể cả trình duyệt, kể cả người đọc log của bạn — đều đọc được mọi claim:</p>
<pre><code><span class="tok-kw">const</span> dec = (x) =&gt; Buffer.from(x, <span class="tok-str">'base64url'</span>).toString(<span class="tok-str">'utf8'</span>);</code></pre>
<div class="out">header  → {"alg":"HS256","typ":"JWT"}
payload → {"sub":"1","role":"USER","tv":0,"iat":1785172416,"exp":1785173316,"aud":"cuongthai-web","iss":"cuongthai-api"}
iat = 1785172416 → 2026-07-27T17:13:36.000Z
exp = 1785173316 → 2026-07-27T17:28:36.000Z (còn 900s)</div>
<div class="callout danger">Chữ ký bảo đảm <strong>tính toàn vẹn</strong> (không ai sửa được), chứ không bao giờ bảo đảm <strong>tính bí mật</strong>. Đừng bao giờ đặt vào payload của JWT thứ mà bạn không dám in ra màn hình cho người dùng xem: không số điện thoại, không địa chỉ, không ghi chú nội bộ, không id của người khác.</div>

<h3>Đòn tấn công 1 — sửa payload</h3>
<p>Cách thử hiển nhiên: đổi <code>role</code> thành <code>ADMIN</code> rồi gắn lại chữ ký cũ.</p>
<div class="out">payload đã sửa → {"sub":"1","role":"ADMIN","tv":0,"iat":1785172416,…}
jwt.verify → JsonWebTokenError: invalid signature</div>
<p>Bị chặn, và đây là phần JWT làm thật sự tốt. Chữ ký phủ đúng lên <code>header.payload</code>, nên đổi một byte là chữ ký hỏng, và kẻ tấn công không tính lại được nếu không có khoá bí mật.</p>

<h3>Đòn tấn công 2 — dùng decode thay vì verify</h3>
<p>Đòn này thành công liên tục, trong những dự án thật, vì hai hàm nằm cạnh nhau trong cùng một thư viện mà một trong hai chẳng kiểm gì cả:</p>
<div class="out">jwt.decode(token giả) = {
  sub: '1',
  role: 'ADMIN',
  tv: 0,
  iat: 1785172416,
  …
}
→ role ADMIN được "đọc ra" bình thường. decode ≠ verify.</div>
<div class="pitfall"><strong><code>jwt.decode()</code> không bao giờ kiểm chữ ký.</strong> Nó tồn tại để đọc một token mà bạn đã tin sẵn — ví dụ client hiển thị "đang đăng nhập là…". Nếu <code>decode</code> xuất hiện ở bất kỳ đâu trong đường xác thực của máy chủ, bạn không có xác thực nào cả: ai cũng tự nặn được payload. Hãy grep tìm nó ngay hôm nay.</div>

<h3>Đòn tấn công 3 — nói dối về thuật toán</h3>
<p>Hai biến thể kinh điển. <code>alg: "none"</code> tuyên bố token này không cần chữ ký. Nhầm lẫn thuật toán thì hiểm hơn: một máy chủ kiểm RS256 bằng khoá <em>công khai</em> có thể bị đưa cho một token HS256 được ký <em>bằng chính khoá công khai đó</em> — mà kẻ tấn công có, vì nó công khai.</p>
<pre><code><span class="tok-comment">// kẻ tấn công CHỈ có khoá công khai</span>
<span class="tok-kw">const</span> forged = jwt.sign({ sub: <span class="tok-str">'1'</span>, role: <span class="tok-str">'ADMIN'</span> }, publicKey, { algorithm: <span class="tok-str">'HS256'</span> });</code></pre>
<div class="out">--- Server KHÔNG chốt algorithms ---
jwt.verify → JsonWebTokenError: invalid algorithm

--- Server CÓ chốt algorithms: ["RS256"] ---
jwt.verify → JsonWebTokenError: invalid algorithm</div>
<p>Cả hai đều bị từ chối — jsonwebtoken 9 tự suy ra tập thuật toán được phép từ loại khoá, nên thư viện đã bịt sẵn lỗ này. Xin báo cáo trung thực: trên phiên bản này, với thư viện này, đòn tấn công thất bại theo cả hai đường. Nhưng quy tắc vẫn còn nguyên giá trị, và đây là lý do. Dưới đây là bộ kiểm tự viết kiểu mà người ta hay viết khi "không muốn thêm thư viện nữa":</p>
<pre><code><span class="tok-kw">function</span> verifyNgayTho(token, key) {
  <span class="tok-kw">const</span> [h, p, s] = token.split(<span class="tok-str">'.'</span>);
  <span class="tok-kw">const</span> { alg } = JSON.parse(Buffer.from(h, <span class="tok-str">'base64url'</span>));
  <span class="tok-kw">if</span> (alg === <span class="tok-str">'none'</span>) <span class="tok-kw">return</span> JSON.parse(Buffer.from(p, <span class="tok-str">'base64url'</span>));    <span class="tok-comment">// lỗ 1</span>
  <span class="tok-kw">if</span> (alg === <span class="tok-str">'HS256'</span>) { <span class="tok-comment">/* HMAC bằng key … */</span> }                        <span class="tok-comment">// lỗ 2</span>
  <span class="tok-comment">/* … ngược lại: kiểm chữ ký RSA … */</span>
}</code></pre>
<div class="out">=== Bộ kiểm TỰ VIẾT (tin header.alg) — đây mới là nạn nhân thật ===
token giả HS256 → { sub: '1', role: 'ADMIN', iat: 1785172455, exp: 1785173355 }
token alg=none  → { sub: '1', role: 'ADMIN' }</div>
<p>Quyền admin đầy đủ, hai lần, trong mười một dòng code "hiển nhiên". Bài học không phải là "jsonwebtoken an toàn" — mà là <strong>thuật toán phải do máy chủ quyết định, không bao giờ đọc từ token</strong>. Chốt nó lại thì cả lớp lỗi này biến mất bất kể phiên bản thư viện:</p>
<pre><code>jwt.verify(token, SECRET, {
  algorithms: [<span class="tok-str">'HS256'</span>],             <span class="tok-comment">// máy chủ quyết định, không đọc từ token</span>
  issuer: <span class="tok-str">'cuongthai-api'</span>,
  audience: <span class="tok-str">'cuongthai-web'</span>,
});</code></pre>
<p><code>issuer</code> và <code>audience</code> là cùng một ý tưởng ở mức cao hơn: chúng chặn một token hợp lệ do một hệ thống khác của bạn phát ra (hoặc do cùng nhà cung cấp danh tính phát cho một ứng dụng khác) bị đem sang đây dùng lại.</p>
<div class="out">audience sai → jwt audience invalid. expected: app-khac</div>

<h3>Hết hạn, và cái cờ phải luôn tắt</h3>
<div class="out">sau 1,5s → TokenExpiredError: jwt expired | expiredAt = 2026-07-27T17:13:37.000Z
ignoreExpiration:true → { sub: '1', iat: 1785172416, exp: 1785172417 }</div>
<p><code>ignoreExpiration: true</code> không phải một tiện ích để gỡ lỗi — nó tắt đi cơ chế thu hồi duy nhất mà một token không trạng thái có. Chỉ có đúng một chỗ dùng nó chính đáng, và chỗ đó nằm trong luồng refresh, nơi dù sao cũng đã kiểm lại tài khoản với cơ sở dữ liệu.</p>

<h3>Kiểm chứng thật ra tốn bao nhiêu</h3>
<div class="out">jwt.sign   10.000 lần = 279ms → 35807 lần/giây
jwt.verify 10.000 lần = 383ms → 26113 lần/giây</div>
<p>26.113 lần kiểm mỗi giây, so với 30 lần băm argon2 mỗi giây ở bài 8.1 — chênh khoảng <strong>870 lần</strong>. Chính tỉ lệ đó là toàn bộ lý lẽ của token: trả câu hỏi đắt tiền một lần lúc đăng nhập, rồi trả lời câu rẻ tiền ở mọi request sau đó.</p>

<h3>Vấn đề: bạn không lấy lại được một JWT đã phát</h3>
<p>Một nhân viên bị cho nghỉ. Bạn xoá tài khoản của họ lúc 09:00. Access token của họ được ký lúc 08:58, <code>exp</code> là 09:13. Suốt mười lăm phút nó vẫn kiểm hợp lệ hoàn hảo — đúng chữ ký, chưa hết hạn — vì bước kiểm chưa bao giờ chạm tới cơ sở dữ liệu của bạn. Đó không phải lỗi trong code của bạn; đó là định nghĩa của "không trạng thái".</p>
<p>Có ba lối thoát, và ngành đã chốt ở cái thứ ba:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Lập danh sách chặn mọi token</span><span class="v">Giờ thì bạn phải tra một kho lưu ở mỗi request. Bạn vừa dựng lại phiên máy chủ, nhưng với trải nghiệm tệ hơn.</span></div>
  <div class="kv"><span class="k">Token sống rất lâu</span><span class="v">Tiện, và một token bị đánh cắp thì hợp lệ hàng tuần. Không.</span></div>
  <div class="kv"><span class="k">Access ngắn + refresh dài</span><span class="v">Access token 15 phút, không thu hồi được nhưng gần như vô giá trị. Refresh token 30 ngày, nằm trong cơ sở dữ liệu của bạn, thu hồi bằng một câu <code>UPDATE</code>.</span></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">đăng nhập</span><span class="lz-d">33 ms argon2, trả về access (15p) + refresh (30 ngày)</span></div>
  <div class="lz-step"><span class="lz-t">mỗi request</span><span class="lz-d">kiểm access — 0,04 ms, không đụng cơ sở dữ liệu</span></div>
  <div class="lz-step"><span class="lz-t">401 hết hạn</span><span class="lz-d">client gọi /auth/refresh kèm refresh token</span></div>
  <div class="lz-step"><span class="lz-t">xoay vòng</span><span class="lz-d">refresh cũ bị đánh dấu đã dùng, phát cặp mới</span></div>
</div>

<h3>Refresh token KHÔNG phải là JWT</h3>
<p>Nó bị đối chiếu với cơ sở dữ liệu ở mỗi lần dùng, nên ký nó chẳng mua được gì — mà một token có chữ ký lại không thu hồi được thì chính là vấn đề bạn đang chạy trốn. Hãy dùng 256 bit ngẫu nhiên, và chỉ lưu chuỗi băm của nó:</p>
<pre><code><span class="tok-kw">export const</span> newRefreshToken = () =&gt; crypto.randomBytes(<span class="tok-num">32</span>).toString(<span class="tok-str">'base64url'</span>);
<span class="tok-kw">export const</span> hashRefreshToken = (t) =&gt; crypto.createHash(<span class="tok-str">'sha256'</span>).update(t).digest(<span class="tok-str">'hex'</span>);</code></pre>
<div class="out">refresh token : svg1QpxPSTGleXXIJzHFCebQ0070YJkG90MVFjBuaA0 (43 ký tự, 256 bit ngẫu nhiên)
lưu vào CSDL  : 826e2f5a6db95a52a065561fec18ada271cf62cda2ca6070509f6a7e19c41b0c
→ rò bảng CSDL: kẻ trộm có chuỗi băm, KHÔNG có token, không đăng nhập được.</div>
<p>SHA-256 trần là đúng ở đây, và nó không mâu thuẫn với bài 8.1. Bài đó cần chậm vì mật khẩu do con người chọn nên đoán được. Giá trị này là 256 bit từ <code>randomBytes</code> — chẳng có gì để đoán, nên bạn chỉ cần một hàm một chiều.</p>

<h3>Cái bảng</h3>
<pre><code><span class="tok-kw">model</span> RefreshSession {
  id        String    @id @default(uuid())
  userId    Int
  familyId  String                                <span class="tok-comment">// cả chuỗi xoay vòng của MỘT lần đăng nhập</span>
  tokenHash String    @unique                     <span class="tok-comment">// sha256, KHÔNG phải token</span>
  expiresAt DateTime
  usedAt    DateTime?                             <span class="tok-comment">// đã đổi lấy cặp mới chưa</span>
  revokedAt DateTime?
  userAgent String?   @db.VarChar(200)
  createdAt DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([familyId])
}</code></pre>
<p><code>familyId</code> là cột đáng chú ý. Một lần đăng nhập tạo ra một họ; mỗi lần xoay vòng thêm một dòng vào họ đó. Chính nó làm cho việc đánh cắp trở nên phát hiện được.</p>

<h3>Xoay vòng, và vì sao "dùng lại" nghĩa là bị trộm</h3>
<p>Mỗi refresh token chỉ dùng được một lần. Đổi nó xong là nó bị đánh dấu <code>usedAt</code>; bạn nhận về một cái mới trong cùng họ. Giờ giả sử kẻ tấn công sao chép được một refresh token. Hai bên cùng cầm nó, và bên nào refresh sau sẽ trình ra một token đã dùng rồi — chuyện không thể xảy ra trong vận hành trung thực:</p>
<pre><code><span class="tok-kw">if</span> (session.usedAt || session.revokedAt) {
  <span class="tok-kw">const</span> killed = <span class="tok-kw">await</span> prisma.refreshSession.updateMany({
    where: { familyId: session.familyId, revokedAt: <span class="tok-kw">null</span> },
    data: { revokedAt: <span class="tok-kw">new</span> Date() },
  });
  <span class="tok-kw">throw new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'REFRESH_REUSE_DETECTED'</span>, …);
}</code></pre>
<p>Bạn không phân biệt được ai trong hai bên là kẻ trộm, nên bạn thu hồi cả họ. Cả hai bị đăng xuất; người dùng thật đăng nhập lại bằng mật khẩu, thứ mà kẻ trộm không có. Chạy thật trên máy chủ:</p>
<div class="out">── 9. Refresh: đổi lấy cặp token mới
refresh cũ : RHCbHImxHOB--VPJgYj-5hNf…
refresh mới: r5GHhbTjHy50mAxEuVz9No39…   (khác nhau → đã XOAY)

── 10. Dùng LẠI refresh cũ (kịch bản token bị đánh cắp)
HTTP 401  {"error":{"code":"REFRESH_REUSE_DETECTED","message":"Phát hiện tái sử dụng refresh token — đã thu hồi cả họ (2 phiên)"}}

── 10b. Refresh MỚI (token của nạn nhân) sau khi cả họ bị thu hồi
HTTP 401  {"error":{"code":"REFRESH_REUSE_DETECTED","message":"Phát hiện tái sử dụng refresh token — đã thu hồi cả họ (0 phiên)"}}</div>
<p>Và cái bảng sau đó — một họ từ lúc đăng ký vẫn còn sống, một họ có cả hai dòng bị thu hồi bởi cơ chế phát hiện:</p>
<div class="out">   fam    |     hash     | used | revoked 
----------+--------------+------+---------
 91accd90 | f76370bfd058 | f    | f
 9e7d363c | 4eac0fe14bee | t    | t
 9e7d363c | e577914aeebb | f    | t
(3 rows)</div>
<div class="callout ok">Đọc dòng hai và dòng ba cùng nhau: token mà kẻ trộm dùng lại (<code>used=t</code>) và token mới hợp lệ mà nạn nhân đang cầm (<code>used=f</code>) đều kết thúc ở <code>revoked=t</code>. Đó là thiết kế đang chạy đúng — phiền toái của nạn nhân là đăng nhập lại một lần, còn kẻ trộm không được gì.</div>

<h3>Cấp một phiên, đầy đủ</h3>
<pre><code><span class="tok-kw">async function</span> issueSession(user, { familyId = crypto.randomUUID(), userAgent } = {}) {
  <span class="tok-kw">const</span> refresh = newRefreshToken();
  <span class="tok-kw">await</span> prisma.refreshSession.create({
    data: {
      userId: user.id,
      familyId,
      tokenHash: hashRefreshToken(refresh),
      expiresAt: <span class="tok-kw">new</span> Date(Date.now() + REFRESH_TTL_DAYS * <span class="tok-num">86400_000</span>),
      userAgent: userAgent?.slice(<span class="tok-num">0</span>, <span class="tok-num">200</span>),
    },
  });
  <span class="tok-kw">return</span> { accessToken: signAccessToken(user), refreshToken: refresh };
}</code></pre>
<p>Đăng nhập gọi nó mà không truyền <code>familyId</code>, nên một họ mới bắt đầu. Refresh gọi nó với họ sẵn có, nên chuỗi tiếp tục. Khác biệt hai dòng đó chính là toàn bộ cơ chế xoay vòng.</p>
<p>Lưu <code>userAgent</code> chẳng tốn gì mà cho bạn màn hình "phiên đang hoạt động" mà mọi ứng dụng nghiêm túc đều có: <em>Chrome trên Windows · Hà Nội · 2 giờ trước · [đăng xuất]</em>. Mỗi dòng là một thiết bị, và đăng xuất một cái là một câu <code>UPDATE</code>.</p>

<h3>Sự cố production mà thiết kế này ngăn được</h3>
<p>Một sự cố có thật, của chính dự án này, tháng 7 năm 2026. Người dùng bị đăng xuất trong im lặng sau một ngày — mọi lời gọi cần xác thực đều trả 401 trong khi cookie đăng nhập rõ ràng vẫn còn trong trình duyệt. Hai thiết lập, tách riêng ra thì cái nào cũng hợp lý:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>JWT_EXPIRES_IN=24h</code></span><span class="v">Access token chết sau một ngày.</span></div>
  <div class="kv"><span class="k">Cookie <code>backend_token</code>: 7 ngày</span><span class="v">Cái cookie chở nó thì sống một tuần.</span></div>
  <div class="kv"><span class="k">Không có <code>/auth/refresh</code> chạy được</span><span class="v">Proxy phía frontend gọi vào một route backend không tồn tại.</span></div>
</div>
<p>Thế là suốt sáu trên bảy ngày, trình duyệt trung thành gửi đi một token mà máy chủ đã tuyên bố là chết, không có cách nào gia hạn. Người dùng nhìn thấy một giao diện đang-đăng-nhập mà bấm nút nào cũng hỏng. Tái hiện ở đây với access token 3 giây cho vừa màn hình:</p>
<div class="out">── A. Tái hiện sự cố thật: access token 3s nhưng cookie sống 30 NGÀY
ngay sau đăng nhập : HTTP 200  {"items":[{"id":1,"title":"Ghi chu cua An",…
sau 4 giây         : HTTP 401  {"error":{"code":"TOKEN_EXPIRED","message":"jwt expired"}}
cookie vẫn còn nguyên trong máy: 1

── B. Cách chữa: bắt 401 → gọi /auth/refresh → thử lại
thử lại với token mới: HTTP 200  {"items":[{"id":1,"title":"Ghi chu cua An",…</div>
<div class="pitfall"><strong>Tuổi thọ của token và tuổi thọ của cookie là hai cái đồng hồ khác nhau, và không có gì tự giữ chúng khớp nhau.</strong> Hoặc chúng bằng nhau chính xác, hoặc phải có một route refresh bắc cầu qua khoảng chênh. Nửa cái này nửa cái kia là một phiên chết mà không hề báo.</div>
<p>Cách chữa ở phía client là một cái interceptor: gặp 401 thì gọi refresh MỘT lần, chạy lại request gốc, và nếu refresh cũng hỏng thì mới đăng xuất thật. Chữ "một lần" là quan trọng — không có cờ chặn, một refresh token hết hạn sẽ đẻ ra vòng lặp thử lại vô tận.</p>

<h3>Khoá bí mật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Độ dài</span><span class="v">Khoá HS256 nên tối thiểu 32 byte ngẫu nhiên: <code>openssl rand -base64 32</code>. Một chuỗi bí mật ngắn do người gõ tay có thể bị dò ngoại tuyến dựa trên bất kỳ token nào bạn từng phát.</span></div>
  <div class="kv"><span class="k">Chỗ để</span><span class="v">Biến môi trường, không bao giờ nằm trong repository. Mất nó không phải là "để sau xoay khoá" — mà là "ai cũng nặn được token admin".</span></div>
  <div class="kv"><span class="k">Xoay khoá</span><span class="v">Đổi khoá bí mật làm vô hiệu mọi access token cùng lúc. Với token 15 phút cộng refresh, đó là mười lăm phút khó chịu, không phải một sự cố ngừng dịch vụ — thêm một lý do nữa để access token ngắn.</span></div>
  <div class="kv"><span class="k">HS256 hay RS256</span><span class="v">HS256 (một khoá chung) là đúng khi chỉ một dịch vụ vừa ký vừa kiểm. Chuyển sang RS256 khi nhiều dịch vụ phải kiểm nhưng chỉ một dịch vụ được ký — chúng nhận khoá công khai, chứ không nhận được khả năng giả mạo.</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Access token dùng HS256 với <code>issuer</code>, <code>audience</code> và <code>algorithms</code> đều được chốt lúc kiểm. <code>POST /api/v1/auth/refresh</code> tồn tại chính là vì sự cố kể trên, và tầng axios phía frontend refresh một lần khi gặp 401 rồi phát lại request, nên phiên tự chữa lành thay vì chết lặng lẽ. Refresh token là chuỗi mờ, lưu dưới dạng SHA-256, và xoay vòng ở mỗi lần dùng — một cái bị đánh cắp cho kẻ tấn công nhiều nhất một lần refresh trước khi cả họ bị đốt.</p>
</div>

<h3>Tóm lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đọc được</span><span class="v">Payload chỉ được mã hoá ký tự, không được mã hoá bảo mật. Không bao giờ để bí mật trong đó.</span></div>
  <div class="kv"><span class="k">decode ≠ verify</span><span class="v"><code>jwt.decode</code> không kiểm gì cả. Nó không được phép xuất hiện trong code xác thực phía máy chủ.</span></div>
  <div class="kv"><span class="k">Chốt thuật toán</span><span class="v">Máy chủ quyết định; token không có quyền bỏ phiếu. Một bộ kiểm tự viết tin vào <code>header.alg</code> đã phát quyền ADMIN hai lần.</span></div>
  <div class="kv"><span class="k">Ngắn + dài</span><span class="v">Access 15 phút (26.113 lần kiểm/giây, không đụng CSDL) cộng refresh 30 ngày (thu hồi được, một dòng).</span></div>
  <div class="kv"><span class="k">Xoay vòng</span><span class="v">Refresh token dùng một lần biến vụ trộm thành một sự kiện phát hiện được, thay vì một thiệt hại vĩnh viễn.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-951" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 951 — JSON Web Tokens (JWT)</span><span class="lc-sub">10 bài tập: ký, kiểm, claim, hết hạn, chốt thuật toán.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/authentication${REF}#module-952" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 952 — Refresh Tokens &amp; Rotation</span><span class="lc-sub">10 bài tập: xoay vòng, phát hiện tái sử dụng, thu hồi cả họ.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — requireAuth, roles, and deleting AUTHOR_ID = 1|||8.3 — requireAuth, phân quyền, và xoá bỏ AUTHOR_ID = 1',
      slug: 'nodejs-8-3-requireauth-phan-quyen',
      simulation: {
        scenario: 'auth',
        caption: { en: 'Login, the token, and the request that gets refused', vi: 'Đăng nhập, token, và request bị từ chối' },
      },
      type: 'VIDEO',
      description: 'Viết middleware xác thực với đủ sáu nhánh thất bại, phân biệt 401 với 403, và cho Notes API chạy trên người dùng thật thay vì một hằng số.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>requireAuth, roles, and deleting AUTHOR_ID = 1</h2>
<p class="lead">There has been a lie sitting at the top of the notes service since chapter 7. One line: <code>const AUTHOR_ID = 1;</code> — every note belongs to user 1 because there was no way to know who was asking. This lesson deletes that line, and the deletion turns out to touch every function in the service, because "who is asking" is not a parameter you can bolt on at the end.</p>

<h3>Two different questions</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authentication (401)</span><span class="v"><em>Who are you?</em> Failure means "I do not know who you are" — the credentials are missing, malformed or expired. Retrying with a valid token may work.</span></div>
  <div class="kv"><span class="k">Authorization (403)</span><span class="v"><em>Are you allowed to do this?</em> Failure means "I know exactly who you are, and no." Retrying with the same token will never work.</span></div>
</div>
<p>Mixing them up produces the two most common bugs in this area: a 403 for an expired token (so the client logs the user out instead of refreshing), and a 401 for a permission problem (so the client refreshes forever against a wall).</p>

<h3>Where the token comes from</h3>
<pre><code><span class="tok-kw">function</span> readToken(req) {
  <span class="tok-kw">const</span> h = req.get(<span class="tok-str">'authorization'</span>);
  <span class="tok-kw">if</span> (h?.startsWith(<span class="tok-str">'Bearer '</span>)) <span class="tok-kw">return</span> h.slice(<span class="tok-num">7</span>);
  <span class="tok-kw">return</span> req.cookies?.access_token ?? <span class="tok-kw">null</span>;
}</code></pre>
<p>Header first, cookie as a fallback. Both are supported for a practical reason covered in 8.4: a mobile app or a server-to-server caller has no cookie jar, while a browser app is safer with an <code>HttpOnly</code> cookie. Accepting both costs three lines.</p>

<h3>The middleware, and every way it says no</h3>
<pre><code><span class="tok-kw">export async function</span> requireAuth(req, res, next) {
  <span class="tok-kw">const</span> token = readToken(req);
  <span class="tok-kw">if</span> (!token) <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'NO_TOKEN'</span>, <span class="tok-str">'Thiếu access token'</span>));

  <span class="tok-kw">let</span> payload;
  <span class="tok-kw">try</span> {
    payload = verifyAccessToken(token);
  } <span class="tok-kw">catch</span> (err) {
    <span class="tok-kw">const</span> code = err.name === <span class="tok-str">'TokenExpiredError'</span> ? <span class="tok-str">'TOKEN_EXPIRED'</span> : <span class="tok-str">'TOKEN_INVALID'</span>;
    <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, code, err.message));
  }

  <span class="tok-kw">const</span> user = <span class="tok-kw">await</span> prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { id: <span class="tok-kw">true</span>, email: <span class="tok-kw">true</span>, name: <span class="tok-kw">true</span>, role: <span class="tok-kw">true</span>, tokenVersion: <span class="tok-kw">true</span> },
  });
  <span class="tok-kw">if</span> (!user) <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'USER_GONE'</span>, <span class="tok-str">'Tài khoản không còn tồn tại'</span>));
  <span class="tok-kw">if</span> (user.tokenVersion !== payload.tv)
    <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'TOKEN_REVOKED'</span>, <span class="tok-str">'Token đã bị thu hồi'</span>));

  req.user = user;
  next();
}</code></pre>
<p>Six refusals, each with its own machine-readable <code>code</code> so the client can react differently: refresh on <code>TOKEN_EXPIRED</code>, log out on <code>TOKEN_REVOKED</code>, show a login screen on <code>NO_TOKEN</code>. Two of them are worth dwelling on.</p>

<h3>Why look the user up at all?</h3>
<p>The whole selling point of a JWT was skipping the database — and here we query it on every single request. That is deliberate, and it has a price:</p>
<div class="out">chỉ verify JWT (không trạng thái)              trung vị 0.029ms  (n=2000)
verify + findUnique(User) — bản đang dùng      trung vị 1.010ms  (n=2000)</div>
<p>35× slower, and still one millisecond — against a route that will spend 10–50 ms on its real query. What the millisecond buys:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Deleted accounts stop working immediately</span><span class="v">Not "in up to 15 minutes".</span></div>
  <div class="kv"><span class="k">Role changes take effect immediately</span><span class="v">Demote an admin and the next request is already a normal user. A role baked into the token would lie until it expired.</span></div>
  <div class="kv"><span class="k">Revocation works at all</span><span class="v"><code>tokenVersion</code> — lesson 8.4.</span></div>
</div>
<div class="callout ok">Purists will say this is no longer stateless. Correct, and worth it. The useful form of the argument is not "stateless or not" but "how stale may an authorisation decision be?" — and for role and account status the honest answer is <em>not at all</em>. At scale, cache the lookup in Redis (chapter 12) rather than remove it.</div>

<h3>Every refusal, run against the server</h3>
<div class="out">── 3. Gọi /notes KHÔNG token
HTTP 401  {"error":{"code":"NO_TOKEN","message":"Thiếu access token"}}

── 4. Token rác / token ký bằng khoá khác
HTTP 401  {"error":{"code":"TOKEN_INVALID","message":"jwt malformed"}}
HTTP 401  {"error":{"code":"TOKEN_INVALID","message":"invalid signature"}}</div>
<p>The second one is the important test, and it is worth being explicit about what it proves. That token was minted with the correct payload — <code>sub: '1'</code>, <code>role: 'ADMIN'</code>, correct issuer and audience, not expired. Everything about it is right except that it was signed with a different secret. That is the whole security boundary, and it holds.</p>

<h3>Mounting order decides whether any of this runs</h3>
<pre><code><span class="tok-kw">const</span> router = Router();
router.use(requireAuth);        <span class="tok-comment">// MỌI route ghi chú đều cần đăng nhập</span>

router.get(<span class="tok-str">'/'</span>, …);
router.post(<span class="tok-str">'/'</span>, …);</code></pre>
<div class="pitfall"><strong><code>router.use(requireAuth)</code> only protects routes declared <em>after</em> it.</strong> Express walks the stack in declaration order (chapter 5). Put the line at the bottom of the file and every route above it is public, with no error, no warning, and a test suite that still passes because the tests send a token anyway. Protect at the router level, at the top, and let individual routes opt <em>out</em> — the failure mode of forgetting is then a locked door, not an open one.</div>

<h3>Roles</h3>
<pre><code><span class="tok-kw">export const</span> requireRole = (...roles) =&gt; (req, res, next) =&gt;
  roles.includes(req.user?.role)
    ? next()
    : next(<span class="tok-kw">new</span> AppError(<span class="tok-num">403</span>, <span class="tok-str">'FORBIDDEN'</span>, <span class="tok-str">'Cần quyền '</span> + roles.join(<span class="tok-str">' hoặc '</span>)));

<span class="tok-comment">// dùng: xác thực trước, phân quyền sau — đúng thứ tự đó</span>
router.delete(<span class="tok-str">'/users/:id'</span>, requireAuth, requireRole(<span class="tok-str">'ADMIN'</span>), handler);</code></pre>
<p>A factory returning a middleware, so the role list is written where the route is. Note the order: <code>requireAuth</code> must run first, because <code>requireRole</code> reads <code>req.user</code> — reversed, every request is 403 including the admin's, and the message sends you hunting in the wrong place.</p>
<p>Two roles is enough for most applications and this course stays there. When it stops being enough, the next step is permissions rather than more roles: <code>requirePermission('note:delete:any')</code>, with roles mapping to permission sets. Adding a role to a system built on role checks means editing every route; adding one to a system built on permissions means editing one table.</p>

<h3>Now delete the lie</h3>
<pre><code><span class="tok-comment">// TRƯỚC — chương 7</span>
<span class="tok-kw">const</span> AUTHOR_ID = <span class="tok-num">1</span>;
<span class="tok-kw">export async function</span> list({ page, limit, q }) {
  <span class="tok-kw">const</span> where = { authorId: AUTHOR_ID, … };
}

<span class="tok-comment">// SAU — chương 8: actor là tham số ĐẦU TIÊN của mọi hàm</span>
<span class="tok-kw">export async function</span> list(actor, { page, limit, q }) {
  <span class="tok-kw">const</span> where = { authorId: actor.id, … };
}</code></pre>
<p>Making <code>actor</code> the first parameter of every service function is a deliberate irritation. You cannot call the function without answering "on whose behalf?", so forgetting the ownership check becomes a syntax-level mistake instead of a silent security hole. The alternative — reading a global "current user" from somewhere — is exactly how those holes appear.</p>

<h3>One rule, one place</h3>
<pre><code><span class="tok-comment">// Quy tắc quyền nằm ĐÚNG MỘT CHỖ: chủ sở hữu, hoặc ADMIN</span>
<span class="tok-kw">const</span> canTouch = (note, actor) =&gt; note.authorId === actor.id || actor.role === <span class="tok-str">'ADMIN'</span>;

<span class="tok-kw">export async function</span> get(actor, id) {
  <span class="tok-kw">const</span> note = <span class="tok-kw">await</span> prisma.note.findUnique({ where: { id } });
  <span class="tok-kw">if</span> (!note || !canTouch(note, actor)) <span class="tok-kw">return null</span>;   <span class="tok-comment">// 404, KHÔNG 403</span>
  <span class="tok-kw">return</span> note;
}
<span class="tok-kw">export async function</span> update(actor, id, patch) {
  <span class="tok-kw">if</span> (!<span class="tok-kw">await</span> get(actor, id)) <span class="tok-kw">return null</span>;
  <span class="tok-kw">const</span> { id: _i, authorId: _a, ...safe } = patch;      <span class="tok-comment">// chặn đổi chủ sở hữu qua body</span>
  <span class="tok-kw">return</span> prisma.note.update({ where: { id }, data: safe });
}
<span class="tok-kw">export async function</span> remove(actor, id) {
  <span class="tok-kw">if</span> (!<span class="tok-kw">await</span> get(actor, id)) <span class="tok-kw">return false</span>;
  <span class="tok-kw">await</span> prisma.note.delete({ where: { id } });
  <span class="tok-kw">return true</span>;
}</code></pre>
<p><code>update</code> and <code>remove</code> route their permission decision through <code>get</code>. There is one <code>canTouch</code> in the file, so the day the rule changes — shared notes, teams, a moderator role — there is one line to change and no chance of updating three of the four call sites.</p>

<h3>The vulnerability this closes, demonstrated</h3>
<p>An owns note 1. Bình is a perfectly normal logged-in user with a perfectly valid token, and simply types a different number in the URL. This class of bug has its own name — IDOR, insecure direct object reference — and it is consistently at the top of the OWASP list, because it needs no exploit code at all:</p>
<div class="out">── 6. Bình đọc ghi chú id=1 của An
HTTP 404  {"error":{"code":"NOTE_NOT_FOUND","message":"Note 1 does not exist"}}

── 6b. Bình xoá ghi chú của An
HTTP 404  {"error":{"code":"NOTE_NOT_FOUND","message":"Note 1 does not exist"}}

── 6c. Bình liệt kê /notes → chỉ thấy của mình
{"items":[],"page":1,"limit":10,"total":0}

── 6d. Admin đọc cùng ghi chú id=1
HTTP 200  {"id":1,"title":"Ghi chu cua An","slug":"note-1785172381836",…</div>
<p>Same URL, same method, three different outcomes depending on who is asking. That is authorization working.</p>

<h3>Why 404 and not 403</h3>
<p>403 says "this exists, you may not have it". Enumerate ids and you have mapped the whole database: how many notes exist, when they were created, which ids are gaps. 404 says nothing at all — indistinguishable from a note that was never there.</p>
<div class="callout warn">Use 403 when the user already knows the resource exists — a team workspace they can see but not edit. Use 404 when knowing it exists is itself information they should not have. For a private per-user resource, that is almost always the case.</div>

<h3>Two more holes in the same handler</h3>
<p>First, the request body. Bình owns note 2 and tries to hand it to An by including <code>authorId</code> in a PATCH:</p>
<div class="out">── 7. Bình đổi chủ ghi chú của mình sang An qua body (mass-assignment)
authorId sau PATCH = 2 (vẫn là Bình id=2)</div>
<p>Blocked by the destructuring line that drops <code>id</code> and <code>authorId</code> before the update. Without it, <code>data: patch</code> passes whatever the client sent straight into the <code>UPDATE</code> — and a client can send fields your form never displays. Chapter 6's zod schema is the stronger version of this defence: an allowlist rather than a denylist.</p>
<p>Second, and easier to forget because nothing looks wrong: the list query. If <code>where</code> loses its <code>authorId</code> — during a refactor, while adding a search filter — every user sees every note. No error, no failing test unless you wrote one for it. That single clause is the only thing standing between "my notes" and "everyone's notes", which is why it belongs in the service where <code>actor</code> is a required parameter, and never in the route.</p>

<h3>What the route layer looks like now</h3>
<pre><code>router.get(<span class="tok-str">'/:id'</span>, <span class="tok-kw">async</span> (req, res) =&gt; {
  <span class="tok-kw">const</span> note = <span class="tok-kw">await</span> service.get(req.user, Number(req.params.id));
  <span class="tok-kw">if</span> (!note) <span class="tok-kw">throw new</span> AppError(<span class="tok-num">404</span>, <span class="tok-str">'NOTE_NOT_FOUND'</span>, …);
  res.json(note);
});</code></pre>
<p>The route did not learn anything about permissions; it gained one argument. Everything else lives in the service, which is what makes it testable without an HTTP request: call <code>get(binh, 1)</code> and assert <code>null</code>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">requireAuth</span><span class="lz-lnote">bạn là ai — 401 nếu không biết</span></div>
  <div class="lz-layer"><span class="lz-lname">requireRole</span><span class="lz-lnote">vai trò có đủ không — 403 nếu không</span></div>
  <div class="lz-layer"><span class="lz-lname">service (canTouch)</span><span class="lz-lnote">tài nguyên CỤ THỂ này có phải của bạn không — 404 nếu không</span></div>
</div>
<p>Three layers, three questions, three status codes. The first two are middleware because they apply to whole groups of routes; the third cannot be, because it needs the row from the database.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The pattern is exactly this one, and the audit that produced it found routes where <code>requireAdmin</code> had simply been forgotten — the reason the project now protects at the router level rather than per route. The notes feature adds a fourth case on top: a note may also be reachable through a share, so <code>canTouch</code> there is "owner, admin, or has an active share". One function, still, and every handler goes through it.</p>
</div>

<h3>Recap</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">401 vs 403</span><span class="v">"I do not know you" versus "I know you and no". Different client behaviour depends on getting this right.</span></div>
  <div class="kv"><span class="k">One database lookup</span><span class="v">1.010 ms instead of 0.029 ms, and account deletion, role changes and revocation all become immediate.</span></div>
  <div class="kv"><span class="k">Order matters</span><span class="v"><code>router.use(requireAuth)</code> at the top; <code>requireAuth</code> before <code>requireRole</code>.</span></div>
  <div class="kv"><span class="k">actor first</span><span class="v">Every service function takes the caller as its first parameter. Forgetting becomes impossible rather than invisible.</span></div>
  <div class="kv"><span class="k">404 over 403</span><span class="v">For private resources, do not confirm that someone else's row exists.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-955" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 955 — Role- &amp; Permission-Based Access</span><span class="lc-sub">10 bài tập: middleware vai trò, quyền chi tiết, kiểm sở hữu.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>requireAuth, phân quyền, và xoá bỏ AUTHOR_ID = 1</h2>
<p class="lead">Có một lời nói dối nằm ở đầu file service ghi chú từ chương 7 tới giờ. Một dòng: <code>const AUTHOR_ID = 1;</code> — mọi ghi chú đều thuộc về người dùng số 1 vì chẳng có cách nào biết ai đang hỏi. Bài này xoá dòng đó đi, và hoá ra việc xoá ấy động tới mọi hàm trong service, bởi "ai đang hỏi" không phải một tham số bạn gắn thêm vào phút chót được.</p>

<h3>Hai câu hỏi khác nhau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Xác thực (401)</span><span class="v"><em>Bạn là ai?</em> Thất bại nghĩa là "tôi không biết bạn là ai" — thiếu thông tin đăng nhập, sai định dạng, hoặc hết hạn. Thử lại với token hợp lệ thì có thể được.</span></div>
  <div class="kv"><span class="k">Phân quyền (403)</span><span class="v"><em>Bạn có được phép làm việc này không?</em> Thất bại nghĩa là "tôi biết chính xác bạn là ai, và không". Thử lại với cùng token thì không bao giờ được.</span></div>
</div>
<p>Lẫn lộn hai cái này đẻ ra hai lỗi phổ biến nhất trong mảng này: trả 403 cho một token hết hạn (khiến client đăng xuất người dùng thay vì gọi refresh), và trả 401 cho một vấn đề quyền hạn (khiến client refresh mãi mãi vào một bức tường).</p>

<h3>Token đến từ đâu</h3>
<pre><code><span class="tok-kw">function</span> readToken(req) {
  <span class="tok-kw">const</span> h = req.get(<span class="tok-str">'authorization'</span>);
  <span class="tok-kw">if</span> (h?.startsWith(<span class="tok-str">'Bearer '</span>)) <span class="tok-kw">return</span> h.slice(<span class="tok-num">7</span>);
  <span class="tok-kw">return</span> req.cookies?.access_token ?? <span class="tok-kw">null</span>;
}</code></pre>
<p>Header trước, cookie là phương án dự phòng. Cả hai được hỗ trợ vì một lý do thực tế mà bài 8.4 sẽ nói: một ứng dụng di động hay một lời gọi server-to-server không có hũ cookie nào, trong khi một ứng dụng chạy trên trình duyệt thì an toàn hơn với cookie <code>HttpOnly</code>. Nhận cả hai chỉ tốn ba dòng.</p>

<h3>Middleware, và mọi cách nó nói không</h3>
<pre><code><span class="tok-kw">export async function</span> requireAuth(req, res, next) {
  <span class="tok-kw">const</span> token = readToken(req);
  <span class="tok-kw">if</span> (!token) <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'NO_TOKEN'</span>, <span class="tok-str">'Thiếu access token'</span>));

  <span class="tok-kw">let</span> payload;
  <span class="tok-kw">try</span> {
    payload = verifyAccessToken(token);
  } <span class="tok-kw">catch</span> (err) {
    <span class="tok-kw">const</span> code = err.name === <span class="tok-str">'TokenExpiredError'</span> ? <span class="tok-str">'TOKEN_EXPIRED'</span> : <span class="tok-str">'TOKEN_INVALID'</span>;
    <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, code, err.message));
  }

  <span class="tok-kw">const</span> user = <span class="tok-kw">await</span> prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { id: <span class="tok-kw">true</span>, email: <span class="tok-kw">true</span>, name: <span class="tok-kw">true</span>, role: <span class="tok-kw">true</span>, tokenVersion: <span class="tok-kw">true</span> },
  });
  <span class="tok-kw">if</span> (!user) <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'USER_GONE'</span>, <span class="tok-str">'Tài khoản không còn tồn tại'</span>));
  <span class="tok-kw">if</span> (user.tokenVersion !== payload.tv)
    <span class="tok-kw">return</span> next(<span class="tok-kw">new</span> AppError(<span class="tok-num">401</span>, <span class="tok-str">'TOKEN_REVOKED'</span>, <span class="tok-str">'Token đã bị thu hồi'</span>));

  req.user = user;
  next();
}</code></pre>
<p>Sáu lần từ chối, mỗi lần có <code>code</code> máy đọc được riêng để client phản ứng khác nhau: gọi refresh khi gặp <code>TOKEN_EXPIRED</code>, đăng xuất khi gặp <code>TOKEN_REVOKED</code>, hiện màn hình đăng nhập khi gặp <code>NO_TOKEN</code>. Có hai nhánh đáng dừng lại lâu hơn.</p>

<h3>Việc gì phải tra người dùng trong CSDL?</h3>
<p>Toàn bộ điểm hấp dẫn của JWT là bỏ qua cơ sở dữ liệu — mà ở đây ta lại truy vấn nó ở từng request một. Đó là cố ý, và nó có cái giá:</p>
<div class="out">chỉ verify JWT (không trạng thái)              trung vị 0.029ms  (n=2000)
verify + findUnique(User) — bản đang dùng      trung vị 1.010ms  (n=2000)</div>
<p>Chậm hơn 35 lần, mà vẫn chỉ là một mili-giây — trên một route sẽ tiêu 10–50 ms cho truy vấn thật của nó. Cái mili-giây đó mua được:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tài khoản bị xoá ngừng hoạt động NGAY</span><span class="v">Không phải "trong vòng 15 phút nữa".</span></div>
  <div class="kv"><span class="k">Đổi vai trò có hiệu lực NGAY</span><span class="v">Hạ quyền một admin thì request kế tiếp đã là người dùng thường. Vai trò nướng sẵn trong token sẽ nói dối cho tới lúc hết hạn.</span></div>
  <div class="kv"><span class="k">Thu hồi mới hoạt động được</span><span class="v"><code>tokenVersion</code> — bài 8.4.</span></div>
</div>
<div class="callout ok">Người theo chủ nghĩa thuần khiết sẽ nói thế này là không còn "không trạng thái" nữa. Đúng, và đáng đánh đổi. Dạng hữu ích của cuộc tranh luận không phải "có trạng thái hay không" mà là "một quyết định phân quyền được phép cũ tới mức nào?" — và với vai trò cùng tình trạng tài khoản thì câu trả lời trung thực là <em>không được cũ chút nào</em>. Khi hệ thống lớn lên, hãy cache lần tra đó vào Redis (chương 12) chứ đừng bỏ nó đi.</div>

<h3>Từng lần từ chối, chạy thật trên máy chủ</h3>
<div class="out">── 3. Gọi /notes KHÔNG token
HTTP 401  {"error":{"code":"NO_TOKEN","message":"Thiếu access token"}}

── 4. Token rác / token ký bằng khoá khác
HTTP 401  {"error":{"code":"TOKEN_INVALID","message":"jwt malformed"}}
HTTP 401  {"error":{"code":"TOKEN_INVALID","message":"invalid signature"}}</div>
<p>Cái thứ hai mới là phép thử quan trọng, và cần nói rõ nó chứng minh điều gì. Token đó được nặn ra với payload hoàn toàn đúng — <code>sub: '1'</code>, <code>role: 'ADMIN'</code>, đúng issuer và audience, chưa hết hạn. Mọi thứ ở nó đều đúng, trừ việc nó được ký bằng một khoá bí mật khác. Đó chính là toàn bộ ranh giới an toàn, và nó đứng vững.</p>

<h3>Thứ tự gắn quyết định việc này có chạy hay không</h3>
<pre><code><span class="tok-kw">const</span> router = Router();
router.use(requireAuth);        <span class="tok-comment">// MỌI route ghi chú đều cần đăng nhập</span>

router.get(<span class="tok-str">'/'</span>, …);
router.post(<span class="tok-str">'/'</span>, …);</code></pre>
<div class="pitfall"><strong><code>router.use(requireAuth)</code> chỉ bảo vệ những route khai báo <em>sau</em> nó.</strong> Express duyệt chồng theo đúng thứ tự khai báo (chương 5). Đặt dòng đó ở cuối file thì mọi route phía trên là công khai, không lỗi, không cảnh báo, và bộ test vẫn xanh vì test nào cũng gửi kèm token. Hãy bảo vệ ở mức router, đặt trên cùng, rồi cho từng route <em>xin miễn</em> — như vậy hậu quả của việc quên là một cánh cửa khoá, chứ không phải một cánh cửa mở.</div>

<h3>Vai trò</h3>
<pre><code><span class="tok-kw">export const</span> requireRole = (...roles) =&gt; (req, res, next) =&gt;
  roles.includes(req.user?.role)
    ? next()
    : next(<span class="tok-kw">new</span> AppError(<span class="tok-num">403</span>, <span class="tok-str">'FORBIDDEN'</span>, <span class="tok-str">'Cần quyền '</span> + roles.join(<span class="tok-str">' hoặc '</span>)));

<span class="tok-comment">// dùng: xác thực trước, phân quyền sau — đúng thứ tự đó</span>
router.delete(<span class="tok-str">'/users/:id'</span>, requireAuth, requireRole(<span class="tok-str">'ADMIN'</span>), handler);</code></pre>
<p>Một hàm nhà máy trả về middleware, để danh sách vai trò được viết ngay chỗ khai báo route. Chú ý thứ tự: <code>requireAuth</code> phải chạy trước, vì <code>requireRole</code> đọc <code>req.user</code> — đảo lại thì mọi request đều 403 kể cả của admin, và thông báo lỗi sẽ dắt bạn đi tìm sai chỗ.</p>
<p>Hai vai trò là đủ cho phần lớn ứng dụng và khoá học này dừng ở đó. Khi nó không còn đủ, bước tiếp theo là quyền chi tiết chứ không phải thêm vai trò: <code>requirePermission('note:delete:any')</code>, với vai trò ánh xạ sang tập quyền. Thêm một vai trò vào hệ thống xây trên kiểm-vai-trò nghĩa là sửa mọi route; thêm vai trò vào hệ thống xây trên quyền nghĩa là sửa một bảng.</p>

<h3>Giờ thì xoá lời nói dối</h3>
<pre><code><span class="tok-comment">// TRƯỚC — chương 7</span>
<span class="tok-kw">const</span> AUTHOR_ID = <span class="tok-num">1</span>;
<span class="tok-kw">export async function</span> list({ page, limit, q }) {
  <span class="tok-kw">const</span> where = { authorId: AUTHOR_ID, … };
}

<span class="tok-comment">// SAU — chương 8: actor là tham số ĐẦU TIÊN của mọi hàm</span>
<span class="tok-kw">export async function</span> list(actor, { page, limit, q }) {
  <span class="tok-kw">const</span> where = { authorId: actor.id, … };
}</code></pre>
<p>Đặt <code>actor</code> làm tham số đầu tiên của mọi hàm service là một sự khó chịu có chủ ý. Bạn không gọi được hàm mà không trả lời "thay mặt cho ai?", nên quên kiểm quyền sở hữu trở thành một lỗi ở mức cú pháp thay vì một lỗ hổng im lặng. Phương án còn lại — đọc một "người dùng hiện tại" toàn cục từ đâu đó — chính là cách những lỗ hổng ấy xuất hiện.</p>

<h3>Một quy tắc, một chỗ</h3>
<pre><code><span class="tok-comment">// Quy tắc quyền nằm ĐÚNG MỘT CHỖ: chủ sở hữu, hoặc ADMIN</span>
<span class="tok-kw">const</span> canTouch = (note, actor) =&gt; note.authorId === actor.id || actor.role === <span class="tok-str">'ADMIN'</span>;

<span class="tok-kw">export async function</span> get(actor, id) {
  <span class="tok-kw">const</span> note = <span class="tok-kw">await</span> prisma.note.findUnique({ where: { id } });
  <span class="tok-kw">if</span> (!note || !canTouch(note, actor)) <span class="tok-kw">return null</span>;   <span class="tok-comment">// 404, KHÔNG 403</span>
  <span class="tok-kw">return</span> note;
}
<span class="tok-kw">export async function</span> update(actor, id, patch) {
  <span class="tok-kw">if</span> (!<span class="tok-kw">await</span> get(actor, id)) <span class="tok-kw">return null</span>;
  <span class="tok-kw">const</span> { id: _i, authorId: _a, ...safe } = patch;      <span class="tok-comment">// chặn đổi chủ sở hữu qua body</span>
  <span class="tok-kw">return</span> prisma.note.update({ where: { id }, data: safe });
}
<span class="tok-kw">export async function</span> remove(actor, id) {
  <span class="tok-kw">if</span> (!<span class="tok-kw">await</span> get(actor, id)) <span class="tok-kw">return false</span>;
  <span class="tok-kw">await</span> prisma.note.delete({ where: { id } });
  <span class="tok-kw">return true</span>;
}</code></pre>
<p><code>update</code> và <code>remove</code> đều đưa quyết định quyền của mình đi qua <code>get</code>. Trong file chỉ có một <code>canTouch</code>, nên tới ngày quy tắc thay đổi — ghi chú chia sẻ, nhóm làm việc, vai trò kiểm duyệt — chỉ có một dòng phải sửa và không có cơ hội sửa ba trong bốn chỗ gọi.</p>

<h3>Lỗ hổng mà cách này bịt lại, chạy thật</h3>
<p>An sở hữu ghi chú số 1. Bình là một người dùng đã đăng nhập hoàn toàn bình thường với một token hoàn toàn hợp lệ, và chỉ đơn giản gõ một con số khác vào URL. Lớp lỗi này có tên riêng — IDOR, tham chiếu trực tiếp tới đối tượng không an toàn — và nó luôn nằm ở nhóm đầu danh sách OWASP, vì nó chẳng cần đoạn mã khai thác nào cả:</p>
<div class="out">── 6. Bình đọc ghi chú id=1 của An
HTTP 404  {"error":{"code":"NOTE_NOT_FOUND","message":"Note 1 does not exist"}}

── 6b. Bình xoá ghi chú của An
HTTP 404  {"error":{"code":"NOTE_NOT_FOUND","message":"Note 1 does not exist"}}

── 6c. Bình liệt kê /notes → chỉ thấy của mình
{"items":[],"page":1,"limit":10,"total":0}

── 6d. Admin đọc cùng ghi chú id=1
HTTP 200  {"id":1,"title":"Ghi chu cua An","slug":"note-1785172381836",…</div>
<p>Cùng một URL, cùng một phương thức, ba kết cục khác nhau tuỳ vào ai đang hỏi. Đó là phân quyền đang làm việc.</p>

<h3>Vì sao 404 chứ không 403</h3>
<p>403 nói "cái này có tồn tại, nhưng bạn không được lấy". Cứ dò id là bạn vẽ được cả cơ sở dữ liệu: có bao nhiêu ghi chú, chúng được tạo lúc nào, những id nào là khoảng trống. 404 thì không nói gì cả — không phân biệt được với một ghi chú chưa từng tồn tại.</p>
<div class="callout warn">Dùng 403 khi người dùng vốn đã biết tài nguyên tồn tại — một không gian làm việc của nhóm mà họ thấy được nhưng không sửa được. Dùng 404 khi bản thân việc biết nó tồn tại đã là thông tin họ không nên có. Với một tài nguyên riêng tư của từng người, gần như luôn rơi vào trường hợp sau.</div>

<h3>Hai lỗ nữa trong cùng một handler</h3>
<p>Thứ nhất là thân request. Bình sở hữu ghi chú số 2 và tìm cách sang tay nó cho An bằng cách kèm <code>authorId</code> vào PATCH:</p>
<div class="out">── 7. Bình đổi chủ ghi chú của mình sang An qua body (mass-assignment)
authorId sau PATCH = 2 (vẫn là Bình id=2)</div>
<p>Bị chặn bởi dòng destructuring vứt bỏ <code>id</code> và <code>authorId</code> trước khi cập nhật. Không có nó, <code>data: patch</code> chuyển thẳng bất cứ thứ gì client gửi vào câu <code>UPDATE</code> — mà client thì gửi được cả những trường mà biểu mẫu của bạn không bao giờ hiển thị. Lược đồ zod của chương 6 là phiên bản mạnh hơn của cách phòng thủ này: danh sách cho phép thay vì danh sách cấm.</p>
<p>Thứ hai, và dễ quên hơn vì nhìn chẳng có gì sai: câu truy vấn danh sách. Nếu <code>where</code> đánh rơi <code>authorId</code> — trong một lần tái cấu trúc, hay khi thêm bộ lọc tìm kiếm — mọi người dùng sẽ thấy mọi ghi chú. Không lỗi, không test nào đỏ trừ khi bạn từng viết test cho đúng việc đó. Đúng một mệnh đề ấy là thứ duy nhất đứng giữa "ghi chú của tôi" và "ghi chú của tất cả mọi người", nên nó phải nằm trong service nơi <code>actor</code> là tham số bắt buộc, chứ không bao giờ nằm ở route.</p>

<h3>Tầng route giờ trông thế nào</h3>
<pre><code>router.get(<span class="tok-str">'/:id'</span>, <span class="tok-kw">async</span> (req, res) =&gt; {
  <span class="tok-kw">const</span> note = <span class="tok-kw">await</span> service.get(req.user, Number(req.params.id));
  <span class="tok-kw">if</span> (!note) <span class="tok-kw">throw new</span> AppError(<span class="tok-num">404</span>, <span class="tok-str">'NOTE_NOT_FOUND'</span>, …);
  res.json(note);
});</code></pre>
<p>Route chẳng học thêm gì về quyền hạn; nó chỉ nhận thêm một đối số. Mọi thứ còn lại nằm trong service, và chính điều đó làm nó test được mà không cần một request HTTP nào: gọi <code>get(binh, 1)</code> rồi khẳng định kết quả là <code>null</code>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">requireAuth</span><span class="lz-lnote">bạn là ai — 401 nếu không biết</span></div>
  <div class="lz-layer"><span class="lz-lname">requireRole</span><span class="lz-lnote">vai trò có đủ không — 403 nếu không</span></div>
  <div class="lz-layer"><span class="lz-lname">service (canTouch)</span><span class="lz-lnote">tài nguyên CỤ THỂ này có phải của bạn không — 404 nếu không</span></div>
</div>
<p>Ba tầng, ba câu hỏi, ba mã trạng thái. Hai tầng đầu là middleware vì chúng áp cho cả nhóm route; tầng thứ ba thì không thể, vì nó cần chính dòng dữ liệu lấy từ cơ sở dữ liệu.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Khuôn mẫu đúng là cái này, và đợt rà soát sinh ra nó đã tìm thấy những route mà <code>requireAdmin</code> đơn giản là bị quên — chính là lý do dự án giờ bảo vệ ở mức router chứ không phải từng route. Tính năng ghi chú có thêm trường hợp thứ tư: một ghi chú còn có thể tới được qua một lượt chia sẻ, nên <code>canTouch</code> ở đó là "chủ sở hữu, admin, hoặc có một lượt chia sẻ còn hiệu lực". Vẫn là một hàm, và mọi handler đều đi qua nó.</p>
</div>

<h3>Tóm lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">401 và 403</span><span class="v">"Tôi không biết bạn" so với "Tôi biết bạn và không". Hành vi của client phụ thuộc vào việc phân biệt đúng.</span></div>
  <div class="kv"><span class="k">Một lần tra CSDL</span><span class="v">1,010 ms thay vì 0,029 ms, đổi lại việc xoá tài khoản, đổi vai trò và thu hồi đều có hiệu lực tức thì.</span></div>
  <div class="kv"><span class="k">Thứ tự quan trọng</span><span class="v"><code>router.use(requireAuth)</code> đặt trên cùng; <code>requireAuth</code> chạy trước <code>requireRole</code>.</span></div>
  <div class="kv"><span class="k">actor đứng đầu</span><span class="v">Mọi hàm service nhận người gọi làm tham số thứ nhất. Quên nó trở thành chuyện không thể, thay vì chuyện vô hình.</span></div>
  <div class="kv"><span class="k">404 hơn 403</span><span class="v">Với tài nguyên riêng tư, đừng xác nhận rằng dòng dữ liệu của người khác có tồn tại.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-955" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 955 — Role- &amp; Permission-Based Access</span><span class="lc-sub">10 bài tập: middleware vai trò, quyền chi tiết, kiểm sở hữu.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Cookies, CSRF, revocation and rate limiting|||8.4 — Cookie, CSRF, thu hồi phiên và chặn dò mật khẩu',
      slug: 'nodejs-8-4-cookie-csrf-thu-hoi',
      simulation: {
        scenario: 'rate-limit',
        caption: { en: 'Fixed window versus token bucket under a burst', vi: 'Cửa sổ cố định so với gáo token khi bị dội' },
      },
      type: 'VIDEO',
      description: 'Chọn chỗ cất token, hiểu CSRF bằng bốn endpoint chạy thật, đăng xuất mọi thiết bị bằng tokenVersion, và chặn dò mật khẩu đúng cách.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Cookies, CSRF, revocation and rate limiting</h2>
<p class="lead">You have a token. Now: where does the browser keep it? This looks like a storage question and is actually a security question, because the two obvious answers are vulnerable to two <em>different</em> attacks — and picking one means choosing which attack you would rather defend against. The rest of the lesson is the three operational pieces that turn a working login into a safe one.</p>

<h3>The choice, stated honestly</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">localStorage + Bearer header</span><span class="v">Immune to CSRF — the browser never attaches it automatically. Fully exposed to XSS: any injected script reads <code>localStorage</code> and posts the token anywhere.</span></div>
  <div class="kv"><span class="k">HttpOnly cookie</span><span class="v">Immune to XSS <em>theft</em> — JavaScript cannot read the value at all. Exposed to CSRF, because the browser attaches it to every request to your domain, whoever started it.</span></div>
</div>
<div class="callout warn">There is no third option that is safe against both by itself. The practical answer is: an <code>HttpOnly</code> cookie <em>plus</em> a CSRF defence. Reason: with XSS the attacker runs code in your page anyway, so a cookie at least prevents them from walking away with a token that keeps working after the user closes the tab.</div>

<h3>What the flags actually do</h3>
<div class="out">Set-Cookie: access_token=gia-lap-jwt; Path=/; HttpOnly; SameSite=Lax
Set-Cookie: csrf_token=5866ee2352054a7d4323e097c541f0bb; Path=/; SameSite=Lax</div>
<p>And what the browser stores — the <code>#HttpOnly_</code> prefix is the browser's own marker for "JavaScript may not see this":</p>
<div class="out">localhost	FALSE	/	FALSE	0	csrf_token	5866ee2352054a7d4323e097c541f0bb
#HttpOnly_localhost	FALSE	/	FALSE	0	access_token	gia-lap-jwt</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly</span><span class="v"><code>document.cookie</code> cannot read it. The single most valuable flag.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">HTTPS only. Without it the cookie travels in clear text on any http:// request — public Wi-Fi is enough.</span></div>
  <div class="kv"><span class="k">SameSite=Lax</span><span class="v">Not sent on cross-site POST/PUT/DELETE, but sent when the user clicks a link to your site — which is why logging in still feels normal. <code>Strict</code> is safer and breaks that click. <code>None</code> requires <code>Secure</code> and gives up the protection entirely.</span></div>
  <div class="kv"><span class="k">Path</span><span class="v">The refresh cookie is scoped to <code>/api/v1/auth</code>, so it is not attached to the hundreds of ordinary API calls that have no business seeing it.</span></div>
  <div class="kv"><span class="k">Max-Age</span><span class="v">Cookie lifetime — the clock that must line up with the token's own <code>exp</code> (lesson 8.2).</span></div>
</div>

<h3>CSRF, with four endpoints and a real cookie jar</h3>
<p>The scenario: you are logged into your bank in one tab. You open another site. That site's HTML contains a form that posts to the bank. Your browser attaches your bank cookies — it has no way to know the request was not your idea. In the run below, <code>curl -b jar</code> is doing exactly what the browser does: attaching cookies by domain regardless of who initiated the request.</p>
<div class="out">   evil.com → /chuyen-tien-yeu        HTTP 200  {"ok":true,"soTien":"100000000"}
   evil.com → /chuyen-tien-origin     HTTP 403  {"error":"CROSS_SITE","origin":"http://evil.com"}
   evil.com → /chuyen-tien-csrf       HTTP 403  {"error":"CSRF_TOKEN_MISMATCH"}
   evil.com → /chuyen-tien-bearer     HTTP 401  {"error":"NO_TOKEN"}</div>
<p>The first line is the attack succeeding: a hundred million đồng transferred, authenticated, with a perfectly valid session. The attacker never saw the cookie and does not need to — they only need the browser to send it. And the same four endpoints called by the real site:</p>
<div class="out">   bank    → /chuyen-tien-origin     HTTP 200  {"ok":true,"soTien":"50000"}
   bank    → /chuyen-tien-csrf       HTTP 200  {"ok":true,"soTien":"50000"}
   bank    → /chuyen-tien-bearer     HTTP 200  {"ok":true,"soTien":"50000"}</div>
<p>Three defences, in the order you should adopt them:</p>
<pre><code><span class="tok-comment">// 1) Kiểm Origin/Referer — hai dòng, chặn được đa số</span>
<span class="tok-kw">const</span> o = req.get(<span class="tok-str">'origin'</span>) ?? (req.get(<span class="tok-str">'referer'</span>) ? <span class="tok-kw">new</span> URL(req.get(<span class="tok-str">'referer'</span>)).origin : <span class="tok-kw">null</span>);
<span class="tok-kw">if</span> (o &amp;&amp; !ORIGINS.includes(o)) <span class="tok-kw">return</span> res.status(<span class="tok-num">403</span>).json({ error: <span class="tok-str">'CROSS_SITE'</span> });

<span class="tok-comment">// 2) Double-submit: header phải khớp cookie đọc-được</span>
<span class="tok-kw">const</span> c = req.cookies.csrf_token, h = req.get(<span class="tok-str">'x-csrf-token'</span>);
<span class="tok-kw">if</span> (!c || !h || c.length !== h.length ||
    !crypto.timingSafeEqual(Buffer.from(c), Buffer.from(h)))
  <span class="tok-kw">return</span> res.status(<span class="tok-num">403</span>).json({ error: <span class="tok-str">'CSRF_TOKEN_MISMATCH'</span> });</code></pre>
<p>Double-submit works because of the same-origin policy: <code>evil.com</code> can <em>cause</em> your cookies to be sent, but it can never <em>read</em> them, so it cannot copy the value into a header. Note <code>timingSafeEqual</code> rather than <code>===</code> — and note the length check before it, because <code>timingSafeEqual</code> throws on buffers of different lengths.</p>
<p>The third defence is the one you get for free: an <code>Authorization: Bearer</code> header is attached by <em>your</em> code, never by the browser. That is why a pure token API — mobile apps, server-to-server — has no CSRF surface at all. CSRF is a cookie problem, not an HTTP problem.</p>
<div class="callout ok">Order of adoption: <code>SameSite=Lax</code> on every auth cookie (one word, blocks the classic form attack), then an Origin check on every state-changing route (two lines), then double-submit tokens if you handle money or anything irreversible.</div>

<h3>Logging out, at three different sizes</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">This device</span><span class="v">Revoke one <code>RefreshSession</code> row and clear the cookie. The access token still works for up to 15 minutes — acceptable, and the reason it is short.</span></div>
  <div class="kv"><span class="k">One other device</span><span class="v">Revoke that row from the sessions screen. The <code>userAgent</code> column from 8.2 is what makes the row recognisable.</span></div>
  <div class="kv"><span class="k">Everywhere, now</span><span class="v">Password changed, or the user suspects theft. Every access token must die <em>immediately</em>, not in 15 minutes.</span></div>
</div>
<p>The last one needs something the token cannot provide by itself. The trick is a counter on the user, copied into every token as <code>tv</code> and compared on every request:</p>
<pre><code><span class="tok-kw">export async function</span> logoutEverywhere(userId) {
  <span class="tok-kw">const</span> [, user] = <span class="tok-kw">await</span> prisma.$transaction([
    prisma.refreshSession.updateMany({ where: { userId, revokedAt: <span class="tok-kw">null</span> }, data: { revokedAt: <span class="tok-kw">new</span> Date() } }),
    prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: <span class="tok-num">1</span> } } }),
  ]);
  <span class="tok-kw">return</span> user.tokenVersion;
}</code></pre>
<p>Both statements in one transaction: revoking the refresh tokens without bumping the version would leave access tokens alive, and bumping the version without revoking would let a refresh mint a new one. Run against the server, with device 1 and device 2 logged in separately:</p>
<div class="out">── C. Đăng xuất mọi thiết bị (tokenVersion)
máy 1 trước khi thu hồi: HTTP 200
gọi /auth/logout-all từ máy 2: {"ok":true,"tokenVersion":1}
máy 1 SAU khi thu hồi : HTTP 401  {"error":{"code":"TOKEN_REVOKED","message":"Token đã bị thu hồi (đăng xuất mọi thiết bị)"}}
máy 2 (kẻ gọi) SAU đó : HTTP 401  {"error":{"code":"TOKEN_REVOKED","message":"Token đã bị thu hồi (đăng xuất mọi thiết bị)"}}

 id |   email   | tokenVersion 
----+-----------+--------------
  1 | an@vd.com |            1</div>
<div class="pitfall"><strong>Read the fourth line: the device that <em>asked</em> for the logout also got logged out.</strong> Technically correct — its token carries the old <code>tv</code> too — and a terrible experience: the user clicks "log out other devices" and is thrown to the login screen. The fix is one line in the handler: after bumping the version, issue a fresh token pair for the caller and return it. Every real implementation does this, and every first implementation forgets it.</div>
<p>This is also the mechanism behind "changing your password logs you out everywhere": the password change bumps <code>tokenVersion</code>. If it does not, a thief who stole a session keeps it after the victim's defensive password change — which is the exact moment the victim was trying to lock them out.</p>

<h3>Rate limiting the one endpoint that deserves it</h3>
<p><code>/auth/login</code> is special twice over: it is where credentials are guessed, and it is where 33 ms of argon2 is spent per attempt. Both reasons point the same way.</p>
<pre><code><span class="tok-kw">const</span> buckets = <span class="tok-kw">new</span> Map();
<span class="tok-kw">const</span> WINDOW_MS = <span class="tok-num">60_000</span>, MAX = <span class="tok-num">5</span>;

<span class="tok-kw">export function</span> loginLimit(req, res, next) {
  <span class="tok-kw">const</span> key = req.ip + <span class="tok-str">'|'</span> + (req.body?.email ?? <span class="tok-str">''</span>).toLowerCase();   <span class="tok-comment">// khoá theo IP + email</span>
  <span class="tok-comment">// … đếm trong cửa sổ, đặt header RateLimit-*, 429 khi vượt …</span>
}</code></pre>
<div class="out">lần 1: HTTP 401  RateLimit-Remaining: 4
lần 2: HTTP 401  RateLimit-Remaining: 3
lần 3: HTTP 401  RateLimit-Remaining: 2
lần 4: HTTP 401  RateLimit-Remaining: 1
lần 5: HTTP 401  RateLimit-Remaining: 0
lần 6: HTTP 429  RateLimit-Remaining: 0 Retry-After: 60
lần 7: HTTP 429  RateLimit-Remaining: 0 Retry-After: 60
mật khẩu ĐÚNG khi đang bị khoá: HTTP 429
email KHÁC từ cùng IP        : HTTP 200</div>
<p>Four decisions are visible in that output, and each of them is a trade-off someone gets wrong:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Key on IP + email, not IP alone</span><span class="v">The last line proves it: a different email from the same IP still works. Otherwise one office behind one NAT locks out everybody.</span></div>
  <div class="kv"><span class="k">429, not a lockout</span><span class="v">The window expires by itself. Permanent lockout on failed attempts is a denial-of-service tool aimed at your own users — the attacker just locks every account they know.</span></div>
  <div class="kv"><span class="k">Correct password still 429</span><span class="v">Counted before verification, so the limit cannot be probed for "was that the right password?".</span></div>
  <div class="kv"><span class="k"><code>Retry-After</code></span><span class="v">Tells an honest client exactly when to come back, instead of leaving it to poll.</span></div>
</div>
<div class="pitfall"><strong><code>req.ip</code> lies behind a proxy unless you configure it, and configuring it wrongly is worse than not configuring it.</strong> Without <code>app.set('trust proxy', …)</code> every request appears to come from the proxy — one bucket for the whole internet. With it set to <code>true</code>, Express believes the <em>first</em> entry of <code>X-Forwarded-For</code>, which the client writes — so an attacker sends a fresh fake IP per request and the limit evaporates. Set the exact number of proxies you actually have, and take the entry your own proxy appended, not the leftmost one. This project shipped that bug and fixed it by keying on the <em>last</em> XFF entry.</div>
<p>The counter above lives in a <code>Map</code>, so it is per process: two containers means two independent counters and an effective limit of ten. Redis (chapter 12) is the shared version. Start with the <code>Map</code> anyway — a limit that only mostly works beats the one you postponed until the infrastructure was ready.</p>

<h3>Small things that decide whether the rest works</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Clear the cookie with the same options</span><span class="v"><code>res.clearCookie('refresh_token', { path: '/api/v1/auth' })</code>. A mismatched <code>path</code> or <code>domain</code> silently does nothing and the cookie survives your logout.</span></div>
  <div class="kv"><span class="k">Delete expired sessions</span><span class="v">The <code>RefreshSession</code> table grows forever otherwise. One nightly job (chapter 13) deleting rows past <code>expiresAt</code>.</span></div>
  <div class="kv"><span class="k">Log auth events, not credentials</span><span class="v">Log "login failed, user 42, ip x" for the security timeline. Never log the password, the token, or the refresh token — logs get shipped, indexed and read.</span></div>
  <div class="kv"><span class="k">Reset-password tokens are refresh tokens</span><span class="v">Same design: random, stored hashed, single-use, short expiry — 15 minutes, not 30 days.</span></div>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> The token travels in an <code>HttpOnly</code> cookie set by the frontend proxy, with the Bearer header accepted for non-browser callers. The rate limiter is real and has its own incident behind it: a 429 storm that looked like an outage, caused by a limit set too low combined with the <code>X-Forwarded-For</code> trap above — the fix was raising the ceiling to a sane number <em>and</em> keying on the last XFF entry, because production sits behind exactly one proxy and not Cloudflare. Sessions are listed per device on the account page, and each row can be revoked on its own.</p>
</div>

<h3>Recap</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Storage is a trade</span><span class="v">localStorage loses to XSS, cookies lose to CSRF. Pick the cookie and defend CSRF.</span></div>
  <div class="kv"><span class="k">CSRF is real</span><span class="v">A cross-site POST moved 100 million đồng with a valid session. Origin check and double-submit both stopped it.</span></div>
  <div class="kv"><span class="k">tokenVersion</span><span class="v">The one mechanism that kills a stateless token immediately — and remember to re-issue for the caller.</span></div>
  <div class="kv"><span class="k">Limit the login</span><span class="v">Key on IP + email, return 429 with <code>Retry-After</code>, and do not trust <code>req.ip</code> until you have configured the proxy.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-957" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 957 — CSRF, XSS &amp; Session Security</span><span class="lc-sub">10 bài tập: cờ cookie, double-submit, chặn kịch bản chèn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/authentication${REF}#module-958" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 958 — Rate Limiting &amp; Account Protection</span><span class="lc-sub">10 bài tập: cửa sổ trượt, khoá tài khoản, 429 và Retry-After.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Cookie, CSRF, thu hồi phiên và chặn dò mật khẩu</h2>
<p class="lead">Bạn đã có token. Giờ thì: trình duyệt cất nó ở đâu? Câu này trông như câu hỏi về chỗ lưu trữ nhưng thật ra là câu hỏi về an toàn, vì hai đáp án hiển nhiên lại dính hai đòn tấn công <em>khác nhau</em> — và chọn một cái nghĩa là chọn xem bạn muốn phòng thủ trước đòn nào hơn. Phần còn lại của bài là ba mảnh vận hành biến một hệ đăng nhập chạy được thành một hệ đăng nhập an toàn.</p>

<h3>Sự lựa chọn, nói cho thẳng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">localStorage + header Bearer</span><span class="v">Miễn nhiễm CSRF — trình duyệt không bao giờ tự đính kèm nó. Phơi hoàn toàn trước XSS: bất kỳ đoạn kịch bản chèn vào nào cũng đọc được <code>localStorage</code> và gửi token đi bất cứ đâu.</span></div>
  <div class="kv"><span class="k">Cookie HttpOnly</span><span class="v">Miễn nhiễm việc XSS <em>lấy trộm</em> — JavaScript không đọc được giá trị. Phơi trước CSRF, vì trình duyệt đính kèm nó vào mọi request tới miền của bạn, bất kể ai khởi xướng.</span></div>
</div>
<div class="callout warn">Không có phương án thứ ba nào tự nó an toàn trước cả hai. Câu trả lời thực dụng là: cookie <code>HttpOnly</code> <em>cộng thêm</em> một lớp chống CSRF. Lý do: khi đã dính XSS thì kẻ tấn công dù sao cũng chạy được mã trong trang của bạn, nên ít nhất cookie ngăn họ mang đi một token còn dùng được sau khi người dùng đóng tab.</div>

<h3>Các cờ thật sự làm gì</h3>
<div class="out">Set-Cookie: access_token=gia-lap-jwt; Path=/; HttpOnly; SameSite=Lax
Set-Cookie: csrf_token=5866ee2352054a7d4323e097c541f0bb; Path=/; SameSite=Lax</div>
<p>Và đây là thứ trình duyệt lưu lại — tiền tố <code>#HttpOnly_</code> là dấu hiệu của chính trình duyệt cho "JavaScript không được thấy cái này":</p>
<div class="out">localhost	FALSE	/	FALSE	0	csrf_token	5866ee2352054a7d4323e097c541f0bb
#HttpOnly_localhost	FALSE	/	FALSE	0	access_token	gia-lap-jwt</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly</span><span class="v"><code>document.cookie</code> không đọc được. Cái cờ giá trị nhất.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">Chỉ đi qua HTTPS. Không có nó, cookie đi ở dạng rõ trên mọi request http:// — Wi-Fi công cộng là đủ để lấy.</span></div>
  <div class="kv"><span class="k">SameSite=Lax</span><span class="v">Không gửi kèm khi POST/PUT/DELETE từ trang khác, nhưng vẫn gửi khi người dùng bấm một liên kết dẫn tới trang bạn — nhờ vậy trải nghiệm đăng nhập vẫn bình thường. <code>Strict</code> an toàn hơn nhưng làm hỏng cú bấm đó. <code>None</code> bắt buộc kèm <code>Secure</code> và từ bỏ hoàn toàn lớp bảo vệ này.</span></div>
  <div class="kv"><span class="k">Path</span><span class="v">Cookie refresh chỉ giới hạn trong <code>/api/v1/auth</code>, nên nó không bị đính kèm vào hàng trăm lời gọi API thông thường vốn chẳng có lý do gì để thấy nó.</span></div>
  <div class="kv"><span class="k">Max-Age</span><span class="v">Tuổi thọ cookie — cái đồng hồ phải khớp với <code>exp</code> của chính token (bài 8.2).</span></div>
</div>

<h3>CSRF, với bốn endpoint và một hũ cookie thật</h3>
<p>Kịch bản: bạn đang đăng nhập ngân hàng ở một tab. Bạn mở thêm một trang khác. HTML của trang đó chứa một biểu mẫu gửi POST sang ngân hàng. Trình duyệt của bạn đính kèm cookie ngân hàng — nó không có cách nào biết request đó không phải ý bạn. Trong lần chạy dưới đây, <code>curl -b jar</code> làm đúng cái mà trình duyệt làm: đính kèm cookie theo miền, bất kể ai khởi xướng request.</p>
<div class="out">   evil.com → /chuyen-tien-yeu        HTTP 200  {"ok":true,"soTien":"100000000"}
   evil.com → /chuyen-tien-origin     HTTP 403  {"error":"CROSS_SITE","origin":"http://evil.com"}
   evil.com → /chuyen-tien-csrf       HTTP 403  {"error":"CSRF_TOKEN_MISMATCH"}
   evil.com → /chuyen-tien-bearer     HTTP 401  {"error":"NO_TOKEN"}</div>
<p>Dòng đầu tiên là đòn tấn công thành công: một trăm triệu đồng được chuyển đi, có xác thực đàng hoàng, bằng một phiên hoàn toàn hợp lệ. Kẻ tấn công chưa hề nhìn thấy cookie và cũng không cần — họ chỉ cần trình duyệt gửi nó đi. Và cũng bốn endpoint đó khi chính trang ngân hàng gọi:</p>
<div class="out">   bank    → /chuyen-tien-origin     HTTP 200  {"ok":true,"soTien":"50000"}
   bank    → /chuyen-tien-csrf       HTTP 200  {"ok":true,"soTien":"50000"}
   bank    → /chuyen-tien-bearer     HTTP 200  {"ok":true,"soTien":"50000"}</div>
<p>Ba lớp phòng thủ, theo đúng thứ tự nên áp dụng:</p>
<pre><code><span class="tok-comment">// 1) Kiểm Origin/Referer — hai dòng, chặn được đa số</span>
<span class="tok-kw">const</span> o = req.get(<span class="tok-str">'origin'</span>) ?? (req.get(<span class="tok-str">'referer'</span>) ? <span class="tok-kw">new</span> URL(req.get(<span class="tok-str">'referer'</span>)).origin : <span class="tok-kw">null</span>);
<span class="tok-kw">if</span> (o &amp;&amp; !ORIGINS.includes(o)) <span class="tok-kw">return</span> res.status(<span class="tok-num">403</span>).json({ error: <span class="tok-str">'CROSS_SITE'</span> });

<span class="tok-comment">// 2) Double-submit: header phải khớp cookie đọc-được</span>
<span class="tok-kw">const</span> c = req.cookies.csrf_token, h = req.get(<span class="tok-str">'x-csrf-token'</span>);
<span class="tok-kw">if</span> (!c || !h || c.length !== h.length ||
    !crypto.timingSafeEqual(Buffer.from(c), Buffer.from(h)))
  <span class="tok-kw">return</span> res.status(<span class="tok-num">403</span>).json({ error: <span class="tok-str">'CSRF_TOKEN_MISMATCH'</span> });</code></pre>
<p>Double-submit chạy được là nhờ chính sách cùng nguồn gốc: <code>evil.com</code> có thể <em>khiến</em> cookie của bạn được gửi đi, nhưng không bao giờ <em>đọc</em> được chúng, nên không sao chép được giá trị vào header. Chú ý dùng <code>timingSafeEqual</code> chứ không phải <code>===</code> — và chú ý bước kiểm độ dài trước đó, vì <code>timingSafeEqual</code> ném lỗi khi hai buffer khác độ dài.</p>
<p>Lớp phòng thủ thứ ba thì bạn có sẵn miễn phí: header <code>Authorization: Bearer</code> do <em>code của bạn</em> đính kèm, không bao giờ do trình duyệt. Chính vì thế một API thuần token — ứng dụng di động, gọi server sang server — không có bề mặt CSRF nào cả. CSRF là vấn đề của cookie, không phải vấn đề của HTTP.</p>
<div class="callout ok">Thứ tự nên làm: <code>SameSite=Lax</code> cho mọi cookie xác thực (một từ, chặn đòn form kinh điển), rồi kiểm Origin ở mọi route làm thay đổi trạng thái (hai dòng), rồi mới tới double-submit nếu bạn xử lý tiền hoặc bất cứ thứ gì không hoàn tác được.</div>

<h3>Đăng xuất, ở ba cỡ khác nhau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Thiết bị này</span><span class="v">Thu hồi một dòng <code>RefreshSession</code> và xoá cookie. Access token vẫn chạy được tối đa 15 phút — chấp nhận được, và đó là lý do nó ngắn.</span></div>
  <div class="kv"><span class="k">Một thiết bị khác</span><span class="v">Thu hồi dòng đó từ màn hình danh sách phiên. Cột <code>userAgent</code> ở bài 8.2 là thứ làm cho dòng đó nhận ra được.</span></div>
  <div class="kv"><span class="k">Mọi nơi, ngay lập tức</span><span class="v">Vừa đổi mật khẩu, hoặc người dùng nghi bị đánh cắp. Mọi access token phải chết <em>ngay</em>, không phải sau 15 phút.</span></div>
</div>
<p>Cái cuối cần một thứ mà bản thân token không cung cấp được. Mẹo là một bộ đếm gắn trên người dùng, chép vào mọi token dưới tên <code>tv</code>, và đối chiếu ở mọi request:</p>
<pre><code><span class="tok-kw">export async function</span> logoutEverywhere(userId) {
  <span class="tok-kw">const</span> [, user] = <span class="tok-kw">await</span> prisma.$transaction([
    prisma.refreshSession.updateMany({ where: { userId, revokedAt: <span class="tok-kw">null</span> }, data: { revokedAt: <span class="tok-kw">new</span> Date() } }),
    prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: <span class="tok-num">1</span> } } }),
  ]);
  <span class="tok-kw">return</span> user.tokenVersion;
}</code></pre>
<p>Cả hai câu lệnh nằm trong một transaction: thu hồi refresh token mà không tăng phiên bản sẽ để access token còn sống, còn tăng phiên bản mà không thu hồi thì một lần refresh sẽ nặn ra cái mới. Chạy thật trên máy chủ, với máy 1 và máy 2 đăng nhập riêng:</p>
<div class="out">── C. Đăng xuất mọi thiết bị (tokenVersion)
máy 1 trước khi thu hồi: HTTP 200
gọi /auth/logout-all từ máy 2: {"ok":true,"tokenVersion":1}
máy 1 SAU khi thu hồi : HTTP 401  {"error":{"code":"TOKEN_REVOKED","message":"Token đã bị thu hồi (đăng xuất mọi thiết bị)"}}
máy 2 (kẻ gọi) SAU đó : HTTP 401  {"error":{"code":"TOKEN_REVOKED","message":"Token đã bị thu hồi (đăng xuất mọi thiết bị)"}}

 id |   email   | tokenVersion 
----+-----------+--------------
  1 | an@vd.com |            1</div>
<div class="pitfall"><strong>Đọc dòng thứ tư: chính cái máy <em>ra lệnh</em> đăng xuất cũng bị đăng xuất luôn.</strong> Về kỹ thuật là đúng — token của nó cũng mang <code>tv</code> cũ — và về trải nghiệm là tệ hại: người dùng bấm "đăng xuất các thiết bị khác" rồi bị ném về màn hình đăng nhập. Cách chữa là một dòng trong handler: sau khi tăng phiên bản, phát một cặp token mới cho chính người gọi và trả về. Mọi bản triển khai thật đều làm thế, và mọi bản triển khai đầu tiên đều quên.</div>
<p>Đây cũng là cơ chế đứng sau câu "đổi mật khẩu là đăng xuất khỏi mọi nơi": việc đổi mật khẩu tăng <code>tokenVersion</code>. Nếu không, kẻ trộm đã cướp được một phiên vẫn giữ nguyên phiên đó sau khi nạn nhân đổi mật khẩu phòng thủ — đúng vào khoảnh khắc nạn nhân đang cố khoá họ ra ngoài.</p>

<h3>Chặn tần suất ở đúng cái endpoint xứng đáng</h3>
<p><code>/auth/login</code> đặc biệt vì hai lẽ: đó là nơi thông tin đăng nhập bị đoán, và cũng là nơi mỗi lần thử tiêu 33 ms argon2. Cả hai lý do đều chỉ về một hướng.</p>
<pre><code><span class="tok-kw">const</span> buckets = <span class="tok-kw">new</span> Map();
<span class="tok-kw">const</span> WINDOW_MS = <span class="tok-num">60_000</span>, MAX = <span class="tok-num">5</span>;

<span class="tok-kw">export function</span> loginLimit(req, res, next) {
  <span class="tok-kw">const</span> key = req.ip + <span class="tok-str">'|'</span> + (req.body?.email ?? <span class="tok-str">''</span>).toLowerCase();   <span class="tok-comment">// khoá theo IP + email</span>
  <span class="tok-comment">// … đếm trong cửa sổ, đặt header RateLimit-*, 429 khi vượt …</span>
}</code></pre>
<div class="out">lần 1: HTTP 401  RateLimit-Remaining: 4
lần 2: HTTP 401  RateLimit-Remaining: 3
lần 3: HTTP 401  RateLimit-Remaining: 2
lần 4: HTTP 401  RateLimit-Remaining: 1
lần 5: HTTP 401  RateLimit-Remaining: 0
lần 6: HTTP 429  RateLimit-Remaining: 0 Retry-After: 60
lần 7: HTTP 429  RateLimit-Remaining: 0 Retry-After: 60
mật khẩu ĐÚNG khi đang bị khoá: HTTP 429
email KHÁC từ cùng IP        : HTTP 200</div>
<p>Trong đoạn kết quả đó có bốn quyết định, và cái nào cũng là một đánh đổi mà người ta hay làm sai:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá theo IP + email, không chỉ IP</span><span class="v">Dòng cuối chứng minh: một email khác từ cùng IP vẫn vào được. Nếu không, cả một văn phòng sau một NAT sẽ bị khoá chung.</span></div>
  <div class="kv"><span class="k">429, không phải khoá tài khoản</span><span class="v">Cửa sổ tự hết hạn. Khoá vĩnh viễn khi sai mật khẩu là một công cụ từ chối dịch vụ nhắm vào chính người dùng của bạn — kẻ tấn công chỉ việc khoá mọi tài khoản mà họ biết.</span></div>
  <div class="kv"><span class="k">Mật khẩu đúng vẫn 429</span><span class="v">Đếm trước khi kiểm chứng, nên không thể dò cái giới hạn này để biết "vừa rồi có phải mật khẩu đúng không?".</span></div>
  <div class="kv"><span class="k"><code>Retry-After</code></span><span class="v">Nói cho một client trung thực biết chính xác khi nào quay lại, thay vì để nó ngồi dò liên tục.</span></div>
</div>
<div class="pitfall"><strong><code>req.ip</code> nói dối khi đứng sau proxy nếu bạn không cấu hình, và cấu hình sai còn tệ hơn không cấu hình.</strong> Không có <code>app.set('trust proxy', …)</code> thì mọi request trông như đến từ proxy — một cái rổ đếm cho cả internet. Đặt nó thành <code>true</code> thì Express tin vào phần tử <em>đầu tiên</em> của <code>X-Forwarded-For</code>, mà phần tử đó do client ghi — nên kẻ tấn công gửi một IP giả mới ở mỗi request và cái giới hạn bốc hơi. Hãy khai đúng số proxy bạn thật sự có, và lấy phần tử do chính proxy của bạn nối vào, không phải phần tử ngoài cùng bên trái. Dự án này từng dính đúng lỗi đó và sửa bằng cách khoá theo phần tử <em>cuối</em> của XFF.</div>
<p>Bộ đếm ở trên nằm trong một <code>Map</code>, nên nó riêng cho từng tiến trình: hai container nghĩa là hai bộ đếm độc lập và giới hạn thực tế là mười. Redis (chương 12) là bản dùng chung. Nhưng cứ bắt đầu bằng <code>Map</code> đã — một giới hạn chỉ đúng phần lớn thời gian vẫn hơn cái giới hạn bạn hoãn lại cho tới khi hạ tầng sẵn sàng.</p>

<h3>Những thứ nhỏ quyết định phần còn lại có chạy hay không</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Xoá cookie phải cùng tuỳ chọn</span><span class="v"><code>res.clearCookie('refresh_token', { path: '/api/v1/auth' })</code>. Lệch <code>path</code> hay <code>domain</code> là lệnh xoá không làm gì cả trong im lặng, và cookie sống sót qua cả cú đăng xuất.</span></div>
  <div class="kv"><span class="k">Dọn phiên đã hết hạn</span><span class="v">Không thì bảng <code>RefreshSession</code> phình mãi. Một tác vụ chạy đêm (chương 13) xoá các dòng quá <code>expiresAt</code>.</span></div>
  <div class="kv"><span class="k">Ghi log sự kiện, không ghi thông tin đăng nhập</span><span class="v">Ghi "đăng nhập thất bại, user 42, ip x" để có dòng thời gian an ninh. Không bao giờ ghi mật khẩu, token hay refresh token — log bị chuyển đi, đánh chỉ mục và có người đọc.</span></div>
  <div class="kv"><span class="k">Token đặt lại mật khẩu chính là refresh token</span><span class="v">Cùng thiết kế: ngẫu nhiên, lưu dạng băm, dùng một lần, hạn ngắn — 15 phút chứ không phải 30 ngày.</span></div>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Token đi trong một cookie <code>HttpOnly</code> do proxy phía frontend đặt, đồng thời vẫn nhận header Bearer cho những bên gọi không phải trình duyệt. Bộ chặn tần suất là thật và có sự cố riêng của nó: một trận bão 429 trông như sập dịch vụ, do đặt giới hạn quá thấp cộng với đúng cái bẫy <code>X-Forwarded-For</code> ở trên — cách chữa là nâng trần lên mức hợp lý <em>và</em> khoá theo phần tử cuối của XFF, vì production nằm sau đúng một proxy chứ không nằm sau Cloudflare. Danh sách phiên hiển thị theo từng thiết bị ở trang tài khoản, và mỗi dòng thu hồi được riêng.</p>
</div>

<h3>Tóm lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỗ cất là một đánh đổi</span><span class="v">localStorage thua XSS, cookie thua CSRF. Hãy chọn cookie rồi phòng thủ CSRF.</span></div>
  <div class="kv"><span class="k">CSRF là chuyện có thật</span><span class="v">Một POST từ trang khác đã chuyển 100 triệu đồng bằng một phiên hợp lệ. Kiểm Origin và double-submit đều chặn được.</span></div>
  <div class="kv"><span class="k">tokenVersion</span><span class="v">Cơ chế duy nhất giết được một token không trạng thái ngay lập tức — và nhớ phát lại token cho chính người gọi.</span></div>
  <div class="kv"><span class="k">Chặn tần suất đăng nhập</span><span class="v">Khoá theo IP + email, trả 429 kèm <code>Retry-After</code>, và đừng tin <code>req.ip</code> cho tới khi bạn đã cấu hình proxy.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/authentication${REF}#module-957" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 957 — CSRF, XSS &amp; Session Security</span><span class="lc-sub">10 bài tập: cờ cookie, double-submit, chặn kịch bản chèn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/authentication${REF}#module-958" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 958 — Rate Limiting &amp; Account Protection</span><span class="lc-sub">10 bài tập: cửa sổ trượt, khoá tài khoản, 429 và Retry-After.</span></span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — Chapter 8 quiz|||8.5 — Kiểm tra chương 8',
      slug: 'nodejs-8-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về băm mật khẩu, JWT, xoay vòng refresh, phân quyền, CSRF và thu hồi phiên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question here is settled by an output block in lessons 8.1 to 8.4 — a measured number or a real HTTP response, not an opinion. If a question feels like a coin flip, go back and read the block rather than the prose around it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu ở đây đều được phân định bởi một khối kết quả trong bài 8.1 tới 8.4 — một con số đo được hoặc một phản hồi HTTP thật, không phải quan điểm. Câu nào bạn thấy như tung đồng xu thì hãy quay lại đọc đúng khối kết quả đó, đừng đọc phần văn xuôi quanh nó.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'One core did 1,016,503 SHA-256 hashes per second and 3.1 bcrypt(cost=12) hashes per second. Why is the slow one the correct choice for passwords?|||Một nhân CPU chạy được 1.016.503 lần băm SHA-256 mỗi giây và 3,1 lần bcrypt(cost=12) mỗi giây. Vì sao cái chậm mới là lựa chọn đúng cho mật khẩu?',
            options: [
              'Slower hashing produces a longer, harder-to-reverse output|||Băm chậm cho ra chuỗi kết quả dài hơn, khó giải ngược hơn',
              'The attacker has your table offline, so their cost per guess is what protects the users — 1,000,000 candidates took 1.8s with SHA-256 and 4.2 days with bcrypt|||Kẻ tấn công đã có bảng của bạn và làm ngoại tuyến, nên chi phí mỗi lần đoán của họ mới là thứ bảo vệ người dùng — 1.000.000 ứng viên mất 1,8 giây với SHA-256 và 4,2 ngày với bcrypt',
              'Slow hashing rate-limits the login endpoint automatically|||Băm chậm tự động chặn tần suất cho endpoint đăng nhập',
              'SHA-256 can be reversed, bcrypt cannot|||SHA-256 giải ngược được, còn bcrypt thì không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two passwords share their first 72 bytes and differ afterwards. bcrypt.compare(passwordB, hash(passwordA)) returned true. What is the correct response to this?|||Hai mật khẩu giống nhau ở 72 byte đầu và khác nhau ở phần sau. bcrypt.compare(mậtKhẩuB, hash(mậtKhẩuA)) trả về true. Phản ứng đúng với chuyện này là gì?',
            options: [
              'Nothing — 72 bytes is more than enough entropy anyway|||Không cần làm gì — 72 byte thì dù sao cũng thừa entropy rồi',
              'Hash the password twice with bcrypt to cover the full length|||Băm mật khẩu hai lần bằng bcrypt để phủ hết độ dài',
              'bcrypt silently truncates at 72 bytes: either reject longer input explicitly, pre-hash with SHA-256 first, or use argon2id which has no such limit|||bcrypt cắt cụt âm thầm ở 72 byte: hoặc từ chối đầu vào dài hơn một cách rõ ràng, hoặc băm trước bằng SHA-256, hoặc dùng argon2id vốn không có giới hạn đó',
              'Increase the cost factor from 10 to 12|||Nâng hệ số chi phí từ 10 lên 12',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Login took 1.42ms for an email that does not exist and 35.52ms for one that does. What is leaking, and what is the fix?|||Đăng nhập mất 1,42ms với email không tồn tại và 35,52ms với email có tồn tại. Cái gì đang rò rỉ, và cách chữa là gì?',
            options: [
              'Nothing leaks; the difference is just database caching|||Không rò gì cả; chênh lệch chỉ là do cơ sở dữ liệu cache',
              'The password is leaking; fix it by hashing on the client|||Mật khẩu đang rò; chữa bằng cách băm ở phía client',
              'Account existence is leaking; fix it by adding a random delay to every login|||Việc tài khoản có tồn tại hay không đang rò; chữa bằng cách thêm độ trễ ngẫu nhiên vào mọi lần đăng nhập',
              'Account existence is leaking; fix it by always running the verification, comparing against a dummy hash when the email is unknown|||Việc tài khoản có tồn tại hay không đang rò; chữa bằng cách luôn chạy bước kiểm chứng, so với một chuỗi băm giả khi email không tồn tại',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Base64-decoding a JWT payload printed {"sub":"1","role":"USER","tv":0,…} in clear text. What does that tell you about what may go in a token?|||Giải base64 phần payload của một JWT in ra {"sub":"1","role":"USER","tv":0,…} ở dạng chữ rõ. Điều đó cho bạn biết gì về những thứ được phép đặt vào token?',
            options: [
              'Nothing sensitive: the signature protects integrity, never confidentiality — anyone holding the token reads every claim|||Không được đặt gì nhạy cảm: chữ ký bảo vệ tính toàn vẹn, không bao giờ bảo vệ tính bí mật — ai cầm token cũng đọc được mọi claim',
              'Anything is fine as long as the secret is strong|||Đặt gì cũng được, miễn là khoá bí mật đủ mạnh',
              'Anything is fine because the payload is encrypted with the secret|||Đặt gì cũng được vì payload đã được mã hoá bằng khoá bí mật',
              'Only strings are readable; numbers and objects stay hidden|||Chỉ chuỗi mới đọc được; số và object thì vẫn bị ẩn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A forged token with role: "ADMIN" made jwt.verify throw "invalid signature", but jwt.decode returned the ADMIN payload without complaint. What is the rule?|||Một token giả mạo có role: "ADMIN" khiến jwt.verify ném lỗi "invalid signature", nhưng jwt.decode lại trả về payload ADMIN mà không kêu ca gì. Quy tắc rút ra là gì?',
            options: [
              'decode is the fast path; use it when performance matters|||decode là đường đi nhanh; dùng nó khi cần hiệu năng',
              'decode does not check the signature at all — it must never appear in server-side auth code|||decode hoàn toàn không kiểm chữ ký — nó không được phép xuất hiện trong code xác thực phía máy chủ',
              'decode is safe as long as you also check the exp claim yourself|||decode an toàn miễn là bạn tự kiểm thêm claim exp',
              'Both are equivalent; verify only adds the issuer and audience checks|||Hai hàm tương đương nhau; verify chỉ thêm phần kiểm issuer và audience',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A refresh token that had already been rotated was presented again. The server answered 401 REFRESH_REUSE_DETECTED and revoked 2 sessions. Why revoke the victim\'s current token too?|||Một refresh token đã bị xoay vòng rồi lại được trình ra lần nữa. Máy chủ trả 401 REFRESH_REUSE_DETECTED và thu hồi 2 phiên. Vì sao thu hồi luôn cả token hiện tại của nạn nhân?',
            options: [
              'To free up rows in the RefreshSession table|||Để giải phóng bớt dòng trong bảng RefreshSession',
              'Because a rotated token can only be replayed by mistake, so both sides should retry|||Vì một token đã xoay chỉ có thể bị phát lại do nhầm lẫn, nên cả hai bên nên thử lại',
              'Because reuse means two parties hold the same token and you cannot tell which is the thief — revoking the family costs the real user one login and the thief everything|||Vì tái sử dụng nghĩa là hai bên cùng cầm một token và bạn không phân biệt được ai là kẻ trộm — thu hồi cả họ khiến người dùng thật mất một lần đăng nhập, còn kẻ trộm mất tất cả',
              'Because the refresh token is a JWT and its signature is now invalid|||Vì refresh token là một JWT và chữ ký của nó giờ đã sai',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Bình, logged in with a valid token, requested An\'s note and got 404 NOTE_NOT_FOUND rather than 403. Why prefer 404 here?|||Bình đã đăng nhập với token hợp lệ, yêu cầu ghi chú của An và nhận 404 NOTE_NOT_FOUND thay vì 403. Vì sao ở đây nên chọn 404?',
            options: [
              '403 would be a lie because the note really does exist|||403 sẽ là nói dối vì ghi chú đó thật sự có tồn tại',
              '404 is cheaper for the server to produce|||404 tốn ít tài nguyên máy chủ hơn để tạo ra',
              'HTTP forbids 403 on GET requests|||Chuẩn HTTP cấm trả 403 cho request GET',
              '403 confirms the resource exists, so ids can be enumerated to map the database; for a private per-user resource that existence is itself information|||403 xác nhận tài nguyên có tồn tại, nên có thể dò id để vẽ ra cả cơ sở dữ liệu; với tài nguyên riêng tư của từng người, chính sự tồn tại đó đã là thông tin',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'After POST /auth/logout-all, the device that made the call also got 401 TOKEN_REVOKED on its next request. Is that a bug, and what is the fix?|||Sau khi gọi POST /auth/logout-all, chính thiết bị ra lệnh cũng nhận 401 TOKEN_REVOKED ở request kế tiếp. Đó có phải lỗi không, và chữa thế nào?',
            options: [
              'Correct behaviour and correct experience — leave it as is|||Hành vi đúng và trải nghiệm cũng đúng — cứ để nguyên',
              'Correct behaviour, bad experience: its token carries the old tokenVersion, so the handler must issue a fresh token pair for the caller and return it|||Hành vi đúng nhưng trải nghiệm tệ: token của nó mang tokenVersion cũ, nên handler phải phát một cặp token mới cho chính người gọi và trả về',
              'A bug in requireAuth: it should skip the tokenVersion check for the /auth routes|||Lỗi trong requireAuth: nó nên bỏ qua bước kiểm tokenVersion cho các route /auth',
              'A bug in the transaction: the two statements should not run together|||Lỗi trong transaction: hai câu lệnh đó không nên chạy chung',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
