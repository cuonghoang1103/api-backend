/**
 * Authentication · Chương 9 · Lab 9 — Cổng phân quyền duy nhất của LabFlow. BÀI MỚI, slug auth-9-7-lab-can (sau quiz auth-9-6).
 * Máy chấm = scripts/cham-lab-9.mjs (6 phép, 10 điểm, đạt 7). Output: khởi đầu 1,5/10, yếu 6,5/10 (thiếu tenant+ReBAC), tham khảo 10/10, npm test 48.
 */
import G from '../giang/auth-lab-9.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const GR = CODE.grader9.split('\n');
const GR_T3 = GR.slice(GR.findIndex((l) => l.includes("T3 the tenant boundary")), GR.findIndex((l) => l.includes("T4 ABAC"))).join('\n').trim();
const SETUP = `cp -r lab9/starter lab9/my
node scripts/cham-lab-9.mjs lab9/my      # pure — no database, no network`;

const CHECKS_EN = `<table>
<thead><tr><th>Check</th><th>Points</th><th>If it fails…</th></tr></thead>
<tbody>
<tr><td>T1 RBAC — a role grants a fixed set of actions</td><td>2</td><td>roles do not restrict anything</td></tr>
<tr><td>T2 ADMIN is a blanket within its tenant</td><td>1.5</td><td>admins cannot administer</td></tr>
<tr><td>T3 the tenant boundary comes first (even for ADMIN)</td><td>2</td><td>one tenant's admin reads another's data</td></tr>
<tr><td>T4 ABAC — you may cancel your OWN booking</td><td>1.5</td><td>users cannot manage their own bookings</td></tr>
<tr><td>T5 ReBAC — a dept head cancels in THEIR department</td><td>1.5</td><td>heads lose the authority they should have</td></tr>
<tr><td>T6 deny by default; null inputs never crash</td><td>1.5</td><td>unknown actions slip through; junk input 500s</td></tr>
</tbody>
</table>`;
const CHECKS_VI = `<table>
<thead><tr><th>Phép chấm</th><th>Điểm</th><th>Nếu trượt…</th></tr></thead>
<tbody>
<tr><td>T1 RBAC — một vai cấp một tập hành động cố định</td><td>2</td><td>vai chẳng hạn chế gì</td></tr>
<tr><td>T2 ADMIN là tấm bao trọn trong tenant của nó</td><td>1,5</td><td>admin không quản trị được</td></tr>
<tr><td>T3 ranh giới tenant tới trước (kể cả với ADMIN)</td><td>2</td><td>admin của tenant này đọc dữ liệu của tenant kia</td></tr>
<tr><td>T4 ABAC — bạn được huỷ lượt đặt CỦA MÌNH</td><td>1,5</td><td>người dùng không quản lý nổi lượt đặt của chính họ</td></tr>
<tr><td>T5 ReBAC — trưởng khoa huỷ trong KHOA CỦA HỌ</td><td>1,5</td><td>trưởng khoa mất thẩm quyền đáng ra phải có</td></tr>
<tr><td>T6 từ chối mặc định; đầu vào null không bao giờ sập</td><td>1,5</td><td>hành động lạ lọt qua; đầu vào rác làm 500</td></tr>
</tbody>
</table>`;

export default {
  title: "Lab 9 — LabFlow's one authorization gate|||Lab 9 — Cổng phân quyền duy nhất của LabFlow",
  slug: 'auth-9-7-lab-can',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab Chương 9, thang 10 điểm (đạt 7) chấm bằng máy: viết can(user, action, resource) — hàm duy nhất sau mọi quyết định phân quyền của LabFlow. Máy chấm cho mọi vai đấu với một lượt đặt và kiểm cả bốn mô hình cộng từ-chối-mặc-định: RBAC (T1), ADMIN bao trọn trong tenant (T2), ranh giới tenant TRƯỚC kể cả với ADMIN (T3), sở hữu ABAC (T4), trưởng khoa ReBAC (T5), deny-by-default + an-toàn-null (T6). Output thật: khởi đầu 1,5/10; lần thử "yếu" kiểm vai trước và tenant thì không bao giờ ⇒ qua demo một-tenant nhưng chỉ 6,5/10 (admin FPT-HN với tới lượt đặt FPT-HCM ở T3, trưởng khoa không huỷ nổi ở T5); tham khảo src/authz/policy.js 10/10, 48 test xanh.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lab 9</span>
<h2>LabFlow's one authorization gate</h2>
<p class="lead">30–60 minutes. You write <code>can(user, action, resource)</code> — the single function behind every authorization decision in LabFlow. It is a pure function, and the grader plays each role against one booking, checking all four models from this chapter plus deny-by-default. The order of the checks is itself half the lesson.</p>

<div class="callout ok">
<p><strong>After this lab you can:</strong> combine RBAC, ABAC, ReBAC and the tenant boundary in one gate; read a grader failure as the exact access it opens or closes; and explain why the tenant check must come before the role.</p>
</div>

<h3>Setup</h3>
<ol>
<li>Use your <code>labflow-id</code> project at v0.9. The grader is pure — no database, no network:
${ma('bash', SETUP)}</li>
<li>Grade the empty starter once:
${ra(OUT['lab-bat-dau'])}</li>
<li>Work only in <code>lab9/my/index.js</code>. Export <code>can</code> and <code>ROLE_GRANTS</code>. Do NOT import <code>../../src/authz/policy.js</code> — that is the answer.</li>
</ol>

<h3>Your task — four models in one order</h3>
<p>The order matters as much as the models: <strong>tenant first</strong> (so a cross-tenant admin is denied before <code>'*'</code> is even considered), then <strong>RBAC</strong>, then <strong>ABAC</strong> ownership, then <strong>ReBAC</strong> department head. Any grant after the tenant check is a yes; nothing matching is deny by default. A <code>null</code> user or resource is a safe <code>false</code>, never a crash.</p>

<h3>How it is graded: 6 checks, 10 points, pass = 7</h3>
${CHECKS_EN}
<p>The heaviest two are RBAC and the tenant boundary. Here is the tenant check, the one most attempts get subtly wrong:</p>
${ma('javascript', GR_T3)}

<h3>A first attempt that passes the single-tenant demo</h3>
<p>This attempt checks the role first and the tenant <em>never</em>. On a one-tenant demo it looks perfect — and it scores 6.5 out of 10, below the pass line, because it is broken in exactly the two ways that cost the most:</p>
${ma('javascript', CODE.yeu9)}
${ra(OUT['lab-yeu'])}
<ul>
<li><strong>T3:</strong> no tenant check — an FPT-HN admin's <code>'*'</code> reaches an FPT-HCM booking. This is the multi-tenant data leak from 9.4.</li>
<li><strong>T5:</strong> no ReBAC — a department head cannot cancel a booking in their own department.</li>
<li>It passes T1 (RBAC), T4 (ABAC ownership) and T6 (deny by default) — so it "works" until a second tenant exists.</li>
</ul>
<p>Six-and-a-half out of ten is the whole point of the lab: the bug is not a crash or a failed happy path. It is a check in the wrong <em>order</em>, invisible until there is more than one tenant.</p>

<h3>Hints (light → strong)</h3>
<ol>
<li>Return <code>false</code> immediately if <code>user</code> or <code>resource</code> is missing — before touching any property.</li>
<li>Compare <code>resource.tenantId</code> to <code>user.tenantId</code> <em>next</em>, before any role — a mismatch is an immediate <code>false</code>.</li>
<li>RBAC: look the action up in <code>ROLE_GRANTS[user.role]</code>; <code>'*'</code> or an exact match is <code>true</code>.</li>
<li>ABAC: <code>booking:cancel</code> and <code>resource.ownerId === user.id</code> ⇒ <code>true</code>.</li>
<li>ReBAC: <code>booking:cancel</code> and <code>DEPT_HEAD</code> and <code>resource.departmentId === user.departmentId</code> ⇒ <code>true</code>; otherwise fall through to <code>return false</code>.</li>
</ol>

<h3>Reference solution — <code>src/authz/policy.js</code></h3>
<p>The reference is the real gate, shown line by line in 9.2–9.5. Its grade, and the project's tests:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Checklist before you submit</h3>
<ul>
<li><code>node scripts/cham-lab-9.mjs lab9/my</code> prints <code>TOTAL</code> ≥ 7 (aim for 10), twice in a row.</li>
<li>A cross-tenant admin is denied; a dept head cancels only in their own department; an unknown action and a <code>null</code> user are both a safe <code>false</code>.</li>
<li>You can explain why the tenant check must come before the role.</li>
</ul>
<p><strong>Done when:</strong> your gate scores ≥ 7/10 twice in a row, and you can say what each failed check would open up in a real system.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Lab 9</span>
<h2>Cổng phân quyền duy nhất của LabFlow</h2>
<p class="lead">30–60 phút. Bạn viết <code>can(user, action, resource)</code> — hàm duy nhất sau mọi quyết định phân quyền trong LabFlow. Nó là một hàm thuần, và máy chấm cho mỗi vai đấu với một lượt đặt, kiểm cả bốn mô hình của chương này cộng từ-chối-mặc-định. Thứ tự các phép kiểm tự nó đã là một nửa bài học.</p>

<div class="callout ok">
<p><strong>Học xong lab này bạn làm được:</strong> gộp RBAC, ABAC, ReBAC và ranh giới tenant trong một cổng; đọc một dòng chấm trượt như đúng cái truy cập nó mở ra hay đóng lại; và giải thích vì sao phép kiểm tenant phải tới trước vai.</p>
</div>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-id</code> ở v0.9. Máy chấm thuần — không cơ sở dữ liệu, không mạng:
${ma('bash', SETUP)}</li>
<li>Chấm bản khởi đầu rỗng một lần:
${ra(OUT['lab-bat-dau'])}</li>
<li>Chỉ làm trong <code>lab9/my/index.js</code>. Xuất <code>can</code> và <code>ROLE_GRANTS</code>. ĐỪNG import <code>../../src/authz/policy.js</code> — đó là đáp án.</li>
</ol>

<h3>Nhiệm vụ — bốn mô hình theo một thứ tự</h3>
<p>Thứ tự quan trọng ngang các mô hình: <strong>tenant trước</strong> (để một admin khác tenant bị từ chối trước khi <code>'*'</code> kịp được xét), rồi <strong>RBAC</strong>, rồi sở hữu <strong>ABAC</strong>, rồi trưởng khoa <strong>ReBAC</strong>. Bất kỳ quyền nào sau phép kiểm tenant là một có; không gì khớp thì từ chối mặc định. Một <code>user</code> hay <code>resource</code> <code>null</code> là một <code>false</code> an toàn, không bao giờ một cú sập.</p>

<h3>Chấm thế nào: 6 phép, 10 điểm, đạt 7</h3>
${CHECKS_VI}
<p>Hai cái nặng nhất là RBAC và ranh giới tenant. Đây là phép kiểm tenant, cái mà phần lớn lần thử sai một cách tinh vi:</p>
${ma('javascript', GR_T3)}

<h3>Một lần thử đầu qua được demo một-tenant</h3>
<p>Lần thử này kiểm vai trước và tenant thì <em>không bao giờ</em>. Trên một demo một-tenant nó trông hoàn hảo — và nó đạt 6,5 trên 10, dưới mức đạt, vì nó hỏng đúng hai cách tốn kém nhất:</p>
${ma('javascript', CODE.yeu9)}
${ra(OUT['lab-yeu'])}
<ul>
<li><strong>T3:</strong> không kiểm tenant — <code>'*'</code> của một admin FPT-HN với tới một lượt đặt FPT-HCM. Đây là cú rò dữ liệu đa-tenant của 9.4.</li>
<li><strong>T5:</strong> không ReBAC — một trưởng khoa không huỷ được một lượt đặt trong khoa của chính mình.</li>
<li>Nó qua T1 (RBAC), T4 (sở hữu ABAC) và T6 (từ chối mặc định) — nên nó "chạy" cho tới khi có một tenant thứ hai.</li>
</ul>
<p>Sáu-phẩy-năm trên mười là cả điểm mấu chốt của lab: lỗi không phải một cú sập hay một đường-đẹp trượt. Nó là một phép kiểm sai <em>thứ tự</em>, vô hình cho tới khi có hơn một tenant.</p>

<h3>Gợi ý (nhẹ → mạnh)</h3>
<ol>
<li>Trả <code>false</code> ngay nếu <code>user</code> hay <code>resource</code> thiếu — trước khi chạm bất kỳ thuộc tính nào.</li>
<li>So <code>resource.tenantId</code> với <code>user.tenantId</code> <em>kế tiếp</em>, trước mọi vai — lệch là một <code>false</code> tức thì.</li>
<li>RBAC: tra hành động trong <code>ROLE_GRANTS[user.role]</code>; <code>'*'</code> hay một khớp chính xác là <code>true</code>.</li>
<li>ABAC: <code>booking:cancel</code> và <code>resource.ownerId === user.id</code> ⇒ <code>true</code>.</li>
<li>ReBAC: <code>booking:cancel</code> và <code>DEPT_HEAD</code> và <code>resource.departmentId === user.departmentId</code> ⇒ <code>true</code>; không thì rơi xuống <code>return false</code>.</li>
</ol>

<h3>Lời giải tham khảo — <code>src/authz/policy.js</code></h3>
<p>Bản tham khảo là cổng thật, hiện từng dòng ở 9.2–9.5. Điểm của nó, và bộ test của dự án:</p>
${ra(OUT['lab-tham-khao'])}
${ra(OUT['lab-npm-test'])}

<h3>Bảng kiểm trước khi nộp</h3>
<ul>
<li><code>node scripts/cham-lab-9.mjs lab9/my</code> in <code>TOTAL</code> ≥ 7 (nhắm 10), hai lần liên tiếp.</li>
<li>Một admin khác tenant bị từ chối; một trưởng khoa chỉ huỷ trong khoa của mình; một hành động lạ và một người dùng <code>null</code> đều là một <code>false</code> an toàn.</li>
<li>Bạn giải thích được vì sao phép kiểm tenant phải tới trước vai.</li>
</ul>
<p><strong>Đạt khi:</strong> cổng của bạn đạt ≥ 7/10 hai lần liên tiếp, và bạn nói được mỗi phép kiểm trượt sẽ mở ra cái gì trong một hệ thống thật.</p>
</div>
`,
};
