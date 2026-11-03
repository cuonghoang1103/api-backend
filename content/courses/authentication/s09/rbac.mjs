/**
 * Authentication · Chương 9 · 9.2 — RBAC, và cái boolean rồi sẽ thành bốn mươi cái boolean. Slug giữ: auth-9-2-rbac.
 * Code THẬT từ _ma.mjs (src/authz/policy.js, LabFlow ID v0.9): bảng ROLE_GRANTS + nhánh RBAC của can().
 */
import G from '../giang/auth-09-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.policy.split('\n');
const GRANTS = P.slice(P.findIndex((l) => l.includes('export const ROLE_GRANTS')), P.findIndex((l) => l.includes("ADMIN:")) + 1).join('\n') + '\n};';
// Chỉ phần đầu của can() tới hết nhánh RBAC (tenant + role lookup) — ABAC/ReBAC để dành 9.3, bản đầy đủ ở 9.5.
const CAN_RBAC = P.slice(P.findIndex((l) => l.includes('export function can')), P.findIndex((l) => l.includes("RBAC (ADMIN")) + 1).join('\n') + '\n  // … ABAC (9.3), ReBAC (9.3) …\n  return false;                                                      // deny by default\n}';
const MATRIX = OUT['91-authz-matrix'];
const RBAC_LINES = MATRIX.split('\n').filter((l) => l.includes('RBAC')).join('\n');

const BADWAY = `// The shortcut that rots. Six months later there are forty of these, three say 'admin' lowercase,
// and nobody can answer "what may a TEACHER do?" without grepping the whole repo.
if (req.user.role === 'ADMIN') { /* allow */ }           // in bookings.js
if (user.role == 'admin') { /* allow */ }                // in rooms.js — lowercase, silently never matches
if (['ADMIN','DEPT_HEAD'].includes(u.role)) { /* allow */ }  // in reports.js — and one route checks the wrong set`;

const NGUON_EN = [
  nguon('📏', 'NIST — Role-Based Access Control (RBAC)', 'The model: users get roles, roles carry permissions; the basis of this lesson (read 04/11/2026).', 'https://csrc.nist.gov/projects/role-based-access-control'),
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Broken Access Control', 'Why scattered, inconsistent role checks are the top web risk (read 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
].join('\n');
const NGUON_VI = [
  nguon('📏', 'NIST — Kiểm soát truy cập theo vai (RBAC)', 'Mô hình: người dùng nhận vai, vai mang quyền; nền của bài này (đọc 04/11/2026).', 'https://csrc.nist.gov/projects/role-based-access-control'),
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Kiểm soát truy cập hỏng', 'Vì sao các phép kiểm vai rải rác, thiếu nhất quán là rủi ro web cao nhất (đọc 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
].join('\n');

export default {
  title: '9.2 — RBAC, and the boolean that becomes forty booleans|||9.2 — RBAC, và cái boolean rồi sẽ thành bốn mươi cái boolean',
  slug: 'auth-9-2-rbac',
  type: 'LESSON',
  isFreePreview: false,
  description: 'RBAC: người dùng có một vai, một vai cấp một tập hành động cố định, và "họ được không?" là "vai của họ có cấp hành động này không?". LabFlow ID v0.9 giữ ánh xạ đó trong MỘT bảng ROLE_GRANTS (STUDENT/TEACHER đọc phòng + tạo lượt đặt; DEPT_HEAD thêm room:manage; ADMIN = \'*\' nhưng vẫn chỉ trong tenant của nó). Đặt tên hành động là động-từ-trên-danh-từ (booking:create, room:manage), không phải trang/nút — một quyền bảo vệ web, mobile và script. Lối tắt if (role===\'ADMIN\') rải khắp controller là mầm mục: bốn mươi bản sao, chữ hoa/thường lệch, một tuyến kiểm nhầm vai. can() tra bảng, không thấy thì từ chối mặc định — booking:nuke chưa ai cấp thì cấm với mọi vai. Theo NIST RBAC + OWASP A01.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>RBAC, and the boolean that becomes forty booleans</h2>
<p class="lead">The first model you reach for, and the right one most of the time: a user has a role, a role grants a fixed set of actions, and "may they?" becomes "does their role grant this action?". The whole art is keeping that mapping in <em>one</em> place — because the tempting alternative, a role check copied into every controller, rots into a security hole you cannot even audit.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> define roles as grants of named actions in one table; explain why actions are verbs on resources, not pages or buttons; and recognise scattered role-string checks as the anti-pattern they are.</p>
</div>

<h3>The grant table — one source of truth</h3>
<p>LabFlow ID keeps the entire role-to-action mapping in a single object. To answer "what may a TEACHER do?" you read this; you do not grep the codebase.</p>
${ma('javascript', GRANTS)}
<p>Four roles, each a list of actions. <code>STUDENT</code> and <code>TEACHER</code> may read rooms and create bookings; <code>DEPT_HEAD</code> adds <code>room:manage</code>; <code>ADMIN</code> carries <code>'*'</code>, a blanket. Adding a role is a new row; adding an action is a new entry — both reviewable in a single diff.</p>

<h3>Actions are verbs on resources, not pages</h3>
<p>Notice the names: <code>booking:create</code>, <code>room:manage</code> — a verb on a noun. The temptation is to grant "the bookings page", but that ties authorization to the UI, and the API has no pages. Name the <em>action</em>, the thing done to a resource, and the same grant protects the website, the mobile app and a raw script equally.</p>

<h3>The gate's RBAC step</h3>
<p>Inside the one gate, RBAC is a lookup — after the tenant check (9.4), which is why it appears second here:</p>
${ma('javascript', CAN_RBAC)}
<p>The role's grant list is consulted; <code>'*'</code> (ADMIN) or an exact action match is a yes. Anything not found falls through to the models in 9.3 and, finally, to <code>return false</code> — deny by default. A new action <code>booking:nuke</code> that nobody added to any role is forbidden for <em>everyone</em>, including the roles you forgot to update. That is the safety of denying by default.</p>

<h3>The boolean that rots</h3>
<p>Here is the shortcut this lesson exists to warn you off:</p>
${ma('javascript', BADWAY)}
<p>Day one, it works. By month six there are forty copies, three of them compare against <code>'admin'</code> lowercase (so they silently never match and quietly grant nothing — or worse, deny a real admin), and one route checks <code>['ADMIN','DEPT_HEAD']</code> where it meant just <code>ADMIN</code>. No one can answer "what may a TEACHER do?" without reading every file. The grant table replaces all of it with one lookup, and the gate is the only caller.</p>

<h3>ADMIN is a blanket — but only inside its tenant</h3>
<p><code>ADMIN</code> has <code>'*'</code>, so within its tenant it may do anything. But the <code>'*'</code> check happens <em>after</em> the tenant boundary, so an admin of FPT HCM is not an admin of FPT HN (9.4). "Super-admin across tenants" is a separate, rarer thing you grant on purpose — never the quiet default meaning of the ADMIN role.</p>

<h3>RBAC in the matrix</h3>
<p>The clean, role-only rows of the demo:</p>
${ra(RBAC_LINES)}
<p>A pure role lookup: a STUDENT may create a booking but not manage a room; a DEPT_HEAD may manage rooms. No resource attributes needed yet — those come in 9.3, for the questions a role alone cannot answer.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "roles are enough."</strong> RBAC cannot express "you may cancel <em>your own</em> booking" (that depends on who owns it) or "the head may cancel bookings in <em>their</em> department" (that depends on a relationship). Reaching for "make an OWNER role" fails, because everyone owns different things — ownership is not a fixed set of users. Lesson 9.3 is exactly these gaps.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What is RBAC?"</strong> — Users have roles, roles grant sets of actions; authorization is a lookup of the user's role against the action.</li>
<li><strong>"Why not just check <code>role === 'admin'</code> in the route?"</strong> — It scatters the policy across the codebase, drifts (case, wrong sets), and becomes un-auditable. Keep the mapping in one table and one gate.</li>
<li><strong>"Should a permission be named after a page?"</strong> — No. Name the action on the resource (<code>booking:create</code>) so it protects every client, not just the web UI.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Add a <code>room:create</code> action that only <code>DEPT_HEAD</code> and <code>ADMIN</code> may do. Which lines of <code>ROLE_GRANTS</code> change, and which roles are now denied it <em>without</em> you touching them?</li>
<li>A teammate writes <code>if (user.role === 'Admin')</code> in a new route. Name two separate things wrong with it.</li>
<li>Why does a brand-new action default to "forbidden for all" with this design, and why is that the safe default?</li>
</ol>
<p><strong>Solution:</strong> (1) add <code>'room:create'</code> to the <code>DEPT_HEAD</code> list; <code>ADMIN</code> already has it via <code>'*'</code>; STUDENT and TEACHER are denied automatically because it is not in their lists — nothing to touch. (2) it is a scattered check outside the one gate, <em>and</em> <code>'Admin'</code> will never match the stored <code>'ADMIN'</code>. (3) <code>can()</code> only returns true on a match, so an ungranted action falls through to <code>return false</code> — a forgotten grant fails closed, not open.</p>
<p><strong>Done when:</strong> you can add an action by editing one table, and you can state why scattered role strings are a security problem, not just a style one.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RBAC</span><span class="v">Role-Based Access Control: users get roles, roles grant sets of actions.</span></div>
  <div class="kv"><span class="k">role</span><span class="v">A named bundle of grants (STUDENT, TEACHER, DEPT_HEAD, ADMIN).</span></div>
  <div class="kv"><span class="k">action</span><span class="v">A verb on a resource (<code>booking:create</code>) — the unit of permission, not a page.</span></div>
  <div class="kv"><span class="k">grant table</span><span class="v">The one object mapping each role to its actions — the single source of truth.</span></div>
  <div class="kv"><span class="k">blanket grant</span><span class="v"><code>'*'</code> — every action, held by ADMIN, still scoped to its tenant.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>RBAC: a user's role grants a fixed set of actions; "may they?" is a lookup.</li>
<li>Keep the mapping in one table, name actions as verbs on resources, and let the one gate be the only caller.</li>
<li>Scattered <code>role === '…'</code> checks rot: duplication, case drift, wrong sets, no audit.</li>
<li>ADMIN's <code>'*'</code> is a blanket, but only inside its tenant.</li>
<li>Deny by default: an ungranted action is forbidden for everyone — RBAC cannot express ownership or relationships (9.3).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Compare in API Design — lesson 6.2: authorizing API callers', sub: 'There, roles and scopes enforced on API routes; here, where that role-to-action table comes from and why it lives in one place. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>RBAC, và cái boolean rồi sẽ thành bốn mươi cái boolean</h2>
<p class="lead">Mô hình bạn với tới đầu tiên, và phần lớn thời gian là đúng: một người dùng có một vai, một vai cấp một tập hành động cố định, và "họ được không?" thành "vai của họ có cấp hành động này không?". Cả nghệ thuật nằm ở việc giữ ánh xạ đó ở <em>một</em> chỗ — vì cái thay thế hấp dẫn, một phép kiểm vai chép vào mọi controller, mục ruỗng thành một lỗ bảo mật mà bạn thậm chí không soát nổi.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> định nghĩa vai là các quyền cấp hành động có tên trong một bảng; giải thích vì sao hành động là động-từ-trên-tài-nguyên, không phải trang hay nút; và nhận ra các phép kiểm chuỗi-vai rải rác đúng là phản mẫu như nó vốn thế.</p>
</div>

<h3>Bảng quyền — một nguồn sự thật</h3>
<p>LabFlow ID giữ toàn bộ ánh xạ vai-tới-hành-động trong một object duy nhất. Để trả lời "một TEACHER được làm gì?" bạn đọc cái này; bạn không grep khắp mã.</p>
${ma('javascript', GRANTS)}
<p>Bốn vai, mỗi vai một danh sách hành động. <code>STUDENT</code> và <code>TEACHER</code> được đọc phòng và tạo lượt đặt; <code>DEPT_HEAD</code> thêm <code>room:manage</code>; <code>ADMIN</code> mang <code>'*'</code>, một tấm bao trọn. Thêm một vai là một dòng mới; thêm một hành động là một mục mới — cả hai soát được trong một diff duy nhất.</p>

<h3>Hành động là động từ trên tài nguyên, không phải trang</h3>
<p>Chú ý các tên: <code>booking:create</code>, <code>room:manage</code> — một động từ trên một danh từ. Cám dỗ là cấp "trang lượt đặt", nhưng thế là buộc phân quyền vào giao diện, và API không có trang. Gọi tên <em>hành động</em>, việc làm lên một tài nguyên, và cùng một quyền bảo vệ website, app di động và một script trần như nhau.</p>

<h3>Bước RBAC của cổng</h3>
<p>Bên trong một cổng, RBAC là một lần tra — sau phép kiểm tenant (9.4), vì thế nó xuất hiện thứ hai ở đây:</p>
${ma('javascript', CAN_RBAC)}
<p>Danh sách quyền của vai được tra; <code>'*'</code> (ADMIN) hoặc một hành động khớp chính xác là một có. Cái gì không thấy thì rơi xuống các mô hình ở 9.3 và, cuối cùng, tới <code>return false</code> — từ chối mặc định. Một hành động mới <code>booking:nuke</code> chưa ai thêm vào vai nào thì bị cấm với <em>tất cả</em>, kể cả các vai bạn quên cập nhật. Đó là sự an toàn của việc từ chối mặc định.</p>

<h3>Cái boolean mục ruỗng</h3>
<p>Đây là lối tắt mà bài này tồn tại để cảnh báo bạn tránh:</p>
${ma('javascript', BADWAY)}
<p>Ngày đầu, nó chạy. Tới tháng thứ sáu có bốn mươi bản sao, ba bản so với <code>'admin'</code> chữ thường (nên lặng lẽ không bao giờ khớp và âm thầm chẳng cấp gì — hoặc tệ hơn, từ chối một admin thật), và một tuyến kiểm <code>['ADMIN','DEPT_HEAD']</code> chỗ nó định chỉ <code>ADMIN</code>. Không ai trả lời được "một TEACHER được làm gì?" mà không đọc từng tệp. Bảng quyền thay tất cả bằng một lần tra, và cổng là người gọi duy nhất.</p>

<h3>ADMIN là tấm bao trọn — nhưng chỉ trong tenant của nó</h3>
<p><code>ADMIN</code> có <code>'*'</code>, nên trong tenant của nó, nó được làm bất cứ gì. Nhưng phép kiểm <code>'*'</code> xảy ra <em>sau</em> ranh giới tenant, nên một admin của FPT HCM không phải admin của FPT HN (9.4). "Siêu admin xuyên tenant" là một thứ riêng, hiếm hơn, bạn cấp có chủ đích — không bao giờ là nghĩa mặc định lặng lẽ của vai ADMIN.</p>

<h3>RBAC trong ma trận</h3>
<p>Các dòng sạch, chỉ-theo-vai của demo:</p>
${ra(RBAC_LINES)}
<p>Một lần tra vai thuần: một STUDENT được tạo lượt đặt nhưng không quản lý phòng; một DEPT_HEAD được quản lý phòng. Chưa cần thuộc tính tài nguyên nào — những cái đó tới ở 9.3, cho các câu hỏi một vai không trả lời nổi.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "vai là đủ."</strong> RBAC không diễn đạt được "bạn được huỷ lượt đặt <em>của mình</em>" (phụ thuộc ai sở hữu) hay "trưởng khoa được huỷ lượt đặt trong khoa <em>của họ</em>" (phụ thuộc một quan hệ). Với tới "làm một vai OWNER" thất bại, vì ai cũng sở hữu thứ khác nhau — quyền sở hữu không phải một tập người dùng cố định. Bài 9.3 chính là hai chỗ trống này.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"RBAC là gì?"</strong> — Người dùng có vai, vai cấp các tập hành động; phân quyền là một lần tra vai của người dùng với hành động.</li>
<li><strong>"Sao không kiểm <code>role === 'admin'</code> ngay trong tuyến?"</strong> — Nó rải chính sách khắp mã, trôi dạt (chữ hoa/thường, tập sai), và thành không soát nổi. Giữ ánh xạ trong một bảng và một cổng.</li>
<li><strong>"Một quyền có nên đặt tên theo một trang không?"</strong> — Không. Gọi tên hành động trên tài nguyên (<code>booking:create</code>) để nó bảo vệ mọi client, không chỉ giao diện web.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm một hành động <code>room:create</code> mà chỉ <code>DEPT_HEAD</code> và <code>ADMIN</code> được làm. Những dòng nào của <code>ROLE_GRANTS</code> đổi, và những vai nào giờ bị từ chối nó mà bạn <em>không</em> phải đụng tới?</li>
<li>Một đồng đội viết <code>if (user.role === 'Admin')</code> trong một tuyến mới. Gọi tên hai thứ sai riêng biệt ở đó.</li>
<li>Vì sao một hành động hoàn toàn mới mặc định là "cấm với tất cả" với thiết kế này, và vì sao đó là mặc định an toàn?</li>
</ol>
<p><strong>Lời giải:</strong> (1) thêm <code>'room:create'</code> vào danh sách <code>DEPT_HEAD</code>; <code>ADMIN</code> đã có nó qua <code>'*'</code>; STUDENT và TEACHER bị từ chối tự động vì nó không có trong danh sách của họ — không gì phải đụng. (2) nó là một phép kiểm rải rác ngoài một cổng, <em>và</em> <code>'Admin'</code> sẽ không bao giờ khớp <code>'ADMIN'</code> đã lưu. (3) <code>can()</code> chỉ trả true khi khớp, nên một hành động chưa cấp rơi xuống <code>return false</code> — một quyền bị quên thì hỏng đóng, không mở.</p>
<p><strong>Đạt khi:</strong> bạn thêm được một hành động bằng cách sửa một bảng, và nói được vì sao chuỗi vai rải rác là một vấn đề bảo mật, không chỉ là vấn đề phong cách.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">RBAC</span><span class="v">Kiểm soát truy cập theo vai: người dùng nhận vai, vai cấp các tập hành động.</span></div>
  <div class="kv"><span class="k">role (vai)</span><span class="v">Một bó quyền có tên (STUDENT, TEACHER, DEPT_HEAD, ADMIN).</span></div>
  <div class="kv"><span class="k">action (hành động)</span><span class="v">Một động từ trên một tài nguyên (<code>booking:create</code>) — đơn vị của quyền, không phải một trang.</span></div>
  <div class="kv"><span class="k">grant table (bảng quyền)</span><span class="v">Object duy nhất ánh xạ mỗi vai tới các hành động của nó — nguồn sự thật duy nhất.</span></div>
  <div class="kv"><span class="k">blanket grant (quyền bao trọn)</span><span class="v"><code>'*'</code> — mọi hành động, do ADMIN giữ, vẫn trong phạm vi tenant của nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>RBAC: vai của một người dùng cấp một tập hành động cố định; "họ được không?" là một lần tra.</li>
<li>Giữ ánh xạ trong một bảng, đặt tên hành động là động từ trên tài nguyên, và để một cổng là người gọi duy nhất.</li>
<li>Các phép kiểm <code>role === '…'</code> rải rác mục ruỗng: trùng lặp, trôi chữ hoa/thường, tập sai, không soát được.</li>
<li><code>'*'</code> của ADMIN là một tấm bao trọn, nhưng chỉ trong tenant của nó.</li>
<li>Từ chối mặc định: một hành động chưa cấp thì bị cấm với tất cả — RBAC không diễn đạt được quyền sở hữu hay quan hệ (9.3).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'So với API Design — bài 6.2: phân quyền bên gọi API', sub: 'Ở đó, vai và scope thực thi trên các tuyến API; ở đây, bảng vai-tới-hành-động đó đến từ đâu và vì sao nó sống ở một chỗ. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
