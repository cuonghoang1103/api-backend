/**
 * Authentication · Mục 0 · 0.2 — Ba bài toán trốn trong chữ "đăng nhập". Slug giữ: auth-0-2-ba-bai-toan.
 * Soạn lại 01/11/2026 (đợt mẫu). Output cũ là tình huống bịa (/api/don-hang, Prisma) ⇒ thay bằng demo0/gates.js chạy thật
 * trên localhost:4800 (Node 22.23.3, Express 5.3.0, env -i). Token demo tok_an/tok_bin/tok_lan như khoá API Design.
 */
import G from '../giang/auth-00-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GT = CODE.gates.split('\n');
const G_V1 = GT.slice(15, 20).join('\n');
const G_AUTH = GT.slice(22, 31).join('\n');
const G_V2 = GT.slice(33, 38).join('\n');
const G_V3 = GT.slice(40, 46).join('\n');
const G_403 = GT.slice(48, 55).join('\n');

const NGUON_EN = [
  nguon('🥇', 'OWASP Top 10:2025 — A01 Broken Access Control', 'Still number one; “100% of the applications tested were found to have some form of broken access control” (read 01/11/2026).', 'https://top10.owasp.org/2025/A01_2025-Broken_Access_Control'),
  nguon('🧩', 'OWASP API Security Top 10 (2023) — API1 BOLA', 'Check, for every request, that the signed-in user may act on THIS object; random ids help but are not the check (read 01/11/2026).', 'https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization'),
  nguon('🚫', 'MDN — 403 Forbidden', '“Authenticating or re-authenticating makes no difference”; a server may answer 404 to hide that a resource exists (read 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403'),
  nguon('🔑', 'NIST SP 800-63B (800-63-4) — password verifiers', 'Verifiers SHALL NOT prompt for knowledge-based authentication or security questions, and SHALL NOT allow password hints (§3.1.1.2, read 01/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');
const NGUON_VI = [
  nguon('🥇', 'OWASP Top 10:2025 — A01 Broken Access Control', 'Vẫn đứng số một; “100% of the applications tested were found to have some form of broken access control” (đọc 01/11/2026).', 'https://top10.owasp.org/2025/A01_2025-Broken_Access_Control'),
  nguon('🧩', 'OWASP API Security Top 10 (2023) — API1 BOLA', 'Ở mọi request, kiểm người đang đăng nhập có được động vào CHÍNH đối tượng này không; id ngẫu nhiên có ích nhưng không thay được phép kiểm (đọc 01/11/2026).', 'https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization'),
  nguon('🚫', 'MDN — 403 Forbidden', '“Authenticating or re-authenticating makes no difference”; máy chủ có thể trả 404 để giấu việc tài nguyên tồn tại (đọc 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403'),
  nguon('🔑', 'NIST SP 800-63B (800-63-4) — bộ kiểm mật khẩu', 'Bộ kiểm SHALL NOT hỏi câu hỏi bảo mật hay xác thực dựa trên kiến thức, và SHALL NOT cho lưu gợi ý mật khẩu (§3.1.1.2, đọc 01/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Code</th><th>Means</th><th>What the client should do</th><th>LabFlow ID example (measured)</th></tr></thead>
<tbody>
<tr><td><code>401</code> Unauthorized</td><td>Gate 2 failed: “I do not know who you are”</td><td>Sign in (again) — and the response carries <code>WWW-Authenticate</code></td><td>no token ⇒ <code>/v2/users/usr_1</code> 401</td></tr>
<tr><td><code>403</code> Forbidden</td><td>Gate 3 failed and the resource is not secret: “I know you, and no”</td><td>Nothing — signing in again changes nothing</td><td>An changes a role ⇒ 403</td></tr>
<tr><td><code>404</code> Not Found</td><td>Does not exist — <em>or</em> exists and you may not even know that</td><td>Stop; do not guess further</td><td>An reads Bình's profile on v3 ⇒ 404</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Mã</th><th>Nghĩa</th><th>Client nên làm gì</th><th>Ví dụ LabFlow ID (đo thật)</th></tr></thead>
<tbody>
<tr><td><code>401</code> Unauthorized</td><td>Cổng 2 trượt: "tôi không biết bạn là ai"</td><td>Đăng nhập (lại) — và phản hồi mang header <code>WWW-Authenticate</code></td><td>không token ⇒ <code>/v2/users/usr_1</code> 401</td></tr>
<tr><td><code>403</code> Forbidden</td><td>Cổng 3 trượt và tài nguyên không bí mật: "biết bạn rồi, và không"</td><td>Không gì cả — đăng nhập lại chẳng thay đổi gì</td><td>An đổi vai trò ⇒ 403</td></tr>
<tr><td><code>404</code> Not Found</td><td>Không tồn tại — <em>hoặc</em> có tồn tại nhưng bạn không được biết điều đó</td><td>Dừng; đừng dò tiếp</td><td>An đọc hồ sơ của Bình trên v3 ⇒ 404</td></tr>
</tbody>
</table>`;

export default {
  title: '0.2 — Three problems hiding in the word "login"|||0.2 — Ba bài toán trốn trong chữ "đăng nhập"',
  slug: 'auth-0-2-ba-bai-toan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nhận diện, xác thực, phân quyền là ba cổng khác nhau — chạy thật cả ba trên demo0/gates.js: chỉ tự xưng thì ai cũng thành Cô Lan; xác thực mà quên phân quyền thì An đọc được hồ sơ mọi người (IDOR, OWASP A01:2025); phân quyền đặt ngay trong phép tra; 401/403/404 dùng khi nào; ba loại yếu tố và vì sao câu hỏi bảo mật bị cấm.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Three problems hiding in the word "login"</h2>
<p class="lead">“Is the user logged in?” is three questions wearing one coat: who do you <em>claim</em> to be, can you <em>prove</em> it, and may you do <em>this</em> to <em>this</em>? Code that answers the second and assumes it answered the third is the most common serious bug on the web — OWASP's number-one category for 2025. You will build all three gates on LabFlow ID and break each one.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>tell identification, authentication and authorization apart in any route you read;</li>
<li>find an IDOR (insecure direct object reference) by changing an id, and fix it inside the lookup;</li>
<li>choose between 401, 403 and 404 and say why;</li>
<li>classify an authentication factor — and refuse the ones that are not factors;</li>
<li>use the vocabulary the rest of the course (and every security review) uses.</li>
</ul>
<p><strong>Why it is worth it:</strong> in a group project the login usually works and the data leaks anyway, because someone wrote <code>findById(req.params.id)</code>. This lesson is the habit that prevents it.</p>
</div>

<h3>An everyday picture first</h3>
<p>The faculty building has a reception desk. You say your name — that is <strong>identification</strong>, a claim. The guard asks for your student card and compares the photo — <strong>authentication</strong>, the proof. Your card opens the floor-3 labs but not the server room — <strong>authorization</strong>, decided per door, every time. Three different checks; a building that does only the first one is open to anyone who can say a name.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Gate 1</span><span class="lz-t">Identification — who do you claim to be?</span><span class="lz-d">An id, an email. Anyone can type it.</span></div>
  <div class="lz-step"><span class="lz-k">Gate 2</span><span class="lz-t">Authentication — prove it</span><span class="lz-d">A password, a code, a passkey, a valid session. Chapters 2–8.</span></div>
  <div class="lz-step"><span class="lz-k">Gate 3</span><span class="lz-t">Authorization — may you do THIS to THIS?</span><span class="lz-d">Per action, per object, every request. Chapter 9.</span></div>
</div>

<h3>Gate 1 alone: a claim is not proof</h3>
<p><code>demo0/gates.js</code> has three versions of the same profile API. Version 1 trusts whatever the client says:</p>
${ma('javascript', G_V1)}
${ra(OUT['02-v1-an'])}
${ra(OUT['02-v1-mao'])}
<p>The second request typed <code>usr_3</code> and became Cô Lan, the lab manager, with her email and phone. Nobody hacked anything — the API simply believed a header. This exact pattern appears in real systems as <code>X-User-Id</code> set “by the gateway”.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — trusting an identity header because “the gateway sets it”.</strong> That is safe only if the service can be reached <em>exclusively</em> through a gateway that strips any incoming copy and sets its own. One forgotten port, one internal tool calling the service directly, and the header is the client's again.</p>
</div>

<h3>Gate 2: prove it — and the status code that says so</h3>
${ma('javascript', G_AUTH)}
${ra(OUT['02-v2-401'])}
<p>No valid token, so <code>401 Unauthorized</code> — the name is historical; it means <em>unauthenticated</em>. The <code>WWW-Authenticate: Bearer realm="labflow-id"</code> header tells the client <em>how</em> to authenticate. (The demo tokens <code>tok_an</code>, <code>tok_bin</code>, <code>tok_lan</code> stand in for real sessions until Chapter 3.)</p>

<h3>Gates 1 + 2, gate 3 forgotten: IDOR</h3>
${ma('javascript', G_V2)}
${ra(OUT['02-v2-an'])}
${ra(OUT['02-v2-idor'])}
${ra(OUT['02-v2-quet'])}
<p>An is properly authenticated — and reads Bình's email and phone by changing <code>usr_1</code> to <code>usr_2</code>. A four-line loop lists every profile; the 404 for <code>usr_4</code> even confirms where the list ends. This is <strong>IDOR</strong> (insecure direct object reference), called <strong>BOLA</strong> (broken object level authorization) in OWASP's API Top 10, where it is API1. It belongs to Broken Access Control, number one in the OWASP Top 10:2025, which reports that <em>100% of the applications tested</em> had some form of it.</p>

<h3>All three gates: put gate 3 inside the lookup</h3>
${ma('javascript', G_V3)}
${ra(OUT['02-v3-an'])}
${ra(OUT['02-v3-lan'])}
<p>An sees only herself; Cô Lan, as lab manager, sees everyone. Three design choices are packed into those lines:</p>
<ul>
<li><strong>The rule is part of the lookup</strong>, not an <code>if</code> added after it. A later refactor that adds an early return above an <code>if</code> skips the check; a lookup that cannot find what you may not see cannot be skipped. With a real database this becomes <code>WHERE id = $1 AND owner_id = $2</code> (Chapter 9).</li>
<li><strong>404, not 403, for other people's profiles.</strong> A 403 would confirm that <code>usr_2</code> exists. MDN: a server may answer 404 “if acknowledging the existence of a resource to clients with insufficient privileges is not desired”.</li>
<li><strong>Random ids do not replace this.</strong> OWASP suggests unpredictable ids as an extra layer; they slow down the loop above, but ids leak (links, logs, screenshots). The check is the defence.</li>
</ul>

<h3>403: we know exactly who you are, and the answer is still no</h3>
${ma('javascript', G_403)}
${ra(OUT['02-v3-403'])}
${ra(OUT['02-v3-lan-doi'])}
<p>An tries to promote herself: <code>403 Forbidden</code>. Here 403 is right — the route is not secret, and the message “signing in again will not help” is exactly what the client needs. Cô Lan makes the same request and it works. Notice the role check lives at the top of the handler (a coarse, per-action gate), while “whose profile” lives in the lookup (a per-object gate). Real systems need both.</p>
${BANG_EN}
<div class="pitfall co-tieu-de">
<p><strong>Trap — answering 401 for “not allowed”.</strong> A 401 tells the front end “your session is gone, sign in again”. Send it for a permission failure and the user is thrown into a sign-in loop: sign in, try, 401, sign in again… Use 401 only when gate 2 failed.</p>
</div>

<h3>The three kinds of proof (factors)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Something you know</span><span class="v">Password, PIN. Cheap and universal; on its own it resists nothing — guessed, reused from another site's leak, phished. Chapter 2 is damage control for it.</span></div>
  <div class="kv"><span class="k">Something you have</span><span class="v">Phone with an authenticator app, security key. Defeats remote guessing; a hardware key or passkey also defeats phishing (Chapter 7).</span></div>
  <div class="kv"><span class="k">Something you are</span><span class="v">Fingerprint, face — almost never sent to your server: it unlocks a key on the device, and what you receive is a signature.</span></div>
  <div class="kv"><span class="k">Not a factor</span><span class="v">IP address, device fingerprint, “remember this browser”. Useful risk signals (lesson 0.1); treating them as proof is how “trusted device” becomes a bypass.</span></div>
</div>
<p>Two passwords are not two factors — they can be stolen the same way. And a <strong>security question</strong> (“your mother's maiden name?”) is a password with a tiny, public, unchangeable answer: NIST SP 800-63B says verifiers <em>SHALL NOT</em> prompt for security questions or knowledge-based authentication, nor allow password hints.</p>

<h3>The vocabulary of the rest of the course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">principal / subject</span><span class="v">Who is acting: a user, a service, a job. JWT calls it <code>sub</code>.</span></div>
  <div class="kv"><span class="k">credential</span><span class="v">What is presented as proof; usually a bearer credential (lesson 0.1).</span></div>
  <div class="kv"><span class="k">claim</span><span class="v">A statement inside a token (“sub is usr_1”, “role is STUDENT”); worth exactly what its signature is worth (Ch4).</span></div>
  <div class="kv"><span class="k">scope</span><span class="v">What a credential may be used for; narrower scope, smaller damage (Ch8).</span></div>
  <div class="kv"><span class="k">session</span><span class="v">A period of authenticated activity and the server's record of it (Ch3).</span></div>
  <div class="kv"><span class="k">revocation</span><span class="v">Ending a credential before it expires on its own (Ch5).</span></div>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Authentication vs authorization?”</strong> — Authentication proves who you are; authorization decides what that identity may do to which object, on every request.</li>
<li><strong>“What is IDOR and how do you prevent it?”</strong> — Reaching another user's object by changing an id. Check ownership in every lookup (<code>WHERE id = ? AND owner_id = ?</code>), test it with a second user, and do not rely on unguessable ids.</li>
<li><strong>“401 or 403?”</strong> — 401 when we do not know who you are; 403 when we do and the answer is no; 404 when even existence should stay hidden.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start <code>node demo0/gates.js</code>. Before running anything, write on paper the status code for every pair: <em>no token / tok_an / tok_bin / tok_lan</em> × <em>usr_1 / usr_2 / usr_3</em> on <code>GET /v3/users/:id</code>.</li>
<li>Run the matrix with one shell loop and compare with your paper.</li>
<li>Predict, then check, what Bình gets for <code>PATCH /v3/users/usr_2/role</code> — her <em>own</em> profile.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ra(OUT['02-ma-tran'])}
${ra(OUT['02-thuc-hanh-403'])}
<p>No token is 401 everywhere (gate 2). Each student sees only the diagonal; everything else is 404 (gate 3 in the lookup). The lab manager sees all three. Bình changing her own role is still 403: the rule is per <em>action</em> (only lab managers change roles), not only per object — owning the profile does not grant every action on it.</p>
<p><strong>Done when:</strong> your paper matrix matches all 12 cells, and you can explain the 403 on Bình's own profile.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">identification</span><span class="v">Stating who you claim to be — not proof.</span></div>
  <div class="kv"><span class="k">authentication</span><span class="v">Proving the claim; failure ⇒ 401.</span></div>
  <div class="kv"><span class="k">authorization</span><span class="v">Deciding whether this principal may do this action on this object; failure ⇒ 403 or 404.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Reaching another user's object by changing its id because the per-object check is missing.</span></div>
  <div class="kv"><span class="k">factor</span><span class="v">A category of proof: know, have, are.</span></div>
  <div class="kv"><span class="k">deny by default</span><span class="v">A new route is closed until explicitly opened — never the other way round.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>“Login” is three gates: claim (identification), proof (authentication), permission (authorization).</li>
<li>Gate 1 alone: one header made anyone Cô Lan.</li>
<li>Gate 2 without gate 3: An read every profile by changing an id — IDOR, OWASP's number one.</li>
<li>Put gate 3 inside the lookup; answer 404 to hide what exists, 403 when the action is refused, 401 only when identity is missing.</li>
<li>Factors are know / have / are; IP, devices and security questions are not proof.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Also in API Design — lesson 6.2: authorization and BOLA', sub: 'Same: changing an id reads someone else’s data; one policy asked everywhere, 404 for objects you may not see. That lesson adds an authorization matrix tested over the whole LabFlow API; this one introduces the three gates from zero. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Ba bài toán trốn trong chữ "đăng nhập"</h2>
<p class="lead">"Người dùng đã đăng nhập chưa?" là ba câu hỏi mặc chung một áo: bạn <em>tự xưng</em> là ai, bạn <em>chứng minh</em> được không, và bạn có được làm <em>việc này</em> với <em>cái này</em> không? Mã trả lời câu hai rồi tưởng mình đã trả lời câu ba là con bug nghiêm trọng phổ biến nhất trên web — hạng mục số một của OWASP năm 2025. Bạn sẽ dựng cả ba cổng trên LabFlow ID và phá từng cổng.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>tách bạch nhận diện, xác thực và phân quyền trong bất kỳ route nào bạn đọc;</li>
<li>tìm ra IDOR (tham chiếu trực tiếp đối tượng không an toàn) bằng cách đổi một id, và sửa nó ngay trong phép tra;</li>
<li>chọn giữa 401, 403 và 404 và nói được vì sao;</li>
<li>phân loại một yếu tố xác thực — và từ chối những thứ không phải yếu tố;</li>
<li>dùng bộ từ vựng mà cả khoá (và mọi buổi review bảo mật) dùng.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> trong đồ án nhóm, đăng nhập thường chạy ngon mà dữ liệu vẫn rò, vì ai đó viết <code>findById(req.params.id)</code>. Bài này là thói quen ngăn chuyện đó.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Toà nhà khoa có bàn lễ tân. Bạn nói tên mình — đó là <strong>identification (nhận diện)</strong>, một lời tự xưng. Bác bảo vệ xin thẻ sinh viên và so ảnh — <strong>authentication (xác thực)</strong>, bằng chứng. Thẻ của bạn mở được các phòng lab tầng 3 nhưng không mở phòng máy chủ — <strong>authorization (phân quyền)</strong>, quyết định theo từng cửa, mỗi lần. Ba phép kiểm khác nhau; toà nhà chỉ làm phép đầu thì ai nói được một cái tên cũng vào được.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cổng 1</span><span class="lz-t">Nhận diện — bạn tự xưng là ai?</span><span class="lz-d">Một id, một email. Ai cũng gõ được.</span></div>
  <div class="lz-step"><span class="lz-k">Cổng 2</span><span class="lz-t">Xác thực — chứng minh đi</span><span class="lz-d">Mật khẩu, mã, passkey, một phiên hợp lệ. Chương 2–8.</span></div>
  <div class="lz-step"><span class="lz-k">Cổng 3</span><span class="lz-t">Phân quyền — bạn được làm VIỆC NÀY với CÁI NÀY?</span><span class="lz-d">Theo hành động, theo đối tượng, mọi request. Chương 9.</span></div>
</div>

<h3>Chỉ có cổng 1: tự xưng không phải bằng chứng</h3>
<p><code>demo0/gates.js</code> có ba phiên bản của cùng một API hồ sơ. Phiên bản 1 tin mọi thứ client nói:</p>
${ma('javascript', G_V1)}
${ra(OUT['02-v1-an'])}
${ra(OUT['02-v1-mao'])}
<p>Request thứ hai gõ <code>usr_3</code> và thành Cô Lan, quản lý phòng lab, kèm email và số điện thoại. Không ai hack gì cả — API chỉ tin một header. Mẫu này có thật trong các hệ thống, dưới dạng <code>X-User-Id</code> "do gateway gắn".</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tin header danh tính vì "gateway gắn mà".</strong> Chỉ an toàn khi dịch vụ <em>chỉ</em> với tới được qua một gateway luôn xoá bản client gửi lên và gắn bản của nó. Quên một cổng, một công cụ nội bộ gọi thẳng dịch vụ, và header lại thuộc về client.</p>
</div>

<h3>Cổng 2: chứng minh đi — và mã trạng thái nói điều đó</h3>
${ma('javascript', G_AUTH)}
${ra(OUT['02-v2-401'])}
<p>Không có token hợp lệ nên <code>401 Unauthorized</code> — cái tên là di sản lịch sử; nghĩa thật là <em>chưa xác thực</em>. Header <code>WWW-Authenticate: Bearer realm="labflow-id"</code> cho client biết phải xác thực <em>bằng cách nào</em>. (Token demo <code>tok_an</code>, <code>tok_bin</code>, <code>tok_lan</code> đứng thay phiên thật cho tới Chương 3.)</p>

<h3>Cổng 1 + 2, quên cổng 3: IDOR</h3>
${ma('javascript', G_V2)}
${ra(OUT['02-v2-an'])}
${ra(OUT['02-v2-idor'])}
${ra(OUT['02-v2-quet'])}
<p>An đã xác thực đàng hoàng — và đọc được email, số điện thoại của Bình chỉ bằng cách đổi <code>usr_1</code> thành <code>usr_2</code>. Một vòng lặp bốn dòng liệt kê mọi hồ sơ; số 404 của <code>usr_4</code> còn xác nhận danh sách hết ở đâu. Đây là <strong>IDOR (insecure direct object reference — tham chiếu trực tiếp đối tượng không an toàn)</strong>, trong OWASP API Top 10 gọi là <strong>BOLA (broken object level authorization — hỏng phân quyền cấp đối tượng)</strong>, xếp API1. Nó thuộc nhóm Broken Access Control, số một trong OWASP Top 10:2025, nơi ghi rằng <em>100% ứng dụng được kiểm</em> đều có dạng lỗi này ở mức nào đó.</p>

<h3>Đủ ba cổng: đặt cổng 3 ngay trong phép tra</h3>
${ma('javascript', G_V3)}
${ra(OUT['02-v3-an'])}
${ra(OUT['02-v3-lan'])}
<p>An chỉ thấy chính mình; Cô Lan, là quản lý lab, thấy tất cả. Ba lựa chọn thiết kế nằm gọn trong mấy dòng đó:</p>
<ul>
<li><strong>Quy tắc là một phần của phép tra</strong>, không phải một câu <code>if</code> thêm sau. Một lần refactor chèn lệnh return sớm phía trên câu <code>if</code> là bỏ qua phép kiểm; còn phép tra không tìm thấy thứ bạn không được thấy thì không bỏ qua được. Với CSDL thật nó thành <code>WHERE id = $1 AND owner_id = $2</code> (Chương 9).</li>
<li><strong>404 chứ không phải 403 cho hồ sơ người khác.</strong> 403 sẽ xác nhận <code>usr_2</code> có tồn tại. MDN: máy chủ có thể trả 404 "if acknowledging the existence of a resource to clients with insufficient privileges is not desired".</li>
<li><strong>Id ngẫu nhiên không thay được điều này.</strong> OWASP khuyên dùng id khó đoán như một lớp phụ; nó làm vòng lặp ở trên chậm lại, nhưng id vẫn rò (đường link, log, ảnh chụp màn hình). Phép kiểm mới là lớp phòng thủ.</li>
</ul>

<h3>403: biết rõ bạn là ai, và câu trả lời vẫn là không</h3>
${ma('javascript', G_403)}
${ra(OUT['02-v3-403'])}
${ra(OUT['02-v3-lan-doi'])}
<p>An thử tự thăng chức cho mình: <code>403 Forbidden</code>. Ở đây 403 là đúng — route không phải bí mật, và thông điệp "đăng nhập lại cũng vô ích" đúng là thứ client cần. Cô Lan gửi cùng request và thành công. Để ý: phép kiểm vai trò nằm đầu handler (cổng thô, theo hành động), còn "hồ sơ của ai" nằm trong phép tra (cổng theo đối tượng). Hệ thật cần cả hai.</p>
${BANG_VI}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — trả 401 cho "không được phép".</strong> 401 bảo front end "phiên của bạn mất rồi, đăng nhập lại đi". Gửi nó cho lỗi quyền là người dùng bị ném vào vòng lặp đăng nhập: đăng nhập, thử, 401, đăng nhập lại… Chỉ dùng 401 khi cổng 2 trượt.</p>
</div>

<h3>Ba loại bằng chứng (yếu tố)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Thứ bạn biết</span><span class="v">Mật khẩu, PIN. Rẻ và phổ biến; một mình nó chẳng chống được gì — bị đoán, bị dùng lại từ vụ rò của trang khác, bị lừa lấy. Chương 2 là để hạn chế thiệt hại cho nó.</span></div>
  <div class="kv"><span class="k">Thứ bạn có</span><span class="v">Điện thoại có ứng dụng xác thực, khoá bảo mật. Chặn được việc đoán từ xa; khoá phần cứng hay passkey còn chặn được lừa đảo (Chương 7).</span></div>
  <div class="kv"><span class="k">Thứ bạn là</span><span class="v">Vân tay, khuôn mặt — gần như không bao giờ gửi về máy chủ: nó mở khoá một chìa trên thiết bị, thứ bạn nhận là một chữ ký.</span></div>
  <div class="kv"><span class="k">Không phải yếu tố</span><span class="v">Địa chỉ IP, dấu vân tay thiết bị, "ghi nhớ trình duyệt này". Là tín hiệu rủi ro hữu ích (bài 0.1); coi chúng là bằng chứng là cách "thiết bị tin cậy" thành lối vòng qua.</span></div>
</div>
<p>Hai mật khẩu không phải hai yếu tố — chúng bị đánh cắp theo cùng một cách. Còn <strong>câu hỏi bảo mật</strong> ("tên thời con gái của mẹ bạn?") là một mật khẩu có đáp án ít khả năng, công khai và không đổi được: NIST SP 800-63B nói bộ kiểm <em>SHALL NOT</em> hỏi câu hỏi bảo mật hay xác thực dựa trên kiến thức, cũng không cho lưu gợi ý mật khẩu.</p>

<h3>Bộ từ vựng của cả phần còn lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">principal / subject (chủ thể)</span><span class="v">Ai đang hành động: người dùng, dịch vụ, tác vụ nền. JWT gọi là <code>sub</code>.</span></div>
  <div class="kv"><span class="k">credential (tín vật)</span><span class="v">Thứ được trình ra làm bằng chứng; thường là kiểu "ai cầm là người đó" (bài 0.1).</span></div>
  <div class="kv"><span class="k">claim (khẳng định)</span><span class="v">Một phát biểu trong token ("sub là usr_1", "role là STUDENT"); đáng tin đúng bằng chữ ký đi kèm (Ch4).</span></div>
  <div class="kv"><span class="k">scope (phạm vi)</span><span class="v">Tín vật được dùng vào việc gì; phạm vi hẹp, thiệt hại nhỏ (Ch8).</span></div>
  <div class="kv"><span class="k">session (phiên)</span><span class="v">Một khoảng hoạt động đã xác thực và bản ghi của máy chủ về nó (Ch3).</span></div>
  <div class="kv"><span class="k">revocation (thu hồi)</span><span class="v">Chấm dứt tín vật trước khi nó tự hết hạn (Ch5).</span></div>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Xác thực khác phân quyền thế nào?"</strong> — Xác thực chứng minh bạn là ai; phân quyền quyết định danh tính đó được làm gì với đối tượng nào, ở mọi request.</li>
<li><strong>"IDOR là gì, chặn thế nào?"</strong> — Tới được đối tượng của người khác chỉ bằng cách đổi id. Kiểm quyền sở hữu trong mọi phép tra (<code>WHERE id = ? AND owner_id = ?</code>), test bằng một người dùng thứ hai, và đừng dựa vào id khó đoán.</li>
<li><strong>"401 hay 403?"</strong> — 401 khi chưa biết bạn là ai; 403 khi biết rồi và câu trả lời là không; 404 khi ngay cả việc tồn tại cũng cần giấu.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Bật <code>node demo0/gates.js</code>. Trước khi chạy gì, ghi ra giấy mã trạng thái cho mọi cặp: <em>không token / tok_an / tok_bin / tok_lan</em> × <em>usr_1 / usr_2 / usr_3</em> trên <code>GET /v3/users/:id</code>.</li>
<li>Chạy cả ma trận bằng một vòng lặp shell rồi so với tờ giấy.</li>
<li>Đoán trước, rồi kiểm, Bình nhận gì khi gọi <code>PATCH /v3/users/usr_2/role</code> — trên hồ sơ <em>của chính mình</em>.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ra(OUT['02-ma-tran'])}
${ra(OUT['02-thuc-hanh-403'])}
<p>Không token thì 401 ở mọi ô (cổng 2). Mỗi sinh viên chỉ thấy đường chéo của mình; còn lại là 404 (cổng 3 trong phép tra). Quản lý lab thấy cả ba. Bình đổi vai trò của chính mình vẫn 403: quy tắc tính theo <em>hành động</em> (chỉ quản lý lab mới đổi vai trò), không chỉ theo đối tượng — sở hữu hồ sơ không có nghĩa được làm mọi hành động trên nó.</p>
<p><strong>Đạt khi:</strong> ma trận trên giấy khớp đủ 12 ô, và bạn giải thích được con số 403 trên hồ sơ của chính Bình.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">identification (nhận diện)</span><span class="v">Nói bạn tự xưng là ai — chưa phải bằng chứng.</span></div>
  <div class="kv"><span class="k">authentication (xác thực)</span><span class="v">Chứng minh lời tự xưng; trượt ⇒ 401.</span></div>
  <div class="kv"><span class="k">authorization (phân quyền)</span><span class="v">Quyết định chủ thể này có được làm hành động này với đối tượng này; trượt ⇒ 403 hoặc 404.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Tới được đối tượng của người khác bằng cách đổi id vì thiếu phép kiểm theo đối tượng.</span></div>
  <div class="kv"><span class="k">factor (yếu tố)</span><span class="v">Một loại bằng chứng: biết, có, là.</span></div>
  <div class="kv"><span class="k">deny by default (mặc định từ chối)</span><span class="v">Route mới đóng cho tới khi được mở tường minh — không bao giờ ngược lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Đăng nhập" là ba cổng: tự xưng (nhận diện), bằng chứng (xác thực), quyền (phân quyền).</li>
<li>Chỉ cổng 1: một header biến bất kỳ ai thành Cô Lan.</li>
<li>Cổng 2 mà thiếu cổng 3: An đọc mọi hồ sơ bằng cách đổi id — IDOR, số một của OWASP.</li>
<li>Đặt cổng 3 trong phép tra; trả 404 để giấu thứ đang tồn tại, 403 khi hành động bị từ chối, 401 chỉ khi thiếu danh tính.</li>
<li>Yếu tố là biết / có / là; IP, thiết bị và câu hỏi bảo mật không phải bằng chứng.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Cũng có ở API Design — bài 6.2: phân quyền và BOLA', sub: 'Giống: đổi id là đọc được dữ liệu người khác; một chính sách hỏi ở mọi nơi, 404 cho đối tượng bạn không được thấy. Bài đó thêm ma trận phân quyền kiểm trên cả LabFlow API; bài này dựng ba cổng từ số 0. Mỗi bài tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
