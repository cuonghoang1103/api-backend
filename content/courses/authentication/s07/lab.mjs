/**
 * Authentication · Chương 7 · Lab 7 — TOTP của LabFlow ID, viết từ gốc. BÀI MỚI, slug auth-7-7-lab-totp (trước quiz auth-7-6).
 * Máy chấm = scripts/cham-lab-7.mjs (6 phép, 10 điểm, đạt 7) kiểm với vector RFC 4226/6238. Output: khởi đầu 0/10, yếu 5,5/10, tham khảo 10/10, npm test 43 pass.
 */
import G from '../giang/auth-lab-7.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader7.split('\n');
const GR_T3 = GR.slice(GR.findIndex((l) => l.includes("T3 totp matches the RFC 6238")), GR.findIndex((l) => l.includes("T4 totp default"))).join('\n').trim();
const SETUP = `cp -r lab7/starter lab7/my
node scripts/cham-lab-7.mjs lab7/my      # no database, no network — just the algorithm`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails, for a real user…</th></tr></thead>
<tbody>
<tr><td>T1 base32Encode/Decode round-trip</td><td>1</td><td>the secret cannot be carried in an otpauth URI / QR (7.3)</td></tr>
<tr><td>T2 HOTP matches RFC 4226 (counter 0–9)</td><td>2</td><td>your codes disagree with every authenticator app</td></tr>
<tr><td>T3 TOTP matches RFC 6238 (SHA-1, 8 digits)</td><td>2.5</td><td>the implementation is not actually TOTP</td></tr>
<tr><td>T4 6-digit over a 30-second step</td><td>1.5</td><td>codes do not change on time, or are the wrong length</td></tr>
<tr><td>T5 verifyTotp accepts ±1 skew, rejects beyond</td><td>2</td><td>a user whose clock drifts a few seconds is locked out (7.2)</td></tr>
<tr><td>T6 rejects a wrong/empty code without crashing</td><td>1</td><td>a blank submission 500s instead of failing cleanly</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt, với người dùng thật…</th></tr></thead>
<tbody>
<tr><td>T1 base32Encode/Decode khứ hồi</td><td>1</td><td>bí mật không mang được trong URI otpauth / QR (7.3)</td></tr>
<tr><td>T2 HOTP khớp RFC 4226 (counter 0–9)</td><td>2</td><td>mã của bạn lệch với mọi app xác thực</td></tr>
<tr><td>T3 TOTP khớp RFC 6238 (SHA-1, 8 chữ số)</td><td>2,5</td><td>cài đặt thực ra không phải TOTP</td></tr>
<tr><td>T4 6 chữ số trên bước 30 giây</td><td>1,5</td><td>mã không đổi theo thời gian, hoặc sai độ dài</td></tr>
<tr><td>T5 verifyTotp nhận lệch ±1, từ chối xa hơn</td><td>2</td><td>một người đồng hồ trôi vài giây bị khoá ra ngoài (7.2)</td></tr>
<tr><td>T6 từ chối mã sai/rỗng mà không sập</td><td>1</td><td>một lần nộp trống làm 500 thay vì hỏng gọn</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 7 — LabFlow ID’s TOTP, from scratch|||Lab 7 — TOTP của LabFlow ID, viết từ gốc',
  slug: 'auth-7-7-lab-totp',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab Chương 7, thang 10 điểm (đạt 7) chấm bằng máy: viết TOTP từ gốc — base32, HOTP (HMAC + cắt động), TOTP (đồng hồ làm counter), verifyTotp với cửa sổ lệch. Máy chấm kiểm bạn với vector công bố của RFC 4226 (HOTP counter 0–9) và RFC 6238 (secret "12345678901234567890", t=59 → 94287082) + cửa sổ ±1. Chỉ node:crypto, không thư viện. Output thật của bản khởi đầu (0/10), lần thử đầu "chạy được" (5,5/10 — hardcode 6 chữ số + không cửa sổ lệch) và lời giải tham khảo src/totp/index.js (10/10, 43 test xanh).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab 7</span>
<h2>LabFlow ID’s TOTP, from scratch</h2>
<p class="lead">45–75 minutes. You write the whole of TOTP — base32, HOTP (HMAC + dynamic truncation), TOTP (the clock as the counter), and verification with a skew window — using only <code>node:crypto</code>. The grader does not judge whether it "looks right": it checks your output against the numbers published in RFC 4226 and RFC 6238.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> implement a standard crypto primitive from its RFC and prove it against the official test vectors; and explain why a from-scratch implementation that passes the vectors is trustworthy in a way one that merely runs is not.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.7 (lesson 7.2). No database, no network — the grader is pure:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab7/my/index.js</code>. Export <code>base32Encode</code>, <code>base32Decode</code>, <code>hotp</code>, <code>totp</code>, <code>verifyTotp</code>. Allowed: <code>node:crypto</code>. Do NOT import <code>../../src/totp</code> — that is the answer.</li>
</ol>

<h3>Your task — HOTP, TOTP, and a skew window</h3>
<ul>
<li><strong><code>base32Encode/Decode</code></strong> — RFC 4648 base32, no padding; <code>decode(encode(x))</code> must round-trip. Why: the secret travels as base32 (7.3).</li>
<li><strong><code>hotp(key, counter, {digits})</code></strong> — HMAC(key, 8-byte counter), then dynamic truncation to <code>digits</code> digits. Why: 7.2.</li>
<li><strong><code>totp(secretB32, {time, step, digits})</code></strong> — the counter is <code>floor((time - t0) / step)</code>; everything else is HOTP. Why: 7.2.</li>
<li><strong><code>verifyTotp(secretB32, code, {window})</code></strong> — accept the current step and ±<code>window</code>; compare in constant time; return <code>{ ok, offset }</code>. Why: 7.2.</li>
</ul>

<h3>How it is graded: 6 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>The heart of the lab is T3 — your <code>totp()</code> must reproduce the RFC 6238 vectors exactly:</p>
${ma('javascript', GR_T3)}

<h3>A first attempt that "works"</h3>
<p>This attempt generates correct 6-digit codes — but it hardcodes six digits (so the 8-digit RFC vectors fail) and verifies only the exact current step (no skew window). It runs; it is not right.</p>
${ma('javascript', CODE.yeu7)}
${ra(OUT['lab-yeu'])}
<p>5.5 out of 10, and each failure is a real user's bad day:</p>
<ul>
<li><strong>T3:</strong> ignoring <code>digits</code> means the 8-digit RFC vectors do not match — the implementation is not fully TOTP.</li>
<li><strong>T5:</strong> no skew window, so a user whose phone clock is 20 seconds off is locked out (7.2).</li>
<li>It passes the plumbing: base32 (T1), HOTP at 6 digits (T2), the 6-digit step (T4), and rejecting a wrong code (T6).</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Dynamic truncation: the low 4 bits of the LAST HMAC byte pick a 4-byte offset; mask the top bit of the first; modulo <code>10 ** digits</code>.</li>
<li>Respect the <code>digits</code> option everywhere — do not hardcode 6.</li>
<li>The counter is <code>Math.floor((time - t0) / step)</code>; write an 8-byte big-endian counter with <code>writeBigUInt64BE</code>.</li>
<li><code>verifyTotp</code> loops <code>w</code> from <code>-window</code> to <code>+window</code>, comparing <code>totp(..., time + w*step)</code> in constant time.</li>
</ol>

<h3>Reference solution — LabFlow ID’s <code>src/totp/index.js</code></h3>
<p>The reference is the real module, shown line by line in lesson 7.2. Its grade, and the project’s tests (which include the RFC vectors):</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-7.mjs lab7/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>Your <code>totp()</code> reproduces all six RFC 6238 vectors; <code>verifyTotp</code> accepts ±1 step and rejects beyond; <code>npm test</code> still passes.</li>
<li>You can explain dynamic truncation (T2/T3) and the skew window (T5) in your own words.</li>
</ul>
<p><strong>Done when:</strong> your module scores ≥ 7/10 twice in a row, and it matches the RFC vectors digit-for-digit.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab 7</span>
<h2>TOTP của LabFlow ID, viết từ gốc</h2>
<p class="lead">45–75 phút. Bạn viết trọn TOTP — base32, HOTP (HMAC + cắt động), TOTP (đồng hồ làm counter), và xác minh với cửa sổ lệch — chỉ dùng <code>node:crypto</code>. Máy chấm không phán xét nó "trông đúng": nó kiểm đầu ra của bạn với những con số công bố trong RFC 4226 và RFC 6238.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> cài một nguyên thuỷ mã chuẩn từ RFC của nó và chứng minh với vector thử chính thức; và giải thích vì sao một cài đặt từ gốc vượt được vector thì đáng tin theo cách mà một cái chỉ "chạy" thì không.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.7 (bài 7.2). Không cơ sở dữ liệu, không mạng — máy chấm thuần:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab7/my/index.js</code>. Xuất <code>base32Encode</code>, <code>base32Decode</code>, <code>hotp</code>, <code>totp</code>, <code>verifyTotp</code>. Được dùng: <code>node:crypto</code>. ĐỪNG import <code>../../src/totp</code> — đó là đáp án.</li>
</ol>

<h3>Nhiệm vụ — HOTP, TOTP, và một cửa sổ lệch</h3>
<ul>
<li><strong><code>base32Encode/Decode</code></strong> — base32 RFC 4648, không đệm; <code>decode(encode(x))</code> phải khứ hồi. Vì sao: bí mật đi dạng base32 (7.3).</li>
<li><strong><code>hotp(key, counter, {digits})</code></strong> — HMAC(key, counter 8 byte), rồi cắt động còn <code>digits</code> chữ số. Vì sao: 7.2.</li>
<li><strong><code>totp(secretB32, {time, step, digits})</code></strong> — counter là <code>floor((time - t0) / step)</code>; còn lại là HOTP. Vì sao: 7.2.</li>
<li><strong><code>verifyTotp(secretB32, code, {window})</code></strong> — nhận bước hiện tại và ±<code>window</code>; so sánh hằng thời gian; trả <code>{ ok, offset }</code>. Vì sao: 7.2.</li>
</ul>

<h3>Chấm thế nào: 6 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>Trái tim của lab là T3 — <code>totp()</code> của bạn phải tái tạo vector RFC 6238 chính xác:</p>
${ma('javascript', GR_T3)}

<h3>Một lần thử đầu "chạy được"</h3>
<p>Lần thử này sinh mã 6 chữ số đúng — nhưng hardcode sáu chữ số (nên vector RFC 8 chữ số trượt) và chỉ xác minh đúng bước hiện tại (không cửa sổ lệch). Nó chạy; nó không đúng.</p>
${ma('javascript', CODE.yeu7)}
${ra(OUT['lab-yeu'])}
<p>5,5 trên 10, và mỗi lần trượt là một ngày tồi của một người dùng thật:</p>
<ul>
<li><strong>T3:</strong> lờ <code>digits</code> nghĩa là vector RFC 8 chữ số không khớp — cài đặt không hẳn là TOTP.</li>
<li><strong>T5:</strong> không cửa sổ lệch, nên một người đồng hồ điện thoại lệch 20 giây bị khoá ra ngoài (7.2).</li>
<li>Nó qua phần ống nước: base32 (T1), HOTP ở 6 chữ số (T2), bước 6 chữ số (T4), và từ chối một mã sai (T6).</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Cắt động: 4 bit thấp của byte HMAC CUỐI chọn một offset 4 byte; che bit cao của byte đầu; modulo <code>10 ** digits</code>.</li>
<li>Tôn trọng tuỳ chọn <code>digits</code> ở mọi nơi — đừng hardcode 6.</li>
<li>Counter là <code>Math.floor((time - t0) / step)</code>; ghi một counter big-endian 8 byte bằng <code>writeBigUInt64BE</code>.</li>
<li><code>verifyTotp</code> lặp <code>w</code> từ <code>-window</code> tới <code>+window</code>, so <code>totp(..., time + w*step)</code> hằng thời gian.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/totp/index.js</code> của LabFlow ID</h3>
<p>Bản tham khảo là module thật, hiện từng dòng ở bài 7.2. Điểm của nó, và bộ test của dự án (gồm vector RFC):</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-7.mjs lab7/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li><code>totp()</code> của bạn tái tạo cả sáu vector RFC 6238; <code>verifyTotp</code> nhận ±1 bước và từ chối xa hơn; <code>npm test</code> vẫn qua.</li>
<li>Bạn giải thích được cắt động (T2/T3) và cửa sổ lệch (T5) bằng lời của mình.</li>
</ul>
<p><strong>Đạt khi:</strong> module của bạn đạt ≥ 7/10 hai lần liên tiếp, và nó khớp vector RFC từng chữ số.</p>
</div>
`,
};
