/**
 * Authentication · Chương 5 · 5.4 — Danh sách thiết bị: thu hồi mà người dùng NHÌN THẤY. Slug giữ: auth-5-4-danh-sach-thiet-bi.
 * Output thật (_ma.mjs): An đăng nhập 3 thiết bị (laptop/phone/labpc) ⇒ GET /me/devices 3 dòng (user agent + ip); thu hồi phone
 * ⇒ phone refresh REVOKED, còn 2 thiết bị. CODE: query listFamilies (GROUP BY family) + tuyến /me/devices của v0.5.
 */
import G from '../giang/auth-05-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.pgStore.split('\n');
const LISTFAM = P.slice(P.findIndex((l) => l.includes('async listFamilies')), P.length - 1).join('\n').replace(/\n};?\s*$/, '').trim() + '\n  },';
const SV = CODE.server05.split('\n');
const DEVROUTES = SV.slice(SV.findIndex((l) => l.includes('lesson 5.4: the devices page')), SV.findIndex((l) => l.includes('lesson 4.x compatibility'))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet (active sessions, device management)', 'Let users view and terminate their active sessions; show enough context to recognise a session, and revoke server-side (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🐘', 'PostgreSQL 17 docs — GROUP BY and aggregate functions', 'One row per family from the refresh rows — a plain aggregate query, no extra table (read 03/11/2026).', 'https://www.postgresql.org/docs/17/tutorial-agg.html'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Session Management Cheat Sheet (phiên đang hoạt động, quản lý thiết bị)', 'Cho người dùng xem và kết thúc các phiên đang hoạt động của họ; hiển thị đủ ngữ cảnh để nhận ra một phiên, và thu hồi phía máy chủ (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
  nguon('🐘', 'Tài liệu PostgreSQL 17 — GROUP BY và hàm tổng hợp', 'Một dòng cho mỗi họ từ các dòng refresh — một truy vấn tổng hợp thường, không bảng phụ (đọc 03/11/2026).', 'https://www.postgresql.org/docs/17/tutorial-agg.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>The row shows…</th><th>From column</th><th>So the user can…</th></tr></thead>
<tbody>
<tr><td>when this login started</td><td><code>created_at</code> (first in the family)</td><td>spot a login they do not remember</td></tr>
<tr><td>roughly where from</td><td><code>ip</code></td><td>notice a country they never visited</td></tr>
<tr><td>on what device/browser</td><td><code>user_agent</code></td><td>tell the phone from the lab PC</td></tr>
<tr><td>which one to cut</td><td><code>family_id</code></td><td>revoke exactly that device</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Dòng hiển thị…</th><th>Từ cột</th><th>Để người dùng…</th></tr></thead>
<tbody>
<tr><td>lần đăng nhập này bắt đầu khi nào</td><td><code>created_at</code> (đầu tiên trong họ)</td><td>thấy một lần đăng nhập không nhớ</td></tr>
<tr><td>khoảng từ đâu</td><td><code>ip</code></td><td>nhận ra một quốc gia chưa từng tới</td></tr>
<tr><td>trên thiết bị/trình duyệt nào</td><td><code>user_agent</code></td><td>phân biệt điện thoại với máy phòng lab</td></tr>
<tr><td>cắt cái nào</td><td><code>family_id</code></td><td>thu hồi đúng thiết bị đó</td></tr>
</tbody>
</table>`;

export default {
  title: '5.4 — The device list: revocation the user can see|||5.4 — Danh sách thiết bị: thu hồi mà người dùng NHÌN THẤY',
  slug: 'auth-5-4-danh-sach-thiet-bi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Các họ refresh đã cho một dòng cho mỗi lần đăng nhập trên một thiết bị; gộp chúng theo family là có trang "thiết bị của bạn" — nơi người dùng thấy một lần đăng nhập lạ (thời điểm, IP, user agent) và cắt nó mà không cần ticket. Chạy thật trên LabFlow ID v0.5: An đăng nhập 3 thiết bị ⇒ GET /me/devices 3 dòng; thu hồi phone ⇒ phone refresh REVOKED, còn 2. Query chỉ là GROUP BY (không bảng mới); lệnh thu hồi GIỚI HẠN theo người đăng nhập (chống IDOR trên family id).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The device list: revocation the user can see</h2>
<p class="lead">Reuse detection (lesson 5.2) catches a thief who <em>uses</em> a stolen refresh token. But a thief who just holds one, quietly, is caught only if the real user can <strong>see</strong> their logins and cut the one they do not recognise. You already have the data: a family is one login on one device. Group the refresh rows by family and you have a “your devices” page — no new table, and a revoke that users run themselves.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>turn the refresh table into a devices list with one row per family;</li>
<li>show the “is this you?” fields a user needs to recognise a login;</li>
<li>revoke one device while the others keep working;</li>
<li>scope the revoke to the signed-in user so no one can revoke another account's device.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> “Where am I logged in?” is a feature every serious app has, and it is the user's own defence against a stolen session. After this lesson it is a GROUP BY and one scoped revoke.</p>
</div>

<h3>An everyday picture first</h3>
<p>Think of the <strong>“active sessions” screen</strong> on your bank or email: a list of logins, each with a place, a time and a device, and a button to end any one. It works because the server already records one entry per login. Our refresh families are exactly that record — we just have to present them.</p>

<h3>One family, one device</h3>
<p>Every rotation stays inside its family (lesson 5.2), so a family is one login on one device, no matter how many times it refreshed. The devices query is a plain aggregate — group the live rows by family, keep the first row's IP and user agent:</p>
${ma('javascript', LISTFAM)}
<p>Each row answers “is this you?”:</p>
${BANG_EN}

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">tokens</span><span class="lz-d">r0 → r1 → r2 … every rotation of one login</span></div>
  <div class="lz-layer"><span class="lz-k">family</span><span class="lz-d">GROUP BY <code>family_id</code> ⇒ one login on one device</span></div>
  <div class="lz-layer"><span class="lz-k">device row</span><span class="lz-d">created_at · ip · user_agent · a revoke scoped to the owner</span></div>
</div>

<h3>Three devices, and a revoke</h3>
${ma('javascript', DEVROUTES)}
${ra(OUT['54-devices'])}
<p>An signs in on a laptop, a phone and a lab PC: three families, three device rows, each with the user agent and IP its login came from. She revokes the phone by its <code>family_id</code>; the server revokes that one family. The laptop and lab PC are untouched, and the phone's next <code>/refresh</code> returns <code>REVOKED</code> — it is gone from the list.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — IDOR on the device id.</strong> If the revoke took only the <code>familyId</code> from the request and revoked it, anyone could revoke anyone's device by guessing an id — the BOLA/IDOR bug from Mục 0, now on a family id. The route takes the <strong>user id from the session</strong> and only revokes a family that belongs to that user (<code>revokeFamilyForUser(userId, familyId)</code>): a guessed id that is not yours revokes nothing.</p>
</div>

<h3>Why users catch what detection cannot</h3>
<p>Reuse detection fires only when a stolen token is actually used in a way that collides with the real user. A thief who copies the token and waits, or uses it carefully on their own schedule, may never trigger it. The device list is the complementary defence: the real user looks at “a login from a city I've never visited, on a browser I don't use,” and taps revoke. It also turns “I think my account was hacked” from a support ticket into one action the user takes in seconds.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“How do you build a devices page?”</strong> — Group the refresh/session rows by family (one per login), show created-at, IP and user agent, and offer a revoke scoped to the owner.</li>
<li><strong>“Why group by family, not by token?”</strong> — A family rotates many times; one row per token would show dozens of entries for one device.</li>
<li><strong>“How do you stop one user revoking another's device?”</strong> — Take the user id from the authenticated session, never from the request; only revoke families that belong to that user (IDOR, Mục 0).</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>With v0.5 running, run <code>bash demo5/devices.sh</code>. Why do three logins show as three rows even after each has refreshed?</li>
<li>Try to revoke a made-up <code>familyId</code> (not yours). What does the server return, and why is that correct?</li>
<li>Add a fourth sign-in from the same jar as the laptop. Is it a new device? Why or why not?</li>
</ol>
<p><strong>Solution:</strong> (1) rotation stays within a family, so the GROUP BY collapses each login's many tokens into one row. (2) <code>{"revoked":0}</code> — the revoke is scoped to your user id, so a family that is not yours matches nothing. (3) each <code>/sign-in</code> starts a new family, so a second sign-in is a new device row even from the same jar — a family is a login, not a browser.</p>
<p><strong>Done when:</strong> you can build the devices list from the refresh table, revoke one device, and explain the owner-scoping that stops IDOR.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">devices page</span><span class="v">A list of a user's live logins, one per family, with a revoke per device.</span></div>
  <div class="kv"><span class="k">family = device</span><span class="v">One login on one device; the grouping key for the list.</span></div>
  <div class="kv"><span class="k">“is this you?” fields</span><span class="v">created_at, ip, user_agent — enough to recognise or reject a login.</span></div>
  <div class="kv"><span class="k">scoped revoke</span><span class="v">Revoking a family only if it belongs to the signed-in user.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Acting on an object by id without an ownership check (Mục 0); here, a device id.</span></div>
  <div class="kv"><span class="k">aggregate query</span><span class="v">GROUP BY family — the whole page is one SELECT, no extra table.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A device list is the refresh table grouped by family: one row per login on one device.</li>
<li>Each row shows created-at, IP and user agent — the “is this you?” context.</li>
<li>Revoking a device revokes one family; the other devices keep working.</li>
<li>Scope the revoke to the signed-in user, or it is an IDOR (Mục 0) on a device id.</li>
<li>Users catch quietly-held tokens that reuse detection never sees.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Compare in API Design — lesson 6.2: authorization and BOLA/IDOR', sub: 'Same object-level check: a device revoke must verify the family belongs to the caller, exactly as a resource read must verify ownership. That lesson is the general rule; this one applies it to a family id on the devices page. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Danh sách thiết bị: thu hồi mà người dùng NHÌN THẤY</h2>
<p class="lead">Phát hiện tái dùng (bài 5.2) bắt một kẻ cắp <em>dùng</em> một refresh token bị trộm. Nhưng một kẻ cắp chỉ giữ nó, lặng lẽ, chỉ bị bắt nếu người thật có thể <strong>nhìn thấy</strong> các lần đăng nhập của họ và cắt cái không nhận ra. Bạn đã có dữ liệu: một họ là một lần đăng nhập trên một thiết bị. Gộp các dòng refresh theo họ là bạn có một trang "thiết bị của bạn" — không bảng mới, và một lệnh thu hồi người dùng tự chạy.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>biến bảng refresh thành một danh sách thiết bị với một dòng cho mỗi họ;</li>
<li>hiển thị các trường "có phải bạn không?" người dùng cần để nhận ra một lần đăng nhập;</li>
<li>thu hồi một thiết bị trong khi các cái khác vẫn chạy;</li>
<li>giới hạn lệnh thu hồi theo người đang đăng nhập để không ai thu hồi được thiết bị của tài khoản khác.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "Tôi đang đăng nhập ở đâu?" là tính năng mọi app nghiêm túc đều có, và là phòng thủ của chính người dùng trước một phiên bị trộm. Học xong bài này nó là một GROUP BY và một lệnh thu hồi có giới hạn.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Hãy nghĩ tới màn hình <strong>"phiên đang hoạt động"</strong> trên ngân hàng hay email của bạn: một danh sách các lần đăng nhập, mỗi cái có một nơi, một thời điểm và một thiết bị, và một nút để kết thúc bất kỳ cái nào. Nó chạy được vì máy chủ đã ghi một mục cho mỗi lần đăng nhập. Các họ refresh của ta chính là cái ghi đó — ta chỉ cần trình bày chúng.</p>

<h3>Một họ, một thiết bị</h3>
<p>Mỗi lần xoay ở lại trong họ của nó (bài 5.2), nên một họ là một lần đăng nhập trên một thiết bị, dù nó refresh bao nhiêu lần. Query thiết bị là một phép tổng hợp thường — gộp các dòng sống theo họ, giữ IP và user agent của dòng đầu:</p>
${ma('javascript', LISTFAM)}
<p>Mỗi dòng trả lời "có phải bạn không?":</p>
${BANG_VI}

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">tokens</span><span class="lz-d">r0 → r1 → r2 … mọi lần xoay của một lần đăng nhập</span></div>
  <div class="lz-layer"><span class="lz-k">family</span><span class="lz-d">GROUP BY <code>family_id</code> ⇒ một lần đăng nhập trên một thiết bị</span></div>
  <div class="lz-layer"><span class="lz-k">dòng thiết bị</span><span class="lz-d">created_at · ip · user_agent · một lệnh thu hồi giới hạn theo chủ</span></div>
</div>

<h3>Ba thiết bị, và một lệnh thu hồi</h3>
${ma('javascript', DEVROUTES)}
${ra(OUT['54-devices'])}
<p>An đăng nhập trên một laptop, một điện thoại và một máy phòng lab: ba họ, ba dòng thiết bị, mỗi cái với user agent và IP mà lần đăng nhập đến từ đó. Cô thu hồi điện thoại theo <code>family_id</code> của nó; máy chủ thu hồi đúng họ đó. Laptop và máy phòng lab không bị đụng, và lần <code>/refresh</code> kế của điện thoại trả về <code>REVOKED</code> — nó biến khỏi danh sách.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — IDOR trên device id.</strong> Nếu lệnh thu hồi chỉ lấy <code>familyId</code> từ request và thu hồi nó, ai cũng thu hồi được thiết bị của người khác bằng cách đoán một id — đúng lỗi BOLA/IDOR từ Mục 0, giờ trên một family id. Tuyến lấy <strong>user id từ phiên</strong> và chỉ thu hồi một họ thuộc về người đó (<code>revokeFamilyForUser(userId, familyId)</code>): một id đoán mà không phải của bạn thì chẳng thu hồi gì.</p>
</div>

<h3>Vì sao người dùng bắt được thứ phát hiện không bắt</h3>
<p>Phát hiện tái dùng chỉ nổ khi một token bị trộm thật sự được dùng theo cách va với người thật. Một kẻ cắp chép token và chờ, hoặc dùng cẩn thận theo lịch riêng, có thể không bao giờ kích hoạt nó. Danh sách thiết bị là phòng thủ bổ sung: người thật nhìn "một lần đăng nhập từ một thành phố tôi chưa từng tới, trên một trình duyệt tôi không dùng," và chạm thu hồi. Nó cũng biến "tôi nghĩ tài khoản tôi bị hack" từ một ticket hỗ trợ thành một hành động người dùng làm trong vài giây.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Dựng một trang thiết bị thế nào?"</strong> — Gộp các dòng refresh/phiên theo họ (một cho mỗi lần đăng nhập), hiển thị created-at, IP và user agent, và cho một lệnh thu hồi giới hạn theo chủ.</li>
<li><strong>"Vì sao gộp theo họ, không theo token?"</strong> — Một họ xoay nhiều lần; một dòng cho mỗi token sẽ hiển thị hàng chục mục cho một thiết bị.</li>
<li><strong>"Làm sao chặn một người thu hồi thiết bị của người khác?"</strong> — Lấy user id từ phiên đã xác thực, không bao giờ từ request; chỉ thu hồi các họ thuộc về người đó (IDOR, Mục 0).</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Với v0.5 đang chạy, chạy <code>bash demo5/devices.sh</code>. Vì sao ba lần đăng nhập hiện thành ba dòng dù mỗi cái đã refresh?</li>
<li>Thử thu hồi một <code>familyId</code> bịa (không phải của bạn). Máy chủ trả gì, và vì sao đúng?</li>
<li>Thêm một lần đăng nhập thứ tư từ cùng jar với laptop. Nó có là thiết bị mới không? Vì sao có hoặc không?</li>
</ol>
<p><strong>Lời giải:</strong> (1) xoay vòng ở lại trong một họ, nên GROUP BY gộp nhiều token của mỗi lần đăng nhập thành một dòng. (2) <code>{"revoked":0}</code> — lệnh thu hồi giới hạn theo user id của bạn, nên một họ không phải của bạn khớp không gì. (3) mỗi <code>/sign-in</code> mở một họ mới, nên lần đăng nhập thứ hai là một dòng thiết bị mới dù từ cùng jar — một họ là một lần đăng nhập, không phải một trình duyệt.</p>
<p><strong>Đạt khi:</strong> bạn dựng được danh sách thiết bị từ bảng refresh, thu hồi một thiết bị, và giải thích việc giới hạn theo chủ chặn IDOR.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">devices page (trang thiết bị)</span><span class="v">Danh sách các lần đăng nhập sống của một người, một cho mỗi họ, có lệnh thu hồi từng thiết bị.</span></div>
  <div class="kv"><span class="k">family = device (họ = thiết bị)</span><span class="v">Một lần đăng nhập trên một thiết bị; khoá gộp cho danh sách.</span></div>
  <div class="kv"><span class="k">trường "có phải bạn không?"</span><span class="v">created_at, ip, user_agent — đủ để nhận ra hoặc khước từ một lần đăng nhập.</span></div>
  <div class="kv"><span class="k">scoped revoke (thu hồi có giới hạn)</span><span class="v">Thu hồi một họ chỉ khi nó thuộc về người đang đăng nhập.</span></div>
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Hành động trên một object theo id mà không kiểm sở hữu (Mục 0); ở đây là một device id.</span></div>
  <div class="kv"><span class="k">aggregate query (truy vấn tổng hợp)</span><span class="v">GROUP BY family — cả trang là một SELECT, không bảng phụ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một danh sách thiết bị là bảng refresh gộp theo họ: một dòng cho mỗi lần đăng nhập trên một thiết bị.</li>
<li>Mỗi dòng hiển thị created-at, IP và user agent — ngữ cảnh "có phải bạn không?".</li>
<li>Thu hồi một thiết bị thu hồi một họ; các thiết bị khác vẫn chạy.</li>
<li>Giới hạn lệnh thu hồi theo người đăng nhập, không thì đó là một IDOR (Mục 0) trên một device id.</li>
<li>Người dùng bắt được những token bị giữ lặng lẽ mà phát hiện tái dùng không bao giờ thấy.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'So với API Design — bài 6.2: phân quyền và BOLA/IDOR', sub: 'Cùng phép kiểm cấp đối tượng: một lệnh thu hồi thiết bị phải xác minh họ thuộc về người gọi, đúng như một lần đọc tài nguyên phải xác minh sở hữu. Bài đó là luật chung; bài này áp nó vào một family id trên trang thiết bị. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
