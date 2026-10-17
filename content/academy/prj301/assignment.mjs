/**
 * PRJ301 · 🧭 Assignment PRJ301 từ A–Z (mẫu Quản lý phòng khám).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── ASM.1 — 🧭 Assignment A–Z (1/6): read the brief, map the 10 requirements, actors, functions, team plan ───────── */
const L_x_asm_1 = {
  title: 'ASM.1 — 🧭 Assignment A–Z (1/6): read the brief, map the 10 requirements, actors, functions, team plan|||ASM.1 — 🧭 Assignment A–Z (1/6): đọc đề, 10 yêu cầu ↔ bài học, tác nhân, chức năng, phân công nhóm',
  slug: 'prj301-asm-1',
  type: 'VIDEO',
  description: 'Bài tự thêm, mở đầu chuỗi Assignment PRJ301 từ A–Z với mẫu đề tài 8 Quản lý phòng khám: đọc đề lớp, nối 10 yêu cầu 1.1–1.10 với bài học trên web, thang tự chấm, mô tả đầy đủ tác nhân (1.1) và chức năng nghiệp vụ (1.2) bằng bảng + sơ đồ use case + vòng đời trạng thái, luật nghiệp vụ, bảng quy đổi cho cả 10 đề tài, cách chia việc nhóm 4–5 người theo chức năng và kế hoạch 5 tuần.',
  content: [
    bi(`<span class="eyebrow">🧭 Course Assignment A–Z · 1/6 · added by this site</span>
<h2>The Assignment is 30% of PRJ301 — and it is the one part you can finish before the exam room</h2>
<p class="lead">Six lessons, one real application. We build the whole Assignment for topic <strong>8 — clinic management</strong> ("Quản lý phòng khám"): patients book a visit, doctors see their day and write the result, the receptionist and the admin manage doctors, services and invoices. Every page you will see in ASM.2–ASM.6 is the response of that application <strong>running on Tomcat 10.1 with SQL Server</strong>.</p>
<div class="callout">🎯 <strong>Your topic is different?</strong> Good — that is the normal case. The class has 10 topics (table in section 6). Read these lessons with your topic beside you: every step (actors → functions → tables → MVC → filters → payment → report) is the same; only the nouns change. Section 6 gives the "clinic → your topic" translation for all ten.</div>
<p>This first lesson writes no code. It produces the first chapter of your report — the part most groups write last and badly: <em>who uses the system and what exactly can each of them do</em>. Requirements 1.1 and 1.2 ask for exactly that, and every later decision (tables, URLs, filters) comes from it.</p>`,
    `<span class="eyebrow">🧭 Assignment A–Z · 1/6 · phần web tự thêm</span>
<h2>Assignment chiếm 30% điểm PRJ301 — và là phần duy nhất bạn làm xong được trước khi vào phòng thi</h2>
<p class="lead">Sáu bài, một ứng dụng thật. Chúng ta làm trọn Assignment cho đề tài <strong>8 — Quản lý phòng khám</strong>: bệnh nhân đặt lịch khám, bác sĩ xem lịch trong ngày và ghi kết quả, lễ tân và quản trị quản lý bác sĩ, dịch vụ, hoá đơn. Mọi trang bạn thấy ở ASM.2–ASM.6 là response của chính ứng dụng đó <strong>chạy trên Tomcat 10.1 với SQL Server</strong>.</p>
<div class="callout">🎯 <strong>Đề tài của bạn khác?</strong> Tốt — đó là trường hợp bình thường. Lớp có 10 đề tài (bảng ở mục 6). Đọc chuỗi bài này với đề tài của bạn đặt bên cạnh: mọi bước (tác nhân → chức năng → bảng → MVC → filter → thanh toán → báo cáo) đều giống nhau; chỉ đổi danh từ. Mục 6 cho bảng quy đổi "phòng khám → đề tài của bạn" cho cả mười đề.</div>
<p>Bài đầu tiên này không viết dòng code nào. Nó tạo ra chương đầu của báo cáo — phần đa số nhóm viết sau cùng và viết dở: <em>ai dùng hệ thống và mỗi người được làm chính xác những gì</em>. Yêu cầu 1.1 và 1.2 hỏi đúng điều đó, và mọi quyết định về sau (bảng, URL, filter) đều sinh ra từ đây.</p>`),
    bi(`<h2>1. The brief, read slowly</h2>
<p>The class brief (copied from the teacher's sheet) has two parts. Part 1 is the application: ten requirements. Part 2 is the report: <em>analysis and design of functions and database</em>, <em>a clear split of tasks per member</em>, and the results — <em>source code, design documents and analysis report, screenshots of the interface and functions</em>.</p>
<table>
<thead><tr><th>#</th><th>Requirement (translated)</th><th>What the marker will actually look for</th></tr></thead>
<tbody>
<tr><td>1.1</td><td>Describe all actors fully</td><td>a table of actors + a use-case diagram; every actor really has an account and pages</td></tr>
<tr><td>1.2</td><td>Describe all business functions fully</td><td>a numbered function list with rules, each one working in the demo</td></tr>
<tr><td>1.3</td><td>Use the MVC model</td><td>servlets as controllers, JSP views under WEB-INF, model + DAO classes — no SQL in JSP</td></tr>
<tr><td>1.4</td><td>HTML5, CSS3, Bootstrap 5 for the front end</td><td>Bootstrap 5 classes, semantic HTML5, at least some own CSS</td></tr>
<tr><td>1.5</td><td>Servlet and JSP for the back end</td><td>real servlets (doGet/doPost), JSP views</td></tr>
<tr><td>1.6</td><td>SQL Server with JDBC/JPA</td><td>a real database script, DAO with PreparedStatement (or JPA)</td></tr>
<tr><td>1.7</td><td>Responsive front end</td><td>the pages work on a phone width (grid, collapsing navbar, scrolling tables)</td></tr>
<tr><td>1.8</td><td>JSTL and a custom tag</td><td>c:forEach/c:if/fmt instead of scriptlets + at least ONE tag you wrote</td></tr>
<tr><td>1.9</td><td>Filters to authorize users by business rule</td><td>login + a Filter that blocks wrong roles — and wrong owners</td></tr>
<tr><td>1.10</td><td>Payment through a sandbox</td><td>a test payment gateway (VNPay sandbox…) that really redirects and comes back</td></tr>
</tbody>
</table>
<div class="pitfall">"By business rule" in 1.9 is the part most groups miss. A filter that only checks "logged in?" is authentication, not authorization. The marker will log in as patient A and change <code>?id=</code> in the address bar to patient B's appointment. Lesson ASM.4 makes that attempt fail with a 403 — on purpose, with the real response.</div>`,
    `<h2>1. Đọc đề, đọc chậm</h2>
<p>Đề lớp (chép từ tờ đề của thầy cô) có hai phần. Phần 1 là ứng dụng: mười yêu cầu. Phần 2 là báo cáo: <em>phân tích, thiết kế chức năng hệ thống và cơ sở dữ liệu</em>, <em>phân công rõ ràng nhiệm vụ cho từng thành viên</em>, và kết quả — <em>mã nguồn, tài liệu thiết kế và báo cáo phân tích, hình ảnh giao diện và chức năng</em>.</p>
<table>
<thead><tr><th>#</th><th>Yêu cầu</th><th>Người chấm thật sự sẽ tìm gì</th></tr></thead>
<tbody>
<tr><td>1.1</td><td>Mô tả đầy đủ các tác nhân</td><td>bảng tác nhân + sơ đồ use case; tác nhân nào cũng có tài khoản và trang thật</td></tr>
<tr><td>1.2</td><td>Mô tả đầy đủ chức năng nghiệp vụ</td><td>danh sách chức năng đánh mã, có luật, cái nào cũng chạy được khi demo</td></tr>
<tr><td>1.3</td><td>Dùng mô hình MVC</td><td>servlet làm controller, JSP view nằm dưới WEB-INF, lớp model + DAO — không có SQL trong JSP</td></tr>
<tr><td>1.4</td><td>HTML5, CSS3, Bootstrap5 cho frontend</td><td>class Bootstrap 5, HTML5 đúng ngữ nghĩa, có CSS tự viết</td></tr>
<tr><td>1.5</td><td>Servlet, JSP cho backend</td><td>servlet thật (doGet/doPost), view JSP</td></tr>
<tr><td>1.6</td><td>SQL Server kết hợp JDBC/JPA</td><td>script CSDL thật, DAO dùng PreparedStatement (hoặc JPA)</td></tr>
<tr><td>1.7</td><td>Responsive cho frontend</td><td>trang dùng được ở bề ngang điện thoại (lưới, navbar gập, bảng cuộn ngang)</td></tr>
<tr><td>1.8</td><td>JSTL và CustomTag</td><td>c:forEach/c:if/fmt thay cho scriptlet + ít nhất MỘT thẻ tự viết</td></tr>
<tr><td>1.9</td><td>Filter phân quyền người dùng theo nghiệp vụ</td><td>đăng nhập + Filter chặn sai vai trò — và sai chủ sở hữu</td></tr>
<tr><td>1.10</td><td>Thanh toán dùng sandbox</td><td>cổng thanh toán thử (VNPay sandbox…) thật sự chuyển hướng đi và quay về</td></tr>
</tbody>
</table>
<div class="pitfall">"Theo nghiệp vụ" ở 1.9 là chỗ đa số nhóm bỏ sót. Một filter chỉ hỏi "đã đăng nhập chưa?" là xác thực (authentication), chưa phải phân quyền (authorization). Người chấm sẽ đăng nhập bằng bệnh nhân A rồi sửa <code>?id=</code> trên thanh địa chỉ thành lịch khám của bệnh nhân B. Bài ASM.4 làm cho lần thử đó thất bại với 403 — cố ý, có response thật.</div>`),
    bi(`<h2>2. Every requirement ↔ the lesson that teaches it</h2>
<p>You already have the course; this table tells you where to re-read before you build each piece. The Assignment lessons (A.x) show the same idea applied to the clinic.</p>
<table>
<thead><tr><th>Req.</th><th>Learn it here (school slides + practice)</th><th>Applied in</th></tr></thead>
<tbody>
<tr><td>1.1, 1.2</td><td>this lesson (sections 4–5)</td><td>ASM.1, report in ASM.6</td></tr>
<tr><td>1.3 MVC</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj4-1">6.A MVC slides</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-front-controller">6.2 front controller</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch6">6.4 practice</a></td><td>ASM.2, ASM.3</td></tr>
<tr><td>1.4 HTML5/CSS3/Bootstrap 5</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj1-1">1.A HTML and browsers</a> (Bootstrap itself: ASM.3)</td><td>ASM.3</td></tr>
<tr><td>1.5 Servlet/JSP</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj1-2">2.A servlets</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj3-1">3.A JSP</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-servlet-sau">2.1 forward vs redirect</a></td><td>ASM.2–ASM.4</td></tr>
<tr><td>1.6 SQL Server + JDBC/JPA</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj2-2">5.B JDBC, DAO</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch5">5.5 practice</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj8-1">7.A JPA</a></td><td>ASM.2, ASM.3</td></tr>
<tr><td>1.7 Responsive</td><td>ASM.3 (grid, navbar, tables)</td><td>ASM.3</td></tr>
<tr><td>1.8 JSTL + custom tag</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj7-1">3.D JSTL</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj9-1">3.F custom tags</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch3">3.6 practice (pager tag)</a></td><td>ASM.3</td></tr>
<tr><td>1.9 Filter by business rule</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj10-1">8.A filters</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj5-1">4.A sessions</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch8">8.3 practice (role filter)</a></td><td>ASM.4</td></tr>
<tr><td>1.10 Sandbox payment</td><td>— (not in the school slides)</td><td>ASM.5</td></tr>
<tr><td>Report, team split</td><td>this lesson (sections 7–8)</td><td>ASM.6</td></tr>
</tbody>
</table>`,
    `<h2>2. Mỗi yêu cầu ↔ bài nào dạy nó</h2>
<p>Môn học bạn đã có sẵn; bảng này chỉ chỗ đọc lại trước khi dựng từng mảnh. Các bài Assignment (A.x) cho thấy đúng ý đó áp vào phòng khám.</p>
<table>
<thead><tr><th>Yêu cầu</th><th>Học ở đây (slide trường + thực hành)</th><th>Áp dụng ở</th></tr></thead>
<tbody>
<tr><td>1.1, 1.2</td><td>chính bài này (mục 4–5)</td><td>ASM.1, báo cáo ở ASM.6</td></tr>
<tr><td>1.3 MVC</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj4-1">6.A slide MVC</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-front-controller">6.2 front controller</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch6">6.4 thực hành</a></td><td>ASM.2, ASM.3</td></tr>
<tr><td>1.4 HTML5/CSS3/Bootstrap 5</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj1-1">1.A HTML và trình duyệt</a> (riêng Bootstrap: ASM.3)</td><td>ASM.3</td></tr>
<tr><td>1.5 Servlet/JSP</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj1-2">2.A servlet</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj3-1">3.A JSP</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-servlet-sau">2.1 forward và redirect</a></td><td>ASM.2–ASM.4</td></tr>
<tr><td>1.6 SQL Server + JDBC/JPA</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj2-2">5.B JDBC, DAO</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch5">5.5 thực hành</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj8-1">7.A JPA</a></td><td>ASM.2, ASM.3</td></tr>
<tr><td>1.7 Responsive</td><td>ASM.3 (lưới, navbar, bảng)</td><td>ASM.3</td></tr>
<tr><td>1.8 JSTL + CustomTag</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj7-1">3.D JSTL</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj9-1">3.F custom tag</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch3">3.6 thực hành (thẻ phân trang)</a></td><td>ASM.3</td></tr>
<tr><td>1.9 Filter phân quyền theo nghiệp vụ</td><td><a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj10-1">8.A filter</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj5-1">4.A session</a> · <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch8">8.3 thực hành (filter vai trò)</a></td><td>ASM.4</td></tr>
<tr><td>1.10 Thanh toán sandbox</td><td>— (slide trường không có)</td><td>ASM.5</td></tr>
<tr><td>Báo cáo, phân công</td><td>chính bài này (mục 7–8)</td><td>ASM.6</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. A self-assessment scale (our own, not the official rubric)</h2>
<p>The class brief gives requirements but no marking sheet. Use this 10-point scale to check your own product <strong>before</strong> the defence — it is built from the requirements above and from what markers usually test live. Your teacher's real rubric wins whenever it differs.</p>
<table>
<thead><tr><th>Part</th><th>Points</th><th>Full marks when…</th><th>Typical loss</th></tr></thead>
<tbody>
<tr><td>Analysis (1.1, 1.2)</td><td>1.0</td><td>actor table + use cases + function list with rules, all matching the app</td><td>a list of screens instead of functions</td></tr>
<tr><td>Database (1.6)</td><td>1.0</td><td>script with PK/FK/UNIQUE/CHECK, Vietnamese data in NVARCHAR, runs twice</td><td>no constraints, VARCHAR breaks "Nguyễn"</td></tr>
<tr><td>MVC + Servlet/JSP (1.3, 1.5)</td><td>1.5</td><td>servlet → service/DAO → JSP under WEB-INF, PRG after POST</td><td>SQL inside JSP, JSP opened directly</td></tr>
<tr><td>Core functions</td><td>2.0</td><td>CRUD + search + paging + the main business flow work in the demo</td><td>F5 submits twice, paging loses the search</td></tr>
<tr><td>JSTL + custom tag (1.8)</td><td>1.0</td><td>no scriptlets; one tag of your own used on 2+ pages</td><td>the "custom tag" is a copy of the slide example</td></tr>
<tr><td>Bootstrap 5 + responsive (1.4, 1.7)</td><td>0.5</td><td>navbar collapses, tables scroll, forms show errors per field</td><td>fixed widths, page breaks on a phone</td></tr>
<tr><td>Filter by business rule (1.9)</td><td>1.5</td><td>role filter + ownership check; 403 page; logout</td><td>only "is logged in"; IDOR possible</td></tr>
<tr><td>Sandbox payment (1.10)</td><td>1.0</td><td>real redirect to the sandbox, signature checked on return, status updated once</td><td>the "payment" is a button that sets PAID</td></tr>
<tr><td>Report + teamwork</td><td>0.5</td><td>report chapters, task table, Git history per member</td><td>one member's commits only</td></tr>
</tbody>
</table>`,
    `<h2>3. Thang tự chấm (của trang này, không phải barem chính thức)</h2>
<p>Đề lớp cho yêu cầu nhưng không kèm barem. Dùng thang 10 điểm này để tự kiểm sản phẩm <strong>trước</strong> buổi bảo vệ — nó dựng từ các yêu cầu ở trên và từ những thứ người chấm hay thử trực tiếp. Barem thật của thầy cô luôn thắng nếu khác.</p>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Đủ điểm khi…</th><th>Hay mất điểm vì</th></tr></thead>
<tbody>
<tr><td>Phân tích (1.1, 1.2)</td><td>1,0</td><td>bảng tác nhân + use case + danh sách chức năng có luật, khớp với app</td><td>liệt kê màn hình thay vì chức năng</td></tr>
<tr><td>CSDL (1.6)</td><td>1,0</td><td>script có PK/FK/UNIQUE/CHECK, dữ liệu tiếng Việt NVARCHAR, chạy lại được</td><td>không có ràng buộc, VARCHAR làm hỏng chữ "Nguyễn"</td></tr>
<tr><td>MVC + Servlet/JSP (1.3, 1.5)</td><td>1,5</td><td>servlet → service/DAO → JSP dưới WEB-INF, PRG sau POST</td><td>SQL trong JSP, mở thẳng được JSP</td></tr>
<tr><td>Chức năng lõi</td><td>2,0</td><td>CRUD + tìm kiếm + phân trang + luồng nghiệp vụ chính chạy khi demo</td><td>F5 gửi lại form, phân trang làm mất từ khoá tìm</td></tr>
<tr><td>JSTL + CustomTag (1.8)</td><td>1,0</td><td>không scriptlet; một thẻ tự viết dùng ở 2+ trang</td><td>"custom tag" chép nguyên ví dụ slide</td></tr>
<tr><td>Bootstrap 5 + responsive (1.4, 1.7)</td><td>0,5</td><td>navbar gập, bảng cuộn, form báo lỗi từng ô</td><td>bề ngang cố định, vỡ trang trên điện thoại</td></tr>
<tr><td>Filter theo nghiệp vụ (1.9)</td><td>1,5</td><td>filter vai trò + kiểm chủ sở hữu; trang 403; đăng xuất</td><td>chỉ kiểm "đã đăng nhập"; còn lỗ IDOR</td></tr>
<tr><td>Thanh toán sandbox (1.10)</td><td>1,0</td><td>chuyển hướng thật sang sandbox, kiểm chữ ký khi quay về, cập nhật trạng thái một lần</td><td>"thanh toán" là nút đặt PAID</td></tr>
<tr><td>Báo cáo + làm nhóm</td><td>0,5</td><td>đủ chương báo cáo, bảng phân công, lịch sử Git từng người</td><td>chỉ có commit của một người</td></tr>
</tbody>
</table>`),
    bi(`<h2>4. Requirement 1.1 — the actors, described fully</h2>
<p>An <strong>actor</strong> (tác nhân) is a role that uses the system from outside — not a person's name and not a table. "Fully" means: who they are, what they want, what they may and may not do, and how the system recognises them. Write this table in your report as is:</p>
<table>
<thead><tr><th>Actor</th><th>Who</th><th>Goal</th><th>May</th><th>May NOT</th><th>Recognised by</th></tr></thead>
<tbody>
<tr><td>Guest</td><td>anyone on the internet</td><td>find a doctor</td><td>see specialties and doctors, register, log in</td><td>book, see any appointment</td><td>no session</td></tr>
<tr><td>Patient (PATIENT)</td><td>a person who registered</td><td>get examined without queuing</td><td>book a slot, see/cancel HIS appointments, see HIS invoices, pay (ASM.5)</td><td>see other patients' data, write results</td><td>session account, role PATIENT</td></tr>
<tr><td>Doctor (DOCTOR)</td><td>clinic doctor, account made by the admin</td><td>handle today's patients</td><td>see HIS schedule, write the result of HIS appointments</td><td>touch other doctors' visits, money</td><td>role DOCTOR</td></tr>
<tr><td>Receptionist (RECEPTIONIST)</td><td>front-desk staff</td><td>keep the day flowing, collect money</td><td>search/filter all appointments, create invoices</td><td>change prices, services, accounts</td><td>role RECEPTIONIST</td></tr>
<tr><td>Admin (ADMIN)</td><td>clinic manager</td><td>run the clinic</td><td>everything the receptionist can + manage services, doctors, specialties + reports (ASM.6)</td><td>write medical results</td><td>role ADMIN</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/84c65d3cdfbc03d98c944c2bf48c5690358f9862.svg" alt="Use-case diagram of the sample: guests and patients on the left, staff on the right" loading="lazy" /><p class="chu-thich">🧩 Use-case diagram of the sample: guests and patients on the left, staff on the right</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Clinic management (topic 8): 5 actors, 14 use cases (UC03–UC14 need a login)
left to right direction
actor "Guest\\n(khách vãng lai)" as G
actor "Patient\\n(bệnh nhân)" as P
rectangle "Phòng khám An Tâm" {
  usecase "UC01 Xem chuyên khoa, bác sĩ" as UC01
  usecase "UC02 Đăng ký tài khoản" as UC02
  usecase "UC03 Đăng nhập / đăng xuất" as UC03
  usecase "UC04 Đặt lịch khám" as UC04
  usecase "UC05 Xem, huỷ lịch của mình" as UC05
  usecase "UC06 Xem hoá đơn của mình" as UC06
  usecase "UC07 Thanh toán sandbox (A.5)" as UC07
  usecase "UC08 Xem lịch khám trong ngày" as UC08
  usecase "UC09 Ghi kết quả khám" as UC09
  usecase "UC10 Tìm, lọc mọi lịch khám" as UC10
  usecase "UC11 Lập hoá đơn" as UC11
  usecase "UC12 Quản lý dịch vụ (CRUD)" as UC12
  usecase "UC13 Quản lý bác sĩ, chuyên khoa" as UC13
  usecase "UC14 Báo cáo doanh thu (A.6)" as UC14
}
actor "Doctor\\n(bác sĩ)" as D
actor "Receptionist\\n(lễ tân)" as R
actor "Admin\\n(quản trị)" as A
G --&gt; UC01
G --&gt; UC02
P --&gt; UC04
P --&gt; UC05
P --&gt; UC03
P --&gt; UC06
P --&gt; UC07
UC06 &lt;. UC07 : &lt;&lt;extend&gt;&gt;
UC03 &lt;-- D
UC08 &lt;-- D
UC09 &lt;-- D
UC10 &lt;-- R
UC11 &lt;-- R
UC10 &lt;-- A
UC11 &lt;-- A
UC12 &lt;-- A
UC13 &lt;-- A
UC14 &lt;-- A
@enduml</code></pre></details>
<p>Two modelling choices worth defending in the viva: <strong>(1)</strong> the admin does not inherit the doctor's rights — writing a diagnosis is a medical act, so even the boss cannot; <strong>(2)</strong> Patient and Doctor are both <em>accounts</em> with a role, plus one extra table each (ASM.2) — so one login page and one filter serve everybody.</p>`,
    `<h2>4. Yêu cầu 1.1 — tác nhân, mô tả đầy đủ</h2>
<p><strong>Tác nhân</strong> (actor) là một vai trò dùng hệ thống từ bên ngoài — không phải tên một người, cũng không phải một bảng. "Đầy đủ" nghĩa là: họ là ai, họ muốn gì, được và KHÔNG được làm gì, hệ thống nhận ra họ bằng cách nào. Viết nguyên bảng này vào báo cáo:</p>
<table>
<thead><tr><th>Tác nhân</th><th>Là ai</th><th>Mục tiêu</th><th>Được</th><th>KHÔNG được</th><th>Nhận ra bằng</th></tr></thead>
<tbody>
<tr><td>Khách (Guest)</td><td>bất kỳ ai trên mạng</td><td>tìm bác sĩ</td><td>xem chuyên khoa và bác sĩ, đăng ký, đăng nhập</td><td>đặt lịch, xem bất kỳ lịch khám nào</td><td>chưa có session</td></tr>
<tr><td>Bệnh nhân (PATIENT)</td><td>người đã đăng ký</td><td>được khám không phải xếp hàng</td><td>đặt lịch, xem/huỷ lịch CỦA MÌNH, xem hoá đơn CỦA MÌNH, thanh toán (ASM.5)</td><td>xem dữ liệu bệnh nhân khác, ghi kết quả</td><td>tài khoản trong session, vai trò PATIENT</td></tr>
<tr><td>Bác sĩ (DOCTOR)</td><td>bác sĩ của phòng khám, tài khoản do admin tạo</td><td>khám xong bệnh nhân trong ngày</td><td>xem lịch CỦA MÌNH, ghi kết quả cho lịch CỦA MÌNH</td><td>đụng vào lượt khám của bác sĩ khác, tiền</td><td>vai trò DOCTOR</td></tr>
<tr><td>Lễ tân (RECEPTIONIST)</td><td>nhân viên quầy</td><td>giữ cho một ngày trôi chảy, thu tiền</td><td>tìm/lọc mọi lịch khám, lập hoá đơn</td><td>đổi giá, dịch vụ, tài khoản</td><td>vai trò RECEPTIONIST</td></tr>
<tr><td>Quản trị (ADMIN)</td><td>người quản lý phòng khám</td><td>điều hành phòng khám</td><td>mọi thứ lễ tân làm được + quản lý dịch vụ, bác sĩ, chuyên khoa + báo cáo (ASM.6)</td><td>ghi kết quả khám</td><td>vai trò ADMIN</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/84c65d3cdfbc03d98c944c2bf48c5690358f9862.svg" alt="Sơ đồ use case của bản mẫu: khách và bệnh nhân bên trái, nhân viên bên phải" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ use case của bản mẫu: khách và bệnh nhân bên trái, nhân viên bên phải</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Clinic management (topic 8): 5 actors, 14 use cases (UC03–UC14 need a login)
left to right direction
actor "Guest\\n(khách vãng lai)" as G
actor "Patient\\n(bệnh nhân)" as P
rectangle "Phòng khám An Tâm" {
  usecase "UC01 Xem chuyên khoa, bác sĩ" as UC01
  usecase "UC02 Đăng ký tài khoản" as UC02
  usecase "UC03 Đăng nhập / đăng xuất" as UC03
  usecase "UC04 Đặt lịch khám" as UC04
  usecase "UC05 Xem, huỷ lịch của mình" as UC05
  usecase "UC06 Xem hoá đơn của mình" as UC06
  usecase "UC07 Thanh toán sandbox (A.5)" as UC07
  usecase "UC08 Xem lịch khám trong ngày" as UC08
  usecase "UC09 Ghi kết quả khám" as UC09
  usecase "UC10 Tìm, lọc mọi lịch khám" as UC10
  usecase "UC11 Lập hoá đơn" as UC11
  usecase "UC12 Quản lý dịch vụ (CRUD)" as UC12
  usecase "UC13 Quản lý bác sĩ, chuyên khoa" as UC13
  usecase "UC14 Báo cáo doanh thu (A.6)" as UC14
}
actor "Doctor\\n(bác sĩ)" as D
actor "Receptionist\\n(lễ tân)" as R
actor "Admin\\n(quản trị)" as A
G --&gt; UC01
G --&gt; UC02
P --&gt; UC04
P --&gt; UC05
P --&gt; UC03
P --&gt; UC06
P --&gt; UC07
UC06 &lt;. UC07 : &lt;&lt;extend&gt;&gt;
UC03 &lt;-- D
UC08 &lt;-- D
UC09 &lt;-- D
UC10 &lt;-- R
UC11 &lt;-- R
UC10 &lt;-- A
UC11 &lt;-- A
UC12 &lt;-- A
UC13 &lt;-- A
UC14 &lt;-- A
@enduml</code></pre></details>
<p>Hai lựa chọn mô hình hoá nên chuẩn bị để bảo vệ: <strong>(1)</strong> admin KHÔNG thừa hưởng quyền của bác sĩ — ghi chẩn đoán là một hành vi chuyên môn y tế, sếp cũng không được làm; <strong>(2)</strong> Bệnh nhân và Bác sĩ đều là <em>tài khoản</em> có vai trò, cộng thêm mỗi loại một bảng riêng (ASM.2) — nên một trang đăng nhập và một filter phục vụ được tất cả.</p>`),
    bi(`<h2>5. Requirement 1.2 — the business functions, with their rules</h2>
<p>A <strong>function</strong> is something an actor achieves ("book a visit"), not a screen ("booking page"). Give each one a code, an actor, the rules the system enforces, and where it lives — that last column becomes your URL plan for ASM.2.</p>
<table>
<thead><tr><th>Code</th><th>Function</th><th>Actor</th><th>Business rules (enforced by the server)</th><th>URL</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>UC01</td><td>See specialties and doctors</td><td>Guest</td><td>only active doctors</td><td>GET /</td><td>ASM.2</td></tr>
<tr><td>UC02</td><td>Register</td><td>Guest</td><td>username 4–30 chars, unique; password ≥ 8 with letters and digits, stored hashed; phone 10 digits</td><td>/register</td><td>ASM.4</td></tr>
<tr><td>UC03</td><td>Log in / log out</td><td>all</td><td>one message for "wrong user" and "wrong password"; new session id after login; logout is POST</td><td>/login, /logout</td><td>ASM.4</td></tr>
<tr><td>UC04</td><td>Book an appointment</td><td>Patient</td><td>from tomorrow to 30 days ahead; 30-minute slots; service of the doctor's specialty; no double booking for the doctor or the patient</td><td>/patient/appointments/new, /create</td><td>ASM.3</td></tr>
<tr><td>UC05</td><td>See / cancel my appointments</td><td>Patient</td><td>only his own; cancel only while BOOKED</td><td>/patient/appointments, /view, /cancel</td><td>ASM.3, ASM.4</td></tr>
<tr><td>UC06</td><td>See my invoices</td><td>Patient</td><td>only his own</td><td>/patient/invoices</td><td>ASM.3</td></tr>
<tr><td>UC07</td><td>Pay an invoice (sandbox)</td><td>Patient</td><td>only UNPAID, only his own, marked PAID once</td><td>/patient/invoices/…</td><td>ASM.5</td></tr>
<tr><td>UC08</td><td>See my schedule of a day</td><td>Doctor</td><td>only his own appointments</td><td>/doctor/schedule</td><td>ASM.4</td></tr>
<tr><td>UC09</td><td>Write the result</td><td>Doctor</td><td>only his own appointment, only while BOOKED; diagnosis required ⇒ DONE</td><td>/doctor/appointments/result</td><td>ASM.4</td></tr>
<tr><td>UC10</td><td>Search all appointments</td><td>Receptionist, Admin</td><td>search by name, filter by status/date, 5 per page</td><td>/reception/appointments</td><td>ASM.3</td></tr>
<tr><td>UC11</td><td>Create an invoice</td><td>Receptionist, Admin</td><td>only for a DONE visit, once; amount = service price from the database</td><td>/reception/invoices/create</td><td>ASM.3</td></tr>
<tr><td>UC12</td><td>Manage services (CRUD)</td><td>Admin</td><td>unique name; integer price &gt; 0; a used service cannot be deleted</td><td>/admin/services</td><td>ASM.3</td></tr>
<tr><td>UC13</td><td>Manage doctors and specialties</td><td>Admin</td><td>same pattern as UC12 (exercise)</td><td>/admin/doctors…</td><td>ASM.3 exercise</td></tr>
<tr><td>UC14</td><td>Revenue report</td><td>Admin</td><td>PAID invoices only</td><td>/admin/reports</td><td>ASM.6</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/fa3b5d39320c8ac4eadee6cc5ea1714491aab7a5.svg" alt="Two status columns carry the business: an appointment BOOKED → DONE or CANCELLED, an invoice UNPAID → PAID" loading="lazy" /><p class="chu-thich">🧩 Two status columns carry the business: an appointment BOOKED → DONE or CANCELLED, an invoice UNPAID → PAID</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Life of an appointment and of its invoice (the status columns of the database)
state "Appointment" as AP {
  [*] --&gt; BOOKED : patient books (UC04)
  BOOKED --&gt; CANCELLED : patient cancels (UC05)
  BOOKED --&gt; DONE : doctor writes the result (UC09)
  CANCELLED --&gt; [*]
}
state "Invoice" as IN {
  [*] --&gt; UNPAID : receptionist creates it (UC11)\\nonly when the visit is DONE
  UNPAID --&gt; PAID : sandbox payment (UC07, A.5)
  PAID --&gt; [*]
}
DONE --&gt; IN : one invoice per visit
@enduml</code></pre></details>
<div class="pitfall">Write rules as <em>testable sentences</em> ("a doctor cannot have two live appointments in the same slot"), not wishes ("the system should be correct"). Each rule then becomes one check in a service class and one request in your demo — ASM.3 shows "double booking refused" as a real 409 response.</div>`,
    `<h2>5. Yêu cầu 1.2 — chức năng nghiệp vụ, kèm luật</h2>
<p><strong>Chức năng</strong> là thứ tác nhân đạt được ("đặt lịch khám"), không phải một màn hình ("trang đặt lịch"). Đặt cho mỗi chức năng một mã, một tác nhân, các luật mà hệ thống cưỡng chế, và chỗ nó nằm — cột cuối chính là kế hoạch URL cho ASM.2.</p>
<table>
<thead><tr><th>Mã</th><th>Chức năng</th><th>Tác nhân</th><th>Luật nghiệp vụ (server cưỡng chế)</th><th>URL</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>UC01</td><td>Xem chuyên khoa, bác sĩ</td><td>Khách</td><td>chỉ bác sĩ đang hoạt động</td><td>GET /</td><td>ASM.2</td></tr>
<tr><td>UC02</td><td>Đăng ký</td><td>Khách</td><td>tên đăng nhập 4–30 ký tự, không trùng; mật khẩu ≥ 8 có chữ và số, lưu dạng băm; điện thoại 10 số</td><td>/register</td><td>ASM.4</td></tr>
<tr><td>UC03</td><td>Đăng nhập / đăng xuất</td><td>tất cả</td><td>một thông báo chung cho "sai tên" và "sai mật khẩu"; đổi session id sau đăng nhập; đăng xuất bằng POST</td><td>/login, /logout</td><td>ASM.4</td></tr>
<tr><td>UC04</td><td>Đặt lịch khám</td><td>Bệnh nhân</td><td>từ ngày mai tới 30 ngày sau; khung 30 phút; dịch vụ thuộc chuyên khoa của bác sĩ; không trùng giờ của bác sĩ lẫn của bệnh nhân</td><td>/patient/appointments/new, /create</td><td>ASM.3</td></tr>
<tr><td>UC05</td><td>Xem / huỷ lịch của tôi</td><td>Bệnh nhân</td><td>chỉ lịch của mình; chỉ huỷ khi còn BOOKED</td><td>/patient/appointments, /view, /cancel</td><td>ASM.3, ASM.4</td></tr>
<tr><td>UC06</td><td>Xem hoá đơn của tôi</td><td>Bệnh nhân</td><td>chỉ của mình</td><td>/patient/invoices</td><td>ASM.3</td></tr>
<tr><td>UC07</td><td>Thanh toán hoá đơn (sandbox)</td><td>Bệnh nhân</td><td>chỉ UNPAID, chỉ của mình, đánh dấu PAID đúng một lần</td><td>/patient/invoices/…</td><td>ASM.5</td></tr>
<tr><td>UC08</td><td>Xem lịch khám một ngày</td><td>Bác sĩ</td><td>chỉ lịch của mình</td><td>/doctor/schedule</td><td>ASM.4</td></tr>
<tr><td>UC09</td><td>Ghi kết quả khám</td><td>Bác sĩ</td><td>chỉ lịch của mình, chỉ khi còn BOOKED; chẩn đoán bắt buộc ⇒ DONE</td><td>/doctor/appointments/result</td><td>ASM.4</td></tr>
<tr><td>UC10</td><td>Tìm mọi lịch khám</td><td>Lễ tân, Admin</td><td>tìm theo tên, lọc theo trạng thái/ngày, 5 dòng mỗi trang</td><td>/reception/appointments</td><td>ASM.3</td></tr>
<tr><td>UC11</td><td>Lập hoá đơn</td><td>Lễ tân, Admin</td><td>chỉ cho lượt khám DONE, một lần; số tiền = giá dịch vụ trong CSDL</td><td>/reception/invoices/create</td><td>ASM.3</td></tr>
<tr><td>UC12</td><td>Quản lý dịch vụ (CRUD)</td><td>Admin</td><td>tên không trùng; giá nguyên &gt; 0; dịch vụ đã dùng thì không xoá được</td><td>/admin/services</td><td>ASM.3</td></tr>
<tr><td>UC13</td><td>Quản lý bác sĩ, chuyên khoa</td><td>Admin</td><td>cùng khuôn với UC12 (bài tập)</td><td>/admin/doctors…</td><td>bài tập ASM.3</td></tr>
<tr><td>UC14</td><td>Báo cáo doanh thu</td><td>Admin</td><td>chỉ tính hoá đơn PAID</td><td>/admin/reports</td><td>ASM.6</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/fa3b5d39320c8ac4eadee6cc5ea1714491aab7a5.svg" alt="Hai cột trạng thái gánh cả nghiệp vụ: lịch khám BOOKED → DONE hoặc CANCELLED, hoá đơn UNPAID → PAID" loading="lazy" /><p class="chu-thich">🧩 Hai cột trạng thái gánh cả nghiệp vụ: lịch khám BOOKED → DONE hoặc CANCELLED, hoá đơn UNPAID → PAID</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Life of an appointment and of its invoice (the status columns of the database)
state "Appointment" as AP {
  [*] --&gt; BOOKED : patient books (UC04)
  BOOKED --&gt; CANCELLED : patient cancels (UC05)
  BOOKED --&gt; DONE : doctor writes the result (UC09)
  CANCELLED --&gt; [*]
}
state "Invoice" as IN {
  [*] --&gt; UNPAID : receptionist creates it (UC11)\\nonly when the visit is DONE
  UNPAID --&gt; PAID : sandbox payment (UC07, A.5)
  PAID --&gt; [*]
}
DONE --&gt; IN : one invoice per visit
@enduml</code></pre></details>
<div class="pitfall">Viết luật thành <em>câu kiểm chứng được</em> ("một bác sĩ không thể có hai lịch còn hiệu lực trong cùng một khung giờ"), không phải mong muốn ("hệ thống phải chạy đúng"). Khi đó mỗi luật thành một phép kiểm trong lớp service và một request trong buổi demo — ASM.3 cho xem "đặt trùng giờ bị từ chối" bằng một response 409 thật.</div>`),
    bi(`<h2>6. Your topic → actors and entities (all 10 topics)</h2>
<p>Every topic has the same skeleton: <strong>a catalogue</strong> the admin manages, <strong>one central transaction</strong> a customer creates (here: the appointment), <strong>a capacity rule</strong> that must never be broken (here: one patient per doctor per slot), <strong>an owner rule</strong> for 1.9, and <strong>an invoice</strong> for 1.10. Find yours:</p>
<table>
<thead><tr><th>#</th><th>Topic</th><th>Actors</th><th>Catalogue (admin)</th><th>Central transaction</th><th>Rule that must never break</th><th>Owner rule (1.9)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Car rental shop</td><td>Customer, Counter staff, Manager, Admin</td><td>car types, cars, prices per day</td><td>rental contract</td><td>a car is never rented twice in overlapping dates</td><td>a customer sees only his contracts</td></tr>
<tr><td>2</td><td>Student boarding house</td><td>Tenant, Landlord/Manager, Admin</td><td>rooms, room types, utility prices</td><td>lease contract + monthly bill</td><td>a room never exceeds its capacity / one active lease per bed</td><td>a tenant sees only his room's bills</td></tr>
<tr><td>3</td><td>Gym</td><td>Member, Trainer (PT), Receptionist, Admin</td><td>packages, classes</td><td>membership + PT session booking</td><td>a trainer never has two sessions at once</td><td>a trainer edits only his members' sessions</td></tr>
<tr><td>4</td><td>Car garage</td><td>Customer, Service advisor, Mechanic, Admin</td><td>services, spare parts</td><td>repair order</td><td>a repair bay/mechanic is never double-booked; stock never negative</td><td>a mechanic updates only the orders assigned to him</td></tr>
<tr><td>5</td><td>Repair shop (motorbikes)</td><td>Customer, Mechanic, Cashier, Owner</td><td>services, parts in stock</td><td>intake ticket</td><td>parts stock never below 0</td><td>a customer sees only his tickets</td></tr>
<tr><td>6</td><td>Event ticketing</td><td>Buyer, Organiser, Gate staff, Admin</td><td>events, ticket types, seats</td><td>ticket order</td><td>never sell more than the seats; one seat one ticket</td><td>gate staff check only their event; buyers see only their tickets</td></tr>
<tr><td>7</td><td>Travel tours</td><td>Customer, Tour guide, Operator, Admin</td><td>tours, departures</td><td>booking</td><td>never exceed seats of a departure</td><td>a guide sees only his group</td></tr>
<tr><td>8</td><td>Clinic (this sample)</td><td>Patient, Doctor, Receptionist, Admin</td><td>specialties, doctors, services</td><td>appointment</td><td>one live appointment per doctor per slot</td><td>patient: own appointments; doctor: own visits</td></tr>
<tr><td>9</td><td>Pharmacy counter</td><td>Customer, Pharmacist, Stock keeper, Admin</td><td>medicines, batches with expiry date</td><td>sale order + goods receipt</td><td>never sell beyond stock or an expired batch</td><td>a pharmacist edits only orders he created</td></tr>
<tr><td>10</td><td>Sports pitch rental</td><td>Customer, Pitch staff, Owner, Admin</td><td>pitches, time slots, prices</td><td>pitch booking</td><td>a pitch never booked twice in a slot (closest to the clinic!)</td><td>a customer cancels only his bookings</td></tr>
</tbody>
</table>
<p>The translation is mechanical: <code>Doctor</code> → your resource (car, room, trainer, pitch), <code>Appointment</code> → your transaction, <code>UX_Appointment_Doctor_Slot</code> → your "never break" rule as a UNIQUE index or a CHECK + transaction, <code>OwnershipFilter</code> → your owner rule.</p>`,
    `<h2>6. Đề tài của bạn → tác nhân và thực thể (đủ 10 đề tài)</h2>
<p>Đề tài nào cũng cùng một bộ xương: <strong>một danh mục</strong> admin quản lý, <strong>một giao dịch trung tâm</strong> khách hàng tạo ra (ở đây: lịch khám), <strong>một luật sức chứa</strong> không bao giờ được phá (ở đây: mỗi bác sĩ mỗi khung giờ một bệnh nhân), <strong>một luật chủ sở hữu</strong> cho 1.9, và <strong>một hoá đơn</strong> cho 1.10. Tìm dòng của bạn:</p>
<table>
<thead><tr><th>#</th><th>Đề tài</th><th>Tác nhân</th><th>Danh mục (admin)</th><th>Giao dịch trung tâm</th><th>Luật không bao giờ được phá</th><th>Luật chủ sở hữu (1.9)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Cửa hàng cho thuê xe</td><td>Khách, NV quầy, Quản lý, Admin</td><td>loại xe, xe, giá theo ngày</td><td>hợp đồng thuê</td><td>một xe không bị cho thuê hai lần trong khoảng ngày chồng nhau</td><td>khách chỉ xem hợp đồng của mình</td></tr>
<tr><td>2</td><td>Nhà trọ sinh viên</td><td>Người thuê, Chủ trọ/Quản lý, Admin</td><td>phòng, loại phòng, giá điện nước</td><td>hợp đồng thuê + hoá đơn tháng</td><td>phòng không vượt sức chứa / một giường một hợp đồng hiệu lực</td><td>người thuê chỉ xem hoá đơn phòng mình</td></tr>
<tr><td>3</td><td>Phòng gym</td><td>Hội viên, Huấn luyện viên (PT), Lễ tân, Admin</td><td>gói tập, lớp</td><td>thẻ hội viên + đặt buổi PT</td><td>một HLV không có hai buổi cùng giờ</td><td>HLV chỉ sửa buổi của học viên mình</td></tr>
<tr><td>4</td><td>Gara ô tô</td><td>Khách, Cố vấn dịch vụ, Kỹ thuật viên, Admin</td><td>dịch vụ, phụ tùng</td><td>phiếu sửa chữa</td><td>khoang sửa/KTV không bị đặt trùng; tồn kho không âm</td><td>KTV chỉ cập nhật phiếu được giao</td></tr>
<tr><td>5</td><td>Cửa hàng sửa chữa xe (máy)</td><td>Khách, Thợ, Thu ngân, Chủ</td><td>dịch vụ, phụ tùng tồn kho</td><td>phiếu nhận xe</td><td>tồn phụ tùng không bao giờ dưới 0</td><td>khách chỉ xem phiếu của mình</td></tr>
<tr><td>6</td><td>Bán vé sự kiện</td><td>Người mua, Ban tổ chức, NV soát vé, Admin</td><td>sự kiện, loại vé, ghế</td><td>đơn mua vé</td><td>không bán quá số ghế; một ghế một vé</td><td>NV soát vé chỉ ở sự kiện được phân; người mua chỉ xem vé mình</td></tr>
<tr><td>7</td><td>Tour du lịch</td><td>Khách, Hướng dẫn viên, NV điều hành, Admin</td><td>tour, lịch khởi hành</td><td>đặt tour</td><td>không vượt số chỗ của một chuyến</td><td>HDV chỉ xem đoàn của mình</td></tr>
<tr><td>8</td><td>Phòng khám (bản mẫu này)</td><td>Bệnh nhân, Bác sĩ, Lễ tân, Admin</td><td>chuyên khoa, bác sĩ, dịch vụ</td><td>lịch khám</td><td>mỗi bác sĩ mỗi khung giờ một lịch còn hiệu lực</td><td>bệnh nhân: lịch của mình; bác sĩ: lượt khám của mình</td></tr>
<tr><td>9</td><td>Quầy thuốc</td><td>Khách, Dược sĩ, Thủ kho, Admin</td><td>thuốc, lô thuốc có hạn dùng</td><td>đơn bán + phiếu nhập</td><td>không bán quá tồn hoặc lô đã hết hạn</td><td>dược sĩ chỉ sửa đơn mình lập</td></tr>
<tr><td>10</td><td>Sân tập thể thao</td><td>Khách, NV sân, Chủ sân, Admin</td><td>sân, khung giờ, bảng giá</td><td>đặt sân</td><td>một sân không bị đặt hai lần trong một khung giờ (giống phòng khám nhất!)</td><td>khách chỉ huỷ lượt đặt của mình</td></tr>
</tbody>
</table>
<p>Phép quy đổi là cơ học: <code>Doctor</code> → tài nguyên của bạn (xe, phòng, HLV, sân), <code>Appointment</code> → giao dịch của bạn, <code>UX_Appointment_Doctor_Slot</code> → luật "không bao giờ phá" thành chỉ mục UNIQUE hoặc CHECK + transaction, <code>OwnershipFilter</code> → luật chủ sở hữu của bạn.</p>`),
    bi(`<h2>7. Splitting the work in a team of 4–5 — by function, not by layer</h2>
<p>The tempting split "A does the database, B the DAOs, C the servlets, D the JSPs" fails every time: nobody can test anything until week 4, and in the viva nobody can explain a whole feature. Split <strong>vertically</strong>: each member owns a few use cases <em>from table to page</em> (SQL → model → DAO → service → servlet → JSP), plus one shared piece.</p>
<table>
<thead><tr><th>Member</th><th>Owns (use cases)</th><th>Shared piece</th><th>Clinic files (ASM.2–ASM.4)</th></tr></thead>
<tbody>
<tr><td>1 — team lead</td><td>UC02, UC03 (register, login, logout)</td><td>layout + Bootstrap, the two filters, Git, merging</td><td>AuthService, LoginController, filter/*, _top.jspf</td></tr>
<tr><td>2</td><td>UC12, UC13 (services, doctors, specialties CRUD)</td><td>the pager custom tag</td><td>AdminServiceController, CatalogDAO, CatalogService, PagerTag</td></tr>
<tr><td>3</td><td>UC01, UC04, UC05 (home, booking, my appointments)</td><td>the database script</td><td>BookingService, PatientAppointmentController, setup.sql</td></tr>
<tr><td>4</td><td>UC08, UC09 (doctor's day, results)</td><td>the status badge tag file</td><td>DoctorScheduleController, DoctorResultController, statusBadge.tag</td></tr>
<tr><td>5</td><td>UC10, UC11, UC07, UC14 (reception, invoices, payment, report)</td><td>the report document</td><td>ReceptionAppointmentController, InvoiceService, payment (ASM.5)</td></tr>
</tbody>
</table>
<p>With 4 members, member 4 also takes member 2's doctors/specialties (UC13). Put the table in the report with real names — the brief explicitly asks for "a clear split of tasks per member" — and make sure the Git history agrees with it (ASM.2).</p>`,
    `<h2>7. Chia việc nhóm 4–5 người — theo chức năng, không theo tầng</h2>
<p>Cách chia hấp dẫn "A làm CSDL, B làm DAO, C làm servlet, D làm JSP" lần nào cũng hỏng: tới tuần 4 vẫn không ai thử được gì, và lúc bảo vệ không ai giải thích nổi trọn một tính năng. Chia <strong>theo chiều dọc</strong>: mỗi thành viên sở hữu vài use case <em>từ bảng tới trang</em> (SQL → model → DAO → service → servlet → JSP), cộng thêm một mảnh dùng chung.</p>
<table>
<thead><tr><th>Thành viên</th><th>Sở hữu (use case)</th><th>Mảnh dùng chung</th><th>File của phòng khám (ASM.2–ASM.4)</th></tr></thead>
<tbody>
<tr><td>1 — nhóm trưởng</td><td>UC02, UC03 (đăng ký, đăng nhập, đăng xuất)</td><td>layout + Bootstrap, hai filter, Git, ghép code</td><td>AuthService, LoginController, filter/*, _top.jspf</td></tr>
<tr><td>2</td><td>UC12, UC13 (CRUD dịch vụ, bác sĩ, chuyên khoa)</td><td>custom tag phân trang</td><td>AdminServiceController, CatalogDAO, CatalogService, PagerTag</td></tr>
<tr><td>3</td><td>UC01, UC04, UC05 (trang chủ, đặt lịch, lịch của tôi)</td><td>script CSDL</td><td>BookingService, PatientAppointmentController, setup.sql</td></tr>
<tr><td>4</td><td>UC08, UC09 (lịch ngày của bác sĩ, ghi kết quả)</td><td>tag file nhãn trạng thái</td><td>DoctorScheduleController, DoctorResultController, statusBadge.tag</td></tr>
<tr><td>5</td><td>UC10, UC11, UC07, UC14 (tiếp đón, hoá đơn, thanh toán, báo cáo)</td><td>tài liệu báo cáo</td><td>ReceptionAppointmentController, InvoiceService, thanh toán (ASM.5)</td></tr>
</tbody>
</table>
<p>Nhóm 4 người thì thành viên 4 nhận thêm phần bác sĩ/chuyên khoa (UC13) của thành viên 2. Đưa bảng này vào báo cáo kèm tên thật — đề ghi rõ "phân công rõ ràng nhiệm vụ cho từng thành viên" — và để lịch sử Git nói đúng như vậy (ASM.2).</p>`),
    bi(`<h2>8. A 5-week plan</h2>
<table>
<thead><tr><th>Week</th><th>Goal (end of week)</th><th>Deliverable you can show</th></tr></thead>
<tbody>
<tr><td>1</td><td>analysis done: actors, functions, rules, screens sketched; topic table of section 6 filled</td><td>report chapter 1 + use-case diagram</td></tr>
<tr><td>2</td><td>database script + empty MVC project running on everyone's machine; Git repo with branches</td><td>ERD, setup.sql, home page from the database (ASM.2)</td></tr>
<tr><td>3</td><td>every member's main use case works end to end (one table → one page)</td><td>CRUD + search + paging + the central transaction (ASM.3)</td></tr>
<tr><td>4</td><td>login, the two filters, 403/404 pages, Bootstrap polish on phone width; sandbox payment</td><td>IDOR attempts refused (ASM.4), payment round trip (ASM.5)</td></tr>
<tr><td>5</td><td>freeze features; test script, screenshots, report, rehearse the demo twice</td><td>report + slides + a clean demo database (ASM.6)</td></tr>
</tbody>
</table>
<p>Rule of thumb: whatever is not working at the end of week 4 is cut from the demo, not "finished the night before". A short demo where every click works beats a long one that crashes once.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): this lesson does not change with the framework. LabFlow's SRS starts with the same actor table and use cases, and the same vertical split (one member = one feature from entity to React page) is how teams of the capstone avoid the "API done, UI not started" trap.</div>`,
    `<h2>8. Kế hoạch 5 tuần</h2>
<table>
<thead><tr><th>Tuần</th><th>Mục tiêu (cuối tuần)</th><th>Sản phẩm cho xem được</th></tr></thead>
<tbody>
<tr><td>1</td><td>xong phân tích: tác nhân, chức năng, luật, phác màn hình; điền xong dòng đề tài ở mục 6</td><td>chương 1 báo cáo + sơ đồ use case</td></tr>
<tr><td>2</td><td>script CSDL + project MVC rỗng chạy được trên máy mọi người; repo Git có nhánh</td><td>ERD, setup.sql, trang chủ lấy từ CSDL (ASM.2)</td></tr>
<tr><td>3</td><td>use case chính của mỗi thành viên chạy trọn vòng (một bảng → một trang)</td><td>CRUD + tìm kiếm + phân trang + giao dịch trung tâm (ASM.3)</td></tr>
<tr><td>4</td><td>đăng nhập, hai filter, trang 403/404, chỉnh Bootstrap trên bề ngang điện thoại; thanh toán sandbox</td><td>thử IDOR bị chặn (ASM.4), thanh toán đi–về (ASM.5)</td></tr>
<tr><td>5</td><td>đóng băng tính năng; kịch bản kiểm thử, ảnh chụp, báo cáo, tập demo hai lần</td><td>báo cáo + slide + CSDL demo sạch (ASM.6)</td></tr>
</tbody>
</table>
<p>Quy tắc kinh nghiệm: thứ gì cuối tuần 4 chưa chạy thì cắt khỏi buổi demo, không "làm nốt đêm trước". Một buổi demo ngắn mà cú bấm nào cũng chạy thắng một buổi dài mà sập một lần.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): bài này không đổi theo framework. SRS của LabFlow cũng mở đầu bằng đúng bảng tác nhân và use case, và cách chia dọc (một người = một tính năng từ entity tới trang React) là cách các nhóm đồ án tránh cái bẫy "API xong rồi, giao diện chưa bắt đầu".</div>`),
    bi(`<h2>🧪 Do it now for YOUR topic (45 minutes)</h2>
<ol>
<li>Copy the actor table of section 4 and rewrite every row for your topic. Add an actor only if it has a page of its own.</li>
<li>Write 10–14 functions with codes, actors and at least one testable rule each.</li>
<li>Draw the use-case diagram (paste the PlantUML of this lesson into plantuml.com and rename).</li>
<li>Name your "never break" rule and your owner rule in one sentence each — you will turn them into a UNIQUE index (ASM.2) and a filter (ASM.4).</li>
</ol>
<p class="dap-an">✅ Self-check: every function has an actor; every actor except Guest has at least one function only they can do; at least one rule mentions a <em>number</em> (dates, capacity, money); the owner rule names which column proves ownership (here <code>Appointment.patientId</code> / <code>doctorId</code>).</p>`,
    `<h2>🧪 Làm ngay cho đề tài CỦA BẠN (45 phút)</h2>
<ol>
<li>Chép bảng tác nhân ở mục 4 và viết lại từng dòng cho đề tài của bạn. Chỉ thêm tác nhân nếu nó có trang riêng.</li>
<li>Viết 10–14 chức năng có mã, tác nhân và mỗi chức năng ít nhất một luật kiểm chứng được.</li>
<li>Vẽ sơ đồ use case (dán mã PlantUML của bài này vào plantuml.com rồi đổi tên).</li>
<li>Gọi tên luật "không bao giờ phá" và luật chủ sở hữu, mỗi luật một câu — bạn sẽ biến chúng thành chỉ mục UNIQUE (ASM.2) và một filter (ASM.4).</li>
</ol>
<p class="dap-an">✅ Tự kiểm: chức năng nào cũng có tác nhân; tác nhân nào (trừ Khách) cũng có ít nhất một chức năng chỉ họ làm được; ít nhất một luật có <em>con số</em> (ngày, sức chứa, tiền); luật chủ sở hữu nói rõ cột nào chứng minh quyền sở hữu (ở đây là <code>Appointment.patientId</code> / <code>doctorId</code>).</p>`),
  ].join('\n'),
};

/* ───────── ASM.2 — 🧭 Assignment A–Z (2/6): SQL Server database design and the MVC project skeleton ───────── */
const L_x_asm_2 = {
  title: 'ASM.2 — 🧭 Assignment A–Z (2/6): SQL Server database design and the MVC project skeleton|||ASM.2 — 🧭 Assignment A–Z (2/6): thiết kế CSDL SQL Server và khung project MVC',
  slug: 'prj301-asm-2',
  type: 'VIDEO',
  description: 'Bài tự thêm, chuỗi Assignment PRJ301 mẫu Quản lý phòng khám: biến tác nhân và chức năng thành bảng (ERD), script SQL Server đầy đủ khoá chính, khoá ngoại, UNIQUE, CHECK, chỉ mục duy nhất có lọc chống trùng giờ, dữ liệu mẫu tiếng Việt NVARCHAR, chạy lại được; cấu trúc project NetBeans/Maven theo MVC (model, dal, service, controller, filter, tags, util, JSP dưới WEB-INF), pom.xml, DBContext đọc biến môi trường, lát cắt dọc đầu tiên chạy thật, quy ước đặt tên và Git cho nhóm.',
  content: [
    bi(`<span class="eyebrow">🧭 Course Assignment A–Z · 2/6 · added by this site</span>
<h2>From "who does what" to tables, folders and a first page that comes from the database</h2>
<p class="lead">Lesson ASM.1 ended with actors, functions and two sentences: the rule that must never break and the owner rule. Today both become <em>database objects</em>, and the empty project gets the folder layout that MVC (requirement 1.3) needs. At the end, one vertical slice runs for real: SQL Server → DAO → servlet → JSP → browser.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b9818c0ce7e08ff9997ba3f7a521993b62522001.svg" alt="The shape of the whole project: every request crosses the same layers" loading="lazy" /><p class="chu-thich">🧩 The shape of the whole project: every request crosses the same layers</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title One request through the MVC project: filters → controller → service → DAO → SQL Server, then a JSP view
set separator none
skinparam componentStyle rectangle
actor "Trình duyệt" as B
package "filter" {
  [AuthorizationFilter\\n(role)] as F1
  [OwnershipFilter\\n(business rule, IDOR)] as F2
}
package "controller (Servlet)" {
  [PatientAppointmentController\\nDoctorResultController\\nAdminServiceController…] as C
}
package "service" {
  [BookingService\\nAuthService\\nInvoiceService…] as S
}
package "dal" {
  [AppointmentDAO\\nCatalogDAO\\nAccountDAO…] as DAO
  [DBContext] as DBC
}
package "model" {
  [Appointment, Doctor,\\nPage&lt;T&gt;, BookingForm…] as M
}
package "WEB-INF/views (JSP + JSTL + custom tags)" {
  [booking-form.jsp\\nappointments.jsp…] as V
  [pk:pager · ui:statusBadge] as T
}
database "SQL Server\\nPRJ301_PhongKham" as DB
B --&gt; F1 : HTTP request
F1 --&gt; F2 : chain.doFilter
F2 --&gt; C
C --&gt; S : form / id
S --&gt; DAO
DAO --&gt; DBC
DBC --&gt; DB : JDBC\\nPreparedStatement
DAO ..&gt; M : creates
C --&gt; V : setAttribute + forward
V --&gt; T
V ..&gt; M : reads (EL)
V --&gt; B : HTML (Bootstrap 5)
@enduml</code></pre></details>`,
    `<span class="eyebrow">🧭 Assignment A–Z · 2/6 · phần web tự thêm</span>
<h2>Từ "ai làm gì" tới bảng, thư mục và trang đầu tiên lấy dữ liệu từ CSDL</h2>
<p class="lead">Bài ASM.1 kết thúc với tác nhân, chức năng và hai câu: luật không bao giờ được phá và luật chủ sở hữu. Hôm nay cả hai thành <em>đối tượng trong CSDL</em>, và project rỗng có được bố cục thư mục mà MVC (yêu cầu 1.3) cần. Cuối bài, một lát cắt dọc chạy thật: SQL Server → DAO → servlet → JSP → trình duyệt.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b9818c0ce7e08ff9997ba3f7a521993b62522001.svg" alt="Hình dạng của cả project: request nào cũng đi qua đúng các tầng này" loading="lazy" /><p class="chu-thich">🧩 Hình dạng của cả project: request nào cũng đi qua đúng các tầng này</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title One request through the MVC project: filters → controller → service → DAO → SQL Server, then a JSP view
set separator none
skinparam componentStyle rectangle
actor "Trình duyệt" as B
package "filter" {
  [AuthorizationFilter\\n(role)] as F1
  [OwnershipFilter\\n(business rule, IDOR)] as F2
}
package "controller (Servlet)" {
  [PatientAppointmentController\\nDoctorResultController\\nAdminServiceController…] as C
}
package "service" {
  [BookingService\\nAuthService\\nInvoiceService…] as S
}
package "dal" {
  [AppointmentDAO\\nCatalogDAO\\nAccountDAO…] as DAO
  [DBContext] as DBC
}
package "model" {
  [Appointment, Doctor,\\nPage&lt;T&gt;, BookingForm…] as M
}
package "WEB-INF/views (JSP + JSTL + custom tags)" {
  [booking-form.jsp\\nappointments.jsp…] as V
  [pk:pager · ui:statusBadge] as T
}
database "SQL Server\\nPRJ301_PhongKham" as DB
B --&gt; F1 : HTTP request
F1 --&gt; F2 : chain.doFilter
F2 --&gt; C
C --&gt; S : form / id
S --&gt; DAO
DAO --&gt; DBC
DBC --&gt; DB : JDBC\\nPreparedStatement
DAO ..&gt; M : creates
C --&gt; V : setAttribute + forward
V --&gt; T
V ..&gt; M : reads (EL)
V --&gt; B : HTML (Bootstrap 5)
@enduml</code></pre></details>`),
    bi(`<h2>1. From the analysis to tables — five mechanical rules</h2>
<ol>
<li><strong>Every actor that logs in ⇒ one row in ONE <code>Account</code> table</strong> with a <code>role</code> column. Do not make <code>PatientLogin</code> and <code>DoctorLogin</code>: you would need two login pages and two filters.</li>
<li><strong>Data that only one kind of account has ⇒ a 1–1 table</strong> whose primary key is also the foreign key to <code>Account</code> (<code>Doctor.doctorId</code>, <code>Patient.patientId</code>). The doctor's room and specialty never sit on a patient row.</li>
<li><strong>The admin's catalogue ⇒ small tables</strong> (<code>Specialty</code>, <code>MedicalService</code>) with UNIQUE names.</li>
<li><strong>The central transaction ⇒ one table with foreign keys to everybody involved</strong> + a <code>status</code> column (<code>Appointment</code>). The state diagram of ASM.1 becomes a CHECK.</li>
<li><strong>Money ⇒ its own table</strong> (<code>Invoice</code>), one row per transaction, ready for the sandbox payment of ASM.5 (<code>paidAt</code>, <code>paymentRef</code>).</li>
</ol>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/95e285cf0692752097e40212d258448f5c649018.svg" alt="ERD of PRJ301_PhongKham (crow's foot notation): 7 tables" loading="lazy" /><p class="chu-thich">🧩 ERD of PRJ301_PhongKham (crow's foot notation): 7 tables</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PRJ301_PhongKham: 7 tables (crow's foot), keys and the rules the database enforces
hide circle
hide methods
entity "Account" as AC {
  * accountId : int &lt;&lt;PK, identity&gt;&gt;
  --
  * username : varchar(30) &lt;&lt;UNIQUE&gt;&gt;
  * passwordHash : varchar(200)
  * fullName : nvarchar(100)
  phone : varchar(15)
  * role : varchar(12) &lt;&lt;CHECK: 4 roles&gt;&gt;
  * active : bit
}
entity "Patient" as PA {
  * patientId : int &lt;&lt;PK, FK Account&gt;&gt;
  --
  dateOfBirth : date
}
entity "Doctor" as DO {
  * doctorId : int &lt;&lt;PK, FK Account&gt;&gt;
  --
  * specialtyId : int &lt;&lt;FK&gt;&gt;
  * room : nvarchar(20)
}
entity "Specialty" as SP {
  * specialtyId : int &lt;&lt;PK&gt;&gt;
  --
  * name : nvarchar(100) &lt;&lt;UNIQUE&gt;&gt;
}
entity "MedicalService" as MS {
  * serviceId : int &lt;&lt;PK&gt;&gt;
  --
  * name : nvarchar(100) &lt;&lt;UNIQUE&gt;&gt;
  * price : decimal(12,0) &lt;&lt;CHECK positive&gt;&gt;
  * specialtyId : int &lt;&lt;FK&gt;&gt;
}
entity "Appointment" as AP {
  * appointmentId : int &lt;&lt;PK&gt;&gt;
  --
  * patientId : int &lt;&lt;FK&gt;&gt;
  * doctorId : int &lt;&lt;FK&gt;&gt;
  * serviceId : int &lt;&lt;FK&gt;&gt;
  * apptDate : date
  * apptTime : time(0)
  * status : BOOKED / DONE / CANCELLED
  reason, diagnosis, prescription
}
entity "Invoice" as IN {
  * invoiceId : int &lt;&lt;PK&gt;&gt;
  --
  * appointmentId : int &lt;&lt;FK, UNIQUE&gt;&gt;
  * amount : decimal(12,0)
  * status : UNPAID / PAID
  paidAt, paymentRef (A.5)
}
AC ||--o| PA
AC ||--o| DO
SP ||--o{ DO
SP ||--o{ MS
PA ||--o{ AP
DO ||--o{ AP
MS ||--o{ AP
AP ||--o| IN
note bottom of AP
  UNIQUE (doctorId, apptDate, apptTime)
  WHERE status &lt;&gt; 'CANCELLED'
  (and the same for patientId)
end note
@enduml</code></pre></details>
<p>Read the crow's feet aloud — markers ask it: "one Specialty has zero or many Doctors", "one Appointment has zero or one Invoice". The note under <code>Appointment</code> is the rule that must never break, written as an index — section 3 explains it.</p>`,
    `<h2>1. Từ phân tích tới bảng — năm quy tắc cơ học</h2>
<ol>
<li><strong>Mọi tác nhân có đăng nhập ⇒ một dòng trong MỘT bảng <code>Account</code></strong> có cột <code>role</code>. Đừng tạo <code>PatientLogin</code> và <code>DoctorLogin</code>: bạn sẽ cần hai trang đăng nhập và hai filter.</li>
<li><strong>Dữ liệu chỉ một loại tài khoản có ⇒ một bảng 1–1</strong> mà khoá chính đồng thời là khoá ngoại trỏ về <code>Account</code> (<code>Doctor.doctorId</code>, <code>Patient.patientId</code>). Phòng khám và chuyên khoa của bác sĩ không bao giờ nằm trên dòng của bệnh nhân.</li>
<li><strong>Danh mục của admin ⇒ các bảng nhỏ</strong> (<code>Specialty</code>, <code>MedicalService</code>) có tên UNIQUE.</li>
<li><strong>Giao dịch trung tâm ⇒ một bảng có khoá ngoại tới mọi bên liên quan</strong> + một cột <code>status</code> (<code>Appointment</code>). Sơ đồ trạng thái của ASM.1 thành một ràng buộc CHECK.</li>
<li><strong>Tiền ⇒ bảng riêng</strong> (<code>Invoice</code>), mỗi giao dịch một dòng, sẵn sàng cho thanh toán sandbox ở ASM.5 (<code>paidAt</code>, <code>paymentRef</code>).</li>
</ol>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/95e285cf0692752097e40212d258448f5c649018.svg" alt="ERD của PRJ301_PhongKham (ký hiệu chân chim): 7 bảng" loading="lazy" /><p class="chu-thich">🧩 ERD của PRJ301_PhongKham (ký hiệu chân chim): 7 bảng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PRJ301_PhongKham: 7 tables (crow's foot), keys and the rules the database enforces
hide circle
hide methods
entity "Account" as AC {
  * accountId : int &lt;&lt;PK, identity&gt;&gt;
  --
  * username : varchar(30) &lt;&lt;UNIQUE&gt;&gt;
  * passwordHash : varchar(200)
  * fullName : nvarchar(100)
  phone : varchar(15)
  * role : varchar(12) &lt;&lt;CHECK: 4 roles&gt;&gt;
  * active : bit
}
entity "Patient" as PA {
  * patientId : int &lt;&lt;PK, FK Account&gt;&gt;
  --
  dateOfBirth : date
}
entity "Doctor" as DO {
  * doctorId : int &lt;&lt;PK, FK Account&gt;&gt;
  --
  * specialtyId : int &lt;&lt;FK&gt;&gt;
  * room : nvarchar(20)
}
entity "Specialty" as SP {
  * specialtyId : int &lt;&lt;PK&gt;&gt;
  --
  * name : nvarchar(100) &lt;&lt;UNIQUE&gt;&gt;
}
entity "MedicalService" as MS {
  * serviceId : int &lt;&lt;PK&gt;&gt;
  --
  * name : nvarchar(100) &lt;&lt;UNIQUE&gt;&gt;
  * price : decimal(12,0) &lt;&lt;CHECK positive&gt;&gt;
  * specialtyId : int &lt;&lt;FK&gt;&gt;
}
entity "Appointment" as AP {
  * appointmentId : int &lt;&lt;PK&gt;&gt;
  --
  * patientId : int &lt;&lt;FK&gt;&gt;
  * doctorId : int &lt;&lt;FK&gt;&gt;
  * serviceId : int &lt;&lt;FK&gt;&gt;
  * apptDate : date
  * apptTime : time(0)
  * status : BOOKED / DONE / CANCELLED
  reason, diagnosis, prescription
}
entity "Invoice" as IN {
  * invoiceId : int &lt;&lt;PK&gt;&gt;
  --
  * appointmentId : int &lt;&lt;FK, UNIQUE&gt;&gt;
  * amount : decimal(12,0)
  * status : UNPAID / PAID
  paidAt, paymentRef (A.5)
}
AC ||--o| PA
AC ||--o| DO
SP ||--o{ DO
SP ||--o{ MS
PA ||--o{ AP
DO ||--o{ AP
MS ||--o{ AP
AP ||--o| IN
note bottom of AP
  UNIQUE (doctorId, apptDate, apptTime)
  WHERE status &lt;&gt; 'CANCELLED'
  (and the same for patientId)
end note
@enduml</code></pre></details>
<p>Đọc to các "chân chim" — người chấm hay hỏi: "một Specialty có không hoặc nhiều Doctor", "một Appointment có không hoặc một Invoice". Ghi chú dưới <code>Appointment</code> chính là luật không bao giờ được phá, viết thành một chỉ mục — mục 3 giải thích.</p>`),
    bi(`<h2>2. The script, part by part</h2>
<p>One file, <code>setup.sql</code>, creates everything. It must run <strong>again and again</strong> without errors — you will rerun it before every demo to get clean data. So it starts by dropping the database if it exists (<code>SINGLE_USER WITH ROLLBACK IMMEDIATE</code> kicks out the connections NetBeans keeps open):</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">IF DB_ID('PRJ301_PhongKham') IS NOT NULL
BEGIN
    ALTER DATABASE PRJ301_PhongKham SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PRJ301_PhongKham;
END
GO
CREATE DATABASE PRJ301_PhongKham;
GO
USE PRJ301_PhongKham;
GO</code></pre>
<p>The tables. Every constraint has a <strong>name</strong> (<code>UQ_Account_username</code>, <code>CK_Appointment_status</code>…): when the database refuses something, the error message names the rule, and your Java code can recognise it.</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    accountId    INT IDENTITY(1,1) PRIMARY KEY,
    username     VARCHAR(30)   NOT NULL CONSTRAINT UQ_Account_username UNIQUE,
    passwordHash VARCHAR(200)  NOT NULL,                       -- PBKDF2 hash, never the password itself
    fullName     NVARCHAR(100) NOT NULL,
    phone        VARCHAR(15)   NULL,
    role         VARCHAR(12)   NOT NULL CONSTRAINT CK_Account_role CHECK (role IN ('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'ADMIN')),
    active       BIT           NOT NULL CONSTRAINT DF_Account_active DEFAULT 1
);
CREATE TABLE Specialty (
    specialtyId INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100) NOT NULL CONSTRAINT UQ_Specialty_name UNIQUE
);
CREATE TABLE Doctor (                                          -- 1–1 with Account: a doctor IS an account with role DOCTOR
    doctorId    INT PRIMARY KEY CONSTRAINT FK_Doctor_Account REFERENCES Account(accountId),
    specialtyId INT NOT NULL CONSTRAINT FK_Doctor_Specialty REFERENCES Specialty(specialtyId),
    room        NVARCHAR(20) NOT NULL
);
CREATE TABLE Patient (                                         -- 1–1 with Account
    patientId   INT PRIMARY KEY CONSTRAINT FK_Patient_Account REFERENCES Account(accountId),
    dateOfBirth DATE NULL
);
CREATE TABLE MedicalService (
    serviceId   INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100) NOT NULL CONSTRAINT UQ_MedicalService_name UNIQUE,
    price       DECIMAL(12,0) NOT NULL CONSTRAINT CK_MedicalService_price CHECK (price &gt; 0),
    specialtyId INT NOT NULL CONSTRAINT FK_MedicalService_Specialty REFERENCES Specialty(specialtyId)
);
CREATE TABLE Appointment (
    appointmentId INT IDENTITY(1,1) PRIMARY KEY,
    patientId     INT NOT NULL CONSTRAINT FK_Appointment_Patient REFERENCES Patient(patientId),
    doctorId      INT NOT NULL CONSTRAINT FK_Appointment_Doctor  REFERENCES Doctor(doctorId),
    serviceId     INT NOT NULL CONSTRAINT FK_Appointment_Service REFERENCES MedicalService(serviceId),
    apptDate      DATE    NOT NULL,
    apptTime      TIME(0) NOT NULL,
    status        VARCHAR(10) NOT NULL CONSTRAINT DF_Appointment_status DEFAULT 'BOOKED'
                  CONSTRAINT CK_Appointment_status CHECK (status IN ('BOOKED', 'DONE', 'CANCELLED')),
    reason        NVARCHAR(300)  NULL,
    diagnosis     NVARCHAR(500)  NULL,                         -- written by the doctor
    prescription  NVARCHAR(1000) NULL,
    createdAt     DATETIME2(0) NOT NULL CONSTRAINT DF_Appointment_createdAt DEFAULT SYSDATETIME(),
    CONSTRAINT CK_Appointment_result CHECK (status &lt;&gt; 'DONE' OR diagnosis IS NOT NULL)   -- DONE ⇒ has a diagnosis
);</code></pre>
<ul>
<li><code>NVARCHAR</code> for every text a human types in Vietnamese; <code>VARCHAR</code> only for codes you control (username, role, status).</li>
<li><code>DECIMAL(12,0)</code> for đồng — never <code>FLOAT</code>/<code>REAL</code> for money (0.1 + 0.2 is not 0.3 in binary floating point).</li>
<li><code>TIME(0)</code>: a time without fractions of a second; slots are compared with <code>=</code>, so <code>08:30:00.0000001</code> must not exist.</li>
<li><code>CK_Appointment_result</code>: a DONE appointment without a diagnosis is impossible — even if a bug in Java tries.</li>
</ul>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Invoice (                                         -- payment (sandbox) is lesson A.5: it fills paidAt + paymentRef
    invoiceId     INT IDENTITY(1,1) PRIMARY KEY,
    appointmentId INT NOT NULL CONSTRAINT UQ_Invoice_appointment UNIQUE      -- one invoice per visit
                  CONSTRAINT FK_Invoice_Appointment REFERENCES Appointment(appointmentId),
    amount        DECIMAL(12,0) NOT NULL CONSTRAINT CK_Invoice_amount CHECK (amount &gt; 0),
    status        VARCHAR(10) NOT NULL CONSTRAINT DF_Invoice_status DEFAULT 'UNPAID'
                  CONSTRAINT CK_Invoice_status CHECK (status IN ('UNPAID', 'PAID')),
    createdAt     DATETIME2(0) NOT NULL CONSTRAINT DF_Invoice_createdAt DEFAULT SYSDATETIME(),
    paidAt        DATETIME2(0) NULL,
    paymentRef    VARCHAR(50)  NULL
);</code></pre>
<p>Sample data — Vietnamese names, prices in đồng, passwords already hashed (how the hashes are made: ASM.4). Note the <code>N</code> before every Vietnamese literal:</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Account (username, passwordHash, fullName, phone, role) VALUES
 ('admin',    'pbkdf2_sha256$600000$Sp/IObNPjlC6LcWu1l/WhQ==$cLy1KKYINOqqnoUroDckdTAykCYGg/Hqd2ScARz9fvA=', N'Quản trị viên',       '0901000001', 'ADMIN'),
 ('letan',    'pbkdf2_sha256$600000$YP2C8hlaf5rZEj94YOXA1A==$ptw2Tkt6IO8OLcGKxGPqabGKvucxfbrdBwlSs0e45lg=', N'Lễ tân Đỗ Ngọc',      '0901000002', 'RECEPTIONIST'),
 ('bs.an',    'pbkdf2_sha256$600000$B1d2++2caWIerJMIOOTCNg==$BXjGoGP25QvzziVqPgvGXJd45bCN58Jie4gbw3xeF98=', N'BS. Nguyễn Văn An',   '0901000003', 'DOCTOR'),
 ('bs.binh',  'pbkdf2_sha256$600000$+X4yWkXxl9dLk5eU4pT7nQ==$80l0IUhhasCKDuvcJPPpVePAjRLsyUBMTSYwVpfiL8E=', N'BS. Trần Thị Bình',   '0901000004', 'DOCTOR'),
 ('bs.chi',   'pbkdf2_sha256$600000$/DMzwBnZC642gsvicvocUQ==$bzEtOnMOEcn8kzeJbyVxh7jb9ZYF4eMBOiLkKSylDtU=', N'BS. Lê Minh Chi',     '0901000005', 'DOCTOR'),
 ('bs.dung',  'pbkdf2_sha256$600000$LUkgNnGH8KaXr7LerLxA3g==$5qI9HnVbfKmD6qP/4XNx1e4yKvjq1c1RReVmSZIodlc=', N'BS. Phạm Quốc Dũng',  '0901000006', 'DOCTOR'),
 ('bn.hoa',   'pbkdf2_sha256$600000$yasC9AcVMV8wj+5pCZp0EA==$rGe2sEp7BE5ZcM0HM2zx5VE5Vc7Az8N5tRBrIUtwb5k=', N'Nguyễn Thị Hoa',      '0912000007', 'PATIENT'),
 ('bn.khang', 'pbkdf2_sha256$600000$wnFsa0Siuu5Ec7Kx/PKtTg==$9nrNGcFZjt0t90mjIEPMSzGBSI64+4vDLeOlQvj9TjE=', N'Lê Văn Khang',        '0912000008', 'PATIENT'),
 ('bn.lan',   'pbkdf2_sha256$600000$YTLUuVVLW4NYoKNHL77mQQ==$9QIsv8Msv/BJ3Z0k+HhFSUcl6LPop9OIbhWr6Zy9wCU=', N'Trần Ngọc Lan',       '0912000009', 'PATIENT');
INSERT INTO Specialty (name) VALUES (N'Nội tổng quát'), (N'Nhi'), (N'Răng Hàm Mặt'), (N'Da liễu');
INSERT INTO Doctor (doctorId, specialtyId, room) VALUES (3, 1, N'P.101'), (4, 2, N'P.102'), (5, 3, N'P.201'), (6, 4, N'P.202');
INSERT INTO Patient (patientId, dateOfBirth) VALUES (7, '1990-03-12'), (8, '1985-07-01'), (9, '2001-11-23');
INSERT INTO MedicalService (name, price, specialtyId) VALUES
 (N'Khám nội tổng quát', 200000, 1), (N'Siêu âm ổ bụng', 350000, 1), (N'Điện tim (ECG)', 150000, 1),
 (N'Xét nghiệm máu tổng quát', 250000, 1), (N'Khám nhi', 180000, 2), (N'Tư vấn dinh dưỡng trẻ em', 150000, 2),
 (N'Khám răng', 100000, 3), (N'Cạo vôi răng', 300000, 3), (N'Nhổ răng khôn', 1200000, 3),
 (N'Khám da liễu', 200000, 4), (N'Điều trị mụn chuyên sâu', 800000, 4), (N'Siêu âm tuyến giáp', 300000, 1);
-- "Today" of the demo is 2026-11-05 (web.xml clinic.today)
INSERT INTO Appointment (patientId, doctorId, serviceId, apptDate, apptTime, status, reason, diagnosis, prescription) VALUES
 (7, 3, 1,  '2026-10-28', '08:00', 'DONE',      N'Ho, đau họng 3 ngày', N'Viêm họng cấp', N'Amoxicillin 500mg x 2 lần/ngày, 5 ngày'),
 (8, 3, 2,  '2026-10-29', '09:00', 'DONE',      N'Đau bụng sau ăn',     N'Viêm dạ dày nhẹ', N'Omeprazole 20mg trước ăn sáng, 14 ngày'),
 (9, 4, 5,  '2026-10-30', '14:00', 'DONE',      N'Khám định kỳ cho bé', N'Bé phát triển bình thường', NULL),
 (7, 5, 7,  '2026-10-31', '10:00', 'CANCELLED', N'Ê buốt răng',         NULL, NULL),
 (7, 3, 1,  '2026-11-05', '08:30', 'BOOKED',    N'Tái khám họng',       NULL, NULL),
 (8, 4, 5,  '2026-11-05', '09:00', 'BOOKED',    N'Bé sốt nhẹ',          NULL, NULL),
 (9, 6, 10, '2026-11-06', '14:30', 'BOOKED',    N'Nổi mẩn đỏ',          NULL, NULL),
 (8, 3, 3,  '2026-11-06', '08:00', 'BOOKED',    N'Hồi hộp, khó thở',    NULL, NULL),
 (9, 5, 8,  '2026-11-07', '09:30', 'BOOKED',    NULL,                   NULL, NULL),
 (7, 6, 11, '2026-11-09', '15:00', 'BOOKED',    N'Mụn trứng cá',        NULL, NULL),
 (8, 5, 7,  '2026-10-31', '10:00', 'DONE',      N'Đau răng hàm',        N'Sâu răng số 6', N'Hẹn trám răng'),
 (9, 3, 4,  '2026-11-05', '10:00', 'BOOKED',    N'Kiểm tra sức khoẻ',   NULL, NULL);
INSERT INTO Invoice (appointmentId, amount, status, paidAt, paymentRef) VALUES
 (1, 200000, 'PAID', '2026-10-28 08:40', 'CASH-0001'),
 (2, 350000, 'UNPAID', NULL, NULL);</code></pre>
<div class="pitfall">Measured on the SQL Server of this course (collation <code>SQL_Latin1_General_CP1_CI_AS</code>): <code>'Nguyễn'</code> without <code>N</code> is stored as <code>Nguy?n</code> — the literal is converted to the 8-bit code page <em>before</em> it reaches the NVARCHAR column. A VARCHAR column does the same even with <code>N</code>. From Java this cannot happen: <code>PreparedStatement.setString</code> sends Unicode (it returned <code>Nguyễn</code> intact). The trap is only in hand-written SQL scripts.</div>`,
    `<h2>2. Script, từng phần một</h2>
<p>Một file, <code>setup.sql</code>, tạo ra tất cả. Nó phải chạy <strong>lại bao nhiêu lần cũng được</strong> mà không lỗi — trước mỗi buổi demo bạn sẽ chạy lại để có dữ liệu sạch. Vì thế nó mở đầu bằng việc xoá CSDL nếu đã có (<code>SINGLE_USER WITH ROLLBACK IMMEDIATE</code> đá các kết nối NetBeans đang giữ ra ngoài):</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">IF DB_ID('PRJ301_PhongKham') IS NOT NULL
BEGIN
    ALTER DATABASE PRJ301_PhongKham SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PRJ301_PhongKham;
END
GO
CREATE DATABASE PRJ301_PhongKham;
GO
USE PRJ301_PhongKham;
GO</code></pre>
<p>Các bảng. Mọi ràng buộc đều có <strong>tên</strong> (<code>UQ_Account_username</code>, <code>CK_Appointment_status</code>…): khi CSDL từ chối điều gì, thông báo lỗi gọi đúng tên luật, và code Java nhận ra được.</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    accountId    INT IDENTITY(1,1) PRIMARY KEY,
    username     VARCHAR(30)   NOT NULL CONSTRAINT UQ_Account_username UNIQUE,
    passwordHash VARCHAR(200)  NOT NULL,                       -- mã băm PBKDF2, không bao giờ là mật khẩu
    fullName     NVARCHAR(100) NOT NULL,
    phone        VARCHAR(15)   NULL,
    role         VARCHAR(12)   NOT NULL CONSTRAINT CK_Account_role CHECK (role IN ('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'ADMIN')),
    active       BIT           NOT NULL CONSTRAINT DF_Account_active DEFAULT 1
);
CREATE TABLE Specialty (
    specialtyId INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100) NOT NULL CONSTRAINT UQ_Specialty_name UNIQUE
);
CREATE TABLE Doctor (                                          -- 1–1 với Account: bác sĩ LÀ một tài khoản vai trò DOCTOR
    doctorId    INT PRIMARY KEY CONSTRAINT FK_Doctor_Account REFERENCES Account(accountId),
    specialtyId INT NOT NULL CONSTRAINT FK_Doctor_Specialty REFERENCES Specialty(specialtyId),
    room        NVARCHAR(20) NOT NULL
);
CREATE TABLE Patient (                                         -- 1–1 với Account
    patientId   INT PRIMARY KEY CONSTRAINT FK_Patient_Account REFERENCES Account(accountId),
    dateOfBirth DATE NULL
);
CREATE TABLE MedicalService (
    serviceId   INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100) NOT NULL CONSTRAINT UQ_MedicalService_name UNIQUE,
    price       DECIMAL(12,0) NOT NULL CONSTRAINT CK_MedicalService_price CHECK (price &gt; 0),
    specialtyId INT NOT NULL CONSTRAINT FK_MedicalService_Specialty REFERENCES Specialty(specialtyId)
);
CREATE TABLE Appointment (
    appointmentId INT IDENTITY(1,1) PRIMARY KEY,
    patientId     INT NOT NULL CONSTRAINT FK_Appointment_Patient REFERENCES Patient(patientId),
    doctorId      INT NOT NULL CONSTRAINT FK_Appointment_Doctor  REFERENCES Doctor(doctorId),
    serviceId     INT NOT NULL CONSTRAINT FK_Appointment_Service REFERENCES MedicalService(serviceId),
    apptDate      DATE    NOT NULL,
    apptTime      TIME(0) NOT NULL,
    status        VARCHAR(10) NOT NULL CONSTRAINT DF_Appointment_status DEFAULT 'BOOKED'
                  CONSTRAINT CK_Appointment_status CHECK (status IN ('BOOKED', 'DONE', 'CANCELLED')),
    reason        NVARCHAR(300)  NULL,
    diagnosis     NVARCHAR(500)  NULL,                         -- bác sĩ ghi
    prescription  NVARCHAR(1000) NULL,
    createdAt     DATETIME2(0) NOT NULL CONSTRAINT DF_Appointment_createdAt DEFAULT SYSDATETIME(),
    CONSTRAINT CK_Appointment_result CHECK (status &lt;&gt; 'DONE' OR diagnosis IS NOT NULL)   -- DONE ⇒ phải có chẩn đoán
);</code></pre>
<ul>
<li><code>NVARCHAR</code> cho mọi chữ người gõ bằng tiếng Việt; <code>VARCHAR</code> chỉ cho các mã do bạn kiểm soát (username, role, status).</li>
<li><code>DECIMAL(12,0)</code> cho tiền đồng — không bao giờ <code>FLOAT</code>/<code>REAL</code> cho tiền (0.1 + 0.2 không bằng 0.3 trong số thực nhị phân).</li>
<li><code>TIME(0)</code>: giờ không có phần lẻ giây; khung giờ được so bằng <code>=</code>, nên không được tồn tại <code>08:30:00.0000001</code>.</li>
<li><code>CK_Appointment_result</code>: lịch DONE mà không có chẩn đoán là không thể — kể cả khi một lỗi trong Java cố làm thế.</li>
</ul>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Invoice (                                         -- thanh toán (sandbox) ở bài A.5: điền paidAt + paymentRef
    invoiceId     INT IDENTITY(1,1) PRIMARY KEY,
    appointmentId INT NOT NULL CONSTRAINT UQ_Invoice_appointment UNIQUE      -- mỗi lượt khám một hoá đơn
                  CONSTRAINT FK_Invoice_Appointment REFERENCES Appointment(appointmentId),
    amount        DECIMAL(12,0) NOT NULL CONSTRAINT CK_Invoice_amount CHECK (amount &gt; 0),
    status        VARCHAR(10) NOT NULL CONSTRAINT DF_Invoice_status DEFAULT 'UNPAID'
                  CONSTRAINT CK_Invoice_status CHECK (status IN ('UNPAID', 'PAID')),
    createdAt     DATETIME2(0) NOT NULL CONSTRAINT DF_Invoice_createdAt DEFAULT SYSDATETIME(),
    paidAt        DATETIME2(0) NULL,
    paymentRef    VARCHAR(50)  NULL
);</code></pre>
<p>Dữ liệu mẫu — tên tiếng Việt, giá theo đồng, mật khẩu đã băm sẵn (cách tạo mã băm: ASM.4). Để ý chữ <code>N</code> trước mọi chuỗi tiếng Việt:</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO Account (username, passwordHash, fullName, phone, role) VALUES
 ('admin',    'pbkdf2_sha256$600000$Sp/IObNPjlC6LcWu1l/WhQ==$cLy1KKYINOqqnoUroDckdTAykCYGg/Hqd2ScARz9fvA=', N'Quản trị viên',       '0901000001', 'ADMIN'),
 ('letan',    'pbkdf2_sha256$600000$YP2C8hlaf5rZEj94YOXA1A==$ptw2Tkt6IO8OLcGKxGPqabGKvucxfbrdBwlSs0e45lg=', N'Lễ tân Đỗ Ngọc',      '0901000002', 'RECEPTIONIST'),
 ('bs.an',    'pbkdf2_sha256$600000$B1d2++2caWIerJMIOOTCNg==$BXjGoGP25QvzziVqPgvGXJd45bCN58Jie4gbw3xeF98=', N'BS. Nguyễn Văn An',   '0901000003', 'DOCTOR'),
 ('bs.binh',  'pbkdf2_sha256$600000$+X4yWkXxl9dLk5eU4pT7nQ==$80l0IUhhasCKDuvcJPPpVePAjRLsyUBMTSYwVpfiL8E=', N'BS. Trần Thị Bình',   '0901000004', 'DOCTOR'),
 ('bs.chi',   'pbkdf2_sha256$600000$/DMzwBnZC642gsvicvocUQ==$bzEtOnMOEcn8kzeJbyVxh7jb9ZYF4eMBOiLkKSylDtU=', N'BS. Lê Minh Chi',     '0901000005', 'DOCTOR'),
 ('bs.dung',  'pbkdf2_sha256$600000$LUkgNnGH8KaXr7LerLxA3g==$5qI9HnVbfKmD6qP/4XNx1e4yKvjq1c1RReVmSZIodlc=', N'BS. Phạm Quốc Dũng',  '0901000006', 'DOCTOR'),
 ('bn.hoa',   'pbkdf2_sha256$600000$yasC9AcVMV8wj+5pCZp0EA==$rGe2sEp7BE5ZcM0HM2zx5VE5Vc7Az8N5tRBrIUtwb5k=', N'Nguyễn Thị Hoa',      '0912000007', 'PATIENT'),
 ('bn.khang', 'pbkdf2_sha256$600000$wnFsa0Siuu5Ec7Kx/PKtTg==$9nrNGcFZjt0t90mjIEPMSzGBSI64+4vDLeOlQvj9TjE=', N'Lê Văn Khang',        '0912000008', 'PATIENT'),
 ('bn.lan',   'pbkdf2_sha256$600000$YTLUuVVLW4NYoKNHL77mQQ==$9QIsv8Msv/BJ3Z0k+HhFSUcl6LPop9OIbhWr6Zy9wCU=', N'Trần Ngọc Lan',       '0912000009', 'PATIENT');
INSERT INTO Specialty (name) VALUES (N'Nội tổng quát'), (N'Nhi'), (N'Răng Hàm Mặt'), (N'Da liễu');
INSERT INTO Doctor (doctorId, specialtyId, room) VALUES (3, 1, N'P.101'), (4, 2, N'P.102'), (5, 3, N'P.201'), (6, 4, N'P.202');
INSERT INTO Patient (patientId, dateOfBirth) VALUES (7, '1990-03-12'), (8, '1985-07-01'), (9, '2001-11-23');
INSERT INTO MedicalService (name, price, specialtyId) VALUES
 (N'Khám nội tổng quát', 200000, 1), (N'Siêu âm ổ bụng', 350000, 1), (N'Điện tim (ECG)', 150000, 1),
 (N'Xét nghiệm máu tổng quát', 250000, 1), (N'Khám nhi', 180000, 2), (N'Tư vấn dinh dưỡng trẻ em', 150000, 2),
 (N'Khám răng', 100000, 3), (N'Cạo vôi răng', 300000, 3), (N'Nhổ răng khôn', 1200000, 3),
 (N'Khám da liễu', 200000, 4), (N'Điều trị mụn chuyên sâu', 800000, 4), (N'Siêu âm tuyến giáp', 300000, 1);
-- "Hôm nay" của bản demo là 05/11/2026 (web.xml clinic.today)
INSERT INTO Appointment (patientId, doctorId, serviceId, apptDate, apptTime, status, reason, diagnosis, prescription) VALUES
 (7, 3, 1,  '2026-10-28', '08:00', 'DONE',      N'Ho, đau họng 3 ngày', N'Viêm họng cấp', N'Amoxicillin 500mg x 2 lần/ngày, 5 ngày'),
 (8, 3, 2,  '2026-10-29', '09:00', 'DONE',      N'Đau bụng sau ăn',     N'Viêm dạ dày nhẹ', N'Omeprazole 20mg trước ăn sáng, 14 ngày'),
 (9, 4, 5,  '2026-10-30', '14:00', 'DONE',      N'Khám định kỳ cho bé', N'Bé phát triển bình thường', NULL),
 (7, 5, 7,  '2026-10-31', '10:00', 'CANCELLED', N'Ê buốt răng',         NULL, NULL),
 (7, 3, 1,  '2026-11-05', '08:30', 'BOOKED',    N'Tái khám họng',       NULL, NULL),
 (8, 4, 5,  '2026-11-05', '09:00', 'BOOKED',    N'Bé sốt nhẹ',          NULL, NULL),
 (9, 6, 10, '2026-11-06', '14:30', 'BOOKED',    N'Nổi mẩn đỏ',          NULL, NULL),
 (8, 3, 3,  '2026-11-06', '08:00', 'BOOKED',    N'Hồi hộp, khó thở',    NULL, NULL),
 (9, 5, 8,  '2026-11-07', '09:30', 'BOOKED',    NULL,                   NULL, NULL),
 (7, 6, 11, '2026-11-09', '15:00', 'BOOKED',    N'Mụn trứng cá',        NULL, NULL),
 (8, 5, 7,  '2026-10-31', '10:00', 'DONE',      N'Đau răng hàm',        N'Sâu răng số 6', N'Hẹn trám răng'),
 (9, 3, 4,  '2026-11-05', '10:00', 'BOOKED',    N'Kiểm tra sức khoẻ',   NULL, NULL);
INSERT INTO Invoice (appointmentId, amount, status, paidAt, paymentRef) VALUES
 (1, 200000, 'PAID', '2026-10-28 08:40', 'CASH-0001'),
 (2, 350000, 'UNPAID', NULL, NULL);</code></pre>
<div class="pitfall">Đo trên SQL Server của môn này (collation <code>SQL_Latin1_General_CP1_CI_AS</code>): <code>'Nguyễn'</code> thiếu <code>N</code> bị lưu thành <code>Nguy?n</code> — chuỗi bị đổi sang bảng mã 8 bit <em>trước khi</em> tới cột NVARCHAR. Cột VARCHAR cũng làm vậy dù có <code>N</code>. Từ Java thì không dính: <code>PreparedStatement.setString</code> gửi Unicode (trả về <code>Nguyễn</code> nguyên vẹn). Cái bẫy chỉ nằm trong script SQL viết tay.</div>`),
    bi(`<h2>3. The rule that must never break, written as an index</h2>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">-- No double booking: a doctor (and a patient) has at most ONE live appointment per slot.
-- FILTERED unique index: CANCELLED rows are ignored, so a cancelled slot can be booked again.
CREATE UNIQUE INDEX UX_Appointment_Doctor_Slot  ON Appointment(doctorId, apptDate, apptTime)  WHERE status &lt;&gt; 'CANCELLED';
CREATE UNIQUE INDEX UX_Appointment_Patient_Slot ON Appointment(patientId, apptDate, apptTime) WHERE status &lt;&gt; 'CANCELLED';</code></pre>
<p>A plain <code>UNIQUE(doctorId, apptDate, apptTime)</code> would be wrong: after a patient cancels, the slot could never be booked again. A <strong>filtered</strong> unique index (SQL Server 2008+) only covers the rows that match its <code>WHERE</code> — the live appointments. The sample data already uses it: appointment #4 (10:00 on 31/10 with BS. Chi) is CANCELLED and #11 sits in the same slot, DONE.</p>
<p>Why also in the database when the Java code checks first? Because two requests can arrive in the same millisecond, both check "free", both insert. Lesson ASM.3 makes that race happen for real and shows the index stopping it.</p>
<div class="callout">🐘 <strong>On PostgreSQL / Spring Boot</strong>: the same idea is a <em>partial index</em>: <code>CREATE UNIQUE INDEX ux_appt_doctor_slot ON appointment (doctor_id, appt_date, appt_time) WHERE status &lt;&gt; 'CANCELLED';</code>. LabFlow's "one lab bench per slot" is the same rule.</div>`,
    `<h2>3. Luật không bao giờ được phá, viết thành một chỉ mục</h2>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">-- Không trùng giờ: mỗi bác sĩ (và mỗi bệnh nhân) có tối đa MỘT lịch còn hiệu lực trong một khung giờ.
-- Chỉ mục duy nhất CÓ LỌC: bỏ qua dòng CANCELLED, nên khung giờ đã huỷ đặt lại được.
CREATE UNIQUE INDEX UX_Appointment_Doctor_Slot  ON Appointment(doctorId, apptDate, apptTime)  WHERE status &lt;&gt; 'CANCELLED';
CREATE UNIQUE INDEX UX_Appointment_Patient_Slot ON Appointment(patientId, apptDate, apptTime) WHERE status &lt;&gt; 'CANCELLED';</code></pre>
<p>Một <code>UNIQUE(doctorId, apptDate, apptTime)</code> thường sẽ sai: bệnh nhân huỷ xong, khung giờ đó không bao giờ đặt lại được. Chỉ mục duy nhất <strong>có lọc</strong> (filtered index, SQL Server 2008+) chỉ phủ các dòng khớp <code>WHERE</code> của nó — các lịch còn hiệu lực. Dữ liệu mẫu đã dùng tới nó: lịch #4 (10:00 ngày 31/10 với BS. Chi) là CANCELLED và lịch #11 nằm đúng khung giờ đó, DONE.</p>
<p>Code Java đã kiểm trước rồi, sao còn đặt trong CSDL? Vì hai request có thể tới trong cùng một mili giây, cả hai kiểm thấy "trống", cả hai cùng INSERT. Bài ASM.3 cho cuộc đua đó xảy ra thật và cho thấy chỉ mục chặn nó lại.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL / Spring Boot</strong>: cùng ý đó là một <em>partial index</em>: <code>CREATE UNIQUE INDEX ux_appt_doctor_slot ON appointment (doctor_id, appt_date, appt_time) WHERE status &lt;&gt; 'CANCELLED';</code>. Luật "mỗi khung giờ một bàn lab" của LabFlow chính là luật này.</div>`),
    bi(`<h2>4. The project skeleton (NetBeans, Maven, Tomcat 10.1)</h2>
<p>NetBeans → <strong>File → New Project → Java with Maven → Web Application</strong>, server Tomcat 10.1, Jakarta EE 10 Web (lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-buoi-dau-tien">⭐ first hands-on session</a>). Then create these packages and folders before writing any feature, so all members put files in the same places:</p>
<pre><code class="language-plaintext">phong-kham/
├─ pom.xml
├─ setup.sql                          the whole database, rerunnable
└─ src/main/
   ├─ java/
   │  ├─ model/       Account, Doctor, MedicalService, Appointment, Invoice, Page, *Form   (plain data)
   │  ├─ dal/         DBContext + one DAO per table group: AccountDAO, CatalogDAO, AppointmentDAO, InvoiceDAO
   │  ├─ service/     business rules: AuthService, CatalogService, BookingService, InvoiceService
   │  ├─ controller/  servlets, one per area: HomeController, LoginController, PatientAppointmentController…
   │  ├─ filter/      AuthorizationFilter, OwnershipFilter
   │  ├─ tags/        PagerTag (custom tag in Java)
   │  └─ util/        PasswordHasher, Clinic (slots, "today"), Web (small helpers)
   └─ webapp/
      ├─ css/app.css                  public
      └─ WEB-INF/                     NOT reachable by URL
         ├─ web.xml                   filters (in order), session, error pages, JSP config
         ├─ pk.tld                    the tag library descriptor of PagerTag
         ├─ tags/statusBadge.tag      a tag file
         └─ views/                    every JSP: _taglibs.jspf, _top.jspf, _bottom.jspf, home.jsp, login.jsp,
                                      admin/, patient/, doctor/, reception/, error/</code></pre>
<p>The <code>service</code> package is not in the school's MVC slides (lesson 6.A shows controller → DAO directly). Add it anyway: the booking rules (dates, slots, double booking) would otherwise sit in a servlet, and two servlets would soon copy them.</p>
<p>The dependencies in <code>pom.xml</code> (same versions as the app that produced the responses of this lesson):</p>
<pre><code class="language-xml">&lt;dependencies&gt;
    &lt;dependency&gt;                                    &lt;!-- Servlet 6.0, JSP 3.1, EL 5.0: Tomcat 10.1 provides them --&gt;
        &lt;groupId&gt;jakarta.platform&lt;/groupId&gt;
        &lt;artifactId&gt;jakarta.jakartaee-web-api&lt;/artifactId&gt;
        &lt;version&gt;10.0.0&lt;/version&gt;
        &lt;scope&gt;provided&lt;/scope&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;                                    &lt;!-- JDBC driver for SQL Server --&gt;
        &lt;groupId&gt;com.microsoft.sqlserver&lt;/groupId&gt;
        &lt;artifactId&gt;mssql-jdbc&lt;/artifactId&gt;
        &lt;version&gt;12.8.1.jre11&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;                                    &lt;!-- JSTL 3.0: API + implementation --&gt;
        &lt;groupId&gt;jakarta.servlet.jsp.jstl&lt;/groupId&gt;
        &lt;artifactId&gt;jakarta.servlet.jsp.jstl-api&lt;/artifactId&gt;
        &lt;version&gt;3.0.0&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.glassfish.web&lt;/groupId&gt;
        &lt;artifactId&gt;jakarta.servlet.jsp.jstl&lt;/artifactId&gt;
        &lt;version&gt;3.0.1&lt;/version&gt;
    &lt;/dependency&gt;
&lt;/dependencies&gt;</code></pre>
<p>Why every JSP lives under <code>WEB-INF/views</code>: a JSP opened directly would run <em>without</em> its controller (no data, no checks). Under WEB-INF the container refuses to serve it — the only way in is a <code>forward</code> from a servlet:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/WEB-INF/views/home.jsp HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;404 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-warning"&gt;
&lt;h1 class="h4"&gt;404 — Không tìm thấy&lt;/h1&gt;
&lt;p class="mb-0"&gt;Trang hoặc dữ liệu bạn tìm không tồn tại.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The 404 page is ours (declared in <code>web.xml</code> with <code>&lt;error-page&gt;</code>), styled like every other page. Static files outside WEB-INF stay public:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/css/app.css HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/css

/* Clinic theme on top of Bootstrap 5: CSS custom properties, a gradient, a transition, one media query (requirements 1.4, 1.7) */
:root {
    --pk-soft: #eef4ff;
    --pk-radius: .75rem;
}
.hero {
    background: linear-gradient(135deg, var(--pk-soft), #ffffff);
    border-radius: var(--pk-radius);
    padding: 2rem 1.5rem;
}
.doctor-card {
    transition: transform .15s ease, box-shadow .15s ease;
… (9 more lines / còn 9 dòng)</code></pre>`,
    `<h2>4. Khung project (NetBeans, Maven, Tomcat 10.1)</h2>
<p>NetBeans → <strong>File → New Project → Java with Maven → Web Application</strong>, server Tomcat 10.1, Jakarta EE 10 Web (bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-buoi-dau-tien">⭐ buổi thực hành đầu tiên</a>). Rồi tạo sẵn các gói và thư mục này trước khi viết tính năng nào, để mọi thành viên đặt file đúng một chỗ:</p>
<pre><code class="language-plaintext">phong-kham/
├─ pom.xml
├─ setup.sql                          toàn bộ CSDL, chạy lại được
└─ src/main/
   ├─ java/
   │  ├─ model/       Account, Doctor, MedicalService, Appointment, Invoice, Page, *Form   (dữ liệu thuần)
   │  ├─ dal/         DBContext + mỗi nhóm bảng một DAO: AccountDAO, CatalogDAO, AppointmentDAO, InvoiceDAO
   │  ├─ service/     luật nghiệp vụ: AuthService, CatalogService, BookingService, InvoiceService
   │  ├─ controller/  servlet, mỗi khu một cái: HomeController, LoginController, PatientAppointmentController…
   │  ├─ filter/      AuthorizationFilter, OwnershipFilter
   │  ├─ tags/        PagerTag (custom tag viết bằng Java)
   │  └─ util/        PasswordHasher, Clinic (khung giờ, "hôm nay"), Web (hàm phụ)
   └─ webapp/
      ├─ css/app.css                  công khai
      └─ WEB-INF/                     KHÔNG truy cập được bằng URL
         ├─ web.xml                   filter (theo thứ tự), session, trang lỗi, cấu hình JSP
         ├─ pk.tld                    tệp mô tả thư viện thẻ của PagerTag
         ├─ tags/statusBadge.tag      một tag file
         └─ views/                    mọi JSP: _taglibs.jspf, _top.jspf, _bottom.jspf, home.jsp, login.jsp,
                                      admin/, patient/, doctor/, reception/, error/</code></pre>
<p>Gói <code>service</code> không có trong slide MVC của trường (bài 6.A cho controller gọi thẳng DAO). Cứ thêm vào: nếu không, luật đặt lịch (ngày, khung giờ, trùng giờ) sẽ nằm trong một servlet, và chẳng bao lâu hai servlet sẽ chép lại chúng.</p>
<p>Các dependency trong <code>pom.xml</code> (đúng phiên bản của app đã tạo ra các response trong bài):</p>
<pre><code class="language-xml">&lt;dependencies&gt;
    &lt;dependency&gt;                                    &lt;!-- Servlet 6.0, JSP 3.1, EL 5.0: Tomcat 10.1 cung cấp sẵn --&gt;
        &lt;groupId&gt;jakarta.platform&lt;/groupId&gt;
        &lt;artifactId&gt;jakarta.jakartaee-web-api&lt;/artifactId&gt;
        &lt;version&gt;10.0.0&lt;/version&gt;
        &lt;scope&gt;provided&lt;/scope&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;                                    &lt;!-- driver JDBC cho SQL Server --&gt;
        &lt;groupId&gt;com.microsoft.sqlserver&lt;/groupId&gt;
        &lt;artifactId&gt;mssql-jdbc&lt;/artifactId&gt;
        &lt;version&gt;12.8.1.jre11&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;                                    &lt;!-- JSTL 3.0: API + bản cài đặt --&gt;
        &lt;groupId&gt;jakarta.servlet.jsp.jstl&lt;/groupId&gt;
        &lt;artifactId&gt;jakarta.servlet.jsp.jstl-api&lt;/artifactId&gt;
        &lt;version&gt;3.0.0&lt;/version&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;org.glassfish.web&lt;/groupId&gt;
        &lt;artifactId&gt;jakarta.servlet.jsp.jstl&lt;/artifactId&gt;
        &lt;version&gt;3.0.1&lt;/version&gt;
    &lt;/dependency&gt;
&lt;/dependencies&gt;</code></pre>
<p>Vì sao mọi JSP nằm dưới <code>WEB-INF/views</code>: một JSP mở thẳng sẽ chạy <em>không có</em> controller của nó (không dữ liệu, không kiểm tra). Dưới WEB-INF thì container từ chối phục vụ — lối vào duy nhất là một <code>forward</code> từ servlet:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/WEB-INF/views/home.jsp HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;404 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-warning"&gt;
&lt;h1 class="h4"&gt;404 — Không tìm thấy&lt;/h1&gt;
&lt;p class="mb-0"&gt;Trang hoặc dữ liệu bạn tìm không tồn tại.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Trang 404 là của chúng ta (khai trong <code>web.xml</code> bằng <code>&lt;error-page&gt;</code>), cùng giao diện với mọi trang khác. File tĩnh nằm ngoài WEB-INF vẫn công khai:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/css/app.css HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/css

/* Clinic theme on top of Bootstrap 5: CSS custom properties, a gradient, a transition, one media query (requirements 1.4, 1.7) */
:root {
    --pk-soft: #eef4ff;
    --pk-radius: .75rem;
}
.hero {
    background: linear-gradient(135deg, var(--pk-soft), #ffffff);
    border-radius: var(--pk-radius);
    padding: 2rem 1.5rem;
}
.doctor-card {
    transition: transform .15s ease, box-shadow .15s ease;
… (9 more lines / còn 9 dòng)</code></pre>`),
    bi(`<h2>5. DBContext — one place that knows the database</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/DBContext.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// ONE place that knows how to reach the database. Every DAO calls DBContext.getConnection()
public class DBContext {
    // School PC: localhost:1433 + YOUR sa password. The lesson's Tomcat sets DB_* environment variables
    private static final String URL = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
            + ";databaseName=PRJ301_PhongKham;encrypt=true;trustServerCertificate=true"
            + ";sendTimeAsDatetime=false";   // send LocalTime as TIME, not DATETIME — else "apptTime = ?" fails (error 402)

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("mssql-jdbc is missing from WEB-INF/lib", e);
        }
        return DriverManager.getConnection(URL, env("DB_USER", "sa"), env("DB_PASSWORD", "123"));
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<ul>
<li>The password is <strong>not</strong> in the code: it comes from environment variables (<code>DB_USER</code>, <code>DB_PASSWORD</code>), with the school-PC default as a fallback. The repository can then be public without leaking the <code>sa</code> password of a teammate.</li>
<li><code>Class.forName</code>: a driver inside <code>WEB-INF/lib</code> is loaded by the web application's class loader, which <code>DriverManager</code> does not scan on its own — without this line you get "No suitable driver" (lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj2-2">5.B</a>).</li>
<li><code>sendTimeAsDatetime=false</code> is a line you will not find in the slides. Without it the driver sends a <code>LocalTime</code> as <code>datetime</code> (Microsoft's documented default), and <code>WHERE apptTime = ?</code> on a <code>TIME</code> column fails with error 402: <em>"The data types time and datetime are incompatible in the equal to operator."</em> — measured on this course's SQL Server; the first run of this very app crashed with it.</li>
</ul>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): DBContext disappears into configuration — <code>spring.datasource.url=&#36;{DB_URL}</code>, <code>spring.datasource.username=&#36;{DB_USER}</code> in <code>application.properties</code> — and a connection pool (HikariCP) replaces <code>DriverManager</code>. <code>setup.sql</code> becomes numbered Flyway migrations (<code>V1__init.sql</code>, <code>V2__invoice.sql</code>) so every teammate's database is upgraded the same way.</div>`,
    `<h2>5. DBContext — một chỗ duy nhất biết về CSDL</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/DBContext.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// MỘT chỗ duy nhất biết cách tới CSDL. Mọi DAO gọi DBContext.getConnection()
public class DBContext {
    // Máy trường: localhost:1433 + mật khẩu sa CỦA BẠN. Tomcat của bài đặt sẵn biến môi trường DB_*
    private static final String URL = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
            + ";databaseName=PRJ301_PhongKham;encrypt=true;trustServerCertificate=true"
            + ";sendTimeAsDatetime=false";   // gửi LocalTime dạng TIME, không phải DATETIME — nếu không "apptTime = ?" lỗi (lỗi 402)

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("mssql-jdbc is missing from WEB-INF/lib", e);
        }
        return DriverManager.getConnection(URL, env("DB_USER", "sa"), env("DB_PASSWORD", "123"));
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<ul>
<li>Mật khẩu <strong>không</strong> nằm trong code: nó lấy từ biến môi trường (<code>DB_USER</code>, <code>DB_PASSWORD</code>), giá trị dự phòng là mặc định của máy trường. Nhờ vậy repo có để công khai cũng không lộ mật khẩu <code>sa</code> của bạn cùng nhóm.</li>
<li><code>Class.forName</code>: driver nằm trong <code>WEB-INF/lib</code> được nạp bởi class loader của ứng dụng web, mà <code>DriverManager</code> không tự quét — thiếu dòng này sẽ gặp "No suitable driver" (bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj2-2">5.B</a>).</li>
<li><code>sendTimeAsDatetime=false</code> là dòng bạn không tìm thấy trong slide. Thiếu nó, driver gửi <code>LocalTime</code> dưới dạng <code>datetime</code> (mặc định Microsoft ghi trong tài liệu), và <code>WHERE apptTime = ?</code> trên cột <code>TIME</code> lỗi 402: <em>"The data types time and datetime are incompatible in the equal to operator."</em> — đo trên SQL Server của môn; lần chạy đầu tiên của chính app này đã sập vì nó.</li>
</ul>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): DBContext tan vào cấu hình — <code>spring.datasource.url=&#36;{DB_URL}</code>, <code>spring.datasource.username=&#36;{DB_USER}</code> trong <code>application.properties</code> — và một connection pool (HikariCP) thay cho <code>DriverManager</code>. <code>setup.sql</code> thành các migration Flyway đánh số (<code>V1__init.sql</code>, <code>V2__invoice.sql</code>) để CSDL của mọi thành viên được nâng cấp giống hệt nhau.</div>`),
    bi(`<h2>6. The first vertical slice: database → DAO → servlet → JSP</h2>
<p>Before the team splits, the lead builds ONE complete slice (UC01, the home page) so everybody copies a working pattern. The DAO reads doctors with their specialty in one join; the controller puts lists into the request and forwards; the view only displays.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/HomeController.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.CatalogDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

// Public home page: specialties + doctors. "" = exactly the context root (/phong-kham/)
@WebServlet(urlPatterns = { "", "/home" })
public class HomeController extends HttpServlet {
    private final CatalogDAO catalog = new CatalogDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            req.setAttribute("specialties", catalog.specialties());
            req.setAttribute("doctors", catalog.doctors());
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        req.getRequestDispatcher("/WEB-INF/views/home.jsp").forward(req, resp);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/home.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- Responsive grid: 1 column on phones, 2 from 576px, 4 from 992px --%&gt;
&lt;div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3"&gt;
&lt;c:forEach items="&#36;{doctors}" var="d"&gt;&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;&lt;c:out value="&#36;{d.fullName}"/&gt;&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;&lt;c:out value="&#36;{d.specialtyName}"/&gt; · &lt;c:out value="&#36;{d.room}"/&gt;&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="&#36;{ctx}/patient/appointments/new?doctorId=&#36;{d.id}"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/c:forEach&gt;&lt;/div&gt;</code></pre>
<p><code>@WebServlet(urlPatterns = { "", "/home" })</code>: the empty string is the Servlet specification's pattern for <em>exactly</em> the context root, so <code>/phong-kham/</code> lands here and no <code>index.jsp</code> is needed. The response — specialties and doctors from SQL Server, inside the shared Bootstrap layout (explained in ASM.3):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Trang chủ · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;section class="hero mb-4"&gt;
&lt;h1 class="h3"&gt;Đặt lịch khám trực tuyến&lt;/h1&gt;
&lt;p class="mb-2"&gt;Chọn bác sĩ, chọn giờ — không phải xếp hàng.&lt;/p&gt;
&lt;p class="mb-0"&gt;
&lt;span class="badge text-bg-info me-1"&gt;Nội tổng quát&lt;/span&gt;
&lt;span class="badge text-bg-info me-1"&gt;Nhi&lt;/span&gt;
&lt;span class="badge text-bg-info me-1"&gt;Răng Hàm Mặt&lt;/span&gt;
&lt;span class="badge text-bg-info me-1"&gt;Da liễu&lt;/span&gt;
&lt;/p&gt;
&lt;/section&gt;
&lt;div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3"&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Nguyễn Văn An&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Nội tổng quát · P.101&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=3"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Trần Thị Bình&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Nhi · P.102&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=4"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Lê Minh Chi&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Răng Hàm Mặt · P.201&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=5"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Phạm Quốc Dũng&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Da liễu · P.202&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=6"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Note the <code>Set-Cookie</code> is absent here only because the header list is filtered; this page, like any JSP, created a session for the guest (lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj5-1">4.A</a>). ASM.4 shows that cookie being replaced at login.</p>`,
    `<h2>6. Lát cắt dọc đầu tiên: CSDL → DAO → servlet → JSP</h2>
<p>Trước khi cả nhóm chia nhau làm, nhóm trưởng dựng MỘT lát cắt trọn vẹn (UC01, trang chủ) để mọi người chép theo một khuôn đã chạy. DAO đọc bác sĩ kèm chuyên khoa bằng một câu join; controller đặt danh sách vào request rồi forward; view chỉ hiển thị.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/HomeController.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.CatalogDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

// Trang chủ công khai: chuyên khoa + bác sĩ. "" = đúng gốc context (/phong-kham/)
@WebServlet(urlPatterns = { "", "/home" })
public class HomeController extends HttpServlet {
    private final CatalogDAO catalog = new CatalogDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            req.setAttribute("specialties", catalog.specialties());
            req.setAttribute("doctors", catalog.doctors());
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        req.getRequestDispatcher("/WEB-INF/views/home.jsp").forward(req, resp);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/home.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- Lưới responsive: 1 cột trên điện thoại, 2 cột từ 576px, 4 cột từ 992px --%&gt;
&lt;div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3"&gt;
&lt;c:forEach items="&#36;{doctors}" var="d"&gt;&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;&lt;c:out value="&#36;{d.fullName}"/&gt;&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;&lt;c:out value="&#36;{d.specialtyName}"/&gt; · &lt;c:out value="&#36;{d.room}"/&gt;&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="&#36;{ctx}/patient/appointments/new?doctorId=&#36;{d.id}"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/c:forEach&gt;&lt;/div&gt;</code></pre>
<p><code>@WebServlet(urlPatterns = { "", "/home" })</code>: chuỗi rỗng là mẫu của đặc tả Servlet cho <em>đúng</em> gốc context, nên <code>/phong-kham/</code> vào thẳng đây, không cần <code>index.jsp</code>. Response — chuyên khoa và bác sĩ lấy từ SQL Server, nằm trong layout Bootstrap dùng chung (giải thích ở ASM.3):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Trang chủ · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;section class="hero mb-4"&gt;
&lt;h1 class="h3"&gt;Đặt lịch khám trực tuyến&lt;/h1&gt;
&lt;p class="mb-2"&gt;Chọn bác sĩ, chọn giờ — không phải xếp hàng.&lt;/p&gt;
&lt;p class="mb-0"&gt;
&lt;span class="badge text-bg-info me-1"&gt;Nội tổng quát&lt;/span&gt;
&lt;span class="badge text-bg-info me-1"&gt;Nhi&lt;/span&gt;
&lt;span class="badge text-bg-info me-1"&gt;Răng Hàm Mặt&lt;/span&gt;
&lt;span class="badge text-bg-info me-1"&gt;Da liễu&lt;/span&gt;
&lt;/p&gt;
&lt;/section&gt;
&lt;div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3"&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Nguyễn Văn An&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Nội tổng quát · P.101&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=3"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Trần Thị Bình&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Nhi · P.102&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=4"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Lê Minh Chi&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Răng Hàm Mặt · P.201&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=5"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col"&gt;&lt;div class="card h-100 doctor-card"&gt;&lt;div class="card-body"&gt;
&lt;h2 class="h6 card-title"&gt;BS. Phạm Quốc Dũng&lt;/h2&gt;
&lt;p class="card-text small text-muted mb-2"&gt;Da liễu · P.202&lt;/p&gt;
&lt;a class="btn btn-sm btn-primary" href="/phong-kham/patient/appointments/new?doctorId=6"&gt;Đặt lịch&lt;/a&gt;
&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Ở đây không thấy <code>Set-Cookie</code> chỉ vì danh sách header đã được lọc; trang này, như mọi JSP, đã tạo session cho khách (bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj5-1">4.A</a>). ASM.4 cho thấy cookie đó bị thay ngay lúc đăng nhập.</p>`),
    bi(`<h2>7. Naming conventions — agree on them on day one</h2>
<table>
<thead><tr><th>Thing</th><th>Convention</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Database</td><td>PRJ301_ + topic in PascalCase</td><td>PRJ301_PhongKham</td></tr>
<tr><td>Table, column</td><td>English, PascalCase table, camelCase column</td><td>Appointment.apptDate</td></tr>
<tr><td>Constraint</td><td>PK_/FK_/UQ_/CK_/DF_ + table + column</td><td>UQ_Account_username</td></tr>
<tr><td>Java package</td><td>lower case, one per layer</td><td>dal, service, controller</td></tr>
<tr><td>Class</td><td>role suffix</td><td>AppointmentDAO, BookingService, LoginController, OwnershipFilter</td></tr>
<tr><td>URL</td><td>/area/resource/action, lower case, area = role</td><td>/patient/appointments/create</td></tr>
<tr><td>JSP</td><td>WEB-INF/views/area/resource.jsp</td><td>WEB-INF/views/patient/appointments.jsp</td></tr>
<tr><td>Request attribute</td><td>the noun the JSP shows</td><td>appointments, page, form, errors</td></tr>
<tr><td>Session attribute</td><td>as few as possible</td><td>account, flash</td></tr>
</tbody>
</table>
<p>The URL rule pays off in ASM.4: because every patient page starts with <code>/patient/</code>, ONE line of the filter protects all of them.</p>`,
    `<h2>7. Quy ước đặt tên — thống nhất ngay ngày đầu</h2>
<table>
<thead><tr><th>Thứ</th><th>Quy ước</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>CSDL</td><td>PRJ301_ + đề tài kiểu PascalCase</td><td>PRJ301_PhongKham</td></tr>
<tr><td>Bảng, cột</td><td>tiếng Anh, bảng PascalCase, cột camelCase</td><td>Appointment.apptDate</td></tr>
<tr><td>Ràng buộc</td><td>PK_/FK_/UQ_/CK_/DF_ + bảng + cột</td><td>UQ_Account_username</td></tr>
<tr><td>Gói Java</td><td>chữ thường, mỗi tầng một gói</td><td>dal, service, controller</td></tr>
<tr><td>Lớp</td><td>hậu tố theo vai trò</td><td>AppointmentDAO, BookingService, LoginController, OwnershipFilter</td></tr>
<tr><td>URL</td><td>/khu/tài-nguyên/hành-động, chữ thường, khu = vai trò</td><td>/patient/appointments/create</td></tr>
<tr><td>JSP</td><td>WEB-INF/views/khu/tài-nguyên.jsp</td><td>WEB-INF/views/patient/appointments.jsp</td></tr>
<tr><td>Attribute của request</td><td>danh từ mà JSP hiển thị</td><td>appointments, page, form, errors</td></tr>
<tr><td>Attribute của session</td><td>càng ít càng tốt</td><td>account, flash</td></tr>
</tbody>
</table>
<p>Quy tắc URL được đền đáp ở ASM.4: vì mọi trang của bệnh nhân bắt đầu bằng <code>/patient/</code>, MỘT dòng trong filter bảo vệ được tất cả.</p>`),
    bi(`<h2>8. Git for a team of five</h2>
<pre><code class="language-bash"># lead, once
git init &amp;&amp; git add . &amp;&amp; git commit -m "chore: skeleton MVC + setup.sql"
git branch -M main &amp;&amp; git remote add origin https://github.com/&lt;team&gt;/phong-kham.git &amp;&amp; git push -u origin main

# every member, every feature
git switch -c feature/uc04-booking          # one branch per use case
git add src/main/java/service/BookingService.java src/main/webapp/WEB-INF/views/patient/booking-form.jsp
git commit -m "feat(UC04): book an appointment, reject double booking"
git push -u origin feature/uc04-booking     # then open a Pull Request; another member reviews and merges
git switch main &amp;&amp; git pull                 # start the next feature from the fresh main</code></pre>
<pre><code class="language-plaintext"># .gitignore
target/
nbproject/private/
*.class
.DS_Store</code></pre>
<ul>
<li><strong>Commit <code>setup.sql</code></strong>; whoever changes a table changes the script in the same commit and tells the group to rerun it.</li>
<li><strong>Never commit a password</strong> — that is why DBContext reads environment variables.</li>
<li>Each member commits his own work from his own account: the Git log is the evidence for "a clear split of tasks" in the report.</li>
</ul>
<p>Last check of the day — what the WAR of the finished app contains (no <code>.java</code>, no <code>setup.sql</code>, three jars in <code>WEB-INF/lib</code>, every JSP under <code>WEB-INF</code>):</p>
<p class="ghi-chu">📦 Inside the <code>phong-kham.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/AdminReportController.class<br>
WEB-INF/classes/controller/AdminServiceController.class<br>
WEB-INF/classes/controller/DoctorResultController.class<br>
WEB-INF/classes/controller/DoctorScheduleController.class<br>
WEB-INF/classes/controller/HomeController.class<br>
WEB-INF/classes/controller/LoginController.class<br>
WEB-INF/classes/controller/LogoutController.class<br>
WEB-INF/classes/controller/PatientAppointmentController.class<br>
WEB-INF/classes/controller/PatientInvoiceController.class<br>
WEB-INF/classes/controller/PatientPaymentController.class<br>
WEB-INF/classes/controller/ReceptionAppointmentController.class<br>
WEB-INF/classes/controller/ReceptionInvoiceController.class<br>
WEB-INF/classes/controller/RegisterController.class<br>
WEB-INF/classes/controller/VnpayIpnController.class<br>
WEB-INF/classes/controller/VnpayReturnController.class<br>
WEB-INF/classes/dal/<br>
WEB-INF/classes/dal/AccountDAO$Stored.class<br>
WEB-INF/classes/dal/AccountDAO.class<br>
WEB-INF/classes/dal/AppointmentDAO.class<br>
WEB-INF/classes/dal/CatalogDAO.class<br>
WEB-INF/classes/dal/DBContext.class<br>
WEB-INF/classes/dal/InvoiceDAO.class<br>
WEB-INF/classes/dal/PaymentDAO.class<br>
WEB-INF/classes/dal/ReportDAO.class<br>
WEB-INF/classes/filter/<br>
WEB-INF/classes/filter/AuthorizationFilter.class<br>
WEB-INF/classes/filter/Forbidden.class<br>
WEB-INF/classes/filter/OwnershipFilter.class<br>
WEB-INF/classes/model/<br>
WEB-INF/classes/model/Account.class<br>
WEB-INF/classes/model/Appointment.class<br>
WEB-INF/classes/model/BookingForm.class<br>
WEB-INF/classes/model/Doctor.class<br>
WEB-INF/classes/model/Invoice.class<br>
WEB-INF/classes/model/MedicalService.class<br>
WEB-INF/classes/model/Page.class<br>
WEB-INF/classes/model/PaymentTxn.class<br>
WEB-INF/classes/model/RevenueRow.class<br>
WEB-INF/classes/model/ServiceForm.class<br>
WEB-INF/classes/model/Specialty.class<br>
WEB-INF/classes/payment/<br>
WEB-INF/classes/payment/Vnpay.class<br>
WEB-INF/classes/payment/VnpayCodes.class<br>
WEB-INF/classes/payment/VnpayConfig.class<br>
WEB-INF/classes/service/<br>
WEB-INF/classes/service/AuthService.class<br>
WEB-INF/classes/service/BookingService.class<br>
WEB-INF/classes/service/CatalogService.class<br>
WEB-INF/classes/service/InvoiceService.class<br>
WEB-INF/classes/service/PaymentService.class<br>
WEB-INF/classes/tags/<br>
WEB-INF/classes/tags/PagerTag.class<br>
WEB-INF/classes/util/<br>
WEB-INF/classes/util/Clinic.class<br>
WEB-INF/classes/util/PasswordHasher.class<br>
WEB-INF/classes/util/Web.class<br>
WEB-INF/classes/vnpaygia/<br>
WEB-INF/classes/vnpaygia/CongVnpayGia.class<br>
WEB-INF/lib/<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-3.0.1.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-api-3.0.0.jar<br>
WEB-INF/lib/mssql-jdbc-12.8.1.jre11.jar<br>
WEB-INF/pk.tld<br>
WEB-INF/tags/<br>
WEB-INF/tags/statusBadge.tag<br>
WEB-INF/views/<br>
WEB-INF/views/_bottom.jspf<br>
WEB-INF/views/_taglibs.jspf<br>
WEB-INF/views/_top.jspf<br>
WEB-INF/views/admin/<br>
WEB-INF/views/admin/reports.jsp<br>
WEB-INF/views/admin/service-form.jsp<br>
WEB-INF/views/admin/services.jsp<br>
WEB-INF/views/doctor/<br>
WEB-INF/views/doctor/result-form.jsp<br>
WEB-INF/views/doctor/schedule.jsp<br>
WEB-INF/views/error/<br>
WEB-INF/views/error/403.jsp<br>
WEB-INF/views/error/404.jsp<br>
WEB-INF/views/home.jsp<br>
WEB-INF/views/login.jsp<br>
WEB-INF/views/patient/<br>
WEB-INF/views/patient/appointment.jsp<br>
WEB-INF/views/patient/appointments.jsp<br>
WEB-INF/views/patient/booking-form.jsp<br>
WEB-INF/views/patient/invoices.jsp<br>
WEB-INF/views/patient/payment-result.jsp<br>
WEB-INF/views/reception/<br>
WEB-INF/views/reception/appointments.jsp<br>
WEB-INF/views/register.jsp<br>
WEB-INF/views/vnpay-gia/<br>
WEB-INF/views/vnpay-gia/loi.jsp<br>
WEB-INF/views/vnpay-gia/thanh-toan.jsp<br>
WEB-INF/web.xml<br>
css/<br>
css/app.css</div>`,
    `<h2>8. Git cho nhóm năm người</h2>
<pre><code class="language-bash"># nhóm trưởng, một lần
git init &amp;&amp; git add . &amp;&amp; git commit -m "chore: skeleton MVC + setup.sql"
git branch -M main &amp;&amp; git remote add origin https://github.com/&lt;nhom&gt;/phong-kham.git &amp;&amp; git push -u origin main

# mọi thành viên, mỗi tính năng
git switch -c feature/uc04-booking          # mỗi use case một nhánh
git add src/main/java/service/BookingService.java src/main/webapp/WEB-INF/views/patient/booking-form.jsp
git commit -m "feat(UC04): book an appointment, reject double booking"
git push -u origin feature/uc04-booking     # rồi mở Pull Request; một thành viên khác xem lại và merge
git switch main &amp;&amp; git pull                 # bắt đầu tính năng kế tiếp từ main mới nhất</code></pre>
<pre><code class="language-plaintext"># .gitignore
target/
nbproject/private/
*.class
.DS_Store</code></pre>
<ul>
<li><strong>Commit <code>setup.sql</code></strong>; ai đổi bảng thì đổi script trong cùng commit và báo cả nhóm chạy lại.</li>
<li><strong>Không bao giờ commit mật khẩu</strong> — vì thế DBContext đọc biến môi trường.</li>
<li>Mỗi thành viên commit phần của mình bằng tài khoản của mình: lịch sử Git là bằng chứng cho "phân công rõ ràng" trong báo cáo.</li>
</ul>
<p>Phép kiểm cuối ngày — WAR của app hoàn chỉnh chứa gì (không có <code>.java</code>, không có <code>setup.sql</code>, ba jar trong <code>WEB-INF/lib</code>, mọi JSP dưới <code>WEB-INF</code>):</p>
<p class="ghi-chu">📦 Bên trong <code>phong-kham.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/AdminReportController.class<br>
WEB-INF/classes/controller/AdminServiceController.class<br>
WEB-INF/classes/controller/DoctorResultController.class<br>
WEB-INF/classes/controller/DoctorScheduleController.class<br>
WEB-INF/classes/controller/HomeController.class<br>
WEB-INF/classes/controller/LoginController.class<br>
WEB-INF/classes/controller/LogoutController.class<br>
WEB-INF/classes/controller/PatientAppointmentController.class<br>
WEB-INF/classes/controller/PatientInvoiceController.class<br>
WEB-INF/classes/controller/PatientPaymentController.class<br>
WEB-INF/classes/controller/ReceptionAppointmentController.class<br>
WEB-INF/classes/controller/ReceptionInvoiceController.class<br>
WEB-INF/classes/controller/RegisterController.class<br>
WEB-INF/classes/controller/VnpayIpnController.class<br>
WEB-INF/classes/controller/VnpayReturnController.class<br>
WEB-INF/classes/dal/<br>
WEB-INF/classes/dal/AccountDAO$Stored.class<br>
WEB-INF/classes/dal/AccountDAO.class<br>
WEB-INF/classes/dal/AppointmentDAO.class<br>
WEB-INF/classes/dal/CatalogDAO.class<br>
WEB-INF/classes/dal/DBContext.class<br>
WEB-INF/classes/dal/InvoiceDAO.class<br>
WEB-INF/classes/dal/PaymentDAO.class<br>
WEB-INF/classes/dal/ReportDAO.class<br>
WEB-INF/classes/filter/<br>
WEB-INF/classes/filter/AuthorizationFilter.class<br>
WEB-INF/classes/filter/Forbidden.class<br>
WEB-INF/classes/filter/OwnershipFilter.class<br>
WEB-INF/classes/model/<br>
WEB-INF/classes/model/Account.class<br>
WEB-INF/classes/model/Appointment.class<br>
WEB-INF/classes/model/BookingForm.class<br>
WEB-INF/classes/model/Doctor.class<br>
WEB-INF/classes/model/Invoice.class<br>
WEB-INF/classes/model/MedicalService.class<br>
WEB-INF/classes/model/Page.class<br>
WEB-INF/classes/model/PaymentTxn.class<br>
WEB-INF/classes/model/RevenueRow.class<br>
WEB-INF/classes/model/ServiceForm.class<br>
WEB-INF/classes/model/Specialty.class<br>
WEB-INF/classes/payment/<br>
WEB-INF/classes/payment/Vnpay.class<br>
WEB-INF/classes/payment/VnpayCodes.class<br>
WEB-INF/classes/payment/VnpayConfig.class<br>
WEB-INF/classes/service/<br>
WEB-INF/classes/service/AuthService.class<br>
WEB-INF/classes/service/BookingService.class<br>
WEB-INF/classes/service/CatalogService.class<br>
WEB-INF/classes/service/InvoiceService.class<br>
WEB-INF/classes/service/PaymentService.class<br>
WEB-INF/classes/tags/<br>
WEB-INF/classes/tags/PagerTag.class<br>
WEB-INF/classes/util/<br>
WEB-INF/classes/util/Clinic.class<br>
WEB-INF/classes/util/PasswordHasher.class<br>
WEB-INF/classes/util/Web.class<br>
WEB-INF/classes/vnpaygia/<br>
WEB-INF/classes/vnpaygia/CongVnpayGia.class<br>
WEB-INF/lib/<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-3.0.1.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-api-3.0.0.jar<br>
WEB-INF/lib/mssql-jdbc-12.8.1.jre11.jar<br>
WEB-INF/pk.tld<br>
WEB-INF/tags/<br>
WEB-INF/tags/statusBadge.tag<br>
WEB-INF/views/<br>
WEB-INF/views/_bottom.jspf<br>
WEB-INF/views/_taglibs.jspf<br>
WEB-INF/views/_top.jspf<br>
WEB-INF/views/admin/<br>
WEB-INF/views/admin/reports.jsp<br>
WEB-INF/views/admin/service-form.jsp<br>
WEB-INF/views/admin/services.jsp<br>
WEB-INF/views/doctor/<br>
WEB-INF/views/doctor/result-form.jsp<br>
WEB-INF/views/doctor/schedule.jsp<br>
WEB-INF/views/error/<br>
WEB-INF/views/error/403.jsp<br>
WEB-INF/views/error/404.jsp<br>
WEB-INF/views/home.jsp<br>
WEB-INF/views/login.jsp<br>
WEB-INF/views/patient/<br>
WEB-INF/views/patient/appointment.jsp<br>
WEB-INF/views/patient/appointments.jsp<br>
WEB-INF/views/patient/booking-form.jsp<br>
WEB-INF/views/patient/invoices.jsp<br>
WEB-INF/views/patient/payment-result.jsp<br>
WEB-INF/views/reception/<br>
WEB-INF/views/reception/appointments.jsp<br>
WEB-INF/views/register.jsp<br>
WEB-INF/views/vnpay-gia/<br>
WEB-INF/views/vnpay-gia/loi.jsp<br>
WEB-INF/views/vnpay-gia/thanh-toan.jsp<br>
WEB-INF/web.xml<br>
css/<br>
css/app.css</div>`),
    bi(`<h2>🧪 Do it now for YOUR topic (60 minutes)</h2>
<ol>
<li>Apply the five rules of section 1 to your actor and function tables; draw the ERD (copy the PlantUML above).</li>
<li>Write <code>setup.sql</code>: named constraints, NVARCHAR + <code>N'…'</code>, a status CHECK, your "never break" rule as a UNIQUE (filtered if cancellation exists) index, 10+ rows of Vietnamese sample data.</li>
<li>Run it twice in SSMS/Azure Data Studio — the second run must succeed too.</li>
<li>Create the packages of section 4 and make your home page show one table from the database.</li>
</ol>
<p class="dap-an">✅ Topic 10 (sports pitches), the rule as an index: <code>CREATE UNIQUE INDEX UX_Booking_Pitch_Slot ON Booking(pitchId, playDate, startTime) WHERE status &lt;&gt; 'CANCELLED';</code>. Topic 1 (car rental) cannot use an index — "overlapping date ranges" is not an equality — so the check is <code>SELECT COUNT(*) FROM Rental WHERE carId = ? AND status &lt;&gt; 'CANCELLED' AND startDate &lt;= ? AND endDate &gt;= ?</code> run inside a SERIALIZABLE transaction together with the INSERT (lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-transaction-pool">5.4 transactions</a>).</p>`,
    `<h2>🧪 Làm ngay cho đề tài CỦA BẠN (60 phút)</h2>
<ol>
<li>Áp năm quy tắc ở mục 1 vào bảng tác nhân và bảng chức năng của bạn; vẽ ERD (chép mã PlantUML ở trên).</li>
<li>Viết <code>setup.sql</code>: ràng buộc có tên, NVARCHAR + <code>N'…'</code>, CHECK cho trạng thái, luật "không bao giờ phá" thành chỉ mục UNIQUE (có lọc nếu có huỷ), 10+ dòng dữ liệu mẫu tiếng Việt.</li>
<li>Chạy hai lần trong SSMS/Azure Data Studio — lần thứ hai cũng phải thành công.</li>
<li>Tạo các gói ở mục 4 và làm trang chủ hiện một bảng lấy từ CSDL.</li>
</ol>
<p class="dap-an">✅ Đề tài 10 (sân thể thao), luật thành chỉ mục: <code>CREATE UNIQUE INDEX UX_Booking_Pitch_Slot ON Booking(pitchId, playDate, startTime) WHERE status &lt;&gt; 'CANCELLED';</code>. Đề tài 1 (cho thuê xe) không dùng chỉ mục được — "khoảng ngày chồng nhau" không phải phép so bằng — nên phép kiểm là <code>SELECT COUNT(*) FROM Rental WHERE carId = ? AND status &lt;&gt; 'CANCELLED' AND startDate &lt;= ? AND endDate &gt;= ?</code> chạy trong một transaction SERIALIZABLE cùng với lệnh INSERT (bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-transaction-pool">5.4 giao dịch</a>).</p>`),
  ].join('\n'),
};

/* ───────── ASM.2b — 🧭 Assignment A–Z (between 2/6 and 3/6): wireframes — draw every page before writing JSP ───────── */
const L_x_asm_wireframe = {
  title: 'ASM.2b — 🧭 Assignment A–Z (between 2/6 and 3/6): wireframes — draw every page before writing JSP|||ASM.2b — 🧭 Assignment A–Z (giữa 2/6 và 3/6): wireframe — vẽ từng trang trước khi viết JSP',
  slug: 'prj301-asm-wireframe',
  type: 'VIDEO',
  description: 'Bài tự thêm, chen giữa ASM.2 và ASM.3: wireframe là bản vẽ mặt bằng của một trang (hộp, nút, bấm đi đâu, ai được mở); phân biệt low-fi, hi-fi, mockup, prototype; quy ước vẽ; ví dụ trang chủ Nhà trọ sinh viên; đổi từng hộp thành Bootstrap 5 + JSP (_top.jspf, .row/.col-md-4 .card, form GET, ?page=), bảng màn hình nối sang Filter và báo cáo; công cụ giấy, draw.io, Figma; dùng AI có trách nhiệm; bài tập cho đề tài của nhóm kèm checklist và đáp án mẫu phòng khám.',
  content: [
    bi(`<span class="eyebrow">🧭 Course Assignment A–Z · between 2/6 and 3/6 · added by this site</span>
<h2>Between the database and the JSP: one drawing per page</h2>
<p class="lead">ASM.2 gave you the tables and <code>setup.sql</code>. ASM.3 writes the JSP pages. This short lesson sits in between, because that is where most teams skip a step and pay for it later: before anyone writes a view, the team draws every page as a <strong>wireframe</strong> and agrees on it.</p>
<div class="callout">🎯 <strong>The team flow:</strong> actors and functions (ASM.1) → ERD → <code>setup.sql</code> (ASM.2) → <strong>wireframe of every page (this lesson)</strong> → JSP + servlets (ASM.3) → Filters by role (ASM.4) → report (ASM.6). Each step uses the previous one: the wireframe shows columns from <code>setup.sql</code>, and its URLs and roles become your servlets and your Filter.</div>
<p>The example in this lesson is deliberately <em>not</em> the clinic: it is the home page of <strong>Nhà trọ sinh viên</strong> (student lodging), drawn by a real PRJ301 team. Seeing the method on a second topic is the best proof that it transfers to yours.</p>`,
    `<span class="eyebrow">🧭 Assignment A–Z · giữa 2/6 và 3/6 · phần web tự thêm</span>
<h2>Giữa cơ sở dữ liệu và JSP: mỗi trang một hình vẽ</h2>
<p class="lead">ASM.2 cho bạn các bảng và <code>setup.sql</code>. ASM.3 viết các trang JSP. Bài ngắn này nằm ở giữa, vì đó chính là chỗ đa số nhóm bỏ qua một bước rồi trả giá về sau: trước khi ai viết view nào, cả nhóm vẽ từng trang thành <strong>wireframe</strong> (bản phác khung giao diện) và thống nhất với nhau.</p>
<div class="callout">🎯 <strong>Luồng làm việc của nhóm:</strong> tác nhân và chức năng (ASM.1) → ERD → <code>setup.sql</code> (ASM.2) → <strong>wireframe từng trang (bài này)</strong> → JSP + servlet (ASM.3) → Filter theo vai trò (ASM.4) → báo cáo (ASM.6). Bước sau dùng kết quả bước trước: wireframe hiện các cột trong <code>setup.sql</code>, còn URL và vai trò ghi trên wireframe thành servlet và Filter của bạn.</div>
<p>Ví dụ trong bài cố ý <em>không</em> phải phòng khám: đó là trang chủ của <strong>Nhà trọ sinh viên</strong>, do một nhóm PRJ301 thật vẽ. Thấy cùng một cách làm trên đề tài thứ hai là bằng chứng tốt nhất rằng nó áp được cho đề tài của bạn.</p>`),
    bi(`<h2>1. What a wireframe is</h2>
<p>Think of a house. Nobody pours concrete first and decides where the kitchen goes later: an architect draws a <strong>floor plan</strong> — rooms as rectangles, doors as gaps, a label on everything, no paint colours. The plan exists so the owner, the builder and the electrician agree while changing it still costs an eraser.</p>
<p>A wireframe is the floor plan of one page. It shows four things and deliberately leaves out colours, fonts, real photos and exact pixels:</p>
<ul>
<li><strong>Boxes</strong> — which blocks exist and where: navbar, filter, list of cards, pagination, footer.</li>
<li><strong>Controls</strong> — every button, link, input and dropdown, with the real words on it.</li>
<li><strong>Where each click goes</strong> — a number on each clickable spot, and a note: which URL, GET or POST, what happens after.</li>
<li><strong>Who may open the page</strong> — its URL and the roles allowed (guest, logged-in, staff, admin).</li>
</ul>
<p>Five words that get mixed up in reports and in class:</p>
<table>
<thead><tr><th>Stage</th><th>What it looks like</th><th>Question it answers</th><th>Tool · time</th></tr></thead>
<tbody>
<tr><td>Sketch</td><td>pen on paper, rough boxes</td><td>roughly what is on the page?</td><td>paper · 2–5 min</td></tr>
<tr><td>Low-fidelity wireframe</td><td>grey boxes, real labels, numbered clicks</td><td>what goes where, where does each click go?</td><td>draw.io, Figma, paper · 10–30 min</td></tr>
<tr><td>High-fidelity wireframe</td><td>real spacing and text sizes, still mostly grey</td><td>does the real content fit?</td><td>Figma · 1–2 h</td></tr>
<tr><td>Mockup</td><td>final colours, fonts, icons — a static picture</td><td>what will it look like?</td><td>Figma · hours</td></tr>
<tr><td>Prototype</td><td>mockups or wireframes linked so you can click through</td><td>does the flow feel right?</td><td>Figma prototype mode · hours</td></tr>
<tr><td>Final UI</td><td>your JSP pages with real data</td><td>does it work?</td><td>NetBeans + Tomcat · weeks</td></tr>
</tbody>
</table>
<p>For PRJ301 the <strong>low-fidelity wireframe</strong> is what you need: fast enough for every page of every member, precise enough to code from.</p>`,
    `<h2>1. Wireframe là gì</h2>
<p>Hãy nghĩ tới một ngôi nhà. Không ai đổ bê tông trước rồi mới tính bếp đặt đâu: kiến trúc sư vẽ <strong>bản vẽ mặt bằng</strong> — phòng là hình chữ nhật, cửa là khoảng hở, chỗ nào cũng có nhãn, không có màu sơn. Bản vẽ có để chủ nhà, thợ xây, thợ điện thống nhất với nhau khi việc sửa vẫn chỉ tốn một cục tẩy.</p>
<p>Wireframe là bản vẽ mặt bằng của một trang. Nó cho thấy bốn thứ, và cố ý bỏ qua màu, phông chữ, ảnh thật, kích thước pixel:</p>
<ul>
<li><strong>Hộp</strong> — có những khối nào và nằm ở đâu: thanh điều hướng, bộ lọc, danh sách thẻ, phân trang, chân trang.</li>
<li><strong>Điều khiển</strong> — mọi nút, liên kết, ô nhập, ô chọn, ghi đúng chữ thật trên đó.</li>
<li><strong>Bấm đi đâu</strong> — mỗi chỗ bấm được có một số, kèm ghi chú: URL nào, GET hay POST, xong thì chuyện gì xảy ra.</li>
<li><strong>Ai được mở trang</strong> — URL của trang và các vai trò được vào (khách, đã đăng nhập, nhân viên, admin).</li>
</ul>
<p>Năm từ hay bị lẫn trong báo cáo và trên lớp:</p>
<table>
<thead><tr><th>Giai đoạn</th><th>Trông như thế nào</th><th>Trả lời câu hỏi gì</th><th>Công cụ · thời gian</th></tr></thead>
<tbody>
<tr><td>Phác thảo (sketch)</td><td>bút trên giấy, hộp nguệch ngoạc</td><td>đại khái trang có gì?</td><td>giấy · 2–5 phút</td></tr>
<tr><td>Wireframe low-fidelity (độ trung thực thấp)</td><td>hộp xám, chữ thật, chỗ bấm đánh số</td><td>cái gì ở đâu, bấm thì đi đâu?</td><td>draw.io, Figma, giấy · 10–30 phút</td></tr>
<tr><td>Wireframe high-fidelity (độ trung thực cao)</td><td>khoảng cách và cỡ chữ thật, vẫn chủ yếu là xám</td><td>nội dung thật có vừa không?</td><td>Figma · 1–2 giờ</td></tr>
<tr><td>Mockup</td><td>màu, phông, icon bản cuối — một ảnh tĩnh</td><td>trông sẽ ra sao?</td><td>Figma · vài giờ</td></tr>
<tr><td>Prototype (bản mẫu bấm được)</td><td>các mockup hoặc wireframe nối nhau để bấm thử</td><td>luồng đi có thuận không?</td><td>chế độ prototype của Figma · vài giờ</td></tr>
<tr><td>Giao diện thật (final UI)</td><td>các trang JSP của bạn với dữ liệu thật</td><td>có chạy không?</td><td>NetBeans + Tomcat · nhiều tuần</td></tr>
</tbody>
</table>
<p>Với PRJ301, thứ bạn cần là <strong>wireframe low-fidelity</strong>: đủ nhanh để mọi thành viên vẽ mọi trang của mình, đủ chính xác để code theo.</p>`),
    bi(`<h2>2. Why it is worth an evening</h2>
<ul>
<li><strong>Four or five people, one website.</strong> ASM.1 split the work by function, so each member builds different pages. Without a shared drawing you get four navbars, three button styles and two ways to paginate. With it, the team argues once — at the table — and codes once.</li>
<li><strong>Fewer rewrites.</strong> Drawing forces the questions you would otherwise meet halfway through a JSP: what does the list show when the filter finds nothing? Where does "Cancel" go? Does a guest see the "Book" button at all?</li>
<li><strong>It checks your database.</strong> Every box shows data. If the card says "Area: 20 m²" and <code>setup.sql</code> has no such column, you found the gap before writing a DAO. Go back to ASM.2 now, not in week four.</li>
<li><strong>It writes your servlet list and your Filter.</strong> The URL and role at the top of each wireframe are exactly the rows of the table in section 5 — the input of ASM.4.</li>
<li><strong>It is part of the report.</strong> Part 2 of the brief asks for design documents and screenshots of the interface (ASM.6). Later courses ask for the same, in more detail: SWP391 and SEP490 reports contain screen layouts and screen flows, and SWR302 asks for mockups of the requirements.</li>
<li><strong>Real jobs often have no designer.</strong> In small companies, freelance work and internal tools, the developer draws the screens. A client who sees a wireframe on day one tells you what is wrong while it is still free to fix.</li>
</ul>`,
    `<h2>2. Vì sao đáng bỏ ra một buổi tối</h2>
<ul>
<li><strong>Bốn, năm người, một website.</strong> ASM.1 chia việc theo chức năng, nên mỗi thành viên làm những trang khác nhau. Không có hình vẽ chung thì ra bốn thanh điều hướng, ba kiểu nút và hai cách phân trang. Có nó thì cả nhóm cãi nhau một lần — trên bàn — và code một lần.</li>
<li><strong>Ít phải làm lại.</strong> Vẽ buộc bạn trả lời những câu mà nếu không thì đang viết JSP giữa chừng mới gặp: lọc không ra kết quả thì danh sách hiện gì? Nút "Huỷ" về đâu? Khách chưa đăng nhập có thấy nút "Đặt" không?</li>
<li><strong>Nó soát lại CSDL của bạn.</strong> Hộp nào cũng hiện dữ liệu. Thẻ ghi "Diện tích: 20 m²" mà <code>setup.sql</code> không có cột đó thì bạn đã tìm ra lỗ hổng trước khi viết DAO. Quay lại ASM.2 ngay bây giờ, đừng để tới tuần thứ tư.</li>
<li><strong>Nó viết sẵn danh sách servlet và Filter.</strong> URL và vai trò ghi ở đầu mỗi wireframe chính là các dòng của bảng ở mục 5 — đầu vào của ASM.4.</li>
<li><strong>Nó là một phần báo cáo.</strong> Phần 2 của đề đòi tài liệu thiết kế và hình ảnh giao diện (ASM.6). Các môn sau đòi đúng thứ đó, chi tiết hơn: báo cáo SWP391 và SEP490 có bố cục màn hình và luồng màn hình, còn SWR302 yêu cầu mockup cho các yêu cầu.</li>
<li><strong>Đi làm thật thường không có designer.</strong> Ở công ty nhỏ, việc freelance và công cụ nội bộ, lập trình viên tự vẽ màn hình. Khách hàng thấy wireframe ngay ngày đầu sẽ chỉ ra chỗ sai khi sửa vẫn còn miễn phí.</li>
</ul>`),
    bi(`<h2>3. Conventions that make a wireframe readable</h2>
<p>These are habits most teams share — guidelines, not laws. Adapt them, but agree on them inside the team so every member's drawings look alike.</p>
<ol>
<li><strong>Grey by default.</strong> Black, white and greys. Colour only where it carries meaning: the one primary action of the page, or a status (available, rented, cancelled). If everything is coloured, nothing stands out.</li>
<li><strong>A crossed box is an image.</strong> A rectangle with an X through it means "a picture goes here".</li>
<li><strong>Real words on buttons.</strong> "View details", "Filter", "Book" — never "Button 1". Real labels are the text you will type into the JSP.</li>
<li><strong>Number every clickable spot and write its target.</strong> "② Filter ⇒ GET /rooms?typeId=…". An unnumbered click is a click nobody implements.</li>
<li><strong>Write the page URL and who may open it</strong> at the top. That line becomes a <code>@WebServlet</code> mapping and a rule in your Filter.</li>
</ol>
<p>Two more that matter for the marks: draw the <strong>empty and error states</strong> (no results, form errors in red under each field), and sketch the <strong>phone version</strong> — requirement 1.7 asks for a responsive front end, and the phone sketch tells you which Bootstrap breakpoint classes you need.</p>`,
    `<h2>3. Quy ước giúp wireframe dễ đọc</h2>
<p>Đây là thói quen đa số nhóm dùng chung — là hướng dẫn, không phải luật. Cứ điều chỉnh, nhưng trong nhóm phải thống nhất để hình của mọi thành viên trông giống nhau.</p>
<ol>
<li><strong>Mặc định là xám.</strong> Đen, trắng và các sắc xám. Chỉ tô màu khi màu mang nghĩa: hành động chính duy nhất của trang, hoặc trạng thái (còn trống, đã thuê, đã huỷ). Cái gì cũng có màu thì chẳng cái gì nổi bật.</li>
<li><strong>Hộp gạch chéo là ảnh.</strong> Hình chữ nhật có dấu X nghĩa là "chỗ này đặt ảnh".</li>
<li><strong>Chữ thật trên nút.</strong> "Xem chi tiết", "Lọc", "Đặt lịch" — không bao giờ ghi "Nút 1". Chữ thật chính là chữ bạn sẽ gõ vào JSP.</li>
<li><strong>Đánh số mọi chỗ bấm được và ghi đích đến.</strong> "② Lọc ⇒ GET /rooms?typeId=…". Chỗ bấm không đánh số là chỗ không ai làm.</li>
<li><strong>Ghi URL của trang và ai được mở</strong> ở trên cùng. Dòng đó sẽ thành một mapping <code>@WebServlet</code> và một luật trong Filter.</li>
</ol>
<p>Thêm hai thói quen ảnh hưởng tới điểm: vẽ <strong>trạng thái rỗng và trạng thái lỗi</strong> (không có kết quả, lỗi form màu đỏ dưới từng ô), và phác <strong>bản điện thoại</strong> — yêu cầu 1.7 đòi giao diện responsive, và hình phác trên điện thoại cho bạn biết cần class breakpoint nào của Bootstrap.</p>`),
    bi(`<h2>4. Worked example: the home page of "Nhà trọ sinh viên"</h2>
<p>Topic: a lodging house for students. Guests browse available rooms; tenants and the landlord log in for their own pages. This is the team's wireframe of the home page — page 1 of their list, drawn in draw.io before any JSP existed.</p>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/WIREFRAME/v1/nha-tro-sv/001.webp" alt="Low-fidelity wireframe of the student-lodging home page: navbar, filter panel on the left, a 3 by 2 grid of room cards with crossed image boxes, pagination, footer, and seven numbered notes on the right" loading="lazy" width="1600" height="1150" /><p class="chu-thich">🖼️ Wireframe of the home page (UC01): grey boxes, crossed images, real labels, seven numbered clicks with their targets; URL, access and owner written at the top.</p></div>
<p>Read it like a developer:</p>
<ul>
<li><strong>Top line</strong> — URL <code>/rooms?typeId=&amp;minPrice=&amp;maxPrice=&amp;floor=&amp;page=</code>, open to everyone, use case UC01, and which member builds it. Route, parameters, access rule and owner, in one line.</li>
<li><strong>① Navbar</strong> — shared by every page (<code>_top.jspf</code>); after login the two buttons become the user's name and "Log out".</li>
<li><strong>② Filter</strong> — a GET form back to the same URL that keeps what the user typed. GET because filtering only reads, so the URL can be bookmarked and reloaded.</li>
<li><strong>③ Cards</strong> — "one card = one ACTIVE room with no ACTIVE contract". That is a business rule (requirement 1.2) written on the drawing; it becomes the WHERE clause of the DAO.</li>
<li><strong>④ View details</strong> — <code>/rooms/detail?id=3</code>: the next page to draw.</li>
<li><strong>⑤ Pagination</strong> — six rooms per page, <code>?page=2</code>, through a custom tag (requirement 1.8), keeping the filter parameters.</li>
<li><strong>⑥ Empty state</strong> — "No matching rooms" plus "Clear filters".</li>
<li><strong>⑦ Log in / Sign up</strong> — <code>/login</code>, <code>/register</code>.</li>
</ul>
<p>Only the "Filter" button and the current page are shaded darker — the two places where emphasis means something.</p>`,
    `<h2>4. Ví dụ: trang chủ "Nhà trọ sinh viên"</h2>
<p>Đề tài: một khu nhà trọ cho sinh viên. Khách xem các phòng còn trống; người thuê và chủ trọ đăng nhập để vào trang của mình. Đây là wireframe trang chủ của nhóm — trang 1 trong danh sách trang của họ, vẽ bằng draw.io khi chưa có JSP nào.</p>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/WIREFRAME/v1/nha-tro-sv/001.webp" alt="Wireframe độ trung thực thấp trang chủ Nhà trọ sinh viên: thanh điều hướng, bộ lọc bên trái, lưới 3 x 2 thẻ phòng với ô ảnh gạch chéo, phân trang, chân trang và bảy ghi chú đánh số bên phải" loading="lazy" width="1600" height="1150" /><p class="chu-thich">🖼️ Wireframe trang chủ (UC01): hộp xám, ảnh gạch chéo, chữ thật, bảy chỗ bấm đánh số kèm đích đến; URL, quyền truy cập và người làm ghi ở trên cùng.</p></div>
<p>Đọc nó bằng con mắt người code:</p>
<ul>
<li><strong>Dòng đầu</strong> — URL <code>/rooms?typeId=&amp;minPrice=&amp;maxPrice=&amp;floor=&amp;page=</code>, ai cũng vào được, use case UC01, và thành viên nào làm. Route, tham số, luật truy cập và người phụ trách — trong một dòng.</li>
<li><strong>① Thanh điều hướng</strong> — dùng chung mọi trang (<code>_top.jspf</code>); đăng nhập rồi thì hai nút thành tên người dùng và "Đăng xuất".</li>
<li><strong>② Bộ lọc</strong> — form GET về chính URL đó, giữ lại những gì người dùng đã nhập. GET vì lọc chỉ đọc, nên URL lưu dấu trang và tải lại được.</li>
<li><strong>③ Thẻ phòng</strong> — "mỗi thẻ = 1 phòng ACTIVE và chưa có hợp đồng ACTIVE". Đó là một luật nghiệp vụ (yêu cầu 1.2) ghi ngay trên hình vẽ; nó sẽ thành mệnh đề WHERE của DAO.</li>
<li><strong>④ Xem chi tiết</strong> — <code>/rooms/detail?id=3</code>: trang tiếp theo cần vẽ.</li>
<li><strong>⑤ Phân trang</strong> — sáu phòng mỗi trang, <code>?page=2</code>, qua một custom tag (yêu cầu 1.8), giữ nguyên tham số lọc.</li>
<li><strong>⑥ Trạng thái rỗng</strong> — "Không tìm thấy phòng phù hợp" kèm "Xoá bộ lọc".</li>
<li><strong>⑦ Đăng nhập / Đăng ký</strong> — <code>/login</code>, <code>/register</code>.</li>
</ul>
<p>Chỉ nút "Lọc" và trang hiện tại được tô đậm hơn — hai chỗ mà sự nhấn mạnh có ý nghĩa.</p>`),
    bi(`<h2>5. From wireframe to Bootstrap 5 + JSP</h2>
<p>A good wireframe translates box by box. One rule from the numbers: <strong>a note that says "⇒ a URL" is a link (<code>&lt;a&gt;</code>, GET); a note that saves, deletes or pays is a <code>&lt;button&gt;</code> inside a <code>&lt;form method="post"&gt;</code>.</strong></p>
<table>
<thead><tr><th>Wireframe box</th><th>Bootstrap 5 / JSP</th><th>Server side</th></tr></thead>
<tbody>
<tr><td>① Navbar</td><td><code>_top.jspf</code> included by every page: <code>.navbar .navbar-expand-lg</code>, <code>c:choose</code> on the logged-in user</td><td>session attribute set at login (ASM.4)</td></tr>
<tr><td>② Filter</td><td><code>.col-lg-3</code> holding <code>&lt;form method="get"&gt;</code>, <code>.form-select</code>, values kept with <code>param</code></td><td><code>doGet</code> reads <code>typeId</code>, <code>minPrice</code>, <code>maxPrice</code>, <code>floor</code></td></tr>
<tr><td>③ Card grid</td><td><code>.col-lg-9</code> holding <code>.row</code>, then <code>.col-md-4</code> holding <code>.card</code>, inside <code>c:forEach</code></td><td>DAO: the business rule as WHERE, OFFSET … FETCH</td></tr>
<tr><td>Crossed box</td><td><code>.card-img-top</code> with an <code>alt</code></td><td>image path column, or a placeholder</td></tr>
<tr><td>④ View details</td><td><code>&lt;a class="btn" href="…/rooms/detail?id=…"&gt;</code></td><td>a second servlet, <code>/rooms/detail</code></td></tr>
<tr><td>⑤ Pagination</td><td>your pager custom tag (like <code>pk:pager</code> in ASM.3)</td><td><code>page</code> parameter, total count query</td></tr>
<tr><td>⑥ Empty state</td><td><code>c:if test="&#36;{empty rooms}"</code></td><td>nothing — the list is simply empty</td></tr>
<tr><td>⑦ Log in / Sign up</td><td>links in <code>_top.jspf</code></td><td><code>/login</code>, <code>/register</code></td></tr>
</tbody>
</table>
<p>The skeleton below is the wireframe turned into a JSP view. It is an illustration for this topic (it has not been run); the clinic version that does run, with real responses, is in ASM.3.</p>
<pre><code class="language-html">&lt;%@ include file="/WEB-INF/views/_taglibs.jspf" %&gt;
&lt;c:set var="pageTitle" value="Phòng còn trống"/&gt;
&lt;%@ include file="/WEB-INF/views/_top.jspf" %&gt;           &lt;%-- (1) navbar --%&gt;
&lt;h1 class="h3"&gt;Phòng còn trống&lt;/h1&gt;
&lt;p class="text-muted"&gt;Tìm thấy &#36;{total} phòng&lt;/p&gt;
&lt;div class="row g-4"&gt;
  &lt;div class="col-lg-3"&gt;                                  &lt;%-- (2) filter --%&gt;
    &lt;form method="get" action="&#36;{pageContext.request.contextPath}/rooms" class="card card-body"&gt;
      &lt;label class="form-label" for="typeId"&gt;Loại phòng&lt;/label&gt;
      &lt;select class="form-select" id="typeId" name="typeId"&gt;
        &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
        &lt;c:forEach items="&#36;{types}" var="t"&gt;
          &lt;option value="&#36;{t.id}" &#36;{param.typeId == t.id ? 'selected' : ''}&gt;&lt;c:out value="&#36;{t.name}"/&gt;&lt;/option&gt;
        &lt;/c:forEach&gt;
      &lt;/select&gt;
      &lt;%-- minPrice, maxPrice, floor: same pattern, value="&#36;{fn:escapeXml(param.minPrice)}" --%&gt;
      &lt;button class="btn btn-primary mt-3"&gt;Lọc&lt;/button&gt;
      &lt;a class="small mt-2" href="&#36;{pageContext.request.contextPath}/rooms"&gt;Xoá bộ lọc&lt;/a&gt;
    &lt;/form&gt;
  &lt;/div&gt;
  &lt;div class="col-lg-9"&gt;
    &lt;c:if test="&#36;{empty rooms}"&gt;                          &lt;%-- (6) empty state --%&gt;
      &lt;p&gt;Không tìm thấy phòng phù hợp.&lt;/p&gt;
    &lt;/c:if&gt;
    &lt;div class="row g-3"&gt;                                 &lt;%-- (3) cards --%&gt;
      &lt;c:forEach items="&#36;{rooms}" var="r"&gt;
        &lt;div class="col-md-4"&gt;
          &lt;div class="card h-100"&gt;
            &lt;img class="card-img-top" src="&#36;{r.imageUrl}" alt="Phòng &#36;{r.code}"&gt;
            &lt;div class="card-body"&gt;
              &lt;h2 class="h5"&gt;&lt;c:out value="&#36;{r.code}"/&gt;&lt;/h2&gt;
              &lt;p class="mb-1"&gt;Diện tích: &#36;{r.area} m²&lt;/p&gt;
              &lt;p class="fw-bold"&gt;&lt;fmt:formatNumber value="&#36;{r.price}" pattern="#,##0"/&gt; đ / tháng&lt;/p&gt;
              &lt;a class="btn btn-outline-secondary w-100"
                 href="&#36;{pageContext.request.contextPath}/rooms/detail?id=&#36;{r.id}"&gt;Xem chi tiết&lt;/a&gt;  &lt;%-- (4) --%&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/c:forEach&gt;
    &lt;/div&gt;
    &lt;nt:pager page="&#36;{page}"/&gt;                            &lt;%-- (5) your custom tag, keeps the filter --%&gt;
  &lt;/div&gt;
&lt;/div&gt;
&lt;%@ include file="/WEB-INF/views/_bottom.jspf" %&gt;</code></pre>
<p>On a phone (<code>col-lg-3</code> and <code>col-lg-9</code> become full width), the filter sits above the cards and <code>col-md-4</code> gives one card per row below 768 px, three above — exactly the phone sketch next to the desktop one.</p>
<p>Note ③ goes into the DAO almost word for word (illustrative table names — use yours from <code>setup.sql</code>):</p>
<pre><code class="language-sql">WHERE r.status = 'ACTIVE'
  AND NOT EXISTS (SELECT 1 FROM Contract c
                  WHERE c.roomId = r.roomId AND c.status = 'ACTIVE')</code></pre>
<p>Then list the pages — one row per wireframe. This table is your servlet list, the input of the Filter in ASM.4, and a ready-made section of the report:</p>
<table>
<thead><tr><th>#</th><th>URL</th><th>View (JSP)</th><th>Servlet</th><th>Who may open it</th></tr></thead>
<tbody>
<tr><td>UC01</td><td><code>GET /rooms</code></td><td><code>rooms.jsp</code></td><td><code>RoomListServlet</code></td><td>everyone</td></tr>
<tr><td>UC02</td><td><code>GET /rooms/detail?id=</code></td><td><code>room-detail.jsp</code></td><td><code>RoomDetailServlet</code></td><td>everyone</td></tr>
<tr><td>—</td><td><code>GET, POST /login</code></td><td><code>login.jsp</code></td><td><code>LoginServlet</code></td><td>guests</td></tr>
<tr><td>—</td><td><code>GET, POST /register</code></td><td><code>register.jsp</code></td><td><code>RegisterServlet</code></td><td>guests</td></tr>
<tr><td>…</td><td>one row per page you drew</td><td>…</td><td>…</td><td>the role written on the wireframe</td></tr>
</tbody>
</table>
<div class="pitfall">Pagination that forgets the filter: page 2 of "double rooms under 3 million" must be <code>/rooms?typeId=2&amp;maxPrice=3000000&amp;page=2</code>. A pager that writes only <code>?page=2</code> silently drops the filter — note ⑤ exists precisely to stop that. Build the link from all current parameters (in the tag, or with <code>c:url</code> + <code>c:param</code>).</div>`,
    `<h2>5. Từ wireframe sang Bootstrap 5 + JSP</h2>
<p>Một wireframe tốt dịch ra từng hộp một. Một quy tắc rút từ các con số: <strong>ghi chú nói "⇒ một URL" là liên kết (<code>&lt;a&gt;</code>, GET); ghi chú lưu, xoá hay thanh toán là <code>&lt;button&gt;</code> nằm trong <code>&lt;form method="post"&gt;</code>.</strong></p>
<table>
<thead><tr><th>Hộp trên wireframe</th><th>Bootstrap 5 / JSP</th><th>Phía server</th></tr></thead>
<tbody>
<tr><td>① Thanh điều hướng</td><td><code>_top.jspf</code> mọi trang include: <code>.navbar .navbar-expand-lg</code>, <code>c:choose</code> theo người đã đăng nhập</td><td>attribute trong session đặt lúc đăng nhập (ASM.4)</td></tr>
<tr><td>② Bộ lọc</td><td><code>.col-lg-3</code> chứa <code>&lt;form method="get"&gt;</code>, <code>.form-select</code>, giữ giá trị bằng <code>param</code></td><td><code>doGet</code> đọc <code>typeId</code>, <code>minPrice</code>, <code>maxPrice</code>, <code>floor</code></td></tr>
<tr><td>③ Lưới thẻ</td><td><code>.col-lg-9</code> chứa <code>.row</code>, rồi <code>.col-md-4</code> chứa <code>.card</code>, trong <code>c:forEach</code></td><td>DAO: luật nghiệp vụ thành WHERE, OFFSET … FETCH</td></tr>
<tr><td>Hộp gạch chéo</td><td><code>.card-img-top</code> có <code>alt</code></td><td>cột đường dẫn ảnh, hoặc ảnh giữ chỗ</td></tr>
<tr><td>④ Xem chi tiết</td><td><code>&lt;a class="btn" href="…/rooms/detail?id=…"&gt;</code></td><td>servlet thứ hai, <code>/rooms/detail</code></td></tr>
<tr><td>⑤ Phân trang</td><td>custom tag phân trang của nhóm (như <code>pk:pager</code> ở ASM.3)</td><td>tham số <code>page</code>, câu đếm tổng số dòng</td></tr>
<tr><td>⑥ Trạng thái rỗng</td><td><code>c:if test="&#36;{empty rooms}"</code></td><td>không có gì — danh sách chỉ đơn giản là rỗng</td></tr>
<tr><td>⑦ Đăng nhập / Đăng ký</td><td>liên kết trong <code>_top.jspf</code></td><td><code>/login</code>, <code>/register</code></td></tr>
</tbody>
</table>
<p>Bộ khung dưới đây là wireframe đổi thành một view JSP. Đây là khung minh hoạ cho đề tài này (chưa chạy); bản phòng khám chạy thật, có response thật, nằm ở ASM.3.</p>
<pre><code class="language-html">&lt;%@ include file="/WEB-INF/views/_taglibs.jspf" %&gt;
&lt;c:set var="pageTitle" value="Phòng còn trống"/&gt;
&lt;%@ include file="/WEB-INF/views/_top.jspf" %&gt;           &lt;%-- (1) thanh điều hướng --%&gt;
&lt;h1 class="h3"&gt;Phòng còn trống&lt;/h1&gt;
&lt;p class="text-muted"&gt;Tìm thấy &#36;{total} phòng&lt;/p&gt;
&lt;div class="row g-4"&gt;
  &lt;div class="col-lg-3"&gt;                                  &lt;%-- (2) bộ lọc --%&gt;
    &lt;form method="get" action="&#36;{pageContext.request.contextPath}/rooms" class="card card-body"&gt;
      &lt;label class="form-label" for="typeId"&gt;Loại phòng&lt;/label&gt;
      &lt;select class="form-select" id="typeId" name="typeId"&gt;
        &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
        &lt;c:forEach items="&#36;{types}" var="t"&gt;
          &lt;option value="&#36;{t.id}" &#36;{param.typeId == t.id ? 'selected' : ''}&gt;&lt;c:out value="&#36;{t.name}"/&gt;&lt;/option&gt;
        &lt;/c:forEach&gt;
      &lt;/select&gt;
      &lt;%-- minPrice, maxPrice, floor: cùng kiểu, value="&#36;{fn:escapeXml(param.minPrice)}" --%&gt;
      &lt;button class="btn btn-primary mt-3"&gt;Lọc&lt;/button&gt;
      &lt;a class="small mt-2" href="&#36;{pageContext.request.contextPath}/rooms"&gt;Xoá bộ lọc&lt;/a&gt;
    &lt;/form&gt;
  &lt;/div&gt;
  &lt;div class="col-lg-9"&gt;
    &lt;c:if test="&#36;{empty rooms}"&gt;                          &lt;%-- (6) trạng thái rỗng --%&gt;
      &lt;p&gt;Không tìm thấy phòng phù hợp.&lt;/p&gt;
    &lt;/c:if&gt;
    &lt;div class="row g-3"&gt;                                 &lt;%-- (3) lưới thẻ --%&gt;
      &lt;c:forEach items="&#36;{rooms}" var="r"&gt;
        &lt;div class="col-md-4"&gt;
          &lt;div class="card h-100"&gt;
            &lt;img class="card-img-top" src="&#36;{r.imageUrl}" alt="Phòng &#36;{r.code}"&gt;
            &lt;div class="card-body"&gt;
              &lt;h2 class="h5"&gt;&lt;c:out value="&#36;{r.code}"/&gt;&lt;/h2&gt;
              &lt;p class="mb-1"&gt;Diện tích: &#36;{r.area} m²&lt;/p&gt;
              &lt;p class="fw-bold"&gt;&lt;fmt:formatNumber value="&#36;{r.price}" pattern="#,##0"/&gt; đ / tháng&lt;/p&gt;
              &lt;a class="btn btn-outline-secondary w-100"
                 href="&#36;{pageContext.request.contextPath}/rooms/detail?id=&#36;{r.id}"&gt;Xem chi tiết&lt;/a&gt;  &lt;%-- (4) --%&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/c:forEach&gt;
    &lt;/div&gt;
    &lt;nt:pager page="&#36;{page}"/&gt;                            &lt;%-- (5) custom tag của nhóm, giữ bộ lọc --%&gt;
  &lt;/div&gt;
&lt;/div&gt;
&lt;%@ include file="/WEB-INF/views/_bottom.jspf" %&gt;</code></pre>
<p>Trên điện thoại (<code>col-lg-3</code> và <code>col-lg-9</code> thành tràn ngang), bộ lọc nằm trên các thẻ, còn <code>col-md-4</code> cho một thẻ mỗi hàng khi hẹp hơn 768 px, ba thẻ khi rộng hơn — đúng như hình phác điện thoại đặt cạnh bản máy tính.</p>
<p>Ghi chú ③ đi vào DAO gần như nguyên văn (tên bảng minh hoạ — dùng tên của bạn trong <code>setup.sql</code>):</p>
<pre><code class="language-sql">WHERE r.status = 'ACTIVE'
  AND NOT EXISTS (SELECT 1 FROM Contract c
                  WHERE c.roomId = r.roomId AND c.status = 'ACTIVE')</code></pre>
<p>Rồi liệt kê các trang — mỗi wireframe một dòng. Bảng này là danh sách servlet của bạn, đầu vào của Filter ở ASM.4, và một mục báo cáo làm sẵn:</p>
<table>
<thead><tr><th>#</th><th>URL</th><th>View (JSP)</th><th>Servlet</th><th>Ai được mở</th></tr></thead>
<tbody>
<tr><td>UC01</td><td><code>GET /rooms</code></td><td><code>rooms.jsp</code></td><td><code>RoomListServlet</code></td><td>mọi người</td></tr>
<tr><td>UC02</td><td><code>GET /rooms/detail?id=</code></td><td><code>room-detail.jsp</code></td><td><code>RoomDetailServlet</code></td><td>mọi người</td></tr>
<tr><td>—</td><td><code>GET, POST /login</code></td><td><code>login.jsp</code></td><td><code>LoginServlet</code></td><td>khách chưa đăng nhập</td></tr>
<tr><td>—</td><td><code>GET, POST /register</code></td><td><code>register.jsp</code></td><td><code>RegisterServlet</code></td><td>khách chưa đăng nhập</td></tr>
<tr><td>…</td><td>mỗi trang bạn vẽ một dòng</td><td>…</td><td>…</td><td>vai trò ghi trên wireframe</td></tr>
</tbody>
</table>
<div class="pitfall">Phân trang quên bộ lọc: trang 2 của "phòng đôi dưới 3 triệu" phải là <code>/rooms?typeId=2&amp;maxPrice=3000000&amp;page=2</code>. Thẻ phân trang chỉ ghi <code>?page=2</code> sẽ lặng lẽ làm mất bộ lọc — ghi chú ⑤ có ra là để chặn đúng chuyện đó. Dựng liên kết từ mọi tham số hiện tại (trong tag, hoặc bằng <code>c:url</code> + <code>c:param</code>).</div>`),
    bi(`<h2>6. Tools — and where to keep the drawings</h2>
<ul>
<li><strong>Paper</strong> — the fastest for the first idea. Three versions in ten minutes, photograph the winner, post it in the team chat.</li>
<li><strong>draw.io (diagrams.net)</strong> — free, in the browser or as a desktop app, with a "Mockups" shape library (buttons, inputs, browser window). The example above was made with it. It saves a <code>.drawio</code> file you can commit.</li>
<li><strong>Figma</strong> — free starter plan, plus an education plan for verified students; several members can edit the same file at once, and it grows into mockups and clickable prototypes when a later course asks for them.</li>
<li>Others: Excalidraw (hand-drawn look), Penpot (open source). One tool per team.</li>
</ul>
<p>Keep them <strong>in the repository</strong>, next to <code>setup.sql</code>: for example <code>docs/wireframe/01-trang-chu.drawio</code> plus an exported <code>01-trang-chu.png</code> for the report. When a page changes, the drawing changes in the same commit — the same rule ASM.2 gave for the database script.</p>`,
    `<h2>6. Công cụ — và cất hình vẽ ở đâu</h2>
<ul>
<li><strong>Giấy</strong> — nhanh nhất cho ý tưởng đầu. Ba phương án trong mười phút, chụp bản thắng, gửi vào nhóm chat.</li>
<li><strong>draw.io (diagrams.net)</strong> — miễn phí, chạy trên trình duyệt hoặc bản cài máy tính, có thư viện hình "Mockups" (nút, ô nhập, khung trình duyệt). Ví dụ ở trên vẽ bằng nó. Nó lưu thành file <code>.drawio</code> commit được.</li>
<li><strong>Figma</strong> — có gói miễn phí, và gói Education cho sinh viên đã xác minh; nhiều thành viên sửa cùng một file một lúc, và file đó lớn dần thành mockup, prototype bấm được khi môn sau đòi.</li>
<li>Khác: Excalidraw (nét vẽ tay), Penpot (mã nguồn mở). Mỗi nhóm một công cụ.</li>
</ul>
<p>Cất chúng <strong>trong repository</strong>, cạnh <code>setup.sql</code>: ví dụ <code>docs/wireframe/01-trang-chu.drawio</code> kèm bản xuất <code>01-trang-chu.png</code> để đưa vào báo cáo. Trang đổi thì hình đổi trong cùng một commit — đúng quy tắc ASM.2 đặt ra cho script CSDL.</p>`),
    bi(`<h2>7. Wireframe to code with AI — responsibly</h2>
<p>An AI assistant can read a wireframe image and write a JSP in seconds. Useful — and dangerous for an Assignment that ends with a <strong>defence</strong>, where the marker points at a line and asks why it is there. The rule: <strong>you design, the AI types, you verify and can explain every line.</strong></p>
<ol>
<li>The wireframe, the table of pages and <code>setup.sql</code> are yours. Those decisions are the work being graded.</li>
<li>Give the AI all three plus the rules of this course: JSP under <code>WEB-INF/views</code>, JSTL and EL with no scriptlets, Bootstrap 5 classes, <code>jakarta.*</code> imports, the exact column and attribute names you have.</li>
<li>Ask for one page at a time, as a skeleton.</li>
<li>Check it against the numbers: every ① to ⑦ must be there with the right URL and method; anything extra gets questioned or deleted.</li>
<li>Run it on Tomcat, at phone width and desktop width. If you cannot explain a line, you do not own it yet — and in the defence that shows within a minute.</li>
</ol>
<pre><code class="language-plaintext">Attached: wireframe of page UC01 (image) and our setup.sql.
Write ONLY /WEB-INF/views/rooms.jsp for a Jakarta EE 10 app on Tomcat 10.1:
- include _taglibs.jspf, _top.jspf, _bottom.jspf (they exist)
- Bootstrap 5: filter in .col-lg-3, cards in .col-lg-9 &gt; .row &gt; .col-md-4 &gt; .card
- JSTL + EL only, no scriptlets; c:out for every text that comes from the database
- request attributes: rooms (List&lt;Room&gt;), types, total, page
- use ONLY columns that exist in setup.sql; do not add fields
- mark each numbered element of the wireframe with a JSP comment (1)…(7)</code></pre>
<div class="pitfall">What AI typically adds: scriptlets (<code>&lt;% … %&gt;</code>) instead of JSTL, <code>javax.servlet</code> imports that do not compile on Tomcat 10, a SQL query inside the JSP (breaks MVC, requirement 1.3), a "rating" or "owner phone" field that is not in your database, raw <code>&#36;{…}</code> output of user text where <code>c:out</code> was needed. Each one costs marks or opens a security hole — and "the AI wrote it" is not an answer the panel accepts.</div>`,
    `<h2>7. Từ wireframe sang code bằng AI — có trách nhiệm</h2>
<p>Trợ lý AI đọc được ảnh wireframe và viết JSP trong vài giây. Có ích — và nguy hiểm với một Assignment kết thúc bằng buổi <strong>bảo vệ</strong>, nơi người chấm chỉ vào một dòng và hỏi vì sao nó ở đó. Luật là: <strong>bạn thiết kế, AI gõ phím, bạn kiểm và giải thích được từng dòng.</strong></p>
<ol>
<li>Wireframe, bảng các trang và <code>setup.sql</code> là của bạn. Các quyết định đó mới là phần được chấm.</li>
<li>Đưa AI cả ba thứ kèm luật của môn: JSP nằm dưới <code>WEB-INF/views</code>, JSTL và EL không scriptlet, class Bootstrap 5, import <code>jakarta.*</code>, đúng tên cột và thuộc tính bạn đang có.</li>
<li>Xin từng trang một, dạng bộ khung.</li>
<li>So với các con số: đủ ① tới ⑦ với đúng URL và method; thứ gì thừa thì hỏi lại hoặc xoá.</li>
<li>Chạy trên Tomcat, ở bề ngang điện thoại và máy tính. Dòng nào chưa giải thích được thì nó chưa phải của bạn — và lúc bảo vệ, điều đó lộ ra trong một phút.</li>
</ol>
<pre><code class="language-plaintext">Đính kèm: wireframe trang UC01 (ảnh) và setup.sql của nhóm.
CHỈ viết /WEB-INF/views/rooms.jsp cho app Jakarta EE 10 chạy Tomcat 10.1:
- include _taglibs.jspf, _top.jspf, _bottom.jspf (đã có sẵn)
- Bootstrap 5: bộ lọc trong .col-lg-3, thẻ trong .col-lg-9 &gt; .row &gt; .col-md-4 &gt; .card
- chỉ JSTL + EL, không scriptlet; c:out cho mọi chữ lấy từ CSDL
- attribute của request: rooms (List&lt;Room&gt;), types, total, page
- CHỈ dùng các cột có trong setup.sql; không thêm trường
- đánh dấu mỗi phần tử có số trên wireframe bằng chú thích JSP (1)…(7)</code></pre>
<div class="pitfall">Những thứ AI hay tự thêm: scriptlet (<code>&lt;% … %&gt;</code>) thay cho JSTL, import <code>javax.servlet</code> không biên dịch được trên Tomcat 10, câu SQL nằm trong JSP (phá MVC, yêu cầu 1.3), trường "đánh giá" hay "số điện thoại chủ trọ" không có trong CSDL, in thẳng <code>&#36;{…}</code> chữ người dùng nhập ở chỗ cần <code>c:out</code>. Mỗi cái làm mất điểm hoặc mở một lỗ hổng bảo mật — và "AI viết đấy ạ" không phải câu trả lời hội đồng chấp nhận.</div>`),
    bi(`<h2>🧪 Do it now for YOUR topic (45–60 minutes)</h2>
<ol>
<li>From your function table (ASM.1), list every page. Most topics have 8–15.</li>
<li>Each member wireframes the pages of the functions they own. Start with two: the <strong>list page of your main entity</strong> and the page of your <strong>central transaction</strong> (booking, borrowing, ordering…).</li>
<li>Meet for 20 minutes, put all drawings side by side, and agree on the shared parts: navbar, buttons, pagination, how errors look.</li>
<li>Fill the table of pages of section 5 and commit drawings + table next to <code>setup.sql</code>.</li>
</ol>
<p><strong>Check yourself:</strong></p>
<ul>
<li>☐ Every page has its URL and allowed roles at the top.</li>
<li>☐ Every clickable spot is numbered with its target: URL, GET or POST, where it goes after success and after an error.</li>
<li>☐ Buttons carry real words; grey everywhere except the primary action and statuses.</li>
<li>☐ Every box shows data that exists in <code>setup.sql</code> (or you fixed <code>setup.sql</code>).</li>
<li>☐ Business rules are written as notes on the drawing.</li>
<li>☐ Empty state and form errors are drawn; a phone sketch exists (1.7).</li>
<li>☐ Each page has an owner, and the table of pages has one row per drawing.</li>
<li>☐ A teammate can explain your page from the drawing without you talking.</li>
</ul>
<div class="dap-an">✅ <strong>Sample answer — the clinic's central transaction</strong>, drawn on paper level for the page that ASM.3 really builds:
<pre><code class="language-plaintext">URL: GET /patient/appointments/new?doctorId=…      Who: PATIENT only (Filter, ASM.4)
+------------------------------------------------------------+
| [Navbar from _top.jspf]                  Nguyễn Thị Hoa  ▾ |
+------------------------------------------------------------+
| Đặt lịch với BS. Nguyễn Văn An                             |
| Nội tổng quát · phòng P.101                                |
|                                                            |
| (1) Dịch vụ  [ Khám nội tổng quát — 200.000 đ      v ]     |
| (2) Ngày     [ dd/mm/yyyy ]   (3) Giờ [ 08:00  v ]         |
| (4) Lý do khám (tuỳ chọn)  [                           ]   |
|                                                            |
| (5) [ Đặt lịch ]                                           |
+------------------------------------------------------------+
(5) POST /patient/appointments/create
    OK    -&gt; redirect /patient/appointments + green flash
    error -&gt; 409, same form, red message under the wrong field,
             values kept; slot taken -&gt; message under (3)
Rules: date from tomorrow to 30 days ahead; one doctor,
       one slot (filtered unique index, ASM.2)</code></pre>
<p>Compare with <code>booking-form.jsp</code> in ASM.3: every number became one form field or the button, and both outcomes of (5) are handled there.</p></div>
<h2>Going further</h2>
<p>The HTML/CSS-only version of this lesson, for the Web Foundations course, is <a href="/courses/web-foundations/learn?lessonSlug=wf-3-5b-wireframes">3.5b — Wireframes for developers</a>. For depth — sketching techniques, high-fidelity wireframes, Figma, prototypes and user testing — see Chapter 4 of <a href="/courses/ux-ui-for-developers/learn?lessonSlug=uxui-4-1-phac-thao">UX/UI for Developers (4.1 Sketching and low-fidelity wireframes)</a>; note that this course is still an outline being written.</p>`,
    `<h2>🧪 Làm ngay cho đề tài CỦA BẠN (45–60 phút)</h2>
<ol>
<li>Từ bảng chức năng (ASM.1), liệt kê mọi trang. Đa số đề tài có 8–15 trang.</li>
<li>Mỗi thành viên vẽ wireframe các trang của chức năng mình phụ trách. Bắt đầu bằng hai trang: <strong>trang danh sách của thực thể chính</strong> và trang của <strong>giao dịch trung tâm</strong> (đặt lịch, mượn sách, đặt hàng…).</li>
<li>Họp 20 phút, đặt mọi hình cạnh nhau, thống nhất phần dùng chung: thanh điều hướng, nút, phân trang, lỗi trông thế nào.</li>
<li>Điền bảng các trang ở mục 5, commit hình vẽ + bảng cạnh <code>setup.sql</code>.</li>
</ol>
<p><strong>Tự kiểm:</strong></p>
<ul>
<li>☐ Trang nào cũng có URL và các vai trò được vào ở trên cùng.</li>
<li>☐ Mọi chỗ bấm được đều đánh số kèm đích đến: URL, GET hay POST, thành công thì đi đâu, lỗi thì đi đâu.</li>
<li>☐ Nút mang chữ thật; toàn xám trừ hành động chính và trạng thái.</li>
<li>☐ Hộp nào cũng hiện dữ liệu có trong <code>setup.sql</code> (hoặc bạn đã sửa <code>setup.sql</code>).</li>
<li>☐ Luật nghiệp vụ được ghi thành ghi chú trên hình.</li>
<li>☐ Có vẽ trạng thái rỗng và lỗi form; có hình phác điện thoại (1.7).</li>
<li>☐ Trang nào cũng có người phụ trách, và bảng các trang có đúng một dòng cho mỗi hình.</li>
<li>☐ Một bạn trong nhóm nhìn hình là giải thích được trang của bạn, không cần bạn nói.</li>
</ul>
<div class="dap-an">✅ <strong>Đáp án mẫu — giao dịch trung tâm của phòng khám</strong>, vẽ ở mức giấy bút cho đúng trang mà ASM.3 dựng thật:
<pre><code class="language-plaintext">URL: GET /patient/appointments/new?doctorId=…      Ai vào: chỉ PATIENT (Filter, ASM.4)
+------------------------------------------------------------+
| [Navbar từ _top.jspf]                    Nguyễn Thị Hoa  ▾ |
+------------------------------------------------------------+
| Đặt lịch với BS. Nguyễn Văn An                             |
| Nội tổng quát · phòng P.101                                |
|                                                            |
| (1) Dịch vụ  [ Khám nội tổng quát — 200.000 đ      v ]     |
| (2) Ngày     [ dd/mm/yyyy ]   (3) Giờ [ 08:00  v ]         |
| (4) Lý do khám (tuỳ chọn)  [                           ]   |
|                                                            |
| (5) [ Đặt lịch ]                                           |
+------------------------------------------------------------+
(5) POST /patient/appointments/create
    OK  -&gt; redirect /patient/appointments + thông báo xanh
    lỗi -&gt; 409, lại form đó, chữ đỏ dưới ô sai, giữ giá trị đã nhập;
           giờ đã có người đặt -&gt; thông báo dưới (3)
Luật: ngày từ mai tới tối đa 30 ngày sau; một bác sĩ,
      một khung giờ (chỉ mục duy nhất có lọc, ASM.2)</code></pre>
<p>So với <code>booking-form.jsp</code> ở ASM.3: mỗi con số thành một ô của form hoặc cái nút, và cả hai kết cục của (5) đều được xử lý ở đó.</p></div>
<h2>Đi xa hơn</h2>
<p>Bản HTML/CSS thuần của bài này, cho khoá Nền tảng Web, là <a href="/courses/web-foundations/learn?lessonSlug=wf-3-5b-wireframes">3.5b — Wireframe cho lập trình viên</a>. Muốn sâu hơn — kỹ thuật phác thảo, wireframe độ trung thực cao, Figma, prototype và thử với người dùng — xem Chương 4 của <a href="/courses/ux-ui-for-developers/learn?lessonSlug=uxui-4-1-phac-thao">UX/UI cho lập trình viên (4.1 Phác thảo và wireframe độ trung thực thấp)</a>; lưu ý khoá đó hiện mới có đề cương, các bài đang được soạn.</p>`),
  ].join('\n'),
};

/* ───────── ASM.3 — 🧭 Assignment A–Z (3/6): core features — Bootstrap 5, CRUD, paging, custom tags, booking ───────── */
const L_x_asm_3 = {
  title: 'ASM.3 — 🧭 Assignment A–Z (3/6): core features — Bootstrap 5, CRUD, paging, custom tags, booking|||ASM.3 — 🧭 Assignment A–Z (3/6): chức năng lõi — Bootstrap 5, CRUD, phân trang, custom tag, đặt lịch không trùng',
  slug: 'prj301-asm-3',
  type: 'VIDEO',
  description: 'Bài tự thêm, chuỗi Assignment PRJ301 mẫu Quản lý phòng khám: layout dùng chung với Bootstrap 5.3 từ CDN có SRI, navbar và lưới responsive, CSS3 tự viết; CRUD dịch vụ khám bằng Servlet, service, DAO, JSP với kiểm tra dữ liệu, form giữ chữ đã gõ, Post/Redirect/Get, tìm kiếm LIKE an toàn và phân trang OFFSET FETCH; JSTL và hai custom tag tự viết (thẻ phân trang Java + tag file nhãn trạng thái); đặt lịch khám với hai ổ khoá chống trùng giờ và cuộc đua hai luồng chạy thật; lễ tân tìm, lọc, phân trang và lập hoá đơn — mọi bước có response thật.',
  content: [
    bi(`<span class="eyebrow">🧭 Course Assignment A–Z · 3/6 · added by this site</span>
<h2>Where most of the marks are: the features themselves</h2>
<p class="lead">This lesson fills the skeleton of ASM.2 with the features a marker clicks through: a shared Bootstrap layout (1.4, 1.7), a full CRUD with search and paging (1.3, 1.5, 1.6), JSTL and two custom tags of our own (1.8), the central transaction — booking — protected against double booking, and the receptionist's search and invoices. Every response below comes from the running clinic app.</p>
<div class="callout">🎯 The requests below run with a logged-in user (the cookie <code>JSESSIONID=…</code> in each request). How login, roles and the 403 pages work is lesson ASM.4 — read this one for the features, that one for the protection.</div>`,
    `<span class="eyebrow">🧭 Assignment A–Z · 3/6 · phần web tự thêm</span>
<h2>Chỗ nhiều điểm nhất: chính các chức năng</h2>
<p class="lead">Bài này lấp đầy khung của ASM.2 bằng những chức năng người chấm sẽ bấm thử: layout Bootstrap dùng chung (1.4, 1.7), CRUD trọn vẹn có tìm kiếm và phân trang (1.3, 1.5, 1.6), JSTL và hai custom tag tự viết (1.8), giao dịch trung tâm — đặt lịch — được bảo vệ khỏi trùng giờ, và việc tìm kiếm, lập hoá đơn của lễ tân. Mọi response bên dưới đến từ app phòng khám đang chạy.</p>
<div class="callout">🎯 Các request dưới đây chạy với người dùng đã đăng nhập (cookie <code>JSESSIONID=…</code> trong mỗi request). Đăng nhập, vai trò và trang 403 hoạt động ra sao là bài ASM.4 — đọc bài này để lấy chức năng, bài kia để lấy phần bảo vệ.</div>`),
    bi(`<h2>1. One layout for every page — Bootstrap 5 from a CDN, with SRI</h2>
<p>Each page includes three fragments (static <code>&lt;%@ include %&gt;</code>, lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj3-2">3.B</a>): <code>_taglibs.jspf</code> (page directive + taglibs), <code>_top.jspf</code> (head, navbar, flash message) and <code>_bottom.jspf</code> (Bootstrap's JavaScript). Change the menu once, every page follows.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/_top.jspf</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- Top of EVERY page: Bootstrap 5.3.8 from the CDN with SRI, a responsive navbar by role, the flash message --%&gt;
&lt;c:set var="ctx" value="&#36;{pageContext.request.contextPath}"/&gt;
&lt;c:set var="me" value="&#36;{sessionScope.account}"/&gt;
&lt;fmt:setLocale value="vi_VN"/&gt;
&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;&#36;{fn:escapeXml(pageTitle)} · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="&#36;{ctx}/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="&#36;{ctx}/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;c:if test="&#36;{me.role == 'PATIENT'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;c:if test="&#36;{me.role == 'DOCTOR'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;c:if test="&#36;{me.role == 'RECEPTIONIST' or me.role == 'ADMIN'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;c:if test="&#36;{me.role == 'ADMIN'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;/ul&gt;
&lt;c:choose&gt;&lt;c:when test="&#36;{empty me}"&gt;&lt;a class="btn btn-sm btn-light me-2" href="&#36;{ctx}/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="&#36;{ctx}/register"&gt;Đăng ký&lt;/a&gt;
&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;span class="navbar-text me-2"&gt;&lt;c:out value="&#36;{me.fullName}"/&gt; (&#36;{me.role})&lt;/span&gt;
&lt;form method="post" action="&#36;{ctx}/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/c:otherwise&gt;&lt;/c:choose&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;c:if test="&#36;{not empty sessionScope.flash}"&gt;&lt;div class="alert alert-&#36;{sessionScope.flashType}" role="alert"&gt;&lt;c:out value="&#36;{sessionScope.flash}"/&gt;&lt;/div&gt;
&lt;c:remove var="flash" scope="session"/&gt;&lt;c:remove var="flashType" scope="session"/&gt;&lt;/c:if&gt;</code></pre>
<ul>
<li><strong>Bootstrap 5.3.8</strong> is the version the official "Quick start" page lists today. The <code>integrity="sha384-…"</code> value (<em>Subresource Integrity</em>, SRI) is the hash of the exact file: if the CDN ever served a different file, the browser would refuse to apply it. We did not trust a copy-paste: the hash was recomputed from the downloaded file (<code>openssl dgst -sha384 -binary | openssl base64</code>) and matched the page. <code>crossorigin="anonymous"</code> is required for SRI on another domain.</li>
<li><code>&lt;meta name="viewport" …&gt;</code>: without it a phone pretends to be 980 px wide and none of the responsive classes trigger — the most common reason a "responsive" Assignment is not.</li>
<li><code>navbar-expand-lg</code> + the toggler button: from 992 px the menu is a row; below, it collapses into the ☰ button (that needs <code>bootstrap.bundle.min.js</code> in <code>_bottom.jspf</code>).</li>
<li>The menu depends on the role (<code>&#36;{me.role == 'PATIENT'}</code>…) — but hiding a link protects nothing; ASM.4's filter does.</li>
<li>The flash message is read from the session and removed by <code>&lt;c:remove&gt;</code> right after display: it survives exactly one redirect.</li>
</ul>
<p>Requirement 1.4 asks for CSS3 too — a small own stylesheet next to Bootstrap: custom properties, a gradient, a transition and one media query.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/css/app.css</code></p>
<pre class="web-src"><code class="language-css">/* Clinic theme on top of Bootstrap 5: CSS custom properties, a gradient, a transition, one media query (requirements 1.4, 1.7) */
:root {
    --pk-soft: #eef4ff;
    --pk-radius: .75rem;
}
.hero {
    background: linear-gradient(135deg, var(--pk-soft), #ffffff);
    border-radius: var(--pk-radius);
    padding: 2rem 1.5rem;
}
.doctor-card {
    transition: transform .15s ease, box-shadow .15s ease;
}
.doctor-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .08);
}
@media (max-width: 575.98px) {          /* phones (Bootstrap "xs") */
    .hero { padding: 1.25rem 1rem; }
    .table td, .table th { white-space: nowrap; }
}</code></pre>
<p>The responsive grid of the home page (seen in ASM.2): <code>row-cols-1 row-cols-sm-2 row-cols-lg-4</code> means 1 card per row on a phone, 2 from 576 px, 4 from 992 px. Every table is wrapped in <code>table-responsive</code> so it scrolls sideways on a phone instead of breaking the page.</p>
<div class="pitfall">Measured on Tomcat 10.1 with <code>trim-directive-whitespaces</code> on (set for all JSPs in <code>web.xml</code>, ASM.2): Jasper also drops the white space at the <em>start</em> of the text that follows a tag like <code>&lt;c:forEach&gt;</code> or <code>&lt;c:if&gt;</code>. Writing <code>&lt;c:forEach …&gt;⏎&lt;option&gt;</code> printed every option on ONE line. That is why the views put the line break <em>before</em> the closing tag: <code>&lt;option&gt;…&lt;/option&gt;⏎&lt;/c:forEach&gt;</code>. Harmless for the browser, but it makes "View source" readable when you debug.</div>`,
    `<h2>1. Một layout cho mọi trang — Bootstrap 5 từ CDN, có SRI</h2>
<p>Mỗi trang include ba mảnh (include tĩnh <code>&lt;%@ include %&gt;</code>, bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj3-2">3.B</a>): <code>_taglibs.jspf</code> (page directive + taglib), <code>_top.jspf</code> (head, navbar, thông báo flash) và <code>_bottom.jspf</code> (JavaScript của Bootstrap). Sửa menu một lần, mọi trang theo.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/_top.jspf</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- Phần đầu của MỌI trang: Bootstrap 5.3.8 từ CDN có SRI, thanh điều hướng responsive theo vai trò, thông báo flash --%&gt;
&lt;c:set var="ctx" value="&#36;{pageContext.request.contextPath}"/&gt;
&lt;c:set var="me" value="&#36;{sessionScope.account}"/&gt;
&lt;fmt:setLocale value="vi_VN"/&gt;
&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;&#36;{fn:escapeXml(pageTitle)} · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="&#36;{ctx}/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="&#36;{ctx}/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;c:if test="&#36;{me.role == 'PATIENT'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;c:if test="&#36;{me.role == 'DOCTOR'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;c:if test="&#36;{me.role == 'RECEPTIONIST' or me.role == 'ADMIN'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;c:if test="&#36;{me.role == 'ADMIN'}"&gt;&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="&#36;{ctx}/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/c:if&gt;&lt;/ul&gt;
&lt;c:choose&gt;&lt;c:when test="&#36;{empty me}"&gt;&lt;a class="btn btn-sm btn-light me-2" href="&#36;{ctx}/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="&#36;{ctx}/register"&gt;Đăng ký&lt;/a&gt;
&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;span class="navbar-text me-2"&gt;&lt;c:out value="&#36;{me.fullName}"/&gt; (&#36;{me.role})&lt;/span&gt;
&lt;form method="post" action="&#36;{ctx}/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/c:otherwise&gt;&lt;/c:choose&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;c:if test="&#36;{not empty sessionScope.flash}"&gt;&lt;div class="alert alert-&#36;{sessionScope.flashType}" role="alert"&gt;&lt;c:out value="&#36;{sessionScope.flash}"/&gt;&lt;/div&gt;
&lt;c:remove var="flash" scope="session"/&gt;&lt;c:remove var="flashType" scope="session"/&gt;&lt;/c:if&gt;</code></pre>
<ul>
<li><strong>Bootstrap 5.3.8</strong> là phiên bản trang "Quick start" chính thức đang ghi hôm nay. Giá trị <code>integrity="sha384-…"</code> (<em>Subresource Integrity</em>, SRI — toàn vẹn tài nguyên con) là mã băm của đúng file đó: nếu một ngày CDN trả về file khác, trình duyệt sẽ từ chối dùng. Chúng tôi không tin chép-dán: mã băm được tính lại từ file tải về (<code>openssl dgst -sha384 -binary | openssl base64</code>) và khớp với trang chính thức. <code>crossorigin="anonymous"</code> là bắt buộc để SRI chạy với file ở tên miền khác.</li>
<li><code>&lt;meta name="viewport" …&gt;</code>: thiếu nó, điện thoại giả vờ rộng 980 px và không class responsive nào kích hoạt — lý do phổ biến nhất khiến một Assignment "responsive" mà không responsive.</li>
<li><code>navbar-expand-lg</code> + nút toggler: từ 992 px menu là một hàng; nhỏ hơn thì gập vào nút ☰ (cần <code>bootstrap.bundle.min.js</code> trong <code>_bottom.jspf</code>).</li>
<li>Menu thay đổi theo vai trò (<code>&#36;{me.role == 'PATIENT'}</code>…) — nhưng giấu một link không bảo vệ được gì; filter ở ASM.4 mới bảo vệ.</li>
<li>Thông báo flash được đọc từ session rồi bị <code>&lt;c:remove&gt;</code> xoá ngay sau khi hiện: nó sống qua đúng một lần redirect.</li>
</ul>
<p>Yêu cầu 1.4 đòi cả CSS3 — một stylesheet nhỏ tự viết đặt cạnh Bootstrap: biến CSS, dải màu, hiệu ứng chuyển và một media query.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/css/app.css</code></p>
<pre class="web-src"><code class="language-css">/* Clinic theme on top of Bootstrap 5: CSS custom properties, a gradient, a transition, one media query (requirements 1.4, 1.7) */
:root {
    --pk-soft: #eef4ff;
    --pk-radius: .75rem;
}
.hero {
    background: linear-gradient(135deg, var(--pk-soft), #ffffff);
    border-radius: var(--pk-radius);
    padding: 2rem 1.5rem;
}
.doctor-card {
    transition: transform .15s ease, box-shadow .15s ease;
}
.doctor-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .08);
}
@media (max-width: 575.98px) {          /* phones (Bootstrap "xs") */
    .hero { padding: 1.25rem 1rem; }
    .table td, .table th { white-space: nowrap; }
}</code></pre>
<p>Lưới responsive của trang chủ (đã thấy ở ASM.2): <code>row-cols-1 row-cols-sm-2 row-cols-lg-4</code> nghĩa là điện thoại 1 thẻ mỗi hàng, từ 576 px 2 thẻ, từ 992 px 4 thẻ. Bảng nào cũng bọc trong <code>table-responsive</code> để trên điện thoại nó cuộn ngang thay vì làm vỡ trang.</p>
<div class="pitfall">Đo trên Tomcat 10.1 khi bật <code>trim-directive-whitespaces</code> (đặt cho mọi JSP trong <code>web.xml</code>, ASM.2): Jasper còn bỏ cả khoảng trắng ở <em>đầu</em> đoạn chữ đứng ngay sau một thẻ như <code>&lt;c:forEach&gt;</code> hay <code>&lt;c:if&gt;</code>. Viết <code>&lt;c:forEach …&gt;⏎&lt;option&gt;</code> làm mọi option in ra trên MỘT dòng. Vì thế các view đặt dấu xuống dòng <em>trước</em> thẻ đóng: <code>&lt;option&gt;…&lt;/option&gt;⏎&lt;/c:forEach&gt;</code>. Trình duyệt không bận tâm, nhưng "View source" đọc được khi bạn gỡ lỗi.</div>`),
    bi(`<h2>2. CRUD of medical services (UC12) — one controller, one service, one DAO</h2>
<p>The admin's catalogue is the textbook CRUD every PE also asks for. One servlet mapped to <code>/admin/services/*</code> reads <em>method + path</em> and calls one method per action (the front-controller idea of lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-front-controller">6.2</a>, in its simplest form):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// CRUD of medical services (ADMIN). One servlet for /admin/services/*, one method per action
@WebServlet("/admin/services/*")
public class AdminServiceController extends HttpServlet {
    private static final int PAGE_SIZE = 5;
    private final CatalogDAO dao = new CatalogDAO();
    private final CatalogService service = new CatalogService();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getMethod() + " " + (req.getPathInfo() == null ? "/" : req.getPathInfo());
        try {
            switch (action) {
                case "GET /":        list(req, resp); break;
                case "GET /new":     form(req, resp, new ServiceForm(), Map.of()); break;
                case "GET /edit":    edit(req, resp); break;
                case "POST /create":
                case "POST /update": save(req, resp); break;
                case "POST /delete": delete(req, resp); break;
                default:             resp.sendError(404);
            }
        } catch (SQLException e) {
            throw new ServletException(e);                // one place turns a DB error into a 500
        }
    }</code></pre>
<h3>2a. Read: search + paging, done by SQL</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private void list(HttpServletRequest req, HttpServletResponse resp) throws SQLException, ServletException, IOException {
    String q = req.getParameter("q") == null ? "" : req.getParameter("q").trim();
    req.setAttribute("q", q);
    req.setAttribute("page", dao.searchServices(q, Web.parseInt(req.getParameter("page"), 1), PAGE_SIZE));
    req.getRequestDispatcher("/WEB-INF/views/admin/services.jsp").forward(req, resp);
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/CatalogDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Search + paging in SQL: COUNT for the pager, then OFFSET … FETCH for ONE page (SQL Server 2012+)
public Page&lt;MedicalService&gt; searchServices(String q, int page, int size) throws SQLException {
    String where = "WHERE m.name LIKE ? ESCAPE '!' ";
    String pattern = "%" + likeEscape(q) + "%";
    try (Connection c = DBContext.getConnection()) {
        int total;
        try (PreparedStatement ps = c.prepareStatement("SELECT COUNT(*) FROM MedicalService m " + where)) {
            ps.setString(1, pattern);
            try (ResultSet rs = ps.executeQuery()) { rs.next(); total = rs.getInt(1); }
        }
        int number = Page.clamp(page, total, size);
        List&lt;MedicalService&gt; items = new ArrayList&lt;&gt;();
        try (PreparedStatement ps = c.prepareStatement(SERVICE_SQL + where
                + "ORDER BY m.serviceId OFFSET ? ROWS FETCH NEXT ? ROWS ONLY")) {
            ps.setString(1, pattern);
            ps.setInt(2, (number - 1) * size);
            ps.setInt(3, size);
            try (ResultSet rs = ps.executeQuery()) { while (rs.next()) items.add(service(rs)); }
        }
        return new Page&lt;&gt;(items, number, size, total);
    }
}

// In LIKE, % _ [ are wildcards: a user typing "50%" must search the TEXT 50%
static String likeEscape(String q) {
    return q == null ? "" : q.trim().replace("!", "!!").replace("%", "!%").replace("_", "!_").replace("[", "![");
}</code></pre>
<ul>
<li>Two queries share one connection: <code>COUNT(*)</code> for the pager, then <code>OFFSET … FETCH NEXT …</code> for ONE page — never "load all rows and cut in Java" (lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-pagination">6.3</a>).</li>
<li><code>Page.clamp</code>: <code>?page=99</code> shows the last page instead of an empty table.</li>
<li>The search text goes through <code>PreparedStatement</code> like everything typed by a user — plus <code>likeEscape</code>, because inside LIKE the characters <code>%</code>, <code>_</code> and <code>[</code> are wildcards (SQL Server), so a user typing "50%" must search the text "50%".</li>
</ul>
<p>The list, page 1 of 3 (prices formatted by <code>&lt;fmt:formatNumber pattern="#,##0"&gt;</code> under the <code>vi_VN</code> locale ⇒ <code>200.000</code>):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;200.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=1"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="1"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Siêu âm ổ bụng&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;350.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=2"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="2"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Điện tim (ECG)&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;150.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=3"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="3"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Xét nghiệm máu tổng quát&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;250.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=4"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="4"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Khám nhi&lt;/td&gt;&lt;td&gt;Nhi&lt;/td&gt;
&lt;td class="text-end"&gt;180.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=5"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="5"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/3 · 12 kết quả&lt;/p&gt;
&lt;nav aria-label="pages"&gt;&lt;ul class="pagination pagination-sm flex-wrap"&gt;
  &lt;li class="page-item active" aria-current="page"&gt;&lt;span class="page-link"&gt;1&lt;/span&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/admin/services?page=2"&gt;2&lt;/a&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/admin/services?page=3"&gt;3&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;&lt;/nav&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Search is case-insensitive because of the database collation (<code>…_CI_AS</code>), accents still count:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services?q=si%C3%AAu%20%C3%A2m HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="siêu âm" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Siêu âm ổ bụng&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;350.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=2"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="2"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Siêu âm tuyến giáp&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;300.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=12"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="12"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 2 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
    `<h2>2. CRUD dịch vụ khám (UC12) — một controller, một service, một DAO</h2>
<p>Danh mục của admin là kiểu CRUD sách giáo khoa mà PE nào cũng hỏi. Một servlet ánh xạ <code>/admin/services/*</code> đọc <em>method + đường dẫn</em> rồi gọi mỗi hành động một phương thức (ý tưởng front controller của bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-front-controller">6.2</a>, ở dạng đơn giản nhất):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// CRUD dịch vụ khám (ADMIN). Một servlet cho /admin/services/*, mỗi hành động một phương thức
@WebServlet("/admin/services/*")
public class AdminServiceController extends HttpServlet {
    private static final int PAGE_SIZE = 5;
    private final CatalogDAO dao = new CatalogDAO();
    private final CatalogService service = new CatalogService();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getMethod() + " " + (req.getPathInfo() == null ? "/" : req.getPathInfo());
        try {
            switch (action) {
                case "GET /":        list(req, resp); break;
                case "GET /new":     form(req, resp, new ServiceForm(), Map.of()); break;
                case "GET /edit":    edit(req, resp); break;
                case "POST /create":
                case "POST /update": save(req, resp); break;
                case "POST /delete": delete(req, resp); break;
                default:             resp.sendError(404);
            }
        } catch (SQLException e) {
            throw new ServletException(e);                // một chỗ duy nhất biến lỗi CSDL thành 500
        }
    }</code></pre>
<h3>2a. Đọc: tìm kiếm + phân trang, làm bằng SQL</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private void list(HttpServletRequest req, HttpServletResponse resp) throws SQLException, ServletException, IOException {
    String q = req.getParameter("q") == null ? "" : req.getParameter("q").trim();
    req.setAttribute("q", q);
    req.setAttribute("page", dao.searchServices(q, Web.parseInt(req.getParameter("page"), 1), PAGE_SIZE));
    req.getRequestDispatcher("/WEB-INF/views/admin/services.jsp").forward(req, resp);
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/CatalogDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Tìm + phân trang bằng SQL: COUNT cho thanh phân trang, rồi OFFSET … FETCH lấy MỘT trang (SQL Server 2012+)
public Page&lt;MedicalService&gt; searchServices(String q, int page, int size) throws SQLException {
    String where = "WHERE m.name LIKE ? ESCAPE '!' ";
    String pattern = "%" + likeEscape(q) + "%";
    try (Connection c = DBContext.getConnection()) {
        int total;
        try (PreparedStatement ps = c.prepareStatement("SELECT COUNT(*) FROM MedicalService m " + where)) {
            ps.setString(1, pattern);
            try (ResultSet rs = ps.executeQuery()) { rs.next(); total = rs.getInt(1); }
        }
        int number = Page.clamp(page, total, size);
        List&lt;MedicalService&gt; items = new ArrayList&lt;&gt;();
        try (PreparedStatement ps = c.prepareStatement(SERVICE_SQL + where
                + "ORDER BY m.serviceId OFFSET ? ROWS FETCH NEXT ? ROWS ONLY")) {
            ps.setString(1, pattern);
            ps.setInt(2, (number - 1) * size);
            ps.setInt(3, size);
            try (ResultSet rs = ps.executeQuery()) { while (rs.next()) items.add(service(rs)); }
        }
        return new Page&lt;&gt;(items, number, size, total);
    }
}

// Trong LIKE, % _ [ là ký tự đại diện: người gõ "50%" phải tìm đúng CHỮ 50%
static String likeEscape(String q) {
    return q == null ? "" : q.trim().replace("!", "!!").replace("%", "!%").replace("_", "!_").replace("[", "![");
}</code></pre>
<ul>
<li>Hai câu truy vấn dùng chung một kết nối: <code>COUNT(*)</code> cho thanh phân trang, rồi <code>OFFSET … FETCH NEXT …</code> lấy MỘT trang — không bao giờ "tải hết rồi cắt bằng Java" (bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-pagination">6.3</a>).</li>
<li><code>Page.clamp</code>: <code>?page=99</code> hiện trang cuối thay vì một bảng trống.</li>
<li>Chữ tìm kiếm đi qua <code>PreparedStatement</code> như mọi thứ người dùng gõ — cộng thêm <code>likeEscape</code>, vì trong LIKE các ký tự <code>%</code>, <code>_</code> và <code>[</code> là ký tự đại diện (SQL Server), nên người gõ "50%" phải tìm đúng chữ "50%".</li>
</ul>
<p>Danh sách, trang 1/3 (giá định dạng bằng <code>&lt;fmt:formatNumber pattern="#,##0"&gt;</code> với locale <code>vi_VN</code> ⇒ <code>200.000</code>):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;200.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=1"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="1"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Siêu âm ổ bụng&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;350.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=2"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="2"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Điện tim (ECG)&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;150.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=3"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="3"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Xét nghiệm máu tổng quát&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;250.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=4"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="4"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Khám nhi&lt;/td&gt;&lt;td&gt;Nhi&lt;/td&gt;
&lt;td class="text-end"&gt;180.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=5"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="5"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/3 · 12 kết quả&lt;/p&gt;
&lt;nav aria-label="pages"&gt;&lt;ul class="pagination pagination-sm flex-wrap"&gt;
  &lt;li class="page-item active" aria-current="page"&gt;&lt;span class="page-link"&gt;1&lt;/span&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/admin/services?page=2"&gt;2&lt;/a&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/admin/services?page=3"&gt;3&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;&lt;/nav&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Tìm kiếm không phân biệt hoa thường nhờ collation của CSDL (<code>…_CI_AS</code>), dấu thì vẫn tính:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services?q=si%C3%AAu%20%C3%A2m HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="siêu âm" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Siêu âm ổ bụng&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;350.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=2"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="2"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Siêu âm tuyến giáp&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;300.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=12"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="12"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 2 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`),
    bi(`<h3>2b. Create and update: validate on the server, re-show the form, then PRG</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private void save(HttpServletRequest req, HttpServletResponse resp) throws SQLException, ServletException, IOException {
    ServiceForm f = new ServiceForm();
    f.setId(req.getPathInfo().equals("/create") ? "" : req.getParameter("id"));   // create never trusts an id from the browser
    f.setName(req.getParameter("name"));
    f.setPrice(req.getParameter("price"));
    f.setSpecialtyId(req.getParameter("specialtyId"));
    Map&lt;String, String&gt; errors = service.save(f);
    if (!errors.isEmpty()) {                          // invalid ⇒ same request, form again (no redirect)
        form(req, resp, f, errors);
        return;
    }
    Web.flash(req, "success", (f.getId().isEmpty() ? "Đã thêm dịch vụ: " : "Đã cập nhật dịch vụ: ") + f.getName());
    resp.sendRedirect(req.getContextPath() + "/admin/services?q=" + java.net.URLEncoder.encode(f.getName(), "UTF-8"));   // valid ⇒ PRG
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/CatalogService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Empty map ⇒ saved (insert when id is empty, update otherwise); otherwise field → message
public Map&lt;String, String&gt; save(ServiceForm f) throws SQLException {
    Map&lt;String, String&gt; err = new LinkedHashMap&lt;&gt;();
    int id = f.getId().isEmpty() ? 0 : util.Web.parseInt(f.getId(), -1);
    if (f.getName().isEmpty() || f.getName().length() &gt; 100) err.put("name", "Tên dịch vụ bắt buộc, tối đa 100 ký tự");
    else if (dao.serviceNameTaken(f.getName(), id)) err.put("name", "Đã có dịch vụ cùng tên");
    BigDecimal price = null;
    try {
        price = new BigDecimal(f.getPrice());
        if (price.signum() &lt;= 0 || price.scale() &gt; 0 || price.compareTo(new BigDecimal("100000000")) &gt; 0)
            err.put("price", "Giá là số nguyên dương (VNĐ), tối đa 100.000.000");
    } catch (NumberFormatException e) {
        err.put("price", "Giá phải là số");
    }
    int sp = util.Web.parseInt(f.getSpecialtyId(), 0);
    if (dao.specialties().stream().noneMatch(s -&gt; s.getId() == sp)) err.put("specialtyId", "Chọn một chuyên khoa");
    if (!err.isEmpty()) return err;
    if (id == 0) dao.insertService(f.getName(), price, sp);
    else if (!dao.updateService(id, f.getName(), price, sp)) err.put("id", "Không có dịch vụ này");
    return err;
}</code></pre>
<p>The form object keeps every field as the <strong>string the admin typed</strong> (<code>ServiceForm</code>), so a rejected form shows "12.5" again instead of an empty box. Three mistakes at once — a duplicate name, a decimal price, a specialty id that does not exist (sent by editing the form in DevTools):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 47

id=&amp;name=Kh%C3%A1m+nhi&amp;price=12.5&amp;specialtyId=9</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Thêm dịch vụ · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4 mb-3"&gt;Thêm dịch vụ&lt;/h1&gt;
&lt;form method="post" action="/phong-kham/admin/services/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="id" value=""&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="n"&gt;Tên dịch vụ&lt;/label&gt;
&lt;input class="form-control is-invalid" id="n" name="name" value="Khám nhi" maxlength="100"&gt;
&lt;div class="invalid-feedback"&gt;Đã có dịch vụ cùng tên&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="g"&gt;Giá (đ)&lt;/label&gt;
&lt;input class="form-control is-invalid" id="g" name="price" inputmode="numeric" value="12.5"&gt;
&lt;div class="invalid-feedback"&gt;Giá là số nguyên dương (VNĐ), tối đa 100.000.000&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="k"&gt;Chuyên khoa&lt;/label&gt;
&lt;select class="form-select is-invalid" id="k" name="specialtyId"&gt;
&lt;option value=""&gt;— chọn —&lt;/option&gt;
&lt;option value="1"&gt;Nội tổng quát&lt;/option&gt;
&lt;option value="2"&gt;Nhi&lt;/option&gt;
&lt;option value="3"&gt;Răng Hàm Mặt&lt;/option&gt;
&lt;option value="4"&gt;Da liễu&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Chọn một chuyên khoa&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Lưu&lt;/button&gt; &lt;a class="btn btn-link" href="/phong-kham/admin/services"&gt;Huỷ&lt;/a&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Status 200 and the same URL: an invalid POST is <em>not</em> redirected, the errors live only in this request. Each error sits under its own field thanks to Bootstrap's <code>is-invalid</code> + <code>invalid-feedback</code>. A valid POST is redirected (Post/Redirect/Get, lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch6">6.4</a>), so F5 on the next page cannot insert twice:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 57

id=&amp;name=Si%C3%AAu+%C3%A2m+tim&amp;price=450000&amp;specialtyId=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/services?q=Si%C3%AAu+%C3%A2m+tim</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services?q=Si%C3%AAu%20%C3%A2m%20tim HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã thêm dịch vụ: Siêu âm tim&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="Siêu âm tim" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;Siêu âm tim&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;450.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=13"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="13"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 1 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Edit uses the same form; the hidden <code>id</code> decides create or update:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/update HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 73

id=13&amp;name=Si%C3%AAu+%C3%A2m+tim+%28Doppler%29&amp;price=500000&amp;specialtyId=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/services?q=Si%C3%AAu+%C3%A2m+tim+%28Doppler%29</code></pre>
<h3>2c. Delete, and the database that says no</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private void delete(HttpServletRequest req, HttpServletResponse resp) throws SQLException, IOException {
    int id = Web.parseInt(req.getParameter("id"), 0);
    try {
        if (dao.deleteService(id)) Web.flash(req, "success", "Đã xoá dịch vụ #" + id);
        else Web.flash(req, "danger", "Không có dịch vụ #" + id);
    } catch (SQLException e) {
        if (e.getErrorCode() != 547) throw e;         // 547 = FOREIGN KEY conflict: appointments still use it
        Web.flash(req, "danger", "Không xoá được dịch vụ #" + id + ": đã có lịch khám dùng dịch vụ này");
    }
    resp.sendRedirect(req.getContextPath() + "/admin/services");
}</code></pre>
<p>Service #1 is used by appointments. The foreign key <code>FK_Appointment_Service</code> makes SQL Server refuse the DELETE with error <strong>547</strong>; the controller turns exactly that code into a sentence and lets every other error become a 500:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 4

id=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/services</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger" role="alert"&gt;Không xoá được dịch vụ #1: đã có lịch khám dùng dịch vụ này&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;200.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=1"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="1"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Siêu âm ổ bụng&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;350.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=2"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="2"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
… (29 more lines / còn 29 dòng)</code></pre>
<div class="pitfall">Deletes and updates are <strong>POST</strong> forms, never links like <code>&lt;a href="delete?id=1"&gt;</code>: a GET must not change data (browsers prefetch links, crawlers follow them). The <code>onsubmit="return confirm(…)"</code> is comfort only — the server rules are what protect the data.</div>`,
    `<h3>2b. Thêm và sửa: kiểm ở server, hiện lại form, rồi PRG</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private void save(HttpServletRequest req, HttpServletResponse resp) throws SQLException, ServletException, IOException {
    ServiceForm f = new ServiceForm();
    f.setId(req.getPathInfo().equals("/create") ? "" : req.getParameter("id"));   // thêm mới không tin id gửi từ trình duyệt
    f.setName(req.getParameter("name"));
    f.setPrice(req.getParameter("price"));
    f.setSpecialtyId(req.getParameter("specialtyId"));
    Map&lt;String, String&gt; errors = service.save(f);
    if (!errors.isEmpty()) {                          // sai ⇒ cùng request, hiện lại form (không redirect)
        form(req, resp, f, errors);
        return;
    }
    Web.flash(req, "success", (f.getId().isEmpty() ? "Đã thêm dịch vụ: " : "Đã cập nhật dịch vụ: ") + f.getName());
    resp.sendRedirect(req.getContextPath() + "/admin/services?q=" + java.net.URLEncoder.encode(f.getName(), "UTF-8"));   // hợp lệ ⇒ PRG
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/CatalogService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Map rỗng ⇒ đã lưu (id rỗng thì thêm, có id thì sửa); ngược lại ô → thông báo lỗi
public Map&lt;String, String&gt; save(ServiceForm f) throws SQLException {
    Map&lt;String, String&gt; err = new LinkedHashMap&lt;&gt;();
    int id = f.getId().isEmpty() ? 0 : util.Web.parseInt(f.getId(), -1);
    if (f.getName().isEmpty() || f.getName().length() &gt; 100) err.put("name", "Tên dịch vụ bắt buộc, tối đa 100 ký tự");
    else if (dao.serviceNameTaken(f.getName(), id)) err.put("name", "Đã có dịch vụ cùng tên");
    BigDecimal price = null;
    try {
        price = new BigDecimal(f.getPrice());
        if (price.signum() &lt;= 0 || price.scale() &gt; 0 || price.compareTo(new BigDecimal("100000000")) &gt; 0)
            err.put("price", "Giá là số nguyên dương (VNĐ), tối đa 100.000.000");
    } catch (NumberFormatException e) {
        err.put("price", "Giá phải là số");
    }
    int sp = util.Web.parseInt(f.getSpecialtyId(), 0);
    if (dao.specialties().stream().noneMatch(s -&gt; s.getId() == sp)) err.put("specialtyId", "Chọn một chuyên khoa");
    if (!err.isEmpty()) return err;
    if (id == 0) dao.insertService(f.getName(), price, sp);
    else if (!dao.updateService(id, f.getName(), price, sp)) err.put("id", "Không có dịch vụ này");
    return err;
}</code></pre>
<p>Đối tượng form giữ mọi ô dưới dạng <strong>chuỗi admin đã gõ</strong> (<code>ServiceForm</code>), nên form bị từ chối hiện lại "12.5" chứ không phải ô trống. Ba lỗi một lúc — tên trùng, giá có phần thập phân, mã chuyên khoa không tồn tại (gửi bằng cách sửa form trong DevTools):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 47

id=&amp;name=Kh%C3%A1m+nhi&amp;price=12.5&amp;specialtyId=9</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Thêm dịch vụ · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4 mb-3"&gt;Thêm dịch vụ&lt;/h1&gt;
&lt;form method="post" action="/phong-kham/admin/services/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="id" value=""&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="n"&gt;Tên dịch vụ&lt;/label&gt;
&lt;input class="form-control is-invalid" id="n" name="name" value="Khám nhi" maxlength="100"&gt;
&lt;div class="invalid-feedback"&gt;Đã có dịch vụ cùng tên&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="g"&gt;Giá (đ)&lt;/label&gt;
&lt;input class="form-control is-invalid" id="g" name="price" inputmode="numeric" value="12.5"&gt;
&lt;div class="invalid-feedback"&gt;Giá là số nguyên dương (VNĐ), tối đa 100.000.000&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="k"&gt;Chuyên khoa&lt;/label&gt;
&lt;select class="form-select is-invalid" id="k" name="specialtyId"&gt;
&lt;option value=""&gt;— chọn —&lt;/option&gt;
&lt;option value="1"&gt;Nội tổng quát&lt;/option&gt;
&lt;option value="2"&gt;Nhi&lt;/option&gt;
&lt;option value="3"&gt;Răng Hàm Mặt&lt;/option&gt;
&lt;option value="4"&gt;Da liễu&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Chọn một chuyên khoa&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Lưu&lt;/button&gt; &lt;a class="btn btn-link" href="/phong-kham/admin/services"&gt;Huỷ&lt;/a&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Mã 200 và vẫn URL cũ: POST sai <em>không</em> bị redirect, lỗi chỉ sống trong request này. Mỗi lỗi nằm dưới đúng ô của nó nhờ <code>is-invalid</code> + <code>invalid-feedback</code> của Bootstrap. POST đúng thì redirect (Post/Redirect/Get, bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch6">6.4</a>), nên F5 ở trang sau không thể thêm hai lần:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 57

id=&amp;name=Si%C3%AAu+%C3%A2m+tim&amp;price=450000&amp;specialtyId=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/services?q=Si%C3%AAu+%C3%A2m+tim</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services?q=Si%C3%AAu%20%C3%A2m%20tim HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã thêm dịch vụ: Siêu âm tim&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="Siêu âm tim" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;Siêu âm tim&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;450.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=13"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="13"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 1 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Sửa dùng chính form đó; ô ẩn <code>id</code> quyết định thêm hay sửa:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/update HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 73

id=13&amp;name=Si%C3%AAu+%C3%A2m+tim+%28Doppler%29&amp;price=500000&amp;specialtyId=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/services?q=Si%C3%AAu+%C3%A2m+tim+%28Doppler%29</code></pre>
<h3>2c. Xoá, và CSDL nói không</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminServiceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private void delete(HttpServletRequest req, HttpServletResponse resp) throws SQLException, IOException {
    int id = Web.parseInt(req.getParameter("id"), 0);
    try {
        if (dao.deleteService(id)) Web.flash(req, "success", "Đã xoá dịch vụ #" + id);
        else Web.flash(req, "danger", "Không có dịch vụ #" + id);
    } catch (SQLException e) {
        if (e.getErrorCode() != 547) throw e;         // 547 = xung đột KHOÁ NGOẠI: còn lịch khám dùng nó
        Web.flash(req, "danger", "Không xoá được dịch vụ #" + id + ": đã có lịch khám dùng dịch vụ này");
    }
    resp.sendRedirect(req.getContextPath() + "/admin/services");
}</code></pre>
<p>Dịch vụ #1 đang được các lịch khám dùng. Khoá ngoại <code>FK_Appointment_Service</code> làm SQL Server từ chối lệnh DELETE với lỗi <strong>547</strong>; controller biến đúng mã đó thành một câu dễ hiểu và để mọi lỗi khác thành 500:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/admin/services/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(5)
Content-Length: 4

id=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/services</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Dịch vụ khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger" role="alert"&gt;Không xoá được dịch vụ #1: đã có lịch khám dùng dịch vụ này&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Dịch vụ khám&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/admin/services/new"&gt;+ Thêm dịch vụ&lt;/a&gt;
&lt;/div&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/services"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên dịch vụ chứa…"&gt;&lt;/div&gt;
&lt;div class="col-auto"&gt;&lt;button class="btn btn-outline-primary"&gt;Tìm&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;200.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=1"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="1"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Siêu âm ổ bụng&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;
&lt;td class="text-end"&gt;350.000&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/admin/services/edit?id=2"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="2"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
… (29 more lines / còn 29 dòng)</code></pre>
<div class="pitfall">Xoá và sửa là form <strong>POST</strong>, không bao giờ là link kiểu <code>&lt;a href="delete?id=1"&gt;</code>: GET không được thay đổi dữ liệu (trình duyệt tải trước link, bọ tìm kiếm đi theo link). <code>onsubmit="return confirm(…)"</code> chỉ để dễ chịu — luật ở server mới bảo vệ dữ liệu.</div>`),
    bi(`<h2>3. JSTL everywhere, and two custom tags of our own (requirement 1.8)</h2>
<p>No view contains a scriptlet. What the pages use: <code>c:forEach</code>, <code>c:if</code>, <code>c:choose</code>, <code>c:out</code> (escapes HTML — the XSS lesson of <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-buoi-dau-tien">⭐ first session</a>), <code>c:set</code>, <code>c:remove</code>, <code>fmt:setLocale</code>, <code>fmt:formatNumber</code>, <code>fn:escapeXml</code> (lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj7-1">3.D</a>). The requirement also says <strong>CustomTag</strong> — a tag you wrote. We wrote two, the two kinds of lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj9-1">3.F</a>.</p>
<h3>3a. <code>&lt;pk:pager&gt;</code> — a Java tag (SimpleTagSupport + TLD)</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/tags/PagerTag.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// &lt;pk:pager page="&#36;{page}"/&gt; — Bootstrap 5 pagination that KEEPS the other query parameters (q, status…)
// Requirement 1.8 (CustomTag): written once, used by the admin page AND the reception page
public class PagerTag extends SimpleTagSupport {
    private Page&lt;?&gt; page;

    public void setPage(Page&lt;?&gt; page) { this.page = page; }      // attribute "page" of the TLD

    @Override
    public void doTag() throws JspException, IOException {
        if (page == null) throw new JspException("pk:pager needs page=\\"...\\"");
        JspWriter out = getJspContext().getOut();
        out.write("&lt;p class=\\"text-muted small mb-1\\"&gt;Trang " + page.getNumber() + "/" + page.getTotalPages() + " · " + page.getTotal() + " kết quả&lt;/p&gt;\\n");
        if (page.getTotalPages() &lt;= 1) return;                     // one page ⇒ no links
        HttpServletRequest req = (HttpServletRequest) ((PageContext) getJspContext()).getRequest();
        // after forward(), getRequestURI() is the JSP's path — the URL the user asked for is kept in this attribute
        Object asked = req.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
        String base = (asked != null ? asked : req.getRequestURI()) + "?" + otherParams(req);
        out.write("&lt;nav aria-label=\\"pages\\"&gt;&lt;ul class=\\"pagination pagination-sm flex-wrap\\"&gt;\\n");
        for (int i = 1; i &lt;= page.getTotalPages(); i++) {
            if (i == page.getNumber())
                out.write("  &lt;li class=\\"page-item active\\" aria-current=\\"page\\"&gt;&lt;span class=\\"page-link\\"&gt;" + i + "&lt;/span&gt;&lt;/li&gt;\\n");
            else
                out.write("  &lt;li class=\\"page-item\\"&gt;&lt;a class=\\"page-link\\" href=\\"" + base + "page=" + i + "\\"&gt;" + i + "&lt;/a&gt;&lt;/li&gt;\\n");
        }
        out.write("&lt;/ul&gt;&lt;/nav&gt;\\n");
    }

    // every parameter except "page", URL-encoded, joined with &amp;amp; (we are inside an HTML attribute)
    private static String otherParams(HttpServletRequest req) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry&lt;String, String[]&gt; e : req.getParameterMap().entrySet()) {
            if (e.getKey().equals("page")) continue;
            for (String v : e.getValue()) {
                if (v.isEmpty()) continue;
                sb.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8)).append('=')
                  .append(URLEncoder.encode(v, StandardCharsets.UTF_8)).append("&amp;amp;");
            }
        }
        return sb.toString();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/pk.tld</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;tag&gt;
    &lt;description&gt;Bootstrap 5 pagination for a model.Page, keeps the other query parameters&lt;/description&gt;
    &lt;name&gt;pager&lt;/name&gt;
    &lt;tag-class&gt;tags.PagerTag&lt;/tag-class&gt;
    &lt;body-content&gt;empty&lt;/body-content&gt;
    &lt;attribute&gt;
        &lt;name&gt;page&lt;/name&gt;
        &lt;required&gt;true&lt;/required&gt;
        &lt;rtexprvalue&gt;true&lt;/rtexprvalue&gt;
        &lt;type&gt;model.Page&lt;/type&gt;
    &lt;/attribute&gt;
&lt;/tag&gt;</code></pre>
<p>Used by two different pages with one line each — the admin's services and the receptionist's appointments:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/admin/services.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;c:forEach items="&#36;{page.items}" var="s"&gt;&lt;tr&gt;&lt;td&gt;&#36;{s.id}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{s.name}"/&gt;&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{s.specialtyName}"/&gt;&lt;/td&gt;
&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{s.price}" pattern="#,##0"/&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="&#36;{ctx}/admin/services/edit?id=&#36;{s.id}"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="&#36;{ctx}/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="&#36;{s.id}"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;&lt;c:if test="&#36;{empty page.items}"&gt;&lt;tr&gt;&lt;td colspan="5" class="text-center text-muted"&gt;Không có dịch vụ nào khớp.&lt;/td&gt;&lt;/tr&gt;
&lt;/c:if&gt;&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;pk:pager page="&#36;{page}"/&gt;</code></pre>
<div class="pitfall">A trap to know before writing it: inside a JSP reached by <code>forward()</code>, <code>request.getRequestURI()</code> returns the path of the <strong>JSP</strong> (<code>/phong-kham/WEB-INF/views/admin/services.jsp</code>), not the URL the browser asked for. Links built from it would point into WEB-INF ⇒ 404. The original URL is kept by the container in the attribute <code>RequestDispatcher.FORWARD_REQUEST_URI</code> (<code>jakarta.servlet.forward.request_uri</code>).</div>
<p>The pager keeps every other parameter of the URL — page 2 of a filtered list still links to <code>status=BOOKED</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=BOOKED&amp;page=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option selected&gt;BOOKED&lt;/option&gt;
&lt;option&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Trần Thị Bình&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 2/2 · 7 kết quả&lt;/p&gt;
&lt;nav aria-label="pages"&gt;&lt;ul class="pagination pagination-sm flex-wrap"&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/reception/appointments?status=BOOKED&amp;amp;page=1"&gt;1&lt;/a&gt;&lt;/li&gt;
  &lt;li class="page-item active" aria-current="page"&gt;&lt;span class="page-link"&gt;2&lt;/span&gt;&lt;/li&gt;
&lt;/ul&gt;&lt;/nav&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>3b. <code>&lt;ui:statusBadge&gt;</code> — a tag file</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/tags/statusBadge.tag</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ tag body-content="empty" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ attribute name="value" required="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- &lt;ui:statusBadge value="&#36;{a.status}"/&gt; — one status ⇒ one coloured Bootstrap badge, same words everywhere --%&gt;
&lt;c:choose&gt;&lt;c:when test="&#36;{value == 'BOOKED'}"&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'DONE'}"&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'CANCELLED'}"&gt;&lt;span class="badge text-bg-secondary"&gt;Đã huỷ&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'UNPAID'}"&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'PAID'}"&gt;&lt;span class="badge text-bg-success"&gt;Đã thanh toán&lt;/span&gt;&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;span class="badge text-bg-light"&gt;&lt;c:out value="&#36;{value}"/&gt;&lt;/span&gt;&lt;/c:otherwise&gt;&lt;/c:choose&gt;</code></pre>
<p>A tag file is a small JSP fragment under <code>WEB-INF/tags</code>; no Java class, no TLD (<code>&lt;%@ taglib prefix="ui" tagdir="/WEB-INF/tags" %&gt;</code>). One status ⇒ the same colour and words on the patient's list, the doctor's day and the reception table. <code>pageEncoding="UTF-8"</code> on the <code>tag</code> directive is not optional: the <code>web.xml</code> property group only covers <code>*.jsp</code>/<code>*.jspf</code>, and a tag file without it reads "Chờ khám" as Latin-1 (practice <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch3">3.6</a> shows the broken output).</p>`,
    `<h2>3. JSTL ở mọi nơi, và hai custom tag tự viết (yêu cầu 1.8)</h2>
<p>Không view nào có scriptlet. Các trang dùng: <code>c:forEach</code>, <code>c:if</code>, <code>c:choose</code>, <code>c:out</code> (thoát HTML — bài học XSS của <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-buoi-dau-tien">⭐ buổi đầu tiên</a>), <code>c:set</code>, <code>c:remove</code>, <code>fmt:setLocale</code>, <code>fmt:formatNumber</code>, <code>fn:escapeXml</code> (bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj7-1">3.D</a>). Yêu cầu còn ghi <strong>CustomTag</strong> — thẻ do bạn viết. Chúng ta viết hai cái, đúng hai loại của bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj9-1">3.F</a>.</p>
<h3>3a. <code>&lt;pk:pager&gt;</code> — thẻ viết bằng Java (SimpleTagSupport + TLD)</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/tags/PagerTag.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// &lt;pk:pager page="&#36;{page}"/&gt; — thanh phân trang Bootstrap 5 GIỮ các tham số khác (q, status…)
// Yêu cầu 1.8 (CustomTag): viết một lần, dùng ở trang admin VÀ trang lễ tân
public class PagerTag extends SimpleTagSupport {
    private Page&lt;?&gt; page;

    public void setPage(Page&lt;?&gt; page) { this.page = page; }      // thuộc tính "page" khai trong TLD

    @Override
    public void doTag() throws JspException, IOException {
        if (page == null) throw new JspException("pk:pager needs page=\\"...\\"");
        JspWriter out = getJspContext().getOut();
        out.write("&lt;p class=\\"text-muted small mb-1\\"&gt;Trang " + page.getNumber() + "/" + page.getTotalPages() + " · " + page.getTotal() + " kết quả&lt;/p&gt;\\n");
        if (page.getTotalPages() &lt;= 1) return;                     // một trang ⇒ không cần link
        HttpServletRequest req = (HttpServletRequest) ((PageContext) getJspContext()).getRequest();
        // sau forward(), getRequestURI() là đường dẫn của JSP — URL người dùng gọi nằm trong attribute này
        Object asked = req.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
        String base = (asked != null ? asked : req.getRequestURI()) + "?" + otherParams(req);
        out.write("&lt;nav aria-label=\\"pages\\"&gt;&lt;ul class=\\"pagination pagination-sm flex-wrap\\"&gt;\\n");
        for (int i = 1; i &lt;= page.getTotalPages(); i++) {
            if (i == page.getNumber())
                out.write("  &lt;li class=\\"page-item active\\" aria-current=\\"page\\"&gt;&lt;span class=\\"page-link\\"&gt;" + i + "&lt;/span&gt;&lt;/li&gt;\\n");
            else
                out.write("  &lt;li class=\\"page-item\\"&gt;&lt;a class=\\"page-link\\" href=\\"" + base + "page=" + i + "\\"&gt;" + i + "&lt;/a&gt;&lt;/li&gt;\\n");
        }
        out.write("&lt;/ul&gt;&lt;/nav&gt;\\n");
    }

    // mọi tham số trừ "page", mã hoá URL, nối bằng &amp;amp; (vì đang ở trong thuộc tính HTML)
    private static String otherParams(HttpServletRequest req) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry&lt;String, String[]&gt; e : req.getParameterMap().entrySet()) {
            if (e.getKey().equals("page")) continue;
            for (String v : e.getValue()) {
                if (v.isEmpty()) continue;
                sb.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8)).append('=')
                  .append(URLEncoder.encode(v, StandardCharsets.UTF_8)).append("&amp;amp;");
            }
        }
        return sb.toString();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/pk.tld</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;tag&gt;
    &lt;description&gt;Bootstrap 5 pagination for a model.Page, keeps the other query parameters&lt;/description&gt;
    &lt;name&gt;pager&lt;/name&gt;
    &lt;tag-class&gt;tags.PagerTag&lt;/tag-class&gt;
    &lt;body-content&gt;empty&lt;/body-content&gt;
    &lt;attribute&gt;
        &lt;name&gt;page&lt;/name&gt;
        &lt;required&gt;true&lt;/required&gt;
        &lt;rtexprvalue&gt;true&lt;/rtexprvalue&gt;
        &lt;type&gt;model.Page&lt;/type&gt;
    &lt;/attribute&gt;
&lt;/tag&gt;</code></pre>
<p>Hai trang khác nhau dùng nó, mỗi trang đúng một dòng — trang dịch vụ của admin và trang lịch khám của lễ tân:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/admin/services.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped table-hover align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Giá (đ)&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;c:forEach items="&#36;{page.items}" var="s"&gt;&lt;tr&gt;&lt;td&gt;&#36;{s.id}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{s.name}"/&gt;&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{s.specialtyName}"/&gt;&lt;/td&gt;
&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{s.price}" pattern="#,##0"/&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="&#36;{ctx}/admin/services/edit?id=&#36;{s.id}"&gt;Sửa&lt;/a&gt;
&lt;form class="d-inline" method="post" action="&#36;{ctx}/admin/services/delete" onsubmit="return confirm('Xoá dịch vụ này?')"&gt;
&lt;input type="hidden" name="id" value="&#36;{s.id}"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Xoá&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;&lt;c:if test="&#36;{empty page.items}"&gt;&lt;tr&gt;&lt;td colspan="5" class="text-center text-muted"&gt;Không có dịch vụ nào khớp.&lt;/td&gt;&lt;/tr&gt;
&lt;/c:if&gt;&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;pk:pager page="&#36;{page}"/&gt;</code></pre>
<div class="pitfall">Một cái bẫy phải biết trước khi viết: trong JSP được tới bằng <code>forward()</code>, <code>request.getRequestURI()</code> trả về đường dẫn của <strong>JSP</strong> (<code>/phong-kham/WEB-INF/views/admin/services.jsp</code>), không phải URL trình duyệt đã gọi. Link dựng từ đó sẽ trỏ vào WEB-INF ⇒ 404. URL gốc được container giữ trong attribute <code>RequestDispatcher.FORWARD_REQUEST_URI</code> (<code>jakarta.servlet.forward.request_uri</code>).</div>
<p>Thẻ phân trang giữ mọi tham số khác của URL — trang 2 của một danh sách đã lọc vẫn trỏ về <code>status=BOOKED</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=BOOKED&amp;page=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option selected&gt;BOOKED&lt;/option&gt;
&lt;option&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Trần Thị Bình&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 2/2 · 7 kết quả&lt;/p&gt;
&lt;nav aria-label="pages"&gt;&lt;ul class="pagination pagination-sm flex-wrap"&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/reception/appointments?status=BOOKED&amp;amp;page=1"&gt;1&lt;/a&gt;&lt;/li&gt;
  &lt;li class="page-item active" aria-current="page"&gt;&lt;span class="page-link"&gt;2&lt;/span&gt;&lt;/li&gt;
&lt;/ul&gt;&lt;/nav&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>3b. <code>&lt;ui:statusBadge&gt;</code> — một tag file</h3>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/tags/statusBadge.tag</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ tag body-content="empty" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ attribute name="value" required="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- &lt;ui:statusBadge value="&#36;{a.status}"/&gt; — một trạng thái ⇒ một nhãn Bootstrap có màu, cùng một chữ ở mọi trang --%&gt;
&lt;c:choose&gt;&lt;c:when test="&#36;{value == 'BOOKED'}"&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'DONE'}"&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'CANCELLED'}"&gt;&lt;span class="badge text-bg-secondary"&gt;Đã huỷ&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'UNPAID'}"&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/c:when&gt;&lt;c:when test="&#36;{value == 'PAID'}"&gt;&lt;span class="badge text-bg-success"&gt;Đã thanh toán&lt;/span&gt;&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;span class="badge text-bg-light"&gt;&lt;c:out value="&#36;{value}"/&gt;&lt;/span&gt;&lt;/c:otherwise&gt;&lt;/c:choose&gt;</code></pre>
<p>Tag file là một mảnh JSP nhỏ dưới <code>WEB-INF/tags</code>; không lớp Java, không TLD (<code>&lt;%@ taglib prefix="ui" tagdir="/WEB-INF/tags" %&gt;</code>). Một trạng thái ⇒ cùng màu, cùng chữ ở danh sách của bệnh nhân, lịch ngày của bác sĩ và bảng của lễ tân. <code>pageEncoding="UTF-8"</code> trong chỉ thị <code>tag</code> không phải tuỳ chọn: nhóm thuộc tính trong <code>web.xml</code> chỉ phủ <code>*.jsp</code>/<code>*.jspf</code>, và tag file thiếu nó đọc "Chờ khám" theo Latin-1 (bài thực hành <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch3">3.6</a> có output bị vỡ).</p>`),
    bi(`<h2>4. The central transaction: booking without double booking (UC04)</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/7ec807bc72e51e31a46eefbe6e996b3a92fe75a1.svg" alt="The booking request: validation, lock 1 (a check in Java), lock 2 (the unique index)" loading="lazy" /><p class="chu-thich">🧩 The booking request: validation, lock 1 (a check in Java), lock 2 (the unique index)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Booking (POST /patient/appointments/create): two locks against double booking
actor "Bệnh nhân" as P
participant "PatientAppointment\\nController" as C
participant "BookingService" as S
participant "AppointmentDAO" as D
database "SQL Server" as DB
P -&gt; C : POST doctorId, serviceId,\\ndate, time, reason
C -&gt; S : book(patientId from SESSION, form, today)
S -&gt; S : validate: doctor exists, service of his specialty,\\ndate in (today, today+30], time in SLOTS
alt invalid
  S --&gt; C : errors
  C --&gt; P : 409 + form again (sticky)
else valid
  S -&gt; D : isDoctorBusy / isPatientBusy
  D -&gt; DB : SELECT COUNT(*) …
  alt busy (lock 1: check in Java)
    S --&gt; C : "Bác sĩ đã có lịch lúc …"
    C --&gt; P : 409 + form again
  else free
    S -&gt; D : insert(a)
    D -&gt; DB : INSERT Appointment
    alt duplicate key 2601 (lock 2: unique index)
      DB --&gt; D : SQLException 2601
      S --&gt; C : "Khung giờ này vừa có người đặt"
      C --&gt; P : 409 + form again
    else saved
      C --&gt; P : 302 → /patient/appointments (PRG)
    end
  end
end
@enduml</code></pre></details>
<p>The form. HTML5 helps the patient (<code>type="date"</code> with <code>min</code> = tomorrow, <code>required</code>, a <code>select</code> of slots) — and <code>novalidate</code> switches the browser's checks off on purpose so you can see the server's answers; the server never trusts the browser anyway.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/patient/booking-form.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- HTML5 helps the user (type=date, min, required) — the SERVER still checks everything again --%&gt;
&lt;form method="post" action="&#36;{ctx}/patient/appointments/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="doctorId" value="&#36;{doctor.id}"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="sv"&gt;Dịch vụ&lt;/label&gt;
&lt;select class="form-select&#36;{empty errors.serviceId ? '' : ' is-invalid'}" id="sv" name="serviceId" required&gt;
&lt;c:forEach items="&#36;{services}" var="s"&gt;&lt;option value="&#36;{s.id}"&#36;{form.serviceId == s.id.toString() ? ' selected' : ''}&gt;&lt;c:out value="&#36;{s.name}"/&gt; — &lt;fmt:formatNumber value="&#36;{s.price}" pattern="#,##0"/&gt; đ&lt;/option&gt;
&lt;/c:forEach&gt;&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.serviceId}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="d"&gt;Ngày&lt;/label&gt;
&lt;input class="form-control&#36;{empty errors.date ? '' : ' is-invalid'}" id="d" type="date" name="date" min="&#36;{minDate}" value="&#36;{fn:escapeXml(form.date)}" required&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.date}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="t"&gt;Giờ&lt;/label&gt;
&lt;select class="form-select&#36;{empty errors.time ? '' : ' is-invalid'}" id="t" name="time" required&gt;
&lt;c:forEach items="&#36;{slots}" var="t"&gt;&lt;option&#36;{form.time == t.toString() ? ' selected' : ''}&gt;&#36;{t}&lt;/option&gt;
&lt;/c:forEach&gt;&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.time}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="r"&gt;Lý do khám (tuỳ chọn)&lt;/label&gt;
&lt;textarea class="form-control&#36;{empty errors.reason ? '' : ' is-invalid'}" id="r" name="reason" rows="2" maxlength="300"&gt;&lt;c:out value="&#36;{form.reason}"/&gt;&lt;/textarea&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.reason}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đặt lịch&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;</code></pre>
<p>The rules live in the service, not in the servlet:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/BookingService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public Map&lt;String, String&gt; book(int patientId, BookingForm f, LocalDate today) throws SQLException {
    Map&lt;String, String&gt; err = new LinkedHashMap&lt;&gt;();
    Doctor doctor = catalog.findDoctor(util.Web.parseInt(f.getDoctorId(), 0));
    if (doctor == null) { err.put("doctorId", "Không có bác sĩ này"); return err; }
    MedicalService service = catalog.findService(util.Web.parseInt(f.getServiceId(), 0));
    if (service == null || service.getSpecialtyId() != doctor.getSpecialtyId())     // the list in the form can be edited in DevTools
        err.put("serviceId", "Chọn một dịch vụ thuộc chuyên khoa " + doctor.getSpecialtyName());
    LocalDate date = null;
    try {
        date = LocalDate.parse(f.getDate());
        if (!date.isAfter(today) || date.isAfter(today.plusDays(Clinic.BOOK_AHEAD_DAYS)))
            err.put("date", "Chỉ đặt từ ngày mai tới " + Clinic.BOOK_AHEAD_DAYS + " ngày sau");
    } catch (DateTimeParseException e) {
        err.put("date", "Ngày không hợp lệ");
    }
    LocalTime time = null;
    try {
        time = LocalTime.parse(f.getTime());
        if (!Clinic.SLOTS.contains(time)) err.put("time", "Giờ phải là một khung giờ của phòng khám");
    } catch (DateTimeParseException e) {
        err.put("time", "Giờ không hợp lệ");
    }
    if (f.getReason().length() &gt; 300) err.put("reason", "Lý do tối đa 300 ký tự");
    if (!err.isEmpty()) return err;

    // Lock 1 — check in Java: gives a friendly message in the normal case
    if (appointments.isDoctorBusy(doctor.getId(), date, time)) {
        err.put("time", "Bác sĩ đã có lịch lúc " + time + " ngày " + date + " — chọn giờ khác");
        return err;
    }
    if (appointments.isPatientBusy(patientId, date, time)) {
        err.put("time", "Bạn đã có một lịch khác đúng giờ này");
        return err;
    }
    Appointment a = new Appointment();
    a.setPatientId(patientId);
    a.setDoctorId(doctor.getId());
    a.setServiceId(service.getId());
    a.setDate(date);
    a.setTime(time);
    a.setReason(f.getReason().isEmpty() ? null : f.getReason());
    try {
        appointments.insert(a);
    } catch (SQLException e) {
        // Lock 2 — the unique index: two clicks at the same millisecond both passed lock 1
        if (e.getErrorCode() == 2601 || e.getErrorCode() == 2627) {
            err.put("time", "Khung giờ này vừa có người đặt — chọn giờ khác");
            return err;
        }
        throw e;
    }
    return err;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public boolean isDoctorBusy(int doctorId, LocalDate date, LocalTime time) throws SQLException {
    return count("SELECT COUNT(*) FROM Appointment WHERE doctorId = ? AND apptDate = ? AND apptTime = ? AND status &lt;&gt; 'CANCELLED'",
            List.of(doctorId, date, time)) &gt; 0;
}

public boolean isPatientBusy(int patientId, LocalDate date, LocalTime time) throws SQLException {
    return count("SELECT COUNT(*) FROM Appointment WHERE patientId = ? AND apptDate = ? AND apptTime = ? AND status &lt;&gt; 'CANCELLED'",
            List.of(patientId, date, time)) &gt; 0;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/PatientAppointmentController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private void create(HttpServletRequest req, HttpServletResponse resp, Account me) throws SQLException, ServletException, IOException {
    BookingForm f = new BookingForm();
    f.setDoctorId(req.getParameter("doctorId"));
    f.setServiceId(req.getParameter("serviceId"));
    f.setDate(req.getParameter("date"));
    f.setTime(req.getParameter("time"));
    f.setReason(req.getParameter("reason"));
    Map&lt;String, String&gt; errors = booking.book(me.getId(), f, Clinic.today(getServletContext()));   // patientId from the SESSION
    if (!errors.isEmpty()) {
        resp.setStatus(HttpServletResponse.SC_CONFLICT);              // 409: the request is fine, the state of the schedule refuses it
        showForm(req, resp, f, errors);
        return;
    }
    Web.flash(req, "success", "Đặt lịch thành công: " + f.getDate() + " lúc " + f.getTime());
    resp.sendRedirect(req.getContextPath() + "/patient/appointments");
}</code></pre>
<p>Three rules broken at once — a service of another specialty (sent with DevTools), yesterday's date, a time that is not a slot. Status <strong>409 Conflict</strong> and every message under its field:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 59

doctorId=3&amp;serviceId=7&amp;date=2026-11-04&amp;time=12%3A15&amp;reason=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 409
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đặt lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4 mb-1"&gt;Đặt lịch với BS. Nguyễn Văn An&lt;/h1&gt;
&lt;p class="text-muted"&gt;Nội tổng quát · phòng P.101&lt;/p&gt;
&lt;form method="post" action="/phong-kham/patient/appointments/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="doctorId" value="3"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="sv"&gt;Dịch vụ&lt;/label&gt;
&lt;select class="form-select is-invalid" id="sv" name="serviceId" required&gt;
&lt;option value="1"&gt;Khám nội tổng quát — 200.000 đ&lt;/option&gt;
&lt;option value="2"&gt;Siêu âm ổ bụng — 350.000 đ&lt;/option&gt;
&lt;option value="3"&gt;Điện tim (ECG) — 150.000 đ&lt;/option&gt;
&lt;option value="4"&gt;Xét nghiệm máu tổng quát — 250.000 đ&lt;/option&gt;
&lt;option value="12"&gt;Siêu âm tuyến giáp — 300.000 đ&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Chọn một dịch vụ thuộc chuyên khoa Nội tổng quát&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="d"&gt;Ngày&lt;/label&gt;
&lt;input class="form-control is-invalid" id="d" type="date" name="date" min="2026-11-06" value="2026-11-04" required&gt;
&lt;div class="invalid-feedback"&gt;Chỉ đặt từ ngày mai tới 30 ngày sau&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="t"&gt;Giờ&lt;/label&gt;
&lt;select class="form-select is-invalid" id="t" name="time" required&gt;
&lt;option&gt;08:00&lt;/option&gt;
&lt;option&gt;08:30&lt;/option&gt;
&lt;option&gt;09:00&lt;/option&gt;
&lt;option&gt;09:30&lt;/option&gt;
&lt;option&gt;10:00&lt;/option&gt;
&lt;option&gt;10:30&lt;/option&gt;
&lt;option&gt;11:00&lt;/option&gt;
&lt;option&gt;13:30&lt;/option&gt;
&lt;option&gt;14:00&lt;/option&gt;
&lt;option&gt;14:30&lt;/option&gt;
&lt;option&gt;15:00&lt;/option&gt;
&lt;option&gt;15:30&lt;/option&gt;
&lt;option&gt;16:00&lt;/option&gt;
&lt;option&gt;16:30&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Giờ phải là một khung giờ của phòng khám&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="r"&gt;Lý do khám (tuỳ chọn)&lt;/label&gt;
&lt;textarea class="form-control" id="r" name="reason" rows="2" maxlength="300"&gt;&lt;/textarea&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đặt lịch&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
… (1 more lines / còn 1 dòng)</code></pre>
<p>A correct form, but BS. An already has 08:00 on 06/11 (appointment #8 of the sample data) — lock 1 answers:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 84

doctorId=3&amp;serviceId=1&amp;date=2026-11-06&amp;time=08%3A00&amp;reason=%C4%90au+%C4%91%E1%BA%A7u</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 409
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đặt lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4 mb-1"&gt;Đặt lịch với BS. Nguyễn Văn An&lt;/h1&gt;
&lt;p class="text-muted"&gt;Nội tổng quát · phòng P.101&lt;/p&gt;
&lt;form method="post" action="/phong-kham/patient/appointments/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="doctorId" value="3"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="sv"&gt;Dịch vụ&lt;/label&gt;
&lt;select class="form-select" id="sv" name="serviceId" required&gt;
&lt;option value="1" selected&gt;Khám nội tổng quát — 200.000 đ&lt;/option&gt;
&lt;option value="2"&gt;Siêu âm ổ bụng — 350.000 đ&lt;/option&gt;
&lt;option value="3"&gt;Điện tim (ECG) — 150.000 đ&lt;/option&gt;
&lt;option value="4"&gt;Xét nghiệm máu tổng quát — 250.000 đ&lt;/option&gt;
&lt;option value="12"&gt;Siêu âm tuyến giáp — 300.000 đ&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="d"&gt;Ngày&lt;/label&gt;
&lt;input class="form-control" id="d" type="date" name="date" min="2026-11-06" value="2026-11-06" required&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="t"&gt;Giờ&lt;/label&gt;
&lt;select class="form-select is-invalid" id="t" name="time" required&gt;
&lt;option selected&gt;08:00&lt;/option&gt;
&lt;option&gt;08:30&lt;/option&gt;
&lt;option&gt;09:00&lt;/option&gt;
&lt;option&gt;09:30&lt;/option&gt;
&lt;option&gt;10:00&lt;/option&gt;
&lt;option&gt;10:30&lt;/option&gt;
&lt;option&gt;11:00&lt;/option&gt;
&lt;option&gt;13:30&lt;/option&gt;
&lt;option&gt;14:00&lt;/option&gt;
&lt;option&gt;14:30&lt;/option&gt;
&lt;option&gt;15:00&lt;/option&gt;
&lt;option&gt;15:30&lt;/option&gt;
&lt;option&gt;16:00&lt;/option&gt;
&lt;option&gt;16:30&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Bác sĩ đã có lịch lúc 08:00 ngày 2026-11-06 — chọn giờ khác&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="r"&gt;Lý do khám (tuỳ chọn)&lt;/label&gt;
&lt;textarea class="form-control" id="r" name="reason" rows="2" maxlength="300"&gt;Đau đầu&lt;/textarea&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đặt lịch&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
… (1 more lines / còn 1 dòng)</code></pre>
<p>A free slot: saved, redirected, and the flash + the status badge on the list:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 110

doctorId=3&amp;serviceId=1&amp;date=2026-11-06&amp;time=09%3A00&amp;reason=%C4%90au+%C4%91%E1%BA%A7u%2C+ch%C3%B3ng+m%E1%BA%B7t</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/appointments</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch của tôi · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đặt lịch thành công: 2026-11-06 lúc 09:00&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám của tôi&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/"&gt;+ Đặt lịch mới&lt;/a&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/patient/appointments/view?id=13"&gt;Xem&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/patient/appointments/cancel"&gt;
&lt;input type="hidden" name="id" value="13"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Huỷ&lt;/button&gt;&lt;/form&gt;
&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The filtered index of ASM.2 at work: the patient cancels #13, then books the <em>same</em> doctor, day and time again — accepted, because the CANCELLED row no longer counts.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/cancel HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 5

id=13</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/appointments</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 87

doctorId=3&amp;serviceId=3&amp;date=2026-11-06&amp;time=09%3A00&amp;reason=%C4%90%E1%BA%B7t+l%E1%BA%A1i</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/appointments</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch của tôi · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đặt lịch thành công: 2026-11-06 lúc 09:00&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám của tôi&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/"&gt;+ Đặt lịch mới&lt;/a&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;&lt;td&gt;Điện tim (ECG)&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/patient/appointments/view?id=14"&gt;Xem&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/patient/appointments/cancel"&gt;
&lt;input type="hidden" name="id" value="14"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Huỷ&lt;/button&gt;&lt;/form&gt;
&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-secondary"&gt;Đã huỷ&lt;/span&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/patient/appointments/view?id=13"&gt;Xem&lt;/a&gt;
&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
    `<h2>4. Giao dịch trung tâm: đặt lịch không trùng giờ (UC04)</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/7ec807bc72e51e31a46eefbe6e996b3a92fe75a1.svg" alt="Request đặt lịch: kiểm dữ liệu, ổ khoá 1 (kiểm bằng Java), ổ khoá 2 (chỉ mục duy nhất)" loading="lazy" /><p class="chu-thich">🧩 Request đặt lịch: kiểm dữ liệu, ổ khoá 1 (kiểm bằng Java), ổ khoá 2 (chỉ mục duy nhất)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Booking (POST /patient/appointments/create): two locks against double booking
actor "Bệnh nhân" as P
participant "PatientAppointment\\nController" as C
participant "BookingService" as S
participant "AppointmentDAO" as D
database "SQL Server" as DB
P -&gt; C : POST doctorId, serviceId,\\ndate, time, reason
C -&gt; S : book(patientId from SESSION, form, today)
S -&gt; S : validate: doctor exists, service of his specialty,\\ndate in (today, today+30], time in SLOTS
alt invalid
  S --&gt; C : errors
  C --&gt; P : 409 + form again (sticky)
else valid
  S -&gt; D : isDoctorBusy / isPatientBusy
  D -&gt; DB : SELECT COUNT(*) …
  alt busy (lock 1: check in Java)
    S --&gt; C : "Bác sĩ đã có lịch lúc …"
    C --&gt; P : 409 + form again
  else free
    S -&gt; D : insert(a)
    D -&gt; DB : INSERT Appointment
    alt duplicate key 2601 (lock 2: unique index)
      DB --&gt; D : SQLException 2601
      S --&gt; C : "Khung giờ này vừa có người đặt"
      C --&gt; P : 409 + form again
    else saved
      C --&gt; P : 302 → /patient/appointments (PRG)
    end
  end
end
@enduml</code></pre></details>
<p>Form. HTML5 giúp bệnh nhân (<code>type="date"</code> với <code>min</code> = ngày mai, <code>required</code>, một <code>select</code> các khung giờ) — còn <code>novalidate</code> cố ý tắt kiểm tra của trình duyệt để bạn thấy câu trả lời của server; đằng nào server cũng không bao giờ tin trình duyệt.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/patient/booking-form.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- HTML5 giúp người dùng (type=date, min, required) — SERVER vẫn kiểm tra lại tất cả --%&gt;
&lt;form method="post" action="&#36;{ctx}/patient/appointments/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="doctorId" value="&#36;{doctor.id}"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="sv"&gt;Dịch vụ&lt;/label&gt;
&lt;select class="form-select&#36;{empty errors.serviceId ? '' : ' is-invalid'}" id="sv" name="serviceId" required&gt;
&lt;c:forEach items="&#36;{services}" var="s"&gt;&lt;option value="&#36;{s.id}"&#36;{form.serviceId == s.id.toString() ? ' selected' : ''}&gt;&lt;c:out value="&#36;{s.name}"/&gt; — &lt;fmt:formatNumber value="&#36;{s.price}" pattern="#,##0"/&gt; đ&lt;/option&gt;
&lt;/c:forEach&gt;&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.serviceId}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="d"&gt;Ngày&lt;/label&gt;
&lt;input class="form-control&#36;{empty errors.date ? '' : ' is-invalid'}" id="d" type="date" name="date" min="&#36;{minDate}" value="&#36;{fn:escapeXml(form.date)}" required&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.date}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="t"&gt;Giờ&lt;/label&gt;
&lt;select class="form-select&#36;{empty errors.time ? '' : ' is-invalid'}" id="t" name="time" required&gt;
&lt;c:forEach items="&#36;{slots}" var="t"&gt;&lt;option&#36;{form.time == t.toString() ? ' selected' : ''}&gt;&#36;{t}&lt;/option&gt;
&lt;/c:forEach&gt;&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.time}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="r"&gt;Lý do khám (tuỳ chọn)&lt;/label&gt;
&lt;textarea class="form-control&#36;{empty errors.reason ? '' : ' is-invalid'}" id="r" name="reason" rows="2" maxlength="300"&gt;&lt;c:out value="&#36;{form.reason}"/&gt;&lt;/textarea&gt;
&lt;div class="invalid-feedback"&gt;&#36;{errors.reason}&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đặt lịch&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;</code></pre>
<p>Luật nằm trong service, không nằm trong servlet:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/BookingService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public Map&lt;String, String&gt; book(int patientId, BookingForm f, LocalDate today) throws SQLException {
    Map&lt;String, String&gt; err = new LinkedHashMap&lt;&gt;();
    Doctor doctor = catalog.findDoctor(util.Web.parseInt(f.getDoctorId(), 0));
    if (doctor == null) { err.put("doctorId", "Không có bác sĩ này"); return err; }
    MedicalService service = catalog.findService(util.Web.parseInt(f.getServiceId(), 0));
    if (service == null || service.getSpecialtyId() != doctor.getSpecialtyId())     // danh sách trong form sửa được bằng DevTools
        err.put("serviceId", "Chọn một dịch vụ thuộc chuyên khoa " + doctor.getSpecialtyName());
    LocalDate date = null;
    try {
        date = LocalDate.parse(f.getDate());
        if (!date.isAfter(today) || date.isAfter(today.plusDays(Clinic.BOOK_AHEAD_DAYS)))
            err.put("date", "Chỉ đặt từ ngày mai tới " + Clinic.BOOK_AHEAD_DAYS + " ngày sau");
    } catch (DateTimeParseException e) {
        err.put("date", "Ngày không hợp lệ");
    }
    LocalTime time = null;
    try {
        time = LocalTime.parse(f.getTime());
        if (!Clinic.SLOTS.contains(time)) err.put("time", "Giờ phải là một khung giờ của phòng khám");
    } catch (DateTimeParseException e) {
        err.put("time", "Giờ không hợp lệ");
    }
    if (f.getReason().length() &gt; 300) err.put("reason", "Lý do tối đa 300 ký tự");
    if (!err.isEmpty()) return err;

    // Ổ khoá 1 — kiểm bằng Java: cho thông báo dễ hiểu trong trường hợp thường
    if (appointments.isDoctorBusy(doctor.getId(), date, time)) {
        err.put("time", "Bác sĩ đã có lịch lúc " + time + " ngày " + date + " — chọn giờ khác");
        return err;
    }
    if (appointments.isPatientBusy(patientId, date, time)) {
        err.put("time", "Bạn đã có một lịch khác đúng giờ này");
        return err;
    }
    Appointment a = new Appointment();
    a.setPatientId(patientId);
    a.setDoctorId(doctor.getId());
    a.setServiceId(service.getId());
    a.setDate(date);
    a.setTime(time);
    a.setReason(f.getReason().isEmpty() ? null : f.getReason());
    try {
        appointments.insert(a);
    } catch (SQLException e) {
        // Ổ khoá 2 — chỉ mục duy nhất: hai cú bấm cùng một mili giây đều đã qua ổ khoá 1
        if (e.getErrorCode() == 2601 || e.getErrorCode() == 2627) {
            err.put("time", "Khung giờ này vừa có người đặt — chọn giờ khác");
            return err;
        }
        throw e;
    }
    return err;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public boolean isDoctorBusy(int doctorId, LocalDate date, LocalTime time) throws SQLException {
    return count("SELECT COUNT(*) FROM Appointment WHERE doctorId = ? AND apptDate = ? AND apptTime = ? AND status &lt;&gt; 'CANCELLED'",
            List.of(doctorId, date, time)) &gt; 0;
}

public boolean isPatientBusy(int patientId, LocalDate date, LocalTime time) throws SQLException {
    return count("SELECT COUNT(*) FROM Appointment WHERE patientId = ? AND apptDate = ? AND apptTime = ? AND status &lt;&gt; 'CANCELLED'",
            List.of(patientId, date, time)) &gt; 0;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/PatientAppointmentController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private void create(HttpServletRequest req, HttpServletResponse resp, Account me) throws SQLException, ServletException, IOException {
    BookingForm f = new BookingForm();
    f.setDoctorId(req.getParameter("doctorId"));
    f.setServiceId(req.getParameter("serviceId"));
    f.setDate(req.getParameter("date"));
    f.setTime(req.getParameter("time"));
    f.setReason(req.getParameter("reason"));
    Map&lt;String, String&gt; errors = booking.book(me.getId(), f, Clinic.today(getServletContext()));   // patientId lấy từ SESSION
    if (!errors.isEmpty()) {
        resp.setStatus(HttpServletResponse.SC_CONFLICT);              // 409: request đúng, nhưng trạng thái lịch không cho
        showForm(req, resp, f, errors);
        return;
    }
    Web.flash(req, "success", "Đặt lịch thành công: " + f.getDate() + " lúc " + f.getTime());
    resp.sendRedirect(req.getContextPath() + "/patient/appointments");
}</code></pre>
<p>Phá ba luật một lúc — dịch vụ của chuyên khoa khác (gửi bằng DevTools), ngày hôm qua, giờ không phải một khung giờ. Mã <strong>409 Conflict</strong> và mỗi thông báo nằm dưới đúng ô của nó:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 59

doctorId=3&amp;serviceId=7&amp;date=2026-11-04&amp;time=12%3A15&amp;reason=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 409
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đặt lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4 mb-1"&gt;Đặt lịch với BS. Nguyễn Văn An&lt;/h1&gt;
&lt;p class="text-muted"&gt;Nội tổng quát · phòng P.101&lt;/p&gt;
&lt;form method="post" action="/phong-kham/patient/appointments/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="doctorId" value="3"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="sv"&gt;Dịch vụ&lt;/label&gt;
&lt;select class="form-select is-invalid" id="sv" name="serviceId" required&gt;
&lt;option value="1"&gt;Khám nội tổng quát — 200.000 đ&lt;/option&gt;
&lt;option value="2"&gt;Siêu âm ổ bụng — 350.000 đ&lt;/option&gt;
&lt;option value="3"&gt;Điện tim (ECG) — 150.000 đ&lt;/option&gt;
&lt;option value="4"&gt;Xét nghiệm máu tổng quát — 250.000 đ&lt;/option&gt;
&lt;option value="12"&gt;Siêu âm tuyến giáp — 300.000 đ&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Chọn một dịch vụ thuộc chuyên khoa Nội tổng quát&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="d"&gt;Ngày&lt;/label&gt;
&lt;input class="form-control is-invalid" id="d" type="date" name="date" min="2026-11-06" value="2026-11-04" required&gt;
&lt;div class="invalid-feedback"&gt;Chỉ đặt từ ngày mai tới 30 ngày sau&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="t"&gt;Giờ&lt;/label&gt;
&lt;select class="form-select is-invalid" id="t" name="time" required&gt;
&lt;option&gt;08:00&lt;/option&gt;
&lt;option&gt;08:30&lt;/option&gt;
&lt;option&gt;09:00&lt;/option&gt;
&lt;option&gt;09:30&lt;/option&gt;
&lt;option&gt;10:00&lt;/option&gt;
&lt;option&gt;10:30&lt;/option&gt;
&lt;option&gt;11:00&lt;/option&gt;
&lt;option&gt;13:30&lt;/option&gt;
&lt;option&gt;14:00&lt;/option&gt;
&lt;option&gt;14:30&lt;/option&gt;
&lt;option&gt;15:00&lt;/option&gt;
&lt;option&gt;15:30&lt;/option&gt;
&lt;option&gt;16:00&lt;/option&gt;
&lt;option&gt;16:30&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Giờ phải là một khung giờ của phòng khám&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="r"&gt;Lý do khám (tuỳ chọn)&lt;/label&gt;
&lt;textarea class="form-control" id="r" name="reason" rows="2" maxlength="300"&gt;&lt;/textarea&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đặt lịch&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
… (1 more lines / còn 1 dòng)</code></pre>
<p>Form đúng, nhưng BS. An đã có lịch 08:00 ngày 06/11 (lịch #8 trong dữ liệu mẫu) — ổ khoá 1 trả lời:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 84

doctorId=3&amp;serviceId=1&amp;date=2026-11-06&amp;time=08%3A00&amp;reason=%C4%90au+%C4%91%E1%BA%A7u</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 409
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đặt lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4 mb-1"&gt;Đặt lịch với BS. Nguyễn Văn An&lt;/h1&gt;
&lt;p class="text-muted"&gt;Nội tổng quát · phòng P.101&lt;/p&gt;
&lt;form method="post" action="/phong-kham/patient/appointments/create" class="row g-3" novalidate&gt;
&lt;input type="hidden" name="doctorId" value="3"&gt;
&lt;div class="col-12 col-md-6"&gt;&lt;label class="form-label" for="sv"&gt;Dịch vụ&lt;/label&gt;
&lt;select class="form-select" id="sv" name="serviceId" required&gt;
&lt;option value="1" selected&gt;Khám nội tổng quát — 200.000 đ&lt;/option&gt;
&lt;option value="2"&gt;Siêu âm ổ bụng — 350.000 đ&lt;/option&gt;
&lt;option value="3"&gt;Điện tim (ECG) — 150.000 đ&lt;/option&gt;
&lt;option value="4"&gt;Xét nghiệm máu tổng quát — 250.000 đ&lt;/option&gt;
&lt;option value="12"&gt;Siêu âm tuyến giáp — 300.000 đ&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="d"&gt;Ngày&lt;/label&gt;
&lt;input class="form-control" id="d" type="date" name="date" min="2026-11-06" value="2026-11-06" required&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="t"&gt;Giờ&lt;/label&gt;
&lt;select class="form-select is-invalid" id="t" name="time" required&gt;
&lt;option selected&gt;08:00&lt;/option&gt;
&lt;option&gt;08:30&lt;/option&gt;
&lt;option&gt;09:00&lt;/option&gt;
&lt;option&gt;09:30&lt;/option&gt;
&lt;option&gt;10:00&lt;/option&gt;
&lt;option&gt;10:30&lt;/option&gt;
&lt;option&gt;11:00&lt;/option&gt;
&lt;option&gt;13:30&lt;/option&gt;
&lt;option&gt;14:00&lt;/option&gt;
&lt;option&gt;14:30&lt;/option&gt;
&lt;option&gt;15:00&lt;/option&gt;
&lt;option&gt;15:30&lt;/option&gt;
&lt;option&gt;16:00&lt;/option&gt;
&lt;option&gt;16:30&lt;/option&gt;
&lt;/select&gt;
&lt;div class="invalid-feedback"&gt;Bác sĩ đã có lịch lúc 08:00 ngày 2026-11-06 — chọn giờ khác&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="r"&gt;Lý do khám (tuỳ chọn)&lt;/label&gt;
&lt;textarea class="form-control" id="r" name="reason" rows="2" maxlength="300"&gt;Đau đầu&lt;/textarea&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đặt lịch&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
… (1 more lines / còn 1 dòng)</code></pre>
<p>Một khung giờ trống: lưu, redirect, rồi flash + nhãn trạng thái trên danh sách:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 110

doctorId=3&amp;serviceId=1&amp;date=2026-11-06&amp;time=09%3A00&amp;reason=%C4%90au+%C4%91%E1%BA%A7u%2C+ch%C3%B3ng+m%E1%BA%B7t</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/appointments</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch của tôi · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đặt lịch thành công: 2026-11-06 lúc 09:00&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám của tôi&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/"&gt;+ Đặt lịch mới&lt;/a&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/patient/appointments/view?id=13"&gt;Xem&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/patient/appointments/cancel"&gt;
&lt;input type="hidden" name="id" value="13"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Huỷ&lt;/button&gt;&lt;/form&gt;
&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Chỉ mục có lọc của ASM.2 vào việc: bệnh nhân huỷ lịch #13, rồi đặt lại <em>đúng</em> bác sĩ, ngày, giờ đó — được nhận, vì dòng CANCELLED không còn được tính.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/cancel HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 5

id=13</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/appointments</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 87

doctorId=3&amp;serviceId=3&amp;date=2026-11-06&amp;time=09%3A00&amp;reason=%C4%90%E1%BA%B7t+l%E1%BA%A1i</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/appointments</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch của tôi · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đặt lịch thành công: 2026-11-06 lúc 09:00&lt;/div&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám của tôi&lt;/h1&gt;
&lt;a class="btn btn-primary" href="/phong-kham/"&gt;+ Đặt lịch mới&lt;/a&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;&lt;td&gt;Điện tim (ECG)&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/patient/appointments/view?id=14"&gt;Xem&lt;/a&gt;
&lt;form class="d-inline" method="post" action="/phong-kham/patient/appointments/cancel"&gt;
&lt;input type="hidden" name="id" value="14"&gt;&lt;button class="btn btn-sm btn-outline-danger"&gt;Huỷ&lt;/button&gt;&lt;/form&gt;
&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-secondary"&gt;Đã huỷ&lt;/span&gt;&lt;/td&gt;
&lt;td class="text-nowrap"&gt;&lt;a class="btn btn-sm btn-outline-secondary" href="/phong-kham/patient/appointments/view?id=13"&gt;Xem&lt;/a&gt;
&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`),
    bi(`<h2>5. Why lock 2 exists: the race, made to happen</h2>
<p>"Check, then insert" has a gap. Two patients click <em>Book</em> for the same slot in the same millisecond: both checks see "free", both inserts run. Usually you never see it in testing — so this side app forces the worst order every time with a <code>CyclicBarrier</code>: thread A checks, thread B checks, <em>then</em> both insert. It runs once against a table without the unique index and once against the same table with it.</p>
<p class="ghi-chu">📄 <code>pk-trung-gio/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE LichKhong (                      -- NO unique index: only the Java check protects it
    id INT IDENTITY PRIMARY KEY, doctorId INT NOT NULL, apptDate DATE NOT NULL, apptTime TIME(0) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'BOOKED'
);
CREATE TABLE LichCo (                         -- same table + the filtered unique index of the clinic app
    id INT IDENTITY PRIMARY KEY, doctorId INT NOT NULL, apptDate DATE NOT NULL, apptTime TIME(0) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'BOOKED'
);
CREATE UNIQUE INDEX UX_LichCo_Doctor_Slot ON LichCo(doctorId, apptDate, apptTime) WHERE status &lt;&gt; 'CANCELLED';</code></pre>
<p class="ghi-chu">📄 <code>pk-trung-gio/src/main/java/demo/RaceServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Exactly what BookingService does: check, then insert
private String book(String table, CyclicBarrier bothChecked) {
    try (Connection c = connect()) {
        boolean busy;
        try (PreparedStatement ps = c.prepareStatement("SELECT COUNT(*) FROM " + table
                + " WHERE doctorId = 3 AND apptDate = ? AND apptTime = ? AND status &lt;&gt; 'CANCELLED'")) {
            ps.setObject(1, DAY);
            ps.setObject(2, SLOT);
            try (ResultSet rs = ps.executeQuery()) { rs.next(); busy = rs.getInt(1) &gt; 0; }
        }
        bothChecked.await();                         // wait until the OTHER thread has checked too
        if (busy) return "busy";
        try (PreparedStatement ps = c.prepareStatement("INSERT INTO " + table + " (doctorId, apptDate, apptTime) VALUES (3, ?, ?)")) {
            ps.setObject(1, DAY);
            ps.setObject(2, SLOT);
            ps.executeUpdate();
        }
        return "OK";
    } catch (SQLException e) {
        return "lỗi " + e.getErrorCode() + " — " + e.getMessage();
    } catch (Exception e) {
        return e.toString();
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pk-trung-gio/dua?bang=khong-chi-muc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8

Bảng LichKhong (KHÔNG có chỉ mục duy nhất)
Cả hai luồng đã kiểm tra trước: "bác sĩ 3 còn trống 09:00 ngày 06/11"
INSERT thành công: 2 · bị chặn: 0
⇒ số lịch của bác sĩ 3 lúc 09:00 ngày 06/11: 2  ← TRÙNG GIỜ</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /pk-trung-gio/dua?bang=co-chi-muc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8

Bảng LichCo (CÓ chỉ mục duy nhất)
Cả hai luồng đã kiểm tra trước: "bác sĩ 3 còn trống 09:00 ngày 06/11"
INSERT thành công: 1 · bị chặn: 1
Bị chặn bởi CSDL: lỗi 2601 — Cannot insert duplicate key row in object 'dbo.LichCo' with unique index 'UX_LichCo_Doctor_Slot'. The duplicate key value is (3, 2026-11-06, 09:00:00).
⇒ số lịch của bác sĩ 3 lúc 09:00 ngày 06/11: 1  ← đúng</code></pre>
<p>Without the index: two rows, a double booking that no Java check could prevent. With it: SQL Server rejects the second INSERT with error <strong>2601</strong> ("Cannot insert duplicate key row … with unique index …"). That is exactly the code <code>BookingService</code> catches (together with 2627, the code of a UNIQUE <em>constraint</em>) to answer "this slot was just taken". Lock 1 gives the friendly message in 99.9% of cases; lock 2 guarantees the rule in 100%.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the same two locks — a check in the <code>@Service</code> and a unique (partial) index in the migration; Spring translates the duplicate-key error into <code>DataIntegrityViolationException</code>, which a <code>@ControllerAdvice</code> turns into HTTP 409 for the React client.</div>`,
    `<h2>5. Vì sao cần ổ khoá 2: cuộc đua, cho xảy ra thật</h2>
<p>"Kiểm rồi mới insert" có một khe hở. Hai bệnh nhân bấm <em>Đặt lịch</em> cho cùng khung giờ trong cùng một mili giây: cả hai lần kiểm đều thấy "trống", cả hai lệnh INSERT đều chạy. Lúc tự thử thường không bao giờ gặp — nên app phụ này ép thứ tự tệ nhất xảy ra lần nào cũng như lần nào bằng một <code>CyclicBarrier</code>: luồng A kiểm, luồng B kiểm, <em>rồi</em> cả hai cùng insert. Nó chạy một lần trên bảng không có chỉ mục duy nhất và một lần trên đúng bảng đó có chỉ mục.</p>
<p class="ghi-chu">📄 <code>pk-trung-gio/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE LichKhong (                      -- KHÔNG có chỉ mục duy nhất: chỉ phép kiểm Java bảo vệ
    id INT IDENTITY PRIMARY KEY, doctorId INT NOT NULL, apptDate DATE NOT NULL, apptTime TIME(0) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'BOOKED'
);
CREATE TABLE LichCo (                         -- cùng bảng + chỉ mục duy nhất có lọc của app phòng khám
    id INT IDENTITY PRIMARY KEY, doctorId INT NOT NULL, apptDate DATE NOT NULL, apptTime TIME(0) NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'BOOKED'
);
CREATE UNIQUE INDEX UX_LichCo_Doctor_Slot ON LichCo(doctorId, apptDate, apptTime) WHERE status &lt;&gt; 'CANCELLED';</code></pre>
<p class="ghi-chu">📄 <code>pk-trung-gio/src/main/java/demo/RaceServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Đúng việc BookingService làm: kiểm, rồi insert
private String book(String table, CyclicBarrier bothChecked) {
    try (Connection c = connect()) {
        boolean busy;
        try (PreparedStatement ps = c.prepareStatement("SELECT COUNT(*) FROM " + table
                + " WHERE doctorId = 3 AND apptDate = ? AND apptTime = ? AND status &lt;&gt; 'CANCELLED'")) {
            ps.setObject(1, DAY);
            ps.setObject(2, SLOT);
            try (ResultSet rs = ps.executeQuery()) { rs.next(); busy = rs.getInt(1) &gt; 0; }
        }
        bothChecked.await();                         // chờ tới khi luồng KIA cũng đã kiểm xong
        if (busy) return "busy";
        try (PreparedStatement ps = c.prepareStatement("INSERT INTO " + table + " (doctorId, apptDate, apptTime) VALUES (3, ?, ?)")) {
            ps.setObject(1, DAY);
            ps.setObject(2, SLOT);
            ps.executeUpdate();
        }
        return "OK";
    } catch (SQLException e) {
        return "lỗi " + e.getErrorCode() + " — " + e.getMessage();
    } catch (Exception e) {
        return e.toString();
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pk-trung-gio/dua?bang=khong-chi-muc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8

Bảng LichKhong (KHÔNG có chỉ mục duy nhất)
Cả hai luồng đã kiểm tra trước: "bác sĩ 3 còn trống 09:00 ngày 06/11"
INSERT thành công: 2 · bị chặn: 0
⇒ số lịch của bác sĩ 3 lúc 09:00 ngày 06/11: 2  ← TRÙNG GIỜ</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /pk-trung-gio/dua?bang=co-chi-muc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8

Bảng LichCo (CÓ chỉ mục duy nhất)
Cả hai luồng đã kiểm tra trước: "bác sĩ 3 còn trống 09:00 ngày 06/11"
INSERT thành công: 1 · bị chặn: 1
Bị chặn bởi CSDL: lỗi 2601 — Cannot insert duplicate key row in object 'dbo.LichCo' with unique index 'UX_LichCo_Doctor_Slot'. The duplicate key value is (3, 2026-11-06, 09:00:00).
⇒ số lịch của bác sĩ 3 lúc 09:00 ngày 06/11: 1  ← đúng</code></pre>
<p>Không có chỉ mục: hai dòng, một lịch trùng mà không phép kiểm Java nào ngăn được. Có chỉ mục: SQL Server từ chối INSERT thứ hai với lỗi <strong>2601</strong> ("Cannot insert duplicate key row … with unique index …"). Đó đúng là mã <code>BookingService</code> bắt (cùng với 2627, mã của <em>ràng buộc</em> UNIQUE) để trả lời "khung giờ này vừa có người đặt". Ổ khoá 1 cho thông báo dễ hiểu trong 99,9% trường hợp; ổ khoá 2 bảo đảm luật trong 100%.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): vẫn hai ổ khoá đó — một phép kiểm trong <code>@Service</code> và một chỉ mục duy nhất (partial index) trong migration; Spring dịch lỗi trùng khoá thành <code>DataIntegrityViolationException</code>, và một <code>@ControllerAdvice</code> biến nó thành HTTP 409 cho client React.</div>`),
    bi(`<h2>6. The receptionist: search, filters and paging over a join (UC10)</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Reception search: optional filters ⇒ the SQL grows, but ONLY with "?" placeholders, never with typed text
public Page&lt;Appointment&gt; search(String q, String status, LocalDate date, int page, int size) throws SQLException {
    StringBuilder where = new StringBuilder("WHERE 1 = 1 ");
    List&lt;Object&gt; args = new ArrayList&lt;&gt;();
    if (q != null &amp;&amp; !q.isBlank()) {
        where.append("AND (pa.fullName LIKE ? ESCAPE '!' OR da.fullName LIKE ? ESCAPE '!') ");
        String p = "%" + CatalogDAO.likeEscape(q) + "%";
        args.add(p);
        args.add(p);
    }
    if (status != null &amp;&amp; !status.isBlank()) { where.append("AND a.status = ? "); args.add(status); }
    if (date != null) { where.append("AND a.apptDate = ? "); args.add(date); }

    int total = count("SELECT COUNT(*) FROM (" + SELECT + where + ") x", args);
    int number = Page.clamp(page, total, size);
    List&lt;Object&gt; pageArgs = new ArrayList&lt;&gt;(args);
    pageArgs.add((number - 1) * size);
    pageArgs.add(size);
    List&lt;Appointment&gt; items = query(SELECT + where
            + "ORDER BY a.apptDate DESC, a.apptTime, a.appointmentId OFFSET ? ROWS FETCH NEXT ? ROWS ONLY", pageArgs.toArray());
    return new Page&lt;&gt;(items, number, size, total);
}</code></pre>
<p>The WHERE clause grows with the filters the user filled in, but only with fixed SQL text and <code>?</code> placeholders — the typed values travel as parameters. The status filter is first checked against a whitelist in the controller:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/ReceptionAppointmentController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String q = req.getParameter("q") == null ? "" : req.getParameter("q").trim();
    String st = req.getParameter("status");
    String status = st != null &amp;&amp; STATUSES.contains(st) ? st : "";        // whitelist; List.of(...).contains(null) THROWS NullPointerException
    LocalDate date = null;
    try { date = LocalDate.parse(req.getParameter("date")); } catch (RuntimeException ignored) { }
    try {
        req.setAttribute("page", appointments.search(q, status, date, Web.parseInt(req.getParameter("page"), 1), PAGE_SIZE));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    req.setAttribute("q", q);
    req.setAttribute("status", status);
    req.setAttribute("date", date == null ? "" : date.toString());
    req.setAttribute("statuses", STATUSES);
    req.getRequestDispatcher("/WEB-INF/views/reception/appointments.jsp").forward(req, resp);
}</code></pre>
<div class="pitfall">The first version wrote <code>STATUSES.contains(req.getParameter("status"))</code>. When the page was opened without <code>?status=</code> the parameter is <code>null</code>, and <code>List.of(…).contains(null)</code> <strong>throws NullPointerException</strong> (immutable lists refuse null even in a lookup) — the reception page answered 500 on its very first visit. <code>ArrayList.contains(null)</code> would have returned <code>false</code>; know which list you hold.</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option&gt;BOOKED&lt;/option&gt;
&lt;option&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;09/11/2026&lt;/td&gt;&lt;td&gt;15:00&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;BS. Phạm Quốc Dũng&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;9&lt;/td&gt;&lt;td&gt;07/11/2026&lt;/td&gt;&lt;td&gt;09:30&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;BS. Lê Minh Chi&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;8&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;08:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Phạm Quang Minh&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-secondary"&gt;Đã huỷ&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Phạm Quang Minh&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/3 · 14 kết quả&lt;/p&gt;
&lt;nav aria-label="pages"&gt;&lt;ul class="pagination pagination-sm flex-wrap"&gt;
  &lt;li class="page-item active" aria-current="page"&gt;&lt;span class="page-link"&gt;1&lt;/span&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/reception/appointments?page=2"&gt;2&lt;/a&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/reception/appointments?page=3"&gt;3&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;&lt;/nav&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Search by a name (patient or doctor) and filter by status at once:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?q=Khang&amp;status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="Khang" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option&gt;BOOKED&lt;/option&gt;
&lt;option selected&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;31/10/2026&lt;/td&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Lê Minh Chi&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/reception/invoices/create"&gt;&lt;input type="hidden" name="appointmentId" value="11"&gt;
&lt;button class="btn btn-sm btn-outline-success"&gt;Lập hoá đơn&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;29/10/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 2 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
    `<h2>6. Lễ tân: tìm kiếm, bộ lọc và phân trang trên một câu join (UC10)</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Lễ tân tìm: bộ lọc tuỳ chọn ⇒ câu SQL dài thêm, nhưng CHỈ thêm dấu "?", không bao giờ thêm chữ người gõ
public Page&lt;Appointment&gt; search(String q, String status, LocalDate date, int page, int size) throws SQLException {
    StringBuilder where = new StringBuilder("WHERE 1 = 1 ");
    List&lt;Object&gt; args = new ArrayList&lt;&gt;();
    if (q != null &amp;&amp; !q.isBlank()) {
        where.append("AND (pa.fullName LIKE ? ESCAPE '!' OR da.fullName LIKE ? ESCAPE '!') ");
        String p = "%" + CatalogDAO.likeEscape(q) + "%";
        args.add(p);
        args.add(p);
    }
    if (status != null &amp;&amp; !status.isBlank()) { where.append("AND a.status = ? "); args.add(status); }
    if (date != null) { where.append("AND a.apptDate = ? "); args.add(date); }

    int total = count("SELECT COUNT(*) FROM (" + SELECT + where + ") x", args);
    int number = Page.clamp(page, total, size);
    List&lt;Object&gt; pageArgs = new ArrayList&lt;&gt;(args);
    pageArgs.add((number - 1) * size);
    pageArgs.add(size);
    List&lt;Appointment&gt; items = query(SELECT + where
            + "ORDER BY a.apptDate DESC, a.apptTime, a.appointmentId OFFSET ? ROWS FETCH NEXT ? ROWS ONLY", pageArgs.toArray());
    return new Page&lt;&gt;(items, number, size, total);
}</code></pre>
<p>Mệnh đề WHERE dài thêm theo các bộ lọc người dùng đã điền, nhưng chỉ bằng chữ SQL cố định và dấu <code>?</code> — giá trị người gõ đi dưới dạng tham số. Bộ lọc trạng thái còn được so trước với một danh sách trắng trong controller:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/ReceptionAppointmentController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String q = req.getParameter("q") == null ? "" : req.getParameter("q").trim();
    String st = req.getParameter("status");
    String status = st != null &amp;&amp; STATUSES.contains(st) ? st : "";        // danh sách trắng; List.of(...).contains(null) NÉM NullPointerException
    LocalDate date = null;
    try { date = LocalDate.parse(req.getParameter("date")); } catch (RuntimeException ignored) { }
    try {
        req.setAttribute("page", appointments.search(q, status, date, Web.parseInt(req.getParameter("page"), 1), PAGE_SIZE));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    req.setAttribute("q", q);
    req.setAttribute("status", status);
    req.setAttribute("date", date == null ? "" : date.toString());
    req.setAttribute("statuses", STATUSES);
    req.getRequestDispatcher("/WEB-INF/views/reception/appointments.jsp").forward(req, resp);
}</code></pre>
<div class="pitfall">Bản đầu tiên viết <code>STATUSES.contains(req.getParameter("status"))</code>. Mở trang mà không có <code>?status=</code> thì tham số là <code>null</code>, và <code>List.of(…).contains(null)</code> <strong>ném NullPointerException</strong> (danh sách bất biến từ chối null kể cả khi chỉ tra cứu) — trang lễ tân trả 500 ngay lần mở đầu tiên. <code>ArrayList.contains(null)</code> thì trả <code>false</code>; phải biết mình đang cầm loại danh sách nào.</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option&gt;BOOKED&lt;/option&gt;
&lt;option&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;09/11/2026&lt;/td&gt;&lt;td&gt;15:00&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;BS. Phạm Quốc Dũng&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;9&lt;/td&gt;&lt;td&gt;07/11/2026&lt;/td&gt;&lt;td&gt;09:30&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;BS. Lê Minh Chi&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;8&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;08:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;13&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Phạm Quang Minh&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-secondary"&gt;Đã huỷ&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;14&lt;/td&gt;&lt;td&gt;06/11/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Phạm Quang Minh&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;—&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/3 · 14 kết quả&lt;/p&gt;
&lt;nav aria-label="pages"&gt;&lt;ul class="pagination pagination-sm flex-wrap"&gt;
  &lt;li class="page-item active" aria-current="page"&gt;&lt;span class="page-link"&gt;1&lt;/span&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/reception/appointments?page=2"&gt;2&lt;/a&gt;&lt;/li&gt;
  &lt;li class="page-item"&gt;&lt;a class="page-link" href="/phong-kham/reception/appointments?page=3"&gt;3&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;&lt;/nav&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Tìm theo tên (bệnh nhân hoặc bác sĩ) và lọc theo trạng thái cùng lúc:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?q=Khang&amp;status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="Khang" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option&gt;BOOKED&lt;/option&gt;
&lt;option selected&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;31/10/2026&lt;/td&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Lê Minh Chi&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/reception/invoices/create"&gt;&lt;input type="hidden" name="appointmentId" value="11"&gt;
&lt;button class="btn btn-sm btn-outline-success"&gt;Lập hoá đơn&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;29/10/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 2 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`),
    bi(`<h2>7. Invoices — the place where ASM.5 (sandbox payment) will plug in</h2>
<p>Rules of UC11: only for a DONE visit, only once, and the amount comes from the database — a hidden field with the price could be edited by anyone.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/InvoiceService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Invoice rules: only a DONE visit, only once, amount = price of the service. Returns null when created, else the reason
public class InvoiceService {
    private final AppointmentDAO appointments = new AppointmentDAO();
    private final InvoiceDAO invoices = new InvoiceDAO();

    public String create(int appointmentId) throws SQLException {
        Appointment a = appointments.findById(appointmentId);
        if (a == null) return "Không có lịch khám #" + appointmentId;
        if (!Appointment.DONE.equals(a.getStatus())) return "Lịch #" + appointmentId + " chưa khám xong (" + a.getStatus() + ") — chưa lập hoá đơn được";
        if (invoices.existsForAppointment(appointmentId)) return "Lịch #" + appointmentId + " đã có hoá đơn";
        invoices.insert(appointmentId, a.getPrice());      // the price comes from the DATABASE, never from the form
        return null;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/ReceptionInvoiceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// RECEPTIONIST: create the invoice of a finished visit (POST only). Payment = lesson A.5
@WebServlet("/reception/invoices/create")
public class ReceptionInvoiceController extends HttpServlet {
    private final InvoiceService invoices = new InvoiceService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int id = Web.parseInt(req.getParameter("appointmentId"), 0);
        try {
            String problem = invoices.create(id);
            if (problem == null) Web.flash(req, "success", "Đã lập hoá đơn cho lịch #" + id + " (UNPAID)");
            else Web.flash(req, "danger", problem);
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        resp.sendRedirect(req.getContextPath() + "/reception/appointments?status=DONE");
    }
}</code></pre>
<p>Three tries, each followed by the page the redirect leads to (only its top, where the flash message is). Appointment #6 is still BOOKED:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/reception/invoices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(4)
Content-Length: 15

appointmentId=6</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/reception/appointments?status=DONE</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger" role="alert"&gt;Lịch #6 chưa khám xong (BOOKED) — chưa lập hoá đơn được&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
… (40 more lines / còn 40 dòng)</code></pre>
<p>Appointment #3 is DONE ⇒ invoice created, UNPAID; the "Lập hoá đơn" button of #3 is replaced by the badge:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/reception/invoices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(4)
Content-Length: 15

appointmentId=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/reception/appointments?status=DONE</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã lập hoá đơn cho lịch #3 (UNPAID)&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option&gt;BOOKED&lt;/option&gt;
&lt;option selected&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;08:30&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/reception/invoices/create"&gt;&lt;input type="hidden" name="appointmentId" value="5"&gt;
&lt;button class="btn btn-sm btn-outline-success"&gt;Lập hoá đơn&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;31/10/2026&lt;/td&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Lê Minh Chi&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/reception/invoices/create"&gt;&lt;input type="hidden" name="appointmentId" value="11"&gt;
&lt;button class="btn btn-sm btn-outline-success"&gt;Lập hoá đơn&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;30/10/2026&lt;/td&gt;&lt;td&gt;14:00&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;BS. Trần Thị Bình&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;29/10/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;28/10/2026&lt;/td&gt;&lt;td&gt;08:00&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 5 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>A second click on the same visit (two tabs, a double click) is refused by the service — and would be by <code>UQ_Invoice_appointment</code> even if the check were missing:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/reception/invoices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(4)
Content-Length: 15

appointmentId=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/reception/appointments?status=DONE</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger" role="alert"&gt;Lịch #3 đã có hoá đơn&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
… (39 more lines / còn 39 dòng)</code></pre>
<p>The patient (bn.lan) sees her new invoice; paying it is lesson ASM.5:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/invoices HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Hoá đơn · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Hoá đơn của tôi&lt;/h1&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Số HĐ&lt;/th&gt;&lt;th&gt;Lịch&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Ngày khám&lt;/th&gt;&lt;th class="text-end"&gt;Số tiền (đ)&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;HD3&lt;/td&gt;&lt;td&gt;#3&lt;/td&gt;&lt;td&gt;Khám nhi&lt;/td&gt;&lt;td&gt;30/10/2026&lt;/td&gt;
&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/patient/invoices/pay" class="d-inline"&gt;
&lt;input type="hidden" name="id" value="3"&gt;&lt;button class="btn btn-sm btn-primary"&gt;Thanh toán (sandbox)&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
    `<h2>7. Hoá đơn — chỗ bài ASM.5 (thanh toán sandbox) sẽ cắm vào</h2>
<p>Luật của UC11: chỉ cho lượt khám DONE, chỉ một lần, và số tiền lấy từ CSDL — một ô ẩn chứa giá thì ai cũng sửa được.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/InvoiceService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Luật hoá đơn: chỉ lượt khám DONE, chỉ một lần, số tiền = giá dịch vụ. Trả null nếu đã tạo, ngược lại là lý do
public class InvoiceService {
    private final AppointmentDAO appointments = new AppointmentDAO();
    private final InvoiceDAO invoices = new InvoiceDAO();

    public String create(int appointmentId) throws SQLException {
        Appointment a = appointments.findById(appointmentId);
        if (a == null) return "Không có lịch khám #" + appointmentId;
        if (!Appointment.DONE.equals(a.getStatus())) return "Lịch #" + appointmentId + " chưa khám xong (" + a.getStatus() + ") — chưa lập hoá đơn được";
        if (invoices.existsForAppointment(appointmentId)) return "Lịch #" + appointmentId + " đã có hoá đơn";
        invoices.insert(appointmentId, a.getPrice());      // giá lấy từ CSDL, không bao giờ từ form
        return null;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/ReceptionInvoiceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// LỄ TÂN: lập hoá đơn cho lượt khám đã xong (chỉ POST). Thanh toán = bài A.5
@WebServlet("/reception/invoices/create")
public class ReceptionInvoiceController extends HttpServlet {
    private final InvoiceService invoices = new InvoiceService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int id = Web.parseInt(req.getParameter("appointmentId"), 0);
        try {
            String problem = invoices.create(id);
            if (problem == null) Web.flash(req, "success", "Đã lập hoá đơn cho lịch #" + id + " (UNPAID)");
            else Web.flash(req, "danger", problem);
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        resp.sendRedirect(req.getContextPath() + "/reception/appointments?status=DONE");
    }
}</code></pre>
<p>Ba lần thử, mỗi lần kèm trang mà redirect dẫn tới (chỉ phần đầu, chỗ có thông báo flash). Lịch #6 vẫn đang BOOKED:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/reception/invoices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(4)
Content-Length: 15

appointmentId=6</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/reception/appointments?status=DONE</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger" role="alert"&gt;Lịch #6 chưa khám xong (BOOKED) — chưa lập hoá đơn được&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
… (40 more lines / còn 40 dòng)</code></pre>
<p>Lịch #3 đã DONE ⇒ lập hoá đơn, UNPAID; nút "Lập hoá đơn" của #3 được thay bằng nhãn trạng thái:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/reception/invoices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(4)
Content-Length: 15

appointmentId=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/reception/appointments?status=DONE</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã lập hoá đơn cho lịch #3 (UNPAID)&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
&lt;div class="col-12 col-md-5"&gt;&lt;input class="form-control" name="q" value="" placeholder="Tên bệnh nhân hoặc bác sĩ"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;select class="form-select" name="status"&gt;&lt;option value=""&gt;Mọi trạng thái&lt;/option&gt;
&lt;option&gt;BOOKED&lt;/option&gt;
&lt;option selected&gt;DONE&lt;/option&gt;
&lt;option&gt;CANCELLED&lt;/option&gt;
&lt;/select&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-2"&gt;&lt;input class="form-control" type="date" name="date" value=""&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-2"&gt;&lt;button class="btn btn-outline-primary w-100"&gt;Lọc&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-sm align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Ngày&lt;/th&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Bác sĩ&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;Hoá đơn&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;08:30&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/reception/invoices/create"&gt;&lt;input type="hidden" name="appointmentId" value="5"&gt;
&lt;button class="btn btn-sm btn-outline-success"&gt;Lập hoá đơn&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;11&lt;/td&gt;&lt;td&gt;31/10/2026&lt;/td&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Lê Minh Chi&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/reception/invoices/create"&gt;&lt;input type="hidden" name="appointmentId" value="11"&gt;
&lt;button class="btn btn-sm btn-outline-success"&gt;Lập hoá đơn&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;30/10/2026&lt;/td&gt;&lt;td&gt;14:00&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;BS. Trần Thị Bình&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;29/10/2026&lt;/td&gt;&lt;td&gt;09:00&lt;/td&gt;&lt;td&gt;Lê Văn Khang&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;28/10/2026&lt;/td&gt;&lt;td&gt;08:00&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;BS. Nguyễn Văn An&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã thanh toán&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;p class="text-muted small mb-1"&gt;Trang 1/1 · 5 kết quả&lt;/p&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Bấm lần hai cho cùng lượt khám (hai tab, bấm đúp) bị service từ chối — và kể cả thiếu phép kiểm đó, <code>UQ_Invoice_appointment</code> cũng chặn:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/reception/invoices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(4)
Content-Length: 15

appointmentId=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/reception/appointments?status=DONE</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?status=DONE HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger" role="alert"&gt;Lịch #3 đã có hoá đơn&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
… (39 more lines / còn 39 dòng)</code></pre>
<p>Bệnh nhân (bn.lan) thấy hoá đơn mới của mình; thanh toán nó là bài ASM.5:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/invoices HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Hoá đơn · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Hoá đơn của tôi&lt;/h1&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Số HĐ&lt;/th&gt;&lt;th&gt;Lịch&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Ngày khám&lt;/th&gt;&lt;th class="text-end"&gt;Số tiền (đ)&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;HD3&lt;/td&gt;&lt;td&gt;#3&lt;/td&gt;&lt;td&gt;Khám nhi&lt;/td&gt;&lt;td&gt;30/10/2026&lt;/td&gt;
&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-warning"&gt;Chưa thanh toán&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;form method="post" action="/phong-kham/patient/invoices/pay" class="d-inline"&gt;
&lt;input type="hidden" name="id" value="3"&gt;&lt;button class="btn btn-sm btn-primary"&gt;Thanh toán (sandbox)&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`),
    bi(`<h2>🧪 Exercises (with solutions)</h2>
<h3>🧪 Exercise 1 — UC13: CRUD of doctors (~60 min)</h3>
<p>Copy the pattern of section 2 for doctors: list with search by name and the pager tag, create (account + doctor row), edit room and specialty, deactivate instead of delete.</p>
<p class="dap-an">✅ A doctor is an <code>Account</code> + a <code>Doctor</code> row ⇒ creating one is two INSERTs in ONE transaction, exactly like <code>AccountDAO.registerPatient</code> (ASM.4) but with role <code>DOCTOR</code>. "Delete" sets <code>Account.active = 0</code>: <code>CatalogDAO.doctors()</code> already filters <code>a.active = 1</code>, and old appointments keep their doctor (a real DELETE would hit error 547, like services). The page lives under <code>/admin/doctors/*</code>, so the filter of ASM.4 protects it with no extra line.</p>
<h3>🧪 Exercise 2 — filter the reception list by date (~15 min)</h3>
<p>The controller already reads <code>?date=</code>. Open <code>/reception/appointments?date=2026-11-05</code> mentally: which rows and how many pages?</p>
<p class="dap-an">✅ The 3 appointments of 05/11 (#5 08:30, #6 09:00, #12 10:00), 1 page — and the pager prints only "Trang 1/1 · 3 kết quả" with no links, because <code>doTag()</code> returns early when there is one page.</p>
<h3>🧪 Exercise 3 — make "Đặt lịch" remember the reason when the slot is taken (~5 min)</h3>
<p class="dap-an">✅ Nothing to do: look at the <code>dat-lich-trung</code> response — the textarea already contains "Đau đầu", because the form object keeps every typed string and the view prints it with <code>&lt;c:out&gt;</code>. That is the "sticky form" pattern; make sure YOUR forms do it too.</p>
<h3>🧪 Exercise 4 — your topic's central transaction (~2 h)</h3>
<p>Build your UC04: form, service with every rule of your ASM.1 table, the double-booking check, the unique index (or the transaction for date ranges), PRG, the list with badges. Then rerun <code>setup.sql</code> and try the three failing cases of section 4 on your app.</p>`,
    `<h2>🧪 Bài tập (có lời giải)</h2>
<h3>🧪 Bài 1 — UC13: CRUD bác sĩ (~60 phút)</h3>
<p>Chép khuôn của mục 2 cho bác sĩ: danh sách có tìm theo tên và thẻ phân trang, thêm (tài khoản + dòng bác sĩ), sửa phòng và chuyên khoa, ngừng hoạt động thay vì xoá.</p>
<p class="dap-an">✅ Bác sĩ là một <code>Account</code> + một dòng <code>Doctor</code> ⇒ thêm mới là hai lệnh INSERT trong MỘT transaction, y như <code>AccountDAO.registerPatient</code> (ASM.4) nhưng vai trò <code>DOCTOR</code>. "Xoá" thì đặt <code>Account.active = 0</code>: <code>CatalogDAO.doctors()</code> đã lọc <code>a.active = 1</code>, và các lịch cũ giữ nguyên bác sĩ của chúng (DELETE thật sẽ dính lỗi 547, như dịch vụ). Trang nằm dưới <code>/admin/doctors/*</code>, nên filter của ASM.4 bảo vệ nó mà không cần thêm dòng nào.</p>
<h3>🧪 Bài 2 — lọc danh sách lễ tân theo ngày (~15 phút)</h3>
<p>Controller đã đọc <code>?date=</code>. Hình dung mở <code>/reception/appointments?date=2026-11-05</code>: những dòng nào, bao nhiêu trang?</p>
<p class="dap-an">✅ 3 lịch của ngày 05/11 (#5 08:30, #6 09:00, #12 10:00), 1 trang — và thẻ phân trang chỉ in "Trang 1/1 · 3 kết quả" không có link, vì <code>doTag()</code> trả về sớm khi chỉ có một trang.</p>
<h3>🧪 Bài 3 — cho form "Đặt lịch" nhớ lý do khám khi khung giờ đã có người (~5 phút)</h3>
<p class="dap-an">✅ Không phải làm gì: nhìn response <code>dat-lich-trung</code> — ô textarea đã chứa "Đau đầu", vì đối tượng form giữ mọi chuỗi đã gõ và view in nó ra bằng <code>&lt;c:out&gt;</code>. Đó là khuôn "form dính"; hãy chắc chắn form CỦA BẠN cũng làm vậy.</p>
<h3>🧪 Bài 4 — giao dịch trung tâm của đề tài bạn (~2 giờ)</h3>
<p>Dựng UC04 của bạn: form, service có mọi luật trong bảng ASM.1, phép kiểm trùng, chỉ mục duy nhất (hoặc transaction cho khoảng ngày), PRG, danh sách có nhãn trạng thái. Rồi chạy lại <code>setup.sql</code> và thử ba trường hợp thất bại của mục 4 trên app của bạn.</p>`),
  ].join('\n'),
};

/* ───────── ASM.4 — 🧭 Assignment A–Z (4/6): hashed passwords, login, Filters by role and by owner (IDOR) ───────── */
const L_x_asm_4 = {
  title: 'ASM.4 — 🧭 Assignment A–Z (4/6): hashed passwords, login, Filters by role and by owner (IDOR)|||ASM.4 — 🧭 Assignment A–Z (4/6): mật khẩu băm, đăng nhập, Filter theo vai trò và chủ sở hữu (IDOR)',
  slug: 'prj301-asm-4',
  type: 'VIDEO',
  description: 'Bài tự thêm, chuỗi Assignment PRJ301 mẫu Quản lý phòng khám, đúng yêu cầu 1.9: lưu mật khẩu bằng PBKDF2 có sẵn trong JDK (so với BCrypt), đăng ký trong một transaction, đăng nhập với session mới và quay lại trang cũ an toàn, hai Filter khai theo thứ tự trong web.xml — phân quyền theo vai trò bệnh nhân, bác sĩ, lễ tân, admin và theo nghiệp vụ (bác sĩ chỉ ghi kết quả lịch của mình, bệnh nhân chỉ xem lịch của mình, chặn IDOR) — lớp bảo vệ thứ ba trong DAO, trang 403, đăng xuất bằng POST; mọi lần thử trái quyền có response thật.',
  content: [
    bi(`<span class="eyebrow">🧭 Course Assignment A–Z · 4/6 · added by this site</span>
<h2>Requirement 1.9: "authorize users <em>by business rule</em>" — two questions, not one</h2>
<p class="lead">A marker tests 1.9 in thirty seconds: log in as a patient, type an admin URL, then change <code>?id=</code> to somebody else's record. To pass, the application must answer two different questions on every request: <strong>"may this role open this area?"</strong> and <strong>"is this record yours?"</strong>. The second one is what "by business rule" means, and its absence has a name — <strong>IDOR</strong>, <em>Insecure Direct Object Reference</em>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/4365bb1ed3be7ea623fe75085afb10fd8258b5c9.svg" alt="The two filters in the order web.xml declares them; the DAO adds a third check" loading="lazy" /><p class="chu-thich">🧩 The two filters in the order web.xml declares them; the DAO adds a third check</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Two filters, in web.xml order: role first, then "is this appointment yours?"
start
:path = req.getServletPath();
if (public? "", /home, /login, /register, /logout, /css/**) then (yes)
  :chain.doFilter;
  stop
endif
if (session has "account"?) then (no)
  :302 → /login?next=URL;
  stop
endif
if (role allowed for this area?\\n/admin → ADMIN · /reception → RECEPTIONIST, ADMIN\\n/doctor → DOCTOR · /patient → PATIENT) then (no)
  :403 + forward 403.jsp;
  stop
endif
if (URL under /patient/appointments/* or\\n/doctor/appointments/* and has ?id=) then (yes)
  :owners = findOwners(id);
  if (appointment exists?) then (no)
    :404;
    stop
  endif
  if (owner == me.id?) then (no)
    :403 (IDOR blocked) + log;
    stop
  endif
endif
:chain.doFilter → servlet\\n(DAO still adds "AND doctorId = ?");
stop
@enduml</code></pre></details>
<p>The lesson goes in the order a user meets it: the password (stored safely), registration, login, the role filter, the ownership filter, logout. Background: sessions <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj5-1">4.A</a>, filters <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj10-1">8.A</a>, the role-filter exercise <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch8">8.3</a> (this lesson adds the business half).</p>`,
    `<span class="eyebrow">🧭 Assignment A–Z · 4/6 · phần web tự thêm</span>
<h2>Yêu cầu 1.9: "phân quyền người dùng <em>theo nghiệp vụ</em>" — hai câu hỏi, không phải một</h2>
<p class="lead">Người chấm thử 1.9 trong ba mươi giây: đăng nhập bằng bệnh nhân, gõ một URL của admin, rồi đổi <code>?id=</code> thành bản ghi của người khác. Muốn qua, ứng dụng phải trả lời hai câu hỏi khác nhau ở mọi request: <strong>"vai trò này có được vào khu này không?"</strong> và <strong>"bản ghi này có phải của bạn không?"</strong>. Câu thứ hai chính là "theo nghiệp vụ", và khi thiếu nó thì lỗ hổng có tên riêng — <strong>IDOR</strong>, <em>Insecure Direct Object Reference</em> (tham chiếu trực tiếp tới đối tượng mà không kiểm quyền).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/4365bb1ed3be7ea623fe75085afb10fd8258b5c9.svg" alt="Hai filter theo đúng thứ tự web.xml khai; DAO thêm phép kiểm thứ ba" loading="lazy" /><p class="chu-thich">🧩 Hai filter theo đúng thứ tự web.xml khai; DAO thêm phép kiểm thứ ba</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Two filters, in web.xml order: role first, then "is this appointment yours?"
start
:path = req.getServletPath();
if (public? "", /home, /login, /register, /logout, /css/**) then (yes)
  :chain.doFilter;
  stop
endif
if (session has "account"?) then (no)
  :302 → /login?next=URL;
  stop
endif
if (role allowed for this area?\\n/admin → ADMIN · /reception → RECEPTIONIST, ADMIN\\n/doctor → DOCTOR · /patient → PATIENT) then (no)
  :403 + forward 403.jsp;
  stop
endif
if (URL under /patient/appointments/* or\\n/doctor/appointments/* and has ?id=) then (yes)
  :owners = findOwners(id);
  if (appointment exists?) then (no)
    :404;
    stop
  endif
  if (owner == me.id?) then (no)
    :403 (IDOR blocked) + log;
    stop
  endif
endif
:chain.doFilter → servlet\\n(DAO still adds "AND doctorId = ?");
stop
@enduml</code></pre></details>
<p>Bài đi theo thứ tự người dùng gặp: mật khẩu (lưu an toàn), đăng ký, đăng nhập, filter vai trò, filter chủ sở hữu, đăng xuất. Nền tảng: session <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj5-1">4.A</a>, filter <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-prj10-1">8.A</a>, bài thực hành filter vai trò <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch8">8.3</a> (bài này thêm nửa "nghiệp vụ").</p>`),
    bi(`<h2>1. Passwords: hash them, with salt, slowly — PBKDF2 from the JDK</h2>
<p>The practice apps of Chapter 8 kept passwords in plain text "for the exercise". An Assignment must not: anyone who reads the table (a backup, a teammate's laptop, an SQL injection) would read every password — and people reuse passwords. Three words to know:</p>
<ul>
<li><strong>Hash, not encryption.</strong> Encryption can be reversed with a key; a hash cannot. At login you hash what was typed and compare hashes.</li>
<li><strong>Salt.</strong> A random value stored next to each hash, so two users with the same password get different hashes and precomputed tables are useless. Look at the four doctors in <code>setup.sql</code>: same password <code>Bacsi@123</code>, four different hashes.</li>
<li><strong>Slow.</strong> SHA-256 alone computes billions of guesses per second on a GPU. A <em>password hashing function</em> repeats the work on purpose.</li>
</ul>
<p>Which function? The OWASP Password Storage Cheat Sheet ranks <strong>Argon2id</strong> first, then scrypt; <strong>bcrypt</strong> is for legacy systems (it also ignores input beyond 72 bytes); <strong>PBKDF2</strong> is the choice when FIPS-140 compliance is required, with <strong>600,000 iterations</strong> for HMAC-SHA256. For PRJ301 PBKDF2 has one decisive advantage: it is <strong>built into the JDK</strong> (<code>javax.crypto.SecretKeyFactory</code>, algorithm <code>"PBKDF2WithHmacSHA256"</code>) — no extra jar. BCrypt needs a library (jBCrypt, or Spring Security's <code>BCryptPasswordEncoder</code> in LabFlow).</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/util/PasswordHasher.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
private static final int ITERATIONS = 600_000;      // OWASP Password Storage Cheat Sheet: 600,000 for PBKDF2-HMAC-SHA256
private static final int SALT_BYTES = 16;           // a NEW random salt per password ⇒ same password, different hash
private static final int KEY_BITS = 256;
private static final SecureRandom RANDOM = new SecureRandom();</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/util/PasswordHasher.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public static String hash(String password) {
    byte[] salt = new byte[SALT_BYTES];
    RANDOM.nextBytes(salt);
    byte[] key = derive(password, salt, ITERATIONS);
    Base64.Encoder b64 = Base64.getEncoder();
    return "pbkdf2_sha256$" + ITERATIONS + "$" + b64.encodeToString(salt) + "$" + b64.encodeToString(key);
}

public static boolean verify(String password, String stored) {
    String[] p = stored == null ? new String[0] : stored.split("\\\\$");
    if (p.length != 4 || !p[0].equals("pbkdf2_sha256")) return false;
    Base64.Decoder b64 = Base64.getDecoder();
    byte[] expected = b64.decode(p[3]);
    byte[] actual = derive(password, b64.decode(p[2]), Integer.parseInt(p[1]));   // same salt + same iterations as when it was stored
    return MessageDigest.isEqual(expected, actual);                                // constant-time compare, not Arrays.equals
}</code></pre>
<ul>
<li>The stored text carries everything needed to verify later: <code>pbkdf2_sha256$600000$&lt;salt&gt;$&lt;hash&gt;</code>. Raise the iterations next year and old hashes still verify.</li>
<li><code>MessageDigest.isEqual</code> compares in constant time; <code>Arrays.equals</code> stops at the first different byte and leaks timing.</li>
<li><code>javax.crypto</code> keeps its <code>javax</code> name in Jakarta EE 10: it belongs to Java SE, not to the old Java EE that was renamed to <code>jakarta</code>.</li>
<li>The class has a <code>main</code>: <code>java -cp WEB-INF/classes util.PasswordHasher Admin@123</code> prints a hash to paste into <code>setup.sql</code> — that is how the sample accounts were made (about 0.15 s per hash on a laptop).</li>
</ul>`,
    `<h2>1. Mật khẩu: băm, có salt, và chậm — PBKDF2 có sẵn trong JDK</h2>
<p>Các app thực hành của Chương 8 giữ mật khẩu dạng chữ thường "cho bài tập". Assignment thì không được: ai đọc được bảng (một bản sao lưu, laptop của bạn cùng nhóm, một lỗi SQL injection) sẽ đọc được mọi mật khẩu — mà người ta hay dùng lại mật khẩu. Ba từ cần biết:</p>
<ul>
<li><strong>Băm (hash), không phải mã hoá (encryption).</strong> Mã hoá đảo ngược được bằng khoá; băm thì không. Lúc đăng nhập, bạn băm thứ vừa gõ rồi so hai mã băm.</li>
<li><strong>Salt</strong> (muối). Một giá trị ngẫu nhiên lưu cạnh mỗi mã băm, để hai người cùng mật khẩu có hai mã băm khác nhau và các bảng tính sẵn trở nên vô dụng. Nhìn bốn bác sĩ trong <code>setup.sql</code>: cùng mật khẩu <code>Bacsi@123</code>, bốn mã băm khác nhau.</li>
<li><strong>Chậm.</strong> Riêng SHA-256 trên GPU thử được hàng tỉ mật khẩu mỗi giây. Một <em>hàm băm mật khẩu</em> cố ý lặp lại công việc nhiều lần.</li>
</ul>
<p>Chọn hàm nào? OWASP Password Storage Cheat Sheet xếp <strong>Argon2id</strong> đầu tiên, rồi scrypt; <strong>bcrypt</strong> dành cho hệ thống cũ (nó còn bỏ qua phần mật khẩu vượt 72 byte); <strong>PBKDF2</strong> là lựa chọn khi cần tuân thủ FIPS-140, với <strong>600.000 vòng</strong> cho HMAC-SHA256. Với PRJ301, PBKDF2 có một lợi thế quyết định: nó <strong>có sẵn trong JDK</strong> (<code>javax.crypto.SecretKeyFactory</code>, thuật toán <code>"PBKDF2WithHmacSHA256"</code>) — không cần jar nào thêm. BCrypt cần thư viện (jBCrypt, hoặc <code>BCryptPasswordEncoder</code> của Spring Security ở LabFlow).</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/util/PasswordHasher.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
private static final int ITERATIONS = 600_000;      // OWASP Password Storage Cheat Sheet: 600.000 vòng cho PBKDF2-HMAC-SHA256
private static final int SALT_BYTES = 16;           // salt ngẫu nhiên MỚI cho mỗi mật khẩu ⇒ cùng mật khẩu, khác mã băm
private static final int KEY_BITS = 256;
private static final SecureRandom RANDOM = new SecureRandom();</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/util/PasswordHasher.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public static String hash(String password) {
    byte[] salt = new byte[SALT_BYTES];
    RANDOM.nextBytes(salt);
    byte[] key = derive(password, salt, ITERATIONS);
    Base64.Encoder b64 = Base64.getEncoder();
    return "pbkdf2_sha256$" + ITERATIONS + "$" + b64.encodeToString(salt) + "$" + b64.encodeToString(key);
}

public static boolean verify(String password, String stored) {
    String[] p = stored == null ? new String[0] : stored.split("\\\\$");
    if (p.length != 4 || !p[0].equals("pbkdf2_sha256")) return false;
    Base64.Decoder b64 = Base64.getDecoder();
    byte[] expected = b64.decode(p[3]);
    byte[] actual = derive(password, b64.decode(p[2]), Integer.parseInt(p[1]));   // cùng salt + cùng số vòng như lúc lưu
    return MessageDigest.isEqual(expected, actual);                                // so sánh thời gian hằng, không dùng Arrays.equals
}</code></pre>
<ul>
<li>Chuỗi lưu trong CSDL mang đủ thứ để kiểm sau này: <code>pbkdf2_sha256$600000$&lt;salt&gt;$&lt;hash&gt;</code>. Năm sau tăng số vòng thì mã băm cũ vẫn kiểm được.</li>
<li><code>MessageDigest.isEqual</code> so sánh trong thời gian hằng định; <code>Arrays.equals</code> dừng ở byte khác đầu tiên và để lộ thông tin qua thời gian.</li>
<li><code>javax.crypto</code> vẫn giữ tên <code>javax</code> ở Jakarta EE 10: nó thuộc Java SE, không thuộc Java EE cũ — phần đã đổi tên thành <code>jakarta</code>.</li>
<li>Lớp có hàm <code>main</code>: <code>java -cp WEB-INF/classes util.PasswordHasher Admin@123</code> in ra một mã băm để dán vào <code>setup.sql</code> — các tài khoản mẫu được tạo đúng cách đó (khoảng 0,15 giây mỗi mã trên laptop).</li>
</ul>`),
    bi(`<h2>2. Registration (UC02): validate, hash, two INSERTs in one transaction</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/AuthService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public Map&lt;String, String&gt; register(String username, String fullName, String phone, String dob,
                                    String password, String confirm) throws SQLException {
    Map&lt;String, String&gt; err = new LinkedHashMap&lt;&gt;();
    username = username == null ? "" : username.trim().toLowerCase();
    fullName = fullName == null ? "" : fullName.trim();
    phone = phone == null ? "" : phone.trim();
    if (!username.matches("[a-z0-9._]{4,30}")) err.put("username", "Tên đăng nhập 4–30 ký tự: chữ thường, số, dấu chấm, gạch dưới");
    else if (dao.usernameExists(username)) err.put("username", "Tên đăng nhập đã có người dùng");
    if (fullName.isEmpty() || fullName.length() &gt; 100) err.put("fullName", "Họ tên bắt buộc, tối đa 100 ký tự");
    if (!phone.matches("0\\\\d{9}")) err.put("phone", "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0");
    LocalDate birth = null;
    if (dob != null &amp;&amp; !dob.isBlank()) {
        try { birth = LocalDate.parse(dob.trim()); } catch (DateTimeParseException e) { err.put("dob", "Ngày sinh không hợp lệ"); }
    }
    if (password == null || password.length() &lt; 8 || !password.matches(".*[A-Za-z].*") || !password.matches(".*\\\\d.*"))
        err.put("password", "Mật khẩu tối thiểu 8 ký tự, có cả chữ và số");
    else if (!password.equals(confirm)) err.put("confirm", "Hai lần nhập mật khẩu không khớp");
    if (err.isEmpty()) dao.registerPatient(username, PasswordHasher.hash(password), fullName, phone, birth);
    return err;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AccountDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Two INSERTs that must succeed together ⇒ ONE transaction (Chapter 5)
public int registerPatient(String username, String hash, String fullName, String phone, LocalDate dob) throws SQLException {
    try (Connection c = DBContext.getConnection()) {
        c.setAutoCommit(false);
        try {
            int id;
            try (PreparedStatement ps = c.prepareStatement(
                    "INSERT INTO Account (username, passwordHash, fullName, phone, role) VALUES (?, ?, ?, ?, 'PATIENT')",
                    Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, username);
                ps.setString(2, hash);
                ps.setString(3, fullName);
                ps.setString(4, phone);
                ps.executeUpdate();
                try (ResultSet k = ps.getGeneratedKeys()) { k.next(); id = k.getInt(1); }
            }
            try (PreparedStatement ps = c.prepareStatement("INSERT INTO Patient (patientId, dateOfBirth) VALUES (?, ?)")) {
                ps.setInt(1, id);
                ps.setObject(2, dob);                 // null ⇒ NULL
                ps.executeUpdate();
            }
            c.commit();
            return id;
        } catch (SQLException e) {
            c.rollback();                             // no half-registered account
            throw e;
        }
    }
}</code></pre>
<p>A patient is an <code>Account</code> row <em>and</em> a <code>Patient</code> row; if the second INSERT failed after the first, a half-registered account would block the username forever. Hence <code>setAutoCommit(false)</code> … <code>commit()</code> / <code>rollback()</code> (lesson <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-transaction-pool">5.4</a>). The role is written by the server (<code>'PATIENT'</code> in the SQL), never read from the form.</p>
<p>Every mistake at once — the form comes back with the typed values (except the passwords) and one message per field:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 78

username=Bn+Minh&amp;fullName=&amp;phone=12345&amp;dob=2004-02-30&amp;password=abc&amp;confirm=abc</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đăng ký · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="row justify-content-center"&gt;&lt;div class="col-12 col-md-8 col-lg-6"&gt;
&lt;h1 class="h4 mb-3"&gt;Đăng ký tài khoản bệnh nhân&lt;/h1&gt;
&lt;form method="post" action="/phong-kham/register" class="row g-3" novalidate&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="u"&gt;Tên đăng nhập&lt;/label&gt;
&lt;input class="form-control is-invalid" id="u" name="username" value="Bn Minh"&gt;
&lt;div class="invalid-feedback"&gt;Tên đăng nhập 4–30 ký tự: chữ thường, số, dấu chấm, gạch dưới&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="n"&gt;Họ tên&lt;/label&gt;
&lt;input class="form-control is-invalid" id="n" name="fullName" value=""&gt;
&lt;div class="invalid-feedback"&gt;Họ tên bắt buộc, tối đa 100 ký tự&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="ph"&gt;Điện thoại&lt;/label&gt;
&lt;input class="form-control is-invalid" id="ph" name="phone" type="tel" value="12345"&gt;
&lt;div class="invalid-feedback"&gt;Số điện thoại gồm 10 chữ số, bắt đầu bằng 0&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="d"&gt;Ngày sinh&lt;/label&gt;
&lt;input class="form-control is-invalid" id="d" name="dob" type="date" value="2004-02-30"&gt;
&lt;div class="invalid-feedback"&gt;Ngày sinh không hợp lệ&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="p"&gt;Mật khẩu&lt;/label&gt;
&lt;input class="form-control is-invalid" id="p" name="password" type="password"&gt;
&lt;div class="invalid-feedback"&gt;Mật khẩu tối thiểu 8 ký tự, có cả chữ và số&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="c"&gt;Nhập lại mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="c" name="confirm" type="password"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đăng ký&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>A username that already exists:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 116

username=bn.hoa&amp;fullName=Nguy%E1%BB%85n+Th%E1%BB%8B+Hoa&amp;phone=0912345678&amp;dob=&amp;password=Matkhau123&amp;confirm=Matkhau123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đăng ký · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="row justify-content-center"&gt;&lt;div class="col-12 col-md-8 col-lg-6"&gt;
&lt;h1 class="h4 mb-3"&gt;Đăng ký tài khoản bệnh nhân&lt;/h1&gt;
&lt;form method="post" action="/phong-kham/register" class="row g-3" novalidate&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="u"&gt;Tên đăng nhập&lt;/label&gt;
&lt;input class="form-control is-invalid" id="u" name="username" value="bn.hoa"&gt;
&lt;div class="invalid-feedback"&gt;Tên đăng nhập đã có người dùng&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="n"&gt;Họ tên&lt;/label&gt;
&lt;input class="form-control" id="n" name="fullName" value="Nguyễn Thị Hoa"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="ph"&gt;Điện thoại&lt;/label&gt;
&lt;input class="form-control" id="ph" name="phone" type="tel" value="0912345678"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="d"&gt;Ngày sinh&lt;/label&gt;
&lt;input class="form-control" id="d" name="dob" type="date" value=""&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="p"&gt;Mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="p" name="password" type="password"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="c"&gt;Nhập lại mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="c" name="confirm" type="password"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đăng ký&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>A valid registration redirects to the login page (PRG):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 122

username=bn.minh&amp;fullName=Ph%E1%BA%A1m+Quang+Minh&amp;phone=0987654321&amp;dob=2004-05-20&amp;password=Minh2004%40&amp;confirm=Minh2004%40</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?registered=1</code></pre>`,
    `<h2>2. Đăng ký (UC02): kiểm tra, băm, hai lệnh INSERT trong một transaction</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/AuthService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public Map&lt;String, String&gt; register(String username, String fullName, String phone, String dob,
                                    String password, String confirm) throws SQLException {
    Map&lt;String, String&gt; err = new LinkedHashMap&lt;&gt;();
    username = username == null ? "" : username.trim().toLowerCase();
    fullName = fullName == null ? "" : fullName.trim();
    phone = phone == null ? "" : phone.trim();
    if (!username.matches("[a-z0-9._]{4,30}")) err.put("username", "Tên đăng nhập 4–30 ký tự: chữ thường, số, dấu chấm, gạch dưới");
    else if (dao.usernameExists(username)) err.put("username", "Tên đăng nhập đã có người dùng");
    if (fullName.isEmpty() || fullName.length() &gt; 100) err.put("fullName", "Họ tên bắt buộc, tối đa 100 ký tự");
    if (!phone.matches("0\\\\d{9}")) err.put("phone", "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0");
    LocalDate birth = null;
    if (dob != null &amp;&amp; !dob.isBlank()) {
        try { birth = LocalDate.parse(dob.trim()); } catch (DateTimeParseException e) { err.put("dob", "Ngày sinh không hợp lệ"); }
    }
    if (password == null || password.length() &lt; 8 || !password.matches(".*[A-Za-z].*") || !password.matches(".*\\\\d.*"))
        err.put("password", "Mật khẩu tối thiểu 8 ký tự, có cả chữ và số");
    else if (!password.equals(confirm)) err.put("confirm", "Hai lần nhập mật khẩu không khớp");
    if (err.isEmpty()) dao.registerPatient(username, PasswordHasher.hash(password), fullName, phone, birth);
    return err;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AccountDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Hai lệnh INSERT phải cùng thành công ⇒ MỘT giao dịch (Chương 5)
public int registerPatient(String username, String hash, String fullName, String phone, LocalDate dob) throws SQLException {
    try (Connection c = DBContext.getConnection()) {
        c.setAutoCommit(false);
        try {
            int id;
            try (PreparedStatement ps = c.prepareStatement(
                    "INSERT INTO Account (username, passwordHash, fullName, phone, role) VALUES (?, ?, ?, ?, 'PATIENT')",
                    Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, username);
                ps.setString(2, hash);
                ps.setString(3, fullName);
                ps.setString(4, phone);
                ps.executeUpdate();
                try (ResultSet k = ps.getGeneratedKeys()) { k.next(); id = k.getInt(1); }
            }
            try (PreparedStatement ps = c.prepareStatement("INSERT INTO Patient (patientId, dateOfBirth) VALUES (?, ?)")) {
                ps.setInt(1, id);
                ps.setObject(2, dob);                 // null ⇒ NULL
                ps.executeUpdate();
            }
            c.commit();
            return id;
        } catch (SQLException e) {
            c.rollback();                             // không để lại tài khoản đăng ký dở
            throw e;
        }
    }
}</code></pre>
<p>Một bệnh nhân là một dòng <code>Account</code> <em>và</em> một dòng <code>Patient</code>; nếu INSERT thứ hai hỏng sau khi cái thứ nhất xong, một tài khoản đăng ký dở sẽ chiếm tên đăng nhập mãi mãi. Vì thế có <code>setAutoCommit(false)</code> … <code>commit()</code> / <code>rollback()</code> (bài <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-transaction-pool">5.4</a>). Vai trò do server ghi (<code>'PATIENT'</code> nằm sẵn trong câu SQL), không bao giờ đọc từ form.</p>
<p>Sai mọi thứ cùng lúc — form quay lại với các giá trị đã gõ (trừ mật khẩu) và mỗi ô một thông báo:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 78

username=Bn+Minh&amp;fullName=&amp;phone=12345&amp;dob=2004-02-30&amp;password=abc&amp;confirm=abc</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đăng ký · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="row justify-content-center"&gt;&lt;div class="col-12 col-md-8 col-lg-6"&gt;
&lt;h1 class="h4 mb-3"&gt;Đăng ký tài khoản bệnh nhân&lt;/h1&gt;
&lt;form method="post" action="/phong-kham/register" class="row g-3" novalidate&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="u"&gt;Tên đăng nhập&lt;/label&gt;
&lt;input class="form-control is-invalid" id="u" name="username" value="Bn Minh"&gt;
&lt;div class="invalid-feedback"&gt;Tên đăng nhập 4–30 ký tự: chữ thường, số, dấu chấm, gạch dưới&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="n"&gt;Họ tên&lt;/label&gt;
&lt;input class="form-control is-invalid" id="n" name="fullName" value=""&gt;
&lt;div class="invalid-feedback"&gt;Họ tên bắt buộc, tối đa 100 ký tự&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="ph"&gt;Điện thoại&lt;/label&gt;
&lt;input class="form-control is-invalid" id="ph" name="phone" type="tel" value="12345"&gt;
&lt;div class="invalid-feedback"&gt;Số điện thoại gồm 10 chữ số, bắt đầu bằng 0&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="d"&gt;Ngày sinh&lt;/label&gt;
&lt;input class="form-control is-invalid" id="d" name="dob" type="date" value="2004-02-30"&gt;
&lt;div class="invalid-feedback"&gt;Ngày sinh không hợp lệ&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="p"&gt;Mật khẩu&lt;/label&gt;
&lt;input class="form-control is-invalid" id="p" name="password" type="password"&gt;
&lt;div class="invalid-feedback"&gt;Mật khẩu tối thiểu 8 ký tự, có cả chữ và số&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="c"&gt;Nhập lại mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="c" name="confirm" type="password"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đăng ký&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Tên đăng nhập đã có người dùng:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 116

username=bn.hoa&amp;fullName=Nguy%E1%BB%85n+Th%E1%BB%8B+Hoa&amp;phone=0912345678&amp;dob=&amp;password=Matkhau123&amp;confirm=Matkhau123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đăng ký · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="row justify-content-center"&gt;&lt;div class="col-12 col-md-8 col-lg-6"&gt;
&lt;h1 class="h4 mb-3"&gt;Đăng ký tài khoản bệnh nhân&lt;/h1&gt;
&lt;form method="post" action="/phong-kham/register" class="row g-3" novalidate&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="u"&gt;Tên đăng nhập&lt;/label&gt;
&lt;input class="form-control is-invalid" id="u" name="username" value="bn.hoa"&gt;
&lt;div class="invalid-feedback"&gt;Tên đăng nhập đã có người dùng&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="n"&gt;Họ tên&lt;/label&gt;
&lt;input class="form-control" id="n" name="fullName" value="Nguyễn Thị Hoa"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="ph"&gt;Điện thoại&lt;/label&gt;
&lt;input class="form-control" id="ph" name="phone" type="tel" value="0912345678"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="d"&gt;Ngày sinh&lt;/label&gt;
&lt;input class="form-control" id="d" name="dob" type="date" value=""&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="p"&gt;Mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="p" name="password" type="password"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12 col-sm-6"&gt;&lt;label class="form-label" for="c"&gt;Nhập lại mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="c" name="confirm" type="password"&gt;
&lt;div class="invalid-feedback"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Đăng ký&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Đăng ký hợp lệ thì redirect sang trang đăng nhập (PRG):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 122

username=bn.minh&amp;fullName=Ph%E1%BA%A1m+Quang+Minh&amp;phone=0987654321&amp;dob=2004-05-20&amp;password=Minh2004%40&amp;confirm=Minh2004%40</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?registered=1</code></pre>`),
    bi(`<h2>3. Login (UC03): one vague message, a new session, a safe way back</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/AuthService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The account, or null. Same answer and roughly the same time for "no such user" and "wrong password"
public Account login(String username, String password) throws SQLException {
    if (username == null || password == null) return null;
    AccountDAO.Stored s = dao.findForLogin(username.trim());
    if (s == null) {
        PasswordHasher.verify(password, DUMMY);                  // burn the same CPU: do not reveal which usernames exist
        return null;
    }
    if (!PasswordHasher.verify(password, s.passwordHash()) || !s.active()) return null;
    return s.account();                                          // Account has no hash field: the hash stays here
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/LoginController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Account acc;
    try {
        acc = auth.login(req.getParameter("username"), req.getParameter("password"));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (acc == null) {
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);                 // 401 + the form again, ONE message for both mistakes
        req.setAttribute("error", "Sai tên đăng nhập hoặc mật khẩu");
        req.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(req, resp);
        return;
    }
    HttpSession session = req.getSession();
    req.changeSessionId();                                                    // new id after login: blocks session fixation
    session.setAttribute("account", acc);
    session.setMaxInactiveInterval(30 * 60);
    String next = req.getParameter("next");
    boolean safe = next != null &amp;&amp; next.startsWith(req.getContextPath() + "/") &amp;&amp; !next.startsWith("//");
    resp.sendRedirect(safe ? next : req.getContextPath() + homeOf(acc.getRole()));   // never an outside URL (open redirect)
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/LoginController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public static String homeOf(String role) {
    switch (role) {
        case Account.ADMIN:        return "/admin/services";
        case Account.RECEPTIONIST: return "/reception/appointments";
        case Account.DOCTOR:       return "/doctor/schedule";
        default:                   return "/patient/appointments";
    }
}</code></pre>
<ul>
<li><strong>The same message</strong> ("Sai tên đăng nhập hoặc mật khẩu") whether the username exists or not — and the same <em>time</em>: for an unknown user the service still verifies against a dummy hash, so a stopwatch cannot list your usernames.</li>
<li><strong><code>changeSessionId()</code></strong> right after a successful login: the session id the visitor had as a guest (maybe planted by an attacker in a link) becomes worthless — <em>session fixation</em>.</li>
<li><strong><code>next</code></strong> brings the user back to the page that sent him to login, but only if it starts with this application's context path — otherwise the login page becomes a redirector to a phishing site (<em>open redirect</em>).</li>
<li>Only the <code>Account</code> object (id, username, name, role) goes into the session — never the hash.</li>
</ul>
<p>A guest opens a patient page: the filter (section 4) sends him to login and remembers where he wanted to go:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?next=%2Fphong-kham%2Fpatient%2Fappointments</code></pre>
<p>Wrong password ⇒ <strong>401</strong> and the form again:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 44

username=bn.minh&amp;password=sai-mat-khau&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đăng nhập · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="row justify-content-center"&gt;&lt;div class="col-12 col-sm-10 col-md-6 col-lg-4"&gt;
&lt;h1 class="h4 mb-3"&gt;Đăng nhập&lt;/h1&gt;
&lt;div class="alert alert-danger"&gt;Sai tên đăng nhập hoặc mật khẩu&lt;/div&gt;
&lt;form method="post" action="/phong-kham/login"&gt;
&lt;input type="hidden" name="next" value=""&gt;
&lt;div class="mb-3"&gt;&lt;label class="form-label" for="u"&gt;Tên đăng nhập&lt;/label&gt;
&lt;input class="form-control" id="u" name="username" value="bn.minh" required autofocus&gt;&lt;/div&gt;
&lt;div class="mb-3"&gt;&lt;label class="form-label" for="p"&gt;Mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="p" type="password" name="password" required&gt;&lt;/div&gt;
&lt;button class="btn btn-primary w-100"&gt;Đăng nhập&lt;/button&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Right password ⇒ <strong>302</strong> back to <code>next</code>, and a <strong>new</strong> <code>JSESSIONID</code> (the masked value <code>…</code> was the guest's id, created by the JSP pages; the patient now has <code>…(2)</code>, a different one):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 81

username=bn.minh&amp;password=Minh2004%40&amp;next=%2Fphong-kham%2Fpatient%2Fappointments</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/phong-kham; HttpOnly
Location: /phong-kham/patient/appointments</code></pre>`,
    `<h2>3. Đăng nhập (UC03): một thông báo mơ hồ, một session mới, một đường quay lại an toàn</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/AuthService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Trả tài khoản, hoặc null. "Không có user" và "sai mật khẩu" cho cùng câu trả lời và gần cùng thời gian
public Account login(String username, String password) throws SQLException {
    if (username == null || password == null) return null;
    AccountDAO.Stored s = dao.findForLogin(username.trim());
    if (s == null) {
        PasswordHasher.verify(password, DUMMY);                  // đốt CPU y như thật: không để lộ username nào tồn tại
        return null;
    }
    if (!PasswordHasher.verify(password, s.passwordHash()) || !s.active()) return null;
    return s.account();                                          // Account không có trường mã băm: mã băm ở lại đây
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/LoginController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Account acc;
    try {
        acc = auth.login(req.getParameter("username"), req.getParameter("password"));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (acc == null) {
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);                 // 401 + form lần nữa, MỘT thông báo cho cả hai kiểu sai
        req.setAttribute("error", "Sai tên đăng nhập hoặc mật khẩu");
        req.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(req, resp);
        return;
    }
    HttpSession session = req.getSession();
    req.changeSessionId();                                                    // id mới sau đăng nhập: chặn session fixation
    session.setAttribute("account", acc);
    session.setMaxInactiveInterval(30 * 60);
    String next = req.getParameter("next");
    boolean safe = next != null &amp;&amp; next.startsWith(req.getContextPath() + "/") &amp;&amp; !next.startsWith("//");
    resp.sendRedirect(safe ? next : req.getContextPath() + homeOf(acc.getRole()));   // không bao giờ là URL bên ngoài (open redirect)
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/LoginController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public static String homeOf(String role) {
    switch (role) {
        case Account.ADMIN:        return "/admin/services";
        case Account.RECEPTIONIST: return "/reception/appointments";
        case Account.DOCTOR:       return "/doctor/schedule";
        default:                   return "/patient/appointments";
    }
}</code></pre>
<ul>
<li><strong>Cùng một thông báo</strong> ("Sai tên đăng nhập hoặc mật khẩu") dù tên đăng nhập có tồn tại hay không — và cùng <em>thời gian</em>: với user không tồn tại, service vẫn kiểm với một mã băm giả, nên bấm giờ không liệt kê được các tên đăng nhập của bạn.</li>
<li><strong><code>changeSessionId()</code></strong> ngay sau khi đăng nhập đúng: session id khách có lúc chưa đăng nhập (có thể do kẻ tấn công cài vào một đường link) trở nên vô giá trị — chặn <em>session fixation</em> (cố định phiên).</li>
<li><strong><code>next</code></strong> đưa người dùng về trang đã đẩy họ sang đăng nhập, nhưng chỉ khi nó bắt đầu bằng context path của chính app — nếu không, trang đăng nhập thành cái máy chuyển hướng tới trang lừa đảo (<em>open redirect</em>).</li>
<li>Chỉ đối tượng <code>Account</code> (id, username, tên, vai trò) vào session — không bao giờ có mã băm.</li>
</ul>
<p>Khách mở một trang của bệnh nhân: filter (mục 4) đưa họ sang đăng nhập và nhớ chỗ họ muốn tới:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?next=%2Fphong-kham%2Fpatient%2Fappointments</code></pre>
<p>Sai mật khẩu ⇒ <strong>401</strong> và lại form:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 44

username=bn.minh&amp;password=sai-mat-khau&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Đăng nhập · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="row justify-content-center"&gt;&lt;div class="col-12 col-sm-10 col-md-6 col-lg-4"&gt;
&lt;h1 class="h4 mb-3"&gt;Đăng nhập&lt;/h1&gt;
&lt;div class="alert alert-danger"&gt;Sai tên đăng nhập hoặc mật khẩu&lt;/div&gt;
&lt;form method="post" action="/phong-kham/login"&gt;
&lt;input type="hidden" name="next" value=""&gt;
&lt;div class="mb-3"&gt;&lt;label class="form-label" for="u"&gt;Tên đăng nhập&lt;/label&gt;
&lt;input class="form-control" id="u" name="username" value="bn.minh" required autofocus&gt;&lt;/div&gt;
&lt;div class="mb-3"&gt;&lt;label class="form-label" for="p"&gt;Mật khẩu&lt;/label&gt;
&lt;input class="form-control" id="p" type="password" name="password" required&gt;&lt;/div&gt;
&lt;button class="btn btn-primary w-100"&gt;Đăng nhập&lt;/button&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Đúng mật khẩu ⇒ <strong>302</strong> về <code>next</code>, và một <code>JSESSIONID</code> <strong>mới</strong> (giá trị đã che <code>…</code> là id lúc còn là khách, do các trang JSP tạo; giờ bệnh nhân có <code>…(2)</code>, một id khác):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 81

username=bn.minh&amp;password=Minh2004%40&amp;next=%2Fphong-kham%2Fpatient%2Fappointments</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/phong-kham; HttpOnly
Location: /phong-kham/patient/appointments</code></pre>`),
    bi(`<h2>4. Filter 1 — the role: who may open which area</h2>
<p>Both filters are declared in <code>web.xml</code>, not with <code>@WebFilter</code>. The Servlet specification leaves the order of annotated filters <strong>undefined</strong>; in <code>web.xml</code> the order of <code>&lt;filter-mapping&gt;</code> elements <em>is</em> the order of the chain. Here it matters: the ownership filter assumes somebody is logged in, which only the first filter guarantees.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Filters are declared HERE, not with @WebFilter: the order of &lt;filter-mapping&gt; IS the order of the chain --&gt;
&lt;filter&gt;
    &lt;filter-name&gt;authorization&lt;/filter-name&gt;
    &lt;filter-class&gt;filter.AuthorizationFilter&lt;/filter-class&gt;
&lt;/filter&gt;
&lt;filter&gt;
    &lt;filter-name&gt;ownership&lt;/filter-name&gt;
    &lt;filter-class&gt;filter.OwnershipFilter&lt;/filter-class&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;authorization&lt;/filter-name&gt;
    &lt;url-pattern&gt;/*&lt;/url-pattern&gt;
&lt;/filter-mapping&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;ownership&lt;/filter-name&gt;
    &lt;url-pattern&gt;/patient/appointments/*&lt;/url-pattern&gt;
    &lt;url-pattern&gt;/doctor/appointments/*&lt;/url-pattern&gt;
&lt;/filter-mapping&gt;</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;session-config&gt;
    &lt;session-timeout&gt;30&lt;/session-timeout&gt;
    &lt;cookie-config&gt;
        &lt;http-only&gt;true&lt;/http-only&gt;          &lt;!-- JavaScript cannot read JSESSIONID --&gt;
    &lt;/cookie-config&gt;
    &lt;tracking-mode&gt;COOKIE&lt;/tracking-mode&gt;    &lt;!-- never ;jsessionid= in URLs --&gt;
&lt;/session-config&gt;</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/filter/AuthorizationFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String path = req.getServletPath();                                   // "" for /phong-kham/, "/admin/services", "/css/app.css"…

    if (isPublic(path)) { chain.doFilter(request, response); return; }   // 1. public
    HttpSession session = req.getSession(false);                          // do not create a session just to check
    Account acc = session == null ? null : (Account) session.getAttribute("account");
    if (acc == null) {                                                    // 2. not logged in ⇒ 302 to login, remember where to come back
        String next = req.getRequestURI() + (req.getQueryString() == null ? "" : "?" + req.getQueryString());
        resp.sendRedirect(req.getContextPath() + "/login?next=" + URLEncoder.encode(next, StandardCharsets.UTF_8));
        return;
    }
    if (!allowed(path, acc.getRole())) {                                  // 3. wrong role ⇒ 403
        System.out.println("AuthorizationFilter: " + acc.getUsername() + " (" + acc.getRole() + ") denied " + path);
        Forbidden.send(req, resp, "Vai trò " + acc.getRole() + " không được mở trang này.");
        return;
    }
    chain.doFilter(request, response);                                    // 4. allowed ⇒ next filter / servlet
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/filter/AuthorizationFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private static boolean isPublic(String path) {
    return path.isEmpty() || path.equals("/home") || path.equals("/login") || path.equals("/register")
            || path.equals("/logout") || path.startsWith("/css/")
            || path.startsWith("/vnpay/")        // A.5: VNPay calls these WITHOUT a session — trusted by signature
            || path.startsWith("/vnpay-gia/");   // A.5: the FAKE gateway (on a real system it is another server)
}

// The role table of the business — the same table as the actor list of lesson A.1
private static boolean allowed(String path, String role) {
    if (path.startsWith("/admin/"))     return role.equals(Account.ADMIN);
    if (path.startsWith("/reception/")) return role.equals(Account.RECEPTIONIST) || role.equals(Account.ADMIN);
    if (path.startsWith("/doctor/"))    return role.equals(Account.DOCTOR);
    if (path.startsWith("/patient/"))   return role.equals(Account.PATIENT);
    return true;                                                          // any other page: any logged-in user
}</code></pre>
<p>The rule table is the actor table of ASM.1 turned into code — and thanks to the URL convention of ASM.2 (<code>/area/…</code>), four lines cover every page, including pages that do not exist yet. Not logged in ⇒ 302 to login (above). Logged in with the wrong role ⇒ <strong>403</strong> by <code>forward</code>, so the address bar keeps the URL, and a line in the server log:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Vai trò PATIENT không được mở trang này.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AuthorizationFilter: bn.minh (PATIENT) denied /admin/services</div>
<p>A doctor is not a patient, a receptionist is not an admin:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Vai trò DOCTOR không được mở trang này.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AuthorizationFilter: bs.an (DOCTOR) denied /patient/appointments</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Vai trò RECEPTIONIST không được mở trang này.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AuthorizationFilter: letan (RECEPTIONIST) denied /admin/services</div>
<p>…but the admin may open the reception area (top of the page):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?page=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã xoá dịch vụ #13&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
… (43 more lines / còn 43 dòng)</code></pre>
<div class="pitfall">Hiding the "Dịch vụ" link from the menu (ASM.3's navbar does) is <em>not</em> authorization — every 403 above was obtained by typing the URL. The filter is the protection; the menu is only comfort.</div>`,
    `<h2>4. Filter 1 — vai trò: ai được mở khu nào</h2>
<p>Cả hai filter khai trong <code>web.xml</code>, không dùng <code>@WebFilter</code>. Đặc tả Servlet để thứ tự các filter khai bằng annotation là <strong>không xác định</strong>; trong <code>web.xml</code>, thứ tự các phần tử <code>&lt;filter-mapping&gt;</code> <em>chính là</em> thứ tự của chuỗi. Ở đây điều đó quan trọng: filter chủ sở hữu giả định đã có người đăng nhập, điều mà chỉ filter thứ nhất bảo đảm.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Khai filter Ở ĐÂY, không dùng @WebFilter: thứ tự các &lt;filter-mapping&gt; CHÍNH LÀ thứ tự của chuỗi --&gt;
&lt;filter&gt;
    &lt;filter-name&gt;authorization&lt;/filter-name&gt;
    &lt;filter-class&gt;filter.AuthorizationFilter&lt;/filter-class&gt;
&lt;/filter&gt;
&lt;filter&gt;
    &lt;filter-name&gt;ownership&lt;/filter-name&gt;
    &lt;filter-class&gt;filter.OwnershipFilter&lt;/filter-class&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;authorization&lt;/filter-name&gt;
    &lt;url-pattern&gt;/*&lt;/url-pattern&gt;
&lt;/filter-mapping&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;ownership&lt;/filter-name&gt;
    &lt;url-pattern&gt;/patient/appointments/*&lt;/url-pattern&gt;
    &lt;url-pattern&gt;/doctor/appointments/*&lt;/url-pattern&gt;
&lt;/filter-mapping&gt;</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;session-config&gt;
    &lt;session-timeout&gt;30&lt;/session-timeout&gt;
    &lt;cookie-config&gt;
        &lt;http-only&gt;true&lt;/http-only&gt;          &lt;!-- JavaScript không đọc được JSESSIONID --&gt;
    &lt;/cookie-config&gt;
    &lt;tracking-mode&gt;COOKIE&lt;/tracking-mode&gt;    &lt;!-- không bao giờ có ;jsessionid= trong URL --&gt;
&lt;/session-config&gt;</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/filter/AuthorizationFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String path = req.getServletPath();                                   // "" cho /phong-kham/, "/admin/services", "/css/app.css"…

    if (isPublic(path)) { chain.doFilter(request, response); return; }   // 1. công khai
    HttpSession session = req.getSession(false);                          // không tạo session chỉ để kiểm tra
    Account acc = session == null ? null : (Account) session.getAttribute("account");
    if (acc == null) {                                                    // 2. chưa đăng nhập ⇒ 302 tới login, nhớ chỗ quay lại
        String next = req.getRequestURI() + (req.getQueryString() == null ? "" : "?" + req.getQueryString());
        resp.sendRedirect(req.getContextPath() + "/login?next=" + URLEncoder.encode(next, StandardCharsets.UTF_8));
        return;
    }
    if (!allowed(path, acc.getRole())) {                                  // 3. sai vai trò ⇒ 403
        System.out.println("AuthorizationFilter: " + acc.getUsername() + " (" + acc.getRole() + ") denied " + path);
        Forbidden.send(req, resp, "Vai trò " + acc.getRole() + " không được mở trang này.");
        return;
    }
    chain.doFilter(request, response);                                    // 4. được phép ⇒ filter kế / servlet
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/filter/AuthorizationFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private static boolean isPublic(String path) {
    return path.isEmpty() || path.equals("/home") || path.equals("/login") || path.equals("/register")
            || path.equals("/logout") || path.startsWith("/css/")
            || path.startsWith("/vnpay/")        // A.5: VNPay gọi tới mà KHÔNG có session — tin bằng chữ ký
            || path.startsWith("/vnpay-gia/");   // A.5: cổng GIẢ (thật ra là một server khác)
}

// Bảng vai trò của nghiệp vụ — chính bảng tác nhân ở bài A.1
private static boolean allowed(String path, String role) {
    if (path.startsWith("/admin/"))     return role.equals(Account.ADMIN);
    if (path.startsWith("/reception/")) return role.equals(Account.RECEPTIONIST) || role.equals(Account.ADMIN);
    if (path.startsWith("/doctor/"))    return role.equals(Account.DOCTOR);
    if (path.startsWith("/patient/"))   return role.equals(Account.PATIENT);
    return true;                                                          // trang khác: ai đã đăng nhập cũng được
}</code></pre>
<p>Bảng luật chính là bảng tác nhân của ASM.1 viết thành code — và nhờ quy ước URL của ASM.2 (<code>/khu/…</code>), bốn dòng phủ mọi trang, kể cả những trang chưa viết. Chưa đăng nhập ⇒ 302 tới login (ở trên). Đã đăng nhập nhưng sai vai trò ⇒ <strong>403</strong> bằng <code>forward</code>, nên thanh địa chỉ giữ nguyên URL, và một dòng trong log của server:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Vai trò PATIENT không được mở trang này.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AuthorizationFilter: bn.minh (PATIENT) denied /admin/services</div>
<p>Bác sĩ không phải bệnh nhân, lễ tân không phải admin:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Vai trò DOCTOR không được mở trang này.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AuthorizationFilter: bs.an (DOCTOR) denied /patient/appointments</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/services HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Lễ tân Đỗ Ngọc (RECEPTIONIST)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Vai trò RECEPTIONIST không được mở trang này.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AuthorizationFilter: letan (RECEPTIONIST) denied /admin/services</div>
<p>…nhưng admin được mở khu tiếp đón (phần đầu trang):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/reception/appointments?page=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(5)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Tiếp đón · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã xoá dịch vụ #13&lt;/div&gt;
&lt;h1 class="h3 mb-3"&gt;Tất cả lịch khám&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/reception/appointments"&gt;
… (43 more lines / còn 43 dòng)</code></pre>
<div class="pitfall">Giấu link "Dịch vụ" khỏi menu (navbar ở ASM.3 có làm) <em>không phải</em> là phân quyền — mọi lần 403 ở trên đều có được bằng cách gõ thẳng URL. Filter mới là thứ bảo vệ; menu chỉ để dễ chịu.</div>`),
    bi(`<h2>5. Filter 2 — the business rule: is this appointment YOURS? (blocking IDOR)</h2>
<p>The role filter lets every patient into <code>/patient/appointments/view</code>. Which appointment he sees is chosen by <code>?id=</code> — a number anyone can edit. Without a second check, patient 10 reads patient 7's diagnosis by changing one digit. The ownership filter answers "whose is it?" from the database:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/filter/OwnershipFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String idParam = req.getParameter("id");
    if (idParam == null) { chain.doFilter(request, response); return; }   // lists and "create" use the session id, nothing to check
    int[] owners;
    try {
        owners = appointments.findOwners(Integer.parseInt(idParam.trim()));
    } catch (NumberFormatException e) {
        owners = null;
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (owners == null) { resp.sendError(HttpServletResponse.SC_NOT_FOUND); return; }
    Account me = (Account) req.getSession().getAttribute("account");      // AuthorizationFilter ran first ⇒ never null
    boolean asPatient = req.getServletPath().startsWith("/patient/");
    int owner = asPatient ? owners[0] : owners[1];                        // {patientId, doctorId}
    if (owner != me.getId()) {
        System.out.println("OwnershipFilter: " + me.getUsername() + " tried appointment #" + idParam + " owned by account " + owner);
        Forbidden.send(req, resp, "Lịch khám #" + idParam + " không phải của bạn.");
        return;
    }
    chain.doFilter(request, response);
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Who owns appointment #id? {patientId, doctorId}, or null if there is no such appointment
public int[] findOwners(int id) throws SQLException {
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement("SELECT patientId, doctorId FROM Appointment WHERE appointmentId = ?")) {
        ps.setInt(1, id);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? new int[] { rs.getInt(1), rs.getInt(2) } : null;
        }
    }
}</code></pre>
<p>The patient's own appointment opens:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments/view?id=13 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch #13 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="card"&gt;&lt;div class="card-body"&gt;
&lt;h1 class="h5 card-title"&gt;Lịch khám #13&lt;span class="ms-2"&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/span&gt;&lt;/h1&gt;
&lt;dl class="row mb-0"&gt;
&lt;dt class="col-sm-3"&gt;Thời gian&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;09:00 ngày 06/11/2026&lt;/dd&gt;
&lt;dt class="col-sm-3"&gt;Bác sĩ&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;BS. Nguyễn Văn An (Nội tổng quát)&lt;/dd&gt;
&lt;dt class="col-sm-3"&gt;Dịch vụ&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;Khám nội tổng quát — 200.000 đ&lt;/dd&gt;
&lt;dt class="col-sm-3"&gt;Lý do&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;Đau đầu, chóng mặt&lt;/dd&gt;
&lt;/dl&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;a class="btn btn-link px-0 mt-2" href="/phong-kham/patient/appointments"&gt;← Lịch của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Same patient, <code>id=13</code> changed to <code>id=5</code> (bn.hoa's appointment) ⇒ 403, and the attempt is logged with both ids:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments/view?id=5 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Lịch khám #5 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">OwnershipFilter: bn.minh tried appointment #5 owned by account 7</div>
<p>IDOR works with POST too — a hand-made form that cancels someone else's appointment:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/cancel HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 4

id=5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Lịch khám #5 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">OwnershipFilter: bn.minh tried appointment #5 owned by account 7</div>
<h3>The doctor side: only HIS visits</h3>
<p>BS. An logs in (a fresh browser) and lands on his own page, sees only his appointments of the day (05/11, the pinned "today" of ASM.2):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 41

username=bs.an&amp;password=Bacsi%40123&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/doctor/schedule</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/doctor/schedule HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám ngày 2026-11-05&lt;/h1&gt;
&lt;form class="d-flex gap-2" method="get" action="/phong-kham/doctor/schedule"&gt;
&lt;input class="form-control" type="date" name="date" value="2026-11-05"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Lý do&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;08:30&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;Tái khám họng&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;a class="btn btn-sm btn-primary" href="/phong-kham/doctor/appointments/result?id=5"&gt;Ghi kết quả&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;Xét nghiệm máu tổng quát&lt;/td&gt;
&lt;td&gt;Kiểm tra sức khoẻ&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;a class="btn btn-sm btn-primary" href="/phong-kham/doctor/appointments/result?id=12"&gt;Ghi kết quả&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>He opens the result form of #5 (his) and submits an empty diagnosis — refused by the controller, form again:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/doctor/appointments/result HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(3)
Content-Length: 32

id=5&amp;diagnosis=+++&amp;prescription=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4"&gt;Kết quả khám — lịch #5&lt;/h1&gt;
&lt;p class="text-muted"&gt;Nguyễn Thị Hoa · 08:30 ngày 05/11/2026 · Khám nội tổng quát · lý do: Tái khám họng&lt;/p&gt;
&lt;div class="alert alert-danger"&gt;Chẩn đoán bắt buộc (tối đa 500 ký tự); đơn thuốc tối đa 1000 ký tự&lt;/div&gt;
&lt;form method="post" action="/phong-kham/doctor/appointments/result" class="row g-3"&gt;
&lt;input type="hidden" name="id" value="5"&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="dg"&gt;Chẩn đoán&lt;/label&gt;
&lt;textarea class="form-control" id="dg" name="diagnosis" rows="2" maxlength="500" required&gt;   &lt;/textarea&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="pr"&gt;Đơn thuốc / dặn dò&lt;/label&gt;
&lt;textarea class="form-control" id="pr" name="prescription" rows="3" maxlength="1000"&gt;&lt;/textarea&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Lưu kết quả&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>A real diagnosis ⇒ saved, #5 becomes DONE:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/doctor/appointments/result HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(3)
Content-Length: 179

id=5&amp;diagnosis=Vi%C3%AAm+h%E1%BB%8Dng+%C4%91%C3%A3+%C4%91%E1%BB%A1&amp;prescription=S%C3%BAc+mi%E1%BB%87ng+n%C6%B0%E1%BB%9Bc+mu%E1%BB%91i%2C+t%C3%A1i+kh%C3%A1m+n%E1%BA%BFu+s%E1%BB%91t</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/doctor/schedule</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/doctor/schedule HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám ngày 2026-11-05&lt;/h1&gt;
&lt;form class="d-flex gap-2" method="get" action="/phong-kham/doctor/schedule"&gt;
&lt;input class="form-control" type="date" name="date" value="2026-11-05"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Lý do&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;08:30&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;Tái khám họng&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;Xét nghiệm máu tổng quát&lt;/td&gt;
&lt;td&gt;Kiểm tra sức khoẻ&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;a class="btn btn-sm btn-primary" href="/phong-kham/doctor/appointments/result?id=12"&gt;Ghi kết quả&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Then he tries #6, an appointment of BS. Bình — blocked before the servlet runs:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/doctor/appointments/result HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(3)
Content-Length: 53

id=6&amp;diagnosis=S%E1%BB%ADa+tr%E1%BB%99m&amp;prescription=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã lưu kết quả lịch #5&lt;/div&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Lịch khám #6 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">OwnershipFilter: bs.an tried appointment #6 owned by account 4</div>
<p>(The green "Đã lưu kết quả lịch #5" on that 403 page is the flash message of the previous redirect — the layout shows it on whatever page comes next.)</p>`,
    `<h2>5. Filter 2 — luật nghiệp vụ: lịch khám này có phải CỦA BẠN? (chặn IDOR)</h2>
<p>Filter vai trò cho mọi bệnh nhân vào <code>/patient/appointments/view</code>. Còn xem lịch nào thì do <code>?id=</code> quyết định — một con số ai cũng sửa được. Thiếu phép kiểm thứ hai, bệnh nhân 10 đọc được chẩn đoán của bệnh nhân 7 chỉ bằng cách đổi một chữ số. Filter chủ sở hữu trả lời "của ai?" bằng CSDL:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/filter/OwnershipFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String idParam = req.getParameter("id");
    if (idParam == null) { chain.doFilter(request, response); return; }   // danh sách và "tạo mới" dùng id trong session, không có gì để kiểm
    int[] owners;
    try {
        owners = appointments.findOwners(Integer.parseInt(idParam.trim()));
    } catch (NumberFormatException e) {
        owners = null;
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (owners == null) { resp.sendError(HttpServletResponse.SC_NOT_FOUND); return; }
    Account me = (Account) req.getSession().getAttribute("account");      // AuthorizationFilter chạy trước ⇒ không bao giờ null
    boolean asPatient = req.getServletPath().startsWith("/patient/");
    int owner = asPatient ? owners[0] : owners[1];                        // {patientId, doctorId}
    if (owner != me.getId()) {
        System.out.println("OwnershipFilter: " + me.getUsername() + " tried appointment #" + idParam + " owned by account " + owner);
        Forbidden.send(req, resp, "Lịch khám #" + idParam + " không phải của bạn.");
        return;
    }
    chain.doFilter(request, response);
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Lịch #id thuộc về ai? {patientId, doctorId}, hoặc null nếu không có lịch đó
public int[] findOwners(int id) throws SQLException {
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement("SELECT patientId, doctorId FROM Appointment WHERE appointmentId = ?")) {
        ps.setInt(1, id);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? new int[] { rs.getInt(1), rs.getInt(2) } : null;
        }
    }
}</code></pre>
<p>Lịch của chính bệnh nhân thì mở được:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments/view?id=13 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch #13 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="card"&gt;&lt;div class="card-body"&gt;
&lt;h1 class="h5 card-title"&gt;Lịch khám #13&lt;span class="ms-2"&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/span&gt;&lt;/h1&gt;
&lt;dl class="row mb-0"&gt;
&lt;dt class="col-sm-3"&gt;Thời gian&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;09:00 ngày 06/11/2026&lt;/dd&gt;
&lt;dt class="col-sm-3"&gt;Bác sĩ&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;BS. Nguyễn Văn An (Nội tổng quát)&lt;/dd&gt;
&lt;dt class="col-sm-3"&gt;Dịch vụ&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;Khám nội tổng quát — 200.000 đ&lt;/dd&gt;
&lt;dt class="col-sm-3"&gt;Lý do&lt;/dt&gt;&lt;dd class="col-sm-9"&gt;Đau đầu, chóng mặt&lt;/dd&gt;
&lt;/dl&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;a class="btn btn-link px-0 mt-2" href="/phong-kham/patient/appointments"&gt;← Lịch của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Vẫn bệnh nhân đó, đổi <code>id=13</code> thành <code>id=5</code> (lịch của bn.hoa) ⇒ 403, và lần thử được ghi log kèm cả hai id:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/appointments/view?id=5 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Lịch khám #5 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">OwnershipFilter: bn.minh tried appointment #5 owned by account 7</div>
<p>IDOR cũng xảy ra với POST — một form tự chế để huỷ lịch của người khác:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/appointments/cancel HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 4

id=5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Phạm Quang Minh (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Lịch khám #5 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">OwnershipFilter: bn.minh tried appointment #5 owned by account 7</div>
<h3>Phía bác sĩ: chỉ lượt khám CỦA MÌNH</h3>
<p>BS. An đăng nhập (một trình duyệt mới) và vào thẳng trang của mình, chỉ thấy lịch của mình trong ngày (05/11, "hôm nay" đã ghim ở ASM.2):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 41

username=bs.an&amp;password=Bacsi%40123&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/doctor/schedule</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/doctor/schedule HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám ngày 2026-11-05&lt;/h1&gt;
&lt;form class="d-flex gap-2" method="get" action="/phong-kham/doctor/schedule"&gt;
&lt;input class="form-control" type="date" name="date" value="2026-11-05"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Lý do&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;08:30&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;Tái khám họng&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;a class="btn btn-sm btn-primary" href="/phong-kham/doctor/appointments/result?id=5"&gt;Ghi kết quả&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;Xét nghiệm máu tổng quát&lt;/td&gt;
&lt;td&gt;Kiểm tra sức khoẻ&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;a class="btn btn-sm btn-primary" href="/phong-kham/doctor/appointments/result?id=12"&gt;Ghi kết quả&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Bác sĩ mở form kết quả của lịch #5 (của mình) và gửi chẩn đoán trống — controller từ chối, hiện lại form:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/doctor/appointments/result HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(3)
Content-Length: 32

id=5&amp;diagnosis=+++&amp;prescription=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h4"&gt;Kết quả khám — lịch #5&lt;/h1&gt;
&lt;p class="text-muted"&gt;Nguyễn Thị Hoa · 08:30 ngày 05/11/2026 · Khám nội tổng quát · lý do: Tái khám họng&lt;/p&gt;
&lt;div class="alert alert-danger"&gt;Chẩn đoán bắt buộc (tối đa 500 ký tự); đơn thuốc tối đa 1000 ký tự&lt;/div&gt;
&lt;form method="post" action="/phong-kham/doctor/appointments/result" class="row g-3"&gt;
&lt;input type="hidden" name="id" value="5"&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="dg"&gt;Chẩn đoán&lt;/label&gt;
&lt;textarea class="form-control" id="dg" name="diagnosis" rows="2" maxlength="500" required&gt;   &lt;/textarea&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;label class="form-label" for="pr"&gt;Đơn thuốc / dặn dò&lt;/label&gt;
&lt;textarea class="form-control" id="pr" name="prescription" rows="3" maxlength="1000"&gt;&lt;/textarea&gt;&lt;/div&gt;
&lt;div class="col-12"&gt;&lt;button class="btn btn-primary"&gt;Lưu kết quả&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Chẩn đoán thật ⇒ lưu, lịch #5 thành DONE:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/doctor/appointments/result HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(3)
Content-Length: 179

id=5&amp;diagnosis=Vi%C3%AAm+h%E1%BB%8Dng+%C4%91%C3%A3+%C4%91%E1%BB%A1&amp;prescription=S%C3%BAc+mi%E1%BB%87ng+n%C6%B0%E1%BB%9Bc+mu%E1%BB%91i%2C+t%C3%A1i+kh%C3%A1m+n%E1%BA%BFu+s%E1%BB%91t</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/doctor/schedule</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/doctor/schedule HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Lịch khám · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"&gt;
&lt;h1 class="h3 mb-0"&gt;Lịch khám ngày 2026-11-05&lt;/h1&gt;
&lt;form class="d-flex gap-2" method="get" action="/phong-kham/doctor/schedule"&gt;
&lt;input class="form-control" type="date" name="date" value="2026-11-05"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Giờ&lt;/th&gt;&lt;th&gt;#&lt;/th&gt;&lt;th&gt;Bệnh nhân&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Lý do&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;08:30&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Nguyễn Thị Hoa&lt;/td&gt;&lt;td&gt;Khám nội tổng quát&lt;/td&gt;
&lt;td&gt;Tái khám họng&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;10:00&lt;/td&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Trần Ngọc Lan&lt;/td&gt;&lt;td&gt;Xét nghiệm máu tổng quát&lt;/td&gt;
&lt;td&gt;Kiểm tra sức khoẻ&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-primary"&gt;Chờ khám&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;a class="btn btn-sm btn-primary" href="/phong-kham/doctor/appointments/result?id=12"&gt;Ghi kết quả&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Rồi thử lịch #6, của BS. Bình — bị chặn trước khi servlet kịp chạy:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/doctor/appointments/result HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(3)
Content-Length: 53

id=6&amp;diagnosis=S%E1%BB%ADa+tr%E1%BB%99m&amp;prescription=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/doctor/schedule"&gt;Lịch khám&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;BS. Nguyễn Văn An (DOCTOR)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-success" role="alert"&gt;Đã lưu kết quả lịch #5&lt;/div&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Lịch khám #6 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">OwnershipFilter: bs.an tried appointment #6 owned by account 4</div>
<p>(Dòng xanh "Đã lưu kết quả lịch #5" trên trang 403 đó là thông báo flash của lần redirect trước — layout hiện nó ở bất kỳ trang nào tới tiếp theo.)</p>`),
    bi(`<h2>6. Defence in depth: the third lock is in the SQL</h2>
<p>Filters are configuration; configuration gets forgotten — a new URL outside the mapped patterns, a teammate's servlet. So the queries themselves only touch rows of the logged-in user, whose id comes from the <strong>session</strong>, never from a parameter:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The patient id comes from the SESSION, never from a parameter ⇒ a patient cannot list someone else's visits
public List&lt;Appointment&gt; findByPatient(int patientId) throws SQLException {
    return query(SELECT + "WHERE a.patientId = ? ORDER BY a.apptDate DESC, a.apptTime DESC, a.appointmentId DESC", patientId);
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// "AND doctorId = ?" is the second lock behind the filter: even a forgotten filter cannot let doctor A edit doctor B's visit
public boolean saveResult(int id, int doctorId, String diagnosis, String prescription) throws SQLException {
    String sql = "UPDATE Appointment SET diagnosis = ?, prescription = ?, status = 'DONE' "
               + "WHERE appointmentId = ? AND doctorId = ? AND status = 'BOOKED'";
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setString(1, diagnosis);
        ps.setString(2, prescription.isEmpty() ? null : prescription);
        ps.setInt(3, id);
        ps.setInt(4, doctorId);
        return ps.executeUpdate() == 1;
    }
}

public boolean cancel(int id, int patientId) throws SQLException {
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(
                 "UPDATE Appointment SET status = 'CANCELLED' WHERE appointmentId = ? AND patientId = ? AND status = 'BOOKED'")) {
        ps.setInt(1, id);
        ps.setInt(2, patientId);
        return ps.executeUpdate() == 1;
    }
}</code></pre>
<p><code>UPDATE … WHERE appointmentId = ? AND doctorId = ? AND status = 'BOOKED'</code> returns 0 rows for someone else's visit (or one already DONE), and the controller reports it instead of pretending success. Three layers, each sufficient for the case it covers: the role filter (area), the ownership filter (record), the WHERE clause (data).</p>
<div class="pitfall">The ownership filter reads <code>request.getParameter("id")</code> — for a POST that parses the body before any servlet runs. It is safe here because Tomcat 10.1's default <code>conf/web.xml</code> already sets the request encoding to UTF-8 (measured in Chapter 1). On a server without that default, a filter that reads parameters must run <em>after</em> the encoding is set, or Vietnamese text is decoded as Latin-1 for good (practice <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch8">8.3</a>, exercise 1).</div>`,
    `<h2>6. Phòng thủ nhiều lớp: ổ khoá thứ ba nằm trong câu SQL</h2>
<p>Filter là cấu hình; cấu hình thì có lúc bị quên — một URL mới nằm ngoài mẫu đã ánh xạ, một servlet của bạn cùng nhóm. Vì thế chính các câu truy vấn chỉ chạm vào dòng của người đang đăng nhập, mà id lấy từ <strong>session</strong>, không bao giờ từ tham số:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Mã bệnh nhân lấy từ SESSION, không bao giờ từ tham số ⇒ bệnh nhân không liệt kê được lịch của người khác
public List&lt;Appointment&gt; findByPatient(int patientId) throws SQLException {
    return query(SELECT + "WHERE a.patientId = ? ORDER BY a.apptDate DESC, a.apptTime DESC, a.appointmentId DESC", patientId);
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/AppointmentDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// "AND doctorId = ?" là ổ khoá thứ hai sau filter: kể cả quên filter, bác sĩ A cũng không sửa được lượt khám của bác sĩ B
public boolean saveResult(int id, int doctorId, String diagnosis, String prescription) throws SQLException {
    String sql = "UPDATE Appointment SET diagnosis = ?, prescription = ?, status = 'DONE' "
               + "WHERE appointmentId = ? AND doctorId = ? AND status = 'BOOKED'";
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setString(1, diagnosis);
        ps.setString(2, prescription.isEmpty() ? null : prescription);
        ps.setInt(3, id);
        ps.setInt(4, doctorId);
        return ps.executeUpdate() == 1;
    }
}

public boolean cancel(int id, int patientId) throws SQLException {
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(
                 "UPDATE Appointment SET status = 'CANCELLED' WHERE appointmentId = ? AND patientId = ? AND status = 'BOOKED'")) {
        ps.setInt(1, id);
        ps.setInt(2, patientId);
        return ps.executeUpdate() == 1;
    }
}</code></pre>
<p><code>UPDATE … WHERE appointmentId = ? AND doctorId = ? AND status = 'BOOKED'</code> trả về 0 dòng với lượt khám của người khác (hoặc đã DONE), và controller báo đúng như vậy thay vì giả vờ thành công. Ba lớp, mỗi lớp đủ cho đúng trường hợp nó phủ: filter vai trò (khu), filter chủ sở hữu (bản ghi), mệnh đề WHERE (dữ liệu).</p>
<div class="pitfall">Filter chủ sở hữu gọi <code>request.getParameter("id")</code> — với POST, việc đó phân tích body trước khi servlet nào chạy. Ở đây an toàn vì <code>conf/web.xml</code> mặc định của Tomcat 10.1 đã đặt mã hoá request là UTF-8 (đo ở Chương 1). Trên server không có mặc định đó, filter đọc tham số phải chạy <em>sau</em> khi đã đặt encoding, nếu không chữ tiếng Việt bị giải mã theo Latin-1 vĩnh viễn (bài thực hành <a href="/courses/java-web-application-development/learn?lessonSlug=prj301-on-ch8">8.3</a>, bài 1).</div>`),
    bi(`<h2>7. Logout — POST only, and the old cookie is dead</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/LogoutController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// POST only: a GET logout can be triggered by any &lt;img src="…/logout"&gt; on another site
@WebServlet("/logout")
public class LogoutController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession s = req.getSession(false);
        if (s != null) s.invalidate();                                            // the whole session is gone, not just "account"
        resp.sendRedirect(req.getContextPath() + "/login?bye=1");
    }
}</code></pre>
<p>Logging out by GET would let any page on the internet log your users out with an <code>&lt;img src&gt;</code>. Not overriding <code>doGet</code> is enough — <code>HttpServlet</code> answers 405 by itself:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Content-Type: text/html;charset=utf-8

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Message HTTP method GET is not supported by this URL
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?bye=1</code></pre>
<p><code>invalidate()</code> destroys the whole session on the server, so the cookie the browser still sends now points to nothing — the next protected page goes back to login:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/invoices HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?next=%2Fphong-kham%2Fpatient%2Finvoices</code></pre>
<div class="callout">⚠️ <strong>What this sample does not do (say it in the report):</strong> forms carry no CSRF token, the login has no attempt limit, and the cookie is not <code>Secure</code> because the demo runs on plain HTTP. In production you would add a per-session token to every POST form, lock an account after N failures, and serve HTTPS with <code>&lt;secure&gt;true&lt;/secure&gt;</code> in <code>&lt;cookie-config&gt;</code>.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): both filters of this lesson are what Spring Security's filter chain does for you:
<pre><code class="language-java">@Bean
SecurityFilterChain security(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(a -&gt; a
            .requestMatchers("/", "/login", "/register", "/css/**").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")                          // = AuthorizationFilter.allowed
            .requestMatchers("/reception/**").hasAnyRole("RECEPTIONIST", "ADMIN")
            .requestMatchers("/doctor/**").hasRole("DOCTOR")
            .requestMatchers("/patient/**").hasRole("PATIENT")
            .anyRequest().authenticated())
        .formLogin(f -&gt; f.loginPage("/login"))                                     // changeSessionId: built in
        .logout(l -&gt; l.logoutUrl("/logout"));                                       // POST + CSRF token: built in
    return http.build();
}

@PreAuthorize("@appointmentGuard.isOwner(#id, authentication)")                     // = OwnershipFilter
@GetMapping("/patient/appointments/{id}")
public String view(@PathVariable int id, Model model) { … }</code></pre>
Passwords go through a <code>PasswordEncoder</code> (BCrypt by default, Argon2/PBKDF2 available). LabFlow's React client replaces the session with a JWT, but the two questions — role, then owner — stay exactly the same.</div>`,
    `<h2>7. Đăng xuất — chỉ POST, và cookie cũ chết hẳn</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/LogoutController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Chỉ POST: đăng xuất bằng GET có thể bị kích hoạt bởi một &lt;img src="…/logout"&gt; trên trang khác
@WebServlet("/logout")
public class LogoutController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession s = req.getSession(false);
        if (s != null) s.invalidate();                                            // xoá cả session, không chỉ "account"
        resp.sendRedirect(req.getContextPath() + "/login?bye=1");
    }
}</code></pre>
<p>Đăng xuất bằng GET thì bất kỳ trang nào trên mạng cũng đăng xuất người dùng của bạn được bằng một thẻ <code>&lt;img src&gt;</code>. Không ghi đè <code>doGet</code> là đủ — <code>HttpServlet</code> tự trả 405:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Content-Type: text/html;charset=utf-8

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Message HTTP method GET is not supported by this URL
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?bye=1</code></pre>
<p><code>invalidate()</code> huỷ cả session trên server, nên cookie trình duyệt vẫn gửi giờ không trỏ tới gì — trang được bảo vệ kế tiếp lại quay về login:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/invoices HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/login?next=%2Fphong-kham%2Fpatient%2Finvoices</code></pre>
<div class="callout">⚠️ <strong>Những gì bản mẫu này KHÔNG làm (ghi rõ trong báo cáo):</strong> form không có token chống CSRF, đăng nhập không giới hạn số lần thử, và cookie không có cờ <code>Secure</code> vì bản demo chạy HTTP thường. Khi chạy thật, bạn thêm một token theo session vào mọi form POST, khoá tài khoản sau N lần sai, và phục vụ HTTPS với <code>&lt;secure&gt;true&lt;/secure&gt;</code> trong <code>&lt;cookie-config&gt;</code>.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cả hai filter của bài này là thứ chuỗi filter của Spring Security làm sẵn cho bạn:
<pre><code class="language-java">@Bean
SecurityFilterChain security(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(a -&gt; a
            .requestMatchers("/", "/login", "/register", "/css/**").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")                          // = AuthorizationFilter.allowed
            .requestMatchers("/reception/**").hasAnyRole("RECEPTIONIST", "ADMIN")
            .requestMatchers("/doctor/**").hasRole("DOCTOR")
            .requestMatchers("/patient/**").hasRole("PATIENT")
            .anyRequest().authenticated())
        .formLogin(f -&gt; f.loginPage("/login"))                                     // changeSessionId: có sẵn
        .logout(l -&gt; l.logoutUrl("/logout"));                                       // POST + token CSRF: có sẵn
    return http.build();
}

@PreAuthorize("@appointmentGuard.isOwner(#id, authentication)")                     // = OwnershipFilter
@GetMapping("/patient/appointments/{id}")
public String view(@PathVariable int id, Model model) { … }</code></pre>
Mật khẩu đi qua một <code>PasswordEncoder</code> (mặc định BCrypt, có cả Argon2/PBKDF2). Client React của LabFlow thay session bằng JWT, nhưng hai câu hỏi — vai trò, rồi chủ sở hữu — vẫn y nguyên.</div>`),
    bi(`<h2>🧪 Exercises (predict first, then check with the code)</h2>
<h3>🧪 Exercise 1 — a record that does not exist (~5 min)</h3>
<p>BS. An opens <code>/doctor/appointments/result?id=999</code>. Status code, and who answers?</p>
<p class="dap-an">✅ <strong>404</strong>, answered by <code>OwnershipFilter</code>: <code>findOwners(999)</code> returns <code>null</code> ⇒ <code>sendError(404)</code> ⇒ the container shows our <code>error/404.jsp</code> (ASM.2). Not 403: "it does not exist" and "it is not yours" are different facts. (Some teams prefer 404 for both so ids of other users cannot even be probed — a valid choice; write it in the report.)</p>
<h3>🧪 Exercise 2 — swap the two filter mappings in web.xml (~5 min)</h3>
<p>What does a <em>guest</em> get on <code>/patient/appointments/view?id=5</code> then?</p>
<p class="dap-an">✅ <strong>500</strong>: the ownership filter runs first, finds appointment 5, then <code>me.getId()</code> on a <code>null</code> account ⇒ NullPointerException. The order of <code>&lt;filter-mapping&gt;</code> is part of the security design — which is exactly why the filters are not annotated with <code>@WebFilter</code>.</p>
<h3>🧪 Exercise 3 — remove "AND doctorId = ?" from saveResult (~5 min)</h3>
<p>Is the app now vulnerable?</p>
<p class="dap-an">✅ Not through <code>/doctor/appointments/result</code> — the filter still blocks it (request <code>bs-sua-cua-nguoi-khac</code>). But the day a teammate adds <code>/doctor/quick-result</code> outside the mapped pattern, any doctor can close any visit. Keep the WHERE: it costs nothing and covers the URL you have not written yet.</p>
<h3>🧪 Exercise 4 — your topic's owner rule (~45 min)</h3>
<p>Write the ownership filter for your topic (e.g. topic 1: <code>/customer/contracts/*?id=</code> ⇒ <code>RentalContract.customerId</code>; topic 4: <code>/mechanic/orders/*?id=</code> ⇒ <code>RepairOrder.mechanicId</code>), map it after the role filter in <code>web.xml</code>, and add three requests to your demo script: own record ⇒ 200, other's record ⇒ 403, unknown id ⇒ 404.</p>
<p class="dap-an">✅ Copy <code>OwnershipFilter</code>, change <code>findOwners</code> to return the owning column(s) of YOUR table, keep the three outcomes (404 / 403 + log / chain). Then make every DAO update/delete of that table include <code>AND ownerColumn = ?</code> with the session id.</p>`,
    `<h2>🧪 Bài tập (đoán trước, rồi kiểm bằng code)</h2>
<h3>🧪 Bài 1 — một bản ghi không tồn tại (~5 phút)</h3>
<p>BS. An mở <code>/doctor/appointments/result?id=999</code>. Mã trạng thái là gì, và ai trả lời?</p>
<p class="dap-an">✅ <strong>404</strong>, do <code>OwnershipFilter</code> trả lời: <code>findOwners(999)</code> trả về <code>null</code> ⇒ <code>sendError(404)</code> ⇒ container hiện <code>error/404.jsp</code> của chúng ta (ASM.2). Không phải 403: "không tồn tại" và "không phải của bạn" là hai sự thật khác nhau. (Có nhóm thích trả 404 cho cả hai để người khác không dò được id — cũng là một lựa chọn đúng; ghi vào báo cáo.)</p>
<h3>🧪 Bài 2 — đổi chỗ hai filter-mapping trong web.xml (~5 phút)</h3>
<p>Khi đó một <em>khách</em> mở <code>/patient/appointments/view?id=5</code> nhận được gì?</p>
<p class="dap-an">✅ <strong>500</strong>: filter chủ sở hữu chạy trước, tìm thấy lịch 5, rồi gọi <code>me.getId()</code> trên một account <code>null</code> ⇒ NullPointerException. Thứ tự <code>&lt;filter-mapping&gt;</code> là một phần của thiết kế bảo mật — đó chính là lý do hai filter không gắn <code>@WebFilter</code>.</p>
<h3>🧪 Bài 3 — bỏ "AND doctorId = ?" khỏi saveResult (~5 phút)</h3>
<p>App có bị lỗ hổng không?</p>
<p class="dap-an">✅ Qua <code>/doctor/appointments/result</code> thì không — filter vẫn chặn (request <code>bs-sua-cua-nguoi-khac</code>). Nhưng ngày một bạn cùng nhóm thêm <code>/doctor/quick-result</code> nằm ngoài mẫu đã ánh xạ, bác sĩ nào cũng đóng được lượt khám của bất kỳ ai. Giữ mệnh đề WHERE: nó không tốn gì và phủ cả URL bạn chưa viết.</p>
<h3>🧪 Bài 4 — luật chủ sở hữu cho đề tài của bạn (~45 phút)</h3>
<p>Viết filter chủ sở hữu cho đề tài của bạn (vd đề 1: <code>/customer/contracts/*?id=</code> ⇒ <code>RentalContract.customerId</code>; đề 4: <code>/mechanic/orders/*?id=</code> ⇒ <code>RepairOrder.mechanicId</code>), ánh xạ nó sau filter vai trò trong <code>web.xml</code>, và thêm ba request vào kịch bản demo: bản ghi của mình ⇒ 200, của người khác ⇒ 403, id không tồn tại ⇒ 404.</p>
<p class="dap-an">✅ Chép <code>OwnershipFilter</code>, đổi <code>findOwners</code> để trả về (các) cột chủ sở hữu của bảng CỦA BẠN, giữ ba kết cục (404 / 403 + log / cho qua chuỗi). Rồi cho mọi lệnh update/delete của DAO trên bảng đó có thêm <code>AND cotChuSoHuu = ?</code> với id lấy từ session.</p>`),
  ].join('\n'),
};

/* ───────── ASM.5 — 🧭 Assignment A–Z (5/6): sandbox payment with VNPay — signed URL, IPN, return page, a local fake gateway ───────── */
const L_x_asm_5 = {
  title: 'ASM.5 — 🧭 Assignment A–Z (5/6): sandbox payment with VNPay — signed URL, IPN, return page, a local fake gateway|||ASM.5 — 🧭 Assignment A–Z (5/6): thanh toán sandbox VNPay — URL có chữ ký, IPN, trang return, cổng giả chạy cục bộ',
  slug: 'prj301-asm-5',
  type: 'VIDEO',
  description: 'Bài tự thêm, chuỗi Assignment PRJ301 mẫu Quản lý phòng khám, đúng yêu cầu 1.10: tích hợp VNPay sandbox (API 2.1.0) theo tài liệu chính thức — đăng ký merchant test, thẻ test NCB, TmnCode và HashSecret chỉ đọc từ biến môi trường; bảng PaymentTxn mỗi lần thử một dòng; dựng URL thanh toán với tham số vnp_* sắp xếp, mã hoá URL và chữ ký HMAC-SHA512; IPN kiểm checksum, đơn, số tiền, trạng thái rồi cập nhật PAID trong một transaction, gọi hai lần vẫn chỉ cập nhật một lần; trang return chỉ hiển thị; cổng VNPay giả lập chạy cục bộ để mọi request (thành công, huỷ, sửa chữ ký, sửa số tiền, IPN lặp, trả hoá đơn người khác) có response thật; cách chuyển sang cổng thật.',
  content: [
    bi(`<span class="eyebrow">🧭 Course Assignment A–Z · 5/6 · added by this site</span>
<h2>Requirement 1.10: "payment through a <em>sandbox</em>" — a real round trip, not a button that writes PAID</h2>
<p class="lead">A <strong>sandbox</strong> is a copy of a payment gateway made for developers: same URLs, same parameters, same signatures, but test cards and no real money. To pass 1.10 the marker wants to see the patient <strong>leave</strong> your site for the gateway, pay with a test card, <strong>come back</strong>, and the invoice turn PAID — and, if he is good, he will ask how you know the "success" that came back is not fake.</p>
<p>We use <strong>VNPay</strong> (the most common gateway in Vietnamese student projects, free sandbox registration) and follow its official documentation, API version <strong>2.1.0</strong>. Everything in this lesson — parameter names, the checksum rule, the IPN answers, the response codes — is taken from <code>sandbox.vnpayment.vn/apis/docs</code> (read on 15/10/2026); where the docs are silent we say so.</p>
<div class="callout">⚠️ <strong>About the responses on this page.</strong> The machine that runs this course's examples has no internet access, so it cannot talk to <code>sandbox.vnpayment.vn</code>. We therefore wrote a small <strong>FAKE VNPay gateway</strong> (<code>/vnpay-gia/…</code>, section 5) that follows the same contract: it checks the same checksum, calls your IPN server-to-server, then sends the browser back to your return URL. Every response below is real — but the gateway pages are ours, not VNPay's. Your app code is the same for both; section 8 switches it to the real sandbox with three environment variables.</div>`,
    `<span class="eyebrow">🧭 Assignment A–Z · 5/6 · phần web tự thêm</span>
<h2>Yêu cầu 1.10: "thanh toán sử dụng <em>sandbox</em>" — một vòng đi–về thật, không phải nút bấm ghi PAID</h2>
<p class="lead"><strong>Sandbox</strong> (hộp cát — môi trường thử) là bản sao của cổng thanh toán dành cho lập trình viên: cùng URL, cùng tham số, cùng chữ ký, nhưng dùng thẻ test và không có tiền thật. Muốn qua 1.10, người chấm cần thấy bệnh nhân <strong>rời</strong> trang của bạn sang cổng thanh toán, trả bằng thẻ test, <strong>quay về</strong>, và hoá đơn thành PAID — còn nếu người chấm giỏi, họ sẽ hỏi: làm sao bạn biết chữ "thành công" quay về đó không phải đồ giả?</p>
<p>Chúng ta dùng <strong>VNPay</strong> (cổng phổ biến nhất trong đồ án sinh viên Việt Nam, đăng ký sandbox miễn phí) và làm theo tài liệu chính thức của họ, phiên bản API <strong>2.1.0</strong>. Mọi thứ trong bài — tên tham số, luật tính checksum, câu trả lời IPN, mã phản hồi — đều lấy từ <code>sandbox.vnpayment.vn/apis/docs</code> (đọc ngày 15/10/2026); chỗ nào tài liệu không nói, bài ghi rõ.</p>
<div class="callout">⚠️ <strong>Về các response trong trang này.</strong> Máy chạy ví dụ của khoá học không ra được internet, nên không nói chuyện được với <code>sandbox.vnpayment.vn</code>. Vì thế chúng ta viết một <strong>cổng VNPay GIẢ</strong> nhỏ (<code>/vnpay-gia/…</code>, mục 5) theo đúng hợp đồng: kiểm cùng một checksum, gọi IPN của bạn kiểu server-tới-server, rồi đưa trình duyệt về return URL của bạn. Mọi response bên dưới là thật — nhưng các trang của cổng là của chúng ta, không phải của VNPay. Code app của bạn giống hệt cho cả hai; mục 8 chuyển nó sang sandbox thật bằng ba biến môi trường.</div>`),
    bi(`<h2>1. Three URLs and two ways back</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/82d88e96c5ffcf7e2ae042d97fb1a4f1aa047a16.svg" alt="One payment: the browser goes out with a signed URL, VNPay's server reports the result through the IPN, the browser comes back to the return page" loading="lazy" /><p class="chu-thich">🧩 One payment: the browser goes out with a signed URL, VNPay's server reports the result through the IPN, the browser comes back to the return page</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Sandbox payment (VNPay API 2.1.0): the browser carries the request, the IPN carries the truth
actor "Bệnh nhân\\n(browser)" as P
participant "App phòng khám\\n(Tomcat)" as A
database "SQL Server" as DB
participant "VNPay sandbox\\n(here: fake gateway /vnpay-gia)" as V
P -&gt; A : POST /patient/invoices/pay (id=3)
A -&gt; DB : invoice of THIS patient? still UNPAID?
A -&gt; DB : INSERT PaymentTxn (PENDING) ⇒ txnRef PK2
A -&gt; A : vnp_* params, sorted, URL-encoded,\\nvnp_SecureHash = HMAC-SHA512(secret, hashData)
A --&gt; P : 302 Location: …/vpcpay.html?vnp_…&amp;vnp_SecureHash=…
P -&gt; V : GET vpcpay.html?…
V -&gt; V : recompute checksum, TmnCode, expiry
V --&gt; P : payment page (card, OTP)
P -&gt; V : test card + OTP ⇒ "Thanh toán"
group server to server (no browser, no cookie)
  V -&gt; A : GET /vnpay/ipn?vnp_ResponseCode=00…&amp;vnp_SecureHash=…
  A -&gt; A : checksum → order → amount → still PENDING?
  A -&gt; DB : ONE transaction: PaymentTxn SUCCESS + Invoice PAID
  A --&gt; V : {"RspCode":"00","Message":"Confirm Success"}
end
V --&gt; P : 302 → /vnpay/return?…same signed params
P -&gt; A : GET /vnpay/return?…
A -&gt; A : checksum only — NO update here
A -&gt; DB : read the status written by the IPN
A --&gt; P : "Thanh toán thành công HD3"
@enduml</code></pre></details>
<ul>
<li><strong>Payment URL</strong> — VNPay's page (sandbox: <code>https://sandbox.vnpayment.vn/paymentv2/vpcpay.html</code>). Your server never "calls" it: it answers the patient with a <strong>302</strong> whose <code>Location</code> is that URL plus your signed parameters.</li>
<li><strong>Return URL</strong> (<code>vnp_ReturnUrl</code>) — where VNPay sends the <em>browser</em> back. The docs are explicit: verify the checksum and <strong>show</strong> the result; <em>"Không cập nhật kết quả giao dịch tại địa chỉ này"</em> — do not update the transaction here.</li>
<li><strong>IPN URL</strong> (<em>Instant Payment Notification</em>) — VNPay's <em>server</em> calls your server directly with the result. This is the only place that writes PAID. The VNPay FAQ gives the reason: the customer's connection may be unstable — he can close the tab, lose Wi-Fi or never reach the return page, but the IPN still arrives (and is retried).</li>
</ul>
<p>The IPN URL is not a request parameter: you <em>send it to VNPay</em> once ("Gửi lại VNPAY URL này khi thiết lập xong"), and it must be reachable from the internet with SSL. In this lesson the fake gateway reads it from <code>web.xml</code>.</p>`,
    `<h2>1. Ba URL và hai đường quay về</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/82d88e96c5ffcf7e2ae042d97fb1a4f1aa047a16.svg" alt="Một lần thanh toán: trình duyệt đi ra với URL có chữ ký, server của VNPay báo kết quả qua IPN, trình duyệt quay về trang return" loading="lazy" /><p class="chu-thich">🧩 Một lần thanh toán: trình duyệt đi ra với URL có chữ ký, server của VNPay báo kết quả qua IPN, trình duyệt quay về trang return</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Sandbox payment (VNPay API 2.1.0): the browser carries the request, the IPN carries the truth
actor "Bệnh nhân\\n(browser)" as P
participant "App phòng khám\\n(Tomcat)" as A
database "SQL Server" as DB
participant "VNPay sandbox\\n(here: fake gateway /vnpay-gia)" as V
P -&gt; A : POST /patient/invoices/pay (id=3)
A -&gt; DB : invoice of THIS patient? still UNPAID?
A -&gt; DB : INSERT PaymentTxn (PENDING) ⇒ txnRef PK2
A -&gt; A : vnp_* params, sorted, URL-encoded,\\nvnp_SecureHash = HMAC-SHA512(secret, hashData)
A --&gt; P : 302 Location: …/vpcpay.html?vnp_…&amp;vnp_SecureHash=…
P -&gt; V : GET vpcpay.html?…
V -&gt; V : recompute checksum, TmnCode, expiry
V --&gt; P : payment page (card, OTP)
P -&gt; V : test card + OTP ⇒ "Thanh toán"
group server to server (no browser, no cookie)
  V -&gt; A : GET /vnpay/ipn?vnp_ResponseCode=00…&amp;vnp_SecureHash=…
  A -&gt; A : checksum → order → amount → still PENDING?
  A -&gt; DB : ONE transaction: PaymentTxn SUCCESS + Invoice PAID
  A --&gt; V : {"RspCode":"00","Message":"Confirm Success"}
end
V --&gt; P : 302 → /vnpay/return?…same signed params
P -&gt; A : GET /vnpay/return?…
A -&gt; A : checksum only — NO update here
A -&gt; DB : read the status written by the IPN
A --&gt; P : "Thanh toán thành công HD3"
@enduml</code></pre></details>
<ul>
<li><strong>Payment URL</strong> (URL thanh toán) — trang của VNPay (sandbox: <code>https://sandbox.vnpayment.vn/paymentv2/vpcpay.html</code>). Server của bạn không bao giờ "gọi" nó: nó trả lời bệnh nhân bằng <strong>302</strong> mà <code>Location</code> là URL đó cộng các tham số đã ký.</li>
<li><strong>Return URL</strong> (<code>vnp_ReturnUrl</code>, URL quay về) — nơi VNPay đưa <em>trình duyệt</em> về. Tài liệu nói thẳng: kiểm checksum rồi <strong>hiển thị</strong> kết quả; <em>"Không cập nhật kết quả giao dịch tại địa chỉ này"</em>.</li>
<li><strong>IPN URL</strong> (<em>Instant Payment Notification</em> — thông báo thanh toán tức thời) — <em>server</em> của VNPay gọi thẳng server của bạn để báo kết quả. Đây là chỗ duy nhất được ghi PAID. FAQ của VNPay nêu lý do: kết nối của khách hàng có thể không ổn định — khách đóng tab, mất Wi-Fi, không bao giờ tới trang return — nhưng IPN vẫn tới (và được gọi lại).</li>
</ul>
<p>IPN URL không phải tham số trong request: bạn <em>gửi nó cho VNPay</em> một lần ("Gửi lại VNPAY URL này khi thiết lập xong"), và nó phải truy cập được từ internet, có SSL (HTTPS). Trong bài này cổng giả đọc nó từ <code>web.xml</code>.</p>`),
    bi(`<h2>2. Register a sandbox merchant, keep the secret out of the code</h2>
<p>The docs' introduction page links "Đăng ký Test" to <code>sandbox.vnpayment.vn/devreg</code> ("Đăng ký Merchant môi trường test"). After registering you receive two values — exactly the two our code needs:</p>
<table>
<thead><tr><th>Value</th><th>What it is (VNPay docs)</th><th>Where it goes</th></tr></thead>
<tbody>
<tr><td>vnp_TmnCode</td><td>the code of your website in the payment gateway (8 characters)</td><td>sent in every payment URL — not secret, but still configuration</td></tr>
<tr><td>vnp_HashSecret</td><td>"the secret string used to check the integrity of data when the two systems exchange information (checksum)"</td><td>ONLY in an environment variable — whoever has it can forge a "payment successful"</td></tr>
</tbody>
</table>
<p>Test cards — the sandbox demo page says only the cards of its list work in the test environment. The two we use:</p>
<table>
<thead><tr><th>Bank</th><th>Card number</th><th>Holder</th><th>Issue date</th><th>OTP</th><th>Result</th></tr></thead>
<tbody>
<tr><td>NCB</td><td>9704198526191432198</td><td>NGUYEN VAN A</td><td>07/15</td><td>123456</td><td>success</td></tr>
<tr><td>NCB</td><td>9704195798459170488</td><td>NGUYEN VAN A</td><td>07/15</td><td>—</td><td>insufficient balance</td></tr>
</tbody>
</table>
<p>(The list also has a locked card, an expired card, an inactive card, NAPAS cards, and international VISA/MasterCard/JCB test cards — see <code>sandbox.vnpayment.vn/apis/vnpay-demo</code>. The minimum amount is 5,000 VND and only VND is supported.)</p>
<p>The configuration class reads the real values from the <strong>environment</strong> only, and refuses a half configuration:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/payment/VnpayConfig.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public static synchronized VnpayConfig of(ServletContext ctx) {
    VnpayConfig c = (VnpayConfig) ctx.getAttribute(KEY);
    if (c == null) {
        c = load(ctx);
        ctx.setAttribute(KEY, c);
        System.out.println(c.demo
                ? "VNPay: DEMO mode — fake gateway /vnpay-gia, made-up TmnCode " + c.tmnCode + " (set VNP_TMN_CODE + VNP_HASH_SECRET for the real sandbox)"
                : "VNPay: TmnCode " + c.tmnCode + " → " + c.payUrl);     // never print the secret
    }
    return c;
}

private static VnpayConfig load(ServletContext ctx) {
    String tmn = System.getenv("VNP_TMN_CODE");
    String secret = System.getenv("VNP_HASH_SECRET");
    boolean hasTmn = tmn != null &amp;&amp; !tmn.isBlank(), hasSecret = secret != null &amp;&amp; !secret.isBlank();
    if (hasTmn != hasSecret)                                   // half-configured = a mistake: stop loudly
        throw new IllegalStateException("Set BOTH VNP_TMN_CODE and VNP_HASH_SECRET, or neither (demo mode)");
    if (hasTmn) {
        String url = System.getenv("VNP_PAY_URL");             // production URL later, sandbox by default
        return new VnpayConfig(tmn.trim(), secret.trim(), url == null || url.isBlank() ? SANDBOX_PAY_URL : url.trim(), false);
    }
    return new VnpayConfig(ctx.getInitParameter("vnpay.demo.tmnCode"), ctx.getInitParameter("vnpay.demo.hashSecret"), null, true);
}</code></pre>
<pre><code class="language-bash"># macOS / Linux (the terminal that starts Tomcat, or bin/setenv.sh)
export VNP_TMN_CODE=XXXXXXXX
export VNP_HASH_SECRET='the secret from the e-mail'
# optional: VNP_PAY_URL (default = sandbox), VNP_RETURN_URL (behind a proxy/HTTPS)</code></pre>
<pre><code class="language-powershell"># Windows (school PC) — then restart NetBeans so Tomcat inherits it; or put "set VNP_…" lines in bin\\setenv.bat
setx VNP_TMN_CODE "XXXXXXXX"
setx VNP_HASH_SECRET "the secret from the e-mail"</code></pre>
<div class="pitfall">Never put the real HashSecret in a <code>.java</code> file, in <code>web.xml</code>, in <code>context.xml</code> or in the report. All of them end up in Git and in the WAR you submit — anyone with the zip can sign "successful" payments for your shop. The two <code>vnpay.demo.*</code> values in our <code>web.xml</code> are <strong>made up</strong> for the fake gateway and are ignored as soon as the environment variables exist.</div>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Lesson A.5. The REAL TmnCode/HashSecret come ONLY from environment variables VNP_TMN_CODE + VNP_HASH_SECRET --&gt;
&lt;!-- Without them the app runs in DEMO mode against the FAKE gateway /vnpay-gia, with these made-up values --&gt;
&lt;context-param&gt;
    &lt;param-name&gt;vnpay.demo.tmnCode&lt;/param-name&gt;
    &lt;param-value&gt;DEMO0001&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;context-param&gt;
    &lt;param-name&gt;vnpay.demo.hashSecret&lt;/param-name&gt;
    &lt;param-value&gt;DEMO-SECRET-chi-dung-cho-cong-gia-lap&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;context-param&gt;
    &lt;param-name&gt;vnpay.demo.ipnUrl&lt;/param-name&gt;
    &lt;param-value&gt;http://localhost:8080/phong-kham/vnpay/ipn&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;!-- Pins "now" (GMT+7) so vnp_CreateDate and the signatures stay the same in the lesson. DELETE in a real deployment --&gt;
&lt;context-param&gt;
    &lt;param-name&gt;clinic.now&lt;/param-name&gt;
    &lt;param-value&gt;2026-11-05T10:15:00&lt;/param-value&gt;
&lt;/context-param&gt;</code></pre>`,
    `<h2>2. Đăng ký merchant sandbox, giữ secret ngoài code</h2>
<p>Trang giới thiệu của tài liệu có link "Đăng ký Test" tới <code>sandbox.vnpayment.vn/devreg</code> ("Đăng ký Merchant môi trường test"). Đăng ký xong bạn nhận hai giá trị — đúng hai thứ code của chúng ta cần:</p>
<table>
<thead><tr><th>Giá trị</th><th>Là gì (tài liệu VNPay)</th><th>Đặt ở đâu</th></tr></thead>
<tbody>
<tr><td>vnp_TmnCode</td><td>mã website của bạn trên cổng thanh toán (8 ký tự)</td><td>gửi trong mọi URL thanh toán — không bí mật, nhưng vẫn là cấu hình</td></tr>
<tr><td>vnp_HashSecret</td><td>"chuỗi bí mật sử dụng để kiểm tra toàn vẹn dữ liệu khi hai hệ thống trao đổi thông tin (checksum)"</td><td>CHỈ trong biến môi trường — ai có nó là giả được "thanh toán thành công"</td></tr>
</tbody>
</table>
<p>Thẻ test — trang demo của sandbox ghi rõ trên môi trường test chỉ dùng được các thẻ trong danh sách của họ. Hai thẻ chúng ta dùng:</p>
<table>
<thead><tr><th>Ngân hàng</th><th>Số thẻ</th><th>Chủ thẻ</th><th>Ngày phát hành</th><th>OTP</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>NCB</td><td>9704198526191432198</td><td>NGUYEN VAN A</td><td>07/15</td><td>123456</td><td>thành công</td></tr>
<tr><td>NCB</td><td>9704195798459170488</td><td>NGUYEN VAN A</td><td>07/15</td><td>—</td><td>không đủ số dư</td></tr>
</tbody>
</table>
<p>(Danh sách còn có thẻ bị khoá, thẻ hết hạn, thẻ chưa kích hoạt, thẻ qua NAPAS, và thẻ quốc tế VISA/MasterCard/JCB để thử — xem <code>sandbox.vnpayment.vn/apis/vnpay-demo</code>. Số tiền tối thiểu 5.000 VND và chỉ hỗ trợ VND.)</p>
<p>Lớp cấu hình đọc giá trị thật CHỈ từ <strong>biến môi trường</strong> (environment variable), và từ chối cấu hình một nửa:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/payment/VnpayConfig.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public static synchronized VnpayConfig of(ServletContext ctx) {
    VnpayConfig c = (VnpayConfig) ctx.getAttribute(KEY);
    if (c == null) {
        c = load(ctx);
        ctx.setAttribute(KEY, c);
        System.out.println(c.demo
                ? "VNPay: DEMO mode — fake gateway /vnpay-gia, made-up TmnCode " + c.tmnCode + " (set VNP_TMN_CODE + VNP_HASH_SECRET for the real sandbox)"
                : "VNPay: TmnCode " + c.tmnCode + " → " + c.payUrl);     // không bao giờ in secret
    }
    return c;
}

private static VnpayConfig load(ServletContext ctx) {
    String tmn = System.getenv("VNP_TMN_CODE");
    String secret = System.getenv("VNP_HASH_SECRET");
    boolean hasTmn = tmn != null &amp;&amp; !tmn.isBlank(), hasSecret = secret != null &amp;&amp; !secret.isBlank();
    if (hasTmn != hasSecret)                                   // cấu hình một nửa = nhầm lẫn: dừng ngay cho rõ
        throw new IllegalStateException("Set BOTH VNP_TMN_CODE and VNP_HASH_SECRET, or neither (demo mode)");
    if (hasTmn) {
        String url = System.getenv("VNP_PAY_URL");             // sau này là URL production, mặc định sandbox
        return new VnpayConfig(tmn.trim(), secret.trim(), url == null || url.isBlank() ? SANDBOX_PAY_URL : url.trim(), false);
    }
    return new VnpayConfig(ctx.getInitParameter("vnpay.demo.tmnCode"), ctx.getInitParameter("vnpay.demo.hashSecret"), null, true);
}</code></pre>
<pre><code class="language-bash"># macOS / Linux (terminal khởi động Tomcat, hoặc bin/setenv.sh)
export VNP_TMN_CODE=XXXXXXXX
export VNP_HASH_SECRET='secret trong email'
# tuỳ chọn: VNP_PAY_URL (mặc định = sandbox), VNP_RETURN_URL (khi chạy sau proxy/HTTPS)</code></pre>
<pre><code class="language-powershell"># Windows (máy trường) — rồi khởi động lại NetBeans để Tomcat nhận; hoặc ghi các dòng "set VNP_…" vào bin\\setenv.bat
setx VNP_TMN_CODE "XXXXXXXX"
setx VNP_HASH_SECRET "secret trong email"</code></pre>
<div class="pitfall">Không bao giờ đặt HashSecret thật trong file <code>.java</code>, trong <code>web.xml</code>, <code>context.xml</code> hay trong báo cáo. Tất cả đều vào Git và vào file WAR bạn nộp — ai có file zip là ký được giao dịch "thành công" cho cửa hàng của bạn. Hai giá trị <code>vnpay.demo.*</code> trong <code>web.xml</code> của chúng ta là <strong>bịa ra</strong> cho cổng giả, và bị bỏ qua ngay khi có biến môi trường.</div>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Bài A.5. TmnCode/HashSecret THẬT chỉ đến từ biến môi trường VNP_TMN_CODE + VNP_HASH_SECRET --&gt;
&lt;!-- Thiếu chúng thì app chạy chế độ DEMO với cổng GIẢ /vnpay-gia, dùng các giá trị bịa dưới đây --&gt;
&lt;context-param&gt;
    &lt;param-name&gt;vnpay.demo.tmnCode&lt;/param-name&gt;
    &lt;param-value&gt;DEMO0001&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;context-param&gt;
    &lt;param-name&gt;vnpay.demo.hashSecret&lt;/param-name&gt;
    &lt;param-value&gt;DEMO-SECRET-chi-dung-cho-cong-gia-lap&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;context-param&gt;
    &lt;param-name&gt;vnpay.demo.ipnUrl&lt;/param-name&gt;
    &lt;param-value&gt;http://localhost:8080/phong-kham/vnpay/ipn&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;!-- Ghim "bây giờ" (GMT+7) để vnp_CreateDate và chữ ký giữ nguyên trong bài. XOÁ khi chạy thật --&gt;
&lt;context-param&gt;
    &lt;param-name&gt;clinic.now&lt;/param-name&gt;
    &lt;param-value&gt;2026-11-05T10:15:00&lt;/param-value&gt;
&lt;/context-param&gt;</code></pre>`),
    bi(`<h2>3. One table more: every payment ATTEMPT is a row</h2>
<p>The tempting design "add <code>txnRef</code> to <code>Invoice</code>" breaks on the first cancel: the patient cancels, clicks "pay" again, and the docs say <code>vnp_TxnRef</code> <em>must not repeat within the same day</em>. So an invoice has 0..n attempts, each with its own reference and its own outcome:</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">-- Lesson A.5: ONE row per payment ATTEMPT (cancel then retry = 2 rows). VNPay forbids reusing vnp_TxnRef in a day
CREATE TABLE PaymentTxn (
    paymentId     INT IDENTITY(1,1) PRIMARY KEY,
    txnRef        AS ('PK' + CAST(paymentId AS VARCHAR(10))) PERSISTED      -- vnp_TxnRef, computed from the id
                  CONSTRAINT UQ_PaymentTxn_txnRef UNIQUE,
    invoiceId     INT NOT NULL CONSTRAINT FK_PaymentTxn_Invoice REFERENCES Invoice(invoiceId),
    amount        DECIMAL(12,0) NOT NULL CONSTRAINT CK_PaymentTxn_amount CHECK (amount &gt; 0),   -- copied from the invoice
    status        VARCHAR(10) NOT NULL CONSTRAINT DF_PaymentTxn_status DEFAULT 'PENDING'
                  CONSTRAINT CK_PaymentTxn_status CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    responseCode  VARCHAR(2)   NULL,                            -- vnp_ResponseCode from the IPN (00, 24, 51…)
    gatewayTxnNo  VARCHAR(20)  NULL,                            -- vnp_TransactionNo, VNPay's own number
    bankCode      VARCHAR(20)  NULL,
    createdAt     DATETIME2(0) NOT NULL CONSTRAINT DF_PaymentTxn_createdAt DEFAULT SYSDATETIME(),
    finishedAt    DATETIME2(0) NULL                             -- vnp_PayDate (GMT+7)
);</code></pre>
<ul>
<li><code>txnRef</code> is a <strong>computed, persisted</strong> column (<code>'PK' + paymentId</code>) with a UNIQUE constraint: it can never disagree with the id and never repeat. The DAO gets it back with <code>OUTPUT INSERTED.txnRef</code> in the same statement as the INSERT:</li>
</ul>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/PaymentDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// New attempt, status PENDING. OUTPUT returns the computed txnRef ("PK" + id) in the same round trip
public String createPending(int invoiceId, BigDecimal amount) throws SQLException {
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(
                 "INSERT INTO PaymentTxn (invoiceId, amount) OUTPUT INSERTED.txnRef VALUES (?, ?)")) {
        ps.setInt(1, invoiceId);
        ps.setBigDecimal(2, amount);
        try (ResultSet rs = ps.executeQuery()) { rs.next(); return rs.getString(1); }
    }
}</code></pre>
<ul>
<li><code>amount</code> is copied from the invoice when the attempt starts — the IPN compares VNPay's amount with <em>this</em> number.</li>
<li><code>status</code> PENDING → SUCCESS or FAILED, written once, by the IPN. <code>Invoice.status</code> UNPAID → PAID follows a SUCCESS (ASM.1's state diagram).</li>
</ul>
<p>The report (ASM.6) and the IPN both need the invoice's owner and status, so <code>InvoiceDAO</code> got <code>findById</code> (with <code>patientId</code>) and <code>markPaid</code>, which runs on the caller's <code>Connection</code> so it can join the IPN's transaction:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/InvoiceDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Runs INSIDE the caller's transaction (same Connection). "AND status = 'UNPAID'" ⇒ a second call changes 0 rows
public boolean markPaid(Connection c, int invoiceId, String paymentRef, LocalDateTime paidAt) throws SQLException {
    try (PreparedStatement ps = c.prepareStatement(
            "UPDATE Invoice SET status = 'PAID', paidAt = ?, paymentRef = ? WHERE invoiceId = ? AND status = 'UNPAID'")) {
        ps.setObject(1, paidAt);
        ps.setString(2, paymentRef);
        ps.setInt(3, invoiceId);
        return ps.executeUpdate() == 1;
    }
}</code></pre>`,
    `<h2>3. Thêm một bảng: mỗi LẦN THỬ thanh toán là một dòng</h2>
<p>Thiết kế hấp dẫn "thêm cột <code>txnRef</code> vào <code>Invoice</code>" gãy ngay lần huỷ đầu tiên: bệnh nhân huỷ, bấm "thanh toán" lại, mà tài liệu ghi <code>vnp_TxnRef</code> <em>không được trùng lặp trong ngày</em>. Vì thế một hoá đơn có 0..n lần thử, mỗi lần một mã tham chiếu và một kết cục riêng:</p>
<p class="ghi-chu">📄 <code>phong-kham/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">-- Bài A.5: MỖI LẦN THỬ thanh toán một dòng (huỷ rồi thử lại = 2 dòng). VNPay cấm dùng lại vnp_TxnRef trong ngày
CREATE TABLE PaymentTxn (
    paymentId     INT IDENTITY(1,1) PRIMARY KEY,
    txnRef        AS ('PK' + CAST(paymentId AS VARCHAR(10))) PERSISTED      -- vnp_TxnRef, tính từ id
                  CONSTRAINT UQ_PaymentTxn_txnRef UNIQUE,
    invoiceId     INT NOT NULL CONSTRAINT FK_PaymentTxn_Invoice REFERENCES Invoice(invoiceId),
    amount        DECIMAL(12,0) NOT NULL CONSTRAINT CK_PaymentTxn_amount CHECK (amount &gt; 0),   -- chép từ hoá đơn
    status        VARCHAR(10) NOT NULL CONSTRAINT DF_PaymentTxn_status DEFAULT 'PENDING'
                  CONSTRAINT CK_PaymentTxn_status CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    responseCode  VARCHAR(2)   NULL,                            -- vnp_ResponseCode nhận qua IPN (00, 24, 51…)
    gatewayTxnNo  VARCHAR(20)  NULL,                            -- vnp_TransactionNo, số giao dịch phía VNPay
    bankCode      VARCHAR(20)  NULL,
    createdAt     DATETIME2(0) NOT NULL CONSTRAINT DF_PaymentTxn_createdAt DEFAULT SYSDATETIME(),
    finishedAt    DATETIME2(0) NULL                             -- vnp_PayDate (giờ GMT+7)
);</code></pre>
<ul>
<li><code>txnRef</code> là cột <strong>tính toán, lưu sẵn</strong> (computed, persisted: <code>'PK' + paymentId</code>) có ràng buộc UNIQUE: nó không bao giờ lệch với id và không bao giờ trùng. DAO lấy nó về bằng <code>OUTPUT INSERTED.txnRef</code> ngay trong cùng câu lệnh INSERT:</li>
</ul>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/PaymentDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Lần thử mới, trạng thái PENDING. OUTPUT trả về txnRef đã tính ("PK" + id) ngay trong cùng một lượt gọi
public String createPending(int invoiceId, BigDecimal amount) throws SQLException {
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(
                 "INSERT INTO PaymentTxn (invoiceId, amount) OUTPUT INSERTED.txnRef VALUES (?, ?)")) {
        ps.setInt(1, invoiceId);
        ps.setBigDecimal(2, amount);
        try (ResultSet rs = ps.executeQuery()) { rs.next(); return rs.getString(1); }
    }
}</code></pre>
<ul>
<li><code>amount</code> chép từ hoá đơn lúc bắt đầu lần thử — IPN so số tiền VNPay báo với <em>con số này</em>.</li>
<li><code>status</code> PENDING → SUCCESS hoặc FAILED, ghi một lần duy nhất, bởi IPN. <code>Invoice.status</code> UNPAID → PAID đi theo một SUCCESS (sơ đồ trạng thái ở ASM.1).</li>
</ul>
<p>Báo cáo (ASM.6) và IPN đều cần chủ và trạng thái của hoá đơn, nên <code>InvoiceDAO</code> có thêm <code>findById</code> (kèm <code>patientId</code>) và <code>markPaid</code> — hàm này chạy trên <code>Connection</code> của bên gọi để nhập chung transaction của IPN:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/InvoiceDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Chạy TRONG transaction của bên gọi (cùng Connection). "AND status = 'UNPAID'" ⇒ gọi lần hai đổi 0 dòng
public boolean markPaid(Connection c, int invoiceId, String paymentRef, LocalDateTime paidAt) throws SQLException {
    try (PreparedStatement ps = c.prepareStatement(
            "UPDATE Invoice SET status = 'PAID', paidAt = ?, paymentRef = ? WHERE invoiceId = ? AND status = 'UNPAID'")) {
        ps.setObject(1, paidAt);
        ps.setString(2, paymentRef);
        ps.setInt(3, invoiceId);
        return ps.executeUpdate() == 1;
    }
}</code></pre>`),
    bi(`<h2>4. Going out: build and sign the payment URL</h2>
<p>The "Thanh toán (sandbox)" button is a POST form on each UNPAID row (a GET would create an attempt every time a link preview or a crawler opened it):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/patient/invoices.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;c:forEach items="&#36;{invoices}" var="i"&gt;&lt;tr&gt;&lt;td&gt;HD&#36;{i.id}&lt;/td&gt;&lt;td&gt;#&#36;{i.appointmentId}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{i.serviceName}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{i.dateText}&lt;/td&gt;
&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{i.amount}" pattern="#,##0"/&gt;&lt;/td&gt;&lt;td&gt;&lt;ui:statusBadge value="&#36;{i.status}"/&gt;&lt;/td&gt;
&lt;td&gt;&lt;c:choose&gt;&lt;c:when test="&#36;{i.paid}"&gt;&lt;small class="text-muted"&gt;&lt;c:out value="&#36;{i.paymentRef}"/&gt;&lt;/small&gt;&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;form method="post" action="&#36;{ctx}/patient/invoices/pay" class="d-inline"&gt;
&lt;input type="hidden" name="id" value="&#36;{i.id}"&gt;&lt;button class="btn btn-sm btn-primary"&gt;Thanh toán (sandbox)&lt;/button&gt;&lt;/form&gt;&lt;/c:otherwise&gt;&lt;/c:choose&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;&lt;c:if test="&#36;{empty invoices}"&gt;&lt;tr&gt;&lt;td colspan="7" class="text-center text-muted"&gt;Chưa có hoá đơn.&lt;/td&gt;&lt;/tr&gt;
&lt;/c:if&gt;</code></pre>
<p>The controller asks the business questions first — does the invoice exist, is it <strong>yours</strong> (the IDOR check of ASM.4, done here with the owner returned by <code>findById</code>), is it still unpaid — and only then builds the URL:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/PatientPaymentController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// PATIENT: "Thanh toán (sandbox)" — POST because it creates a payment attempt. Role: AuthorizationFilter (/patient/*). Owner: checked HERE
@WebServlet("/patient/invoices/pay")
public class PatientPaymentController extends HttpServlet {
    private final InvoiceDAO invoices = new InvoiceDAO();
    private final PaymentService payments = new PaymentService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Account me = Web.me(req);
        try {
            Invoice inv = invoices.findById(Web.parseInt(req.getParameter("id"), 0));
            if (inv == null) { resp.sendError(HttpServletResponse.SC_NOT_FOUND); return; }
            if (inv.getPatientId() != me.getId()) {                                  // IDOR on invoices
                System.out.println("PatientPaymentController: " + me.getUsername() + " tried invoice HD" + inv.getId() + " of account " + inv.getPatientId());
                Forbidden.send(req, resp, "Hoá đơn HD" + inv.getId() + " không phải của bạn.");
                return;
            }
            if (inv.isPaid()) {
                Web.flash(req, "danger", "Hoá đơn HD" + inv.getId() + " đã thanh toán rồi.");
                resp.sendRedirect(req.getContextPath() + "/patient/invoices");
                return;
            }
            VnpayConfig cfg = VnpayConfig.of(getServletContext());
            String url = payments.paymentUrl(inv, cfg, cfg.payUrl(req), cfg.returnUrl(req), req.getRemoteAddr(),
                    Clinic.now(getServletContext()));
            resp.sendRedirect(url);                                                  // 302 → the gateway
        } catch (SQLException e) {
            throw new ServletException(e);
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/PaymentService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public String paymentUrl(Invoice inv, VnpayConfig cfg, String payUrl, String returnUrl, String clientIp,
                         LocalDateTime now) throws SQLException {
    String txnRef = payments.createPending(inv.getId(), inv.getAmount());         // a NEW attempt each time
    Map&lt;String, String&gt; p = new HashMap&lt;&gt;();
    p.put("vnp_Version", "2.1.0");
    p.put("vnp_Command", "pay");
    p.put("vnp_TmnCode", cfg.tmnCode());
    p.put("vnp_Amount", inv.getAmount().movePointRight(2).toBigIntegerExact().toString());   // ×100: 180000 đ ⇒ "18000000"
    p.put("vnp_CurrCode", "VND");
    p.put("vnp_TxnRef", txnRef);
    p.put("vnp_OrderInfo", "Thanh toan hoa don HD" + inv.getId());               // no accents, no special characters
    p.put("vnp_OrderType", "other");
    p.put("vnp_Locale", "vn");
    p.put("vnp_ReturnUrl", returnUrl);
    p.put("vnp_IpAddr", clientIp);
    p.put("vnp_CreateDate", now.format(VNP_TIME));
    p.put("vnp_ExpireDate", now.plusMinutes(15).format(VNP_TIME));
    return payUrl + "?" + Vnpay.signedQuery(p, cfg.hashSecret());
}</code></pre>
<table>
<thead><tr><th>Parameter</th><th>Value here</th><th>Rule from the docs</th></tr></thead>
<tbody>
<tr><td>vnp_Version / vnp_Command</td><td>2.1.0 / pay</td><td>current API version; "pay" = payment</td></tr>
<tr><td>vnp_TmnCode</td><td>DEMO0001 (fake)</td><td>your website code</td></tr>
<tr><td>vnp_Amount</td><td>18000000</td><td>amount × 100, no separators: 180.000 đ ⇒ 18000000</td></tr>
<tr><td>vnp_CurrCode</td><td>VND</td><td>only VND is supported</td></tr>
<tr><td>vnp_TxnRef</td><td>PK1, PK2…</td><td>your reference, unique within the day</td></tr>
<tr><td>vnp_OrderInfo</td><td>Thanh toan hoa don HD3</td><td>Vietnamese WITHOUT accents, no special characters</td></tr>
<tr><td>vnp_OrderType</td><td>other</td><td>a code of VNPay's goods-category table (the sample uses "other")</td></tr>
<tr><td>vnp_Locale</td><td>vn</td><td>vn or en</td></tr>
<tr><td>vnp_ReturnUrl</td><td>…/vnpay/return</td><td>where the browser comes back</td></tr>
<tr><td>vnp_IpAddr</td><td>the client's IP</td><td>here 172.17.0.1, the Docker network</td></tr>
<tr><td>vnp_CreateDate / vnp_ExpireDate</td><td>20261105101500 / +15 min</td><td>yyyyMMddHHmmss, GMT+7</td></tr>
<tr><td>vnp_SecureHash</td><td>128 hex characters</td><td>HMAC-SHA512 of the hash data with your HashSecret</td></tr>
</tbody>
</table>
<p>The checksum is where most integrations fail, so here is the whole rule in one method — exactly what VNPay's Java sample does (<code>Collections.sort</code> of the names, <code>URLEncoder.encode(value, US_ASCII)</code>, empty values skipped, pairs joined with <code>&amp;</code>, HMAC-SHA512, hash appended last and <em>not</em> part of the signed data):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/payment/Vnpay.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// hashData = parameters sorted by name, empty values skipped, "name=URLEncode(value, US-ASCII)" joined by &amp;
public static String hashData(Map&lt;String, String&gt; fields) {
    StringBuilder sb = new StringBuilder();
    for (Map.Entry&lt;String, String&gt; e : new TreeMap&lt;&gt;(fields).entrySet()) {          // TreeMap = sorted by name
        String name = e.getKey(), value = e.getValue();
        if (value == null || value.isEmpty() || name.equals("vnp_SecureHash") || name.equals("vnp_SecureHashType")) continue;
        if (sb.length() &gt; 0) sb.append('&amp;');
        sb.append(name).append('=').append(enc(value));
    }
    return sb.toString();
}

public static String hmacSHA512(String secret, String data) {
    try {
        Mac mac = Mac.getInstance("HmacSHA512");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
        StringBuilder hex = new StringBuilder();
        for (byte b : mac.doFinal(data.getBytes(StandardCharsets.UTF_8))) hex.append(String.format("%02x", b));
        return hex.toString();                                                         // 128 hex characters
    } catch (GeneralSecurityException e) {
        throw new IllegalStateException(e);
    }
}

// The query string to send: the same pairs (names encoded too) + &amp;vnp_SecureHash=… at the END, outside the signed data
public static String signedQuery(Map&lt;String, String&gt; fields, String secret) {
    StringBuilder q = new StringBuilder();
    for (Map.Entry&lt;String, String&gt; e : new TreeMap&lt;&gt;(fields).entrySet()) {
        if (e.getValue() == null || e.getValue().isEmpty()) continue;
        if (q.length() &gt; 0) q.append('&amp;');
        q.append(enc(e.getKey())).append('=').append(enc(e.getValue()));
    }
    return q + "&amp;vnp_SecureHash=" + hmacSHA512(secret, hashData(fields));
}

// Recompute and compare in constant time. Called FIRST on every return/IPN, before trusting any value
public static boolean verify(Map&lt;String, String&gt; fields, String secret) {
    String got = fields.get("vnp_SecureHash");
    if (got == null) return false;
    String want = hmacSHA512(secret, hashData(fields));
    return MessageDigest.isEqual(want.getBytes(StandardCharsets.US_ASCII),
            got.toLowerCase(Locale.ROOT).getBytes(StandardCharsets.US_ASCII));
}</code></pre>
<div class="pitfall">Three classic "Sai chữ ký" causes: <strong>(1)</strong> signing the values <em>before</em> URL-encoding them while VNPay signs the encoded form — or the other way round; <strong>(2)</strong> forgetting to sort, or sorting with a <code>HashMap</code> (no order at all); <strong>(3)</strong> accents in <code>vnp_OrderInfo</code>: <code>URLEncoder.encode("Thanh toán", US_ASCII)</code> turns "á" into <code>%3F</code> ("?") — the URL and the signature no longer say what you think. That is why the docs require "Tiếng Việt không dấu".</div>
<div class="pitfall">Time zone: VNPay reads <code>vnp_CreateDate</code> as <strong>GMT+7</strong>. A server in UTC (our Docker container, most cloud VMs) using <code>LocalDateTime.now()</code> is 7 hours behind — the URL looks expired before it is created. Always <code>LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))</code>:</div>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/util/Clinic.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// VNPay wants every time in GMT+7. The container runs in UTC, so LocalDateTime.now() would be 7 hours off
public static final ZoneId VN = ZoneId.of("Asia/Ho_Chi_Minh");

public static LocalDateTime now(ServletContext ctx) {
    String pinned = ctx.getInitParameter("clinic.now");             // pinned for the lesson (web.xml)
    return pinned == null || pinned.isBlank() ? LocalDateTime.now(VN) : LocalDateTime.parse(pinned);
}</code></pre>
<p>bn.lan (logged in at the end of ASM.4's requests) first tries invoice HD2 — bn.khang's — by editing the hidden <code>id</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Hoá đơn HD2 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">PatientPaymentController: bn.lan tried invoice HD2 of account 8</div>
<p>Then her own HD3: a new attempt PK1, and a 302 to the gateway with every parameter visible and signed:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=18000000&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK1&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=beccc18cb5de5969990b77a204969026b0d7e502b44cf9666293ad83ca8f128b57f8561255710f9c3076d939727727b11133237ce74ff284d4d782ac6ee42a2a</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">VNPay: DEMO mode — fake gateway /vnpay-gia, made-up TmnCode DEMO0001 (set VNP_TMN_CODE + VNP_HASH_SECRET for the real sandbox)</div>`,
    `<h2>4. Đi ra: dựng và ký URL thanh toán</h2>
<p>Nút "Thanh toán (sandbox)" là một form POST trên mỗi dòng UNPAID (nếu là GET thì mỗi lần một bản xem trước link hay một con bot mở nó lại tạo ra một lần thử):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/patient/invoices.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;c:forEach items="&#36;{invoices}" var="i"&gt;&lt;tr&gt;&lt;td&gt;HD&#36;{i.id}&lt;/td&gt;&lt;td&gt;#&#36;{i.appointmentId}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{i.serviceName}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{i.dateText}&lt;/td&gt;
&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{i.amount}" pattern="#,##0"/&gt;&lt;/td&gt;&lt;td&gt;&lt;ui:statusBadge value="&#36;{i.status}"/&gt;&lt;/td&gt;
&lt;td&gt;&lt;c:choose&gt;&lt;c:when test="&#36;{i.paid}"&gt;&lt;small class="text-muted"&gt;&lt;c:out value="&#36;{i.paymentRef}"/&gt;&lt;/small&gt;&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;form method="post" action="&#36;{ctx}/patient/invoices/pay" class="d-inline"&gt;
&lt;input type="hidden" name="id" value="&#36;{i.id}"&gt;&lt;button class="btn btn-sm btn-primary"&gt;Thanh toán (sandbox)&lt;/button&gt;&lt;/form&gt;&lt;/c:otherwise&gt;&lt;/c:choose&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;&lt;c:if test="&#36;{empty invoices}"&gt;&lt;tr&gt;&lt;td colspan="7" class="text-center text-muted"&gt;Chưa có hoá đơn.&lt;/td&gt;&lt;/tr&gt;
&lt;/c:if&gt;</code></pre>
<p>Controller hỏi các câu nghiệp vụ trước — hoá đơn có tồn tại không, có phải <strong>của bạn</strong> không (phép kiểm IDOR của ASM.4, làm ở đây bằng chủ hoá đơn mà <code>findById</code> trả về), còn chưa trả không — rồi mới dựng URL:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/PatientPaymentController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// BỆNH NHÂN: "Thanh toán (sandbox)" — POST vì nó tạo một lần thử thanh toán. Vai trò: AuthorizationFilter (/patient/*). Chủ sở hữu: kiểm Ở ĐÂY
@WebServlet("/patient/invoices/pay")
public class PatientPaymentController extends HttpServlet {
    private final InvoiceDAO invoices = new InvoiceDAO();
    private final PaymentService payments = new PaymentService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Account me = Web.me(req);
        try {
            Invoice inv = invoices.findById(Web.parseInt(req.getParameter("id"), 0));
            if (inv == null) { resp.sendError(HttpServletResponse.SC_NOT_FOUND); return; }
            if (inv.getPatientId() != me.getId()) {                                  // IDOR trên hoá đơn
                System.out.println("PatientPaymentController: " + me.getUsername() + " tried invoice HD" + inv.getId() + " of account " + inv.getPatientId());
                Forbidden.send(req, resp, "Hoá đơn HD" + inv.getId() + " không phải của bạn.");
                return;
            }
            if (inv.isPaid()) {
                Web.flash(req, "danger", "Hoá đơn HD" + inv.getId() + " đã thanh toán rồi.");
                resp.sendRedirect(req.getContextPath() + "/patient/invoices");
                return;
            }
            VnpayConfig cfg = VnpayConfig.of(getServletContext());
            String url = payments.paymentUrl(inv, cfg, cfg.payUrl(req), cfg.returnUrl(req), req.getRemoteAddr(),
                    Clinic.now(getServletContext()));
            resp.sendRedirect(url);                                                  // 302 → cổng thanh toán
        } catch (SQLException e) {
            throw new ServletException(e);
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/PaymentService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public String paymentUrl(Invoice inv, VnpayConfig cfg, String payUrl, String returnUrl, String clientIp,
                         LocalDateTime now) throws SQLException {
    String txnRef = payments.createPending(inv.getId(), inv.getAmount());         // mỗi lần một lần thử MỚI
    Map&lt;String, String&gt; p = new HashMap&lt;&gt;();
    p.put("vnp_Version", "2.1.0");
    p.put("vnp_Command", "pay");
    p.put("vnp_TmnCode", cfg.tmnCode());
    p.put("vnp_Amount", inv.getAmount().movePointRight(2).toBigIntegerExact().toString());   // ×100: 180000 đ ⇒ "18000000"
    p.put("vnp_CurrCode", "VND");
    p.put("vnp_TxnRef", txnRef);
    p.put("vnp_OrderInfo", "Thanh toan hoa don HD" + inv.getId());               // không dấu, không ký tự đặc biệt
    p.put("vnp_OrderType", "other");
    p.put("vnp_Locale", "vn");
    p.put("vnp_ReturnUrl", returnUrl);
    p.put("vnp_IpAddr", clientIp);
    p.put("vnp_CreateDate", now.format(VNP_TIME));
    p.put("vnp_ExpireDate", now.plusMinutes(15).format(VNP_TIME));
    return payUrl + "?" + Vnpay.signedQuery(p, cfg.hashSecret());
}</code></pre>
<table>
<thead><tr><th>Tham số</th><th>Giá trị ở đây</th><th>Luật trong tài liệu</th></tr></thead>
<tbody>
<tr><td>vnp_Version / vnp_Command</td><td>2.1.0 / pay</td><td>phiên bản API hiện tại; "pay" = thanh toán</td></tr>
<tr><td>vnp_TmnCode</td><td>DEMO0001 (giả)</td><td>mã website của bạn</td></tr>
<tr><td>vnp_Amount</td><td>18000000</td><td>số tiền × 100, không dấu phân cách: 180.000 đ ⇒ 18000000</td></tr>
<tr><td>vnp_CurrCode</td><td>VND</td><td>chỉ hỗ trợ VND</td></tr>
<tr><td>vnp_TxnRef</td><td>PK1, PK2…</td><td>mã tham chiếu của bạn, không trùng trong ngày</td></tr>
<tr><td>vnp_OrderInfo</td><td>Thanh toan hoa don HD3</td><td>tiếng Việt KHÔNG dấu, không ký tự đặc biệt</td></tr>
<tr><td>vnp_OrderType</td><td>other</td><td>mã trong bảng loại hàng hoá của VNPay (code mẫu dùng "other")</td></tr>
<tr><td>vnp_Locale</td><td>vn</td><td>vn hoặc en</td></tr>
<tr><td>vnp_ReturnUrl</td><td>…/vnpay/return</td><td>nơi trình duyệt quay về</td></tr>
<tr><td>vnp_IpAddr</td><td>IP của khách</td><td>ở đây là 172.17.0.1, mạng của Docker</td></tr>
<tr><td>vnp_CreateDate / vnp_ExpireDate</td><td>20261105101500 / +15 phút</td><td>yyyyMMddHHmmss, giờ GMT+7</td></tr>
<tr><td>vnp_SecureHash</td><td>128 ký tự hex</td><td>HMAC-SHA512 của chuỗi dữ liệu băm với HashSecret của bạn</td></tr>
</tbody>
</table>
<p>Checksum là chỗ phần lớn các lần tích hợp hỏng, nên đây là trọn luật trong một phương thức — đúng như code mẫu Java của VNPay (<code>Collections.sort</code> các tên, <code>URLEncoder.encode(value, US_ASCII)</code>, bỏ giá trị rỗng, nối các cặp bằng <code>&amp;</code>, HMAC-SHA512, mã băm gắn ở CUỐI và <em>không</em> nằm trong dữ liệu được ký):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/payment/Vnpay.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// hashData = tham số xếp theo tên, bỏ giá trị rỗng, "tên=URLEncode(giá trị, US-ASCII)" nối bằng &amp;
public static String hashData(Map&lt;String, String&gt; fields) {
    StringBuilder sb = new StringBuilder();
    for (Map.Entry&lt;String, String&gt; e : new TreeMap&lt;&gt;(fields).entrySet()) {          // TreeMap = đã xếp theo tên
        String name = e.getKey(), value = e.getValue();
        if (value == null || value.isEmpty() || name.equals("vnp_SecureHash") || name.equals("vnp_SecureHashType")) continue;
        if (sb.length() &gt; 0) sb.append('&amp;');
        sb.append(name).append('=').append(enc(value));
    }
    return sb.toString();
}

public static String hmacSHA512(String secret, String data) {
    try {
        Mac mac = Mac.getInstance("HmacSHA512");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
        StringBuilder hex = new StringBuilder();
        for (byte b : mac.doFinal(data.getBytes(StandardCharsets.UTF_8))) hex.append(String.format("%02x", b));
        return hex.toString();                                                         // 128 ký tự hex
    } catch (GeneralSecurityException e) {
        throw new IllegalStateException(e);
    }
}

// Chuỗi truy vấn gửi đi: đúng các cặp đó (mã hoá cả tên) + &amp;vnp_SecureHash=… ở CUỐI, nằm ngoài dữ liệu được ký
public static String signedQuery(Map&lt;String, String&gt; fields, String secret) {
    StringBuilder q = new StringBuilder();
    for (Map.Entry&lt;String, String&gt; e : new TreeMap&lt;&gt;(fields).entrySet()) {
        if (e.getValue() == null || e.getValue().isEmpty()) continue;
        if (q.length() &gt; 0) q.append('&amp;');
        q.append(enc(e.getKey())).append('=').append(enc(e.getValue()));
    }
    return q + "&amp;vnp_SecureHash=" + hmacSHA512(secret, hashData(fields));
}

// Tính lại rồi so trong thời gian hằng định. Gọi ĐẦU TIÊN ở mọi return/IPN, trước khi tin bất kỳ giá trị nào
public static boolean verify(Map&lt;String, String&gt; fields, String secret) {
    String got = fields.get("vnp_SecureHash");
    if (got == null) return false;
    String want = hmacSHA512(secret, hashData(fields));
    return MessageDigest.isEqual(want.getBytes(StandardCharsets.US_ASCII),
            got.toLowerCase(Locale.ROOT).getBytes(StandardCharsets.US_ASCII));
}</code></pre>
<div class="pitfall">Ba nguyên nhân kinh điển của "Sai chữ ký": <strong>(1)</strong> ký giá trị <em>trước</em> khi mã hoá URL trong khi VNPay ký dạng đã mã hoá — hoặc ngược lại; <strong>(2)</strong> quên sắp xếp, hoặc "sắp xếp" bằng <code>HashMap</code> (không có thứ tự nào cả); <strong>(3)</strong> có dấu trong <code>vnp_OrderInfo</code>: <code>URLEncoder.encode("Thanh toán", US_ASCII)</code> biến "á" thành <code>%3F</code> (dấu "?") — URL và chữ ký không còn nói điều bạn nghĩ. Đó là lý do tài liệu bắt "Tiếng Việt không dấu".</div>
<div class="pitfall">Múi giờ: VNPay đọc <code>vnp_CreateDate</code> theo <strong>GMT+7</strong>. Server chạy giờ UTC (container Docker của chúng ta, đa số máy ảo cloud) mà dùng <code>LocalDateTime.now()</code> sẽ chậm 7 tiếng — URL trông như đã hết hạn trước cả khi được tạo. Luôn dùng <code>LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))</code>:</div>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/util/Clinic.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// VNPay đòi mọi mốc giờ theo GMT+7. Container chạy giờ UTC nên LocalDateTime.now() sẽ lệch 7 tiếng
public static final ZoneId VN = ZoneId.of("Asia/Ho_Chi_Minh");

public static LocalDateTime now(ServletContext ctx) {
    String pinned = ctx.getInitParameter("clinic.now");             // ghim cho bài học (web.xml)
    return pinned == null || pinned.isBlank() ? LocalDateTime.now(VN) : LocalDateTime.parse(pinned);
}</code></pre>
<p>bn.lan (đang đăng nhập từ cuối các request của ASM.4) thử trước hoá đơn HD2 — của bn.khang — bằng cách sửa ô ẩn <code>id</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;403 · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;div class="alert alert-danger"&gt;
&lt;h1 class="h4"&gt;403 — Không có quyền&lt;/h1&gt;
&lt;p class="mb-0"&gt;Hoá đơn HD2 không phải của bạn.&lt;/p&gt;
&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/"&gt;Về trang chủ&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">PatientPaymentController: bn.lan tried invoice HD2 of account 8</div>
<p>Rồi hoá đơn HD3 của chính mình: một lần thử mới PK1, và 302 sang cổng thanh toán với mọi tham số hiện rõ và đã ký:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=18000000&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK1&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=beccc18cb5de5969990b77a204969026b0d7e502b44cf9666293ad83ca8f128b57f8561255710f9c3076d939727727b11133237ce74ff284d4d782ac6ee42a2a</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">VNPay: DEMO mode — fake gateway /vnpay-gia, made-up TmnCode DEMO0001 (set VNP_TMN_CODE + VNP_HASH_SECRET for the real sandbox)</div>`),
    bi(`<h2>5. At the gateway (here: the fake one) — why the amount in the address bar cannot be edited</h2>
<p>The parameters travel in the address bar, in plain sight. Nothing stops the patient from changing <code>vnp_Amount=18000000</code> into <code>vnp_Amount=100</code>. What stops the <em>payment</em> is the checksum: the gateway recomputes HMAC-SHA512 over the parameters it received with the secret it shares with you, and the patient cannot produce a matching hash without the secret.</p>
<p>Our fake gateway does the same checks a real one must do, with its <strong>own</strong> copy of the signing code (two independent sides that agree only through the documented rule):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/vnpaygia/CongVnpayGia.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">for (String k : REQUIRED)
    if (p.get(k) == null || p.get(k).isEmpty()) { fail(req, resp, "Thiếu tham số " + k); return; }
if (!p.get("vnp_TmnCode").equals(tmnCode())) { fail(req, resp, "Mã website (vnp_TmnCode) không đúng"); return; }
if (!signatureOk(p)) { fail(req, resp, "Sai chữ ký (vnp_SecureHash)"); return; }
if (now().isAfter(LocalDateTime.parse(p.get("vnp_ExpireDate"), T))) { fail(req, resp, "Giao dịch đã quá thời gian chờ thanh toán"); return; }</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/vnpaygia/CongVnpayGia.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private boolean signatureOk(Map&lt;String, String&gt; p) {
    String want = hmac(secret(), hashData(p));
    return MessageDigest.isEqual(want.getBytes(StandardCharsets.US_ASCII), p.get("vnp_SecureHash").toLowerCase().getBytes(StandardCharsets.US_ASCII));
}

private static String hashData(Map&lt;String, String&gt; p) {                       // p is a TreeMap ⇒ sorted
    StringBuilder sb = new StringBuilder();
    p.forEach((k, v) -&gt; {
        if (v.isEmpty() || k.equals("vnp_SecureHash") || k.equals("vnp_SecureHashType")) return;
        if (sb.length() &gt; 0) sb.append('&amp;');
        sb.append(k).append('=').append(URLEncoder.encode(v, StandardCharsets.US_ASCII));
    });
    return sb.toString();
}</code></pre>
<p>The browser follows the 302 — the page shows the amount, the order and a card form:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=18000000&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK1&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=beccc18cb5de5969990b77a204969026b0d7e502b44cf9666293ad83ca8f128b57f8561255710f9c3076d939727727b11133237ce74ff284d4d782ac6ee42a2a HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Cổng VNPay GIẢ LẬP&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;/head&gt;
&lt;body class="bg-light"&gt;
&lt;main class="container py-4"&gt;
&lt;div class="alert alert-warning"&gt;⚠ CỔNG GIẢ LẬP chạy trong máy bạn — không phải VNPay, không có tiền thật.&lt;/div&gt;
&lt;div class="card"&gt;&lt;div class="card-body"&gt;
&lt;h1 class="h4"&gt;Thanh toán qua Ngân hàng NCB (giả lập)&lt;/h1&gt;
&lt;p class="mb-1"&gt;Đơn vị: DEMO0001 · Mã đơn: PK1 · Mã GD cổng: 14600001&lt;/p&gt;
&lt;p class="mb-1"&gt;Nội dung: Thanh toan hoa don HD3&lt;/p&gt;
&lt;p class="fs-5"&gt;Số tiền: &lt;strong&gt;180.000 VND&lt;/strong&gt;&lt;/p&gt;
&lt;form method="post" action="/phong-kham/vnpay-gia/xac-nhan"&gt;
&lt;input type="hidden" name="no" value="14600001"&gt;
&lt;div class="mb-2"&gt;&lt;label class="form-label" for="card"&gt;Số thẻ&lt;/label&gt;&lt;input class="form-control" id="card" name="card" inputmode="numeric"&gt;&lt;/div&gt;
&lt;div class="mb-2"&gt;&lt;label class="form-label" for="otp"&gt;Mã OTP&lt;/label&gt;&lt;input class="form-control" id="otp" name="otp" inputmode="numeric"&gt;&lt;/div&gt;
&lt;button class="btn btn-primary" name="action" value="pay"&gt;Thanh toán&lt;/button&gt;
&lt;button class="btn btn-outline-secondary" name="action" value="cancel"&gt;Huỷ giao dịch&lt;/button&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">VNPay GIẢ: nhận PK1, 18000000 (×100), chữ ký đúng ⇒ GD 14600001</div>
<p>The same URL with only <code>vnp_Amount</code> changed to <code>100</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=100&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK1&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=beccc18cb5de5969990b77a204969026b0d7e502b44cf9666293ad83ca8f128b57f8561255710f9c3076d939727727b11133237ce74ff284d4d782ac6ee42a2a HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Cổng VNPay GIẢ LẬP — lỗi&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Cổng VNPay GIẢ LẬP — giao dịch bị từ chối&lt;/h1&gt;
&lt;p&gt;Sai chữ ký (vnp_SecureHash)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">VNPay GIẢ: từ chối — Sai chữ ký (vnp_SecureHash)</div>
<p>When the customer presses a button, the gateway decides the result from the test card, calls your IPN <strong>first</strong>, then redirects the browser — the order a real gateway uses, so that the database is right before the patient sees anything:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/vnpaygia/CongVnpayGia.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The customer pressed "Thanh toán" or "Huỷ" on the gateway page
@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Map&lt;String, String&gt; p = pending.remove(String.valueOf(req.getParameter("no")));     // one-shot
    if (p == null) { fail(req, resp, "Phiên thanh toán không tồn tại hoặc đã kết thúc"); return; }
    String no = req.getParameter("no");
    String code = resultCode(req.getParameter("action"), req.getParameter("card"), req.getParameter("otp"), p);
    Map&lt;String, String&gt; r = new TreeMap&lt;&gt;();
    r.put("vnp_Amount", p.get("vnp_Amount"));
    r.put("vnp_BankCode", "NCB");
    if (code.equals("00")) r.put("vnp_BankTranNo", "VNP" + no);
    r.put("vnp_CardType", "ATM");
    r.put("vnp_OrderInfo", p.get("vnp_OrderInfo"));
    r.put("vnp_PayDate", now().format(T));
    r.put("vnp_ResponseCode", code);
    r.put("vnp_TmnCode", p.get("vnp_TmnCode"));
    r.put("vnp_TransactionNo", no);
    r.put("vnp_TransactionStatus", code.equals("00") ? "00" : "02");
    r.put("vnp_TxnRef", p.get("vnp_TxnRef"));
    String query = query(r) + "&amp;vnp_SecureHash=" + hmac(secret(), hashData(r));
    // 1) server → server: the IPN (the browser never sees it)
    try {
        HttpResponse&lt;String&gt; ipn = http.send(HttpRequest.newBuilder(URI.create(ipnUrl() + "?" + query))
                .timeout(Duration.ofSeconds(5)).GET().build(), HttpResponse.BodyHandlers.ofString());
        System.out.println("VNPay GIẢ: GD " + no + " mã " + code + " ⇒ gọi IPN, cửa hàng trả " + ipn.body());
    } catch (IOException | InterruptedException e) {
        System.out.println("VNPay GIẢ: IPN lỗi " + e + " (VNPay thật sẽ gọi lại sau)");
    }
    // 2) the browser goes back to the shop's return URL
    resp.sendRedirect(p.get("vnp_ReturnUrl") + "?" + query);
}

// Test cards of the VNPay sandbox docs (bank NCB)
private String resultCode(String action, String card, String otp, Map&lt;String, String&gt; p) {
    if ("cancel".equals(action)) return "24";
    if (now().isAfter(LocalDateTime.parse(p.get("vnp_ExpireDate"), T))) return "11";
    if ("9704198526191432198".equals(card)) return "123456".equals(otp) ? "00" : "13";
    if ("9704195798459170488".equals(card)) return "51";
    return "99";
}</code></pre>
<div class="callout">🔎 <strong>Honest limits of the fake.</strong> The real sandbox has several pages (choose a method, a bank, the card, then OTP) and its own wording; ours is one page. The docs we read do not say whether VNPay sends an IPN when the customer cancels; our fake does (code 24). Your code must be right either way: the return page never writes, so an attempt without an IPN simply stays PENDING and the invoice UNPAID — the patient can try again.</div>`,
    `<h2>5. Ở cổng thanh toán (ở đây: cổng giả) — vì sao không sửa được số tiền trên thanh địa chỉ</h2>
<p>Các tham số đi trên thanh địa chỉ, ai cũng nhìn thấy. Không gì ngăn bệnh nhân sửa <code>vnp_Amount=18000000</code> thành <code>vnp_Amount=100</code>. Thứ ngăn được <em>việc thanh toán</em> là checksum: cổng tính lại HMAC-SHA512 trên các tham số nó nhận với secret mà nó dùng chung với bạn, và bệnh nhân không thể tạo ra mã băm khớp khi không có secret.</p>
<p>Cổng giả của chúng ta làm đúng các phép kiểm mà cổng thật phải làm, với bản code ký <strong>riêng</strong> của nó (hai bên độc lập, chỉ khớp nhau qua luật trong tài liệu):</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/vnpaygia/CongVnpayGia.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">for (String k : REQUIRED)
    if (p.get(k) == null || p.get(k).isEmpty()) { fail(req, resp, "Thiếu tham số " + k); return; }
if (!p.get("vnp_TmnCode").equals(tmnCode())) { fail(req, resp, "Mã website (vnp_TmnCode) không đúng"); return; }
if (!signatureOk(p)) { fail(req, resp, "Sai chữ ký (vnp_SecureHash)"); return; }
if (now().isAfter(LocalDateTime.parse(p.get("vnp_ExpireDate"), T))) { fail(req, resp, "Giao dịch đã quá thời gian chờ thanh toán"); return; }</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/vnpaygia/CongVnpayGia.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private boolean signatureOk(Map&lt;String, String&gt; p) {
    String want = hmac(secret(), hashData(p));
    return MessageDigest.isEqual(want.getBytes(StandardCharsets.US_ASCII), p.get("vnp_SecureHash").toLowerCase().getBytes(StandardCharsets.US_ASCII));
}

private static String hashData(Map&lt;String, String&gt; p) {                       // p là TreeMap ⇒ đã xếp
    StringBuilder sb = new StringBuilder();
    p.forEach((k, v) -&gt; {
        if (v.isEmpty() || k.equals("vnp_SecureHash") || k.equals("vnp_SecureHashType")) return;
        if (sb.length() &gt; 0) sb.append('&amp;');
        sb.append(k).append('=').append(URLEncoder.encode(v, StandardCharsets.US_ASCII));
    });
    return sb.toString();
}</code></pre>
<p>Trình duyệt đi theo 302 — trang hiện số tiền, mã đơn và form nhập thẻ:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=18000000&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK1&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=beccc18cb5de5969990b77a204969026b0d7e502b44cf9666293ad83ca8f128b57f8561255710f9c3076d939727727b11133237ce74ff284d4d782ac6ee42a2a HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Cổng VNPay GIẢ LẬP&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;/head&gt;
&lt;body class="bg-light"&gt;
&lt;main class="container py-4"&gt;
&lt;div class="alert alert-warning"&gt;⚠ CỔNG GIẢ LẬP chạy trong máy bạn — không phải VNPay, không có tiền thật.&lt;/div&gt;
&lt;div class="card"&gt;&lt;div class="card-body"&gt;
&lt;h1 class="h4"&gt;Thanh toán qua Ngân hàng NCB (giả lập)&lt;/h1&gt;
&lt;p class="mb-1"&gt;Đơn vị: DEMO0001 · Mã đơn: PK1 · Mã GD cổng: 14600001&lt;/p&gt;
&lt;p class="mb-1"&gt;Nội dung: Thanh toan hoa don HD3&lt;/p&gt;
&lt;p class="fs-5"&gt;Số tiền: &lt;strong&gt;180.000 VND&lt;/strong&gt;&lt;/p&gt;
&lt;form method="post" action="/phong-kham/vnpay-gia/xac-nhan"&gt;
&lt;input type="hidden" name="no" value="14600001"&gt;
&lt;div class="mb-2"&gt;&lt;label class="form-label" for="card"&gt;Số thẻ&lt;/label&gt;&lt;input class="form-control" id="card" name="card" inputmode="numeric"&gt;&lt;/div&gt;
&lt;div class="mb-2"&gt;&lt;label class="form-label" for="otp"&gt;Mã OTP&lt;/label&gt;&lt;input class="form-control" id="otp" name="otp" inputmode="numeric"&gt;&lt;/div&gt;
&lt;button class="btn btn-primary" name="action" value="pay"&gt;Thanh toán&lt;/button&gt;
&lt;button class="btn btn-outline-secondary" name="action" value="cancel"&gt;Huỷ giao dịch&lt;/button&gt;
&lt;/form&gt;
&lt;/div&gt;&lt;/div&gt;
&lt;/main&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">VNPay GIẢ: nhận PK1, 18000000 (×100), chữ ký đúng ⇒ GD 14600001</div>
<p>Cùng URL đó, chỉ đổi <code>vnp_Amount</code> thành <code>100</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=100&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK1&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=beccc18cb5de5969990b77a204969026b0d7e502b44cf9666293ad83ca8f128b57f8561255710f9c3076d939727727b11133237ce74ff284d4d782ac6ee42a2a HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Cổng VNPay GIẢ LẬP — lỗi&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Cổng VNPay GIẢ LẬP — giao dịch bị từ chối&lt;/h1&gt;
&lt;p&gt;Sai chữ ký (vnp_SecureHash)&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">VNPay GIẢ: từ chối — Sai chữ ký (vnp_SecureHash)</div>
<p>Khi khách bấm nút, cổng quyết định kết quả theo thẻ test, gọi IPN của bạn <strong>trước</strong>, rồi mới chuyển hướng trình duyệt — đúng thứ tự cổng thật dùng, để CSDL đã đúng trước khi bệnh nhân nhìn thấy gì:</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/vnpaygia/CongVnpayGia.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Khách bấm "Thanh toán" hoặc "Huỷ" trên trang của cổng
@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Map&lt;String, String&gt; p = pending.remove(String.valueOf(req.getParameter("no")));     // dùng một lần
    if (p == null) { fail(req, resp, "Phiên thanh toán không tồn tại hoặc đã kết thúc"); return; }
    String no = req.getParameter("no");
    String code = resultCode(req.getParameter("action"), req.getParameter("card"), req.getParameter("otp"), p);
    Map&lt;String, String&gt; r = new TreeMap&lt;&gt;();
    r.put("vnp_Amount", p.get("vnp_Amount"));
    r.put("vnp_BankCode", "NCB");
    if (code.equals("00")) r.put("vnp_BankTranNo", "VNP" + no);
    r.put("vnp_CardType", "ATM");
    r.put("vnp_OrderInfo", p.get("vnp_OrderInfo"));
    r.put("vnp_PayDate", now().format(T));
    r.put("vnp_ResponseCode", code);
    r.put("vnp_TmnCode", p.get("vnp_TmnCode"));
    r.put("vnp_TransactionNo", no);
    r.put("vnp_TransactionStatus", code.equals("00") ? "00" : "02");
    r.put("vnp_TxnRef", p.get("vnp_TxnRef"));
    String query = query(r) + "&amp;vnp_SecureHash=" + hmac(secret(), hashData(r));
    // 1) server → server: IPN (trình duyệt không bao giờ thấy)
    try {
        HttpResponse&lt;String&gt; ipn = http.send(HttpRequest.newBuilder(URI.create(ipnUrl() + "?" + query))
                .timeout(Duration.ofSeconds(5)).GET().build(), HttpResponse.BodyHandlers.ofString());
        System.out.println("VNPay GIẢ: GD " + no + " mã " + code + " ⇒ gọi IPN, cửa hàng trả " + ipn.body());
    } catch (IOException | InterruptedException e) {
        System.out.println("VNPay GIẢ: IPN lỗi " + e + " (VNPay thật sẽ gọi lại sau)");
    }
    // 2) trình duyệt quay về return URL của cửa hàng
    resp.sendRedirect(p.get("vnp_ReturnUrl") + "?" + query);
}

// Thẻ test trong tài liệu sandbox VNPay (ngân hàng NCB)
private String resultCode(String action, String card, String otp, Map&lt;String, String&gt; p) {
    if ("cancel".equals(action)) return "24";
    if (now().isAfter(LocalDateTime.parse(p.get("vnp_ExpireDate"), T))) return "11";
    if ("9704198526191432198".equals(card)) return "123456".equals(otp) ? "00" : "13";
    if ("9704195798459170488".equals(card)) return "51";
    return "99";
}</code></pre>
<div class="callout">🔎 <strong>Giới hạn thật thà của cổng giả.</strong> Sandbox thật có nhiều trang (chọn phương thức, chọn ngân hàng, nhập thẻ, rồi OTP) và câu chữ riêng; cổng của chúng ta chỉ một trang. Tài liệu chúng ta đọc không nói VNPay có gửi IPN khi khách bấm huỷ hay không; cổng giả thì có (mã 24). Code của bạn phải đúng trong cả hai trường hợp: trang return không bao giờ ghi, nên một lần thử không có IPN đơn giản là nằm lại PENDING và hoá đơn vẫn UNPAID — bệnh nhân thử lại được.</div>`),
    bi(`<h2>6. Coming back, part 1: the IPN — the only place that writes PAID</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f559d524e19f7d2351cac9ab18af3d94135d841a.svg" alt="The IPN handler: the checks in the order of the VNPay docs, each failure with its own RspCode" loading="lazy" /><p class="chu-thich">🧩 The IPN handler: the checks in the order of the VNPay docs, each failure with its own RspCode</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title IPN /vnpay/ipn: the order of checks of the VNPay docs, one answer each
start
:f = every vnp_* parameter;
if (checksum recomputed == vnp_SecureHash?) then (no)
  :97 Invalid Checksum;
  stop
endif
:t = PaymentTxn WHERE txnRef = vnp_TxnRef;
if (t exists?) then (no)
  :01 Order not Found;
  stop
endif
if (vnp_Amount / 100 == t.amount?) then (no)
  :04 Invalid Amount;
  stop
endif
if (t.status == PENDING?) then (no)
  :02 Order already confirmed\\n(second IPN: nothing changes);
  stop
endif
:ok = ResponseCode 00 and TransactionStatus 00;
:BEGIN TRAN\\nUPDATE PaymentTxn … WHERE txnRef = ? AND status = 'PENDING'\\nif ok: UPDATE Invoice SET PAID … WHERE status = 'UNPAID'\\nCOMMIT;
if (1 row updated?) then (no: a parallel IPN won)
  :02 Order already confirmed;
  stop
endif
:00 Confirm Success;
stop
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/VnpayIpnController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// IPN: VNPay's SERVER calls this URL (no browser, no session, no cookie). The ONLY place that writes the payment result
@WebServlet("/vnpay/ipn")
public class VnpayIpnController extends HttpServlet {
    private final PaymentService payments = new PaymentService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map&lt;String, String&gt; f = Vnpay.fields(req);
        String answer;
        try {
            answer = payments.ipn(f, VnpayConfig.of(getServletContext()));
        } catch (Exception e) {                                       // never a 500 page: VNPay expects JSON
            System.out.println("IPN error: " + e);
            answer = "{\\"RspCode\\":\\"99\\",\\"Message\\":\\"Unknown error\\"}";
        }
        System.out.println("IPN " + f.get("vnp_TxnRef") + " code=" + f.get("vnp_ResponseCode") + " ⇒ " + answer);
        resp.setContentType("application/json;charset=UTF-8");
        resp.getWriter().write(answer);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/PaymentService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The order of checks of the VNPay docs: checksum → order exists → amount → still pending → update → answer
public String ipn(Map&lt;String, String&gt; f, VnpayConfig cfg) throws SQLException {
    if (!Vnpay.verify(f, cfg.hashSecret())) return rsp("97", "Invalid Checksum");
    PaymentTxn t = payments.findByTxnRef(f.get("vnp_TxnRef"));
    if (t == null) return rsp("01", "Order not Found");
    BigDecimal paid;
    try { paid = new BigDecimal(f.get("vnp_Amount")).movePointLeft(2); } catch (RuntimeException e) { paid = null; }
    if (paid == null || paid.compareTo(t.getAmount()) != 0) return rsp("04", "Invalid Amount");
    if (!PaymentTxn.PENDING.equals(t.getStatus())) return rsp("02", "Order already confirmed");
    boolean ok = "00".equals(f.get("vnp_ResponseCode")) &amp;&amp; "00".equals(f.get("vnp_TransactionStatus"));
    if (!payments.finish(t, ok, f.get("vnp_ResponseCode"), f.get("vnp_TransactionNo"), f.get("vnp_BankCode"), payDate(f)))
        return rsp("02", "Order already confirmed");                              // a parallel IPN won the UPDATE
    return rsp("00", "Confirm Success");
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/PaymentDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// ONE transaction: close the attempt (only if still PENDING) and, on success, mark the invoice PAID
// false = another call closed it first ⇒ the IPN answers "02 already confirmed"
public boolean finish(PaymentTxn t, boolean success, String responseCode, String gatewayTxnNo, String bankCode,
                      LocalDateTime payDate) throws SQLException {
    try (Connection c = DBContext.getConnection()) {
        c.setAutoCommit(false);
        try {
            int n;
            try (PreparedStatement ps = c.prepareStatement("UPDATE PaymentTxn SET status = ?, responseCode = ?, gatewayTxnNo = ?, "
                    + "bankCode = ?, finishedAt = ? WHERE txnRef = ? AND status = 'PENDING'")) {
                ps.setString(1, success ? PaymentTxn.SUCCESS : PaymentTxn.FAILED);
                ps.setString(2, responseCode);
                ps.setString(3, gatewayTxnNo);
                ps.setString(4, bankCode);
                ps.setObject(5, payDate);
                ps.setString(6, t.getTxnRef());
                n = ps.executeUpdate();
            }
            if (n != 1) { c.rollback(); return false; }            // lost the race: someone closed it first
            if (success &amp;&amp; !invoices.markPaid(c, t.getInvoiceId(), "VNPAY-" + gatewayTxnNo, payDate))
                // the invoice was ALREADY paid by another attempt (two tabs): money taken twice ⇒ keep the record, refund by hand
                System.out.println("PaymentDAO: WARNING " + t.getTxnRef() + " paid but invoice HD" + t.getInvoiceId() + " was already PAID — refund needed");
            c.commit();
            return true;
        } catch (SQLException e) {
            c.rollback();
            throw e;
        }
    }
}</code></pre>
<p>The answer is JSON, never an HTML error page — VNPay reads <code>RspCode</code>:</p>
<table>
<thead><tr><th>RspCode</th><th>Message (VNPay Java sample)</th><th>When</th><th>VNPay then…</th></tr></thead>
<tbody>
<tr><td>00</td><td>Confirm Success</td><td>the result is recorded (success OR failure)</td><td>stops</td></tr>
<tr><td>02</td><td>Order already confirmed</td><td>this attempt was already closed</td><td>stops</td></tr>
<tr><td>01</td><td>Order not Found</td><td>unknown vnp_TxnRef</td><td>retries</td></tr>
<tr><td>04</td><td>Invalid Amount</td><td>amount ≠ the attempt's amount</td><td>retries</td></tr>
<tr><td>97</td><td>Invalid Checksum</td><td>signature wrong</td><td>retries</td></tr>
<tr><td>99</td><td>Unknown error</td><td>exception on your side</td><td>retries</td></tr>
</tbody>
</table>
<p>The docs: codes 00 and 02 end the exchange; 01, 04, 97, 99 or a timeout make VNPay call again, <strong>up to 10 times, 5 minutes apart</strong>. Retries are why the handler must be <strong>idempotent</strong> — calling it twice must have the effect of calling it once. Two guards make it so: the status check (<code>02</code> if not PENDING) and, for two IPNs arriving at the same millisecond, <code>UPDATE … WHERE txnRef = ? AND status = 'PENDING'</code> — only one of them can change that row; the loser rolls back and answers 02.</p>
<p>The customer cancels at the gateway (PK1): the IPN records FAILED with code 24 — both log lines come from one request, the gateway's and then our handler's:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/vnpay-gia/xac-nhan HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 36

no=14600001&amp;card=&amp;otp=&amp;action=cancel</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=24&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=02&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">IPN PK1 code=24 ⇒ {"RspCode":"00","Message":"Confirm Success"}<br>
VNPay GIẢ: GD 14600001 mã 24 ⇒ gọi IPN, cửa hàng trả {"RspCode":"00","Message":"Confirm Success"}</div>
<p>He tries again — attempt PK2 — and pays with the test card <code>9704198526191432198</code> + OTP <code>123456</code>. The IPN marks HD3 PAID in one transaction, then the browser is redirected:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=18000000&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK2&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=6288473e3512853f23fcc5c5fd7cdc8556e6032328c818be3c05cb6b36617c1dda5330c0867a4319a283bee872902c183df760edc255bf2a677823bef43e9f6e</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/vnpay-gia/xac-nhan HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 58

no=14600002&amp;card=9704198526191432198&amp;otp=123456&amp;action=pay</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=b8f4cf963b17e3e1548cd0c5709d37a0889085529c8e228a73f760bd3df99671870dc7b54143491729e1eed2f23c25fc6dbc649b34ba4e2c1c2a85432ee6c6a9</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">IPN PK2 code=00 ⇒ {"RspCode":"00","Message":"Confirm Success"}<br>
VNPay GIẢ: GD 14600002 mã 00 ⇒ gọi IPN, cửa hàng trả {"RspCode":"00","Message":"Confirm Success"}</div>
<p>Now the attacks, sent the way VNPay's server would (no cookie). The same success IPN a second time — nothing is paid twice:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=b8f4cf963b17e3e1548cd0c5709d37a0889085529c8e228a73f760bd3df99671870dc7b54143491729e1eed2f23c25fc6dbc649b34ba4e2c1c2a85432ee6c6a9 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"02","Message":"Order already confirmed"}</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">IPN PK2 code=00 ⇒ {"RspCode":"02","Message":"Order already confirmed"}</div>
<p>PK1 was cancelled. Change its <code>vnp_ResponseCode=24</code> → <code>00</code> and <code>vnp_TransactionStatus=02</code> → <code>00</code>, keep the old hash:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"97","Message":"Invalid Checksum"}</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">IPN PK1 code=00 ⇒ {"RspCode":"97","Message":"Invalid Checksum"}</div>
<p>A <em>correctly signed</em> IPN whose amount is 100.000 đ instead of 180.000 đ (we signed it by hand with the demo secret — only someone holding the secret can do this, so in real life this branch catches <em>your own</em> bug, such as forgetting ×100, or a leaked secret):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=10000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=f3fe5f8d90821b86d193f5046d908b029fe83447dc189173bccc382198c3c68ff32afb68f484fe449b37ab025e04ff8d67f957d54ef3084c677a5c6fa95b807e HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"04","Message":"Invalid Amount"}</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">IPN PK2 code=00 ⇒ {"RspCode":"04","Message":"Invalid Amount"}</div>
<p>A signed IPN for an order we never created:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600099&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600099&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK99&amp;vnp_SecureHash=46529c6749807ef40e1d39798401cb62d09ae5c19cb4f0e91b2c349618fc17211abd49eebaff94b08211b37af2b27875ccbaaf09b367569f3b06b17da316edcf HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"01","Message":"Order not Found"}</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">IPN PK99 code=00 ⇒ {"RspCode":"01","Message":"Order not Found"}</div>
<div class="pitfall">Which field means "paid"? The VNPay Java sample checks only <code>vnp_ResponseCode == "00"</code>; the C# sample requires <code>vnp_ResponseCode</code> AND <code>vnp_TransactionStatus</code> to be <code>"00"</code>. We take the stricter rule. Never decide from the return URL alone, and never from a parameter your own page added.</div>`,
    `<h2>6. Quay về, phần 1: IPN — chỗ duy nhất ghi PAID</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f559d524e19f7d2351cac9ab18af3d94135d841a.svg" alt="Bộ xử lý IPN: các phép kiểm theo đúng thứ tự trong tài liệu VNPay, mỗi lỗi một RspCode riêng" loading="lazy" /><p class="chu-thich">🧩 Bộ xử lý IPN: các phép kiểm theo đúng thứ tự trong tài liệu VNPay, mỗi lỗi một RspCode riêng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title IPN /vnpay/ipn: the order of checks of the VNPay docs, one answer each
start
:f = every vnp_* parameter;
if (checksum recomputed == vnp_SecureHash?) then (no)
  :97 Invalid Checksum;
  stop
endif
:t = PaymentTxn WHERE txnRef = vnp_TxnRef;
if (t exists?) then (no)
  :01 Order not Found;
  stop
endif
if (vnp_Amount / 100 == t.amount?) then (no)
  :04 Invalid Amount;
  stop
endif
if (t.status == PENDING?) then (no)
  :02 Order already confirmed\\n(second IPN: nothing changes);
  stop
endif
:ok = ResponseCode 00 and TransactionStatus 00;
:BEGIN TRAN\\nUPDATE PaymentTxn … WHERE txnRef = ? AND status = 'PENDING'\\nif ok: UPDATE Invoice SET PAID … WHERE status = 'UNPAID'\\nCOMMIT;
if (1 row updated?) then (no: a parallel IPN won)
  :02 Order already confirmed;
  stop
endif
:00 Confirm Success;
stop
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/VnpayIpnController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// IPN: SERVER của VNPay gọi URL này (không trình duyệt, không session, không cookie). Chỗ DUY NHẤT ghi kết quả thanh toán
@WebServlet("/vnpay/ipn")
public class VnpayIpnController extends HttpServlet {
    private final PaymentService payments = new PaymentService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Map&lt;String, String&gt; f = Vnpay.fields(req);
        String answer;
        try {
            answer = payments.ipn(f, VnpayConfig.of(getServletContext()));
        } catch (Exception e) {                                       // không bao giờ trang 500: VNPay chờ JSON
            System.out.println("IPN error: " + e);
            answer = "{\\"RspCode\\":\\"99\\",\\"Message\\":\\"Unknown error\\"}";
        }
        System.out.println("IPN " + f.get("vnp_TxnRef") + " code=" + f.get("vnp_ResponseCode") + " ⇒ " + answer);
        resp.setContentType("application/json;charset=UTF-8");
        resp.getWriter().write(answer);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/service/PaymentService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Thứ tự kiểm theo tài liệu VNPay: checksum → có đơn → số tiền → còn chờ → cập nhật → trả lời
public String ipn(Map&lt;String, String&gt; f, VnpayConfig cfg) throws SQLException {
    if (!Vnpay.verify(f, cfg.hashSecret())) return rsp("97", "Invalid Checksum");
    PaymentTxn t = payments.findByTxnRef(f.get("vnp_TxnRef"));
    if (t == null) return rsp("01", "Order not Found");
    BigDecimal paid;
    try { paid = new BigDecimal(f.get("vnp_Amount")).movePointLeft(2); } catch (RuntimeException e) { paid = null; }
    if (paid == null || paid.compareTo(t.getAmount()) != 0) return rsp("04", "Invalid Amount");
    if (!PaymentTxn.PENDING.equals(t.getStatus())) return rsp("02", "Order already confirmed");
    boolean ok = "00".equals(f.get("vnp_ResponseCode")) &amp;&amp; "00".equals(f.get("vnp_TransactionStatus"));
    if (!payments.finish(t, ok, f.get("vnp_ResponseCode"), f.get("vnp_TransactionNo"), f.get("vnp_BankCode"), payDate(f)))
        return rsp("02", "Order already confirmed");                              // một IPN song song đã thắng câu UPDATE
    return rsp("00", "Confirm Success");
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/PaymentDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// MỘT transaction: đóng lần thử (chỉ khi còn PENDING) và, nếu thành công, đánh dấu hoá đơn PAID
// false = lần gọi khác đã đóng trước ⇒ IPN trả "02 đã xác nhận"
public boolean finish(PaymentTxn t, boolean success, String responseCode, String gatewayTxnNo, String bankCode,
                      LocalDateTime payDate) throws SQLException {
    try (Connection c = DBContext.getConnection()) {
        c.setAutoCommit(false);
        try {
            int n;
            try (PreparedStatement ps = c.prepareStatement("UPDATE PaymentTxn SET status = ?, responseCode = ?, gatewayTxnNo = ?, "
                    + "bankCode = ?, finishedAt = ? WHERE txnRef = ? AND status = 'PENDING'")) {
                ps.setString(1, success ? PaymentTxn.SUCCESS : PaymentTxn.FAILED);
                ps.setString(2, responseCode);
                ps.setString(3, gatewayTxnNo);
                ps.setString(4, bankCode);
                ps.setObject(5, payDate);
                ps.setString(6, t.getTxnRef());
                n = ps.executeUpdate();
            }
            if (n != 1) { c.rollback(); return false; }            // thua cuộc đua: có người đóng trước rồi
            if (success &amp;&amp; !invoices.markPaid(c, t.getInvoiceId(), "VNPAY-" + gatewayTxnNo, payDate))
                // hoá đơn ĐÃ được trả bởi lần thử khác (hai tab): thu tiền hai lần ⇒ giữ bản ghi, hoàn tiền thủ công
                System.out.println("PaymentDAO: WARNING " + t.getTxnRef() + " paid but invoice HD" + t.getInvoiceId() + " was already PAID — refund needed");
            c.commit();
            return true;
        } catch (SQLException e) {
            c.rollback();
            throw e;
        }
    }
}</code></pre>
<p>Câu trả lời là JSON, không bao giờ là trang lỗi HTML — VNPay đọc <code>RspCode</code>:</p>
<table>
<thead><tr><th>RspCode</th><th>Message (code mẫu Java của VNPay)</th><th>Khi nào</th><th>Sau đó VNPay…</th></tr></thead>
<tbody>
<tr><td>00</td><td>Confirm Success</td><td>đã ghi nhận kết quả (thành công HOẶC thất bại)</td><td>dừng</td></tr>
<tr><td>02</td><td>Order already confirmed</td><td>lần thử này đã đóng trước đó</td><td>dừng</td></tr>
<tr><td>01</td><td>Order not Found</td><td>vnp_TxnRef lạ</td><td>gọi lại</td></tr>
<tr><td>04</td><td>Invalid Amount</td><td>số tiền ≠ số tiền của lần thử</td><td>gọi lại</td></tr>
<tr><td>97</td><td>Invalid Checksum</td><td>sai chữ ký</td><td>gọi lại</td></tr>
<tr><td>99</td><td>Unknown error</td><td>lỗi phía bạn</td><td>gọi lại</td></tr>
</tbody>
</table>
<p>Tài liệu: mã 00 và 02 kết thúc trao đổi; 01, 04, 97, 99 hoặc quá thời gian chờ khiến VNPay gọi lại, <strong>tối đa 10 lần, cách nhau 5 phút</strong>. Chính việc gọi lại là lý do bộ xử lý phải <strong>idempotent</strong> (luỹ đẳng — gọi hai lần có tác dụng như gọi một lần). Hai lớp bảo đảm điều đó: phép kiểm trạng thái (<code>02</code> nếu không còn PENDING) và, khi hai IPN tới cùng một mili giây, <code>UPDATE … WHERE txnRef = ? AND status = 'PENDING'</code> — chỉ một trong hai đổi được dòng đó; bên thua rollback và trả 02.</p>
<p>Khách huỷ ở cổng (PK1): IPN ghi FAILED với mã 24 — cả hai dòng log đến từ một request, của cổng rồi của bộ xử lý của chúng ta:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/vnpay-gia/xac-nhan HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 36

no=14600001&amp;card=&amp;otp=&amp;action=cancel</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=24&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=02&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">IPN PK1 code=24 ⇒ {"RspCode":"00","Message":"Confirm Success"}<br>
VNPay GIẢ: GD 14600001 mã 24 ⇒ gọi IPN, cửa hàng trả {"RspCode":"00","Message":"Confirm Success"}</div>
<p>Khách thử lại — lần thử PK2 — và trả bằng thẻ test <code>9704198526191432198</code> + OTP <code>123456</code>. IPN đánh dấu HD3 PAID trong một transaction, rồi trình duyệt mới được chuyển hướng:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay-gia/paymentv2/vpcpay.html?vnp_Amount=18000000&amp;vnp_Command=pay&amp;vnp_CreateDate=20261105101500&amp;vnp_CurrCode=VND&amp;vnp_ExpireDate=20261105103000&amp;vnp_IpAddr=172.17.0.1&amp;vnp_Locale=vn&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_OrderType=other&amp;vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fphong-kham%2Fvnpay%2Freturn&amp;vnp_TmnCode=DEMO0001&amp;vnp_TxnRef=PK2&amp;vnp_Version=2.1.0&amp;vnp_SecureHash=6288473e3512853f23fcc5c5fd7cdc8556e6032328c818be3c05cb6b36617c1dda5330c0867a4319a283bee872902c183df760edc255bf2a677823bef43e9f6e</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/vnpay-gia/xac-nhan HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 58

no=14600002&amp;card=9704198526191432198&amp;otp=123456&amp;action=pay</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: http://localhost:8080/phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=b8f4cf963b17e3e1548cd0c5709d37a0889085529c8e228a73f760bd3df99671870dc7b54143491729e1eed2f23c25fc6dbc649b34ba4e2c1c2a85432ee6c6a9</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">IPN PK2 code=00 ⇒ {"RspCode":"00","Message":"Confirm Success"}<br>
VNPay GIẢ: GD 14600002 mã 00 ⇒ gọi IPN, cửa hàng trả {"RspCode":"00","Message":"Confirm Success"}</div>
<p>Giờ tới các đòn tấn công, gửi theo cách server của VNPay gửi (không cookie). Cùng IPN thành công gửi lần hai — không có gì bị trả hai lần:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=b8f4cf963b17e3e1548cd0c5709d37a0889085529c8e228a73f760bd3df99671870dc7b54143491729e1eed2f23c25fc6dbc649b34ba4e2c1c2a85432ee6c6a9 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"02","Message":"Order already confirmed"}</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">IPN PK2 code=00 ⇒ {"RspCode":"02","Message":"Order already confirmed"}</div>
<p>PK1 đã bị huỷ. Sửa <code>vnp_ResponseCode=24</code> → <code>00</code> và <code>vnp_TransactionStatus=02</code> → <code>00</code>, giữ mã băm cũ:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"97","Message":"Invalid Checksum"}</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">IPN PK1 code=00 ⇒ {"RspCode":"97","Message":"Invalid Checksum"}</div>
<p>Một IPN <em>ký đúng</em> nhưng số tiền là 100.000 đ thay vì 180.000 đ (chúng ta ký tay bằng secret demo — chỉ ai giữ secret mới làm được, nên ngoài đời nhánh này bắt lỗi <em>của chính bạn</em>, như quên ×100, hoặc secret đã bị lộ):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=10000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=f3fe5f8d90821b86d193f5046d908b029fe83447dc189173bccc382198c3c68ff32afb68f484fe449b37ab025e04ff8d67f957d54ef3084c677a5c6fa95b807e HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"04","Message":"Invalid Amount"}</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">IPN PK2 code=00 ⇒ {"RspCode":"04","Message":"Invalid Amount"}</div>
<p>Một IPN có chữ ký cho một đơn chúng ta chưa từng tạo:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/ipn?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600099&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600099&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK99&amp;vnp_SecureHash=46529c6749807ef40e1d39798401cb62d09ae5c19cb4f0e91b2c349618fc17211abd49eebaff94b08211b37af2b27875ccbaaf09b367569f3b06b17da316edcf HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8

{"RspCode":"01","Message":"Order not Found"}</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">IPN PK99 code=00 ⇒ {"RspCode":"01","Message":"Order not Found"}</div>
<div class="pitfall">Trường nào nghĩa là "đã trả"? Code mẫu Java của VNPay chỉ kiểm <code>vnp_ResponseCode == "00"</code>; code mẫu C# đòi cả <code>vnp_ResponseCode</code> VÀ <code>vnp_TransactionStatus</code> bằng <code>"00"</code>. Chúng ta lấy luật chặt hơn. Không bao giờ quyết định chỉ từ return URL, và không bao giờ từ một tham số do chính trang của bạn thêm vào.</div>`),
    bi(`<h2>7. Coming back, part 2: the return page only shows</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/VnpayReturnController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Return URL: the BROWSER comes back here. Verify the signature, then SHOW — never update the database here (VNPay docs)
@WebServlet("/vnpay/return")
public class VnpayReturnController extends HttpServlet {
    private final PaymentService payments = new PaymentService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map&lt;String, String&gt; f = Vnpay.fields(req);
        if (!Vnpay.verify(f, VnpayConfig.of(getServletContext()).hashSecret())) {
            System.out.println("VnpayReturn: bad signature for " + f.get("vnp_TxnRef"));
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            req.setAttribute("badSignature", true);
        } else {
            try {
                req.setAttribute("txn", payments.find(f.get("vnp_TxnRef")));        // the TRUTH comes from our database
            } catch (SQLException e) {
                throw new ServletException(e);
            }
            req.setAttribute("code", f.get("vnp_ResponseCode"));
            req.setAttribute("codeText", VnpayCodes.text(f.get("vnp_ResponseCode")));
        }
        req.getRequestDispatcher("/WEB-INF/views/patient/payment-result.jsp").forward(req, resp);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/patient/payment-result.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- Shows the state of OUR database (txn.invoiceStatus), not what the URL claims --%&gt;
&lt;c:choose&gt;&lt;c:when test="&#36;{badSignature}"&gt;&lt;div class="alert alert-danger"&gt;Chữ ký không hợp lệ — kết quả này không đến từ cổng thanh toán. Không có gì được ghi nhận.&lt;/div&gt;
&lt;/c:when&gt;&lt;c:when test="&#36;{empty txn}"&gt;&lt;div class="alert alert-danger"&gt;Không tìm thấy giao dịch.&lt;/div&gt;
&lt;/c:when&gt;&lt;c:when test="&#36;{txn.invoiceStatus == 'PAID' and code == '00'}"&gt;&lt;div class="alert alert-success"&gt;Thanh toán thành công hoá đơn HD&#36;{txn.invoiceId}: &lt;fmt:formatNumber value="&#36;{txn.amount}" pattern="#,##0"/&gt; đ (mã giao dịch VNPay &lt;c:out value="&#36;{txn.gatewayTxnNo}"/&gt;).&lt;/div&gt;
&lt;/c:when&gt;&lt;c:when test="&#36;{code == '00'}"&gt;&lt;div class="alert alert-info"&gt;Cổng báo thành công, đang chờ xác nhận (IPN) cho giao dịch &lt;c:out value="&#36;{txn.txnRef}"/&gt;. Tải lại trang sau ít phút.&lt;/div&gt;
&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;div class="alert alert-warning"&gt;Giao dịch &lt;c:out value="&#36;{txn.txnRef}"/&gt; không thành công: &lt;c:out value="&#36;{codeText}"/&gt; (mã &lt;c:out value="&#36;{code}"/&gt;). Hoá đơn HD&#36;{txn.invoiceId} vẫn chưa thanh toán.&lt;/div&gt;
&lt;/c:otherwise&gt;&lt;/c:choose&gt;</code></pre>
<p>The page verifies the checksum, then shows <strong>what our database says</strong> (written by the IPN), using the code only for the wording. The cancelled attempt:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=24&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=02&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả thanh toán · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Kết quả thanh toán&lt;/h1&gt;
&lt;div class="alert alert-warning"&gt;Giao dịch PK1 không thành công: Khách hàng huỷ giao dịch (mã 24). Hoá đơn HD3 vẫn chưa thanh toán.&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/patient/invoices"&gt;Về hoá đơn của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The paid attempt — the IPN came first, so the page can already say "thành công":</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=b8f4cf963b17e3e1548cd0c5709d37a0889085529c8e228a73f760bd3df99671870dc7b54143491729e1eed2f23c25fc6dbc649b34ba4e2c1c2a85432ee6c6a9 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả thanh toán · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Kết quả thanh toán&lt;/h1&gt;
&lt;div class="alert alert-success"&gt;Thanh toán thành công hoá đơn HD3: 180.000 đ (mã giao dịch VNPay 14600002).&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/patient/invoices"&gt;Về hoá đơn của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/invoices HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Hoá đơn · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Hoá đơn của tôi&lt;/h1&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Số HĐ&lt;/th&gt;&lt;th&gt;Lịch&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Ngày khám&lt;/th&gt;&lt;th class="text-end"&gt;Số tiền (đ)&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;HD3&lt;/td&gt;&lt;td&gt;#3&lt;/td&gt;&lt;td&gt;Khám nhi&lt;/td&gt;&lt;td&gt;30/10/2026&lt;/td&gt;
&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã thanh toán&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;small class="text-muted"&gt;VNPAY-14600002&lt;/small&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Clicking "pay" on a PAID invoice (an old tab) is refused before any new attempt is created:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/invoices</code></pre>
<p>And the forged "success" URL of PK1 typed into a browser — no signature, no story:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả thanh toán · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Kết quả thanh toán&lt;/h1&gt;
&lt;div class="alert alert-danger"&gt;Chữ ký không hợp lệ — kết quả này không đến từ cổng thanh toán. Không có gì được ghi nhận.&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/patient/invoices"&gt;Về hoá đơn của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">VnpayReturn: bad signature for PK1</div>
<p>If the IPN is late (it is a separate request), the return page shows the blue "đang chờ xác nhận" state instead of lying in either direction. The codes we translate come from the docs' table:</p>
<table>
<thead><tr><th>vnp_ResponseCode</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>00</td><td>transaction successful</td></tr>
<tr><td>07</td><td>money taken, transaction suspected (fraud, unusual)</td></tr>
<tr><td>09</td><td>card/account not registered for Internet Banking</td></tr>
<tr><td>10</td><td>card/account details wrong more than 3 times</td></tr>
<tr><td>11</td><td>payment waiting time expired</td></tr>
<tr><td>12</td><td>card/account locked</td></tr>
<tr><td>13</td><td>wrong OTP</td></tr>
<tr><td>24</td><td>customer cancelled</td></tr>
<tr><td>51</td><td>insufficient balance</td></tr>
<tr><td>65</td><td>daily limit exceeded</td></tr>
<tr><td>75</td><td>bank under maintenance</td></tr>
<tr><td>79</td><td>wrong payment password too many times</td></tr>
<tr><td>99</td><td>other errors</td></tr>
</tbody>
</table>`,
    `<h2>7. Quay về, phần 2: trang return chỉ hiển thị</h2>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/VnpayReturnController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Return URL: TRÌNH DUYỆT quay về đây. Kiểm chữ ký rồi HIỂN THỊ — không bao giờ cập nhật CSDL ở đây (tài liệu VNPay)
@WebServlet("/vnpay/return")
public class VnpayReturnController extends HttpServlet {
    private final PaymentService payments = new PaymentService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map&lt;String, String&gt; f = Vnpay.fields(req);
        if (!Vnpay.verify(f, VnpayConfig.of(getServletContext()).hashSecret())) {
            System.out.println("VnpayReturn: bad signature for " + f.get("vnp_TxnRef"));
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            req.setAttribute("badSignature", true);
        } else {
            try {
                req.setAttribute("txn", payments.find(f.get("vnp_TxnRef")));        // SỰ THẬT lấy từ CSDL của mình
            } catch (SQLException e) {
                throw new ServletException(e);
            }
            req.setAttribute("code", f.get("vnp_ResponseCode"));
            req.setAttribute("codeText", VnpayCodes.text(f.get("vnp_ResponseCode")));
        }
        req.getRequestDispatcher("/WEB-INF/views/patient/payment-result.jsp").forward(req, resp);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/patient/payment-result.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;%-- Hiện trạng thái trong CSDL CỦA MÌNH (txn.invoiceStatus), không phải điều URL tự nhận --%&gt;
&lt;c:choose&gt;&lt;c:when test="&#36;{badSignature}"&gt;&lt;div class="alert alert-danger"&gt;Chữ ký không hợp lệ — kết quả này không đến từ cổng thanh toán. Không có gì được ghi nhận.&lt;/div&gt;
&lt;/c:when&gt;&lt;c:when test="&#36;{empty txn}"&gt;&lt;div class="alert alert-danger"&gt;Không tìm thấy giao dịch.&lt;/div&gt;
&lt;/c:when&gt;&lt;c:when test="&#36;{txn.invoiceStatus == 'PAID' and code == '00'}"&gt;&lt;div class="alert alert-success"&gt;Thanh toán thành công hoá đơn HD&#36;{txn.invoiceId}: &lt;fmt:formatNumber value="&#36;{txn.amount}" pattern="#,##0"/&gt; đ (mã giao dịch VNPay &lt;c:out value="&#36;{txn.gatewayTxnNo}"/&gt;).&lt;/div&gt;
&lt;/c:when&gt;&lt;c:when test="&#36;{code == '00'}"&gt;&lt;div class="alert alert-info"&gt;Cổng báo thành công, đang chờ xác nhận (IPN) cho giao dịch &lt;c:out value="&#36;{txn.txnRef}"/&gt;. Tải lại trang sau ít phút.&lt;/div&gt;
&lt;/c:when&gt;&lt;c:otherwise&gt;&lt;div class="alert alert-warning"&gt;Giao dịch &lt;c:out value="&#36;{txn.txnRef}"/&gt; không thành công: &lt;c:out value="&#36;{codeText}"/&gt; (mã &lt;c:out value="&#36;{code}"/&gt;). Hoá đơn HD&#36;{txn.invoiceId} vẫn chưa thanh toán.&lt;/div&gt;
&lt;/c:otherwise&gt;&lt;/c:choose&gt;</code></pre>
<p>Trang kiểm checksum, rồi hiện <strong>điều CSDL của chúng ta nói</strong> (do IPN ghi), chỉ dùng mã phản hồi để chọn câu chữ. Lần thử bị huỷ:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=24&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=02&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả thanh toán · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Kết quả thanh toán&lt;/h1&gt;
&lt;div class="alert alert-warning"&gt;Giao dịch PK1 không thành công: Khách hàng huỷ giao dịch (mã 24). Hoá đơn HD3 vẫn chưa thanh toán.&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/patient/invoices"&gt;Về hoá đơn của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Lần thử đã trả — IPN tới trước, nên trang đã nói được "thành công":</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_BankTranNo=VNP14600002&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600002&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK2&amp;vnp_SecureHash=b8f4cf963b17e3e1548cd0c5709d37a0889085529c8e228a73f760bd3df99671870dc7b54143491729e1eed2f23c25fc6dbc649b34ba4e2c1c2a85432ee6c6a9 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả thanh toán · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Kết quả thanh toán&lt;/h1&gt;
&lt;div class="alert alert-success"&gt;Thanh toán thành công hoá đơn HD3: 180.000 đ (mã giao dịch VNPay 14600002).&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/patient/invoices"&gt;Về hoá đơn của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/patient/invoices HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(6)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Hoá đơn · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/appointments"&gt;Lịch của tôi&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/patient/invoices"&gt;Hoá đơn&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Trần Ngọc Lan (PATIENT)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Hoá đơn của tôi&lt;/h1&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Số HĐ&lt;/th&gt;&lt;th&gt;Lịch&lt;/th&gt;&lt;th&gt;Dịch vụ&lt;/th&gt;&lt;th&gt;Ngày khám&lt;/th&gt;&lt;th class="text-end"&gt;Số tiền (đ)&lt;/th&gt;&lt;th&gt;Trạng thái&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;HD3&lt;/td&gt;&lt;td&gt;#3&lt;/td&gt;&lt;td&gt;Khám nhi&lt;/td&gt;&lt;td&gt;30/10/2026&lt;/td&gt;
&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;td&gt;&lt;span class="badge text-bg-success"&gt;Đã thanh toán&lt;/span&gt;&lt;/td&gt;
&lt;td&gt;&lt;small class="text-muted"&gt;VNPAY-14600002&lt;/small&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Bấm "thanh toán" trên một hoá đơn đã PAID (một tab cũ) bị từ chối trước khi tạo lần thử mới:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/patient/invoices/pay HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(6)
Content-Length: 4

id=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/patient/invoices</code></pre>
<p>Và URL "thành công" giả của PK1 gõ thẳng vào trình duyệt — không có chữ ký thì không có chuyện gì cả:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/vnpay/return?vnp_Amount=18000000&amp;vnp_BankCode=NCB&amp;vnp_CardType=ATM&amp;vnp_OrderInfo=Thanh+toan+hoa+don+HD3&amp;vnp_PayDate=20261105101500&amp;vnp_ResponseCode=00&amp;vnp_TmnCode=DEMO0001&amp;vnp_TransactionNo=14600001&amp;vnp_TransactionStatus=00&amp;vnp_TxnRef=PK1&amp;vnp_SecureHash=93cad75fbf54f9fd02a4c1e68c68da7f3c54a5ab58eb8b6cf1226051618c42e27c5300070a6e258eda990f1c8497362f703f59d5babcf0cf4093ffe5dab8c8ee HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Kết quả thanh toán · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;/ul&gt;
&lt;a class="btn btn-sm btn-light me-2" href="/phong-kham/login"&gt;Đăng nhập&lt;/a&gt;
&lt;a class="btn btn-sm btn-outline-light" href="/phong-kham/register"&gt;Đăng ký&lt;/a&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Kết quả thanh toán&lt;/h1&gt;
&lt;div class="alert alert-danger"&gt;Chữ ký không hợp lệ — kết quả này không đến từ cổng thanh toán. Không có gì được ghi nhận.&lt;/div&gt;
&lt;a class="btn btn-outline-primary" href="/phong-kham/patient/invoices"&gt;Về hoá đơn của tôi&lt;/a&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">VnpayReturn: bad signature for PK1</div>
<p>Nếu IPN tới muộn (nó là một request riêng), trang return hiện trạng thái xanh dương "đang chờ xác nhận" thay vì nói sai theo bất kỳ hướng nào. Các mã chúng ta dịch lấy từ bảng của tài liệu:</p>
<table>
<thead><tr><th>vnp_ResponseCode</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td>00</td><td>giao dịch thành công</td></tr>
<tr><td>07</td><td>trừ tiền thành công, giao dịch bị nghi ngờ (lừa đảo, bất thường)</td></tr>
<tr><td>09</td><td>thẻ/tài khoản chưa đăng ký Internet Banking</td></tr>
<tr><td>10</td><td>xác thực thông tin thẻ/tài khoản sai quá 3 lần</td></tr>
<tr><td>11</td><td>hết hạn chờ thanh toán</td></tr>
<tr><td>12</td><td>thẻ/tài khoản bị khoá</td></tr>
<tr><td>13</td><td>nhập sai OTP</td></tr>
<tr><td>24</td><td>khách hàng huỷ giao dịch</td></tr>
<tr><td>51</td><td>không đủ số dư</td></tr>
<tr><td>65</td><td>vượt hạn mức trong ngày</td></tr>
<tr><td>75</td><td>ngân hàng đang bảo trì</td></tr>
<tr><td>79</td><td>nhập sai mật khẩu thanh toán quá số lần</td></tr>
<tr><td>99</td><td>lỗi khác</td></tr>
</tbody>
</table>`),
    bi(`<h2>8. From the fake gateway to the real sandbox — and later to production</h2>
<ol>
<li><strong>Register</strong> at <code>sandbox.vnpayment.vn/devreg</code>; keep the e-mail with <code>vnp_TmnCode</code> and <code>vnp_HashSecret</code> private.</li>
<li><strong>Set the environment variables</strong> of section 2 on the machine that runs Tomcat, restart NetBeans/Tomcat. The log line changes from "DEMO mode" to "TmnCode … → https://sandbox.vnpayment.vn/…", and <code>/vnpay-gia</code> answers 404.</li>
<li><strong>Remove the two pins</strong> <code>clinic.today</code> and <code>clinic.now</code> from <code>web.xml</code> (the sandbox would see a date in the past).</li>
<li><strong>Make the IPN reachable.</strong> VNPay's server cannot call <code>localhost</code>. For a classroom demo the return page still works (it is your own browser), but the IPN needs a public HTTPS address — deploy to a server with a domain, or open a temporary tunnel (ngrok, Cloudflare Tunnel… — tools, not part of the VNPay docs). Then send the IPN URL to VNPay as the docs say.</li>
<li><strong>Test the matrix</strong> with the documented cards: success, insufficient balance, cancel, wrong OTP — and the IPN replay of section 6.</li>
<li><strong>Production</strong> comes after a contract: the docs' timeline puts go-live "right after the contract and the SIT test script are signed". You receive a production TmnCode, secret and payment URL; you change <code>VNP_PAY_URL</code> and the two secrets — not one line of code.</li>
</ol>
<div class="callout">💳 <strong>Other sandboxes that satisfy 1.10</strong> (not built here): <strong>PayPal Sandbox</strong> (developer.paypal.com — sandbox accounts, REST API with OAuth token, webhooks instead of IPN) and <strong>MoMo test environment</strong> (developers.momo.vn — HMAC-SHA256 signature, redirect + IPN, very close to VNPay). The ideas of this lesson carry over unchanged: sign going out, verify coming back, write the result once, from the server-to-server channel.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the same three pieces become a <code>@Service</code> that builds the URL, a <code>@RestController</code> for the IPN (returns a <code>Map</code> as JSON), and <code>@Transactional</code> on the method that closes the attempt; the secret comes from <code>application.yml</code> → <code>&#36;{VNP_HASH_SECRET}</code>:
<pre><code class="language-java">@ConfigurationProperties(prefix = "vnpay")            // vnpay.tmn-code, vnpay.hash-secret ← environment variables
record VnpayProps(String tmnCode, String hashSecret, String payUrl) { }

@RestController
class VnpayIpnController {
    @GetMapping("/vnpay/ipn")
    Map&lt;String, String&gt; ipn(@RequestParam Map&lt;String, String&gt; params) {
        return paymentService.ipn(params);            // same checks: checksum → order → amount → PENDING
    }
}

@Transactional                                        // = setAutoCommit(false) … commit/rollback of PaymentDAO.finish
public boolean finish(PaymentTxn t, boolean ok, …) { … }</code></pre>
Spring Security must let <code>/vnpay/ipn</code> through without login and without CSRF (it is a server-to-server GET) — the same reason we added <code>/vnpay/</code> to <code>AuthorizationFilter.isPublic</code>.</div>`,
    `<h2>8. Từ cổng giả sang sandbox thật — và sau này lên production</h2>
<ol>
<li><strong>Đăng ký</strong> ở <code>sandbox.vnpayment.vn/devreg</code>; giữ kín email chứa <code>vnp_TmnCode</code> và <code>vnp_HashSecret</code>.</li>
<li><strong>Đặt biến môi trường</strong> như mục 2 trên máy chạy Tomcat, khởi động lại NetBeans/Tomcat. Dòng log đổi từ "DEMO mode" sang "TmnCode … → https://sandbox.vnpayment.vn/…", và <code>/vnpay-gia</code> trả 404.</li>
<li><strong>Bỏ hai chỗ ghim</strong> <code>clinic.today</code> và <code>clinic.now</code> khỏi <code>web.xml</code> (sandbox sẽ thấy một ngày trong quá khứ).</li>
<li><strong>Cho IPN với tới được.</strong> Server của VNPay không gọi được <code>localhost</code>. Demo trên lớp thì trang return vẫn chạy (vì đó là trình duyệt của bạn), nhưng IPN cần một địa chỉ HTTPS công khai — deploy lên một server có tên miền, hoặc mở một đường hầm tạm (ngrok, Cloudflare Tunnel… — là công cụ, không nằm trong tài liệu VNPay). Rồi gửi IPN URL cho VNPay đúng như tài liệu dặn.</li>
<li><strong>Thử cả ma trận</strong> với các thẻ trong tài liệu: thành công, không đủ số dư, huỷ, sai OTP — và phép gọi lại IPN ở mục 6.</li>
<li><strong>Production</strong> đến sau hợp đồng: lịch trình trong tài liệu đặt go-live "ngay sau khi ký hợp đồng và kịch bản SIT". Bạn nhận TmnCode, secret và URL thanh toán production; bạn đổi <code>VNP_PAY_URL</code> và hai giá trị bí mật — không một dòng code nào.</li>
</ol>
<div class="callout">💳 <strong>Các sandbox khác cũng đáp ứng 1.10</strong> (không làm ở đây): <strong>PayPal Sandbox</strong> (developer.paypal.com — tài khoản sandbox, REST API với OAuth token, webhook thay cho IPN) và <strong>môi trường test của MoMo</strong> (developers.momo.vn — chữ ký HMAC-SHA256, redirect + IPN, rất giống VNPay). Các ý của bài này mang sang nguyên vẹn: ký khi đi, kiểm khi về, ghi kết quả một lần, từ kênh server-tới-server.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): ba mảnh này thành một <code>@Service</code> dựng URL, một <code>@RestController</code> cho IPN (trả <code>Map</code> thành JSON), và <code>@Transactional</code> trên phương thức đóng lần thử; secret đến từ <code>application.yml</code> → <code>&#36;{VNP_HASH_SECRET}</code>:
<pre><code class="language-java">@ConfigurationProperties(prefix = "vnpay")            // vnpay.tmn-code, vnpay.hash-secret ← biến môi trường
record VnpayProps(String tmnCode, String hashSecret, String payUrl) { }

@RestController
class VnpayIpnController {
    @GetMapping("/vnpay/ipn")
    Map&lt;String, String&gt; ipn(@RequestParam Map&lt;String, String&gt; params) {
        return paymentService.ipn(params);            // cùng các phép kiểm: checksum → đơn → số tiền → PENDING
    }
}

@Transactional                                        // = setAutoCommit(false) … commit/rollback của PaymentDAO.finish
public boolean finish(PaymentTxn t, boolean ok, …) { … }</code></pre>
Spring Security phải cho <code>/vnpay/ipn</code> đi qua mà không cần đăng nhập và không cần CSRF (nó là một GET server-tới-server) — cùng lý do chúng ta thêm <code>/vnpay/</code> vào <code>AuthorizationFilter.isPublic</code>.</div>`),
    bi(`<h2>🧪 Exercises (predict first, then check with the code)</h2>
<h3>🧪 Exercise 1 — move the PAID update into the return page (~5 min)</h3>
<p>A teammate says "the return page already has <code>vnp_ResponseCode=00</code> and a valid signature, let's write PAID there and delete the IPN". What breaks?</p>
<p class="dap-an">✅ Two things. (1) A patient who pays and then closes the tab (or loses the network) never reaches the return page: VNPay has taken the money, your invoice stays UNPAID forever. (2) Every refresh of the return page re-runs the update; without the <code>status = 'PENDING'</code> guard that is a double write. The docs forbid it in one sentence: "Không cập nhật kết quả giao dịch tại địa chỉ này".</p>
<h3>🧪 Exercise 2 — HashMap instead of TreeMap (~5 min)</h3>
<p>In <code>Vnpay.hashData</code> replace <code>new TreeMap&lt;&gt;(fields)</code> with <code>fields</code> (the <code>HashMap</code> built by <code>PaymentService</code>). What does the fake gateway answer?</p>
<p class="dap-an">✅ Usually "Sai chữ ký (vnp_SecureHash)" (400), like request <code>cong-sua-tien</code>: the gateway sorts, you did not, so the two strings differ and so do the hashes. "Usually", because a <code>HashMap</code>'s order is unspecified — it might even match by luck on one machine and fail on another, the worst kind of bug.</p>
<h3>🧪 Exercise 3 — the insufficient-balance card (~5 min)</h3>
<p>Instead of request <code>cong-tra</code>, the customer enters <code>9704195798459170488</code>. Predict: the IPN answer, the PaymentTxn row, the invoice, the return page.</p>
<p class="dap-an">✅ The fake gateway returns code 51 and <code>vnp_TransactionStatus=02</code>; the IPN answers <code>{"RspCode":"00","Message":"Confirm Success"}</code> (a failure is still a result we recorded); PK2 becomes FAILED with responseCode 51; HD3 stays UNPAID; the return page shows the yellow box "không thành công: Tài khoản không đủ số dư (mã 51)" and the patient may try again (PK3).</p>
<h3>🧪 Exercise 4 — your topic (~60 min)</h3>
<p>Add sandbox payment to YOUR central transaction (rental contract, ticket order, tour booking…): the attempt table, the signed URL, the IPN with the six answers, the return page, and these requests in your demo script: someone else's order ⇒ 403, cancel ⇒ still unpaid, success ⇒ paid, IPN replay ⇒ 02, edited amount ⇒ refused.</p>
<p class="dap-an">✅ Copy <code>payment/*</code>, <code>PaymentDAO</code>, <code>PaymentService</code>, the two <code>Vnpay…Controller</code>, and the <code>PaymentTxn</code> table with <code>invoiceId</code> renamed to your order's id. Change only <code>vnp_OrderInfo</code> (no accents) and the owner check. For the event-ticket topic, release the held seats when the IPN records a failure — the IPN is the one place that knows.</p>`,
    `<h2>🧪 Bài tập (đoán trước, rồi kiểm bằng code)</h2>
<h3>🧪 Bài 1 — chuyển việc ghi PAID sang trang return (~5 phút)</h3>
<p>Một bạn cùng nhóm nói "trang return đã có <code>vnp_ResponseCode=00</code> và chữ ký hợp lệ, ghi PAID ở đó rồi xoá IPN đi". Cái gì hỏng?</p>
<p class="dap-an">✅ Hai thứ. (1) Bệnh nhân trả tiền xong rồi đóng tab (hoặc mất mạng) thì không bao giờ tới trang return: VNPay đã trừ tiền, hoá đơn của bạn vẫn UNPAID mãi mãi. (2) Mỗi lần tải lại trang return lại chạy lệnh cập nhật; thiếu chốt <code>status = 'PENDING'</code> thì đó là ghi hai lần. Tài liệu cấm việc này bằng một câu: "Không cập nhật kết quả giao dịch tại địa chỉ này".</p>
<h3>🧪 Bài 2 — HashMap thay cho TreeMap (~5 phút)</h3>
<p>Trong <code>Vnpay.hashData</code>, thay <code>new TreeMap&lt;&gt;(fields)</code> bằng <code>fields</code> (cái <code>HashMap</code> mà <code>PaymentService</code> dựng). Cổng giả trả lời gì?</p>
<p class="dap-an">✅ Thường là "Sai chữ ký (vnp_SecureHash)" (400), giống request <code>cong-sua-tien</code>: cổng sắp xếp, bạn thì không, nên hai chuỗi khác nhau và hai mã băm cũng khác. "Thường là", vì thứ tự của <code>HashMap</code> không được bảo đảm — có khi trùng hợp khớp trên máy này mà hỏng trên máy khác, loại lỗi tệ nhất.</p>
<h3>🧪 Bài 3 — thẻ không đủ số dư (~5 phút)</h3>
<p>Thay cho request <code>cong-tra</code>, khách nhập thẻ <code>9704195798459170488</code>. Đoán: câu trả lời IPN, dòng PaymentTxn, hoá đơn, trang return.</p>
<p class="dap-an">✅ Cổng giả trả mã 51 và <code>vnp_TransactionStatus=02</code>; IPN trả <code>{"RspCode":"00","Message":"Confirm Success"}</code> (thất bại cũng là một kết quả đã ghi nhận); PK2 thành FAILED với responseCode 51; HD3 vẫn UNPAID; trang return hiện ô vàng "không thành công: Tài khoản không đủ số dư (mã 51)" và bệnh nhân thử lại được (PK3).</p>
<h3>🧪 Bài 4 — đề tài của bạn (~60 phút)</h3>
<p>Thêm thanh toán sandbox cho giao dịch trung tâm CỦA BẠN (hợp đồng thuê, đơn mua vé, đặt tour…): bảng lần thử, URL có chữ ký, IPN với sáu câu trả lời, trang return, và các request này trong kịch bản demo: đơn của người khác ⇒ 403, huỷ ⇒ vẫn chưa trả, thành công ⇒ đã trả, IPN lặp ⇒ 02, sửa số tiền ⇒ bị từ chối.</p>
<p class="dap-an">✅ Chép <code>payment/*</code>, <code>PaymentDAO</code>, <code>PaymentService</code>, hai <code>Vnpay…Controller</code>, và bảng <code>PaymentTxn</code> với <code>invoiceId</code> đổi thành id đơn của bạn. Chỉ đổi <code>vnp_OrderInfo</code> (không dấu) và phép kiểm chủ sở hữu. Với đề bán vé sự kiện, nhả các ghế đang giữ khi IPN ghi nhận thất bại — IPN là chỗ duy nhất biết điều đó.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>sandbox</strong></td><td>môi trường thử (hộp cát)</td><td>A copy of a payment gateway for developers: same API and signatures, test cards, no real money.</td></tr>
<tr><td><strong>payment gateway</strong></td><td>cổng thanh toán</td><td>The service (VNPay, MoMo, PayPal…) that shows the payment page and talks to the banks.</td></tr>
<tr><td><strong>merchant</strong></td><td>đơn vị bán hàng (merchant)</td><td>Your shop as the gateway sees it, identified by vnp_TmnCode.</td></tr>
<tr><td><strong>vnp_HashSecret</strong></td><td>khoá bí mật ký dữ liệu</td><td>The secret shared by your server and VNPay; whoever holds it can sign messages, so it lives only in environment variables.</td></tr>
<tr><td><strong>checksum (vnp_SecureHash)</strong></td><td>mã kiểm tra toàn vẹn</td><td>HMAC-SHA512 of the sorted, URL-encoded parameters; any edited parameter makes it wrong.</td></tr>
<tr><td><strong>HMAC</strong></td><td>mã xác thực thông điệp dùng khoá</td><td>A hash computed with a secret key, so only key holders can produce or check it.</td></tr>
<tr><td><strong>Return URL</strong></td><td>URL quay về</td><td>Where the gateway sends the customer's browser back; it verifies and shows, never updates.</td></tr>
<tr><td><strong>IPN (Instant Payment Notification)</strong></td><td>thông báo thanh toán tức thời</td><td>The gateway's server-to-server call that reports the result; the only place that writes PAID.</td></tr>
<tr><td><strong>idempotent</strong></td><td>luỹ đẳng</td><td>An operation whose effect is the same whether it runs once or many times — required because the IPN is retried.</td></tr>
<tr><td><strong>vnp_TxnRef</strong></td><td>mã tham chiếu giao dịch</td><td>Your own reference for one payment attempt; must not repeat within a day.</td></tr>
<tr><td><strong>environment variable</strong></td><td>biến môi trường</td><td>A name=value setting of the process that runs Tomcat, read with System.getenv; it never goes into Git or the WAR.</td></tr>
<tr><td><strong>computed column</strong></td><td>cột tính toán</td><td>A SQL Server column defined by an expression (here 'PK' + paymentId); PERSISTED stores it so it can be indexed.</td></tr>
<tr><td><strong>GMT+7</strong></td><td>giờ Việt Nam</td><td>The time zone of every VNPay date (zone Asia/Ho_Chi_Minh); a UTC server must convert.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>sandbox</strong></td><td>môi trường thử (hộp cát)</td><td>Bản sao của cổng thanh toán cho lập trình viên: cùng API và chữ ký, dùng thẻ test, không có tiền thật.</td></tr>
<tr><td><strong>payment gateway</strong></td><td>cổng thanh toán</td><td>Dịch vụ (VNPay, MoMo, PayPal…) hiển thị trang thanh toán và làm việc với ngân hàng.</td></tr>
<tr><td><strong>merchant</strong></td><td>đơn vị bán hàng (merchant)</td><td>Cửa hàng của bạn trong mắt cổng thanh toán, nhận diện bằng vnp_TmnCode.</td></tr>
<tr><td><strong>vnp_HashSecret</strong></td><td>khoá bí mật ký dữ liệu</td><td>Bí mật dùng chung giữa server của bạn và VNPay; ai giữ nó là ký được thông điệp, nên nó chỉ nằm trong biến môi trường.</td></tr>
<tr><td><strong>checksum (vnp_SecureHash)</strong></td><td>mã kiểm tra toàn vẹn</td><td>HMAC-SHA512 của các tham số đã sắp xếp và mã hoá URL; sửa bất kỳ tham số nào là nó sai.</td></tr>
<tr><td><strong>HMAC</strong></td><td>mã xác thực thông điệp dùng khoá</td><td>Mã băm tính kèm một khoá bí mật, nên chỉ người có khoá mới tạo hoặc kiểm được.</td></tr>
<tr><td><strong>Return URL</strong></td><td>URL quay về</td><td>Nơi cổng đưa trình duyệt khách quay về; chỉ kiểm và hiển thị, không bao giờ cập nhật.</td></tr>
<tr><td><strong>IPN (Instant Payment Notification)</strong></td><td>thông báo thanh toán tức thời</td><td>Lời gọi server-tới-server của cổng để báo kết quả; chỗ duy nhất được ghi PAID.</td></tr>
<tr><td><strong>idempotent</strong></td><td>luỹ đẳng</td><td>Thao tác có tác dụng như nhau dù chạy một hay nhiều lần — bắt buộc vì IPN được gọi lại.</td></tr>
<tr><td><strong>vnp_TxnRef</strong></td><td>mã tham chiếu giao dịch</td><td>Mã tham chiếu của bạn cho một lần thử thanh toán; không được trùng trong ngày.</td></tr>
<tr><td><strong>environment variable</strong></td><td>biến môi trường</td><td>Cặp tên=giá trị của tiến trình chạy Tomcat, đọc bằng System.getenv; không bao giờ vào Git hay file WAR.</td></tr>
<tr><td><strong>computed column</strong></td><td>cột tính toán</td><td>Cột SQL Server định nghĩa bằng một biểu thức (ở đây 'PK' + paymentId); PERSISTED lưu sẵn để đánh chỉ mục được.</td></tr>
<tr><td><strong>GMT+7</strong></td><td>giờ Việt Nam</td><td>Múi giờ của mọi mốc thời gian VNPay (vùng Asia/Ho_Chi_Minh); server chạy UTC phải đổi.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Remember</h2>
<ul>
<li>1.10 = a real round trip: 302 to the sandbox, test card, back to your site, invoice PAID — follow the official VNPay docs (API 2.1.0).</li>
<li>TmnCode + HashSecret come from environment variables only; never in code, <code>web.xml</code>, Git, the WAR or the report.</li>
<li>One row per payment attempt (<code>vnp_TxnRef</code> must not repeat in a day); copy the amount into the attempt.</li>
<li>Checksum = parameters sorted by name, empty ones skipped, <code>name=URLEncode(value, US-ASCII)</code> joined by <code>&amp;</code>, HMAC-SHA512 with the secret; the hash goes last and is not signed.</li>
<li><code>vnp_Amount</code> × 100; dates <code>yyyyMMddHHmmss</code> in GMT+7; <code>vnp_OrderInfo</code> without accents.</li>
<li>IPN: checksum → order → amount → still pending → ONE transaction → JSON RspCode (00/02 stop, 01/04/97/99 retry up to 10 times).</li>
<li>Idempotent: <code>WHERE … AND status = 'PENDING'</code> + check the row count; a replayed IPN answers 02 and changes nothing.</li>
<li>Return page: verify, then show what the database says — never update there. Check ownership before starting a payment (403).</li>
</ul>`,
    `<h2>📌 Ghi nhớ</h2>
<ul>
<li>1.10 = một vòng đi–về thật: 302 sang sandbox, thẻ test, quay về trang của bạn, hoá đơn PAID — làm theo tài liệu chính thức của VNPay (API 2.1.0).</li>
<li>TmnCode + HashSecret chỉ đến từ biến môi trường; không bao giờ trong code, <code>web.xml</code>, Git, file WAR hay báo cáo.</li>
<li>Mỗi lần thử thanh toán một dòng (<code>vnp_TxnRef</code> không được trùng trong ngày); chép số tiền vào lần thử.</li>
<li>Checksum = tham số xếp theo tên, bỏ giá trị rỗng, <code>tên=URLEncode(giá trị, US-ASCII)</code> nối bằng <code>&amp;</code>, HMAC-SHA512 với secret; mã băm gắn cuối và không nằm trong dữ liệu được ký.</li>
<li><code>vnp_Amount</code> × 100; ngày giờ dạng <code>yyyyMMddHHmmss</code> theo GMT+7; <code>vnp_OrderInfo</code> không dấu.</li>
<li>IPN: checksum → đơn → số tiền → còn chờ → MỘT transaction → JSON RspCode (00/02 dừng, 01/04/97/99 bị gọi lại tối đa 10 lần).</li>
<li>Luỹ đẳng: <code>WHERE … AND status = 'PENDING'</code> + kiểm số dòng; IPN gửi lại trả 02 và không đổi gì.</li>
<li>Trang return: kiểm chữ ký rồi hiện điều CSDL nói — không bao giờ cập nhật ở đó. Kiểm chủ sở hữu trước khi bắt đầu thanh toán (403).</li>
</ul>`),
  ].join('\n'),
};

/* ───────── ASM.6 — 🧭 Assignment A–Z (6/6): revenue report, written report, team evidence, demo, defence questions ───────── */
const L_x_asm_6 = {
  title: 'ASM.6 — 🧭 Assignment A–Z (6/6): revenue report, written report, team evidence, demo, defence questions|||ASM.6 — 🧭 Assignment A–Z (6/6): báo cáo doanh thu, quyển báo cáo, phân công, demo, câu hỏi bảo vệ',
  slug: 'prj301-asm-6',
  type: 'VIDEO',
  description: 'Bài tự thêm, khép lại chuỗi Assignment PRJ301 mẫu Quản lý phòng khám: chức năng cuối UC14 báo cáo doanh thu chạy thật; phần 2 của đề — khung báo cáo phân tích, thiết kế chức năng và CSDL, phân công thành viên, mã nguồn, tài liệu thiết kế, ảnh giao diện, mỗi mục có mẫu điền bằng chính app phòng khám; bảng phân công kèm bằng chứng Git; checklist tự chấm 10 yêu cầu trỏ tới request chứng minh; kịch bản demo 10 phút; 15 câu hội đồng hay hỏi kèm câu trả lời mẫu (MVC, Filter, PreparedStatement, session, JSTL, custom tag, transaction, bảo mật, thanh toán); lỗi hay gặp khi nộp và cách đóng gói WAR + script + README.',
  content: [
    bi(`<span class="eyebrow">🧭 Course Assignment A–Z · 6/6 · added by this site</span>
<h2>The last function, then the part of the brief nobody codes: the report and the defence</h2>
<p class="lead">ASM.1–ASM.5 built every requirement of part 1. Part 2 of the brief asks for three more things, and they are marked too: <em>"analysis and design of the system's functions and database"</em>, <em>"a clear split of tasks for each member"</em>, and the results — <em>"source code; design documents and analysis report; screenshots of the interface and functions"</em>. This lesson first finishes UC14 (the revenue report promised in ASM.1), then gives you a report skeleton filled with the clinic, the evidence that proves who did what, a self-check that points to a running request for each requirement, a 10-minute demo script, fifteen questions examiners ask, and the packaging that makes your zip run on someone else's machine.</p>
<div class="callout">📋 The class brief has no official report template and no rubric. The chapter structure below is <strong>our proposal</strong>, built from the brief's own words; if your teacher gives a template, use it and move our content into it.</div>`,
    `<span class="eyebrow">🧭 Assignment A–Z · 6/6 · phần web tự thêm</span>
<h2>Chức năng cuối cùng, rồi tới phần của đề không ai viết code: báo cáo và buổi bảo vệ</h2>
<p class="lead">ASM.1–ASM.5 đã làm mọi yêu cầu của phần 1. Phần 2 của đề đòi thêm ba thứ, và chúng cũng được chấm: <em>"phân tích, thiết kế chức năng hệ thống và cơ sở dữ liệu"</em>, <em>"phân công rõ ràng nhiệm vụ cho từng thành viên nhóm"</em>, và kết quả — <em>"mã nguồn ứng dụng; tài liệu thiết kế và báo cáo phân tích; hình ảnh giao diện và chức năng của ứng dụng"</em>. Bài này trước hết làm xong UC14 (báo cáo doanh thu đã hứa ở ASM.1), rồi đưa bạn khung báo cáo điền sẵn bằng phòng khám, bằng chứng ai làm gì, bảng tự chấm trỏ tới một request đang chạy cho từng yêu cầu, kịch bản demo 10 phút, mười lăm câu hội đồng hay hỏi, và cách đóng gói để file zip chạy được trên máy người khác.</p>
<div class="callout">📋 Đề lớp không có mẫu báo cáo chính thức và không có barem. Cấu trúc chương bên dưới là <strong>đề xuất của trang này</strong>, dựng từ chính câu chữ của đề; nếu giảng viên phát mẫu, dùng mẫu đó và chuyển nội dung của chúng ta vào.</div>`),
    bi(`<h2>1. UC14 — the revenue report (the last function)</h2>
<p>Rule from ASM.1: "PAID invoices only". Two more decisions hide in that sentence: money belongs to the day it was <strong>paid</strong> (<code>paidAt</code>), not the day the invoice was created; and the "to" date must count as a whole day.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/ReportDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;RevenueRow&gt; revenue(LocalDate from, LocalDate to) throws SQLException {
    String sql = "SELECT CAST(i.paidAt AS DATE) AS d, sp.name, COUNT(*) AS n, SUM(i.amount) AS total "
               + "FROM Invoice i JOIN Appointment a ON a.appointmentId = i.appointmentId "
               + "JOIN MedicalService s ON s.serviceId = a.serviceId JOIN Specialty sp ON sp.specialtyId = s.specialtyId "
               + "WHERE i.status = 'PAID' AND i.paidAt &gt;= ? AND i.paidAt &lt; ? "          // half-open range: the whole "to" day counts
               + "GROUP BY CAST(i.paidAt AS DATE), sp.name ORDER BY d, sp.name";
    List&lt;RevenueRow&gt; rows = new ArrayList&lt;&gt;();
    DateTimeFormatter vn = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setObject(1, from);
        ps.setObject(2, to.plusDays(1));
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(new RevenueRow(rs.getObject("d", LocalDate.class).format(vn), rs.getString("name"),
                    rs.getInt("n"), rs.getBigDecimal("total")));
        }
    }
    return rows;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminReportController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// ADMIN: revenue between two dates (default: the 1st of this month → today). /admin/* ⇒ AuthorizationFilter already allows ADMIN only
@WebServlet("/admin/reports")
public class AdminReportController extends HttpServlet {
    private final ReportDAO reports = new ReportDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        LocalDate today = Clinic.today(getServletContext());
        LocalDate from = date(req.getParameter("from"), today.withDayOfMonth(1));
        LocalDate to = date(req.getParameter("to"), today);
        if (from.isAfter(to)) { LocalDate t = from; from = to; to = t; }        // swapped dates: be kind, swap back
        try {
            List&lt;RevenueRow&gt; rows = reports.revenue(from, to);
            req.setAttribute("rows", rows);
            req.setAttribute("sum", rows.stream().map(RevenueRow::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
            req.setAttribute("count", rows.stream().mapToInt(RevenueRow::getInvoices).sum());
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        req.setAttribute("from", from);
        req.setAttribute("to", to);
        req.getRequestDispatcher("/WEB-INF/views/admin/reports.jsp").forward(req, resp);
    }

    private static LocalDate date(String s, LocalDate fallback) {
        try { return s == null || s.isBlank() ? fallback : LocalDate.parse(s); } catch (DateTimeParseException e) { return fallback; }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/admin/reports.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Ngày thu&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Số hoá đơn&lt;/th&gt;&lt;th class="text-end"&gt;Doanh thu (đ)&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;c:forEach items="&#36;{rows}" var="r"&gt;&lt;tr&gt;&lt;td&gt;&#36;{r.day}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{r.specialty}"/&gt;&lt;/td&gt;&lt;td class="text-end"&gt;&#36;{r.invoices}&lt;/td&gt;&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{r.total}" pattern="#,##0"/&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;&lt;c:if test="&#36;{empty rows}"&gt;&lt;tr&gt;&lt;td colspan="4" class="text-center text-muted"&gt;Không có hoá đơn đã thanh toán trong khoảng này.&lt;/td&gt;&lt;/tr&gt;
&lt;/c:if&gt;&lt;/tbody&gt;
&lt;tfoot&gt;&lt;tr class="fw-bold"&gt;&lt;td colspan="2"&gt;Tổng&lt;/td&gt;&lt;td class="text-end"&gt;&#36;{count}&lt;/td&gt;&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{sum}" pattern="#,##0"/&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tfoot&gt;
&lt;/table&gt;
&lt;/div&gt;</code></pre>
<ul>
<li><code>paidAt &gt;= from AND paidAt &lt; to + 1 day</code> — a <em>half-open</em> range. <code>BETWEEN from AND to</code> on a <code>DATETIME2</code> column would stop at 05/11 00:00 and lose HD3, paid at 10:15 that day.</li>
<li>Grouping by <code>CAST(paidAt AS DATE)</code> and specialty gives the table the clinic manager asks for; the totals are summed in Java from the same rows, so the footer can never disagree with the lines.</li>
<li>No new filter rule: the URL is under <code>/admin/</code>, so ASM.4's <code>AuthorizationFilter</code> already lets only ADMIN in.</li>
</ul>
<p>The admin logs in (the filter remembers <code>next</code>) and reads October–November: HD1 (cash, 28/10) and HD3 (VNPay, ASM.5); HD2 is still UNPAID and is not counted:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 110

username=admin&amp;password=Admin%40123&amp;next=%2Fphong-kham%2Fadmin%2Freports%3Ffrom%3D2026-10-01%26to%3D2026-11-05</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/reports?from=2026-10-01&amp;to=2026-11-05</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/reports?from=2026-10-01&amp;to=2026-11-05 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(8)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Báo cáo doanh thu · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Báo cáo doanh thu&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/reports"&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="from"&gt;Từ ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="from" name="from" value="2026-10-01"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="to"&gt;Đến ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="to" name="to" value="2026-11-05"&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-auto align-self-end"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Ngày thu&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Số hoá đơn&lt;/th&gt;&lt;th class="text-end"&gt;Doanh thu (đ)&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;28/10/2026&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;200.000&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;Nhi&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;tfoot&gt;&lt;tr class="fw-bold"&gt;&lt;td colspan="2"&gt;Tổng&lt;/td&gt;&lt;td class="text-end"&gt;2&lt;/td&gt;&lt;td class="text-end"&gt;380.000&lt;/td&gt;&lt;/tr&gt;&lt;/tfoot&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Without parameters: from the 1st of this month to "today" (05/11, pinned):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/reports HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(8)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Báo cáo doanh thu · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Báo cáo doanh thu&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/reports"&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="from"&gt;Từ ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="from" name="from" value="2026-11-01"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="to"&gt;Đến ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="to" name="to" value="2026-11-05"&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-auto align-self-end"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Ngày thu&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Số hoá đơn&lt;/th&gt;&lt;th class="text-end"&gt;Doanh thu (đ)&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;Nhi&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;tfoot&gt;&lt;tr class="fw-bold"&gt;&lt;td colspan="2"&gt;Tổng&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;/tr&gt;&lt;/tfoot&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="meo">🧠 The report page has no menu link yet — adding one to <code>_top.jspf</code> for ADMIN is your one-line exercise. A hidden link is not protection anyway (ASM.4).</p>`,
    `<h2>1. UC14 — báo cáo doanh thu (chức năng cuối cùng)</h2>
<p>Luật ở ASM.1: "chỉ tính hoá đơn PAID". Trong câu đó còn giấu hai quyết định: tiền thuộc về ngày được <strong>trả</strong> (<code>paidAt</code>), không phải ngày lập hoá đơn; và ngày "đến" phải được tính trọn cả ngày.</p>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/dal/ReportDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;RevenueRow&gt; revenue(LocalDate from, LocalDate to) throws SQLException {
    String sql = "SELECT CAST(i.paidAt AS DATE) AS d, sp.name, COUNT(*) AS n, SUM(i.amount) AS total "
               + "FROM Invoice i JOIN Appointment a ON a.appointmentId = i.appointmentId "
               + "JOIN MedicalService s ON s.serviceId = a.serviceId JOIN Specialty sp ON sp.specialtyId = s.specialtyId "
               + "WHERE i.status = 'PAID' AND i.paidAt &gt;= ? AND i.paidAt &lt; ? "          // khoảng nửa mở: tính trọn ngày "to"
               + "GROUP BY CAST(i.paidAt AS DATE), sp.name ORDER BY d, sp.name";
    List&lt;RevenueRow&gt; rows = new ArrayList&lt;&gt;();
    DateTimeFormatter vn = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setObject(1, from);
        ps.setObject(2, to.plusDays(1));
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(new RevenueRow(rs.getObject("d", LocalDate.class).format(vn), rs.getString("name"),
                    rs.getInt("n"), rs.getBigDecimal("total")));
        }
    }
    return rows;
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/java/controller/AdminReportController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// ADMIN: doanh thu giữa hai ngày (mặc định: mùng 1 tháng này → hôm nay). /admin/* ⇒ AuthorizationFilter đã chỉ cho ADMIN
@WebServlet("/admin/reports")
public class AdminReportController extends HttpServlet {
    private final ReportDAO reports = new ReportDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        LocalDate today = Clinic.today(getServletContext());
        LocalDate from = date(req.getParameter("from"), today.withDayOfMonth(1));
        LocalDate to = date(req.getParameter("to"), today);
        if (from.isAfter(to)) { LocalDate t = from; from = to; to = t; }        // nhập ngược: chiều người dùng, đổi lại
        try {
            List&lt;RevenueRow&gt; rows = reports.revenue(from, to);
            req.setAttribute("rows", rows);
            req.setAttribute("sum", rows.stream().map(RevenueRow::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
            req.setAttribute("count", rows.stream().mapToInt(RevenueRow::getInvoices).sum());
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        req.setAttribute("from", from);
        req.setAttribute("to", to);
        req.getRequestDispatcher("/WEB-INF/views/admin/reports.jsp").forward(req, resp);
    }

    private static LocalDate date(String s, LocalDate fallback) {
        try { return s == null || s.isBlank() ? fallback : LocalDate.parse(s); } catch (DateTimeParseException e) { return fallback; }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phong-kham/src/main/webapp/WEB-INF/views/admin/reports.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Ngày thu&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Số hoá đơn&lt;/th&gt;&lt;th class="text-end"&gt;Doanh thu (đ)&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;c:forEach items="&#36;{rows}" var="r"&gt;&lt;tr&gt;&lt;td&gt;&#36;{r.day}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{r.specialty}"/&gt;&lt;/td&gt;&lt;td class="text-end"&gt;&#36;{r.invoices}&lt;/td&gt;&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{r.total}" pattern="#,##0"/&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;&lt;c:if test="&#36;{empty rows}"&gt;&lt;tr&gt;&lt;td colspan="4" class="text-center text-muted"&gt;Không có hoá đơn đã thanh toán trong khoảng này.&lt;/td&gt;&lt;/tr&gt;
&lt;/c:if&gt;&lt;/tbody&gt;
&lt;tfoot&gt;&lt;tr class="fw-bold"&gt;&lt;td colspan="2"&gt;Tổng&lt;/td&gt;&lt;td class="text-end"&gt;&#36;{count}&lt;/td&gt;&lt;td class="text-end"&gt;&lt;fmt:formatNumber value="&#36;{sum}" pattern="#,##0"/&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tfoot&gt;
&lt;/table&gt;
&lt;/div&gt;</code></pre>
<ul>
<li><code>paidAt &gt;= from AND paidAt &lt; to + 1 ngày</code> — khoảng <em>nửa mở</em> (half-open). <code>BETWEEN from AND to</code> trên cột <code>DATETIME2</code> sẽ dừng ở 05/11 00:00 và làm mất HD3, trả lúc 10:15 ngày hôm đó.</li>
<li>Gom nhóm theo <code>CAST(paidAt AS DATE)</code> và chuyên khoa cho ra đúng bảng người quản lý phòng khám cần; tổng cộng được cộng trong Java từ chính các dòng đó, nên dòng tổng không bao giờ lệch với các dòng chi tiết.</li>
<li>Không cần luật filter mới: URL nằm dưới <code>/admin/</code>, nên <code>AuthorizationFilter</code> của ASM.4 đã chỉ cho ADMIN vào.</li>
</ul>
<p>Admin đăng nhập (filter nhớ <code>next</code>) và xem tháng 10–11: HD1 (tiền mặt, 28/10) và HD3 (VNPay, ASM.5); HD2 vẫn UNPAID nên không tính:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phong-kham/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 110

username=admin&amp;password=Admin%40123&amp;next=%2Fphong-kham%2Fadmin%2Freports%3Ffrom%3D2026-10-01%26to%3D2026-11-05</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phong-kham/admin/reports?from=2026-10-01&amp;to=2026-11-05</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/reports?from=2026-10-01&amp;to=2026-11-05 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(8)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Báo cáo doanh thu · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Báo cáo doanh thu&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/reports"&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="from"&gt;Từ ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="from" name="from" value="2026-10-01"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="to"&gt;Đến ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="to" name="to" value="2026-11-05"&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-auto align-self-end"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Ngày thu&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Số hoá đơn&lt;/th&gt;&lt;th class="text-end"&gt;Doanh thu (đ)&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;28/10/2026&lt;/td&gt;&lt;td&gt;Nội tổng quát&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;200.000&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;Nhi&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;tfoot&gt;&lt;tr class="fw-bold"&gt;&lt;td colspan="2"&gt;Tổng&lt;/td&gt;&lt;td class="text-end"&gt;2&lt;/td&gt;&lt;td class="text-end"&gt;380.000&lt;/td&gt;&lt;/tr&gt;&lt;/tfoot&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Không có tham số: từ mùng 1 tháng này tới "hôm nay" (05/11, đã ghim):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phong-kham/admin/reports HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(8)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
&lt;meta charset="UTF-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;Báo cáo doanh thu · Phòng khám An Tâm&lt;/title&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous"&gt;
&lt;link rel="stylesheet" href="/phong-kham/css/app.css"&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-3"&gt;
&lt;div class="container"&gt;
&lt;a class="navbar-brand" href="/phong-kham/"&gt;Phòng khám An Tâm&lt;/a&gt;
&lt;button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
        aria-controls="menu" aria-expanded="false" aria-label="Menu"&gt;&lt;span class="navbar-toggler-icon"&gt;&lt;/span&gt;&lt;/button&gt;
&lt;div class="collapse navbar-collapse" id="menu"&gt;
&lt;ul class="navbar-nav me-auto"&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/reception/appointments"&gt;Tiếp đón&lt;/a&gt;&lt;/li&gt;
&lt;li class="nav-item"&gt;&lt;a class="nav-link" href="/phong-kham/admin/services"&gt;Dịch vụ&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;span class="navbar-text me-2"&gt;Quản trị viên (ADMIN)&lt;/span&gt;
&lt;form method="post" action="/phong-kham/logout" class="d-inline"&gt;&lt;button class="btn btn-sm btn-light"&gt;Đăng xuất&lt;/button&gt;&lt;/form&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/nav&gt;
&lt;main class="container"&gt;
&lt;h1 class="h3 mb-3"&gt;Báo cáo doanh thu&lt;/h1&gt;
&lt;form class="row g-2 mb-3" method="get" action="/phong-kham/admin/reports"&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="from"&gt;Từ ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="from" name="from" value="2026-11-01"&gt;&lt;/div&gt;
&lt;div class="col-6 col-md-3"&gt;&lt;label class="form-label" for="to"&gt;Đến ngày&lt;/label&gt;&lt;input class="form-control" type="date" id="to" name="to" value="2026-11-05"&gt;&lt;/div&gt;
&lt;div class="col-12 col-md-auto align-self-end"&gt;&lt;button class="btn btn-outline-primary"&gt;Xem&lt;/button&gt;&lt;/div&gt;
&lt;/form&gt;
&lt;div class="table-responsive"&gt;
&lt;table class="table table-striped align-middle"&gt;
&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Ngày thu&lt;/th&gt;&lt;th&gt;Chuyên khoa&lt;/th&gt;&lt;th class="text-end"&gt;Số hoá đơn&lt;/th&gt;&lt;th class="text-end"&gt;Doanh thu (đ)&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;
&lt;tbody&gt;
&lt;tr&gt;&lt;td&gt;05/11/2026&lt;/td&gt;&lt;td&gt;Nhi&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;/tr&gt;
&lt;/tbody&gt;
&lt;tfoot&gt;&lt;tr class="fw-bold"&gt;&lt;td colspan="2"&gt;Tổng&lt;/td&gt;&lt;td class="text-end"&gt;1&lt;/td&gt;&lt;td class="text-end"&gt;180.000&lt;/td&gt;&lt;/tr&gt;&lt;/tfoot&gt;
&lt;/table&gt;
&lt;/div&gt;
&lt;/main&gt;
&lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="meo">🧠 Trang báo cáo chưa có link trên menu — thêm một dòng vào <code>_top.jspf</code> cho ADMIN là bài tập một dòng của bạn. Mà link ẩn cũng chẳng phải là bảo vệ (ASM.4).</p>`),
    bi(`<h2>2. The report, chapter by chapter — with the clinic filled in</h2>
<table>
<thead><tr><th>Chapter</th><th>Brief's words it answers</th><th>Content</th><th>Clinic sample (where it comes from)</th></tr></thead>
<tbody>
<tr><td>1. Introduction</td><td>—</td><td>the problem, the users, the scope (what is NOT done)</td><td>"Phòng khám An Tâm": online booking, results, invoices, VNPay sandbox; not done: CSRF tokens, attempt limit (ASM.4)</td></tr>
<tr><td>2. Analysis</td><td>analysis of functions</td><td>actor table, use-case diagram, function list with rules, state diagram</td><td>ASM.1 sections 4–5, use-case.puml, trang-thai.puml</td></tr>
<tr><td>3. Design — functions</td><td>design of functions</td><td>architecture (MVC layers), URL map, filter chain, sequence diagrams of 2–3 key flows</td><td>kien-truc.puml (ASM.2), dat-lich.puml (ASM.3), chuoi-loc.puml (ASM.4), thanh-toan.puml (ASM.5)</td></tr>
<tr><td>4. Design — database</td><td>design of the database</td><td>ERD, data dictionary (every column: type, null, constraint, meaning), the "never break" rules</td><td>erd.puml + setup.sql (ASM.2), PaymentTxn (ASM.5)</td></tr>
<tr><td>5. Implementation</td><td>source code</td><td>project structure, technologies and versions, 3–4 code excerpts that show 1.3–1.10</td><td>DAO with PreparedStatement, web.xml filters, pk:pager, Vnpay.hashData</td></tr>
<tr><td>6. Testing</td><td>screenshots of functions</td><td>test-case table (input, expected, actual, screenshot)</td><td>the requests of ASM.2–ASM.6 = your test cases</td></tr>
<tr><td>7. Team work</td><td>clear split of tasks</td><td>task table, Git evidence, self-evaluation</td><td>section 3 below</td></tr>
<tr><td>8. Installation guide</td><td>source code (runs elsewhere)</td><td>requirements, database, environment variables, deploy, demo accounts</td><td>the README of section 8</td></tr>
<tr><td>Appendix</td><td>screenshots of the interface</td><td>every screen, desktop + phone width</td><td>section 4 below</td></tr>
</tbody>
</table>
<h3>A data-dictionary row, filled (chapter 4)</h3>
<table>
<thead><tr><th>Table.column</th><th>Type</th><th>Null</th><th>Constraint</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>PaymentTxn.paymentId</td><td>INT IDENTITY</td><td>no</td><td>PK</td><td>one payment attempt</td></tr>
<tr><td>PaymentTxn.txnRef</td><td>computed 'PK' + paymentId, PERSISTED</td><td>no</td><td>UNIQUE</td><td>vnp_TxnRef sent to VNPay, never repeats</td></tr>
<tr><td>PaymentTxn.invoiceId</td><td>INT</td><td>no</td><td>FK → Invoice</td><td>the invoice being paid</td></tr>
<tr><td>PaymentTxn.amount</td><td>DECIMAL(12,0)</td><td>no</td><td>CHECK &gt; 0</td><td>amount copied from the invoice, compared in the IPN</td></tr>
<tr><td>PaymentTxn.status</td><td>VARCHAR(10)</td><td>no</td><td>CHECK IN (PENDING, SUCCESS, FAILED), DEFAULT PENDING</td><td>written once by the IPN</td></tr>
</tbody>
</table>
<h3>Test cases, filled (chapter 6) — each one is a request that really ran</h3>
<table>
<thead><tr><th>ID</th><th>Function</th><th>Steps / input</th><th>Expected</th><th>Actual (request)</th></tr></thead>
<tbody>
<tr><td>TC-04-2</td><td>UC04 book</td><td>BS. An, 06/11 08:00 (taken)</td><td>409, message, form keeps the input</td><td>as expected (dat-lich-trung, ASM.3)</td></tr>
<tr><td>TC-05-3</td><td>UC05 IDOR</td><td>patient bn.minh opens view?id=5</td><td>403 + log</td><td>as expected (idor-xem, ASM.4)</td></tr>
<tr><td>TC-07-1</td><td>UC07 pay</td><td>HD2 of another patient</td><td>403</td><td>as expected (tt-cua-nguoi-khac, ASM.5)</td></tr>
<tr><td>TC-07-4</td><td>UC07 pay</td><td>same IPN twice</td><td>02, invoice paid once</td><td>as expected (ipn-lan-2, ASM.5)</td></tr>
<tr><td>TC-07-5</td><td>UC07 pay</td><td>IPN with edited code, old checksum</td><td>97</td><td>as expected (ipn-sai-chu-ky, ASM.5)</td></tr>
<tr><td>TC-14-1</td><td>UC14 report</td><td>01/10–05/11</td><td>2 invoices, 380.000 đ</td><td>as expected (bao-cao, ASM.6)</td></tr>
</tbody>
</table>
<div class="pitfall">The two most common analysis mistakes: a "use case" list that is really a list of screens ("trang đăng nhập", "trang danh sách"), and an ERD that does not match <code>setup.sql</code> (a column renamed in week 4, never in the diagram). Generate the ERD from the final script, the use-case table from the final URL map — the day before submitting, not week 1.</div>`,
    `<h2>2. Quyển báo cáo, từng chương — điền sẵn bằng phòng khám</h2>
<table>
<thead><tr><th>Chương</th><th>Trả lời câu nào của đề</th><th>Nội dung</th><th>Mẫu phòng khám (lấy từ đâu)</th></tr></thead>
<tbody>
<tr><td>1. Giới thiệu</td><td>—</td><td>bài toán, người dùng, phạm vi (cái gì KHÔNG làm)</td><td>"Phòng khám An Tâm": đặt lịch online, kết quả khám, hoá đơn, VNPay sandbox; không làm: token CSRF, giới hạn số lần đăng nhập (ASM.4)</td></tr>
<tr><td>2. Phân tích</td><td>phân tích chức năng</td><td>bảng tác nhân, sơ đồ use case, danh sách chức năng kèm luật, sơ đồ trạng thái</td><td>ASM.1 mục 4–5, use-case.puml, trang-thai.puml</td></tr>
<tr><td>3. Thiết kế — chức năng</td><td>thiết kế chức năng</td><td>kiến trúc (các tầng MVC), bảng URL, chuỗi filter, sơ đồ tuần tự của 2–3 luồng chính</td><td>kien-truc.puml (ASM.2), dat-lich.puml (ASM.3), chuoi-loc.puml (ASM.4), thanh-toan.puml (ASM.5)</td></tr>
<tr><td>4. Thiết kế — CSDL</td><td>thiết kế cơ sở dữ liệu</td><td>ERD, từ điển dữ liệu (mỗi cột: kiểu, null, ràng buộc, ý nghĩa), các luật "không bao giờ phá"</td><td>erd.puml + setup.sql (ASM.2), PaymentTxn (ASM.5)</td></tr>
<tr><td>5. Cài đặt</td><td>mã nguồn</td><td>cấu trúc project, công nghệ và phiên bản, 3–4 đoạn code chứng minh 1.3–1.10</td><td>DAO dùng PreparedStatement, filter trong web.xml, pk:pager, Vnpay.hashData</td></tr>
<tr><td>6. Kiểm thử</td><td>hình ảnh chức năng</td><td>bảng test case (đầu vào, mong đợi, thực tế, ảnh chụp)</td><td>các request của ASM.2–ASM.6 = test case của bạn</td></tr>
<tr><td>7. Làm việc nhóm</td><td>phân công rõ ràng</td><td>bảng nhiệm vụ, bằng chứng Git, tự đánh giá</td><td>mục 3 bên dưới</td></tr>
<tr><td>8. Hướng dẫn cài đặt</td><td>mã nguồn (chạy được nơi khác)</td><td>yêu cầu, CSDL, biến môi trường, deploy, tài khoản demo</td><td>README ở mục 8</td></tr>
<tr><td>Phụ lục</td><td>hình ảnh giao diện</td><td>mọi màn hình, bản desktop + bề ngang điện thoại</td><td>mục 4 bên dưới</td></tr>
</tbody>
</table>
<h3>Một đoạn từ điển dữ liệu, điền sẵn (chương 4)</h3>
<table>
<thead><tr><th>Bảng.cột</th><th>Kiểu</th><th>Null</th><th>Ràng buộc</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td>PaymentTxn.paymentId</td><td>INT IDENTITY</td><td>không</td><td>PK</td><td>một lần thử thanh toán</td></tr>
<tr><td>PaymentTxn.txnRef</td><td>tính 'PK' + paymentId, PERSISTED</td><td>không</td><td>UNIQUE</td><td>vnp_TxnRef gửi VNPay, không bao giờ trùng</td></tr>
<tr><td>PaymentTxn.invoiceId</td><td>INT</td><td>không</td><td>FK → Invoice</td><td>hoá đơn đang được trả</td></tr>
<tr><td>PaymentTxn.amount</td><td>DECIMAL(12,0)</td><td>không</td><td>CHECK &gt; 0</td><td>số tiền chép từ hoá đơn, IPN dùng để so</td></tr>
<tr><td>PaymentTxn.status</td><td>VARCHAR(10)</td><td>không</td><td>CHECK IN (PENDING, SUCCESS, FAILED), DEFAULT PENDING</td><td>IPN ghi đúng một lần</td></tr>
</tbody>
</table>
<h3>Test case, điền sẵn (chương 6) — mỗi dòng là một request đã chạy thật</h3>
<table>
<thead><tr><th>Mã</th><th>Chức năng</th><th>Bước / đầu vào</th><th>Mong đợi</th><th>Thực tế (request)</th></tr></thead>
<tbody>
<tr><td>TC-04-2</td><td>UC04 đặt lịch</td><td>BS. An, 06/11 08:00 (đã có người)</td><td>409, thông báo, form giữ dữ liệu đã nhập</td><td>đúng (dat-lich-trung, ASM.3)</td></tr>
<tr><td>TC-05-3</td><td>UC05 IDOR</td><td>bệnh nhân bn.minh mở view?id=5</td><td>403 + log</td><td>đúng (idor-xem, ASM.4)</td></tr>
<tr><td>TC-07-1</td><td>UC07 thanh toán</td><td>HD2 của bệnh nhân khác</td><td>403</td><td>đúng (tt-cua-nguoi-khac, ASM.5)</td></tr>
<tr><td>TC-07-4</td><td>UC07 thanh toán</td><td>cùng một IPN hai lần</td><td>02, hoá đơn chỉ trả một lần</td><td>đúng (ipn-lan-2, ASM.5)</td></tr>
<tr><td>TC-07-5</td><td>UC07 thanh toán</td><td>IPN sửa mã, giữ checksum cũ</td><td>97</td><td>đúng (ipn-sai-chu-ky, ASM.5)</td></tr>
<tr><td>TC-14-1</td><td>UC14 báo cáo</td><td>01/10–05/11</td><td>2 hoá đơn, 380.000 đ</td><td>đúng (bao-cao, ASM.6)</td></tr>
</tbody>
</table>
<div class="pitfall">Hai lỗi phân tích phổ biến nhất: danh sách "use case" thực ra là danh sách màn hình ("trang đăng nhập", "trang danh sách"), và ERD không khớp <code>setup.sql</code> (một cột đổi tên ở tuần 4 mà sơ đồ không đổi). Dựng ERD từ script cuối cùng, bảng use case từ bảng URL cuối cùng — vào hôm trước khi nộp, không phải tuần 1.</div>`),
    bi(`<h2>3. The split of tasks — and the evidence that it is true</h2>
<p>The brief asks for "a clear split of tasks for each member". A table alone is a claim; markers increasingly open the Git history to check it. Keep the vertical split of ASM.1 and attach the evidence:</p>
<table>
<thead><tr><th>Member</th><th>Use cases owned</th><th>Shared piece</th><th>Evidence (commits / PR)</th><th>Self-assessed share</th></tr></thead>
<tbody>
<tr><td>Nguyễn A (lead)</td><td>UC02, UC03</td><td>layout, 2 filters, merging</td><td>31 commits · PR #2 #5 #9</td><td>22%</td></tr>
<tr><td>Trần B</td><td>UC12, UC13</td><td>pk:pager tag</td><td>24 commits · PR #3 #7</td><td>19%</td></tr>
<tr><td>Lê C</td><td>UC01, UC04, UC05</td><td>setup.sql</td><td>27 commits · PR #4 #8</td><td>21%</td></tr>
<tr><td>Phạm D</td><td>UC08, UC09</td><td>statusBadge tag file</td><td>19 commits · PR #6 #10</td><td>18%</td></tr>
<tr><td>Hoàng E</td><td>UC10, UC11, UC07, UC14</td><td>the report</td><td>25 commits · PR #11 #12</td><td>20%</td></tr>
</tbody>
</table>
<p>(Names and numbers are placeholders — write yours.) The commands that produce the evidence, run on the final <code>main</code>:</p>
<pre><code class="language-bash">git shortlog -sne main                                   # commits per author (name + e-mail)
git log --author="Le C" --stat --oneline main            # what one member changed, file by file
git log --format="%h %an %ad %s" --date=short -- src/main/java/payment   # who wrote the payment package
git log --since=2026-10-01 --until=2026-11-10 --oneline | wc -l          # activity during the project</code></pre>
<ul>
<li>Configure Git with your real name and school e-mail on every machine (<code>git config --global user.name</code> / <code>user.email</code>) — commits made as "admin" from a lab PC count for nobody.</li>
<li>Pair work is fine: write it in the table ("UC07: E + A, pair programming") rather than letting one person's account hold all the commits.</li>
<li>Commit messages that name the use case (<code>feat(UC07): IPN idempotent</code>, ASM.2) make <code>git log --grep=UC07</code> a ready-made contribution list.</li>
</ul>`,
    `<h2>3. Phân công — và bằng chứng rằng nó đúng</h2>
<p>Đề đòi "phân công rõ ràng nhiệm vụ cho từng thành viên nhóm". Chỉ một cái bảng thì mới là lời khẳng định; người chấm ngày càng hay mở lịch sử Git ra kiểm. Giữ cách chia dọc của ASM.1 và kèm bằng chứng:</p>
<table>
<thead><tr><th>Thành viên</th><th>Use case sở hữu</th><th>Mảnh dùng chung</th><th>Bằng chứng (commit / PR)</th><th>Tự đánh giá phần đóng góp</th></tr></thead>
<tbody>
<tr><td>Nguyễn A (nhóm trưởng)</td><td>UC02, UC03</td><td>layout, 2 filter, ghép code</td><td>31 commit · PR #2 #5 #9</td><td>22%</td></tr>
<tr><td>Trần B</td><td>UC12, UC13</td><td>thẻ pk:pager</td><td>24 commit · PR #3 #7</td><td>19%</td></tr>
<tr><td>Lê C</td><td>UC01, UC04, UC05</td><td>setup.sql</td><td>27 commit · PR #4 #8</td><td>21%</td></tr>
<tr><td>Phạm D</td><td>UC08, UC09</td><td>tag file statusBadge</td><td>19 commit · PR #6 #10</td><td>18%</td></tr>
<tr><td>Hoàng E</td><td>UC10, UC11, UC07, UC14</td><td>quyển báo cáo</td><td>25 commit · PR #11 #12</td><td>20%</td></tr>
</tbody>
</table>
<p>(Tên và số liệu là chỗ trống để minh hoạ — điền của nhóm bạn.) Các lệnh tạo ra bằng chứng, chạy trên <code>main</code> cuối cùng:</p>
<pre><code class="language-bash">git shortlog -sne main                                   # số commit theo tác giả (tên + email)
git log --author="Le C" --stat --oneline main            # một thành viên đã sửa gì, từng file
git log --format="%h %an %ad %s" --date=short -- src/main/java/payment   # ai viết gói payment
git log --since=2026-10-01 --until=2026-11-10 --oneline | wc -l          # mức hoạt động trong thời gian làm</code></pre>
<ul>
<li>Cấu hình Git bằng tên thật và email trường trên mọi máy (<code>git config --global user.name</code> / <code>user.email</code>) — commit dưới tên "admin" từ máy phòng lab không tính cho ai cả.</li>
<li>Làm cặp cũng được: ghi rõ vào bảng ("UC07: E + A, lập trình cặp") thay vì để một tài khoản ôm hết commit.</li>
<li>Commit message có tên use case (<code>feat(UC07): IPN idempotent</code>, ASM.2) biến <code>git log --grep=UC07</code> thành danh sách đóng góp có sẵn.</li>
</ul>`),
    bi(`<h2>4. Screenshots of the interface and functions</h2>
<p>The brief asks for "images of the interface and functions". Screenshots prove two requirements on paper that are hard to prove otherwise: Bootstrap (1.4) and responsive (1.7).</p>
<ul>
<li><strong>One per function, not per page:</strong> the booking form with its 409 message, the 403 page after an IDOR attempt, the gateway page, the "Thanh toán thành công" box, the revenue table. Caption each with its use-case code and the test case ID of section 2.</li>
<li><strong>Two widths</strong> for 3–4 key pages: desktop and a phone (Chrome DevTools → Toggle device toolbar, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd>, e.g. 390 px): the collapsed navbar, the stacked doctor cards, the table that scrolls sideways.</li>
<li><strong>Clean data:</strong> run <code>setup.sql</code> again before capturing, so the screenshots match the test-case table and contain no "test test 123".</li>
<li><strong>Show the server side once:</strong> one capture of the NetBeans Output window with the IPN log line and one of SSMS showing the PaymentTxn rows — proof that the payment really went through your server.</li>
</ul>`,
    `<h2>4. Hình ảnh giao diện và chức năng</h2>
<p>Đề đòi "hình ảnh giao diện và chức năng của ứng dụng". Ảnh chụp chứng minh trên giấy hai yêu cầu khó chứng minh bằng cách khác: Bootstrap (1.4) và responsive (1.7).</p>
<ul>
<li><strong>Mỗi chức năng một ảnh, không phải mỗi trang:</strong> form đặt lịch với thông báo 409, trang 403 sau lần thử IDOR, trang của cổng thanh toán, ô "Thanh toán thành công", bảng doanh thu. Chú thích mỗi ảnh bằng mã use case và mã test case ở mục 2.</li>
<li><strong>Hai bề ngang</strong> cho 3–4 trang chính: desktop và điện thoại (Chrome DevTools → Toggle device toolbar, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd>, vd 390 px): navbar gập lại, thẻ bác sĩ xếp chồng, bảng cuộn ngang.</li>
<li><strong>Dữ liệu sạch:</strong> chạy lại <code>setup.sql</code> trước khi chụp, để ảnh khớp bảng test case và không có chữ "test test 123".</li>
<li><strong>Cho thấy phía server một lần:</strong> một ảnh cửa sổ Output của NetBeans có dòng log IPN và một ảnh SSMS hiện các dòng PaymentTxn — bằng chứng thanh toán thật sự đi qua server của bạn.</li>
</ul>`),
    bi(`<h2>5. Self-check: every requirement → the proof that runs</h2>
<table>
<thead><tr><th>Req.</th><th>Done when…</th><th>Proof in the sample (request · lesson)</th></tr></thead>
<tbody>
<tr><td>1.1 actors</td><td>5 actors described, each with an account and pages</td><td>actor table + use-case diagram · ASM.1</td></tr>
<tr><td>1.2 functions</td><td>UC01–UC14 with testable rules, each demonstrable</td><td>function table · ASM.1; this section's requests</td></tr>
<tr><td>1.3 MVC</td><td>controller → service → DAO → JSP under WEB-INF; JSP not reachable</td><td>jsp-an (404) · ASM.2</td></tr>
<tr><td>1.4 HTML5/CSS3/Bootstrap 5</td><td>Bootstrap 5.3 with SRI, own app.css (variables, transition, media query)</td><td>css · ASM.2–ASM.3</td></tr>
<tr><td>1.5 Servlet/JSP</td><td>servlets with doGet/doPost, PRG after POST</td><td>dv-them (302) · ASM.3</td></tr>
<tr><td>1.6 SQL Server + JDBC</td><td>setup.sql runs twice; PreparedStatement everywhere; transactions</td><td>dat-lich-trung, dang-ky · ASM.2–ASM.4</td></tr>
<tr><td>1.7 responsive</td><td>navbar-expand-lg, grid, table-responsive, viewport meta</td><td>screenshots at 390 px · section 4</td></tr>
<tr><td>1.8 JSTL + custom tag</td><td>no scriptlet; pk:pager + ui:statusBadge used on 2+ pages</td><td>lt-loc-trang-2 · ASM.3</td></tr>
<tr><td>1.9 Filter by business rule</td><td>role filter + ownership (IDOR) + 403 page</td><td>bn-vao-admin, idor-xem, bs-sua-cua-nguoi-khac · ASM.4</td></tr>
<tr><td>1.10 sandbox payment</td><td>signed redirect, IPN idempotent, return verifies, secret in env</td><td>cong-tra, ipn-lan-2, ipn-sai-chu-ky · ASM.5</td></tr>
<tr><td>Report</td><td>8 chapters + appendix, ERD = script, test cases with screenshots</td><td>section 2</td></tr>
<tr><td>Team split</td><td>task table + Git evidence</td><td>section 3</td></tr>
</tbody>
</table>
<p>Then the hostile pass, the way a marker does it: a private window; type every <code>/admin</code> URL as a patient; change every <code>?id=</code>; submit every form empty; press F5 after every POST; open the site at 390 px. Any 500 or stack trace is a lost point that takes five minutes to fix today.</p>`,
    `<h2>5. Tự chấm: mỗi yêu cầu → bằng chứng đang chạy</h2>
<table>
<thead><tr><th>Yêu cầu</th><th>Xong khi…</th><th>Bằng chứng trong bản mẫu (request · bài)</th></tr></thead>
<tbody>
<tr><td>1.1 tác nhân</td><td>5 tác nhân được mô tả, ai cũng có tài khoản và trang</td><td>bảng tác nhân + sơ đồ use case · ASM.1</td></tr>
<tr><td>1.2 chức năng</td><td>UC01–UC14 có luật kiểm chứng được, cái nào cũng demo được</td><td>bảng chức năng · ASM.1; các request của mục này</td></tr>
<tr><td>1.3 MVC</td><td>controller → service → DAO → JSP dưới WEB-INF; không mở thẳng được JSP</td><td>jsp-an (404) · ASM.2</td></tr>
<tr><td>1.4 HTML5/CSS3/Bootstrap 5</td><td>Bootstrap 5.3 có SRI, app.css tự viết (biến, transition, media query)</td><td>css · ASM.2–ASM.3</td></tr>
<tr><td>1.5 Servlet/JSP</td><td>servlet có doGet/doPost, PRG sau POST</td><td>dv-them (302) · ASM.3</td></tr>
<tr><td>1.6 SQL Server + JDBC</td><td>setup.sql chạy hai lần được; PreparedStatement ở mọi nơi; transaction</td><td>dat-lich-trung, dang-ky · ASM.2–ASM.4</td></tr>
<tr><td>1.7 responsive</td><td>navbar-expand-lg, lưới, table-responsive, thẻ meta viewport</td><td>ảnh chụp ở 390 px · mục 4</td></tr>
<tr><td>1.8 JSTL + CustomTag</td><td>không scriptlet; pk:pager + ui:statusBadge dùng ở 2+ trang</td><td>lt-loc-trang-2 · ASM.3</td></tr>
<tr><td>1.9 Filter theo nghiệp vụ</td><td>filter vai trò + chủ sở hữu (IDOR) + trang 403</td><td>bn-vao-admin, idor-xem, bs-sua-cua-nguoi-khac · ASM.4</td></tr>
<tr><td>1.10 thanh toán sandbox</td><td>chuyển hướng có chữ ký, IPN luỹ đẳng, return kiểm chữ ký, secret trong biến môi trường</td><td>cong-tra, ipn-lan-2, ipn-sai-chu-ky · ASM.5</td></tr>
<tr><td>Báo cáo</td><td>8 chương + phụ lục, ERD = script, test case có ảnh</td><td>mục 2</td></tr>
<tr><td>Phân công</td><td>bảng nhiệm vụ + bằng chứng Git</td><td>mục 3</td></tr>
</tbody>
</table>
<p>Sau đó là lượt "phá", đúng cách người chấm làm: cửa sổ ẩn danh; đăng nhập bệnh nhân rồi gõ mọi URL <code>/admin</code>; đổi mọi <code>?id=</code>; gửi mọi form để trống; bấm F5 sau mọi POST; mở trang ở 390 px. Mỗi lỗi 500 hay stack trace là một điểm mất mà hôm nay chỉ cần năm phút để sửa.</p>`),
    bi(`<h2>6. The 10-minute demo</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/01eae1ce8dd4c9a5fa033e6a7afd737cf2882f57.svg" alt="One story in ten minutes: each step shows a requirement, with the time it may take" loading="lazy" /><p class="chu-thich">🧩 One story in ten minutes: each step shows a requirement, with the time it may take</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title A 10-minute defence demo: one story, every requirement touched once
start
:0:00 Guest — home page from the database (1.5, 1.6)\\nshrink the window: navbar collapses, tables scroll (1.4, 1.7);
:0:45 Guest — register with errors, then OK (UC02)\\nlog in: a new session id (UC03);
:1:45 Patient — book: a taken slot ⇒ 409, a free slot ⇒ PRG (UC04);
:2:45 Patient — change ?id= in the address bar ⇒ 403 (1.9, IDOR);
:3:30 Doctor — today's schedule, write the result ⇒ DONE (UC08, UC09)\\nanother doctor's visit ⇒ 403;
:4:30 Receptionist — search + filter + pager tag (UC10, 1.8)\\ncreate the invoice (UC11);
:5:30 Patient — pay in the sandbox: cancel once, then the test card ⇒ PAID (1.10)\\nshow the IPN line in the server log;
:7:00 Admin — services CRUD, delete a used one ⇒ friendly error (UC12)\\nrevenue report (UC14);
:8:00 Code tour — web.xml filters, one DAO with PreparedStatement,\\none JSP with JSTL + the custom tag;
:9:00 Questions;
stop
@enduml</code></pre></details>
<ul>
<li><strong>Prepare the stage:</strong> run <code>setup.sql</code> 10 minutes before; open one browser profile (or private window) per role, already logged in; zoom to 125% so the back row can read; NetBeans Output visible for the IPN line.</li>
<li><strong>Tell a story, not a menu tour:</strong> "a patient books, the doctor examines, the receptionist bills, the patient pays, the manager reads the revenue" touches every requirement once.</li>
<li><strong>Show failures on purpose</strong> (409, 403, signature refused): they prove the rules better than any success.</li>
<li><strong>Plan B:</strong> the sandbox or the school Wi-Fi may be down. Keep the demo mode (fake gateway) switchable by removing two environment variables, and a 60-second screen recording of the real sandbox payment.</li>
<li>Each member presents <strong>his own</strong> use cases — that is also how the teacher checks the task table.</li>
</ul>`,
    `<h2>6. Buổi demo 10 phút</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/01eae1ce8dd4c9a5fa033e6a7afd737cf2882f57.svg" alt="Một câu chuyện trong mười phút: mỗi bước cho thấy một yêu cầu, kèm thời gian được phép dùng" loading="lazy" /><p class="chu-thich">🧩 Một câu chuyện trong mười phút: mỗi bước cho thấy một yêu cầu, kèm thời gian được phép dùng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title A 10-minute defence demo: one story, every requirement touched once
start
:0:00 Guest — home page from the database (1.5, 1.6)\\nshrink the window: navbar collapses, tables scroll (1.4, 1.7);
:0:45 Guest — register with errors, then OK (UC02)\\nlog in: a new session id (UC03);
:1:45 Patient — book: a taken slot ⇒ 409, a free slot ⇒ PRG (UC04);
:2:45 Patient — change ?id= in the address bar ⇒ 403 (1.9, IDOR);
:3:30 Doctor — today's schedule, write the result ⇒ DONE (UC08, UC09)\\nanother doctor's visit ⇒ 403;
:4:30 Receptionist — search + filter + pager tag (UC10, 1.8)\\ncreate the invoice (UC11);
:5:30 Patient — pay in the sandbox: cancel once, then the test card ⇒ PAID (1.10)\\nshow the IPN line in the server log;
:7:00 Admin — services CRUD, delete a used one ⇒ friendly error (UC12)\\nrevenue report (UC14);
:8:00 Code tour — web.xml filters, one DAO with PreparedStatement,\\none JSP with JSTL + the custom tag;
:9:00 Questions;
stop
@enduml</code></pre></details>
<ul>
<li><strong>Chuẩn bị sân khấu:</strong> chạy <code>setup.sql</code> trước 10 phút; mỗi vai trò một hồ sơ trình duyệt (hoặc cửa sổ ẩn danh), đăng nhập sẵn; phóng to 125% cho bàn cuối đọc được; để cửa sổ Output của NetBeans nhìn thấy dòng log IPN.</li>
<li><strong>Kể một câu chuyện, đừng đi tham quan menu:</strong> "bệnh nhân đặt lịch, bác sĩ khám, lễ tân lập hoá đơn, bệnh nhân thanh toán, quản lý xem doanh thu" chạm vào mọi yêu cầu đúng một lần.</li>
<li><strong>Cố ý cho xem các lần thất bại</strong> (409, 403, chữ ký bị từ chối): chúng chứng minh luật tốt hơn bất kỳ lần thành công nào.</li>
<li><strong>Phương án B:</strong> sandbox hoặc Wi-Fi trường có thể sập. Giữ chế độ demo (cổng giả) bật được bằng cách bỏ hai biến môi trường, và một đoạn quay màn hình 60 giây lần thanh toán thật trên sandbox.</li>
<li>Mỗi thành viên trình bày use case <strong>của chính mình</strong> — đó cũng là cách giảng viên kiểm bảng phân công.</li>
</ul>`),
    bi(`<h2>7. Fifteen questions examiners ask — with answers from YOUR code</h2>
<p>Answer with a file name and a line, not with a definition from the slides. Each answer below points at the clinic; replace with yours.</p>
<ol>
<li><strong>"Where is the MVC in your project?"</strong> — Model: <code>model/*</code> + <code>dal/*</code> (data and SQL); View: JSP under <code>WEB-INF/views</code> (cannot be opened directly — request <code>jsp-an</code> gives 404); Controller: servlets in <code>controller/*</code>, which read parameters, call a service, choose the view. No SQL in any JSP, no HTML in any servlet.</li>
<li><strong>"How many instances of a servlet are there?"</strong> — One per declaration; the container calls <code>service()</code> on it from many threads at once. So servlets keep no per-request data in fields; our fields are stateless DAOs/services only.</li>
<li><strong>"forward or redirect — when?"</strong> — <code>forward</code> stays on the server, same request, URL unchanged: to show a view or the 403 page. <code>sendRedirect</code> sends a 302, the browser makes a new GET: after every successful POST (PRG), so F5 does not repeat it.</li>
<li><strong>"What does your Filter do, and in which order?"</strong> — <code>AuthorizationFilter</code> (role by URL area), then <code>OwnershipFilter</code> (is this <code>?id=</code> yours). Order = order of <code>&lt;filter-mapping&gt;</code> in <code>web.xml</code>; with <code>@WebFilter</code> the order is undefined by the spec.</li>
<li><strong>"Why PreparedStatement?"</strong> — The SQL text is fixed and sent first; values travel separately as parameters, so <code>' OR 1=1 --</code> is just a string. It also handles quotes in names (O'Brien) and dates correctly. Every DAO uses it.</li>
<li><strong>"How does the server remember a logged-in user?"</strong> — <code>HttpSession</code>: the server keeps an object, the browser keeps only the <code>JSESSIONID</code> cookie (HttpOnly). Timeout 30 minutes in <code>web.xml</code>; logout calls <code>invalidate()</code>; login calls <code>changeSessionId()</code> against session fixation.</li>
<li><strong>"Why JSTL instead of scriptlets?"</strong> — Views without Java code are readable by the front-end member and testable; <code>&lt;c:out&gt;</code> escapes HTML, so a patient named <code>&lt;script&gt;</code> cannot inject JavaScript (XSS).</li>
<li><strong>"Show your custom tag."</strong> — <code>pk:pager</code>: a <code>SimpleTagSupport</code> class + <code>pk.tld</code>, used on the services and reception lists; it keeps the search parameters in every page link. Plus a tag file <code>statusBadge.tag</code>, no Java at all.</li>
<li><strong>"Where do you use a transaction, and why?"</strong> — Registration (Account + Patient: both or neither) and the IPN (attempt SUCCESS + invoice PAID). <code>setAutoCommit(false)</code>, <code>commit()</code>, <code>rollback()</code> in <code>catch</code>.</li>
<li><strong>"How are passwords stored?"</strong> — PBKDF2-HMAC-SHA256, 600,000 iterations, a random salt per user, from the JDK (<code>SecretKeyFactory</code>); compared with <code>MessageDigest.isEqual</code>. Never plain text, never reversible.</li>
<li><strong>"Can patient A see patient B's appointment?"</strong> — No, three locks: role filter, ownership filter (403 + log), and <code>AND patientId = ?</code> with the id from the session in the SQL. Show request <code>idor-xem</code>.</li>
<li><strong>"How do you know the payment result is not fake?"</strong> — Every return/IPN is signed with HMAC-SHA512 using a secret only VNPay and our server know; we recompute and compare before reading any value. Editing one parameter ⇒ 97 (request <code>ipn-sai-chu-ky</code>). The secret is an environment variable, not in the code.</li>
<li><strong>"What if VNPay calls the IPN twice?"</strong> — The handler is idempotent: the attempt must still be PENDING, and the UPDATE has <code>AND status = 'PENDING'</code>, so the second call changes 0 rows and answers 02 (request <code>ipn-lan-2</code>).</li>
<li><strong>"Two patients book the same slot at the same moment?"</strong> — The service checks first, and the filtered unique index <code>UX_Appointment_Doctor_Slot</code> is the final lock: the second INSERT fails with error 2601 and gets a friendly 409 (ASM.3).</li>
<li><strong>"How is it responsive?"</strong> — <code>&lt;meta name="viewport"&gt;</code>, Bootstrap grid (<code>col-12 col-md-6</code>), <code>navbar-expand-lg</code> + toggler, <code>table-responsive</code>, one own media query in <code>app.css</code>. Show it live by narrowing the window.</li>
</ol>
<div class="pitfall">The killer question is the follow-up: "change this rule now". Be able to change one rule live (e.g. 30 days → 14 days in <code>Clinic.BOOK_AHEAD_DAYS</code>, rebuild, show the new error). A member who cannot find where his own rule lives loses the marks of that use case, whatever the table says.</div>`,
    `<h2>7. Mười lăm câu hội đồng hay hỏi — trả lời bằng code CỦA BẠN</h2>
<p>Trả lời bằng tên file và một dòng code, không bằng định nghĩa chép từ slide. Mỗi câu trả lời dưới đây chỉ vào phòng khám; thay bằng của bạn.</p>
<ol>
<li><strong>"MVC nằm ở đâu trong project của em?"</strong> — Model: <code>model/*</code> + <code>dal/*</code> (dữ liệu và SQL); View: JSP dưới <code>WEB-INF/views</code> (không mở thẳng được — request <code>jsp-an</code> trả 404); Controller: các servlet trong <code>controller/*</code>, đọc tham số, gọi service, chọn view. Không JSP nào có SQL, không servlet nào in HTML.</li>
<li><strong>"Một servlet có bao nhiêu đối tượng?"</strong> — Một cho mỗi khai báo; container gọi <code>service()</code> trên nó từ nhiều luồng cùng lúc. Vì thế servlet không giữ dữ liệu theo request trong field; field của chúng ta chỉ là DAO/service không trạng thái.</li>
<li><strong>"forward hay redirect — khi nào?"</strong> — <code>forward</code> ở lại server, cùng một request, URL không đổi: để hiện view hoặc trang 403. <code>sendRedirect</code> trả 302, trình duyệt gửi một GET mới: sau mọi POST thành công (PRG), để F5 không gửi lại.</li>
<li><strong>"Filter của em làm gì, theo thứ tự nào?"</strong> — <code>AuthorizationFilter</code> (vai trò theo khu URL), rồi <code>OwnershipFilter</code> (<code>?id=</code> này có phải của bạn). Thứ tự = thứ tự <code>&lt;filter-mapping&gt;</code> trong <code>web.xml</code>; dùng <code>@WebFilter</code> thì đặc tả không xác định thứ tự.</li>
<li><strong>"Vì sao PreparedStatement?"</strong> — Câu SQL cố định và được gửi trước; giá trị đi riêng dưới dạng tham số, nên <code>' OR 1=1 --</code> chỉ là một chuỗi. Nó còn xử lý đúng dấu nháy trong tên (O'Brien) và ngày tháng. DAO nào cũng dùng.</li>
<li><strong>"Server nhớ người đã đăng nhập bằng cách nào?"</strong> — <code>HttpSession</code>: server giữ một đối tượng, trình duyệt chỉ giữ cookie <code>JSESSIONID</code> (HttpOnly). Hết hạn sau 30 phút theo <code>web.xml</code>; đăng xuất gọi <code>invalidate()</code>; đăng nhập gọi <code>changeSessionId()</code> chống session fixation (cố định phiên).</li>
<li><strong>"Vì sao JSTL thay cho scriptlet?"</strong> — View không có code Java thì bạn làm giao diện đọc được và kiểm được; <code>&lt;c:out&gt;</code> thoát HTML, nên bệnh nhân tên <code>&lt;script&gt;</code> không chèn được JavaScript (XSS).</li>
<li><strong>"Cho xem custom tag của em."</strong> — <code>pk:pager</code>: một lớp <code>SimpleTagSupport</code> + <code>pk.tld</code>, dùng ở danh sách dịch vụ và danh sách tiếp đón; nó giữ tham số tìm kiếm trong mọi link trang. Thêm một tag file <code>statusBadge.tag</code>, không có dòng Java nào.</li>
<li><strong>"Em dùng transaction ở đâu, vì sao?"</strong> — Đăng ký (Account + Patient: cả hai hoặc không gì cả) và IPN (lần thử SUCCESS + hoá đơn PAID). <code>setAutoCommit(false)</code>, <code>commit()</code>, <code>rollback()</code> trong <code>catch</code>.</li>
<li><strong>"Mật khẩu lưu thế nào?"</strong> — PBKDF2-HMAC-SHA256, 600.000 vòng, salt ngẫu nhiên cho mỗi người, có sẵn trong JDK (<code>SecretKeyFactory</code>); so bằng <code>MessageDigest.isEqual</code>. Không bao giờ chữ thường, không bao giờ đảo ngược được.</li>
<li><strong>"Bệnh nhân A xem được lịch của bệnh nhân B không?"</strong> — Không, ba ổ khoá: filter vai trò, filter chủ sở hữu (403 + log), và <code>AND patientId = ?</code> với id lấy từ session trong câu SQL. Cho xem request <code>idor-xem</code>.</li>
<li><strong>"Làm sao biết kết quả thanh toán không phải đồ giả?"</strong> — Mọi return/IPN đều ký HMAC-SHA512 bằng một secret chỉ VNPay và server của chúng ta biết; chúng ta tính lại và so trước khi đọc bất kỳ giá trị nào. Sửa một tham số ⇒ 97 (request <code>ipn-sai-chu-ky</code>). Secret là biến môi trường, không nằm trong code.</li>
<li><strong>"Nếu VNPay gọi IPN hai lần?"</strong> — Bộ xử lý luỹ đẳng: lần thử phải còn PENDING, và câu UPDATE có <code>AND status = 'PENDING'</code>, nên lần gọi thứ hai đổi 0 dòng và trả 02 (request <code>ipn-lan-2</code>).</li>
<li><strong>"Hai bệnh nhân đặt cùng một giờ cùng một lúc?"</strong> — Service kiểm trước, và chỉ mục duy nhất có lọc <code>UX_Appointment_Doctor_Slot</code> là ổ khoá cuối: lệnh INSERT thứ hai lỗi 2601 và nhận 409 thân thiện (ASM.3).</li>
<li><strong>"Responsive làm thế nào?"</strong> — <code>&lt;meta name="viewport"&gt;</code>, lưới Bootstrap (<code>col-12 col-md-6</code>), <code>navbar-expand-lg</code> + nút gập, <code>table-responsive</code>, một media query tự viết trong <code>app.css</code>. Thu hẹp cửa sổ để cho xem trực tiếp.</li>
</ol>
<div class="pitfall">Câu "chết người" là câu hỏi nối tiếp: "giờ em sửa luật này đi". Phải sửa được một luật ngay tại chỗ (vd 30 ngày → 14 ngày ở <code>Clinic.BOOK_AHEAD_DAYS</code>, build lại, cho xem thông báo lỗi mới). Thành viên không tìm ra luật của chính mình nằm ở đâu sẽ mất điểm của use case đó, bảng phân công ghi gì cũng vậy.</div>`),
    bi(`<h2>8. Submitting: what goes in the zip, and what kills a submission</h2>
<pre><code class="language-plaintext">PRJ301_SE19xx_Nhom3_PhongKham.zip
├── source/                 the NetBeans/Maven project (src/, pom.xml) — WITHOUT target/, nbproject/private/
├── phong-kham.war          Clean and Build → target/phong-kham.war
├── database/setup.sql      creates the database + sample data, runs twice
├── report/Bao-cao-Nhom3.pdf
└── README.txt</code></pre>
<p>What the WAR contains (the classes, the JSPs under <code>WEB-INF</code>, three jars — and no <code>.java</code>, no <code>setup.sql</code>, no secret):</p>
<p class="ghi-chu">📦 Inside the <code>phong-kham.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/AdminReportController.class<br>
WEB-INF/classes/controller/AdminServiceController.class<br>
WEB-INF/classes/controller/DoctorResultController.class<br>
WEB-INF/classes/controller/DoctorScheduleController.class<br>
WEB-INF/classes/controller/HomeController.class<br>
WEB-INF/classes/controller/LoginController.class<br>
WEB-INF/classes/controller/LogoutController.class<br>
WEB-INF/classes/controller/PatientAppointmentController.class<br>
WEB-INF/classes/controller/PatientInvoiceController.class<br>
WEB-INF/classes/controller/PatientPaymentController.class<br>
WEB-INF/classes/controller/ReceptionAppointmentController.class<br>
WEB-INF/classes/controller/ReceptionInvoiceController.class<br>
WEB-INF/classes/controller/RegisterController.class<br>
WEB-INF/classes/controller/VnpayIpnController.class<br>
WEB-INF/classes/controller/VnpayReturnController.class<br>
WEB-INF/classes/dal/<br>
WEB-INF/classes/dal/AccountDAO$Stored.class<br>
WEB-INF/classes/dal/AccountDAO.class<br>
WEB-INF/classes/dal/AppointmentDAO.class<br>
WEB-INF/classes/dal/CatalogDAO.class<br>
WEB-INF/classes/dal/DBContext.class<br>
WEB-INF/classes/dal/InvoiceDAO.class<br>
WEB-INF/classes/dal/PaymentDAO.class<br>
WEB-INF/classes/dal/ReportDAO.class<br>
WEB-INF/classes/filter/<br>
WEB-INF/classes/filter/AuthorizationFilter.class<br>
WEB-INF/classes/filter/Forbidden.class<br>
WEB-INF/classes/filter/OwnershipFilter.class<br>
WEB-INF/classes/model/<br>
WEB-INF/classes/model/Account.class<br>
WEB-INF/classes/model/Appointment.class<br>
WEB-INF/classes/model/BookingForm.class<br>
WEB-INF/classes/model/Doctor.class<br>
WEB-INF/classes/model/Invoice.class<br>
WEB-INF/classes/model/MedicalService.class<br>
WEB-INF/classes/model/Page.class<br>
WEB-INF/classes/model/PaymentTxn.class<br>
WEB-INF/classes/model/RevenueRow.class<br>
WEB-INF/classes/model/ServiceForm.class<br>
WEB-INF/classes/model/Specialty.class<br>
WEB-INF/classes/payment/<br>
WEB-INF/classes/payment/Vnpay.class<br>
WEB-INF/classes/payment/VnpayCodes.class<br>
WEB-INF/classes/payment/VnpayConfig.class<br>
WEB-INF/classes/service/<br>
WEB-INF/classes/service/AuthService.class<br>
WEB-INF/classes/service/BookingService.class<br>
WEB-INF/classes/service/CatalogService.class<br>
WEB-INF/classes/service/InvoiceService.class<br>
WEB-INF/classes/service/PaymentService.class<br>
WEB-INF/classes/tags/<br>
WEB-INF/classes/tags/PagerTag.class<br>
WEB-INF/classes/util/<br>
WEB-INF/classes/util/Clinic.class<br>
WEB-INF/classes/util/PasswordHasher.class<br>
WEB-INF/classes/util/Web.class<br>
WEB-INF/classes/vnpaygia/<br>
WEB-INF/classes/vnpaygia/CongVnpayGia.class<br>
WEB-INF/lib/<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-3.0.1.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-api-3.0.0.jar<br>
WEB-INF/lib/mssql-jdbc-12.8.1.jre11.jar<br>
WEB-INF/pk.tld<br>
WEB-INF/tags/<br>
WEB-INF/tags/statusBadge.tag<br>
WEB-INF/views/<br>
WEB-INF/views/_bottom.jspf<br>
WEB-INF/views/_taglibs.jspf<br>
WEB-INF/views/_top.jspf<br>
WEB-INF/views/admin/<br>
WEB-INF/views/admin/reports.jsp<br>
WEB-INF/views/admin/service-form.jsp<br>
WEB-INF/views/admin/services.jsp<br>
WEB-INF/views/doctor/<br>
WEB-INF/views/doctor/result-form.jsp<br>
WEB-INF/views/doctor/schedule.jsp<br>
WEB-INF/views/error/<br>
WEB-INF/views/error/403.jsp<br>
WEB-INF/views/error/404.jsp<br>
WEB-INF/views/home.jsp<br>
WEB-INF/views/login.jsp<br>
WEB-INF/views/patient/<br>
WEB-INF/views/patient/appointment.jsp<br>
WEB-INF/views/patient/appointments.jsp<br>
WEB-INF/views/patient/booking-form.jsp<br>
WEB-INF/views/patient/invoices.jsp<br>
WEB-INF/views/patient/payment-result.jsp<br>
WEB-INF/views/reception/<br>
WEB-INF/views/reception/appointments.jsp<br>
WEB-INF/views/register.jsp<br>
WEB-INF/views/vnpay-gia/<br>
WEB-INF/views/vnpay-gia/loi.jsp<br>
WEB-INF/views/vnpay-gia/thanh-toan.jsp<br>
WEB-INF/web.xml<br>
css/<br>
css/app.css</div>
<pre><code class="language-plaintext">README — Phong kham An Tam (PRJ301 Assignment, nhom 3, de tai 8)
1. Requirements: JDK 17+, Apache Tomcat 10.1, SQL Server 2019+ (or 2022), NetBeans 21+ (optional)
2. Database: open database/setup.sql in SSMS and execute (creates PRJ301_PhongKham; safe to run again)
3. Connection: set environment variables DB_HOST DB_PORT DB_USER DB_PASSWORD
   (defaults: localhost 1433 sa 123 — see dal/DBContext.java)
4. Payment: without VNP_TMN_CODE / VNP_HASH_SECRET the app runs in DEMO mode (local fake gateway).
   Real VNPay sandbox: set both (register at sandbox.vnpayment.vn/devreg), then restart Tomcat.
   Before a real run, delete clinic.today and clinic.now from WEB-INF/web.xml.
5. Deploy: copy phong-kham.war to tomcat/webapps, start Tomcat, open http://localhost:8080/phong-kham/
6. Demo accounts: admin/Admin@123 · letan/Letan@123 · bs.an/Bacsi@123 · bn.hoa/Benhnhan@123
   Test card (sandbox): NCB 9704198526191432198, NGUYEN VAN A, 07/15, OTP 123456</code></pre>
<table>
<thead><tr><th>Mistake at submission</th><th>What the teacher sees</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>no database script, or a .bak only</td><td>the app starts, every page 500</td><td>export a script that creates the database AND the data; run it on an empty server once</td></tr>
<tr><td>script runs once</td><td>"There is already an object named…" on the second run</td><td>IF DB_ID(…) DROP + CREATE DATABASE (ASM.2)</td></tr>
<tr><td>hard-coded paths (C:\\Users\\An\\uploads, D:\\data)</td><td>FileNotFoundException on another PC</td><td>paths relative to the app, or getServletContext().getRealPath, or a configured directory</td></tr>
<tr><td>password in DBContext.java (sa / your own password)</td><td>the app cannot connect on the teacher's PC — and your password is published</td><td>environment variables with defaults (ASM.2), password written only in the README</td></tr>
<tr><td>VNPay secret in code or report</td><td>anyone with the zip can forge payments</td><td>environment variables (ASM.5); revoke and request a new secret if it leaked</td></tr>
<tr><td>javax.servlet imports on Tomcat 10</td><td>404 for every servlet, ClassNotFoundException in the log</td><td>jakarta.* everywhere (Chapter 1)</td></tr>
<tr><td>target/ and nbproject/private/ in the zip</td><td>40 MB zip, other machine's paths</td><td>.gitignore of ASM.2, Clean before zipping</td></tr>
<tr><td>context path differs from the README</td><td>404 on the first URL</td><td>Project Properties → Run → Context Path = the name in the README</td></tr>
</tbody>
</table>
<p>The last test before submitting takes 15 minutes and catches all of the above: on a teammate's laptop (not the one used to develop), unzip, follow <strong>only</strong> the README, log in with each demo account.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the same checklist, different words. <code>./mvnw clean package</code> produces one executable jar (Tomcat inside); <code>application.yml</code> reads <code>DB_*</code> and <code>VNP_*</code> from the environment; Flyway/Liquibase migrations replace <code>setup.sql</code> and run themselves; a <code>docker compose up</code> with SQL Server/PostgreSQL replaces "install SQL Server and run the script". LabFlow's report follows the SEP490 templates instead of this skeleton, but the evidence rules (Git per member, test cases with screenshots, ERD = schema) are the same.</div>`,
    `<h2>8. Nộp bài: trong file zip có gì, và cái gì giết một bài nộp</h2>
<pre><code class="language-plaintext">PRJ301_SE19xx_Nhom3_PhongKham.zip
├── source/                 project NetBeans/Maven (src/, pom.xml) — KHÔNG có target/, nbproject/private/
├── phong-kham.war          Clean and Build → target/phong-kham.war
├── database/setup.sql      tạo CSDL + dữ liệu mẫu, chạy hai lần vẫn được
├── report/Bao-cao-Nhom3.pdf
└── README.txt</code></pre>
<p>Trong file WAR có gì (các lớp, các JSP dưới <code>WEB-INF</code>, ba jar — và không có <code>.java</code>, không có <code>setup.sql</code>, không có secret):</p>
<p class="ghi-chu">📦 Bên trong <code>phong-kham.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/AdminReportController.class<br>
WEB-INF/classes/controller/AdminServiceController.class<br>
WEB-INF/classes/controller/DoctorResultController.class<br>
WEB-INF/classes/controller/DoctorScheduleController.class<br>
WEB-INF/classes/controller/HomeController.class<br>
WEB-INF/classes/controller/LoginController.class<br>
WEB-INF/classes/controller/LogoutController.class<br>
WEB-INF/classes/controller/PatientAppointmentController.class<br>
WEB-INF/classes/controller/PatientInvoiceController.class<br>
WEB-INF/classes/controller/PatientPaymentController.class<br>
WEB-INF/classes/controller/ReceptionAppointmentController.class<br>
WEB-INF/classes/controller/ReceptionInvoiceController.class<br>
WEB-INF/classes/controller/RegisterController.class<br>
WEB-INF/classes/controller/VnpayIpnController.class<br>
WEB-INF/classes/controller/VnpayReturnController.class<br>
WEB-INF/classes/dal/<br>
WEB-INF/classes/dal/AccountDAO$Stored.class<br>
WEB-INF/classes/dal/AccountDAO.class<br>
WEB-INF/classes/dal/AppointmentDAO.class<br>
WEB-INF/classes/dal/CatalogDAO.class<br>
WEB-INF/classes/dal/DBContext.class<br>
WEB-INF/classes/dal/InvoiceDAO.class<br>
WEB-INF/classes/dal/PaymentDAO.class<br>
WEB-INF/classes/dal/ReportDAO.class<br>
WEB-INF/classes/filter/<br>
WEB-INF/classes/filter/AuthorizationFilter.class<br>
WEB-INF/classes/filter/Forbidden.class<br>
WEB-INF/classes/filter/OwnershipFilter.class<br>
WEB-INF/classes/model/<br>
WEB-INF/classes/model/Account.class<br>
WEB-INF/classes/model/Appointment.class<br>
WEB-INF/classes/model/BookingForm.class<br>
WEB-INF/classes/model/Doctor.class<br>
WEB-INF/classes/model/Invoice.class<br>
WEB-INF/classes/model/MedicalService.class<br>
WEB-INF/classes/model/Page.class<br>
WEB-INF/classes/model/PaymentTxn.class<br>
WEB-INF/classes/model/RevenueRow.class<br>
WEB-INF/classes/model/ServiceForm.class<br>
WEB-INF/classes/model/Specialty.class<br>
WEB-INF/classes/payment/<br>
WEB-INF/classes/payment/Vnpay.class<br>
WEB-INF/classes/payment/VnpayCodes.class<br>
WEB-INF/classes/payment/VnpayConfig.class<br>
WEB-INF/classes/service/<br>
WEB-INF/classes/service/AuthService.class<br>
WEB-INF/classes/service/BookingService.class<br>
WEB-INF/classes/service/CatalogService.class<br>
WEB-INF/classes/service/InvoiceService.class<br>
WEB-INF/classes/service/PaymentService.class<br>
WEB-INF/classes/tags/<br>
WEB-INF/classes/tags/PagerTag.class<br>
WEB-INF/classes/util/<br>
WEB-INF/classes/util/Clinic.class<br>
WEB-INF/classes/util/PasswordHasher.class<br>
WEB-INF/classes/util/Web.class<br>
WEB-INF/classes/vnpaygia/<br>
WEB-INF/classes/vnpaygia/CongVnpayGia.class<br>
WEB-INF/lib/<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-3.0.1.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-api-3.0.0.jar<br>
WEB-INF/lib/mssql-jdbc-12.8.1.jre11.jar<br>
WEB-INF/pk.tld<br>
WEB-INF/tags/<br>
WEB-INF/tags/statusBadge.tag<br>
WEB-INF/views/<br>
WEB-INF/views/_bottom.jspf<br>
WEB-INF/views/_taglibs.jspf<br>
WEB-INF/views/_top.jspf<br>
WEB-INF/views/admin/<br>
WEB-INF/views/admin/reports.jsp<br>
WEB-INF/views/admin/service-form.jsp<br>
WEB-INF/views/admin/services.jsp<br>
WEB-INF/views/doctor/<br>
WEB-INF/views/doctor/result-form.jsp<br>
WEB-INF/views/doctor/schedule.jsp<br>
WEB-INF/views/error/<br>
WEB-INF/views/error/403.jsp<br>
WEB-INF/views/error/404.jsp<br>
WEB-INF/views/home.jsp<br>
WEB-INF/views/login.jsp<br>
WEB-INF/views/patient/<br>
WEB-INF/views/patient/appointment.jsp<br>
WEB-INF/views/patient/appointments.jsp<br>
WEB-INF/views/patient/booking-form.jsp<br>
WEB-INF/views/patient/invoices.jsp<br>
WEB-INF/views/patient/payment-result.jsp<br>
WEB-INF/views/reception/<br>
WEB-INF/views/reception/appointments.jsp<br>
WEB-INF/views/register.jsp<br>
WEB-INF/views/vnpay-gia/<br>
WEB-INF/views/vnpay-gia/loi.jsp<br>
WEB-INF/views/vnpay-gia/thanh-toan.jsp<br>
WEB-INF/web.xml<br>
css/<br>
css/app.css</div>
<pre><code class="language-plaintext">README — Phong kham An Tam (PRJ301 Assignment, nhom 3, de tai 8)
1. Yeu cau: JDK 17+, Apache Tomcat 10.1, SQL Server 2019+ (hoac 2022), NetBeans 21+ (tuy chon)
2. CSDL: mo database/setup.sql trong SSMS va Execute (tao PRJ301_PhongKham; chay lai duoc)
3. Ket noi: dat bien moi truong DB_HOST DB_PORT DB_USER DB_PASSWORD
   (mac dinh: localhost 1433 sa 123 — xem dal/DBContext.java)
4. Thanh toan: thieu VNP_TMN_CODE / VNP_HASH_SECRET thi app chay che do DEMO (cong gia cuc bo).
   VNPay sandbox that: dat ca hai (dang ky o sandbox.vnpayment.vn/devreg), roi khoi dong lai Tomcat.
   Truoc khi chay that, xoa clinic.today va clinic.now trong WEB-INF/web.xml.
5. Deploy: chep phong-kham.war vao tomcat/webapps, chay Tomcat, mo http://localhost:8080/phong-kham/
6. Tai khoan demo: admin/Admin@123 · letan/Letan@123 · bs.an/Bacsi@123 · bn.hoa/Benhnhan@123
   The test (sandbox): NCB 9704198526191432198, NGUYEN VAN A, 07/15, OTP 123456</code></pre>
<table>
<thead><tr><th>Lỗi khi nộp</th><th>Giảng viên thấy gì</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>không có script CSDL, hoặc chỉ có file .bak</td><td>app chạy, trang nào cũng 500</td><td>xuất script tạo CSDL VÀ dữ liệu; chạy thử một lần trên server trống</td></tr>
<tr><td>script chỉ chạy được một lần</td><td>"There is already an object named…" ở lần chạy thứ hai</td><td>IF DB_ID(…) DROP + CREATE DATABASE (ASM.2)</td></tr>
<tr><td>đường dẫn cứng (C:\\Users\\An\\uploads, D:\\data)</td><td>FileNotFoundException trên máy khác</td><td>đường dẫn tương đối theo app, hoặc getServletContext().getRealPath, hoặc thư mục cấu hình</td></tr>
<tr><td>mật khẩu trong DBContext.java (sa / mật khẩu của bạn)</td><td>máy giảng viên không kết nối được — và mật khẩu của bạn bị công khai</td><td>biến môi trường có giá trị mặc định (ASM.2), mật khẩu chỉ ghi trong README</td></tr>
<tr><td>secret VNPay trong code hoặc báo cáo</td><td>ai có file zip là giả được thanh toán</td><td>biến môi trường (ASM.5); nếu đã lộ thì huỷ và xin secret mới</td></tr>
<tr><td>import javax.servlet trên Tomcat 10</td><td>mọi servlet 404, ClassNotFoundException trong log</td><td>jakarta.* ở mọi nơi (Chương 1)</td></tr>
<tr><td>target/ và nbproject/private/ trong zip</td><td>zip 40 MB, đường dẫn của máy khác</td><td>.gitignore của ASM.2, Clean trước khi nén</td></tr>
<tr><td>context path khác README</td><td>404 ngay URL đầu tiên</td><td>Project Properties → Run → Context Path = đúng tên trong README</td></tr>
</tbody>
</table>
<p>Phép thử cuối cùng trước khi nộp mất 15 phút và bắt được tất cả những lỗi trên: trên laptop của một bạn cùng nhóm (không phải máy dùng để code), giải nén, làm theo <strong>chỉ</strong> README, đăng nhập bằng từng tài khoản demo.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cùng một checklist, khác câu chữ. <code>./mvnw clean package</code> ra một file jar chạy được (có Tomcat bên trong); <code>application.yml</code> đọc <code>DB_*</code> và <code>VNP_*</code> từ biến môi trường; migration Flyway/Liquibase thay cho <code>setup.sql</code> và tự chạy; một lệnh <code>docker compose up</code> với SQL Server/PostgreSQL thay cho "cài SQL Server rồi chạy script". Báo cáo LabFlow theo mẫu SEP490 thay vì khung này, nhưng luật bằng chứng (Git từng người, test case có ảnh, ERD = schema) vẫn y nguyên.</div>`),
    bi(`<h2>🧪 Exercises (with solutions)</h2>
<h3>🧪 Exercise 1 — revenue by payment channel (~20 min)</h3>
<p>The manager wants two columns: cash and VNPay. The data is already there. How?</p>
<p class="dap-an">✅ <code>Invoice.paymentRef</code> starts with <code>CASH-</code> or <code>VNPAY-</code>: <code>SUM(CASE WHEN i.paymentRef LIKE 'VNPAY-%' THEN i.amount ELSE 0 END) AS vnpay</code> and the same for cash, in the same GROUP BY. With the sample data: 28/10 cash 200.000, 05/11 VNPay 180.000. (Cleaner long-term: a <code>paymentMethod</code> column — say so in the report's "future work".)</p>
<h3>🧪 Exercise 2 — predict the report after one more payment (~5 min)</h3>
<p>bn.khang pays HD2 (350.000 đ, Siêu âm ổ bụng — Nội tổng quát) through the sandbox at 05/11 10:15. What does <code>bao-cao</code> show?</p>
<p class="dap-an">✅ Three lines would become: 28/10 Nội tổng quát 1 · 200.000; 05/11 Nhi 1 · 180.000; 05/11 Nội tổng quát 1 · 350.000 — sorted by day then specialty name: with the default server collation <code>SQL_Latin1_General_CP1_CI_AS</code> (measured on our SQL Server) "Nhi" comes before "Nội…" — the collation decides, so check yours in SSMS rather than guessing. Total 3 invoices, 730.000.</p>
<h3>🧪 Exercise 3 — your own report, chapter 6 (~60 min)</h3>
<p>Write 15–20 test cases for YOUR topic in the table format of section 2 — at least one success and one refusal per use case, plus the four security cases (wrong role, other owner, empty form, F5 after POST) and the three payment cases (success, cancel, edited signature).</p>
<p class="dap-an">✅ Self-check: every use case of chapter 2 appears; every "expected" is a status code or a visible message (not "works correctly"); every row has a screenshot reference; the failing cases are as many as the passing ones.</p>`,
    `<h2>🧪 Bài tập (có lời giải)</h2>
<h3>🧪 Bài 1 — doanh thu theo kênh thanh toán (~20 phút)</h3>
<p>Quản lý muốn hai cột: tiền mặt và VNPay. Dữ liệu đã có sẵn. Làm thế nào?</p>
<p class="dap-an">✅ <code>Invoice.paymentRef</code> bắt đầu bằng <code>CASH-</code> hoặc <code>VNPAY-</code>: <code>SUM(CASE WHEN i.paymentRef LIKE 'VNPAY-%' THEN i.amount ELSE 0 END) AS vnpay</code> và tương tự cho tiền mặt, trong cùng GROUP BY. Với dữ liệu mẫu: 28/10 tiền mặt 200.000, 05/11 VNPay 180.000. (Về lâu dài sạch hơn: một cột <code>paymentMethod</code> — ghi vào mục "hướng phát triển" của báo cáo.)</p>
<h3>🧪 Bài 2 — đoán báo cáo sau một lần thanh toán nữa (~5 phút)</h3>
<p>bn.khang trả HD2 (350.000 đ, Siêu âm ổ bụng — Nội tổng quát) qua sandbox lúc 05/11 10:15. Request <code>bao-cao</code> hiện gì?</p>
<p class="dap-an">✅ Thành ba dòng: 28/10 Nội tổng quát 1 · 200.000; 05/11 Nhi 1 · 180.000; 05/11 Nội tổng quát 1 · 350.000 — xếp theo ngày rồi theo tên chuyên khoa: với collation mặc định của server <code>SQL_Latin1_General_CP1_CI_AS</code> (đo trên SQL Server của chúng ta) "Nhi" đứng trước "Nội…" — collation (quy tắc so sánh chữ) quyết định, nên xem của bạn trong SSMS thay vì đoán. Tổng 3 hoá đơn, 730.000.</p>
<h3>🧪 Bài 3 — báo cáo của chính bạn, chương 6 (~60 phút)</h3>
<p>Viết 15–20 test case cho đề tài CỦA BẠN theo khuôn bảng ở mục 2 — mỗi use case ít nhất một lần thành công và một lần bị từ chối, cộng bốn ca bảo mật (sai vai trò, chủ khác, form trống, F5 sau POST) và ba ca thanh toán (thành công, huỷ, sửa chữ ký).</p>
<p class="dap-an">✅ Tự kiểm: use case nào ở chương 2 cũng có mặt; mọi cột "mong đợi" là một mã trạng thái hoặc một thông báo nhìn thấy được (không phải "chạy đúng"); dòng nào cũng trỏ tới một ảnh; số ca thất bại nhiều ngang số ca thành công.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>revenue report</strong></td><td>báo cáo doanh thu</td><td>A summary of money actually received (PAID invoices) over a period, grouped by day and specialty.</td></tr>
<tr><td><strong>half-open range</strong></td><td>khoảng nửa mở</td><td>A condition "from ≤ x &lt; to + 1 day" that includes the whole last day without counting midnight twice.</td></tr>
<tr><td><strong>data dictionary</strong></td><td>từ điển dữ liệu</td><td>A table that describes every column: type, null, constraint and meaning.</td></tr>
<tr><td><strong>test case</strong></td><td>ca kiểm thử</td><td>One check with an input, an expected result and the actual result.</td></tr>
<tr><td><strong>contribution evidence</strong></td><td>bằng chứng đóng góp</td><td>Facts that show who did what: commits, pull requests, review comments.</td></tr>
<tr><td><strong>pull request (PR)</strong></td><td>yêu cầu gộp code</td><td>A request to merge a branch into main, reviewed by another member before merging.</td></tr>
<tr><td><strong>git shortlog</strong></td><td>tổng hợp commit theo tác giả</td><td>A Git command that counts and lists commits per author.</td></tr>
<tr><td><strong>WAR (Web Application Archive)</strong></td><td>gói ứng dụng web</td><td>The zip file that Tomcat deploys: compiled classes, JSPs, WEB-INF/lib jars.</td></tr>
<tr><td><strong>README</strong></td><td>tệp hướng dẫn</td><td>The text file that tells another person how to install and run the project, step by step.</td></tr>
<tr><td><strong>hard-coded path</strong></td><td>đường dẫn cứng</td><td>A file path written into the code that exists only on the developer's machine.</td></tr>
<tr><td><strong>defence (viva)</strong></td><td>buổi bảo vệ</td><td>The session where the team demonstrates the product and answers the examiners' questions.</td></tr>
<tr><td><strong>plan B</strong></td><td>phương án dự phòng</td><td>What you show when the network or the sandbox fails during the demo (demo mode, a recording).</td></tr>
<tr><td><strong>self-assessment</strong></td><td>tự chấm</td><td>Checking your own product against the requirements before the marker does.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>revenue report</strong></td><td>báo cáo doanh thu</td><td>Bản tổng hợp tiền thực thu (hoá đơn PAID) trong một khoảng thời gian, gom theo ngày và chuyên khoa.</td></tr>
<tr><td><strong>half-open range</strong></td><td>khoảng nửa mở</td><td>Điều kiện "from ≤ x &lt; to + 1 ngày" lấy trọn ngày cuối mà không đếm nửa đêm hai lần.</td></tr>
<tr><td><strong>data dictionary</strong></td><td>từ điển dữ liệu</td><td>Bảng mô tả từng cột: kiểu, null, ràng buộc và ý nghĩa.</td></tr>
<tr><td><strong>test case</strong></td><td>ca kiểm thử</td><td>Một phép kiểm gồm đầu vào, kết quả mong đợi và kết quả thực tế.</td></tr>
<tr><td><strong>contribution evidence</strong></td><td>bằng chứng đóng góp</td><td>Các dữ kiện cho thấy ai làm gì: commit, pull request, nhận xét review.</td></tr>
<tr><td><strong>pull request (PR)</strong></td><td>yêu cầu gộp code</td><td>Yêu cầu gộp một nhánh vào main, được một thành viên khác xem lại trước khi gộp.</td></tr>
<tr><td><strong>git shortlog</strong></td><td>tổng hợp commit theo tác giả</td><td>Lệnh Git đếm và liệt kê commit theo từng tác giả.</td></tr>
<tr><td><strong>WAR (Web Application Archive)</strong></td><td>gói ứng dụng web</td><td>File nén mà Tomcat deploy: các lớp đã biên dịch, JSP, jar trong WEB-INF/lib.</td></tr>
<tr><td><strong>README</strong></td><td>tệp hướng dẫn</td><td>Tệp chữ chỉ cho người khác cách cài và chạy project, từng bước.</td></tr>
<tr><td><strong>hard-coded path</strong></td><td>đường dẫn cứng</td><td>Đường dẫn tệp viết thẳng vào code, chỉ tồn tại trên máy của người viết.</td></tr>
<tr><td><strong>defence (viva)</strong></td><td>buổi bảo vệ</td><td>Buổi nhóm trình diễn sản phẩm và trả lời câu hỏi của hội đồng/giảng viên.</td></tr>
<tr><td><strong>plan B</strong></td><td>phương án dự phòng</td><td>Thứ bạn cho xem khi mạng hoặc sandbox hỏng giữa buổi demo (chế độ demo, đoạn quay màn hình).</td></tr>
<tr><td><strong>self-assessment</strong></td><td>tự chấm</td><td>Tự kiểm sản phẩm của mình theo yêu cầu trước khi người chấm làm.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Remember</h2>
<ul>
<li>UC14: count PAID invoices on the day they were paid; use a half-open date range, not BETWEEN on DATETIME2; <code>/admin/*</code> is already ADMIN-only.</li>
<li>Part 2 of the brief is marked: analysis, design of functions AND database, task split, source, design documents, screenshots.</li>
<li>Report chapters: introduction, analysis, design (functions), design (database), implementation, testing, team work, installation guide, appendix of screenshots.</li>
<li>Generate the ERD from the final script and the use cases from the final URL map; write test cases whose "expected" is a status or a message.</li>
<li>The task table needs evidence: <code>git shortlog -sne</code>, per-member <code>git log --stat</code>, PRs; real names and e-mails in Git config.</li>
<li>Self-check each of 1.1–1.10 against a running request, then do the hostile pass (private window, edited ids, empty forms, F5, 390 px).</li>
<li>Demo = one story in 10 minutes, failures shown on purpose, each member presents his own use cases, plan B ready.</li>
<li>Submit WAR + setup.sql (runs twice) + source without target/ + report + README; no passwords, no secrets, no hard-coded paths, jakarta.* only; test the zip on another laptop.</li>
</ul>`,
    `<h2>📌 Ghi nhớ</h2>
<ul>
<li>UC14: tính hoá đơn PAID vào ngày được trả; dùng khoảng ngày nửa mở, không dùng BETWEEN trên DATETIME2; <code>/admin/*</code> đã chỉ cho ADMIN.</li>
<li>Phần 2 của đề có chấm điểm: phân tích, thiết kế chức năng VÀ CSDL, phân công, mã nguồn, tài liệu thiết kế, ảnh chụp.</li>
<li>Các chương báo cáo: giới thiệu, phân tích, thiết kế (chức năng), thiết kế (CSDL), cài đặt, kiểm thử, làm việc nhóm, hướng dẫn cài đặt, phụ lục ảnh chụp.</li>
<li>Dựng ERD từ script cuối cùng và use case từ bảng URL cuối cùng; viết test case mà cột "mong đợi" là mã trạng thái hoặc thông báo.</li>
<li>Bảng phân công cần bằng chứng: <code>git shortlog -sne</code>, <code>git log --stat</code> từng người, PR; tên thật và email trong cấu hình Git.</li>
<li>Tự chấm từng yêu cầu 1.1–1.10 bằng một request đang chạy, rồi làm lượt "phá" (cửa sổ ẩn danh, sửa id, form trống, F5, 390 px).</li>
<li>Demo = một câu chuyện trong 10 phút, cố ý cho xem lần thất bại, mỗi người trình bày use case của mình, có sẵn phương án B.</li>
<li>Nộp WAR + setup.sql (chạy hai lần được) + mã nguồn không có target/ + báo cáo + README; không mật khẩu, không secret, không đường dẫn cứng, chỉ jakarta.*; thử file zip trên một laptop khác.</li>
</ul>`),
  ].join('\n'),
};

export default {
  extrasEnd: [L_x_asm_1, L_x_asm_2, L_x_asm_wireframe, L_x_asm_3, L_x_asm_4, L_x_asm_5, L_x_asm_6],
  lessons: [L_x_asm_1, L_x_asm_2, L_x_asm_wireframe, L_x_asm_3, L_x_asm_4, L_x_asm_5, L_x_asm_6],
};
