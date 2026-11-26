/**
 * Chương 2 — Khởi động & lập kế hoạch (mũ PM) (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 6 bài kiến thức (2.1–2.6), 1 bài Lab thực hành trên CT Work LF #2 (2.7, dm5-2-lab) và bài kiểm tra 10 câu (2.8, dm5-2-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s02/b1-charter-pham-vi.mjs';
import B2 from './s02/b2-wbs-ct-work.mjs';
import B3 from './s02/b3-uoc-luong-lich.mjs';
import B4 from './s02/b4-quan-ly-rui-ro-raid.mjs';
import B5 from './s02/b5-truyen-thong-quan-tri.mjs';
import B6 from './s02/b6-report1-report2.mjs';
import B7 from './s02/b7-lab.mjs';

const QUIZ2 = [
  Q('dm5-2-q1',
    'What is the main lesson of the $170M FBI Virtual Case File failure (DOJ OIG 05-07 &amp; IEEE Spectrum, 2005) for a PM wearing hat C1 at project kickoff?|||Bài học chính từ thất bại 170 triệu USD của dự án FBI Virtual Case File (DOJ OIG 05-07 &amp; IEEE Spectrum, 2005) dành cho PM đội mũ C1 lúc khởi động là gì?',
    [
      'Government projects should never use web browsers|||Các dự án chính phủ không bao giờ nên dùng trình duyệt web',
      'Without a locked Project Charter, MoSCoW ceiling (≤ 60% Must-have effort hours), and formal change control, uncontrolled scope creep burns through the entire schedule and budget before delivery|||Thiếu Project Charter đã khoá, trần MoSCoW (≤ 60% giờ ước Must-have) và kiểm soát thay đổi chính thức, tình trạng phình phạm vi sẽ đốt sạch lịch và ngân sách trước khi bàn giao được sản phẩm',
      'Developers should write code first and draft scope at the end of the project|||Lập trình viên nên code trước rồi cuối dự án mới viết phạm vi',
      'You should mark 100% of features as Must-have so nobody cuts anything|||Nên gắn nhãn Must-have cho 100% tính năng để không ai cắt bớt gì',
    ],
    1,
    'Unfrozen scope and hundreds of uncontrolled mid-build requirement changes doomed FBI VCF (2001–2005). Locking a 1-page Charter + ≤ 60% Must-have hour cap + explicit Exclusions prevents scope collapse. Lesson 2.1.|||Phạm vi không khoá và hàng trăm lần đổi yêu cầu tự phát giữa chừng đã đánh chìm FBI VCF (2001–2005). Khoá Charter 1 trang + trần ≤ 60% giờ Must-have + mục Loại trừ rõ ràng giúp chặn vỡ phạm vi. Bài 2.1.'),

  Q('dm5-2-q2',
    'Under SWP391 LOC rules, compare Option A (4 Medium screens stopped at Quality L1 = 50%) vs. Option B (3 Medium screens completed cleanly to Quality L2 = 75%). Which is smarter PM scope sizing?|||Theo luật chấm LOC của SWP391, so sánh Phương án A (4 màn Medium dừng ở Quality L1 = 50%) với Phương án B (3 màn Medium hoàn thiện sạch ở Quality L2 = 75%). Cách định cỡ phạm vi nào của PM thông minh hơn?',
    [
      'Option A because 4 screens always beats 3 screens regardless of quality|||Phương án A vì 4 màn luôn thắng 3 màn bất kể chất lượng',
      'Option B — 3 × (120 × 75%) = 270 LOC beats 4 × (120 × 50%) = 240 LOC, AND avoids Leakage penalties (lecturer-caught post-submission bugs)|||Phương án B — 3 × (120 × 75%) = 270 LOC cao hơn 4 × (120 × 50%) = 240 LOC, ĐỒNG THỜI tránh bị phạt Leakage (lỗi GV tìm ra sau khi nộp)',
      'Both earn exactly 0 LOC unless you also build an Android app|||Cả hai đều được 0 LOC trừ khi bạn làm thêm app Android',
      'Quality level L1/L2/L3 only applies to Report 1 Word documents|||Mức chất lượng L1/L2/L3 chỉ áp dụng cho tài liệu Word Report 1',
    ],
    1,
    'Smaller, deeper scope at Quality L2 (75%: 1 happy + ≥ 3 unhappy cases) yields MORE LOC points and far fewer Leakages (bugs found by the lecturer after submission that deduct points and must be fixed first) than bloated L1 screens. Lesson 2.1.|||Phạm vi gọn hơn nhưng đạt sâu Quality L2 (75%: 1 happy + ≥ 3 unhappy case) mang lại NHIỀU điểm LOC hơn và ít Leakage hơn hẳn (lỗi GV tìm ra sau khi nộp, bị trừ điểm và phải sửa trước) so với ôm nhiều màn L1 làm dở. Bài 2.1.'),

  Q('dm5-2-q3',
    'Which WBS structure obeys BOTH the PMI 100% Rule AND SWP391 Vertical-Slice grading?|||Cấu trúc WBS nào tuân thủ ĐỒNG THỜI cả Quy tắc 100% của PMI lẫn luật chấm Miền dọc của SWP391?',
    [
      'Level 1 = "Code Backend" / "Code Frontend" / "Write Docs" with no Non-UI jobs or reports listed|||Cấp 1 = "Code Backend" / "Code Frontend" / "Viết tài liệu", bỏ qua job chạy ngầm và báo cáo',
      'Level 1 = Workflows/Epics + Governance/Docs Epic; Level 2 = concrete UI Screens &amp; Non-UI Reqs (1 LOC owner each, exact SRS names); Level 3 = 5 role sub-tasks per Req with independent PR review|||Cấp 1 = Luồng nghiệp vụ/Epic + Epic Quản trị/Hồ sơ; Cấp 2 = Màn hình UI &amp; Req Non-UI cụ thể (mỗi Req 1 chủ LOC, khớp tên SRS); Cấp 3 = 5 việc con theo vai cho mỗi Req có review PR độc lập',
      'Splitting S22 Create Reservation in half so two people share its LOC|||Cắt đôi màn S22 Create Reservation để hai người chia nhau điểm LOC',
      'Putting only UI screens in WBS and doing SRS, Testing, and CI "off the board" on weekends|||Chỉ đưa màn hình UI vào WBS còn SRS, Kiểm thử và CI tự làm "ngoài bảng" vào cuối tuần',
    ],
    1,
    'A deliverable-oriented WBS covers 100% of in-scope work (screens, Non-UI jobs N1–N6, docs, CI, tests) and assigns each Req vertically to one LOC owner under the Single-Name Rule, with independent cross-hat review. Lesson 2.2.|||WBS hướng sản phẩm bàn giao phủ đủ 100% việc trong phạm vi (màn hình, job Non-UI N1–N6, hồ sơ, CI, test) và giao dọc từng Req cho một chủ LOC theo Luật Một Tên Duy Nhất, kèm review chéo độc lập. Bài 2.2.'),

  Q('dm5-2-q4',
    'Why is attaching a real CT Work ticket ID (e.g., LF-22) to every Git branch and commit a strong change-management &amp; audit habit aligned with ISO/IEC 27001?|||Vì sao gắn mã thẻ CT Work thật (vd LF-22) vào mọi nhánh và commit Git lại là thói quen kiểm soát thay đổi &amp; kiểm toán tốt phù hợp ISO/IEC 27001?',
    [
      'Because Git refuses to commit without numbers in the message|||Vì Git không cho commit nếu thiếu số trong thông điệp',
      'It is a widely adopted way to demonstrate a formal change-control process (ISO/IEC 27001 A.8.32), linking sampled production edits to an approved WBS ticket and independent review to block untracked "orphan commits"|||Đây là cách phổ biến để chứng minh quy trình kiểm soát thay đổi chính thức (ISO/IEC 27001 A.8.32), nối các thay đổi được lấy mẫu về thẻ WBS đã duyệt kèm review độc lập và chặn "commit mồ côi"',
      'It doubles your SWP391 LOC score automatically|||Nó tự động nhân đôi điểm LOC SWP391',
      'It encrypts your database passwords inside Git history|||Nó mã hoá mật khẩu CSDL trong lịch sử Git',
    ],
    1,
    'ISO/IEC 27001 Annex A.8.32 requires a formal change-control process (authorization, testing, review); linking branches, PRs, and commits to approved tickets is a common engineering practice to prove traceability when auditors sample changes. Lesson 2.2.|||ISO/IEC 27001 Phụ lục A.8.32 yêu cầu có quy trình kiểm soát thay đổi chính thức; gắn mã thẻ đã duyệt vào nhánh, PR và commit là cách phổ biến để chứng minh truy vết khi kiểm toán viên lấy mẫu thay đổi. Bài 2.2.'),

  Q('dm5-2-q5',
    'You estimate 24 raw study hours in Week 4 (with a 0.75 focus factor) and want a healthy 15–20% schedule buffer. Roughly how many hours of planned work should you commit to Week 4?|||Bạn có 24 giờ học thô ở Tuần 4 (hệ số tập trung 0,75) và muốn giữ bộ đệm 15–20% lành mạnh. Bạn nên cam kết khoảng bao nhiêu giờ khối lượng kế hoạch cho Tuần 4?',
    [
      '24 hours (100% of raw hours)|||24 giờ (100% giờ thô)',
      '18 hours (100% of focus hours, zero buffer)|||18 giờ (100% giờ tập trung, không đệm)',
      'About 14.5–15.0 hours (80–85% of the 18 real focus hours, leaving ~3–3.5h explicitly as buffer)|||Khoảng 14,5–15,0 giờ (80–85% của 18 giờ tập trung thật, chừa rõ ~3–3,5 giờ làm bộ đệm)',
      '35 hours by turning Sunday (your light review ≤ 1h + rest day) into a full coding day|||35 giờ bằng cách biến Chủ nhật (ngày review nhẹ ≤ 1 giờ, nghỉ phần còn lại) thành ngày code nặng',
    ],
    2,
    '24 raw hours × 0.75 = 18 real focus hours; loading at 80–85% (~14.5–15h) leaves a real 15–20% buffer against Planning Fallacy and unexpected debugging while keeping Sunday as a light review (≤ 1h) and rest day. Lesson 2.3.|||24 giờ thô × 0,75 = 18 giờ tập trung thật; xếp tải 80–85% (~14,5–15 giờ) chừa ra đúng 15–20% bộ đệm chống Ngụy biện Lập kế hoạch và lỗi phát sinh mà vẫn giữ Chủ nhật là ngày review nhẹ (≤ 1 giờ) và nghỉ ngơi phần còn lại. Bài 2.3.'),

  Q('dm5-2-q6',
    'On LabFlow AI, why does Gate G0 (Week 2 PostgreSQL exclusion-constraint spike) sit BEFORE building 20 CRUD screens, and why is S22 on the Critical Path while S47 PDF export is not?|||Trên LabFlow AI, vì sao Cổng nội bộ G0 (spike ràng buộc chống trùng PostgreSQL ở Tuần 2) được đặt TRƯỚC khi làm 20 màn CRUD, và vì sao S22 nằm trên Đường găng còn S47 xuất PDF thì không?',
    [
      'G0 de-risks the hardest architectural unknown while rework is cheap; S22 has zero float because waitlist, check-in, and reports depend on it, whereas S47 has positive float and can be deferred safely|||G0 diệt sớm nút thắt kiến trúc rủi ro nhất khi sửa còn rẻ; S22 có độ trễ dư bằng 0 vì waitlist, check-in và báo cáo phụ thuộc nó, còn S47 có độ trễ dư dương và có thể dời an toàn',
      'Because PostgreSQL cannot create CRUD tables until a PDF is exported|||Vì PostgreSQL không tạo được bảng CRUD cho tới khi xuất được PDF',
      'Because S47 is harder to code than distributed concurrency|||Vì S47 khó code hơn xử lý đồng thời',
      'Internal gates are only used in waterfall projects, never iterative projects|||Cổng nội bộ chỉ dùng ở mô hình thác nước, không dùng ở dự án lặp',
    ],
    0,
    'Front-loading technical unknowns into Gate G0 avoids a Sydney Opera House-style rework disaster, and knowing your Critical Path tells you which delays actually threaten the gate. Lesson 2.3.|||Kéo rủi ro kỹ thuật lên Cổng G0 tránh cảnh đập đi xây lại kiểu Nhà hát Sydney, và nắm rõ Đường găng giúp bạn biết cú trễ nào thật sự đe doạ mốc nộp. Bài 2.3.'),

  Q('dm5-2-q7',
    'In a RAID Log, your lecturer has NOT yet confirmed whether PostgreSQL is allowed instead of MySQL, and meanwhile your Week-11 feedback says "Email Service is missing from the Student UC diagram." How should you classify those two items?|||Trong sổ RAID, giảng viên CHƯA xác nhận có cho dùng PostgreSQL thay MySQL hay không, còn trong góp ý Tuần 11 thầy ghi "Thiếu Email Service trong sơ đồ UC Student." Bạn phân loại hai mục này thế nào?',
    [
      'Both are Defects|||Cả hai đều là Defect',
      'PostgreSQL approval is an unverified Assumption (and Dependency on lecturer Q&amp;A #1, with a MySQL Plan B); the lecturer\'s missing-actor feedback is an active Issue (and Review Defect) needing an Owner &amp; Due Date|||Việc được duyệt PostgreSQL là một Giả định (Assumption) chưa kiểm chứng (kèm Phụ thuộc Q&amp;A #1 với thầy, có Plan B MySQL); còn góp ý thiếu actor của thầy là một Vấn đề (Issue) đang diễn ra (kèm Review Defect) cần Owner &amp; Hạn xử lý',
      'Both are Risks that you can ignore until Week 10|||Cả hai đều là Rủi ro có thể mặc kệ tới Tuần 10',
      'PostgreSQL approval is an Exclusion; the lecturer feedback is an Assumption|||Duyệt PostgreSQL là Exclusion; góp ý thầy là Assumption',
    ],
    1,
    'Separating Risks (future), Assumptions (unverified beliefs), Issues (active problems right now), and Dependencies (waiting on external approval) keeps RAID sharp and actionable — avoiding TSB Bank 2018-style blind spots. Lesson 2.4.|||Tách rạch ròi Risk (tương lai), Assumption (giả định chưa kiểm), Issue (vấn đề đang xảy ra) và Dependency (chờ bên ngoài) giữ cho sổ RAID sắc nét và hành động được — tránh điểm mù kiểu TSB Bank 2018. Bài 2.4.'),

  Q('dm5-2-q8',
    'On Wednesday of Week 5, you realize a nasty bug + midterm exam will push your Iteration-2 Critical Path back by 2 days. Following the Communication &amp; Escalation Ladder (Lesson 2.5), what should you do?|||Vào thứ Tư Tuần 5, bạn nhận ra một bug nặng + lịch thi giữa kỳ sẽ làm Đường găng Iteration 2 trễ 2 ngày. Theo Thang Leo thang Truyền thông (Bài 2.5), bạn nên làm gì?',
    [
      'Stay silent and hope to pull three all-nighters before Sunday so the lecturer never finds out|||Im lặng và hy vọng thức trắng ba đêm trước Chủ nhật để thầy không biết',
      'Send the lecturer a 1-line chat: "Teacher I am stuck, please help" with no options|||Nhắn thầy một dòng: "Thầy ơi em kẹt rồi, thầy giúp em với" không kèm phương án nào',
      'Escalate early (Amber/Red) in writing using Situation → Impact → 2 Concrete Options → Recommendation (e.g., keep S22 booking at Quality L2 and defer Could-have S47 to Iter 3), then log the approved decision in Q&amp;A/Changes|||Báo sớm (Vàng/Đỏ) bằng văn bản theo khung Tình huống → Tác động → 2 Phương án cụ thể → Đề xuất (vd giữ S22 đặt lịch đạt Quality L2 và dời S47 Could-have sang Iter 3), rồi ghi quyết định đã duyệt vào Q&amp;A/Changes',
      'Delete the broken test cases so the board looks Green|||Xoá bớt các test case đang lỗi để bảng trông màu Xanh',
    ],
    2,
    'The No-Surprises Rule &amp; Hourensou mean surfacing risks early with structured trade-off options — never hiding delays or dumping raw problems upward. Lesson 2.5.|||Luật Không bất ngờ &amp; Hourensou đòi hỏi báo sớm kèm phương án đánh đổi có cấu trúc — không giấu trễ và cũng không đẩy vấn đề thô lên trên. Bài 2.5.'),

  Q('dm5-2-q9',
    'What is the right build order between Report 2 Project Tracking (Excel) and Report 2 Project Management Plan (Word), and what are two real template traps you must fix in the Excel workbook?|||Thứ tự dựng đúng giữa Report 2 Project Tracking (Excel) và Report 2 Project Management Plan (Word) là gì, và hai cái bẫy kỹ thuật thật nào bạn phải sửa trong file Excel mẫu?',
    [
      'Write PMP Word first, then invent Excel numbers later; leave #REF! cells untouched so the template stays original|||Viết PMP Word trước rồi bịa số Excel sau; giữ nguyên các ô #REF! để file giống hệt mẫu',
      'Build Project Tracking (Excel) FIRST so Scope &amp; WBS feed PMP §1.1 identically; fix (1) clear mistaken Status Data Validation on Scope col G (Actual Effort) so it holds numbers, and (2) repair broken #REF!/#N/A COUNTIF/SUMIF summary formulas on WBS|||Dựng Project Tracking (Excel) TRƯỚC để Scope &amp; WBS đổ số khớp 100% sang PMP §1.1; sửa (1) xoá Data Validation bị áp nhầm ở cột G Actual Effort sheet Scope để nhập số, và (2) sửa công thức tổng COUNTIF/SUMIF đang lỗi #REF!/#N/A ở đầu sheet WBS',
      'Delete the Q&amp;A and Issues sheets to make the Excel file shorter|||Xoá bớt sheet Q&amp;A và Issues cho file Excel gọn hơn',
      'Type "Completed" into Actual Effort and keep 5 fake student names in RACI|||Gõ chữ "Completed" vào cột Actual Effort và giữ 5 tên sinh viên giả trong RACI',
    ],
    1,
    'Excel Tracking is the numerical source of truth for PMP §1.1 &amp; §1.2; clearing Scope col G validation and repairing WBS #REF! summary cells eliminates two of the most common submission bugs. Lesson 2.6.|||Excel Tracking là nguồn số liệu chuẩn cho PMP §1.1 &amp; §1.2; xoá Data Validation lỗi ở cột G Scope và sửa ô tổng #REF! của WBS loại bỏ hai lỗi kỹ thuật phổ biến nhất khi nộp bài. Bài 2.6.'),

  Q('dm5-2-q10',
    'Before exporting Report 1 and Report 2 to PDF for submission, what should hat C5 (QA) run to prevent template contamination and hidden PII/metadata leaks?|||Trước khi xuất Report 1 và Report 2 sang PDF để nộp, mũ C5 (QA) cần chạy kiểm tra gì để chặn nhiễm bẩn tệp mẫu và rò rỉ PII/siêu dữ liệu ẩn?',
    [
      'Nothing — converting Word to PDF automatically fixes all numbers and removes old team names|||Không cần làm gì — xuất Word sang PDF tự động sửa mọi số liệu và xoá tên nhóm cũ',
      'Run the 10-Point Red-Pen Audit (sourced stats, Fit-Gap, PP↔FE trace, Scope==PMP, honest solo Team/RACI, 0 #REF!, updated TOC), Ctrl+F for leftover sample names, verify fake demo emails in screenshots, and run Office Document Inspector to strip hidden author metadata|||Chạy Bảng soát 10 lỗi Bút đỏ (số liệu có nguồn, Fit-Gap, truy vết PP↔FE, Scope==PMP, Team/RACI solo trung thực, 0 #REF!, cập nhật Mục lục), Ctrl+F soát tên dự án mẫu cũ, kiểm ảnh chụp chỉ dùng email demo giả và chạy Office Document Inspector xoá metadata tác giả ẩn',
      'Add extra decorative cover pages and rename the Project Code to 3 different abbreviations|||Thêm bìa trang trí và đổi Mã dự án thành 3 tên viết tắt khác nhau',
      'Skip Record of Changes until Report 7 in Week 20|||Bỏ trống Record of Changes tới tận Report 7 ở Tuần 20',
    ],
    1,
    'A 10-minute C5 Red-Pen + Document Inspector pass catches leftover sample text, broken TOCs, formula drift, and hidden metadata before your lecturer ever sees the file. Lesson 2.6 &amp; Lab 2.7.|||10 phút soát Bút đỏ + Document Inspector dưới mũ C5 bắt sạch chữ mẫu cũ, mục lục lệch trang, sai công thức và siêu dữ liệu ẩn trước khi giảng viên mở file. Bài 2.6 &amp; Lab 2.7.'),
];

export default {
  title: 'Chapter 2 — Project Kickoff & Planning (PM Hat)|||Chương 2 — Khởi động & lập kế hoạch (mũ PM)',
  description: 'Trọn bộ kỹ năng khởi động & lập kế hoạch dự án dưới mũ PM (C1): Project Charter & khoá phạm vi (MoSCoW trần 60% giờ, MaxLOC/Quality L2, Limitations vs Exclusions, OWASP API9 Shadow API), dựng WBS theo Quy tắc 100% & ánh xạ 46 Req × 5 việc lên CT Work, ước lượng & lập lịch 3 iteration (PERT, Phép thử tải, Đường găng, Gate G0/M1–M3, Bộ đệm & Feature Freeze), quản lý rủi ro RAID sống từ Ngày 1, kế hoạch truyền thông & quản trị (GV = Khách hàng/Nhà tài trợ), viết chuẩn Report 1 & Report 2 (PMP + Tracking 6 sheet kèm sửa 3 bẫy mẫu & 10 lỗi bút đỏ), Lab khởi động trên CT Work LF #2 và Kiểm tra 10 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    {
      title: '2.8 — Chapter 2 Quiz|||2.8 — Kiểm tra Chương 2',
      slug: 'dm5-2-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu hỏi tình huống bao trọn Chương 2: bài học FBI Virtual Case File 2005, phép toán MaxLOC & Quality L2 + Leakage, WBS Quy tắc 100% & ISO 27001 A.8.32 truy vết thay đổi, Phép thử tải & Đường găng + Gate G0, phân loại RAID (TSB Bank 2018), Thang leo thang truyền thông, thứ tự dựng Tracking → PMP + sửa bẫy Excel và soát Bút đỏ C5.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>2.8 — Check your mastery of Project Kickoff &amp; Planning</h2>
<p class="lead">Ten scenario-based questions covering Lessons 2.1–2.7. Aim for at least 8/10 before moving on to Chapter 3 (Weekly Operating Rhythm &amp; Enterprise Reporting). Every explanation points directly back to the lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>2.8 — Kiểm tra độ nắm vững Khởi động &amp; Lập kế hoạch (mũ PM)</h2>
<p class="lead">Mười câu hỏi tình huống bao trọn Bài 2.1–2.7. Hãy đặt mục tiêu đạt tối thiểu 8/10 trước khi sang Chương 3 (Nhịp vận hành &amp; Báo cáo như doanh nghiệp). Mỗi giải thích đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ2 },
    },
  ],
};
