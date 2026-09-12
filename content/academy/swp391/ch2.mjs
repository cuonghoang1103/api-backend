// content/academy/swp391/ch2.mjs
/**
 * SWP391 · Chapter 2 — Requirement analysis & the SRS (done again in every iteration).
 * Sources: Slide2 Software Requirement (32 pages, deck 'g-req'), Template1 SRS Document
 * (15 rendered pages, deck 't-srs'), Claude_Prompts.txt (prompts #1–#6), Template5 AI Usage
 * Report, Project Tracking template, and the G5 "Job IT for Freelancer" RDS + SQL script
 * (used for the worked example — no personal data: no names, IDs, e-mails, usernames).
 * The old chapter called this "Milestone 1" — wrong: SWP391 has 3 iterations and every
 * member writes requirements for his/her own screens in EVERY iteration.
 *   2.1 Requirements, actors & use-case diagrams      g-req 1–12
 *   2.2 Identifying & documenting use cases            g-req 13–19  (+ G5 worked UC spec)
 *   2.3 Business rules & requirement prototyping       g-req 20–32  (+ G5 BRs, screen list)
 *   2.4 The SRS template, section by section           t-srs 1–15
 *   2.5 AI as your senior BA — prompts #1–#6
 *   Iteration 1 submission checklist
 *   Quiz 2
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const R = 'g-req';
const T = 't-srs';

/* ─────────────── 2.1 Requirements, actors & use-case diagrams ─────────────── */
const L21 = {
  title: '2.1 — Requirements, actors & use-case diagrams|||2.1 — Yêu cầu, actor & sơ đồ use case',
  slug: 'swp391-2-1-elicitation-srs',
  type: 'VIDEO',
  description: 'Slide2 Software Requirement trang 1–12: phân tích vs đặc tả yêu cầu, yêu cầu chức năng/phi chức năng, actor và cách tìm actor, sơ đồ use case với generalization/include/extend, actor chính/phụ — áp vào hệ thống G5 Job IT for Freelancer và vào iteration của nhóm bạn.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.1 · Slide2 Software Requirement, pages 1–12</span>
<h2>Requirements first — and again in every iteration</h2>
<p class="lead">In SWP391 there is no single "requirement phase". The project runs in <strong>3 iterations</strong>, and in <em>each</em> iteration every member analyses, specifies, designs and codes his/her own 3–4 screens. This chapter teaches the requirement half of that loop, exactly as the teacher's deck <em>Slide2 Software Requirement</em> and the <em>Template1 SRS</em> define it.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>tell <strong>requirements analysis</strong> from <strong>requirements specification</strong>, and a functional from a non-functional requirement;</li>
<li>find the <strong>actors</strong> of your system with the three questions of slide 9;</li>
<li>draw a correct <strong>use-case diagram</strong> with generalization, include and extend;</li>
<li>say who is the <strong>primary</strong> and who is a <strong>secondary</strong> actor of a use case.</li>
</ul></div>
<p class="nhan">What the requirement work looks like in each iteration</p>
<table>
<thead><tr><th>Iteration</th><th>Requirement work (in the RDS / SRS)</th><th>Weight</th></tr></thead>
<tbody>
<tr><td>Iter 1</td><td>Whole-system view: context diagram, actors, full use-case list and diagrams, screen flow, screen authorization, first ERD — plus full specs of the Iter-1 screens</td><td>15%</td></tr>
<tr><td>Iter 2</td><td>Specs (UC spec, business rules, screen fields, messages) of the Iter-2 screens; update everything Iter 1 got wrong; log it in <em>Record of Changes</em></td><td>20%</td></tr>
<tr><td>Iter 3</td><td>Specs of the last screens; the document must now match the final product exactly (it is part of the final package)</td><td>25%</td></tr>
</tbody>
</table>
<p class="ghi-chu">Each iteration is graded on LOC (70%) plus the submitted package (30%) — the requirement document is inside that package. The final presentation (40%) also scores "requirement analysis" at 20%.</p>`,
    `<span class="eyebrow">Chương 2 · Bài 2.1 · Slide2 Software Requirement, trang 1–12</span>
<h2>Yêu cầu trước — và làm lại trong mỗi iteration</h2>
<p class="lead">SWP391 không có một "pha yêu cầu" duy nhất. Đồ án chạy <strong>3 iteration</strong>, và trong <em>mỗi</em> iteration mỗi thành viên tự phân tích, đặc tả, thiết kế và code 3–4 màn hình của mình. Chương này dạy nửa "yêu cầu" của vòng lặp đó, đúng như bộ slide <em>Slide2 Software Requirement</em> và mẫu <em>Template1 SRS</em> của thầy/cô quy định.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>phân biệt <strong>phân tích yêu cầu</strong> với <strong>đặc tả yêu cầu</strong>, và yêu cầu chức năng với phi chức năng;</li>
<li>tìm được <strong>actor</strong> của hệ thống bằng ba câu hỏi ở slide 9;</li>
<li>vẽ đúng <strong>sơ đồ use case</strong> có generalization, include và extend;</li>
<li>chỉ ra actor <strong>chính (primary)</strong> và actor <strong>phụ (secondary)</strong> của một use case.</li>
</ul></div>
<p class="nhan">Việc về yêu cầu trong từng iteration</p>
<table>
<thead><tr><th>Iteration</th><th>Việc về yêu cầu (trong RDS / SRS)</th><th>Trọng số</th></tr></thead>
<tbody>
<tr><td>Iter 1</td><td>Bức tranh toàn hệ thống: context diagram, actor, danh sách và sơ đồ use case đầy đủ, screen flow, phân quyền màn hình, ERD đầu tiên — cộng đặc tả đầy đủ các màn hình của Iter 1</td><td>15%</td></tr>
<tr><td>Iter 2</td><td>Đặc tả (UC spec, business rule, trường màn hình, message) của các màn hình Iter 2; sửa mọi chỗ Iter 1 làm sai; ghi vào <em>Record of Changes</em></td><td>20%</td></tr>
<tr><td>Iter 3</td><td>Đặc tả các màn hình cuối; tài liệu giờ phải khớp đúng sản phẩm cuối (nó nằm trong gói nộp cuối)</td><td>25%</td></tr>
</tbody>
</table>
<p class="ghi-chu">Mỗi iteration chấm theo LOC (70%) cộng gói tài liệu nộp (30%) — tài liệu yêu cầu nằm trong gói đó. Buổi thuyết trình cuối (40%) cũng chấm riêng "requirement analysis" 20%.</p>`),
    walkHead(R, 1, 12, 'Pages 1–12 cover the overview, actors and the use-case diagram; lesson 2.2 continues with pages 13–19.', 'Trang 1–12 gồm phần tổng quan, actor và sơ đồ use case; bài 2.2 học tiếp trang 13–19.'),
    walk(R, [
      [1, 'Title — Software Requirement Guides',
        `<p class="y-chinh">🎯 The second guide deck of SWP391: how to turn "what the customer wants" into a specification your team can build and the teacher can grade.</p>
<p class="nhan">Why it matters for your project</p>
<ul>
<li><strong>The teacher is your customer / PO</strong> — the requirements you write are what he/she will accept or reject at each iteration.</li>
<li><strong>Every member uses this deck</strong> — not only "the BA": each person writes the use cases and screen specs of his/her own screens.</li>
<li><strong>Output</strong> — the requirement part of your RDS (or SRS, Template1), filled in again every iteration.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bộ slide hướng dẫn thứ hai của SWP391: biến "khách hàng muốn gì" thành bản đặc tả mà nhóm xây được và thầy/cô chấm được.</p>
<p class="nhan">Vì sao quan trọng với đồ án</p>
<ul>
<li><strong>Thầy/cô là khách hàng / PO</strong> — yêu cầu bạn viết là thứ thầy/cô sẽ chấp nhận hay bác bỏ ở mỗi iteration.</li>
<li><strong>Mọi thành viên đều dùng bộ slide này</strong> — không riêng "BA": mỗi người tự viết use case và đặc tả màn hình của mình.</li>
<li><strong>Sản phẩm</strong> — phần yêu cầu trong RDS (hoặc SRS, Template1), được điền tiếp ở mỗi iteration.</li>
</ul>`],
      [2, 'Agenda',
        `<p class="y-chinh">🎯 Six topics, in the order you actually do them on a project.</p>
<ol>
<li><strong>Requirement Overview</strong> — analysis vs specification, functional vs non-functional (pages 3–5)</li>
<li><strong>Use Cases &amp; Actors</strong> — who uses the system, the UC diagram (pages 6–12)</li>
<li><strong>Identifying Use Cases</strong> — finding and naming them (pages 13–16)</li>
<li><strong>Documenting Use Cases</strong> — the UC specification (pages 17–19)</li>
<li><strong>Business Rules</strong> — the 5-class taxonomy (pages 20–25)</li>
<li><strong>Requirement Prototyping</strong> — throwaway vs evolutionary, screen specs (pages 26–31)</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> Who (actors) → What (use cases) → How exactly (UC spec) → Under which rules (BR) → What it looks like (prototype).</p>`,
        `<p class="y-chinh">🎯 Sáu chủ đề, đúng thứ tự bạn làm trong dự án thật.</p>
<ol>
<li><strong>Requirement Overview</strong> — phân tích vs đặc tả, chức năng vs phi chức năng (trang 3–5)</li>
<li><strong>Use Cases &amp; Actors</strong> — ai dùng hệ thống, sơ đồ UC (trang 6–12)</li>
<li><strong>Identifying Use Cases</strong> — tìm và đặt tên use case (trang 13–16)</li>
<li><strong>Documenting Use Cases</strong> — đặc tả UC (trang 17–19)</li>
<li><strong>Business Rules</strong> — phân loại 5 nhóm (trang 20–25)</li>
<li><strong>Requirement Prototyping</strong> — throwaway vs evolutionary, đặc tả màn hình (trang 26–31)</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Ai (actor) → Làm gì (use case) → Làm chính xác thế nào (UC spec) → Theo luật nào (BR) → Trông ra sao (prototype).</p>`],
      [3, 'Requirement Overview',
        `<p class="y-chinh">🎯 Requirements describe the system from the outside — as a black box — and cover both functional and non-functional needs.</p>
<p class="nhan">Requirements describe</p>
<ul>
<li><strong>What the user expects</strong> from the system</li>
<li><strong>What the system will do</strong> for the user</li>
</ul>
<p class="nhan">Rules when defining them</p>
<ul>
<li><strong>Black box</strong> — only external behaviour counts: inputs, outputs, stored data. "Uses a Servlet and a DAO" is design, not a requirement.</li>
<li><strong>Both kinds</strong> — functional (what it does) and non-functional (how well).</li>
<li><strong>Requirements modeling = analysis + specification</strong> — pages 4 and 5.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Design leaking into requirements.</strong> A UC step like "System calls PostDAO.insert()" loses marks — write "System saves the job post". Class and sequence diagrams belong to the design part (Chapter 3).</div>`,
        `<p class="y-chinh">🎯 Yêu cầu mô tả hệ thống từ bên ngoài — như một hộp đen — và gồm cả nhu cầu chức năng lẫn phi chức năng.</p>
<p class="nhan">Yêu cầu mô tả</p>
<ul>
<li><strong>Người dùng mong đợi gì</strong> từ hệ thống</li>
<li><strong>Hệ thống sẽ làm gì</strong> cho người dùng</li>
</ul>
<p class="nhan">Nguyên tắc khi xác định</p>
<ul>
<li><strong>Hộp đen</strong> — chỉ xét hành vi bên ngoài: đầu vào, đầu ra, dữ liệu lưu. "Dùng Servlet và DAO" là thiết kế, không phải yêu cầu.</li>
<li><strong>Cả hai loại</strong> — chức năng (làm gì) và phi chức năng (làm tốt tới đâu).</li>
<li><strong>Requirements modeling = analysis + specification</strong> — trang 4 và 5.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Thiết kế lọt vào yêu cầu.</strong> Một bước UC kiểu "System gọi PostDAO.insert()" bị trừ điểm — hãy viết "Hệ thống lưu tin tuyển dụng". Class diagram và sequence diagram thuộc phần thiết kế (Chương 3).</div>`],
      [4, 'Requirements Analysis',
        `<p class="y-chinh">🎯 Analysis = finding out what the system must do, by talking to people and studying how the work is done today.</p>
<p class="nhan">How requirements are analysed</p>
<ol>
<li><strong>Interview users and stakeholders</strong> — in SWP391 your main stakeholder is the teacher acting as customer/PO; prepare questions before each class slot.</li>
<li><strong>Analyse the existing system(s)</strong>:
<ul>
<li><strong>Understand and document</strong> the current system — e.g. how freelancers find IT jobs today (Facebook groups, job sites, e-mail).</li>
<li><strong>Decide what to automate</strong> and what stays manual — G5 kept contract negotiation and payment <em>outside</em> the system (their exclusions EX-1, EX-2).</li>
<li><strong>Discuss what can be done differently</strong> once automated — e.g. "Job for You": matching posts to a freelancer's skills.</li>
</ul></li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> analysis produces <em>understanding</em>; specification (next page) writes it down so everyone agrees.</p>`,
        `<p class="y-chinh">🎯 Phân tích = tìm ra hệ thống phải làm gì, bằng cách nói chuyện với con người và nghiên cứu cách công việc đang được làm hôm nay.</p>
<p class="nhan">Cách phân tích yêu cầu</p>
<ol>
<li><strong>Phỏng vấn người dùng và stakeholder</strong> — ở SWP391 stakeholder chính là thầy/cô đóng vai khách hàng/PO; chuẩn bị câu hỏi trước mỗi slot.</li>
<li><strong>Phân tích hệ thống hiện có</strong>:
<ul>
<li><strong>Hiểu và ghi lại</strong> hệ thống hiện tại — vd freelancer đang tìm việc IT thế nào (group Facebook, trang tuyển dụng, e-mail).</li>
<li><strong>Quyết định cái gì tự động hoá</strong>, cái gì giữ thủ công — G5 để đàm phán hợp đồng và thanh toán <em>ngoài</em> hệ thống (loại trừ EX-1, EX-2).</li>
<li><strong>Bàn xem việc gì có thể làm khác đi</strong> khi đã tự động — vd "Job for You": gợi ý tin tuyển dụng khớp kỹ năng của freelancer.</li>
</ul></li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phân tích tạo ra <em>sự hiểu</em>; đặc tả (trang sau) viết nó ra để mọi người thống nhất.</p>`],
      [5, 'Requirements Specification',
        `<p class="y-chinh">🎯 The specification is the document the analysts and the users agree on — the starting point for design and code.</p>
<p class="nhan">The document</p>
<ul>
<li><strong>Agreed</strong> by analysts and users — for you: by the team and the teacher.</li>
<li><strong>Starting point</strong> for design and development — your SDS and code must trace back to it.</li>
<li><strong>Specifies both</strong> functional and non-functional requirements.</li>
</ul>
<p class="nhan">A functional requirement covers</p>
<ol>
<li><strong>Functionality</strong> the system must provide — "Freelancer applies for a job post"</li>
<li><strong>Input</strong> from the environment — the chosen CV file, the post ID</li>
<li><strong>Output</strong> to the environment — confirmation message, status "Pending"</li>
<li><strong>Stored information</strong> read or updated — a new row in JobApply</li>
</ol>
<p class="nhan">A non-functional requirement</p>
<ul>
<li><strong>Quality attribute / quality-of-service goal</strong> — performance, security, usability, availability… Make it measurable: "the job list loads in ≤ 2 s with 1,000 posts", "passwords stored hashed".</li>
</ul>`,
        `<p class="y-chinh">🎯 Bản đặc tả là tài liệu mà người phân tích và người dùng cùng thống nhất — điểm xuất phát của thiết kế và code.</p>
<p class="nhan">Tài liệu này</p>
<ul>
<li><strong>Được thống nhất</strong> giữa người phân tích và người dùng — với bạn: giữa nhóm và thầy/cô.</li>
<li><strong>Là điểm xuất phát</strong> cho thiết kế và phát triển — SDS và code phải truy ngược về được nó.</li>
<li><strong>Đặc tả cả hai</strong> loại: chức năng và phi chức năng.</li>
</ul>
<p class="nhan">Một yêu cầu chức năng gồm</p>
<ol>
<li><strong>Chức năng</strong> hệ thống phải có — "Freelancer ứng tuyển một tin tuyển dụng"</li>
<li><strong>Đầu vào</strong> từ môi trường — file CV đã chọn, mã tin</li>
<li><strong>Đầu ra</strong> ra môi trường — thông báo xác nhận, trạng thái "Pending"</li>
<li><strong>Dữ liệu lưu</strong> được đọc hay cập nhật — một dòng mới trong bảng JobApply</li>
</ol>
<p class="nhan">Một yêu cầu phi chức năng</p>
<ul>
<li><strong>Thuộc tính chất lượng / mục tiêu chất lượng dịch vụ</strong> — hiệu năng, bảo mật, dễ dùng, sẵn sàng… Viết cho đo được: "danh sách job tải ≤ 2 giây với 1.000 tin", "mật khẩu lưu dạng băm".</li>
</ul>`],
      [6, 'Use Cases & Actors',
        `<p class="y-chinh">🎯 The use-case model states the functional requirements as actors plus use cases, with the system as a black box.</p>
<p class="nhan">Three definitions</p>
<ul>
<li><strong>Use case model</strong> — the functional requirements in terms of actors and use cases; it deals with <em>what</em> the system does in response to the actor's inputs.</li>
<li><strong>Actor</strong> — gives inputs to the system and receives its responses.</li>
<li><strong>Use case (UC)</strong> — a sequence of interactions between one or more actors and the system.</li>
</ul>
<p class="nhan">Shape of every use case</p>
<ol>
<li>It <strong>always starts with input from an actor</strong> (a click, a submitted form, a timer tick).</li>
<li>It is a <strong>sequence of interactions</strong>, not one single action.</li>
<li>Each interaction = <strong>actor input → system response</strong>.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> write each normal-flow step as a ping-pong — "Freelancer clicks Apply" / "System shows the Apply form".</p>`,
        `<p class="y-chinh">🎯 Mô hình use case nêu yêu cầu chức năng dưới dạng actor cộng use case, với hệ thống là một hộp đen.</p>
<p class="nhan">Ba định nghĩa</p>
<ul>
<li><strong>Use case model</strong> — yêu cầu chức năng diễn đạt bằng actor và use case; nó nói hệ thống làm <em>gì</em> để đáp lại đầu vào của actor.</li>
<li><strong>Actor</strong> — đưa đầu vào cho hệ thống và nhận phản hồi của nó.</li>
<li><strong>Use case (UC)</strong> — một chuỗi tương tác giữa một hay nhiều actor với hệ thống.</li>
</ul>
<p class="nhan">Hình dạng của mọi use case</p>
<ol>
<li><strong>Luôn bắt đầu bằng đầu vào từ một actor</strong> (một cú click, một form được gửi, một nhịp timer).</li>
<li>Là một <strong>chuỗi tương tác</strong>, không phải một thao tác đơn lẻ.</li>
<li>Mỗi tương tác = <strong>actor đưa vào → hệ thống đáp lại</strong>.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> viết mỗi bước luồng chính như bóng bàn — "Freelancer bấm Apply" / "Hệ thống hiện form Apply".</p>`],
      [7, 'What are actors?',
        `<p class="y-chinh">🎯 An actor is a role outside the system that interacts with it — not a person, not a part of the system.</p>
<ul>
<li><strong>External</strong> — actors are the <em>only</em> external entities that interact with the system, and they are not part of it.</li>
<li><strong>Role, not individual</strong> — a user is one person; an actor is the role played by all users of the same type. One person can be both Freelancer and Recruiter (two actors).</li>
<li><strong>Not always human</strong> — external systems (a mail server, Google login, a payment gateway), I/O devices, or <strong>timers</strong> (a nightly job that expires old posts).</li>
</ul>
<p class="nhan">G5 "Job IT for Freelancer" — 4 actors</p>
<ul>
<li><strong>Guest</strong> — views and searches jobs, views companies, registers.</li>
<li><strong>Freelancer</strong> — manages profile, searches and applies for jobs, bookmarks, reports posts.</li>
<li><strong>Recruiter</strong> — posts jobs, manages applicants, views freelancers.</li>
<li><strong>Administrator</strong> — manages accounts, categories, skills, blogs, approves projects.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>"Database" is not an actor.</strong> One G5 UC lists "System, Database" as secondary actors — wrong: both are <em>inside</em> the boundary. Only an external system you do not build (e.g. the e-mail service) can be an actor.</div>`,
        `<p class="y-chinh">🎯 Actor là một vai trò bên ngoài hệ thống tương tác với nó — không phải một con người cụ thể, không phải một phần của hệ thống.</p>
<ul>
<li><strong>Bên ngoài</strong> — actor là thực thể bên ngoài <em>duy nhất</em> tương tác với hệ thống, và không thuộc về nó.</li>
<li><strong>Vai trò, không phải cá nhân</strong> — user là một người; actor là vai trò mà mọi user cùng loại đóng. Một người có thể vừa là Freelancer vừa là Recruiter (hai actor).</li>
<li><strong>Không nhất thiết là người</strong> — hệ thống ngoài (mail server, đăng nhập Google, cổng thanh toán), thiết bị vào/ra, hoặc <strong>timer</strong> (job chạy đêm để hết hạn tin cũ).</li>
</ul>
<p class="nhan">G5 "Job IT for Freelancer" — 4 actor</p>
<ul>
<li><strong>Guest</strong> — xem, tìm việc, xem công ty, đăng ký tài khoản.</li>
<li><strong>Freelancer</strong> — quản lý hồ sơ, tìm và ứng tuyển, lưu yêu thích, báo cáo tin.</li>
<li><strong>Recruiter</strong> — đăng tin, quản lý ứng viên, xem freelancer.</li>
<li><strong>Administrator</strong> — quản lý tài khoản, danh mục, kỹ năng, blog, duyệt dự án.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>"Database" không phải actor.</strong> Một UC của G5 ghi "System, Database" là secondary actor — sai: cả hai nằm <em>trong</em> ranh giới hệ thống. Chỉ hệ thống ngoài mà bạn không xây (vd dịch vụ e-mail) mới là actor.</div>`],
      [8, 'Sample actors',
        `<p class="y-chinh">🎯 Three kinds of actor: human users, other systems, and devices.</p>
<ul>
<li><strong>Users</strong> — homeowners on the HOLIS home-lighting system; authors on a word processor.</li>
<li><strong>Other systems or applications</strong> — the HOLIS Control Switch is an actor for the HOLIS Central Control Unit (one system talks to another).</li>
<li><strong>A device</strong> — lights, a printer.</li>
</ul>
<p class="nhan">The same three kinds in a SWP391 web system</p>
<ul>
<li><strong>Users</strong> — Guest, Freelancer, Recruiter, Admin.</li>
<li><strong>Other systems</strong> — Gmail/SMTP (G5 resets passwords by e-mail), Google OAuth for "Login with Google", VNPay for payment.</li>
<li><strong>Timer</strong> — a scheduled job that closes expired job posts (list it under <em>Non-UI Functions</em> in the SRS).</li>
</ul>
<p class="ghi-chu">HOLIS (Home Lighting Integrated System) is the running case study of Leffingwell &amp; Widrig, <em>Managing Software Requirements</em>.</p>`,
        `<p class="y-chinh">🎯 Ba loại actor: người dùng, hệ thống khác, và thiết bị.</p>
<ul>
<li><strong>Người dùng</strong> — chủ nhà trên hệ thống chiếu sáng HOLIS; tác giả trên trình soạn thảo văn bản.</li>
<li><strong>Hệ thống / ứng dụng khác</strong> — HOLIS Control Switch là actor của HOLIS Central Control Unit (hệ thống này nói chuyện với hệ thống kia).</li>
<li><strong>Thiết bị</strong> — đèn, máy in.</li>
</ul>
<p class="nhan">Đúng ba loại đó trong một hệ thống web SWP391</p>
<ul>
<li><strong>Người dùng</strong> — Guest, Freelancer, Recruiter, Admin.</li>
<li><strong>Hệ thống khác</strong> — Gmail/SMTP (G5 đặt lại mật khẩu qua e-mail), Google OAuth cho "Login with Google", VNPay để thanh toán.</li>
<li><strong>Timer</strong> — job định kỳ đóng các tin tuyển dụng hết hạn (ghi vào mục <em>Non-UI Functions</em> của SRS).</li>
</ul>
<p class="ghi-chu">HOLIS (Home Lighting Integrated System) là ví dụ xuyên suốt trong sách <em>Managing Software Requirements</em> của Leffingwell &amp; Widrig.</p>`],
      [9, 'Identifying actors',
        `<p class="y-chinh">🎯 Three questions that make the actors appear.</p>
<ol>
<li><strong>Who (or what) is notified</strong> when something occurs in the system? — the Freelancer is told when an application changes status; the Recruiter when someone applies.</li>
<li><strong>Who (or what) provides information or services</strong> to the system? — the Recruiter provides job posts; the mail server provides e-mail delivery.</li>
<li><strong>Who (or what) helps the system respond</strong> to and complete a task? — the Admin approves a reported post; Google confirms an OAuth login.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> Notified · Provides · Helps — ask all three for every feature, and write each answer as a row of the <em>Actors</em> table (SRS 1.3.1).</p>`,
        `<p class="y-chinh">🎯 Ba câu hỏi làm lộ ra các actor.</p>
<ol>
<li><strong>Ai (hoặc cái gì) được thông báo</strong> khi có chuyện xảy ra trong hệ thống? — Freelancer được báo khi đơn ứng tuyển đổi trạng thái; Recruiter khi có người ứng tuyển.</li>
<li><strong>Ai (hoặc cái gì) cung cấp thông tin hay dịch vụ</strong> cho hệ thống? — Recruiter cung cấp tin tuyển dụng; mail server cung cấp việc gửi e-mail.</li>
<li><strong>Ai (hoặc cái gì) giúp hệ thống phản hồi</strong> và hoàn tất công việc? — Admin duyệt tin bị báo cáo; Google xác nhận đăng nhập OAuth.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Được báo · Cung cấp · Giúp đỡ — hỏi cả ba cho mọi tính năng, rồi ghi mỗi câu trả lời thành một dòng của bảng <em>Actors</em> (SRS 1.3.1).</p>`],
      [10, 'Simple online shop example',
        `<p class="y-chinh">🎯 A first use-case diagram: two actors, five use cases, one system boundary.</p>
<p class="nhan">What the diagram shows</p>
<ul>
<li><strong>Customer</strong> — Browse Catalog, Make Order Request, View Order.</li>
<li><strong>Supplier</strong> — Process Delivery Order, Confirm Shipment and Bill Customer.</li>
<li><strong>The rectangle</strong> is the system boundary; actors stay outside it, use cases inside.</li>
<li><strong>A plain line</strong> (association) means the actor takes part in that use case.</li>
</ul>
<p class="nhan">Read it like the teacher does</p>
<ul>
<li><strong>Every UC name is verb + object</strong> — "Browse Catalog", not "Catalog".</li>
<li><strong>Every use case gives value</strong> to an actor — no "Connect to DB" bubble.</li>
</ul>
<p class="ghi-chu">This is the Online Shopping System case study of Gomaa, <em>Software Modeling and Design</em> — the same book the design decks follow.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ use case đầu tiên: hai actor, năm use case, một ranh giới hệ thống.</p>
<p class="nhan">Sơ đồ cho thấy</p>
<ul>
<li><strong>Customer</strong> — Browse Catalog, Make Order Request, View Order.</li>
<li><strong>Supplier</strong> — Process Delivery Order, Confirm Shipment and Bill Customer.</li>
<li><strong>Hình chữ nhật</strong> là ranh giới hệ thống; actor ở ngoài, use case ở trong.</li>
<li><strong>Đường thẳng</strong> (association) nghĩa là actor tham gia use case đó.</li>
</ul>
<p class="nhan">Đọc như thầy/cô đọc</p>
<ul>
<li><strong>Tên UC luôn là động từ + danh từ</strong> — "Browse Catalog", không phải "Catalog".</li>
<li><strong>Mỗi use case mang giá trị</strong> cho một actor — không có bong bóng "Connect to DB".</li>
</ul>
<p class="ghi-chu">Đây là ví dụ Online Shopping System trong sách <em>Software Modeling and Design</em> của Gomaa — cùng cuốn mà các slide thiết kế đi theo.</p>`],
      [11, 'UC Diagram & Relationships',
        `<p class="y-chinh">🎯 Three relationships: generalization, include (mandatory) and extend (optional).</p>
<p class="nhan">Read the university example</p>
<ul>
<li><strong>Generalization</strong> (hollow triangle) — International Student <em>is a</em> Student and inherits all its use cases; "Enroll Family Member in University" is a special kind of "Enroll in University".</li>
<li><strong>&lt;&lt;include&gt;&gt;</strong> — <em>mandatory</em>: "Enroll in University" always performs "Enroll in Seminar". Arrow from the base UC <em>to</em> the included UC.</li>
<li><strong>&lt;&lt;extend&gt;&gt;</strong> — <em>optional</em>, under a condition: "Perform Security Check" extends "Enroll in University" only for some students. Arrow from the extension <em>to</em> the base UC.</li>
</ul>
<p class="nhan">In a SWP391 system</p>
<ul>
<li><strong>include</strong> — "Apply Job" includes "Login" (it always requires an authenticated freelancer).</li>
<li><strong>extend</strong> — "Reset Password" extends "Login System"; "Add New Setting" extends "View System Settings".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> in<strong>clude</strong> = al<strong>ways</strong> (arrow goes out of the base); <strong>ex</strong>tend = <strong>ex</strong>tra, sometimes (arrow comes back into the base).</p>
<div class="pitfall">Do not draw include/extend for every step — a diagram full of dashed arrows is functional decomposition (page 13). Use them only when a behaviour is shared or truly optional.</div>`,
        `<p class="y-chinh">🎯 Ba quan hệ: generalization, include (bắt buộc) và extend (tuỳ chọn).</p>
<p class="nhan">Đọc ví dụ trường đại học</p>
<ul>
<li><strong>Generalization</strong> (tam giác rỗng) — International Student <em>là một</em> Student và thừa hưởng mọi use case của nó; "Enroll Family Member in University" là một dạng đặc biệt của "Enroll in University".</li>
<li><strong>&lt;&lt;include&gt;&gt;</strong> — <em>bắt buộc</em>: "Enroll in University" luôn thực hiện "Enroll in Seminar". Mũi tên đi từ UC gốc <em>tới</em> UC được include.</li>
<li><strong>&lt;&lt;extend&gt;&gt;</strong> — <em>tuỳ chọn</em>, theo điều kiện: "Perform Security Check" mở rộng "Enroll in University" chỉ với một số sinh viên. Mũi tên đi từ UC mở rộng <em>về</em> UC gốc.</li>
</ul>
<p class="nhan">Trong một hệ thống SWP391</p>
<ul>
<li><strong>include</strong> — "Apply Job" include "Login" (luôn cần freelancer đã đăng nhập).</li>
<li><strong>extend</strong> — "Reset Password" extend "Login System"; "Add New Setting" extend "View System Settings".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> in<strong>clude</strong> = luôn luôn (mũi tên đi ra từ UC gốc); <strong>ex</strong>tend = thêm, lúc có lúc không (mũi tên quay về UC gốc).</p>
<div class="pitfall">Đừng vẽ include/extend cho mọi bước — sơ đồ đầy mũi tên đứt nét là phân rã chức năng (trang 13). Chỉ dùng khi hành vi được dùng chung hoặc thật sự tuỳ chọn.</div>`],
      [12, 'Primary vs secondary actors',
        `<p class="y-chinh">🎯 The primary actor starts the use case and gets its value; secondary actors only take part.</p>
<ul>
<li><strong>Primary actor</strong> — initiates the UC; the first step is its input, and it gains the value.</li>
<li><strong>Secondary actor</strong> — participates: receives a notification or provides a service.</li>
</ul>
<p class="nhan">The Online Shop administration diagram</p>
<ul>
<li><strong>Administrator</strong> is primary for View System Settings and View User Accounts (and their extensions Add/Update Setting, Add/Update Account).</li>
<li><strong>Customer</strong> is secondary: "Add New Account" includes "Notify New Account Creation", which sends the customer an e-mail.</li>
</ul>
<p class="nhan">In the SRS table</p>
<ul>
<li>Fill <strong>Primary Actors</strong> and <strong>Secondary Actors</strong> separately. G5 "Change status Freelancer": primary = Admin, secondary = Freelancer (who is notified of the change).</li>
</ul>`,
        `<p class="y-chinh">🎯 Actor chính khởi động use case và nhận giá trị; actor phụ chỉ tham gia.</p>
<ul>
<li><strong>Primary actor</strong> — khởi động UC; bước đầu tiên là đầu vào của nó, và nó nhận được giá trị.</li>
<li><strong>Secondary actor</strong> — tham gia: nhận thông báo hoặc cung cấp một dịch vụ.</li>
</ul>
<p class="nhan">Sơ đồ quản trị Online Shop</p>
<ul>
<li><strong>Administrator</strong> là actor chính của View System Settings và View User Accounts (cùng các mở rộng Add/Update Setting, Add/Update Account).</li>
<li><strong>Customer</strong> là actor phụ: "Add New Account" include "Notify New Account Creation", gửi e-mail cho khách.</li>
</ul>
<p class="nhan">Trong bảng SRS</p>
<ul>
<li>Điền <strong>Primary Actors</strong> và <strong>Secondary Actors</strong> riêng. G5 "Change status Freelancer": chính = Admin, phụ = Freelancer (người được báo về thay đổi).</li>
</ul>`],
    ]),
    bi(`<h2>🛠️ Worked example — the requirement skeleton of G5 "Job IT for Freelancer"</h2>
<p>G5 is the teacher's sample team (their RDS is in the course folder). Below is their system rebuilt step by step with the rules of pages 3–12 — the same steps your team does in the first slots of Iteration 1.</p>
<p class="nhan">Step 1 — Vision in one sentence</p>
<p>"Help freelance workers find IT jobs through job posts from companies that need labour" (G5 product vision). Everyone in the team must be able to say it.</p>
<p class="nhan">Step 2 — Context: what is inside and outside</p>
<ul>
<li><strong>Inside</strong> — job posts, applications, profiles, favourites, reports, categories, skills, blogs, dashboards.</li>
<li><strong>Outside (external entities)</strong> — Guest, Freelancer, Recruiter, Admin, and the e-mail service (password reset).</li>
<li><strong>Excluded</strong> — negotiation, contract signing, dispute resolution; payment processing (EX-1, EX-2).</li>
</ul>
<p class="nhan">Step 3 — Actors table (SRS 1.3.1)</p>
<table>
<thead><tr><th>#</th><th>Actor</th><th>Description</th></tr></thead>
<tbody>
<tr><td>1</td><td>Guest</td><td>Not logged in; views and searches job posts, views companies and freelancers, registers</td></tr>
<tr><td>2</td><td>Freelancer</td><td>Maintains a profile with skills; searches, bookmarks, applies for and reports posts; follows application status</td></tr>
<tr><td>3</td><td>Recruiter</td><td>Company or individual who posts jobs, reviews applicants, marks freelancers</td></tr>
<tr><td>4</td><td>Administrator</td><td>Operates the site: accounts, categories, skills, blogs, project approval, reports</td></tr>
<tr><td>5</td><td>E-mail service</td><td>External system that delivers reset-password and notification e-mails</td></tr>
</tbody>
</table>
<p class="nhan">Step 4 — Functional vs non-functional, written so they can be tested</p>
<table>
<thead><tr><th>Type</th><th>Weak (loses marks)</th><th>Good</th></tr></thead>
<tbody>
<tr><td>FR</td><td>"Freelancer can manage jobs"</td><td>"Freelancer applies for an open job post by uploading a CV (PDF, ≤ 5 MB)"</td></tr>
<tr><td>FR</td><td>"Admin manages users"</td><td>"Admin changes a freelancer account status between Active and Suspended"</td></tr>
<tr><td>NFR · performance</td><td>"The site is fast"</td><td>"Job list with 1,000 posts returns page 1 in ≤ 2 s"</td></tr>
<tr><td>NFR · security</td><td>"The site is secure"</td><td>"Passwords are stored hashed; 5 wrong logins lock the account for 30 min"</td></tr>
<tr><td>NFR · usability</td><td>"Easy to use"</td><td>"A first-time freelancer can apply for a job in ≤ 3 minutes without help"</td></tr>
</tbody>
</table>
<p class="nhan">Step 5 — Use-case diagram for the Freelancer (draw it in draw.io / StarUML)</p>
<ul>
<li><strong>Associations</strong> — Search Job Post · View Post Detail · Apply Job · View List Apply · Add Post to Favourites · View Favourites · Report Post · View Job for You · Update Profile · Change Password</li>
<li><strong>Generalization</strong> — Freelancer and Recruiter both specialise a "User" actor that owns Login, Logout, Change Password.</li>
<li><strong>&lt;&lt;extend&gt;&gt;</strong> — Filter by Category / Location extend Search Job Post; Reset Password extends Login.</li>
</ul>
<p class="ghi-chu">One diagram per actor (or per workflow) is exactly what SRS section 1.3.2 asks for — G5 drew one each for Guest, Freelancer and Recruiter.</p>`,
    `<h2>🛠️ Ví dụ có lời giải — bộ khung yêu cầu của G5 "Job IT for Freelancer"</h2>
<p>G5 là nhóm mẫu của thầy/cô (RDS của họ nằm trong thư mục môn học). Dưới đây là hệ thống của họ được dựng lại từng bước theo đúng các quy tắc ở trang 3–12 — cũng là các bước nhóm bạn làm trong những slot đầu của Iteration 1.</p>
<p class="nhan">Bước 1 — Tầm nhìn trong một câu</p>
<p>"Giúp người làm tự do tìm việc IT qua các tin tuyển dụng của công ty cần nhân lực" (product vision của G5). Cả nhóm phải nói được câu này.</p>
<p class="nhan">Bước 2 — Context: cái gì trong, cái gì ngoài</p>
<ul>
<li><strong>Trong</strong> — tin tuyển dụng, đơn ứng tuyển, hồ sơ, yêu thích, báo cáo, danh mục, kỹ năng, blog, dashboard.</li>
<li><strong>Ngoài (thực thể ngoài)</strong> — Guest, Freelancer, Recruiter, Admin, và dịch vụ e-mail (đặt lại mật khẩu).</li>
<li><strong>Loại trừ</strong> — đàm phán, ký hợp đồng, giải quyết tranh chấp; xử lý thanh toán (EX-1, EX-2).</li>
</ul>
<p class="nhan">Bước 3 — Bảng Actors (SRS 1.3.1)</p>
<table>
<thead><tr><th>#</th><th>Actor</th><th>Mô tả</th></tr></thead>
<tbody>
<tr><td>1</td><td>Guest</td><td>Chưa đăng nhập; xem và tìm tin tuyển dụng, xem công ty và freelancer, đăng ký</td></tr>
<tr><td>2</td><td>Freelancer</td><td>Có hồ sơ kèm kỹ năng; tìm, lưu, ứng tuyển và báo cáo tin; theo dõi trạng thái đơn</td></tr>
<tr><td>3</td><td>Recruiter</td><td>Công ty hoặc cá nhân đăng tin, xét ứng viên, đánh dấu freelancer</td></tr>
<tr><td>4</td><td>Administrator</td><td>Vận hành trang: tài khoản, danh mục, kỹ năng, blog, duyệt dự án, báo cáo</td></tr>
<tr><td>5</td><td>E-mail service</td><td>Hệ thống ngoài gửi e-mail đặt lại mật khẩu và thông báo</td></tr>
</tbody>
</table>
<p class="nhan">Bước 4 — Chức năng vs phi chức năng, viết sao cho test được</p>
<table>
<thead><tr><th>Loại</th><th>Yếu (mất điểm)</th><th>Tốt</th></tr></thead>
<tbody>
<tr><td>FR</td><td>"Freelancer quản lý công việc"</td><td>"Freelancer ứng tuyển một tin đang mở bằng cách tải CV (PDF, ≤ 5 MB)"</td></tr>
<tr><td>FR</td><td>"Admin quản lý user"</td><td>"Admin đổi trạng thái tài khoản freelancer giữa Active và Suspended"</td></tr>
<tr><td>NFR · hiệu năng</td><td>"Trang chạy nhanh"</td><td>"Danh sách 1.000 tin trả trang 1 trong ≤ 2 giây"</td></tr>
<tr><td>NFR · bảo mật</td><td>"Trang an toàn"</td><td>"Mật khẩu lưu dạng băm; sai 5 lần thì khoá tài khoản 30 phút"</td></tr>
<tr><td>NFR · dễ dùng</td><td>"Dễ sử dụng"</td><td>"Freelancer lần đầu ứng tuyển được một job trong ≤ 3 phút không cần trợ giúp"</td></tr>
</tbody>
</table>
<p class="nhan">Bước 5 — Sơ đồ use case cho Freelancer (vẽ bằng draw.io / StarUML)</p>
<ul>
<li><strong>Association</strong> — Search Job Post · View Post Detail · Apply Job · View List Apply · Add Post to Favourites · View Favourites · Report Post · View Job for You · Update Profile · Change Password</li>
<li><strong>Generalization</strong> — Freelancer và Recruiter cùng kế thừa actor "User" sở hữu Login, Logout, Change Password.</li>
<li><strong>&lt;&lt;extend&gt;&gt;</strong> — Filter by Category / Location extend Search Job Post; Reset Password extend Login.</li>
</ul>
<p class="ghi-chu">Mỗi actor (hoặc mỗi workflow) một sơ đồ đúng là điều mục 1.3.2 của SRS yêu cầu — G5 vẽ riêng cho Guest, Freelancer và Recruiter.</p>`),
    bi(`<h3>Elicitation techniques you can really use in 6 slots</h3>
<ol>
<li><strong>Interview the PO (teacher)</strong> — bring 5–10 written questions per slot; record answers in a Q&amp;A issue on GitLab (label <em>Q&amp;A</em>).</li>
<li><strong>Study existing systems</strong> — two or three real job sites; list what to copy, what to skip.</li>
<li><strong>Document analysis</strong> — forms, spreadsheets, the G5 sample RDS.</li>
<li><strong>Prototype</strong> — show a wireframe and ask "is this what you mean?" (lesson 2.3).</li>
<li><strong>AI role-play</strong> — let an AI act as a senior BA that questions you (lesson 2.5) — then confirm every answer with the teacher.</li>
</ol>
<p class="nhan">Mistakes that cost marks here</p>
<div class="pitfall co-tieu-de"><strong>Actors named after people or tables.</strong> "Mr Admin", "tblUser" — use roles: Admin, Freelancer.</div>
<div class="pitfall co-tieu-de"><strong>One giant diagram.</strong> 60 bubbles on one page cannot be read; split by actor or feature.</div>
<div class="pitfall co-tieu-de"><strong>Requirements frozen after Iteration 1.</strong> When the teacher changes a rule, update the document and add a row to <em>Record of Changes</em> — a stale document is marked down in Iterations 2 and 3.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>What makes one requirement "good"?</strong> ISO/IEC/IEEE 29148 lists the characteristics: <em>necessary, unambiguous, complete, singular, feasible, verifiable, correct</em> and <em>traceable</em>. Check each FR with two questions: "Can a tester write a pass/fail test for it?" (verifiable) and "Which use case and which screen does it belong to?" (traceable). If either answer is "no", rewrite it.</div>`,
    `<h3>Kỹ thuật thu thập yêu cầu dùng được thật trong 6 slot</h3>
<ol>
<li><strong>Phỏng vấn PO (thầy/cô)</strong> — mang 5–10 câu hỏi viết sẵn mỗi slot; ghi câu trả lời vào một issue Q&amp;A trên GitLab (label <em>Q&amp;A</em>).</li>
<li><strong>Nghiên cứu hệ thống có sẵn</strong> — hai ba trang tuyển dụng thật; liệt kê cái nên học, cái bỏ qua.</li>
<li><strong>Phân tích tài liệu</strong> — biểu mẫu, bảng tính, RDS mẫu của G5.</li>
<li><strong>Prototype</strong> — đưa wireframe và hỏi "ý thầy/cô có phải thế này?" (bài 2.3).</li>
<li><strong>AI đóng vai</strong> — để AI làm senior BA đặt câu hỏi cho bạn (bài 2.5) — rồi xác nhận mọi câu trả lời với thầy/cô.</li>
</ol>
<p class="nhan">Lỗi làm mất điểm ở phần này</p>
<div class="pitfall co-tieu-de"><strong>Đặt tên actor theo người hoặc bảng.</strong> "Anh Admin", "tblUser" — hãy dùng vai trò: Admin, Freelancer.</div>
<div class="pitfall co-tieu-de"><strong>Một sơ đồ khổng lồ.</strong> 60 bong bóng trên một trang thì không đọc được; tách theo actor hoặc tính năng.</div>
<div class="pitfall co-tieu-de"><strong>Đóng băng yêu cầu sau Iteration 1.</strong> Khi thầy/cô đổi một quy tắc, hãy cập nhật tài liệu và thêm một dòng vào <em>Record of Changes</em> — tài liệu lỗi thời bị trừ điểm ở Iteration 2 và 3.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Thế nào là một yêu cầu "tốt"?</strong> ISO/IEC/IEEE 29148 liệt kê các đặc tính: <em>cần thiết, không mơ hồ, đầy đủ, đơn nhất, khả thi, kiểm chứng được, đúng</em> và <em>truy vết được</em>. Kiểm mỗi FR bằng hai câu: "Tester có viết được test pass/fail cho nó không?" (kiểm chứng được) và "Nó thuộc use case nào, màn hình nào?" (truy vết được). Câu nào trả lời "không" thì viết lại.</div>`),
    books([
      ['wiegers', 'Ch. 1 (the essential software requirement), Ch. 7 (requirements elicitation), Ch. 14 (quality attributes)', 'Chương 1 (yêu cầu phần mềm cốt lõi), Chương 7 (thu thập yêu cầu), Chương 14 (thuộc tính chất lượng)'],
      ['gomaa', 'Ch. 6 — Use case modeling (actors, relationships; the source of pages 3–12)', 'Chương 6 — Use case modeling (actor, quan hệ; nguồn của trang 3–12)'],
      ['sommerville', 'Ch. 4 — Requirements engineering; Ch. 5.1–5.2 — context models and use cases', 'Chương 4 — Requirements engineering; mục 5.1–5.2 — context model và use case'],
      ['fowler', 'Ch. 9 — Use cases', 'Chương 9 — Use cases'],
    ]),
  ].join('\n'),
};

/* ─────────────── 2.2 Identifying & documenting use cases ─────────────── */
const L22 = {
  title: '2.2 — Identifying, naming & documenting use cases|||2.2 — Tìm, đặt tên & đặc tả use case',
  slug: 'swp391-2-2-use-case-backlog',
  type: 'VIDEO',
  description: 'Slide2 Software Requirement trang 13–19: tìm use case, tránh phân rã chức năng, đặt tên động từ + danh từ, ví dụ ATM và Online Shopping, các trường của đặc tả use case (trigger, pre/postcondition, normal/alternative flow, exception, business rule) — kèm đặc tả đầy đủ UC "Apply Job" của G5 và cách đưa use case vào Project Tracking.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.2 · Slide2 Software Requirement, pages 13–19</span>
<h2>From actors to use cases you can specify, build and test</h2>
<p class="lead">Once the actors are known, the next job is to list the use cases — the right size, the right names — and then write the specification of the complex ones. In SWP391 each use case becomes one or more rows of the <em>Use Cases</em> and <em>Product</em> sheets of your Project Tracking file, owned by one member and planned into an iteration.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>find use cases with the four questions of page 14 and name them <strong>verb + object</strong>;</li>
<li>avoid <strong>functional decomposition</strong> (too-small use cases);</li>
<li>fill every field of a <strong>use-case specification</strong>: trigger, preconditions, postconditions, normal flow, alternative flows, exceptions, business rules;</li>
<li>turn the use-case list into tracking rows with an owner and an iteration.</li>
</ul></div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.2 · Slide2 Software Requirement, trang 13–19</span>
<h2>Từ actor tới những use case đặc tả được, xây được, test được</h2>
<p class="lead">Khi đã biết các actor, việc tiếp theo là liệt kê use case — đúng cỡ, đúng tên — rồi viết đặc tả cho những use case phức tạp. Ở SWP391 mỗi use case trở thành một hay nhiều dòng trong sheet <em>Use Cases</em> và <em>Product</em> của file Project Tracking, do một thành viên phụ trách và được xếp vào một iteration.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>tìm use case bằng bốn câu hỏi ở trang 14 và đặt tên <strong>động từ + danh từ</strong>;</li>
<li>tránh <strong>phân rã chức năng</strong> (use case quá nhỏ);</li>
<li>điền mọi trường của <strong>đặc tả use case</strong>: trigger, precondition, postcondition, normal flow, alternative flow, exception, business rule;</li>
<li>biến danh sách use case thành các dòng tracking có người phụ trách và iteration.</li>
</ul></div>`),
    walkHead(R, 13, 19, 'Business rules (pages 20–25) and prototyping (26–32) follow in lesson 2.3.', 'Business rule (trang 20–25) và prototyping (26–32) học tiếp ở bài 2.3.'),
    walk(R, [
      [13, 'Identifying Use Cases',
        `<p class="y-chinh">🎯 A use case is a whole interaction that gives an actor a result of value — never a tiny function.</p>
<ul>
<li><strong>Definition</strong> — a sequence of interactions between the system and an external actor that lets the actor achieve some outcome of value.</li>
<li><strong>The UCs are the functional specification</strong> — together they describe every functional requirement.</li>
<li><strong>Start from the actors</strong> — for each actor, list the interactions it has with the system.</li>
<li><strong>Avoid functional decomposition</strong> — many small UCs that each describe one function, instead of one sequence that gives a useful result.</li>
</ul>
<p class="nhan">Decomposition vs a real use case</p>
<table>
<thead><tr><th>Too small (decomposition)</th><th>One real use case</th></tr></thead>
<tbody>
<tr><td>Enter title · Choose category · Choose skills · Enter budget · Click Save</td><td><strong>Create Job Post</strong></td></tr>
<tr><td>Validate email · Check password · Create session</td><td><strong>Login System</strong></td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> if the actor would not stop and feel "done" after it, it is a step, not a use case.</p>`,
        `<p class="y-chinh">🎯 Use case là cả một lượt tương tác mang lại cho actor một kết quả có giá trị — không bao giờ là một hàm nhỏ.</p>
<ul>
<li><strong>Định nghĩa</strong> — chuỗi tương tác giữa hệ thống và một actor bên ngoài giúp actor đạt một kết quả có giá trị.</li>
<li><strong>Các UC chính là đặc tả chức năng</strong> — gộp lại, chúng mô tả mọi yêu cầu chức năng.</li>
<li><strong>Bắt đầu từ actor</strong> — với mỗi actor, liệt kê các tương tác của nó với hệ thống.</li>
<li><strong>Tránh phân rã chức năng</strong> — nhiều UC nhỏ mỗi cái tả một hàm, thay vì một chuỗi mang lại kết quả hữu ích.</li>
</ul>
<p class="nhan">Phân rã vs use case thật</p>
<table>
<thead><tr><th>Quá nhỏ (phân rã)</th><th>Một use case thật</th></tr></thead>
<tbody>
<tr><td>Nhập tiêu đề · Chọn danh mục · Chọn kỹ năng · Nhập ngân sách · Bấm Save</td><td><strong>Create Job Post</strong></td></tr>
<tr><td>Kiểm email · Kiểm mật khẩu · Tạo session</td><td><strong>Login System</strong></td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nếu làm xong mà actor chưa thấy "xong việc", đó là một bước, không phải use case.</p>`],
      [14, 'Use case considering and naming',
        `<p class="y-chinh">🎯 Four questions find the use cases; a verb + object name makes their value obvious.</p>
<p class="nhan">Questions per actor</p>
<ol>
<li><strong>What will the actor use the system for?</strong> — Recruiter: to hire freelancers.</li>
<li><strong>Will it create, store, change, remove or read data?</strong> — Create/Update/Delete Job Post, View My Posts (CRUD often gives 2–4 UCs per entity).</li>
<li><strong>Must it inform the system about external events?</strong> — Freelancer reports a fake post.</li>
<li><strong>Must it be informed about occurrences?</strong> — Freelancer views application status.</li>
</ol>
<p class="nhan">Naming</p>
<ul>
<li><strong>Verb + object</strong> — "Apply Job", "Change Status Freelancer", "View List Apply".</li>
<li><strong>Strong and descriptive</strong> — the value must be clear from the name: "Manage applicants" is vague; "Accept or Reject Applicant" is clear.</li>
</ul>
<div class="pitfall">Names like "Job", "Admin page", "Process" or "Freelancer function" are rejected in review — no verb, no value.</div>`,
        `<p class="y-chinh">🎯 Bốn câu hỏi giúp tìm use case; tên động từ + danh từ làm giá trị của nó hiện rõ.</p>
<p class="nhan">Câu hỏi cho mỗi actor</p>
<ol>
<li><strong>Actor dùng hệ thống để làm gì?</strong> — Recruiter: để tuyển freelancer.</li>
<li><strong>Nó có tạo, lưu, sửa, xoá hay đọc dữ liệu không?</strong> — Create/Update/Delete Job Post, View My Posts (CRUD thường cho 2–4 UC mỗi thực thể).</li>
<li><strong>Nó có phải báo cho hệ thống biết sự kiện bên ngoài không?</strong> — Freelancer báo cáo tin giả.</li>
<li><strong>Nó có cần được báo về sự việc trong hệ thống không?</strong> — Freelancer xem trạng thái đơn ứng tuyển.</li>
</ol>
<p class="nhan">Đặt tên</p>
<ul>
<li><strong>Động từ + danh từ</strong> — "Apply Job", "Change Status Freelancer", "View List Apply".</li>
<li><strong>Mạnh và rõ nghĩa</strong> — nhìn tên phải thấy giá trị: "Manage applicants" mơ hồ; "Accept or Reject Applicant" rõ ràng.</li>
</ul>
<div class="pitfall">Tên như "Job", "Admin page", "Process" hay "Freelancer function" bị bác khi review — không động từ, không giá trị.</div>`],
      [15, 'Simple Banking Example',
        `<p class="y-chinh">🎯 Distinct goals = distinct use cases: Withdraw Funds, Query Account and Transfer Funds are three UCs, not one.</p>
<ul>
<li><strong>Same actor</strong> — the ATM Customer starts all three.</li>
<li><strong>Different useful results</strong> — cash, a balance, moved money — so each is modelled separately rather than inside "Withdraw Funds".</li>
</ul>
<p class="nhan">The SWP391 version</p>
<ul>
<li><strong>Freelancer</strong> — "Apply Job", "View List Apply" and "Add Post to Favourites" are separate UCs even though they all start on the Post Detail screen.</li>
<li><strong>Counting consequence</strong> — separate UCs make separate tracking rows, so each can be owned, sized (Level 1–5) and planned.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục tiêu khác nhau = use case khác nhau: Withdraw Funds, Query Account và Transfer Funds là ba UC, không phải một.</p>
<ul>
<li><strong>Cùng một actor</strong> — ATM Customer khởi động cả ba.</li>
<li><strong>Kết quả hữu ích khác nhau</strong> — tiền mặt, số dư, tiền được chuyển — nên mỗi cái được mô hình riêng thay vì nằm trong "Withdraw Funds".</li>
</ul>
<p class="nhan">Phiên bản SWP391</p>
<ul>
<li><strong>Freelancer</strong> — "Apply Job", "View List Apply" và "Add Post to Favourites" là các UC riêng dù đều bắt đầu từ màn Post Detail.</li>
<li><strong>Hệ quả khi tính điểm</strong> — UC riêng thành dòng tracking riêng, nên từng cái có người phụ trách, được xếp mức (Level 1–5) và lên kế hoạch.</li>
</ul>`],
      [16, 'Online Shopping Example',
        `<p class="y-chinh">🎯 A real diagram for a food-ordering site: Guest and Customer, with extend and include used sparingly.</p>
<p class="nhan">Top diagram — Guest</p>
<ul>
<li><strong>Main UCs</strong> — View Home page, View food list, Register user account, Search menu.</li>
<li><strong>extend</strong> — View food details and View menu details extend the list UCs; Search menu by title / by date extend Search menu.</li>
</ul>
<p class="nhan">Bottom diagram — Customer (inherits Guest)</p>
<ul>
<li><strong>Account UCs</strong> — Login system (Reset password extends it), Log out, Edit user profile, Change password.</li>
<li><strong>Ordering UCs</strong> — Order a meal, View order history, Update meal order, View order details, Register for Payroll Deduction.</li>
<li><strong>include</strong> — Order a meal includes View menu details: you cannot order without seeing the menu.</li>
<li><strong>Generalization</strong> — the arrow from Customer to Guest: a Customer can do everything a Guest can.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> actor generalization saves lines — draw Login, Search, View Home once on the parent actor.</p>`,
        `<p class="y-chinh">🎯 Một sơ đồ thật của trang đặt món: Guest và Customer, dùng extend và include có chừng mực.</p>
<p class="nhan">Sơ đồ trên — Guest</p>
<ul>
<li><strong>UC chính</strong> — View Home page, View food list, Register user account, Search menu.</li>
<li><strong>extend</strong> — View food details và View menu details mở rộng các UC danh sách; Search menu by title / by date mở rộng Search menu.</li>
</ul>
<p class="nhan">Sơ đồ dưới — Customer (kế thừa Guest)</p>
<ul>
<li><strong>UC tài khoản</strong> — Login system (Reset password extend nó), Log out, Edit user profile, Change password.</li>
<li><strong>UC đặt món</strong> — Order a meal, View order history, Update meal order, View order details, Register for Payroll Deduction.</li>
<li><strong>include</strong> — Order a meal include View menu details: không xem menu thì không đặt được.</li>
<li><strong>Generalization</strong> — mũi tên từ Customer tới Guest: Customer làm được mọi thứ Guest làm.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> generalization giữa actor giúp bớt đường nối — vẽ Login, Search, View Home một lần trên actor cha.</p>`],
      [17, 'Documenting Use Cases — the UC template',
        `<p class="y-chinh">🎯 A use-case specification is a table of fixed fields; each field answers one precise question.</p>
<ol>
<li><strong>UC Name, Primary / Secondary Actor</strong> — who starts, who takes part.</li>
<li><strong>Trigger</strong> — the business event, system event or user action that starts the UC; it tells the system to begin checking the preconditions.</li>
<li><strong>Description</strong> — one or two sentences, or a user story.</li>
<li><strong>Preconditions</strong> — what must already be true before it can start.</li>
<li><strong>Postconditions</strong> — the state of the system after a <em>successful</em> end.</li>
<li><strong>Normal Flow</strong> — actor actions and system responses under normal, expected conditions.</li>
<li><strong>Alternative Flows</strong> — other <em>successful</em> ways through the UC and how their steps differ.</li>
<li><strong>Exceptions</strong> — anticipated error conditions and how the system responds.</li>
<li><strong>Business Rules</strong> — only the <em>IDs</em> (BR-01, BR-05); the text lives in the Business Rules table.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Postcondition = what happened, not what was shown.</strong> "Page reloads" is weak; "A JobApply record with status Pending exists for this freelancer and post" is testable.</div>`,
        `<p class="y-chinh">🎯 Đặc tả use case là một bảng các trường cố định; mỗi trường trả lời đúng một câu hỏi.</p>
<ol>
<li><strong>UC Name, Primary / Secondary Actor</strong> — ai khởi động, ai tham gia.</li>
<li><strong>Trigger</strong> — sự kiện nghiệp vụ, sự kiện hệ thống hay thao tác người dùng khởi động UC; nó báo hệ thống bắt đầu kiểm tra precondition.</li>
<li><strong>Description</strong> — một hai câu, hoặc một user story.</li>
<li><strong>Preconditions</strong> — điều phải đúng sẵn trước khi bắt đầu.</li>
<li><strong>Postconditions</strong> — trạng thái hệ thống sau khi kết thúc <em>thành công</em>.</li>
<li><strong>Normal Flow</strong> — thao tác của actor và phản hồi của hệ thống trong điều kiện bình thường.</li>
<li><strong>Alternative Flows</strong> — các đường <em>thành công</em> khác và các bước khác đi thế nào.</li>
<li><strong>Exceptions</strong> — tình huống lỗi lường trước và hệ thống phản ứng ra sao.</li>
<li><strong>Business Rules</strong> — chỉ ghi <em>mã</em> (BR-01, BR-05); nội dung nằm ở bảng Business Rules.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Postcondition = điều đã xảy ra, không phải thứ được hiển thị.</strong> "Trang tải lại" là yếu; "Tồn tại một bản ghi JobApply trạng thái Pending cho freelancer và tin này" thì test được.</div>`],
      [18, 'UC Spec — Withdraw Funds',
        `<p class="y-chinh">🎯 Gomaa's compact format (name, actor, summary, dependency, precondition, main sequence, alternatives, postcondition) on the ATM example.</p>
<p class="nhan">What to copy from it</p>
<ul>
<li><strong>Dependency</strong> — "Include Validate PIN": the include relation of the diagram, written in the spec.</li>
<li><strong>Numbered main sequence</strong> — 8 steps, each a single actor action or system response.</li>
<li><strong>Alternatives point to a step</strong> — "Step 3: insufficient funds → apology, eject card"; four alternatives hang on steps 3 and 5.</li>
<li><strong>Postcondition</strong> — "Customer funds have been withdrawn" — a state, not a screen.</li>
</ul>
<p class="nhan">Template1 vs Gomaa</p>
<ul>
<li>The FPT template splits Gomaa's "alternative sequences" into <strong>Alternative Flows</strong> (other successes) and <strong>Exceptions</strong> (errors). Here the four alternatives are really exceptions.</li>
</ul>`,
        `<p class="y-chinh">🎯 Định dạng gọn của Gomaa (tên, actor, tóm tắt, phụ thuộc, precondition, luồng chính, luồng thay thế, postcondition) trên ví dụ ATM.</p>
<p class="nhan">Điều nên học theo</p>
<ul>
<li><strong>Dependency</strong> — "Include Validate PIN": quan hệ include của sơ đồ, viết lại trong đặc tả.</li>
<li><strong>Luồng chính đánh số</strong> — 8 bước, mỗi bước là một thao tác actor hoặc một phản hồi hệ thống.</li>
<li><strong>Luồng thay thế chỉ vào một bước</strong> — "Step 3: không đủ tiền → xin lỗi, trả thẻ"; bốn nhánh treo ở bước 3 và 5.</li>
<li><strong>Postcondition</strong> — "Tiền của khách đã được rút" — một trạng thái, không phải một màn hình.</li>
</ul>
<p class="nhan">Template1 vs Gomaa</p>
<ul>
<li>Mẫu của FPT tách "alternative sequences" của Gomaa thành <strong>Alternative Flows</strong> (đường thành công khác) và <strong>Exceptions</strong> (lỗi). Ở đây cả bốn nhánh thực chất là exception.</li>
</ul>`],
      [19, 'UC description + activity diagram — Make Order Request',
        `<p class="y-chinh">🎯 Pair a complex use case with an activity diagram: the text gives the detail, the diagram shows every branch at a glance.</p>
<p class="nhan">The text (left side of the page)</p>
<ol>
<li>Customer provides the order request and account ID.</li>
<li>System retrieves the account, including credit-card details.</li>
<li>System checks the card for the amount; if approved, creates an authorization number.</li>
<li>System creates a delivery order.</li>
<li>System confirms approval and displays the order to the customer.</li>
</ol>
<p class="nhan">The diagram</p>
<ul>
<li><strong>Decision diamonds</strong> — [account does not exist] → Create New Account; [invalid] card → Display Invalid Credit Card.</li>
<li><strong>Each action box</strong> = one step of the text; each branch = one alternative.</li>
</ul>
<p class="ghi-chu">Template1 section 1.2 asks for the same idea at business level: a swim-lane diagram per main business process.</p>`,
        `<p class="y-chinh">🎯 Ghép use case phức tạp với activity diagram: phần chữ cho chi tiết, sơ đồ cho thấy mọi nhánh trong một cái nhìn.</p>
<p class="nhan">Phần chữ (bên trái trang)</p>
<ol>
<li>Khách gửi yêu cầu đặt hàng và mã tài khoản.</li>
<li>Hệ thống lấy thông tin tài khoản, gồm cả thẻ tín dụng.</li>
<li>Hệ thống kiểm thẻ với số tiền; nếu được duyệt thì tạo số uỷ quyền.</li>
<li>Hệ thống tạo đơn giao hàng.</li>
<li>Hệ thống xác nhận và hiển thị đơn cho khách.</li>
</ol>
<p class="nhan">Sơ đồ</p>
<ul>
<li><strong>Hình thoi quyết định</strong> — [account does not exist] → Create New Account; thẻ [invalid] → Display Invalid Credit Card.</li>
<li><strong>Mỗi hộp hành động</strong> = một bước của phần chữ; mỗi nhánh = một luồng thay thế.</li>
</ul>
<p class="ghi-chu">Mục 1.2 của Template1 đòi đúng ý này ở mức nghiệp vụ: mỗi quy trình nghiệp vụ chính một swim-lane diagram.</p>`],
    ]),
    bi(`<h2>🛠️ Worked example — full specification of G5 "Apply Job"</h2>
<p>G5 listed <em>Apply Job</em> as a Freelancer screen but left its specification empty. Here it is written with the Template1 fields (section 2 of the SRS), using G5's own data (table <code>JobApply</code>: applyID, freelanceID, postID, status, dateApply, Resume) and business rules (BR-05, BR-11). Rules marked <em>new</em> are ones we added — you would confirm them with the teacher.</p>
<table>
<tbody>
<tr><th>UC ID &amp; Name</th><td colspan="3">UC-15 Apply Job (feature: Freelancer › Job Application)</td></tr>
<tr><th>Primary Actors</th><td>Freelancer</td><th>Secondary Actors</th><td>Recruiter (notified), E-mail service</td></tr>
<tr><th>Trigger</th><td colspan="3">Freelancer clicks <strong>Apply</strong> on the Post Detail screen</td></tr>
<tr><th>Description</th><td colspan="3">As a freelancer, I want to apply for an open job post with my CV so that the recruiter can review me for the job.</td></tr>
<tr><th>Preconditions</th><td colspan="3">PRE-1 Freelancer is logged in and the account is Active. PRE-2 The post is approved and not expired.</td></tr>
<tr><th>Postconditions</th><td colspan="3">POST-1 A JobApply record (freelancer, post, CV path, dateApply = today, status = Pending) exists. POST-2 The recruiter of the post is notified. POST-3 The application appears in the freelancer's <em>List Apply</em>.</td></tr>
<tr><th>Normal Flow</th><td colspan="3"><ol>
<li>Freelancer clicks Apply on a job post.</li>
<li>System shows the Apply form: post title, company, budget, a CV upload field, an optional cover note.</li>
<li>Freelancer chooses a CV file and clicks Submit.</li>
<li>System validates the post and the file (BR-05, BR-13, BR-14).</li>
<li>System saves the application with status Pending and stores the CV.</li>
<li>System sends a notification e-mail to the recruiter.</li>
<li>System shows MSG21 "Applied successfully" and opens List Apply.</li>
</ol></td></tr>
<tr><th>Alternative Flows</th><td colspan="3"><strong>A1 — Guest clicks Apply (at step 1)</strong>: System opens Login (UC-1); after a successful login it returns to step 2 for the same post.<br><strong>A2 — Use the CV already in the profile (at step 3)</strong>: Freelancer ticks "Use my profile CV"; continue at step 4.</td></tr>
<tr><th>Exceptions</th><td colspan="3"><strong>E1 — Post expired or closed (step 4)</strong>: MSG22, the UC ends.<br><strong>E2 — Already applied (step 4)</strong>: MSG23 with a link to List Apply, the UC ends.<br><strong>E3 — Wrong file type or size (step 4)</strong>: MSG24 under the field; back to step 3.<br><strong>E4 — E-mail cannot be sent (step 6)</strong>: the application is still saved; the failure is logged.</td></tr>
<tr><th>Business Rules</th><td colspan="3">BR-05, BR-11, BR-13, BR-14</td></tr>
<tr><th>Priority</th><td colspan="3">Must have — Iteration 1 (it is the core transaction of the system)</td></tr>
</tbody>
</table>
<p class="nhan">The rules it refers to (they live in SRS 5.1)</p>
<ul>
<li><strong>BR-05</strong> (G5) — Freelancers can apply for posted jobs within the application period.</li>
<li><strong>BR-11</strong> (G5) — Freelancers who have applied cannot cancel their application.</li>
<li><strong>BR-13</strong> (new) — A freelancer can apply to the same post only once.</li>
<li><strong>BR-14</strong> (new) — A CV is a PDF or DOCX file of at most 5 MB.</li>
</ul>
<p class="nhan">Check it like the grader</p>
<ol>
<li><strong>Every step is actor → system ping-pong</strong> and has a number the alternatives can point to.</li>
<li><strong>Every exception names its step and its message code</strong> — MSG22–24 must exist in SRS 5.2.</li>
<li><strong>Every postcondition is testable</strong> — each becomes a test case in the System Test sheet (Template3).</li>
<li><strong>Every BR ID resolves</strong> in the Business Rules table — a dangling BR-13 is a defect.</li>
</ol>`,
    `<h2>🛠️ Ví dụ có lời giải — đặc tả đầy đủ UC "Apply Job" của G5</h2>
<p>G5 có màn <em>Apply Job</em> cho Freelancer nhưng để trống đặc tả. Dưới đây là đặc tả viết theo các trường của Template1 (mục 2 của SRS), dùng chính dữ liệu của G5 (bảng <code>JobApply</code>: applyID, freelanceID, postID, status, dateApply, Resume) và business rule của họ (BR-05, BR-11). Quy tắc đánh dấu <em>mới</em> là do chúng ta thêm — bạn sẽ phải xác nhận với thầy/cô.</p>
<table>
<tbody>
<tr><th>UC ID &amp; Name</th><td colspan="3">UC-15 Apply Job (tính năng: Freelancer › Job Application)</td></tr>
<tr><th>Primary Actors</th><td>Freelancer</td><th>Secondary Actors</th><td>Recruiter (được báo), E-mail service</td></tr>
<tr><th>Trigger</th><td colspan="3">Freelancer bấm <strong>Apply</strong> trên màn Post Detail</td></tr>
<tr><th>Description</th><td colspan="3">Là freelancer, tôi muốn ứng tuyển một tin đang mở kèm CV để recruiter xét tôi cho công việc đó.</td></tr>
<tr><th>Preconditions</th><td colspan="3">PRE-1 Freelancer đã đăng nhập và tài khoản Active. PRE-2 Tin đã được duyệt và chưa hết hạn.</td></tr>
<tr><th>Postconditions</th><td colspan="3">POST-1 Tồn tại bản ghi JobApply (freelancer, tin, đường dẫn CV, dateApply = hôm nay, status = Pending). POST-2 Recruiter của tin được thông báo. POST-3 Đơn xuất hiện trong <em>List Apply</em> của freelancer.</td></tr>
<tr><th>Normal Flow</th><td colspan="3"><ol>
<li>Freelancer bấm Apply trên một tin tuyển dụng.</li>
<li>Hệ thống hiện form Apply: tiêu đề tin, công ty, ngân sách, ô tải CV, ghi chú tuỳ chọn.</li>
<li>Freelancer chọn file CV và bấm Submit.</li>
<li>Hệ thống kiểm tra tin và file (BR-05, BR-13, BR-14).</li>
<li>Hệ thống lưu đơn với trạng thái Pending và lưu CV.</li>
<li>Hệ thống gửi e-mail thông báo cho recruiter.</li>
<li>Hệ thống hiện MSG21 "Applied successfully" và mở List Apply.</li>
</ol></td></tr>
<tr><th>Alternative Flows</th><td colspan="3"><strong>A1 — Guest bấm Apply (ở bước 1)</strong>: Hệ thống mở Login (UC-1); đăng nhập thành công thì quay lại bước 2 với đúng tin đó.<br><strong>A2 — Dùng CV có sẵn trong hồ sơ (ở bước 3)</strong>: Freelancer tick "Use my profile CV"; tiếp tục bước 4.</td></tr>
<tr><th>Exceptions</th><td colspan="3"><strong>E1 — Tin hết hạn hoặc đã đóng (bước 4)</strong>: MSG22, UC kết thúc.<br><strong>E2 — Đã ứng tuyển rồi (bước 4)</strong>: MSG23 kèm link tới List Apply, UC kết thúc.<br><strong>E3 — Sai loại hoặc cỡ file (bước 4)</strong>: MSG24 dưới ô nhập; quay lại bước 3.<br><strong>E4 — Không gửi được e-mail (bước 6)</strong>: đơn vẫn được lưu; lỗi được ghi log.</td></tr>
<tr><th>Business Rules</th><td colspan="3">BR-05, BR-11, BR-13, BR-14</td></tr>
<tr><th>Priority</th><td colspan="3">Must have — Iteration 1 (giao dịch lõi của hệ thống)</td></tr>
</tbody>
</table>
<p class="nhan">Các quy tắc được tham chiếu (nằm ở SRS 5.1)</p>
<ul>
<li><strong>BR-05</strong> (G5) — Freelancer chỉ ứng tuyển được trong thời hạn nhận hồ sơ.</li>
<li><strong>BR-11</strong> (G5) — Freelancer đã ứng tuyển thì không huỷ được đơn.</li>
<li><strong>BR-13</strong> (mới) — Mỗi freelancer chỉ ứng tuyển một tin một lần.</li>
<li><strong>BR-14</strong> (mới) — CV là file PDF hoặc DOCX tối đa 5 MB.</li>
</ul>
<p class="nhan">Tự kiểm như người chấm</p>
<ol>
<li><strong>Mỗi bước là bóng bàn actor → hệ thống</strong> và có số để luồng thay thế chỉ vào.</li>
<li><strong>Mỗi exception ghi rõ bước và mã message</strong> — MSG22–24 phải có trong SRS 5.2.</li>
<li><strong>Mỗi postcondition test được</strong> — mỗi cái thành một test case trong sheet System Test (Template3).</li>
<li><strong>Mọi mã BR đều tra được</strong> trong bảng Business Rules — một BR-13 "treo" là một lỗi.</li>
</ol>`),
    bi(`<h3>From the use-case list to your Project Tracking file</h3>
<p>The tracking template has two sheets that come straight out of this lesson. The teacher reads them at every iteration to see who owns what and how big it is.</p>
<p class="nhan">Sheet "Use Cases" — one row per use case</p>
<table>
<thead><tr><th>#</th><th>Use case</th><th>Screen / Function</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th><th>Guest</th><th>Description</th></tr></thead>
<tbody>
<tr><td>UC1</td><td>Login System</td><td>Common Feature</td><td>x</td><td>x</td><td>x</td><td></td><td>Registered users access their personalised features</td></tr>
<tr><td>UC15</td><td>Apply Job</td><td>Job Application</td><td>x</td><td></td><td></td><td></td><td>Freelancer applies for an open post with a CV</td></tr>
<tr><td>UC19</td><td>Change Status Account Freelancer</td><td>User Management</td><td></td><td></td><td>x</td><td></td><td>Admin activates or suspends a freelancer account</td></tr>
</tbody>
</table>
<p class="nhan">Sheet "Product" — one row per screen, with size, owner and iteration</p>
<table>
<thead><tr><th>Level</th><th>Fields OR transactions</th><th>Planned LOC</th></tr></thead>
<tbody>
<tr><td>Level 1</td><td>3–5 fields or 2 trans.</td><td>60</td></tr>
<tr><td>Level 2</td><td>6–7 fields or 3 trans.</td><td>90</td></tr>
<tr><td>Level 3</td><td>8–9 fields or 4 trans.</td><td>120</td></tr>
<tr><td>Level 4</td><td>10–11 fields or 5 trans.</td><td>150</td></tr>
<tr><td>Level 5</td><td>12–13 fields or 6 trans.</td><td>180</td></tr>
</tbody>
</table>
<ul>
<li><strong>Apply Job</strong> — ~6 fields (title, company, budget, CV, note, submit) and 3 transactions (load post, upload, save) → <strong>Level 2, 90 LOC</strong>.</li>
<li><strong>One screen, one owner</strong> — the <em>PIC</em> column; on GitLab the same screen is one issue labelled <em>Req</em>.</li>
<li><strong>Plan column</strong> — ITER1 / ITER2 / ITER3; the core transaction goes into Iteration 1.</li>
</ul>
<p class="ghi-chu">The Student Guides grade LOC as Complex 240 / Medium 120 / Simple 60 × quality; the 2026 template counts in Levels 1–5 as above. Follow the version your teacher publishes on EduNext/CMS.</p>
<div class="pitfall co-tieu-de"><strong>Use-case list and tracking file disagree.</strong> A UC in the RDS with no tracking row (or the reverse) is the first inconsistency a grader spots. Keep the same IDs and names in both.</div>
<div class="pitfall co-tieu-de"><strong>Copy-pasted specs.</strong> Seven G5 specs share the same generic "System Failure / Database Connectivity" exceptions. Exceptions must be specific to the UC — which step, which message.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Use cases and user stories are not rivals.</strong> Cockburn's "goal levels" help here: a use case is a <em>user-goal</em> (sea-level) task — one sitting, one result. User stories (As a… I want… so that…) are smaller, negotiable slices you can put on the GitLab board. Template1 lets you write the UC <em>Description</em> as a user story — use one story per UC, and split the UC's alternative flows into extra stories when they don't fit in one iteration.</div>`,
    `<h3>Từ danh sách use case sang file Project Tracking</h3>
<p>Mẫu tracking có hai sheet sinh ra trực tiếp từ bài này. Thầy/cô đọc chúng ở mỗi iteration để biết ai làm gì và việc to cỡ nào.</p>
<p class="nhan">Sheet "Use Cases" — mỗi use case một dòng</p>
<table>
<thead><tr><th>#</th><th>Use case</th><th>Screen / Function</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th><th>Guest</th><th>Mô tả</th></tr></thead>
<tbody>
<tr><td>UC1</td><td>Login System</td><td>Common Feature</td><td>x</td><td>x</td><td>x</td><td></td><td>Người đã đăng ký truy cập tính năng cá nhân</td></tr>
<tr><td>UC15</td><td>Apply Job</td><td>Job Application</td><td>x</td><td></td><td></td><td></td><td>Freelancer ứng tuyển tin đang mở kèm CV</td></tr>
<tr><td>UC19</td><td>Change Status Account Freelancer</td><td>User Management</td><td></td><td></td><td>x</td><td></td><td>Admin kích hoạt hoặc tạm khoá tài khoản freelancer</td></tr>
</tbody>
</table>
<p class="nhan">Sheet "Product" — mỗi màn hình một dòng, kèm cỡ, người phụ trách và iteration</p>
<table>
<thead><tr><th>Level</th><th>Số trường HOẶC transaction</th><th>LOC kế hoạch</th></tr></thead>
<tbody>
<tr><td>Level 1</td><td>3–5 trường hoặc 2 trans.</td><td>60</td></tr>
<tr><td>Level 2</td><td>6–7 trường hoặc 3 trans.</td><td>90</td></tr>
<tr><td>Level 3</td><td>8–9 trường hoặc 4 trans.</td><td>120</td></tr>
<tr><td>Level 4</td><td>10–11 trường hoặc 5 trans.</td><td>150</td></tr>
<tr><td>Level 5</td><td>12–13 trường hoặc 6 trans.</td><td>180</td></tr>
</tbody>
</table>
<ul>
<li><strong>Apply Job</strong> — ~6 trường (tiêu đề, công ty, ngân sách, CV, ghi chú, submit) và 3 transaction (tải tin, upload, lưu) → <strong>Level 2, 90 LOC</strong>.</li>
<li><strong>Một màn hình, một người phụ trách</strong> — cột <em>PIC</em>; trên GitLab cùng màn đó là một issue gắn label <em>Req</em>.</li>
<li><strong>Cột Plan</strong> — ITER1 / ITER2 / ITER3; giao dịch lõi đặt vào Iteration 1.</li>
</ul>
<p class="ghi-chu">Student Guides chấm LOC theo Complex 240 / Medium 120 / Simple 60 × chất lượng; mẫu 2026 tính theo Level 1–5 như trên. Làm theo phiên bản thầy/cô công bố trên EduNext/CMS.</p>
<div class="pitfall co-tieu-de"><strong>Danh sách use case và file tracking lệch nhau.</strong> Một UC có trong RDS mà không có dòng tracking (hay ngược lại) là điểm thiếu nhất quán đầu tiên người chấm thấy. Giữ cùng mã và cùng tên ở cả hai nơi.</div>
<div class="pitfall co-tieu-de"><strong>Đặc tả chép dán.</strong> Bảy đặc tả của G5 dùng chung các exception chung chung "System Failure / Database Connectivity". Exception phải riêng cho từng UC — bước nào, message nào.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Use case và user story không đối đầu nhau.</strong> "Mức mục tiêu" của Cockburn giúp phân biệt: use case là việc ở mức <em>user-goal</em> (mực nước biển) — một lần ngồi, một kết quả. User story (Là… tôi muốn… để…) là lát cắt nhỏ hơn, thương lượng được, đặt được lên board GitLab. Template1 cho phép viết <em>Description</em> của UC dưới dạng user story — mỗi UC một story, và tách các alternative flow thành story riêng nếu không vừa một iteration.</div>`),
    books([
      ['wiegers', 'Ch. 8 — Understanding user requirements (use-case template fields)', 'Chương 8 — Understanding user requirements (các trường của mẫu use case)'],
      ['gomaa', 'Ch. 6 — Use case modeling (Withdraw Funds, Make Order Request)', 'Chương 6 — Use case modeling (Withdraw Funds, Make Order Request)'],
      ['cockburn', 'Ch. 2–5 — scope, goal levels, preconditions and guarantees; Ch. 7 — extensions', 'Chương 2–5 — phạm vi, mức mục tiêu, precondition và guarantee; Chương 7 — extension'],
      ['fowler', 'Ch. 11 — Activity diagrams', 'Chương 11 — Activity diagrams'],
    ]),
  ].join('\n'),
};

/* ─────────────── 2.3 Business rules & prototyping ─────────────── */
const L23 = {
  title: '2.3 — Business rules & requirement prototyping|||2.3 — Business rule & prototype yêu cầu',
  slug: 'swp391-2-3-business-rules-prototyping',
  type: 'VIDEO',
  description: 'Slide2 Software Requirement trang 20–32: business rule và 5 nhóm (fact, constraint, action enabler, inference, computation), prototype throwaway vs evolutionary, wireframe, screen flow, phân quyền màn hình và đặc tả trường màn hình — kèm bảng business rule và danh sách màn hình của G5 được viết lại cho đúng.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.3 · Slide2 Software Requirement, pages 20–32</span>
<h2>The rules behind the screens — and the screens themselves</h2>
<p class="lead">Use cases say <em>what happens</em>; business rules say <em>what is allowed and how things are computed</em>; prototypes show <em>what it will look like</em>. The last part of the deck ends with the three artefacts your teacher checks most carefully in every iteration: the <strong>screen flow</strong>, the <strong>screen authorization</strong> table and the <strong>screen specification</strong> (layout + field table).</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>define a business rule and sort it into one of the <strong>five classes</strong>: fact, constraint, action enabler, inference, computation;</li>
<li>write a Business Rules table with IDs that use cases can reference;</li>
<li>choose between a <strong>throwaway</strong> and an <strong>evolutionary</strong> prototype, and between mock-up and proof-of-concept;</li>
<li>produce a screen flow, a screen-authorization matrix and a field-by-field screen specification.</li>
</ul></div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.3 · Slide2 Software Requirement, trang 20–32</span>
<h2>Luật đứng sau màn hình — và chính các màn hình</h2>
<p class="lead">Use case nói <em>chuyện gì xảy ra</em>; business rule nói <em>điều gì được phép và tính toán thế nào</em>; prototype cho thấy <em>nó sẽ trông ra sao</em>. Phần cuối bộ slide kết thúc bằng ba sản phẩm thầy/cô soi kỹ nhất ở mọi iteration: <strong>screen flow</strong>, bảng <strong>screen authorization</strong> và <strong>đặc tả màn hình</strong> (bố cục + bảng trường).</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>định nghĩa business rule và xếp nó vào một trong <strong>năm nhóm</strong>: fact, constraint, action enabler, inference, computation;</li>
<li>viết bảng Business Rules có mã để use case tham chiếu;</li>
<li>chọn giữa prototype <strong>throwaway</strong> và <strong>evolutionary</strong>, giữa mock-up và proof-of-concept;</li>
<li>làm được screen flow, ma trận phân quyền màn hình và đặc tả màn hình từng trường.</li>
</ul></div>`),
    walkHead(R, 20, 32),
    walk(R, [
      [20, 'Business Rules',
        `<p class="y-chinh">🎯 A business rule defines or constrains some aspect of the business — it exists even if no software is ever written.</p>
<ul>
<li><strong>Purpose</strong> — assert business structure, or control / influence the behaviour of the business.</li>
<li><strong>Five classes</strong> — Facts · Constraints · Action Enablers · Inferences · Computations (pages 21–25).</li>
<li><strong>Table format</strong> — ID · Category · Rule Definition. The Cafeteria examples: BR-01/02 constraints (delivery windows 15 min; 10:00–14:00), BR-03/04 facts (one location, one payment method per order), BR-11 constraint (delivery → payroll deduction), BR-12 computation (order price).</li>
</ul>
<p class="nhan">Why a separate table</p>
<ul>
<li><strong>Reuse</strong> — one rule (e.g. strong password) is referenced by Register, Change Password and Reset Password.</li>
<li><strong>Change in one place</strong> — when the teacher changes a rule, you edit one row, not five use cases.</li>
</ul>`,
        `<p class="y-chinh">🎯 Business rule định nghĩa hoặc ràng buộc một khía cạnh của nghiệp vụ — nó tồn tại kể cả khi không có phần mềm nào được viết.</p>
<ul>
<li><strong>Mục đích</strong> — khẳng định cấu trúc nghiệp vụ, hoặc kiểm soát / tác động tới hành vi của nghiệp vụ.</li>
<li><strong>Năm nhóm</strong> — Facts · Constraints · Action Enablers · Inferences · Computations (trang 21–25).</li>
<li><strong>Dạng bảng</strong> — ID · Category · Rule Definition. Ví dụ Cafeteria: BR-01/02 constraint (khung giao 15 phút; 10:00–14:00), BR-03/04 fact (một địa điểm, một cách trả tiền mỗi đơn), BR-11 constraint (giao tận nơi → trừ lương), BR-12 computation (giá đơn).</li>
</ul>
<p class="nhan">Vì sao để riêng một bảng</p>
<ul>
<li><strong>Dùng lại</strong> — một quy tắc (vd mật khẩu mạnh) được Register, Change Password và Reset Password cùng tham chiếu.</li>
<li><strong>Sửa một chỗ</strong> — khi thầy/cô đổi một quy tắc, bạn sửa một dòng, không phải năm use case.</li>
</ul>`],
      [21, 'Taxonomy — Facts',
        `<p class="y-chinh">🎯 A fact is simply true about the business at a point in time — it links important business terms.</p>
<p class="nhan">Deck examples</p>
<ul>
<li>Every chemical container has a unique bar code identifier.</li>
<li>Every order has a shipping charge.</li>
<li>Sales tax is not computed on shipping charges.</li>
</ul>
<p class="nhan">Facts in G5</p>
<ul>
<li>Every job post belongs to exactly one category and one recruiter.</li>
<li>A company profile belongs to one recruiter.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> facts become your ERD — "every X has a Y" is a relationship or a NOT NULL column.</p>`,
        `<p class="y-chinh">🎯 Fact đơn giản là điều đúng về nghiệp vụ tại một thời điểm — nó nối các khái niệm nghiệp vụ quan trọng.</p>
<p class="nhan">Ví dụ trên slide</p>
<ul>
<li>Mỗi thùng hoá chất có một mã vạch duy nhất.</li>
<li>Mỗi đơn hàng có một phí vận chuyển.</li>
<li>Thuế bán hàng không tính trên phí vận chuyển.</li>
</ul>
<p class="nhan">Fact trong G5</p>
<ul>
<li>Mỗi tin tuyển dụng thuộc đúng một danh mục và một recruiter.</li>
<li>Mỗi hồ sơ công ty thuộc một recruiter.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> fact biến thành ERD — "mỗi X có một Y" là một quan hệ hoặc một cột NOT NULL.</p>`],
      [22, 'Taxonomy — Constraints',
        `<p class="y-chinh">🎯 A constraint restricts what the system or its users may do — "must", "must not", "only role X may".</p>
<p class="nhan">Three origins (deck examples)</p>
<ul>
<li><strong>Organizational policies</strong> — a loan applicant under 18 needs a guardian as cosigner; a library patron may hold at most 10 items.</li>
<li><strong>Government regulations</strong> — software must be usable by visually impaired persons; pilots need 8 hours of rest in 24.</li>
<li><strong>Industry standards</strong> — mortgage rules of the Federal Housing Authority; no HTML tags deprecated by HTML5.</li>
</ul>
<p class="nhan">Constraints in G5</p>
<ul>
<li><strong>BR-09</strong> — passwords have at least 8 characters with upper-case, lower-case and digits.</li>
<li><strong>BR-11</strong> — an application cannot be cancelled.</li>
<li><strong>Role rule</strong> — only the Admin may suspend an account (this is also your screen authorization).</li>
</ul>`,
        `<p class="y-chinh">🎯 Constraint giới hạn điều hệ thống hoặc người dùng được làm — "phải", "không được", "chỉ vai trò X mới được".</p>
<p class="nhan">Ba nguồn gốc (ví dụ trên slide)</p>
<ul>
<li><strong>Chính sách tổ chức</strong> — người vay dưới 18 tuổi cần người giám hộ đồng ký; bạn đọc thư viện giữ tối đa 10 cuốn.</li>
<li><strong>Quy định nhà nước</strong> — phần mềm phải dùng được cho người khiếm thị; phi công cần nghỉ 8 tiếng trong 24 tiếng.</li>
<li><strong>Chuẩn ngành</strong> — quy định vay thế chấp của Federal Housing Authority; không dùng thẻ HTML bị HTML5 loại bỏ.</li>
</ul>
<p class="nhan">Constraint trong G5</p>
<ul>
<li><strong>BR-09</strong> — mật khẩu ít nhất 8 ký tự có chữ hoa, chữ thường và số.</li>
<li><strong>BR-11</strong> — không huỷ được đơn ứng tuyển.</li>
<li><strong>Quy tắc vai trò</strong> — chỉ Admin được khoá tài khoản (cũng chính là screen authorization).</li>
</ul>`],
      [23, 'Taxonomy — Action Enablers',
        `<p class="y-chinh">🎯 An action enabler triggers an activity when specific conditions are true: "if … then do …".</p>
<ul>
<li><strong>Manual or automatic</strong> — a person could do the activity, or the rule becomes software behaviour when the system detects the event.</li>
</ul>
<p class="nhan">Chemical Tracking System examples</p>
<ul>
<li>If the stockroom has containers of a requested chemical, <strong>offer</strong> them to the requester.</li>
<li>On the last day of a quarter, <strong>generate</strong> the mandated OSHA and EPA reports.</li>
<li>If a container has expired, <strong>notify</strong> the person who holds it.</li>
</ul>
<p class="nhan">In a SWP391 system</p>
<ul>
<li>If an application changes status, e-mail the freelancer.</li>
<li>If a post reaches its expiry date, close it (a timer — list it under Non-UI Functions).</li>
<li>If a post receives 3 reports, hide it and notify the Admin.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> action enabler = "then <em>do</em>"; inference (next page) = "then <em>it is</em>".</p>`,
        `<p class="y-chinh">🎯 Action enabler kích hoạt một hoạt động khi điều kiện cụ thể đúng: "nếu … thì làm …".</p>
<ul>
<li><strong>Thủ công hoặc tự động</strong> — một người có thể làm việc đó, hoặc quy tắc trở thành hành vi phần mềm khi hệ thống phát hiện sự kiện.</li>
</ul>
<p class="nhan">Ví dụ Chemical Tracking System</p>
<ul>
<li>Nếu kho còn thùng của hoá chất được yêu cầu, <strong>đề xuất</strong> chúng cho người yêu cầu.</li>
<li>Ngày cuối quý, <strong>tạo</strong> báo cáo OSHA và EPA bắt buộc.</li>
<li>Nếu một thùng đã hết hạn, <strong>báo</strong> cho người đang giữ nó.</li>
</ul>
<p class="nhan">Trong hệ thống SWP391</p>
<ul>
<li>Nếu đơn ứng tuyển đổi trạng thái, gửi e-mail cho freelancer.</li>
<li>Nếu tin tới ngày hết hạn, đóng tin (một timer — ghi vào Non-UI Functions).</li>
<li>Nếu một tin bị báo cáo 3 lần, ẩn tin và báo Admin.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> action enabler = "thì <em>làm</em>"; inference (trang sau) = "thì <em>được coi là</em>".</p>`],
      [24, 'Taxonomy — Inferences',
        `<p class="y-chinh">🎯 An inference creates a new fact from other facts — its "then" gives knowledge, not an action.</p>
<ul>
<li><strong>Also called</strong> inferred knowledge or a derived fact; often written "if … then …".</li>
</ul>
<p class="nhan">Deck examples</p>
<ul>
<li>If a payment is not received within 30 days after it is due, then the account is <strong>delinquent</strong> (overdue).</li>
<li>If the vendor cannot ship within five days, the item is <strong>back-ordered</strong>.</li>
<li>Chemicals with LD50 below 5 mg/kg in mice are <strong>hazardous</strong>.</li>
</ul>
<p class="nhan">In G5</p>
<ul>
<li>If today is after a post's expiry date, the post is <strong>expired</strong>.</li>
<li>If a freelancer has at least one skill listed in a post, the post is a <strong>match</strong> — this is how "Job for You" works.</li>
</ul>
<p class="ghi-chu">The teacher's note translates the key words: <em>inferences</em> = suy luận; <em>delinquent</em> — in this billing context it means "overdue / in arrears" (quá hạn thanh toán).</p>`,
        `<p class="y-chinh">🎯 Inference tạo ra một fact mới từ các fact khác — vế "thì" cho một hiểu biết, không phải một hành động.</p>
<ul>
<li><strong>Còn gọi là</strong> inferred knowledge hay derived fact; thường viết "nếu … thì …".</li>
</ul>
<p class="nhan">Ví dụ trên slide</p>
<ul>
<li>Nếu không nhận được tiền trong 30 ngày sau hạn, tài khoản bị coi là <strong>delinquent</strong> (nợ quá hạn).</li>
<li>Nếu nhà cung cấp không giao được trong năm ngày, món hàng là <strong>back-ordered</strong> (chờ hàng).</li>
<li>Hoá chất có LD50 dưới 5 mg/kg trên chuột được coi là <strong>nguy hiểm</strong>.</li>
</ul>
<p class="nhan">Trong G5</p>
<ul>
<li>Nếu hôm nay đã qua ngày hết hạn của tin, tin được coi là <strong>expired</strong>.</li>
<li>Nếu freelancer có ít nhất một kỹ năng nằm trong tin, tin là <strong>phù hợp</strong> — đó là cách "Job for You" chạy.</li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô dịch từ khoá: <em>inferences</em> = suy luận; <em>delinquent</em> — trong ngữ cảnh thanh toán này nghĩa là "quá hạn / nợ đọng" (không phải "phạm pháp").</p>`],
      [25, 'Taxonomy — Computations',
        `<p class="y-chinh">🎯 A computation turns existing data into new data with a formula or algorithm.</p>
<ul>
<li><strong>Often external</strong> — tax formulas, shipping tariffs, exchange rates come from outside the company.</li>
</ul>
<p class="nhan">Deck examples</p>
<ul>
<li>Ground shipping for an order over 2 pounds = $4.75 + 12 cents per ounce or fraction.</li>
<li>Unit price −10% for 6–10 units, −20% for 11–20, −30% for more than 20.</li>
</ul>
<p class="nhan">Write it so it can be tested</p>
<ul>
<li><strong>State the boundaries</strong> — 6–10, 11–20, &gt; 20: a tester immediately gets the values 5, 6, 10, 11, 20, 21 (boundary value analysis).</li>
<li><strong>G5-style example</strong> — "Recruiter dashboard: acceptance rate = accepted applications ÷ all applications of the recruiter's posts × 100, rounded to 1 decimal".</li>
</ul>`,
        `<p class="y-chinh">🎯 Computation biến dữ liệu có sẵn thành dữ liệu mới bằng công thức hoặc thuật toán.</p>
<ul>
<li><strong>Thường đến từ bên ngoài</strong> — công thức thuế, biểu phí vận chuyển, tỷ giá do bên ngoài công ty quy định.</li>
</ul>
<p class="nhan">Ví dụ trên slide</p>
<ul>
<li>Phí giao đường bộ cho đơn nặng hơn 2 pound = 4,75 $ + 12 cent mỗi ounce hoặc phần lẻ.</li>
<li>Đơn giá −10% cho 6–10 sản phẩm, −20% cho 11–20, −30% cho hơn 20.</li>
</ul>
<p class="nhan">Viết sao cho test được</p>
<ul>
<li><strong>Ghi rõ biên</strong> — 6–10, 11–20, &gt; 20: tester lấy ngay được các giá trị 5, 6, 10, 11, 20, 21 (phân tích giá trị biên).</li>
<li><strong>Ví dụ kiểu G5</strong> — "Dashboard recruiter: tỷ lệ nhận = số đơn được nhận ÷ tổng đơn của các tin của recruiter × 100, làm tròn 1 chữ số thập phân".</li>
</ul>`],
      [26, 'Requirement Prototyping',
        `<p class="y-chinh">🎯 A prototype is a partial, early version of the system used to clarify requirements, explore designs, or grow into the product.</p>
<p class="nhan">Purpose</p>
<ol>
<li>Clarify, complete and validate requirements</li>
<li>Explore design alternatives</li>
<li>Create a subset that grows into the final product</li>
</ol>
<p class="nhan">Three attributes of every prototype</p>
<ul>
<li><strong>Scope</strong> — <em>mock-up</em> (the UI / UX: what the user sees) vs <em>proof-of-concept</em> (a technical approach: does file upload to the server work?).</li>
<li><strong>Future use</strong> — <em>throwaway</em> (discarded after it answers the question) vs <em>evolutionary</em> (kept and grown).</li>
<li><strong>Form</strong> — <em>paper</em> (sketches) vs <em>electronic</em> (Figma, draw.io, HTML).</li>
</ul>`,
        `<p class="y-chinh">🎯 Prototype là một phiên bản sớm, chưa đầy đủ của hệ thống, dùng để làm rõ yêu cầu, thử phương án thiết kế, hoặc lớn dần thành sản phẩm.</p>
<p class="nhan">Mục đích</p>
<ol>
<li>Làm rõ, bổ sung và xác nhận yêu cầu</li>
<li>Thử các phương án thiết kế</li>
<li>Tạo một phần sẽ lớn dần thành sản phẩm cuối</li>
</ol>
<p class="nhan">Ba thuộc tính của mọi prototype</p>
<ul>
<li><strong>Phạm vi</strong> — <em>mock-up</em> (giao diện / UX: người dùng thấy gì) vs <em>proof-of-concept</em> (cách tiếp cận kỹ thuật: upload file lên server có chạy không?).</li>
<li><strong>Dùng về sau</strong> — <em>throwaway</em> (bỏ đi sau khi trả lời xong câu hỏi) vs <em>evolutionary</em> (giữ lại và phát triển tiếp).</li>
<li><strong>Hình thức</strong> — <em>giấy</em> (phác thảo) vs <em>điện tử</em> (Figma, draw.io, HTML).</li>
</ul>`],
      [27, 'Throwaway Prototypes',
        `<p class="y-chinh">🎯 Build it to answer questions and improve the requirements — then throw it away.</p>
<ul>
<li><strong>Purpose</strong> — answer questions, resolve uncertainties, improve requirement quality.</li>
<li><strong>Wireframe</strong> — the usual throwaway form for custom UI and website design.</li>
</ul>
<p class="nhan">A wireframe clarifies three aspects of a website</p>
<ol>
<li><strong>Conceptual requirements</strong> — which information and actions a page must offer</li>
<li><strong>Information architecture / navigation</strong> — how pages link (the screen flow)</li>
<li><strong>High-resolution design</strong> of each page</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> show the teacher a wireframe of your 3–4 screens early in the iteration — a "no" on paper costs 5 minutes; after coding it costs a slot.</p>`,
        `<p class="y-chinh">🎯 Làm nó để trả lời câu hỏi và cải thiện yêu cầu — rồi bỏ đi.</p>
<ul>
<li><strong>Mục đích</strong> — trả lời câu hỏi, gỡ điểm chưa chắc, nâng chất lượng yêu cầu.</li>
<li><strong>Wireframe</strong> — dạng throwaway phổ biến cho thiết kế UI và website riêng.</li>
</ul>
<p class="nhan">Wireframe làm rõ ba khía cạnh của website</p>
<ol>
<li><strong>Yêu cầu khái niệm</strong> — trang phải có thông tin và thao tác nào</li>
<li><strong>Kiến trúc thông tin / điều hướng</strong> — các trang nối với nhau thế nào (screen flow)</li>
<li><strong>Thiết kế chi tiết</strong> của từng trang</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đưa thầy/cô xem wireframe 3–4 màn của bạn sớm trong iteration — một câu "không" trên giấy tốn 5 phút; sau khi code thì tốn cả một slot.</p>`],
      [28, 'Evolutionary Prototypes',
        `<p class="y-chinh">🎯 An evolutionary prototype is built on a solid architecture and grows into the product as the requirements become clear — the natural fit for a SWP391 web project.</p>
<p class="nhan">The table on the page — typical uses</p>
<table>
<thead><tr><th></th><th>Throwaway</th><th>Evolutionary</th></tr></thead>
<tbody>
<tr><td><strong>Mock-up</strong></td><td>Clarify and refine user and functional requirements · find missing functionality · explore UI approaches</td><td>Implement core user requirements · add requirements by priority · refine websites · adapt to changing business needs</td></tr>
<tr><td><strong>Proof of concept</strong></td><td>Demonstrate technical feasibility · evaluate performance · acquire knowledge to improve estimates</td><td>Implement and grow the core multi-tier layers · implement and optimize core algorithms · test and tune performance</td></tr>
</tbody>
</table>
<p class="nhan">What it means for your 3 iterations</p>
<ul>
<li><strong>Iteration 1</strong> — your first working screens (login, the core transaction) <em>are</em> an evolutionary prototype; the architecture (MVC packages, DB, shared header/menu) must be solid from day one.</li>
<li><strong>Iterations 2–3</strong> — grow it screen by screen; never restart from zero.</li>
</ul>`,
        `<p class="y-chinh">🎯 Prototype evolutionary được dựng trên một kiến trúc vững và lớn dần thành sản phẩm khi yêu cầu rõ dần — hợp tự nhiên với đồ án web SWP391.</p>
<p class="nhan">Bảng trên slide — cách dùng điển hình</p>
<table>
<thead><tr><th></th><th>Throwaway</th><th>Evolutionary</th></tr></thead>
<tbody>
<tr><td><strong>Mock-up</strong></td><td>Làm rõ yêu cầu người dùng và chức năng · tìm chức năng còn thiếu · thử các cách làm UI</td><td>Hiện thực yêu cầu lõi · thêm yêu cầu theo độ ưu tiên · hoàn thiện website · thích nghi khi nghiệp vụ đổi nhanh</td></tr>
<tr><td><strong>Proof of concept</strong></td><td>Chứng minh tính khả thi kỹ thuật · đánh giá hiệu năng · lấy hiểu biết để ước lượng tốt hơn</td><td>Hiện thực và phát triển các tầng lõi · hiện thực và tối ưu thuật toán lõi · kiểm và tinh chỉnh hiệu năng</td></tr>
</tbody>
</table>
<p class="nhan">Ý nghĩa với 3 iteration của bạn</p>
<ul>
<li><strong>Iteration 1</strong> — các màn chạy được đầu tiên (login, giao dịch lõi) <em>chính là</em> prototype evolutionary; kiến trúc (package MVC, DB, header/menu dùng chung) phải vững ngay từ đầu.</li>
<li><strong>Iteration 2–3</strong> — phát triển tiếp từng màn; không bao giờ đập đi làm lại.</li>
</ul>`],
      [29, 'Working with Prototypes 1/3',
        `<p class="y-chinh">🎯 From use cases to UI: use case → dialog map → throwaway wireframe → detailed UI design, with feedback at every arrow.</p>
<ol>
<li><strong>User classes and use cases</strong> — the table on the left (Visitor, Customer, Administrator of a book-selling site).</li>
<li><strong>Dialog map</strong> — boxes = pages, arrows = navigation (Home Page → Products → Shopping Cart…).</li>
<li><strong>Throwaway wireframe</strong> — the grey "Products" sketch.</li>
<li><strong>Detailed UI design</strong> — the final styled page.</li>
</ol>
<p class="ghi-chu">This is Figure 15-2 of Wiegers &amp; Beatty, <em>Software Requirements</em> (the "Pearls from Sand" example).</p>`,
        `<p class="y-chinh">🎯 Từ use case tới UI: use case → dialog map → wireframe throwaway → thiết kế UI chi tiết, có phản hồi ở mỗi mũi tên.</p>
<ol>
<li><strong>Nhóm người dùng và use case</strong> — bảng bên trái (Visitor, Customer, Administrator của một trang bán sách).</li>
<li><strong>Dialog map</strong> — hộp = trang, mũi tên = điều hướng (Home Page → Products → Shopping Cart…).</li>
<li><strong>Wireframe throwaway</strong> — bản phác xám "Products".</li>
<li><strong>Thiết kế UI chi tiết</strong> — trang hoàn chỉnh có style.</li>
</ol>
<p class="ghi-chu">Đây là Hình 15-2 trong <em>Software Requirements</em> của Wiegers &amp; Beatty (ví dụ "Pearls from Sand").</p>`],
      [30, 'Working with Prototypes 2/3',
        `<p class="y-chinh">🎯 Two SRS artefacts come from the prototype: the screen flow and the screen tables (descriptions + authorization).</p>
<p class="nhan">Screens flow (top)</p>
<ul>
<li><strong>Every screen once</strong>, arrows for navigation — Home Page → User Login → Dashboard → Settings List → Setting Details…</li>
</ul>
<p class="nhan">2.2 Screen Descriptions</p>
<ul>
<li><strong># · Feature · Screen · Description</strong> — e.g. Order Meals › Create Order.</li>
</ul>
<p class="nhan">2.3 Screen Authorization</p>
<ul>
<li><strong>Rows = screens</strong> (and screen activities such as "Query All Data"), <strong>columns = roles</strong>, X = allowed.</li>
<li><strong>Directly testable</strong> — each empty cell is a test: "Recruiter opens /admin/users → 403".</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai sản phẩm SRS đi ra từ prototype: screen flow và các bảng màn hình (mô tả + phân quyền).</p>
<p class="nhan">Screens flow (phía trên)</p>
<ul>
<li><strong>Mỗi màn một lần</strong>, mũi tên cho điều hướng — Home Page → User Login → Dashboard → Settings List → Setting Details…</li>
</ul>
<p class="nhan">2.2 Screen Descriptions</p>
<ul>
<li><strong># · Feature · Screen · Description</strong> — vd Order Meals › Create Order.</li>
</ul>
<p class="nhan">2.3 Screen Authorization</p>
<ul>
<li><strong>Dòng = màn hình</strong> (và thao tác trên màn như "Query All Data"), <strong>cột = vai trò</strong>, X = được phép.</li>
<li><strong>Test được ngay</strong> — mỗi ô trống là một test: "Recruiter mở /admin/users → 403".</li>
</ul>`],
      [31, 'Working with Prototypes 3/3',
        `<p class="y-chinh">🎯 Each screen gets a specification grouped by feature: brief description, screen layout, and screen field details.</p>
<ol>
<li><strong>Brief description</strong> — "This is for the administrator to view the list of current system settings… and activate or deactivate a setting."</li>
<li><strong>Screen layout</strong> — the Setting List mock-up: filter by type, by status, search box, table, paging, Add New.</li>
<li><strong>Screen field details</strong> — Field Name · Field Type · Description, grouped (<em>Filter/Search Fields</em>, <em>Data Table</em>): "Setting Status — values All Statuses (default), Active, Inactive"; "Search Phrase — String (30), default blank".</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> the field table is where "number of fields" comes from — the same count that sets the screen's complexity level in the tracking file.</p>`,
        `<p class="y-chinh">🎯 Mỗi màn hình có một đặc tả nhóm theo tính năng: mô tả ngắn, bố cục màn hình, và chi tiết các trường.</p>
<ol>
<li><strong>Mô tả ngắn</strong> — "Màn này để quản trị viên xem danh sách setting hiện có… và kích hoạt / vô hiệu một setting."</li>
<li><strong>Bố cục màn hình</strong> — mock-up Setting List: lọc theo loại, theo trạng thái, ô tìm kiếm, bảng, phân trang, Add New.</li>
<li><strong>Chi tiết trường</strong> — Field Name · Field Type · Description, chia nhóm (<em>Filter/Search Fields</em>, <em>Data Table</em>): "Setting Status — giá trị All Statuses (mặc định), Active, Inactive"; "Search Phrase — String (30), mặc định trống".</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bảng trường là nơi sinh ra "số field" — đúng con số quyết định mức độ phức tạp của màn trong file tracking.</p>`],
      [32, 'Q&A',
        `<p class="y-chinh">🎯 End of the deck — bring your questions to the teacher, who is also your customer.</p>
<ul>
<li><strong>Good questions</strong> are concrete: "Can a freelancer withdraw an application?", "Who can see a recruiter's phone number?".</li>
<li><strong>Log every answer</strong> — as a GitLab issue labelled <em>Q&amp;A</em>, and as a business rule if it is one.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hết bộ slide — mang câu hỏi tới thầy/cô, người cũng là khách hàng của bạn.</p>
<ul>
<li><strong>Câu hỏi tốt</strong> phải cụ thể: "Freelancer có rút đơn được không?", "Ai được xem số điện thoại của recruiter?".</li>
<li><strong>Ghi lại mọi câu trả lời</strong> — thành issue GitLab gắn label <em>Q&amp;A</em>, và thành business rule nếu nó là quy tắc.</li>
</ul>`],
    ]),
    bi(`<h2>🛠️ Worked example — G5's business rules, sorted and repaired</h2>
<p>G5's appendix has 12 rules with free-text categories ("Registration", "Hiring"…). Sorting them into the deck's five classes shows which ones are real, testable rules and which are wishes that belong elsewhere.</p>
<table>
<thead><tr><th>ID</th><th>G5 rule (short)</th><th>Class</th><th>Verdict / rewrite</th></tr></thead>
<tbody>
<tr><td>BR-01</td><td>Users provide complete, accurate information when registering</td><td>Constraint</td><td>Make it checkable: "Full name, e-mail and phone are required; e-mail must be unique"</td></tr>
<tr><td>BR-02</td><td>Freelancers provide skills, experience, job types</td><td>Constraint</td><td>"A freelancer profile needs ≥ 1 skill before applying"</td></tr>
<tr><td>BR-03</td><td>Recruiters post only legitimate jobs</td><td>Constraint</td><td>Not checkable by software — enforce with "a new post is Pending until an Admin approves it"</td></tr>
<tr><td>BR-04</td><td>System suggests jobs matching the profile</td><td>Inference</td><td>"A post matches if it lists at least one of the freelancer's skills"</td></tr>
<tr><td>BR-05</td><td>Apply only within the application period</td><td>Constraint</td><td>Good — used by Apply Job</td></tr>
<tr><td>BR-06</td><td>Recruiters review and choose; negotiation happens off-platform</td><td>Fact</td><td>Scope statement — also listed as EX-1</td></tr>
<tr><td>BR-07</td><td>Both sides may review each other after a job</td><td>Constraint</td><td>Add the condition: "only after the application is Accepted"</td></tr>
<tr><td>BR-08</td><td>Protect personal information</td><td>—</td><td>A non-functional (security/privacy) requirement → move to SRS section 4</td></tr>
<tr><td>BR-09</td><td>Strong passwords: ≥ 8 chars, upper, lower, digit</td><td>Constraint</td><td>Good — used by Register, Change / Reset Password</td></tr>
<tr><td>BR-10</td><td>Users manage their account easily</td><td>—</td><td>A usability wish, not a rule → section 4 with a measurable target</td></tr>
<tr><td>BR-11</td><td>An application cannot be cancelled</td><td>Constraint</td><td>Good — used by Apply Job, List Apply</td></tr>
<tr><td>BR-12</td><td>Recruiters describe each job in detail</td><td>Constraint</td><td>Make it checkable: "title, category, ≥ 1 skill, budget and description (≥ 50 chars) are required"</td></tr>
</tbody>
</table>
<p class="nhan">What the table teaches</p>
<ul>
<li><strong>No action enablers or computations</strong> were written, although the system has them: e-mail on status change (action enabler), dashboard statistics (computation). Add them.</li>
<li><strong>Two "rules" are really NFRs</strong> (BR-08, BR-10) — a common confusion.</li>
<li><strong>Every constraint must be checkable</strong> — a tester must be able to break it on purpose.</li>
</ul>
<h3>The screen list for G5 — who builds what, in which iteration</h3>
<p>From the use cases, group the screens by feature (G5's authorization table lists about 45 screens and activities). A 5-member team plans 3–4 screens per member per iteration:</p>
<table>
<thead><tr><th>Feature</th><th>Screens</th><th>Iteration</th></tr></thead>
<tbody>
<tr><td>Common</td><td>Login (+ Google), Register Freelancer / Recruiter, Forgot Password, Change Password, Home Page, header/menu by role</td><td>1</td></tr>
<tr><td>Job posting (Recruiter)</td><td>Create / Update Post, View My List Post</td><td>1</td></tr>
<tr><td>Job application (Freelancer)</td><td>Search Post, Post Detail, Apply Job, List Apply</td><td>1</td></tr>
<tr><td>Applicants (Recruiter)</td><td>Manage Applicants (accept / reject), List Freelancer, Mark Freelancer</td><td>2</td></tr>
<tr><td>Profiles</td><td>View / Edit Freelancer Profile, View / Edit Recruiter Profile, Company Detail</td><td>2</td></tr>
<tr><td>Freelancer extras</td><td>Favourites, Report Post, Job for You, Posts by Category / Location</td><td>2</td></tr>
<tr><td>Administration</td><td>Dashboard, Freelancer / Recruiter list + change status, Skill, Category and Blog management, Approve / Suspend Project, Reports</td><td>2–3</td></tr>
<tr><td>Content &amp; statistics</td><td>Blog grid / detail / search, Recruiter Dashboard, Completed Projects</td><td>3</td></tr>
</tbody>
</table>`,
    `<h2>🛠️ Ví dụ có lời giải — business rule của G5, phân loại và sửa lại</h2>
<p>Phụ lục của G5 có 12 quy tắc với category tự đặt ("Registration", "Hiring"…). Xếp chúng vào năm nhóm của slide cho thấy quy tắc nào là luật thật, test được, và cái nào chỉ là mong muốn nên nằm chỗ khác.</p>
<table>
<thead><tr><th>ID</th><th>Quy tắc G5 (tóm tắt)</th><th>Nhóm</th><th>Nhận xét / viết lại</th></tr></thead>
<tbody>
<tr><td>BR-01</td><td>Người dùng cung cấp thông tin đầy đủ, chính xác khi đăng ký</td><td>Constraint</td><td>Làm cho kiểm được: "Họ tên, e-mail và số điện thoại bắt buộc; e-mail không trùng"</td></tr>
<tr><td>BR-02</td><td>Freelancer khai kỹ năng, kinh nghiệm, loại việc</td><td>Constraint</td><td>"Hồ sơ freelancer cần ≥ 1 kỹ năng trước khi ứng tuyển"</td></tr>
<tr><td>BR-03</td><td>Recruiter chỉ đăng việc hợp pháp</td><td>Constraint</td><td>Phần mềm không kiểm được — thực thi bằng "tin mới ở trạng thái Pending tới khi Admin duyệt"</td></tr>
<tr><td>BR-04</td><td>Hệ thống gợi ý việc khớp hồ sơ</td><td>Inference</td><td>"Một tin là phù hợp nếu có ít nhất một kỹ năng của freelancer"</td></tr>
<tr><td>BR-05</td><td>Chỉ ứng tuyển trong thời hạn nhận hồ sơ</td><td>Constraint</td><td>Tốt — dùng trong Apply Job</td></tr>
<tr><td>BR-06</td><td>Recruiter xét và chọn; đàm phán diễn ra ngoài nền tảng</td><td>Fact</td><td>Câu phạm vi — đã có ở EX-1</td></tr>
<tr><td>BR-07</td><td>Hai bên đánh giá nhau sau công việc</td><td>Constraint</td><td>Thêm điều kiện: "chỉ sau khi đơn được Accepted"</td></tr>
<tr><td>BR-08</td><td>Bảo vệ thông tin cá nhân</td><td>—</td><td>Là yêu cầu phi chức năng (bảo mật/riêng tư) → chuyển sang mục 4 của SRS</td></tr>
<tr><td>BR-09</td><td>Mật khẩu mạnh: ≥ 8 ký tự, hoa, thường, số</td><td>Constraint</td><td>Tốt — dùng trong Register, Change / Reset Password</td></tr>
<tr><td>BR-10</td><td>Người dùng quản lý tài khoản dễ dàng</td><td>—</td><td>Là mong muốn về dễ dùng, không phải luật → mục 4 kèm chỉ tiêu đo được</td></tr>
<tr><td>BR-11</td><td>Không huỷ được đơn ứng tuyển</td><td>Constraint</td><td>Tốt — dùng trong Apply Job, List Apply</td></tr>
<tr><td>BR-12</td><td>Recruiter mô tả chi tiết từng việc</td><td>Constraint</td><td>Làm cho kiểm được: "bắt buộc tiêu đề, danh mục, ≥ 1 kỹ năng, ngân sách và mô tả (≥ 50 ký tự)"</td></tr>
</tbody>
</table>
<p class="nhan">Bảng này dạy gì</p>
<ul>
<li><strong>Không có action enabler hay computation</strong> nào được viết, dù hệ thống có: e-mail khi đổi trạng thái (action enabler), số liệu dashboard (computation). Hãy bổ sung.</li>
<li><strong>Hai "quy tắc" thực ra là NFR</strong> (BR-08, BR-10) — nhầm lẫn rất hay gặp.</li>
<li><strong>Constraint nào cũng phải kiểm được</strong> — tester phải cố ý phá được nó.</li>
</ul>
<h3>Danh sách màn hình của G5 — ai làm gì, ở iteration nào</h3>
<p>Từ các use case, nhóm màn hình theo tính năng (bảng phân quyền của G5 có khoảng 45 màn hình và thao tác). Nhóm 5 người lên kế hoạch 3–4 màn mỗi người mỗi iteration:</p>
<table>
<thead><tr><th>Tính năng</th><th>Màn hình</th><th>Iteration</th></tr></thead>
<tbody>
<tr><td>Common</td><td>Login (+ Google), Register Freelancer / Recruiter, Forgot Password, Change Password, Home Page, header/menu theo vai trò</td><td>1</td></tr>
<tr><td>Đăng tin (Recruiter)</td><td>Create / Update Post, View My List Post</td><td>1</td></tr>
<tr><td>Ứng tuyển (Freelancer)</td><td>Search Post, Post Detail, Apply Job, List Apply</td><td>1</td></tr>
<tr><td>Ứng viên (Recruiter)</td><td>Manage Applicants (nhận / từ chối), List Freelancer, Mark Freelancer</td><td>2</td></tr>
<tr><td>Hồ sơ</td><td>View / Edit Freelancer Profile, View / Edit Recruiter Profile, Company Detail</td><td>2</td></tr>
<tr><td>Tiện ích Freelancer</td><td>Favourites, Report Post, Job for You, Posts by Category / Location</td><td>2</td></tr>
<tr><td>Quản trị</td><td>Dashboard, danh sách Freelancer / Recruiter + đổi trạng thái, quản lý Skill, Category, Blog, duyệt / khoá Project, Report</td><td>2–3</td></tr>
<tr><td>Nội dung &amp; thống kê</td><td>Blog grid / detail / search, Recruiter Dashboard, Completed Projects</td><td>3</td></tr>
</tbody>
</table>`),
    bi(`<h3>Screen authorization — a corrected slice of G5's matrix</h3>
<table>
<thead><tr><th>Screen</th><th>Guest</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th></tr></thead>
<tbody>
<tr><td>Home Page, Search Post, Post Detail</td><td>X</td><td>X</td><td>X</td><td>X</td></tr>
<tr><td>Register</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Apply Job, List Apply</td><td></td><td>X</td><td></td><td></td></tr>
<tr><td>Create / Update Post, Manage Applicants</td><td></td><td></td><td>X</td><td></td></tr>
<tr><td>Change Status Account, Skill / Category management</td><td></td><td></td><td></td><td>X</td></tr>
</tbody>
</table>
<p class="ghi-chu">G5's own table ticks <em>Register</em> for Freelancer and Recruiter (they are already registered) and lists "Change status account Freelancer" twice — the kind of slip a grader notices. One row per screen, no duplicates.</p>
<h3>Screen specification — "Apply Job" field table (SRS section 3)</h3>
<p><strong>Brief description:</strong> lets a logged-in freelancer apply for an open post (UC-15).</p>
<table>
<thead><tr><th>Field Name</th><th>Field Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td colspan="3"><em>Post information (read-only)</em></td></tr>
<tr><td>Post title</td><td>Label</td><td>From Post.title, max 50 chars</td></tr>
<tr><td>Company</td><td>Link</td><td>Company name, opens Company Detail</td></tr>
<tr><td>Budget</td><td>Label</td><td>Post.budget, shown as 1.500.000 ₫</td></tr>
<tr><td colspan="3"><em>Application</em></td></tr>
<tr><td>CV file*</td><td>File</td><td>PDF or DOCX, ≤ 5 MB (BR-14); required unless "Use my profile CV" is ticked; error MSG24</td></tr>
<tr><td>Use my profile CV</td><td>Checkbox</td><td>Default unticked; disabled if the profile has no CV</td></tr>
<tr><td>Cover note</td><td>Textarea</td><td>Optional, max 500 chars (MSG08 if longer)</td></tr>
<tr><td>Submit</td><td>Button</td><td>Runs normal-flow steps 4–7</td></tr>
<tr><td>Cancel</td><td>Button</td><td>Back to Post Detail, nothing saved</td></tr>
</tbody>
</table>
<p class="nhan">Mistakes that lose marks</p>
<div class="pitfall co-tieu-de"><strong>Screenshots instead of specs.</strong> A mock-up with no field table does not tell the tester the max length, default value or message — Template1 demands all three.</div>
<div class="pitfall co-tieu-de"><strong>Rules hidden inside UC text.</strong> "Password must be 8 chars…" written in five use cases drifts apart; write it once as BR-09 and reference the ID.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Decision tables for tangled rules.</strong> When several rules act together (post status × application status × role), draw a decision table: one column per combination of conditions, one row per action. It exposes missing cases ("what if the post expires while an application is Pending?") and gives the tester one test per column — the technique Wiegers recommends in his business-rules chapter and SWT301 teaches as decision-table testing.</div>`,
    `<h3>Phân quyền màn hình — một phần ma trận của G5 đã sửa</h3>
<table>
<thead><tr><th>Màn hình</th><th>Guest</th><th>Freelancer</th><th>Recruiter</th><th>Admin</th></tr></thead>
<tbody>
<tr><td>Home Page, Search Post, Post Detail</td><td>X</td><td>X</td><td>X</td><td>X</td></tr>
<tr><td>Register</td><td>X</td><td></td><td></td><td></td></tr>
<tr><td>Apply Job, List Apply</td><td></td><td>X</td><td></td><td></td></tr>
<tr><td>Create / Update Post, Manage Applicants</td><td></td><td></td><td>X</td><td></td></tr>
<tr><td>Change Status Account, quản lý Skill / Category</td><td></td><td></td><td></td><td>X</td></tr>
</tbody>
</table>
<p class="ghi-chu">Bảng gốc của G5 tick <em>Register</em> cho Freelancer và Recruiter (họ đã đăng ký rồi) và ghi "Change status account Freelancer" hai lần — đúng loại sơ suất người chấm để ý. Mỗi màn một dòng, không trùng.</p>
<h3>Đặc tả màn hình — bảng trường của "Apply Job" (SRS mục 3)</h3>
<p><strong>Mô tả ngắn:</strong> cho freelancer đã đăng nhập ứng tuyển một tin đang mở (UC-15).</p>
<table>
<thead><tr><th>Field Name</th><th>Field Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td colspan="3"><em>Thông tin tin tuyển dụng (chỉ đọc)</em></td></tr>
<tr><td>Post title</td><td>Label</td><td>Lấy từ Post.title, tối đa 50 ký tự</td></tr>
<tr><td>Company</td><td>Link</td><td>Tên công ty, mở Company Detail</td></tr>
<tr><td>Budget</td><td>Label</td><td>Post.budget, hiển thị dạng 1.500.000 ₫</td></tr>
<tr><td colspan="3"><em>Đơn ứng tuyển</em></td></tr>
<tr><td>CV file*</td><td>File</td><td>PDF hoặc DOCX, ≤ 5 MB (BR-14); bắt buộc trừ khi tick "Use my profile CV"; lỗi MSG24</td></tr>
<tr><td>Use my profile CV</td><td>Checkbox</td><td>Mặc định không tick; bị vô hiệu nếu hồ sơ chưa có CV</td></tr>
<tr><td>Cover note</td><td>Textarea</td><td>Tuỳ chọn, tối đa 500 ký tự (MSG08 nếu dài hơn)</td></tr>
<tr><td>Submit</td><td>Button</td><td>Chạy bước 4–7 của luồng chính</td></tr>
<tr><td>Cancel</td><td>Button</td><td>Quay lại Post Detail, không lưu gì</td></tr>
</tbody>
</table>
<p class="nhan">Lỗi làm mất điểm</p>
<div class="pitfall co-tieu-de"><strong>Ảnh chụp thay cho đặc tả.</strong> Một mock-up không có bảng trường không cho tester biết độ dài tối đa, giá trị mặc định hay message — Template1 đòi đủ cả ba.</div>
<div class="pitfall co-tieu-de"><strong>Quy tắc giấu trong chữ của UC.</strong> "Mật khẩu phải 8 ký tự…" viết ở năm use case sẽ lệch nhau dần; viết một lần thành BR-09 rồi tham chiếu mã.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Bảng quyết định cho các quy tắc chồng chéo.</strong> Khi nhiều quy tắc cùng tác động (trạng thái tin × trạng thái đơn × vai trò), hãy vẽ decision table: mỗi cột một tổ hợp điều kiện, mỗi dòng một hành động. Nó lộ ra các trường hợp bị bỏ sót ("tin hết hạn khi đơn còn Pending thì sao?") và cho tester mỗi cột một test — kỹ thuật Wiegers khuyên trong chương business rule và SWT301 dạy ở phần decision-table testing.</div>`),
    books([
      ['wiegers', 'Ch. 9 — Playing by the rules (the 5-class taxonomy); Ch. 15 — Risk reduction through prototyping', 'Chương 9 — Playing by the rules (phân loại 5 nhóm); Chương 15 — Giảm rủi ro bằng prototype'],
      ['sommerville', 'Ch. 2.3 — Coping with change (prototyping, incremental delivery)', 'Mục 2.3 — Ứng phó với thay đổi (prototype, bàn giao tăng dần)'],
      ['gomaa', 'Ch. 6 — Use case modeling (activity diagrams for use cases)', 'Chương 6 — Use case modeling (activity diagram cho use case)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 2.4 The SRS template ─────────────── */
const L24 = {
  title: '2.4 — The SRS template (Template1), section by section|||2.4 — Mẫu SRS (Template1) từng mục một',
  slug: 'swp391-2-4-srs-template',
  type: 'VIDEO',
  description: 'Template1 SRS Document, 15 trang: Record of Changes, context diagram, quy trình nghiệp vụ swim-lane, actor, use case, sơ đồ UC, screen flow, phân quyền màn hình, Non-UI functions, ERD, đặc tả UC, yêu cầu chức năng theo màn hình, yêu cầu phi chức năng, business rule, system message — giải thích từng trường và việc mỗi iteration phải cập nhật.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.4 · Template1 SRS Document, pages 1–15</span>
<h2>Filling the SRS — every section, every field</h2>
<p class="lead">Template1 is the 2026 requirement template (it replaces the requirement half of the older RDS that the G5 sample uses; the design half now lives in Template2 SDS). It is one document for the whole team, extended in every iteration. This lesson walks through it page by page and says, for each section, what to write, who writes it and when.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>name the five parts of the SRS and what each one is for;</li>
<li>fill the overall-requirement tables (actors, use cases, screen authorization, non-UI functions, entities);</li>
<li>write a UC specification and a screen specification in the template's exact format;</li>
<li>keep the document consistent across iterations with the Record of Changes, Business Rules and System Messages tables.</li>
</ul></div>
<p class="nhan">The document at a glance</p>
<table>
<thead><tr><th>Part</th><th>Contents</th><th>Written by</th><th>When</th></tr></thead>
<tbody>
<tr><td>I. Record of Changes</td><td>Date · A/M/D · In charge · Change description</td><td>Whoever edits</td><td>Every change</td></tr>
<tr><td>II.1 Overall Requirements</td><td>Context diagram, business processes, actors, use cases + diagrams, screen flow, screen authorization, non-UI functions, ERD</td><td>Whole team (leader coordinates)</td><td>Iter 1, updated later</td></tr>
<tr><td>II.2 Use Case Specifications</td><td>Specs of the complex UCs of the main workflows</td><td>Owner of each UC</td><td>The iteration that builds it</td></tr>
<tr><td>II.3 Functional Requirements</td><td>Per screen: mock-up, description, field table</td><td>Owner of each screen</td><td>The iteration that builds it</td></tr>
<tr><td>II.4 Non-Functional Requirements</td><td>External interfaces, quality attributes</td><td>Team</td><td>Iter 1, refined</td></tr>
<tr><td>II.5 Requirement Appendix</td><td>Business rules, system messages, other</td><td>Everyone adds rows</td><td>Continuously</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.4 · Template1 SRS Document, trang 1–15</span>
<h2>Điền SRS — từng mục, từng trường</h2>
<p class="lead">Template1 là mẫu tài liệu yêu cầu 2026 (thay cho nửa "yêu cầu" của RDS kiểu cũ mà nhóm mẫu G5 dùng; nửa "thiết kế" giờ nằm ở Template2 SDS). Đây là một tài liệu chung cho cả nhóm, được viết tiếp ở mỗi iteration. Bài này đi qua từng trang và nói rõ, với mỗi mục, viết gì, ai viết và viết lúc nào.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>kể được năm phần của SRS và mỗi phần để làm gì;</li>
<li>điền các bảng yêu cầu tổng thể (actor, use case, phân quyền màn hình, non-UI function, entity);</li>
<li>viết đặc tả UC và đặc tả màn hình đúng định dạng của mẫu;</li>
<li>giữ tài liệu nhất quán qua các iteration nhờ các bảng Record of Changes, Business Rules và System Messages.</li>
</ul></div>
<p class="nhan">Toàn cảnh tài liệu</p>
<table>
<thead><tr><th>Phần</th><th>Nội dung</th><th>Ai viết</th><th>Khi nào</th></tr></thead>
<tbody>
<tr><td>I. Record of Changes</td><td>Ngày · A/M/D · Người phụ trách · Mô tả thay đổi</td><td>Người sửa</td><td>Mỗi lần sửa</td></tr>
<tr><td>II.1 Overall Requirements</td><td>Context diagram, quy trình nghiệp vụ, actor, use case + sơ đồ, screen flow, phân quyền màn hình, non-UI function, ERD</td><td>Cả nhóm (leader điều phối)</td><td>Iter 1, cập nhật sau</td></tr>
<tr><td>II.2 Use Case Specifications</td><td>Đặc tả các UC phức tạp của luồng chính</td><td>Người phụ trách UC</td><td>Iteration xây UC đó</td></tr>
<tr><td>II.3 Functional Requirements</td><td>Mỗi màn: mock-up, mô tả, bảng trường</td><td>Người phụ trách màn</td><td>Iteration xây màn đó</td></tr>
<tr><td>II.4 Non-Functional Requirements</td><td>Giao tiếp ngoài, thuộc tính chất lượng</td><td>Cả nhóm</td><td>Iter 1, tinh chỉnh dần</td></tr>
<tr><td>II.5 Requirement Appendix</td><td>Business rule, system message, khác</td><td>Ai cũng thêm dòng</td><td>Liên tục</td></tr>
</tbody>
</table>`),
    walkHead(T, 1, 15, 'The template has 18 pages in Word; the 15 pages rendered here contain all of its content.', 'Mẫu có 18 trang trong Word; 15 trang hiển thị ở đây chứa toàn bộ nội dung của nó.'),
    walk(T, [
      [1, 'Cover page',
        `<p class="y-chinh">🎯 The cover identifies the document: "Software Requirement Specification — Project Name (Code)", place and date.</p>
<ul>
<li><strong>Project Name (Code)</strong> — e.g. "Job IT for Freelancer (JIF)"; the same code goes in the footer "ProjectCode - SRS Document" and in the file name <em>{Class}_{Group}_{System}_SRS</em>.</li>
<li><strong>Date</strong> — the date of this version, not the start of the semester.</li>
</ul>
<div class="pitfall">Never put a personal photo, phone number or ID card on the cover — the document is shared with the class and other teachers.</div>`,
        `<p class="y-chinh">🎯 Trang bìa định danh tài liệu: "Software Requirement Specification — Project Name (Code)", nơi và ngày.</p>
<ul>
<li><strong>Project Name (Code)</strong> — vd "Job IT for Freelancer (JIF)"; cùng mã đó xuất hiện ở chân trang "ProjectCode - SRS Document" và trong tên file <em>{Class}_{Group}_{System}_SRS</em>.</li>
<li><strong>Ngày</strong> — ngày của phiên bản này, không phải ngày đầu kỳ.</li>
</ul>
<div class="pitfall">Đừng đặt ảnh cá nhân, số điện thoại hay ảnh thẻ lên bìa — tài liệu được chia sẻ với lớp và các thầy cô khác.</div>`],
      [2, 'Table of Contents',
        `<p class="y-chinh">🎯 The five-part skeleton: Record of Changes, then Overall Requirements, UC Specifications, Functional Requirements, Non-Functional Requirements and the Requirement Appendix.</p>
<ol>
<li><strong>Overall Requirements</strong> (1.1–1.5) — the whole-system picture</li>
<li><strong>Use Case Specifications</strong> (2.x) — grouped by feature</li>
<li><strong>Functional Requirements</strong> (3.x) — grouped by feature › sub-feature › screen</li>
<li><strong>Non-Functional Requirements</strong> — external interfaces, quality attributes</li>
<li><strong>Requirement Appendix</strong> — business rules, system messages, other</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> build the TOC with Word heading styles (Heading 1–5) and press "Update table" before each submission — a stale TOC is an easy lost point.</p>
<p class="ghi-chu">The template numbers the NFR sub-sections "3.1 / 3.2" and has two "1.3.2" headings — renumber them 4.1 / 4.2 and 1.3.3 in your copy.</p>`,
        `<p class="y-chinh">🎯 Bộ khung năm phần: Record of Changes, rồi Overall Requirements, UC Specifications, Functional Requirements, Non-Functional Requirements và Requirement Appendix.</p>
<ol>
<li><strong>Overall Requirements</strong> (1.1–1.5) — bức tranh toàn hệ thống</li>
<li><strong>Use Case Specifications</strong> (2.x) — nhóm theo tính năng</li>
<li><strong>Functional Requirements</strong> (3.x) — nhóm theo tính năng › tính năng con › màn hình</li>
<li><strong>Non-Functional Requirements</strong> — giao tiếp ngoài, thuộc tính chất lượng</li>
<li><strong>Requirement Appendix</strong> — business rule, system message, khác</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> dựng mục lục bằng heading style của Word (Heading 1–5) và bấm "Update table" trước mỗi lần nộp — mục lục cũ là điểm mất rất dễ tránh.</p>
<p class="ghi-chu">Mẫu đánh số các mục NFR là "3.1 / 3.2" và có hai tiêu đề "1.3.2" — trong bản của bạn hãy đánh lại thành 4.1 / 4.2 và 1.3.3.</p>`],
      [3, 'I. Record of Changes',
        `<p class="y-chinh">🎯 A log of every change to the document — the proof that requirements evolved through the iterations.</p>
<p class="nhan">Columns</p>
<ul>
<li><strong>Date</strong> — when the change was made.</li>
<li><strong>A*, M, D</strong> — Added, Modified or Deleted.</li>
<li><strong>In charge</strong> — the member who made it (use the team role or member code agreed with the teacher).</li>
<li><strong>Change Description</strong> — what and why: "M — UC-15 Apply Job: added E2 'already applied' after Q&amp;A with the PO".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> at least one row per member per iteration — it shows the teacher that everyone wrote requirements for his/her screens.</p>`,
        `<p class="y-chinh">🎯 Nhật ký mọi thay đổi của tài liệu — bằng chứng yêu cầu đã tiến hoá qua các iteration.</p>
<p class="nhan">Các cột</p>
<ul>
<li><strong>Date</strong> — ngày thay đổi.</li>
<li><strong>A*, M, D</strong> — Added (thêm), Modified (sửa) hay Deleted (xoá).</li>
<li><strong>In charge</strong> — thành viên thực hiện (dùng vai trò hoặc mã thành viên đã thống nhất với thầy/cô).</li>
<li><strong>Change Description</strong> — thay đổi gì và vì sao: "M — UC-15 Apply Job: thêm E2 'đã ứng tuyển' sau buổi Q&amp;A với PO".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mỗi thành viên ít nhất một dòng mỗi iteration — nó cho thầy/cô thấy ai cũng viết yêu cầu cho màn hình của mình.</p>`],
      [4, '1.1 Context Diagram',
        `<p class="y-chinh">🎯 One picture of the system as a single circle, the external entities around it, and the flows between them.</p>
<ul>
<li><strong>Text first</strong> — a short introduction of the product (the Cafeteria Ordering System replaces manual and phone ordering; release 1.0; later releases add restaurants and card payment).</li>
<li><strong>External entities</strong> (terminators) — people, other software, hardware: Customer, Menu Manager, Cafeteria Staff, Meal Deliverer, Payroll System, Cafeteria Inventory System.</li>
<li><strong>Labelled flows</strong> — data, control, material: "meal order", "delivery request", "payroll deduction response".</li>
</ul>
<p class="nhan">For G5</p>
<ul>
<li><strong>Centre</strong> — Job IT for Freelancer System.</li>
<li><strong>Around</strong> — Guest (search criteria → job list), Freelancer (application, CV → status), Recruiter (job post → applicants), Admin (approval, status changes → reports), E-mail service (reset / notification e-mails).</li>
</ul>
<div class="pitfall">No internal parts (Servlet, database table) in a context diagram — only the boundary and what crosses it.</div>`,
        `<p class="y-chinh">🎯 Một hình vẽ hệ thống là một vòng tròn duy nhất, các thực thể bên ngoài quanh nó, và các luồng giữa chúng.</p>
<ul>
<li><strong>Chữ trước</strong> — giới thiệu ngắn về sản phẩm (Cafeteria Ordering System thay việc đặt món thủ công và qua điện thoại; bản 1.0; bản sau nối thêm nhà hàng và thanh toán thẻ).</li>
<li><strong>Thực thể ngoài</strong> (terminator) — người, phần mềm khác, phần cứng: Customer, Menu Manager, Cafeteria Staff, Meal Deliverer, Payroll System, Cafeteria Inventory System.</li>
<li><strong>Luồng có nhãn</strong> — dữ liệu, điều khiển, vật chất: "meal order", "delivery request", "payroll deduction response".</li>
</ul>
<p class="nhan">Với G5</p>
<ul>
<li><strong>Ở giữa</strong> — Job IT for Freelancer System.</li>
<li><strong>Xung quanh</strong> — Guest (tiêu chí tìm → danh sách job), Freelancer (đơn, CV → trạng thái), Recruiter (tin tuyển dụng → ứng viên), Admin (duyệt, đổi trạng thái → báo cáo), E-mail service (e-mail đặt lại mật khẩu / thông báo).</li>
</ul>
<div class="pitfall">Không vẽ phần bên trong (Servlet, bảng DB) trong context diagram — chỉ ranh giới và những gì đi qua nó.</div>`],
      [5, '1.2 Main Business Processes & 1.3.1 Actors',
        `<p class="y-chinh">🎯 Swim-lane diagrams show the main workflows across roles; the Actors table names every role.</p>
<p class="nhan">1.2 Business processes</p>
<ul>
<li><strong>One lane per role or department</strong> — the Order Processing sample has Customer, Sales, Credit &amp; Invoicing, Warehouse.</li>
<li><strong>Decisions as diamonds</strong> — "Has the order been confirmed?", "Is there any pending credit?".</li>
<li><strong>G5 workflow</strong> — Recruiter creates post → Admin approves → Freelancer applies → Recruiter accepts / rejects → Freelancer is notified.</li>
</ul>
<p class="nhan">1.3.1 Actors</p>
<ul>
<li><strong>Table # · Actor · Description</strong>; the guidance repeats pages 7 and 9 of the requirement deck (role not person; the three questions).</li>
</ul>`,
        `<p class="y-chinh">🎯 Swim-lane diagram cho thấy các quy trình chính đi qua các vai trò; bảng Actors gọi tên mọi vai trò.</p>
<p class="nhan">1.2 Quy trình nghiệp vụ</p>
<ul>
<li><strong>Mỗi vai trò / phòng ban một làn</strong> — mẫu Order Processing có Customer, Sales, Credit &amp; Invoicing, Warehouse.</li>
<li><strong>Quyết định là hình thoi</strong> — "Has the order been confirmed?", "Is there any pending credit?".</li>
<li><strong>Quy trình của G5</strong> — Recruiter tạo tin → Admin duyệt → Freelancer ứng tuyển → Recruiter nhận / từ chối → Freelancer được báo.</li>
</ul>
<p class="nhan">1.3.1 Actors</p>
<ul>
<li><strong>Bảng # · Actor · Description</strong>; phần hướng dẫn nhắc lại trang 7 và 9 của slide yêu cầu (vai trò không phải người; ba câu hỏi).</li>
</ul>`],
      [6, '1.3.2 Use Cases & Use Case Diagrams',
        `<p class="y-chinh">🎯 A table of all use cases (ID · Use Case · Feature · Description) plus one diagram per actor or workflow.</p>
<ul>
<li><strong>ID</strong> — 01, 02… (or UC-01); keep it identical in the tracking file.</li>
<li><strong>Use Case</strong> — verb + object: "View Menu", "Order a Meal".</li>
<li><strong>Feature</strong> — the group it belongs to; the same groups organise sections 2 and 3.</li>
<li><strong>Diagrams</strong> — the samples: <em>UCs for Guest</em> (View Home Page, View Blog List ← View Blog Details extends, Register User Account, Contact Admin) and <em>UCs for Student</em> (Login ← Reset Password extends, View Student Dashboard, View/Edit User Profile, Change Password, Log Out); Student inherits Guest.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một bảng mọi use case (ID · Use Case · Feature · Description) cộng mỗi actor hoặc mỗi workflow một sơ đồ.</p>
<ul>
<li><strong>ID</strong> — 01, 02… (hoặc UC-01); giữ y hệt trong file tracking.</li>
<li><strong>Use Case</strong> — động từ + danh từ: "View Menu", "Order a Meal".</li>
<li><strong>Feature</strong> — nhóm chứa nó; chính các nhóm này tổ chức mục 2 và 3.</li>
<li><strong>Sơ đồ</strong> — mẫu: <em>UCs for Guest</em> (View Home Page, View Blog List ← View Blog Details extend, Register User Account, Contact Admin) và <em>UCs for Student</em> (Login ← Reset Password extend, View Student Dashboard, View/Edit User Profile, Change Password, Log Out); Student kế thừa Guest.</li>
</ul>`],
      [7, '1.4 System Functionalities — screens flow, authorization, non-UI functions',
        `<p class="y-chinh">🎯 Section 1.4 is the functional overview: how screens connect, who may open each one, and what runs without a screen.</p>
<ol>
<li><strong>1.4.1 Screens Flow</strong> — every screen as a box, arrows for navigation (Home Page → User Login → Dashboard → Users List → User Details…).</li>
<li><strong>1.4.2 Screen Authorization</strong> — rows = screens (down to screen activities), columns = your role names, X = allowed.</li>
<li><strong>1.4.3 Non-UI Functions</strong> — # · Feature · System Function · Description: batch/cron jobs, services, APIs. G5: "Reset password by Gmail", plus a timer that expires posts.</li>
</ol>
<p class="nhan">Then 1.5 Entity Relationship Diagram</p>
<ul>
<li><strong>Crow's-foot notation</strong> — the full ERD is designed in Chapter 3; here it shows the business entities the requirements talk about.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục 1.4 là tổng quan chức năng: các màn nối nhau thế nào, ai được mở màn nào, và cái gì chạy không cần màn hình.</p>
<ol>
<li><strong>1.4.1 Screens Flow</strong> — mỗi màn là một hộp, mũi tên là điều hướng (Home Page → User Login → Dashboard → Users List → User Details…).</li>
<li><strong>1.4.2 Screen Authorization</strong> — dòng = màn hình (tới cả thao tác trên màn), cột = tên vai trò của bạn, X = được phép.</li>
<li><strong>1.4.3 Non-UI Functions</strong> — # · Feature · System Function · Description: batch/cron job, service, API. G5: "Reset password by Gmail", thêm một timer làm hết hạn tin.</li>
</ol>
<p class="nhan">Rồi 1.5 Entity Relationship Diagram</p>
<ul>
<li><strong>Ký hiệu crow's-foot</strong> — ERD đầy đủ được thiết kế ở Chương 3; ở đây nó cho thấy các thực thể nghiệp vụ mà yêu cầu nhắc tới.</li>
</ul>`],
      [8, '1.5 ERD, entity descriptions & 2. Use Case Specifications',
        `<p class="y-chinh">🎯 The ERD sample and its entity table close part 1; part 2 starts the UC specifications — only for the complex use cases.</p>
<p class="nhan">Entities Description</p>
<ul>
<li><strong># · Entity · Description</strong> — "Patrol: cafeteria's customer information", Meal, Order, Food, Supplier, Payroll…</li>
</ul>
<p class="nhan">2. Use Case Specifications — the key instruction</p>
<ul>
<li><strong>Specify only complex UCs</strong> involved in the main workflows (business processes).</li>
<li><strong>Simple UCs</strong> (CRUD, data viewing) are described by their screen in part 3 — no separate spec needed.</li>
<li><strong>Table</strong> — Primary Actors · Secondary Actors · Description · Preconditions · Postconditions · Normal Sequence/Flow · Alternative Sequences/Flows.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> in G5, Apply Job and Manage Applicants deserve full specs; "View Categories" does not.</p>`,
        `<p class="y-chinh">🎯 ERD mẫu và bảng thực thể khép lại phần 1; phần 2 mở đầu đặc tả UC — chỉ cho use case phức tạp.</p>
<p class="nhan">Entities Description</p>
<ul>
<li><strong># · Entity · Description</strong> — "Patrol: thông tin khách của căng tin", Meal, Order, Food, Supplier, Payroll…</li>
</ul>
<p class="nhan">2. Use Case Specifications — chỉ dẫn quan trọng</p>
<ul>
<li><strong>Chỉ đặc tả UC phức tạp</strong> nằm trong các luồng chính (quy trình nghiệp vụ).</li>
<li><strong>UC đơn giản</strong> (CRUD, xem dữ liệu) được mô tả qua màn hình ở phần 3 — không cần đặc tả riêng.</li>
<li><strong>Bảng</strong> — Primary Actors · Secondary Actors · Description · Preconditions · Postconditions · Normal Sequence/Flow · Alternative Sequences/Flows.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> với G5, Apply Job và Manage Applicants xứng đáng có đặc tả đầy đủ; "View Categories" thì không.</p>`],
      [9, 'UC field guide & sample "Login System"',
        `<p class="y-chinh">🎯 The template explains each UC field, then shows a complete sample: Login System.</p>
<ul>
<li><strong>Description</strong> — may be a user story: "As a user, I want to log into the system so that I can use its authenticated features".</li>
<li><strong>Alternative Flows</strong> — here holds <em>both</em> other successful scenarios and error conditions (the template merges Exceptions into it).</li>
</ul>
<p class="nhan">The Login sample</p>
<ol>
<li>User clicks Login (or opens an authenticated URL).</li>
<li>System shows the User Login screen.</li>
<li>User types email and password.</li>
<li>User clicks Login.</li>
<li>System validates (BR-01, BR-02).</li>
<li>System allows access.</li>
<li>System records the login in the Activity Log.</li>
<li>System directs the user to Home (or the calling page).</li>
</ol>
<p><strong>Step 2.1 Google Login</strong> — redirect to Google, validate, return to step 5.</p>`,
        `<p class="y-chinh">🎯 Mẫu giải thích từng trường UC, rồi cho một ví dụ trọn vẹn: Login System.</p>
<ul>
<li><strong>Description</strong> — có thể là user story: "Là người dùng, tôi muốn đăng nhập để dùng các tính năng cần xác thực".</li>
<li><strong>Alternative Flows</strong> — ở đây chứa <em>cả</em> các kịch bản thành công khác lẫn tình huống lỗi (mẫu gộp Exceptions vào đây).</li>
</ul>
<p class="nhan">Mẫu Login</p>
<ol>
<li>Người dùng bấm Login (hoặc mở một URL cần xác thực).</li>
<li>Hệ thống hiện màn User Login.</li>
<li>Người dùng nhập email và mật khẩu.</li>
<li>Người dùng bấm Login.</li>
<li>Hệ thống kiểm tra (BR-01, BR-02).</li>
<li>Hệ thống cho truy cập.</li>
<li>Hệ thống ghi lần đăng nhập vào Activity Log.</li>
<li>Hệ thống chuyển tới Home (hoặc trang đã gọi).</li>
</ol>
<p><strong>Step 2.1 Google Login</strong> — chuyển sang Google, xác thực, quay về bước 5.</p>`],
      [10, 'Login — error flow; 2.1.3 and 2.2 placeholders',
        `<p class="y-chinh">🎯 The error branch shows the level of detail expected: each failure case with its message code, plus the lock-out rule.</p>
<p class="nhan">Step 4 — System can't authenticate the user</p>
<ol>
<li>Email and/or password left blank → <strong>MSG10</strong></li>
<li>Email or password incorrect → <strong>MSG09</strong></li>
<li>Correct but email not verified → <strong>MSG11</strong></li>
<li>Account blocked / inactive → <strong>MSG12</strong></li>
</ol>
<p>Five wrong attempts in a row lock the account for 30 minutes (<strong>MSG13</strong>).</p>
<p class="nhan">What to copy</p>
<ul>
<li><strong>Name the step</strong> where the branch starts ("Step 4_…").</li>
<li><strong>Every message has a code</strong> that exists in section 5.2.</li>
<li>"2.1.3 UC Name2…", "2.2 Xyz Feature…" are placeholders: one sub-section per UC, grouped by feature.</li>
</ul>`,
        `<p class="y-chinh">🎯 Nhánh lỗi cho thấy mức chi tiết cần có: mỗi trường hợp lỗi kèm mã message, cộng quy tắc khoá tài khoản.</p>
<p class="nhan">Step 4 — Hệ thống không xác thực được người dùng</p>
<ol>
<li>Để trống email và/hoặc mật khẩu → <strong>MSG10</strong></li>
<li>Email hoặc mật khẩu sai → <strong>MSG09</strong></li>
<li>Đúng nhưng email chưa xác minh → <strong>MSG11</strong></li>
<li>Tài khoản bị khoá / không hoạt động → <strong>MSG12</strong></li>
</ol>
<p>Sai 5 lần liên tiếp thì khoá tài khoản 30 phút (<strong>MSG13</strong>).</p>
<p class="nhan">Điều nên học theo</p>
<ul>
<li><strong>Ghi tên bước</strong> nơi nhánh bắt đầu ("Step 4_…").</li>
<li><strong>Mỗi message có mã</strong> và mã đó có trong mục 5.2.</li>
<li>"2.1.3 UC Name2…", "2.2 Xyz Feature…" là chỗ giữ: mỗi UC một mục con, nhóm theo tính năng.</li>
</ul>`],
      [11, '3. Functional Requirements — structure',
        `<p class="y-chinh">🎯 Part 3 describes every screen/function, grouped Feature › Sub-feature › Screen, each with three contents.</p>
<ol>
<li><strong>Content #1 — UI layout</strong>: the mock-up screen prototype.</li>
<li><strong>Content #2 — brief description</strong>, mapped to the relevant use cases.</li>
<li><strong>Content #3 — field table</strong>: Field Name · Description (data type, min/max length or value, initial data…), fields grouped under italic group rows.</li>
</ol>
<p class="nhan">Standard groups in the sample</p>
<ul>
<li><strong>3.2 User Authentication</strong> — User Register, User Login, Password Reset.</li>
<li><strong>3.3 System Administration</strong> — Master Data, User Management.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> one member's 3–4 screens = one or two sub-sections here, written in the same iteration as the code.</p>`,
        `<p class="y-chinh">🎯 Phần 3 mô tả mọi màn hình/chức năng, nhóm theo Feature › Sub-feature › Screen, mỗi màn có ba nội dung.</p>
<ol>
<li><strong>Nội dung #1 — bố cục UI</strong>: mock-up của màn hình.</li>
<li><strong>Nội dung #2 — mô tả ngắn</strong>, gắn với các use case liên quan.</li>
<li><strong>Nội dung #3 — bảng trường</strong>: Field Name · Description (kiểu dữ liệu, độ dài / giá trị min–max, dữ liệu khởi tạo…), các trường chia nhóm dưới dòng tiêu đề nghiêng.</li>
</ol>
<p class="nhan">Các nhóm chuẩn trong mẫu</p>
<ul>
<li><strong>3.2 User Authentication</strong> — User Register, User Login, Password Reset.</li>
<li><strong>3.3 System Administration</strong> — Master Data, User Management.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> 3–4 màn của một thành viên = một hai mục con ở đây, viết trong cùng iteration với phần code.</p>`],
      [12, '3.3.1.1 Setting List — a full screen spec',
        `<p class="y-chinh">🎯 The model answer for a list screen: mock-up with numbered callouts, what the screen allows, and a field table keyed to the numbers.</p>
<p class="nhan">"This screen allows the Administrator to"</p>
<ul>
<li><strong>View</strong> the setting list · <strong>Filter</strong> by type and status · <strong>Search</strong> by name or value · <strong>Sort</strong> by clicking headers.</li>
<li><strong>Activate / Deactivate</strong> a setting; open <strong>Setting Details</strong> via New Setting or Edit.</li>
</ul>
<p class="nhan">Field Description keyed to (1)(2)(3)</p>
<ul>
<li><strong>(1)</strong> type filter — initial values: all active setting names; tooltip "Setting Type".</li>
<li><strong>(2)</strong> status filter — All Statuses (default), Active, Inactive.</li>
<li><strong>(3)</strong> action link — "Activate" or "Deactivate" depending on the current status.</li>
</ul>
<p class="ghi-chu">Setting (master data) List + Details is the classic Iteration-1 admin screen pair; its "type" column also drives drop-downs elsewhere (roles, categories).</p>`,
        `<p class="y-chinh">🎯 Đáp án mẫu cho một màn danh sách: mock-up có đánh số, màn cho phép làm gì, và bảng trường khớp với các số.</p>
<p class="nhan">"This screen allows the Administrator to"</p>
<ul>
<li><strong>Xem</strong> danh sách setting · <strong>Lọc</strong> theo loại và trạng thái · <strong>Tìm</strong> theo tên hoặc giá trị · <strong>Sắp xếp</strong> bằng cách bấm tiêu đề cột.</li>
<li><strong>Kích hoạt / Vô hiệu</strong> một setting; mở <strong>Setting Details</strong> qua New Setting hoặc Edit.</li>
</ul>
<p class="nhan">Field Description theo (1)(2)(3)</p>
<ul>
<li><strong>(1)</strong> lọc loại — giá trị ban đầu: tên mọi setting đang active; tooltip "Setting Type".</li>
<li><strong>(2)</strong> lọc trạng thái — All Statuses (mặc định), Active, Inactive.</li>
<li><strong>(3)</strong> link thao tác — "Activate" hay "Deactivate" tuỳ trạng thái hiện tại.</li>
</ul>
<p class="ghi-chu">Cặp Setting (master data) List + Details là cặp màn admin kinh điển của Iteration 1; cột "type" của nó còn cấp dữ liệu cho các drop-down khác (vai trò, danh mục).</p>`],
      [13, '3.3.1.2 Setting Details, 3.3.2 User Management, 4. NFR — External Interfaces',
        `<p class="y-chinh">🎯 A details screen spec is mostly its field table: type and limits for each input.</p>
<p class="nhan">Setting Details fields</p>
<ul>
<li><strong>Name</strong> — non-digit string, max 20 chars</li>
<li><strong>Type</strong> — initial values: all active setting names</li>
<li><strong>Value</strong> — any string, max 100 chars</li>
<li><strong>Priority</strong> — positive integer</li>
<li><strong>Description</strong> — any string, max 200 chars</li>
</ul>
<p class="nhan">4. Non-Functional — External Interfaces</p>
<ul>
<li><strong>How the system talks to users and other systems</strong> — for a web system: supported browsers and screen sizes, the SMTP mail server, Google OAuth, a payment gateway, file storage.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> every limit here ("max 20") is a boundary test later — write numbers, never "short text".</p>`,
        `<p class="y-chinh">🎯 Đặc tả màn chi tiết chủ yếu là bảng trường: kiểu và giới hạn của từng ô nhập.</p>
<p class="nhan">Các trường của Setting Details</p>
<ul>
<li><strong>Name</strong> — chuỗi không chứa số, tối đa 20 ký tự</li>
<li><strong>Type</strong> — giá trị ban đầu: tên mọi setting đang active</li>
<li><strong>Value</strong> — chuỗi bất kỳ, tối đa 100 ký tự</li>
<li><strong>Priority</strong> — số nguyên dương</li>
<li><strong>Description</strong> — chuỗi bất kỳ, tối đa 200 ký tự</li>
</ul>
<p class="nhan">4. Non-Functional — External Interfaces</p>
<ul>
<li><strong>Hệ thống giao tiếp với người dùng và hệ thống khác thế nào</strong> — với hệ thống web: trình duyệt và cỡ màn hình hỗ trợ, mail server SMTP, Google OAuth, cổng thanh toán, nơi lưu file.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mọi giới hạn ở đây ("tối đa 20") về sau là một test giá trị biên — hãy viết con số, đừng viết "chuỗi ngắn".</p>`],
      [14, 'Quality Attributes & 5.1 Business Rules',
        `<p class="y-chinh">🎯 Quality attributes must be measurable; business rules get IDs that the rest of the document references.</p>
<p class="nhan">Quality attributes</p>
<ul>
<li><strong>Usability</strong> — training time for normal and power users, measurable task times, conformance to UI standards.</li>
<li><strong>Performance</strong> — response time (average, maximum), throughput (transactions/s), capacity (users, records), resource use (memory, disk).</li>
<li><strong>More (3.2.3…)</strong> — security, availability, maintainability as needed.</li>
</ul>
<p class="nhan">5.1 Business Rules — ID · Rule Definition</p>
<ul>
<li>BR-01/02 delivery windows, BR-03/04 one location and one payment per order, BR-11 payroll deduction for delivery, BR-12 price computation, BR-24 only Menu Managers edit menus.</li>
<li><strong>IDs need not be consecutive</strong> — BR-11, BR-24 show rules added or removed over time; never renumber, or references break.</li>
</ul>`,
        `<p class="y-chinh">🎯 Thuộc tính chất lượng phải đo được; business rule có mã để phần còn lại của tài liệu tham chiếu.</p>
<p class="nhan">Thuộc tính chất lượng</p>
<ul>
<li><strong>Usability</strong> — thời gian học cho người dùng thường và người dùng thạo, thời gian làm tác vụ đo được, tuân theo chuẩn giao diện.</li>
<li><strong>Performance</strong> — thời gian phản hồi (trung bình, tối đa), thông lượng (giao dịch/giây), sức chứa (người dùng, bản ghi), tài nguyên (bộ nhớ, đĩa).</li>
<li><strong>Thêm (3.2.3…)</strong> — bảo mật, sẵn sàng, dễ bảo trì khi cần.</li>
</ul>
<p class="nhan">5.1 Business Rules — ID · Rule Definition</p>
<ul>
<li>BR-01/02 khung giờ giao, BR-03/04 một địa điểm và một cách trả tiền mỗi đơn, BR-11 trừ lương khi giao tận nơi, BR-12 cách tính giá, BR-24 chỉ Menu Manager sửa menu.</li>
<li><strong>Mã không cần liên tiếp</strong> — BR-11, BR-24 cho thấy quy tắc được thêm hay bỏ theo thời gian; đừng đánh số lại, kẻo tham chiếu bị gãy.</li>
</ul>`],
      [15, '5.2 System Messages & 5.3 Other Requirements',
        `<p class="y-chinh">🎯 One table of every message the system shows — code, type, context and exact text.</p>
<p class="nhan">Columns</p>
<ul>
<li><strong>Message code</strong> — MSG01, MSG02…, referenced from UC flows and field tables.</li>
<li><strong>Message Type</strong> — In line · In red, under the text box · Toast message.</li>
<li><strong>Context</strong> — when it appears: "Input-required fields are empty".</li>
<li><strong>Content</strong> — exact text, with placeholders: "The * field is required.", "Exceed max length of {max_length}.", "A confirmation email has been sent to {email_address}."</li>
</ul>
<p class="nhan">Why graders like it</p>
<ul>
<li><strong>Consistency</strong> — the same situation shows the same words on every screen.</li>
<li><strong>Testability</strong> — the tester compares the screen with the exact text.</li>
</ul>
<p class="ghi-chu">The sample text "Incorrrect user name…" carries a typo — proofread your own messages. 5.3 holds anything else (legal, data migration, reporting).</p>`,
        `<p class="y-chinh">🎯 Một bảng mọi thông báo hệ thống hiển thị — mã, loại, ngữ cảnh và nội dung chính xác.</p>
<p class="nhan">Các cột</p>
<ul>
<li><strong>Message code</strong> — MSG01, MSG02…, được tham chiếu từ luồng UC và bảng trường.</li>
<li><strong>Message Type</strong> — In line · In red, under the text box · Toast message.</li>
<li><strong>Context</strong> — khi nào xuất hiện: "Input-required fields are empty".</li>
<li><strong>Content</strong> — nội dung chính xác, có placeholder: "The * field is required.", "Exceed max length of {max_length}.", "A confirmation email has been sent to {email_address}."</li>
</ul>
<p class="nhan">Vì sao người chấm thích bảng này</p>
<ul>
<li><strong>Nhất quán</strong> — cùng tình huống thì cùng câu chữ trên mọi màn.</li>
<li><strong>Test được</strong> — tester so màn hình với đúng câu chữ.</li>
</ul>
<p class="ghi-chu">Câu mẫu "Incorrrect user name…" có lỗi chính tả — hãy soát lại message của bạn. Mục 5.3 chứa các yêu cầu khác (pháp lý, chuyển dữ liệu, báo cáo).</p>`],
    ]),
    bi(`<h2>🛠️ Filling the SRS across the three iterations — a plan for a 5-member team</h2>
<table>
<thead><tr><th>Section</th><th>Iteration 1</th><th>Iteration 2</th><th>Iteration 3</th></tr></thead>
<tbody>
<tr><td>1.1 Context · 1.2 Business processes</td><td>Complete draft</td><td>Fix after PO feedback</td><td>Match the final product</td></tr>
<tr><td>1.3 Actors · Use cases · UC diagrams</td><td><strong>All</strong> UCs listed, even future ones</td><td>Add / rename; keep IDs</td><td>Final</td></tr>
<tr><td>1.4 Screens flow · Authorization · Non-UI</td><td>All screens (planned ones in grey)</td><td>Update</td><td>Final</td></tr>
<tr><td>1.5 ERD + entities</td><td>Main entities</td><td>Complete</td><td>Final</td></tr>
<tr><td>2 UC specifications</td><td>Complex UCs of Iter-1 screens</td><td>+ Iter-2</td><td>+ Iter-3</td></tr>
<tr><td>3 Functional requirements (screens)</td><td>Iter-1 screens: mock-up + fields</td><td>+ Iter-2</td><td>+ Iter-3</td></tr>
<tr><td>4 Non-functional</td><td>Measurable targets</td><td>Refine</td><td>Final</td></tr>
<tr><td>5 BR · Messages</td><td>Rows for Iter-1</td><td>+ rows</td><td>+ rows</td></tr>
</tbody>
</table>
<p class="nhan">Six consistency checks before every submission</p>
<ol>
<li><strong>UC IDs</strong> in 1.3.2 = UC IDs in the tracking file's <em>Use Cases</em> sheet.</li>
<li><strong>Screens</strong> in 1.4.1 = rows of 1.4.2 = sub-sections of part 3 = rows of the <em>Product</em> sheet.</li>
<li><strong>Every BR ID</strong> used in parts 2–3 exists in 5.1; every MSG code exists in 5.2.</li>
<li><strong>Every entity</strong> in 1.5 is used by at least one screen or UC.</li>
<li><strong>Record of Changes</strong> has this iteration's rows.</li>
<li><strong>TOC updated</strong>, template guidance text (the blue italic [ … ]) deleted.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Leaving the template's samples in.</strong> Cafeteria rules BR-01…BR-88 or "Setting List" copied into a job-portal SRS show the teacher nobody read the document. Delete every sample row you did not replace.</div>
<div class="pitfall co-tieu-de"><strong>Four authors, four styles.</strong> Agree once on tense ("System shows…"), message style and numbering; the leader reviews the merged file before submitting.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Where Template1 comes from.</strong> Its skeleton (context diagram, user requirements, quality attributes, business rules) is Wiegers &amp; Beatty's SRS template, which follows ISO/IEC/IEEE 29148. The Cafeteria Ordering System and its rules BR-01…BR-88 are the running example of their book — reading their full sample SRS (Appendix C) is the fastest way to see a finished document of this shape.</div>`,
    `<h2>🛠️ Điền SRS qua ba iteration — kế hoạch cho nhóm 5 người</h2>
<table>
<thead><tr><th>Mục</th><th>Iteration 1</th><th>Iteration 2</th><th>Iteration 3</th></tr></thead>
<tbody>
<tr><td>1.1 Context · 1.2 Quy trình nghiệp vụ</td><td>Bản nháp đầy đủ</td><td>Sửa theo góp ý của PO</td><td>Khớp sản phẩm cuối</td></tr>
<tr><td>1.3 Actor · Use case · Sơ đồ UC</td><td>Liệt kê <strong>mọi</strong> UC, cả UC làm sau</td><td>Thêm / đổi tên; giữ mã</td><td>Hoàn chỉnh</td></tr>
<tr><td>1.4 Screen flow · Phân quyền · Non-UI</td><td>Mọi màn (màn làm sau tô xám)</td><td>Cập nhật</td><td>Hoàn chỉnh</td></tr>
<tr><td>1.5 ERD + entity</td><td>Thực thể chính</td><td>Đầy đủ</td><td>Hoàn chỉnh</td></tr>
<tr><td>2 Đặc tả UC</td><td>UC phức tạp của các màn Iter 1</td><td>+ Iter 2</td><td>+ Iter 3</td></tr>
<tr><td>3 Yêu cầu chức năng (màn hình)</td><td>Màn Iter 1: mock-up + trường</td><td>+ Iter 2</td><td>+ Iter 3</td></tr>
<tr><td>4 Phi chức năng</td><td>Chỉ tiêu đo được</td><td>Tinh chỉnh</td><td>Hoàn chỉnh</td></tr>
<tr><td>5 BR · Message</td><td>Các dòng cho Iter 1</td><td>+ dòng</td><td>+ dòng</td></tr>
</tbody>
</table>
<p class="nhan">Sáu phép kiểm nhất quán trước mỗi lần nộp</p>
<ol>
<li><strong>Mã UC</strong> ở 1.3.2 = mã UC trong sheet <em>Use Cases</em> của file tracking.</li>
<li><strong>Màn hình</strong> ở 1.4.1 = các dòng của 1.4.2 = các mục con của phần 3 = các dòng của sheet <em>Product</em>.</li>
<li><strong>Mọi mã BR</strong> dùng ở phần 2–3 đều có trong 5.1; mọi mã MSG đều có trong 5.2.</li>
<li><strong>Mọi thực thể</strong> ở 1.5 được ít nhất một màn hoặc một UC dùng tới.</li>
<li><strong>Record of Changes</strong> có các dòng của iteration này.</li>
<li><strong>Mục lục đã cập nhật</strong>, chữ hướng dẫn của mẫu (chữ nghiêng xanh [ … ]) đã xoá.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Để nguyên ví dụ của mẫu.</strong> Quy tắc Cafeteria BR-01…BR-88 hay "Setting List" chép vào SRS của một cổng việc làm cho thầy/cô thấy chưa ai đọc tài liệu. Xoá mọi dòng mẫu bạn không thay.</div>
<div class="pitfall co-tieu-de"><strong>Bốn người viết, bốn văn phong.</strong> Thống nhất một lần về thì ("System shows…"), kiểu message và cách đánh số; leader rà file đã gộp trước khi nộp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Template1 đến từ đâu.</strong> Bộ khung của nó (context diagram, user requirement, quality attribute, business rule) là mẫu SRS của Wiegers &amp; Beatty, vốn theo ISO/IEC/IEEE 29148. Cafeteria Ordering System và các quy tắc BR-01…BR-88 là ví dụ xuyên suốt cuốn sách của họ — đọc bản SRS mẫu hoàn chỉnh (Phụ lục C) là cách nhanh nhất để thấy một tài liệu dạng này khi đã xong.</div>`),
    books([
      ['wiegers', 'Ch. 10 — Documenting the requirements (the SRS template); Ch. 5 — context diagram; Ch. 12 — analysis models (swim-lane, dialog map); Appendix C — sample documents', 'Chương 10 — Documenting the requirements (mẫu SRS); Chương 5 — context diagram; Chương 12 — mô hình phân tích (swim-lane, dialog map); Phụ lục C — tài liệu mẫu'],
      ['sommerville', 'Ch. 4.3 — Requirements specification (the structure of a requirements document)', 'Mục 4.3 — Requirements specification (cấu trúc tài liệu yêu cầu)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 2.5 AI BA prompts ─────────────── */
const L25 = {
  title: '2.5 — AI as your senior BA: prompts #1–#6 (PRD → UI spec)|||2.5 — AI làm senior BA: prompt #1–#6 (PRD → đặc tả UI)',
  slug: 'swp391-2-ai-ba-prompts',
  type: 'VIDEO',
  description: 'Sáu prompt đầu trong Claude_Prompts.txt của môn: PRD qua hỏi-đáp với senior BA, context diagram drawio, business flow, đặc tả use case, ERD + traceability matrix, đặc tả UI — mỗi prompt kèm đầu ra tốt trông thế nào, cách kiểm và sửa, và cách ghi vào AI Usage Report (Template5).',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.5 · Claude_Prompts.txt, prompts #1–#6</span>
<h2>Using AI for requirements — without handing it the thinking</h2>
<p class="lead">The course folder contains the teacher's own prompt chain (<em>Claude_Prompts.txt</em>) that takes a <strong>Job Board System (JBS)</strong> from an idea to test cases in nine prompts. Prompts #1–#6 cover the requirement work of this chapter. AI is allowed — but every use must be logged in the <strong>AI Usage Report</strong> (Template5), and what you submit is <em>your</em> responsibility: the teacher asks questions about it in class and at the final presentation.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li>run prompts #1–#6 in order, feeding each output into the next;</li>
<li>recognise a good output and the typical defects of each one;</li>
<li>verify and fix the output against your PO's answers and the Template1 format;</li>
<li>log each session correctly in the AI Usage Report.</li>
</ul></div>
<p class="nhan">The chain — each prompt consumes the previous files</p>
<table>
<thead><tr><th>#</th><th>Output file</th><th>Goes into SRS section</th></tr></thead>
<tbody>
<tr><td>1</td><td>PRD (markdown) after a Q&amp;A with a "senior BA"</td><td>1.1 introduction, scope, actors</td></tr>
<tr><td>2</td><td>JBS_ContextDiagram.drawio</td><td>1.1 context diagram</td></tr>
<tr><td>3</td><td>JBS2_BizFlows.md</td><td>1.2 main business processes</td></tr>
<tr><td>4</td><td>JBS3_UCD.md</td><td>1.3 use cases, 2 UC specifications</td></tr>
<tr><td>5</td><td>JBS4_ERD.md + traceability matrix</td><td>1.5 ERD, entities</td></tr>
<tr><td>6</td><td>JBS5_SRS.md (UI specification)</td><td>1.4 screens flow / authorization, 3 functional requirements</td></tr>
</tbody>
</table>
<p class="ghi-chu">Prompts #7–#9 (MySQL schema + demo data, Technical Design Spec, test cases) belong to the design, implementation and testing chapters. The teacher's JBS uses React + Spring Boot; your team may use JSP/Servlet + MySQL — tell the AI your real stack.</p>`,
    `<span class="eyebrow">Chương 2 · Bài 2.5 · Claude_Prompts.txt, prompt #1–#6</span>
<h2>Dùng AI cho phần yêu cầu — mà không giao cho nó việc suy nghĩ</h2>
<p class="lead">Thư mục môn học có chuỗi prompt của chính thầy/cô (<em>Claude_Prompts.txt</em>) đưa một <strong>Job Board System (JBS)</strong> từ ý tưởng tới test case trong chín prompt. Prompt #1–#6 phủ phần yêu cầu của chương này. Được phép dùng AI — nhưng mọi lần dùng phải ghi vào <strong>AI Usage Report</strong> (Template5), và thứ bạn nộp là trách nhiệm <em>của bạn</em>: thầy/cô sẽ hỏi về nó trên lớp và ở buổi thuyết trình cuối.</p>
<div class="callout"><strong>Học xong bài này bạn sẽ:</strong>
<ul>
<li>chạy prompt #1–#6 theo thứ tự, lấy đầu ra của prompt trước làm đầu vào cho prompt sau;</li>
<li>nhận ra một đầu ra tốt và các lỗi điển hình của từng loại;</li>
<li>kiểm và sửa đầu ra theo câu trả lời của PO và định dạng Template1;</li>
<li>ghi đúng từng phiên làm việc vào AI Usage Report.</li>
</ul></div>
<p class="nhan">Chuỗi prompt — mỗi prompt dùng file của prompt trước</p>
<table>
<thead><tr><th>#</th><th>File đầu ra</th><th>Đưa vào mục SRS</th></tr></thead>
<tbody>
<tr><td>1</td><td>PRD (markdown) sau phần hỏi-đáp với "senior BA"</td><td>1.1 giới thiệu, phạm vi, actor</td></tr>
<tr><td>2</td><td>JBS_ContextDiagram.drawio</td><td>1.1 context diagram</td></tr>
<tr><td>3</td><td>JBS2_BizFlows.md</td><td>1.2 quy trình nghiệp vụ chính</td></tr>
<tr><td>4</td><td>JBS3_UCD.md</td><td>1.3 use case, 2 đặc tả UC</td></tr>
<tr><td>5</td><td>JBS4_ERD.md + traceability matrix</td><td>1.5 ERD, entity</td></tr>
<tr><td>6</td><td>JBS5_SRS.md (đặc tả UI)</td><td>1.4 screen flow / phân quyền, 3 yêu cầu chức năng</td></tr>
</tbody>
</table>
<p class="ghi-chu">Prompt #7–#9 (schema MySQL + dữ liệu demo, Technical Design Spec, test case) thuộc các chương thiết kế, hiện thực và kiểm thử. JBS của thầy/cô dùng React + Spring Boot; nhóm bạn có thể dùng JSP/Servlet + MySQL — hãy nói cho AI stack thật của bạn.</p>`),
    bi(`<h3>Prompt #1 — PRD through a senior-BA Q&amp;A</h3>
<pre>I want to build a Job Board System that a single company can install to promote
its news and images and to post jobs, receive applications and let candidates
follow the status of their application.
Technically: ReactJS front end, Spring Boot back end, PostgreSQL. UI style like
the FPT corporate site.
Acting as a senior BA, ask me questions to clarify the problem and requirements.
After my answers, write the PRD as a markdown document.</pre>
<p class="nhan">Why it works</p>
<ul>
<li><strong>A role</strong> (senior BA) and <strong>an order</strong>: ask first, write later — the AI must not invent the business.</li>
<li><strong>The Q&amp;A is the value</strong> — the teacher's file records 6 answers: single-tenant; Vietnamese + English; five user groups (Admin, HR/Recruiter, Hiring Manager, Candidate, anonymous visitor); pipeline Apply → CV screening → HR interview → technical interview → Offer; applications by web form with CV upload; SMTP e-mail only.</li>
</ul>
<p class="nhan">Good output looks like</p>
<ul>
<li>Goals, scope and <strong>out-of-scope</strong>; personas = your actors; functional list grouped by feature with priority; NFRs with numbers; assumptions and open questions.</li>
</ul>
<p class="nhan">Verify / fix</p>
<ol>
<li><strong>Answer with the PO's words</strong>, not guesses — take the questions to the teacher when you do not know.</li>
<li><strong>Delete invented features</strong> (payment, chat, AI matching) that nobody asked for — they inflate scope you then have to build.</li>
<li><strong>Cross-check every actor</strong> with the three questions of lesson 2.1.</li>
</ol>
<h3>Prompt #2 — context diagram (draw.io)</h3>
<pre>Help me draw the context diagram for this system and save it as a drawio file
named JBS_ContextDiagram.drawio</pre>
<ul>
<li><strong>Good output</strong> — one central process, every external entity from the PRD (the five user groups + the SMTP server), labelled flows in both directions.</li>
<li><strong>Typical defects</strong> — internal modules drawn as entities ("Database", "Auth service"); unlabelled arrows; a missing external system. Open the file in draw.io and fix it by hand — it must match SRS 1.1 rules.</li>
</ul>`,
    `<h3>Prompt #1 — PRD qua hỏi-đáp với senior BA</h3>
<pre>Tôi đang muốn xây dựng hệ thống Job Board System có thể cài đặt và sử dụng riêng
cho các doanh nghiệp qua đó quảng bá tin tức, hình ảnh của công ty và cũng là kênh
đăng các job tuyển dụng, nhận đơn ứng tuyển và cho phép ứng viên theo dõi được
trạng thái xét tuyển của mình.
Về mặt kỹ thuật tôi muốn sử dụng ReactJS ở frontend, SpringBoot ở backend,
PostgreSQL database. Về mặt giao diện thì sử dụng style giao diện như của công ty
FPT (tại trang http://fpt.com).
Với vai trò là senior BA, bạn hãy đưa ra các câu hỏi để làm rõ bài toán, yêu cầu,..
Sau khi có câu trả lời từ tôi, bạn hãy tạo cho tôi tài liệu PRD dưới định dạng markdown</pre>
<p class="nhan">Vì sao nó hiệu quả</p>
<ul>
<li><strong>Có vai trò</strong> (senior BA) và <strong>có thứ tự</strong>: hỏi trước, viết sau — AI không được tự bịa nghiệp vụ.</li>
<li><strong>Giá trị nằm ở phần hỏi-đáp</strong> — file của thầy/cô ghi 6 câu trả lời: single-tenant; tiếng Việt + Anh; năm nhóm người dùng (Admin, HR/Recruiter, Hiring Manager, Ứng viên, người vãng lai); pipeline Nộp đơn → Lọc CV → PV HR → PV chuyên môn → Offer; nộp đơn bằng form trên web kèm upload CV; chỉ tích hợp e-mail SMTP.</li>
</ul>
<p class="nhan">Đầu ra tốt trông như</p>
<ul>
<li>Mục tiêu, phạm vi và <strong>ngoài phạm vi</strong>; persona = actor của bạn; danh sách chức năng nhóm theo tính năng có độ ưu tiên; NFR có con số; giả định và câu hỏi còn mở.</li>
</ul>
<p class="nhan">Kiểm / sửa</p>
<ol>
<li><strong>Trả lời bằng lời của PO</strong>, không đoán — chưa biết thì mang câu hỏi tới thầy/cô.</li>
<li><strong>Xoá tính năng bịa</strong> (thanh toán, chat, AI matching) mà không ai yêu cầu — chúng phình phạm vi mà rồi bạn phải xây.</li>
<li><strong>Kiểm chéo mọi actor</strong> bằng ba câu hỏi ở bài 2.1.</li>
</ol>
<h3>Prompt #2 — context diagram (draw.io)</h3>
<pre>Giúp tôi vẽ context diagram cho hệ thống này và lưu dưới dạng file drawio có tên
JBS_ContextDiagram.drawio</pre>
<ul>
<li><strong>Đầu ra tốt</strong> — một tiến trình ở giữa, đủ mọi thực thể ngoài trong PRD (năm nhóm người dùng + SMTP server), luồng có nhãn theo cả hai chiều.</li>
<li><strong>Lỗi điển hình</strong> — vẽ module bên trong thành thực thể ("Database", "Auth service"); mũi tên không nhãn; thiếu một hệ thống ngoài. Mở file bằng draw.io và sửa tay — nó phải đúng quy tắc của SRS 1.1.</li>
</ul>`),
    bi(`<h3>Prompt #3 — main business flows</h3>
<pre>For the Job Board System (JBS) with the PRD attached, help me write the detailed
main business flows specification and save it to a markdown file named
JBS2_BizFlows.md</pre>
<ul>
<li><strong>Good output</strong> — one flow per business process (post a job; apply; screening pipeline; offer), each with actors/lanes, numbered steps, decisions, and the <strong>state changes</strong> (Application: Submitted → Screening → HR Interview → Technical Interview → Offer / Rejected).</li>
<li><strong>Verify</strong> — walk each flow with the PO: "who does this step, and what happens if they say no?". Every decision needs both branches.</li>
<li><strong>Turn it into SRS 1.2</strong> — redraw each flow as a swim-lane diagram (draw.io), one lane per actor.</li>
</ul>
<h3>Prompt #4 — use-case specification</h3>
<pre>For JBS with the PRD and the business flow specifications attached, help me write
the use case specification document and save it in a markdown file named
JBS3_UCD.md</pre>
<ul>
<li><strong>Good output</strong> — a UC list (ID, verb + object name, actors) and specs with trigger, pre/postconditions, numbered normal flow, alternative flows and exceptions pointing to step numbers, and BR references.</li>
<li><strong>Typical defects</strong> — functional decomposition (one UC per button); design words in steps ("calls the REST API"); generic exceptions ("system error") copied into every UC; business rules written inline instead of as IDs.</li>
<li><strong>Fix</strong> — reshape into the Template1 table; merge tiny UCs; move rules into 5.1 and messages into 5.2; keep only complex UCs as full specs (the template's own instruction).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> attach the previous files every time — prompt #4 is only as good as the PRD and flows you corrected.</p>`,
    `<h3>Prompt #3 — business flow chính</h3>
<pre>Cho hệ thống Job Board System (JBS) với PRD như trong file đính kèm, bạn hãy giúp
tôi soạn detailed main business flows specification and write those to markdown
file named JBS2_BizFlows.md</pre>
<ul>
<li><strong>Đầu ra tốt</strong> — mỗi quy trình nghiệp vụ một flow (đăng tin; ứng tuyển; pipeline xét tuyển; offer), mỗi flow có actor/làn, bước đánh số, điểm quyết định, và <strong>chuyển trạng thái</strong> (Application: Submitted → Screening → HR Interview → Technical Interview → Offer / Rejected).</li>
<li><strong>Kiểm</strong> — đi qua từng flow cùng PO: "ai làm bước này, và nếu họ nói không thì sao?". Mỗi điểm quyết định cần đủ hai nhánh.</li>
<li><strong>Chuyển thành SRS 1.2</strong> — vẽ lại mỗi flow thành swim-lane diagram (draw.io), mỗi actor một làn.</li>
</ul>
<h3>Prompt #4 — đặc tả use case</h3>
<pre>Cho hệ thống JBS với PRD và business flow specifications như trong file đính kèm,
bạn hãy giúp tôi soạn tài liệu đặc tả use case và lưu vào file markdown với tên
JBS3_UCD.md</pre>
<ul>
<li><strong>Đầu ra tốt</strong> — danh sách UC (mã, tên động từ + danh từ, actor) và đặc tả có trigger, pre/postcondition, luồng chính đánh số, luồng thay thế và exception chỉ vào số bước, cùng tham chiếu BR.</li>
<li><strong>Lỗi điển hình</strong> — phân rã chức năng (mỗi nút một UC); chữ thiết kế trong bước ("gọi REST API"); exception chung chung ("lỗi hệ thống") chép vào mọi UC; business rule viết lẫn trong bước thay vì bằng mã.</li>
<li><strong>Sửa</strong> — đổ lại vào bảng Template1; gộp các UC vụn; chuyển quy tắc sang 5.1 và message sang 5.2; chỉ giữ đặc tả đầy đủ cho UC phức tạp (đúng chỉ dẫn của mẫu).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> lần nào cũng đính kèm các file trước — prompt #4 chỉ tốt bằng PRD và flow mà bạn đã sửa.</p>`),
    bi(`<h3>Prompt #5 — entities, ERD and a traceability matrix</h3>
<pre>Help me identify the data entities of this system, then put into a markdown
document (JBS4_ERD.md): the list of entities with names and descriptions, the
relationships between entities, the attributes of each entity, and a traceability
matrix with the columns: Use case name, Actors, UC description, Related functions
(from PRD), Related business flow (from BizFlows), Related data entities.</pre>
<ul>
<li><strong>Good output</strong> — entities that are business nouns (Job, Application, Candidate, InterviewRound, Department…), relationships with cardinality, attributes with types, and a matrix row for <em>every</em> UC.</li>
<li><strong>Use the matrix as a checker</strong> — a UC with no entity, an entity used by no UC, a PRD function with no UC: each empty cell is a gap in your requirements.</li>
<li><strong>Fix</strong> — redraw the ERD in crow's-foot notation for SRS 1.5; the physical design (keys, types, normalisation) is Chapter 3.</li>
</ul>
<h3>Prompt #6 — UI specification (JBS5_SRS.md)</h3>
<p>The longest prompt asks, in English, for eight parts:</p>
<ol>
<li><strong>Design system &amp; style guide</strong> — colours, typography, spacing/grid, radius/shadow, icons, component library with variants and states</li>
<li><strong>Sitemap &amp; navigation</strong> — areas by role (Public / Candidate portal / Internal portal), top nav, sidebar, breadcrumb</li>
<li><strong>Per-screen specification</strong> — Screen ID (SCR-01), route, purpose, actors, linked UCs, layout, UI elements (name, type, content, state, display condition), interactions, validation rules, empty / loading / error states, responsive behaviour</li>
<li><strong>User flows / screen flow diagrams</strong></li>
<li><strong>Interaction &amp; micro-interactions</strong> — transitions, toasts, inline validation, modal/drawer/tooltip behaviour</li>
<li><strong>Permission-based UI rules</strong> — e.g. "Delete job" visible only to HR/Admin</li>
<li><strong>i18n notes</strong> — text expansion, date/number formats</li>
<li><strong>Accessibility</strong> — contrast, keyboard, ARIA labels, focus in modals</li>
</ol>
<p class="nhan">Map it back to Template1</p>
<ul>
<li>Part 2 + 4 → <strong>1.4.1 Screens Flow</strong>; part 6 → <strong>1.4.2 Screen Authorization</strong>; part 3 → <strong>section 3</strong> (mock-up + field table); validation rules and error texts → <strong>5.2 System Messages</strong>; parts 1, 7, 8 → <strong>section 4</strong> (usability).</li>
<li><strong>Check</strong> — every screen ID appears in your tracking Product sheet with an owner; every field has type and limits.</li>
</ul>`,
    `<h3>Prompt #5 — entity, ERD và traceability matrix</h3>
<pre>Bạn hãy giúp xác định các data entities cho hệ thống này, sau đó đưa vào tài liệu
markdown (tên JBS4_ERD.md) chứa các thông tin như: danh sách tên và mô tả mỗi
entities, quan hệ giữa các entities, các thuộc tính trong mỗi entity, và lập
traceability matrix bao gồm các cột thông tin sau: Use case name, Actors,
UC description, Related functions (from PRD), Related business flow (from BizFlows),
Related Data entities.</pre>
<ul>
<li><strong>Đầu ra tốt</strong> — entity là danh từ nghiệp vụ (Job, Application, Candidate, InterviewRound, Department…), quan hệ có bản số, thuộc tính có kiểu, và mỗi UC <em>đều</em> có một dòng trong matrix.</li>
<li><strong>Dùng matrix làm công cụ kiểm</strong> — UC không có entity, entity không UC nào dùng, chức năng PRD không có UC: mỗi ô trống là một lỗ hổng trong yêu cầu.</li>
<li><strong>Sửa</strong> — vẽ lại ERD bằng ký hiệu crow's-foot cho SRS 1.5; thiết kế vật lý (khoá, kiểu, chuẩn hoá) là việc của Chương 3.</li>
</ul>
<h3>Prompt #6 — đặc tả UI (JBS5_SRS.md)</h3>
<p>Prompt dài nhất yêu cầu (bằng tiếng Anh) tám phần:</p>
<ol>
<li><strong>Design system &amp; style guide</strong> — màu, chữ, spacing/grid, bo góc/đổ bóng, icon, thư viện component với variant và state</li>
<li><strong>Sitemap &amp; điều hướng</strong> — khu vực theo vai trò (Public / Candidate portal / Internal portal), top nav, sidebar, breadcrumb</li>
<li><strong>Đặc tả từng màn</strong> — Screen ID (SCR-01), route, mục đích, actor, UC liên quan, bố cục, UI element (tên, loại, nội dung, trạng thái, điều kiện hiện), tương tác, quy tắc validate, trạng thái rỗng / đang tải / lỗi, responsive</li>
<li><strong>User flow / screen flow diagram</strong></li>
<li><strong>Interaction &amp; micro-interaction</strong> — chuyển cảnh, toast, validate tại chỗ, hành vi modal/drawer/tooltip</li>
<li><strong>Quy tắc UI theo quyền</strong> — vd nút "Xoá job" chỉ hiện với HR/Admin</li>
<li><strong>Ghi chú i18n</strong> — chữ dài ra khi dịch, định dạng ngày/số</li>
<li><strong>Accessibility</strong> — độ tương phản, bàn phím, ARIA label, focus trong modal</li>
</ol>
<p class="nhan">Đổ ngược về Template1</p>
<ul>
<li>Phần 2 + 4 → <strong>1.4.1 Screens Flow</strong>; phần 6 → <strong>1.4.2 Screen Authorization</strong>; phần 3 → <strong>mục 3</strong> (mock-up + bảng trường); quy tắc validate và câu lỗi → <strong>5.2 System Messages</strong>; phần 1, 7, 8 → <strong>mục 4</strong> (usability).</li>
<li><strong>Kiểm</strong> — mỗi Screen ID có trong sheet Product của file tracking kèm người phụ trách; mỗi trường có kiểu và giới hạn.</li>
</ul>`),
    bi(`<h3>Logging it — the AI Usage Report (Template5)</h3>
<p>Sheet <em>0.Overview</em> holds the class, group, project and each member's role and AI tools. Then one sheet per week, one row per AI session, with these columns:</p>
<table>
<thead><tr><th>Column</th><th>Example row for prompt #4</th></tr></thead>
<tbody>
<tr><td>No.</td><td>3</td></tr>
<tr><td>SDLC Phase</td><td>Requirement</td></tr>
<tr><td>Task / Activity</td><td>Use case specification (Apply Job, Manage Applicants)</td></tr>
<tr><td>AI Tool Used</td><td>Claude</td></tr>
<tr><td>AI Output</td><td>18 UC specs in JBS3_UCD.md</td></tr>
<tr><td>Student's Validation / Modification</td><td>Kept 6 complex UCs, merged 5 tiny ones, rewrote exceptions with step numbers, moved 7 rules to BR table</td></tr>
<tr><td>Evidence / Link</td><td>Drive folder, file Group5_Session3_UCSpec.png (prompt, answer and follow-up visible)</td></tr>
<tr><td>Quantitative Measure</td><td>6 UC specs kept, 12 exceptions rewritten</td></tr>
<tr><td>Value Added (1–5)</td><td>4</td></tr>
<tr><td>Risks / Limitations</td><td>Invented a "withdraw application" flow that contradicts BR-11</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>An AI document you cannot defend.</strong> If a member cannot explain why a UC has a given exception, the teacher assumes it was not his/her work. Every member must be able to present his/her own screens' requirements without notes.</div>
<div class="pitfall co-tieu-de"><strong>Personal data in prompts.</strong> Never paste real names, phone numbers or student IDs into an AI tool — use roles and fake sample data.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Make the AI check itself.</strong> After prompt #5, ask: "List every UC in JBS3_UCD.md that has no row in the traceability matrix, every entity used by no UC, and every BR ID referenced but not defined." A second, narrow prompt that audits the first output catches more errors than asking for a "better" document — and the audit result is good evidence for the <em>Student's Validation</em> column.</div>`,
    `<h3>Ghi lại — AI Usage Report (Template5)</h3>
<p>Sheet <em>0.Overview</em> chứa lớp, nhóm, dự án, vai trò và công cụ AI của từng thành viên. Sau đó mỗi tuần một sheet, mỗi phiên AI một dòng, với các cột:</p>
<table>
<thead><tr><th>Cột</th><th>Ví dụ một dòng cho prompt #4</th></tr></thead>
<tbody>
<tr><td>No.</td><td>3</td></tr>
<tr><td>SDLC Phase</td><td>Requirement</td></tr>
<tr><td>Task / Activity</td><td>Đặc tả use case (Apply Job, Manage Applicants)</td></tr>
<tr><td>AI Tool Used</td><td>Claude</td></tr>
<tr><td>AI Output</td><td>18 đặc tả UC trong JBS3_UCD.md</td></tr>
<tr><td>Student's Validation / Modification</td><td>Giữ 6 UC phức tạp, gộp 5 UC vụn, viết lại exception kèm số bước, chuyển 7 quy tắc sang bảng BR</td></tr>
<tr><td>Evidence / Link</td><td>Thư mục Drive, file Group5_Session3_UCSpec.png (thấy rõ prompt, câu trả lời và phần hỏi tiếp)</td></tr>
<tr><td>Quantitative Measure</td><td>Giữ 6 đặc tả UC, viết lại 12 exception</td></tr>
<tr><td>Value Added (1–5)</td><td>4</td></tr>
<tr><td>Risks / Limitations</td><td>Bịa ra luồng "rút đơn ứng tuyển" trái với BR-11</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Tài liệu AI mà bạn không bảo vệ được.</strong> Nếu một thành viên không giải thích được vì sao UC có exception đó, thầy/cô sẽ coi đó không phải việc của bạn ấy. Mỗi người phải trình bày được yêu cầu các màn của mình mà không cần xem giấy.</div>
<div class="pitfall co-tieu-de"><strong>Dữ liệu cá nhân trong prompt.</strong> Không bao giờ dán tên thật, số điện thoại hay mã sinh viên vào công cụ AI — dùng vai trò và dữ liệu mẫu giả.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Bắt AI tự kiểm.</strong> Sau prompt #5, hỏi tiếp: "Liệt kê mọi UC trong JBS3_UCD.md không có dòng trong traceability matrix, mọi entity không UC nào dùng, và mọi mã BR được tham chiếu mà chưa định nghĩa." Một prompt thứ hai, hẹp, để soát đầu ra lần đầu bắt được nhiều lỗi hơn là đòi một tài liệu "tốt hơn" — và kết quả soát là bằng chứng tốt cho cột <em>Student's Validation</em>.</div>`),
    books([
      ['wiegers', 'Ch. 7 — elicitation (the BA question list), Ch. 11 — Writing excellent requirements (use it to review AI output)', 'Chương 7 — thu thập yêu cầu (bộ câu hỏi của BA), Chương 11 — Viết yêu cầu xuất sắc (dùng để soát đầu ra của AI)'],
      ['sommerville', 'Ch. 4.4 — Requirements validation (reviews, prototyping, test-case generation)', 'Mục 4.4 — Kiểm định yêu cầu (review, prototype, sinh test case)'],
    ]),
  ].join('\n'),
};

/* ─────────────── Iteration 1 checklist ─────────────── */
const LCK = {
  title: 'Iteration 1 — submission checklist (tracking, RDS/SRS, demo videos, tag)|||Iteration 1 — checklist nộp bài (tracking, RDS/SRS, video demo, tag)',
  slug: 'swp391-milestone-1-checklist',
  type: 'VIDEO',
  description: 'Danh sách kiểm trước khi nộp Iteration 1 (15%): file Project Tracking (sheet Use Cases + Product), tài liệu RDS/SRS, video demo của từng thành viên, tag GitLab và script CSDL, AI Usage Report — kèm cách chấm LOC 70% + gói nộp 30%.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Iteration 1 submission</span>
<h2>Iteration 1 submission checklist (15% of the course grade)</h2>
<p class="lead">This page used to be called "Milestone 1 — Week 3 — requirements and design". SWP391 does not work that way: Iteration 1 (6 slots of 135 minutes) is a <strong>full mini-project</strong> — each member specifies, designs and <strong>codes</strong> his/her first 3–4 screens. The requirement documents are one part of what you hand in.</p>
<p class="nhan">How Iteration 1 is graded (Student Guides)</p>
<ul>
<li><strong>LOC 70%</strong> — converted LOC of the screens you finished: complexity (Complex 240 · Medium 120 · Simple 60) × quality (High 100% · Medium 75% · Low 50%); LOC grade = converted LOC × 10 / MaxLOC.</li>
<li><strong>Package 30%</strong> — the documents and links below.</li>
<li><strong>MaxLOC for Iteration 1</strong> — 180 in the Subject Guides, 240 in the Student Guides. Follow your teacher's current guide on EduNext/CMS.</li>
</ul>
<h3>☐ 1. Project Tracking file (xlsx)</h3>
<ul>
<li>☐ <strong>Use Cases sheet</strong> — every UC of the system (not only Iteration 1), actors ticked, description filled.</li>
<li>☐ <strong>Product sheet</strong> — one row per screen/function: feature, complexity level, planned LOC, PIC (owner), plan ITER1/2/3.</li>
<li>☐ <strong>Status of this iteration's screens</strong> — progress per RDS/SDS/Coding/Test, quality level reached.</li>
<li>☐ <strong>Plan for the next iteration</strong> — which screens, who, estimated size.</li>
</ul>
<h3>☐ 2. Requirement &amp; design document (RDS, or SRS + SDS)</h3>
<ul>
<li>☐ Record of Changes has a row per member.</li>
<li>☐ Overall requirements complete: context diagram, business processes, actors, <strong>full</strong> UC list and diagrams, screens flow, screen authorization, non-UI functions, ERD.</li>
<li>☐ UC specifications for the complex UCs of Iteration-1 screens (trigger, pre/post, flows with step numbers, BR IDs).</li>
<li>☐ Screen specs for every Iteration-1 screen: mock-up, description, field table.</li>
<li>☐ Business Rules and System Messages tables contain every ID referenced.</li>
<li>☐ Design part for the same screens (class/sequence diagrams, DB tables) — Chapter 3.</li>
<li>☐ Template samples and blue guidance text removed; TOC updated.</li>
</ul>
<h3>☐ 3. Links</h3>
<ul>
<li>☐ <strong>One demo video per member</strong> showing his/her own screens running (happy path + one error case), with the screen names spoken or captioned.</li>
<li>☐ <strong>GitLab tag</strong> of the Iteration-1 source (e.g. <code>iter1</code>) on the commit you submit; the database script (create + sample data) is in the repository.</li>
<li>☐ Issues: one <em>Req</em> issue per screen, closed or labelled <em>3_Done</em>; defects found by the team labelled <em>Defect</em>.</li>
</ul>
<h3>☐ 4. Also expected by the 2026 templates</h3>
<ul>
<li>☐ AI Usage Report (Template5) — a sheet per week, a row per AI session.</li>
<li>☐ Weekly Report (Template6) — as your teacher requires.</li>
</ul>
<div class="callout ok">Graded on <strong>consistency</strong>: the same UC IDs and screen names in the tracking file, the document, the GitLab issues and the running product. A reviewer opens a screen from your video and looks for it in all four places.</div>
<div class="pitfall co-tieu-de"><strong>Leakage after submission.</strong> A bug the teacher finds after you submit is labelled <em>Leakage</em> and lowers the quality factor of that screen — test your screens against their own UC exceptions before tagging.</div>`,
    `<span class="eyebrow">Chương 2 · Nộp Iteration 1</span>
<h2>Checklist nộp Iteration 1 (15% điểm môn)</h2>
<p class="lead">Trang này trước đây tên là "Milestone 1 — Tuần 3 — yêu cầu và thiết kế". SWP391 không chạy như vậy: Iteration 1 (6 slot 135 phút) là <strong>một dự án nhỏ trọn vẹn</strong> — mỗi thành viên đặc tả, thiết kế và <strong>code</strong> 3–4 màn đầu tiên của mình. Tài liệu yêu cầu chỉ là một phần của thứ bạn nộp.</p>
<p class="nhan">Iteration 1 được chấm thế nào (Student Guides)</p>
<ul>
<li><strong>LOC 70%</strong> — LOC quy đổi của các màn đã xong: độ phức tạp (Complex 240 · Medium 120 · Simple 60) × chất lượng (High 100% · Medium 75% · Low 50%); điểm LOC = LOC quy đổi × 10 / MaxLOC.</li>
<li><strong>Gói nộp 30%</strong> — các tài liệu và link bên dưới.</li>
<li><strong>MaxLOC của Iteration 1</strong> — 180 theo Subject Guides, 240 theo Student Guides. Làm theo hướng dẫn hiện hành của thầy/cô trên EduNext/CMS.</li>
</ul>
<h3>☐ 1. File Project Tracking (xlsx)</h3>
<ul>
<li>☐ <strong>Sheet Use Cases</strong> — mọi UC của hệ thống (không chỉ Iteration 1), tick actor, có mô tả.</li>
<li>☐ <strong>Sheet Product</strong> — mỗi màn/chức năng một dòng: feature, mức phức tạp, LOC kế hoạch, PIC (người phụ trách), kế hoạch ITER1/2/3.</li>
<li>☐ <strong>Trạng thái các màn của iteration này</strong> — tiến độ RDS/SDS/Coding/Test, mức chất lượng đạt được.</li>
<li>☐ <strong>Kế hoạch iteration sau</strong> — màn nào, ai làm, cỡ ước lượng.</li>
</ul>
<h3>☐ 2. Tài liệu yêu cầu &amp; thiết kế (RDS, hoặc SRS + SDS)</h3>
<ul>
<li>☐ Record of Changes có dòng của từng thành viên.</li>
<li>☐ Yêu cầu tổng thể đầy đủ: context diagram, quy trình nghiệp vụ, actor, danh sách UC <strong>đầy đủ</strong> và sơ đồ, screen flow, phân quyền màn hình, non-UI function, ERD.</li>
<li>☐ Đặc tả UC cho các UC phức tạp của màn Iteration 1 (trigger, pre/post, luồng có số bước, mã BR).</li>
<li>☐ Đặc tả màn cho mọi màn Iteration 1: mock-up, mô tả, bảng trường.</li>
<li>☐ Bảng Business Rules và System Messages chứa mọi mã được tham chiếu.</li>
<li>☐ Phần thiết kế cho cùng các màn đó (class/sequence diagram, bảng CSDL) — Chương 3.</li>
<li>☐ Đã xoá ví dụ của mẫu và chữ hướng dẫn màu xanh; đã cập nhật mục lục.</li>
</ul>
<h3>☐ 3. Các link</h3>
<ul>
<li>☐ <strong>Mỗi thành viên một video demo</strong> cho thấy các màn của chính mình chạy (luồng đúng + một ca lỗi), có đọc hoặc chú thích tên màn.</li>
<li>☐ <strong>Tag GitLab</strong> của mã nguồn Iteration 1 (vd <code>iter1</code>) trên đúng commit bạn nộp; script CSDL (tạo + dữ liệu mẫu) nằm trong repository.</li>
<li>☐ Issue: mỗi màn một issue <em>Req</em>, đã đóng hoặc gắn <em>3_Done</em>; lỗi nhóm tự tìm gắn <em>Defect</em>.</li>
</ul>
<h3>☐ 4. Mẫu 2026 còn yêu cầu</h3>
<ul>
<li>☐ AI Usage Report (Template5) — mỗi tuần một sheet, mỗi phiên AI một dòng.</li>
<li>☐ Weekly Report (Template6) — theo yêu cầu của thầy/cô.</li>
</ul>
<div class="callout ok">Chấm theo <strong>tính nhất quán</strong>: cùng mã UC và tên màn trong file tracking, trong tài liệu, trong issue GitLab và trong sản phẩm đang chạy. Người chấm mở một màn trong video của bạn và tìm nó ở cả bốn nơi.</div>
<div class="pitfall co-tieu-de"><strong>Leakage sau khi nộp.</strong> Lỗi thầy/cô tìm ra sau khi bạn nộp bị gắn <em>Leakage</em> và làm giảm hệ số chất lượng của màn đó — hãy test các màn theo chính các exception trong UC của chúng trước khi gắn tag.</div>`),
  ].join('\n'),
};

/* ─────────────── Quiz 2 ─────────────── */
const QZ = {
  title: 'Quiz 2 — Requirement analysis & the SRS|||Quiz 2 — Phân tích yêu cầu & SRS',
  slug: 'swp391-quiz-2',
  type: 'QUIZ',
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      { question: "According to Slide2, requirements modeling consists of which two activities?|||Theo Slide2, requirements modeling gồm hai hoạt động nào?",
        options: ["Requirements analysis and requirements specification|||Phân tích yêu cầu và đặc tả yêu cầu", "Coding and testing|||Lập trình và kiểm thử", "Database design and UI design|||Thiết kế CSDL và thiết kế UI", "Deployment and maintenance|||Triển khai và bảo trì"],
        correctIndex: 0, explanation: "Page 3: requirements modeling = requirements analysis + requirements specification.|||Trang 3: requirements modeling = phân tích yêu cầu + đặc tả yêu cầu." },
      { question: "When defining requirements, the system should be viewed as...|||Khi xác định yêu cầu, hệ thống nên được nhìn như...",
        options: ["a white box showing its classes|||một hộp trắng thấy rõ các class", "a black box: only external characteristics are considered|||một hộp đen: chỉ xét đặc điểm bên ngoài", "a set of database tables|||một tập các bảng CSDL", "a list of servlets|||một danh sách servlet"],
        correctIndex: 1, explanation: "Page 3: the system is a black box; only its external characteristics count. Internal structure is design.|||Trang 3: hệ thống là hộp đen; chỉ xét đặc điểm bên ngoài. Cấu trúc bên trong là thiết kế." },
      { question: "Which statement is a NON-functional requirement?|||Câu nào là yêu cầu PHI chức năng?",
        options: ["A freelancer can apply for a job post|||Freelancer ứng tuyển được một tin tuyển dụng", "Admin can suspend a recruiter account|||Admin khoá được tài khoản recruiter", "The job list page loads in at most 2 seconds with 1,000 posts|||Trang danh sách job tải tối đa 2 giây với 1.000 tin", "A recruiter can create a job post|||Recruiter tạo được tin tuyển dụng"],
        correctIndex: 2, explanation: "A non-functional requirement is a quality attribute or quality-of-service goal (page 5) — here performance.|||Yêu cầu phi chức năng là thuộc tính chất lượng hay mục tiêu chất lượng dịch vụ (trang 5) — ở đây là hiệu năng." },
      { question: "What best describes an actor?|||Câu nào mô tả đúng nhất một actor?",
        options: ["A specific person who uses the system|||Một người cụ thể dùng hệ thống", "A role played by all users of the same type, outside the system|||Vai trò của mọi người dùng cùng loại, nằm ngoài hệ thống", "A table in the database|||Một bảng trong CSDL", "A module inside the system|||Một module bên trong hệ thống"],
        correctIndex: 1, explanation: "Page 7: a user is an individual; an actor is the role played by all users of the same type, and actors are outside the system.|||Trang 7: user là một cá nhân; actor là vai trò của mọi user cùng loại, và actor nằm ngoài hệ thống." },
      { question: "Which can be an actor of a web job portal?|||Cái nào có thể là actor của một cổng việc làm?",
        options: ["The application's own database|||CSDL của chính ứng dụng", "The DAO layer|||Tầng DAO", "An external e-mail (SMTP) service|||Dịch vụ e-mail (SMTP) bên ngoài", "The login servlet|||Servlet đăng nhập"],
        correctIndex: 2, explanation: "Actors can be external systems, I/O devices or timers (page 7). The database, DAO and servlets are inside the system.|||Actor có thể là hệ thống ngoài, thiết bị vào/ra hay timer (trang 7). CSDL, DAO và servlet nằm trong hệ thống." },
      { question: "Which question is one of the three on page 9 for identifying actors?|||Câu nào thuộc ba câu hỏi ở trang 9 để tìm actor?",
        options: ["Which programming language will we use?|||Ta sẽ dùng ngôn ngữ lập trình nào?", "Who or what is notified when something occurs within the system?|||Ai hoặc cái gì được thông báo khi có chuyện xảy ra trong hệ thống?", "How many tables does the database have?|||CSDL có bao nhiêu bảng?", "Which screen is the most complex?|||Màn hình nào phức tạp nhất?"],
        correctIndex: 1, explanation: "The three questions: who is notified, who provides information or services, who helps the system respond and complete a task.|||Ba câu hỏi: ai được thông báo, ai cung cấp thông tin hay dịch vụ, ai giúp hệ thống phản hồi và hoàn tất công việc." },
      { question: "In a use case diagram, the «include» relationship means...|||Trong sơ đồ use case, quan hệ «include» nghĩa là...",
        options: ["optional behaviour under a condition|||hành vi tuỳ chọn theo điều kiện", "mandatory behaviour always performed by the base use case|||hành vi bắt buộc luôn được UC gốc thực hiện", "inheritance between actors|||kế thừa giữa các actor", "a database join|||một phép join CSDL"],
        correctIndex: 1, explanation: "Page 11: Include = mandatory, Extend = optional. Generalization is inheritance.|||Trang 11: Include = bắt buộc, Extend = tuỳ chọn. Generalization là kế thừa." },
      { question: "'Reset Password' is only used when a user cannot log in. Its relationship to 'Login System' is best modelled as...|||'Reset Password' chỉ dùng khi người dùng không đăng nhập được. Quan hệ của nó với 'Login System' nên mô hình là...",
        options: ["«include»|||«include»", "«extend»|||«extend»", "generalization|||generalization", "association with an actor|||association với actor"],
        correctIndex: 1, explanation: "Optional behaviour triggered by a condition is «extend», as in the SRS sample diagram (Reset Password extends Login).|||Hành vi tuỳ chọn theo điều kiện là «extend», như sơ đồ mẫu trong SRS (Reset Password extend Login)." },
      { question: "Who is the primary actor of a use case?|||Primary actor của một use case là ai?",
        options: ["The actor that initiates it and gains value from it|||Actor khởi động nó và nhận giá trị từ nó", "Any actor that is notified at the end|||Bất kỳ actor nào được báo khi kết thúc", "The administrator, always|||Luôn luôn là quản trị viên", "The database|||CSDL"],
        correctIndex: 0, explanation: "Page 12: the primary actor initiates the use case; secondary actors participate.|||Trang 12: primary actor khởi động use case; secondary actor tham gia." },
      { question: "Why must 'Withdraw Funds', 'Query Account' and 'Transfer Funds' be separate use cases?|||Vì sao 'Withdraw Funds', 'Query Account' và 'Transfer Funds' phải là các use case riêng?",
        options: ["They use different screens|||Chúng dùng màn hình khác nhau", "They are distinct functions with different useful results for the customer|||Chúng là chức năng riêng với kết quả hữu ích khác nhau cho khách", "The ATM has three buttons|||ATM có ba nút", "Each needs its own database|||Mỗi cái cần CSDL riêng"],
        correctIndex: 1, explanation: "Page 15: distinct functions initiated by the customer with different useful results are modelled as separate UCs.|||Trang 15: các chức năng riêng do khách khởi động với kết quả hữu ích khác nhau được mô hình thành UC riêng." },
      { question: "Splitting 'Create Job Post' into 'Enter title', 'Choose category', 'Click Save' use cases is an example of...|||Tách 'Create Job Post' thành các use case 'Enter title', 'Choose category', 'Click Save' là ví dụ của...",
        options: ["good modularity|||tính module tốt", "functional decomposition, which should be avoided|||phân rã chức năng, cần tránh", "generalization|||generalization", "a business rule|||một business rule"],
        correctIndex: 1, explanation: "Page 13: avoid functional decomposition — many small UCs for single functions instead of one sequence giving a useful result.|||Trang 13: tránh phân rã chức năng — nhiều UC nhỏ cho từng hàm thay vì một chuỗi mang lại kết quả hữu ích." },
      { question: "Which use case name follows the rule on page 14?|||Tên use case nào đúng quy tắc ở trang 14?",
        options: ["Job Post|||Job Post", "Freelancer Function|||Freelancer Function", "Apply Job|||Apply Job", "Admin Page|||Admin Page"],
        correctIndex: 2, explanation: "Use case names are always a verb followed by an object.|||Tên use case luôn là động từ theo sau bởi danh từ." },
      { question: "In a use case specification, the Trigger is...|||Trong đặc tả use case, Trigger là...",
        options: ["the state after the use case ends successfully|||trạng thái sau khi use case kết thúc thành công", "the business event, system event or user action that initiates the use case|||sự kiện nghiệp vụ, sự kiện hệ thống hay thao tác người dùng khởi động use case", "an error condition|||một tình huống lỗi", "a list of business rule IDs|||danh sách mã business rule"],
        correctIndex: 1, explanation: "Page 17: the trigger initiates the use case and tells the system to start testing its preconditions.|||Trang 17: trigger khởi động use case và báo hệ thống bắt đầu kiểm tra precondition." },
      { question: "Which is a correct postcondition for 'Apply Job'?|||Postcondition nào đúng cho 'Apply Job'?",
        options: ["The user is logged in|||Người dùng đã đăng nhập", "The Apply button is visible|||Nút Apply đang hiện", "A JobApply record with status Pending exists for this freelancer and post|||Tồn tại bản ghi JobApply trạng thái Pending cho freelancer và tin này", "The system may crash|||Hệ thống có thể bị lỗi"],
        correctIndex: 2, explanation: "A postcondition describes the state of the system at the successful end of the use case. 'Logged in' is a precondition.|||Postcondition mô tả trạng thái hệ thống khi use case kết thúc thành công. 'Đã đăng nhập' là precondition." },
      { question: "What should the Business Rules field of a use case contain?|||Trường Business Rules của một use case nên chứa gì?",
        options: ["The full text of every rule|||Toàn văn mọi quy tắc", "Only the rule identifiers, e.g. BR-05, BR-11|||Chỉ mã quy tắc, vd BR-05, BR-11", "The SQL that enforces the rule|||Câu SQL thực thi quy tắc", "Nothing, rules are not written|||Không gì cả, quy tắc không được viết ra"],
        correctIndex: 1, explanation: "Page 17: list only the identifiers so the reader can find the rule text in another repository (SRS 5.1).|||Trang 17: chỉ ghi mã để người đọc tra nội dung ở kho khác (SRS 5.1)." },
      { question: "'Every job post belongs to exactly one category' is which class of business rule?|||'Mỗi tin tuyển dụng thuộc đúng một danh mục' là loại business rule nào?",
        options: ["Fact|||Fact", "Action enabler|||Action enabler", "Computation|||Computation", "Inference|||Inference"],
        correctIndex: 0, explanation: "A fact is a statement true about the business that links business terms (page 21).|||Fact là mệnh đề đúng về nghiệp vụ, nối các khái niệm nghiệp vụ (trang 21)." },
      { question: "'If an application changes status, e-mail the freelancer' is which class?|||'Nếu đơn ứng tuyển đổi trạng thái thì gửi e-mail cho freelancer' là loại nào?",
        options: ["Fact|||Fact", "Constraint|||Constraint", "Action enabler|||Action enabler", "Computation|||Computation"],
        correctIndex: 2, explanation: "An action enabler triggers an activity when specific conditions are true (page 23).|||Action enabler kích hoạt một hoạt động khi điều kiện cụ thể đúng (trang 23)." },
      { question: "'If a payment is not received within 30 days after it is due, the account is delinquent' is...|||'Nếu không nhận được tiền trong 30 ngày sau hạn thì tài khoản bị coi là delinquent' là...",
        options: ["an action enabler, because it uses if/then|||action enabler, vì dùng nếu/thì", "an inference: the 'then' part gives new knowledge, not an action|||inference: vế 'thì' cho hiểu biết mới, không phải hành động", "a computation|||computation", "a non-functional requirement|||yêu cầu phi chức năng"],
        correctIndex: 1, explanation: "Page 24: inferences use if/then too, but their 'then' clause provides knowledge (a derived fact), not an action.|||Trang 24: inference cũng dùng nếu/thì, nhưng vế 'thì' cho một hiểu biết (fact suy ra), không phải hành động." },
      { question: "'Unit price is reduced by 10% for 6 to 10 units' belongs to...|||'Đơn giá giảm 10% cho 6 tới 10 sản phẩm' thuộc...",
        options: ["Computations|||Computations", "Facts|||Facts", "Constraints|||Constraints", "Inferences|||Inferences"],
        correctIndex: 0, explanation: "Computations transform existing data into new data with a formula (page 25).|||Computation biến dữ liệu có sẵn thành dữ liệu mới bằng công thức (trang 25)." },
      { question: "A wireframe built to clarify requirements and then discarded is a...|||Một wireframe dựng để làm rõ yêu cầu rồi bỏ đi là...",
        options: ["throwaway prototype|||prototype throwaway", "evolutionary prototype|||prototype evolutionary", "proof-of-concept that becomes the product|||proof-of-concept trở thành sản phẩm", "system test|||system test"],
        correctIndex: 0, explanation: "Page 27: a wireframe is a particular approach to throwaway prototyping.|||Trang 27: wireframe là một cách làm prototype throwaway." },
      { question: "According to Template1 section 2, which use cases need a full specification?|||Theo mục 2 của Template1, use case nào cần đặc tả đầy đủ?",
        options: ["Every use case, including simple CRUD|||Mọi use case, kể cả CRUD đơn giản", "Only complex UCs involved in the main workflows|||Chỉ UC phức tạp nằm trong các luồng chính", "Only the login use case|||Chỉ use case đăng nhập", "None; screens are enough|||Không cái nào; màn hình là đủ"],
        correctIndex: 1, explanation: "Template1: specify complex UCs of the main business processes; simple CRUD or viewing UCs are described in the Functional Requirements part.|||Template1: đặc tả UC phức tạp của quy trình chính; UC CRUD hay xem dữ liệu đơn giản được mô tả ở phần Functional Requirements." },
      { question: "In the SRS Record of Changes, what does the 'A*, M, D' column mean?|||Trong Record of Changes của SRS, cột 'A*, M, D' nghĩa là gì?",
        options: ["Actor, Model, Diagram|||Actor, Model, Diagram", "Added, Modified, Deleted|||Added, Modified, Deleted", "Approved, Merged, Done|||Approved, Merged, Done", "Admin, Member, Developer|||Admin, Member, Developer"],
        correctIndex: 1, explanation: "The template footnote: A - Added, M - Modified, D - Deleted.|||Chú thích của mẫu: A - Added, M - Modified, D - Deleted." },
      { question: "Which SRS section lists batch/cron jobs, services and APIs that have no screen?|||Mục SRS nào liệt kê batch/cron job, service và API không có màn hình?",
        options: ["1.4.1 Screens Flow|||1.4.1 Screens Flow", "1.4.3 Non-UI Functions|||1.4.3 Non-UI Functions", "5.2 System Messages|||5.2 System Messages", "1.1 Context Diagram|||1.1 Context Diagram"],
        correctIndex: 1, explanation: "Section 1.4.3 describes the non-screen system functions: batch/cron jobs, services, APIs.|||Mục 1.4.3 mô tả các chức năng không có màn hình: batch/cron job, service, API." },
      { question: "In SWP391, how often is requirement analysis done?|||Ở SWP391, phân tích yêu cầu được làm bao nhiêu lần?",
        options: ["Once, in Milestone 1 only|||Một lần, chỉ ở Milestone 1", "In every iteration: each member specifies the screens he/she builds in that iteration|||Ở mọi iteration: mỗi thành viên đặc tả các màn mình xây trong iteration đó", "Only by the team leader at the end|||Chỉ leader làm vào cuối kỳ", "Never; the teacher provides the SRS|||Không bao giờ; thầy/cô đưa sẵn SRS"],
        correctIndex: 1, explanation: "The course has 3 iterations; in each, every member does requirement, design and code for his/her own screens, and the document is extended and corrected.|||Môn có 3 iteration; ở mỗi iteration, mọi thành viên làm yêu cầu, thiết kế và code cho màn của mình, và tài liệu được viết tiếp, sửa lại." },
      { question: "In the AI Usage Report (Template5), what goes in 'Student's Validation / Modification'?|||Trong AI Usage Report (Template5), cột 'Student's Validation / Modification' ghi gì?",
        options: ["The AI tool's name|||Tên công cụ AI", "How you checked or changed the AI output, e.g. kept 6 UCs, rewrote 12 exceptions|||Bạn đã kiểm hay sửa đầu ra của AI thế nào, vd giữ 6 UC, viết lại 12 exception", "The prompt text only|||Chỉ nội dung prompt", "Your self-assessed grade|||Điểm tự chấm"],
        correctIndex: 1, explanation: "Template5 instruction: describe how you validated or modified the AI output; evidence and value score go in other columns.|||Hướng dẫn của Template5: mô tả bạn đã kiểm hay sửa đầu ra AI ra sao; bằng chứng và điểm giá trị ghi ở cột khác." },
    ],
  },
};

export default {
  title: 'Chapter 2 — Requirement analysis & the SRS (done again in every iteration)|||Chương 2 — Phân tích yêu cầu & tài liệu SRS (làm lại trong mỗi iteration)',
  description: 'Phân tích và đặc tả yêu cầu theo đúng slide Software Requirement và mẫu SRS của môn: actor, use case, đặc tả use case, business rule, prototype, SRS từng mục, dùng AI làm BA — việc mỗi thành viên làm lại cho màn hình của mình ở cả 3 iteration.',
  lessons: [
    L21,
    L22,
    L23,
    L24,
    L25,
    LCK,
    QZ,
  ],
};
