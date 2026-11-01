/**
 * Authentication · Chương 1 · Lab 1 — Bộ công cụ nguyên hàm của LabFlow ID. BÀI MỚI 01/11/2026, slug auth-1-7-lab-bo-cong-cu
 * (đứng trước quiz). Máy chấm = scripts/cham-lab-1.mjs trong dự án (9 phép, 10 điểm, đạt 7). Output chạy thật (_ma.mjs):
 * khởi đầu 0/10, lần thử đầu "chạy được" 2/10 (T5 đo được 6,73×), lời giải tham khảo src/crypto 10/10, npm test 6 pass.
 */
import G from '../giang/auth-lab-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader.split('\n');
const GR_T5 = GR.slice(GR.findIndex((l) => l.startsWith('// ── T5')), GR.findIndex((l) => l.startsWith('const KEYS'))).join('\n').trim();
const STARTER_HEAD = CODE.starter.split('\n').slice(0, 12).join('\n') + '\n…';

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails, for a real user…</th></tr></thead>
<tbody>
<tr><td>T1 token format and argument checks</td><td>1</td><td>a 27-character “token” that a typo in the prefix silently accepts</td></tr>
<tr><td>T2 CSPRNG, never <code>Math.random</code></td><td>1.5</td><td>4 observed tokens predict the next ones (lesson 1.2)</td></tr>
<tr><td>T3 <code>tokenDigest</code> = SHA-256 hex</td><td>0.5</td><td>the session table cannot be looked up, or stores the token itself</td></tr>
<tr><td>T4 <code>safeEqual</code> correct, never throws</td><td>1.5</td><td><code>undefined === undefined</code> lets a request without a token through; a throw becomes a 500</td></tr>
<tr><td>T5 <code>safeEqual</code> time flat (1,024 chars, ratio &lt; 1.5×)</td><td>1</td><td>the click of lesson 1.3</td></tr>
<tr><td>T6 signed value: round trip, tampered value / expiry / signature</td><td>1.5</td><td>An edits her cookie from STUDENT to LAB_MANAGER, or extends her own expiry</td></tr>
<tr><td>T7 expiry boundary (valid until exp − 1 s, null from exp)</td><td>1</td><td>“15 minutes” really means 15 minutes and one second</td></tr>
<tr><td>T8 format with <code>kid</code>, key rotation, malformed input → <code>null</code></td><td>1</td><td>rotating a leaked key logs everyone out, or keeps the leaked key valid; garbage input crashes the route</td></tr>
<tr><td>T9 <code>redact</code> allow-list, deep, input untouched</td><td>1</td><td>a new field (<code>otp</code>, <code>matKhau</code>, <code>x-session</code>) lands in the log (lesson 1.5)</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt, với người dùng thật…</th></tr></thead>
<tbody>
<tr><td>T1 định dạng token và kiểm tham số</td><td>1</td><td>một "token" 27 ký tự, và tiền tố gõ sai vẫn được nhận im lặng</td></tr>
<tr><td>T2 CSPRNG, không bao giờ <code>Math.random</code></td><td>1,5</td><td>nhìn 4 token là đoán được các token sau (bài 1.2)</td></tr>
<tr><td>T3 <code>tokenDigest</code> = SHA-256 dạng hex</td><td>0,5</td><td>bảng phiên không tra được, hoặc lưu luôn chính token</td></tr>
<tr><td>T4 <code>safeEqual</code> đúng, không bao giờ ném lỗi</td><td>1,5</td><td><code>undefined === undefined</code> cho một request không có token đi qua; lỗi ném ra thành 500</td></tr>
<tr><td>T5 thời gian <code>safeEqual</code> phẳng (1.024 ký tự, tỉ lệ &lt; 1,5×)</td><td>1</td><td>tiếng "tách" của bài 1.3</td></tr>
<tr><td>T6 giá trị có ký: đi về, sửa giá trị / hạn / chữ ký</td><td>1,5</td><td>An sửa cookie từ STUDENT thành LAB_MANAGER, hoặc tự gia hạn cho mình</td></tr>
<tr><td>T7 biên hết hạn (còn hạn tới exp − 1 s, null từ exp)</td><td>1</td><td>"15 phút" thật ra là 15 phút và một giây</td></tr>
<tr><td>T8 định dạng có <code>kid</code>, xoay khoá, đầu vào hỏng → <code>null</code></td><td>1</td><td>xoay một khoá bị lộ làm mọi người bị đăng xuất, hoặc khoá lộ vẫn còn hiệu lực; rác gửi vào làm sập route</td></tr>
<tr><td>T9 <code>redact</code> theo allow-list, đi sâu, không sửa đầu vào</td><td>1</td><td>một trường mới (<code>otp</code>, <code>matKhau</code>, <code>x-session</code>) rơi vào log (bài 1.5)</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 1 — Build LabFlow ID’s toolkit of primitives|||Lab 1 — Dựng bộ công cụ nguyên hàm của LabFlow ID',
  slug: 'auth-1-7-lab-bo-cong-cu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 1, thang 10 điểm (đạt 7) chấm bằng máy: viết src/crypto của LabFlow ID — newToken (CSPRNG + tiền tố), tokenDigest, safeEqual (không ném lỗi, thời gian phẳng), signValue/verifyValue (hết hạn, kid, xoay khoá), redact (allow-list). Có output thật của bản khởi đầu (0/10), lần thử đầu "chạy được" (2/10) và lời giải tham khảo (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab 1</span>
<h2>Build LabFlow ID’s toolkit of primitives</h2>
<p class="lead">60–90 minutes. You write the six small functions every later chapter of LabFlow ID imports: random tokens, token digests, a safe comparison, signed values with expiry and key rotation, and log redaction. Then a script grades you on behaviour — including one check that measures time — exactly the way the lessons of this chapter attacked the naive versions.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> turn the five lessons of Chapter 1 into code you will reuse for sessions (Ch3), reset links (Ch6), recovery codes (Ch7) and key rotation (Ch11); read a grader's failure and translate it into what a user would suffer; and explain in an interview why each function is shaped the way it is.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project from lessons 0.3–1.5 (Node 22, <code>npm ci</code> done). Copy the starter: <code>cp -r lab1/starter lab1/my</code>.</li>
<li>Grade the empty starter once, so you know the grader runs on your machine:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab1/my/index.js</code>. Keep the six exported names and signatures — the grader imports them.</li>
</ol>
${ma('javascript', STARTER_HEAD)}

<h3>Your task — behaviour first</h3>
<ul>
<li><code>newToken(prefix, bytes = 32)</code> — <code>"lfid_ses_" + 43 base64url characters</code> from the OS CSPRNG. A prefix that is not lowercase-with-single-underscores throws <code>TypeError</code>; fewer than 16 bytes (or a non-integer) throws <code>RangeError</code>. Why: lesson 1.2 (bits, prefixes for secret scanners).</li>
<li><code>tokenDigest(token)</code> — SHA-256, lowercase hex. Why: lesson 1.3 (store the digest, look up by digest).</li>
<li><code>safeEqual(a, b)</code> — <code>true</code> only for two equal <em>strings</em>; anything else <code>false</code>; never throws; time must not depend on where they differ. Why: lesson 1.3.</li>
<li><code>signValue(value, { keys, kid, ttlSec, now })</code> → <code>base64url(value).exp.kid.sig</code>, where <code>sig</code> is HMAC-SHA256 (base64url) of the first three parts with <code>keys[kid]</code>. <code>verifyValue(signed, { keys, now })</code> → the value, or <code>null</code> when anything is wrong — changed, expired (<code>now ≥ exp</code>), unknown <code>kid</code>, malformed — and it never throws. Check the signature before you trust <code>exp</code>. Why: lesson 1.4; Chapter 3 signs cookies with it.</li>
<li><code>redact(value, allow)</code> — a deep copy in which every key not in <code>allow</code> becomes <code>"[redacted]"</code>; arrays and nested objects are walked; the input is not modified. Why: lesson 1.5.</li>
</ul>
<p>Write a few calls of your own in a scratch file before grading — the grader is a safety net, not your test suite.</p>

<h3>How it is graded: 9 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>One check measures time, and it had a bug of its own while this lab was written: the first version timed <code>safeEqual</code> without using the result, the JIT deleted the comparison, and <code>===</code> “passed” at 1.0×. The fixed check counts every result and rotates 8 input copies — lesson 1.3's benchmark trap, inside a grader:</p>
${ma('javascript', GR_T5)}

<h3>A first attempt that “works”</h3>
<p>This is what a reasonable first attempt looks like. Every happy-path call returns the right thing: tokens look random, digests are right, a fresh signed value verifies and a tampered one does not.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>2 out of 10 — and every failure is a real bug, not pedantry:</p>
<ul>
<li><strong>T1, T2:</strong> 28 characters of <code>Math.random</code> + <code>Date.now</code>. Lesson 1.2 predicted <code>Math.random</code> from four outputs; the time part is guessable to the minute (lesson 0.3).</li>
<li><strong>T4:</strong> <code>safeEqual(undefined, undefined)</code> is <code>true</code>. A route that compares a missing header with a missing stored value lets the request through.</li>
<li><strong>T5:</strong> on 1,024 characters, a difference at the end costs <strong>6.73×</strong> a difference at the start. That is <code>===</code>, measured.</li>
<li><strong>T7:</strong> <code>now &gt; exp</code> instead of <code>now ≥ exp</code> — a value is accepted for one extra second. Boundaries are where expiry bugs live.</li>
<li><strong>T8:</strong> no <code>kid</code>, always the first key: you cannot rotate a key without breaking every value already issued (and <code>signed.split</code> on <code>undefined</code> throws).</li>
<li><strong>T9:</strong> a deny-list. <code>x-session</code>, <code>Cookie</code>, <code>matKhau</code> and <code>pwd</code> survive — the same misses as pino's redact paths in lesson 1.5.</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Every function has a lesson. Re-run the lesson's demo when a check fails: the failure message names the behaviour.</li>
<li><code>newToken</code>: one regex for the prefix, <code>randomBytes(bytes).toString('base64url')</code>. <code>safeEqual</code>: type check first, then HMAC both sides with a key from <code>randomBytes(32)</code> created once per process, then <code>timingSafeEqual</code>.</li>
<li><code>verifyValue</code>: <code>split('.')</code> must give exactly 4 parts; look the key up with <code>Object.hasOwn(keys, kid)</code> (a kid of <code>toString</code> must not find <code>Object.prototype.toString</code>); compare signatures with <code>safeEqual</code>; only then compare <code>Math.floor(now / 1000) &gt;= exp</code>.</li>
<li><code>redact</code>: a recursive <code>walk</code> — arrays map, objects become <code>Object.fromEntries</code> of kept-or-redacted entries, primitives return as they are.</li>
</ol>

<h3>Reference solution — LabFlow ID's <code>src/crypto/</code></h3>
<p>The toolkit that the rest of the course imports. Read it after your own attempt.</p>
${ma('javascript', CODE.tokens)}
${ma('javascript', CODE.signed)}
${ma('javascript', CODE.redact)}
<p><code>compare.js</code> is the <code>safeEqual</code> of lesson 1.3; <code>index.js</code> re-exports the six functions.</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-1.mjs lab1/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), on two runs in a row (T5 measures time).</li>
<li>No <code>Math.random</code>, no <code>console.log</code> of secrets anywhere in <code>lab1/my</code>.</li>
<li>You can say, for each failed check of the first attempt above, what a user would have suffered.</li>
<li>Optional: point <code>src/server.js</code> at your toolkit instead of <code>src/crypto</code> and rerun <code>npm test</code> + the guess attack of lesson 1.2 — both must behave the same.</li>
</ul>
<p><strong>Done when:</strong> your toolkit scores ≥ 7/10 twice in a row, and you can explain T5 and T8 in your own words.</p>
${lienKet({ khoa: 'testing', bai: 'tst-5-2-xac-thuc', title: 'Also in the Testing course — 5.2: testing authentication', sub: 'Same: inject the clock and test expiry at the exact boundary — jose treats the moment of exp as already expired, like T7 here. Different: there you test someone else’s auth layer through the API; here you build the signing toolkit and a grader attacks it.', cta: 'OPEN TESTING LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab 1</span>
<h2>Dựng bộ công cụ nguyên hàm của LabFlow ID</h2>
<p class="lead">60–90 phút. Bạn viết sáu hàm nhỏ mà mọi chương sau của LabFlow ID đều import: token ngẫu nhiên, digest của token, phép so an toàn, giá trị có ký kèm hạn dùng và xoay khoá, và che dữ liệu trong log. Rồi một script chấm bạn theo hành vi — có cả một phép đo thời gian — đúng như cách các bài trong chương đã tấn công những phiên bản ngây thơ.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> biến năm bài của Chương 1 thành mã sẽ dùng lại cho phiên (Ch3), link đặt lại mật khẩu (Ch6), mã khôi phục (Ch7) và xoay khoá (Ch11); đọc một dòng trượt của máy chấm và dịch nó thành điều người dùng phải chịu; và giải thích khi phỏng vấn vì sao mỗi hàm có hình dạng như vậy.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> từ bài 0.3–1.5 (Node 22, đã <code>npm ci</code>). Chép bản khởi đầu: <code>cp -r lab1/starter lab1/my</code>.</li>
<li>Chấm bản khởi đầu rỗng một lần để chắc máy chấm chạy được trên máy bạn:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab1/my/index.js</code>. Giữ nguyên tên và chữ ký của sáu hàm export — máy chấm import chúng.</li>
</ol>
${ma('javascript', STARTER_HEAD)}

<h3>Nhiệm vụ — bắt đầu từ hành vi</h3>
<ul>
<li><code>newToken(prefix, bytes = 32)</code> — <code>"lfid_ses_" + 43 ký tự base64url</code> từ CSPRNG của hệ điều hành. Tiền tố không phải chữ thường-với-gạch-dưới-đơn thì ném <code>TypeError</code>; ít hơn 16 byte (hoặc không nguyên) thì ném <code>RangeError</code>. Vì sao: bài 1.2 (số bit, tiền tố cho máy quét bí mật).</li>
<li><code>tokenDigest(token)</code> — SHA-256, hex chữ thường. Vì sao: bài 1.3 (lưu digest, tra theo digest).</li>
<li><code>safeEqual(a, b)</code> — <code>true</code> chỉ khi hai <em>chuỗi</em> bằng nhau; mọi thứ khác <code>false</code>; không bao giờ ném lỗi; thời gian không phụ thuộc chỗ khác nhau. Vì sao: bài 1.3.</li>
<li><code>signValue(value, { keys, kid, ttlSec, now })</code> → <code>base64url(value).exp.kid.sig</code>, với <code>sig</code> là HMAC-SHA256 (base64url) của ba phần đầu bằng <code>keys[kid]</code>. <code>verifyValue(signed, { keys, now })</code> → giá trị, hoặc <code>null</code> khi có bất cứ gì sai — bị sửa, hết hạn (<code>now ≥ exp</code>), <code>kid</code> lạ, hỏng định dạng — và không bao giờ ném lỗi. Kiểm chữ ký trước khi tin <code>exp</code>. Vì sao: bài 1.4; Chương 3 ký cookie bằng chính hàm này.</li>
<li><code>redact(value, allow)</code> — bản sao sâu, khoá nào không nằm trong <code>allow</code> thành <code>"[redacted]"</code>; đi vào mảng và object lồng nhau; không sửa đầu vào. Vì sao: bài 1.5.</li>
</ul>
<p>Hãy tự viết vài lời gọi trong một tệp nháp trước khi chấm — máy chấm là lưới an toàn, không phải bộ test của bạn.</p>

<h3>Cách chấm: 9 phép, 10 điểm, đạt = 7</h3>
${CHECKS_VI}
<p>Có một phép đo thời gian, và chính nó từng có bug khi soạn lab này: bản đầu đo <code>safeEqual</code> mà không dùng kết quả, JIT xoá luôn phép so, và <code>===</code> "đạt" với tỉ lệ 1,0×. Phép chấm đã sửa đếm mọi kết quả và xoay vòng 8 bản sao đầu vào — đúng cái bẫy phép đo của bài 1.3, nằm trong máy chấm:</p>
${ma('javascript', GR_T5)}

<h3>Một lần thử đầu "chạy được"</h3>
<p>Đây là một lần thử đầu rất hợp lý. Mọi lời gọi đường thẳng (happy path) đều trả đúng: token trông ngẫu nhiên, digest đúng, giá trị vừa ký thì kiểm được còn bị sửa thì không.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>2 trên 10 — và mỗi lần trượt là một con bug thật, không phải bắt bẻ:</p>
<ul>
<li><strong>T1, T2:</strong> 28 ký tự từ <code>Math.random</code> + <code>Date.now</code>. Bài 1.2 đã đoán <code>Math.random</code> từ bốn số; phần thời gian thì đoán được tới phút (bài 0.3).</li>
<li><strong>T4:</strong> <code>safeEqual(undefined, undefined)</code> là <code>true</code>. Một route so header thiếu với giá trị lưu thiếu sẽ cho request đi qua.</li>
<li><strong>T5:</strong> trên 1.024 ký tự, khác ở cuối tốn gấp <strong>6,73 lần</strong> khác ở đầu. Đó là <code>===</code>, đo được.</li>
<li><strong>T7:</strong> <code>now &gt; exp</code> thay vì <code>now ≥ exp</code> — giá trị được nhận thêm một giây. Bug hết hạn sống ở biên.</li>
<li><strong>T8:</strong> không có <code>kid</code>, luôn dùng khoá đầu tiên: không xoay khoá được mà không làm hỏng mọi giá trị đã phát (và <code>signed.split</code> trên <code>undefined</code> thì ném lỗi).</li>
<li><strong>T9:</strong> deny-list. <code>x-session</code>, <code>Cookie</code>, <code>matKhau</code> và <code>pwd</code> lọt qua — đúng những chỗ sót của redact trong pino ở bài 1.5.</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Mỗi hàm có một bài. Phép nào trượt thì chạy lại demo của bài đó: dòng báo trượt đã gọi tên hành vi.</li>
<li><code>newToken</code>: một regex cho tiền tố, <code>randomBytes(bytes).toString('base64url')</code>. <code>safeEqual</code>: kiểm kiểu trước, rồi HMAC hai phía bằng khoá <code>randomBytes(32)</code> tạo một lần mỗi tiến trình, rồi <code>timingSafeEqual</code>.</li>
<li><code>verifyValue</code>: <code>split('.')</code> phải ra đúng 4 phần; tra khoá bằng <code>Object.hasOwn(keys, kid)</code> (kid là <code>toString</code> không được tìm thấy <code>Object.prototype.toString</code>); so chữ ký bằng <code>safeEqual</code>; chỉ sau đó mới so <code>Math.floor(now / 1000) &gt;= exp</code>.</li>
<li><code>redact</code>: một hàm <code>walk</code> đệ quy — mảng thì map, object thành <code>Object.fromEntries</code> của các cặp giữ-hay-che, giá trị nguyên thuỷ trả về nguyên.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/crypto/</code> của LabFlow ID</h3>
<p>Bộ công cụ mà phần còn lại của khoá import. Đọc sau khi đã tự làm.</p>
${ma('javascript', CODE.tokens)}
${ma('javascript', CODE.signed)}
${ma('javascript', CODE.redact)}
<p><code>compare.js</code> là <code>safeEqual</code> của bài 1.3; <code>index.js</code> export lại sáu hàm.</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-1.mjs lab1/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần chạy liên tiếp (T5 đo thời gian).</li>
<li>Không có <code>Math.random</code>, không <code>console.log</code> bí mật ở đâu trong <code>lab1/my</code>.</li>
<li>Với mỗi phép trượt của lần thử đầu ở trên, bạn nói được người dùng sẽ chịu điều gì.</li>
<li>Tuỳ chọn: cho <code>src/server.js</code> dùng bộ công cụ của bạn thay <code>src/crypto</code> rồi chạy lại <code>npm test</code> + đòn đoán phiên của bài 1.2 — cả hai phải cư xử y như cũ.</li>
</ul>
<p><strong>Đạt khi:</strong> bộ công cụ của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn giải thích được T5 và T8 bằng lời của mình.</p>
${lienKet({ khoa: 'testing', bai: 'tst-5-2-xac-thuc', title: 'Cũng có ở khoá Testing — 5.2: test phần xác thực', sub: 'Giống: tiêm đồng hồ và test hết hạn đúng tại biên — jose coi đúng mốc exp là đã hết hạn, như T7 ở đây. Khác: ở đó bạn test lớp xác thực có sẵn qua API; ở đây bạn dựng bộ công cụ ký và để máy chấm tấn công nó.', cta: 'MỞ BÀI TESTING →' })}
</div>
`,
};
