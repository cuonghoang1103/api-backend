// content/academy/swp391/ch3.mjs
/**
 * SWP391 · Chapter 3 — System & database design (done again in EVERY iteration: each member
 * designs the screens/functions he or she codes in that iteration).
 * This file owns the SYSTEM DESIGN part + the chapter quiz. The DATABASE DESIGN lessons live in
 * ./ch3db.mjs (another module, default export { title, lessons }) and are appended after ours.
 * Sources: Slide3 System Design (55 pages, deck 'g-design' — Gomaa's COMET method),
 * Template2 SDS Document (9 rendered pages, deck 't-sds'), Slide4 Database Design text (quiz),
 * Claude_Prompts.txt prompt #8 (Technical Design Spec), and the G5 "Job IT for Freelancer"
 * RDS + SQL script (worked example — no personal data: no names, IDs, e-mails, usernames).
 *   3.1 Design in SWP391, OO concepts & OO methods      g-design 1–11
 *   3.2 Analysis modelling: context, entities, objects  g-design 12–23
 *   3.3 Software architecture: MVC, layered, client–server, packages (+ REST API design)
 *                                                       g-design 24–35   slug swp391-3-2-mvc-api (kept)
 *   3.4 Object-oriented design: classes, operations, detailed design, inheritance, polymorphism
 *                                                       g-design 36–55
 *   3.5 Filling the SDS — worked "Apply job" design     t-sds 1–9
 *   … database-design lessons from ch3db.mjs …
 *   Quiz 3 (system + database design)                    slug swp391-quiz-3 (kept)
 * The section title is kept EXACT (it is the anchor), so lesson order inside is free.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';
import db from './ch3db.mjs';

const G = 'g-design';
const S = 't-sds';
// Questions are written with the right answer first; each one is rotated by a different amount so the key is spread over A–D.
let qn = 0;
const q = (question, options, correctIndex, explanation) => {
  const k = (qn++ * 3 + 1) % options.length;
  const opts = options.map((_, i) => options[(i + k) % options.length]);
  return { question, options: opts, correctIndex: (correctIndex - k + options.length) % options.length, explanation };
};

/* ─────────────── 3.1 Design in SWP391, OO concepts & methods (g-design 1–11) ─────────────── */
const R31 = [
  [1, 'Title — Software Design Guides',
    `<p class="y-chinh">🎯 The teacher's guide to <strong>how your team designs the system</strong> before (and while) coding it.</p>
<p class="nhan">What this deck is</p>
<ul>
<li><strong>Source</strong> — it condenses Hassan Gomaa's <em>Software Modeling and Design</em> (the <strong>COMET</strong> method: Collaborative Object Modeling and architectural design mEThod).</li>
<li><strong>Examples</strong> — most figures are Gomaa's ATM / Banking System and an online-shopping system; you must translate each idea to your own web system.</li>
</ul>
<p class="nhan">Where design sits in SWP391</p>
<ul>
<li><strong>Every iteration</strong> — each member does requirement + <em>design</em> + code for his/her 3–4 screens (Iter1 15%, Iter2 20%, Iter3 25%).</li>
<li><strong>Where it is written</strong> — the design part of the RDS document (2026 templates: the separate <strong>SDS</strong>, Template2 — Lesson 3.5).</li>
<li><strong>How it is graded</strong> — the document is part of the "submitted package" (30% of each iteration) and <strong>design = 20%</strong> of the Final Presentation mark.</li>
</ul>`,
    `<p class="y-chinh">🎯 Hướng dẫn của thầy/cô về <strong>cách nhóm thiết kế hệ thống</strong> trước (và trong khi) code.</p>
<p class="nhan">Bộ slide này là gì</p>
<ul>
<li><strong>Nguồn</strong> — tóm tắt sách <em>Software Modeling and Design</em> của Hassan Gomaa (phương pháp <strong>COMET</strong>: Collaborative Object Modeling and architectural design mEThod).</li>
<li><strong>Ví dụ</strong> — phần lớn hình là hệ thống ATM / Banking và hệ thống bán hàng online của Gomaa; bạn phải tự "dịch" từng ý sang web system của nhóm.</li>
</ul>
<p class="nhan">Thiết kế nằm ở đâu trong SWP391</p>
<ul>
<li><strong>Mỗi iteration</strong> — mỗi thành viên làm requirement + <em>design</em> + code cho 3–4 màn hình của mình (Iter1 15%, Iter2 20%, Iter3 25%).</li>
<li><strong>Viết ở đâu</strong> — phần thiết kế của tài liệu RDS (template 2026: tách riêng <strong>SDS</strong>, Template2 — Bài 3.5).</li>
<li><strong>Chấm thế nào</strong> — tài liệu thuộc "submitted package" (30% mỗi iteration) và <strong>design = 20%</strong> điểm Final Presentation.</li>
</ul>`],
  [2, 'Agenda — four parts',
    `<p class="y-chinh">🎯 The deck has four parts — they are also the order in which a design is built.</p>
<ol>
<li><strong>General Introduction</strong> (slides 3–11) — why model, the design process, OO concepts.</li>
<li><strong>Analysis Modeling</strong> (12–23) — context, entity classes, object categories, communication diagrams: <em>what</em> the system must handle.</li>
<li><strong>Software Architecture</strong> (24–35) — MVC, layered, client–server, packages: the <em>big structure</em>.</li>
<li><strong>Object Oriented Design</strong> (36–54) — classes, operations, detailed design, inheritance: the <em>code-level</em> design.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> analysis = the problem, architecture = the skeleton, OO design = the organs. The database design (Slide4) maps the entity classes of part 2 to tables.</p>`,
    `<p class="y-chinh">🎯 Bộ slide có bốn phần — cũng chính là thứ tự dựng một bản thiết kế.</p>
<ol>
<li><strong>General Introduction</strong> (slide 3–11) — vì sao phải mô hình hoá, quy trình thiết kế, khái niệm OO.</li>
<li><strong>Analysis Modeling</strong> (12–23) — context, entity class, phân loại đối tượng, communication diagram: hệ thống phải xử lý <em>cái gì</em>.</li>
<li><strong>Software Architecture</strong> (24–35) — MVC, phân tầng, client–server, package: <em>bộ khung lớn</em>.</li>
<li><strong>Object Oriented Design</strong> (36–54) — lớp, operation, thiết kế chi tiết, kế thừa: thiết kế <em>mức code</em>.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phân tích = bài toán, kiến trúc = bộ xương, thiết kế OO = các cơ quan. Thiết kế CSDL (Slide4) ánh xạ entity class của phần 2 thành bảng.</p>`],
  [3, 'General Introduction — modelling; design vs implementation',
    `<p class="y-chinh">🎯 Model first, then code: a design is the plan the code must follow.</p>
<p class="nhan">Modelling</p>
<ul>
<li><strong>Before coding</strong> — models are built and analysed first, then used to <em>direct</em> the implementation.</li>
<li><strong>UML</strong> — a graphical language that lets the whole team understand and discuss different <em>views</em> (use case, class, sequence, state…).</li>
</ul>
<p class="nhan">Two different activities</p>
<ul>
<li><strong>Software design</strong> — a <em>creative</em> activity: identify components and their relationships from the customer's requirements.</li>
<li><strong>Implementation</strong> — realising that design as a program.</li>
</ul>
<p class="nhan">For your team</p>
<p>The teacher is your customer. If a screen's class/sequence diagram in the RDS/SDS does not match the code in the GitLab tag, that is a design defect — reviewers compare them in the Final Presentation.</p>
<div class="pitfall co-tieu-de"><strong>Drawing diagrams after coding.</strong> Reverse-generating diagrams from finished code the night before submission gives pictures nobody used — and they usually show controller code full of SQL. Draw at least the class + sequence diagram of each screen before you code it.</div>`,
    `<p class="y-chinh">🎯 Mô hình trước, code sau: bản thiết kế là kế hoạch mà code phải đi theo.</p>
<p class="nhan">Mô hình hoá</p>
<ul>
<li><strong>Trước khi code</strong> — mô hình được dựng và phân tích trước, rồi dùng để <em>dẫn dắt</em> việc hiện thực.</li>
<li><strong>UML</strong> — ngôn ngữ đồ hoạ giúp cả nhóm hiểu và trao đổi các <em>góc nhìn</em> khác nhau (use case, class, sequence, state…).</li>
</ul>
<p class="nhan">Hai hoạt động khác nhau</p>
<ul>
<li><strong>Software design</strong> — hoạt động <em>sáng tạo</em>: xác định các thành phần và quan hệ giữa chúng từ yêu cầu của khách hàng.</li>
<li><strong>Implementation</strong> — biến bản thiết kế đó thành chương trình.</li>
</ul>
<p class="nhan">Với nhóm bạn</p>
<p>Thầy/cô là khách hàng. Nếu class/sequence diagram của một màn hình trong RDS/SDS không khớp với code trong GitLab tag, đó là lỗi thiết kế — hội đồng Final Presentation sẽ đối chiếu.</p>
<div class="pitfall co-tieu-de"><strong>Vẽ diagram sau khi code xong.</strong> Sinh ngược diagram từ code đã xong vào đêm trước hạn nộp cho ra những bức hình không ai dùng — và thường lộ ra controller đầy SQL. Hãy vẽ ít nhất class + sequence diagram của từng màn hình trước khi code nó.</div>`],
  [4, 'Incremental development model — evolutionary prototyping',
    `<p class="y-chinh">🎯 COMET builds the system in increments: each increment goes through design, construction, integration and back to requirements.</p>
<p class="nhan">Read the boxes in order</p>
<ol>
<li><strong>Requirements analysis &amp; specification</strong></li>
<li><strong>Architectural design</strong> — done once early, refined later</li>
<li><strong>Incremental component construction</strong> — build a slice</li>
<li><strong>Incremental system integration</strong> — plug it into what exists</li>
<li><strong>Evolutionary prototyping</strong> — show it; feedback flows back to requirements, architecture or construction</li>
<li><strong>System &amp; acceptance testing</strong> — at the end</li>
</ol>
<p class="nhan">This IS the SWP391 rhythm</p>
<ul>
<li><strong>3 iterations</strong> = 3 increments. In each one every member specifies, designs and codes his/her screens.</li>
<li><strong>The feedback arrows</strong> = the teacher's review after each iteration: issues come back as <em>Leakage</em> / <em>Q&amp;A</em> labels on GitLab, and you update the RDS (Record of Changes) in the next iteration.</li>
</ul>`,
    `<p class="y-chinh">🎯 COMET xây hệ thống theo từng phần tăng dần: mỗi phần đi qua thiết kế, xây dựng, tích hợp rồi quay lại yêu cầu.</p>
<p class="nhan">Đọc các ô theo thứ tự</p>
<ol>
<li><strong>Requirements analysis &amp; specification</strong> — phân tích &amp; đặc tả yêu cầu</li>
<li><strong>Architectural design</strong> — làm một lần từ sớm, tinh chỉnh dần</li>
<li><strong>Incremental component construction</strong> — xây một lát cắt</li>
<li><strong>Incremental system integration</strong> — ghép vào phần đã có</li>
<li><strong>Evolutionary prototyping</strong> — trình diễn; phản hồi quay về yêu cầu, kiến trúc hoặc xây dựng</li>
<li><strong>System &amp; acceptance testing</strong> — ở cuối</li>
</ol>
<p class="nhan">Đây CHÍNH là nhịp của SWP391</p>
<ul>
<li><strong>3 iteration</strong> = 3 phần tăng dần. Trong mỗi iteration, mọi thành viên đặc tả, thiết kế và code các màn hình của mình.</li>
<li><strong>Mũi tên phản hồi</strong> = buổi review của thầy/cô sau mỗi iteration: lỗi quay về dưới nhãn <em>Leakage</em> / <em>Q&amp;A</em> trên GitLab, và bạn cập nhật RDS (Record of Changes) ở iteration sau.</li>
</ul>`],
  [5, 'General model of the design process — inputs, activities, outputs',
    `<p class="y-chinh">🎯 Design turns three inputs into four specifications through four linked activities.</p>
<p class="nhan">Design inputs</p>
<ul>
<li><strong>Platform information</strong> — Java web (JSP/Servlet, JDK, Tomcat, MySQL 8) or .NET/SQL Server.</li>
<li><strong>Requirements specification</strong> — your SRS: use cases, screens, business rules.</li>
<li><strong>Data description</strong> — the entities and fields the system stores.</li>
</ul>
<p class="nhan">Design activities (speaker notes)</p>
<ul>
<li><strong>Architectural design</strong> — overall structure: sub-systems/modules, their relationships and distribution.</li>
<li><strong>Interface design</strong> — the interfaces <em>between components</em> (method signatures, URLs/APIs), not only the GUI.</li>
<li><strong>Component design</strong> — how each component works inside.</li>
<li><strong>Database design</strong> — data structures and how they are stored (Slide4).</li>
</ul>
<p class="nhan">Design outputs → SDS sections</p>
<table><thead><tr><th>Output</th><th>SDS (Template2)</th></tr></thead><tbody>
<tr><td>System architecture</td><td>1.1 Software Architecture, 1.2 Package Diagram</td></tr>
<tr><td>Database specification</td><td>1.3 Database Design</td></tr>
<tr><td>Interface + component specification</td><td>3. Detailed Design (class + sequence diagrams per feature)</td></tr>
</tbody></table>`,
    `<p class="y-chinh">🎯 Thiết kế biến ba đầu vào thành bốn bản đặc tả thông qua bốn hoạt động liên kết với nhau.</p>
<p class="nhan">Đầu vào thiết kế</p>
<ul>
<li><strong>Platform information</strong> — Java web (JSP/Servlet, JDK, Tomcat, MySQL 8) hoặc .NET/SQL Server.</li>
<li><strong>Requirements specification</strong> — SRS của bạn: use case, màn hình, business rule.</li>
<li><strong>Data description</strong> — các thực thể và trường dữ liệu hệ thống lưu.</li>
</ul>
<p class="nhan">Hoạt động thiết kế (ghi chú của slide)</p>
<ul>
<li><strong>Architectural design</strong> — cấu trúc tổng thể: sub-system/module, quan hệ và cách phân bố.</li>
<li><strong>Interface design</strong> — giao tiếp <em>giữa các thành phần</em> (chữ ký method, URL/API), không chỉ là GUI.</li>
<li><strong>Component design</strong> — mỗi thành phần hoạt động bên trong ra sao.</li>
<li><strong>Database design</strong> — cấu trúc dữ liệu và cách lưu (Slide4).</li>
</ul>
<p class="nhan">Đầu ra thiết kế → các mục của SDS</p>
<table><thead><tr><th>Đầu ra</th><th>SDS (Template2)</th></tr></thead><tbody>
<tr><td>System architecture</td><td>1.1 Software Architecture, 1.2 Package Diagram</td></tr>
<tr><td>Database specification</td><td>1.3 Database Design</td></tr>
<tr><td>Interface + component specification</td><td>3. Detailed Design (class + sequence diagram cho từng tính năng)</td></tr>
</tbody></table>`],
  [6, 'OO concepts — objects & classes (1/2)',
    `<p class="y-chinh">🎯 An object is one concrete "thing"; a class is the template shared by all objects of the same kind.</p>
<ul>
<li><strong>Object</strong> — a real-world physical (door, lamp) or conceptual (account, transaction) entity; the basis of the software solution.</li>
<li><strong>Object instance</strong> — a single thing, written <code>aCustomer : Customer</code> (underlined in UML).</li>
<li><strong>Class</strong> — the collection of objects with the same characteristics: <code>Customer</code>, <code>Account</code>.</li>
</ul>
<p class="nhan">In the G5 Job IT for Freelancer system</p>
<ul>
<li><strong>Classes</strong> — <code>Freelancer</code>, <code>Recruiter</code>, <code>Post</code> (a job post), <code>JobApply</code>, <code>Category</code>.</li>
<li><strong>Objects</strong> — "the Java-backend post with id 3", "the application with id 1": each is one row of a table at run time.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> class = cookie cutter, object = cookie. Class names are singular nouns.</p>`,
    `<p class="y-chinh">🎯 Object là một "thứ" cụ thể; class là khuôn mẫu chung của mọi object cùng loại.</p>
<ul>
<li><strong>Object</strong> — thực thể vật lý (cửa, đèn) hoặc khái niệm (tài khoản, giao dịch) trong thế giới thật; là nền của giải pháp phần mềm.</li>
<li><strong>Object instance</strong> — một thứ duy nhất, viết <code>aCustomer : Customer</code> (gạch chân trong UML).</li>
<li><strong>Class</strong> — tập các object có cùng đặc điểm: <code>Customer</code>, <code>Account</code>.</li>
</ul>
<p class="nhan">Trong hệ thống G5 Job IT for Freelancer</p>
<ul>
<li><strong>Class</strong> — <code>Freelancer</code>, <code>Recruiter</code>, <code>Post</code> (bài tuyển dụng), <code>JobApply</code>, <code>Category</code>.</li>
<li><strong>Object</strong> — "bài đăng Java backend có id 3", "đơn ứng tuyển có id 1": mỗi cái là một dòng của bảng lúc chạy.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> class = khuôn bánh, object = cái bánh. Tên class là danh từ số ít.</p>`],
  [7, 'OO concepts — objects & classes (2/2): attributes & operations',
    `<p class="y-chinh">🎯 An object bundles data (attributes) with the operations that act on that data.</p>
<p class="nhan">The vocabulary</p>
<ul>
<li><strong>Attribute</strong> — a data value held by each object: <code>accountNumber</code>, <code>balance</code>. Each object has its own value.</li>
<li><strong>Operation</strong> — the <em>specification</em> of a function the object performs (name + parameters).</li>
<li><strong>Method</strong> — in UML, the <em>implementation</em> of that operation (the code body).</li>
<li><strong>Parameters</strong> — operations may have input and output parameters; all objects of a class share the same operations.</li>
</ul>
<p class="nhan">G5 example — class <code>JobApply</code></p>
<ul>
<li><strong>Attributes</strong> — <code>applyID</code>, <code>freelanceID</code>, <code>postID</code>, <code>status</code>, <code>dateApply</code>, <code>resume</code> (the columns of table <code>JobApply</code>).</li>
<li><strong>Operations</strong> (in the DAO that serves it) — <code>insert(apply)</code>, <code>getByFreelancer(id)</code>, <code>updateStatus(applyID, status)</code>.</li>
</ul>
<p class="ghi-chu">In a JSP/Servlet project the "entity" class is usually a plain Java bean (getters/setters) and its CRUD operations live in a DAO class — Lesson 3.4 explains why that split is still information hiding.</p>`,
    `<p class="y-chinh">🎯 Một object gói dữ liệu (attribute) cùng với các operation thao tác trên dữ liệu đó.</p>
<p class="nhan">Từ vựng</p>
<ul>
<li><strong>Attribute</strong> — giá trị dữ liệu mỗi object giữ: <code>accountNumber</code>, <code>balance</code>. Mỗi object có giá trị riêng.</li>
<li><strong>Operation</strong> — <em>đặc tả</em> một chức năng object thực hiện (tên + tham số).</li>
<li><strong>Method</strong> — trong UML là <em>phần hiện thực</em> của operation đó (thân code).</li>
<li><strong>Tham số</strong> — operation có thể có tham số vào và ra; mọi object của một class dùng chung các operation.</li>
</ul>
<p class="nhan">Ví dụ G5 — class <code>JobApply</code></p>
<ul>
<li><strong>Attribute</strong> — <code>applyID</code>, <code>freelanceID</code>, <code>postID</code>, <code>status</code>, <code>dateApply</code>, <code>resume</code> (các cột của bảng <code>JobApply</code>).</li>
<li><strong>Operation</strong> (trong DAO phục vụ nó) — <code>insert(apply)</code>, <code>getByFreelancer(id)</code>, <code>updateStatus(applyID, status)</code>.</li>
</ul>
<p class="ghi-chu">Trong dự án JSP/Servlet, lớp "entity" thường là Java bean thuần (getter/setter) và các operation CRUD nằm ở lớp DAO — Bài 3.4 giải thích vì sao cách tách này vẫn là information hiding.</p>`],
  [8, 'OO concepts — information hiding (1/2)',
    `<p class="y-chinh">🎯 Hide what is likely to change inside one object; others reach it only through its operations.</p>
<p class="nhan">The chain of ideas</p>
<ol>
<li><strong>Information hiding</strong> — when designing an object, decide what is visible and what is hidden.</li>
<li><strong>Encapsulation</strong> — the hidden part that may change is wrapped inside the object.</li>
<li><strong>Interface</strong> — the specification of the operations (names + parameters) is the only thing others see.</li>
<li><strong>Data abstraction</strong> — if the data structure changes, only the object that owns it changes, not its callers.</li>
</ol>
<p class="nhan">Why your team needs it</p>
<ul>
<li><strong>Parallel work</strong> — member A codes <code>PostDAO</code>, member B's <code>ApplyJobController</code> only calls <code>getPostById(id)</code>. A can switch from plain JDBC to a connection pool without breaking B.</li>
<li><strong>Grading</strong> — reviewers ask "what happens if you change table X?"; a good answer is "only its DAO changes".</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Public fields and SQL everywhere.</strong> Copy-pasting the same SELECT into five servlets breaks information hiding: one column rename becomes five bugs (and a Leakage label from the teacher).</div>`,
    `<p class="y-chinh">🎯 Giấu thứ dễ thay đổi vào trong một object; nơi khác chỉ chạm tới nó qua các operation.</p>
<p class="nhan">Chuỗi ý tưởng</p>
<ol>
<li><strong>Information hiding</strong> — khi thiết kế object, quyết định phần nào lộ ra, phần nào giấu đi.</li>
<li><strong>Encapsulation</strong> — phần bị giấu có thể thay đổi được gói trong object.</li>
<li><strong>Interface</strong> — đặc tả các operation (tên + tham số) là thứ duy nhất nơi khác nhìn thấy.</li>
<li><strong>Data abstraction</strong> — nếu cấu trúc dữ liệu đổi, chỉ object sở hữu nó phải sửa, nơi gọi thì không.</li>
</ol>
<p class="nhan">Vì sao nhóm bạn cần nó</p>
<ul>
<li><strong>Làm song song</strong> — bạn A code <code>PostDAO</code>, <code>ApplyJobController</code> của bạn B chỉ gọi <code>getPostById(id)</code>. A đổi từ JDBC thuần sang connection pool mà không làm hỏng code của B.</li>
<li><strong>Khi chấm</strong> — hội đồng hỏi "đổi bảng X thì sao?"; câu trả lời tốt là "chỉ DAO của nó phải sửa".</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Field public và SQL rải khắp nơi.</strong> Copy cùng một câu SELECT vào năm servlet là phá information hiding: đổi tên một cột thành năm bug (và một nhãn Leakage từ thầy/cô).</div>`],
  [9, 'OO concepts — information hiding (2/2): the Stack example',
    `<p class="y-chinh">🎯 Module A pushes and Module B pops through the same four operations — whether the stack is an array or a linked list is invisible to them.</p>
<p class="nhan">Read the figure</p>
<ul>
<li><strong>Class <code>Stack</code></strong> — interface: <code>push(in item)</code>, <code>pop(out item)</code>, <code>empty(): Boolean</code>, <code>full(): Boolean</code>.</li>
<li><strong>Top figure</strong> — implemented as an <em>array</em> with an <code>Index</code> and <code>Max Size = N</code>.</li>
<li><strong>Bottom figure</strong> — implemented as a <em>linked list</em> with <code>Top</code> and <code>Bottom</code> pointers.</li>
<li><strong>Modules A and B</strong> — identical in both pictures: that is the whole point.</li>
</ul>
<p class="nhan">Same idea in a web project</p>
<p><code>JobApplyDAO.getByFreelancer(id)</code> may run one JOIN today and a stored procedure or a cache tomorrow; the servlet and the JSP never notice.</p>
<p class="meo">🧠 <strong>Remember:</strong> <code>in</code> = the caller gives a value, <code>out</code> = the operation gives one back — Gomaa writes parameters this way in every class diagram of the deck.</p>`,
    `<p class="y-chinh">🎯 Module A push, Module B pop qua cùng bốn operation — stack là mảng hay danh sách liên kết thì chúng không hề thấy.</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Class <code>Stack</code></strong> — interface: <code>push(in item)</code>, <code>pop(out item)</code>, <code>empty(): Boolean</code>, <code>full(): Boolean</code>.</li>
<li><strong>Hình trên</strong> — hiện thực bằng <em>mảng</em> với <code>Index</code> và <code>Max Size = N</code>.</li>
<li><strong>Hình dưới</strong> — hiện thực bằng <em>danh sách liên kết</em> với con trỏ <code>Top</code> và <code>Bottom</code>.</li>
<li><strong>Module A và B</strong> — giống hệt nhau ở cả hai hình: đó chính là điểm mấu chốt.</li>
</ul>
<p class="nhan">Cùng ý đó trong dự án web</p>
<p><code>JobApplyDAO.getByFreelancer(id)</code> hôm nay có thể chạy một câu JOIN, mai chạy stored procedure hoặc cache; servlet và JSP không hề hay biết.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <code>in</code> = nơi gọi đưa giá trị vào, <code>out</code> = operation trả giá trị ra — Gomaa viết tham số kiểu này trong mọi class diagram của bộ slide.</p>`],
  [10, 'Object-oriented methods (1/2)',
    `<p class="y-chinh">🎯 OO methods exist to make software easy to modify, adapt and evolve — and UML alone is not a method.</p>
<ul>
<li><strong>Goal</strong> — modifiability, adaptation, evolution (exactly what 3 iterations with changing requirements demand).</li>
<li><strong>Three foundations</strong> — information hiding, classes, inheritance.</li>
<li><strong>UML</strong> — a standard <em>notation</em>, methodology-independent. It must be used <em>together with</em> an analysis &amp; design method — here COMET.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>"We know UML, so we have a design."</strong> Knowing how to draw boxes and arrows is not a design. The method tells you <em>which</em> diagrams to draw, in which order, and how one is derived from the previous one (use case → communication diagram → class operations → code).</div>`,
    `<p class="y-chinh">🎯 Phương pháp OO sinh ra để phần mềm dễ sửa, dễ thích nghi và dễ phát triển tiếp — và riêng UML thì không phải là phương pháp.</p>
<ul>
<li><strong>Mục tiêu</strong> — dễ sửa, dễ thích nghi, dễ tiến hoá (đúng thứ mà 3 iteration với yêu cầu thay đổi đòi hỏi).</li>
<li><strong>Ba nền tảng</strong> — information hiding, class, kế thừa.</li>
<li><strong>UML</strong> — một <em>ký pháp</em> chuẩn, không phụ thuộc phương pháp. Phải dùng <em>cùng với</em> một phương pháp phân tích &amp; thiết kế — ở đây là COMET.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>"Nhóm biết UML nên đã có thiết kế."</strong> Biết vẽ hộp và mũi tên chưa phải là thiết kế. Phương pháp cho biết vẽ <em>diagram nào</em>, theo thứ tự nào, và diagram sau suy ra từ diagram trước ra sao (use case → communication diagram → operation của class → code).</div>`],
  [11, 'Object-oriented methods (2/2): the four kinds of model',
    `<p class="y-chinh">🎯 A modern OO method combines four models: use case, static, dynamic (interaction) and state machine.</p>
<table><thead><tr><th>Model</th><th>What it shows</th><th>SWP391 artefact</th></tr></thead><tbody>
<tr><td><strong>Use case model</strong></td><td>functional requirements as use cases + actors</td><td>UC diagram + UC specs in the SRS (Chapter 2)</td></tr>
<tr><td><strong>Static model</strong></td><td>structure: classes, attributes, relationships</td><td>entity class diagram / ERD, class diagram per feature</td></tr>
<tr><td><strong>Dynamic model</strong></td><td>behaviour: objects interacting to realise a use case</td><td>communication or <em>sequence</em> diagram per feature</td></tr>
<tr><td><strong>State machine</strong></td><td>state-dependent behaviour</td><td>SDS section 2 — State Transition Diagrams</td></tr>
</tbody></table>
<p class="meo">🧠 <strong>Remember "U-S-D-S":</strong> Use case → Static → Dynamic → State. The SDS template asks for exactly the last three.</p>`,
    `<p class="y-chinh">🎯 Một phương pháp OO hiện đại kết hợp bốn mô hình: use case, tĩnh, động (tương tác) và máy trạng thái.</p>
<table><thead><tr><th>Mô hình</th><th>Thể hiện gì</th><th>Sản phẩm trong SWP391</th></tr></thead><tbody>
<tr><td><strong>Use case model</strong></td><td>yêu cầu chức năng dưới dạng use case + actor</td><td>UC diagram + UC spec trong SRS (Chương 2)</td></tr>
<tr><td><strong>Static model</strong></td><td>cấu trúc: class, attribute, quan hệ</td><td>entity class diagram / ERD, class diagram cho từng tính năng</td></tr>
<tr><td><strong>Dynamic model</strong></td><td>hành vi: các object tương tác để hiện thực một use case</td><td>communication hoặc <em>sequence</em> diagram cho từng tính năng</td></tr>
<tr><td><strong>State machine</strong></td><td>hành vi phụ thuộc trạng thái</td><td>SDS mục 2 — State Transition Diagrams</td></tr>
</tbody></table>
<p class="meo">🧠 <strong>Mẹo nhớ "U-S-D-S":</strong> Use case → Static → Dynamic → State. Template SDS đòi đúng ba cái sau.</p>`],
// @R31
];
const L31 = {
  title: '3.1 — Design in SWP391: the design process, OO concepts & OO methods|||3.1 — Thiết kế trong SWP391: quy trình thiết kế, khái niệm & phương pháp hướng đối tượng',
  slug: 'swp391-3-design-foundations',
  type: 'VIDEO',
  description: 'Slide3 System Design trang 1–11: thiết kế là gì, mô hình phát triển tăng dần, quy trình thiết kế (kiến trúc, giao diện, thành phần, CSDL), object/class, information hiding, phương pháp OO — và thiết kế nằm ở đâu trong 3 iteration của SWP391.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.1 · Slide3 System Design pages 1–11</span>
<h2>Design in SWP391 — why model, the design process and the OO basics</h2>
<p class="lead">In SWP391 design is <strong>not a phase</strong> that happens once. In each of the 3 iterations every member specifies, designs and codes his/her own 3–4 screens, so every member draws class and sequence diagrams for those screens. This lesson walks the first 11 pages of the teacher's <em>System Design</em> deck: what modelling is for, the general design process, and the object-oriented ideas every later diagram relies on.</p>
<div class="callout"><strong>After this lesson you can</strong>
<ul>
<li>explain the difference between software design and implementation;</li>
<li>map the design activities (architecture, interface, component, database) to the sections of the SDS;</li>
<li>use <em>object, class, attribute, operation, information hiding, encapsulation, data abstraction</em> correctly;</li>
<li>name the four models of an OO method and the SWP391 artefact for each.</li>
</ul></div>`,
`<span class="eyebrow">Chương 3 · Bài 3.1 · Slide3 System Design trang 1–11</span>
<h2>Thiết kế trong SWP391 — vì sao mô hình hoá, quy trình thiết kế và nền tảng OO</h2>
<p class="lead">Trong SWP391 thiết kế <strong>không phải một giai đoạn</strong> làm một lần. Ở cả 3 iteration, mỗi thành viên đặc tả, thiết kế và code 3–4 màn hình của riêng mình, nên ai cũng phải vẽ class và sequence diagram cho các màn hình đó. Bài này đi qua 11 trang đầu của bộ slide <em>System Design</em>: mô hình hoá để làm gì, quy trình thiết kế tổng quát, và các ý tưởng hướng đối tượng mà mọi diagram phía sau đều dựa vào.</p>
<div class="callout"><strong>Học xong bài này bạn có thể</strong>
<ul>
<li>phân biệt software design và implementation;</li>
<li>ánh xạ các hoạt động thiết kế (kiến trúc, interface, component, CSDL) vào các mục của SDS;</li>
<li>dùng đúng <em>object, class, attribute, operation, information hiding, encapsulation, data abstraction</em>;</li>
<li>kể tên bốn mô hình của một phương pháp OO và sản phẩm SWP391 tương ứng.</li>
</ul></div>`),
    walkHead(G, 1, 11, 'Pages 1–11 are the introduction; the numbering on the pages says "/24" because the deck grew from an older 24-page version.', 'Trang 1–11 là phần mở đầu; số trang in trên slide ghi "/24" vì bộ slide được mở rộng từ bản cũ 24 trang.'),
    walk(G, R31),
    bi(`<h2>🔧 Beyond the slides — design work per iteration</h2>
<h3>What each member designs, iteration by iteration</h3>
<table><thead><tr><th>Iteration</th><th>Team-level design (leader + all)</th><th>Per member (his/her 3–4 screens)</th></tr></thead><tbody>
<tr><td>Iter 1 (15%)</td><td>architecture diagram, package structure, first ERD, context diagram, shared classes (DBContext, BaseDAO, filter, layout JSP)</td><td>class diagram + sequence diagram + SQL for each screen</td></tr>
<tr><td>Iter 2 (20%)</td><td>ERD/table changes (Record of Changes), state charts for status fields</td><td>same, for the new screens; update old ones that changed</td></tr>
<tr><td>Iter 3 (25%)</td><td>final architecture/package/DB sections consistent with the code in the final tag</td><td>same; every screen in the Product sheet has its design</td></tr>
</tbody></table>
<h3>From the four OO models to the documents</h3>
<ol>
<li><strong>Use case model</strong> — SRS (Template1) / RDS part II: UC diagram, UC specs, business rules.</li>
<li><strong>Static model</strong> — SDS 1.3 (ERD + table descriptions) and 3.x.1 (class diagram per feature).</li>
<li><strong>Dynamic model</strong> — SDS 3.x.2 (sequence diagram per feature). The deck uses communication diagrams; the template asks for sequence diagrams — both show the same messages.</li>
<li><strong>State machine</strong> — SDS 2 (state transition diagrams) for fields such as <code>Post.status</code> or <code>JobApply.status</code>.</li>
</ol>
<h3>Checklist — "is this design worth the marks?"</h3>
<ul>
<li>Every class in a class diagram exists in the code with the same name (the reviewer opens GitLab).</li>
<li>Every message in a sequence diagram is a real method call or HTTP request.</li>
<li>No diagram shows a JSP talking to the database directly.</li>
<li>Names follow one convention: <code>XxxController</code>, <code>XxxDAO</code>, <code>Xxx</code> model, <code>xxx-list.jsp</code>.</li>
<li>The Record of Changes lists what changed in this iteration and who changed it.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Design by contract.</strong> Bertrand Meyer's idea pushes information hiding one step further: each public operation states a <em>precondition</em> (what the caller must guarantee), a <em>postcondition</em> (what the operation guarantees) and an <em>invariant</em> (what is always true for the object). Writing one line such as "pre: post not expired and not yet applied by this freelancer; post: one new JobApply row with status 0" above <code>applyJob()</code> turns a business rule of the SRS into a checkable promise — and gives your tester the test cases for free.</div>`,
`<h2>🔧 Ngoài slide — việc thiết kế trong từng iteration</h2>
<h3>Mỗi thành viên thiết kế gì, theo từng iteration</h3>
<table><thead><tr><th>Iteration</th><th>Thiết kế cấp nhóm (leader + cả nhóm)</th><th>Từng thành viên (3–4 màn hình của mình)</th></tr></thead><tbody>
<tr><td>Iter 1 (15%)</td><td>sơ đồ kiến trúc, cấu trúc package, ERD đầu tiên, context diagram, các lớp dùng chung (DBContext, BaseDAO, filter, JSP layout)</td><td>class diagram + sequence diagram + SQL cho từng màn hình</td></tr>
<tr><td>Iter 2 (20%)</td><td>thay đổi ERD/bảng (Record of Changes), state chart cho các trường trạng thái</td><td>như trên cho màn hình mới; sửa các màn hình cũ nếu đổi</td></tr>
<tr><td>Iter 3 (25%)</td><td>các mục kiến trúc/package/CSDL cuối cùng khớp với code trong tag cuối</td><td>như trên; mọi màn hình trong sheet Product đều có thiết kế</td></tr>
</tbody></table>
<h3>Từ bốn mô hình OO tới tài liệu</h3>
<ol>
<li><strong>Use case model</strong> — SRS (Template1) / RDS phần II: UC diagram, UC spec, business rule.</li>
<li><strong>Static model</strong> — SDS 1.3 (ERD + mô tả bảng) và 3.x.1 (class diagram cho từng tính năng).</li>
<li><strong>Dynamic model</strong> — SDS 3.x.2 (sequence diagram cho từng tính năng). Slide dùng communication diagram; template đòi sequence diagram — hai loại thể hiện cùng các message.</li>
<li><strong>State machine</strong> — SDS 2 (state transition diagram) cho các trường như <code>Post.status</code> hay <code>JobApply.status</code>.</li>
</ol>
<h3>Checklist — "thiết kế này có đáng điểm không?"</h3>
<ul>
<li>Mọi class trong class diagram đều có trong code với đúng tên đó (hội đồng mở GitLab ra xem).</li>
<li>Mọi message trong sequence diagram là một lời gọi method hoặc HTTP request thật.</li>
<li>Không diagram nào cho JSP nói chuyện trực tiếp với CSDL.</li>
<li>Tên theo một quy ước: <code>XxxController</code>, <code>XxxDAO</code>, model <code>Xxx</code>, <code>xxx-list.jsp</code>.</li>
<li>Record of Changes ghi rõ iteration này đổi gì và ai đổi.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Design by contract.</strong> Ý tưởng của Bertrand Meyer đẩy information hiding thêm một bước: mỗi operation public nêu <em>tiền điều kiện</em> (nơi gọi phải đảm bảo gì), <em>hậu điều kiện</em> (operation đảm bảo gì) và <em>bất biến</em> (điều luôn đúng với object). Viết một dòng như "pre: bài đăng chưa hết hạn và freelancer này chưa apply; post: thêm một dòng JobApply với status 0" phía trên <code>applyJob()</code> biến một business rule của SRS thành lời hứa kiểm chứng được — và tester của nhóm có luôn test case.</div>`),
    books([
      ['gomaa', 'Ch. 1 (Introduction), Ch. 3 (Software life cycle models & processes), Ch. 4 (Software design & architecture concepts — objects, classes, information hiding), Ch. 5 (Overview of the COMET method)', 'Ch. 1 (Giới thiệu), Ch. 3 (Mô hình vòng đời & quy trình), Ch. 4 (Khái niệm thiết kế & kiến trúc — object, class, information hiding), Ch. 5 (Tổng quan phương pháp COMET)'],
      ['sommerville', 'Ch. 7 (Design and implementation) — 7.1 Object-oriented design using the UML', 'Ch. 7 (Design and implementation) — 7.1 Thiết kế hướng đối tượng bằng UML'],
      ['fowler', 'Ch. 1–2 (UML as sketch/blueprint, development process)', 'Ch. 1–2 (UML dạng phác thảo/bản vẽ, quy trình phát triển)'],
    ]),
// @C31
  ].join('\n'),
};

/* ─────────────── 3.2 Analysis modelling (g-design 12–23) ─────────────── */
const R32 = [
  [12, 'Context modelling (1/5) — the system context diagram',
    `<p class="y-chinh">🎯 A context diagram draws the border: the system is one black box in the middle, everything outside talks to it through labelled flows.</p>
<p class="nhan">Read the example (Chemical Tracking System, from Wiegers)</p>
<ul>
<li><strong>The circle</strong> — the whole system (hardware + software) as a black box.</li>
<li><strong>Rectangles</strong> — external entities: user classes (Chemist, Buyer), organisations (Health and Safety Department), other systems (Training Database), devices (Bar Code Reader).</li>
<li><strong>Arrows</strong> — flows of data or physical items: "request for chemical", "inventory report", "scanned bar code".</li>
</ul>
<p class="nhan">For the G5 Job IT for Freelancer system</p>
<pre>
                   job posts, apply status
  [Freelancer] &lt;------------------------------&gt; (             )
                   search, apply, CV upload      (  Job IT for  ) &lt;--- reset link --- [Gmail SMTP]
  [Recruiter]  &lt;------------------------------&gt; (  Freelancer  )
                   create post, review applies   (   System     ) --- reports ----&gt; [Admin]
  [Guest]      --- browse posts / register ----&gt; (             )
</pre>
<p class="ghi-chu">The context diagram is also prompt #3 of the teacher's Claude_Prompts.txt (drawio output). It belongs at the start of the SRS/RDS; the SDS architecture section refines what is <em>inside</em> the box.</p>`,
    `<p class="y-chinh">🎯 Context diagram vẽ đường biên: hệ thống là một hộp đen ở giữa, mọi thứ bên ngoài nói chuyện với nó qua các luồng có nhãn.</p>
<p class="nhan">Đọc ví dụ (Chemical Tracking System, từ sách Wiegers)</p>
<ul>
<li><strong>Hình tròn</strong> — toàn bộ hệ thống (phần cứng + phần mềm) như một hộp đen.</li>
<li><strong>Hình chữ nhật</strong> — thực thể bên ngoài: nhóm người dùng (Chemist, Buyer), tổ chức (Health and Safety Department), hệ thống khác (Training Database), thiết bị (Bar Code Reader).</li>
<li><strong>Mũi tên</strong> — luồng dữ liệu hoặc vật thể: "request for chemical", "inventory report", "scanned bar code".</li>
</ul>
<p class="nhan">Với hệ thống G5 Job IT for Freelancer</p>
<pre>
                   bài đăng, trạng thái apply
  [Freelancer] &lt;------------------------------&gt; (             )
                   tìm, apply, tải CV            (  Job IT for  ) &lt;--- link reset --- [Gmail SMTP]
  [Recruiter]  &lt;------------------------------&gt; (  Freelancer  )
                   tạo bài, duyệt đơn apply      (   System     ) --- báo cáo ---&gt; [Admin]
  [Guest]      --- xem bài / đăng ký ---------&gt; (             )
</pre>
<p class="ghi-chu">Context diagram cũng là prompt #3 trong Claude_Prompts.txt của thầy/cô (xuất ra drawio). Nó nằm ở đầu SRS/RDS; mục kiến trúc của SDS thì mô tả chi tiết <em>bên trong</em> chiếc hộp.</p>`],
  [13, 'Context modelling (2/5) — the software system context diagram',
    `<p class="y-chinh">🎯 Zoom in one level: now only the <em>software</em> is the black box, and the hardware it uses becomes external classes.</p>
<p class="nhan">Two diagrams on the slide</p>
<ul>
<li><strong>Top right — system context</strong> — ATM Customer and ATM Operator actors <em>interact with</em> the «system» Banking System (multiplicity 1..* to 1).</li>
<li><strong>Bottom — software system context</strong> — CardReader, ReceiptPrinter, ATMCustomerKeypadDisplay, CashDispenser and Operator are drawn as <em>classes</em> around the Banking System, with associations "Inputs to", "Outputs to", "Interacts with".</li>
</ul>
<p class="nhan">What it means for a web system</p>
<p>A web system has no card readers: its "hardware" is the browser (keyboard/display/mouse) on the user side. External classes you <em>will</em> meet are other systems — an SMTP mail server, a payment gateway (VNPay/MoMo sandbox), Google OAuth, cloud storage for CV files.</p>`,
    `<p class="y-chinh">🎯 Phóng to một mức: giờ chỉ riêng <em>phần mềm</em> là hộp đen, còn phần cứng nó dùng trở thành các external class.</p>
<p class="nhan">Hai diagram trên slide</p>
<ul>
<li><strong>Góc trên phải — system context</strong> — actor ATM Customer và ATM Operator <em>interact with</em> «system» Banking System (bội số 1..* với 1).</li>
<li><strong>Phía dưới — software system context</strong> — CardReader, ReceiptPrinter, ATMCustomerKeypadDisplay, CashDispenser và Operator được vẽ thành <em>class</em> quanh Banking System, với các association "Inputs to", "Outputs to", "Interacts with".</li>
</ul>
<p class="nhan">Ý nghĩa với một web system</p>
<p>Web system không có đầu đọc thẻ: "phần cứng" của nó là trình duyệt (bàn phím/màn hình/chuột) phía người dùng. External class bạn <em>sẽ</em> gặp là các hệ thống khác — mail server SMTP, cổng thanh toán (sandbox VNPay/MoMo), Google OAuth, cloud lưu file CV.</p>`],
  [14, 'Context modelling (3/5) — modelling external classes',
    `<p class="y-chinh">🎯 Everything outside the software is an «external class», and there are exactly four kinds of it.</p>
<p class="nhan">The stereotype tree</p>
<ul>
<li><strong>«external user»</strong> — a human using standard I/O (keyboard, display, mouse). Association: <em>Interacts with</em>.</li>
<li><strong>«external device»</strong> — split into <strong>input</strong> (only gives input, e.g. a sensor), <strong>output</strong> (only receives output, e.g. an actuator) and <strong>input/output</strong> (both, e.g. an ATM card reader). Associations: <em>Inputs to</em> / <em>Outputs to</em>.</li>
<li><strong>«external system»</strong> — another software system. Association: <em>Communicates with</em>.</li>
<li><strong>«external timer»</strong> — a clock that <em>Signals</em> the software.</li>
</ul>
<p class="nhan">Your web system</p>
<ul>
<li><strong>«external user»</strong> — Guest, Freelancer, Recruiter, Admin.</li>
<li><strong>«external system»</strong> — Gmail SMTP (G5's non-UI function "Reset password by gmail"), a payment gateway, Google login.</li>
<li><strong>«external timer»</strong> — a scheduled job, e.g. "close posts whose <code>expired</code> date has passed every midnight" (write it under <em>Non-UI Functions</em> in the SRS).</li>
</ul>`,
    `<p class="y-chinh">🎯 Mọi thứ nằm ngoài phần mềm là một «external class», và chỉ có đúng bốn loại.</p>
<p class="nhan">Cây stereotype</p>
<ul>
<li><strong>«external user»</strong> — con người dùng thiết bị I/O chuẩn (bàn phím, màn hình, chuột). Association: <em>Interacts with</em>.</li>
<li><strong>«external device»</strong> — chia thành <strong>input</strong> (chỉ đưa vào, ví dụ cảm biến), <strong>output</strong> (chỉ nhận ra, ví dụ cơ cấu chấp hành) và <strong>input/output</strong> (cả hai, ví dụ đầu đọc thẻ ATM). Association: <em>Inputs to</em> / <em>Outputs to</em>.</li>
<li><strong>«external system»</strong> — một hệ thống phần mềm khác. Association: <em>Communicates with</em>.</li>
<li><strong>«external timer»</strong> — đồng hồ <em>Signals</em> (báo hiệu) cho phần mềm.</li>
</ul>
<p class="nhan">Web system của bạn</p>
<ul>
<li><strong>«external user»</strong> — Guest, Freelancer, Recruiter, Admin.</li>
<li><strong>«external system»</strong> — Gmail SMTP (chức năng non-UI "Reset password by gmail" của G5), cổng thanh toán, đăng nhập Google.</li>
<li><strong>«external timer»</strong> — một job định kỳ, ví dụ "mỗi nửa đêm đóng các bài đăng đã quá ngày <code>expired</code>" (ghi vào <em>Non-UI Functions</em> trong SRS).</li>
</ul>`],
  [15, 'Context modelling (4/5) — actors & external classes',
    `<p class="y-chinh">🎯 An actor (use case model) is more abstract than an external class (design model); each actor maps to one external class.</p>
<table><thead><tr><th>Actor in the use case diagram</th><th>External class in the context model</th></tr></thead><tbody>
<tr><td><strong>I/O device actor</strong></td><td>an «external I/O device» class</td></tr>
<tr><td><strong>External system actor</strong></td><td>an «external system» class</td></tr>
<tr><td><strong>Timer actor</strong></td><td>an «external timer» class that provides timer events</td></tr>
<tr><td><strong>Human user actor</strong></td><td>most flexible: in the simple case an «external user» via keyboard, display and mouse</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>"Database" drawn as an actor.</strong> Your own MySQL database is <em>inside</em> the system, not an actor and not an external class. Only draw a database outside the box if it belongs to <em>another</em> system you do not control.</div>`,
    `<p class="y-chinh">🎯 Actor (mô hình use case) trừu tượng hơn external class (mô hình thiết kế); mỗi actor ánh xạ sang một external class.</p>
<table><thead><tr><th>Actor trong use case diagram</th><th>External class trong context model</th></tr></thead><tbody>
<tr><td><strong>I/O device actor</strong></td><td>một class «external I/O device»</td></tr>
<tr><td><strong>External system actor</strong></td><td>một class «external system»</td></tr>
<tr><td><strong>Timer actor</strong></td><td>một class «external timer» cung cấp sự kiện thời gian</td></tr>
<tr><td><strong>Human user actor</strong></td><td>linh hoạt nhất: trường hợp đơn giản là «external user» qua bàn phím, màn hình và chuột</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Vẽ "Database" thành actor.</strong> CSDL MySQL của chính nhóm nằm <em>trong</em> hệ thống, không phải actor cũng không phải external class. Chỉ vẽ database bên ngoài hộp nếu nó thuộc về một hệ thống <em>khác</em> mà bạn không kiểm soát.</div>`],
  [16, 'Context modelling (5/5) — Banking System software context class diagram with stereotypes',
    `<p class="y-chinh">🎯 The finished context class diagram: the same picture as slide 13, now every box carries its stereotype.</p>
<p class="nhan">Read each association</p>
<ul>
<li><strong>«external I/O device» CardReader</strong> — <em>Inputs to</em> and <em>Outputs to</em> the Banking System (it reads and ejects cards).</li>
<li><strong>«external output device» ReceiptPrinter, CashDispenser</strong> — only <em>Outputs to</em>.</li>
<li><strong>«external user» ATMCustomerKeypadDisplay</strong> — <em>Interacts with</em>; the ATM Customer actor uses it.</li>
<li><strong>«external user» Operator</strong> — <em>Interacts with</em>, used by the ATM Operator actor.</li>
<li><strong>Multiplicities</strong> — 1 Banking System serves 1..* of each device (one per ATM).</li>
</ul>
<p class="nhan">Same diagram for G5 (text form)</p>
<pre>
«external user» Guest       ---- Interacts with ----&gt;  1 «software system»
«external user» Freelancer  ---- Interacts with ----&gt;    Job IT for Freelancer
«external user» Recruiter   ---- Interacts with ----&gt;
«external user» Admin       ---- Interacts with ----&gt;
«external system» MailServer &lt;--- Communicates with ---
</pre>
<p class="meo">🧠 <strong>Remember:</strong> the verb on the association tells the direction of data — Inputs to (device → system), Outputs to (system → device), Interacts with (both, human).</p>`,
    `<p class="y-chinh">🎯 Context class diagram hoàn chỉnh: cùng hình với slide 13, nay mỗi hộp mang stereotype của nó.</p>
<p class="nhan">Đọc từng association</p>
<ul>
<li><strong>«external I/O device» CardReader</strong> — <em>Inputs to</em> và <em>Outputs to</em> Banking System (vừa đọc vừa nhả thẻ).</li>
<li><strong>«external output device» ReceiptPrinter, CashDispenser</strong> — chỉ <em>Outputs to</em>.</li>
<li><strong>«external user» ATMCustomerKeypadDisplay</strong> — <em>Interacts with</em>; actor ATM Customer dùng nó.</li>
<li><strong>«external user» Operator</strong> — <em>Interacts with</em>, do actor ATM Operator dùng.</li>
<li><strong>Bội số</strong> — 1 Banking System phục vụ 1..* thiết bị mỗi loại (mỗi ATM một cái).</li>
</ul>
<p class="nhan">Cùng diagram cho G5 (dạng chữ)</p>
<pre>
«external user» Guest       ---- Interacts with ----&gt;  1 «software system»
«external user» Freelancer  ---- Interacts with ----&gt;    Job IT for Freelancer
«external user» Recruiter   ---- Interacts with ----&gt;
«external user» Admin       ---- Interacts with ----&gt;
«external system» MailServer &lt;--- Communicates with ---
</pre>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> động từ trên association cho biết chiều dữ liệu — Inputs to (thiết bị → hệ thống), Outputs to (hệ thống → thiết bị), Interacts with (hai chiều, con người).</p>`],
  [17, 'Static modelling of entity classes (1/3) — the ERD (data model)',
    `<p class="y-chinh">🎯 Static modelling starts with the ERD: the entities the business cares about and how they relate.</p>
<p class="nhan">Read the figure (a food-ordering + blog system)</p>
<ul>
<li><strong>Entities</strong> — Tag, Post, Category, Employee, Meal Subscription, Customer, Order, Payroll, Meal, Supplier, Food.</li>
<li><strong>Underlined attribute</strong> — the key (<code>Post-ID</code>, <code>Order No</code>).</li>
<li><strong>Crow's-foot ends</strong> — cardinality: a Customer <em>books</em> zero-or-many Orders; an Order <em>includes</em> many Foods; Post–Tag <em>having</em> is many-to-many.</li>
<li><strong>Verbs on lines</strong> — "writing", "booking", "taking care", "including": they come from the business sentences.</li>
</ul>
<p class="nhan">For your team</p>
<p>Build the ERD from the nouns of your use cases in Iteration 1, then keep it in sync every iteration. Slide4 (Database Design, next lessons) turns it into tables with PK/FK.</p>
<div class="pitfall co-tieu-de"><strong>Many-to-many left as a line.</strong> Post–Tag "having" cannot be stored as one FK; it needs a junction table (post_tag). Reviewers look for this first.</div>`,
    `<p class="y-chinh">🎯 Mô hình tĩnh bắt đầu bằng ERD: các thực thể mà nghiệp vụ quan tâm và quan hệ giữa chúng.</p>
<p class="nhan">Đọc hình (hệ thống đặt món + blog)</p>
<ul>
<li><strong>Thực thể</strong> — Tag, Post, Category, Employee, Meal Subscription, Customer, Order, Payroll, Meal, Supplier, Food.</li>
<li><strong>Thuộc tính gạch chân</strong> — khoá (<code>Post-ID</code>, <code>Order No</code>).</li>
<li><strong>Đầu chân chim</strong> — bản số: một Customer <em>booking</em> không-hoặc-nhiều Order; một Order <em>including</em> nhiều Food; Post–Tag <em>having</em> là nhiều-nhiều.</li>
<li><strong>Động từ trên đường nối</strong> — "writing", "booking", "taking care", "including": lấy từ các câu nghiệp vụ.</li>
</ul>
<p class="nhan">Với nhóm bạn</p>
<p>Dựng ERD từ các danh từ trong use case ở Iteration 1, rồi giữ nó đồng bộ qua mọi iteration. Slide4 (Database Design, các bài sau) biến nó thành bảng với PK/FK.</p>
<div class="pitfall co-tieu-de"><strong>Để nguyên quan hệ nhiều-nhiều thành một đường.</strong> Post–Tag "having" không lưu được bằng một FK; phải có bảng trung gian (post_tag). Hội đồng soi chỗ này đầu tiên.</div>`],
  [18, 'Static modelling of entity classes (2/3) — entity class model',
    `<p class="y-chinh">🎯 Entity classes store data and give access to it; static modelling finds them, their attributes and their relationships.</p>
<p class="nhan">Read the online-shopping model</p>
<ul>
<li><strong>Customer 1 — Uses — 1 CustomerAccount</strong>, which <em>Authorizes</em> 1..* DeliveryOrder.</li>
<li><strong>DeliveryOrder ◇— 1..* Item</strong> — the hollow diamond is <em>aggregation</em>: an order is made of items.</li>
<li><strong>Catalog 1 — Described in — 1..* Item</strong>; Item 0..1 <em>Stored in</em> 1 Inventory.</li>
<li><strong>Supplier</strong> — <em>Provides</em> the Catalog and <em>Maintains</em> 1..* Inventory.</li>
<li><strong>Stereotype «entity»</strong> on every box — these are the classes that become tables.</li>
</ul>
<p class="nhan">G5 entity classes (from its 22-table script)</p>
<p><code>User</code>, <code>Role</code>, <code>Freelancer</code>, <code>Recruiter</code>, <code>Company</code>, <code>Post</code>, <code>Categories</code>, <code>JobType</code>, <code>Duration</code>, <code>JobApply</code>, <code>FreelancerFavorites</code>, <code>Skills</code>/<code>Skill_Set</code>, <code>Education</code>/<code>Degree</code>, <code>Experience</code>, <code>Report</code>, <code>Blogs</code>, <code>Mark</code>…</p>
<p class="meo">🧠 <strong>Remember:</strong> relationships are read in the direction of the small ▶ triangle: "Customer <em>Uses</em> CustomerAccount".</p>`,
    `<p class="y-chinh">🎯 Entity class lưu dữ liệu và cho truy cập dữ liệu đó; mô hình tĩnh đi tìm chúng, thuộc tính và quan hệ của chúng.</p>
<p class="nhan">Đọc mô hình bán hàng online</p>
<ul>
<li><strong>Customer 1 — Uses — 1 CustomerAccount</strong>, tài khoản này <em>Authorizes</em> 1..* DeliveryOrder.</li>
<li><strong>DeliveryOrder ◇— 1..* Item</strong> — hình thoi rỗng là <em>aggregation</em>: đơn hàng gồm nhiều item.</li>
<li><strong>Catalog 1 — Described in — 1..* Item</strong>; Item 0..1 <em>Stored in</em> 1 Inventory.</li>
<li><strong>Supplier</strong> — <em>Provides</em> Catalog và <em>Maintains</em> 1..* Inventory.</li>
<li><strong>Stereotype «entity»</strong> trên mọi hộp — đây là các class sẽ thành bảng.</li>
</ul>
<p class="nhan">Entity class của G5 (từ script 22 bảng)</p>
<p><code>User</code>, <code>Role</code>, <code>Freelancer</code>, <code>Recruiter</code>, <code>Company</code>, <code>Post</code>, <code>Categories</code>, <code>JobType</code>, <code>Duration</code>, <code>JobApply</code>, <code>FreelancerFavorites</code>, <code>Skills</code>/<code>Skill_Set</code>, <code>Education</code>/<code>Degree</code>, <code>Experience</code>, <code>Report</code>, <code>Blogs</code>, <code>Mark</code>…</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> quan hệ đọc theo chiều tam giác nhỏ ▶: "Customer <em>Uses</em> CustomerAccount".</p>`],
  [19, 'Static modelling of entity classes (3/3) — modelling class attributes',
    `<p class="y-chinh">🎯 Each entity class gets its attributes with types; the attribute values distinguish one instance from another.</p>
<p class="nhan">Read the boxes</p>
<ul>
<li><strong>DeliveryOrder</strong> — <code>orderId: Integer</code>, <code>orderStatus: OrderStatusType</code>, <code>accountId</code>, <code>amountDue: Real</code>, <code>supplierId</code>, four dates.</li>
<li><strong>Customer / Supplier</strong> — ids, names, address, phone, fax, <code>email: EmailType</code>.</li>
<li><strong>Item, Inventory, Catalog, CustomerAccount</strong> — ids, quantities, costs, <code>expirationDate: Date</code>.</li>
<li><strong>Types</strong> are conceptual (Integer, Real, String, Date, an enumeration type) — SQL types come later in the DB design.</li>
</ul>
<p class="nhan">G5 — entity class <code>Post</code> as it ends up in the design</p>
<pre>
«entity» Post
  postID: int           title: String        image: String
  jobTypeID: int        durationID: int      datePost: Date
  expired: Date         quantity: int        description: String
  budget: int           location: String     skill: String
  recruiterID: int      status: int          caID: int
</pre>
<div class="pitfall co-tieu-de"><strong>Status as a free text column.</strong> <code>orderStatus: OrderStatusType</code> is an enumeration. In G5, <code>JobApply.status</code> is <code>nvarchar(50)</code> holding '0'/'1' — it works, but a state chart (SDS section 2) must say what each value means.</div>`,
    `<p class="y-chinh">🎯 Mỗi entity class có các thuộc tính kèm kiểu; giá trị thuộc tính phân biệt instance này với instance khác.</p>
<p class="nhan">Đọc các hộp</p>
<ul>
<li><strong>DeliveryOrder</strong> — <code>orderId: Integer</code>, <code>orderStatus: OrderStatusType</code>, <code>accountId</code>, <code>amountDue: Real</code>, <code>supplierId</code>, bốn trường ngày.</li>
<li><strong>Customer / Supplier</strong> — id, tên, địa chỉ, điện thoại, fax, <code>email: EmailType</code>.</li>
<li><strong>Item, Inventory, Catalog, CustomerAccount</strong> — id, số lượng, giá, <code>expirationDate: Date</code>.</li>
<li><strong>Kiểu</strong> ở mức khái niệm (Integer, Real, String, Date, kiểu liệt kê) — kiểu SQL chọn sau ở bước thiết kế CSDL.</li>
</ul>
<p class="nhan">G5 — entity class <code>Post</code> khi vào bản thiết kế</p>
<pre>
«entity» Post
  postID: int           title: String        image: String
  jobTypeID: int        durationID: int      datePost: Date
  expired: Date         quantity: int        description: String
  budget: int           location: String     skill: String
  recruiterID: int      status: int          caID: int
</pre>
<div class="pitfall co-tieu-de"><strong>Trạng thái là cột chữ tự do.</strong> <code>orderStatus: OrderStatusType</code> là kiểu liệt kê. Ở G5, <code>JobApply.status</code> là <code>nvarchar(50)</code> chứa '0'/'1' — chạy được, nhưng state chart (SDS mục 2) phải nói rõ mỗi giá trị nghĩa là gì.</div>`],
  [20, 'Object & class structuring categories (1/3) — the stereotype tree',
    `<p class="y-chinh">🎯 Every software class belongs to one of four families: boundary, entity, control or application logic.</p>
<p class="nhan">The tree on the slide</p>
<ul>
<li><strong>«boundary»</strong> — talks to the outside: <em>«user interaction»</em>, <em>«proxy»</em> (to an external system), <em>«device I/O»</em> (split into «input», «output», «input/output»).</li>
<li><strong>«entity»</strong> — usually persistent; encapsulates information and gives access to it (sometimes via a service object).</li>
<li><strong>«control»</strong> — coordinates a group of objects: <em>«coordinator»</em>, <em>«state dependent control»</em>, <em>«timer»</em>.</li>
<li><strong>«application logic»</strong> — <em>«business logic»</em>, <em>«algorithm»</em>, <em>«service»</em>.</li>
</ul>
<p class="nhan">Where they land in a JSP/Servlet project</p>
<table><thead><tr><th>Stereotype</th><th>Typical class in G5-style code</th></tr></thead><tbody>
<tr><td>«user interaction»</td><td><code>post-detail.jsp</code>, <code>list-apply.jsp</code></td></tr>
<tr><td>«proxy»</td><td><code>EmailSender</code> (talks to Gmail SMTP)</td></tr>
<tr><td>«coordinator»</td><td><code>ApplyJobController</code> servlet</td></tr>
<tr><td>«business logic» / «service»</td><td><code>JobApplyService</code> (rule BR-05, BR-11)</td></tr>
<tr><td>«entity»</td><td><code>JobApply</code> bean + <code>JobApplyDAO</code></td></tr>
</tbody></table>`,
    `<p class="y-chinh">🎯 Mọi class phần mềm thuộc một trong bốn họ: boundary, entity, control hoặc application logic.</p>
<p class="nhan">Cây trên slide</p>
<ul>
<li><strong>«boundary»</strong> — giao tiếp với bên ngoài: <em>«user interaction»</em>, <em>«proxy»</em> (tới hệ thống ngoài), <em>«device I/O»</em> (chia «input», «output», «input/output»).</li>
<li><strong>«entity»</strong> — thường được lưu bền; gói thông tin và cho truy cập nó (đôi khi qua một service object).</li>
<li><strong>«control»</strong> — điều phối một nhóm object: <em>«coordinator»</em>, <em>«state dependent control»</em>, <em>«timer»</em>.</li>
<li><strong>«application logic»</strong> — <em>«business logic»</em>, <em>«algorithm»</em>, <em>«service»</em>.</li>
</ul>
<p class="nhan">Chúng nằm ở đâu trong dự án JSP/Servlet</p>
<table><thead><tr><th>Stereotype</th><th>Class điển hình trong code kiểu G5</th></tr></thead><tbody>
<tr><td>«user interaction»</td><td><code>post-detail.jsp</code>, <code>list-apply.jsp</code></td></tr>
<tr><td>«proxy»</td><td><code>EmailSender</code> (nói chuyện với Gmail SMTP)</td></tr>
<tr><td>«coordinator»</td><td>servlet <code>ApplyJobController</code></td></tr>
<tr><td>«business logic» / «service»</td><td><code>JobApplyService</code> (luật BR-05, BR-11)</td></tr>
<tr><td>«entity»</td><td>bean <code>JobApply</code> + <code>JobApplyDAO</code></td></tr>
</tbody></table>`],
  [21, 'Object & class structuring categories (2/3) — boundary classes',
    `<p class="y-chinh">🎯 Each kind of external class on the context diagram is served by one matching boundary class inside the software.</p>
<ul>
<li><strong>User interaction class</strong> — talks directly to the human through keyboard, display, mouse; can be a simple command line or a full GUI (for you: the JSP/HTML page).</li>
<li><strong>External system → proxy class</strong> — e.g. <code>VnpayGateway</code>, <code>EmailSender</code>.</li>
<li><strong>External input device → input class</strong>; <strong>output device → output class</strong>; <strong>I/O device → I/O class</strong>.</li>
<li><strong>External timer → software timer class</strong> — e.g. a <code>ServletContextListener</code> that schedules the "expire posts" job.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> one external class on the context diagram = one boundary class in the design. If your context diagram has a mail server, your class diagrams must show who talks to it.</p>`,
    `<p class="y-chinh">🎯 Mỗi loại external class trên context diagram được phục vụ bởi đúng một boundary class tương ứng bên trong phần mềm.</p>
<ul>
<li><strong>User interaction class</strong> — giao tiếp trực tiếp với con người qua bàn phím, màn hình, chuột; có thể là dòng lệnh đơn giản hay GUI đầy đủ (với bạn: trang JSP/HTML).</li>
<li><strong>External system → proxy class</strong> — ví dụ <code>VnpayGateway</code>, <code>EmailSender</code>.</li>
<li><strong>External input device → input class</strong>; <strong>output device → output class</strong>; <strong>I/O device → I/O class</strong>.</li>
<li><strong>External timer → software timer class</strong> — ví dụ một <code>ServletContextListener</code> lên lịch job "hết hạn bài đăng".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một external class trên context diagram = một boundary class trong thiết kế. Context diagram có mail server thì class diagram phải cho thấy ai nói chuyện với nó.</p>`],
  [22, 'Object & class structuring categories (3/3) — application logic objects',
    `<p class="y-chinh">🎯 Put the business rules in their own object when they may change independently of the data.</p>
<p class="nhan">Three flavours</p>
<ul>
<li><strong>Business logic objects</strong> — for information systems (your project): the rules of the business.</li>
<li><strong>Algorithm objects</strong> — for real-time, scientific, engineering applications.</li>
<li><strong>Service objects</strong> — provide services to client objects, typical of service-oriented designs.</li>
</ul>
<p class="nhan">Read the figure</p>
<ol>
<li>aCustomer → «user interaction» CustomerInteraction: <em>1 Customer Input</em></li>
<li>CustomerInteraction → «coordinator» aCustomerCoordinator: <em>2 Catalog Request</em></li>
<li>Coordinator → «service» CatalogService: <em>3 Catalog Request</em>, back <em>4 Catalog Info</em></li>
<li>Coordinator → CustomerInteraction: <em>5 Catalog Info</em>; → aCustomer: <em>6 Catalog Output</em></li>
</ol>
<p class="nhan">G5 business rules that deserve a business-logic class</p>
<ul>
<li><strong>BR-05</strong> — freelancers can apply only within the application period (post not expired).</li>
<li><strong>BR-11</strong> — a freelancer who has applied cannot cancel the application.</li>
</ul>`,
    `<p class="y-chinh">🎯 Đặt luật nghiệp vụ vào object riêng khi chúng có thể thay đổi độc lập với dữ liệu.</p>
<p class="nhan">Ba dạng</p>
<ul>
<li><strong>Business logic object</strong> — cho hệ thống thông tin (đồ án của bạn): các luật của nghiệp vụ.</li>
<li><strong>Algorithm object</strong> — cho ứng dụng thời gian thực, khoa học, kỹ thuật.</li>
<li><strong>Service object</strong> — cung cấp dịch vụ cho client object, điển hình trong thiết kế hướng dịch vụ.</li>
</ul>
<p class="nhan">Đọc hình</p>
<ol>
<li>aCustomer → «user interaction» CustomerInteraction: <em>1 Customer Input</em></li>
<li>CustomerInteraction → «coordinator» aCustomerCoordinator: <em>2 Catalog Request</em></li>
<li>Coordinator → «service» CatalogService: <em>3 Catalog Request</em>, trả về <em>4 Catalog Info</em></li>
<li>Coordinator → CustomerInteraction: <em>5 Catalog Info</em>; → aCustomer: <em>6 Catalog Output</em></li>
</ol>
<p class="nhan">Business rule của G5 đáng có một business-logic class</p>
<ul>
<li><strong>BR-05</strong> — freelancer chỉ được apply trong thời hạn nhận hồ sơ (bài chưa hết hạn).</li>
<li><strong>BR-11</strong> — freelancer đã apply thì không được huỷ đơn.</li>
</ul>`],
  [23, 'Dynamic modelling — communication diagrams',
    `<p class="y-chinh">🎯 A communication diagram shows which objects are linked and the numbered messages that realise one use case, step by step.</p>
<p class="nhan">Map each UC step to messages (Make Order Request)</p>
<ol>
<li><strong>UC step 1</strong> — customer requests to create an order → <em>M1, M2 Order Request</em></li>
<li><strong>Step 2</strong> — system retrieves account info → <em>M3 Account Request / M4 Account Info</em> with «service» CustomerAccountService</li>
<li><strong>Step 3</strong> — system checks the credit card → <em>M5 Authorize / M6 Approved</em> with «service» CreditCardService</li>
<li><strong>Step 4</strong> — system creates a delivery order → <em>M7 Store Order / M8 Confirmation</em> with «service» DeliveryOrderService</li>
<li><strong>Then</strong> — confirm to the user (M9, M10) and, in parallel, <em>M9a Send Order Confirmation Email</em> to «service» EmailService</li>
</ol>
<p class="nhan">Why it matters</p>
<ul>
<li><strong>Traceability</strong> — every message comes from a line of the UC spec's main flow; nothing is invented.</li>
<li><strong>Numbering</strong> — "9a" means a concurrent message sent at the same step as 9.</li>
<li><strong>Next step</strong> — each message becomes an operation of the receiving class (slide 42–43) and a line in the sequence diagram of the SDS.</li>
</ul>`,
    `<p class="y-chinh">🎯 Communication diagram cho thấy các object nào nối với nhau và các message đánh số hiện thực một use case, từng bước một.</p>
<p class="nhan">Ánh xạ từng bước UC thành message (Make Order Request)</p>
<ol>
<li><strong>Bước 1 của UC</strong> — khách yêu cầu tạo đơn → <em>M1, M2 Order Request</em></li>
<li><strong>Bước 2</strong> — hệ thống lấy thông tin tài khoản → <em>M3 Account Request / M4 Account Info</em> với «service» CustomerAccountService</li>
<li><strong>Bước 3</strong> — hệ thống kiểm tra thẻ tín dụng → <em>M5 Authorize / M6 Approved</em> với «service» CreditCardService</li>
<li><strong>Bước 4</strong> — hệ thống tạo đơn giao hàng → <em>M7 Store Order / M8 Confirmation</em> với «service» DeliveryOrderService</li>
<li><strong>Sau đó</strong> — xác nhận cho người dùng (M9, M10) và song song <em>M9a Send Order Confirmation Email</em> tới «service» EmailService</li>
</ol>
<p class="nhan">Vì sao quan trọng</p>
<ul>
<li><strong>Truy vết</strong> — mọi message đều đến từ một dòng trong main flow của UC spec; không bịa ra thứ gì.</li>
<li><strong>Đánh số</strong> — "9a" nghĩa là message song song được gửi cùng bước với 9.</li>
<li><strong>Bước tiếp</strong> — mỗi message thành một operation của class nhận (slide 42–43) và một dòng trong sequence diagram của SDS.</li>
</ul>`],
// @R32
];
const L32 = {
  title: '3.2 — Analysis modelling: context, entity classes, object categories, communication diagrams|||3.2 — Mô hình phân tích: context, entity class, phân loại đối tượng, communication diagram',
  slug: 'swp391-3-analysis-modeling',
  type: 'VIDEO',
  description: 'Slide3 trang 12–23: system/software context diagram, external classes & actors, mô hình tĩnh entity class (ERD, thuộc tính), 4 nhóm đối tượng (entity, boundary, control, application logic) và communication diagram — áp vào hệ thống Job IT for Freelancer.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.2 · Slide3 System Design pages 12–23</span>
<h2>Analysis modelling — what the system must handle, before deciding how</h2>
<p class="lead">Analysis modelling sits between the SRS and the code design. It draws the <strong>border</strong> of the system (context modelling), finds the <strong>entity classes</strong> that hold the data (static modelling), sorts every object into <strong>boundary / entity / control / application logic</strong>, and shows how objects <strong>exchange messages</strong> to realise each use case (communication diagrams).</p>
<div class="callout"><strong>After this lesson you can</strong>
<ul>
<li>draw a system context diagram and a software context class diagram with the right stereotypes;</li>
<li>derive entity classes and their attributes from the use cases, and read multiplicities;</li>
<li>classify any class of your project into one of the four COMET categories;</li>
<li>turn the main flow of a use case into a numbered communication diagram.</li>
</ul></div>`,
`<span class="eyebrow">Chương 3 · Bài 3.2 · Slide3 System Design trang 12–23</span>
<h2>Mô hình phân tích — hệ thống phải xử lý gì, trước khi quyết định xử lý thế nào</h2>
<p class="lead">Mô hình phân tích nằm giữa SRS và thiết kế code. Nó vẽ <strong>đường biên</strong> của hệ thống (context modelling), tìm các <strong>entity class</strong> giữ dữ liệu (static modelling), xếp mọi object vào <strong>boundary / entity / control / application logic</strong>, và cho thấy các object <strong>trao đổi message</strong> ra sao để hiện thực từng use case (communication diagram).</p>
<div class="callout"><strong>Học xong bài này bạn có thể</strong>
<ul>
<li>vẽ system context diagram và software context class diagram với đúng stereotype;</li>
<li>suy ra entity class và thuộc tính từ use case, và đọc được bội số;</li>
<li>xếp bất kỳ class nào của đồ án vào một trong bốn nhóm của COMET;</li>
<li>biến main flow của một use case thành communication diagram có đánh số.</li>
</ul></div>`),
    walkHead(G, 12, 23, 'The examples are Gomaa\'s ATM/Banking and online-shopping systems plus a Wiegers context diagram; each card translates them to the G5 Job IT for Freelancer system.', 'Ví dụ là hệ thống ATM/Banking và bán hàng online của Gomaa cùng một context diagram của Wiegers; mỗi thẻ dịch chúng sang hệ thống G5 Job IT for Freelancer.'),
    walk(G, R32),
    bi(`<h2>🔧 Worked example — analysing "Apply job" (G5 Job IT for Freelancer)</h2>
<p>The G5 RDS lists the screen <em>Apply Job</em> (Freelancer feature 2.6) and the table <code>JobApply(applyID, freelanceID, postID, status, dateApply, Resume)</code>. Below is the analysis a member would do in Iteration 1 before coding that screen.</p>
<p class="nhan">Step 1 — main flow of the use case (our reconstruction)</p>
<ol>
<li>The Freelancer opens a job post and clicks <em>Apply</em>, attaching a CV file.</li>
<li>The system checks that the user is logged in with role Freelancer.</li>
<li>The system checks the post is still open (BR-05) and that this freelancer has not applied yet.</li>
<li>The system stores the application with status 0 (pending) and today's date.</li>
<li>The system shows "Applied successfully" and the application appears in <em>List Apply</em>.</li>
</ol>
<p class="nhan">Step 2 — classify the objects</p>
<table><thead><tr><th>Object</th><th>Category</th><th>Why</th></tr></thead><tbody>
<tr><td><code>: PostDetailPage</code> (post-detail.jsp)</td><td>«user interaction»</td><td>shows the post, collects the click + file</td></tr>
<tr><td><code>: ApplyJobController</code></td><td>«coordinator»</td><td>runs the steps in order, owns no data</td></tr>
<tr><td><code>: ApplyRules</code> (JobApplyService)</td><td>«business logic»</td><td>BR-05 and "apply once" may change without the table changing</td></tr>
<tr><td><code>: Post</code>, <code>: JobApply</code></td><td>«entity»</td><td>persistent data</td></tr>
</tbody></table>`,
`<h2>🔧 Ví dụ có lời giải — phân tích "Apply job" (G5 Job IT for Freelancer)</h2>
<p>RDS của G5 liệt kê màn hình <em>Apply Job</em> (Freelancer feature 2.6) và bảng <code>JobApply(applyID, freelanceID, postID, status, dateApply, Resume)</code>. Dưới đây là phần phân tích một thành viên làm ở Iteration 1 trước khi code màn hình đó.</p>
<p class="nhan">Bước 1 — main flow của use case (nhóm biên soạn tự dựng lại)</p>
<ol>
<li>Freelancer mở một bài tuyển dụng và bấm <em>Apply</em>, đính kèm file CV.</li>
<li>Hệ thống kiểm tra người dùng đã đăng nhập với vai trò Freelancer.</li>
<li>Hệ thống kiểm tra bài còn hạn (BR-05) và freelancer này chưa apply.</li>
<li>Hệ thống lưu đơn với status 0 (chờ duyệt) và ngày hôm nay.</li>
<li>Hệ thống báo "Applied successfully" và đơn xuất hiện trong <em>List Apply</em>.</li>
</ol>
<p class="nhan">Bước 2 — phân loại object</p>
<table><thead><tr><th>Object</th><th>Nhóm</th><th>Vì sao</th></tr></thead><tbody>
<tr><td><code>: PostDetailPage</code> (post-detail.jsp)</td><td>«user interaction»</td><td>hiện bài đăng, nhận cú bấm + file</td></tr>
<tr><td><code>: ApplyJobController</code></td><td>«coordinator»</td><td>chạy các bước theo thứ tự, không sở hữu dữ liệu</td></tr>
<tr><td><code>: ApplyRules</code> (JobApplyService)</td><td>«business logic»</td><td>BR-05 và "apply một lần" có thể đổi mà bảng không đổi</td></tr>
<tr><td><code>: Post</code>, <code>: JobApply</code></td><td>«entity»</td><td>dữ liệu lưu bền</td></tr>
</tbody></table>`),
    bi(`<p class="nhan">Step 3 — communication diagram (text form)</p>
<pre>
 aFreelancer
   | A1: Apply(postID, cvFile)          ^ A9: "Applied successfully"
   v                                    |
 «user interaction» : PostDetailPage ---+
   | A2: Apply Request                  ^ A8: Apply Result
   v                                    |
 «coordinator» : ApplyJobController ----+
   | A3: Check Apply(freelancer, post)  ^ A6: OK / Refused(reason)
   v                                    |
 «business logic» : ApplyRules ---------+
   | A4: Post Info (read)       | A5: Existing Apply? (read)
   v                            v
 «entity» : Post          «entity» : JobApply
                                ^ A7: Store Apply (status 0, today)
                                | (sent by the coordinator after A6 = OK)
</pre>
<p>Every message traces to a UC step: A1–A2 = step 1, A3–A6 = steps 2–3, A7 = step 4, A8–A9 = step 5. In Lesson 3.4 these messages become operations such as <code>checkApply(freelanceID, postID)</code> and <code>insert(JobApply)</code>; in Lesson 3.5 they become the sequence diagram of the SDS.</p>
<h3>Common mistakes that lose marks</h3>
<ul>
<li><strong>Context diagram with internal parts</strong> — tables, servlets or "Login module" drawn inside or around the box. The context diagram shows only the black box and the outside world.</li>
<li><strong>Entity classes named after screens</strong> — "ApplyJobPage" is not an entity; "JobApply" is.</li>
<li><strong>Messages that do not come from the UC</strong> — a reviewer asks "which step of your use case is this?"; have the answer.</li>
<li><strong>Control object doing the rules</strong> — the coordinator should call the rule, not contain twenty if-statements.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Robustness analysis (ICONIX).</strong> Jacobson's boundary–control–entity split, which COMET refines, is used in the ICONIX process as a "robustness diagram": a quick sketch that must obey four rules — actors talk only to boundaries, boundaries only to controls, controls to entities and other controls, entities never to boundaries. Checking your communication diagrams against these rules finds missing controllers and JSPs that query the database directly before any code exists.</div>`,
`<p class="nhan">Bước 3 — communication diagram (dạng chữ)</p>
<pre>
 aFreelancer
   | A1: Apply(postID, cvFile)          ^ A9: "Applied successfully"
   v                                    |
 «user interaction» : PostDetailPage ---+
   | A2: Apply Request                  ^ A8: Apply Result
   v                                    |
 «coordinator» : ApplyJobController ----+
   | A3: Check Apply(freelancer, post)  ^ A6: OK / Refused(lý do)
   v                                    |
 «business logic» : ApplyRules ---------+
   | A4: Post Info (đọc)        | A5: Existing Apply? (đọc)
   v                            v
 «entity» : Post          «entity» : JobApply
                                ^ A7: Store Apply (status 0, hôm nay)
                                | (coordinator gửi sau khi A6 = OK)
</pre>
<p>Mọi message truy về một bước của UC: A1–A2 = bước 1, A3–A6 = bước 2–3, A7 = bước 4, A8–A9 = bước 5. Ở Bài 3.4 các message này thành operation như <code>checkApply(freelanceID, postID)</code> và <code>insert(JobApply)</code>; ở Bài 3.5 chúng thành sequence diagram của SDS.</p>
<h3>Lỗi thường gặp làm mất điểm</h3>
<ul>
<li><strong>Context diagram có phần bên trong</strong> — vẽ bảng, servlet hay "Login module" trong hoặc quanh hộp. Context diagram chỉ có hộp đen và thế giới bên ngoài.</li>
<li><strong>Entity class đặt tên theo màn hình</strong> — "ApplyJobPage" không phải entity; "JobApply" mới là.</li>
<li><strong>Message không đến từ UC</strong> — hội đồng hỏi "đây là bước nào của use case?"; phải trả lời được.</li>
<li><strong>Control object ôm luật nghiệp vụ</strong> — coordinator nên gọi luật, không chứa hai mươi câu if.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Robustness analysis (ICONIX).</strong> Cách chia boundary–control–entity của Jacobson, mà COMET tinh chỉnh, được quy trình ICONIX dùng làm "robustness diagram": một bản phác nhanh phải tuân bốn luật — actor chỉ nói với boundary, boundary chỉ nói với control, control nói với entity và control khác, entity không bao giờ nói với boundary. Soi communication diagram theo bốn luật này sẽ lộ ra controller bị thiếu và JSP truy vấn CSDL trực tiếp trước khi có dòng code nào.</div>`),
    books([
      ['gomaa', 'Ch. 2 (Overview of UML notation), Ch. 7 (Static modeling), Ch. 8 (Object and class structuring), Ch. 9 (Dynamic interaction modeling)', 'Ch. 2 (Tổng quan ký pháp UML), Ch. 7 (Mô hình tĩnh), Ch. 8 (Cấu trúc hoá object & class), Ch. 9 (Mô hình tương tác động)'],
      ['wiegers', 'Ch. 5 (Establishing the business requirements — context diagram), Ch. 13 (Specifying data requirements)', 'Ch. 5 (Xác lập yêu cầu nghiệp vụ — context diagram), Ch. 13 (Đặc tả yêu cầu dữ liệu)'],
      ['sommerville', 'Ch. 5 (System modeling) — context, interaction, structural models', 'Ch. 5 (System modeling) — mô hình context, tương tác, cấu trúc'],
    ]),
// @C32
  ].join('\n'),
};

/* ─────────────── 3.3 Software architecture (g-design 24–35) — kept slug ─────────────── */
const R33 = [
  [24, 'Software architecture — architectural design',
    `<p class="y-chinh">🎯 Architectural design identifies the sub-systems and how they are controlled and communicate — the first, biggest design decision.</p>
<ul>
<li><strong>Definition</strong> — the process of identifying the sub-systems of a system and the framework for their control and communication.</li>
<li><strong>Early</strong> — it is an early stage of design and the <em>link</em> between specification and design.</li>
<li><strong>In parallel</strong> — often done while some requirements are still being written (true in Iteration 1).</li>
<li><strong>Output</strong> — the major components and their communications.</li>
</ul>
<p class="nhan">For your team — decide in week 1–2 of Iteration 1</p>
<ul>
<li><strong>Stack</strong> — JSP/Servlet + JDBC + MySQL (recommended) or Spring Boot (+ React).</li>
<li><strong>Packages</strong> — controller / service / dal (DAO) / model / util / filter.</li>
<li><strong>Shared skeleton</strong> — DBContext, a base DAO, login filter, common layout JSP — built once by the leader so all members code on the same frame.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Five members, five architectures.</strong> If each member invents his own folder layout and DB connection code, merging on GitLab becomes a nightmare and the "design" section cannot describe the system. Agree on the skeleton before anyone codes a screen.</div>`,
    `<p class="y-chinh">🎯 Thiết kế kiến trúc xác định các sub-system và cách chúng được điều khiển, giao tiếp — quyết định thiết kế đầu tiên và lớn nhất.</p>
<ul>
<li><strong>Định nghĩa</strong> — quá trình xác định các sub-system của hệ thống và khung điều khiển, giao tiếp giữa chúng.</li>
<li><strong>Sớm</strong> — là giai đoạn đầu của thiết kế và là <em>cầu nối</em> giữa đặc tả và thiết kế.</li>
<li><strong>Song song</strong> — thường làm khi một số yêu cầu vẫn đang được viết (đúng với Iteration 1).</li>
<li><strong>Đầu ra</strong> — các thành phần chính và giao tiếp giữa chúng.</li>
</ul>
<p class="nhan">Với nhóm bạn — chốt trong tuần 1–2 của Iteration 1</p>
<ul>
<li><strong>Stack</strong> — JSP/Servlet + JDBC + MySQL (khuyến nghị) hoặc Spring Boot (+ React).</li>
<li><strong>Package</strong> — controller / service / dal (DAO) / model / util / filter.</li>
<li><strong>Khung dùng chung</strong> — DBContext, base DAO, login filter, JSP layout chung — leader dựng một lần để mọi thành viên code trên cùng một khung.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Năm thành viên, năm kiến trúc.</strong> Nếu mỗi người tự nghĩ cấu trúc thư mục và code kết nối CSDL riêng, merge trên GitLab thành ác mộng và mục "design" không mô tả nổi hệ thống. Thống nhất khung trước khi ai đó code màn hình đầu tiên.</div>`],
  [25, 'Architectural design decisions — eight questions',
    `<p class="y-chinh">🎯 Eight questions every architect answers — your SDS section 1.1 should answer them for your project.</p>
<table><thead><tr><th>Question</th><th>Typical SWP391 answer</th></tr></thead><tbody>
<tr><td>Is there a generic application architecture to reuse?</td><td>yes — a web MVC / layered template, one of the teacher's UI themes (AdminLTE, DashMin…)</td></tr>
<tr><td>How will the system be distributed?</td><td>browser ↔ one Tomcat server ↔ one MySQL server</td></tr>
<tr><td>Which architectural styles?</td><td>MVC + layered (+ client–server if React)</td></tr>
<tr><td>What approach to structure the system?</td><td>by layer, then by feature inside each layer</td></tr>
<tr><td>How to decompose into modules?</td><td>one package per layer; one controller + DAO per feature</td></tr>
<tr><td>What control strategy?</td><td>request-driven: each HTTP request is handled by one controller</td></tr>
<tr><td>How will the architecture be evaluated?</td><td>teacher review per iteration, performance of list pages, security (login filter, roles)</td></tr>
<tr><td>How should it be documented?</td><td>SDS 1.1 architecture diagram + 1.2 package diagram and table</td></tr>
</tbody></table>`,
    `<p class="y-chinh">🎯 Tám câu hỏi mà kiến trúc sư nào cũng trả lời — mục 1.1 của SDS nên trả lời chúng cho đồ án của bạn.</p>
<table><thead><tr><th>Câu hỏi</th><th>Câu trả lời điển hình trong SWP391</th></tr></thead><tbody>
<tr><td>Có kiến trúc ứng dụng chung nào để dùng lại không?</td><td>có — mẫu web MVC / phân tầng, một UI theme của thầy/cô (AdminLTE, DashMin…)</td></tr>
<tr><td>Hệ thống phân bố thế nào?</td><td>trình duyệt ↔ một server Tomcat ↔ một server MySQL</td></tr>
<tr><td>Dùng kiểu kiến trúc nào?</td><td>MVC + phân tầng (+ client–server nếu dùng React)</td></tr>
<tr><td>Cấu trúc hệ thống theo cách nào?</td><td>theo tầng, rồi theo tính năng trong mỗi tầng</td></tr>
<tr><td>Chia module ra sao?</td><td>mỗi tầng một package; mỗi tính năng một controller + DAO</td></tr>
<tr><td>Chiến lược điều khiển nào?</td><td>theo request: mỗi HTTP request do một controller xử lý</td></tr>
<tr><td>Đánh giá kiến trúc thế nào?</td><td>thầy/cô review mỗi iteration, hiệu năng trang danh sách, bảo mật (login filter, phân quyền)</td></tr>
<tr><td>Tài liệu hoá ra sao?</td><td>SDS 1.1 sơ đồ kiến trúc + 1.2 package diagram và bảng mô tả</td></tr>
</tbody></table>`],
  [26, 'The MVC pattern (1/3) — pattern description table',
    `<p class="y-chinh">🎯 MVC separates presentation and interaction from the system data, in three logical components.</p>
<p class="nhan">The three components</p>
<ul>
<li><strong>Model</strong> — manages the system data and the operations on it.</li>
<li><strong>View</strong> — defines and manages how data is presented to the user.</li>
<li><strong>Controller</strong> — manages user interaction (clicks, key presses) and passes it to the View and the Model.</li>
</ul>
<p class="nhan">The rest of the pattern card</p>
<ul>
<li><strong>When used</strong> — multiple ways to view and interact with the same data; future interaction/presentation requirements unknown.</li>
<li><strong>Advantages</strong> — data changes independently of its representation; the same data can be shown several ways, a change in one shows in all.</li>
<li><strong>Disadvantages</strong> — extra code and complexity when the data model and interactions are simple.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> every architecture slide in this deck uses the same card — Name · Description · Example · When used · Advantages · Disadvantages (Sommerville's pattern format). Exam and defence questions ask for exactly these rows.</p>`,
    `<p class="y-chinh">🎯 MVC tách phần trình bày và tương tác khỏi dữ liệu hệ thống, thành ba thành phần logic.</p>
<p class="nhan">Ba thành phần</p>
<ul>
<li><strong>Model</strong> — quản lý dữ liệu hệ thống và các thao tác trên nó.</li>
<li><strong>View</strong> — định nghĩa và quản lý cách dữ liệu hiển thị cho người dùng.</li>
<li><strong>Controller</strong> — quản lý tương tác người dùng (click, gõ phím) và chuyển nó tới View và Model.</li>
</ul>
<p class="nhan">Phần còn lại của thẻ mẫu</p>
<ul>
<li><strong>When used</strong> — có nhiều cách xem và tương tác với cùng dữ liệu; chưa biết yêu cầu tương tác/trình bày tương lai.</li>
<li><strong>Advantages</strong> — dữ liệu đổi độc lập với cách hiển thị; cùng dữ liệu hiện nhiều cách, đổi ở một chỗ thì mọi chỗ đều thấy.</li>
<li><strong>Disadvantages</strong> — thêm code và độ phức tạp khi mô hình dữ liệu và tương tác đơn giản.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mọi slide kiến trúc trong bộ này dùng cùng một thẻ — Name · Description · Example · When used · Advantages · Disadvantages (định dạng pattern của Sommerville). Câu hỏi thi và bảo vệ hỏi đúng các dòng này.</p>`],
  [27, 'The MVC pattern (2/3) — organisation of Model-View-Controller',
    `<p class="y-chinh">🎯 Five arrows define MVC: who tells whom what.</p>
<ol>
<li><strong>User Events</strong> — View → Controller (the user clicked).</li>
<li><strong>State Change</strong> — Controller → Model ("maps user actions to model updates").</li>
<li><strong>Change Notification</strong> — Model → View ("notifies view of state changes").</li>
<li><strong>State Query</strong> — View → Model (the view reads data to render).</li>
<li><strong>View Selection</strong> — Controller → View (which page to show next).</li>
</ol>
<p class="nhan">In a Servlet/JSP app</p>
<ul>
<li><strong>Controller</strong> — the servlet's <code>doGet</code>/<code>doPost</code>.</li>
<li><strong>View Selection</strong> — <code>request.getRequestDispatcher("list-apply.jsp").forward(...)</code> or <code>response.sendRedirect(...)</code>.</li>
<li><strong>Change notification</strong> — on the web there is no push: the controller puts the model into request attributes and the JSP reads them (State Query via <code>\${applies}</code>).</li>
</ul>`,
    `<p class="y-chinh">🎯 Năm mũi tên định nghĩa MVC: ai báo cho ai điều gì.</p>
<ol>
<li><strong>User Events</strong> — View → Controller (người dùng vừa bấm).</li>
<li><strong>State Change</strong> — Controller → Model ("ánh xạ thao tác người dùng thành cập nhật model").</li>
<li><strong>Change Notification</strong> — Model → View ("báo cho view biết trạng thái đổi").</li>
<li><strong>State Query</strong> — View → Model (view đọc dữ liệu để vẽ).</li>
<li><strong>View Selection</strong> — Controller → View (hiện trang nào tiếp theo).</li>
</ol>
<p class="nhan">Trong ứng dụng Servlet/JSP</p>
<ul>
<li><strong>Controller</strong> — <code>doGet</code>/<code>doPost</code> của servlet.</li>
<li><strong>View Selection</strong> — <code>request.getRequestDispatcher("list-apply.jsp").forward(...)</code> hoặc <code>response.sendRedirect(...)</code>.</li>
<li><strong>Change notification</strong> — trên web không có đẩy: controller đặt model vào request attribute và JSP đọc ra (State Query qua <code>\${applies}</code>).</li>
</ul>`],
  [28, 'The MVC pattern (3/3) — web application architecture using MVC',
    `<p class="y-chinh">🎯 On the web, MVC becomes: Browser → Controller servlet → Model (business logic + DB) → View JSP → Browser.</p>
<p class="nhan">Left figure — responsibilities</p>
<ul>
<li><strong>Controller</strong> — HTTP request processing, application-specific logic, data validation.</li>
<li><strong>View</strong> — dynamic page generation, forms management.</li>
<li><strong>Model</strong> — business logic and database.</li>
<li><strong>Arrows</strong> — Update Request (controller → model), Refresh Request (view → model), Form to Display, User Events.</li>
</ul>
<p class="nhan">Right figure — a concrete Java example</p>
<ol>
<li>Browser sends an <strong>HTTP request</strong> to <code>AddToEmailListServlet</code> (Controller).</li>
<li>The servlet uses the Model: <code>User</code> (bean) and <code>UserIO</code> (data access) ↔ Data store.</li>
<li>The servlet forwards to <code>show_email_entry.jsp</code> (View), which returns the <strong>HTTP response</strong>.</li>
</ol>
<p class="ghi-chu">This is exactly the PRJ301 structure you already know — SWP391 expects it, not a new framework.</p>`,
    `<p class="y-chinh">🎯 Trên web, MVC trở thành: Browser → servlet Controller → Model (business logic + DB) → JSP View → Browser.</p>
<p class="nhan">Hình trái — trách nhiệm</p>
<ul>
<li><strong>Controller</strong> — xử lý HTTP request, logic riêng của ứng dụng, validate dữ liệu.</li>
<li><strong>View</strong> — sinh trang động, quản lý form.</li>
<li><strong>Model</strong> — business logic và database.</li>
<li><strong>Mũi tên</strong> — Update Request (controller → model), Refresh Request (view → model), Form to Display, User Events.</li>
</ul>
<p class="nhan">Hình phải — ví dụ Java cụ thể</p>
<ol>
<li>Browser gửi <strong>HTTP request</strong> tới <code>AddToEmailListServlet</code> (Controller).</li>
<li>Servlet dùng Model: <code>User</code> (bean) và <code>UserIO</code> (truy cập dữ liệu) ↔ Data store.</li>
<li>Servlet forward sang <code>show_email_entry.jsp</code> (View), trang này trả <strong>HTTP response</strong>.</li>
</ol>
<p class="ghi-chu">Đây đúng là cấu trúc PRJ301 bạn đã biết — SWP391 mong đợi nó, không phải một framework mới.</p>`],
  [29, 'The layered architecture (1/3)',
    `<p class="y-chinh">🎯 Layers stack services: each layer serves the one above, and a change to a layer's interface affects only the adjacent layer.</p>
<ul>
<li><strong>Purpose</strong> — models the interfacing of sub-systems; organises the system into layers (abstract machines), each providing a set of services.</li>
<li><strong>Incremental</strong> — supports developing sub-systems in different layers incrementally.</li>
</ul>
<p class="nhan">The generic stack on the slide (top → bottom)</p>
<ol>
<li>User Interface</li>
<li>User Interface Management · Authentication and Authorization</li>
<li>Core Business Logic / Application Functionality · System Utilities</li>
<li>System Support (OS, Database, etc.)</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> MVC answers "who handles a request?"; layers answer "who may call whom?". Your project uses both at once.</p>`,
    `<p class="y-chinh">🎯 Các tầng xếp chồng dịch vụ: mỗi tầng phục vụ tầng trên nó, và đổi interface của một tầng chỉ ảnh hưởng tầng kề bên.</p>
<ul>
<li><strong>Mục đích</strong> — mô hình hoá giao tiếp giữa các sub-system; tổ chức hệ thống thành các tầng (máy trừu tượng), mỗi tầng cung cấp một nhóm dịch vụ.</li>
<li><strong>Tăng dần</strong> — hỗ trợ phát triển tăng dần các sub-system ở những tầng khác nhau.</li>
</ul>
<p class="nhan">Chồng tầng tổng quát trên slide (trên → dưới)</p>
<ol>
<li>User Interface</li>
<li>User Interface Management · Authentication and Authorization</li>
<li>Core Business Logic / Application Functionality · System Utilities</li>
<li>System Support (OS, Database, etc.)</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> MVC trả lời "ai xử lý request?"; phân tầng trả lời "ai được gọi ai?". Đồ án của bạn dùng cả hai cùng lúc.</p>`],
  [30, 'The layered architecture (2/3) — pattern description table',
    `<p class="y-chinh">🎯 The layered pattern card: each layer offers services to the layer above; the lowest layers are core services used everywhere.</p>
<ul>
<li><strong>Example</strong> — a layered model of a web system (an online shop, a management system — i.e. your project).</li>
<li><strong>When used</strong> — building on top of existing systems; development split across teams, each owning a layer; multi-level security requirements.</li>
<li><strong>Advantages</strong> — a whole layer can be replaced as long as its interface is kept; redundant facilities (e.g. authentication) in several layers raise dependability.</li>
<li><strong>Disadvantages</strong> — clean separation is hard in practice (a high layer may call a low one directly); performance cost of passing each request through every layer.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Splitting the team by layer.</strong> The card says layers suit teams owning a layer — but SWP391 grades each member on full-stack LOC for his/her own screens. Split the work by <em>feature</em> (screens), and let every member write code in every layer.</div>`,
    `<p class="y-chinh">🎯 Thẻ mẫu phân tầng: mỗi tầng cung cấp dịch vụ cho tầng trên; các tầng thấp nhất là dịch vụ lõi dùng khắp nơi.</p>
<ul>
<li><strong>Example</strong> — mô hình phân tầng của một web system (shop online, hệ thống quản lý — tức đồ án của bạn).</li>
<li><strong>When used</strong> — xây trên hệ thống sẵn có; phát triển chia cho nhiều nhóm, mỗi nhóm giữ một tầng; yêu cầu bảo mật nhiều cấp.</li>
<li><strong>Advantages</strong> — thay được cả một tầng miễn giữ nguyên interface; chức năng dự phòng (ví dụ xác thực) ở nhiều tầng làm hệ thống tin cậy hơn.</li>
<li><strong>Disadvantages</strong> — thực tế khó tách sạch (tầng cao có thể gọi thẳng tầng thấp); tốn hiệu năng vì request phải đi qua từng tầng.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Chia nhóm theo tầng.</strong> Thẻ mẫu nói phân tầng hợp với các nhóm giữ từng tầng — nhưng SWP391 chấm mỗi thành viên theo LOC full-stack cho màn hình của chính mình. Hãy chia việc theo <em>tính năng</em> (màn hình), và để mọi thành viên viết code ở mọi tầng.</div>`],
  [31, 'The layered architecture (3/3) — web application using layers (JSP/Servlet/JDBC)',
    `<p class="y-chinh">🎯 The reference architecture for your project: the same picture appears as the sample in SDS section 1.1.</p>
<p class="nhan">Inside "XYZ Application (JSP/Servlet/JDBC)"</p>
<ul>
<li><strong>Presentation Logic Layer (Servlet/Controller)</strong> — receives the HTTP request from the Web Browser; may call an external System NameX.</li>
<li><strong>User Interface (JSP, CSS, JS, Bootstrap)</strong> — renders the HTTP response.</li>
<li><strong>Service Layer (Java)</strong> — business logic.</li>
<li><strong>Data Access Layer (JDBC)</strong> — the only layer that talks to the XYZ Database (MySQL).</li>
<li><strong>Model Classes, Common Classes (Java)</strong> — used by every layer (beans, utilities).</li>
</ul>
<p class="nhan">Arrow rules</p>
<ul>
<li><strong>Solid arrows go down</strong> — controller → service → data access → database; dashed arrows are the returns.</li>
<li><strong>Nobody skips</strong> — the JSP never opens a JDBC connection.</li>
</ul>
<p class="nhan">G5 mapping</p>
<p>G5 used three packages — <code>Controller</code>, <code>Models</code>, <code>Dal</code> (DBContext + DAO) — i.e. no separate service layer; its business rules sat inside servlets. Acceptable for a small system, but adding a <code>service</code> package is what the slide recommends.</p>`,
    `<p class="y-chinh">🎯 Kiến trúc tham chiếu cho đồ án: đúng hình này xuất hiện làm mẫu ở mục 1.1 của SDS.</p>
<p class="nhan">Bên trong "XYZ Application (JSP/Servlet/JDBC)"</p>
<ul>
<li><strong>Presentation Logic Layer (Servlet/Controller)</strong> — nhận HTTP request từ Web Browser; có thể gọi hệ thống ngoài System NameX.</li>
<li><strong>User Interface (JSP, CSS, JS, Bootstrap)</strong> — vẽ HTTP response.</li>
<li><strong>Service Layer (Java)</strong> — business logic.</li>
<li><strong>Data Access Layer (JDBC)</strong> — tầng duy nhất nói chuyện với XYZ Database (MySQL).</li>
<li><strong>Model Classes, Common Classes (Java)</strong> — mọi tầng đều dùng (bean, tiện ích).</li>
</ul>
<p class="nhan">Luật mũi tên</p>
<ul>
<li><strong>Mũi tên liền đi xuống</strong> — controller → service → data access → database; mũi tên đứt là chiều trả về.</li>
<li><strong>Không ai nhảy cóc</strong> — JSP không bao giờ mở kết nối JDBC.</li>
</ul>
<p class="nhan">Đối chiếu G5</p>
<p>G5 dùng ba package — <code>Controller</code>, <code>Models</code>, <code>Dal</code> (DBContext + DAO) — tức không có tầng service riêng; business rule nằm trong servlet. Chấp nhận được với hệ thống nhỏ, nhưng thêm package <code>service</code> mới là điều slide khuyến nghị.</p>`],
  [32, 'The client–server architecture (1/3) — a film library',
    `<p class="y-chinh">🎯 Client–server distributes data and processing: stand-alone servers offer services, clients call them over a network.</p>
<p class="nhan">Three elements</p>
<ul>
<li><strong>Servers</strong> — stand-alone, each providing a specific service (printing, data management…).</li>
<li><strong>Clients</strong> — call on these services.</li>
<li><strong>Network</strong> — lets clients reach servers (it can even all run on one computer).</li>
</ul>
<p class="nhan">Read the film-library figure</p>
<p>Clients 1–4 reach, over the Internet, a Catalogue Server (Library Catalogue), Video Server (Film Store), Picture Server (Photo Store) and Web Server (Film and Photo Info). Each server owns its own data store.</p>`,
    `<p class="y-chinh">🎯 Client–server phân bố dữ liệu và xử lý: các server độc lập cung cấp dịch vụ, client gọi chúng qua mạng.</p>
<p class="nhan">Ba thành phần</p>
<ul>
<li><strong>Server</strong> — độc lập, mỗi cái cung cấp một dịch vụ cụ thể (in ấn, quản lý dữ liệu…).</li>
<li><strong>Client</strong> — gọi các dịch vụ đó.</li>
<li><strong>Mạng</strong> — cho client tới được server (thậm chí có thể chạy chung trên một máy).</li>
</ul>
<p class="nhan">Đọc hình thư viện phim</p>
<p>Client 1–4 qua Internet tới Catalogue Server (Library Catalogue), Video Server (Film Store), Picture Server (Photo Store) và Web Server (Film and Photo Info). Mỗi server có kho dữ liệu riêng.</p>`],
  [33, 'The client–server architecture (2/3) — pattern description table',
    `<p class="y-chinh">🎯 The client–server card: functionality is organised into services, each delivered by a separate server.</p>
<ul>
<li><strong>When used</strong> — data in a shared database must be accessed from many locations; servers can be replicated when the load varies.</li>
<li><strong>Advantages</strong> — servers can be distributed across a network; general functionality (e.g. printing) is available to all clients and need not be implemented by every service.</li>
<li><strong>Disadvantages</strong> — each service is a single point of failure (denial of service, server crash); performance depends on the network; management problems if servers belong to different organisations.</li>
</ul>
<p class="nhan">For your team</p>
<p>Every web project is client–server at the top level (browser = client, Tomcat + MySQL = servers). Name it explicitly in SDS 1.1 only if you really have separate servers — e.g. a React client calling a REST backend (next slide).</p>`,
    `<p class="y-chinh">🎯 Thẻ mẫu client–server: chức năng được tổ chức thành dịch vụ, mỗi dịch vụ do một server riêng cung cấp.</p>
<ul>
<li><strong>When used</strong> — dữ liệu trong CSDL dùng chung phải được truy cập từ nhiều nơi; nhân bản server khi tải thay đổi.</li>
<li><strong>Advantages</strong> — server phân bố được trên mạng; chức năng chung (ví dụ in) có sẵn cho mọi client và không cần mọi dịch vụ tự làm.</li>
<li><strong>Disadvantages</strong> — mỗi dịch vụ là một điểm lỗi duy nhất (từ chối dịch vụ, sập server); hiệu năng phụ thuộc mạng; khó quản lý nếu server thuộc nhiều tổ chức.</li>
</ul>
<p class="nhan">Với nhóm bạn</p>
<p>Mọi web project ở mức cao nhất đều là client–server (trình duyệt = client, Tomcat + MySQL = server). Chỉ ghi rõ nó trong SDS 1.1 nếu thật sự có server tách biệt — ví dụ client React gọi backend REST (slide sau).</p>`],
  [34, 'The client–server architecture (3/3) — React + Spring Boot web application',
    `<p class="y-chinh">🎯 A modern split: a React client and a Spring Boot server exchange JSON over HTTP (axios), and only the server touches MySQL.</p>
<p class="nhan">Three pictures</p>
<ul>
<li><strong>Top left</strong> — Web and Mobile clients share one Shopping Application (Store, Config, Cart…) and one DB.</li>
<li><strong>Top right</strong> — React App (client) ↔ axios HTTP library ↔ Spring Boot App (server).</li>
<li><strong>Bottom</strong> — React: Router → Components → Service; Axios; Spring: Rest Controller → Spring Data JPA → MySQL.</li>
</ul>
<p class="nhan">Should your team do this?</p>
<ul>
<li><strong>Allowed</strong> — the subject recommends Java; a React + Spring Boot split is still Java on the server.</li>
<li><strong>Cost</strong> — two projects, CORS, token auth, API documentation; LOC is counted per screen either way.</li>
<li><strong>Design impact</strong> — you must add an API design (endpoints, JSON formats) to the SDS — see the REST section below.</li>
</ul>
<p class="ghi-chu">The speaker notes link two tutorials: a Spring Boot + React CRUD example and a microservices-with-Spring-Boot article.</p>`,
    `<p class="y-chinh">🎯 Cách tách hiện đại: client React và server Spring Boot trao đổi JSON qua HTTP (axios), và chỉ server chạm tới MySQL.</p>
<p class="nhan">Ba hình</p>
<ul>
<li><strong>Trên trái</strong> — client Web và Mobile dùng chung một Shopping Application (Store, Config, Cart…) và một DB.</li>
<li><strong>Trên phải</strong> — React App (client) ↔ thư viện axios HTTP ↔ Spring Boot App (server).</li>
<li><strong>Dưới</strong> — React: Router → Components → Service; Axios; Spring: Rest Controller → Spring Data JPA → MySQL.</li>
</ul>
<p class="nhan">Nhóm bạn có nên làm vậy?</p>
<ul>
<li><strong>Được phép</strong> — môn học khuyến nghị Java; tách React + Spring Boot vẫn là Java ở server.</li>
<li><strong>Chi phí</strong> — hai project, CORS, xác thực bằng token, tài liệu API; LOC vẫn tính theo màn hình.</li>
<li><strong>Ảnh hưởng thiết kế</strong> — phải thêm thiết kế API (endpoint, định dạng JSON) vào SDS — xem phần REST bên dưới.</li>
</ul>
<p class="ghi-chu">Ghi chú của slide dẫn hai bài hướng dẫn: ví dụ CRUD Spring Boot + React và một bài microservices với Spring Boot.</p>`],
  [35, 'Package diagrams — a layered application',
    `<p class="y-chinh">🎯 A package diagram groups classes into folders and shows which package depends on which (dashed arrows).</p>
<p class="nhan">UML notation (speaker notes)</p>
<ul>
<li><strong>Package</strong> — a folder icon: large rectangle with a small tab; can be nested.</li>
<li><strong>Relationships</strong> — dependency (dashed arrow) and generalisation; packages may contain classes, objects or use cases.</li>
</ul>
<p class="nhan">Read the figure</p>
<ul>
<li><strong>Presentation Layer</strong> (User Interface, Presentation Logic) — used by Users.</li>
<li><strong>Services Layer</strong> — entry point for External Systems.</li>
<li><strong>Business Layer</strong> — Application Facade over Business Workflow, Business Components, Business Entities.</li>
<li><strong>Data Layer</strong> — Data Access → Data Sources; Service Agents → External Services.</li>
<li><strong>Common</strong> (Security, Communication) — used by every layer.</li>
</ul>
<p class="nhan">Your SDS 1.2</p>
<pre>
[view (JSP)] - - -&gt; [controller] - - -&gt; [service] - - -&gt; [dal] - - -&gt; (MySQL)
                         \\              |             /
                          - - - - - &gt; [model] &lt; - - -
[filter] - - -&gt; [dal]          [util] &lt; - - - (all)
</pre>
<p>Then the <em>Package descriptions</em> table: No · Package · Description (Lesson 3.5).</p>`,
    `<p class="y-chinh">🎯 Package diagram gom class vào các thư mục và cho thấy package nào phụ thuộc package nào (mũi tên đứt).</p>
<p class="nhan">Ký pháp UML (ghi chú của slide)</p>
<ul>
<li><strong>Package</strong> — biểu tượng thư mục: hình chữ nhật lớn có một tab nhỏ; có thể lồng nhau.</li>
<li><strong>Quan hệ</strong> — dependency (mũi tên đứt) và generalization; package có thể chứa class, object hoặc use case.</li>
</ul>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Presentation Layer</strong> (User Interface, Presentation Logic) — do Users dùng.</li>
<li><strong>Services Layer</strong> — cửa vào cho External Systems.</li>
<li><strong>Business Layer</strong> — Application Facade đứng trước Business Workflow, Business Components, Business Entities.</li>
<li><strong>Data Layer</strong> — Data Access → Data Sources; Service Agents → External Services.</li>
<li><strong>Common</strong> (Security, Communication) — mọi tầng đều dùng.</li>
</ul>
<p class="nhan">Mục 1.2 SDS của bạn</p>
<pre>
[view (JSP)] - - -&gt; [controller] - - -&gt; [service] - - -&gt; [dal] - - -&gt; (MySQL)
                         \\              |             /
                          - - - - - &gt; [model] &lt; - - -
[filter] - - -&gt; [dal]          [util] &lt; - - - (all)
</pre>
<p>Kèm bảng <em>Package descriptions</em>: No · Package · Description (Bài 3.5).</p>`],
// @R33
];
const L33 = {
  title: '3.3 — Software architecture: MVC, layered, client–server, package diagrams & REST API design|||3.3 — Kiến trúc phần mềm: MVC, phân tầng, client–server, package diagram & thiết kế REST API',
  slug: 'swp391-3-2-mvc-api',
  type: 'VIDEO',
  description: 'Slide3 trang 24–35: các quyết định kiến trúc, mẫu MVC, kiến trúc phân tầng, client–server (JSP/Servlet và React + Spring Boot), package diagram — kèm thiết kế REST API và cấu trúc package cho đồ án.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.3 · Slide3 System Design pages 24–35</span>
<h2>Software architecture — MVC, layers, client–server and packages</h2>
<p class="lead">The architecture is the one design decision the <strong>whole team</strong> shares: it fixes where every class of every member will live. This lesson walks the architecture part of the deck — the eight design decisions, the MVC, layered and client–server patterns with their pattern cards, and package diagrams — then adds what the slides leave out: a concrete package layout, REST API design for teams that choose a React/Spring client–server stack, and the mistakes reviewers look for.</p>
<div class="callout"><strong>After this lesson you can</strong>
<ul>
<li>answer the eight architectural design questions for your project;</li>
<li>describe MVC, layered and client–server with Name · Description · When used · Advantages · Disadvantages;</li>
<li>draw the architecture diagram (SDS 1.1) and package diagram (SDS 1.2) of a JSP/Servlet system;</li>
<li>design resource-oriented REST endpoints with correct HTTP methods and status codes.</li>
</ul></div>`,
`<span class="eyebrow">Chương 3 · Bài 3.3 · Slide3 System Design trang 24–35</span>
<h2>Kiến trúc phần mềm — MVC, phân tầng, client–server và package</h2>
<p class="lead">Kiến trúc là quyết định thiết kế duy nhất mà <strong>cả nhóm</strong> dùng chung: nó chốt nơi mọi class của mọi thành viên sẽ nằm. Bài này đi qua phần kiến trúc của bộ slide — tám quyết định thiết kế, các mẫu MVC, phân tầng và client–server kèm thẻ mô tả, và package diagram — rồi bổ sung thứ slide bỏ qua: cấu trúc package cụ thể, thiết kế REST API cho nhóm chọn stack client–server React/Spring, và các lỗi hội đồng hay soi.</p>
<div class="callout"><strong>Học xong bài này bạn có thể</strong>
<ul>
<li>trả lời tám câu hỏi thiết kế kiến trúc cho đồ án của mình;</li>
<li>mô tả MVC, phân tầng và client–server theo Name · Description · When used · Advantages · Disadvantages;</li>
<li>vẽ sơ đồ kiến trúc (SDS 1.1) và package diagram (SDS 1.2) của một hệ thống JSP/Servlet;</li>
<li>thiết kế endpoint REST hướng tài nguyên với đúng HTTP method và status code.</li>
</ul></div>`),
    walkHead(G, 24, 35, 'Pages 26, 30 and 33 are pattern cards in Sommerville\'s format; pages 28, 31 and 34 show how each pattern looks in a real web application.', 'Trang 26, 30 và 33 là thẻ mẫu theo định dạng của Sommerville; trang 28, 31 và 34 cho thấy mỗi mẫu trông thế nào trong một web application thật.'),
    walk(G, R33),
    bi(`<h2>🔧 Beyond the slides — the architecture of a real SWP391 project</h2>
<h3>A package layout every member can follow (NetBeans, Java web)</h3>
<pre>
src/java/
  controller/      ApplyJobController.java, ListApplyController.java, LoginController.java …
  service/         JobApplyService.java  (business rules: BR-05 open post, apply once, BR-11)
  dal/             DBContext.java (connection), PostDAO.java, JobApplyDAO.java …
  model/           Post.java, JobApply.java, Freelancer.java … (plain beans)
  filter/          AuthFilter.java (login + role check for /freelancer/*, /recruiter/*, /admin/*)
  util/            Validator.java, FileUploadUtil.java, EmailSender.java («proxy» to SMTP)
web/
  views/freelancer/post-detail.jsp, list-apply.jsp …
  views/common/header.jsp, footer.jsp (from the chosen UI theme)
</pre>
<h3>A thin controller — the MVC arrows in code</h3>
<pre>
@WebServlet("/freelancer/apply")
public class ApplyJobController extends HttpServlet {
    private final JobApplyService service = new JobApplyService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Freelancer me = (Freelancer) req.getSession().getAttribute("freelancer"); // set at login
        int postId = Integer.parseInt(req.getParameter("postId"));              // User Event
        String result = service.apply(me.getFreelanceID(), postId, savedCvPath(req)); // State Change
        if ("OK".equals(result)) {
            resp.sendRedirect(req.getContextPath() + "/freelancer/applies");     // View Selection
        } else {
            req.setAttribute("error", result);                                   // e.g. "Post expired"
            req.getRequestDispatcher("/views/freelancer/post-detail.jsp").forward(req, resp);
        }
    }
}
</pre>
<div class="out"><b>Notice:</b> no SQL and no business rule in the servlet. "Is the post still open? Has this freelancer already applied?" lives in <code>JobApplyService</code>; the INSERT lives in <code>JobApplyDAO</code>. The role check lives in <code>AuthFilter</code>, so every freelancer URL is protected once.</div>`,
`<h2>🔧 Ngoài slide — kiến trúc của một đồ án SWP391 thật</h2>
<h3>Cấu trúc package mọi thành viên cùng theo (NetBeans, Java web)</h3>
<pre>
src/java/
  controller/      ApplyJobController.java, ListApplyController.java, LoginController.java …
  service/         JobApplyService.java  (luật nghiệp vụ: BR-05 bài còn hạn, apply một lần, BR-11)
  dal/             DBContext.java (kết nối), PostDAO.java, JobApplyDAO.java …
  model/           Post.java, JobApply.java, Freelancer.java … (bean thuần)
  filter/          AuthFilter.java (kiểm tra đăng nhập + vai trò cho /freelancer/*, /recruiter/*, /admin/*)
  util/            Validator.java, FileUploadUtil.java, EmailSender.java («proxy» tới SMTP)
web/
  views/freelancer/post-detail.jsp, list-apply.jsp …
  views/common/header.jsp, footer.jsp (lấy từ UI theme đã chọn)
</pre>
<h3>Controller mỏng — các mũi tên MVC trong code</h3>
<pre>
@WebServlet("/freelancer/apply")
public class ApplyJobController extends HttpServlet {
    private final JobApplyService service = new JobApplyService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Freelancer me = (Freelancer) req.getSession().getAttribute("freelancer"); // gán lúc login
        int postId = Integer.parseInt(req.getParameter("postId"));              // User Event
        String result = service.apply(me.getFreelanceID(), postId, savedCvPath(req)); // State Change
        if ("OK".equals(result)) {
            resp.sendRedirect(req.getContextPath() + "/freelancer/applies");     // View Selection
        } else {
            req.setAttribute("error", result);                                   // ví dụ "Post expired"
            req.getRequestDispatcher("/views/freelancer/post-detail.jsp").forward(req, resp);
        }
    }
}
</pre>
<div class="out"><b>Để ý:</b> servlet không có SQL và không có business rule. "Bài còn hạn không? Freelancer này apply chưa?" nằm trong <code>JobApplyService</code>; câu INSERT nằm trong <code>JobApplyDAO</code>. Kiểm tra vai trò nằm trong <code>AuthFilter</code>, nên mọi URL của freelancer được bảo vệ một lần.</div>`),
    bi(`<h3>REST API design — when your team chooses client–server (React / mobile ↔ Spring Boot)</h3>
<p>Design endpoints around <strong>nouns (resources)</strong>; the HTTP method is the verb. Prompt #8 of the teacher's Claude_Prompts.txt (Technical Design Spec) asks for exactly this: URL structure per actor, success/error formats, pagination and upload rules.</p>
<table><thead><tr><th>Use case (G5)</th><th>Method + URL</th><th>Success</th><th>Typical errors</th></tr></thead><tbody>
<tr><td>View list posts</td><td><code>GET /api/posts?category=3&amp;page=1&amp;size=10</code></td><td>200 + page of posts</td><td>400 bad params</td></tr>
<tr><td>Post detail</td><td><code>GET /api/posts/{postId}</code></td><td>200</td><td>404 not found</td></tr>
<tr><td>Create post (Recruiter)</td><td><code>POST /api/recruiter/posts</code></td><td>201 + Location</td><td>400 validation, 401, 403</td></tr>
<tr><td>Apply job (Freelancer)</td><td><code>POST /api/posts/{postId}/applies</code> (multipart CV)</td><td>201</td><td>409 already applied, 422 post expired</td></tr>
<tr><td>List my applies</td><td><code>GET /api/freelancer/applies</code></td><td>200</td><td>401</td></tr>
<tr><td>Approve an apply (Recruiter)</td><td><code>PATCH /api/recruiter/applies/{applyId}</code> body <code>{"status":1}</code></td><td>200</td><td>403 not your post</td></tr>
</tbody></table>
<p class="nhan">One response format for the whole team</p>
<pre>
// success                               // error
{ "success": true,                       { "success": false,
  "data": { "applyId": 17,                 "error": { "code": "APPLY_409_DUPLICATE",
            "status": 0 },                            "message": "You have already applied" } }
  "message": "Applied successfully" }
</pre>
<ul>
<li><strong>Nouns, plural</strong> — <code>/posts</code>, not <code>/getPost</code> or <code>/createPost</code>.</li>
<li><strong>Nesting shows ownership</strong> — an apply belongs to a post: <code>/posts/{id}/applies</code>.</li>
<li><strong>Status codes carry meaning</strong> — 201 created, 204 no content, 400/422 input problems, 401 not logged in, 403 wrong role, 404 missing, 409 conflict.</li>
<li><strong>Actor prefix</strong> — <code>/api/admin/…</code>, <code>/api/recruiter/…</code> lets one filter enforce roles per prefix.</li>
</ul>`,
`<h3>Thiết kế REST API — khi nhóm chọn client–server (React / mobile ↔ Spring Boot)</h3>
<p>Thiết kế endpoint quanh <strong>danh từ (tài nguyên)</strong>; HTTP method là động từ. Prompt #8 trong Claude_Prompts.txt của thầy/cô (Technical Design Spec) đòi đúng những thứ này: cấu trúc URL theo actor, định dạng thành công/lỗi, phân trang và luật upload.</p>
<table><thead><tr><th>Use case (G5)</th><th>Method + URL</th><th>Thành công</th><th>Lỗi điển hình</th></tr></thead><tbody>
<tr><td>Xem danh sách bài</td><td><code>GET /api/posts?category=3&amp;page=1&amp;size=10</code></td><td>200 + một trang bài</td><td>400 sai tham số</td></tr>
<tr><td>Chi tiết bài</td><td><code>GET /api/posts/{postId}</code></td><td>200</td><td>404 không có</td></tr>
<tr><td>Tạo bài (Recruiter)</td><td><code>POST /api/recruiter/posts</code></td><td>201 + Location</td><td>400 validate, 401, 403</td></tr>
<tr><td>Apply job (Freelancer)</td><td><code>POST /api/posts/{postId}/applies</code> (multipart CV)</td><td>201</td><td>409 đã apply, 422 bài hết hạn</td></tr>
<tr><td>Danh sách đơn của tôi</td><td><code>GET /api/freelancer/applies</code></td><td>200</td><td>401</td></tr>
<tr><td>Duyệt đơn (Recruiter)</td><td><code>PATCH /api/recruiter/applies/{applyId}</code> body <code>{"status":1}</code></td><td>200</td><td>403 không phải bài của bạn</td></tr>
</tbody></table>
<p class="nhan">Một định dạng response cho cả nhóm</p>
<pre>
// thành công                            // lỗi
{ "success": true,                       { "success": false,
  "data": { "applyId": 17,                 "error": { "code": "APPLY_409_DUPLICATE",
            "status": 0 },                            "message": "You have already applied" } }
  "message": "Applied successfully" }
</pre>
<ul>
<li><strong>Danh từ, số nhiều</strong> — <code>/posts</code>, không phải <code>/getPost</code> hay <code>/createPost</code>.</li>
<li><strong>Lồng URL thể hiện sở hữu</strong> — đơn apply thuộc về bài đăng: <code>/posts/{id}/applies</code>.</li>
<li><strong>Status code mang nghĩa</strong> — 201 đã tạo, 204 không nội dung, 400/422 lỗi đầu vào, 401 chưa đăng nhập, 403 sai vai trò, 404 không có, 409 xung đột.</li>
<li><strong>Tiền tố theo actor</strong> — <code>/api/admin/…</code>, <code>/api/recruiter/…</code> để một filter áp quyền theo tiền tố.</li>
</ul>`),
    bi(`<h3>Common mistakes that lose marks</h3>
<ul>
<li><strong>Fat controller</strong> — SQL, validation and business rules crammed into one <code>doPost</code>. Works in the demo, cannot be tested or reused. If a servlet contains a SQL string, it is doing the DAO's job.</li>
<li><strong>JSP with scriptlets</strong> — <code>&lt;% Connection c = … %&gt;</code> in a view breaks both MVC and layering; use JSTL/EL and data prepared by the controller.</li>
<li><strong>Architecture diagram copied from the template</strong> — boxes still labelled "XYZ Application" and "System NameX". Rename every box to your system and explain each one (the template requires it).</li>
<li><strong>Package diagram ≠ source tree</strong> — the reviewer opens GitLab; a <code>service</code> package on paper and none in the code is a design/implementation mismatch.</li>
<li><strong>Verbs in REST URLs</strong> — <code>GET /api/deletePost?id=5</code> lets a crawler delete data; destructive actions use DELETE/POST/PATCH.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Conway's Law.</strong> "Organisations design systems that mirror their communication structure." If your five members split by feature and talk every day, module boundaries stay clean; if two members never speak, the border between their code fills with duplicated DAO methods. Design package and feature boundaries to match how you actually divide the screens — and review each other's merge requests on GitLab so the boundaries stay honest.</div>`,
`<h3>Lỗi thường gặp làm mất điểm</h3>
<ul>
<li><strong>Controller béo</strong> — SQL, validate và business rule nhồi vào một <code>doPost</code>. Chạy được lúc demo, không test hay tái dùng được. Servlet chứa chuỗi SQL tức là nó đang làm việc của DAO.</li>
<li><strong>JSP chứa scriptlet</strong> — <code>&lt;% Connection c = … %&gt;</code> trong view phá cả MVC lẫn phân tầng; dùng JSTL/EL và dữ liệu controller đã chuẩn bị.</li>
<li><strong>Sơ đồ kiến trúc chép nguyên template</strong> — hộp vẫn ghi "XYZ Application" và "System NameX". Đổi tên mọi hộp theo hệ thống của bạn và giải thích từng hộp (template bắt buộc).</li>
<li><strong>Package diagram ≠ cây mã nguồn</strong> — hội đồng mở GitLab; trên giấy có package <code>service</code> mà code không có là lệch thiết kế/hiện thực.</li>
<li><strong>Động từ trong URL REST</strong> — <code>GET /api/deletePost?id=5</code> để crawler xoá được dữ liệu; thao tác phá huỷ dùng DELETE/POST/PATCH.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Định luật Conway.</strong> "Tổ chức thiết kế hệ thống phản chiếu cấu trúc giao tiếp của chính họ." Nếu năm thành viên chia theo tính năng và nói chuyện mỗi ngày, ranh giới module sạch; nếu hai người không bao giờ trao đổi, biên giới giữa code của họ đầy method DAO lặp nhau. Hãy thiết kế ranh giới package và tính năng khớp với cách nhóm thật sự chia màn hình — và review merge request của nhau trên GitLab để ranh giới giữ đúng.</div>`),
    books([
      ['sommerville', 'Ch. 6 (Architectural design) — 6.2 Architectural views, 6.3 Architectural patterns (MVC, layered, repository, client–server, pipe and filter)', 'Ch. 6 (Architectural design) — 6.2 Góc nhìn kiến trúc, 6.3 Mẫu kiến trúc (MVC, phân tầng, repository, client–server, pipe and filter)'],
      ['gomaa', 'Ch. 12 (Overview of software architecture), Ch. 13 (Software subsystem architectural design), Ch. 15 (Designing client/server software architectures)', 'Ch. 12 (Tổng quan kiến trúc phần mềm), Ch. 13 (Thiết kế kiến trúc sub-system), Ch. 15 (Thiết kế kiến trúc client/server)'],
      ['fowler', 'Ch. 7 (Package diagrams)', 'Ch. 7 (Package diagram)'],
    ]),
// @C33
  ].join('\n'),
};

/* ─────────────── 3.4 Object-oriented design (g-design 36–55) ─────────────── */
const R34 = [
  [36, 'Object-oriented design — the three concepts',
    `<p class="y-chinh">🎯 OO design = information hiding + classes + inheritance; objects are created from classes and used only through their operations.</p>
<ul>
<li><strong>Information hiding</strong> — encapsulate each kind of changeable information (a data structure, a state machine…).</li>
<li><strong>Classes</strong> — design the class interfaces and the operations each class provides.</li>
<li><strong>Inheritance</strong> — share and reuse code: a child class inherits the encapsulated data and operations of its parent.</li>
<li><strong>Operations (methods)</strong> — the specification and implementation of a function an object performs; the only door into the object.</li>
</ul>
<p class="nhan">From analysis to design</p>
<p>In analysis you <em>named</em> objects and messages (Lesson 3.2). In OO design you give every class an exact interface — operation names, parameters, types — so each member can code against it.</p>`,
    `<p class="y-chinh">🎯 Thiết kế OO = information hiding + class + kế thừa; object được tạo từ class và chỉ được dùng qua các operation.</p>
<ul>
<li><strong>Information hiding</strong> — đóng gói từng loại thông tin dễ thay đổi (một cấu trúc dữ liệu, một máy trạng thái…).</li>
<li><strong>Class</strong> — thiết kế interface của class và các operation mỗi class cung cấp.</li>
<li><strong>Kế thừa</strong> — chia sẻ và tái dùng code: lớp con thừa hưởng dữ liệu đã đóng gói và các operation của lớp cha.</li>
<li><strong>Operation (method)</strong> — đặc tả và hiện thực một chức năng object thực hiện; cánh cửa duy nhất vào object.</li>
</ul>
<p class="nhan">Từ phân tích sang thiết kế</p>
<p>Ở phân tích bạn <em>đặt tên</em> object và message (Bài 3.2). Ở thiết kế OO bạn cho mỗi class một interface chính xác — tên operation, tham số, kiểu — để từng thành viên code dựa vào đó.</p>`],
  [37, 'Designing information hiding classes — categories by stereotype',
    `<p class="y-chinh">🎯 In the design model, the analysis categories become design classes, each marked by a stereotype.</p>
<ul>
<li><strong>Entity classes</strong> — from the analysis model; encapsulate data (designed as <em>data abstraction</em> classes, slides 38–39).</li>
<li><strong>Boundary classes</strong> — interface to the outside. <em>Active</em> (concurrent): device I/O, proxy. <em>Passive</em>: graphical user interaction (slide 40).</li>
<li><strong>Control classes</strong> — coordinate a collection of objects; often active; a passive one is the <em>state-machine class</em> encapsulating a finite state machine.</li>
<li><strong>Application logic classes</strong> — encapsulate application-specific logic and algorithms: business logic, service or algorithm classes (slide 41).</li>
</ul>
<p class="ghi-chu">"Active" = runs its own thread (ATM devices). In a web app almost everything is passive: the servlet container calls your code once per request.</p>`,
    `<p class="y-chinh">🎯 Trong mô hình thiết kế, các nhóm của phân tích trở thành design class, mỗi class mang một stereotype.</p>
<ul>
<li><strong>Entity class</strong> — lấy từ mô hình phân tích; đóng gói dữ liệu (thiết kế thành class <em>data abstraction</em>, slide 38–39).</li>
<li><strong>Boundary class</strong> — giao tiếp bên ngoài. <em>Active</em> (chạy đồng thời): device I/O, proxy. <em>Passive</em>: graphical user interaction (slide 40).</li>
<li><strong>Control class</strong> — điều phối một nhóm object; thường active; loại passive là <em>state-machine class</em> đóng gói một máy trạng thái hữu hạn.</li>
<li><strong>Application logic class</strong> — đóng gói logic và thuật toán riêng của ứng dụng: business logic, service hoặc algorithm class (slide 41).</li>
</ul>
<p class="ghi-chu">"Active" = chạy luồng riêng (thiết bị ATM). Trong web app gần như mọi thứ đều passive: servlet container gọi code của bạn mỗi request một lần.</p>`],
  [38, 'Data abstraction classes (1/2)',
    `<p class="y-chinh">🎯 Every entity class becomes a data abstraction class: its data structure is hidden and reached only through access operations.</p>
<ul>
<li><strong>Encapsulates the data structure</strong> — how the data is represented stays hidden.</li>
<li><strong>Access operations</strong> — procedures/functions whose internals (how the data is manipulated) are also hidden.</li>
<li><strong>Attributes</strong> — come from the static model of the problem domain (Lesson 3.2, slide 19).</li>
<li><strong>Operations</strong> — come from the needs of the client objects: look at who sends which message to the object in the communication model.</li>
</ul>
<p class="nhan">Web-project reading</p>
<p>The table <code>JobApply</code> is the data structure; <code>JobApplyDAO</code> is its data abstraction class. Its operations are exactly what the controllers and services ask for: <code>insert</code>, <code>exists(freelanceID, postID)</code>, <code>getByFreelancer</code>, <code>getByPost</code>, <code>updateStatus</code> — not a blind CRUD set.</p>`,
    `<p class="y-chinh">🎯 Mỗi entity class trở thành một data abstraction class: cấu trúc dữ liệu bị giấu và chỉ được truy cập qua các operation truy xuất.</p>
<ul>
<li><strong>Đóng gói cấu trúc dữ liệu</strong> — dữ liệu được biểu diễn thế nào thì giấu đi.</li>
<li><strong>Access operation</strong> — các thủ tục/hàm mà bên trong (cách thao tác dữ liệu) cũng bị giấu.</li>
<li><strong>Attribute</strong> — lấy từ mô hình tĩnh của miền bài toán (Bài 3.2, slide 19).</li>
<li><strong>Operation</strong> — lấy từ nhu cầu của client object: xem ai gửi message nào tới object trong mô hình communication.</li>
</ul>
<p class="nhan">Đọc theo dự án web</p>
<p>Bảng <code>JobApply</code> là cấu trúc dữ liệu; <code>JobApplyDAO</code> là data abstraction class của nó. Các operation đúng bằng những gì controller và service cần: <code>insert</code>, <code>exists(freelanceID, postID)</code>, <code>getByFreelancer</code>, <code>getByPost</code>, <code>updateStatus</code> — không phải một bộ CRUD làm cho có.</p>`],
  [39, 'Data abstraction classes (2/2) — the ATMCash example',
    `<p class="y-chinh">🎯 Three steps from analysis to class: messages in the analysis model → typed operations in the design model → the class interface.</p>
<ol>
<li><strong>(a) Analysis communication diagram</strong> — «user interaction» Operator Interaction sends <em>A1: Cash Added</em> to «entity» ATMCash; «output» CashDispenser Interface sends <em>W1: Cash Withdrawal Amount</em> and gets back <em>W1.1: Cash Response</em>.</li>
<li><strong>(b) Design communication diagram</strong> — the messages become calls: <code>addCash(in fivesAdded, in tensAdded, in twentiesAdded)</code> and <code>withdrawCash(in cashAmount, out fivesToDispense, out tensToDispense, out twentiesToDispense)</code>.</li>
<li><strong>(c) Class</strong> — «data abstraction» ATMCash with hidden attributes <code>- cashAvailable, fives, tens, twenties : Integer = 0</code> and public operations <code>+ addCash(…)</code>, <code>+ withdrawCash(…)</code>.</li>
</ol>
<p class="nhan">Speaker-note details worth knowing</p>
<ul>
<li><strong>Why those attributes</strong> — the dispenser holds $20, $10 and $5 bills, so the class counts each denomination.</li>
<li><strong>Order of messages matters</strong> — withdrawCash must compute how many bills of each kind satisfy the amount, then reply.</li>
<li><strong><code>-</code> / <code>+</code></strong> — private attributes, public operations: information hiding drawn in UML.</li>
</ul>`,
    `<p class="y-chinh">🎯 Ba bước từ phân tích tới class: message trong mô hình phân tích → operation có kiểu trong mô hình thiết kế → interface của class.</p>
<ol>
<li><strong>(a) Communication diagram phân tích</strong> — «user interaction» Operator Interaction gửi <em>A1: Cash Added</em> tới «entity» ATMCash; «output» CashDispenser Interface gửi <em>W1: Cash Withdrawal Amount</em> và nhận về <em>W1.1: Cash Response</em>.</li>
<li><strong>(b) Communication diagram thiết kế</strong> — message thành lời gọi: <code>addCash(in fivesAdded, in tensAdded, in twentiesAdded)</code> và <code>withdrawCash(in cashAmount, out fivesToDispense, out tensToDispense, out twentiesToDispense)</code>.</li>
<li><strong>(c) Class</strong> — «data abstraction» ATMCash với attribute ẩn <code>- cashAvailable, fives, tens, twenties : Integer = 0</code> và operation public <code>+ addCash(…)</code>, <code>+ withdrawCash(…)</code>.</li>
</ol>
<p class="nhan">Chi tiết trong ghi chú của slide đáng biết</p>
<ul>
<li><strong>Vì sao có các attribute đó</strong> — máy nhả tiền giữ tờ $20, $10 và $5, nên class đếm từng mệnh giá.</li>
<li><strong>Thứ tự message quan trọng</strong> — withdrawCash phải tính số tờ mỗi loại đủ cho số tiền, rồi mới trả lời.</li>
<li><strong><code>-</code> / <code>+</code></strong> — attribute private, operation public: information hiding được vẽ bằng UML.</li>
</ul>`],
  [40, 'Graphical user interaction (GUI) classes',
    `<p class="y-chinh">🎯 A GUI class hides the details of the user interface from every other class — one class per window/screen.</p>
<ul>
<li><strong>Hides the UI</strong> — other classes never know whether input came from a command line or a rich GUI.</li>
<li><strong>Command line</strong> — typically handled by one user interaction class.</li>
<li><strong>GUI</strong> — one «GUI» class per window: PINWindow, MenuWindow, WithdrawalWindow, QueryWindow, TransferWindow, PromptWindow.</li>
<li><strong>Interface shape</strong> — each has <code>clear()</code> and a <code>displayXxx(out …)</code> operation returning what the user entered, e.g. <code>displayWithdrawalWindow(out accountNumber, out amount)</code>.</li>
</ul>
<p class="nhan">In your project</p>
<p>Each «GUI» class is one JSP (or React component). Its "out" parameters are the form fields it posts: <code>post-detail.jsp</code> outputs <code>postId</code> + CV file. This is also how LOC complexity is judged — the number of fields and transactions per screen.</p>`,
    `<p class="y-chinh">🎯 GUI class giấu chi tiết giao diện người dùng khỏi mọi class khác — mỗi cửa sổ/màn hình một class.</p>
<ul>
<li><strong>Giấu giao diện</strong> — class khác không bao giờ biết đầu vào đến từ dòng lệnh hay GUI phong phú.</li>
<li><strong>Dòng lệnh</strong> — thường do một user interaction class đảm nhận.</li>
<li><strong>GUI</strong> — mỗi cửa sổ một class «GUI»: PINWindow, MenuWindow, WithdrawalWindow, QueryWindow, TransferWindow, PromptWindow.</li>
<li><strong>Dạng interface</strong> — mỗi class có <code>clear()</code> và một operation <code>displayXxx(out …)</code> trả về thứ người dùng nhập, ví dụ <code>displayWithdrawalWindow(out accountNumber, out amount)</code>.</li>
</ul>
<p class="nhan">Trong đồ án của bạn</p>
<p>Mỗi class «GUI» là một JSP (hoặc React component). Tham số "out" của nó là các trường form nó gửi đi: <code>post-detail.jsp</code> gửi ra <code>postId</code> + file CV. Đây cũng là cách đánh giá độ phức tạp LOC — số trường và số giao dịch mỗi màn hình.</p>`],
  [41, 'Business logic classes',
    `<p class="y-chinh">🎯 A business logic class holds the decision-making rules for a request, so rules that change independently live in separate classes.</p>
<ul>
<li><strong>Definition</strong> — defines the decision-making, business-specific application logic for processing a client's request.</li>
<li><strong>Goal</strong> — encapsulate business rules that could change independently of each other into separate classes.</li>
<li><strong>Uses entities</strong> — during execution it usually accesses several entity objects.</li>
</ul>
<p class="nhan">Read the figure (WithdrawalTransactionManager)</p>
<ul>
<li><strong>«coordinator» BankTransactionCoordinator</strong> sends Withdraw, Confirm, Abort; gets a Withdraw Response.</li>
<li><strong>Operations</strong> — <code>initialize()</code> at start-up; <code>withdraw(in accountNumber, in amount, out response)</code>; <code>confirm(accountNumber, amount)</code> when the cash was dispensed; <code>abort(accountNumber, amount)</code> when it was not.</li>
</ul>
<p class="nhan">G5 equivalent</p>
<pre>
«business logic» JobApplyService
+ apply(in freelanceID, in postID, in cvPath, out result)   // BR-05 open post, apply once
+ approve(in applyID, in recruiterID)                        // only the post's owner
+ reject(in applyID, in recruiterID)
</pre>`,
    `<p class="y-chinh">🎯 Business logic class giữ các luật ra quyết định cho một request, để luật nào thay đổi độc lập thì nằm ở class riêng.</p>
<ul>
<li><strong>Định nghĩa</strong> — định nghĩa logic ra quyết định, riêng của nghiệp vụ, để xử lý request của client.</li>
<li><strong>Mục tiêu</strong> — đóng gói các business rule có thể thay đổi độc lập với nhau vào các class riêng.</li>
<li><strong>Dùng entity</strong> — khi chạy nó thường truy cập nhiều entity object.</li>
</ul>
<p class="nhan">Đọc hình (WithdrawalTransactionManager)</p>
<ul>
<li><strong>«coordinator» BankTransactionCoordinator</strong> gửi Withdraw, Confirm, Abort; nhận Withdraw Response.</li>
<li><strong>Operation</strong> — <code>initialize()</code> lúc khởi động; <code>withdraw(in accountNumber, in amount, out response)</code>; <code>confirm(accountNumber, amount)</code> khi tiền đã nhả; <code>abort(accountNumber, amount)</code> khi không nhả được.</li>
</ul>
<p class="nhan">Tương đương ở G5</p>
<pre>
«business logic» JobApplyService
+ apply(in freelanceID, in postID, in cvPath, out result)   // BR-05 bài còn hạn, apply một lần
+ approve(in applyID, in recruiterID)                        // chỉ chủ bài đăng
+ reject(in applyID, in recruiterID)
</pre>`],
  [42, 'Designing class interface & operations (1/2)',
    `<p class="y-chinh">🎯 A class's interface is its set of operations; you find them in the dynamic model (messages) and complete them from the static model (CRUD).</p>
<ul>
<li><strong>Class interface</strong> — the operations (methods) the class provides.</li>
<li><strong>Parameters</strong> — each operation may have input parameters, output parameters and, if it is a function, a return value.</li>
<li><strong>From the dynamic model</strong> — every interaction message means an operation invoked on the <em>receiving</em> object; between passive objects, message passing = one object calling an operation of another.</li>
<li><strong>From the static model</strong> — the standard operations create, read, update, delete (CRUD).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the arrow points at the class that <em>owns</em> the operation. "Controller → DAO: insert" means <code>insert</code> is a method of the DAO, not of the controller.</p>`,
    `<p class="y-chinh">🎯 Interface của class là tập operation của nó; tìm chúng trong mô hình động (message) và bổ sung từ mô hình tĩnh (CRUD).</p>
<ul>
<li><strong>Class interface</strong> — các operation (method) class cung cấp.</li>
<li><strong>Tham số</strong> — mỗi operation có thể có tham số vào, tham số ra và, nếu là hàm, một giá trị trả về.</li>
<li><strong>Từ mô hình động</strong> — mỗi message tương tác nghĩa là một operation được gọi trên object <em>nhận</em>; giữa các object passive, gửi message = object này gọi operation của object kia.</li>
<li><strong>Từ mô hình tĩnh</strong> — các operation chuẩn create, read, update, delete (CRUD).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mũi tên chỉ vào class <em>sở hữu</em> operation. "Controller → DAO: insert" nghĩa là <code>insert</code> là method của DAO, không phải của controller.</p>`],
  [43, 'Designing class interface & operations (2/2) — operations from the interaction model',
    `<p class="y-chinh">🎯 The ATMCard example: analysis messages carrying data become a <code>write</code> and a <code>read</code> operation with typed in/out parameters.</p>
<ol>
<li><strong>(a) Analysis</strong> — «I/O» CardReader Interface sends <em>W1: Card Id, Start Date, Expiration Date</em> to «entity» ATMCard; «user interaction» Customer Interaction sends <em>R1: Card Request</em> and receives <em>R1.1</em> with the same three items.</li>
<li><strong>(b) Design</strong> — W1 becomes <code>write(cardId, startDate, expirationDate)</code>; R1 becomes <code>read(out cardId, out startDate, out expirationDate)</code>, drawn as synchronous messages.</li>
<li><strong>(c) Class</strong> — «data abstraction» ATMCard: <code>- atmCardId: String</code>, <code>- atmStartDate: Date</code>, <code>- atmExpirationDate: Date</code>; <code>+ write(in …)</code>, <code>+ read(out …)</code>.</li>
</ol>
<p class="nhan">Apply the recipe to "Apply job" (messages A3–A7 of Lesson 3.2)</p>
<table><thead><tr><th>Analysis message</th><th>Design operation (receiver)</th></tr></thead><tbody>
<tr><td>A3 Check Apply</td><td><code>JobApplyService.apply(in freelanceID, in postID, in cvPath) : String</code></td></tr>
<tr><td>A4 Post Info</td><td><code>PostDAO.getById(in postID) : Post</code></td></tr>
<tr><td>A5 Existing Apply?</td><td><code>JobApplyDAO.exists(in freelanceID, in postID) : boolean</code></td></tr>
<tr><td>A7 Store Apply</td><td><code>JobApplyDAO.insert(in apply : JobApply) : int</code></td></tr>
</tbody></table>`,
    `<p class="y-chinh">🎯 Ví dụ ATMCard: message phân tích mang dữ liệu trở thành operation <code>write</code> và <code>read</code> với tham số in/out có kiểu.</p>
<ol>
<li><strong>(a) Phân tích</strong> — «I/O» CardReader Interface gửi <em>W1: Card Id, Start Date, Expiration Date</em> tới «entity» ATMCard; «user interaction» Customer Interaction gửi <em>R1: Card Request</em> và nhận <em>R1.1</em> gồm đúng ba mục đó.</li>
<li><strong>(b) Thiết kế</strong> — W1 thành <code>write(cardId, startDate, expirationDate)</code>; R1 thành <code>read(out cardId, out startDate, out expirationDate)</code>, vẽ bằng message đồng bộ.</li>
<li><strong>(c) Class</strong> — «data abstraction» ATMCard: <code>- atmCardId: String</code>, <code>- atmStartDate: Date</code>, <code>- atmExpirationDate: Date</code>; <code>+ write(in …)</code>, <code>+ read(out …)</code>.</li>
</ol>
<p class="nhan">Áp công thức cho "Apply job" (message A3–A7 của Bài 3.2)</p>
<table><thead><tr><th>Message phân tích</th><th>Operation thiết kế (bên nhận)</th></tr></thead><tbody>
<tr><td>A3 Check Apply</td><td><code>JobApplyService.apply(in freelanceID, in postID, in cvPath) : String</code></td></tr>
<tr><td>A4 Post Info</td><td><code>PostDAO.getById(in postID) : Post</code></td></tr>
<tr><td>A5 Existing Apply?</td><td><code>JobApplyDAO.exists(in freelanceID, in postID) : boolean</code></td></tr>
<tr><td>A7 Store Apply</td><td><code>JobApplyDAO.insert(in apply : JobApply) : int</code></td></tr>
</tbody></table>`],
  [44, 'Information hiding classes design (1/4) — detailed design of the Account abstract superclass',
    `<p class="y-chinh">🎯 Detailed design decides the algorithm inside each operation and writes it as pseudocode — before the Java is typed.</p>
<p class="nhan">Read the class diagram</p>
<ul>
<li><strong>«entity» Account {abstract}</strong> — <code># accountNumber : Integer</code>, <code># balance : Real = 0</code> (<code>#</code> = protected: visible to subclasses).</li>
<li><strong>Operations</strong> — <code>+ open(accountNumber)</code>, <code># credit(amount) {abstract}</code>, <code># debit(amount) {abstract}</code>, <code>+ readBalance() : Real</code>, <code>+ close()</code>.</li>
<li><strong>Subclasses</strong> — CheckingAccount and SavingsAccount (generalisation arrow with hollow triangle).</li>
</ul>
<p class="nhan">The pseudocode on the right</p>
<pre>
open (in accountNumber : Integer)
  begin  create new account; assign accountNumber; set balance to zero;  end
close ()          begin close the account; end
readBalance () : Real   begin return value of balance; end
credit (in amount : Real)   Defer implementation to subclass.
debit  (in amount : Real)   Defer implementation to subclass.
</pre>
<p class="nhan">For your SDS</p>
<p>The template does not demand pseudocode, but for a non-trivial operation (e.g. <code>JobApplyService.apply</code>) three to six lines of pseudocode under the class diagram answer the reviewer's "how does it work?" before they ask.</p>`,
    `<p class="y-chinh">🎯 Thiết kế chi tiết quyết định thuật toán bên trong mỗi operation và viết nó bằng pseudocode — trước khi gõ Java.</p>
<p class="nhan">Đọc class diagram</p>
<ul>
<li><strong>«entity» Account {abstract}</strong> — <code># accountNumber : Integer</code>, <code># balance : Real = 0</code> (<code>#</code> = protected: lớp con nhìn thấy).</li>
<li><strong>Operation</strong> — <code>+ open(accountNumber)</code>, <code># credit(amount) {abstract}</code>, <code># debit(amount) {abstract}</code>, <code>+ readBalance() : Real</code>, <code>+ close()</code>.</li>
<li><strong>Lớp con</strong> — CheckingAccount và SavingsAccount (mũi tên generalization đầu tam giác rỗng).</li>
</ul>
<p class="nhan">Pseudocode bên phải</p>
<pre>
open (in accountNumber : Integer)
  begin  create new account; assign accountNumber; set balance to zero;  end
close ()          begin close the account; end
readBalance () : Real   begin return value of balance; end
credit (in amount : Real)   Defer implementation to subclass.
debit  (in amount : Real)   Defer implementation to subclass.
</pre>
<p class="nhan">Với SDS của bạn</p>
<p>Template không bắt buộc pseudocode, nhưng với operation không tầm thường (ví dụ <code>JobApplyService.apply</code>) ba đến sáu dòng pseudocode dưới class diagram trả lời trước câu "nó chạy thế nào?" của hội đồng.</p>`],
  [45, 'Information hiding classes design (2/4) — CheckingAccount subclass',
    `<p class="y-chinh">🎯 A subclass states what it inherits, what it declares new, and which inherited operations it implements.</p>
<ul>
<li><strong>Attributes</strong> — inherit <code>accountNumber</code>, <code>balance</code>; declare <code>lastDepositAmount</code>.</li>
<li><strong>Inherit specification and implementation</strong> — <code>open</code>, <code>close</code>, <code>readBalance</code>.</li>
<li><strong>Inherit specification, define implementation</strong> — <code>credit(in amount)</code>: add amount to balance; set lastDepositAmount = amount. <code>debit(in amount)</code>: deduct amount from balance.</li>
<li><strong>Add operation</strong> — <code>readLastDepositAmount() : Real</code>: return lastDepositAmount.</li>
</ul>
<p class="meo">🧠 <strong>Remember the three verbs:</strong> <em>inherit</em> (use as is), <em>define/redefine</em> (same signature, own body = override), <em>add</em> (new operation only in the subclass).</p>`,
    `<p class="y-chinh">🎯 Lớp con nêu rõ cái gì thừa kế, cái gì khai báo mới, và operation thừa kế nào nó tự hiện thực.</p>
<ul>
<li><strong>Attribute</strong> — thừa kế <code>accountNumber</code>, <code>balance</code>; khai báo <code>lastDepositAmount</code>.</li>
<li><strong>Thừa kế đặc tả và hiện thực</strong> — <code>open</code>, <code>close</code>, <code>readBalance</code>.</li>
<li><strong>Thừa kế đặc tả, tự định nghĩa hiện thực</strong> — <code>credit(in amount)</code>: cộng amount vào balance; gán lastDepositAmount = amount. <code>debit(in amount)</code>: trừ amount khỏi balance.</li>
<li><strong>Thêm operation</strong> — <code>readLastDepositAmount() : Real</code>: trả về lastDepositAmount.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ ba động từ:</strong> <em>inherit</em> (dùng nguyên), <em>define/redefine</em> (cùng chữ ký, thân riêng = override), <em>add</em> (operation mới chỉ có ở lớp con).</p>`],
  [46, 'Information hiding classes design (3/4) — SavingsAccount subclass (1/2)',
    `<p class="y-chinh">🎯 SavingsAccount adds interest and a free-debit limit, and redefines debit and credit.</p>
<ul>
<li><strong>Attributes</strong> — inherit <code>accountNumber</code>, <code>balance</code>; declare <code>cumulativeInterest</code>, <code>debitCount</code>; declare <em>static class attributes</em> <code>maxFreeDebits = 3</code>, <code>bankCharge = 2.50</code> (underlined in UML = one value shared by all objects).</li>
<li><strong>Inherited as is</strong> — <code>open</code>, <code>close</code>, <code>readBalance</code>.</li>
<li><strong>Redefined <code>debit(in amount)</code></strong> — deduct amount; increment debitCount; charge bankCharge when the free debits are used up.</li>
<li><strong>Redefined <code>credit(in amount)</code></strong> — add amount to balance.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>The slide's condition is inverted.</strong> The pseudocode reads "if maxFreeDebits &gt; debitCount then deduct bankCharge", which would charge the <em>free</em> debits. The speaker notes say the opposite: a charge for every debit <em>in excess of</em> maxFreeDebits. The correct test is <code>if debitCount &gt; maxFreeDebits</code>. Reviewing pseudocode like this is exactly how design bugs are caught before coding.</div>`,
    `<p class="y-chinh">🎯 SavingsAccount thêm tiền lãi và giới hạn số lần rút miễn phí, đồng thời định nghĩa lại debit và credit.</p>
<ul>
<li><strong>Attribute</strong> — thừa kế <code>accountNumber</code>, <code>balance</code>; khai báo <code>cumulativeInterest</code>, <code>debitCount</code>; khai báo <em>attribute tĩnh của class</em> <code>maxFreeDebits = 3</code>, <code>bankCharge = 2.50</code> (gạch chân trong UML = một giá trị dùng chung cho mọi object).</li>
<li><strong>Thừa kế nguyên</strong> — <code>open</code>, <code>close</code>, <code>readBalance</code>.</li>
<li><strong>Định nghĩa lại <code>debit(in amount)</code></strong> — trừ amount; tăng debitCount; thu bankCharge khi đã hết lượt rút miễn phí.</li>
<li><strong>Định nghĩa lại <code>credit(in amount)</code></strong> — cộng amount vào balance.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Điều kiện trên slide bị ngược.</strong> Pseudocode ghi "if maxFreeDebits &gt; debitCount then deduct bankCharge", tức là thu phí đúng các lần <em>miễn phí</em>. Ghi chú của slide nói ngược lại: thu phí mỗi lần rút <em>vượt quá</em> maxFreeDebits. Điều kiện đúng là <code>if debitCount &gt; maxFreeDebits</code>. Review pseudocode kiểu này chính là cách bắt lỗi thiết kế trước khi code.</div>`],
  [47, 'Information hiding classes design (4/4) — SavingsAccount subclass (2/2)',
    `<p class="y-chinh">🎯 The operations only a savings account has: add interest, read it, and reset the monthly debit count.</p>
<pre>
addInterest (interestRate : Real)
  begin
    Compute dailyInterest = balance * interestRate;
    Add dailyInterest to cumulativeInterest and to balance;
  end
readCumulativeInterest () : Real   begin return value of cumulativeInterest; end
clearDebitCount ()                 begin Reset debitCount to zero; end
</pre>
<p class="nhan">Why two different "read" operations (speaker notes)</p>
<p>Reading a checking account means balance + last deposit; reading a savings account means balance + accumulated interest. So the design keeps the shared <code>readBalance()</code> and adds one read operation per subclass instead of forcing one signature on both.</p>
<p class="nhan">Timer link</p>
<p><code>clearDebitCount()</code> runs "at the end of each month" — that is an «external timer» event (Lesson 3.2). In a web system the same pattern is a scheduled job, e.g. expiring posts at midnight.</p>`,
    `<p class="y-chinh">🎯 Những operation chỉ tài khoản tiết kiệm mới có: cộng lãi, đọc lãi, và đặt lại số lần rút mỗi tháng.</p>
<pre>
addInterest (interestRate : Real)
  begin
    Compute dailyInterest = balance * interestRate;
    Add dailyInterest to cumulativeInterest and to balance;
  end
readCumulativeInterest () : Real   begin return value of cumulativeInterest; end
clearDebitCount ()                 begin Reset debitCount to zero; end
</pre>
<p class="nhan">Vì sao có hai operation "read" khác nhau (ghi chú của slide)</p>
<p>Đọc tài khoản thanh toán là số dư + lần nạp gần nhất; đọc tài khoản tiết kiệm là số dư + lãi tích luỹ. Nên thiết kế giữ <code>readBalance()</code> dùng chung và thêm mỗi lớp con một operation read, thay vì ép một chữ ký cho cả hai.</p>
<p class="nhan">Liên hệ với timer</p>
<p><code>clearDebitCount()</code> chạy "cuối mỗi tháng" — đó là sự kiện «external timer» (Bài 3.2). Trong web system cùng mẫu này là một job định kỳ, ví dụ cho bài đăng hết hạn lúc nửa đêm.</p>`],
  [48, 'Class relationships (1/3) — association, composition/aggregation, generalisation',
    `<p class="y-chinh">🎯 Class diagrams model the domain — one per use case — using three kinds of relationship.</p>
<p class="nhan">Read the Order example</p>
<ul>
<li><strong>Association</strong> — Order → Product (open arrow): an order refers to products it contains.</li>
<li><strong>Composition</strong> (filled ◆) — Order ◆— OrderItem: items live and die with their order (<code>orderItems: List&lt;OrderItem&gt;</code>, <code>addOrderItem(Product, int)</code>).</li>
<li><strong>Aggregation</strong> (hollow ◇) — OrderItem ◇— Product: a product exists independently of any order item.</li>
<li><strong>Generalisation</strong> (hollow △) — ShippableOrder is-a Order, adding <code>shippingAddress</code> with get/set.</li>
</ul>
<table><thead><tr><th>Symbol</th><th>Meaning</th><th>G5 example</th></tr></thead><tbody>
<tr><td>—— / ——&gt;</td><td>association (knows / uses)</td><td>Post —— Categories (a post has one category)</td></tr>
<tr><td>◇——</td><td>aggregation (whole–part, part can live alone)</td><td>Company ◇—— Recruiter</td></tr>
<tr><td>◆——</td><td>composition (part dies with whole)</td><td>Freelancer ◆—— Education, Experience</td></tr>
<tr><td>——▷</td><td>generalisation (is-a)</td><td>Freelancer, Recruiter ——▷ User (role)</td></tr>
<tr><td>- - -&gt;</td><td>dependency (uses temporarily)</td><td>ApplyJobController - - -&gt; JobApplyService</td></tr>
</tbody></table>`,
    `<p class="y-chinh">🎯 Class diagram mô hình hoá miền bài toán — mỗi use case một diagram — bằng ba loại quan hệ.</p>
<p class="nhan">Đọc ví dụ Order</p>
<ul>
<li><strong>Association</strong> — Order → Product (mũi tên mở): đơn hàng tham chiếu tới các sản phẩm nó chứa.</li>
<li><strong>Composition</strong> (◆ đặc) — Order ◆— OrderItem: item sống và chết cùng đơn hàng (<code>orderItems: List&lt;OrderItem&gt;</code>, <code>addOrderItem(Product, int)</code>).</li>
<li><strong>Aggregation</strong> (◇ rỗng) — OrderItem ◇— Product: sản phẩm tồn tại độc lập với mọi order item.</li>
<li><strong>Generalization</strong> (△ rỗng) — ShippableOrder là-một Order, thêm <code>shippingAddress</code> kèm get/set.</li>
</ul>
<table><thead><tr><th>Ký hiệu</th><th>Ý nghĩa</th><th>Ví dụ G5</th></tr></thead><tbody>
<tr><td>—— / ——&gt;</td><td>association (biết / dùng)</td><td>Post —— Categories (một bài có một danh mục)</td></tr>
<tr><td>◇——</td><td>aggregation (toàn thể–bộ phận, bộ phận sống riêng được)</td><td>Company ◇—— Recruiter</td></tr>
<tr><td>◆——</td><td>composition (bộ phận chết theo toàn thể)</td><td>Freelancer ◆—— Education, Experience</td></tr>
<tr><td>——▷</td><td>generalization (là-một)</td><td>Freelancer, Recruiter ——▷ User (vai trò)</td></tr>
<tr><td>- - -&gt;</td><td>dependency (dùng tạm thời)</td><td>ApplyJobController - - -&gt; JobApplyService</td></tr>
</tbody></table>`],
  [49, 'Class relationships (2/3) — class diagram for a UC in an MVC system (static view)',
    `<p class="y-chinh">🎯 This is the class diagram the teacher expects per feature — and it is the sample in SDS section 3.1.1.</p>
<p class="nhan">Read every line</p>
<ul>
<li><strong>ProductController ——▷ BaseController</strong> — inherits shared logic (e.g. access checks).</li>
<li><strong>ProductController - - -&gt; ProductDao, MyUtils, ProductBean</strong> — dependencies: it uses them inside its methods.</li>
<li><strong>ProductDao, UserDao ——▷ BaseDao</strong> — share the connection code; <strong>ProductDao - - -&gt; ProductBean</strong>.</li>
<li><strong>ProductBean, UserBean ——▷ BaseBean</strong> — common fields (id, created date…).</li>
<li><strong>RequestFilter - - -&gt; UserDao, UserBean</strong> — the filter loads the logged-in user.</li>
<li><strong>BaseController ◇—— UserBean</strong> — the controller keeps the current user.</li>
</ul>
<p class="nhan">Mapping to your code</p>
<p>Controller = servlet, Dao = DAO in <code>dal</code>, Bean = model class, RequestFilter = <code>@WebFilter</code>, MyUtils = a helper in <code>util</code>. Draw one such diagram per screen/feature you own, with <em>your</em> class names.</p>`,
    `<p class="y-chinh">🎯 Đây là class diagram thầy/cô mong đợi cho mỗi tính năng — và cũng là hình mẫu ở mục 3.1.1 của SDS.</p>
<p class="nhan">Đọc từng đường</p>
<ul>
<li><strong>ProductController ——▷ BaseController</strong> — thừa kế logic dùng chung (ví dụ kiểm tra quyền).</li>
<li><strong>ProductController - - -&gt; ProductDao, MyUtils, ProductBean</strong> — dependency: dùng chúng trong các method.</li>
<li><strong>ProductDao, UserDao ——▷ BaseDao</strong> — chung code kết nối; <strong>ProductDao - - -&gt; ProductBean</strong>.</li>
<li><strong>ProductBean, UserBean ——▷ BaseBean</strong> — trường chung (id, ngày tạo…).</li>
<li><strong>RequestFilter - - -&gt; UserDao, UserBean</strong> — filter nạp người dùng đang đăng nhập.</li>
<li><strong>BaseController ◇—— UserBean</strong> — controller giữ người dùng hiện tại.</li>
</ul>
<p class="nhan">Ánh xạ sang code của bạn</p>
<p>Controller = servlet, Dao = DAO trong <code>dal</code>, Bean = model class, RequestFilter = <code>@WebFilter</code>, MyUtils = helper trong <code>util</code>. Vẽ một diagram như vậy cho mỗi màn hình/tính năng bạn phụ trách, với tên class <em>của bạn</em>.</p>`],
  [50, 'Class relationships (3/3) — the same UC, dynamic view (sequence diagram)',
    `<p class="y-chinh">🎯 The sequence diagram shows the same classes as slide 49 exchanging messages in time order for one use case: "Manage Users / list products".</p>
<p class="nhan">Read the messages top to bottom</p>
<ol class="hai-cot">
<li>Administrator → ProductController: <em>Click menu Manage Users</em></li>
<li>→ RequestFilter: <em>doFilter</em></li>
<li>RequestFilter: <em>initDbConn</em> (self)</li>
<li>RequestFilter: <em>checkUserInfo</em> (self)</li>
<li>ProductController: <em>doGet</em></li>
<li>→ BaseController: <em>checkAccessRight</em></li>
<li>↩ <em>Invalid UserInfo — redirect to login</em></li>
<li>↩ <em>Unauthorized User — show message</em></li>
<li>↩ <em>Valid UserAccess</em></li>
<li>ProductController: <em>getRead</em> (self)</li>
<li>→ MyUtils: <em>getDbConnection</em></li>
<li>(12: blank return)</li>
<li>→ ProductDao: <em>queryProducts</em></li>
<li>↩ <em>Return products list</em></li>
<li>→ ProductsView: <em>Fill Products View</em></li>
<li>↩ Administrator: <em>HTML Products List</em></li>
</ol>
<p class="nhan">Notation</p>
<ul>
<li><strong>Lifeline</strong> — dashed vertical line under each object; <strong>activation bar</strong> — the thin rectangle while it works.</li>
<li><strong>Solid arrow</strong> — a call; <strong>dashed arrow</strong> — a return; messages 7–9 are alternatives (draw them in an <code>alt</code> frame in your own diagrams).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Sample naming mismatch.</strong> The use case says "Manage Users" but the flow lists products. Copying the sample without renaming is a common way to lose the design mark — your messages must match your screen.</div>`,
    `<p class="y-chinh">🎯 Sequence diagram cho thấy chính các class của slide 49 trao đổi message theo thứ tự thời gian cho một use case: "Manage Users / liệt kê sản phẩm".</p>
<p class="nhan">Đọc message từ trên xuống</p>
<ol class="hai-cot">
<li>Administrator → ProductController: <em>Click menu Manage Users</em></li>
<li>→ RequestFilter: <em>doFilter</em></li>
<li>RequestFilter: <em>initDbConn</em> (tự gọi)</li>
<li>RequestFilter: <em>checkUserInfo</em> (tự gọi)</li>
<li>ProductController: <em>doGet</em></li>
<li>→ BaseController: <em>checkAccessRight</em></li>
<li>↩ <em>Invalid UserInfo — chuyển về login</em></li>
<li>↩ <em>Unauthorized User — báo lỗi</em></li>
<li>↩ <em>Valid UserAccess</em></li>
<li>ProductController: <em>getRead</em> (tự gọi)</li>
<li>→ MyUtils: <em>getDbConnection</em></li>
<li>(12: return trống)</li>
<li>→ ProductDao: <em>queryProducts</em></li>
<li>↩ <em>Return products list</em></li>
<li>→ ProductsView: <em>Fill Products View</em></li>
<li>↩ Administrator: <em>HTML Products List</em></li>
</ol>
<p class="nhan">Ký pháp</p>
<ul>
<li><strong>Lifeline</strong> — đường đứt thẳng đứng dưới mỗi object; <strong>activation bar</strong> — hình chữ nhật mảnh khi nó đang làm việc.</li>
<li><strong>Mũi tên liền</strong> — lời gọi; <strong>mũi tên đứt</strong> — trả về; message 7–9 là các nhánh thay thế (trong diagram của bạn hãy vẽ trong khung <code>alt</code>).</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Tên trong mẫu không khớp.</strong> Use case ghi "Manage Users" nhưng luồng lại liệt kê sản phẩm. Chép mẫu không đổi tên là cách mất điểm thiết kế phổ biến — message phải khớp với màn hình của bạn.</div>`],
  [51, 'Inheritance in design',
    `<p class="y-chinh">🎯 Use inheritance for two similar but not identical classes: the shared part goes up to a superclass, the differences stay in subclasses.</p>
<ul>
<li><strong>Mechanism</strong> — share and reuse code; a child class inherits the encapsulated data and operations of its parent.</li>
<li><strong>Names</strong> — superclass = base class; subclass = derived class.</li>
<li><strong>Directions</strong> — <em>specialisation</em>: parent → child; <em>generalisation</em>: child → parent.</li>
<li><strong>Figure</strong> — Account (<code>#accountNumber</code>, <code>#balance</code>, readBalance, credit, debit, open, close) ← CheckingAccount (<code>lastDepositAmount</code>, readLastDepositAmount) and SavingsAccount (<code>cumulativeInterest</code>, addInterest, readCumulativeInterest).</li>
</ul>
<p class="nhan">Where inheritance pays off in SWP391</p>
<ul>
<li><strong>BaseDAO / DBContext</strong> — every DAO extends it to get the connection.</li>
<li><strong>BaseController</strong> — common session/role helpers for all servlets.</li>
<li><strong>User → Freelancer / Recruiter / Admin</strong> — only if they really share behaviour; G5 kept one <code>User</code> table with <code>roleID</code> plus separate profile tables.</li>
</ul>`,
    `<p class="y-chinh">🎯 Dùng kế thừa cho hai class giống nhưng không y hệt: phần chung đưa lên lớp cha, phần khác biệt ở lại lớp con.</p>
<ul>
<li><strong>Cơ chế</strong> — chia sẻ và tái dùng code; lớp con thừa hưởng dữ liệu đã đóng gói và các operation của lớp cha.</li>
<li><strong>Tên gọi</strong> — superclass = base class; subclass = derived class.</li>
<li><strong>Chiều</strong> — <em>specialization</em>: cha → con; <em>generalization</em>: con → cha.</li>
<li><strong>Hình</strong> — Account (<code>#accountNumber</code>, <code>#balance</code>, readBalance, credit, debit, open, close) ← CheckingAccount (<code>lastDepositAmount</code>, readLastDepositAmount) và SavingsAccount (<code>cumulativeInterest</code>, addInterest, readCumulativeInterest).</li>
</ul>
<p class="nhan">Kế thừa có lợi ở đâu trong SWP391</p>
<ul>
<li><strong>BaseDAO / DBContext</strong> — mọi DAO kế thừa để có kết nối.</li>
<li><strong>BaseController</strong> — helper session/vai trò dùng chung cho mọi servlet.</li>
<li><strong>User → Freelancer / Recruiter / Admin</strong> — chỉ khi thật sự chung hành vi; G5 giữ một bảng <code>User</code> với <code>roleID</code> cộng các bảng hồ sơ riêng.</li>
</ul>`],
  [52, 'Inheritance in design — abstract classes',
    `<p class="y-chinh">🎯 An abstract class has no instances; it is a template whose abstract operations each subclass must implement.</p>
<ul>
<li><strong>Abstract class</strong> — no instances; used as a template to create subclasses (<code>Account {abstract}</code>, name in italics).</li>
<li><strong>Abstract operation</strong> — declared but not implemented: <code># credit(amount) {abstract}</code>, <code># debit(amount) {abstract}</code>.</li>
<li><strong>Some operations implemented</strong> — when all subclasses need the same code (<code>open</code>, <code>close</code>, <code>readBalance</code>).</li>
</ul>
<p class="nhan">Speaker notes — why credit and debit are abstract</p>
<ul>
<li><strong>Checking</strong> — debit = deduct amount; credit = add amount and set lastDepositAmount.</li>
<li><strong>Savings</strong> — credit = add amount; debit = deduct, increment debitCount, bank charge beyond maxFreeDebits; plus <code>clearDebitCount</code> monthly.</li>
</ul>
<p class="nhan">Java equivalent</p>
<pre>
public abstract class Account {
    protected int accountNumber;
    protected double balance = 0;
    public double readBalance() { return balance; }
    protected abstract void credit(double amount);
    protected abstract void debit(double amount);
}
</pre>`,
    `<p class="y-chinh">🎯 Lớp trừu tượng không có instance; nó là khuôn mẫu mà mỗi lớp con phải hiện thực các operation trừu tượng của nó.</p>
<ul>
<li><strong>Abstract class</strong> — không có instance; dùng làm khuôn để tạo lớp con (<code>Account {abstract}</code>, tên in nghiêng).</li>
<li><strong>Abstract operation</strong> — khai báo nhưng không hiện thực: <code># credit(amount) {abstract}</code>, <code># debit(amount) {abstract}</code>.</li>
<li><strong>Vẫn hiện thực một số operation</strong> — khi mọi lớp con cần cùng một code (<code>open</code>, <code>close</code>, <code>readBalance</code>).</li>
</ul>
<p class="nhan">Ghi chú slide — vì sao credit và debit là trừu tượng</p>
<ul>
<li><strong>Checking</strong> — debit = trừ amount; credit = cộng amount và gán lastDepositAmount.</li>
<li><strong>Savings</strong> — credit = cộng amount; debit = trừ, tăng debitCount, thu phí khi vượt maxFreeDebits; thêm <code>clearDebitCount</code> hằng tháng.</li>
</ul>
<p class="nhan">Tương đương Java</p>
<pre>
public abstract class Account {
    protected int accountNumber;
    protected double balance = 0;
    public double readBalance() { return balance; }
    protected abstract void credit(double amount);
    protected abstract void debit(double amount);
}
</pre>`],
  [53, 'Polymorphism & dynamic binding (1/2)',
    `<p class="y-chinh">🎯 Polymorphism: many classes share one operation name with different implementations; dynamic binding picks the implementation at run time.</p>
<ul>
<li><strong>Polymorphism</strong> — Greek for "many forms": different classes may have the same operation, same specification, different implementation.</li>
<li><strong>Dynamic binding</strong> — used together with polymorphism: which object's operation answers a request is decided <em>at run time</em> and can change from one call to the next.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> polymorphism is about the <em>design</em> (same name, many bodies); dynamic binding is about the <em>run time</em> (which body runs now).</p>`,
    `<p class="y-chinh">🎯 Đa hình: nhiều class cùng một tên operation với cách hiện thực khác nhau; dynamic binding chọn cách hiện thực lúc chạy.</p>
<ul>
<li><strong>Polymorphism</strong> — tiếng Hy Lạp nghĩa là "nhiều hình thái": các class khác nhau có thể có cùng operation, cùng đặc tả, khác hiện thực.</li>
<li><strong>Dynamic binding</strong> — dùng cùng đa hình: operation của object nào trả lời request được quyết định <em>lúc chạy</em> và có thể đổi giữa các lần gọi.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đa hình nói về <em>thiết kế</em> (cùng tên, nhiều thân); dynamic binding nói về <em>lúc chạy</em> (thân nào chạy bây giờ).</p>`],
  [54, 'Polymorphism & dynamic binding (2/2) — example',
    `<p class="y-chinh">🎯 One variable of type Account holds a checking or a savings account; <code>anAccount.debit(amount)</code> runs the right debit automatically.</p>
<ol>
<li>Declare <code>private anAccount: Account</code>.</li>
<li>Prompt the customer for account type and amount.</li>
<li>If checking → <code>anAccount := customerCheckingAccount</code>; else if savings → <code>anAccount := customerSavingsAccount</code>.</li>
<li><code>anAccount.debit(amount)</code> — the caller does not care which; CheckingAccount.debit or SavingsAccount.debit (with the bank charge) runs.</li>
</ol>
<p class="nhan">Web-project equivalent</p>
<p>A <code>NotificationSender</code> interface with <code>EmailSender</code> and <code>InAppSender</code>: <code>ApplyJobService</code> calls <code>sender.send(recruiter, msg)</code> without an if-else on the channel. Adding SMS later means one new class, no change to the service.</p>`,
    `<p class="y-chinh">🎯 Một biến kiểu Account giữ tài khoản thanh toán hoặc tiết kiệm; <code>anAccount.debit(amount)</code> tự chạy đúng debit.</p>
<ol>
<li>Khai báo <code>private anAccount: Account</code>.</li>
<li>Hỏi khách loại tài khoản và số tiền.</li>
<li>Nếu checking → <code>anAccount := customerCheckingAccount</code>; nếu savings → <code>anAccount := customerSavingsAccount</code>.</li>
<li><code>anAccount.debit(amount)</code> — nơi gọi không cần biết loại nào; CheckingAccount.debit hoặc SavingsAccount.debit (có phí) sẽ chạy.</li>
</ol>
<p class="nhan">Tương đương trong dự án web</p>
<p>Interface <code>NotificationSender</code> với <code>EmailSender</code> và <code>InAppSender</code>: <code>ApplyJobService</code> gọi <code>sender.send(recruiter, msg)</code> mà không if-else theo kênh. Sau này thêm SMS chỉ cần một class mới, service không đổi.</p>`],
  [55, 'Q&A',
    `<p class="y-chinh">🎯 End of the deck — test yourself before the teacher's Q&amp;A.</p>
<ol>
<li>Which analysis messages of your screen became which operations?</li>
<li>Which class of your feature is «coordinator», which «business logic», which «entity»?</li>
<li>Does your package diagram match your GitLab source tree?</li>
</ol>
<p class="ghi-chu">Quiz 3 at the end of this chapter covers the whole deck plus the database design deck.</p>`,
    `<p class="y-chinh">🎯 Hết bộ slide — tự kiểm tra trước buổi hỏi đáp của thầy/cô.</p>
<ol>
<li>Message phân tích nào của màn hình bạn đã thành operation nào?</li>
<li>Class nào trong tính năng của bạn là «coordinator», «business logic», «entity»?</li>
<li>Package diagram có khớp cây mã nguồn trên GitLab không?</li>
</ol>
<p class="ghi-chu">Quiz 3 cuối chương bao phủ toàn bộ slide này cùng slide thiết kế CSDL.</p>`],
// @R34
];
const L34 = {
  title: '3.4 — OO design: class interfaces, detailed design, class diagrams, inheritance, polymorphism|||3.4 — Thiết kế OO: interface lớp, thiết kế chi tiết, class diagram, kế thừa, đa hình',
  slug: 'swp391-3-oo-design',
  type: 'VIDEO',
  description: 'Slide3 trang 36–55: thiết kế lớp information hiding, data abstraction, GUI, business logic, thiết kế operation từ communication diagram, pseudocode, quan hệ lớp, class & sequence diagram cho một UC theo MVC, kế thừa, lớp trừu tượng, đa hình & dynamic binding.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.4 · Slide3 System Design pages 36–55</span>
<h2>Object-oriented design — from messages to class interfaces, pseudocode and class diagrams</h2>
<p class="lead">This is the code-level half of design, and the part each member draws for his/her own screens in every iteration. The deck shows how analysis classes become design classes with stereotypes, how each message of the interaction model becomes an operation with <code>in</code>/<code>out</code> parameters, how operation internals are written as pseudocode, and how inheritance, abstract classes and polymorphism reduce duplicated code. Slides 49–50 are the exact class + sequence diagram pair the SDS asks for per feature.</p>
<div class="callout"><strong>After this lesson you can</strong>
<ul>
<li>design entity, GUI, business-logic and control classes with correct stereotypes;</li>
<li>derive a class's operations and parameters from a communication or sequence diagram;</li>
<li>write the detailed design (pseudocode) of a non-trivial operation and review it for bugs;</li>
<li>read and draw association, aggregation, composition, generalisation and dependency;</li>
<li>explain abstract classes, polymorphism and dynamic binding with an example from your project.</li>
</ul></div>`,
`<span class="eyebrow">Chương 3 · Bài 3.4 · Slide3 System Design trang 36–55</span>
<h2>Thiết kế hướng đối tượng — từ message tới interface của class, pseudocode và class diagram</h2>
<p class="lead">Đây là nửa thiết kế ở mức code, phần mỗi thành viên vẽ cho màn hình của mình trong mọi iteration. Bộ slide cho thấy class phân tích thành design class có stereotype ra sao, mỗi message của mô hình tương tác thành một operation với tham số <code>in</code>/<code>out</code> thế nào, phần bên trong operation được viết bằng pseudocode, và kế thừa, lớp trừu tượng, đa hình giảm code lặp như thế nào. Slide 49–50 chính là cặp class + sequence diagram mà SDS yêu cầu cho mỗi tính năng.</p>
<div class="callout"><strong>Học xong bài này bạn có thể</strong>
<ul>
<li>thiết kế entity, GUI, business-logic và control class với đúng stereotype;</li>
<li>suy ra operation và tham số của class từ communication hoặc sequence diagram;</li>
<li>viết thiết kế chi tiết (pseudocode) cho một operation không tầm thường và review tìm lỗi;</li>
<li>đọc và vẽ association, aggregation, composition, generalization và dependency;</li>
<li>giải thích lớp trừu tượng, đa hình và dynamic binding bằng ví dụ trong đồ án.</li>
</ul></div>`),
    walkHead(G, 36, 55, 'Most examples are Gomaa\'s ATM (ATMCash, ATMCard, WithdrawalTransactionManager) and Account hierarchy; slides 49–50 are the MVC sample reused in Template2.', 'Phần lớn ví dụ là ATM của Gomaa (ATMCash, ATMCard, WithdrawalTransactionManager) và phân cấp Account; slide 49–50 là mẫu MVC được dùng lại trong Template2.'),
    walk(G, R34),
    bi(`<h2>🔧 Worked example — the design classes of "Apply job"</h2>
<p>Continuing Lesson 3.2 (analysis) and Lesson 3.3 (packages): here are the classes one member draws for the Apply job feature, with stereotypes, visibility and typed operations.</p>
<pre>
«GUI» post-detail.jsp            «coordinator» ApplyJobController (servlet)
+ displayPost(in post)           + doPost(in req, in resp)
+ submitApply(out postId,        - savedCvPath(in req) : String
              out cvFile)
          |  - - - uses - - - &gt;          |  - - - uses - - - &gt;
«business logic» JobApplyService          «data abstraction» JobApplyDAO  ——▷  DBContext
+ apply(in freelanceID, in postID,        + exists(in freelanceID, in postID) : boolean
        in cvPath) : String               + insert(in a : JobApply) : int
+ approve(in applyID, in recruiterID)     + getByFreelancer(in freelanceID) : List&lt;JobApply&gt;
+ reject(in applyID, in recruiterID)      + updateStatus(in applyID, in status)
          |  - - - uses - - - &gt;  «data abstraction» PostDAO ——▷ DBContext
                                 + getById(in postID) : Post
«entity» JobApply: - applyID, freelanceID, postID : int; - status : String; - dateApply : Date; - resume : String
«entity» Post:     - postID : int; - expired : Date; - status : int; …
</pre>
<p class="nhan">Detailed design of <code>JobApplyService.apply</code> (pseudocode)</p>
<pre>
apply (in freelanceID, in postID, in cvPath) : String
begin
  post := PostDAO.getById(postID);
  if post is null or post.status is not "open"   then return "Post not found";
  if post.expired &lt; today                          then return "Post expired";        -- BR-05
  if JobApplyDAO.exists(freelanceID, postID)       then return "Already applied";
  JobApplyDAO.insert(new JobApply(freelanceID, postID, status "0", today, cvPath));
  return "OK";                                   -- no cancel operation exists: BR-11
end
</pre>
<h3>Checklist for every class diagram you submit</h3>
<ul>
<li>Each class has a stereotype or a package, and its name matches the source file.</li>
<li>Attributes are private (<code>-</code>); operations used by others are public (<code>+</code>) with typed parameters.</li>
<li>Arrows are the right kind: generalisation to BaseDAO/DBContext, dependency controller → service → DAO, association only for real links.</li>
<li>Every operation called in your sequence diagram appears in the class that receives it.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Prefer composition over inheritance.</strong> The Gang of Four's advice: inherit only for a true "is-a" with shared behaviour (Account → SavingsAccount); for "uses-a" pass a collaborator in (a service holding a <code>NotificationSender</code>). Deep hierarchies such as <code>BaseController → AuthController → FreelancerController → ApplyJobController</code> make every change ripple downward — the opposite of information hiding. The SOLID principles (especially Single Responsibility and Dependency Inversion) are the modern checklist for the same ideas Gomaa teaches.</div>`,
`<h2>🔧 Ví dụ có lời giải — các design class của "Apply job"</h2>
<p>Tiếp nối Bài 3.2 (phân tích) và Bài 3.3 (package): đây là các class một thành viên vẽ cho tính năng Apply job, có stereotype, phạm vi truy cập và operation có kiểu.</p>
<pre>
«GUI» post-detail.jsp            «coordinator» ApplyJobController (servlet)
+ displayPost(in post)           + doPost(in req, in resp)
+ submitApply(out postId,        - savedCvPath(in req) : String
              out cvFile)
          |  - - - uses - - - &gt;          |  - - - uses - - - &gt;
«business logic» JobApplyService          «data abstraction» JobApplyDAO  ——▷  DBContext
+ apply(in freelanceID, in postID,        + exists(in freelanceID, in postID) : boolean
        in cvPath) : String               + insert(in a : JobApply) : int
+ approve(in applyID, in recruiterID)     + getByFreelancer(in freelanceID) : List&lt;JobApply&gt;
+ reject(in applyID, in recruiterID)      + updateStatus(in applyID, in status)
          |  - - - uses - - - &gt;  «data abstraction» PostDAO ——▷ DBContext
                                 + getById(in postID) : Post
«entity» JobApply: - applyID, freelanceID, postID : int; - status : String; - dateApply : Date; - resume : String
«entity» Post:     - postID : int; - expired : Date; - status : int; …
</pre>
<p class="nhan">Thiết kế chi tiết <code>JobApplyService.apply</code> (pseudocode)</p>
<pre>
apply (in freelanceID, in postID, in cvPath) : String
begin
  post := PostDAO.getById(postID);
  if post is null or post.status is not "open"   then return "Post not found";
  if post.expired &lt; today                          then return "Post expired";        -- BR-05
  if JobApplyDAO.exists(freelanceID, postID)       then return "Already applied";
  JobApplyDAO.insert(new JobApply(freelanceID, postID, status "0", today, cvPath));
  return "OK";                                   -- không có operation huỷ: BR-11
end
</pre>
<h3>Checklist cho mỗi class diagram bạn nộp</h3>
<ul>
<li>Mỗi class có stereotype hoặc package, và tên khớp với file mã nguồn.</li>
<li>Attribute là private (<code>-</code>); operation được nơi khác dùng là public (<code>+</code>) với tham số có kiểu.</li>
<li>Mũi tên đúng loại: generalization tới BaseDAO/DBContext, dependency controller → service → DAO, association chỉ cho liên kết thật.</li>
<li>Mọi operation được gọi trong sequence diagram đều có trong class nhận nó.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Ưu tiên composition hơn kế thừa.</strong> Lời khuyên của nhóm Gang of Four: chỉ kế thừa khi thật sự "là-một" và chung hành vi (Account → SavingsAccount); với "dùng-một" hãy truyền đối tác vào (service giữ một <code>NotificationSender</code>). Phân cấp sâu như <code>BaseController → AuthController → FreelancerController → ApplyJobController</code> làm mọi thay đổi lan xuống dưới — ngược với information hiding. Nguyên lý SOLID (nhất là Single Responsibility và Dependency Inversion) là checklist hiện đại cho chính những ý Gomaa dạy.</div>`),
    books([
      ['gomaa', 'Ch. 14 (Designing object-oriented software architectures: information hiding classes, data abstraction, inheritance, polymorphism)', 'Ch. 14 (Thiết kế kiến trúc OO: lớp information hiding, data abstraction, kế thừa, đa hình)'],
      ['fowler', 'Ch. 3 (Class diagrams: the essentials), Ch. 4 (Sequence diagrams), Ch. 5 (Class diagrams: advanced concepts)', 'Ch. 3 (Class diagram: cơ bản), Ch. 4 (Sequence diagram), Ch. 5 (Class diagram: nâng cao)'],
      ['sommerville', 'Ch. 7.1 (Object-oriented design using the UML), 7.2 (Design patterns)', 'Ch. 7.1 (Thiết kế OO bằng UML), 7.2 (Design pattern)'],
    ]),
// @C34
  ].join('\n'),
};

/* ─────────────── 3.5 The SDS document + worked "Apply job" design (t-sds 1–9) ─────────────── */
const R35 = [
  [1, 'Cover — SOFTWARE DESIGN SPECIFICATION, Project Name (Code)',
    `<p class="y-chinh">🎯 The SDS is the 2026 template for the <em>design</em> half of what older classes put in one RDS document.</p>
<ul>
<li><strong>Replace</strong> "Project Name (Code)" with your system name and group code, and the date line with the real month.</li>
<li><strong>One SDS per team</strong> — every member's screens are designed inside it (section 3, one sub-section per feature).</li>
<li><strong>Submitted every iteration</strong> — with the SRS, Project Tracking xlsx, demo videos and the GitLab tag — follow your teacher's current guide on EduNext/CMS for the exact package.</li>
</ul>
<p class="ghi-chu">If your teacher still asks for the single RDS document (like the G5 sample), the same content goes into its "System High Level Design" and "Code Designs" parts.</p>`,
    `<p class="y-chinh">🎯 SDS là template 2026 cho nửa <em>thiết kế</em> mà các khoá trước gộp chung trong một tài liệu RDS.</p>
<ul>
<li><strong>Thay</strong> "Project Name (Code)" bằng tên hệ thống và mã nhóm, và dòng ngày bằng tháng thật.</li>
<li><strong>Một SDS cho cả nhóm</strong> — màn hình của mọi thành viên được thiết kế trong đó (mục 3, mỗi tính năng một mục con).</li>
<li><strong>Nộp mỗi iteration</strong> — cùng SRS, Project Tracking xlsx, video demo và GitLab tag; theo hướng dẫn hiện hành của thầy/cô trên EduNext/CMS để biết đúng bộ nộp.</li>
</ul>
<p class="ghi-chu">Nếu thầy/cô vẫn yêu cầu một tài liệu RDS duy nhất (như mẫu G5), cùng nội dung này đưa vào phần "System High Level Design" và "Code Designs" của RDS.</p>`],
  [2, 'Table of contents',
    `<p class="y-chinh">🎯 Three parts: Record of Changes, High Level Design (architecture, packages, database), then State Transition Diagrams and Detailed Design per feature.</p>
<ol>
<li><strong>I. Record of Changes</strong></li>
<li><strong>II.1 High Level Design</strong> — 1.1 Software Architecture · 1.2 Package Diagram · 1.3 Database Design</li>
<li><strong>II.2 State Transition Diagrams</strong> — 2.1 PIN Validation (sample) · 2.2 …</li>
<li><strong>II.3 Detailed Design</strong> — 3.1 &lt;Feature/Function Name1&gt; · 3.2 &lt;Feature/Function Name2&gt; …</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> sections map to the lessons — 1.1/1.2 = Lesson 3.3, 1.3 = the database lessons, 2 = state machines (Lesson 3.1), 3 = Lesson 3.4.</p>`,
    `<p class="y-chinh">🎯 Ba phần: Record of Changes, High Level Design (kiến trúc, package, CSDL), rồi State Transition Diagrams và Detailed Design cho từng tính năng.</p>
<ol>
<li><strong>I. Record of Changes</strong></li>
<li><strong>II.1 High Level Design</strong> — 1.1 Software Architecture · 1.2 Package Diagram · 1.3 Database Design</li>
<li><strong>II.2 State Transition Diagrams</strong> — 2.1 PIN Validation (mẫu) · 2.2 …</li>
<li><strong>II.3 Detailed Design</strong> — 3.1 &lt;Feature/Function Name1&gt; · 3.2 &lt;Feature/Function Name2&gt; …</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> các mục khớp với các bài — 1.1/1.2 = Bài 3.3, 1.3 = các bài CSDL, 2 = máy trạng thái (Bài 3.1), 3 = Bài 3.4.</p>`],
  [3, 'I. Record of Changes',
    `<p class="y-chinh">🎯 One row per change: Date · A/M/D · In charge · Change Description — the teacher reads it to see what changed this iteration.</p>
<ul>
<li><strong>A / M / D</strong> — Added, Modified, Deleted.</li>
<li><strong>In charge</strong> — the member who made the change (write a role or member number in shared samples; your real document uses your team's convention).</li>
<li><strong>Change Description</strong> — concrete: which section, which feature.</li>
</ul>
<table><thead><tr><th>Date</th><th>A/M/D</th><th>In charge</th><th>Change Description</th></tr></thead><tbody>
<tr><td>(iter 1)</td><td>A</td><td>member 3</td><td>3.4 Apply Job: class diagram + sequence diagram</td></tr>
<tr><td>(iter 2)</td><td>M</td><td>member 3</td><td>1.3 JobApply: add UNIQUE(freelanceID, postID); 3.4 sequence updated</td></tr>
<tr><td>(iter 2)</td><td>A</td><td>member 3</td><td>2.2 State chart of JobApply.status</td></tr>
</tbody></table>`,
    `<p class="y-chinh">🎯 Mỗi thay đổi một dòng: Date · A/M/D · In charge · Change Description — thầy/cô đọc để biết iteration này đổi gì.</p>
<ul>
<li><strong>A / M / D</strong> — Added (thêm), Modified (sửa), Deleted (xoá).</li>
<li><strong>In charge</strong> — thành viên thực hiện thay đổi (ở tài liệu mẫu ghi vai trò hoặc số thứ tự thành viên; tài liệu thật theo quy ước của nhóm).</li>
<li><strong>Change Description</strong> — cụ thể: mục nào, tính năng nào.</li>
</ul>
<table><thead><tr><th>Date</th><th>A/M/D</th><th>In charge</th><th>Change Description</th></tr></thead><tbody>
<tr><td>(iter 1)</td><td>A</td><td>thành viên 3</td><td>3.4 Apply Job: class diagram + sequence diagram</td></tr>
<tr><td>(iter 2)</td><td>M</td><td>thành viên 3</td><td>1.3 JobApply: thêm UNIQUE(freelanceID, postID); cập nhật sequence 3.4</td></tr>
<tr><td>(iter 2)</td><td>A</td><td>thành viên 3</td><td>2.2 State chart của JobApply.status</td></tr>
</tbody></table>`],
  [4, 'II.1.1 Software Architecture and 1.2 Package Diagram (instructions)',
    `<p class="y-chinh">🎯 Section 1.1 is one architecture diagram <em>plus a written explanation of every box</em>; the sample is the layered JSP/Servlet picture from Slide3 page 31.</p>
<p class="nhan">What 1.1 must contain (template text)</p>
<ul>
<li><strong>The diagram</strong> — sub-systems and/or components, external systems (if any), and the communication messages between them.</li>
<li><strong>The explanation</strong> — one line per box: what it is, what technology, what it is responsible for.</li>
</ul>
<p class="nhan">The sample, box by box</p>
<ul>
<li><strong>Web Browser</strong> — sends HTTP Request, receives HTTP Response.</li>
<li><strong>Presentation Logic Layer</strong> (Servlet: XyzController) → <strong>User Interface</strong> (JSP: xyz/list.jsp, xyz/details.jsp).</li>
<li><strong>Service Layer</strong> (Java: XyzService), <strong>Data Access Layer</strong> (JDBC: XyzDAO) → MySQL.</li>
<li><strong>Common Classes</strong> (BaseService…) and <strong>Model Classes</strong> (Java: Xyz) used by all.</li>
</ul>
<p class="nhan">1.2 instruction</p>
<p>Provide the package diagram for each sub-system, the explanation, and the <em>package and class naming conventions</em> of each package — then a description table.</p>`,
    `<p class="y-chinh">🎯 Mục 1.1 là một sơ đồ kiến trúc <em>kèm lời giải thích cho từng hộp</em>; hình mẫu chính là bức phân tầng JSP/Servlet ở Slide3 trang 31.</p>
<p class="nhan">Mục 1.1 phải có (theo chữ của template)</p>
<ul>
<li><strong>Sơ đồ</strong> — sub-system và/hoặc component, hệ thống ngoài (nếu có), và các message giao tiếp giữa chúng.</li>
<li><strong>Giải thích</strong> — mỗi hộp một dòng: là gì, công nghệ gì, chịu trách nhiệm gì.</li>
</ul>
<p class="nhan">Hình mẫu, từng hộp</p>
<ul>
<li><strong>Web Browser</strong> — gửi HTTP Request, nhận HTTP Response.</li>
<li><strong>Presentation Logic Layer</strong> (Servlet: XyzController) → <strong>User Interface</strong> (JSP: xyz/list.jsp, xyz/details.jsp).</li>
<li><strong>Service Layer</strong> (Java: XyzService), <strong>Data Access Layer</strong> (JDBC: XyzDAO) → MySQL.</li>
<li><strong>Common Classes</strong> (BaseService…) và <strong>Model Classes</strong> (Java: Xyz) dùng chung.</li>
</ul>
<p class="nhan">Hướng dẫn mục 1.2</p>
<p>Vẽ package diagram cho mỗi sub-system, giải thích, và nêu <em>quy ước đặt tên package và class</em> trong từng package — rồi một bảng mô tả.</p>`],
  [5, 'Package diagram sample, package descriptions table, 1.3 Database Design',
    `<p class="y-chinh">🎯 The sample shows packages linked by dependencies and a No · Package · Description table; then 1.3 starts the database section.</p>
<p class="nhan">Read the sample</p>
<p>Packages <code>member_authority</code>, <code>registration</code>, <code>fed_rpc</code>, <code>fed</code>, <code>mongo_db</code>, <code>fed_tool</code>, <code>util</code>, <code>registry</code>, <code>slide_authority</code>, with dashed dependency arrows (almost everything depends on <code>fed_tool</code> and <code>util</code>). It is a generic sample — replace it with your own packages.</p>
<p class="nhan">Filled table for the G5-style project</p>
<table><thead><tr><th>No</th><th>Package</th><th>Description</th></tr></thead><tbody>
<tr><td>01</td><td>controller</td><td>Servlets, one per feature (<code>XxxController</code>); read the request, call a service, forward to a JSP.</td></tr>
<tr><td>02</td><td>service</td><td>Business rules (<code>XxxService</code>), e.g. BR-05 apply only to open posts.</td></tr>
<tr><td>03</td><td>dal</td><td><code>DBContext</code> (JDBC connection) and DAOs (<code>XxxDAO</code>) — the only SQL in the system.</td></tr>
<tr><td>04</td><td>model</td><td>Entity beans, one per table (<code>Post</code>, <code>JobApply</code>…).</td></tr>
<tr><td>05</td><td>filter · util</td><td><code>AuthFilter</code> (login + role per URL prefix); validators, upload and e-mail helpers.</td></tr>
</tbody></table>
<p class="ghi-chu">G5's own table had three rows: Controller, Models, Dal. Note that its "Controller" row said it held "business classes that process the logic tasks" — rules in servlets, which is what a service package avoids.</p>`,
    `<p class="y-chinh">🎯 Mẫu cho thấy các package nối bằng dependency và một bảng No · Package · Description; rồi mục 1.3 mở đầu phần CSDL.</p>
<p class="nhan">Đọc hình mẫu</p>
<p>Các package <code>member_authority</code>, <code>registration</code>, <code>fed_rpc</code>, <code>fed</code>, <code>mongo_db</code>, <code>fed_tool</code>, <code>util</code>, <code>registry</code>, <code>slide_authority</code>, nối bằng mũi tên dependency nét đứt (gần như mọi thứ phụ thuộc <code>fed_tool</code> và <code>util</code>). Đây là mẫu chung — hãy thay bằng package của nhóm bạn.</p>
<p class="nhan">Bảng điền sẵn cho đồ án kiểu G5</p>
<table><thead><tr><th>No</th><th>Package</th><th>Description</th></tr></thead><tbody>
<tr><td>01</td><td>controller</td><td>Servlet, mỗi tính năng một cái (<code>XxxController</code>); đọc request, gọi service, forward sang JSP.</td></tr>
<tr><td>02</td><td>service</td><td>Business rule (<code>XxxService</code>), ví dụ BR-05 chỉ apply bài còn hạn.</td></tr>
<tr><td>03</td><td>dal</td><td><code>DBContext</code> (kết nối JDBC) và các DAO (<code>XxxDAO</code>) — nơi duy nhất có SQL.</td></tr>
<tr><td>04</td><td>model</td><td>Entity bean, mỗi bảng một class (<code>Post</code>, <code>JobApply</code>…).</td></tr>
<tr><td>05</td><td>filter · util</td><td><code>AuthFilter</code> (đăng nhập + vai trò theo tiền tố URL); validator, helper upload và e-mail.</td></tr>
</tbody></table>
<p class="ghi-chu">Bảng của G5 có ba dòng: Controller, Models, Dal. Để ý dòng "Controller" ghi nó chứa "business classes that process the logic tasks" — tức luật nằm trong servlet, đúng thứ mà package service giúp tránh.</p>`],
  [6, '1.3 Database Design — ERD sample and the table-fields format',
    `<p class="y-chinh">🎯 Section 1.3 = the table-relationship diagram, then one sub-section per table with a field table (PK · FK · UN · NN).</p>
<p class="nhan">The ERD sample (a blog schema, MySQL Workbench style)</p>
<ul>
<li><strong>Tables</strong> — user, post, post_comment, category, tag, post_tag, post_category, post_meta.</li>
<li><strong>Junction tables</strong> — post_tag and post_category resolve the many-to-many links.</li>
<li><strong>Self-references</strong> — post.parentId, post_comment.parentId, category.parentId (the small loops on top).</li>
</ul>
<p class="nhan">1.3.x table_name — filled for JobApply</p>
<table><thead><tr><th>No</th><th>Field</th><th>PK</th><th>FK</th><th>UN</th><th>NN</th><th>Description</th></tr></thead><tbody>
<tr><td>01</td><td>applyID</td><td>x</td><td></td><td></td><td>x</td><td>identity, auto-increment</td></tr>
<tr><td>02</td><td>freelanceID</td><td></td><td>x</td><td>(x)</td><td>x</td><td>→ Freelancer; UNIQUE together with postID (one apply per post)</td></tr>
<tr><td>03</td><td>postID</td><td></td><td>x</td><td>(x)</td><td>x</td><td>→ Post</td></tr>
<tr><td>04</td><td>status</td><td></td><td></td><td></td><td></td><td>0 pending, 1 approved (see state chart 2.x)</td></tr>
<tr><td>05</td><td>dateApply</td><td></td><td></td><td></td><td></td><td>date of application</td></tr>
<tr><td>06</td><td>Resume</td><td></td><td></td><td></td><td></td><td>path of the uploaded CV file</td></tr>
</tbody></table>
<p class="ghi-chu">The G5 script declares only the PK on JobApply; the composite UNIQUE is our design improvement so the "apply once" rule is also enforced by the database. The database lessons of this chapter explain keys and mappings in depth.</p>`,
    `<p class="y-chinh">🎯 Mục 1.3 = sơ đồ quan hệ bảng, rồi mỗi bảng một mục con có bảng trường (PK · FK · UN · NN).</p>
<p class="nhan">ERD mẫu (schema blog, kiểu MySQL Workbench)</p>
<ul>
<li><strong>Bảng</strong> — user, post, post_comment, category, tag, post_tag, post_category, post_meta.</li>
<li><strong>Bảng trung gian</strong> — post_tag và post_category giải quyết các liên kết nhiều-nhiều.</li>
<li><strong>Tự tham chiếu</strong> — post.parentId, post_comment.parentId, category.parentId (các vòng nhỏ phía trên).</li>
</ul>
<p class="nhan">1.3.x table_name — điền cho JobApply</p>
<table><thead><tr><th>No</th><th>Field</th><th>PK</th><th>FK</th><th>UN</th><th>NN</th><th>Description</th></tr></thead><tbody>
<tr><td>01</td><td>applyID</td><td>x</td><td></td><td></td><td>x</td><td>identity, tự tăng</td></tr>
<tr><td>02</td><td>freelanceID</td><td></td><td>x</td><td>(x)</td><td>x</td><td>→ Freelancer; UNIQUE cùng postID (mỗi bài apply một lần)</td></tr>
<tr><td>03</td><td>postID</td><td></td><td>x</td><td>(x)</td><td>x</td><td>→ Post</td></tr>
<tr><td>04</td><td>status</td><td></td><td></td><td></td><td></td><td>0 chờ duyệt, 1 đã duyệt (xem state chart 2.x)</td></tr>
<tr><td>05</td><td>dateApply</td><td></td><td></td><td></td><td></td><td>ngày ứng tuyển</td></tr>
<tr><td>06</td><td>Resume</td><td></td><td></td><td></td><td></td><td>đường dẫn file CV đã tải lên</td></tr>
</tbody></table>
<p class="ghi-chu">Script G5 chỉ khai báo PK cho JobApply; UNIQUE ghép là cải tiến thiết kế của chúng tôi để luật "apply một lần" được cả CSDL bảo đảm. Các bài CSDL trong chương giải thích khoá và ánh xạ kỹ hơn.</p>`],
  [7, '2. State Transition Diagrams — PIN Validation sample',
    `<p class="y-chinh">🎯 Draw a state chart for every data item or screen whose behaviour depends on its state — with events, actions, entry/exit actions.</p>
<p class="nhan">Read the PIN Validation sample (event / action on each arrow)</p>
<ol>
<li><strong>Waiting for PIN</strong> — <em>PIN Entered / Validate PIN</em> → composite state <strong>Validating PIN</strong>.</li>
<li>Inside: <strong>Validating PIN and Card</strong> — <em>Invalid PIN / Update Status</em> → <strong>Checking PIN Status</strong> — <em>Invalid PIN / Invalid PIN Prompt</em> → back to Waiting for PIN.</li>
<li><em>Third Invalid PIN / Confiscate</em>, or <em>Card Stolen, Card Expired / Confiscate, Update Status</em> → <strong>Confiscating</strong>.</li>
<li><em>Valid PIN / Display Menu, Update Status</em> → <strong>Waiting for Customer Choice</strong>.</li>
</ol>
<p class="nhan">2.2 for G5 — JobApply.status</p>
<pre>
          Freelancer applies / insert row, status 0
   (start) ---------------------------------------&gt; [Pending (0)]
                                                     |          |
       Recruiter approves / status 1, notify         |          | Recruiter rejects / status 2, notify
                                                     v          v      (2 = our suggestion)
                                              [Approved (1)]  [Rejected (2)]
   No transition "cancel" from Pending: BR-11 — a freelancer cannot cancel an application.
</pre>
<p class="ghi-chu">Good candidates in any project: order status, account status (active/suspended — G5's Activate/Suspend screens), post status (draft/pending approval/approved/suspended — G5's Approve/Suspend project).</p>`,
    `<p class="y-chinh">🎯 Vẽ state chart cho mọi dữ liệu hoặc màn hình có hành vi phụ thuộc trạng thái — kèm sự kiện, hành động, entry/exit action.</p>
<p class="nhan">Đọc mẫu PIN Validation (sự kiện / hành động trên mỗi mũi tên)</p>
<ol>
<li><strong>Waiting for PIN</strong> — <em>PIN Entered / Validate PIN</em> → trạng thái hợp <strong>Validating PIN</strong>.</li>
<li>Bên trong: <strong>Validating PIN and Card</strong> — <em>Invalid PIN / Update Status</em> → <strong>Checking PIN Status</strong> — <em>Invalid PIN / Invalid PIN Prompt</em> → quay về Waiting for PIN.</li>
<li><em>Third Invalid PIN / Confiscate</em>, hoặc <em>Card Stolen, Card Expired / Confiscate, Update Status</em> → <strong>Confiscating</strong>.</li>
<li><em>Valid PIN / Display Menu, Update Status</em> → <strong>Waiting for Customer Choice</strong>.</li>
</ol>
<p class="nhan">2.2 cho G5 — JobApply.status</p>
<pre>
          Freelancer apply / thêm dòng, status 0
   (start) ---------------------------------------&gt; [Pending (0)]
                                                     |          |
       Recruiter duyệt / status 1, thông báo         |          | Recruiter từ chối / status 2, thông báo
                                                     v          v      (2 = đề xuất của chúng tôi)
                                              [Approved (1)]  [Rejected (2)]
   Không có chuyển "huỷ" từ Pending: BR-11 — freelancer không được huỷ đơn.
</pre>
<p class="ghi-chu">Ứng viên tốt trong mọi đồ án: trạng thái đơn hàng, trạng thái tài khoản (active/suspended — màn hình Activate/Suspend của G5), trạng thái bài đăng (nháp/chờ duyệt/đã duyệt/bị khoá — Approve/Suspend project của G5).</p>`],
  [8, '3. Detailed Design — per feature: 3.x.1 Class Diagram',
    `<p class="y-chinh">🎯 Section 3 has one sub-section per feature/function: a class diagram, then one or more sequence diagrams.</p>
<p class="nhan">Template instructions (in red on the page)</p>
<ul>
<li><strong>3.x &lt;Feature/Function Name&gt;</strong> — the detailed design of that feature: class diagram and sequence diagram(s).</li>
<li><strong>Reuse rule</strong> — for features with the <em>same structure</em> of class and sequence diagrams, draw them once and refer to them from the other features (e.g. every "View list X" screen).</li>
<li><strong>3.x.1 Class Diagram</strong> — the classes of this feature only; the sample is the ProductController / BaseController / ProductDao / BaseDao / ProductBean / BaseBean / UserDao / UserBean / RequestFilter / MyUtils diagram of Slide3 page 49.</li>
</ul>
<p class="nhan">How the teacher reads it</p>
<ul>
<li>One 3.x per screen/function listed in the Project Tracking "Product" sheet — its owner draws it.</li>
<li>Class names and methods are checked against the GitLab tag of the iteration.</li>
</ul>`,
    `<p class="y-chinh">🎯 Mục 3 có mỗi tính năng/chức năng một mục con: một class diagram, rồi một hay nhiều sequence diagram.</p>
<p class="nhan">Hướng dẫn của template (chữ đỏ trên trang)</p>
<ul>
<li><strong>3.x &lt;Feature/Function Name&gt;</strong> — thiết kế chi tiết của tính năng đó: class diagram và sequence diagram.</li>
<li><strong>Luật dùng lại</strong> — tính năng nào có <em>cùng cấu trúc</em> class và sequence diagram thì vẽ một lần và tham chiếu từ các tính năng khác (ví dụ mọi màn hình "View list X").</li>
<li><strong>3.x.1 Class Diagram</strong> — chỉ các class của tính năng này; hình mẫu là diagram ProductController / BaseController / ProductDao / BaseDao / ProductBean / BaseBean / UserDao / UserBean / RequestFilter / MyUtils ở Slide3 trang 49.</li>
</ul>
<p class="nhan">Thầy/cô đọc thế nào</p>
<ul>
<li>Mỗi màn hình/chức năng trong sheet "Product" của Project Tracking có một mục 3.x — người phụ trách vẽ nó.</li>
<li>Tên class và method được đối chiếu với GitLab tag của iteration.</li>
</ul>`],
  [9, '3.x.2 Sequence Diagram(s) — sample, then 3.2 next feature',
    `<p class="y-chinh">🎯 The sample sequence diagram is Slide3 page 50 — every feature needs at least one, more when there are clearly different flows.</p>
<ul>
<li><strong>3.1.2 &lt;Sequence Diagram Name1&gt;</strong> — the main flow (here: Administrator lists products through RequestFilter, ProductController, BaseController, MyUtils, ProductDao, ProductsView).</li>
<li><strong>3.1.3, 3.1.4 …</strong> — further flows of the same feature (e.g. "save", "delete", or an error flow worth showing).</li>
<li><strong>3.2 &lt;Feature/Function Name2&gt;</strong> — the next feature starts again with its class diagram.</li>
</ul>
<p class="nhan">Naming the sequence diagrams</p>
<p>Use the use case / screen name: "3.4.2 Apply job — submit", "3.4.3 Apply job — already applied". The G5 RDS added a third part per feature, <em>Database Queries</em> (the SQL used) — worth keeping, reviewers like it.</p>
<div class="pitfall co-tieu-de"><strong>Diagrams too big to read.</strong> A sequence diagram with 30 messages and every getter drawn is unreadable. Show calls between classes, not every line of code; put alternatives in <code>alt</code> frames.</div>`,
    `<p class="y-chinh">🎯 Sequence diagram mẫu là Slide3 trang 50 — tính năng nào cũng cần ít nhất một cái, nhiều hơn nếu có các luồng khác hẳn nhau.</p>
<ul>
<li><strong>3.1.2 &lt;Sequence Diagram Name1&gt;</strong> — luồng chính (ở đây: Administrator liệt kê sản phẩm qua RequestFilter, ProductController, BaseController, MyUtils, ProductDao, ProductsView).</li>
<li><strong>3.1.3, 3.1.4 …</strong> — các luồng khác của cùng tính năng (ví dụ "lưu", "xoá", hoặc một luồng lỗi đáng vẽ).</li>
<li><strong>3.2 &lt;Feature/Function Name2&gt;</strong> — tính năng tiếp theo lại bắt đầu bằng class diagram.</li>
</ul>
<p class="nhan">Đặt tên sequence diagram</p>
<p>Dùng tên use case / màn hình: "3.4.2 Apply job — submit", "3.4.3 Apply job — already applied". RDS của G5 thêm phần thứ ba cho mỗi tính năng, <em>Database Queries</em> (các câu SQL dùng) — nên giữ, hội đồng thích.</p>
<div class="pitfall co-tieu-de"><strong>Diagram quá lớn không đọc nổi.</strong> Sequence diagram 30 message vẽ cả từng getter thì không ai đọc được. Chỉ vẽ lời gọi giữa các class, không vẽ từng dòng code; đặt các nhánh vào khung <code>alt</code>.</div>`],
// @R35
];
const L35 = {
  title: '3.5 — Filling the SDS (Template2) — worked “Apply job” design|||3.5 — Viết tài liệu SDS (Template2) — ví dụ thiết kế “Apply job”',
  slug: 'swp391-3-sds-document',
  type: 'VIDEO',
  description: 'Template2 SDS Document trang 1–9, từng mục: Record of Changes, kiến trúc, package diagram, thiết kế CSDL, state transition diagram, class & sequence diagram cho từng tính năng — kèm bản thiết kế hoàn chỉnh cho chức năng Apply job của hệ thống G5.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.5 · Template2 SDS Document pages 1–9</span>
<h2>Filling the SDS — every section, and one feature designed end to end</h2>
<p class="lead">Template2 <em>Software Design Specification</em> is where all the design of this chapter is handed in. It is short — Record of Changes, High Level Design (architecture, packages, database), State Transition Diagrams and Detailed Design per feature — but each section has rules the teacher checks. This lesson walks the 9 rendered pages of the template, then fills the design sections for one real feature of the G5 <em>Job IT for Freelancer</em> system: <strong>Apply job</strong>.</p>
<div class="callout"><strong>After this lesson you can</strong>
<ul>
<li>fill the Record of Changes so the teacher sees what changed in each iteration;</li>
<li>write SDS 1.1 (architecture + explanation) and 1.2 (package diagram + description table);</li>
<li>describe a table in the 1.3 format (PK · FK · UN · NN) and draw a state chart with events and actions;</li>
<li>deliver 3.x for your own feature: class diagram, sequence diagram(s) and the SQL used.</li>
</ul></div>`,
`<span class="eyebrow">Chương 3 · Bài 3.5 · Template2 SDS Document trang 1–9</span>
<h2>Viết tài liệu SDS — từng mục, và một tính năng thiết kế trọn vẹn</h2>
<p class="lead">Template2 <em>Software Design Specification</em> là nơi nộp toàn bộ phần thiết kế của chương này. Nó ngắn — Record of Changes, High Level Design (kiến trúc, package, CSDL), State Transition Diagrams và Detailed Design cho từng tính năng — nhưng mỗi mục đều có luật thầy/cô kiểm tra. Bài này đi qua 9 trang của template, rồi điền các mục thiết kế cho một tính năng thật của hệ thống G5 <em>Job IT for Freelancer</em>: <strong>Apply job</strong>.</p>
<div class="callout"><strong>Học xong bài này bạn có thể</strong>
<ul>
<li>điền Record of Changes để thầy/cô thấy mỗi iteration đổi gì;</li>
<li>viết SDS 1.1 (kiến trúc + giải thích) và 1.2 (package diagram + bảng mô tả);</li>
<li>mô tả một bảng theo định dạng 1.3 (PK · FK · UN · NN) và vẽ state chart có sự kiện và hành động;</li>
<li>nộp mục 3.x cho tính năng của mình: class diagram, sequence diagram và các câu SQL dùng.</li>
</ul></div>`),
    walkHead(S, 1, 9, 'The template is a Word document; the pages here are rendered from the 2026 version (dated Sep 2025). Blue/red italic text is instructions to delete once filled.', 'Template là file Word; các trang ở đây được dựng từ bản 2026 (ghi Sep 2025). Chữ nghiêng xanh/đỏ là hướng dẫn, điền xong thì xoá.'),
    walk(S, R35),
    bi(`<h2>🔧 Worked example — SDS 3.4 "Apply job" (G5 Job IT for Freelancer)</h2>
<p>What one member hands in for one feature. Diagrams are given as text so you can redraw them in draw.io, StarUML or PlantUML; the classes follow the package layout of Lesson 3.3 and the operations of Lesson 3.4.</p>
<h3>Where the feature sits — package view (excerpt of SDS 1.2)</h3>
<pre>
 +-------------------+      +----------------------+      +---------------------+
 | views/freelancer  | - -&gt; | controller           | - -&gt; | service             |
 | post-detail.jsp   |      | ApplyJobController   |      | JobApplyService     |
 | list-apply.jsp    |      | ListApplyController  |      +----------+----------+
 +-------------------+      +----------+-----------+                 |
                                       |                             v
 +-------------------+                 |                  +---------------------+
 | filter            |                 +- - - - - - - - -&gt;| dal                 |
 | AuthFilter        | - - - - - - - - - - - - - - - - - -&gt;| DBContext, PostDAO, |
 +-------------------+                                    | JobApplyDAO         |
                         +-------------------+            +----------+----------+
                         | model             | &lt;- - - - - - - - - - -+ (all use model)
                         | Post, JobApply    |
                         +-------------------+
</pre>
<h3>3.4.1 Class Diagram</h3>
<table><thead><tr><th>Class (package)</th><th>Stereotype</th><th>Key members</th><th>Relationships</th></tr></thead><tbody>
<tr><td>post-detail.jsp (views)</td><td>«GUI»</td><td>form: postId (hidden), cvFile, button Apply; shows error/success message</td><td>posts to ApplyJobController</td></tr>
<tr><td>AuthFilter (filter)</td><td>«control»</td><td>doFilter(): session user exists and role = Freelancer for /freelancer/*</td><td>runs before the controller</td></tr>
<tr><td>ApplyJobController (controller)</td><td>«coordinator»</td><td>doPost(req, resp); savedCvPath(req)</td><td>- - -&gt; JobApplyService</td></tr>
<tr><td>JobApplyService (service)</td><td>«business logic»</td><td>apply(freelanceID, postID, cvPath) : String</td><td>- - -&gt; PostDAO, JobApplyDAO, JobApply</td></tr>
<tr><td>PostDAO, JobApplyDAO (dal)</td><td>«data abstraction»</td><td>getById(postID) : Post; exists(fid, pid) : boolean; insert(JobApply) : int</td><td>——▷ DBContext</td></tr>
<tr><td>Post, JobApply (model)</td><td>«entity»</td><td>private fields = table columns, getters/setters</td><td>JobApply * —— 1 Post</td></tr>
</tbody></table>`,
`<h2>🔧 Ví dụ có lời giải — SDS 3.4 "Apply job" (G5 Job IT for Freelancer)</h2>
<p>Thứ một thành viên nộp cho một tính năng. Diagram cho ở dạng chữ để bạn vẽ lại bằng draw.io, StarUML hoặc PlantUML; các class theo cấu trúc package của Bài 3.3 và operation của Bài 3.4.</p>
<h3>Tính năng nằm ở đâu — góc nhìn package (trích SDS 1.2)</h3>
<pre>
 +-------------------+      +----------------------+      +---------------------+
 | views/freelancer  | - -&gt; | controller           | - -&gt; | service             |
 | post-detail.jsp   |      | ApplyJobController   |      | JobApplyService     |
 | list-apply.jsp    |      | ListApplyController  |      +----------+----------+
 +-------------------+      +----------+-----------+                 |
                                       |                             v
 +-------------------+                 |                  +---------------------+
 | filter            |                 +- - - - - - - - -&gt;| dal                 |
 | AuthFilter        | - - - - - - - - - - - - - - - - - -&gt;| DBContext, PostDAO, |
 +-------------------+                                    | JobApplyDAO         |
                         +-------------------+            +----------+----------+
                         | model             | &lt;- - - - - - - - - - -+ (mọi package dùng model)
                         | Post, JobApply    |
                         +-------------------+
</pre>
<h3>3.4.1 Class Diagram</h3>
<table><thead><tr><th>Class (package)</th><th>Stereotype</th><th>Thành phần chính</th><th>Quan hệ</th></tr></thead><tbody>
<tr><td>post-detail.jsp (views)</td><td>«GUI»</td><td>form: postId (ẩn), cvFile, nút Apply; hiện thông báo lỗi/thành công</td><td>gửi tới ApplyJobController</td></tr>
<tr><td>AuthFilter (filter)</td><td>«control»</td><td>doFilter(): có user trong session và role = Freelancer cho /freelancer/*</td><td>chạy trước controller</td></tr>
<tr><td>ApplyJobController (controller)</td><td>«coordinator»</td><td>doPost(req, resp); savedCvPath(req)</td><td>- - -&gt; JobApplyService</td></tr>
<tr><td>JobApplyService (service)</td><td>«business logic»</td><td>apply(freelanceID, postID, cvPath) : String</td><td>- - -&gt; PostDAO, JobApplyDAO, JobApply</td></tr>
<tr><td>PostDAO, JobApplyDAO (dal)</td><td>«data abstraction»</td><td>getById(postID) : Post; exists(fid, pid) : boolean; insert(JobApply) : int</td><td>——▷ DBContext</td></tr>
<tr><td>Post, JobApply (model)</td><td>«entity»</td><td>field private = cột của bảng, getter/setter</td><td>JobApply * —— 1 Post</td></tr>
</tbody></table>`),
    bi(`<h3>3.4.2 Sequence Diagram — Apply job (submit)</h3>
<pre>
Freelancer -&gt; post-detail.jsp      : 1 click Apply (postId, cvFile)
post-detail.jsp -&gt; AuthFilter      : 2 POST /freelancer/apply (multipart)
AuthFilter -&gt; AuthFilter           : 3 checkSession() + role = Freelancer
alt not logged in / wrong role
  AuthFilter --&gt; Freelancer        : 4 redirect /login
else OK
  AuthFilter -&gt; ApplyJobController : 5 doPost(req, resp)
  ApplyJobController -&gt; ApplyJobController : 6 savedCvPath(req)   (store file, get path)
  ApplyJobController -&gt; JobApplyService    : 7 apply(freelanceID, postId, cvPath)
  JobApplyService -&gt; PostDAO               : 8 getById(postId)
  PostDAO --&gt; JobApplyService              : 9 post
  JobApplyService -&gt; JobApplyDAO           : 10 exists(freelanceID, postId)
  JobApplyDAO --&gt; JobApplyService          : 11 false
  JobApplyService -&gt; JobApplyDAO           : 12 insert(new JobApply(..., status "0", today, cvPath))
  JobApplyService --&gt; ApplyJobController   : 13 "OK"
  ApplyJobController --&gt; Freelancer        : 14 redirect /freelancer/applies (List Apply)
end
</pre>
<h3>3.4.3 Sequence Diagram — Apply job (refused)</h3>
<p>Same as messages 1–9, then: <code>post.expired &lt; today</code> → <em>"Post expired"</em> (BR-05), or <code>exists = true</code> → <em>"Already applied"</em>; the controller forwards back to <code>post-detail.jsp</code> with <code>error</code> set. Draw it as an <code>alt</code> frame or as its own small diagram.</p>
<h3>3.4.4 Database Queries</h3>
<pre>
SELECT * FROM Post WHERE postID = ?;
SELECT COUNT(*) FROM JobApply WHERE freelanceID = ? AND postID = ?;
INSERT INTO JobApply (freelanceID, postID, status, dateApply, Resume) VALUES (?, ?, '0', ?, ?);
</pre>
<h3>Before you submit the SDS — checklist</h3>
<ul>
<li>Record of Changes has this iteration's rows (A/M/D, who, what).</li>
<li>1.1: every box renamed to your system and explained in one line each.</li>
<li>1.2: package diagram = the source tree in the GitLab tag; description table filled.</li>
<li>1.3: ERD matches the DB script you submit; each table has its field table.</li>
<li>2: a state chart for each status column that has more than two values or rules.</li>
<li>3: one 3.x per screen in the Product sheet; messages = real method names; SQL listed.</li>
<li>Instructions in blue/red italics deleted; no sample diagrams left (ProductController, PIN Validation, fed_tool).</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Diagrams as code.</strong> The sequence above is almost valid PlantUML — add <code>@startuml</code> / <code>@enduml</code> and it renders. Keeping <code>.puml</code> files next to the source in GitLab means a diagram changes in the same merge request as the code, and a reviewer sees both diffs together; that is how many teams keep design and implementation from drifting apart. IEEE 1016 (Software Design Descriptions) is the standard behind templates like this SDS: it organises a design as <em>viewpoints</em> — context, composition, logical, interaction, state dynamics — which are exactly Template2's sections.</div>`,
`<h3>3.4.2 Sequence Diagram — Apply job (gửi đơn)</h3>
<pre>
Freelancer -&gt; post-detail.jsp      : 1 bấm Apply (postId, cvFile)
post-detail.jsp -&gt; AuthFilter      : 2 POST /freelancer/apply (multipart)
AuthFilter -&gt; AuthFilter           : 3 checkSession() + role = Freelancer
alt chưa đăng nhập / sai vai trò
  AuthFilter --&gt; Freelancer        : 4 redirect /login
else OK
  AuthFilter -&gt; ApplyJobController : 5 doPost(req, resp)
  ApplyJobController -&gt; ApplyJobController : 6 savedCvPath(req)   (lưu file, lấy đường dẫn)
  ApplyJobController -&gt; JobApplyService    : 7 apply(freelanceID, postId, cvPath)
  JobApplyService -&gt; PostDAO               : 8 getById(postId)
  PostDAO --&gt; JobApplyService              : 9 post
  JobApplyService -&gt; JobApplyDAO           : 10 exists(freelanceID, postId)
  JobApplyDAO --&gt; JobApplyService          : 11 false
  JobApplyService -&gt; JobApplyDAO           : 12 insert(new JobApply(..., status "0", hôm nay, cvPath))
  JobApplyService --&gt; ApplyJobController   : 13 "OK"
  ApplyJobController --&gt; Freelancer        : 14 redirect /freelancer/applies (List Apply)
end
</pre>
<h3>3.4.3 Sequence Diagram — Apply job (bị từ chối)</h3>
<p>Giống message 1–9, rồi: <code>post.expired &lt; today</code> → <em>"Post expired"</em> (BR-05), hoặc <code>exists = true</code> → <em>"Already applied"</em>; controller forward về <code>post-detail.jsp</code> kèm <code>error</code>. Vẽ bằng khung <code>alt</code> hoặc một diagram nhỏ riêng.</p>
<h3>3.4.4 Database Queries</h3>
<pre>
SELECT * FROM Post WHERE postID = ?;
SELECT COUNT(*) FROM JobApply WHERE freelanceID = ? AND postID = ?;
INSERT INTO JobApply (freelanceID, postID, status, dateApply, Resume) VALUES (?, ?, '0', ?, ?);
</pre>
<h3>Trước khi nộp SDS — checklist</h3>
<ul>
<li>Record of Changes có các dòng của iteration này (A/M/D, ai, cái gì).</li>
<li>1.1: mọi hộp đổi tên theo hệ thống của bạn và mỗi hộp giải thích một dòng.</li>
<li>1.2: package diagram = cây mã nguồn trong GitLab tag; bảng mô tả đã điền.</li>
<li>1.3: ERD khớp script CSDL nộp kèm; mỗi bảng có bảng trường.</li>
<li>2: state chart cho mỗi cột trạng thái có nhiều hơn hai giá trị hoặc có luật.</li>
<li>3: mỗi màn hình trong sheet Product có một mục 3.x; message = tên method thật; có liệt kê SQL.</li>
<li>Đã xoá chữ hướng dẫn nghiêng xanh/đỏ; không còn diagram mẫu (ProductController, PIN Validation, fed_tool).</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Diagram dạng code.</strong> Sequence ở trên gần như là PlantUML hợp lệ — thêm <code>@startuml</code> / <code>@enduml</code> là vẽ ra hình. Giữ file <code>.puml</code> cạnh mã nguồn trên GitLab nghĩa là diagram đổi trong cùng merge request với code, người review thấy cả hai diff một lúc; nhiều nhóm giữ thiết kế và hiện thực không lệch nhau nhờ cách này. IEEE 1016 (Software Design Descriptions) là chuẩn đứng sau các template như SDS này: nó tổ chức bản thiết kế thành các <em>viewpoint</em> — context, composition, logical, interaction, state dynamics — đúng bằng các mục của Template2.</div>`),
    books([
      ['fowler', 'Ch. 4 (Sequence diagrams), Ch. 7 (Package diagrams), Ch. 10 (State machine diagrams)', 'Ch. 4 (Sequence diagram), Ch. 7 (Package diagram), Ch. 10 (State machine diagram)'],
      ['gomaa', 'Ch. 10 (Finite state machines), Ch. 14 (Designing object-oriented software architectures)', 'Ch. 10 (Máy trạng thái hữu hạn), Ch. 14 (Thiết kế kiến trúc phần mềm OO)'],
      ['sommerville', 'Ch. 5.4 (Behavioural models — state diagrams), Ch. 7 (Design and implementation)', 'Ch. 5.4 (Mô hình hành vi — state diagram), Ch. 7 (Design and implementation)'],
    ]),
// @C35
  ].join('\n'),
};

/* ─────────────── Quiz 3 — system + database design (kept slug) ─────────────── */
const QUIZ = {
  title: 'Quiz 3 — System & database design|||Quiz 3 — Thiết kế hệ thống & cơ sở dữ liệu',
  slug: 'swp391-quiz-3',
  type: 'QUIZ',
  description: 'Kiểm tra toàn bộ Chương 3: COMET, context & entity model, phân loại đối tượng, MVC/phân tầng/client–server, package, thiết kế lớp, kế thừa, đa hình, SDS và ánh xạ mô hình tĩnh sang CSDL quan hệ.',
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      q("In Slide3, what is the difference between software design and implementation?|||Theo Slide3, software design khác implementation thế nào?", ["Design identifies components and their relationships from the requirements; implementation realises that design as a program|||Design xác định các thành phần và quan hệ giữa chúng từ yêu cầu; implementation biến thiết kế đó thành chương trình", "Design is writing the SRS; implementation is testing|||Design là viết SRS; implementation là kiểm thử", "They are the same activity|||Chúng là cùng một hoạt động", "Design is done only after coding|||Design chỉ làm sau khi code"], 0, "Slide 3: design is a creative activity identifying components and relationships; implementation realises the design as a program.|||Slide 3: design là hoạt động sáng tạo xác định thành phần và quan hệ; implementation hiện thực thiết kế thành chương trình."),
      q("Which four activities make up the general model of the design process (slide 5)?|||Bốn hoạt động nào tạo nên mô hình tổng quát của quy trình thiết kế (slide 5)?", ["Architectural, interface, component and database design|||Thiết kế kiến trúc, interface, component và CSDL", "Planning, coding, testing, deployment|||Lập kế hoạch, code, test, triển khai", "Elicitation, analysis, specification, validation|||Thu thập, phân tích, đặc tả, xác nhận", "Use case, class, sequence and state diagrams|||Use case, class, sequence và state diagram"], 0, "The design activities box contains architectural, interface, component and database design; the outputs are the four matching specifications.|||Ô Design Activities gồm thiết kế kiến trúc, interface, component và CSDL; đầu ra là bốn bản đặc tả tương ứng."),
      q("In SWP391, when does a team member design the screens he or she codes?|||Trong SWP391, khi nào một thành viên thiết kế các màn hình mình code?", ["In every iteration, for the 3-4 screens/functions of that iteration|||Trong mỗi iteration, cho 3-4 màn hình/chức năng của iteration đó", "Only in a separate design phase before any coding|||Chỉ trong một giai đoạn thiết kế riêng trước khi code", "Only in Iteration 3 for the final report|||Chỉ ở Iteration 3 cho báo cáo cuối", "Never; only the leader designs|||Không bao giờ; chỉ leader thiết kế"], 0, "SWP391 has 3 iterations; in each one every member does requirement, design and full-stack code for his/her own screens.|||SWP391 có 3 iteration; trong mỗi iteration mọi thành viên làm requirement, design và code full-stack cho màn hình của mình."),
      q("Information hiding means…|||Information hiding nghĩa là…", ["hiding the data structure that may change inside an object, reachable only through its operations|||giấu cấu trúc dữ liệu có thể thay đổi vào trong object, chỉ truy cập qua các operation", "encrypting all data in the database|||mã hoá toàn bộ dữ liệu trong CSDL", "not documenting the code|||không viết tài liệu cho code", "making all attributes public for easy access|||để mọi attribute public cho dễ truy cập"], 0, "Slides 8-9: other objects reach encapsulated data only by calling the object's operations; if the structure changes only that object changes (data abstraction).|||Slide 8-9: object khác chỉ chạm dữ liệu đã đóng gói qua operation; cấu trúc đổi thì chỉ object đó phải đổi (data abstraction)."),
      q("Which set lists the four models combined by modern OO analysis and design methods (slide 11)?|||Tập nào liệt kê bốn mô hình mà các phương pháp phân tích & thiết kế OO hiện đại kết hợp (slide 11)?", ["Use case, static, dynamic (interaction) and state machine models|||Mô hình use case, tĩnh, động (tương tác) và máy trạng thái", "Waterfall, spiral, V and agile models|||Mô hình thác nước, xoắn ốc, V và agile", "Conceptual, logical, physical and view models|||Mô hình khái niệm, logic, vật lý và view", "Context, ERD, DFD and flowchart|||Context, ERD, DFD và flowchart"], 0, "Slide 11: use case modelling, static modelling, dynamic (object interaction) modelling and state machine modelling.|||Slide 11: mô hình use case, mô hình tĩnh, mô hình động (tương tác object) và máy trạng thái."),
      q("In a software system context diagram, how is an ATM card reader modelled?|||Trong software system context diagram, đầu đọc thẻ ATM được mô hình hoá thế nào?", ["As an «external input/output device» class|||Là class «external input/output device»", "As an «entity» class|||Là class «entity»", "As a «business logic» class|||Là class «business logic»", "It is not shown because it is hardware|||Không vẽ vì là phần cứng"], 0, "Slides 14 and 16: a device that both gives input and receives output (card reader) is an external I/O device; hardware is outside the software black box.|||Slide 14 và 16: thiết bị vừa đưa vào vừa nhận ra (đầu đọc thẻ) là external I/O device; phần cứng nằm ngoài hộp đen phần mềm."),
      q("According to COMET, an external system (e.g. an SMTP mail server) communicates with which boundary class inside the software?|||Theo COMET, một hệ thống ngoài (ví dụ mail server SMTP) giao tiếp với boundary class nào bên trong phần mềm?", ["A proxy class|||Một proxy class", "A user interaction class|||Một user interaction class", "An entity class|||Một entity class", "A timer class|||Một timer class"], 0, "Slide 21: an external system class interfaces to and communicates with a proxy class.|||Slide 21: external system class giao tiếp với một proxy class."),
      q("Which object category provides the overall coordination for a collection of objects?|||Nhóm object nào điều phối tổng thể một tập các object?", ["Control object (coordinator, state-dependent control, timer)|||Control object (coordinator, state-dependent control, timer)", "Entity object|||Entity object", "Boundary object|||Boundary object", "Algorithm object|||Algorithm object"], 0, "Slide 20: control objects coordinate collections of objects and may be coordinator, state-dependent control or timer objects.|||Slide 20: control object điều phối tập object và có thể là coordinator, state-dependent control hoặc timer."),
      q("In the MVC organisation (slide 27), which component maps user actions to model updates and selects the view?|||Trong tổ chức MVC (slide 27), thành phần nào ánh xạ thao tác người dùng thành cập nhật model và chọn view?", ["Controller|||Controller", "Model|||Model", "View|||View", "Database|||Database"], 0, "The Controller box reads: maps user actions to model updates, selects view.|||Ô Controller ghi: ánh xạ thao tác người dùng thành cập nhật model, chọn view."),
      q("Which is a stated disadvantage of the MVC pattern?|||Đâu là nhược điểm được nêu của mẫu MVC?", ["Additional code and complexity when the data model and interactions are simple|||Thêm code và độ phức tạp khi mô hình dữ liệu và tương tác đơn giản", "Data cannot be shown in different ways|||Không hiển thị dữ liệu theo nhiều cách được", "It is a single point of failure|||Nó là một điểm lỗi duy nhất", "Layers cannot be replaced|||Không thay được tầng"], 0, "Slide 26: MVC can involve additional code and complexity when the data model and interactions are simple.|||Slide 26: MVC có thể thêm code và độ phức tạp khi mô hình dữ liệu và tương tác đơn giản."),
      q("In the JSP/Servlet/JDBC layered web architecture (slide 31), which layer is the only one that talks to the MySQL database?|||Trong kiến trúc web phân tầng JSP/Servlet/JDBC (slide 31), tầng nào là tầng duy nhất nói chuyện với MySQL?", ["Data Access Layer (JDBC)|||Data Access Layer (JDBC)", "Presentation Logic Layer (Servlet)|||Presentation Logic Layer (Servlet)", "User Interface (JSP)|||User Interface (JSP)", "Common Classes|||Common Classes"], 0, "Solid arrows go controller -> service -> data access -> database; the JSP never opens a JDBC connection.|||Mũi tên liền đi controller -> service -> data access -> database; JSP không bao giờ mở kết nối JDBC."),
      q("Which is a disadvantage of the client-server architecture (slide 33)?|||Đâu là nhược điểm của kiến trúc client-server (slide 33)?", ["Each service is a single point of failure and performance depends on the network|||Mỗi dịch vụ là một điểm lỗi duy nhất và hiệu năng phụ thuộc mạng", "Servers cannot be distributed across a network|||Không phân bố server trên mạng được", "Data cannot be shared by many locations|||Dữ liệu không dùng chung từ nhiều nơi được", "It needs no network at all|||Nó hoàn toàn không cần mạng"], 0, "Slide 33: single point of failure (DoS, server failure), unpredictable performance, management problems across organisations.|||Slide 33: điểm lỗi duy nhất (DoS, sập server), hiệu năng khó đoán, khó quản lý khi server thuộc nhiều tổ chức."),
      q("In a UML package diagram, a dashed arrow between packages means…|||Trong UML package diagram, mũi tên đứt giữa các package nghĩa là…", ["a dependency: one package uses elements of the other|||một dependency: package này dùng phần tử của package kia", "inheritance|||kế thừa", "composition|||composition", "a database foreign key|||một khoá ngoại CSDL"], 0, "Slide 35 notes: relationships between packages are dependency and generalisation/specialisation; the dashed arrows are dependencies.|||Ghi chú slide 35: quan hệ giữa package là dependency và generalization/specialization; mũi tên đứt là dependency."),
      q("How does a data abstraction class find its operations (slide 38)?|||Data abstraction class tìm ra operation của nó bằng cách nào (slide 38)?", ["By analysing which messages client objects send to it in the communication model|||Phân tích các message mà client object gửi tới nó trong mô hình communication", "By copying every SQL statement of the database|||Chép mọi câu SQL của CSDL", "From the GUI colours|||Từ màu sắc giao diện", "It has no operations, only attributes|||Nó không có operation, chỉ có attribute"], 0, "Attributes come from the static model; operations come from the needs of client objects shown in the communication model.|||Attribute lấy từ mô hình tĩnh; operation lấy từ nhu cầu của client object trong mô hình communication."),
      q("A graphical user interaction (GUI) class…|||Một graphical user interaction (GUI) class…", ["hides the details of the user interface from other classes|||giấu chi tiết giao diện người dùng khỏi các class khác", "stores data in the database|||lưu dữ liệu vào CSDL", "enforces the business rules|||áp dụng business rule", "schedules timer events|||lên lịch sự kiện thời gian"], 0, "Slide 40: a GUI class hides the interface to the user; one class per window, e.g. displayWithdrawalWindow(out accountNumber, out amount).|||Slide 40: GUI class giấu giao diện với người dùng; mỗi cửa sổ một class, ví dụ displayWithdrawalWindow(out accountNumber, out amount)."),
      q("Why put business rules in a separate business logic class (slide 41)?|||Vì sao đặt business rule trong một business logic class riêng (slide 41)?", ["So rules that change independently can be changed without touching data or UI classes|||Để luật thay đổi độc lập được sửa mà không đụng class dữ liệu hay giao diện", "Because entity classes cannot have methods|||Vì entity class không được có method", "To make the controller larger|||Để controller to hơn", "Because UML forbids rules in controllers|||Vì UML cấm luật trong controller"], 0, "The goal is to encapsulate business rules that could change independently into separate business logic classes, e.g. WithdrawalTransactionManager.|||Mục tiêu là đóng gói các business rule có thể đổi độc lập vào class riêng, ví dụ WithdrawalTransactionManager."),
      q("In the analysis model an arrow \"Card Request\" goes from Customer Interaction to ATMCard. In the design model this becomes…|||Trong mô hình phân tích có mũi tên \"Card Request\" từ Customer Interaction tới ATMCard. Trong mô hình thiết kế nó trở thành…", ["a read(out cardId, out startDate, out expirationDate) operation of ATMCard|||operation read(out cardId, out startDate, out expirationDate) của ATMCard", "an operation of Customer Interaction|||một operation của Customer Interaction", "a new database table|||một bảng CSDL mới", "an actor|||một actor"], 0, "Slide 43: a message becomes an operation of the receiving object; returned data become output parameters.|||Slide 43: message thành operation của object nhận; dữ liệu trả về thành tham số out."),
      q("In the class diagram notation, a filled diamond (Order ◆— OrderItem) denotes…|||Trong ký pháp class diagram, hình thoi đặc (Order ◆— OrderItem) biểu thị…", ["composition: the part cannot exist without the whole|||composition: bộ phận không tồn tại được khi không có toàn thể", "aggregation where parts live independently|||aggregation mà bộ phận sống độc lập", "generalisation|||generalization", "a dependency|||một dependency"], 0, "Slide 48: composition (filled) vs aggregation (hollow) vs generalisation (hollow triangle) vs association.|||Slide 48: composition (đặc) khác aggregation (rỗng), generalization (tam giác rỗng) và association."),
      q("An abstract class…|||Một lớp trừu tượng…", ["has no instances and serves as a template for subclasses; it may still implement some operations|||không có instance và là khuôn cho lớp con; vẫn có thể hiện thực một số operation", "must implement all its operations|||phải hiện thực mọi operation", "cannot have attributes|||không được có attribute", "is a class with only static members|||là class chỉ có thành viên tĩnh"], 0, "Slide 52: an abstract class has no instances; abstract operations are declared, not implemented; shared ones (open, close, readBalance) can be implemented.|||Slide 52: lớp trừu tượng không có instance; operation trừu tượng chỉ khai báo; operation dùng chung (open, close, readBalance) có thể hiện thực."),
      q("anAccount is declared of type Account; at run time it refers to a SavingsAccount, and anAccount.debit(amount) runs SavingsAccount.debit. This is…|||anAccount khai báo kiểu Account; lúc chạy nó trỏ tới SavingsAccount, và anAccount.debit(amount) chạy SavingsAccount.debit. Đây là…", ["polymorphism with dynamic binding|||đa hình với dynamic binding", "information hiding only|||chỉ là information hiding", "composition|||composition", "static binding at compile time|||static binding lúc biên dịch"], 0, "Slides 53-54: same operation name in several classes (polymorphism); the choice of implementation is made at run time (dynamic binding).|||Slide 53-54: cùng tên operation ở nhiều class (đa hình); việc chọn cách hiện thực diễn ra lúc chạy (dynamic binding)."),
      q("In Template2 (SDS), section 3 Detailed Design asks for what, for each feature?|||Trong Template2 (SDS), mục 3 Detailed Design yêu cầu gì cho mỗi tính năng?", ["A class diagram and sequence diagram(s); features with the same structure may refer to one set of diagrams|||Class diagram và sequence diagram; tính năng cùng cấu trúc có thể tham chiếu một bộ diagram", "Only the source code|||Chỉ source code", "A Gantt chart|||Một biểu đồ Gantt", "The test cases|||Các test case"], 0, "The template: provide class diagram and sequence diagram(s) per feature; for features with the same structure provide the diagrams once and refer to them.|||Template: mỗi tính năng có class diagram và sequence diagram; tính năng cùng cấu trúc thì vẽ một lần và tham chiếu."),
      q("What must a state transition diagram in SDS section 2 show besides the states?|||State transition diagram ở mục 2 của SDS phải thể hiện gì ngoài các trạng thái?", ["Events, actions on transitions, and entry/exit actions|||Sự kiện, hành động trên chuyển trạng thái, và entry/exit action", "Only the colours of each state|||Chỉ màu của mỗi trạng thái", "The database indexes|||Các index CSDL", "The names of team members|||Tên các thành viên"], 0, "Template2 section 2: beside the states provide suitable events, actions on the transitions, entry actions or exit actions (sample: PIN Validation).|||Template2 mục 2: ngoài trạng thái phải có sự kiện, hành động trên chuyển trạng thái, entry/exit action (mẫu: PIN Validation)."),
      q("In relational database design (Slide4), an entity class of the static model maps to…|||Trong thiết kế CSDL quan hệ (Slide4), một entity class của mô hình tĩnh ánh xạ sang…", ["one (or more) relations; attributes become columns and each object a row|||một (hoặc nhiều) quan hệ; attribute thành cột và mỗi object thành một dòng", "a stored procedure|||một stored procedure", "a view only|||chỉ một view", "a single column|||một cột duy nhất"], 0, "Slide4 page 5: entity class maps to one or more tables, attributes to columns, each object instance to a row.|||Slide4 trang 5: entity class thành một hoặc nhiều bảng, attribute thành cột, mỗi object instance thành một dòng."),
      q("How is a one-to-many association (Customer owns many Accounts) mapped?|||Quan hệ một-nhiều (Customer sở hữu nhiều Account) được ánh xạ thế nào?", ["The primary key of the one side becomes a foreign key in the many side: Account(Account Number, Balance, Customer Id)|||Khoá chính của phía một thành khoá ngoại ở phía nhiều: Account(Account Number, Balance, Customer Id)", "Account Number is added to Customer|||Thêm Account Number vào Customer", "A new associative table is always required|||Luôn phải có bảng kết hợp mới", "Both tables are merged|||Gộp hai bảng làm một"], 0, "Slide4 pages 11-12: foreign key in the many relation.|||Slide4 trang 11-12: khoá ngoại nằm ở quan hệ phía nhiều."),
      q("For a zero-or-one association (Customer owns a Debit Card), the foreign key is placed…|||Với quan hệ không-hoặc-một (Customer sở hữu Debit Card), khoá ngoại đặt ở…", ["in the optional relation: Debit Card(Card Id, …, Customer Id)|||quan hệ tuỳ chọn: Debit Card(Card Id, …, Customer Id)", "in Customer|||Customer", "in a third table always|||luôn ở bảng thứ ba", "nowhere; it is not stored|||không đâu cả; không lưu"], 0, "Slide4 pages 9-10: zero-or-one maps to a foreign key in the optional relation.|||Slide4 trang 9-10: không-hoặc-một thành khoá ngoại ở quan hệ tuỳ chọn."),
      q("A many-to-many association with an association class Hours between Project and Employee becomes…|||Quan hệ nhiều-nhiều có association class Hours giữa Project và Employee trở thành…", ["an associative relation Hours(Project id, Employee id, Hours worked) with a concatenated primary key that is also foreign keys|||quan hệ kết hợp Hours(Project id, Employee id, Hours worked) có khoá chính ghép đồng thời là khoá ngoại", "a Hours column in Project|||một cột Hours trong Project", "two unrelated tables|||hai bảng không liên quan", "a JSON field|||một trường JSON"], 0, "Slide4 pages 13-15: association class -> associative relation; concatenated key from each participating relation.|||Slide4 trang 13-15: association class -> quan hệ kết hợp; khoá ghép từ khoá của mỗi quan hệ tham gia."),
      q("In the aggregation example, Department IS PART OF College (1-n). What is the Department relation?|||Trong ví dụ aggregation, Department IS PART OF College (1-n). Quan hệ Department là gì?", ["Department(Department name, College name, Location) — the college key is part of the key or a foreign key|||Department(Department name, College name, Location) — khoá của college là một phần khoá hoặc khoá ngoại", "Department(Location) only|||chỉ Department(Location)", "College(Department name)|||College(Department name)", "It is not stored|||Không được lưu"], 0, "Slide4 pages 16-17: the key of the aggregate relation becomes part of the component's key (1-n) or a foreign key if not needed for identification.|||Slide4 trang 16-17: khoá của quan hệ toàn thể thành một phần khoá của bộ phận (1-n) hoặc khoá ngoại nếu không cần để định danh."),
      q("Which is NOT one of the three mappings of a generalisation/specialisation hierarchy in Slide4?|||Đâu KHÔNG phải một trong ba cách ánh xạ phân cấp generalization/specialization trong Slide4?", ["Store each subclass as an XML file|||Lưu mỗi lớp con thành một file XML", "Superclass and subclasses mapped to relations|||Lớp cha và lớp con đều thành quan hệ", "Subclasses only mapped to relations|||Chỉ lớp con thành quan hệ", "Superclass only mapped to a relation|||Chỉ lớp cha thành quan hệ"], 0, "Slide4 page 18 lists exactly: superclass & subclasses, subclasses only, superclass only.|||Slide4 trang 18 liệt kê đúng: lớp cha & lớp con, chỉ lớp con, chỉ lớp cha."),
      q("When mapping superclass and subclasses to separate tables (Account / Checking Account / Savings Account), what is shared?|||Khi ánh xạ lớp cha và lớp con thành các bảng riêng (Account / Checking Account / Savings Account), thứ gì dùng chung?", ["The same primary key (Account Number), with a discriminator (Account Type) in the superclass table|||Cùng khoá chính (Account Number), kèm discriminator (Account Type) ở bảng lớp cha", "Nothing is shared|||Không có gì dùng chung", "Only the Balance column|||Chỉ cột Balance", "A shared JSP page|||Một trang JSP chung"], 0, "Slide4 pages 19-20: shared id as primary key, discriminator in the superclass table; clean and extensible, but navigation may be slow.|||Slide4 trang 19-20: dùng chung id làm khoá chính, discriminator ở bảng lớp cha; sạch và dễ mở rộng nhưng điều hướng có thể chậm."),
      q("According to Slide4, what are the main inputs of relational database design?|||Theo Slide4, đầu vào chính của thiết kế CSDL quan hệ là gì?", ["UC specifications, ERD, entity class diagrams & attributes, GUI/screen layout design|||UC spec, ERD, entity class diagram & attribute, thiết kế giao diện/màn hình", "Only the source code|||Chỉ source code", "The test report|||Báo cáo test", "The Gantt chart|||Biểu đồ Gantt"], 0, "Slide4 page 4 lists these four inputs.|||Slide4 trang 4 liệt kê bốn đầu vào này."),
// @QZ
    ],
  },
};

export default {
  title: 'Chapter 3 — System & database design|||Chương 3 — Thiết kế hệ thống & cơ sở dữ liệu',
  description: 'Thiết kế hệ thống theo phương pháp COMET (Slide3) và thiết kế CSDL (Slide4), viết tài liệu SDS — làm lại cho các màn hình của mỗi thành viên trong từng iteration.',
  lessons: [L31, L32, L33, L34, L35, ...db.lessons, QUIZ],
};
