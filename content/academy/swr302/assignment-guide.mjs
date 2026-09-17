/**
 * SWR302 · Assignment how-to — one lesson per group of deliverables, each mapped
 * to the exact Wiegers template the lecturer distributes (Document_GuideLines/).
 * A.6 = deliverables 1-2, A.7 = deliverables 3-5, A.8 = deliverables 6-8.
 */
import { bi } from './_slides.mjs';

/* ─────────── A.6 — Vision & Scope + Use Cases ─────────── */
const A6 = {
  title: 'A.6 — Building deliverables 1–2: Vision & Scope, Use Cases|||A.6 — Làm deliverable 1–2: Vision & Scope, Use Case',
  slug: 'swr302-assignment-huong-dan-1-2',
  type: 'DOCUMENT',
  description: 'Đi từng mục của Vision and Scope Template (Ch.5) và Use Case Template (Ch.8): viết gì vào đâu, thế nào là đạt, thế nào là trượt, và cách nối use case ngược về feature.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.6 · Deliverables 1–2</span>
<h2>Deliverable 1 — Product Vision &amp; Scope</h2>
<p class="lead">Template: <strong>Chapter 5 / Vision and Scope Template.docx</strong>. Worked example to imitate: <strong>Appendix C / COS Vision and Scope.docx</strong>. This document is the <em>constitution</em> of your project — every later deliverable is judged against it, so a vague one poisons all seven that follow.</p>

<h3>The template, section by section</h3>
<table>
  <thead><tr><th>Section</th><th>What goes in</th><th>Passes</th><th>Fails</th></tr></thead>
  <tbody>
    <tr><td><strong>1.1 Background</strong></td><td>How the organisation got here</td><td>A short history that explains <em>why now</em></td><td>Re-typing the brief word for word</td></tr>
    <tr><td><strong>1.2 Business Opportunity</strong></td><td>The problem, quantified</td><td>Each pain named, with a number and a consequence</td><td>"The current system is slow and inefficient"</td></tr>
    <tr><td><strong>1.3 Business Objectives</strong></td><td>What the business gains</td><td>Baseline → target → deadline, one row each</td><td>"Improve efficiency" — no number, no date</td></tr>
    <tr><td><strong>1.4 Success Metrics</strong></td><td>How you will <em>know</em></td><td>The formula, the data source, the reporting frequency</td><td>Repeating the objectives in different words</td></tr>
    <tr><td><strong>1.5 Vision Statement</strong></td><td>One paragraph, Moore's keyword template</td><td>For/who/the/that/unlike/our-product, filled in</td><td>A marketing slogan</td></tr>
    <tr><td><strong>1.6 Business Risks</strong></td><td>What could sink the project</td><td>Risk + severity + probability + mitigation</td><td>Technical risks only ("the server may fail")</td></tr>
    <tr><td><strong>1.7 Assumptions &amp; Dependencies</strong></td><td>What you assumed; who you depend on</td><td>Every invented number lives here, labelled A1, A2…</td><td>Left empty — then your baselines look fabricated</td></tr>
    <tr><td><strong>2.1 Major Features</strong></td><td>Numbered FE-1…FE-n</td><td>8–15 features, each traceable to a pain</td><td>A feature list copied from a commercial product</td></tr>
    <tr><td><strong>2.2 / 2.3 Release scope</strong></td><td>What ships when</td><td>Release 1.0 covers the top objectives only</td><td>Everything in release 1.0</td></tr>
    <tr><td><strong>2.4 Limitations &amp; Exclusions</strong></td><td>What you will <em>not</em> build</td><td>EX-1…EX-n, each a thing a reader would otherwise expect</td><td>Omitted — the section graders read first</td></tr>
    <tr><td><strong>3.1 Stakeholder Profiles</strong></td><td>The 5-column table from the template</td><td>Value / attitude / interests / <strong>constraints</strong> per stakeholder</td><td>A list of job titles</td></tr>
    <tr><td><strong>3.2 Project Priorities</strong></td><td>Driver / constraint / degree of freedom</td><td>Each of the five dimensions classified as exactly one</td><td>Everything marked "driver"</td></tr>
    <tr><td><strong>3.3 Deployment Considerations</strong></td><td>Rollout, migration, training, back-out</td><td>A phased plan with a way to retreat</td><td>"Deploy to the cloud"</td></tr>
  </tbody>
</table>

<div class="callout ok"><strong>The trick that separates a 9 from a 6.</strong> In §3.2, a dimension can be a <em>driver</em>, a <em>constraint</em> or a <em>degree of freedom</em> — and at most one or two can be drivers. Being forced to say "quality is the driver, therefore schedule is a degree of freedom" is the whole point of the table. Marking all five as drivers proves you have not made a trade-off, which is precisely what the lecturer is testing.</div>

<h2>Deliverable 2 — Use case diagram &amp; specifications (≥ 10)</h2>
<p class="lead">Template: <strong>Chapter 8 / Use Case Template.docx</strong> — it contains a <em>Use Case List</em> table and a 15-row <em>Use Case Template</em> table. Use both: the list first, the detailed spec for each.</p>

<h3>The 15 rows, and what actually earns marks</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Name</div><div class="lz-d">Verb + object, from the <em>user's</em> point of view. "Register for a course section", not "Registration module".</div></div>
  <div class="lz-step"><div class="lz-k">Trigger</div><div class="lz-d">The event that starts it. Business event, system event or user action — say which.</div></div>
  <div class="lz-step"><div class="lz-k">Pre / Postconditions</div><div class="lz-d">Numbered PRE-1…, POST-1…, and each must be <strong>testable by the system</strong>. "User is logged in" is testable; "user knows what they want" is not.</div></div>
  <div class="lz-step"><div class="lz-k">Normal flow</div><div class="lz-d">Numbered <strong>X.0</strong>, alternating actor action ↔ system response. Never describe a screen; describe the dialogue.</div></div>
  <div class="lz-step"><div class="lz-k">Alternative flows</div><div class="lz-d">Numbered <strong>X.Y</strong> — still <em>successful</em> outcomes by another path. Say where they branch and where they rejoin.</div></div>
  <div class="lz-step"><div class="lz-k">Exceptions</div><div class="lz-d">Numbered <strong>X.Y.EZ</strong> — things that go <em>wrong</em>. This is where weak groups lose the most marks: they write only the happy path.</div></div>
  <div class="lz-step"><div class="lz-k">Business Rules</div><div class="lz-d">IDs only — BR-3, BR-12. Never paste the rule text; that duplication is exactly what Ch.9 warns against.</div></div>
  <div class="lz-step"><div class="lz-k">Frequency of use</div><div class="lz-d">A number per unit time. It is your first capacity estimate and it feeds your performance quality attributes.</div></div>
</div>

<div class="callout warn"><strong>Alternative flow vs exception — the distinction the exam loves.</strong> An <strong>alternative flow</strong> still reaches the goal (pay by a different method). An <strong>exception</strong> does not (the payment is declined). If your document has ten alternative flows and no exceptions, you have mislabelled them.</div>

<h3>The diagram</h3>
<p>One diagram per system, drawn in draw.io or Visual Paradigm. Rules that cost marks when broken:</p>
<ul>
  <li>Actors go <strong>outside</strong> the system boundary box; use cases <strong>inside</strong>. Draw the box — a diagram with no boundary says you never decided the scope.</li>
  <li>Secondary actors (other systems) go on the <strong>right</strong>, primary actors on the left. It is a convention, and graders read left to right.</li>
  <li>Use <code>&lt;&lt;include&gt;&gt;</code> for a step that <em>always</em> happens, <code>&lt;&lt;extend&gt;&gt;</code> for one that <em>sometimes</em> does. Most groups get the arrow direction wrong: <code>&lt;&lt;include&gt;&gt;</code> points <strong>from</strong> the base use case <strong>to</strong> the included one; <code>&lt;&lt;extend&gt;&gt;</code> points the other way.</li>
  <li>Do not decompose into tiny CRUD use cases. "Create student", "Update student", "Delete student" are steps, not use cases.</li>
</ul>
<div class="note-ct">Export the diagram as PNG <em>and</em> keep the editable <code>.drawio</code> file. At the Week-9 presentation the lecturer often asks a group to change the diagram live; a team with only a flattened image cannot.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.6 · Deliverable 1–2</span>
<h2>Deliverable 1 — Product Vision &amp; Scope</h2>
<p class="lead">Template: <strong>Chapter 5 / Vision and Scope Template.docx</strong>. Bản mẫu để bắt chước: <strong>Appendix C / COS Vision and Scope.docx</strong>. Tài liệu này là <em>hiến pháp</em> của dự án — bảy deliverable sau đều bị chấm dựa trên nó, nên viết mơ hồ ở đây là đầu độc cả bảy cái sau.</p>

<h3>Đi từng mục của template</h3>
<table>
  <thead><tr><th>Mục</th><th>Viết gì</th><th>Đạt</th><th>Trượt</th></tr></thead>
  <tbody>
    <tr><td><strong>1.1 Background</strong></td><td>Tổ chức đã đi tới tình cảnh này ra sao</td><td>Lịch sử ngắn giải thích <em>vì sao là lúc này</em></td><td>Chép lại nguyên đề bài</td></tr>
    <tr><td><strong>1.2 Business Opportunity</strong></td><td>Vấn đề, có định lượng</td><td>Gọi tên từng nỗi đau kèm con số và hệ quả</td><td>"Hệ thống hiện tại chậm và kém hiệu quả"</td></tr>
    <tr><td><strong>1.3 Business Objectives</strong></td><td>Doanh nghiệp được gì</td><td>Baseline → mục tiêu → hạn chót, mỗi dòng một cái</td><td>"Nâng cao hiệu quả" — không số, không hạn</td></tr>
    <tr><td><strong>1.4 Success Metrics</strong></td><td>Làm sao <em>biết</em> đã đạt</td><td>Công thức tính, nguồn dữ liệu, tần suất báo cáo</td><td>Nhắc lại mục tiêu bằng từ khác</td></tr>
    <tr><td><strong>1.5 Vision Statement</strong></td><td>Một đoạn, theo mẫu từ khoá của Moore</td><td>For/who/the/that/unlike/our-product, điền đủ</td><td>Một khẩu hiệu quảng cáo</td></tr>
    <tr><td><strong>1.6 Business Risks</strong></td><td>Cái gì có thể làm chìm dự án</td><td>Rủi ro + mức độ + xác suất + cách giảm thiểu</td><td>Chỉ rủi ro kỹ thuật ("máy chủ có thể hỏng")</td></tr>
    <tr><td><strong>1.7 Assumptions &amp; Dependencies</strong></td><td>Bạn giả định gì; phụ thuộc ai</td><td>Mọi con số bạn tự đặt nằm ở đây, đánh nhãn A1, A2…</td><td>Bỏ trống — khi đó baseline của bạn trông như bịa</td></tr>
    <tr><td><strong>2.1 Major Features</strong></td><td>Đánh số FE-1…FE-n</td><td>8–15 tính năng, mỗi cái truy được về một nỗi đau</td><td>Danh sách tính năng chép từ một sản phẩm thương mại</td></tr>
    <tr><td><strong>2.2 / 2.3 Phạm vi bản phát hành</strong></td><td>Cái gì ra lúc nào</td><td>Bản 1.0 chỉ phủ các mục tiêu quan trọng nhất</td><td>Nhét tất cả vào bản 1.0</td></tr>
    <tr><td><strong>2.4 Limitations &amp; Exclusions</strong></td><td>Cái bạn sẽ <em>không</em> làm</td><td>EX-1…EX-n, mỗi cái là thứ người đọc dễ tưởng có</td><td>Bỏ qua — đúng mục người chấm đọc đầu tiên</td></tr>
    <tr><td><strong>3.1 Stakeholder Profiles</strong></td><td>Bảng 5 cột trong template</td><td>Giá trị / thái độ / mối quan tâm / <strong>ràng buộc</strong> từng bên</td><td>Một danh sách chức danh</td></tr>
    <tr><td><strong>3.2 Project Priorities</strong></td><td>Driver / constraint / degree of freedom</td><td>Mỗi chiều trong năm chiều được xếp đúng một loại</td><td>Đánh tất cả là "driver"</td></tr>
    <tr><td><strong>3.3 Deployment Considerations</strong></td><td>Triển khai, di trú, đào tạo, đường lùi</td><td>Kế hoạch theo giai đoạn có đường rút lui</td><td>"Triển khai lên cloud"</td></tr>
  </tbody>
</table>

<div class="callout ok"><strong>Mẹo tách 9 khỏi 6.</strong> Ở §3.2, mỗi chiều có thể là <em>driver</em>, <em>constraint</em> hoặc <em>degree of freedom</em> — và nhiều nhất chỉ một hoặc hai cái được làm driver. Bị buộc phải nói "chất lượng là driver, vậy nên lịch là degree of freedom" chính là toàn bộ ý nghĩa của bảng này. Đánh cả năm là driver chứng minh bạn chưa hề đánh đổi, mà đánh đổi mới là thứ thầy đang kiểm tra.</div>

<h2>Deliverable 2 — Use case diagram &amp; đặc tả (≥ 10)</h2>
<p class="lead">Template: <strong>Chapter 8 / Use Case Template.docx</strong> — trong đó có bảng <em>Use Case List</em> và bảng <em>Use Case Template</em> 15 dòng. Dùng cả hai: danh sách trước, rồi đặc tả chi tiết từng cái.</p>

<h3>15 dòng, và dòng nào thực sự ăn điểm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tên</div><div class="lz-d">Động từ + tân ngữ, theo góc nhìn <em>người dùng</em>. "Đăng ký một lớp học phần", không phải "Module đăng ký".</div></div>
  <div class="lz-step"><div class="lz-k">Trigger</div><div class="lz-d">Sự kiện khởi động. Sự kiện nghiệp vụ, sự kiện hệ thống hay hành động người dùng — nói rõ loại nào.</div></div>
  <div class="lz-step"><div class="lz-k">Pre/Postcondition</div><div class="lz-d">Đánh số PRE-1…, POST-1…, và mỗi cái phải <strong>hệ thống kiểm được</strong>. "Người dùng đã đăng nhập" thì kiểm được; "người dùng biết mình muốn gì" thì không.</div></div>
  <div class="lz-step"><div class="lz-k">Luồng chính</div><div class="lz-d">Đánh số <strong>X.0</strong>, xen kẽ hành động actor ↔ phản hồi hệ thống. Đừng mô tả màn hình; hãy mô tả cuộc đối thoại.</div></div>
  <div class="lz-step"><div class="lz-k">Luồng thay thế</div><div class="lz-d">Đánh số <strong>X.Y</strong> — vẫn là kết cục <em>thành công</em> theo đường khác. Nói rõ rẽ ở đâu và nhập lại ở đâu.</div></div>
  <div class="lz-step"><div class="lz-k">Ngoại lệ</div><div class="lz-d">Đánh số <strong>X.Y.EZ</strong> — những thứ <em>hỏng</em>. Đây là chỗ nhóm yếu mất điểm nhiều nhất: chỉ viết luồng thuận.</div></div>
  <div class="lz-step"><div class="lz-k">Business Rules</div><div class="lz-d">Chỉ ghi ID — BR-3, BR-12. Đừng dán nội dung rule vào; sự trùng lặp đó chính là điều chương 9 cảnh báo.</div></div>
  <div class="lz-step"><div class="lz-k">Tần suất dùng</div><div class="lz-d">Một con số trên đơn vị thời gian. Đó là ước lượng công suất đầu tiên và nó nuôi các thuộc tính chất lượng về hiệu năng.</div></div>
</div>

<div class="callout warn"><strong>Luồng thay thế vs ngoại lệ — phân biệt mà đề thi rất thích.</strong> <strong>Luồng thay thế</strong> vẫn đạt mục tiêu (trả bằng phương thức khác). <strong>Ngoại lệ</strong> thì không (thanh toán bị từ chối). Nếu tài liệu của bạn có mười luồng thay thế và không có ngoại lệ nào, bạn đã gắn nhãn sai.</div>

<h3>Về bản vẽ</h3>
<p>Một sơ đồ cho một hệ thống, vẽ bằng draw.io hoặc Visual Paradigm. Những luật vi phạm là mất điểm:</p>
<ul>
  <li>Actor nằm <strong>ngoài</strong> khung ranh giới hệ thống; use case nằm <strong>trong</strong>. Phải vẽ cái khung — sơ đồ không có ranh giới nghĩa là bạn chưa từng quyết định phạm vi.</li>
  <li>Actor phụ (hệ thống khác) đặt bên <strong>phải</strong>, actor chính bên trái. Đó là quy ước, và người chấm đọc từ trái sang.</li>
  <li>Dùng <code>&lt;&lt;include&gt;&gt;</code> cho bước <em>luôn luôn</em> xảy ra, <code>&lt;&lt;extend&gt;&gt;</code> cho bước <em>thỉnh thoảng</em> xảy ra. Phần lớn nhóm vẽ sai chiều mũi tên: <code>&lt;&lt;include&gt;&gt;</code> chỉ <strong>từ</strong> use case gốc <strong>tới</strong> cái được include; <code>&lt;&lt;extend&gt;&gt;</code> chỉ ngược lại.</li>
  <li>Đừng băm nhỏ thành use case CRUD. "Tạo sinh viên", "Sửa sinh viên", "Xoá sinh viên" là các bước, không phải use case.</li>
</ul>
<div class="note-ct">Xuất sơ đồ ra PNG <em>và</em> giữ lại file <code>.drawio</code> sửa được. Ở buổi thuyết trình tuần 9 thầy hay yêu cầu nhóm sửa sơ đồ ngay tại chỗ; nhóm chỉ có ảnh dẹt thì chịu.</div>
`,
    ),
  ].join('\n'),
};

/* ─────────── A.7 — Business Rules + SRS + Data Dictionary ─────────── */
const A7 = {
  title: 'A.7 — Building deliverables 3–5: Business Rules, SRS, Data Dictionary|||A.7 — Làm deliverable 3–5: Business Rules, SRS, Data Dictionary',
  slug: 'swr302-assignment-huong-dan-3-5',
  type: 'DOCUMENT',
  description: 'Bảng 5 cột business rule theo mẫu COS, toàn bộ mục lục SRS của template Ch.10 với hướng dẫn viết từng mục, và ký pháp data dictionary của Ch.13 (+, (), {}, min:max).',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.7 · Deliverables 3–5</span>
<h2>Deliverable 3 — Business Rule document</h2>
<p class="lead">Model to copy: <strong>Appendix C / COS Business Rules.docx</strong>. It is a single five-column table, and that simplicity is deceptive — the marks are in the <em>Type</em> column.</p>
<table>
  <thead><tr><th>ID</th><th>Rule Definition</th><th>Type of Rule</th><th>Static or Dynamic</th><th>Source</th></tr></thead>
  <tbody><tr><td>BR-1</td><td>Delivery time windows are 15 minutes, beginning on each quarter hour.</td><td>Fact</td><td>Dynamic</td><td>Cafeteria Manager</td></tr></tbody>
</table>
<h3>The five types — you must produce at least one of each</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">1</div><div><div class="lz-lt">Fact</div><div class="lz-ld">A true statement about the business. <em>"An order line is fulfilled from exactly one fulfillment center."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">2</div><div><div class="lz-lt">Constraint</div><div class="lz-ld">Something that must or must not happen. <em>"Stock may be reserved only when ATP ≥ the requested quantity."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">3</div><div><div class="lz-lt">Action enabler</div><div class="lz-ld">A condition that <strong>triggers</strong> an action. <em>"If payment is not authorized within 30 minutes, release the reservation."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">4</div><div><div class="lz-lt">Inference</div><div class="lz-ld">New knowledge derived from facts. <em>"An order is 'at risk' when the promised date minus today is less than carrier transit time."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">5</div><div><div class="lz-lt">Computation</div><div class="lz-ld">A formula. <em>"ATP = on-hand − reserved − damaged − safety stock."</em></div></div></div>
</div>
<div class="callout warn"><strong>Static or Dynamic</strong> asks whether the rule itself changes over time. A tax rate is <em>dynamic</em> (it will be revised). "An order must have at least one line" is <em>static</em>. Dynamic rules should be configurable in the system, not compiled into it — say so, and you have just earned a design-relevant insight without designing anything.</div>
<div class="pitfall"><strong>Rule ≠ requirement.</strong> A rule is an <em>external</em> policy that exists whether or not your software does. A functional requirement is the system behaviour that enforces it. Write the rule once in this document, then <strong>reference its ID</strong> from the use case and the SRS. Copying the text into three documents guarantees they will disagree by Week 8.</div>

<h2>Deliverable 4 — Software Requirements Specification</h2>
<p class="lead">Template: <strong>Chapter 10 / Software Requirements Specification Template.docx</strong>. The brief says "with all the sections given in the provided template" — that is not a suggestion. Keep every heading, and write "None." under any that genuinely does not apply rather than deleting it.</p>
<table>
  <thead><tr><th>§</th><th>Section</th><th>The one thing that matters here</th></tr></thead>
  <tbody>
    <tr><td>1.1–1.4</td><td>Purpose · Conventions · Project Scope · References</td><td>In <em>Conventions</em>, declare your requirement ID format — you will use it 200 times</td></tr>
    <tr><td>2.1</td><td>Product Perspective</td><td>Put the <strong>context diagram</strong> here. It is the picture of your system boundary</td></tr>
    <tr><td>2.2</td><td>User Classes and Characteristics</td><td>Mark the <strong>favored</strong> user classes — the ones whose needs win a conflict</td></tr>
    <tr><td>2.3–2.5</td><td>Operating Environment · Constraints · Assumptions</td><td>Constraints limit the <em>developers</em>; assumptions could make the SRS wrong</td></tr>
    <tr><td>3.x</td><td><strong>System Features</strong></td><td>One 3.x per feature. Each has a description + priority, then numbered functional requirements. Every requirement uses <strong>shall</strong>, is testable, and traces to a UC or FE</td></tr>
    <tr><td>4.1–4.4</td><td>Data Requirements</td><td>Logical data model (ERD), pointer to the data dictionary, report specs, retention rules</td></tr>
    <tr><td>5.1–5.4</td><td>External Interfaces</td><td>User · Software · Hardware · Communications. The 3PL and marketplace APIs live in 5.2</td></tr>
    <tr><td>6.1–6.5</td><td><strong>Quality Attributes</strong></td><td>Usability · Performance · Security · Safety · others. Every one needs a <strong>number</strong> — use Planguage (scale, meter, must, plan)</td></tr>
    <tr><td>7</td><td>Internationalization &amp; Localization</td><td>Currency, date format, language. "None required" is a valid answer if you justify it</td></tr>
    <tr><td>8</td><td>Other Requirements</td><td>Legal, regulatory, installation, licensing</td></tr>
    <tr><td>App. A/B</td><td>Glossary · Analysis Models</td><td>Put the use case diagram, state diagrams and swimlanes here</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>How to write a functional requirement that cannot lose marks.</strong> Format: <code>&lt;Feature&gt;-&lt;n&gt;: The system shall &lt;observable behaviour&gt; &lt;under what condition&gt;.</code> — one actor, one behaviour, no "and/or", no "user-friendly", no "etc.". If a tester cannot write a pass/fail test from the sentence, rewrite it.</div>

<h2>Deliverable 5 — Data Dictionary</h2>
<p class="lead">Guidance: <strong>Chapter 13 / Guidance for Data Dictionaries.docx</strong>. Five columns — <em>Data Element · Description · Composition or Data Type · Length · Values</em> — and a notation you must use exactly.</p>
<table>
  <thead><tr><th>Notation</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>+</code></td><td>composed of / and</td><td>Requester = Name + Employee ID + Delivery Location</td></tr>
    <tr><td><code>( )</code></td><td>optional element</td><td>Requested Chemical = Chemical ID + Quantity + (Vendor)</td></tr>
    <tr><td><code>{ }</code></td><td>repeating group</td><td>Order = Order ID + 1:10{Order Line}</td></tr>
    <tr><td><code>min:max</code></td><td>allowed repeats; <code>n</code> = unlimited</td><td>1:n{Tracking Event}</td></tr>
    <tr><td><code>[ a | b ]</code></td><td>either–or</td><td>Payment = [ Card | Bank transfer | COD ]</td></tr>
    <tr><td>quotes</td><td>literal text</td><td>Phone = "+84" + Subscriber Number</td></tr>
  </tbody>
</table>
<ul>
  <li>Entries are ordered <strong>alphabetically</strong>, not by importance.</li>
  <li>For a <strong>structure</strong>, leave <em>Length</em> and <em>Values</em> blank — they only apply to primitives.</li>
  <li>Every element named inside a structure must have <strong>its own entry</strong>. This is the rule graders check by picking one structure at random.</li>
  <li>The <em>Values</em> column carries allowed values, default and validation rules — cross-reference the business rule that governs them (<code>see BR-12</code>).</li>
</ul>
<div class="note-ct">Build the data dictionary <strong>while</strong> writing use cases, not after. Every noun that appears in a use case flow ("promised delivery date", "override reason") is a candidate entry, and harvesting them later means re-reading everything.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.7 · Deliverable 3–5</span>
<h2>Deliverable 3 — Tài liệu Business Rule</h2>
<p class="lead">Mẫu để chép: <strong>Appendix C / COS Business Rules.docx</strong>. Chỉ một bảng năm cột, và sự đơn giản đó đánh lừa — điểm nằm ở cột <em>Type</em>.</p>
<table>
  <thead><tr><th>ID</th><th>Nội dung rule</th><th>Loại rule</th><th>Tĩnh hay Động</th><th>Nguồn</th></tr></thead>
  <tbody><tr><td>BR-1</td><td>Khung giờ giao hàng dài 15 phút, bắt đầu vào mỗi mốc 15 phút.</td><td>Fact</td><td>Dynamic</td><td>Quản lý căng-tin</td></tr></tbody>
</table>
<h3>Năm loại — bạn phải có ít nhất một cái mỗi loại</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">1</div><div><div class="lz-lt">Fact (sự kiện)</div><div class="lz-ld">Một phát biểu đúng về nghiệp vụ. <em>"Một dòng đơn hàng được hoàn tất từ đúng một trung tâm."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">2</div><div><div class="lz-lt">Constraint (ràng buộc)</div><div class="lz-ld">Điều phải hoặc không được xảy ra. <em>"Chỉ được giữ chỗ tồn kho khi ATP ≥ số lượng yêu cầu."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">3</div><div><div class="lz-lt">Action enabler (kích hoạt)</div><div class="lz-ld">Điều kiện <strong>kích hoạt</strong> một hành động. <em>"Nếu thanh toán không được duyệt trong 30 phút, nhả chỗ đã giữ."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">4</div><div><div class="lz-lt">Inference (suy luận)</div><div class="lz-ld">Tri thức mới suy ra từ sự kiện. <em>"Đơn ở trạng thái 'rủi ro' khi ngày hứa giao trừ hôm nay nhỏ hơn thời gian vận chuyển."</em></div></div></div>
  <div class="lz-layer"><div class="lz-badge">5</div><div><div class="lz-lt">Computation (tính toán)</div><div class="lz-ld">Một công thức. <em>"ATP = tồn thực − đã giữ chỗ − hỏng − tồn an toàn."</em></div></div></div>
</div>
<div class="callout warn"><strong>Tĩnh hay Động</strong> hỏi bản thân rule có thay đổi theo thời gian không. Thuế suất là <em>động</em> (sẽ được sửa). "Một đơn phải có ít nhất một dòng" là <em>tĩnh</em>. Rule động nên cấu hình được trong hệ thống chứ không nhúng cứng vào mã — nói được điều đó là bạn vừa nêu một nhận định có giá trị thiết kế mà không hề đi thiết kế.</div>
<div class="pitfall"><strong>Rule ≠ requirement.</strong> Rule là chính sách <em>bên ngoài</em>, tồn tại bất kể phần mềm của bạn có hay không. Functional requirement là hành vi hệ thống thực thi rule đó. Viết rule một lần trong tài liệu này, rồi <strong>tham chiếu ID</strong> từ use case và SRS. Chép nội dung vào ba tài liệu là bảo đảm tới tuần 8 chúng sẽ mâu thuẫn nhau.</div>

<h2>Deliverable 4 — Software Requirements Specification</h2>
<p class="lead">Template: <strong>Chapter 10 / Software Requirements Specification Template.docx</strong>. Đề ghi "with all the sections given in the provided template" — đó không phải gợi ý. Giữ đủ mọi tiêu đề, mục nào thật sự không áp dụng thì ghi "None." chứ đừng xoá.</p>
<table>
  <thead><tr><th>§</th><th>Mục</th><th>Điều duy nhất quan trọng ở đây</th></tr></thead>
  <tbody>
    <tr><td>1.1–1.4</td><td>Purpose · Conventions · Project Scope · References</td><td>Trong <em>Conventions</em>, khai báo định dạng ID yêu cầu — bạn sẽ dùng nó 200 lần</td></tr>
    <tr><td>2.1</td><td>Product Perspective</td><td>Đặt <strong>context diagram</strong> ở đây. Nó là bức ảnh ranh giới hệ thống của bạn</td></tr>
    <tr><td>2.2</td><td>User Classes and Characteristics</td><td>Đánh dấu lớp người dùng <strong>được ưu tiên</strong> — lớp thắng khi có xung đột</td></tr>
    <tr><td>2.3–2.5</td><td>Operating Environment · Constraints · Assumptions</td><td>Constraint giới hạn <em>lập trình viên</em>; assumption là thứ sai thì SRS sai theo</td></tr>
    <tr><td>3.x</td><td><strong>System Features</strong></td><td>Mỗi tính năng một mục 3.x. Mỗi mục có mô tả + độ ưu tiên, rồi các functional requirement đánh số. Mọi yêu cầu dùng <strong>shall</strong>, kiểm thử được, và truy về một UC hoặc FE</td></tr>
    <tr><td>4.1–4.4</td><td>Data Requirements</td><td>Mô hình dữ liệu logic (ERD), trỏ sang data dictionary, đặc tả báo cáo, luật lưu trữ</td></tr>
    <tr><td>5.1–5.4</td><td>External Interfaces</td><td>User · Software · Hardware · Communications. API của 3PL và sàn TMĐT nằm ở 5.2</td></tr>
    <tr><td>6.1–6.5</td><td><strong>Quality Attributes</strong></td><td>Usability · Performance · Security · Safety · khác. Mỗi cái cần một <strong>con số</strong> — dùng Planguage (scale, meter, must, plan)</td></tr>
    <tr><td>7</td><td>Internationalization &amp; Localization</td><td>Tiền tệ, định dạng ngày, ngôn ngữ. "Không yêu cầu" là câu trả lời hợp lệ nếu có lý do</td></tr>
    <tr><td>8</td><td>Other Requirements</td><td>Pháp lý, quy định, cài đặt, bản quyền</td></tr>
    <tr><td>PL A/B</td><td>Glossary · Analysis Models</td><td>Đặt use case diagram, state diagram và swimlane ở đây</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Cách viết một functional requirement không thể mất điểm.</strong> Khuôn: <code>&lt;Tính năng&gt;-&lt;n&gt;: The system shall &lt;hành vi quan sát được&gt; &lt;trong điều kiện nào&gt;.</code> — một actor, một hành vi, không "và/hoặc", không "thân thiện người dùng", không "v.v.". Nếu tester không viết nổi một ca kiểm thử đạt/trượt từ câu đó, hãy viết lại.</div>

<h2>Deliverable 5 — Data Dictionary</h2>
<p class="lead">Hướng dẫn: <strong>Chapter 13 / Guidance for Data Dictionaries.docx</strong>. Năm cột — <em>Data Element · Description · Composition or Data Type · Length · Values</em> — và một ký pháp bạn phải dùng đúng.</p>
<table>
  <thead><tr><th>Ký hiệu</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><code>+</code></td><td>gồm có / và</td><td>Requester = Name + Employee ID + Delivery Location</td></tr>
    <tr><td><code>( )</code></td><td>phần tử tuỳ chọn</td><td>Requested Chemical = Chemical ID + Quantity + (Vendor)</td></tr>
    <tr><td><code>{ }</code></td><td>nhóm lặp</td><td>Order = Order ID + 1:10{Order Line}</td></tr>
    <tr><td><code>min:max</code></td><td>số lần lặp cho phép; <code>n</code> = không giới hạn</td><td>1:n{Tracking Event}</td></tr>
    <tr><td><code>[ a | b ]</code></td><td>hoặc cái này hoặc cái kia</td><td>Payment = [ Card | Bank transfer | COD ]</td></tr>
    <tr><td>nháy kép</td><td>chuỗi ký tự cố định</td><td>Phone = "+84" + Subscriber Number</td></tr>
  </tbody>
</table>
<ul>
  <li>Các mục xếp theo <strong>bảng chữ cái</strong>, không xếp theo độ quan trọng.</li>
  <li>Với một <strong>cấu trúc</strong>, để trống cột <em>Length</em> và <em>Values</em> — hai cột đó chỉ dành cho phần tử nguyên thuỷ.</li>
  <li>Mọi phần tử được gọi tên bên trong một cấu trúc phải có <strong>mục riêng của nó</strong>. Đây là luật người chấm kiểm bằng cách bốc ngẫu nhiên một cấu trúc.</li>
  <li>Cột <em>Values</em> chứa giá trị hợp lệ, mặc định và luật kiểm tra — hãy trỏ chéo sang business rule chi phối nó (<code>xem BR-12</code>).</li>
</ul>
<div class="note-ct">Hãy dựng data dictionary <strong>trong lúc</strong> viết use case, đừng để sau. Mỗi danh từ xuất hiện trong luồng use case ("ngày hứa giao", "lý do ghi đè") là một mục ứng viên, và đi gom lại sau nghĩa là phải đọc lại tất cả.</div>
`,
    ),
  ].join('\n'),
};

/* ─────────── A.8 — Mock-ups + Prioritization + Estimation ─────────── */
const A8 = {
  title: 'A.8 — Building deliverables 6–8: Mock-ups, Prioritization, Estimation|||A.8 — Làm deliverable 6–8: Mock-up, Ưu tiên, Ước lượng',
  slug: 'swr302-assignment-huong-dan-6-8',
  type: 'DOCUMENT',
  description: 'Mock-up cho 3 use case phức tạp theo Ch.15; bảng ưu tiên value/cost/risk của Ch.16 với công thức thật; và Requirements Estimation Tool của Ch.19 — ba cách tính số BA và ngân sách BA, kèm cách giải thích khi ba con số lệch nhau.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.8 · Deliverables 6–8</span>
<h2>Deliverable 6 — Mock-ups for at least 3 complex use cases</h2>
<p class="lead">Book chapter: <strong>Ch.15, Risk reduction through prototyping</strong>. What the brief wants is a <strong>throwaway, low-fidelity mock-up</strong> whose job is to <em>ask a question</em>, not to look pretty.</p>
<h3>Choosing the three</h3>
<p>"Complex" means <em>many decisions and many states</em>, not "many fields". Pick the use case where a stakeholder is most likely to say "no, that is not what I meant". Ranking heuristic: number of alternative flows + number of exceptions + number of actors involved.</p>
<h3>What each mock-up must show</h3>
<ul>
  <li>The <strong>happy path screen</strong> — with realistic sample data, never "Lorem ipsum" and never "Field 1 / Field 2".</li>
  <li>At least one <strong>error or exception state</strong> from your use case's exception list. A mock-up with no failure state proves nothing.</li>
  <li>The <strong>decisions</strong> the user must make, and the information they need to make them.</li>
  <li>A caption tying it to its use case ID and the specific requirements it realizes.</li>
</ul>
<div class="callout warn"><strong>Two traps.</strong> (1) <em>Fidelity creep</em> — a polished mock-up makes stakeholders discuss colour instead of behaviour, and makes management think you are nearly done. Keep it wireframe-grey. (2) <em>The mock-up becoming the spec</em> — the SRS stays the source of truth; the mock-up illustrates it. If they disagree, the SRS is right and the mock-up is out of date.</div>

<h2>Deliverable 7 — Requirement Prioritization Worksheet</h2>
<p class="lead">Template: <strong>Chapter 16 / Requirements Prioritization Spreadsheet.xlsx</strong> — Wiegers's value/cost/risk model. Copy the <em>Template</em> worksheet; all formulas are already in it.</p>
<h3>How the model works</h3>
<p>Rate every feature 1–9 (9 = high) on four dimensions, then the sheet computes:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Total Value</div><div class="lz-d">Benefit × benefit-weight + Penalty × penalty-weight. <em>Benefit</em> = value if present; <em>Penalty</em> = damage if absent. They are different questions — a feature can have low benefit and huge penalty (a login page).</div></div>
  <div class="lz-step"><div class="lz-k">Value %, Cost %, Risk %</div><div class="lz-d">Each feature's share of the column total. This is why you must rate the whole list in one pass.</div></div>
  <div class="lz-step"><div class="lz-k">Priority</div><div class="lz-d">Value % ÷ (Cost % × cost-weight + Risk % × risk-weight). Sort descending — the top of the list is what you build first.</div></div>
</div>
<p>The book's example uses weights <strong>2 / 1 / 1 / 0.5</strong> (benefit twice as important as penalty; risk half as important as cost). Choose your own and <strong>justify the choice in one sentence</strong> — that sentence is worth marks.</p>
<div class="pitfall"><strong>The rule everyone skips.</strong> Wiegers says explicitly: do <em>not</em> run this model on features you already know must be included for political, contractual or regulatory reasons. Put those in a short "must-do, not scored" list above the table, and score only the genuinely negotiable ones. A worksheet where the mandatory login feature scores low priority shows you used the tool without reading it.</div>
<div class="callout ok"><strong>Sanity check before you submit.</strong> Sort by Priority and read the top three aloud. If they are not the features that deliver your top business objectives from Deliverable 1, either your ratings or your objectives are wrong. Fix one of them — and say which, in a sentence under the table.</div>

<h2>Deliverable 8 — Requirement Estimation Tool</h2>
<p class="lead">Template: <strong>Chapter 19 / Requirements Estimation Tool.xlsx</strong>. Three worksheets — <em>Instructions</em>, <em>Summary</em>, <em>Assumptions</em>. You fill the <strong>yellow cells</strong> only; everything else is formula.</p>
<h3>What you must enter (Summary worksheet)</h3>
<table>
  <thead><tr><th>Left block — counts</th><th>Right block — project</th></tr></thead>
  <tbody>
    <tr><td>Existing pages of documentation for review</td><td>Total project budget</td></tr>
    <tr><td>Existing systems being updated or replaced</td><td>BA blended hourly cost</td></tr>
    <tr><td>Stakeholders</td><td>Type of project (Standard or COTS)</td></tr>
    <tr><td>Interfacing systems — small / medium / large</td><td>Number of developers</td></tr>
    <tr><td><strong>Process flows and/or use cases</strong></td><td>Is your team remote?</td></tr>
    <tr><td>Business data diagrams</td><td>Project duration (weeks)</td></tr>
    <tr><td>Screens / user interfaces · Reports</td><td>Requirements work duration (weeks)</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>These counts must match your own documents.</strong> If you type 50 use cases while Deliverable 2 contains 14, the grader sees it instantly. Count your real use cases, your real screens (from Deliverable 6 plus the SRS §5.1 list) and your real reports (SRS §4.3).</div>
<h3>Three answers, deliberately</h3>
<p>The tool estimates the <strong>number of BAs</strong> and the <strong>BA budget</strong> three independent ways — and they will not agree. Explaining the gap <em>is</em> the deliverable:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">A</div><div><div class="lz-lt">% of total project budget</div><div class="lz-ld">15% of the project budget goes to requirements work (industry standard, editable). BAs = that money ÷ hourly cost ÷ (requirements weeks × 40).</div></div></div>
  <div class="lz-layer"><div class="lz-badge">B</div><div><div class="lz-lt">Ratio of developers to BAs</div><div class="lz-ld">6 developers per BA on a standard project; 3 per BA on a COTS project. Fast, crude, ignores how much analysis the system actually needs.</div></div></div>
  <div class="lz-layer"><div class="lz-badge">C</div><div><div class="lz-lt">Activity-based</div><div class="lz-ld">Sums estimated minutes for every artifact — each use case, screen, report, data dictionary entry, interface model, traceability link — then adds a 10% buffer if the team is remote. Slowest, most defensible.</div></div></div>
</div>
<div class="callout ok"><strong>The sentence that earns the mark.</strong> Something like: <em>"Method C gives 3.1 BAs against 2.3 from Method B because our system has 14 interfacing endpoints and 20 screens — an integration-heavy system needs more analysis per developer than the 6:1 rule assumes. We commit to 3 BAs and accept Method C."</em> Pick one number, say why, and state what would change your mind.</div>
<div class="note-ct">Note the difference between <strong>BA budget for requirements work</strong> and <strong>BA budget for project duration</strong>. BAs do not stop working when the SRS is baselined — they answer questions, run change control and maintain traceability until release. The second number is the honest one to quote to a sponsor.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.8 · Deliverable 6–8</span>
<h2>Deliverable 6 — Mock-up cho ít nhất 3 use case phức tạp</h2>
<p class="lead">Chương sách: <strong>Ch.15, Giảm rủi ro bằng prototyping</strong>. Thứ đề bài muốn là <strong>mock-up vứt đi, độ chi tiết thấp</strong>, có nhiệm vụ <em>đặt một câu hỏi</em> chứ không phải trông đẹp.</p>
<h3>Chọn ba cái nào</h3>
<p>"Phức tạp" nghĩa là <em>nhiều quyết định và nhiều trạng thái</em>, không phải "nhiều ô nhập". Hãy chọn use case mà stakeholder dễ nói "không, ý tôi không phải vậy" nhất. Cách xếp hạng: số luồng thay thế + số ngoại lệ + số actor tham gia.</p>
<h3>Mỗi mock-up phải thể hiện được gì</h3>
<ul>
  <li><strong>Màn hình luồng thuận</strong> — với dữ liệu mẫu thật, không bao giờ "Lorem ipsum", không bao giờ "Trường 1 / Trường 2".</li>
  <li>Ít nhất một <strong>trạng thái lỗi hoặc ngoại lệ</strong> lấy từ danh sách ngoại lệ của use case đó. Mock-up không có trạng thái hỏng thì không chứng minh được gì.</li>
  <li>Những <strong>quyết định</strong> người dùng phải đưa ra, và thông tin họ cần để quyết.</li>
  <li>Một dòng chú thích nối nó với ID use case và các yêu cầu cụ thể nó hiện thực.</li>
</ul>
<div class="callout warn"><strong>Hai cái bẫy.</strong> (1) <em>Trôi về độ chi tiết cao</em> — mock-up bóng bẩy khiến stakeholder bàn về màu sắc thay vì hành vi, và khiến quản lý tưởng bạn sắp xong. Hãy giữ nó ở mức khung xám. (2) <em>Mock-up biến thành đặc tả</em> — SRS vẫn là nguồn sự thật; mock-up chỉ minh hoạ. Nếu hai bên mâu thuẫn thì SRS đúng còn mock-up đã cũ.</div>

<h2>Deliverable 7 — Bảng xếp ưu tiên yêu cầu</h2>
<p class="lead">Template: <strong>Chapter 16 / Requirements Prioritization Spreadsheet.xlsx</strong> — mô hình value/cost/risk của Wiegers. Hãy chép sheet <em>Template</em>; mọi công thức đã có sẵn trong đó.</p>
<h3>Mô hình chạy thế nào</h3>
<p>Chấm mỗi tính năng 1–9 (9 là cao) trên bốn chiều, rồi bảng tự tính:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Total Value</div><div class="lz-d">Benefit × trọng số benefit + Penalty × trọng số penalty. <em>Benefit</em> = giá trị khi có; <em>Penalty</em> = thiệt hại khi thiếu. Đó là hai câu hỏi khác nhau — một tính năng có thể benefit thấp mà penalty khổng lồ (trang đăng nhập).</div></div>
  <div class="lz-step"><div class="lz-k">Value %, Cost %, Risk %</div><div class="lz-d">Phần của mỗi tính năng trong tổng cột. Chính vì vậy bạn phải chấm cả danh sách trong một lượt.</div></div>
  <div class="lz-step"><div class="lz-k">Priority</div><div class="lz-d">Value % ÷ (Cost % × trọng số cost + Risk % × trọng số risk). Sắp giảm dần — đầu danh sách là cái làm trước.</div></div>
</div>
<p>Ví dụ trong sách dùng trọng số <strong>2 / 1 / 1 / 0,5</strong> (benefit quan trọng gấp đôi penalty; risk chỉ bằng nửa cost). Hãy tự chọn trọng số của bạn và <strong>giải thích lựa chọn đó bằng một câu</strong> — câu đó đáng điểm.</p>
<div class="pitfall"><strong>Luật ai cũng bỏ qua.</strong> Wiegers nói thẳng: <em>đừng</em> chạy mô hình này cho những tính năng bạn đã biết chắc phải có vì lý do chính trị, hợp đồng hay pháp lý. Hãy đưa chúng vào một danh sách ngắn "bắt buộc, không chấm điểm" ở trên bảng, và chỉ chấm những cái thực sự thương lượng được. Một bảng mà tính năng đăng nhập bắt buộc lại xếp ưu tiên thấp cho thấy bạn dùng công cụ mà chưa đọc nó.</div>
<div class="callout ok"><strong>Kiểm tra tỉnh táo trước khi nộp.</strong> Sắp theo Priority và đọc to ba dòng đầu. Nếu đó không phải những tính năng tạo ra các mục tiêu nghiệp vụ hàng đầu ở Deliverable 1, thì hoặc điểm chấm sai hoặc mục tiêu sai. Sửa một trong hai — và ghi một câu bên dưới bảng nói bạn đã sửa cái nào.</div>

<h2>Deliverable 8 — Công cụ ước lượng yêu cầu</h2>
<p class="lead">Template: <strong>Chapter 19 / Requirements Estimation Tool.xlsx</strong>. Ba sheet — <em>Instructions</em>, <em>Summary</em>, <em>Assumptions</em>. Bạn chỉ điền các <strong>ô vàng</strong>; phần còn lại là công thức.</p>
<h3>Phải nhập những gì (sheet Summary)</h3>
<table>
  <thead><tr><th>Khối trái — số đếm</th><th>Khối phải — dự án</th></tr></thead>
  <tbody>
    <tr><td>Số trang tài liệu hiện có cần đọc</td><td>Tổng ngân sách dự án</td></tr>
    <tr><td>Số hệ thống cũ được nâng cấp/thay thế</td><td>Chi phí giờ công BA (blended)</td></tr>
    <tr><td>Số stakeholder</td><td>Loại dự án (Standard hay COTS)</td></tr>
    <tr><td>Hệ thống giao tiếp — nhỏ / vừa / lớn</td><td>Số lập trình viên</td></tr>
    <tr><td><strong>Số process flow và/hoặc use case</strong></td><td>Đội có làm từ xa không?</td></tr>
    <tr><td>Số sơ đồ dữ liệu nghiệp vụ</td><td>Thời lượng dự án (tuần)</td></tr>
    <tr><td>Số màn hình · Số báo cáo</td><td>Thời lượng làm yêu cầu (tuần)</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Những con số đếm này phải khớp với tài liệu của chính bạn.</strong> Nếu bạn gõ 50 use case trong khi Deliverable 2 chỉ có 14, người chấm thấy ngay. Hãy đếm use case thật, màn hình thật (từ Deliverable 6 cộng danh sách ở SRS §5.1) và báo cáo thật (SRS §4.3).</div>
<h3>Ba đáp số, một cách cố ý</h3>
<p>Công cụ ước lượng <strong>số BA</strong> và <strong>ngân sách BA</strong> bằng ba cách độc lập — và chúng sẽ không khớp nhau. Giải thích được khoảng chênh <em>chính là</em> phần bài làm:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-badge">A</div><div><div class="lz-lt">Theo % tổng ngân sách</div><div class="lz-ld">15% ngân sách dự án dành cho công việc yêu cầu (chuẩn ngành, sửa được). Số BA = số tiền đó ÷ giá giờ ÷ (số tuần làm yêu cầu × 40).</div></div></div>
  <div class="lz-layer"><div class="lz-badge">B</div><div><div class="lz-lt">Theo tỉ lệ dev trên BA</div><div class="lz-ld">6 lập trình viên một BA với dự án chuẩn; 3 một BA với dự án COTS. Nhanh, thô, bỏ qua việc hệ thống thực sự cần bao nhiêu phân tích.</div></div></div>
  <div class="lz-layer"><div class="lz-badge">C</div><div><div class="lz-lt">Theo hoạt động</div><div class="lz-ld">Cộng số phút ước tính cho từng sản phẩm — từng use case, màn hình, báo cáo, mục data dictionary, mô hình giao tiếp, liên kết truy vết — rồi cộng thêm 10% nếu đội làm từ xa. Chậm nhất, nhưng bảo vệ được nhất.</div></div></div>
</div>
<div class="callout ok"><strong>Câu văn ăn điểm.</strong> Đại loại: <em>"Cách C cho 3,1 BA so với 2,3 của cách B vì hệ thống của chúng tôi có 14 điểm giao tiếp và 20 màn hình — một hệ thống nặng tích hợp cần nhiều phân tích trên mỗi lập trình viên hơn mức tỉ lệ 6:1 giả định. Chúng tôi cam kết 3 BA và chọn cách C."</em> Hãy chốt một con số, nói vì sao, và nói điều gì sẽ khiến bạn đổi ý.</div>
<div class="note-ct">Để ý khác biệt giữa <strong>ngân sách BA cho giai đoạn làm yêu cầu</strong> và <strong>ngân sách BA cho cả dự án</strong>. BA không ngừng làm việc khi SRS được baseline — họ còn trả lời câu hỏi, chạy kiểm soát thay đổi và duy trì truy vết tới lúc phát hành. Con số thứ hai mới là con số trung thực để báo với nhà tài trợ.</div>
`,
    ),
  ].join('\n'),
};

export default [A6, A7, A8];
