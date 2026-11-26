/**
 * Chương 1 — Năm chiếc mũ: vai trò, trách nhiệm, luật đổi mũ (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 6 bài kiến thức (1.1–1.6), 1 bài Lab thực hành trên CT Work LF #2 (1.7, dm5-1-lab) và bài kiểm tra 12 câu (1.8, dm5-1-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s01/b1-leader-pm.mjs';
import B2 from './s01/b2-ba.mjs';
import B3 from './s01/b3-dev-be-fe.mjs';
import B4 from './s01/b4-qa-tester.mjs';
import B5 from './s01/b5-doi-mu.mjs';
import B6 from './s01/b6-raci-lich-tuan.mjs';
import B7 from './s01/b7-lab.mjs';

const QUIZ1 = [
  Q('dm5-1-q1',
    'What most clearly distinguishes a real Leader/PM (hat C1) from a "slide-collector" student team leader?|||Điều gì phân biệt rõ nhất một Leader/PM thật (mũ C1) với kiểu "nhóm trưởng gom bài"?',
    [
      'A real Leader/PM writes 90% of the team\'s code alone in the last two nights|||Leader/PM thật tự thức hai đêm cuối viết hộ 90% code của cả nhóm',
      'A real Leader/PM locks scope (P0/P1/P2), tracks gates &amp; WIP early, maintains a live RAID log, guards main/DoD, and reports with evidence (RAG + metrics)|||Leader/PM thật khoá phạm vi (P0/P1/P2), theo dõi gate &amp; WIP từ sớm, giữ sổ RAID sống, bảo vệ main/DoD và báo cáo bằng số liệu (RAG + chỉ số)',
      'A real Leader/PM never codes any screens and spends 100% of time formatting Jira boards|||Leader/PM thật không code màn hình nào mà dành 100% thời gian trang trí bảng Jira',
      'A real Leader/PM hides mid-sprint delays from the lecturer until demo day so nobody worries|||Leader/PM thật giấu việc trễ giữa sprint với giảng viên tới tận ngày demo để đỡ lo',
    ],
    1,
    'Like an air traffic controller, C1 governs scope, schedule, integration, risks, and honest evidence-based reporting — while capping governance overhead (≤ 3h/week solo) to still build own vertical-slice screens. Lesson 1.1.|||Như kiểm soát viên không lưu, C1 quản trị phạm vi, tiến độ, tích hợp, rủi ro và báo cáo bằng bằng chứng — đồng thời giới hạn giờ quản trị thuần (≤ 3 giờ/tuần khi làm một mình) để vẫn code miền dọc của mình. Bài 1.1.'),

  Q('dm5-1-q2',
    'What is the main project-management takeaway from the 1994–1995 Denver International Airport Automated Baggage System failure (GAO/RCED-95-35BR)?|||Bài học quản trị dự án chính từ sự cố Hệ thống hành lý tự động Sân bay Denver 1994–1995 (GAO/RCED-95-35BR) là gì?',
    [
      'Automated systems should never use databases|||Hệ thống tự động không bao giờ nên dùng cơ sở dữ liệu',
      'Skilled engineering alone cannot save a project when scope keeps changing without freeze, schedules ignore risk warnings, and integration is pushed to the end|||Kỹ thuật giỏi đơn lẻ không cứu nổi dự án khi phạm vi liên tục đổi không khoá, lịch phớt lờ cảnh báo rủi ro và tích hợp bị đẩy xuống cuối',
      'Airports should never hire external software contractors|||Sân bay không bao giờ nên thuê nhà thầu phần mềm ngoài',
      'Microservices would have finished the airport on time|||Microservices sẽ giúp sân bay hoàn thành đúng hạn',
    ],
    1,
    'Unfrozen scope, unrealistic scheduling ignoring technical risks, and late integration caused a roughly 16-month delay and hundreds of millions of dollars in cost overruns (exact figures vary by source) despite strong engineers. Lesson 1.1.|||Phạm vi không khoá, lịch bất khả thi phớt lờ rủi ro kỹ thuật và tích hợp muộn gây trễ khoảng 16 tháng và vượt ngân sách hàng trăm triệu USD (số liệu khác nhau tuỳ nguồn) dù có kỹ sư giỏi. Bài 1.1.'),

  Q('dm5-1-q3',
    'Under hat C2 (BA), which requirement sentence is unambiguous and ready for development &amp; QA?|||Dưới mũ C2 (BA), câu yêu cầu nào KHÔNG mơ hồ và sẵn sàng để Dev code và QA test?',
    [
      'Students should be able to cancel bookings easily and reasonably quickly|||Sinh viên có thể huỷ lịch đặt một cách dễ dàng và khá nhanh',
      'System uses Redis to cache cancellations so it is user-friendly, etc.|||Hệ thống dùng Redis để cache lệnh huỷ cho thân thiện người dùng, v.v.',
      'LabFlow shall allow the reservation owner or Lab Manager to cancel a CONFIRMED booking ≥ 2 hours before start_at (BR-07); cancelling &lt; 2 hours before start_at returns 422 with SM-12, and another Student calling the endpoint receives 403|||LabFlow cho phép chủ lượt đặt hoặc Lab Manager huỷ lượt CONFIRMED trước giờ bắt đầu ≥ 2 giờ (BR-07); huỷ khi còn &lt; 2 giờ trả 422 kèm SM-12, và Student khác gọi endpoint nhận 403',
      'Everyone can cancel any reservation whenever they want unless there is a bug|||Ai cũng huỷ được bất kỳ lượt đặt nào khi muốn trừ khi có lỗi',
    ],
    2,
    'It names the exact system ("LabFlow"), exact allowed &amp; forbidden actors (Abuse Case preventing BOLA), exact numbered threshold (BR-07), and exact error behaviour (422 SM-12 / 403). Lesson 1.2.|||Câu này nêu rõ tên hệ thống ("LabFlow"), actor được phép &amp; bị cấm (Abuse Case chặn BOLA), con số cụ thể (BR-07) và hành vi lỗi chính xác (422 SM-12 / 403). Bài 1.2.'),

  Q('dm5-1-q4',
    'How does forgetting to specify negative ownership rules ("ONLY the booking owner can view/cancel this ID") under hat C2 create a top OWASP vulnerability?|||Việc quên ghi luật sở hữu phủ định ("CHỈ chủ lượt đặt mới được xem/huỷ ID này") dưới mũ C2 dẫn thẳng tới lỗ hổng OWASP hàng đầu nào?',
    [
      'OWASP API1:2023 Broken Object Level Authorization (BOLA / IDOR) — allowing User A to read or cancel User B\'s record simply by changing the ID|||OWASP API1:2023 Broken Object Level Authorization (BOLA / IDOR) — cho phép Người A xem hoặc huỷ bản ghi của Người B chỉ bằng cách đổi ID',
      'Cross-Site Request Forgery on CSS stylesheets|||Tấn công CSRF vào tệp CSS',
      'DNS Cache Poisoning on the university Wi-Fi|||Nhiễm độc bộ nhớ đệm DNS trên Wi-Fi trường',
      'Memory leak in Docker Desktop|||Rò rỉ bộ nhớ trong Docker Desktop',
    ],
    0,
    'When BA omits ownership/abuse cases from the spec, Dev often checks only "is user logged in?" rather than "does this record belong to currentUser?", shipping a classic BOLA/IDOR flaw. Lesson 1.2.|||Khi BA bỏ sót luật sở hữu/abuse case khỏi đặc tả, Dev thường chỉ kiểm "đã đăng nhập chưa?" thay vì "bản ghi này có thuộc currentUser không?", để lọt lỗ hổng BOLA/IDOR kinh điển. Bài 1.2.'),

  Q('dm5-1-q5',
    'Why does splitting a 5-person SWP391 team horizontally ("2 BE, 2 FE, 1 DB/Docs") fail compared to vertical slicing by business domain?|||Vì sao chia ngang nhóm SWP391 5 người ("2 BE, 2 FE, 1 DB/Docs") thất bại so với chia dọc theo miền nghiệp vụ?',
    [
      'Because Spring Boot cannot talk to React when built by different people|||Vì Spring Boot không nói chuyện được với React nếu hai người khác nhau viết',
      'Horizontal silos create waiting queues &amp; late integration (Conway\'s Law), yield zero demoable flows at Iteration 1, and break SWP391 per-screen individual LOC grading|||Các ốc đảo ngang tạo hàng chờ &amp; tích hợp muộn (Định luật Conway), không có luồng demo được ở Iteration 1, và làm hỏng cách chấm LOC cá nhân theo màn hình của SWP391',
      'Vertical slicing eliminates the need to design a database or write tests|||Chia dọc giúp không cần thiết kế CSDL hay viết test nữa',
      'Vertical slicing means nobody needs to agree on API contracts|||Chia dọc nghĩa là không ai cần thống nhất hợp đồng API nữa',
    ],
    1,
    'Vertical slicing aligns ownership with complete end-to-end user screens (UI + API + DB + Tests), delivering demoable slices from Iteration 1 and fair individual LOC scores. Lesson 1.3.|||Chia dọc gắn quyền sở hữu với màn hình hoàn chỉnh đầu-cuối (UI + API + DB + Test), giao được lát cắt demo ngay từ Iteration 1 và tính điểm LOC cá nhân công bằng. Bài 1.3.'),

  Q('dm5-1-q6',
    'Under hat C4 (Dev FE), you hid the "Approve Reservation" button for Students and added a React route guard. Is the feature now secure against unauthorized Students?|||Dưới mũ C4 (Dev FE), bạn đã ẩn nút "Duyệt đặt phòng" với Student và gắn React route guard. Tính năng này đã an toàn trước Student gọi trái phép chưa?',
    [
      'Yes — if the button is not rendered in React, no Student can trigger the action|||Rồi — nút không render trên React thì không Student nào gọi được',
      'Yes — as long as CORS is set to wildcard *|||Rồi — miễn là bật CORS ký tự đại diện *',
      'No — frontend guards are UX politeness only; an attacker can copy their Student JWT and call the API via curl unless C3 enforces @PreAuthorize / role &amp; ownership checks on the backend (OWASP A01)|||Chưa — chặn ở frontend chỉ là lịch sự về UX; kẻ tấn công vẫn lấy JWT của Student bắn thẳng API bằng curl trừ khi C3 ép @PreAuthorize / kiểm quyền &amp; sở hữu ở backend (OWASP A01)',
      'Only if you minify the JavaScript bundle with Vite|||Chỉ an toàn nếu bạn nén gọn mã JavaScript bằng Vite',
    ],
    2,
    'Broken Access Control is #1 on OWASP Top 10 (2021). Frontend guards improve UX; backend security checks + DB constraints are the ONLY real lock. Lesson 1.3.|||Vượt kiểm soát truy cập đứng #1 OWASP Top 10 (2021). Chặn ở frontend chỉ để tốt cho UX; kiểm quyền ở backend + ràng buộc DB mới là ổ khoá thật duy nhất. Bài 1.3.'),

  Q('dm5-1-q7',
    'What is the difference between a Defect and a Leakage — and what does Ariane 5 Flight 501 (1996) teach hat C5 (QA)?|||Defect khác Leakage ở điểm nào — và sự cố Ariane 5 Flight 501 (1996) dạy mũ C5 (QA) bài học gì?',
    [
      'Defect = found internally before submission; Leakage = escaped to lecturer/users after submission. Ariane 5 proves reused code MUST be re-tested against the target system\'s real boundary values|||Defect = tự bắt nội bộ trước khi nộp; Leakage = lọt ra ngoài để GV/người dùng phát hiện sau khi nộp. Ariane 5 chứng minh mã tái sử dụng BẮT BUỘC phải test lại với đúng giá trị biên của hệ mới',
      'Defect = frontend bug; Leakage = backend bug. Ariane 5 proves rockets should use Java|||Defect = lỗi frontend; Leakage = lỗi backend. Ariane 5 chứng minh tên lửa nên dùng Java',
      'Defect and Leakage are identical; Ariane 5 had no software issue|||Defect và Leakage giống hệt nhau; Ariane 5 không bị lỗi phần mềm',
      '0 Defects in a report always proves the highest quality|||Báo cáo ghi 0 Defect luôn chứng minh chất lượng cao nhất',
    ],
    0,
    'Ariane 5 overflowed a 64-bit float to 16-bit int in reused Ariane 4 software untested for Ariane 5\'s higher velocity. Honest Defect detection under C5 stops costly Leakage. Lesson 1.4.|||Ariane 5 bị tràn số khi ép float 64-bit sang int 16-bit ở mã tái dùng từ Ariane 4 chưa test lại theo vận tốc của Ariane 5. Bắt Defect trung thực dưới C5 chặn sạch Leakage đắt giá. Bài 1.4.'),

  Q('dm5-1-q8',
    'In the C5 Minimum Test Matrix for LabFlow S22 (half-open interval [start, end)), why is TC-06 (booking 11:00–13:00 right next to 09:00–11:00) essential?|||Trong Ma trận Test tối thiểu của C5 cho LabFlow S22 (khoảng nửa mở [start, end)), vì sao TC-06 (đặt ca 11:00–13:00 sát ngay ca 09:00–11:00) là bắt buộc?',
    [
      'It is supposed to fail with 409 Conflict|||Nó bắt buộc phải thất bại với mã 409 Conflict',
      'It tests the valid adjacent boundary — catching off-by-one bugs where closed intervals [start, end] wrongly reject back-to-back bookings|||Nó kiểm giá trị biên sát hợp lệ — bắt lỗi lệch 1 đơn vị khi khoảng đóng [start, end] từ chối nhầm hai ca nối tiếp nhau',
      'It only checks CSS alignment of the calendar|||Nó chỉ kiểm căn lề CSS của lịch',
      'It replaces the need for concurrency testing|||Nó thay thế hoàn toàn nhu cầu test đồng thời',
    ],
    1,
    'Good boundary testing checks BOTH sides of the edge: overlapping must fail (409), while touching at 11:00 with half-open [09:00, 11:00) and [11:00, 13:00) MUST succeed (201). Lesson 1.4.|||Test giá trị biên giỏi phải kiểm CẢ hai phía của mép: chồng giờ phải chặn (409), còn chạm mép lúc 11:00 với khoảng nửa mở [09:00, 11:00) và [11:00, 13:00) PHẢI thành công (201). Bài 1.4.'),

  Q('dm5-1-q9',
    'Why does Lesson 1.5 cite the 1995 Barings Bank collapse when explaining solo hat-switching?|||Vì sao Bài 1.5 dẫn sự sụp đổ của Ngân hàng Barings năm 1995 khi giải thích luật đổi mũ làm một mình?',
    [
      'Because Barings Bank failed due to slow PostgreSQL queries|||Vì Ngân hàng Barings sụp đổ do truy vấn PostgreSQL chậm',
      'Because Nick Leeson controlled BOTH trade execution AND settlement auditing (zero Separation of Duties), illustrating why the author of code/specs must never rubber-stamp their own output without cooling-off + independent checklist controls|||Vì Nick Leeson nắm CẢ khâu đặt lệnh giao dịch LẪN khâu kiểm toán thanh toán (không có Tách biệt nhiệm vụ), minh hoạ vì sao tác giả code/spec không được tự duyệt ngay mà thiếu khoảng nghỉ + checklist kiểm soát độc lập',
      'Because Barings Bank used too many checklists|||Vì Ngân hàng Barings dùng quá nhiều checklist',
      'Because Barings Bank prohibited remote work|||Vì Ngân hàng Barings cấm làm việc từ xa',
    ],
    1,
    'Separation of Duties (SoD) prevents unchecked errors and shortcuts; in solo mode we simulate it mechanically via cooling-off gaps, separate browser profiles, 10-point checklists, and an adversarial AI critic. Lesson 1.5.|||Tách biệt nhiệm vụ (SoD) ngăn lỗi và đường tắt không có chốt chặn; khi làm một mình ta tạo tách biệt cơ học qua khoảng nghỉ, profile trình duyệt riêng, checklist 10 điểm và AI phản biện. Bài 1.5.'),

  Q('dm5-1-q10',
    'Under Lesson 1.5\'s Rule 4 ("AI as Adversarial Critic"), which way of using AI respects BOTH quality AND the 100% hand-coded rule?|||Theo Luật 4 Bài 1.5 ("AI làm Người phản biện"), cách dùng AI nào vừa nâng chất lượng VỪA giữ đúng luật tự code tay 100%?',
    [
      'Ask AI to inspect your git diff or spec as a strict QA/security reviewer and output ONLY a numbered defect/question list (forbidding it from writing replacement code), then hand-code every fix yourself|||Nhờ AI soi git diff hoặc spec với vai reviewer QA/bảo mật khó tính và CHỈ xuất danh sách lỗi/câu hỏi đánh số (cấm viết code sửa hộ), rồi chính bạn tự gõ tay mọi bản vá',
      'Paste your whole Req card and ask AI to generate the complete Controller, Service, Repository, and React form so you finish faster|||Dán cả thẻ Req nhờ AI sinh trọn Controller, Service, Repository và form React cho nhanh xong',
      'Never use AI even to review specs or practice defense Q&amp;A|||Không bao giờ dùng AI kể cả để soi spec hay luyện hỏi đáp bảo vệ',
      'Let AI rewrite your code, then rename two variables so it looks hand-coded|||Để AI viết lại code, rồi đổi tên hai biến cho giống tự viết',
    ],
    0,
    'AI as an adversarial critic sharpens your C5 review hat while keeping 100% of code authorship and understanding in your own hands. Lesson 1.5.|||Dùng AI làm người phản biện làm sắc mũ review C5 trong khi vẫn giữ trọn 100% quyền tác giả code và sự am hiểu thật trong tay bạn. Bài 1.5.'),

  Q('dm5-1-q11',
    'When submitting official SEP490 Report 2 (Project Management Plan §3 RACI) for a solo 5-role project, which RACI format is honest and compliant?|||Khi nộp tài liệu chính thức SEP490 Report 2 (PMP §3 RACI) cho đồ án một mình 5 vai, bảng RACI nào là trung thực và đúng chuẩn?',
    [
      'Put 5 columns named C1, C2, C3, C4, C5 pretending five different students are on the team|||Đặt 5 cột C1, C2, C3, C4, C5 làm như nhóm có năm sinh viên khác nhau',
      'Leave the Accountable (A) letter blank so nobody is blamed if a milestone slips|||Bỏ trống chữ A (Accountable) để không ai bị quy trách nhiệm khi trễ mốc',
      'Keep the 5-hat RACI internally on CT Work, and in official Report 2 use an honest 2-column RACI (Your Real Name + Student ID, and Supervisor) with a brief note explaining your solo 5-hat rotation|||Giữ RACI 5 mũ vận hành nội bộ trên CT Work, còn trong Report 2 nộp chính thức dùng RACI 2 cột trung thực (Tên thật + Mã SV, và Supervisor) kèm ghi chú ngắn giải thích việc luân phiên 5 mũ',
      'Assign "A" to both the Student and the Supervisor on every single row|||Gán chữ "A" cho cả Sinh viên lẫn Supervisor ở tất cả các hàng',
    ],
    2,
    'Two-Layer RACI preserves both daily solo discipline (Layer A on CT Work) and strict academic honesty in Report 2 (Layer B: Student + Supervisor, exactly one A per row). Lesson 1.6.|||RACI hai lớp giữ trọn cả kỷ luật vận hành hằng ngày (Lớp A trên CT Work) lẫn trung thực học thuật tuyệt đối ở Report 2 (Lớp B: Sinh viên + Supervisor, đúng một A mỗi hàng). Bài 1.6.'),

  Q('dm5-1-q12',
    'Based on Sophie Leroy\'s research on Attention Residue (2009) and Gerald Weinberg\'s switching cost rule (1992), how should you structure your solo 5-role week?|||Dựa trên nghiên cứu về Tàn dư chú ý (Attention Residue — Sophie Leroy, 2009) và quy tắc chi phí chuyển ngữ cảnh (Gerald Weinberg, 1992), bạn nên tổ chức tuần làm việc một mình 5 vai thế nào?',
    [
      'Switch between C1, C2, C3, C4, and C5 every 15 minutes so all five roles move forward simultaneously|||Đổi qua lại giữa C1, C2, C3, C4, C5 mỗi 15 phút để cả năm vai cùng tiến song song',
      'Batch work into focused 90–120 minute single-hat time-boxes on a 6+1 weekly rhythm, bake in overnight cooling-off gaps before C5 reviews, and log 2 minutes per block in your Role Log|||Gom việc theo các khối 90–120 phút chỉ đội duy nhất một chiếc mũ trên nhịp tuần 6+1, cài sẵn khoảng nghỉ qua đêm trước phiên review C5, và ghi 2 phút Nhật ký vai sau mỗi phiên',
      'Code non-stop for 7 days straight and fill out all RACI, tests, and time logs on the final night of Week 10|||Code liên tục 7 ngày không nghỉ rồi điền tất cả RACI, test và bảng giờ vào đêm cuối Tuần 10',
      'Spend 80% of the week under C1 PM updating charts and 20% coding|||Dành 80% tuần dưới mũ C1 PM vẽ biểu đồ và 20% để code',
    ],
    1,
    'Single-hat time-boxing minimizes Attention Residue, builds natural cooling-off intervals for objective QA, protects Sunday rest, and feeds honest numbers directly into Weekly Reports. Lesson 1.6 &amp; Lab 1.7.|||Time-box một mũ giảm Tàn dư chú ý, tạo sẵn khoảng nghỉ cho QA khách quan, bảo vệ ngày nghỉ Chủ nhật và đổ số liệu trung thực thẳng sang Weekly Report. Bài 1.6 &amp; Lab 1.7.'),
];

export default {
  title: 'Chapter 1 — The Five Hats: Roles, Responsibilities & Hat-Switching Rules|||Chương 1 — Năm chiếc mũ: vai trò, trách nhiệm, luật đổi mũ',
  description: 'Trọn bộ tư duy và quy trình vận hành năm chiếc mũ C1–C5 như doanh nghiệp: Leader/PM thật khác nhóm trưởng gom bài, BA diệt mơ hồ và chặn lỗ hổng BOLA từ SRS, Dev BE & FE chia miền dọc + hợp đồng API trước khi code, QA/Tester Shift-Left chống Leakage, luật đổi mũ & tách quyền không tự duyệt, RACI hai lớp trung thực + lịch tuần time-box 6+1 + Nhật ký vai, Lab diễn tập 5 mũ trên CT Work LF #2 và Kiểm tra 12 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    {
      title: '1.8 — Chapter 1 Quiz|||1.8 — Kiểm tra Chương 1',
      slug: 'dm5-1-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu hỏi tình huống bao trọn Chương 1: vai trò thật của C1 Leader/PM, bài học Sân bay Denver 1995, đặc tả C2 BA & lỗ hổng OWASP API1 BOLA, chia miền dọc vs chia tầng & OWASP A01, Defect vs Leakage & Ariane 5, kiểm giá trị biên nửa mở, tách biệt nhiệm vụ Barings Bank 1995, AI phản biện không viết hộ code, RACI hai lớp trung thực và time-box chống Attention Residue.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>1.8 — Check your mastery of the Five Hats</h2>
<p class="lead">Twelve scenario-based questions covering Lessons 1.1–1.7. Aim for at least 10/12 before moving on to Chapter 2 (Project Kickoff &amp; Planning). Every explanation points directly back to the lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>1.8 — Kiểm tra độ nắm vững Năm chiếc mũ</h2>
<p class="lead">Mười hai câu hỏi tình huống bao trọn Bài 1.1–1.7. Hãy đặt mục tiêu đạt tối thiểu 10/12 trước khi sang Chương 2 (Khởi động &amp; Lập kế hoạch dưới mũ PM). Mỗi giải thích đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ1 },
    },
  ],
};
