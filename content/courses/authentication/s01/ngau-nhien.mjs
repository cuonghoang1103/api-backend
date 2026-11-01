/**
 * Authentication · Chương 1 · 1.2 — Ngẫu nhiên, và bao nhiêu bit là đủ. Slug giữ: auth-1-2-ngau-nhien.
 * Mọi code/output lấy từ ./_ma.mjs (LabFlow ID chạy thật trong env -i, Node 22.23.3). Số đo: --random-seed lặp lại Math.random;
 * dự đoán Math.random: 3 số ⇒ 116/128 bit (sai), 4 số ⇒ 128/128 bit, 5/5 số tiếp theo khớp; độ lệch modulo 26/256 vs 25/256;
 * vá lỗ 3 của LabFlow ID: 60.000 lượt đoán trong 6,70 s ⇒ not found. Đính chính bản cũ: ECMA-262 §21.3.2.28 KHÔNG có câu
 * "must not be used for cryptographic purposes" — nó chỉ nói "implementation-defined"; cảnh báo nằm ở MDN và blog V8.
 */
import G from '../giang/auth-01-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';
import { CODE as CODE0 } from '../s00/_ma.mjs';
// đoạn trích dùng trong thân bài (biểu thức có '\n' không được nằm trong template — luật bộ kiểm)
const X1 = CODE.tokens.split('\n').slice(0, 11).join('\n');
const X2 = CODE.modulo.split('\n').slice(2, 7).join('\n');

const PR = CODE.predict.split('\n');
const PR_CORE = [...PR.slice(20, 25), '…', ...PR.slice(31, 37)].join('\n');
const V0_LINE = CODE0.server0.split('\n').find((l) => l.includes('Date.now()'));
const V01 = CODE.server01.split('\n');
const DIFF = ['// before — src/server.js v0 (lesson 0.3)', V0_LINE, '', '// after — src/server.js v0.1', V01[28], V01[29]].join('\n');

const NGUON_EN = [
  nguon('📘', 'ECMA-262 §21.3.2.28 Math.random()', '“…chosen randomly or pseudo randomly with approximately uniform distribution… using an implementation-defined algorithm” — no promise of unpredictability (read 01/11/2026).', 'https://tc39.es/ecma262/#sec-math.random'),
  nguon('⚙️', 'V8 blog — There’s Math.random(), and then there’s Math.random() (17/12/2015)', 'xorshift128+ since V8 4.9.41; “still not cryptographically secure” — use crypto.getRandomValues (read 01/11/2026).', 'https://v8.dev/blog/math-random'),
  nguon('🎲', 'Node.js docs — crypto.randomBytes / randomInt', '“Generates cryptographically strong pseudorandom data” · randomInt “avoids modulo bias” (read 01/11/2026).', 'https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback'),
  nguon('📏', 'OWASP — Session Management Cheat Sheet', '“Session identifiers must have at least 64 bits of entropy”; a CSPRNG “with a size of at least 128 bits” (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🆔', 'RFC 9562 — UUIDs (2024)', 'UUIDv4: 122 random bits + 4-bit version + 2-bit variant; UUIDv1 holds a timestamp and a node/MAC field (read 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9562'),
].join('\n');
const NGUON_VI = [
  nguon('📘', 'ECMA-262 §21.3.2.28 Math.random()', '“…chosen randomly or pseudo randomly with approximately uniform distribution… using an implementation-defined algorithm” — không hứa không đoán được (đọc 01/11/2026).', 'https://tc39.es/ecma262/#sec-math.random'),
  nguon('⚙️', 'Blog V8 — There’s Math.random(), and then there’s Math.random() (17/12/2015)', 'xorshift128+ từ V8 4.9.41; “still not cryptographically secure” — dùng crypto.getRandomValues (đọc 01/11/2026).', 'https://v8.dev/blog/math-random'),
  nguon('🎲', 'Tài liệu Node.js — crypto.randomBytes / randomInt', '“Generates cryptographically strong pseudorandom data” · randomInt “avoids modulo bias” — tránh lệch modulo (đọc 01/11/2026).', 'https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback'),
  nguon('📏', 'OWASP — Session Management Cheat Sheet', 'Mã phiên “phải có ít nhất 64 bit entropy”; CSPRNG “cỡ ít nhất 128 bit” (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🆔', 'RFC 9562 — UUID (2024)', 'UUIDv4: 122 bit ngẫu nhiên + 4 bit phiên bản + 2 bit variant; UUIDv1 chứa dấu thời gian và trường node/MAC (đọc 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9562'),
].join('\n');

const BITS_EN = `<table>
<thead><tr><th>Token</th><th>Bits</th><th>LabFlow ID</th></tr></thead>
<tbody>
<tr><td>session id, refresh token, reset/verification link, API key</td><td>256 (32 bytes) — costs nothing over 128</td><td><code>newToken('lfid_ses' | 'lfid_reset' | 'lfid_key')</code></td></tr>
<tr><td>CSRF token</td><td>128 (16 bytes)</td><td><code>newToken('lfid_csrf', 16)</code> (Ch3)</td></tr>
<tr><td>6-digit one-time code (email, SMS, TOTP)</td><td>≈ 20 — guessable, so only with an attempt limit and a short life</td><td><code>randomInt(0, 1_000_000)</code> (Ch6–7)</td></tr>
<tr><td>recovery codes</td><td>≈ 40 each, ten of them, single use, rate-limited — short so a human can type them</td><td>Ch7</td></tr>
<tr><td>anything below 64</td><td>a mistake for a long-lived secret (OWASP's floor for session ids)</td><td>—</td></tr>
</tbody>
</table>`;
const BITS_VI = `<table>
<thead><tr><th>Token</th><th>Số bit</th><th>LabFlow ID</th></tr></thead>
<tbody>
<tr><td>mã phiên, refresh token, link đặt lại/xác minh, API key</td><td>256 (32 byte) — chẳng tốn hơn 128</td><td><code>newToken('lfid_ses' | 'lfid_reset' | 'lfid_key')</code></td></tr>
<tr><td>CSRF token</td><td>128 (16 byte)</td><td><code>newToken('lfid_csrf', 16)</code> (Ch3)</td></tr>
<tr><td>mã một lần 6 chữ số (email, SMS, TOTP)</td><td>≈ 20 — đoán được, nên chỉ dùng kèm giới hạn lượt thử và tuổi thọ ngắn</td><td><code>randomInt(0, 1_000_000)</code> (Ch6–7)</td></tr>
<tr><td>mã khôi phục</td><td>≈ 40 mỗi mã, mười mã, dùng một lần, giới hạn tần suất — ngắn để người gõ được</td><td>Ch7</td></tr>
<tr><td>mọi thứ dưới 64</td><td>là sai với bí mật sống lâu (sàn của OWASP cho mã phiên)</td><td>—</td></tr>
</tbody>
</table>`;

export default {
  title: '1.2 — Randomness, and how many bits is enough|||1.2 — Ngẫu nhiên, và bao nhiêu bit là đủ',
  slug: 'auth-1-2-ngau-nhien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Math.random là một công thức: cùng --random-seed ra cùng số, và từ 4 giá trị liên tiếp giải được 128 bit trạng thái xorshift128+ rồi đoán đúng 5/5 số tiếp theo (3 giá trị chỉ được 116 bit). Nguồn đúng: node:crypto (randomBytes, randomUUID, randomInt); độ dài chuỗi không phải số bit; bao nhiêu bit là đủ (tính thời gian đoán, nghịch lý ngày sinh); lệch modulo khi đổi byte ra chữ số; vá lỗ 3 của LabFlow ID — 60.000 lượt đoán trong 6,70 s không còn trúng.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Randomness, and how many bits is enough</h2>
<p class="lead">Half the credentials in an application are “a random string”: session ids, reset links, CSRF tokens, API keys. Two questions decide whether they are safe, and both have exact answers you can measure: <strong>is the source unpredictable</strong>, and <strong>how many random bits</strong> does the string carry? Lesson 0.3 already showed the failure — a <code>Date.now()</code> session id found in 4.37 s. This lesson shows a subtler one, fixes hole 3 for good, and gives you the numbers to choose a length.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>prove that <code>Math.random()</code> is predictable — by predicting it;</li>
<li>generate tokens, ids and codes with <code>node:crypto</code> and say how many bits each one carries;</li>
<li>choose a length from a guess-time and collision calculation, not from habit;</li>
<li>turn random bytes into digits without bias (one-time codes);</li>
<li>replace LabFlow ID's guessable session id and show the attack now fails.</li>
</ul>
<p><strong>Why it is worth it:</strong> every token in Chapters 3–8 comes from the one function you write here, and “how do you generate a session id / reset token?” is a standard interview question.</p>
</div>

<h3>An everyday picture first</h3>
<p>A lottery draw with real balls is unpredictable; a “random” list printed in a book is not — find the page and every next number is known. A pseudo-random generator like <code>Math.random()</code> is the book — a formula that turns a hidden starting value (the <strong>seed</strong> and internal <strong>state</strong>) into numbers that <em>look</em> random. A <strong>CSPRNG</strong> (cryptographically secure pseudo-random number generator, like the one behind <code>crypto.randomBytes</code>) is built so that seeing outputs does not let you compute the next ones.</p>

<h3>Math.random() is a formula</h3>
<p>Node lets you fix the seed of V8's generator with a flag. Same seed, same “random” number — while <code>randomBytes</code>, fed by the operating system, ignores it:</p>
${ra(OUT['12-hat-giong'])}
<p>The language specification promises little: ECMA-262 §21.3.2.28 says the number is chosen “randomly or pseudo randomly with approximately uniform distribution … using an implementation-defined algorithm”. Uniform, yes; unpredictable, never promised. (The old version of this lesson quoted the spec as forbidding cryptographic use; it does not say that — the warning is in MDN and in V8's own blog.) Since 2015 V8 uses <strong>xorshift128+</strong>, and the V8 team writes that it is “still not cryptographically secure”.</p>

<h3>Predict it</h3>
<p>Here is what that means in practice. V8 keeps 128 bits of state, refills a cache of 64 numbers at a time and hands them out last-first; each number reveals the top 52 bits of one state word. Every step of xorshift is just XOR and shifts — <em>linear</em> over bits — so each observed number gives 52 linear equations about the 128 unknown bits. Collect enough equations, solve them like a school system of equations (but with XOR instead of +), and you have the state; run the generator forward and you have the future.</p>
${ma('javascript', PR_CORE)}
<p>The script asks a separate Node process (the “victim”) for consecutive <code>Math.random()</code> values, keeps some as “observed”, and tries to predict the rest:</p>
${ra(OUT['12-doan-3'])}
${ra(OUT['12-doan-4'])}
<p>Three numbers give 156 equations but only 116 independent ones — not enough, every prediction is wrong. Four numbers pin down all 128 bits, and the next five values are predicted <strong>exactly</strong>, to the last digit. If an app built tokens from <code>Math.random()</code>, an attacker who signs up and collects a few of their own tokens could compute tokens issued to others in the same batch.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Observe</span><span class="lz-d">4 consecutive outputs (your own tokens, ids, captchas…)</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Equations</span><span class="lz-d">52 bits per output, linear in the 128 state bits</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Solve</span><span class="lz-d">Gaussian elimination over XOR: 128/128 bits</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Run forward</span><span class="lz-d">everyone else's “random” values</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Trap — “but I use <code>Math.random().toString(36)</code>, nobody sees the raw number.”</strong> Our demo used raw doubles, the easiest case; a derived string reveals fewer bits per sample, so the attacker needs more samples and more work — not a different kind of luck. The state is the same 128 bits. There is no amount of string formatting that turns a predictable source into an unpredictable one; change the source.</p>
</div>

<h3>The right source, and what length really means</h3>
<p>In Node, everything security-related comes from <code>node:crypto</code> (in the browser: <code>crypto.getRandomValues</code>). LabFlow ID wraps it in one function so the source and the size are decided in exactly one place:</p>
${ma('javascript', X1)}
${ra(OUT['12-dinh-dang'])}
<ul>
<li><strong>Length is not entropy.</strong> The same 128 bits are 32 hex characters (4 bits each) or 22 base64url characters (6 bits each). <code>Math.random().toString(36)</code> is 11 characters of <em>zero</em> secret bits.</li>
<li><strong>A UUIDv4 has 122 random bits, not 128</strong> — RFC 9562 fixes 4 version bits and 2 variant bits. Fine as an id; never use UUIDv1 for anything secret: it contains a timestamp and a node field that is often the MAC address.</li>
<li><strong>base64url</strong> (no <code>+ / =</code>) is URL- and cookie-safe; the <strong>prefix</strong> <code>lfid_ses_</code> lets people and secret scanners recognise the token (lesson 1.5).</li>
</ul>

<h3>How many bits is enough — computed, not guessed</h3>
<p>Assume an absurdly generous attacker: 10<sup>12</sup> guesses per second, far beyond any online attack against your rate limits. On average they find one specific token after trying half the possibilities:</p>
${ra(OUT['12-bit'])}
${BITS_EN}
<p>OWASP's floor for session ids is 64 bits; 128 is the comfortable default; 256 costs nothing extra and removes the question for long-lived secrets. Above 256 nothing improves — only your logs get longer. And collisions? The <strong>birthday paradox</strong> says two random tokens collide after roughly 2<sup>bits/2</sup> tokens, far sooner than 2<sup>bits</sup>:</p>
${ra(OUT['12-sinh-nhat'])}
<p>At 1,000 new tokens per second, 32 bits collide within minutes — the reason short random codes need a uniqueness check — while 128 bits would take hundreds of millions of years. Keep the database's unique constraint for correctness, not because you expect a collision.</p>

<h3>From bytes to digits: modulo bias</h3>
<p>A 6-digit email code needs digits, not bytes. The obvious <code>byte % 10</code> is subtly wrong: a byte has 256 values, 256 = 25 × 10 + 6, so the digits 0–5 get one extra byte value each.</p>
${ma('javascript', X2)}
${ra(OUT['12-modulo'])}
<p>Digits 0–5 come up about 10.16% of the time instead of 10% — exactly 26/256 — and 6–9 about 9.77%. For a one-time code that means some codes are measurably more likely than others; an attacker guesses them first. <code>crypto.randomInt</code> “avoids modulo bias” (Node docs) by rejecting the extra values; its column is flat within noise. Chapters 6–7 use it for every code.</p>

<h3>Close hole 3 in LabFlow ID</h3>
<p>Lesson 0.3 found An's session after 36,839 guesses in 4.37 s, because the id was <code>Date.now()</code>. The fix is one line plus one import:</p>
${ma('javascript', DIFF)}
${ra(OUT['12-v01-doan'])}
<p>The same script now tries all 60,000 milliseconds of that minute in 6.70 s and finds nothing: the session is no longer a time, it is 256 bits from the CSPRNG. (The second line stores only the token's digest — lesson 1.3 explains why.) Notice what the attack still did: 60,000 requests from one address in seven seconds, and nothing stopped it. That is hole 6, for Chapter 10.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“How do you generate a session id or reset token in Node?”</strong> — <code>crypto.randomBytes(32).toString('base64url')</code> behind one helper, never <code>Math.random</code>, <code>Date.now</code> or a UUIDv1.</li>
<li><strong>“Is a UUID a secure token?”</strong> — A v4 UUID from <code>crypto.randomUUID()</code> has 122 random bits, enough to be unguessable; but it is often used as a visible id, and visible ids are not secrets — still check authorization (lesson 0.2).</li>
<li><strong>“How do you make a 6-digit OTP?”</strong> — <code>crypto.randomInt(0, 1_000_000)</code> padded to 6 digits, plus an attempt limit and a short expiry, because 20 bits are guessable.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo1/predict-math-random.mjs 3</code> and <code>… 4</code>. Write down how many state bits each run solved and how many predictions matched.</li>
<li>In your v0 server from lesson 0.3, replace <code>String(Date.now())</code> with <code>newToken('lfid_ses')</code> (import it from <code>./crypto/index.js</code>), restart, sign in as An, note the minute, and rerun <code>node demo0/guess-session.mjs HH:MM</code>.</li>
<li>Compute, with <code>demo1/bits.mjs</code>'s formula, the average time to guess a 6-digit code at 10 guesses per second (a rate-limited form).</li>
</ol>
<p><strong>Solution and real output:</strong> runs 3 and 4 are shown above — 116/128 bits and five ✗, then 128/128 bits and five ✓. Step 2 is the before/after block and the output under it: <code>not found</code> after 60,000 tries. Step 3: 10<sup>6</sup> codes, half of them on average = 500,000 guesses ÷ 10 per second = 50,000 s ≈ 13.9 hours — which is why one-time codes also expire after minutes and lock after a few wrong tries.</p>
<p><strong>Done when:</strong> your own predictor run shows the 116 → 128 jump, your patched server survives the minute-long guess, and you can explain why a 20-bit code is acceptable only with limits.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PRNG / CSPRNG</span><span class="v">A formula that makes random-looking numbers / one built so that outputs never reveal past or future outputs (<code>crypto.randomBytes</code>).</span></div>
  <div class="kv"><span class="k">seed, state</span><span class="v">The hidden values a generator starts from and carries along; know the state, know every output.</span></div>
  <div class="kv"><span class="k">entropy (bits)</span><span class="v">How many equally likely possibilities a secret has, as a power of two — not its length in characters.</span></div>
  <div class="kv"><span class="k">base64url</span><span class="v">Base64 with <code>-</code> and <code>_</code> and no padding: safe in URLs and cookies, 6 bits per character.</span></div>
  <div class="kv"><span class="k">birthday paradox</span><span class="v">Collisions appear after about 2<sup>n/2</sup> random n-bit values, much sooner than 2<sup>n</sup>.</span></div>
  <div class="kv"><span class="k">modulo bias</span><span class="v">Unequal probabilities created by <code>random % n</code> when n does not divide the range.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>Math.random()</code> is a formula: same seed, same numbers; four outputs were enough to predict the next five exactly.</li>
<li>Use <code>node:crypto</code> for anything secret; wrap it in one helper (<code>newToken</code>).</li>
<li>Count bits, not characters: hex 4, base64url 6 per character; UUIDv4 = 122.</li>
<li>64 bits is the floor, 128 the default, 256 free for long-lived secrets; collisions need ~2<sup>bits/2</sup> tokens.</li>
<li>Digits from bytes: <code>randomInt</code>, never <code>% 10</code>.</li>
<li>LabFlow ID v0.1: the minute-long guess attack now finds nothing.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-11-2-rut-gon-link', title: 'Also in API Design — lesson 11.2: designing a URL shortener', sub: 'Same: random short codes collide much sooner than intuition says (birthday paradox, measured on a million codes). Different: there the code is a public id and collisions are the problem; here the token is a secret and guessability is the problem.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Ngẫu nhiên, và bao nhiêu bit là đủ</h2>
<p class="lead">Một nửa tín vật trong ứng dụng là "một chuỗi ngẫu nhiên": mã phiên, link đặt lại mật khẩu, CSRF token, API key. Hai câu hỏi quyết định chúng có an toàn không, và cả hai đều có đáp án chính xác đo được: <strong>nguồn có đoán trước được không</strong>, và chuỗi mang <strong>bao nhiêu bit ngẫu nhiên</strong>? Bài 0.3 đã cho thấy một kiểu hỏng — mã phiên <code>Date.now()</code> bị tìm ra trong 4,37 giây. Bài này chỉ ra một kiểu tinh vi hơn, vá hẳn lỗ 3, và cho bạn con số để chọn độ dài.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>chứng minh <code>Math.random()</code> đoán trước được — bằng cách đoán nó;</li>
<li>sinh token, id và mã bằng <code>node:crypto</code> và nói mỗi cái mang bao nhiêu bit;</li>
<li>chọn độ dài bằng phép tính thời gian đoán và va chạm, không theo thói quen;</li>
<li>đổi byte ngẫu nhiên thành chữ số mà không bị lệch (mã một lần);</li>
<li>thay mã phiên đoán được của LabFlow ID và cho thấy đòn tấn công giờ thất bại.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> mọi token ở Chương 3–8 đều ra từ đúng hàm bạn viết ở đây, và "sinh mã phiên / token đặt lại mật khẩu thế nào?" là câu phỏng vấn quen thuộc.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Quay xổ số bằng bóng thật thì không đoán trước được; một bảng "số ngẫu nhiên" in sẵn trong sách thì có — tìm ra trang là biết hết các số tiếp theo. Bộ sinh giả ngẫu nhiên như <code>Math.random()</code> chính là cuốn sách — một công thức biến giá trị khởi đầu bị giấu (<strong>seed — hạt giống</strong> và <strong>state — trạng thái</strong> bên trong) thành những con số <em>trông</em> ngẫu nhiên. Còn <strong>CSPRNG</strong> (bộ sinh giả ngẫu nhiên an toàn mật mã, như cái đứng sau <code>crypto.randomBytes</code>) được thiết kế để thấy output cũng không tính được output kế tiếp.</p>

<h3>Math.random() là một công thức</h3>
<p>Node cho phép ghim seed của bộ sinh V8 bằng một cờ. Cùng seed, cùng con số "ngẫu nhiên" — trong khi <code>randomBytes</code>, lấy từ hệ điều hành, phớt lờ cờ đó:</p>
${ra(OUT['12-hat-giong'])}
<p>Đặc tả ngôn ngữ hứa rất ít: ECMA-262 §21.3.2.28 nói con số được chọn "randomly or pseudo randomly with approximately uniform distribution … using an implementation-defined algorithm" — phân bố gần đều, thuật toán do bên cài đặt quyết. Đều thì có; không đoán được thì chưa bao giờ hứa. (Bản cũ của bài này trích đặc tả là cấm dùng cho mật mã; đặc tả không nói vậy — lời cảnh báo nằm ở MDN và blog của chính V8.) Từ 2015 V8 dùng <strong>xorshift128+</strong>, và đội V8 viết rằng nó "still not cryptographically secure".</p>

<h3>Đoán nó</h3>
<p>Thực tế nghĩa là thế này. V8 giữ 128 bit trạng thái, mỗi lần nạp sẵn 64 số vào bộ đệm rồi trả ra từ cuối về đầu; mỗi số lộ ra 52 bit cao của một từ trạng thái. Mỗi bước của xorshift chỉ là XOR và dịch bit — <em>tuyến tính</em> theo bit — nên mỗi số quan sát được cho 52 phương trình tuyến tính về 128 bit chưa biết. Gom đủ phương trình, giải như hệ phương trình ở phổ thông (nhưng thay + bằng XOR), là có trạng thái; chạy bộ sinh tiếp là thấy tương lai.</p>
${ma('javascript', PR_CORE)}
<p>Script xin một tiến trình Node riêng (nạn nhân) vài giá trị <code>Math.random()</code> liên tiếp, giữ một số làm "đã thấy", rồi đoán phần còn lại:</p>
${ra(OUT['12-doan-3'])}
${ra(OUT['12-doan-4'])}
<p>Ba số cho 156 phương trình nhưng chỉ 116 phương trình độc lập — không đủ, mọi lần đoán đều sai. Bốn số chốt đủ 128 bit, và năm giá trị kế tiếp được đoán <strong>chính xác</strong> tới chữ số cuối. Nếu một ứng dụng dựng token từ <code>Math.random()</code>, kẻ tấn công chỉ cần đăng ký, gom vài token của chính mình là tính được token cấp cho người khác trong cùng đợt.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Quan sát</span><span class="lz-d">4 output liên tiếp (token, id, captcha của chính mình…)</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lập phương trình</span><span class="lz-d">52 bit mỗi output, tuyến tính theo 128 bit trạng thái</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Giải</span><span class="lz-d">khử Gauss với XOR: 128/128 bit</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chạy tiếp</span><span class="lz-d">giá trị "ngẫu nhiên" của mọi người khác</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "nhưng tôi dùng <code>Math.random().toString(36)</code>, có ai thấy số gốc đâu."</strong> Demo của mình dùng số thực gốc, trường hợp dễ nhất; chuỗi dẫn xuất lộ ít bit hơn mỗi mẫu, nên kẻ tấn công cần nhiều mẫu và nhiều công hơn — chứ không phải trông vào vận may khác. Trạng thái vẫn là 128 bit đó. Định dạng chuỗi kiểu gì cũng không biến nguồn đoán được thành nguồn không đoán được; hãy đổi nguồn.</p>
</div>

<h3>Nguồn đúng, và độ dài thật ra nghĩa là gì</h3>
<p>Trong Node, mọi thứ liên quan bảo mật lấy từ <code>node:crypto</code> (trên trình duyệt: <code>crypto.getRandomValues</code>). LabFlow ID bọc nó trong một hàm để nguồn và kích thước được quyết ở đúng một chỗ:</p>
${ma('javascript', X1)}
${ra(OUT['12-dinh-dang'])}
<ul>
<li><strong>Độ dài không phải entropy.</strong> Cùng 128 bit là 32 ký tự hex (4 bit mỗi ký tự) hoặc 22 ký tự base64url (6 bit mỗi ký tự). <code>Math.random().toString(36)</code> là 11 ký tự chứa <em>không</em> bit bí mật nào.</li>
<li><strong>UUIDv4 có 122 bit ngẫu nhiên, không phải 128</strong> — RFC 9562 cố định 4 bit phiên bản và 2 bit variant. Làm id thì ổn; đừng bao giờ dùng UUIDv1 cho thứ gì bí mật: nó chứa dấu thời gian và trường node thường là địa chỉ MAC.</li>
<li><strong>base64url</strong> (không có <code>+ / =</code>) an toàn trong URL và cookie; <strong>tiền tố</strong> <code>lfid_ses_</code> giúp người và công cụ quét bí mật nhận ra token (bài 1.5).</li>
</ul>

<h3>Bao nhiêu bit là đủ — tính ra, không đoán</h3>
<p>Giả định một kẻ tấn công hào phóng tới phi lý: 10<sup>12</sup> lần đoán mỗi giây, vượt xa mọi đòn trực tuyến trước giới hạn tần suất của bạn. Trung bình họ tìm ra một token cụ thể sau khi thử một nửa số khả năng:</p>
${ra(OUT['12-bit'])}
${BITS_VI}
<p>Sàn của OWASP cho mã phiên là 64 bit; 128 là mặc định thoải mái; 256 chẳng tốn thêm gì và xoá luôn câu hỏi với bí mật sống lâu. Trên 256 chẳng cải thiện gì — chỉ làm log dài ra. Còn va chạm? <strong>Nghịch lý ngày sinh (birthday paradox)</strong> nói hai token ngẫu nhiên trùng nhau sau khoảng 2<sup>bit/2</sup> token, sớm hơn nhiều so với 2<sup>bit</sup>:</p>
${ra(OUT['12-sinh-nhat'])}
<p>Với 1.000 token mới mỗi giây, 32 bit va chạm trong vài phút — lý do mã ngẫu nhiên ngắn cần kiểm trùng — còn 128 bit thì mất hàng trăm triệu năm. Cứ giữ ràng buộc unique trong cơ sở dữ liệu để đúng đắn, chứ không phải vì chờ va chạm.</p>

<h3>Từ byte sang chữ số: lệch modulo</h3>
<p>Mã 6 chữ số gửi qua email cần chữ số, không cần byte. Cách hiển nhiên <code>byte % 10</code> sai một cách tinh vi: một byte có 256 giá trị, 256 = 25 × 10 + 6, nên các chữ số 0–5 được thêm mỗi chữ một giá trị byte.</p>
${ma('javascript', X2)}
${ra(OUT['12-modulo'])}
<p>Chữ số 0–5 xuất hiện khoảng 10,16% thay vì 10% — đúng 26/256 — còn 6–9 khoảng 9,77%. Với mã một lần, nghĩa là có những mã đo được là dễ ra hơn; kẻ tấn công đoán chúng trước. <code>crypto.randomInt</code> "avoids modulo bias" (tài liệu Node) bằng cách loại các giá trị thừa; cột của nó phẳng trong mức nhiễu. Chương 6–7 dùng nó cho mọi mã.</p>

<h3>Vá lỗ 3 của LabFlow ID</h3>
<p>Bài 0.3 tìm ra phiên của An sau 36.839 lần đoán trong 4,37 giây, vì mã phiên là <code>Date.now()</code>. Cách sửa là một dòng cộng một import:</p>
${ma('javascript', DIFF)}
${ra(OUT['12-v01-doan'])}
<p>Cùng script giờ thử hết 60.000 mili giây của phút đó trong 6,70 giây mà không tìm thấy gì: phiên không còn là một mốc thời gian, nó là 256 bit từ CSPRNG. (Dòng thứ hai chỉ lưu digest của token — bài 1.3 giải thích vì sao.) Để ý điều đòn tấn công vẫn làm được: 60.000 request từ một địa chỉ trong bảy giây, và chẳng có gì chặn. Đó là lỗ 6, để dành cho Chương 10.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Sinh mã phiên hay token đặt lại mật khẩu trong Node thế nào?"</strong> — <code>crypto.randomBytes(32).toString('base64url')</code> sau một hàm dùng chung, không bao giờ <code>Math.random</code>, <code>Date.now</code> hay UUIDv1.</li>
<li><strong>"UUID có phải token an toàn không?"</strong> — UUIDv4 từ <code>crypto.randomUUID()</code> có 122 bit ngẫu nhiên, đủ để không đoán được; nhưng nó hay được dùng làm id công khai, mà id công khai không phải bí mật — vẫn phải kiểm phân quyền (bài 0.2).</li>
<li><strong>"Tạo OTP 6 chữ số thế nào?"</strong> — <code>crypto.randomInt(0, 1_000_000)</code> đệm đủ 6 chữ số, cộng giới hạn lượt thử và hết hạn nhanh, vì 20 bit là đoán được.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo1/predict-math-random.mjs 3</code> và <code>… 4</code>. Ghi lại mỗi lần giải được bao nhiêu bit trạng thái và đoán đúng bao nhiêu số.</li>
<li>Trong máy chủ v0 của bài 0.3, thay <code>String(Date.now())</code> bằng <code>newToken('lfid_ses')</code> (import từ <code>./crypto/index.js</code>), khởi động lại, đăng nhập bằng An, ghi lại phút, rồi chạy lại <code>node demo0/guess-session.mjs HH:MM</code>.</li>
<li>Dùng công thức của <code>demo1/bits.mjs</code>, tính thời gian trung bình để đoán một mã 6 chữ số với tốc độ 10 lần mỗi giây (một form có giới hạn tần suất).</li>
</ol>
<p><strong>Lời giải và output thật:</strong> lần chạy 3 và 4 ở trên — 116/128 bit và năm dấu ✗, rồi 128/128 bit và năm dấu ✓. Bước 2 là khối trước/sau và output ngay dưới nó: <code>not found</code> sau 60.000 lần thử. Bước 3: 10<sup>6</sup> mã, trung bình một nửa = 500.000 lần đoán ÷ 10 lần mỗi giây = 50.000 giây ≈ 13,9 giờ — vì thế mã một lần còn phải hết hạn sau vài phút và khoá sau vài lần sai.</p>
<p><strong>Đạt khi:</strong> lần chạy bộ đoán của bạn cho thấy bước nhảy 116 → 128, máy chủ đã vá của bạn sống sót qua đòn đoán cả phút, và bạn giải thích được vì sao mã 20 bit chỉ chấp nhận được khi có giới hạn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PRNG / CSPRNG (bộ sinh giả ngẫu nhiên / … an toàn mật mã)</span><span class="v">Công thức sinh số trông ngẫu nhiên / loại được thiết kế để output không bao giờ lộ output trước hay sau (<code>crypto.randomBytes</code>).</span></div>
  <div class="kv"><span class="k">seed, state (hạt giống, trạng thái)</span><span class="v">Các giá trị bị giấu mà bộ sinh bắt đầu từ đó và mang theo; biết trạng thái là biết mọi output.</span></div>
  <div class="kv"><span class="k">entropy (bit ngẫu nhiên)</span><span class="v">Bí mật có bao nhiêu khả năng đồng xác suất, viết thành luỹ thừa của 2 — không phải độ dài tính bằng ký tự.</span></div>
  <div class="kv"><span class="k">base64url</span><span class="v">Base64 dùng <code>-</code> và <code>_</code>, không đệm: an toàn trong URL và cookie, 6 bit mỗi ký tự.</span></div>
  <div class="kv"><span class="k">birthday paradox (nghịch lý ngày sinh)</span><span class="v">Va chạm xuất hiện sau khoảng 2<sup>n/2</sup> giá trị n bit ngẫu nhiên, sớm hơn nhiều so với 2<sup>n</sup>.</span></div>
  <div class="kv"><span class="k">modulo bias (lệch modulo)</span><span class="v">Xác suất không đều sinh ra bởi <code>random % n</code> khi n không chia hết khoảng giá trị.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>Math.random()</code> là công thức: cùng seed, cùng số; bốn output đủ để đoán chính xác năm số tiếp theo.</li>
<li>Thứ gì bí mật thì dùng <code>node:crypto</code>; bọc trong một hàm dùng chung (<code>newToken</code>).</li>
<li>Đếm bit, đừng đếm ký tự: hex 4, base64url 6 bit mỗi ký tự; UUIDv4 = 122.</li>
<li>64 bit là sàn, 128 là mặc định, 256 miễn phí cho bí mật sống lâu; va chạm cần ~2<sup>bit/2</sup> token.</li>
<li>Chữ số từ byte: <code>randomInt</code>, không bao giờ <code>% 10</code>.</li>
<li>LabFlow ID v0.1: đòn đoán cả phút giờ không tìm được gì.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-11-2-rut-gon-link', title: 'Cũng có ở API Design — bài 11.2: thiết kế dịch vụ rút gọn link', sub: 'Giống: mã ngắn ngẫu nhiên va chạm sớm hơn cảm giác rất nhiều (nghịch lý ngày sinh, đo trên một triệu mã). Khác: ở đó mã là id công khai và va chạm mới là vấn đề; ở đây token là bí mật và bị đoán mới là vấn đề.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
