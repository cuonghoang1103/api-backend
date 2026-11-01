/**
 * Authentication · Chương 2 · 2.2 — Chọn và chỉnh hàm băm, bằng phép đo. Slug giữ: auth-2-2-chon-va-chinh.
 * Output thật (_ma.mjs): tune 100 ms / 256 MiB ⇒ m=64 MiB t=2 p=1 86,5 ms; 40 đăng nhập: 4 luồng p95 850 ms +194 MiB, 10 luồng
 * p95 698 ms +578 MiB, 64 luồng p50 537 ms +2.498 MiB, p=4 một lượt 27 ms; argon2 in "m=…,p=…,t=…" (đọc theo vị trí ⇒ null);
 * scrypt N=2^17 maxmem mặc định 32 MiB ⇒ ERR_CRYPTO_INVALID_SCRYPT_PARAMS, nâng maxmem ⇒ 275 ms; bcrypt 69 ký tự = 89 byte ⇒ đuôi khác vẫn khớp.
 * Trùng nodejs 8.1 (64 đăng nhập song song, hashSync, bẫy 72 byte) ⇒ dẫn sang, không đo lại.
 */
import G from '../giang/auth-02-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const TU = CODE.tune.split('\n');
const TUNE_CORE = TU.slice(TU.findIndex((l) => l.startsWith('const BUDGET_MS')), TU.findIndex((l) => l.startsWith('const median'))).join('\n').trim();
const PARAMS_LINE = CODE.hash.split('\n').slice(5, 7).join('\n');

const NGUON_EN = [
  nguon('🦉', 'OWASP — Password Storage Cheat Sheet', 'argon2id m=19456 t=2 p=1, m=47104 t=1, m=12288 t=3 “equal level of defense”; scrypt N=2^17 r=8 p=1; bcrypt cost ≥ 10, 72-byte limit; PBKDF2-SHA256 600,000 (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'),
  nguon('📘', 'RFC 9106 — Argon2 Memory-Hard Function', 'Defines m, t, p and the argon2id variant; section 4 explains how to choose parameters for your hardware (read 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9106.html'),
  nguon('⚙️', 'Node.js docs — crypto.scrypt', 'maxmem: “Memory upper bound. It is an error when (approximately) 128 * N * r &gt; maxmem. Default: 32 * 1024 * 1024” (read 01/11/2026).', 'https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Password Storage Cheat Sheet', 'argon2id m=19456 t=2 p=1, m=47104 t=1, m=12288 t=3 "bảo vệ ngang nhau"; scrypt N=2^17 r=8 p=1; bcrypt cost ≥ 10, giới hạn 72 byte; PBKDF2-SHA256 600.000 vòng (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'),
  nguon('📘', 'RFC 9106 — hàm Argon2 tốn bộ nhớ', 'Định nghĩa m, t, p và biến thể argon2id; mục 4 nói cách chọn tham số theo phần cứng của bạn (đọc 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9106.html'),
  nguon('⚙️', 'Tài liệu Node.js — crypto.scrypt', 'maxmem: lỗi khi (xấp xỉ) 128 * N * r &gt; maxmem; mặc định 32 * 1024 * 1024 (đọc 01/11/2026).', 'https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Algorithm</th><th>Each guess costs</th><th>Pick it when</th><th>Watch out for</th></tr></thead>
<tbody>
<tr><td><strong>argon2id</strong> (<code>argon2</code> 0.45.1)</td><td>time + memory (m, t, p)</td><td>default for new systems</td><td>a native module (prebuilt for common platforms); parse parameters by name</td></tr>
<tr><td>scrypt (<code>node:crypto</code>)</td><td>time + memory (N, r, p)</td><td>no native dependency allowed</td><td><code>maxmem</code> 32 MiB default ⇒ OWASP's N throws</td></tr>
<tr><td>bcrypt (<code>bcrypt</code> 6.0.0)</td><td>time only (cost)</td><td>existing bcrypt rows, ecosystems built on it</td><td>72 bytes; cost ≥ 10</td></tr>
<tr><td>PBKDF2-HMAC-SHA256</td><td>time only (iterations)</td><td>FIPS-140 compliance is required</td><td>600,000 iterations; GPU-friendly</td></tr>
<tr><td>SHA-256 / MD5 / SHA-1</td><td>nothing</td><td>never for passwords</td><td>lesson 2.1</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Thuật toán</th><th>Mỗi lần đoán tốn</th><th>Chọn khi</th><th>Cẩn thận</th></tr></thead>
<tbody>
<tr><td><strong>argon2id</strong> (<code>argon2</code> 0.45.1)</td><td>thời gian + bộ nhớ (m, t, p)</td><td>mặc định cho hệ mới</td><td>là module native (có bản dựng sẵn cho nền tảng phổ biến); đọc tham số theo tên</td></tr>
<tr><td>scrypt (<code>node:crypto</code>)</td><td>thời gian + bộ nhớ (N, r, p)</td><td>không được phép dùng module native</td><td><code>maxmem</code> mặc định 32 MiB ⇒ N của OWASP ném lỗi</td></tr>
<tr><td>bcrypt (<code>bcrypt</code> 6.0.0)</td><td>chỉ thời gian (cost)</td><td>đã có sẵn dòng bcrypt, hệ sinh thái dựa trên nó</td><td>72 byte; cost ≥ 10</td></tr>
<tr><td>PBKDF2-HMAC-SHA256</td><td>chỉ thời gian (số vòng)</td><td>bắt buộc tuân thủ FIPS-140</td><td>600.000 vòng; GPU chạy rất tốt</td></tr>
<tr><td>SHA-256 / MD5 / SHA-1</td><td>không gì cả</td><td>không bao giờ cho mật khẩu</td><td>bài 2.1</td></tr>
</tbody>
</table>`;

export default {
  title: '2.2 — Choosing and tuning the hash, by measurement|||2.2 — Chọn và chỉnh hàm băm, bằng phép đo',
  slug: 'auth-2-2-chon-va-chinh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'argon2id, scrypt, bcrypt, PBKDF2 — cái nào cho hoàn cảnh nào; chọn tham số bằng HAI ngân sách đo trên máy chạy thật (≤ 100 ms mỗi lượt, ≤ RAM ÷ số luồng băm) ⇒ m=64 MiB t=2 p=1, 86,5 ms; 40 người bấm đăng nhập cùng lúc (4/10/64 luồng, p=4) đo p50/p95/RAM; chuỗi tự mô tả đọc theo TÊN (gói argon2 in m,p,t); bẫy scrypt maxmem 32 MiB và bcrypt 72 byte.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Choosing and tuning the hash, by measurement</h2>
<p class="lead">Lesson 2.1 showed that every guess must be expensive. “How expensive?” has a wrong answer that most projects use — copy <code>cost: 12</code> or <code>memoryCost: 65536</code> from a blog post — and a right one: set a latency budget and a memory budget for your login endpoint, measure on the machine that will run it, and take the strongest parameters that fit. This lesson does that for LabFlow ID and then breaks it with forty simultaneous logins.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>choose between argon2id, scrypt, bcrypt and PBKDF2 and defend the choice;</li>
<li>derive argon2id's <code>m</code>, <code>t</code>, <code>p</code> from two budgets with a script you can rerun on any machine;</li>
<li>predict latency and RAM when many users sign in at once, and size <code>UV_THREADPOOL_SIZE</code>;</li>
<li>read a self-describing hash string correctly — by name, not by position;</li>
<li>avoid two shipping traps: scrypt's 32 MiB <code>maxmem</code> and bcrypt's 72 bytes.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> “why those parameters?” is the follow-up to every “we use argon2/bcrypt” in a code review or interview. After this lesson your answer is a table you measured, not a number you copied.</p>
</div>

<h3>An everyday picture first</h3>
<p>Some bank safes open only ten minutes after the right code is entered. The cashier waits ten minutes once a day; a robber who needs thousands of tries cannot finish before morning. A password hash is that bargain: a real login pays the cost <em>once</em>, an attacker with a stolen table pays it for <em>every guess</em>. argon2id adds a second price: every try also needs a desk-sized pile of memory (here 64 MiB), which is what GPUs — thousands of cores, little memory each — handle worst. Your job is to pick the highest price your login endpoint can afford.</p>

<h3>Four candidates</h3>
${BANG_EN}
<p>LabFlow ID uses <strong>argon2id</strong> (the winner of the 2015 Password Hashing Competition, standardised as RFC 9106). It has three knobs: <code>m</code> — memory per hash in KiB; <code>t</code> — passes over that memory; <code>p</code> — lanes that can run in parallel.</p>

<h3>Measure, with two budgets</h3>
<p>Two budgets, both written down: <strong>≤ 100 ms per hash</strong> (one login = one hash; the user should not notice), and <strong>256 MiB of RAM for hashing</strong>. Node runs argon2 in libuv's thread pool (<code>UV_THREADPOOL_SIZE</code>, default 4), so up to 4 hashes run at once and each may use at most 256 ÷ 4 = 64 MiB.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Request arrives</span><span class="lz-d">The event loop parses it and calls <code>argon2.verify</code> — it does not hash on the main thread.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Queue for a thread</span><span class="lz-d">libuv's pool has <code>UV_THREADPOOL_SIZE</code> slots (4 by default). Login 5 waits for a free slot.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hash</span><span class="lz-d">The thread allocates <code>m</code> (64 MiB), makes <code>t</code> passes over it, frees it. ≈ 86 ms here.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Answer</span><span class="lz-d">Latency = waiting + hashing; RAM = busy threads × m. Both budgets come from these two lines.</span></div>
</div>
${ma('javascript', TUNE_CORE)}
${ra(OUT['22-tune'])}
<p>With the time budget alone the script would take <strong>128 MiB, t=1</strong> (85.3 ms) — the most memory that is fast enough. The memory budget rules it out (<code>#</code>): four logins at once would need 512 MiB. The winner is <strong>m = 64 MiB, t = 2, p = 1 → 86.5 ms</strong>, above every OWASP minimum set (m=19 MiB t=2, m=46 MiB t=1, m=12 MiB t=3, which OWASP says give “an equal level of defense”). Those three numbers go into one constant:</p>
${ma('javascript', PARAMS_LINE)}
<p>For comparison with the Node.js course: OWASP's m=19 MiB t=2 takes 26.1 ms here (Node.js 8.1 measured 21.7 ms — same order of magnitude; machine load at the time of measuring differs).</p>

<h3>Forty people press “Sign in” at once</h3>
<p>A budget for one login says nothing about a burst. <code>demo2/load.mjs</code> starts N verifications at the same instant and records how long each <em>user</em> waited, plus how much the process's RSS grew (the first hash ran before the baseline, so “+1 MiB” for one login is expected):</p>
${ra(OUT['22-load'])}
<ul>
<li><strong>4 threads (Node's default):</strong> 40 logins queue in batches of 4 — median 511 ms, the slowest 854 ms. RAM +194 MiB = three more 64 MiB blocks: memory is exactly <em>threads × m</em>.</li>
<li><strong>10 threads (one per core):</strong> p95 drops to 698 ms, RAM +578 MiB (nine more blocks).</li>
<li><strong>64 threads:</strong> the machine still has 10 cores, so nobody is served faster (median 537 ms), but RAM jumps by <strong>2,498 MiB</strong>. More threads than cores buys memory pressure, not speed.</li>
<li><strong>p = 4:</strong> one login takes 27 ms because the four lanes run in parallel on extra cores; under 40 logins p95 is 529 ms. It is a valid choice when cores are idle — LabFlow ID keeps p = 1 so that “one login = one core” and capacity stays simple arithmetic.</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Trap — sizing by one request.</strong> “86 ms per login” is true at 3 a.m. At 7:59 before an exam, 40 students signing in see up to 0.85 s with the default pool, and if you “fix” it by raising the pool to 64, the container needs 2.5 GB more and gets OOM-killed. Size the pool to the cores, and memory to <code>threads × m</code>. Never use <code>hashSync</code> in a server — Node.js 8.1 measured it freezing <code>/health</code> for 2,784 ms.</p>
</div>

<h3>Read the string by name, not by position</h3>
${ra(OUT['22-format'])}
<p>The hash string carries everything: <code>argon2id</code>, version 19, parameters, a 16-byte salt and a 32-byte hash. But look at the order: the <code>argon2</code> package writes <code>m=65536,p=1,t=2</code>. A regex written from a blog's example (<code>m=…,t=…,p=…</code>) returns <code>null</code>; code that treats “cannot read” as “outdated” then re-hashes on <strong>every</strong> login — double the CPU for each sign-in, silently. LabFlow ID's <code>describe()</code> splits the parameters into key=value pairs; <code>argon2.needsRehash(stored, PARAMS)</code> is the library's own answer.</p>

<h3>Two traps that ship</h3>
<p><strong>scrypt with OWASP's parameters.</strong> scrypt needs no extra package — it is in <code>node:crypto</code>. OWASP's minimum is N=2<sup>17</sup>, r=8, p=1, which needs 128 × N × r = 128 MiB. Node's <code>maxmem</code> defaults to 32 MiB:</p>
${ra(OUT['22-scrypt'])}
<p>The message says “memory limit exceeded”, so the tempting fix is a smaller N — a cheaper guess for every attacker. The right fix is <code>maxmem</code> just above 128 × N × r (275 ms per hash here, versus 86 ms for our argon2id).</p>
<p><strong>bcrypt's 72 bytes.</strong> bcrypt reads only the first 72 bytes of its input, and Vietnamese letters take 2–3 bytes each in UTF-8:</p>
${ra(OUT['22-bcrypt72'])}
<p>A 69-character sentence is already 89 bytes, so a completely different ending verifies. Node.js 8.1 shows this trap in depth; here it is one more reason LabFlow ID uses argon2id, which has no such limit. If you must keep bcrypt, cap input at 72 bytes and tell the user — never truncate silently.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Why these argon2 parameters?”</strong> — From two budgets measured on our production hardware: ≤ 100 ms per hash and ≤ 64 MiB per hashing thread; the script picks the most memory, then the most passes, that fit. We re-run it when the hardware changes; old rows upgrade on login.</li>
<li><strong>“bcrypt or argon2?”</strong> — argon2id for new systems (memory-hard, no 72-byte limit); keep bcrypt rows working and migrate them on login.</li>
<li><strong>“Login is slow under load — what do you check?”</strong> — Thread pool size versus cores, <code>threads × m</code> versus the container's memory limit, and any synchronous hashing on the event loop.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo2/tune.mjs 100 256</code> on your machine. Then run <code>node demo2/tune.mjs 250 512</code>. Write down both choices.</li>
<li>Run <code>node demo2/load.mjs 40 1</code> with <code>UV_THREADPOOL_SIZE</code> = 4 and = your number of cores. Compute <code>threads × 64 MiB</code> and compare it with the RSS line.</li>
<li>Write <code>needsRehash(stored)</code> that returns true when <code>m &lt; 65536</code> or <code>t &lt; 2</code> — reading parameters by name — and test it on <code>$argon2id$v=19$m=19456,p=1,t=2$…</code>.</li>
</ol>
<p><strong>Solution</strong> (our machine): budget 100/256 ⇒ m=64 MiB t=2 (86.5 ms); a 512 MiB budget lifts the per-thread cap to 128 MiB and the 250 ms budget then picks m=128 MiB t=2 (186.5 ms when we ran it). RSS grows by about (threads − 1) × 64 MiB — +194 MiB at 4 threads, +578 MiB at 10. For 3: split <code>m=19456,p=1,t=2</code> on commas, then on <code>=</code>; <code>m = 19456 &lt; 65536</code> ⇒ true — exactly what <code>describe()</code> + <code>needsRehash()</code> in <code>src/passwords/hash.js</code> do.</p>
<p><strong>Done when:</strong> you can state your own machine's PARAMS with both budgets, predict the RSS of a 40-login burst within ~10%, and your parser handles <code>m,p,t</code> in any order.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">argon2id</span><span class="v">Memory-hard password hash (RFC 9106); knobs m (KiB of memory), t (passes), p (lanes).</span></div>
  <div class="kv"><span class="k">latency budget</span><span class="v">The longest one hash may take on your hardware — here 100 ms.</span></div>
  <div class="kv"><span class="k">thread pool (libuv)</span><span class="v">Where Node runs crypto and file work; <code>UV_THREADPOOL_SIZE</code>, default 4. Memory for hashing = threads × m.</span></div>
  <div class="kv"><span class="k">parallelism (p)</span><span class="v">Lanes of one argon2 hash that can run on separate cores: faster alone, more cores per login.</span></div>
  <div class="kv"><span class="k">maxmem (scrypt)</span><span class="v">Node's guard on scrypt memory: 32 MiB by default, below OWASP's 128 MiB.</span></div>
  <div class="kv"><span class="k">72-byte limit (bcrypt)</span><span class="v">bcrypt ignores input after byte 72 — about 25–35 Vietnamese characters.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>argon2id by default; scrypt if no native module is allowed (raise <code>maxmem</code>); bcrypt only for existing rows (72 bytes).</li>
<li>Two budgets measured on the real machine: ≤ 100 ms, ≤ 64 MiB per thread ⇒ m=64 MiB t=2 p=1, 86.5 ms.</li>
<li>Memory = threads × m: 4 threads +194 MiB, 64 threads +2,498 MiB and no faster.</li>
<li>Bursts queue: 40 logins, p95 850 ms with the default pool.</li>
<li>Parse <code>m=…,p=…,t=…</code> by name; a position-based regex re-hashes every login.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Applied in Node.js — lesson 8.1: storing passwords', sub: 'Same: argon2id first, bcrypt/scrypt as fallback, self-describing strings, tuning by measuring. That lesson measures 64 parallel logins, hashSync freezing /health for 2,784 ms and the 72-byte trap with a full Vietnamese sentence; this one derives parameters from two budgets and measures thread-pool size and p.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Chọn và chỉnh hàm băm, bằng phép đo</h2>
<p class="lead">Bài 2.1 cho thấy mỗi lần đoán phải đắt. "Đắt cỡ nào?" có một câu trả lời sai mà phần lớn dự án đang dùng — chép <code>cost: 12</code> hay <code>memoryCost: 65536</code> từ một bài blog — và một câu trả lời đúng: đặt ngân sách độ trễ và ngân sách bộ nhớ cho endpoint đăng nhập, đo trên chính máy sẽ chạy nó, rồi lấy tham số mạnh nhất còn vừa. Bài này làm đúng việc đó cho LabFlow ID rồi phá nó bằng bốn mươi lượt đăng nhập cùng lúc.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>chọn giữa argon2id, scrypt, bcrypt và PBKDF2 và bảo vệ được lựa chọn;</li>
<li>suy <code>m</code>, <code>t</code>, <code>p</code> của argon2id từ hai ngân sách bằng một script chạy lại được trên máy nào cũng được;</li>
<li>dự đoán độ trễ và RAM khi nhiều người đăng nhập cùng lúc, và chọn cỡ <code>UV_THREADPOOL_SIZE</code>;</li>
<li>đọc đúng chuỗi băm tự mô tả — theo tên, không theo vị trí;</li>
<li>tránh hai cái bẫy hay lên production: <code>maxmem</code> 32 MiB của scrypt và 72 byte của bcrypt.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "sao lại tham số đó?" là câu hỏi tiếp theo sau mọi câu "bọn em dùng argon2/bcrypt" khi review code hay phỏng vấn. Học xong bài này câu trả lời của bạn là một bảng tự đo, không phải một con số chép về.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Có những két ngân hàng chỉ mở mười phút sau khi nhập đúng mã. Thu ngân chờ mười phút mỗi ngày một lần; tên cướp cần hàng nghìn lần thử thì không xong trước sáng. Hàm băm mật khẩu là món hời đó: một lượt đăng nhập thật trả giá <em>một lần</em>, kẻ tấn công cầm bảng bị trộm trả giá cho <em>mỗi lần đoán</em>. argon2id thêm cái giá thứ hai: mỗi lần thử còn cần cả một "bàn làm việc" bộ nhớ (ở đây 64 MiB), đúng thứ GPU — hàng nghìn nhân, mỗi nhân ít bộ nhớ — xử lý kém nhất. Việc của bạn là chọn cái giá cao nhất mà endpoint đăng nhập còn chịu được.</p>

<h3>Bốn ứng viên</h3>
${BANG_VI}
<p>LabFlow ID dùng <strong>argon2id</strong> (thắng cuộc thi Password Hashing Competition 2015, chuẩn hoá thành RFC 9106). Nó có ba núm chỉnh: <code>m</code> — bộ nhớ mỗi lần băm, tính bằng KiB; <code>t</code> — số lượt đi qua vùng nhớ đó; <code>p</code> — số làn có thể chạy song song.</p>

<h3>Đo, với hai ngân sách</h3>
<p>Hai ngân sách, viết ra giấy: <strong>≤ 100 ms mỗi lần băm</strong> (một lượt đăng nhập = một lần băm; người dùng không được cảm thấy), và <strong>256 MiB RAM cho việc băm</strong>. Node chạy argon2 trong thread pool của libuv (<code>UV_THREADPOOL_SIZE</code>, mặc định 4), nên tối đa 4 lần băm chạy cùng lúc và mỗi lần chỉ được dùng 256 ÷ 4 = 64 MiB.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Request tới</span><span class="lz-d">Event loop đọc nó và gọi <code>argon2.verify</code> — việc băm không chạy trên luồng chính.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Xếp hàng chờ luồng</span><span class="lz-d">Pool của libuv có <code>UV_THREADPOOL_SIZE</code> chỗ (mặc định 4). Lượt đăng nhập thứ 5 chờ một chỗ trống.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Băm</span><span class="lz-d">Luồng cấp phát <code>m</code> (64 MiB), đi <code>t</code> lượt qua vùng nhớ, rồi giải phóng. ≈ 86 ms ở đây.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Trả lời</span><span class="lz-d">Độ trễ = thời gian chờ + thời gian băm; RAM = số luồng đang bận × m. Cả hai ngân sách đều đến từ hai dòng này.</span></div>
</div>
${ma('javascript', TUNE_CORE)}
${ra(OUT['22-tune'])}
<p>Nếu chỉ có ngân sách thời gian, script sẽ lấy <strong>128 MiB, t=1</strong> (85,3 ms) — bộ nhớ lớn nhất còn đủ nhanh. Ngân sách bộ nhớ loại nó (<code>#</code>): bốn lượt đăng nhập cùng lúc sẽ cần 512 MiB. Người thắng là <strong>m = 64 MiB, t = 2, p = 1 → 86,5 ms</strong>, cao hơn mọi bộ tối thiểu của OWASP (m=19 MiB t=2, m=46 MiB t=1, m=12 MiB t=3 — OWASP nói chúng cho "mức bảo vệ ngang nhau"). Ba con số đó vào một hằng số:</p>
${ma('javascript', PARAMS_LINE)}
<p>Để so với khoá Node.js: bộ m=19 MiB t=2 của OWASP mất 26,1 ms ở đây (Node.js 8.1 đo được 21,7 ms — cùng bậc độ lớn; tải máy lúc đo khác nhau).</p>

<h3>Bốn mươi người cùng bấm "Đăng nhập"</h3>
<p>Ngân sách cho một lượt chẳng nói gì về một đợt dồn dập. <code>demo2/load.mjs</code> khởi động N lần kiểm cùng một khoảnh khắc và ghi lại mỗi <em>người dùng</em> phải chờ bao lâu, cộng với RSS của tiến trình tăng bao nhiêu (lần băm đầu chạy trước mốc đo, nên "+1 MiB" cho một lượt là bình thường):</p>
${ra(OUT['22-load'])}
<ul>
<li><strong>4 luồng (mặc định của Node):</strong> 40 lượt xếp hàng theo từng mẻ 4 — trung vị 511 ms, người chậm nhất 854 ms. RAM +194 MiB = thêm ba khối 64 MiB: bộ nhớ đúng bằng <em>số luồng × m</em>.</li>
<li><strong>10 luồng (mỗi nhân một luồng):</strong> p95 giảm còn 698 ms, RAM +578 MiB (thêm chín khối).</li>
<li><strong>64 luồng:</strong> máy vẫn chỉ có 10 nhân, nên chẳng ai được phục vụ nhanh hơn (trung vị 537 ms), nhưng RAM vọt thêm <strong>2.498 MiB</strong>. Nhiều luồng hơn số nhân chỉ mua thêm áp lực bộ nhớ, không mua tốc độ.</li>
<li><strong>p = 4:</strong> một lượt mất 27 ms vì bốn làn chạy song song trên các nhân còn rảnh; với 40 lượt p95 là 529 ms. Đó là lựa chọn hợp lệ khi nhân còn rảnh — LabFlow ID giữ p = 1 để "một lượt đăng nhập = một nhân" và dung lượng vẫn chỉ là phép nhân đơn giản.</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tính cỡ theo một request.</strong> "86 ms mỗi lượt đăng nhập" đúng lúc 3 giờ sáng. Lúc 7:59 trước giờ thi, 40 sinh viên đăng nhập sẽ chờ tới 0,85 s với pool mặc định, và nếu bạn "sửa" bằng cách nâng pool lên 64, container cần thêm 2,5 GB rồi bị OOM giết. Chọn cỡ pool theo số nhân, và bộ nhớ theo <code>số luồng × m</code>. Không bao giờ dùng <code>hashSync</code> trong máy chủ — Node.js 8.1 đo được nó làm <code>/health</code> đứng 2.784 ms.</p>
</div>

<h3>Đọc chuỗi theo tên, không theo vị trí</h3>
${ra(OUT['22-format'])}
<p>Chuỗi băm mang theo mọi thứ: <code>argon2id</code>, phiên bản 19, tham số, 16 byte muối và 32 byte kết quả. Nhưng nhìn thứ tự: gói <code>argon2</code> ghi <code>m=65536,p=1,t=2</code>. Một regex viết theo ví dụ trên blog (<code>m=…,t=…,p=…</code>) trả về <code>null</code>; mã nào coi "không đọc được" là "đã cũ" sẽ băm lại ở <strong>mọi</strong> lượt đăng nhập — gấp đôi CPU cho mỗi lần đăng nhập, mà chẳng ai hay. <code>describe()</code> của LabFlow ID tách tham số thành từng cặp key=value; <code>argon2.needsRehash(stored, PARAMS)</code> là câu trả lời của chính thư viện.</p>

<h3>Hai cái bẫy hay lên production</h3>
<p><strong>scrypt với tham số của OWASP.</strong> scrypt chẳng cần cài thêm gói — nó nằm trong <code>node:crypto</code>. Mức tối thiểu của OWASP là N=2<sup>17</sup>, r=8, p=1, cần 128 × N × r = 128 MiB. <code>maxmem</code> của Node mặc định là 32 MiB:</p>
${ra(OUT['22-scrypt'])}
<p>Thông báo nói "memory limit exceeded", nên cách sửa hấp dẫn là hạ N — tức là làm mỗi lần đoán rẻ đi cho mọi kẻ tấn công. Cách sửa đúng là đặt <code>maxmem</code> nhỉnh hơn 128 × N × r (275 ms mỗi lần băm ở đây, so với 86 ms của argon2id của ta).</p>
<p><strong>72 byte của bcrypt.</strong> bcrypt chỉ đọc 72 byte đầu của đầu vào, mà chữ tiếng Việt tốn 2–3 byte mỗi chữ trong UTF-8:</p>
${ra(OUT['22-bcrypt72'])}
<p>Một câu 69 ký tự đã là 89 byte, nên một cái đuôi khác hẳn vẫn khớp. Node.js 8.1 mổ kỹ cái bẫy này; ở đây nó là thêm một lý do LabFlow ID dùng argon2id, thứ không có giới hạn đó. Nếu buộc phải giữ bcrypt, giới hạn đầu vào ở 72 byte và báo cho người dùng — không bao giờ cắt im lặng.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Sao lại tham số argon2 này?"</strong> — Từ hai ngân sách đo trên phần cứng production: ≤ 100 ms mỗi lần băm và ≤ 64 MiB mỗi luồng băm; script chọn bộ nhớ lớn nhất, rồi số lượt nhiều nhất, còn vừa. Đổi phần cứng thì chạy lại; dòng cũ tự nâng cấp khi đăng nhập.</li>
<li><strong>"bcrypt hay argon2?"</strong> — argon2id cho hệ mới (tốn bộ nhớ, không giới hạn 72 byte); giữ cho dòng bcrypt cũ vẫn chạy và chuyển chúng khi người dùng đăng nhập.</li>
<li><strong>"Đăng nhập chậm khi tải cao — kiểm gì?"</strong> — Cỡ thread pool so với số nhân, <code>số luồng × m</code> so với giới hạn bộ nhớ của container, và có lần băm đồng bộ nào trên event loop không.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo2/tune.mjs 100 256</code> trên máy bạn. Rồi chạy <code>node demo2/tune.mjs 250 512</code>. Ghi lại cả hai lựa chọn.</li>
<li>Chạy <code>node demo2/load.mjs 40 1</code> với <code>UV_THREADPOOL_SIZE</code> = 4 và = số nhân máy bạn. Tính <code>số luồng × 64 MiB</code> rồi so với dòng RSS.</li>
<li>Viết <code>needsRehash(stored)</code> trả true khi <code>m &lt; 65536</code> hoặc <code>t &lt; 2</code> — đọc tham số theo tên — và thử trên <code>$argon2id$v=19$m=19456,p=1,t=2$…</code>.</li>
</ol>
<p><strong>Lời giải</strong> (máy của mình): ngân sách 100/256 ⇒ m=64 MiB t=2 (86,5 ms); ngân sách 512 MiB nâng trần mỗi luồng lên 128 MiB và ngân sách 250 ms khi đó chọn m=128 MiB t=2 (186,5 ms khi mình chạy). RSS tăng khoảng (số luồng − 1) × 64 MiB — +194 MiB ở 4 luồng, +578 MiB ở 10. Câu 3: tách <code>m=19456,p=1,t=2</code> theo dấu phẩy, rồi theo <code>=</code>; <code>m = 19456 &lt; 65536</code> ⇒ true — đúng việc <code>describe()</code> + <code>needsRehash()</code> trong <code>src/passwords/hash.js</code> làm.</p>
<p><strong>Đạt khi:</strong> bạn nói được PARAMS của máy mình kèm cả hai ngân sách, đoán RSS của một đợt 40 lượt đăng nhập sai không quá ~10%, và bộ đọc của bạn xử lý được <code>m,p,t</code> theo thứ tự bất kỳ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">argon2id</span><span class="v">Hàm băm mật khẩu tốn bộ nhớ (RFC 9106); núm chỉnh m (KiB bộ nhớ), t (số lượt), p (số làn).</span></div>
  <div class="kv"><span class="k">latency budget (ngân sách độ trễ)</span><span class="v">Thời gian lâu nhất một lần băm được phép tốn trên phần cứng của bạn — ở đây 100 ms.</span></div>
  <div class="kv"><span class="k">thread pool (libuv)</span><span class="v">Nơi Node chạy việc crypto và file; <code>UV_THREADPOOL_SIZE</code>, mặc định 4. Bộ nhớ cho việc băm = số luồng × m.</span></div>
  <div class="kv"><span class="k">parallelism (p — số làn)</span><span class="v">Các làn của một lần băm argon2 chạy được trên nhân riêng: một mình thì nhanh hơn, mỗi lượt đăng nhập tốn nhiều nhân hơn.</span></div>
  <div class="kv"><span class="k">maxmem (scrypt)</span><span class="v">Chốt chặn bộ nhớ scrypt của Node: mặc định 32 MiB, thấp hơn 128 MiB của OWASP.</span></div>
  <div class="kv"><span class="k">72-byte limit (giới hạn 72 byte của bcrypt)</span><span class="v">bcrypt bỏ qua mọi thứ sau byte thứ 72 — khoảng 25–35 chữ tiếng Việt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định argon2id; scrypt nếu không được dùng module native (nâng <code>maxmem</code>); bcrypt chỉ cho dòng có sẵn (72 byte).</li>
<li>Hai ngân sách đo trên máy thật: ≤ 100 ms, ≤ 64 MiB mỗi luồng ⇒ m=64 MiB t=2 p=1, 86,5 ms.</li>
<li>Bộ nhớ = số luồng × m: 4 luồng +194 MiB, 64 luồng +2.498 MiB mà chẳng nhanh hơn.</li>
<li>Đợt dồn dập phải xếp hàng: 40 lượt, p95 850 ms với pool mặc định.</li>
<li>Đọc <code>m=…,p=…,t=…</code> theo tên; regex theo vị trí làm lượt đăng nhập nào cũng băm lại.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Áp vào Node.js — bài 8.1: lưu mật khẩu', sub: 'Giống: argon2id trước, bcrypt/scrypt dự phòng, chuỗi tự mô tả, chỉnh bằng đo. Bài đó đo 64 lượt đăng nhập song song, hashSync làm /health đứng 2.784 ms và bẫy 72 byte với cả một câu tiếng Việt; bài này suy tham số từ hai ngân sách và đo cỡ thread pool cùng p.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
