/**
 * SWR302 · Section "Group Assignment (20%)" — the on-going team project named in
 * the official grade table (Assignment 20%, CLO2–9): build a complete requirements
 * package for an assigned topic.
 *
 * Structure: A.1 brief & rubric · A.2/A.3 the topics (assignment-topics.mjs) ·
 * A.4 team of five · A.5 week-by-week plan and the lecturer's check-ins ·
 * A.6–A.8 how to build each deliverable (assignment-guide.mjs) · A.9 worked
 * example · A.10 the Week-9 presentation and the self-check rubric.
 *
 * All eight deliverables map to a Wiegers template the lecturer distributes in
 * Document_GuideLines/ — every lesson names the exact file.
 */
import { bi } from './_slides.mjs';
import topics from './assignment-topics.mjs';
import guide from './assignment-guide.mjs';

/* ─────────── A.1 — the brief ─────────── */
const A1 = {
  title: 'A.1 — The assignment: 8 deliverables, one requirements package|||A.1 — Đề bài: 8 sản phẩm, một bộ tài liệu yêu cầu',
  slug: 'swr302-assignment-de-bai',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Assignment chiếm 20% điểm môn (CLO2–9). Toàn bộ 8 deliverable, template Wiegers tương ứng từng cái, chuỗi phụ thuộc bắt buộc, và sáu liên kết truy vết mà người chấm sẽ dò.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.1 · Start here</span>
<h2>The group assignment — 20% of your course grade</h2>
<p class="lead">This is the largest single piece of coursework in SWR302 and the only one that exercises the <strong>whole</strong> requirements lifecycle end to end. A team of five is given a business scenario in Week 2 and must deliver a complete, internally consistent requirements package by Week 9. It is assessed against <strong>CLO2–CLO9</strong> — effectively every learning outcome except the introductory one.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Weight</span><span class="v">20% <small>on-going coursework</small></span></div>
  <div class="kv"><span class="k">Team size</span><span class="v">5 students</span></div>
  <div class="kv"><span class="k">Topic issued</span><span class="v">Start of Week 2</span></div>
  <div class="kv"><span class="k">Presentation</span><span class="v">Week 9</span></div>
  <div class="kv"><span class="k">Progress checks</span><span class="v">Weeks 2–9 <small>unannounced, oral</small></span></div>
  <div class="kv"><span class="k">Outcomes</span><span class="v">CLO2 – CLO9</span></div>
</div>

<h3>The eight deliverables</h3>
<p>Every deliverable has a template the lecturer distributes in the course folder <code>Document_GuideLines/</code>. Using your own layout instead of the template is an easy way to lose marks for no benefit.</p>
<table>
  <thead><tr><th>#</th><th>Deliverable</th><th>Book ch.</th><th>Template file</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Product vision &amp; scope</td><td>Ch.5</td><td><code>Chapter 5/Vision and Scope Template.docx</code></td></tr>
    <tr><td>2</td><td>Use case diagram + use case specification — <strong>at least 10 use cases</strong></td><td>Ch.8</td><td><code>Chapter 8/Use Case Template.docx</code></td></tr>
    <tr><td>3</td><td>Business rule document</td><td>Ch.9</td><td><code>Appendix C/COS Business Rules.docx</code> (model)</td></tr>
    <tr><td>4</td><td>Software requirement specification — <strong>with all the sections in the template</strong></td><td>Ch.10</td><td><code>Chapter 10/Software Requirements Specification Template.docx</code></td></tr>
    <tr><td>5</td><td>Data dictionary document</td><td>Ch.13</td><td><code>Chapter 13/Guidance for Data Dictionaries.docx</code></td></tr>
    <tr><td>6</td><td>Mock-up — for <strong>at least 3 complex use cases</strong></td><td>Ch.15</td><td>—</td></tr>
    <tr><td>7</td><td>Requirement prioritization worksheet</td><td>Ch.16</td><td><code>Chapter 16/Requirements Prioritization Spreadsheet.xlsx</code></td></tr>
    <tr><td>8</td><td>Requirement estimation tool — <strong>BA budget and number of BAs</strong></td><td>Ch.19</td><td><code>Chapter 19/Requirements Estimation Tool.xlsx</code></td></tr>
  </tbody>
</table>
<p>Two full worked examples ship with the course and are worth more than any lecture: <code>Appendix C/COS Vision and Scope.docx</code>, <code>COS Use Cases.docx</code>, <code>COS Business Rules.docx</code>, <code>COS SRS.docx</code> (the Cafeteria Ordering System) and <code>PearlsFromSand.com SRS Example.docx</code>.</p>

<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp1-goi-01-vision-scope">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Worked package TP1 — all eight deliverables in full</span><span class="lc-sub">A complete, internally consistent package for the campus registration topic (CARS).</span></span>
  <span class="lc-cta">OPEN TP1 →</span>
</a>
<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp2-goi-01-vision-scope">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Worked package TP2 — all eight deliverables in full</span><span class="lc-sub">The same eight documents for the e-commerce fulfillment topic (OMFS). Comparing the two shows which choices are topic-specific and which are not.</span></span>
  <span class="lc-cta">OPEN TP2 →</span>
</a>
<h3>The dependency chain — you cannot reorder this</h3>
<div class="lz-map">
  <div class="lz-stage">Deliverable order is forced by data, not by preference</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vision &amp; Scope</div><div class="lz-nsub">Defines the features (FE-n) everything else traces to</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Use Cases → Business Rules</div><div class="lz-nsub">Written together: every flow step surfaces a rule, every rule constrains a flow</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">SRS ← Data Dictionary</div><div class="lz-nsub">The SRS integrates use cases, rules and quality attributes; the dictionary defines every noun it uses</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Mock-ups</div><div class="lz-nsub">Only possible once the three most complex use cases are actually written</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Prioritization → Estimation</div><div class="lz-nsub">Estimation needs the real counts of use cases, screens, reports and interfaces from 2, 4 and 6</div></div></div>
</div>
<div class="callout warn"><strong>Deliverable 8 cannot be done early.</strong> It takes the number of use cases, screens, reports and interfacing systems as inputs. A team that fills it in Week 3 with guessed counts will contradict its own documents — and this is the contradiction graders find fastest.</div>

<h3>The six traceability links a grader checks</h3>
<p>Marks are lost far more often to <em>inconsistency between documents</em> than to weak content inside one. Before submission, verify:</p>
<ol>
  <li>Every feature <strong>FE-n</strong> in Vision &amp; Scope §2.1 is realized by at least one <strong>UC-nn</strong>.</li>
  <li>Every <strong>UC-nn</strong> names the <strong>BR-nn</strong> rules that constrain it, by ID only.</li>
  <li>Every SRS functional requirement traces back to a <strong>UC-nn</strong> or an <strong>FE-n</strong>.</li>
  <li>Every noun used in a use case flow has an entry in the <strong>data dictionary</strong>.</li>
  <li>Every row of the prioritization worksheet is an existing <strong>FE-n</strong> or <strong>UC-nn</strong> — no newly invented names.</li>
  <li>The counts inside the estimation tool equal what deliverables 2, 4 and 6 actually contain.</li>
</ol>
<div class="callout ok"><strong>Do this as a table, not as a promise.</strong> A one-page <em>Requirements Traceability Matrix</em> (book Ch.29) appended to the SRS turns all six checks into something the grader can verify in thirty seconds — and it is itself worth marks under CLO9.</div>

<h3>What "elicitation" means when there is no real customer</h3>
<p>Both briefs require requirements elicitation "via stakeholder simulation or AI-assisted inquiry". You have no real university registrar and no real warehouse manager. So:</p>
<ul>
  <li><strong>Assign stakeholder roles inside the team</strong> and run a real interview — one member plays the Fulfillment Manager, answers in character, and refuses to answer what that role would not know.</li>
  <li><strong>Write the questions before the session</strong> and keep them. An elicitation session with no question list is a chat.</li>
  <li><strong>Keep the notes.</strong> Interview notes, a session date, and who played whom are evidence. The lecturer may ask at a check-in where a particular requirement came from, and "we discussed it" is a weaker answer than "interview 3, 12 March, Fulfillment Manager".</li>
  <li><strong>If you use AI to simulate a stakeholder</strong>, say so in the SRS References section and keep the transcript. Treat its answers as one stakeholder's opinion — not as fact, and never as a substitute for deciding things yourselves.</li>
</ul>
`,
      `<span class="eyebrow">Assignment · Bài A.1 · Bắt đầu ở đây</span>
<h2>Bài tập nhóm — 20% điểm môn</h2>
<p class="lead">Đây là phần bài tập lớn nhất của SWR302 và là phần duy nhất chạy <strong>trọn</strong> vòng đời yêu cầu từ đầu đến cuối. Một nhóm năm người nhận một tình huống nghiệp vụ vào tuần 2 và phải nộp một bộ tài liệu yêu cầu hoàn chỉnh, nhất quán nội tại, trước tuần 9. Nó được chấm theo <strong>CLO2–CLO9</strong> — tức gần như mọi chuẩn đầu ra trừ cái nhập môn.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Trọng số</span><span class="v">20% <small>điểm quá trình</small></span></div>
  <div class="kv"><span class="k">Số người</span><span class="v">5 sinh viên</span></div>
  <div class="kv"><span class="k">Nhận đề</span><span class="v">Đầu tuần 2</span></div>
  <div class="kv"><span class="k">Thuyết trình</span><span class="v">Tuần 9</span></div>
  <div class="kv"><span class="k">Kiểm tra tiến độ</span><span class="v">Tuần 2–9 <small>gọi bất chợt, vấn đáp</small></span></div>
  <div class="kv"><span class="k">Chuẩn đầu ra</span><span class="v">CLO2 – CLO9</span></div>
</div>

<h3>Tám sản phẩm phải nộp</h3>
<p>Mỗi sản phẩm đều có một template thầy phát trong thư mục <code>Document_GuideLines/</code>. Tự bịa bố cục riêng thay vì dùng template là cách mất điểm dễ dàng mà chẳng được gì.</p>
<table>
  <thead><tr><th>#</th><th>Sản phẩm</th><th>Ch. sách</th><th>File template</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Tầm nhìn &amp; phạm vi sản phẩm</td><td>Ch.5</td><td><code>Chapter 5/Vision and Scope Template.docx</code></td></tr>
    <tr><td>2</td><td>Use case diagram + đặc tả use case — <strong>ít nhất 10 use case</strong></td><td>Ch.8</td><td><code>Chapter 8/Use Case Template.docx</code></td></tr>
    <tr><td>3</td><td>Tài liệu business rule</td><td>Ch.9</td><td><code>Appendix C/COS Business Rules.docx</code> (mẫu)</td></tr>
    <tr><td>4</td><td>Đặc tả yêu cầu phần mềm — <strong>đủ mọi mục trong template</strong></td><td>Ch.10</td><td><code>Chapter 10/Software Requirements Specification Template.docx</code></td></tr>
    <tr><td>5</td><td>Tài liệu data dictionary</td><td>Ch.13</td><td><code>Chapter 13/Guidance for Data Dictionaries.docx</code></td></tr>
    <tr><td>6</td><td>Mock-up — cho <strong>ít nhất 3 use case phức tạp</strong></td><td>Ch.15</td><td>—</td></tr>
    <tr><td>7</td><td>Bảng xếp ưu tiên yêu cầu</td><td>Ch.16</td><td><code>Chapter 16/Requirements Prioritization Spreadsheet.xlsx</code></td></tr>
    <tr><td>8</td><td>Công cụ ước lượng yêu cầu — <strong>ngân sách BA và số lượng BA</strong></td><td>Ch.19</td><td><code>Chapter 19/Requirements Estimation Tool.xlsx</code></td></tr>
  </tbody>
</table>
<p>Hai bộ ví dụ hoàn chỉnh đi kèm khoá học, giá trị hơn bất kỳ bài giảng nào: <code>Appendix C/COS Vision and Scope.docx</code>, <code>COS Use Cases.docx</code>, <code>COS Business Rules.docx</code>, <code>COS SRS.docx</code> (hệ thống đặt cơm căng-tin) và <code>PearlsFromSand.com SRS Example.docx</code>.</p>

<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp1-goi-01-vision-scope">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bộ tài liệu mẫu TP1 — trọn tám deliverable</span><span class="lc-sub">Một bộ hoàn chỉnh, nhất quán nội tại cho đề học vụ &amp; đăng ký môn (CARS).</span></span>
  <span class="lc-cta">MỞ TP1 →</span>
</a>
<a class="link-card exphub" href="/courses/software-requirements/learn?lessonSlug=swr302-tp2-goi-01-vision-scope">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Bộ tài liệu mẫu TP2 — trọn tám deliverable</span><span class="lc-sub">Cũng tám tài liệu đó nhưng cho đề hoàn tất đơn TMĐT (OMFS). So hai bộ sẽ thấy lựa chọn nào là riêng của đề, lựa chọn nào thì không.</span></span>
  <span class="lc-cta">MỞ TP2 →</span>
</a>
<h3>Chuỗi phụ thuộc — không đảo thứ tự được</h3>
<div class="lz-map">
  <div class="lz-stage">Thứ tự bị ép bởi dữ liệu, không phải bởi sở thích</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Vision &amp; Scope</div><div class="lz-nsub">Định ra các feature (FE-n) mà mọi thứ sau đều truy về</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Use Case → Business Rule</div><div class="lz-nsub">Viết song song: mỗi bước luồng lộ ra một rule, mỗi rule ràng buộc một luồng</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">SRS ← Data Dictionary</div><div class="lz-nsub">SRS tích hợp use case, rule và thuộc tính chất lượng; từ điển định nghĩa mọi danh từ nó dùng</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Mock-up</div><div class="lz-nsub">Chỉ làm được khi ba use case phức tạp nhất đã thực sự được viết ra</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Ưu tiên → Ước lượng</div><div class="lz-nsub">Ước lượng cần số đếm thật của use case, màn hình, báo cáo và giao tiếp từ 2, 4 và 6</div></div></div>
</div>
<div class="callout warn"><strong>Deliverable 8 không thể làm sớm.</strong> Nó lấy số use case, màn hình, báo cáo và hệ thống giao tiếp làm đầu vào. Nhóm điền nó vào tuần 3 bằng số đoán sẽ mâu thuẫn với chính tài liệu của mình — và đây là mâu thuẫn người chấm tìm ra nhanh nhất.</div>

<h3>Sáu liên kết truy vết mà người chấm sẽ dò</h3>
<p>Điểm bị mất vì <em>không nhất quán giữa các tài liệu</em> nhiều hơn hẳn vì nội dung yếu trong một tài liệu. Trước khi nộp, hãy kiểm:</p>
<ol>
  <li>Mọi feature <strong>FE-n</strong> ở Vision &amp; Scope §2.1 đều được ít nhất một <strong>UC-nn</strong> hiện thực.</li>
  <li>Mọi <strong>UC-nn</strong> đều gọi tên các rule <strong>BR-nn</strong> ràng buộc nó, chỉ bằng ID.</li>
  <li>Mọi functional requirement trong SRS đều truy ngược về một <strong>UC-nn</strong> hoặc một <strong>FE-n</strong>.</li>
  <li>Mọi danh từ dùng trong luồng use case đều có một mục trong <strong>data dictionary</strong>.</li>
  <li>Mọi dòng của bảng ưu tiên đều là <strong>FE-n</strong> hoặc <strong>UC-nn</strong> đã có — không có tên mới bịa ra.</li>
  <li>Số đếm trong công cụ ước lượng bằng đúng những gì deliverable 2, 4 và 6 thực sự chứa.</li>
</ol>
<div class="callout ok"><strong>Hãy làm thành bảng, đừng chỉ hứa.</strong> Một trang <em>Ma trận truy vết yêu cầu</em> (Ch.29 sách) đính kèm SRS biến cả sáu phép kiểm trên thành thứ người chấm xác minh được trong ba mươi giây — và bản thân nó cũng có điểm theo CLO9.</div>

<h3>"Elicitation" nghĩa là gì khi không có khách hàng thật</h3>
<p>Cả hai đề đều đòi khai thác yêu cầu "bằng mô phỏng stakeholder hoặc phỏng vấn có AI hỗ trợ". Bạn không có phòng đào tạo thật, cũng chẳng có quản lý kho thật. Vậy thì:</p>
<ul>
  <li><strong>Phân vai stakeholder trong nhóm</strong> và phỏng vấn thật — một bạn đóng Quản lý hoàn tất đơn, trả lời đúng vai, và từ chối trả lời những gì vai đó không thể biết.</li>
  <li><strong>Viết câu hỏi trước buổi phỏng vấn</strong> và giữ lại. Buổi elicitation không có danh sách câu hỏi chỉ là buổi tán gẫu.</li>
  <li><strong>Giữ biên bản.</strong> Ghi chép phỏng vấn, ngày họp, ai đóng vai nào — đó là bằng chứng. Thầy có thể hỏi ở buổi kiểm tra rằng một yêu cầu nào đó từ đâu ra, và "bọn em có bàn" là câu trả lời yếu hơn "phỏng vấn số 3, ngày 12/3, vai Quản lý hoàn tất đơn".</li>
  <li><strong>Nếu dùng AI để mô phỏng stakeholder</strong>, hãy ghi rõ vào mục References của SRS và giữ lại bản ghi hội thoại. Hãy coi câu trả lời của nó là ý kiến của một stakeholder — không phải sự thật, và tuyệt đối không thay bạn ra quyết định.</li>
</ul>
`,
    ),
  ].join('\n'),
};

/* ─────────── A.4 — team of five ─────────── */
const A4 = {
  title: 'A.4 — A team of five: roles, ownership and the RACI|||A.4 — Nhóm năm người: vai trò, quyền sở hữu và bảng RACI',
  slug: 'swr302-assignment-phan-cong-nhom',
  type: 'DOCUMENT',
  description: 'Phân công 5 người theo chuỗi phụ thuộc chứ không chia đều số trang: ai sở hữu deliverable nào, ai review chéo ai, bảng RACI, và ba kiểu hỏng nhóm hay gặp cùng cách chặn.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.4 · Team</span>
<h2>Five people, eight deliverables — divide by dependency, not by page count</h2>
<p class="lead">The instinctive split is "one deliverable each, two people take the big ones". It fails, every semester, for one reason: <strong>the eight documents are not independent</strong>. The SRS restates what the use cases say, the data dictionary defines what the use cases use, and the estimation tool counts what the others produced. Split by page count and you get five documents that contradict each other in Week 8.</p>
<h3>The split that works</h3>
<table>
  <thead><tr><th>Role</th><th>Owns</th><th>Waits for</th><th>Reviews</th></tr></thead>
  <tbody>
    <tr><td><strong>1 · Team Leader / Lead BA</strong></td><td>Deliverable 1 (Vision &amp; Scope) and Deliverable 4 (SRS) — the two integrating documents; plus the final consistency pass and the traceability matrix</td><td>Nothing. Starts first, finishes last</td><td>Everything</td></tr>
    <tr><td><strong>2 · Use Case Analyst A</strong></td><td>The use case diagram + roughly the first half of the use case specs</td><td>Deliverable 1 §2.1</td><td>Member 3's use cases</td></tr>
    <tr><td><strong>3 · Use Case Analyst B + Rules</strong></td><td>The second half of the use case specs, and Deliverable 3 (business rules)</td><td>Deliverable 1 §2.1</td><td>Member 2's use cases</td></tr>
    <tr><td><strong>4 · Data &amp; UX Analyst</strong></td><td>Deliverable 5 (data dictionary) and Deliverable 6 (mock-ups)</td><td>Use cases, continuously</td><td>The SRS data and interface sections</td></tr>
    <tr><td><strong>5 · Planning Analyst</strong></td><td>Deliverable 7 (prioritization) and Deliverable 8 (estimation); also keeps the project log the lecturer asks for at check-ins</td><td>Deliverables 2, 4 and 6 — so starts last</td><td>Deliverable 1 objectives vs the priority ranking</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Member 5 looks idle until Week 6 — they are not.</strong> Give them the <em>elicitation log, meeting minutes, decision log and version history</em> from Week 2. These are exactly what the lecturer asks to see at an unannounced check-in, and the team that has them answers in ten seconds.</div>

<h3>RACI for the eight deliverables</h3>
<p><strong>R</strong> = does the work · <strong>A</strong> = accountable, one person only · <strong>C</strong> = consulted before it is written · <strong>I</strong> = informed after</p>
<table>
  <thead><tr><th>Deliverable</th><th>M1 Leader</th><th>M2 UC-A</th><th>M3 UC-B/Rules</th><th>M4 Data/UX</th><th>M5 Planning</th></tr></thead>
  <tbody>
    <tr><td>1 · Vision &amp; Scope</td><td><strong>R/A</strong></td><td>C</td><td>C</td><td>C</td><td>C</td></tr>
    <tr><td>2 · Use cases + diagram</td><td>A</td><td><strong>R</strong></td><td><strong>R</strong></td><td>C</td><td>I</td></tr>
    <tr><td>3 · Business rules</td><td>C</td><td>C</td><td><strong>R/A</strong></td><td>I</td><td>I</td></tr>
    <tr><td>4 · SRS</td><td><strong>R/A</strong></td><td>C</td><td>C</td><td><strong>R</strong> (§4, §5.1)</td><td>C</td></tr>
    <tr><td>5 · Data dictionary</td><td>C</td><td>C</td><td>C</td><td><strong>R/A</strong></td><td>I</td></tr>
    <tr><td>6 · Mock-ups</td><td>C</td><td>C</td><td>I</td><td><strong>R/A</strong></td><td>I</td></tr>
    <tr><td>7 · Prioritization</td><td>C</td><td>C</td><td>C</td><td>C</td><td><strong>R/A</strong></td></tr>
    <tr><td>8 · Estimation</td><td>C</td><td>I</td><td>I</td><td>C</td><td><strong>R/A</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>One rule that prevents most disasters: exactly one A per row.</strong> When two people are accountable, nobody is. When the lecturer asks "who decided this?", the A answers.</div>

<h3>Three ways a five-person team fails, and the counter-measure</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">The leader writes everything</div><div class="lz-d">Usually because it is faster in Week 3. By Week 8 the leader is the only person who can answer a check-in question, and the lecturer asks the <em>other four</em>. <strong>Counter:</strong> the owner of a deliverable presents it — always, even if the leader wrote half of it.</div></div>
  <div class="lz-step"><div class="lz-k">Five documents, five vocabularies</div><div class="lz-d">One member writes "fulfillment center", another "warehouse", a third "FC". Each is fine alone; together they look like five unrelated projects. <strong>Counter:</strong> one shared glossary and one shared fact sheet of agreed numbers, created in Week 2, before anybody writes a paragraph.</div></div>
  <div class="lz-step"><div class="lz-k">Everything lands in Week 8</div><div class="lz-d">Deliverables 7 and 8 genuinely depend on the rest — but "depends on" means "needs a draft", not "needs a final". <strong>Counter:</strong> freeze a rough version of the use case list in Week 5 so members 4 and 5 can start against it, and let them absorb changes later.</div></div>
</div>
<div class="note-ct"><strong>Version control.</strong> Keep the eight documents in one shared folder with a revision history table filled in at the top of each. The templates already contain that table — it is not decoration. At a check-in "which version is current?" is a fair question and a shared drive full of <em>SRS_final_v2_NEW_real.docx</em> is a bad answer.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.4 · Nhóm</span>
<h2>Năm người, tám sản phẩm — chia theo phụ thuộc, đừng chia theo số trang</h2>
<p class="lead">Cách chia theo bản năng là "mỗi người một deliverable, hai người ôm cái lớn". Kỳ nào nó cũng hỏng, vì đúng một lý do: <strong>tám tài liệu không độc lập với nhau</strong>. SRS phát biểu lại những gì use case nói, data dictionary định nghĩa những gì use case dùng, và công cụ ước lượng đếm những gì các tài liệu kia sinh ra. Chia theo số trang thì tới tuần 8 bạn có năm tài liệu mâu thuẫn nhau.</p>
<h3>Cách chia chạy được</h3>
<table>
  <thead><tr><th>Vai</th><th>Sở hữu</th><th>Chờ cái gì</th><th>Review cho ai</th></tr></thead>
  <tbody>
    <tr><td><strong>1 · Nhóm trưởng / Lead BA</strong></td><td>Deliverable 1 (Vision &amp; Scope) và Deliverable 4 (SRS) — hai tài liệu tích hợp; cộng lượt rà nhất quán cuối và ma trận truy vết</td><td>Không chờ ai. Bắt đầu đầu tiên, kết thúc cuối cùng</td><td>Tất cả</td></tr>
    <tr><td><strong>2 · Phân tích use case A</strong></td><td>Use case diagram + khoảng nửa đầu các đặc tả use case</td><td>Deliverable 1 §2.1</td><td>Use case của thành viên 3</td></tr>
    <tr><td><strong>3 · Phân tích use case B + Rule</strong></td><td>Nửa sau các đặc tả use case, và Deliverable 3 (business rule)</td><td>Deliverable 1 §2.1</td><td>Use case của thành viên 2</td></tr>
    <tr><td><strong>4 · Phân tích dữ liệu &amp; UX</strong></td><td>Deliverable 5 (data dictionary) và Deliverable 6 (mock-up)</td><td>Use case, liên tục</td><td>Các mục dữ liệu và giao tiếp của SRS</td></tr>
    <tr><td><strong>5 · Phân tích kế hoạch</strong></td><td>Deliverable 7 (ưu tiên) và Deliverable 8 (ước lượng); đồng thời giữ nhật ký dự án mà thầy hỏi ở các buổi kiểm tra</td><td>Deliverable 2, 4 và 6 — nên bắt đầu sau cùng</td><td>Mục tiêu ở Deliverable 1 so với thứ tự ưu tiên</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Thành viên 5 trông như rảnh tới tuần 6 — không phải vậy.</strong> Hãy giao cho bạn ấy <em>nhật ký elicitation, biên bản họp, nhật ký quyết định và lịch sử phiên bản</em> ngay từ tuần 2. Đó đúng là những thứ thầy đòi xem ở buổi kiểm tra bất chợt, và nhóm có sẵn chúng trả lời trong mười giây.</div>

<h3>RACI cho tám sản phẩm</h3>
<p><strong>R</strong> = làm · <strong>A</strong> = chịu trách nhiệm, chỉ một người · <strong>C</strong> = được hỏi ý trước khi viết · <strong>I</strong> = được báo sau</p>
<table>
  <thead><tr><th>Sản phẩm</th><th>TV1 Trưởng</th><th>TV2 UC-A</th><th>TV3 UC-B/Rule</th><th>TV4 Dữ liệu/UX</th><th>TV5 Kế hoạch</th></tr></thead>
  <tbody>
    <tr><td>1 · Vision &amp; Scope</td><td><strong>R/A</strong></td><td>C</td><td>C</td><td>C</td><td>C</td></tr>
    <tr><td>2 · Use case + sơ đồ</td><td>A</td><td><strong>R</strong></td><td><strong>R</strong></td><td>C</td><td>I</td></tr>
    <tr><td>3 · Business rule</td><td>C</td><td>C</td><td><strong>R/A</strong></td><td>I</td><td>I</td></tr>
    <tr><td>4 · SRS</td><td><strong>R/A</strong></td><td>C</td><td>C</td><td><strong>R</strong> (§4, §5.1)</td><td>C</td></tr>
    <tr><td>5 · Data dictionary</td><td>C</td><td>C</td><td>C</td><td><strong>R/A</strong></td><td>I</td></tr>
    <tr><td>6 · Mock-up</td><td>C</td><td>C</td><td>I</td><td><strong>R/A</strong></td><td>I</td></tr>
    <tr><td>7 · Xếp ưu tiên</td><td>C</td><td>C</td><td>C</td><td>C</td><td><strong>R/A</strong></td></tr>
    <tr><td>8 · Ước lượng</td><td>C</td><td>I</td><td>I</td><td>C</td><td><strong>R/A</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Một luật chặn được phần lớn thảm hoạ: mỗi dòng đúng một chữ A.</strong> Khi hai người cùng chịu trách nhiệm thì không ai chịu cả. Lúc thầy hỏi "ai quyết cái này?", người mang chữ A trả lời.</div>

<h3>Ba kiểu nhóm năm người hỏng, và cách chặn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trưởng nhóm viết hết</div><div class="lz-d">Thường vì tuần 3 làm vậy nhanh hơn. Tới tuần 8 thì trưởng nhóm là người duy nhất trả lời được câu hỏi kiểm tra, mà thầy lại hỏi <em>bốn người kia</em>. <strong>Cách chặn:</strong> ai sở hữu deliverable thì người đó trình bày — luôn luôn, kể cả khi trưởng nhóm viết một nửa.</div></div>
  <div class="lz-step"><div class="lz-k">Năm tài liệu, năm bộ từ vựng</div><div class="lz-d">Một bạn viết "trung tâm hoàn tất", bạn khác viết "kho", bạn thứ ba viết "FC". Tách ra thì cái nào cũng ổn; ghép lại trông như năm dự án chẳng liên quan. <strong>Cách chặn:</strong> một glossary chung và một bảng số liệu chung đã thống nhất, lập ở tuần 2, trước khi có ai viết đoạn nào.</div></div>
  <div class="lz-step"><div class="lz-k">Mọi thứ dồn vào tuần 8</div><div class="lz-d">Deliverable 7 và 8 thật sự phụ thuộc phần còn lại — nhưng "phụ thuộc" nghĩa là "cần một bản nháp", không phải "cần bản cuối". <strong>Cách chặn:</strong> đóng băng một bản thô của danh sách use case ở tuần 5 để thành viên 4 và 5 bắt đầu dựa trên đó, rồi cho họ hấp thụ thay đổi sau.</div></div>
</div>
<div class="note-ct"><strong>Quản lý phiên bản.</strong> Giữ tám tài liệu trong một thư mục dùng chung, mỗi tài liệu điền bảng lịch sử sửa đổi ở đầu. Template đã có sẵn bảng đó — nó không phải đồ trang trí. Ở buổi kiểm tra, "bản nào là bản hiện hành?" là câu hỏi chính đáng, và một thư mục đầy <em>SRS_final_v2_MOI_that.docx</em> là câu trả lời tồi.</div>
`,
    ),
  ].join('\n'),
};

/* ─────────── A.5 — week-by-week plan and the check-ins ─────────── */
const A5 = {
  title: 'A.5 — Week 2 → Week 9: the plan and the lecturer\'s check-ins|||A.5 — Tuần 2 → Tuần 9: kế hoạch và các buổi thầy kiểm tra',
  slug: 'swr302-assignment-ke-hoach-tuan',
  type: 'DOCUMENT',
  description: 'Kế hoạch tám tuần: mỗi tuần làm gì, ai làm, nộp gì ở cuối tuần — cộng ngân hàng câu hỏi thầy hay gọi hỏi bất chợt từ tuần 2 đến tuần 9, kèm dạng câu trả lời đạt.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.5 · Schedule</span>
<h2>Eight weeks, and someone will ask you where you are</h2>
<p class="lead">The topic is issued at the start of <strong>Week 2</strong> and presented in <strong>Week 9</strong>. Between those two dates the lecturer calls teams — <em>unannounced</em> — to check progress and ask questions about the work and how it was done. Those check-ins are not a formality: they are how the lecturer discovers whether five people did the project or one person did.</p>

<h3>The eight-week plan</h3>
<table>
  <thead><tr><th>Week</th><th>Focus</th><th>Who is busy</th><th>What exists by Friday</th></tr></thead>
  <tbody>
    <tr><td><strong>2</strong></td><td>Topic issued. Read the brief, form the team, assign roles. Run the first elicitation session. Agree the glossary and the shared fact sheet of numbers</td><td>All five</td><td>Role assignment, glossary v0.1, fact sheet v0.1, interview 1 notes</td></tr>
    <tr><td><strong>3</strong></td><td>Vision &amp; Scope drafted: background, opportunity, objectives with baselines, success metrics, vision statement. Second elicitation session targeting stakeholders and constraints</td><td>M1 leads; all consulted</td><td><strong>Deliverable 1 draft</strong> (§1 complete, §2–3 outlined)</td></tr>
    <tr><td><strong>4</strong></td><td>Vision &amp; Scope finished — features FE-n, release scope, exclusions, stakeholder profiles, project priorities. Use case list agreed and split between M2 and M3</td><td>M1, M2, M3</td><td><strong>Deliverable 1 baselined</strong>; use case list (14+ names, actors, one-line descriptions)</td></tr>
    <tr><td><strong>5</strong></td><td>Use case specifications written in parallel with business rules. Every flow step that mentions a policy becomes a BR-n. M4 starts harvesting data elements</td><td>M2, M3, M4</td><td>~half the use case specs; business rules v0.1; data dictionary v0.1</td></tr>
    <tr><td><strong>6</strong></td><td>Use cases finished and cross-reviewed (M2 reviews M3, M3 reviews M2). Use case diagram drawn. Rules classified into the five types. M1 starts the SRS skeleton</td><td>M2, M3, M4, M1</td><td><strong>Deliverable 2 complete</strong>, <strong>Deliverable 3 complete</strong>, SRS §1–2 drafted</td></tr>
    <tr><td><strong>7</strong></td><td>SRS system features and quality attributes. Data dictionary finished. Mock-ups for the three complex use cases. M5 starts prioritization against the now-stable feature list</td><td>M1, M4, M5</td><td>SRS §3–6 drafted, <strong>Deliverable 5 complete</strong>, <strong>Deliverable 6 complete</strong>, prioritization v0.1</td></tr>
    <tr><td><strong>8</strong></td><td>SRS finished. Counts collected and fed into the estimation tool. Traceability matrix built. Whole-team review against the six traceability links</td><td>All five</td><td><strong>Deliverables 4, 7, 8 complete</strong>; traceability matrix; all six checks passed</td></tr>
    <tr><td><strong>9</strong></td><td>Presentation. Rehearse with each owner presenting their own deliverable. Prepare for questions, not just slides</td><td>All five</td><td>Submitted package + slides + rehearsed Q&amp;A</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Two things are deliberately early.</strong> The glossary and the fact sheet, both in Week 2. They cost an hour and they are the only defence against the five-vocabularies failure. Everything else follows the dependency chain.</div>

<h3>The check-ins: what the lecturer actually asks</h3>
<p>Questions fall into four families. The first two test the <em>work</em>; the last two test whether the team is real.</p>

<h4>1 · "Where did this come from?" — provenance</h4>
<ul>
  <li><em>"Where did this business objective come from? Show me the sentence in the brief."</em></li>
  <li><em>"This baseline says 3.8% — who told you that, or did you assume it? Where is that recorded?"</em></li>
  <li><em>"Which stakeholder asked for this feature?"</em></li>
</ul>
<p><strong>A passing answer</strong> points at a document: the brief paragraph, the assumption ID in Vision &amp; Scope §1.7, or an interview note with a date. <strong>A failing answer</strong> is "we thought it made sense".</p>

<h4>2 · "Why this and not that?" — decisions</h4>
<ul>
  <li><em>"Why is this in Release 1.0 and that in 1.1?"</em></li>
  <li><em>"You say quality is the driver. What is the degree of freedom then?"</em></li>
  <li><em>"Your priority worksheet puts this feature fourth. Your objectives say it is the most important. Which one is wrong?"</em></li>
  <li><em>"Why did you exclude this from scope?"</em></li>
</ul>
<p><strong>A passing answer</strong> names a trade-off and what was given up. <strong>A failing answer</strong> is "because it's less important" with nothing behind it.</p>

<h4>3 · "Explain this properly" — understanding</h4>
<ul>
  <li><em>"What is the difference between an alternative flow and an exception? Show me one of each in your document."</em></li>
  <li><em>"Classify this rule. Why is it a constraint and not an action enabler?"</em></li>
  <li><em>"Is this a business requirement, a user requirement or a system requirement?"</em></li>
  <li><em>"This quality attribute says 'the system shall be fast'. Rewrite it now."</em></li>
  <li><em>"Your use case says the system shall verify prerequisites. Where is the rule that defines what a prerequisite is?"</em></li>
</ul>
<p>These are the questions that map to the Progress Tests and the Practical Exam. Being asked one at a check-in is free exam practice.</p>

<h4>4 · "Who did what?" — the team</h4>
<ul>
  <li><em>"Who wrote this section? Let them answer."</em></li>
  <li><em>"What is your role, and what did you deliver last week?"</em></li>
  <li><em>"Show me your meeting minutes."</em></li>
  <li><em>"What changed since last time, and why?"</em></li>
</ul>
<div class="callout warn"><strong>This is the family that catches teams out.</strong> If four members cannot describe their own contribution, the lecturer has learned everything they needed to know about how the marks should be distributed. The counter-measure is not rehearsal — it is actually dividing the work in Week 2 and keeping the log.</div>

<h3>The five-minute check-in kit</h3>
<p>Keep these five things ready at all times from Week 3 onward. Any of them can be requested without warning:</p>
<ol>
  <li>The <strong>current version</strong> of every document, with the revision history table filled in.</li>
  <li>The <strong>decision log</strong> — date, decision, who decided, why.</li>
  <li>The <strong>elicitation notes</strong> — session date, who played which stakeholder, the question list.</li>
  <li>The <strong>open issues / TBD list</strong> — an honest one. A project with zero open issues in Week 5 is a project nobody is thinking about.</li>
  <li>A <strong>one-sentence status per deliverable</strong>: not started / drafted / reviewed / baselined.</li>
</ol>
<div class="note-ct">Point 4 is counter-intuitive and worth taking seriously. Wiegers treats the <strong>TBD list</strong> as a normal part of an SRS — unresolved items are recorded, assigned an owner and a target date, not hidden. Showing a tracked TBD list at a check-in demonstrates requirements <em>management</em>, which is CLO9.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.5 · Lịch trình</span>
<h2>Tám tuần, và sẽ có người hỏi bạn đang ở đâu</h2>
<p class="lead">Đề tài được giao đầu <strong>tuần 2</strong> và thuyết trình ở <strong>tuần 9</strong>. Giữa hai mốc đó thầy sẽ gọi các nhóm — <em>bất chợt</em> — để kiểm tra tiến độ và hỏi về bài làm cùng cách làm. Những buổi kiểm tra đó không phải thủ tục: đó là cách thầy phát hiện dự án do năm người làm hay do một người làm.</p>

<h3>Kế hoạch tám tuần</h3>
<table>
  <thead><tr><th>Tuần</th><th>Trọng tâm</th><th>Ai bận</th><th>Cuối tuần phải có</th></tr></thead>
  <tbody>
    <tr><td><strong>2</strong></td><td>Nhận đề. Đọc đề, lập nhóm, phân vai. Chạy buổi elicitation đầu tiên. Thống nhất glossary và bảng số liệu dùng chung</td><td>Cả năm</td><td>Bảng phân vai, glossary v0.1, bảng số liệu v0.1, biên bản phỏng vấn 1</td></tr>
    <tr><td><strong>3</strong></td><td>Nháp Vision &amp; Scope: bối cảnh, cơ hội, mục tiêu có baseline, thước đo thành công, tuyên bố tầm nhìn. Buổi elicitation thứ hai nhắm vào stakeholder và ràng buộc</td><td>TV1 dẫn; cả nhóm được hỏi ý</td><td><strong>Bản nháp Deliverable 1</strong> (§1 xong, §2–3 có dàn ý)</td></tr>
    <tr><td><strong>4</strong></td><td>Hoàn tất Vision &amp; Scope — feature FE-n, phạm vi bản phát hành, loại trừ, hồ sơ stakeholder, ưu tiên dự án. Chốt danh sách use case và chia cho TV2, TV3</td><td>TV1, TV2, TV3</td><td><strong>Deliverable 1 baseline</strong>; danh sách use case (14+ tên, actor, mô tả một dòng)</td></tr>
    <tr><td><strong>5</strong></td><td>Viết đặc tả use case song song với business rule. Mỗi bước luồng nhắc tới một chính sách thì thành một BR-n. TV4 bắt đầu gom phần tử dữ liệu</td><td>TV2, TV3, TV4</td><td>~nửa số đặc tả use case; business rule v0.1; data dictionary v0.1</td></tr>
    <tr><td><strong>6</strong></td><td>Xong use case và review chéo (TV2 review TV3, TV3 review TV2). Vẽ use case diagram. Phân loại rule vào năm loại. TV1 bắt đầu khung SRS</td><td>TV2, TV3, TV4, TV1</td><td><strong>Deliverable 2 xong</strong>, <strong>Deliverable 3 xong</strong>, nháp SRS §1–2</td></tr>
    <tr><td><strong>7</strong></td><td>Phần System Features và Quality Attributes của SRS. Xong data dictionary. Mock-up cho ba use case phức tạp. TV5 bắt đầu xếp ưu tiên trên danh sách feature đã ổn định</td><td>TV1, TV4, TV5</td><td>Nháp SRS §3–6, <strong>Deliverable 5 xong</strong>, <strong>Deliverable 6 xong</strong>, bảng ưu tiên v0.1</td></tr>
    <tr><td><strong>8</strong></td><td>Xong SRS. Thu số đếm và nạp vào công cụ ước lượng. Dựng ma trận truy vết. Cả nhóm rà theo sáu liên kết truy vết</td><td>Cả năm</td><td><strong>Deliverable 4, 7, 8 xong</strong>; ma trận truy vết; sáu phép kiểm đều đạt</td></tr>
    <tr><td><strong>9</strong></td><td>Thuyết trình. Tổng duyệt với từng chủ sở hữu trình bày deliverable của mình. Chuẩn bị cho phần hỏi, không chỉ cho slide</td><td>Cả năm</td><td>Bộ tài liệu đã nộp + slide + đã tập phần hỏi đáp</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Hai thứ được đặt sớm một cách có chủ đích.</strong> Glossary và bảng số liệu, đều ở tuần 2. Chúng tốn một tiếng và là phòng tuyến duy nhất chống kiểu hỏng "năm bộ từ vựng". Mọi thứ còn lại đi theo chuỗi phụ thuộc.</div>

<h3>Các buổi kiểm tra: thầy thật sự hỏi gì</h3>
<p>Câu hỏi rơi vào bốn nhóm. Hai nhóm đầu kiểm tra <em>bài làm</em>; hai nhóm sau kiểm tra nhóm có thật hay không.</p>

<h4>1 · "Cái này ở đâu ra?" — nguồn gốc</h4>
<ul>
  <li><em>"Mục tiêu nghiệp vụ này ở đâu ra? Chỉ cho thầy câu trong đề bài."</em></li>
  <li><em>"Baseline ghi 3,8% — ai nói với em con số đó, hay em tự giả định? Ghi ở chỗ nào?"</em></li>
  <li><em>"Stakeholder nào yêu cầu tính năng này?"</em></li>
</ul>
<p><strong>Câu trả lời đạt</strong> chỉ vào một tài liệu: đoạn văn trong đề, mã giả định ở Vision &amp; Scope §1.7, hoặc một biên bản phỏng vấn có ngày. <strong>Câu trả lời trượt</strong> là "bọn em thấy hợp lý".</p>

<h4>2 · "Vì sao chọn cái này mà không phải cái kia?" — quyết định</h4>
<ul>
  <li><em>"Vì sao cái này ở bản 1.0 còn cái kia ở 1.1?"</em></li>
  <li><em>"Em nói chất lượng là driver. Vậy degree of freedom là gì?"</em></li>
  <li><em>"Bảng ưu tiên xếp tính năng này thứ tư. Mục tiêu của em lại nói nó quan trọng nhất. Cái nào sai?"</em></li>
  <li><em>"Vì sao em loại cái này khỏi phạm vi?"</em></li>
</ul>
<p><strong>Câu trả lời đạt</strong> gọi tên một sự đánh đổi và nói đã hy sinh cái gì. <strong>Câu trả lời trượt</strong> là "vì nó ít quan trọng hơn" mà không có gì phía sau.</p>

<h4>3 · "Giải thích cho đúng" — hiểu biết</h4>
<ul>
  <li><em>"Khác nhau giữa luồng thay thế và ngoại lệ là gì? Chỉ cho thầy mỗi loại một cái trong tài liệu của em."</em></li>
  <li><em>"Phân loại rule này đi. Vì sao nó là constraint mà không phải action enabler?"</em></li>
  <li><em>"Đây là business requirement, user requirement hay system requirement?"</em></li>
  <li><em>"Thuộc tính chất lượng này ghi 'hệ thống phải nhanh'. Viết lại ngay bây giờ."</em></li>
  <li><em>"Use case của em nói hệ thống sẽ kiểm môn tiên quyết. Rule định nghĩa thế nào là môn tiên quyết nằm ở đâu?"</em></li>
</ul>
<p>Đây chính là những câu ánh xạ sang Progress Test và Practical Exam. Bị hỏi một câu ở buổi kiểm tra là được luyện thi miễn phí.</p>

<h4>4 · "Ai làm gì?" — về nhóm</h4>
<ul>
  <li><em>"Ai viết mục này? Để bạn đó trả lời."</em></li>
  <li><em>"Vai của em là gì, và tuần trước em nộp cái gì?"</em></li>
  <li><em>"Cho thầy xem biên bản họp."</em></li>
  <li><em>"Từ lần trước tới giờ có gì thay đổi, và vì sao?"</em></li>
</ul>
<div class="callout warn"><strong>Đây là nhóm câu hỏi bắt bài các nhóm.</strong> Nếu bốn thành viên không mô tả nổi đóng góp của chính mình, thầy đã biết đủ mọi thứ cần biết để chia điểm. Cách chặn không phải là tập dượt — mà là thật sự chia việc từ tuần 2 và giữ nhật ký.</div>

<h3>Bộ đồ nghề năm phút cho buổi kiểm tra</h3>
<p>Luôn sẵn năm thứ này từ tuần 3 trở đi. Bất kỳ cái nào cũng có thể bị đòi mà không báo trước:</p>
<ol>
  <li><strong>Bản hiện hành</strong> của mọi tài liệu, đã điền bảng lịch sử sửa đổi.</li>
  <li><strong>Nhật ký quyết định</strong> — ngày, quyết định gì, ai quyết, vì sao.</li>
  <li><strong>Biên bản elicitation</strong> — ngày họp, ai đóng vai stakeholder nào, danh sách câu hỏi.</li>
  <li><strong>Danh sách vấn đề mở / TBD</strong> — một danh sách trung thực. Một dự án có không vấn đề mở nào ở tuần 5 là dự án chẳng ai suy nghĩ về nó.</li>
  <li><strong>Một câu trạng thái cho mỗi deliverable</strong>: chưa bắt đầu / đã nháp / đã review / đã baseline.</li>
</ol>
<div class="note-ct">Điểm 4 nghe ngược đời nhưng đáng coi trọng. Wiegers coi <strong>danh sách TBD</strong> là một phần bình thường của SRS — những mục chưa giải quyết được ghi lại, gán người phụ trách và ngày mục tiêu, chứ không giấu đi. Trình ra một danh sách TBD có theo dõi ở buổi kiểm tra là đang thể hiện <em>quản lý</em> yêu cầu, tức CLO9.</div>
`,
    ),
  ].join('\n'),
};

/* ─────────── A.9 — worked example ─────────── */
const A9 = {
  title: 'A.9 — Worked example: one package, end to end (TP2)|||A.9 — Bài mẫu: một bộ tài liệu, từ đầu đến cuối (TP2)',
  slug: 'swr302-assignment-bai-mau',
  type: 'DOCUMENT',
  description: 'Trích đoạn thật của cả tám deliverable cho một hệ thống TP2 tưởng tượng (OMFS của Nova Retail Group): objective, use case, business rule, functional requirement, mục data dictionary, bảng ưu tiên và ba con số ước lượng — để thấy "đạt" trông như thế nào.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.9 · Worked example</span>
<h2>What a passing package looks like</h2>
<p class="lead">Below are real extracts from one consistent package built on TP2. The case company is invented — <strong>Nova Retail Group (NRG)</strong>, five brands, four sales channels, three fulfillment centers, four 3PL carriers — and the product is the <strong>Order Management and Fulfillment System (OMFS)</strong>. Follow one thread through all eight documents and the traceability becomes obvious.</p>

<h3>① Vision &amp; Scope — a business objective that earns marks</h3>
<div class="callout">
<p><strong>BO-1</strong> — Reduce the oversell rate by synchronizing inventory across all sales channels in near real time.<br>
Baseline (Q2 2026): <strong>3.8% of orders</strong> · Target: <strong>≤ 0.5% of orders</strong> · Deadline: <strong>6 months after Release 1.0</strong></p>
<p><strong>Success metric</strong> — (orders cancelled or short-shipped for insufficient stock ÷ total orders) × 100, from OMFS order and exception records, reported weekly.</p>
</div>
<p>Note the three parts: a number you started from, a number you are going for, and a date. Note also that the metric states <em>where the data comes from</em> — without that, nobody can ever prove the objective was met.</p>

<h3>② Use case — the spec rows that matter</h3>
<div class="callout">
<p><strong>UC-03 · Reserve inventory</strong> — Primary actor: OMFS (system) · Secondary: Inventory Controller<br>
<strong>Trigger:</strong> an order passes validation in UC-02.<br>
<strong>PRE-1:</strong> the order has at least one order line. <strong>PRE-2:</strong> every SKU on the order exists in the item master.<br>
<strong>POST-1:</strong> stock is reserved for every line, or the order is marked Backordered and no partial reservation remains.<br>
<strong>Normal flow 3.0:</strong> 1. System computes ATP per SKU per fulfillment center. 2. System reserves the requested quantity at the centre with the highest ATP. 3. System records the reservation with a 30-minute expiry. 4. System sets order status to Reserved.<br>
<strong>Alternative flow 3.1:</strong> no single centre has full ATP → the system reserves across two centres and flags the order for splitting in UC-04.<br>
<strong>Exception 3.0.E1:</strong> total ATP across all centres &lt; requested quantity → the system reserves nothing, sets status to Backordered, and raises an exception for UC-10.<br>
<strong>Exception 3.0.E2:</strong> the reservation expires before payment authorization → the system releases the stock and reverts the order to Pending.<br>
<strong>Business Rules:</strong> BR-02, BR-04, BR-07 · <strong>Frequency of use:</strong> 4,500/day average, 18,000/day peak</p>
</div>
<div class="callout ok"><strong>Why this scores.</strong> There are two exceptions, not zero. The postcondition forbids a half-finished state. The business rules are IDs, not text. And the frequency is a real number that will justify a performance quality attribute later.</div>

<h3>③ Business rules — one of each type, and the one that does the work</h3>
<table>
  <thead><tr><th>ID</th><th>Rule</th><th>Type</th><th>Static/Dynamic</th><th>Source</th></tr></thead>
  <tbody>
    <tr><td>BR-01</td><td>An order line is fulfilled from exactly one fulfillment center.</td><td>Fact</td><td>Static</td><td>Fulfillment Manager</td></tr>
    <tr><td>BR-02</td><td>Stock may be reserved for an order line only when ATP ≥ the requested quantity.</td><td>Constraint</td><td>Static</td><td>Inventory Controller</td></tr>
    <tr><td>BR-04</td><td>If payment is not authorized within 30 minutes of reservation, the reservation is released.</td><td>Action enabler</td><td>Dynamic</td><td>Finance policy</td></tr>
    <tr><td>BR-07</td><td>ATP = on-hand − reserved − damaged − safety stock.</td><td>Computation</td><td>Dynamic</td><td>Inventory Controller</td></tr>
    <tr><td>BR-09</td><td>An order is "at risk" when promised delivery date − today &lt; carrier transit time.</td><td>Inference</td><td>Dynamic</td><td>Logistics Manager</td></tr>
  </tbody>
</table>
<p>BR-07 is the rule that actually solves the oversell problem — and notice it is a <em>computation</em>, not a constraint. Teams that write only "inventory must be accurate" have described the symptom, not the mechanism.</p>

<h3>④ SRS — functional requirements derived from UC-03</h3>
<div class="callout">
<p><strong>3.3 Inventory Reservation</strong> — Priority: High. Realizes FE-3. Traces to UC-03.</p>
<p><strong>Reserve-1:</strong> The system shall compute available-to-promise per SKU per fulfillment center using the formula in BR-07 whenever on-hand, reserved, damaged or safety-stock quantities change.<br>
<strong>Reserve-2:</strong> The system shall reserve stock for an order line only when available-to-promise for that SKU at the selected fulfillment center is greater than or equal to the ordered quantity (BR-02).<br>
<strong>Reserve-3:</strong> The system shall release a reservation that has not been confirmed by payment authorization within 30 minutes of its creation (BR-04).<br>
<strong>Reserve-4:</strong> When total available-to-promise across all fulfillment centers is less than the ordered quantity, the system shall reserve no stock for that line and shall set the order status to Backordered.</p>
</div>
<p>Each one: one actor, one observable behaviour, a condition, and the rule it enforces referenced by ID. A tester can write a pass/fail case from every sentence.</p>

<h3>⑤ Data dictionary — the notation in use</h3>
<table>
  <thead><tr><th>Data Element</th><th>Description</th><th>Composition or Data Type</th><th>Length</th><th>Values</th></tr></thead>
  <tbody>
    <tr><td>Available To Promise</td><td>Quantity of a SKU that can be promised to a new order at one fulfillment center</td><td>integer</td><td>6</td><td>≥ 0; computed per BR-07</td></tr>
    <tr><td>Order</td><td>A customer purchase received from one sales channel</td><td>Order ID + Channel ID + Order Date + Customer + Ship-To Address + Order Status + 1:n{Order Line}</td><td></td><td></td></tr>
    <tr><td>Order Status</td><td>Current position of the order in the fulfillment lifecycle</td><td>alphabetic</td><td>16</td><td>[ Pending | Reserved | Backordered | Routed | Picking | Packed | Shipped | Delivered | Cancelled ]</td></tr>
    <tr><td>Reservation</td><td>A hold placed on stock for one order line</td><td>Reservation ID + SKU + Fulfillment Center ID + Quantity + Created At + Expires At</td><td></td><td></td></tr>
  </tbody>
</table>
<p>Structures have blank Length and Values. Every element named inside a structure — Order Line, Customer, SKU — has its own entry elsewhere in the dictionary, alphabetically ordered.</p>

<h3>⑥ Mock-ups — the three chosen, and why</h3>
<ul>
  <li><strong>UC-04 routing workbench</strong> — 4 alternative flows, 3 exceptions, 2 actors. The highest-decision screen in the system.</li>
  <li><strong>UC-07 carrier rate shopping</strong> — the comparison table plus the rule that picked a winner; a stakeholder will immediately argue with the ranking, which is exactly what a mock-up is for.</li>
  <li><strong>UC-10 exception console</strong> — a queue with four exception types and different resolutions each; impossible to describe in prose.</li>
</ul>

<h3>⑦ Prioritization — the top of the sorted worksheet</h3>
<p>Weights used: benefit 2, penalty 1, cost 1, risk 0.5 — <em>"benefit is weighted double because the sponsor's business case rests on growth, not on risk avoidance."</em></p>
<table>
  <thead><tr><th>Feature</th><th>Benefit</th><th>Penalty</th><th>Cost</th><th>Risk</th><th>Priority</th></tr></thead>
  <tbody>
    <tr><td>FE-10 Self-service order tracking</td><td>7</td><td>6</td><td>3</td><td>2</td><td><strong>1.094</strong></td></tr>
    <tr><td>FE-2 Order screening &amp; validation</td><td>6</td><td>7</td><td>3</td><td>2</td><td>1.039</td></tr>
    <tr><td>FE-6 Pick wave generation</td><td>6</td><td>5</td><td>3</td><td>2</td><td>0.929</td></tr>
    <tr><td>FE-12 Cancel or modify an order</td><td>5</td><td>7</td><td>3</td><td>3</td><td>0.816</td></tr>
    <tr><td>…</td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>FE-3 Real-time inventory &amp; ATP <em>(rank 6 of 13)</em></td><td>9</td><td>9</td><td>6</td><td>5</td><td>0.690</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Read that table properly.</strong> FE-10 scores the <em>highest</em> priority — cheap, low risk, solid value. But Release 1.0 ships FE-3, FE-4 and FE-5 instead, because self-service tracking is worthless while order status is still wrong. The worksheet is an input to the release decision, <strong>not the decision</strong>. Saying so in one sentence beneath the table is what turns a mechanical exercise into analysis.</div>

<h3>⑧ Estimation — three numbers and a commitment</h3>
<p>Inputs: budget USD 1,200,000 · BA blended cost USD 125/h · Standard project · 12 developers · remote team · 44-week project · 16-week requirements phase · <strong>14 use cases · 20 screens · 7 reports · 12 interfacing systems</strong> (all counted from deliverables 2, 4 and 6 — not guessed).</p>
<table>
  <thead><tr><th>Method</th><th>Number of BAs</th><th>BA budget, requirements phase</th></tr></thead>
  <tbody>
    <tr><td>A · 15% of total budget</td><td>2.25</td><td>USD 180,000</td></tr>
    <tr><td>B · 6 developers per BA</td><td>2.00</td><td>USD 160,000</td></tr>
    <tr><td>C · Activity-based, 1,097 h (+10% remote buffer)</td><td><strong>1.71</strong></td><td>USD 137,000</td></tr>
  </tbody>
</table>
<p><strong>The commitment:</strong> <em>"We staff 2 BAs, at USD 160,000 for the requirements phase. Method C is the most grounded of the three — its counts come from our own documents — but it prices artifacts, not the four elicitation sessions, the peer inspections or the change control that runs from the Week-8 baseline to release. Rounding 1.71 up to 2 absorbs that work, and it coincides with Method B. We would escalate to 2.25 if three or more items are still open on the SRS TBD list at Week 10."</em></p>
<p>Note the surprise worth explaining: the activity-based method came out <strong>lowest</strong>, not highest. OMFS has modest artifact counts (14 use cases, 20 screens) but twelve interfacing systems — and the activity model prices use cases and screens heavily while pricing conversations not at all. A team that reports three numbers without noticing which one is out of line, and why, has filled in a spreadsheet rather than estimated anything.</p>
<div class="callout ok">That last sentence — <em>what would change our mind</em> — is the difference between filling in a spreadsheet and doing estimation.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.9 · Bài mẫu</span>
<h2>Một bộ tài liệu đạt trông như thế nào</h2>
<p class="lead">Dưới đây là trích đoạn thật từ một bộ tài liệu nhất quán làm trên TP2. Công ty là hư cấu — <strong>Nova Retail Group (NRG)</strong>, năm thương hiệu, bốn kênh bán, ba trung tâm hoàn tất, bốn hãng 3PL — và sản phẩm là <strong>Hệ thống Quản lý Đơn hàng &amp; Hoàn tất đơn (OMFS)</strong>. Hãy theo một sợi chỉ xuyên qua cả tám tài liệu, tính truy vết sẽ hiện ra rõ ràng.</p>

<h3>① Vision &amp; Scope — một business objective ăn điểm</h3>
<div class="callout">
<p><strong>BO-1</strong> — Giảm tỉ lệ bán vượt bằng cách đồng bộ tồn kho giữa mọi kênh bán gần thời gian thực.<br>
Baseline (Q2/2026): <strong>3,8% số đơn</strong> · Mục tiêu: <strong>≤ 0,5% số đơn</strong> · Hạn: <strong>6 tháng sau bản 1.0</strong></p>
<p><strong>Thước đo thành công</strong> — (số đơn bị huỷ hoặc giao thiếu vì không đủ hàng ÷ tổng số đơn) × 100, lấy từ bản ghi đơn hàng và ngoại lệ của OMFS, báo cáo hàng tuần.</p>
</div>
<p>Để ý ba phần: con số xuất phát, con số nhắm tới, và một cái hạn. Cũng để ý thước đo nói rõ <em>dữ liệu lấy từ đâu</em> — thiếu điều đó thì chẳng ai chứng minh được mục tiêu đã đạt.</p>

<h3>② Use case — những dòng đặc tả thực sự quan trọng</h3>
<div class="callout">
<p><strong>UC-03 · Giữ chỗ tồn kho</strong> — Actor chính: OMFS (hệ thống) · Phụ: Kiểm soát tồn kho<br>
<strong>Trigger:</strong> một đơn hàng qua được bước kiểm tra hợp lệ ở UC-02.<br>
<strong>PRE-1:</strong> đơn có ít nhất một dòng hàng. <strong>PRE-2:</strong> mọi SKU trên đơn đều tồn tại trong danh mục hàng.<br>
<strong>POST-1:</strong> mọi dòng đều được giữ chỗ, hoặc đơn được đánh dấu Backordered và không còn phần giữ chỗ dở dang nào.<br>
<strong>Luồng chính 3.0:</strong> 1. Hệ thống tính ATP theo từng SKU từng trung tâm. 2. Hệ thống giữ chỗ số lượng yêu cầu tại trung tâm có ATP cao nhất. 3. Hệ thống ghi nhận giữ chỗ với hạn 30 phút. 4. Hệ thống đặt trạng thái đơn thành Reserved.<br>
<strong>Luồng thay thế 3.1:</strong> không trung tâm nào đủ ATP → hệ thống giữ chỗ ở hai trung tâm và gắn cờ tách đơn cho UC-04.<br>
<strong>Ngoại lệ 3.0.E1:</strong> tổng ATP mọi trung tâm &lt; số lượng yêu cầu → hệ thống không giữ chỗ gì, đặt trạng thái Backordered, và phát sinh ngoại lệ cho UC-10.<br>
<strong>Ngoại lệ 3.0.E2:</strong> giữ chỗ hết hạn trước khi thanh toán được duyệt → hệ thống nhả hàng và đưa đơn về Pending.<br>
<strong>Business Rules:</strong> BR-02, BR-04, BR-07 · <strong>Tần suất dùng:</strong> 4.500/ngày trung bình, 18.000/ngày cao điểm</p>
</div>
<div class="callout ok"><strong>Vì sao cái này được điểm.</strong> Có hai ngoại lệ, không phải không có cái nào. Postcondition cấm trạng thái dở dang. Business rule ghi bằng ID, không phải nội dung. Và tần suất là con số thật, sau này sẽ biện minh cho một thuộc tính chất lượng về hiệu năng.</div>

<h3>③ Business rule — mỗi loại một cái, và cái thực sự làm việc</h3>
<table>
  <thead><tr><th>ID</th><th>Rule</th><th>Loại</th><th>Tĩnh/Động</th><th>Nguồn</th></tr></thead>
  <tbody>
    <tr><td>BR-01</td><td>Một dòng đơn hàng được hoàn tất từ đúng một trung tâm hoàn tất.</td><td>Fact</td><td>Static</td><td>Quản lý hoàn tất đơn</td></tr>
    <tr><td>BR-02</td><td>Chỉ được giữ chỗ tồn kho cho một dòng hàng khi ATP ≥ số lượng yêu cầu.</td><td>Constraint</td><td>Static</td><td>Kiểm soát tồn kho</td></tr>
    <tr><td>BR-04</td><td>Nếu thanh toán không được duyệt trong 30 phút kể từ lúc giữ chỗ, phần giữ chỗ được nhả ra.</td><td>Action enabler</td><td>Dynamic</td><td>Chính sách tài chính</td></tr>
    <tr><td>BR-07</td><td>ATP = tồn thực − đã giữ chỗ − hỏng − tồn an toàn.</td><td>Computation</td><td>Dynamic</td><td>Kiểm soát tồn kho</td></tr>
    <tr><td>BR-09</td><td>Một đơn ở trạng thái "rủi ro" khi ngày hứa giao − hôm nay &lt; thời gian vận chuyển của hãng.</td><td>Inference</td><td>Dynamic</td><td>Quản lý vận chuyển</td></tr>
  </tbody>
</table>
<p>BR-07 mới là rule thực sự giải quyết bài toán bán vượt — và để ý nó là <em>computation</em>, không phải constraint. Nhóm chỉ viết "tồn kho phải chính xác" là đang mô tả triệu chứng, không phải cơ chế.</p>

<h3>④ SRS — functional requirement suy ra từ UC-03</h3>
<div class="callout">
<p><strong>3.3 Giữ chỗ tồn kho</strong> — Độ ưu tiên: Cao. Hiện thực FE-3. Truy về UC-03.</p>
<p><strong>Reserve-1:</strong> The system shall compute available-to-promise per SKU per fulfillment center using the formula in BR-07 whenever on-hand, reserved, damaged or safety-stock quantities change.<br>
<strong>Reserve-2:</strong> The system shall reserve stock for an order line only when available-to-promise for that SKU at the selected fulfillment center is greater than or equal to the ordered quantity (BR-02).<br>
<strong>Reserve-3:</strong> The system shall release a reservation that has not been confirmed by payment authorization within 30 minutes of its creation (BR-04).<br>
<strong>Reserve-4:</strong> When total available-to-promise across all fulfillment centers is less than the ordered quantity, the system shall reserve no stock for that line and shall set the order status to Backordered.</p>
</div>
<p>Mỗi câu: một actor, một hành vi quan sát được, một điều kiện, và rule nó thực thi được trỏ bằng ID. Tester viết được ca kiểm thử đạt/trượt từ mọi câu.</p>

<h3>⑤ Data dictionary — ký pháp khi dùng thật</h3>
<table>
  <thead><tr><th>Data Element</th><th>Mô tả</th><th>Composition or Data Type</th><th>Length</th><th>Values</th></tr></thead>
  <tbody>
    <tr><td>Available To Promise</td><td>Số lượng của một SKU có thể hứa cho đơn mới tại một trung tâm hoàn tất</td><td>integer</td><td>6</td><td>≥ 0; tính theo BR-07</td></tr>
    <tr><td>Order</td><td>Một đơn mua của khách nhận từ một kênh bán</td><td>Order ID + Channel ID + Order Date + Customer + Ship-To Address + Order Status + 1:n{Order Line}</td><td></td><td></td></tr>
    <tr><td>Order Status</td><td>Vị trí hiện tại của đơn trong vòng đời hoàn tất</td><td>alphabetic</td><td>16</td><td>[ Pending | Reserved | Backordered | Routed | Picking | Packed | Shipped | Delivered | Cancelled ]</td></tr>
    <tr><td>Reservation</td><td>Một lượt giữ chỗ tồn kho cho một dòng đơn hàng</td><td>Reservation ID + SKU + Fulfillment Center ID + Quantity + Created At + Expires At</td><td></td><td></td></tr>
  </tbody>
</table>
<p>Cấu trúc thì để trống Length và Values. Mọi phần tử được gọi tên bên trong một cấu trúc — Order Line, Customer, SKU — đều có mục riêng ở chỗ khác trong từ điển, xếp theo bảng chữ cái.</p>

<h3>⑥ Mock-up — ba cái được chọn, và vì sao</h3>
<ul>
  <li><strong>UC-04 bàn làm việc định tuyến</strong> — 4 luồng thay thế, 3 ngoại lệ, 2 actor. Màn hình nhiều quyết định nhất hệ thống.</li>
  <li><strong>UC-07 so giá hãng vận chuyển</strong> — bảng so sánh cộng rule đã chọn ra người thắng; stakeholder sẽ lập tức cãi về thứ hạng, mà đó đúng là việc mock-up sinh ra để làm.</li>
  <li><strong>UC-10 bảng ngoại lệ</strong> — một hàng đợi bốn loại ngoại lệ, mỗi loại xử lý khác nhau; không thể diễn đạt bằng văn xuôi.</li>
</ul>

<h3>⑦ Xếp ưu tiên — phần đầu bảng đã sắp</h3>
<p>Trọng số dùng: benefit 2, penalty 1, cost 1, risk 0,5 — <em>"benefit được nhân đôi vì bài toán kinh doanh của nhà tài trợ đặt trên tăng trưởng, không phải trên né rủi ro."</em></p>
<table>
  <thead><tr><th>Tính năng</th><th>Benefit</th><th>Penalty</th><th>Cost</th><th>Risk</th><th>Priority</th></tr></thead>
  <tbody>
    <tr><td>FE-10 Tra cứu đơn tự phục vụ</td><td>7</td><td>6</td><td>3</td><td>2</td><td><strong>1,094</strong></td></tr>
    <tr><td>FE-2 Sàng lọc &amp; kiểm tra đơn</td><td>6</td><td>7</td><td>3</td><td>2</td><td>1,039</td></tr>
    <tr><td>FE-6 Sinh đợt lấy hàng</td><td>6</td><td>5</td><td>3</td><td>2</td><td>0,929</td></tr>
    <tr><td>FE-12 Huỷ hoặc sửa đơn</td><td>5</td><td>7</td><td>3</td><td>3</td><td>0,816</td></tr>
    <tr><td>…</td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>FE-3 Tồn kho &amp; ATP thời gian thực <em>(hạng 6/13)</em></td><td>9</td><td>9</td><td>6</td><td>5</td><td>0,690</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Hãy đọc bảng đó cho đúng.</strong> FE-10 đạt priority <em>cao nhất</em> — rẻ, ít rủi ro, giá trị chắc. Nhưng bản 1.0 lại ship FE-3, FE-4 và FE-5, vì tra cứu tự phục vụ vô giá trị khi trạng thái đơn vẫn còn sai. Bảng này là <strong>đầu vào</strong> cho quyết định phát hành, <strong>không phải quyết định</strong>. Viết được điều đó thành một câu bên dưới bảng chính là thứ biến một bài tập máy móc thành phân tích.</div>

<h3>⑧ Ước lượng — ba con số và một cam kết</h3>
<p>Đầu vào: ngân sách 1.200.000 USD · chi phí BA 125 USD/giờ · dự án Standard · 12 lập trình viên · đội làm từ xa · dự án 44 tuần · giai đoạn yêu cầu 16 tuần · <strong>14 use case · 20 màn hình · 7 báo cáo · 12 hệ thống giao tiếp</strong> (đếm thật từ deliverable 2, 4 và 6 — không đoán).</p>
<table>
  <thead><tr><th>Cách</th><th>Số BA</th><th>Ngân sách BA, giai đoạn yêu cầu</th></tr></thead>
  <tbody>
    <tr><td>A · 15% tổng ngân sách</td><td>2,25</td><td>180.000 USD</td></tr>
    <tr><td>B · 6 lập trình viên một BA</td><td>2,00</td><td>160.000 USD</td></tr>
    <tr><td>C · Theo hoạt động, 1.097 giờ (+10% đệm làm từ xa)</td><td><strong>1,71</strong></td><td>137.000 USD</td></tr>
  </tbody>
</table>
<p><strong>Cam kết:</strong> <em>"Chúng tôi bố trí 2 BA, ngân sách 160.000 USD cho giai đoạn yêu cầu. Cách C bám đất nhất trong ba cách — số đếm của nó lấy từ chính tài liệu của chúng tôi — nhưng nó định giá sản phẩm làm ra, chứ không định giá bốn buổi elicitation, các lượt review chéo hay việc kiểm soát thay đổi chạy từ mốc baseline tuần 8 tới lúc phát hành. Làm tròn 1,71 lên 2 là để hấp thụ phần việc đó, và nó trùng với cách B. Chúng tôi sẽ nâng lên 2,25 nếu tới tuần 10 danh sách TBD của SRS vẫn còn từ ba mục trở lên."</em></p>
<p>Để ý điều bất ngờ đáng giải thích: cách theo hoạt động lại ra <strong>thấp nhất</strong>, không phải cao nhất. OMFS có số sản phẩm khiêm tốn (14 use case, 20 màn hình) nhưng tới mười hai hệ thống giao tiếp — mà mô hình hoạt động định giá use case và màn hình rất nặng, còn các cuộc trao đổi thì không tính đồng nào. Một nhóm báo ba con số mà không nhận ra con nào lệch và vì sao, là nhóm đã điền bảng tính chứ chưa ước lượng gì cả.</p>
<div class="callout ok">Câu cuối đó — <em>điều gì sẽ khiến chúng tôi đổi ý</em> — chính là khác biệt giữa điền một bảng tính và làm ước lượng.</div>
`,
    ),
  ].join('\n'),
};

/* ─────────── A.10 — presentation & self-check ─────────── */
const A10 = {
  title: 'A.10 — Week 9 presentation & the pre-submission self-check|||A.10 — Thuyết trình tuần 9 & bảng tự kiểm trước khi nộp',
  slug: 'swr302-assignment-thuyet-trinh-va-tu-kiem',
  type: 'DOCUMENT',
  description: 'Cách dựng buổi thuyết trình tuần 9 cho nhóm 5 người, những câu hỏi phản biện chắc chắn bị hỏi, và bảng tự kiểm 30 mục chạy qua trước khi nộp.',
  content: [
    bi(
      `<span class="eyebrow">Assignment · Lesson A.10 · Finish</span>
<h2>The Week 9 presentation</h2>
<p class="lead">You are presenting a <strong>requirements package</strong>, not a product. Nobody expects a demo. What the lecturer is listening for is whether the team understood the <em>problem</em>, made <em>decisions</em>, and can <em>defend</em> them.</p>
<h3>A structure that works for five presenters</h3>
<table>
  <thead><tr><th>Who</th><th>Covers</th><th>The one slide that must exist</th></tr></thead>
  <tbody>
    <tr><td>M1 Leader</td><td>The problem, the business objectives, the scope decision</td><td>Baseline → target → deadline for every objective</td></tr>
    <tr><td>M2 UC-A</td><td>Actors, system boundary, the use case diagram</td><td>The diagram, with the boundary box visible</td></tr>
    <tr><td>M3 UC-B / Rules</td><td>One use case walked end to end, including an exception; the rule taxonomy</td><td>One full use case spec, and one rule of each of the five types</td></tr>
    <tr><td>M4 Data / UX</td><td>The logical data model and the three mock-ups</td><td>A mock-up showing a failure state, not just the happy path</td></tr>
    <tr><td>M5 Planning</td><td>Prioritization, release plan, BA estimation</td><td>The three estimation numbers and which one you committed to</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Do not let one person present everything.</strong> Whatever the slides say, a single-presenter team reads as a single-author project — and the marks follow that reading.</div>
<h3>Questions you will almost certainly be asked</h3>
<ul>
  <li><em>"What is out of scope, and why?"</em> — have the exclusions list on a slide.</li>
  <li><em>"Which requirement would you drop if you lost 30% of the budget?"</em> — this is the prioritization worksheet's whole purpose.</li>
  <li><em>"Show me a requirement that is not testable."</em> — if you have one, admit it and fix it aloud; that scores better than denying it.</li>
  <li><em>"Where does this number come from?"</em> — every number, every time.</li>
  <li><em>"What was the hardest disagreement in your team and how did you resolve it?"</em> — a team with no disagreements did not analyse anything.</li>
</ul>

<h2>The pre-submission self-check</h2>
<p class="lead">Run this the day before submission. Each line is a thing that has cost a real team real marks.</p>
<h3>Cross-document consistency — the six links</h3>
<ol>
  <li>Every FE-n in Vision &amp; Scope §2.1 is realized by ≥ 1 UC-nn.</li>
  <li>Every UC-nn lists its BR-nn rules — by ID, never by pasted text.</li>
  <li>Every SRS functional requirement traces to a UC-nn or FE-n.</li>
  <li>Every noun in a use case flow has a data dictionary entry.</li>
  <li>Every prioritization row is an existing FE-n or UC-nn.</li>
  <li>The estimation counts equal the real contents of deliverables 2, 4 and 6.</li>
</ol>
<h3>Per-deliverable check</h3>
<table>
  <thead><tr><th>#</th><th>Check</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Every objective has baseline + target + deadline · every invented number is in §1.7 Assumptions · §2.4 Exclusions is not empty · §3.2 does not mark all five dimensions as drivers</td></tr>
    <tr><td>2</td><td>≥ 10 use cases · every spec has at least one exception · flows numbered X.0 / X.Y / X.Y.EZ · diagram has a visible boundary box · include/extend arrows point the right way</td></tr>
    <tr><td>3</td><td>At least one rule of each of the five types · every rule marked static or dynamic · every rule has a named source · no rule text duplicated into the SRS</td></tr>
    <tr><td>4</td><td>All template sections present (write "None." rather than deleting) · every requirement uses <em>shall</em> · no "and/or", "etc.", "user-friendly", "fast" · every quality attribute has a number · context diagram in §2.1</td></tr>
    <tr><td>5</td><td>Alphabetical order · structures have blank Length and Values · every element inside a structure has its own entry · notation used correctly (+, ( ), { }, min:max, [ a | b ])</td></tr>
    <tr><td>6</td><td>≥ 3 mock-ups · each tied to a use case ID · at least one failure state shown · realistic sample data, no Lorem ipsum</td></tr>
    <tr><td>7</td><td>Weights stated and justified in one sentence · mandatory items excluded from scoring and listed separately · sorted descending · a sentence reconciling the ranking with the release plan</td></tr>
    <tr><td>8</td><td>Yellow cells only · counts match your documents · all three methods reported · one number committed to, with a reason and a condition that would change it</td></tr>
  </tbody>
</table>
<h3>Presentation-layer check</h3>
<ul>
  <li>Every document has the revision history table filled in, with a version number and a date.</li>
  <li>One glossary, one vocabulary — search for the terms you suspect: does "fulfillment center" ever appear as "warehouse"?</li>
  <li>Page numbers, table of contents, and figure captions that reference their use case IDs.</li>
  <li>Diagrams exported as images <em>and</em> kept as editable source files.</li>
  <li>The traceability matrix is attached. It is the cheapest mark in the whole assignment.</li>
</ul>
<div class="note-ct">One last idea from book Ch.17: before submitting, have each member <strong>review a deliverable they did not write</strong>, using the Requirements Review Checklist in <code>Chapter 17/Requirements Review Checklist.docx</code>. An hour of peer inspection finds more defects than another hour of writing — that is the entire finding of the chapter, and it is free.</div>
`,
      `<span class="eyebrow">Assignment · Bài A.10 · Về đích</span>
<h2>Thuyết trình tuần 9</h2>
<p class="lead">Bạn đang trình bày một <strong>bộ tài liệu yêu cầu</strong>, không phải một sản phẩm. Không ai đòi demo. Thứ thầy lắng nghe là nhóm có hiểu <em>bài toán</em> không, có <em>ra quyết định</em> không, và có <em>bảo vệ</em> được chúng không.</p>
<h3>Một cấu trúc chạy được cho năm người trình bày</h3>
<table>
  <thead><tr><th>Ai</th><th>Nói phần nào</th><th>Slide bắt buộc phải có</th></tr></thead>
  <tbody>
    <tr><td>TV1 Trưởng nhóm</td><td>Bài toán, mục tiêu nghiệp vụ, quyết định phạm vi</td><td>Baseline → mục tiêu → hạn chót cho từng mục tiêu</td></tr>
    <tr><td>TV2 UC-A</td><td>Actor, ranh giới hệ thống, use case diagram</td><td>Sơ đồ, có nhìn thấy khung ranh giới</td></tr>
    <tr><td>TV3 UC-B / Rule</td><td>Một use case đi hết từ đầu đến cuối, kể cả ngoại lệ; phân loại rule</td><td>Một đặc tả use case đầy đủ, và mỗi loại rule một cái trong năm loại</td></tr>
    <tr><td>TV4 Dữ liệu / UX</td><td>Mô hình dữ liệu logic và ba mock-up</td><td>Một mock-up thể hiện trạng thái hỏng, không chỉ luồng thuận</td></tr>
    <tr><td>TV5 Kế hoạch</td><td>Xếp ưu tiên, kế hoạch phát hành, ước lượng BA</td><td>Ba con số ước lượng và bạn cam kết theo cái nào</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Đừng để một người nói hết.</strong> Slide viết gì không quan trọng, một nhóm chỉ có một người trình bày sẽ bị đọc thành một dự án chỉ có một tác giả — và điểm đi theo cách đọc đó.</div>
<h3>Những câu gần như chắc chắn bị hỏi</h3>
<ul>
  <li><em>"Cái gì nằm ngoài phạm vi, và vì sao?"</em> — hãy để danh sách loại trừ sẵn trên một slide.</li>
  <li><em>"Nếu bị cắt 30% ngân sách thì em bỏ yêu cầu nào?"</em> — đây đúng là toàn bộ mục đích của bảng xếp ưu tiên.</li>
  <li><em>"Chỉ cho thầy một yêu cầu không kiểm thử được."</em> — nếu có thật thì hãy nhận và sửa ngay tại chỗ; như vậy được điểm cao hơn là chối.</li>
  <li><em>"Con số này ở đâu ra?"</em> — mọi con số, mọi lần.</li>
  <li><em>"Bất đồng khó nhất trong nhóm là gì và giải quyết ra sao?"</em> — một nhóm không có bất đồng nào là một nhóm chưa phân tích gì cả.</li>
</ul>

<h2>Bảng tự kiểm trước khi nộp</h2>
<p class="lead">Chạy bảng này vào hôm trước ngày nộp. Mỗi dòng là một thứ đã từng khiến một nhóm thật mất điểm thật.</p>
<h3>Nhất quán giữa các tài liệu — sáu liên kết</h3>
<ol>
  <li>Mọi FE-n ở Vision &amp; Scope §2.1 được ≥ 1 UC-nn hiện thực.</li>
  <li>Mọi UC-nn liệt kê rule BR-nn của nó — bằng ID, không bao giờ dán nội dung.</li>
  <li>Mọi functional requirement trong SRS truy về một UC-nn hoặc FE-n.</li>
  <li>Mọi danh từ trong luồng use case có mục trong data dictionary.</li>
  <li>Mọi dòng bảng ưu tiên là một FE-n hoặc UC-nn đã có.</li>
  <li>Số đếm trong công cụ ước lượng bằng đúng nội dung thật của deliverable 2, 4 và 6.</li>
</ol>
<h3>Kiểm theo từng deliverable</h3>
<table>
  <thead><tr><th>#</th><th>Kiểm</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Mọi mục tiêu có baseline + đích + hạn · mọi con số tự đặt nằm ở §1.7 Giả định · §2.4 Loại trừ không để trống · §3.2 không đánh cả năm chiều là driver</td></tr>
    <tr><td>2</td><td>≥ 10 use case · mọi đặc tả có ít nhất một ngoại lệ · luồng đánh số X.0 / X.Y / X.Y.EZ · sơ đồ có khung ranh giới nhìn thấy được · mũi tên include/extend đúng chiều</td></tr>
    <tr><td>3</td><td>Ít nhất một rule mỗi loại trong năm loại · mọi rule đánh dấu tĩnh hay động · mọi rule có nguồn cụ thể · không rule nào bị chép nội dung sang SRS</td></tr>
    <tr><td>4</td><td>Đủ mọi mục của template (ghi "None." thay vì xoá) · mọi yêu cầu dùng <em>shall</em> · không "và/hoặc", "v.v.", "thân thiện người dùng", "nhanh" · mọi thuộc tính chất lượng có con số · context diagram ở §2.1</td></tr>
    <tr><td>5</td><td>Xếp theo bảng chữ cái · cấu trúc để trống Length và Values · mọi phần tử trong cấu trúc có mục riêng · dùng đúng ký pháp (+, ( ), { }, min:max, [ a | b ])</td></tr>
    <tr><td>6</td><td>≥ 3 mock-up · mỗi cái gắn với một ID use case · thể hiện ít nhất một trạng thái hỏng · dữ liệu mẫu thật, không Lorem ipsum</td></tr>
    <tr><td>7</td><td>Nêu trọng số và giải thích bằng một câu · các mục bắt buộc tách riêng, không chấm điểm · sắp giảm dần · một câu hoà giải giữa thứ hạng và kế hoạch phát hành</td></tr>
    <tr><td>8</td><td>Chỉ điền ô vàng · số đếm khớp tài liệu của bạn · báo cáo đủ ba cách · cam kết một con số, kèm lý do và một điều kiện sẽ khiến bạn đổi ý</td></tr>
  </tbody>
</table>
<h3>Kiểm phần hình thức</h3>
<ul>
  <li>Mọi tài liệu điền đủ bảng lịch sử sửa đổi, có số phiên bản và ngày.</li>
  <li>Một glossary, một bộ từ vựng — hãy tìm những từ bạn nghi ngờ: "trung tâm hoàn tất" có chỗ nào bị viết thành "kho" không?</li>
  <li>Số trang, mục lục, và chú thích hình có trỏ tới ID use case tương ứng.</li>
  <li>Sơ đồ xuất ra ảnh <em>và</em> giữ lại file nguồn sửa được.</li>
  <li>Ma trận truy vết đã đính kèm. Đó là điểm rẻ nhất trong cả bài tập.</li>
</ul>
<div class="note-ct">Một ý cuối từ chương 17 của sách: trước khi nộp, hãy để mỗi thành viên <strong>review một deliverable mình không viết</strong>, dùng Requirements Review Checklist trong <code>Chapter 17/Requirements Review Checklist.docx</code>. Một giờ kiểm tra chéo tìm ra nhiều lỗi hơn một giờ viết thêm — đó là toàn bộ kết luận của chương đó, và nó miễn phí.</div>
`,
    ),
  ].join('\n'),
};

export default {
  title: 'Group Assignment (20%) — Build a complete requirements package|||Assignment nhóm (20%) — Xây bộ tài liệu yêu cầu hoàn chỉnh',
  description: 'Bài tập nhóm chiếm 20% điểm môn (CLO2–9): 5 sinh viên, 8 sản phẩm, nhận đề tuần 2 và thuyết trình tuần 9. Đề tài TP1 & TP2 đầy đủ, hướng dẫn làm từng deliverable theo đúng template Wiegers, phân công nhóm 5 người, kế hoạch 8 tuần, ngân hàng câu hỏi thầy kiểm tra tiến độ, bài mẫu end-to-end và bảng tự kiểm trước khi nộp.',
  lessons: [A1, ...topics, A4, A5, ...guide, A9, A10],
};
