/**
 * DRS102 — Drawing - Form, Still-life (Hình hoạ: Vẽ khối, tĩnh vật). Ngành
 * Thiết kế đồ hoạ FPTU, kỳ 1. DỰNG LẠI 20/09/2026 bám nguyên văn FLM
 * Syllabus 13343 (QĐ 932/QĐ-ĐHFPT ngày 22/08/2025), nguồn:
 * content/academy/_syllabus-flm/DRS102.json. Bản trước (18 bài, 8 chương tự
 * chọn: dụng cụ → đường nét/tỉ lệ → khối cơ bản → phối cảnh → sáng tối →
 * chất liệu → bố cục → bài hoàn chỉnh) KHÔNG bám cấu trúc 60 buổi / 5 cặp
 * Lab theo đúng thứ tự của trường — đã thay toàn bộ.
 *
 * MỨC ĐỘ: Mục 0 (khung FLM) và Chương 1 (buổi 1-4 + 13-14: trọn CHAPTER 1
 * GETTING STARTED — dụng cụ, kỹ thuật chì, luyện nét, phối cảnh, khởi động/
 * ký hoạ, học cách nhìn & khối/sáng-tối) là ĐẦY ĐỦ, dạy được ngay cho người
 * CHƯA TỪNG VẼ. Chương 2 → 11 CHỈ LÀ KHUNG (đúng tên bài + buổi/CLO/đề Lab
 * nguyên văn/trọng số/nộp gì) — bài giảng chi tiết bổ sung sau.
 *
 * ⚠️ Đây là môn học TRỰC TIẾP trong xưởng vẽ, vẽ tay trên giấy A3 bằng chì
 * thật. Nội dung web CHỈ hỗ trợ lý thuyết + tự luyện — KHÔNG thay được buổi
 * vẽ có mẫu thật, có giảng viên chữa bài trực tiếp. Ghi thẳng trong bài,
 * không hứa quá.
 *
 * Sách/tài liệu: MỌI giáo trình phải là thẻ `.khoi-sach`/`.the-sach`
 * (content/academy/_HOP-DONG-SOAN-BAI.md, mục "SÁCH & TÀI LIỆU"). Cả 5 sách
 * của DRS102 đều Is Online=False, Is Hard Copy=True ⇒ KHÔNG sách nào có
 * link — dùng `the-sach khong-link` cho TẤT CẢ.
 *
 * ⚠️ Ghi chú/bất thường từ syllabus gốc (giữ nguyên, nêu cho sinh viên, xem
 * đủ trong "ghiChuKiemChung" của file JSON nguồn):
 *   1. Môn KHÔNG có thi cuối kỳ — 100% là 5 cặp Lab (10/15/15/20/30%) +
 *      Participation 10%. Nhưng StudentTasks vẫn ghi "...accepted to the
 *      final examination" — mâu thuẫn trong chính syllabus, nêu ở cả 0.2 &
 *      0.6.
 *   2. Cả 5 dòng đánh giá ghi "LO1..LO6" thay vì "CLO1..CLO6" (thiếu chữ
 *      C). CLO của Participation để TRỐNG. Tên 2 đầu điểm dính khoảng trắng
 *      canh lề thừa ("Lab7, Lab8        (practice 4)").
 *   3. Ô Description bị CẮT giữa câu trên bản web ("...the noti") — không
 *      bịa phần sau.
 *   4. Kế hoạch buổi của Chương 1 bị dạy NGẮT QUÃNG: mục 1-6 ở buổi 1-4,
 *      Lab 1-2 chen giữa ở buổi 5-12, rồi mới quay lại mục 7-9 ở buổi 13-14.
 *   5. LỆCH LỚN: chương lý thuyết 3 dạy ĐỘNG VẬT, chương 4 PHONG CẢNH,
 *      chương 5 NGƯỜI — nhưng cả 10 bài Lab thực hành đều là vẽ KHỐI/TĨNH
 *      VẬT (chỉ Lab 5-6 thêm "with animals", Lab 9-10 thêm "with masks").
 *      Tên môn cũng chỉ ghi "Form, Still-life". Nêu chỗ lệch, không tự sửa.
 *   6. Cột ITU cực kỳ không nhất quán (IT / I, T / T,U / T, U / TU, buổi 6
 *      để TRỐNG); bản gốc gõ sai "Begining" (buổi 13-14), "propotions" /
 *      "papper" / "boad" / "back ink pen" (ô Tools), "develope" (CLO2),
 *      "hightlights" (CLO3); buổi 37-40 dính chữ "LANDSCAPESLandscape" /
 *      "LANDSCAPESStructures".
 *   7. Bảng câu hỏi kiến tạo có 20 câu nhưng CHỈ phủ buổi 2 → 20; nguồn thu
 *      thập cho web cũng chỉ trích được 4/20 câu (buổi 2 và buổi 19-20) —
 *      phần giữa (buổi 3-18) KHÔNG bịa thêm.
 *
 * Giữ NGUYÊN 4 slug đã có trong bản trước (tái dùng cho bài tương ứng):
 * drs102-0-0-tai-lieu (nay 0.4 Giáo trình & công cụ), drs102-0-1-overview
 * (nay 0.1 Hồ sơ môn), drs102-1-1-basics (nay 1.1 Dụng cụ & vật liệu),
 * drs102-quiz-1 (nay quiz kết Chương 1); course.slug
 * drs102-drawing-form-still-life. Quiz 2-8 và các bài 8-chương cũ không còn
 * dùng — bị prune khi seed (course.pruneSections: true). Bài MỚI dùng lối
 * drs102-<chương>-<số>-<mô tả>.
 *
 * ⚠️ KHÔNG backtick lồng hay ${ } trong chuỗi nội dung.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ─────────────────────────────────────────────────────────────────────────
// Thẻ sách dùng chung (.khoi-sach/.the-sach) — nối chuỗi thường. Cả 5 sách
// KHÔNG có link (Is Online=False, Is Hard Copy=True trên FLM).
// ─────────────────────────────────────────────────────────────────────────
const sachChinh =
  '<div class="khoi-sach">' +
  '<div class="the-sach chinh khong-link">' +
  '<span class="sach-ico">📗</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">The Art of Basic Drawing</span>' +
  '<span class="sach-phu">William F. Powell, Michael Butkus, Walter Foster, Mia Tavonatti &middot; Walter Foster Publishing &middot; 2020 &middot; 1st ed &middot; ISBN 978-1633228320</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">Giáo trình chính</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

const sachThamKhao1 =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📘</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Basics of Drawing: The Ultimate Guide for Beginners</span>' +
  '<span class="sach-phu">Leonardo Pereznieto &middot; Get Creative 6 &middot; 2020 &middot; 1st ed &middot; ISBN 978-1684620166</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

const sachThamKhao2 =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📙</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Drawing Dimension &ndash; Shading Techniques</span>' +
  '<span class="sach-phu">Catherine V. Holmes &middot; Library Tales Publishing &middot; 2017 &middot; 1st ed &middot; ISBN-10 0692919848</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

const sachThamKhao3 =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📕</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Exploring The Basics of Drawing</span>' +
  '<span class="sach-phu">Victoria Vebell &middot; Cengage Learning &middot; 2014 &middot; 2nd ed &middot; ISBN 9781285184593</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

const sachThamKhao4 =
  '<div class="khoi-sach">' +
  '<div class="the-sach khong-link">' +
  '<span class="sach-ico">📔</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Fundamental of drawing Still-life</span>' +
  '<span class="sach-phu">Barrington Barber &middot; Arcturus Publishing &middot; 2017 &middot; 1st ed &middot; ISBN 9781788283205</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

// ─────────────────────────────────────────────────────────────────────────
// MỤC 0 — Khung FLM (đầy đủ, chính xác 100% theo Syllabus 13343)
// ─────────────────────────────────────────────────────────────────────────

const m01 = doc('drs102-0-1-overview', '0.1 — Course profile (FLM Syllabus 13343)|||0.1 — Hồ sơ môn (FLM Syllabus 13343)',
  'Tên môn, mã môn, 3 tín chỉ, 150h = 45h lên lớp (60 buổi) + 105h tự học, môn tiên quyết None, phương pháp Lecture/Practice/discussion — nguyên văn FLM. Đây là môn học TRỰC TIẾP trong xưởng vẽ.',
  [[
    `<span class="eyebrow">DRS102 · Section 0 · 0.1 · Course profile</span>
<h2>Course profile — Drawing, Form &amp; Still-life (DRS102)</h2>
<p class="lead">The facts below are copied exactly as published on <strong>FLM</strong> (FPT University's syllabus system) so you can verify every number yourself.</p>
<table>
<tr><th>Field</th><th>Value (FLM)</th></tr>
<tr><td>Syllabus Name</td><td>Drawing - Form, still-life_H&igrave;nh h&#7885;a - V&#7869; kh&#7889;i, t&#297;nh v&#7853;t</td></tr>
<tr><td>Course Name (English)</td><td>Drawing - Form, still-life</td></tr>
<tr><td>Subject Code</td><td>DRS102</td></tr>
<tr><td>Credits</td><td>3</td></tr>
<tr><td>Degree Level</td><td>Bachelor</td></tr>
<tr><td>Time Allocation</td><td>Study hour (150h) = 45h contact hours + 105h self-study</td></tr>
<tr><td>Pre-Requisite</td><td>None</td></tr>
<tr><td>Learning-Teaching Method</td><td>Lecture, Practice, discussion</td></tr>
<tr><td>Scoring Scale</td><td>10</td></tr>
<tr><td>Min. average mark to pass</td><td>5</td></tr>
<tr><td>Decision No.</td><td>932/QĐ-ĐHFPT dated 08/22/2025</td></tr>
<tr><td>Syllabus ID</td><td>13343</td></tr>
</table>
<div class="callout"><span class="badge">Self-check</span> Every figure above is taken verbatim from FLM — Syllabus ID <strong>13343</strong>, issued under Decision <strong>932/QĐ-ĐHFPT dated 08/22/2025</strong>. Original: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13343" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13343)</a>.</div>
<div class="callout warn"><span class="badge">⚠️ This is a STUDIO course</span> DRS102 is taught <strong>in person, in the drawing studio</strong>, drawing by hand on real A3 paper with real graphite pencils under a real light source. This website can only support the <strong>theory</strong> and give you material to <strong>practice on your own</strong> — it cannot replace a studio session with a real still-life set-up and an instructor correcting your drawing in person. We say this plainly rather than overpromise.</div>
<div class="callout warn"><span class="badge">⚠️ Description cut off on FLM</span> FLM's own <em>Description</em> field is cut off mid-sentence on the web page: "...Students familiarize themselves with drawing tools and correct pencil holding style, the noti" — and then nothing. We cannot read the rest, so we are not guessing what follows.</div>
<p><em>Course description (FLM, as far as it goes):</em> Drawing subject illustrates the basic content of the painting to give students the general concept for further studying of ratio, morphology, shape, characteristics, state of people and objects in relation to space and environment by dark-bright contrasts. Through the process of research, students will grasp the basic principles of descriptive geometry while enhancing the aesthetic awareness. Drawing is the knowledge basement for students to understand the structure, proportions, shapes to serve the art works. The subject will be carried out in the drawing studio with specific requirements on learning materials. Students familiarize themselves with drawing tools and correct pencil holding style, the noti<em>[cut off here in the FLM source]</em>.</p>
<div class="callout"><span class="badge">Sequencing note</span> Pre-Requisite is <strong>None</strong> — DRS102 has no prerequisite, so it comes <strong>first</strong>. The follow-on course <strong>DRP101</strong> (head &amp; portrait drawing) lists its own Pre-Requisite as <strong>"DRS10x"</strong> (a wildcard meaning any DRS10* course, DRS102 under the current curriculum) — confirming DRS102 is meant to be taken before DRP101.</div>
<p><em>Nguồn: FLM · Syllabus 13343 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">DRS102 · Mục 0 · 0.1 · Hồ sơ môn</span>
<h2>Hồ sơ môn — Hình hoạ: Khối &amp; Tĩnh vật (DRS102)</h2>
<p class="lead">Toàn bộ thông tin dưới đây lấy nguyên văn từ <strong>FLM</strong> để bạn tự đối chiếu.</p>
<table>
<tr><th>Trường</th><th>Giá trị (FLM)</th></tr>
<tr><td>Tên syllabus</td><td>Drawing - Form, still-life_Hình họa - Vẽ khối, tĩnh vật</td></tr>
<tr><td>Tên môn (tiếng Anh)</td><td>Drawing - Form, still-life</td></tr>
<tr><td>Mã môn</td><td>DRS102</td></tr>
<tr><td>Số tín chỉ</td><td>3</td></tr>
<tr><td>Bậc học</td><td>Đại học (Bachelor)</td></tr>
<tr><td>Phân bổ thời gian</td><td>150 giờ học = 45 giờ lên lớp (60 buổi) + 105 giờ tự học</td></tr>
<tr><td>Môn tiên quyết</td><td>Không có (None)</td></tr>
<tr><td>Phương pháp dạy-học</td><td>Giảng &amp; thực hành &amp; thảo luận (Lecture, Practice, discussion)</td></tr>
<tr><td>Thang điểm</td><td>10</td></tr>
<tr><td>Điểm trung bình tối thiểu để qua môn</td><td>5</td></tr>
<tr><td>Số quyết định</td><td>932/QĐ-ĐHFPT ngày 22/08/2025</td></tr>
<tr><td>Syllabus ID</td><td>13343</td></tr>
</table>
<div class="callout"><span class="badge">Tự kiểm chứng</span> Mọi con số trên lấy nguyên văn từ FLM — Syllabus ID <strong>13343</strong>, ban hành theo Quyết định <strong>932/QĐ-ĐHFPT ngày 22/08/2025</strong>. Bản gốc: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13343" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13343)</a>.</div>
<div class="callout warn"><span class="badge">⚠️ Đây là môn học XƯỞNG VẼ</span> DRS102 học <strong>trực tiếp trong xưởng vẽ</strong>, vẽ tay trên giấy A3 thật bằng chì graphite thật, dưới một nguồn sáng thật. Trang web này chỉ hỗ trợ được phần <strong>lý thuyết</strong> và cho bạn bài để <strong>tự luyện</strong> — KHÔNG thể thay thế buổi học có mẫu tĩnh vật thật và giảng viên chữa bài trực tiếp. Nói thẳng vậy, không hứa quá khả năng.</div>
<div class="callout warn"><span class="badge">⚠️ Mô tả bị cắt trên FLM</span> Ô <em>Description</em> trên trang FLM bị cắt giữa câu: "...Students familiarize themselves with drawing tools and correct pencil holding style, the noti" — rồi hết. Không đọc được phần sau, nên không đoán tiếp.</div>
<p><em>Mô tả môn (FLM, dịch phần đọc được):</em> Môn Vẽ minh hoạ nội dung cơ bản của hội hoạ để sinh viên có khái niệm chung, phục vụ việc học sâu hơn về tỉ lệ, hình thái, hình dạng, đặc điểm, trạng thái của người và vật trong quan hệ với không gian và môi trường qua tương phản sáng-tối. Qua quá trình nghiên cứu, sinh viên nắm được các nguyên lý cơ bản của hình học hoạ hình đồng thời nâng cao nhận thức thẩm mỹ. Vẽ là nền tảng kiến thức giúp sinh viên hiểu cấu trúc, tỉ lệ, hình dạng để phục vụ tác phẩm nghệ thuật. Môn học được tổ chức trong xưởng vẽ với yêu cầu cụ thể về vật liệu học tập. Sinh viên làm quen với dụng cụ vẽ và cách cầm bút chì đúng, the noti<em>[bị cắt tại đây trong nguồn FLM]</em>.</p>
<div class="callout"><span class="badge">Ghi chú thứ tự học</span> Pre-Requisite là <strong>None</strong> — DRS102 không có môn tiên quyết, nên học <strong>TRƯỚC</strong>. Môn nối tiếp <strong>DRP101</strong> (vẽ đầu tượng, chân dung) tự ghi Pre-Requisite là <strong>"DRS10x"</strong> (ký hiệu có dấu sao, nghĩa là bất kỳ môn DRS10*, với chương trình hiện hành là DRS102) — xác nhận DRS102 học trước DRP101.</div>
<p><em>Nguồn: FLM · Syllabus 13343 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m02 = doc('drs102-0-2-cach-tinh-diem', '0.2 — Grading: NO final exam, 5 Lab pairs + Participation, 100%|||0.2 — Cách tính điểm: KHÔNG thi cuối kỳ, 5 cặp Lab + Participation, 100%',
  '5 cặp Lab (10/15/15/20/30%) + Participation 10% = 100%. Trọng số TĂNG DẦN — Lab 9-10 một mình chiếm 30%. Môn KHÔNG có thi cuối kỳ, nhưng StudentTasks lại nhắc "final examination" — mâu thuẫn của chính syllabus.',
  [[
    `<span class="eyebrow">DRS102 · Section 0 · 0.2 · Grading</span>
<h2>Grading breakdown — 5 Lab pairs + Participation, total 100%</h2>
<div class="callout warn"><span class="badge">⚠️ Read this first</span> DRS102 has <strong>NO final exam</strong>. All 100% of your grade comes from <strong>5 on-going Lab pairs</strong> plus Participation. The weights <strong>increase</strong> as the course goes on — the last pair, Lab 9-10, is worth <strong>30% by itself</strong>, more than any other single item.</div>
<table>
<tr><th>#</th><th>Category (FLM, verbatim)</th><th>Type</th><th>Weight</th><th>CLO (FLM writes "LO")</th></tr>
<tr><td>1</td><td>Lab1, Lab 2 (practice 1)</td><td>on-going</td><td>10%</td><td>LO1, LO2, LO3, LO4</td></tr>
<tr><td>2</td><td>Lab3, Lab4 (practice 2)</td><td>on-going</td><td>15%</td><td>LO2, LO3, LO4, LO5</td></tr>
<tr><td>3</td><td>Lab5, Lab6 (practice 3)</td><td>on-going</td><td>15%</td><td>LO2, LO3, LO4, LO5, LO6</td></tr>
<tr><td>4</td><td>Lab7, Lab8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 4)</td><td>on-going</td><td>20%</td><td>LO2, LO3, LO4, LO5, LO6</td></tr>
<tr><td>5</td><td>Lab9, Lab10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 5)</td><td>on-going</td><td>30%</td><td>LO2, LO3, LO4, LO5, LO6</td></tr>
<tr><td>6</td><td>Participation</td><td>on-going</td><td>10%</td><td><em>(left blank on FLM)</em></td></tr>
</table>
<p><strong>Total: 10% + 15% + 15% + 20% + 30% + 10% = 100%.</strong></p>
<div class="callout warn"><span class="badge">⚠️ FLM data quirks — kept as-is</span>
<ul>
<li><strong>Weights increase 10 → 15 → 15 → 20 → 30%.</strong> The Lab 9-10 pair (sessions 53-60) is the heaviest single item in the whole course.</li>
<li><strong>"LO" instead of "CLO" everywhere.</strong> All 5 practice rows write <code>LO1..LO6</code> instead of <code>CLO1..CLO6</code> — a consistent typo across the whole grading table (and the 60-session plan too). We read this as CLO, but the raw table really is missing the "C".</li>
<li><strong>Participation's CLO cell is empty</strong> — FLM does not publish which CLO(s) Participation maps to. We report that gap rather than invent one.</li>
<li><strong>Extra padding spaces in two item names</strong>: the raw table has <code>"Lab7, Lab8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 4)"</code> and <code>"Lab9, Lab10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 5)"</code> — visible column-alignment spaces left in from FLM's own table.</li>
</ul></div>
<div class="callout danger"><span class="badge">⚠️ Contradiction in the syllabus itself</span> Section 0.6 (Student Tasks) says: <em>"Class attendance is strongly encouraged. Attend at least 80% of class hours <strong>in order to be accepted to the final examination</strong>."</em> — but this table shows there IS no final exam; all six items above are on-going. This sentence looks like boilerplate copied from a syllabus template and never edited for a no-final-exam course. We report it as published; do not assume there secretly is a final exam.</div>
<p><em>Nguồn: FLM · Syllabus 13343 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">DRS102 · Mục 0 · 0.2 · Cách tính điểm</span>
<h2>Cách tính điểm — 5 cặp Lab + Participation, tổng 100%</h2>
<div class="callout warn"><span class="badge">⚠️ Đọc kỹ trước tiên</span> DRS102 <strong>KHÔNG có thi cuối kỳ</strong>. Toàn bộ 100% điểm đến từ <strong>5 cặp Lab xuyên suốt (on-going)</strong> cộng Participation. Trọng số <strong>tăng dần</strong> theo tiến độ môn — cặp cuối, Lab 9-10, một mình chiếm <strong>30%</strong>, nặng hơn bất kỳ đầu điểm đơn lẻ nào khác.</div>
<table>
<tr><th>#</th><th>Đầu điểm (nguyên văn FLM)</th><th>Dạng</th><th>Trọng số</th><th>CLO (FLM ghi "LO")</th></tr>
<tr><td>1</td><td>Lab1, Lab 2 (practice 1)</td><td>xuyên suốt</td><td>10%</td><td>LO1, LO2, LO3, LO4</td></tr>
<tr><td>2</td><td>Lab3, Lab4 (practice 2)</td><td>xuyên suốt</td><td>15%</td><td>LO2, LO3, LO4, LO5</td></tr>
<tr><td>3</td><td>Lab5, Lab6 (practice 3)</td><td>xuyên suốt</td><td>15%</td><td>LO2, LO3, LO4, LO5, LO6</td></tr>
<tr><td>4</td><td>Lab7, Lab8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 4)</td><td>xuyên suốt</td><td>20%</td><td>LO2, LO3, LO4, LO5, LO6</td></tr>
<tr><td>5</td><td>Lab9, Lab10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 5)</td><td>xuyên suốt</td><td>30%</td><td>LO2, LO3, LO4, LO5, LO6</td></tr>
<tr><td>6</td><td>Participation</td><td>xuyên suốt</td><td>10%</td><td><em>(FLM để trống)</em></td></tr>
</table>
<p><strong>Tổng: 10% + 15% + 15% + 20% + 30% + 10% = 100%.</strong></p>
<div class="callout warn"><span class="badge">⚠️ FLM ghi vậy, giữ nguyên</span>
<ul>
<li><strong>Trọng số tăng dần 10 → 15 → 15 → 20 → 30%.</strong> Cặp Lab 9-10 (buổi 53-60) là đầu điểm nặng nhất cả môn.</li>
<li><strong>Ghi "LO" thay vì "CLO" ở khắp nơi.</strong> Cả 5 dòng practice đều ghi <code>LO1..LO6</code> thay vì <code>CLO1..CLO6</code> — lỗi gõ nhất quán trong cả bảng điểm lẫn kế hoạch 60 buổi. Ta hiểu là CLO, nhưng bảng gốc thật sự thiếu chữ "C".</li>
<li><strong>Ô CLO của Participation để TRỐNG</strong> — FLM không công bố Participation ánh xạ vào CLO nào. Ghi đúng khoảng trống đó, không tự bịa.</li>
<li><strong>Khoảng trắng canh lề thừa trong 2 tên đầu điểm</strong>: bảng gốc có <code>"Lab7, Lab8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 4)"</code> và <code>"Lab9, Lab10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(practice 5)"</code> — khoảng trắng canh cột còn sót lại từ bảng gốc của FLM.</li>
</ul></div>
<div class="callout danger"><span class="badge">⚠️ Mâu thuẫn trong chính syllabus</span> Mục 0.6 (Nhiệm vụ sinh viên) ghi: <em>"Class attendance is strongly encouraged. Attend at least 80% of class hours <strong>in order to be accepted to the final examination</strong>."</em> (Khuyến khích đi học đầy đủ. Dự tối thiểu 80% giờ học <strong>để đủ điều kiện dự thi cuối kỳ</strong>.) — nhưng bảng trên cho thấy môn KHÔNG có thi cuối kỳ; cả 6 đầu điểm đều xuyên suốt. Câu này trông như copy nguyên từ mẫu syllabus chung rồi quên sửa cho môn không thi cuối kỳ. Chúng tôi nêu đúng như trường công bố — đừng nghĩ là có thi cuối kỳ "ngầm" nào đó.</div>
<p><em>Nguồn: FLM · Syllabus 13343 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m03 = doc('drs102-0-3-clo', '0.3 — Course Learning Outcomes (6 CLO)|||0.3 — Chuẩn đầu ra môn học (6 CLO)',
  'Nguyên văn 6 CLO tiếng Anh + dịch (kèm lỗi gõ gốc "develope", "hightlights"), cộng ánh xạ CLO ↔ buổi lấy trực tiếp từ cột LO của bảng 60 buổi.',
  [[
    `<span class="eyebrow">DRS102 · Section 0 · 0.3 · CLO</span>
<h2>Course Learning Outcomes — 6 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Detail (nguyên văn FLM)</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand what the drawing is and seeing thing through basic shapes.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Use drawing tools effectively. Use the ways that measure objects. Create the illusion of three dimensions in a two-dimensional space with perspective to develope form.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Analyze the relation between objects and light sources. Define hightlights, shadow areas, cast shadows and reflected light.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Organize layout for a drawing and create sketch by using lines with value. Use the ways to make fragmentation and hatch while sketch.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Perform the unique properties of objects. Transfer the color of objects into monochrome drawing.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Have a professional style in design activities_drawing forms and still-life. Shows patience, concentration, and diligence throughout the course.</td></tr>
</table>
<div class="callout warn"><span class="badge">⚠️ Typos in the raw FLM text — kept, not silently fixed</span> CLO2 writes <strong>"develope"</strong> (should be "develop"); CLO3 writes <strong>"hightlights"</strong> (should be "highlights"). We show the exact FLM wording above so you can match it to the original page, and use the corrected spelling in explanations below.</div>
<div class="callout"><span class="badge">CLO ↔ session map — read directly off the 60-session table's "LO" column</span>
<ul>
<li><strong>CLO1</strong> — tagged on sessions 1-2, 5-16, 25-28, 37-40, 49-52 (introduction + the four theory chapters). Notably ABSENT from sessions 3-4 and from every Lab pair 3 through 10 (17-24, 29-36, 41-48, 53-60) — FLM's own tagging, not an omission on our side.</li>
<li><strong>CLO2</strong> — tagged on <strong>every single session</strong>, 1 through 60. The one CLO that runs through the whole course.</li>
<li><strong>CLO3</strong> — tagged from session 3 onward through session 60 (absent only from sessions 1-2).</li>
<li><strong>CLO4</strong> — tagged sessions 5-12 (Lab 1-2) and 15-60; ABSENT at sessions 13-14 (the only gap).</li>
<li><strong>CLO5</strong> — tagged sessions 15-60 only (from Chapter 2: Still-life onward).</li>
<li><strong>CLO6</strong> — tagged ONLY on the three later Lab pairs: sessions 29-36 (Lab 5-6), 41-48 (Lab 7-8), 53-60 (Lab 9-10). Absent from Lab 1-2, Lab 3-4 and every theory session.</li>
</ul>
<p>This mapping is exactly what the "LO" column of the 60-session plan says (see 0.5) — we did not infer or round it.</p></div>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
    `<span class="eyebrow">DRS102 · Mục 0 · 0.3 · Chuẩn đầu ra</span>
<h2>Chuẩn đầu ra môn học — 6 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Nội dung (nguyên văn FLM)</th><th>Bản dịch</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand what the drawing is and seeing thing through basic shapes.</td><td>Hiểu vẽ là gì và cách nhìn vật thể qua các hình cơ bản.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Use drawing tools effectively. Use the ways that measure objects. Create the illusion of three dimensions in a two-dimensional space with perspective to develope form.</td><td>Dùng dụng cụ vẽ hiệu quả. Dùng các cách đo tỉ lệ vật thể. Tạo ảo giác ba chiều trong không gian hai chiều bằng phối cảnh để phát triển khối.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Analyze the relation between objects and light sources. Define hightlights, shadow areas, cast shadows and reflected light.</td><td>Phân tích tương quan giữa vật thể và nguồn sáng. Xác định vùng sáng nhất (highlight), vùng tối, bóng đổ và ánh sáng phản chiếu.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Organize layout for a drawing and create sketch by using lines with value. Use the ways to make fragmentation and hatch while sketch.</td><td>Tổ chức bố cục cho bài vẽ và phác thảo bằng nét kèm sắc độ. Dùng các cách chia mảng và đánh hatch khi phác thảo.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Perform the unique properties of objects. Transfer the color of objects into monochrome drawing.</td><td>Diễn tả đặc tính riêng của từng vật thể. Chuyển màu sắc của vật thể thành bài vẽ đơn sắc (monochrome).</td></tr>
<tr><td>6</td><td>CLO6</td><td>Have a professional style in design activities_drawing forms and still-life. Shows patience, concentration, and diligence throughout the course.</td><td>Có phong cách chuyên nghiệp trong hoạt động thiết kế — vẽ khối và tĩnh vật. Thể hiện sự kiên nhẫn, tập trung và chăm chỉ xuyên suốt môn học.</td></tr>
</table>
<div class="callout warn"><span class="badge">⚠️ Lỗi gõ trong bản gốc FLM — giữ nguyên, không tự sửa lặng lẽ</span> CLO2 ghi <strong>"develope"</strong> (đúng là "develop"); CLO3 ghi <strong>"hightlights"</strong> (đúng là "highlights"). Bảng trên giữ đúng chữ FLM để bạn đối chiếu với trang gốc; phần dịch bên dưới dùng chính tả đã sửa.</div>
<div class="callout"><span class="badge">Ánh xạ CLO ↔ buổi — lấy trực tiếp từ cột "LO" của bảng 60 buổi</span>
<ul>
<li><strong>CLO1</strong> — gắn ở buổi 1-2, 5-16, 25-28, 37-40, 49-52 (nhập môn + 4 chương lý thuyết). VẮNG MẶT ở buổi 3-4 và ở mọi cặp Lab 3 đến 10 (17-24, 29-36, 41-48, 53-60) — đúng như FLM tự gắn, không phải bên web bỏ sót.</li>
<li><strong>CLO2</strong> — gắn ở <strong>MỌI buổi</strong>, từ 1 đến 60. CLO duy nhất xuyên suốt cả môn.</li>
<li><strong>CLO3</strong> — gắn từ buổi 3 trở đi tới buổi 60 (chỉ vắng ở buổi 1-2).</li>
<li><strong>CLO4</strong> — gắn ở buổi 5-12 (Lab 1-2) và 15-60; VẮNG ở buổi 13-14 (khoảng trống duy nhất).</li>
<li><strong>CLO5</strong> — chỉ gắn ở buổi 15-60 (từ Chương 2: Tĩnh vật trở đi).</li>
<li><strong>CLO6</strong> — CHỈ gắn ở ba cặp Lab sau cùng: buổi 29-36 (Lab 5-6), 41-48 (Lab 7-8), 53-60 (Lab 9-10). Vắng ở Lab 1-2, Lab 3-4 và mọi buổi lý thuyết.</li>
</ul>
<p>Ánh xạ này lấy đúng như cột "LO" của kế hoạch 60 buổi ghi (xem mục 0.5) — không suy đoán hay làm tròn.</p></div>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
  ]]);

// ── 0.5 — Kế hoạch 60 buổi: dựng bằng nối chuỗi thường (KHÔNG template lồng) ──
const buoiData = [
  [1, 'CHAPTER 1: GETTING STARTED &middot; 1. Tools and Materials &middot; 2. Basic Pencil Techniques &middot; 3. Practicing Lines', 'CHƯƠNG 1: NHẬP MÔN &middot; 1. Dụng cụ &amp; vật liệu &middot; 2. Kỹ thuật chì cơ bản &middot; 3. Luyện nét', 'LO1, LO2', 'IT', 'Bài 1.1 + 1.2'],
  [2, 'CHAPTER 1: GETTING STARTED &middot; 1. Tools and Materials &middot; 2. Basic Pencil Techniques &middot; 3. Practicing Lines', 'CHƯƠNG 1: NHẬP MÔN &middot; 1. Dụng cụ &amp; vật liệu &middot; 2. Kỹ thuật chì cơ bản &middot; 3. Luyện nét', 'LO1, LO2', 'IT', 'Bài 1.1 + 1.2'],
  [3, 'CHAPTER 1: GETTING STARTED &middot; 4. Perspective &middot; 5. Warming Up &middot; 6. Sketching', 'CHƯƠNG 1: NHẬP MÔN &middot; 4. Phối cảnh &middot; 5. Khởi động &middot; 6. Ký hoạ', 'LO2, LO3', 'I, T', 'Bài 1.3 + 1.4'],
  [4, 'CHAPTER 1: GETTING STARTED &middot; 4. Perspective &middot; 5. Warming Up &middot; 6. Sketching', 'CHƯƠNG 1: NHẬP MÔN &middot; 4. Phối cảnh &middot; 5. Khởi động &middot; 6. Ký hoạ', 'LO2, LO3', 'IT', 'Bài 1.3 + 1.4'],
  [5, 'Lab 1. Students practice drawing the form of Cube and Sphere on A3 paper.', 'Lab 1. Sinh viên luyện vẽ khối Lập phương và Khối cầu trên giấy A3.', 'LO1, LO2, LO3, LO4', 'T,U', 'Bài 2.1 (Lab 1)'],
  [6, 'Lab 1. Students practice drawing the form of Cube and Sphere on A3 paper.', 'Lab 1. Sinh viên luyện vẽ khối Lập phương và Khối cầu trên giấy A3.', 'LO1, LO2, LO3, LO4', '<em>(để trống trên FLM)</em>', 'Bài 2.1 (Lab 1)'],
  [7, 'Lab 2. Students practice drawing a set of 4 basic blocks: Cube, sphere, prism, cone,&hellip; on the fabric background on A3 paper.', 'Lab 2. Sinh viên luyện vẽ bộ 4 khối cơ bản: Lập phương, cầu, lăng trụ, nón&hellip; trên nền vải, giấy A3.', 'LO1, LO2, LO3, LO4', 'T, U', 'Bài 3.1 (Lab 2)'],
  [8, 'Lab 2. Students practice drawing a set of 4 basic blocks: Cube, sphere, prism, cone,&hellip; on the fabric background on A3 paper.', 'Lab 2. Sinh viên luyện vẽ bộ 4 khối cơ bản: Lập phương, cầu, lăng trụ, nón&hellip; trên nền vải, giấy A3.', 'LO1, LO2, LO3, LO4', 'TU', 'Bài 3.1 (Lab 2)'],
  [9, 'Lab 2. Students practice drawing a set of 4 basic blocks: Cube, sphere, prism, cone,&hellip; on the fabric background on A3 paper.', 'Lab 2. Sinh viên luyện vẽ bộ 4 khối cơ bản: Lập phương, cầu, lăng trụ, nón&hellip; trên nền vải, giấy A3.', 'LO1, LO2, LO3, LO4', 'T, U', 'Bài 3.1 (Lab 2)'],
  [10, 'Lab 2. Students practice drawing a set of 4 basic blocks: Cube, sphere, prism, cone,&hellip; on the fabric background on A3 paper.', 'Lab 2. Sinh viên luyện vẽ bộ 4 khối cơ bản: Lập phương, cầu, lăng trụ, nón&hellip; trên nền vải, giấy A3.', 'LO1, LO2, LO3, LO4', 'TU', 'Bài 3.1 (Lab 2)'],
  [11, 'Lab 2. Students practice drawing a set of 4 basic blocks: Cube, sphere, prism, cone,&hellip; on the fabric background on A3 paper.', 'Lab 2. Sinh viên luyện vẽ bộ 4 khối cơ bản: Lập phương, cầu, lăng trụ, nón&hellip; trên nền vải, giấy A3.', 'LO1, LO2, LO3, LO4', 'T,U', 'Bài 3.1 (Lab 2)'],
  [12, 'Lab 2. Students practice drawing a set of 4 basic blocks: Cube, sphere, prism, cone,&hellip; on the fabric background on A3 paper.', 'Lab 2. Sinh viên luyện vẽ bộ 4 khối cơ bản: Lập phương, cầu, lăng trụ, nón&hellip; trên nền vải, giấy A3.', 'LO1, LO2, LO3, LO4', 'TU', 'Bài 3.1 (Lab 2)'],
  [13, 'CHAPTER 1: GETTING STARTED &middot; 7. Learning to See &middot; 8. Begining with Basic Shapes &middot; 9. Developing Form', 'CHƯƠNG 1: NHẬP MÔN &middot; 7. Học cách nhìn &middot; 8. Bắt đầu từ hình cơ bản &middot; 9. Phát triển khối', 'LO1, LO2, LO3', 'I, T', 'Bài 1.5'],
  [14, 'CHAPTER 1: GETTING STARTED &middot; 7. Learning to See &middot; 8. Begining with Basic Shapes &middot; 9. Developing Form', 'CHƯƠNG 1: NHẬP MÔN &middot; 7. Học cách nhìn &middot; 8. Bắt đầu từ hình cơ bản &middot; 9. Phát triển khối', 'LO1, LO2, LO3', 'IT', 'Bài 1.5'],
  [15, 'CHAPTER 2: STILL-LIFE &middot; Fruit &amp; Nuts &middot; Strawberries &middot; Pineapple &middot; Pinecone &middot; Candlelight Still-life Composition &middot; Reflections &amp; Lace &middot; Bottle &amp; Bread', 'CHƯƠNG 2: TĨNH VẬT &middot; Trái cây &amp; hạt &middot; Dâu tây &middot; Dứa &middot; Quả thông &middot; Bố cục tĩnh vật dưới nến &middot; Phản chiếu &amp; ren &middot; Chai &amp; bánh mì', 'LO1, LO2, LO3, LO4, LO5', 'I, T', 'Bài 4.1'],
  [16, 'CHAPTER 2: STILL-LIFE &middot; Fruit &amp; Nuts &middot; Strawberries &middot; Pineapple &middot; Pinecone &middot; Candlelight Still-life Composition &middot; Reflections &amp; Lace &middot; Bottle &amp; Bread', 'CHƯƠNG 2: TĨNH VẬT &middot; Trái cây &amp; hạt &middot; Dâu tây &middot; Dứa &middot; Quả thông &middot; Bố cục tĩnh vật dưới nến &middot; Phản chiếu &amp; ren &middot; Chai &amp; bánh mì', 'LO1, LO2, LO3, LO4, LO5', 'IT', 'Bài 4.1'],
  [17, 'Lab 3. Students practice drawing a set of still life with basic objects arranged by the teacher on A3 paper.', 'Lab 3. Sinh viên luyện vẽ một bộ tĩnh vật với vật cơ bản do giảng viên sắp đặt, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'T, U', 'Bài 5.1 (Lab 3)'],
  [18, 'Lab 3. Students practice drawing a set of still life with basic objects arranged by the teacher on A3 paper.', 'Lab 3. Sinh viên luyện vẽ một bộ tĩnh vật với vật cơ bản do giảng viên sắp đặt, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'TU', 'Bài 5.1 (Lab 3)'],
  [19, 'Lab 4. Students practice drawing still life with objects that have difficult shapes on A3 paper.', 'Lab 4. Sinh viên luyện vẽ tĩnh vật với vật có hình dạng khó, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'T, U', 'Bài 5.2 (Lab 4)'],
  [20, 'Lab 4. Students practice drawing still life with objects that have difficult shapes on A3 paper.', 'Lab 4. Sinh viên luyện vẽ tĩnh vật với vật có hình dạng khó, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'TU', 'Bài 5.2 (Lab 4)'],
  [21, 'Lab 4 (cont). Students practice drawing still life with objects that have difficult shapes on A3 paper.', 'Lab 4 (tiếp). Sinh viên luyện vẽ tĩnh vật với vật có hình dạng khó, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'T, U', 'Bài 5.2 (Lab 4)'],
  [22, 'Lab 4 (cont). Students practice drawing still life with objects that have difficult shapes on A3 paper.', 'Lab 4 (tiếp). Sinh viên luyện vẽ tĩnh vật với vật có hình dạng khó, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'TU', 'Bài 5.2 (Lab 4)'],
  [23, 'Lab 4 (cont). Students practice drawing still life with objects that have difficult shapes on A3 paper.', 'Lab 4 (tiếp). Sinh viên luyện vẽ tĩnh vật với vật có hình dạng khó, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'T, U', 'Bài 5.2 (Lab 4)'],
  [24, 'Lab 4 (cont). Students practice drawing still life with objects that have difficult shapes on A3 paper.', 'Lab 4 (tiếp). Sinh viên luyện vẽ tĩnh vật với vật có hình dạng khó, trên giấy A3.', 'LO2, LO3, LO4, LO5', 'TU', 'Bài 5.2 (Lab 4)'],
  [25, 'CHAPTER 3: ANIMALS &middot; Drawing Animals &middot; Drawing at the Zoo &middot; Flamingo &middot; Elephant &middot; Kangaroo &middot; Toucan &middot; Tortoise &middot; Rattlesnake', 'CHƯƠNG 3: ĐỘNG VẬT &middot; Vẽ động vật &middot; Vẽ ở sở thú &middot; Hồng hạc &middot; Voi &middot; Chuột túi &middot; Chim toucan &middot; Rùa &middot; Rắn đuôi chuông', 'LO1, LO2, LO3, LO4, LO5', 'I, T', 'Bài 6.1'],
  [26, 'CHAPTER 3: ANIMALS &middot; Drawing Animals &middot; Drawing at the Zoo &middot; Flamingo &middot; Elephant &middot; Kangaroo &middot; Toucan &middot; Tortoise &middot; Rattlesnake', 'CHƯƠNG 3: ĐỘNG VẬT &middot; Vẽ động vật &middot; Vẽ ở sở thú &middot; Hồng hạc &middot; Voi &middot; Chuột túi &middot; Chim toucan &middot; Rùa &middot; Rắn đuôi chuông', 'LO1, LO2, LO3, LO4, LO5', 'IT', 'Bài 6.1'],
  [27, 'CHAPTER 3: ANIMALS &middot; Giant Panda &middot; Giraffe &middot; Horse Portrait &middot; Pony &middot; Siberian Husky Puppy &middot; English Bulldog &middot; Miniature Schnauzer &middot; Persian Cat &middot; Tabby Cat', 'CHƯƠNG 3: ĐỘNG VẬT &middot; Gấu trúc &middot; Hươu cao cổ &middot; Chân dung ngựa &middot; Ngựa con &middot; Chó Husky Siberia con &middot; Chó Bulldog Anh &middot; Chó Schnauzer thu nhỏ &middot; Mèo Ba Tư &middot; Mèo Tabby', 'LO1, LO2, LO3, LO4, LO5', 'I, T', 'Bài 6.2'],
  [28, 'CHAPTER 3: ANIMALS &middot; Giant Panda &middot; Giraffe &middot; Horse Portrait &middot; Pony &middot; Siberian Husky Puppy &middot; English Bulldog &middot; Miniature Schnauzer &middot; Persian Cat &middot; Tabby Cat', 'CHƯƠNG 3: ĐỘNG VẬT &middot; Gấu trúc &middot; Hươu cao cổ &middot; Chân dung ngựa &middot; Ngựa con &middot; Chó Husky Siberia con &middot; Chó Bulldog Anh &middot; Chó Schnauzer thu nhỏ &middot; Mèo Ba Tư &middot; Mèo Tabby', 'LO1, LO2, LO3, LO4, LO5', 'IT', 'Bài 6.2'],
  [29, 'Lab 5. Students observe the set of still life set by the teacher in class, get inspired by the still life, imagine and create a still life art work with animals on A3 paper. (The 1st version)', 'Lab 5. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ ĐỘNG VẬT trên giấy A3. (Bản 1)', 'LO2, LO3, LO4, LO5, LO6', 'T, U', 'Bài 7.1 (Lab 5)'],
  [30, 'Lab 5. Students observe the set of still life set by the teacher in class, get inspired by the still life, imagine and create a still life art work with animals on A3 paper. (The 1st version)', 'Lab 5. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ ĐỘNG VẬT trên giấy A3. (Bản 1)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 7.1 (Lab 5)'],
  [31, 'Lab 6. Students observe the set of still life set by the teacher in class, on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 6. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 7.2 (Lab 6)'],
  [32, 'Lab 6. Students observe the set of still life set by the teacher in class, on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 6. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 7.2 (Lab 6)'],
  [33, 'Lab 6 (cont). Students observe the set of still life set by the teacher in class, on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 6 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 7.2 (Lab 6)'],
  [34, 'Lab 6 (cont). Students observe the set of still life set by the teacher in class, on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 6 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 7.2 (Lab 6)'],
  [35, 'Lab 6 (cont). Students observe the set of still life set by the teacher in class, on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 6 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 7.2 (Lab 6)'],
  [36, 'Lab 6 (cont). Students observe the set of still life set by the teacher in class, on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 6 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 7.2 (Lab 6)'],
  [37, 'CHAPTER 4: LANDSCAPES<strong>Landscape</strong> &middot; Composition &middot; Perspective Tips &middot; Clouds &middot; Rocks &middot; Tree Shapes <em>(dính chữ nguyên văn FLM)</em>', 'CHƯƠNG 4: PHONG CẢNH — Landscape (nguyên văn FLM dính liền "LANDSCAPESLandscape") &middot; Bố cục &middot; Mẹo phối cảnh &middot; Mây &middot; Đá &middot; Hình dáng cây', 'LO1, LO2, LO3, LO4, LO5', 'I, T', 'Bài 8.1'],
  [38, 'CHAPTER 4: LANDSCAPES<strong>Landscape</strong> &middot; Composition &middot; Perspective Tips &middot; Clouds &middot; Rocks &middot; Tree Shapes <em>(dính chữ nguyên văn FLM)</em>', 'CHƯƠNG 4: PHONG CẢNH — Landscape (nguyên văn FLM dính liền "LANDSCAPESLandscape") &middot; Bố cục &middot; Mẹo phối cảnh &middot; Mây &middot; Đá &middot; Hình dáng cây', 'LO1, LO2, LO3, LO4, LO5', 'IT', 'Bài 8.1'],
  [39, 'CHAPTER 4: LANDSCAPES<strong>Structures</strong> &middot; Mountains &middot; Deserts &middot; Creek with Rocks &middot; Sycamore Lane &middot; Half Dome, Yosemite <em>(dính chữ nguyên văn FLM)</em>', 'CHƯƠNG 4: PHONG CẢNH — Structures (nguyên văn FLM dính liền "LANDSCAPESStructures") &middot; Núi &middot; Sa mạc &middot; Suối có đá &middot; Con đường cây tiêu huyền &middot; Half Dome (Yosemite)', 'LO1, LO2, LO3, LO4, LO5', 'I, T', 'Bài 8.2'],
  [40, 'CHAPTER 4: LANDSCAPES<strong>Structures</strong> &middot; Mountains &middot; Deserts &middot; Creek with Rocks &middot; Sycamore Lane &middot; Half Dome, Yosemite <em>(dính chữ nguyên văn FLM)</em>', 'CHƯƠNG 4: PHONG CẢNH — Structures (nguyên văn FLM dính liền "LANDSCAPESStructures") &middot; Núi &middot; Sa mạc &middot; Suối có đá &middot; Con đường cây tiêu huyền &middot; Half Dome (Yosemite)', 'LO1, LO2, LO3, LO4, LO5', 'IT', 'Bài 8.2'],
  [41, 'Lab 7. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 1st version)', 'Lab 7. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 1)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.1 (Lab 7)'],
  [42, 'Lab 7. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 1st version)', 'Lab 7. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 1)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.1 (Lab 7)'],
  [43, 'Lab 8. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 8. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.2 (Lab 8)'],
  [44, 'Lab 8. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 8. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.2 (Lab 8)'],
  [45, 'Lab 8 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 8 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.2 (Lab 8)'],
  [46, 'Lab 8 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 8 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.2 (Lab 8)'],
  [47, 'Lab 8 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 8 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.2 (Lab 8)'],
  [48, 'Lab 8 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 8 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 9.2 (Lab 8)'],
  [49, 'CHAPTER 5: PEOPLE &middot; Adult Head &middot; Head Positions &middot; Eyes &middot; Noses &amp; Ears', 'CHƯƠNG 5: NGƯỜI &middot; Đầu người lớn &middot; Các góc đầu &middot; Mắt &middot; Mũi &amp; tai', 'LO1, LO2, LO3, LO4, LO5', 'I, T', 'Bài 10.1'],
  [50, 'CHAPTER 5: PEOPLE &middot; Adult Head &middot; Head Positions &middot; Eyes &middot; Noses &amp; Ears', 'CHƯƠNG 5: NGƯỜI &middot; Đầu người lớn &middot; Các góc đầu &middot; Mắt &middot; Mũi &amp; tai', 'LO1, LO2, LO3, LO4, LO5', 'IT', 'Bài 10.1'],
  [51, 'CHAPTER 5: PEOPLE &middot; Woman in Profile &middot; Man in Profile &middot; Girl in Profile &middot; Boy in Profile', 'CHƯƠNG 5: NGƯỜI &middot; Phụ nữ nhìn nghiêng &middot; Đàn ông nhìn nghiêng &middot; Bé gái nhìn nghiêng &middot; Bé trai nhìn nghiêng', 'LO1, LO2, LO3, LO4, LO5', 'I, T', 'Bài 10.2'],
  [52, 'CHAPTER 5: PEOPLE &middot; Woman in Profile &middot; Man in Profile &middot; Girl in Profile &middot; Boy in Profile', 'CHƯƠNG 5: NGƯỜI &middot; Phụ nữ nhìn nghiêng &middot; Đàn ông nhìn nghiêng &middot; Bé gái nhìn nghiêng &middot; Bé trai nhìn nghiêng', 'LO1, LO2, LO3, LO4, LO5', 'IT', 'Bài 10.2'],
  [53, 'Lab 9. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 1st version)', 'Lab 9. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 1)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.1 (Lab 9)'],
  [54, 'Lab 9. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 1st version)', 'Lab 9. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 1)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.1 (Lab 9)'],
  [55, 'Lab 10. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 10. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.2 (Lab 10)'],
  [56, 'Lab 10. Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 10. Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.2 (Lab 10)'],
  [57, 'Lab 10 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 10 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.2 (Lab 10)'],
  [58, 'Lab 10 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 10 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.2 (Lab 10)'],
  [59, 'Lab 10 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 10 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.2 (Lab 10)'],
  [60, 'Lab 10 (cont). Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 2nd version with line and doodle style as option)', 'Lab 10 (tiếp). Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)', 'LO2, LO3, LO4, LO5, LO6', 'TU', 'Bài 11.2 (Lab 10)'],
];
const rowHtml = (r) => '<tr><td>Buổi ' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td></tr>';
const buoiRowsHtml = buoiData.map(rowHtml).join('');
const buoiTableEn =
  '<table><tr><th>Session</th><th>Topic (English, verbatim FLM)</th><th>Chủ đề (Việt)</th><th>LO (FLM writes "LO", read as CLO)</th><th>ITU</th><th>Lesson on site</th></tr>' +
  buoiRowsHtml + '</table>';
const buoiTableVi =
  '<table><tr><th>Buổi</th><th>Chủ đề (Anh, nguyên văn FLM)</th><th>Chủ đề (Việt)</th><th>LO (FLM ghi "LO", hiểu là CLO)</th><th>ITU</th><th>Bài trên web</th></tr>' +
  buoiRowsHtml + '</table>';

const m05 = doc('drs102-0-5-ke-hoach-60-buoi', '0.5 — Full 60-session plan|||0.5 — Kế hoạch đủ 60 buổi',
  'Bảng đầy đủ 60 buổi FLM, giữ nguyên chủ đề tiếng Anh + cột tiếng Việt + cột "Bài trên web". Nêu rõ Chương 1 dạy ngắt quãng, cột ITU không nhất quán, buổi 37-40 dính chữ, và LỆCH LỚN giữa lý thuyết (động vật/phong cảnh/người) và 10 bài Lab (đều là khối/tĩnh vật).',
  [[
    '<span class="eyebrow">DRS102 · Section 0 · 0.5 · 60-session plan</span>' +
    '<h2>Full 60-session plan (FLM, verbatim topics)</h2>' +
    '<p class="lead">All 45 contact hours (60 sessions) exactly as scheduled by FLM. Chapter 1 (sessions 1-4 &amp; 13-14) is fully taught on this site; sessions 5-12 and 15-60 are a framework for now.</p>' +
    buoiTableEn +
    '<div class="callout warn"><span class="badge">⚠️ Chapter 1 is taught in two disconnected blocks</span><p>Items 1-6 of "CHAPTER 1: GETTING STARTED" run at sessions 1-4, then <strong>Lab 1 and Lab 2 are inserted</strong> at sessions 5-12, and only THEN does the plan return to items 7-9 of the SAME Chapter 1 at sessions 13-14. This is not an extraction error — FLM\'s own table is laid out this way.</p></div>' +
    '<div class="callout warn"><span class="badge">⚠️ Kept as FLM published it</span><p>The <strong>ITU</strong> column is highly inconsistent: the same idea is written as <code>IT</code>, <code>I, T</code>, <code>T,U</code>, <code>T, U</code> and <code>TU</code> across different rows, and <strong>session 6 is blank</strong>. Session 13-14 types "<strong>Begining</strong>" (should be "Beginning"). Sessions 37-40 run the chapter name into the first bullet with no separator: <strong>"LANDSCAPESLandscape"</strong> and <strong>"LANDSCAPESStructures"</strong>.</p></div>' +
    '<div class="callout danger"><span class="badge">⚠️⚠️ Biggest mismatch: theory vs. practice</span><p>Chapter 3 (sessions 25-28) teaches drawing <strong>ANIMALS</strong>, Chapter 4 (37-40) teaches <strong>LANDSCAPES</strong>, Chapter 5 (49-52) teaches <strong>PEOPLE</strong> — but ALL 10 Lab assignments (the only graded work in this course) are still <strong>cube/still-life drawings</strong>. Only Lab 5-6 add "with animals" and Lab 9-10 add "with masks" as a twist on a still-life; there is no Lab that is actually a landscape or a portrait. Even the course\'s own name is just "Form, Still-life". We report this gap exactly as FLM\'s table shows it — we do not invent a landscape or portrait Lab that does not exist.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13343 · thu thập 20/09/2026.</em></p>',
    '<span class="eyebrow">DRS102 · Mục 0 · 0.5 · Kế hoạch 60 buổi</span>' +
    '<h2>Kế hoạch đủ 60 buổi (nguyên văn chủ đề FLM)</h2>' +
    '<p class="lead">Đủ 45 giờ lên lớp (60 buổi) đúng như FLM xếp lịch. Chương 1 (buổi 1-4 &amp; 13-14) dạy đầy đủ trên web; buổi 5-12 và 15-60 hiện là khung.</p>' +
    buoiTableVi +
    '<div class="callout warn"><span class="badge">⚠️ Chương 1 dạy thành hai đợt rời nhau</span><p>Mục 1-6 của "CHƯƠNG 1: NHẬP MÔN" học ở buổi 1-4, rồi <strong>Lab 1 và Lab 2 chen vào</strong> ở buổi 5-12, và mãi sau đó kế hoạch mới quay lại mục 7-9 của CHÍNH Chương 1 ở buổi 13-14. Đây không phải lỗi khi trích xuất — bảng gốc của FLM xếp đúng như vậy.</p></div>' +
    '<div class="callout warn"><span class="badge">⚠️ Giữ nguyên như FLM công bố</span><p>Cột <strong>ITU</strong> cực kỳ không nhất quán: cùng một ý được viết thành <code>IT</code>, <code>I, T</code>, <code>T,U</code>, <code>T, U</code> và <code>TU</code> ở các dòng khác nhau, và <strong>buổi 6 để trống</strong>. Buổi 13-14 gõ "<strong>Begining</strong>" (đúng là "Beginning"). Buổi 37-40 dính tên chương vào mục đầu tiên, không có dấu ngắt: <strong>"LANDSCAPESLandscape"</strong> và <strong>"LANDSCAPESStructures"</strong>.</p></div>' +
    '<div class="callout danger"><span class="badge">⚠️⚠️ Lệch lớn nhất: lý thuyết khác thực hành</span><p>Chương 3 (buổi 25-28) dạy vẽ <strong>ĐỘNG VẬT</strong>, Chương 4 (37-40) dạy <strong>PHONG CẢNH</strong>, Chương 5 (49-52) dạy <strong>NGƯỜI</strong> — nhưng cả 10 đề bài Lab (phần thực hành duy nhất được chấm điểm của môn) vẫn là <strong>bài vẽ khối/tĩnh vật</strong>. Chỉ Lab 5-6 thêm "with animals" và Lab 9-10 thêm "with masks" như một biến tấu của tĩnh vật; không có Lab nào thực sự là phong cảnh hay chân dung. Ngay cả tên môn cũng chỉ ghi "Form, Still-life". Chúng tôi nêu đúng chỗ lệch này như bảng gốc của FLM cho thấy — không tự bịa ra một bài Lab phong cảnh hay chân dung không tồn tại.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13343 · thu thập 20/09/2026.</em></p>',
  ]]);

const m06 = doc('drs102-0-6-nhiem-vu-sinh-vien', '0.6 — Student tasks (7 items, verbatim)|||0.6 — Nhiệm vụ sinh viên (nguyên văn 7 gạch đầu dòng)',
  'Nguyên văn 7 nhiệm vụ sinh viên theo FLM (StudentTasks), kèm bản dịch — có yêu cầu nộp Portfolio tuần cuối. Nêu lại mâu thuẫn "final examination" đã nói ở mục 0.2.',
  [[
    `<span class="eyebrow">DRS102 · Section 0 · 0.6 · Student tasks</span>
<h2>Student tasks (FLM, verbatim)</h2>
<ol>
<li>Class attendance is strongly encouraged. Attend at least 80% of class hours in order to be accepted to the final examination</li>
<li>Actively participate in class activities</li>
<li>Fulfill tasks given by instructor after class</li>
<li>Use their own laptop in class only for learning purpose</li>
<li>Read the textbook in advance</li>
<li>Access the course website (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">https://flm.fpt.edu.vn</a>) for up-to-date information and material of the course.</li>
<li>Complete course's Portfolio with full contents of exercises and submit to the teacher the week before the end of the course.</li>
</ol>
<div class="callout danger"><span class="badge">⚠️ Same contradiction as 0.2</span> Item 1 says attendance is required "in order to be accepted to the <strong>final examination</strong>" even though this course has NO final exam (see 0.2) — leftover boilerplate wording, reported as published.</div>
<div class="callout"><span class="badge">Easy to miss</span> Item 7 — the <strong>Portfolio</strong> — is a separate deliverable from the 5 graded Lab pairs: it is the FULL collection of your exercises across the course, due the <strong>week before the course ends</strong> (roughly around session 59-60). Start keeping every drawing from session 1 onward; do not discard early exercises.</div>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
    `<span class="eyebrow">DRS102 · Mục 0 · 0.6 · Nhiệm vụ sinh viên</span>
<h2>Nhiệm vụ sinh viên (nguyên văn FLM, dịch)</h2>
<ol>
<li>Khuyến khích đi học đầy đủ. Dự tối thiểu 80% giờ học để đủ điều kiện dự thi cuối kỳ</li>
<li>Tham gia tích cực các hoạt động trong lớp</li>
<li>Hoàn thành nhiệm vụ giảng viên giao sau giờ học</li>
<li>Chỉ dùng laptop cá nhân trong lớp cho mục đích học tập</li>
<li>Đọc giáo trình trước</li>
<li>Truy cập trang môn học (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">https://flm.fpt.edu.vn</a>) để cập nhật thông tin &amp; tài liệu môn học.</li>
<li>Hoàn thành đầy đủ Portfolio của môn học với nội dung đủ các bài tập và nộp cho giảng viên vào tuần trước khi kết thúc môn.</li>
</ol>
<div class="callout danger"><span class="badge">⚠️ Cùng mâu thuẫn như mục 0.2</span> Mục 1 ghi việc dự lớp là để "đủ điều kiện dự <strong>thi cuối kỳ</strong>" dù môn này KHÔNG có thi cuối kỳ (xem 0.2) — câu chữ boilerplate còn sót lại, nêu đúng như trường công bố.</div>
<div class="callout"><span class="badge">Dễ bỏ sót</span> Mục 7 — <strong>Portfolio</strong> — là một sản phẩm nộp RIÊNG, tách khỏi 5 cặp Lab được chấm điểm: đây là bộ sưu tập ĐẦY ĐỦ mọi bài tập trong suốt môn, nộp vào <strong>tuần trước khi môn kết thúc</strong> (khoảng buổi 59-60). Hãy giữ lại mọi bài vẽ từ buổi 1, đừng vứt bài tập đầu.</div>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
  ]]);

const m07 = doc('drs102-0-7-cau-hoi-kien-tao', '0.7 — Constructive questions (20 questions, sessions 2-20 only)|||0.7 — Bảng câu hỏi kiến tạo (20 câu, chỉ phủ buổi 2-20)',
  'FLM có bảng 20 câu hỏi kiến tạo trải buổi 2 đến 20 — nguồn thu thập cho web chỉ trích được 4/20 câu (buổi 2, 19, 20); buổi 3-18 và buổi 21-60 KHÔNG có câu nào.',
  [[
    `<span class="eyebrow">DRS102 · Section 0 · 0.7 · Constructive questions</span>
<h2>Constructive questions (FLM)</h2>
<table>
<tr><th>#</th><th>Session</th><th>Name</th><th>Question (verbatim FLM)</th></tr>
<tr><td>1</td><td>2</td><td>QN1</td><td>Is Drawing Form - Still life the most fundamental subject for Graphic Design learners?</td></tr>
<tr><td>2</td><td>2</td><td>QN2</td><td>Why do we have to analyze the propotions of objects.</td></tr>
<tr><td>&hellip;</td><td>3-18</td><td>&hellip;</td><td><em>Not available — see gap note below.</em></td></tr>
<tr><td>19</td><td>19</td><td>QN1</td><td>How we define the value in the objects?</td></tr>
<tr><td>20</td><td>20</td><td>QN1</td><td>How to create the illusion of three dimensions into a two-dimensional space?</td></tr>
</table>
<div class="callout warn"><span class="badge">⚠️ Two separate gaps — both reported honestly</span>
<ul>
<li><strong>FLM's own table</strong> has 20 constructive questions but they only span <strong>sessions 2 through 20</strong> — the remaining 40 sessions (21-60) have no constructive question at all.</li>
<li><strong>Our source extract is itself incomplete</strong>: of those 20 questions, we could only capture <strong>4</strong> (session 2's two questions, and session 19-20's one question each). Questions for sessions 3 through 18 are simply not in the data we have — we are NOT inventing content for them.</li>
</ul></div>
<p><em>Note "propotions" in question 2 is FLM's own typo for "proportions" — kept verbatim.</em></p>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
    `<span class="eyebrow">DRS102 · Mục 0 · 0.7 · Câu hỏi kiến tạo</span>
<h2>Bảng câu hỏi kiến tạo (FLM)</h2>
<table>
<tr><th>#</th><th>Buổi</th><th>Tên</th><th>Câu hỏi (nguyên văn FLM)</th></tr>
<tr><td>1</td><td>2</td><td>QN1</td><td>Vẽ Khối - Tĩnh vật có phải là môn nền tảng nhất cho sinh viên Thiết kế đồ hoạ?</td></tr>
<tr><td>2</td><td>2</td><td>QN2</td><td>Vì sao ta phải phân tích tỉ lệ (proportions) của vật thể.</td></tr>
<tr><td>&hellip;</td><td>3-18</td><td>&hellip;</td><td><em>Không có dữ liệu — xem ghi chú khoảng trống bên dưới.</em></td></tr>
<tr><td>19</td><td>19</td><td>QN1</td><td>Ta định nghĩa sắc độ (value) trong vật thể như thế nào?</td></tr>
<tr><td>20</td><td>20</td><td>QN1</td><td>Làm sao tạo ảo giác ba chiều trong không gian hai chiều?</td></tr>
</table>
<div class="callout warn"><span class="badge">⚠️ Hai khoảng trống riêng biệt — nêu thẳng cả hai</span>
<ul>
<li><strong>Bảng gốc của FLM</strong> có 20 câu hỏi kiến tạo nhưng chỉ trải từ <strong>buổi 2 đến buổi 20</strong> — 40 buổi còn lại (21-60) không có câu hỏi kiến tạo nào.</li>
<li><strong>Nguồn trích cho web cũng thiếu</strong>: trong 20 câu đó, chỉ lấy được <strong>4</strong> câu (2 câu của buổi 2, và mỗi buổi 19-20 một câu). Câu hỏi của buổi 3 đến 18 KHÔNG có trong dữ liệu — chúng tôi KHÔNG tự bịa nội dung cho phần đó.</li>
</ul></div>
<p><em>Ghi chú: "propotions" trong câu 2 là lỗi gõ gốc của FLM (đúng là "proportions") — giữ nguyên văn.</em></p>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
  ]]);

const m04 = doc('drs102-0-0-tai-lieu', '0.4 — Course materials & tools (5 books)|||0.4 — Giáo trình & công cụ (5 sách)',
  'Đủ 5 giáo trình FLM dạng thẻ sách, KHÔNG sách nào có link (Is Online=False, Is Hard Copy=True). Sách chính khớp đúng 5 CHAPTER của kế hoạch buổi. Công cụ sinh viên tự mua, giữ nguyên lỗi gõ gốc.',
  [[
    `<span class="eyebrow">DRS102 · Section 0 · 0.4 · Materials &amp; tools</span>
<h2>Course materials &amp; tools</h2>
<p class="lead">All <strong>5</strong> official FLM materials for DRS102. The <strong>main material</strong> (Is Main Material = True) is <em>The Art of Basic Drawing</em>; the other four are reference books. <strong>All five are Is Online = False, Is Hard Copy = True</strong> — FLM does not give a link for ANY of them, so every card below is a paper-book card with no button.</p>
` + sachChinh + `
` + sachThamKhao1 + `
` + sachThamKhao2 + `
` + sachThamKhao3 + `
` + sachThamKhao4 + `
<div class="callout"><span class="badge">Why the main book matters</span> <em>The Art of Basic Drawing</em> has <strong>5 chapters that line up exactly with the 5 CHAPTERs in the 60-session plan</strong>: Getting Started → Still-life → Animals → Landscapes → People. It is the backbone of the whole course structure — see the full plan in 0.5.</div>
<div class="callout warn"><span class="badge">⚠️ FLM data quirk — kept as-is</span> Reference book #3 (<em>Exploring The Basics of Drawing</em>) has its ISBN field written as <strong>"ISBN-13: 978-1285184593 ISBN-10: 9781285184593"</strong> — both values glued into one cell, and the one labeled "ISBN-10" is actually a <strong>13-digit</strong> number, so that label is wrong. We show the correct ISBN-13 above and flag the mislabel here rather than silently "fixing" the source table.</div>
<h3>Tools (FLM, verbatim — students buy these themselves)</h3>
<ul>
<li>Paper (size A3). Sketching papper sheet (A3)</li>
<li>Color, pencil, eraser, brushes, back ink pen, artlines, markers</li>
<li>Paper knife, roll of paper tape,</li>
<li>Laptop</li>
<li>Drawing boad</li>
</ul>
<div class="callout warn"><span class="badge">⚠️ Typos in the raw FLM text — kept, not silently fixed</span> "<strong>Sketching papper sheet</strong>" (should be "paper"), "<strong>Drawing boad</strong>" (should be "board"), "<strong>back ink pen</strong>" (should be "black ink pen"). Shown exactly as FLM wrote them so you can match the original page; read them as paper, board and black ink pen.</div>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
    `<span class="eyebrow">DRS102 · Mục 0 · 0.4 · Giáo trình &amp; công cụ</span>
<h2>Giáo trình &amp; công cụ</h2>
<p class="lead">Đủ <strong>5</strong> tài liệu chính thức của FLM cho DRS102. Tài liệu <strong>chính</strong> (Is Main Material = True) là <em>The Art of Basic Drawing</em>; 4 tài liệu còn lại là sách tham khảo. <strong>Cả 5 đều Is Online = False, Is Hard Copy = True</strong> — FLM không cho link nào cả, nên mọi thẻ dưới đây là thẻ sách giấy, không có nút bấm.</p>
` + sachChinh + `
` + sachThamKhao1 + `
` + sachThamKhao2 + `
` + sachThamKhao3 + `
` + sachThamKhao4 + `
<div class="callout"><span class="badge">Vì sao sách chính quan trọng</span> <em>The Art of Basic Drawing</em> có <strong>5 chương khớp đúng 5 CHAPTER trong kế hoạch 60 buổi</strong>: Getting Started → Still-life → Animals → Landscapes → People. Đây là xương sống của toàn bộ cấu trúc môn — xem đủ bảng buổi ở mục 0.5.</div>
<div class="callout warn"><span class="badge">⚠️ FLM ghi vậy, giữ nguyên</span> Sách tham khảo #3 (<em>Exploring The Basics of Drawing</em>) có ô ISBN ghi <strong>"ISBN-13: 978-1285184593 ISBN-10: 9781285184593"</strong> — cả hai giá trị dán chung một ô, và giá trị dán nhãn "ISBN-10" thực ra là số <strong>13 chữ số</strong>, tức nhãn đó SAI. Ở trên chúng tôi hiển thị đúng ISBN-13 và nêu lỗi nhãn ở đây, không tự "sửa" âm thầm bảng gốc.</div>
<h3>Công cụ (nguyên văn FLM, dịch — sinh viên tự mua)</h3>
<ul>
<li>Giấy (khổ A3). Giấy sketch (A3)</li>
<li>Màu, bút chì, tẩy, cọ, bút mực đen, bút artline, marker</li>
<li>Dao rọc giấy, cuộn băng giấy,</li>
<li>Laptop</li>
<li>Bảng vẽ</li>
</ul>
<div class="callout warn"><span class="badge">⚠️ Lỗi gõ trong bản gốc FLM — giữ nguyên, không tự sửa lặng lẽ</span> "<strong>Sketching papper sheet</strong>" (đúng là "paper" - giấy), "<strong>Drawing boad</strong>" (đúng là "board" - bảng vẽ), "<strong>back ink pen</strong>" (đúng là "black ink pen" - bút mực đen). Giữ nguyên chữ FLM để đối chiếu trang gốc; hiểu là giấy, bảng vẽ và bút mực đen.</div>
<p><em>Nguồn: FLM · Syllabus 13343.</em></p>`,
  ]]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1-4 &amp; 13-14, trọn CHAPTER 1 GETTING STARTED).
// Dạy được ngay cho người CHƯA TỪNG VẼ: dụng cụ, kỹ thuật chì, luyện nét,
// phối cảnh, khởi động/ký hoạ, học cách nhìn & khối/sáng-tối. Kết chương
// bằng quiz.
// ─────────────────────────────────────────────────────────────────────────

const c11 = doc('drs102-1-1-basics', '1.1 — Tools & materials|||1.1 — Dụng cụ & vật liệu',
  'Buổi 1-2, CLO1/CLO2. Chì cứng/mềm 2H→6B khác nhau thế nào và dùng lúc nào; giấy A3 + giấy sketch A3; gôm; cách cầm bút — chọn công cụ nào cho việc gì, vì sao.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 1 · Lesson 1.1 · Session 1-2 · CLO1, CLO2</span>
<h2>Tools &amp; materials</h2>
<p class="lead">FLM topic (sessions 1-2): <em>"CHAPTER 1: GETTING STARTED — 1. Tools and Materials"</em>. After this lesson you can walk into the studio with the right pencil in your hand for the right job, instead of using one pencil for everything.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 1-2 — "CHAPTER 1: GETTING STARTED · 1. Tools and Materials".</p>
` + sachChinh + `
<h3>Graphite pencils: the H/B scale</h3>
<p>A pencil's grade tells you two things at once: how <strong>hard</strong> the graphite is, and how <strong>dark/soft</strong> the mark it makes is. <strong>H</strong> stands for hard (light grey, holds a fine point, does not smudge) and <strong>B</strong> stands for black/soft (dark, rich, smudges easily). The number in front says how far along that scale: 2H is harder/lighter than H; 6B is softer/darker than 2B.</p>
<table>
<tr><th>Grade</th><th>Feel</th><th>Use it for</th></tr>
<tr><td><strong>2H</strong></td><td>Hard, light grey, holds a fine point</td><td>Faint <strong>construction lines</strong> you will draw over later — they should barely show</td></tr>
<tr><td><strong>HB</strong></td><td>Middle: not too dark, not too light</td><td>General-purpose linework, most of a normal sketch</td></tr>
<tr><td><strong>2B</strong></td><td>Softer, darker, a bit smudge-prone</td><td>Confident contour lines once proportions are checked</td></tr>
<tr><td><strong>4B — 6B</strong></td><td>Very soft, very dark, smudges easily</td><td>The darkest shadows and accents (use sparingly, near the end)</td></tr>
</table>
<div class="callout"><span class="badge">Why this matters</span> Using only ONE pencil (usually HB) for an entire drawing is the #1 reason beginner drawings look flat — every mark ends up the same weight. A set from 2H to 6B lets your construction lines stay invisible while your finishing lines stay bold.</div>
<h3>Paper (FLM Tools list)</h3>
<p>FLM's own tools list (see 0.4) specifies <strong>A3 paper</strong> for finished exercises and a separate <strong>A3 sketching paper</strong> pad for warm-ups and rough studies. Keep them separate: sketching paper is thinner and rougher (fine for quick throwaway marks), while your A3 drawing paper should be smoother and slightly heavier so it survives erasing and blending without pilling.</p>
<h3>Eraser: two kinds, two jobs</h3>
<table>
<tr><th>Eraser</th><th>How it works</th><th>Use it for</th></tr>
<tr><td><strong>Kneaded eraser</strong></td><td>Soft, mouldable putty — you dab or roll it, it lifts graphite without friction</td><td><strong>Lightening</strong> a tone (lifting a highlight out of shaded graphite) without leaving a hard edge</td></tr>
<tr><td><strong>Plastic/vinyl eraser</strong></td><td>Firm, erases by friction</td><td>Fully <strong>removing</strong> a line — cleaning up a construction line once you no longer need it</td></tr>
</table>
<h3>How to hold the pencil</h3>
<p>Do not use the tight <strong>writing grip</strong> (the way you hold a pen to write words) for the whole drawing. For the early, loose stages, use the <strong>overhand grip</strong>: rest the pencil across your palm with your fingers loosely over the top, and move your whole arm from the shoulder, not just your fingers. This produces longer, looser, more consistent lines — exactly what construction lines need. Switch back to the writing grip only when you reach small, precise final details.</p>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Dùng đúng một cây HB từ đầu đến cuối bài — không có construction line mờ, không có nét đậm chốt, tranh phẳng lì. Cầm bút kiểu viết chữ ngay từ nét dựng đầu tiên — tay bị khoá ở cổ tay, nét ngắn, cứng, khó chỉnh tỉ lệ lớn. Dùng gôm nhựa cứng để "làm sáng nhẹ" một vùng — nó xoá trắng bệt một mảng thay vì làm sáng mềm mại như gôm dẻo.</div>
<h3>Exercise — bài tự luyện</h3>
<p><strong>Task:</strong> On one A3 sheet, draw 4 boxes side by side, one per pencil grade you own (e.g. 2H, HB, 2B, 6B). In each box, fill a small square using the SAME light, even pressure. Compare how the four squares look — this is your personal reference for how each pencil behaves before you start drawing anything real.</p>
<p><strong>Self-check:</strong> Your 2H square should look pale grey and even; your 6B square should look noticeably darker and richer even with light pressure. If your HB and 2B squares look almost identical, you are probably pressing too hard on the HB — ease off and let the grade do the work.</p>`,
    `<span class="eyebrow">DRS102 · Chương 1 · Bài 1.1 · Buổi 1-2 · CLO1, CLO2</span>
<h2>Dụng cụ &amp; vật liệu</h2>
<p class="lead">Chủ đề FLM (buổi 1-2): <em>"CHAPTER 1: GETTING STARTED — 1. Tools and Materials"</em>. Học xong bài này, bạn cầm đúng cây bút cho đúng việc khi vào xưởng vẽ, thay vì dùng một cây cho tất cả.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 1-2 — "CHAPTER 1: GETTING STARTED · 1. Tools and Materials".</p>
` + sachChinh + `
<h3>Chì graphite: thang đo H/B</h3>
<p>Độ (grade) của một cây chì nói lên hai điều cùng lúc: lõi <strong>cứng</strong> tới đâu, và nét vẽ ra <strong>đậm/mềm</strong> tới đâu. <strong>H</strong> là hard (cứng, xám nhạt, giữ đầu nhọn lâu, không lem) và <strong>B</strong> là black/soft (mềm, đậm, dễ lem). Số đứng trước cho biết đi xa tới đâu trên thang đó: 2H cứng/nhạt hơn H; 6B mềm/đậm hơn 2B.</p>
<table>
<tr><th>Độ</th><th>Cảm giác</th><th>Dùng cho</th></tr>
<tr><td><strong>2H</strong></td><td>Cứng, xám nhạt, giữ đầu nhọn tốt</td><td><strong>Nét dựng</strong> mờ mà sau này bạn sẽ đè nét khác lên trên — gần như không thấy</td></tr>
<tr><td><strong>HB</strong></td><td>Giữa: không quá đậm, không quá nhạt</td><td>Nét chung cho phần lớn bài phác</td></tr>
<tr><td><strong>2B</strong></td><td>Mềm hơn, đậm hơn, hơi dễ lem</td><td>Nét viền chắc chắn sau khi tỉ lệ đã kiểm tra xong</td></tr>
<tr><td><strong>4B — 6B</strong></td><td>Rất mềm, rất đậm, dễ lem</td><td>Bóng tối nhất và điểm nhấn (dùng vừa phải, gần cuối bài)</td></tr>
</table>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Chỉ dùng MỘT cây bút (thường là HB) cho cả bài là lý do số một khiến tranh người mới trông dẹt — mọi nét cùng một độ đậm. Một bộ từ 2H tới 6B giúp nét dựng luôn vô hình còn nét hoàn thiện luôn nổi bật.</div>
<h3>Giấy (theo danh sách Tools của FLM)</h3>
<p>Danh sách công cụ của FLM (xem mục 0.4) ghi rõ <strong>giấy A3</strong> cho bài hoàn thiện và một tập <strong>giấy sketch A3</strong> riêng cho khởi động &amp; phác thô. Giữ hai loại riêng biệt: giấy sketch mỏng, nhám hơn (hợp cho nét nhanh, bỏ đi được), còn giấy vẽ A3 nên mịn và hơi dày hơn để chịu được tẩy và di chì mà không bị xù mặt giấy.</p>
<h3>Gôm: hai loại, hai việc</h3>
<table>
<tr><th>Gôm</th><th>Cách hoạt động</th><th>Dùng cho</th></tr>
<tr><td><strong>Gôm dẻo (kneaded)</strong></td><td>Mềm, nặn được — chấm hoặc lăn để hút chì ra, không ma sát</td><td><strong>Làm sáng</strong> một sắc độ (nhấc highlight ra khỏi vùng đã tô) mà không để lại cạnh cứng</td></tr>
<tr><td><strong>Gôm nhựa/vinyl</strong></td><td>Cứng, xoá bằng ma sát</td><td><strong>Xoá hẳn</strong> một nét — dọn nét dựng khi không còn cần nữa</td></tr>
</table>
<h3>Cách cầm bút</h3>
<p>Đừng dùng <strong>kiểu cầm viết</strong> (cách cầm bút viết chữ) cho cả bài. Ở giai đoạn đầu, lỏng tay, dùng <strong>kiểu cầm ngửa (overhand)</strong>: đặt bút vắt qua lòng bàn tay, các ngón đặt lỏng lên trên, và di chuyển cả cánh tay từ vai, không chỉ ngón tay. Cách này cho nét dài hơn, lỏng hơn, đều hơn — đúng thứ nét dựng cần. Chỉ đổi lại kiểu cầm viết khi vào chi tiết nhỏ, chính xác cuối bài.</p>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Dùng đúng một cây HB từ đầu đến cuối — không có nét dựng mờ, không có nét chốt đậm, tranh phẳng lì. Cầm kiểu viết chữ ngay từ nét dựng đầu — tay bị khoá ở cổ tay, nét ngắn, cứng, khó chỉnh tỉ lệ lớn. Dùng gôm nhựa cứng để "làm sáng nhẹ" một vùng — nó xoá trắng bệt cả mảng thay vì làm sáng mềm như gôm dẻo.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Trên một tờ A3, vẽ 4 ô vuông cạnh nhau, mỗi ô một độ chì bạn có (vd 2H, HB, 2B, 6B). Trong mỗi ô, tô kín một hình vuông nhỏ bằng CÙNG một lực tay nhẹ, đều. So sánh 4 ô — đây là bảng tham chiếu riêng của bạn về cách mỗi cây chì hành xử, trước khi vẽ bất kỳ thứ gì thật.</p>
<p><strong>Tự chấm:</strong> Ô 2H phải trông xám nhạt, đều. Ô 6B phải rõ ràng đậm và giàu hơn dù tay nhẹ như nhau. Nếu ô HB và 2B trông gần giống nhau, có thể bạn đang ấn tay quá mạnh ở HB — nhẹ tay lại để độ chì tự thể hiện.</p>`,
  ]]);

const c12 = doc('drs102-1-2-ky-thuat-chi-luyen-net', '1.2 — Basic pencil techniques & practicing lines|||1.2 — Kỹ thuật chì cơ bản & luyện nét',
  'Buổi 1-2, CLO1/CLO2. Hatching, cross-hatching, blending, stippling; bài luyện nét cụ thể (đường thẳng, đường cong, dải sắc độ) trước khi vẽ vật thể thật.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 1 · Lesson 1.2 · Session 1-2 · CLO1, CLO2</span>
<h2>Basic pencil techniques &amp; practicing lines</h2>
<p class="lead">FLM topic (sessions 1-2): <em>"2. Basic Pencil Techniques"</em> and <em>"3. Practicing Lines"</em>. This is your "handwriting" as an artist — the four marks below are the entire vocabulary you will use to build every value in this course.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 1-2 — "2. Basic Pencil Techniques · 3. Practicing Lines".</p>
<h3>The four basic marks</h3>
<table>
<tr><th>Technique</th><th>How</th><th>Result</th></tr>
<tr><td><strong>Hatching</strong></td><td>Parallel lines, same direction</td><td>Even tone; closer/darker lines = darker tone</td></tr>
<tr><td><strong>Cross-hatching</strong></td><td>A second layer of parallel lines crossing the first at an angle</td><td>Darker tone than hatching alone, with visible texture</td></tr>
<tr><td><strong>Blending</strong></td><td>Smooth hatching with a stump, tissue or finger</td><td>Smooth gradient, no visible lines — use sparingly</td></tr>
<tr><td><strong>Stippling</strong></td><td>Many small dots, denser = darker</td><td>Grainy, even texture; slow but very controllable</td></tr>
</table>
<div class="callout"><span class="badge">A rule that saves every drawing</span> Vary your line <strong>pressure</strong>, not just your pencil grade: press harder for edges that are near you or in shadow, lift the pencil for edges that are far away or catching light. A line of constant weight all the way around an object is the single fastest way to make it look flat and cut-out.</div>
<h3>Practicing lines — do this before drawing anything real</h3>
<ol>
<li><strong>Straight lines from the shoulder</strong>: draw a series of horizontal lines, moving your whole arm (not just the wrist), aiming for one confident stroke rather than several short scratchy ones.</li>
<li><strong>Long curves</strong>: draw sweeping arcs and full circles the same way — from the shoulder, in one motion.</li>
<li><strong>Value ladder</strong>: draw 5 boxes in a row; fill them from lightest to darkest using ONLY hatching (no blending) by changing line spacing and pressure, not pencil grade.</li>
</ol>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Vẽ nét bằng nhiều đoạn ngắn, chồng lên nhau ("nét lông gà") thay vì một nét dài, tự tin. Blend mọi thứ ngay từ đầu — bài mất kết cấu, trông như ảnh mờ chứ không phải bản vẽ. Cross-hatch với góc quá gần với lớp đầu (gần như song song) — không tăng được độ đậm rõ rệt.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> Fill an A3 sheet with: 20 straight lines drawn from the shoulder (no ruler), 20 full circles, and a 5-box value ladder from lightest to darkest using hatching only. Then, on a second area, cross-hatch a single square as dark as you can without blending.</p>
<p><strong>Self-check:</strong> Your 20 lines should look mostly straight and confident, not shaky or made of multiple overlapping strokes. Your value ladder's 5 boxes should be clearly distinguishable from each other when you squint at them from across the room — if two boxes look the same, widen the pressure/spacing gap between them.</p>`,
    `<span class="eyebrow">DRS102 · Chương 1 · Bài 1.2 · Buổi 1-2 · CLO1, CLO2</span>
<h2>Kỹ thuật chì cơ bản &amp; luyện nét</h2>
<p class="lead">Chủ đề FLM (buổi 1-2): <em>"2. Basic Pencil Techniques"</em> và <em>"3. Practicing Lines"</em>. Đây là "chữ viết tay" của một người vẽ — bốn kiểu nét dưới đây là toàn bộ "từ vựng" bạn sẽ dùng để dựng mọi sắc độ trong suốt môn.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 1-2 — "2. Basic Pencil Techniques · 3. Practicing Lines".</p>
<h3>Bốn kiểu nét cơ bản</h3>
<table>
<tr><th>Kỹ thuật</th><th>Cách làm</th><th>Kết quả</th></tr>
<tr><td><strong>Hatching (đánh nét song song)</strong></td><td>Các nét song song, cùng hướng</td><td>Sắc độ đều; nét càng khít/đậm thì tông càng tối</td></tr>
<tr><td><strong>Cross-hatching (đánh chéo)</strong></td><td>Thêm lớp nét song song thứ hai bắt chéo lớp đầu</td><td>Tối hơn hatching đơn, có kết cấu rõ</td></tr>
<tr><td><strong>Blending (di chì)</strong></td><td>Làm mượt hatching bằng cây di, khăn giấy hoặc ngón tay</td><td>Chuyển mượt, không thấy nét — dùng vừa phải</td></tr>
<tr><td><strong>Stippling (chấm điểm)</strong></td><td>Nhiều chấm nhỏ, càng dày càng tối</td><td>Kết cấu hạt, đều; chậm nhưng dễ kiểm soát</td></tr>
</table>
<div class="callout"><span class="badge">Quy tắc cứu mọi bài vẽ</span> Thay đổi <strong>lực tay</strong> của nét, không chỉ đổi độ chì: nhấn mạnh cho cạnh gần bạn hoặc trong bóng, nhấc nhẹ cho cạnh xa hoặc bắt sáng. Một nét đều tăm tắp quanh toàn bộ vật thể là cách nhanh nhất khiến nó trông dẹt và như bị cắt dán.</div>
<h3>Luyện nét — làm trước khi vẽ vật thật</h3>
<ol>
<li><strong>Đường thẳng từ vai</strong>: vẽ một loạt đường ngang, di chuyển cả cánh tay (không chỉ cổ tay), nhắm tới một nét tự tin thay vì nhiều nét ngắn lởm chởm.</li>
<li><strong>Đường cong dài</strong>: vẽ các cung và vòng tròn trọn vẹn theo cách tương tự — từ vai, một động tác.</li>
<li><strong>Thang sắc độ</strong>: vẽ 5 ô liền nhau; tô từ nhạt nhất tới đậm nhất CHỈ bằng hatching (không blend) bằng cách đổi khoảng cách nét và lực tay, không đổi độ chì.</li>
</ol>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Vẽ nét bằng nhiều đoạn ngắn chồng lên nhau ("nét lông gà") thay vì một nét dài, tự tin. Blend mọi thứ ngay từ đầu — bài mất kết cấu, trông như ảnh mờ chứ không phải bản vẽ. Cross-hatch với góc quá gần lớp đầu (gần như song song) — không tăng được độ đậm rõ rệt.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Kín một tờ A3 với: 20 đường thẳng vẽ từ vai (không dùng thước), 20 vòng tròn trọn vẹn, và một thang 5 ô từ nhạt tới đậm chỉ bằng hatching. Sau đó, ở một chỗ khác, cross-hatch một ô vuông đậm nhất có thể mà không blend.</p>
<p><strong>Tự chấm:</strong> 20 đường của bạn phải trông thẳng và tự tin, không run hay ghép từ nhiều nét chồng. 5 ô thang sắc độ phải phân biệt rõ khi nheo mắt nhìn từ xa — nếu hai ô giống nhau, nới rộng khoảng cách nét/lực tay giữa chúng.</p>`,
  ]]);

const c13 = doc('drs102-1-3-luat-xa-gan', '1.3 — Perspective|||1.3 — Luật xa gần (phối cảnh)',
  'Buổi 3-4, CLO2/CLO3. Đường tầm mắt, một điểm tụ, hai điểm tụ; ví dụ dựng hình khối lập phương từng bước theo cả 1 và 2 điểm tụ.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 1 · Lesson 1.3 · Session 3-4 · CLO2, CLO3</span>
<h2>Perspective</h2>
<p class="lead">FLM topic (sessions 3-4): <em>"4. Perspective"</em>. This lesson gives you the two anchors that make any box, table or room look like it recedes into real space instead of floating flat on the page.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 3-4 — "4. Perspective".</p>
<h3>The two anchors: horizon line &amp; vanishing point</h3>
<p>The <strong>horizon line</strong> is always at your own <em>eye level</em> — not the middle of the page, your actual eye height relative to the object. Parallel edges that recede away from you appear to converge and meet at a <strong>vanishing point (VP)</strong> sitting on that horizon line.</p>
<h3>One-point perspective — step by step</h3>
<ol>
<li>Draw a horizon line and mark one vanishing point (VP) on it.</li>
<li>Draw the front face of the cube as a flat square — none of its edges recede yet.</li>
<li>From each of the 4 corners of that square, draw a faint line back to the VP — these are your depth guides.</li>
<li>Pick a point along each depth guide to mark how deep the cube goes, then connect those 4 points to form the back face (parallel to the front face).</li>
</ol>
<pre><code>Front face      Depth guides -> VP        Finished cube (1-point)
 _____                . VP                 _____
|     |          _____/                   |     |__
|     |    ->   |     |/           ->     |     |  |
|_____|         |_____|                   |_____|__|
</code></pre>
<h3>Two-point perspective — step by step</h3>
<ol>
<li>Draw a horizon line and mark TWO vanishing points, one on the far left and one on the far right.</li>
<li>Draw a single vertical line — this is the cube's nearest corner, facing you.</li>
<li>From the top and bottom of that vertical line, draw two faint lines to the LEFT vanishing point, and two more to the RIGHT vanishing point.</li>
<li>Add a second vertical line on each side to close the two visible side faces, where each side "feels" right in depth.</li>
</ol>
<div class="callout"><span class="badge">1-point vs 2-point — when to use which</span> Use <strong>1-point</strong> when you (or the object) face something straight-on — a box seen dead ahead, a corridor. Use <strong>2-point</strong> when you see an object by its corner, at an angle — this is the default for most still-life set-ups in this course, since objects are rarely lined up dead square to your eye.</div>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Đặt VP quá gần vật thể — các cạnh hội tụ gấp khúc, khối trông méo như ống kính mắt cá. Quên rằng CẢ mọi vật trong cùng cảnh phải dùng chung MỘT đường tầm mắt — vẽ mỗi vật với đường chân trời riêng làm cả bố cục lệch pha. Vẽ cạnh sau to bằng cạnh trước — quên rằng vật càng xa càng nhỏ.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> On one A3 sheet, draw a horizon line with one VP and build a cube in 1-point perspective following the steps above. On a second area, draw a horizon line with two VPs (left and right, spread wide) and build the same cube in 2-point perspective.</p>
<p><strong>Self-check:</strong> Extend your depth-guide lines with a ruler (lightly) — they should all actually meet at your marked VP(s). If they cross each other at random points instead of converging at one spot, your perspective lines were not drawn toward the VP carefully enough.</p>`,
    `<span class="eyebrow">DRS102 · Chương 1 · Bài 1.3 · Buổi 3-4 · CLO2, CLO3</span>
<h2>Luật xa gần (phối cảnh)</h2>
<p class="lead">Chủ đề FLM (buổi 3-4): <em>"4. Perspective"</em>. Bài này cho bạn hai mốc giúp bất kỳ hộp, bàn hay căn phòng nào trông như lùi vào không gian thật, thay vì nổi phẳng trên mặt giấy.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 3-4 — "4. Perspective".</p>
<h3>Hai mốc: đường tầm mắt &amp; điểm tụ</h3>
<p><strong>Đường tầm mắt (horizon line)</strong> luôn nằm ở <em>tầm mắt của chính bạn</em> — không phải giữa tờ giấy, mà đúng chiều cao mắt bạn so với vật thể. Các cạnh song song lùi ra xa trông như hội tụ và gặp nhau tại một <strong>điểm tụ (VP)</strong> nằm trên đường đó.</p>
<h3>Phối cảnh 1 điểm tụ — từng bước</h3>
<ol>
<li>Vẽ một đường tầm mắt và đánh dấu một điểm tụ (VP) trên đó.</li>
<li>Vẽ mặt trước khối lập phương như một hình vuông phẳng — chưa cạnh nào lùi cả.</li>
<li>Từ mỗi 4 góc của hình vuông đó, vẽ một nét mờ về VP — đây là các đường dẫn chiều sâu.</li>
<li>Chọn một điểm trên mỗi đường dẫn để đánh dấu khối sâu bao nhiêu, rồi nối 4 điểm đó thành mặt sau (song song với mặt trước).</li>
</ol>
<pre><code>Mặt trước       Đường dẫn -> VP           Khối hoàn chỉnh (1 điểm tụ)
 _____                . VP                 _____
|     |          _____/                   |     |__
|     |    ->   |     |/           ->     |     |  |
|_____|         |_____|                   |_____|__|
</code></pre>
<h3>Phối cảnh 2 điểm tụ — từng bước</h3>
<ol>
<li>Vẽ một đường tầm mắt và đánh dấu HAI điểm tụ, một bên trái ngoài xa, một bên phải ngoài xa.</li>
<li>Vẽ một đường thẳng đứng duy nhất — đây là góc gần nhất của khối, hướng thẳng về bạn.</li>
<li>Từ đỉnh và đáy đường đó, vẽ hai nét mờ về điểm tụ TRÁI, và hai nét nữa về điểm tụ PHẢI.</li>
<li>Thêm một đường thẳng đứng thứ hai ở mỗi bên để khép hai mặt bên đang thấy, ở chỗ mỗi bên "cảm thấy" đúng độ sâu.</li>
</ol>
<div class="callout"><span class="badge">1 điểm hay 2 điểm — dùng khi nào</span> Dùng <strong>1 điểm tụ</strong> khi bạn (hoặc vật) nhìn thẳng mặt — hộp nhìn chính diện, hành lang. Dùng <strong>2 điểm tụ</strong> khi bạn nhìn vật theo góc cạnh — đây là mặc định cho hầu hết bố cục tĩnh vật trong môn này, vì vật hiếm khi xếp thẳng chính diện với mắt bạn.</div>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Đặt VP quá gần vật thể — các cạnh hội tụ gấp khúc, khối trông méo như ống kính mắt cá. Quên rằng MỌI vật trong cùng một cảnh phải dùng chung MỘT đường tầm mắt — vẽ mỗi vật với đường chân trời riêng làm cả bố cục lệch pha. Vẽ cạnh sau to bằng cạnh trước — quên rằng vật càng xa càng nhỏ.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Trên một tờ A3, vẽ một đường tầm mắt với một VP và dựng một khối lập phương theo phối cảnh 1 điểm tụ theo các bước trên. Ở một chỗ khác, vẽ đường tầm mắt với hai VP (trái và phải, đặt xa nhau) và dựng cùng khối đó theo 2 điểm tụ.</p>
<p><strong>Tự chấm:</strong> Kéo dài các đường dẫn chiều sâu bằng thước (nét mờ) — chúng phải thực sự gặp nhau tại (các) VP bạn đã đánh dấu. Nếu chúng cắt nhau lung tung thay vì hội tụ về một điểm, có nghĩa các đường phối cảnh chưa được vẽ hướng đúng về VP.</p>`,
  ]]);

const c14 = doc('drs102-1-4-khoi-dong-ky-hoa', '1.4 — Warming up & sketching|||1.4 — Khởi động & ký hoạ',
  'Buổi 3-4, CLO2/CLO3. Warm-up trước khi vào bài chính; ký hoạ nhanh (gesture/quick sketch) để nắm hình tổng trước khi vào chi tiết.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 1 · Lesson 1.4 · Session 3-4 · CLO2, CLO3</span>
<h2>Warming up &amp; sketching</h2>
<p class="lead">FLM topic (sessions 3-4): <em>"5. Warming Up"</em> and <em>"6. Sketching"</em>. A 5-minute warm-up before every studio session and a fast rough sketch before every finished drawing — together these two habits prevent the two most common failure modes: a stiff hand and a wrong overall shape discovered too late.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 3-4 — "5. Warming Up · 6. Sketching".</p>
<h3>Warming up — loosen the hand before you commit to a real drawing</h3>
<ul>
<li>1-2 minutes of large scribbles and loose circles, moving from the shoulder, no aim except loosening up.</li>
<li>A page of quick 15-30 second gesture sketches of anything nearby (a bag, a shoe, your own hand) — the goal is speed and looseness, not accuracy.</li>
<li>Repeat your value ladder from Lesson 1.2 once — it re-calibrates your hand's pressure control for the day.</li>
</ul>
<h3>Sketching — capture the whole before the parts</h3>
<p>A "sketch" here means a fast, rough drawing (often under 2-5 minutes) whose only job is to nail the big proportions, the overall silhouette, and the placement on the page — BEFORE you spend an hour on a finished piece that turns out to be in the wrong place or the wrong overall shape.</p>
<table>
<tr><th>Sketch</th><th>Finished drawing</th></tr>
<tr><td>Minutes, not hours</td><td>Longer session</td></tr>
<tr><td>Big shapes and proportions only</td><td>Full value range, edges, detail</td></tr>
<tr><td>Mistakes are cheap — redo it</td><td>Mistakes are expensive — build on a checked sketch</td></tr>
</table>
<div class="callout"><span class="badge">Why this matters for the Labs ahead</span> Every Lab in this course (Lab 1 onward, see Chapters 2+) is a timed studio session on real A3 paper. A student who sketches the composition small and fast BEFORE committing to the full-size drawing almost always finishes with a stronger, better-proportioned piece than one who starts full-size immediately.</div>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Bỏ qua khởi động, vào bài chính ngay khi tay còn "cứng" — nét đầu bài run, thiếu tự tin. Vẽ sketch quá lâu, quá chi tiết — mất hết lợi ích "nhanh, rẻ" của một bản phác. Không đối chiếu sketch với tỉ lệ thật của mẫu trước khi phóng to lên bài chính — sai từ sketch bị phóng to theo.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> Do a 2-minute warm-up (scribbles + one gesture sketch), then do 4 separate 1-minute "thumbnail" sketches of the same object from your desk, changing where it sits on the small page each time (centered, off to one side, cropped close, small and distant).</p>
<p><strong>Self-check:</strong> Look at your 4 thumbnails side by side — can you tell which one you'd want to develop into a full drawing, and say WHY in one sentence (better balance, more interesting crop)? If all 4 look identical, you were not varying the placement enough.</p>`,
    `<span class="eyebrow">DRS102 · Chương 1 · Bài 1.4 · Buổi 3-4 · CLO2, CLO3</span>
<h2>Khởi động &amp; ký hoạ</h2>
<p class="lead">Chủ đề FLM (buổi 3-4): <em>"5. Warming Up"</em> và <em>"6. Sketching"</em>. Khởi động 5 phút trước mỗi buổi xưởng và một bản ký hoạ nhanh trước mỗi bài hoàn thiện — hai thói quen này ngăn hai lỗi phổ biến nhất: tay cứng và sai hình tổng phát hiện quá muộn.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 3-4 — "5. Warming Up · 6. Sketching".</p>
<h3>Khởi động — làm mềm tay trước khi vào bài thật</h3>
<ul>
<li>1-2 phút nguệch ngoạc và vòng tròn lỏng tay, di chuyển từ vai, không nhắm mục tiêu nào ngoài việc làm mềm cổ tay.</li>
<li>Một trang ký hoạ nhanh 15-30 giây bất kỳ vật gì gần đó (túi xách, giày, chính bàn tay bạn) — mục tiêu là tốc độ và sự lỏng tay, không phải chính xác.</li>
<li>Lặp lại thang sắc độ ở Bài 1.2 một lượt — giúp hiệu chỉnh lại lực tay cho cả buổi.</li>
</ul>
<h3>Ký hoạ — nắm cái tổng thể trước cái chi tiết</h3>
<p>"Ký hoạ" (sketch) ở đây nghĩa là một bản vẽ nhanh, thô (thường dưới 2-5 phút) chỉ có một nhiệm vụ: chốt đúng tỉ lệ lớn, bóng dáng tổng thể, và vị trí trên trang giấy — TRƯỚC khi bạn dành cả tiếng cho một bài hoàn chỉnh mà cuối cùng lại sai vị trí hoặc sai hình tổng.</p>
<table>
<tr><th>Ký hoạ (sketch)</th><th>Bài hoàn chỉnh</th></tr>
<tr><td>Vài phút, không phải hàng giờ</td><td>Buổi dài hơn</td></tr>
<tr><td>Chỉ hình lớn &amp; tỉ lệ</td><td>Đủ dải sắc độ, cạnh, chi tiết</td></tr>
<tr><td>Sai thì bỏ, vẽ lại — rẻ</td><td>Sai thì tốn — nên dựng trên một sketch đã kiểm tra</td></tr>
</table>
<div class="callout"><span class="badge">Vì sao quan trọng cho các bài Lab sắp tới</span> Mọi bài Lab trong môn (Lab 1 trở đi, xem Chương 2+) là một buổi vẽ có tính giờ trên giấy A3 thật. Sinh viên phác bố cục nhỏ và nhanh TRƯỚC khi vẽ cỡ thật gần như luôn ra bài mạnh hơn, tỉ lệ đúng hơn so với người vào cỡ thật ngay.</div>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp.</strong> Bỏ qua khởi động, vào bài chính ngay khi tay còn "cứng" — nét đầu bài run, thiếu tự tin. Vẽ sketch quá lâu, quá chi tiết — mất hết lợi ích "nhanh, rẻ" của một bản phác. Không đối chiếu sketch với tỉ lệ thật của mẫu trước khi phóng to lên bài chính — sai từ sketch bị phóng to theo.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Khởi động 2 phút (nguệch ngoạc + một ký hoạ gesture), rồi làm 4 bản "thumbnail" 1 phút riêng biệt của cùng một vật trên bàn bạn, mỗi lần đổi vị trí nó nằm trên trang nhỏ (giữa, lệch một bên, cắt sát, nhỏ và xa).</p>
<p><strong>Tự chấm:</strong> Nhìn 4 thumbnail cạnh nhau — bạn có chỉ ra được bản nào muốn phát triển thành bài hoàn chỉnh, và nói được VÌ SAO trong một câu (cân bằng tốt hơn, khung cắt thú vị hơn) không? Nếu cả 4 trông giống hệt nhau, bạn chưa đổi vị trí đủ nhiều.</p>`,
  ]]);

const c15 = doc('drs102-1-5-hoc-cach-nhin-va-khoi', '1.5 — Learning to see, basic shapes & developing form|||1.5 — Học cách nhìn, hình cơ bản & phát triển khối',
  'Buổi 13-14, CLO1/CLO2/CLO3. Quy mọi vật về khối cầu/trụ/hộp/nón; tương quan vật thể & nguồn sáng — highlight, vùng tối, bóng đổ, ánh sáng phản chiếu (CLO3, phần khó nhất của môn).',
  [[
    `<span class="eyebrow">DRS102 · Chapter 1 · Lesson 1.5 · Session 13-14 · CLO1, CLO2, CLO3</span>
<h2>Learning to see, basic shapes &amp; developing form</h2>
<p class="lead">FLM topic (sessions 13-14): <em>"7. Learning to See · 8. Begining with Basic Shapes · 9. Developing Form"</em> (FLM's own spelling: "Begining"). This closes Chapter 1 and is the hardest, most important idea in the whole course: turning a flat outline into something that reads as solid, lit form.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 13-14 — "CHAPTER 1: GETTING STARTED · 7. Learning to See · 8. Begining with Basic Shapes · 9. Developing Form" (bản gốc gõ "Begining").</p>
` + sachChinh + `
<h3>Part 1 — Learning to see: symbols vs. observation</h3>
<p>Beginners draw <em>symbols</em> — mental shortcuts like "an apple is a circle" — instead of what is actually in front of them. The fix is a deliberate habit: look at the real object far more than you look at your paper, and draw the edge you are ACTUALLY seeing at that moment, not the edge you remember an object like this "should" have.</p>
<h3>Part 2 — Basic shapes: everything reduces to 4 solids</h3>
<p>Almost any object can be understood as a combination of four <strong>primitive solids</strong>: the <strong>sphere</strong>, the <strong>cylinder</strong>, the <strong>cube/box</strong> and the <strong>cone</strong>. A mug is a cylinder; an apple is close to a sphere; a bottle is a cylinder plus a cone plus a smaller cylinder. Before drawing any real object, mentally reduce it to these solids first.</p>
<table>
<tr><th>Solid</th><th>How to draw it</th></tr>
<tr><td><strong>Sphere</strong></td><td>A circle, but think of <strong>cross-contour</strong> lines wrapping around it to feel the volume, not just the outline</td></tr>
<tr><td><strong>Cylinder</strong></td><td>A central axis, then an ellipse at each end — the ellipse opens up (gets rounder) the further it drops below eye level (see 1.3's horizon line)</td></tr>
<tr><td><strong>Cube/box</strong></td><td>Built with the perspective steps from Lesson 1.3 — front face, then receding edges to the vanishing point(s)</td></tr>
<tr><td><strong>Cone</strong></td><td>A circle base plus a peak connected by two tangent lines from the base's outer edges</td></tr>
</table>
<h3>Part 3 — Developing form: value turns a shape into a solid</h3>
<p>A shape is 2D and flat; a <strong>form</strong> is a shape that reads as a solid, three-dimensional object sitting in light. The difference between the two is entirely <strong>value</strong> (light and dark). Under ONE light source, a rounded form shows a predictable ladder of tones — learn this once and you can render any object made of the 4 basic solids above.</p>
<ol>
<li><strong>Highlight</strong> — the brightest point, where light hits most directly.</li>
<li><strong>Light / halftone</strong> — the lit side, turning gently toward mid-tone.</li>
<li><strong>Core shadow</strong> — the darkest band ON the object itself, exactly where the surface turns away from the light (this is where CLO3's "shadow areas" live).</li>
<li><strong>Reflected light</strong> — a faint glow INSIDE the shadow, bounced off a nearby surface. It must stay darker than any lit tone, or the form looks like it has a hole in it.</li>
<li><strong>Cast shadow</strong> — the shadow the object throws ONTO the surface below it; darkest and sharpest right where the object touches the ground, softening as it moves away.</li>
</ol>
<div class="callout"><span class="badge">The relationship between object and light source (CLO3)</span> All 5 values above exist only because of ONE thing: where the light is relative to the object. Move the light and every value shifts position with it. This is why FLM's CLO3 specifically asks you to "analyze the relation between objects and light sources" — you are not memorizing 5 fixed zones, you are learning to read where they fall for THIS light, on THIS object, today.</div>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp (khó nhất của cả môn).</strong> Tô đều tay khắp bề mặt, không có chuyển độ — khối trông phẳng như dán decal. Vẽ bóng đổ (cast shadow) sai HƯỚNG so với nguồn sáng thật — hướng bóng đổ phải luôn ngược hướng ánh sáng chiếu tới. Quên ánh sáng phản chiếu (reflected light) trong vùng tối — thiếu nó, phía tối trông "chết", không có sự sống; nhưng vẽ nó quá sáng thì phá luôn cảm giác khối tối.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> Light a plain white ball or egg with a single lamp in an otherwise dim room. First draw it as a wireframe sphere (Part 2). Then render all 5 values from Part 3 as clean, separate bands — do NOT blend yet. Only once all 5 bands are placed correctly should you soften the transitions on the lit side, while keeping the core shadow crisp and dark.</p>
<p><strong>Self-check:</strong> Squint at your drawing from across the room — you should still clearly see 3 large masses (light / core shadow / cast shadow), not an even grey blob. Check your reflected light specifically: cover it with your finger — does the shadow side look flatter and more "dead" without it? If yes, you placed it correctly.</p>
<h3>Chapter 1 wrap-up</h3>
<p>You now have every tool Chapter 1 promised: the right pencil for the job (1.1), the four basic marks (1.2), perspective and a horizon line (1.3), the sketch-before-finish habit (1.4), and the 4 basic solids rendered in 5 values under one light (1.5). Chapters 2 onward (Lab 1 onward) put all five pieces together on real objects, in the studio, on A3 paper.</p>`,
    `<span class="eyebrow">DRS102 · Chương 1 · Bài 1.5 · Buổi 13-14 · CLO1, CLO2, CLO3</span>
<h2>Học cách nhìn, hình cơ bản &amp; phát triển khối</h2>
<p class="lead">Chủ đề FLM (buổi 13-14): <em>"7. Learning to See · 8. Begining with Basic Shapes · 9. Developing Form"</em> (bản gốc FLM gõ "Begining"). Đây là bài chốt Chương 1 và cũng là ý khó nhất, quan trọng nhất của cả môn: biến một đường viền phẳng thành thứ đọc được là khối đặc, có ánh sáng.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13343 · buổi 13-14 — "CHAPTER 1: GETTING STARTED · 7. Learning to See · 8. Begining with Basic Shapes · 9. Developing Form" (bản gốc gõ "Begining").</p>
` + sachChinh + `
<h3>Phần 1 — Học cách nhìn: ký hiệu so với quan sát thật</h3>
<p>Người mới thường vẽ theo <em>ký hiệu</em> — lối tắt trong đầu như "quả táo là hình tròn" — thay vì cái thật trước mắt. Cách sửa là một thói quen có chủ đích: nhìn vật thật nhiều hơn hẳn nhìn giấy, và vẽ đúng cạnh bạn ĐANG thấy lúc đó, không phải cạnh bạn nhớ một vật kiểu này "nên" có.</p>
<h3>Phần 2 — Hình cơ bản: mọi thứ quy về 4 khối gốc</h3>
<p>Gần như mọi vật thể có thể hiểu là tổ hợp của bốn <strong>khối gốc</strong>: <strong>khối cầu</strong>, <strong>khối trụ</strong>, <strong>khối hộp/lập phương</strong> và <strong>khối nón</strong>. Cái cốc là khối trụ; quả táo gần giống khối cầu; cái chai là trụ cộng nón cộng một trụ nhỏ. Trước khi vẽ bất kỳ vật thật nào, hãy quy nó về các khối này trong đầu trước.</p>
<table>
<tr><th>Khối</th><th>Cách vẽ</th></tr>
<tr><td><strong>Khối cầu</strong></td><td>Một hình tròn, nhưng hãy nghĩ tới nét <strong>cross-contour</strong> quấn quanh để cảm được thể tích, không chỉ đường viền</td></tr>
<tr><td><strong>Khối trụ</strong></td><td>Một trục giữa, rồi một ellipse ở mỗi đầu — ellipse mở rộng hơn (tròn hơn) khi hạ xuống dưới tầm mắt (xem đường tầm mắt ở Bài 1.3)</td></tr>
<tr><td><strong>Khối hộp/lập phương</strong></td><td>Dựng bằng các bước phối cảnh ở Bài 1.3 — mặt trước, rồi các cạnh lùi về (các) điểm tụ</td></tr>
<tr><td><strong>Khối nón</strong></td><td>Một đáy hình tròn cộng một đỉnh nối bằng hai đường tiếp tuyến từ mép ngoài của đáy</td></tr>
</table>
<h3>Phần 3 — Phát triển khối: sắc độ biến hình phẳng thành khối đặc</h3>
<p>Một hình là 2D, phẳng; một <strong>khối (form)</strong> là một hình đọc được thành vật thể đặc, ba chiều, nằm trong ánh sáng. Khác biệt giữa hai thứ này hoàn toàn nằm ở <strong>sắc độ</strong> (sáng và tối). Dưới MỘT nguồn sáng, một khối tròn cho một bậc thang sắc độ có quy luật — học một lần là diễn được mọi vật dựng từ 4 khối gốc ở trên.</p>
<ol>
<li><strong>Highlight (điểm sáng nhất)</strong> — nơi ánh sáng chiếu trực diện nhất.</li>
<li><strong>Ánh sáng / halftone</strong> — mặt sáng, chuyển dịu dần về trung gian.</li>
<li><strong>Sắc tối lõi (core shadow)</strong> — dải tối nhất TRÊN chính vật thể, đúng chỗ bề mặt quay lưng lại nguồn sáng (đây là nơi "vùng tối" của CLO3 nằm).</li>
<li><strong>Ánh sáng phản chiếu (reflected light)</strong> — ánh mờ NẰM TRONG vùng tối, dội lại từ bề mặt gần đó. Phải luôn tối hơn mọi sắc bên phía sáng, nếu không khối sẽ trông như bị thủng một lỗ.</li>
<li><strong>Bóng đổ (cast shadow)</strong> — bóng vật hắt XUỐNG bề mặt bên dưới; tối và sắc nét nhất ngay chỗ vật chạm nền, mềm dần khi xa ra.</li>
</ol>
<div class="callout"><span class="badge">Tương quan giữa vật thể &amp; nguồn sáng (CLO3)</span> Cả 5 sắc độ trên tồn tại chỉ vì MỘT thứ: vị trí nguồn sáng so với vật thể. Dời nguồn sáng thì mọi sắc độ dời vị trí theo. Đây là lý do CLO3 của FLM ghi rõ "phân tích tương quan giữa vật thể và nguồn sáng" — bạn không học thuộc 5 vùng cố định, mà học CÁCH ĐỌC chúng rơi vào đâu với NGUỒN SÁNG này, trên VẬT THỂ này, hôm nay.</div>
<div class="pitfall"><strong>⚠️ Bẫy thường gặp (khó nhất cả môn).</strong> Tô đều tay khắp bề mặt, không có chuyển độ — khối trông phẳng như dán decal. Vẽ bóng đổ (cast shadow) sai HƯỚNG so với nguồn sáng thật — hướng bóng đổ phải luôn ngược hướng ánh sáng chiếu tới. Quên ánh sáng phản chiếu trong vùng tối — thiếu nó, phía tối trông "chết", không có sức sống; nhưng vẽ nó quá sáng thì phá luôn cảm giác khối tối.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Chiếu một quả bóng hoặc quả trứng trắng trơn bằng một đèn duy nhất trong phòng hơi tối. Trước tiên vẽ nó như một khối cầu khung dây (Phần 2). Sau đó diễn đủ 5 sắc độ ở Phần 3 thành các dải rõ, tách biệt — CHƯA blend vội. Chỉ khi cả 5 dải đã đặt đúng chỗ mới làm mượt chuyển tiếp phía sáng, còn core shadow vẫn giữ sắc và tối.</p>
<p><strong>Tự chấm:</strong> Nheo mắt nhìn bài từ xa — bạn vẫn phải thấy rõ 3 mảng lớn (sáng / sắc tối lõi / bóng đổ), không phải một khối xám đều. Kiểm riêng ánh sáng phản chiếu: lấy ngón tay che nó lại — phía bóng có trông phẳng và "chết" hơn không? Nếu có, bạn đã đặt nó đúng chỗ.</p>
<h3>Tổng kết Chương 1</h3>
<p>Giờ bạn có đủ mọi công cụ Chương 1 đã hứa: đúng cây bút cho đúng việc (1.1), bốn kiểu nét cơ bản (1.2), phối cảnh và đường tầm mắt (1.3), thói quen ký hoạ trước khi hoàn thiện (1.4), và 4 khối gốc diễn bằng 5 sắc độ dưới một nguồn sáng (1.5). Chương 2 trở đi (Lab 1 trở đi) ghép cả 5 mảnh đó lại trên vật thật, trong xưởng vẽ, trên giấy A3.</p>`,
  ]]);

const c1quiz = quiz('drs102-quiz-1', 'Quiz — Chapter 1 (sessions 1-4 & 13-14)|||Quiz — Chương 1 (buổi 1-4 & 13-14)', [
  { id: 'q1', question: 'Bút chì độ nào phù hợp nhất cho nét DỰNG mờ, sẽ bị đè nét khác lên trên?', options: ['6B', 'HB', '2H', '4B'], correctIndex: 2, explanation: 'H = hard/light; 2H cứng, nhạt, giữ đầu nhọn tốt, hợp cho nét dựng gần như vô hình.' },
  { id: 'q2', question: 'Gôm DẺO (kneaded) hợp nhất để làm gì?', options: ['Xoá hẳn một nét dựng', 'Làm sáng nhẹ một sắc độ, không để lại cạnh cứng', 'Vẽ đường thẳng', 'Tạo bóng đổ'], correctIndex: 1, explanation: 'Gôm dẻo dùng để nhấc/làm sáng một tông đã tô, không ma sát mạnh như gôm nhựa.' },
  { id: 'q3', question: 'Cross-hatching khác hatching ở điểm nào?', options: ['Không dùng được để tạo sắc độ', 'Thêm một lớp nét song song thứ hai bắt chéo lớp đầu, cho tông tối hơn', 'Chỉ dùng chấm điểm', 'Là kỹ thuật blend'], correctIndex: 1, explanation: 'Cross-hatching = hatching + lớp nét chéo thứ hai, tạo tông đậm hơn kèm kết cấu.' },
  { id: 'q4', question: 'Đường tầm mắt (horizon line) luôn nằm ở đâu?', options: ['Giữa tờ giấy', 'Tầm mắt thật của người vẽ', 'Đáy vật thể', 'Đỉnh vật thể'], correctIndex: 1, explanation: 'Horizon line = eye level của người vẽ; điểm tụ nằm trên đường này.' },
  { id: 'q5', question: 'Nên dùng phối cảnh 2 điểm tụ khi nào?', options: ['Nhìn vật thẳng chính diện', 'Nhìn vật theo góc cạnh (thấy được góc vật)', 'Vật ở rất xa', 'Không bao giờ cần dùng'], correctIndex: 1, explanation: '2 điểm tụ dùng khi thấy vật theo góc — mặc định cho hầu hết bố cục tĩnh vật của môn.' },
  { id: 'q6', question: 'Vì sao nên "ký hoạ" (sketch nhanh) trước khi vẽ bài hoàn chỉnh?', options: ['Để tiết kiệm giấy', 'Để chốt tỉ lệ lớn & vị trí trước khi tốn thời gian vào bài hoàn chỉnh', 'Vì bắt buộc phải nộp cả hai', 'Để khỏi phải dùng bút chì đậm'], correctIndex: 1, explanation: 'Sketch rẻ, nhanh; sai thì bỏ. Bài hoàn chỉnh tốn thời gian nên nên dựng trên sketch đã kiểm tra.' },
  { id: 'q7', question: 'Trong 5 sắc độ của một khối, "core shadow" (sắc tối lõi) nằm ở đâu?', options: ['Trên nền, nơi vật hắt bóng', 'Trên chính vật thể, nơi bề mặt quay lưng khỏi nguồn sáng', 'Điểm sáng nhất', 'Ánh sáng phản chiếu'], correctIndex: 1, explanation: 'Core shadow là dải tối nhất TRÊN vật (không phải trên nền) — khác với cast shadow.' },
  { id: 'q8', question: 'Nếu ánh sáng phản chiếu (reflected light) trong vùng tối bị vẽ quá SÁNG thì sao?', options: ['Không ảnh hưởng gì', 'Phá luôn cảm giác khối đang ở trong bóng tối', 'Làm khối trông tối hơn', 'Giúp bài đẹp hơn'], correctIndex: 1, explanation: 'Reflected light phải tối hơn mọi tông phía sáng; sáng quá sẽ làm mất cảm giác đó là vùng tối.' },
]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 2 → 11 — CHỈ KHUNG (đúng tên bài + buổi/CLO/đề Lab nguyên văn/
// trọng số/nộp gì). Bài giảng chi tiết bổ sung sau. Dựng bằng hàm `khung()`
// — nối chuỗi thường, KHÔNG template lồng bên trong.
// ─────────────────────────────────────────────────────────────────────────
const escAmp = (s) => s.replace(/&/g, '&amp;');
const khung = (slug, titleEn, titleVi, desc, chuong, baiSo, buoi, clo, deBaiEn, deBaiVi, trongSoEn, trongSoVi, nopEn, nopVi) => {
  const enHtml =
    '<span class="eyebrow">DRS102 · Chapter ' + chuong + ' · Lesson ' + baiSo + ' · Session ' + buoi + ' · ' + clo + ' · Framework</span>' +
    '<h2>' + escAmp(titleEn) + '</h2>' +
    '<ul>' +
    '<li><strong>Session(s):</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>FLM content / Lab brief (verbatim where applicable):</strong> ' + deBaiEn + '</li>' +
    '<li><strong>Weight:</strong> ' + trongSoEn + '</li>' +
    '<li><strong>Submit:</strong> ' + nopEn + '</li>' +
    '<li><strong>Note:</strong> Framework only — full lesson content is added later. This is a STUDIO session, drawn by hand on real A3 paper; the site cannot replace it.</li>' +
    '</ul>' +
    '<p><em>Source: FLM &middot; Syllabus 13343 &middot; QD 932/QD-DHFPT dated 08/22/2025.</em></p>';
  const viHtml =
    '<span class="eyebrow">DRS102 · Chương ' + chuong + ' · Bài ' + baiSo + ' · Buổi ' + buoi + ' · ' + clo + ' · Khung</span>' +
    '<h2>' + escAmp(titleVi) + '</h2>' +
    '<ul>' +
    '<li><strong>Buổi:</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>Nội dung FLM / đề Lab (nguyên văn nếu có):</strong> ' + deBaiVi + '</li>' +
    '<li><strong>Trọng số:</strong> ' + trongSoVi + '</li>' +
    '<li><strong>Nộp:</strong> ' + nopVi + '</li>' +
    '<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau. Đây là buổi học XƯỞNG VẼ, vẽ tay trên giấy A3 thật; web không thay thế được.</li>' +
    '</ul>' +
    '<p><em>Nguồn: FLM &middot; Syllabus 13343 &middot; QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>';
  return doc(slug, titleEn + '|||' + titleVi, desc, [[enHtml, viHtml]]);
};

// ── Chương 2 — Lab 1: Khối lập phương & khối cầu (buổi 5-6) ──
const k21 = khung('drs102-2-1-lab1-khoi-lap-phuong-cau', 'Lab 1 — Cube & Sphere', 'Lab 1 — Khối lập phương & khối cầu',
  'Buổi 5-6, CLO1-4. Khung.', 2, '2.1', '5-6', 'CLO1, CLO2, CLO3, CLO4',
  '"Students practice drawing the form of Cube and Sphere on A3 paper."',
  '"Sinh viên luyện vẽ khối Lập phương và Khối cầu trên giấy A3."',
  'Part of grading item 1 "Lab1, Lab 2 (practice 1)" = 10% (see 0.2).',
  'Nằm trong đầu điểm 1 "Lab1, Lab 2 (practice 1)" = 10% (xem 0.2).',
  'The A3 drawing of a cube and a sphere done in this Lab, kept for the end-of-course Portfolio (0.6).',
  'Bài vẽ khối lập phương & khối cầu trên A3 làm trong Lab này, giữ lại để nộp Portfolio cuối môn (0.6).');

// ── Chương 3 — Lab 2: Bộ 4 khối trên nền vải (buổi 7-12) ──
const k31 = khung('drs102-3-1-lab2-bo-4-khoi', 'Lab 2 — A set of 4 basic blocks on fabric background', 'Lab 2 — Bộ 4 khối cơ bản trên nền vải',
  'Buổi 7-12, CLO1-4. Khung.', 3, '3.1', '7-12', 'CLO1, CLO2, CLO3, CLO4',
  '"Students practice drawing a set of 4 basic blocks: Cube, sphere, prism, cone,&hellip; on the fabric background on A3 paper."',
  '"Sinh viên luyện vẽ bộ 4 khối cơ bản: Lập phương, cầu, lăng trụ, nón&hellip; trên nền vải, trên giấy A3."',
  'Part of grading item 1 "Lab1, Lab 2 (practice 1)" = 10%, same item as Lab 1 (see 0.2).',
  'Nằm trong đầu điểm 1 "Lab1, Lab 2 (practice 1)" = 10%, cùng đầu điểm với Lab 1 (xem 0.2).',
  'The A3 drawing of the 4-block set on a fabric background, kept for the Portfolio.',
  'Bài vẽ bộ 4 khối trên nền vải, giấy A3, giữ lại để nộp Portfolio.');

// ── Chương 4 — Vẽ tĩnh vật: lý thuyết (buổi 15-16) ──
const k41 = khung('drs102-4-1-tinh-vat-ly-thuyet', 'Still-life: theory (fruit, candlelight, reflections)', 'Tĩnh vật: lý thuyết (trái cây, ánh nến, phản chiếu)',
  'Buổi 15-16, CLO1-5. Khung — chuẩn bị cho Lab 3 & 4.', 4, '4.1', '15-16', 'CLO1, CLO2, CLO3, CLO4, CLO5',
  '"CHAPTER 2: STILL-LIFE &mdash; Fruit &amp; Nuts, Strawberries, Pineapple, Pinecone, Candlelight Still-life Composition, Reflections &amp; Lace, Bottle &amp; Bread."',
  '"CHƯƠNG 2: TĨNH VẬT — Trái cây &amp; hạt, Dâu tây, Dứa, Quả thông, Bố cục tĩnh vật dưới nến, Phản chiếu &amp; ren, Chai &amp; bánh mì."',
  'Not a separate grading item — theory session, feeds into Participation (10%) and prepares Lab 3-4.',
  'Không phải đầu điểm riêng — buổi lý thuyết, tính vào Participation (10%) và chuẩn bị cho Lab 3-4.',
  'No separate submission for this theory session; notes/sketches go toward the end-of-course Portfolio.',
  'Buổi lý thuyết không có sản phẩm nộp riêng; ghi chú/phác thảo tính vào Portfolio cuối môn.');

// ── Chương 5 — Lab 3 & Lab 4: Tĩnh vật cơ bản & vật khó (buổi 17-24) ──
const k51 = khung('drs102-5-1-lab3-tinh-vat-co-ban', 'Lab 3 — Still-life with basic objects', 'Lab 3 — Tĩnh vật với vật cơ bản',
  'Buổi 17-18, CLO2-5. Khung.', 5, '5.1', '17-18', 'CLO2, CLO3, CLO4, CLO5',
  '"Students practice drawing a set of still life with basic objects arranged by the teacher on A3 paper."',
  '"Sinh viên luyện vẽ một bộ tĩnh vật với vật cơ bản do giảng viên sắp đặt, trên giấy A3."',
  'Part of grading item 2 "Lab3, Lab4 (practice 2)" = 15% (see 0.2).',
  'Nằm trong đầu điểm 2 "Lab3, Lab4 (practice 2)" = 15% (xem 0.2).',
  'The A3 still-life drawing from this Lab, kept for the Portfolio.',
  'Bài vẽ tĩnh vật A3 của Lab này, giữ lại để nộp Portfolio.');
const k52 = khung('drs102-5-2-lab4-vat-kho', 'Lab 4 — Still-life with difficult shapes', 'Lab 4 — Tĩnh vật với vật hình dạng khó',
  'Buổi 19-24 (Lab 4 + 3 buổi tiếp), CLO2-5. Khung.', 5, '5.2', '19-24', 'CLO2, CLO3, CLO4, CLO5',
  '"Students practice drawing still life with objects that have difficult shapes on A3 paper." Runs across sessions 19-24 (Lab 4, then "Lab 4 (cont)" x3 in the raw FLM table).',
  '"Sinh viên luyện vẽ tĩnh vật với vật có hình dạng khó, trên giấy A3." Kéo dài buổi 19-24 (Lab 4, rồi "Lab 4 (cont)" x3 trong bảng gốc FLM).',
  'Part of grading item 2 "Lab3, Lab4 (practice 2)" = 15%, same item as Lab 3 (see 0.2).',
  'Nằm trong đầu điểm 2 "Lab3, Lab4 (practice 2)" = 15%, cùng đầu điểm với Lab 3 (xem 0.2).',
  'The A3 still-life drawing of difficult-shaped objects, kept for the Portfolio.',
  'Bài vẽ tĩnh vật vật hình dạng khó, giấy A3, giữ lại để nộp Portfolio.');

// ── Chương 6 — Vẽ động vật: lý thuyết (buổi 25-28) ──
const k61 = khung('drs102-6-1-ve-dong-vat-ly-thuyet-1', 'Animals: theory — zoo animals', 'Vẽ động vật: lý thuyết — thú ở sở thú',
  'Buổi 25-26, CLO1-5. Khung.', 6, '6.1', '25-26', 'CLO1, CLO2, CLO3, CLO4, CLO5',
  '"CHAPTER 3: ANIMALS &mdash; Drawing Animals, Drawing at the Zoo: Flamingo, Elephant, Kangaroo, Toucan, Tortoise, Rattlesnake."',
  '"CHƯƠNG 3: ĐỘNG VẬT — Vẽ động vật, Vẽ ở sở thú: Hồng hạc, Voi, Chuột túi, Chim toucan, Rùa, Rắn đuôi chuông."',
  'Not a separate grading item — theory session, feeds into Participation and prepares Lab 5-6.',
  'Không phải đầu điểm riêng — buổi lý thuyết, tính vào Participation và chuẩn bị cho Lab 5-6.',
  'No separate submission; notes/sketches go toward the Portfolio.',
  'Không có sản phẩm nộp riêng; ghi chú/phác thảo tính vào Portfolio.');
const k62 = khung('drs102-6-2-ve-dong-vat-ly-thuyet-2', 'Animals: theory — pets & farm/companion animals', 'Vẽ động vật: lý thuyết — thú cưng & động vật gần gũi',
  'Buổi 27-28, CLO1-5. Khung.', 6, '6.2', '27-28', 'CLO1, CLO2, CLO3, CLO4, CLO5',
  '"CHAPTER 3: ANIMALS &mdash; Giant Panda, Giraffe, Horse Portrait, Pony, Siberian Husky Puppy, English Bulldog, Miniature Schnauzer, Persian Cat, Tabby Cat."',
  '"CHƯƠNG 3: ĐỘNG VẬT — Gấu trúc, Hươu cao cổ, Chân dung ngựa, Ngựa con, Chó Husky Siberia con, Chó Bulldog Anh, Chó Schnauzer thu nhỏ, Mèo Ba Tư, Mèo Tabby."',
  'Not a separate grading item — theory session, feeds into Participation and prepares Lab 5-6.',
  'Không phải đầu điểm riêng — buổi lý thuyết, tính vào Participation và chuẩn bị cho Lab 5-6.',
  'No separate submission; notes/sketches go toward the Portfolio.',
  'Không có sản phẩm nộp riêng; ghi chú/phác thảo tính vào Portfolio.');

// ── Chương 7 — Lab 5 & Lab 6: Tĩnh vật có động vật / bản nét-doodle (buổi 29-36) ──
const k71 = khung('drs102-7-1-lab5-tinh-vat-dong-vat', 'Lab 5 — Still-life art work with animals (1st version)', 'Lab 5 — Tác phẩm tĩnh vật có động vật (bản 1)',
  'Buổi 29-30, CLO2-6. Khung.', 7, '7.1', '29-30', 'CLO2, CLO3, CLO4, CLO5, CLO6',
  '"Students observe the set of still life set by the teacher in class, get inspired by the still life, imagine and create a still life art work with animals on A3 paper. (The 1st version)"',
  '"Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ ĐỘNG VẬT trên giấy A3. (Bản 1)"',
  'Part of grading item 3 "Lab5, Lab6 (practice 3)" = 15% (see 0.2). First Lab pair tagged with CLO6 (professional attitude).',
  'Nằm trong đầu điểm 3 "Lab5, Lab6 (practice 3)" = 15% (xem 0.2). Cặp Lab đầu tiên được gắn CLO6 (thái độ chuyên nghiệp).',
  'The A3 still-life-with-animals artwork (1st version), kept for the Portfolio.',
  'Tác phẩm tĩnh vật có động vật (bản 1) trên A3, giữ lại để nộp Portfolio.');
const k72 = khung('drs102-7-2-lab6-net-doodle', 'Lab 6 — Same still-life, line/doodle style option (2nd version)', 'Lab 6 — Cùng tĩnh vật, tuỳ chọn phong cách nét/doodle (bản 2)',
  'Buổi 31-36 (Lab 6 + 4 buổi tiếp), CLO2-6. Khung.', 7, '7.2', '31-36', 'CLO2, CLO3, CLO4, CLO5, CLO6',
  '"Students observe the set of still life set by the teacher in class, on A3 paper. (The 2nd version with line and doodle style as option)" Runs across sessions 31-36 (Lab 6, then "Lab 6 (cont)" x4 in the raw FLM table).',
  '"Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)" Kéo dài buổi 31-36 (Lab 6, rồi "Lab 6 (cont)" x4 trong bảng gốc FLM).',
  'Part of grading item 3 "Lab5, Lab6 (practice 3)" = 15%, same item as Lab 5 (see 0.2).',
  'Nằm trong đầu điểm 3 "Lab5, Lab6 (practice 3)" = 15%, cùng đầu điểm với Lab 5 (xem 0.2).',
  'The A3 artwork, 2nd version (line/doodle style optional), kept for the Portfolio.',
  'Tác phẩm bản 2 (có thể chọn phong cách nét/doodle) trên A3, giữ lại để nộp Portfolio.');

// ── Chương 8 — Vẽ phong cảnh: lý thuyết (buổi 37-40) ──
const k81 = khung('drs102-8-1-phong-canh-ly-thuyet-1', 'Landscapes: theory — composition, perspective, clouds & trees', 'Vẽ phong cảnh: lý thuyết — bố cục, phối cảnh, mây & cây',
  'Buổi 37-38, CLO1-5. Khung. ⚠️ FLM gõ dính "LANDSCAPESLandscape".', 8, '8.1', '37-38', 'CLO1, CLO2, CLO3, CLO4, CLO5',
  '"CHAPTER 4: LANDSCAPES<strong>Landscape</strong> &mdash; Composition, Perspective Tips, Clouds, Rocks, Tree Shapes." (Chapter name and first bullet run together in the raw FLM table &mdash; kept verbatim.)',
  '"CHƯƠNG 4: PHONG CẢNH — Landscape (nguyên văn FLM dính liền chữ "LANDSCAPESLandscape") — Bố cục, Mẹo phối cảnh, Mây, Đá, Hình dáng cây."',
  'Not a separate grading item — theory session, feeds into Participation and prepares Lab 7-8.',
  'Không phải đầu điểm riêng — buổi lý thuyết, tính vào Participation và chuẩn bị cho Lab 7-8.',
  'No separate submission; notes/sketches go toward the Portfolio.',
  'Không có sản phẩm nộp riêng; ghi chú/phác thảo tính vào Portfolio.');
const k82 = khung('drs102-8-2-phong-canh-ly-thuyet-2', 'Landscapes: theory — structures, mountains & deserts', 'Vẽ phong cảnh: lý thuyết — công trình, núi & sa mạc',
  'Buổi 39-40, CLO1-5. Khung. ⚠️ FLM gõ dính "LANDSCAPESStructures".', 8, '8.2', '39-40', 'CLO1, CLO2, CLO3, CLO4, CLO5',
  '"CHAPTER 4: LANDSCAPES<strong>Structures</strong> &mdash; Mountains, Deserts, Creek with Rocks, Sycamore Lane, Half Dome, Yosemite." (Chapter name and first bullet run together in the raw FLM table &mdash; kept verbatim.)',
  '"CHƯƠNG 4: PHONG CẢNH — Structures (nguyên văn FLM dính liền chữ "LANDSCAPESStructures") — Núi, Sa mạc, Suối có đá, Con đường cây tiêu huyền, Half Dome (Yosemite)."',
  'Not a separate grading item — theory session, feeds into Participation and prepares Lab 7-8.',
  'Không phải đầu điểm riêng — buổi lý thuyết, tính vào Participation và chuẩn bị cho Lab 7-8.',
  'No separate submission; notes/sketches go toward the Portfolio.',
  'Không có sản phẩm nộp riêng; ghi chú/phác thảo tính vào Portfolio.');

// ── Chương 9 — Lab 7 & Lab 8: Tĩnh vật có nền vải (buổi 41-48) ──
const k91 = khung('drs102-9-1-lab7-nen-vai', 'Lab 7 — Still-life with cloth background (1st version)', 'Lab 7 — Tĩnh vật có nền vải (bản 1)',
  'Buổi 41-42, CLO2-6. Khung.', 9, '9.1', '41-42', 'CLO2, CLO3, CLO4, CLO5, CLO6',
  '"Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 1st version)"',
  '"Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 1)"',
  'Part of grading item 4 "Lab7, Lab8 (practice 4)" = 20% (see 0.2).',
  'Nằm trong đầu điểm 4 "Lab7, Lab8 (practice 4)" = 20% (xem 0.2).',
  'The A3 still-life-with-cloth-background artwork (1st version), kept for the Portfolio.',
  'Tác phẩm tĩnh vật nền vải (bản 1) trên A3, giữ lại để nộp Portfolio.');
const k92 = khung('drs102-9-2-lab8-nen-vai-tiep', 'Lab 8 — Same still-life, line/doodle style option (2nd version)', 'Lab 8 — Cùng tĩnh vật nền vải, tuỳ chọn phong cách nét/doodle (bản 2)',
  'Buổi 43-48 (Lab 8 + 4 buổi tiếp), CLO2-6. Khung.', 9, '9.2', '43-48', 'CLO2, CLO3, CLO4, CLO5, CLO6',
  '"Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with cloth as background on A3 paper. (The 2nd version with line and doodle style as option)" Runs across sessions 43-48 (Lab 8, then "Lab 8 (cont)" x4 in the raw FLM table).',
  '"Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ NỀN VẢI trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)" Kéo dài buổi 43-48 (Lab 8, rồi "Lab 8 (cont)" x4 trong bảng gốc FLM).',
  'Part of grading item 4 "Lab7, Lab8 (practice 4)" = 20%, same item as Lab 7 (see 0.2).',
  'Nằm trong đầu điểm 4 "Lab7, Lab8 (practice 4)" = 20%, cùng đầu điểm với Lab 7 (xem 0.2).',
  'The A3 artwork, 2nd version (line/doodle style optional), kept for the Portfolio.',
  'Tác phẩm bản 2 (có thể chọn phong cách nét/doodle) trên A3, giữ lại để nộp Portfolio.');

// ── Chương 10 — Vẽ người: lý thuyết (buổi 49-52) ──
const k101 = khung('drs102-10-1-ve-nguoi-ly-thuyet-1', 'People: theory — adult head, head positions, eyes/nose/ears', 'Vẽ người: lý thuyết — đầu người lớn, các góc đầu, mắt/mũi/tai',
  'Buổi 49-50, CLO1-5. Khung.', 10, '10.1', '49-50', 'CLO1, CLO2, CLO3, CLO4, CLO5',
  '"CHAPTER 5: PEOPLE &mdash; Adult Head, Head Positions, Eyes, Noses &amp; Ears."',
  '"CHƯƠNG 5: NGƯỜI — Đầu người lớn, Các góc đầu, Mắt, Mũi &amp; tai."',
  'Not a separate grading item — theory session, feeds into Participation and prepares Lab 9-10.',
  'Không phải đầu điểm riêng — buổi lý thuyết, tính vào Participation và chuẩn bị cho Lab 9-10.',
  'No separate submission; notes/sketches go toward the Portfolio.',
  'Không có sản phẩm nộp riêng; ghi chú/phác thảo tính vào Portfolio.');
const k102 = khung('drs102-10-2-ve-nguoi-ly-thuyet-2', 'People: theory — profile views (woman, man, girl, boy)', 'Vẽ người: lý thuyết — nhìn nghiêng (phụ nữ, đàn ông, bé gái, bé trai)',
  'Buổi 51-52, CLO1-5. Khung.', 10, '10.2', '51-52', 'CLO1, CLO2, CLO3, CLO4, CLO5',
  '"CHAPTER 5: PEOPLE &mdash; Woman in Profile, Man in Profile, Girl in Profile, Boy in Profile."',
  '"CHƯƠNG 5: NGƯỜI — Phụ nữ nhìn nghiêng, Đàn ông nhìn nghiêng, Bé gái nhìn nghiêng, Bé trai nhìn nghiêng."',
  'Not a separate grading item — theory session, feeds into Participation and prepares Lab 9-10.',
  'Không phải đầu điểm riêng — buổi lý thuyết, tính vào Participation và chuẩn bị cho Lab 9-10.',
  'No separate submission; notes/sketches go toward the Portfolio.',
  'Không có sản phẩm nộp riêng; ghi chú/phác thảo tính vào Portfolio.');

// ── Chương 11 — Lab 9 & Lab 10: Tĩnh vật có mặt nạ, 30% điểm (buổi 53-60) ──
const k111 = khung('drs102-11-1-lab9-mat-na', 'Lab 9 — Still-life art work with masks (1st version)', 'Lab 9 — Tác phẩm tĩnh vật có mặt nạ (bản 1)',
  'Buổi 53-54, CLO2-6. Khung. ⚠️ Đầu điểm nặng nhất môn (30%).', 11, '11.1', '53-54', 'CLO2, CLO3, CLO4, CLO5, CLO6',
  '"Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 1st version)"',
  '"Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 1)"',
  'Part of grading item 5 "Lab9, Lab10 (practice 5)" = 30% — the HEAVIEST single item in the whole course (see 0.2).',
  'Nằm trong đầu điểm 5 "Lab9, Lab10 (practice 5)" = 30% — đầu điểm NẶNG NHẤT cả môn (xem 0.2).',
  'The A3 still-life-with-masks artwork (1st version), kept for the Portfolio.',
  'Tác phẩm tĩnh vật có mặt nạ (bản 1) trên A3, giữ lại để nộp Portfolio.');
const k112 = khung('drs102-11-2-lab10-mat-na-tiep', 'Lab 10 — Same still-life, line/doodle style option (2nd version) & final Portfolio', 'Lab 10 — Cùng tĩnh vật có mặt nạ, tuỳ chọn nét/doodle (bản 2) & Portfolio cuối môn',
  'Buổi 55-60 (Lab 10 + 4 buổi tiếp), CLO2-6. Khung. ⚠️ Cùng đầu điểm nặng nhất (30%) + hạn nộp Portfolio.', 11, '11.2', '55-60', 'CLO2, CLO3, CLO4, CLO5, CLO6',
  '"Students observe the set of still life set by the teacher in class, get inspired, imagine and create a still life art work with masks on A3 paper. (The 2nd version with line and doodle style as option)" Runs across sessions 55-60 (Lab 10, then "Lab 10 (cont)" x4). This is also, per Student Task #7 (0.6), roughly when the full-course Portfolio is due — "the week before the end of the course."',
  '"Sinh viên quan sát bộ tĩnh vật giảng viên sắp đặt trong lớp, lấy cảm hứng, tưởng tượng và sáng tạo tác phẩm tĩnh vật CÓ MẶT NẠ trên giấy A3. (Bản 2, có thể chọn phong cách nét/doodle)" Kéo dài buổi 55-60 (Lab 10, rồi "Lab 10 (cont)" x4). Đây cũng là mốc, theo Nhiệm vụ SV #7 (0.6), Portfolio cả môn phải nộp — "tuần trước khi kết thúc môn".',
  'Part of grading item 5 "Lab9, Lab10 (practice 5)" = 30%, same item as Lab 9 (see 0.2). Together with Lab 9, this is 30% of the ENTIRE course grade.',
  'Nằm trong đầu điểm 5 "Lab9, Lab10 (practice 5)" = 30%, cùng đầu điểm với Lab 9 (xem 0.2). Cùng Lab 9, đây là 30% TOÀN BỘ điểm môn.',
  'The A3 artwork, 2nd version (line/doodle style optional), PLUS the complete course Portfolio (all exercises from session 1 onward, per Student Task #7).',
  'Tác phẩm bản 2 (có thể chọn phong cách nét/doodle) trên A3, CỘNG Portfolio đầy đủ cả môn (mọi bài tập từ buổi 1, theo Nhiệm vụ SV #7).');

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'DRS102',
    slug: 'drs102-drawing-form-still-life',
    title: 'Drawing - Form, Still-life',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DRS102.webp',
    shortDescription: 'FLM Syllabus 13343, 60 sessions, NO final exam (100% on-going: 5 Lab pairs 10/15/15/20/30% + Participation 10%). Studio course, drawn by hand on A3 paper. Chapter 1 (sessions 1-4 & 13-14) is fully taught; sessions 5-12 & 15-60 are a framework for now.|||Bám FLM Syllabus 13343, 60 buổi, KHÔNG thi cuối kỳ (100% on-going: 5 cặp Lab 10/15/15/20/30% + Participation 10%). Môn học xưởng vẽ, vẽ tay trên giấy A3. Chương 1 (buổi 1-4 & 13-14) dạy đầy đủ; buổi 5-12 & 15-60 hiện là khung.',
    description: 'Môn <strong>DRS102 — Drawing - Form, Still-life</strong> (Hình hoạ: Khối &amp; Tĩnh vật, Kỳ 1, ngành Thiết kế đồ hoạ) dựng lại bám nguyên văn <strong>FLM Syllabus 13343</strong> (QĐ 932/QĐ-ĐHFPT ngày 22/08/2025), đủ <strong>60 buổi</strong>, <strong>6 CLO</strong> và <strong>5 cặp Lab + Participation</strong>. Môn này <strong>KHÔNG có thi cuối kỳ</strong> — 100% điểm là on-going, trọng số tăng dần 10% → 15% → 15% → 20% → 30% (Lab 9-10 một mình chiếm 30%) cộng Participation 10%. Đây là môn học <strong>TRỰC TIẾP trong xưởng vẽ</strong>, vẽ tay trên giấy A3 bằng chì thật — web chỉ hỗ trợ lý thuyết &amp; tự luyện, không thay được buổi có mẫu thật. <strong>Mục 0</strong> là khung chương trình đầy đủ (hồ sơ môn, cách tính điểm, CLO, giáo trình &amp; công cụ — 5 sách đều không có link, kế hoạch 60 buổi, nhiệm vụ sinh viên, câu hỏi kiến tạo) để sinh viên tự đối chiếu với FLM. <strong>Chương 1</strong> (buổi 1-4 &amp; 13-14: dụng cụ &amp; vật liệu, kỹ thuật chì &amp; luyện nét, luật xa gần, khởi động &amp; ký hoạ, học cách nhìn &amp; khối/sáng-tối) dạy đầy đủ, song ngữ, có bảng, bài tập tự chấm, kết chương bằng quiz. <strong>Chương 2 đến hết</strong> (Lab 1-10 xen giữa các chương lý thuyết vẽ tĩnh vật/động vật/phong cảnh/người) hiện là <strong>khung</strong> — đúng tên bài, đúng buổi/CLO/đề Lab nguyên văn/trọng số/nộp gì — để sinh viên có đúng lộ trình học ngay, chi tiết sẽ bổ sung dần.',
    whatYouLearn: 'Chì graphite cứng/mềm (2H-6B) &amp; cách cầm bút; hatching, cross-hatching, blending, stippling; luật xa gần 1 &amp; 2 điểm tụ; khởi động &amp; ký hoạ nhanh; quy vật thể về 4 khối gốc (cầu/trụ/hộp/nón); 5 sắc độ &amp; tương quan vật thể-nguồn sáng (highlight, core shadow, phản quang, bóng đổ); quy trình 10 bài Lab vẽ khối &amp; tĩnh vật trên giấy A3, xen các chương lý thuyết vẽ động vật/phong cảnh/người; tổng hợp Portfolio cuối môn.',
    requirements: 'Không cần kinh nghiệm vẽ trước (Pre-Requisite: None, theo FLM). Cần giấy A3 + giấy sketch A3, chì graphite nhiều độ, gôm, màu, cọ, bút mực đen, artline, marker, dao rọc giấy, băng giấy, laptop, bảng vẽ (nguyên văn Tools của FLM, xem 0.4). Học trực tiếp trong xưởng vẽ.',
  },
  sections: [
    {
      title: 'Mục 0 — Khung chương trình theo FLM|||Section 0 — FLM program framework',
      description: 'Hồ sơ môn, cách tính điểm (5 cặp Lab + Participation, KHÔNG thi cuối kỳ), 6 CLO, giáo trình &amp; công cụ (5 sách không link), kế hoạch đủ 60 buổi, nhiệm vụ sinh viên, câu hỏi kiến tạo — đối chiếu trực tiếp FLM Syllabus 13343.',
      lessons: [m01, m02, m03, m04, m05, m06, m07],
    },
    {
      title: 'Chương 1 — Nhập môn vẽ (buổi 1-4 & 13-14)|||Chapter 1 — Getting started (sessions 1-4 & 13-14)',
      description: 'Buổi 1-4 & 13-14 · CLO1, CLO2, CLO3 · Dụng cụ & vật liệu, kỹ thuật chì & luyện nét, luật xa gần, khởi động & ký hoạ, học cách nhìn & khối/sáng-tối — ĐẦY ĐỦ, dạy được ngay, kết chương bằng quiz.',
      lessons: [c11, c12, c13, c14, c15, c1quiz],
    },
    {
      title: 'Chương 2 — Lab 1: Khối lập phương & khối cầu (khung)|||Chapter 2 — Lab 1: Cube & Sphere (skeleton)',
      description: 'Buổi 5-6 · CLO1-4 · Đầu điểm 1 (10%, chung với Lab 2) — Khung.',
      lessons: [k21],
    },
    {
      title: 'Chương 3 — Lab 2: Bộ 4 khối trên nền vải (khung)|||Chapter 3 — Lab 2: 4 blocks on fabric (skeleton)',
      description: 'Buổi 7-12 · CLO1-4 · Đầu điểm 1 (10%, chung với Lab 1) — Khung.',
      lessons: [k31],
    },
    {
      title: 'Chương 4 — Vẽ tĩnh vật: lý thuyết (khung)|||Chapter 4 — Still-life: theory (skeleton)',
      description: 'Buổi 15-16 · CLO1-5 · Chuẩn bị cho Lab 3 & 4 — Khung.',
      lessons: [k41],
    },
    {
      title: 'Chương 5 — Lab 3 & Lab 4: Tĩnh vật cơ bản & vật khó (khung)|||Chapter 5 — Lab 3 & 4: Basic & difficult still-life (skeleton)',
      description: 'Buổi 17-24 · CLO2-5 · Đầu điểm 2 (15%) — Khung.',
      lessons: [k51, k52],
    },
    {
      title: 'Chương 6 — Vẽ động vật: lý thuyết (khung)|||Chapter 6 — Animals: theory (skeleton)',
      description: 'Buổi 25-28 · CLO1-5 · Chuẩn bị cho Lab 5 & 6 — Khung.',
      lessons: [k61, k62],
    },
    {
      title: 'Chương 7 — Lab 5 & Lab 6: Tĩnh vật có động vật, nét/doodle (khung)|||Chapter 7 — Lab 5 & 6: Still-life with animals, line/doodle (skeleton)',
      description: 'Buổi 29-36 · CLO2-6 · Đầu điểm 3 (15%) — Khung.',
      lessons: [k71, k72],
    },
    {
      title: 'Chương 8 — Vẽ phong cảnh: lý thuyết (khung)|||Chapter 8 — Landscapes: theory (skeleton)',
      description: 'Buổi 37-40 · CLO1-5 · Chuẩn bị cho Lab 7 & 8; ⚠️ LỆCH LỚN — không Lab nào thực sự là phong cảnh (xem 0.5) — Khung.',
      lessons: [k81, k82],
    },
    {
      title: 'Chương 9 — Lab 7 & Lab 8: Tĩnh vật có nền vải (khung)|||Chapter 9 — Lab 7 & 8: Still-life with cloth background (skeleton)',
      description: 'Buổi 41-48 · CLO2-6 · Đầu điểm 4 (20%) — Khung.',
      lessons: [k91, k92],
    },
    {
      title: 'Chương 10 — Vẽ người: lý thuyết (khung)|||Chapter 10 — People: theory (skeleton)',
      description: 'Buổi 49-52 · CLO1-5 · Chuẩn bị cho Lab 9 & 10; ⚠️ LỆCH LỚN — không Lab nào thực sự là chân dung (xem 0.5) — Khung.',
      lessons: [k101, k102],
    },
    {
      title: 'Chương 11 — Lab 9 & Lab 10: Tĩnh vật có mặt nạ, 30% điểm (khung)|||Chapter 11 — Lab 9 & 10: Still-life with masks, 30% grade (skeleton)',
      description: 'Buổi 53-60 · CLO2-6 · Đầu điểm 5 (30%, nặng nhất môn) + hạn nộp Portfolio cuối môn — Khung.',
      lessons: [k111, k112],
    },
  ],
};
