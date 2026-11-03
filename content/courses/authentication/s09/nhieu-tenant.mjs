/**
 * Authentication · Chương 9 · 9.4 — Nhiều tenant: cái ranh giới KHÔNG BAO GIỜ được rò. Slug giữ: auth-9-4-nhieu-tenant.
 * Code THẬT từ _ma.mjs (src/authz/gate.js v0.9): phép kiểm tenant ⇒ 404; output demo9/http-gate.mjs.
 */
import G from '../giang/auth-09-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.policy.split('\n');
const TENANT_LINE = P.find((l) => l.includes('1. tenant boundary')).trim();
const GA = CODE.gate.split('\n');
const GATE_404 = GA.slice(GA.findIndex((l) => l.includes('const user = req.user')), GA.findIndex((l) => l.includes("FORBIDDEN")) + 1).join('\n');

const NGUON_EN = [
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Broken Access Control', 'Multi-tenant leakage is a leading Broken Access Control failure (read 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
  nguon('📐', 'NIST SP 800-162 — Attribute Based Access Control', 'Tenant as an environment/subject attribute in an access decision (read 04/11/2026).', 'https://csrc.nist.gov/pubs/sp/800/162/upd2/final'),
].join('\n');
const NGUON_VI = [
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Kiểm soát truy cập hỏng', 'Rò rỉ xuyên tenant là một lỗi Kiểm soát truy cập hỏng hàng đầu (đọc 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
  nguon('📐', 'NIST SP 800-162 — Kiểm soát truy cập theo thuộc tính', 'Tenant như một thuộc tính môi trường/chủ thể trong một quyết định truy cập (đọc 04/11/2026).', 'https://csrc.nist.gov/pubs/sp/800/162/upd2/final'),
].join('\n');

export default {
  title: '9.4 — Multi-tenancy: the boundary that must never leak|||9.4 — Nhiều tenant: cái ranh giới KHÔNG BAO GIỜ được rò',
  slug: 'auth-9-4-nhieu-tenant',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một triển khai, một CSDL, nhiều tenant (FPT HCM, FPT HN): một tenant là bức tường cứng — người dùng HCM không được thấy, chạm, hay cả XÁC NHẬN sự tồn tại của tài nguyên HN. Trong can(), phép so tenant là dòng ĐẦU TIÊN, trên mọi vai; kể cả ADMIN có \'*\' cũng không vượt qua vì \'*\' kiểm sau. Lọc WHERE tenant_id=$me là cần nhưng chưa đủ — cái ngày ai đó viết GET /:id thiếu WHERE là tường sập ở tuyến đó; phép kiểm tenant thuộc về một cổng. Rò chí tử: trả 403 cho yêu cầu khác tenant là đã nói tài nguyên TỒN TẠI ⇒ dò được id tenant kia. Nên cổng trả CÙNG 404 cho "không tồn tại" và "tồn tại nhưng khác tenant" (luật chống dò Chương 6, ở cửa tài nguyên); 403 chỉ dành cho cùng-tenant-thiếu-quyền. user.tenantId từ phiên/ID token đã xác minh, resource.tenantId từ bản ghi đã nạp — cả hai do máy chủ tin. Theo OWASP A01 + NIST SP 800-162.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Multi-tenancy: the boundary that must never leak</h2>
<p class="lead">LabFlow ID serves FPT HCM and FPT HN from one deployment and one database. A tenant is a hard wall: a user of HCM must never see, touch, or even <em>confirm the existence of</em> HN's rooms and bookings. It is the most expensive boundary to get wrong — and the subtle way it leaks is not a 200 you forgot to block, but a 403 you were proud of.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> enforce the tenant boundary above every role; explain why a cross-tenant request must answer 404 and not 403; and keep the inputs to that decision server-trusted.</p>
</div>

<h3>The boundary is the first check</h3>
<p>In the one gate, the tenant comparison is the very first line, before any role is consulted:</p>
${ma('javascript', TENANT_LINE)}
<p>If the resource's tenant is not the user's, the answer is <code>false</code>, full stop — the role, ownership and relationship checks below never run. Even an <code>ADMIN</code> with <code>'*'</code> never crosses it, because <code>'*'</code> is checked <em>after</em> this line. The wall sits above every grant in the system.</p>

<h3>Filtering queries is necessary but not sufficient</h3>
<p>Teams often rely on <code>WHERE tenant_id = $me</code> on list queries. That is correct and you should do it — but it is per-query vigilance, and the day someone writes <code>GET /bookings/:id</code> that loads by id alone, the whole wall is gone for that one route. The tenant check belongs in the one gate, which loads the resource and compares its tenant for <em>every</em> route, so no single query can forget it.</p>

<h3>The leak you do not see: 403</h3>
<p>Here is the trap. Suppose a cross-tenant request returns <code>403 Forbidden</code>. You have just told the attacker that the booking <em>exists</em> — otherwise it would be a 404. Now <code>404</code> for ids that are not real and <code>403</code> for ids that are real-but-another-tenant together let the attacker map which ids exist in the other tenant: a slow, quiet enumeration across the wall.</p>

<h3>Cross-tenant answers 404 — the same 404 as "not found"</h3>
<p>So the gate returns the <em>same</em> <code>404</code> for "does not exist" and for "exists, but in another tenant". The attacker cannot tell the two apart, and the wall reveals nothing. This is the Chapter 6 enumeration rule — one answer for every case — applied at the resource door:</p>
${ma('javascript', GATE_404)}
<p>Missing resource and wrong-tenant resource take the <em>same</em> branch: both <code>404</code>. Only when the resource is in your tenant and you simply lack the grant does the honest <code>403</code> appear — and there it leaks nothing, because the booking is in your own tenant anyway.</p>

<h3>The HTTP demo</h3>
<p>The gate module, exercised over HTTP, shows all four outcomes:</p>
${ra(OUT['92-http-gate'])}
<p>An (owner) 200; Binh (same tenant, no grant) an honest 403; the HN student 404 — <em>identical</em> to the 404 for a booking id that does not exist. Three honest statuses, zero enumeration.</p>

<h3>Where the tenant values come from</h3>
<p>The whole wall rests on two trusted inputs. <code>user.tenantId</code> comes from the verified session or ID token (Chapters 3–8), never from a header or query parameter the caller controls. <code>resource.tenantId</code> comes from the record the server loaded. If either could be set by the request, the attacker simply declares themselves in the target tenant — so both are server-side only.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "the ADMIN role should see everything."</strong> It is tempting to let ADMIN skip the tenant check "for support". Do not — that is exactly how one tenant's admin reads another's data. If cross-tenant support access is truly needed, make it a separate, audited, rarely-granted role, and log every use. The default ADMIN is an admin <em>of one tenant</em>.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"How do you isolate tenants in a shared database?"</strong> — Every row carries a <code>tenant_id</code>; the authorization gate checks it first, above roles; list queries filter by it too (defence in depth).</li>
<li><strong>"Why return 404 instead of 403 for another tenant's resource?"</strong> — A 403 confirms the resource exists, enabling enumeration across the boundary. A 404 — the same as a missing id — reveals nothing.</li>
<li><strong>"Should an admin be able to cross tenants?"</strong> — Not by default. Make cross-tenant access a separate, audited role if the business truly needs it.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo9/http-gate.mjs</code>. Which two rows return the identical status, and why is that identity the point?</li>
<li>A route filters its list query by tenant but a new detail route loads by id with no tenant check. What goes wrong, and why does moving the check into the gate fix it for all future routes?</li>
<li>Why must <code>user.tenantId</code> never come from a request header?</li>
</ol>
<p><strong>Solution:</strong> (1) the other-tenant request and the non-existent-id request both return <code>404</code>; being indistinguishable is what blocks enumeration. (2) the detail route leaks another tenant's record (and, with 403, its existence); the gate loads the resource and checks its tenant for every route, so no route can forget. (3) because a caller controls their own headers — they would just claim the target tenant and walk through the wall.</p>
<p><strong>Done when:</strong> you can explain the 404-not-403 rule as an enumeration defence, and you keep the tenant check first and its inputs server-trusted.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">multi-tenancy</span><span class="v">One deployment serving isolated tenants (FPT HCM, FPT HN) from shared infrastructure.</span></div>
  <div class="kv"><span class="k">tenant boundary</span><span class="v">The hard wall between tenants — the first check, above every role.</span></div>
  <div class="kv"><span class="k">enumeration</span><span class="v">Probing ids to learn which exist; a 403-vs-404 difference enables it (6.4).</span></div>
  <div class="kv"><span class="k">404 not 403</span><span class="v">Cross-tenant answers the same 404 as "not found", so existence never leaks.</span></div>
  <div class="kv"><span class="k">defence in depth</span><span class="v">Gate check <em>and</em> query filter — a bug in one still leaves the other.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A tenant is a hard wall; the tenant check is the first line of the gate, above every role — even ADMIN.</li>
<li>Query filters help but are per-query vigilance; the gate's check covers every route.</li>
<li>A 403 for another tenant leaks existence; cross-tenant must answer the same 404 as "not found".</li>
<li>403 is reserved for same-tenant, no-grant — where it leaks nothing.</li>
<li>Both <code>user.tenantId</code> and <code>resource.tenantId</code> are server-trusted, never request-controlled.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-6-4-do-tai-khoan', title: 'Back to 6.4 — enumeration and the one-answer rule', sub: 'There, the same message and timing for every account so sign-up cannot enumerate emails. Here, the same 404 for every cross-tenant id so the boundary cannot enumerate resources. One idea, two doors.', cta: 'OPEN LESSON 6.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Nhiều tenant: cái ranh giới KHÔNG BAO GIỜ được rò</h2>
<p class="lead">LabFlow ID phục vụ FPT HCM và FPT HN từ một lần triển khai và một cơ sở dữ liệu. Một tenant là một bức tường cứng: người dùng HCM không bao giờ được thấy, chạm, hay thậm chí <em>xác nhận sự tồn tại của</em> phòng và lượt đặt của HN. Đây là ranh giới sai thì đắt nhất — và cái cách tinh vi mà nó rò không phải một mã 200 bạn quên chặn, mà một mã 403 bạn còn lấy làm tự hào.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> thực thi ranh giới tenant trên mọi vai; giải thích vì sao một yêu cầu khác tenant phải trả 404 chứ không 403; và giữ các đầu vào của quyết định đó do máy chủ tin.</p>
</div>

<h3>Ranh giới là phép kiểm đầu tiên</h3>
<p>Trong một cổng, phép so tenant là dòng đầu tiên, trước khi bất kỳ vai nào được hỏi tới:</p>
${ma('javascript', TENANT_LINE)}
<p>Nếu tenant của tài nguyên không phải của người dùng, câu trả lời là <code>false</code>, hết — các phép kiểm vai, sở hữu và quan hệ phía dưới không bao giờ chạy. Kể cả một <code>ADMIN</code> có <code>'*'</code> cũng không bao giờ vượt qua, vì <code>'*'</code> kiểm <em>sau</em> dòng này. Bức tường nằm trên mọi quyền trong hệ thống.</p>

<h3>Lọc truy vấn là cần nhưng chưa đủ</h3>
<p>Các đội thường dựa vào <code>WHERE tenant_id = $me</code> trên các truy vấn liệt kê. Điều đó đúng và bạn nên làm — nhưng nó là sự cảnh giác theo-từng-truy-vấn, và cái ngày ai đó viết <code>GET /bookings/:id</code> nạp chỉ theo id, cả bức tường biến mất với riêng tuyến đó. Phép kiểm tenant thuộc về một cổng, thứ nạp tài nguyên và so tenant của nó cho <em>mọi</em> tuyến, nên không truy vấn đơn lẻ nào quên được.</p>

<h3>Cái rò bạn không thấy: 403</h3>
<p>Đây là cái bẫy. Giả sử một yêu cầu khác tenant trả <code>403 Forbidden</code>. Bạn vừa nói với kẻ tấn công rằng lượt đặt <em>tồn tại</em> — nếu không nó đã là 404. Giờ <code>404</code> cho các id không có thật và <code>403</code> cho các id có-thật-nhưng-khác-tenant, gộp lại, cho kẻ tấn công vẽ ra id nào tồn tại trong tenant kia: một cuộc dò chậm, lặng lẽ, xuyên tường.</p>

<h3>Khác tenant trả 404 — cùng cái 404 như "không tìm thấy"</h3>
<p>Nên cổng trả <em>cùng</em> một <code>404</code> cho "không tồn tại" và cho "tồn tại, nhưng ở tenant khác". Kẻ tấn công không phân biệt được hai cái, và bức tường không lộ gì. Đây là luật chống dò của Chương 6 — một câu trả lời cho mọi trường hợp — áp ở cửa tài nguyên:</p>
${ma('javascript', GATE_404)}
<p>Tài nguyên thiếu và tài nguyên sai tenant đi <em>cùng</em> một nhánh: cả hai <code>404</code>. Chỉ khi tài nguyên thuộc tenant của bạn và bạn chỉ là thiếu quyền thì cái <code>403</code> trung thực mới xuất hiện — và ở đó nó không lộ gì, vì lượt đặt dù sao cũng ở ngay trong tenant của bạn.</p>

<h3>Demo HTTP</h3>
<p>Module cổng, chạy qua HTTP, cho thấy cả bốn kết cục:</p>
${ra(OUT['92-http-gate'])}
<p>An (chủ) 200; Bình (cùng tenant, không quyền) một 403 trung thực; sinh viên HN 404 — <em>giống hệt</em> cái 404 cho một id lượt đặt không tồn tại. Ba mã trạng thái trung thực, không dò được gì.</p>

<h3>Giá trị tenant đến từ đâu</h3>
<p>Cả bức tường dựa vào hai đầu vào đáng tin. <code>user.tenantId</code> đến từ phiên hoặc ID token đã xác minh (Chương 3–8), không bao giờ từ một header hay tham số query người gọi điều khiển. <code>resource.tenantId</code> đến từ bản ghi máy chủ đã nạp. Nếu cái nào có thể do yêu cầu đặt, kẻ tấn công chỉ việc khai mình ở trong tenant đích — nên cả hai chỉ ở phía máy chủ.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "vai ADMIN nên thấy mọi thứ."</strong> Rất cám dỗ cho ADMIN bỏ qua phép kiểm tenant "để hỗ trợ". Đừng — đó đúng là cách một admin của tenant này đọc dữ liệu của tenant kia. Nếu truy cập hỗ trợ xuyên tenant thực sự cần, hãy làm nó thành một vai riêng, có audit, hiếm khi cấp, và ghi log mỗi lần dùng. ADMIN mặc định là một admin <em>của một tenant</em>.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn cô lập các tenant trong một CSDL chung thế nào?"</strong> — Mỗi dòng mang một <code>tenant_id</code>; cổng phân quyền kiểm nó trước, trên các vai; các truy vấn liệt kê cũng lọc theo nó (phòng thủ nhiều lớp).</li>
<li><strong>"Vì sao trả 404 thay vì 403 cho tài nguyên của tenant khác?"</strong> — Một 403 xác nhận tài nguyên tồn tại, mở đường cho dò xuyên ranh giới. Một 404 — giống một id thiếu — không lộ gì.</li>
<li><strong>"Một admin có nên vượt tenant không?"</strong> — Không mặc định. Làm truy cập xuyên tenant thành một vai riêng, có audit, nếu nghiệp vụ thực sự cần.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo9/http-gate.mjs</code>. Hai dòng nào trả cùng một mã trạng thái, và vì sao cái "giống hệt" đó là điểm mấu chốt?</li>
<li>Một tuyến lọc truy vấn liệt kê theo tenant nhưng một tuyến chi tiết mới nạp theo id không kiểm tenant. Cái gì hỏng, và vì sao chuyển phép kiểm vào cổng sửa nó cho mọi tuyến tương lai?</li>
<li>Vì sao <code>user.tenantId</code> không bao giờ được đến từ một header yêu cầu?</li>
</ol>
<p><strong>Lời giải:</strong> (1) yêu cầu khác-tenant và yêu cầu id-không-tồn-tại đều trả <code>404</code>; việc không phân biệt được chính là thứ chặn dò. (2) tuyến chi tiết làm rò bản ghi của tenant khác (và, với 403, cả sự tồn tại của nó); cổng nạp tài nguyên và kiểm tenant của nó cho mọi tuyến, nên không tuyến nào quên được. (3) vì người gọi điều khiển header của chính họ — họ sẽ chỉ việc khai tenant đích và đi xuyên qua tường.</p>
<p><strong>Đạt khi:</strong> bạn giải thích được luật 404-không-403 như một phòng thủ chống dò, và bạn giữ phép kiểm tenant ở đầu cùng các đầu vào của nó do máy chủ tin.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">multi-tenancy (nhiều tenant)</span><span class="v">Một triển khai phục vụ các tenant tách biệt (FPT HCM, FPT HN) từ hạ tầng chung.</span></div>
  <div class="kv"><span class="k">tenant boundary (ranh giới tenant)</span><span class="v">Bức tường cứng giữa các tenant — phép kiểm đầu tiên, trên mọi vai.</span></div>
  <div class="kv"><span class="k">enumeration (dò)</span><span class="v">Thăm dò các id để biết cái nào tồn tại; một khác biệt 403-với-404 mở đường cho nó (6.4).</span></div>
  <div class="kv"><span class="k">404 not 403</span><span class="v">Khác tenant trả cùng cái 404 như "không tìm thấy", nên sự tồn tại không bao giờ rò.</span></div>
  <div class="kv"><span class="k">defence in depth (phòng thủ nhiều lớp)</span><span class="v">Phép kiểm cổng <em>và</em> lọc truy vấn — một lỗi ở một bên vẫn còn bên kia.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một tenant là một bức tường cứng; phép kiểm tenant là dòng đầu của cổng, trên mọi vai — kể cả ADMIN.</li>
<li>Lọc truy vấn giúp ích nhưng là cảnh giác theo-từng-truy-vấn; phép kiểm của cổng phủ mọi tuyến.</li>
<li>Một 403 cho tenant khác làm rò sự tồn tại; khác tenant phải trả cùng cái 404 như "không tìm thấy".</li>
<li>403 dành cho cùng-tenant, thiếu-quyền — chỗ nó không lộ gì.</li>
<li>Cả <code>user.tenantId</code> và <code>resource.tenantId</code> đều do máy chủ tin, không bao giờ do yêu cầu điều khiển.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-6-4-do-tai-khoan', title: 'Quay lại 6.4 — dò và luật một-câu-trả-lời', sub: 'Ở đó, cùng một thông điệp và thời gian cho mọi tài khoản để đăng ký không dò được email. Ở đây, cùng một 404 cho mọi id khác tenant để ranh giới không dò được tài nguyên. Một ý tưởng, hai cánh cửa.', cta: 'MỞ BÀI 6.4 →' })}
</div>
`,
};
