/**
 * Authentication · Chương 4 · 4.3 — Bảy claim, và cú tấn công cho mỗi cái bạn bỏ qua. Slug giữ: auth-4-3-cac-claim.
 * Output thật (_ma.mjs): bỏ từng claim ⇒ mã từ chối riêng (BAD_ISS/BAD_AUD/NO_SUB/EXPIRED/NO_IAT/NO_JTI); exp là biên
 * (skew 0: exp==now đã hết hạn; skew 60: trễ 30 s qua, 61 s không); nbf gương lại; thu hồi = denylist jti, dịch vụ khác vẫn tin.
 */
import G from '../giang/auth-04-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const V = CODE.verify.split('\n');
const CLAIMS = V.slice(V.findIndex((l) => l.includes('3) CLAIMS')), V.findIndex((l) => l.includes('return payload'))).concat('  return payload;', '}').join('\n').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 7519 — JWT, §4.1 registered claims', '“exp … MUST NOT be accepted … on or after”; “Implementers MAY provide for some small leeway … for clock skew”; “aud … MUST be rejected”; “jti … can be used to prevent … replay” (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7519'),
  nguon('📜', 'RFC 8725 — JWT BCP, §3.8–3.9', 'If the keys do not belong to the issuer, the application MUST reject the JWT; if the audience is missing or not the recipient, it MUST reject the JWT (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8725'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 7519 — JWT, §4.1 các claim chuẩn', '"exp … KHÔNG ĐƯỢC chấp nhận … tại hoặc sau"; "Người cài MAY cho một dung sai nhỏ … cho lệch đồng hồ"; "aud … PHẢI bị từ chối"; "jti … dùng để chống … phát lại" (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7519'),
  nguon('📜', 'RFC 8725 — JWT BCP, §3.8–3.9', 'Nếu khoá không thuộc về issuer, ứng dụng PHẢI từ chối JWT; nếu audience thiếu hoặc không phải người nhận, PHẢI từ chối JWT (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc8725'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Claim</th><th>Means</th><th>Skip it and…</th><th>LabFlow ID code</th></tr></thead>
<tbody>
<tr><td><code>iss</code></td><td>who minted it</td><td>a token from another issuer is accepted</td><td><code>BAD_ISS</code></td></tr>
<tr><td><code>sub</code></td><td>who it is about</td><td>a token that names no user is “someone”</td><td><code>NO_SUB</code></td></tr>
<tr><td><code>aud</code></td><td>who it is for</td><td>a token for the chat service is spent at the API</td><td><code>BAD_AUD</code></td></tr>
<tr><td><code>exp</code></td><td>when it dies</td><td>a stolen token never expires</td><td><code>EXPIRED</code></td></tr>
<tr><td><code>nbf</code></td><td>when it starts</td><td>a pre-dated token works early (minor, but free to check)</td><td><code>NOT_YET</code></td></tr>
<tr><td><code>iat</code></td><td>when it was minted</td><td>you cannot reason about a token's age</td><td><code>NO_IAT</code></td></tr>
<tr><td><code>jti</code></td><td>its unique id</td><td>nothing can be revoked or caught as a replay</td><td><code>NO_JTI</code> / <code>REVOKED</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Claim</th><th>Nghĩa</th><th>Bỏ nó và…</th><th>Mã LabFlow ID</th></tr></thead>
<tbody>
<tr><td><code>iss</code></td><td>ai đúc ra</td><td>một token từ issuer khác được chấp nhận</td><td><code>BAD_ISS</code></td></tr>
<tr><td><code>sub</code></td><td>về ai</td><td>một token không nêu người dùng là "ai đó"</td><td><code>NO_SUB</code></td></tr>
<tr><td><code>aud</code></td><td>cho ai</td><td>một token cho dịch vụ chat tiêu được ở API</td><td><code>BAD_AUD</code></td></tr>
<tr><td><code>exp</code></td><td>khi nào chết</td><td>một token bị trộm không bao giờ hết hạn</td><td><code>EXPIRED</code></td></tr>
<tr><td><code>nbf</code></td><td>khi nào bắt đầu</td><td>một token ghi lùi ngày chạy sớm (nhỏ, nhưng kiểm miễn phí)</td><td><code>NOT_YET</code></td></tr>
<tr><td><code>iat</code></td><td>đúc lúc nào</td><td>bạn không suy luận được tuổi của token</td><td><code>NO_IAT</code></td></tr>
<tr><td><code>jti</code></td><td>id duy nhất</td><td>chẳng gì thu hồi hay bắt được lần phát lại</td><td><code>NO_JTI</code> / <code>REVOKED</code></td></tr>
</tbody>
</table>`;

export default {
  title: '4.3 — Seven claims, and the attack for each you skip|||4.3 — Bảy claim, và cú tấn công cho mỗi cái bạn bỏ qua',
  slug: 'auth-4-3-cac-claim',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một chữ ký hợp lệ chỉ chứng minh token không bị sửa; nó không nói ai đúc, cho ai, còn hạn không. Bảy claim chuẩn (iss, sub, aud, exp, nbf, iat, jti) trả lời những câu đó, và bỏ cái nào cũng mở một lỗ có tên — chạy thật, mỗi lần bỏ cho một mã từ chối riêng. exp là một biên (skew 0: exp==now đã hết hạn) với dung sai đồng hồ nhỏ theo RFC 7519; nbf là gương của nó; thu hồi một JWT chỉ là một denylist jti tới khi hết hạn, và một dịch vụ khác không dùng chung danh sách vẫn tin token — cái giá cho việc bỏ lần tra của phiên.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Seven claims, and the attack for each you skip</h2>
<p class="lead">Lesson 4.2 made the signature trustworthy. But a trustworthy signature proves only that the token was not changed — not who minted it, not who it is for, not whether it is still in date. Those answers are the <strong>claims</strong>, and a verifier that checks the signature and stops is the single most common JWT mistake after the <code>alg</code> ones. This lesson walks the seven registered claims LabFlow ID checks and turns each omission into a concrete attack, measured on the real verifier.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>name the seven registered claims and what each one defends;</li>
<li>show the specific attack that each skipped claim allows;</li>
<li>enforce the <code>exp</code> boundary with the right clock-skew rule, and the <code>nbf</code> mirror;</li>
<li>explain why revoking a JWT is harder than revoking a session, and what a <code>jti</code> denylist buys.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> “I verified the signature” is where most JWT integrations stop, and it is where token confusion, replay and immortal stolen tokens live. After this lesson your verifier answers seven more questions, each with its own error.</p>
</div>

<h3>An everyday picture first</h3>
<p>A signature on a letter proves the sender wrote it. It does nothing about the <em>envelope</em>: it will not stop you handing the letter to the wrong department, acting on a letter addressed to someone else, or honouring last year's letter today. The claims are the envelope lines — the <strong>from</strong> (<code>iss</code>), the <strong>about</strong> (<code>sub</code>), the <strong>to</strong> (<code>aud</code>), and the <strong>valid between</strong> (<code>nbf</code>…<code>exp</code>). A signed letter with no envelope is exactly a signed token with no claims checked.</p>

<h3>The seven, in LabFlow ID</h3>
${BANG_EN}
<p>These are the <em>registered</em> claims of RFC 7519 §4.1. LabFlow ID's access token sets all seven (lesson 4.1 showed them), and the verifier checks all seven — after the signature, so a failing claim is always on an otherwise genuine token.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">signature</span><span class="lz-d">verified first — only above this line is the payload trustworthy at all</span></div>
  <div class="lz-layer"><span class="lz-k">who</span><span class="lz-d"><code>iss</code> (from), <code>sub</code> (about), <code>aud</code> (to) — reject a token from another issuer or for another service</span></div>
  <div class="lz-layer"><span class="lz-k">when</span><span class="lz-d"><code>nbf</code> ≤ now &lt; <code>exp</code>, each with a small clock-skew leeway; <code>iat</code> records its age</span></div>
  <div class="lz-layer"><span class="lz-k">which</span><span class="lz-d"><code>jti</code> present and not on the denylist — the only revocation a JWT allows</span></div>
</div>

<h3>Skip one, and here is the attack</h3>
<p>Each token below is <strong>validly signed</strong> — only the claim check can stop it. Removing one claim at a time:</p>
${ra(OUT['43-claims'])}
<p>Every omission has its own rejection. Two are worth dwelling on. <strong><code>aud</code></strong>: an access token minted for <code>labflow-chat</code> must not work at <code>labflow-api</code> — without the check, one leaked chat token becomes an API token (RFC 7519: a recipient not in <code>aud</code> “MUST reject”). <strong><code>iss</code></strong>: a token from <code>https://evil.example</code>, even perfectly signed with the attacker's own key, is refused because the issuer is not ours (RFC 8725 §3.8). Note the last line: an <code>aud</code> array that <em>includes</em> <code>labflow-api</code> is accepted — audiences may be a list.</p>

<h3>The claim checks, in code</h3>
${ma('javascript', CLAIMS)}
<p>One line per claim, one <code>JwtError</code> code per failure. The error codes stay on the server (lesson 1.5): the client sees a plain 401, the logs see <code>BAD_AUD</code>.</p>

<h3>exp is a boundary, and clock skew is real</h3>
<p>We met boundaries in Chapter 3's timeouts; <code>exp</code> is the same idea. RFC 7519: the token “MUST NOT be accepted … on or after” <code>exp</code>. But two machines never agree to the second, so the RFC allows “some small leeway … for clock skew”. A fake clock drives the real verifier:</p>
${ra(OUT['43-exp'])}
<p>At skew 0, <code>exp</code> equal to <code>now</code> is already expired. At skew 60, a token 30 seconds past <code>exp</code> still passes, 61 seconds past does not; and <code>nbf</code> (not before) is the mirror — a token that starts 55 seconds from now is let through, 90 seconds early is not. Together <code>nbf</code> and <code>exp</code> bound the window the token is alive. Pick the smallest skew your clocks allow; a few minutes is the RFC's ceiling, 60 seconds a common choice.</p>

<h3>Revoking a JWT is the hard part</h3>
<p>A session ends with one <code>DELETE</code> (lesson 3.1). A JWT cannot be un-issued: it is valid at every service that trusts the signature until <code>exp</code>. The best you can do before then is a <strong><code>jti</code> denylist</strong>:</p>
${ra(OUT['43-revoke'])}
<p>Adding the <code>jti</code> to the set revokes it <em>at this verifier</em>. But a second service that shares the key and keeps its own, empty denylist still accepts the token until it expires. That is the core trade-off: a session pays one lookup per request and gets instant revocation; a JWT skips the lookup and gives it up. It is also why access tokens are kept <strong>short</strong> — 15 minutes here — so a denylist only remembers a <code>jti</code> until <code>exp</code> and stays small. Chapter 5 adds the long-lived refresh token that renews them and can be revoked properly.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — treating a JWT like a session you can kill.</strong> “Log out” on a JWT-only system does not end the access token; it only stops issuing new ones. If a product needs an instant kill switch (a stolen laptop, a fired employee), either keep a server-side session, or add a <code>jti</code> denylist checked on every request — which is the per-request lookup JWTs were supposed to avoid. Decide this on purpose, not by accident.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Which JWT claims do you validate?”</strong> — iss, aud and sub for who/for-whom/about; exp and nbf for the time window with a small skew; iat for age; jti for revocation and replay. Signature first, then all of these.</li>
<li><strong>“Why validate <code>aud</code>?”</strong> — So a token minted for one service cannot be replayed at another. Without it, any service that trusts the issuer trusts every token.</li>
<li><strong>“How do you log a user out of a JWT system?”</strong> — You cannot instantly without a denylist or short lifetimes; we use 15-minute access tokens plus a refresh token you can revoke (Chapter 5).</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo4/claims.mjs</code>. For <code>aud</code>, change the token's audience to an array <code>['labflow-api','labflow-chat']</code>. Predict accept or reject before running.</li>
<li>Run <code>node demo4/exp-skew.mjs</code> with <code>skewSec</code> changed to 0 in the nbf block. What happens to the “55 s early” case?</li>
<li>Run <code>node demo4/revoke.mjs</code>. Explain in one sentence why the second service still accepts the revoked token.</li>
</ol>
<p><strong>Solution:</strong> (1) accepted — <code>aud</code> may be a list, and ours is in it. (2) at skew 0 the token is rejected (<code>NOT_YET</code>) until the exact <code>nbf</code> instant; the 55-second-early case now fails. (3) revocation is a per-verifier denylist; a service with its own empty denylist has never heard of that <code>jti</code>, so it trusts the signature until <code>exp</code>.</p>
<p><strong>Done when:</strong> you can name the attack each skipped claim allows, and explain the revocation trade-off in your own words.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">registered claims</span><span class="v">The standard-named claims of RFC 7519 §4.1: iss, sub, aud, exp, nbf, iat, jti.</span></div>
  <div class="kv"><span class="k">aud (audience)</span><span class="v">Who the token is for; a recipient not listed MUST reject it. May be a single value or an array.</span></div>
  <div class="kv"><span class="k">exp / nbf</span><span class="v">The end and start of the validity window; both checked with a small clock-skew leeway.</span></div>
  <div class="kv"><span class="k">clock skew</span><span class="v">The allowed disagreement between two clocks (seconds to a few minutes) when checking exp/nbf.</span></div>
  <div class="kv"><span class="k">jti (JWT ID)</span><span class="v">A unique token id; the handle for a denylist and for catching replays.</span></div>
  <div class="kv"><span class="k">denylist / revocation</span><span class="v">A set of jti values a verifier refuses; the only pre-expiry revocation a JWT allows, and only where the set is shared.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A valid signature is not enough; check iss, sub, aud, exp, nbf, iat, jti — each with its own error.</li>
<li>Skipping <code>aud</code> or <code>iss</code> lets tokens cross services or issuers; skipping <code>exp</code> makes a stolen token immortal.</li>
<li><code>exp</code> is a boundary (exp == now is expired at skew 0) with a small clock-skew leeway; <code>nbf</code> mirrors it.</li>
<li>A JWT cannot be un-issued; a <code>jti</code> denylist revokes only where it is shared, until <code>exp</code>.</li>
<li>Keep access tokens short (15 min) so revocation is cheap and the denylist stays small.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Applied in Node.js — lesson 8.2: JWT and refresh tokens', sub: 'Same claims and the same short-access + refresh split, with the jsonwebtoken library on the Notes API. That lesson wires it into Express end to end; this one checks each claim against the attack it prevents and measures the exp boundary and clock skew. Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Bảy claim, và cú tấn công cho mỗi cái bạn bỏ qua</h2>
<p class="lead">Bài 4.2 làm chữ ký đáng tin. Nhưng một chữ ký đáng tin chỉ chứng minh token không bị sửa — không phải ai đúc ra, dành cho ai, hay còn hạn không. Những câu trả lời đó là các <strong>claim</strong>, và một bộ xác minh kiểm chữ ký rồi dừng là lỗi JWT phổ biến nhất sau các lỗi <code>alg</code>. Bài này đi qua bảy claim chuẩn mà LabFlow ID kiểm và biến mỗi lần bỏ sót thành một cú tấn công cụ thể, đo trên bộ xác minh thật.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>gọi tên bảy claim chuẩn và mỗi cái bảo vệ điều gì;</li>
<li>chỉ ra cú tấn công cụ thể mà mỗi claim bị bỏ cho phép;</li>
<li>áp biên <code>exp</code> với đúng luật dung sai đồng hồ, và cái gương <code>nbf</code>;</li>
<li>giải thích vì sao thu hồi một JWT khó hơn thu hồi một phiên, và một denylist <code>jti</code> mua được gì.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "tôi đã xác minh chữ ký" là chỗ phần lớn hệ JWT dừng lại, và là chỗ nhầm lẫn token, phát lại và token bị trộm bất tử sinh sống. Học xong bài này, bộ xác minh của bạn trả lời thêm bảy câu hỏi, mỗi câu một lỗi riêng.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Chữ ký trên một lá thư chứng minh người gửi đã viết nó. Nó chẳng làm gì với cái <em>phong bì</em>: nó không ngăn bạn đưa thư tới nhầm phòng ban, hành động theo một lá thư gửi cho người khác, hay tôn trọng lá thư năm ngoái cho hôm nay. Các claim là các dòng trên phong bì — <strong>từ</strong> (<code>iss</code>), <strong>về</strong> (<code>sub</code>), <strong>gửi tới</strong> (<code>aud</code>), và <strong>có hiệu lực giữa</strong> (<code>nbf</code>…<code>exp</code>). Một lá thư có ký mà không có phong bì chính là một token có ký mà không kiểm claim nào.</p>

<h3>Bảy cái, trong LabFlow ID</h3>
${BANG_VI}
<p>Đây là các claim <em>chuẩn</em> (registered) của RFC 7519 §4.1. Access token của LabFlow ID đặt cả bảy (bài 4.1 đã cho thấy), và bộ xác minh kiểm cả bảy — sau chữ ký, nên một claim trượt luôn ở trên một token ngoài ra là thật.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">chữ ký</span><span class="lz-d">xác minh trước — chỉ trên vạch này payload mới đáng tin chút nào</span></div>
  <div class="lz-layer"><span class="lz-k">ai</span><span class="lz-d"><code>iss</code> (từ), <code>sub</code> (về), <code>aud</code> (tới) — từ chối một token từ issuer khác hay cho dịch vụ khác</span></div>
  <div class="lz-layer"><span class="lz-k">khi nào</span><span class="lz-d"><code>nbf</code> ≤ now &lt; <code>exp</code>, mỗi cái với một dung sai đồng hồ nhỏ; <code>iat</code> ghi tuổi của nó</span></div>
  <div class="lz-layer"><span class="lz-k">cái nào</span><span class="lz-d"><code>jti</code> có mặt và không trên denylist — sự thu hồi duy nhất mà JWT cho phép</span></div>
</div>

<h3>Bỏ một cái, và đây là cú tấn công</h3>
<p>Mỗi token dưới đây đều <strong>được ký hợp lệ</strong> — chỉ phép kiểm claim dừng được nó. Bỏ từng claim một:</p>
${ra(OUT['43-claims'])}
<p>Mỗi lần bỏ sót có một kiểu từ chối riêng. Hai cái đáng dừng lại. <strong><code>aud</code></strong>: một access token đúc cho <code>labflow-chat</code> không được chạy ở <code>labflow-api</code> — thiếu phép kiểm, một token chat bị lộ thành một token API (RFC 7519: người nhận không nằm trong <code>aud</code> "PHẢI từ chối"). <strong><code>iss</code></strong>: một token từ <code>https://evil.example</code>, dù ký hoàn hảo bằng khoá của chính kẻ tấn công, bị khước từ vì issuer không phải của ta (RFC 8725 §3.8). Để ý dòng cuối: một mảng <code>aud</code> <em>có chứa</em> <code>labflow-api</code> thì được chấp nhận — audience có thể là một danh sách.</p>

<h3>Các phép kiểm claim, trong mã</h3>
${ma('javascript', CLAIMS)}
<p>Một dòng cho mỗi claim, một mã <code>JwtError</code> cho mỗi lần trượt. Các mã lỗi ở lại máy chủ (bài 1.5): client thấy một 401 trơn, log thấy <code>BAD_AUD</code>.</p>

<h3>exp là một biên, và lệch đồng hồ là có thật</h3>
<p>Ta đã gặp biên ở các mốc hết hạn của Chương 3; <code>exp</code> cùng một ý. RFC 7519: token "KHÔNG ĐƯỢC chấp nhận … tại hoặc sau" <code>exp</code>. Nhưng hai máy không bao giờ nhất trí tới từng giây, nên RFC cho "một dung sai nhỏ … cho lệch đồng hồ". Một đồng hồ giả điều khiển bộ xác minh thật:</p>
${ra(OUT['43-exp'])}
<p>Ở dung sai 0, <code>exp</code> bằng <code>now</code> đã là hết hạn. Ở dung sai 60, một token quá <code>exp</code> 30 giây vẫn qua, quá 61 giây thì không; và <code>nbf</code> (not before) là tấm gương — một token bắt đầu sau 55 giây được cho qua, sớm 90 giây thì không. Cùng nhau <code>nbf</code> và <code>exp</code> chặn cửa sổ token còn sống. Chọn dung sai nhỏ nhất đồng hồ của bạn cho phép; vài phút là trần của RFC, 60 giây là lựa chọn phổ biến.</p>

<h3>Thu hồi một JWT mới là phần khó</h3>
<p>Một phiên kết thúc bằng một <code>DELETE</code> (bài 3.1). Một JWT không thể bị huỷ phát: nó hợp lệ ở mọi dịch vụ tin chữ ký cho tới <code>exp</code>. Tốt nhất trước đó là một <strong>denylist <code>jti</code></strong>:</p>
${ra(OUT['43-revoke'])}
<p>Thêm <code>jti</code> vào tập là thu hồi nó <em>ở bộ xác minh này</em>. Nhưng một dịch vụ thứ hai dùng chung khoá và giữ danh sách chặn riêng, rỗng, vẫn chấp nhận token tới khi hết hạn. Đó là đánh đổi cốt lõi: một phiên trả một lần tra mỗi request và được thu hồi tức thì; một JWT bỏ lần tra và từ bỏ điều đó. Đó cũng là vì sao access token được giữ <strong>ngắn</strong> — 15 phút ở đây — để một denylist chỉ nhớ một <code>jti</code> tới <code>exp</code> và luôn nhỏ. Chương 5 thêm refresh token dài hạn làm mới chúng và thu hồi được đàng hoàng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — coi một JWT như một phiên bạn giết được.</strong> "Đăng xuất" trên một hệ chỉ-JWT không kết thúc access token; nó chỉ ngừng phát cái mới. Nếu sản phẩm cần một công tắc giết tức thì (laptop bị trộm, nhân viên bị sa thải), hoặc giữ một phiên phía máy chủ, hoặc thêm một denylist <code>jti</code> kiểm ở mọi request — mà đó chính là lần tra mỗi request mà JWT lẽ ra để né. Hãy quyết định điều này có chủ ý, không phải tình cờ.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn kiểm những claim JWT nào?"</strong> — iss, aud và sub cho ai/cho-ai/về-ai; exp và nbf cho cửa sổ thời gian với dung sai nhỏ; iat cho tuổi; jti cho thu hồi và phát lại. Chữ ký trước, rồi tất cả những cái này.</li>
<li><strong>"Vì sao kiểm <code>aud</code>?"</strong> — Để một token đúc cho một dịch vụ không phát lại được ở dịch vụ khác. Thiếu nó, mọi dịch vụ tin issuer là tin mọi token.</li>
<li><strong>"Làm sao đăng xuất một người khỏi hệ JWT?"</strong> — Không thể tức thì nếu không có denylist hay tuổi thọ ngắn; ta dùng access token 15 phút cộng một refresh token thu hồi được (Chương 5).</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo4/claims.mjs</code>. Với <code>aud</code>, đổi audience của token thành một mảng <code>['labflow-api','labflow-chat']</code>. Đoán chấp nhận hay từ chối trước khi chạy.</li>
<li>Chạy <code>node demo4/exp-skew.mjs</code> với <code>skewSec</code> đổi thành 0 trong khối nbf. Trường hợp "sớm 55 s" ra sao?</li>
<li>Chạy <code>node demo4/revoke.mjs</code>. Giải thích một câu vì sao dịch vụ thứ hai vẫn chấp nhận token đã thu hồi.</li>
</ol>
<p><strong>Lời giải:</strong> (1) chấp nhận — <code>aud</code> có thể là một danh sách, và của ta nằm trong đó. (2) ở dung sai 0 token bị từ chối (<code>NOT_YET</code>) tới đúng thời điểm <code>nbf</code>; trường hợp sớm 55 giây giờ trượt. (3) thu hồi là một denylist theo từng bộ xác minh; một dịch vụ với denylist rỗng của riêng nó chưa từng nghe tới <code>jti</code> đó, nên nó tin chữ ký tới <code>exp</code>.</p>
<p><strong>Đạt khi:</strong> bạn gọi được tên cú tấn công mà mỗi claim bị bỏ cho phép, và giải thích đánh đổi thu hồi bằng lời của mình.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">registered claims (claim chuẩn)</span><span class="v">Các claim có tên chuẩn của RFC 7519 §4.1: iss, sub, aud, exp, nbf, iat, jti.</span></div>
  <div class="kv"><span class="k">aud (audience)</span><span class="v">Token dành cho ai; người nhận không có tên PHẢI từ chối nó. Có thể là một giá trị hoặc một mảng.</span></div>
  <div class="kv"><span class="k">exp / nbf</span><span class="v">Điểm cuối và điểm đầu của cửa sổ hiệu lực; cả hai kiểm với một dung sai đồng hồ nhỏ.</span></div>
  <div class="kv"><span class="k">clock skew (lệch đồng hồ)</span><span class="v">Mức chênh lệch cho phép giữa hai đồng hồ (giây tới vài phút) khi kiểm exp/nbf.</span></div>
  <div class="kv"><span class="k">jti (JWT ID)</span><span class="v">Một id token duy nhất; tay cầm cho một denylist và để bắt các lần phát lại.</span></div>
  <div class="kv"><span class="k">denylist / revocation (thu hồi)</span><span class="v">Một tập giá trị jti bộ xác minh khước từ; sự thu hồi trước hạn duy nhất JWT cho phép, và chỉ ở nơi tập đó được chia sẻ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một chữ ký hợp lệ chưa đủ; kiểm iss, sub, aud, exp, nbf, iat, jti — mỗi cái một lỗi riêng.</li>
<li>Bỏ <code>aud</code> hay <code>iss</code> cho token vượt dịch vụ hoặc issuer; bỏ <code>exp</code> làm một token bị trộm bất tử.</li>
<li><code>exp</code> là một biên (exp == now là hết hạn ở dung sai 0) với dung sai đồng hồ nhỏ; <code>nbf</code> là gương của nó.</li>
<li>Một JWT không thể bị huỷ phát; một denylist <code>jti</code> chỉ thu hồi ở nơi được chia sẻ, tới <code>exp</code>.</li>
<li>Giữ access token ngắn (15 phút) để thu hồi rẻ và denylist luôn nhỏ.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Áp vào Node.js — bài 8.2: JWT và refresh token', sub: 'Cùng các claim và cùng cách tách access ngắn + refresh, với thư viện jsonwebtoken trên Notes API. Bài đó ráp nó vào Express từ đầu tới cuối; bài này kiểm từng claim trước cú tấn công nó chặn và đo biên exp cùng lệch đồng hồ. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
