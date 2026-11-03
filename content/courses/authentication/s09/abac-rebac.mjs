/**
 * Authentication · Chương 9 · 9.3 — Thuộc tính và quan hệ: phần phân quyền mà RBAC không diễn đạt nổi. Slug giữ: auth-9-3-abac-rebac.
 * Code THẬT từ _ma.mjs (src/authz/policy.js v0.9): nhánh ABAC (sở hữu) + ReBAC (trưởng khoa) của can(), và explain().
 */
import G from '../giang/auth-09-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.policy.split('\n');
const ABAC = P.find((l) => l.includes('3. ABAC:')).trim();
const REBAC = P.find((l) => l.includes('4. ReBAC:')).trim();
const EXPLAIN = P.slice(P.findIndex((l) => l.includes('export function explain')), P.findIndex((l) => l.includes('no grant for')) + 1).join('\n') + '\n}';
const MATRIX = OUT['91-authz-matrix'];
const AR_LINES = MATRIX.split('\n').filter((l) => l.includes('ABAC') || l.includes('ReBAC')).join('\n');

const BODYTRUST = `// ❌ reads ownerId from the REQUEST — the caller just claims to own it
if (req.body.ownerId === user.id) allow();
// ✅ reads ownerId from the loaded resource — the server's record decides
const booking = await db.booking.findById(req.params.id);
if (can(user, 'booking:cancel', booking)) allow();`;

const NGUON_EN = [
  nguon('📐', 'NIST SP 800-162 — Guide to Attribute Based Access Control (ABAC)', 'The formal definition of ABAC: access from attributes of subject, object and environment (read 04/11/2026).', 'https://csrc.nist.gov/pubs/sp/800/162/upd2/final'),
  nguon('🔗', 'Google — Zanzibar: a consistent, global authorization system', 'The industrial ReBAC system; relationships as the unit of authorization (read 04/11/2026).', 'https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/'),
].join('\n');
const NGUON_VI = [
  nguon('📐', 'NIST SP 800-162 — Hướng dẫn Kiểm soát truy cập theo thuộc tính (ABAC)', 'Định nghĩa hình thức của ABAC: truy cập từ thuộc tính của chủ thể, đối tượng và môi trường (đọc 04/11/2026).', 'https://csrc.nist.gov/pubs/sp/800/162/upd2/final'),
  nguon('🔗', 'Google — Zanzibar: hệ thống phân quyền toàn cầu nhất quán', 'Hệ ReBAC công nghiệp; quan hệ là đơn vị của phân quyền (đọc 04/11/2026).', 'https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/'),
].join('\n');

export default {
  title: '9.3 — Attributes and relationships: authorization RBAC cannot express|||9.3 — Thuộc tính và quan hệ: phần phân quyền mà RBAC không diễn đạt nổi',
  slug: 'auth-9-3-abac-rebac',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai chỗ trống RBAC để lại: "bạn được huỷ lượt đặt CỦA MÌNH" (thuộc tính — ai sở hữu) và "trưởng khoa được huỷ trong KHOA CỦA HỌ" (quan hệ). ABAC cấp bằng cách so thuộc tính chủ thể↔tài nguyên (resource.ownerId === user.id); không làm được bằng một vai vì "chủ" không phải tập người dùng cố định, nó là sự thật về một CẶP tính lúc ra quyết định. ReBAC cấp theo quan hệ trong đồ thị (DEPT_HEAD của đúng departmentId của phòng) — mô hình sau lưng Google Zanzibar, thu hẹp hành động mạnh về đúng phạm vi. Trong can() ba mô hình là chuỗi OR sau phép kiểm tenant; bất kỳ cái nào nói có là có, không thì từ chối mặc định. ABAC/ReBAC chỉ an toàn bằng dữ liệu: ownerId/departmentId phải đến từ bản ghi phía máy chủ, KHÔNG từ thân yêu cầu. explain() trả lý do cho audit log. Theo NIST SP 800-162 + Google Zanzibar.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Attributes and relationships: authorization RBAC cannot express</h2>
<p class="lead">RBAC answers by role alone, and two very ordinary questions break it: "may I cancel <em>my own</em> booking?" and "may a department head cancel bookings in <em>their</em> department?". The first depends on an attribute — who owns the thing. The second depends on a relationship — who heads the room's department. ABAC and ReBAC are exactly these two, and they slot into the one gate as extra ways to say yes.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> grant an action by ownership (ABAC) and by relationship (ReBAC); explain why neither can be a role; and keep both safe by reading attributes only from server-side resource data.</p>
</div>

<h3>Why a role cannot express ownership</h3>
<p>You cannot make a role called <code>OWNER</code>. Everyone owns their own bookings and nobody else's, so "owner" is not a fixed set of users — it is a fact about a <em>pair</em>: this user and this booking. That fact can only be computed when you have both in hand, at decision time. That is the whole idea of ABAC.</p>

<h3>ABAC — an attribute of the (actor, resource) pair</h3>
<p>The ABAC line in the gate is one comparison:</p>
${ma('javascript', ABAC)}
<p>If the booking's <code>ownerId</code> equals the caller's <code>id</code>, they may cancel it — no role involved. The permission rides on the data itself. Note it grants only the specific action (<code>booking:cancel</code>): owning a booking lets you cancel it, not manage the room it is in.</p>

<h3>ReBAC — a relationship in the graph</h3>
<p>The second gap is a relationship: the head of the SE department may cancel bookings for SE rooms, even ones they do not own. This is the model behind Google's <em>Zanzibar</em>, which authorizes much of Google by storing relationships. In the gate it is one more line:</p>
${ma('javascript', REBAC)}
<p>A <code>DEPT_HEAD</code> whose <code>departmentId</code> matches the room's may cancel. The head of SE cannot touch a booking for a BA room — the relationship is scoped to <em>their</em> department. Notice this is <em>stronger</em> than their RBAC grant in a useful way: RBAC gives a head <code>room:manage</code> on paper; ReBAC scopes the sharper action, cancelling someone else's booking, to where they actually have authority.</p>

<h3>The three models are an OR chain</h3>
<p>Inside <code>can()</code>, after the tenant check, the models are tried in order and any one that says yes wins:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RBAC</span><span class="lz-lnote">Does the role grant the action? (9.2)</span></div>
  <div class="lz-layer"><span class="lz-lname">ABAC</span><span class="lz-lnote">Do you own this resource?</span></div>
  <div class="lz-layer"><span class="lz-lname">ReBAC</span><span class="lz-lnote">Do you have the right relationship to it?</span></div>
  <div class="lz-layer"><span class="lz-lname">else</span><span class="lz-lnote">Deny by default.</span></div>
</div>
<p>Each is one readable line with one reason. Nothing granting the action means <code>return false</code>.</p>

<h3>Attributes are only as safe as their source</h3>
<p>ABAC and ReBAC read <code>ownerId</code> and <code>departmentId</code>. If those come from the request body, the caller simply claims to own the booking and the check is theatre:</p>
${ma('javascript', BODYTRUST)}
<p>Always load the resource from the server's record first, then pass <em>that</em> to <code>can()</code>. The gate in 9.5 does exactly this — it fetches the resource itself so a handler cannot hand it attacker-controlled attributes.</p>

<h3>explain() — a reason, for the audit log</h3>
<p>The same policy module returns <em>why</em> a decision went the way it did — useful for an audit trail and for teaching, and never shown to the end user (who gets only allow, or a bare 403/404):</p>
${ma('javascript', EXPLAIN)}
<p>In the matrix demo, these reasons are printed next to each answer:</p>
${ra(AR_LINES)}
<p>An by ABAC (she owns it); Binh denied (a peer, no grant); the SE head by ReBAC (heads the room's department). One question, each model answering where it applies.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — turning every attribute into a rule.</strong> ABAC can express almost anything, which is also its danger: a gate full of ad-hoc attribute comparisons becomes as unreadable as scattered role checks. Keep it to a small number of clear, named reasons (ownership; the head relationship) and let RBAC carry the bulk. Expressiveness is not the goal; a policy you can read in one screen is.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"RBAC vs ABAC vs ReBAC?"</strong> — RBAC grants by role; ABAC by attributes of the actor and resource (ownership); ReBAC by a relationship in a graph (head of this department). Most systems use RBAC plus a little ABAC/ReBAC.</li>
<li><strong>"How do you let users edit only their own records?"</strong> — ABAC: compare the resource's server-side <code>ownerId</code> to the caller — never a value from the request body.</li>
<li><strong>"What is Zanzibar?"</strong> — Google's ReBAC system: authorization as stored relationships ("user U is editor of doc D"), checked consistently at scale.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Could you express "cancel your own booking" as a role? Say why not in one sentence.</li>
<li>The SE head tries to cancel a booking for a BA room in the same tenant. Trace <code>can()</code> line by line — which branches are tried, and what is the result?</li>
<li>A route reads <code>ownerId</code> from <code>req.body</code> and passes it to the ownership check. What is the exact attack, and the one-line fix?</li>
</ol>
<p><strong>Solution:</strong> (1) no — "owner" is not a fixed set of users; it is a per-pair fact, so it cannot be a role. (2) tenant matches → RBAC: <code>DEPT_HEAD</code> has no <code>booking:cancel</code> grant → ABAC: not the owner → ReBAC: <code>departmentId</code> (BA) ≠ head's (SE) → <code>return false</code>: denied. (3) the caller claims any <code>ownerId</code> and cancels anyone's booking; fix by loading the booking from the DB and reading <em>its</em> <code>ownerId</code>.</p>
<p><strong>Done when:</strong> you can place ownership and the head-relationship as ABAC and ReBAC, and you always read their attributes from the server's copy of the resource.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ABAC</span><span class="v">Attribute-Based Access Control: grant from attributes of the actor and resource (ownership).</span></div>
  <div class="kv"><span class="k">ReBAC</span><span class="v">Relationship-Based Access Control: grant from a relationship (head of the resource's department).</span></div>
  <div class="kv"><span class="k">ownership</span><span class="v">The attribute <code>resource.ownerId === user.id</code> — a per-pair fact, not a role.</span></div>
  <div class="kv"><span class="k">Zanzibar</span><span class="v">Google's ReBAC system; the reference design for relationship authorization at scale.</span></div>
  <div class="kv"><span class="k">explain()</span><span class="v">The reason a decision was made — for the audit log, never shown to the user.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>RBAC cannot express ownership (a per-pair fact) or a relationship (head of a department).</li>
<li>ABAC grants by an attribute of the (actor, resource) pair; ReBAC grants by a relationship — the Zanzibar model.</li>
<li>In the one gate the models are an OR chain behind the tenant check; any yes wins, else deny by default.</li>
<li>Read attributes only from server-side resource data — never from the request body.</li>
<li><code>explain()</code> gives the reason for an audit log; keep the attribute rules few and named.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Compare in API Design — lesson 6.2: authorizing API callers', sub: 'There, ownership checks framed as an API concern; here, the ABAC/ReBAC models behind them and why their inputs must be server-trusted. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Thuộc tính và quan hệ: phần phân quyền mà RBAC không diễn đạt nổi</h2>
<p class="lead">RBAC trả lời chỉ theo vai, và hai câu hỏi rất đời thường làm nó gãy: "tôi được huỷ lượt đặt <em>của mình</em> không?" và "một trưởng khoa được huỷ lượt đặt trong khoa <em>của họ</em> không?". Cái đầu phụ thuộc một thuộc tính — ai sở hữu món đồ. Cái sau phụ thuộc một quan hệ — ai đứng đầu khoa của phòng. ABAC và ReBAC chính là hai cái này, và chúng lắp vào một cổng như những cách nói-có thêm.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> cấp một hành động theo quyền sở hữu (ABAC) và theo quan hệ (ReBAC); giải thích vì sao không cái nào có thể là một vai; và giữ cả hai an toàn bằng cách chỉ đọc thuộc tính từ dữ liệu tài nguyên phía máy chủ.</p>
</div>

<h3>Vì sao một vai không diễn đạt được quyền sở hữu</h3>
<p>Bạn không thể làm một vai tên <code>OWNER</code>. Ai cũng sở hữu lượt đặt của mình và không của ai khác, nên "chủ" không phải một tập người dùng cố định — nó là một sự thật về một <em>cặp</em>: người này và lượt đặt này. Sự thật đó chỉ tính được khi bạn có cả hai trong tay, lúc ra quyết định. Đó là toàn bộ ý tưởng của ABAC.</p>

<h3>ABAC — một thuộc tính của cặp (chủ thể, tài nguyên)</h3>
<p>Dòng ABAC trong cổng là một phép so:</p>
${ma('javascript', ABAC)}
<p>Nếu <code>ownerId</code> của lượt đặt bằng <code>id</code> của người gọi, họ được huỷ nó — không dính vai nào. Quyền cưỡi trên chính dữ liệu. Chú ý nó chỉ cấp đúng hành động cụ thể (<code>booking:cancel</code>): sở hữu một lượt đặt cho bạn huỷ nó, không cho bạn quản lý cái phòng chứa nó.</p>

<h3>ReBAC — một quan hệ trong đồ thị</h3>
<p>Chỗ trống thứ hai là một quan hệ: trưởng khoa SE được huỷ lượt đặt cho phòng SE, kể cả những cái họ không sở hữu. Đây là mô hình sau lưng <em>Zanzibar</em> của Google, thứ phân quyền phần lớn Google bằng cách lưu các quan hệ. Trong cổng nó là một dòng nữa:</p>
${ma('javascript', REBAC)}
<p>Một <code>DEPT_HEAD</code> có <code>departmentId</code> khớp với của phòng thì được huỷ. Trưởng khoa SE không chạm được một lượt đặt cho phòng của BA — quan hệ bị thu hẹp về khoa <em>của họ</em>. Chú ý cái này <em>mạnh hơn</em> quyền RBAC của họ theo một cách hữu ích: RBAC cho một trưởng khoa <code>room:manage</code> trên giấy; ReBAC thu hẹp hành động sắc hơn, huỷ lượt đặt của người khác, về đúng chỗ họ thực sự có thẩm quyền.</p>

<h3>Ba mô hình là một chuỗi OR</h3>
<p>Bên trong <code>can()</code>, sau phép kiểm tenant, các mô hình được thử theo thứ tự và bất kỳ cái nào nói có là thắng:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RBAC</span><span class="lz-lnote">Vai có cấp hành động không? (9.2)</span></div>
  <div class="lz-layer"><span class="lz-lname">ABAC</span><span class="lz-lnote">Bạn có sở hữu tài nguyên này không?</span></div>
  <div class="lz-layer"><span class="lz-lname">ReBAC</span><span class="lz-lnote">Bạn có quan hệ đúng với nó không?</span></div>
  <div class="lz-layer"><span class="lz-lname">còn lại</span><span class="lz-lnote">Từ chối mặc định.</span></div>
</div>
<p>Mỗi cái là một dòng đọc được với một lý do. Không gì cấp hành động nghĩa là <code>return false</code>.</p>

<h3>Thuộc tính chỉ an toàn bằng nguồn của nó</h3>
<p>ABAC và ReBAC đọc <code>ownerId</code> và <code>departmentId</code>. Nếu chúng đến từ thân yêu cầu, người gọi chỉ việc khai là mình sở hữu lượt đặt và phép kiểm thành kịch:</p>
${ma('javascript', BODYTRUST)}
<p>Luôn nạp tài nguyên từ bản ghi phía máy chủ trước, rồi truyền <em>cái đó</em> cho <code>can()</code>. Cổng ở 9.5 làm đúng điều này — nó tự lấy tài nguyên nên một handler không thể đưa cho nó các thuộc tính do kẻ tấn công điều khiển.</p>

<h3>explain() — một lý do, cho audit log</h3>
<p>Cùng module chính sách trả về <em>vì sao</em> một quyết định đi theo hướng của nó — hữu ích cho một vết audit và cho dạy học, và không bao giờ hiện cho người dùng cuối (người chỉ nhận allow, hoặc một 403/404 trần):</p>
${ma('javascript', EXPLAIN)}
<p>Trong demo ma trận, các lý do này được in cạnh mỗi câu trả lời:</p>
${ra(AR_LINES)}
<p>An theo ABAC (cô sở hữu nó); Bình bị từ chối (một bạn cùng vai, không quyền); trưởng khoa SE theo ReBAC (đứng đầu khoa của phòng). Một câu hỏi, mỗi mô hình trả lời ở chỗ nó áp dụng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — biến mọi thuộc tính thành một luật.</strong> ABAC diễn đạt được gần như mọi thứ, mà đó cũng là hiểm hoạ của nó: một cổng đầy các phép so thuộc tính tuỳ tiện trở nên khó đọc y như các phép kiểm vai rải rác. Giữ nó ở một số ít lý do rõ, có tên (sở hữu; quan hệ trưởng khoa) và để RBAC gánh phần lớn. Khả năng diễn đạt không phải mục tiêu; một chính sách đọc hết trong một màn hình mới là.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"RBAC so với ABAC so với ReBAC?"</strong> — RBAC cấp theo vai; ABAC theo thuộc tính của chủ thể và tài nguyên (sở hữu); ReBAC theo một quan hệ trong đồ thị (trưởng khoa này). Phần lớn hệ thống dùng RBAC cộng một chút ABAC/ReBAC.</li>
<li><strong>"Làm sao cho người dùng chỉ sửa được bản ghi của chính họ?"</strong> — ABAC: so <code>ownerId</code> phía máy chủ của tài nguyên với người gọi — không bao giờ một giá trị từ thân yêu cầu.</li>
<li><strong>"Zanzibar là gì?"</strong> — Hệ ReBAC của Google: phân quyền như các quan hệ được lưu ("người dùng U là editor của tài liệu D"), kiểm nhất quán ở quy mô lớn.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Bạn có diễn đạt được "huỷ lượt đặt của chính bạn" thành một vai không? Nói vì sao không trong một câu.</li>
<li>Trưởng khoa SE thử huỷ một lượt đặt cho phòng của BA trong cùng tenant. Lần theo <code>can()</code> từng dòng — những nhánh nào được thử, và kết quả là gì?</li>
<li>Một tuyến đọc <code>ownerId</code> từ <code>req.body</code> và truyền nó cho phép kiểm sở hữu. Cú tấn công chính xác là gì, và cách sửa một dòng?</li>
</ol>
<p><strong>Lời giải:</strong> (1) không — "chủ" không phải một tập người dùng cố định; nó là một sự thật theo-cặp, nên không thể là một vai. (2) tenant khớp → RBAC: <code>DEPT_HEAD</code> không có quyền <code>booking:cancel</code> → ABAC: không phải chủ → ReBAC: <code>departmentId</code> (BA) ≠ của trưởng khoa (SE) → <code>return false</code>: từ chối. (3) người gọi khai bất kỳ <code>ownerId</code> nào và huỷ lượt đặt của bất kỳ ai; sửa bằng cách nạp lượt đặt từ DB và đọc <code>ownerId</code> <em>của nó</em>.</p>
<p><strong>Đạt khi:</strong> bạn đặt được quyền sở hữu và quan hệ trưởng khoa thành ABAC và ReBAC, và bạn luôn đọc thuộc tính của chúng từ bản sao tài nguyên của máy chủ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ABAC</span><span class="v">Kiểm soát truy cập theo thuộc tính: cấp từ thuộc tính của chủ thể và tài nguyên (sở hữu).</span></div>
  <div class="kv"><span class="k">ReBAC</span><span class="v">Kiểm soát truy cập theo quan hệ: cấp từ một quan hệ (trưởng khoa của tài nguyên).</span></div>
  <div class="kv"><span class="k">ownership (sở hữu)</span><span class="v">Thuộc tính <code>resource.ownerId === user.id</code> — một sự thật theo-cặp, không phải một vai.</span></div>
  <div class="kv"><span class="k">Zanzibar</span><span class="v">Hệ ReBAC của Google; thiết kế tham chiếu cho phân quyền theo quan hệ ở quy mô lớn.</span></div>
  <div class="kv"><span class="k">explain()</span><span class="v">Lý do một quyết định được đưa ra — cho audit log, không bao giờ hiện cho người dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>RBAC không diễn đạt được quyền sở hữu (sự thật theo-cặp) hay một quan hệ (trưởng khoa của một khoa).</li>
<li>ABAC cấp theo một thuộc tính của cặp (chủ thể, tài nguyên); ReBAC cấp theo một quan hệ — mô hình Zanzibar.</li>
<li>Trong một cổng, các mô hình là một chuỗi OR sau phép kiểm tenant; bất kỳ cái có nào thắng, không thì từ chối mặc định.</li>
<li>Chỉ đọc thuộc tính từ dữ liệu tài nguyên phía máy chủ — không bao giờ từ thân yêu cầu.</li>
<li><code>explain()</code> cho lý do để ghi audit log; giữ các luật thuộc tính ít và có tên.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'So với API Design — bài 6.2: phân quyền bên gọi API', sub: 'Ở đó, các phép kiểm sở hữu đóng khung như một mối quan tâm của API; ở đây, các mô hình ABAC/ReBAC sau lưng chúng và vì sao đầu vào của chúng phải do máy chủ tin. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
