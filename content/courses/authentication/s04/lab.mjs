/**
 * Authentication · Chương 4 · Lab 4 — Bộ xác minh JWT của LabFlow ID. BÀI MỚI 03/11/2026, slug auth-4-7-lab-kiem-jwt (trước quiz).
 * Máy chấm = scripts/cham-lab-4.mjs (9 phép, 10 điểm, đạt 7): dựng keyring hai khoá, đúc 20+ token thù địch, gọi makeVerifier của
 * người học. Output thật: khởi đầu 0/10, lần thử đầu "chạy được" 3,5/10, tham khảo (src/jwt/verify.js) 10/10, npm test 25 pass.
 */
import G from '../giang/auth-lab-4.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader.split('\n');
const GR_T2T3 = GR.slice(GR.findIndex((l) => l.includes('T2 the "none"')), GR.findIndex((l) => l.includes('T4 the kid'))).join('\n').trim();
const SETUP = `cp -r lab4/starter lab4/my
node scripts/cham-lab-4.mjs lab4/my      # builds a keyring, mints 20+ hostile tokens, calls your makeVerifier`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails, for a real user…</th></tr></thead>
<tbody>
<tr><td>T1 a valid token is accepted and returns sub/role (from either live key)</td><td>1</td><td>no one can sign in at all</td></tr>
<tr><td>T2 <code>alg: none</code> (and <code>None</code>/<code>nOnE</code>) is rejected</td><td>1.5</td><td>anyone forges any identity with no key (4.2)</td></tr>
<tr><td>T3 HS256 signed with the public key is rejected (algorithm confusion)</td><td>1.5</td><td>anyone who read the JWKS forges any token (4.2)</td></tr>
<tr><td>T4 unknown, missing or path-like <code>kid</code> is rejected</td><td>1</td><td>the attacker chooses the key via a file path (4.4)</td></tr>
<tr><td>T5 a tampered payload or a swapped signature is rejected</td><td>1</td><td>a student edits their own role to LAB_MANAGER (4.1)</td></tr>
<tr><td>T6 expired is rejected; within the 60 s skew is accepted</td><td>1</td><td>a stolen token never dies, or valid tokens are refused on clock drift (4.3)</td></tr>
<tr><td>T7 a token with <code>nbf</code> in the future is rejected</td><td>0.5</td><td>a pre-dated token works early (4.3)</td></tr>
<tr><td>T8 wrong <code>iss</code>, <code>aud</code> or missing <code>sub</code> is rejected</td><td>1.5</td><td>a token for another service or issuer is accepted here (4.3)</td></tr>
<tr><td>T9 a revoked or <code>jti</code>-less token is rejected</td><td>1</td><td>“log out” and revocation do nothing (4.3)</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt, với người dùng thật…</th></tr></thead>
<tbody>
<tr><td>T1 token hợp lệ được chấp nhận và trả sub/role (từ cả hai khoá đang sống)</td><td>1</td><td>chẳng ai đăng nhập được</td></tr>
<tr><td>T2 <code>alg: none</code> (và <code>None</code>/<code>nOnE</code>) bị từ chối</td><td>1,5</td><td>ai cũng giả mạo mọi danh tính mà không cần khoá (4.2)</td></tr>
<tr><td>T3 HS256 ký bằng khoá công khai bị từ chối (nhầm lẫn thuật toán)</td><td>1,5</td><td>ai đọc được JWKS là giả mạo mọi token (4.2)</td></tr>
<tr><td>T4 <code>kid</code> lạ, thiếu hoặc kiểu đường dẫn bị từ chối</td><td>1</td><td>kẻ tấn công chọn khoá qua một đường dẫn tệp (4.4)</td></tr>
<tr><td>T5 payload bị sửa hay chữ ký bị tráo bị từ chối</td><td>1</td><td>một sinh viên sửa role của mình thành LAB_MANAGER (4.1)</td></tr>
<tr><td>T6 hết hạn bị từ chối; trong dung sai 60 s được chấp nhận</td><td>1</td><td>token bị trộm không chết, hoặc token hợp lệ bị khước từ khi đồng hồ lệch (4.3)</td></tr>
<tr><td>T7 token có <code>nbf</code> trong tương lai bị từ chối</td><td>0,5</td><td>một token ghi lùi ngày chạy sớm (4.3)</td></tr>
<tr><td>T8 sai <code>iss</code>, <code>aud</code> hoặc thiếu <code>sub</code> bị từ chối</td><td>1,5</td><td>một token cho dịch vụ hay issuer khác được chấp nhận ở đây (4.3)</td></tr>
<tr><td>T9 token đã thu hồi hay thiếu <code>jti</code> bị từ chối</td><td>1</td><td>"đăng xuất" và thu hồi chẳng làm gì (4.3)</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 4 — LabFlow ID’s JWT verifier|||Lab 4 — Bộ xác minh JWT của LabFlow ID',
  slug: 'auth-4-7-lab-kiem-jwt',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 4, thang 10 điểm (đạt 7) chấm bằng máy: viết makeVerifier của LabFlow ID — lấy thuật toán từ khoá tra theo kid, kiểm chữ ký, rồi bảy claim với dung sai đồng hồ và denylist jti. Máy chấm dựng một keyring hai khoá, đúc hơn hai mươi token thù địch (alg none, nhầm lẫn HS/RS, kid lạ/đường dẫn, sửa payload, hết hạn, nbf tương lai, sai iss/aud, thu hồi) và gọi hàm của bạn; output thật của bản khởi đầu (0/10), lần thử đầu "chạy được" (3,5/10) và lời giải tham khảo src/jwt/verify.js (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab 4</span>
<h2>LabFlow ID’s JWT verifier</h2>
<p class="lead">60–90 minutes. You write the one function every service in the platform depends on: the JWT verifier. A grader builds a keyring, mints a battery of twenty-plus hostile tokens — the forgeries of lessons 4.1–4.4, automated — and asks your verifier to accept the single valid token and reject every bad one. This is the defensive mirror of the attacks you just ran.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> ship a JWT verifier you can defend line by line; read a grader's failure and name the forgery it allowed; and reuse the verifier for Chapter 5 (refresh), Chapter 8 (verifying tokens from LabFlow ID as an OIDC provider) and Chapter 9 (reading the <code>role</code> claim for authorization).</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.4 (lesson 4.1). The grader needs no database and no server — it calls your function directly:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab4/my/index.js</code>. Keep <code>export function makeVerifier({ keyring, issuer, audience, skewSec })</code> returning <code>verify(token, { now, revoked })</code>. Allowed: <code>node:crypto</code> and <code>../../src/jwt/base64url.js</code> (<code>decodeJwt</code>). Do NOT import <code>../../src/jwt/verify.js</code> — that is the answer.</li>
</ol>

<h3>Your task — algorithm from the key, then the claims</h3>
<ul>
<li><strong>Parse</strong> the token; get the <code>kid</code> from the header. No <code>kid</code>, or a <code>kid</code> not in <code>keyring</code> ⇒ reject. Why: 4.4.</li>
<li><strong>Algorithm</strong> from the key: the header's <code>alg</code> must equal <code>keyring[kid].alg</code>, or reject. This one rule stops <code>none</code> and HS/RS confusion. Why: 4.2.</li>
<li><strong>Signature</strong>: <code>keyring[kid].verify(signingInput, signature)</code> must pass, before any claim is read. Why: 4.1, 4.2.</li>
<li><strong>Claims</strong>: <code>iss</code> = issuer; <code>audience</code> in <code>aud</code>; <code>sub</code> present; <code>exp</code> and <code>nbf</code> with <code>skewSec</code>; <code>iat</code> present; <code>jti</code> present and not in <code>revoked</code>. Why: 4.3.</li>
</ul>

<h3>How it is graded: 9 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>Two checks are the headline forgeries of lesson 4.2. The grader mints a <code>none</code> token and an HS256 token HMAC-signed with the public key, and asks your verifier to reject both:</p>
${ma('javascript', GR_T2T3)}

<h3>A first attempt that “works”</h3>
<p>This attempt signs people in and rejects a tampered token. It even reads the <code>kid</code> and uses the keyring's own <code>verify</code> — which, by luck, blocks the confusion attack. But it trusts <code>alg: none</code> and never checks a claim.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3.5 out of 10, and each failure is a forgery you already ran:</p>
<ul>
<li><strong>T2:</strong> <code>if (header.alg === 'none') return payload</code> is the <code>alg: none</code> hole — a forged identity with no key.</li>
<li><strong>T4:</strong> <code>if (key && …)</code> silently accepts a token whose <code>kid</code> is unknown (<code>key</code> is <code>undefined</code>), so an attacker just names a <code>kid</code> you do not have.</li>
<li><strong>T6, T7, T8, T9:</strong> no claim is checked, so an expired token, a pre-dated one, a token for another issuer, and a revoked <code>jti</code> all pass. (T3 and T5 pass because it does use the keyring's <code>verify</code> for a real signature.)</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Each check names its lesson; rerun that demo (<code>demo4/alg-none.mjs</code>, <code>demo4/claims.mjs</code>, <code>demo4/rotate.mjs</code>).</li>
<li>Get the key with <code>keyring[header.kid]</code>; if it is missing, reject — never <code>if (key)</code>.</li>
<li>Reject unless <code>header.alg === key.alg</code>; only then call <code>key.verify(signingInput, signature)</code>.</li>
<li>For <code>exp</code>: reject when <code>nowSec - skewSec &gt;= exp</code>; for <code>nbf</code>: reject when <code>nowSec + skewSec &lt; nbf</code>. Check <code>jti</code> against <code>revoked</code> last.</li>
</ol>

<h3>Reference solution — LabFlow ID's <code>src/jwt/verify.js</code></h3>
<p>The reference is the real verifier, shown line by line in lessons 4.2 and 4.3, wrapped in the <code>makeVerifier</code> shape. Its grade, and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-4.mjs lab4/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>The algorithm comes from the key, not the header; the signature is checked before any claim; <code>npm test</code> still passes.</li>
<li>You can explain T2 (<code>none</code>) and T3 (confusion) in your own words.</li>
</ul>
<p><strong>Done when:</strong> your verifier scores ≥ 7/10 twice in a row, and you can name the forgery behind every failed check.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab 4</span>
<h2>Bộ xác minh JWT của LabFlow ID</h2>
<p class="lead">60–90 phút. Bạn viết cái hàm mà mọi dịch vụ trong nền tảng phụ thuộc: bộ xác minh JWT. Một máy chấm dựng một keyring, đúc cả một rổ hơn hai mươi token thù địch — các cú giả mạo của bài 4.1–4.4, được tự động hoá — và yêu cầu bộ xác minh của bạn chấp nhận token hợp lệ duy nhất và từ chối mọi cái xấu. Đây là tấm gương phòng thủ của các cú tấn công bạn vừa chạy.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> đưa lên một bộ xác minh JWT bạn bảo vệ được từng dòng; đọc một dòng trượt của máy chấm và gọi tên cú giả mạo nó cho phép; và dùng lại bộ xác minh cho Chương 5 (refresh), Chương 8 (xác minh token từ LabFlow ID với vai OIDC provider) và Chương 9 (đọc claim <code>role</code> để phân quyền).</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.4 (bài 4.1). Máy chấm không cần cơ sở dữ liệu và không cần máy chủ — nó gọi thẳng hàm của bạn:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab4/my/index.js</code>. Giữ <code>export function makeVerifier({ keyring, issuer, audience, skewSec })</code> trả về <code>verify(token, { now, revoked })</code>. Được dùng: <code>node:crypto</code> và <code>../../src/jwt/base64url.js</code> (<code>decodeJwt</code>). ĐỪNG import <code>../../src/jwt/verify.js</code> — đó là đáp án.</li>
</ol>

<h3>Nhiệm vụ — thuật toán từ khoá, rồi các claim</h3>
<ul>
<li><strong>Phân tích</strong> token; lấy <code>kid</code> từ header. Không có <code>kid</code>, hoặc một <code>kid</code> không trong <code>keyring</code> ⇒ từ chối. Vì sao: 4.4.</li>
<li><strong>Thuật toán</strong> từ khoá: <code>alg</code> trong header phải bằng <code>keyring[kid].alg</code>, không thì từ chối. Một luật này chặn <code>none</code> và nhầm lẫn HS/RS. Vì sao: 4.2.</li>
<li><strong>Chữ ký</strong>: <code>keyring[kid].verify(signingInput, signature)</code> phải qua, trước khi đọc claim nào. Vì sao: 4.1, 4.2.</li>
<li><strong>Các claim</strong>: <code>iss</code> = issuer; <code>audience</code> trong <code>aud</code>; có <code>sub</code>; <code>exp</code> và <code>nbf</code> với <code>skewSec</code>; có <code>iat</code>; có <code>jti</code> và không trong <code>revoked</code>. Vì sao: 4.3.</li>
</ul>

<h3>Chấm thế nào: 9 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>Hai phép là các cú giả mạo đinh của bài 4.2. Máy chấm đúc một token <code>none</code> và một token HS256 HMAC-ký bằng khoá công khai, rồi yêu cầu bộ xác minh của bạn từ chối cả hai:</p>
${ma('javascript', GR_T2T3)}

<h3>Một lần thử đầu "chạy được"</h3>
<p>Lần thử này đăng nhập được người dùng và từ chối một token bị sửa. Nó thậm chí đọc <code>kid</code> và dùng chính <code>verify</code> của keyring — thứ, nhờ may, chặn được cú nhầm lẫn. Nhưng nó tin <code>alg: none</code> và không bao giờ kiểm một claim.</p>
${ma('javascript', CODE.yeu)}
${ra(OUT['lab-yeu'])}
<p>3,5 trên 10, và mỗi lần trượt là một cú giả mạo bạn đã chạy:</p>
<ul>
<li><strong>T2:</strong> <code>if (header.alg === 'none') return payload</code> là cái lỗ <code>alg: none</code> — một danh tính giả mà không cần khoá.</li>
<li><strong>T4:</strong> <code>if (key && …)</code> âm thầm chấp nhận một token có <code>kid</code> lạ (<code>key</code> là <code>undefined</code>), nên kẻ tấn công chỉ cần nêu một <code>kid</code> bạn không có.</li>
<li><strong>T6, T7, T8, T9:</strong> không claim nào được kiểm, nên một token hết hạn, một cái ghi lùi ngày, một token cho issuer khác, và một <code>jti</code> đã thu hồi đều qua. (T3 và T5 qua vì nó có dùng <code>verify</code> của keyring cho một chữ ký thật.)</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Phép chấm nào cũng gọi tên bài của nó; chạy lại demo đó (<code>demo4/alg-none.mjs</code>, <code>demo4/claims.mjs</code>, <code>demo4/rotate.mjs</code>).</li>
<li>Lấy khoá bằng <code>keyring[header.kid]</code>; nếu thiếu, từ chối — không bao giờ <code>if (key)</code>.</li>
<li>Từ chối trừ khi <code>header.alg === key.alg</code>; chỉ khi đó mới gọi <code>key.verify(signingInput, signature)</code>.</li>
<li>Với <code>exp</code>: từ chối khi <code>nowSec - skewSec &gt;= exp</code>; với <code>nbf</code>: từ chối khi <code>nowSec + skewSec &lt; nbf</code>. Kiểm <code>jti</code> với <code>revoked</code> cuối cùng.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/jwt/verify.js</code> của LabFlow ID</h3>
<p>Bản tham khảo là bộ xác minh thật, hiện từng dòng ở bài 4.2 và 4.3, bọc trong dáng <code>makeVerifier</code>. Điểm của nó, và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-4.mjs lab4/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Thuật toán đến từ khoá, không từ header; chữ ký được kiểm trước claim nào; <code>npm test</code> vẫn qua.</li>
<li>Bạn giải thích được T2 (<code>none</code>) và T3 (nhầm lẫn) bằng lời của mình.</li>
</ul>
<p><strong>Đạt khi:</strong> bộ xác minh của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn gọi được tên cú giả mạo sau mỗi phép chấm trượt.</p>
</div>
`,
};
