/**
 * DTG102 — Visual Design Tools (Công cụ thiết kế trực quan). Ngành Thiết kế
 * mỹ thuật số FPTU, Kỳ 1. DỰNG LẠI 20/09/2026 bám nguyên văn FLM Syllabus
 * 13371 (QĐ 932/QĐ-ĐHFPT ngày 22/08/2025), nguồn:
 * content/academy/_syllabus-flm/DTG102.json. Bản trước (18 bài) là khung 8
 * chương tự chọn (raster/vector → Photoshop → Illustrator → InDesign →
 * workflow → capstone), KHÔNG bám đúng cấu trúc 60 buổi / 3 phần mềm theo
 * đúng thứ tự của trường (Illustrator trước, rồi Photoshop, rồi InDesign)
 * — đã thay toàn bộ.
 *
 * MỨC ĐỘ: Mục 0 (khung FLM) và Chương 1 (buổi 1-10: Nhập môn + Illustrator
 * cơ bản tới Layers) là ĐẦY ĐỦ, dạy được ngay. Chương 2 → 9 CHỈ LÀ KHUNG
 * (đúng tên bài + 5 dòng mốc nội dung: buổi, CLO, công cụ, nội dung FLM,
 * ghi chú) — bài giảng chi tiết bổ sung sau, KHÔNG tự ý viết dài thêm.
 *
 * Sách/tài liệu: theo lệnh 20/09/2026, MỌI giáo trình phải là thẻ
 * `.khoi-sach`/`.the-sach` (content/academy/_HOP-DONG-SOAN-BAI.md, mục
 * "SÁCH & TÀI LIỆU"). "Adobe Design Basics" (tài liệu CHÍNH, Is Main
 * Material=True) trường KHÔNG công bố link → thẻ `khong-link`, KHÔNG bịa
 * link. Ba PDF hướng dẫn chính thức của Adobe (Illustrator/InDesign/
 * Photoshop, 2019) là tham khảo, có link thật, nút "Tải PDF →".
 *
 * ⚠️ Ghi chú/bất thường từ syllabus gốc (giữ nguyên, nêu cho sinh viên,
 * xem đủ trong "ghiChuKiemChung" của file JSON nguồn):
 *   1. Môn này KHÔNG có thi cuối kỳ — 100% điểm là on-going: Participation
 *      10% + Progress test 1/2/3, mỗi bài 30%. Khác hẳn phần lớn môn khác.
 *   2. Bảng giáo trình gốc trên FLM DÁN LINK DÍNH VÀO TÊN SÁCH và gõ sai:
 *      "Adobe Illustator CChttps://..." (thiếu chữ r), "Adobe Photoshops
 *      CChttps://..." (thừa chữ s). Ở đây đã tách tên/link, sửa chính tả —
 *      nêu rõ bản gốc FLM viết vậy.
 *   3. Trường KHÔNG công bố CLO cho từng đầu điểm (cột CLO của bảng đánh
 *      giá để trống), KHÔNG công bố thời lượng/tiêu chí đạt của
 *      Participation.
 *   4. Buổi 19 và 21 GIỐNG HỆT NHAU ("Assignment 1: Part 1"); buổi 22-23
 *      cũng vậy ("Part 2"); buổi 40-41-42 lặp lại y nguyên (Animation +
 *      Progress Test 2 Q&amp;A). Giữ nguyên bảng gốc, không tự sửa.
 *   5. Sinh viên PHẢI dùng TÀI KHOẢN CÁ NHÂN (không phải tài khoản
 *      trường/tổ chức) để đăng ký Adobe Creative Cloud — dễ bỏ sót.
 *
 * Giữ NGUYÊN 11 slug đã có trong bản trước (tái sử dụng cho bài tương ứng
 * trong cấu trúc mới): dtg102-0-0-tai-lieu, dtg102-0-1-overview,
 * dtg102-1-1-raster-vector, dtg102-4-1-illustrator-basics, dtg102-quiz-1,
 * dtg102-5-1-illustrator-advanced, dtg102-2-1-photoshop-basics,
 * dtg102-3-1-photoshop-advanced, dtg102-6-1-indesign-layout,
 * dtg102-7-1-workflow-file-formats, dtg102-8-1-capstone-project;
 * course.slug dtg102-visual-design-tools. Bài MỚI dùng lối
 * dtg102-<chương>-<số>-<mô tả>. Quiz 2-8 của bản trước không còn dùng
 * (8 chương cũ không còn tồn tại) — bị prune khi seed
 * (course.pruneSections: true).
 *
 * ⚠️ KHÔNG backtick lồng hay ${ } trong chuỗi nội dung. Bảng 60 buổi (0.5),
 * các thẻ sách và mọi bài khung (chương 2-9) dựng bằng nối chuỗi thường
 * (biến + "chuỗi"), không dùng template literal lồng.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ─────────────────────────────────────────────────────────────────────────
// Thẻ sách dùng chung (.khoi-sach/.the-sach) — nối chuỗi thường, dán lại ở
// bất kỳ bài nào nhắc tới cuốn tương ứng (HOP-DONG-SOAN-BAI, mục "SÁCH & TÀI LIỆU").
// ─────────────────────────────────────────────────────────────────────────
const sachAdobeDesignBasics =
  '<div class="khoi-sach">' +
  '<div class="the-sach chinh khong-link">' +
  '<span class="sach-ico">📗</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Adobe Design Basics</span>' +
  '<span class="sach-phu">Thomas Payne &middot; Adobe Education Exchange &middot; 2023</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">Giáo trình chính</span><span class="sach-nhan mien-phi">Miễn phí (Creative Commons)</span></span>' +
  '</span>' +
  '</div></div>';

const sachIllustratorPdf =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://helpx.adobe.com/content/dam/help/en/pdf/illustrator_reference.pdf" target="_blank" rel="noopener">' +
  '<span class="sach-ico">📘</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Adobe Illustrator CC — hướng dẫn chính thức (PDF)</span>' +
  '<span class="sach-phu">Adobe &middot; 2019</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Tải PDF →</span>' +
  '</a></div>';

const sachInDesignPdf =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://helpx.adobe.com/content/dam/help/en/pdf/indesign_reference.pdf" target="_blank" rel="noopener">' +
  '<span class="sach-ico">📙</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Adobe InDesign CC — hướng dẫn chính thức (PDF)</span>' +
  '<span class="sach-phu">Adobe &middot; 2019</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Tải PDF →</span>' +
  '</a></div>';

const sachPhotoshopPdf =
  '<div class="khoi-sach">' +
  '<a class="the-sach" href="https://helpx.adobe.com/pdf/photoshop_reference.pdf" target="_blank" rel="noopener">' +
  '<span class="sach-ico">📕</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Adobe Photoshop CC — hướng dẫn chính thức (PDF)</span>' +
  '<span class="sach-phu">Adobe &middot; 2019</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">Tham khảo</span><span class="sach-nhan mien-phi">Miễn phí</span></span>' +
  '</span>' +
  '<span class="sach-nut">Tải PDF →</span>' +
  '</a></div>';

// ─────────────────────────────────────────────────────────────────────────
// MỤC 0 — Khung FLM (đầy đủ, chính xác 100% theo Syllabus 13371)
// ─────────────────────────────────────────────────────────────────────────

const m01 = doc('dtg102-0-1-overview', '0.1 — Course profile (FLM Syllabus 13371)|||0.1 — Hồ sơ môn (FLM Syllabus 13371)',
  'Tên môn, mã môn, 3 tín chỉ, bậc học, 150h = 45h lên lớp + 105h tự học, môn tiên quyết None, phương pháp dạy-học — nguyên văn FLM, kèm sylID + số quyết định để tự đối chiếu.',
  [[
    `<span class="eyebrow">DTG102 · Section 0 · 0.1 · Course profile</span>
<h2>Course profile — Visual Design Tools (DTG102)</h2>
<p class="lead">The facts below are copied exactly as published on <strong>FLM</strong> (FPT University's syllabus system) so you can verify every number yourself.</p>
<table>
<tr><th>Field</th><th>Value (FLM)</th></tr>
<tr><td>Syllabus Name</td><td>Visual Design Tools _Công cụ thiết kế trực quan</td></tr>
<tr><td>Course Name (English)</td><td>Visual Design Tools</td></tr>
<tr><td>Subject Code</td><td>DTG102</td></tr>
<tr><td>Credits</td><td>3</td></tr>
<tr><td>Degree Level</td><td>Bachelor</td></tr>
<tr><td>Time Allocation</td><td>Study hour (150h) = 45h contact hours + 105h self-study</td></tr>
<tr><td>Pre-Requisite</td><td>None</td></tr>
<tr><td>Learning-Teaching Method</td><td>Lecture, Practice, discussion</td></tr>
<tr><td>Scoring Scale</td><td>10</td></tr>
<tr><td>Min. average mark to pass</td><td>5</td></tr>
<tr><td>Decision No.</td><td>932/QĐ-ĐHFPT dated 08/22/2025</td></tr>
<tr><td>Syllabus ID</td><td>13371</td></tr>
</table>
<div class="callout"><span class="badge">Self-check</span> Every figure above is taken verbatim from FLM — Syllabus ID <strong>13371</strong>, issued under Decision <strong>932/QĐ-ĐHFPT dated 08/22/2025</strong>. Original: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13371" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13371)</a>.</div>
<p><em>Course description (FLM):</em> The course empowers students to master 3 most common Adobe 2D tools for graphic designers — Illustrator, Photoshop, and InDesign — so they can finalize their 2D designs better. Through practical assignments, students apply concepts learned in other courses (color, typography, shape creation, photography, composition and layout) using computers and design tools. <strong>Illustrator:</strong> professional-looking graphics for web or print, line art, logos, vector graphics. <strong>Photoshop:</strong> editing and enhancing raster images (photos) — retouching, compositing, digital painting. <strong>InDesign:</strong> layouts for print and digital media (magazines, brochures).</p>
<p><em>Nguồn: FLM · Syllabus 13371 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">DTG102 · Mục 0 · 0.1 · Hồ sơ môn</span>
<h2>Hồ sơ môn — Công cụ thiết kế trực quan (DTG102)</h2>
<p class="lead">Toàn bộ thông tin dưới đây lấy nguyên văn từ <strong>FLM</strong> (hệ thống syllabus của FPTU) để bạn tự đối chiếu.</p>
<table>
<tr><th>Trường</th><th>Giá trị (FLM)</th></tr>
<tr><td>Tên syllabus</td><td>Visual Design Tools _Công cụ thiết kế trực quan</td></tr>
<tr><td>Tên môn (tiếng Anh)</td><td>Visual Design Tools</td></tr>
<tr><td>Mã môn</td><td>DTG102</td></tr>
<tr><td>Số tín chỉ</td><td>3</td></tr>
<tr><td>Bậc học</td><td>Đại học (Bachelor)</td></tr>
<tr><td>Phân bổ thời gian</td><td>150 giờ học = 45 giờ lên lớp + 105 giờ tự học</td></tr>
<tr><td>Môn tiên quyết</td><td>Không có (None)</td></tr>
<tr><td>Phương pháp dạy-học</td><td>Giảng &amp; thực hành &amp; thảo luận (Lecture, Practice, discussion)</td></tr>
<tr><td>Thang điểm</td><td>10</td></tr>
<tr><td>Điểm trung bình tối thiểu để qua môn</td><td>5</td></tr>
<tr><td>Số quyết định</td><td>932/QĐ-ĐHFPT ngày 22/08/2025</td></tr>
<tr><td>Syllabus ID</td><td>13371</td></tr>
</table>
<div class="callout"><span class="badge">Tự kiểm chứng</span> Mọi con số trên lấy nguyên văn từ FLM — Syllabus ID <strong>13371</strong>, ban hành theo Quyết định <strong>932/QĐ-ĐHFPT ngày 22/08/2025</strong>. Bản gốc: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13371" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13371)</a>.</div>
<p><em>Mô tả môn (FLM, dịch):</em> Môn học giúp sinh viên làm chủ 3 công cụ Adobe 2D phổ biến nhất cho designer đồ hoạ — Illustrator, Photoshop, InDesign — để hoàn thiện sản phẩm thiết kế 2D tốt hơn. Qua bài tập thực hành, sinh viên áp dụng các khái niệm học ở môn khác (màu sắc, typography, tạo hình, nhiếp ảnh, bố cục &amp; layout) bằng máy tính và công cụ thiết kế. <strong>Illustrator:</strong> đồ hoạ chuyên nghiệp cho web/in, line art, logo, vector. <strong>Photoshop:</strong> chỉnh sửa &amp; nâng cấp ảnh raster (ảnh chụp) — retouch, ghép ảnh, vẽ số. <strong>InDesign:</strong> dàn trang cho in ấn &amp; digital media (tạp chí, brochure).</p>
<p><em>Nguồn: FLM · Syllabus 13371 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m02 = doc('dtg102-0-2-cach-tinh-diem', '0.2 — Grading: NO final exam, 4 items, 100%|||0.2 — Cách tính điểm: KHÔNG thi cuối kỳ, 4 đầu điểm, 100%',
  'Participation 10% + Progress test 1/2/3 mỗi bài 30% = 100%. Môn KHÔNG có thi cuối kỳ. Trường không công bố CLO/tiêu chí đạt cho từng đầu điểm.',
  [[
    `<span class="eyebrow">DTG102 · Section 0 · 0.2 · Grading</span>
<h2>Grading breakdown — 4 items, total 100%</h2>
<div class="callout"><span class="badge">⚠️ Read this first</span> DTG102 has <strong>NO final exam</strong>. Your entire grade is <strong>on-going</strong>: Participation + three Progress tests. Failing one Progress test costs you <strong>30%</strong> of the total grade immediately — there is no big final exam left to compensate later, so treat every Progress test like a final.</div>
<table>
<tr><th>#</th><th>Category (FLM)</th><th>Type</th><th>Weight</th><th>Duration</th><th>Completion criteria</th><th>CLO</th></tr>
<tr><td>1</td><td>Participation <span class="sach-phu">(Điểm chuyên cần)</span></td><td>on-going</td><td>10%</td><td>trường không công bố</td><td>trường không công bố</td><td>trường không công bố</td></tr>
<tr><td>2</td><td>Progress test 1 <span class="sach-phu">(Kiểm tra tiến độ 1 — buổi 19-24)</span></td><td>on-going</td><td>30%</td><td>6 sessions</td><td>trường không công bố</td><td>trường không công bố</td></tr>
<tr><td>3</td><td>Progress test 2 <span class="sach-phu">(Kiểm tra tiến độ 2 — buổi 36-42)</span></td><td>on-going</td><td>30%</td><td>3 sessions</td><td>trường không công bố</td><td>trường không công bố</td></tr>
<tr><td>4</td><td>Progress test 3 <span class="sach-phu">(Kiểm tra tiến độ 3 — buổi 51-60)</span></td><td>on-going</td><td>30%</td><td>3 sessions</td><td>trường không công bố</td><td>trường không công bố</td></tr>
</table>
<p><strong>Total: 10% + 30% + 30% + 30% = 100%.</strong></p>
<div class="callout"><span class="badge">⚠️ FLM data gap — kept as-is</span> The FLM grading table leaves the <strong>Completion Criteria</strong> and <strong>CLO</strong> columns empty for all four items, and gives no duration for Participation. We report this as published — <strong>we did not invent</strong> a pass bar, a CLO mapping or a duration where FLM did not publish one.</div>
<p><em>Nguồn: FLM · Syllabus 13371 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">DTG102 · Mục 0 · 0.2 · Cách tính điểm</span>
<h2>Cách tính điểm — 4 đầu điểm, tổng 100%</h2>
<div class="callout"><span class="badge">⚠️ Đọc kỹ trước tiên</span> DTG102 <strong>KHÔNG có thi cuối kỳ</strong>. Toàn bộ điểm là <strong>on-going</strong>: Participation + ba Progress test. Trượt một Progress test là mất ngay <strong>30%</strong> tổng điểm — không còn kỳ thi cuối lớn để "gỡ" lại, nên hãy coi mỗi Progress test quan trọng như một kỳ thi cuối kỳ.</div>
<table>
<tr><th>#</th><th>Đầu điểm (nguyên văn FLM)</th><th>Dạng</th><th>Trọng số</th><th>Thời lượng</th><th>Tiêu chí đạt</th><th>CLO</th></tr>
<tr><td>1</td><td>Participation <span class="sach-phu">(Điểm chuyên cần)</span></td><td>xuyên suốt (on-going)</td><td>10%</td><td>trường không công bố</td><td>trường không công bố</td><td>trường không công bố</td></tr>
<tr><td>2</td><td>Progress test 1 <span class="sach-phu">(Kiểm tra tiến độ 1 — buổi 19-24)</span></td><td>xuyên suốt (on-going)</td><td>30%</td><td>6 buổi</td><td>trường không công bố</td><td>trường không công bố</td></tr>
<tr><td>3</td><td>Progress test 2 <span class="sach-phu">(Kiểm tra tiến độ 2 — buổi 36-42)</span></td><td>xuyên suốt (on-going)</td><td>30%</td><td>3 buổi</td><td>trường không công bố</td><td>trường không công bố</td></tr>
<tr><td>4</td><td>Progress test 3 <span class="sach-phu">(Kiểm tra tiến độ 3 — buổi 51-60)</span></td><td>xuyên suốt (on-going)</td><td>30%</td><td>3 buổi</td><td>trường không công bố</td><td>trường không công bố</td></tr>
</table>
<p><strong>Tổng: 10% + 30% + 30% + 30% = 100%.</strong></p>
<div class="callout"><span class="badge">⚠️ FLM để trống — giữ nguyên</span> Bảng điểm gốc của FLM để trống cột <strong>Tiêu chí đạt</strong> và <strong>CLO</strong> cho cả 4 đầu điểm, và không ghi thời lượng cho Participation. Chúng tôi nêu đúng như trường công bố — <strong>không tự bịa</strong> ngưỡng đạt, ánh xạ CLO hay thời lượng khi FLM không công bố.</div>
<p><em>Nguồn: FLM · Syllabus 13371 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m03 = doc('dtg102-0-3-clo', '0.3 — Course Learning Outcomes (6 CLO)|||0.3 — Chuẩn đầu ra môn học (6 CLO)',
  'Nguyên văn 6 CLO tiếng Anh + bản dịch, kèm ánh xạ CLO ↔ buổi: CLO2=Illustrator (buổi 2-24), CLO3=Photoshop (buổi 25-42), CLO4=InDesign (buổi 43-60), CLO5=AI, CLO6=thái độ làm việc.',
  [[
    `<span class="eyebrow">DTG102 · Section 0 · 0.3 · CLO</span>
<h2>Course Learning Outcomes — 6 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Detail (nguyên văn FLM)</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understanding of vector, bitmap, and layout principles, together with essential design principles as the basis for creating effective 2D design products.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Apply Adobe Illustrator proficiently to create vector-based design products such as logos, icons, and illustrations.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Apply Adobe Photoshop proficiently to develop bitmap-based design products such as photo edits, digital paintings, and visual effects.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Apply Adobe InDesign proficiently to produce layout-based publishing products such as brochures, magazines, and posters.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Apply AI tools and demonstrate AI literacy to collaborate effectively.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Having a positive attitude and a professional working style.</td></tr>
</table>
<div class="callout"><span class="badge">CLO ↔ session map</span>
<ul>
<li><strong>CLO1</strong> — foundational design principles, runs through every session (1-60).</li>
<li><strong>CLO2</strong> — Adobe Illustrator, sessions 2-24.</li>
<li><strong>CLO3</strong> — Adobe Photoshop, sessions 25-42.</li>
<li><strong>CLO4</strong> — Adobe InDesign, sessions 43-60.</li>
<li><strong>CLO5</strong> — AI tools/literacy, tagged on specific sessions (18, 36-39, 58-60 — see the full plan in 0.5).</li>
<li><strong>CLO6</strong> — professional attitude, tagged on assignment/project sessions.</li>
</ul></div>
<p><em>Nguồn: FLM · Syllabus 13371.</em></p>`,
    `<span class="eyebrow">DTG102 · Mục 0 · 0.3 · Chuẩn đầu ra</span>
<h2>Chuẩn đầu ra môn học — 6 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Nội dung (nguyên văn FLM)</th><th>Bản dịch</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understanding of vector, bitmap, and layout principles, together with essential design principles as the basis for creating effective 2D design products.</td><td>Hiểu nguyên lý vector, bitmap và dàn trang, cùng các nguyên lý thiết kế thiết yếu làm nền tảng tạo sản phẩm thiết kế 2D hiệu quả.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Apply Adobe Illustrator proficiently to create vector-based design products such as logos, icons, and illustrations.</td><td>Sử dụng thành thạo Adobe Illustrator để tạo sản phẩm thiết kế dạng vector như logo, icon, minh hoạ.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Apply Adobe Photoshop proficiently to develop bitmap-based design products such as photo edits, digital paintings, and visual effects.</td><td>Sử dụng thành thạo Adobe Photoshop để phát triển sản phẩm dạng bitmap như chỉnh sửa ảnh, vẽ số, hiệu ứng hình ảnh.</td></tr>
<tr><td>4</td><td>CLO4</td><td>Apply Adobe InDesign proficiently to produce layout-based publishing products such as brochures, magazines, and posters.</td><td>Sử dụng thành thạo Adobe InDesign để tạo sản phẩm xuất bản dạng dàn trang như brochure, tạp chí, poster.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Apply AI tools and demonstrate AI literacy to collaborate effectively.</td><td>Áp dụng công cụ AI và thể hiện năng lực AI để cộng tác hiệu quả.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Having a positive attitude and a professional working style.</td><td>Có thái độ tích cực và phong cách làm việc chuyên nghiệp.</td></tr>
</table>
<div class="callout"><span class="badge">Ánh xạ CLO ↔ buổi</span>
<ul>
<li><strong>CLO1</strong> — nguyên lý thiết kế nền tảng, xuyên suốt mọi buổi (1-60).</li>
<li><strong>CLO2</strong> — Adobe Illustrator, buổi 2-24.</li>
<li><strong>CLO3</strong> — Adobe Photoshop, buổi 25-42.</li>
<li><strong>CLO4</strong> — Adobe InDesign, buổi 43-60.</li>
<li><strong>CLO5</strong> — công cụ/năng lực AI, gắn ở một số buổi cụ thể (18, 36-39, 58-60 — xem bảng đủ 60 buổi ở mục 0.5).</li>
<li><strong>CLO6</strong> — thái độ làm việc chuyên nghiệp, gắn ở các buổi assignment/đồ án.</li>
</ul></div>
<p><em>Nguồn: FLM · Syllabus 13371.</em></p>`,
  ]]);

const m04 = doc('dtg102-0-0-tai-lieu', '0.4 — Course materials & tools (4 items)|||0.4 — Giáo trình & công cụ (4 mục)',
  'Đủ 4 tài liệu FLM dạng thẻ sách: 1 giáo trình chính (không có link, trường không công bố) + 3 PDF Adobe tham khảo (có link thật). Công cụ: tài khoản Adobe CÁ NHÂN, không dùng tài khoản trường.',
  [[
    `<span class="eyebrow">DTG102 · Section 0 · 0.4 · Materials &amp; tools</span>
<h2>Course materials &amp; tools</h2>
<p class="lead">All <strong>4</strong> official FLM materials for DTG102. The <strong>main material</strong> (Is Main Material = True) is <em>Adobe Design Basics</em>; the other three are official Adobe reference PDFs.</p>
` + sachAdobeDesignBasics + `
` + sachIllustratorPdf + `
` + sachInDesignPdf + `
` + sachPhotoshopPdf + `
<div class="callout"><span class="badge">⚠️ FLM data quirks — kept as-is</span>
<ul>
<li><strong>No link for the main material.</strong> FLM does not publish a URL for <em>Adobe Design Basics</em> — only the title, author and "Creative Commons licensing" note. We are not guessing one.</li>
<li><strong>The raw FLM table glues the link onto the title and misspells it.</strong> As published, material #2 reads <em>"Adobe Illustator CChttps://helpx.adobe.com/..."</em> (missing the letter "r" in "Illustrator") and material #4 reads <em>"Adobe Photoshops CChttps://..."</em> (an extra "s" in "Photoshops"). Above, we separated the title from the link and fixed the spelling — this note tells you FLM's own table looks different if you check it yourself on flm.fpt.edu.vn.</li>
</ul></div>
<h3>Tools (FLM, verbatim)</h3>
<ol>
<li>The school prepares (installed): classroom with chairs, desks, a large monitor with HDMI connection for demo/presentation.</li>
<li>Student prepares: notebook/sketchbook, pens and pencils; a laptop for graphic design with Adobe Photoshop, Illustrator and InDesign installed; a suitable Generative AI tool.</li>
</ol>
<div class="callout"><span class="badge">⚠️ Important — easy to miss</span> FLM states explicitly: <strong>"Students are required to use their personal account (not the university or organizational account) to register for an Adobe account."</strong> Registering Adobe Creative Cloud with your FPTU email/account is against this instruction — use a personal email.</div>
<p><em>Nguồn: FLM · Syllabus 13371.</em></p>`,
    `<span class="eyebrow">DTG102 · Mục 0 · 0.4 · Giáo trình &amp; công cụ</span>
<h2>Giáo trình &amp; công cụ</h2>
<p class="lead">Đủ <strong>4</strong> tài liệu chính thức của FLM cho DTG102. Tài liệu <strong>chính</strong> (Is Main Material = True) là <em>Adobe Design Basics</em>; 3 tài liệu còn lại là PDF hướng dẫn chính thức của Adobe, dùng để tham khảo.</p>
` + sachAdobeDesignBasics + `
` + sachIllustratorPdf + `
` + sachInDesignPdf + `
` + sachPhotoshopPdf + `
<div class="callout"><span class="badge">⚠️ FLM ghi vậy, giữ nguyên</span>
<ul>
<li><strong>Tài liệu chính KHÔNG có link.</strong> FLM không công bố URL cho <em>Adobe Design Basics</em> — chỉ ghi tên, tác giả và ghi chú "Creative Commons licensing". Ở đây không tự đoán link.</li>
<li><strong>Bảng gốc FLM dán link dính vào tên sách và gõ sai.</strong> Nguyên văn, tài liệu #2 ghi <em>"Adobe Illustator CChttps://helpx.adobe.com/..."</em> (thiếu chữ "r" trong "Illustrator") và tài liệu #4 ghi <em>"Adobe Photoshops CChttps://..."</em> (thừa chữ "s" trong "Photoshops"). Ở trên, chúng tôi đã tách tên khỏi link và sửa lỗi chính tả — ghi chú này để bạn biết bảng gốc trên flm.fpt.edu.vn trông khác nếu tự vào kiểm tra.</li>
</ul></div>
<h3>Công cụ (nguyên văn FLM, dịch)</h3>
<ol>
<li>Trường chuẩn bị (đã lắp đặt): phòng học có bàn ghế, màn hình lớn kết nối HDMI để demo/trình chiếu.</li>
<li>Sinh viên chuẩn bị: sổ tay/sketchbook, bút mực &amp; bút chì; laptop thiết kế đồ hoạ có cài Adobe Photoshop, Illustrator, InDesign; một công cụ Generative AI phù hợp.</li>
</ol>
<div class="callout"><span class="badge">⚠️ Quan trọng — dễ bỏ sót</span> FLM ghi rõ: <strong>"Sinh viên phải dùng tài khoản cá nhân (không phải tài khoản trường hay tổ chức) để đăng ký tài khoản Adobe."</strong> Đăng ký Adobe Creative Cloud bằng email/tài khoản FPTU là làm trái hướng dẫn này — hãy dùng email cá nhân.</div>
<p><em>Nguồn: FLM · Syllabus 13371.</em></p>`,
  ]]);

// ── 0.5 — Kế hoạch 60 buổi: dựng bằng nối chuỗi thường (KHÔNG template lồng) ──
const buoiData = [
  [1, "INTRODUCTION — Introduction to Adobe Illustrator, Photoshop, InDesign and other Adobe graphic design applications; Studying plan; How to install, save, export, submit assignments; Introduction to AI in Design; The Future of AI in Design; Ethical Considerations in AI-Assisted Design; AI and Human Creativity", "NHẬP MÔN — Giới thiệu Illustrator, Photoshop, InDesign &amp; các phần mềm Adobe khác; Kế hoạch học; Cách cài đặt, lưu, xuất, nộp bài; Nhập môn AI trong thiết kế; Tương lai AI trong thiết kế; Đạo đức khi dùng AI hỗ trợ thiết kế; AI &amp; sự sáng tạo của con người", "CLO1", "1.1"],
  [2, "PART 1: ADOBE ILLUSTRATOR — Introduction about Illustrator; The work area: Control panel, Working with panels, Tool panel; Save, export, place, open file; Artboards; Navigation", "PHẦN 1: ADOBE ILLUSTRATOR — Giới thiệu Illustrator; Vùng làm việc: thanh Control, panel, bảng Tool; Lưu, xuất, place, mở file; Artboard; Điều hướng", "CLO1, CLO2", "1.1"],
  [3, "BASIC OPERATIONS WITH VECTOR OBJECT — Selection Tool &amp; Direct Selection Tool; Magic Wand; Group &amp; ungroup; Lock &amp; unlock; Hide &amp; show; Align &amp; arrange objects", "THAO TÁC CƠ BẢN VỚI ĐỐI TƯỢNG VECTOR — Selection Tool &amp; Direct Selection Tool; Magic Wand; Group &amp; ungroup; Lock &amp; unlock; Hide &amp; show; Align &amp; arrange đối tượng", "CLO1, CLO2", "1.2"],
  [4, "BASIC SHAPES — Basic Shape Tools; Stroke and Fill; Line segments; Joining paths; Modifying basic shapes", "HÌNH CƠ BẢN — Công cụ Shape cơ bản; Stroke &amp; Fill; Đoạn thẳng; Nối path; Chỉnh sửa hình cơ bản", "CLO1, CLO2", "1.2"],
  [5, "PATHFINDER — Shape Modes vs Pathfinders; Shape builder; Blob Brush Tool", "PATHFINDER — Shape Modes so với Pathfinders; Shape Builder; Blob Brush Tool", "CLO1, CLO2", "1.3"],
  [6, "TRANSFORMING OBJECTS — Scaling; Reflecting; Distorting; Shearing; Eraser Tool; Making multiple transformations", "BIẾN ĐỔI ĐỐI TƯỢNG — Scale; Reflect; Distort; Shear; Eraser Tool; Biến đổi nhiều lần", "CLO1, CLO2", "1.3"],
  [7, "DRAWING WITH THE PEN TOOL / PENCIL TOOL — Creating straight lines; Creating curved paths; Curves and corner anchor points; Selecting and manipulating curves; Pencil tool; Changing pencil tool options; Smooth tool; Width tool", "VẼ BẰNG PEN TOOL / PENCIL TOOL — Vẽ đường thẳng; Vẽ path cong; Đường cong &amp; anchor point góc; Chọn &amp; chỉnh đường cong; Pencil tool; Đổi tuỳ chọn Pencil; Smooth tool; Width tool", "CLO1, CLO2", "1.3"],
  [8, "COLOR — CMYK vs RGB; Color panel; Color guide; Creating and saving custom colors; Swatch libraries; Spot colors; Live paint; Edit color (recolor artwork)", "MÀU SẮC — CMYK so với RGB; Color panel; Color guide; Tạo &amp; lưu màu tuỳ chỉnh; Thư viện Swatch; Spot color; Live Paint; Edit Color (recolor artwork)", "CLO1, CLO2", "1.4"],
  [9, "TYPE — Importing text files; Using columns; Threading Text; Character Panel; Character Styles; Paragraph Panel; Paragraph style; Type on a path; Outlining type", "CHỮ (TYPE) — Nhập file văn bản; Dùng cột; Threading Text; Character Panel; Character Styles; Paragraph Panel; Paragraph Style; Type on a Path; Outline chữ", "CLO1, CLO2", "1.4"],
  [10, "LAYERS — Creating layers; Moving layers; Locking layers; Viewing layers; Merging layers; Isolation mode", "LAYERS — Tạo layer; Di chuyển layer; Khoá layer; Xem layer; Gộp layer; Isolation mode", "CLO1, CLO2", "1.4"],
  [11, "BRUSHES — Brush libraries; Creating own brushes; Pattern brushes", "BRUSHES (CỌ) — Thư viện Brush; Tạo brush riêng; Pattern brush", "CLO1, CLO2", "2.1"],
  [12, "GRADIENTS — Linear vs Radial Gradients; Gradient Panel; Changing colors/direction of gradient; Transparency and gradients; Gradient Tool. BLENDS — Blending objects; Specified Steps vs Smooth Color; Modifying blends", "GRADIENT — Linear so với Radial; Gradient Panel; Đổi màu/hướng gradient; Transparency &amp; gradient; Gradient Tool. BLEND — Blend đối tượng; Specified Steps so với Smooth Color; Chỉnh blend", "CLO1, CLO2", "2.1"],
  [13, "SYMBOLS — Symbol libraries; Creating symbols; Editing symbols; Applying a symbol instance; Breaking link to symbol; Symbol sprayer tool", "SYMBOLS — Thư viện Symbol; Tạo symbol; Sửa symbol; Áp dụng symbol instance; Ngắt liên kết symbol; Symbol Sprayer Tool", "CLO1, CLO2", "2.2"],
  [14, "MASK — Clipping Masks (Shapes); Opacity mask; Draw inside", "MASK — Clipping Mask (hình); Opacity mask; Draw Inside", "CLO1, CLO2", "2.2"],
  [15, "WORKING WITH BITMAP IMAGES — Place Images; Link/relink/embed link; Image trace. PATTERNS — Creating and Applying Pattern Swatches; Scaling and Rotating Patterns", "LÀM VIỆC VỚI ẢNH BITMAP — Place ảnh; Link/relink/embed; Image Trace. PATTERN — Tạo &amp; áp Pattern Swatch; Scale &amp; xoay pattern", "CLO1, CLO2", "2.3"],
  [16, "EFFECTS — Appearance Panel; Transparency; Blending Modes; Drop Shadows; Arrowheads; Graphic Styles", "EFFECTS (HIỆU ỨNG) — Appearance Panel; Transparency; Blending Mode; Drop Shadow; Arrowhead; Graphic Styles", "CLO1, CLO2", "2.3"],
  [17, "3D OBJECTS — 3D Extrude &amp; Bevel; Modifying 3D object; Mapping artwork to 3D object; Lighting and Shadows for 3D Objects", "ĐỐI TƯỢNG 3D — 3D Extrude &amp; Bevel; Chỉnh đối tượng 3D; Map artwork lên đối tượng 3D; Ánh sáng &amp; đổ bóng cho đối tượng 3D", "CLO1, CLO2", "2.4"],
  [18, "Gen AI Tool in Illustrator — Text to Vector Graphic; Text to Pattern; Generative Shape Fill; Generative Expand; Generative Recolor", "Công cụ Gen AI trong Illustrator — Text to Vector Graphic; Text to Pattern; Generative Shape Fill; Generative Expand; Generative Recolor", "CLO1, CLO2", "2.5"],
  [19, "ASSIGNMENT 1: Part 1 — in class, by instructor", "ASSIGNMENT 1: Phần 1 — làm tại lớp, dưới hướng dẫn giảng viên", "CLO1, CLO2, CLO6", "3.1"],
  [20, "PROGRESS TEST 1: Part 1 — in class, by instructor", "PROGRESS TEST 1: Phần 1 — làm tại lớp, dưới hướng dẫn giảng viên", "CLO1, CLO2, CLO6", "3.2"],
  [21, "ASSIGNMENT 1: Part 1 — in class, by instructor ⚠️ (giống hệt buổi 19, giữ nguyên bảng gốc FLM)", "ASSIGNMENT 1: Phần 1 — làm tại lớp, dưới hướng dẫn giảng viên ⚠️ (giống hệt buổi 19, giữ nguyên bảng gốc FLM)", "CLO1, CLO2, CLO6", "3.1"],
  [22, "ASSIGNMENT 1: Part 2 — in class, by instructor", "ASSIGNMENT 1: Phần 2 — làm tại lớp, dưới hướng dẫn giảng viên", "CLO1, CLO2, CLO6", "3.3"],
  [23, "ASSIGNMENT 1: Part 2 — in class, by instructor ⚠️ (giống hệt buổi 22, giữ nguyên bảng gốc FLM)", "ASSIGNMENT 1: Phần 2 — làm tại lớp, dưới hướng dẫn giảng viên ⚠️ (giống hệt buổi 22, giữ nguyên bảng gốc FLM)", "CLO1, CLO2, CLO6", "3.3"],
  [24, "PROGRESS TEST 1: Part 2 — in class, by instructor", "PROGRESS TEST 1: Phần 2 — làm tại lớp, dưới hướng dẫn giảng viên", "CLO1, CLO2, CLO6", "3.4"],
  [25, "PART 2: ADOBE PHOTOSHOP — Introduction about Photoshop; Usage; Pros and cons", "PHẦN 2: ADOBE PHOTOSHOP — Giới thiệu Photoshop; Ứng dụng; Ưu &amp; nhược điểm", "CLO1, CLO3", "4.1"],
  [26, "PHOTOSHOP INTERFACE — UI Elements; Customization; Navigation: Zooming, panning. ORGANIZING FILES — Create new file (new file properties); Save and export: PSD, PDF, JPEG, PNG…; Open and import", "GIAO DIỆN PHOTOSHOP — Thành phần UI; Tuỳ biến; Điều hướng: zoom, pan. TỔ CHỨC FILE — Tạo file mới; Lưu &amp; xuất: PSD, PDF, JPEG, PNG…; Mở &amp; import", "CLO1, CLO3", "4.1"],
  [27, "LAYER BASIC — About Photoshop layers; Layers panel overview; Convert background and Photoshop layers; Duplicate Photoshop layers", "LAYER CƠ BẢN — Về layer trong Photoshop; Tổng quan Layers panel; Đổi qua lại background &amp; layer; Nhân đôi layer", "CLO1, CLO3", "4.2"],
  [28, "DRAW &amp; EDITING — Drawing and painting tool; Move, transform, crop; Free transform, warp, distort; Selection tools; Select and mask; Alternative selecting method; Basic operations with selection; Select Object", "VẼ &amp; CHỈNH SỬA — Công cụ vẽ &amp; tô; Move, transform, crop; Free Transform, warp, distort; Công cụ chọn; Select and Mask; Cách chọn thay thế; Thao tác cơ bản với vùng chọn; Select Object", "CLO1, CLO3", "4.3"],
  [29, "TEXT &amp; TYPOGRAPHY — Type tool; Type menu; Editing type; Rasterize Type", "CHỮ &amp; TYPOGRAPHY — Type tool; Menu Type; Sửa chữ; Rasterize Type", "CLO1, CLO3", "4.4"],
  [30, "IMAGE ADJUSTMENT — Image Adjustment; Adjustment Layer", "ĐIỀU CHỈNH ẢNH — Image Adjustment; Adjustment Layer", "CLO1, CLO3", "4.4"],
  [31, "FEEDBACK ON HOMEWORK. LAYER ADVANCED — Create and manage layers and groups; Select, group, and link layers; Place images into frames; Layer opacity and blending; Apply Smart Filters", "PHẢN HỒI BÀI TẬP. LAYER NÂNG CAO — Tạo &amp; quản lý layer/group; Chọn, group, link layer; Đặt ảnh vào frame; Opacity &amp; blending của layer; Áp Smart Filter", "CLO1, CLO3", "5.1"],
  [32, "BLEND MODE — What is blend?; Blending modes in Photoshop (Darken, Lighten, Contrast, Coloring modes); Blend If", "BLEND MODE — Blend là gì?; Các blending mode trong Photoshop (Darken, Lighten, Contrast, Coloring); Blend If", "CLO1, CLO3", "5.1"],
  [33, "MASK IN PHOTOSHOP — Clipping mask; Layer Mask", "MASK TRONG PHOTOSHOP — Clipping mask; Layer mask", "CLO1, CLO3", "5.2"],
  [34, "MASK IN PHOTOSHOP — Selection advanced: alternative selecting method, using Select &amp; Mask to refine selection", "MASK TRONG PHOTOSHOP (tiếp) — Vùng chọn nâng cao: cách chọn thay thế, dùng Select &amp; Mask để tinh chỉnh vùng chọn", "CLO1, CLO3", "5.2"],
  [35, "RETOUCH — Retouching techniques (blemish removal: spot healing, healing brush, patch tool…); Manipulating image; Fill content aware", "RETOUCH — Kỹ thuật retouch (xoá khuyết điểm: spot healing, healing brush, patch tool…); Chỉnh sửa ảnh; Fill Content-Aware", "CLO1, CLO3", "5.3"],
  [36, "HOMEWORK INSTRUCTION — Assignment Objective; Gather Resources; Add Images and Text. AI-POWERED DESIGN PROJECTS — Generate Idea; Create AI product for reference; Research and Analysis: Layout, font, color, image", "HƯỚNG DẪN BÀI TẬP — Mục tiêu bài tập; Gom tài nguyên; Thêm ảnh &amp; chữ. DỰ ÁN THIẾT KẾ DÙNG AI — Sinh ý tưởng; Tạo sản phẩm AI tham khảo; Nghiên cứu &amp; phân tích: layout, font, màu, ảnh", "CLO1, CLO3, CLO5, CLO6", "6.1"],
  [37, "FEEDBACK ON HOMEWORK — Discussion, comments on previous lesson's assessment; Homework instruction", "PHẢN HỒI BÀI TẬP — Thảo luận, nhận xét bài đánh giá buổi trước; Hướng dẫn bài tập", "CLO1, CLO3, CLO5, CLO6", "6.2"],
  [38, "Gen AI Tool in Photoshop — Generative Fill; Generative Expand; Generate Similar; AI Object Selection; AI Remove Tool; Harmonize", "Công cụ Gen AI trong Photoshop — Generative Fill; Generative Expand; Generate Similar; AI Object Selection; AI Remove Tool; Harmonize", "CLO1, CLO3", "5.4"],
  [39, "ASSIGN ASSIGNMENT 2 — Bringing it all together: Create a comprehensive project", "GIAO ASSIGNMENT 2 — Tổng hợp kiến thức: tạo một dự án toàn diện", "CLO1, CLO3, CLO5, CLO6", "6.2"],
  [40, "ANIMATION IN PHOTOSHOP — Timeline Panel (Video timeline); Frame Animation. PROGRESS TEST 2 — Q&amp;A", "ANIMATION TRONG PHOTOSHOP — Timeline Panel (Video timeline); Frame Animation. PROGRESS TEST 2 — Hỏi đáp", "CLO1, CLO3", "6.3"],
  [41, "ANIMATION IN PHOTOSHOP — Timeline Panel (Video timeline); Frame Animation. PROGRESS TEST 2 — Q&amp;A ⚠️ (giống hệt buổi 40, giữ nguyên bảng gốc FLM)", "ANIMATION TRONG PHOTOSHOP — Timeline Panel (Video timeline); Frame Animation. PROGRESS TEST 2 — Hỏi đáp ⚠️ (giống hệt buổi 40, giữ nguyên bảng gốc FLM)", "CLO1, CLO3", "6.3"],
  [42, "ANIMATION IN PHOTOSHOP — Timeline Panel (Video timeline); Frame Animation. PROGRESS TEST 2 — Q&amp;A ⚠️ (giống hệt buổi 40-41, giữ nguyên bảng gốc FLM)", "ANIMATION TRONG PHOTOSHOP — Timeline Panel (Video timeline); Frame Animation. PROGRESS TEST 2 — Hỏi đáp ⚠️ (giống hệt buổi 40-41, giữ nguyên bảng gốc FLM)", "CLO1, CLO3", "6.3"],
  [43, "PART 3: ADOBE INDESIGN — Introduction about InDesign; Overview of InDesign's purpose and capabilities; Comparison with Photoshop and Illustrator", "PHẦN 3: ADOBE INDESIGN — Giới thiệu InDesign; Tổng quan mục đích &amp; khả năng; So sánh với Photoshop &amp; Illustrator", "CLO1, CLO4", "7.1"],
  [44, "INDESIGN BASIC — Interface and navigation; Create new document, save, open and organize files; Document Setup", "INDESIGN CƠ BẢN — Giao diện &amp; điều hướng; Tạo document mới, lưu, mở, tổ chức file; Document Setup", "CLO1, CLO4", "7.1"],
  [45, "SHAPE &amp; FRAME — Create frame / create multiframe; Compound frame/shape; Transform and Modify; Apply effect", "SHAPE &amp; FRAME — Tạo frame / multiframe; Compound frame/shape; Transform &amp; Modify; Áp effect", "CLO1, CLO4", "7.2"],
  [46, "WORKING WITH IMAGE — Place / Place multi image; Place into frame; Edit Frame and Edit image content; Auto Fitting; Relink and Embed link", "LÀM VIỆC VỚI ẢNH — Place / Place multi image; Place vào frame; Edit Frame &amp; Edit image content; Auto Fitting; Relink &amp; Embed link", "CLO1, CLO4", "7.2"],
  [47, "WORKING WITH TEXT — Place text; Placeholder text; Format text with Character Panel; Control text frame; Auto size text frame; Text on a path", "LÀM VIỆC VỚI CHỮ — Place text; Placeholder text; Format chữ bằng Character Panel; Điều khiển text frame; Auto Size text frame; Text on a Path", "CLO1, CLO4", "7.3"],
  [48, "WORKING WITH PARAGRAPH — Format paragraph with Paragraph Panel; Text Thread; Text into frame/shape; Text wrap; Dropcap", "LÀM VIỆC VỚI ĐOẠN VĂN — Format đoạn văn bằng Paragraph Panel; Text Thread; Text vào frame/shape; Text Wrap; Dropcap", "CLO1, CLO4", "7.3"],
  [49, "ANALYZING THE PREVIOUS LESSON'S ASSESSMENT — Discussion, comments on previous lesson's assessment", "PHÂN TÍCH ĐÁNH GIÁ BUỔI TRƯỚC — Thảo luận, nhận xét bài đánh giá buổi trước", "CLO1, CLO4", "8.1"],
  [50, "HOMEWORK INSTRUCTION — Assignment Objective; Gather Resources; Images and Text", "HƯỚNG DẪN BÀI TẬP — Mục tiêu bài tập; Gom tài nguyên; Ảnh &amp; chữ", "CLO1, CLO4", "8.1"],
  [51, "PREPARE FOR ASSIGNMENT 3 — Practicing using InDesign; Doing similar exercises as in the test; Checking on document layout and organization; Preparing documents", "CHUẨN BỊ CHO ASSIGNMENT 3 — Luyện dùng InDesign; Làm bài tập tương tự đề thi; Kiểm tra bố cục &amp; tổ chức document; Chuẩn bị tài liệu", "CLO1, CLO4", "8.1"],
  [52, "PAGE PANEL — Page Thumbnails; Create New Page, Delete Page, Move Page; Page Attributes; View Pages in Two-Up. ADVANCED PAGE LAYOUT TECHNIQUES — Master/parent Pages; Page numbering and Sections; Grid &amp; Guides", "PAGE PANEL — Page Thumbnail; Tạo/Xoá/Di chuyển trang; Page Attributes; Xem trang kiểu Two-Up. KỸ THUẬT DÀN TRANG NÂNG CAO — Master/Parent Page; Đánh số trang &amp; Section; Grid &amp; Guide", "CLO1, CLO4", "8.2"],
  [53, "GUIDELINE RULER &amp; GRID — Margin; Bleed; Column grid; Modular grid; Baseline grid; Guideline", "GUIDELINE, RULER &amp; GRID — Margin; Bleed; Column grid; Modular grid; Baseline grid; Guideline", "CLO1, CLO4", "8.2"],
  [54, "TABLE — Create and design a table; Apply different style and formatting", "TABLE — Tạo &amp; thiết kế bảng; Áp style &amp; định dạng khác nhau", "CLO1, CLO4", "8.3"],
  [55, "STYLE — Character styles, paragraph styles and object styles; Color management", "STYLE — Character style, paragraph style, object style; Color management", "CLO1, CLO4", "8.3"],
  [56, "INTERACTIVE DOCUMENT EXERCISE — Create hyperlinks and bookmarks within a document; Incorporate buttons for interactive navigation", "BÀI TẬP TÀI LIỆU TƯƠNG TÁC — Tạo hyperlink &amp; bookmark trong document; Thêm button điều hướng tương tác", "CLO1, CLO4", "8.4"],
  [57, "ADVANCED EXPORT OPTIONS — Exporting documents for print and digital media", "TUỲ CHỌN XUẤT NÂNG CAO — Xuất document cho in &amp; digital media", "CLO1, CLO4", "8.4"],
  [58, "Gen AI Tool in InDesign — Generative Fill text and shape; Text to Image; Generative Expand", "Công cụ Gen AI trong InDesign — Generative Fill text &amp; shape; Text to Image; Generative Expand", "CLO1, CLO4", "8.5"],
  [59, "ASSIGNMENT 3 — Finalizing progress test 3 (developing and executing ideas using AI and digital tools)", "ASSIGNMENT 3 — Hoàn thiện progress test 3 (phát triển &amp; thực hiện ý tưởng bằng AI &amp; công cụ số)", "CLO1, CLO4, CLO5, CLO6", "9.1"],
  [60, "ASSIGNMENT 3 — Finalizing progress test 3. WRAP UP &amp; FOLLOW UP — Wrap Up Learning; Practice and Apply; Seek Feedback and Guidance; Explore Advanced Techniques; Stay Updated; Plan Next Steps", "ASSIGNMENT 3 — Hoàn thiện progress test 3. TỔNG KẾT &amp; BƯỚC TIẾP — Tổng kết việc học; Luyện tập &amp; áp dụng; Xin phản hồi &amp; hướng dẫn; Khám phá kỹ thuật nâng cao; Cập nhật xu hướng; Lên kế hoạch tiếp theo", "CLO1, CLO4, CLO5, CLO6", "9.1"],
];
const rowHtml = (r) => '<tr><td>Buổi ' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>';
const buoiRowsHtml = buoiData.map(rowHtml).join('');
const buoiTableEn =
  '<table><tr><th>Session</th><th>Topic (English, verbatim FLM)</th><th>Chủ đề (Việt)</th><th>CLO</th><th>Lesson on site</th></tr>' +
  buoiRowsHtml + '</table>';
const buoiTableVi =
  '<table><tr><th>Buổi</th><th>Chủ đề (Anh, nguyên văn FLM)</th><th>Chủ đề (Việt)</th><th>CLO</th><th>Bài trên web</th></tr>' +
  buoiRowsHtml + '</table>';

const m05 = doc('dtg102-0-5-ke-hoach-60-buoi', '0.5 — Full 60-session plan|||0.5 — Kế hoạch đủ 60 buổi',
  'Bảng đầy đủ 60 buổi FLM, giữ nguyên chủ đề tiếng Anh + thêm cột tiếng Việt + cột "Bài trên web". Nêu rõ buổi 19&amp;21, 22-23, 40-41-42 lặp lại y nguyên trong bảng gốc.',
  [[
    '<span class="eyebrow">DTG102 · Section 0 · 0.5 · 60-session plan</span>' +
    '<h2>Full 60-session plan (FLM, verbatim topics)</h2>' +
    '<p class="lead">All 45 contact hours (60 sessions) exactly as scheduled by FLM. The last column shows which lesson on this site covers each session — Chapter 1 (sessions 1-10) is fully taught; Chapters 2-9 are a framework (skeleton) for now.</p>' +
    buoiTableEn +
    '<div class="callout"><span class="badge">⚠️ Kept as FLM published it</span><p>Sessions <strong>19 and 21</strong> are word-for-word identical ("Assignment 1: Part 1"), sessions <strong>22-23</strong> are identical ("Part 2"), and sessions <strong>40-41-42</strong> repeat verbatim ("Animation in Photoshop. Progress Test 2 — Q&amp;A"). This looks like a scheduling/typing quirk in FLM\'s own table — we report it exactly as published rather than silently merging or correcting it.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13371 · thu thập 19/09/2026.</em></p>',
    '<span class="eyebrow">DTG102 · Mục 0 · 0.5 · Kế hoạch 60 buổi</span>' +
    '<h2>Kế hoạch đủ 60 buổi (nguyên văn chủ đề FLM)</h2>' +
    '<p class="lead">Đủ 45 giờ lên lớp (60 buổi) đúng như FLM xếp lịch. Cột cuối cho biết bài nào trên web phủ buổi đó — Chương 1 (buổi 1-10) dạy đầy đủ; Chương 2-9 hiện là khung, sẽ bổ sung chi tiết sau.</p>' +
    buoiTableVi +
    '<div class="callout"><span class="badge">⚠️ Giữ nguyên như FLM công bố</span><p>Buổi <strong>19 và 21</strong> giống hệt nhau từng chữ ("Assignment 1: Part 1"), buổi <strong>22-23</strong> cũng giống hệt ("Part 2"), và buổi <strong>40-41-42</strong> lặp lại nguyên văn ("Animation in Photoshop. Progress Test 2 — Q&amp;A"). Đây nhiều khả năng là một kiểu lặp lịch/gõ trong chính bảng của FLM — chúng tôi nêu đúng như trường công bố, KHÔNG tự gộp hay sửa lại.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13371 · thu thập 19/09/2026.</em></p>',
  ]]);

const m06 = doc('dtg102-0-6-nhiem-vu-sinh-vien', '0.6 — Student tasks (8 items, verbatim)|||0.6 — Nhiệm vụ sinh viên (nguyên văn 8 gạch đầu dòng)',
  'Nguyên văn 8 nhiệm vụ sinh viên theo FLM (StudentTasks), kèm bản dịch — có cả quy định không dùng điện thoại/chat trong giờ và dự ≥80% buổi.',
  [[
    `<span class="eyebrow">DTG102 · Section 0 · 0.6 · Student tasks</span>
<h2>Student tasks (FLM, verbatim)</h2>
<ul>
<li>Read textbook and install software before coming to class.</li>
<li>Complete assignments in class, submit online throughout LMS or Classroom platform.</li>
<li>Access the course website (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) for up-to-date information and material of the course.</li>
<li>Actively participate into class, review and comments to classmate works, ask instructor questions, bring into class everyday samples for references.</li>
<li>Complete homework and other requirements by instructors.</li>
<li>Using laptop in class only for taking note, research and doing assignment purposes.</li>
<li>No talking, surfing, chatting, gaming, facebooking, using phone etc. while the teacher giving instruction.</li>
<li>Present at least 80% class attendance in order to pass the course.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13371.</em></p>`,
    `<span class="eyebrow">DTG102 · Mục 0 · 0.6 · Nhiệm vụ sinh viên</span>
<h2>Nhiệm vụ sinh viên (nguyên văn FLM, dịch)</h2>
<ul>
<li>Đọc giáo trình và cài phần mềm trước khi đến lớp.</li>
<li>Hoàn thành bài tập tại lớp, nộp online qua LMS hoặc nền tảng Classroom.</li>
<li>Truy cập trang môn học (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) để cập nhật thông tin &amp; tài liệu môn học.</li>
<li>Tham gia tích cực trong lớp, nhận xét/góp ý bài của bạn học, hỏi giảng viên, mang mẫu tham khảo tới lớp mỗi ngày.</li>
<li>Hoàn thành bài tập về nhà &amp; yêu cầu khác của giảng viên.</li>
<li>Chỉ dùng laptop trong lớp để ghi chú, tra cứu &amp; làm bài tập.</li>
<li>Không nói chuyện, lướt mạng, chat, chơi game, vào Facebook, dùng điện thoại... trong lúc giảng viên đang hướng dẫn.</li>
<li>Dự lớp tối thiểu 80% mới đủ điều kiện qua môn.</li>
</ul>
<p><em>Nguồn: FLM · Syllabus 13371.</em></p>`,
  ]]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1-10): Nhập môn + Adobe Illustrator cơ bản tới
// Layers. Dạy được ngay, song ngữ, thao tác cụ thể (menu/panel/phím tắt),
// vector vs bitmap, CMYK vs RGB, lỗi hay gặp, bài tập. Kết chương bằng quiz.
// ─────────────────────────────────────────────────────────────────────────

const l11 = doc('dtg102-1-1-raster-vector', '1.1 — Getting started: Adobe apps, AI in design & Illustrator basics|||1.1 — Nhập môn: bộ Adobe, AI trong thiết kế & giao diện Illustrator',
  'Buổi 1-2, CLO1/CLO2. Ba phần mềm Adobe & khi nào dùng cái nào; raster vs vector; AI trong thiết kế; giao diện Illustrator (Control panel, panel, Tool panel), Artboard, save/export/place/open, điều hướng.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 1 · Lesson 1.1 · Session 1-2 · CLO1, CLO2</span>
<h2>Getting started: Adobe apps, AI in design &amp; Illustrator basics</h2>
<p class="lead">FLM topics (sessions 1-2): <em>"Introduction to Adobe Illustrator, Photoshop, InDesign... Introduction to AI in Design"</em> and <em>"PART 1: ADOBE ILLUSTRATOR — Introduction, work area, save/export/place/open, Artboards, Navigation"</em>.</p>
` + sachAdobeDesignBasics + `
<h3>Three tools, three jobs</h3>
<table>
<tr><th>Tool</th><th>Image type</th><th>Best for</th></tr>
<tr><td><strong>Illustrator</strong></td><td>Vector (math paths)</td><td>Logos, icons, illustrations — anything scaled to any size</td></tr>
<tr><td><strong>Photoshop</strong></td><td>Raster (pixel grid)</td><td>Photos, retouching, digital painting, compositing</td></tr>
<tr><td><strong>InDesign</strong></td><td>Layout (frames)</td><td>Multi-page documents: brochures, magazines, posters</td></tr>
</table>
<h3>Raster vs vector — the foundation of the whole course</h3>
<p><strong>Raster (bitmap)</strong> is a grid of colored pixels; zoom in far enough and you see squares — enlarging a raster image beyond its resolution makes it blurry. <strong>Vector</strong> is a set of mathematical paths (points + curves); it scales to any size with zero quality loss, which is why logos are always built in Illustrator, never Photoshop.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If it is a photograph, it MUST be raster (Photoshop) — there is no alternative. If it must scale cleanly (logo, icon), build it in vector (Illustrator).</div>
<h3>AI in design (FLM session 1)</h3>
<p>Generative AI can speed up moodboards, background removal and rough concepting, but it does not replace understanding of composition, color and typography — those fundamentals decide whether an AI-assisted result actually looks professional. FLM's syllabus explicitly flags two things to keep in mind: <strong>ethical considerations</strong> (attribution, bias, using AI output responsibly in coursework) and <strong>AI vs human creativity</strong> — AI is a tool you direct, not a replacement for design judgment.</p>
<h3>The Illustrator work area</h3>
<ul>
<li><strong>Tools panel</strong> — down the left edge; hover any icon to see its name and shortcut.</li>
<li><strong>Control panel</strong> — runs along the top; changes to show options for whichever tool/object is active.</li>
<li><strong>Panels</strong> (Layers, Color, Swatches, Align...) — dock on the right; open any of them from the <strong>Window</strong> menu.</li>
<li><strong>Artboard</strong> — the white rectangle that represents your actual page/canvas; a single file can hold multiple artboards (great for icon sets or multi-size social posts).</li>
</ul>
<h3>File basics: save, export, place, open</h3>
<table>
<tr><th>Action</th><th>Menu</th><th>When to use</th></tr>
<tr><td>Save</td><td>File &gt; Save (Ctrl/Cmd+S)</td><td>Your editable master, format <code>.AI</code></td></tr>
<tr><td>Export</td><td>File &gt; Export &gt; Export As</td><td>A flattened delivery file: PNG, JPG, SVG, PDF</td></tr>
<tr><td>Place</td><td>File &gt; Place</td><td>Bring an external image/PDF into the current document</td></tr>
<tr><td>Open</td><td>File &gt; Open (Ctrl/Cmd+O)</td><td>Open an existing <code>.AI</code>/<code>.PDF</code>/<code>.EPS</code> file</td></tr>
</table>
<h3>Navigation shortcuts</h3>
<table>
<tr><th>Shortcut</th><th>Action</th></tr>
<tr><td>Ctrl/Cmd + &#43;/&#45;</td><td>Zoom in / out</td></tr>
<tr><td>Ctrl/Cmd + 0</td><td>Fit artboard in window</td></tr>
<tr><td>Space (hold) + drag</td><td>Pan (Hand tool, temporary)</td></tr>
<tr><td>Ctrl/Cmd + Y</td><td>Toggle Outline mode (see paths only, no fills)</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Common beginner mistakes.</strong> Building a logo directly in Photoshop (it will pixelate the moment it's resized). Forgetting to save as <code>.AI</code> and only exporting a flattened PNG — you lose the ability to edit later. Not naming artboards, so a multi-artboard file becomes a maze when exporting.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> Open Illustrator, create a new document with 3 artboards (name them "Logo", "Icon", "Banner"). Place any reference photo on artboard 1 using File &gt; Place, then save the file as <code>.AI</code> and separately export artboard 1 as a PNG.</p>
<p><strong>Hint:</strong> Use the Artboard tool (Shift+O) to rename artboards in the Properties panel — this habit pays off the moment a project has more than 2-3 artboards.</p>`,
    `<span class="eyebrow">DTG102 · Chương 1 · Bài 1.1 · Buổi 1-2 · CLO1, CLO2</span>
<h2>Nhập môn: bộ Adobe, AI trong thiết kế &amp; giao diện Illustrator</h2>
<p class="lead">Chủ đề FLM (buổi 1-2): <em>"Giới thiệu Illustrator, Photoshop, InDesign... Nhập môn AI trong thiết kế"</em> và <em>"PHẦN 1: ADOBE ILLUSTRATOR — Giới thiệu, vùng làm việc, save/export/place/open, Artboard, Điều hướng"</em>.</p>
` + sachAdobeDesignBasics + `
<h3>Ba công cụ, ba việc</h3>
<table>
<tr><th>Công cụ</th><th>Loại ảnh</th><th>Hợp việc gì</th></tr>
<tr><td><strong>Illustrator</strong></td><td>Vector (đường toán học)</td><td>Logo, icon, minh hoạ — mọi thứ cần phóng to ở bất kỳ cỡ nào</td></tr>
<tr><td><strong>Photoshop</strong></td><td>Raster (lưới điểm ảnh)</td><td>Ảnh chụp, retouch, vẽ số, ghép ảnh</td></tr>
<tr><td><strong>InDesign</strong></td><td>Layout (frame)</td><td>Tài liệu nhiều trang: brochure, tạp chí, poster</td></tr>
</table>
<h3>Raster vs vector — nền tảng của cả môn</h3>
<p><strong>Raster (bitmap)</strong> là lưới điểm ảnh có màu; phóng đủ to sẽ thấy từng ô vuông — phóng ảnh raster vượt quá độ phân giải gốc sẽ làm ảnh nhoè. <strong>Vector</strong> là tập hợp đường toán học (điểm + đường cong); phóng to cỡ nào cũng không mất chất, đó là lý do logo luôn dựng bằng Illustrator, không bao giờ bằng Photoshop.</p>
<div class="callout"><span class="badge">Quy tắc nhớ</span> Là ảnh chụp thì BẮT BUỘC phải raster (Photoshop) — không có cách khác. Cần phóng to sạch nét (logo, icon) thì dựng bằng vector (Illustrator).</div>
<h3>AI trong thiết kế (buổi 1 FLM)</h3>
<p>AI tạo sinh có thể tăng tốc dựng moodboard, xoá nền, phác ý tưởng thô, nhưng KHÔNG thay thế hiểu biết về bố cục, màu sắc và typography — chính những nền tảng đó quyết định kết quả có AI hỗ trợ có thật sự chuyên nghiệp hay không. Syllabus FLM nêu rõ hai điều cần lưu ý: <strong>cân nhắc đạo đức</strong> (ghi nguồn, thiên lệch, dùng kết quả AI có trách nhiệm trong bài tập) và <strong>AI so với sáng tạo con người</strong> — AI là công cụ bạn điều khiển, không thay thế óc thẩm mỹ của người thiết kế.</p>
<h3>Vùng làm việc của Illustrator</h3>
<ul>
<li><strong>Bảng Tools</strong> — chạy dọc mép trái; rê chuột vào từng icon để xem tên &amp; phím tắt.</li>
<li><strong>Thanh Control</strong> — chạy trên đỉnh; đổi nội dung theo công cụ/đối tượng đang chọn.</li>
<li><strong>Panel</strong> (Layers, Color, Swatches, Align...) — neo bên phải; mở bất kỳ panel nào từ menu <strong>Window</strong>.</li>
<li><strong>Artboard</strong> — hình chữ nhật trắng đại diện cho trang/canvas thật; một file có thể chứa nhiều artboard (rất hợp cho bộ icon hay bài social nhiều cỡ).</li>
</ul>
<h3>File cơ bản: save, export, place, open</h3>
<table>
<tr><th>Thao tác</th><th>Menu</th><th>Dùng khi nào</th></tr>
<tr><td>Save</td><td>File &gt; Save (Ctrl/Cmd+S)</td><td>Bản gốc sửa được, định dạng <code>.AI</code></td></tr>
<tr><td>Export</td><td>File &gt; Export &gt; Export As</td><td>File giao đã gộp phẳng: PNG, JPG, SVG, PDF</td></tr>
<tr><td>Place</td><td>File &gt; Place</td><td>Đưa ảnh/PDF từ ngoài vào document hiện tại</td></tr>
<tr><td>Open</td><td>File &gt; Open (Ctrl/Cmd+O)</td><td>Mở file <code>.AI</code>/<code>.PDF</code>/<code>.EPS</code> đã có</td></tr>
</table>
<h3>Phím tắt điều hướng</h3>
<table>
<tr><th>Phím tắt</th><th>Thao tác</th></tr>
<tr><td>Ctrl/Cmd + &#43;/&#45;</td><td>Phóng to / thu nhỏ</td></tr>
<tr><td>Ctrl/Cmd + 0</td><td>Vừa khít artboard trong cửa sổ</td></tr>
<tr><td>Giữ Space + kéo</td><td>Pan (Hand tool tạm thời)</td></tr>
<tr><td>Ctrl/Cmd + Y</td><td>Bật/tắt Outline mode (chỉ thấy path, không thấy fill)</td></tr>
</table>
<div class="pitfall"><strong>⚠️ Lỗi người mới hay mắc.</strong> Dựng logo thẳng trong Photoshop (sẽ vỡ ngay khi đổi cỡ). Quên lưu <code>.AI</code>, chỉ xuất PNG đã gộp — mất khả năng sửa sau này. Không đặt tên artboard, khiến file nhiều artboard trở thành mê cung lúc xuất.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Mở Illustrator, tạo document mới với 3 artboard (đặt tên "Logo", "Icon", "Banner"). Đặt một ảnh tham khảo bất kỳ vào artboard 1 bằng File &gt; Place, rồi lưu file dạng <code>.AI</code> và xuất riêng artboard 1 thành PNG.</p>
<p><strong>Gợi ý:</strong> Dùng Artboard tool (Shift+O) để đổi tên artboard trong panel Properties — thói quen này rất có ích ngay khi dự án có hơn 2-3 artboard.</p>`,
  ]]);

const l12 = doc('dtg102-1-2-vector-selection-shapes', '1.2 — Selecting vector objects & basic shapes|||1.2 — Chọn đối tượng vector & hình cơ bản',
  'Buổi 3-4, CLO1/CLO2. Selection vs Direct Selection, Magic Wand, group/lock/hide/align; Shape tool, stroke & fill, line segment, join path.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 1 · Lesson 1.2 · Session 3-4 · CLO1, CLO2</span>
<h2>Selecting vector objects &amp; basic shapes</h2>
<p class="lead">FLM topics (sessions 3-4): <em>"BASIC OPERATIONS WITH VECTOR OBJECT"</em> and <em>"BASIC SHAPES"</em>.</p>
<h3>Selection tools</h3>
<table>
<tr><th>Tool</th><th>Shortcut</th><th>Selects</th></tr>
<tr><td>Selection Tool</td><td>V</td><td>The whole object (move/scale/rotate as one piece)</td></tr>
<tr><td>Direct Selection Tool</td><td>A</td><td>One anchor point or path segment inside an object</td></tr>
<tr><td>Magic Wand</td><td>Y</td><td>Everything nearby that shares similar fill color</td></tr>
</table>
<h3>Organizing objects</h3>
<table>
<tr><th>Action</th><th>Shortcut</th><th>Effect</th></tr>
<tr><td>Group / Ungroup</td><td>Ctrl/Cmd+G / Shift+Ctrl/Cmd+G</td><td>Bundle several objects to move/scale together, or split them back apart</td></tr>
<tr><td>Lock / Unlock All</td><td>Ctrl/Cmd+2 / Alt+Ctrl/Cmd+2</td><td>Freeze an object so it can't be clicked or moved by accident</td></tr>
<tr><td>Hide / Show All</td><td>Ctrl/Cmd+3 / Alt+Ctrl/Cmd+3</td><td>Temporarily remove clutter from view without deleting</td></tr>
<tr><td>Align panel</td><td>Window &gt; Align</td><td>Line up selected objects to each other or to the artboard</td></tr>
</table>
<h3>Basic shape tools</h3>
<p>Rectangle (M), Ellipse (L) and Polygon live in the same tool group in the Tools panel (click and hold to see all of them). Hold <strong>Shift</strong> while drawing to force a perfect square or circle; hold <strong>Alt/Opt</strong> to draw from the center outward instead of a corner.</p>
<h3>Stroke &amp; fill</h3>
<p>Every shape has two color slots at the bottom of the Tools panel: <strong>Fill</strong> (the color inside) and <strong>Stroke</strong> (the outline). Click the small double-arrow icon between them to swap fill and stroke instantly. Stroke <strong>weight</strong> (thickness) is set in the Stroke panel (Window &gt; Stroke).</p>
<h3>Line segments &amp; joining paths</h3>
<p>The <strong>Line Segment Tool (\\)</strong> draws a single straight line between two clicks. To join two open path ends into one continuous path, select both endpoints with Direct Selection and press <strong>Ctrl/Cmd+J</strong> — Illustrator draws a straight segment connecting them.</p>
<div class="pitfall"><strong>⚠️ Common beginner mistakes.</strong> Clicking with the Selection Tool (V) when you meant to nudge a single point — you end up dragging the whole shape. Forgetting Shift while drawing an ellipse, ending up with an oval instead of the intended perfect circle. Leaving objects ungrouped so moving a logo also leaves a piece behind because it wasn't selected.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> Build a simple traffic-light icon: 1 rounded rectangle (the housing) and 3 perfect circles (red/yellow/green) using Shape tools + Shift. Group all 4 shapes into one object, then use Align (Window &gt; Align) to center the 3 circles horizontally on the rectangle.</p>
<p><strong>Hint:</strong> Draw the circles first, select all 4 shapes, and use "Align to Selection" in the Align panel before grouping — aligning after grouping only moves the whole group, not the pieces inside it.</p>`,
    `<span class="eyebrow">DTG102 · Chương 1 · Bài 1.2 · Buổi 3-4 · CLO1, CLO2</span>
<h2>Chọn đối tượng vector &amp; hình cơ bản</h2>
<p class="lead">Chủ đề FLM (buổi 3-4): <em>"THAO TÁC CƠ BẢN VỚI ĐỐI TƯỢNG VECTOR"</em> và <em>"HÌNH CƠ BẢN"</em>.</p>
<h3>Công cụ chọn</h3>
<table>
<tr><th>Công cụ</th><th>Phím tắt</th><th>Chọn gì</th></tr>
<tr><td>Selection Tool</td><td>V</td><td>Cả đối tượng (di chuyển/phóng/xoay như một khối)</td></tr>
<tr><td>Direct Selection Tool</td><td>A</td><td>Một anchor point hay đoạn path bên trong đối tượng</td></tr>
<tr><td>Magic Wand</td><td>Y</td><td>Mọi thứ lân cận có màu fill giống nhau</td></tr>
</table>
<h3>Tổ chức đối tượng</h3>
<table>
<tr><th>Thao tác</th><th>Phím tắt</th><th>Hiệu ứng</th></tr>
<tr><td>Group / Ungroup</td><td>Ctrl/Cmd+G / Shift+Ctrl/Cmd+G</td><td>Gộp nhiều đối tượng để di chuyển/phóng cùng nhau, hoặc tách lại</td></tr>
<tr><td>Lock / Unlock All</td><td>Ctrl/Cmd+2 / Alt+Ctrl/Cmd+2</td><td>Khoá đối tượng để không bấm/di chuyển nhầm</td></tr>
<tr><td>Hide / Show All</td><td>Ctrl/Cmd+3 / Alt+Ctrl/Cmd+3</td><td>Tạm ẩn cho gọn màn hình mà không xoá</td></tr>
<tr><td>Panel Align</td><td>Window &gt; Align</td><td>Căn các đối tượng đã chọn với nhau hoặc với artboard</td></tr>
</table>
<h3>Công cụ hình cơ bản</h3>
<p>Rectangle (M), Ellipse (L) và Polygon nằm chung một nhóm công cụ trong bảng Tools (bấm giữ để thấy hết). Giữ <strong>Shift</strong> khi vẽ để ép thành hình vuông/tròn hoàn hảo; giữ <strong>Alt/Opt</strong> để vẽ từ tâm ra thay vì từ góc.</p>
<h3>Stroke &amp; fill</h3>
<p>Mỗi hình có hai ô màu ở đáy bảng Tools: <strong>Fill</strong> (màu bên trong) và <strong>Stroke</strong> (viền). Bấm icon mũi tên đôi nhỏ giữa hai ô để hoán đổi fill/stroke ngay lập tức. <strong>Độ dày</strong> stroke đặt trong panel Stroke (Window &gt; Stroke).</p>
<h3>Đoạn thẳng &amp; nối path</h3>
<p><strong>Line Segment Tool (\\)</strong> vẽ một đường thẳng giữa hai lần bấm. Muốn nối hai đầu path hở thành một path liền, chọn cả hai điểm cuối bằng Direct Selection rồi bấm <strong>Ctrl/Cmd+J</strong> — Illustrator tự vẽ đoạn thẳng nối chúng.</p>
<div class="pitfall"><strong>⚠️ Lỗi người mới hay mắc.</strong> Bấm bằng Selection Tool (V) khi định chỉnh một điểm — kéo nhầm cả hình. Quên giữ Shift khi vẽ ellipse, ra hình bầu dục thay vì hình tròn hoàn hảo như ý. Không group đối tượng nên di chuyển logo bỏ sót một mảnh vì nó chưa được chọn.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Dựng icon đèn giao thông đơn giản: 1 hình chữ nhật bo góc (thân đèn) và 3 hình tròn hoàn hảo (đỏ/vàng/xanh) bằng công cụ Shape + Shift. Group cả 4 hình thành một đối tượng, rồi dùng Align (Window &gt; Align) để căn giữa 3 hình tròn theo chiều ngang trên hình chữ nhật.</p>
<p><strong>Gợi ý:</strong> Vẽ 3 hình tròn trước, chọn cả 4 hình, dùng "Align to Selection" trong panel Align rồi mới group — căn SAU khi group chỉ di chuyển cả nhóm, không căn từng mảnh bên trong.</p>`,
  ]]);

const l13 = doc('dtg102-4-1-illustrator-basics', '1.3 — Pathfinder, transforming objects & the Pen tool|||1.3 — Pathfinder, biến đổi đối tượng & công cụ Pen',
  'Buổi 5-7, CLO1/CLO2. Pathfinder (Unite/Minus Front/Intersect), Shape Builder; Scale/Reflect/Distort/Shear; Pen tool (đường thẳng & cong Bézier), Pencil tool.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 1 · Lesson 1.3 · Session 5-7 · CLO1, CLO2</span>
<h2>Pathfinder, transforming objects &amp; the Pen tool</h2>
<p class="lead">FLM topics (sessions 5-7): <em>"PATHFINDER"</em>, <em>"TRANSFORMING OBJECTS"</em> and <em>"DRAWING WITH THE PEN TOOL / PENCIL TOOL"</em>.</p>
<h3>Pathfinder (session 5)</h3>
<p>Open the <strong>Pathfinder panel</strong> (Window &gt; Pathfinder) to combine simple shapes into complex ones. Most logos and icons are just 2-4 basic shapes run through Pathfinder.</p>
<table>
<tr><th>Command</th><th>Effect</th></tr>
<tr><td><strong>Unite</strong></td><td>Merges all selected shapes into one</td></tr>
<tr><td><strong>Minus Front</strong></td><td>Punches the top shape out of the shape(s) below (a hole)</td></tr>
<tr><td><strong>Intersect</strong></td><td>Keeps only the area where shapes overlap</td></tr>
<tr><td><strong>Exclude</strong></td><td>Keeps everything except the overlapping area</td></tr>
</table>
<p>The <strong>Shape Builder Tool (Shift+M)</strong> is a faster, visual alternative: drag across regions to merge them, or Alt/Opt-click a region to delete it. The <strong>Blob Brush</strong> paints filled vector shapes directly, merging with existing blob-brush strokes of the same color as you draw.</p>
<h3>Transforming objects (session 6)</h3>
<table>
<tr><th>Transform</th><th>Tool / shortcut</th><th>Tip</th></tr>
<tr><td>Scale</td><td>Scale Tool (S) or drag a bounding-box handle</td><td>Hold Shift to keep proportions</td></tr>
<tr><td>Reflect</td><td>Reflect Tool (O)</td><td>Click twice to set the mirror axis, then drag</td></tr>
<tr><td>Rotate</td><td>Rotate Tool (R)</td><td>Click to set the pivot point before dragging</td></tr>
<tr><td>Shear</td><td>Shear Tool</td><td>Slants an object along one axis</td></tr>
<tr><td>Repeat last transform</td><td>Ctrl/Cmd+D</td><td>Great for spaced rows/patterns</td></tr>
</table>
<p>The <strong>Eraser Tool (Shift+E)</strong> removes vector material directly by dragging over it, automatically closing the resulting paths — no manual path cleanup needed.</p>
<h3>The Pen tool (session 7) — the heart of Illustrator</h3>
<table>
<tr><th>Action</th><th>Result</th></tr>
<tr><td>Click</td><td>Straight corner anchor point</td></tr>
<tr><td>Click + drag</td><td>Smooth curve point (drag out the direction handles)</td></tr>
<tr><td>Click the first anchor again</td><td>Closes the path into a shape</td></tr>
<tr><td>Alt/Opt + drag a handle</td><td>Breaks a smooth point into an independent corner</td></tr>
</table>
<p>The <strong>Pencil tool</strong> is a freehand alternative — it draws a rough path as you drag, and its <strong>Smooth Tool</strong> simplifies a shaky line afterwards. The <strong>Width Tool (Shift+W)</strong> lets you vary a stroke's thickness along its length for hand-lettering-style effects.</p>
<div class="pitfall"><strong>⚠️ Common beginner mistakes.</strong> Using Minus Front with shapes in the wrong stacking order — it always subtracts the TOPMOST shape, so check the Layers panel order first. Dragging Pen-tool handles too far, producing sharp unwanted bumps in a curve. Everyone finds the Pen tool awkward for the first hour — that is normal, not a sign you're doing it wrong.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> Draw a simple speech-bubble icon: an ellipse (body) plus a small triangle (tail) combined with Pathfinder's <strong>Unite</strong>. Then trace a wavy line inside it using the Pen tool with 2-3 curve points.</p>
<p><strong>Hint:</strong> Draw the triangle overlapping the ellipse's edge before uniting — Pathfinder only produces a clean tail shape if the two source shapes actually overlap.</p>`,
    `<span class="eyebrow">DTG102 · Chương 1 · Bài 1.3 · Buổi 5-7 · CLO1, CLO2</span>
<h2>Pathfinder, biến đổi đối tượng &amp; công cụ Pen</h2>
<p class="lead">Chủ đề FLM (buổi 5-7): <em>"PATHFINDER"</em>, <em>"BIẾN ĐỔI ĐỐI TƯỢNG"</em> và <em>"VẼ BẰNG PEN TOOL / PENCIL TOOL"</em>.</p>
<h3>Pathfinder (buổi 5)</h3>
<p>Mở <strong>panel Pathfinder</strong> (Window &gt; Pathfinder) để ghép hình đơn giản thành hình phức tạp. Phần lớn logo/icon chỉ là 2-4 hình cơ bản chạy qua Pathfinder.</p>
<table>
<tr><th>Lệnh</th><th>Hiệu ứng</th></tr>
<tr><td><strong>Unite</strong></td><td>Gộp mọi hình đã chọn thành một</td></tr>
<tr><td><strong>Minus Front</strong></td><td>Khoét hình trên cùng ra khỏi (các) hình bên dưới (tạo lỗ)</td></tr>
<tr><td><strong>Intersect</strong></td><td>Chỉ giữ phần các hình chồng lên nhau</td></tr>
<tr><td><strong>Exclude</strong></td><td>Giữ mọi thứ TRỪ phần chồng lên nhau</td></tr>
</table>
<p><strong>Shape Builder Tool (Shift+M)</strong> là cách nhanh hơn, trực quan hơn: kéo qua các vùng để gộp, hoặc Alt/Opt-bấm một vùng để xoá. <strong>Blob Brush</strong> vẽ trực tiếp hình vector đã tô màu, tự gộp với nét blob-brush cùng màu khi bạn vẽ tiếp.</p>
<h3>Biến đổi đối tượng (buổi 6)</h3>
<table>
<tr><th>Biến đổi</th><th>Công cụ / phím tắt</th><th>Mẹo</th></tr>
<tr><td>Scale</td><td>Scale Tool (S) hoặc kéo tay nắm bounding box</td><td>Giữ Shift để giữ tỉ lệ</td></tr>
<tr><td>Reflect</td><td>Reflect Tool (O)</td><td>Bấm 2 lần để đặt trục gương, rồi kéo</td></tr>
<tr><td>Rotate</td><td>Rotate Tool (R)</td><td>Bấm để đặt tâm xoay trước khi kéo</td></tr>
<tr><td>Shear</td><td>Shear Tool</td><td>Làm nghiêng đối tượng theo một trục</td></tr>
<tr><td>Lặp lại biến đổi trước</td><td>Ctrl/Cmd+D</td><td>Rất hợp để tạo hàng/hoạ tiết đều nhau</td></tr>
</table>
<p><strong>Eraser Tool (Shift+E)</strong> xoá trực tiếp vật liệu vector khi kéo qua, tự đóng path còn lại — không cần dọn path bằng tay.</p>
<h3>Công cụ Pen (buổi 7) — trái tim của Illustrator</h3>
<table>
<tr><th>Thao tác</th><th>Kết quả</th></tr>
<tr><td>Bấm</td><td>Anchor point góc thẳng</td></tr>
<tr><td>Bấm + kéo</td><td>Điểm cong mượt (kéo tay nắm hướng ra)</td></tr>
<tr><td>Bấm lại vào anchor đầu tiên</td><td>Đóng path thành một hình kín</td></tr>
<tr><td>Alt/Opt + kéo một tay nắm</td><td>Tách điểm cong thành góc độc lập</td></tr>
</table>
<p><strong>Pencil tool</strong> là lựa chọn vẽ tay tự do — vẽ path thô khi kéo chuột, và <strong>Smooth Tool</strong> của nó làm mượt lại đường bị rung sau đó. <strong>Width Tool (Shift+W)</strong> cho phép đổi độ dày nét dọc theo chiều dài, tạo hiệu ứng kiểu chữ viết tay.</p>
<div class="pitfall"><strong>⚠️ Lỗi người mới hay mắc.</strong> Dùng Minus Front khi thứ tự chồng hình sai — nó LUÔN trừ hình TRÊN CÙNG, nên kiểm tra thứ tự trong panel Layers trước. Kéo tay nắm Pen quá xa, tạo ra chỗ gồ ghề không mong muốn trên đường cong. Ai mới học Pen cũng thấy ngượng tay giờ đầu tiên — đó là bình thường, không phải bạn làm sai.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Vẽ icon bong bóng thoại đơn giản: một ellipse (thân) cộng một tam giác nhỏ (đuôi) gộp bằng <strong>Unite</strong> của Pathfinder. Sau đó vẽ một đường lượn sóng bên trong bằng công cụ Pen với 2-3 điểm cong.</p>
<p><strong>Gợi ý:</strong> Vẽ tam giác chồng lên mép ellipse trước khi Unite — Pathfinder chỉ ra hình đuôi gọn khi hai hình nguồn thật sự chồng lên nhau.</p>`,
  ]]);

const l14 = doc('dtg102-1-4-color-type-layers', '1.4 — Color (CMYK vs RGB), type & layers|||1.4 — Màu sắc (CMYK & RGB), chữ & layer',
  'Buổi 8-10, CLO1/CLO2. CMYK vs RGB, Color panel, swatch, Live Paint; Character/Paragraph panel, Create Outlines; Layers panel: tạo/khoá/gộp/isolation mode.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 1 · Lesson 1.4 · Session 8-10 · CLO1, CLO2</span>
<h2>Color (CMYK vs RGB), type &amp; layers</h2>
<p class="lead">FLM topics (sessions 8-10): <em>"COLOR — CMYK vs RGB"</em>, <em>"TYPE"</em> and <em>"LAYERS"</em>.</p>
<h3>Color modes: CMYK vs RGB (session 8) — a foundation of the whole course</h3>
<table>
<tr><th></th><th>RGB</th><th>CMYK</th></tr>
<tr><td>Stands for</td><td>Red, Green, Blue</td><td>Cyan, Magenta, Yellow, Key/black</td></tr>
<tr><td>Mixing</td><td>Additive (light)</td><td>Subtractive (ink)</td></tr>
<tr><td>Used for</td><td>Screens: web, social, apps</td><td>Print: posters, brochures, packaging</td></tr>
<tr><td>Gamut</td><td>Wider, brighter</td><td>Narrower — some bright RGB colors shift when printed</td></tr>
</table>
<p>Set the document's color mode when you create it (File &gt; New &gt; Advanced), or change it later via <strong>File &gt; Document Color Mode</strong>. Always design print work in CMYK from the start — converting a finished RGB design to CMYK late can shift colors you already approved.</p>
<h3>Working with color</h3>
<ul>
<li><strong>Color panel</strong> (Window &gt; Color) — mix a color by dragging sliders in the current mode (RGB or CMYK).</li>
<li><strong>Swatches panel</strong> — save colors you'll reuse; drag a color from Color panel into Swatches to store it.</li>
<li><strong>Color Guide</strong> — suggests a harmonious palette (complementary, analogous...) starting from one base color.</li>
<li><strong>Live Paint</strong> (Live Paint Bucket, K) — turns overlapping paths into a "coloring book": click any enclosed region to fill it, regardless of which shape created that boundary.</li>
</ul>
<h3>Type (session 9)</h3>
<p>The <strong>Type Tool (T)</strong> creates editable text; open the <strong>Character panel</strong> (Ctrl/Cmd+T) for font, size, <strong>tracking</strong> (spacing across a whole word) and <strong>kerning</strong> (spacing between two specific letters), and the <strong>Paragraph panel</strong> for alignment and spacing. <strong>Type &gt; Threading Text</strong> lets a long story flow across multiple linked text frames — click the frame's out-port and then the next frame.</p>
<div class="callout"><span class="badge">Critical habit</span> Before sending a file with text to print or to a client, run <strong>Type &gt; Create Outlines</strong> on a COPY. This converts letters into vector shapes so the file displays and prints correctly on a machine that doesn't have your font installed. Keep the original text version as your editable master — outlined text can no longer be edited as text.</div>
<h3>Layers (session 10)</h3>
<table>
<tr><th>Action</th><th>How</th></tr>
<tr><td>Create a layer</td><td>Click the "new layer" icon at the bottom of the Layers panel</td></tr>
<tr><td>Move a layer</td><td>Drag it up/down in the Layers panel to change stacking order</td></tr>
<tr><td>Lock a layer</td><td>Click the empty box next to the eye icon</td></tr>
<tr><td>Hide/view a layer</td><td>Click the eye icon</td></tr>
<tr><td>Merge layers</td><td>Select multiple layers &gt; Layers panel menu &gt; Merge Selected</td></tr>
<tr><td>Isolation mode</td><td>Double-click a group/object to edit it alone, without accidentally touching anything else</td></tr>
</table>
<p>Keep related objects on named layers (e.g. "Background", "Logo", "Text") — this is what makes a complex illustration manageable instead of a flat pile of shapes.</p>
<div class="pitfall"><strong>⚠️ Common beginner mistakes.</strong> Sending a print job in RGB — colors look right on screen and shift on paper. Forgetting Create Outlines before sharing a file with text — fonts silently substitute on another machine. Working with everything on one layer, then accidentally selecting/moving the wrong object because nothing is isolated.</div>
<h3>Exercise</h3>
<p><strong>Task:</strong> Take the traffic-light icon from Lesson 1.2. Put the housing, the 3 circles and a text label on 3 separate named layers. Set the document to CMYK, pick the red/yellow/green from the Color Guide starting from one base hue, then add a text label using the Type tool and run Create Outlines on a duplicate.</p>
<p><strong>Hint:</strong> Lock the "Housing" layer once it's done — that single click prevents 90% of "I moved the wrong thing" accidents.</p>`,
    `<span class="eyebrow">DTG102 · Chương 1 · Bài 1.4 · Buổi 8-10 · CLO1, CLO2</span>
<h2>Màu sắc (CMYK &amp; RGB), chữ &amp; layer</h2>
<p class="lead">Chủ đề FLM (buổi 8-10): <em>"MÀU SẮC — CMYK so với RGB"</em>, <em>"CHỮ (TYPE)"</em> và <em>"LAYERS"</em>.</p>
<h3>Hệ màu: CMYK &amp; RGB (buổi 8) — nền tảng của cả môn</h3>
<table>
<tr><th></th><th>RGB</th><th>CMYK</th></tr>
<tr><td>Viết tắt của</td><td>Đỏ, Lục, Lam</td><td>Lục lam, Hồng cánh sen, Vàng, Đen (Key)</td></tr>
<tr><td>Cách pha</td><td>Cộng (ánh sáng)</td><td>Trừ (mực)</td></tr>
<tr><td>Dùng cho</td><td>Màn hình: web, social, app</td><td>In ấn: poster, brochure, bao bì</td></tr>
<tr><td>Dải màu</td><td>Rộng, rực hơn</td><td>Hẹp hơn — một số màu RGB rực có thể lệch khi in</td></tr>
</table>
<p>Đặt hệ màu ngay khi tạo document (File &gt; New &gt; Advanced), hoặc đổi sau bằng <strong>File &gt; Document Color Mode</strong>. Luôn thiết kế sản phẩm in bằng CMYK ngay từ đầu — đổi một thiết kế RGB đã hoàn chỉnh sang CMYK muộn có thể làm lệch màu bạn đã duyệt.</p>
<h3>Làm việc với màu</h3>
<ul>
<li><strong>Color panel</strong> (Window &gt; Color) — pha màu bằng cách kéo thanh trượt theo hệ đang chọn (RGB hoặc CMYK).</li>
<li><strong>Panel Swatches</strong> — lưu màu sẽ dùng lại; kéo màu từ Color panel vào Swatches để lưu.</li>
<li><strong>Color Guide</strong> — gợi ý bảng màu hài hoà (bổ túc, tương đồng...) từ một màu gốc.</li>
<li><strong>Live Paint</strong> (Live Paint Bucket, K) — biến các path chồng nhau thành "tranh tô màu": bấm vào vùng kín bất kỳ để tô, bất kể hình nào tạo ra ranh giới đó.</li>
</ul>
<h3>Chữ (buổi 9)</h3>
<p><strong>Type Tool (T)</strong> tạo chữ sửa được; mở <strong>Character panel</strong> (Ctrl/Cmd+T) để chỉnh font, cỡ, <strong>tracking</strong> (giãn cách cả từ) và <strong>kerning</strong> (khoảng giữa hai chữ cái cụ thể), và <strong>Paragraph panel</strong> để canh lề &amp; giãn dòng. <strong>Type &gt; Threading Text</strong> cho phép một đoạn chữ dài chảy qua nhiều text frame liên kết — bấm vào out-port của frame rồi bấm frame kế tiếp.</p>
<div class="callout"><span class="badge">Thói quen quan trọng</span> Trước khi gửi file có chữ để in hoặc cho khách, chạy <strong>Type &gt; Create Outlines</strong> trên một BẢN SAO. Lệnh này biến chữ thành hình vector nên file hiển thị &amp; in đúng trên máy không cài đúng font của bạn. Giữ bản gốc còn chữ sống làm bản gốc sửa được — chữ đã outline thì không sửa được như văn bản nữa.</div>
<h3>Layers (buổi 10)</h3>
<table>
<tr><th>Thao tác</th><th>Cách làm</th></tr>
<tr><td>Tạo layer</td><td>Bấm icon "layer mới" ở đáy panel Layers</td></tr>
<tr><td>Di chuyển layer</td><td>Kéo lên/xuống trong panel Layers để đổi thứ tự chồng</td></tr>
<tr><td>Khoá layer</td><td>Bấm ô trống cạnh icon con mắt</td></tr>
<tr><td>Ẩn/hiện layer</td><td>Bấm icon con mắt</td></tr>
<tr><td>Gộp layer</td><td>Chọn nhiều layer &gt; menu panel Layers &gt; Merge Selected</td></tr>
<tr><td>Isolation mode</td><td>Bấm đúp vào group/đối tượng để sửa riêng nó, không đụng nhầm phần khác</td></tr>
</table>
<p>Giữ các đối tượng liên quan trên layer có tên rõ ("Background", "Logo", "Text") — đó là thứ giúp một hình minh hoạ phức tạp dễ quản lý thay vì một đống hình phẳng.</p>
<div class="pitfall"><strong>⚠️ Lỗi người mới hay mắc.</strong> Gửi file in bằng hệ RGB — màu đúng trên màn hình nhưng lệch khi in giấy. Quên Create Outlines trước khi chia sẻ file có chữ — font tự đổi âm thầm trên máy khác. Làm việc mọi thứ trên một layer, rồi lỡ chọn/di chuyển nhầm đối tượng vì không gì được cách ly.</div>
<h3>Bài tập</h3>
<p><strong>Nhiệm vụ:</strong> Lấy icon đèn giao thông ở Bài 1.2. Đặt thân đèn, 3 hình tròn và một nhãn chữ vào 3 layer có tên riêng. Đặt document ở hệ CMYK, chọn màu đỏ/vàng/xanh từ Color Guide xuất phát từ một tông gốc, rồi thêm nhãn chữ bằng Type tool và chạy Create Outlines trên một bản sao.</p>
<p><strong>Gợi ý:</strong> Khoá layer "Housing" (thân đèn) ngay khi xong — một cú bấm đó ngăn được 90% lỗi "lỡ di chuyển nhầm thứ khác".</p>`,
  ]]);

const c1quiz = quiz('dtg102-quiz-1', 'Quiz — Chapter 1 (sessions 1-10)|||Quiz — Chương 1 (buổi 1-10)', [
  { id: 'q1', question: 'Định dạng ảnh nào phóng to bao nhiêu cũng không vỡ nét?', options: ['JPG (raster)', 'PNG (raster)', 'Vector (AI/SVG)', 'GIF (raster)'], correctIndex: 2, explanation: 'Vector định nghĩa bằng đường toán học nên phóng to tuỳ ý không mất chất lượng; raster thì vỡ khi phóng quá độ phân giải gốc.' },
  { id: 'q2', question: 'Hệ màu nào dùng cho sản phẩm IN ẤN (poster, brochure)?', options: ['RGB', 'CMYK', 'HSB', 'Grayscale luôn luôn'], correctIndex: 1, explanation: 'CMYK (mực trừ) dùng cho in; RGB (ánh sáng cộng) dùng cho màn hình.' },
  { id: 'q3', question: 'Trong Illustrator, muốn nắn MỘT anchor point của một path thì dùng công cụ nào?', options: ['Selection Tool (V)', 'Direct Selection Tool (A)', 'Magic Wand (Y)', 'Zoom Tool'], correctIndex: 1, explanation: 'Direct Selection (A) chọn từng anchor/handle; Selection (V) chọn cả đối tượng.' },
  { id: 'q4', question: 'Lệnh Pathfinder nào KHOÉT hình trên cùng ra khỏi hình bên dưới?', options: ['Unite', 'Minus Front', 'Intersect', 'Exclude'], correctIndex: 1, explanation: 'Minus Front luôn trừ hình TRÊN CÙNG khỏi hình bên dưới, tạo lỗ.' },
  { id: 'q5', question: 'Với công cụ Pen, thao tác "bấm rồi kéo" tạo ra gì?', options: ['Điểm góc thẳng', 'Điểm cong mượt (có tay nắm)', 'Xoá anchor', 'Đóng path'], correctIndex: 1, explanation: 'Bấm + kéo kéo tay nắm ra, tạo điểm cong Bézier mượt; chỉ bấm (không kéo) mới ra góc thẳng.' },
  { id: 'q6', question: 'Vì sao nên chạy "Create Outlines" cho chữ trước khi giao file cho người khác?', options: ['Để nén dung lượng file', 'Để chữ hoá thành vector, hiển thị/in đúng dù máy khác không cài font', 'Để đổi font tự động', 'Để thêm hiệu ứng đổ bóng'], correctIndex: 1, explanation: 'Create Outlines biến chữ thành hình vector, không còn phụ thuộc việc máy kia có cài đúng font hay không.' },
  { id: 'q7', question: 'Trong panel Layers, bấm vào ô trống cạnh icon con mắt để làm gì?', options: ['Ẩn layer', 'Khoá layer (không bấm/di chuyển được)', 'Gộp layer', 'Đổi tên layer'], correctIndex: 1, explanation: 'Ô trống cạnh icon mắt là khoá (lock); icon mắt mới là ẩn/hiện.' },
  { id: 'q8', question: 'Theo FLM, sinh viên phải dùng loại tài khoản nào để đăng ký Adobe Creative Cloud?', options: ['Tài khoản trường/tổ chức', 'Tài khoản cá nhân', 'Tài khoản dùng chung của lớp', 'Không cần tài khoản'], correctIndex: 1, explanation: 'FLM ghi rõ: sinh viên phải dùng tài khoản cá nhân, KHÔNG dùng tài khoản trường/tổ chức, để đăng ký Adobe.' },
]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 2 → 9 — CHỈ KHUNG (đúng tên bài + 5 dòng mốc: buổi/CLO/công cụ/
// nội dung FLM/ghi chú). Bài giảng chi tiết bổ sung sau. Dựng bằng hàm
// `khung()` — nối chuỗi thường, KHÔNG template lồng bên trong.
// ─────────────────────────────────────────────────────────────────────────
const escAmp = (s) => s.replace(/&/g, '&amp;');
const khung = (slug, titleEn, titleVi, desc, chuong, baiSo, buoi, clo, congCu, noiDungEn, noiDungVi, sach) => {
  const sachHtml = sach || '';
  const enHtml =
    '<span class="eyebrow">DTG102 · Chapter ' + chuong + ' · Lesson ' + baiSo + ' · Session ' + buoi + ' · ' + clo + ' · Framework</span>' +
    '<h2>' + escAmp(titleEn) + '</h2>' +
    sachHtml +
    '<ul>' +
    '<li><strong>Session(s):</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>Tool:</strong> ' + congCu + '.</li>' +
    '<li><strong>FLM content:</strong> ' + noiDungEn + '</li>' +
    '<li><strong>Note:</strong> Framework only — full lesson content is added later.</li>' +
    '</ul>' +
    '<p><em>Source: FLM &middot; Syllabus 13371 &middot; QD 932/QD-DHFPT dated 08/22/2025.</em></p>';
  const viHtml =
    '<span class="eyebrow">DTG102 · Chương ' + chuong + ' · Bài ' + baiSo + ' · Buổi ' + buoi + ' · ' + clo + ' · Khung</span>' +
    '<h2>' + escAmp(titleVi) + '</h2>' +
    sachHtml +
    '<ul>' +
    '<li><strong>Buổi:</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>Công cụ:</strong> ' + congCu + '.</li>' +
    '<li><strong>Nội dung FLM:</strong> ' + noiDungVi + '</li>' +
    '<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ bổ sung sau.</li>' +
    '</ul>' +
    '<p><em>Nguồn: FLM &middot; Syllabus 13371 &middot; QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>';
  return doc(slug, titleEn + '|||' + titleVi, desc, [[enHtml, viHtml]]);
};

// ── Chương 2 — Illustrator nâng cao (buổi 11-18), CLO1/CLO2 ──
const k21 = khung('dtg102-5-1-illustrator-advanced', 'Brushes & gradients/blends', 'Brush & gradient/blend',
  'Buổi 11-12, CLO1/CLO2. Khung.', 2, '2.1', '11-12', 'CLO1, CLO2', 'Illustrator',
  'Brush libraries, creating own brushes, pattern brushes; Linear vs Radial gradients, Gradient panel/tool; Blending objects, Specified Steps vs Smooth Color.',
  'Thư viện Brush, tạo brush riêng, pattern brush; Gradient Linear/Radial, Gradient panel/tool; Blend đối tượng, Specified Steps so với Smooth Color.');

const k22 = khung('dtg102-2-2-symbols-mask', 'Symbols & Mask', 'Symbols & Mask',
  'Buổi 13-14, CLO1/CLO2. Khung.', 2, '2.2', '13-14', 'CLO1, CLO2', 'Illustrator',
  'Symbol libraries, creating/editing symbols, symbol instances, Symbol Sprayer; Clipping Masks (shapes), Opacity mask, Draw Inside.',
  'Thư viện Symbol, tạo/sửa symbol, symbol instance, Symbol Sprayer; Clipping Mask (hình), Opacity mask, Draw Inside.');

const k23 = khung('dtg102-2-3-bitmap-patterns-effects', 'Bitmap images, patterns & effects', 'Ảnh bitmap, pattern & effects',
  'Buổi 15-16, CLO1/CLO2. Khung.', 2, '2.3', '15-16', 'CLO1, CLO2', 'Illustrator',
  'Placing bitmap images, link/relink/embed, Image Trace; creating/applying pattern swatches; Appearance panel, transparency, blending modes, drop shadows, graphic styles.',
  'Place ảnh bitmap, link/relink/embed, Image Trace; tạo &amp; áp pattern swatch; Appearance panel, transparency, blending mode, drop shadow, graphic style.');

const k24 = khung('dtg102-2-4-3d-objects', '3D objects', 'Đối tượng 3D',
  'Buổi 17, CLO1/CLO2. Khung.', 2, '2.4', '17', 'CLO1, CLO2', 'Illustrator',
  '3D Extrude &amp; Bevel; modifying a 3D object; mapping artwork onto a 3D object; lighting and shadows for 3D objects.',
  '3D Extrude &amp; Bevel; chỉnh đối tượng 3D; map artwork lên đối tượng 3D; ánh sáng &amp; đổ bóng cho đối tượng 3D.');

const k25 = khung('dtg102-2-5-gen-ai-illustrator', 'Gen AI tool in Illustrator', 'Công cụ Gen AI trong Illustrator',
  'Buổi 18, CLO1/CLO2. Khung.', 2, '2.5', '18', 'CLO1, CLO2', 'Illustrator + Generative AI',
  'Text to Vector Graphic; Text to Pattern; Generative Shape Fill; Generative Expand; Generative Recolor.',
  'Text to Vector Graphic; Text to Pattern; Generative Shape Fill; Generative Expand; Generative Recolor.');

// ── Chương 3 — Assignment 1 + Progress Test 1 (buổi 19-24), CLO1/CLO2/CLO6 ──
const k31 = khung('dtg102-3-1-assignment1-part1', 'Assignment 1: Part 1', 'Assignment 1: Phần 1',
  'Buổi 19, 21 (⚠️ hai buổi giống hệt nhau trong bảng gốc FLM), CLO1/CLO2/CLO6. Khung.', 3, '3.1', '19, 21', 'CLO1, CLO2, CLO6', 'Illustrator',
  'Assignment 1, Part 1 — done in class, guided by the instructor. ⚠️ Sessions 19 and 21 are word-for-word identical in the FLM plan (see 0.5).',
  'Assignment 1, Phần 1 — làm tại lớp, dưới hướng dẫn giảng viên. ⚠️ Buổi 19 và 21 giống hệt nhau trong bảng gốc FLM (xem mục 0.5).');

const k32 = khung('dtg102-3-2-pt1-part1', 'Progress Test 1: Part 1', 'Progress Test 1: Phần 1',
  'Buổi 20, CLO1/CLO2/CLO6. Khung.', 3, '3.2', '20', 'CLO1, CLO2, CLO6', 'Illustrator',
  'Progress Test 1, Part 1 — done in class, administered by the instructor. Counts toward the 30% Progress test 1 grade (see 0.2).',
  'Progress Test 1, Phần 1 — làm tại lớp, do giảng viên tổ chức. Tính vào đầu điểm Progress test 1 (30%, xem mục 0.2).');

const k33 = khung('dtg102-3-3-assignment1-part2', 'Assignment 1: Part 2', 'Assignment 1: Phần 2',
  'Buổi 22-23 (⚠️ hai buổi giống hệt nhau trong bảng gốc FLM), CLO1/CLO2/CLO6. Khung.', 3, '3.3', '22-23', 'CLO1, CLO2, CLO6', 'Illustrator',
  'Assignment 1, Part 2 — done in class, guided by the instructor. ⚠️ Sessions 22 and 23 are word-for-word identical in the FLM plan (see 0.5).',
  'Assignment 1, Phần 2 — làm tại lớp, dưới hướng dẫn giảng viên. ⚠️ Buổi 22 và 23 giống hệt nhau trong bảng gốc FLM (xem mục 0.5).');

const k34 = khung('dtg102-3-4-pt1-part2', 'Progress Test 1: Part 2', 'Progress Test 1: Phần 2',
  'Buổi 24, CLO1/CLO2/CLO6. Khung.', 3, '3.4', '24', 'CLO1, CLO2, CLO6', 'Illustrator',
  'Progress Test 1, Part 2 — done in class, administered by the instructor. Counts toward the 30% Progress test 1 grade (see 0.2).',
  'Progress Test 1, Phần 2 — làm tại lớp, do giảng viên tổ chức. Tính vào đầu điểm Progress test 1 (30%, xem mục 0.2).');

// ── Chương 4 — Photoshop cơ bản (buổi 25-30), CLO1/CLO3 ──
const k41 = khung('dtg102-2-1-photoshop-basics', 'Introduction to Photoshop & interface', 'Giới thiệu Photoshop & giao diện',
  'Buổi 25-26, CLO1/CLO3. Khung.', 4, '4.1', '25-26', 'CLO1, CLO3', 'Photoshop',
  'PART 2: ADOBE PHOTOSHOP — introduction, usage, pros &amp; cons; Photoshop interface (UI elements, customization, zoom/pan); organizing files (new file properties, save/export PSD/PDF/JPEG/PNG, open/import).',
  'PHẦN 2: ADOBE PHOTOSHOP — giới thiệu, ứng dụng, ưu &amp; nhược điểm; giao diện Photoshop (thành phần UI, tuỳ biến, zoom/pan); tổ chức file (thuộc tính file mới, lưu/xuất PSD/PDF/JPEG/PNG, mở/import).');

const k42 = khung('dtg102-4-2-layer-basic', 'Layer basic', 'Layer cơ bản',
  'Buổi 27, CLO1/CLO3. Khung.', 4, '4.2', '27', 'CLO1, CLO3', 'Photoshop',
  'About Photoshop layers; Layers panel overview; converting background &lt;-&gt; layer; duplicating layers.',
  'Về layer trong Photoshop; tổng quan Layers panel; đổi qua lại background &lt;-&gt; layer; nhân đôi layer.');

const k43 = khung('dtg102-4-3-draw-editing-selection', 'Draw & editing; selection tools', 'Vẽ & chỉnh sửa; công cụ chọn',
  'Buổi 28, CLO1/CLO3. Khung.', 4, '4.3', '28', 'CLO1, CLO3', 'Photoshop',
  'Drawing/painting tools; Move, transform, crop; Free Transform, warp, distort; selection tools, Select and Mask, alternative selecting methods, Select Object.',
  'Công cụ vẽ/tô; Move, transform, crop; Free Transform, warp, distort; công cụ chọn, Select and Mask, cách chọn thay thế, Select Object.');

const k44 = khung('dtg102-4-4-text-image-adjustment', 'Text & typography; image adjustment', 'Chữ & typography; điều chỉnh ảnh',
  'Buổi 29-30, CLO1/CLO3. Khung.', 4, '4.4', '29-30', 'CLO1, CLO3', 'Photoshop',
  'Type tool, Type menu, editing type, Rasterize Type; Image Adjustment, Adjustment Layer.',
  'Type tool, menu Type, sửa chữ, Rasterize Type; Image Adjustment, Adjustment Layer.');

// ── Chương 5 — Photoshop nâng cao (buổi 31-35, 38), CLO1/CLO3 ──
const k51 = khung('dtg102-3-1-photoshop-advanced', 'Layer advanced & blend mode', 'Layer nâng cao & blend mode',
  'Buổi 31-32, CLO1/CLO3. Khung.', 5, '5.1', '31-32', 'CLO1, CLO3', 'Photoshop',
  'Feedback on homework. Layer advanced — create/manage layers &amp; groups, select/group/link layers, place images into frames, layer opacity &amp; blending, Smart Filters; Blend Mode — Darken/Lighten/Contrast/Coloring modes, Blend If.',
  'Phản hồi bài tập. Layer nâng cao — tạo/quản lý layer &amp; group, chọn/group/link layer, đặt ảnh vào frame, opacity &amp; blending của layer, Smart Filter; Blend Mode — Darken/Lighten/Contrast/Coloring, Blend If.');

const k52 = khung('dtg102-5-2-mask-photoshop', 'Mask in Photoshop', 'Mask trong Photoshop',
  'Buổi 33-34, CLO1/CLO3. Khung.', 5, '5.2', '33-34', 'CLO1, CLO3', 'Photoshop',
  'Clipping mask, Layer Mask; advanced selection — alternative selecting methods, using Select &amp; Mask to refine a selection.',
  'Clipping mask, Layer mask; vùng chọn nâng cao — cách chọn thay thế, dùng Select &amp; Mask để tinh chỉnh vùng chọn.');

const k53 = khung('dtg102-5-3-retouch', 'Retouch', 'Retouch',
  'Buổi 35, CLO1/CLO3. Khung.', 5, '5.3', '35', 'CLO1, CLO3', 'Photoshop',
  'Retouching techniques (blemish removal: spot healing, healing brush, patch tool); manipulating an image; Fill Content-Aware.',
  'Kỹ thuật retouch (xoá khuyết điểm: spot healing, healing brush, patch tool); chỉnh sửa ảnh; Fill Content-Aware.');

const k54 = khung('dtg102-5-4-gen-ai-photoshop', 'Gen AI tool in Photoshop', 'Công cụ Gen AI trong Photoshop',
  'Buổi 38, CLO1/CLO3. Khung.', 5, '5.4', '38', 'CLO1, CLO3', 'Photoshop + Generative AI',
  'Generative Fill; Generative Expand; Generate Similar; AI Object Selection; AI Remove Tool; Harmonize.',
  'Generative Fill; Generative Expand; Generate Similar; AI Object Selection; AI Remove Tool; Harmonize.');

// ── Chương 6 — Assignment 2 + Progress Test 2 (buổi 36-37, 39-42) ──
const k61 = khung('dtg102-6-1-homework-ai-projects', 'Homework instruction & AI-powered design projects', 'Hướng dẫn bài tập & dự án thiết kế dùng AI',
  'Buổi 36, CLO1/CLO3/CLO5/CLO6. Khung.', 6, '6.1', '36', 'CLO1, CLO3, CLO5, CLO6', 'Photoshop + Generative AI',
  'Homework instruction — assignment objective, gather resources, add images &amp; text; AI-powered design projects — generate idea, create an AI product for reference, research &amp; analysis (layout, font, color, image).',
  'Hướng dẫn bài tập — mục tiêu bài tập, gom tài nguyên, thêm ảnh &amp; chữ; dự án thiết kế dùng AI — sinh ý tưởng, tạo sản phẩm AI tham khảo, nghiên cứu &amp; phân tích (layout, font, màu, ảnh).');

const k62 = khung('dtg102-6-2-feedback-assign2', 'Feedback on homework & assign Assignment 2', 'Phản hồi bài tập & giao Assignment 2',
  'Buổi 37, 39, CLO1/CLO3/CLO5/CLO6. Khung.', 6, '6.2', '37, 39', 'CLO1, CLO3, CLO5, CLO6', 'Photoshop',
  'Feedback on homework — discussion, comments on previous lesson\'s assessment, homework instruction (session 37); Assign Assignment 2 — bringing it all together: create a comprehensive project (session 39).',
  'Phản hồi bài tập — thảo luận, nhận xét bài đánh giá buổi trước, hướng dẫn bài tập (buổi 37); Giao Assignment 2 — tổng hợp kiến thức: tạo một dự án toàn diện (buổi 39).');

const k63 = khung('dtg102-6-3-animation-pt2', 'Animation in Photoshop & Progress Test 2', 'Animation trong Photoshop & Progress Test 2',
  'Buổi 40-41-42 (⚠️ ba buổi giống hệt nhau trong bảng gốc FLM), CLO1/CLO3. Khung.', 6, '6.3', '40-41-42', 'CLO1, CLO3', 'Photoshop',
  'Animation in Photoshop — Timeline Panel (video timeline), Frame Animation; Progress Test 2 — Q&amp;A. ⚠️ Sessions 40, 41 and 42 are word-for-word identical in the FLM plan (see 0.5). Counts toward the 30% Progress test 2 grade (see 0.2).',
  'Animation trong Photoshop — Timeline Panel (video timeline), Frame Animation; Progress Test 2 — Hỏi đáp. ⚠️ Buổi 40, 41 và 42 giống hệt nhau trong bảng gốc FLM (xem mục 0.5). Tính vào đầu điểm Progress test 2 (30%, xem mục 0.2).');

// ── Chương 7 — InDesign cơ bản (buổi 43-48), CLO1/CLO4 ──
const k71 = khung('dtg102-6-1-indesign-layout', 'Introduction to InDesign & interface', 'Giới thiệu InDesign & giao diện',
  'Buổi 43-44, CLO1/CLO4. Khung.', 7, '7.1', '43-44', 'CLO1, CLO4', 'InDesign',
  'PART 3: ADOBE INDESIGN — introduction, overview of purpose &amp; capabilities, comparison with Photoshop &amp; Illustrator; InDesign basic — interface &amp; navigation, create new document, save/open/organize files, Document Setup.',
  'PHẦN 3: ADOBE INDESIGN — giới thiệu, tổng quan mục đích &amp; khả năng, so sánh với Photoshop &amp; Illustrator; InDesign cơ bản — giao diện &amp; điều hướng, tạo document mới, lưu/mở/tổ chức file, Document Setup.');

const k72 = khung('dtg102-7-2-shape-frame-image', 'Shape & frame; working with image', 'Shape & frame; làm việc với ảnh',
  'Buổi 45-46, CLO1/CLO4. Khung.', 7, '7.2', '45-46', 'CLO1, CLO4', 'InDesign',
  'Shape &amp; Frame — create frame/multiframe, compound frame/shape, transform &amp; modify, apply effect; Working with image — place/place multi image, place into frame, edit frame/image content, auto fitting, relink &amp; embed link.',
  'Shape &amp; Frame — tạo frame/multiframe, compound frame/shape, transform &amp; modify, áp effect; Làm việc với ảnh — place/place multi image, place vào frame, edit frame/image content, auto fitting, relink &amp; embed link.');

const k73 = khung('dtg102-7-3-text-paragraph', 'Working with text & paragraph', 'Làm việc với chữ & đoạn văn',
  'Buổi 47-48, CLO1/CLO4. Khung.', 7, '7.3', '47-48', 'CLO1, CLO4', 'InDesign',
  'Working with text — place text, placeholder text, format with Character Panel, control/auto size text frame, text on a path; Working with paragraph — format with Paragraph Panel, Text Thread, text into frame/shape, text wrap, dropcap.',
  'Làm việc với chữ — place text, placeholder text, format bằng Character Panel, điều khiển/auto size text frame, text on a path; Làm việc với đoạn văn — format bằng Paragraph Panel, Text Thread, text vào frame/shape, text wrap, dropcap.');

// ── Chương 8 — InDesign nâng cao (buổi 49-58), CLO1/CLO4 ──
const k81 = khung('dtg102-8-1-on-tap-assignment3', 'Review & prepare for Assignment 3', 'Ôn tập & chuẩn bị Assignment 3',
  'Buổi 49-51, CLO1/CLO4. Khung.', 8, '8.1', '49-51', 'CLO1, CLO4', 'InDesign',
  'Analyzing the previous lesson\'s assessment — discussion, comments; Homework instruction — assignment objective, gather resources, images &amp; text; Prepare for Assignment 3 — practicing InDesign, exercises similar to the test, checking document layout, preparing documents.',
  'Phân tích đánh giá buổi trước — thảo luận, nhận xét; Hướng dẫn bài tập — mục tiêu, gom tài nguyên, ảnh &amp; chữ; Chuẩn bị cho Assignment 3 — luyện InDesign, bài tập tương tự đề thi, kiểm tra bố cục document, chuẩn bị tài liệu.');

const k82 = khung('dtg102-8-2-page-panel-grid', 'Page panel & advanced page layout', 'Page panel & kỹ thuật dàn trang nâng cao',
  'Buổi 52-53, CLO1/CLO4. Khung.', 8, '8.2', '52-53', 'CLO1, CLO4', 'InDesign',
  'Page Panel — page thumbnails, create/delete/move page, page attributes, view Two-Up; Advanced page layout — Master/parent pages, page numbering &amp; sections, grid &amp; guides; Guideline, ruler &amp; grid — margin, bleed, column/modular/baseline grid.',
  'Page Panel — page thumbnail, tạo/xoá/di chuyển trang, page attributes, xem kiểu Two-Up; Dàn trang nâng cao — Master/Parent page, đánh số trang &amp; section, grid &amp; guide; Guideline, ruler &amp; grid — margin, bleed, column/modular/baseline grid.');

const k83 = khung('dtg102-8-3-table-style', 'Table & style', 'Table & style',
  'Buổi 54-55, CLO1/CLO4. Khung.', 8, '8.3', '54-55', 'CLO1, CLO4', 'InDesign',
  'Table — create and design a table, apply different styles &amp; formatting; Style — character styles, paragraph styles, object styles; color management.',
  'Table — tạo &amp; thiết kế bảng, áp style &amp; định dạng khác nhau; Style — character style, paragraph style, object style; color management.');

const k84 = khung('dtg102-7-1-workflow-file-formats', 'Interactive document & advanced export', 'Tài liệu tương tác & xuất bản nâng cao',
  'Buổi 56-57, CLO1/CLO4. Khung.', 8, '8.4', '56-57', 'CLO1, CLO4', 'InDesign',
  'Interactive document exercise — create hyperlinks &amp; bookmarks within a document, incorporate buttons for interactive navigation; Advanced export options — exporting documents for print and digital media.',
  'Bài tập tài liệu tương tác — tạo hyperlink &amp; bookmark trong document, thêm button điều hướng tương tác; Tuỳ chọn xuất nâng cao — xuất document cho in &amp; digital media.');

const k85 = khung('dtg102-8-5-gen-ai-indesign', 'Gen AI tool in InDesign', 'Công cụ Gen AI trong InDesign',
  'Buổi 58, CLO1/CLO4. Khung.', 8, '8.5', '58', 'CLO1, CLO4', 'InDesign + Generative AI',
  'Generative Fill text and shape; Text to Image; Generative Expand.',
  'Generative Fill text &amp; shape; Text to Image; Generative Expand.');

// ── Chương 9 — Assignment 3 + tổng kết (buổi 59-60), CLO1/CLO4/CLO5/CLO6 ──
const k91 = khung('dtg102-8-1-capstone-project', 'Assignment 3: finalizing & wrap up', 'Assignment 3: hoàn thiện & tổng kết môn học',
  'Buổi 59-60, CLO1/CLO4/CLO5/CLO6. Khung.', 9, '9.1', '59-60', 'CLO1, CLO4, CLO5, CLO6', 'Illustrator + Photoshop + InDesign + Generative AI',
  'Assignment 3 — finalizing Progress test 3 (developing and executing ideas using AI and digital tools), sessions 59-60; Wrap Up &amp; Follow Up (session 60) — wrap up learning, practice and apply, seek feedback and guidance, explore advanced techniques, stay updated, plan next steps. Assignment 3 counts toward the 30% Progress test 3 grade (see 0.2).',
  'Assignment 3 — hoàn thiện Progress test 3 (phát triển &amp; thực hiện ý tưởng bằng AI &amp; công cụ số), buổi 59-60; Tổng kết &amp; bước tiếp (buổi 60) — tổng kết việc học, luyện tập &amp; áp dụng, xin phản hồi &amp; hướng dẫn, khám phá kỹ thuật nâng cao, cập nhật xu hướng, lên kế hoạch tiếp theo. Assignment 3 tính vào đầu điểm Progress test 3 (30%, xem mục 0.2).');

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'DTG102',
    slug: 'dtg102-visual-design-tools',
    title: 'Visual Design Tools',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTG102.webp',
    shortDescription: 'FLM Syllabus 13371, 60 sessions, NO final exam (100% on-going: Participation 10% + 3 Progress tests, 30% each). Chapter 1 (sessions 1-10, Illustrator basics to Layers) is fully taught; sessions 11-60 are a session-by-session framework for now.|||Bám FLM Syllabus 13371, 60 buổi, KHÔNG thi cuối kỳ (100% on-going: Participation 10% + 3 Progress test, mỗi bài 30%). Chương 1 (buổi 1-10, Illustrator cơ bản tới Layers) dạy đầy đủ; buổi 11-60 hiện là khung từng buổi.',
    description: 'Môn <strong>DTG102 — Visual Design Tools</strong> (Công cụ thiết kế trực quan, Kỳ 1, ngành Thiết kế mỹ thuật số) dựng lại bám nguyên văn <strong>FLM Syllabus 13371</strong> (QĐ 932/QĐ-ĐHFPT ngày 22/08/2025), đủ <strong>60 buổi</strong>, <strong>6 CLO</strong> và <strong>4 đầu điểm</strong>. Môn này <strong>KHÔNG có thi cuối kỳ</strong> — 100% điểm là on-going: Participation 10% + ba Progress test, mỗi bài 30%. <strong>Mục 0</strong> là khung chương trình đầy đủ (hồ sơ môn, cách tính điểm, CLO, giáo trình &amp; công cụ, kế hoạch 60 buổi, nhiệm vụ sinh viên) để sinh viên tự đối chiếu với FLM. <strong>Chương 1</strong> (buổi 1-10: Nhập môn Adobe/AI trong thiết kế, giao diện Illustrator, chọn đối tượng, hình cơ bản, Pathfinder, biến đổi, Pen tool, màu CMYK/RGB, chữ, layer) dạy đầy đủ, song ngữ, thao tác cụ thể theo menu/panel/phím tắt, có bảng phím tắt, lỗi thường gặp, bài tập, kết chương bằng quiz. <strong>Chương 2 đến hết</strong> (Illustrator nâng cao, Assignment/Progress test 1, Photoshop cơ bản &amp; nâng cao, Assignment/Progress test 2, InDesign cơ bản &amp; nâng cao, Assignment 3 &amp; tổng kết) hiện là <strong>khung</strong> — đúng tên bài, đúng buổi/CLO/công cụ, mốc nội dung ngắn gọn — để sinh viên có đúng chương trình học ngay, chi tiết sẽ bổ sung dần.',
    whatYouLearn: 'Phân biệt raster &amp; vector, CMYK &amp; RGB; giao diện &amp; file cơ bản của Illustrator; chọn đối tượng, hình cơ bản, Pathfinder, biến đổi đối tượng, Pen tool; màu sắc, chữ (typography), layer trong Illustrator; Illustrator nâng cao: brush, gradient/blend, symbol, mask, ảnh bitmap &amp; pattern, effect, 3D, Gen AI; Photoshop cơ bản: giao diện, layer, vẽ &amp; chỉnh sửa, chữ, điều chỉnh ảnh; Photoshop nâng cao: layer nâng cao, blend mode, mask, retouch, Gen AI, animation; InDesign cơ bản: giao diện, frame, ảnh, chữ, đoạn văn; InDesign nâng cao: page panel, lưới/guideline, table, style, tài liệu tương tác, xuất bản, Gen AI; quy trình Assignment &amp; Progress test xuyên suốt 3 phần mềm.',
    requirements: 'Không cần kinh nghiệm trước (Pre-Requisite: None, theo FLM). Cần laptop cài Adobe Illustrator, Photoshop, InDesign — đăng ký bằng TÀI KHOẢN CÁ NHÂN, không dùng tài khoản trường (theo yêu cầu FLM).',
  },
  sections: [
    {
      title: 'Mục 0 — Khung chương trình theo FLM|||Section 0 — FLM program framework',
      description: 'Hồ sơ môn, cách tính điểm (4 đầu điểm, KHÔNG thi cuối kỳ), 6 CLO, giáo trình &amp; công cụ, kế hoạch đủ 60 buổi, nhiệm vụ sinh viên — đối chiếu trực tiếp FLM Syllabus 13371.',
      lessons: [m01, m02, m03, m04, m05, m06],
    },
    {
      title: 'Chương 1 — Nhập môn & Illustrator cơ bản (buổi 1-10)|||Chapter 1 — Getting started & Illustrator basics (sessions 1-10)',
      description: 'Buổi 1-10 · CLO1, CLO2 · Nhập môn Adobe/AI, giao diện Illustrator, chọn đối tượng & hình cơ bản, Pathfinder & Pen tool, màu CMYK/RGB, chữ, layer — ĐẦY ĐỦ, dạy được ngay, kết chương bằng quiz.',
      lessons: [l11, l12, l13, l14, c1quiz],
    },
    {
      title: 'Chương 2 — Illustrator nâng cao (khung)|||Chapter 2 — Illustrator advanced (skeleton)',
      description: 'Buổi 11-18 · CLO1, CLO2 · Brush, gradient/blend, symbol, mask, ảnh bitmap & pattern, effect, 3D, Gen AI — Khung.',
      lessons: [k21, k22, k23, k24, k25],
    },
    {
      title: 'Chương 3 — Assignment 1 & Progress Test 1 (khung)|||Chapter 3 — Assignment 1 & Progress Test 1 (skeleton)',
      description: 'Buổi 19-24 · CLO1, CLO2, CLO6 · Khung — buổi 19&21 và 22-23 giống hệt nhau trong bảng gốc FLM.',
      lessons: [k31, k32, k33, k34],
    },
    {
      title: 'Chương 4 — Photoshop cơ bản (khung)|||Chapter 4 — Photoshop basics (skeleton)',
      description: 'Buổi 25-30 · CLO1, CLO3 · Giao diện, layer cơ bản, vẽ & chỉnh sửa, chữ, điều chỉnh ảnh — Khung.',
      lessons: [k41, k42, k43, k44],
    },
    {
      title: 'Chương 5 — Photoshop nâng cao (khung)|||Chapter 5 — Photoshop advanced (skeleton)',
      description: 'Buổi 31-35, 38 · CLO1, CLO3 · Layer nâng cao, blend mode, mask, retouch, Gen AI — Khung.',
      lessons: [k51, k52, k53, k54],
    },
    {
      title: 'Chương 6 — Assignment 2 & Progress Test 2 (khung)|||Chapter 6 — Assignment 2 & Progress Test 2 (skeleton)',
      description: 'Buổi 36-37, 39-42 · CLO1, CLO3, CLO5, CLO6 · Khung — buổi 40-41-42 lặp lại y nguyên trong bảng gốc FLM.',
      lessons: [k61, k62, k63],
    },
    {
      title: 'Chương 7 — InDesign cơ bản (khung)|||Chapter 7 — InDesign basics (skeleton)',
      description: 'Buổi 43-48 · CLO1, CLO4 · Giao diện, shape & frame, ảnh, chữ, đoạn văn — Khung.',
      lessons: [k71, k72, k73],
    },
    {
      title: 'Chương 8 — InDesign nâng cao (khung)|||Chapter 8 — InDesign advanced (skeleton)',
      description: 'Buổi 49-58 · CLO1, CLO4 · Page panel, lưới/guideline, table, style, tài liệu tương tác, xuất bản nâng cao, Gen AI — Khung.',
      lessons: [k81, k82, k83, k84, k85],
    },
    {
      title: 'Chương 9 — Assignment 3 & Tổng kết (khung)|||Chapter 9 — Assignment 3 & Wrap-up (skeleton)',
      description: 'Buổi 59-60 · CLO1, CLO4, CLO5, CLO6 · Khung.',
      lessons: [k91],
    },
  ],
};
