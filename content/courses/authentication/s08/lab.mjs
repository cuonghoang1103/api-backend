/**
 * Authentication · Chương 8 · Lab 8 — Kiểm ID token của LabFlow API. BÀI MỚI, slug auth-8-7-lab-id-token (trước quiz auth-8-6).
 * Máy chấm = scripts/cham-lab-8.mjs (6 phép, 10 điểm, đạt 7). Output: khởi đầu 0/10, yếu 3/10, tham khảo 10/10, npm test 46 pass.
 */
import G from '../giang/auth-lab-8.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader8.split('\n');
const GR_T2 = GR.slice(GR.findIndex((l) => l.includes('T2 a bad signature')), GR.findIndex((l) => l.includes('T3 the wrong issuer'))).join('\n').trim();
const SETUP = `cp -r lab8/starter lab8/my
node scripts/cham-lab-8.mjs lab8/my      # pure — no database, no network, no browser`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails…</th></tr></thead>
<tbody>
<tr><td>T1 a valid token is accepted</td><td>1.5</td><td>no one can log in via the provider</td></tr>
<tr><td>T2 a bad signature is rejected (the critical one)</td><td>2</td><td>anyone can forge an ID token for any user</td></tr>
<tr><td>T3 the wrong issuer is rejected</td><td>1.5</td><td>a token from another provider is accepted</td></tr>
<tr><td>T4 the wrong audience (string or array)</td><td>2</td><td>app A's token logs the user into app B</td></tr>
<tr><td>T5 expired and future-dated are rejected</td><td>1.5</td><td>a stale or pre-minted token works</td></tr>
<tr><td>T6 wrong nonce rejected; malformed never crashes</td><td>1.5</td><td>an old token replays; junk input 500s</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt…</th></tr></thead>
<tbody>
<tr><td>T1 một token hợp lệ được nhận</td><td>1,5</td><td>chẳng ai đăng nhập qua provider được</td></tr>
<tr><td>T2 một chữ ký sai bị từ chối (cái tối quan trọng)</td><td>2</td><td>ai cũng giả một ID token cho bất kỳ người dùng nào</td></tr>
<tr><td>T3 sai issuer bị từ chối</td><td>1,5</td><td>một token từ provider khác được nhận</td></tr>
<tr><td>T4 sai audience (chuỗi hoặc mảng)</td><td>2</td><td>token của app A đăng nhập người dùng vào app B</td></tr>
<tr><td>T5 hết hạn và đề-ngày-tương-lai bị từ chối</td><td>1,5</td><td>một token cũ hoặc đúc-trước chạy</td></tr>
<tr><td>T6 sai nonce bị từ chối; malformed không bao giờ sập</td><td>1,5</td><td>một token cũ phát lại; đầu vào rác làm 500</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 8 — LabFlow API’s ID-token check|||Lab 8 — Kiểm ID token của LabFlow API',
  slug: 'auth-8-7-lab-id-token',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab Chương 8, thang 10 điểm (đạt 7) chấm bằng máy: viết phần xác minh ID token của client — bảy phép kiểm (bài 8.4) dạng một hàm thuần verifyIdToken(payload, ctx). Chữ ký kiểm ở nơi khác, kết quả truyền vào signatureValid — đừng bỏ nó. Máy chấm đưa một token hợp lệ và một token bị sửa cho mỗi phép (sai chữ ký, sai iss, sai aud chuỗi/mảng, hết hạn, đề-ngày-tương-lai, sai nonce, malformed). Output thật: khởi đầu 0/10, lần thử đầu "đăng nhập được" nhưng bỏ chữ ký/aud/nonce (3/10), tham khảo src/oidc/verify.js (10/10, 46 test xanh).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab 8</span>
<h2>LabFlow API’s ID-token check</h2>
<p class="lead">30–60 minutes. You write the single most security-critical function in any "Sign in with…" client: the ID-token check. It is a pure function — the seven checks from lesson 8.4 — and the grader attacks it the way a forged or stolen token would, feeding a valid token and one tampered token per check.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> implement ID-token validation you can defend check by check; read a grader failure as the exact bypass it allows; and explain why the signature and the audience checks are the two that must never be skipped.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.8. The grader is pure — no database, no network:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab8/my/index.js</code>. Export <code>verifyIdToken(payload, ctx)</code>; <code>ctx</code> has <code>{ signatureValid, expectedIssuer, expectedAudience, nonce, now }</code>. Return <code>{ ok, sub }</code> or <code>{ error }</code>. Do NOT import <code>../../src/oidc/verify.js</code> — that is the answer.</li>
</ol>

<h3>Your task — the seven checks, in order</h3>
<p>malformed → bad_signature → bad_iss → bad_aud → expired → bad_iat → bad_nonce. The signature is verified elsewhere (it needs the provider's JWKS); its result arrives as <code>signatureValid</code>, and you must still gate on it. <code>aud</code> may be a string or an array that must contain your client id.</p>

<h3>How it is graded: 6 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>The highest-value check is the signature — skip it and every other check is meaningless:</p>
${ma('javascript', GR_T2)}

<h3>A first attempt that "logs the user in"</h3>
<p>This attempt checks the issuer and the expiry, which is enough to pass a quick manual test. But it never checks the signature, the audience or the nonce — so it accepts a forgery, another client's token, and a replay.</p>
${ma('javascript', CODE.yeu8)}
${ra(OUT['lab-yeu'])}
<p>3 out of 10, and each miss is a bypass:</p>
<ul>
<li><strong>T2:</strong> no signature check — a forged, unsigned token claiming any <code>sub</code> is accepted.</li>
<li><strong>T4:</strong> no audience check — a token minted for another client logs the user in here.</li>
<li><strong>T6:</strong> no nonce check — an ID token captured from another login replays.</li>
<li>It passes only T1 (valid), T3 (iss) and part of the plumbing.</li>
</ul>

<h3>Hints (light → strong)</h3>
<ol>
<li>Guard the order exactly: a <code>null</code> payload is <code>malformed</code> before anything else touches it.</li>
<li>Gate on <code>signatureValid</code> immediately after malformed — never reach the claim checks on an unsigned token.</li>
<li>Normalise <code>aud</code> to an array, then check it <em>includes</em> your <code>expectedAudience</code>.</li>
<li>Check <code>exp &gt; now</code> and <code>iat &lt;= now + 60</code> (a little future skew is allowed; a lot is not).</li>
</ol>

<h3>Reference solution — <code>src/oidc/verify.js</code></h3>
<p>The reference is the real check, shown in lesson 8.4. Its grade, and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-8.mjs lab8/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>Every tampered token is rejected with the right error; <code>aud</code> handles a string and an array; <code>npm test</code> still passes.</li>
<li>You can explain T2 (signature) and T4 (audience) as full bypasses in your own words.</li>
</ul>
<p><strong>Done when:</strong> your check scores ≥ 7/10 twice in a row, and you can name the bypass behind every failed check.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab 8</span>
<h2>Kiểm ID token của LabFlow API</h2>
<p class="lead">30–60 phút. Bạn viết cái hàm trọng yếu bảo mật nhất trong bất kỳ client "Đăng nhập bằng…" nào: phép kiểm ID token. Nó là một hàm thuần — bảy phép kiểm của bài 8.4 — và máy chấm tấn công nó đúng cách một token giả hay bị trộm sẽ làm, đưa một token hợp lệ và một token bị sửa cho mỗi phép.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> cài xác minh ID token bạn bảo vệ được từng phép; đọc một dòng trượt như đúng cú bypass nó cho phép; và giải thích vì sao phép kiểm chữ ký và audience là hai cái không bao giờ được bỏ.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.8. Máy chấm thuần — không cơ sở dữ liệu, không mạng:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab8/my/index.js</code>. Xuất <code>verifyIdToken(payload, ctx)</code>; <code>ctx</code> có <code>{ signatureValid, expectedIssuer, expectedAudience, nonce, now }</code>. Trả <code>{ ok, sub }</code> hoặc <code>{ error }</code>. ĐỪNG import <code>../../src/oidc/verify.js</code> — đó là đáp án.</li>
</ol>

<h3>Nhiệm vụ — bảy phép kiểm, theo thứ tự</h3>
<p>malformed → bad_signature → bad_iss → bad_aud → expired → bad_iat → bad_nonce. Chữ ký kiểm ở nơi khác (nó cần JWKS của provider); kết quả tới dạng <code>signatureValid</code>, và bạn vẫn phải chặn theo nó. <code>aud</code> có thể là một chuỗi hoặc một mảng phải chứa id client của bạn.</p>

<h3>Chấm thế nào: 6 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>Phép giá trị nhất là chữ ký — bỏ nó thì mọi phép khác vô nghĩa:</p>
${ma('javascript', GR_T2)}

<h3>Một lần thử đầu "đăng nhập được"</h3>
<p>Lần thử này kiểm issuer và hết hạn, đủ để qua một phép thử tay nhanh. Nhưng nó không bao giờ kiểm chữ ký, audience hay nonce — nên nhận một bản giả, token của một client khác, và một lần phát lại.</p>
${ma('javascript', CODE.yeu8)}
${ra(OUT['lab-yeu'])}
<p>3 trên 10, và mỗi lần trượt là một cú bypass:</p>
<ul>
<li><strong>T2:</strong> không kiểm chữ ký — một token giả, không ký khai bất kỳ <code>sub</code> nào được nhận.</li>
<li><strong>T4:</strong> không kiểm audience — một token đúc cho một client khác đăng nhập người dùng ở đây.</li>
<li><strong>T6:</strong> không kiểm nonce — một ID token bắt từ một đăng nhập khác phát lại.</li>
<li>Nó chỉ qua T1 (hợp lệ), T3 (iss) và một phần ống nước.</li>
</ul>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Chặn đúng thứ tự: một payload <code>null</code> là <code>malformed</code> trước khi bất cứ gì chạm nó.</li>
<li>Chặn theo <code>signatureValid</code> ngay sau malformed — không bao giờ tới các phép kiểm claim trên một token không ký.</li>
<li>Chuẩn hoá <code>aud</code> về một mảng, rồi kiểm nó <em>chứa</em> <code>expectedAudience</code> của bạn.</li>
<li>Kiểm <code>exp &gt; now</code> và <code>iat &lt;= now + 60</code> (lệch tương lai một chút được; nhiều thì không).</li>
</ol>

<h3>Lời giải tham khảo — <code>src/oidc/verify.js</code></h3>
<p>Bản tham khảo là phép kiểm thật, hiện ở bài 8.4. Điểm của nó, và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-8.mjs lab8/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Mọi token bị sửa bị từ chối với đúng lỗi; <code>aud</code> xử lý một chuỗi và một mảng; <code>npm test</code> vẫn qua.</li>
<li>Bạn giải thích được T2 (chữ ký) và T4 (audience) như các cú bypass trọn vẹn bằng lời của mình.</li>
</ul>
<p><strong>Đạt khi:</strong> phép kiểm của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn gọi được tên cú bypass sau mỗi phép chấm trượt.</p>
</div>
`,
};
