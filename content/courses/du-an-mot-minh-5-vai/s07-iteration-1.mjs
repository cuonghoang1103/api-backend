/**
 * Chương 7 — Iteration 1 từ đầu tới cuối (vòng mẫu chuẩn) (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 6 bài kiến thức (7.1–7.6), 1 bài Lab chạy trọn vòng mẫu chuẩn Iteration 1 trên CT Work LF #2 (7.7, dm5-7-lab)
 * và bài kiểm tra 10 câu tình huống (7.8, dm5-7-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s07/b1-sprint-planning.mjs';
import B2 from './s07/b2-mot-req-qua-5-vai.mjs';
import B3 from './s07/b3-theo-doi-giua-iteration.mjs';
import B4 from './s07/b4-demo-review-giang-vien.mjs';
import B5 from './s07/b5-retro-mot-nguoi.mjs';
import B6 from './s07/b6-dong-iteration-package-rtm.mjs';
import B7 from './s07/b7-lab.mjs';

const QUIZ7 = [
  Q('dm5-7-q1',
    'Why is deferring Authentication &amp; RBAC (WF0) until Iteration 3 while building 10 CRUD screens in Iteration 1 a severe security &amp; planning trap?|||Vì sao việc đẩy Xác thực &amp; Phân quyền RBAC (WF0) sang Iteration 3 trong khi code trước 10 màn CRUD ở Iteration 1 là một cái bẫy bảo mật và lập kế hoạch nghiêm trọng?',
    [
      'Spring Boot refuses to start JPA repositories or Flyway migrations until a JWT authentication filter bean is configured|||Spring Boot không khởi chạy được JPA repository hay Flyway migration nếu chưa cấu hình bộ lọc xác thực JWT',
      'React Router cannot render any public or CRUD pages until a shared role-based route guard and token refresh interceptor exist|||React Router không hiển thị được bất kỳ trang CRUD nào nếu chưa có route guard theo vai trò và bộ làm mới token',
      'Bolting security onto existing endpoints late often leaves forgotten APIs open to OWASP API1 (BOLA) and API5 (BFLA) and causes heavy rework|||Lắp bảo mật muộn lên các endpoint có sẵn rất dễ bỏ sót lỗ hổng OWASP API1 (BOLA) và API5 (BFLA), đồng thời gây làm lại tốn kém',
      'PostgreSQL disables unique constraints and row-level locking on CRUD tables whenever application-layer RBAC annotations are missing|||PostgreSQL tắt các ràng buộc duy nhất và khoá dòng trên bảng CRUD khi tầng ứng dụng chưa gắn annotation RBAC',
    ],
    2,
    'Putting WF0 Auth + RBAC + shared Route Guard in Iteration 1 ensures every subsequent screen inherits authorization checks by default. Lesson 7.1.|||Đưa WF0 Auth + RBAC + Route Guard chung ngay vào Iteration 1 bảo đảm mọi màn hình xây sau đều thừa hưởng lớp bảo vệ mặc định. Bài 7.1.'),

  Q('dm5-7-q2',
    'What is the core engineering lesson of the Therac-25 accidents (Leveson &amp; Turner, IEEE Computer 1993) for moving a Req card across CT Work columns?|||Bài học kỹ thuật cốt lõi từ thảm hoạ Therac-25 (Leveson &amp; Turner, IEEE Computer 1993) cho việc chuyển trạng thái thẻ Req qua các cột CT Work là gì?',
    [
      'The builder hat must NOT unilaterally mark work Done — separate coding (C3/C4) from independent QA verification after a cooling-off gap (C5) and PM DoD merge (C1)|||Mũ vừa code KHÔNG tự đóng dấu Done — phải tách bước code (C3/C4) khỏi kiểm chứng QA độc lập sau khoảng nghỉ (C5) và bước PM soát DoD rồi merge (C1)',
      'Every feature branch should skip unit and integration tests and rely solely on one end-to-end manual walkthrough on Demo Day|||Mọi nhánh tính năng nên bỏ qua unit/integration test và chỉ cần chạy thử toàn hệ thống một lần vào ngày Demo',
      'Solo developers should keep all work in a single To Do column and batch-move every finished Req to Done on Sunday night|||Người làm một mình nên để mọi việc ở một cột To Do rồi tối Chủ nhật kéo toàn bộ thẻ đã làm sang Done một lượt',
      'Dev FE should automatically approve Dev BE pull requests as soon as the build compiles locally, without running unhappy cases|||Dev FE nên tự duyệt pull request của Dev BE ngay khi biên dịch được dưới máy mà không cần chạy các ca lỗi',
    ],
    0,
    'Leveson &amp; Turner noted the Therac-25 software was written by a single programmer, had no independent code review, and was tested mainly at the overall system level. Separating Build (C3/C4) from QA Sign-off (C5) and Merge/Done (C1) catches blind spots early. Lesson 7.2.|||Leveson &amp; Turner chỉ ra phần mềm Therac-25 do một lập trình viên viết, không có review code độc lập, và test chủ yếu ở mức cả hệ thống. Tách Xây dựng (C3/C4) khỏi Ký duyệt QA (C5) và Merge/Done (C1) giúp bắt sớm điểm mù. Bài 7.2.'),

  Q('dm5-7-q3',
    'While testing LabFlow\'s S03 Login under hat C5 (QA) after an overnight gap, you notice the API returns "Email not found" (or 401) for unknown emails, while returning "Wrong password" (or 423 Locked after 5 tries) ONLY for real emails. What flaw did C5 catch?|||Khi test màn S03 Login dưới mũ C5 (QA) sau khoảng nghỉ qua đêm, bạn thấy API trả "Email không tồn tại" (hoặc 401) cho email lạ, còn với email thật thì trả "Sai mật khẩu" (hoặc 423 Locked sau 5 lần sai). C5 vừa bắt được lỗ hổng nào?',
    [
      'A harmless UX distinction that helps students remember which campus alias they used when creating their LabFlow account|||Một phân biệt UX vô hại giúp sinh viên nhớ lại đúng địa chỉ email trường mình từng dùng lúc tạo tài khoản LabFlow',
      'A PostgreSQL Flyway migration ordering error caused by adding the failed_logins column before creating the users table|||Một lỗi thứ tự migration Flyway PostgreSQL do thêm cột failed_logins trước khi tạo bảng users trong CSDL',
      'A CORS preflight mismatch between Vite localhost and Spring Security that blocks valid login tokens from being stored|||Một lỗi lệch CORS preflight giữa Vite localhost và Spring Security làm chặn việc lưu token đăng nhập hợp lệ',
      'User Enumeration — attackers can distinguish valid emails via the message or 423 status; unify responses and count attempts uniformly (or always return 401 + email lock notice)|||Lỗ hổng Dò tài khoản (User Enumeration) — kẻ tấn công tách được email thật qua thông báo hoặc mã 423; cần gom câu báo lỗi và đếm lần sai đồng nhất (hoặc luôn trả 401 + gửi thông báo khoá qua email)',
    ],
    3,
    'Independent QA testing catches user enumeration — both in error wording AND via status codes like 423 returned only for existing accounts. Lesson 7.2.|||Bước QA độc lập giúp bắt lỗi dò tài khoản — cả ở câu thông báo lỗi LẪN ở mã 423 chỉ trả cho tài khoản có thật. Bài 7.2.'),

  Q('dm5-7-q4',
    'Halfway through Iteration 1, your CT Work Burndown chart has been completely FLAT for 4 days even though you coded 16 hours. What is the FIRST root cause to inspect and fix?|||Đi được nửa Iteration 1, biểu đồ Burndown trên CT Work của bạn đi NGANG hoàn toàn suốt 4 ngày dù bạn đã code 16 giờ. Nguyên nhân gốc ĐẦU TIÊN cần kiểm và xử lý là gì?',
    [
      'Hide the Burndown widget from your CT Work dashboard and rely exclusively on your written Weekly Report summary instead|||Ẩn biểu đồ Burndown khỏi bảng điều khiển CT Work và chỉ dựa vào đoạn tóm tắt bằng chữ trong Weekly Report',
      'Cards/PRs are oversized (bundling BE + FE + extras into multi-day branches) OR sub-tasks are not updated daily — split the card and merge the finished slice today|||Thẻ/PR đang quá to (gộp BE + FE + phụ trợ vào nhánh nhiều ngày) HOẶC quên cập nhật thẻ con hằng ngày — hãy chẻ nhỏ thẻ và merge phần đã xong ngay hôm nay',
      'Pull 2 additional P2 stretch screens into Sprint 1 so the total remaining hours line moves visibly on the graph|||Kéo thêm 2 màn hình P2 dự phòng vào Sprint 1 để đường tổng số giờ còn lại trên biểu đồ có biến động rõ hơn',
      'Schedule two consecutive all-nighters so every open feature branch can be pushed and merged together on Day 7|||Xếp lịch thức trắng hai đêm liên tiếp để đẩy và merge toàn bộ các nhánh tính năng đang mở cùng một lúc vào Ngày 7',
    ],
    1,
    'A flat-line Burndown (Shape B) signals oversized work-in-progress or stale board updates; splitting into small mergeable slices restores flow immediately. Lesson 7.3.|||Đường Burndown đi ngang (Dáng B) báo hiệu thẻ quá to hoặc quên kéo thẻ; chẻ thành các mảnh nhỏ merge được sẽ khôi phục dòng chảy ngay. Bài 7.3.'),

  Q('dm5-7-q5',
    'What is "Watermelon Reporting" in project management, and what is the right response when your sprint actually turns Red at midpoint?|||"Báo cáo Dưa Hấu" (Watermelon Reporting) trong quản trị dự án là gì, và hành động đúng khi sprint thật sự chuyển Đỏ ở giữa vòng là gì?',
    [
      'Splitting a sprint report into two separate color-coded Excel tabs so QA defects stay isolated from development velocity metrics|||Tách báo cáo sprint thành hai tab Excel tô màu riêng để tách biệt danh sách lỗi QA khỏi chỉ số tốc độ phát triển',
      'Cutting unhappy-case tests and temporarily disabling backend @PreAuthorize checks so every planned screen can reach Quality L1 on time|||Cắt bỏ test unhappy case và tạm tắt kiểm tra @PreAuthorize phía backend để mọi màn hình kế hoạch đều kịp đạt Quality L1',
      'Marking status Green on paper while real progress is Red — instead, report Amber/Red honestly early, cap WIP, cut P2 stretch scope, and protect Quality L2 &amp; sleep|||Tô trạng thái Xanh trên báo cáo dù bên trong đang Đỏ — đúng ra phải báo Vàng/Đỏ trung thực sớm, giới hạn WIP, cắt P2 dự phòng và giữ Quality L2 cùng giấc ngủ',
      'Waiting until Demo Day to reveal schedule slippage so you have extra nights to try recovering all originally planned screens privately|||Chờ tới sát ngày Demo mới báo trượt tiến độ để có thêm vài đêm âm thầm kéo lại toàn bộ các màn hình đã lập kế hoạch',
    ],
    2,
    'Honest early Amber/Red visibility + controlled P2 de-scoping protects core Sprint Goal quality and prevents panic-driven security vulnerabilities. Lesson 7.3.|||Báo Vàng/Đỏ trung thực sớm kèm cắt phạm vi P2 có kiểm soát giúp bảo vệ chất lượng Sprint Goal lõi và chặn lỗ hổng bảo mật do hoảng loạn. Bài 7.3.'),

  Q('dm5-7-q6',
    'To prevent both a COMDEX-1998-style live crash AND accidental secret leaks during your Iteration 1 Lecturer Demo, which preparation combo is mandatory?|||Để phòng cả cú sập demo trực tiếp kiểu COMDEX 1998 LẪN tai nạn lộ bí mật khi trình diễn Iteration 1 trước giảng viên, tổ hợp chuẩn bị nào là bắt buộc?',
    [
      'Freeze CI-green main 12h early, reset synthetic seed data, use a Clean Demo Browser Profile (DND on, zero .env tabs), rehearse unhappy/RBAC paths, and keep an offline Plan B MP4|||Khoá main CI xanh trước 12 giờ, reset dữ liệu seed giả sạch, dùng Profile Demo sạch (bật DND, không tab .env), tập đủ ca lỗi/RBAC và giữ sẵn video MP4 Phương án B ngoại tuyến',
      'Demo directly from your active feature branch with IDE and .env open in a split window so you can hot-fix any lecturer remark live on stage|||Demo thẳng trên nhánh tính năng đang làm và mở sẵn IDE cùng tab .env bên cạnh để có thể sửa nóng ngay lập tức khi giảng viên góp ý',
      'Skip showing unhappy cases and 403 authorization checks during the live walkthrough so the demo stays fast and never displays red error banners|||Bỏ qua phần trình diễn unhappy case và kiểm quyền 403 trong lúc demo trực tiếp để buổi chiếu trôi nhanh và không hiện khung báo lỗi đỏ',
      'Seed the demo database with real classmates\' university emails and live MailTrap keys so notifications look authentic during grading|||Nạp email trường thật của bạn cùng lớp và khoá MailTrap thật vào CSDL demo để luồng gửi thông báo nhìn chân thực khi chấm điểm',
    ],
    0,
    'Freezing main early, resetting clean synthetic seed data, using a sanitized demo profile, rehearsing unhappy paths, and having an offline Plan B video protect both reliability and security. Lesson 7.4.|||Khoá main sớm, reset dữ liệu giả sạch, dùng profile demo sạch, tập đủ ca lỗi và có video Phương án B ngoại tuyến bảo vệ cả độ ổn định lẫn an toàn thông tin. Bài 7.4.'),

  Q('dm5-7-q7',
    'During Iteration 1 Review, your lecturer spots a 500 crash on whitespace search AND asks if you can add PDF export in Iteration 2. How should you triage these two remarks within 24 hours?|||Trong buổi Review Iteration 1, giảng viên bắt ra lỗi 500 khi tìm kiếm toàn dấu cách VÀ hỏi bạn có thể thêm tính năng xuất PDF ở Iteration 2 không. Bạn nên phân loại hai góp ý này thế nào trong 24 giờ?',
    [
      'Accept PDF export immediately into Iteration 2 Sprint Backlog while postponing the whitespace 500 fix until System Test Round 3|||Nhận ngay tính năng xuất PDF vào Sprint Backlog Iteration 2, còn lỗi 500 dấu cách thì để dồn sang System Test Vòng 3 sửa một thể',
      'Record both remarks as closed notes inside the Weekly Report Personal Grade block without creating any cards on CT Work|||Ghi cả hai góp ý thành ghi chú đã xong trong mục Personal Grade của Weekly Report mà không cần tạo thẻ trên CT Work',
      'Treat the whitespace crash as an out-of-scope edge case because normal users rarely type only spaces, and code PDF export right away|||Coi lỗi dấu cách là trường hợp ngoài phạm vi vì người dùng thật ít khi gõ toàn khoảng trắng, và bắt tay code xuất PDF ngay',
      'Log the 500 crash as Leakage (Highest priority, Bug card key LF-n in Tracking Defects, fix FIRST in Iter 2 + regression test) AND log PDF export as a Change Request for impact analysis|||Ghi lỗi 500 thành Leakage (Highest, mã thẻ Bug LF-n trong Tracking Defects, sửa ĐẦU TIÊN ở Iter 2 + test hồi quy) VÀ ghi xuất PDF thành Change Request để phân tích tác động trước khi nhận',
    ],
    3,
    'Lecturer-found bugs are Leakage (fix first!), while new features are Change Requests needing impact analysis — both recorded across CT Work, Tracking, and Weekly Report Section II. Lesson 7.4.|||Lỗi giảng viên tìm ra là Leakage (sửa đầu tiên!), còn tính năng mới là Change Request cần đánh giá tác động — cả hai đều ghi đồng bộ lên CT Work, Tracking và Weekly Report mục II. Bài 7.4.'),

  Q('dm5-7-q8',
    'Which output belongs to a Data-First Solo Retrospective (Google SRE blameless culture + Toyota 5 Whys) rather than emotional guilt?|||Đầu ra nào đúng chất một buổi Retro Dữ Liệu Một Người (văn hoá không đổ lỗi Google SRE + 5 Whys Toyota) thay vì tự dằn vặt cảm tính?',
    [
      'A personal reflection paragraph committing to wake up earlier, sleep fewer hours, and try much harder during Iteration 2|||Một đoạn tự kiểm điểm cam kết sẽ dậy sớm hơn, ngủ ít hơn và cố gắng chăm chỉ hơn trong suốt Iteration 2',
      'Pull 7 real sprint metrics first (rework ratio, CI first-pass green rate, defects/leakage), run blameless 5 Whys + Security check, and lock MAX 2 testable Process Experiments|||Rút 7 chỉ số thật trước (tỷ lệ làm lại, CI xanh lượt đầu, defect/leakage), chạy 5 Whys không đổ lỗi + kiểm bảo mật, và chốt TỐI ĐA 2 Thử nghiệm Quy trình đo được',
      'A comprehensive 12-item wishlist covering every tool, framework, and habit you hope to upgrade before the semester ends|||Một danh sách đầy đủ 12 mục mong muốn cải thiện bao gồm mọi công cụ, framework và thói quen trước khi hết học kỳ',
      'Skipping the retrospective document entirely in solo projects because process conflicts only happen in multi-person teams|||Bỏ qua hẳn biên bản retrospective khi làm đồ án một mình vì xung đột quy trình chỉ xuất hiện trong nhóm nhiều người',
    ],
    1,
    'Real numbers + blameless root cause + at most 2 measurable Process Experiments actually change engineering habits between iterations. Lesson 7.5.|||Con số thật + nguyên nhân gốc không đổ lỗi + tối đa 2 Thử nghiệm Quy trình đo được mới thật sự nâng cấp thói quen kỹ thuật giữa các vòng. Bài 7.5.'),

  Q('dm5-7-q9',
    'While updating the 6-sheet Project Tracking Excel workbook at Iteration 1 Close, what classic template trap must you fix on the Scope sheet, and how should TimeLogs be filled?|||Khi cập nhật file Excel Project Tracking 6 sheet lúc đóng Iteration 1, bạn phải gỡ cái bẫy mẫu kinh điển nào ở sheet Scope, và sheet TimeLogs phải được điền thế nào?',
    [
      'Clear the erroneous Status Data Validation on Scope column G (Actual Effort) so it holds NUMERIC person-days (=SUMIF(TimeLogs)/8), and log real daily focus hours matching exact Scope Work Package names|||Xoá Data Validation Status bị đặt nhầm trên cột G (Actual Effort) của sheet Scope để chứa SỐ ngày công (=SUMIF(TimeLogs)/8), và ghi giờ tập trung thật từng ngày khớp đúng tên Work Package trong Scope',
      'Keep the Status dropdown on Scope column G so it displays "Completed", and fill a consistent 8.0 hours per day in TimeLogs every Sunday evening|||Giữ nguyên dropdown Status ở cột G của sheet Scope để hiện chữ "Completed", và tối Chủ nhật điền đều 8,0 giờ mỗi ngày trong sheet TimeLogs',
      'Remove the Q&amp;A and Defects sheets if they have fewer than five rows so the workbook stays concise for the lecturer to grade|||Xoá bớt sheet Q&amp;A và Defects nếu có ít hơn năm dòng để file Excel gọn nhẹ hơn cho giảng viên chấm điểm',
      'Shorten WBS screen names into casual Vietnamese abbreviations while keeping full English names only inside the SRS document|||Rút gọn tên màn hình trên WBS thành viết tắt tiếng Việt thân thiện, chỉ giữ tên tiếng Anh đầy đủ bên trong tài liệu SRS',
    ],
    0,
    'The FPT Tracking template accidentally applies the Status dropdown to column G (Actual Effort); clearing validation and using SUMIF(TimeLogs)/8 keeps Scope numeric and honest. Lesson 7.6 &amp; Lab Hint 2.|||File mẫu Project Tracking FPT vô tình đặt dropdown Status đè lên cột G (Actual Effort); xoá validation và dùng SUMIF(TimeLogs)/8 giữ số liệu Scope chuẩn và trung thực. Bài 7.6 &amp; Gợi ý Lab 2.'),

  Q('dm5-7-q10',
    'While auditing your 14-column RTM at Iteration 1 Close, you see two rows with blank cells: (A) UC-12 "Create Reservation" (Status = Planned, Iter 2) has blank SDS § &amp; Unit Test; (B) UC-05 "Manage Labs" (Status = Coded, Iter 1) has blank SDS § &amp; Unit Test. Which one is a RED-FLAG defect blocking submission?|||Khi soát bảng RTM 14 cột cuối Iteration 1, bạn thấy hai dòng có ô trống: (A) UC-12 "Create Reservation" (Status = Planned, Iter 2) trống cột SDS § &amp; Unit Test; (B) UC-05 "Manage Labs" (Status = Coded, Iter 1) trống cột SDS § &amp; Unit Test. Dòng nào là CỜ ĐỎ lỗi nặng chặn việc nộp bài?',
    [
      'Both (A) and (B) must be removed from the RTM sheet until all System Tests finish in Iteration 3|||Phải xoá cả hai dòng (A) và (B) khỏi sheet RTM cho tới khi hoàn thành toàn bộ System Test ở Iteration 3',
      'Only (A) is a red-flag defect because even future Planned use cases must already have finalized Unit Tests and Class.method links|||Chỉ (A) là cờ đỏ lỗi nặng vì ngay cả use case Planned của vòng tương lai cũng phải có sẵn Unit Test và Class.method',
      'Neither (A) nor (B) blocks submission because RTM is an optional appendix that does not need to match SDS or test sheets|||Cả (A) và (B) đều không chặn nộp bài vì RTM là phụ lục mở rộng không bắt buộc phải khớp với SDS hay bảng test',
      'Only (B) is a red-flag defect — Planned future rows may be blank, whereas any Coded/Tested row missing SDS § or Unit/IT tests proves undocumented or untested code that must be fixed BEFORE submission|||Chỉ (B) là cờ đỏ lỗi nặng — dòng Planned của vòng tương lai trống là bình thường, còn bất kỳ dòng Coded/Tested nào thiếu SDS § hay Unit/IT test chứng tỏ tính năng thiếu sơ đồ hoặc chưa test và phải sửa TRƯỚC KHI nộp',
    ],
    3,
    'RTM\'s superpower (preventing Mars-Climate-Orbiter-style sync drift) is flagging missing SDS diagrams or missing tests on Coded/Tested items BEFORE submitting LabFlow_Iter1_Package (or Package v1 in SEP490). Lesson 7.6.|||Sức mạnh của RTM (chặn lệch đồng bộ kiểu Mars Climate Orbiter) là phát hiện ngay thiếu sơ đồ SDS hoặc thiếu test trên các mục đã Coded/Tested TRƯỚC KHI nộp LabFlow_Iter1_Package (hay Package v1 ở SEP490). Bài 7.6.'),
];

export default {
  title: 'Chapter 7 — Iteration 1 End-to-End (The Reference Cycle)|||Chương 7 — Iteration 1 từ đầu tới cuối (vòng mẫu chuẩn)',
  description: 'Vận hành trọn một vòng Iteration 1 chuẩn như công ty thật cho dự án một mình 5 vai: Sprint Planning kiểm sức chứa 75% & ưu tiên Auth/RBAC, đưa 1 Req đi trọn qua 5 mũ bàn giao tách quyền, theo dõi Burndown & xử lý lệch giữa vòng không Báo cáo Dưa Hấu, khoá bản Demo & phân loại góp ý thành thẻ trong 24h, Retro dữ liệu một người, đóng vòng với Git tag iter1 + gói nộp sạch + Project Tracking 6 sheet + RTM 14 cột + Weekly Report, kèm Lab chạy song song Iteration 1 thật và Kiểm tra 10 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    {
      title: '7.8 — Chapter 7 Quiz|||7.8 — Kiểm tra Chương 7',
      slug: 'dm5-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu hỏi tình huống bao trọn Chương 7: ưu tiên Auth/RBAC, bài học Therac-25 (1993) & lỗi User Enumeration (kể cả mã 423), đọc dáng Burndown & tránh Báo cáo Dưa Hấu, khoá Demo + Phương án B (COMDEX 1998) & phân loại Leakage vs CR, Retro dữ liệu Google SRE & 5 Whys, sửa bẫy Actual Effort trên Project Tracking và soát lỗ hổng RTM 14 cột.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>7.8 — Check your mastery of Iteration 1 End-to-End (The Reference Cycle)</h2>
<p class="lead">Ten scenario-based questions covering Lessons 7.1–7.7. Aim for at least 8/10 before moving on to Chapter 8 (Iteration 2: Core Flows &amp; Mid-Flight Changes). Every explanation points directly back to the exact lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>7.8 — Kiểm tra độ nắm vững Iteration 1 từ đầu tới cuối (vòng mẫu chuẩn)</h2>
<p class="lead">Mười câu hỏi tình huống bao trọn Bài 7.1–7.7. Hãy đặt mục tiêu đạt tối thiểu 8/10 trước khi bước sang Chương 8 (Iteration 2: Luồng lõi &amp; Thay đổi giữa chừng). Mỗi giải thích đều trỏ thẳng về bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ7 },
    },
  ],
};
