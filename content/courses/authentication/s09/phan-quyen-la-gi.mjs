/**
 * Authentication · Chương 9 · 9.1 — Chỗ xác thực dừng lại và những con lỗi đắt tiền bắt đầu. Slug giữ: auth-9-1-phan-quyen-la-gi. Bài đầu chương.
 * Output thật (_ma.mjs, LabFlow ID v0.9): demo9/authz-matrix.mjs — một câu hỏi, một cổng can(), năm câu trả lời đúng.
 */
import G from '../giang/auth-09-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const IDOR = `// The bug that tops OWASP: authentication is correct, authorization is MISSING.
app.get('/bookings/:id', requireSession, async (req, res) => {   // ✅ we know WHO the caller is
  const booking = await db.booking.findById(req.params.id);      // ❌ …but not whether it is THEIRS
  res.json(booking);                                             // anyone reads anyone's booking by +1 on the id
});`;

const NGUON_EN = [
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Broken Access Control', 'The #1 web risk; most instances are a missing authorization check on an otherwise-authenticated route (read 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
  nguon('📏', 'NIST — Role-Based Access Control (RBAC)', 'The standard model this chapter starts from: roles grant sets of permissions (read 04/11/2026).', 'https://csrc.nist.gov/projects/role-based-access-control'),
].join('\n');
const NGUON_VI = [
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Kiểm soát truy cập hỏng', 'Rủi ro web hạng #1; phần lớn trường hợp là một phép kiểm phân quyền bị thiếu trên một tuyến vốn đã xác thực (đọc 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
  nguon('📏', 'NIST — Kiểm soát truy cập theo vai (RBAC)', 'Mô hình chuẩn chương này khởi đi: vai cấp các tập quyền (đọc 04/11/2026).', 'https://csrc.nist.gov/projects/role-based-access-control'),
].join('\n');

export default {
  title: '9.1 — Where authentication ends and the expensive bugs begin|||9.1 — Chỗ xác thực dừng lại và những con lỗi đắt tiền bắt đầu',
  slug: 'auth-9-1-phan-quyen-la-gi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Xác thực trả lời "bạn là ai" (Chương 1–8); phân quyền trả lời "bạn được làm gì" — và nó không có RFC. Kiểm soát truy cập hỏng đứng đầu OWASP Top 10, không phải vì thuật toán sai mà vì một dòng bị quên ở một trong hàng trăm tuyến (IDOR bốn dòng). Vì xác thực xảy ra một lần ở cửa còn phân quyền xảy ra trên mọi tuyến, phòng thủ phải mang tính CẤU TRÚC. Ba luật: (1) từ chối mặc định, (2) MỘT cổng can(user, action, resource), (3) quyết định trên TÀI NGUYÊN không chỉ trên vai. Demo ma trận LabFlow ID v0.9: một câu hỏi — ai huỷ được lượt đặt của An? — một cổng cho năm câu trả lời đúng. Theo OWASP A01 + NIST RBAC.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Where authentication ends and the expensive bugs begin</h2>
<p class="lead">Chapters 1 through 8 answered one question — who is this? — with cryptography, protocols and specifications. This chapter answers a different one: what may they do? It has no RFC, it is where OWASP puts its number one vulnerability, and it fails for a reason none of the previous chapters share: not a broken algorithm, but somebody forgetting a line in one of hundreds of places.</p>

<div class="callout ok">
<p><strong>After Chapter 9 you can:</strong> build one authorization gate — <code>can(user, action, resource)</code> — that combines role, ownership, relationship and tenant; explain why a cross-tenant request must return 404 and not 403; and place the check where a route cannot be written without it. Lab 9 grades your gate by playing every role against one booking.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>say precisely where authentication ends and authorization begins;</li>
<li>recognise Broken Access Control (IDOR) as the OWASP #1 and name why it is forgettable;</li>
<li>state the three structural rules — deny by default, one gate, decide on the resource — that this chapter builds.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> every other chapter protected the login. This one protects the other ten thousand requests that come after it, and it is the single most common way real systems are breached.</p>
</div>

<h3>Two questions, and only one of them has a specification</h3>
<p>Authentication asks <em>who are you</em>, and it has RFCs, token formats and a provider you can point to. Authorization asks <em>what may you do</em>, and it has none of that — the rules are your business logic, scattered wherever a request touches a resource. That difference is the whole danger: authentication happens once, at the door; authorization has to happen on every single route, and each route is a fresh chance to forget.</p>

<h3>The OWASP number one, in four lines</h3>
<p>Here is a route that authenticates the caller perfectly and is still a textbook breach:</p>
${ma('javascript', IDOR)}
<p>The session is valid; we know exactly who is calling. We just never checked that booking <code>req.params.id</code> belongs to them. An attacker logs in as themselves and walks the ids — <code>/bookings/1</code>, <code>/bookings/2</code> — reading everyone's. This is an <strong>Insecure Direct Object Reference (IDOR)</strong>, and it is the shape of most entries in OWASP's <em>A01: Broken Access Control</em>, the top category of the Top 10. Note what it is not: no cryptography failed, no token was forged. A line was missing.</p>

<h3>Why it is forgotten, and what that means for the fix</h3>
<p>You cannot solve "somebody will forget a line" with "remember the line". Vigilance does not scale to hundreds of routes and years of turnover. The fix has to be <strong>structural</strong>: the system is arranged so that the forgetful path is the one that <em>denies</em>, and writing a route without a check is harder than writing one with it. Three rules get us there, and the rest of the chapter builds each one.</p>

<h3>The three rules</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Deny by default</span><span class="lz-lnote">The answer starts at NO; a rule must flip it to yes. A route with no rule denies — it does not fall open. (A forgotten line fails safe.)</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · One gate</span><span class="lz-lnote">Every decision goes through a single <code>can(user, action, resource)</code> — not <code>if (role === 'ADMIN')</code> scattered across controllers. One gate is readable, testable, auditable.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Decide on the resource</span><span class="lz-lnote">"Is the user an admin?" is rarely the real question. "May THIS user act on THIS booking in THIS tenant?" is — so the gate takes the resource, not just the role.</span></div>
</div>

<h3>One question, five correct answers</h3>
<p>LabFlow ID v0.9 now guards rooms and bookings across two tenants (FPT HCM and FPT HN), with roles STUDENT, TEACHER, DEPT_HEAD and ADMIN. The matrix demo asks exactly one question — <em>may each user cancel An's booking?</em> — and the single gate gives five different answers, each right for a different reason:</p>
${ra(OUT['91-authz-matrix'])}
<p>The owner may (she owns it); a peer student may not (no rule grants it); the department head may (a relationship); an admin may (a blanket role); and an admin <em>from the other tenant</em> may not — denied before their role is even looked at. Four models, one function. Lessons 9.2 to 9.5 build it a model at a time; 9.2 starts with the role.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "we hide the button, so they can't do it."</strong> Hiding a UI control is not authorization; it is decoration. The API is still there, and <code>curl</code> does not render buttons. Every rule in this chapter lives on the server, at the route — the UI may <em>also</em> hide the button for tidiness, but the gate is what makes it safe.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What is the difference between authentication and authorization?"</strong> — Authentication is who you are (Chapters 1–8); authorization is what you may do. The first has specs; the second is your business logic on every route.</li>
<li><strong>"What is IDOR?"</strong> — Accessing an object by its id without checking you are allowed to — the common face of Broken Access Control, OWASP's #1.</li>
<li><strong>"Why is access control OWASP number one if it is 'just an if'?"</strong> — Because it is an <em>if</em> that must appear on hundreds of routes, and missing it anywhere is a breach. The defence is structural, not a reminder.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Look at the IDOR route above. Add, in words, the one check it is missing — and say where that check should live so the <em>next</em> route cannot forget it.</li>
<li>Run <code>node demo9/authz-matrix.mjs</code>. For each of the five rows, name which of the three rules (or which model) produced the answer.</li>
<li>Explain why "hide the cancel button for students" is not a fix for the IDOR.</li>
</ol>
<p><strong>Solution:</strong> (1) check that the loaded booking belongs to (or is accessible to) the caller — and put it in one gate the route is forced through, not in this handler's body. (2) owner = ownership (ABAC); peer = deny by default; head = relationship (ReBAC); admin = role (RBAC); cross-tenant admin = the tenant boundary, checked first. (3) the button is UI; the API route still answers <code>curl</code>, so the check must be server-side.</p>
<p><strong>Done when:</strong> you can state the three rules and give the IDOR a one-line, structural fix.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authorization</span><span class="v">Deciding what an authenticated user may do — this chapter's whole subject.</span></div>
  <div class="kv"><span class="k">Broken Access Control</span><span class="v">OWASP A01: missing or wrong authorization checks; the #1 web risk.</span></div>
  <div class="kv"><span class="k">IDOR</span><span class="v">Insecure Direct Object Reference — reaching an object by id without an ownership/access check.</span></div>
  <div class="kv"><span class="k">deny by default</span><span class="v">The decision starts at "no"; a rule must grant it. A route with no rule denies.</span></div>
  <div class="kv"><span class="k">the gate</span><span class="v">The one function — <code>can(user, action, resource)</code> — every decision passes through.</span></div>
  <div class="kv"><span class="k">tenant</span><span class="v">An isolated customer/organisation (FPT HCM, FPT HN) sharing one deployment; a hard boundary (9.4).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Authentication ends at "who are you"; authorization begins at "what may you do", and it has no RFC.</li>
<li>Broken Access Control is OWASP #1 — usually an IDOR: a missing check, not a broken algorithm.</li>
<li>Because the check must appear on every route, the defence is structural, not vigilance.</li>
<li>Three rules: deny by default, one gate, decide on the resource — built across 9.2–9.5.</li>
<li>One gate can give many correct answers to one question; the matrix demo shows five.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'Compare in API Design — lesson 6.2: authorizing API callers', sub: 'There, authorization as an API concern — scopes and middleware on routes. Here, the models and the one gate behind them. The two meet at the check on each request. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Chỗ xác thực dừng lại và những con lỗi đắt tiền bắt đầu</h2>
<p class="lead">Chương 1 tới 8 trả lời một câu hỏi — đây là ai? — bằng mật mã, giao thức và đặc tả. Chương này trả lời một câu khác: họ được làm gì? Nó không có RFC, nó là chỗ OWASP đặt lỗ hổng số một của mình, và nó hỏng vì một lý do các chương trước không có: không phải thuật toán sai, mà có ai đó quên một dòng ở một trong hàng trăm chỗ.</p>

<div class="callout ok">
<p><strong>Học xong Chương 9 bạn làm được:</strong> dựng một cổng phân quyền — <code>can(user, action, resource)</code> — gộp vai, quyền sở hữu, quan hệ và tenant; giải thích vì sao một yêu cầu khác tenant phải trả 404 chứ không 403; và đặt phép kiểm ở nơi mà một tuyến không thể viết thiếu nó. Lab 9 chấm cổng của bạn bằng cách cho mọi vai đấu với một lượt đặt.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nói chính xác chỗ xác thực dừng lại và phân quyền bắt đầu;</li>
<li>nhận ra Kiểm soát truy cập hỏng (IDOR) là OWASP #1 và gọi tên vì sao nó dễ quên;</li>
<li>phát biểu ba luật cấu trúc — từ chối mặc định, một cổng, quyết định trên tài nguyên — mà chương này dựng.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> mọi chương khác bảo vệ lần đăng nhập. Chương này bảo vệ mười nghìn yêu cầu còn lại tới sau nó, và nó là cách phổ biến nhất mà các hệ thống thật bị thủng.</p>
</div>

<h3>Hai câu hỏi, và chỉ một trong hai có đặc tả</h3>
<p>Xác thực hỏi <em>bạn là ai</em>, và nó có RFC, định dạng token và một provider bạn chỉ tay vào được. Phân quyền hỏi <em>bạn được làm gì</em>, và nó chẳng có gì trong số đó — luật là logic nghiệp vụ của bạn, rải khắp bất cứ đâu một yêu cầu chạm một tài nguyên. Khác biệt đó chính là toàn bộ hiểm hoạ: xác thực xảy ra một lần, ở cửa; phân quyền phải xảy ra trên từng tuyến một, và mỗi tuyến là một cơ hội mới để quên.</p>

<h3>OWASP số một, trong bốn dòng</h3>
<p>Đây là một tuyến xác thực người gọi hoàn hảo mà vẫn là một lỗ thủng sách giáo khoa:</p>
${ma('javascript', IDOR)}
<p>Phiên hợp lệ; ta biết chính xác ai đang gọi. Ta chỉ không bao giờ kiểm lượt đặt <code>req.params.id</code> có thuộc về họ không. Kẻ tấn công đăng nhập bằng chính mình và đi dạo qua các id — <code>/bookings/1</code>, <code>/bookings/2</code> — đọc của tất cả. Đây là một <strong>Tham chiếu đối tượng trực tiếp không an toàn (IDOR)</strong>, và nó là dáng của phần lớn các mục trong <em>A01: Kiểm soát truy cập hỏng</em> của OWASP, hạng cao nhất của Top 10. Chú ý nó KHÔNG là gì: không mật mã nào hỏng, không token nào bị giả. Một dòng bị thiếu.</p>

<h3>Vì sao nó bị quên, và điều đó nghĩa gì cho cách sửa</h3>
<p>Bạn không giải được "sẽ có người quên một dòng" bằng "nhớ dòng đó". Sự cảnh giác không mở rộng nổi tới hàng trăm tuyến và nhiều năm thay người. Cách sửa phải mang tính <strong>cấu trúc</strong>: hệ thống được bố trí sao cho con đường đãng trí là con đường <em>từ chối</em>, và viết một tuyến thiếu phép kiểm khó hơn viết một tuyến có nó. Ba luật đưa ta tới đó, và phần còn lại của chương dựng từng luật.</p>

<h3>Ba luật</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Từ chối mặc định</span><span class="lz-lnote">Câu trả lời bắt đầu ở KHÔNG; phải có một luật lật nó thành có. Một tuyến không có luật thì từ chối — nó không rơi về mở. (Một dòng bị quên thì hỏng an toàn.)</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Một cổng</span><span class="lz-lnote">Mọi quyết định đi qua một <code>can(user, action, resource)</code> duy nhất — không phải <code>if (role === 'ADMIN')</code> rải khắp controller. Một cổng thì đọc được, test được, soát được.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Quyết định trên tài nguyên</span><span class="lz-lnote">"Người dùng có phải admin không?" hiếm khi là câu hỏi thật. "NGƯỜI NÀY được tác động lên LƯỢT ĐẶT NÀY trong TENANT NÀY không?" mới là — nên cổng nhận tài nguyên, không chỉ vai.</span></div>
</div>

<h3>Một câu hỏi, năm câu trả lời đúng</h3>
<p>LabFlow ID v0.9 giờ canh phòng và lượt đặt qua hai tenant (FPT HCM và FPT HN), với vai STUDENT, TEACHER, DEPT_HEAD và ADMIN. Demo ma trận hỏi đúng một câu — <em>mỗi người có huỷ được lượt đặt của An không?</em> — và một cổng duy nhất cho năm câu trả lời khác nhau, mỗi câu đúng vì một lý do khác:</p>
${ra(OUT['91-authz-matrix'])}
<p>Chủ thì được (cô sở hữu nó); một bạn cùng vai thì không (không luật nào cấp); trưởng khoa thì được (một quan hệ); admin thì được (một vai bao trọn); và một admin <em>từ tenant kia</em> thì không — bị từ chối trước cả khi vai của họ được nhìn tới. Bốn mô hình, một hàm. Bài 9.2 tới 9.5 dựng nó từng mô hình; 9.2 bắt đầu từ vai.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "ta ẩn nút đi, nên họ không làm được."</strong> Ẩn một control giao diện không phải phân quyền; nó là trang trí. API vẫn ở đó, và <code>curl</code> không vẽ nút. Mọi luật trong chương này sống ở máy chủ, tại tuyến — giao diện <em>cũng</em> có thể ẩn nút cho gọn, nhưng cổng mới là thứ làm nó an toàn.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Khác nhau giữa xác thực và phân quyền là gì?"</strong> — Xác thực là bạn là ai (Chương 1–8); phân quyền là bạn được làm gì. Cái đầu có đặc tả; cái sau là logic nghiệp vụ của bạn trên mọi tuyến.</li>
<li><strong>"IDOR là gì?"</strong> — Truy cập một đối tượng theo id mà không kiểm bạn có được phép — khuôn mặt phổ biến của Kiểm soát truy cập hỏng, OWASP #1.</li>
<li><strong>"Vì sao kiểm soát truy cập là OWASP số một nếu nó 'chỉ là một if'?"</strong> — Vì nó là một <em>if</em> phải xuất hiện trên hàng trăm tuyến, và thiếu nó ở bất cứ đâu là một lỗ thủng. Phòng thủ là cấu trúc, không phải một lời nhắc.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Nhìn tuyến IDOR ở trên. Thêm, bằng lời, cái phép kiểm duy nhất nó thiếu — và nói phép kiểm đó nên sống ở đâu để tuyến <em>kế tiếp</em> không quên được.</li>
<li>Chạy <code>node demo9/authz-matrix.mjs</code>. Với mỗi dòng trong năm dòng, gọi tên luật nào (hay mô hình nào) tạo ra câu trả lời.</li>
<li>Giải thích vì sao "ẩn nút huỷ với sinh viên" không phải một cách sửa cho IDOR.</li>
</ol>
<p><strong>Lời giải:</strong> (1) kiểm lượt đặt đã nạp có thuộc về (hay truy cập được bởi) người gọi không — và đặt nó trong một cổng tuyến buộc phải đi qua, không trong thân handler này. (2) chủ = sở hữu (ABAC); bạn cùng vai = từ chối mặc định; trưởng khoa = quan hệ (ReBAC); admin = vai (RBAC); admin khác tenant = ranh giới tenant, kiểm trước. (3) nút là giao diện; tuyến API vẫn trả lời <code>curl</code>, nên phép kiểm phải ở phía máy chủ.</p>
<p><strong>Đạt khi:</strong> bạn phát biểu được ba luật và cho IDOR một cách sửa cấu trúc, một dòng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authorization (phân quyền)</span><span class="v">Quyết định một người dùng đã xác thực được làm gì — chủ đề của cả chương.</span></div>
  <div class="kv"><span class="k">Broken Access Control</span><span class="v">OWASP A01: phép kiểm phân quyền thiếu hoặc sai; rủi ro web #1.</span></div>
  <div class="kv"><span class="k">IDOR</span><span class="v">Tham chiếu đối tượng trực tiếp không an toàn — với tới một đối tượng theo id mà không kiểm sở hữu/truy cập.</span></div>
  <div class="kv"><span class="k">deny by default</span><span class="v">Quyết định bắt đầu ở "không"; một luật phải cấp nó. Một tuyến không luật thì từ chối.</span></div>
  <div class="kv"><span class="k">the gate (cổng)</span><span class="v">Hàm duy nhất — <code>can(user, action, resource)</code> — mọi quyết định đi qua.</span></div>
  <div class="kv"><span class="k">tenant</span><span class="v">Một khách hàng/tổ chức tách biệt (FPT HCM, FPT HN) dùng chung một lần triển khai; một ranh giới cứng (9.4).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xác thực dừng ở "bạn là ai"; phân quyền bắt đầu ở "bạn được làm gì", và nó không có RFC.</li>
<li>Kiểm soát truy cập hỏng là OWASP #1 — thường là một IDOR: một phép kiểm bị thiếu, không phải một thuật toán hỏng.</li>
<li>Vì phép kiểm phải xuất hiện trên mọi tuyến, phòng thủ là cấu trúc, không phải sự cảnh giác.</li>
<li>Ba luật: từ chối mặc định, một cổng, quyết định trên tài nguyên — dựng suốt 9.2–9.5.</li>
<li>Một cổng cho được nhiều câu trả lời đúng cho một câu hỏi; demo ma trận cho thấy năm.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-6-2-phan-quyen', title: 'So với API Design — bài 6.2: phân quyền bên gọi API', sub: 'Ở đó, phân quyền như một mối quan tâm của API — scope và middleware trên tuyến. Ở đây, các mô hình và một cổng sau lưng chúng. Hai bên gặp nhau ở phép kiểm trên mỗi yêu cầu. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
