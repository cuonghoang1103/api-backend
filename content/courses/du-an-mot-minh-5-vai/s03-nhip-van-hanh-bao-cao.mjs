/**
 * Chương 3 — Nhịp vận hành & báo cáo như doanh nghiệp (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 6 bài kiến thức (3.1–3.6), 1 bài Lab thực hành trên CT Work LF #2 (3.7, dm5-3-lab) và bài kiểm tra 12 câu (3.8, dm5-3-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s03/b1-nhip-ngay.mjs';
import B2 from './s03/b2-nhip-tuan-weekly-report.mjs';
import B3 from './s03/b3-bao-cao-rag-dashboard.mjs';
import B4 from './s03/b4-xu-ly-tre-escalation.mjs';
import B5 from './s03/b5-quan-ly-thay-doi-cr.mjs';
import B6 from './s03/b6-hop-bien-ban-action-item.mjs';
import B7 from './s03/b7-lab.mjs';

const QUIZ3 = [
  Q('dm5-3-q1',
    'During your 7-minute Morning Boot on CT Work, why should you walk the board RIGHT-TO-LEFT (3_Done [In Review] → 2_Doing [In Progress] → Blocked → 1_To Do) instead of pulling from 1_To Do first?|||Trong 7 phút khởi động buổi sáng trên CT Work, vì sao bạn nên đi bảng TỪ PHẢI SANG TRÁI (3_Done [In Review] → 2_Doing [In Progress] → Blocked → 1_To Do) thay vì kéo thẻ mới từ 1_To Do trước?',
    [
      'Because CT Work only renders columns from right to left|||Vì CT Work chỉ hiển thị các cột từ phải sang trái',
      'To prioritize finishing near-done work, clearing C5 review queues, and keeping personal WIP ≤ 2 — because finished screens earn LOC while half-started screens earn zero|||Để ưu tiên hoàn tất việc sắp xong, xả hàng chờ review của C5 và giữ WIP cá nhân ≤ 2 — vì màn hình xong mới tạo ra LOC còn màn mở dở dang chỉ tạo ra 0 điểm',
      'So you can close your own PR without switching to hat C5|||Để bạn có thể tự đóng PR của chính mình mà không cần đổi sang mũ C5',
      'Because cards in 1_To Do are only for the final week of the semester|||Vì thẻ ở cột 1_To Do chỉ dành cho tuần cuối cùng của học kỳ',
    ],
    1,
    'Walking right-to-left enforces "Stop Starting, Start Finishing", caps WIP ≤ 2, and clears review bottlenecks before pulling new work. Lesson 3.1.|||Đi bảng từ phải sang trái giữ luật "Ngừng mở mới, lo đóng cũ", khoá trần WIP ≤ 2 và xả tắc nghẽn review trước khi kéo việc mới. Bài 3.1.'),

  Q('dm5-3-q2',
    'You have been stuck for 2 full focused hours debugging a PostgreSQL constraint exception on LF-22. Under the 2h/24h Blocker Protocol and security hygiene rules, what should you do?|||Bạn đã kẹt tròn 2 giờ tập trung gỡ lỗi ngoại lệ ràng buộc PostgreSQL trên thẻ LF-22. Theo Quy tắc Blocker 2h/24h và nguyên tắc vệ sinh bảo mật, bạn nên làm gì?',
    [
      'Keep brute-forcing for 6 more hours overnight until it works, without telling anyone|||Tiếp tục thức thêm 6 tiếng xuyên đêm mò cho bằng ra, không ghi chép gì',
      'Paste your entire .env file and database password into the CT Work comment so AI or teammates can reproduce it faster|||Dán toàn bộ tệp .env và mật khẩu DB vào bình luận CT Work để AI hoặc đồng đội dễ tái hiện hơn',
      'Stop brute-forcing, toggle the Blocked flag on LF-22 with a redacted error log + minimal reproduction + targeted question, switch to an unblocked card, and resolve/escalate within 24h|||Dừng mò mù, bật cờ Blocked trên LF-22 kèm log lỗi đã che bí mật + cách tái hiện tối giản + câu hỏi trúng đích, chuyển sang thẻ không bị chặn và gỡ/leo thang trong 24h',
      'Drag LF-22 straight to Closed (Done) and disable the PostgreSQL constraint temporarily|||Kéo thẳng LF-22 sang Closed (Done) và tạm tắt ràng buộc PostgreSQL đi',
    ],
    2,
    'The 2h/24h rule stops silent time-burning while strict log redaction prevents credentials from leaking permanently into ticket history. Lesson 3.1.|||Quy tắc 2h/24h chặn đốt thời gian vô ích, còn che log bảo vệ mật khẩu/token khỏi rò rỉ vĩnh viễn vào lịch sử thẻ. Bài 3.1.'),

  Q('dm5-3-q3',
    'Under the SEP490 / enterprise reporting framework (from W11 onward), what is the correct weekly order during your 60-minute Sunday Closing, and how should you treat drafts from CT Work weekly_report_generate?|||Theo khung báo cáo SEP490 / doanh nghiệp (từ Tuần 11 trở đi), thứ tự đúng trong buổi Chốt tuần Chủ nhật 60 phút là gì, và bạn nên đối xử thế nào với bản nháp từ weekly_report_generate của CT Work?',
    [
      'Copy-paste the AI weekly draft straight to your lecturer first, then update Project Tracking at the end of the semester|||Chép nguyên văn bản nháp AI gửi giảng viên trước, rồi cuối kỳ mới cập nhật Project Tracking một thể',
      'Audit CT Work &amp; Git truth → update all 6 SEP490 Project Tracking sheets (TimeLogs, Scope, WBS, Q&amp;A, Defects, Issues) → build/verify the new 5-block Weekly Report sheet (checking every AI-drafted number &amp; date under C5) → submit (in SWP391 W1–W10, apply the same order to PT26 + Template6)|||Soát sự thật trên CT Work &amp; Git → cập nhật đủ 6 sheet Project Tracking SEP490 (TimeLogs, Scope, WBS, Q&amp;A, Defects, Issues) → lập/kiểm chứng sheet Weekly Report 5 khối mới (soát từng con số &amp; ngày tháng từ bản nháp AI dưới mũ C5) → nộp (ở SWP391 W1–W10 áp cùng thứ tự cho PT26 + Template6)',
      'Overwrite last week\'s Weekly Report sheet so the Excel file always has only 1 sheet|||Ghi đè lên sheet Weekly Report tuần trước để file Excel lúc nào cũng chỉ có 1 sheet',
      'Round every TimeLogs row to 8.0 hours so Scope Actual Effort looks neat|||Làm tròn mọi dòng TimeLogs thành 8,0 giờ cho cột Actual Effort ở Scope trông đẹp mắt',
    ],
    1,
    'Reconciling CT Work → Tracking → Weekly Report (1 new sheet/week, never overwriting old sheets) with C5 verification prevents Mars Climate Orbiter-style cross-document drift. Lesson 3.2.|||Đối khớp CT Work → Tracking → Weekly Report (1 sheet mới/tuần, không sửa đè tuần cũ) kèm kiểm chứng C5 ngăn lệch số liệu kiểu Mars Climate Orbiter. Bài 3.2.'),

  Q('dm5-3-q4',
    'Your lecturer gives 3 concrete comments during your weekly review with the lecturer. According to the 2-Hour Conversion Rule, what must happen right after the meeting?|||Giảng viên đưa ra 3 góp ý cụ thể trong buổi review tuần với giảng viên. Theo Luật Chuyển hoá 2 giờ, bạn phải làm gì ngay sau buổi họp?',
    [
      'Remember them mentally and fix them whenever you have free time in Week 9|||Ghi nhớ trong đầu rồi khi nào rảnh ở Tuần 9 thì sửa',
      'Convert EVERY comment within 2 hours into a scheduled CT Work card, a row in Project Tracking Issues (and Defects if doc/code bug), and Block II of the Weekly Report until verified closed|||Chuyển MỌI góp ý trong vòng 2 giờ thành thẻ CT Work có lịch tuần sau, một dòng trong sheet Issues (và Defects nếu là lỗi tài liệu/code), và Khối II Weekly Report cho tới khi kiểm chứng đóng hẳn',
      'Delete the old Weekly Report so the feedback is not visible to the jury|||Xoá Weekly Report cũ để hội đồng không thấy góp ý đó',
      'Only record the easiest comment and ignore the hard ones|||Chỉ ghi lại góp ý dễ nhất và bỏ qua các góp ý khó',
    ],
    1,
    'Turning every lecturer comment into tracked cards + Issues + Weekly Block II within 2 hours guarantees closed feedback loops and avoids repeat penalties next week. Lesson 3.2.|||Biến mọi góp ý của thầy thành thẻ việc + Issues + Khối II Weekly trong 2 giờ bảo đảm khép kín vòng phản hồi và tránh bị trừ điểm vì lặp lỗi cũ tuần sau. Bài 3.2.'),

  Q('dm5-3-q5',
    'Your project has Schedule = RED (Critical Path slipped 3 days), Scope = GREEN, Quality = GREEN, and Effort = AMBER. What is the honest Overall Project RAG status?|||Dự án của bạn có Tiến độ = ĐỎ (Đường găng trễ 3 ngày), Phạm vi = XANH, Chất lượng = XANH, và Công sức = VÀNG. Trạng thái RAG Tổng trung thực của dự án là màu nào?',
    [
      'GREEN — because 2 out of 4 dimensions are Green|||XANH — vì có 2 trên 4 chiều đang Xanh',
      'AMBER — because averaging Red, Amber, Green, Green lands in the middle|||VÀNG — vì lấy trung bình Đỏ, Vàng, Xanh, Xanh ra ở giữa',
      'RED — overall RAG ALWAYS equals the WORST dimension; reporting Green or Amber here is Watermelon Reporting|||ĐỎ — RAG tổng LUÔN BẰNG chiều TỆ NHẤT; báo Xanh hay Vàng ở đây chính là Báo cáo Dưa hấu',
      'Leave RAG blank until Schedule turns Green again|||Để trống RAG cho tới khi Tiến độ xanh trở lại',
    ],
    2,
    'Overall RAG equals the worst dimension — never average away a Red Critical Path slip (avoiding Watermelon Reporting). Lesson 3.3.|||RAG tổng bằng chiều tệ nhất — không bao giờ chia trung bình để che một cú trượt Đường găng Đỏ (tránh Báo cáo Dưa hấu). Bài 3.3.'),

  Q('dm5-3-q6',
    'Under Earned-Stage Weights (0/20/50/75/100) for honest % Complete, you finished coding S22 Create Reservation (Complex, 240 LOC) and its unit tests pass, but you have NOT yet merged, run integration/concurrency tests, or verified 3 unhappy cases. What % Complete is S22?|||Theo Trọng số theo Chặng (0/20/50/75/100) để tính % hoàn thành trung thực, bạn đã code xong S22 Đặt lịch (Complex, 240 LOC) và unit test xanh, nhưng CHƯA merge, chưa chạy test tích hợp/đồng thời và chưa kiểm 3 unhappy case. S22 đang ở mức bao nhiêu %?',
    [
      '95% — only minor testing is left|||95% — chỉ còn chút test nhỏ nữa thôi',
      '50% (Coded) — integration, unhappy-case testing (Quality L2), and C5 System Test + docs still represent the second half of real work (Ninety-Ninety Rule)|||50% (Coded) — tích hợp, kiểm thử ca lỗi (Quality L2), System Test của C5 và cập nhật hồ sơ vẫn chiếm trọn nửa còn lại của công việc (Quy luật 90–90)',
      '100% — once it compiles on localhost it is Done|||100% — cứ biên dịch chạy trên máy mình là Done',
      '0% — coding never counts toward progress|||0% — code không bao giờ tính vào tiến độ',
    ],
    1,
    'Capping Coded at 50% avoids Tom Cargill\'s Ninety-Ninety Rule illusion; only C5-verified Tested/Done with updated docs counts as 100%. Lesson 3.3.|||Khoá trần Coded ở 50% tránh ảo giác Quy luật 90–90 của Tom Cargill; chỉ khi C5 xác nhận Tested/Done kèm cập nhật hồ sơ mới được tính 100%. Bài 3.3.'),

  Q('dm5-3-q7',
    'On CT Work\'s Cumulative Flow Diagram (CFD), you notice the "In Review" (3_Done) band has grown twice as thick over 4 days while the "Done" (Closed) line has gone flat. What is happening and what is your immediate PM action?|||Trên biểu đồ Dòng chảy Tích luỹ (CFD) của CT Work, bạn thấy dải "In Review" (cột 3_Done) phình dày gấp đôi suốt 4 ngày trong khi đường "Done" (Closed) đi ngang. Chuyện gì đang xảy ra và PM cần làm gì ngay?',
    [
      'Everything is great — pull 3 more cards from 1_To Do to increase Velocity|||Mọi thứ rất ổn — kéo thêm 3 thẻ từ 1_To Do để tăng Velocity',
      'There is a Review/QA bottleneck under hat C5; stop pulling new To Do cards immediately and dedicate a focused C5 block to test, review, and drain the 3_Done (In Review) queue|||Đang tắc cổ chai ở khâu Review/QA dưới mũ C5; dừng kéo thẻ To Do mới ngay lập tức và dành hẳn một khung giờ tập trung cho C5 test, review và xả sạch hàng chờ 3_Done (In Review)',
      'Delete the CFD chart because it looks ugly|||Xoá biểu đồ CFD vì trông xấu mắt',
      'Skip code review and merge all PRs unreviewed so the band shrinks|||Bỏ qua code review và merge tất cả PR chưa kiểm để dải đó mỏng lại',
    ],
    1,
    'A widening CFD band pinpoints the exact bottleneck stage; swarming C5 to clear reviews restores smooth flow without compromising quality. Lesson 3.3.|||Một dải CFD phình to chỉ đích danh đúng công đoạn đang tắc cổ chai; dồn lực C5 xả hàng chờ review giúp khôi phục dòng chảy mà không hạ chất lượng. Bài 3.3.'),

  Q('dm5-3-q8',
    'Midterms cut your Iter-2 Week-6 focus hours by 30%. Which recovery move is SAFE and maximizes your SWP391 grade &amp; product safety, and which move is a HIGH-RISK trap to avoid?|||Lịch thi giữa kỳ cắt 30% quỹ giờ tập trung Tuần 6 (Iter 2) của bạn. Phương án phục hồi nào AN TOÀN giúp tối ưu điểm SWP391 &amp; độ an toàn sản phẩm, và phương án nào là BẪY NGUY HIỂM phải tránh?',
    [
      'SAFE: Cut unhappy-case tests &amp; temporarily disable @PreAuthorize RBAC checks; HIGH-RISK TRAP: Deferring optional Iter-2 scope|||AN TOÀN: Bỏ test ca lỗi &amp; tạm tắt kiểm quyền @PreAuthorize; BẪY NGUY HIỂM: Dời phần phụ của Iter 2',
      'SAFE: Pull 3 consecutive all-nighters without telling your lecturer; HIGH-RISK TRAP: Sending an Amber escalation with options|||AN TOÀN: Thức trắng 3 đêm liên tiếp không báo giảng viên; BẪY NGUY HIỂM: Gửi báo cáo cờ Vàng kèm phương án',
      'SAFE: Controlled MoSCoW de-scoping (defer optional Iter-2 scope such as S20 advanced filters / S21 weekly calendar grid or non-core S12 to Iter 3 via 5-part Amber escalation so Must-have screens hit Quality L2); HIGH-RISK TRAP: Cutting tests/RBAC security or pulling consecutive all-nighters|||AN TOÀN: Cắt phạm vi MoSCoW có kiểm soát (dời phần phụ của Iter 2 như lọc nâng cao S20 / lưới lịch tuần S21 hoặc màn phụ S12 sang Iter 3 qua tin nhắn Escalation cờ Vàng 5 phần để màn Must-have đạt Quality L2); BẪY NGUY HIỂM: Cắt test/bảo mật RBAC hoặc thức trắng nhiều đêm liền',
      'SAFE: Hide the delay until Gate morning; HIGH-RISK TRAP: Updating WBS and Issues|||AN TOÀN: Giấu trễ tới sáng nộp Gate; BẪY NGUY HIỂM: Cập nhật WBS và Issues',
    ],
    2,
    'Deferring optional Iter-2 scope protects Quality L2 (higher LOC + zero Leakages) and preserves RBAC security, whereas cutting tests/auth or sleep triggers Leakage spirals and OWASP A01 / API5 holes. Lesson 3.4.|||Dời phần phụ của Iter 2 bảo vệ trọn Quality L2 (điểm LOC cao hơn + 0 Leakage) và giữ nguyên bảo mật RBAC, còn cắt test/phân quyền hay cắt ngủ dẫn tới vòng xoáy Leakage và lỗ hổng OWASP A01 / API5. Bài 3.4.'),

  Q('dm5-3-q9',
    'What is the core change-management lesson of the 1996 Ariane 5 Flight 501 disaster (ESA/CNES Inquiry Board Report) for a student handling a mid-iteration requirement change?|||Bài học cốt lõi về quản lý thay đổi từ thảm hoạ tên lửa Ariane 5 chuyến 501 năm 1996 (Báo cáo ESA/CNES) dành cho sinh viên khi xử lý thay đổi yêu cầu giữa iteration là gì?',
    [
      'Never reuse code across any two software projects|||Không bao giờ được tái sử dụng code giữa hai dự án phần mềm',
      'Never say "yes" or modify baselined code/assumptions before running a full multi-dimensional Impact Analysis (BR, DB, API, UI, regression tests, schedule) and getting formal CR approval|||Không bao giờ gật đầu hay sửa code/giả định đã chốt baseline trước khi chạy đầy đủ Phân tích Ảnh hưởng đa chiều (BR, DB, API, UI, test hồi quy, lịch) và có phê duyệt CR chính thức',
      'Only aerospace rockets need Change Requests; web apps can skip them|||Chỉ tên lửa vũ trụ mới cần Change Request; ứng dụng web cứ bỏ qua',
      'Always hard-code numeric limits inside Java controllers for speed|||Luôn viết cứng các con số giới hạn trong Java controller cho nhanh',
    ],
    1,
    'Ariane 5 reused Ariane 4 software without analyzing altered velocity assumptions. Running a 6-Dimension Impact Analysis before approving any CR prevents hidden cascading failures. Lesson 3.5.|||Ariane 5 tái dùng phần mềm Ariane 4 mà không phân tích tác động của giả định vận tốc đổi mới. Chạy Phân tích Ảnh hưởng 6 chiều trước khi duyệt CR chặn đứt lỗi dây chuyền ngầm. Bài 3.5.'),

  Q('dm5-3-q10',
    'Your lecturer approves CR-01 modifying BR-07 (cancel cutoff 2h → 4h). Which full Baseline Ripple sequence prevents spec-vs-code mismatches at Final Defense and aligns with the spirit of ISO/IEC 27001 A.8.32?|||Giảng viên duyệt CR-01 sửa BR-07 (hạn huỷ 2h → 4h). Chuỗi Lan truyền Đường cơ sở nào tránh lỗi lệch đặc tả-sản phẩm lúc Bảo vệ cuối và phù hợp tinh thần kiểm soát ISO/IEC 27001 A.8.32?',
    [
      'Edit the Java if-statement immediately and leave SRS, WBS, and RTM untouched until Week 20|||Sửa ngay câu lệnh if trong Java và để nguyên SRS, WBS, RTM tới Tuần 20',
      'Approve CR-01 in CT Work changes/approvals → update SRS BR-07 &amp; add an "M" row in I. Record of Changes → trace forward in RTM to find every affected UC/method/test → implement on a CR branch → run C5 boundary regression tests &amp; close|||Duyệt CR-01 trên CT Work changes/approvals → sửa BR-07 trong SRS &amp; thêm dòng mã "M" vào I. Record of Changes → dò xuôi trên RTM tìm đủ UC/hàm/test bị ảnh hưởng → code trên nhánh CR → chạy test hồi quy biên dưới mũ C5 &amp; đóng',
      'Delete BR-07 from SRS so there is no rule to mismatch|||Xoá luôn BR-07 khỏi SRS để không còn luật nào bị lệch',
      'Rename UC-14 to a brand-new name without updating WBS or SDS|||Đổi tên UC-14 sang tên mới toanh mà không sửa WBS hay SDS',
    ],
    1,
    'Updating SRS Record of Changes (A/M/D), tracing affected tests via RTM, and running targeted C5 regression keeps code, docs, and security controls 100% aligned. Lesson 3.5.|||Cập nhật Record of Changes (A/M/D), tra đủ test bị ảnh hưởng qua RTM và chạy hồi quy dưới mũ C5 giữ code, hồ sơ và kiểm soát bảo mật khớp 100%. Bài 3.5.'),

  Q('dm5-3-q11',
    'You are running a 25-minute Solo Retrospective on CT Work retros/ on Sunday evening. Which output represents a genuine, data-driven enterprise retrospective?|||Bạn đang chạy buổi Retrospective Solo 25 phút trên trang retros/ của CT Work tối Chủ nhật. Đầu ra nào thể hiện đúng chuẩn một buổi retro dựa trên dữ liệu kiểu doanh nghiệp?',
    [
      'A 1-page emotional essay promising "I will work harder and procrastinate less next week" with 7 vague goals|||Một bài tâm sự dài 1 trang hứa "Tuần sau mình sẽ chăm chỉ hơn và bớt lười hơn" kèm 7 mục tiêu mơ hồ',
      'Start with 4 objective weekly numbers (focus hours, carryover, longest blocker, Defects vs. Leakages), check last week\'s action, then convert MAX 2 concrete, testable Action Items (Owner + Trigger + Check) directly into next week\'s CT Work Sprint Backlog cards|||Bắt đầu bằng 4 con số khách quan của tuần (giờ tập trung, thẻ trượt, blocker lâu nhất, Defect vs Leakage), kiểm lại action tuần trước, rồi chuyển TỐI ĐA 2 Action Item cụ thể kiểm chứng được (Chủ + Thời điểm + Cách kiểm) thẳng thành thẻ trong Sprint Backlog tuần sau',
      'Skip the retro completely because you are working solo|||Bỏ hẳn retro vì đằng nào cũng làm một mình',
      'Copy last week\'s Start/Stop/Keep board unchanged so there is a record|||Chép nguyên bảng Start/Stop/Keep tuần trước để cho có hồ sơ',
    ],
    1,
    'Data-first inspection + capping output at ≤ 2 testable Action Cards actually improves your process week over week without retro fatigue. Lesson 3.6.|||Đọc dữ liệu trước + giới hạn tối đa 2 thẻ Action kiểm chứng được giúp quy trình thật sự tiến bộ mỗi tuần mà không bị ngộp. Bài 3.6.'),

  Q('dm5-3-q12',
    'Before starting a recorded Google Meet demo / CT Work meeting transcript with your lecturer or external UAT testers, which two security &amp; professionalism rules are mandatory?|||Trước khi bấm ghi hình Google Meet / bật transcript trên CT Work meetings trong buổi demo với giảng viên hoặc người test UAT, hai quy tắc bảo mật &amp; chuyên nghiệp nào là bắt buộc?',
    [
      'Record secretly so people speak more naturally, and keep your .env file open in VS Code to prove config works|||Ghi âm lén để mọi người nói tự nhiên hơn, và mở sẵn tệp .env trên VS Code để chứng minh cấu hình chạy thật',
      'Ask explicit consent BEFORE recording/transcribing, AND sanitize your shared screen (close .env, password managers, private chats, and use fake seed accounts) — plus never paste confidential client transcripts into public AI tools at work|||Xin phép rõ ràng TRƯỚC khi ghi hình/bật transcript, VÀ vệ sinh màn hình chia sẻ (đóng .env, trình quản lý mật khẩu, chat riêng, chỉ dùng tài khoản seed giả) — cộng không dán transcript bí mật khách hàng lên AI công cộng khi đi làm',
      'Turn off the demo app and read only PowerPoint slides so nothing can leak|||Tắt app demo đi và chỉ đọc slide PowerPoint cho khỏi lộ gì',
      'Share your personal admin password in the meeting chat so everyone can log in quickly|||Gửi mật khẩu admin cá nhân vào khung chat cuộc họp để mọi người đăng nhập cho nhanh',
    ],
    1,
    'Explicit recording consent, screen-sharing hygiene, and protecting confidential transcripts are non-negotiable habits at university and enterprise outsourcing accounts alike. Lesson 3.6.|||Xin phép trước khi ghi hình, vệ sinh màn hình chia sẻ và bảo vệ transcript bí mật là thói quen bắt buộc từ đại học tới các dự án doanh nghiệp lớn. Bài 3.6.'),
];

export default {
  title: 'Chapter 3 — Operating Rhythm & Enterprise Reporting|||Chương 3 — Nhịp vận hành & báo cáo như doanh nghiệp',
  description: 'Vận hành dự án xuyên suốt theo nhịp doanh nghiệp trên CT Work (LF #2): Nhịp ngày 15 phút (đi bảng từ phải sang trái, bảng đối chiếu cột CT Work, WIP ≤ 2, Solo Standup 5 dòng, log giờ tập trung thật 0,5h, quy tắc Blocker 2h/24h); Nhịp tuần Chốt Chủ nhật 60 phút tách rõ SWP391 (PT26 + Template6) và SEP490 từ W11 (Project Tracking 6 sheet + Weekly Report 5 khối I–V) + Luật Chuyển hoá 2 giờ sau review GV; Báo cáo trạng thái bằng số liệu (RAG 4 chiều loại bỏ Báo cáo Dưa hấu, % trọng số 0/20/50/75/100 tránh Quy luật 90–90, đọc Burndown/Velocity/CFD & chặn Goodhart); Xử lý khi trễ (5 tín hiệu sớm, 4 đòn bẩy an toàn vs 2 bẫy nguy hiểm, Escalation Hourensou 5 phần); Quản lý thay đổi CR (Phân tích ảnh hưởng 6 chiều, Baseline Ripple vào SRS Record of Changes & RTM, tinh thần ISO 27001 A.8.32); Họp Planning/Review/Retro dữ liệu & Biên bản MoM 6 phần; Lab vận hành trọn tuần và Kiểm tra 12 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    {
      title: '3.8 — Chapter 3 Quiz|||3.8 — Kiểm tra Chương 3',
      slug: 'dm5-3-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu hỏi tình huống bao trọn Chương 3: đi bảng từ phải sang trái & WIP, quy tắc Blocker 2h/24h & vệ sinh log, Chốt tuần Chủ nhật & kiểm chứng weekly_report_generate, Luật Chuyển hoá 2 giờ, RAG tổng chống Báo cáo Dưa hấu, % trọng số 0/20/50/75/100 chống Quy luật 90–90, đọc tắc cổ chai CFD, cứu trễ an toàn vs bẫy tắt bảo mật/test, bài học Ariane 5 & Phân tích ảnh hưởng 6 chiều + RTM, Retro dựa trên dữ liệu và vệ sinh ghi hình cuộc họp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>3.8 — Check your mastery of Operating Rhythm &amp; Enterprise Reporting</h2>
<p class="lead">Twelve scenario-based questions covering Lessons 3.1–3.7. Aim for at least 10/12 before moving on to Chapter 4 (Requirements Engineering under hat C2 BA). Every explanation links back to the exact lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>3.8 — Kiểm tra độ nắm vững Nhịp vận hành &amp; Báo cáo như doanh nghiệp</h2>
<p class="lead">Mười hai câu hỏi tình huống bao trọn Bài 3.1–3.7. Hãy đặt mục tiêu đạt tối thiểu 10/12 trước khi bước sang Chương 4 (Phân tích yêu cầu dưới mũ C2 BA). Mỗi lời giải đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ3 },
    },
  ],
};
