/**
 * 2.4 — Vận hành trên CT Work (agl-2-4-ct-work). Soạn 24/11/2026, agent agt.
 * Tính năng CT Work nêu trong bài CHỈ lấy từ tài liệu đã kiểm thật: api-backend/docs/ctw-qa-10-10.md (18 mục, prod 10/10/2026),
 * work-hub-plan.md (ô đã tick: backlog, sprint, story point, velocity, burndown, JQL, nhập CSV/Jira, xuất CSV/Excel/PDF) và bài git KĐ.10.
 * KHÔNG tả vị trí nút bấm (giao diện đổi theo bản). Lab: xuat-csv.mjs chạy THẬT — qua ./_ma.mjs.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L24 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 2 · Lesson 2.4', 'Chương 2 · Bài 2.4', `
<h2>${t('2.4 — Running it in CT Work', '2.4 — Vận hành trên CT Work')}</h2>
<p class="lead">${t(
    'Lessons 2.1–2.3 gave you tickets, slices and estimates as files and scripts. A team of five needs them in one shared place that everyone opens every day. This lesson maps every idea of chapters 1–2 to a feature of CT Work (<a href="/work">/work</a>, the Jira-style tracker on this site), imports the LabFlow tickets you wrote, and gives the leader a weekly routine on the tool — so the tool serves the process instead of becoming one more chore.',
    'Bài 2.1–2.3 cho bạn ticket, lát cắt và ước lượng dưới dạng tệp và script. Nhóm năm người cần chúng ở một chỗ chung mà ai cũng mở mỗi ngày. Bài này ánh xạ mọi ý của chương 1–2 sang một tính năng của CT Work (<a href="/work">/work</a>, công cụ kiểu Jira trên trang này), nhập các ticket LabFlow bạn đã viết, và đưa cho trưởng nhóm một nếp làm việc hằng tuần trên công cụ — để công cụ phục vụ quy trình thay vì thành thêm một việc vặt.')}</p>

<h3>${t('Everyday picture: the family calendar on the fridge', 'Liên tưởng đời thường: tờ lịch gia đình dán tủ lạnh')}</h3>
<p>${t(
    'When each person keeps appointments in their own head, the car is double-booked and nobody picks up grandma. One calendar on the fridge — everyone writes there, everyone reads there — fixes it without any meeting. A tracker is that fridge for a team. Its only rule: <strong>if it is not on the board, it does not exist</strong>.',
    'Khi mỗi người tự nhớ lịch hẹn trong đầu, xe máy bị hai người hẹn cùng giờ và chẳng ai đi đón bà. Một tờ lịch dán trên tủ lạnh — ai cũng ghi vào đó, ai cũng đọc ở đó — giải quyết mà không cần họp. Công cụ quản lý công việc là cái tủ lạnh đó của cả đội. Luật duy nhất của nó: <strong>không có trên bảng thì coi như không tồn tại</strong>.')}</p>

<h3>${t('From the chapters to the tool', 'Từ các chương sang công cụ')}</h3>
<p>${t('Every row below is a feature that was checked on the production CT Work (QA run of 10/10/2026). Menu names and positions change between versions, so this lesson names features, not buttons; the same ideas exist in Jira, which you will most likely meet at an internship.', 'Mỗi dòng dưới đây là một tính năng đã được kiểm trên CT Work bản chạy thật (đợt kiểm thử 10/10/2026). Tên và vị trí menu đổi theo phiên bản, nên bài này gọi tên tính năng, không tả nút bấm; các ý này đều có trong Jira, công cụ bạn nhiều khả năng gặp khi đi thực tập.')}</p>
${bang([t('Idea (lesson)', 'Ý (bài)'), t('In CT Work', 'Trong CT Work'), t('Jira equivalent', 'Tương đương Jira')], [
    [t('Project key, ticket IDs (0.2)', 'Mã dự án, mã ticket (0.2)'), t('Project key <code>LF</code> ⇒ LF-1, LF-2…', 'Mã dự án <code>LF</code> ⇒ LF-1, LF-2…'), t('Project key', 'Project key')],
    [t('Ticket types (2.1)', 'Loại ticket (2.1)'), 'Epic · Story · Task · Bug · Sub-task; ' + t('links blocks / relates / duplicates', 'liên kết blocks / relates / duplicates'), t('Issue types, issue links', 'Issue types, issue links')],
    [t('Backlog ordered by value (1.2)', 'Backlog xếp theo giá trị (1.2)'), t('Backlog ranked by drag-and-drop, grouped by epic, multi-select and bulk edit', 'Backlog xếp hạng bằng kéo thả, nhóm theo epic, chọn nhiều và sửa hàng loạt'), 'Backlog'],
    [t('Story points (2.3)', 'Story point (2.3)'), t('Points field on each ticket', 'Trường điểm trên mỗi ticket'), 'Story point estimate'],
    [t('Sprint with a goal (1.2)', 'Sprint có mục tiêu (1.2)'), t('Start / complete sprint; unfinished tickets go back or forward', 'Bắt đầu / kết thúc sprint; ticket chưa xong quay lại backlog hoặc sang sprint sau'), 'Sprint'],
    [t('Board with columns and policies (1.3)', 'Bảng có cột và luật (1.3)'), t('Board + custom workflow (statuses and transitions)', 'Bảng + quy trình trạng thái tuỳ chỉnh'), 'Board, workflow'],
    [t('Burndown, velocity (1.5, 2.3)', 'Burndown, velocity (1.5, 2.3)'), t('Burndown, velocity, sprint report, epic report', 'Burndown, velocity, báo cáo sprint, báo cáo epic'), t('Same names', 'Cùng tên')],
    [t('Flow metrics (1.3)', 'Chỉ số dòng chảy (1.3)'), t('CFD, cycle time, throughput, aging WIP, load by person — exportable as PNG/CSV', 'CFD, cycle time, throughput, aging WIP, tải theo người — xuất được PNG/CSV'), t('Control chart, CFD', 'Control chart, CFD')],
    [t('Code linked to tickets (0.2)', 'Code nối với ticket (0.2)'), t('GitHub webhook: branches/commits/PRs containing LF-xx show on the card', 'Webhook GitHub: nhánh/commit/PR chứa LF-xx hiện trên thẻ'), t('Development panel', 'Development panel')],
    [t('Who did what (0.9)', 'Ai làm gì (0.9)'), t('Contributions report + peer review rounds (no self-rating), export xlsx/pdf', 'Báo cáo Đóng góp + vòng đánh giá chéo (không tự chấm), xuất xlsx/pdf'), t('(marketplace apps)', '(ứng dụng bên ngoài)')],
    [t('SWP391 paperwork', 'Giấy tờ SWP391'), t('Project Tracking export (SWP391 sheet), WBS by screen (fields/transactions ⇒ complexity), weekly report and AI-usage report as .xlsx', 'Xuất Project Tracking (sheet SWP391), WBS theo màn hình (field/transaction ⇒ độ phức tạp), báo cáo tuần và báo cáo dùng AI dạng .xlsx'), '—'],
    [t('Lecturer view', 'Góc nhìn giảng viên'), t('Teaching hub: class code, team projects, iteration rubric, published grades', 'Hub giảng viên: mã lớp, dự án nhóm, rubric iteration, công bố điểm'), '—'],
    [t('Searching (2.4)', 'Tìm kiếm (2.4)'), t('JQL-style queries, saved filters, accent-insensitive Vietnamese search', 'Truy vấn kiểu JQL, lưu bộ lọc, tìm tiếng Việt không phân biệt dấu'), 'JQL'],
    [t('Getting data in and out', 'Đưa dữ liệu vào và ra'), t('Import CSV or a Jira export; export CSV / Excel / PDF', 'Nhập CSV hoặc tệp xuất của Jira; xuất CSV / Excel / PDF'), 'CSV import'],
  ])}
${note(t('CT Work also has AI helpers (write a story and its criteria, split an epic, score a story against INVEST). They <em>propose</em> and you apply. Treat their output like a teammate’s draft: it still has to pass your Definition of Ready from lesson 2.1.', 'CT Work còn có trợ lý AI (viết story và tiêu chí, tách epic, chấm story theo INVEST). Chúng <em>đề xuất</em>, bạn mới là người áp dụng. Coi kết quả của chúng như bản nháp của một đồng đội: vẫn phải qua Definition of Ready của bạn ở bài 2.1.'))}

<h3>${t('Setting up LabFlow once (sprint 0, about one hour)', 'Dựng LabFlow một lần (sprint 0, khoảng một giờ)')}</h3>
<ol>
<li>${t('Create the project with key <code>LF</code>, invite the four members. If your lecturer uses the teaching hub, join the class with its class code so the team project is created inside the class.', 'Tạo dự án mã <code>LF</code>, mời bốn thành viên. Nếu giảng viên dùng hub giảng viên, vào lớp bằng mã lớp để dự án nhóm được tạo bên trong lớp.')}</li>
<li>${t('Workflow and board: To do → In progress → In review → Testing → Done, the columns and policies of lesson 1.3.', 'Quy trình và bảng: To do → In progress → In review → Testing → Done, đúng các cột và luật của bài 1.3.')}</li>
<li>${t('Epics = business areas (LF-E1 Accounts, LF-E2 Booking, LF-E3 Equipment, LF-E4 Maintenance, LF-E5 Reports); a label or component per screen code (S22…).', 'Epic = mảng nghiệp vụ (LF-E1 Tài khoản, LF-E2 Đặt lịch, LF-E3 Thiết bị, LF-E4 Bảo trì, LF-E5 Báo cáo); nhãn hoặc component theo mã màn (S22…).')}</li>
<li>${t('Connect GitHub (step by step in ', 'Nối GitHub (từng bước ở ')}${cs('git', 'git-kd-10-noi-ct-work', 'Git KĐ.10')}${t(') and check that a commit with LF-1 appears on card LF-1.', ') và kiểm một commit có LF-1 hiện trên thẻ LF-1.')}</li>
<li>${t('Import the backlog (lab below), then estimate it in one poker session (2.3).', 'Nhập backlog (lab bên dưới), rồi ước lượng trong một buổi poker (2.3).')}</li>
</ol>

<h3>${t('Lab: from Markdown tickets to an importable CSV', 'Lab: từ ticket Markdown sang CSV nhập được')}</h3>
<p>${t('Your refined tickets live in <code>ticket/*.md</code> and pass <code>kiem-ticket.mjs</code>. This script keeps only the READY ones and writes a CSV with the column names a Jira-style import understands (Summary, Issue Type, Story Points, Epic, Labels, Description). Quoting follows RFC 4180: every cell in double quotes, inner quotes doubled, CRLF line ends — so multi-line descriptions survive.', 'Ticket đã làm mịn nằm trong <code>ticket/*.md</code> và qua được <code>kiem-ticket.mjs</code>. Script này chỉ giữ ticket SẴN SÀNG và ghi một CSV với tên cột mà kiểu nhập của Jira hiểu (Summary, Issue Type, Story Points, Epic, Labels, Description). Cách bọc ô theo RFC 4180: mọi ô trong nháy kép, nháy bên trong nhân đôi, xuống dòng CRLF — để mô tả nhiều dòng không bị vỡ.')}</p>
${js(MA.xuatCsv)}
${out('$ node xuat-csv.mjs ticket/*.md > sprint.csv\n' + RA.xuatCsv)}
<p>${t('Before importing, read the file back with a real CSV parser — if it parses into the right number of columns, the tracker will too:', 'Trước khi nhập, đọc lại tệp bằng một bộ phân tích CSV thật — phân tích ra đúng số cột thì công cụ cũng sẽ đọc đúng:')}</p>
${out(`$ python3 -c "import csv;r=list(csv.reader(open('sprint.csv',newline='')));print([x[:5] for x in r])"\n` + RA.csvDoc)}
<p>${t('Then import the CSV into the LF project and map the columns when CT Work asks. After the import, check three things: the number of tickets (3 here), the sum of points, and that a multi-line description shows its acceptance criteria intact. Three tickets were held back on purpose — that is the Definition of Ready doing its job.', 'Rồi nhập CSV vào dự án LF và ghép cột khi CT Work hỏi. Nhập xong, soát ba thứ: số ticket (ở đây là 3), tổng điểm, và một mô tả nhiều dòng còn nguyên tiêu chí chấp nhận. Ba ticket bị giữ lại là cố ý — đó là Definition of Ready đang làm đúng việc.')}</p>

<h3>${t('Queries the leader saves', 'Các truy vấn trưởng nhóm lưu sẵn')}</h3>
${out(`assignee = me AND status != Done ORDER BY priority        -- việc của tôi còn mở
fixVersion is EMPTY                                       -- ticket chưa gắn bản phát hành / iteration
text ~ "dat lich"                                         -- tìm cả "đặt lịch" (không phân biệt dấu)`)}
<p>${t('Save them as filters and put them on the project dashboard. The rest of the questions a leader asks are already reports: <em>which card is oldest?</em> → aging WIP; <em>is anyone overloaded?</em> → load by person; <em>will we make it?</em> → burndown.', 'Lưu chúng thành bộ lọc và gắn lên dashboard dự án. Các câu hỏi còn lại của trưởng nhóm đã là báo cáo sẵn: <em>thẻ nào già nhất?</em> → aging WIP; <em>có ai quá tải?</em> → tải theo người; <em>có kịp không?</em> → burndown.')}</p>

<h3>${t('The leader’s week on the tool (≈ 30 minutes in total)', 'Một tuần của trưởng nhóm trên công cụ (≈ 30 phút tổng cộng)')}</h3>
${bang([t('When', 'Khi nào'), t('Look at', 'Xem gì'), t('Do', 'Làm gì')], [
    [t('Monday (planning)', 'Thứ Hai (planning)'), t('Backlog top, last velocity', 'Đầu backlog, velocity lần trước'), t('Write the Sprint Goal, pull only what the velocity allows, every card has an owner and passes the DoR.', 'Viết Sprint Goal, chỉ kéo vừa đúng velocity cho phép, thẻ nào cũng có người nhận và qua DoR.')],
    [t('Every day, 5 minutes', 'Mỗi ngày, 5 phút'), t('Aging WIP, In review column', 'Aging WIP, cột In review'), t('Ask about the oldest card first; make sure no PR waits more than 24 hours.', 'Hỏi thẻ già nhất trước; bảo đảm không PR nào chờ quá 24 giờ.')],
    [t('Wednesday', 'Thứ Tư'), t('Burndown, load by person', 'Burndown, tải theo người'), t('If the line is flat for two days, cut scope or split, now — not on demo day.', 'Đường nằm ngang hai ngày thì cắt phạm vi hoặc chia nhỏ, ngay bây giờ — không đợi ngày demo.')],
    [t('Friday', 'Thứ Sáu'), t('Sprint report, contributions', 'Báo cáo sprint, đóng góp'), t('Export the weekly report for the lecturer; note what went back to the backlog and why.', 'Xuất báo cáo tuần cho giảng viên; ghi lại thứ quay về backlog và vì sao.')],
  ])}
${cl('warn', `<p><strong>${t('Honesty in the data', 'Trung thực trong dữ liệu')}</strong>: ${t('the contributions report reads the board and the commits. Moving a teammate’s card to your name, logging work that did not happen, or creating extra accounts makes the report wrong exactly where the lecturer looks. If someone does not work, the report should show it — then you handle it as a person (chapter 6), with the evidence already in the tool.', 'báo cáo đóng góp đọc từ bảng và từ commit. Chuyển thẻ của bạn khác sang tên mình, ghi công việc không có thật, hay tạo thêm tài khoản sẽ làm báo cáo sai đúng chỗ giảng viên nhìn vào. Nếu có người không làm, báo cáo nên cho thấy điều đó — rồi bạn xử lý như với một con người (chương 6), với bằng chứng đã sẵn trong công cụ.')}</p>`)}
${cl('danger', `<p><strong>🔐 ${t('API tokens are keys', 'Token API là chìa khoá')}</strong>: ${t('CT Work issues personal API tokens (for scripts and AI agents). A token pasted into the group chat or committed in a script can read and change everything you can. Give each script its own token, keep it in an environment variable, revoke it when the semester ends — the same hygiene as in', 'CT Work cấp token API cá nhân (cho script và agent AI). Token dán vào nhóm chat hay commit lẫn trong script thì đọc và sửa được mọi thứ bạn được phép. Mỗi script một token riêng, để trong biến môi trường, thu hồi khi hết kỳ — đúng nếp vệ sinh ở')} ${ag('agl-10-5-tai-khoan', t('lesson 10.5', 'bài 10.5'))}.</p>`)}

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'Each company has its tracker: Jira and Azure Boards in many offshore centres, Redmine in older projects, Backlog (by the Japanese company Nulab) on many Japanese-customer projects, sometimes the customer’s own instance that you access through a VPN. You will not choose it, and in the first week nobody expects you to know its menus. What they expect is that you already think in its concepts — epic, story, sub-task, sprint, workflow, filter — and that your tickets move across the board honestly and on time. Ask on day one: "which statuses must I move my ticket through, and who moves it to Done?"',
    'Mỗi công ty một công cụ: Jira và Azure Boards ở nhiều trung tâm offshore, Redmine ở dự án cũ, Backlog (của công ty Nhật Nulab) ở nhiều dự án khách Nhật, có khi là hệ thống riêng của khách truy cập qua VPN. Bạn sẽ không được chọn, và tuần đầu không ai đòi bạn thuộc menu. Thứ họ đòi là bạn đã nghĩ bằng các khái niệm của nó — epic, story, sub-task, sprint, quy trình trạng thái, bộ lọc — và ticket của bạn đi qua bảng trung thực, đúng hạn. Ngày đầu hãy hỏi: "ticket của em phải đi qua những trạng thái nào, và ai là người chuyển sang Done?"')}</p>

<h3>🧪 ${t('Practice (45 minutes, on the real tool)', 'Thực hành (45 phút, trên công cụ thật)')}</h3>
<ol>
<li>${t('Create a personal practice project in CT Work, import the CSV from the lab, and check the three things after import.', 'Tạo một dự án luyện tập cá nhân trên CT Work, nhập CSV từ lab, và soát ba thứ sau khi nhập.')}</li>
<li>${t('Write a query for "bugs that nobody owns yet, newest first". Which fields does it use?', 'Viết truy vấn cho "lỗi chưa ai nhận, mới nhất lên đầu". Nó dùng những trường nào?')}</li>
<li>${t('Start a one-week sprint with one goal sentence and the three tickets; move one through every column to Done and look at the burndown and the card’s history.', 'Bắt đầu một sprint một tuần với một câu mục tiêu và ba ticket; đưa một ticket qua mọi cột tới Done rồi xem burndown và lịch sử của thẻ.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<p>${t('1. Three tickets, 11 points (5 + 3 + 3), LF-21’s description shows AC1–AC4 on separate lines. If the description arrives on one line, the file was saved with bare LF inside a cell by another editor — regenerate it with the script.', '1. Ba ticket, 11 điểm (5 + 3 + 3), mô tả của LF-21 hiện AC1–AC4 trên các dòng riêng. Nếu mô tả dồn thành một dòng, tệp đã bị trình soạn khác lưu lại — sinh lại bằng script.')}</p>
${out('type = Bug AND assignee is EMPTY ORDER BY created DESC')}
<p>${t('2. Fields: type, assignee (with <code>is EMPTY</code>, as for fixVersion), created. If your version names a field differently, the query helper of the tool lists the available fields — the structure <em>field operator value</em> stays the same as in Jira.', '2. Trường: type, assignee (dùng <code>is EMPTY</code> như với fixVersion), created. Nếu phiên bản của bạn đặt tên trường khác, bảng tra JQL của công cụ liệt kê các trường có sẵn — cấu trúc <em>trường toán tử giá trị</em> vẫn giống Jira.')}</p>
<p>${t('3. The card history shows every status change with who and when — the same data the cycle-time and aging reports are computed from. That is why moving cards honestly, the moment work changes, matters more than any report.', '3. Lịch sử thẻ cho thấy mọi lần đổi trạng thái kèm ai và khi nào — chính là dữ liệu mà báo cáo cycle time và aging tính ra. Vì vậy kéo thẻ trung thực, ngay lúc công việc thay đổi, quan trọng hơn mọi báo cáo.')}</p>`)}

${phongVan([
    [t('"Which tools have you used to manage work?"', '"Bạn đã dùng công cụ nào để quản lý công việc?"'), t('Name the tool and how you used it, not just that you had an account: "a Jira-style tracker; I set up the workflow, imported the backlog, ran two-week sprints, used burndown and aging reports at standups, and linked commits to tickets through a webhook."', 'Nêu công cụ và cách bạn dùng, không chỉ là có tài khoản: "một công cụ kiểu Jira; mình dựng quy trình trạng thái, nhập backlog, chạy sprint hai tuần, dùng burndown và aging ở standup, và nối commit với ticket qua webhook."')],
    [t('"What is JQL?"', '"JQL là gì?"'), t('Jira Query Language — field, operator, value combined with AND/OR and ORDER BY, used for filters, boards and dashboards; for example assignee = currentUser() AND status != Done.', 'Ngôn ngữ truy vấn của Jira — trường, toán tử, giá trị nối bằng AND/OR và ORDER BY, dùng cho bộ lọc, bảng và dashboard; ví dụ assignee = currentUser() AND status != Done.')],
    [t('"How do you keep the board up to date in a team?"', '"Làm sao giữ bảng luôn cập nhật trong một đội?"'), t('Make it the single source of truth: no work without a card, branch names carry the key so code links itself, cards are moved at the moment work changes, and the standup is run from the board.', 'Biến nó thành nguồn sự thật duy nhất: không có thẻ thì không làm, tên nhánh mang mã thẻ để code tự nối, kéo thẻ ngay lúc công việc đổi trạng thái, và chạy standup từ chính bảng.')],
  ], en)}

${thuatNgu([
    ['workflow', t('The statuses a ticket moves through and the allowed transitions.', 'Các trạng thái ticket đi qua và các bước chuyển được phép.')],
    ['JQL', t('Query language: field operator value, AND/OR, ORDER BY.', 'Ngôn ngữ truy vấn: trường toán tử giá trị, AND/OR, ORDER BY.')],
    [t('saved filter', 'bộ lọc lưu sẵn'), t('A named query reused on boards and dashboards.', 'Truy vấn có tên, dùng lại trên bảng và dashboard.')],
    ['aging WIP', t('Report of open cards by how long they have been open.', 'Báo cáo thẻ đang mở theo thời gian đã mở.')],
    ['webhook', t('GitHub calls CT Work on every push/PR so commits show on cards.', 'GitHub gọi CT Work mỗi lần push/PR để commit hiện trên thẻ.')],
    ['RFC 4180', t('The common CSV format: quotes, doubled inner quotes, CRLF.', 'Định dạng CSV chung: nháy kép, nháy trong nhân đôi, CRLF.')],
    ['API token', t('A personal secret that lets scripts act as you; scope, store and revoke it.', 'Bí mật cá nhân cho phép script hành động thay bạn; giới hạn, cất giữ và thu hồi.')],
  ], en)}

${tomTat([
    t('If it is not on the board, it does not exist — one shared tool, opened daily.', 'Không có trên bảng thì coi như không tồn tại — một công cụ chung, mở mỗi ngày.'),
    t('Every concept of chapters 1–2 has a CT Work feature (and a Jira twin); learn the concepts, not the buttons.', 'Mọi khái niệm của chương 1–2 đều có tính năng CT Work (và bản sinh đôi trên Jira); học khái niệm, không học nút.'),
    t('Import only READY tickets: Markdown → checker → RFC 4180 CSV → import → check count, points, descriptions.', 'Chỉ nhập ticket SẴN SÀNG: Markdown → script soát → CSV RFC 4180 → nhập → soát số lượng, điểm, mô tả.'),
    t('The leader’s week: planning by velocity, daily aging check, mid-sprint burndown, Friday report.', 'Tuần của trưởng nhóm: planning theo velocity, soát aging mỗi ngày, burndown giữa sprint, báo cáo thứ Sáu.'),
    t('Keep the data honest and the API tokens private.', 'Giữ dữ liệu trung thực và token API riêng tư.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-2-5-lab', t('2.5 — Lab: the iteration-1 backlog for LabFlow', '2.5 — Lab: backlog iteration 1 cho LabFlow'))}.</p>
`);
};

export default {
  title: '2.4 — Running it in CT Work|||2.4 — Vận hành trên CT Work',
  slug: 'agl-2-4-ct-work',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ánh xạ mọi ý chương 1–2 sang tính năng CT Work đã kiểm thật (backlog, story point, sprint, quy trình, burndown/velocity, CFD/cycle time/aging, webhook GitHub, đóng góp, xuất Project Tracking/WBS/báo cáo tuần SWP391, hub giảng viên, JQL, nhập CSV/Jira) và Jira tương đương; dựng dự án LF ở sprint 0; lab chạy thật xuất ticket SẴN SÀNG ra CSV RFC 4180; truy vấn lưu sẵn; tuần làm việc của trưởng nhóm; trung thực dữ liệu và token API.',
  content: L24(true) + L24(false),
};
