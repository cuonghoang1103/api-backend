/**
 * Tiếng Anh kỹ thuật khi đi làm — Chương 2: Viết ticket và bug report (soạn 24/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-2-1 … tak-2-5).
 * Dự án LabFlow và API "labflow-mini" là hư cấu (dựng cho bài). Mọi lệnh curl + output trong 2.2 và 2.4 là output THẬT, chạy 24/11/2026
 * trên Node 22 (node:22-alpine), mã nguồn labflow-mini.mjs in nguyên văn trong bài 2.4 (bản sửa trong đáp án che).
 * Nguồn: Connextra user story (2001), Bill Wake — INVEST (2003), Dan North — "Introducing BDD" (2006, Given/When/Then),
 * Simon Tatham — "How to Report Bugs Effectively" (1999), Mozilla — Bug Writing Guidelines, ISTQB Glossary (severity, priority),
 * MITRE CWE-209, Okta — "Unauthorized Access to Okta's Support Case Management System: Root Cause and Remediation" (3/11/2023).
 */
import { mau, saiDung, tuVung, Q } from './_chung.mjs';

const lienKet = (href, ico, tieuDe, phu) => `
<a class="link-card lien-ket-cheo" href="${href}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${tieuDe}</span><span class="lc-sub">${phu}</span></span>
</a>`;

/* ═════════════ 2.1 — Ticket và user story ═════════════ */
const MAU_TICKET_XAU = mau(`
Title: Export function

Description: Do function export loan history. Should be beautiful and fast.
Deadline: ASAP
`, 'Ticket thật kiểu hay gặp ở nhóm sinh viên (đã đổi tên dự án) — trước khi sửa.');

const MAU_TICKET_TOT = mau(`
Title: Add CSV export to the loan history page

Context
  Lab managers prepare a monthly report for the faculty. Today they copy the
  loan history table by hand into Excel, which takes about 2 hours per month.

User story
  As a lab manager, I want to export the loan history as a CSV file
  so that I can build the monthly report in Excel without retyping data.

Acceptance criteria
  1. Given I am on the Loan history page with the filter "November 2026"
     When I click "Export CSV"
     Then a file named loans-2026-11.csv is downloaded
     And it contains one row per loan in the current filter, with a header row.
  2. Given the current filter returns no loans
     When I click "Export CSV"
     Then the file contains only the header row.
  3. Given I am signed in as a member (not a lab manager)
     Then the "Export CSV" button is not displayed.

Out of scope
  - Excel (.xlsx) format. Scheduled or emailed exports.

Notes
  Columns: Loan ID, Equipment, Member, Borrowed at, Due at, Returned at (ISO 8601, UTC+7).
  Design: Figma frame "Loan history / export" (link).
`, 'Cùng ticket đó, viết lại — mẫu dựng cho bài, dự án LabFlow hư cấu.');

const L21 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · Writing' : 'Chương 2 · Viết'}</span>
<h2>${en ? '2.1 — Tickets and user stories: title, context, acceptance criteria (Given/When/Then)' : '2.1 — Ticket và user story: tiêu đề, bối cảnh, tiêu chí chấp nhận (Given/When/Then)'}</h2>
<p class="lead">${en
    ? 'A ticket is a message to someone who is not in the room — a teammate tomorrow, a tester next week, or you in three months. The test of a good ticket is simple: <strong>can a person who never talked to you start working, and know when they are done, without asking a single question?</strong>'
    : 'Ticket là lời nhắn gửi cho người không ngồi cạnh bạn — đồng đội ngày mai, tester tuần sau, hoặc chính bạn ba tháng nữa. Phép thử ticket tốt rất đơn giản: <strong>một người chưa từng nói chuyện với bạn có bắt tay làm được, và biết khi nào là xong, mà không phải hỏi câu nào không?</strong>'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Think of ordering food for a friend through a delivery app. "Get me something to eat" fails. "One bún chả, no herbs, from the shop on Trần Duy Hưng, before 12:30, under 60k" succeeds: what (the item), constraints (no herbs, budget), where, and a clear finish line (delivered before 12:30). A ticket has exactly the same parts: <strong>title</strong> (what), <strong>context</strong> (why), <strong>acceptance criteria</strong> (the finish line) and <strong>out of scope</strong> (what not to do).'
    : 'Hãy nghĩ tới việc đặt đồ ăn hộ bạn qua ứng dụng giao hàng. "Mua gì ăn cũng được" là hỏng. "Một suất bún chả, không rau, quán trên Trần Duy Hưng, giao trước 12:30, dưới 60 nghìn" là xong: cái gì (món), ràng buộc (không rau, ngân sách), ở đâu, và vạch đích rõ (giao trước 12:30). Ticket có đúng các phần đó: <strong>tiêu đề</strong> (cái gì), <strong>bối cảnh</strong> (vì sao), <strong>tiêu chí chấp nhận</strong> (vạch đích) và <strong>ngoài phạm vi</strong> (cái không làm).'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'Your OJT team works for a client in Japan. The client’s PM writes in English; your BrSE (bridge engineer) creates tickets in Jira, also in English. On Monday your lead says: "Please create the ticket for the CSV export we discussed, the client will read it." Below is what a first draft often looks like — and the rewrite.'
    : 'Nhóm OJT của bạn làm cho một khách Nhật. PM phía khách viết tiếng Anh; BrSE (kỹ sư cầu nối) tạo ticket trên Jira cũng bằng tiếng Anh. Thứ Hai trưởng nhóm bảo: "Em tạo ticket cho phần export CSV hôm trước bàn nhé, khách sẽ đọc." Dưới đây là bản nháp đầu hay gặp — và bản viết lại.'}</p>
${MAU_TICKET_XAU}
${MAU_TICKET_TOT}
<p>${en
    ? 'What changed: the title starts with a verb and names the place; the context gives a number (2 hours per month) so the PO can prioritise; "beautiful and fast" disappeared because nobody can test it; each acceptance criterion is a true/false check; "ASAP" was replaced by nothing — priority and due date are Jira fields, not words in the description.'
    : 'Đã đổi gì: tiêu đề bắt đầu bằng động từ và nêu chỗ; bối cảnh có con số (2 giờ mỗi tháng) để PO xếp ưu tiên; "beautiful and fast" biến mất vì không ai test được; mỗi tiêu chí chấp nhận là một phép kiểm đúng/sai; "ASAP" bị bỏ — độ ưu tiên và hạn là trường của Jira, không phải chữ trong mô tả.'}</p>

<h3>${en ? 'The title: verb first, place, no noise' : 'Tiêu đề: động từ đứng đầu, nêu chỗ, không chữ thừa'}</h3>
<table>
<thead><tr><th>${en ? 'Ticket type' : 'Loại ticket'}</th><th>${en ? 'Pattern' : 'Khuôn'}</th><th>${en ? 'Example' : 'Ví dụ'}</th></tr></thead>
<tbody>
<tr><td>Story / Task</td><td><em>Verb + object + (where/for whom)</em></td><td>Add CSV export to the loan history page</td></tr>
<tr><td>Task (tech)</td><td><em>Verb + object + reason</em></td><td>Upgrade Spring Boot to 3.3.4 to get the fix for CVE-2024-38816</td></tr>
<tr><td>Bug</td><td><em>[Area] Symptom + when/condition</em></td><td>Loan list: page 2 shows the same items as page 1</td></tr>
<tr><td>Spike / research</td><td><em>Investigate / Evaluate + question</em></td><td>Investigate why the nightly import takes 40 minutes</td></tr>
</tbody>
</table>
<p>${en
    ? 'Useful verbs: <strong>Add</strong> (new), <strong>Update / Change</strong> (existing behaviour), <strong>Fix</strong> (only for tasks; bug titles describe the symptom instead), <strong>Remove</strong>, <strong>Rename</strong>, <strong>Refactor</strong> (no behaviour change), <strong>Migrate</strong>, <strong>Upgrade</strong>, <strong>Allow</strong> (permission), <strong>Prevent</strong> (block a case), <strong>Validate</strong>, <strong>Display</strong>, <strong>Document</strong>. The verb is in the base form, exactly like a command: "Add", not "Added", "Adding" or "To add".'
    : 'Động từ hay dùng: <strong>Add</strong> (thêm mới), <strong>Update / Change</strong> (đổi hành vi đang có), <strong>Fix</strong> (chỉ cho task; tiêu đề bug thì tả triệu chứng), <strong>Remove</strong>, <strong>Rename</strong>, <strong>Refactor</strong> (không đổi hành vi), <strong>Migrate</strong>, <strong>Upgrade</strong>, <strong>Allow</strong> (cho phép), <strong>Prevent</strong> (chặn một trường hợp), <strong>Validate</strong>, <strong>Display</strong>, <strong>Document</strong>. Động từ để nguyên mẫu, như câu ra lệnh: "Add", không phải "Added", "Adding" hay "To add".'}</p>

<h3>${en ? 'User story: when to use it, when not to' : 'User story: khi nào dùng, khi nào không'}</h3>
<p>${en
    ? 'The template <em>"As a &lt;role&gt;, I want &lt;goal&gt; so that &lt;benefit&gt;"</em> comes from a team at the London company Connextra in 2001. Its value is the last part: <strong>so that</strong> forces you to write the reason, and the reason lets the developer choose a better solution. Bill Wake’s <strong>INVEST</strong> checklist (2003) says a good story is Independent, Negotiable, Valuable, Estimable, Small and Testable.'
    : 'Khuôn <em>"As a &lt;vai trò&gt;, I want &lt;mục tiêu&gt; so that &lt;lợi ích&gt;"</em> ra đời ở một nhóm của công ty Connextra (London) năm 2001. Giá trị của nó nằm ở vế cuối: <strong>so that</strong> buộc bạn viết lý do, và có lý do thì dev chọn được cách làm tốt hơn. Bộ tiêu chí <strong>INVEST</strong> của Bill Wake (2003) nói một story tốt phải Independent (độc lập), Negotiable (bàn lại được), Valuable (có giá trị), Estimable (ước lượng được), Small (nhỏ) và Testable (kiểm được).'}</p>
<ul>
<li>${en ? '<strong>Use it</strong> for features a user can see: "As a member, I want to extend a loan once so that I do not have to return and borrow again."' : '<strong>Dùng</strong> cho tính năng người dùng thấy được: "As a member, I want to extend a loan once so that I do not have to return and borrow again."'}</li>
<li>${en ? '<strong>Do not force it</strong> on technical tasks. "As a developer, I want to upgrade Spring Boot so that it is upgraded" adds nothing. Write a plain task: title + reason + done criteria.' : '<strong>Đừng ép</strong> cho task kỹ thuật. "As a developer, I want to upgrade Spring Boot so that it is upgraded" chẳng thêm gì. Viết task thường: tiêu đề + lý do + tiêu chí xong.'}</li>
<li>${en ? 'Japanese-client projects often skip user stories and write <strong>"Function / Condition / Expected behaviour"</strong> tables in Excel (see the outsourcing chapter of Agile &amp; Teamwork). The language skills are the same.' : 'Dự án khách Nhật hay không dùng user story mà viết bảng <strong>"Function / Condition / Expected behaviour"</strong> trong Excel (xem chương outsourcing của khoá Agile &amp; Teamwork). Kỹ năng ngôn ngữ vẫn y như vậy.'}</li>
</ul>

<h3>${en ? 'Acceptance criteria with Given / When / Then' : 'Tiêu chí chấp nhận với Given / When / Then'}</h3>
<p>${en
    ? 'Given/When/Then was introduced by Dan North in "Introducing BDD" (2006) and later became the Gherkin language used by Cucumber. It is just three sentence starters, and each has its own grammar:'
    : 'Given/When/Then do Dan North đưa ra trong bài "Introducing BDD" (2006), sau thành ngôn ngữ Gherkin của Cucumber. Nó chỉ là ba cách mở câu, mỗi cách có ngữ pháp riêng:'}</p>
<table>
<thead><tr><th></th><th>${en ? 'Meaning' : 'Nghĩa'}</th><th>${en ? 'Grammar' : 'Ngữ pháp'}</th><th>${en ? 'Example' : 'Ví dụ'}</th></tr></thead>
<tbody>
<tr><td><strong>Given</strong></td><td>${en ? 'the starting state' : 'trạng thái ban đầu'}</td><td>${en ? 'present simple / "I am", "there is", "has"' : 'hiện tại đơn / "I am", "there is", "has"'}</td><td>Given a member has 3 active loans</td></tr>
<tr><td><strong>When</strong></td><td>${en ? 'one action' : 'một hành động'}</td><td>${en ? 'present simple, one verb' : 'hiện tại đơn, một động từ'}</td><td>When the member borrows another item</td></tr>
<tr><td><strong>Then</strong></td><td>${en ? 'the observable result' : 'kết quả nhìn thấy được'}</td><td>${en ? 'present simple, something you can check' : 'hiện tại đơn, thứ kiểm được'}</td><td>Then the system rejects it with "You can borrow at most 3 items."</td></tr>
<tr><td><strong>And / But</strong></td><td>${en ? 'add one more of the same' : 'thêm một ý cùng loại'}</td><td></td><td>And no loan is created</td></tr>
</tbody>
</table>
<p>${en
    ? 'Three rules: (1) <strong>one When</strong> per scenario — two actions means two scenarios; (2) the Then must be <strong>observable</strong> — a message, a status code, a row in a file — never "works correctly"; (3) write the <strong>exact text</strong> of messages in quotes so the tester can compare character by character.'
    : 'Ba luật: (1) <strong>một When</strong> mỗi kịch bản — hai hành động là hai kịch bản; (2) Then phải <strong>nhìn thấy được</strong> — một thông báo, một mã trạng thái, một dòng trong tệp — không bao giờ là "works correctly"; (3) ghi <strong>nguyên văn</strong> thông báo trong ngoặc kép để tester so từng ký tự.'}</p>
<p>${en
    ? 'Acceptance criteria are not the same as the <strong>Definition of Done</strong>. AC belong to one ticket ("the file has a header row"). DoD applies to every ticket in the team ("code reviewed, unit tests pass, deployed to staging").'
    : 'Tiêu chí chấp nhận khác <strong>Definition of Done</strong>. AC thuộc về một ticket ("tệp có dòng tiêu đề"). DoD áp cho mọi ticket của nhóm ("đã review, unit test qua, đã lên staging").'}</p>

<h3>${en ? 'Grammar that matters in tickets (and only that)' : 'Ngữ pháp cần cho ticket (và chỉ chừng đó)'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Uncountable nouns' : 'Danh từ không đếm được'}</span><span class="v">${en ? 'Never add -s: <em>equipment, information, data, software, feedback, research, documentation, hardware, advice, progress</em>. Write "two pieces of equipment", "some feedback", "more information".' : 'Không bao giờ thêm -s: <em>equipment, information, data, software, feedback, research, documentation, hardware, advice, progress</em>. Viết "two pieces of equipment", "some feedback", "more information".'}</span></div>
  <div class="kv"><span class="k">${en ? 'Articles' : 'Mạo từ'}</span><span class="v">${en ? '<strong>a/an</strong> = one of many, first mention ("Add a button"); <strong>the</strong> = the one we both know ("the Export button", "the loan history page"). Titles may drop articles ("Add CSV export to loan history page") but descriptions must not.' : '<strong>a/an</strong> = một trong nhiều cái, nhắc lần đầu ("Add a button"); <strong>the</strong> = cái cả hai cùng biết ("the Export button", "the loan history page"). Tiêu đề có thể bỏ mạo từ ("Add CSV export to loan history page") nhưng phần mô tả thì không.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Present simple for behaviour' : 'Hiện tại đơn cho hành vi'}</span><span class="v">${en ? '"The system <strong>sends</strong> a reminder 1 day before the due date." Not "will send", not "is sending". It describes a rule that is always true.' : '"The system <strong>sends</strong> a reminder 1 day before the due date." Không "will send", không "is sending". Câu tả một quy tắc luôn đúng.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Exact quantities' : 'Số lượng chính xác'}</span><span class="v">${en ? '"at most 3" (≤ 3), "more than 3" (&gt; 3), "at least 3" (≥ 3), "up to 7 days" (≤ 7, usually inclusive — confirm), "within 1 second".' : '"at most 3" (≤ 3), "more than 3" (&gt; 3), "at least 3" (≥ 3), "up to 7 days" (≤ 7, thường tính cả biên — nên xác nhận), "within 1 second".'}</span></div>
</div>

<h3>${en ? 'Mistakes Vietnamese developers make in tickets' : 'Lỗi dev Việt hay mắc khi viết ticket'}</h3>
${saiDung([
    ['Do function export', 'Add CSV export to the loan history page', en ? '"Do function" is a word-for-word translation of "làm chức năng". Use a real verb.' : '"Do function" là dịch từng chữ "làm chức năng". Dùng động từ thật.'],
    ['Fix bug login', 'Login: "Remember me" does not keep the session after the browser restarts', en ? 'A bug title describes the symptom; "fix bug" says nothing.' : 'Tiêu đề bug tả triệu chứng; "fix bug" không nói gì.'],
    ['Add 2 equipments, update informations', 'Add 2 pieces of equipment, update the information', en ? 'Uncountable nouns.' : 'Danh từ không đếm được.'],
    ['UI should be more beautiful', 'Align the table columns with the Figma design (frame "Loan list v2")', en ? 'Testable: there is a reference to compare with.' : 'Kiểm được: có bản gốc để so.'],
    ['The system will send email', 'The system sends an email', en ? 'Present simple for rules; missing article.' : 'Hiện tại đơn cho quy tắc; thiếu mạo từ.'],
    ['Deadline: ASAP', en ? 'Use the Priority and Due date fields' : 'Dùng trường Priority và Due date', en ? '"ASAP" in writing sounds like pressure, and gives no date.' : '"ASAP" trên giấy nghe như ép, mà không có ngày.'],
    ['When user click export and download file', 'When the user clicks "Export CSV"', en ? 'Third person -s; one action per When.' : 'Ngôi ba thêm -s; mỗi When một hành động.'],
  ], en)}

${tuVung(en ? [
    ['acceptance criteria (AC)', 'true/false conditions for accepting one ticket', 'Could you review the AC before I start?'],
    ['out of scope', 'explicitly not part of this ticket', 'Scheduled exports are out of scope.'],
    ['edge case', 'an unusual input or state at the boundary', 'Empty result is an edge case — see AC 2.'],
    ['to be picked up', 'to be taken by someone to work on', 'This ticket is ready to be picked up.'],
    ['blocked by / depends on', 'cannot start until another ticket is done', 'Blocked by LAB-212 (new loan API).'],
    ['to split (a ticket)', 'to divide work into smaller tickets', 'Let’s split the export into backend and UI tickets.'],
    ['refinement / grooming', 'the meeting where tickets get clarified and estimated', 'We will estimate it in Thursday’s refinement.'],
  ] : [
    ['acceptance criteria (AC)', 'điều kiện đúng/sai để chấp nhận một ticket', 'Could you review the AC before I start?'],
    ['out of scope', 'nói rõ không thuộc ticket này', 'Scheduled exports are out of scope.'],
    ['edge case', 'trường hợp biên, đầu vào/trạng thái bất thường', 'Empty result is an edge case — see AC 2.'],
    ['to be picked up', 'được ai đó nhận làm', 'This ticket is ready to be picked up.'],
    ['blocked by / depends on', 'chưa làm được tới khi ticket khác xong', 'Blocked by LAB-212 (new loan API).'],
    ['to split (a ticket)', 'chia việc thành ticket nhỏ hơn', 'Let’s split the export into backend and UI tickets.'],
    ['refinement / grooming', 'buổi họp làm rõ và ước lượng ticket', 'We will estimate it in Thursday’s refinement.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — rewrite five vague tickets (20 minutes)' : 'Thực hành — viết lại năm ticket mơ hồ (20 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'Rewrite each one: a verb-first title (or symptom title for bugs), one context sentence, and at least one Given/When/Then. Invent reasonable details and mark them as assumptions.' : 'Viết lại từng cái: tiêu đề bắt đầu bằng động từ (bug thì tiêu đề triệu chứng), một câu bối cảnh, và ít nhất một Given/When/Then. Được tự đặt chi tiết hợp lý nhưng ghi rõ là giả định.'}</p>
<ol>
<li>"Search not good"</li>
<li>"Do function forgot password"</li>
<li>"Optimize performance page equipment"</li>
<li>"Member can borrow too much equipments"</li>
<li>"Update library"</li>
</ol>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
1. Title: Make equipment search case-insensitive
   Context: Members type in lowercase ("oscilloscope") and get no results.
   Given an item named "Oscilloscope Rigol DS1054Z"
   When a member searches for "oscilloscope"
   Then the item appears in the results.

2. Title: Add a "Forgot password" flow with an email reset link
   Context: Today members must ask a lab manager to reset their password.
   Given a registered email address
   When the member submits it on the "Forgot password" page
   Then a reset link valid for 30 minutes is sent to that address
   And the page shows "If this email is registered, you will receive a link."

3. Title: Reduce the load time of the Equipment page to under 1 second
   Context: With 10,000 items the page takes about 6 seconds (measured on staging, 24/11).
   Given 10,000 equipment items on staging
   When a member opens the Equipment page
   Then the first page of results is displayed within 1 second.
   Assumption: "load time" = time until the first 20 rows are visible.

4. Title: Prevent members from borrowing more than 3 items at the same time
   Given a member has 3 active loans
   When the member tries to borrow another item
   Then the request is rejected with "You can borrow at most 3 items."
   And no loan is created.

5. Title: Upgrade Spring Boot from 3.3.5 to 3.4.x
   Context: open-source support for 3.3.x ended in June 2025, so it gets no more security fixes.
   Done when: the app builds, all tests pass, and staging runs for 1 day without new errors.
   (A technical task: no user story needed.)
`)}
</details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every title starts with a verb (or is a symptom for bug 4), no ticket contains "good", "beautiful", "fast" or "ASAP" without a number, and a classmate can say for each ticket exactly what they would test.' : 'mọi tiêu đề bắt đầu bằng động từ (hoặc là triệu chứng với ticket 4), không ticket nào còn "good", "beautiful", "fast" hay "ASAP" mà không có con số, và một người bạn nói được với từng ticket chính xác họ sẽ test cái gì.'}</p>
</div>

${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-2-1-ticket', '🤝', en ? 'Agile &amp; Teamwork 2.1 — Writing tickets people can pick up' : 'Agile &amp; Làm việc nhóm 2.1 — Viết ticket ai cũng nhận làm được', en ? 'The same skill from the process side: splitting, estimating, the board.' : 'Cùng kỹ năng nhìn từ phía quy trình: chia nhỏ, ước lượng, bảng công việc.')}
</div>
`;

/* ═════════════ 2.2 — Bug report ═════════════ */
const MAU_BUG_XAU = mau(`
Title: API loan error!!!

Hi team, API loan is bị lỗi 500, it's totally broken, I tried many times
but still not work. Please fix ASAP. Thanks
[photo of the monitor taken with a phone]
`, 'Bản thật hay gặp (đã đổi tên) — trước khi sửa.');

const MAU_CURL_500 = mau(String.raw`
$ curl -s 'http://localhost:41812/api/loans/1'
{"id":1,"status":"ACTIVE"}

$ curl -s -i 'http://localhost:41812/api/loans/99'
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Date: Mon, 23 Nov 2026 20:18:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"error":"Cannot read properties of undefined (reading 'id')","stack":"TypeError: Cannot read properties of undefined (reading 'id')\n    at Server.<anonymous> (file:///app/labflow-mini.mjs:49:40)\n    at Server.emit (node:events:519:28)\n    at parserOnIncoming (node:_http_server:1186:12)\n    at HTTPParser.parserOnHeadersComplete (node:_http_common:125:17)"}
`, 'Output THẬT — chạy 24/11/2026 trên labflow-mini (mã nguồn ở bài 2.4), Node 22.23.5 trong container node:22-alpine, curl 8.18.0.');

const MAU_BUG_TOT = mau(String.raw`
Title: GET /api/loans/{id} returns 500 and a stack trace when the loan does not exist

Environment
  labflow-mini (file dated 24/11/2026), Node 22.23.5 (node:22-alpine), local Docker
  Client: curl 8.18.0

Steps to reproduce
  1. Start the API: node labflow-mini.mjs
  2. Request a loan ID that does not exist:
     curl -i http://localhost:41812/api/loans/99

Expected result
  404 Not Found with a short error body, e.g. {"error":"Loan not found"}.

Actual result
  500 Internal Server Error. The body contains the internal error message and the
  full stack trace, including the file path:
  {"error":"Cannot read properties of undefined (reading 'id')","stack":"TypeError: ...
   at Server.<anonymous> (file:///app/labflow-mini.mjs:49:40) ..."}

Frequency
  Always (5/5). An existing ID works: /api/loans/1 returns {"id":1,"status":"ACTIVE"}.

Severity / Priority
  Major / P2. Labels: bug, security (CWE-209: error message with sensitive information).

Notes
  Server log: TypeError at labflow-mini.mjs:49:40 — "loan" is undefined when no
  loan matches. The global error handler also returns err.stack to the client.
`, 'Cùng lỗi đó, viết lại — mọi dòng đều lấy từ output thật phía trên.');

const L22 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · Writing' : 'Chương 2 · Viết'}</span>
<h2>${en ? '2.2 — Bug reports: steps, expected vs actual, environment, severity' : '2.2 — Bug report: bước tái hiện, mong đợi và thực tế, môi trường, mức độ'}</h2>
<p class="lead">${en
    ? 'A bug report has one job: let someone else <strong>see the bug with their own eyes</strong> in under five minutes. Simon Tatham put it in one line in "How to Report Bugs Effectively" (1999): the aim is to enable the programmer to see the program failing in front of them. Everything in the template below serves that aim.'
    : 'Bug report chỉ có một việc: giúp người khác <strong>tận mắt thấy lỗi</strong> trong chưa tới năm phút. Simon Tatham gói nó trong một câu ở bài "How to Report Bugs Effectively" (1999): mục tiêu là giúp lập trình viên thấy chương trình hỏng ngay trước mắt họ. Mọi phần trong mẫu dưới đây đều phục vụ mục tiêu đó.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Taking your motorbike to a mechanic: "It makes a noise" gets you a shrug. "When the engine is cold, it makes a clicking noise for about 10 seconds after I start it; it stopped after the oil change last month and came back this week" gets you a fix. Same parts as a bug report: <strong>condition</strong> (engine cold), <strong>action</strong> (start it), <strong>symptom</strong> (clicking, 10 seconds), <strong>history</strong> (regression after a change).'
    : 'Mang xe máy ra tiệm: "Xe kêu" thì thợ nhún vai. "Lúc máy nguội, đề lên thì kêu tạch tạch khoảng 10 giây; thay dầu tháng trước thì hết, tuần này kêu lại" thì thợ sửa được. Đúng các phần của bug report: <strong>điều kiện</strong> (máy nguội), <strong>thao tác</strong> (đề máy), <strong>triệu chứng</strong> (tạch tạch, 10 giây), <strong>lịch sử</strong> (hỏng lại sau một thay đổi).'}</p>

<h3>${en ? 'Situation — a real failing request' : 'Tình huống — một request hỏng thật'}</h3>
<p>${en
    ? 'You are testing the LabFlow loan API (the small server <code>labflow-mini.mjs</code> you will run yourself in the lab 2.4). A teammate in the group chat posts the first message below. You open a terminal and check — the second block is the real output. Then you write the report properly.'
    : 'Bạn đang test API mượn thiết bị của LabFlow (máy chủ nhỏ <code>labflow-mini.mjs</code> bạn sẽ tự chạy ở lab 2.4). Một bạn trong nhóm chat gửi tin nhắn thứ nhất dưới đây. Bạn mở terminal kiểm — khối thứ hai là output thật. Rồi bạn viết lại báo cáo cho đúng.'}</p>
${MAU_BUG_XAU}
${MAU_CURL_500}
${MAU_BUG_TOT}

<h3>${en ? 'The eight parts, and the English of each' : 'Tám phần, và tiếng Anh của từng phần'}</h3>
<table>
<thead><tr><th>${en ? 'Part' : 'Phần'}</th><th>${en ? 'How to write it' : 'Viết thế nào'}</th><th>${en ? 'Pattern' : 'Khuôn câu'}</th></tr></thead>
<tbody>
<tr><td><strong>Title</strong></td><td>${en ? 'Where + symptom + condition. No "error!!!", no "please fix".' : 'Ở đâu + triệu chứng + điều kiện. Không "error!!!", không "please fix".'}</td><td>&lt;Area&gt;: &lt;symptom&gt; when &lt;condition&gt;</td></tr>
<tr><td><strong>Environment</strong></td><td>${en ? 'Versions, browser/OS, server (local/staging/prod), account role, test data.' : 'Phiên bản, trình duyệt/OS, máy chủ (local/staging/prod), vai trò tài khoản, dữ liệu test.'}</td><td>Staging, build 1.4.2 (a1b2c3d), Chrome 131 on Windows 11, role: lab manager</td></tr>
<tr><td><strong>Steps to reproduce</strong></td><td>${en ? 'Numbered, imperative, one action per step, from a known starting point.' : 'Đánh số, câu mệnh lệnh, mỗi bước một thao tác, bắt đầu từ trạng thái đã biết.'}</td><td>1. Sign in as member01. 2. Open Equipment. 3. Type "oscilloscope" in Search.</td></tr>
<tr><td><strong>Expected result</strong></td><td>${en ? 'What should happen — cite the spec/AC if there is one.' : 'Lẽ ra phải thế nào — dẫn spec/AC nếu có.'}</td><td>The item "Oscilloscope Rigol DS1054Z" appears (spec 4.3.8).</td></tr>
<tr><td><strong>Actual result</strong></td><td>${en ? 'What happens — facts, exact text, exact numbers. Present simple.' : 'Thực tế thế nào — sự kiện, nguyên văn, số chính xác. Hiện tại đơn.'}</td><td>No results are displayed: "0 items found".</td></tr>
<tr><td><strong>Frequency</strong></td><td>${en ? 'Always / intermittent with a ratio / once.' : 'Luôn luôn / thỉnh thoảng kèm tỉ lệ / một lần.'}</td><td>Always (5/5) · Intermittent (about 3 out of 10 attempts) · Once, could not reproduce since</td></tr>
<tr><td><strong>Severity / Priority</strong></td><td>${en ? 'Impact on the system / urgency for the business (see below).' : 'Mức ảnh hưởng tới hệ thống / độ gấp với nghiệp vụ (xem dưới).'}</td><td>Severity: Major · Priority: P2</td></tr>
<tr><td><strong>Attachments &amp; notes</strong></td><td>${en ? 'Log as text, screenshot with a marked area, short video, workaround, "worked in version X".' : 'Log dạng chữ, ảnh chụp có khoanh vùng, video ngắn, cách tạm, "bản X vẫn chạy".'}</td><td>See screenshot-1.png (red box). Workaround: search with a capital letter. Worked in 1.4.1.</td></tr>
</tbody>
</table>

<h3>${en ? 'Grammar of a bug report in three tenses' : 'Ngữ pháp bug report trong ba thì'}</h3>
<ul>
<li>${en ? '<strong>Steps — imperative:</strong> "Open…", "Click…", "Enter 7 in Days", "Send a POST request to…". Not "I opened", not "User will click".' : '<strong>Các bước — mệnh lệnh:</strong> "Open…", "Click…", "Enter 7 in Days", "Send a POST request to…". Không "I opened", không "User will click".'}</li>
<li>${en ? '<strong>Expected — present simple or "should":</strong> "The loan is created." / "The API should return 404."' : '<strong>Mong đợi — hiện tại đơn hoặc "should":</strong> "The loan is created." / "The API should return 404."'}</li>
<li>${en ? '<strong>Actual — present simple:</strong> "The API returns 500." The bug is happening now, every time — not "returned" (that sounds like it happened once and may be gone).' : '<strong>Thực tế — hiện tại đơn:</strong> "The API returns 500." Lỗi đang xảy ra, lần nào cũng thế — không "returned" (nghe như chỉ xảy ra một lần, có khi đã hết).'}</li>
<li>${en ? '<strong>History — past / present perfect:</strong> "It worked in 1.4.1." / "It has failed on every build since Monday."' : '<strong>Lịch sử — quá khứ / hiện tại hoàn thành:</strong> "It worked in 1.4.1." / "It has failed on every build since Monday."'}</li>
</ul>

<h3>${en ? 'Severity is not priority' : 'Severity không phải priority'}</h3>
<p>${en
    ? 'The ISTQB glossary defines <strong>severity</strong> as the degree of impact a defect has on the system, and <strong>priority</strong> as the level of business importance. The tester usually proposes severity; the PO or lead decides priority. Scales differ between companies — use your project’s list. A common one:'
    : 'Bảng thuật ngữ ISTQB định nghĩa <strong>severity</strong> là mức độ lỗi ảnh hưởng tới hệ thống, còn <strong>priority</strong> là mức quan trọng với nghiệp vụ. Tester thường đề xuất severity; PO hoặc trưởng nhóm quyết priority. Mỗi công ty một thang — dùng đúng danh sách của dự án. Một thang hay gặp:'}</p>
<table>
<thead><tr><th>Severity</th><th>${en ? 'Meaning' : 'Nghĩa'}</th><th>${en ? 'LabFlow example' : 'Ví dụ LabFlow'}</th></tr></thead>
<tbody>
<tr><td>Critical / Blocker</td><td>${en ? 'System down, data loss, security breach, no workaround' : 'Sập hệ thống, mất dữ liệu, thủng bảo mật, không có cách tạm'}</td><td>${en ? 'Any member can approve their own loans' : 'Thành viên nào cũng tự duyệt được phiếu mượn của mình'}</td></tr>
<tr><td>Major</td><td>${en ? 'A main function fails or gives wrong results' : 'Chức năng chính hỏng hoặc ra kết quả sai'}</td><td>${en ? 'Page 2 of the loan list shows page 1 again' : 'Trang 2 danh sách phiếu mượn lặp lại trang 1'}</td></tr>
<tr><td>Minor</td><td>${en ? 'Works, but inconvenient; a workaround exists' : 'Vẫn chạy nhưng bất tiện; có cách tạm'}</td><td>${en ? 'Search is case-sensitive' : 'Tìm kiếm phân biệt chữ hoa'}</td></tr>
<tr><td>Trivial</td><td>${en ? 'Cosmetic: typo, alignment' : 'Hình thức: lỗi chính tả, lệch căn'}</td><td>"Retrun" ${en ? 'on a button' : 'trên một nút'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'They do not always move together. A typo in the client’s company name on the login page is <em>trivial</em> severity but <em>P1</em> priority (the client demo is tomorrow). A crash in an admin report used once a year is <em>major</em> severity but may be <em>P3</em>.'
    : 'Hai thứ không luôn đi cùng nhau. Sai chính tả tên công ty khách ở trang đăng nhập là severity <em>trivial</em> nhưng priority <em>P1</em> (mai demo cho khách). Sập ở báo cáo quản trị mỗi năm dùng một lần là severity <em>major</em> nhưng có thể chỉ <em>P3</em>.'}</p>

<h3>${en ? 'Neutral words: describe the software, not your feelings' : 'Chữ trung tính: tả phần mềm, không tả cảm xúc'}</h3>
${saiDung([
    ['It’s totally broken!!!', 'The API returns 500 for every non-existent ID.', en ? 'Facts can be checked; emotion only creates pressure.' : 'Sự kiện thì kiểm được; cảm xúc chỉ tạo áp lực.'],
    ['Still not work', 'The loan is still not created after the fix in build 1.4.3.', en ? '"not work" is not English ("does not work") and not informative.' : '"not work" sai ngữ pháp ("does not work") mà cũng chẳng nói gì.'],
    ['Somebody broke the search', 'Search has been case-sensitive since build 1.4.2 (it worked in 1.4.1).', en ? 'Blame-free; the version history helps more than a name.' : 'Không đổ lỗi; lịch sử phiên bản có ích hơn một cái tên.'],
    ['Please fix ASAP', en ? '(nothing — set the Priority field)' : '(bỏ — đặt trường Priority)', en ? 'Urgency belongs in a field the team sorts by.' : 'Độ gấp nằm trong trường mà cả nhóm sắp xếp theo.'],
    [en ? 'A phone photo of the screen' : 'Ảnh chụp màn hình bằng điện thoại', en ? 'The log pasted as text, or a screenshot file' : 'Log dán dạng chữ, hoặc tệp ảnh chụp màn hình', en ? 'Text can be searched and copied; photos are blurry.' : 'Chữ thì tìm và chép được; ảnh chụp thì mờ.'],
    ['I think maybe the database has problem', 'Notes: the server log shows "TypeError … reading \'id\'" at labflow-mini.mjs:49.', en ? 'Report evidence; label guesses as guesses ("Possible cause: …").' : 'Báo bằng chứng; phỏng đoán thì ghi rõ là phỏng đoán ("Possible cause: …").'],
  ], en)}

<h3>${en ? 'Describing screenshots and videos' : 'Tả ảnh chụp và video'}</h3>
<p>${en
    ? 'Never attach an image without a sentence. Patterns: "See <em>screenshot-1.png</em> — the total in the red box should be 12, not 5." · "In <em>recording.mp4</em> (0:14), the spinner never stops after I click Save." · "The error appears at the bottom right (highlighted)." Keep videos under 30 seconds and start them one step before the bug.'
    : 'Đừng bao giờ đính ảnh mà không có một câu đi kèm. Khuôn: "See <em>screenshot-1.png</em> — the total in the red box should be 12, not 5." · "In <em>recording.mp4</em> (0:14), the spinner never stops after I click Save." · "The error appears at the bottom right (highlighted)." Video dưới 30 giây và bắt đầu quay trước lỗi một bước.'}</p>

<h3>🕵️ ${en ? 'Hacker corner — when the attachment is the leak (Okta, 2023)' : 'Góc hacker — khi tệp đính kèm chính là chỗ rò (Okta, 2023)'}</h3>
<div class="callout warn">
<p>${en
    ? 'Support teams often ask for a <strong>HAR file</strong> (a recording of the browser’s network traffic) to reproduce a bug. A HAR file contains every request and response — including <strong>cookies, session tokens and Authorization headers</strong>. In October 2023 Okta disclosed that an attacker had accessed its customer-support case system and downloaded files uploaded by 134 customers; some were HAR files with session tokens, which were used to hijack the Okta sessions of 5 customers (Okta, "Root Cause and Remediation", 3 Nov 2023; BeyondTrust, Cloudflare and 1Password published their own reports). The entry point was a service-account credential saved in an employee’s personal Google profile on a work laptop.'
    : 'Đội hỗ trợ hay xin <strong>tệp HAR</strong> (bản ghi lưu lượng mạng của trình duyệt) để tái hiện lỗi. Tệp HAR chứa mọi request và response — gồm cả <strong>cookie, session token và header Authorization</strong>. Tháng 10/2023 Okta công bố kẻ tấn công đã vào hệ thống quản lý ca hỗ trợ khách hàng và tải về các tệp do 134 khách hàng tải lên; một số là tệp HAR chứa session token, và chúng bị dùng để chiếm phiên Okta của 5 khách hàng (Okta, "Root Cause and Remediation", 3/11/2023; BeyondTrust, Cloudflare và 1Password đều công bố báo cáo riêng). Cửa vào là thông tin đăng nhập của một tài khoản dịch vụ lưu trong hồ sơ Google cá nhân của một nhân viên trên máy tính công ty.'}</p>
<p><strong>${en ? 'What this means for your bug reports:' : 'Bài học cho bug report của bạn:'}</strong></p>
<ul>
<li>${en ? 'Before attaching a HAR, log or screenshot, remove tokens, cookies, passwords, API keys and customer personal data. Chrome DevTools can export a HAR with sensitive data stripped ("Export HAR (sanitized)" in recent versions) — still open it and search for "token", "cookie", "authorization".' : 'Trước khi đính HAR, log hay ảnh chụp, xoá token, cookie, mật khẩu, API key và dữ liệu cá nhân của khách. Chrome DevTools bản mới có "Export HAR (sanitized)" bỏ bớt dữ liệu nhạy cảm — vẫn phải mở ra tìm "token", "cookie", "authorization".'}</li>
<li>${en ? 'Write in the report: "Sensitive data (session cookie, member emails) removed from the attached HAR."' : 'Ghi rõ trong báo cáo: "Sensitive data (session cookie, member emails) removed from the attached HAR."'}</li>
<li>${en ? '<strong>Security bugs are not public issues.</strong> Our example leaks a stack trace and file path to any client (MITRE CWE-209) — useful to an attacker mapping the system. In open source, use the project’s SECURITY.md or GitHub’s "Report a vulnerability" (private advisory); at work, use the private security label/channel your project defines.' : '<strong>Lỗi bảo mật không đăng issue công khai.</strong> Ví dụ của chúng ta lộ stack trace và đường dẫn tệp cho mọi client (MITRE CWE-209) — có ích cho kẻ đang dò hệ thống. Với mã nguồn mở, dùng SECURITY.md của dự án hoặc nút "Report a vulnerability" của GitHub (advisory riêng tư); ở công ty, dùng nhãn/kênh bảo mật riêng mà dự án quy định.'}</li>
</ul>
</div>

<h3>${en ? 'When you are on the receiving end' : 'Khi bạn là người nhận báo cáo'}</h3>
<p>${en
    ? 'Missing information? Ask once, list everything, and stay polite: <em>"Thanks for reporting this. To reproduce it, could you share (1) the build number, (2) the account you used, and (3) the exact text you typed in Search?"</em> Cannot reproduce? Say what you tried: <em>"I could not reproduce this on staging build 1.4.3 with Chrome 131 (steps 1–4, 5 attempts). Could you check whether it still happens on your side?"</em>'
    : 'Thiếu thông tin? Hỏi một lần, liệt kê đủ, giữ lịch sự: <em>"Thanks for reporting this. To reproduce it, could you share (1) the build number, (2) the account you used, and (3) the exact text you typed in Search?"</em> Không tái hiện được? Nói rõ đã thử gì: <em>"I could not reproduce this on staging build 1.4.3 with Chrome 131 (steps 1–4, 5 attempts). Could you check whether it still happens on your side?"</em>'}</p>

${tuVung(en ? [
    ['to reproduce / repro', 'to make the bug happen again on purpose', 'I can reproduce it on staging every time.'],
    ['steps to reproduce (STR)', 'the numbered actions that trigger the bug', 'The STR are in the description.'],
    ['expected vs actual', 'what should happen vs what happens', 'Expected: 404. Actual: 500.'],
    ['intermittent / flaky', 'happens only sometimes', 'The failure is intermittent (3 out of 10).'],
    ['regression', 'it worked in an earlier version', 'This is a regression from 1.4.1.'],
    ['workaround', 'a temporary way to avoid the bug', 'Workaround: type the name with a capital letter.'],
    ['root cause', 'the real underlying reason', 'Root cause: the code does not check for a missing loan.'],
    ['to sanitize / redact', 'to remove secret or personal data', 'I redacted the session cookie from the HAR.'],
  ] : [
    ['to reproduce / repro', 'làm lỗi xảy ra lại một cách chủ động', 'I can reproduce it on staging every time.'],
    ['steps to reproduce (STR)', 'các bước đánh số gây ra lỗi', 'The STR are in the description.'],
    ['expected vs actual', 'lẽ ra phải thế nào vs thực tế thế nào', 'Expected: 404. Actual: 500.'],
    ['intermittent / flaky', 'lúc có lúc không', 'The failure is intermittent (3 out of 10).'],
    ['regression', 'bản trước vẫn chạy, bản này hỏng', 'This is a regression from 1.4.1.'],
    ['workaround', 'cách tạm né lỗi', 'Workaround: type the name with a capital letter.'],
    ['root cause', 'nguyên nhân gốc', 'Root cause: the code does not check for a missing loan.'],
    ['to sanitize / redact', 'xoá dữ liệu bí mật/cá nhân', 'I redacted the session cookie from the HAR.'],
  ], en)}

<h3>🧪 ${en ? 'Practice (15 minutes)' : 'Thực hành (15 phút)'}</h3>
<div class="callout ok">
<p><strong>${en ? 'Exercise 1 — fix the language.' : 'Bài 1 — sửa câu chữ.'}</strong> ${en ? 'Rewrite each line correctly for a bug report:' : 'Viết lại từng dòng cho đúng kiểu bug report:'}</p>
<ol>
<li>"I clicked save button and then nothing happen."</li>
<li>"Expected: it must work normally."</li>
<li>"Sometimes it error, sometimes no."</li>
<li>"Title: Bug in loan page, very serious!!"</li>
<li>"Actual: the page was showed wrong datas."</li>
</ol>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
1. Step: Click "Save".  Actual: Nothing happens — no message, and the loan is not saved.
2. Expected: The loan is saved and the message "Loan created." is displayed.
3. Frequency: Intermittent — the request fails in about 3 out of 10 attempts.
4. Title: Loan page: the total shows 5 instead of 12 when the filter is "All"
5. Actual: The page shows the loans of another member (see screenshot-1.png).
`)}
</details>
<p><strong>${en ? 'Exercise 2 — severity and priority.' : 'Bài 2 — severity và priority.'}</strong> ${en ? 'Give a severity and a likely priority, with one reason each: (a) passwords are written in plain text to the server log; (b) the footer says "© 2025"; (c) the CSV export fails for months with more than 1,000 loans; (d) the client’s logo is stretched on the login page, demo tomorrow.' : 'Cho severity và priority khả dĩ, mỗi cái một lý do: (a) mật khẩu bị ghi nguyên văn vào log máy chủ; (b) chân trang ghi "© 2025"; (c) export CSV hỏng với tháng có hơn 1.000 phiếu mượn; (d) logo khách bị kéo méo ở trang đăng nhập, mai demo.'}</p>
<details><summary>${en ? 'Suggested answer' : 'Đáp án gợi ý'}</summary>
<p>${en
    ? '(a) Critical / P1 — security, and the log may already be copied elsewhere; report privately. (b) Trivial / P4 — cosmetic, nobody blocked. (c) Major / P2 — a main function fails, but only for large months; workaround: export two half-month filters. (d) Trivial (or Minor) / P1 — cosmetic, but the client sees it tomorrow.'
    : '(a) Critical / P1 — bảo mật, và log có thể đã bị chép đi nơi khác; báo kênh riêng. (b) Trivial / P4 — hình thức, không ai bị chặn. (c) Major / P2 — chức năng chính hỏng nhưng chỉ với tháng lớn; cách tạm: export hai nửa tháng. (d) Trivial (hoặc Minor) / P1 — hình thức, nhưng mai khách nhìn thấy.'}</p>
</details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your steps are imperative and numbered, "Actual" uses the present simple with exact text, and in Exercise 2 you separated severity from priority at least for (a) and (d).' : 'các bước là câu mệnh lệnh có đánh số, "Actual" dùng hiện tại đơn và nguyên văn, và ở Bài 2 bạn tách được severity khỏi priority ít nhất ở (a) và (d).'}</p>
</div>

${lienKet('/courses/debug-co-phuong-phap/learn?lessonSlug=dbg-11-1-bug-report', '🐞', en ? 'Debugging methodically 11.1 — A bug report people can act on' : 'Debug có phương pháp 11.1 — Bug report người khác làm được ngay', en ? 'What to investigate before you report: isolate, minimise, collect evidence.' : 'Điều tra gì trước khi báo: khoanh vùng, thu nhỏ, gom bằng chứng.')}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-7-1-tester', '🧪', en ? 'Agile &amp; Teamwork 7.1 — Developers and testers' : 'Agile &amp; Làm việc nhóm 7.1 — Lập trình viên và tester', en ? 'How bugs flow between dev and QA on a real team.' : 'Bug đi giữa dev và QA thế nào trong một đội thật.')}
</div>
`;

/* ═════════════ 2.3 — Cập nhật trạng thái và bình luận ═════════════ */
const MAU_LUONG = mau(`
LAB-231  Loan list: page 2 shows the same items as page 1        [Bug · Major · P2]

Mon 23 Nov, 09:40  Minh (dev)
  Started. I can reproduce it locally: page=1 and page=2 both return loans 1–5.
  Plan: fix the offset in GET /api/loans and add a test for page 2. ETA: today, 17:00 ICT.

Mon 23 Nov, 15:10  Minh (dev)
  PR #45 is ready for review: https://git.example.com/labflow/api/pull/45
  Change: the list now uses (page - 1) * size as the start index.
  Tested: page 1 → [1,2,3,4,5], page 2 → [6,7,8,9,10], page 3 → [11,12].
  @Lan could you review it today if possible?

Tue 24 Nov, 10:05  Lan (QA)
  Verified on staging (build 1.4.3): pages 1–3 are correct. Closing.
  Status: Done · Resolution: Fixed
`, 'Một luồng bình luận kiểu thật trên Jira — dự án LabFlow hư cấu, giờ ICT = UTC+7.');

const L23 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · Writing' : 'Chương 2 · Viết'}</span>
<h2>${en ? '2.3 — Status updates and comments on tickets' : '2.3 — Cập nhật trạng thái và bình luận trên ticket'}</h2>
<p class="lead">${en
    ? 'On an offshore project the client cannot walk to your desk. What they see of your work is the ticket: its status and its comments. A ticket that says "In Progress" for four days with no comment looks like nobody is working. Three short comments a day make you look reliable — and save you from the question you hate most: <em>"Any update?"</em>'
    : 'Ở dự án offshore khách không thể đi tới bàn bạn. Thứ họ thấy về công việc của bạn là ticket: trạng thái và bình luận. Ticket đứng "In Progress" bốn ngày không một bình luận trông như chẳng ai làm. Ba bình luận ngắn mỗi ngày làm bạn trông đáng tin — và cứu bạn khỏi câu hỏi đáng sợ nhất: <em>"Any update?"</em>'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Parcel tracking in a delivery app: "Picked up 09:12 · At sorting centre 14:30 · Out for delivery, expected 16:00–18:00". You never call the shop, because every step tells you what happened, what is next and when. Ticket comments do the same job.'
    : 'Theo dõi đơn hàng trên ứng dụng giao hàng: "Đã lấy hàng 09:12 · Tới kho phân loại 14:30 · Đang giao, dự kiến 16:00–18:00". Bạn chẳng cần gọi cho shop, vì bước nào cũng nói đã xảy ra gì, tiếp theo là gì và bao giờ. Bình luận trên ticket làm đúng việc đó.'}</p>

<h3>${en ? 'A real-style comment thread' : 'Một luồng bình luận kiểu thật'}</h3>
${MAU_LUONG}
<p>${en
    ? 'Every comment answers the same four questions in a few lines: <strong>what is done</strong> (with evidence), <strong>what is next</strong>, <strong>what blocks me</strong> (and who can unblock it), <strong>when</strong> (with a time zone). The numbers in "Tested:" are the real output of the fixed API in lab 2.4.'
    : 'Bình luận nào cũng trả lời bốn câu chỉ trong vài dòng: <strong>đã xong gì</strong> (kèm bằng chứng), <strong>tiếp theo là gì</strong>, <strong>vướng gì</strong> (và ai gỡ được), <strong>bao giờ</strong> (kèm múi giờ). Các số trong "Tested:" là output thật của API đã sửa ở lab 2.4.'}</p>

<h3>${en ? 'The comment for each status change' : 'Bình luận cho mỗi lần đổi trạng thái'}</h3>
<table>
<thead><tr><th>${en ? 'Moving to' : 'Chuyển sang'}</th><th>${en ? 'Write' : 'Viết'}</th></tr></thead>
<tbody>
<tr><td>In Progress</td><td>Started. I can reproduce it on &lt;env&gt;. Plan: &lt;1–2 steps&gt;. ETA: &lt;day, time, zone&gt;.</td></tr>
<tr><td>Blocked</td><td>Blocked by &lt;what&gt;. I need &lt;exact thing&gt; from @&lt;person&gt; by &lt;time&gt;. Meanwhile I am working on &lt;other ticket&gt;.</td></tr>
<tr><td>In Review</td><td>PR #&lt;n&gt; is ready for review. Change: &lt;one line&gt;. Tested: &lt;how + result&gt;.</td></tr>
<tr><td>Resolved / Done</td><td>Fixed in build &lt;x&gt;. Verified on &lt;env&gt;: &lt;result&gt;.</td></tr>
<tr><td>Reopened</td><td>Reopening: still reproducible on build &lt;x&gt; — &lt;steps / output&gt;.</td></tr>
<tr><td>Closed — Cannot Reproduce</td><td>I could not reproduce it on &lt;env, build&gt; after &lt;n&gt; attempts (&lt;what I tried&gt;). Closing for now; please reopen with &lt;missing info&gt; if it happens again.</td></tr>
<tr><td>Closed — Duplicate</td><td>Closing as a duplicate of LAB-&lt;n&gt;, which has more details. Please follow that ticket.</td></tr>
<tr><td>Closed — Won’t Fix / Works as designed</td><td>This is the expected behaviour according to spec &lt;x.y&gt; (&lt;quote&gt;). If the requirement should change, please create a change request.</td></tr>
</tbody>
</table>
<p>${en
    ? 'The exact resolution names depend on your Jira setup (Jira Cloud uses Done, Won’t Do, Duplicate, Cannot Reproduce by default; many company servers also have Fixed, Won’t Fix, Incomplete). Use the words your project shows in the dropdown.'
    : 'Tên resolution cụ thể tuỳ cấu hình Jira (Jira Cloud mặc định có Done, Won’t Do, Duplicate, Cannot Reproduce; nhiều máy chủ công ty có thêm Fixed, Won’t Fix, Incomplete). Dùng đúng chữ dự án hiện trong ô chọn.'}</p>

<h3>${en ? 'Four tenses you actually need' : 'Bốn thì bạn thật sự cần'}</h3>
<table>
<thead><tr><th>${en ? 'Use' : 'Dùng khi'}</th><th>${en ? 'Tense' : 'Thì'}</th><th>${en ? 'Example' : 'Ví dụ'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Done, result matters now, <strong>no time word</strong>' : 'Đã xong, kết quả quan trọng lúc này, <strong>không có chữ chỉ thời gian</strong>'}</td><td>Present perfect</td><td>I have fixed the offset. PR #45.</td></tr>
<tr><td>${en ? 'Done <strong>at a specific time</strong>' : 'Đã xong <strong>vào lúc cụ thể</strong>'}</td><td>Past simple</td><td>I deployed it to staging at 14:00. / Yesterday I merged PR #45.</td></tr>
<tr><td>${en ? 'Happening now' : 'Đang làm'}</td><td>Present continuous</td><td>I am writing the test for page 3.</td></tr>
<tr><td>${en ? 'Plan / estimate' : 'Kế hoạch / ước tính'}</td><td>will · going to · expect to</td><td>I expect to open the PR by Thursday 12:00 ICT.</td></tr>
</tbody>
</table>
<p>${en
    ? 'The most common mistake: present perfect with a finished time — <em>"I have fixed it yesterday"</em> ❌. Either "I fixed it yesterday" or "I have fixed it" (no time).'
    : 'Lỗi hay gặp nhất: hiện tại hoàn thành đi với mốc đã qua — <em>"I have fixed it yesterday"</em> ❌. Hoặc "I fixed it yesterday", hoặc "I have fixed it" (không có mốc).'}</p>

<h3>${en ? 'Times and dates that nobody can misread' : 'Giờ và ngày không ai đọc nhầm'}</h3>
<ul>
<li>${en ? '"24/11" is the 24th of November in Vietnam and Japan’s 2026/11/24 style, but "11/24" in the US. Write <strong>Tue 24 Nov</strong> or <strong>2026-11-24</strong> (ISO 8601).' : '"24/11" là 24 tháng 11 ở Việt Nam, Nhật viết 2026/11/24, còn Mỹ viết "11/24". Hãy viết <strong>Tue 24 Nov</strong> hoặc <strong>2026-11-24</strong> (ISO 8601).'}</li>
<li>${en ? 'Always add the zone when the team is in more than one: <strong>17:00 ICT (19:00 JST)</strong>. ICT = UTC+7 (Vietnam), JST = UTC+9 (Japan).' : 'Nhóm ở nhiều nơi thì luôn ghi múi giờ: <strong>17:00 ICT (19:00 JST)</strong>. ICT = UTC+7 (Việt Nam), JST = UTC+9 (Nhật).'}</li>
<li>${en ? '"EOD" (end of day) is whose day? Prefer a clock time. "By Friday" — start or end of Friday? Prefer "by Friday 12:00 ICT".' : '"EOD" (cuối ngày) là ngày của ai? Nên ghi giờ cụ thể. "By Friday" — đầu hay cuối thứ Sáu? Nên ghi "by Friday 12:00 ICT".'}</li>
</ul>

<h3>${en ? 'Handing over and asking for information' : 'Bàn giao và xin thông tin'}</h3>
${mau(`
Handover (before a day off):
  Handing over while I am off on Wed 25 Nov.
  Status: fix done in branch fix/LAB-231-pagination, PR #45 open, 1 approval.
  Remaining: address Lan's comment about page size 0 (return 400?).
  Contact: @Huy knows this part of the code. I am back on Thu 26 Nov.

Asking for information (from a client, with a deadline):
  Hi Tanaka-san, to finish LAB-240 we need the list of departments for the dropdown.
  Could you send it by Thu 26 Nov, 12:00 JST? If it is not ready, we will use the
  list from the current system (attached) and update it later. Thank you.
`)}

<h3>${en ? 'Mistakes Vietnamese developers make in comments' : 'Lỗi dev Việt hay mắc khi bình luận'}</h3>
${saiDung([
    ['Done.', 'Fixed in PR #45. Verified locally: page 2 returns loans 6–10.', en ? 'No evidence ⇒ the reviewer must ask again.' : 'Không bằng chứng ⇒ người duyệt lại phải hỏi.'],
    ['I have fixed it yesterday.', 'I fixed it yesterday. / I have fixed it.', en ? 'Present perfect cannot take a finished time.' : 'Hiện tại hoàn thành không đi với mốc đã qua.'],
    ['I will try my best to finish soon.', 'I expect to finish by Thu 12:00 ICT. Risk: the test data is not ready yet.', en ? 'A date and a risk are information; "try my best" is not.' : 'Một ngày và một rủi ro là thông tin; "try my best" thì không.'],
    ['Waiting.', 'Waiting for the department list from @Tanaka (asked on Mon 23 Nov).', en ? 'Say for what, from whom, since when.' : 'Nói chờ cái gì, từ ai, từ bao giờ.'],
    ['Pls check', 'Could you review PR #45 when you have time today?', en ? '"Pls" is too casual with clients; say what to check.' : '"Pls" quá suồng sã với khách; nói rõ kiểm cái gì.'],
    ['I am doing.', 'I am working on the test for page 3.', en ? '"doing" needs an object.' : '"doing" phải có tân ngữ.'],
  ], en)}

${tuVung(en ? [
    ['ETA', 'estimated time of arrival/completion', 'ETA for the PR: Thu 12:00 ICT.'],
    ['on track / at risk', 'will meet / may miss the date', 'LAB-231 is on track; LAB-240 is at risk.'],
    ['to unblock', 'to remove what stops someone', 'Your answer would unblock LAB-240.'],
    ['to follow up', 'to come back to something later', 'I will follow up after the build finishes.'],
    ['to hand over', 'to pass your work to someone else', 'Handing over to @Huy while I am off.'],
    ['to verify', 'to check that a fix really works', 'Verified on staging build 1.4.3.'],
    ['FYI', 'for your information (no action needed)', 'FYI @Lan — the API now returns 404.'],
  ] : [
    ['ETA', 'thời điểm dự kiến xong', 'ETA for the PR: Thu 12:00 ICT.'],
    ['on track / at risk', 'kịp hạn / có thể trễ', 'LAB-231 is on track; LAB-240 is at risk.'],
    ['to unblock', 'gỡ chỗ đang chặn ai đó', 'Your answer would unblock LAB-240.'],
    ['to follow up', 'quay lại xử lý tiếp sau', 'I will follow up after the build finishes.'],
    ['to hand over', 'bàn giao việc cho người khác', 'Handing over to @Huy while I am off.'],
    ['to verify', 'kiểm lại bản sửa chạy thật', 'Verified on staging build 1.4.3.'],
    ['FYI', 'để bạn biết (không cần làm gì)', 'FYI @Lan — the API now returns 404.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — four comments on one ticket (15 minutes)' : 'Thực hành — bốn bình luận trên một ticket (15 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'Ticket LAB-236: "Loan form: a period of 7 days is rejected". Write the comment for each moment:' : 'Ticket LAB-236: "Loan form: a period of 7 days is rejected". Viết bình luận cho từng thời điểm:'}</p>
<ol>
<li>${en ? 'Mon 09:30 — you start and can reproduce it.' : 'Thứ Hai 09:30 — bạn bắt đầu và tái hiện được.'}</li>
<li>${en ? 'Mon 11:00 — the spec says "up to 7 days" but you are not sure if 7 is included; you need the BA (@Mai) to confirm.' : 'Thứ Hai 11:00 — spec ghi "up to 7 days" nhưng bạn không chắc 7 có được tính; cần BA (@Mai) xác nhận.'}</li>
<li>${en ? 'Mon 15:00 — Mai confirmed 7 is allowed; PR #47 is open, you tested 6, 7 and 8 days.' : 'Thứ Hai 15:00 — Mai xác nhận 7 được phép; PR #47 đã mở, bạn đã test 6, 7 và 8 ngày.'}</li>
<li>${en ? 'Tue — QA reopens: the UI date picker still blocks day 7 (only the API was fixed).' : 'Thứ Ba — QA mở lại: ô chọn ngày trên giao diện vẫn chặn ngày thứ 7 (mới sửa API).'}</li>
</ol>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
1. Started. I can reproduce it locally: days=6 creates a loan, days=7 returns 400
   "Loan period must be between 1 and 7 days." ETA: today 17:00 ICT.
2. Blocked: spec 4.3.3 says "up to 7 days". @Mai could you confirm that 7 days is
   allowed (inclusive)? We assume yes, because the error message says "between 1 and 7".
   Meanwhile I am preparing the test cases.
3. Mai confirmed 7 is allowed (comment above). PR #47 is ready for review.
   Change: the check is now 1 <= days <= 7.
   Tested: 6 → 201, 7 → 201, 8 → 400.
4. (QA) Reopening: the API accepts 7 days on build 1.4.4, but the date picker on the
   loan form still disables the 7th day (screenshot-1.png). Steps: open New loan,
   pick 1 Dec as the start date, try to pick 8 Dec.
`)}
</details>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'each comment has evidence or a concrete next step, every time has a zone, and comment 2 names one person and one exact question.' : 'mỗi bình luận có bằng chứng hoặc bước tiếp theo cụ thể, giờ nào cũng có múi giờ, và bình luận 2 gọi đúng một người với một câu hỏi chính xác.'}</p>
</div>

${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-6-3-bao-cao', '📈', en ? 'Agile &amp; Teamwork 6.3 — Reporting progress and risk' : 'Agile &amp; Làm việc nhóm 6.3 — Báo cáo tiến độ và rủi ro', en ? 'When to raise a risk, and why bad news should travel first.' : 'Khi nào báo rủi ro, và vì sao tin xấu phải đi trước.')}
</div>
`;

/* ═════════════ 2.4 — Lab chương 2 ═════════════ */
const MA_LAB = mau(String.raw`
// labflow-mini.mjs — a tiny LabFlow equipment-loan API (lesson 2.2 + lab 2.4). It has bugs: find them.
// Run: node labflow-mini.mjs   (Node 18+, no packages). Listens on port 41812 (change with PORT=...).
import http from 'node:http';

const equipment = [
  { id: 1, name: 'Oscilloscope Rigol DS1054Z', available: true },
  { id: 2, name: 'Multimeter Fluke 117', available: true },
  { id: 3, name: 'Logic Analyzer Saleae 8', available: false },
  { id: 4, name: 'Arduino Uno R3 kit', available: true },
  { id: 5, name: 'Raspberry Pi 5 kit', available: true },
];
const loans = [];
for (let i = 1; i <= 12; i++) loans.push({ id: i, equipmentId: 1 + (i % 5), member: 'member' + i, days: 3 });

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve(null); } });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    // GET /api/equipment?search=...
    if (req.method === 'GET' && url.pathname === '/api/equipment') {
      const q = url.searchParams.get('search') || '';
      const items = equipment.filter((e) => e.name.includes(q));
      return send(res, 200, { count: items.length, items });
    }
    // GET /api/loans?page=1&size=5
    if (req.method === 'GET' && url.pathname === '/api/loans') {
      const page = Number(url.searchParams.get('page') || 1);
      const size = Number(url.searchParams.get('size') || 5);
      const start = (page - 1) * size;
      const items = loans.slice(0, size);
      return send(res, 200, { page, size, total: loans.length, items, start });
    }
    // GET /api/loans/:id
    const m = url.pathname.match(/^\/api\/loans\/(\d+)$/);
    if (req.method === 'GET' && m) {
      const loan = loans.find((l) => l.id === Number(m[1]));
      return send(res, 200, { id: loan.id, status: loan.days > 0 ? 'ACTIVE' : 'RETURNED' });
    }
    // POST /api/loans {equipmentId, member, days}
    if (req.method === 'POST' && url.pathname === '/api/loans') {
      const b = await readJson(req);
      if (!b) return send(res, 400, { error: 'Invalid JSON' });
      if (Buffer.byteLength(b.member || '') > 20)
        return send(res, 400, { error: 'Member name must be at most 20 characters.' });
      if (!(b.days >= 1 && b.days < 7))
        return send(res, 400, { error: 'Loan period must be between 1 and 7 days.' });
      const loan = { id: loans.length + 1, equipmentId: b.equipmentId, member: b.member, days: b.days };
      loans.push(loan);
      return send(res, 201, loan);
    }
    send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: err.message, stack: err.stack });
  }
});

const PORT = Number(process.env.PORT) || 41812;
server.listen(PORT, () => console.log('labflow-mini listening on http://localhost:' + PORT));
`, 'labflow-mini.mjs — chép nguyên vào một thư mục trống. Không cần cài gói nào.');

const LAB_VI = mau(`
#1 (Hà, tester, nhắn nhóm 09:12)
   Tìm "oscilloscope" không ra gì, mà gõ "Oscilloscope" thì ra. Lỗi à?

#2 (Tuấn, frontend, 09:40)
   Trang 2 danh sách phiếu mượn y hệt trang 1 luôn, size=5.

#3 (cô Lan, quản lý phòng lab, 10:05)
   Bạn Phương không đăng ký mượn được, báo tên quá 20 ký tự,
   mà tên "Nguyễn Thị Phương" có 17 chữ thôi.

#4 (Hà, 10:30)
   Quy định cho mượn tối đa 7 ngày (spec 4.3.3) mà chọn 7 ngày nó báo lỗi, 6 thì được.

#5 (cô Lan, 11:00)
   Máy Logic Analyzer đang để "hết" mà vẫn có người đặt mượn được, tạo phiếu luôn.
`, 'Năm báo lỗi tiếng Việt kiểu nhắn nhóm (tên người hư cấu).');

const OUT_LAB = mau(`
$ curl -s 'http://localhost:41812/api/equipment?search=Oscilloscope'
{"count":1,"items":[{"id":1,"name":"Oscilloscope Rigol DS1054Z","available":true}]}

$ curl -s 'http://localhost:41812/api/equipment?search=oscilloscope'
{"count":0,"items":[]}

$ curl -s 'http://localhost:41812/api/loans?page=1&size=5' | jq -c '[.items[].id]'
[1,2,3,4,5]

$ curl -s 'http://localhost:41812/api/loans?page=2&size=5' | jq -c '[.items[].id]'
[1,2,3,4,5]

$ curl -s -X POST http://localhost:41812/api/loans -H 'Content-Type: application/json' -d '{"equipmentId":2,"member":"Nguyen Thi Phuong","days":3}'
{"id":13,"equipmentId":2,"member":"Nguyen Thi Phuong","days":3}

$ curl -s -X POST http://localhost:41812/api/loans -H 'Content-Type: application/json' -d '{"equipmentId":2,"member":"Nguyễn Thị Phương","days":3}'
{"error":"Member name must be at most 20 characters."}

$ curl -s -X POST http://localhost:41812/api/loans -H 'Content-Type: application/json' -d '{"equipmentId":4,"member":"Tran Van Binh","days":6}'
{"id":14,"equipmentId":4,"member":"Tran Van Binh","days":6}

$ curl -s -X POST http://localhost:41812/api/loans -H 'Content-Type: application/json' -d '{"equipmentId":4,"member":"Tran Van Binh","days":7}'
{"error":"Loan period must be between 1 and 7 days."}

$ curl -s 'http://localhost:41812/api/equipment?search=Logic'
{"count":1,"items":[{"id":3,"name":"Logic Analyzer Saleae 8","available":false}]}

$ curl -s -X POST http://localhost:41812/api/loans -H 'Content-Type: application/json' -d '{"equipmentId":3,"member":"Le Thi Hoa","days":2}'
{"id":15,"equipmentId":3,"member":"Le Thi Hoa","days":2}
`, 'Output THẬT trên máy chủ vừa khởi động (24/11/2026). Thứ tự lệnh quyết định id phiếu (13, 14, 15).');

const DAP_AN_LAB = mau(`
#3  Title: Loan form: Vietnamese names with diacritics are rejected as "more than 20 characters" even when shorter
    Environment: labflow-mini (24/11/2026), Node 22.23.5, local
    Steps to reproduce
      1. Start the API: node labflow-mini.mjs
      2. Send POST /api/loans with {"equipmentId":2,"member":"Nguyễn Thị Phương","days":3}
    Expected result: 201 Created — the name has 17 characters (limit: 20).
    Actual result: 400 {"error":"Member name must be at most 20 characters."}
    Frequency: Always (3/3). The same name without diacritics ("Nguyen Thi Phuong") is accepted.
    Severity / Priority: Major / P2 — most Vietnamese members have diacritics in their names.
    Notes: Possible cause: the length is counted in UTF-8 bytes, not characters
    ("Nguyễn Thị Phương" = 17 characters, 23 bytes; "Đỗ Ngọc Hưởng" = 13 characters, 21 bytes, also rejected).

#4  Title: Loan form: a loan period of exactly 7 days is rejected
    Steps to reproduce
      1. Send POST /api/loans with {"equipmentId":4,"member":"Tran Van Binh","days":7}
    Expected result: 201 Created — spec 4.3.3: the period MUST NOT exceed 7 days, so 7 is allowed.
    Actual result: 400 {"error":"Loan period must be between 1 and 7 days."}
    Frequency: Always. days=6 → 201 Created.
    Severity / Priority: Major / P2 — the most common period (one week) is blocked.
    Notes: the error message itself says 7 is allowed; possible off-by-one (< instead of <=).

Titles for the other three:
#1  Equipment search: results are case-sensitive ("oscilloscope" returns 0 items)       Minor / P3
#2  Loan list: page 2 returns the same items as page 1                                    Major / P2
#5  Loans: an item with available=false can still be borrowed                            Critical or Major / P1
    (it breaks the main rule of the system: two people can hold the same device)
`);

const DAP_AN_SUA = mau(`
$ diff labflow-mini.mjs labflow-mini-fixed.mjs      (main lines)
<       const items = equipment.filter((e) => e.name.includes(q));
>       const items = equipment.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()));
<       const items = loans.slice(0, size);
>       const items = loans.slice(start, start + size);
>       if (!loan) return send(res, 404, { error: 'Loan not found' });
<       if (Buffer.byteLength(b.member || '') > 20)
>       if ([...(b.member || '')].length > 20)
<       if (!(b.days >= 1 && b.days < 7))
>       if (!(b.days >= 1 && b.days <= 7))
>       const eq = equipment.find((e) => e.id === b.equipmentId);
>       if (!eq) return send(res, 404, { error: 'Equipment not found' });
>       if (!eq.available) return send(res, 409, { error: 'Equipment is not available.' });
<     send(res, 500, { error: err.message, stack: err.stack });
>     send(res, 500, { error: 'Internal server error' });

Same commands on the fixed server (real output):
  search=oscilloscope            → {"count":1,"items":[{"id":1,"name":"Oscilloscope Rigol DS1054Z","available":true}]}
  page=2&size=5                  → [6,7,8,9,10]
  member "Nguyễn Thị Phương"     → {"id":14,"equipmentId":2,"member":"Nguyễn Thị Phương","days":3}
  days=7                         → {"id":16,"equipmentId":4,"member":"Tran Van Binh","days":7}
  equipmentId=3 (not available)  → {"error":"Equipment is not available."}
  GET /api/loans/99              → HTTP/1.1 404 Not Found  {"error":"Loan not found"}

$ node -e 'const s = "Nguyễn Thị Phương"; console.log(s.length, Buffer.byteLength(s))'
17 23
$ node -e 'const s = "Nguyễn Thị Phương"; console.log([...s].length, s.normalize("NFD").length)'
17 22
`);

const L24 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · Lab' : 'Chương 2 · Lab'}</span>
<h2>${en ? '2.4 — Lab: rewrite five real Vietnamese bug reports as clear English' : '2.4 — Lab: Viết lại năm bug report tiếng Việt thật thành tiếng Anh rõ ràng'}</h2>
<p class="lead">${en
    ? 'This lab is not a writing exercise on paper. You run a small LabFlow API on your own machine, reproduce five bugs that teammates reported in Vietnamese, and write five English bug reports from <strong>your own terminal output</strong>. Optional: fix the code and write the "Fixed and verified" comment. Time: about 75 minutes.'
    : 'Lab này không phải bài viết trên giấy. Bạn chạy một API LabFlow nhỏ trên máy mình, tái hiện năm lỗi đồng đội báo bằng tiếng Việt, rồi viết năm bug report tiếng Anh từ <strong>chính output terminal của bạn</strong>. Tuỳ chọn: sửa mã và viết bình luận "Fixed and verified". Thời gian: khoảng 75 phút.'}</p>

<h3>${en ? 'Step 0 — run the API (5 minutes)' : 'Bước 0 — chạy API (5 phút)'}</h3>
<p>${en ? 'You need Node 18 or newer, or Docker. Create an empty folder, save the file below as <code>labflow-mini.mjs</code>, then start it one of two ways:' : 'Cần Node 18 trở lên, hoặc Docker. Tạo một thư mục trống, lưu tệp dưới đây thành <code>labflow-mini.mjs</code>, rồi chạy một trong hai cách:'}</p>
${mau(`
# Option A — Node on your machine
node labflow-mini.mjs
labflow-mini listening on http://localhost:41812

# Option B — Docker (nothing to install except Docker)
docker run --rm --name labflow-mini -p 41812:41812 -v "$PWD":/app -w /app node:22-alpine node labflow-mini.mjs
`)}
${MA_LAB}
<p>${en ? 'Use a second terminal for curl. <code>jq</code> is only used to print the IDs; without it, read the "items" array by eye. On Windows PowerShell, use <code>curl.exe</code> and Git Bash for the quotes to work as shown.' : 'Dùng terminal thứ hai cho curl. <code>jq</code> chỉ để in gọn các id; không có thì nhìn mảng "items" bằng mắt. Trên Windows PowerShell, dùng <code>curl.exe</code> và Git Bash để dấu nháy chạy đúng như mẫu.'}</p>

<h3>${en ? 'Step 1 — the five reports from the team chat' : 'Bước 1 — năm báo lỗi từ nhóm chat'}</h3>
${LAB_VI}

<h3>${en ? 'Step 2 — reproduce each one (20 minutes)' : 'Bước 2 — tái hiện từng lỗi (20 phút)'}</h3>
<p>${en ? 'Write your own curl command for each report first. Then compare with the reference run below (hidden) — the output must match on a freshly started server.' : 'Tự viết lệnh curl cho từng báo lỗi trước. Sau đó so với lượt chạy mẫu bên dưới (đang che) — output phải khớp trên máy chủ vừa khởi động.'}</p>
<details><summary>${en ? 'Reference commands and real output' : 'Lệnh mẫu và output thật'}</summary>
${OUT_LAB}
</details>

<h3>${en ? 'Step 3 — write five English bug reports (35 minutes)' : 'Bước 3 — viết năm bug report tiếng Anh (35 phút)'}</h3>
<ul>
<li>${en ? 'Use the 8-part template of lesson 2.2. Titles: area + symptom + condition.' : 'Dùng mẫu 8 phần của bài 2.2. Tiêu đề: khu vực + triệu chứng + điều kiện.'}</li>
<li>${en ? 'Expected result must cite a rule: the spec (4.3.3), the error message itself, or common sense stated plainly.' : 'Expected result phải dẫn một căn cứ: spec (4.3.3), chính câu thông báo lỗi, hoặc lẽ thường nói rõ ra.'}</li>
<li>${en ? 'Actual result: paste the exact response. Add one "control" request that works (e.g. the name without diacritics).' : 'Actual result: dán nguyên response. Thêm một request "đối chứng" chạy đúng (vd tên không dấu).'}</li>
<li>${en ? 'Give severity and priority with a one-line reason. Do not guess the root cause as a fact — write "Possible cause:".' : 'Cho severity và priority kèm một dòng lý do. Đừng khẳng định nguyên nhân gốc — viết "Possible cause:".'}</li>
</ul>
<details><summary>${en ? 'Model answers (full reports for #3 and #4, titles for the rest)' : 'Đáp án gợi ý (bản đầy đủ cho #3 và #4, tiêu đề cho các lỗi còn lại)'}</summary>
${DAP_AN_LAB}
<p>${en
    ? 'Why #3 is the best one to practise: the Vietnamese report says "17 chữ" — a non-technical user’s words. Your report adds the control case (no diacritics → accepted) and turns a complaint into a precise condition. That is the value a developer adds.'
    : 'Vì sao #3 đáng luyện nhất: báo lỗi tiếng Việt nói "17 chữ" — lời của người không làm kỹ thuật. Báo cáo của bạn thêm ca đối chứng (không dấu → được nhận) và biến một lời phàn nàn thành một điều kiện chính xác. Đó là giá trị lập trình viên đem lại.'}</p>
</details>

<h3>${en ? 'Step 4 (optional) — fix it and write the closing comment (15 minutes)' : 'Bước 4 (tuỳ chọn) — sửa và viết bình luận đóng (15 phút)'}</h3>
<p>${en ? 'Fix the five bugs and the stack-trace leak from lesson 2.2, restart, rerun your commands, then write one "Fixed in … Verified: …" comment per ticket (lesson 2.3).' : 'Sửa năm lỗi và chỗ lộ stack trace ở bài 2.2, khởi động lại, chạy lại các lệnh, rồi viết cho mỗi ticket một bình luận "Fixed in … Verified: …" (bài 2.3).'}</p>
<details><summary>${en ? 'Reference fix and real output after the fix' : 'Bản sửa mẫu và output thật sau khi sửa'}</summary>
${DAP_AN_SUA}
<p>${en
    ? 'Deeper note on #3: <code>[...s].length</code> counts Unicode code points. If a client sends the name in decomposed form (NFD: "e" + combining accent), the same name is 22 code points and is rejected again. A complete fix normalises first: <code>[...s.normalize(\'NFC\')].length</code>. This is exactly the kind of detail to put under "Notes" in your fix comment.'
    : 'Ghi chú sâu cho #3: <code>[...s].length</code> đếm code point Unicode. Nếu client gửi tên ở dạng tách dấu (NFD: "e" + dấu kết hợp), cùng cái tên đó thành 22 code point và lại bị chặn. Bản sửa trọn vẹn phải chuẩn hoá trước: <code>[...s.normalize(\'NFC\')].length</code>. Chính loại chi tiết này nên ghi vào mục "Notes" trong bình luận sửa lỗi.'}</p>
</details>

<h3>${en ? 'Self-grading rubric (10 points)' : 'Rubric tự chấm (10 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'All five reproduced with your own commands; outputs pasted, not retyped' : 'Tái hiện đủ năm lỗi bằng lệnh của bạn; output dán nguyên, không gõ lại'}</td><td>2</td></tr>
<tr><td>${en ? 'Titles: area + symptom + condition, no "error"/"please fix"' : 'Tiêu đề: khu vực + triệu chứng + điều kiện, không "error"/"please fix"'}</td><td>2</td></tr>
<tr><td>${en ? 'Steps imperative and numbered; Actual in present simple' : 'Các bước là câu mệnh lệnh có đánh số; Actual ở hiện tại đơn'}</td><td>1</td></tr>
<tr><td>${en ? 'Expected cites a rule (spec, message, plain rule)' : 'Expected dẫn căn cứ (spec, thông báo, quy tắc nói rõ)'}</td><td>1</td></tr>
<tr><td>${en ? 'A control case in #1, #3 and #4' : 'Có ca đối chứng ở #1, #3 và #4'}</td><td>1</td></tr>
<tr><td>${en ? 'Severity separated from priority, with reasons; #5 rated highest' : 'Tách severity khỏi priority, có lý do; #5 được xếp cao nhất'}</td><td>1</td></tr>
<tr><td>${en ? 'No uncountable-noun or article mistakes (equipment, information, data)' : 'Không sai danh từ không đếm được hay mạo từ (equipment, information, data)'}</td><td>1</td></tr>
<tr><td>${en ? 'No guesses stated as facts; no emotion words' : 'Không khẳng định phỏng đoán; không chữ cảm xúc'}</td><td>1</td></tr>
</tbody>
</table>
<div class="callout ok"><p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you score at least 8/10 and a classmate who has never seen the API can reproduce each of your reports from the text alone. Below 8: reread 2.2 and redo #2 and #5 tomorrow without looking at the answers.' : 'bạn đạt ít nhất 8/10 và một bạn chưa từng thấy API này tái hiện được từng báo cáo chỉ bằng cách đọc. Dưới 8: đọc lại 2.2 và hôm sau làm lại #2, #5 mà không nhìn đáp án.'}</p></div>
<p>${en ? 'Clean up when you finish: stop the server with Ctrl+C (Option B removes the container by itself because of <code>--rm</code>).' : 'Dọn khi xong: dừng máy chủ bằng Ctrl+C (cách B tự xoá container nhờ <code>--rm</code>).'}</p>

<h3>🎤 ${en ? 'Interviewers will ask (answer in English, 30–60 seconds each)' : 'Phỏng vấn viên sẽ hỏi (trả lời bằng tiếng Anh, mỗi câu 30–60 giây)'}</h3>
<p>${en ? 'Common in intern and fresher interviews for outsourcing companies, including the English part of a technical interview. Say your answer aloud, record it, then open the model.' : 'Hay gặp khi phỏng vấn thực tập/fresher ở công ty outsourcing, kể cả phần tiếng Anh của vòng kỹ thuật. Nói to câu trả lời, ghi âm, rồi mới mở đáp án mẫu.'}</p>
<ol>
<li><strong>"What makes a good bug report?"</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
A good bug report lets someone else see the bug quickly without asking me questions.
It has a clear title with the area and the symptom, the environment and version,
numbered steps to reproduce, the expected and the actual result with the exact
error, how often it happens, and a severity. I also attach logs as text and remove
any tokens or personal data first.
`)}</details></li>
<li><strong>"What is the difference between severity and priority? Give an example."</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
Severity is how much the bug affects the system; priority is how urgently the
business wants it fixed. They can be different. For example, a typo in the client's
company name on the login page has low severity, but high priority if there is a
demo tomorrow.
`)}</details></li>
<li><strong>"A tester reports a bug, but you cannot reproduce it. What do you do?"</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
First I compare environments: build number, browser, account and test data. Then I
ask the tester for the exact steps or a short video, and I check the server logs at
that time. If I still cannot reproduce it, I write down what I tried and agree with
the tester to keep it open or close it as "cannot reproduce" with a note to reopen it.
`)}</details></li>
<li><strong>"Tell me about a bug you found or fixed."</strong> ${en ? '(use the STAR structure; this lab is a valid story)' : '(dùng cấu trúc STAR; chính lab này là một câu chuyện dùng được)'}
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
In a practice project, users with Vietnamese names could not borrow equipment. The
error said the name was longer than 20 characters, but it was only 17. I reproduced
it with curl and found that a name without accents worked. The code counted bytes,
not characters. I changed it to count characters, normalised the text first, and
added a test with a Vietnamese name. I learned to always test with real local data.
`)}</details></li>
<li><strong>"How do you write acceptance criteria?"</strong>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
I write them as true-or-false conditions, usually in Given/When/Then: the starting
state, one action, and an observable result like a message or a status code. I
include edge cases, such as an empty list, and I write the exact text of messages,
so the tester and I check the same thing.
`)}</details></li>
</ol>
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-8-2-du-an', '🎤', en ? 'Interview prep 8.2 — Talking about your project in English' : 'Chuẩn bị phỏng vấn 8.2 — Kể về dự án bằng tiếng Anh', en ? 'The full English interview chapter: self-introduction, projects, technical questions.' : 'Trọn chương phỏng vấn tiếng Anh: giới thiệu bản thân, kể dự án, câu hỏi kỹ thuật.')}
</div>
`;

/* ═════════════ 2.5 — Quiz chương 2 ═════════════ */
const QUIZ2 = [
  Q('tak2-1', 'Which ticket title is best?|||Tiêu đề ticket nào tốt nhất?', [
    'Export function|||Export function',
    'Do function export loan history|||Do function export loan history',
    'Add CSV export to the loan history page|||Add CSV export to the loan history page',
    'Export ASAP please|||Export ASAP please',
  ], 2, 'Verb first (base form) + object + place. Lesson 2.1.|||Động từ nguyên mẫu đứng đầu + đối tượng + chỗ. Bài 2.1.'),
  Q('tak2-2', 'Which sentence is grammatically correct?|||Câu nào đúng ngữ pháp?', [
    'We need to add 2 new equipments.|||We need to add 2 new equipments.',
    'Please send me more informations.|||Please send me more informations.',
    'We received some feedback from the client.|||We received some feedback from the client.',
    'The datas are wrong.|||The datas are wrong.',
  ], 2, 'equipment, information, feedback, data (in this use) are uncountable — no -s. Lesson 2.1.|||equipment, information, feedback, data (theo nghĩa này) không đếm được — không thêm -s. Bài 2.1.'),
  Q('tak2-3', 'Which is a good "Then" in an acceptance criterion?|||Câu "Then" nào tốt trong tiêu chí chấp nhận?', [
    'Then it works correctly|||Then it works correctly',
    'Then the system rejects it with "You can borrow at most 3 items."|||Then the system rejects it with "You can borrow at most 3 items."',
    'Then the user is happy|||Then the user is happy',
    'Then the system should be fast|||Then the system should be fast',
  ], 1, 'A Then must be observable and checkable; exact message text in quotes. Lesson 2.1.|||Then phải nhìn thấy và kiểm được; ghi nguyên văn thông báo. Bài 2.1.'),
  Q('tak2-4', 'In a bug report, how should "Steps to reproduce" be written?|||Trong bug report, "Steps to reproduce" nên viết thế nào?', [
    'A paragraph in the past tense: "I opened the page and then I clicked…"|||Một đoạn văn thì quá khứ: "I opened the page and then I clicked…"',
    'Numbered imperative steps, one action each: "1. Open… 2. Click…"|||Các bước đánh số dạng mệnh lệnh, mỗi bước một thao tác: "1. Open… 2. Click…"',
    'Only the error message|||Chỉ thông báo lỗi',
    'A guess about the cause|||Một phỏng đoán về nguyên nhân',
  ], 1, 'Lesson 2.2.|||Bài 2.2.'),
  Q('tak2-5', 'A typo in the client’s company name on the login page, demo tomorrow. Which rating fits best?|||Sai chính tả tên công ty khách ở trang đăng nhập, mai demo. Cách xếp nào hợp nhất?', [
    'Critical severity, low priority|||Severity critical, priority thấp',
    'Trivial severity, high priority|||Severity trivial, priority cao',
    'Major severity, P4|||Severity major, P4',
    'It is not a bug|||Không phải bug',
  ], 1, 'Severity = impact on the system (cosmetic); priority = business urgency (demo). Lesson 2.2.|||Severity = ảnh hưởng hệ thống (hình thức); priority = độ gấp nghiệp vụ (demo). Bài 2.2.'),
  Q('tak2-6', 'Support asks you for a HAR file to reproduce a login bug. What must you do first?|||Đội hỗ trợ xin tệp HAR để tái hiện lỗi đăng nhập. Bạn phải làm gì trước?', [
    'Send it immediately — they asked for it|||Gửi ngay — họ đã xin mà',
    'Remove cookies, session tokens and Authorization headers, then say so in the report|||Xoá cookie, session token và header Authorization, rồi ghi rõ trong báo cáo',
    'Zip it with a password and post the password in the same ticket|||Nén có mật khẩu và ghi mật khẩu ngay trong ticket đó',
    'Take a phone photo of it instead|||Chụp bằng điện thoại thay vào',
  ], 1, 'Okta 2023: HAR files uploaded to support contained session tokens that were used to hijack sessions. Lesson 2.2.|||Okta 2023: tệp HAR tải lên hệ thống hỗ trợ chứa session token và bị dùng để chiếm phiên. Bài 2.2.'),
  Q('tak2-7', 'Which comment is correct English?|||Bình luận nào đúng tiếng Anh?', [
    'I have fixed it yesterday.|||I have fixed it yesterday.',
    'I fixed it yesterday.|||I fixed it yesterday.',
    'I was fix it yesterday.|||I was fix it yesterday.',
    'I have fix it yesterday.|||I have fix it yesterday.',
  ], 1, 'A finished time (yesterday) takes the past simple. Lesson 2.3.|||Mốc đã qua (yesterday) đi với quá khứ đơn. Bài 2.3.'),
  Q('tak2-8', 'Which status update is the most useful?|||Cập nhật trạng thái nào có ích nhất?', [
    'Done.|||Done.',
    'I will try my best to finish soon.|||I will try my best to finish soon.',
    'PR #45 is ready for review. Tested: page 2 → [6,7,8,9,10]. ETA for merge: Thu 12:00 ICT.|||PR #45 is ready for review. Tested: page 2 → [6,7,8,9,10]. ETA for merge: Thu 12:00 ICT.',
    'Waiting.|||Waiting.',
  ], 2, 'Done + evidence + next + time with zone. Lesson 2.3.|||Đã xong + bằng chứng + bước tiếp + giờ có múi giờ. Bài 2.3.'),
  Q('tak2-9', 'You want a date nobody can misread in a team with Japanese and American members. Which is best?|||Bạn cần ghi ngày không ai đọc nhầm trong nhóm có người Nhật và người Mỹ. Cách nào tốt nhất?', [
    '11/12|||11/12',
    '12/11|||12/11',
    'Thu 12 Nov (or 2026-11-12)|||Thu 12 Nov (hoặc 2026-11-12)',
    'next Thursday|||next Thursday',
  ], 2, '11/12 is 11 December in Vietnam but 12 November in the US. Lesson 2.3.|||11/12 là 11 tháng 12 ở Việt Nam nhưng là 12 tháng 11 ở Mỹ. Bài 2.3.'),
  Q('tak2-10', 'A teammate writes: "Tên 17 chữ mà báo quá 20 ký tự." The name without diacritics is accepted. What is the best English title?|||Đồng đội viết: "Tên 17 chữ mà báo quá 20 ký tự." Tên không dấu thì được nhận. Tiêu đề tiếng Anh nào tốt nhất?', [
    'Name bug, please fix|||Name bug, please fix',
    'Loan form: names with Vietnamese diacritics are rejected as "more than 20 characters"|||Loan form: names with Vietnamese diacritics are rejected as "more than 20 characters"',
    'The system counts bytes instead of characters|||The system counts bytes instead of characters',
    'Vietnamese names not work|||Vietnamese names not work',
  ], 1, 'Area + symptom + condition. C is a guessed cause, not a symptom — put it under "Possible cause". Lab 2.4.|||Khu vực + triệu chứng + điều kiện. C là nguyên nhân phỏng đoán, không phải triệu chứng — để ở "Possible cause". Lab 2.4.'),
];

export default {
  title: 'Chapter 2 — Writing tickets and bug reports|||Chương 2 — Viết ticket và bug report',
  description: 'Viết để người khác làm được mà không phải hỏi lại: ticket và user story có Given/When/Then, bug report tám phần từ output thật, severity khác priority, bình luận cập nhật trạng thái, lab tái hiện năm lỗi trên API LabFlow chạy thật.',
  lessons: [
    { title: '2.1 — Tickets and user stories: title, context, acceptance criteria (Given/When/Then)|||2.1 — Ticket và user story: tiêu đề, bối cảnh, tiêu chí chấp nhận (Given/When/Then)', slug: 'tak-2-1-ticket', type: 'LESSON', isFreePreview: true, description: 'Ticket trước/sau, tiêu đề động từ đầu theo loại ticket, user story (Connextra 2001, INVEST), Given/When/Then (Dan North 2006) và ba luật, AC khác DoD, danh từ không đếm được, mạo từ, bài viết lại năm ticket mơ hồ.', content: L21(true) + L21(false) },
    { title: '2.2 — Bug reports: steps, expected vs actual, environment, severity|||2.2 — Bug report: bước tái hiện, mong đợi và thực tế, môi trường, mức độ', slug: 'tak-2-2-bug-report', type: 'LESSON', isFreePreview: true, description: 'Bug report tám phần dựng từ output curl thật (API trả 500 + lộ stack trace), ngữ pháp ba thì, severity khác priority (ISTQB), chữ trung tính, tả ảnh/video, góc hacker: tệp HAR bị lộ ở sự cố Okta 2023, lỗi bảo mật báo kênh riêng.', content: L22(true) + L22(false) },
    { title: '2.3 — Status updates and comments on tickets|||2.3 — Cập nhật trạng thái và bình luận trên ticket', slug: 'tak-2-3-cap-nhat', type: 'LESSON', isFreePreview: true, description: 'Luồng bình luận Jira kiểu thật, câu mẫu cho từng lần đổi trạng thái và resolution, bốn thì cần dùng, ghi ngày giờ không ai đọc nhầm (ICT/JST, ISO 8601), bàn giao, xin thông tin có hạn, bài bốn bình luận cho một ticket.', content: L23(true) + L23(false) },
    { title: '2.4 — Lab: Rewrite five real Vietnamese bug reports as clear English|||2.4 — Lab: Viết lại năm bug report tiếng Việt thật thành tiếng Anh rõ ràng', slug: 'tak-2-4-lab', type: 'LESSON', isFreePreview: true, description: 'Tự chạy API LabFlow mini (Node/Docker, mã in nguyên văn), tái hiện năm lỗi đồng đội báo bằng tiếng Việt bằng curl, viết năm bug report tiếng Anh, tuỳ chọn sửa mã + bình luận xác nhận, rubric 10 điểm, năm câu phỏng vấn tiếng Anh có đáp án mẫu.', content: L24(true) + L24(false) },
    {
      title: '2.5 — Chapter 2 quiz|||2.5 — Kiểm tra Chương 2',
      slug: 'tak-2-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: tiêu đề ticket, danh từ không đếm được, câu Then kiểm được, bước tái hiện, severity/priority, tệp HAR, thì trong bình luận, cập nhật có ích, ghi ngày, tiêu đề bug từ báo lỗi tiếng Việt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions built from the tickets, bug reports and comments of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu dựng từ chính các ticket, bug report và bình luận trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ2 },
    },
  ],
};
