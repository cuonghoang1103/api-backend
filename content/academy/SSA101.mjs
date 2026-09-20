/**
 * SSA101 — Academic Skills (Kỹ năng học thuật). Kỳ 1, FPTU.
 *
 * DỰNG LẠI 20/09/2026 bám nguyên văn FLM Syllabus 13785 (QĐ 1318/QĐ-ĐHFPT
 * ngày 27/11/2025), nguồn: content/academy/_syllabus-flm/SSA101.json.
 * Bản trước (18 bài) là nội dung kỹ năng học tập chung chung, KHÔNG bám
 * syllabus trường — đã thay toàn bộ.
 *
 * MỨC ĐỘ: Mục 0 (khung FLM) và Chương 1 (buổi 1-12) là ĐẦY ĐỦ, dạy được
 * ngay. Chương 2 → 10 CHỈ LÀ KHUNG (tên đúng + 3-6 dòng mốc nội dung mỗi
 * bài) — bài giảng chi tiết sẽ bổ sung sau, KHÔNG tự ý viết dài thêm.
 *
 * Sách/tài liệu: theo lệnh 20/09/2026, MỌI giáo trình phải là thẻ
 * `.khoi-sach`/`.the-sach` (xem content/academy/_HOP-DONG-SOAN-BAI.md,
 * mục "SÁCH & TÀI LIỆU"), KHÔNG viết link như chữ thường. Bài 0.4 có đủ
 * 6 thẻ; sách nào được nhắc lại trong bài khác thì thẻ được dán lại ngay
 * tại đó.
 *
 * ⚠️ Nêu rõ 4 mâu thuẫn/ghi chú gốc từ FLM cho sinh viên (KHÔNG tự sửa):
 *   1. Trường dùng lẫn "CLO" (chuẩn đầu ra) và "LO" (bảng điểm & kế hoạch
 *      buổi) cho CÙNG MỘT khái niệm.
 *   2. Buổi 48 ghi tài liệu "College Success, chapter 5" trong khi cả cụm
 *      buổi 37-51 đều là chapter 7 — nhiều khả năng trường gõ nhầm.
 *   3. Tài liệu #1 "College Success" ghi NXB "University of Kansas
 *      Libraries" nhưng link trỏ openstax.org; bản in ghi ấn bản "2th".
 *   4. Tổng 7 đầu điểm = 100% (10+10+10+20+20+5+25), khớp đúng.
 *
 * Giữ NGUYÊN slug các bài đã có trong bản trước (tái sử dụng cho nội dung
 * mới tương ứng): ssa101-0-0-tai-lieu, ssa101-0-1-overview,
 * ssa101-1-1-transition-mindset, ssa101-3-1-note-taking,
 * ssa101-5-1-memory-learning, ssa101-2-1-time-goals, course.slug
 * ssa101-academic-skills. Bài MỚI dùng lối ssa101-<chương>-<số>-<mô tả>.
 *
 * ⚠️ KHÔNG backtick lồng hay ${ } bên trong các chuỗi nội dung bài học.
 * Bảng 60 buổi (0.5) và các thẻ sách dựng bằng nối chuỗi thường (biến +
 * "chuỗi"), không dùng template literal lồng, để tránh chính lỗi đó.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ─────────────────────────────────────────────────────────────────────────
// Thẻ sách dùng chung (.khoi-sach/.the-sach) — dựng bằng nối chuỗi thường,
// dán lại nguyên khối này ở bất kỳ bài nào nhắc tới cuốn sách tương ứng.
// ─────────────────────────────────────────────────────────────────────────
const sachCollegeSuccess =
  '<div class="khoi-sach">' +
  '<a class="the-sach chinh" href="https://openstax.org/details/books/college-success" target="_blank" rel="noopener">' +
  '<span class="sach-ico">📗</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">College Success</span>' +
  '<span class="sach-phu">Amy Baldwin và cộng sự · OpenStax / University of Kansas Libraries · 2020 · ấn bản "2th" (nguyên văn FLM)</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">Giáo trình chính</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Đọc online →</span>' +
  '</a></div>';

const sachAiEthics =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://edtechbooks.org/introduction_to_ai_and_ethics_in_higher_education" target="_blank" rel="noopener">' +
  '<span class="sach-ico">📘</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">AI and Ethics in Higher Education</span>' +
  '<span class="sach-phu">Hepler, Vecchione, Hensley, Fensie, Sinha, Otero, Riechers, Long, Liang, Randall &amp; Gladd · EdTech Books · 2024</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Đọc online →</span>' +
  '</a></div>';

const sachHocTrucTuyen =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://open.umn.edu/opentextbooks/textbooks/learning-to-learn-online" target="_blank" rel="noopener">' +
  '<span class="sach-ico">📙</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Learning to Learn Online</span>' +
  '<span class="sach-phu">Kwantlen Polytechnic University Learning Centres, Christina Page, Adam Vincent · 2018</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Đọc online →</span>' +
  '</a></div>' +
  '<p>⚠️ <strong>Bắt buộc hoàn thành khoá học trực tuyến này TRƯỚC buổi 21</strong> — bài <strong>Quiz (5%)</strong> ra đề trực tiếp từ nội dung khoá này.</p>';

const sachAcademicSpecialization =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://www.coursera.org/specializations/academic-skills" target="_blank" rel="noopener">' +
  '<span class="sach-ico">🎓</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Academic Skills for University Success Specialization</span>' +
  '<span class="sach-phu">Katherine Olston, Jessica Blackburn, Luke Alexander, Lydia Dutcher · The University of Sydney (Coursera)</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Mở khoá học →</span>' +
  '</a></div>';

const sachModernBlueprint =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://pressbooks.pub/modernblueprint" target="_blank" rel="noopener">' +
  '<span class="sach-ico">📕</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Modern Blueprint for College and Career Success</span>' +
  '<span class="sach-phu">Dave Dillon · Creative Commons Attribution</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Đọc online →</span>' +
  '</a></div>';

const sachAiForEveryone =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://www.coursera.org/learn/ai-for-everyone" target="_blank" rel="noopener">' +
  '<span class="sach-ico">🤖</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">AI for everyone on Coursera</span>' +
  '<span class="sach-phu">Andrew Ng · Coursera</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Mở khoá học →</span>' +
  '</a></div>';

// ─────────────────────────────────────────────────────────────────────────
// MỤC 0 — Khung FLM (đầy đủ, chính xác 100% theo Syllabus 13785)
// ─────────────────────────────────────────────────────────────────────────

const m01 = doc('ssa101-0-1-overview', '0.1 — Course profile (FLM Syllabus 13785)|||0.1 — Hồ sơ môn (FLM Syllabus 13785)',
  'Tên môn, mã môn, 3 tín chỉ, bậc học, phân bổ thời gian, môn tiên quyết, phương pháp dạy-học — nguyên văn FLM, kèm sylID + số quyết định để sinh viên tự kiểm chứng.',
  [[
    `<span class="eyebrow">SSA101 · Section 0 · 0.1 · Course profile</span>
<h2>Course profile — Academic skills (SSA101)</h2>
<p class="lead">The facts below are copied exactly as published on <strong>FLM</strong> (FPT University's syllabus system) so you can verify every number yourself.</p>
<table>
<tr><th>Field</th><th>Value (FLM)</th></tr>
<tr><td>Syllabus Name</td><td>Kỹ năng học thuật</td></tr>
<tr><td>Course Name (English)</td><td>Academic skills</td></tr>
<tr><td>Subject Code</td><td>SSA101</td></tr>
<tr><td>Credits</td><td>3</td></tr>
<tr><td>Degree Level</td><td>Bachelor</td></tr>
<tr><td>Time Allocation</td><td>Study hour (150h) = 45 contact hours (60 sessions) + 1 hour final exam + 104 hours self-study</td></tr>
<tr><td>Pre-Requisite</td><td>None</td></tr>
<tr><td>Learning-Teaching Method</td><td>Project-based learning</td></tr>
<tr><td>Scoring Scale</td><td>10</td></tr>
<tr><td>Min. average mark to pass</td><td>5</td></tr>
<tr><td>Decision No.</td><td>1318/QĐ-ĐHFPT dated 11/27/2025</td></tr>
<tr><td>Syllabus ID</td><td>13785</td></tr>
</table>
<div class="callout"><span class="badge">Self-check</span> Every figure above is taken verbatim from FLM — Syllabus ID <strong>13785</strong>, issued under Decision <strong>1318/QĐ-ĐHFPT dated 11/27/2025</strong>. Original: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13785" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13785)</a>.</div>
<p><em>Course description (FLM):</em> This course introduces essential academic skills for university success, focusing on effective study habits, critical and creative thinking, academic communication, and the responsible use of AI. Students will explore three key areas: AI and academic integrity, thinking skills for the digital age, and learning and communication at university. The course emphasizes self-directed learning and helps students manage their study, time, and learning strategies effectively in both traditional and online settings.</p>
<p><em>Nguồn: FLM · Syllabus 13785 · QĐ 1318/QĐ-ĐHFPT ngày 27/11/2025.</em></p>`,
    `<span class="eyebrow">SSA101 · Mục 0 · 0.1 · Hồ sơ môn</span>
<h2>Hồ sơ môn — Kỹ năng học thuật (SSA101)</h2>
<p class="lead">Toàn bộ thông tin dưới đây lấy nguyên văn từ <strong>FLM</strong> (hệ thống syllabus của FPTU) để bạn tự đối chiếu.</p>
<table>
<tr><th>Trường</th><th>Giá trị (FLM)</th></tr>
<tr><td>Tên syllabus</td><td>Kỹ năng học thuật</td></tr>
<tr><td>Tên môn (tiếng Anh)</td><td>Academic skills</td></tr>
<tr><td>Mã môn</td><td>SSA101</td></tr>
<tr><td>Số tín chỉ</td><td>3</td></tr>
<tr><td>Bậc học</td><td>Đại học (Bachelor)</td></tr>
<tr><td>Phân bổ thời gian</td><td>150 giờ học = 45 giờ lên lớp (60 buổi) + 1 giờ thi cuối kỳ + 104 giờ tự học</td></tr>
<tr><td>Môn tiên quyết</td><td>Không có</td></tr>
<tr><td>Phương pháp dạy-học</td><td>Học theo dự án (Project-based learning)</td></tr>
<tr><td>Thang điểm</td><td>10</td></tr>
<tr><td>Điểm trung bình tối thiểu để qua môn</td><td>5</td></tr>
<tr><td>Số quyết định</td><td>1318/QĐ-ĐHFPT ngày 27/11/2025</td></tr>
<tr><td>Syllabus ID</td><td>13785</td></tr>
</table>
<div class="callout"><span class="badge">Tự kiểm chứng</span> Mọi con số trên lấy nguyên văn từ FLM — Syllabus ID <strong>13785</strong>, ban hành theo Quyết định <strong>1318/QĐ-ĐHFPT ngày 27/11/2025</strong>. Bản gốc: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13785" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13785)</a>.</div>
<p><em>Mô tả môn (FLM, dịch):</em> Môn học giới thiệu các kỹ năng học thuật thiết yếu để thành công ở đại học, tập trung vào thói quen học tập hiệu quả, tư duy phản biện &amp; sáng tạo, giao tiếp học thuật, và dùng AI có trách nhiệm. Sinh viên khám phá ba mảng chính: AI &amp; liêm chính học thuật, kỹ năng tư duy cho thời đại số, và học tập &amp; giao tiếp ở đại học. Môn nhấn mạnh tự học và giúp sinh viên quản lý việc học, thời gian và chiến lược học tập hiệu quả cả trong lớp lẫn trực tuyến.</p>
<p><em>Nguồn: FLM · Syllabus 13785 · QĐ 1318/QĐ-ĐHFPT ngày 27/11/2025.</em></p>`,
  ]]);

const m02 = doc('ssa101-0-2-cach-tinh-diem', '0.2 — Grading breakdown: 7 items, 100%|||0.2 — Cách tính điểm: 7 đầu điểm, tổng 100%',
  'Đủ 7 đầu điểm với trọng số đúng nguyên văn FLM — tổng 10+10+10+20+20+5+25 = 100%. Kèm thời điểm, thời lượng, CLO/LO, dạng câu hỏi, cách chấm.',
  [[
    `<span class="eyebrow">SSA101 · Section 0 · 0.2 · Grading</span>
<h2>Grading breakdown — 7 items, total 100%</h2>
<p class="lead">Scale: <strong>10</strong>. Pass mark: average ≥ <strong>5</strong>. You must attend more than 80% of contact slots to be accepted to the final exam.</p>
<table>
<tr><th>#</th><th>Item (FLM)</th><th>Weight</th><th>When</th><th>Duration</th><th>LO</th><th>Type</th></tr>
<tr><td>1</td><td>Individual Progress Test</td><td>10%</td><td>Week 9</td><td>60-90'</td><td>LO1-10</td><td>Multiple choice or Essay</td></tr>
<tr><td>2</td><td>Participation</td><td>10%</td><td>Week 1-10</td><td>ongoing</td><td>LO1-10</td><td>based on schedule's course</td></tr>
<tr><td>3</td><td>Project Part 1 - Proposal & Presentation</td><td>10%</td><td>Week 3-4</td><td>60-90'</td><td>LO1,2,3,4,5</td><td>Group project</td></tr>
<tr><td>4</td><td>Project Part 2 - Project Execution</td><td>20%</td><td>Week 7</td><td>60-90'</td><td>LO5,6,7,8</td><td>Group project</td></tr>
<tr><td>5</td><td>Project Part 3 - Final Report & Presentation</td><td>20%</td><td>Week 10</td><td>60-90'</td><td>LO1-10</td><td>Group project</td></tr>
<tr><td>6</td><td>Quiz</td><td>5%</td><td>Week 4-5</td><td>30'</td><td>LO2, LO4, LO8</td><td>based on "Learning to Learn Online"</td></tr>
<tr><td>7</td><td>Final Exam</td><td>25%</td><td>end of term</td><td>60'</td><td>LO1-LO10</td><td>50 MCQ, computer-graded</td></tr>
</table>
<p><strong>Total: 10% + 10% + 10% + 20% + 20% + 5% + 25% = 100%.</strong></p>
` + sachHocTrucTuyen + `
<div class="callout"><span class="badge">Notes</span>
<ul>
<li>The <strong>Individual Progress Test</strong> must be taken right after the last lecture of the required material.</li>
<li><strong>Final Exam</strong> questions must differ at least 70% from previous exams.</li>
<li>You must attend <strong>more than 80%</strong> of contact slots to sit the final exam.</li>
</ul></div>`,
    `<span class="eyebrow">SSA101 · Mục 0 · 0.2 · Cách tính điểm</span>
<h2>Cách tính điểm — 7 đầu điểm, tổng 100%</h2>
<p class="lead">Thang điểm: <strong>10</strong>. Qua môn khi điểm trung bình ≥ <strong>5</strong>/10. Phải dự lớp hơn 80% số buổi mới đủ điều kiện dự thi cuối kỳ.</p>
<table>
<tr><th>#</th><th>Đầu điểm (nguyên văn FLM)</th><th>Trọng số</th><th>Thời điểm</th><th>Thời lượng</th><th>CLO/LO</th><th>Dạng bài</th></tr>
<tr><td>1</td><td>Individual Progress Test <span class="sach-phu">(Kiểm tra tiến độ cá nhân)</span></td><td>10%</td><td>Tuần 9</td><td>60-90'</td><td>LO1-10</td><td>Trắc nghiệm hoặc tự luận, chấm trong lớp bởi giảng viên</td></tr>
<tr><td>2</td><td>Participation <span class="sach-phu">(Tham gia lớp học)</span></td><td>10%</td><td>Tuần 1-10</td><td>xuyên suốt</td><td>LO1-10</td><td>Điểm danh, đóng góp thảo luận, hoạt động lớp, phản hồi ngắn</td></tr>
<tr><td>3</td><td>Project Part 1 - Proposal & Presentation <span class="sach-phu">(Đồ án Phần 1 — Đề xuất &amp; thuyết trình)</span></td><td>10%</td><td>Tuần 3-4</td><td>60-90'</td><td>LO1,2,3,4,5</td><td>Theo Group project — giảng viên hướng dẫn</td></tr>
<tr><td>4</td><td>Project Part 2 - Project Execution <span class="sach-phu">(Đồ án Phần 2 — Triển khai)</span></td><td>20%</td><td>Tuần 7</td><td>60-90'</td><td>LO5,6,7,8</td><td>Theo Group project — trong hoặc ngoài lớp</td></tr>
<tr><td>5</td><td>Project Part 3 - Final Report & Presentation <span class="sach-phu">(Đồ án Phần 3 — Báo cáo &amp; thuyết trình cuối)</span></td><td>20%</td><td>Tuần 10</td><td>60-90'</td><td>LO1-10</td><td>Theo Group project — trong lớp</td></tr>
<tr><td>6</td><td>Quiz <span class="sach-phu">(Kiểm tra nhanh)</span></td><td>5%</td><td>Tuần 4-5</td><td>30'</td><td>LO2, LO4, LO8</td><td>Ra đề từ giáo trình mở "Learning to Learn Online"</td></tr>
<tr><td>7</td><td>Final Exam <span class="sach-phu">(Thi cuối kỳ)</span></td><td>25%</td><td>cuối kỳ</td><td>60'</td><td>LO1-LO10</td><td>50 câu trắc nghiệm, chấm bằng máy</td></tr>
</table>
<p><strong>Tổng: 10% + 10% + 10% + 20% + 20% + 5% + 25% = 100%.</strong></p>
` + sachHocTrucTuyen + `
<div class="callout"><span class="badge">Ghi chú</span>
<ul>
<li><strong>Individual Progress Test</strong> phải làm ngay sau buổi giảng cuối của nội dung yêu cầu; giảng viên có trách nhiệm chữa bài sau khi chấm.</li>
<li><strong>Final Exam</strong>: đề phải khác tối thiểu 70% so với đề trước.</li>
<li>Phải dự lớp <strong>hơn 80%</strong> số buổi mới đủ điều kiện dự thi cuối kỳ.</li>
</ul></div>`,
  ]]);

const m03 = doc('ssa101-0-3-clo', '0.3 — Course Learning Outcomes (11 CLO / LO)|||0.3 — Chuẩn đầu ra môn học (11 CLO / LO)',
  'Nguyên văn 11 CLO tiếng Anh + bản dịch. Trường dùng lẫn "CLO" (bảng chuẩn đầu ra) và "LO" (bảng điểm, kế hoạch buổi) cho CÙNG một khái niệm.',
  [[
    `<span class="eyebrow">SSA101 · Section 0 · 0.3 · CLO</span>
<h2>Course Learning Outcomes — 11 CLO</h2>
<div class="callout"><span class="badge">⚠️ Naming note</span> FLM uses <strong>"CLO"</strong> in the outcomes table below, but the <strong>grading table (0.2)</strong> and the <strong>60-session plan (0.5)</strong> label the exact same outcomes as <strong>"LO"</strong> (LO1-LO11). They are the same thing — just an inconsistent label in FLM's own documents.</div>
<table>
<tr><th>#</th><th>CLO / LO</th><th>Detail (nguyên văn FLM)</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand concepts of university learning expectations and student responsibilities.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Apply effective study and memory strategies.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Identify test-taking strategies used in academic assessments.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Plan academic goals and manage study time effectively.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Implement strategies to manage academic stress and maintain well-being.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Demonstrate effective communication in academic contexts.</td></tr>
<tr><td>7</td><td>CLO7</td><td>Utilize digital learning tools and online learning strategies.</td></tr>
<tr><td>8</td><td>CLO8</td><td>Practice responsible and ethical use of AI in academic work.</td></tr>
<tr><td>9</td><td>CLO9</td><td>Evaluate the credibility of academic information sources.</td></tr>
<tr><td>10</td><td>CLO10</td><td>Apply thinking skills to analyze learning problems using critical or creative approaches.</td></tr>
<tr><td>11</td><td>CLO11</td><td>Integrate academic skills in practical learning tasks or project work.</td></tr>
</table>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Mục 0 · 0.3 · Chuẩn đầu ra</span>
<h2>Chuẩn đầu ra môn học — 11 CLO</h2>
<div class="callout"><span class="badge">⚠️ Lưu ý cách gọi</span> FLM dùng <strong>"CLO"</strong> ở bảng chuẩn đầu ra dưới đây, nhưng <strong>bảng điểm (0.2)</strong> và <strong>kế hoạch 60 buổi (0.5)</strong> lại gọi CHÍNH những chuẩn đầu ra này là <strong>"LO"</strong> (LO1-LO11). Đây là CÙNG MỘT THỨ — chỉ là trường dùng nhãn không thống nhất giữa các bảng của chính họ.</div>
<table>
<tr><th>#</th><th>CLO / LO</th><th>Nội dung (nguyên văn FLM)</th><th>Bản dịch</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand concepts of university learning expectations and student responsibilities.</td><td>Hiểu các khái niệm về kỳ vọng học tập ở đại học và trách nhiệm của sinh viên.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Apply effective study and memory strategies.</td><td>Áp dụng các chiến lược học tập và ghi nhớ hiệu quả.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Identify test-taking strategies used in academic assessments.</td><td>Nhận diện các chiến lược làm bài thi dùng trong đánh giá học thuật.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Plan academic goals and manage study time effectively.</td><td>Lập mục tiêu học tập và quản lý thời gian học hiệu quả.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Implement strategies to manage academic stress and maintain well-being.</td><td>Áp dụng chiến lược quản lý căng thẳng học tập và duy trì sức khoẻ tinh thần.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Demonstrate effective communication in academic contexts.</td><td>Thể hiện giao tiếp hiệu quả trong bối cảnh học thuật.</td></tr>
<tr><td>7</td><td>CLO7</td><td>Utilize digital learning tools and online learning strategies.</td><td>Sử dụng công cụ học tập số và chiến lược học trực tuyến.</td></tr>
<tr><td>8</td><td>CLO8</td><td>Practice responsible and ethical use of AI in academic work.</td><td>Thực hành dùng AI có trách nhiệm và đạo đức trong học tập.</td></tr>
<tr><td>9</td><td>CLO9</td><td>Evaluate the credibility of academic information sources.</td><td>Đánh giá độ tin cậy của nguồn thông tin học thuật.</td></tr>
<tr><td>10</td><td>CLO10</td><td>Apply thinking skills to analyze learning problems using critical or creative approaches.</td><td>Áp dụng kỹ năng tư duy để phân tích vấn đề học tập bằng cách tiếp cận phản biện hoặc sáng tạo.</td></tr>
<tr><td>11</td><td>CLO11</td><td>Integrate academic skills in practical learning tasks or project work.</td><td>Tích hợp kỹ năng học thuật vào nhiệm vụ học tập thực tế hoặc đồ án.</td></tr>
</table>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const m04 = doc('ssa101-0-0-tai-lieu', '0.4 — Course materials & tools (6 items, all free)|||0.4 — Giáo trình & công cụ (6 mục, tất cả miễn phí)',
  'Đủ 6 giáo trình FLM dạng thẻ sách bấm được — tất cả đọc online miễn phí. Tài liệu chính: College Success (OpenStax).',
  [[
    `<span class="eyebrow">SSA101 · Section 0 · 0.4 · Materials</span>
<h2>Course materials &amp; tools</h2>
<p class="lead">All <strong>6</strong> official FLM materials for SSA101 — every single one is <strong>free to read online</strong>. The <strong>main material</strong> is <em>College Success</em> (OpenStax).</p>
` + sachCollegeSuccess + `
` + sachAiEthics + `
` + sachHocTrucTuyen + `
` + sachAcademicSpecialization + `
` + sachModernBlueprint + `
` + sachAiForEveryone + `
<div class="callout"><span class="badge">⚠️ FLM data quirks — kept as-is</span>
<ul>
<li>Material #1 lists publisher as <strong>"University of Kansas Libraries"</strong> even though the link points to <strong>openstax.org</strong>, and the printed edition says <strong>"2th"</strong> — FLM's own wording, not a typo we introduced.</li>
</ul></div>
<h3>Tools</h3>
<p>Internet (FLM: "Tools: Internet").</p>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Mục 0 · 0.4 · Giáo trình &amp; công cụ</span>
<h2>Giáo trình &amp; công cụ</h2>
<p class="lead">Đủ <strong>6</strong> tài liệu chính thức của FLM cho SSA101 — cả 6 đều <strong>đọc online miễn phí</strong>. Tài liệu <strong>chính</strong> là <em>College Success</em> (OpenStax).</p>
` + sachCollegeSuccess + `
` + sachAiEthics + `
` + sachHocTrucTuyen + `
` + sachAcademicSpecialization + `
` + sachModernBlueprint + `
` + sachAiForEveryone + `
<div class="callout"><span class="badge">⚠️ FLM ghi vậy, giữ nguyên</span>
<ul>
<li>Tài liệu #1 ghi NXB <strong>"University of Kansas Libraries"</strong> dù link trỏ tới <strong>openstax.org</strong>, và bản in ghi ấn bản <strong>"2th"</strong> — đây là FLM ghi vậy, không phải lỗi chúng tôi thêm vào.</li>
</ul></div>
<h3>Công cụ</h3>
<p>Internet (FLM: "Tools: Internet").</p>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

// ── 0.5 — Kế hoạch 60 buổi: dựng bằng nối chuỗi thường (KHÔNG template lồng) ──
const buoiData = [
  [1, "Ice-breaking and Course introduction. Session I. Effective Learning Skills - Exploring College: Introduction; Why College?; The First Year of College Will Be an Experience", "Làm quen &amp; giới thiệu môn. Buổi I. Kỹ năng học hiệu quả - Khám phá đại học: Nhập môn; Vì sao vào đại học?; Trải nghiệm năm nhất", "LO1", "Ch.1 · 1.1"],
  [2, "Exploring College (cont): College culture and expectations. Discussion and Practice", "Khám phá đại học (tiếp): Văn hoá &amp; kỳ vọng ở đại học. Thảo luận &amp; thực hành", "LO1", "Ch.1 · 1.1"],
  [3, "Exploring College (cont): College culture and expectations. Discussion and Practice", "Khám phá đại học (tiếp): Văn hoá &amp; kỳ vọng ở đại học. Thảo luận &amp; thực hành", "LO1, LO11", "Ch.1 · 1.1"],
  [4, "Studying, memory and Test taking: Introduction; Memory. Discussion and Practice", "Học tập, ghi nhớ &amp; làm bài thi: Nhập môn; Trí nhớ. Thảo luận &amp; thực hành", "LO1, LO11", "Ch.1 · 1.3"],
  [5, "Studying, memory and Test taking: Introduction; Studying. Discussion and Practice", "Học tập, ghi nhớ &amp; làm bài thi: Nhập môn; Cách học. Thảo luận &amp; thực hành", "LO2, LO11", "Ch.1 · 1.2"],
  [6, "Studying, memory and Test taking (cont): Test taking. Discussion and Practice", "Học tập, ghi nhớ &amp; làm bài thi (tiếp): Kỹ năng làm bài thi. Thảo luận &amp; thực hành", "LO2, LO11", "Ch.1 · 1.3"],
  [7, "Time Management Skills: Introduction; The Benefits of Time Management. Discussion and Practice", "Quản lý thời gian: Nhập môn; Lợi ích của quản lý thời gian. Thảo luận &amp; thực hành", "LO3, LO11", "Ch.1 · 1.4"],
  [8, "Time Management Skills (cont.): Time Management in College. Discussion and Practice", "Quản lý thời gian (tiếp): Quản lý thời gian ở đại học. Thảo luận &amp; thực hành", "LO4, LO11", "Ch.1 · 1.4"],
  [9, "Time Management Skills (cont.): Procrastination: The Enemy Within; How to Manage Time. Discussion and Practice", "Quản lý thời gian (tiếp): Trì hoãn - kẻ thù bên trong; Cách quản lý thời gian. Thảo luận &amp; thực hành", "LO4, LO11", "Ch.1 · 1.4"],
  [10, "Time Management Skills (cont.): Prioritization: Self-Management of What You Do and When You Do It; Goal Setting and Motivation. Discussion and Practice", "Quản lý thời gian (tiếp): Ưu tiên hoá - tự quản việc &amp; thời điểm làm; Đặt mục tiêu &amp; động lực. Thảo luận &amp; thực hành", "LO4, LO11", "Ch.1 · 1.4"],
  [11, "Time Management Skills (cont.): Enhanced Strategies for Time. Discussion and Practice", "Quản lý thời gian (tiếp): Chiến lược nâng cao cho thời gian. Thảo luận &amp; thực hành", "LO4, LO5, LO11", "Ch.1 · 1.4"],
  [12, "Time Management Skills (cont.): Identifying and Managing Stress. Discussion and Practice", "Quản lý thời gian (tiếp): Nhận diện &amp; quản lý căng thẳng. Thảo luận &amp; thực hành", "LO6, LO11", "Ch.1 · 1.4"],
  [13, "Part1 Project - Topic selection and planning", "Đồ án Phần 1 - Chọn đề tài &amp; lên kế hoạch", "LO6, LO11", "Ch.2 · 2.1"],
  [14, "Part1 Project - Research and preparation", "Đồ án Phần 1 - Nghiên cứu &amp; chuẩn bị", "LO6, LO11", "Ch.2 · 2.2"],
  [15, "Part1 Project - Research and preparation", "Đồ án Phần 1 - Nghiên cứu &amp; chuẩn bị", "LO6", "Ch.2 · 2.2"],
  [16, "Communication Skills: Introduction; An Overview of Communication; Purpose of Communication; Communication and Technology", "Kỹ năng giao tiếp: Nhập môn; Tổng quan giao tiếp; Mục đích giao tiếp; Giao tiếp &amp; công nghệ", "LO6, LO11", "Ch.3 · 3.1"],
  [17, "Communication Skills (cont.): Communication and Technology. Discussion and Practice", "Kỹ năng giao tiếp (tiếp): Giao tiếp &amp; công nghệ. Thảo luận &amp; thực hành", "LO6, LO11", "Ch.3 · 3.1"],
  [18, "Communication Skills (cont.): The Context of Communication; Barriers to Effective Communication. Discussion and Practice", "Kỹ năng giao tiếp (tiếp): Bối cảnh giao tiếp; Rào cản giao tiếp hiệu quả. Thảo luận &amp; thực hành", "LO6, LO11", "Ch.3 · 3.2"],
  [19, "Learning to Learn Online: 1. Who am I as an online learner? 2. Who am I on my learning journey with? 3. Who are my instructors? What is their role?", "Học trực tuyến hiệu quả: 1. Mình là người học trực tuyến thế nào? 2. Mình học cùng ai? 3. Giảng viên của mình là ai, vai trò gì?", "LO6, LO11", "Ch.4 · 4.1"],
  [20, "Learning to Learn Online: 1. Who am I as an online learner? 2. Who am I on my learning journey with? 3. Who are my instructors? What is their role?", "Học trực tuyến hiệu quả: 1. Mình là người học trực tuyến thế nào? 2. Mình học cùng ai? 3. Giảng viên của mình là ai, vai trò gì?", "LO6, LO11", "Ch.4 · 4.1"],
  [21, "Learning to Learn Online: 1. Who am I as an online learner? 2. Who am I on my learning journey with? 3. Who are my instructors? What is their role?", "Học trực tuyến hiệu quả: 1. Mình là người học trực tuyến thế nào? 2. Mình học cùng ai? 3. Giảng viên của mình là ai, vai trò gì?", "LO7, LO11", "Ch.4 · 4.1"],
  [22, "Information Literacy. Discussion and Practice", "Năng lực thông tin. Thảo luận &amp; thực hành", "LO7, LO11", "Ch.5 · 5.1"],
  [23, "Information Literacy. Discussion and Practice", "Năng lực thông tin. Thảo luận &amp; thực hành", "LO1-LO7", "Ch.5 · 5.1"],
  [24, "Review session I. Quiz 1", "Ôn tập buổi I. Quiz 1", "LO8, LO11", "Ch.5 · 5.2"],
  [25, "Session II. Issues in AI Use and Academic Ethics - Introduction AI and Ethics in Higher Education", "Buổi II. Vấn đề dùng AI &amp; đạo đức học thuật - Nhập môn AI và đạo đức trong giáo dục đại học", "LO8, LO11", "Ch.6 · 6.1"],
  [26, "AI and Digital Literacy: What is Digital Literacy?; AI Literacy; The Benefits and Drawbacks of AI", "AI &amp; năng lực số: Năng lực số là gì?; Năng lực AI; Lợi ích &amp; hạn chế của AI", "LO8, LO11", "Ch.6 · 6.1"],
  [27, "AI and Digital Literacy (cont.): Privacy; AI Hallucinations; AI Accountability. Discussion and Practice", "AI &amp; năng lực số (tiếp): Quyền riêng tư; AI ảo giác; Trách nhiệm giải trình của AI", "LO8, LO11", "Ch.6 · 6.1"],
  [28, "Ethics of Using AI in Higher Education and Its Impact on Academic Integrity: Implications of Using AI; Ethical Challenges; Ethical Concerns About Biases and Surveillance in AI Algorithms", "Đạo đức dùng AI &amp; tác động tới liêm chính học thuật: Hệ luỵ dùng AI; Thách thức đạo đức; Lo ngại thiên lệch &amp; giám sát trong thuật toán AI", "LO8, LO11", "Ch.6 · 6.2"],
  [29, "Ethics of Using AI (cont): Academic Integrity in Higher Education Under the Lens of AI; Impact on Academic Integrity in the Form of Plagiarism Due to AI Tools", "Đạo đức dùng AI (tiếp): Liêm chính học thuật dưới góc nhìn AI; Đạo văn do công cụ AI", "LO8, LO11", "Ch.6 · 6.2"],
  [30, "Ethics of Using AI (cont): Impact on Academic Integrity Due to Efficacy of AI Detection Tools; Impact Due to Human Biases Generated By AI tools", "Đạo đức dùng AI (tiếp): Tác động do hiệu quả công cụ phát hiện AI; Tác động do thiên lệch từ công cụ AI", "LO8, LO11", "Ch.6 · 6.2"],
  [31, "How to use AI to Help, Not Hinder, Your Learning", "Cách dùng AI để hỗ trợ, không cản trở việc học", "LO9, LO11", "Ch.6 · 6.3"],
  [32, "How to use AI to Help, Not Hinder, Your Learning (cont.). Discussion and Practice", "Cách dùng AI để hỗ trợ, không cản trở việc học (tiếp). Thảo luận &amp; thực hành", "LO9, LO11", "Ch.6 · 6.3"],
  [33, "Review session II", "Ôn tập buổi II", "LO8-LO9", "Ch.6 · 6.3"],
  [34, "Part2 Project - Application of knowledge to practice", "Đồ án Phần 2 - Áp dụng kiến thức vào thực tiễn", "LO6, LO11", "Ch.7 · 7.1"],
  [35, "Part2 Project - Application of knowledge to practice", "Đồ án Phần 2 - Áp dụng kiến thức vào thực tiễn", "LO6, LO11", "Ch.7 · 7.1"],
  [36, "Part2 Project - Application of knowledge to practice", "Đồ án Phần 2 - Áp dụng kiến thức vào thực tiễn", "LO6, LO11", "Ch.7 · 7.1"],
  [37, "Session III. Thinking Skills for the Digital Age: What thinking means; Analytical Thinking", "Buổi III. Tư duy cho thời đại số: Tư duy là gì; Tư duy phân tích", "LO10", "Ch.8 · 8.1"],
  [38, "Analytical Thinking - Discussion and Practice", "Tư duy phân tích - Thảo luận &amp; thực hành", "LO10, LO11", "Ch.8 · 8.1"],
  [39, "Analytical Thinking - Discussion and Practice", "Tư duy phân tích - Thảo luận &amp; thực hành", "LO10", "Ch.8 · 8.1"],
  [40, "Creative thinking", "Tư duy sáng tạo", "LO10, LO11", "Ch.8 · 8.2"],
  [41, "Creative thinking - Discussion and Practice", "Tư duy sáng tạo - Thảo luận &amp; thực hành", "LO10, LO11", "Ch.8 · 8.2"],
  [42, "Creative thinking - Discussion and Practice", "Tư duy sáng tạo - Thảo luận &amp; thực hành", "LO10", "Ch.8 · 8.2"],
  [43, "Critical thinking", "Tư duy phản biện", "LO10, LO11", "Ch.8 · 8.3"],
  [44, "Critical thinking - Discussion and Practice", "Tư duy phản biện - Thảo luận &amp; thực hành", "LO10, LO11", "Ch.8 · 8.3"],
  [45, "Critical thinking - Discussion and Practice", "Tư duy phản biện - Thảo luận &amp; thực hành", "LO10", "Ch.8 · 8.3"],
  [46, "Problem - Solving", "Giải quyết vấn đề", "LO10, LO11", "Ch.8 · 8.4"],
  [47, "Problem - Solving - Discussion and Practice", "Giải quyết vấn đề - Thảo luận &amp; thực hành", "LO10, LO11", "Ch.8 · 8.4"],
  [48, "Problem - Solving - Discussion and Practice ⚠️ (tài liệu FLM ghi \"chapter 5\", các buổi 37-51 khác đều ghi chapter 7)", "Giải quyết vấn đề - Thảo luận &amp; thực hành ⚠️ (FLM ghi tài liệu \"chapter 5\" — khác các buổi 37-51 còn lại đều là chapter 7, có thể trường gõ nhầm, giữ nguyên)", "LO10", "Ch.8 · 8.4"],
  [49, "Metacognition", "Siêu nhận thức (Metacognition)", "LO10, LO11", "Ch.8 · 8.5"],
  [50, "Metacognition - Discussion and Practice", "Siêu nhận thức - Thảo luận &amp; thực hành", "LO10, LO11", "Ch.8 · 8.5"],
  [51, "Discussion and Practice. Review session III", "Thảo luận &amp; thực hành. Ôn tập buổi III", "LO10", "Ch.8 · 8.5"],
  [52, "Individual Progress Test", "Kiểm tra tiến độ cá nhân", "LO1-10", "Ch.9 · 9.1"],
  [53, "Individual Progress Test", "Kiểm tra tiến độ cá nhân", "LO1-10", "Ch.9 · 9.1"],
  [54, "Individual Progress Test", "Kiểm tra tiến độ cá nhân", "LO1-11", "Ch.9 · 9.1"],
  [55, "Group Project Part 3: Presentation &amp; Final report of group project", "Đồ án nhóm Phần 3: Thuyết trình &amp; báo cáo cuối", "LO1-11", "Ch.10 · 10.1"],
  [56, "Group Project Part 3: Presentation &amp; Final report of group project", "Đồ án nhóm Phần 3: Thuyết trình &amp; báo cáo cuối", "LO1-11", "Ch.10 · 10.1"],
  [57, "Group Project Part 3: Presentation &amp; Final report of group project", "Đồ án nhóm Phần 3: Thuyết trình &amp; báo cáo cuối", "LO1-11", "Ch.10 · 10.1"],
  [58, "Group Project Part 3: Presentation &amp; Final report of group project (cont)", "Đồ án nhóm Phần 3: Thuyết trình &amp; báo cáo cuối (tiếp)", "LO1-11", "Ch.10 · 10.1"],
  [59, "Group Project Part 3: Presentation &amp; Final report of group project (cont)", "Đồ án nhóm Phần 3: Thuyết trình &amp; báo cáo cuối (tiếp)", "LO1-10", "Ch.10 · 10.2"],
  [60, "Revise course content and prepare for the final examination.", "Ôn tập nội dung môn học &amp; chuẩn bị cho kỳ thi cuối kỳ.", "LO1-10", "Ch.10 · 10.2"],
];
const rowHtml = (r) => '<tr><td>Buổi ' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>';
const buoiRowsHtml = buoiData.map(rowHtml).join('');
const buoiTableEn =
  '<table><tr><th>Session</th><th>Topic (English, verbatim FLM)</th><th>Chủ đề (Việt)</th><th>LO</th><th>Lesson on site</th></tr>' +
  buoiRowsHtml + '</table>';
const buoiTableVi =
  '<table><tr><th>Buổi</th><th>Chủ đề (Anh, nguyên văn FLM)</th><th>Chủ đề (Việt)</th><th>LO</th><th>Bài trên web</th></tr>' +
  buoiRowsHtml + '</table>';

const m05 = doc('ssa101-0-5-ke-hoach-60-buoi', '0.5 — Full 60-session plan|||0.5 — Kế hoạch đủ 60 buổi',
  'Bảng đầy đủ 60 buổi FLM, giữ nguyên chủ đề tiếng Anh + thêm cột tiếng Việt + cột "Bài trên web" để đối chiếu. Nêu rõ chỗ FLM có vẻ gõ nhầm (buổi 48).',
  [[
    '<span class="eyebrow">SSA101 · Section 0 · 0.5 · 60-session plan</span>' +
    '<h2>Full 60-session plan (FLM, verbatim topics)</h2>' +
    '<p class="lead">All 45 contact hours (60 sessions) exactly as scheduled by FLM. The last column shows which lesson on this site covers each session — Chapter 1 is fully taught; Chapters 2-10 are a framework (skeleton) for now.</p>' +
    buoiTableEn +
    '<div class="callout"><span class="badge">⚠️ Kept as FLM published it</span><p>Session 48 lists student material as <strong>"College Success, chapter 5"</strong> while every other session in the 37-51 block cites <strong>chapter 7</strong> — most likely a typo in FLM\'s own table. We report it as published rather than silently correcting it.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13785 · thu thập 19/09/2026.</em></p>',
    '<span class="eyebrow">SSA101 · Mục 0 · 0.5 · Kế hoạch 60 buổi</span>' +
    '<h2>Kế hoạch đủ 60 buổi (nguyên văn chủ đề FLM)</h2>' +
    '<p class="lead">Đủ 45 giờ lên lớp (60 buổi) đúng như FLM xếp lịch. Cột cuối cho biết bài nào trên web phủ buổi đó — Chương 1 dạy đầy đủ; Chương 2-10 hiện là khung, sẽ bổ sung chi tiết sau.</p>' +
    buoiTableVi +
    '<div class="callout"><span class="badge">⚠️ Giữ nguyên như FLM công bố</span><p>Buổi 48 ghi tài liệu sinh viên là <strong>"College Success, chapter 5"</strong> trong khi cả cụm buổi 37-51 còn lại đều ghi <strong>chapter 7</strong> — nhiều khả năng là lỗi gõ trong chính bảng của FLM. Chúng tôi nêu đúng như trường công bố, KHÔNG tự sửa.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13785 · thu thập 19/09/2026.</em></p>',
  ]]);

const m06 = doc('ssa101-0-6-nhiem-vu-sinh-vien', '0.6 — Student tasks (4 items, verbatim)|||0.6 — Nhiệm vụ sinh viên (nguyên văn 4 gạch đầu dòng)',
  'Nguyên văn 4 nhiệm vụ sinh viên theo FLM (StudentTasks), kèm bản dịch.',
  [[
    `<span class="eyebrow">SSA101 · Section 0 · 0.6 · Student tasks</span>
<h2>Student tasks (FLM, verbatim)</h2>
<ul>
<li>Students must attend more than 80% of contact slots in order to be accepted to the final examination.</li>
<li>Student is responsible to do all exercises, assignments and labs given by instructor in class or at home and submit on time</li>
<li>Use laptop in class only for learning purpose</li>
<li>Promptly access the FLM system at <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">https://flm.fpt.edu.vn</a> for up-to-date course information.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Mục 0 · 0.6 · Nhiệm vụ sinh viên</span>
<h2>Nhiệm vụ sinh viên (nguyên văn FLM, dịch)</h2>
<ul>
<li>Sinh viên phải dự lớp hơn 80% số buổi mới đủ điều kiện dự thi cuối kỳ.</li>
<li>Sinh viên có trách nhiệm làm mọi bài tập, assignment và lab do giảng viên giao, trong lớp hoặc ở nhà, và nộp đúng hạn.</li>
<li>Chỉ dùng laptop trong lớp cho mục đích học tập.</li>
<li>Truy cập kịp thời hệ thống FLM tại <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">https://flm.fpt.edu.vn</a> để cập nhật thông tin môn học.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1-12): Exploring College · Studying, Memory &
// Test Taking · Time Management. Dạy được ngay, song ngữ, có ví dụ FPTU,
// bảng/checklist, bài tập tự làm có gợi ý. Kết chương bằng 1 quiz.
// ─────────────────────────────────────────────────────────────────────────

const c1 = doc('ssa101-1-1-transition-mindset', '1.1 — Exploring College (buổi 1-3, LO1)|||1.1 — Khám phá đại học (buổi 1-3, LO1)',
  'Buổi 1-3, LO1. Khác biệt phổ thông ↔ đại học; văn hoá &amp; kỳ vọng ở đại học; tư duy phát triển (Dweck, bổ sung) giúp vượt qua cú sốc năm nhất.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 1 · Lesson 1.1 · Buổi 1-3 · LO1</span>
<h2>Exploring College</h2>
<p class="lead">FLM topic (buổi 1-3): <em>"Exploring College: Introduction; Why College?; The First Year of College Will Be an Experience"</em> and <em>"College culture and expectations"</em>.</p>
` + sachCollegeSuccess + `
<h3>School vs university</h3>
<pre><code>School                     University
------------------------   ------------------------
teachers chase you         you manage yourself
short, guided reading      long, independent reading
frequent small tests       fewer, high-stakes exams
timetable fixed for you    you build your own schedule
</code></pre>
<p>The biggest shock is <strong>freedom</strong>: no one checks whether you did the reading. At FPTU specifically, that means checking FLM yourself for deadlines, materials and announcements — the system will not chase you.</p>
<h3>College culture &amp; expectations</h3>
<ul>
<li><strong>Attendance is graded and gate-keeping:</strong> per this syllabus, you need &gt;80% attendance just to sit the final exam — this is not a soft rule.</li>
<li><strong>You are expected to prepare before class</strong> — most SSA101 sessions ask you to "read the materials at home and prepare in-depth discussion questions for class."</li>
<li><strong>Laptops are for learning only</strong> in class (an explicit FLM student task).</li>
</ul>
<h3>Growth mindset (bổ sung — Carol Dweck, ngoài giáo trình FLM)</h3>
<ul>
<li><strong>Fixed mindset:</strong> "I'm just not a maths person." A low mark feels like a verdict.</li>
<li><strong>Growth mindset:</strong> "I can't do this <em>yet</em>." A low mark is information about what to practise next.</li>
</ul>
<p>This is an enrichment concept beyond the FLM syllabus text, added because it directly supports LO1 (understanding learning expectations) for first-year students adjusting to FPTU.</p>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Open FLM right now and find the syllabus for one other course you're taking this semester. Write down: attendance requirement, main assessment weights, and one thing you didn't know before.</p>
<p><strong>Hint:</strong> Look for the same table shapes you saw in Section 0 of this course — every FLM syllabus uses the same structure.</p>
<div class="callout"><span class="badge">Try this</span> Catch yourself saying "I can't do X" and add the word <strong>"yet"</strong>. Then name one concrete next step.</div>`,
    `<span class="eyebrow">SSA101 · Chương 1 · Bài 1.1 · Buổi 1-3 · LO1</span>
<h2>Khám phá đại học</h2>
<p class="lead">Chủ đề FLM (buổi 1-3): <em>"Khám phá đại học: Nhập môn; Vì sao vào đại học?; Trải nghiệm năm nhất"</em> và <em>"Văn hoá &amp; kỳ vọng ở đại học"</em>.</p>
` + sachCollegeSuccess + `
<h3>Phổ thông vs đại học</h3>
<pre><code>Phổ thông                  Đại học
------------------------   ------------------------
thầy cô nhắc nhở bạn        bạn tự quản lý mình
đọc ngắn, có dẫn dắt        đọc dài, tự lực
kiểm tra nhỏ liên tục       ít kỳ thi, trọng số cao
thời khoá biểu có sẵn       bạn tự dựng lịch của mình
</code></pre>
<p>Cú sốc lớn nhất là <strong>sự tự do</strong>: không ai kiểm tra bạn đã đọc bài chưa. Ở FPTU cụ thể, nghĩa là bạn phải tự vào FLM để xem hạn nộp, tài liệu, thông báo — hệ thống không đi nhắc bạn.</p>
<h3>Văn hoá &amp; kỳ vọng ở đại học</h3>
<ul>
<li><strong>Điểm danh có trọng số và là điều kiện thi:</strong> theo syllabus này, bạn cần &gt;80% buổi mới đủ điều kiện thi cuối kỳ — không phải quy định cho có.</li>
<li><strong>Phải chuẩn bị TRƯỚC giờ học</strong> — hầu hết các buổi SSA101 yêu cầu "đọc tài liệu ở nhà và chuẩn bị câu hỏi thảo luận sâu cho lớp."</li>
<li><strong>Laptop trong lớp chỉ dùng để học</strong> (nhiệm vụ sinh viên FLM ghi rõ).</li>
</ul>
<h3>Tư duy phát triển (bổ sung — Carol Dweck, ngoài giáo trình FLM)</h3>
<ul>
<li><strong>Tư duy cố định:</strong> "Mình vốn không có đầu óc toán." Điểm thấp giống một lời phán xét.</li>
<li><strong>Tư duy phát triển:</strong> "Mình <em>chưa</em> làm được." Điểm thấp là thông tin về thứ cần luyện tiếp.</li>
</ul>
<p>Đây là nội dung <strong>bổ sung</strong> ngoài văn bản syllabus FLM, được thêm vào vì hỗ trợ trực tiếp LO1 (hiểu kỳ vọng học tập) cho tân sinh viên đang thích nghi với FPTU.</p>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Mở FLM ngay bây giờ, tìm syllabus của một môn khác bạn đang học kỳ này. Ghi lại: yêu cầu điểm danh, trọng số các đầu điểm chính, và một điều bạn chưa biết trước đó.</p>
<p><strong>Gợi ý:</strong> Tìm đúng dạng bảng bạn vừa thấy ở Mục 0 của môn này — mọi syllabus FLM đều dùng chung cấu trúc.</p>
<div class="callout"><span class="badge">Thử ngay</span> Bắt gặp mình nói "Mình không làm được X" thì thêm từ <strong>"chưa"</strong>. Rồi nêu một bước tiếp theo cụ thể.</div>`,
  ]]);

const c2note = doc('ssa101-3-1-note-taking', '1.2 — Studying: Note-taking with Cornell (buổi 5, LO2/LO11)|||1.2 — Cách học: Ghi chép Cornell (buổi 5, LO2/LO11)',
  'Buổi 5, LO2/LO11. Vì sao chép nguyên văn kém hiệu quả; phương pháp Cornell; sơ đồ tư duy.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 1 · Lesson 1.2 · Buổi 5 · LO2, LO11</span>
<h2>Studying: note-taking with the Cornell method</h2>
<p class="lead">FLM topic (buổi 5): <em>"Studying, memory and Test taking: Introduction; Studying. Discussion and Practice"</em>.</p>
` + sachCollegeSuccess + `
<p>Copying the lecturer word-for-word feels productive but teaches you little — you're transcribing, not thinking. Good notes <strong>process</strong> ideas in your own words.</p>
<h3>The Cornell method (Walter Pauk)</h3>
<pre><code>+----------+---------------------------+
|  CUES    |   NOTES                   |
| (recall  |   main ideas, in your     |
|  questions|  own words, during class |
|  &amp; key   |                           |
|  words)  |                           |
|          |                           |
+----------+---------------------------+
|  SUMMARY: 2-3 sentences, from memory  |
+---------------------------------------+
</code></pre>
<ul>
<li><strong>Notes (right):</strong> capture main points during the lecture — not every word.</li>
<li><strong>Cues (left):</strong> afterwards, write questions and keywords that the notes answer.</li>
<li><strong>Summary (bottom):</strong> sum up the page in your own words. Later, cover the notes and answer the cues — instant self-testing.</li>
</ul>
<h3>Mind maps</h3>
<p>For <em>connected</em> ideas, a <strong>mind map</strong> beats a linear list: put the topic in the centre and branch outwards.</p>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Take your next lecture (any subject) and split one page into the Cornell layout above. After class, fill in the cues and write the summary from memory only.</p>
<p><strong>Hint:</strong> If you can't write the summary without looking, your notes captured words but not understanding — go back and re-process that section.</p>
<div class="callout"><span class="badge">Handwriting helps</span> Writing by hand forces you to summarise instead of transcribing — that summarising is what builds memory.</div>`,
    `<span class="eyebrow">SSA101 · Chương 1 · Bài 1.2 · Buổi 5 · LO2, LO11</span>
<h2>Cách học: ghi chép bằng phương pháp Cornell</h2>
<p class="lead">Chủ đề FLM (buổi 5): <em>"Học tập, ghi nhớ &amp; làm bài thi: Nhập môn; Cách học. Thảo luận &amp; thực hành"</em>.</p>
` + sachCollegeSuccess + `
<p>Chép nguyên văn lời giảng viên có vẻ năng suất nhưng dạy bạn rất ít — bạn đang chép lại, không phải suy nghĩ. Ghi chép tốt <strong>xử lý</strong> ý bằng lời của chính bạn.</p>
<h3>Phương pháp Cornell (Walter Pauk)</h3>
<pre><code>+----------+---------------------------+
| GỢI Ý    |   GHI CHÉP                |
| (câu hỏi |   ý chính, bằng lời của   |
|  ôn &amp;    |   bạn, ghi trong giờ học  |
|  từ khoá)|                           |
|          |                           |
+----------+---------------------------+
|  TÓM TẮT: 2-3 câu, viết từ trí nhớ    |
+---------------------------------------+
</code></pre>
<ul>
<li><strong>Ghi chép (phải):</strong> nắm ý chính trong giờ học — không phải mọi chữ.</li>
<li><strong>Gợi ý (trái):</strong> sau giờ học, viết câu hỏi và từ khoá mà phần ghi chép trả lời.</li>
<li><strong>Tóm tắt (dưới):</strong> tóm cả trang bằng lời của bạn. Sau này che phần ghi chép và trả lời cột gợi ý — tự kiểm tra tức thì.</li>
</ul>
<h3>Sơ đồ tư duy</h3>
<p>Với ý <em>liên kết</em>, một <strong>sơ đồ tư duy</strong> hơn hẳn danh sách thẳng: đặt chủ đề ở giữa rồi toả nhánh ra ngoài.</p>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Ở buổi học tiếp theo (môn nào cũng được), chia một trang giấy theo bố cục Cornell ở trên. Sau giờ học, điền cột gợi ý và viết tóm tắt hoàn toàn từ trí nhớ.</p>
<p><strong>Gợi ý:</strong> Nếu không viết được tóm tắt mà không nhìn lại, nghĩa là ghi chép của bạn chỉ chép chữ chứ chưa hiểu — quay lại xử lý phần đó.</p>
<div class="callout"><span class="badge">Viết tay có lợi</span> Viết tay buộc bạn tóm ý thay vì chép lại — chính sự tóm ý đó xây nên trí nhớ.</div>`,
  ]]);

const c3memory = doc('ssa101-5-1-memory-learning', '1.3 — Memory & Test-taking Strategies (buổi 4, 6, LO1/LO2/LO11)|||1.3 — Ghi nhớ & Chiến lược làm bài thi (buổi 4, 6, LO1/LO2/LO11)',
  'Buổi 4 &amp; 6, LO1/LO2/LO11. Ghi nhớ chủ động, lặp lại ngắt quãng; chiến lược làm bài thi (đọc đề, quản lý thời gian phòng thi, loại trừ đáp án).',
  [[
    `<span class="eyebrow">SSA101 · Chapter 1 · Lesson 1.3 · Buổi 4 &amp; 6 · LO1, LO2, LO11</span>
<h2>Memory &amp; test-taking strategies</h2>
<p class="lead">FLM topics: buổi 4 <em>"Studying, memory and Test taking: Introduction; Memory"</em>; buổi 6 <em>"Studying, memory and Test taking (cont): Test taking"</em>.</p>
` + sachCollegeSuccess + `
<h3>Active recall beats re-reading</h3>
<p>Re-reading and highlighting <em>feel</em> like learning but are among the weakest methods. The strongest is <strong>active recall</strong>: close the book and try to <em>retrieve</em> the answer.</p>
<h3>Spaced repetition</h3>
<p>Ebbinghaus's <strong>forgetting curve</strong> drops steeply within a day. Reviewing at <strong>increasing intervals</strong> (day 1, day 3, day 7, day 21) moves knowledge into long-term memory.</p>
<pre><code>Cramming:  1 huge session -> forget most within a week
Spacing:   same total time, spread out -> remember for months
</code></pre>
<h3>Test-taking strategies (LO3, mở rộng cho buổi 6)</h3>
<ul>
<li><strong>Before:</strong> skim the whole test first; note the point value of each section so you spend time where it counts.</li>
<li><strong>Multiple choice:</strong> eliminate obviously wrong options first; watch for absolute words ("always", "never") — they're often wrong.</li>
<li><strong>Essay:</strong> outline your answer in 30 seconds before writing — a structured partial answer scores higher than a rambling complete one.</li>
<li><strong>Time management in the exam room:</strong> if a question is taking too long, mark it and move on — come back at the end.</li>
</ul>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Pick any topic from another course. Close the book, and write down everything you remember for 3 minutes. Then check what you missed.</p>
<p><strong>Hint:</strong> The gaps you find are exactly what to review next — that's the whole point of active recall.</p>
<div class="callout"><span class="badge">The golden rule</span> Test yourself, space it out, sleep on it.</div>`,
    `<span class="eyebrow">SSA101 · Chương 1 · Bài 1.3 · Buổi 4 &amp; 6 · LO1, LO2, LO11</span>
<h2>Ghi nhớ &amp; chiến lược làm bài thi</h2>
<p class="lead">Chủ đề FLM: buổi 4 <em>"Học tập, ghi nhớ &amp; làm bài thi: Nhập môn; Trí nhớ"</em>; buổi 6 <em>"Học tập, ghi nhớ &amp; làm bài thi (tiếp): Kỹ năng làm bài thi"</em>.</p>
` + sachCollegeSuccess + `
<h3>Ghi nhớ chủ động thắng đọc lại</h3>
<p>Đọc lại và tô đậm <em>cảm giác</em> như đang học nhưng thuộc nhóm kém hiệu quả nhất. Mạnh nhất là <strong>ghi nhớ chủ động (active recall)</strong>: gấp sách lại và cố <em>truy hồi</em> câu trả lời.</p>
<h3>Lặp lại ngắt quãng</h3>
<p><strong>Đường cong quên</strong> của Ebbinghaus tụt dốc chỉ trong một ngày. Ôn lại theo <strong>khoảng cách tăng dần</strong> (ngày 1, 3, 7, 21) đưa kiến thức vào trí nhớ dài hạn.</p>
<pre><code>Nhồi nhét: 1 buổi khổng lồ  -> quên gần hết trong một tuần
Ngắt quãng: cùng tổng thời gian, trải ra -> nhớ nhiều tháng
</code></pre>
<h3>Chiến lược làm bài thi (mở rộng cho buổi 6)</h3>
<ul>
<li><strong>Trước khi làm:</strong> lướt qua toàn bộ đề trước; ghi nhớ số điểm mỗi phần để phân bổ thời gian hợp lý.</li>
<li><strong>Trắc nghiệm:</strong> loại bỏ đáp án sai rõ ràng trước; cẩn thận với từ tuyệt đối ("luôn luôn", "không bao giờ") — thường là đáp án sai.</li>
<li><strong>Tự luận:</strong> phác dàn ý 30 giây trước khi viết — một câu trả lời có cấu trúc dù chưa hoàn chỉnh thường được điểm cao hơn viết lan man.</li>
<li><strong>Quản lý thời gian trong phòng thi:</strong> câu nào mất quá nhiều thời gian thì đánh dấu và làm câu khác trước, quay lại sau.</li>
</ul>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Chọn một chủ đề bất kỳ từ môn khác. Gấp sách lại, viết ra mọi thứ bạn nhớ được trong 3 phút. Sau đó kiểm tra phần đã bỏ sót.</p>
<p><strong>Gợi ý:</strong> Chỗ bạn bỏ sót chính là chỗ cần ôn tiếp — đó là toàn bộ ý nghĩa của ghi nhớ chủ động.</p>
<div class="callout"><span class="badge">Quy tắc vàng</span> Tự kiểm tra, trải khoảng cách, ngủ đủ.</div>`,
  ]]);

const c4time = doc('ssa101-2-1-time-goals', '1.4 — Time Management & Managing Stress (buổi 7-12, LO3-6/LO11)|||1.4 — Quản lý thời gian & Căng thẳng (buổi 7-12, LO3-6/LO11)',
  'Buổi 7-12, LO3/LO4/LO5/LO6/LO11. SMART, Eisenhower, Pomodoro, chống trì hoãn, và nhận diện/quản lý căng thẳng.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 1 · Lesson 1.4 · Buổi 7-12 · LO3, LO4, LO5, LO6, LO11</span>
<h2>Time management &amp; managing stress</h2>
<p class="lead">FLM topics, buổi 7-12: benefits of time management, time management in college, procrastination, prioritization &amp; goal setting, enhanced strategies, and <em>"Identifying and Managing Stress"</em> (buổi 12).</p>
` + sachCollegeSuccess + `
<h3>SMART goals</h3>
<pre><code>S  Specific    what exactly? ("finish Ch.3 problem set")
M  Measurable  how will you know it's done? (10 problems)
A  Achievable  realistic for the time you have
R  Relevant    tied to a real outcome (the midterm)
T  Time-bound  by when? ("by Friday 8pm")
</code></pre>
<h3>Priorities — the Eisenhower matrix</h3>
<pre><code>              URGENT            NOT URGENT
IMPORTANT     do now            schedule it   &lt;- growth lives here
NOT IMPORTANT delegate/trim     drop it
</code></pre>
<h3>Pomodoro technique</h3>
<p>Work in focused blocks: <strong>25 minutes on one task, 5-minute break</strong>; after four blocks take a longer 15-30 min break.</p>
<h3>Managing academic stress (buổi 12, LO6)</h3>
<ul>
<li>Some pressure sharpens you; too much blocks memory. The basics beat any trick: <strong>sleep, food, exercise, breaks</strong>.</li>
<li>Slow breathing calms the body in minutes. Talk to someone if stress becomes overwhelming — that's a strength, not a weakness.</li>
<li>A packed exam week is normal at FPTU — the fix is spreading revision early (Lesson 1.3), not pulling all-nighters.</li>
</ul>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Write one SMART goal for this week, then place your top 5 tasks into the Eisenhower matrix above.</p>
<p><strong>Hint:</strong> If everything lands in "urgent", you're planning too late — that itself is the diagnosis.</p>
<div class="callout"><span class="badge">Beat procrastination</span> Shrink the first step until it's laughably small — "open the file and read one paragraph."</div>`,
    `<span class="eyebrow">SSA101 · Chương 1 · Bài 1.4 · Buổi 7-12 · LO3, LO4, LO5, LO6, LO11</span>
<h2>Quản lý thời gian &amp; căng thẳng</h2>
<p class="lead">Chủ đề FLM, buổi 7-12: lợi ích quản lý thời gian, quản lý thời gian ở đại học, trì hoãn, ưu tiên hoá &amp; đặt mục tiêu, chiến lược nâng cao, và <em>"Nhận diện &amp; quản lý căng thẳng"</em> (buổi 12).</p>
` + sachCollegeSuccess + `
<h3>Mục tiêu SMART</h3>
<pre><code>S  Cụ thể      chính xác cái gì? ("xong bài tập Chương 3")
M  Đo được     làm sao biết đã xong? (10 bài)
A  Khả thi     thực tế với thời gian bạn có
R  Liên quan   gắn với kết quả thật (bài giữa kỳ)
T  Có hạn      xong khi nào? ("trước 20h thứ Sáu")
</code></pre>
<h3>Ưu tiên — ma trận Eisenhower</h3>
<pre><code>                KHẨN             KHÔNG KHẨN
QUAN TRỌNG      làm ngay         lên lịch    &lt;- chỗ để trưởng thành
KHÔNG QT        giao/cắt bớt     bỏ đi
</code></pre>
<h3>Kỹ thuật Pomodoro</h3>
<p>Làm theo khối tập trung: <strong>25 phút cho một việc, nghỉ 5 phút</strong>; sau bốn khối thì nghỉ dài 15-30 phút.</p>
<h3>Quản lý căng thẳng học tập (buổi 12, LO6)</h3>
<ul>
<li>Một chút áp lực giúp tỉnh táo; quá nhiều thì chặn trí nhớ. Thứ cơ bản hơn mọi mẹo: <strong>ngủ, ăn, vận động, nghỉ ngơi</strong>.</li>
<li>Thở chậm làm dịu cơ thể trong vài phút. Hãy nói với ai đó nếu căng thẳng quá tải — đó là điểm mạnh, không phải điểm yếu.</li>
<li>Tuần thi dồn dập là bình thường ở FPTU — cách chữa là ôn sớm và trải đều (Bài 1.3), không phải thức trắng đêm.</li>
</ul>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Viết một mục tiêu SMART cho tuần này, rồi xếp 5 việc quan trọng nhất của bạn vào ma trận Eisenhower ở trên.</p>
<p><strong>Gợi ý:</strong> Nếu mọi thứ đều rơi vào ô "khẩn", nghĩa là bạn đang lên kế hoạch quá trễ — đó chính là chẩn đoán.</p>
<div class="callout"><span class="badge">Thắng trì hoãn</span> Thu nhỏ bước đầu tiên đến mức buồn cười — "mở file và đọc một đoạn."</div>`,
  ]]);

const c1quiz = quiz('ssa101-1-5-quiz-chuong-1', 'Quiz — Chapter 1 (buổi 1-12)|||Quiz — Chương 1 (buổi 1-12)', [
  { id: 'q1', question: 'Khác biệt lớn nhất khi lên đại học so với phổ thông là?', options: ['Bài tập dễ hơn', 'Bạn phải tự quản lý thời gian và việc học', 'Không còn thi cử', 'Thầy cô nhắc bài mỗi ngày'], correctIndex: 1, explanation: 'Đại học cho nhiều tự do hơn nhưng đòi tự chủ — bạn tự dựng khuôn khổ cho mình (LO1).' },
  { id: 'q2', question: 'Theo syllabus SSA101, điều kiện để được dự thi cuối kỳ là gì?', options: ['Nộp đủ bài tập', 'Dự lớp hơn 80% số buổi', 'Điểm danh 50%', 'Không có điều kiện gì'], correctIndex: 1, explanation: 'FLM yêu cầu dự hơn 80% số buổi mới được chấp nhận dự thi cuối kỳ.' },
  { id: 'q3', question: 'Ba vùng của phương pháp Cornell là?', options: ['Tiêu đề, thân bài, kết luận', 'Ghi chép, cột gợi ý, tóm tắt', 'Câu hỏi, đáp án, điểm số', 'Mở bài, ví dụ, bài tập'], correctIndex: 1, explanation: 'Cornell chia trang thành: ghi chép (phải), cột gợi ý/câu hỏi (trái), tóm tắt (dưới).' },
  { id: 'q4', question: 'Cách học nào MẠNH nhất trong các lựa chọn sau?', options: ['Đọc lại chương nhiều lần', 'Tô đậm (highlight) hết sách', 'Ghi nhớ chủ động — gấp sách và tự truy hồi câu trả lời', 'Chép lại nguyên văn'], correctIndex: 2, explanation: 'Active recall (tự truy hồi) xây trí nhớ bền hơn đọc lại thụ động.' },
  { id: 'q5', question: 'Khi làm bài trắc nghiệm, chiến lược tốt là?', options: ['Chọn đáp án đầu tiên nhìn thấy', 'Loại bỏ đáp án sai rõ ràng trước, cẩn thận với từ tuyệt đối', 'Bỏ qua câu khó, không quay lại', 'Làm thật nhanh không đọc kỹ đề'], correctIndex: 1, explanation: 'Loại trừ đáp án sai và cảnh giác với từ tuyệt đối ("luôn luôn", "không bao giờ") là chiến lược làm bài hiệu quả.' },
  { id: 'q6', question: 'Chữ "M" trong mục tiêu SMART nghĩa là?', options: ['Motivated (có động lực)', 'Measurable (đo được)', 'Major (quan trọng)', 'Mandatory (bắt buộc)'], correctIndex: 1, explanation: 'M = Measurable: phải có cách biết mục tiêu đã đạt hay chưa.' },
  { id: 'q7', question: 'Theo ma trận Eisenhower, việc "quan trọng nhưng CHƯA khẩn" nên?', options: ['Bỏ đi', 'Lên lịch làm chủ động', 'Chỉ làm khi đã thành khẩn cấp', 'Giao cho người khác'], correctIndex: 1, explanation: 'Lên lịch trước khi việc quan trọng-chưa-khẩn biến thành khủng hoảng.' },
  { id: 'q8', question: 'Cách quản lý căng thẳng học tập được khuyến nghị (buổi 12) là gì?', options: ['Thức trắng để học bù', 'Ngủ, ăn, vận động và nghỉ ngơi đều đặn', 'Uống nhiều cà phê', 'Bỏ qua các môn khó'], correctIndex: 1, explanation: 'Những thứ cơ bản (ngủ/ăn/vận động/nghỉ) hiệu quả hơn mọi mẹo nhanh để quản lý căng thẳng.' },
]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 2-10 — CHỈ KHUNG: tên đúng + 3-6 dòng mốc nội dung mỗi bài.
// KHÔNG viết bài giảng chi tiết — chi tiết sẽ bổ sung sau.
// ─────────────────────────────────────────────────────────────────────────

const k21 = doc('ssa101-2-1-du-an-p1-chon-de-tai', '2.1 — Project Part 1: Topic selection & planning (khung)|||2.1 — Đồ án Phần 1: Chọn đề tài & lên kế hoạch (khung)',
  'Buổi 13, LO6/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 2 · Lesson 2.1 · Buổi 13 · LO6, LO11 · Khung</span>
<h2>Project Part 1 — Topic selection &amp; planning</h2>
<ul>
<li><strong>Buổi:</strong> 13.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Part1 Project - Topic selection and planning" — đọc, hiểu, thảo luận và hợp tác nhóm dựa trên Project Guidelines.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 1 - Proposal & Presentation (10%, tuần 3-4).</li>
<li><strong>Ghi chú:</strong> Đây là khung — chi tiết Project Guidelines do giảng viên phát; bài giảng đầy đủ sẽ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 2 · Bài 2.1 · Buổi 13 · LO6, LO11 · Khung</span>
<h2>Đồ án Phần 1 — Chọn đề tài &amp; lên kế hoạch</h2>
<ul>
<li><strong>Buổi:</strong> 13.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Đồ án Phần 1 - Chọn đề tài &amp; lên kế hoạch" — đọc, hiểu, thảo luận và hợp tác nhóm theo Project Guidelines.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 1 - Proposal & Presentation (10%, tuần 3-4).</li>
<li><strong>Ghi chú:</strong> Đây là khung — Project Guidelines chi tiết do giảng viên phát; bài giảng đầy đủ sẽ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k22 = doc('ssa101-2-2-du-an-p1-nghien-cuu', '2.2 — Project Part 1: Research & preparation (khung)|||2.2 — Đồ án Phần 1: Nghiên cứu & chuẩn bị (khung)',
  'Buổi 14-15, LO6/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 2 · Lesson 2.2 · Buổi 14-15 · LO6, LO11 · Khung</span>
<h2>Project Part 1 — Research &amp; preparation</h2>
<ul>
<li><strong>Buổi:</strong> 14-15.</li>
<li><strong>CLO/LO:</strong> LO6, LO11 (buổi 14); LO6 (buổi 15).</li>
<li><strong>Nội dung FLM:</strong> "Part1 Project - Research and preparation" — tiếp tục nghiên cứu và chuẩn bị theo Project Guidelines.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 1 - Proposal & Presentation (10%, tuần 3-4).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 2 · Bài 2.2 · Buổi 14-15 · LO6, LO11 · Khung</span>
<h2>Đồ án Phần 1 — Nghiên cứu &amp; chuẩn bị</h2>
<ul>
<li><strong>Buổi:</strong> 14-15.</li>
<li><strong>CLO/LO:</strong> LO6, LO11 (buổi 14); LO6 (buổi 15).</li>
<li><strong>Nội dung FLM:</strong> "Đồ án Phần 1 - Nghiên cứu &amp; chuẩn bị" — tiếp tục nghiên cứu và chuẩn bị theo Project Guidelines.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 1 - Proposal & Presentation (10%, tuần 3-4).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k31 = doc('ssa101-3-1-giao-tiep-tong-quan', '3.1 — Communication: overview & technology (khung)|||3.1 — Giao tiếp: tổng quan & công nghệ (khung)',
  'Buổi 16-17, LO6/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 3 · Lesson 3.1 · Buổi 16-17 · LO6, LO11 · Khung</span>
<h2>Communication Skills — overview &amp; technology</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 16-17.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> Nhập môn giao tiếp; tổng quan &amp; mục đích giao tiếp; giao tiếp &amp; công nghệ. Tài liệu: College Success, Chapter 8 "Communicating".</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 3 · Bài 3.1 · Buổi 16-17 · LO6, LO11 · Khung</span>
<h2>Kỹ năng giao tiếp — tổng quan &amp; công nghệ</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 16-17.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> Nhập môn giao tiếp; tổng quan &amp; mục đích giao tiếp; giao tiếp &amp; công nghệ. Tài liệu: College Success, Chương 8 "Communicating".</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k32 = doc('ssa101-3-2-giao-tiep-boi-canh-rao-can', '3.2 — Communication: context & barriers (khung)|||3.2 — Giao tiếp: bối cảnh & rào cản (khung)',
  'Buổi 18, LO6/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 3 · Lesson 3.2 · Buổi 18 · LO6, LO11 · Khung</span>
<h2>Communication Skills — context &amp; barriers</h2>
<ul>
<li><strong>Buổi:</strong> 18.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> "The Context of Communication; Barriers to Effective Communication." Tài liệu: College Success, Chapter 8.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 3 · Bài 3.2 · Buổi 18 · LO6, LO11 · Khung</span>
<h2>Kỹ năng giao tiếp — bối cảnh &amp; rào cản</h2>
<ul>
<li><strong>Buổi:</strong> 18.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Bối cảnh giao tiếp; Rào cản giao tiếp hiệu quả." Tài liệu: College Success, Chương 8.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k41 = doc('ssa101-4-1-hoc-truc-tuyen', '4.1 — Learning to Learn Online (khung)|||4.1 — Học trực tuyến hiệu quả (khung)',
  'Buổi 19-21, LO6/LO7/LO11. Khung — bắt buộc hoàn thành trước buổi 21, là nguồn đề Quiz 5%.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 4 · Lesson 4.1 · Buổi 19-21 · LO6, LO7, LO11 · Khung</span>
<h2>Learning to Learn Online</h2>
` + sachHocTrucTuyen + `
<ul>
<li><strong>Buổi:</strong> 19-21.</li>
<li><strong>CLO/LO:</strong> LO6, LO11 (buổi 19-20); LO7, LO11 (buổi 21).</li>
<li><strong>Nội dung FLM:</strong> "Who am I as an online learner? Who am I on my learning journey with? Who are my instructors?" — Parts 1-7 của khoá "Learning to Learn Online".</li>
<li><strong>Đầu điểm liên quan:</strong> Quiz (5%, tuần 4-5) ra đề trực tiếp từ khoá này.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 4 · Bài 4.1 · Buổi 19-21 · LO6, LO7, LO11 · Khung</span>
<h2>Học trực tuyến hiệu quả</h2>
` + sachHocTrucTuyen + `
<ul>
<li><strong>Buổi:</strong> 19-21.</li>
<li><strong>CLO/LO:</strong> LO6, LO11 (buổi 19-20); LO7, LO11 (buổi 21).</li>
<li><strong>Nội dung FLM:</strong> "Mình là người học trực tuyến thế nào? Mình học cùng ai? Giảng viên của mình là ai?" — Phần 1-7 của khoá "Learning to Learn Online".</li>
<li><strong>Đầu điểm liên quan:</strong> Quiz (5%, tuần 4-5) ra đề trực tiếp từ khoá này.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k51 = doc('ssa101-5-1-thong-tin-hoc-lieu', '5.1 — Information Literacy (khung)|||5.1 — Năng lực thông tin (khung)',
  'Buổi 22-23, LO1-7/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 5 · Lesson 5.1 · Buổi 22-23 · LO7, LO11, LO1-LO7 · Khung</span>
<h2>Information Literacy</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 22-23.</li>
<li><strong>CLO/LO:</strong> LO7, LO11 (buổi 22); LO1-LO7 (buổi 23, ôn tập tổng hợp).</li>
<li><strong>Nội dung FLM:</strong> "Information Literacy. Discussion and Practice." Tài liệu: College Success, mục 7.7 "Information Literacy" của Chapter 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 5 · Bài 5.1 · Buổi 22-23 · LO7, LO11, LO1-LO7 · Khung</span>
<h2>Năng lực thông tin</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 22-23.</li>
<li><strong>CLO/LO:</strong> LO7, LO11 (buổi 22); LO1-LO7 (buổi 23, ôn tập tổng hợp).</li>
<li><strong>Nội dung FLM:</strong> "Năng lực thông tin. Thảo luận &amp; thực hành." Tài liệu: College Success, mục 7.7 "Information Literacy" của Chương 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k52 = doc('ssa101-5-2-on-tap-quiz1', '5.2 — Review Session I & Quiz 1 (khung)|||5.2 — Ôn tập buổi I & Quiz 1 (khung)',
  'Buổi 24, LO8/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 5 · Lesson 5.2 · Buổi 24 · LO8, LO11 · Khung</span>
<h2>Review session I. Quiz 1</h2>
<ul>
<li><strong>Buổi:</strong> 24.</li>
<li><strong>CLO/LO:</strong> LO8, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Review session I. Quiz 1" — ôn tập College Success Chapter 1, 6, 3, 8 &amp; "Learning to Learn Online" Part 1-7.</li>
<li><strong>Ghi chú:</strong> "Quiz 1" ở đây là hoạt động trong buổi học theo kế hoạch giảng dạy của FLM — khác với đầu điểm "Quiz (5%)" ở Mục 0.2 (cùng tên nhưng không chắc là cùng một bài kiểm tra; FLM không nói rõ, không đoán).</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 5 · Bài 5.2 · Buổi 24 · LO8, LO11 · Khung</span>
<h2>Ôn tập buổi I. Quiz 1</h2>
<ul>
<li><strong>Buổi:</strong> 24.</li>
<li><strong>CLO/LO:</strong> LO8, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Ôn tập buổi I. Quiz 1" — ôn College Success Chương 1, 6, 3, 8 &amp; "Learning to Learn Online" Phần 1-7.</li>
<li><strong>Ghi chú:</strong> "Quiz 1" ở đây là hoạt động trong kế hoạch giảng dạy của FLM — khác với đầu điểm "Quiz (5%)" ở Mục 0.2 (trùng tên nhưng FLM không nói rõ có phải cùng một bài kiểm tra hay không; chúng tôi không đoán).</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k61 = doc('ssa101-6-1-ai-va-tri-thuc-so', '6.1 — AI & Digital Literacy (khung)|||6.1 — AI & Năng lực số (khung)',
  'Buổi 25-27, LO8/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 6 · Lesson 6.1 · Buổi 25-27 · LO8, LO11 · Khung</span>
<h2>AI and Digital Literacy</h2>
` + sachAiEthics + `
<ul>
<li><strong>Buổi:</strong> 25-27.</li>
<li><strong>CLO/LO:</strong> LO8, LO11.</li>
<li><strong>Nội dung FLM:</strong> Nhập môn "AI and Ethics in Higher Education"; Digital Literacy là gì; AI Literacy; lợi ích &amp; hạn chế của AI; quyền riêng tư; AI hallucination; trách nhiệm giải trình của AI.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 6 · Bài 6.1 · Buổi 25-27 · LO8, LO11 · Khung</span>
<h2>AI &amp; năng lực số</h2>
` + sachAiEthics + `
<ul>
<li><strong>Buổi:</strong> 25-27.</li>
<li><strong>CLO/LO:</strong> LO8, LO11.</li>
<li><strong>Nội dung FLM:</strong> Nhập môn "AI and Ethics in Higher Education"; Năng lực số là gì; Năng lực AI; lợi ích &amp; hạn chế của AI; quyền riêng tư; AI ảo giác; trách nhiệm giải trình của AI.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k62 = doc('ssa101-6-2-dao-duc-dung-ai', '6.2 — Ethics of Using AI & Academic Integrity (khung)|||6.2 — Đạo đức dùng AI & Liêm chính học thuật (khung)',
  'Buổi 28-30, LO8/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 6 · Lesson 6.2 · Buổi 28-30 · LO8, LO11 · Khung</span>
<h2>Ethics of Using AI &amp; Academic Integrity</h2>
` + sachAiEthics + `
<ul>
<li><strong>Buổi:</strong> 28-30.</li>
<li><strong>CLO/LO:</strong> LO8, LO11.</li>
<li><strong>Nội dung FLM:</strong> Hệ luỵ dùng AI; thách thức đạo đức; thiên lệch &amp; giám sát trong thuật toán AI; liêm chính học thuật dưới góc nhìn AI; đạo văn do công cụ AI; hiệu quả công cụ phát hiện AI.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 6 · Bài 6.2 · Buổi 28-30 · LO8, LO11 · Khung</span>
<h2>Đạo đức dùng AI &amp; liêm chính học thuật</h2>
` + sachAiEthics + `
<ul>
<li><strong>Buổi:</strong> 28-30.</li>
<li><strong>CLO/LO:</strong> LO8, LO11.</li>
<li><strong>Nội dung FLM:</strong> Hệ luỵ dùng AI; thách thức đạo đức; thiên lệch &amp; giám sát trong thuật toán AI; liêm chính học thuật dưới góc nhìn AI; đạo văn do công cụ AI; hiệu quả công cụ phát hiện AI.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k63 = doc('ssa101-6-3-dung-ai-dung-cach-on-tap', '6.3 — Using AI to Help Your Learning & Review (khung)|||6.3 — Dùng AI hỗ trợ học tập & Ôn tập (khung)',
  'Buổi 31-33, LO9/LO11/LO8-9. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 6 · Lesson 6.3 · Buổi 31-33 · LO9, LO11 · Khung</span>
<h2>How to use AI to Help, Not Hinder, Your Learning — Review session II</h2>
` + sachAiEthics + `
<ul>
<li><strong>Buổi:</strong> 31-33.</li>
<li><strong>CLO/LO:</strong> LO9, LO11 (buổi 31-32); LO8-LO9 (buổi 33, ôn tập).</li>
<li><strong>Nội dung FLM:</strong> "How to use AI to Help, Not Hinder, Your Learning"; buổi 33 là "Review session II" ôn lại "AI and Ethics in Higher Education: Session I".</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 6 · Bài 6.3 · Buổi 31-33 · LO9, LO11 · Khung</span>
<h2>Dùng AI hỗ trợ, không cản trở việc học — Ôn tập buổi II</h2>
` + sachAiEthics + `
<ul>
<li><strong>Buổi:</strong> 31-33.</li>
<li><strong>CLO/LO:</strong> LO9, LO11 (buổi 31-32); LO8-LO9 (buổi 33, ôn tập).</li>
<li><strong>Nội dung FLM:</strong> "Cách dùng AI để hỗ trợ, không cản trở việc học"; buổi 33 là "Ôn tập buổi II", ôn lại "AI and Ethics in Higher Education: Session I".</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k71 = doc('ssa101-7-1-du-an-p2', '7.1 — Project Part 2: Application to practice (khung)|||7.1 — Đồ án Phần 2: Áp dụng vào thực tiễn (khung)',
  'Buổi 34-36, LO6/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 7 · Lesson 7.1 · Buổi 34-36 · LO6, LO11 · Khung</span>
<h2>Project Part 2 — Application of knowledge to practice</h2>
<ul>
<li><strong>Buổi:</strong> 34-36.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Part2 Project - Application of knowledge to practice" — soát tiến độ giữa đồ án &amp; chuẩn bị cho giai đoạn cuối, theo Project Guidelines.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 2 - Project Execution (20%, tuần 7).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 7 · Bài 7.1 · Buổi 34-36 · LO6, LO11 · Khung</span>
<h2>Đồ án Phần 2 — Áp dụng kiến thức vào thực tiễn</h2>
<ul>
<li><strong>Buổi:</strong> 34-36.</li>
<li><strong>CLO/LO:</strong> LO6, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Đồ án Phần 2 - Áp dụng kiến thức vào thực tiễn" — soát tiến độ giữa đồ án &amp; chuẩn bị giai đoạn cuối, theo Project Guidelines.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 2 - Project Execution (20%, tuần 7).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k81 = doc('ssa101-8-1-tu-duy-phan-tich', '8.1 — Analytical Thinking (khung)|||8.1 — Tư duy phân tích (khung)',
  'Buổi 37-39, LO10/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 8 · Lesson 8.1 · Buổi 37-39 · LO10, LO11 · Khung</span>
<h2>Thinking Skills for the Digital Age — Analytical Thinking</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 37-39.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "What thinking means; Analytical Thinking. Discussion and Practice." Tài liệu: College Success, Chapter 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 8 · Bài 8.1 · Buổi 37-39 · LO10, LO11 · Khung</span>
<h2>Tư duy cho thời đại số — Tư duy phân tích</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 37-39.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Tư duy là gì; Tư duy phân tích. Thảo luận &amp; thực hành." Tài liệu: College Success, Chương 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k82 = doc('ssa101-8-2-tu-duy-sang-tao', '8.2 — Creative Thinking (khung)|||8.2 — Tư duy sáng tạo (khung)',
  'Buổi 40-42, LO10/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 8 · Lesson 8.2 · Buổi 40-42 · LO10, LO11 · Khung</span>
<h2>Creative thinking</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 40-42.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Creative thinking. Discussion and Practice." Tài liệu: College Success, Chapter 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 8 · Bài 8.2 · Buổi 40-42 · LO10, LO11 · Khung</span>
<h2>Tư duy sáng tạo</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 40-42.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Tư duy sáng tạo. Thảo luận &amp; thực hành." Tài liệu: College Success, Chương 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k83 = doc('ssa101-8-3-tu-duy-phan-bien', '8.3 — Critical Thinking (khung)|||8.3 — Tư duy phản biện (khung)',
  'Buổi 43-45, LO10/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 8 · Lesson 8.3 · Buổi 43-45 · LO10, LO11 · Khung</span>
<h2>Critical thinking</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 43-45.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Critical thinking. Discussion and Practice." Tài liệu: College Success, Chapter 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 8 · Bài 8.3 · Buổi 43-45 · LO10, LO11 · Khung</span>
<h2>Tư duy phản biện</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 43-45.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Tư duy phản biện. Thảo luận &amp; thực hành." Tài liệu: College Success, Chương 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k84 = doc('ssa101-8-4-giai-quyet-van-de', '8.4 — Problem-Solving (khung)|||8.4 — Giải quyết vấn đề (khung)',
  'Buổi 46-48, LO10/LO11. Khung. ⚠️ Buổi 48: FLM ghi tài liệu "chapter 5" khác cụm buổi 37-51 còn lại (chapter 7).',
  [[
    `<span class="eyebrow">SSA101 · Chapter 8 · Lesson 8.4 · Buổi 46-48 · LO10, LO11 · Khung</span>
<h2>Problem-Solving</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 46-48.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Problem - Solving. Discussion and Practice." Tài liệu: College Success, Chapter 7 (buổi 46-47).</li>
<li><strong>⚠️ Buổi 48:</strong> FLM ghi tài liệu là <strong>"College Success, chapter 5"</strong> — khác các buổi 37-51 còn lại đều là chapter 7. Nhiều khả năng FLM gõ nhầm; chúng tôi giữ nguyên như FLM công bố, KHÔNG tự sửa.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 8 · Bài 8.4 · Buổi 46-48 · LO10, LO11 · Khung</span>
<h2>Giải quyết vấn đề</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 46-48.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Giải quyết vấn đề. Thảo luận &amp; thực hành." Tài liệu: College Success, Chương 7 (buổi 46-47).</li>
<li><strong>⚠️ Buổi 48:</strong> FLM ghi tài liệu là <strong>"College Success, chapter 5"</strong> — khác các buổi 37-51 còn lại đều là chapter 7. Nhiều khả năng FLM gõ nhầm; chúng tôi giữ nguyên như FLM công bố, KHÔNG tự sửa.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k85 = doc('ssa101-8-5-metacognition-on-tap', '8.5 — Metacognition & Review Session III (khung)|||8.5 — Siêu nhận thức & Ôn tập buổi III (khung)',
  'Buổi 49-51, LO10/LO11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 8 · Lesson 8.5 · Buổi 49-51 · LO10, LO11 · Khung</span>
<h2>Metacognition — Review session III</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 49-51.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Metacognition. Discussion and Practice"; buổi 51 là "Discussion and Practice. Review session III" — ôn lại Chapter 7. Tài liệu: College Success, Chapter 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 8 · Bài 8.5 · Buổi 49-51 · LO10, LO11 · Khung</span>
<h2>Siêu nhận thức — Ôn tập buổi III</h2>
` + sachCollegeSuccess + `
<ul>
<li><strong>Buổi:</strong> 49-51.</li>
<li><strong>CLO/LO:</strong> LO10, LO11.</li>
<li><strong>Nội dung FLM:</strong> "Siêu nhận thức. Thảo luận &amp; thực hành"; buổi 51 là "Thảo luận &amp; thực hành. Ôn tập buổi III" — ôn lại Chương 7. Tài liệu: College Success, Chương 7.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k91 = doc('ssa101-9-1-progress-test', '9.1 — Individual Progress Test (khung)|||9.1 — Kiểm tra tiến độ cá nhân (khung)',
  'Buổi 52-54, LO1-10/LO1-11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 9 · Lesson 9.1 · Buổi 52-54 · LO1-10, LO1-11 · Khung</span>
<h2>Individual Progress Test</h2>
<ul>
<li><strong>Buổi:</strong> 52-54.</li>
<li><strong>CLO/LO:</strong> LO1-10 (buổi 52-53); LO1-11 (buổi 54).</li>
<li><strong>Nội dung FLM:</strong> "Individual Progress Test" — ôn lại toàn bộ tài liệu đã học; viết bài phản tư (learning reflection).</li>
<li><strong>Đầu điểm liên quan:</strong> Individual Progress Test (10%, tuần 9, 60-90').</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 9 · Bài 9.1 · Buổi 52-54 · LO1-10, LO1-11 · Khung</span>
<h2>Kiểm tra tiến độ cá nhân</h2>
<ul>
<li><strong>Buổi:</strong> 52-54.</li>
<li><strong>CLO/LO:</strong> LO1-10 (buổi 52-53); LO1-11 (buổi 54).</li>
<li><strong>Nội dung FLM:</strong> "Kiểm tra tiến độ cá nhân" — ôn lại toàn bộ tài liệu đã học; viết bài phản tư (learning reflection).</li>
<li><strong>Đầu điểm liên quan:</strong> Individual Progress Test (10%, tuần 9, 60-90').</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k101 = doc('ssa101-10-1-du-an-p3', '10.1 — Project Part 3: Presentation & Final Report (khung)|||10.1 — Đồ án Phần 3: Thuyết trình & báo cáo cuối (khung)',
  'Buổi 55-58, LO1-11. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 10 · Lesson 10.1 · Buổi 55-58 · LO1-11 · Khung</span>
<h2>Group Project Part 3 — Presentation &amp; Final report</h2>
<ul>
<li><strong>Buổi:</strong> 55-58.</li>
<li><strong>CLO/LO:</strong> LO1-11.</li>
<li><strong>Nội dung FLM:</strong> "Group Project Part 3: Presentation &amp; Final report of group project" — chuẩn bị &amp; thuyết trình báo cáo nhóm cuối kỳ.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 3 - Final Report & Presentation (20%, tuần 10).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 10 · Bài 10.1 · Buổi 55-58 · LO1-11 · Khung</span>
<h2>Đồ án nhóm Phần 3 — Thuyết trình &amp; báo cáo cuối</h2>
<ul>
<li><strong>Buổi:</strong> 55-58.</li>
<li><strong>CLO/LO:</strong> LO1-11.</li>
<li><strong>Nội dung FLM:</strong> "Đồ án nhóm Phần 3: Thuyết trình &amp; báo cáo cuối" — chuẩn bị &amp; thuyết trình báo cáo nhóm cuối kỳ.</li>
<li><strong>Đầu điểm liên quan:</strong> Project Part 3 - Final Report & Presentation (20%, tuần 10).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

const k102 = doc('ssa101-10-2-on-thi-cuoi-ky', '10.2 — Final exam revision (khung)|||10.2 — Ôn tập & chuẩn bị thi cuối kỳ (khung)',
  'Buổi 59-60, LO1-10. Khung.',
  [[
    `<span class="eyebrow">SSA101 · Chapter 10 · Lesson 10.2 · Buổi 59-60 · LO1-10 · Khung</span>
<h2>Revise course content and prepare for the final examination</h2>
<ul>
<li><strong>Buổi:</strong> 59-60.</li>
<li><strong>CLO/LO:</strong> LO1-10.</li>
<li><strong>Nội dung FLM:</strong> Buổi 59 tiếp tục "Group Project Part 3 (cont)" + phản tư; buổi 60 "Revise course content and prepare for the final examination."</li>
<li><strong>Đầu điểm liên quan:</strong> Final Exam (25%, 60', 50 câu trắc nghiệm, LO1-LO10).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
    `<span class="eyebrow">SSA101 · Chương 10 · Bài 10.2 · Buổi 59-60 · LO1-10 · Khung</span>
<h2>Ôn tập nội dung môn &amp; chuẩn bị thi cuối kỳ</h2>
<ul>
<li><strong>Buổi:</strong> 59-60.</li>
<li><strong>CLO/LO:</strong> LO1-10.</li>
<li><strong>Nội dung FLM:</strong> Buổi 59 tiếp tục "Đồ án nhóm Phần 3 (tiếp)" + viết phản tư; buổi 60 "Ôn tập nội dung môn học &amp; chuẩn bị cho kỳ thi cuối kỳ."</li>
<li><strong>Đầu điểm liên quan:</strong> Final Exam (25%, 60 phút, 50 câu trắc nghiệm, LO1-LO10).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13785.</em></p>`,
  ]]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'SSA101',
    slug: 'ssa101-academic-skills',
    title: 'Academic Skills',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SSA101.webp',
    shortDescription: 'Official FPTU academic-skills course (FLM Syllabus 13785, 60 sessions): exploring college, studying & time management in full; a session-by-session framework for communication, online learning, AI ethics, thinking skills and the group project.|||Môn Kỹ năng học thuật FPTU (FLM Syllabus 13785, 60 buổi): khám phá đại học, học tập & quản lý thời gian dạy đầy đủ; khung từng buổi cho giao tiếp, học trực tuyến, đạo đức AI, tư duy và đồ án nhóm.',
    description: 'Môn <strong>SSA101 — Academic Skills</strong> (Kỹ năng học thuật, Kỳ 1) dựng lại bám nguyên văn <strong>FLM Syllabus 13785</strong> (QĐ 1318/QĐ-ĐHFPT ngày 27/11/2025), đủ <strong>60 buổi</strong>, <strong>11 CLO</strong> và <strong>7 đầu điểm</strong>. <strong>Mục 0</strong> là khung chương trình đầy đủ (hồ sơ môn, cách tính điểm, CLO, giáo trình, kế hoạch 60 buổi, nhiệm vụ sinh viên) để sinh viên tự đối chiếu với FLM. <strong>Chương 1</strong> (buổi 1-12: Exploring College · Studying/Memory/Test-taking · Time Management) dạy đầy đủ, song ngữ, có ví dụ cho tân sinh viên FPTU, bảng/checklist, bài tập tự làm và một quiz kết chương. <strong>Chương 2 đến hết</strong> (Project Part 1 &amp; 2 &amp; 3, Communication Skills, Learning to Learn Online, Information Literacy, AI &amp; đạo đức học thuật, Tư duy cho thời đại số, Progress Test) hiện là <strong>khung</strong> — đúng tên buổi, đúng CLO/LO, mốc nội dung ngắn gọn — để sinh viên có đúng chương trình học ngay, chi tiết sẽ bổ sung dần.',
    whatYouLearn: 'Khám phá đại học & văn hoá học đường; học tập, ghi nhớ & chiến lược làm bài thi; quản lý thời gian (SMART, Eisenhower, Pomodoro) & quản lý căng thẳng; đồ án nhóm 3 phần xuyên suốt học kỳ; kỹ năng giao tiếp; học trực tuyến hiệu quả; năng lực thông tin; AI & đạo đức học thuật, liêm chính, dùng AI đúng cách; tư duy phân tích/sáng tạo/phản biện, giải quyết vấn đề, siêu nhận thức; ôn thi & kiểm tra tiến độ.',
    requirements: 'Không cần kiến thức nền đặc biệt — môn dành cho tân sinh viên (Pre-Requisite: None, theo FLM).',
  },
  sections: [
    {
      title: 'Mục 0 — Khung chương trình theo FLM|||Section 0 — FLM program framework',
      description: 'Hồ sơ môn, cách tính điểm (7 đầu điểm), 11 CLO, giáo trình & công cụ, kế hoạch đủ 60 buổi, nhiệm vụ sinh viên — đối chiếu trực tiếp FLM Syllabus 13785.',
      lessons: [m01, m02, m03, m04, m05, m06],
    },
    {
      title: 'Chương 1 — Kỹ năng học hiệu quả (buổi 1-12)|||Chapter 1 — Effective Learning Skills (sessions 1-12)',
      description: 'Buổi 1-12 · LO1-6, LO11 · Exploring College, Studying/Memory/Test-taking, Time Management — ĐẦY ĐỦ, dạy được ngay, kết chương bằng quiz.',
      lessons: [c1, c2note, c3memory, c4time, c1quiz],
    },
    {
      title: 'Chương 2 — Đồ án Phần 1 (khung)|||Chapter 2 — Project Part 1 (skeleton)',
      description: 'Buổi 13-15 · LO6, LO11 · Khung.',
      lessons: [k21, k22],
    },
    {
      title: 'Chương 3 — Kỹ năng giao tiếp (khung)|||Chapter 3 — Communication Skills (skeleton)',
      description: 'Buổi 16-18 · LO6, LO11 · Khung.',
      lessons: [k31, k32],
    },
    {
      title: 'Chương 4 — Học trực tuyến hiệu quả (khung)|||Chapter 4 — Learning to Learn Online (skeleton)',
      description: 'Buổi 19-21 · LO6, LO7, LO11 · Khung — bắt buộc hoàn thành trước buổi 21 (điều kiện Quiz 5%).',
      lessons: [k41],
    },
    {
      title: 'Chương 5 — Năng lực thông tin, Ôn tập & Quiz 1 (khung)|||Chapter 5 — Information Literacy, Review & Quiz 1 (skeleton)',
      description: 'Buổi 22-24 · LO1-7, LO8, LO11 · Khung.',
      lessons: [k51, k52],
    },
    {
      title: 'Chương 6 — AI & Đạo đức học thuật (khung)|||Chapter 6 — AI & Academic Ethics (skeleton)',
      description: 'Buổi 25-33 · LO8, LO9, LO11 · Khung.',
      lessons: [k61, k62, k63],
    },
    {
      title: 'Chương 7 — Đồ án Phần 2 (khung)|||Chapter 7 — Project Part 2 (skeleton)',
      description: 'Buổi 34-36 · LO6, LO11 · Khung.',
      lessons: [k71],
    },
    {
      title: 'Chương 8 — Tư duy cho thời đại số (khung)|||Chapter 8 — Thinking Skills for the Digital Age (skeleton)',
      description: 'Buổi 37-51 · LO10, LO11 · Phân tích, sáng tạo, phản biện, giải quyết vấn đề, siêu nhận thức — Khung.',
      lessons: [k81, k82, k83, k84, k85],
    },
    {
      title: 'Chương 9 — Kiểm tra tiến độ cá nhân (khung)|||Chapter 9 — Individual Progress Test (skeleton)',
      description: 'Buổi 52-54 · LO1-10, LO1-11 · Khung.',
      lessons: [k91],
    },
    {
      title: 'Chương 10 — Đồ án Phần 3 & Ôn thi (khung)|||Chapter 10 — Project Part 3 & Final Exam Prep (skeleton)',
      description: 'Buổi 55-60 · LO1-11, LO1-10 · Khung.',
      lessons: [k101, k102],
    },
  ],
};
