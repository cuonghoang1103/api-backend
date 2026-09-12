/**
 * SWP391 · Chapter 8 (Advanced) — Responsible AI across the SDLC.
 * Sources: Guide/Claude_Prompts.txt (the teacher's 9 prompts, Job Board System),
 * Templates-20260512/Template5_AI Usage Report.xlsx (sheets 0.Overview, 1. Week 1,
 * 2. Week n, Instruction), Slide1 Subject Guides p.4 / p.6 / p.7 (grading & submit items).
 *   8.1 The 9-prompt pipeline & responsible use       (anchor slug kept)
 *   8.2 The AI Usage Report — a full worked log of one iteration (new)
 *   Quiz 8
 * Privacy: no person from the G5 sample or the capstone report is named.
 */
import { slide, bi, books } from './_slides.mjs';

/* ─────────────────────── 8.1 The 9-prompt pipeline ─────────────────────── */
const P81 = [];

P81.push(bi(`<span class="eyebrow">Chapter 8 · Lesson 8.1 · Advanced · Claude_Prompts.txt</span>
<h2>Responsible AI across the SDLC — the teacher's 9-prompt pipeline</h2>
<p class="lead">The 2026 guide folder ships two AI documents. <strong>Claude_Prompts.txt</strong> holds nine prompts a teacher used to take a <em>Job Board System</em> (JBS) from a one-paragraph idea to test cases. <strong>Template5 — AI Usage Report</strong> is the log every team fills in. This lesson walks the pipeline prompt by prompt; lesson 8.2 fills in the log.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li>Map each of the 9 prompts to the <strong>artefact</strong> it produces and the <strong>SWP391 deliverable</strong> it feeds (RDS, Project Tracking, DB script, code, tests).</li>
<li>Review AI output with a checklist <strong>before</strong> it enters the RDS or the GitLab repo.</li>
<li>Recognise the four traps: <strong>invented requirements</strong>, <strong>leaked secrets / personal data</strong>, <strong>code you cannot explain</strong>, <strong>output nobody can trace</strong>.</li>
<li>Know how AI use meets grading: the individual LOC demo, the pass condition "no cheating found", and the AI Usage Report.</li>
</ul></div>
<h3>The pipeline in one screen</h3>
<table>
<thead><tr><th>#</th><th>The prompt asks for</th><th>Output file</th><th>Where it lands in SWP391</th></tr></thead>
<tbody>
<tr><td>1</td><td>A senior-BA Q&amp;A, then a PRD</td><td>PRD (markdown)</td><td>Scope agreed with the teacher (PO) · "Use Cases" sheet of Project Tracking</td></tr>
<tr><td>2</td><td>Context diagram</td><td><code>JBS_ContextDiagram.drawio</code></td><td>SRS — system context</td></tr>
<tr><td>3</td><td>Main business flows</td><td><code>JBS2_BizFlows.md</code></td><td>SRS business flows · swimlanes of the final "Demonstration" slide</td></tr>
<tr><td>4</td><td>Use-case specification</td><td><code>JBS3_UCD.md</code></td><td>SRS use-case diagram + UC specs</td></tr>
<tr><td>5</td><td>Entities, relations, attributes + traceability matrix</td><td><code>JBS4_ERD.md</code></td><td>SRS conceptual ERD · traceability</td></tr>
<tr><td>6</td><td>Full UI specification (8 parts)</td><td><code>JBS5_SRS.md</code></td><td>SRS screen specs &amp; screen flow · "Product" sheet</td></tr>
<tr><td>7</td><td>MySQL schema + demo data</td><td><code>JBS6_DB.md</code>, <code>JBS6_Database.sql</code>, <code>JBS6_DemoData.sql</code></td><td>SDS database design · DB scripts inside the iteration tag</td></tr>
<tr><td>8</td><td>Technical Design Spec (10 sections)</td><td><code>TDS.md</code></td><td>SDS package/class design · milestone→file map ≈ iteration plan</td></tr>
<tr><td>9</td><td>"Which inputs and prompts do you need to write unit / integration / E2E tests?"</td><td>a prompt set, then test cases</td><td>Template3 System Test · unit tests</td></tr>
</tbody>
</table>
<p class="ghi-chu">The file is in Vietnamese and targets ReactJS + Spring Boot + PostgreSQL (prompt 1) — yet prompt 7 asks for MySQL. Your SWP391 stack is the one agreed with your teacher (usually Java web + MySQL 8): edit prompt 1 so every later artefact follows it.</p>`,
`<span class="eyebrow">Chương 8 · Bài 8.1 · Nâng cao · Claude_Prompts.txt</span>
<h2>AI có trách nhiệm xuyên suốt SDLC — chuỗi 9 prompt của giảng viên</h2>
<p class="lead">Bộ tài liệu 2026 có hai file về AI. <strong>Claude_Prompts.txt</strong> chứa chín prompt mà giảng viên dùng để đưa một <em>Job Board System</em> (JBS) từ một đoạn ý tưởng tới test case. <strong>Template5 — AI Usage Report</strong> là sổ ghi mà nhóm nào cũng phải điền. Bài này đi qua chuỗi prompt từng bước; bài 8.2 điền sổ ghi.</p>
<div class="callout"><strong>Mục tiêu bài học.</strong>
<ul>
<li>Nối mỗi prompt trong 9 prompt với <strong>sản phẩm</strong> nó tạo ra và <strong>đầu ra SWP391</strong> nó phục vụ (RDS, Project Tracking, DB script, code, test).</li>
<li>Review đầu ra của AI bằng checklist <strong>trước khi</strong> đưa vào RDS hay repo GitLab.</li>
<li>Nhận ra bốn cái bẫy: <strong>yêu cầu bịa</strong>, <strong>lộ bí mật / dữ liệu cá nhân</strong>, <strong>code không giải thích nổi</strong>, <strong>đầu ra không truy vết được</strong>.</li>
<li>Biết việc dùng AI gặp cách chấm ở đâu: demo LOC từng người, điều kiện qua môn "không gian lận", và AI Usage Report.</li>
</ul></div>
<h3>Cả chuỗi trong một màn hình</h3>
<table>
<thead><tr><th>#</th><th>Prompt yêu cầu</th><th>File đầu ra</th><th>Rơi vào đâu trong SWP391</th></tr></thead>
<tbody>
<tr><td>1</td><td>Hỏi đáp kiểu senior BA, rồi viết PRD</td><td>PRD (markdown)</td><td>Phạm vi chốt với giảng viên (PO) · sheet "Use Cases" của Project Tracking</td></tr>
<tr><td>2</td><td>Context diagram</td><td><code>JBS_ContextDiagram.drawio</code></td><td>SRS — bối cảnh hệ thống</td></tr>
<tr><td>3</td><td>Các luồng nghiệp vụ chính</td><td><code>JBS2_BizFlows.md</code></td><td>Luồng nghiệp vụ trong SRS · swimlane của slide "Demonstration" cuối kỳ</td></tr>
<tr><td>4</td><td>Đặc tả use case</td><td><code>JBS3_UCD.md</code></td><td>Use-case diagram + UC spec trong SRS</td></tr>
<tr><td>5</td><td>Entity, quan hệ, thuộc tính + traceability matrix</td><td><code>JBS4_ERD.md</code></td><td>ERD mức khái niệm trong SRS · truy vết</td></tr>
<tr><td>6</td><td>Đặc tả UI đầy đủ (8 phần)</td><td><code>JBS5_SRS.md</code></td><td>Screen spec &amp; screen flow trong SRS · sheet "Product"</td></tr>
<tr><td>7</td><td>Schema MySQL + dữ liệu demo</td><td><code>JBS6_DB.md</code>, <code>JBS6_Database.sql</code>, <code>JBS6_DemoData.sql</code></td><td>Thiết kế CSDL trong SDS · DB script đi kèm tag của iteration</td></tr>
<tr><td>8</td><td>Technical Design Spec (10 mục)</td><td><code>TDS.md</code></td><td>Thiết kế package/class trong SDS · bảng milestone→file ≈ kế hoạch iteration</td></tr>
<tr><td>9</td><td>"Bạn cần đầu vào và prompt nào để viết unit / integration / E2E test?"</td><td>bộ prompt, rồi test case</td><td>Template3 System Test · unit test</td></tr>
</tbody>
</table>
<p class="ghi-chu">File viết bằng tiếng Việt và nhắm tới ReactJS + Spring Boot + PostgreSQL (prompt 1) — nhưng prompt 7 lại đòi MySQL. Stack SWP391 của bạn là stack đã thống nhất với giảng viên (thường là Java web + MySQL 8): sửa prompt 1 để mọi sản phẩm phía sau đi theo nó.</p>`));

P81.push(bi(`<h2>📑 Two guide slides that decide how AI use is judged</h2>
<p>The Subject Guides never mention AI by name — they do not need to. Two rules on these pages already settle the question.</p>`,
`<h2>📑 Hai slide trong guide quyết định việc dùng AI được đánh giá thế nào</h2>
<p>Subject Guides không hề nhắc tên AI — và cũng không cần. Hai quy định trên các trang này đã trả lời xong câu hỏi.</p>`));

P81.push(slide('g-subject', 4, 'Milestones & Evaluations — pass conditions',
`<p class="y-chinh">🎯 One pass condition is "No cheating found" — presenting AI work as your own, unreviewed and undisclosed, is exactly what it targets.</p>
<p class="nhan">The four pass conditions</p>
<ol>
<li><strong>Attendance</strong> — present at ≥ 80% of the slots.</li>
<li><strong>OG ≥ 5</strong> — OG = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
<li><strong>Final Presentation ≥ 5</strong> — two other teachers evaluate the iteration-3 result.</li>
<li><strong>No cheating found</strong> — a gate, not a score: failing it fails the subject whatever the marks.</li>
</ol>
<p class="nhan">What it means for AI</p>
<ul>
<li><strong>Allowed</strong> — the 2026 templates add an AI Usage Report, so using AI openly is expected.</li>
<li><strong>Cheating</strong> — hiding AI use, or submitting output nobody on the team understands, as if it were your own work.</li>
</ul>
<div class="pitfall">Your teacher's own AI policy (posted on EduNext/CMS or Slack) overrides anything general written here — read it in week 1.</div>`,
`<p class="y-chinh">🎯 Một điều kiện qua môn là "No cheating found" — nộp sản phẩm AI như của mình, không review và không khai báo, chính là thứ nó nhắm tới.</p>
<p class="nhan">Bốn điều kiện qua môn</p>
<ol>
<li><strong>Chuyên cần</strong> — có mặt ≥ 80% số slot.</li>
<li><strong>OG ≥ 5</strong> — OG = (iter1·15% + iter2·20% + iter3·25%) / 60%.</li>
<li><strong>Final Presentation ≥ 5</strong> — hai giảng viên khác chấm kết quả iteration 3.</li>
<li><strong>Không phát hiện gian lận</strong> — là cổng chặn, không phải điểm: trượt cổng này là trượt môn dù điểm cao.</li>
</ol>
<p class="nhan">Ý nghĩa với AI</p>
<ul>
<li><strong>Được phép</strong> — template 2026 có hẳn AI Usage Report, nghĩa là dùng AI công khai là điều được chờ đợi.</li>
<li><strong>Gian lận</strong> — giấu việc dùng AI, hoặc nộp thứ không ai trong nhóm hiểu, như thể là sản phẩm của mình.</li>
</ul>
<div class="pitfall">Quy định AI riêng của giảng viên bạn (đăng trên EduNext/CMS hoặc Slack) luôn được ưu tiên hơn mọi điều chung chung ở đây — đọc nó ngay tuần 1.</div>`));

P81.push(slide('g-subject', 7, 'Evaluation Criteria — LOC by individual code demo',
`<p class="y-chinh">🎯 LOC is graded "individually via code demo" — the teacher asks YOU to walk through your screen's code, so AI code you cannot explain earns nothing.</p>
<p class="nhan">How a screen is scored</p>
<ul>
<li><strong>Converted-LOC = C × Q</strong> — C: Complex 240 · Medium 120 · Simple 60; Q: High 100% · Medium 75% · Low 50%.</li>
<li><strong>LOC Grade</strong> = Converted-LOC × 10 / MaxLOC — this deck: 180 / 240 / 660 for iter 1 / 2 / 3; the Student Guides: 240 / 240 / 720. Follow your teacher's current guide.</li>
<li><strong>Submitted materials</strong> — code quality + RDS; missing or wrong tracking items cost up to 10% of the grade.</li>
</ul>
<p class="nhan">Typical demo questions (be ready for them)</p>
<ol>
<li>"Open the servlet / controller of this screen. Where is the input validated?"</li>
<li>"Show me the SQL. Why is this safe against injection?"</li>
<li>"Change the page size from 10 to 5 — now, live."</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> AI may write the first draft; only you can pass the demo. If you cannot change it live, it is not yet yours.</p>`,
`<p class="y-chinh">🎯 LOC được chấm "từng người qua demo code" — giảng viên bắt CHÍNH BẠN giải thích code màn hình của mình, nên code AI mà bạn không giải thích được thì không được điểm.</p>
<p class="nhan">Một màn hình được tính điểm thế nào</p>
<ul>
<li><strong>Converted-LOC = C × Q</strong> — C: Complex 240 · Medium 120 · Simple 60; Q: High 100% · Medium 75% · Low 50%.</li>
<li><strong>LOC Grade</strong> = Converted-LOC × 10 / MaxLOC — slide này: 180 / 240 / 660 cho iter 1 / 2 / 3; Student Guides: 240 / 240 / 720. Theo guide hiện hành của giảng viên bạn.</li>
<li><strong>Tài liệu nộp</strong> — chất lượng code + RDS; thiếu hoặc sai mục tracking bị trừ tối đa 10% điểm.</li>
</ul>
<p class="nhan">Câu hỏi demo điển hình (chuẩn bị sẵn)</p>
<ol>
<li>"Mở servlet / controller của màn hình này. Input được validate ở đâu?"</li>
<li>"Cho thầy xem câu SQL. Vì sao nó an toàn trước injection?"</li>
<li>"Đổi page size từ 10 thành 5 — làm ngay bây giờ."</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> AI có thể viết bản nháp đầu; chỉ bạn mới qua được buổi demo. Chưa sửa được tại chỗ thì code đó chưa phải của bạn.</p>`));

P81.push(bi(`<h2>🔗 The nine prompts, one by one</h2>
<p>For each prompt: what it produces, how to review it before it enters your package, and the trap that shows up in class. The running example is the file's own Job Board System — swap in your topic.</p>
<h3>Prompt 1 — "Act as a senior BA: ask me questions, then write the PRD"</h3>
<p class="nhan">What it produces</p>
<ul>
<li><strong>Clarifying questions</strong> — the file keeps six with their answers: single-tenant; Vietnamese + English; five user groups (Admin, HR/Recruiter, Hiring Manager, Candidate, Guest); pipeline Apply → CV screening → HR interview → technical interview → Offer; apply by web form with CV upload; e-mail over SMTP.</li>
<li><strong>A PRD</strong> in markdown built on those answers.</li>
</ul>
<p class="nhan">Review before you accept</p>
<ol>
<li>Every answer must come from your <strong>customer</strong> — in SWP391 that is the teacher (PO), not the AI and not a guess.</li>
<li>Strike out every feature in the PRD that no answer supports.</li>
<li>Cut the scope to what 4–5 people can build in 3 iterations: 3–4 screens per member per iteration.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Trap — invented requirements.</strong> Asked for a PRD, a model fills gaps with plausible features (online tests, salary analytics…). Nobody asked for them; the teacher will ask "who requested this?". Log each open point as a <strong>Q&amp;A</strong> issue in GitLab instead.</div>
<h3>Prompt 2 — Context diagram as a .drawio file</h3>
<ul>
<li><strong>Produces</strong> — the system as one bubble, external actors and systems around it (users, SMTP server), labelled data flows.</li>
<li><strong>Review</strong> — open it in draw.io: every actor from prompt 1 present, no internal modules drawn, every arrow labelled with the data it carries.</li>
<li><strong>Trap</strong> — a generated .drawio file can be malformed XML; if it does not open, ask for a Mermaid or PlantUML version and redraw.</li>
</ul>
<h3>Prompt 3 — Main business flows (JBS2_BizFlows.md)</h3>
<ul>
<li><strong>Produces</strong> — step lists per flow: post a job, apply, screen, interview, offer.</li>
<li><strong>Review</strong> — walk each flow with the teacher's answers from prompt 1; check who acts at every step and what status the application ends in.</li>
<li><strong>Reuse</strong> — the same flows become the swimlane diagrams on the "Demonstration" slide of the final presentation.</li>
</ul>
<p class="ghi-chu">From here on each prompt says "with the PRD … in the attached file". The file also shows separator lines between groups of prompts — the work ran over several chat sessions, and every new session got the earlier documents attached. The model remembers nothing between sessions; your files do.</p>`,
`<h2>🔗 Chín prompt, lần lượt từng cái</h2>
<p>Với mỗi prompt: nó tạo ra gì, review thế nào trước khi đưa vào bộ nộp, và cái bẫy hay gặp trên lớp. Ví dụ xuyên suốt là chính Job Board System trong file — thay bằng đề tài của bạn.</p>
<h3>Prompt 1 — "Đóng vai senior BA: hỏi tôi, rồi viết PRD"</h3>
<p class="nhan">Nó tạo ra gì</p>
<ul>
<li><strong>Câu hỏi làm rõ</strong> — file giữ lại sáu câu kèm trả lời: single-tenant; tiếng Việt + tiếng Anh; năm nhóm người dùng (Admin, HR/Recruiter, Hiring Manager, Ứng viên, Khách vãng lai); quy trình Nộp đơn → Lọc CV → Phỏng vấn HR → Phỏng vấn chuyên môn → Offer; nộp qua form web có upload CV; e-mail qua SMTP.</li>
<li><strong>Một PRD</strong> dạng markdown dựng trên các câu trả lời đó.</li>
</ul>
<p class="nhan">Review trước khi nhận</p>
<ol>
<li>Mọi câu trả lời phải đến từ <strong>khách hàng</strong> — trong SWP391 đó là giảng viên (PO), không phải AI và không phải đoán.</li>
<li>Gạch mọi tính năng trong PRD mà không câu trả lời nào ủng hộ.</li>
<li>Cắt phạm vi về mức 4–5 người làm được trong 3 iteration: 3–4 màn hình mỗi người mỗi iteration.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bẫy — yêu cầu bịa.</strong> Được bảo viết PRD, model tự lấp chỗ trống bằng tính năng nghe hợp lý (thi online, phân tích lương…). Không ai yêu cầu chúng; giảng viên sẽ hỏi "ai yêu cầu cái này?". Hãy ghi mỗi điểm chưa rõ thành một issue <strong>Q&amp;A</strong> trên GitLab.</div>
<h3>Prompt 2 — Context diagram dạng file .drawio</h3>
<ul>
<li><strong>Tạo ra</strong> — hệ thống là một khối, xung quanh là actor và hệ thống ngoài (người dùng, SMTP server), các luồng dữ liệu có nhãn.</li>
<li><strong>Review</strong> — mở bằng draw.io: đủ mọi actor từ prompt 1, không vẽ module bên trong, mũi tên nào cũng ghi dữ liệu nó mang.</li>
<li><strong>Bẫy</strong> — file .drawio do AI sinh có thể hỏng XML; mở không được thì xin bản Mermaid hoặc PlantUML rồi vẽ lại.</li>
</ul>
<h3>Prompt 3 — Luồng nghiệp vụ chính (JBS2_BizFlows.md)</h3>
<ul>
<li><strong>Tạo ra</strong> — danh sách bước cho từng luồng: đăng job, ứng tuyển, lọc, phỏng vấn, offer.</li>
<li><strong>Review</strong> — đi lại từng luồng với câu trả lời của giảng viên ở prompt 1; kiểm tra ai thao tác ở mỗi bước và đơn ứng tuyển kết thúc ở trạng thái nào.</li>
<li><strong>Dùng lại</strong> — chính các luồng này thành swimlane trên slide "Demonstration" của buổi thuyết trình cuối kỳ.</li>
</ul>
<p class="ghi-chu">Từ đây mỗi prompt đều nói "với PRD … như trong file đính kèm". File còn có các dòng phân cách giữa các nhóm prompt — công việc chạy qua nhiều phiên chat, phiên mới nào cũng được đính kèm tài liệu trước đó. Model không nhớ gì giữa các phiên; file của bạn thì nhớ.</p>`));

P81.push(bi(`<h3>Prompt 4 — Use-case specification (JBS3_UCD.md)</h3>
<ul>
<li><strong>Produces</strong> — a UC list and one spec per UC: actors, pre/post-conditions, main flow, alternative flows, exceptions.</li>
<li><strong>Review</strong> — one UC = one goal of one actor; every UC traces to a PRD function; alternative flows really differ from the main flow.</li>
<li><strong>Into your package</strong> — the UC list becomes the "Use Cases" sheet of Project Tracking; each UC is then split into screens in the "Product" sheet.</li>
</ul>
<div class="pitfall">A model writes 40 polished UCs as easily as 12. Keep only those the team will really build — every UC in the RDS is a promise the final evaluators can check.</div>
<h3>Prompt 5 — Entities + traceability matrix (JBS4_ERD.md)</h3>
<p class="nhan">The prompt asks for five things</p>
<ol>
<li>List of entities with a description each.</li>
<li>Relationships between entities.</li>
<li>Attributes of every entity.</li>
<li>A <strong>traceability matrix</strong> with columns: UC name · Actors · UC description · Related functions (PRD) · Related business flow · Related data entities.</li>
<li>All in one markdown file.</li>
</ol>
<p class="nhan">Review before you accept</p>
<ul>
<li><strong>Row by row</strong> — an entity no UC touches is dead weight; a UC with no entity cannot store anything.</li>
<li><strong>Keys and cardinality</strong> — check every PK/FK and every 1–n / n–n against the business rules (can a candidate apply twice to one job?).</li>
</ul>
<h3>Prompt 6 — Full UI specification (JBS5_SRS.md, in English)</h3>
<p class="nhan">Eight required parts</p>
<ol class="hai-cot">
<li>Design system &amp; style guide (colour, type, spacing, components)</li>
<li>Sitemap &amp; navigation per role</li>
<li>Per-screen spec: ID (SCR-01), route, purpose, actors, linked UC, layout, UI elements, interactions, validation, empty / loading / error states, responsive</li>
<li>User flows / screen flow diagrams</li>
<li>Interaction &amp; micro-interaction spec</li>
<li>Permission-based UI rules (who sees "Delete job")</li>
<li>i18n UI notes</li>
<li>Accessibility notes (contrast, keyboard, ARIA, focus)</li>
</ol>
<ul>
<li><strong>Review</strong> — the screen list must equal your "Product" sheet; every field counted there appears in the spec (field counts drive the C of Converted-LOC).</li>
<li><strong>Fit to the course</strong> — the teacher's UI Themes zip (AdminLTE, AdminKit, DashMin, Doctris, EduChamp, ZeShopper, AdminDirector) already gives you a design system: tell the model which theme you use instead of inventing one.</li>
</ul>`,
`<h3>Prompt 4 — Đặc tả use case (JBS3_UCD.md)</h3>
<ul>
<li><strong>Tạo ra</strong> — danh sách UC và một bản đặc tả cho mỗi UC: actor, tiền/hậu điều kiện, luồng chính, luồng thay thế, ngoại lệ.</li>
<li><strong>Review</strong> — một UC = một mục tiêu của một actor; UC nào cũng truy về một chức năng trong PRD; luồng thay thế phải thật sự khác luồng chính.</li>
<li><strong>Vào bộ nộp</strong> — danh sách UC thành sheet "Use Cases" của Project Tracking; mỗi UC sau đó được tách thành màn hình ở sheet "Product".</li>
</ul>
<div class="pitfall">Model viết 40 UC bóng bẩy dễ như viết 12. Chỉ giữ những UC nhóm thật sự sẽ làm — mỗi UC trong RDS là một lời hứa mà hội đồng cuối kỳ có thể kiểm tra.</div>
<h3>Prompt 5 — Entity + traceability matrix (JBS4_ERD.md)</h3>
<p class="nhan">Prompt đòi năm thứ</p>
<ol>
<li>Danh sách entity, mỗi entity có mô tả.</li>
<li>Quan hệ giữa các entity.</li>
<li>Thuộc tính của từng entity.</li>
<li>Một <strong>traceability matrix</strong> với các cột: Tên UC · Actor · Mô tả UC · Chức năng liên quan (PRD) · Luồng nghiệp vụ liên quan · Entity dữ liệu liên quan.</li>
<li>Tất cả trong một file markdown.</li>
</ol>
<p class="nhan">Review trước khi nhận</p>
<ul>
<li><strong>Soát từng dòng</strong> — entity mà không UC nào đụng tới là thừa; UC không có entity nào thì không lưu được gì.</li>
<li><strong>Khoá và bản số</strong> — kiểm mọi PK/FK và mọi quan hệ 1–n / n–n theo quy tắc nghiệp vụ (một ứng viên có được nộp hai lần vào cùng một job không?).</li>
</ul>
<h3>Prompt 6 — Đặc tả UI toàn dự án (JBS5_SRS.md, viết tiếng Anh)</h3>
<p class="nhan">Tám phần bắt buộc</p>
<ol class="hai-cot">
<li>Design system &amp; style guide (màu, chữ, khoảng cách, component)</li>
<li>Sitemap &amp; điều hướng theo role</li>
<li>Đặc tả từng màn hình: ID (SCR-01), route, mục đích, actor, UC liên kết, bố cục, UI element, tương tác, validation, trạng thái rỗng / đang tải / lỗi, responsive</li>
<li>User flow / screen flow diagram</li>
<li>Đặc tả tương tác &amp; micro-interaction</li>
<li>Quy tắc UI theo quyền (ai thấy nút "Xoá job")</li>
<li>Ghi chú i18n cho UI</li>
<li>Ghi chú accessibility (tương phản, bàn phím, ARIA, focus)</li>
</ol>
<ul>
<li><strong>Review</strong> — danh sách màn hình phải trùng sheet "Product"; mọi field đã đếm ở đó phải có trong spec (số field quyết định C của Converted-LOC).</li>
<li><strong>Cho hợp môn học</strong> — file UI Themes của giảng viên (AdminLTE, AdminKit, DashMin, Doctris, EduChamp, ZeShopper, AdminDirector) đã là một design system: nói cho model biết bạn dùng theme nào thay vì để nó bịa.</li>
</ul>`));

P81.push(bi(`<h3>Prompt 7 — MySQL design: JBS6_DB.md + two SQL files</h3>
<ul>
<li><strong>Produces</strong> — a schema description, <code>JBS6_Database.sql</code> (DDL) and <code>JBS6_DemoData.sql</code> (demo rows).</li>
<li><strong>Why two files</strong> — structure and data change at different speeds; the demo-data script lets anyone reset a clean demo before a video or the final presentation.</li>
</ul>
<p class="nhan">Review — run it, do not read it</p>
<ol>
<li>Run both scripts on an <strong>empty MySQL 8</strong> database. Order errors (a FK to a table not yet created) show up at once.</li>
<li>Check <code>utf8mb4</code> so Vietnamese names and CV titles store correctly.</li>
<li>Compare tables with the ERD of prompt 5 — same entities, same keys.</li>
<li>Read the demo data: fake names, fake e-mails (<code>@example.com</code>), no real phone numbers.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Trap — real data in, real data out.</strong> Never paste a real customer list, classmates' data or a production dump into a prompt to "make the demo realistic". It leaves your control the moment you press Enter.</div>
<h3>Prompt 8 — Technical Design Spec (TDS, 10 sections)</h3>
<p class="nhan">The prompt's own rules worth copying</p>
<ul>
<li><strong>"No '…' or 'etc.'"</strong> — every file and folder list must be complete. Models shorten long lists; this line forbids it.</li>
<li><strong>Shared files get a milestone</strong> — built as early as possible, usually M1.</li>
<li><strong>Complex rules need a table or example</strong> — scoped RBAC, pipeline transitions, bilingual fallback.</li>
</ul>
<p class="nhan">Map it to SWP391</p>
<ul>
<li><strong>M1 shared files</strong> = the common modules of iteration 1 (header / footer / role-based menu, login, DB connection, base DAO) that other members import. The Project Tracking template lists exactly such a row.</li>
<li><strong>Milestone → file map</strong> = who builds which files in which iteration — the base of the "Product" sheet plan.</li>
<li><strong>Stack</strong> — for JSP/Servlet + MySQL, ask for packages such as <code>controller</code>, <code>dal</code> (DAO), <code>model</code>, <code>filter</code>, <code>util</code> instead of React/Spring folders.</li>
</ul>
<h3>Prompt 9 — Ask for the inputs before the test cases</h3>
<ul>
<li><strong>The twist</strong> — it does not ask for tests; it asks "which input documents and which prompts do you need" for unit, integration (per screen) and E2E tests.</li>
<li><strong>Why</strong> — a test case's expected result must come from a <strong>specification</strong> (UC, UI spec, business rule). Tests written from the code only confirm what the code already does, bugs included.</li>
<li><strong>Into your package</strong> — the cases go into Template3 System Test; failures found by the team become <strong>Defect</strong> issues.</li>
</ul>`,
`<h3>Prompt 7 — Thiết kế MySQL: JBS6_DB.md + hai file SQL</h3>
<ul>
<li><strong>Tạo ra</strong> — mô tả schema, <code>JBS6_Database.sql</code> (DDL) và <code>JBS6_DemoData.sql</code> (dữ liệu demo).</li>
<li><strong>Vì sao hai file</strong> — cấu trúc và dữ liệu thay đổi với tốc độ khác nhau; script dữ liệu demo giúp ai cũng dựng lại được bản demo sạch trước khi quay video hay thuyết trình cuối kỳ.</li>
</ul>
<p class="nhan">Review — chạy thử, đừng chỉ đọc</p>
<ol>
<li>Chạy cả hai script trên một CSDL <strong>MySQL 8 trống</strong>. Lỗi thứ tự (FK trỏ tới bảng chưa tạo) lộ ra ngay.</li>
<li>Kiểm tra <code>utf8mb4</code> để tên tiếng Việt và tiêu đề CV lưu đúng.</li>
<li>So các bảng với ERD của prompt 5 — cùng entity, cùng khoá.</li>
<li>Đọc dữ liệu demo: tên giả, e-mail giả (<code>@example.com</code>), không có số điện thoại thật.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bẫy — dữ liệu thật vào, dữ liệu thật ra.</strong> Đừng bao giờ dán danh sách khách hàng thật, dữ liệu của bạn cùng lớp hay bản dump production vào prompt để "demo cho giống thật". Nó rời khỏi tầm kiểm soát của bạn ngay khi bạn bấm Enter.</div>
<h3>Prompt 8 — Technical Design Spec (TDS, 10 mục)</h3>
<p class="nhan">Các quy tắc trong prompt đáng học theo</p>
<ul>
<li><strong>"Không viết '…' hay 'v.v.'"</strong> — mọi danh sách file và thư mục phải đầy đủ. Model hay rút gọn danh sách dài; câu này cấm việc đó.</li>
<li><strong>File dùng chung phải gắn milestone</strong> — làm càng sớm càng tốt, thường là M1.</li>
<li><strong>Quy tắc phức tạp phải có bảng hoặc ví dụ</strong> — RBAC theo phạm vi, chuyển trạng thái pipeline, fallback song ngữ.</li>
</ul>
<p class="nhan">Nối vào SWP391</p>
<ul>
<li><strong>File dùng chung M1</strong> = các module chung của iteration 1 (header / footer / menu theo role, đăng nhập, kết nối DB, base DAO) mà các thành viên khác import. Template Project Tracking có đúng một dòng như vậy.</li>
<li><strong>Bảng milestone → file</strong> = ai làm file nào ở iteration nào — nền cho kế hoạch trong sheet "Product".</li>
<li><strong>Stack</strong> — với JSP/Servlet + MySQL, yêu cầu các package như <code>controller</code>, <code>dal</code> (DAO), <code>model</code>, <code>filter</code>, <code>util</code> thay cho thư mục React/Spring.</li>
</ul>
<h3>Prompt 9 — Hỏi đầu vào trước khi xin test case</h3>
<ul>
<li><strong>Điểm đặc biệt</strong> — nó không xin test; nó hỏi "cần tài liệu đầu vào nào và prompt thế nào" cho unit test, integration test (theo màn hình) và E2E test.</li>
<li><strong>Vì sao</strong> — kết quả mong đợi của test case phải đến từ <strong>đặc tả</strong> (UC, UI spec, quy tắc nghiệp vụ). Test viết từ code chỉ xác nhận những gì code đang làm, kể cả bug.</li>
<li><strong>Vào bộ nộp</strong> — test case vào Template3 System Test; lỗi nhóm tự tìm ra thành issue <strong>Defect</strong>.</li>
</ul>`));

P81.push(bi(`<h2>🛠️ Worked example — from a prompt to code you can defend</h2>
<p>A member owns the screen <strong>SCR-07 Job List</strong> (search + paging) of the Job Board, built with JSP/Servlet + MySQL.</p>
<p class="nhan">Step 1 — write a prompt with context, constraints and format</p>
<pre>Weak:   "write job search"

Strong: "Java 17, Jakarta Servlet, JDBC, MySQL 8. Table job(id, title,
 location, status, posted_at). Write JobDAO.search(String keyword,
 int page, int size) returning List&lt;Job&gt;: only status='OPEN',
 newest first, LIMIT/OFFSET paging, PreparedStatement only.
 Explain every security assumption. No framework."</pre>
<p class="nhan">Step 2 — the model's first draft (typical)</p>
<pre>String sql = "SELECT * FROM job WHERE title LIKE '%" + keyword + "%'"
           + " LIMIT " + size + " OFFSET " + (page * size);</pre>
<p class="nhan">Step 3 — review like a teammate's merge request</p>
<ol>
<li><strong>String concatenation</strong> → SQL injection, although the prompt said PreparedStatement.</li>
<li><strong>SELECT *</strong> → fetches columns the page never shows.</li>
<li><strong>Missing rules</strong> → no <code>status = 'OPEN'</code>, no <code>ORDER BY</code>: the spec was ignored.</li>
<li><strong>Off-by-one</strong> → is page 0- or 1-based? The UI spec says pages start at 1.</li>
</ol>
<p class="nhan">Step 4 — the version you commit</p>
<pre>String sql = "SELECT id, title, location, posted_at FROM job "
           + "WHERE status = 'OPEN' AND title LIKE ? "
           + "ORDER BY posted_at DESC LIMIT ? OFFSET ?";
ps.setString(1, "%" + keyword + "%");
ps.setInt(2, size);
ps.setInt(3, (page - 1) * size);   // pages start at 1 (UI spec)</pre>
<p class="dap-an">✅ Log it in the AI Usage Report: output "JobDAO.search draft", modification "rewrote with PreparedStatement, added status filter and ordering, fixed paging", risk "ignored the security constraint in the prompt".</p>
<h2>⚠️ The four traps and their antidotes</h2>
<table>
<thead><tr><th>Trap</th><th>What it looks like</th><th>Antidote</th></tr></thead>
<tbody>
<tr><td>Invented requirements</td><td>Features, rules or actors nobody asked for</td><td>Every requirement traces to a teacher answer or a Q&amp;A issue</td></tr>
<tr><td>Leaked secrets / data</td><td>DB password, Mailtrap credentials, real people's data pasted into a chat</td><td>Mask with placeholders; keep secrets in an ignored config file</td></tr>
<tr><td>Code you cannot explain</td><td>Frameworks or tricks the member never learned</td><td>Accept only what you can change live in the demo</td></tr>
<tr><td>Untraceable output</td><td>No record of which prompt produced what</td><td>AI Usage Report row + screenshot named GroupX_SessionY_Activity</td></tr>
</tbody>
</table>`,
`<h2>🛠️ Ví dụ có lời giải — từ prompt tới code bảo vệ được</h2>
<p>Một thành viên phụ trách màn hình <strong>SCR-07 Job List</strong> (tìm kiếm + phân trang) của Job Board, làm bằng JSP/Servlet + MySQL.</p>
<p class="nhan">Bước 1 — viết prompt có ngữ cảnh, ràng buộc và định dạng</p>
<pre>Yếu:   "viết chức năng tìm job"

Mạnh:  "Java 17, Jakarta Servlet, JDBC, MySQL 8. Bảng job(id, title,
 location, status, posted_at). Viết JobDAO.search(String keyword,
 int page, int size) trả về List&lt;Job&gt;: chỉ status='OPEN',
 mới nhất trước, phân trang LIMIT/OFFSET, chỉ dùng PreparedStatement.
 Giải thích mọi giả định bảo mật. Không dùng framework."</pre>
<p class="nhan">Bước 2 — bản nháp đầu của model (điển hình)</p>
<pre>String sql = "SELECT * FROM job WHERE title LIKE '%" + keyword + "%'"
           + " LIMIT " + size + " OFFSET " + (page * size);</pre>
<p class="nhan">Bước 3 — review như merge request của đồng đội</p>
<ol>
<li><strong>Nối chuỗi</strong> → SQL injection, dù prompt đã nói PreparedStatement.</li>
<li><strong>SELECT *</strong> → lấy cả cột trang không bao giờ hiển thị.</li>
<li><strong>Thiếu quy tắc</strong> → không có <code>status = 'OPEN'</code>, không <code>ORDER BY</code>: đặc tả bị bỏ qua.</li>
<li><strong>Lệch một</strong> → trang bắt đầu từ 0 hay 1? UI spec nói trang bắt đầu từ 1.</li>
</ol>
<p class="nhan">Bước 4 — bản bạn commit</p>
<pre>String sql = "SELECT id, title, location, posted_at FROM job "
           + "WHERE status = 'OPEN' AND title LIKE ? "
           + "ORDER BY posted_at DESC LIMIT ? OFFSET ?";
ps.setString(1, "%" + keyword + "%");
ps.setInt(2, size);
ps.setInt(3, (page - 1) * size);   // trang bắt đầu từ 1 (UI spec)</pre>
<p class="dap-an">✅ Ghi vào AI Usage Report: output "bản nháp JobDAO.search", chỉnh sửa "viết lại bằng PreparedStatement, thêm lọc status và sắp xếp, sửa phân trang", rủi ro "bỏ qua ràng buộc bảo mật trong prompt".</p>
<h2>⚠️ Bốn cái bẫy và cách giải</h2>
<table>
<thead><tr><th>Bẫy</th><th>Biểu hiện</th><th>Cách giải</th></tr></thead>
<tbody>
<tr><td>Yêu cầu bịa</td><td>Tính năng, quy tắc, actor không ai yêu cầu</td><td>Mọi yêu cầu truy về một câu trả lời của giảng viên hoặc một issue Q&amp;A</td></tr>
<tr><td>Lộ bí mật / dữ liệu</td><td>Mật khẩu DB, tài khoản Mailtrap, dữ liệu người thật bị dán vào chat</td><td>Che bằng placeholder; giữ bí mật trong file cấu hình đã ignore</td></tr>
<tr><td>Code không giải thích nổi</td><td>Framework hay mẹo mà thành viên chưa từng học</td><td>Chỉ nhận thứ bạn sửa được tại chỗ khi demo</td></tr>
<tr><td>Đầu ra không truy vết</td><td>Không ghi prompt nào sinh ra cái gì</td><td>Một dòng AI Usage Report + ảnh chụp đặt tên GroupX_SessionY_Activity</td></tr>
</tbody>
</table>`));

P81.push(bi(`<h2>✅ Review checklist — before AI output enters the package</h2>
<p class="nhan">Documents (PRD, UC, ERD, UI spec, TDS)</p>
<ol>
<li>Every requirement traces to the teacher (PO) or a closed Q&amp;A issue.</li>
<li>Names match across documents: UC names, screen IDs, entity names, table names.</li>
<li>Scope fits 3–4 screens per member per iteration.</li>
<li>No placeholder text ("TBD", "…", "etc.") left in the RDS.</li>
</ol>
<p class="nhan">Code and SQL</p>
<ol>
<li>It compiles and runs on the team's stack (NetBeans / JDK / MySQL 8 as agreed).</li>
<li>Parameterised SQL only; input validated on the server side.</li>
<li>No secrets, no real personal data, no licence-restricted code pasted in.</li>
<li>The owner can explain every line and change it live.</li>
<li>One row in the AI Usage Report, with evidence.</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The "70% problem" and prompts as source code.</strong>
<ul>
<li><strong>70% problem</strong> — practitioners note that AI gets you about 70% of the way fast; the last 30% (correct, secure, maintainable) still needs an engineer. Juniors who hand over everything stop building the judgment to see that 30%.</li>
<li><strong>Prompts as source</strong> — keep the prompts that produced your documents in the repo (for example <code>docs/ai/prompts/</code>) next to the outputs. A reviewer can then re-run, diff and trust them — the same idea as the teacher sharing Claude_Prompts.txt.</li>
<li><strong>Prompt injection</strong> — if your app ever sends user text to an LLM, that text can carry instructions. OWASP keeps a separate Top 10 for LLM applications; read it before you build such a feature.</li>
</ul></div>`,
`<h2>✅ Checklist review — trước khi đầu ra AI vào bộ nộp</h2>
<p class="nhan">Tài liệu (PRD, UC, ERD, UI spec, TDS)</p>
<ol>
<li>Mọi yêu cầu truy về giảng viên (PO) hoặc một issue Q&amp;A đã đóng.</li>
<li>Tên thống nhất giữa các tài liệu: tên UC, ID màn hình, tên entity, tên bảng.</li>
<li>Phạm vi vừa 3–4 màn hình mỗi người mỗi iteration.</li>
<li>Không còn chữ giữ chỗ ("TBD", "…", "v.v.") trong RDS.</li>
</ol>
<p class="nhan">Code và SQL</p>
<ol>
<li>Biên dịch và chạy trên stack của nhóm (NetBeans / JDK / MySQL 8 như đã thống nhất).</li>
<li>Chỉ dùng SQL tham số hoá; input được validate phía server.</li>
<li>Không có bí mật, không dữ liệu cá nhân thật, không dán code vướng bản quyền.</li>
<li>Người phụ trách giải thích được từng dòng và sửa được tại chỗ.</li>
<li>Có một dòng trong AI Usage Report, kèm bằng chứng.</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>"Vấn đề 70%" và prompt như mã nguồn.</strong>
<ul>
<li><strong>Vấn đề 70%</strong> — người trong nghề nhận thấy AI đưa bạn đi nhanh khoảng 70% quãng đường; 30% cuối (đúng, an toàn, bảo trì được) vẫn cần kỹ sư. Junior giao hết cho AI sẽ ngừng rèn khả năng phán đoán để nhìn ra 30% đó.</li>
<li><strong>Prompt như mã nguồn</strong> — giữ các prompt đã sinh ra tài liệu trong repo (ví dụ <code>docs/ai/prompts/</code>) cạnh đầu ra. Người review có thể chạy lại, so sánh và tin chúng — đúng tinh thần giảng viên chia sẻ Claude_Prompts.txt.</li>
<li><strong>Prompt injection</strong> — nếu app của bạn gửi chữ người dùng nhập vào một LLM, chữ đó có thể mang theo mệnh lệnh. OWASP có riêng một Top 10 cho ứng dụng LLM; đọc nó trước khi làm tính năng như vậy.</li>
</ul></div>`));

P81.push(books([
  ['sommerville', 'ch. 1 §1.2 Software engineering ethics · ch. 4 Requirements engineering', 'chương 1 §1.2 Đạo đức kỹ nghệ phần mềm · chương 4 Kỹ nghệ yêu cầu'],
  ['wiegers', 'ch. 7 Requirements elicitation · ch. 17 Validating the requirements · ch. 29 Links in the requirements chain (traceability)', 'chương 7 Thu thập yêu cầu · chương 17 Thẩm định yêu cầu · chương 29 Truy vết yêu cầu'],
  ['cockburn', 'ch. 1–2 (what a use case is, the goal of one actor)', 'chương 1–2 (use case là gì, mục tiêu của một actor)'],
]));

const L81 = {
  title: '8.1 — The 9-prompt AI pipeline: artefacts, review & traps|||8.1 — Chuỗi 9 prompt AI: sản phẩm, cách review & các bẫy',
  slug: 'swp391-8-1-responsible-ai',
  type: 'VIDEO',
  description: 'Chín prompt trong Claude_Prompts.txt (PRD → context diagram → business flow → UC → ERD + traceability → UI spec → MySQL → TDS → test case): mỗi prompt tạo ra gì, vào đâu trong RDS/Project Tracking, review thế nào, bẫy yêu cầu bịa, lộ bí mật, code không giải thích được khi demo.',
  content: P81.join('\n'),
};

/* ─────────────────────── 8.2 AI Usage Report, worked log ─────────────────────── */
const P82 = [];

P82.push(bi(`<span class="eyebrow">Chapter 8 · Lesson 8.2 · Template5 — AI Usage Report</span>
<h2>The AI Usage Report — field by field, then a full iteration log</h2>
<p class="lead">Template5 turns "we used AI a bit" into evidence: which task, which tool, what it produced, what YOU changed, and a screenshot that proves it. Filled honestly, it protects the team against any suspicion of cheating. This lesson explains every column and fills a complete log for iteration 1 of the Job Board System.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li>Fill the <strong>0.Overview</strong> sheet and the <strong>weekly</strong> sheets correctly.</li>
<li>Write the two columns that matter most — <strong>Student's Validation / Modification</strong> and <strong>Evidence / Link</strong> — so a teacher can verify them.</li>
<li>Follow the evidence rules: a shared Drive folder, files named <code>GroupX_SessionY_Activity</code>, each showing prompt, response and your follow-up.</li>
<li>Keep the report consistent with GitLab, Project Tracking and your demo.</li>
</ul></div>
<h3>Template5 in one screen — four sheets</h3>
<table>
<thead><tr><th>Sheet</th><th>What it holds</th></tr></thead>
<tbody>
<tr><td><strong>0.Overview</strong></td><td>Subject, class, semester, lecturer, group, project title + the student list (code, name, role in group, AI tools used)</td></tr>
<tr><td><strong>1. Week 1</strong></td><td>The log of week 1: one row per AI use, 10 columns</td></tr>
<tr><td><strong>2. Week n</strong></td><td>The same table — copy it for every following week</td></tr>
<tr><td><strong>Instruction</strong></td><td>How to fill each column, including the evidence naming rule</td></tr>
</tbody>
</table>`,
`<span class="eyebrow">Chương 8 · Bài 8.2 · Template5 — AI Usage Report</span>
<h2>AI Usage Report — từng trường, rồi một sổ ghi trọn một iteration</h2>
<p class="lead">Template5 biến câu "nhóm em có dùng AI chút ít" thành bằng chứng: việc gì, công cụ gì, nó tạo ra gì, BẠN đã sửa gì, và ảnh chụp chứng minh. Điền trung thực, nó bảo vệ nhóm trước mọi nghi ngờ gian lận. Bài này giải thích từng cột và điền một sổ ghi hoàn chỉnh cho iteration 1 của Job Board System.</p>
<div class="callout"><strong>Mục tiêu bài học.</strong>
<ul>
<li>Điền đúng sheet <strong>0.Overview</strong> và các sheet <strong>theo tuần</strong>.</li>
<li>Viết hai cột quan trọng nhất — <strong>Student's Validation / Modification</strong> và <strong>Evidence / Link</strong> — sao cho giảng viên kiểm chứng được.</li>
<li>Theo đúng quy tắc bằng chứng: thư mục Drive chia sẻ, file đặt tên <code>GroupX_SessionY_Activity</code>, mỗi file thể hiện prompt, câu trả lời và phần xử lý tiếp của bạn.</li>
<li>Giữ báo cáo khớp với GitLab, Project Tracking và buổi demo.</li>
</ul></div>
<h3>Template5 trong một màn hình — bốn sheet</h3>
<table>
<thead><tr><th>Sheet</th><th>Chứa gì</th></tr></thead>
<tbody>
<tr><td><strong>0.Overview</strong></td><td>Môn, lớp, học kỳ, giảng viên, nhóm, tên đề tài + danh sách sinh viên (mã, tên, vai trò trong nhóm, công cụ AI đã dùng)</td></tr>
<tr><td><strong>1. Week 1</strong></td><td>Sổ ghi tuần 1: mỗi lần dùng AI một dòng, 10 cột</td></tr>
<tr><td><strong>2. Week n</strong></td><td>Cùng bảng đó — nhân bản cho mỗi tuần tiếp theo</td></tr>
<tr><td><strong>Instruction</strong></td><td>Cách điền từng cột, gồm cả quy tắc đặt tên bằng chứng</td></tr>
</tbody>
</table>`));

P82.push(slide('g-subject', 6, 'Iteration Submit Items',
`<p class="y-chinh">🎯 The iteration package is Project Tracking + RDS + links (demo videos, GitLab tag, DB scripts); the 2026 templates add the AI Usage Report beside them.</p>
<p class="nhan">What this page lists</p>
<ul>
<li><strong>Project Tracking</strong> — requirement sheet + status of this iteration's screens + plan for the next one.</li>
<li><strong>RDS document</strong> — requirement &amp; design specs of this iteration and updates to earlier ones.</li>
<li><strong>Links</strong> — each member's demo video, the tagged source code, DB scripts inside the tag.</li>
</ul>
<p class="nhan">Where the AI report fits</p>
<ul>
<li><strong>Same rhythm</strong> — the report is kept per week, so it is ready whenever the package is due.</li>
<li><strong>Same facts</strong> — a row saying "AI drafted the DB script" must match the DB script in the tag.</li>
<li><strong>Ask the teacher</strong> — whether it is submitted with every iteration or once at the end; this page predates Template5.</li>
</ul>`,
`<p class="y-chinh">🎯 Bộ nộp mỗi iteration gồm Project Tracking + RDS + các link (video demo, tag GitLab, DB script); template 2026 thêm AI Usage Report đi cùng.</p>
<p class="nhan">Trang này liệt kê gì</p>
<ul>
<li><strong>Project Tracking</strong> — sheet yêu cầu + trạng thái các màn hình của iteration này + kế hoạch cho iteration sau.</li>
<li><strong>Tài liệu RDS</strong> — đặc tả yêu cầu &amp; thiết kế của iteration này và phần cập nhật cho các iteration trước.</li>
<li><strong>Các link</strong> — video demo của từng thành viên, source code đã gắn tag, DB script nằm trong tag.</li>
</ul>
<p class="nhan">AI report nằm ở đâu</p>
<ul>
<li><strong>Cùng nhịp</strong> — báo cáo ghi theo tuần, nên lúc nào tới hạn nộp cũng sẵn sàng.</li>
<li><strong>Cùng sự thật</strong> — dòng ghi "AI phác DB script" phải khớp với DB script trong tag.</li>
<li><strong>Hỏi giảng viên</strong> — nộp kèm mỗi iteration hay một lần cuối kỳ; trang slide này có trước Template5.</li>
</ul>`));

P82.push(bi(`<h2>🧾 Sheet 0.Overview — field by field</h2>
<ol class="hai-cot">
<li><strong>Subject Code</strong> — SWP391</li>
<li><strong>Subject Name</strong> — Software Development Project</li>
<li><strong>Class Code</strong> — your class, as on FAP</li>
<li><strong>Semester</strong> — e.g. Fall 2026</li>
<li><strong>Lecturer Name</strong> — your class teacher</li>
<li><strong>Group Code</strong> — the same code used in file names (G3, Group3…)</li>
<li><strong>Project Title</strong> — identical to the RDS and Project Tracking</li>
<li><strong>StudentCode / StudentName</strong> — one row per member</li>
<li><strong>Role In Group</strong> — Leader or Member (add a focus if useful: "Member — DB owner")</li>
<li><strong>AI Tool Used</strong> — every tool that member used (the template spells it "Usaged")</li>
</ol>
<h2>📋 The weekly sheet — the 10 columns</h2>
<table>
<thead><tr><th>Column</th><th>What to write (Instruction sheet)</th><th>Good</th><th>Weak</th></tr></thead>
<tbody>
<tr><td>No.</td><td>Running number 1, 2, 3…</td><td>1, 2, 3</td><td>2, 2, 2 (copied rows)</td></tr>
<tr><td>SDLC Phase</td><td>Requirement · Design · Implementation · Testing · Reporting</td><td>Design</td><td>"Project"</td></tr>
<tr><td>Task / Activity</td><td>The specific task</td><td>ERD for iteration 1 entities</td><td>"Use AI"</td></tr>
<tr><td>AI Tool Used</td><td>Name of the tool</td><td>Claude</td><td>"AI"</td></tr>
<tr><td>AI Output</td><td>Summary of what it produced</td><td>14 entities + traceability matrix</td><td>"Good result"</td></tr>
<tr><td>Student's Validation / Modification</td><td>How you checked and changed it</td><td>Removed 3 entities with no UC, fixed 2 cardinalities</td><td>"Checked"</td></tr>
<tr><td>Evidence / Link</td><td>Drive folder link with screenshots / videos</td><td>Link to Group3_Session5_ERD.png</td><td>"Available on request"</td></tr>
<tr><td>Quantitative Measure</td><td>Numbers: stories, entities, classes, LOC, test cases</td><td>11 entities, 14 relationships</td><td>"Many"</td></tr>
<tr><td>Value Added (1–5)</td><td>Self-assessment: 1 not useful … 5 very useful</td><td>4</td><td>5 on every row</td></tr>
<tr><td>Risks / Limitations Observed</td><td>What went wrong or could have</td><td>Wrong cardinality Application–Interview</td><td>"None"</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> the three columns a teacher checks first form one sentence — "AI gave <em>Output</em>, I did <em>Modification</em>, here is the <em>Evidence</em>".</p>`,
`<h2>🧾 Sheet 0.Overview — từng trường</h2>
<ol class="hai-cot">
<li><strong>Subject Code</strong> — SWP391</li>
<li><strong>Subject Name</strong> — Software Development Project</li>
<li><strong>Class Code</strong> — mã lớp như trên FAP</li>
<li><strong>Semester</strong> — ví dụ Fall 2026</li>
<li><strong>Lecturer Name</strong> — giảng viên lớp</li>
<li><strong>Group Code</strong> — đúng mã dùng trong tên file (G3, Group3…)</li>
<li><strong>Project Title</strong> — trùng khớp với RDS và Project Tracking</li>
<li><strong>StudentCode / StudentName</strong> — mỗi thành viên một dòng</li>
<li><strong>Role In Group</strong> — Leader hoặc Member (có thể ghi thêm mảng chính: "Member — phụ trách DB")</li>
<li><strong>AI Tool Used</strong> — mọi công cụ thành viên đó đã dùng (template ghi là "Usaged")</li>
</ol>
<h2>📋 Sheet theo tuần — 10 cột</h2>
<table>
<thead><tr><th>Cột</th><th>Viết gì (theo sheet Instruction)</th><th>Tốt</th><th>Yếu</th></tr></thead>
<tbody>
<tr><td>No.</td><td>Số thứ tự 1, 2, 3…</td><td>1, 2, 3</td><td>2, 2, 2 (dòng chép lại)</td></tr>
<tr><td>SDLC Phase</td><td>Requirement · Design · Implementation · Testing · Reporting</td><td>Design</td><td>"Dự án"</td></tr>
<tr><td>Task / Activity</td><td>Việc cụ thể</td><td>ERD cho các entity của iteration 1</td><td>"Dùng AI"</td></tr>
<tr><td>AI Tool Used</td><td>Tên công cụ</td><td>Claude</td><td>"AI"</td></tr>
<tr><td>AI Output</td><td>Tóm tắt thứ nó tạo ra</td><td>14 entity + traceability matrix</td><td>"Kết quả tốt"</td></tr>
<tr><td>Student's Validation / Modification</td><td>Bạn đã kiểm và sửa thế nào</td><td>Bỏ 3 entity không có UC, sửa 2 bản số quan hệ</td><td>"Đã kiểm tra"</td></tr>
<tr><td>Evidence / Link</td><td>Link thư mục Drive chứa ảnh / video</td><td>Link tới Group3_Session5_ERD.png</td><td>"Có khi cần"</td></tr>
<tr><td>Quantitative Measure</td><td>Con số: số story, entity, class, LOC, test case</td><td>11 entity, 14 quan hệ</td><td>"Nhiều"</td></tr>
<tr><td>Value Added (1–5)</td><td>Tự đánh giá: 1 không hữu ích … 5 rất hữu ích</td><td>4</td><td>Dòng nào cũng 5</td></tr>
<tr><td>Risks / Limitations Observed</td><td>Điều gì đã sai hoặc có thể sai</td><td>Sai bản số quan hệ Application–Interview</td><td>"Không có"</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ba cột giảng viên xem đầu tiên ghép thành một câu — "AI đưa ra <em>Output</em>, em đã <em>Modification</em>, đây là <em>Evidence</em>".</p>`));

P82.push(bi(`<h2>📸 Evidence rules (Instruction sheet, column Evidence / Link)</h2>
<p class="nhan">The three rules</p>
<ol>
<li><strong>One shared Google Drive folder</strong> holds the screenshots / videos of the AI chat sessions; the cell holds its link.</li>
<li><strong>Naming: <code>GroupX_SessionY_Activity</code></strong> — e.g. <code>Group5_Session2_UserStory.png</code>.</li>
<li><strong>Each file clearly shows three things</strong>: the prompt, the AI response, and the student follow-up.</li>
</ol>
<p class="nhan">Making the rules work in practice</p>
<ul>
<li><strong>Number sessions for the whole project</strong> — Session1, Session2 … across all weeks, so a name never repeats.</li>
<li><strong>Long answers</strong> — use several numbered images (<code>Group3_Session5_ERD_1.png</code>, <code>_2</code>) or a short screen video.</li>
<li><strong>Follow-up</strong> — the next message where you correct the AI, or a before/after of the file you edited.</li>
<li><strong>Folder per week</strong> — <code>AI-Evidence/Week1/</code>… mirrors the sheets.</li>
<li><strong>Sharing</strong> — "anyone with the link can view" inside the university domain, so the teacher never gets an access request at grading time.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Screenshots can leak too.</strong> Before you save a screenshot, check it for DB passwords, Mailtrap tokens, personal e-mail threads or classmates' data in the chat sidebar. Crop or blur them.</div>
<h3>Traps inside the template itself</h3>
<ul>
<li><strong>Sample rows</strong> — cell B2 says "&lt;&lt;sample data&gt;&gt;" and the ERD sample row is copied nine times with No. = 2. Delete all sample rows before your first entry.</li>
<li><strong>"Week n"</strong> — duplicate it and rename "2. Week 2", "3. Week 3"… — never overwrite last week.</li>
<li><strong>Value Added</strong> — a column of 5s reads as untrue; low scores with an honest risk are more credible.</li>
</ul>`,
`<h2>📸 Quy tắc bằng chứng (sheet Instruction, cột Evidence / Link)</h2>
<p class="nhan">Ba quy tắc</p>
<ol>
<li><strong>Một thư mục Google Drive chia sẻ</strong> chứa ảnh chụp / video các phiên chat với AI; ô trong bảng chứa link của nó.</li>
<li><strong>Đặt tên: <code>GroupX_SessionY_Activity</code></strong> — ví dụ <code>Group5_Session2_UserStory.png</code>.</li>
<li><strong>Mỗi file thể hiện rõ ba thứ</strong>: prompt, câu trả lời của AI, và phần xử lý tiếp của sinh viên.</li>
</ol>
<p class="nhan">Để quy tắc chạy được trong thực tế</p>
<ul>
<li><strong>Đánh số phiên cho cả dự án</strong> — Session1, Session2 … xuyên suốt các tuần, để tên không bao giờ trùng.</li>
<li><strong>Câu trả lời dài</strong> — dùng nhiều ảnh đánh số (<code>Group3_Session5_ERD_1.png</code>, <code>_2</code>) hoặc một video quay màn hình ngắn.</li>
<li><strong>Phần xử lý tiếp</strong> — tin nhắn tiếp theo bạn sửa lại AI, hoặc ảnh trước/sau của file bạn đã chỉnh.</li>
<li><strong>Mỗi tuần một thư mục</strong> — <code>AI-Evidence/Week1/</code>… khớp với các sheet.</li>
<li><strong>Chia sẻ</strong> — "ai có link đều xem được" trong domain trường, để lúc chấm giảng viên không phải gửi yêu cầu truy cập.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Ảnh chụp cũng có thể làm lộ.</strong> Trước khi lưu ảnh, soát xem có mật khẩu DB, token Mailtrap, e-mail cá nhân hay dữ liệu của bạn cùng lớp ở thanh bên của khung chat không. Cắt hoặc làm mờ đi.</div>
<h3>Bẫy nằm ngay trong template</h3>
<ul>
<li><strong>Dòng mẫu</strong> — ô B2 ghi "&lt;&lt;sample data&gt;&gt;" và dòng mẫu ERD bị chép chín lần với No. = 2. Xoá hết dòng mẫu trước khi ghi dòng đầu tiên.</li>
<li><strong>"Week n"</strong> — nhân bản rồi đổi tên "2. Week 2", "3. Week 3"… — đừng ghi đè lên tuần trước.</li>
<li><strong>Value Added</strong> — cả cột toàn điểm 5 đọc lên thấy không thật; điểm thấp kèm rủi ro trung thực đáng tin hơn.</li>
</ul>`));

P82.push(bi(`<h2>🛠️ Worked example — a full AI log for iteration 1</h2>
<p><strong>Setting.</strong> Group 3 builds the Job Board System in Java web + MySQL 8. Iteration 1 = 6 slots of 135', about three weeks. The team ran prompts 1–7 and 9 of the pipeline, and used AI twice while coding. Numbers below are the team's own counts.</p>
<h3>Sheet "1. Week 1" — requirement</h3>
<table>
<thead><tr><th>No.</th><th>Phase</th><th>Task</th><th>Tool</th><th>AI Output</th><th>Validation / Modification</th><th>Evidence</th><th>Measure</th><th>Value</th><th>Risks</th></tr></thead>
<tbody>
<tr><td>1</td><td>Requirement</td><td>PRD via BA Q&amp;A (prompt 1)</td><td>Claude</td><td>14 questions + PRD with 22 functions</td><td>Asked the teacher 6 questions in the Slack thread; removed 9 functions nobody requested</td><td>Group3_Session1_PRD.png</td><td>13 of 22 functions kept</td><td>4</td><td>Invented online tests and salary statistics</td></tr>
<tr><td>2</td><td>Requirement</td><td>Context diagram (prompt 2)</td><td>Claude</td><td>.drawio file, 5 external entities</td><td>File would not open; asked for Mermaid, redrew in draw.io; removed an internal "CV parser" box</td><td>Group3_Session2_ContextDiagram.png</td><td>1 diagram, 4 actors + SMTP</td><td>3</td><td>Malformed XML; internal module drawn</td></tr>
<tr><td>3</td><td>Requirement</td><td>Business flows (prompt 3)</td><td>Claude</td><td>6 flows</td><td>Merged 2 duplicate flows; added "reject at any round", confirmed by the teacher</td><td>Group3_Session3_BizFlows.png</td><td>5 flows, 38 steps</td><td>4</td><td>Reject path missing</td></tr>
<tr><td>4</td><td>Requirement</td><td>Use-case spec (prompt 4)</td><td>ChatGPT</td><td>31 UCs</td><td>Kept 18 for the 3 iterations; fully specified the 6 of iteration 1; rewrote 4 alternative flows</td><td>Group3_Session4_UCSpec.png</td><td>18 UCs, 6 specified</td><td>4</td><td>UCs too fine ("click Save")</td></tr>
</tbody>
</table>
<h3>Sheet "2. Week 2" — design</h3>
<table>
<thead><tr><th>No.</th><th>Phase</th><th>Task</th><th>Tool</th><th>AI Output</th><th>Validation / Modification</th><th>Evidence</th><th>Measure</th><th>Value</th><th>Risks</th></tr></thead>
<tbody>
<tr><td>5</td><td>Design</td><td>ERD + traceability (prompt 5)</td><td>Claude</td><td>14 entities, 31-row matrix</td><td>Removed 3 entities with no UC; added UNIQUE(candidate, job); matrix cut to the 18 UCs</td><td>Group3_Session5_ERD.png</td><td>11 entities, 14 relationships</td><td>5</td><td>Wrong cardinality Application–Interview</td></tr>
<tr><td>6</td><td>Design</td><td>UI spec, iteration-1 screens (prompt 6)</td><td>Claude</td><td>12 screen specs</td><td>Kept the 8 screens of iteration 1; replaced the invented style guide with the AdminLTE theme; field counts aligned with the Product sheet</td><td>Group3_Session6_UISpec.png</td><td>8 screens, 71 fields</td><td>4</td><td>Invented palette; routes inconsistent</td></tr>
<tr><td>7</td><td>Design</td><td>MySQL schema + demo data (prompt 7)</td><td>Claude</td><td>DDL for 11 tables + 120 demo rows</td><td>Fixed 2 FK-order errors on MySQL 8; set utf8mb4; replaced realistic phone numbers with 0900000xxx</td><td>Group3_Session7_DBScript.png</td><td>11 tables, 120 rows</td><td>4</td><td>Script failed on first run</td></tr>
</tbody>
</table>`,
`<h2>🛠️ Ví dụ có lời giải — sổ ghi AI trọn iteration 1</h2>
<p><strong>Bối cảnh.</strong> Nhóm 3 làm Job Board System bằng Java web + MySQL 8. Iteration 1 = 6 slot 135', khoảng ba tuần. Nhóm chạy prompt 1–7 và 9 của chuỗi, và dùng AI hai lần khi code. Các con số dưới đây là nhóm tự đếm.</p>
<h3>Sheet "1. Week 1" — yêu cầu</h3>
<table>
<thead><tr><th>No.</th><th>Phase</th><th>Task</th><th>Tool</th><th>AI Output</th><th>Validation / Modification</th><th>Evidence</th><th>Measure</th><th>Value</th><th>Risks</th></tr></thead>
<tbody>
<tr><td>1</td><td>Requirement</td><td>PRD qua hỏi đáp BA (prompt 1)</td><td>Claude</td><td>14 câu hỏi + PRD 22 chức năng</td><td>Hỏi giảng viên 6 câu trong thread Slack; bỏ 9 chức năng không ai yêu cầu</td><td>Group3_Session1_PRD.png</td><td>Giữ 13/22 chức năng</td><td>4</td><td>Bịa thi online và thống kê lương</td></tr>
<tr><td>2</td><td>Requirement</td><td>Context diagram (prompt 2)</td><td>Claude</td><td>File .drawio, 5 thực thể ngoài</td><td>File không mở được; xin bản Mermaid, vẽ lại bằng draw.io; bỏ khối nội bộ "CV parser"</td><td>Group3_Session2_ContextDiagram.png</td><td>1 sơ đồ, 4 actor + SMTP</td><td>3</td><td>XML hỏng; vẽ cả module bên trong</td></tr>
<tr><td>3</td><td>Requirement</td><td>Luồng nghiệp vụ (prompt 3)</td><td>Claude</td><td>6 luồng</td><td>Gộp 2 luồng trùng; thêm "từ chối ở vòng bất kỳ", giảng viên đã xác nhận</td><td>Group3_Session3_BizFlows.png</td><td>5 luồng, 38 bước</td><td>4</td><td>Thiếu nhánh từ chối</td></tr>
<tr><td>4</td><td>Requirement</td><td>Đặc tả UC (prompt 4)</td><td>ChatGPT</td><td>31 UC</td><td>Giữ 18 UC cho 3 iteration; đặc tả đầy đủ 6 UC của iteration 1; viết lại 4 luồng thay thế</td><td>Group3_Session4_UCSpec.png</td><td>18 UC, 6 đã đặc tả</td><td>4</td><td>UC quá vụn ("bấm Lưu")</td></tr>
</tbody>
</table>
<h3>Sheet "2. Week 2" — thiết kế</h3>
<table>
<thead><tr><th>No.</th><th>Phase</th><th>Task</th><th>Tool</th><th>AI Output</th><th>Validation / Modification</th><th>Evidence</th><th>Measure</th><th>Value</th><th>Risks</th></tr></thead>
<tbody>
<tr><td>5</td><td>Design</td><td>ERD + truy vết (prompt 5)</td><td>Claude</td><td>14 entity, matrix 31 dòng</td><td>Bỏ 3 entity không có UC; thêm UNIQUE(candidate, job); matrix rút về 18 UC</td><td>Group3_Session5_ERD.png</td><td>11 entity, 14 quan hệ</td><td>5</td><td>Sai bản số Application–Interview</td></tr>
<tr><td>6</td><td>Design</td><td>UI spec các màn hình iteration 1 (prompt 6)</td><td>Claude</td><td>12 screen spec</td><td>Giữ 8 màn hình của iteration 1; thay style guide tự bịa bằng theme AdminLTE; số field khớp sheet Product</td><td>Group3_Session6_UISpec.png</td><td>8 màn hình, 71 field</td><td>4</td><td>Bảng màu tự bịa; route không thống nhất</td></tr>
<tr><td>7</td><td>Design</td><td>Schema MySQL + dữ liệu demo (prompt 7)</td><td>Claude</td><td>DDL 11 bảng + 120 dòng demo</td><td>Sửa 2 lỗi thứ tự FK trên MySQL 8; đặt utf8mb4; thay số điện thoại trông như thật bằng 0900000xxx</td><td>Group3_Session7_DBScript.png</td><td>11 bảng, 120 dòng</td><td>4</td><td>Script lỗi ở lần chạy đầu</td></tr>
</tbody>
</table>`));

P82.push(bi(`<h3>Sheet "3. Week 3" — implementation, testing, reporting</h3>
<table>
<thead><tr><th>No.</th><th>Phase</th><th>Task</th><th>Tool</th><th>AI Output</th><th>Validation / Modification</th><th>Evidence</th><th>Measure</th><th>Value</th><th>Risks</th></tr></thead>
<tbody>
<tr><td>8</td><td>Implementation</td><td>Login + role filter (common module)</td><td>GitHub Copilot</td><td>LoginServlet + AuthFilter draft</td><td>Replaced MD5 with BCrypt; added session timeout and role check per URL; owner rehearsed explaining it</td><td>Group3_Session8_Login.mp4</td><td>2 classes, ~140 of ~210 lines kept</td><td>3</td><td>Suggested a broken hash (MD5)</td></tr>
<tr><td>9</td><td>Implementation</td><td>SCR-07 Job List search</td><td>ChatGPT</td><td>JobDAO.search draft</td><td>Rewrote with PreparedStatement; added status filter, ordering; fixed paging (lesson 8.1)</td><td>Group3_Session9_JobSearch.png</td><td>1 method, 4 defects fixed</td><td>3</td><td>SQL injection despite the prompt</td></tr>
<tr><td>10</td><td>Testing</td><td>Test cases, 8 screens (prompt 9)</td><td>Claude</td><td>64 test cases</td><td>Rewrote expected results from the UI spec; removed 12 duplicates; added 9 boundary cases</td><td>Group3_Session10_TestCases.png</td><td>61 cases in Template3</td><td>4</td><td>Expected results copied from code behaviour</td></tr>
<tr><td>11</td><td>Reporting</td><td>Weekly report wording</td><td>ChatGPT</td><td>Polished text</td><td>Kept the facts; rejected an invented "100% complete"</td><td>Group3_Session11_Weekly.png</td><td>1 report</td><td>2</td><td>Overstated progress</td></tr>
</tbody>
</table>
<h3>What this log tells the teacher</h3>
<ul>
<li><strong>AI was a drafter</strong> — every row shows a change by a person; nothing went in untouched.</li>
<li><strong>Numbers can be checked</strong> — 11 tables in the log = 11 tables in the DB script of tag <code>iter1</code>; 61 cases = rows in Template3; 8 screens = the Product sheet.</li>
<li><strong>Risks are real</strong> — injection, weak hashing and invented features were caught; that is the team's own quality work.</li>
</ul>
<h2>🔍 Consistency checks before you submit</h2>
<ol>
<li><strong>GitLab</strong> — each Implementation row has a commit or merge request by the same member in the same week.</li>
<li><strong>Project Tracking</strong> — screens named in the log exist in the Product sheet with the same IDs.</li>
<li><strong>Weekly Report (Template6)</strong> — the same week, the same tasks, the same status.</li>
<li><strong>Demo</strong> — the owner of every AI-assisted screen can explain and change it live.</li>
<li><strong>Overview</strong> — the tools in each student's row match the tools in that student's log entries.</li>
</ol>`,
`<h3>Sheet "3. Week 3" — hiện thực, kiểm thử, báo cáo</h3>
<table>
<thead><tr><th>No.</th><th>Phase</th><th>Task</th><th>Tool</th><th>AI Output</th><th>Validation / Modification</th><th>Evidence</th><th>Measure</th><th>Value</th><th>Risks</th></tr></thead>
<tbody>
<tr><td>8</td><td>Implementation</td><td>Đăng nhập + filter phân quyền (module chung)</td><td>GitHub Copilot</td><td>Bản nháp LoginServlet + AuthFilter</td><td>Thay MD5 bằng BCrypt; thêm timeout session và kiểm role theo URL; người phụ trách tập giải thích lại</td><td>Group3_Session8_Login.mp4</td><td>2 class, giữ ~140/~210 dòng</td><td>3</td><td>Gợi ý hàm băm đã hỏng (MD5)</td></tr>
<tr><td>9</td><td>Implementation</td><td>Tìm kiếm SCR-07 Job List</td><td>ChatGPT</td><td>Bản nháp JobDAO.search</td><td>Viết lại bằng PreparedStatement; thêm lọc status, sắp xếp; sửa phân trang (bài 8.1)</td><td>Group3_Session9_JobSearch.png</td><td>1 method, sửa 4 lỗi</td><td>3</td><td>SQL injection dù prompt đã dặn</td></tr>
<tr><td>10</td><td>Testing</td><td>Test case cho 8 màn hình (prompt 9)</td><td>Claude</td><td>64 test case</td><td>Viết lại kết quả mong đợi theo UI spec; bỏ 12 case trùng; thêm 9 case biên</td><td>Group3_Session10_TestCases.png</td><td>61 case trong Template3</td><td>4</td><td>Kết quả mong đợi chép theo hành vi code</td></tr>
<tr><td>11</td><td>Reporting</td><td>Câu chữ weekly report</td><td>ChatGPT</td><td>Văn bản đã trau chuốt</td><td>Giữ nguyên sự thật; bỏ câu bịa "hoàn thành 100%"</td><td>Group3_Session11_Weekly.png</td><td>1 báo cáo</td><td>2</td><td>Nói quá tiến độ</td></tr>
</tbody>
</table>
<h3>Sổ ghi này nói gì với giảng viên</h3>
<ul>
<li><strong>AI chỉ là người viết nháp</strong> — dòng nào cũng có thay đổi do người làm; không có gì vào nguyên xi.</li>
<li><strong>Con số kiểm được</strong> — 11 bảng trong sổ = 11 bảng trong DB script của tag <code>iter1</code>; 61 case = số dòng trong Template3; 8 màn hình = sheet Product.</li>
<li><strong>Rủi ro là thật</strong> — injection, băm yếu và tính năng bịa đều bị bắt; đó chính là công sức đảm bảo chất lượng của nhóm.</li>
</ul>
<h2>🔍 Soát khớp trước khi nộp</h2>
<ol>
<li><strong>GitLab</strong> — mỗi dòng Implementation có commit hoặc merge request của đúng thành viên đó trong đúng tuần đó.</li>
<li><strong>Project Tracking</strong> — màn hình nhắc trong sổ có trong sheet Product với cùng ID.</li>
<li><strong>Weekly Report (Template6)</strong> — cùng tuần, cùng việc, cùng trạng thái.</li>
<li><strong>Demo</strong> — người phụ trách mọi màn hình có AI hỗ trợ giải thích và sửa được tại chỗ.</li>
<li><strong>Overview</strong> — công cụ ghi ở dòng của mỗi sinh viên khớp với công cụ trong các dòng log của sinh viên đó.</li>
</ol>`));

P82.push(bi(`<h2>❌ Mistakes that cost trust (and marks)</h2>
<ul>
<li><strong>Filled on the last night</strong> — thirty rows dated the same day, screenshots missing. Log the same day you use the tool.</li>
<li><strong>Evidence link that asks for access</strong> — the teacher will not request it; the row counts as unproven.</li>
<li><strong>Only the leader's rows</strong> — every member used AI; every member appears.</li>
<li><strong>"Checked, OK"</strong> in the Modification column — says nothing; name what you changed.</li>
<li><strong>Hiding a tool</strong> — Copilot autocompletion is AI use too. Under-reporting is worse than reporting a lot.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Disclosure the way industry does it.</strong>
<ul>
<li><strong>Commit messages</strong> — some teams and open-source projects ask contributors to mark AI-assisted commits with an extra line in the message. It makes the log and the Git history tell the same story.</li>
<li><strong>Measure, do not guess</strong> — "lines kept vs lines generated" (row 8: ~140 of ~210) is a real metric teams use to see whether a tool saves time or only moves work into review.</li>
<li><strong>Tool terms</strong> — free and paid AI plans differ on whether your chats may be used for training; check before pasting project code.</li>
</ul></div>`,
`<h2>❌ Lỗi làm mất lòng tin (và mất điểm)</h2>
<ul>
<li><strong>Điền vào đêm cuối</strong> — ba mươi dòng cùng một ngày, thiếu ảnh chụp. Hãy ghi ngay trong ngày dùng công cụ.</li>
<li><strong>Link bằng chứng đòi quyền truy cập</strong> — giảng viên sẽ không xin quyền; dòng đó bị coi là chưa chứng minh.</li>
<li><strong>Chỉ có dòng của leader</strong> — thành viên nào cũng dùng AI; thành viên nào cũng phải xuất hiện.</li>
<li><strong>"Đã kiểm, OK"</strong> ở cột Modification — không nói lên gì; hãy ghi rõ đã sửa gì.</li>
<li><strong>Giấu một công cụ</strong> — gợi ý tự động của Copilot cũng là dùng AI. Khai thiếu tệ hơn khai nhiều.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Khai báo theo cách của ngành.</strong>
<ul>
<li><strong>Commit message</strong> — một số nhóm và dự án mã nguồn mở yêu cầu đánh dấu commit có AI hỗ trợ bằng một dòng thêm trong message. Nhờ đó sổ ghi và lịch sử Git kể cùng một câu chuyện.</li>
<li><strong>Đo, đừng đoán</strong> — "số dòng giữ lại / số dòng AI sinh" (dòng 8: ~140/~210) là số đo thật mà các nhóm dùng để biết công cụ giúp tiết kiệm thời gian hay chỉ dồn việc sang khâu review.</li>
<li><strong>Điều khoản công cụ</strong> — gói AI miễn phí và trả phí khác nhau ở chỗ cuộc chat có thể bị dùng để huấn luyện hay không; kiểm tra trước khi dán code dự án.</li>
</ul></div>`));

P82.push(books([
  ['sommerville', 'ch. 1 §1.2 Software engineering ethics · ch. 22 Project management (reporting)', 'chương 1 §1.2 Đạo đức kỹ nghệ phần mềm · chương 22 Quản lý dự án (báo cáo)'],
  ['wiegers', 'ch. 29 Links in the requirements chain — the same traceability idea the log relies on', 'chương 29 Truy vết yêu cầu — cùng ý tưởng truy vết mà sổ ghi dựa vào'],
]));

const L82 = {
  title: '8.2 — The AI Usage Report (Template5): a full worked log of one iteration|||8.2 — AI Usage Report (Template5): sổ ghi mẫu trọn một iteration',
  slug: 'swp391-8-2-ai-usage-log',
  type: 'VIDEO',
  description: 'Template5 từng sheet, từng cột (0.Overview, Week 1…n, Instruction), quy tắc bằng chứng GroupX_SessionY_Activity (prompt + trả lời + xử lý tiếp), sổ ghi mẫu 11 dòng cho iteration 1 của Job Board System và cách soát khớp với GitLab, Project Tracking, demo.',
  content: P82.join('\n'),
};

/* ─────────────────────── Quiz 8 ─────────────────────── */
// Correct answers are written first-hand in any slot; this spreads them over A–D so the key is not guessable.
// Numeric option lists (percentages, team sizes…) keep their natural order.
let qn = 0;
const q = (question, options, correctIndex, explanation) => {
  const target = [2, 0, 3, 1][qn++ % 4];
  if (options.every((o) => /^[0-9]/.test(o))) return { question, options, correctIndex, explanation, points: 1 };
  const opts = options.slice();
  const [right] = opts.splice(correctIndex, 1);
  opts.splice(target, 0, right);
  return { question, options: opts, correctIndex: target, explanation, points: 1 };
};
const QUIZ8 = {
  title: 'Quiz 8 — Responsible AI: the prompt pipeline & the AI Usage Report|||Quiz 8 — AI có trách nhiệm: chuỗi prompt & AI Usage Report',
  slug: 'swp391-quiz-8',
  type: 'QUIZ',
  description: 'Kiểm tra chuỗi 9 prompt, cách review đầu ra AI, các bẫy và cách điền AI Usage Report (Template5).',
  quiz: {
    timeLimitSeconds: 1500,
    questions: [
      q('In Claude_Prompts.txt, what does prompt 1 ask the AI to do BEFORE writing the PRD?|||Trong Claude_Prompts.txt, prompt 1 yêu cầu AI làm gì TRƯỚC khi viết PRD?', ['Draw the ERD|||Vẽ ERD', 'Act as a senior BA and ask clarifying questions|||Đóng vai senior BA và đặt câu hỏi làm rõ', 'Generate the MySQL script|||Sinh script MySQL', 'Write test cases|||Viết test case'], 1, 'The PRD is written only after the BA-style questions are answered.|||PRD chỉ được viết sau khi các câu hỏi kiểu BA đã được trả lời.'),
      q('In SWP391, who should answer the AI\'s clarifying questions about requirements?|||Trong SWP391, ai nên trả lời các câu hỏi làm rõ yêu cầu mà AI đặt ra?', ['The AI itself|||Chính AI', 'Any team member, by guessing|||Bất kỳ thành viên nào, bằng cách đoán', 'The teacher, who acts as customer/PO|||Giảng viên, người đóng vai khách hàng/PO', 'Another team\'s leader|||Leader của nhóm khác'], 2, 'The Subject Guides say the teacher is both coach and customer/PO, the final point to confirm requirements.|||Subject Guides ghi giảng viên vừa là coach vừa là khách hàng/PO, là nơi chốt yêu cầu cuối cùng.'),
      q('Which file does prompt 5 produce, and what extra table does it require?|||Prompt 5 tạo ra file nào, và đòi thêm bảng gì?', ['JBS4_ERD.md with a traceability matrix|||JBS4_ERD.md kèm traceability matrix', 'JBS6_Database.sql with indexes|||JBS6_Database.sql kèm index', 'JBS5_SRS.md with a sitemap|||JBS5_SRS.md kèm sitemap', 'TDS.md with a milestone map|||TDS.md kèm bảng milestone'], 0, 'Prompt 5 asks for entities, relations, attributes and a traceability matrix linking UCs, PRD functions, business flows and entities.|||Prompt 5 đòi entity, quan hệ, thuộc tính và traceability matrix nối UC, chức năng PRD, luồng nghiệp vụ và entity.'),
      q('Why does prompt 7 ask for TWO SQL files?|||Vì sao prompt 7 đòi HAI file SQL?', ['MySQL cannot run one big file|||MySQL không chạy được một file lớn', 'One creates the structure, the other loads demo data that can be reset anytime|||Một file tạo cấu trúc, file kia nạp dữ liệu demo có thể dựng lại bất cứ lúc nào', 'One is for Windows, one for Linux|||Một cho Windows, một cho Linux', 'The teacher grades each file separately|||Giảng viên chấm riêng từng file'], 1, 'Structure and data change at different speeds; a demo-data script lets anyone rebuild a clean demo.|||Cấu trúc và dữ liệu thay đổi khác nhịp; script dữ liệu demo cho phép ai cũng dựng lại bản demo sạch.'),
      q('Prompt 8 forbids writing "..." or "etc." in file lists. Why?|||Prompt 8 cấm viết "..." hay "v.v." trong danh sách file. Vì sao?', ['To make the document shorter|||Để tài liệu ngắn hơn', 'Models tend to shorten long lists, leaving files nobody planned|||Model hay rút gọn danh sách dài, để lại những file không ai lên kế hoạch', 'Markdown cannot show dots|||Markdown không hiển thị được dấu chấm', 'It is a style rule of FPT|||Đó là quy tắc trình bày của FPT'], 1, 'A complete list is what makes the milestone-to-file map usable for planning.|||Danh sách đầy đủ mới làm bảng milestone-file dùng được cho lập kế hoạch.'),
      q('What is special about prompt 9?|||Prompt 9 có gì đặc biệt?', ['It asks for the source code|||Nó xin source code', 'It asks which inputs and prompts the AI needs before creating unit, integration and E2E tests|||Nó hỏi AI cần đầu vào và prompt nào trước khi tạo unit, integration và E2E test', 'It asks for the presentation slides|||Nó xin slide thuyết trình', 'It deletes previous documents|||Nó xoá tài liệu trước đó'], 1, 'Expected results must come from specifications, so the prompt first asks what inputs are needed.|||Kết quả mong đợi phải đến từ đặc tả, nên prompt hỏi trước cần đầu vào gì.'),
      q('A test case whose expected result was copied from what the code currently does…|||Một test case có kết quả mong đợi chép theo hành vi hiện tại của code…', ['is the best kind of test|||là loại test tốt nhất', 'only confirms current behaviour, bugs included|||chỉ xác nhận hành vi hiện có, kể cả bug', 'is required by Template3|||là yêu cầu của Template3', 'finds more defects|||tìm được nhiều lỗi hơn'], 1, 'Expected results come from the UC, UI spec or business rule, not from the implementation.|||Kết quả mong đợi đến từ UC, UI spec hay quy tắc nghiệp vụ, không đến từ phần hiện thực.'),
      q('The PRD generated by AI contains an "online skills test" feature nobody asked for. Best action?|||PRD do AI sinh có tính năng "thi kỹ năng online" không ai yêu cầu. Nên làm gì?', ['Keep it, it adds LOC|||Giữ lại, thêm LOC', 'Remove it or raise a Q&A issue for the teacher to decide|||Bỏ đi hoặc tạo issue Q&A để giảng viên quyết', 'Implement it secretly|||Làm lén', 'Ask the AI whether it is needed|||Hỏi AI xem có cần không'], 1, 'Invented requirements are a key trap; every requirement must trace to the customer.|||Yêu cầu bịa là bẫy chính; mọi yêu cầu phải truy về khách hàng.'),
      q('LOC is graded "individually via code demo". What does that imply for AI-generated code?|||LOC được chấm "từng người qua demo code". Điều đó có ý nghĩa gì với code do AI sinh?', ['It scores double|||Được điểm gấp đôi', 'The owner must explain and change it live, or it earns nothing|||Người phụ trách phải giải thích và sửa được tại chỗ, nếu không thì không có điểm', 'It is not allowed to be demoed|||Không được đem demo', 'Only the leader demos it|||Chỉ leader được demo'], 1, 'The demo tests your understanding of the code of your own screens.|||Buổi demo kiểm tra việc bạn hiểu code màn hình của chính mình.'),
      q('Which pass condition in the Subject Guides is directly at stake if a team hides AI use?|||Điều kiện qua môn nào trong Subject Guides bị đe doạ trực tiếp nếu nhóm giấu việc dùng AI?', ['Attendance at least 80%|||Chuyên cần tối thiểu 80%', 'OG at least 5|||OG tối thiểu 5', 'No cheating found|||Không phát hiện gian lận', 'Final Presentation at least 5|||Final Presentation tối thiểu 5'], 2, '"No cheating found" is a gate: failing it fails the subject regardless of marks.|||"No cheating found" là cổng chặn: trượt là trượt môn bất kể điểm.'),
      q('What is the evidence naming convention in Template5?|||Quy ước đặt tên bằng chứng trong Template5 là gì?', ['StudentID_Date.png|||MãSV_Ngày.png', 'GroupX_SessionY_Activity|||GroupX_SessionY_Activity', 'Iteration_Screen_Version|||Iteration_Màn hình_Phiên bản', 'Any name, as long as it is in Drive|||Tên gì cũng được, miễn nằm trên Drive'], 1, 'The Instruction sheet gives GroupX_SessionY_Activity, e.g. Group5_Session2_UserStory.png.|||Sheet Instruction quy định GroupX_SessionY_Activity, ví dụ Group5_Session2_UserStory.png.'),
      q('Each evidence screenshot or video must clearly show…|||Mỗi ảnh chụp hoặc video bằng chứng phải thể hiện rõ…', ['only the final answer|||chỉ câu trả lời cuối', 'the prompt, the AI response and the student follow-up|||prompt, câu trả lời của AI và phần xử lý tiếp của sinh viên', 'the student ID card|||thẻ sinh viên', 'the teacher\'s approval|||sự đồng ý của giảng viên'], 1, 'Those three together prove what the AI did and what the student did.|||Ba thứ đó cùng chứng minh AI đã làm gì và sinh viên đã làm gì.'),
      q('Which column records HOW the team checked and changed the AI output?|||Cột nào ghi CÁCH nhóm kiểm và sửa đầu ra của AI?', ['AI Output|||AI Output', 'Quantitative Measure|||Quantitative Measure', 'Student\'s Validation / Modification|||Student\'s Validation / Modification', 'Value Added|||Value Added'], 2, 'AI Output summarises what the tool produced; Validation / Modification is the team\'s own work.|||AI Output tóm tắt thứ công cụ tạo ra; Validation / Modification là công sức của nhóm.'),
      q('"11 entities, 14 relationships" belongs in which column?|||"11 entity, 14 quan hệ" thuộc cột nào?', ['Risks / Limitations|||Risks / Limitations', 'Quantitative Measure|||Quantitative Measure', 'SDLC Phase|||SDLC Phase', 'AI Tool Used|||AI Tool Used'], 1, 'Quantitative Measure holds numerical evidence: stories, entities, classes, LOC, test cases.|||Quantitative Measure chứa bằng chứng dạng số: story, entity, class, LOC, test case.'),
      q('What does the Value Added column measure?|||Cột Value Added đo điều gì?', ['Money saved|||Số tiền tiết kiệm', 'A 1-5 self-assessment of how useful the AI was|||Tự đánh giá 1-5 về mức hữu ích của AI', 'The teacher\'s grade|||Điểm của giảng viên', 'Lines of code generated|||Số dòng code được sinh'], 1, '1 = not useful, 5 = very useful; honest low scores are more credible than all 5s.|||1 = không hữu ích, 5 = rất hữu ích; điểm thấp trung thực đáng tin hơn toàn điểm 5.'),
      q('Your template still contains nine identical ERD rows numbered 2 and the text "sample data". What should you do?|||Template của bạn vẫn còn chín dòng ERD giống hệt đánh số 2 và chữ "sample data". Nên làm gì?', ['Keep them as examples|||Giữ lại làm ví dụ', 'Delete all sample rows before logging your own entries|||Xoá hết dòng mẫu trước khi ghi dòng của nhóm', 'Renumber them 1 to 9|||Đánh số lại từ 1 đến 9', 'Hide the column No.|||Ẩn cột No.'], 1, 'Sample rows left in the report read as fake entries.|||Dòng mẫu còn sót trong báo cáo sẽ bị đọc như dòng khai giả.'),
      q('Which of these should you NEVER paste into a public AI chat?|||Thứ nào bạn KHÔNG BAO GIỜ được dán vào khung chat AI công cộng?', ['A Java compile error|||Một lỗi biên dịch Java', 'The DB password or Mailtrap credentials from your config|||Mật khẩu DB hay tài khoản Mailtrap trong file cấu hình', 'A question about JOIN syntax|||Một câu hỏi về cú pháp JOIN', 'The name of a public library|||Tên một thư viện công khai'], 1, 'Secrets and real personal data leave your control as soon as they are sent; use placeholders.|||Bí mật và dữ liệu cá nhân thật rời khỏi tầm kiểm soát ngay khi gửi; hãy dùng placeholder.'),
      q('The AI draft of JobDAO.search built SQL by string concatenation even though the prompt said PreparedStatement. What does this show?|||Bản nháp JobDAO.search của AI nối chuỗi SQL dù prompt đã dặn PreparedStatement. Điều này cho thấy gì?', ['Prompts are useless|||Prompt vô dụng', 'A good prompt helps but every output still needs review|||Prompt tốt có ích nhưng mọi đầu ra vẫn phải review', 'PreparedStatement is outdated|||PreparedStatement đã lỗi thời', 'MySQL does not support parameters|||MySQL không hỗ trợ tham số'], 1, 'Models can ignore constraints; review AI code like a teammate\'s merge request.|||Model có thể bỏ qua ràng buộc; hãy review code AI như merge request của đồng đội.'),
      q('Which check best proves the AI log is consistent with the submitted package?|||Cách soát nào chứng minh tốt nhất sổ ghi AI khớp với bộ nộp?', ['Counting emojis in the report|||Đếm emoji trong báo cáo', 'Matching numbers in the log with the DB script in the tag, Template3 rows and the Product sheet|||Đối chiếu con số trong sổ với DB script trong tag, số dòng Template3 và sheet Product', 'Asking the AI to verify it|||Nhờ AI xác minh', 'Submitting it a week late|||Nộp trễ một tuần'], 1, 'Numbers that match independent artefacts are what make the report credible.|||Con số khớp với các sản phẩm độc lập là thứ làm báo cáo đáng tin.'),
    ],
  },
};

export default {
  title: 'Chapter 8 (Advanced) — Responsible AI across the SDLC|||Chương 8 (Nâng cao) — AI có trách nhiệm xuyên suốt SDLC',
  description: 'Chuỗi 9 prompt AI của giảng viên (PRD → ERD → UI spec → MySQL → TDS → test case), cách review đầu ra, các bẫy, và cách điền AI Usage Report (Template5) có bằng chứng.',
  lessons: [L81, L82, QUIZ8],
};
