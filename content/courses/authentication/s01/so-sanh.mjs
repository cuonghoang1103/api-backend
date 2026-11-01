/**
 * Authentication · Chương 1 · 1.3 — So sánh hai bí mật bằng === là một con bug. Slug giữ: auth-1-3-so-sanh-hang-thoi-gian.
 * BÀI MẪU của đợt mẫu 01/11/2026 (các bài khác bắt chước cấu trúc này). Mọi code/output lấy từ ./_ma.mjs (sinh từ LabFlow ID
 * chạy thật trong env -i, Node 22.23.3, macOS arm64). Số đo: === 64 ký tự 4,61 → 6,56 ns; 1024 ký tự 4,61 → 38,05 ns;
 * đo ngây thơ 0,99 ns phẳng; timingSafeEqual ~65 ns phẳng; qua HTTP localhost chênh trung vị +125 / −126 / −42 ns.
 */
import G from '../giang/auth-01-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';
// đoạn trích dùng trong thân bài (biểu thức có '\n' không được nằm trong template — luật bộ kiểm)
const X1 = OUT['13-tu-xa-2'].split('\n').slice(-1).join('\n');
const X2 = OUT['13-tu-xa-3'].split('\n').slice(-1).join('\n');

const SV = CODE.server01.split('\n');
const SV_SESSION = [SV[27], SV[28], SV[29], '  …', SV[35], SV[36], SV[37]].join('\n');
const TE = CODE.timingEqual.split('\n');
const TE_CORE = [TE[22], '…', TE[30], TE[31], TE[32]].join('\n');
const TN = CODE.timingNaive.split('\n');
const TN_LOOP = [TN[20], '…', TN[28], TN[29], TN[30]].join('\n');
const WH = CODE.webhook.split('\n');
const WH_VERIFY = WH.slice(5, 17).join('\n');
const WH_ROUTES = WH.slice(18, 27).join('\n');

const NGUON_EN = [
  nguon('⏱️', 'Node.js docs — crypto.timingSafeEqual', 'Same-length buffers only; throws ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH otherwise (read 01/11/2026).', 'https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b'),
  nguon('📉', 'Crosby, Wallach, Riedi — Opportunities and Limits of Remote Timing Attacks (2009)', 'With filtering, an attacker can measure 15–100 µs across the Internet and as little as 100 ns on a local network (abstract, read 01/11/2026).', 'https://www.cs.rice.edu/~dwallach/pub/crosby-timing2009.pdf'),
  nguon('🐙', 'GitHub Docs — Validating webhook deliveries', 'X-Hub-Signature-256 is an HMAC-SHA256 hex digest; “Never use a plain == operator” (read 01/11/2026).', 'https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries'),
].join('\n');
const NGUON_VI = [
  nguon('⏱️', 'Tài liệu Node.js — crypto.timingSafeEqual', 'Chỉ nhận hai buffer cùng độ dài; khác độ dài thì ném ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH (đọc 01/11/2026).', 'https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b'),
  nguon('📉', 'Crosby, Wallach, Riedi — Opportunities and Limits of Remote Timing Attacks (2009)', 'Có lọc nhiễu, kẻ tấn công đo được 15–100 µs qua Internet và tới 100 ns trong mạng nội bộ (phần tóm tắt, đọc 01/11/2026).', 'https://www.cs.rice.edu/~dwallach/pub/crosby-timing2009.pdf'),
  nguon('🐙', 'GitHub Docs — Kiểm chữ ký webhook', 'X-Hub-Signature-256 là HMAC-SHA256 dạng hex; “Never use a plain == operator” (đọc 01/11/2026).', 'https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>You are checking…</th><th>Do this</th><th>Where in this course</th></tr></thead>
<tbody>
<tr><td>a session token, reset token, API key (random, from <code>newToken</code>)</td><td><strong>Do not compare.</strong> Store <code>tokenDigest(token)</code>, look the row up by the digest of what arrives</td><td>this lesson (v0.1), Ch3, Ch6</td></tr>
<tr><td>an HMAC tag or a signature string you recomputed (webhook, signed cookie)</td><td><code>timingSafeEqual</code> on two buffers of the same length — or <code>safeEqual</code> when lengths may differ</td><td>this lesson, 1.4, Ch3</td></tr>
<tr><td>a password</td><td>Never compare it at all: hash with argon2id and let <code>argon2.verify</code> do the comparison</td><td>Ch2 (hole 1)</td></tr>
<tr><td>a 6-digit one-time code</td><td><code>safeEqual</code> <em>and</em> an attempt limit — a million possibilities is guessable without any timing</td><td>Ch7, Ch10</td></tr>
<tr><td>an ordinary value (a role, a status, an email)</td><td><code>===</code> is fine — it is not a secret</td><td>everywhere</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn đang kiểm…</th><th>Làm thế này</th><th>Ở đâu trong khoá</th></tr></thead>
<tbody>
<tr><td>token phiên, token đặt lại mật khẩu, API key (ngẫu nhiên, từ <code>newToken</code>)</td><td><strong>Đừng so sánh.</strong> Lưu <code>tokenDigest(token)</code>, tra dòng bằng digest của thứ gửi tới</td><td>bài này (v0.1), Ch3, Ch6</td></tr>
<tr><td>một thẻ HMAC hay chuỗi chữ ký bạn tự tính lại (webhook, cookie có ký)</td><td><code>timingSafeEqual</code> trên hai buffer cùng độ dài — hoặc <code>safeEqual</code> khi độ dài có thể khác nhau</td><td>bài này, 1.4, Ch3</td></tr>
<tr><td>một mật khẩu</td><td>Không bao giờ tự so: băm bằng argon2id và để <code>argon2.verify</code> so giùm</td><td>Ch2 (lỗ 1)</td></tr>
<tr><td>mã một lần 6 chữ số</td><td><code>safeEqual</code> <em>và</em> giới hạn số lần thử — một triệu khả năng thì đoán được mà chẳng cần đo thời gian</td><td>Ch7, Ch10</td></tr>
<tr><td>một giá trị bình thường (vai trò, trạng thái, email)</td><td><code>===</code> là ổn — nó không phải bí mật</td><td>mọi nơi</td></tr>
</tbody>
</table>`;

export default {
  title: '1.3 — Comparing two secrets with === is a bug|||1.3 — So sánh hai bí mật bằng === là một con bug',
  slug: 'auth-1-3-so-sanh-hang-thoi-gian',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đo thật === trên Node 22: 64 ký tự 4,61 → 6,56 ns, 1024 ký tự 4,61 → 38,05 ns; vì sao phép đo ngây thơ ra 0,99 ns phẳng (JIT); thử nhìn chênh lệch qua HTTP (+125/−126/−42 ns — nhiễu thắng); timingSafeEqual và cái bẫy độ dài; safeEqual hai lớp HMAC; cách tốt hơn: không so mà tra digest (LabFlow ID v0.1); kiểm chữ ký webhook đúng: byte gốc, thời hạn, hằng thời gian.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Comparing two secrets with === is a bug</h2>
<p class="lead">Every login system compares secrets: a session token against the one on file, a signature against the one it should be, an API key against the database. The obvious way — <code>===</code> — answers correctly and still leaks a little: it takes slightly longer the more of the start you guessed right. This lesson measures that leak on your own machine, shows how small it really is, and then removes it in a way that costs nothing — mostly by not comparing at all.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain a timing side channel with numbers you measured yourself, and say honestly how hard it is to exploit;</li>
<li>spot a benchmark that lies (and write one that does not);</li>
<li>compare secrets with <code>timingSafeEqual</code> without falling into its length trap, or with <code>safeEqual</code> from LabFlow ID's toolkit;</li>
<li>store session tokens as digests and look them up — the design LabFlow ID v0.1 now uses;</li>
<li>verify a webhook signature correctly: raw bytes, a time limit, a constant-time check.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> “how do you verify a webhook?” and “why not <code>==</code>?” are standard backend interview questions, and the webhook bug in this lesson is one GitHub's own documentation warns you about in bold.</p>
</div>

<h3>An everyday picture first</h3>
<p>An old combination lock clicks each time one wheel lands on the right digit: try 0–9 on wheel 1 until it clicks, then wheel 2 — ten tries per wheel instead of every combination. <code>===</code> is that lock: it compares from the left and stops at the first difference, so a guess wrong at character 0 returns a little sooner than one wrong at character 40. The answer is always correct; the <strong>time</strong> is the click — a <strong>timing side channel</strong>.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Guess position 0</span><span class="lz-d">Try every possible first character; the one that takes slightly longer is probably right.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Keep it, guess position 1</span><span class="lz-d">The search is now one position at a time: 64 × 64 tries for a 64-char base64url token, not 64<sup>64</sup>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The catch</span><span class="lz-d">Each “try” needs many measurements, because the signal is nanoseconds and the noise is microseconds. How many? Measure.</span></div>
</div>

<h3>Measure it — and meet the benchmark that lies</h3>
<p>A first, reasonable-looking measurement: for each position, a guess with that many leading characters right, compared a million times, median of 21 rounds.</p>
${ma('javascript', TN_LOOP)}
${ra(OUT['13-do-naive'])}
<p>Flat: 0.99 ns in every row. Not proof that <code>===</code> is constant-time — 0.99 ns is an empty loop iteration. <code>g</code> and <code>secret</code> never change inside the loop, so V8's optimiser may compute the comparison <strong>once</strong>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a micro-benchmark that the JIT has optimised away.</strong> An unchanging input with an unused result may be hoisted out of the loop or deleted, giving flat, wrong numbers. Fix: rotate 8 separate copies of each guess (<code>gs[i &amp; 7]</code>) and <em>use</em> every result (<code>hits++</code>). The first version of the Lab 1 grader had exactly this bug.</p>
</div>

${ma('javascript', TE_CORE)}
${ra(OUT['13-do-strict'])}
<p>Now the leak shows. It is <strong>small</strong> — 4.61 ns (wrong at the start) to 6.56 ns (wrong at the end), about 2 ns over 64 characters — and it rises <strong>in steps</strong>: 0, 1 and 8 right cost the same, 16 more, 48 and 63 the same again, because V8 compares a block of bytes at a time. Make the secret longer and the slope is obvious:</p>
${ra(OUT['13-do-1024'])}
<p>4.61 → 38.05 ns over 1,024 characters, a straight line (≈ 0.03 ns per character): long secrets leak more. The constant-time function on the 64-character token:</p>
${ra(OUT['13-do-safe'])}
<p>64–67 ns in every row, no pattern — noise. Ten times slower than <code>===</code> (a native call) and irrelevant next to a 50,000 ns request.</p>

<h3>Can anyone see 2 ns through HTTP?</h3>
<p>Honestly now: a server checks an API key with <code>===</code> (<code>demo1/key-server.js</code>); a client on the <strong>same machine</strong> sends a guess wrong at the first character and one wrong at the last, 20,000 times each, alternating, over one keep-alive connection.</p>
${ra(OUT['13-tu-xa-1'])}
${ra(X1)}
${ra(X2)}
<p>Three runs: +125, −126, −42 ns — the sign flips. A request costs 56–59 µs with ~50 µs between p10 and p90, so 2 ns is invisible in 20,000 samples even on localhost; seeing it under ~100 ns of noise needs about (100/2)² ≈ 2,500× more samples — tens of millions of requests for <em>one</em> position. Research agrees on the scale: 15–100 µs resolvable across the Internet, ~100 ns on a LAN (Crosby et al., 2009).</p>
<p>Why bother, then? A longer secret leaks more (38 ns at 1 KB), a slower comparison leaks more, an attacker in the same data centre has less noise, and the attacker chooses the sample count. Above all, the fix is free — “probably not exploitable” is no reason to skip a free defence.</p>

<h3>The fix: <code>timingSafeEqual</code>, and the trap inside it</h3>
<p>Node ships a comparison that always looks at every byte: <code>crypto.timingSafeEqual(a, b)</code>. It takes two buffers — and they must have the same length:</p>
${ra(OUT['13-do-dai'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — the length check becomes the new leak.</strong> The usual wrapper <code>if (a.length !== b.length) return false</code> is fine when the length is public (every LabFlow ID session token has 52 characters) and a leak when it is secret. Let the exception escape and a wrong-length guess becomes a 500 instead of a 401 — a louder click than any timing.</p>
</div>
<p>LabFlow ID's toolkit removes the question: HMAC both sides with a random per-process key, then compare two 32-byte results. Any lengths, never throws:</p>
${ma('javascript', CODE.compare)}
${ra(OUT['13-safe-equal'])}
<p>Why HMAC with a random key, not plain SHA-256? Plain SHA-256 of any guess is computable offline; with a key born at startup and never stored, neither MAC is predictable, so the comparison reveals only “equal or not”.</p>

<h3>Better than comparing: do not compare at all</h3>
<p>The cleanest fix is to have no comparison of secrets at all. LabFlow ID v0.1 stores only the SHA-256 of each session token and finds the session by the digest of what arrives:</p>
${ma('javascript', SV_SESSION)}
${ra(OUT['13-v01-db'])}
${ra(OUT['13-v01-me'])}
<p>A leaked <code>data/db.json</code> holds digests, which cannot be presented as sessions; no secret-dependent branch remains for a refactor to break; and in Chapter 3 an index on the digest column does the lookup.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — “a fast hash, isn't that what Chapter 2 forbids?”</strong> The input decides. A token has 256 random bits — nothing to brute-force, a fast hash is enough. A password is short and human-chosen — a fast hash lets a thief try billions per second (Chapter 2). And line 28 of <code>src/server.js</code>, <code>user.password !== password</code>, is hole 1 <em>and</em> a non-constant-time comparison; Chapter 2 replaces it with argon2's <code>verify</code>.</p>
</div>

<h3>When to use which</h3>
${BANG_EN}

<h3>Where this bug really lives: webhook signatures</h3>
<p>A <strong>webhook</strong> is an HTTP request one service sends another when something happens — LabFlow ID telling LabFlow API “usr_2 was disabled”. The sender signs timestamp + body with an HMAC; the receiver recomputes and compares. Anyone can call the endpoint, the attacker controls the body, the answer is a clean yes/no, and “internal” endpoints are rarely rate-limited.</p>
${ma('javascript', WH_VERIFY)}
${ma('javascript', WH_ROUTES)}
${ra(OUT['13-webhook'])}
<ul>
<li><strong>Parsed body ⇒ BAD_SIGNATURE with nothing tampered:</strong> <code>express.json()</code> + <code>JSON.stringify</code> dropped the spaces of the pretty-printed body. Verify the <em>exact bytes</em> (<code>express.raw()</code>); Stripe's docs name this the most common cause of failures.</li>
<li><strong>Changed user ⇒ BAD_SIGNATURE:</strong> the HMAC doing its job (lesson 1.4).</li>
<li><strong>Replayed 10 minutes later ⇒ TOO_OLD:</strong> the signed timestamp stops resending forever.</li>
<li>The regex guarantees 64 hex characters, so <code>timingSafeEqual</code> always sees 32 + 32 bytes. GitHub: “Never use a plain == operator.”</li>
</ul>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Why not compare tokens with ===?”</strong> — It returns early at the first different character, so its running time depends on how much of the secret the guess got right. I measured about 2 ns over 64 characters in Node 22 — hard to exploit remotely, but the fix (<code>timingSafeEqual</code>, or better, look up a digest) costs nothing.</li>
<li><strong>“How do you verify a webhook?”</strong> — HMAC over timestamp + raw body with a shared secret, reject old timestamps, compare the signature in constant time, and keep the raw bytes (no re-serialising).</li>
<li><strong>“How do you store API keys?”</strong> — Show once, store only a SHA-256 digest (plus a visible prefix for support), look up by digest; a leaked table cannot be used to call the API.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo1/timing-naive.mjs strict</code>, <code>node demo1/timing-equal.mjs strict</code> and <code>node demo1/timing-equal.mjs safe</code> on your machine. Write down the first and last row of each. Your numbers will differ from ours; the <em>shape</em> (flat / stepped / flat) should not.</li>
<li>Start <code>node src/server.js</code> (v0.1), sign in as An, then print <code>data/db.json</code>'s sessions. Confirm the token you received appears nowhere in the file.</li>
<li>In <code>demo1/webhook.mjs</code>, explain in one sentence why receiver 1 fails, then send a request whose timestamp is 4 minutes old to <code>/hooks/raw</code> — what do you expect, and why?</li>
</ol>
<p><strong>Solution</strong> (our machine — outputs above): the file holds only <code>00ce0da2…</code>, the SHA-256 of <code>lfid_ses_Dfcgu3iL…</code>. Receiver 1 hashes different bytes from those signed. A 4-minute-old timestamp is inside the 300 s window, so it is accepted — the window trades clock drift against replay.</p>
<p><strong>Done when:</strong> you have three measurements whose shapes match ours, the database holds no usable token, and you can explain both webhook verdicts without looking at the code.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">timing side channel</span><span class="v">Leaking information through how long an operation takes, not through what it returns.</span></div>
  <div class="kv"><span class="k">constant-time comparison</span><span class="v">A comparison whose running time does not depend on where the inputs differ (<code>timingSafeEqual</code>).</span></div>
  <div class="kv"><span class="k">digest lookup</span><span class="v">Storing <code>sha256(token)</code> and finding the row by the digest of the presented token, so no secret is ever compared.</span></div>
  <div class="kv"><span class="k">double HMAC</span><span class="v">Hashing both inputs with a random per-process key before comparing, so lengths and contents are hidden.</span></div>
  <div class="kv"><span class="k">webhook</span><span class="v">An HTTP request a service sends to another when an event happens; signed so the receiver can trust it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>===</code> stops at the first difference: measured 4.61 → 6.56 ns over 64 characters (in steps), 4.61 → 38.05 ns over 1,024.</li>
<li>A benchmark whose input never changes and whose result is unused measures nothing (0.99 ns, flat).</li>
<li>Through HTTP on one machine the 2 ns hides in ±100 ns of noise — but the fix is free, so apply it.</li>
<li><code>timingSafeEqual</code> needs equal lengths; <code>safeEqual</code> (double HMAC) needs nothing.</li>
<li>Best of all: store <code>tokenDigest(token)</code> and look up — no comparison, and a leaked table is useless.</li>
<li>Webhooks: HMAC over timestamp + <em>raw</em> body, tolerance window, constant-time check.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-9-4-bi-mat-va-phu-thuoc', title: 'Applied in Node.js — lesson 9.4: secrets, dependencies and what your errors give away', sub: 'Same: === leaks timing, timingSafeEqual needs equal lengths, digests are better. That lesson adds a weak JWT secret cracked from one token (~880,000 guesses/s/core) and leaky errors; this one measures the leak and covers webhooks.', cta: 'OPEN NODE.JS LESSON →' })}
${lienKet({ khoa: 'api-design', bai: 'api-10-4-nhan-webhook', title: 'Also in API Design — lesson 10.4: receiving webhooks', sub: 'Same: signature over the raw body, constant-time check, 300 s tolerance. That lesson builds the whole receiver (Standard Webhooks, dedupe, ordering); this one is about the comparison itself.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>So sánh hai bí mật bằng === là một con bug</h2>
<p class="lead">Hệ đăng nhập nào cũng phải so bí mật: token phiên với cái đang lưu, chữ ký với chữ ký đáng lẽ phải có, API key với cơ sở dữ liệu. Cách hiển nhiên — <code>===</code> — trả lời đúng mà vẫn rò một chút: phần đầu bạn đoán đúng càng dài thì nó chạy càng lâu. Bài này đo chỗ rò đó trên chính máy bạn, cho thấy nó thật ra nhỏ cỡ nào, rồi bịt nó bằng một cách chẳng tốn gì — mà phần lớn là… đừng so sánh nữa.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích kênh rò thời gian (timing side channel) bằng số bạn tự đo, và nói thật nó khó khai thác tới đâu;</li>
<li>nhận ra một phép đo hiệu năng "nói dối" (và viết được phép đo không nói dối);</li>
<li>so bí mật bằng <code>timingSafeEqual</code> mà không sa vào cái bẫy độ dài của nó, hoặc bằng <code>safeEqual</code> trong bộ công cụ của LabFlow ID;</li>
<li>lưu token phiên dưới dạng digest (bản băm) rồi tra theo nó — đúng thiết kế LabFlow ID v0.1 đang dùng;</li>
<li>kiểm chữ ký webhook cho đúng: byte gốc, thời hạn, so trong thời gian không đổi.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "kiểm webhook thế nào?" và "sao không dùng <code>==</code>?" là câu phỏng vấn backend quen thuộc, và con bug webhook trong bài này được chính tài liệu của GitHub cảnh báo bằng chữ in đậm.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Ổ khoá số kiểu cũ kêu "tách" mỗi khi một bánh xoay đúng số: thử 0–9 ở bánh 1 tới khi nghe "tách", rồi sang bánh 2 — mười lần thử mỗi bánh thay vì mọi tổ hợp. <code>===</code> chính là ổ khoá đó: so từ trái sang và dừng ở chỗ khác đầu tiên, nên chuỗi đoán sai ở ký tự 0 trả về sớm hơn một chút so với chuỗi sai ở ký tự 40. Câu trả lời luôn đúng; <strong>thời gian</strong> là tiếng "tách" — gọi là <strong>timing side channel (kênh rò thời gian)</strong>.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đoán vị trí 0</span><span class="lz-d">Thử mọi ký tự đầu có thể; cái nào chạy lâu hơn một chút thì nhiều khả năng là đúng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giữ nó, đoán vị trí 1</span><span class="lz-d">Giờ là dò từng vị trí một: 64 × 64 lần thử cho token base64url 64 ký tự, chứ không phải 64<sup>64</sup>.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cái khó</span><span class="lz-d">Mỗi "lần thử" cần đo rất nhiều lần, vì tín hiệu tính bằng nano giây còn nhiễu tính bằng micro giây. Bao nhiêu lần? Đo thì biết.</span></div>
</div>

<h3>Đo nó — và gặp phép đo nói dối</h3>
<p>Một phép đo đầu tiên trông rất hợp lý: với mỗi vị trí, một chuỗi đoán đúng ngần ấy ký tự đầu, so một triệu lần, lấy trung vị 21 vòng.</p>
${ma('javascript', TN_LOOP)}
${ra(OUT['13-do-naive'])}
<p>Phẳng lì: 0,99 ns ở mọi dòng. Đó không phải bằng chứng <code>===</code> chạy hằng thời gian — 0,99 ns là một vòng lặp rỗng. <code>g</code> và <code>secret</code> không đổi trong vòng lặp, nên trình tối ưu của V8 được phép tính phép so <strong>một lần</strong>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — phép đo nhỏ (micro-benchmark) bị JIT tối ưu mất.</strong> Đầu vào không đổi mà kết quả không ai dùng thì có thể bị kéo ra khỏi vòng lặp (hoisting) hoặc xoá luôn, cho ra những con số phẳng và sai. Cách sửa: xoay vòng 8 bản sao riêng của mỗi chuỗi đoán (<code>gs[i &amp; 7]</code>) và <em>dùng</em> mọi kết quả (<code>hits++</code>). Bản đầu của máy chấm Lab 1 dính đúng con bug này.</p>
</div>

${ma('javascript', TE_CORE)}
${ra(OUT['13-do-strict'])}
<p>Giờ chỗ rò hiện ra. Nó <strong>nhỏ</strong> — 4,61 ns (sai ngay đầu) tới 6,56 ns (sai ở cuối), chừng 2 ns trên 64 ký tự — và tăng <strong>theo bậc</strong>: đúng 0, 1 và 8 ký tự tốn như nhau, 16 tốn hơn, 48 và 63 lại bằng nhau, vì V8 so cả một khối byte một lúc. Cho bí mật dài ra thì độ dốc lộ rõ:</p>
${ra(OUT['13-do-1024'])}
<p>4,61 → 38,05 ns trên 1.024 ký tự, một đường thẳng (≈ 0,03 ns mỗi ký tự): bí mật dài rò nhiều hơn. Còn hàm so hằng thời gian trên token 64 ký tự:</p>
${ra(OUT['13-do-safe'])}
<p>64–67 ns ở mọi dòng, không quy luật — chỉ là nhiễu. Chậm hơn <code>===</code> mười lần (gọi xuống mã native) và chẳng đáng kể cạnh một request 50.000 ns.</p>

<h3>Có ai nhìn thấy 2 ns qua HTTP không?</h3>
<p>Nói thật: một máy chủ kiểm API key bằng <code>===</code> (<code>demo1/key-server.js</code>); một client trên <strong>cùng máy</strong> gửi chuỗi đoán sai ở ký tự đầu và chuỗi sai ở ký tự cuối, mỗi cái 20.000 lần, xen kẽ, trên một kết nối keep-alive.</p>
${ra(OUT['13-tu-xa-1'])}
${ra(X1)}
${ra(X2)}
<p>Ba lần chạy: +125, −126, −42 ns — dấu đổi qua đổi lại. Mỗi request tốn 56–59 µs, khoảng p10–p90 chừng 50 µs, nên 2 ns vô hình trong 20.000 mẫu ngay trên localhost; muốn thấy nó giữa ~100 ns nhiễu cần cỡ (100/2)² ≈ 2.500 lần nhiều mẫu hơn — hàng chục triệu request cho <em>một</em> vị trí. Nghiên cứu cũng ra cùng bậc: phân giải được 15–100 µs qua Internet, ~100 ns trong mạng nội bộ (Crosby và cộng sự, 2009).</p>
<p>Vậy bận tâm làm gì? Bí mật dài hơn rò nhiều hơn (38 ns ở 1 KB), phép so chậm hơn rò nhiều hơn, kẻ tấn công cùng trung tâm dữ liệu ít nhiễu hơn, và họ tự chọn số mẫu. Trên hết, cách sửa miễn phí — "chắc không khai thác được" không phải lý do bỏ qua một lớp phòng thủ miễn phí.</p>

<h3>Cách sửa: <code>timingSafeEqual</code>, và cái bẫy bên trong nó</h3>
<p>Node có sẵn một phép so luôn nhìn hết mọi byte: <code>crypto.timingSafeEqual(a, b)</code>. Nó nhận hai buffer — và chúng phải dài bằng nhau:</p>
${ra(OUT['13-do-dai'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — phép kiểm độ dài thành chỗ rò mới.</strong> Lớp bọc quen thuộc <code>if (a.length !== b.length) return false</code> ổn khi độ dài công khai (token phiên nào của LabFlow ID cũng 52 ký tự) và là chỗ rò khi độ dài là bí mật. Để lỗi lọt ra thì đoán sai độ dài thành 500 thay vì 401 — tiếng "tách" to hơn mọi chênh lệch thời gian.</p>
</div>
<p>Bộ công cụ của LabFlow ID xoá luôn câu hỏi: HMAC cả hai phía bằng khoá ngẫu nhiên theo tiến trình, rồi so hai kết quả 32 byte. Độ dài nào cũng được, không bao giờ ném lỗi:</p>
${ma('javascript', CODE.compare)}
${ra(OUT['13-safe-equal'])}
<p>Sao là HMAC khoá ngẫu nhiên mà không phải SHA-256 thường? SHA-256 của mọi chuỗi đoán tính được ở nhà; với khoá sinh lúc khởi động và không bao giờ lưu, không MAC nào đoán trước được, nên phép so chỉ khai ra "bằng hay không".</p>

<h3>Tốt hơn cả so sánh: đừng so sánh</h3>
<p>Cách sạch nhất là không có phép so bí mật nào. LabFlow ID v0.1 chỉ lưu SHA-256 của mỗi token phiên và tìm phiên theo digest của thứ được gửi tới:</p>
${ma('javascript', SV_SESSION)}
${ra(OUT['13-v01-db'])}
${ra(OUT['13-v01-me'])}
<p><code>data/db.json</code> bị lộ chỉ chứa digest, không trình ra như phiên được; không còn nhánh phụ thuộc bí mật để một lần refactor làm hỏng; và ở Chương 3 một chỉ mục trên cột digest sẽ lo việc tra.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "băm nhanh, chẳng phải Chương 2 cấm sao?"</strong> Đầu vào quyết định. Token có 256 bit ngẫu nhiên — chẳng có gì để dò, băm nhanh là đủ. Mật khẩu ngắn và do người chọn — băm nhanh cho kẻ trộm thử hàng tỉ lần mỗi giây (Chương 2). Còn dòng 28 của <code>src/server.js</code>, <code>user.password !== password</code>, vừa là lỗ 1 <em>vừa</em> là phép so không hằng thời gian; Chương 2 thay nó bằng <code>verify</code> của argon2.</p>
</div>

<h3>Khi nào dùng cái gì</h3>
${BANG_VI}

<h3>Chỗ con bug này thật sự sống: chữ ký webhook</h3>
<p><strong>Webhook</strong> là HTTP request một dịch vụ gửi dịch vụ khác khi có chuyện xảy ra — LabFlow ID báo LabFlow API "usr_2 đã bị khoá". Bên gửi ký dấu thời gian + thân bằng HMAC; bên nhận tính lại rồi so. Ai cũng gọi được endpoint, kẻ tấn công điều khiển thân request, câu trả lời là có/không rõ ràng, và endpoint "nội bộ" hiếm khi bị giới hạn tần suất.</p>
${ma('javascript', WH_VERIFY)}
${ma('javascript', WH_ROUTES)}
${ra(OUT['13-webhook'])}
<ul>
<li><strong>Thân đã parse ⇒ BAD_SIGNATURE dù chẳng ai sửa gì:</strong> <code>express.json()</code> + <code>JSON.stringify</code> làm mất dấu cách của thân được định dạng đẹp. Kiểm <em>đúng các byte</em> (<code>express.raw()</code>); tài liệu Stripe gọi đây là nguyên nhân phổ biến nhất.</li>
<li><strong>Đổi người dùng ⇒ BAD_SIGNATURE:</strong> HMAC làm đúng việc (bài 1.4).</li>
<li><strong>Gửi lại sau 10 phút ⇒ TOO_OLD:</strong> dấu thời gian được ký chặn việc gửi lại mãi mãi (replay — phát lại).</li>
<li>Regex bảo đảm đủ 64 ký tự hex, nên <code>timingSafeEqual</code> luôn nhận 32 + 32 byte. GitHub: "Never use a plain == operator."</li>
</ul>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Sao không so token bằng ===?"</strong> — Nó thoát sớm ở ký tự khác đầu tiên, nên thời gian chạy phụ thuộc chuỗi đoán đúng được bao nhiêu phần bí mật. Tôi đo được khoảng 2 ns trên 64 ký tự với Node 22 — khó khai thác từ xa, nhưng cách sửa (<code>timingSafeEqual</code>, hoặc tốt hơn là tra digest) chẳng tốn gì.</li>
<li><strong>"Kiểm webhook thế nào?"</strong> — HMAC trên dấu thời gian + thân gốc với bí mật dùng chung, từ chối dấu thời gian cũ, so chữ ký trong thời gian không đổi, và giữ nguyên byte gốc (không serialize lại).</li>
<li><strong>"Lưu API key thế nào?"</strong> — Hiện đúng một lần, chỉ lưu digest SHA-256 (kèm tiền tố nhìn thấy được để hỗ trợ), tra theo digest; bảng bị lộ cũng không gọi API được.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo1/timing-naive.mjs strict</code>, <code>node demo1/timing-equal.mjs strict</code> và <code>node demo1/timing-equal.mjs safe</code> trên máy bạn. Ghi lại dòng đầu và dòng cuối của mỗi lần. Số của bạn sẽ khác của mình; <em>hình dạng</em> (phẳng / bậc thang / phẳng) thì không được khác.</li>
<li>Bật <code>node src/server.js</code> (v0.1), đăng nhập bằng An, rồi in phần sessions của <code>data/db.json</code>. Xác nhận token bạn nhận được không xuất hiện ở đâu trong tệp.</li>
<li>Trong <code>demo1/webhook.mjs</code>, giải thích bằng một câu vì sao bên nhận 1 thất bại, rồi gửi một request có dấu thời gian cũ 4 phút tới <code>/hooks/raw</code> — bạn đoán kết quả gì, vì sao?</li>
</ol>
<p><strong>Lời giải</strong> (máy của mình — output ở trên): tệp chỉ giữ <code>00ce0da2…</code>, bản SHA-256 của <code>lfid_ses_Dfcgu3iL…</code>. Bên nhận 1 băm các byte khác với các byte đã ký. Dấu thời gian cũ 4 phút vẫn trong cửa sổ 300 giây nên được nhận — cửa sổ đánh đổi giữa lệch đồng hồ và phát lại.</p>
<p><strong>Đạt khi:</strong> bạn có ba lần đo với hình dạng khớp của mình, cơ sở dữ liệu không chứa token nào dùng được, và bạn giải thích được cả hai phán quyết webhook mà không cần nhìn mã.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">timing side channel (kênh rò thời gian)</span><span class="v">Rò thông tin qua việc thao tác chạy mất bao lâu, chứ không qua thứ nó trả về.</span></div>
  <div class="kv"><span class="k">constant-time comparison (so sánh hằng thời gian)</span><span class="v">Phép so mà thời gian chạy không phụ thuộc chỗ hai đầu vào khác nhau (<code>timingSafeEqual</code>).</span></div>
  <div class="kv"><span class="k">digest lookup (tra theo bản băm)</span><span class="v">Lưu <code>sha256(token)</code> và tìm dòng bằng digest của token được trình ra, nên không bí mật nào bị đem so.</span></div>
  <div class="kv"><span class="k">double HMAC (HMAC hai lớp)</span><span class="v">Băm cả hai đầu vào bằng một khoá ngẫu nhiên theo tiến trình trước khi so, để giấu cả độ dài lẫn nội dung.</span></div>
  <div class="kv"><span class="k">webhook</span><span class="v">HTTP request một dịch vụ gửi cho dịch vụ khác khi có sự kiện; được ký để bên nhận tin được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>===</code> dừng ở chỗ khác đầu tiên: đo được 4,61 → 6,56 ns trên 64 ký tự (theo bậc), 4,61 → 38,05 ns trên 1.024 ký tự.</li>
<li>Phép đo có đầu vào không đổi và kết quả không ai dùng thì chẳng đo được gì (0,99 ns, phẳng).</li>
<li>Qua HTTP trên cùng một máy, 2 ns chìm trong ±100 ns nhiễu — nhưng cách sửa miễn phí, nên cứ sửa.</li>
<li><code>timingSafeEqual</code> cần hai độ dài bằng nhau; <code>safeEqual</code> (HMAC hai lớp) chẳng cần gì.</li>
<li>Tốt nhất: lưu <code>tokenDigest(token)</code> rồi tra — không có phép so, và bảng bị lộ cũng vô dụng.</li>
<li>Webhook: HMAC trên dấu thời gian + thân <em>gốc</em>, cửa sổ dung sai, so trong thời gian không đổi.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-9-4-bi-mat-va-phu-thuoc', title: 'Áp vào Node.js — bài 9.4: bí mật, dependency và những gì lỗi của bạn khai ra', sub: 'Giống: === rò thời gian, timingSafeEqual cần cùng độ dài, digest thì tốt hơn. Bài đó thêm bí mật JWT yếu bẻ từ một token (~880.000 lần thử/giây/nhân) và lỗi khai thông tin; bài này đo chỗ rò và nói về webhook.', cta: 'MỞ BÀI NODE.JS →' })}
${lienKet({ khoa: 'api-design', bai: 'api-10-4-nhan-webhook', title: 'Cũng có ở API Design — bài 10.4: nhận webhook', sub: 'Giống: chữ ký trên thân gốc, so hằng thời gian, dung sai 300 giây. Bài đó dựng trọn bên nhận (Standard Webhooks, chống trùng, thứ tự); bài này nói về chính phép so.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
