/**
 * VCM202 — Visual Communication (Truyền thông thị giác_Nguyên lý thị giác).
 * Ngành Thiết kế mỹ thuật số, kỳ 1, FPTU.
 *
 * DỰNG LẠI 20/09/2026 bám nguyên văn FLM Syllabus 13360 (QĐ 932/QĐ-ĐHFPT
 * ngày 22/08/2025), nguồn: content/academy/_syllabus-flm/VCM202.json.
 * Bản trước (18 bài) là khung 8 chương theo giáo trình quốc tế chung
 * (Lupton, Arntson, Berger) KHÔNG bám syllabus trường — đã thay toàn bộ.
 *
 * MỨC ĐỘ: Mục 0 (khung FLM) và Chương 1 (buổi 1-6) là ĐẦY ĐỦ, dạy được
 * ngay. Chương 2 → 10 CHỈ LÀ KHUNG (tên đúng + 3-6 dòng mốc nội dung mỗi
 * bài) — bài giảng chi tiết sẽ bổ sung sau, KHÔNG tự ý viết dài thêm.
 *
 * Sách/tài liệu: theo lệnh 20/09/2026, MỌI giáo trình phải là thẻ
 * `.khoi-sach`/`.the-sach` (xem content/academy/_HOP-DONG-SOAN-BAI.md,
 * mục "SÁCH & TÀI LIỆU"). Cả 4 giáo trình VCM202 là SÁCH GIẤY, trường
 * KHÔNG công bố link nào → dùng `.the-sach.khong-link`, KHÔNG bịa link.
 *
 * ⚠️ Nêu rõ các mâu thuẫn/ghi chú gốc từ FLM cho sinh viên (KHÔNG tự sửa
 * bảng gốc) — xem ghiChuKiemChung trong file syllabus JSON:
 *   1. Môn KHÔNG có thi cuối kỳ (100% là 5 assignment + participation),
 *      nhưng mục StudentTasks vẫn ghi "... in order to be accepted to the
 *      final examination" — mâu thuẫn trong chính syllabus, giữ nguyên.
 *   2. ISBN tài liệu #4 (9782940373093) có tiền tố 978-2 (NXB Pháp/Thuỵ Sĩ)
 *      trong khi cột NXB ghi Bloomsbury — chỗ cần kiểm lại, giữ nguyên.
 *   3. Đánh số mục trong kế hoạch buổi BỊ NHẢY ở các buổi 15, 22, 23, 31,
 *      32, 46 (thiếu số hoặc trùng số) — giữ nguyên bảng gốc.
 *   4. Rất nhiều buổi lặp y nguyên nội dung (7-9, 16-18, 24-26, 33-35,
 *      48-59) — đó là các buổi làm bài tại lớp, giữ nguyên.
 *
 * Giữ NGUYÊN slug các bài đã có trong bản trước (tái sử dụng cho nội dung
 * mới tương ứng): vcm202-0-0-tai-lieu, vcm202-0-1-overview,
 * vcm202-1-1-what-is-vc, vcm202-2-1-elements, vcm202-3-1-principles,
 * vcm202-4-1-gestalt, vcm202-5-1-color, vcm202-6-1-type-layout,
 * vcm202-7-1-semiotics, vcm202-8-1-applications, vcm202-quiz-1,
 * course.slug vcm202-visual-communication. Bài MỚI dùng lối
 * vcm202-<chương>-<số>-<mô tả>.
 *
 * ⚠️ KHÔNG backtick lồng hay ${ } bên trong các chuỗi nội dung bài học.
 * Bảng 60 buổi (0.5) và các thẻ sách dựng bằng nối chuỗi thường (biến +
 * "chuỗi"), không dùng template literal lồng, để tránh chính lỗi đó.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ─────────────────────────────────────────────────────────────────────────
// Thẻ sách dùng chung (.khoi-sach/.the-sach) — CẢ 4 đều SÁCH GIẤY, trường
// KHÔNG công bố link nào. Dựng bằng nối chuỗi thường, dán lại ở bất kỳ bài
// nào nhắc tới cuốn sách tương ứng.
// ─────────────────────────────────────────────────────────────────────────
const sachDavisHunt =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link chinh">' +
  '<span class="sach-ico">📘</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Visual Communication Design</span>' +
  '<span class="sach-phu">Meredith Davis &amp; Jamer Hunt · Bloomsbury · 2017 · 2nd ed · ISBN 9781350031838</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">Giáo trình chính</span><span class="sach-nhan giay">Sách giấy — không có link</span></span>' +
  '</span>' +
  '</div></div>';

const sachArntson =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📗</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Graphic Design Basics</span>' +
  '<span class="sach-phu">Amy E. Arntson · Cengage Learning · 2011 · 6th ed · ISBN 9781111347178</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy — không có link</span></span>' +
  '</span>' +
  '</div></div>';

const sachLester =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📙</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Visual Communication — Images with messages</span>' +
  '<span class="sach-phu">Paul Martin Lester · Michael Rosenberg · 2014 · ISBN 9781133308645</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy — không có link</span></span>' +
  '</span>' +
  '</div></div>';

const sachBaldwinRoberts =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📕</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Visual Communication from Theory to Practice</span>' +
  '<span class="sach-phu">Jonathan Baldwin, Lucienne Roberts · Bloomsbury · 2019 · 2nd ed · ISBN 9782940373093</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy — không có link</span></span>' +
  '</span>' +
  '</div></div>' +
  '<div class="note-ct"><p>ISBN của cuốn này (9782940373093) có tiền tố <strong>978-2</strong> — thuộc khối nhà xuất bản Pháp/Thuỵ Sĩ (thường là AVA Publishing), trong khi cột "Publisher" của FLM ghi <strong>Bloomsbury</strong>. Chúng tôi giữ nguyên đúng như FLM công bố; đây là chỗ dữ liệu gốc có thể cần trường kiểm lại, không phải lỗi chúng tôi thêm vào.</p></div>';

// ─────────────────────────────────────────────────────────────────────────
// MỤC 0 — Khung FLM (đầy đủ, chính xác 100% theo Syllabus 13360)
// ─────────────────────────────────────────────────────────────────────────

const m01 = doc('vcm202-0-1-overview', '0.1 — Course profile (FLM Syllabus 13360)|||0.1 — Hồ sơ môn (FLM Syllabus 13360)',
  'Tên môn, mã môn, 3 tín chỉ, phân bổ thời gian (150h = 45h lớp + 105h tự học), môn tiên quyết — nguyên văn FLM, kèm sylID + số quyết định để sinh viên tự kiểm chứng.',
  [[
    `<span class="eyebrow">VCM202 · Section 0 · 0.1 · Course profile</span>
<h2>Course profile — Visual Communication (VCM202)</h2>
<p class="lead">The facts below are copied exactly as published on <strong>FLM</strong> (FPT University's syllabus system) so you can verify every number yourself.</p>
<table>
<tr><th>Field</th><th>Value (FLM)</th></tr>
<tr><td>Syllabus Name</td><td>Visual Communication_Nguyên lý thị giác</td></tr>
<tr><td>Course Name (English)</td><td>Visual Communication</td></tr>
<tr><td>Subject Code</td><td>VCM202</td></tr>
<tr><td>Credits</td><td>3</td></tr>
<tr><td>Degree Level</td><td>Bachelor</td></tr>
<tr><td>Time Allocation</td><td>Study hour (150h) = 45h contact hours + 105h self-study</td></tr>
<tr><td>Pre-Requisite</td><td>None</td></tr>
<tr><td>Learning-Teaching Method</td><td>Lectures, Tutorials, Discussions, Laboratory work, Group work, Seminars</td></tr>
<tr><td>Scoring Scale</td><td>10</td></tr>
<tr><td>Min. average mark to pass</td><td>5</td></tr>
<tr><td>Decision No.</td><td>932/QĐ-ĐHFPT dated 08/22/2025</td></tr>
<tr><td>Syllabus ID</td><td>13360</td></tr>
</table>
<div class="callout"><span class="badge">Self-check</span> Every figure above is taken verbatim from FLM — Syllabus ID <strong>13360</strong>, issued under Decision <strong>932/QĐ-ĐHFPT dated 08/22/2025</strong>. Original: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13360" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13360)</a>.</div>
<p><em>Course description (FLM):</em> This course provides an introduction to visual communication design for students and provides them with the knowledge and skills to communicate their ideas and processes in a visual form more effectively. As a means of questioning and applying fundamental theories, concepts, and techniques, students produce visually meaningful projects. The course examines the basic elements of visual communication and how context shapes visual forms production and reception. Students will also learn to analyze the attention-getting qualities of form that engage people in compelling interactions.</p>
<p><em>Nguồn: FLM · Syllabus 13360 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">VCM202 · Mục 0 · 0.1 · Hồ sơ môn</span>
<h2>Hồ sơ môn — Visual Communication (VCM202)</h2>
<p class="lead">Toàn bộ thông tin dưới đây lấy nguyên văn từ <strong>FLM</strong> (hệ thống syllabus của FPTU) để bạn tự đối chiếu.</p>
<table>
<tr><th>Trường</th><th>Giá trị (FLM)</th></tr>
<tr><td>Tên syllabus</td><td>Visual Communication_Nguyên lý thị giác</td></tr>
<tr><td>Tên môn (tiếng Anh)</td><td>Visual Communication</td></tr>
<tr><td>Mã môn</td><td>VCM202</td></tr>
<tr><td>Số tín chỉ</td><td>3</td></tr>
<tr><td>Bậc học</td><td>Đại học (Bachelor)</td></tr>
<tr><td>Phân bổ thời gian</td><td>150 giờ học = <strong>45 giờ lên lớp</strong> + <strong>105 giờ tự học</strong></td></tr>
<tr><td>Môn tiên quyết</td><td>Không có (None)</td></tr>
<tr><td>Phương pháp dạy-học</td><td>Giảng, thực hành có hướng dẫn, thảo luận, thực hành xưởng (lab), làm nhóm, seminar</td></tr>
<tr><td>Thang điểm</td><td>10</td></tr>
<tr><td>Điểm trung bình tối thiểu để qua môn</td><td>5</td></tr>
<tr><td>Số quyết định</td><td>932/QĐ-ĐHFPT ngày 22/08/2025</td></tr>
<tr><td>Syllabus ID</td><td>13360</td></tr>
</table>
<div class="callout"><span class="badge">Tự kiểm chứng</span> Mọi con số trên lấy nguyên văn từ FLM — Syllabus ID <strong>13360</strong>, ban hành theo Quyết định <strong>932/QĐ-ĐHFPT ngày 22/08/2025</strong>. Bản gốc: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13360" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13360)</a>.</div>
<p><em>Mô tả môn (FLM, dịch):</em> Môn học giới thiệu nhập môn về thiết kế truyền thông thị giác, trang bị kiến thức &amp; kỹ năng để truyền đạt ý tưởng và quy trình làm việc bằng hình thức thị giác hiệu quả hơn. Bằng cách đặt câu hỏi và áp dụng các lý thuyết, khái niệm, kỹ thuật nền tảng, sinh viên tạo ra các dự án có ý nghĩa thị giác. Môn khảo sát các yếu tố cơ bản của truyền thông thị giác và cách bối cảnh định hình việc tạo ra &amp; tiếp nhận các hình thức thị giác. Sinh viên cũng học phân tích các phẩm chất gây chú ý của hình thức, giúp lôi cuốn người xem vào những tương tác hấp dẫn.</p>
<p><em>Nguồn: FLM · Syllabus 13360 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m02 = doc('vcm202-0-2-cach-tinh-diem', '0.2 — Grading breakdown: 6 items, 100%, NO final exam|||0.2 — Cách tính điểm: 6 đầu điểm, tổng 100%, KHÔNG thi cuối kỳ',
  'Đủ 6 đầu điểm với trọng số đúng nguyên văn FLM — tổng 10+15+15+20+30+10 = 100%. Môn KHÔNG có thi cuối kỳ; Assignment 5 một mình chiếm 30%. Kèm nguyên văn "Knowledge and Skill" — đề bài thật của từng assignment.',
  [[
    `<span class="eyebrow">VCM202 · Section 0 · 0.2 · Grading</span>
<h2>Grading breakdown — 6 items, total 100%</h2>
<div class="callout danger"><span class="badge">⚠️ No final exam</span> This course has <strong>NO final examination</strong>. Your entire grade is <strong>5 studio assignments + participation</strong>. <strong>Assignment 5 alone is worth 30%</strong> — the single biggest item in the course.</div>
<p class="lead">Scale: <strong>10</strong>. Pass mark: average ≥ <strong>5</strong>. All 5 assignments are "on-going" — done in class and as homework.</p>
<table>
<tr><th>#</th><th>Item (FLM)</th><th>Weight</th><th>CLO</th><th>Knowledge and Skill (nguyên văn FLM)</th></tr>
<tr><td>1</td><td>Assignment 1</td><td>10%</td><td>CLO1, CLO2</td><td>Student creates a drawing as a means by which ideas and concepts are communicated. Student explains how the assignment communicates visually and improves the viewers' experience with variety of structure.</td></tr>
<tr><td>2</td><td>Assignment 2</td><td>15%</td><td>CLO2, CLO3</td><td>Student creates a composition as a means by which ideas and concepts are communicated. Student analyzes the attention-getting qualities. Students are required to use variety of tools: hand drawing, digital drawing, generative AI.</td></tr>
<tr><td>3</td><td>Assignment 3</td><td>15%</td><td>CLO2, CLO4</td><td>Students apply knowledge of visual elements, generate and develop personal visual ideas/concepts through a collage composition.</td></tr>
<tr><td>4</td><td>Assignment 4</td><td>20%</td><td>CLO2, CLO3, CLO4</td><td>Student research and deconstruct a story by setting, characters, objects, events with chosen medium providing multiple frame work.</td></tr>
<tr><td>5</td><td>Assignment 5</td><td>30%</td><td>CLO2, CLO4, CLO5</td><td>Student research a specific theme, idea, and construct a complete story and create method to present the story.</td></tr>
<tr><td>6</td><td>Participation</td><td>10%</td><td>CLO6</td><td>— (in class, ongoing)</td></tr>
</table>
<p><strong>Total: 10% + 15% + 15% + 20% + 30% + 10% = 100%.</strong></p>
<div class="callout warn"><span class="badge">⚠️ Contradiction kept as-is</span> Section 0.6 (Student Tasks) still says you must <em>"attend at least 80% of class hours in order to be accepted to the final examination"</em> — even though, as the table above shows, this course has <strong>no final examination</strong>. This is FLM's own wording; we report it rather than silently fixing it. Read it as: attendance is still graded via <strong>Participation (10%)</strong> and required to sit any in-class assessment.</div>
<p><em>Nguồn: FLM · Syllabus 13360 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">VCM202 · Mục 0 · 0.2 · Cách tính điểm</span>
<h2>Cách tính điểm — 6 đầu điểm, tổng 100%</h2>
<div class="callout danger"><span class="badge">⚠️ KHÔNG thi cuối kỳ</span> Môn này <strong>KHÔNG có thi cuối kỳ</strong>. Toàn bộ điểm là <strong>5 bài tập lớn (assignment) studio + chuyên cần</strong>. <strong>Riêng Assignment 5 đã chiếm 30%</strong> — đầu điểm lớn nhất môn.</div>
<p class="lead">Thang điểm: <strong>10</strong>. Qua môn khi điểm trung bình ≥ <strong>5</strong>/10. Cả 5 assignment đều "on-going" — làm trong lớp và ở nhà.</p>
<table>
<tr><th>#</th><th>Đầu điểm (nguyên văn FLM)</th><th>Trọng số</th><th>CLO</th><th>Nội dung yêu cầu (dịch từ FLM — đề bài thật)</th></tr>
<tr><td>1</td><td>Assignment 1</td><td>10%</td><td>CLO1, CLO2</td><td>Sinh viên tạo một bức vẽ như một phương tiện truyền đạt ý tưởng &amp; khái niệm. Sinh viên giải thích bài tập truyền đạt thị giác thế nào và cải thiện trải nghiệm người xem qua nhiều dạng cấu trúc ra sao.</td></tr>
<tr><td>2</td><td>Assignment 2</td><td>15%</td><td>CLO2, CLO3</td><td>Sinh viên tạo một bố cục như một phương tiện truyền đạt ý tưởng &amp; khái niệm. Sinh viên phân tích các phẩm chất gây chú ý. Sinh viên bắt buộc dùng nhiều công cụ: vẽ tay, vẽ số, AI tạo sinh.</td></tr>
<tr><td>3</td><td>Assignment 3</td><td>15%</td><td>CLO2, CLO4</td><td>Sinh viên áp dụng kiến thức về yếu tố thị giác, sinh và phát triển ý tưởng/khái niệm thị giác cá nhân qua một bố cục collage (cắt dán).</td></tr>
<tr><td>4</td><td>Assignment 4</td><td>20%</td><td>CLO2, CLO3, CLO4</td><td>Sinh viên nghiên cứu &amp; phân rã một câu chuyện theo bối cảnh, nhân vật, vật thể, sự kiện bằng phương tiện tự chọn, tạo khuôn khổ nhiều-khung-hình.</td></tr>
<tr><td>5</td><td>Assignment 5</td><td>30%</td><td>CLO2, CLO4, CLO5</td><td>Sinh viên nghiên cứu một chủ đề/ý tưởng cụ thể, dựng một câu chuyện hoàn chỉnh và sáng tạo cách trình bày câu chuyện đó.</td></tr>
<tr><td>6</td><td>Participation (Chuyên cần)</td><td>10%</td><td>CLO6</td><td>— (trong lớp, xuyên suốt)</td></tr>
</table>
<p><strong>Tổng: 10% + 15% + 15% + 20% + 30% + 10% = 100%.</strong></p>
<div class="callout warn"><span class="badge">⚠️ Mâu thuẫn — giữ nguyên</span> Mục 0.6 (Nhiệm vụ sinh viên) vẫn ghi <em>"phải dự lớp ít nhất 80% số giờ mới đủ điều kiện dự thi cuối kỳ"</em> — dù bảng trên cho thấy môn này <strong>không có thi cuối kỳ</strong>. Đây là nguyên văn FLM, chúng tôi nêu ra chứ không tự sửa. Hiểu đơn giản: điểm danh vẫn được tính qua <strong>Participation (10%)</strong> và vẫn là điều kiện để tham gia các buổi đánh giá trên lớp.</div>
<p><em>Nguồn: FLM · Syllabus 13360 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m03 = doc('vcm202-0-3-clo', '0.3 — Course Learning Outcomes (6 CLO)|||0.3 — Chuẩn đầu ra môn học (6 CLO)',
  'Nguyên văn 6 CLO tiếng Anh + bản dịch, kèm bảng ánh xạ CLO ↔ buổi ↔ assignment để sinh viên biết mỗi CLO được rèn ở đâu.',
  [[
    `<span class="eyebrow">VCM202 · Section 0 · 0.3 · CLO</span>
<h2>Course Learning Outcomes — 6 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Detail (nguyên văn FLM)</th></tr>
<tr><td>1</td><td>CLO1</td><td>Explain the way people communicate visually, and how communication design organizes experience in a variety of structures.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Apply knowledge to arrange the elements — words, images and/or symbols that contribute to the construction of meaning, utilizing tools such as traditional tools, digital tools, or generative AI.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Analyze the attention-getting qualities of form, which constitute an essential first step to appropriate interpretive behaviors, engage people in compelling interactions, and extend meaning beyond the momentary encounter with the message.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Create a composition that communicates and provides information about relevant interactions among the components of a message by applying knowledge of interaction, interpretation, and experience.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Create visual communication design solutions for specific cultural and digital contexts by applying manual and/or digital methods of retaining and extending meaning.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Have a positive attitude and a professional working style.</td></tr>
</table>
<h3>CLO ↔ Session ↔ Assignment map (summary)</h3>
<table>
<tr><th>CLO</th><th>Chủ yếu ở buổi</th><th>Đầu điểm chính</th></tr>
<tr><td>CLO1</td><td>1-2, 7-12</td><td>Assignment 1 (10%)</td></tr>
<tr><td>CLO2</td><td>3-6, 7-12, 16-21, 24-30, 33-45, 48-60 (dùng xuyên suốt)</td><td>Assignment 1, 2, 3, 4, 5</td></tr>
<tr><td>CLO3</td><td>13-32</td><td>Assignment 2, 3, 4</td></tr>
<tr><td>CLO4</td><td>22-45, 48-60</td><td>Assignment 3, 4, 5</td></tr>
<tr><td>CLO5</td><td>46-60</td><td>Assignment 5 (30%)</td></tr>
<tr><td>CLO6</td><td>1-60 (xuyên suốt)</td><td>Participation (10%)</td></tr>
</table>
<p class="ghi-chu">Bảng ánh xạ là bản tóm tắt theo cột CLO của từng buổi trong 0.5 — xem bảng 60 buổi để biết chính xác CLO của một buổi cụ thể.</p>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Mục 0 · 0.3 · Chuẩn đầu ra</span>
<h2>Chuẩn đầu ra môn học — 6 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Nội dung (nguyên văn FLM)</th><th>Bản dịch</th></tr>
<tr><td>1</td><td>CLO1</td><td>Explain the way people communicate visually, and how communication design organizes experience in a variety of structures.</td><td>Giải thích cách con người truyền thông bằng thị giác, và cách thiết kế truyền thông tổ chức trải nghiệm qua nhiều dạng cấu trúc.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Apply knowledge to arrange the elements — words, images and/or symbols that contribute to the construction of meaning, utilizing tools such as traditional tools, digital tools, or generative AI.</td><td>Áp dụng kiến thức để sắp xếp các yếu tố — chữ, hình ảnh và/hoặc ký hiệu — góp phần dựng nên ý nghĩa, dùng công cụ truyền thống, công cụ số, hoặc AI tạo sinh.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Analyze the attention-getting qualities of form, which constitute an essential first step to appropriate interpretive behaviors, engage people in compelling interactions, and extend meaning beyond the momentary encounter with the message.</td><td>Phân tích các phẩm chất gây chú ý của hình thức — bước đầu thiết yếu để có hành vi diễn giải phù hợp, lôi cuốn người xem vào tương tác hấp dẫn, và mở rộng nghĩa vượt ra ngoài khoảnh khắc tiếp xúc với thông điệp.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Create a composition that communicates and provides information about relevant interactions among the components of a message by applying knowledge of interaction, interpretation, and experience.</td><td>Tạo một bố cục truyền đạt và cung cấp thông tin về các tương tác liên quan giữa các thành phần của thông điệp, bằng cách áp dụng kiến thức về tương tác, diễn giải và trải nghiệm.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Create visual communication design solutions for specific cultural and digital contexts by applying manual and/or digital methods of retaining and extending meaning.</td><td>Tạo các giải pháp thiết kế truyền thông thị giác cho bối cảnh văn hoá &amp; số cụ thể, bằng cách áp dụng phương pháp thủ công và/hoặc số để ghi nhớ và mở rộng nghĩa.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Have a positive attitude and a professional working style.</td><td>Có thái độ tích cực và phong cách làm việc chuyên nghiệp.</td></tr>
</table>
<h3>Ánh xạ CLO ↔ Buổi ↔ Assignment (tóm tắt)</h3>
<table>
<tr><th>CLO</th><th>Chủ yếu ở buổi</th><th>Đầu điểm chính</th></tr>
<tr><td>CLO1</td><td>1-2, 7-12</td><td>Assignment 1 (10%)</td></tr>
<tr><td>CLO2</td><td>3-6, 7-12, 16-21, 24-30, 33-45, 48-60 (dùng xuyên suốt)</td><td>Assignment 1, 2, 3, 4, 5</td></tr>
<tr><td>CLO3</td><td>13-32</td><td>Assignment 2, 3, 4</td></tr>
<tr><td>CLO4</td><td>22-45, 48-60</td><td>Assignment 3, 4, 5</td></tr>
<tr><td>CLO5</td><td>46-60</td><td>Assignment 5 (30%)</td></tr>
<tr><td>CLO6</td><td>1-60 (xuyên suốt)</td><td>Participation (10%)</td></tr>
</table>
<p class="ghi-chu">Bảng ánh xạ là bản tóm tắt theo cột CLO của từng buổi trong mục 0.5 — xem bảng 60 buổi để biết chính xác CLO của một buổi cụ thể.</p>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const m04 = doc('vcm202-0-0-tai-lieu', '0.4 — Course materials & tools (4 books, all paper-only)|||0.4 — Giáo trình & công cụ (4 sách, tất cả bản giấy)',
  'Đủ 4 giáo trình FLM dạng thẻ sách — tất cả là SÁCH GIẤY, không có link. Tài liệu chính: Visual Communication Design (Davis &amp; Hunt). Kèm danh sách vật tư THẬT bắt buộc (giấy, dao kéo, keo, báo cũ...) — môn này không chỉ cần laptop.',
  [[
    `<span class="eyebrow">VCM202 · Section 0 · 0.4 · Materials &amp; tools</span>
<h2>Course materials &amp; tools</h2>
<p class="lead">All <strong>4</strong> official FLM materials for VCM202 are <strong>paper books</strong> — FLM publishes <strong>no online link</strong> for any of them. The <strong>main material</strong> is <em>Visual Communication Design</em> (Davis &amp; Hunt).</p>
` + sachDavisHunt + `
` + sachArntson + `
` + sachLester + `
` + sachBaldwinRoberts + `
<h3>🧰 Tools — you need REAL physical supplies, not just a laptop</h3>
<div class="pitfall"><strong>Sinh viên hay bỏ sót.</strong> Đây là môn thực hành thị giác thủ công (đặc biệt Assignment 3 — Collage): thiếu vật tư giấy/kéo/keo/báo cũ là KHÔNG làm được bài, dù laptop có mạnh cỡ nào.</div>
<p>FLM "Tools" (nguyên văn):</p>
<ul>
<li>1 folder (size A2)</li>
<li>Paper (size A2, A3, A4), A1 backboard paper</li>
<li>Collecting newspaper, magazine having color photos</li>
<li>Color, pencil, eraser, brushes, black ink pen</li>
<li>Ruler, paper knife, scissors, paper sticking-plaster, double sided tape, glue</li>
<li>Laptop</li>
<li>Digital graphic design tools</li>
<li>Suitable Generative AI tools</li>
<li>Video recording equipment</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Mục 0 · 0.4 · Giáo trình &amp; công cụ</span>
<h2>Giáo trình &amp; công cụ</h2>
<p class="lead">Đủ <strong>4</strong> tài liệu chính thức của FLM cho VCM202, và cả 4 đều là <strong>sách giấy</strong> — FLM <strong>không công bố link</strong> cho bất kỳ cuốn nào. Tài liệu <strong>chính</strong> là <em>Visual Communication Design</em> (Davis &amp; Hunt).</p>
` + sachDavisHunt + `
` + sachArntson + `
` + sachLester + `
` + sachBaldwinRoberts + `
<h3>🧰 Công cụ — cần VẬT TƯ THẬT, không chỉ laptop</h3>
<div class="pitfall"><strong>Sinh viên hay bỏ sót.</strong> Đây là môn thực hành thị giác thủ công (đặc biệt Assignment 3 — Collage/cắt dán): thiếu giấy/dao kéo/keo/báo tạp chí cũ là KHÔNG làm được bài, dù laptop có mạnh cỡ nào.</p></div>
<p>Công cụ theo FLM (dịch):</p>
<ul>
<li>1 bìa hồ sơ (khổ A2)</li>
<li>Giấy (khổ A2, A3, A4), giấy bìa cứng khổ A1</li>
<li>Sưu tầm báo, tạp chí có ảnh màu</li>
<li>Màu, bút chì, tẩy, cọ vẽ, bút mực đen</li>
<li>Thước kẻ, dao rọc giấy, kéo, băng dính giấy, băng dính hai mặt, keo dán</li>
<li>Laptop</li>
<li>Công cụ thiết kế đồ hoạ số</li>
<li>Công cụ AI tạo sinh phù hợp</li>
<li>Thiết bị quay video</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

// ── 0.5 — Kế hoạch 60 buổi: dựng bằng nối chuỗi thường (KHÔNG template lồng) ──
const buoiData = [
  [1, 'INTRODUCTION TO VISUAL COMMUNICATION — Sensing; Selecting; Perceiving. Sensing + selecting + perceiving = seeing', 'NHẬP MÔN TRUYỀN THÔNG THỊ GIÁC — Cảm nhận; Chọn lọc; Tri giác. Cảm nhận + chọn lọc + tri giác = nhìn thấy', 'CLO1', 'Ch.1 · 1.1'],
  [2, 'INTRODUCTION TO VISUAL COMMUNICATION — 1. Making sense of experience; 2. Experience and Time; 3. Experience and Media; 4. Introduction to generative AI in Visual Communication', 'NHẬP MÔN TRUYỀN THÔNG THỊ GIÁC — 1. Tạo nghĩa từ trải nghiệm; 2. Trải nghiệm &amp; Thời gian; 3. Trải nghiệm &amp; Phương tiện; 4. Nhập môn AI tạo sinh trong Truyền thông thị giác', 'CLO1, CLO2', 'Ch.1 · 1.2'],
  [3, 'DEFINITION OF BASIC ARTS AND GRAPHIC ELEMENTS — 1. Point; 2. Line; 3. Shape; 4. Background', 'ĐỊNH NGHĨA CÁC YẾU TỐ NGHỆ THUẬT &amp; ĐỒ HOẠ CƠ BẢN — 1. Điểm; 2. Đường; 3. Hình; 4. Nền', 'CLO2', 'Ch.1 · 1.3'],
  [4, 'DEFINITION OF BASIC ARTS AND GRAPHIC ELEMENTS — 1. Point; 2. Line; 3. Shape; 4. Background', 'ĐỊNH NGHĨA CÁC YẾU TỐ NGHỆ THUẬT &amp; ĐỒ HOẠ CƠ BẢN — 1. Điểm; 2. Đường; 3. Hình; 4. Nền', 'CLO2', 'Ch.1 · 1.3'],
  [5, 'COMPOSITION — Example', 'BỐ CỤC — Ví dụ', 'CLO2', 'Ch.1 · 1.4'],
  [6, 'CODE AND STYLE', 'MÃ &amp; PHONG CÁCH (CODE AND STYLE)', 'CLO2', 'Ch.1 · 1.5'],
  [7, 'ASSIGNMENT 1. DRAWING AS A MEAN OF COMMUNICATION (10%) — Drawing a black and white piece of visual idea/concept to create a mood/send a message; Use any FORM (dots, lines, shapes) that helps communicating the message; Use observational, visualization and presentation drawing; May use tools to generate references for inspiration', 'BÀI TẬP 1. VẼ ĐỂ TRUYỀN ĐẠT (10%) — Vẽ một tác phẩm đen trắng thể hiện ý tưởng/khái niệm thị giác để tạo cảm xúc/truyền thông điệp; Dùng bất kỳ HÌNH THỨC nào (chấm, đường, hình) giúp truyền đạt thông điệp; Dùng vẽ quan sát, vẽ hình dung và vẽ trình bày; Có thể dùng công cụ tạo tài liệu tham khảo truyền cảm hứng', 'CLO1, CLO2', 'Ch.2 · 2.1'],
  [8, 'ASSIGNMENT 1. DRAWING AS A MEAN OF COMMUNICATION (10%) — same as Session 7', 'BÀI TẬP 1. VẼ ĐỂ TRUYỀN ĐẠT (10%) — như buổi 7', 'CLO1, CLO2', 'Ch.2 · 2.1'],
  [9, 'ASSIGNMENT 1. DRAWING AS A MEAN OF COMMUNICATION (10%) — same as Session 7', 'BÀI TẬP 1. VẼ ĐỂ TRUYỀN ĐẠT (10%) — như buổi 7', 'CLO1, CLO2', 'Ch.2 · 2.1'],
  [10, 'ASSIGNMENT 1. DRAWING AS A MEAN OF COMMUNICATION (Continue)', 'BÀI TẬP 1. VẼ ĐỂ TRUYỀN ĐẠT (Tiếp tục)', 'CLO1, CLO2', 'Ch.2 · 2.2'],
  [11, 'ASSIGNMENT 1. DRAWING AS A MEAN OF COMMUNICATION (Continue)', 'BÀI TẬP 1. VẼ ĐỂ TRUYỀN ĐẠT (Tiếp tục)', 'CLO1, CLO2', 'Ch.2 · 2.2'],
  [12, 'ASSIGNMENT 1. DRAWING AS A MEAN OF COMMUNICATION (Continue) — Grading and Evaluating Assignment 01', 'BÀI TẬP 1. VẼ ĐỂ TRUYỀN ĐẠT (Tiếp tục) — Chấm &amp; đánh giá Bài tập 01', 'CLO1, CLO2', 'Ch.2 · 2.2'],
  [13, 'GETTING ATTENTION — 1. Contrast; 2. Figure-ground and color', 'GÂY CHÚ Ý — 1. Tương phản; 2. Hình-nền &amp; màu sắc', 'CLO3', 'Ch.3 · 3.1'],
  [14, 'GETTING ATTENTION — 3. Size constancy, scale, and proportion; 4. Layering; 5. Symmetry/Asymmetry', 'GÂY CHÚ Ý — 3. Hằng định kích thước, tỉ lệ; 4. Xếp lớp; 5. Đối xứng/Bất đối xứng', 'CLO3', 'Ch.3 · 3.1'],
  [15, 'GETTING ATTENTION — 7. Pattern; 8. Series and Sequences; 9. Rhythm and pacing; 10. Motion (⚠️ đánh số bắt đầu từ 7 trong bản gốc FLM — thiếu mục 1-6, giữ nguyên)', 'GÂY CHÚ Ý — 7. Hoa văn (Pattern); 8. Chuỗi &amp; trình tự; 9. Nhịp điệu; 10. Chuyển động (⚠️ FLM đánh số bắt đầu từ 7 — thiếu mục 1-6, giữ nguyên bản gốc)', 'CLO3', 'Ch.3 · 3.2'],
  [16, 'ASSIGNMENT 2. COMPOSITION (15%) — Use the vocabulary of visual message and apply principles to make a set of composition that conveys a message about a chosen topic; Free method of expressing; May use tools to generate references for inspiration', 'BÀI TẬP 2. BỐ CỤC (15%) — Dùng từ vựng thông điệp thị giác và áp dụng nguyên lý để tạo một bộ bố cục truyền đạt thông điệp về chủ đề đã chọn; Tự do chọn cách thể hiện; Có thể dùng công cụ tạo tài liệu tham khảo truyền cảm hứng', 'CLO2, CLO3', 'Ch.4 · 4.1'],
  [17, 'ASSIGNMENT 2. COMPOSITION (15%) — same as Session 16', 'BÀI TẬP 2. BỐ CỤC (15%) — như buổi 16', 'CLO2, CLO3', 'Ch.4 · 4.1'],
  [18, 'ASSIGNMENT 2. COMPOSITION (15%) — same as Session 16', 'BÀI TẬP 2. BỐ CỤC (15%) — như buổi 16', 'CLO2, CLO3', 'Ch.4 · 4.1'],
  [19, 'ASSIGNMENT 2. COMPOSITION (Continue) — Developing and executing ideas', 'BÀI TẬP 2. BỐ CỤC (Tiếp tục) — Phát triển &amp; thực hiện ý tưởng', 'CLO2, CLO3', 'Ch.4 · 4.2'],
  [20, 'ASSIGNMENT 2. COMPOSITION (Continue) — Developing and executing ideas using AI and digital tools', 'BÀI TẬP 2. BỐ CỤC (Tiếp tục) — Phát triển &amp; thực hiện ý tưởng bằng AI &amp; công cụ số', 'CLO2, CLO3', 'Ch.4 · 4.2'],
  [21, 'ASSIGNMENT 2. COMPOSITION (Continue) — Developing and executing ideas using AI and digital tools; Grading and Evaluating Assignment 02', 'BÀI TẬP 2. BỐ CỤC (Tiếp tục) — Phát triển &amp; thực hiện ý tưởng bằng AI &amp; công cụ số; Chấm &amp; đánh giá Bài tập 02', 'CLO2, CLO3', 'Ch.4 · 4.2'],
  [22, 'ORIENTING FOR USE AND INTERPRETATION — 1. Affordances; 2. Feedback; 5. Hierarchy; 6. Reading Pattern (⚠️ thiếu mục 3, 4 trong bản gốc FLM, giữ nguyên)', 'ĐỊNH HƯỚNG SỬ DỤNG &amp; DIỄN GIẢI — 1. Khả năng gợi ý sử dụng (Affordances); 2. Phản hồi; 5. Phân cấp (Hierarchy); 6. Thói quen đọc (⚠️ FLM thiếu mục 3, 4 — giữ nguyên bản gốc)', 'CLO3, CLO4', 'Ch.5 · 5.1'],
  [23, 'ORIENTING FOR USE AND INTERPRETATION — 5. Mapping; 6. Wayfinding; 7. Edge relationships; 8. Direction; 9. Point of view (⚠️ lại bắt đầu từ mục 5, trùng số với buổi 22, giữ nguyên)', 'ĐỊNH HƯỚNG SỬ DỤNG &amp; DIỄN GIẢI — 5. Ánh xạ (Mapping); 6. Định hướng đường đi; 7. Quan hệ mép biên; 8. Hướng; 9. Góc nhìn (⚠️ lại bắt đầu từ mục 5, trùng số buổi 22 — giữ nguyên bản gốc)', 'CLO3, CLO4', 'Ch.5 · 5.1'],
  [24, 'ASSIGNMENT 3. COLLAGE (15%) — Research theme; Research materials (photos, magazines, printed materials), test different textures, apply color theory to create moods and special effects; May use tools to generate references for inspiration', 'BÀI TẬP 3. COLLAGE (CẮT DÁN) (15%) — Nghiên cứu chủ đề; Nghiên cứu vật liệu (ảnh, tạp chí, ấn phẩm in), thử các chất liệu khác nhau, áp dụng lý thuyết màu để tạo cảm xúc &amp; hiệu ứng đặc biệt; Có thể dùng công cụ tạo tài liệu tham khảo truyền cảm hứng', 'CLO3, CLO4', 'Ch.6 · 6.1'],
  [25, 'ASSIGNMENT 3. COLLAGE (15%) — same as Session 24', 'BÀI TẬP 3. COLLAGE (15%) — như buổi 24', 'CLO3, CLO4', 'Ch.6 · 6.1'],
  [26, 'ASSIGNMENT 3. COLLAGE (15%) — same as Session 24', 'BÀI TẬP 3. COLLAGE (15%) — như buổi 24', 'CLO3, CLO4', 'Ch.6 · 6.1'],
  [27, 'ASSIGNMENT 3. COLLAGE (Continue)', 'BÀI TẬP 3. COLLAGE (Tiếp tục)', 'CLO2, CLO4', 'Ch.6 · 6.2'],
  [28, 'ASSIGNMENT 3. COLLAGE (Continue)', 'BÀI TẬP 3. COLLAGE (Tiếp tục)', 'CLO2, CLO4', 'Ch.6 · 6.2'],
  [29, 'ASSIGNMENT 3. COLLAGE (Continue)', 'BÀI TẬP 3. COLLAGE (Tiếp tục)', 'CLO2, CLO4', 'Ch.6 · 6.2'],
  [30, 'ASSIGNMENT 3. COLLAGE (Continue) — Grading and Evaluating Assignment 03', 'BÀI TẬP 3. COLLAGE (Tiếp tục) — Chấm &amp; đánh giá Bài tập 03', 'CLO2, CLO4', 'Ch.6 · 6.3'],
  [31, 'INTERACTING, INTERPRETING AND EXPERIENCING — 1. The nature of signs; 2. Icon, index and symbol; 3. Denotation and Connotation', 'TƯƠNG TÁC, DIỄN GIẢI &amp; TRẢI NGHIỆM — 1. Bản chất của dấu hiệu; 2. Icon, index &amp; symbol; 3. Nghĩa đen &amp; nghĩa liên tưởng', 'CLO3, CLO4', 'Ch.7 · 7.1'],
  [32, 'INTERACTING, INTERPRETING AND EXPERIENCING — 5. Abstraction; 6. Materiality; 7. Substitution; 8. Metaphor; 9. Appropriation; 10. Ambiguity (⚠️ nhảy từ mục 3 sang 5, thiếu mục 4, giữ nguyên)', 'TƯƠNG TÁC, DIỄN GIẢI &amp; TRẢI NGHIỆM — 5. Trừu tượng hoá; 6. Chất liệu; 7. Thay thế; 8. Ẩn dụ; 9. Chiếm dụng (Appropriation); 10. Nhập nhằng (Ambiguity) (⚠️ nhảy từ mục 3 (buổi 31) sang 5, thiếu mục 4 — giữ nguyên bản gốc)', 'CLO3, CLO4', 'Ch.7 · 7.1'],
  [33, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (20%) — Research a specific theme, idea; Deconstruct a story by setting, characters, objects, events; Free media chosen; Practice in group; May use tools to generate references for inspiration and materials', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (20%) — Nghiên cứu một chủ đề/ý tưởng cụ thể; Phân rã câu chuyện theo bối cảnh, nhân vật, vật thể, sự kiện; Tự do chọn phương tiện; Thực hành theo nhóm; Có thể dùng công cụ tạo tài liệu tham khảo &amp; vật liệu', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.1'],
  [34, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (20%) — same as Session 33', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (20%) — như buổi 33', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.1'],
  [35, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (20%) — same as Session 33', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (20%) — như buổi 33', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.1'],
  [36, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [37, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [38, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [39, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [40, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [41, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [42, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [43, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [44, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục)', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.2'],
  [45, 'ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue) — Grading and Evaluating Assignment 04', 'BÀI TẬP 4. TRUYỆN NHIỀU KHUNG HÌNH (Tiếp tục) — Chấm &amp; đánh giá Bài tập 04', 'CLO2, CLO3, CLO4', 'Ch.8 · 8.3'],
  [46, 'RETAINING AND EXTENDING MEANING — 1. Memory; 3. Stereotypes; 4. Archetypes (⚠️ thiếu mục 2, giữ nguyên)', 'GHI NHỚ &amp; MỞ RỘNG NGHĨA — 1. Trí nhớ; 3. Định kiến (Stereotypes); 4. Nguyên mẫu (Archetypes) (⚠️ FLM thiếu mục 2 — giữ nguyên bản gốc)', 'CLO5', 'Ch.9 · 9.1'],
  [47, 'RETAINING AND EXTENDING MEANING — 5. Narrative; 6. Mnemonics; 7. Chunking; 8. Redundancy', 'GHI NHỚ &amp; MỞ RỘNG NGHĨA — 5. Tự sự (Narrative); 6. Thuật ghi nhớ (Mnemonics); 7. Phân nhóm (Chunking); 8. Dư thừa có chủ đích (Redundancy)', 'CLO5', 'Ch.9 · 9.1'],
  [48, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — Research a specific theme, idea; Construct a complete story and create method to present the story; Students can choose between photographic collage, illustrative presentation, video, interactive product, or model making; Work in groups; Free media chosen; May use tools to generate references for inspiration and materials', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — Nghiên cứu một chủ đề/ý tưởng cụ thể; Dựng một câu chuyện hoàn chỉnh &amp; sáng tạo cách trình bày; Chọn giữa collage ảnh, trình bày minh hoạ, video, sản phẩm tương tác, hoặc làm mô hình; Làm việc theo nhóm; Tự do chọn phương tiện; Có thể dùng công cụ tạo tài liệu tham khảo &amp; vật liệu', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.1'],
  [49, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.1'],
  [50, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.1'],
  [51, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [52, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [53, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [54, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [55, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [56, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [57, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [58, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [59, 'ASSIGNMENT 5. VISUAL STORYTELLING (30%) — same as Session 48', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (30%) — như buổi 48', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.2'],
  [60, 'ASSIGNMENT 5. VISUAL STORYTELLING (Continue) — Grading and Evaluating Assignment 05', 'BÀI TẬP 5. KỂ CHUYỆN BẰNG HÌNH ẢNH (Tiếp tục) — Chấm &amp; đánh giá Bài tập 05', 'CLO2, CLO4, CLO5', 'Ch.10 · 10.3'],
];
const rowHtml = (r) => '<tr><td>Buổi ' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>';
const buoiRowsHtml = buoiData.map(rowHtml).join('');
const buoiTableEn =
  '<table><tr><th>Session</th><th>Topic (English, verbatim FLM)</th><th>Chủ đề (Việt)</th><th>CLO</th><th>Lesson on site</th></tr>' +
  buoiRowsHtml + '</table>';
const buoiTableVi =
  '<table><tr><th>Buổi</th><th>Chủ đề (Anh, nguyên văn FLM)</th><th>Chủ đề (Việt)</th><th>CLO</th><th>Bài trên web</th></tr>' +
  buoiRowsHtml + '</table>';

const m05 = doc('vcm202-0-5-ke-hoach-60-buoi', '0.5 — Full 60-session plan|||0.5 — Kế hoạch đủ 60 buổi',
  'Bảng đầy đủ 60 buổi FLM, giữ nguyên chủ đề tiếng Anh + thêm cột tiếng Việt + cột "Bài trên web". Nêu rõ đánh số mục bị nhảy (buổi 15, 22, 23, 32, 46) và các cụm buổi lặp y nguyên (buổi làm bài tại lớp).',
  [[
    '<span class="eyebrow">VCM202 · Section 0 · 0.5 · 60-session plan</span>' +
    '<h2>Full 60-session plan (FLM, verbatim topics)</h2>' +
    '<p class="lead">All 45 contact hours (60 sessions) exactly as scheduled by FLM. The last column shows which lesson on this site covers each session — Chapter 1 is fully taught; Chapters 2-10 are a framework (skeleton) for now.</p>' +
    buoiTableEn +
    '<div class="callout"><span class="badge">⚠️ Numbering jumps — kept as FLM published</span><p>The sub-item numbering inside a session\'s topic is inconsistent in FLM\'s own table: Session 15 starts at item "7" (items 1-6 missing); Session 22 lists items "1, 2, 5, 6" (items 3-4 missing); Session 23 restarts at item "5" (same number as Session 22); Session 32 jumps from item 3 (Session 31) to item 5 (item 4 missing); Session 46 lists items "1, 3, 4" (item 2 missing). We report these exactly as FLM published rather than renumbering them.</p></div>' +
    '<div class="callout"><span class="badge">Repeated sessions</span><p>Sessions 7-9, 16-18, 24-26, 33-35 and 48-59 repeat their block\'s topic verbatim in FLM\'s table — these are in-class studio/working sessions for the assignment, not new lecture content.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13360 · thu thập 19/09/2026.</em></p>',
    '<span class="eyebrow">VCM202 · Mục 0 · 0.5 · Kế hoạch 60 buổi</span>' +
    '<h2>Kế hoạch đủ 60 buổi (nguyên văn chủ đề FLM)</h2>' +
    '<p class="lead">Đủ 45 giờ lên lớp (60 buổi) đúng như FLM xếp lịch. Cột cuối cho biết bài nào trên web phủ buổi đó — Chương 1 dạy đầy đủ; Chương 2-10 hiện là khung, sẽ bổ sung chi tiết sau.</p>' +
    buoiTableVi +
    '<div class="callout"><span class="badge">⚠️ Đánh số mục bị nhảy — giữ nguyên như FLM công bố</span><p>Cách đánh số mục con trong chủ đề của một buổi không nhất quán ngay trong chính bảng FLM: buổi 15 bắt đầu từ mục "7" (thiếu mục 1-6); buổi 22 liệt kê mục "1, 2, 5, 6" (thiếu mục 3-4); buổi 23 lại bắt đầu từ mục "5" (trùng số với buổi 22); buổi 32 nhảy từ mục 3 (buổi 31) sang mục 5 (thiếu mục 4); buổi 46 liệt kê mục "1, 3, 4" (thiếu mục 2). Chúng tôi nêu đúng như FLM công bố, KHÔNG tự đánh số lại.</p></div>' +
    '<div class="callout"><span class="badge">Buổi lặp lại</span><p>Các buổi 7-9, 16-18, 24-26, 33-35 và 48-59 lặp y nguyên chủ đề của cả cụm trong bảng FLM — đây là các buổi thực hành/làm bài tại lớp cho assignment, không phải nội dung giảng mới.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13360 · thu thập 19/09/2026.</em></p>',
  ]]);

const m06 = doc('vcm202-0-6-nhiem-vu-sinh-vien', '0.6 — Student tasks (7 items, verbatim)|||0.6 — Nhiệm vụ sinh viên (nguyên văn 7 gạch đầu dòng)',
  'Nguyên văn 7 nhiệm vụ sinh viên theo FLM (StudentTasks), kèm bản dịch. Mục 1 ghi mâu thuẫn "thi cuối kỳ" dù môn không có — xem giải thích ở 0.2. Mục 7 là yêu cầu nộp Portfolio đầy đủ bài tập sau khoá.',
  [[
    `<span class="eyebrow">VCM202 · Section 0 · 0.6 · Student tasks</span>
<h2>Student tasks (FLM, verbatim)</h2>
<ol>
<li>Class attendance is strongly encouraged. Attend at least 80% of class hours in order to be accepted to the final examination.</li>
<li>Actively participate in class activities.</li>
<li>Fulfill tasks given by instructor after class.</li>
<li>Use their own laptop in class only for learning purpose.</li>
<li>Read the textbook in advance.</li>
<li>Access the course website (<a href="https://flm.fpt.edu.vn/gui/Home" target="_blank" rel="noopener">https://flm.fpt.edu.vn/gui/Home</a>) for up-to-date information and material of the course.</li>
<li>Complete course's Portfolio with full contents of exercises and submit to the teacher after the course.</li>
</ol>
<div class="callout warn"><span class="badge">⚠️ See 0.2</span> Item 1 mentions <em>"final examination"</em> even though this course has none (0.2) — an inconsistency in FLM's own text, kept verbatim.</div>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Mục 0 · 0.6 · Nhiệm vụ sinh viên</span>
<h2>Nhiệm vụ sinh viên (nguyên văn FLM, dịch)</h2>
<ol>
<li>Rất khuyến khích đi học đầy đủ. Dự lớp ít nhất 80% số giờ mới đủ điều kiện dự thi cuối kỳ.</li>
<li>Tích cực tham gia các hoạt động trên lớp.</li>
<li>Hoàn thành các nhiệm vụ giảng viên giao sau giờ học.</li>
<li>Chỉ dùng laptop cá nhân trong lớp cho mục đích học tập.</li>
<li>Đọc giáo trình trước khi lên lớp.</li>
<li>Truy cập trang môn học (<a href="https://flm.fpt.edu.vn/gui/Home" target="_blank" rel="noopener">https://flm.fpt.edu.vn/gui/Home</a>) để cập nhật thông tin &amp; tài liệu môn học.</li>
<li><strong>Hoàn thành Portfolio môn học với đầy đủ nội dung các bài tập và nộp cho giảng viên sau khi kết thúc khoá học.</strong></li>
</ol>
<div class="callout warn"><span class="badge">⚠️ Xem mục 0.2</span> Mục 1 nhắc tới <em>"thi cuối kỳ"</em> dù môn này không có thi cuối kỳ (xem 0.2) — đây là mâu thuẫn trong chính văn bản FLM, chúng tôi giữ nguyên chứ không tự sửa.</div>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1-6): Nhập môn thị giác + yếu tố cơ bản + bố cục
// + code &amp; style. Dạy được ngay, song ngữ, ví dụ cụ thể (biển báo, logo,
// bìa sách). Kết chương bằng 1 quiz.
// ─────────────────────────────────────────────────────────────────────────

const c1_1 = doc('vcm202-1-1-what-is-vc', '1.1 — Sensing, Selecting, Perceiving = Seeing (buổi 1, CLO1)|||1.1 — Cảm nhận, Chọn lọc, Tri giác = Nhìn thấy (buổi 1, CLO1)',
  'Buổi 1, CLO1. Xương sống của cả môn: chuỗi Sensing → Selecting → Perceiving = Seeing. "Nhìn thấy" là một hành động tri giác chủ động, không phải chỉ mở mắt.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 1 · Lesson 1.1 · Session 1 · CLO1</span>
<h2>Sensing, Selecting, Perceiving — the chain that IS "seeing"</h2>
<p class="lead">FLM topic (Session 1): <em>"INTRODUCTION TO VISUAL COMMUNICATION — Sensing; Selecting; Perceiving. Sensing + selecting + perceiving = seeing."</em> This one equation is the spine of the entire course.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 1 — "INTRODUCTION TO VISUAL COMMUNICATION — Sensing; Selecting; Perceiving. Sensing + selecting + perceiving = seeing"</p>
<h3>"Seeing" is not automatic — it is built from three steps</h3>
<table>
<thead><tr><th>Step</th><th>What happens</th><th>Who controls it</th></tr></thead>
<tbody>
<tr><td><strong>Sensing</strong></td><td>Raw light hits the retina. Physically, everyone in the room receives roughly the same photons.</td><td>The eye (mostly out of your control)</td></tr>
<tr><td><strong>Selecting</strong></td><td>The brain cannot process everything at once, so attention filters what matters — driven by contrast, motion, familiarity, and current need.</td><td>Attention (designers can steer this)</td></tr>
<tr><td><strong>Perceiving</strong></td><td>The brain organizes the selected input into meaningful shapes and ideas, using memory and expectation.</td><td>Prior knowledge &amp; culture</td></tr>
</tbody>
</table>
<div class="diagram"><pre>Light -> EYE (sensing) -> ATTENTION FILTER (selecting) -> BRAIN builds meaning (perceiving)
                                                                    |
                                                                    v
                                                              = SEEING
</pre></div>
<p>Two people can look at the exact same scene and <strong>see different things</strong>, because selecting and perceiving depend on culture, mood and expectation, not just the light hitting the eye. This is exactly why visual communication design is possible: a designer cannot control sensing, but can deliberately shape what gets <em>selected</em> (through contrast, size, colour, position) and how it gets <em>perceived</em> (through familiar shapes, symbols, layout conventions).</p>
<h3>Real examples</h3>
<ul>
<li><strong>A red octagon on the roadside</strong> — sensing: a red shape among green trees; selecting: the unusual colour and hard-edged shape stand out instantly against a natural background; perceiving: your learned traffic-sign knowledge reads it as "STOP" in under a second, before you consciously read the word.</li>
<li><strong>A familiar logo glimpsed on a phone screen</strong> — you recognise a brand's app icon among dozens of others in a fraction of a second because its colour and silhouette were designed to be selected first.</li>
<li><strong>A book cover on a shelf</strong> — a bright, high-contrast cover gets sensed and selected over a plain grey one, even before you perceive what genre it is.</li>
</ul>
<div class="pitfall"><strong>Common mistake.</strong> Students often think "seeing" just means "eyes are open, so information goes in automatically." In reality, most of what hits your retina every second is never selected or perceived at all — a designer's real job is deciding what gets a chance to be selected.</div>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Stand or sit somewhere busy for 2 minutes (a street, a canteen, a bus stop). Write down: (1) 3 things your eyes sensed but you barely noticed; (2) 3 things that immediately grabbed your attention (selecting); (3) for each of those 3, explain <em>why</em> it got selected — colour, motion, size, familiarity, or personal relevance.</p>
<p><strong>Hint:</strong> If you can't explain why something grabbed you, look again for contrast — against its background, something was different in colour, size, or movement.</p>
<div class="callout"><span class="badge">Coming next</span> Lesson 1.2 continues Session 2's topic: how experience unfolds over <strong>time</strong> and across different <strong>media</strong>, plus an introduction to using generative AI in this course.</div>`,
    `<span class="eyebrow">VCM202 · Chương 1 · Bài 1.1 · Buổi 1 · CLO1</span>
<h2>Cảm nhận, Chọn lọc, Tri giác — chuỗi tạo nên "nhìn thấy"</h2>
<p class="lead">Chủ đề FLM (buổi 1): <em>"NHẬP MÔN TRUYỀN THÔNG THỊ GIÁC — Cảm nhận; Chọn lọc; Tri giác. Cảm nhận + chọn lọc + tri giác = nhìn thấy."</em> Một phương trình này là xương sống của toàn bộ môn học.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 1 — "INTRODUCTION TO VISUAL COMMUNICATION — Sensing; Selecting; Perceiving. Sensing + selecting + perceiving = seeing"</p>
<h3>"Nhìn thấy" không tự động — nó được dựng từ ba bước</h3>
<table>
<thead><tr><th>Bước</th><th>Điều gì xảy ra</th><th>Ai kiểm soát</th></tr></thead>
<tbody>
<tr><td><strong>Cảm nhận (Sensing)</strong></td><td>Ánh sáng thô chạm vào võng mạc. Về mặt vật lý, mọi người trong phòng nhận gần như cùng một luồng photon.</td><td>Đôi mắt (gần như ngoài tầm kiểm soát của bạn)</td></tr>
<tr><td><strong>Chọn lọc (Selecting)</strong></td><td>Não không thể xử lý mọi thứ cùng lúc, nên sự chú ý lọc ra thứ quan trọng — dựa vào tương phản, chuyển động, sự quen thuộc và nhu cầu hiện tại.</td><td>Sự chú ý (nhà thiết kế điều khiển được phần này)</td></tr>
<tr><td><strong>Tri giác (Perceiving)</strong></td><td>Não tổ chức phần đã chọn thành hình dạng &amp; ý nghĩa có nghĩa, dựa vào trí nhớ và kỳ vọng.</td><td>Kiến thức nền &amp; văn hoá</td></tr>
</tbody>
</table>
<div class="diagram"><pre>Ánh sáng -> MẮT (cảm nhận) -> BỘ LỌC CHÚ Ý (chọn lọc) -> NÃO dựng nghĩa (tri giác)
                                                                    |
                                                                    v
                                                              = NHÌN THẤY
</pre></div>
<p>Hai người có thể nhìn cùng một cảnh nhưng <strong>thấy những thứ khác nhau</strong>, vì chọn lọc và tri giác phụ thuộc vào văn hoá, tâm trạng và kỳ vọng, không chỉ phụ thuộc ánh sáng chạm vào mắt. Đây chính là lý do vì sao thiết kế truyền thông thị giác có thể tồn tại: nhà thiết kế không kiểm soát được khâu cảm nhận, nhưng có thể chủ động định hình thứ được <em>chọn lọc</em> (qua tương phản, kích thước, màu sắc, vị trí) và cách nó được <em>tri giác</em> (qua hình dạng quen thuộc, ký hiệu, quy ước bố cục).</p>
<h3>Ví dụ thật</h3>
<ul>
<li><strong>Một bát giác đỏ bên đường</strong> — cảm nhận: một hình đỏ giữa cây xanh; chọn lọc: màu lạ và cạnh sắc nổi bật ngay giữa nền tự nhiên; tri giác: kiến thức biển báo đã học đọc ra ngay "DỪNG" trong chưa tới một giây, trước cả khi bạn đọc chữ.</li>
<li><strong>Một logo quen thuộc thoáng thấy trên màn hình điện thoại</strong> — bạn nhận ra icon app của một thương hiệu giữa hàng chục icon khác trong tích tắc vì màu sắc &amp; hình dáng của nó được thiết kế để được chọn lọc trước tiên.</li>
<li><strong>Một cuốn sách trên kệ</strong> — bìa sáng, tương phản cao được cảm nhận &amp; chọn lọc trước một cuốn bìa xám trơn, ngay cả trước khi bạn tri giác ra nó thuộc thể loại gì.</li>
</ul>
<div class="pitfall"><strong>Lỗi hay gặp.</strong> Sinh viên hay nghĩ "nhìn thấy" nghĩa là "mở mắt thì thông tin tự vào." Thực ra phần lớn thứ chạm vào võng mạc mỗi giây không bao giờ được chọn lọc hay tri giác — công việc thật sự của nhà thiết kế là quyết định thứ gì có cơ hội được chọn lọc.</div>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Đứng hoặc ngồi ở một nơi đông người trong 2 phút (đường phố, căng-tin, trạm xe buýt). Ghi lại: (1) 3 thứ mắt bạn cảm nhận nhưng gần như không để ý; (2) 3 thứ ngay lập tức hút sự chú ý (chọn lọc); (3) với mỗi thứ trong 3 cái đó, giải thích <em>vì sao</em> nó được chọn lọc — màu sắc, chuyển động, kích thước, sự quen thuộc, hay liên quan cá nhân.</p>
<p><strong>Gợi ý:</strong> Nếu không giải thích được vì sao thứ đó hút mắt, hãy nhìn lại để tìm tương phản — so với nền xung quanh, nó khác biệt ở màu, kích thước, hay chuyển động.</p>
<div class="callout"><span class="badge">Sắp tới</span> Bài 1.2 tiếp tục chủ đề buổi 2: trải nghiệm diễn ra theo <strong>thời gian</strong> và qua các <strong>phương tiện</strong> khác nhau thế nào, cùng phần nhập môn dùng AI tạo sinh trong môn này.</div>`,
  ]]);

const c1_2 = doc('vcm202-1-2-trai-nghiem-thoi-gian-ai', '1.2 — Experience, Time, Media & intro to Generative AI (buổi 2, CLO1/CLO2)|||1.2 — Trải nghiệm, Thời gian, Phương tiện & nhập môn AI tạo sinh (buổi 2, CLO1/CLO2)',
  'Buổi 2, CLO1/CLO2. Trải nghiệm thị giác trải theo thời gian; các phương tiện khác nhau (biển quảng cáo, tạp chí, bao bì, video) đòi hỏi mật độ thông tin khác nhau; nhập môn dùng AI tạo sinh trong môn.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 1 · Lesson 1.2 · Session 2 · CLO1, CLO2</span>
<h2>Making sense of experience: time, media &amp; generative AI</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 2 — "INTRODUCTION TO VISUAL COMMUNICATION — 1. Making sense of experience; 2. Experience and Time; 3. Experience and Media; 4. Introduction to generative AI in Visual Communication"</p>
<h3>Experience and time</h3>
<p>A single poster is read in seconds; a comic strip or a short film unfolds meaning across minutes, frame by frame. The <strong>time budget</strong> a viewer gives your work changes what it can communicate: a fast glance can only carry one clear idea, while a longer engagement can carry layered detail.</p>
<h3>Experience and media</h3>
<table>
<thead><tr><th>Medium</th><th>Typical exposure time</th><th>Example</th><th>Design consequence</th></tr></thead>
<tbody>
<tr><td>Billboard</td><td>A few seconds, often at speed</td><td>Highway ad</td><td>One idea, huge type, minimal words</td></tr>
<tr><td>Magazine page</td><td>Minutes</td><td>Print ad, editorial spread</td><td>More detail, layered information is acceptable</td></tr>
<tr><td>Product packaging</td><td>A few seconds on a shelf</td><td>Snack box, cosmetics</td><td>Bold colour/shape recognition, instant brand cue</td></tr>
<tr><td>Video / social reels</td><td>Unfolds over time</td><td>Story ad, short film</td><td>Sequence and pacing matter, not just one frame</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Common mistake.</strong> Designing one layout and reusing it for every medium without asking how long a viewer will actually look at it — a billboard with magazine-level detail is unreadable at 60 km/h.</div>
<h3>Introduction to generative AI in Visual Communication</h3>
<p>Several assignments in this syllabus explicitly allow using tools "to generate references for inspiration." Generative AI is useful in this course for <strong>fast moodboards, reference images, and exploring variations</strong> — but the syllabus (CLO2) expects you to <em>apply knowledge</em> using it as one tool among traditional and digital ones, not to submit raw AI output as your own composition. You still need to choose, edit and justify what you keep.</p>
<div class="note-ct"><p><strong>Bổ sung của CuongThai (không phải quy định của trường):</strong> khi dùng AI để lấy tài liệu tham khảo, hãy ghi lại prompt bạn dùng và lý do chọn/loại ảnh nào — đó là bằng chứng cho thấy bạn đưa ra quyết định thiết kế, không chỉ chép nguyên output.</p></div>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Find one product package and one magazine advertisement for a similar type of product (e.g. a drink, a skincare product). Compare: how much text/detail does each carry, and how long would a viewer realistically look at each one? Write 3-4 sentences explaining the difference.</p>
<p><strong>Hint:</strong> Count the words and count the distinct visual elements on each — the one with fewer elements is usually built for a shorter exposure time.</p>`,
    `<span class="eyebrow">VCM202 · Chương 1 · Bài 1.2 · Buổi 2 · CLO1, CLO2</span>
<h2>Tạo nghĩa từ trải nghiệm: thời gian, phương tiện &amp; nhập môn AI tạo sinh</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 2 — "NHẬP MÔN TRUYỀN THÔNG THỊ GIÁC — 1. Tạo nghĩa từ trải nghiệm; 2. Trải nghiệm &amp; Thời gian; 3. Trải nghiệm &amp; Phương tiện; 4. Nhập môn AI tạo sinh trong Truyền thông thị giác"</p>
<h3>Trải nghiệm &amp; thời gian</h3>
<p>Một tấm poster được đọc trong vài giây; một truyện tranh hay đoạn phim ngắn trải nghĩa ra qua nhiều phút, từng khung một. <strong>Ngân sách thời gian</strong> người xem dành cho tác phẩm của bạn quyết định nó truyền đạt được gì: một cái liếc nhanh chỉ mang được một ý rõ ràng, còn tiếp xúc lâu hơn mới mang được chi tiết nhiều lớp.</p>
<h3>Trải nghiệm &amp; phương tiện</h3>
<table>
<thead><tr><th>Phương tiện</th><th>Thời gian tiếp xúc thường gặp</th><th>Ví dụ</th><th>Hệ quả thiết kế</th></tr></thead>
<tbody>
<tr><td>Biển quảng cáo</td><td>Vài giây, thường khi đang di chuyển</td><td>Quảng cáo trên xa lộ</td><td>Một ý duy nhất, chữ thật to, ít chữ</td></tr>
<tr><td>Trang tạp chí</td><td>Vài phút</td><td>Quảng cáo in, trang bài</td><td>Chi tiết hơn, thông tin nhiều lớp vẫn chấp nhận được</td></tr>
<tr><td>Bao bì sản phẩm</td><td>Vài giây trên kệ hàng</td><td>Hộp bánh, mỹ phẩm</td><td>Nhận diện màu/hình mạnh, tín hiệu thương hiệu tức thì</td></tr>
<tr><td>Video / reels</td><td>Trải ra theo thời gian</td><td>Quảng cáo dạng story, phim ngắn</td><td>Trình tự &amp; nhịp độ quan trọng, không chỉ một khung hình</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Lỗi hay gặp.</strong> Thiết kế một bố cục rồi dùng lại cho mọi phương tiện mà không hỏi người xem thực sự sẽ nhìn nó bao lâu — một biển quảng cáo dày đặc chi tiết như trang tạp chí thì không đọc nổi ở tốc độ 60km/h.</div>
<h3>Nhập môn AI tạo sinh trong Truyền thông thị giác</h3>
<p>Nhiều assignment trong syllabus này cho phép rõ ràng dùng công cụ "để tạo tài liệu tham khảo truyền cảm hứng." AI tạo sinh hữu ích trong môn này để <strong>tạo moodboard nhanh, ảnh tham khảo, khám phá biến thể</strong> — nhưng syllabus (CLO2) yêu cầu bạn <em>áp dụng kiến thức</em> để dùng nó như một công cụ trong số công cụ truyền thống &amp; công cụ số, chứ không phải nộp thẳng output AI làm bài của mình. Bạn vẫn phải chọn, chỉnh sửa và giải thích vì sao giữ lại phần nào.</p>
<div class="note-ct"><p><strong>Bổ sung của CuongThai (không phải quy định của trường):</strong> khi dùng AI lấy tài liệu tham khảo, hãy ghi lại prompt đã dùng và lý do chọn/loại ảnh nào — đó là bằng chứng cho thấy bạn ra quyết định thiết kế, không chỉ chép nguyên output.</p></div>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Tìm một bao bì sản phẩm và một quảng cáo tạp chí cho cùng loại sản phẩm (vd nước giải khát, mỹ phẩm). So sánh: mỗi cái mang bao nhiêu chữ/chi tiết, và người xem thực tế sẽ nhìn mỗi cái bao lâu? Viết 3-4 câu giải thích khác biệt.</p>
<p><strong>Gợi ý:</strong> Đếm số chữ và số yếu tố thị giác riêng biệt trên mỗi cái — cái nào ít yếu tố hơn thường được dựng cho thời gian tiếp xúc ngắn hơn.</p>`,
  ]]);

const c1_3 = doc('vcm202-2-1-elements', '1.3 — Basic elements: Point, Line, Shape, Background (buổi 3-4, CLO2)|||1.3 — Yếu tố cơ bản: Điểm, Đường, Hình, Nền (buổi 3-4, CLO2)',
  'Buổi 3-4, CLO2. Bốn yếu tố nền tảng theo đúng syllabus FLM: điểm, đường, hình, nền — mỗi yếu tố nói rõ nó truyền đạt cảm giác gì, ví dụ bằng biển báo giao thông, logo, bìa sách quen thuộc.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 1 · Lesson 1.3 · Sessions 3-4 · CLO2</span>
<h2>Basic elements: Point, Line, Shape, Background</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 3-4 — "DEFINITION OF BASIC ARTS AND GRAPHIC ELEMENTS — 1. Point; 2. Line; 3. Shape; 4. Background"</p>
<p class="lead">These four elements are the syllabus's own building blocks (not a longer generic list) — every visual you will ever make is built from them.</p>
<table>
<thead><tr><th>Element</th><th>What it communicates</th><th>Real example</th></tr></thead>
<tbody>
<tr><td><strong>Point</strong> — a single mark, the smallest visual unit</td><td>Draws the eye instantly; marks an exact location; alone it feels focused/singular. Repeated points imply pattern, texture or a path (a dotted line reads as "movement along this route").</td><td>A single dot inside a logo (the dot on a bullseye target); traffic sign reflectors marking a road edge at night.</td></tr>
<tr><td><strong>Line</strong> — a point set in motion</td><td>Direction and quality carry emotion: horizontal = calm/stable; vertical = strength/formality; diagonal = energy/tension; curved = organic/soft; jagged = chaos/danger.</td><td>Nike's Swoosh (a single diagonal-curving line = speed, motion); a hazard-tape's jagged zig-zag pattern = danger.</td></tr>
<tr><td><strong>Shape</strong> — a closed area</td><td>Geometric shapes carry learned connotation: circle = unity/safety/inclusion; square = stability/order/reliability; triangle = dynamism, direction, or warning.</td><td>Road warning signs are triangular worldwide (danger ahead); "no entry"/prohibition signs are circular; app icons often use rounded squares (friendly + orderly).</td></tr>
<tr><td><strong>Background</strong> — the ground a shape is read against</td><td>Determines what becomes "figure" versus "ground." Empty background (negative space) is not wasted — a lot of white space itself reads as calm, premium, or luxurious.</td><td>Minimalist luxury perfume ads use 80%+ empty background around a small bottle to signal exclusivity; a busy background behind the same bottle would read as a discount flyer instead.</td></tr>
</tbody>
</table>
<h3>Reading real designs through these four elements</h3>
<ul>
<li><strong>Traffic signs</strong> use shape as the primary code before you even read the symbol inside: octagon = stop, triangle = warning, circle = mandatory/prohibition, square/rectangle = information. This is shape communicating meaning on its own, at a glance, from any distance.</li>
<li><strong>Logos</strong>: the Adidas three stripes are lines repeated as a pattern (motion + rhythm); a target/bullseye logo is concentric circles built from point + shape.</li>
<li><strong>Book covers</strong>: a minimalist cover with a small centred shape and a large empty background usually signals "literary fiction"; a cover packed with jagged lines, high contrast shapes and almost no background usually signals "thriller/action."</li>
</ul>
<div class="pitfall"><strong>Common mistakes.</strong> (1) Treating "background" as an afterthought instead of an active element — leftover empty space is either doing a job (calm, focus) or accidentally leaking meaning (looking unfinished). (2) Picking a shape (e.g. a jagged, aggressive shape for a baby-product logo) without checking what that shape already connotes to viewers.</div>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Find 3 traffic or safety signs near where you live. For each, note its dominant <em>shape</em> (triangle/circle/square/octagon) and explain in one sentence why that shape fits its message (e.g. "triangle = warning, used because the sign alerts to danger ahead").</p>
<p><strong>Hint:</strong> If you can't find 3 different shapes, compare a warning sign with a directional/information sign — the shape difference alone should be obvious once you look for it.</p>`,
    `<span class="eyebrow">VCM202 · Chương 1 · Bài 1.3 · Buổi 3-4 · CLO2</span>
<h2>Yếu tố cơ bản: Điểm, Đường, Hình, Nền</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 3-4 — "ĐỊNH NGHĨA CÁC YẾU TỐ NGHỆ THUẬT &amp; ĐỒ HOẠ CƠ BẢN — 1. Điểm; 2. Đường; 3. Hình; 4. Nền"</p>
<p class="lead">Đây là bốn yếu tố nền tảng theo đúng syllabus (không phải một danh sách dài chung chung) — mọi thứ thị giác bạn từng làm đều dựng từ bốn yếu tố này.</p>
<table>
<thead><tr><th>Yếu tố</th><th>Truyền đạt cảm giác gì</th><th>Ví dụ thật</th></tr></thead>
<tbody>
<tr><td><strong>Điểm (Point)</strong> — một dấu đơn, đơn vị thị giác nhỏ nhất</td><td>Hút mắt ngay lập tức; đánh dấu một vị trí chính xác; đứng riêng lẻ gợi cảm giác tập trung/đơn nhất. Nhiều điểm lặp lại gợi hoa văn, chất liệu, hoặc một đường đi (đường chấm gợi "chuyển động theo tuyến này").</td><td>Một chấm trong logo (chấm tâm bia bắn); mắt phản quang đánh dấu mép đường ban đêm.</td></tr>
<tr><td><strong>Đường (Line)</strong> — điểm chuyển động</td><td>Hướng &amp; tính chất mang cảm xúc: ngang = tĩnh lặng/ổn định; dọc = mạnh mẽ/trang trọng; chéo = năng lượng/căng thẳng; cong = hữu cơ/mềm mại; gãy khúc = hỗn loạn/nguy hiểm.</td><td>Swoosh của Nike (một đường cong chéo = tốc độ, chuyển động); hoạ tiết zig-zag gãy khúc trên băng cảnh báo = nguy hiểm.</td></tr>
<tr><td><strong>Hình (Shape)</strong> — một vùng khép kín</td><td>Hình học mang nghĩa đã học sẵn: hình tròn = thống nhất/an toàn/bao gồm; hình vuông = ổn định/trật tự/đáng tin; hình tam giác = năng động, hướng, hoặc cảnh báo.</td><td>Biển báo nguy hiểm trên đường luôn là tam giác ở khắp thế giới; biển cấm luôn hình tròn; icon app hay dùng hình vuông bo góc (thân thiện + trật tự).</td></tr>
<tr><td><strong>Nền (Background)</strong> — cái nền mà một hình được đọc dựa vào</td><td>Quyết định cái gì trở thành "hình" (figure) so với "nền" (ground). Nền trống (không gian âm) không phải lãng phí — nhiều khoảng trắng tự nó gợi sự tĩnh lặng, cao cấp, hoặc sang trọng.</td><td>Quảng cáo nước hoa cao cấp dùng &gt;80% nền trống quanh một chai nhỏ để gợi sự độc quyền; cũng chai đó đặt trên nền rối sẽ trông như tờ rơi khuyến mãi.</td></tr>
</tbody>
</table>
<h3>Đọc thiết kế thật qua bốn yếu tố này</h3>
<ul>
<li><strong>Biển báo giao thông</strong> dùng hình dạng làm mã chính trước cả khi bạn đọc ký hiệu bên trong: bát giác = dừng, tam giác = cảnh báo, hình tròn = bắt buộc/cấm, hình vuông/chữ nhật = thông tin. Đây là hình dạng tự truyền đạt nghĩa, chỉ bằng một cái liếc, từ bất kỳ khoảng cách nào.</li>
<li><strong>Logo</strong>: ba sọc Adidas là các đường lặp lại thành hoa văn (chuyển động + nhịp điệu); logo hình bia bắn là các vòng tròn đồng tâm dựng từ điểm + hình.</li>
<li><strong>Bìa sách</strong>: bìa tối giản với một hình nhỏ ở giữa và nền trống lớn thường gợi "văn học nghiêm túc"; bìa dày đặc đường gãy khúc, tương phản cao và gần như không có nền thường gợi "trinh thám/hành động."</li>
</ul>
<div class="pitfall"><strong>Lỗi hay gặp.</strong> (1) Coi "nền" là thứ thừa ra thay vì một yếu tố chủ động — khoảng trống còn lại hoặc đang làm một việc (tĩnh lặng, tập trung) hoặc đang vô tình rò rỉ nghĩa xấu (trông như chưa xong). (2) Chọn một hình dạng (vd hình gãy khúc, hung hãn cho logo sản phẩm em bé) mà không kiểm tra hình đó đã sẵn gợi nghĩa gì với người xem.</div>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Tìm 3 biển báo giao thông/an toàn gần nơi bạn ở. Với mỗi biển, ghi lại <em>hình dạng</em> chủ đạo (tam giác/tròn/vuông/bát giác) và giải thích trong một câu vì sao hình đó hợp với thông điệp (vd "tam giác = cảnh báo, dùng vì biển báo nguy hiểm phía trước").</p>
<p><strong>Gợi ý:</strong> Nếu không tìm được 3 hình khác nhau, hãy so sánh một biển cảnh báo với một biển chỉ dẫn/thông tin — chỉ riêng khác biệt hình dạng cũng đủ rõ khi bạn để ý.</p>`,
  ]]);

const c1_4 = doc('vcm202-3-1-principles', '1.4 — Composition: a worked example (buổi 5, CLO2)|||1.4 — Bố cục: một ví dụ phân tích (buổi 5, CLO2)',
  'Buổi 5, CLO2. Bố cục là cách sắp đặt điểm/đường/hình/nền để dẫn mắt và truyền thông điệp — phân tích từng bước một ví dụ thật, vẽ đường đi của mắt qua một bố cục.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 1 · Lesson 1.4 · Session 5 · CLO2</span>
<h2>Composition: how the four elements are arranged together</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 5 — "COMPOSITION — Example"</p>
<p class="lead">The syllabus names this session simply "Example" — so this lesson works the way that session likely does: walk through one real layout step by step and see how point, line, shape and background combine to guide the eye and carry a message.</p>
<h3>Worked example: reading a poster's eye-path</h3>
<p>Take a typical event poster: a large title (shape made of type) near the top, a bold central image below it, and a mostly empty band at the bottom for logos. Here is how the four elements cooperate:</p>
<div class="diagram"><pre>+-------------------------------+
|   TITLE (big shape, high      |  <- entry point: biggest shape,
|   contrast against background)|     highest contrast, read first
+-------------------------------+
|                                |
|      CENTRAL IMAGE             |  <- eye travels down (implied
|      (shape + line direction   |     vertical line of the layout)
|       inside guides gaze)      |
|                                |
+-------------------------------+
|  small logos, empty background |  <- eye lands here last, calm
+-------------------------------+
</pre></div>
<ul>
<li><strong>Entry point</strong> — the eye almost always lands first on the biggest shape with the highest contrast against its background: the title.</li>
<li><strong>Path</strong> — an implied line (created by the edge of the image, a diagonal gaze inside a photo, or the alignment of elements) carries the eye from the title down into the image.</li>
<li><strong>Exit / rest</strong> — a calm area with generous background (negative space) at the bottom gives the eye somewhere to land and rest, usually where secondary information (logos, dates) lives.</li>
</ul>
<p>Good composition is not decoration — it is <strong>controlling the order in which information is received</strong>, using exactly the four elements from Lesson 1.3.</p>
<div class="pitfall"><strong>Common mistake.</strong> Giving two or three elements equal size and contrast — with no single clear "biggest, boldest" shape, the eye doesn't know where to enter, and the whole poster reads as noise instead of a path.</div>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Pick one poster or advertisement you like. Print or sketch it, then draw arrows tracing where your eye travels first, second, third. List which point/line/shape/background choices created that path.</p>
<p><strong>Hint:</strong> Squint at the image (or blur your eyes slightly) — the first shape you can still make out clearly is your entry point.</p>`,
    `<span class="eyebrow">VCM202 · Chương 1 · Bài 1.4 · Buổi 5 · CLO2</span>
<h2>Bố cục: bốn yếu tố được sắp đặt cùng nhau thế nào</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 5 — "BỐ CỤC — Ví dụ"</p>
<p class="lead">Syllabus đặt tên buổi này đơn giản là "Ví dụ" — nên bài này làm đúng như buổi đó gợi ý: đi từng bước qua một bố cục thật và xem điểm, đường, hình, nền phối hợp dẫn mắt &amp; truyền thông điệp thế nào.</p>
<h3>Ví dụ phân tích: đường đi của mắt qua một poster</h3>
<p>Lấy một poster sự kiện điển hình: tiêu đề to (một hình dựng từ chữ) ở trên, một hình ảnh trung tâm đậm bên dưới, và một dải gần như trống ở đáy cho logo. Đây là cách bốn yếu tố phối hợp:</p>
<div class="diagram"><pre>+-------------------------------+
|  TIÊU ĐỀ (hình lớn, tương     |  <- điểm vào: hình lớn nhất,
|  phản cao với nền)             |     tương phản cao nhất, đọc trước
+-------------------------------+
|                                |
|      HÌNH ẢNH TRUNG TÂM         |  <- mắt đi xuống (đường dọc
|      (hình + hướng đường bên    |     ngầm của bố cục)
|       trong dẫn ánh nhìn)       |
|                                |
+-------------------------------+
|  logo nhỏ, nền trống            |  <- mắt dừng ở đây cuối cùng, tĩnh
+-------------------------------+
</pre></div>
<ul>
<li><strong>Điểm vào</strong> — mắt gần như luôn đáp xuống hình lớn nhất, tương phản cao nhất so với nền trước tiên: tiêu đề.</li>
<li><strong>Đường đi</strong> — một đường ngầm (tạo bởi mép hình ảnh, hướng nhìn chéo trong ảnh, hoặc sự căn chỉnh của các yếu tố) mang mắt từ tiêu đề xuống hình ảnh.</li>
<li><strong>Điểm dừng/thoát</strong> — một vùng tĩnh với nền trống rộng rãi (không gian âm) ở đáy cho mắt chỗ để nghỉ, thường là nơi thông tin phụ (logo, ngày tháng) nằm.</li>
</ul>
<p>Bố cục tốt không phải trang trí — đó là <strong>kiểm soát thứ tự thông tin được tiếp nhận</strong>, dùng đúng bốn yếu tố từ Bài 1.3.</p>
<div class="pitfall"><strong>Lỗi hay gặp.</strong> Cho hai hoặc ba yếu tố cùng kích thước &amp; tương phản — không có một hình "to nhất, đậm nhất" rõ ràng, mắt không biết vào từ đâu, và cả poster đọc như tiếng ồn thay vì một đường dẫn.</div>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Chọn một poster hoặc quảng cáo bạn thích. In hoặc phác lại, rồi vẽ mũi tên theo dõi mắt bạn đi đâu đầu tiên, thứ hai, thứ ba. Liệt kê những lựa chọn điểm/đường/hình/nền nào tạo nên đường đi đó.</p>
<p><strong>Gợi ý:</strong> Nheo mắt nhìn hình (hoặc làm mờ mắt một chút) — hình đầu tiên bạn vẫn còn nhận ra rõ chính là điểm vào của bạn.</p>`,
  ]]);

const c1_5 = doc('vcm202-6-1-type-layout', '1.5 — Code and style (buổi 6, CLO2)|||1.5 — Mã & phong cách (buổi 6, CLO2)',
  'Buổi 6, CLO2. Thị giác mang nghĩa theo quy ước văn hoá (code) và theo phong cách nhận diện của một nhóm/thời kỳ (style) — ví dụ màu đỏ ở Việt Nam vs phương Tây, phong cách bao bì organic.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 1 · Lesson 1.5 · Session 6 · CLO2</span>
<h2>Code and style: meaning depends on context</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 6 — "CODE AND STYLE"</p>
<p class="lead">A <strong>code</strong> is a shared, learned convention for what a visual choice means; a <strong>style</strong> is a recognisable, repeated set of visual choices that identifies a group, brand, era, or trend. Neither is universal — both depend on who is looking.</p>
<h3>Code: the same colour, opposite meanings</h3>
<table>
<thead><tr><th>Context</th><th>Visual code</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Vietnamese/East Asian Lunar New Year</td><td>Red + gold/yellow</td><td>Luck, prosperity, celebration</td></tr>
<tr><td>Western traffic/safety systems</td><td>Red</td><td>Stop, danger, prohibition</td></tr>
<tr><td>Western wedding dress</td><td>White</td><td>Purity, new beginning</td></tr>
<tr><td>Some East Asian mourning traditions</td><td>White</td><td>Grief, mourning</td></tr>
</tbody>
</table>
<p>The exact same colour choice can send opposite messages depending purely on the viewer's cultural code — this is why "attractive design" alone is never enough; a designer must know the audience's code.</p>
<h3>Style: a recognisable, repeated set of choices</h3>
<ul>
<li><strong>Swiss / International Typographic style</strong> — grid-based, sans-serif, restrained colour: reads as objective, professional, trustworthy.</li>
<li><strong>Organic/eco packaging style (Western)</strong> — kraft-paper brown, hand-drawn type, muted green: reads as natural, sustainable, artisanal.</li>
<li><strong>Horror movie poster style</strong> — near-black palette, blood-red accents, jagged/distressed type: reads as fear and danger before you read a single word of the title.</li>
</ul>
<div class="pitfall"><strong>Common mistake.</strong> Copying a style seen online (often Western-coded) into a project aimed at a Vietnamese audience without checking whether its code still communicates the intended meaning — the result can look "beautiful" yet be misread, or read as inauthentic.</div>
<h3>✏️ Self-practice exercise</h3>
<p><strong>Task:</strong> Find 2 packaging or poster designs aimed at a Vietnamese audience and 2 aimed at a Western audience, all for a similar product category (e.g. tea, skincare). Compare their colour codes and styles — what changes, and why do you think it changes for that audience?</p>
<p><strong>Hint:</strong> Look specifically at colour choice and typeface style first — these two carry most of the cultural coding.</p>
<div class="callout"><span class="badge">End of Chapter 1</span> Take the Chapter 1 quiz below before moving on — it covers Sensing/Selecting/Perceiving, the four basic elements, composition, and code &amp; style.</div>`,
    `<span class="eyebrow">VCM202 · Chương 1 · Bài 1.5 · Buổi 6 · CLO2</span>
<h2>Mã &amp; phong cách: nghĩa phụ thuộc bối cảnh</h2>
<p class="nhan">Nguồn: FLM · Syllabus 13360 · buổi 6 — "MÃ &amp; PHONG CÁCH (CODE AND STYLE)"</p>
<p class="lead">Một <strong>mã (code)</strong> là quy ước chung, đã học, cho việc một lựa chọn thị giác nghĩa là gì; một <strong>phong cách (style)</strong> là một tập hợp lựa chọn thị giác lặp lại, nhận diện được, đại diện cho một nhóm, thương hiệu, thời kỳ, hay trào lưu. Cả hai đều không phổ quát — cả hai phụ thuộc vào người đang nhìn.</p>
<h3>Mã: cùng một màu, nghĩa trái ngược</h3>
<table>
<thead><tr><th>Bối cảnh</th><th>Mã thị giác</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td>Tết Nguyên đán ở Việt Nam/Đông Á</td><td>Đỏ + vàng/kim</td><td>May mắn, thịnh vượng, ăn mừng</td></tr>
<tr><td>Hệ thống giao thông/an toàn phương Tây</td><td>Đỏ</td><td>Dừng lại, nguy hiểm, cấm</td></tr>
<tr><td>Váy cưới phương Tây</td><td>Trắng</td><td>Tinh khiết, khởi đầu mới</td></tr>
<tr><td>Một số truyền thống tang lễ Đông Á</td><td>Trắng</td><td>Tang tóc, đau buồn</td></tr>
</tbody>
</table>
<p>Cùng một lựa chọn màu có thể truyền đi thông điệp trái ngược hoàn toàn tuỳ vào mã văn hoá của người xem — đây là lý do "thiết kế đẹp" không bao giờ là đủ; nhà thiết kế phải biết mã của khán giả mình nhắm tới.</p>
<h3>Phong cách: một tập lựa chọn lặp lại, nhận diện được</h3>
<ul>
<li><strong>Phong cách Swiss / Typographic quốc tế</strong> — dựa lưới, sans-serif, màu tiết chế: đọc ra khách quan, chuyên nghiệp, đáng tin.</li>
<li><strong>Phong cách bao bì organic/eco (phương Tây)</strong> — nâu giấy kraft, chữ viết tay, xanh trầm: đọc ra tự nhiên, bền vững, thủ công.</li>
<li><strong>Phong cách poster phim kinh dị</strong> — bảng màu gần đen, điểm nhấn đỏ máu, chữ gãy/xước: đọc ra sợ hãi &amp; nguy hiểm trước cả khi đọc một chữ trong tiêu đề.</li>
</ul>
<div class="pitfall"><strong>Lỗi hay gặp.</strong> Bê nguyên một phong cách thấy trên mạng (thường mang mã phương Tây) vào một dự án nhắm khán giả Việt Nam mà không kiểm tra mã đó có còn truyền đúng nghĩa mong muốn không — kết quả có thể "đẹp" nhưng bị hiểu sai, hoặc đọc ra thiếu chân thực.</div>
<h3>✏️ Bài tập tự làm</h3>
<p><strong>Nhiệm vụ:</strong> Tìm 2 thiết kế bao bì/poster nhắm khán giả Việt Nam và 2 cái nhắm khán giả phương Tây, cùng một loại sản phẩm (vd trà, mỹ phẩm). So sánh mã màu &amp; phong cách của chúng — điều gì thay đổi, và vì sao bạn nghĩ nó thay đổi cho khán giả đó?</p>
<p><strong>Gợi ý:</strong> Nhìn trước vào lựa chọn màu và kiểu chữ — hai thứ này mang phần lớn mã văn hoá.</p>
<div class="callout"><span class="badge">Kết Chương 1</span> Làm quiz Chương 1 bên dưới trước khi qua chương tiếp — quiz phủ Cảm nhận/Chọn lọc/Tri giác, bốn yếu tố cơ bản, bố cục, và mã &amp; phong cách.</div>`,
  ]]);

const c1quiz = quiz('vcm202-quiz-1', 'Quiz — Chapter 1 (buổi 1-6)|||Quiz — Chương 1 (buổi 1-6)', [
  { id: 'q1', question: 'Chuỗi nào đúng theo syllabus FLM tạo nên "nhìn thấy" (seeing)?', options: ['Chọn lọc + Tri giác + Cảm nhận (thứ tự bất kỳ)', 'Cảm nhận + Chọn lọc + Tri giác', 'Chỉ cần Cảm nhận (mở mắt)', 'Tri giác trước, Cảm nhận sau'], correctIndex: 1, explanation: 'Buổi 1 FLM: "Sensing + selecting + perceiving = seeing" — đúng thứ tự cảm nhận, chọn lọc, rồi tri giác.' },
  { id: 'q2', question: 'Vì sao hai người nhìn cùng một cảnh có thể "thấy" khác nhau?', options: ['Vì mắt họ nhận ánh sáng khác nhau', 'Vì khâu chọn lọc &amp; tri giác phụ thuộc văn hoá, kỳ vọng, tâm trạng', 'Vì não người này to hơn người kia', 'Điều này không thể xảy ra'], correctIndex: 1, explanation: 'Cảm nhận (ánh sáng vào mắt) gần như giống nhau; khác biệt nằm ở chọn lọc &amp; tri giác — phụ thuộc kiến thức nền, văn hoá, kỳ vọng.' },
  { id: 'q3', question: 'Bốn yếu tố cơ bản theo đúng syllabus VCM202 (buổi 3-4) là gì?', options: ['Điểm, Đường, Màu, Chữ', 'Điểm, Đường, Hình, Nền', 'Hình, Khối, Chất liệu, Không gian', 'Cân bằng, Tương phản, Nhịp điệu, Nhấn mạnh'], correctIndex: 1, explanation: 'FLM buổi 3-4 định nghĩa đúng 4 yếu tố: Point, Line, Shape, Background (Điểm, Đường, Hình, Nền).' },
  { id: 'q4', question: 'Vì sao biển báo nguy hiểm trên đường hầu như luôn là hình TAM GIÁC?', options: ['Vì tam giác dễ in nhất', 'Vì hình tam giác đã mang sẵn nghĩa năng động/cảnh báo theo quy ước học được', 'Vì tam giác rẻ hơn hình tròn', 'Không có lý do, ngẫu nhiên'], correctIndex: 1, explanation: 'Shape (hình) mang nghĩa học được: tam giác gợi năng động/cảnh báo — đây là lý do biển cảnh báo dùng tam giác trên toàn cầu.' },
  { id: 'q5', question: 'Trong một bố cục, "điểm vào" (nơi mắt nhìn đầu tiên) thường là chỗ nào?', options: ['Góc dưới bên trái, luôn luôn', 'Hình lớn nhất, tương phản cao nhất với nền', 'Chỗ có nhiều chữ nhất', 'Không có quy luật nào'], correctIndex: 1, explanation: 'Mắt gần như luôn đáp xuống hình có kích thước lớn nhất &amp; tương phản cao nhất so với nền trước tiên.' },
  { id: 'q6', question: 'Nền trống (negative space) lớn quanh một sản phẩm trong quảng cáo thường gợi cảm giác gì?', options: ['Thiết kế chưa xong, cẩu thả', 'Cao cấp, sang trọng, tĩnh lặng', 'Rẻ tiền', 'Không có ý nghĩa gì'], correctIndex: 1, explanation: 'Nền trống rộng rãi (không gian âm) là một lựa chọn có chủ đích, thường gợi sự sang trọng/tĩnh lặng — không phải "chưa xong."' },
  { id: 'q7', question: 'Vì sao màu ĐỎ có thể mang nghĩa "may mắn" ở Việt Nam nhưng "nguy hiểm, dừng lại" ở hệ thống giao thông phương Tây?', options: ['Vì màu đỏ ở hai nơi thực ra khác nhau', 'Vì nghĩa của một mã thị giác phụ thuộc quy ước văn hoá của người xem, không cố định', 'Vì đó là lỗi thiết kế', 'Màu đỏ luôn nghĩa giống nhau ở mọi nơi'], correctIndex: 1, explanation: 'Đây chính là khái niệm "code" (mã): cùng một lựa chọn thị giác mang nghĩa khác nhau tuỳ quy ước văn hoá của khán giả.' },
  { id: 'q8', question: 'Lỗi hay gặp nào khi sinh viên áp dụng một "phong cách" (style) thấy trên mạng vào bài của mình?', options: ['Phong cách nào cũng dùng được ở mọi nơi', 'Không kiểm tra mã văn hoá của phong cách đó có phù hợp với khán giả mục tiêu hay không', 'Phong cách không quan trọng bằng nội dung', 'Style không liên quan tới CLO2'], correctIndex: 1, explanation: 'Bê nguyên một phong cách (thường mang mã phương Tây) mà không kiểm tra có hợp với khán giả mục tiêu hay không dễ khiến thông điệp bị hiểu sai hoặc thiếu chân thực.' },
]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 2-10 — CHỈ KHUNG: tên đúng + 3-6 dòng mốc nội dung mỗi bài. Với
// chương Assignment, mốc nội dung ghi rõ đề bài, trọng số, nộp gì.
// KHÔNG viết bài giảng chi tiết — chi tiết sẽ bổ sung sau.
// ─────────────────────────────────────────────────────────────────────────

const k21 = doc('vcm202-2-1-assignment1-brief', '2.1 — Assignment 1: Drawing brief (khung)|||2.1 — Bài tập 1: Đề bài vẽ để truyền đạt (khung)',
  'Buổi 7-9, CLO1/CLO2, Assignment 1 (10%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 2 · Lesson 2.1 · Sessions 7-9 · CLO1, CLO2 · Khung</span>
<h2>Assignment 1 — Drawing as a means of communication</h2>
<ul>
<li><strong>Buổi:</strong> 7-9 (buổi 8-9 lặp lại y nguyên buổi 7 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO1, CLO2.</li>
<li><strong>Đầu điểm:</strong> Assignment 1 — <strong>10%</strong>.</li>
<li><strong>Đề bài (nguyên văn FLM):</strong> Draw a black-and-white piece of visual idea/concept to create a mood or send a message. Use any FORM (dots, lines, shapes) that helps communicate the message. Use observational, visualization and presentation drawing. May use tools to generate references for inspiration.</li>
<li><strong>Nộp:</strong> một bức vẽ đen trắng hoàn chỉnh (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ (kỹ thuật vẽ quan sát/hình dung/trình bày) bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 2 · Bài 2.1 · Buổi 7-9 · CLO1, CLO2 · Khung</span>
<h2>Bài tập 1 — Vẽ để truyền đạt</h2>
<ul>
<li><strong>Buổi:</strong> 7-9 (buổi 8-9 lặp lại y nguyên buổi 7 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO1, CLO2.</li>
<li><strong>Đầu điểm:</strong> Assignment 1 — <strong>10%</strong>.</li>
<li><strong>Đề bài (dịch từ FLM):</strong> Vẽ một tác phẩm đen trắng thể hiện ý tưởng/khái niệm thị giác để tạo cảm xúc hoặc truyền thông điệp. Dùng bất kỳ HÌNH THỨC nào (chấm, đường, hình) giúp truyền đạt thông điệp. Dùng vẽ quan sát, vẽ hình dung và vẽ trình bày. Có thể dùng công cụ tạo tài liệu tham khảo truyền cảm hứng.</li>
<li><strong>Nộp:</strong> một bức vẽ đen trắng hoàn chỉnh (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ (kỹ thuật vẽ quan sát/hình dung/trình bày) bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k22 = doc('vcm202-2-2-assignment1-tiep-cham', '2.2 — Assignment 1: Continue & Grading (khung)|||2.2 — Bài tập 1: Tiếp tục & Chấm điểm (khung)',
  'Buổi 10-12, CLO1/CLO2, Assignment 1 (10%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 2 · Lesson 2.2 · Sessions 10-12 · CLO1, CLO2 · Khung</span>
<h2>Assignment 1 — Continue &amp; Grading</h2>
<ul>
<li><strong>Buổi:</strong> 10-12.</li>
<li><strong>CLO:</strong> CLO1, CLO2.</li>
<li><strong>Đầu điểm:</strong> Assignment 1 — <strong>10%</strong> (buổi 12: Grading and Evaluating Assignment 01).</li>
<li><strong>Nội dung FLM:</strong> Tiếp tục hoàn thiện bài vẽ; buổi 12 giảng viên chấm &amp; đánh giá trực tiếp trên lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 2 · Bài 2.2 · Buổi 10-12 · CLO1, CLO2 · Khung</span>
<h2>Bài tập 1 — Tiếp tục &amp; Chấm điểm</h2>
<ul>
<li><strong>Buổi:</strong> 10-12.</li>
<li><strong>CLO:</strong> CLO1, CLO2.</li>
<li><strong>Đầu điểm:</strong> Assignment 1 — <strong>10%</strong> (buổi 12: chấm &amp; đánh giá Bài tập 01).</li>
<li><strong>Nội dung FLM:</strong> Tiếp tục hoàn thiện bài vẽ; buổi 12 giảng viên chấm &amp; đánh giá trực tiếp trên lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k31 = doc('vcm202-5-1-color', '3.1 — Getting attention: Contrast, figure-ground & colour (khung)|||3.1 — Gây chú ý: Tương phản, hình-nền & màu sắc (khung)',
  'Buổi 13-14, CLO3. Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 3 · Lesson 3.1 · Sessions 13-14 · CLO3 · Khung</span>
<h2>Getting attention — Contrast, figure-ground &amp; colour; scale, layering, symmetry</h2>
<ul>
<li><strong>Buổi:</strong> 13-14.</li>
<li><strong>CLO:</strong> CLO3.</li>
<li><strong>Nội dung FLM:</strong> buổi 13 — Contrast; Figure-ground and colour. Buổi 14 — Size constancy, scale, and proportion; Layering; Symmetry/Asymmetry.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 3 · Bài 3.1 · Buổi 13-14 · CLO3 · Khung</span>
<h2>Gây chú ý — Tương phản, hình-nền &amp; màu sắc; tỉ lệ, xếp lớp, đối xứng</h2>
<ul>
<li><strong>Buổi:</strong> 13-14.</li>
<li><strong>CLO:</strong> CLO3.</li>
<li><strong>Nội dung FLM:</strong> buổi 13 — Tương phản; Hình-nền &amp; màu sắc. Buổi 14 — Hằng định kích thước, tỉ lệ; Xếp lớp; Đối xứng/Bất đối xứng.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k32 = doc('vcm202-3-2-gay-chu-y-pattern-nhip-dieu', '3.2 — Getting attention: Pattern, sequence, rhythm & motion (khung)|||3.2 — Gây chú ý: Hoa văn, chuỗi, nhịp điệu & chuyển động (khung)',
  'Buổi 15, CLO3. Khung — lưu ý đánh số mục bắt đầu từ 7 trong bản gốc FLM.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 3 · Lesson 3.2 · Session 15 · CLO3 · Khung</span>
<h2>Getting attention — Pattern, series/sequences, rhythm &amp; motion</h2>
<ul>
<li><strong>Buổi:</strong> 15.</li>
<li><strong>CLO:</strong> CLO3.</li>
<li><strong>Nội dung FLM:</strong> Pattern; Series and Sequences; Rhythm and pacing; Motion.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> mục trong syllabus bắt đầu từ số "7" (thiếu mục 1-6) — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 3 · Bài 3.2 · Buổi 15 · CLO3 · Khung</span>
<h2>Gây chú ý — Hoa văn, chuỗi &amp; trình tự, nhịp điệu &amp; chuyển động</h2>
<ul>
<li><strong>Buổi:</strong> 15.</li>
<li><strong>CLO:</strong> CLO3.</li>
<li><strong>Nội dung FLM:</strong> Hoa văn (Pattern); Chuỗi &amp; trình tự; Nhịp điệu &amp; tiết tấu; Chuyển động.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> mục trong syllabus bắt đầu từ số "7" (thiếu mục 1-6) — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k41 = doc('vcm202-4-1-assignment2-brief', '4.1 — Assignment 2: Composition brief (khung)|||4.1 — Bài tập 2: Đề bài bố cục (khung)',
  'Buổi 16-18, CLO2/CLO3, Assignment 2 (15%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 4 · Lesson 4.1 · Sessions 16-18 · CLO2, CLO3 · Khung</span>
<h2>Assignment 2 — Composition</h2>
<ul>
<li><strong>Buổi:</strong> 16-18 (buổi 17-18 lặp lại y nguyên buổi 16 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO2, CLO3.</li>
<li><strong>Đầu điểm:</strong> Assignment 2 — <strong>15%</strong>.</li>
<li><strong>Đề bài (nguyên văn FLM):</strong> Use the vocabulary of visual message and apply principles to make a set of composition that conveys a message about a chosen topic. Free method of expressing. May use tools to generate references for inspiration.</li>
<li><strong>Nộp:</strong> một bộ (set) bố cục về chủ đề tự chọn (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 4 · Bài 4.1 · Buổi 16-18 · CLO2, CLO3 · Khung</span>
<h2>Bài tập 2 — Bố cục</h2>
<ul>
<li><strong>Buổi:</strong> 16-18 (buổi 17-18 lặp lại y nguyên buổi 16 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO2, CLO3.</li>
<li><strong>Đầu điểm:</strong> Assignment 2 — <strong>15%</strong>.</li>
<li><strong>Đề bài (dịch từ FLM):</strong> Dùng từ vựng thông điệp thị giác và áp dụng nguyên lý để tạo một bộ bố cục truyền đạt thông điệp về chủ đề đã chọn. Tự do chọn cách thể hiện. Có thể dùng công cụ tạo tài liệu tham khảo truyền cảm hứng.</li>
<li><strong>Nộp:</strong> một bộ bố cục về chủ đề tự chọn (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k42 = doc('vcm202-4-2-assignment2-tiep-cham', '4.2 — Assignment 2: Continue, AI/digital tools & Grading (khung)|||4.2 — Bài tập 2: Tiếp tục, công cụ AI/số & Chấm điểm (khung)',
  'Buổi 19-21, CLO2/CLO3, Assignment 2 (15%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 4 · Lesson 4.2 · Sessions 19-21 · CLO2, CLO3 · Khung</span>
<h2>Assignment 2 — Continue, developing with AI/digital tools &amp; Grading</h2>
<ul>
<li><strong>Buổi:</strong> 19-21.</li>
<li><strong>CLO:</strong> CLO2, CLO3.</li>
<li><strong>Đầu điểm:</strong> Assignment 2 — <strong>15%</strong> (buổi 21: Grading and Evaluating Assignment 02).</li>
<li><strong>Nội dung FLM:</strong> Developing and executing ideas; from buổi 20 onward using AI and digital tools.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 4 · Bài 4.2 · Buổi 19-21 · CLO2, CLO3 · Khung</span>
<h2>Bài tập 2 — Tiếp tục, phát triển bằng công cụ AI/số &amp; Chấm điểm</h2>
<ul>
<li><strong>Buổi:</strong> 19-21.</li>
<li><strong>CLO:</strong> CLO2, CLO3.</li>
<li><strong>Đầu điểm:</strong> Assignment 2 — <strong>15%</strong> (buổi 21: chấm &amp; đánh giá Bài tập 02).</li>
<li><strong>Nội dung FLM:</strong> Phát triển &amp; thực hiện ý tưởng; từ buổi 20 trở đi có dùng AI &amp; công cụ số.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k51 = doc('vcm202-4-1-gestalt', '5.1 — Orienting for use & interpretation (khung)|||5.1 — Định hướng sử dụng & diễn giải (khung)',
  'Buổi 22-23, CLO3/CLO4. Khung — lưu ý đánh số mục bị nhảy/trùng trong bản gốc FLM.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 5 · Lesson 5.1 · Sessions 22-23 · CLO3, CLO4 · Khung</span>
<h2>Orienting for use and interpretation</h2>
<ul>
<li><strong>Buổi:</strong> 22-23.</li>
<li><strong>CLO:</strong> CLO3, CLO4.</li>
<li><strong>Nội dung FLM:</strong> buổi 22 — Affordances; Feedback; Hierarchy; Reading Pattern. Buổi 23 — Mapping; Wayfinding; Edge relationships; Direction; Point of view.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> buổi 22 thiếu mục 3-4; buổi 23 lại bắt đầu từ mục 5 (trùng số buổi 22) — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 5 · Bài 5.1 · Buổi 22-23 · CLO3, CLO4 · Khung</span>
<h2>Định hướng sử dụng &amp; diễn giải</h2>
<ul>
<li><strong>Buổi:</strong> 22-23.</li>
<li><strong>CLO:</strong> CLO3, CLO4.</li>
<li><strong>Nội dung FLM:</strong> buổi 22 — Khả năng gợi ý sử dụng (Affordances); Phản hồi; Phân cấp; Thói quen đọc. Buổi 23 — Ánh xạ (Mapping); Định hướng đường đi; Quan hệ mép biên; Hướng; Góc nhìn.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> buổi 22 thiếu mục 3-4; buổi 23 lại bắt đầu từ mục 5 (trùng số buổi 22) — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k61 = doc('vcm202-6-1-assignment3-brief', '6.1 — Assignment 3: Collage brief & research (khung)|||6.1 — Bài tập 3: Đề bài Collage & nghiên cứu (khung)',
  'Buổi 24-26, CLO3/CLO4, Assignment 3 (15%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 6 · Lesson 6.1 · Sessions 24-26 · CLO3, CLO4 · Khung</span>
<h2>Assignment 3 — Collage</h2>
<ul>
<li><strong>Buổi:</strong> 24-26 (buổi 25-26 lặp lại y nguyên buổi 24 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 3 — <strong>15%</strong>.</li>
<li><strong>Đề bài (nguyên văn FLM):</strong> Research theme; research materials (photos, magazines, printed materials), test different textures, apply colour theory to create moods and special effects. May use tools to generate references for inspiration.</li>
<li><strong>Nộp:</strong> một tác phẩm collage (cắt dán) hoàn chỉnh (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — <strong>cần vật tư thật</strong> (báo/tạp chí cũ, kéo, keo — xem 0.4). Bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 6 · Bài 6.1 · Buổi 24-26 · CLO3, CLO4 · Khung</span>
<h2>Bài tập 3 — Collage (cắt dán)</h2>
<ul>
<li><strong>Buổi:</strong> 24-26 (buổi 25-26 lặp lại y nguyên buổi 24 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 3 — <strong>15%</strong>.</li>
<li><strong>Đề bài (dịch từ FLM):</strong> Nghiên cứu chủ đề; nghiên cứu vật liệu (ảnh, tạp chí, ấn phẩm in), thử các chất liệu khác nhau, áp dụng lý thuyết màu để tạo cảm xúc &amp; hiệu ứng đặc biệt. Có thể dùng công cụ tạo tài liệu tham khảo truyền cảm hứng.</li>
<li><strong>Nộp:</strong> một tác phẩm collage (cắt dán) hoàn chỉnh (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — <strong>cần vật tư thật</strong> (báo/tạp chí cũ, kéo, keo — xem 0.4). Bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k62 = doc('vcm202-6-2-assignment3-tiep', '6.2 — Assignment 3: Continue (khung)|||6.2 — Bài tập 3: Tiếp tục (khung)',
  'Buổi 27-29, CLO2/CLO4, Assignment 3 (15%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 6 · Lesson 6.2 · Sessions 27-29 · CLO2, CLO4 · Khung</span>
<h2>Assignment 3 — Collage (Continue)</h2>
<ul>
<li><strong>Buổi:</strong> 27-29.</li>
<li><strong>CLO:</strong> CLO2, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 3 — <strong>15%</strong>.</li>
<li><strong>Nội dung FLM:</strong> "ASSIGNMENT 3. COLLAGE (Continue)" lặp lại nguyên văn 3 buổi liền — thời gian thực hành tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 6 · Bài 6.2 · Buổi 27-29 · CLO2, CLO4 · Khung</span>
<h2>Bài tập 3 — Collage (Tiếp tục)</h2>
<ul>
<li><strong>Buổi:</strong> 27-29.</li>
<li><strong>CLO:</strong> CLO2, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 3 — <strong>15%</strong>.</li>
<li><strong>Nội dung FLM:</strong> "ASSIGNMENT 3. COLLAGE (Continue)" lặp nguyên văn 3 buổi liền — thời gian thực hành tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k63 = doc('vcm202-6-3-assignment3-cham', '6.3 — Assignment 3: Grading (khung)|||6.3 — Bài tập 3: Chấm điểm (khung)',
  'Buổi 30, CLO2/CLO4, Assignment 3 (15%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 6 · Lesson 6.3 · Session 30 · CLO2, CLO4 · Khung</span>
<h2>Assignment 3 — Grading and Evaluating</h2>
<ul>
<li><strong>Buổi:</strong> 30.</li>
<li><strong>CLO:</strong> CLO2, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 3 — <strong>15%</strong> — chấm &amp; đánh giá tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 6 · Bài 6.3 · Buổi 30 · CLO2, CLO4 · Khung</span>
<h2>Bài tập 3 — Chấm &amp; đánh giá</h2>
<ul>
<li><strong>Buổi:</strong> 30.</li>
<li><strong>CLO:</strong> CLO2, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 3 — <strong>15%</strong> — chấm &amp; đánh giá tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k71 = doc('vcm202-7-1-semiotics', '7.1 — Interacting, interpreting & experiencing: semiotics (khung)|||7.1 — Tương tác, diễn giải & trải nghiệm: ký hiệu học (khung)',
  'Buổi 31-32, CLO3/CLO4. Khung — lưu ý đánh số mục bị nhảy trong bản gốc FLM.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 7 · Lesson 7.1 · Sessions 31-32 · CLO3, CLO4 · Khung</span>
<h2>Interacting, interpreting and experiencing</h2>
<ul>
<li><strong>Buổi:</strong> 31-32.</li>
<li><strong>CLO:</strong> CLO3, CLO4.</li>
<li><strong>Nội dung FLM:</strong> buổi 31 — The nature of signs; Icon, index and symbol; Denotation and Connotation. Buổi 32 — Abstraction; Materiality; Substitution; Metaphor; Appropriation; Ambiguity.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> buổi 32 nhảy từ mục 3 (buổi 31) sang mục 5, thiếu mục 4 — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 7 · Bài 7.1 · Buổi 31-32 · CLO3, CLO4 · Khung</span>
<h2>Tương tác, diễn giải &amp; trải nghiệm</h2>
<ul>
<li><strong>Buổi:</strong> 31-32.</li>
<li><strong>CLO:</strong> CLO3, CLO4.</li>
<li><strong>Nội dung FLM:</strong> buổi 31 — Bản chất của dấu hiệu; Icon, index &amp; symbol; Nghĩa đen &amp; nghĩa liên tưởng. Buổi 32 — Trừu tượng hoá; Chất liệu; Thay thế; Ẩn dụ; Chiếm dụng; Nhập nhằng.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> buổi 32 nhảy từ mục 3 (buổi 31) sang mục 5, thiếu mục 4 — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k81 = doc('vcm202-8-1-assignment4-brief', '8.1 — Assignment 4: Multiple frame story brief (khung)|||8.1 — Bài tập 4: Đề bài Truyện nhiều khung hình (khung)',
  'Buổi 33-35, CLO2/CLO3/CLO4, Assignment 4 (20%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 8 · Lesson 8.1 · Sessions 33-35 · CLO2, CLO3, CLO4 · Khung</span>
<h2>Assignment 4 — Multiple frame story</h2>
<ul>
<li><strong>Buổi:</strong> 33-35 (buổi 34-35 lặp lại y nguyên buổi 33 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO2, CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 4 — <strong>20%</strong>.</li>
<li><strong>Đề bài (nguyên văn FLM):</strong> Research a specific theme, idea; deconstruct a story by setting, characters, objects, events; free media chosen; practice in group. May use tools to generate references for inspiration and materials.</li>
<li><strong>Nộp:</strong> một tác phẩm kể chuyện nhiều khung hình (nhóm), phương tiện tự chọn (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài tập NHÓM. Bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 8 · Bài 8.1 · Buổi 33-35 · CLO2, CLO3, CLO4 · Khung</span>
<h2>Bài tập 4 — Truyện nhiều khung hình</h2>
<ul>
<li><strong>Buổi:</strong> 33-35 (buổi 34-35 lặp lại y nguyên buổi 33 — làm bài tại lớp).</li>
<li><strong>CLO:</strong> CLO2, CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 4 — <strong>20%</strong>.</li>
<li><strong>Đề bài (dịch từ FLM):</strong> Nghiên cứu một chủ đề/ý tưởng cụ thể; phân rã câu chuyện theo bối cảnh, nhân vật, vật thể, sự kiện; tự do chọn phương tiện; thực hành theo nhóm. Có thể dùng công cụ tạo tài liệu tham khảo &amp; vật liệu.</li>
<li><strong>Nộp:</strong> một tác phẩm kể chuyện nhiều khung hình (nhóm), phương tiện tự chọn (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài tập NHÓM. Bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k82 = doc('vcm202-8-2-assignment4-tiep', '8.2 — Assignment 4: Continue — group work (khung)|||8.2 — Bài tập 4: Tiếp tục — làm việc nhóm (khung)',
  'Buổi 36-44, CLO2/CLO3/CLO4, Assignment 4 (20%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 8 · Lesson 8.2 · Sessions 36-44 · CLO2, CLO3, CLO4 · Khung</span>
<h2>Assignment 4 — Continue (group studio time)</h2>
<ul>
<li><strong>Buổi:</strong> 36-44 — 9 buổi liên tiếp, FLM ghi nguyên văn "ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)" cho mọi buổi này.</li>
<li><strong>CLO:</strong> CLO2, CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 4 — <strong>20%</strong>.</li>
<li><strong>Ghi chú:</strong> Khung — đây là khối buổi thực hành nhóm dài nhất môn (9 buổi); bài giảng đầy đủ (mốc tiến độ theo tuần) bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 8 · Bài 8.2 · Buổi 36-44 · CLO2, CLO3, CLO4 · Khung</span>
<h2>Bài tập 4 — Tiếp tục (thời gian thực hành nhóm)</h2>
<ul>
<li><strong>Buổi:</strong> 36-44 — 9 buổi liên tiếp, FLM ghi nguyên văn "ASSIGNMENT 4. MULTIPLE FRAME STORY (Continue)" cho mọi buổi này.</li>
<li><strong>CLO:</strong> CLO2, CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 4 — <strong>20%</strong>.</li>
<li><strong>Ghi chú:</strong> Khung — đây là khối buổi thực hành nhóm dài nhất môn (9 buổi); bài giảng đầy đủ (mốc tiến độ theo tuần) bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k83 = doc('vcm202-8-3-assignment4-cham', '8.3 — Assignment 4: Grading (khung)|||8.3 — Bài tập 4: Chấm điểm (khung)',
  'Buổi 45, CLO2/CLO3/CLO4, Assignment 4 (20%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 8 · Lesson 8.3 · Session 45 · CLO2, CLO3, CLO4 · Khung</span>
<h2>Assignment 4 — Grading and Evaluating</h2>
<ul>
<li><strong>Buổi:</strong> 45.</li>
<li><strong>CLO:</strong> CLO2, CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 4 — <strong>20%</strong> — chấm &amp; đánh giá tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 8 · Bài 8.3 · Buổi 45 · CLO2, CLO3, CLO4 · Khung</span>
<h2>Bài tập 4 — Chấm &amp; đánh giá</h2>
<ul>
<li><strong>Buổi:</strong> 45.</li>
<li><strong>CLO:</strong> CLO2, CLO3, CLO4.</li>
<li><strong>Đầu điểm:</strong> Assignment 4 — <strong>20%</strong> — chấm &amp; đánh giá tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k91 = doc('vcm202-9-1-ghi-nho-mo-rong-nghia', '9.1 — Retaining & extending meaning (khung)|||9.1 — Ghi nhớ & mở rộng nghĩa (khung)',
  'Buổi 46-47, CLO5. Khung — lưu ý đánh số mục bị thiếu trong bản gốc FLM.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 9 · Lesson 9.1 · Sessions 46-47 · CLO5 · Khung</span>
<h2>Retaining and extending meaning</h2>
<ul>
<li><strong>Buổi:</strong> 46-47.</li>
<li><strong>CLO:</strong> CLO5.</li>
<li><strong>Nội dung FLM:</strong> buổi 46 — Memory; Stereotypes; Archetypes. Buổi 47 — Narrative; Mnemonics; Chunking; Redundancy.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> buổi 46 thiếu mục 2 (liệt kê 1, 3, 4) — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 9 · Bài 9.1 · Buổi 46-47 · CLO5 · Khung</span>
<h2>Ghi nhớ &amp; mở rộng nghĩa</h2>
<ul>
<li><strong>Buổi:</strong> 46-47.</li>
<li><strong>CLO:</strong> CLO5.</li>
<li><strong>Nội dung FLM:</strong> buổi 46 — Trí nhớ; Định kiến; Nguyên mẫu. Buổi 47 — Tự sự; Thuật ghi nhớ; Phân nhóm; Dư thừa có chủ đích.</li>
<li><strong>⚠️ Ghi chú FLM:</strong> buổi 46 thiếu mục 2 (liệt kê 1, 3, 4) — xem 0.5, giữ nguyên.</li>
<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k101 = doc('vcm202-8-1-applications', '10.1 — Assignment 5: Visual storytelling brief (khung)|||10.1 — Bài tập 5: Đề bài Kể chuyện bằng hình (khung)',
  'Buổi 48-50, CLO2/CLO4/CLO5, Assignment 5 (30%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 10 · Lesson 10.1 · Sessions 48-50 · CLO2, CLO4, CLO5 · Khung</span>
<h2>Assignment 5 — Visual storytelling</h2>
<div class="callout danger"><span class="badge">⚠️ Biggest single grade</span> Assignment 5 alone is worth <strong>30%</strong> of the whole course — bigger than any other single item (see 0.2).</div>
<ul>
<li><strong>Buổi:</strong> 48-50 (buổi 49-59 lặp lại y nguyên buổi 48 — làm bài tại lớp, xem 0.5).</li>
<li><strong>CLO:</strong> CLO2, CLO4, CLO5.</li>
<li><strong>Đầu điểm:</strong> Assignment 5 — <strong>30%</strong>.</li>
<li><strong>Đề bài (nguyên văn FLM):</strong> Research a specific theme, idea; construct a complete story and create a method to present it. Students can choose between photographic collage, illustrative presentation, video, interactive product, or model making. Work in groups; free media chosen.</li>
<li><strong>Nộp:</strong> một sản phẩm kể chuyện hoàn chỉnh (nhóm) — collage ảnh, minh hoạ, video, sản phẩm tương tác, hoặc mô hình (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài tập NHÓM, đầu điểm lớn nhất môn. Bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 10 · Bài 10.1 · Buổi 48-50 · CLO2, CLO4, CLO5 · Khung</span>
<h2>Bài tập 5 — Kể chuyện bằng hình ảnh</h2>
<div class="callout danger"><span class="badge">⚠️ Đầu điểm lớn nhất</span> Riêng Assignment 5 đã chiếm <strong>30%</strong> toàn môn — lớn hơn bất kỳ đầu điểm đơn lẻ nào khác (xem 0.2).</div>
<ul>
<li><strong>Buổi:</strong> 48-50 (buổi 49-59 lặp lại y nguyên buổi 48 — làm bài tại lớp, xem 0.5).</li>
<li><strong>CLO:</strong> CLO2, CLO4, CLO5.</li>
<li><strong>Đầu điểm:</strong> Assignment 5 — <strong>30%</strong>.</li>
<li><strong>Đề bài (dịch từ FLM):</strong> Nghiên cứu một chủ đề/ý tưởng cụ thể; dựng một câu chuyện hoàn chỉnh và sáng tạo cách trình bày. Sinh viên chọn giữa collage ảnh, trình bày minh hoạ, video, sản phẩm tương tác, hoặc làm mô hình. Làm việc theo nhóm; tự do chọn phương tiện.</li>
<li><strong>Nộp:</strong> một sản phẩm kể chuyện hoàn chỉnh (nhóm) — collage ảnh, minh hoạ, video, sản phẩm tương tác, hoặc mô hình (đưa vào Portfolio cuối khoá).</li>
<li><strong>Ghi chú:</strong> Khung — bài tập NHÓM, đầu điểm lớn nhất môn. Bài giảng đầy đủ bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k102 = doc('vcm202-10-2-assignment5-tiep', '10.2 — Assignment 5: Continue — group work (khung)|||10.2 — Bài tập 5: Tiếp tục — làm việc nhóm (khung)',
  'Buổi 51-59, CLO2/CLO4/CLO5, Assignment 5 (30%). Khung.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 10 · Lesson 10.2 · Sessions 51-59 · CLO2, CLO4, CLO5 · Khung</span>
<h2>Assignment 5 — Continue (group studio time)</h2>
<ul>
<li><strong>Buổi:</strong> 51-59 — 9 buổi liên tiếp, FLM ghi nguyên văn cùng chủ đề Assignment 5 cho mọi buổi này.</li>
<li><strong>CLO:</strong> CLO2, CLO4, CLO5.</li>
<li><strong>Đầu điểm:</strong> Assignment 5 — <strong>30%</strong>.</li>
<li><strong>Ghi chú:</strong> Khung — khối buổi thực hành nhóm dài nhất môn cùng Assignment 4; bài giảng đầy đủ (mốc tiến độ theo tuần) bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 10 · Bài 10.2 · Buổi 51-59 · CLO2, CLO4, CLO5 · Khung</span>
<h2>Bài tập 5 — Tiếp tục (thời gian thực hành nhóm)</h2>
<ul>
<li><strong>Buổi:</strong> 51-59 — 9 buổi liên tiếp, FLM ghi nguyên văn cùng chủ đề Assignment 5 cho mọi buổi này.</li>
<li><strong>CLO:</strong> CLO2, CLO4, CLO5.</li>
<li><strong>Đầu điểm:</strong> Assignment 5 — <strong>30%</strong>.</li>
<li><strong>Ghi chú:</strong> Khung — khối buổi thực hành nhóm dài nhất môn cùng Assignment 4; bài giảng đầy đủ (mốc tiến độ theo tuần) bổ sung sau.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

const k103 = doc('vcm202-10-3-assignment5-cham', '10.3 — Assignment 5: Grading (khung)|||10.3 — Bài tập 5: Chấm điểm (khung)',
  'Buổi 60, CLO2/CLO4/CLO5, Assignment 5 (30%). Khung — buổi cuối cùng của môn.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 10 · Lesson 10.3 · Session 60 · CLO2, CLO4, CLO5 · Khung</span>
<h2>Assignment 5 — Grading and Evaluating (final session)</h2>
<ul>
<li><strong>Buổi:</strong> 60 — buổi cuối cùng của môn.</li>
<li><strong>CLO:</strong> CLO2, CLO4, CLO5.</li>
<li><strong>Đầu điểm:</strong> Assignment 5 — <strong>30%</strong> — chấm &amp; đánh giá tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung. <strong>Nhắc lại 0.6, mục 7:</strong> nộp Portfolio đầy đủ nội dung mọi bài tập cho giảng viên sau khi kết thúc khoá học.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
    `<span class="eyebrow">VCM202 · Chương 10 · Bài 10.3 · Buổi 60 · CLO2, CLO4, CLO5 · Khung</span>
<h2>Bài tập 5 — Chấm &amp; đánh giá (buổi cuối)</h2>
<ul>
<li><strong>Buổi:</strong> 60 — buổi cuối cùng của môn.</li>
<li><strong>CLO:</strong> CLO2, CLO4, CLO5.</li>
<li><strong>Đầu điểm:</strong> Assignment 5 — <strong>30%</strong> — chấm &amp; đánh giá tại lớp.</li>
<li><strong>Ghi chú:</strong> Khung. <strong>Nhắc lại 0.6, mục 7:</strong> nộp Portfolio đầy đủ nội dung mọi bài tập cho giảng viên sau khi kết thúc khoá học.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13360.</em></p>`,
  ]]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'VCM202',
    slug: 'vcm202-visual-communication',
    title: 'Visual Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/VCM202.webp',
    shortDescription: 'Official FPTU visual-design course (FLM Syllabus 13360, 60 sessions, NO final exam — 5 studio assignments + participation): seeing & basic elements taught in full; a session-by-session framework for composition, collage, multi-frame story and visual storytelling.|||Môn Thiết kế thị giác FPTU (FLM Syllabus 13360, 60 buổi, KHÔNG thi cuối kỳ — 5 bài tập studio + chuyên cần): cảm nhận & yếu tố cơ bản dạy đầy đủ; khung từng buổi cho bố cục, collage, truyện nhiều khung và kể chuyện bằng hình.',
    description: 'Môn <strong>VCM202 — Visual Communication</strong> (Truyền thông thị giác_Nguyên lý thị giác, Kỳ 1) dựng lại bám nguyên văn <strong>FLM Syllabus 13360</strong> (QĐ 932/QĐ-ĐHFPT ngày 22/08/2025), đủ <strong>60 buổi</strong>, <strong>6 CLO</strong> và <strong>6 đầu điểm</strong>. Đây là môn <strong>thực hành thị giác</strong>: KHÔNG có thi cuối kỳ — toàn bộ điểm là 5 assignment studio (vẽ, bố cục, collage, truyện nhiều khung, kể chuyện bằng hình) cộng chuyên cần. <strong>Mục 0</strong> là khung chương trình đầy đủ (hồ sơ môn, cách tính điểm, CLO, giáo trình &amp; công cụ — kể cả vật tư thật cần chuẩn bị, kế hoạch 60 buổi, nhiệm vụ sinh viên) để sinh viên tự đối chiếu với FLM. <strong>Chương 1</strong> (buổi 1-6: chuỗi Cảm nhận → Chọn lọc → Tri giác = Nhìn thấy; bốn yếu tố cơ bản Điểm/Đường/Hình/Nền; bố cục; mã &amp; phong cách) dạy đầy đủ, song ngữ, ví dụ cụ thể (biển báo, logo, bìa sách), bài tập tự làm và một quiz kết chương. <strong>Chương 2 đến hết</strong> (5 assignment: Vẽ để truyền đạt, Bố cục, Collage, Truyện nhiều khung hình, Kể chuyện bằng hình; cùng các buổi lý thuyết Gây chú ý, Định hướng &amp; diễn giải, Tương tác/ký hiệu học, Ghi nhớ &amp; mở rộng nghĩa) hiện là <strong>khung</strong> — đúng tên buổi, đúng CLO, đề bài &amp; trọng số từng assignment — để sinh viên có đúng chương trình học ngay, chi tiết sẽ bổ sung dần.',
    whatYouLearn: 'Chuỗi Cảm nhận-Chọn lọc-Tri giác = Nhìn thấy; bốn yếu tố cơ bản (Điểm, Đường, Hình, Nền) và cảm giác mỗi yếu tố truyền đạt; bố cục &amp; đường đi của mắt; mã &amp; phong cách thị giác theo văn hoá; kỹ thuật gây chú ý (tương phản, hình-nền, tỉ lệ, nhịp điệu, chuyển động); định hướng sử dụng &amp; diễn giải (affordance, mapping, wayfinding); ký hiệu học (icon/index/symbol, denotation/connotation, ẩn dụ); ghi nhớ &amp; mở rộng nghĩa (narrative, mnemonics); 5 bài tập studio thực chiến: vẽ để truyền đạt, bố cục, collage, truyện nhiều khung hình, kể chuyện bằng hình ảnh.',
    requirements: 'Không cần nền thiết kế (Pre-Requisite: None, theo FLM). CẦN chuẩn bị vật tư thật: giấy A2/A3/A4, bìa cứng A1, dao rọc giấy, kéo, keo, băng dính hai mặt, bút mực đen, màu, cọ, báo/tạp chí cũ có ảnh màu để cắt dán, thiết bị quay video — xem đủ danh sách ở mục 0.4.',
  },
  sections: [
    {
      title: 'Mục 0 — Khung chương trình theo FLM|||Section 0 — FLM program framework',
      description: 'Hồ sơ môn, cách tính điểm (6 đầu điểm, KHÔNG thi cuối kỳ), 6 CLO, giáo trình & công cụ (4 sách giấy + vật tư thật), kế hoạch đủ 60 buổi, nhiệm vụ sinh viên — đối chiếu trực tiếp FLM Syllabus 13360.',
      lessons: [m01, m02, m03, m04, m05, m06],
    },
    {
      title: 'Chương 1 — Nhập môn thị giác & yếu tố cơ bản (buổi 1-6)|||Chapter 1 — Introduction to visual perception & basic elements (sessions 1-6)',
      description: 'Buổi 1-6 · CLO1-2 · Cảm nhận-Chọn lọc-Tri giác, yếu tố cơ bản (Điểm/Đường/Hình/Nền), bố cục, mã & phong cách — ĐẦY ĐỦ, dạy được ngay, kết chương bằng quiz.',
      lessons: [c1_1, c1_2, c1_3, c1_4, c1_5, c1quiz],
    },
    {
      title: 'Chương 2 — Assignment 1: Vẽ để truyền đạt (khung)|||Chapter 2 — Assignment 1: Drawing as communication (skeleton)',
      description: 'Buổi 7-12 · CLO1, CLO2 · Assignment 1 (10%) · Khung.',
      lessons: [k21, k22],
    },
    {
      title: 'Chương 3 — Gây chú ý (khung)|||Chapter 3 — Getting attention (skeleton)',
      description: 'Buổi 13-15 · CLO3 · Tương phản, hình-nền, tỉ lệ, hoa văn, nhịp điệu, chuyển động — Khung.',
      lessons: [k31, k32],
    },
    {
      title: 'Chương 4 — Assignment 2: Bố cục (khung)|||Chapter 4 — Assignment 2: Composition (skeleton)',
      description: 'Buổi 16-21 · CLO2, CLO3 · Assignment 2 (15%) · Khung.',
      lessons: [k41, k42],
    },
    {
      title: 'Chương 5 — Định hướng & diễn giải (khung)|||Chapter 5 — Orienting for use & interpretation (skeleton)',
      description: 'Buổi 22-23 · CLO3, CLO4 · Khung.',
      lessons: [k51],
    },
    {
      title: 'Chương 6 — Assignment 3: Collage (khung)|||Chapter 6 — Assignment 3: Collage (skeleton)',
      description: 'Buổi 24-30 · CLO2-4 · Assignment 3 (15%) · Khung — cần vật tư thật.',
      lessons: [k61, k62, k63],
    },
    {
      title: 'Chương 7 — Tương tác, diễn giải, trải nghiệm (khung)|||Chapter 7 — Interacting, interpreting, experiencing (skeleton)',
      description: 'Buổi 31-32 · CLO3, CLO4 · Ký hiệu học (semiotics) — Khung.',
      lessons: [k71],
    },
    {
      title: 'Chương 8 — Assignment 4: Truyện nhiều khung hình (khung)|||Chapter 8 — Assignment 4: Multiple frame story (skeleton)',
      description: 'Buổi 33-45 · CLO2-4 · Assignment 4 (20%) · Bài tập NHÓM · Khung.',
      lessons: [k81, k82, k83],
    },
    {
      title: 'Chương 9 — Ghi nhớ & mở rộng nghĩa (khung)|||Chapter 9 — Retaining & extending meaning (skeleton)',
      description: 'Buổi 46-47 · CLO5 · Khung.',
      lessons: [k91],
    },
    {
      title: 'Chương 10 — Assignment 5: Kể chuyện bằng hình (khung)|||Chapter 10 — Assignment 5: Visual storytelling (skeleton)',
      description: 'Buổi 48-60 · CLO2, CLO4, CLO5 · Assignment 5 (30% — đầu điểm lớn nhất môn) · Bài tập NHÓM · Khung.',
      lessons: [k101, k102, k103],
    },
  ],
};
