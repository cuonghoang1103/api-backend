/**
 * Authentication · Chương 5 · 5.2 — Xoay vòng, và cú tái dùng tố giác kẻ cắp. Slug giữ: auth-5-2-xoay-vong.
 * Output thật (_ma.mjs): họ r0→r1→r2 (r0/r1 used, r2 live); phát lại r0 sau grace ⇒ REUSE_DETECTED, cả họ revoked (kể cả r2);
 * refresh thật của An sau đó ⇒ REVOKED. Theo RFC 9700 (BCP 240) §4.14. CODE: hàm rotate() của src/refresh/layer.js.
 */
import G from '../giang/auth-05-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const L = CODE.layer.split('\n');
const ROTATE = L.slice(L.findIndex((l) => l.includes('async function rotate')), L.findIndex((l) => l.includes('const revokeFamily ='))).join('\n').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 9700 — OAuth 2.0 Security BCP (BCP 240), §2.2.2 / §4.14', 'A public client’s refresh token MUST be sender-constrained or rotated; on rotation, a reused token “SHOULD” invalidate the whole chain — the reuse-detection path (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'Rotate refresh tokens and detect reuse; treat a replayed token as compromise and revoke related tokens (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 9700 — BCP bảo mật OAuth 2.0 (BCP 240), §2.2.2 / §4.14', 'Refresh token của một client công khai PHẢI ràng theo người gửi hoặc xoay vòng; khi xoay, một token tái dùng "NÊN" vô hiệu cả chuỗi — đường phát hiện tái dùng (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'Xoay refresh token và phát hiện tái dùng; coi một token bị phát lại là đã lộ và thu hồi các token liên quan (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>A token comes in…</th><th>Server sees</th><th>Response</th></tr></thead>
<tbody>
<tr><td>the current token (used flag empty)</td><td>a live token</td><td>rotate: mark it used, mint the next, return it</td></tr>
<tr><td>an already-rotated token, within the grace window</td><td>a race (lesson 5.5)</td><td>return the child the first request minted</td></tr>
<tr><td>an already-rotated token, after the grace window</td><td><strong>reuse ⇒ theft</strong></td><td><strong>revoke the whole family</strong> (<code>REUSE_DETECTED</code>)</td></tr>
<tr><td>a token from a revoked family</td><td>already dead</td><td><code>REVOKED</code></td></tr>
<tr><td>a token past the family's 30 days</td><td>expired</td><td><code>EXPIRED</code></td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Một token đi vào…</th><th>Máy chủ thấy</th><th>Phản hồi</th></tr></thead>
<tbody>
<tr><td>token hiện hành (cờ đã-dùng trống)</td><td>một token sống</td><td>xoay: đánh dấu đã dùng, đúc cái kế, trả về</td></tr>
<tr><td>một token đã xoay, trong cửa sổ ân hạn</td><td>một cuộc đua (bài 5.5)</td><td>trả lại cái con mà request đầu đã đúc</td></tr>
<tr><td>một token đã xoay, sau cửa sổ ân hạn</td><td><strong>tái dùng ⇒ trộm</strong></td><td><strong>thu hồi cả họ</strong> (<code>REUSE_DETECTED</code>)</td></tr>
<tr><td>một token từ một họ đã thu hồi</td><td>đã chết</td><td><code>REVOKED</code></td></tr>
<tr><td>một token quá 30 ngày của họ</td><td>hết hạn</td><td><code>EXPIRED</code></td></tr>
</tbody>
</table>`;

export default {
  title: '5.2 — Rotation, and the reuse that gives the thief away|||5.2 — Xoay vòng, và cú tái dùng tố giác kẻ cắp',
  slug: 'auth-5-2-xoay-vong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một refresh token dài hạn là miếng mồi ngon; xoay vòng làm nó dùng-một-lần: mỗi /refresh đánh dấu token đã dùng, ghi cái thay nó, và đúc cái kế trong cùng họ. Nếu một token đã xoay quay lại (ngoài cửa sổ ân hạn), một trong hai bản là kẻ cắp — máy chủ không biết bản nào — nên thu hồi CẢ HỌ (REUSE_DETECTED), đăng xuất cả người thật. Chạy thật trên LabFlow ID v0.5: họ r0→r1→r2, phát lại r0 ⇒ cả họ revoked kể cả r2 sống. Theo RFC 9700 (BCP 240) và OWASP.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Rotation, and the reuse that gives the thief away</h2>
<p class="lead">The refresh token lives for 30 days, so it is the token worth stealing. Lesson 5.1 kept it in an HttpOnly cookie to make theft hard; this lesson makes theft <em>detectable</em>. Two mechanisms, together: <strong>rotation</strong> makes each refresh token single-use, and <strong>reuse detection</strong> treats a token that comes back after it was rotated as proof that a copy is loose — and revokes the whole family.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>rotate a refresh token on every use, in a family keyed to one login;</li>
<li>detect reuse of a rotated token and explain why it means theft;</li>
<li>revoke the whole family on reuse, and say why the real user is signed out too;</li>
<li>cite the RFC 9700 rule that a rotated token's reuse must invalidate the chain.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> rotation without reuse detection is the most common half-built refresh system — it looks secure and is not. After this lesson you build the whole thing, and you can say exactly what a reuse means.</p>
</div>

<h3>An everyday picture first</h3>
<p>A <strong>cheque book</strong>, one stub at a time. Each cheque is good once; the moment you write one, the next becomes current and the one before is void. Now suppose a <em>void</em> cheque clears at the bank. That should be impossible on the honest path — so it means someone copied your cheque book. The bank does not just bounce that cheque; it <strong>freezes the account</strong>, because any of your cheques might be a copy. A refresh family is the cheque book; rotation voids each token as it is used; a voided token clearing is reuse, and the response is to freeze the family.</p>

<h3>Rotation: single-use, in a family</h3>
<p>Every <code>/refresh</code> marks the presented token <code>used</code>, records which token <code>replaced</code> it, and mints the next one in the same family. Here is the whole <code>rotate()</code>:</p>
${ma('javascript', ROTATE)}
<p>The checks are in order: never issued (<code>INVALID</code>), family revoked (<code>REVOKED</code>), past 30 days (<code>EXPIRED</code>), already used (the race or theft), otherwise rotate. Let a family rotate twice and look at the rows:</p>
${ra(OUT['52-rotate-reuse'])}

<h3>The chain, and the replay</h3>
<p>After two refreshes the family has three rows: <code>r0</code> and <code>r1</code> are <code>used=yes</code>, <code>r2</code> is the live token (<code>used=no</code>). The server accepts only the one token whose <code>used</code> flag is still empty. Now the attacker, who copied <code>r0</code> earlier, replays it long after it was rotated away. The server finds a token already marked <code>used</code> — which never happens on the legitimate path — and the output above shows the result: <code>REUSE_DETECTED</code>, and <strong>every token of the family revoked</strong>, including the live <code>r2</code>. An's very next real refresh then returns <code>REVOKED</code>: she must sign in again.</p>

<h3>Why sign the real user out too</h3>
<p>A reuse means two copies of one token exist — the user's and a thief's — and you cannot tell which one just arrived. If you let <em>either</em> continue, you might be keeping the attacker signed in. Ending the whole family forces <strong>both</strong> to re-authenticate, which only the real user can do (they have the password or passkey). The cost is real — a legitimate user is logged out of that device — but it is the only safe call, and it is rare: it only fires when a rotated token is genuinely replayed.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Rotate</span><span class="lz-d">The current token is used ⇒ mark it used, mint the next in the family, return it.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Reuse</span><span class="lz-d">An already-used token comes back (after grace) ⇒ a copy is loose.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Revoke the family</span><span class="lz-d">Every token of the family is revoked, including the live one.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Re-authenticate</span><span class="lz-d">The real user signs in again; the thief cannot.</span></div>
</div>

<h3>When it goes wrong</h3>
${BANG_EN}
<p>RFC 9700 (OAuth 2.0 Security BCP, BCP 240) requires a public client's refresh token to be sender-constrained or rotated, and a rotated token's reuse to invalidate the chain — exactly this path. OWASP's session cheat sheet says the same: rotate, detect reuse, treat a replay as compromise.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — rotation without detection, or detection without rotation.</strong> Rotating but accepting an old token anyway (“be lenient”) is theatre: a stolen token still works for 30 days. Trying to detect reuse without rotation is impossible — there is no “already used” state to notice. The two mechanisms only work together: single-use tokens, and a reused one meaning theft.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What is refresh token rotation?”</strong> — Each refresh issues a new token and retires the old one, so a refresh token is single-use.</li>
<li><strong>“What is reuse detection?”</strong> — A token that was already rotated coming back means a copy exists; you revoke the whole family (every token of that login).</li>
<li><strong>“Doesn't that log out real users?”</strong> — Only when a rotated token is actually replayed. You cannot tell the user's copy from the thief's, so you end the family and make both re-authenticate.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo5/rotate-reuse.mjs</code>. After reuse, how many rows are revoked, and which one surprises you?</li>
<li>Change the demo to replay <code>r1</code> instead of <code>r0</code>. Does the family still get revoked? Why?</li>
<li>Comment out the <code>store.revokeFamily(...)</code> line in <code>src/refresh/layer.js</code> and rerun. What does the attacker get now?</li>
</ol>
<p><strong>Solution:</strong> (1) all three — the live <code>r2</code> is revoked too, which logs out the real user. (2) yes — any already-used token in the family triggers reuse detection; the family is revoked regardless of which rotated token is replayed. (3) the attacker's replay succeeds and they get a fresh token: you have rotation without detection, i.e. no protection.</p>
<p><strong>Done when:</strong> you can trace a rotation chain, show a reuse, and explain why the whole family — not just the stale token — is revoked.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rotation</span><span class="v">Issuing a new refresh token and retiring the old one on every use; the token is single-use.</span></div>
  <div class="kv"><span class="k">reuse detection</span><span class="v">Noticing that an already-rotated token came back; treated as theft.</span></div>
  <div class="kv"><span class="k">family</span><span class="v">All tokens from one login; the unit that is revoked on reuse.</span></div>
  <div class="kv"><span class="k">used / replaced_by</span><span class="v">The columns that make a token single-use and link it to its successor.</span></div>
  <div class="kv"><span class="k">revoke</span><span class="v">Mark every token of a family dead; the next refresh returns <code>REVOKED</code>.</span></div>
  <div class="kv"><span class="k">compromise response</span><span class="v">Ending the family forces both copies to re-authenticate — the safe reaction to a replay.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rotation makes each refresh token single-use: mark used, record the successor, mint the next in the family.</li>
<li>A token that comes back after it was rotated (outside the grace window) is reuse — a copy is loose.</li>
<li>Reuse revokes the <strong>whole family</strong>, including the live token, so the real user re-authenticates too.</li>
<li>You cannot tell the user's copy from the thief's, so ending the family is the only safe response.</li>
<li>Rotation and detection only work together (RFC 9700, OWASP).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Applied in Node.js — lesson 8.2: JWT, access and refresh tokens', sub: 'Same rotation + reuse detection on the Notes API. That lesson builds it into Express and re-creates a production incident; this one shows the family in the table, revokes it on reuse, and ties it to RFC 9700. Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Xoay vòng, và cú tái dùng tố giác kẻ cắp</h2>
<p class="lead">Refresh token sống 30 ngày, nên nó là token đáng trộm. Bài 5.1 giữ nó trong một cookie HttpOnly để trộm khó; bài này làm trộm <em>phát hiện được</em>. Hai cơ chế, cùng nhau: <strong>xoay vòng</strong> làm mỗi refresh token dùng-một-lần, và <strong>phát hiện tái dùng</strong> coi một token quay lại sau khi đã xoay là bằng chứng một bản đang lọt ra ngoài — và thu hồi cả họ.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>xoay một refresh token mỗi lần dùng, trong một họ khoá theo một lần đăng nhập;</li>
<li>phát hiện tái dùng một token đã xoay và giải thích vì sao nó nghĩa là trộm;</li>
<li>thu hồi cả họ khi tái dùng, và nói vì sao người thật cũng bị đăng xuất;</li>
<li>dẫn luật RFC 9700 rằng việc tái dùng một token đã xoay phải vô hiệu cả chuỗi.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> xoay vòng mà không phát hiện tái dùng là hệ refresh dựng-nửa-vời phổ biến nhất — trông an toàn mà không. Học xong bài này bạn dựng trọn, và nói chính xác một lần tái dùng nghĩa là gì.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Một <strong>cuốn séc</strong>, từng tờ một. Mỗi tờ séc dùng được một lần; khoảnh khắc bạn viết một tờ, tờ kế thành hiện hành và tờ trước thành vô hiệu. Giờ giả sử một tờ séc <em>vô hiệu</em> lại được ngân hàng thanh toán. Điều đó lẽ ra bất khả trên đường ngay thẳng — nên nó nghĩa là ai đó đã chép cuốn séc của bạn. Ngân hàng không chỉ trả lại tờ séc đó; nó <strong>đóng băng tài khoản</strong>, vì bất kỳ tờ séc nào của bạn cũng có thể là bản chép. Một họ refresh là cuốn séc; xoay vòng làm mỗi token vô hiệu khi được dùng; một token vô hiệu được thanh toán là tái dùng, và phản hồi là đóng băng họ.</p>

<h3>Xoay vòng: dùng-một-lần, trong một họ</h3>
<p>Mỗi <code>/refresh</code> đánh dấu token được trình <code>used</code>, ghi lại token nào <code>replaced</code> nó, và đúc cái kế trong cùng họ. Đây là toàn bộ <code>rotate()</code>:</p>
${ma('javascript', ROTATE)}
<p>Các phép kiểm theo thứ tự: chưa từng phát (<code>INVALID</code>), họ đã thu hồi (<code>REVOKED</code>), quá 30 ngày (<code>EXPIRED</code>), đã dùng (cuộc đua hoặc trộm), còn lại thì xoay. Để một họ xoay hai lần và nhìn các dòng:</p>
${ra(OUT['52-rotate-reuse'])}

<h3>Cái chuỗi, và cú phát lại</h3>
<p>Sau hai lần refresh, họ có ba dòng: <code>r0</code> và <code>r1</code> là <code>used=yes</code>, <code>r2</code> là token sống (<code>used=no</code>). Máy chủ chỉ chấp nhận một token duy nhất mà cờ <code>used</code> còn trống. Giờ kẻ tấn công, đã chép <code>r0</code> từ trước, phát lại nó lâu sau khi nó bị xoay đi. Máy chủ thấy một token đã đánh dấu <code>used</code> — điều không bao giờ xảy ra trên đường hợp lệ — và output trên cho thấy kết quả: <code>REUSE_DETECTED</code>, và <strong>mọi token của họ bị thu hồi</strong>, kể cả <code>r2</code> sống. Lần refresh thật kế tiếp của An rồi trả về <code>REVOKED</code>: cô phải đăng nhập lại.</p>

<h3>Vì sao đăng xuất cả người thật</h3>
<p>Một lần tái dùng nghĩa là có hai bản của một token — của người dùng và của kẻ cắp — và bạn không biết cái nào vừa đến. Nếu bạn để <em>cái nào</em> tiếp tục, bạn có thể đang giữ kẻ tấn công đăng nhập. Kết thúc cả họ buộc <strong>cả hai</strong> xác thực lại, điều chỉ người thật làm được (họ có mật khẩu hoặc passkey). Cái giá là thật — một người dùng hợp lệ bị đăng xuất khỏi thiết bị đó — nhưng đó là lựa chọn an toàn duy nhất, và nó hiếm: nó chỉ nổ khi một token đã xoay thật sự bị phát lại.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xoay</span><span class="lz-d">Token hiện hành được dùng ⇒ đánh dấu đã dùng, đúc cái kế trong họ, trả về.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tái dùng</span><span class="lz-d">Một token đã dùng quay lại (sau ân hạn) ⇒ một bản đang lọt ra ngoài.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thu hồi họ</span><span class="lz-d">Mọi token của họ bị thu hồi, kể cả cái sống.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Xác thực lại</span><span class="lz-d">Người thật đăng nhập lại; kẻ cắp không thể.</span></div>
</div>

<h3>Khi nó hỏng</h3>
${BANG_VI}
<p>RFC 9700 (BCP bảo mật OAuth 2.0, BCP 240) yêu cầu refresh token của một client công khai phải ràng theo người gửi hoặc xoay vòng, và việc tái dùng một token đã xoay phải vô hiệu cả chuỗi — đúng đường này. Session cheat sheet của OWASP nói y vậy: xoay, phát hiện tái dùng, coi một lần phát lại là đã lộ.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — xoay vòng mà không phát hiện, hoặc phát hiện mà không xoay vòng.</strong> Xoay mà vẫn chấp nhận một token cũ ("khoan dung") là diễn kịch: một token bị trộm vẫn chạy 30 ngày. Cố phát hiện tái dùng mà không xoay vòng thì bất khả — chẳng có trạng thái "đã dùng" để nhận ra. Hai cơ chế chỉ chạy khi cùng nhau: token dùng-một-lần, và một cái tái dùng nghĩa là trộm.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Xoay vòng refresh token là gì?"</strong> — Mỗi lần refresh phát một token mới và cho cái cũ nghỉ, nên một refresh token dùng-một-lần.</li>
<li><strong>"Phát hiện tái dùng là gì?"</strong> — Một token đã xoay quay lại nghĩa là có một bản tồn tại; bạn thu hồi cả họ (mọi token của lần đăng nhập đó).</li>
<li><strong>"Thế không đăng xuất người thật à?"</strong> — Chỉ khi một token đã xoay thật sự bị phát lại. Bạn không phân biệt được bản của người dùng với bản của kẻ cắp, nên kết thúc họ và buộc cả hai xác thực lại.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo5/rotate-reuse.mjs</code>. Sau tái dùng, bao nhiêu dòng bị thu hồi, và cái nào làm bạn bất ngờ?</li>
<li>Sửa demo để phát lại <code>r1</code> thay vì <code>r0</code>. Họ vẫn bị thu hồi chứ? Vì sao?</li>
<li>Chú thích bỏ dòng <code>store.revokeFamily(...)</code> trong <code>src/refresh/layer.js</code> và chạy lại. Kẻ tấn công giờ nhận được gì?</li>
</ol>
<p><strong>Lời giải:</strong> (1) cả ba — <code>r2</code> sống cũng bị thu hồi, điều này đăng xuất người thật. (2) có — bất kỳ token đã dùng nào trong họ cũng kích hoạt phát hiện tái dùng; họ bị thu hồi bất kể token đã xoay nào bị phát lại. (3) cú phát lại của kẻ tấn công thành công và chúng nhận một token mới: bạn có xoay vòng mà không phát hiện, tức không có bảo vệ.</p>
<p><strong>Đạt khi:</strong> bạn lần được một chuỗi xoay vòng, chỉ ra một lần tái dùng, và giải thích vì sao cả họ — không chỉ token cũ — bị thu hồi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rotation (xoay vòng)</span><span class="v">Phát một refresh token mới và cho cái cũ nghỉ mỗi lần dùng; token dùng-một-lần.</span></div>
  <div class="kv"><span class="k">reuse detection (phát hiện tái dùng)</span><span class="v">Nhận ra một token đã xoay quay lại; coi là trộm.</span></div>
  <div class="kv"><span class="k">family (họ)</span><span class="v">Mọi token từ một lần đăng nhập; đơn vị bị thu hồi khi tái dùng.</span></div>
  <div class="kv"><span class="k">used / replaced_by</span><span class="v">Các cột làm một token dùng-một-lần và nối nó với cái kế nhiệm.</span></div>
  <div class="kv"><span class="k">revoke (thu hồi)</span><span class="v">Đánh dấu mọi token của một họ đã chết; lần refresh kế trả về <code>REVOKED</code>.</span></div>
  <div class="kv"><span class="k">compromise response (phản ứng khi lộ)</span><span class="v">Kết thúc họ buộc cả hai bản xác thực lại — phản ứng an toàn trước một lần phát lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xoay vòng làm mỗi refresh token dùng-một-lần: đánh dấu đã dùng, ghi cái kế nhiệm, đúc cái kế trong họ.</li>
<li>Một token quay lại sau khi đã xoay (ngoài cửa sổ ân hạn) là tái dùng — một bản đang lọt ra ngoài.</li>
<li>Tái dùng thu hồi <strong>cả họ</strong>, kể cả token sống, nên người thật cũng xác thực lại.</li>
<li>Bạn không phân biệt được bản của người dùng với bản của kẻ cắp, nên kết thúc họ là phản ứng an toàn duy nhất.</li>
<li>Xoay vòng và phát hiện chỉ chạy khi cùng nhau (RFC 9700, OWASP).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Áp vào Node.js — bài 8.2: JWT, access và refresh token', sub: 'Cùng xoay vòng + phát hiện tái dùng trên Notes API. Bài đó dựng nó vào Express và tái hiện một sự cố production; bài này cho thấy cái họ trong bảng, thu hồi nó khi tái dùng, và buộc vào RFC 9700. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
