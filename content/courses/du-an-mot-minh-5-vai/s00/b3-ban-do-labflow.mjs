/**
 * 0.3 — Bản đồ LabFlow AI trong 20 phút: đọc trang dự án & LF #2 đúng thứ tự (dm5-0-3-ban-do-labflow).
 * Luật KHÔNG TRÙNG: KHÔNG chép lại ERD, 46 màn hình, 14 BR hay lộ trình 20 tuần từ /projects/labflow-ai;
 * chỉ dạy ĐƯỜNG ĐỌC 20 phút theo từng vai và đối chiếu với CT Work LF #2.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L03 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Lesson 0.3', 'Mục 0 · Bài 0.3', `
<h2>${t('0.3 — Map of LabFlow AI in 20 minutes: reading the project page &amp; LF #2 in order', '0.3 — Bản đồ LabFlow AI trong 20 phút: đọc trang dự án &amp; LF #2 đúng thứ tự')}</h2>
<p class="lead">${t(
    'Open the LabFlow AI project page for the first time and you face 29 sections, 13 diagrams, 20 tables — then open CT Work project LF #2 and you see over 600 cards across 20 sprints. Most beginners either scroll aimlessly for two hours and forget everything, or close the tab out of overwhelm. This lesson does <strong>not</strong> repeat what is already on the project page. Instead, it gives you a disciplined <strong>20-minute reading route</strong> — four 5-minute legs, one lens per hat — so you know exactly where every truth lives and which decisions still need your lecturer\'s approval in Week 1.',
    'Lần đầu mở trang dự án LabFlow AI, bạn gặp ngay 29 mục lớn, 13 sơ đồ, 20 bảng — rồi mở dự án LF #2 trên CT Work, bạn thấy hơn 600 thẻ trải dài 20 sprint. Phần lớn người mới hoặc cuộn vô định suốt hai tiếng rồi quên sạch, hoặc đóng tab vì choáng ngợp. Bài này <strong>không</strong> chép lại những gì trang dự án đã viết. Thay vào đó, bài trao cho bạn một <strong>đường đọc 20 phút</strong> gồm bốn chặng 5 phút — mỗi chặng đội một chiếc mũ — để bạn biết chính xác mọi thông tin nằm ở đâu và quyết định nào còn cần hỏi giảng viên chốt ngay Tuần 1.')}</p>

<h3>${t('Everyday picture: reading an airport terminal map before walking to your gate', 'Liên tưởng đời thường: đọc bản đồ nhà ga sân bay trước khi kéo vali đi tìm cổng')}</h3>
<p>${t(
    'Nobody explores a large international airport by walking down every corridor from Gate A1 to Gate D40 just in case their flight is there. You stop for two minutes at the terminal directory: find your terminal, find security, find your gate number, and note where the help desk is if something changes. The project page ',
    'Không ai khám phá một sân bay quốc tế lớn bằng cách kéo vali đi bộ từ cổng A1 tới cổng D40 để "xem máy bay mình ở đâu". Bạn dừng hai phút trước bảng sơ đồ nhà ga: xác định nhà ga nào, cổng an ninh ở đâu, cổng lên máy bay số mấy, và quầy hỗ trợ nằm chỗ nào nếu giờ bay thay đổi. Trang dự án ')}${lf('/projects/labflow-ai')}${t(
    ' is your terminal directory; CT Work <strong>LF #2</strong> is the live departure board telling you what boards today.',
    ' chính là bảng sơ đồ nhà ga; còn <strong>LF #2</strong> trên CT Work là bảng giờ bay trực tiếp báo hôm nay cần làm chuyến nào.')}</p>

<h3>${t('1. How the four sources of truth connect (never confuse them)', '1. Bốn nguồn thông tin của LabFlow nối với nhau thế nào (đừng bao giờ nhầm)')}</h3>
<p>${t(
    'Before starting the 20-minute timer, lock this map in your head so you never hunt in the wrong place:',
    'Trước khi bấm đồng hồ 20 phút, hãy khắc sơ đồ này vào đầu để không bao giờ đi tìm thông tin sai chỗ:')}</p>
<pre><code>  +-----------------------------+       references Req ID / Gate / BR
  |  1. /projects/labflow-ai    | ------------------------------------+
  |  (Static Blueprint)         |                                     |
  |  Problem, Arch, ERD, 46 Sxx |                                     v
  +-----------------------------+                       +-----------------------------+
                                                        |  2. CT Work LF #2           |
  +-----------------------------+   branch/commit LF-xx |  (Live Execution)           |
  |  3. GitHub Repo (labflow)   | &lt;-------------------&gt; |  20 sprints, 608+44 cards,  |
  |  (Source of Truth for Code) |                       |  9 gates, Q&amp;A, Defects, AI  |
  |  Spring Boot, React, Flyway |                       +-----------------------------+
  +-----------------------------+                                     |
                 |                                                    | exports / tracks
                 +------------------------+---------------------------+
                                          v
                            +-----------------------------+
                            |  4. Formal Reports (Docs)   |
                            |  Report 1-7, Weekly, RTM    |
                            |  (Submitted to Lecturer)    |
                            +-----------------------------+</code></pre>

<h3>${t('2. The 20-minute guided reading route (four 5-minute legs)', '2. Đường đọc có hướng dẫn trong 20 phút (bốn chặng, mỗi chặng 5 phút)')}</h3>
<p>${t(
    'Open ',
    'Mở ')}${lf('/projects/labflow-ai')}${t(
    ' in one browser tab and CT Work project <strong>LF #2</strong> (<code>/work</code>) in a second tab. Set a 20-minute timer and walk through these four legs in exact order:',
    ' ở tab thứ nhất và dự án <strong>LF #2</strong> trên CT Work (<code>/work</code>) ở tab thứ hai. Bấm đồng hồ 20 phút và đi đúng bốn chặng sau:')}</p>

${bang(
  [t('Time &amp; Hat', 'Thời gian &amp; Mũ'), t('Exact sections to open', 'Mục cần mở đúng thứ tự'), t('What to look for (do NOT memorise every line)', 'Cần nhìn ra điều gì (KHÔNG học thuộc lòng)'), t('Exit question after 5 minutes', 'Câu tự kiểm cuối 5 phút')],
  [
    [
      `<strong>00–05\'</strong><br>${mu('C2', en)}`,
      `${lf(t('1-minute summary', 'Tóm tắt trong một phút'))} → ${lf(t('Problem &amp; users', 'Bài toán và người dùng'))} → ${lf(t('Use cases &amp; screen auth', 'Use case và phân quyền màn hình'))} → ${lf(t('Screen flow', 'Screen flow'))} → ${lf(t('Core Business Rules', 'Business rules chính'))}`,
      t('See the 6 actors (Guest → Admin), the 4 workflows (WF0–WF3), what is <em>in</em> v1 vs <em>out</em> of v1, and notice the 14 Business Rules (BR-01..14) are <strong>proposals</strong> to confirm with your lecturer.', 'Nhận diện 6 actor (Guest → Admin), 4 workflow (WF0–WF3), thứ <em>trong</em> v1 vs <em>ngoài</em> v1, và chú ý 14 Business Rule (BR-01..14) là <strong>đề xuất</strong> chờ hỏi giảng viên chốt.'),
      t('Can I name the 6 actors and explain in 1 sentence what problem LabFlow solves that Excel/chat fails at?', 'Mình có kể được 6 actor và nói trong 1 câu LabFlow giải quyết nỗi đau nào mà Excel/nhắn tin bó tay không?')
    ],
    [
      `<strong>05–10\'</strong><br>${mu('C3', en)} ${mu('C4', en)}`,
      `${lf(t('Overall architecture', 'Kiến trúc tổng thể'))} → ${lf(t('Stack &amp; rationale', 'Stack và lý do chọn'))} → ${lf(t('Repo structure', 'Cấu trúc repo'))} → ${lf(t('Data model (ERD)', 'Mô hình dữ liệu (ERD)'))} → ${lf(t('Anti-double-booking', 'Trái tim hệ thống: chống đặt trùng'))} → ${lf(t('State machines', 'Vòng đời các đối tượng'))}`,
      t('Understand <em>why</em> modular monolith + PostgreSQL (not microservices, not MySQL by default), how package-by-feature enforces one-way dependencies, why the DB exclusion constraint beats an <code>if</code> check, and spot the 4 state machines.', 'Hiểu <em>vì sao</em> modular monolith + PostgreSQL (không làm microservices, không mặc định MySQL), cách chia package-by-feature giữ phụ thuộc một chiều, vì sao ràng buộc DB thắng câu <code>if</code>, và nhận diện 4 máy trạng thái.'),
      t('Why does LabFlow copy <code>period</code> into <code>reservation_items</code> and store half-open <code>[start, end)</code>?', 'Vì sao LabFlow chép <code>period</code> vào <code>reservation_items</code> và lưu khoảng nửa mở <code>[start, end)</code>?')
    ],
    [
      `<strong>10–15\'</strong><br>${mu('C5', en)} ${mu('C1', en)}`,
      `${lf(t('Security', 'Bảo mật'))} → ${lf(t('Testing', 'Kiểm thử'))} → ${lf(t('46 screens &amp; owners', '46 màn hình và ai làm màn nào'))} → ${lf(t('SWP391 grading rules', 'Luật chấm SWP391 cần nhớ'))} → ${lf(t('Definition of Done', 'Definition of Done'))} → ${lf(t('Recorded traps', 'Những cái bẫy đã được ghi lại'))}`,
      t('See how 46 Req map across C1–C5 and Iter 1–3, why every screen must reach Quality <strong>L2</strong> before starting a new screen, what the DoD demands, and the 11 documented traps to avoid.', 'Thấy cách 46 Req phân bổ cho C1–C5 qua Iter 1–3, vì sao mọi màn phải chạm Quality <strong>L2</strong> trước khi sang màn mới, DoD đòi hỏi gì và 11 cái bẫy đã ghi sẵn để né.'),
      t('What is the difference between a Defect and a Leakage, and why does stopping at L1 hurt your LOC grade?', 'Defect khác Leakage ở đâu, và vì sao dừng ở L1 làm mất nửa điểm LOC?')
    ],
    [
      `<strong>15–20\'</strong><br>${mu('C1', en)}`,
      t('CT Work project <strong>LF #2</strong>: open <code>backlog</code>, <code>board</code>, <code>stages</code> (9 gates), and epic <em>"Chuẩn bị bảo vệ hội đồng"</em> + SEP490 doc epic (LF-609).', 'Dự án <strong>LF #2</strong> trên CT Work: mở <code>backlog</code>, <code>board</code>, <code>stages</code> (9 cổng gate), epic <em>"Chuẩn bị bảo vệ hội đồng"</em> + epic hồ sơ SEP490 (LF-609).'),
      t('See how the blueprint becomes real cards: <strong>608 SWP cards</strong> (covering the 46 Req cards and their 5 role sub-tasks each, daily study cards, epics, gates, and 36 defense Q&amp;A cards) + <strong>44 SEP490 report cards</strong> (<code>LF-610…LF-653</code> under epic <code>LF-609</code>, W11–W20). Open 1 daily card to see its 5-part mentor prompt structure.', 'Thấy bản vẽ biến thành thẻ thật ra sao: <strong>608 thẻ SWP</strong> (gồm 46 thẻ Req cùng 5 việc theo vai mỗi Req, thẻ học theo ngày, epic, cổng gate và 36 thẻ câu hỏi bảo vệ) + <strong>44 thẻ hồ sơ SEP490</strong> (<code>LF-610…LF-653</code> trong epic <code>LF-609</code>, W11–W20). Mở 1 thẻ ngày xem cấu trúc 5 mục hướng dẫn học.'),
      t('Can I locate Sprint 1, Gate G0, one Req card, and the Quick Lookup table at the bottom of the project page?', 'Mình có tìm ra ngay Sprint 1, cổng G0, một thẻ Req và bảng Tra cứu nhanh ở cuối trang dự án không?')
    ]
  ]
)}

<h3>${t('3. How to read one Req card on LF #2 without getting lost', '3. Cách đọc một thẻ Req trên LF #2 mà không bị rối')}</h3>
<p>${t(
    'Seeing 608 cards on a backlog can trigger panic if you try to read all of them. Remember: you only ever work on <strong>this week\'s sprint</strong> (roughly 6 daily cards + the active Req cards for the current iteration). Notice how every single Req on ',
    'Thấy 608 thẻ trong backlog rất dễ hoảng nếu bạn cố đọc hết. Hãy nhớ: mỗi lúc bạn chỉ làm đúng <strong>sprint của tuần hiện tại</strong> (khoảng 6 thẻ ngày + các thẻ Req thuộc iteration đang chạy). Chú ý cách mỗi Req trên ')}${lf(t('46 screens', '46 màn hình'))}${t(
    ' fans out into five structured pieces of work on CT Work — matching the exact five hats:',
    ' bung ra thành năm việc có cấu trúc trên CT Work — khớp đúng năm chiếc mũ:')}</p>
<ul>
<li>${mu('C2', en)} <strong>Spec &amp; Wireframe</strong>: ${t('Use Case flow, Business Rules, happy + ≥ 3 unhappy cases, wireframe confirmation.', 'Luồng Use Case, Business Rule, happy + ≥ 3 unhappy case, xác nhận wireframe.')}</li>
<li>${mu('C3', en)} <strong>Design &amp; Backend</strong>: ${t('DB migration (Flyway), API contract, backend validation, authorization, audit log, service tests.', 'Migration CSDL (Flyway), hợp đồng API, validate backend, phân quyền, audit log, test service.')}</li>
<li>${mu('C4', en)} <strong>Frontend &amp; Integration</strong>: ${t('Shared layout, typed React form/table (search/filter/sort/paging), loading &amp; error states.', 'Layout chung, form/bảng React có kiểu (tìm/lọc/sắp xếp/phân trang), trạng thái tải &amp; lỗi.')}</li>
<li>${mu('C5', en)} <strong>Testing &amp; Evidence</strong>: ${t('Execute test cases (Unit/Integration/System), log Defects, verify fixes, attach Evidence.', 'Chạy test case (Unit/Integration/System), ghi Defect, kiểm lại sau sửa, đính kèm Evidence.')}</li>
<li>${mu('C1', en)} <strong>Merge, Docs &amp; Sign-off</strong>: ${t('Merge PR into <code>main</code>, sync SRS/SDS/Project Tracking, verify DoD, move to <code>Done</code>.', 'Merge PR vào <code>main</code>, đồng bộ SRS/SDS/Project Tracking, kiểm DoD, kéo sang <code>Done</code>.')}</li>
</ul>
${note(t(
    '<strong>Wait — why does the 46-screen table say "C1 owns S22", yet S22 has tasks for C2 → C3 → C4 → C5 → C1?</strong> Keep two lenses separate right now: (1) <em>Vertical-slice domain owner (for SWP391 LOC grading)</em> — screen <code>S22</code> (Create reservation wizard) belongs to <strong>C1</strong>, meaning in a 5-student SWP391 team C1 owns S22 end-to-end and earns its 240 LOC; (2) <em>Process hat (company workflow discipline)</em> — as one student building <code>S22</code>, you still wear the 5 hats in sequence: <strong>C2</strong> writes S22\'s spec/BRs, <strong>C3 &amp; C4</strong> code S22\'s BE &amp; FE (under C1\'s vertical domain), <strong>C5</strong> attacks S22 with unhappy cases, and <strong>C1</strong> merges &amp; verifies DoD. Lesson 1.3 drills this mapping in detail.',
    '<strong>Khoan đã — vì sao bảng 46 màn ghi "C1 sở hữu S22", nhưng S22 lại có việc của C2 → C3 → C4 → C5 → C1?</strong> Hãy tách hai lớp ngay từ bây giờ: (1) <em>Chủ miền dọc (để tính điểm LOC SWP391)</em> — màn <code>S22</code> (Create reservation wizard) thuộc về <strong>C1</strong>, nghĩa là theo luật SWP391 5 người thì C1 chịu trách nhiệm trọn gói S22 và hưởng 240 LOC của màn này; (2) <em>Chiếc mũ quy trình (kỷ luật vận hành công ty)</em> — khi một mình bạn làm <code>S22</code>, bạn vẫn đội lần lượt 5 chiếc mũ: <strong>C2</strong> viết spec/BR cho S22, <strong>C3 &amp; C4</strong> code BE &amp; FE (thuộc miền dọc của C1), <strong>C5</strong> test unhappy case của S22, còn <strong>C1</strong> merge và chốt DoD. Bài 1.3 sẽ mổ xẻ sâu cách khớp hai lớp này.'))}
<p>${t('To know how CT Work displays cards, sub-tasks, worklogs, and filters, review ', 'Để nắm nhanh thao tác mở thẻ, việc con, ghi giờ và bộ lọc trên CT Work, xem thêm ')}${cs('huong-dan-ct-work', 'ctw-02-board-hang-ngay', t('CT Work 02 — Daily Board', 'CT Work 02 — Dùng Board mỗi ngày'))} ${t('and ', 'và ')}${cs('huong-dan-ct-work', 'ctw-03-the-viec-chi-tiet', t('CT Work 03 — Card A–Z', 'CT Work 03 — Một thẻ việc từ A tới Z'))}.</p>

<h3>${t('4. Locked vs. Proposed: what is fixed and what you MUST ask your lecturer in Week 1', '4. Đã chốt vs. Đang đề xuất: thứ gì cố định và thứ gì BẮT BUỘC hỏi giảng viên Tuần 1')}</h3>
<p>${t(
    'A classic student mistake is treating every line on a reference plan as university law — or conversely, changing core architecture mid-project because a friend suggested microservices. Use this split table to protect your Week 1 Q&amp;A session:',
    'Lỗi kinh điển của sinh viên là coi mọi con số trong bản nháp kế hoạch như luật cứng của trường — hoặc ngược lại, tự ý đổi kiến trúc giữa chừng vì nghe bạn gợi ý làm microservices. Dùng bảng phân tách sau để chuẩn bị buổi hỏi đáp Q&amp;A Tuần 1:')}</p>

${bang(
  [t('Category', 'Hạng mục'), t('Status', 'Trạng thái'), t('Concrete details for LabFlow', 'Chi tiết cụ thể trên LabFlow'), t('Action required', 'Việc cần làm')],
  [
    [t('<strong>Architecture style</strong>', '<strong>Kiểu kiến trúc</strong>'), t('🔒 LOCKED', '🔒 ĐÃ CHỐT'), t('Modular monolith ("monolith-first" per Martin Fowler) with 5 clean module rules — NOT microservices for solo v1.', 'Modular monolith ("monolith-first" theo Martin Fowler) với 5 nguyên tắc module sạch — KHÔNG tách microservices ở v1 solo.'), t('Keep firm; cite "monolith-first + clean extraction path" in SDS &amp; defense.', 'Giữ vững; nêu rõ "monolith-first + lộ trình tách" trong SDS &amp; khi bảo vệ.')],
    [t('<strong>Hand-coded &amp; Honesty</strong>', '<strong>Tự code tay &amp; Trung thực</strong>'), t('🔒 LOCKED', '🔒 ĐÃ CHỐT'), t('100% hand-coded; AI = mentor only; declare "1 person, 5 roles" openly.', 'Tự code tay 100%; AI chỉ làm mentor; công khai "1 người 5 vai".'), t('Log AI usage weekly in Template5; never fake Git history.', 'Ghi AI Usage Report hằng tuần (Template5); không giả lịch sử Git.')],
    [t('<strong>Database &amp; Stack</strong>', '<strong>CSDL &amp; Stack</strong>'), t('❓ ASK LECTURER W1', '❓ HỎI GV TUẦN 1'), t('SWP391 Policies sheet often mandates MySQL/Servlet-JSP; LabFlow proposes PostgreSQL 16 + Spring Boot 3 + React.', 'Sheet Policies SWP391 thường ghi MySQL; LabFlow đề xuất PostgreSQL 16 + Spring Boot 3 + React.'), t('Create CT Work <code>Q&amp;A #1</code>; if MySQL is forced, fall back to <code>UNIQUE (resource_id, slot_id)</code> + transaction and record an ADR.', 'Tạo thẻ <code>Q&amp;A #1</code>; nếu bắt dùng MySQL, chuyển sang <code>UNIQUE (resource_id, slot_id)</code> + transaction và ghi ADR.')],
    [t('<strong>MaxLOC &amp; Grading scale</strong>', '<strong>Bảng MaxLOC &amp; Thang điểm</strong>'), t('❓ ASK LECTURER W1', '❓ HỎI GV TUẦN 1'), t('Whether your class uses 180/240/660 or 240/240/720 MaxLOC across Iter 1–3, and exact submission dates.', 'Lớp bạn áp bảng 180/240/660 hay 240/240/720 cho Iter 1–3, và hạn nộp chính xác từng mốc.'), t('Create <code>Q&amp;A #2</code>; check ', 'Tạo <code>Q&amp;A #2</code>; xem lại ') + ac('software-development-project', 'swp391-dieu-kien-qua-mon', 'SWP391 0.2')],
    [t('<strong>14 Business Rules (BR-01..14)</strong>', '<strong>14 Business Rule (BR-01..14)</strong>'), t('❓ CONFIRM WITH LECTURER', '❓ CHỐT VỚI GV'), t('Quota (6h/week), free cancel window (≥ 2h), check-in window (±15 min), loan duration (3 days), penalty rules.', 'Quota (6h/tuần), hạn huỷ miễn phí (≥ 2h), cửa sổ check-in (±15 phút), hạn mượn (3 ngày), luật phạt no-show.'), t('Create <code>Q&amp;A #3</code>; freeze confirmed values into SRS §5 and Settings screen <code>S19</code>.', 'Tạo <code>Q&amp;A #3</code>; chốt số vào SRS §5 và đưa vào cấu hình màn <code>S19</code>.')],
    [t('<strong>SEP490 Group Code &amp; Dates</strong>', '<strong>Mã nhóm &amp; Lịch SEP490</strong>'), t('❓ CONFIRM BEFORE W11', '❓ CHỐT TRƯỚC TUẦN 11'), t('Naming convention <code>SEP490_&lt;Gxxx&gt;_&lt;template&gt;_v&lt;x.y&gt;</code> and alignment with OJT schedule.', 'Quy ước tên file <code>SEP490_&lt;Gxxx&gt;_&lt;mẫu&gt;_v&lt;x.y&gt;</code> và khớp lịch OJT thực tế.'), t('Confirm with supervisor at start of SEP490; shift CT Work dates if needed.', 'Hỏi thầy hướng dẫn đầu SEP490; dời ngày thẻ CT Work nếu lịch trường khác.')]
  ]
)}

<h3>🕵️ ${t('The attacker\'s / trap angle: what happens when you skip two sections of the blueprint', 'Góc kẻ xấu &amp; bẫy thực tế: chuyện gì xảy ra nếu đọc lướt bỏ qua hai mục trên trang dự án')}</h3>
<p>${t(
    'Two sections at the bottom of ',
    'Hai mục gần cuối trang ')}${lf('/projects/labflow-ai')}${t(
    ' — <em>Bảo mật (Security)</em> and <em>Những cái bẫy đã được ghi lại (Recorded traps)</em> — are the ones tired students skip first, and the exact ones examiners and attackers exploit first. Suppose you skip them (hypothetical student example):',
    ' — <em>Bảo mật</em> và <em>Những cái bẫy đã được ghi lại</em> — là hai mục sinh viên mệt hay lướt qua nhất, và lại là đúng chỗ hội đồng cùng kẻ tấn công đánh trúng đầu tiên. Giả sử bạn bỏ qua chúng (ví dụ giả định):')}</p>
<ul>
<li>${t('<strong>Trap 1 (UI-only security):</strong> You hide the "Approve" button from Students in React, feeling safe. During defense, the examiner opens DevTools or sends <code>POST /api/v1/reservations/12/approve</code> with a Student JWT — and your Spring Boot controller approves it! Because you skipped the Security table, you forgot <code>@PreAuthorize</code> on the backend.', '<strong>Bẫy 1 (Bảo mật chỉ ẩn nút):</strong> Bạn ẩn nút "Duyệt" khỏi màn hình Student trong React và yên tâm. Khi bảo vệ, giám khảo mở DevTools hoặc gửi thẳng <code>POST /api/v1/reservations/12/approve</code> kèm JWT của Student — và controller Spring Boot duyệt thật! Vì bỏ qua bảng Bảo mật, bạn đã quên <code>@PreAuthorize</code> ở backend.')}</li>
<li>${t('<strong>Trap 2 (Fake concurrency test):</strong> You test double-booking by clicking fast on your browser or using an in-memory H2 database. Everything passes locally — until two parallel requests hit PostgreSQL and both insert overlapping slots because you never added the exclusion constraint or Testcontainers test.', '<strong>Bẫy 2 (Test đồng thời giả):</strong> Bạn thử chống đặt trùng bằng cách bấm chuột nhanh trên trình duyệt hoặc chạy H2 trong RAM. Mọi thứ xanh lè — tới khi hai request song song đánh vào PostgreSQL và cả hai cùng chèn được lịch chồng nhau vì bạn chưa đặt exclusion constraint hay chạy Testcontainers.')}</li>
<li>${t('<strong>Trap 3 (<code>ddl-auto=update</code>):</strong> Hibernate silently alters your local tables, so your Flyway migration script is outdated. On demo day, running <code>docker compose up</code> on a clean machine crashes on startup.', '<strong>Bẫy 3 (<code>ddl-auto=update</code>):</strong> Hibernate âm thầm sửa bảng dưới máy bạn nên script Flyway bị lỗi thời. Tới ngày demo, chạy <code>docker compose up</code> trên máy sạch là ứng dụng chết ngay lúc khởi động.')}</li>
</ul>

<h3>📋 ${t('20-Minute Scavenger Hunt (fillable check — look up on /projects/labflow-ai &amp; LF #2)', 'Phiếu săn thông tin 20 phút (mẫu điền được — tự tra trên /projects/labflow-ai &amp; LF #2)')}</h3>
<p>${t('Do not guess from memory. Open both tabs, find the exact answer, fill column 3, then open the answer key below to verify:', 'Không đoán theo trí nhớ. Mở hai tab, tự tra câu trả lời chính xác, điền vào cột 3, rồi mở đáp án bên dưới để đối chiếu:')}</p>
${bang(
  ['#', t('Question to look up', 'Câu hỏi cần tự tra'), t('Your answer', 'Câu trả lời của bạn'), t('Where to look', 'Tra ở mục nào')],
  [
    ['1', t('What are the 4 workflows (WF0–WF3) of LabFlow v1?', '4 workflow (WF0–WF3) của LabFlow v1 là gì?'), '________________', lf(t('Problem &amp; users', 'Bài toán và người dùng'))],
    ['2', t('Which PostgreSQL error code is thrown when an exclusion constraint rejects an overlapping booking?', 'Mã lỗi PostgreSQL nào bị ném ra khi exclusion constraint chặn đặt trùng giờ?'), '________________', lf(t('Anti-double-booking', 'Trái tim hệ thống: chống đặt trùng'))],
    ['3', t('In the Maintenance Ticket state machine, why can the technician who fixed a device NOT close the ticket alone?', 'Trong máy trạng thái Maintenance Ticket, vì sao kỹ thuật viên sửa máy KHÔNG tự đóng ticket được?'), '________________', lf(t('State machines', 'Vòng đời các đối tượng'))],
    ['4', t('Which role owns screen <code>S22</code> (Create reservation wizard) and in which iteration?', 'Vai nào phụ trách màn <code>S22</code> (Create reservation wizard) và làm ở iteration mấy?'), '________________', lf(t('46 screens', '46 màn hình'))],
    ['5', t('How many points of LOC is a Medium (M) screen worth at Quality L1 vs L2?', 'Một màn độ phức tạp Medium (M) được bao nhiêu điểm LOC ở mức L1 so với L2?'), '________________', lf(t('SWP391 grading rules', 'Luật chấm SWP391'))],
    ['6', t('What happens on CT Work if you try to drag a card to <code>Done</code> without filling Evidence?', 'Điều gì xảy ra trên CT Work nếu bạn kéo thẻ sang <code>Done</code> khi chưa điền Evidence?'), '________________', lf(t('Definition of Done', 'Definition of Done'))],
    ['7', t('How many defense questions with model answers exist in the defense epic on CT Work LF #2?', 'Có bao nhiêu câu hỏi bảo vệ kèm đáp án mẫu trong epic chuẩn bị bảo vệ trên LF #2?'), '________________', lf(t('Defense prep', 'Chuẩn bị bảo vệ'))],
    ['8', t('If you forget whether module <code>catalog</code> is allowed to call module <code>reservation</code>, which section answers you in 10 seconds?', 'Nếu quên module <code>catalog</code> có được gọi <code>reservation</code> không, mở mục nào để tra trong 10 giây?'), '________________', lf(t('Quick lookup', 'Tra cứu nhanh'))]
  ]
)}

${giai(t('Open answer key after completing all 8 lookups', 'Mở đáp án sau khi đã tự tra đủ 8 câu'), `
<ol>
<li>${t('<strong>WF0</strong> Authentication · <strong>WF1</strong> Master data (CRUD) · <strong>WF2</strong> Core transactions (book/cancel/waitlist/check-in/loan/maintenance) · <strong>WF3</strong> Dashboards &amp; reports.', '<strong>WF0</strong> Xác thực · <strong>WF1</strong> Danh mục (CRUD) · <strong>WF2</strong> Giao dịch lõi (đặt/huỷ/waitlist/check-in/mượn-trả/bảo trì) · <strong>WF3</strong> Dashboard &amp; báo cáo.')}</li>
<li>${t('Error code <code>23P01</code> (<code>exclusion_violation</code>) → backend catches it, rolls back, and returns HTTP <code>409 Conflict</code>.', 'Mã lỗi <code>23P01</code> (<code>exclusion_violation</code>) → backend bắt lỗi, rollback và trả về HTTP <code>409 Conflict</code>.')}</li>
<li>${t('BR-13 / separation of duties: <code>FIXED → VERIFIED</code> must be checked by a Manager (someone other than the fixer) before <code>CLOSED</code>.', 'Luật BR-13 / tách quyền kiểm chứng: chuyển <code>FIXED → VERIFIED</code> phải do Manager (người khác người sửa) xác nhận trước khi <code>CLOSED</code>.')}</li>
<li>${t('Role <strong>C1</strong> (Leader), complexity <strong>C</strong> (240 LOC), scheduled in <strong>iter2</strong>.', 'Vai <strong>C1</strong> (Leader), độ phức tạp <strong>C</strong> (240 LOC), xếp ở <strong>iter2</strong>.')}</li>
<li>${t('Medium = 120 LOC base: <strong>L1 (50%) = 60 LOC</strong> · <strong>L2 (75%) = 90 LOC</strong> — skipping unhappy cases costs 30 LOC on just one screen!', 'Medium = 120 LOC gốc: <strong>L1 (50%) = 60 LOC</strong> · <strong>L2 (75%) = 90 LOC</strong> — bỏ qua unhappy case mất ngay 30 LOC chỉ trên một màn!')}</li>
<li>${t('CT Work Done rules automatically block moving the card to <code>Done</code> until Evidence (PR link / test report / video) is attached.', 'Done rules của CT Work tự chặn kéo sang <code>Done</code> cho tới khi có Evidence (link PR / báo cáo test / video).')}</li>
<li>${t('<strong>36 questions</strong> with model answers in the epic "Chuẩn bị bảo vệ hội đồng", plus AI "Practice the defense" mode.', '<strong>36 câu hỏi</strong> kèm đáp án mẫu trong epic "Chuẩn bị bảo vệ hội đồng", cộng chế độ luyện hỏi đáp với AI.')}</li>
<li>${t('<strong>Tra cứu nhanh (Quick lookup)</strong> → points to <em>Cấu trúc repo → luật một chiều</em>: <code>reservation</code> may call <code>catalog</code>, never the reverse.', '<strong>Tra cứu nhanh</strong> → trỏ thẳng tới <em>Cấu trúc repo → luật một chiều</em>: <code>reservation</code> được gọi <code>catalog</code>, tuyệt đối không ngược lại.')}</li>
</ol>
`)}

${viecLabflow([
  [
    t('Run the <strong>20-Minute Scavenger Hunt</strong> live with both tabs open (<code>/projects/labflow-ai</code> and CT Work <code>LF #2</code>) and record your 8 answers + any question you still did not understand in CT Work <code>docs</code>.', 'Chạy thật <strong>Phiếu săn thông tin 20 phút</strong> với hai tab mở song song (<code>/projects/labflow-ai</code> và CT Work <code>LF #2</code>), ghi lại 8 câu trả lời cộng mọi điểm bạn còn thấy khó hiểu vào <code>docs</code> trên CT Work.'),
    t('All 8 answers match the answer key and you have listed 1–3 personal questions to look up in Week 1.', 'Đủ 8 câu khớp đáp án và bạn ghi ra được 1–3 câu hỏi riêng cần tìm hiểu ở Tuần 1.')
  ],
  [
    t('Open <strong>Sprint 1</strong> in CT Work <code>LF #2</code> and open Day 1\'s card. Bookmark the <strong>Tra cứu nhanh</strong> section of <code>/projects/labflow-ai</code> in your browser toolbar.', 'Mở <strong>Sprint 1</strong> trong <code>LF #2</code> trên CT Work và đọc thẻ Ngày 1. Ghim mục <strong>Tra cứu nhanh</strong> của <code>/projects/labflow-ai</code> lên thanh bookmark trình duyệt.'),
    t('You can explain in 30 seconds what Sprint 1 finishes by Sunday and where Gate <code>G0 Foundation</code> sits.', 'Bạn nói lại được trong 30 giây cuối Sprint 1 phải xong gì và cổng <code>G0 Foundation</code> nằm ở ngày nào.')
  ]
], en)}

${apDung([
  [t('Multi-vendor E-commerce Marketplace (topic switch)', 'Sàn thương mại điện tử nhiều người bán (đổi đề tài)'), t('Write a 1-page blueprint using the exact 4 lenses before coding: (1) Actors &amp; WF0–WF3 (Guest, Buyer, Seller, Admin; Auth, Shop/Catalog CRUD, Cart → Order → Payment → Shipping → Review, Analytics); (2) ERD &amp; concurrency lock on stock deduction (preventing two buyers from ordering the last item); (3) Security &amp; traps (Seller IDOR, fake payment webhook); (4) Locked decisions vs Week-1 Lecturer Q&amp;A cards (inventory reservation window, cancellation/refund BRs, shipping fee rules).', 'Viết bản đồ 1 trang theo đúng 4 lăng kính trước khi code: (1) Actor &amp; WF0–WF3 (Guest, Người mua, Người bán, Admin; Xác thực, Danh mục/Shop, Giỏ hàng → Đơn hàng → Thanh toán → Vận chuyển → Đánh giá, Báo cáo); (2) ERD &amp; khoá trừ tồn kho (chặn hai người mua cùng chốt món cuối cùng); (3) Bảo mật &amp; bẫy (IDOR đơn của shop khác, giả mạo callback thanh toán); (4) Phần đã chốt vs thẻ Q&amp;A Tuần 1 (BR giữ tồn kho bao lâu, luật huỷ/hoàn tiền, phí vận chuyển).')],
  [t('Real 5-student SEP490 team', 'Đồ án nhóm thật 5 người (SEP490)'), t('Run this exact 20-minute 4-leg reading route together in your Week-1 kickoff meeting so all 5 members align on the same ERD, Business Rules, vertical-slice screen owners, and security traps before anyone opens an IDE.', 'Chạy chung đúng đường đọc 20 phút 4 chặng này ngay buổi kickoff Tuần 1 để cả 5 thành viên thống nhất một ERD, một bộ Business Rule, ai sở hữu màn hình dọc nào và các bẫy bảo mật trước khi bất kỳ ai mở IDE.')],
  [t('Enterprise company (FPT Software, 20–100 person outsourcing project)', 'Công ty lớn (FPT Software, dự án outsourcing 20–100 người)'), t('Never read a 300-page Confluence wiki sequentially; use the exact 4-leg route across PO/BA specs, Solution Architect diagrams, QA Lead &amp; Security checklists, and the Jira sprint board (managed with Scrum Master &amp; DevOps under CMMI/ISO traceability) to become productive in week one.', 'Đừng đọc lần lượt 300 trang Confluence wiki từ đầu tới cuối; áp đúng đường đọc 4 chặng qua đặc tả PO/BA, sơ đồ Kiến trúc sư, checklist QA Lead/Bảo mật và bảng Jira sprint (cùng Scrum Master &amp; DevOps theo truy vết CMMI/ISO) để bắt nhịp ngay tuần đầu.')]
], en)}

${thuatNgu([
  [t('single source of truth (nguồn sự thật duy nhất)', 'single source of truth (nguồn sự thật duy nhất)'), t('Designating one authoritative home for each kind of info (blueprint vs live cards vs code vs submitted reports) so copies never contradict.', 'Quy định đúng một nơi chính thức cho từng loại thông tin (bản vẽ vs thẻ việc vs code vs báo cáo nộp) để tránh các bản sao mâu thuẫn nhau.')],
  ['Gate (G0, SWP-M1..M3, SEP-M4..M6)', t('A mandatory quality checkpoint where specific technical or academic proof must pass before advancing.', 'Cổng kiểm chất lượng bắt buộc phải vượt qua với bằng chứng cụ thể trước khi sang giai đoạn kế.')],
  ['Defect vs. Leakage', t('Defect = bug found by your own team/QA before submission; Leakage = bug found by the lecturer/client AFTER submission (penalised and fixed first).', 'Defect = lỗi do chính nhóm/QA tìm trước khi nộp; Leakage = lỗi do giảng viên/khách phát hiện SAU khi nộp (bị trừ điểm và phải sửa đầu tiên).')],
  ['Exclusion constraint (PostgreSQL)', t('A database-level constraint (<code>EXCLUDE USING gist</code>) guaranteeing no two active rows can hold overlapping time ranges for the same resource.', 'Ràng buộc mức CSDL (<code>EXCLUDE USING gist</code>) bảo đảm không bao giờ có hai dòng active chồng khoảng thời gian trên cùng một tài nguyên.')],
  ['ADR (Architecture Decision Record)', t('A short document recording an important architectural choice, its context, alternatives considered, and consequences.', 'Tài liệu ngắn ghi lại một quyết định kiến trúc quan trọng, bối cảnh, các phương án đã cân nhắc và hệ quả.')]
], en)}

${tomTat([
  t('Never read a 29-section blueprint from top to bottom passively; use the 4 × 5-minute hat-based reading route (BA → Dev → QA → PM).', 'Đừng đọc thụ động một bản vẽ 29 mục từ trên xuống dưới; dùng đường đọc 4 × 5 phút theo từng chiếc mũ (BA → Dev → QA → PM).'),
  t('Keep the four sources of truth distinct: /projects/labflow-ai (blueprint), CT Work LF #2 (live execution), GitHub (code), and Report 1–7 (formal submissions).', 'Tách bạch bốn nguồn sự thật: /projects/labflow-ai (bản vẽ), CT Work LF #2 (thực thi sống), GitHub (mã nguồn) và Report 1–7 (hồ sơ nộp).'),
  t('Separate locked decisions (modular monolith, hand-coding, honesty) from Week-1 lecturer Q&A items (PostgreSQL approval, MaxLOC table, BR-01..14 numbers).', 'Tách rõ quyết định đã chốt (modular monolith, tự code tay, trung thực) khỏi các mục cần hỏi giảng viên Tuần 1 (duyệt PostgreSQL, bảng MaxLOC, số BR-01..14).'),
  t('Never skip the Security and Recorded Traps tables — they prevent the top bugs examiners test during defense.', 'Tuyệt đối không bỏ qua bảng Bảo mật và Những cái bẫy — chúng chặn đúng những lỗi hội đồng hay kiểm nhất khi bảo vệ.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-0-4-dung-cong-ty-mot-nguoi', t('0.4 — Setting up your "one-person company": CT Work, 5 role accounts, GitHub & rituals', '0.4 — Dựng "công ty một người": CT Work, 5 tài khoản vai, GitHub, chat & lịch họp'))}.</p>
`);
};

export default {
  title: '0.3 — Map of LabFlow AI in 20 minutes: reading the project page & LF #2 in order|||0.3 — Bản đồ LabFlow AI trong 20 phút: đọc trang dự án & LF #2 đúng thứ tự',
  slug: 'dm5-0-3-ban-do-labflow',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đường đọc 20 phút (4 chặng × 5 phút theo từng mũ C1–C5) để nắm trọn trang dự án /projects/labflow-ai và dự án LF #2 trên CT Work mà không bị ngộp; phân biệt thứ đã chốt vs cần hỏi GV tuần 1; 3 cái bẫy bảo mật/concurrency; phiếu săn thông tin 8 câu kèm đáp án.',
  content: L03(true) + L03(false),
};
