/**
 * ASI101 — Introduction to Automotive System (Nhập môn ô tô). Ngành Kỹ thuật
 * phần mềm ô tô (FPTU), Kỳ 1. DỰNG LẠI 20/09/2026 bám nguyên văn FLM Syllabus
 * 14453 (QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026), nguồn:
 * content/academy/_syllabus-flm/ASI101.json. Bản trước (18 bài, 8 chương tự
 * chọn: tổng quan → động cơ → truyền động → khung gầm → điện-điện tử → cảm
 * biến → điều khiển/phần mềm → an toàn/ADAS) KHÔNG bám cấu trúc 60 buổi / 3
 * giáo trình của trường — đã thay toàn bộ.
 *
 * MỨC ĐỘ: Mục 0 (khung FLM) và Chương 1 (buổi 1-6: thị trường ô tô + phân
 * loại/khung gầm/thân xe/bố trí) là ĐẦY ĐỦ, dạy được ngay. Chương 2 → 15 CHỈ
 * LÀ KHUNG (đúng tên bài + 3-6 dòng mốc nội dung: buổi, CLO, tài liệu, nội
 * dung FLM) — bài giảng chi tiết bổ sung sau, KHÔNG tự ý viết dài thêm.
 *
 * Sách/tài liệu: theo lệnh 20/09/2026 mọi giáo trình phải là thẻ
 * `.khoi-sach`/`.the-sach` (content/academy/_HOP-DONG-SOAN-BAI.md, mục "SÁCH
 * & TÀI LIỆU"). Cả 3 giáo trình FLM đều "Is Online = False" ⇒ CẢ BA là thẻ
 * `khong-link` (không có `.sach-nut`, không bịa link):
 *   - Giáo trình CHÍNH: Automotive Systems: Principles and Practice (Awari,
 *     Kumbhar, Tirpude — CRC Press 2021) — sách Ấn Độ, xem cảnh báo dưới.
 *   - Ref textbook 01: Automotive Software Architectures (Staron, Springer
 *     2021) — dùng buổi 43-53.
 *   - Ref textbook 02: Introduction to Automotive Engineering (Sakthivel và
 *     cộng sự, Wiley-Scrivener 2019) — dùng buổi 39-42.
 *
 * ⚠️⚠️ GIÁO TRÌNH CHÍNH LÀ SÁCH ẤN ĐỘ: chương 1 dạy "Indian Automotive
 * Market", "Indian and Global OEMs"; buổi 5 dạy tiêu chuẩn pháp lý CMVR &
 * MVA — LUẬT ẤN ĐỘ, KHÔNG phải luật Việt Nam. Đã nêu rõ trong bài 1.2 và
 * mục 0.4, không để sinh viên hiểu nhầm là quy định trong nước.
 *
 * ⚠️ 20 chỗ syllabus gốc bất thường (đủ trong "ghiChuKiemChung" của file
 * JSON nguồn, đã nêu lại đúng vị trí liên quan trong các bài dưới đây, KHÔNG
 * tự sửa bảng gốc):
 *  1. CLO của "Final exam" để TRỐNG dù thi 40%.
 *  2. Bảng đánh giá gõ sai CLO: "CLOS 1-7" (Presentation), "CLO4,C LO5"
 *     (Progress test — dấu cách lọt giữa "C" và "LO5").
 *  3. LỆCH CLO ngược chiều giữa bảng đánh giá (Test1=CLO1-6, Test2=CLO1-3)
 *     và kế hoạch buổi (buổi30 PT1=CLO1,2,3; buổi54 PT2=CLO1,2,4,6).
 *  4. Buổi 50 & 51 TRÙNG NGUYÊN VĂN ("18.3 AUTOSAR Development Methodology
 *     18.4 AUTOSAR Meta-Model").
 *  5. Bản gốc gõ lặp chữ "Meta-ModelMeta-Model" ở buổi 50/51.
 *  6. Buổi 48 đánh số sai: "17.1 Introduction" rồi lại "17.1 Requirements"
 *     (đáng lẽ 17.2).
 *  7. Buổi 44 kết thúc bằng một dấu ngoặc kép lạc.
 *  8. Buổi 1 gắn CLO2, CLO6 mà KHÔNG gắn CLO1 (dù CLO1 = "hiểu cấu tạo cơ
 *     bản của xe").
 *  9. Ô Duration/No Question của Assignment & Progress test chứa nguyên văn
 *     "Option 1 / Option 2 (For Constructivism Approach only)" kèm ngoặc
 *     kép lạc + một ký tự TAB — trường KHÔNG chốt một con số duy nhất.
 * 10. Assignment Part=2, Progress test Part=2 ⇒ mỗi đầu điểm gồm HAI lần
 *     (Assignment 1 buổi 19-20, Assignment 2 buổi 35-36; PT1 buổi 30, PT2
 *     buổi 54), mỗi lần ~10%.
 * 11. Đề Assignment 2 nguyên văn: "Simulate Ackermann Kinematic Model with
 *     Steering Angle Constraints" (Matlab).
 * 12. Có "Project Presentation" buổi 58-60 nhưng bảng đánh giá KHÔNG có đầu
 *     điểm tên "Project" — gần nhất là "Presentation" 20%.
 * 13. Môn KHÔNG có LAB; Learning-Teaching Type của cả 60 buổi đều "Offline".
 * 14. Cột S-Download chỉ có "ASI101_Slide"/"ASI101_Assignment" — trường CÓ
 *     slide/đề riêng nhưng chỉ tải được trong FLM.
 * 15. Cột URLs của cả 60 buổi đều TRỐNG.
 * 16. Time Allocation không ghi số buổi; 45h/60 buổi ≈ 45 phút/buổi.
 * 17. Tổng 4 đầu điểm = 20+20+20+40 = 100% (khớp).
 * 18. Trang syllabus KHÔNG có bảng Constructive Questions cho môn này.
 * 19. Đây là syllabus MỚI nhất (QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026) trong các
 *     môn Kỳ 1 đã thu tới nay.
 * 20. Tools nguyên văn: "Internet ; Matlab simulation online" — buổi 6 có
 *     mục "2.9 Introduction to Matlab Simulation Tool".
 *
 * Giữ NGUYÊN các slug đã có trong bản trước, gán lại cho bài GẦN NGHĨA nhất
 * trong cấu trúc mới (số trong slug không cần khớp số bài mới, chỉ cần chủ
 * đề gần nhau — cùng lối DTG102 đã làm):
 *   asi101-0-1-overview      → 0.1 Hồ sơ môn (vẫn là bài hồ sơ/tổng quan)
 *   asi101-0-0-tai-lieu      → 0.4 Giáo trình & công cụ (vẫn là bài tài liệu)
 *   asi101-1-1-tong-quan-oto → 1.2 Phân loại/khung gầm/bố trí (nội dung cũ
 *                              về block xe & phân loại gần nhất với bài này)
 *   asi101-quiz-1            → Quiz kết Chương 1 (vẫn đúng vị trí)
 *   asi101-2-1-dong-co       → 2.1 Nguyên lý & phân loại động cơ (buổi 7-8)
 *   asi101-3-1-truyen-dong   → 7.2 Vi sai & cầu sau (buổi 24, nội dung cũ có
 *                              nhắc differential)
 *   asi101-4-1-khung-gam     → 8.1 Hệ thống treo (buổi 25, nội dung cũ mở
 *                              đầu bằng suspension)
 *   asi101-7-1-dieu-khien-phan-mem → 13.1 Nhập môn phần mềm & ô tô (buổi 43)
 *   asi101-8-1-an-toan-adas  → 12.3 Xe tự hành: đạo đức & an toàn (buổi 42)
 * Các slug quiz-2..quiz-8 của bản trước KHÔNG còn dùng (chương 2+ mới không
 * có quiz riêng theo yêu cầu) — bị prune khi seed (course.pruneSections:
 * true). Bài MỚI dùng lối asi101-<chương>-<số>-<mô tả>.
 *
 * ⚠️ KHÔNG backtick lồng hay ${ } trong chuỗi nội dung — thẻ sách & bảng 60
 * buổi dựng bằng nối chuỗi thường (biến + "chuỗi").
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ─────────────────────────────────────────────────────────────────────────
// Thẻ sách dùng chung (.khoi-sach/.the-sach) — nối chuỗi thường, dán lại ở
// bất kỳ bài nào nhắc tới cuốn tương ứng (HOP-DONG-SOAN-BAI, mục "SÁCH & TÀI
// LIỆU"). Cả 3 đều Is Online=False trên FLM ⇒ khong-link, KHÔNG có .sach-nut.
// ─────────────────────────────────────────────────────────────────────────
const sachChinh =
  '<div class="khoi-sach">' +
  '<div class="the-sach chinh khong-link">' +
  '<span class="sach-ico">📕</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Automotive Systems: Principles and Practice</span>' +
  '<span class="sach-phu">G.K. Awari, V.S. Kumbhar, R.B. Tirpude &middot; CRC Press &middot; 2021 &middot; 1st ed &middot; ISBN 9780367498504</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">Giáo trình chính</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

const sachRef01 =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📘</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Automotive Software Architectures: An Introduction</span>' +
  '<span class="sach-phu">Miroslaw Staron &middot; Springer &middot; 2021 &middot; 2nd ed &middot; ISBN 9783030659387 &middot; Ref textbook 01 (buổi 43-53)</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

const sachRef02 =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📗</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Introduction to Automotive Engineering</span>' +
  '<span class="sach-phu">R. Sakthivel, Faisal O. Mahroogi, S. Narayan, S. Abudbaker, M. U. Kaisan, Youssef Alammari &middot; Wiley-Scrivener &middot; 2019 &middot; 1st ed &middot; ISBN 9781119479802 &middot; Ref textbook 02 (buổi 39-42)</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

// ─────────────────────────────────────────────────────────────────────────
// MỤC 0 — Khung FLM (đầy đủ, chính xác 100% theo Syllabus 14453)
// ─────────────────────────────────────────────────────────────────────────

const m01 = doc('asi101-0-1-overview', '0.1 — Course profile (FLM Syllabus 14453)|||0.1 — Hồ sơ môn (FLM Syllabus 14453)',
  'Tên môn, mã môn, 3 tín chỉ, 150h = 45h lên lớp + 1h thi + 104h tự học (60 buổi, KHÔNG có LAB), môn tiên quyết None — nguyên văn FLM, kèm sylID + số quyết định để tự đối chiếu.',
  [[
    `<span class="eyebrow">ASI101 · Section 0 · 0.1 · Course profile</span>
<h2>Course profile — Introduction to Automotive System (ASI101)</h2>
<p class="lead">The facts below are copied exactly as published on <strong>FLM</strong> (FPT University's syllabus system) so you can verify every number yourself.</p>
<table>
<tr><th>Field</th><th>Value (FLM)</th></tr>
<tr><td>Syllabus Name</td><td>Introduction to Automotive System_Nhập môn ôtô</td></tr>
<tr><td>Course Name (English)</td><td>Introduction to Automotive System</td></tr>
<tr><td>Subject Code</td><td>ASI101</td></tr>
<tr><td>Credits</td><td>3</td></tr>
<tr><td>Degree Level</td><td>Bachelor</td></tr>
<tr><td>Time Allocation</td><td>Study hour (150h) = 45h contact hours + 1h final exam + 104h self-study</td></tr>
<tr><td>Pre-Requisite</td><td>None</td></tr>
<tr><td>Learning-Teaching Method</td><td>In-class lecture, Active Learning, Inquiry-Based Learning, Problem Based Learning, Project based learning</td></tr>
<tr><td>Scoring Scale</td><td>10</td></tr>
<tr><td>Min. average mark to pass</td><td>5</td></tr>
<tr><td>Decision No.</td><td>1028/QĐ-ĐHFPT dated 08/21/2026</td></tr>
<tr><td>Syllabus ID</td><td>14453</td></tr>
</table>
<div class="callout"><span class="badge">Self-check</span> Every figure above is taken verbatim from FLM — Syllabus ID <strong>14453</strong>, issued under Decision <strong>1028/QĐ-ĐHFPT dated 08/21/2026</strong>. Original: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=14453" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=14453)</a>.</div>
<div class="callout warn"><span class="badge">⚠️ No session count published</span> "Time Allocation" gives hours, not sessions. The full 60-session plan (section 0.5) shows 45 contact hours split across <strong>60 sessions</strong> — about <strong>45 minutes per session</strong>. FLM does not state this division explicitly; we computed it from the two published numbers, we did not invent a new one.</div>
<div class="callout"><span class="badge">No LAB</span> Every one of the 60 sessions is tagged <strong>"Offline"</strong> in the Learning-Teaching Type column of the FLM plan — this course has no lab slot, unlike many other Kỳ 1 subjects.</div>
<p><em>Course description (FLM):</em> This course equips students with knowledge about car structures, including knowledge related to the structure and operating principles of cars. This knowledge will help students understand cars and be helpful in their future work in programming car systems. The module content also introduces software applications in the automotive industry. In addition, the module also equips students with career orientation, soft skills as well as professional ethical foundation, customer care and initial experiences with cars.</p>
<p><em>Nguồn: FLM · Syllabus 14453 · QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026.</em></p>`,
    `<span class="eyebrow">ASI101 · Mục 0 · 0.1 · Hồ sơ môn</span>
<h2>Hồ sơ môn — Nhập môn ô tô (ASI101)</h2>
<p class="lead">Toàn bộ thông tin dưới đây lấy nguyên văn từ <strong>FLM</strong> (hệ thống syllabus của FPTU) để bạn tự đối chiếu.</p>
<table>
<tr><th>Trường</th><th>Giá trị (FLM)</th></tr>
<tr><td>Tên syllabus</td><td>Introduction to Automotive System_Nhập môn ôtô</td></tr>
<tr><td>Tên môn (tiếng Anh)</td><td>Introduction to Automotive System</td></tr>
<tr><td>Mã môn</td><td>ASI101</td></tr>
<tr><td>Số tín chỉ</td><td>3</td></tr>
<tr><td>Bậc học</td><td>Đại học (Bachelor)</td></tr>
<tr><td>Phân bổ thời gian</td><td>150 giờ học = 45 giờ lên lớp + 1 giờ thi cuối kỳ + 104 giờ tự học</td></tr>
<tr><td>Môn tiên quyết</td><td>Không có (None)</td></tr>
<tr><td>Phương pháp dạy-học</td><td>Giảng trên lớp, Active Learning, Inquiry-Based Learning, Problem Based Learning, Project based learning</td></tr>
<tr><td>Thang điểm</td><td>10</td></tr>
<tr><td>Điểm trung bình tối thiểu để qua môn</td><td>5</td></tr>
<tr><td>Số quyết định</td><td>1028/QĐ-ĐHFPT ngày 21/08/2026</td></tr>
<tr><td>Syllabus ID</td><td>14453</td></tr>
</table>
<div class="callout"><span class="badge">Tự kiểm chứng</span> Mọi con số trên lấy nguyên văn từ FLM — Syllabus ID <strong>14453</strong>, ban hành theo Quyết định <strong>1028/QĐ-ĐHFPT ngày 21/08/2026</strong>. Bản gốc: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=14453" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=14453)</a>.</div>
<div class="callout warn"><span class="badge">⚠️ Không công bố số buổi</span> "Time Allocation" chỉ ghi số giờ, không ghi số buổi. Bảng đủ 60 buổi (mục 0.5) cho thấy 45 giờ lên lớp chia trên <strong>60 buổi</strong> — khoảng <strong>45 phút/buổi</strong>. FLM không ghi rõ phép chia này; đây là con số chúng tôi tự tính từ hai số đã công bố, không phải số trường chốt.</div>
<div class="callout"><span class="badge">Không có LAB</span> Cả 60 buổi trong kế hoạch FLM đều đánh dấu <strong>"Offline"</strong> ở cột Learning-Teaching Type — môn này không có buổi LAB, khác nhiều môn Kỳ 1 khác.</div>
<p><em>Mô tả môn (FLM, dịch):</em> Môn học trang bị kiến thức về cấu tạo ô tô, bao gồm cấu tạo và nguyên lý hoạt động của xe. Kiến thức này giúp sinh viên hiểu về ô tô và có ích cho công việc lập trình hệ thống xe sau này. Nội dung môn cũng giới thiệu các ứng dụng phần mềm trong ngành ô tô. Ngoài ra, môn học còn trang bị định hướng nghề nghiệp, kỹ năng mềm, nền tảng đạo đức nghề nghiệp, chăm sóc khách hàng và trải nghiệm ban đầu với ô tô.</p>
<p><em>Nguồn: FLM · Syllabus 14453 · QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026.</em></p>`,
  ]]);

const m02 = doc('asi101-0-2-cach-tinh-diem', '0.2 — Grading: 4 items, 100%, final exam 40%|||0.2 — Cách tính điểm: 4 đầu điểm, 100%, thi cuối 40%',
  'Assignment 20% (2 lần) + Presentation 20% + Progress test 20% (2 lần) + Final exam 40% = 100%. Thi cuối 60 phút, 60 câu trắc nghiệm, tiêu chí đạt 4. Nhiều chỗ FLM để trống/gõ sai/lệch nhau — nêu đủ, KHÔNG tự sửa.',
  [[
    `<span class="eyebrow">ASI101 · Section 0 · 0.2 · Grading</span>
<h2>Grading breakdown — 4 items, total 100%</h2>
<table>
<tr><th>#</th><th>Category (FLM)</th><th>Type</th><th>Part</th><th>Weight</th><th>Completion</th><th>Duration (FLM, verbatim)</th><th>CLO (grading table, verbatim)</th></tr>
<tr><td>1</td><td>Assignment</td><td>on-going</td><td>2</td><td>20%</td><td>&gt;0</td><td>see callout below</td><td>CLO1, CLO2, CLO5, CLO7</td></tr>
<tr><td>2</td><td>Presentation</td><td>on-going</td><td>1</td><td>20%</td><td>&gt;0</td><td>15-20'</td><td><strong>CLOS 1-7</strong> (sic — extra "S")</td></tr>
<tr><td>3</td><td>Progress test</td><td>on-going</td><td>2</td><td>20%</td><td>&gt;0</td><td>see callout below</td><td>Test 1: CLO1, CLO2, CLO3, CLO4, <strong>C LO5</strong> (sic), CLO6 &middot; Test 2: CLO1, CLO2, CLO3</td></tr>
<tr><td>4</td><td>Final exam</td><td>Final exam</td><td>1</td><td>40%</td><td>4 (pass mark)</td><td>60'/each &middot; 60 questions, multiple choice</td><td><em>left blank in the source table</em></td></tr>
</table>
<p><strong>Total: 20% + 20% + 20% + 40% = 100%.</strong></p>
<div class="callout warn"><span class="badge">⚠️ CLO of Final exam is BLANK</span> The Final exam is 40% of the grade and its Knowledge &amp; Skill column says "All subjects in syllabus" — but the CLO column is left empty in the FLM table. We report this as published; we did <strong>not</strong> invent "CLO1-7" to fill the gap.</div>
<div class="callout warn"><span class="badge">⚠️ Two typos in the CLO column, kept as-is</span> Presentation's CLO reads <strong>"CLOS 1-7"</strong> (an extra letter "S"). Progress test's CLO for Test 1 reads <strong>"CLO4,C LO5"</strong> — a stray space lands between "C" and "LO5". We reproduce the raw text; do not read either as a different CLO set.</div>
<div class="callout warn"><span class="badge">⚠️ CLO mismatch between the grading table and the 60-session plan</span> The grading table says Test 1 = CLO1-CLO6 and Test 2 = CLO1,CLO2,CLO3. But the session plan (section 0.5) tags session 30 (Progress Test 1) with CLO1,CLO2,CLO3 and session 54 (Progress Test 2) with CLO1,CLO2,CLO4,CLO6 — almost the reverse assignment. The two FLM tables disagree with each other; we did not pick a "correct" one or merge them.</div>
<div class="callout warn"><span class="badge">⚠️ Duration / No. Question columns are unresolved options, not one number</span> The raw FLM cell for both Assignment and Progress test Duration/No. Question literally contains: <em>"Option 1: 30'/each Option 2 (For Constructivism Approach only): Follow lecturer's proposal"</em> — including a stray closing quote mark and a TAB character embedded in the source. FLM does not commit to one single duration/question count; it is left to the instructor's chosen teaching approach.</div>
<div class="callout"><span class="badge">Assignment 2's brief, verbatim</span> The Knowledge &amp; Skill column names Assignment 2 explicitly: <strong>"Simulate Ackermann Kinematic Model with Steering Angle Constraints"</strong> — a Matlab simulation task, matching Tools = "Internet ; Matlab simulation online" and session 6's "2.9 Introduction to Matlab Simulation Tool".</div>
<div class="callout warn"><span class="badge">⚠️ "Project Presentation" vs the grading table</span> Sessions 58-60 are titled "Project Presentation" in the session plan, but the grading table has <strong>no item named "Project"</strong> — the closest match is "Presentation" (20%). We flag the naming gap; we do not assume they are the same grade item.</div>
<div class="callout"><span class="badge">Two rounds each</span> Assignment has Part=2 and Progress test has Part=2 in the FLM table — each of those two grade items is split into <strong>two rounds</strong>: Assignment 1 (sessions 19-20) + Assignment 2 (sessions 35-36); Progress Test 1 (session 30) + Progress Test 2 (session 54). Each round is roughly worth half of the item's 20%, i.e. ~10%.</div>
<p><em>Nguồn: FLM · Syllabus 14453 · QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026.</em></p>`,
    `<span class="eyebrow">ASI101 · Mục 0 · 0.2 · Cách tính điểm</span>
<h2>Cách tính điểm — 4 đầu điểm, tổng 100%</h2>
<table>
<tr><th>#</th><th>Đầu điểm (FLM)</th><th>Dạng</th><th>Số lần</th><th>Trọng số</th><th>Tiêu chí đạt</th><th>Thời lượng (nguyên văn FLM)</th><th>CLO (bảng điểm, nguyên văn)</th></tr>
<tr><td>1</td><td>Assignment</td><td>xuyên suốt (on-going)</td><td>2</td><td>20%</td><td>&gt;0</td><td>xem callout dưới</td><td>CLO1, CLO2, CLO5, CLO7</td></tr>
<tr><td>2</td><td>Presentation</td><td>xuyên suốt (on-going)</td><td>1</td><td>20%</td><td>&gt;0</td><td>15-20'</td><td><strong>CLOS 1-7</strong> (nguyên văn — thừa chữ "S")</td></tr>
<tr><td>3</td><td>Progress test</td><td>xuyên suốt (on-going)</td><td>2</td><td>20%</td><td>&gt;0</td><td>xem callout dưới</td><td>Test 1: CLO1, CLO2, CLO3, CLO4, <strong>C LO5</strong> (nguyên văn), CLO6 &middot; Test 2: CLO1, CLO2, CLO3</td></tr>
<tr><td>4</td><td>Final exam</td><td>thi cuối kỳ</td><td>1</td><td>40%</td><td>4 (điểm đạt)</td><td>60 phút/lần &middot; 60 câu trắc nghiệm</td><td><em>bảng gốc để trống</em></td></tr>
</table>
<p><strong>Tổng: 20% + 20% + 20% + 40% = 100%.</strong></p>
<div class="callout warn"><span class="badge">⚠️ CLO của Final exam để TRỐNG</span> Final exam chiếm 40% điểm và cột Knowledge &amp; Skill ghi "All subjects in syllabus" — nhưng cột CLO trong bảng lại để trống. Chúng tôi nêu đúng như trường công bố; <strong>không tự bịa</strong> "CLO1-7" để lấp chỗ trống.</div>
<div class="callout warn"><span class="badge">⚠️ Hai lỗi gõ trong cột CLO, giữ nguyên</span> CLO của Presentation ghi <strong>"CLOS 1-7"</strong> (thừa chữ "S"). CLO của Test 1 (Progress test) ghi <strong>"CLO4,C LO5"</strong> — một dấu cách lọt vào giữa "C" và "LO5". Chúng tôi giữ nguyên văn; đừng đọc đó thành một tập CLO khác.</div>
<div class="callout warn"><span class="badge">⚠️ Lệch CLO giữa bảng điểm và kế hoạch buổi</span> Bảng điểm ghi Test 1 = CLO1-CLO6 và Test 2 = CLO1,CLO2,CLO3. Nhưng kế hoạch buổi (mục 0.5) lại gắn buổi 30 (Progress Test 1) với CLO1,CLO2,CLO3 và buổi 54 (Progress Test 2) với CLO1,CLO2,CLO4,CLO6 — gần như đổi chỗ. Hai bảng của chính FLM nói trái nhau; chúng tôi không tự chọn bảng nào "đúng hơn" hay gộp lại.</div>
<div class="callout warn"><span class="badge">⚠️ Ô Duration / No. Question là các lựa chọn chưa chốt, không phải một con số</span> Ô gốc của cả Assignment lẫn Progress test ghi nguyên văn: <em>"Option 1: 30'/each Option 2 (For Constructivism Approach only): Follow lecturer's proposal"</em> — kèm một dấu ngoặc kép lạc và một ký tự TAB trong bản gốc. FLM không chốt một thời lượng/số câu duy nhất — tuỳ cách tiếp cận giảng viên chọn.</div>
<div class="callout"><span class="badge">Đề Assignment 2, nguyên văn</span> Cột Knowledge &amp; Skill ghi rõ đề Assignment 2: <strong>"Simulate Ackermann Kinematic Model with Steering Angle Constraints"</strong> — mô phỏng bằng Matlab, khớp với Tools = "Internet ; Matlab simulation online" và mục "2.9 Introduction to Matlab Simulation Tool" ở buổi 6.</div>
<div class="callout warn"><span class="badge">⚠️ "Project Presentation" so với bảng điểm</span> Buổi 58-60 mang tên "Project Presentation" trong kế hoạch buổi, nhưng bảng điểm <strong>không có đầu điểm nào tên "Project"</strong> — gần nhất là "Presentation" (20%). Chúng tôi nêu chỗ chưa khớp tên, không tự suy đó là cùng một đầu điểm.</div>
<div class="callout"><span class="badge">Mỗi đầu điểm 2 lần</span> Assignment có Part=2 và Progress test có Part=2 trong bảng FLM ⇒ mỗi đầu điểm này gồm <strong>hai lần</strong>: Assignment 1 (buổi 19-20) + Assignment 2 (buổi 35-36); Progress Test 1 (buổi 30) + Progress Test 2 (buổi 54). Mỗi lần chiếm khoảng một nửa của 20%, tức ~10%.</div>
<p><em>Nguồn: FLM · Syllabus 14453 · QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026.</em></p>`,
  ]]);

const m03 = doc('asi101-0-3-clo', '0.3 — Course Learning Outcomes (7 CLO)|||0.3 — Chuẩn đầu ra môn học (7 CLO)',
  'Nguyên văn 7 CLO tiếng Anh + bản dịch, kèm ánh xạ CLO ↔ buổi. ⚠️ Buổi 1 gắn CLO2, CLO6 mà không gắn CLO1.',
  [[
    `<span class="eyebrow">ASI101 · Section 0 · 0.3 · CLO</span>
<h2>Course Learning Outcomes — 7 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Detail (nguyên văn FLM)</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand the basic structures of vehicles (explain the basic components and functions of the main systems in vehicles).</td></tr>
<tr><td>2</td><td>CLO2</td><td>Describe in detail the structure and operating principles of the main systems.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Understand the global electric vehicle market and development trends.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Understand and describe the role of software applications in the automotive industry.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Be able to simulate basic vehicle systems and evaluate performance metrics.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Understand and apply legal standards and requirements related to automobiles.</td></tr>
<tr><td>7</td><td>CLO7</td><td>Be able to develop essential soft skills, including teamwork, communication, and problem-solving.</td></tr>
</table>
<div class="callout"><span class="badge">CLO ↔ session map (from the 60-session plan)</span>
<ul>
<li><strong>CLO1 + CLO2</strong> — the backbone tag for almost every technical session, 4-53 (vehicle structure &amp; how each system works).</li>
<li><strong>CLO6</strong> — legal/standards, tagged on sessions 1-3 (market/OEM) and 43-53 (software architecture).</li>
<li><strong>CLO3</strong> — global EV/market trends, tagged on session 30 (per the session plan) and 39-53.</li>
<li><strong>CLO4</strong> — software's role, tagged on sessions 45-54.</li>
<li><strong>CLO5 + CLO7</strong> — simulation and soft skills, tagged ONLY on the two Assignment blocks (sessions 19-20, 35-36).</li>
</ul></div>
<div class="callout warn"><span class="badge">⚠️ Session 1 skips CLO1</span> Session 1 ("Automobile Evaluation and Market Review") is tagged CLO2, CLO6 — <strong>not CLO1</strong>, even though CLO1 is literally "understand the basic structure of vehicles". We report the tag as published; this may simply be because session 1 is market history, not structure yet, but FLM does not explain the gap.</div>
<p><em>Nguồn: FLM · Syllabus 14453.</em></p>`,
    `<span class="eyebrow">ASI101 · Mục 0 · 0.3 · Chuẩn đầu ra</span>
<h2>Chuẩn đầu ra môn học — 7 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Nội dung (nguyên văn FLM)</th><th>Bản dịch</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand the basic structures of vehicles (explain the basic components and functions of the main systems in vehicles).</td><td>Hiểu cấu tạo cơ bản của xe (giải thích các bộ phận cơ bản &amp; chức năng của các hệ chính trên xe).</td></tr>
<tr><td>2</td><td>CLO2</td><td>Describe in detail the structure and operating principles of the main systems.</td><td>Mô tả chi tiết cấu tạo &amp; nguyên lý hoạt động của các hệ chính.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Understand the global electric vehicle market and development trends.</td><td>Hiểu thị trường xe điện toàn cầu &amp; xu hướng phát triển.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Understand and describe the role of software applications in the automotive industry.</td><td>Hiểu &amp; mô tả vai trò của ứng dụng phần mềm trong ngành ô tô.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Be able to simulate basic vehicle systems and evaluate performance metrics.</td><td>Mô phỏng được các hệ thống cơ bản trên xe &amp; đánh giá chỉ số hiệu năng.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Understand and apply legal standards and requirements related to automobiles.</td><td>Hiểu &amp; áp dụng tiêu chuẩn, yêu cầu pháp lý liên quan tới ô tô.</td></tr>
<tr><td>7</td><td>CLO7</td><td>Be able to develop essential soft skills, including teamwork, communication, and problem-solving.</td><td>Phát triển kỹ năng mềm thiết yếu: làm việc nhóm, giao tiếp, giải quyết vấn đề.</td></tr>
</table>
<div class="callout"><span class="badge">Ánh xạ CLO ↔ buổi (từ kế hoạch 60 buổi)</span>
<ul>
<li><strong>CLO1 + CLO2</strong> — cặp cốt lõi ở gần như mọi buổi kỹ thuật, 4-53 (cấu tạo &amp; nguyên lý hoạt động từng hệ).</li>
<li><strong>CLO6</strong> — pháp lý/tiêu chuẩn, gắn ở buổi 1-3 (thị trường/OEM) và 43-53 (kiến trúc phần mềm).</li>
<li><strong>CLO3</strong> — thị trường/xu hướng EV toàn cầu, gắn ở buổi 30 (theo kế hoạch buổi) và 39-53.</li>
<li><strong>CLO4</strong> — vai trò phần mềm, gắn ở buổi 45-54.</li>
<li><strong>CLO5 + CLO7</strong> — mô phỏng &amp; kỹ năng mềm, CHỈ gắn ở hai cụm Assignment (buổi 19-20, 35-36).</li>
</ul></div>
<div class="callout warn"><span class="badge">⚠️ Buổi 1 không gắn CLO1</span> Buổi 1 ("Automobile Evaluation and Market Review") chỉ gắn CLO2, CLO6 — <strong>không có CLO1</strong>, dù CLO1 chính là "hiểu cấu tạo cơ bản của xe". Chúng tôi nêu đúng nhãn đã công bố; có thể vì buổi 1 mới là lịch sử thị trường chứ chưa vào cấu tạo, nhưng FLM không giải thích chỗ thiếu này.</div>
<p><em>Nguồn: FLM · Syllabus 14453.</em></p>`,
  ]]);

const m04 = doc('asi101-0-0-tai-lieu', '0.4 — Course materials & tools (3 books)|||0.4 — Giáo trình & công cụ (3 giáo trình)',
  '3 giáo trình FLM dạng thẻ sách, cả ba Is Online=False nên KHÔNG có link (khong-link). Công cụ: Internet + Matlab simulation online. Giáo trình chính là sách Ấn Độ — cảnh báo phần pháp lý CMVR/MVA KHÔNG phải luật Việt Nam.',
  [[
    `<span class="eyebrow">ASI101 · Section 0 · 0.4 · Materials &amp; tools</span>
<h2>Course materials &amp; tools</h2>
<p class="lead">All <strong>3</strong> official FLM materials for ASI101. The <strong>main material</strong> (Is Main Material = True) is the Awari/Kumbhar/Tirpude textbook; the other two are reference textbooks used later in the plan (see 0.5).</p>
` + sachChinh + `
` + sachRef01 + `
` + sachRef02 + `
<div class="callout warn"><span class="badge">⚠️⚠️ The main textbook is an INDIAN book</span> All three materials on FLM report "Is Online = False" — there is no URL for any of them, only the printed edition. More importantly: the main textbook (Awari/Kumbhar/Tirpude, CRC Press) is written for the <strong>Indian</strong> automotive market. Chapter 1 covers "Indian Automotive Market" and "Indian and Global OEMs" (sessions 1-3), and session 5 teaches vehicle legal terminology "as per <strong>CMVR and MVA</strong>" — the Central Motor Vehicle Rules and Motor Vehicles Act of <strong>India</strong>. These are <strong>NOT Vietnamese law</strong>. We flag this explicitly in Lesson 1.2 so nobody studies CMVR/MVA thinking it applies in Vietnam.</div>
<h3>Tools (FLM, verbatim)</h3>
<p><strong>Internet ; Matlab simulation online</strong> — session 6 introduces "2.9 Introduction to Matlab Simulation Tool", and Matlab is used again for Assignment 2 (sessions 35-36, simulating the Ackermann steering model).</p>
<div class="callout"><span class="badge">⚠️ FLM has slides &amp; an assignment file we cannot mirror here</span> The S-Download column of the session plan lists two files: <strong>ASI101_Slide</strong> and <strong>ASI101_Assignment</strong> — so the school DOES publish its own slide deck and assignment brief, but only downloadable from inside FLM (you must sign in with your FPTU account). We do not have a copy of those files, and the URLs column for all 60 sessions is empty (no external link either).</div>
<p><em>Nguồn: FLM · Syllabus 14453.</em></p>`,
    `<span class="eyebrow">ASI101 · Mục 0 · 0.4 · Giáo trình &amp; công cụ</span>
<h2>Giáo trình &amp; công cụ</h2>
<p class="lead">Đủ <strong>3</strong> tài liệu chính thức của FLM cho ASI101. Tài liệu <strong>chính</strong> (Is Main Material = True) là sách của Awari/Kumbhar/Tirpude; hai tài liệu còn lại là sách tham khảo dùng ở nửa sau kế hoạch (xem mục 0.5).</p>
` + sachChinh + `
` + sachRef01 + `
` + sachRef02 + `
<div class="callout warn"><span class="badge">⚠️⚠️ Giáo trình chính là sách ẤN ĐỘ</span> Cả 3 tài liệu trên FLM đều ghi "Is Online = False" — không có link, chỉ có bản in. Quan trọng hơn: giáo trình chính (Awari/Kumbhar/Tirpude, CRC Press) viết cho thị trường ô tô <strong>Ấn Độ</strong>. Chương 1 dạy "Indian Automotive Market" và "Indian and Global OEMs" (buổi 1-3), và buổi 5 dạy thuật ngữ pháp lý xe "theo <strong>CMVR và MVA</strong>" — Central Motor Vehicle Rules và Motor Vehicles Act của <strong>Ấn Độ</strong>. Đây <strong>KHÔNG phải luật Việt Nam</strong>. Chúng tôi nêu rõ điều này ngay trong Bài 1.2 để không ai học CMVR/MVA rồi tưởng áp dụng được ở Việt Nam.</div>
<h3>Công cụ (nguyên văn FLM)</h3>
<p><strong>Internet ; Matlab simulation online</strong> — buổi 6 có mục "2.9 Introduction to Matlab Simulation Tool", và Matlab dùng lại ở Assignment 2 (buổi 35-36, mô phỏng mô hình lái Ackermann).</p>
<div class="callout"><span class="badge">⚠️ FLM có slide &amp; file đề bài riêng, web không có bản để soi lại</span> Cột S-Download của kế hoạch buổi liệt kê hai file: <strong>ASI101_Slide</strong> và <strong>ASI101_Assignment</strong> — vậy là trường CÓ slide bài giảng &amp; đề bài tập riêng, nhưng chỉ tải được từ trong FLM (phải đăng nhập tài khoản FPTU). Chúng tôi không có bản sao hai file này, và cột URLs của cả 60 buổi đều trống (cũng không có link ngoài nào khác).</div>
<p><em>Nguồn: FLM · Syllabus 14453.</em></p>`,
  ]]);

const m06 = doc('asi101-0-6-nhiem-vu-sinh-vien', '0.6 — Student tasks (verbatim)|||0.6 — Nhiệm vụ sinh viên (nguyên văn)',
  'Nguyên văn nhiệm vụ sinh viên theo FLM (StudentTasks): dự lớp ≥80%, tự làm & nộp đúng hạn mọi bài tập, theo dõi LMS thường xuyên.',
  [[
    `<span class="eyebrow">ASI101 · Section 0 · 0.6 · Student tasks</span>
<h2>Student tasks (FLM, verbatim)</h2>
<ul>
<li>Students must attend at least 80% of contact slots in order to be accepted to the final examination.</li>
<li>Student is responsible to do all exercises given by instructor in class or at home and submit on time.</li>
<li>Constantly follow announcements on LMS at <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> for up-to-date course information regarding assignment submission and feedback on assignments and project work.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 14453.</em></p>`,
    `<span class="eyebrow">ASI101 · Mục 0 · 0.6 · Nhiệm vụ sinh viên</span>
<h2>Nhiệm vụ sinh viên (nguyên văn FLM, dịch)</h2>
<ul>
<li>Sinh viên phải dự lớp tối thiểu 80% số buổi mới đủ điều kiện dự thi cuối kỳ.</li>
<li>Sinh viên có trách nhiệm tự làm mọi bài tập giảng viên giao tại lớp hoặc ở nhà và nộp đúng hạn.</li>
<li>Theo dõi thường xuyên thông báo trên LMS tại <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> để cập nhật thông tin môn học, hạn nộp bài tập &amp; phản hồi cho bài tập/đồ án.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 14453.</em></p>`,
  ]]);

// ── 0.5 — Kế hoạch 60 buổi: dựng bằng nối chuỗi thường (KHÔNG template lồng) ──
const buoiData = [
  [1, '1. Automobile Evaluation and Market Review 1.1 Introduction 1.2 History and Evolution of Vehicles', '1. Đánh giá ô tô &amp; tổng quan thị trường — 1.1 Giới thiệu — 1.2 Lịch sử &amp; tiến hoá ô tô', 'CLO2, CLO6 (⚠️ không có CLO1, xem 0.3)', '1.1'],
  [2, '1.3 Indian Automotive Market 1.4 Global Automotive Market', '1.3 Thị trường ô tô Ấn Độ — 1.4 Thị trường ô tô toàn cầu', 'CLO2, CLO6', '1.1'],
  [3, '1.5 Automotive Research Perspectives 1.6 Indian and Global OEMs 1.7 Indian and Global Auto Components Manufacturers', '1.5 Góc nhìn nghiên cứu ô tô — 1.6 OEM Ấn Độ &amp; toàn cầu — 1.7 Nhà sản xuất phụ tùng Ấn Độ &amp; toàn cầu', 'CLO2, CLO6', '1.1'],
  [4, '2. Vehicle Classification, Structure and Layouts 2.1 Introduction 2.2 Classification of Vehicles', '2. Phân loại, cấu trúc &amp; bố trí xe — 2.1 Giới thiệu — 2.2 Phân loại xe', 'CLO1, CLO2', '1.2'],
  [5, '2.3 Constructional Details of Vehicle Chassis and Body 2.4 Terminology and Legislative Requirements of a Vehicle as per CMVR and MVA 2.5 Various Systems of the Vehicle and Their Functions', '2.3 Chi tiết cấu tạo khung &amp; thân xe — 2.4 Thuật ngữ &amp; yêu cầu pháp lý xe theo CMVR &amp; MVA (⚠️ luật Ấn Độ) — 2.5 Các hệ thống trên xe &amp; chức năng', 'CLO1, CLO2', '1.2'],
  [6, '2.6 Various Systems of the Vehicle and Their Functions; Various Types of Chassis Frames: Their Construction and Material 2.7 Various Loads Acting on the Vehicle Chassis Frame, and Its Deformation 2.8 Types of Chassis and Vehicle Layouts, Advantages and Disadvantages 2.9 Introduction to Matlab Simulation Tool', '2.6 Các hệ thống trên xe (tiếp); các loại khung chassis: kết cấu &amp; vật liệu — 2.7 Các loại tải trọng tác động lên khung chassis &amp; biến dạng — 2.8 Các kiểu chassis &amp; bố trí xe, ưu/nhược điểm — 2.9 Giới thiệu công cụ mô phỏng Matlab', 'CLO1, CLO2', '1.2'],
  [7, '3. Vehicular Engines 3.1 Introduction 3.2 Working Principle and Terminology of the Engine 3.3 Components of the IC Engine and Their Constructional Details 3.4 Classification of IC Engines 3.5 Two-Stroke and Four-Stroke Engines', '3. Động cơ ô tô — 3.1 Giới thiệu — 3.2 Nguyên lý &amp; thuật ngữ động cơ — 3.3 Bộ phận động cơ đốt trong &amp; cấu tạo — 3.4 Phân loại động cơ đốt trong — 3.5 Động cơ 2 kỳ &amp; 4 kỳ', 'CLO1, CLO2', '2.1'],
  [8, '3.6 Comparison of Engines 3.7 Selection of Engine as Per Functional Requirement 3.8 Fuel Supply System for SI Engines: General Layout and Components 3.9 Principles of Carburetion and Fuel Injection in SI Engines 3.10 Types of Carburettors and Their Constructional Details', '3.6 So sánh các loại động cơ — 3.7 Chọn động cơ theo yêu cầu chức năng — 3.8 Hệ cấp nhiên liệu động cơ SI: sơ đồ &amp; bộ phận — 3.9 Nguyên lý chế hoà khí &amp; phun nhiên liệu ở động cơ SI — 3.10 Các loại bộ chế hoà khí &amp; cấu tạo', 'CLO1, CLO2', '2.1'],
  [9, "3.11 Continuous and Timed Injection System 3.12 Single-Point TBI and MPFI Systems 3.13 Fuel Supply System for CI Engine: General Layout and Components 3.14 TDI and CRDI System 3.15 Types of Fuel Injection Pumps and Their Constructional", '3.11 Hệ phun liên tục &amp; phun định thời — 3.12 Hệ TBI một điểm &amp; MPFI — 3.13 Hệ cấp nhiên liệu động cơ CI: sơ đồ &amp; bộ phận — 3.14 Hệ TDI &amp; CRDI — 3.15 Các loại bơm phun nhiên liệu &amp; cấu tạo', 'CLO1, CLO2', '2.2'],
  [10, '3.16 Fuel Injectors and Nozzles 3.17 Electronically Controlled Unit Fuel Injection System 3.18 Injection Timing and Its Importance 3.19 Spray Characteristics 3.20 Principles of Lubrication Systems', '3.16 Kim phun &amp; vòi phun nhiên liệu — 3.17 Hệ phun nhiên liệu điều khiển điện tử — 3.18 Thời điểm phun &amp; tầm quan trọng — 3.19 Đặc tính tia phun — 3.20 Nguyên lý hệ bôi trơn', 'CLO1, CLO2', '2.2'],
  [11, '3.21 Friction and Wear Mechanics 3.22 Lubricants: Their Composition and Properties 3.23 Wet Sump Lubrication Device 3.24 Dry Sump Lubrication System 3.25 Mist Lubrication System', '3.21 Cơ chế ma sát &amp; mài mòn — 3.22 Dầu bôi trơn: thành phần &amp; tính chất — 3.23 Bôi trơn các-te ướt — 3.24 Bôi trơn các-te khô — 3.25 Bôi trơn kiểu sương dầu', 'CLO1, CLO2', '2.3'],
  [12, '3.26 Principles of Cooling System 3.27 Liquid Cooling System 3.28 Air Cooling System 3.29 Current Advancements in Cooling Systems 3.30 Principles of Air Intake and Exhaust 3.40 Engine Electronics and Management System', '3.26 Nguyên lý hệ làm mát — 3.27 Làm mát bằng chất lỏng — 3.28 Làm mát bằng không khí — 3.29 Tiến bộ trong làm mát — 3.30 Nguyên lý nạp khí &amp; xả — 3.40 Điện tử &amp; hệ quản lý động cơ', 'CLO1, CLO2', '2.3'],
  [13, '4. Automotive Clutches 4.1 Introduction 4.2 Necessity and Functions of the Clutch 4.3 Working Principle of the Clutch 4.4 Classification of Clutches 4.5 Requirements of the Clutch 4.6 Torque Transmission Capacity of the Clutch', '4. Ly hợp ô tô — 4.1 Giới thiệu — 4.2 Sự cần thiết &amp; chức năng ly hợp — 4.3 Nguyên lý làm việc — 4.4 Phân loại ly hợp — 4.5 Yêu cầu đối với ly hợp — 4.6 Khả năng truyền mô-men', 'CLO1, CLO2', '3.1'],
  [14, '4.7 Construction and Working of the Single Plate Clutch Construction Diaphragm Clutch 4.8 Construction and Working of the Multi-Plate Clutch 4.9 Construction and Working of the Centrifugal Clutch Centrifugally Operated Clutches', '4.7 Cấu tạo &amp; hoạt động ly hợp đĩa đơn, ly hợp lò xo đĩa (diaphragm) — 4.8 Ly hợp đa đĩa — 4.9 Ly hợp ly tâm', 'CLO1, CLO2', '3.2'],
  [15, '4.10 Construction and Working of Electromagnetic Clutch 4.11 Operating Mechanism of the Clutch 4.12 Operating Mechanism of the Clutch: Hydraulic 4.13 Design Aspects of the Automotive Clutch', '4.10 Ly hợp điện từ — 4.11 Cơ cấu vận hành ly hợp — 4.12 Cơ cấu vận hành kiểu thuỷ lực — 4.13 Khía cạnh thiết kế ly hợp ô tô', 'CLO1, CLO2', '3.2'],
  [16, '5. Manual Transmission and Transaxles 5.1 Introduction 5.2 Various Types of Resistances 5.3 Motive Power, Traction and Tractive Efforts 5.4 Necessity of the Gear Box', '5. Hộp số sàn &amp; transaxle — 5.1 Giới thiệu — 5.2 Các loại lực cản chuyển động — 5.3 Công suất kéo, lực bám &amp; lực kéo — 5.4 Sự cần thiết của hộp số', 'CLO1, CLO2', '4.1'],
  [17, '5.5 Calculation of Gear Ratios 5.6 Construction and Working of the Constant Mesh Gear Box 5.7 Construction and Working of the Sliding Mesh Gear Box 5.8 Construction and Working of the Synchromesh Gear Box 5.9 Overdrive', '5.5 Tính tỉ số truyền — 5.6 Hộp số ăn khớp thường trực (constant mesh) — 5.7 Hộp số ăn khớp trượt (sliding mesh) — 5.8 Hộp số đồng tốc (synchromesh) — 5.9 Số truyền tăng (overdrive)', 'CLO1, CLO2', '4.2'],
  [18, '5.10 Transfer Box Construction and Working 5.11 Heavy Vehicle Gear Boxes 5.12 Gear Shifting Mechanisms 5.13 Gear Box Lubrication and Sealing 5.14 Transaxle Construction and Working', '5.10 Hộp số phụ (transfer box) — 5.11 Hộp số xe tải nặng — 5.12 Cơ cấu sang số — 5.13 Bôi trơn &amp; làm kín hộp số — 5.14 Cấu tạo &amp; hoạt động transaxle', 'CLO1, CLO2', '4.3'],
  [19, 'Assignment 1', 'Assignment 1 — làm tại lớp, dưới hướng dẫn giảng viên', 'CLO1, CLO2, CLO5, CLO7', '5.1'],
  [20, 'Assignment 1', 'Assignment 1 (tiếp) — làm tại lớp, dưới hướng dẫn giảng viên', 'CLO1, CLO2, CLO5, CLO7', '5.1'],
  [21, '6. Semiautomatic and Automatic Transmission 6.1 Introduction 6.2 Fluid Flywheel 6.2.1 Limitations 6.3 Torque Convertor 6.4 Planetary Gear Box', '6. Hộp số bán tự động &amp; tự động — 6.1 Giới thiệu — 6.2 Bánh đà thuỷ lực, 6.2.1 hạn chế — 6.3 Bộ biến mô (torque converter) — 6.4 Hộp số hành tinh', 'CLO1, CLO2', '6.1'],
  [22, '6.5 Continuous Variable Transmission System 6.6 Automatic Transmission System for Passenger Cars 6.7 Automatic Transaxles 6.8 Automatic Transmission System for Heavy Vehicles 6.9 Hydraulic Control System 6.10 Electrohydraulic Control System 6.11 Automated Manual Transmission System', '6.5 Hộp số vô cấp (CVT) — 6.6 Hộp số tự động cho xe con — 6.7 Automatic transaxle — 6.8 Hộp số tự động cho xe tải nặng — 6.9 Điều khiển thuỷ lực — 6.10 Điều khiển điện-thuỷ lực — 6.11 Hộp số tự động hoá (AMT)', 'CLO1, CLO2', '6.2'],
  [23, '7. Propeller Shaft, Differential and Rear Axles 7.1 Introduction 7.2 Driveline Arrangements 7.3 Propeller Shaft 7.4 Universal Joint 7.5 Slip Joint 7.6 Constant Velocity Joints', '7. Trục các-đăng, vi sai &amp; cầu sau — 7.1 Giới thiệu — 7.2 Bố trí driveline — 7.3 Trục các-đăng — 7.4 Khớp các-đăng — 7.5 Khớp trượt — 7.6 Khớp đồng tốc (CV joint)', 'CLO1, CLO2', '7.1'],
  [24, '7.7 Final Drive Gears and Bearings 7.8 Differential 7.9 Rear Axle Construction 7.10 Types of Rear Axles 7.11 Various Types of Loads Acting on the Rear Axles 7.12 Tandem Axle Drive for Heavy Vehicles', '7.7 Bánh răng &amp; ổ bi truyền lực cuối — 7.8 Vi sai — 7.9 Cấu tạo cầu sau — 7.10 Các loại cầu sau — 7.11 Tải trọng tác động lên cầu sau — 7.12 Dẫn động cầu đôi (tandem axle) cho xe tải nặng', 'CLO1, CLO2', '7.2'],
  [25, '8. Suspension System 8.1 Introduction 8.2 Basic Ride Considerations of the Vehicle 8.3 Functions of the Suspension System 8.4 Classification of the Suspension System 8.5 Independent Suspension System 8.6 Dependent Suspension Systems', '8. Hệ thống treo — 8.1 Giới thiệu — 8.2 Yếu tố êm dịu cơ bản — 8.3 Chức năng hệ treo — 8.4 Phân loại hệ treo — 8.5 Treo độc lập — 8.6 Treo phụ thuộc', 'CLO1, CLO2', '8.1'],
  [26, '8.7 Air Suspension 8.8 Rubber Suspensions 8.9 Types of Springs Used in the Suspension System 8.10 Dampers 8.11 Adaptive Suspension System', '8.7 Treo khí nén — 8.8 Treo cao su — 8.9 Các loại lò xo trong treo — 8.10 Giảm chấn — 8.11 Treo thích ứng', 'CLO1, CLO2', '8.2'],
  [27, '9. Braking Systems 9.1 Introduction 9.2 Classification of Brakes 9.3 Drum Brakes and Disc Brakes 9.4 Hydraulic Braking System Construction and Working', '9. Hệ thống phanh — 9.1 Giới thiệu — 9.2 Phân loại phanh — 9.3 Phanh tang trống &amp; phanh đĩa — 9.4 Cấu tạo &amp; hoạt động hệ phanh thuỷ lực', 'CLO1, CLO2', '8.3'],
  [28, '9.5 Air Brakes 9.5.1 System Actuation 9.6 Antilock Braking Systems 9.7 Parking Brakes', '9.5 Phanh khí nén — 9.5.1 Cơ cấu kích hoạt hệ thống — 9.6 Hệ chống bó cứng phanh (ABS) — 9.7 Phanh tay/đỗ', 'CLO1, CLO2', '8.4'],
  [29, '10. Vehicle Body Engineering 10.1 Introduction 10.2 Functions of the Vehicle Body 10.3 Requirements of the Vehicle Body 10.4 Classification of Vehicle Body 10.5 Car Body Construction', '10. Kỹ thuật thân xe — 10.1 Giới thiệu — 10.2 Chức năng thân xe — 10.3 Yêu cầu đối với thân xe — 10.4 Phân loại thân xe — 10.5 Kết cấu thân xe con', 'CLO1, CLO2', '9.1'],
  [30, 'Progress Test 1', 'Kiểm tra tiến độ 1 (Progress Test 1) — nội dung buổi 1-10', 'CLO1, CLO2, CLO3 (⚠️ lệch với bảng điểm, xem 0.2)', '9.2'],
  [31, '10.6 Bus Body Construction 10.7 Body Mounting 10.8 Body Materials 10.9 Various Loads Acting on the Vehicle Body and 10.10 Anthropometric and Ergonomic Considerations 10.11 Upcoming Trends in Vehicle Body Manufacturing', '10.6 Kết cấu thân xe buýt — 10.7 Gắn thân lên khung — 10.8 Vật liệu thân xe — 10.9 Tải trọng tác động lên thân xe — 10.10 Nhân trắc &amp; công thái học — 10.11 Xu hướng mới trong chế tạo thân xe', 'CLO1, CLO2', '9.3'],
  [32, "11. Front Axle and Steering Systems 11.1 Introduction 11.2 Functions of the Front Axle 11.3 Constructional Details of the Front Axle 11.4 Requirements of Steering 11.5 Principle of Correct Steering 11.6 Ackerman's Steering Gear Mechanism", '11. Cầu trước &amp; hệ thống lái — 11.1 Giới thiệu — 11.2 Chức năng cầu trước — 11.3 Cấu tạo chi tiết cầu trước — 11.4 Yêu cầu đối với hệ lái — 11.5 Nguyên lý lái đúng — 11.6 Cơ cấu lái Ackermann', 'CLO1, CLO2', '10.1'],
  [33, '11.7 Steering Linkage Arrangements 11.8 Axle Beam Suspension Steering System Layout 11.9 Independent Suspension Steering System Layout 11.10 Steering Gear Boxes 11.11 Power-Assisted Steering', '11.7 Bố trí dẫn động lái — 11.8 Bố trí hệ lái với treo dầm cầu — 11.9 Bố trí hệ lái với treo độc lập — 11.10 Hộp cơ cấu lái — 11.11 Trợ lực lái', 'CLO1, CLO2', '10.2'],
  [34, '12. Wheels and Tyres 12.1 Introduction 12.2 Requirements of the Wheel 12.3 Classification of Wheels 12.4 Construction of Wired and Pressed Disc Wheels', '12. Bánh xe &amp; lốp — 12.1 Giới thiệu — 12.2 Yêu cầu đối với bánh xe — 12.3 Phân loại bánh xe — 12.4 Cấu tạo bánh nan hoa &amp; bánh đĩa dập', 'CLO1, CLO2', '10.3'],
  [35, 'Assignment 2', 'Assignment 2 — Mô phỏng mô hình động học Ackermann với ràng buộc góc lái (Matlab)', 'CLO1, CLO2, CLO5, CLO7', '11.1'],
  [36, 'Assignment 2', 'Assignment 2 (tiếp) — làm tại lớp, dưới hướng dẫn giảng viên', 'CLO1, CLO2, CLO5, CLO7', '11.1'],
  [37, '12.5 Types of Rims and Their Constructional Details 12.6 Wheel Alignment and Balancing 12.7 Tyre Characteristics 12.8 Cornering Properties of the Tyre 12.9 Requirements of Tyres', '12.5 Các loại vành &amp; cấu tạo — 12.6 Cân chỉnh &amp; cân bằng bánh xe — 12.7 Đặc tính lốp — 12.8 Đặc tính lốp khi vào cua — 12.9 Yêu cầu đối với lốp', 'CLO1, CLO2', '10.4'],
  [38, '12.10 Classification of Tyres 12.11 Tyre Construction 12.12 Tyre Treads 12.13 Tyre Size and Designations 12.14 Factors Affecting Tyre', '12.10 Phân loại lốp — 12.11 Cấu tạo lốp — 12.12 Gai lốp — 12.13 Ký hiệu &amp; kích cỡ lốp — 12.14 Yếu tố ảnh hưởng tới lốp', 'CLO1, CLO2', '10.5'],
  [39, '13. Hybrid Cars 13.1 Introduction 13.2 History 13.3 Background', '13. Xe hybrid — 13.1 Giới thiệu — 13.2 Lịch sử — 13.3 Bối cảnh', 'CLO1, CLO2, CLO3', '12.1'],
  [40, '13.4 Production of Hybrid Electric Vehicles 13.5 Types of Vehicles 13.5.1 Motorcycles 13.5.2 Automobiles and Light Trucks 13.5.3 Taxis 13.5.4 Buses', '13.4 Sản xuất xe hybrid điện — 13.5 Các loại xe: 13.5.1 xe máy, 13.5.2 ô tô con/tải nhẹ, 13.5.3 taxi, 13.5.4 xe buýt', 'CLO1, CLO2, CLO3', '12.1'],
  [41, '13.5.5 Trucks 13.5.6 Military Vehicles 13.5.7 Locomotives', '13.5.5 Xe tải — 13.5.6 Xe quân sự — 13.5.7 Đầu máy xe lửa', 'CLO1, CLO2, CLO3', '12.2'],
  [42, '14. Autonomous Cars 14.1 Introduction 14.2 Implementable Ethics for Autonomous Vehicles 14.3 Mobility and Autonomous Driving 14.4 Safety Concept for Autonomous Vehicles', '14. Xe tự hành — 14.1 Giới thiệu — 14.2 Đạo đức áp dụng cho xe tự hành — 14.3 Di chuyển &amp; lái tự động — 14.4 Khái niệm an toàn cho xe tự hành', 'CLO1, CLO2, CLO3', '12.3'],
  [43, '15. Introduction to Software and Cars 15.1 Software and Modern Cars 15.2 History of Software in the Automotive Industry 15.3 Trends Shaping Automotive Software Development', '15. Nhập môn phần mềm &amp; ô tô — 15.1 Phần mềm &amp; ô tô hiện đại — 15.2 Lịch sử phần mềm trong ngành ô tô — 15.3 Xu hướng định hình phát triển phần mềm ô tô', 'CLO1, CLO2, CLO6', '13.1'],
  [44, '15.4 Organization of Automotive Software Systems 15.5 Architecting as a Discipline&quot; (⚠️ dấu ngoặc kép lạc ở cuối, giữ nguyên bản gốc)', '15.4 Tổ chức hệ thống phần mềm ô tô — 15.5 Kiến trúc hoá như một kỷ luật (⚠️ bản gốc kết thúc bằng dấu ngoặc kép lạc)', 'CLO1, CLO2, CLO6', '13.2'],
  [45, '16. Software Architectures: Views and Documentation 16.1 Introduction 16.2 Common View on Architecture in General and in the Automotive Industry in Particular 16.3 Definitions', '16. Kiến trúc phần mềm: góc nhìn &amp; tài liệu hoá — 16.1 Giới thiệu — 16.2 Góc nhìn chung về kiến trúc &amp; trong ngành ô tô nói riêng — 16.3 Định nghĩa', 'CLO3, CLO4, CLO6', '13.3'],
  [46, '16.4 High-Level Structures 16.5 Architectural Principles 16.6 Architecture in the Development Process', '16.4 Cấu trúc cấp cao — 16.5 Nguyên lý kiến trúc — 16.6 Kiến trúc trong quy trình phát triển', 'CLO3, CLO4, CLO6', '13.4'],
  [47, '16.7 Architectural Views 16.8 Architectural Styles 16.9 Describing the Architectures', '16.7 Các góc nhìn kiến trúc — 16.8 Phong cách kiến trúc — 16.9 Mô tả kiến trúc', 'CLO3, CLO4, CLO6', '13.5'],
  [48, '17. Automotive Software Development 17.1 Introduction 17.1 Requirements (⚠️ đánh số lặp "17.1", đáng lẽ 17.2 — giữ nguyên bản gốc) 17.3 Variant Management', '17. Phát triển phần mềm ô tô — 17.1 Giới thiệu — 17.1 Yêu cầu (⚠️ bản gốc đánh số lặp "17.1", đáng lẽ 17.2) — 17.3 Quản lý biến thể', 'CLO3, CLO4, CLO6', '14.1'],
  [49, '18. AUTOSAR Standard 18.1 Introduction 18.2 AUTOSAR Reference Architecture', '18. Chuẩn AUTOSAR — 18.1 Giới thiệu — 18.2 Kiến trúc tham chiếu AUTOSAR', 'CLO3, CLO4, CLO6', '14.2'],
  [50, '18.3 AUTOSAR Development Methodology 18.4 AUTOSAR Meta-Model Meta-Model (⚠️ bản gốc gõ lặp chữ "Meta-Model")', '18.3 Phương pháp phát triển AUTOSAR — 18.4 Meta-Model của AUTOSAR (⚠️ bản gốc gõ lặp chữ "Meta-Model")', 'CLO3, CLO4, CLO6', '14.3'],
  [51, '18.3 AUTOSAR Development Methodology 18.4 AUTOSAR Meta-Model Meta-Model (⚠️⚠️ TRÙNG NGUYÊN VĂN buổi 50 — giữ nguyên, xem ghi chú đầu file)', '18.3 Phương pháp phát triển AUTOSAR — 18.4 Meta-Model của AUTOSAR (⚠️⚠️ TRÙNG NGUYÊN VĂN buổi 50 — giữ nguyên, xem ghi chú đầu file)', 'CLO3, CLO4, CLO6', '14.3'],
  [52, '18.5 AUTOSAR ECU Middleware', '18.5 Middleware ECU của AUTOSAR', 'CLO3, CLO4, CLO6', '14.4'],
  [53, '18.6 AUTOSAR Evolution 18.7 Future of AUTOSAR', '18.6 Sự phát triển của AUTOSAR — 18.7 Tương lai của AUTOSAR', 'CLO3, CLO4, CLO6', '14.5'],
  [54, 'Progress Test 2', 'Kiểm tra tiến độ 2 (Progress Test 2) — nội dung buổi 11-18', 'CLO1, CLO2, CLO4, CLO6 (⚠️ lệch với bảng điểm, xem 0.2)', '15.1'],
  [55, 'Final Review', 'Ôn tập cuối kỳ (Final Review)', 'CLOs 1-7', '15.2'],
  [56, 'Final Review', 'Ôn tập cuối kỳ (Final Review)', 'CLOs 1-7', '15.2'],
  [57, 'Final Review', 'Ôn tập cuối kỳ (Final Review)', 'CLOs 1-7', '15.2'],
  [58, 'Project Presentation', 'Thuyết trình đồ án (Project Presentation)', 'CLOs 1-7', '15.3'],
  [59, 'Project Presentation', 'Thuyết trình đồ án (Project Presentation)', 'CLOs 1-7', '15.3'],
  [60, 'Project Presentation', 'Thuyết trình đồ án (Project Presentation)', 'CLOs 1-7', '15.3'],
];
const rowHtml = (r) => '<tr><td>Buổi ' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>';
const buoiRowsHtml = buoiData.map(rowHtml).join('');
const buoiTableEn =
  '<table><tr><th>Session</th><th>Topic (English, verbatim FLM)</th><th>Chủ đề (Việt)</th><th>CLO</th><th>Lesson on site</th></tr>' +
  buoiRowsHtml + '</table>';
const buoiTableVi =
  '<table><tr><th>Buổi</th><th>Chủ đề (Anh, nguyên văn FLM)</th><th>Chủ đề (Việt)</th><th>CLO</th><th>Bài trên web</th></tr>' +
  buoiRowsHtml + '</table>';

const m05 = doc('asi101-0-5-ke-hoach-60-buoi', '0.5 — Full 60-session plan|||0.5 — Kế hoạch đủ 60 buổi',
  'Bảng đầy đủ 60 buổi FLM, giữ nguyên chủ đề tiếng Anh + thêm cột tiếng Việt + cột "Bài trên web". Đánh dấu buổi 50&51 trùng nguyên văn, buổi 48 đánh số 17.1 hai lần, buổi 44 dấu ngoặc kép lạc, buổi 1 thiếu CLO1.',
  [[
    '<span class="eyebrow">ASI101 · Section 0 · 0.5 · 60-session plan</span>' +
    '<h2>Full 60-session plan (FLM, verbatim topics)</h2>' +
    '<p class="lead">All 45 contact hours (60 sessions) exactly as scheduled by FLM. The last column shows which lesson on this site covers each session — Chapter 1 (sessions 1-6) is fully taught; Chapters 2-15 are a framework (skeleton) for now.</p>' +
    buoiTableEn +
    '<div class="callout warn"><span class="badge">⚠️ Kept as FLM published it</span><p>Sessions <strong>50 and 51</strong> are word-for-word identical ("18.3 AUTOSAR Development Methodology 18.4 AUTOSAR Meta-Model Meta-Model", itself a typo with "Meta-Model" doubled). Session <strong>48</strong> numbers a sub-item "17.1" twice (Introduction, then Requirements — the second should likely be "17.2"). Session <strong>44</strong> ends with a stray closing quote mark in the raw table. Session <strong>1</strong> is tagged CLO2, CLO6 without CLO1. We report all four exactly as published rather than silently correcting them.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 14453 · thu thập 20/09/2026.</em></p>',
    '<span class="eyebrow">ASI101 · Mục 0 · 0.5 · Kế hoạch 60 buổi</span>' +
    '<h2>Kế hoạch đủ 60 buổi (nguyên văn chủ đề FLM)</h2>' +
    '<p class="lead">Đủ 45 giờ lên lớp (60 buổi) đúng như FLM xếp lịch. Cột cuối cho biết bài nào trên web phủ buổi đó — Chương 1 (buổi 1-6) dạy đầy đủ; Chương 2-15 hiện là khung, sẽ bổ sung chi tiết sau.</p>' +
    buoiTableVi +
    '<div class="callout warn"><span class="badge">⚠️ Giữ nguyên như FLM công bố</span><p>Buổi <strong>50 và 51</strong> giống hệt nhau từng chữ ("18.3 AUTOSAR Development Methodology 18.4 AUTOSAR Meta-Model Meta-Model" — chính câu này còn gõ lặp "Meta-Model"). Buổi <strong>48</strong> đánh số một mục con là "17.1" tới hai lần (Introduction rồi Requirements — mục sau lẽ ra là "17.2"). Buổi <strong>44</strong> kết thúc bằng một dấu ngoặc kép lạc trong bảng gốc. Buổi <strong>1</strong> chỉ gắn CLO2, CLO6, không có CLO1. Chúng tôi nêu đúng cả bốn điểm này như trường công bố, không tự sửa.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 14453 · thu thập 20/09/2026.</em></p>',
  ]]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1-6): Thị trường ô tô + Phân loại, cấu trúc, bố
// trí xe. Dạy được ngay, song ngữ, bảng so sánh (KHÔNG dùng ảnh), ví dụ xe
// thật, lỗi hay nhầm, bài tập + lời giải. Kết chương bằng quiz.
// ─────────────────────────────────────────────────────────────────────────

const l11 = doc('asi101-1-1-thi-truong-oto', '1.1 — Automobile evaluation & the automotive market|||1.1 — Đánh giá ô tô & thị trường ô tô',
  'Buổi 1-3, CLO2/CLO6. Lịch sử & tiến hoá xe; thị trường ô tô Ấn Độ & toàn cầu; OEM và nhà sản xuất phụ tùng; góc nhìn nghiên cứu. Bổ sung bối cảnh Việt Nam (VinFast, THACO, TC Motor).',
  [[
    `<span class="eyebrow">ASI101 · Chapter 1 · Lesson 1.1 · Session 1-3 · CLO2, CLO6</span>
<h2>Automobile evaluation &amp; the automotive market</h2>
<p class="lead">FLM topics (sessions 1-3): <em>"1. Automobile Evaluation and Market Review — 1.1 Introduction, 1.2 History and Evolution of Vehicles"</em>, <em>"1.3 Indian Automotive Market, 1.4 Global Automotive Market"</em>, <em>"1.5 Automotive Research Perspectives, 1.6 Indian and Global OEMs, 1.7 Indian and Global Auto Components Manufacturers"</em>.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14453 · buổi 1-3.</p>
<h3>History and evolution of vehicles</h3>
<p>The automobile did not appear overnight — it evolved through distinct eras, and each era answers a "why" that still shapes today's cars.</p>
<table>
<tr><th>Era</th><th>What changed</th><th>Why it mattered</th></tr>
<tr><td>Before 1885</td><td>Steam-powered carriages, no practical engine</td><td>Heavy, slow to start, impractical for personal travel</td></tr>
<tr><td>1885-1908</td><td>Karl Benz's Patent-Motorwagen — first practical internal combustion vehicle</td><td>Proved a compact engine could replace the horse</td></tr>
<tr><td>1908-1920s</td><td>Ford Model T + the moving assembly line</td><td>Mass production made a car affordable to ordinary families for the first time</td></tr>
<tr><td>1950s-1990s</td><td>Safety systems (seatbelts, crumple zones), emission control</td><td>Cars stopped being "fast metal boxes" and became engineered for survivability</td></tr>
<tr><td>2000s-today</td><td>Hybrid &amp; electric powertrains, driver-assistance software</td><td>Value shifts from mechanical parts toward electronics and software — the reason this degree exists</td></tr>
</table>
<h3>The Indian automotive market (FLM's home market)</h3>
<p>The main textbook for this course (Awari/Kumbhar/Tirpude) is written from an <strong>Indian</strong> industry viewpoint, so session 2-3 study India's market structure directly: a large two-wheeler segment, strong small-car demand, and a mix of domestic OEMs (Tata, Mahindra) and multinational OEMs (Maruti Suzuki, Hyundai) manufacturing locally.</p>
<h3>The global automotive market</h3>
<p>Zooming out, the world market groups into a few blocks: mature markets (US, EU, Japan) with high per-capita ownership and strict safety/emission rules; fast-growing markets (India, Southeast Asia, parts of Africa) where volume growth is fastest; and China, now the single largest production and EV market in the world.</p>
<h3>OEM vs. auto components manufacturer — a distinction students often blur</h3>
<table>
<tr><th></th><th>OEM (Original Equipment Manufacturer)</th><th>Auto components manufacturer (Tier 1/2/3 supplier)</th></tr>
<tr><td>What it makes</td><td>The finished, badged vehicle (e.g. Toyota, Tata, VinFast)</td><td>A specific part or subsystem sold TO an OEM (e.g. Bosch fuel injectors, Continental tyres)</td></tr>
<tr><td>Who the customer is</td><td>The end driver/buyer</td><td>The OEM (a business-to-business relationship)</td></tr>
<tr><td>Brand the driver sees</td><td>Yes — on the car itself</td><td>Usually no — hidden inside the vehicle</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Common mistake.</strong> Calling a components supplier an "OEM" — in the automotive industry, OEM specifically means the vehicle brand, not the parts supplier. Bosch is a components manufacturer that supplies many different OEMs; Bosch itself does not sell a "Bosch car".</div>
<h3>Automotive research perspectives</h3>
<p>Research in this field spans several angles: engineering research (better engines, lighter materials), market research (what buyers want, pricing), policy research (emission standards, safety law), and — increasingly — software/AI research (autonomous driving, connected vehicles). A software engineer entering this field usually sits at the intersection of the last one with the first three.</p>
<div class="note-ct"><strong>Bổ sung của CuongThai (không phải quy định của trường):</strong> Giáo trình chính nhìn từ góc Ấn Độ, nhưng vì bạn học tại Việt Nam, dưới đây là bức tranh thị trường ô tô Việt Nam để đối chiếu.
<h4>Bối cảnh Việt Nam</h4>
<table>
<tr><th>Hãng</th><th>Kiểu OEM</th><th>Đặc điểm</th></tr>
<tr><td><strong>VinFast</strong></td><td>OEM nội địa, thuần điện</td><td>Hãng xe Việt duy nhất tự thiết kế &amp; sản xuất, chuyển hẳn sang xe điện (VF 3, VF 5, VF 8, VF 9...).</td></tr>
<tr><td><strong>THACO</strong></td><td>OEM lắp ráp trong nước cho nhiều thương hiệu ngoại</td><td>Lắp ráp Kia, Mazda, Peugeot tại Chu Lai — mô hình gần giống Maruti Suzuki lắp ráp cho Suzuki tại Ấn Độ.</td></tr>
<tr><td><strong>TC Motor (Thành Công)</strong></td><td>OEM lắp ráp &amp; phân phối cho Hyundai</td><td>Đối tác lắp ráp Hyundai tại Việt Nam, một trong những hãng bán chạy nhất thị trường.</td></tr>
</table>
<p>Cả ba đều là ví dụ tốt cho khái niệm OEM ở trên: họ bán xe mang thương hiệu riêng (hoặc thương hiệu đối tác) trực tiếp cho người tiêu dùng, khác với nhà sản xuất phụ tùng (ví dụ các công ty linh kiện trong khu công nghiệp cung cấp cho VinFast/THACO mà người mua xe không biết tên).</p></div>
<h3>Exercise</h3>
<p><strong>E1.</strong> Classify each of the following as OEM or components manufacturer, and justify in one sentence: (a) VinFast, (b) Bosch, (c) THACO, (d) a factory in Hai Phong that only makes wiring harnesses for VinFast.</p>
<div class="dap-an"><p><strong>Answer.</strong> (a) VinFast — OEM: it sells a finished, badged car to drivers. (b) Bosch — components manufacturer: it sells fuel-injection/braking components TO OEMs, not finished cars to drivers. (c) THACO — OEM: it assembles and sells badged vehicles (its own trucks, plus Kia/Mazda/Peugeot under license) to end customers. (d) The Hai Phong factory — components manufacturer: its customer is VinFast, not the driver, and its product (a wiring harness) is hidden inside the finished car.</p></div>`,
    `<span class="eyebrow">ASI101 · Chương 1 · Bài 1.1 · Buổi 1-3 · CLO2, CLO6</span>
<h2>Đánh giá ô tô &amp; thị trường ô tô</h2>
<p class="lead">Chủ đề FLM (buổi 1-3): <em>"1. Đánh giá ô tô &amp; tổng quan thị trường — 1.1 Giới thiệu, 1.2 Lịch sử &amp; tiến hoá ô tô"</em>, <em>"1.3 Thị trường ô tô Ấn Độ, 1.4 Thị trường ô tô toàn cầu"</em>, <em>"1.5 Góc nhìn nghiên cứu ô tô, 1.6 OEM Ấn Độ &amp; toàn cầu, 1.7 Nhà sản xuất phụ tùng Ấn Độ &amp; toàn cầu"</em>.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14453 · buổi 1-3.</p>
<h3>Lịch sử &amp; tiến hoá của ô tô</h3>
<p>Ô tô không xuất hiện trong một đêm — nó tiến hoá qua từng giai đoạn rõ rệt, và mỗi giai đoạn trả lời một câu hỏi "vì sao" vẫn còn định hình xe ngày nay.</p>
<table>
<tr><th>Giai đoạn</th><th>Thay đổi</th><th>Vì sao quan trọng</th></tr>
<tr><td>Trước 1885</td><td>Xe ngựa chạy hơi nước, chưa có động cơ thực dụng</td><td>Nặng, khởi động chậm, không thực tế cho đi lại cá nhân</td></tr>
<tr><td>1885-1908</td><td>Patent-Motorwagen của Karl Benz — xe đốt trong thực dụng đầu tiên</td><td>Chứng minh động cơ gọn có thể thay ngựa</td></tr>
<tr><td>1908-1920s</td><td>Ford Model T + dây chuyền lắp ráp di động</td><td>Sản xuất hàng loạt lần đầu giúp xe hơi vừa túi tiền gia đình bình thường</td></tr>
<tr><td>1950s-1990s</td><td>Hệ thống an toàn (dây an toàn, vùng hấp thụ xung lực), kiểm soát khí thải</td><td>Xe không còn là "hộp sắt chạy nhanh" mà được thiết kế để sống sót khi va chạm</td></tr>
<tr><td>2000s-nay</td><td>Hệ động lực hybrid &amp; điện, phần mềm hỗ trợ lái</td><td>Giá trị dịch từ cơ khí sang điện tử &amp; phần mềm — lý do ngành học này ra đời</td></tr>
</table>
<h3>Thị trường ô tô Ấn Độ (thị trường gốc của giáo trình)</h3>
<p>Giáo trình chính của môn (Awari/Kumbhar/Tirpude) viết từ góc nhìn ngành công nghiệp <strong>Ấn Độ</strong>, nên buổi 2-3 học trực tiếp cấu trúc thị trường này: phân khúc xe hai bánh rất lớn, nhu cầu xe nhỏ cao, và sự trộn lẫn giữa OEM nội địa (Tata, Mahindra) và OEM đa quốc gia sản xuất tại chỗ (Maruti Suzuki, Hyundai).</p>
<h3>Thị trường ô tô toàn cầu</h3>
<p>Nhìn rộng ra, thị trường thế giới chia thành vài nhóm: thị trường trưởng thành (Mỹ, EU, Nhật) tỉ lệ sở hữu xe/đầu người cao, luật an toàn/khí thải chặt; thị trường tăng trưởng nhanh (Ấn Độ, Đông Nam Á, một phần châu Phi) nơi sản lượng tăng nhanh nhất; và Trung Quốc, hiện là thị trường sản xuất &amp; xe điện lớn nhất thế giới.</p>
<h3>OEM so với nhà sản xuất phụ tùng — điểm sinh viên hay nhầm</h3>
<table>
<tr><th></th><th>OEM (nhà sản xuất xe nguyên chiếc)</th><th>Nhà sản xuất phụ tùng (nhà cung ứng Tier 1/2/3)</th></tr>
<tr><td>Sản phẩm</td><td>Xe hoàn chỉnh, mang thương hiệu (VD Toyota, Tata, VinFast)</td><td>Một bộ phận/hệ con cụ thể bán CHO OEM (VD kim phun Bosch, lốp Continental)</td></tr>
<tr><td>Khách hàng</td><td>Người lái/người mua cuối</td><td>Chính OEM (quan hệ doanh nghiệp-doanh nghiệp)</td></tr>
<tr><td>Người lái có thấy thương hiệu không</td><td>Có — ngay trên xe</td><td>Thường không — ẩn bên trong xe</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Lỗi hay gặp.</strong> Gọi nhà cung ứng phụ tùng là "OEM" — trong ngành ô tô, OEM chỉ dành riêng cho thương hiệu xe, không phải nhà cung ứng linh kiện. Bosch là nhà sản xuất phụ tùng cung cấp cho nhiều OEM khác nhau; Bosch không tự bán "xe Bosch".</div>
<h3>Góc nhìn nghiên cứu ô tô</h3>
<p>Nghiên cứu trong ngành trải trên nhiều góc: nghiên cứu kỹ thuật (động cơ tốt hơn, vật liệu nhẹ hơn), nghiên cứu thị trường (người mua muốn gì, giá cả), nghiên cứu chính sách (tiêu chuẩn khí thải, luật an toàn), và ngày càng nhiều là nghiên cứu phần mềm/AI (lái tự động, xe kết nối). Kỹ sư phần mềm bước vào ngành này thường đứng ở giao điểm của góc cuối với ba góc trước.</p>
<div class="note-ct"><strong>Bổ sung của CuongThai (không phải quy định của trường):</strong> Giáo trình chính nhìn từ góc Ấn Độ, nhưng vì bạn học tại Việt Nam, dưới đây là bức tranh thị trường ô tô Việt Nam để đối chiếu.
<h4>Bối cảnh Việt Nam</h4>
<table>
<tr><th>Hãng</th><th>Kiểu OEM</th><th>Đặc điểm</th></tr>
<tr><td><strong>VinFast</strong></td><td>OEM nội địa, thuần điện</td><td>Hãng xe Việt duy nhất tự thiết kế &amp; sản xuất, chuyển hẳn sang xe điện (VF 3, VF 5, VF 8, VF 9...).</td></tr>
<tr><td><strong>THACO</strong></td><td>OEM lắp ráp trong nước cho nhiều thương hiệu ngoại</td><td>Lắp ráp Kia, Mazda, Peugeot tại Chu Lai — mô hình gần giống Maruti Suzuki lắp ráp cho Suzuki tại Ấn Độ.</td></tr>
<tr><td><strong>TC Motor (Thành Công)</strong></td><td>OEM lắp ráp &amp; phân phối cho Hyundai</td><td>Đối tác lắp ráp Hyundai tại Việt Nam, một trong những hãng bán chạy nhất thị trường.</td></tr>
</table>
<p>Cả ba đều là ví dụ tốt cho khái niệm OEM ở trên: họ bán xe mang thương hiệu riêng (hoặc thương hiệu đối tác) trực tiếp cho người tiêu dùng, khác với nhà sản xuất phụ tùng (các công ty linh kiện cung cấp cho VinFast/THACO mà người mua xe không biết tên).</p></div>
<h3>Bài tập</h3>
<p><strong>E1.</strong> Phân loại OEM hay nhà sản xuất phụ tùng cho từng trường hợp, giải thích 1 câu: (a) VinFast, (b) Bosch, (c) THACO, (d) một nhà máy ở Hải Phòng chỉ làm dây điện cho VinFast.</p>
<div class="dap-an"><p><strong>Đáp án.</strong> (a) VinFast — OEM: bán xe hoàn chỉnh, mang thương hiệu, trực tiếp cho người lái. (b) Bosch — nhà sản xuất phụ tùng: bán bộ phận phun nhiên liệu/phanh CHO OEM, không bán xe hoàn chỉnh cho người lái. (c) THACO — OEM: lắp ráp &amp; bán xe mang thương hiệu (xe tải riêng, cộng Kia/Mazda/Peugeot theo giấy phép) cho khách hàng cuối. (d) Nhà máy Hải Phòng — nhà sản xuất phụ tùng: khách hàng là VinFast chứ không phải người lái, và sản phẩm (dây điện) nằm ẩn bên trong xe hoàn chỉnh.</p></div>`,
  ]]);

const l12 = doc('asi101-1-1-tong-quan-oto', '1.2 — Vehicle classification, chassis, body & layouts|||1.2 — Phân loại xe, khung gầm, thân xe & bố trí',
  'Buổi 4-6, CLO1/CLO2. Phân loại xe; cấu tạo chassis & body; thuật ngữ & pháp lý CMVR/MVA (⚠️ luật Ấn Độ); các hệ thống trên xe; loại khung chassis, vật liệu, tải trọng & biến dạng; các kiểu layout FF/FR/RR/4WD; giới thiệu Matlab.',
  [[
    `<span class="eyebrow">ASI101 · Chapter 1 · Lesson 1.2 · Session 4-6 · CLO1, CLO2</span>
<h2>Vehicle classification, chassis, body &amp; layouts</h2>
<p class="lead">FLM topics (sessions 4-6): <em>"2. Vehicle Classification, Structure and Layouts"</em>, <em>"2.3-2.5 Chassis, body, terminology &amp; legislative requirements per CMVR/MVA, vehicle systems"</em>, <em>"2.6-2.9 Chassis frame types, loads &amp; deformation, vehicle layouts, Matlab intro"</em>.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14453 · buổi 4-6.</p>
<h3>How vehicles are classified</h3>
<table>
<tr><th>By</th><th>Categories</th></tr>
<tr><td>Fuel/powertrain</td><td>Petrol, diesel, hybrid, battery-electric (EV)</td></tr>
<tr><td>Body style</td><td>Sedan, hatchback, SUV, pick-up truck, bus</td></tr>
<tr><td>Use</td><td>Passenger (light motor vehicle), commercial/heavy goods vehicle</td></tr>
<tr><td>Drive layout</td><td>FF, FR, RR, 4WD/AWD — see the layout table below</td></tr>
</table>
<h3>Chassis vs. body — the distinction almost every beginner blurs</h3>
<table>
<tr><th></th><th>Chassis</th><th>Body</th></tr>
<tr><td>What it is</td><td>The load-bearing frame/skeleton that carries the engine, suspension, and drivetrain</td><td>The outer shell/cabin that carries passengers and cargo, shaped for aerodynamics and appearance</td></tr>
<tr><td>Job</td><td>Structural strength — survives loads, torsion, crash forces</td><td>Encloses occupants, shapes airflow, carries interior trim</td></tr>
<tr><td>In a unibody (monocoque) car</td><td>Merged into the body itself — no separate frame underneath</td><td>The body IS the structure, so this row and the previous row become one part</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Common mistake — confusing chassis with body.</strong> Saying "the chassis is the outside of the car" is backwards: the chassis is the structural skeleton (often unseen), while the body is what you touch and see. In most modern passenger cars (unibody construction) they are welded into a single structure, which is exactly why students conflate them — but trucks and buses still use a separate ladder-frame chassis with a body bolted on top, where the difference is obvious.</div>
<h3>⚠️ Legal terminology: CMVR &amp; MVA — INDIAN law, not Vietnamese law</h3>
<div class="callout warn"><span class="badge">⚠️⚠️ Read before session 5</span> FLM's own topic for session 5 is literally <em>"Terminology and Legislative Requirements of a Vehicle as per <strong>CMVR and MVA</strong>"</em> — the <strong>Central Motor Vehicle Rules</strong> and the <strong>Motor Vehicles Act</strong> of <strong>India</strong>. This is the legal framework the (Indian) main textbook uses to define vehicle terminology (gross vehicle weight, homologation, category codes). It is <strong>not Vietnamese traffic law</strong> — if you need Vietnamese vehicle regulations, look at Vietnam's own Road Traffic Law and QCVN vehicle standards instead. We keep CMVR/MVA here only because it is literally what FLM's session 5 studies, and flag it so nobody mistakes it for local law.</div>
<h3>Vehicle systems and their functions (overview)</h3>
<table>
<tr><th>System</th><th>Function</th></tr>
<tr><td>Powertrain (engine/motor)</td><td>Generates the power that moves the vehicle</td></tr>
<tr><td>Drivetrain</td><td>Delivers that power to the wheels (clutch, gearbox, driveshaft, differential)</td></tr>
<tr><td>Chassis (suspension, steering, brakes)</td><td>Holds, guides, and stops the vehicle</td></tr>
<tr><td>Body</td><td>Protects occupants, carries cargo, shapes aerodynamics</td></tr>
<tr><td>Electrical/electronic systems</td><td>Powers lights, sensors, and (increasingly) software-controlled features</td></tr>
</table>
<h3>Types of chassis frames — construction &amp; material</h3>
<table>
<tr><th>Frame type</th><th>Construction</th><th>Typical material &amp; load behaviour</th></tr>
<tr><td>Ladder frame</td><td>Two parallel longitudinal rails joined by cross-members, body bolted on top</td><td>Steel; very strong in bending, used where heavy loads/towing matter (trucks, body-on-frame SUVs)</td></tr>
<tr><td>Monocoque (unibody)</td><td>Body panels themselves form the load-bearing structure — no separate frame</td><td>Stamped steel/aluminium; lighter, better torsional stiffness for handling, but harder to repair after a serious crash</td></tr>
<tr><td>Backbone chassis</td><td>A single strong tunnel/backbone runs down the centre, other parts attach to it</td><td>Used in some sports cars; simple, but the "backbone" carries almost all the load — a single-point weakness</td></tr>
<tr><td>Space frame</td><td>A 3D lattice of thin tubes distributes load along many small members</td><td>Aluminium/tubular steel; excellent strength-to-weight, common in race cars and low-volume sports cars</td></tr>
</table>
<p>The chassis frame must resist several load types: <strong>bending</strong> (vertical load from weight/cargo), <strong>torsion</strong> (twisting when one wheel hits a bump while others don't), and <strong>impact</strong> loads (crash). A frame that deforms too easily under torsion feels "floppy" through corners; too rigid and it transmits every bump straight to occupants — chassis design is a deliberate trade-off, not simply "stiffer is always better".</p>
<h3>Vehicle layouts — where the engine sits, which wheels drive</h3>
<table>
<tr><th>Layout</th><th>Engine / driven wheels</th><th>Advantage</th><th>Disadvantage</th></tr>
<tr><td><strong>FF</strong> (front engine, front-wheel drive)</td><td>Engine front, front wheels drive</td><td>Compact, cheap, good interior space (no driveshaft tunnel), predictable in normal driving</td><td>Front tyres do both steering AND power delivery — can understeer and wheelspin under hard acceleration</td></tr>
<tr><td><strong>FR</strong> (front engine, rear-wheel drive)</td><td>Engine front, rear wheels drive</td><td>Balanced front/rear weight, steering and driving duties are split between axles — favoured for performance/handling</td><td>Needs a driveshaft tunnel through the cabin, more expensive, less predictable for inexperienced drivers in low-grip conditions</td></tr>
<tr><td><strong>RR</strong> (rear engine, rear-wheel drive)</td><td>Engine rear, rear wheels drive</td><td>Excellent rear-wheel traction under acceleration (weight over the driven wheels)</td><td>Rare and costly packaging; can oversteer sharply if the driver lifts off mid-corner (classic Porsche 911 handling trait)</td></tr>
<tr><td><strong>4WD / AWD</strong></td><td>Engine drives all four wheels (full-time or on-demand)</td><td>Best traction on snow/mud/loose surfaces, most stable acceleration</td><td>Heaviest, most complex, highest cost and fuel consumption, more parts that can fail</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Common mistakes.</strong> Confusing <strong>FF with FR</strong> just because "the engine is at the front" in both — the difference that actually matters is which wheels are DRIVEN, not where the engine sits. Assuming 4WD is "always better" — for a daily city car that never leaves pavement, 4WD only adds weight, cost and fuel consumption with no real benefit.</div>
<h3>Real examples</h3>
<div class="callout"><span class="badge">Real example</span> Toyota Vios (FF, unibody) — cheap, spacious, easy to drive; Ford Everest (body-on-frame ladder chassis, 4WD available) — built for towing and rough roads; Porsche 911 (RR, unibody) — famous for its rear-biased handling that rewards a skilled driver and punishes a careless one; VinFast VF 8 (unibody, dual-motor AWD) — an EV example where "engine layout" is really "motor layout", but the FF/FR/4WD logic about traction and handling still applies almost unchanged.</div>
<h3>Introduction to Matlab Simulation Tool</h3>
<p>Session 6 introduces <strong>Matlab</strong> as this course's simulation tool (Tools, FLM: "Internet ; Matlab simulation online"). You will use it again for Assignment 2 (sessions 35-36) to simulate the <strong>Ackermann steering kinematic model</strong> — the same "correct steering" geometry mentioned again when the course reaches front axles and steering (Chapter 10). At this stage, just know that Matlab lets you build a simplified mathematical model of a vehicle system and observe how outputs (e.g. wheel angle, turning radius) change as you vary an input — exactly what "evaluate performance metrics" in CLO5 means.</p>
<h3>Exercise</h3>
<p><strong>E1.</strong> For each real car, name its most likely drive layout and justify briefly: (a) a Toyota Vios used as a city taxi, (b) a Ford Ranger pick-up truck advertised for off-road towing, (c) a Porsche 911.</p>
<div class="dap-an"><p><strong>Answer.</strong> (a) Toyota Vios — <strong>FF</strong>: small city sedans prioritise cost, interior space and easy predictable handling, exactly what FF is good at. (b) Ford Ranger — <strong>4WD</strong> (selectable): a truck marketed for towing/off-road needs traction on loose/uneven surfaces, which only 4WD reliably delivers. (c) Porsche 911 — <strong>RR</strong>: this is the car's signature layout since the 1960s, chosen specifically for the rear-traction advantage under acceleration that a performance car values, accepting the trickier oversteer behaviour as a known trade-off.</p></div>
<h3>Quiz</h3>
<p>Finish Chapter 1 with the quiz below — it covers both Lesson 1.1 (market/OEM) and Lesson 1.2 (classification/chassis/layouts).</p>`,
    `<span class="eyebrow">ASI101 · Chương 1 · Bài 1.2 · Buổi 4-6 · CLO1, CLO2</span>
<h2>Phân loại xe, khung gầm, thân xe &amp; bố trí</h2>
<p class="lead">Chủ đề FLM (buổi 4-6): <em>"2. Phân loại, cấu trúc &amp; bố trí xe"</em>, <em>"2.3-2.5 Khung gầm, thân xe, thuật ngữ &amp; yêu cầu pháp lý theo CMVR/MVA, các hệ thống trên xe"</em>, <em>"2.6-2.9 Các loại khung chassis, tải trọng &amp; biến dạng, bố trí xe, giới thiệu Matlab"</em>.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14453 · buổi 4-6.</p>
<h3>Cách phân loại xe</h3>
<table>
<tr><th>Theo</th><th>Các loại</th></tr>
<tr><td>Nhiên liệu/hệ động lực</td><td>Xăng, diesel, hybrid, thuần điện (EV)</td></tr>
<tr><td>Kiểu thân xe</td><td>Sedan, hatchback, SUV, bán tải, xe buýt</td></tr>
<tr><td>Mục đích dùng</td><td>Xe con (light motor vehicle), xe thương mại/xe tải nặng</td></tr>
<tr><td>Kiểu dẫn động</td><td>FF, FR, RR, 4WD/AWD — xem bảng bố trí bên dưới</td></tr>
</table>
<h3>Khung gầm (chassis) so với thân xe (body) — điểm hầu hết người mới hay nhầm</h3>
<table>
<tr><th></th><th>Khung gầm (chassis)</th><th>Thân xe (body)</th></tr>
<tr><td>Là gì</td><td>Bộ khung chịu lực mang động cơ, hệ treo, hệ truyền động</td><td>Vỏ ngoài/khoang chở khách &amp; hàng, tạo hình khí động học &amp; thẩm mỹ</td></tr>
<tr><td>Nhiệm vụ</td><td>Chịu lực kết cấu — chịu tải, xoắn, lực va chạm</td><td>Bao bọc người ngồi, tạo luồng khí, mang nội thất</td></tr>
<tr><td>Trên xe unibody (liền khối)</td><td>Hợp nhất vào chính thân xe — không còn khung riêng bên dưới</td><td>Thân xe CHÍNH LÀ kết cấu, nên hàng này &amp; hàng trên gộp làm một</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Lỗi hay gặp — nhầm chassis với body.</strong> Nói "chassis là phần bên ngoài xe" là ngược: chassis là bộ khung kết cấu (thường không nhìn thấy), còn body là phần bạn chạm &amp; nhìn thấy. Ở hầu hết xe con hiện đại (kết cấu unibody) chúng được hàn liền thành một khối — chính vì thế sinh viên hay lẫn lộn — nhưng xe tải &amp; xe buýt vẫn dùng khung ladder-frame riêng với thân lắp bên trên, lúc đó sự khác biệt rất rõ.</div>
<h3>⚠️ Thuật ngữ pháp lý: CMVR &amp; MVA — LUẬT ẤN ĐỘ, không phải luật Việt Nam</h3>
<div class="callout warn"><span class="badge">⚠️⚠️ Đọc trước khi vào buổi 5</span> Chủ đề buổi 5 của chính FLM ghi nguyên văn <em>"Thuật ngữ &amp; Yêu cầu pháp lý của xe theo <strong>CMVR và MVA</strong>"</em> — <strong>Central Motor Vehicle Rules</strong> và <strong>Motor Vehicles Act</strong> của <strong>Ấn Độ</strong>. Đây là khung pháp lý mà giáo trình chính (của Ấn Độ) dùng để định nghĩa thuật ngữ xe (tổng trọng lượng xe, chứng nhận kiểu loại, mã hạng xe). Đây <strong>không phải luật giao thông Việt Nam</strong> — nếu cần quy định xe của Việt Nam, hãy tra Luật Giao thông đường bộ &amp; tiêu chuẩn QCVN của Việt Nam thay vào đó. Chúng tôi giữ CMVR/MVA ở đây chỉ vì đúng là buổi 5 của FLM học nội dung này, và nêu rõ để không ai nhầm đó là luật trong nước.</div>
<h3>Các hệ thống trên xe &amp; chức năng (tổng quan)</h3>
<table>
<tr><th>Hệ thống</th><th>Chức năng</th></tr>
<tr><td>Hệ động lực (động cơ/mô-tơ)</td><td>Sinh ra công làm xe di chuyển</td></tr>
<tr><td>Hệ truyền động</td><td>Đưa công đó tới bánh xe (ly hợp, hộp số, trục các-đăng, vi sai)</td></tr>
<tr><td>Khung gầm (treo, lái, phanh)</td><td>Giữ, dẫn hướng &amp; dừng xe</td></tr>
<tr><td>Thân xe</td><td>Bảo vệ người ngồi, chở hàng, tạo hình khí động học</td></tr>
<tr><td>Hệ điện/điện tử</td><td>Cấp điện cho đèn, cảm biến, &amp; ngày càng nhiều tính năng do phần mềm điều khiển</td></tr>
</table>
<h3>Các loại khung chassis — kết cấu &amp; vật liệu</h3>
<table>
<tr><th>Loại khung</th><th>Kết cấu</th><th>Vật liệu &amp; đặc tính chịu tải</th></tr>
<tr><td>Khung thang (ladder frame)</td><td>Hai dầm dọc song song nối bằng dầm ngang, thân xe bắt bu-lông lên trên</td><td>Thép; rất khoẻ khi chịu uốn, dùng nơi cần chở nặng/kéo (xe tải, SUV thân-trên-khung)</td></tr>
<tr><td>Unibody (liền khối)</td><td>Chính các tấm thân xe tạo nên kết cấu chịu lực — không có khung riêng</td><td>Thép/nhôm dập; nhẹ hơn, cứng vững xoắn tốt hơn cho khả năng lái, nhưng khó sửa hơn sau tai nạn nặng</td></tr>
<tr><td>Khung xương sống (backbone)</td><td>Một ống/xương sống chắc chạy dọc giữa xe, các phần khác gắn vào đó</td><td>Dùng ở một số xe thể thao; đơn giản, nhưng "xương sống" chịu gần hết tải — điểm yếu tập trung một chỗ</td></tr>
<tr><td>Khung không gian (space frame)</td><td>Lưới ống mỏng 3 chiều phân tán tải trên nhiều thanh nhỏ</td><td>Nhôm/thép ống; tỉ lệ bền/nặng rất tốt, phổ biến ở xe đua &amp; xe thể thao sản xuất ít</td></tr>
</table>
<p>Khung chassis phải chịu nhiều loại tải: <strong>uốn</strong> (tải thẳng đứng từ trọng lượng/hàng hoá), <strong>xoắn</strong> (khi một bánh cán ổ gà còn bánh khác thì không), và tải <strong>va chạm</strong>. Khung biến dạng quá dễ dưới xoắn sẽ cảm giác "mềm oặt" khi vào cua; quá cứng lại truyền thẳng mọi ổ gà vào người ngồi — thiết kế khung là một đánh đổi có chủ đích, không đơn giản là "càng cứng càng tốt".</p>
<h3>Các kiểu bố trí xe — động cơ ở đâu, bánh nào dẫn động</h3>
<table>
<tr><th>Kiểu</th><th>Động cơ / bánh dẫn động</th><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td><strong>FF</strong> (động cơ trước, dẫn động cầu trước)</td><td>Động cơ trước, bánh trước dẫn động</td><td>Gọn, rẻ, không gian nội thất tốt (không có hầm trục các-đăng), dễ đoán khi lái bình thường</td><td>Bánh trước vừa lái vừa truyền công suất — dễ thiếu lái &amp; trượt bánh khi tăng tốc mạnh</td></tr>
<tr><td><strong>FR</strong> (động cơ trước, dẫn động cầu sau)</td><td>Động cơ trước, bánh sau dẫn động</td><td>Cân bằng trọng lượng trước/sau tốt, việc lái &amp; việc dẫn động tách ra hai cầu — được ưa chuộng cho xe thể thao/vận hành</td><td>Cần hầm trục các-đăng xuyên khoang, đắt hơn, khó đoán hơn với người lái ít kinh nghiệm khi đường trơn</td></tr>
<tr><td><strong>RR</strong> (động cơ sau, dẫn động cầu sau)</td><td>Động cơ sau, bánh sau dẫn động</td><td>Bám đường cầu sau rất tốt khi tăng tốc (trọng lượng đè lên bánh dẫn động)</td><td>Bố trí hiếm &amp; đắt; dễ thừa lái đột ngột nếu nhả ga giữa cua (đặc trưng lái nổi tiếng của Porsche 911)</td></tr>
<tr><td><strong>4WD / AWD</strong></td><td>Động cơ dẫn động cả 4 bánh (toàn thời gian hoặc theo yêu cầu)</td><td>Bám đường tốt nhất trên tuyết/bùn/đường trơn, tăng tốc ổn định nhất</td><td>Nặng nhất, phức tạp nhất, chi phí &amp; tiêu hao nhiên liệu cao nhất, nhiều bộ phận có thể hỏng hơn</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Lỗi hay gặp.</strong> Nhầm <strong>FF với FR</strong> chỉ vì "cả hai đều có động cơ phía trước" — khác biệt thật sự quan trọng là bánh nào ĐƯỢC DẪN ĐỘNG, không phải động cơ nằm đâu. Nghĩ 4WD "luôn tốt hơn" — với xe đi phố hằng ngày không bao giờ rời mặt đường nhựa, 4WD chỉ thêm nặng, thêm chi phí, thêm tiêu hao nhiên liệu mà không có lợi ích thực sự.</div>
<h3>Ví dụ xe thật</h3>
<div class="callout"><span class="badge">Ví dụ thật</span> Toyota Vios (FF, unibody) — rẻ, rộng rãi, dễ lái; Ford Everest (khung ladder thân-trên-khung, có tuỳ chọn 4WD) — dựng để kéo tải &amp; đi đường xấu; Porsche 911 (RR, unibody) — nổi tiếng với cách lái thiên về cầu sau, thưởng cho tay lái giỏi và phạt người lái bất cẩn; VinFast VF 8 (unibody, AWD hai mô-tơ) — ví dụ xe điện nơi "bố trí động cơ" thực ra là "bố trí mô-tơ", nhưng logic FF/FR/4WD về độ bám &amp; cách lái gần như không đổi.</div>
<h3>Giới thiệu công cụ mô phỏng Matlab</h3>
<p>Buổi 6 giới thiệu <strong>Matlab</strong> làm công cụ mô phỏng của môn (Tools, FLM: "Internet ; Matlab simulation online"). Bạn sẽ dùng lại nó ở Assignment 2 (buổi 35-36) để mô phỏng <strong>mô hình động học lái Ackermann</strong> — đúng hình học "lái đúng" sẽ nhắc lại khi môn học tới cầu trước &amp; hệ lái (Chương 10). Ở giai đoạn này, chỉ cần biết Matlab cho phép bạn dựng một mô hình toán đơn giản của một hệ thống trên xe và quan sát đầu ra (VD góc bánh xe, bán kính quay vòng) thay đổi thế nào khi bạn đổi đầu vào — đúng nghĩa "đánh giá chỉ số hiệu năng" trong CLO5.</p>
<h3>Bài tập</h3>
<p><strong>E1.</strong> Với mỗi xe thật, nêu kiểu bố trí dẫn động khả dĩ nhất &amp; giải thích ngắn gọn: (a) Toyota Vios dùng làm taxi trong phố, (b) bán tải Ford Ranger quảng cáo kéo tải off-road, (c) Porsche 911.</p>
<div class="dap-an"><p><strong>Đáp án.</strong> (a) Toyota Vios — <strong>FF</strong>: xe sedan nhỏ đi phố ưu tiên chi phí, không gian nội thất &amp; cách lái dễ đoán, đúng thế mạnh của FF. (b) Ford Ranger — <strong>4WD</strong> (chọn được): xe tải quảng cáo kéo tải/off-road cần bám đường trên mặt trơn/gồ ghề, điều chỉ 4WD đáp ứng ổn định. (c) Porsche 911 — <strong>RR</strong>: đây là bố trí đặc trưng của xe từ thập niên 1960, chọn riêng vì lợi thế bám cầu sau khi tăng tốc mà xe thể thao coi trọng, chấp nhận đặc tính thừa lái khó hơn như một đánh đổi đã biết trước.</p></div>
<h3>Quiz</h3>
<p>Kết Chương 1 bằng quiz bên dưới — phủ cả Bài 1.1 (thị trường/OEM) và Bài 1.2 (phân loại/khung gầm/bố trí).</p>`,
  ]]);

const c1quiz = quiz('asi101-quiz-1', 'Quiz — Chapter 1 (sessions 1-6)|||Quiz — Chương 1 (buổi 1-6)', [
  { id: 'q1', question: 'Theo giáo trình chính của môn (Awari/Kumbhar/Tirpude), thị trường ô tô được nhìn chủ yếu từ góc độ nước nào?', options: ['Việt Nam', 'Ấn Độ', 'Hoa Kỳ', 'Nhật Bản'], correctIndex: 1, explanation: 'Giáo trình chính viết cho thị trường Ấn Độ — chương 1 dạy "Indian Automotive Market" và "Indian and Global OEMs".' },
  { id: 'q2', question: 'Bosch (sản xuất kim phun nhiên liệu, cảm biến...) được gọi đúng là gì trong ngành ô tô?', options: ['OEM', 'Nhà sản xuất phụ tùng (components manufacturer)', 'Nhà phân phối bán lẻ', 'Cơ quan quản lý nhà nước'], correctIndex: 1, explanation: 'OEM bán xe hoàn chỉnh mang thương hiệu cho người lái; Bosch bán linh kiện CHO các OEM, nên là nhà sản xuất phụ tùng.' },
  { id: 'q3', question: 'VinFast, THACO, TC Motor có điểm chung nào theo khái niệm OEM đã học?', options: ['Đều chỉ sản xuất linh kiện ẩn trong xe', 'Đều bán xe mang thương hiệu (riêng hoặc đối tác) trực tiếp cho người dùng cuối', 'Đều không sản xuất tại Việt Nam', 'Đều là nhà cung ứng Tier 1 cho Toyota'], correctIndex: 1, explanation: 'Cả ba đều là OEM: bán xe hoàn chỉnh, có thương hiệu, trực tiếp cho người mua — khác nhà sản xuất phụ tùng vốn bán linh kiện cho OEM.' },
  { id: 'q4', question: 'Phát biểu nào đúng về khung gầm (chassis) và thân xe (body)?', options: ['Chassis là phần vỏ ngoài nhìn thấy được', 'Chassis là bộ khung chịu lực, body là vỏ bao bọc người ngồi', 'Chassis và body luôn là hai chi tiết tách rời, không thể gộp', 'Body chịu tải chính, chassis chỉ trang trí'], correctIndex: 1, explanation: 'Chassis chịu lực kết cấu; body bao bọc người ngồi/hàng hoá. Ở xe unibody hai phần này hàn liền, nhưng vai trò vẫn khác nhau.' },
  { id: 'q5', question: 'Tiêu chuẩn pháp lý "CMVR và MVA" được nhắc trong buổi 5 là luật của nước nào?', options: ['Việt Nam', 'Ấn Độ', 'Liên minh châu Âu', 'Không của nước nào cụ thể'], correctIndex: 1, explanation: 'CMVR (Central Motor Vehicle Rules) và MVA (Motor Vehicles Act) là luật ô tô của Ấn Độ, theo đúng giáo trình chính — không phải luật Việt Nam.' },
  { id: 'q6', question: 'Loại khung chassis nào dùng lưới ống 3 chiều để phân tán tải, phổ biến ở xe đua?', options: ['Khung thang (ladder frame)', 'Unibody', 'Khung xương sống (backbone)', 'Khung không gian (space frame)'], correctIndex: 3, explanation: 'Space frame là lưới ống 3D phân tán tải trên nhiều thanh nhỏ, tỉ lệ bền/nặng rất tốt, hay dùng cho xe đua.' },
  { id: 'q7', question: 'Khác biệt CHÍNH giữa bố trí FF và FR là gì?', options: ['FF có động cơ sau, FR có động cơ trước', 'FF và FR khác nhau ở bánh nào được DẪN ĐỘNG, không phải vị trí động cơ', 'FR luôn rẻ hơn FF', 'FF chỉ dùng cho xe tải'], correctIndex: 1, explanation: 'Cả FF và FR đều có động cơ phía trước; khác biệt quyết định là bánh trước hay bánh sau nhận công suất dẫn động.' },
  { id: 'q8', question: 'Porsche 911 (bố trí RR) có đặc tính lái nổi tiếng nào?', options: ['Thiếu lái nhẹ, rất an toàn cho người mới', 'Dễ thừa lái đột ngột nếu nhả ga giữa cua', 'Không thể vào cua', 'Luôn cần 4WD mới chạy được'], correctIndex: 1, explanation: 'Động cơ đặt sau (RR) cho bám cầu sau tốt khi tăng tốc, nhưng dễ thừa lái nếu nhả ga giữa cua — đặc trưng nổi tiếng của 911.' },
]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 2 → 15 — CHỈ KHUNG (đúng tên bài + 3-6 dòng mốc: buổi/CLO/tài
// liệu/nội dung FLM). Bài giảng chi tiết bổ sung sau. Dựng bằng hàm
// `khung()` — nối chuỗi thường, KHÔNG template lồng bên trong.
// ─────────────────────────────────────────────────────────────────────────
const escAmp = (s) => s.replace(/&(?!amp;)/g, '&amp;');
const khung = (slug, titleEn, titleVi, desc, chuong, baiSo, buoi, clo, taiLieu, noiDungEn, noiDungVi, sach) => {
  const sachHtml = sach || '';
  const enHtml =
    '<span class="eyebrow">ASI101 · Chapter ' + chuong + ' · Lesson ' + baiSo + ' · Session ' + buoi + ' · ' + clo + ' · Framework</span>' +
    '<h2>' + escAmp(titleEn) + '</h2>' +
    sachHtml +
    '<ul>' +
    '<li><strong>Session(s):</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>Material:</strong> ' + taiLieu + '.</li>' +
    '<li><strong>FLM content:</strong> ' + noiDungEn + '</li>' +
    '<li><strong>Note:</strong> Framework only — full lesson content is added later.</li>' +
    '</ul>' +
    '<p><em>Source: FLM &middot; Syllabus 14453 &middot; QD 1028/QD-DHFPT dated 08/21/2026.</em></p>';
  const viHtml =
    '<span class="eyebrow">ASI101 · Chương ' + chuong + ' · Bài ' + baiSo + ' · Buổi ' + buoi + ' · ' + clo + ' · Khung</span>' +
    '<h2>' + escAmp(titleVi) + '</h2>' +
    sachHtml +
    '<ul>' +
    '<li><strong>Buổi:</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>Tài liệu:</strong> ' + taiLieu + '.</li>' +
    '<li><strong>Nội dung FLM:</strong> ' + noiDungVi + '</li>' +
    '<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>' +
    '</ul>' +
    '<p><em>Nguồn: FLM &middot; Syllabus 14453 &middot; QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026.</em></p>';
  return doc(slug, titleEn + '|||' + titleVi, desc, [[enHtml, viHtml]]);
};

// ── Chương 2 — Động cơ (buổi 7-12), CLO1/CLO2, Textbook chính ──
const k21 = khung('asi101-2-1-dong-co', 'Engine working principle, classification & SI fuel supply', 'Nguyên lý động cơ, phân loại & hệ cấp nhiên liệu SI',
  'Buổi 7-8, CLO1/CLO2. Khung.', 2, '2.1', '7-8', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 3',
  'Introduction, working principle &amp; terminology of the engine; components of the IC engine; classification; two-stroke vs four-stroke; comparison of engines &amp; selection; SI engine fuel supply system layout; carburetion &amp; carburettor types.',
  'Giới thiệu, nguyên lý &amp; thuật ngữ động cơ; các bộ phận động cơ đốt trong; phân loại; động cơ 2 kỳ so với 4 kỳ; so sánh &amp; chọn động cơ; sơ đồ hệ cấp nhiên liệu động cơ SI; chế hoà khí &amp; các loại bộ chế hoà khí.');

const k22 = khung('asi101-2-2-he-thong-phun-nhien-lieu', 'Advanced SI/CI fuel injection systems', 'Hệ phun nhiên liệu SI/CI nâng cao',
  'Buổi 9-10, CLO1/CLO2. Khung.', 2, '2.2', '9-10', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 3',
  'Continuous &amp; timed injection; single-point TBI and MPFI; CI engine fuel supply; TDI &amp; CRDI systems; fuel injection pump types; fuel injectors &amp; nozzles; electronically controlled injection; injection timing; spray characteristics.',
  'Hệ phun liên tục &amp; phun định thời; TBI một điểm &amp; MPFI; hệ cấp nhiên liệu động cơ CI; hệ TDI &amp; CRDI; các loại bơm phun; kim phun &amp; vòi phun; hệ phun điều khiển điện tử; thời điểm phun; đặc tính tia phun.');

const k23 = khung('asi101-2-3-boi-tron-lam-mat', 'Engine lubrication, cooling & management', 'Bôi trơn, làm mát & quản lý động cơ',
  'Buổi 11-12, CLO1/CLO2. Khung.', 2, '2.3', '11-12', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 3',
  'Friction &amp; wear mechanics; lubricants; wet/dry sump &amp; mist lubrication; cooling system principles (liquid vs air); current cooling advancements; air intake &amp; exhaust; engine electronics &amp; management system.',
  'Cơ chế ma sát &amp; mài mòn; dầu bôi trơn; bôi trơn các-te ướt/khô &amp; kiểu sương dầu; nguyên lý hệ làm mát (chất lỏng so với không khí); tiến bộ làm mát hiện nay; nạp khí &amp; xả; điện tử &amp; hệ quản lý động cơ.');

// ── Chương 3 — Ly hợp (buổi 13-15), CLO1/CLO2, Textbook chính ──
const k31 = khung('asi101-3-1-ly-hop-nguyen-ly', 'Clutch: necessity, working principle & classification', 'Ly hợp: sự cần thiết, nguyên lý & phân loại',
  'Buổi 13, CLO1/CLO2. Khung.', 3, '3.1', '13', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 4',
  'Introduction to automotive clutches; necessity &amp; functions; working principle; classification of clutches; requirements; torque transmission capacity.',
  'Giới thiệu ly hợp ô tô; sự cần thiết &amp; chức năng; nguyên lý làm việc; phân loại ly hợp; yêu cầu đối với ly hợp; khả năng truyền mô-men.');

const k32 = khung('asi101-3-2-cau-tao-ly-hop', 'Clutch types: single/multi-plate, centrifugal, electromagnetic', 'Các loại ly hợp: đĩa đơn/đa đĩa, ly tâm, điện từ',
  'Buổi 14-15, CLO1/CLO2. Khung.', 3, '3.2', '14-15', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 4',
  'Construction &amp; working of single-plate clutch (diaphragm), multi-plate clutch, centrifugal clutch, electromagnetic clutch; operating mechanisms (mechanical &amp; hydraulic); design aspects of the automotive clutch.',
  'Cấu tạo &amp; hoạt động ly hợp đĩa đơn (diaphragm), ly hợp đa đĩa, ly hợp ly tâm, ly hợp điện từ; cơ cấu vận hành (cơ khí &amp; thuỷ lực); các khía cạnh thiết kế ly hợp ô tô.');

// ── Chương 4 — Hộp số tay & transaxle (buổi 16-18), CLO1/CLO2 ──
const k41 = khung('asi101-4-1-can-thiet-hop-so', 'Resistances, tractive effort & the need for a gearbox', 'Lực cản, lực kéo & sự cần thiết của hộp số',
  'Buổi 16, CLO1/CLO2. Khung.', 4, '4.1', '16', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 5',
  'Introduction to manual transmission &amp; transaxles; various types of resistances; motive power, traction &amp; tractive efforts; necessity of the gear box.',
  'Giới thiệu hộp số sàn &amp; transaxle; các loại lực cản chuyển động; công suất kéo, lực bám &amp; lực kéo; sự cần thiết của hộp số.');

const k42 = khung('asi101-4-2-ty-so-truyen-hop-so-san', 'Gear ratios & manual gearbox types', 'Tỉ số truyền & các loại hộp số sàn',
  'Buổi 17, CLO1/CLO2. Khung.', 4, '4.2', '17', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 5',
  'Calculation of gear ratios; construction &amp; working of constant mesh, sliding mesh, and synchromesh gear boxes; overdrive.',
  'Tính tỉ số truyền; cấu tạo &amp; hoạt động hộp số ăn khớp thường trực (constant mesh), ăn khớp trượt (sliding mesh), đồng tốc (synchromesh); số truyền tăng (overdrive).');

const k43 = khung('asi101-4-3-transfer-box-transaxle', 'Transfer box, heavy-vehicle gearboxes & transaxle', 'Hộp số phụ, hộp số xe tải nặng & transaxle',
  'Buổi 18, CLO1/CLO2. Khung.', 4, '4.3', '18', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 5',
  'Transfer box construction &amp; working; heavy vehicle gear boxes; gear shifting mechanisms; gear box lubrication &amp; sealing; transaxle construction &amp; working.',
  'Cấu tạo &amp; hoạt động hộp số phụ (transfer box); hộp số xe tải nặng; cơ cấu sang số; bôi trơn &amp; làm kín hộp số; cấu tạo &amp; hoạt động transaxle.');

// ── Chương 5 — Assignment 1 (buổi 19-20), CLO1/CLO2/CLO5/CLO7 ──
const k51 = khung('asi101-5-1-assignment-1', 'Assignment 1', 'Assignment 1',
  'Buổi 19-20, CLO1/CLO2/CLO5/CLO7. Khung.', 5, '5.1', '19-20', 'CLO1, CLO2, CLO5, CLO7', 'Đề do giảng viên ra (theo bảng điểm, xem 0.2)',
  'Assignment 1 — done in class, guided by the instructor. Counts toward the 20% Assignment grade (first of two rounds, see 0.2). FLM does not publish the exact brief here (Knowledge &amp; Skill column says "Assignment 1: By instructor").',
  'Assignment 1 — làm tại lớp, dưới hướng dẫn giảng viên. Tính vào đầu điểm Assignment 20% (lần 1 trong 2 lần, xem mục 0.2). FLM không công bố đề cụ thể ở đây (cột Knowledge &amp; Skill ghi "Assignment 1: By instructor").');

// ── Chương 6 — Hộp số tự động (buổi 21-22), CLO1/CLO2 ──
const k61 = khung('asi101-6-1-bien-mo-hanh-tinh', 'Fluid flywheel, torque converter & planetary gear box', 'Bánh đà thuỷ lực, bộ biến mô & hộp số hành tinh',
  'Buổi 21, CLO1/CLO2. Khung.', 6, '6.1', '21', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 6',
  'Introduction to semiautomatic &amp; automatic transmission; fluid flywheel &amp; its limitations; torque converter; planetary gear box.',
  'Giới thiệu hộp số bán tự động &amp; tự động; bánh đà thuỷ lực &amp; hạn chế; bộ biến mô (torque converter); hộp số hành tinh.');

const k62 = khung('asi101-6-2-cvt-tu-dong-amt', 'CVT, automatic transmission & AMT', 'Hộp số vô cấp (CVT), tự động & AMT',
  'Buổi 22, CLO1/CLO2. Khung.', 6, '6.2', '22', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 6',
  'Continuous variable transmission (CVT); automatic transmission for passenger cars &amp; heavy vehicles; automatic transaxles; hydraulic &amp; electrohydraulic control systems; automated manual transmission (AMT).',
  'Hộp số vô cấp (CVT); hộp số tự động cho xe con &amp; xe tải nặng; automatic transaxle; hệ điều khiển thuỷ lực &amp; điện-thuỷ lực; hộp số tự động hoá (AMT).');

// ── Chương 7 — Truyền động, vi sai, cầu sau (buổi 23-24), CLO1/CLO2 ──
const k71 = khung('asi101-7-1-truc-cac-dang-khop-noi', 'Driveline arrangements, propeller shaft & joints', 'Bố trí driveline, trục các-đăng & khớp nối',
  'Buổi 23, CLO1/CLO2. Khung.', 7, '7.1', '23', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 7',
  'Introduction to propeller shaft, differential &amp; rear axles; driveline arrangements; propeller shaft; universal joint; slip joint; constant velocity (CV) joints.',
  'Giới thiệu trục các-đăng, vi sai &amp; cầu sau; cách bố trí driveline; trục các-đăng; khớp các-đăng (universal joint); khớp trượt (slip joint); khớp đồng tốc (CV joint).');

const k72 = khung('asi101-3-1-truyen-dong', 'Final drive, differential & rear axle types', 'Truyền lực cuối, vi sai & các loại cầu sau',
  'Buổi 24, CLO1/CLO2. Khung.', 7, '7.2', '24', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 7',
  'Final drive gears &amp; bearings; differential; rear axle construction &amp; types; loads acting on rear axles; tandem axle drive for heavy vehicles.',
  'Bánh răng &amp; ổ bi truyền lực cuối; vi sai; cấu tạo &amp; các loại cầu sau; tải trọng tác động lên cầu sau; dẫn động cầu đôi (tandem axle) cho xe tải nặng.');

// ── Chương 8 — Treo & phanh (buổi 25-28), CLO1/CLO2 ──
const k81 = khung('asi101-4-1-khung-gam', 'Suspension system: functions, classification & independent/dependent types', 'Hệ thống treo: chức năng, phân loại & treo độc lập/phụ thuộc',
  'Buổi 25, CLO1/CLO2. Khung.', 8, '8.1', '25', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 8',
  'Introduction to suspension system; basic ride considerations; functions of the suspension system; classification; independent suspension; dependent suspension systems.',
  'Giới thiệu hệ thống treo; các yếu tố êm dịu cơ bản của xe; chức năng hệ treo; phân loại hệ treo; treo độc lập; treo phụ thuộc.');

const k82 = khung('asi101-8-2-treo-khi-giam-chan', 'Air/rubber suspension, springs, dampers & adaptive suspension', 'Treo khí/cao su, lò xo, giảm chấn & treo thích ứng',
  'Buổi 26, CLO1/CLO2. Khung.', 8, '8.2', '26', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 8',
  'Air suspension; rubber suspensions; types of springs used in the suspension system; dampers; adaptive suspension system.',
  'Treo khí nén; treo cao su; các loại lò xo dùng trong hệ treo; giảm chấn; hệ thống treo thích ứng.');

const k83 = khung('asi101-8-3-phanh-tang-trong-dia', 'Braking systems: classification, drum/disc & hydraulic brakes', 'Hệ thống phanh: phân loại, phanh tang trống/đĩa & phanh thuỷ lực',
  'Buổi 27, CLO1/CLO2. Khung.', 8, '8.3', '27', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 9',
  'Introduction to braking systems; classification of brakes; drum brakes and disc brakes; hydraulic braking system construction &amp; working.',
  'Giới thiệu hệ thống phanh; phân loại phanh; phanh tang trống &amp; phanh đĩa; cấu tạo &amp; hoạt động hệ phanh thuỷ lực.');

const k84 = khung('asi101-8-4-phanh-khi-abs-do', 'Air brakes, ABS & parking brakes', 'Phanh khí nén, ABS & phanh tay/đỗ',
  'Buổi 28, CLO1/CLO2. Khung.', 8, '8.4', '28', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 9',
  'Air brakes &amp; system actuation; antilock braking systems (ABS); parking brakes.',
  'Phanh khí nén &amp; cơ cấu kích hoạt hệ thống; hệ thống chống bó cứng phanh (ABS); phanh tay/đỗ.');

// ── Chương 9 — Thân xe + Progress Test 1 (buổi 29-31), CLO1/CLO2/CLO3 ──
const k91 = khung('asi101-9-1-than-xe-chuc-nang', 'Vehicle body engineering: functions, requirements & car body construction', 'Kỹ thuật thân xe: chức năng, yêu cầu & kết cấu thân xe con',
  'Buổi 29, CLO1/CLO2. Khung.', 9, '9.1', '29', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 10',
  'Introduction to vehicle body engineering; functions of the vehicle body; requirements; classification of vehicle body; car body construction.',
  'Giới thiệu kỹ thuật thân xe; chức năng thân xe; yêu cầu đối với thân xe; phân loại thân xe; kết cấu thân xe con.');

const k92 = khung('asi101-9-2-progress-test-1', 'Progress Test 1', 'Kiểm tra tiến độ 1 (Progress Test 1)',
  'Buổi 30, CLO1/CLO2/CLO3 (⚠️ lệch với bảng điểm, xem 0.2). Khung.', 9, '9.2', '30', 'CLO1, CLO2, CLO3 (⚠️ xem cảnh báo)', 'Nội dung buổi 1-10',
  'Progress Test 1 — covers content from sessions 1-10. Session-plan CLO tag is CLO1, CLO2, CLO3, which does NOT match the grading table\'s Test 1 tag (CLO1-CLO6) — see the discrepancy flagged in 0.2. Counts toward the 20% Progress test grade (first of two rounds).',
  'Kiểm tra tiến độ 1 — phủ nội dung buổi 1-10. Kế hoạch buổi gắn CLO1, CLO2, CLO3, KHÔNG khớp với bảng điểm (Test 1 = CLO1-CLO6) — xem lệch đã nêu ở mục 0.2. Tính vào đầu điểm Progress test 20% (lần 1 trong 2 lần).');

const k93 = khung('asi101-9-3-than-xe-buyt-vat-lieu', 'Bus body, body mounting, materials & trends', 'Thân xe buýt, gắn thân, vật liệu & xu hướng',
  'Buổi 31, CLO1/CLO2. Khung.', 9, '9.3', '31', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 10',
  'Bus body construction; body mounting; body materials; loads acting on the vehicle body; anthropometric &amp; ergonomic considerations; upcoming trends in vehicle body manufacturing.',
  'Kết cấu thân xe buýt; gắn thân lên khung; vật liệu thân xe; tải trọng tác động lên thân xe; yếu tố nhân trắc &amp; công thái học; xu hướng mới trong chế tạo thân xe.');

// ── Chương 10 — Cầu trước, hệ thống lái, bánh & lốp (buổi 32-34, 37-38) ──
const k101 = khung('asi101-10-1-cau-truoc-ackermann', 'Front axle & Ackermann steering mechanism', 'Cầu trước & cơ cấu lái Ackermann',
  'Buổi 32, CLO1/CLO2. Khung.', 10, '10.1', '32', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 11',
  'Introduction to front axle &amp; steering systems; functions &amp; constructional details of the front axle; requirements of steering; principle of correct steering; Ackerman\'s steering gear mechanism.',
  'Giới thiệu cầu trước &amp; hệ thống lái; chức năng &amp; cấu tạo chi tiết cầu trước; yêu cầu đối với hệ lái; nguyên lý lái đúng; cơ cấu lái Ackermann.');

const k102 = khung('asi101-10-2-bo-tri-co-cau-lai', 'Steering linkage layouts, gear boxes & power-assisted steering', 'Bố trí dẫn động lái, hộp cơ cấu lái & trợ lực lái',
  'Buổi 33, CLO1/CLO2. Khung.', 10, '10.2', '33', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 11',
  'Steering linkage arrangements; axle beam suspension steering layout; independent suspension steering layout; steering gear boxes; power-assisted steering.',
  'Bố trí dẫn động lái (linkage); bố trí hệ lái với treo dầm cầu; bố trí hệ lái với treo độc lập; hộp cơ cấu lái; trợ lực lái.');

const k103 = khung('asi101-10-3-banh-xe-phan-loai', 'Wheels: requirements, classification & construction', 'Bánh xe: yêu cầu, phân loại & cấu tạo',
  'Buổi 34, CLO1/CLO2. Khung.', 10, '10.3', '34', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 12',
  'Introduction to wheels &amp; tyres; requirements of the wheel; classification of wheels; construction of wired and pressed disc wheels.',
  'Giới thiệu bánh xe &amp; lốp; yêu cầu đối với bánh xe; phân loại bánh xe; cấu tạo bánh nan hoa &amp; bánh đĩa dập.');

const k104 = khung('asi101-10-4-vanh-can-bang-lop', 'Rim types, wheel alignment/balancing & cornering properties', 'Các loại vành, cân chỉnh/cân bằng bánh xe & đặc tính vào cua',
  'Buổi 37, CLO1/CLO2. Khung.', 10, '10.4', '37', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 12',
  'Types of rims &amp; constructional details; wheel alignment &amp; balancing; tyre characteristics; cornering properties of the tyre; requirements of tyres.',
  'Các loại vành &amp; cấu tạo; cân chỉnh &amp; cân bằng bánh xe; đặc tính lốp; đặc tính lốp khi vào cua; yêu cầu đối với lốp.');

const k105 = khung('asi101-10-5-phan-loai-cau-tao-lop', 'Tyre classification, construction, treads & size designations', 'Phân loại lốp, cấu tạo, gai lốp & ký hiệu kích cỡ',
  'Buổi 38, CLO1/CLO2. Khung.', 10, '10.5', '38', 'CLO1, CLO2', 'Textbook chính (Awari/Kumbhar/Tirpude), chương 12',
  'Classification of tyres; tyre construction; tyre treads; tyre size &amp; designations; factors affecting tyre (performance/wear).',
  'Phân loại lốp; cấu tạo lốp; gai lốp; ký hiệu &amp; kích cỡ lốp; các yếu tố ảnh hưởng tới lốp (hiệu năng/mài mòn).');

// ── Chương 11 — Assignment 2 (buổi 35-36), CLO1/CLO2/CLO5/CLO7 ──
const k111 = khung('asi101-11-1-assignment-2', 'Assignment 2: Simulate Ackermann kinematic model (Matlab)', 'Assignment 2: Mô phỏng mô hình động học Ackermann (Matlab)',
  'Buổi 35-36, CLO1/CLO2/CLO5/CLO7. Khung.', 11, '11.1', '35-36', 'CLO1, CLO2, CLO5, CLO7', 'Matlab simulation online',
  'Assignment 2, FLM brief verbatim: "Simulate Ackermann Kinematic Model with Steering Angle Constraints" — done in class, guided by the instructor, using Matlab (introduced session 6). Counts toward the 20% Assignment grade (second of two rounds, see 0.2).',
  'Assignment 2, đề nguyên văn FLM: "Simulate Ackermann Kinematic Model with Steering Angle Constraints" (mô phỏng mô hình động học Ackermann với ràng buộc góc lái) — làm tại lớp, dưới hướng dẫn giảng viên, dùng Matlab (đã giới thiệu ở buổi 6). Tính vào đầu điểm Assignment 20% (lần 2 trong 2 lần, xem mục 0.2).');

// ── Chương 12 — Xe hybrid & xe tự hành (buổi 39-42), CLO1/CLO2/CLO3, Ref textbook 02 ──
const k121 = khung('asi101-12-1-xe-hybrid-lich-su', 'Hybrid cars: history, background & production types', 'Xe hybrid: lịch sử, bối cảnh & các loại sản xuất',
  'Buổi 39-40, CLO1/CLO2/CLO3. Khung.', 12, '12.1', '39-40', 'CLO1, CLO2, CLO3', 'Ref textbook 02 (Sakthivel và cộng sự), chương 7',
  'Introduction to hybrid cars; history; background; production of hybrid electric vehicles; types of vehicles (motorcycles, automobiles &amp; light trucks, taxis, buses).',
  'Giới thiệu xe hybrid; lịch sử; bối cảnh; sản xuất xe hybrid điện; các loại xe (xe máy, ô tô con &amp; tải nhẹ, taxi, xe buýt).', sachRef02);

const k122 = khung('asi101-12-2-hybrid-tai-nang-quan-su', 'Hybrid heavy trucks, military vehicles & locomotives', 'Xe hybrid tải nặng, quân sự & đầu máy',
  'Buổi 41, CLO1/CLO2/CLO3. Khung.', 12, '12.2', '41', 'CLO1, CLO2, CLO3', 'Ref textbook 02 (Sakthivel và cộng sự), chương 7',
  'Hybrid trucks; military vehicles; locomotives.',
  'Xe tải hybrid; xe quân sự; đầu máy xe lửa.');

const k123 = khung('asi101-8-1-an-toan-adas', 'Autonomous cars: ethics, mobility & safety concept', 'Xe tự hành: đạo đức, di chuyển & khái niệm an toàn',
  'Buổi 42, CLO1/CLO2/CLO3. Khung.', 12, '12.3', '42', 'CLO1, CLO2, CLO3', 'Ref textbook 02 (Sakthivel và cộng sự), chương 8',
  'Introduction to autonomous cars; implementable ethics for autonomous vehicles; mobility &amp; autonomous driving; safety concept for autonomous vehicles.',
  'Giới thiệu xe tự hành; đạo đức áp dụng được cho xe tự hành; di chuyển &amp; lái tự động; khái niệm an toàn cho xe tự hành.');

// ── Chương 13 — Phần mềm trong ô tô & kiến trúc phần mềm (buổi 43-47), Ref textbook 01 ──
const k131 = khung('asi101-7-1-dieu-khien-phan-mem', 'Introduction to software & cars: history & trends', 'Nhập môn phần mềm & ô tô: lịch sử & xu hướng',
  'Buổi 43, CLO1/CLO2/CLO6. Khung.', 13, '13.1', '43', 'CLO1, CLO2, CLO6', 'Ref textbook 01 (Staron), chương 1',
  'Introduction to software and modern cars; history of software in the automotive industry; trends shaping automotive software development.',
  'Phần mềm &amp; ô tô hiện đại; lịch sử phần mềm trong ngành ô tô; xu hướng định hình phát triển phần mềm ô tô.', sachRef01);

const k132 = khung('asi101-13-2-to-chuc-phan-mem-oto', 'Organization of automotive software systems & architecting as a discipline', 'Tổ chức hệ thống phần mềm ô tô & kiến trúc hoá như một kỷ luật',
  'Buổi 44, CLO1/CLO2/CLO6 (⚠️ bản gốc kết thúc bằng dấu ngoặc kép lạc, xem 0.5). Khung.', 13, '13.2', '44', 'CLO1, CLO2, CLO6', 'Ref textbook 01 (Staron), chương 1',
  'Organization of automotive software systems; architecting as a discipline. ⚠️ The raw FLM topic text ends with a stray closing quote mark (see 0.5) — kept as published.',
  'Tổ chức hệ thống phần mềm ô tô; kiến trúc hoá như một kỷ luật. ⚠️ Bản gốc FLM kết thúc bằng một dấu ngoặc kép lạc (xem mục 0.5) — giữ nguyên như trường công bố.');

const k133 = khung('asi101-13-3-kien-truc-goc-nhin-chung', 'Software architectures: common views & definitions', 'Kiến trúc phần mềm: góc nhìn chung & định nghĩa',
  'Buổi 45, CLO3/CLO4/CLO6. Khung.', 13, '13.3', '45', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 2',
  'Software architectures: views and documentation — introduction; common view on architecture in general and in the automotive industry in particular; definitions.',
  'Kiến trúc phần mềm: góc nhìn &amp; tài liệu hoá — giới thiệu; góc nhìn chung về kiến trúc &amp; trong ngành ô tô nói riêng; định nghĩa.');

const k134 = khung('asi101-13-4-cau-truc-cap-cao', 'High-level structures, architectural principles & the development process', 'Cấu trúc cấp cao, nguyên lý kiến trúc & quy trình phát triển',
  'Buổi 46, CLO3/CLO4/CLO6. Khung.', 13, '13.4', '46', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 2',
  'High-level structures; architectural principles; architecture in the development process.',
  'Cấu trúc cấp cao; nguyên lý kiến trúc; kiến trúc trong quy trình phát triển.');

const k135 = khung('asi101-13-5-goc-nhin-phong-cach-kien-truc', 'Architectural views, styles & describing architectures', 'Các góc nhìn, phong cách kiến trúc & cách mô tả',
  'Buổi 47, CLO3/CLO4/CLO6. Khung.', 13, '13.5', '47', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 2',
  'Architectural views; architectural styles; describing the architectures.',
  'Các góc nhìn kiến trúc; phong cách kiến trúc; mô tả kiến trúc.');

// ── Chương 14 — Phát triển phần mềm ô tô & AUTOSAR (buổi 48-53), Ref textbook 01 ──
const k141 = khung('asi101-14-1-phat-trien-pm-oto', 'Automotive software development: requirements & variant management', 'Phát triển phần mềm ô tô: yêu cầu & quản lý biến thể',
  'Buổi 48, CLO3/CLO4/CLO6 (⚠️ bản gốc đánh số "17.1" hai lần, xem 0.5). Khung.', 14, '14.1', '48', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 3',
  'Introduction to automotive software development; requirements; variant management. ⚠️ The raw FLM numbering repeats "17.1" for both "Introduction" and "Requirements" (the second is likely meant to be "17.2") — kept as published, see 0.5.',
  'Giới thiệu phát triển phần mềm ô tô; yêu cầu; quản lý biến thể. ⚠️ Bản gốc FLM đánh số "17.1" lặp lại hai lần cho cả "Introduction" và "Requirements" (mục sau lẽ ra là "17.2") — giữ nguyên như trường công bố, xem mục 0.5.');

const k142 = khung('asi101-14-2-autosar-gioi-thieu', 'AUTOSAR standard: introduction & reference architecture', 'Chuẩn AUTOSAR: giới thiệu & kiến trúc tham chiếu',
  'Buổi 49, CLO3/CLO4/CLO6. Khung.', 14, '14.2', '49', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 4',
  'Introduction to the AUTOSAR standard; AUTOSAR reference architecture.',
  'Giới thiệu chuẩn AUTOSAR; kiến trúc tham chiếu AUTOSAR.');

const k143 = khung('asi101-14-3-autosar-phuong-phap-meta-model', 'AUTOSAR development methodology & meta-model', 'Phương pháp phát triển AUTOSAR & meta-model',
  'Buổi 50-51 (⚠️⚠️ hai buổi TRÙNG NGUYÊN VĂN trong bảng gốc FLM, xem 0.5), CLO3/CLO4/CLO6. Khung.', 14, '14.3', '50-51', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 4',
  'AUTOSAR development methodology; AUTOSAR meta-model. ⚠️⚠️ Sessions 50 and 51 are WORD-FOR-WORD IDENTICAL in the FLM plan (including a typo doubling "Meta-Model") — kept as published, not merged, see 0.5.',
  'Phương pháp phát triển AUTOSAR; meta-model của AUTOSAR. ⚠️⚠️ Buổi 50 và 51 TRÙNG NGUYÊN VĂN trong bảng gốc FLM (kể cả lỗi gõ lặp "Meta-Model") — giữ nguyên như trường công bố, không gộp lại, xem mục 0.5.');

const k144 = khung('asi101-14-4-autosar-ecu-middleware', 'AUTOSAR ECU middleware', 'Middleware ECU của AUTOSAR',
  'Buổi 52, CLO3/CLO4/CLO6. Khung.', 14, '14.4', '52', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 4',
  'AUTOSAR ECU middleware.',
  'Middleware ECU của AUTOSAR.');

const k145 = khung('asi101-14-5-autosar-tuong-lai', 'AUTOSAR evolution & future', 'Sự phát triển & tương lai của AUTOSAR',
  'Buổi 53, CLO3/CLO4/CLO6. Khung.', 14, '14.5', '53', 'CLO3, CLO4, CLO6', 'Ref textbook 01 (Staron), chương 4',
  'AUTOSAR evolution; future of AUTOSAR.',
  'Sự phát triển của AUTOSAR; tương lai của AUTOSAR.');

// ── Chương 15 — Progress Test 2, ôn tập & thuyết trình đồ án (buổi 54-60) ──
const k151 = khung('asi101-15-1-progress-test-2', 'Progress Test 2', 'Kiểm tra tiến độ 2 (Progress Test 2)',
  'Buổi 54, CLO1/CLO2/CLO4/CLO6 (⚠️ lệch với bảng điểm, xem 0.2). Khung.', 15, '15.1', '54', 'CLO1, CLO2, CLO4, CLO6 (⚠️ xem cảnh báo)', 'Nội dung buổi 11-18',
  'Progress Test 2 — covers content from sessions 11-18. Session-plan CLO tag is CLO1, CLO2, CLO4, CLO6, which does NOT match the grading table\'s Test 2 tag (CLO1, CLO2, CLO3) — see the discrepancy flagged in 0.2. Counts toward the 20% Progress test grade (second of two rounds).',
  'Kiểm tra tiến độ 2 — phủ nội dung buổi 11-18. Kế hoạch buổi gắn CLO1, CLO2, CLO4, CLO6, KHÔNG khớp với bảng điểm (Test 2 = CLO1, CLO2, CLO3) — xem lệch đã nêu ở mục 0.2. Tính vào đầu điểm Progress test 20% (lần 2 trong 2 lần).');

const k152 = khung('asi101-15-2-on-tap-cuoi-ky', 'Final Review', 'Ôn tập cuối kỳ (Final Review)',
  'Buổi 55-57, CLOs 1-7. Khung.', 15, '15.2', '55-57', 'CLOs 1-7', 'Toàn bộ giáo trình & slide',
  'Final Review — three sessions of review before the final exam, covering all subjects in the syllabus (CLO1-CLO7).',
  'Ôn tập cuối kỳ — ba buổi ôn tập trước thi cuối kỳ, phủ toàn bộ nội dung syllabus (CLO1-CLO7).');

const k153 = khung('asi101-15-3-thuyet-trinh-do-an', 'Project Presentation', 'Thuyết trình đồ án (Project Presentation)',
  'Buổi 58-60, CLOs 1-7 (⚠️ tên đầu điểm không khớp bảng điểm, xem 0.2). Khung.', 15, '15.3', '58-60', 'CLOs 1-7', 'Đồ án nhóm theo hướng dẫn giảng viên',
  'Project Presentation — three sessions presenting the team project. ⚠️ The grading table (0.2) has no item literally named "Project" — the closest match is "Presentation" (20%); we flag the naming gap rather than assuming they are the same grade item.',
  'Thuyết trình đồ án — ba buổi trình bày đồ án nhóm. ⚠️ Bảng điểm (mục 0.2) không có đầu điểm nào tên đúng là "Project" — gần nhất là "Presentation" (20%); chúng tôi nêu chỗ chưa khớp tên thay vì tự suy là cùng một đầu điểm.');

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ASI101',
    slug: 'asi101-introduction-to-automotive-system',
    title: 'Introduction to Automotive System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ASI101.webp',
    shortDescription: 'FLM Syllabus 14453 (QĐ 1028/QĐ-ĐHFPT, 21/08/2026), 60 buổi, KHÔNG có LAB. Điểm: Assignment 20% + Presentation 20% + Progress test 20% + Thi cuối 40%. Chương 1 (buổi 1-6: thị trường & phân loại xe) dạy đầy đủ; buổi 7-60 là khung từng buổi.|||FLM Syllabus 14453 (Decision 1028/QĐ-ĐHFPT, 08/21/2026), 60 sessions, NO lab. Grading: Assignment 20% + Presentation 20% + Progress test 20% + Final exam 40%. Chapter 1 (sessions 1-6) is fully taught; sessions 7-60 are a framework for now.',
    description: 'Môn <strong>ASI101 — Introduction to Automotive System</strong> (Nhập môn ô tô, Kỳ 1, ngành Kỹ thuật phần mềm ô tô) dựng lại bám nguyên văn <strong>FLM Syllabus 14453</strong> (QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026), đủ <strong>60 buổi</strong>, <strong>7 CLO</strong> và <strong>4 đầu điểm</strong> (Assignment 20%, Presentation 20%, Progress test 20%, Final exam 40%). Môn này <strong>KHÔNG có LAB</strong> — cả 60 buổi đều Offline. <strong>Mục 0</strong> là khung chương trình đầy đủ (hồ sơ môn, cách tính điểm, CLO, giáo trình &amp; công cụ, kế hoạch 60 buổi, nhiệm vụ sinh viên) để sinh viên tự đối chiếu với FLM — kèm 20 chỗ syllabus gốc bất thường đã nêu rõ (CLO trống/gõ sai/lệch bảng, buổi trùng lặp...). <strong>Chương 1</strong> (buổi 1-6: thị trường ô tô Ấn Độ &amp; toàn cầu, OEM, phân loại xe, khung gầm/thân xe, các kiểu bố trí FF/FR/RR/4WD, giới thiệu Matlab) dạy đầy đủ, song ngữ, có bảng so sánh, lỗi thường gặp, bài tập &amp; lời giải, kết chương bằng quiz. <strong>Chương 2 đến hết</strong> (động cơ, ly hợp, hộp số, treo &amp; phanh, thân xe, hệ lái/bánh/lốp, xe hybrid &amp; tự hành, phần mềm ô tô &amp; kiến trúc, AUTOSAR, ôn tập &amp; đồ án) hiện là <strong>khung</strong> — đúng tên bài, đúng buổi/CLO/tài liệu, mốc nội dung ngắn gọn — để sinh viên có đúng chương trình học ngay, chi tiết sẽ bổ sung dần.',
    whatYouLearn: 'Lịch sử &amp; tiến hoá ô tô; thị trường ô tô Ấn Độ &amp; toàn cầu, phân biệt OEM với nhà sản xuất phụ tùng; phân loại xe, khung gầm (chassis) so với thân xe (body), thuật ngữ pháp lý (CMVR/MVA — luật Ấn Độ); các loại khung chassis, vật liệu, tải trọng &amp; biến dạng; các kiểu bố trí FF/FR/RR/4WD; giới thiệu Matlab; động cơ đốt trong (nguyên lý, phân loại, cấp nhiên liệu, bôi trơn, làm mát); ly hợp; hộp số tay/tự động &amp; transaxle; trục các-đăng, vi sai, cầu sau; treo &amp; phanh (ABS); thân xe; cầu trước &amp; hệ thống lái (Ackermann), bánh xe &amp; lốp; xe hybrid &amp; xe tự hành; phần mềm trong ô tô, kiến trúc phần mềm &amp; chuẩn AUTOSAR.',
    requirements: 'Không cần kinh nghiệm trước (Pre-Requisite: None, theo FLM). Kiến thức vật lý phổ thông là đủ; môn xây từ số 0 và hướng tới góc nhìn của kỹ sư phần mềm sẽ lập trình hệ thống ô tô sau này.',
  },
  sections: [
    {
      title: 'Mục 0 — Khung chương trình theo FLM|||Section 0 — FLM program framework',
      description: 'Hồ sơ môn, cách tính điểm (4 đầu điểm, thi cuối kỳ 40%), 7 CLO, giáo trình &amp; công cụ, kế hoạch đủ 60 buổi, nhiệm vụ sinh viên — đối chiếu trực tiếp FLM Syllabus 14453.',
      lessons: [m01, m02, m03, m04, m05, m06],
    },
    {
      title: 'Chương 1 — Thị trường ô tô & phân loại xe (buổi 1-6)|||Chapter 1 — Automotive market & vehicle classification (sessions 1-6)',
      description: 'Buổi 1-6 · CLO1, CLO2, CLO6 · Lịch sử & thị trường ô tô, OEM, phân loại xe, khung gầm/thân xe, bố trí FF/FR/RR/4WD, Matlab — ĐẦY ĐỦ, dạy được ngay, kết chương bằng quiz.',
      lessons: [l11, l12, c1quiz],
    },
    {
      title: 'Chương 2 — Động cơ (khung)|||Chapter 2 — Engines (skeleton)',
      description: 'Buổi 7-12 · CLO1, CLO2 · Nguyên lý, phân loại, cấp nhiên liệu, bôi trơn & làm mát động cơ — Khung.',
      lessons: [k21, k22, k23],
    },
    {
      title: 'Chương 3 — Ly hợp (khung)|||Chapter 3 — Clutches (skeleton)',
      description: 'Buổi 13-15 · CLO1, CLO2 · Nguyên lý, phân loại & cấu tạo các loại ly hợp — Khung.',
      lessons: [k31, k32],
    },
    {
      title: 'Chương 4 — Hộp số tay & transaxle (khung)|||Chapter 4 — Manual transmission & transaxle (skeleton)',
      description: 'Buổi 16-18 · CLO1, CLO2 · Lực cản, tỉ số truyền, các loại hộp số sàn, transfer box & transaxle — Khung.',
      lessons: [k41, k42, k43],
    },
    {
      title: 'Chương 5 — Assignment 1 (khung)|||Chapter 5 — Assignment 1 (skeleton)',
      description: 'Buổi 19-20 · CLO1, CLO2, CLO5, CLO7 · Khung.',
      lessons: [k51],
    },
    {
      title: 'Chương 6 — Hộp số tự động (khung)|||Chapter 6 — Automatic transmission (skeleton)',
      description: 'Buổi 21-22 · CLO1, CLO2 · Bánh đà thuỷ lực, biến mô, hành tinh, CVT, tự động, AMT — Khung.',
      lessons: [k61, k62],
    },
    {
      title: 'Chương 7 — Truyền động, vi sai, cầu sau (khung)|||Chapter 7 — Driveline, differential & rear axle (skeleton)',
      description: 'Buổi 23-24 · CLO1, CLO2 · Trục các-đăng, khớp nối, truyền lực cuối, vi sai, cầu sau — Khung.',
      lessons: [k71, k72],
    },
    {
      title: 'Chương 8 — Treo & phanh (khung)|||Chapter 8 — Suspension & brakes (skeleton)',
      description: 'Buổi 25-28 · CLO1, CLO2 · Hệ treo, giảm chấn, phanh tang trống/đĩa, ABS — Khung.',
      lessons: [k81, k82, k83, k84],
    },
    {
      title: 'Chương 9 — Thân xe & Progress Test 1 (khung)|||Chapter 9 — Vehicle body & Progress Test 1 (skeleton)',
      description: 'Buổi 29-31 · CLO1, CLO2, CLO3 · Chức năng, kết cấu thân xe con/xe buýt, vật liệu; PT1 (⚠️ CLO lệch bảng điểm, xem 0.2) — Khung.',
      lessons: [k91, k92, k93],
    },
    {
      title: 'Chương 10 — Cầu trước, hệ thống lái, bánh & lốp (khung)|||Chapter 10 — Front axle, steering, wheels & tyres (skeleton)',
      description: 'Buổi 32-34, 37-38 · CLO1, CLO2 · Cầu trước & Ackermann, trợ lực lái, bánh xe, vành, lốp — Khung.',
      lessons: [k101, k102, k103, k104, k105],
    },
    {
      title: 'Chương 11 — Assignment 2 (khung)|||Chapter 11 — Assignment 2 (skeleton)',
      description: 'Buổi 35-36 · CLO1, CLO2, CLO5, CLO7 · Mô phỏng Ackermann bằng Matlab — Khung.',
      lessons: [k111],
    },
    {
      title: 'Chương 12 — Xe hybrid & xe tự hành (khung)|||Chapter 12 — Hybrid & autonomous cars (skeleton)',
      description: 'Buổi 39-42 · CLO1, CLO2, CLO3 · Lịch sử & loại xe hybrid, đạo đức & an toàn xe tự hành — Khung.',
      lessons: [k121, k122, k123],
    },
    {
      title: 'Chương 13 — Phần mềm trong ô tô & kiến trúc phần mềm (khung)|||Chapter 13 — Automotive software & software architecture (skeleton)',
      description: 'Buổi 43-47 · CLO1-CLO4, CLO6 · Nhập môn phần mềm ô tô, tổ chức hệ thống, góc nhìn & phong cách kiến trúc — Khung.',
      lessons: [k131, k132, k133, k134, k135],
    },
    {
      title: 'Chương 14 — Phát triển phần mềm ô tô & AUTOSAR (khung)|||Chapter 14 — Automotive software development & AUTOSAR (skeleton)',
      description: 'Buổi 48-53 · CLO3, CLO4, CLO6 · Yêu cầu & biến thể, chuẩn AUTOSAR, meta-model (⚠️ buổi 50&51 trùng nguyên văn), middleware, tương lai — Khung.',
      lessons: [k141, k142, k143, k144, k145],
    },
    {
      title: 'Chương 15 — Progress Test 2, ôn tập & thuyết trình đồ án (khung)|||Chapter 15 — Progress Test 2, review & project presentation (skeleton)',
      description: 'Buổi 54-60 · CLOs 1-7 · PT2 (⚠️ CLO lệch bảng điểm), ôn tập cuối kỳ, thuyết trình đồ án (⚠️ tên khác "Presentation" trong bảng điểm) — Khung.',
      lessons: [k151, k152, k153],
    },
  ],
};
