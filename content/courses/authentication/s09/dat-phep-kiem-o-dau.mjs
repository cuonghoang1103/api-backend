/**
 * Authentication · Chương 9 · 9.5 — Phép kiểm nằm ở đâu, và làm sao để KHÔNG THỂ quên. Slug giữ: auth-9-5-dat-phep-kiem-o-dau.
 * Code THẬT từ _ma.mjs (src/authz/gate.js v0.9): authorize() + bản đầy đủ can(); output demo9/http-gate.mjs + npm test.
 */
import G from '../giang/auth-09-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.policy.split('\n');
const CAN_FULL = P.slice(P.findIndex((l) => l.includes('export function can')), P.findIndex((l) => l.includes('deny by default')) + 1).join('\n') + '\n}';
const GATE = CODE.gate;
const WIRE = `// Every write route is registered the same way: the gate wraps the handler. The handler runs ONLY if can() said yes,
// and receives req.resource already loaded and authorized — it never re-fetches and never re-checks.
app.post('/bookings/:id/cancel',
  authorize('booking:cancel', (req) => db.booking.findById(req.params.id)),   // ← the check, in the route definition
  (req, res) => { cancel(req.resource); res.json({ ok: true }); });           // ← the handler, free of authz`;

const NGUON_EN = [
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Broken Access Control', 'Centralising the check is OWASP\'s own prevention guidance for access control (read 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
].join('\n');
const NGUON_VI = [
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Kiểm soát truy cập hỏng', 'Tập trung hoá phép kiểm chính là hướng dẫn phòng ngừa của OWASP cho kiểm soát truy cập (đọc 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
].join('\n');

export default {
  title: '9.5 — Where the check lives, and how to make forgetting impossible|||9.5 — Phép kiểm nằm ở đâu, và làm sao để KHÔNG THỂ quên',
  slug: 'auth-9-5-dat-phep-kiem-o-dau',
  type: 'LESSON',
  isFreePreview: false,
  description: 'can() là một hàm quyết định sạch, nhưng một hàm không ai gọi chẳng bảo vệ gì. Câu hỏi cuối chương là cấu trúc: phép kiểm đi đâu để thêm một tuyến thiếu nó là việc khó? KHÔNG phải chôn trong thân handler (quên được ở handler sau). Một middleware cổng: src/authz/gate.js xuất authorize(action, loadResource); viết app.post(route, authorize(...), handler) — handler chỉ chạy nếu cổng gọi next(), và nhận req.resource đã nạp + đã được phép. Cổng TỰ nạp tài nguyên (nên handler không thể đưa thuộc tính do kẻ tấn công điều khiển), kiểm tenant ⇒ 404, can() ⇒ 403. Bản mạnh nhất: đăng ký tuyến qua helper BẮT BUỘC một action ⇒ tuyến không phân quyền trượt assertion khởi động. Một module ⇒ một tệp test phủ cả bốn mươi tuyến (test CHÍNH LÀ đặc tả). Phòng thủ nhiều lớp: cổng ở tuyến + lọc truy vấn. demo import chính module thật, 48 test xanh. Theo OWASP A01 (Prevention).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Where the check lives, and how to make forgetting impossible</h2>
<p class="lead">You now have a clean decision function, <code>can()</code>. But a decision function nobody calls protects nothing, and "remember to call it" is a code-review note — and code-review notes are forgotten. The last question of the chapter is structural: where does the check go, so that adding a route <em>without</em> it is hard, and ideally the normal way to write a route already includes it?</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> put authorization in one gate middleware that loads the resource and enforces the boundary; register routes so a missing check is loud, not silent; and test the policy once for all routes.</p>
</div>

<h3>The whole decision, in one place</h3>
<p>First, the complete gate function the last three lessons built up — tenant, RBAC, ABAC, ReBAC, deny by default:</p>
${ma('javascript', CAN_FULL)}
<p>Everything about <em>who may do what</em> is here, in one screen you can read, test and audit. The rest of this lesson is about making sure every route actually goes through it.</p>

<h3>Not in the controller body</h3>
<p>A check buried inside a handler is a check that the <em>next</em> handler can be written without. The fix is a design where authorization is part of registering the route, not part of its body — an Express middleware you put between the path and the handler.</p>

<h3>The gate middleware</h3>
<p><code>src/authz/gate.js</code> exports <code>authorize(action, loadResource)</code>. It loads the resource itself, enforces the tenant boundary as a 404, calls <code>can()</code>, and only then lets the handler run:</p>
${ma('javascript', GATE)}
<p>Because the gate fetches the resource, a handler can never hand it attacker-controlled attributes (the 9.3 trap), and it sets <code>req.resource</code> so the handler does not re-fetch. One module, three outcomes — 401 no user, 404 missing-or-other-tenant, 403 same-tenant-no-grant — for every route that uses it.</p>

<h3>Wiring a route</h3>
${ma('javascript', WIRE)}
<p>The authorization lives in the route <em>definition</em>; the handler is free of it entirely. Read the route and you can see, at a glance, which action it is guarded by. The strongest version of this goes further: register routes through a helper that <em>requires</em> an action argument, so a route with no authorization fails a startup assertion — you cannot add an unguarded route by forgetting, you have to go out of your way.</p>

<h3>Test the gate, not forty routes</h3>
<p>Because the decision is one module, one test file is its full specification — owner allowed, peer 403, cross-tenant 404, missing 404, no-session 401 — and every route that uses the gate inherits that proof:</p>
${ra(OUT['92-http-gate'])}
<p>The demo imports the <em>real</em> <code>src/authz/gate.js</code> — it is not a toy copy, it is the module you would ship, exercised over HTTP. And the project's tests stay green:</p>
${ra(OUT['lab-npm-test'])}

<h3>Belt and braces</h3>
<p>The gate at the route is the belt; the query filter <code>WHERE tenant_id = $me</code> is the braces. Defence in depth means a bug in one still leaves the other standing. But neither replaces the single gate as the one place you read to know the policy — the filter protects data, the gate <em>states</em> the rules.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — authorizing in the frontend.</strong> Hiding the cancel button, or checking the role in React, is good UX and zero security — the API still answers <code>curl</code>. Every rule in this chapter lives on the server, at the gate. The client may mirror the policy for a tidy UI, but it is never the thing that enforces it.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Where should the authorization check go?"</strong> — In one gate, invoked as route middleware that loads the resource and calls the policy — not scattered in handler bodies or the frontend.</li>
<li><strong>"How do you stop someone adding an unguarded route?"</strong> — Register routes through a helper that requires an action, so a missing check fails at startup; and test the gate once as the policy's specification.</li>
<li><strong>"Do you still need the query filter if the gate checks the tenant?"</strong> — Yes — defence in depth; a bug in one layer should not open the wall.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Rewrite the IDOR route from 9.1 using <code>authorize(...)</code>. Which line now loads the booking, and which decides access?</li>
<li>Why does the gate load the resource itself instead of trusting a resource the handler passes in? Tie it to the 9.3 trap.</li>
<li>Give one way to make adding an unguarded route fail loudly rather than silently.</li>
</ol>
<p><strong>Solution:</strong> (1) <code>authorize('booking:read', (req) =&gt; db.booking.findById(req.params.id))</code> loads it; <code>can()</code> inside the gate decides; the handler just returns <code>req.resource</code>. (2) if the handler supplied the resource, it could supply attacker-controlled <code>ownerId</code>/<code>tenantId</code>, defeating ABAC and the tenant check — the gate fetches the server's record. (3) register routes through a helper that requires an <code>action</code> and asserts it at startup (or a lint/test that fails on a route with no <code>authorize</code>).</p>
<p><strong>Done when:</strong> you can wire a route through the gate, explain why the gate loads the resource, and name a way to make a missing check loud.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">gate middleware</span><span class="v"><code>authorize(action, loadResource)</code> — the one place the check runs, between path and handler.</span></div>
  <div class="kv"><span class="k">loadResource</span><span class="v">The function the gate uses to fetch the resource server-side before deciding.</span></div>
  <div class="kv"><span class="k">req.resource</span><span class="v">The loaded, authorized resource the gate hands to the handler — no re-fetch.</span></div>
  <div class="kv"><span class="k">fail loud</span><span class="v">Register routes so a missing authorization fails at startup, not silently in production.</span></div>
  <div class="kv"><span class="k">defence in depth</span><span class="v">The gate <em>and</em> the query filter — layered so one bug is not a breach.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>can()</code> is the whole decision in one readable screen; the job of 9.5 is making every route use it.</li>
<li>Put the check in one gate middleware that loads the resource, enforces the tenant boundary (404) and calls <code>can()</code> (403).</li>
<li>The authorization lives in the route definition, not the handler body; the handler gets <code>req.resource</code>.</li>
<li>Register routes so a missing check is loud; test the gate once as the policy's specification.</li>
<li>Keep the query filter too — defence in depth — and never authorize only in the frontend.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Compare in API Design — lesson 6.2: authorizing API callers', sub: 'There, authorization middleware framed for an API; here, the one gate behind it — loading the resource, enforcing the tenant, deciding once for all routes. The two meet at the middleware on each route. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Phép kiểm nằm ở đâu, và làm sao để KHÔNG THỂ quên</h2>
<p class="lead">Giờ bạn có một hàm quyết định sạch, <code>can()</code>. Nhưng một hàm quyết định không ai gọi thì chẳng bảo vệ gì, và "nhớ gọi nó" là một lời nhắc review — mà lời nhắc review thì bị quên. Câu hỏi cuối của chương là câu hỏi cấu trúc: phép kiểm đi đâu, để thêm một tuyến <em>thiếu</em> nó là việc khó, và lý tưởng là cách bình thường để viết một tuyến đã bao gồm nó?</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> đặt phân quyền trong một middleware cổng nạp tài nguyên và thực thi ranh giới; đăng ký tuyến sao cho một phép kiểm thiếu thì ồn ào, không âm thầm; và test chính sách một lần cho mọi tuyến.</p>
</div>

<h3>Toàn bộ quyết định, ở một chỗ</h3>
<p>Trước hết, hàm cổng đầy đủ mà ba bài vừa rồi dựng lên — tenant, RBAC, ABAC, ReBAC, từ chối mặc định:</p>
${ma('javascript', CAN_FULL)}
<p>Mọi thứ về <em>ai được làm gì</em> đều ở đây, trong một màn hình bạn đọc, test và soát được. Phần còn lại của bài là về việc đảm bảo mọi tuyến thực sự đi qua nó.</p>

<h3>Không trong thân controller</h3>
<p>Một phép kiểm chôn trong một handler là một phép kiểm mà handler <em>kế tiếp</em> có thể viết thiếu. Cách sửa là một thiết kế mà phân quyền là một phần của việc đăng ký tuyến, không phải một phần của thân nó — một middleware Express bạn đặt giữa đường dẫn và handler.</p>

<h3>Middleware cổng</h3>
<p><code>src/authz/gate.js</code> xuất <code>authorize(action, loadResource)</code>. Nó tự nạp tài nguyên, thực thi ranh giới tenant thành một 404, gọi <code>can()</code>, và chỉ sau đó mới cho handler chạy:</p>
${ma('javascript', GATE)}
<p>Vì cổng tự lấy tài nguyên, một handler không bao giờ có thể đưa cho nó các thuộc tính do kẻ tấn công điều khiển (bẫy 9.3), và nó đặt <code>req.resource</code> để handler không lấy lại. Một module, ba kết cục — 401 không người dùng, 404 thiếu-hoặc-khác-tenant, 403 cùng-tenant-thiếu-quyền — cho mọi tuyến dùng nó.</p>

<h3>Nối dây một tuyến</h3>
${ma('javascript', WIRE)}
<p>Phân quyền sống trong <em>định nghĩa</em> tuyến; handler hoàn toàn không dính nó. Đọc tuyến là bạn thấy ngay, trong một cái liếc, nó được canh bởi hành động nào. Bản mạnh nhất của điều này đi xa hơn: đăng ký tuyến qua một helper <em>bắt buộc</em> một tham số action, nên một tuyến không có phân quyền trượt một assertion lúc khởi động — bạn không thể thêm một tuyến không canh phòng bằng cách quên, bạn phải cố ý.</p>

<h3>Test cổng, không phải bốn mươi tuyến</h3>
<p>Vì quyết định là một module, một tệp test là đặc tả đầy đủ của nó — chủ được phép, bạn cùng vai 403, khác tenant 404, thiếu 404, không phiên 401 — và mọi tuyến dùng cổng thừa hưởng bằng chứng đó:</p>
${ra(OUT['92-http-gate'])}
<p>Demo import chính <code>src/authz/gate.js</code> <em>thật</em> — nó không phải một bản sao đồ chơi, nó là module bạn sẽ ship, chạy qua HTTP. Và bộ test của dự án vẫn xanh:</p>
${ra(OUT['lab-npm-test'])}

<h3>Thắt lưng và dây đeo quần</h3>
<p>Cổng ở tuyến là thắt lưng; bộ lọc truy vấn <code>WHERE tenant_id = $me</code> là dây đeo quần. Phòng thủ nhiều lớp nghĩa là một lỗi ở một bên vẫn còn bên kia đứng vững. Nhưng không cái nào thay được cổng duy nhất với vai trò một chỗ bạn đọc để biết chính sách — bộ lọc bảo vệ dữ liệu, cổng <em>phát biểu</em> luật.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — phân quyền ở frontend.</strong> Ẩn nút huỷ, hay kiểm vai trong React, là UX tốt và bảo mật bằng không — API vẫn trả lời <code>curl</code>. Mọi luật trong chương này sống ở máy chủ, tại cổng. Client có thể phản chiếu chính sách cho một giao diện gọn, nhưng nó không bao giờ là thứ thực thi.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Phép kiểm phân quyền nên đi đâu?"</strong> — Trong một cổng, gọi như middleware tuyến nạp tài nguyên và gọi chính sách — không rải trong thân handler hay ở frontend.</li>
<li><strong>"Bạn chặn ai đó thêm một tuyến không canh phòng thế nào?"</strong> — Đăng ký tuyến qua một helper bắt buộc một action, nên một phép kiểm thiếu trượt lúc khởi động; và test cổng một lần như đặc tả của chính sách.</li>
<li><strong>"Vẫn cần bộ lọc truy vấn nếu cổng kiểm tenant không?"</strong> — Có — phòng thủ nhiều lớp; một lỗi ở một lớp không nên mở bức tường.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết lại tuyến IDOR của 9.1 bằng <code>authorize(...)</code>. Dòng nào giờ nạp lượt đặt, và dòng nào quyết định truy cập?</li>
<li>Vì sao cổng tự nạp tài nguyên thay vì tin một tài nguyên handler truyền vào? Nối nó với bẫy 9.3.</li>
<li>Cho một cách làm việc thêm một tuyến không canh phòng trượt ồn ào thay vì âm thầm.</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>authorize('booking:read', (req) =&gt; db.booking.findById(req.params.id))</code> nạp nó; <code>can()</code> bên trong cổng quyết định; handler chỉ trả <code>req.resource</code>. (2) nếu handler cung cấp tài nguyên, nó có thể cung cấp <code>ownerId</code>/<code>tenantId</code> do kẻ tấn công điều khiển, đánh bại ABAC và phép kiểm tenant — cổng lấy bản ghi của máy chủ. (3) đăng ký tuyến qua một helper bắt buộc một <code>action</code> và assert nó lúc khởi động (hoặc một lint/test trượt trên một tuyến không có <code>authorize</code>).</p>
<p><strong>Đạt khi:</strong> bạn nối được một tuyến qua cổng, giải thích vì sao cổng nạp tài nguyên, và gọi tên một cách làm phép kiểm thiếu trở nên ồn ào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">gate middleware (middleware cổng)</span><span class="v"><code>authorize(action, loadResource)</code> — chỗ duy nhất phép kiểm chạy, giữa đường dẫn và handler.</span></div>
  <div class="kv"><span class="k">loadResource</span><span class="v">Hàm cổng dùng để lấy tài nguyên phía máy chủ trước khi quyết định.</span></div>
  <div class="kv"><span class="k">req.resource</span><span class="v">Tài nguyên đã nạp, đã được phép mà cổng đưa cho handler — không lấy lại.</span></div>
  <div class="kv"><span class="k">fail loud (trượt ồn ào)</span><span class="v">Đăng ký tuyến sao cho một phân quyền thiếu trượt lúc khởi động, không âm thầm ở production.</span></div>
  <div class="kv"><span class="k">defence in depth (phòng thủ nhiều lớp)</span><span class="v">Cổng <em>và</em> bộ lọc truy vấn — xếp lớp để một lỗi không phải một lỗ thủng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>can()</code> là toàn bộ quyết định trong một màn hình đọc được; việc của 9.5 là bắt mọi tuyến dùng nó.</li>
<li>Đặt phép kiểm trong một middleware cổng nạp tài nguyên, thực thi ranh giới tenant (404) và gọi <code>can()</code> (403).</li>
<li>Phân quyền sống trong định nghĩa tuyến, không trong thân handler; handler nhận <code>req.resource</code>.</li>
<li>Đăng ký tuyến sao cho một phép kiểm thiếu thì ồn ào; test cổng một lần như đặc tả của chính sách.</li>
<li>Giữ cả bộ lọc truy vấn — phòng thủ nhiều lớp — và không bao giờ phân quyền chỉ ở frontend.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'So với API Design — bài 6.2: phân quyền bên gọi API', sub: 'Ở đó, middleware phân quyền đóng khung cho một API; ở đây, một cổng sau lưng nó — nạp tài nguyên, thực thi tenant, quyết định một lần cho mọi tuyến. Hai bên gặp nhau ở middleware trên mỗi tuyến. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
