/**
 * DRP101 — Drawing plaster statue - portrait (Hình hoạ - Vẽ đầu tượng, chân
 * dung). Ngành Thiết kế đồ hoạ FPTU, Kỳ 1. DỰNG LẠI 20/09/2026 bám nguyên văn
 * FLM Syllabus 13344 (QĐ 932/QĐ-ĐHFPT ngày 22/08/2025), nguồn:
 * content/academy/_syllabus-flm/DRP101.json. Bản trước (18 bài) là khung 8
 * chương tự chọn (dụng cụ → nét/khối → sắc độ → phối cảnh → tượng thạch cao →
 * giải phẫu đầu → ngũ quan → đánh bóng/bố cục), KHÔNG bám cấu trúc 60 buổi / 5
 * unit thật của trường (Unit 1-2 đầu tượng nam, Unit 3 đầu tượng nữ, Unit 4-5
 * chân dung người thật) — đã thay toàn bộ.
 *
 * MỨC ĐỘ: Mục 0 (khung FLM đầy đủ) và Chương 1 (buổi 1-12: Unit 1, đầu tượng
 * thạch cao nam 1) là ĐẦY ĐỦ, dạy được ngay. Chương 2 → 6 CHỈ LÀ KHUNG (đúng
 * tên bài + 3-6 dòng mốc nội dung: buổi, CLO, practice, trọng số, làm gì, nộp
 * gì) — bài giảng chi tiết bổ sung sau, KHÔNG tự ý viết dài thêm.
 *
 * ⭐ Đây là môn học TRONG XƯỞNG VẼ: giấy A2, chì than, đầu tượng thạch cao,
 * NGƯỜI MẪU THẬT. Nội dung web chỉ hỗ trợ lý thuyết + tự luyện, KHÔNG thay
 * được buổi vẽ có mẫu — nói rõ ở 0.1 và không hứa quá.
 *
 * Sách/tài liệu: theo lệnh 20/09/2026, MỌI giáo trình phải là thẻ
 * `.khoi-sach`/`.the-sach` (content/academy/_HOP-DONG-SOAN-BAI.md, mục "SÁCH
 * & TÀI LIỆU"). Môn này có ĐÚNG MỘT giáo trình — Andrew Loomis, "Drawing the
 * Head and Hands" — Is Online=False/Is Hard Copy=True ⇒ thẻ `khong-link`,
 * nhãn `chinh` + `giay`, KHÔNG bịa link (kể cả link bản quét PD ngoài lề).
 *
 * ⚠️ Ghi chú/bất thường từ syllabus gốc (giữ nguyên, nêu cho sinh viên, xem
 * đủ trong "ghiChuKiemChung" của file JSON nguồn):
 *   1. Môn KHÔNG có thi cuối kỳ — 100% là điểm quá trình (Participation 10%
 *      + 5 bài vẽ 15%/bài + Progress Test 15%), NHƯNG StudentTasks vẫn ghi
 *      "...in order to be accepted to the final examination". Mâu thuẫn
 *      trong chính syllabus, nêu ở cả 0.2 và 0.6.
 *   2. Pre-Requisite ghi "DRS10x" — ký hiệu có dấu sao (bất kỳ môn DRS10*),
 *      KHÔNG phải mã môn thật; với chương trình hiện hành nghĩa là DRS102.
 *      Đây là suy luận của web, không phải chữ của trường — nêu rõ.
 *   3. practice 4 gõ CLO thành "LO6, LO7, LO8, LO9, LO10" (thiếu chữ C, khác
 *      6 dòng còn lại). Ô CLO và Duration của Participation để TRỐNG hoàn
 *      toàn. Ô No Question của Progress Test ghi "25;" (thừa dấu chấm phẩy);
 *      CLO của nó kết thúc bằng dấu chấm "CLO10.".
 *   4. Mỗi practice ghi "12 sessions, in class" — khớp đúng 5 unit x 12 buổi
 *      = 60. Nhưng mô tả môn ghi mỗi bài vẽ dài SÁU buổi, chấm ở buổi thứ
 *      sáu — trong khi mỗi unit dài 12 buổi và có 2 buổi "Evaluation and
 *      grading" ⇒ mỗi unit nhiều khả năng gồm HAI bài vẽ 6 buổi. Nêu con số,
 *      không diễn giải thay trường (số buổi Evaluation thực tế mỗi unit
 *      không đều: Unit1=2, Unit2=1, Unit3=2, Unit4=1, Unit5=1 — xem 0.2).
 *   5. CLO5 gõ sai "Analize" (đúng: Analyze); CLO10 "emphasis outlines" sai
 *      từ loại (đúng ngữ pháp là "emphasise/emphasize"). CLO3 và CLO4 chỉ
 *      xuất hiện DUY NHẤT ở buổi 1. CLO6 (so sánh tượng với người thật) chỉ ở
 *      buổi 37-38. Unit 3 (đầu tượng NỮ, buổi 25-36) chỉ gắn CLO5 hai buổi
 *      đầu rồi quay lại CLO7/CLO8. Buổi 58-59 gõ "CCLO7, CCLO8, CCLO9,
 *      CCLO10" (lặp chữ C). Buổi 16 ô LO trống; buổi 30 ô ITU trống.
 *   6. Buổi 13 và 49 dính chữ trong bảng gốc: "...male head 2Practice" và
 *      "...female portrait.Practice" (thiếu khoảng trắng/xuống dòng giữa tên
 *      Unit và "Practice"). Giữ nguyên văn, không tự tách.
 *   7. Tên tài liệu trong bảng gốc kết thúc bằng dấu phẩy lạc ("Drawing the
 *      Head and Hands,"); ô ISBN gộp cả hai dạng kèm tiền tố chữ ("ISBN 10:
 *      0857680978, ISBN 13:9780857680976").
 *   8. Bảng câu hỏi kiến tạo (Constructive Questions) chỉ phủ buổi 2 → 20 —
 *      40 buổi sau (21-60) không có câu hỏi kiến tạo nào.
 *
 * ⚠️ BẢNG ÁNH XẠ SLUG CŨ → BÀI MỚI (18/09-20/09/2026). Production đang chạy
 * bản 18 bài/10 mục cũ (đo thật `GET /api/v1/courses/drp101-…` 20/09/2026).
 * Số hiệu trên URL cũ KHÔNG khớp số chương/bài mới bên dưới — chỉ CHUỖI SLUG
 * là thứ giữ nguyên để link cũ không 404; nội dung mỗi slug đã viết lại để
 * bám đúng buổi/CLO thật của Syllabus 13344:
 *   drp101-0-1-overview              → 0.1 Hồ sơ môn
 *   drp101-0-0-tai-lieu              → 0.4 Giáo trình & công cụ
 *   drp101-1-1-tools-grip-strokes    → 1.6 Dụng cụ/tư thế/cầm bút/nét (bổ sung)
 *   drp101-2-1-line-geometric-forms  → 1.7 Đường nét & khối hình học (bổ sung)
 *   drp101-4-1-perspective-construction → 1.8 Phối cảnh & dựng hình (bổ sung)
 *   drp101-3-1-light-shadow-value    → 1.9 Ánh sáng, bóng đổ & sắc độ (bổ sung)
 *   drp101-6-1-head-anatomy-proportion → 1.2 Tỉ lệ khuôn mặt chuẩn (Loomis)
 *   drp101-7-1-portrait-features     → 1.4 Hình & chất ngũ quan
 *   drp101-5-1-plaster-cast-blockin  → 1.5 Dựng hình→lên khối→tả chất
 *   drp101-quiz-1                    → Quiz Chương 1
 *   drp101-quiz-2                    → Quiz ngắn Chương 2 (Unit 2, MỚI viết)
 *   drp101-quiz-3                    → Quiz ngắn Chương 3 (Unit 3, MỚI viết)
 *   drp101-quiz-4                    → Quiz ngắn Chương 4 (Unit 4, MỚI viết)
 *   drp101-quiz-5                    → Quiz ngắn Chương 5 (Unit 5, MỚI viết)
 *   drp101-quiz-6                    → Quiz ngắn Chương 6 (Progress Test, MỚI viết)
 * Cả 14 slug trên đều CÒN trong file này. course.slug
 * drp101-drawing-plaster-statue-portrait giữ nguyên.
 *
 * ⚠️ 2 slug KHÔNG còn dùng, bị prune khi seed (course.pruneSections: true):
 * drp101-8-1-shading-materials-composition, drp101-quiz-7, drp101-quiz-8
 * (20/09/2026: đo thật production cho thấy 0 dòng `lesson_progress` trên cả
 * 9 môn khung Kỳ 1 — không có tiến độ sinh viên nào bị mất khi prune 2 slug
 * này; ưu tiên KHÔNG viết thêm bài giảng cho chương khung thay vì cố giữ đủ
 * 18/18, theo đúng "chỉ khung" của Chương 2-6). Bài MỚI dùng lối
 * drp101-<chương>-<số>-<mô tả>.
 *
 * ⚠️ KHÔNG backtick lồng hay ${ } trong chuỗi nội dung. Bảng 60 buổi (0.5),
 * bảng CLO/đánh giá/câu hỏi kiến tạo và mọi bài khung (chương 2-6) dựng bằng
 * nối chuỗi thường (biến + "chuỗi"), không dùng template literal lồng.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ─────────────────────────────────────────────────────────────────────────
// Thẻ sách — nối chuỗi thường, dán lại ở 0.4 (mục duy nhất nhắc giáo trình).
// ─────────────────────────────────────────────────────────────────────────
const sachLoomis =
  '<div class="khoi-sach">' +
  '<div class="the-sach chinh giay khong-link">' +
  '<span class="sach-ico">📘</span>' +
  '<span class="sach-than">' +
  '<span class="sach-ten">Drawing the Head and Hands</span>' +
  '<span class="sach-phu">Andrew Loomis &middot; Titan Books &middot; 2011 &middot; ISBN-10 0857680978 &middot; ISBN-13 9780857680976</span>' +
  '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">Giáo trình chính</span><span class="sach-nhan giay">Sách giấy</span></span>' +
  '</span>' +
  '</div></div>';

// ─────────────────────────────────────────────────────────────────────────
// MỤC 0 — Khung FLM (đầy đủ, chính xác 100% theo Syllabus 13344)
// ─────────────────────────────────────────────────────────────────────────

const m01 = doc('drp101-0-1-overview', '0.1 — Course profile (FLM Syllabus 13344)|||0.1 — Hồ sơ môn (FLM Syllabus 13344)',
  'Tên môn, mã môn, 3 tín chỉ, 150h = 45h trên lớp (60 buổi) + 105h tự học, môn tiên quyết DRS10x, phương pháp Lecture/Practice/discussion — nguyên văn FLM, kèm cảnh báo môn học trong xưởng vẽ với người mẫu thật.',
  [[
    `<span class="eyebrow">DRP101 · Section 0 · 0.1 · Course profile</span>
<h2>Course profile — Drawing plaster statue - portrait (DRP101)</h2>
<p class="lead">The facts below are copied exactly as published on <strong>FLM</strong> (FPT University's syllabus system) so you can verify every number yourself.</p>
<table>
<tr><th>Field</th><th>Value (FLM)</th></tr>
<tr><td>Syllabus Name</td><td>Drawing plaster stature - portrait_Hình họa - Vẽ đầu tượng, chân dung</td></tr>
<tr><td>Course Name (English)</td><td>Drawing plaster stature - portrait</td></tr>
<tr><td>Subject Code</td><td>DRP101</td></tr>
<tr><td>Credits</td><td>3</td></tr>
<tr><td>Degree Level</td><td>Bachelor</td></tr>
<tr><td>Time Allocation</td><td>Study hour (150h) = 45h contact hours (60 sessions) + 105h self-study</td></tr>
<tr><td>Pre-Requisite</td><td>DRS10x</td></tr>
<tr><td>Learning-Teaching Method</td><td>Lecture, Practice, discussion</td></tr>
<tr><td>Scoring Scale</td><td>10</td></tr>
<tr><td>Min. average mark to pass</td><td>5</td></tr>
<tr><td>Decision No.</td><td>932/QĐ-ĐHFPT dated 08/22/2025</td></tr>
<tr><td>Syllabus ID</td><td>13344</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ FLM writes "DRS10x", not a real code</span> "DRS10x" is a <strong>wildcard</strong> (any subject starting DRS10), not an actual course code. Under the current curriculum this resolves to <strong>DRS102</strong> — but that is <em>our own inference</em>, not FLM's own wording. We report the raw string first.</div>
<div class="callout"><span class="badge">⚠️ Read before you rely on this course</span> DRP101 is taught <strong>hands-on in the drawing studio</strong>: A2 paper, graphite/charcoal pencils, real <strong>plaster casts</strong> and a <strong>live human model</strong>. This website can only support the theory and self-practice side — it <strong>cannot replace</strong> a supervised studio session with an actual model or cast. Do not skip class expecting this site to substitute for it.</div>
<div class="callout"><span class="badge">Self-check</span> Every figure above is taken verbatim from FLM — Syllabus ID <strong>13344</strong>, issued under Decision <strong>932/QĐ-ĐHFPT dated 08/22/2025</strong>. Original: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13344" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13344)</a>.</div>
<p><em>Course description (FLM):</em> The subject will be carried out in the Drawing studio with specific requirements on learning materials. The subject helps students to analyze, drawing, and study the plaster cast head. Students enjoy the skills of building up, hatch and gain basic knowledge of portrait drawing. The subject helps students understand the basic proportion of the portrait, the proportion of eyes, nose, mouth and ears. The subject helps students distinguish between plaster cast and live model. Prepare basic knowledges for Anatomy and Quick-drawing subject. Each drawing lasts for six slots and is performed in the classroom, under the guidance of the lecturer. The final class of the sixth slot will be scored. Lecturers and students make a mutual assessment, lecturer gives final score and will be counted as the credit mark.</p>
<p><em>Nguồn: FLM · Syllabus 13344 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">DRP101 · Mục 0 · 0.1 · Hồ sơ môn</span>
<h2>Hồ sơ môn — Hình hoạ, Vẽ đầu tượng, chân dung (DRP101)</h2>
<p class="lead">Toàn bộ thông tin dưới đây lấy nguyên văn từ <strong>FLM</strong> (hệ thống syllabus của FPTU) để bạn tự đối chiếu.</p>
<table>
<tr><th>Trường</th><th>Giá trị (FLM)</th></tr>
<tr><td>Tên syllabus</td><td>Drawing plaster stature - portrait_Hình họa - Vẽ đầu tượng, chân dung</td></tr>
<tr><td>Tên môn (tiếng Anh)</td><td>Drawing plaster stature - portrait</td></tr>
<tr><td>Mã môn</td><td>DRP101</td></tr>
<tr><td>Số tín chỉ</td><td>3</td></tr>
<tr><td>Bậc học</td><td>Đại học (Bachelor)</td></tr>
<tr><td>Phân bổ thời gian</td><td>150 giờ học = 45 giờ lên lớp (60 buổi) + 105 giờ tự học</td></tr>
<tr><td>Môn tiên quyết</td><td>DRS10x</td></tr>
<tr><td>Phương pháp dạy-học</td><td>Giảng &amp; thực hành &amp; thảo luận (Lecture, Practice, discussion)</td></tr>
<tr><td>Thang điểm</td><td>10</td></tr>
<tr><td>Điểm trung bình tối thiểu để qua môn</td><td>5</td></tr>
<tr><td>Số quyết định</td><td>932/QĐ-ĐHFPT ngày 22/08/2025</td></tr>
<tr><td>Syllabus ID</td><td>13344</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ FLM ghi "DRS10x" — không phải mã môn thật</span> "DRS10x" là ký hiệu <strong>có dấu sao</strong> (bất kỳ môn nào bắt đầu bằng DRS10), không phải một mã môn cụ thể. Với chương trình hiện hành, ký hiệu này khớp với <strong>DRS102</strong> — nhưng đây là <em>suy luận của web</em>, không phải chữ nguyên văn của trường. Chúng tôi nêu đúng chuỗi gốc trước tiên.</div>
<div class="callout"><span class="badge">⚠️ Đọc trước khi dựa vào môn này</span> DRP101 học <strong>trực tiếp trong xưởng vẽ</strong>: giấy A2, bút chì graphite/chì than, <strong>tượng thạch cao</strong> thật và <strong>người mẫu thật</strong>. Trang web này chỉ hỗ trợ phần lý thuyết và tự luyện — <strong>không thể thay thế</strong> một buổi vẽ có giảng viên hướng dẫn với mẫu hoặc tượng thật. Đừng nghỉ buổi vẽ với kỳ vọng web sẽ bù lại được.</div>
<div class="callout"><span class="badge">Tự kiểm chứng</span> Mọi con số trên lấy nguyên văn từ FLM — Syllabus ID <strong>13344</strong>, ban hành theo Quyết định <strong>932/QĐ-ĐHFPT ngày 22/08/2025</strong>. Bản gốc: <a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=13344" target="_blank" rel="noopener">flm.fpt.edu.vn (SyllabusDetails?sylID=13344)</a>.</div>
<p><em>Mô tả môn (FLM, dịch):</em> Môn học được thực hiện tại xưởng vẽ với yêu cầu riêng về dụng cụ học tập. Môn giúp sinh viên phân tích, vẽ và nghiên cứu đầu tượng thạch cao. Sinh viên rèn kỹ năng dựng hình, đánh nét (hatch) và có kiến thức nền về vẽ chân dung. Môn giúp sinh viên hiểu tỉ lệ cơ bản của chân dung, tỉ lệ mắt, mũi, miệng và tai. Môn giúp sinh viên phân biệt giữa tượng thạch cao và người mẫu thật. Chuẩn bị kiến thức nền cho môn Giải phẫu (Anatomy) và Vẽ nhanh (Quick-drawing). Mỗi bài vẽ kéo dài sáu buổi, thực hiện tại lớp dưới sự hướng dẫn của giảng viên. Buổi cuối (buổi thứ sáu) sẽ được chấm điểm. Giảng viên và sinh viên cùng đánh giá, giảng viên cho điểm cuối và tính vào điểm tín chỉ.</p>
<p><em>Nguồn: FLM · Syllabus 13344 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m02 = doc('drp101-0-2-cach-tinh-diem', '0.2 — Grading: NO final exam, 7 items, 100%|||0.2 — Cách tính điểm: KHÔNG thi cuối kỳ, 7 đầu điểm, 100%',
  'Participation 10% + practice 1-5 mỗi bài 15% + Progress Test 15% = 100%. Môn KHÔNG có thi cuối kỳ nhưng StudentTasks vẫn nhắc "final examination" — mâu thuẫn giữ nguyên. Nêu lỗi gõ của trường trong bảng đánh giá.',
  [[
    `<span class="eyebrow">DRP101 · Section 0 · 0.2 · Grading</span>
<h2>Grading breakdown — 7 items, total 100%</h2>
<div class="callout"><span class="badge">⚠️ Read this first — contradiction in FLM's own syllabus</span> DRP101 has <strong>NO final exam</strong> — the table below is 100% on-going. Yet Section 0.6 (Student Tasks, verbatim FLM) says students must "Attend at least 80% of contact hours <strong>in order to be accepted to the final examination</strong>". FLM's own document contradicts itself here; we report both sentences as published rather than silently dropping one.</div>
<table>
<tr><th>#</th><th>Category (FLM)</th><th>Type</th><th>Weight</th><th>Duration</th><th>CLO</th><th>No. Question</th></tr>
<tr><td>1</td><td>Participation</td><td>on-going</td><td>10%</td><td>trường không công bố</td><td>trường không công bố</td><td>&mdash;</td></tr>
<tr><td>2</td><td>practice 1</td><td>on-going</td><td>15%</td><td>12 sessions, in class</td><td>CLO1, CLO2, CLO3, CLO4, CLO7, CLO8</td><td>1</td></tr>
<tr><td>3</td><td>practice 2</td><td>on-going</td><td>15%</td><td>12 sessions, in class</td><td>CLO7, CLO8</td><td>1</td></tr>
<tr><td>4</td><td>practice 3</td><td>on-going</td><td>15%</td><td>12 sessions, in class</td><td>CLO5, CLO7, CLO8</td><td>1</td></tr>
<tr><td>5</td><td>practice 4</td><td>on-going</td><td>15%</td><td>12 sessions, in class</td><td>LO6, LO7, LO8, LO9, LO10 <span class="badge">⚠️ typo</span></td><td>1</td></tr>
<tr><td>6</td><td>practice 5</td><td>on-going</td><td>15%</td><td>12 sessions, in class</td><td>CLO7, CLO8, CLO9, CLO10</td><td>1</td></tr>
<tr><td>7</td><td>Progress Test</td><td>on-going</td><td>15%</td><td>30 minute, in class</td><td>CLO1, CLO2, CLO3, CLO4, CLO5, CLO6, CLO7, CLO8, CLO9, CLO10.</td><td>25;</td></tr>
</table>
<p><strong>Total: 10% + 15% &times; 5 + 15% = 100%.</strong> Each of the five drawings (practice 1-5) maps to one of the five 12-session Units in 0.5 — practice N = Unit N.</p>
<div class="callout"><span class="badge">⚠️ FLM data quirks — kept as-is</span>
<ul>
<li><strong>"practice 4" misspells its own CLO column.</strong> Every other row writes "CLO7, CLO8…"; practice 4 alone writes <strong>"LO6, LO7, LO8, LO9, LO10"</strong> — missing the letter "C". A typo, not a different scoring rubric.</li>
<li><strong>Participation's CLO and Duration columns are completely blank</strong> in the FLM table. We report "trường không công bố" (not published) rather than guessing a value.</li>
<li><strong>Progress Test's "No. Question" reads "25;"</strong> — an extra stray semicolon — and its CLO list ends with a trailing period ("…CLO10."). Kept exactly as published.</li>
</ul></div>
<div class="callout"><span class="badge">⚠️ Numbers that do not quite add up — reported, not resolved</span> FLM's course description (0.1) says <em>"Each drawing lasts for six slots… The final class of the sixth slot will be scored."</em> — i.e. one drawing = 6 sessions, scored at session 6. But each Unit in the session plan (0.5) is <strong>12 sessions</strong>, and each Unit's own evaluation sessions are NOT a consistent "2 per unit": Unit 1 has 2 ("Evaluation and grading" at sessions 11-12), Unit 2 has 1 (session 24), Unit 3 has 2 (sessions 35-36), Unit 4 has 1 (session 48), Unit 5 has 1 (session 59). The "six slots per drawing" description would suggest two 6-session drawings per 12-session Unit, but the actual evaluation-session count per Unit is uneven. We state the raw numbers here — FLM does not explain the discrepancy, so we do not invent an explanation for it.</div>
<p><em>Nguồn: FLM · Syllabus 13344 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
    `<span class="eyebrow">DRP101 · Mục 0 · 0.2 · Cách tính điểm</span>
<h2>Cách tính điểm — 7 đầu điểm, tổng 100%</h2>
<div class="callout"><span class="badge">⚠️ Đọc kỹ trước — chính syllabus tự mâu thuẫn</span> DRP101 <strong>KHÔNG có thi cuối kỳ</strong> — bảng dưới đây là 100% điểm quá trình (on-going). Vậy mà mục 0.6 (Nhiệm vụ sinh viên, nguyên văn FLM) lại ghi sinh viên phải "dự tối thiểu 80% giờ lên lớp <strong>để được chấp nhận thi cuối kỳ</strong>" ("in order to be accepted to the final examination"). Chính văn bản của FLM tự mâu thuẫn ở đây; chúng tôi nêu đúng cả hai câu như bản gốc, không tự bỏ câu nào.</div>
<table>
<tr><th>#</th><th>Đầu điểm (nguyên văn FLM)</th><th>Dạng</th><th>Trọng số</th><th>Thời lượng</th><th>CLO</th><th>Số câu hỏi</th></tr>
<tr><td>1</td><td>Participation <span class="sach-phu">(Điểm chuyên cần)</span></td><td>xuyên suốt (on-going)</td><td>10%</td><td>trường không công bố</td><td>trường không công bố</td><td>&mdash;</td></tr>
<tr><td>2</td><td>practice 1 <span class="sach-phu">(bài vẽ 1 — Unit 1, buổi 1-12)</span></td><td>xuyên suốt (on-going)</td><td>15%</td><td>12 buổi, tại lớp</td><td>CLO1, CLO2, CLO3, CLO4, CLO7, CLO8</td><td>1</td></tr>
<tr><td>3</td><td>practice 2 <span class="sach-phu">(bài vẽ 2 — Unit 2, buổi 13-24)</span></td><td>xuyên suốt (on-going)</td><td>15%</td><td>12 buổi, tại lớp</td><td>CLO7, CLO8</td><td>1</td></tr>
<tr><td>4</td><td>practice 3 <span class="sach-phu">(bài vẽ 3 — Unit 3, buổi 25-36)</span></td><td>xuyên suốt (on-going)</td><td>15%</td><td>12 buổi, tại lớp</td><td>CLO5, CLO7, CLO8</td><td>1</td></tr>
<tr><td>5</td><td>practice 4 <span class="sach-phu">(bài vẽ 4 — Unit 4, buổi 37-48)</span></td><td>xuyên suốt (on-going)</td><td>15%</td><td>12 buổi, tại lớp</td><td>LO6, LO7, LO8, LO9, LO10 <span class="badge">⚠️ lỗi gõ</span></td><td>1</td></tr>
<tr><td>6</td><td>practice 5 <span class="sach-phu">(bài vẽ 5 — Unit 5, buổi 49-59)</span></td><td>xuyên suốt (on-going)</td><td>15%</td><td>12 buổi, tại lớp</td><td>CLO7, CLO8, CLO9, CLO10</td><td>1</td></tr>
<tr><td>7</td><td>Progress Test <span class="sach-phu">(buổi 60)</span></td><td>xuyên suốt (on-going)</td><td>15%</td><td>30 phút, tại lớp</td><td>CLO1, CLO2, CLO3, CLO4, CLO5, CLO6, CLO7, CLO8, CLO9, CLO10.</td><td>25;</td></tr>
</table>
<p><strong>Tổng: 10% + 15% &times; 5 + 15% = 100%.</strong> Mỗi bài trong 5 bài vẽ (practice 1-5) khớp với một trong 5 Unit dài 12 buổi ở mục 0.5 — practice N = Unit N.</p>
<div class="callout"><span class="badge">⚠️ FLM ghi vậy, giữ nguyên</span>
<ul>
<li><strong>"practice 4" gõ sai cột CLO của chính nó.</strong> Mọi dòng khác đều ghi "CLO7, CLO8…"; riêng practice 4 ghi <strong>"LO6, LO7, LO8, LO9, LO10"</strong> — thiếu chữ "C". Đây là lỗi gõ, không phải một thang điểm khác.</li>
<li><strong>Cột CLO và Thời lượng của Participation để TRỐNG HOÀN TOÀN</strong> trong bảng gốc FLM. Chúng tôi ghi "trường không công bố" thay vì tự đoán.</li>
<li><strong>Ô "Số câu hỏi" của Progress Test ghi "25;"</strong> — thừa một dấu chấm phẩy — và danh sách CLO của nó kết thúc bằng dấu chấm thừa ("…CLO10."). Giữ nguyên như bản gốc.</li>
</ul></div>
<div class="callout"><span class="badge">⚠️ Những con số không khớp nhau — nêu ra, không tự giải thích thay trường</span> Mô tả môn (0.1) ghi <em>"Mỗi bài vẽ kéo dài sáu buổi… Buổi cuối (buổi thứ sáu) sẽ được chấm điểm."</em> — tức một bài vẽ = 6 buổi, chấm ở buổi 6. Nhưng mỗi Unit trong kế hoạch buổi (0.5) dài <strong>12 buổi</strong>, và số buổi "Evaluation and grading" của từng Unit KHÔNG đều nhau: Unit 1 có 2 buổi (11-12), Unit 2 có 1 buổi (24), Unit 3 có 2 buổi (35-36), Unit 4 có 1 buổi (48), Unit 5 có 1 buổi (59). Mô tả "sáu buổi mỗi bài vẽ" gợi ý mỗi Unit 12 buổi gồm hai bài vẽ 6 buổi, nhưng số buổi chấm thực tế lại không đều. Chúng tôi nêu đúng các con số này — FLM không giải thích chỗ lệch, nên chúng tôi không tự bịa lời giải thích.</div>
<p><em>Nguồn: FLM · Syllabus 13344 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>`,
  ]]);

const m03 = doc('drp101-0-3-clo', '0.3 — Course Learning Outcomes (10 CLO)|||0.3 — Chuẩn đầu ra môn học (10 CLO)',
  'Nguyên văn 10 CLO tiếng Anh + dịch, kèm ánh xạ CLO ↔ buổi. Nêu lỗi gõ CLO5 "Analize", CLO10 "emphasis outlines"; CLO3/CLO4 chỉ ở buổi 1; CLO6 chỉ ở buổi 37-38; buổi 58-59 gõ "CCLO…"; buổi 16 LO trống.',
  [[
    `<span class="eyebrow">DRP101 · Section 0 · 0.3 · CLO</span>
<h2>Course Learning Outcomes — 10 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Detail (verbatim FLM)</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand what the portrait is.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Memorize the facial proportion.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Understand the form and texture of eyes, nose, mouth&hellip;</td></tr>
<tr><td>4</td><td>CLO4</td><td>Understand the importance of horizontal line and vertical line.</td></tr>
<tr><td>5</td><td>CLO5</td><td>Distinguish the differences between male face and female face. <span class="badge">⚠️ typo</span> Analize the unique characteristics of model.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Compare the differences between plaster cast head and portrait from live model.</td></tr>
<tr><td>7</td><td>CLO7</td><td>Built up the facial basic line and horizontal line: hair line, eyebrows line, nose line and chin line.</td></tr>
<tr><td>8</td><td>CLO8</td><td>Determine facial proportions: eyes line, line between two lips, bottom of the mouth...</td></tr>
<tr><td>9</td><td>CLO9</td><td>Demonstrate the unique properties of objects: hair, skin, clothes...</td></tr>
<tr><td>10</td><td>CLO10</td><td>Know the ways to <span class="badge">⚠️ typo</span> emphasis outlines.</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Typos in FLM's own wording</span> CLO5 writes <strong>"Analize"</strong> (correct spelling: Analyze). CLO10 writes <strong>"emphasis outlines"</strong> — "emphasis" is a noun used where a verb is needed (correct: "emphasise/emphasize outlines"). Kept verbatim above; do not silently "fix" them if you quote CLO10 elsewhere.</div>
<h3>CLO &harr; session map</h3>
<table>
<tr><th>Session(s)</th><th>Unit / stage</th><th>CLO tagged (verbatim "LO" column)</th></tr>
<tr><td>1</td><td>Unit 1 opening</td><td>CLO1, CLO2, CLO3, CLO4</td></tr>
<tr><td>2-10</td><td>Unit 1 practice</td><td>CLO7, CLO8 <span class="badge">session 16 blank</span></td></tr>
<tr><td>11-12</td><td>Unit 1 evaluation</td><td>CLO7, CLO8</td></tr>
<tr><td>13-23</td><td>Unit 2 practice</td><td>CLO7, CLO8</td></tr>
<tr><td>24</td><td>Unit 2 evaluation</td><td>CLO7, CLO8</td></tr>
<tr><td>25-26</td><td>Unit 3 opening (female head)</td><td>CLO5</td></tr>
<tr><td>27-34</td><td>Unit 3 practice</td><td>CLO7, CLO8</td></tr>
<tr><td>35-36</td><td>Unit 3 evaluation</td><td>CLO7, CLO8</td></tr>
<tr><td>37-38</td><td>Unit 4 opening (live model)</td><td>CLO6</td></tr>
<tr><td>39-47</td><td>Unit 4 practice</td><td>CLO7, CLO8, CLO9, CLO10</td></tr>
<tr><td>48</td><td>Unit 4 evaluation</td><td>CLO7, CLO8, CLO9, CLO10</td></tr>
<tr><td>49-57</td><td>Unit 5 practice</td><td>CLO7, CLO8, CLO9, CLO10</td></tr>
<tr><td>58-59</td><td>Unit 5 practice/evaluation</td><td>CCLO7, CCLO8, CCLO9, CCLO10 <span class="badge">⚠️ typo, repeated "C"</span></td></tr>
<tr><td>60</td><td>Progress Test</td><td>CLO1-CLO10</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ CLO mapping does not track the unit's own content cleanly</span>
<ul>
<li><strong>CLO3 and CLO4 appear ONLY at session 1</strong> and never return, even though "form/texture of features" (CLO3) and "horizontal/vertical lines" (CLO4) are used throughout every unit's practice.</li>
<li><strong>CLO6</strong> ("compare plaster cast vs live model") is tagged ONLY at sessions 37-38 — the two opening sessions of Unit 4 — even though the comparison is conceptually relevant from session 1.</li>
<li><strong>Unit 3 (female head, sessions 25-36) tags CLO5</strong> ("male vs female differences") only at its two opening sessions (25-26), then reverts to the generic CLO7/CLO8 for the rest of the unit.</li>
<li>Session <strong>16</strong> has its LO column completely blank; session <strong>30</strong> has its ITU column blank (see 0.5).</li>
</ul>
We report this mapping exactly as FLM's table has it — we do not re-assign CLOs to "fix" the gaps.</div>
<p><em>Nguồn: FLM · Syllabus 13344.</em></p>`,
    `<span class="eyebrow">DRP101 · Mục 0 · 0.3 · Chuẩn đầu ra</span>
<h2>Chuẩn đầu ra môn học — 10 CLO</h2>
<table>
<tr><th>#</th><th>CLO</th><th>Nội dung (nguyên văn FLM)</th><th>Bản dịch</th></tr>
<tr><td>1</td><td>CLO1</td><td>Understand what the portrait is.</td><td>Hiểu chân dung là gì.</td></tr>
<tr><td>2</td><td>CLO2</td><td>Memorize the facial proportion.</td><td>Thuộc tỉ lệ khuôn mặt.</td></tr>
<tr><td>3</td><td>CLO3</td><td>Understand the form and texture of eyes, nose, mouth&hellip;</td><td>Hiểu hình khối &amp; chất liệu của mắt, mũi, miệng…</td></tr>
<tr><td>4</td><td>CLO4</td><td>Understand the importance of horizontal line and vertical line.</td><td>Hiểu tầm quan trọng của đường ngang và đường dọc.</td></tr>
<tr><td>5</td><td>CLO5</td><td><span class="badge">⚠️ lỗi gõ "Analize"</span> Distinguish the differences between male face and female face. Analize the unique characteristics of model.</td><td>Phân biệt khác nhau giữa mặt nam và mặt nữ. Phân tích đặc điểm riêng của mẫu.</td></tr>
<tr><td>6</td><td>CLO6</td><td>Compare the differences between plaster cast head and portrait from live model.</td><td>So sánh khác nhau giữa đầu tượng thạch cao và chân dung từ người mẫu thật.</td></tr>
<tr><td>7</td><td>CLO7</td><td>Built up the facial basic line and horizontal line: hair line, eyebrows line, nose line and chin line.</td><td>Dựng đường cơ bản của mặt và đường ngang: đường chân tóc, đường chân mày, đường mũi, đường cằm.</td></tr>
<tr><td>8</td><td>CLO8</td><td>Determine facial proportions: eyes line, line between two lips, bottom of the mouth...</td><td>Xác định tỉ lệ mặt: đường mắt, đường giữa hai môi, đáy miệng…</td></tr>
<tr><td>9</td><td>CLO9</td><td>Demonstrate the unique properties of objects: hair, skin, clothes...</td><td>Thể hiện tính chất riêng của từng vật liệu: tóc, da, quần áo…</td></tr>
<tr><td>10</td><td>CLO10</td><td><span class="badge">⚠️ sai từ loại</span> Know the ways to emphasis outlines.</td><td>Biết cách nhấn nét viền.</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Lỗi gõ trong chính văn bản FLM</span> CLO5 viết <strong>"Analize"</strong> (đúng chính tả: Analyze). CLO10 viết <strong>"emphasis outlines"</strong> — "emphasis" là danh từ nhưng đứng ở vị trí cần động từ (đúng: "emphasise/emphasize outlines"). Giữ nguyên văn ở trên; đừng tự "sửa" khi trích lại CLO10 ở chỗ khác.</div>
<h3>Ánh xạ CLO &harr; buổi</h3>
<table>
<tr><th>Buổi</th><th>Unit / giai đoạn</th><th>CLO gắn (nguyên văn cột "LO")</th></tr>
<tr><td>1</td><td>Mở đầu Unit 1</td><td>CLO1, CLO2, CLO3, CLO4</td></tr>
<tr><td>2-10</td><td>Thực hành Unit 1</td><td>CLO7, CLO8 <span class="badge">buổi 16 trống</span></td></tr>
<tr><td>11-12</td><td>Chấm Unit 1</td><td>CLO7, CLO8</td></tr>
<tr><td>13-23</td><td>Thực hành Unit 2</td><td>CLO7, CLO8</td></tr>
<tr><td>24</td><td>Chấm Unit 2</td><td>CLO7, CLO8</td></tr>
<tr><td>25-26</td><td>Mở đầu Unit 3 (đầu tượng nữ)</td><td>CLO5</td></tr>
<tr><td>27-34</td><td>Thực hành Unit 3</td><td>CLO7, CLO8</td></tr>
<tr><td>35-36</td><td>Chấm Unit 3</td><td>CLO7, CLO8</td></tr>
<tr><td>37-38</td><td>Mở đầu Unit 4 (người mẫu thật)</td><td>CLO6</td></tr>
<tr><td>39-47</td><td>Thực hành Unit 4</td><td>CLO7, CLO8, CLO9, CLO10</td></tr>
<tr><td>48</td><td>Chấm Unit 4</td><td>CLO7, CLO8, CLO9, CLO10</td></tr>
<tr><td>49-57</td><td>Thực hành Unit 5</td><td>CLO7, CLO8, CLO9, CLO10</td></tr>
<tr><td>58-59</td><td>Thực hành/Chấm Unit 5</td><td>CCLO7, CCLO8, CCLO9, CCLO10 <span class="badge">⚠️ lỗi gõ, lặp chữ "C"</span></td></tr>
<tr><td>60</td><td>Progress Test</td><td>CLO1-CLO10</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Ánh xạ CLO không bám sát nội dung thật của từng buổi</span>
<ul>
<li><strong>CLO3 và CLO4 chỉ xuất hiện DUY NHẤT ở buổi 1</strong> rồi không quay lại, dù "hình khối/chất liệu ngũ quan" (CLO3) và "đường ngang/dọc" (CLO4) được dùng xuyên suốt mọi unit.</li>
<li><strong>CLO6</strong> ("so sánh tượng thạch cao với người mẫu thật") chỉ gắn ở buổi 37-38 — hai buổi mở đầu Unit 4 — dù về logic sự so sánh này liên quan ngay từ buổi 1.</li>
<li><strong>Unit 3 (đầu tượng nữ, buổi 25-36) chỉ gắn CLO5</strong> ("khác biệt nam/nữ") ở hai buổi mở đầu (25-26), rồi quay về CLO7/CLO8 chung chung cho phần còn lại.</li>
<li>Buổi <strong>16</strong> có ô LO trống hoàn toàn; buổi <strong>30</strong> có ô ITU trống (xem 0.5).</li>
</ul>
Chúng tôi nêu đúng ánh xạ này như bảng gốc của FLM — không tự gán lại CLO để "vá" các khoảng trống.</div>
<p><em>Nguồn: FLM · Syllabus 13344.</em></p>`,
  ]]);

const m04 = doc('drp101-0-0-tai-lieu', '0.4 — Course materials & tools|||0.4 — Giáo trình & công cụ',
  'Giáo trình DUY NHẤT (Andrew Loomis, không có link — thẻ khong-link) + đầy đủ công cụ xưởng vẽ (bục, vải nền, đầu tượng, người mẫu) và công cụ sinh viên tự mua.',
  [[
    `<span class="eyebrow">DRP101 · Section 0 · 0.4 · Materials &amp; tools</span>
<h2>Course materials &amp; tools</h2>
<p class="lead">FLM lists <strong>exactly ONE</strong> material for DRP101, and it IS the main material (Is Main Material = True).</p>
` + sachLoomis + `
<div class="callout"><span class="badge">⚠️ FLM data quirks — kept as-is</span>
<ul>
<li><strong>No link.</strong> FLM marks this material <code>Is Online = False</code>, <code>Is Hard Copy = True</code> — there is no URL to give you. We are not guessing one.</li>
<li><strong>The raw FLM table has a stray trailing comma</strong> in the title: <em>"Drawing the Head and Hands,"</em>. The ISBN cell also mixes both formats with letter prefixes: <em>"ISBN 10: 0857680978, ISBN 13:9780857680976"</em>. Above we dropped the stray comma and separated the two ISBNs for readability — this note tells you the raw FLM cell looks slightly different if you check it yourself.</li>
</ul></div>
<div class="note-ct"><strong>Bổ sung của CuongThai (không phải quy định của trường):</strong> Andrew Loomis is a classic, historically influential author, and several of his books have fallen out of copyright with public scanned copies circulating online. We deliberately do <strong>not</strong> link to any scan here — buy or borrow an official Titan Books edition instead.</div>
<h3>Tools (FLM, verbatim)</h3>
<h4>1. School / drawing studio prepares</h4>
<ol>
<li>Easel.</li>
<li>40 x 60 (cm) size board.</li>
<li>60 x 90 (cm) size board.</li>
<li>02 pedestal, podium: 120L x 70W x 100H (cm).</li>
<li><strong>05 drapery samples</strong>, size 150x150 (cm), <strong>five colors: black, white, grey, blue and brown.</strong></li>
<li>Plaster cast <strong>male head (quantity: 02)</strong>, plaster cast <strong>female head (quantity: 01)</strong>.</li>
<li>Model: recommend <strong>maximum 25 students/model</strong>. The type of model might be a live model or a composite full body statue with muscle and bone separation or other types appropriate to each campus.</li>
<li>01 shelves.</li>
<li>01 projector.</li>
</ol>
<h4>2. Student prepares</h4>
<ol>
<li>Graphite pencil or Charcoal pencil.</li>
<li>Drawing tube.</li>
<li>Eraser.</li>
<li>Gauges, wires, clamps, pins…</li>
<li><strong>A2 size drawing paper.</strong></li>
<li>Knife.</li>
</ol>
<p><em>Nguồn: FLM · Syllabus 13344.</em></p>`,
    `<span class="eyebrow">DRP101 · Mục 0 · 0.4 · Giáo trình &amp; công cụ</span>
<h2>Giáo trình &amp; công cụ</h2>
<p class="lead">FLM liệt kê <strong>ĐÚNG MỘT</strong> tài liệu cho DRP101, và nó CHÍNH LÀ tài liệu chính (Is Main Material = True).</p>
` + sachLoomis + `
<div class="callout"><span class="badge">⚠️ FLM ghi vậy, giữ nguyên</span>
<ul>
<li><strong>Không có link.</strong> FLM đánh dấu tài liệu này <code>Is Online = False</code>, <code>Is Hard Copy = True</code> — không có URL để đưa. Chúng tôi không tự đoán link.</li>
<li><strong>Bảng gốc FLM có dấu phẩy lạc ở cuối tên sách</strong>: <em>"Drawing the Head and Hands,"</em>. Ô ISBN cũng gộp cả hai định dạng kèm tiền tố chữ: <em>"ISBN 10: 0857680978, ISBN 13:9780857680976"</em>. Ở trên chúng tôi đã bỏ dấu phẩy thừa và tách hai mã ISBN cho dễ đọc — ghi chú này để bạn biết ô gốc trên FLM trông hơi khác nếu tự kiểm tra.</li>
</ul></div>
<div class="note-ct"><strong>Bổ sung của CuongThai (không phải quy định của trường):</strong> Andrew Loomis là tác giả kinh điển, có ảnh hưởng lớn, và nhiều sách của ông đã hết bản quyền với bản quét công khai lưu hành trên mạng. Ở đây chúng tôi <strong>chủ động KHÔNG</strong> gắn link tới bất kỳ bản quét nào — hãy mua hoặc mượn đúng bản Titan Books chính thức.</div>
<h3>Công cụ (nguyên văn FLM, dịch)</h3>
<h4>1. Trường / xưởng vẽ chuẩn bị</h4>
<ol>
<li>Giá vẽ (easel).</li>
<li>Bảng vẽ 40 x 60 (cm).</li>
<li>Bảng vẽ 60 x 90 (cm).</li>
<li>02 bục/đế (pedestal, podium): 120 dài x 70 rộng x 100 cao (cm).</li>
<li><strong>05 tấm vải nền (drapery)</strong>, kích thước 150x150 (cm), <strong>năm màu: đen, trắng, xám, xanh (blue) và nâu.</strong></li>
<li>Đầu tượng thạch cao <strong>nam (số lượng: 02)</strong>, đầu tượng thạch cao <strong>nữ (số lượng: 01)</strong>.</li>
<li>Người mẫu: khuyến nghị <strong>tối đa 25 sinh viên/người mẫu</strong>. Loại mẫu có thể là người mẫu thật hoặc tượng toàn thân ghép tách cơ-xương, hoặc loại khác phù hợp điều kiện triển khai tại từng campus.</li>
<li>01 giá/kệ.</li>
<li>01 máy chiếu.</li>
</ol>
<h4>2. Sinh viên chuẩn bị</h4>
<ol>
<li>Bút chì graphite hoặc chì than (charcoal).</li>
<li>Ống đựng tranh.</li>
<li>Tẩy (gôm).</li>
<li>Thước đo, dây, kẹp, ghim…</li>
<li><strong>Giấy vẽ khổ A2.</strong></li>
<li>Dao.</li>
</ol>
<p><em>Nguồn: FLM · Syllabus 13344.</em></p>`,
  ]]);

// ── 0.5 — Kế hoạch 60 buổi: dựng bằng nối chuỗi thường (KHÔNG template lồng) ──
const buoiData = [
  [1, 'Unit 1: Plaster cast male head 1', 'Unit 1: Đầu tượng thạch cao nam 1', 'CLO1, CLO2, CLO3, CLO4', 'Chương 1 (đầy đủ)'],
  [2, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [3, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [4, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [5, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [6, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [7, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [8, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [9, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [10, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [11, 'Evaluation and grading', 'Chấm &amp; đánh giá', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [12, 'Evaluation and grading', 'Chấm &amp; đánh giá', 'CLO7, CLO8', 'Chương 1 (đầy đủ)'],
  [13, 'Unit 2: Plaster cast male head 2Practice', 'Unit 2: Đầu tượng thạch cao nam 2 (thực hành)', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [14, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [15, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [16, 'Practice', 'Thực hành', '<span class="badge">⚠️ trống</span>', 'Chương 2 (khung)'],
  [17, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [18, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [19, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [20, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [21, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [22, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [23, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [24, 'Evaluation and grading', 'Chấm &amp; đánh giá', 'CLO7, CLO8', 'Chương 2 (khung)'],
  [25, 'Unit 3: Plaster cast female head', 'Unit 3: Đầu tượng thạch cao nữ', 'CLO5', 'Chương 3 (khung)'],
  [26, 'Practice', 'Thực hành', 'CLO5', 'Chương 3 (khung)'],
  [27, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [28, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [29, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [30, 'Practice', 'Thực hành', 'CLO7, CLO8 <span class="badge">⚠️ ITU trống</span>', 'Chương 3 (khung)'],
  [31, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [32, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [33, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [34, 'Practice', 'Thực hành', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [35, 'Evaluation and grading', 'Chấm &amp; đánh giá', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [36, 'Evaluation and grading', 'Chấm &amp; đánh giá', 'CLO7, CLO8', 'Chương 3 (khung)'],
  [37, 'Unit 4: Live model male portrait.', 'Unit 4: Chân dung người mẫu thật nam.', 'CLO6', 'Chương 4 (khung)'],
  [38, 'Practice', 'Thực hành', 'CLO6', 'Chương 4 (khung)'],
  [39, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [40, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [41, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [42, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [43, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [44, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [45, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [46, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [47, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [48, 'Evaluation and grading', 'Chấm &amp; đánh giá', 'CLO7, CLO8, CLO9, CLO10', 'Chương 4 (khung)'],
  [49, 'Unit 5: Live model female portrait.Practice', 'Unit 5: Chân dung người mẫu thật nữ (thực hành)', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [50, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [51, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [52, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [53, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [54, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [55, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [56, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [57, 'Practice', 'Thực hành', 'CLO7, CLO8, CLO9, CLO10', 'Chương 5 (khung)'],
  [58, 'Practice', 'Thực hành', 'CCLO7, CCLO8, CCLO9, CCLO10 <span class="badge">⚠️ lỗi gõ</span>', 'Chương 5 (khung)'],
  [59, 'Evaluation and grading', 'Chấm &amp; đánh giá', 'CCLO7, CCLO8, CCLO9, CCLO10 <span class="badge">⚠️ lỗi gõ</span>', 'Chương 5 (khung)'],
  [60, 'Progress Test', 'Progress Test (kiểm tra tiến độ)', 'CLO1, CLO2, CLO3, CLO4, CLO5, CLO6, CLO7, CLO8, CLO9, CLO10', 'Chương 6 (khung)'],
];
const rowHtml = (r) => '<tr><td>Buổi ' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>';
const buoiRowsHtml = buoiData.map(rowHtml).join('');
const buoiTableEn =
  '<table><tr><th>Session</th><th>Topic (English, verbatim FLM)</th><th>Chủ đề (Việt)</th><th>LO / CLO</th><th>Lesson on site</th></tr>' +
  buoiRowsHtml + '</table>';
const buoiTableVi =
  '<table><tr><th>Buổi</th><th>Chủ đề (Anh, nguyên văn FLM)</th><th>Chủ đề (Việt)</th><th>LO / CLO</th><th>Bài trên web</th></tr>' +
  buoiRowsHtml + '</table>';

const m05 = doc('drp101-0-5-ke-hoach-60-buoi', '0.5 — Full 60-session plan|||0.5 — Kế hoạch đủ 60 buổi',
  'Bảng đầy đủ 60 buổi FLM (5 Unit x 12 buổi), giữ nguyên chủ đề tiếng Anh + cột tiếng Việt + cột "Bài trên web". Nêu rõ buổi 13 & 49 dính chữ; Student Materials/S-Download/URLs như nhau cho cả 60 buổi.',
  [[
    '<span class="eyebrow">DRP101 · Section 0 · 0.5 · 60-session plan</span>' +
    '<h2>Full 60-session plan (FLM, verbatim topics)</h2>' +
    '<p class="lead">All 45 contact hours (60 sessions, 5 Units x 12 sessions) exactly as scheduled by FLM. The last column shows which lesson on this site covers each session — Chapter 1 (sessions 1-12, Unit 1) is fully taught; Chapters 2-6 are a framework (skeleton) for now.</p>' +
    buoiTableEn +
    '<div class="callout"><span class="badge">⚠️ Kept as FLM published it</span><p>Sessions <strong>13</strong> ("Unit 2: Plaster cast male head 2<u>Practice</u>") and <strong>49</strong> ("Unit 5: Live model female portrait.<u>Practice</u>") run the Unit heading and the word "Practice" together with no space in FLM\'s own table. We report the raw string rather than silently inserting a space or splitting it into two cells.</p></div>' +
    '<div class="callout"><span class="badge">Same for all 60 sessions</span><p><strong>Student Materials</strong> = "Syllabus, slide, textbook" on every single session. <strong>S-Download</strong> and <strong>URLs</strong> are BLANK for all 60 sessions — FLM does not attach any downloadable file or link to this session plan.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13344 · thu thập 20/09/2026.</em></p>',
    '<span class="eyebrow">DRP101 · Mục 0 · 0.5 · Kế hoạch 60 buổi</span>' +
    '<h2>Kế hoạch đủ 60 buổi (nguyên văn chủ đề FLM)</h2>' +
    '<p class="lead">Đủ 45 giờ lên lớp (60 buổi, 5 Unit x 12 buổi) đúng như FLM xếp lịch. Cột cuối cho biết bài nào trên web phủ buổi đó — Chương 1 (buổi 1-12, Unit 1) dạy đầy đủ; Chương 2-6 hiện là khung, sẽ bổ sung chi tiết sau.</p>' +
    buoiTableVi +
    '<div class="callout"><span class="badge">⚠️ Giữ nguyên như FLM công bố</span><p>Buổi <strong>13</strong> ("Unit 2: Plaster cast male head 2<u>Practice</u>") và buổi <strong>49</strong> ("Unit 5: Live model female portrait.<u>Practice</u>") bị dính liền tên Unit với chữ "Practice", không có khoảng trắng, ngay trong bảng gốc của FLM. Chúng tôi nêu đúng chuỗi gốc, không tự thêm khoảng trắng hay tách thành hai ô.</p></div>' +
    '<div class="callout"><span class="badge">Giống nhau ở cả 60 buổi</span><p><strong>Student Materials</strong> = "Syllabus, slide, textbook" ở mọi buổi. <strong>S-Download</strong> và <strong>URLs</strong> đều TRỐNG cho cả 60 buổi — FLM không đính kèm file tải hay link nào cho bảng kế hoạch này.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13344 · thu thập 20/09/2026.</em></p>',
  ]]);

const m06 = doc('drp101-0-6-nhiem-vu-sinh-vien', '0.6 — Student tasks (verbatim)|||0.6 — Nhiệm vụ sinh viên (nguyên văn)',
  'Nguyên văn nhiệm vụ sinh viên theo FLM (StudentTasks) + dịch — gồm dự ≥80% buổi "để được thi cuối kỳ" (mâu thuẫn với việc môn không có thi cuối kỳ, xem 0.2) và nộp Portfolio 1 ngày sau khi kết thúc môn.',
  [[
    `<span class="eyebrow">DRP101 · Section 0 · 0.6 · Student tasks</span>
<h2>Student tasks (FLM, verbatim)</h2>
<ul>
<li>Attend at least 80% of contact hours <strong>in order to be accepted to the final examination</strong> <span class="badge">⚠️ see contradiction below</span></li>
<li>Actively participate in class activities</li>
<li>Fulfil tasks given by instructor after class</li>
<li>Use their own laptop in class only for learning purpose</li>
<li>Read the textbook and references in advance</li>
<li>Access the course website (<a href="https://flm.fpt.edu.vn/" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) for up-to-date information and material of the course</li>
<li><strong>Complete course's Portfolio</strong> with full contents of exercises and <strong>submit to the teacher 1 day after the course.</strong></li>
</ul>
<div class="callout"><span class="badge">⚠️ Same contradiction as 0.2</span> DRP101 has <strong>NO final exam</strong> (0.2: 100% on-going grading) — yet this exact list, copied verbatim from FLM, says attendance is required "in order to be accepted to the final examination". We keep FLM's own wording; the inconsistency is in their document, not something we introduced.</div>
<div class="callout"><span class="badge">Portfolio deadline</span> The Portfolio (all completed drawings/exercises) is due <strong>1 day after the course ends</strong> — a tight turnaround. Start organizing your five practice drawings as you finish each Unit, not at the very end.</div>
<p><em>Nguồn: FLM · Syllabus 13344.</em></p>`,
    `<span class="eyebrow">DRP101 · Mục 0 · 0.6 · Nhiệm vụ sinh viên</span>
<h2>Nhiệm vụ sinh viên (nguyên văn FLM, dịch)</h2>
<ul>
<li>Dự tối thiểu 80% giờ lên lớp <strong>để được chấp nhận thi cuối kỳ</strong> <span class="badge">⚠️ xem mâu thuẫn bên dưới</span></li>
<li>Tích cực tham gia hoạt động trên lớp</li>
<li>Hoàn thành bài tập giảng viên giao sau giờ học</li>
<li>Chỉ dùng laptop cá nhân trong lớp cho mục đích học tập</li>
<li>Đọc trước giáo trình &amp; tài liệu tham khảo</li>
<li>Vào trang môn học (<a href="https://flm.fpt.edu.vn/" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) để cập nhật thông tin &amp; tài liệu môn học</li>
<li><strong>Hoàn thành Portfolio môn học</strong> đủ nội dung các bài tập và <strong>nộp cho giảng viên 1 ngày sau khi kết thúc môn.</strong></li>
</ul>
<div class="callout"><span class="badge">⚠️ Mâu thuẫn giống mục 0.2</span> DRP101 <strong>KHÔNG có thi cuối kỳ</strong> (0.2: 100% điểm quá trình) — vậy mà đúng danh sách này, chép nguyên văn từ FLM, lại ghi điều kiện dự lớp là "để được chấp nhận thi cuối kỳ". Chúng tôi giữ nguyên câu chữ của FLM; sự thiếu nhất quán nằm trong chính văn bản của họ, không phải do chúng tôi thêm vào.</div>
<div class="callout"><span class="badge">Hạn nộp Portfolio</span> Portfolio (toàn bộ bài vẽ/bài tập đã hoàn thành) phải nộp <strong>1 ngày sau khi môn kết thúc</strong> — thời gian rất gấp. Hãy sắp xếp gọn 5 bài vẽ ngay sau khi xong mỗi Unit, đừng để dồn tới cuối.</div>
<p><em>Nguồn: FLM · Syllabus 13344.</em></p>`,
  ]]);

const cauHoiData = [
  [2, 'QN1', 'When drawing a portrait or any part of the portrait, initially, should we draw details or focus on the whole? Why?', 'Khi vẽ chân dung hoặc một phần chân dung, ban đầu nên vẽ chi tiết hay tập trung vào tổng thể trước? Vì sao?'],
  [2, 'QN2', 'Do designers who draw great start off drawing by copying? Why?', 'Những nhà thiết kế vẽ giỏi có bắt đầu bằng cách chép lại (copy) không? Vì sao?'],
  [3, 'QN1', 'How do designers know what to draw?', 'Nhà thiết kế biết phải vẽ gì bằng cách nào?'],
  [4, 'QN1', 'What technical requirements are needed to learn more effectively in drawing portrait?', 'Cần yêu cầu kỹ thuật nào để học vẽ chân dung hiệu quả hơn?'],
  [5, 'QN1', "Is there anything you don't like to draw? Why?", 'Có thứ gì bạn không thích vẽ không? Vì sao?'],
  [6, 'QN1', 'Why do we have to memorize the ideal proportion of human head?', 'Vì sao phải thuộc tỉ lệ lý tưởng của đầu người?'],
  [7, 'QN1', 'Presenting the proportional measurement of details: hairline, eyebrow bone, eye socket, tip of nose, lips, chin, ears?', 'Trình bày cách đo tỉ lệ các chi tiết: chân tóc, xương chân mày, hốc mắt, đầu mũi, môi, cằm, tai?'],
  [8, 'QN1', 'How do you decide what would be best to draw portraits?', 'Bạn quyết định thế nào là cách tốt nhất để vẽ chân dung?'],
  [9, 'QN1', "What do artists think about while they're drawing a portrait?", 'Người vẽ nghĩ về điều gì trong lúc vẽ chân dung?'],
  [10, 'QN1', "Why do we should draw organic shapes before drawing object's details?", 'Vì sao nên vẽ hình khối tổng quát trước khi vẽ chi tiết của vật thể?'],
  [11, 'QN1', 'Should we draw what we see or how we see it?', 'Nên vẽ CÁI ta thấy, hay vẽ CÁCH ta thấy nó?'],
  [12, 'QN1', 'Should we experience with different drawing tools in drawing portraits?', 'Có nên thử nhiều loại dụng cụ vẽ khác nhau khi vẽ chân dung không?'],
  [13, 'QN1', 'What are the differences between male face and female face?', 'Khác biệt giữa khuôn mặt nam và nữ là gì?'],
  [14, 'QN1', 'What do you draw first when drawing a face?', 'Khi vẽ mặt, bạn vẽ cái gì trước tiên?'],
  [15, 'QN1', 'When drawing portraits, should we start with the face first before the head or the opposite?', 'Khi vẽ chân dung, nên vẽ mặt trước rồi mới đến đầu, hay ngược lại?'],
  [16, 'QN1', 'What are the differences between plaster cast head and portrait from live model?', 'Khác biệt giữa đầu tượng thạch cao và chân dung từ người mẫu thật là gì?'],
  [17, 'QN1', 'How to built up the facial basic line and horizontal line: hair line, eyebrows line, nose line and chin line?', 'Dựng đường cơ bản của mặt và đường ngang (chân tóc, chân mày, mũi, cằm) như thế nào?'],
  [18, 'QN1', 'Does studying well portraits create long-term benefits for you to study graphic design?', 'Học tốt vẽ chân dung có mang lại lợi ích lâu dài cho việc học thiết kế đồ hoạ không?'],
  [19, 'QN1', 'When we want to build a design, is understanding human structure in general really necessary?', 'Khi muốn xây dựng một thiết kế, hiểu cấu trúc con người nói chung có thực sự cần thiết không?'],
  [20, 'QN1', 'From your perspective, what is the most effective way to learn how to draw the portraits?', 'Theo bạn, cách hiệu quả nhất để học vẽ chân dung là gì?'],
];
const cauHoiRow = (r) => '<tr><td>Buổi ' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
const cauHoiRowsHtml = cauHoiData.map(cauHoiRow).join('');

const m07 = doc('drp101-0-7-cau-hoi-kien-tao', '0.7 — Constructive questions (20 questions, sessions 2-20)|||0.7 — Bảng câu hỏi kiến tạo (20 câu, buổi 2-20)',
  'Nguyên văn 20 câu hỏi kiến tạo FLM + dịch. ⚠️ Chỉ phủ buổi 2 đến 20 — 40 buổi sau (21-60) không có câu hỏi kiến tạo nào trong syllabus gốc.',
  [[
    '<span class="eyebrow">DRP101 · Section 0 · 0.7 · Constructive questions</span>' +
    '<h2>Constructive questions (FLM, verbatim + translation)</h2>' +
    '<p class="lead">FLM\'s syllabus includes a table of 20 "Constructive Questions" for class discussion. Sessions 2-12 are woven into Chapter 1 as discussion prompts; the full table is reproduced here for reference.</p>' +
    '<table><tr><th>Session</th><th>No.</th><th>Question (English, verbatim)</th><th>Câu hỏi (dịch)</th></tr>' + cauHoiRowsHtml + '</table>' +
    '<div class="callout"><span class="badge">⚠️ Coverage gap in FLM\'s own table</span><p>The Constructive Questions table published by FLM stops at <strong>session 20</strong>. Sessions <strong>21 through 60</strong> (40 sessions — all of Units 3, 4, 5 and the Progress Test) have <strong>no constructive question at all</strong> in the original syllabus. We are not adding questions FLM did not publish.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13344.</em></p>',
    '<span class="eyebrow">DRP101 · Mục 0 · 0.7 · Câu hỏi kiến tạo</span>' +
    '<h2>Bảng câu hỏi kiến tạo (nguyên văn FLM + dịch)</h2>' +
    '<p class="lead">Syllabus của FLM có một bảng 20 "Câu hỏi kiến tạo" (Constructive Questions) dùng để thảo luận trên lớp. Các câu của buổi 2-12 được lồng vào Chương 1 làm câu hỏi thảo luận; bảng đầy đủ được in lại ở đây để tra cứu.</p>' +
    '<table><tr><th>Buổi</th><th>Số</th><th>Câu hỏi (tiếng Anh, nguyên văn)</th><th>Câu hỏi (dịch)</th></tr>' + cauHoiRowsHtml + '</table>' +
    '<div class="callout"><span class="badge">⚠️ Khoảng trống ngay trong bảng gốc của FLM</span><p>Bảng Câu hỏi kiến tạo của FLM dừng lại ở <strong>buổi 20</strong>. Các buổi <strong>21 đến 60</strong> (40 buổi — toàn bộ Unit 3, 4, 5 và Progress Test) <strong>không có câu hỏi kiến tạo nào</strong> trong syllabus gốc. Chúng tôi không tự thêm câu hỏi mà FLM chưa công bố.</p></div>' +
    '<p><em>Nguồn: FLM · Syllabus 13344.</em></p>',
  ]]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 1 — Unit 1: Đầu tượng thạch cao nam 1 (buổi 1-12) — ĐẦY ĐỦ
// ─────────────────────────────────────────────────────────────────────────

const l11 = doc('drp101-1-1-chan-dung-la-gi', '1.1 — What is a portrait? Plaster cast vs a live model|||1.1 — Chân dung là gì? Tượng thạch cao khác gì người mẫu thật',
  'Định nghĩa chân dung; vì sao học vẽ TƯỢNG THẠCH CAO trước người thật (CLO1); khác biệt tượng vs người thật (CLO6, chính thức FLM gắn ở buổi 37-38 — web giới thiệu sớm). Câu hỏi thảo luận buổi 2, 3, 5, 9.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.1 · CLO1, CLO6</span>
<h2>What is a portrait? Plaster cast vs a live model</h2>
<p class="lead">After this lesson you can state what a "portrait" means in this course (CLO1), and explain why the very first drawings you make are of a motionless white plaster head rather than a living person.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 — "Unit 1: Plaster cast male head 1"</p>
<h3>What is a portrait?</h3>
<p>A <strong>portrait</strong> is a drawing (or painting, sculpture…) that represents a specific individual, built from careful observation of that person's actual proportions, structure and features — not a generic, invented face. In this course "portrait" covers both the plaster-cast head (an idealized, symmetrical stand-in) and the later live-model portrait (a real, unique face).</p>
<h3>Why a plaster cast comes first</h3>
<table>
<tr><th>Plaster cast head</th><th>Live human model</th></tr>
<tr><td>Pure white, matte surface — <strong>no colour, no distracting skin tones</strong>. Only form and shadow are visible.</td><td>Skin tone, texture, blemishes, and colour variation compete for your attention.</td></tr>
<tr><td>Perfectly still for hours.</td><td>Breathes, shifts weight, blinks, tires — the pose is never 100% identical twice.</td></tr>
<tr><td>Idealized, symmetrical proportions close to the textbook average.</td><td>Real individual proportions, often noticeably asymmetric.</td></tr>
<tr><td>The lighting stays fixed if you do not move the studio lamp.</td><td>Lighting on a person changes with even small posture shifts.</td></tr>
</table>
<p>Every one of these differences removes a variable so you can focus on ONE skill at a time: seeing <strong>form and light</strong> without colour and movement getting in the way. That is the whole reason Unit 1-3 use plaster casts before Unit 4-5 introduce a live model.</p>
<div class="note-ct"><strong>Ghi chú của web:</strong> FLM's own CLO6 ("compare plaster cast head vs live-model portrait") is officially tagged only at sessions 37-38 (Unit 4, see 0.3). We introduce the idea here, in session 1, purely as a study aid — this ordering is our own pedagogical choice, not FLM's session schedule.</div>
<h3>Discussion — from the FLM Constructive Questions table</h3>
<div class="callout"><span class="badge">Buổi 2 · QN1</span> When drawing a portrait or any part of it, should you start with details or the whole shape first? Why?</div>
<div class="callout"><span class="badge">Buổi 2 · QN2</span> Do artists who draw very well start out by copying other work? Why?</div>
<div class="callout"><span class="badge">Buổi 3 · QN1</span> How do artists decide what to draw?</div>
<div class="callout"><span class="badge">Buổi 5 · QN1</span> Is there anything you personally dislike drawing? Why?</div>
<div class="callout"><span class="badge">Buổi 9 · QN1</span> What do artists think about while they are drawing a portrait?</div>
<p>There is no single correct answer expected for these — FLM lists them as discussion prompts (Learning-Teaching Method includes "discussion"). Bring your own honest answer to class.</p>
<h3>Self-check</h3>
<ul>
<li>Can you name at least three differences between drawing a plaster cast and a live model?</li>
<li>Can you explain, in one sentence, why removing colour helps a beginner see form more clearly?</li>
</ul>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.1 · CLO1, CLO6</span>
<h2>Chân dung là gì? Tượng thạch cao khác gì người mẫu thật</h2>
<p class="lead">Học xong bài này bạn nói được "chân dung" trong môn này nghĩa là gì (CLO1), và giải thích được vì sao những bài vẽ đầu tiên lại là một đầu tượng thạch cao trắng đứng yên chứ không phải một người sống.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 — "Unit 1: Plaster cast male head 1"</p>
<h3>Chân dung là gì?</h3>
<p><strong>Chân dung</strong> là một bài vẽ (hoặc tranh, tượng…) thể hiện một cá nhân cụ thể, dựng từ quan sát cẩn thận tỉ lệ, cấu trúc và ngũ quan thật của người đó — không phải một khuôn mặt chung chung, bịa ra. Trong môn này, "chân dung" bao gồm cả đầu tượng thạch cao (bản thay thế lý tưởng hoá, đối xứng) lẫn chân dung người mẫu thật sau này (một khuôn mặt thật, riêng biệt).</p>
<h3>Vì sao học tượng thạch cao trước</h3>
<table>
<tr><th>Đầu tượng thạch cao</th><th>Người mẫu thật</th></tr>
<tr><td>Bề mặt trắng, mờ (matte) — <strong>không màu, không có tông da gây phân tâm</strong>. Chỉ thấy khối và bóng.</td><td>Tông da, kết cấu, khuyết điểm, biến thiên màu sắc kéo sự chú ý của bạn.</td></tr>
<tr><td>Đứng im tuyệt đối hàng giờ.</td><td>Thở, đổi trọng tâm, chớp mắt, mỏi — dáng không bao giờ giống hệt hai lần.</td></tr>
<tr><td>Tỉ lệ lý tưởng hoá, đối xứng, gần với tỉ lệ trung bình trong sách.</td><td>Tỉ lệ cá nhân thật, thường lệch (bất đối xứng) rõ rệt.</td></tr>
<tr><td>Ánh sáng cố định nếu bạn không di chuyển đèn xưởng.</td><td>Ánh sáng trên người thay đổi chỉ với một thay đổi tư thế nhỏ.</td></tr>
</table>
<p>Mỗi khác biệt trên loại bỏ một biến số để bạn tập trung vào ĐÚNG MỘT kỹ năng: thấy <strong>khối và ánh sáng</strong> mà không bị màu sắc và chuyển động gây nhiễu. Đó là toàn bộ lý do Unit 1-3 dùng tượng thạch cao trước khi Unit 4-5 mới đưa người mẫu thật vào.</p>
<div class="note-ct"><strong>Ghi chú của web:</strong> CLO6 chính thức của FLM ("so sánh đầu tượng thạch cao với chân dung người mẫu thật") chỉ được gắn ở buổi 37-38 (Unit 4, xem 0.3). Chúng tôi giới thiệu ý này ngay từ buổi 1 như một cách học — đây là lựa chọn sư phạm của web, không phải lịch của FLM.</div>
<h3>Thảo luận — trích bảng Câu hỏi kiến tạo của FLM</h3>
<div class="callout"><span class="badge">Buổi 2 · QN1</span> Khi vẽ chân dung hoặc một phần của nó, nên bắt đầu bằng chi tiết hay hình tổng thể trước? Vì sao?</div>
<div class="callout"><span class="badge">Buổi 2 · QN2</span> Những người vẽ giỏi có bắt đầu bằng cách chép lại tác phẩm khác không? Vì sao?</div>
<div class="callout"><span class="badge">Buổi 3 · QN1</span> Người vẽ quyết định vẽ cái gì bằng cách nào?</div>
<div class="callout"><span class="badge">Buổi 5 · QN1</span> Có thứ gì bạn thực sự không thích vẽ không? Vì sao?</div>
<div class="callout"><span class="badge">Buổi 9 · QN1</span> Người vẽ nghĩ về điều gì trong lúc vẽ chân dung?</div>
<p>Không có đáp án đúng duy nhất cho các câu này — FLM liệt kê chúng để thảo luận (phương pháp dạy-học có "discussion"). Hãy mang câu trả lời thật của riêng bạn tới lớp.</p>
<h3>Tự kiểm</h3>
<ul>
<li>Bạn nêu được ít nhất ba khác biệt giữa vẽ tượng thạch cao và vẽ người mẫu thật không?</li>
<li>Bạn giải thích được trong một câu vì sao bỏ màu giúp người mới thấy khối rõ hơn không?</li>
</ul>`,
  ]]);

const l12 = doc('drp101-6-1-head-anatomy-proportion', '1.2 — Standard facial proportion (the Loomis method)|||1.2 — Tỉ lệ khuôn mặt chuẩn (phương pháp Loomis)',
  'Phương pháp Loomis (khối cầu + mặt phẳng cắt); tỉ lệ mặt bằng số đo cụ thể theo đơn vị "chiều dài đầu" (CLO2); vì sao đo theo đơn vị chứ không theo cm. Câu hỏi thảo luận buổi 6, 7.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.2 · CLO2</span>
<h2>Standard facial proportion — the Loomis method</h2>
<p class="lead">After this lesson you can place every major facial landmark correctly on a front-view head using proportion, not guesswork — and you can explain why professionals measure in "head units" instead of centimetres. This is CLO2: "Memorize the facial proportion" (verbatim FLM).</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 — "Unit 1: Plaster cast male head 1" (CLO2 gắn tại buổi 1)</p>
<h3>Why measure in "head units", not centimetres</h3>
<p>A centimetre on your paper means nothing unless you know how big you drew the head. If you drew the head 12cm tall, "the eyes are 1cm below the brow" is a useless instruction for someone who drew the head 20cm tall. But <strong>ratios scale with the drawing</strong>: "the eyes sit at the halfway line of the whole head" is true whether your head is 8cm or 30cm tall. That is why every proportion rule below is stated as a fraction of the head's own height or width, never in cm.</p>
<h3>The Loomis construction</h3>
<p>Andrew Loomis (this course's official textbook, see 0.4) builds the head as a <strong>ball with the sides sliced off flat</strong>. The ball becomes the cranium; the flat slice on each side is where the jaw attaches and the ear sits. A <strong>centre line</strong> (vertical, follows the turn of the head) and a <strong>brow line</strong> (horizontal, follows the tilt) are drawn on the ball first — every feature is then placed relative to these two lines, so if the head tilts or turns, the whole face turns with it instead of features "sliding off".</p>
<h3>Proportion table — front view, straight-on</h3>
<table>
<tr><th>Measurement</th><th>Rule (fraction of head)</th><th>Why it matters</th></tr>
<tr><td>Eye line</td><td>Exactly at the <strong>halfway line</strong> of the whole head (crown to chin)</td><td>Beginners place eyes far too high — closer to 1/3 down, not 1/2 — because they only count the <em>visible</em> face and forget the hair-covered skull above.</td></tr>
<tr><td>Width of the face</td><td>About <strong>five eye-widths</strong> across</td><td>Gives you a ruler already sitting on the face: measure everything else against "one eye".</td></tr>
<tr><td>Gap between the eyes</td><td><strong>One eye-width</strong></td><td>The single most useful spacing check — if it looks off, measure this first.</td></tr>
<tr><td>Hairline to brow</td><td>1/3 of face height (hairline to chin)</td><td>The forehead "third".</td></tr>
<tr><td>Brow to base of nose</td><td>1/3 of face height</td><td>The nose "third".</td></tr>
<tr><td>Base of nose to chin</td><td>1/3 of face height</td><td>The mouth/chin "third" — mouth sits roughly 1/3 of the way down this segment.</td></tr>
<tr><td>Ear (front view)</td><td>Top of ear near brow line; bottom of ear near base-of-nose line</td><td>Ears are almost always drawn too small and too high.</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Common mistake — the #1 beginner error</span> Placing the eyes at 1/3 down instead of exactly at the <strong>half-way line</strong>. This single error makes an otherwise well-drawn head look "off" more than any other mistake, because it shrinks the forehead and makes the whole skull read as too small.</div>
<h3>Discussion — from the FLM Constructive Questions table</h3>
<div class="callout"><span class="badge">Buổi 6 · QN1</span> Why do we have to memorize the ideal proportion of the human head?</div>
<div class="callout"><span class="badge">Buổi 7 · QN1</span> Present the proportional measurements of: hairline, eyebrow bone, eye socket, tip of nose, lips, chin, ears.</div>
<h3>Practice &amp; self-check</h3>
<p>On your own plaster-cast drawing (or a photo reference), measure with a pencil at arm's length: is the eye line really at the half-way point? Is the gap between the eyes really one eye wide? These rules describe an <strong>average</strong> adult — your actual model will vary; use the rule to catch obvious errors, then trust your measured eye for the rest.</p>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.2 · CLO2</span>
<h2>Tỉ lệ khuôn mặt chuẩn — phương pháp Loomis</h2>
<p class="lead">Học xong bài này bạn đặt đúng vị trí mọi mốc chính trên một khuôn mặt nhìn chính diện bằng tỉ lệ, không phải đoán mò — và giải thích được vì sao dân chuyên đo bằng "đơn vị đầu" chứ không phải cm. Đây là CLO2: "Thuộc tỉ lệ khuôn mặt" (nguyên văn FLM).</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 — "Unit 1: Plaster cast male head 1" (CLO2 gắn tại buổi 1)</p>
<h3>Vì sao đo bằng "đơn vị đầu", không phải cm</h3>
<p>Một centimet trên giấy chẳng có ý nghĩa gì nếu không biết bạn vẽ đầu to cỡ nào. Nếu bạn vẽ đầu cao 12cm, câu "mắt nằm dưới chân mày 1cm" là vô dụng với người vẽ đầu cao 20cm. Nhưng <strong>tỉ lệ thì co giãn theo bài vẽ</strong>: "mắt nằm ở đường giữa của toàn bộ đầu" luôn đúng dù đầu bạn cao 8cm hay 30cm. Đó là lý do mọi quy tắc tỉ lệ dưới đây đều nói bằng phân số của chiều cao/rộng đầu, không bao giờ bằng cm.</p>
<h3>Cách dựng của Loomis</h3>
<p>Andrew Loomis (giáo trình chính thức của môn, xem 0.4) dựng đầu như một <strong>quả cầu bị cắt phẳng hai bên</strong>. Quả cầu trở thành hộp sọ; lát cắt phẳng mỗi bên là nơi gắn hàm và đặt tai. Một <strong>đường trục</strong> (dọc, theo độ xoay của đầu) và một <strong>đường chân mày</strong> (ngang, theo độ nghiêng) được vẽ lên quả cầu trước tiên — mọi ngũ quan sau đó đặt tương đối với hai đường này, nên khi đầu nghiêng hay xoay, cả khuôn mặt xoay theo thay vì các chi tiết "trôi" khỏi vị trí.</p>
<h3>Bảng tỉ lệ — nhìn chính diện</h3>
<table>
<tr><th>Số đo</th><th>Quy tắc (phân số của đầu)</th><th>Vì sao quan trọng</th></tr>
<tr><td>Đường mắt</td><td>Đúng ngay <strong>đường giữa</strong> của toàn bộ đầu (đỉnh đầu tới cằm)</td><td>Người mới hay đặt mắt cao hơn hẳn — gần 1/3 từ trên xuống thay vì 1/2 — vì chỉ tính phần mặt nhìn thấy mà quên phần hộp sọ bị tóc che phía trên.</td></tr>
<tr><td>Chiều rộng khuôn mặt</td><td>Khoảng <strong>năm con mắt</strong></td><td>Cho bạn sẵn một cây thước ngay trên mặt: đo mọi thứ khác theo "một con mắt".</td></tr>
<tr><td>Khoảng cách giữa hai mắt</td><td><strong>Một con mắt</strong></td><td>Phép kiểm khoảng cách hữu dụng nhất — thấy sai thì đo cái này trước tiên.</td></tr>
<tr><td>Chân tóc đến chân mày</td><td>1/3 chiều cao mặt (chân tóc tới cằm)</td><td>"Phần ba" của trán.</td></tr>
<tr><td>Chân mày đến chân mũi</td><td>1/3 chiều cao mặt</td><td>"Phần ba" của mũi.</td></tr>
<tr><td>Chân mũi đến cằm</td><td>1/3 chiều cao mặt</td><td>"Phần ba" của miệng/cằm — miệng nằm khoảng 1/3 từ trên xuống trong đoạn này.</td></tr>
<tr><td>Tai (nhìn chính diện)</td><td>Đỉnh tai gần đường chân mày; đáy tai gần đường chân mũi</td><td>Tai gần như luôn bị vẽ quá nhỏ và quá cao.</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Lỗi hay mắc — lỗi #1 của người mới</span> Đặt mắt ở 1/3 từ trên xuống thay vì đúng <strong>đường giữa</strong>. Chỉ một lỗi này thôi cũng làm một bài vẽ đầu vốn ổn trông "sai sai" hơn bất kỳ lỗi nào khác, vì nó làm trán bị thu nhỏ và cả hộp sọ trông nhỏ hơn thật.</div>
<h3>Thảo luận — trích bảng Câu hỏi kiến tạo của FLM</h3>
<div class="callout"><span class="badge">Buổi 6 · QN1</span> Vì sao phải thuộc tỉ lệ lý tưởng của đầu người?</div>
<div class="callout"><span class="badge">Buổi 7 · QN1</span> Trình bày cách đo tỉ lệ của: chân tóc, xương chân mày, hốc mắt, đầu mũi, môi, cằm, tai.</div>
<h3>Luyện tập &amp; tự kiểm</h3>
<p>Trên chính bài vẽ tượng thạch cao (hoặc ảnh mẫu) của bạn, đo bằng bút chì giơ thẳng tay: đường mắt có thực sự nằm ở điểm giữa không? Khoảng cách hai mắt có đúng bằng một con mắt không? Các quy tắc này mô tả một người lớn <strong>trung bình</strong> — mẫu thật của bạn sẽ lệch chút ít; dùng quy tắc để bắt lỗi rõ ràng, rồi tin vào mắt đã đo của mình cho phần còn lại.</p>`,
  ]]);

const l13 = doc('drp101-1-3-duong-ngang-doc', '1.3 — Horizontal & vertical construction lines|||1.3 — Đường ngang & đường dọc dựng hình',
  'Vì sao dựng hệ đường trục ngang/dọc trước khi vẽ chi tiết (CLO4, CLO7); thứ tự dựng: trục dọc → đường chân mày → đường chân tóc/mũi/miệng/cằm; sai một đường là lệch cả mặt. Câu hỏi thảo luận buổi 4, 10.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.3 · CLO4, CLO7</span>
<h2>Horizontal &amp; vertical construction lines</h2>
<p class="lead">After this lesson you can build the basic line scaffold of a head BEFORE drawing any feature — CLO4 ("understand the importance of horizontal and vertical lines") and the start of CLO7 ("build up the facial basic line: hairline, eyebrow line, nose line, chin line").</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 (CLO4) và buổi 2-10 (CLO7, "Practice")</p>
<h3>Why lines before features</h3>
<p>A face has one <strong>vertical</strong> line (the centre line, running down the nose bridge and philtrum) and several <strong>horizontal</strong> lines (hairline, brow, base of nose, mouth-line, chin). Draw these six lines correctly FIRST, lightly, and every feature you add afterward has a place to sit. Skip this step and draw the eyes straight away, and there is nothing to check them against — a single tilted eye will not look wrong until it is too late to fix cleanly.</p>
<h3>Build order</h3>
<table>
<tr><th>Step</th><th>Line</th><th>What it fixes</th></tr>
<tr><td>1</td><td>Vertical centre line</td><td>The head's tilt/turn — everything else is measured left-right from this line.</td></tr>
<tr><td>2</td><td>Brow line (horizontal)</td><td>Crosses the centre line at a right angle IF the head is level; tilts with the head if not.</td></tr>
<tr><td>3</td><td>Hairline</td><td>Top boundary of the face-proportion thirds (see 1.2).</td></tr>
<tr><td>4</td><td>Base-of-nose line</td><td>Middle boundary of the thirds.</td></tr>
<tr><td>5</td><td>Chin line</td><td>Bottom boundary of the thirds — also the head's overall bottom edge.</td></tr>
<tr><td>6</td><td>Mouth line</td><td>Roughly 1/3 of the way from nose-line to chin-line (see 1.2 table).</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Common mistake</span> Drawing the horizontal lines <strong>perfectly straight across</strong> even when the head is tilted or turned. On a real (tilted) head, these lines are curved arcs following the surface of the skull, not flat rulings — a straight horizontal line only works when the head is dead level and facing straight forward.</div>
<h3>Discussion — from the FLM Constructive Questions table</h3>
<div class="callout"><span class="badge">Buổi 4 · QN1</span> What technical requirements help you learn portrait drawing more effectively?</div>
<div class="callout"><span class="badge">Buổi 10 · QN1</span> Why should we draw organic (big, simple) shapes before drawing an object's details?</div>
<h3>Exercise</h3>
<p>On a fresh page, draw an empty oval for a head at three different tilts (level, tilted left, turned 3/4). For each, draw only the six construction lines from the table above — no features yet. Check: does the brow line curve believably with the tilt, or does it look pasted on flat?</p>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.3 · CLO4, CLO7</span>
<h2>Đường ngang &amp; đường dọc dựng hình</h2>
<p class="lead">Học xong bài này bạn dựng được bộ khung đường trục cơ bản của một cái đầu TRƯỚC KHI vẽ bất kỳ ngũ quan nào — CLO4 ("hiểu tầm quan trọng của đường ngang và đường dọc") và bước đầu của CLO7 ("dựng đường cơ bản của mặt: đường chân tóc, chân mày, mũi, cằm").</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 (CLO4) và buổi 2-10 (CLO7, "Practice")</p>
<h3>Vì sao cần đường trước ngũ quan</h3>
<p>Một khuôn mặt có một đường <strong>dọc</strong> (trục giữa, chạy qua sống mũi và nhân trung) và vài đường <strong>ngang</strong> (chân tóc, chân mày, chân mũi, đường miệng, đường cằm). Vẽ đúng sáu đường này TRƯỚC, thật nhẹ tay, rồi mọi ngũ quan thêm sau đều có chỗ để đặt vào. Bỏ qua bước này và vẽ thẳng con mắt ngay, thì chẳng còn gì để đối chiếu — một con mắt bị lệch sẽ không lộ ra là sai cho tới khi đã quá muộn để sửa gọn gàng.</p>
<h3>Thứ tự dựng</h3>
<table>
<tr><th>Bước</th><th>Đường</th><th>Cố định cái gì</th></tr>
<tr><td>1</td><td>Trục dọc (centre line)</td><td>Độ nghiêng/xoay của đầu — mọi thứ khác đo trái-phải từ đường này.</td></tr>
<tr><td>2</td><td>Đường chân mày (ngang)</td><td>Cắt vuông góc trục dọc NẾU đầu thẳng; nghiêng theo đầu nếu không.</td></tr>
<tr><td>3</td><td>Đường chân tóc</td><td>Ranh trên của các phần ba tỉ lệ mặt (xem bài 1.2).</td></tr>
<tr><td>4</td><td>Đường chân mũi</td><td>Ranh giữa của các phần ba.</td></tr>
<tr><td>5</td><td>Đường cằm</td><td>Ranh dưới của các phần ba — cũng là mép dưới cùng của đầu.</td></tr>
<tr><td>6</td><td>Đường miệng</td><td>Khoảng 1/3 từ đường mũi xuống đường cằm (xem bảng ở bài 1.2).</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Lỗi hay mắc</span> Vẽ các đường ngang <strong>thẳng băng ngang qua</strong> ngay cả khi đầu đang nghiêng hoặc xoay. Trên một cái đầu thật (nghiêng), các đường này là những cung cong bám theo bề mặt hộp sọ, không phải kẻ thẳng phẳng — đường ngang thẳng chỉ đúng khi đầu hoàn toàn ngang và nhìn thẳng chính diện.</div>
<h3>Thảo luận — trích bảng Câu hỏi kiến tạo của FLM</h3>
<div class="callout"><span class="badge">Buổi 4 · QN1</span> Yêu cầu kỹ thuật nào giúp bạn học vẽ chân dung hiệu quả hơn?</div>
<div class="callout"><span class="badge">Buổi 10 · QN1</span> Vì sao nên vẽ hình khối tổng quát (lớn, đơn giản) trước khi vẽ chi tiết của vật thể?</div>
<h3>Bài tập</h3>
<p>Trên một trang giấy mới, vẽ một hình oval trống làm đầu ở ba độ nghiêng khác nhau (thẳng, nghiêng trái, xoay 3/4). Với mỗi hình, chỉ vẽ sáu đường trục ở bảng trên — chưa vẽ ngũ quan. Kiểm tra: đường chân mày có cong hợp lý theo độ nghiêng không, hay trông như dán phẳng lên?</p>`,
  ]]);

const l14 = doc('drp101-7-1-portrait-features', '1.4 — Form & texture of eyes, nose, mouth & ears|||1.4 — Hình khối & chất liệu của mắt, mũi, miệng, tai',
  'Mỗi ngũ quan là khối 3D, không phải ký hiệu phẳng (CLO3): mắt là quả cầu trong hốc, mũi là khối nêm, miệng bám khối trụ hàm răng, tai có hình chữ. Câu hỏi thảo luận buổi 8.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.4 · CLO3</span>
<h2>Form &amp; texture of eyes, nose, mouth &amp; ears</h2>
<p class="lead">After this lesson you can describe each facial feature as a three-dimensional form rather than a flat symbol — this is CLO3 verbatim: "Understand the form and texture of eyes, nose, mouth…".</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 (CLO3 gắn tại buổi 1)</p>
<h3>Eyes — a sphere in a socket</h3>
<p>The eye is a <strong>sphere</strong> sitting inside a bony socket; the eyelids are curved bands that wrap over that ball, so they have real thickness — they are not two flat curved lines. The upper lid casts a small shadow onto the eyeball below it, and the iris is often partly covered by the upper lid. Both eyes share one continuous curved axis around the head — draw one, then carry its exact tilt across to the other.</p>
<h3>Nose — a wedge / box</h3>
<p>Think of the nose as a <strong>wedge or box</strong>: a top plane (the bridge), two side planes, and an under-plane that holds the ball of the tip and the two wings (nostrils). Most of a nose is rendered through <strong>shading on these planes</strong>, with very little hard outline — an outlined nose looks flat and cartoonish.</p>
<h3>Mouth — wrapped around a cylinder</h3>
<p>The lips wrap around the <strong>cylinder formed by the teeth and jaw</strong>, so they curve away from the viewer in space — they are not flat across the face. The line between the two lips is the darkest, most defined mark on the mouth; the outer edges of the lips themselves are soft, not hard-outlined. The upper lip usually reads slightly darker because it faces away from the main light source.</p>
<h3>Ears — a rough letter-shape</h3>
<p>In a straight-on view, the ear sits roughly between the <strong>brow line and the base-of-nose line</strong> (see 1.2/1.3), tilted back at about the same angle as the jaw. Its outer shape resembles a rough letter with an inner hollow (the concha); build the big overall shape first, then the cartilage folds inside it last.</p>
<table>
<tr><th>Feature</th><th>Basic form</th><th>Common student mistake</th></tr>
<tr><td>Eyes</td><td>Sphere in a socket, lids have thickness</td><td>Drawing two flat "almond" outlines with no lid thickness or eyeball shadow</td></tr>
<tr><td>Nose</td><td>Wedge/box with 4 planes</td><td>Outlining the nostrils heavily instead of shading the planes</td></tr>
<tr><td>Mouth</td><td>Wraps a cylinder (teeth/jaw)</td><td>Drawing lips as a flat horizontal shape, not curving into the face</td></tr>
<tr><td>Ears</td><td>Flattened letter-shape with inner bowl</td><td>Drawn too small, too high, or as an afterthought at the very end</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Common mistake</span> Drawing features as memorized <strong>line-symbols</strong> ("an eye is two curves and a dot") instead of as forms under light. No amount of extra detail fixes a feature that was never built as a 3D shape in the first place — block the form, shade its planes, THEN add a few sharp accents (lashes, nostril edges) last and lightly.</div>
<h3>Discussion — from the FLM Constructive Questions table</h3>
<div class="callout"><span class="badge">Buổi 8 · QN1</span> How do you decide what would be the best way to draw a portrait's features?</div>
<h3>Exercise</h3>
<p>Pick ONE eye from your plaster cast (or a clear reference photo). Draw it three times: (1) as a flat symbol from memory, (2) as a sphere-in-socket construction with lid thickness, (3) fully shaded. Compare — which one actually looks like it belongs on a rounded head?</p>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.4 · CLO3</span>
<h2>Hình khối &amp; chất liệu của mắt, mũi, miệng, tai</h2>
<p class="lead">Học xong bài này bạn mô tả được từng ngũ quan như một khối ba chiều thay vì một ký hiệu phẳng — đây chính là CLO3 nguyên văn: "Hiểu hình khối và chất liệu của mắt, mũi, miệng…".</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 1 (CLO3 gắn tại buổi 1)</p>
<h3>Mắt — một quả cầu trong hốc</h3>
<p>Mắt là một <strong>quả cầu</strong> nằm trong hốc xương; mí mắt là những dải cong bao lên quả cầu đó nên có bề dày thật — không phải hai đường cong phẳng. Mí trên hắt một bóng nhỏ xuống nhãn cầu bên dưới, và mống mắt thường bị mí trên che một phần. Hai mắt cùng chung một trục cong liên tục quanh đầu — vẽ một bên trước, rồi mang đúng độ nghiêng đó sang bên kia.</p>
<h3>Mũi — khối nêm / khối hộp</h3>
<p>Hình dung mũi như một <strong>khối nêm hoặc khối hộp</strong>: một mặt trên (sống mũi), hai mặt bên, và một mặt dưới giữ đầu mũi tròn và hai cánh mũi. Phần lớn cái mũi được thể hiện qua <strong>sắc độ trên các mặt này</strong>, rất ít viền cứng — mũi bị đóng viền trông phẳng và như hoạt hình.</p>
<h3>Miệng — bao quanh một khối trụ</h3>
<p>Đôi môi bao quanh <strong>khối trụ tạo bởi hàm răng và xương hàm</strong>, nên chúng cong ra xa người xem trong không gian — không phẳng ngang trên mặt. Đường khép giữa hai môi là nét tối và rõ nhất trên miệng; mép ngoài của môi thì mềm, không đóng viền cứng. Môi trên thường tối hơn một chút vì xoay khỏi nguồn sáng chính.</p>
<h3>Tai — hình dạng như một chữ cái</h3>
<p>Ở góc nhìn chính diện, tai nằm khoảng giữa <strong>đường chân mày và đường chân mũi</strong> (xem bài 1.2/1.3), ngả về sau theo góc gần bằng góc hàm. Hình dạng ngoài của tai giống một chữ cái có phần lõm bên trong (loa tai); dựng hình lớn tổng thể trước, rồi mới đến các nếp sụn bên trong sau cùng.</p>
<table>
<tr><th>Ngũ quan</th><th>Khối cơ bản</th><th>Lỗi sinh viên hay mắc</th></tr>
<tr><td>Mắt</td><td>Quả cầu trong hốc, mí có bề dày</td><td>Vẽ hai đường viền "hạt hạnh nhân" phẳng, không có bề dày mí hay bóng trên nhãn cầu</td></tr>
<tr><td>Mũi</td><td>Khối nêm/hộp với 4 mặt</td><td>Đóng viền đậm hai lỗ mũi thay vì đánh bóng các mặt</td></tr>
<tr><td>Miệng</td><td>Bao quanh khối trụ (răng/hàm)</td><td>Vẽ môi thành một mảng ngang phẳng, không cong vào mặt</td></tr>
<tr><td>Tai</td><td>Hình chữ cái dẹt có phần lõm trong</td><td>Vẽ quá nhỏ, quá cao, hoặc vẽ qua loa ở phút cuối</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Lỗi hay mắc</span> Vẽ ngũ quan như <strong>ký hiệu-nét</strong> học thuộc lòng ("con mắt là hai nét cong và một chấm") thay vì như khối dưới ánh sáng. Thêm bao nhiêu chi tiết cũng không sửa được một ngũ quan chưa từng được dựng thành khối 3D ngay từ đầu — khối hoá trước, đánh bóng các mặt, RỒI mới thêm vài nhấn sắc (lông mi, viền lỗ mũi) cuối cùng và thật nhẹ.</div>
<h3>Thảo luận — trích bảng Câu hỏi kiến tạo của FLM</h3>
<div class="callout"><span class="badge">Buổi 8 · QN1</span> Bạn quyết định cách tốt nhất để vẽ ngũ quan chân dung như thế nào?</div>
<h3>Bài tập</h3>
<p>Chọn MỘT con mắt từ tượng thạch cao của bạn (hoặc ảnh mẫu rõ nét). Vẽ nó ba lần: (1) như ký hiệu phẳng theo trí nhớ, (2) dựng khối cầu-trong-hốc có bề dày mí, (3) đánh bóng hoàn chỉnh. So sánh — hình nào thực sự trông như thuộc về một cái đầu tròn?</p>`,
  ]]);

const l15 = doc('drp101-5-1-plaster-cast-blockin', '1.5 — From block-in to volume to texture: the 6-session process|||1.5 — Từ dựng hình đến lên khối đến tả chất: quy trình 6 buổi',
  'Quy trình vẽ một bài tượng: bao khối → trục/mốc → đo tỉ lệ (sight-size) → mảng lớn → lên khối bằng sắc độ → tả chất, ứng với 6 buổi đầu của Unit 1 (CLO7, CLO8). Câu hỏi thảo luận buổi 11, 12.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.5 · CLO7, CLO8</span>
<h2>From block-in to volume to texture: the 6-session process</h2>
<p class="lead">After this lesson you can describe, step by step, what a full plaster-cast drawing looks like across roughly six sessions — from the first faint line to a finished, shaded drawing. This covers CLO7 (build up basic/horizontal lines) and CLO8 (determine facial proportions: eye line, lip line, mouth bottom…).</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 2-10 ("Practice", CLO7/CLO8) và buổi 11-12 ("Evaluation and grading")</p>
<h3>Why a white cast rewards a process</h3>
<p>Because a plaster cast has no colour and never moves (see 1.1), it is the ideal subject to practice a repeatable <strong>process</strong> on — the same six-step sequence works whether the cast is male, female, or anything else you draw for the rest of this course.</p>
<div class="diagram"><pre>Block-in -> volume -> texture, step by step:
 1. Envelope    -- the big overall silhouette, as straight lines only
 2. Axis/marks  -- vertical + brow line (1.3), then landmarks: top of
                   head, brow, nose base, chin
 3. Sight-size  -- measure proportions against the rules in 1.2
 4. Big planes  -- break the round mass into flat facets, still no shading
 5. Volume      -- NOW start value: highlight, halftone, core shadow,
                   reflected light, cast shadow (five light zones)
 6. Texture     -- last: the matte, slightly grainy surface of plaster,
                   with only a FEW sharp accents (nostril, eye corners)
Work big to small. Do not finish rendering one eye while the skull
proportions are still wrong.</pre></div>
<h3>Measuring: the pencil (sight-size) method</h3>
<p>Hold your pencil at arm's length, lock your elbow, and use the tip-to-thumb length as a <strong>unit</strong> — often the length of the head or the nose. Ask: how many units wide is the cast's base? Where does the chin fall relative to the ear? This is the practical version of the ratio rules in Lesson 1.2 — it turns "the eyes sit at the half-way line" into an actual measurement you can check on the model.</p>
<h3>Where each session goes</h3>
<table>
<tr><th>Roughly</th><th>Process step</th></tr>
<tr><td>Session 1</td><td>Envelope, axis lines, first landmarks (see 1.1-1.3)</td></tr>
<tr><td>Sessions 2-5</td><td>Sight-size measuring, refining proportion, breaking into big planes</td></tr>
<tr><td>Sessions 6-9</td><td>Volume — building the five light zones with value</td></tr>
<tr><td>Session 10</td><td>Texture and final accents</td></tr>
<tr><td>Sessions 11-12</td><td>"Evaluation and grading" (FLM, verbatim) — the finished drawing is scored</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Common mistake</span> Starting to shade (step 5) before the block-in (steps 1-4) is actually correct. A beautifully rendered drawing built on a wrong proportion is still a wrong drawing — rendering does not fix a bad block-in, it only makes the error harder to see and later, harder to fix.</div>
<h3>Discussion — from the FLM Constructive Questions table</h3>
<div class="callout"><span class="badge">Buổi 11 · QN1</span> Should you draw what you see, or how you see it?</div>
<div class="callout"><span class="badge">Buổi 12 · QN1</span> Should you experiment with different drawing tools when drawing portraits?</div>
<h3>Exercise</h3>
<p>Take one of your in-progress cast drawings. Identify, honestly, which of the six steps above it is currently at. If you have already started shading but the proportions (1.2) have not been checked with sight-size measuring, stop and measure BEFORE adding another stroke of value.</p>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.5 · CLO7, CLO8</span>
<h2>Từ dựng hình đến lên khối đến tả chất: quy trình 6 buổi</h2>
<p class="lead">Học xong bài này bạn mô tả được từng bước một bài vẽ tượng thạch cao hoàn chỉnh diễn ra trong khoảng sáu buổi — từ nét phác đầu tiên tới bài hoàn thiện có đánh bóng. Bài này phủ CLO7 (dựng đường cơ bản/ngang của mặt) và CLO8 (xác định tỉ lệ mặt: đường mắt, đường môi, đáy miệng…).</p>
<p class="nhan">Nguồn: FLM · Syllabus 13344 · buổi 2-10 ("Practice", CLO7/CLO8) và buổi 11-12 ("Evaluation and grading")</p>
<h3>Vì sao tượng trắng hợp để luyện quy trình</h3>
<p>Vì tượng thạch cao không màu và không bao giờ động (xem bài 1.1), nó là mẫu lý tưởng để luyện một <strong>quy trình</strong> lặp lại được — cùng sáu bước sau đây áp dụng dù tượng là nam, nữ, hay bất kỳ thứ gì bạn vẽ về sau trong môn này.</p>
<div class="diagram"><pre>Dung hinh -> len khoi -> ta chat, tung buoc:
 1. Bao khoi   -- hinh bong tong the lon, chi bang net thang
 2. Truc/moc   -- truc doc + duong chan may (bai 1.3), roi cac moc:
                  dinh dau, chan may, chan mui, cam
 3. Sight-size -- do ti le theo cac quy tac o bai 1.2
 4. Mang lon   -- chia khoi tron thanh cac mat phang, chua danh bong
 5. Len khoi   -- GIO moi bat dau sac do: sang nhat, chuyen tiep, bong
                  khoi, phan quang, bong do (nam vung anh sang)
 6. Ta chat    -- cuoi cung: be mat mo, hoi nham cua thach cao, chi
                  vai nhan sac (khoe mui, khoe mat)
Lam tu lon toi nho. Dung ve xong mot con mat trong khi ti le ho so
van con sai.</pre></div>
<h3>Đo tỉ lệ: phương pháp bút chì (sight-size)</h3>
<p>Giơ bút chì thẳng tay, khoá khuỷu, lấy đoạn từ đầu bút đến ngón cái làm <strong>đơn vị</strong> — thường là chiều dài đầu hoặc mũi. Hỏi: đáy tượng rộng bằng mấy đơn vị? Cằm rơi vào đâu so với tai? Đây là phiên bản thực hành của các quy tắc tỉ lệ ở bài 1.2 — nó biến "mắt nằm ở đường giữa" thành một phép đo thật bạn kiểm được ngay trên mẫu.</p>
<h3>Buổi nào tương ứng bước nào</h3>
<table>
<tr><th>Khoảng</th><th>Bước quy trình</th></tr>
<tr><td>Buổi 1</td><td>Bao khối, đường trục, mốc đầu tiên (xem bài 1.1-1.3)</td></tr>
<tr><td>Buổi 2-5</td><td>Đo sight-size, tinh chỉnh tỉ lệ, chia thành mảng lớn</td></tr>
<tr><td>Buổi 6-9</td><td>Lên khối — dựng năm vùng ánh sáng bằng sắc độ</td></tr>
<tr><td>Buổi 10</td><td>Tả chất và nhấn cuối</td></tr>
<tr><td>Buổi 11-12</td><td>"Evaluation and grading" (FLM, nguyên văn) — chấm bài hoàn thiện</td></tr>
</table>
<div class="callout"><span class="badge">⚠️ Lỗi hay mắc</span> Bắt đầu đánh bóng (bước 5) trước khi chắc chắn bước dựng hình (bước 1-4) đã đúng. Một bài đánh bóng đẹp dựng trên tỉ lệ sai vẫn là một bài sai — đánh bóng không sửa được block-in tồi, nó chỉ làm lỗi khó thấy hơn và sau này khó sửa hơn.</div>
<h3>Thảo luận — trích bảng Câu hỏi kiến tạo của FLM</h3>
<div class="callout"><span class="badge">Buổi 11 · QN1</span> Nên vẽ CÁI bạn thấy, hay vẽ CÁCH bạn thấy nó?</div>
<div class="callout"><span class="badge">Buổi 12 · QN1</span> Có nên thử nghiệm nhiều loại dụng cụ vẽ khác nhau khi vẽ chân dung không?</div>
<h3>Bài tập</h3>
<p>Lấy một bài vẽ tượng đang dở của bạn. Tự đánh giá thật lòng nó đang ở bước nào trong sáu bước trên. Nếu bạn đã bắt đầu đánh bóng nhưng tỉ lệ (bài 1.2) chưa được kiểm bằng sight-size, hãy dừng lại và đo TRƯỚC KHI thêm bất kỳ nét sắc độ nào nữa.</p>`,
  ]]);

// ── 1.6-1.9 — Kỹ năng nền tảng bổ sung (giữ lại 4 slug đã có trên production
// từ bản trước, xem bảng ánh xạ ở đầu file). Không map trực tiếp một CLO/buổi
// cụ thể — hỗ trợ chung cho CLO7/CLO8 (dựng hình, lên khối) xuyên suốt môn. ──
const l16 = doc('drp101-1-1-tools-grip-strokes', '1.6 — Tools, posture, grip & basic strokes|||1.6 — Dụng cụ, tư thế, cầm bút & nét cơ bản',
  'Bút chì và độ cứng/mềm (thang H-B), giấy, tẩy; tư thế ngồi và khoảng cách; hai cách cầm bút (viết vs overhand); luyện nét thẳng, nét cong, tô đều. Kỹ năng nền tảng bổ sung, hỗ trợ CLO7/CLO8 xuyên suốt môn.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.6 · Foundational skill</span>
<h2>Tools, posture, grip &amp; basic strokes</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> This is a supplementary foundational-skill lesson (not a separate FLM CLO/session line item) that supports CLO7/CLO8 throughout the whole course. Many students find it useful to read BEFORE Lesson 1.1 — the "1.6" position is just its place in the lesson list, not a required order.</div>
<h3>The graphite scale</h3>
<p>Pencils are graded on an <strong>H–B scale</strong>. <strong>H</strong> = Hard (light, thin, for construction and fine detail); <strong>B</strong> = Black/soft (dark, rich, for shadows). The higher the number, the stronger the effect.</p>
<pre><code>Hard  2H --- H --- HB --- B --- 2B --- 4B --- 6B  Soft
      light, thin lines        dark, soft, smudgy
Use:  2H/H  construction &amp; light guidelines
      HB/B  general drawing, mid tones
      3B-6B dark accents, deepest shadows</code></pre>
<h3>Posture &amp; distance</h3>
<p>Sit upright, board tilted toward you, and keep the whole drawing in view — do not hunch over one corner. Draw from the <strong>shoulder and elbow</strong> for long lines, not just the fingers. Sitting back so you can see the model and the paper together is what lets you compare proportion.</p>
<h3>Two grips</h3>
<ul>
<li><strong>Writing grip</strong> — pencil held like a pen, close to the tip: control, detail, small marks.</li>
<li><strong>Overhand grip</strong> — pencil laid under the palm, held far back: loose sweeping strokes, broad shading with the side of the lead.</li>
</ul>
<h3>Practice strokes</h3>
<pre><code>Warm-up drills (fill a page of each):
 1. Straight lines  -- edge to edge, from the shoulder
 2. Ghosting        -- hover the path first, then commit
 3. Ellipses        -- confident loops, keep them even
 4. Value gradient  -- dark to light in one smooth band
 5. Even tone       -- flat grey, no visible strokes</code></pre>
<div class="callout"><span class="badge">Confidence over caution</span> A fast, committed line drawn from the shoulder beats a slow, scratchy one. Ghost the movement a few times, then draw it in one stroke.</div>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.6 · Kỹ năng nền tảng</span>
<h2>Dụng cụ, tư thế, cầm bút &amp; nét cơ bản</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> Đây là bài kỹ năng nền tảng bổ sung (không phải một dòng CLO/buổi riêng của FLM) hỗ trợ chung cho CLO7/CLO8 xuyên suốt môn. Nhiều sinh viên thấy hợp đọc bài này TRƯỚC bài 1.1 — vị trí "1.6" chỉ là chỗ đứng trong danh sách bài học, không phải trình tự bắt buộc.</div>
<h3>Thang độ chì graphite</h3>
<p>Bút chì chia theo <strong>thang H–B</strong>. <strong>H</strong> = Hard (cứng: nhạt, mảnh, để dựng hình và chi tiết tinh); <strong>B</strong> = Black/mềm (đậm, giàu sắc, để đánh bóng tối). Số càng lớn thì hiệu ứng càng mạnh.</p>
<pre><code>Cứng 2H --- H --- HB --- B --- 2B --- 4B --- 6B  Mềm
     net nhat, manh          dam, mem, de nhoe
Dung: 2H/H  dung hinh &amp; net mo
      HB/B  ve chung, trung do
      3B-6B nhan tối, bong sau nhat</code></pre>
<h3>Tư thế &amp; khoảng cách</h3>
<p>Ngồi thẳng, bảng vẽ nghiêng về phía mình, và luôn thấy toàn bộ bài — đừng cúi gằm vào một góc. Vẽ nét dài bằng <strong>vai và khuỷu tay</strong>, không chỉ bằng ngón. Ngồi lùi đủ để thấy cả mẫu lẫn giấy là điều giúp bạn so sánh tỉ lệ.</p>
<h3>Hai cách cầm bút</h3>
<ul>
<li><strong>Cầm như viết</strong> — cầm sát đầu bút như cầm bút mực: kiểm soát, chi tiết, nét nhỏ.</li>
<li><strong>Cầm ngửa (overhand)</strong> — đặt bút dưới lòng bàn tay, cầm xa đầu: nét quét thoải mái, đánh bóng rộng bằng cạnh ruột chì.</li>
</ul>
<h3>Luyện nét</h3>
<pre><code>Bai khoi dong (moi loai kin mot trang):
 1. Net thang    -- keo het canh, phat luc tu vai
 2. Ghosting     -- ru tay theo duong truoc, roi ha but
 3. Elip         -- vong tron tu tin, deu nhau
 4. Chuyen do    -- tối sang nhat trong mot dai muot
 5. To deu       -- xam phang, khong lo net</code></pre>
<div class="callout"><span class="badge">Tự tin hơn dè dặt</span> Một nét dứt khoát phát từ vai luôn đẹp hơn nét chậm run rẩy. Ru tay theo chuyển động vài lần, rồi hạ bút một nét.</div>`,
  ]]);

const l17 = doc('drp101-2-1-line-geometric-forms', '1.7 — Line & basic geometric forms|||1.7 — Đường nét & khối hình học cơ bản',
  'Nét viền (contour) vs nét dáng (gesture); bốn khối nền tảng: cầu, lập phương, trụ, nón; mọi vật thể quy về tổ hợp khối; khoảng âm (negative space). Kỹ năng nền tảng bổ sung, hỗ trợ CLO7/CLO8.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.7 · Foundational skill</span>
<h2>Line &amp; basic geometric forms</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> Supplementary foundational-skill lesson supporting CLO7/CLO8 (building basic lines, determining proportion) throughout the course.</div>
<h3>Two kinds of line</h3>
<ul>
<li><strong>Gesture line</strong> — a fast, flowing line that captures the <em>movement</em> and overall pose in seconds. Draw it first, loosely.</li>
<li><strong>Contour line</strong> — a slow, careful line that follows an actual edge of the subject. Some instructors have you draw contours <em>without looking at the paper</em> to bind eye and hand.</li>
</ul>
<h3>The four basic forms</h3>
<p>Almost anything you draw can be built from four solids. Learn to draw and shade these and you can construct any subject:</p>
<pre><code>  SPHERE     CUBE      CYLINDER    CONE
   ( )       [ ]        | |         /\\
 an apple   a box     a can/arm   a nose/hat</code></pre>
<p>A plaster bust is a sphere (cranium) plus a modified box (the face block); an arm is a cylinder; a nose sits on a wedge (see 1.4). This is <strong>constructive drawing</strong> — see the simple solid underneath the complex surface.</p>
<h3>Negative space</h3>
<p>Instead of drawing the object, sometimes draw the <strong>shape of the gap around it</strong> — the triangle of light between an arm and the torso, for example. Empty shapes have no name, so drawing them forces you to see them truthfully instead of drawing a memorized symbol.</p>
<div class="callout"><span class="badge">Construct, do not trace</span> Beginners outline the silhouette. Instead, block the solid forms first — sphere, box, cylinder — then carve detail into that structure. The drawing will feel three-dimensional, not flat.</div>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.7 · Kỹ năng nền tảng</span>
<h2>Đường nét &amp; khối hình học cơ bản</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> Bài kỹ năng nền tảng bổ sung, hỗ trợ CLO7/CLO8 (dựng đường cơ bản, xác định tỉ lệ) xuyên suốt môn.</div>
<h3>Hai loại nét</h3>
<ul>
<li><strong>Nét dáng (gesture)</strong> — nét nhanh, chảy, bắt lấy <em>chuyển động</em> và dáng tổng thể trong vài giây. Vẽ nó trước, thật lỏng tay.</li>
<li><strong>Nét viền (contour)</strong> — nét chậm, cẩn thận, bám theo một cạnh thật của mẫu. Có giảng viên cho vẽ nét viền <em>không nhìn xuống giấy</em> để buộc mắt và tay ăn khớp.</li>
</ul>
<h3>Bốn khối nền tảng</h3>
<p>Gần như mọi thứ bạn vẽ đều dựng được từ bốn khối. Vẽ và đánh bóng thành thạo bốn khối này thì dựng được mọi vật thể:</p>
<pre><code>  CAU       LAP PHUONG   TRU        NON
  ( )         [ ]        | |        /\\
 qua tao    cai hop    lon/canh tay  mui/non</code></pre>
<p>Một tượng bán thân là hình cầu (hộp sọ) cộng một khối hộp biến đổi (khối mặt); cánh tay là hình trụ; cái mũi ngồi trên một khối nêm (xem bài 1.4). Đây là <strong>vẽ dựng hình</strong> — thấy khối đơn giản nằm dưới bề mặt phức tạp.</p>
<h3>Khoảng âm (negative space)</h3>
<p>Thay vì vẽ vật thể, đôi khi hãy vẽ <strong>hình của khoảng trống quanh nó</strong> — ví dụ mảng sáng hình tam giác giữa cánh tay và thân. Các mảng trống không có tên, nên vẽ chúng buộc bạn nhìn đúng thật thay vì vẽ theo ký hiệu học thuộc.</p>
<div class="callout"><span class="badge">Dựng khối, đừng đồ nét</span> Người mới hay đồ theo bóng ngoài (silhouette). Thay vào đó hãy khối hoá trước — cầu, hộp, trụ — rồi khắc chi tiết vào cấu trúc đó. Bài vẽ sẽ có chiều sâu ba chiều, không bị dẹt.</div>`,
  ]]);

const l18 = doc('drp101-4-1-perspective-construction', '1.8 — Perspective & constructing forms|||1.8 — Phối cảnh & dựng hình khối',
  'Đường chân trời (horizon) và điểm tụ (vanishing point); phối cảnh 1, 2, 3 điểm tụ; foreshortening (rút gọn theo chiều sâu); dựng khối trong không gian. Kỹ năng nền tảng bổ sung, hỗ trợ CLO7/CLO8.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.8 · Foundational skill</span>
<h2>Perspective &amp; constructing forms</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> Supplementary foundational-skill lesson supporting CLO7 (building the head's construction lines correctly in space) throughout the course.</div>
<h3>Why perspective matters</h3>
<p>Perspective is the system that makes a flat page read as deep space. Two ideas do most of the work: the <strong>horizon line</strong> (your eye level) and <strong>vanishing points</strong> (where parallel edges appear to meet).</p>
<pre><code>1-point:  edges recede to ONE point on the horizon
          (looking straight down a corridor)
2-point:  a box seen at an angle -&gt; TWO vanishing points
3-point:  add a point above/below for tall or worm/bird views</code></pre>
<h3>Horizon = eye level</h3>
<p>The horizon line is always at your eye level. Objects <em>above</em> it you see from below; objects <em>below</em> it you see from above. Move your viewpoint and every vanishing relationship changes — which is why you fix your position before drawing a cast.</p>
<h3>Foreshortening</h3>
<p><strong>Foreshortening</strong> is perspective applied to a single form pointing toward you: a cylinder aimed at the viewer looks short and its far end reads as an ellipse, not a circle. Trust the shortened shape you actually see over the length you know is there.</p>
<h3>Construct in space</h3>
<p>Build the basic solids <em>on</em> the perspective grid: a cube in two-point perspective, a cylinder as two ellipses joined by verticals. Getting the box right first means the cast that sits inside it will also sit correctly in space.</p>
<div class="callout"><span class="badge">Ellipses, not circles</span> A circle seen at any angle other than face-on is an ellipse. The rounder the ellipse, the more you are looking down onto the surface; a thin ellipse means you are near its edge.</div>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.8 · Kỹ năng nền tảng</span>
<h2>Phối cảnh &amp; dựng hình khối</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> Bài kỹ năng nền tảng bổ sung, hỗ trợ CLO7 (dựng đúng đường trục của đầu trong không gian) xuyên suốt môn.</div>
<h3>Vì sao cần phối cảnh</h3>
<p>Phối cảnh là hệ thống khiến trang giấy phẳng đọc thành không gian sâu. Hai ý làm phần lớn công việc: <strong>đường chân trời</strong> (tầm mắt của bạn) và <strong>điểm tụ</strong> (nơi các cạnh song song có vẻ gặp nhau).</p>
<pre><code>1 diem tu: cac canh lui ve MOT diem tren chan troi
           (nhin thang doc hanh lang)
2 diem tu: cai hop nhin cheo -&gt; HAI diem tu
3 diem tu: them 1 diem tren/duoi cho vat cao hoac goc nhin tu duoi/tren</code></pre>
<h3>Chân trời = tầm mắt</h3>
<p>Đường chân trời luôn nằm ở tầm mắt bạn. Vật <em>trên</em> chân trời thì bạn nhìn từ dưới lên; vật <em>dưới</em> chân trời thì nhìn từ trên xuống. Đổi chỗ ngồi là mọi quan hệ điểm tụ đổi theo — vì thế phải cố định vị trí trước khi vẽ tượng.</p>
<h3>Rút gọn theo chiều sâu (foreshortening)</h3>
<p><strong>Foreshortening</strong> là phối cảnh áp lên một khối đơn chĩa về phía bạn: một hình trụ hướng vào người xem trông ngắn lại và đầu xa hiện thành hình elip chứ không phải hình tròn. Hãy tin cái hình bị rút ngắn bạn thật sự thấy hơn là chiều dài bạn biết là có.</p>
<h3>Dựng khối trong không gian</h3>
<p>Dựng các khối cơ bản <em>trên</em> lưới phối cảnh: một khối lập phương trong phối cảnh hai điểm tụ, một hình trụ là hai elip nối bằng đường thẳng đứng. Dựng đúng cái hộp trước nghĩa là tượng nằm trong hộp đó cũng sẽ đặt đúng trong không gian.</p>
<div class="callout"><span class="badge">Elip, không phải tròn</span> Một hình tròn nhìn ở góc bất kỳ khác chính diện đều là elip. Elip càng tròn nghĩa bạn càng nhìn từ trên xuống mặt phẳng đó; elip càng dẹt nghĩa bạn đang ở gần cạnh của nó.</div>`,
  ]]);

const l19 = doc('drp101-3-1-light-shadow-value', '1.9 — Light, shadow & value|||1.9 — Ánh sáng, bóng đổ & sắc độ',
  'Sắc độ (value) là độ sáng-tối; thang sắc độ; năm vùng của khối được chiếu sáng: sáng nhất, chuyển tiếp, bóng khối, phản quang, bóng đổ; ranh giới sáng-tối (terminator). Kỹ năng nền tảng bổ sung, nuôi bước "lên khối" ở bài 1.5.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.9 · Foundational skill</span>
<h2>Light, shadow &amp; value</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> Supplementary foundational-skill lesson — this is the theory behind step 5 ("volume") in the 6-step process of Lesson 1.5.</div>
<h3>Value is everything</h3>
<p><strong>Value</strong> is how light or dark a tone is, independent of colour. In graphite, value <em>is</em> the whole language — it is what makes a flat circle read as a round sphere. Train it with a <strong>value scale</strong>: a strip from white to black in even steps.</p>
<pre><code>Value scale (9 steps):
[  0 ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ]
white  light      mid grey       dark   black
Squint at your subject to collapse detail into these bands.</code></pre>
<h3>The five zones on a lit sphere</h3>
<p>Light one simple form and you always see the same anatomy of light:</p>
<ol>
<li><strong>Highlight</strong> — the brightest spot, where light hits most directly.</li>
<li><strong>Halftone</strong> — the mid values turning away from the light.</li>
<li><strong>Core shadow (terminator)</strong> — the darkest band, the edge where light stops.</li>
<li><strong>Reflected light</strong> — a faint glow inside the shadow, bounced from the surroundings. Keep it darker than any halftone.</li>
<li><strong>Cast shadow</strong> — the shadow the object throws onto the surface; darkest and crispest right at its base.</li>
</ol>
<h3>The golden rule of reflected light</h3>
<p>Beginners make reflected light too bright and the form goes flat. <strong>Everything in shadow stays in shadow</strong> — reflected light is a lighter shadow, never as light as the lit side.</p>
<div class="callout"><span class="badge">Squint</span> Narrowing your eyes drops out detail and colour and shows you the big value shapes. If two areas look the same value when squinting, draw them the same value.</div>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.9 · Kỹ năng nền tảng</span>
<h2>Ánh sáng, bóng đổ &amp; sắc độ</h2>
<div class="note-ct"><strong>Ghi chú của web:</strong> Bài kỹ năng nền tảng bổ sung — đây là lý thuyết đứng sau bước 5 ("lên khối") trong quy trình 6 bước ở bài 1.5.</div>
<h3>Sắc độ là tất cả</h3>
<p><strong>Sắc độ (value)</strong> là độ sáng hay tối của một tông, không phụ thuộc màu. Với chì, sắc độ <em>chính là</em> cả ngôn ngữ — nó biến một vòng tròn dẹt thành khối cầu tròn. Luyện bằng <strong>thang sắc độ</strong>: một dải từ trắng đến đen theo các bước đều.</p>
<pre><code>Thang sac do (9 buoc):
[  0 ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ]
trang  nhat      xam giua       tối   den
Nheo mat vao mau de gom chi tiet ve cac dai nay.</code></pre>
<h3>Năm vùng trên khối cầu được chiếu sáng</h3>
<p>Chiếu sáng một khối đơn giản, bạn luôn thấy cùng một cấu trúc ánh sáng:</p>
<ol>
<li><strong>Sáng nhất (highlight)</strong> — điểm sáng nhất, nơi ánh sáng đập trực diện.</li>
<li><strong>Chuyển tiếp (halftone)</strong> — vùng trung độ đang xoay khỏi ánh sáng.</li>
<li><strong>Bóng khối (ranh giới, terminator)</strong> — dải tối nhất, nơi ánh sáng dừng lại.</li>
<li><strong>Phản quang</strong> — chút sáng mờ trong vùng tối, dội lại từ xung quanh. Phải giữ tối hơn mọi vùng chuyển tiếp.</li>
<li><strong>Bóng đổ</strong> — bóng vật hắt lên mặt nền; tối nhất và sắc nhất ngay chân vật.</li>
</ol>
<h3>Quy tắc vàng của phản quang</h3>
<p>Người mới hay để phản quang quá sáng khiến khối bị bẹt. <strong>Cái gì trong tối thì vẫn thuộc vùng tối</strong> — phản quang chỉ là bóng nhạt hơn, không bao giờ sáng bằng mặt được chiếu.</p>
<div class="callout"><span class="badge">Nheo mắt</span> Nheo mắt làm rụng chi tiết và màu, để lộ các mảng sắc độ lớn. Nếu hai vùng nhìn cùng sắc độ khi nheo mắt thì vẽ chúng cùng một sắc độ.</div>`,
  ]]);

const c1quiz = quiz('drp101-quiz-1', 'Quiz — Chapter 1 (Unit 1, sessions 1-12)|||Quiz — Chương 1 (Unit 1, buổi 1-12)', [
  { id: 'q1', question: 'Vì sao Unit 1-3 của môn này dùng TƯỢNG THẠCH CAO trước khi vẽ người mẫu thật ở Unit 4-5?', options: ['Vì tượng rẻ hơn', 'Vì tượng không màu và đứng im, giúp tập trung vào khối & ánh sáng trước', 'Vì tượng dễ mua', 'Vì trường không có người mẫu'], correctIndex: 1, explanation: 'Tượng thạch cao loại bỏ màu sắc và chuyển động — hai biến số gây nhiễu — để người học tập trung vào khối và ánh sáng trước (bài 1.1).' },
  { id: 'q2', question: 'Theo tỉ lệ khuôn mặt chuẩn (Loomis), đường mắt nằm ở đâu trên toàn bộ đầu?', options: ['Ở 1/3 từ trên xuống', 'Ở đúng đường giữa (1/2) của đầu', 'Sát chân tóc', 'Ngay trên cằm'], correctIndex: 1, explanation: 'Lỗi #1 của người mới là đặt mắt ở 1/3 thay vì đúng đường giữa của đầu (đỉnh đầu tới cằm) — bài 1.2.' },
  { id: 'q3', question: 'Vì sao tỉ lệ mặt được đo bằng PHÂN SỐ của chiều cao đầu, không phải bằng cm?', options: ['Vì cm khó đo', 'Vì tỉ lệ co giãn theo kích thước bài vẽ, còn cm chỉ đúng với một kích thước cụ thể', 'Vì cm không chính xác', 'Không có lý do, chỉ là quy ước'], correctIndex: 1, explanation: 'Một quy tắc theo tỉ lệ ("mắt ở giữa đầu") đúng dù đầu vẽ to hay nhỏ; một con số cm cụ thể chỉ đúng với đúng một kích thước — bài 1.2.' },
  { id: 'q4', question: 'Trong quy trình dựng hình, việc đặt các đường trục ngang/dọc (bài 1.3) nên làm khi nào?', options: ['Sau khi đã vẽ xong ngũ quan', 'Trước khi vẽ bất kỳ ngũ quan nào', 'Không cần thiết', 'Chỉ khi đầu nhìn chính diện'], correctIndex: 1, explanation: 'Đường trục ngang/dọc là bộ khung để đặt ngũ quan vào đúng chỗ; vẽ ngũ quan trước thì không còn gì để đối chiếu — bài 1.3.' },
  { id: 'q5', question: 'Nên hình dung cái mũi như khối gì để vẽ đúng (bài 1.4)?', options: ['Một hình tròn phẳng', 'Một khối nêm/hộp với các mặt trên-bên-dưới', 'Hai đường cong', 'Một tam giác đặc'], correctIndex: 1, explanation: 'Mũi là khối nêm/hộp gồm mặt trên (sống mũi), hai mặt bên và mặt dưới; phần lớn vẽ bằng sắc độ trên các mặt, rất ít viền — bài 1.4.' },
  { id: 'q6', question: 'Theo quy trình 6 buổi (bài 1.5), nên bắt đầu đánh bóng (lên khối) khi nào?', options: ['Ngay từ nét đầu tiên', 'Sau khi bao khối, dựng trục/mốc và đo tỉ lệ (sight-size) xong', 'Song song với vẽ contour', 'Không bao giờ cần đánh bóng'], correctIndex: 1, explanation: 'Thứ tự đúng: bao khối → trục/mốc → sight-size → mảng lớn → RỒI mới lên khối bằng sắc độ; đánh bóng sớm không sửa được tỉ lệ sai — bài 1.5.' },
  { id: 'q7', question: 'Buổi 11-12 của Unit 1, theo bảng kế hoạch FLM, có nội dung gì?', options: ['Practice như các buổi khác', 'Evaluation and grading (chấm & đánh giá)', 'Thi cuối kỳ', 'Nghỉ học'], correctIndex: 1, explanation: 'Buổi 11 và 12 của Unit 1 đều ghi "Evaluation and grading" trong bảng gốc FLM (mục 0.5) — đây là hai buổi chấm bài vẽ đầu tiên.' },
  { id: 'q8', question: 'Theo syllabus gốc FLM, CLO3 và CLO4 xuất hiện ở những buổi nào trong bảng kế hoạch 60 buổi?', options: ['Xuyên suốt cả 60 buổi', 'Chỉ DUY NHẤT ở buổi 1', 'Chỉ ở Unit cuối', 'Không buổi nào'], correctIndex: 1, explanation: 'Đây là một bất thường đã nêu ở mục 0.3: CLO3 và CLO4 chỉ được gắn ở buổi 1 trong toàn bộ bảng 60 buổi, dù nội dung liên quan xuyên suốt môn.' },
]);

// ─────────────────────────────────────────────────────────────────────────
// CHƯƠNG 2 → 6 — CHỈ KHUNG (đúng tên bài + 3-6 dòng mốc: buổi/CLO/practice/
// trọng số/làm gì/nộp gì). Bài giảng chi tiết bổ sung sau. Dựng bằng hàm
// `khung()` — nối chuỗi thường, KHÔNG template lồng bên trong. Tên bài do
// web tự đặt theo giai đoạn thực tế (dựng hình/lên khối/tả chất/chấm bài) vì
// bảng gốc FLM chỉ ghi "Practice" / "Evaluation and grading" cho các buổi
// này — nêu rõ trong mỗi bài đây là cách chia của web, không phải chữ FLM.
// ─────────────────────────────────────────────────────────────────────────
const escAmp = (s) => s.replace(/&/g, '&amp;');
const khung = (slug, titleEn, titleVi, desc, chuong, baiSo, buoi, clo, practice, trongSo, lamGiEn, lamGiVi, nopGiEn, nopGiVi) => {
  const enHtml =
    '<span class="eyebrow">DRP101 · Chapter ' + chuong + ' · Lesson ' + baiSo + ' · Session ' + buoi + ' · ' + clo + ' · Framework</span>' +
    '<h2>' + escAmp(titleEn) + '</h2>' +
    '<div class="note-ct"><strong>Web\'s own division:</strong> the raw FLM plan (0.5) only says "Practice" / "Evaluation and grading" for these sessions — the stage title above ("' + escAmp(titleEn) + '") is how THIS SITE groups them, not FLM\'s own wording.</div>' +
    '<ul>' +
    '<li><strong>Session(s):</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>Counts toward:</strong> ' + practice + ' (' + trongSo + ' of the total grade, see 0.2).</li>' +
    '<li><strong>What to do:</strong> ' + lamGiEn + '</li>' +
    '<li><strong>What to submit:</strong> ' + nopGiEn + '</li>' +
    '<li><strong>Note:</strong> Framework only — full step-by-step lesson content is added later.</li>' +
    '</ul>' +
    '<p><em>Source: FLM &middot; Syllabus 13344 &middot; QD 932/QD-DHFPT dated 08/22/2025.</em></p>';
  const viHtml =
    '<span class="eyebrow">DRP101 · Chương ' + chuong + ' · Bài ' + baiSo + ' · Buổi ' + buoi + ' · ' + clo + ' · Khung</span>' +
    '<h2>' + escAmp(titleVi) + '</h2>' +
    '<div class="note-ct"><strong>Cách chia của web:</strong> bảng gốc FLM (0.5) chỉ ghi "Practice" / "Evaluation and grading" cho các buổi này — tên giai đoạn ở trên ("' + escAmp(titleVi) + '") là cách TRANG WEB NÀY nhóm lại, không phải chữ của FLM.</div>' +
    '<ul>' +
    '<li><strong>Buổi:</strong> ' + buoi + '.</li>' +
    '<li><strong>CLO:</strong> ' + clo + '.</li>' +
    '<li><strong>Tính vào:</strong> ' + practice + ' (' + trongSo + ' tổng điểm, xem 0.2).</li>' +
    '<li><strong>Làm gì:</strong> ' + lamGiVi + '</li>' +
    '<li><strong>Nộp gì:</strong> ' + nopGiVi + '</li>' +
    '<li><strong>Ghi chú:</strong> Khung — bài giảng đầy đủ từng bước sẽ bổ sung sau.</li>' +
    '</ul>' +
    '<p><em>Nguồn: FLM &middot; Syllabus 13344 &middot; QĐ 932/QĐ-ĐHFPT ngày 22/08/2025.</em></p>';
  return doc(slug, titleEn + '|||' + titleVi, desc, [[enHtml, viHtml]]);
};

// ── Chương 2 — Unit 2: Đầu tượng thạch cao nam 2 (buổi 13-24), practice 2, 15% ──
const k21 = khung('drp101-2-1-block-in-len-khoi-nam-2', 'Block-in & volume — plaster male head, round 2', 'Dựng hình & lên khối — đầu tượng nam, lượt 2',
  'Buổi 13-23, CLO7/CLO8, practice 2 (15%). Khung.', 2, '2.1', '13-23', 'CLO7, CLO8', 'practice 2', '15%',
  'Repeat the full 6-step process from Lesson 1.5 (block-in, sight-size, big planes, volume, texture) on a SECOND plaster male head — the goal is speed and consistency, not learning the process again from scratch.',
  'Lặp lại đủ quy trình 6 bước ở bài 1.5 (dựng hình, sight-size, mảng lớn, lên khối, tả chất) trên đầu tượng nam THỨ HAI — mục tiêu là làm nhanh hơn và đều tay hơn, không phải học lại quy trình từ đầu.',
  'A complete plaster-cast drawing (male head #2), same process as Unit 1.',
  'Một bài vẽ tượng thạch cao hoàn chỉnh (đầu tượng nam #2), theo đúng quy trình như Unit 1.');

const k22 = khung('drp101-2-2-cham-bai-nam-2', 'Evaluation and grading', 'Chấm bài — Evaluation and grading',
  'Buổi 24, CLO7/CLO8, practice 2 (15%). Khung.', 2, '2.2', '24', 'CLO7, CLO8', 'practice 2', '15%',
  'FLM (verbatim): "Evaluation and grading". The lecturer and students assess the finished drawing together; the lecturer gives the final score for practice 2.',
  'FLM (nguyên văn): "Evaluation and grading" (Chấm &amp; đánh giá). Giảng viên và sinh viên cùng đánh giá bài vẽ hoàn thiện; giảng viên cho điểm cuối cho practice 2.',
  'The finished drawing from k2.1, ready for in-class grading.',
  'Bài vẽ hoàn thiện từ bài 2.1, sẵn sàng để chấm tại lớp.');

// ── Chương 3 — Unit 3: Đầu tượng thạch cao nữ (buổi 25-36), practice 3, 15% ──
const k31 = khung('drp101-3-1-vao-bai-dau-tuong-nu', 'Starting the female head — male vs female differences', 'Vào bài: đầu tượng NỮ — khác biệt nam/nữ',
  'Buổi 25-26, CLO5. Khung.', 3, '3.1', '25-26', 'CLO5', 'practice 3', '15%',
  'CLO5 (verbatim): distinguish the differences between male and female faces, and analyze the unique characteristics of THIS model (the female plaster head). ⚠️ CLO5 is tagged only at these two opening sessions — see the CLO anomaly noted in 0.3.',
  'CLO5 (nguyên văn): phân biệt khác nhau giữa mặt nam và mặt nữ, và phân tích đặc điểm riêng của mẫu (đầu tượng nữ) NÀY. ⚠️ CLO5 chỉ được gắn ở đúng hai buổi mở đầu này — xem bất thường CLO đã nêu ở mục 0.3.',
  'Notes/sketches comparing the male head just finished (Unit 1-2) with the new female head.',
  'Ghi chú/phác thảo so sánh đầu tượng nam vừa vẽ xong (Unit 1-2) với đầu tượng nữ mới.');

const k32 = khung('drp101-3-2-dung-hinh-len-khoi-nu', 'Block-in & volume — female head', 'Dựng hình & lên khối — đầu tượng nữ',
  'Buổi 27-34, CLO7/CLO8, practice 3 (15%). Khung.', 3, '3.2', '27-34', 'CLO7, CLO8', 'practice 3', '15%',
  'Same 6-step process as Lesson 1.5, applied to the female plaster head. FLM reverts the CLO tag to the generic CLO7/CLO8 for this stretch of sessions (see 0.3) even though the subject is still specifically female.',
  'Cùng quy trình 6 bước ở bài 1.5, áp dụng cho đầu tượng nữ. FLM quay lại gắn CLO7/CLO8 chung chung cho đoạn buổi này (xem 0.3) dù đối tượng vẽ vẫn là đầu tượng nữ cụ thể.',
  'A complete plaster-cast drawing of the female head, in progress through the block-in and volume stages.',
  'Một bài vẽ tượng thạch cao nữ hoàn chỉnh, đang ở giai đoạn dựng hình và lên khối.');

const k33 = khung('drp101-3-3-cham-bai-nu', 'Evaluation and grading', 'Chấm bài — Evaluation and grading',
  'Buổi 35-36, CLO7/CLO8, practice 3 (15%). Khung.', 3, '3.3', '35-36', 'CLO7, CLO8', 'practice 3', '15%',
  'FLM (verbatim): "Evaluation and grading", across TWO sessions this time (unlike Unit 2\'s single grading session — see the uneven evaluation-session count noted in 0.2).',
  'FLM (nguyên văn): "Evaluation and grading", lần này trải trên HAI buổi (khác với Unit 2 chỉ có một buổi chấm — xem số buổi chấm không đều đã nêu ở 0.2).',
  'The finished female plaster-cast drawing, ready for in-class grading.',
  'Bài vẽ đầu tượng nữ hoàn thiện, sẵn sàng để chấm tại lớp.');

// ── Chương 4 — Unit 4: Chân dung người mẫu thật nam (buổi 37-48), practice 4, 15% ──
const k41 = khung('drp101-4-1-vao-bai-nguoi-that-nam', 'First live-model session — comparing cast vs live', 'Vào bài: người mẫu thật NAM — so với tượng thạch cao',
  'Buổi 37-38, CLO6. Khung.', 4, '4.1', '37-38', 'CLO6', 'practice 4 (⚠️ CLO gõ "LO6-LO10", xem 0.2)', '15%',
  'CLO6 (verbatim, officially tagged HERE per FLM\'s own table): compare the differences between the plaster cast head and a portrait from a live model. This is the FIRST time in the course you draw a real, moving, coloured subject instead of white plaster — see 1.1 for the theory introduced early.',
  'CLO6 (nguyên văn, chính thức gắn Ở ĐÂY theo bảng của FLM): so sánh khác nhau giữa đầu tượng thạch cao và chân dung từ người mẫu thật. Đây là lần ĐẦU TIÊN trong môn bạn vẽ một đối tượng thật, có chuyển động, có màu, thay vì thạch cao trắng — xem lại lý thuyết đã giới thiệu sớm ở bài 1.1.',
  'A short written/sketched comparison: what changed when the subject became a live person (colour, pose stability, proportion).',
  'Một bản so sánh ngắn (viết/phác thảo): điều gì thay đổi khi đối tượng vẽ là người thật (màu sắc, độ ổn định dáng, tỉ lệ).');

const k42 = khung('drp101-4-2-dung-hinh-len-khoi-ta-chat-nam', 'Block-in, volume & texture — live male model', 'Dựng hình, lên khối & tả chất — người mẫu thật nam',
  'Buổi 39-47, CLO7/CLO8/CLO9/CLO10, practice 4 (⚠️ CLO gõ "LO6-LO10"). Khung.', 4, '4.2', '39-47', 'CLO7, CLO8, CLO9, CLO10', 'practice 4 (⚠️ CLO gõ "LO6-LO10", xem 0.2)', '15%',
  'Same block-in/volume process as Lesson 1.5, now applied to a live model — plus CLO9 (render the unique properties of hair, skin, clothes) and CLO10 (know how to emphasise/reinforce outlines), which only start appearing in the FLM plan from Unit 4 onward.',
  'Cùng quy trình dựng hình/lên khối ở bài 1.5, áp dụng cho người mẫu thật — cộng thêm CLO9 (thể hiện tính chất riêng của tóc, da, quần áo) và CLO10 (biết cách nhấn/tăng cường nét viền), hai CLO này chỉ bắt đầu xuất hiện trong bảng FLM từ Unit 4 trở đi.',
  'A complete portrait drawing of the live male model, in progress through block-in, volume and texture.',
  'Một bài chân dung người mẫu thật nam hoàn chỉnh, đang ở giai đoạn dựng hình, lên khối và tả chất.');

const k43 = khung('drp101-4-3-cham-bai-nguoi-that-nam', 'Evaluation and grading', 'Chấm bài — Evaluation and grading',
  'Buổi 48, CLO7/CLO8/CLO9/CLO10, practice 4 (⚠️ CLO gõ "LO6-LO10"). Khung.', 4, '4.3', '48', 'CLO7, CLO8, CLO9, CLO10', 'practice 4 (⚠️ CLO gõ "LO6-LO10", xem 0.2)', '15%',
  'FLM (verbatim): "Evaluation and grading" — a single session, same pattern as Unit 2.',
  'FLM (nguyên văn): "Evaluation and grading" — một buổi duy nhất, giống Unit 2.',
  'The finished live-model male portrait, ready for in-class grading.',
  'Bài chân dung người mẫu thật nam hoàn thiện, sẵn sàng để chấm tại lớp.');

// ── Chương 5 — Unit 5: Chân dung người mẫu thật nữ (buổi 49-59), practice 5, 15% ──
const k51 = khung('drp101-5-2-dung-hinh-len-khoi-ta-chat-nu', 'Block-in, volume & texture — live female model', 'Dựng hình, lên khối & tả chất — người mẫu thật nữ',
  'Buổi 49-57 (⚠️ buổi 49 dính chữ trong bảng gốc, xem 0.5), CLO7/CLO8/CLO9/CLO10, practice 5 (15%). Khung.', 5, '5.1', '49-57', 'CLO7, CLO8, CLO9, CLO10', 'practice 5', '15%',
  'Same process as Unit 4 (Lesson 4.2), now with the live FEMALE model — full block-in through texture. Session 49\'s own FLM heading runs "Unit 5: Live model female portrait." together with "Practice" with no space (see 0.5); we keep the raw string there and simply note it here.',
  'Cùng quy trình như Unit 4 (bài 4.2), lần này với người mẫu thật NỮ — đủ từ dựng hình tới tả chất. Tiêu đề buổi 49 trong bảng FLM dính liền "Unit 5: Live model female portrait." với chữ "Practice", không có khoảng trắng (xem 0.5); chúng tôi giữ nguyên chuỗi gốc ở đó và chỉ nhắc lại ở đây.',
  'A complete portrait drawing of the live female model, in progress through block-in, volume and texture.',
  'Một bài chân dung người mẫu thật nữ hoàn chỉnh, đang ở giai đoạn dựng hình, lên khối và tả chất.');

const k52 = khung('drp101-5-3-cham-bai-nu-that', 'Practice & Evaluation and grading', 'Thực hành & Chấm bài — Evaluation and grading',
  'Buổi 58-59 (⚠️ CLO gõ "CCLO7-CCLO10", xem 0.3), practice 5 (15%). Khung.', 5, '5.2', '58-59', 'CCLO7, CCLO8, CCLO9, CCLO10 (⚠️ lỗi gõ, xem 0.3)', 'practice 5', '15%',
  'Session 58 is still "Practice" (finishing touches); session 59 is "Evaluation and grading" (FLM, verbatim) — the last graded drawing before the Progress Test.',
  'Buổi 58 vẫn là "Practice" (hoàn thiện nốt); buổi 59 là "Evaluation and grading" (nguyên văn FLM) — bài vẽ được chấm cuối cùng trước Progress Test.',
  'The finished live-model female portrait — the fifth and last of the five graded practice drawings.',
  'Bài chân dung người mẫu thật nữ hoàn thiện — bài thứ năm và cũng là bài cuối trong 5 bài vẽ được chấm điểm.');

// ── Chương 6 — Progress Test & tổng kết Portfolio (buổi 60) ──
const k61 = khung('drp101-6-1-progress-test', 'Progress Test — reviewing all 10 CLO', 'Progress Test — ôn tập toàn bộ 10 CLO',
  'Buổi 60, CLO1-CLO10, Progress Test (15%, ⚠️ "No Question" gõ "25;", xem 0.2). Khung.', 6, '6.1', '60', 'CLO1-CLO10', 'Progress Test', '15%',
  'FLM (verbatim): "Progress Test", 30 minutes, in class — the ONLY timed test in the whole course, and it is the only item tagging all ten CLOs at once. Review 0.3 (all 10 CLO) and the proportion/process material from Chapter 1 before this session.',
  'FLM (nguyên văn): "Progress Test", 30 phút, tại lớp — bài kiểm TÍNH GIỜ duy nhất của cả môn, và là đầu điểm duy nhất gắn cả mười CLO cùng lúc. Ôn lại mục 0.3 (đủ 10 CLO) và phần tỉ lệ/quy trình ở Chương 1 trước buổi này.',
  'Whatever the Progress Test format requires — FLM does not publish further detail beyond "30 minute, in class" and the (typo\'d) "25;" question count.',
  'Theo đúng hình thức Progress Test yêu cầu — FLM không công bố thêm chi tiết ngoài "30 phút, tại lớp" và số câu hỏi bị gõ lỗi "25;".');

const k62 = khung('drp101-6-2-portfolio-tong-ket', 'Portfolio & course wrap-up', 'Tổng kết môn & nộp Portfolio',
  'Sau buổi 60, StudentTasks (⚠️ mâu thuẫn với "không thi cuối kỳ", xem 0.2/0.6). Khung.', 6, '6.2', 'sau buổi 60', '—', 'Portfolio (điều kiện StudentTasks)', '—',
  'FLM (verbatim, StudentTasks): "Complete course\'s Portfolio with full contents of exercises and submit to the teacher 1 day after the course." Gather all five graded drawings (practice 1-5) plus supporting sketches into one Portfolio.',
  'FLM (nguyên văn, StudentTasks): "Hoàn thành Portfolio môn học đủ nội dung các bài tập và nộp cho giảng viên 1 ngày sau khi kết thúc môn." Gom đủ 5 bài vẽ đã chấm (practice 1-5) cùng các phác thảo hỗ trợ vào một Portfolio.',
  'The complete Portfolio: all 5 graded drawings (Unit 1-5) plus supporting sketches, submitted within 1 day of the course ending.',
  'Portfolio đầy đủ: cả 5 bài vẽ đã chấm (Unit 1-5) cùng phác thảo hỗ trợ, nộp trong vòng 1 ngày sau khi môn kết thúc.');

// ── Quiz ngắn cho mỗi chương khung (5-8 câu, song ngữ EN|||VI, có explanation) ──
const q2 = quiz('drp101-quiz-2', 'Quiz — Chapter 2 (Unit 2, sessions 13-24)|||Quiz — Chương 2 (Unit 2, buổi 13-24)', [
  { id: 'q1', question: 'What is the main goal of Unit 2 (a second plaster male head)?|||Mục tiêu chính của Unit 2 (đầu tượng nam thứ hai) là gì?',
    options: ['Learn a brand-new process|||Học một quy trình hoàn toàn mới', 'Repeat the Lesson 1.5 process for speed and consistency|||Lặp lại quy trình ở bài 1.5 để làm nhanh và đều tay hơn', 'Skip block-in entirely|||Bỏ hẳn bước dựng hình', 'Switch to colour pencils|||Đổi sang bút chì màu'],
    correctIndex: 1, points: 1, explanation: 'Unit 2 repeats the same 6-step process from 1.5 on a second head — the point is speed and consistency, not new theory.|||Unit 2 lặp lại đúng quy trình 6 bước ở bài 1.5 trên đầu tượng thứ hai — mục tiêu là làm nhanh và đều tay hơn, không phải học lý thuyết mới.' },
  { id: 'q2', question: 'Which CLOs are tagged across sessions 13-24 in the FLM plan?|||Những CLO nào được gắn cho buổi 13-24 trong bảng FLM?',
    options: ['CLO1-CLO4|||CLO1-CLO4', 'CLO7, CLO8|||CLO7, CLO8', 'CLO9, CLO10|||CLO9, CLO10', 'All 10 CLOs|||Cả 10 CLO'],
    correctIndex: 1, points: 1, explanation: 'Sessions 13-24 (Unit 2) are tagged CLO7/CLO8, same as most of Unit 1 — see 0.3.|||Buổi 13-24 (Unit 2) được gắn CLO7/CLO8, giống phần lớn Unit 1 — xem mục 0.3.' },
  { id: 'q3', question: 'Which session in the FLM table has a completely blank LO column?|||Buổi nào trong bảng FLM có cột LO trống hoàn toàn?',
    options: ['Session 13|||Buổi 13', 'Session 16|||Buổi 16', 'Session 20|||Buổi 20', 'Session 24|||Buổi 24'],
    correctIndex: 1, points: 1, explanation: 'Session 16 has a blank LO cell in FLM\'s own table — see 0.3 and 0.5.|||Buổi 16 có ô LO trống trong chính bảng của FLM — xem mục 0.3 và 0.5.' },
  { id: 'q4', question: 'What does session 24 mark in the FLM plan?|||Buổi 24 trong bảng FLM đánh dấu điều gì?',
    options: ['The start of Unit 3|||Bắt đầu Unit 3', '"Evaluation and grading" — the end of Unit 2|||"Evaluation and grading" — kết thúc Unit 2', 'The Progress Test|||Progress Test', 'A rest day|||Ngày nghỉ'],
    correctIndex: 1, points: 1, explanation: 'Session 24 is "Evaluation and grading", closing out Unit 2 with a single grading session (unlike Unit 1\'s two).|||Buổi 24 là "Evaluation and grading", kết thúc Unit 2 với một buổi chấm duy nhất (khác Unit 1 có hai buổi).' },
  { id: 'q5', question: 'How much of the total grade does practice 2 (Unit 2) count for?|||practice 2 (Unit 2) chiếm bao nhiêu phần trăm tổng điểm?',
    options: ['10%|||10%', '15%|||15%', '25%|||25%', '30%|||30%'], correctIndex: 1, points: 1,
    explanation: 'Every practice (1-5) is worth 15% each — see 0.2.|||Mỗi practice (1-5) đều chiếm 15% — xem mục 0.2.' },
], 300);

const q3 = quiz('drp101-quiz-3', 'Quiz — Chapter 3 (Unit 3, sessions 25-36)|||Quiz — Chương 3 (Unit 3, buổi 25-36)', [
  { id: 'q1', question: 'What is drawn in Unit 3?|||Unit 3 vẽ gì?',
    options: ['A second male plaster head|||Đầu tượng nam thứ hai', 'A plaster cast FEMALE head|||Đầu tượng thạch cao NỮ', 'A live model|||Người mẫu thật', 'A hand study|||Nghiên cứu bàn tay'],
    correctIndex: 1, points: 1, explanation: 'Unit 3 (sessions 25-36) is "Unit 3: Plaster cast female head" per FLM.|||Unit 3 (buổi 25-36) là "Unit 3: Plaster cast female head" theo FLM.' },
  { id: 'q2', question: 'Which sessions is CLO5 (male vs female differences) actually tagged at?|||CLO5 (khác biệt nam/nữ) thực sự được gắn ở những buổi nào?',
    options: ['All of sessions 25-36|||Toàn bộ buổi 25-36', 'Only sessions 25-26|||Chỉ buổi 25-26', 'Only session 36|||Chỉ buổi 36', 'It is never tagged|||Không buổi nào'],
    correctIndex: 1, points: 1, explanation: 'FLM tags CLO5 only at the two opening sessions (25-26); the rest reverts to CLO7/CLO8 — a mapping anomaly noted in 0.3.|||FLM chỉ gắn CLO5 ở hai buổi mở đầu (25-26); phần còn lại quay về CLO7/CLO8 — một bất thường ánh xạ đã nêu ở mục 0.3.' },
  { id: 'q3', question: 'Which session has a blank ITU column in the FLM table?|||Buổi nào có cột ITU trống trong bảng FLM?',
    options: ['Session 26|||Buổi 26', 'Session 30|||Buổi 30', 'Session 33|||Buổi 33', 'Session 36|||Buổi 36'],
    correctIndex: 1, points: 1, explanation: 'Session 30\'s ITU cell is blank in FLM\'s raw table — see 0.3 and 0.5.|||Ô ITU của buổi 30 trống trong bảng gốc FLM — xem mục 0.3 và 0.5.' },
  { id: 'q4', question: 'How many sessions does Unit 3\'s "Evaluation and grading" take?|||"Evaluation and grading" của Unit 3 chiếm mấy buổi?',
    options: ['1 (session 36 only)|||1 (chỉ buổi 36)', '2 (sessions 35-36)|||2 (buổi 35-36)', '3 (sessions 34-36)|||3 (buổi 34-36)', '0, it is not graded|||0, không được chấm'],
    correctIndex: 1, points: 1, explanation: 'Unit 3 has TWO evaluation sessions (35-36), unlike Unit 2\'s single session — the evaluation-session count is uneven across units (see 0.2).|||Unit 3 có HAI buổi chấm (35-36), khác Unit 2 chỉ một buổi — số buổi chấm không đều giữa các unit (xem mục 0.2).' },
], 300);

const q4 = quiz('drp101-quiz-4', 'Quiz — Chapter 4 (Unit 4, sessions 37-48)|||Quiz — Chương 4 (Unit 4, buổi 37-48)', [
  { id: 'q1', question: 'What changes for the first time in Unit 4?|||Điều gì thay đổi lần đầu tiên ở Unit 4?',
    options: ['The paper size|||Khổ giấy', 'You draw a LIVE model instead of a plaster cast|||Bạn vẽ NGƯỜI MẪU THẬT thay vì tượng thạch cao', 'You switch to colour|||Bạn chuyển sang vẽ màu', 'The course ends|||Môn kết thúc'],
    correctIndex: 1, points: 1, explanation: 'Unit 4 ("Live model male portrait") is the first time a live, moving, coloured subject replaces the white plaster cast.|||Unit 4 ("Live model male portrait") là lần đầu một đối tượng thật, có chuyển động, có màu thay cho tượng thạch cao trắng.' },
  { id: 'q2', question: 'Where is CLO6 (compare cast vs live model) officially tagged in FLM\'s table?|||CLO6 (so sánh tượng với người thật) được FLM gắn chính thức ở đâu?',
    options: ['Session 1|||Buổi 1', 'Sessions 37-38|||Buổi 37-38', 'Session 60|||Buổi 60', 'It is never tagged|||Không buổi nào'],
    correctIndex: 1, points: 1, explanation: 'CLO6 is officially tagged only at sessions 37-38, the opening of Unit 4.|||CLO6 chỉ được gắn chính thức ở buổi 37-38, phần mở đầu Unit 4.' },
  { id: 'q3', question: 'What typo appears in practice 4\'s CLO column in the FLM grading table?|||practice 4 bị lỗi gõ gì ở cột CLO trong bảng điểm FLM?',
    options: ['A trailing period|||Dấu chấm thừa', '"LO6, LO7…" — missing the letter "C"|||"LO6, LO7…" — thiếu chữ "C"', 'Repeated "CC"|||Lặp chữ "CC"', 'An extra semicolon|||Thừa dấu chấm phẩy'],
    correctIndex: 1, points: 1, explanation: 'practice 4 writes "LO6, LO7, LO8, LO9, LO10" — missing the "C" that every other row has (see 0.2).|||practice 4 ghi "LO6, LO7, LO8, LO9, LO10" — thiếu chữ "C" mà mọi dòng khác đều có (xem mục 0.2).' },
  { id: 'q4', question: 'Which two CLOs appear for the first time from Unit 4 onward?|||Hai CLO nào lần đầu xuất hiện từ Unit 4 trở đi?',
    options: ['CLO1, CLO2|||CLO1, CLO2', 'CLO9, CLO10|||CLO9, CLO10', 'CLO3, CLO4|||CLO3, CLO4', 'CLO5, CLO6|||CLO5, CLO6'],
    correctIndex: 1, points: 1, explanation: 'CLO9 (unique material properties: hair, skin, clothes) and CLO10 (emphasise outlines) start appearing in the plan only from Unit 4.|||CLO9 (tính chất riêng của vật liệu: tóc, da, quần áo) và CLO10 (nhấn nét viền) chỉ bắt đầu xuất hiện trong bảng kế hoạch từ Unit 4.' },
], 300);

const q5 = quiz('drp101-quiz-5', 'Quiz — Chapter 5 (Unit 5, sessions 49-59)|||Quiz — Chương 5 (Unit 5, buổi 49-59)', [
  { id: 'q1', question: 'What does Unit 5 draw?|||Unit 5 vẽ gì?',
    options: ['A second female plaster head|||Đầu tượng thạch cao nữ thứ hai', 'A live FEMALE model portrait|||Chân dung NGƯỜI MẪU THẬT NỮ', 'Hands and feet|||Bàn tay và bàn chân', 'A self-portrait|||Tự hoạ'],
    correctIndex: 1, points: 1, explanation: 'Unit 5 (sessions 49-59) is "Unit 5: Live model female portrait" per FLM.|||Unit 5 (buổi 49-59) là "Unit 5: Live model female portrait" theo FLM.' },
  { id: 'q2', question: 'What raw formatting quirk appears in FLM\'s own heading for session 49?|||Tiêu đề buổi 49 trong bảng gốc FLM bị lỗi định dạng gì?',
    options: ['A missing CLO|||Thiếu CLO', 'The Unit name and "Practice" are glued together with no space|||Tên Unit và chữ "Practice" bị dính liền, không có khoảng trắng', 'A duplicated session number|||Số buổi bị lặp', 'An empty topic cell|||Ô chủ đề trống'],
    correctIndex: 1, points: 1, explanation: 'Session 49 reads "Unit 5: Live model female portrait.Practice" with no space — kept verbatim, see 0.5.|||Buổi 49 ghi "Unit 5: Live model female portrait.Practice" không có khoảng trắng — giữ nguyên văn, xem mục 0.5.' },
  { id: 'q3', question: 'What typo appears in the LO column at sessions 58-59?|||Cột LO của buổi 58-59 bị lỗi gõ gì?',
    options: ['"CCLO7, CCLO8…" — the letter "C" is doubled|||"CCLO7, CCLO8…" — chữ "C" bị lặp', 'A trailing comma|||Dấu phẩy thừa cuối', 'Missing CLO numbers|||Thiếu số CLO', 'Wrong CLO order|||Sai thứ tự CLO'],
    correctIndex: 0, points: 1, explanation: 'Sessions 58-59 write "CCLO7, CCLO8, CCLO9, CCLO10" — a doubled "C" typo, kept as published (see 0.3).|||Buổi 58-59 ghi "CCLO7, CCLO8, CCLO9, CCLO10" — lỗi gõ lặp chữ "C", giữ nguyên như bản gốc (xem mục 0.3).' },
  { id: 'q4', question: 'practice 5 is which one of the five graded drawings?|||practice 5 là bài thứ mấy trong 5 bài vẽ được chấm điểm?',
    options: ['The first|||Bài đầu tiên', 'The third|||Bài thứ ba', 'The fifth and last|||Bài thứ năm, cũng là bài cuối', 'There is no practice 5|||Không có practice 5'],
    correctIndex: 2, points: 1, explanation: 'practice 5 (Unit 5) is the fifth and final graded drawing before the Progress Test.|||practice 5 (Unit 5) là bài vẽ được chấm thứ năm và cũng là bài cuối trước Progress Test.' },
], 300);

const q6 = quiz('drp101-quiz-6', 'Quiz — Chapter 6 (Progress Test & Portfolio)|||Quiz — Chương 6 (Progress Test & Portfolio)', [
  { id: 'q1', question: 'Does DRP101 have a final exam?|||DRP101 có thi cuối kỳ không?',
    options: ['Yes, worth 30%|||Có, chiếm 30%', 'No — 100% of the grade is on-going|||Không — 100% điểm là điểm quá trình', 'Only for students who fail practice 5|||Chỉ với sinh viên trượt practice 5', 'Yes, but optional|||Có, nhưng không bắt buộc'],
    correctIndex: 1, points: 1, explanation: 'DRP101 has NO final exam — grading is 100% on-going (Participation + 5 practices + Progress Test). See 0.2.|||DRP101 KHÔNG có thi cuối kỳ — điểm 100% là điểm quá trình (Participation + 5 practice + Progress Test). Xem mục 0.2.' },
  { id: 'q2', question: 'Which document, contradicting the "no final exam" fact, still mentions a "final examination"?|||Văn bản nào, dù mâu thuẫn với việc "không thi cuối kỳ", vẫn nhắc tới "final examination"?',
    options: ['The CLO table|||Bảng CLO', 'StudentTasks (attendance requirement)|||StudentTasks (điều kiện dự lớp)', 'The materials table|||Bảng tài liệu', 'The 60-session plan|||Bảng kế hoạch 60 buổi'],
    correctIndex: 1, points: 1, explanation: 'StudentTasks says attendance is needed "in order to be accepted to the final examination" — a contradiction with the 100% on-going grading, kept as FLM published it (0.2, 0.6).|||StudentTasks ghi cần dự lớp "để được chấp nhận thi cuối kỳ" — mâu thuẫn với việc 100% điểm quá trình, giữ nguyên như FLM công bố (mục 0.2, 0.6).' },
  { id: 'q3', question: 'How many CLOs does the Progress Test (session 60) cover?|||Progress Test (buổi 60) phủ bao nhiêu CLO?',
    options: ['1', '5', 'All 10|||Cả 10', '0'], correctIndex: 2, points: 1,
    explanation: 'The Progress Test is the only item tagging all ten CLOs (CLO1-CLO10) at once.|||Progress Test là đầu điểm duy nhất gắn cả mười CLO (CLO1-CLO10) cùng lúc.' },
  { id: 'q4', question: 'When must the Portfolio be submitted?|||Portfolio phải nộp khi nào?',
    options: ['Before the Progress Test|||Trước Progress Test', '1 day after the course ends|||1 ngày sau khi môn kết thúc', 'On the last day of Unit 5|||Ngày cuối Unit 5', 'There is no deadline|||Không có hạn nộp'],
    correctIndex: 1, points: 1, explanation: 'FLM\'s StudentTasks says the Portfolio must reach the teacher "1 day after the course" — a tight deadline (see 0.6).|||StudentTasks của FLM ghi Portfolio phải tới tay giảng viên "1 ngày sau khi kết thúc môn" — hạn rất gấp (xem mục 0.6).' },
], 300);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'DRP101',
    slug: 'drp101-drawing-plaster-statue-portrait',
    title: 'Drawing plaster statue - portrait',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DRP101.webp',
    shortDescription: 'FLM Syllabus 13344 — studio drawing, real plaster casts & a live model, 60 sessions. NO final exam: 100% on-going (Participation 10% + 5 drawings 15% each + Progress Test 15%). Unit 1 (1-12) fully taught; Units 2-5 & Progress Test are a framework.|||FLM Syllabus 13344 — vẽ trong xưởng, tượng thạch cao & người mẫu thật, 60 buổi. KHÔNG thi cuối kỳ: 100% điểm quá trình (Participation 10% + 5 bài vẽ 15%/bài + Progress Test 15%). Unit 1 (buổi 1-12) dạy đầy đủ; Unit 2-5 & Progress Test là khung.',
    description: 'Môn <strong>DRP101 — Drawing plaster statue - portrait</strong> (Hình hoạ - Vẽ đầu tượng, chân dung, Kỳ 1, ngành Thiết kế đồ hoạ) dựng lại bám nguyên văn <strong>FLM Syllabus 13344</strong> (QĐ 932/QĐ-ĐHFPT ngày 22/08/2025), đủ <strong>60 buổi</strong>, <strong>10 CLO</strong> và <strong>7 đầu điểm</strong>. Đây là môn học <strong>trực tiếp trong xưởng vẽ</strong> — giấy A2, chì than, tượng thạch cao thật, người mẫu thật; trang web chỉ hỗ trợ lý thuyết &amp; tự luyện, <strong>không thay được</strong> buổi vẽ có mẫu. Môn <strong>KHÔNG có thi cuối kỳ</strong> — 100% điểm quá trình: Participation 10% + 5 bài vẽ (practice 1-5, mỗi bài ứng với một trong 5 Unit) mỗi bài 15% + Progress Test 15%. <strong>Mục 0</strong> là khung chương trình đầy đủ (hồ sơ môn, cách tính điểm, 10 CLO, giáo trình &amp; công cụ xưởng vẽ, kế hoạch 60 buổi, nhiệm vụ sinh viên, bảng 20 câu hỏi kiến tạo) để sinh viên tự đối chiếu với FLM. <strong>Chương 1</strong> (buổi 1-12: Unit 1, đầu tượng thạch cao nam 1) dạy đầy đủ — chân dung là gì, tỉ lệ khuôn mặt chuẩn theo Loomis, đường trục dựng hình, hình khối &amp; chất liệu ngũ quan, quy trình dựng hình → lên khối → tả chất — song ngữ, có bảng, lỗi hay mắc, bài tập và kết chương bằng quiz. <strong>Chương 2 đến hết</strong> (Unit 2 đầu tượng nam 2, Unit 3 đầu tượng nữ, Unit 4-5 chân dung người mẫu thật nam/nữ, Progress Test &amp; Portfolio) hiện là <strong>khung</strong> — đúng tên bài, đúng buổi/CLO/practice/trọng số, mốc "làm gì – nộp gì" — để sinh viên có đúng chương trình học ngay, chi tiết sẽ bổ sung dần.',
    whatYouLearn: 'Phân biệt tượng thạch cao &amp; người mẫu thật; tỉ lệ khuôn mặt chuẩn theo phương pháp Loomis (đo bằng đơn vị đầu, không phải cm); dựng đường trục ngang/dọc trước khi vẽ ngũ quan; hình khối &amp; chất liệu của mắt (cầu trong hốc), mũi (khối nêm), miệng (bám khối trụ hàm), tai; quy trình 6 bước dựng hình → đo tỉ lệ (sight-size) → mảng lớn → lên khối (năm vùng ánh sáng) → tả chất; cách tổ chức Portfolio 5 bài vẽ; khung đủ 5 Unit (đầu tượng nam x2, đầu tượng nữ, chân dung người mẫu thật nam &amp; nữ) và Progress Test theo đúng lịch FLM.',
    requirements: 'Không cần kinh nghiệm vẽ trước (theo FLM). Cần tới xưởng vẽ của trường để có tượng thạch cao, người mẫu, giá vẽ, bục, vải nền theo đúng danh sách công cụ ở mục 0.4 — trang web KHÔNG thay thế được các buổi thực hành này. Tự chuẩn bị: bút chì graphite/chì than, giấy vẽ khổ A2, tẩy, ống đựng tranh, thước/dây/kẹp/ghim, dao.',
  },
  sections: [
    {
      title: 'Mục 0 — Khung chương trình theo FLM|||Section 0 — FLM program framework',
      description: 'Hồ sơ môn, cách tính điểm (7 đầu điểm, KHÔNG thi cuối kỳ), 10 CLO, giáo trình &amp; công cụ xưởng vẽ, kế hoạch đủ 60 buổi, nhiệm vụ sinh viên, bảng câu hỏi kiến tạo — đối chiếu trực tiếp FLM Syllabus 13344.',
      lessons: [m01, m02, m03, m04, m05, m06, m07],
    },
    {
      title: 'Chương 1 — Unit 1: Đầu tượng thạch cao nam 1 (buổi 1-12)|||Chapter 1 — Unit 1: Plaster cast male head 1 (sessions 1-12)',
      description: 'Buổi 1-12 · CLO1, CLO2, CLO3, CLO4, CLO7, CLO8 · practice 1 (15%) · Chân dung là gì, tỉ lệ mặt chuẩn (Loomis), đường trục, hình khối ngũ quan, quy trình dựng hình→lên khối→tả chất, cộng 4 bài kỹ năng nền tảng bổ sung (dụng cụ/nét, khối hình học, phối cảnh, ánh sáng/sắc độ) — ĐẦY ĐỦ, dạy được ngay, kết chương bằng quiz.',
      lessons: [l11, l12, l13, l14, l15, l16, l17, l18, l19, c1quiz],
    },
    {
      title: 'Chương 2 — Unit 2: Đầu tượng thạch cao nam 2 (khung)|||Chapter 2 — Unit 2: Plaster cast male head 2 (skeleton)',
      description: 'Buổi 13-24 · CLO7, CLO8 · practice 2 (15%) · Lặp quy trình dựng hình→lên khối trên đầu tượng nam thứ hai — Khung, kết chương bằng quiz ngắn.',
      lessons: [k21, k22, q2],
    },
    {
      title: 'Chương 3 — Unit 3: Đầu tượng thạch cao nữ (khung)|||Chapter 3 — Unit 3: Plaster cast female head (skeleton)',
      description: 'Buổi 25-36 · CLO5, CLO7, CLO8 · practice 3 (15%) · Phân biệt nam/nữ, dựng hình & lên khối đầu tượng nữ — Khung, kết chương bằng quiz ngắn.',
      lessons: [k31, k32, k33, q3],
    },
    {
      title: 'Chương 4 — Unit 4: Chân dung người mẫu thật nam (khung)|||Chapter 4 — Unit 4: Live model male portrait (skeleton)',
      description: 'Buổi 37-48 · CLO6, CLO7, CLO8, CLO9, CLO10 · practice 4 (15%, ⚠️ CLO gõ "LO6-LO10") · So sánh tượng vs người thật, dựng hình→lên khối→tả chất người mẫu nam — Khung, kết chương bằng quiz ngắn.',
      lessons: [k41, k42, k43, q4],
    },
    {
      title: 'Chương 5 — Unit 5: Chân dung người mẫu thật nữ (khung)|||Chapter 5 — Unit 5: Live model female portrait (skeleton)',
      description: 'Buổi 49-59 · CLO7, CLO8, CLO9, CLO10 (⚠️ buổi 58-59 gõ "CCLO…") · practice 5 (15%) · Dựng hình→lên khối→tả chất người mẫu nữ — Khung, kết chương bằng quiz ngắn.',
      lessons: [k51, k52, q5],
    },
    {
      title: 'Chương 6 — Progress Test & tổng kết Portfolio (khung)|||Chapter 6 — Progress Test & Portfolio wrap-up (skeleton)',
      description: 'Buổi 60 · CLO1-CLO10 · Progress Test (15%) + nộp Portfolio 5 bài vẽ (StudentTasks) — Khung, kèm quiz ôn tập ngắn.',
      lessons: [k61, q6, k62],
    },
  ],
};
