/**
 * Authentication · Chương 5 · 5.5 — Cuộc đua refresh, và cú cảnh báo giả giết chết cả tính năng. Slug giữ: auth-5-5-cuoc-dua-refresh.
 * Output thật (_ma.mjs): grace 10 s ⇒ hai tab nhận CÙNG token (raced), ở lại; grace 0 (ngây thơ) ⇒ tab 2 REUSE_DETECTED, đăng
 * xuất người thật; đo ~150k xoay/s. CODE: phần "already used" của rotate() (grace vs theft). Cảnh báo giả làm đội tắt cả tính năng.
 */
import G from '../giang/auth-05-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const L = CODE.layer.split('\n');
const GRACE = L.slice(L.findIndex((l) => l.includes('if (rec.usedAt)')), L.findIndex((l) => l.includes('const next = await issue'))).join('\n').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 9700 — OAuth 2.0 Security BCP, §4.14.2', 'Refresh token rotation with automatic reuse detection; implementations must tolerate the legitimate race a browser creates (read 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'A security control that fires on normal use gets disabled; tune reuse detection so it does not punish a real user (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 9700 — BCP bảo mật OAuth 2.0, §4.14.2', 'Xoay vòng refresh token kèm phát hiện tái dùng tự động; bản cài phải chịu được cuộc đua hợp lệ mà một trình duyệt tạo ra (đọc 03/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'Một chốt bảo mật nổ khi dùng bình thường sẽ bị tắt; chỉnh phát hiện tái dùng để nó không phạt người thật (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Second request with the same token…</th><th>Grace 10 s (LabFlow ID)</th><th>Grace 0 (naive)</th></tr></thead>
<tbody>
<tr><td>arrives 50 ms after the first (a race)</td><td>gets the first's new token (raced)</td><td><strong>REUSE_DETECTED</strong> — user logged out</td></tr>
<tr><td>arrives 11 s after the first (a replay)</td><td><strong>REUSE_DETECTED</strong></td><td><strong>REUSE_DETECTED</strong></td></tr>
<tr><td>both tabs stay signed in?</td><td><strong>yes</strong></td><td>no — the feature gets turned off</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Request thứ hai với cùng token…</th><th>Grace 10 s (LabFlow ID)</th><th>Grace 0 (ngây thơ)</th></tr></thead>
<tbody>
<tr><td>đến sau cái đầu 50 ms (một cuộc đua)</td><td>nhận token mới của cái đầu (raced)</td><td><strong>REUSE_DETECTED</strong> — người dùng bị đăng xuất</td></tr>
<tr><td>đến sau cái đầu 11 s (một lần phát lại)</td><td><strong>REUSE_DETECTED</strong></td><td><strong>REUSE_DETECTED</strong></td></tr>
<tr><td>cả hai tab vẫn đăng nhập?</td><td><strong>có</strong></td><td>không — tính năng bị tắt</td></tr>
</tbody>
</table>`;

export default {
  title: '5.5 — The refresh race, and the false positive that kills the feature|||5.5 — Cuộc đua refresh, và cú cảnh báo giả giết chết cả tính năng',
  slug: 'auth-5-5-cuoc-dua-refresh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai tab của một trình duyệt dùng chung một cookie; cả hai thấy access token hết hạn và cùng POST /refresh với cùng refresh cookie. Xoay vòng ngây thơ: tab A xoay trước (đánh dấu token đã dùng), tab B đến sau với cùng token đã dùng ⇒ REUSE_DETECTED ⇒ thu hồi họ ⇒ đăng xuất người CHẲNG làm gì sai. Một chốt nổ khi dùng bình thường bị các đội TẮT — mất cả bảo vệ. Vá: một cửa sổ ân hạn ngắn (giây, dùng chung) trả cho request thứ hai cái token của request đầu. Đo thật trên LabFlow ID v0.5: grace 10 s ⇒ cùng token; grace 0 ⇒ REUSE_DETECTED.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>The refresh race, and the false positive that kills the feature</h2>
<p class="lead">Reuse detection (lesson 5.2) is powerful and dangerous. The danger is not a clever attacker — it is an ordinary browser. Two tabs share one cookie; if both notice the access token expired at the same moment, both <code>POST /refresh</code> with the <strong>same</strong> refresh cookie. Naive rotation marks the token used on the first request, so the second looks exactly like reuse — and revokes the family, logging out a user who did nothing wrong. This lesson measures the race and fixes it.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain how two tabs of one browser create a legitimate refresh race;</li>
<li>show that naive rotation turns that race into a false theft alarm;</li>
<li>add a short grace window that returns the first request's new token to the second;</li>
<li>keep the window short and shared so it does not become a theft hole.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> a reuse detector that logs real users out gets switched off — and then you have no protection at all. After this lesson yours tolerates the race and still catches the thief.</p>
</div>

<h3>An everyday picture first</h3>
<p>Two cashiers, one till drawer. A customer hands a coupon; both cashiers grab it to ring it up at the same instant. A rule that says “a coupon used twice is fraud” would accuse an honest customer. The fix is a moment's grace: if the <em>same</em> coupon is presented again in the next few seconds, it is the same sale, not a second one. The two tabs are the cashiers; the refresh cookie is the coupon.</p>

<h3>Two tabs, one cookie, naive rotation</h3>
<p>A cookie is shared across a browser's tabs. When two tabs both get a 401 and both refresh, tab A rotates first and marks the token <code>used</code>; tab B arrives a moment later with that same, now-used token. Naive rotation (no grace window) has only one rule for a used token — reuse — so it flags theft. The <code>rotate()</code> branch that decides race-vs-theft:</p>
${ma('javascript', GRACE)}
<p>The grace window is the whole fix: when a token is rotated, its new child is remembered for a few seconds, and a second use of the same token within that window returns that child instead of flagging reuse. Measured on the real layer, with the window and without:</p>
${ra(OUT['55-race'])}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tab A refreshes</span><span class="lz-d">rotates the token, marks it used, caches the new child</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tab B arrives</span><span class="lz-d">same cookie, ~50 ms later, the token is now used</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Within grace</span><span class="lz-d">return the cached child ⇒ both tabs stay signed in</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">After grace</span><span class="lz-d">treat it as reuse ⇒ <code>REUSE_DETECTED</code> (theft)</span></div>
</div>

<h3>Within grace vs after grace</h3>
${BANG_EN}
<p>With a 10-second window, tab B gets tab A's new token — both tabs stay signed in, and the throughput shows the check is cheap (~150,000 rotations/s on this machine). Set the window to zero and the same race ends in <code>REUSE_DETECTED</code>: the real user is logged out. The only difference between a usable feature and a useless one is that short window. And the window does not weaken real detection: a <em>replay</em> 11 seconds later is still theft, because a genuine browser race is over in milliseconds, not seconds.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a grace window too long, or per-process.</strong> Two mistakes turn the fix into a bug. Make the window <em>minutes</em> and it becomes a window in which a stolen, already-rotated token still works — you have re-created the hole you closed. Keep the window's memory <em>per process</em> and, behind a load balancer, tab A and tab B land on different servers that do not share it — so the race flags theft again. The window must be short (seconds) and shared across processes (Redis, Chapter 11).</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“What is the refresh race?”</strong> — Two tabs of one browser refresh with the same cookie at once; naive rotation flags the second as reuse and revokes the family.</li>
<li><strong>“How do you fix it without weakening detection?”</strong> — A short grace window: within it, return the first request's new token to the second; after it, a reuse is still theft.</li>
<li><strong>“Why is a false positive so bad here?”</strong> — A security control that fires on normal use gets disabled, and then the real protection is gone. Correctness of the control includes not punishing honest users.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo5/race.mjs</code>. Change the gap between the two requests to 11000 ms. What happens, and why is that correct?</li>
<li>Set <code>graceMs</code> to a huge value (e.g. 10 minutes) and replay a stolen token 5 minutes later. What do you get, and what hole did you open?</li>
<li>Why must the grace cache be shared across processes in production?</li>
</ol>
<p><strong>Solution:</strong> (1) <code>REUSE_DETECTED</code> — 11 s is far past any real race, so it is treated as a replay, which is correct. (2) the stolen token is accepted — a long window is a theft window; keep it to seconds. (3) behind a load balancer the two tabs may hit different processes; a per-process cache would not recognise the race, so the second tab would be flagged as theft.</p>
<p><strong>Done when:</strong> you can reproduce the false positive with a zero window, fix it with a short one, and explain why it must be short and shared.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">refresh race</span><span class="v">Two tabs of one browser refreshing with the same cookie at nearly the same moment.</span></div>
  <div class="kv"><span class="k">false positive</span><span class="v">Reuse detection firing on a legitimate race, logging out an honest user.</span></div>
  <div class="kv"><span class="k">grace window</span><span class="v">A few seconds in which a second use of a just-rotated token returns the same new token.</span></div>
  <div class="kv"><span class="k">raced</span><span class="v">The flag on a response that was served from the grace window, not a fresh rotation.</span></div>
  <div class="kv"><span class="k">shared cache</span><span class="v">The grace memory kept in Redis, not per process, so a load balancer cannot split the race.</span></div>
  <div class="kv"><span class="k">theft window</span><span class="v">What a too-long grace window becomes: a time in which a stolen token still works.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two tabs of one browser share a cookie and can refresh at the same moment — a legitimate race.</li>
<li>Naive rotation flags the second request as reuse and revokes the family: a false theft alarm.</li>
<li>A control that logs real users out gets turned off, so the false positive removes the protection.</li>
<li>A short grace window returns the first request's new token to the second; after it, reuse is still theft.</li>
<li>Keep the window short (seconds) and shared across processes (Redis, Chapter 11), or it becomes a hole.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-8-3-mo-rong', title: 'Compare in API Design — lesson 8.3: scaling out', sub: 'Same multi-process pitfall: state kept in one process breaks with two replicas. There it is a session; here it is the grace-window cache, which must move to shared storage once you run more than one server. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Cuộc đua refresh, và cú cảnh báo giả giết chết cả tính năng</h2>
<p class="lead">Phát hiện tái dùng (bài 5.2) mạnh và nguy hiểm. Mối nguy không phải một kẻ tấn công khéo — mà là một trình duyệt bình thường. Hai tab dùng chung một cookie; nếu cả hai thấy access token hết hạn cùng lúc, cả hai <code>POST /refresh</code> với <strong>cùng</strong> refresh cookie. Xoay vòng ngây thơ đánh dấu token đã dùng ở request đầu, nên cái thứ hai trông đúng như tái dùng — và thu hồi họ, đăng xuất một người chẳng làm gì sai. Bài này đo cuộc đua và vá nó.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích hai tab của một trình duyệt tạo một cuộc đua refresh hợp lệ thế nào;</li>
<li>chỉ ra xoay vòng ngây thơ biến cuộc đua đó thành một báo động trộm giả;</li>
<li>thêm một cửa sổ ân hạn ngắn trả cho request thứ hai cái token mới của request đầu;</li>
<li>giữ cửa sổ ngắn và dùng chung để nó không thành một lỗ hổng trộm.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> một bộ phát hiện tái dùng đăng xuất người thật sẽ bị tắt — và rồi bạn chẳng có bảo vệ nào. Học xong bài này, bộ của bạn chịu được cuộc đua và vẫn bắt được kẻ cắp.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Hai thu ngân, một ngăn kéo tiền. Một khách đưa một phiếu giảm giá; cả hai thu ngân cùng chộp để tính tiền một lúc. Một quy tắc nói "một phiếu dùng hai lần là gian lận" sẽ buộc tội một khách ngay thẳng. Cách sửa là một khoảnh khắc ân hạn: nếu <em>cùng</em> phiếu được đưa lại trong vài giây tới, đó là cùng một lần bán, không phải lần thứ hai. Hai tab là hai thu ngân; refresh cookie là cái phiếu.</p>

<h3>Hai tab, một cookie, xoay vòng ngây thơ</h3>
<p>Một cookie dùng chung giữa các tab của một trình duyệt. Khi hai tab cùng nhận 401 và cùng refresh, tab A xoay trước và đánh dấu token <code>used</code>; tab B đến một lát sau với cùng token, giờ đã dùng. Xoay vòng ngây thơ (không cửa sổ ân hạn) chỉ có một quy tắc cho một token đã dùng — tái dùng — nên nó báo trộm. Nhánh <code>rotate()</code> quyết định đua-hay-trộm:</p>
${ma('javascript', GRACE)}
<p>Cửa sổ ân hạn là toàn bộ cách vá: khi một token được xoay, cái con mới của nó được nhớ vài giây, và một lần dùng thứ hai của cùng token trong cửa sổ đó trả về cái con đó thay vì báo tái dùng. Đo trên lớp thật, có cửa sổ và không:</p>
${ra(OUT['55-race'])}

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tab A refresh</span><span class="lz-d">xoay token, đánh dấu đã dùng, cache cái con mới</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tab B đến</span><span class="lz-d">cùng cookie, ~50 ms sau, token giờ đã dùng</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trong ân hạn</span><span class="lz-d">trả cái con đã cache ⇒ cả hai tab vẫn đăng nhập</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Sau ân hạn</span><span class="lz-d">coi là tái dùng ⇒ <code>REUSE_DETECTED</code> (trộm)</span></div>
</div>

<h3>Trong ân hạn đối lại sau ân hạn</h3>
${BANG_VI}
<p>Với cửa sổ 10 giây, tab B nhận token mới của tab A — cả hai tab vẫn đăng nhập, và throughput cho thấy phép kiểm rẻ (~150.000 lần xoay/s trên máy này). Đặt cửa sổ bằng không và cùng cuộc đua kết thúc bằng <code>REUSE_DETECTED</code>: người thật bị đăng xuất. Khác biệt duy nhất giữa một tính năng dùng được và một cái vô dụng là cái cửa sổ ngắn đó. Và cửa sổ không làm yếu phát hiện thật: một lần <em>phát lại</em> 11 giây sau vẫn là trộm, vì một cuộc đua trình duyệt thật xong trong mili giây, không phải giây.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một cửa sổ ân hạn quá dài, hoặc theo tiến trình.</strong> Hai lỗi biến cách vá thành một lỗi. Làm cửa sổ <em>vài phút</em> và nó thành một cửa sổ mà một token bị trộm, đã xoay, vẫn chạy — bạn đã dựng lại cái lỗ mình đóng. Giữ bộ nhớ cửa sổ <em>theo tiến trình</em> và, sau một bộ cân tải, tab A và tab B rơi vào các máy chủ khác nhau không chia sẻ nó — nên cuộc đua lại báo trộm. Cửa sổ phải ngắn (giây) và dùng chung giữa các tiến trình (Redis, Chương 11).</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Cuộc đua refresh là gì?"</strong> — Hai tab của một trình duyệt refresh với cùng cookie cùng lúc; xoay vòng ngây thơ báo cái thứ hai là tái dùng và thu hồi họ.</li>
<li><strong>"Vá nó mà không làm yếu phát hiện thế nào?"</strong> — Một cửa sổ ân hạn ngắn: trong nó, trả cho request thứ hai cái token mới của request đầu; sau nó, một lần tái dùng vẫn là trộm.</li>
<li><strong>"Vì sao một cảnh báo giả tệ đến thế ở đây?"</strong> — Một chốt bảo mật nổ khi dùng bình thường sẽ bị tắt, và rồi bảo vệ thật biến mất. Tính đúng của một chốt bao gồm việc không phạt người ngay thẳng.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo5/race.mjs</code>. Đổi khoảng cách giữa hai request thành 11000 ms. Chuyện gì xảy ra, và vì sao đúng?</li>
<li>Đặt <code>graceMs</code> một giá trị khổng lồ (ví dụ 10 phút) và phát lại một token bị trộm 5 phút sau. Bạn nhận gì, và bạn mở lỗ nào?</li>
<li>Vì sao cache ân hạn phải dùng chung giữa các tiến trình trên production?</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>REUSE_DETECTED</code> — 11 giây là xa quá bất kỳ cuộc đua thật nào, nên bị coi là một lần phát lại, điều đó đúng. (2) token bị trộm được chấp nhận — một cửa sổ dài là một cửa sổ trộm; giữ nó vài giây. (3) sau một bộ cân tải, hai tab có thể trúng các tiến trình khác nhau; một cache theo tiến trình sẽ không nhận ra cuộc đua, nên tab thứ hai bị báo trộm.</p>
<p><strong>Đạt khi:</strong> bạn tái hiện được cảnh báo giả với cửa sổ bằng không, vá nó bằng một cái ngắn, và giải thích vì sao nó phải ngắn và dùng chung.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">refresh race (cuộc đua refresh)</span><span class="v">Hai tab của một trình duyệt refresh với cùng cookie gần như cùng lúc.</span></div>
  <div class="kv"><span class="k">false positive (cảnh báo giả)</span><span class="v">Phát hiện tái dùng nổ trên một cuộc đua hợp lệ, đăng xuất một người ngay thẳng.</span></div>
  <div class="kv"><span class="k">grace window (cửa sổ ân hạn)</span><span class="v">Vài giây trong đó một lần dùng thứ hai của một token vừa xoay trả về cùng token mới.</span></div>
  <div class="kv"><span class="k">raced</span><span class="v">Cờ trên một phản hồi được phục vụ từ cửa sổ ân hạn, không phải một lần xoay mới.</span></div>
  <div class="kv"><span class="k">shared cache (cache dùng chung)</span><span class="v">Bộ nhớ ân hạn giữ trong Redis, không theo tiến trình, để một bộ cân tải không tách được cuộc đua.</span></div>
  <div class="kv"><span class="k">theft window (cửa sổ trộm)</span><span class="v">Thứ một cửa sổ ân hạn quá dài trở thành: một khoảng mà một token bị trộm vẫn chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai tab của một trình duyệt dùng chung một cookie và có thể refresh cùng lúc — một cuộc đua hợp lệ.</li>
<li>Xoay vòng ngây thơ báo request thứ hai là tái dùng và thu hồi họ: một báo động trộm giả.</li>
<li>Một chốt đăng xuất người thật sẽ bị tắt, nên cảnh báo giả gỡ mất bảo vệ.</li>
<li>Một cửa sổ ân hạn ngắn trả cho request thứ hai cái token mới của request đầu; sau nó, tái dùng vẫn là trộm.</li>
<li>Giữ cửa sổ ngắn (giây) và dùng chung giữa các tiến trình (Redis, Chương 11), không thì nó thành một lỗ hổng.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-8-3-mo-rong', title: 'So với API Design — bài 8.3: mở rộng quy mô', sub: 'Cùng bẫy nhiều tiến trình: trạng thái giữ trong một tiến trình hỏng khi có hai bản chạy. Ở đó là một phiên; ở đây là cache cửa sổ ân hạn, phải chuyển sang kho dùng chung khi bạn chạy nhiều hơn một máy chủ. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
