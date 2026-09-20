/**
 * EEI101 — Introduction to Electrical-Electronics Engineering
 * (Nhập môn kỹ thuật điện - điện tử). Kỳ 1, 3 tín chỉ, 60 buổi.
 * ─────────────────────────────────────────────────────────────────────────────
 * KHUNG BÁM 100% SYLLABUS FLM 14452 (QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026, thu
 * 19/09/2026 từ flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=14452):
 *   Mục 0     = hồ sơ môn + 5 đầu điểm + 8 CLO + 4 giáo trình/công cụ +
 *               đủ 60 buổi + nhiệm vụ SV.  ← ĐẦY ĐỦ, chính xác từng con số.
 *   Chương 1  = buổi 1–9 (Tooley ch.1 Electrical fundamentals + ch.2 Circuit
 *               simulation + ch.3 Test equipment). ← ĐẦY ĐỦ, dạy được ngay.
 *   Chương 2–13 = KHUNG: đúng tên chương, đúng tên bài, đúng buổi/CLO/mục sách,
 *               mỗi bài 3–6 dòng mốc nội dung. Bài giảng chi tiết bổ sung sau.
 *
 * CÁCH BỔ SUNG NỘI DUNG SAU NÀY: một bài khung là một lời gọi khung(...).
 * Thay lời gọi đó bằng doc(slug, title, desc, [[ '…EN…', '…VI…' ]]) — GIỮ
 * NGUYÊN slug và vị trí trong section là xong; không phải dựng lại cấu trúc.
 *
 * QUY TẮC TÁCH NGUỒN: mọi thứ của trường có <p class="nhan">Nguồn: FLM…</p>;
 * mọi thứ web tự thêm nằm trong <div class="note-ct">. Ô trống của syllabus ghi
 * "trường không công bố" — KHÔNG đoán.
 *
 * ⚠️ 5 chỗ syllabus GỐC bất thường, đã nêu cho sinh viên, KHÔNG tự sửa:
 *   (1) Pre-Requisite ghi "Non" (thiếu chữ e của "None") — bài 0.1.
 *   (2) Buổi 52–54 cột CLO in "CL01" (số không thay chữ O) — bài 0.3, 0.5.
 *   (3) Buổi 6 KHÔNG có CLO nào, cột để trống — bài 0.3, 0.5, 1.6.
 *   (4) Sách CHÍNH là bản 3rd (2006); bản 5th (2019) cùng tên cùng tác giả chỉ
 *       là reference 1 — bài 0.4.
 *   (5) Mọi đầu điểm on-going có HAI phương án song song (Option 1 /
 *       Option 2 "For Constructivism Approach only") — bài 0.2.
 *
 * ⚠️ Giữ NGUYÊN 18 slug cũ (sinh viên đã lưu link).
 * ⚠️ title ≤255 ký tự tính CẢ hai vế EN|||VI. course.shortDescription ≤500.
 * ⚠️ Trong chuỗi: KHÔNG backtick lồng; code escape &lt; &gt; &amp;; viết
 *    omega/mu/pi bằng Latin (ohm, uF, pi) để console/font không hỏng.
 * ⚠️ MỌI phép tính trong Chương 1 đã tự kiểm lại bằng python3.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/EEI101.mjs --apply
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions, timeLimitSeconds = 480) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds, questions } });

const NGUON = 'Nguồn: FLM · Syllabus 14452 · QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026';

/**
 * Bài KHUNG (chương 2 → hết). m = {
 *   s: '13' | '10–12'   số buổi FLM
 *   clo: 'CLO2' | 'All CLOs' | '(trống)'
 *   flm: chủ đề buổi NGUYÊN VĂN tiếng Anh của FLM
 *   sach: mục trong giáo trình chính (Tooley 3rd, 2006)
 *   hEn/hVi: tiêu đề bài · lEn/lVi: học gì · dEn/dVi: sau buổi làm được gì
 * }
 * Cố tình KHÔNG dùng template literal lồng ở đây.
 */
const khung = (slug, title, desc, m) => doc(slug, title, desc, [[
  '<span class="eyebrow">EEI101 · Session ' + m.s + ' · ' + m.clo + '</span>\n'
  + '<h2>' + m.hEn + '</h2>\n'
  + '<p class="lead">Framework page. The session number, the outcome and the textbook sections below are fixed from the FLM syllabus; the full teaching text, worked calculations and exercises are being written.</p>\n'
  + '<p class="nhan">' + NGUON + ' · session ' + m.s + ' — "' + m.flm + '"</p>\n'
  + '<ul>\n'
  + '<li><strong>Session</strong> ' + m.s + ' · <strong>' + m.clo + '</strong> — as published by FLM.</li>\n'
  + '<li><strong>Textbook</strong> — Tooley, <em>Electronic Circuits: Fundamentals and Applications</em> (3rd ed, 2006), ' + m.sach + '.</li>\n'
  + '<li><strong>What this session covers</strong> — ' + m.lEn + '</li>\n'
  + '<li><strong>What you can do afterwards</strong> — ' + m.dEn + '</li>\n'
  + '</ul>\n'
  + '<div class="note-ct">This page is a <strong>framework</strong> for now — that is deliberate, not an accident. What is already correct and will not move: the session number, the CLO and the textbook sections. What comes later: the explanation, the worked calculations, the traps and the exercises. <strong>Chapter 1 is finished</strong> — open it to see what a completed lesson on this site looks like.</div>',
  '<span class="eyebrow">EEI101 · Buổi ' + m.s + ' · ' + m.clo + '</span>\n'
  + '<h2>' + m.hVi + '</h2>\n'
  + '<p class="lead">Bài khung. Số buổi, chuẩn đầu ra và mục giáo trình dưới đây đã chốt theo syllabus FLM; phần giảng chi tiết, phép tính mẫu và bài tập sẽ bổ sung sau.</p>\n'
  + '<p class="nhan">' + NGUON + ' · buổi ' + m.s + ' — "' + m.flm + '"</p>\n'
  + '<ul>\n'
  + '<li><strong>Buổi</strong> ' + m.s + ' · <strong>' + m.clo + '</strong> — theo đúng bản trường công bố.</li>\n'
  + '<li><strong>Giáo trình</strong> — Tooley, <em>Electronic Circuits: Fundamentals and Applications</em> (bản 3rd, 2006), ' + m.sach + '.</li>\n'
  + '<li><strong>Buổi này học gì</strong> — ' + m.lVi + '</li>\n'
  + '<li><strong>Học xong làm được gì</strong> — ' + m.dVi + '</li>\n'
  + '</ul>\n'
  + '<div class="note-ct">Bài này đang là <strong>khung</strong> — có chủ đích, không phải bỏ sót. Phần đã đúng và sẽ không đổi: số buổi, CLO, mục giáo trình. Phần bổ sung sau: lời giảng, phép tính mẫu, bẫy thường gặp, bài tập. <strong>Chương 1 đã viết xong đầy đủ</strong> — mở ra xem một bài hoàn chỉnh của web trông thế nào.</div>',
]]);

/* ════════════════════════════════════════════════════════════════════════════
 * KẾ HOẠCH 60 BUỔI — NGUYÊN BẢN FLM (bài 0.5 dựng bảng từ mảng này)
 * [số buổi, chủ đề tiếng Anh NGUYÊN VĂN, dịch tiếng Việt, cột CLO, bài trên web]
 * KHÔNG sửa cột chủ đề và cột CLO — sinh viên phải đối chiếu được với bản trường
 * phát. Buổi 6 cột CLO TRỐNG trên FLM; buổi 52–54 bản gốc in "CL01".
 * ══════════════════════════════════════════════════════════════════════════ */
const BUOI_A = [
  ['1', 'Course overview. Chapter 1: Electrical fundamentals — 1.1 Fundamental units (SI)', 'Tổng quan môn học. Chương 1: Các nguyên lý điện cơ bản — 1.1 Đơn vị cơ bản (hệ SI)', 'CLO1', '1.1'],
  ['2', "1.2 Conductors, insulators, voltage and resistance; 1.3 Ohm's Law; 1.4 Electric fields; 1.5 Magnetic fields; 1.6 Circuit diagrams", '1.2 Vật dẫn, vật cách điện, điện áp và điện trở; 1.3 Định luật Ohm; 1.4 Điện trường; 1.5 Từ trường; 1.6 Sơ đồ mạch', 'CLO1', '1.2'],
  ['3', '1.7 Practical investigation &amp; Problems', '1.7 Thực hành khảo sát &amp; Bài tập', 'CLO1', '1.3'],
  ['4', 'Chapter 2: Circuit simulation — 2.1 Types of analysis; 2.2 Netlists and component models', 'Chương 2: Mô phỏng mạch — 2.1 Các loại phân tích; 2.2 Netlist và mô hình linh kiện', 'CLO6', '1.4'],
  ['5', '2.3 Logic simulation; 2.4 Practical Investigation &amp; Problems', '2.3 Mô phỏng logic; 2.4 Thực hành khảo sát &amp; Bài tập', 'CLO6', '1.5'],
  ['6', 'Introduction to presentation', 'Giới thiệu về thuyết trình', '(trống — trường không công bố)', '1.6'],
  ['7', 'Chapter 3: Test equipment and measurements — 3.1 Multi-range meters; 3.2 Digital multi-range meters', 'Chương 3: Thiết bị đo và phép đo — 3.1 Đồng hồ đa thang đo (kim); 3.2 Đồng hồ đa thang đo số', 'CLO7', '1.7'],
  ['8', '3.3 The oscilloscope', '3.3 Dao động ký (oscilloscope)', 'CLO7', '1.8'],
  ['9', '3.4 Practical investigation &amp; Problems', '3.4 Thực hành khảo sát &amp; Bài tập', 'CLO7', '1.9'],
  ['10', 'Lab 1', 'Lab 1', 'All CLOs', '2.1'],
  ['11', 'Lab 1', 'Lab 1', 'All CLOs', '2.1'],
  ['12', 'Lab 1', 'Lab 1', 'All CLOs', '2.1'],
  ['13', 'Chapter 4: Passive Components — 4.1 Resistors; 4.2 Capacitance', 'Chương 4: Linh kiện thụ động — 4.1 Điện trở; 4.2 Điện dung', 'CLO2', '2.2'],
  ['14', '4.3 Inductors', '4.3 Cuộn cảm', 'CLO2', '2.3'],
  ['15', '4.4 Practical investigation &amp; Problems', '4.4 Thực hành khảo sát &amp; Bài tập', 'CLO2', '2.4'],
  ['16', 'Chapter 5: D.C. circuits — 5.1 The Theorems and Laws', 'Chương 5: Mạch một chiều (D.C.) — 5.1 Các định lý và định luật', 'CLO3', '3.1'],
  ['17', '5.2 L-R-C circuits', '5.2 Mạch L-R-C', 'CLO3', '3.2'],
  ['18', '5.3 Practical investigation &amp; Problems', '5.3 Thực hành khảo sát &amp; Bài tập', 'CLO3', '3.3'],
  ['19', 'Chapter 6: Alternating voltage and current — 6.1 Alternating versus direct current; 6.2 Reactance', 'Chương 6: Điện áp và dòng xoay chiều — 6.1 Xoay chiều so với một chiều; 6.2 Điện kháng', 'CLO3', '3.4'],
  ['20', '6.3 Power factor and Resonance; 6.4 Transformers', '6.3 Hệ số công suất và Cộng hưởng; 6.4 Biến áp', 'CLO3', '3.5'],
  ['21', '6.5 Practical investigation &amp; Problems', '6.5 Thực hành khảo sát &amp; Bài tập', 'CLO3', '3.6'],
  ['22', 'Lab 2', 'Lab 2', 'All CLOs', '4.1'],
  ['23', 'Lab 2', 'Lab 2', 'All CLOs', '4.1'],
  ['24', 'Lab 2', 'Lab 2', 'All CLOs', '4.1'],
  ['25', 'Chapter 7: Semiconductors — 7.1 Semiconductor junction and diodes; 7.2 Bipolar junction transistors', 'Chương 7: Bán dẫn — 7.1 Tiếp giáp bán dẫn và diode; 7.2 Transistor lưỡng cực (BJT)', 'CLO2, CLO4', '5.1'],
  ['26', '7.3 Field effect transistors; 7.4 Integrated circuits; 7.5 Practical investigation &amp; Problems', '7.3 Transistor hiệu ứng trường (FET); 7.4 Mạch tích hợp (IC); 7.5 Thực hành khảo sát &amp; Bài tập', 'CLO2, CLO4', '5.2'],
  ['27', 'Chapter 8: Power sources and supplies — 8.1 Rectifiers, Reservoir, and Smoothing Circuits', 'Chương 8: Nguồn và bộ nguồn — 8.1 Mạch chỉnh lưu, tụ trữ và mạch làm phẳng', 'CLO2, CLO5', '6.1'],
  ['28', '8.2 Voltage Regulators', '8.2 Mạch ổn áp', 'CLO2, CLO5', '6.2'],
  ['29', '8.3 Output resistance and voltage regulation', '8.3 Điện trở ra và độ ổn định điện áp', 'CLO2, CLO5', '6.3'],
  ['30', 'Assignment 1', 'Assignment 1 (bài tập lớn 1)', 'All CLOs', '6.4'],
];
const BUOI_B = [
  ['31', '8.4 Practical power supply circuits', '8.4 Các mạch nguồn thực tế', 'CLO2, CLO5', '6.5'],
  ['32', '8.5 Switched-mode power supplies', '8.5 Nguồn xung (switched-mode)', 'CLO2, CLO5', '6.6'],
  ['33', '8.6 Practical investigation &amp; Problems', '8.6 Thực hành khảo sát &amp; Bài tập', 'CLO2, CLO5', '6.7'],
  ['34', 'Progress test 1', 'Kiểm tra tiến độ 1', 'All CLOs', '7.1'],
  ['35', 'Chapter 9: Amplifiers — 9.1 Types of Amplifier and Basic Operation; 9.2 Frequency Response and Characteristics; 9.3 Negative Feedback and Transistor Amplifiers', 'Chương 9: Mạch khuếch đại — 9.1 Các loại khuếch đại và hoạt động cơ bản; 9.2 Đáp ứng tần số và đặc tuyến; 9.3 Hồi tiếp âm và khuếch đại transistor', 'CLO5', '8.1'],
  ['36', '9.4 Equivalent Circuits and Parameters; 9.5 Biasing and Performance Prediction; 9.6 Practical Amplifier Circuits and Investigation', '9.4 Mạch tương đương và các tham số; 9.5 Phân cực và dự đoán hiệu năng; 9.6 Mạch khuếch đại thực tế và khảo sát', 'CLO5', '8.2'],
  ['37', 'Chapter 10: Operational amplifiers — 10.1 Symbols and Operational Amplifier Parameters; 10.2 Operational Amplifier Characteristics and Applications', 'Chương 10: Khuếch đại thuật toán (op-amp) — 10.1 Ký hiệu và tham số op-amp; 10.2 Đặc tuyến và ứng dụng op-amp', 'CLO2, CLO5', '8.3'],
  ['38', '10.3 Gain, Bandwidth, and Configurations; 10.4 Operational Amplifier Circuits and Feedback', '10.3 Độ lợi, băng thông và các cấu hình; 10.4 Mạch op-amp và hồi tiếp', 'CLO2, CLO5', '8.4'],
  ['39', '10.5 Multi-Stage Amplifiers and Practical Investigation; 10.6 Important Formulae', '10.5 Khuếch đại nhiều tầng và khảo sát thực hành; 10.6 Các công thức quan trọng', 'CLO2, CLO5', '8.5'],
  ['40', 'Lab 3', 'Lab 3', 'All CLOs', '9.1'],
  ['41', 'Lab 3', 'Lab 3', 'All CLOs', '9.1'],
  ['42', 'Lab 3', 'Lab 3', 'All CLOs', '9.1'],
  ['43', 'Chapter 11: Oscillators — 11.1 Positive feedback and conditions for oscillation', 'Chương 11: Mạch dao động — 11.1 Hồi tiếp dương và điều kiện dao động', 'CLO5', '10.1'],
  ['44', '11.2 Some Typical Oscillator Circuits', '11.2 Một số mạch dao động tiêu biểu', 'CLO5', '10.2'],
  ['45', '11.3 The astable multivibrator; 11.4 Practical oscillator circuits &amp; Problems', '11.3 Mạch đa hài phi ổn (astable multivibrator); 11.4 Mạch dao động thực tế &amp; Bài tập', 'CLO5', '10.3'],
  ['46', 'Chapter 12: Logic circuits — 12.1 Basic logic functions and gates', 'Chương 12: Mạch logic — 12.1 Các hàm logic cơ bản và cổng logic', 'CLO5', '10.4'],
  ['47', '12.2 Types of Bistables', '12.2 Các loại mạch hai trạng thái bền (bistable / flip-flop)', 'CLO5', '10.5'],
  ['48', '12.3 Integrated circuit logic devices; 12.4 Practical investigation &amp; Problems', '12.3 Các IC logic; 12.4 Thực hành khảo sát &amp; Bài tập', 'CLO5', '10.6'],
  ['49', 'Chapter 13: Sensors and interfacing — 13.1 Instrumentation and control system; 13.2 Transducers and Sensors', 'Chương 13: Cảm biến và giao tiếp — 13.1 Hệ thống đo lường và điều khiển; 13.2 Bộ chuyển đổi và cảm biến', 'CLO2', '11.1'],
  ['50', '13.3 Outputs and consumption load; 13.4 Practical investigation &amp; Problems', '13.3 Đầu ra và tải tiêu thụ; 13.4 Thực hành khảo sát &amp; Bài tập', 'CLO2', '11.2'],
  ['51', 'Assignment 2', 'Assignment 2 (bài tập lớn 2)', 'CLO6', '11.3'],
  ['52', 'Chapter 14: Wireless and wired signal transmitters — 14.1 Basics of Electronic Communication', 'Chương 14: Truyền tín hiệu không dây và có dây — 14.1 Cơ bản về truyền thông điện tử', 'CLO1 (gốc in "CL01")', '12.1'],
  ['53', '14.2 Types of Electromagnetic Waves; 14.3 Signal Modulation Techniques', '14.2 Các loại sóng điện từ; 14.3 Các kỹ thuật điều chế tín hiệu', 'CLO1 (gốc in "CL01")', '12.2'],
  ['54', '14.4 Signal Encoding and Decoding', '14.4 Mã hoá và giải mã tín hiệu', 'CLO1 (gốc in "CL01")', '12.3'],
  ['55', 'Lab 4', 'Lab 4', 'All CLOs', '13.1'],
  ['56', 'Lab 4', 'Lab 4', 'All CLOs', '13.1'],
  ['57', 'Lab 4', 'Lab 4', 'All CLOs', '13.1'],
  ['58', 'Progress test 2', 'Kiểm tra tiến độ 2', 'All CLOs', '13.2'],
  ['59', 'Presentation', 'Thuyết trình', 'All CLOs', '13.3'],
  ['60', 'Presentation', 'Thuyết trình', 'All CLOs', '13.3'],
];
const BUOI = BUOI_A.concat(BUOI_B);

/** Dựng thân bảng 60 buổi. Cố tình không dùng template literal lồng. */
const hangBuoi = (viet) => BUOI.map((r) => '    <tr><td>' + r[0] + '</td><td>' + r[1] + '</td>'
  + (viet ? '<td>' + r[2] + '</td>' : '')
  + '<td>' + r[3] + '</td><td><strong>' + r[4] + '</strong></td></tr>').join('\n');

/* ════════════════════════════════════════════════════════════════════════════
 * THẺ SÁCH — 4 giáo trình FLM. Luật 20/09/2026: sách phải là THẺ BẤM ĐƯỢC,
 * không được viết link như chữ thường (xem _HOP-DONG-SOAN-BAI.md § SÁCH).
 * ⚠️ Sách chính KHÔNG gắn nhãn "mien-phi": link trỏ tới books24x7 — thư viện
 * TRẢ PHÍ, cần tài khoản. Ba cuốn còn lại không có link → the-sach khong-link.
 * ══════════════════════════════════════════════════════════════════════════ */
const SACH_CHINH = (en) => '<a class="the-sach chinh" href="https://library.books24x7.com/toc.aspx?bookid=32309" target="_blank" rel="noopener">'
  + '<span class="sach-ico">📗</span><span class="sach-than">'
  + '<span class="sach-ten">Electronic Circuits: Fundamentals and Applications</span>'
  + '<span class="sach-phu">Mike Tooley · Routledge · 2006 · 3rd ed · ISBN 9780750669238 — '
  + (en ? 'the link goes to books24x7, a PAID library: you need an account, it is not free reading'
       : 'link dẫn tới books24x7 — thư viện TRẢ PHÍ, phải có tài khoản mới đọc được, KHÔNG phải sách miễn phí') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">' + (en ? 'Main textbook' : 'Giáo trình chính') + '</span></span></span>'
  + '<span class="sach-nut">' + (en ? 'Open on books24x7 →' : 'Mở trên books24x7 →') + '</span></a>';
const SACH_TK1 = (en) => '<div class="the-sach khong-link">'
  + '<span class="sach-ico">📘</span><span class="sach-than">'
  + '<span class="sach-ten">Basic Electronics: Theory and Practice, Fourth Edition</span>'
  + '<span class="sach-phu">Sean Westcott and Jean Riescher Westcott · Mercury Learning · 2023 · 4th ed · ISBN 9781683929574 · '
  + (en ? 'reference 2 — no link on the syllabus' : 'reference 2 — syllabus không kèm link') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">' + (en ? 'Reference' : 'Tham khảo') + '</span>'
  + '<span class="sach-nhan giay">' + (en ? 'Print only' : 'Sách giấy') + '</span></span></span></div>';
const SACH_TK2 = (en) => '<div class="the-sach khong-link">'
  + '<span class="sach-ico">📙</span><span class="sach-than">'
  + '<span class="sach-ten">Electronic Circuits: Fundamentals and Applications (5th edition)</span>'
  + '<span class="sach-phu">Mike Tooley · Routledge · 2019 · 5th ed · ISBN 9780367421991 · '
  + (en ? 'reference 1 — the NEWER edition of the main book, yet only a reference' : 'reference 1 — bản MỚI HƠN của chính sách chính, nhưng chỉ là tham khảo') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">' + (en ? 'Reference' : 'Tham khảo') + '</span>'
  + '<span class="sach-nhan giay">' + (en ? 'Print only' : 'Sách giấy') + '</span></span></span></div>';
const SACH_TK3 = (en) => '<div class="the-sach khong-link">'
  + '<span class="sach-ico">📕</span><span class="sach-than">'
  + '<span class="sach-ten">Power Electronics Handbook: Devices, Circuits, and Applications, Third Edition</span>'
  + '<span class="sach-phu">Muhammad H. Rashid (ed) · Butterworth-Heinemann · 2011 · 3rd ed · ISBN 9780123820365 · '
  + (en ? 'reference 3 — no link on the syllabus' : 'reference 3 — syllabus không kèm link') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">' + (en ? 'Reference' : 'Tham khảo') + '</span>'
  + '<span class="sach-nhan giay">' + (en ? 'Print only' : 'Sách giấy') + '</span></span></span></div>';
const KHOI_SACH = (en) => '<div class="khoi-sach">\n' + SACH_CHINH(en) + '\n' + SACH_TK1(en) + '\n' + SACH_TK2(en) + '\n' + SACH_TK3(en) + '\n</div>';

/* ═══════════════ 📚 TRUNG TÂM TÀI LIỆU (web bổ sung) ═══════════════ */
const taiLieu = doc('eei101-0-0-tai-lieu', '📚 Resource hub: free electronics materials|||📚 Trung tâm tài liệu: nguồn học điện tử miễn phí',
  'Bốn giáo trình FLM dạng thẻ (sách chính nằm trong thư viện TRẢ PHÍ), ba công cụ mô phỏng miễn phí chạy trên trình duyệt trường chỉ định, cộng tài liệu tra cứu, video và lộ trình tự học do web gom thêm. Danh sách chính thức ở bài 0.4.',
  [[
    `<span class="eyebrow">EEI101 · Resource hub</span>
<h2>Everything you need for EEI101, in one page</h2>
<p class="lead">Start here. Read one warning first: <strong>the main textbook is NOT free</strong> — the syllabus link goes to a paid library. The three simulation tools, on the other hand, are free and run in a browser with nothing to install.</p>
${KHOI_SACH(true)}
<p class="nhan">${NGUON} — the four rows of the Materials table, verbatim. The official list with every field is in lesson 0.4.</p>
<div class="callout warn"><strong>Buy or borrow the RIGHT edition.</strong> The main material is the <strong>3rd edition (2006)</strong>. The 5th edition (2019), same title and same author, is listed only as "reference 1". Section numbers moved between editions, so if your lecturer says "section 8.5" and you are holding the 5th, you may be on the wrong page.</div>
<div class="note-ct">Everything below this line is added by CuongThai and is <strong>not</strong> part of the FLM syllabus. Use it to get better, not to replace what your lecturer asks for.</div>
<h3>The three simulators the syllabus names — all free, all in a browser</h3>
<ul>
<li><a href="https://www.multisim.com" target="_blank" rel="noopener">MultisimLive (multisim.com)</a> — SPICE simulation online; free account, no install. This is the one the syllabus names first.</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — a virtual breadboard with a real multimeter and an Arduino; the friendliest way to make your first measurement.</li>
<li><a href="https://www.tina.com/free-circuit-simulation/" target="_blank" rel="noopener">TINA Circuits Simulator</a> — the third tool on the list; TINACloud runs in a browser, the desktop version is a trial.</li>
</ul>
<div class="callout ok"><strong>You do not need Proteus, OrCAD or a heavy install for this course.</strong> Every Lab in the syllabus is served by the three tools above, and all three open in a browser tab. If a classmate tells you to install a 4 GB package, check the syllabus first.</div>
<h3>Free reading, when the paid library is not available</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/textbook/" target="_blank" rel="noopener">All About Circuits — the free online textbook</a>: DC, AC, semiconductors, digital. Covers most of chapters 1, 5, 6, 7 and 12 of your syllabus.</li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials</a> — short, diagram-heavy pages; good for resistors, capacitors, inductors, op-amps.</li>
<li><a href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/" target="_blank" rel="noopener">MIT OCW 6.002 — Circuits and Electronics</a> — full lecture notes and videos, free.</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — not on the syllabus, but it animates the current so you can <em>see</em> what a capacitor does.</li>
</ul>
<h3>Video, when reading is not enough</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — why circuits behave the way they do, memorably.</li>
<li><a href="https://www.youtube.com/@nesoacademy" target="_blank" rel="noopener">Neso Academy</a> — methodical lectures on circuits, electronic devices and digital logic, in the same order as this course.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Sessions 1–9</strong> — SI units, Ohm's law, circuit diagrams, the simulator, the multimeter and the oscilloscope. Chapter 1 here is complete; do its exercises.</li>
<li><strong>Sessions 10–24</strong> — Lab 1, passive components, D.C. and A.C. circuits, Lab 2. This is where the calculations get real.</li>
<li><strong>Sessions 25–34</strong> — semiconductors and power supplies, Assignment 1 (session 30), then Progress test 1 (session 34).</li>
<li><strong>Sessions 35–48</strong> — amplifiers, op-amps, Lab 3, oscillators and logic circuits.</li>
<li><strong>Sessions 49–60</strong> — sensors, Assignment 2, signal transmission, Lab 4, Progress test 2 and the group presentation.</li>
</ol></div>`,
    `<span class="eyebrow">EEI101 · Trung tâm tài liệu</span>
<h2>Mọi thứ cho EEI101, gom về một trang</h2>
<p class="lead">Bắt đầu ở đây. Đọc trước một cảnh báo: <strong>giáo trình chính KHÔNG miễn phí</strong> — link trong syllabus dẫn vào một thư viện trả phí. Ngược lại, ba công cụ mô phỏng đều miễn phí và chạy thẳng trên trình duyệt, không phải cài gì.</p>
${KHOI_SACH(false)}
<p class="nhan">${NGUON} — bốn dòng của bảng Materials, nguyên văn. Danh sách chính thức đủ từng trường ở bài 0.4.</p>
<div class="callout warn"><strong>Mua/mượn ĐÚNG BẢN.</strong> Giáo trình chính là <strong>bản 3rd (2006)</strong>. Bản 5th (2019) — cùng tên, cùng tác giả Mike Tooley — chỉ được xếp là "reference 1". Số mục giữa hai bản có xê dịch, nên nếu giảng viên nói "mục 8.5" mà bạn đang cầm bản 5th thì rất dễ mở sai trang.</div>
<div class="note-ct">Mọi thứ dưới vạch này do CuongThai thêm vào và <strong>không</strong> thuộc syllabus FLM. Dùng để giỏi hơn, không dùng thay cho thứ giảng viên yêu cầu.</div>
<h3>Ba công cụ mô phỏng trường chỉ định — đều miễn phí, đều chạy trên trình duyệt</h3>
<ul>
<li><a href="https://www.multisim.com" target="_blank" rel="noopener">MultisimLive (multisim.com)</a> — mô phỏng SPICE trực tuyến; tạo tài khoản miễn phí, không cần cài. Đây là công cụ syllabus nêu đầu tiên.</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — breadboard ảo có sẵn đồng hồ đo và Arduino; cách dễ nhất để thực hiện phép đo đầu tiên.</li>
<li><a href="https://www.tina.com/free-circuit-simulation/" target="_blank" rel="noopener">TINA Circuits Simulator</a> — công cụ thứ ba trong danh sách; TINACloud chạy trên trình duyệt, bản desktop là bản dùng thử.</li>
</ul>
<div class="callout ok"><strong>Môn này KHÔNG cần Proteus, OrCAD hay bất cứ bản cài nặng nào.</strong> Mọi bài Lab trong syllabus đều làm được bằng ba công cụ trên, và cả ba mở bằng một tab trình duyệt. Nếu có bạn bảo phải tải gói 4 GB, hãy mở syllabus ra kiểm lại trước.</div>
<h3>Nguồn đọc miễn phí, khi chưa vào được thư viện trả phí</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/textbook/" target="_blank" rel="noopener">All About Circuits — giáo trình online miễn phí</a>: DC, AC, bán dẫn, mạch số. Phủ phần lớn chương 1, 5, 6, 7 và 12 của syllabus.</li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials</a> — trang ngắn, nhiều hình; tốt cho điện trở, tụ, cuộn cảm, op-amp.</li>
<li><a href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/" target="_blank" rel="noopener">MIT OCW 6.002 — Circuits and Electronics</a> — đủ bài giảng và video, miễn phí.</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — không có trong syllabus, nhưng nó vẽ dòng điện chạy nên bạn <em>thấy</em> được tụ điện làm gì.</li>
</ul>
<h3>Video, khi đọc chưa đủ</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — giải thích vì sao mạch chạy như thế, kiểu khó quên.</li>
<li><a href="https://www.youtube.com/@nesoacademy" target="_blank" rel="noopener">Neso Academy</a> — bài giảng bài bản về mạch, linh kiện điện tử và logic số, đúng thứ tự môn này.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Buổi 1–9</strong> — đơn vị SI, định luật Ohm, sơ đồ mạch, phần mềm mô phỏng, đồng hồ vạn năng và dao động ký. Chương 1 trên web đã viết đầy đủ; hãy làm bài tập của nó.</li>
<li><strong>Buổi 10–24</strong> — Lab 1, linh kiện thụ động, mạch DC và AC, Lab 2. Đây là chỗ các phép tính bắt đầu thật.</li>
<li><strong>Buổi 25–34</strong> — bán dẫn và bộ nguồn, Assignment 1 (buổi 30), rồi Progress test 1 (buổi 34).</li>
<li><strong>Buổi 35–48</strong> — khuếch đại, op-amp, Lab 3, mạch dao động và mạch logic.</li>
<li><strong>Buổi 49–60</strong> — cảm biến, Assignment 2, truyền tín hiệu, Lab 4, Progress test 2 và thuyết trình nhóm.</li>
</ol></div>`,
  ]]);

/* ════════════════════════════════════════════════════════════════════════════
 * MỤC 0 — KHUNG MÔN HỌC THEO SYLLABUS FLM 14452 (phải đúng từng con số)
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── 0.1 Hồ sơ môn (slug cũ: eei101-0-1-overview) ─────────────────────────── */
const l01 = { ...doc('eei101-0-1-overview',
  '0.1 — Course profile: EEI101 on the FLM syllabus|||0.1 — Hồ sơ môn học: EEI101 trên syllabus FLM',
  'Mã môn, 3 tín chỉ, bậc Bachelor, thang điểm 10, phân bổ 150h = 45h lên lớp + 1h thi + 104h tự học, ô tiên quyết ghi "Non", phương pháp dạy-học, công cụ, số quyết định 1028/QĐ-ĐHFPT và link FLM sylID 14452 để tự kiểm chứng.',
  [[
    `<span class="eyebrow">EEI101 · Section 0 · Lesson 0.1</span>
<h2>Course profile — straight from the FLM syllabus</h2>
<p class="lead">This page is the part of the course you can check line by line against the paper your university hands you. Every number below is copied from FLM syllabus 14452; nothing here is our interpretation.</p>
<p class="nhan">${NGUON}</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Subject code</span><span class="v">EEI101</span></div>
  <div class="kv"><span class="k">Syllabus name</span><span class="v">Introduction to Electrical-Electronics Engineering_Nhập môn kỹ thuật điện - điện tử</span></div>
  <div class="kv"><span class="k">Course name (English)</span><span class="v">Introduction to Electrical-Electronics Engineering</span></div>
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Degree level</span><span class="v">Bachelor</span></div>
  <div class="kv"><span class="k">Scoring scale</span><span class="v">10</span></div>
  <div class="kv"><span class="k">Min average mark to pass</span><span class="v">5</span></div>
  <div class="kv"><span class="k">Is scored</span><span class="v">True</span></div>
  <div class="kv"><span class="k">Pre-Requisite</span><span class="v">"Non" — printed exactly like that on FLM</span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60</span></div>
  <div class="kv"><span class="k">Time allocation</span><span class="v">Study hour (150h) = 45h contact hours + 1h final exam + 104h self-study</span></div>
  <div class="kv"><span class="k">Tools</span><span class="v">MultisimLive · Tinkercad.com · Tina Circuits Simulator</span></div>
  <div class="kv"><span class="k">Decision No.</span><span class="v">1028/QĐ-ĐHFPT dated 08/21/2026</span></div>
  <div class="kv"><span class="k">Approved</span><span class="v">8/21/2026 · IsApproved: True · IsActive: True</span></div>
  <div class="kv"><span class="k">Syllabus ID</span><span class="v">14452</span></div>
  <div class="kv"><span class="k">Verify it yourself</span><span class="v"><a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=14452" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=14452</a></span></div>
</div>
<h3>What the syllabus says the course is</h3>
<p>The Description field, quoted in full:</p>
<ul>
<li>"The module provides general knowledge of circuit theory, and introduces basic components of electrical circuits, oscillators, amplifiers, wireless and wired signal transmitters, and power electronic devices, etc."</li>
</ul>
<p>Every item in that sentence is a chapter of the 60-session plan: circuit theory (chapters 1, 5, 6), basic components (chapter 4), oscillators (chapter 11), amplifiers (chapters 9, 10), wireless and wired transmitters (chapter 14), power electronics (chapter 8).</p>
<h3>Where the 150 hours go</h3>
<p>Time Allocation, verbatim: <em>Study hour (150h) = 45h contact hours + 1h final exam + 104h self-study.</em></p>
<table>
  <thead><tr><th>Block</th><th>Hours</th><th>Share</th></tr></thead>
  <tbody>
    <tr><td>Contact hours (60 sessions)</td><td>45</td><td>30%</td></tr>
    <tr><td>Self-study</td><td>104</td><td>69.3%</td></tr>
    <tr><td>Final exam</td><td>1</td><td>0.7%</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>
  </tbody>
</table>
<div class="note-ct">Two arithmetic checks <strong>we</strong> did on those figures (not statements from FLM): 45 + 1 + 104 = <strong>150h exactly</strong>, so the reading above is the right one; and 45 contact hours across 60 sessions is <strong>45 minutes of class per session</strong>. That is why <strong>104 self-study hours</strong> is by far the biggest block — the syllabus expects about <strong>2.3 hours at home for every hour in class</strong>. Note also what is <em>not</em> in the list: there is no separate practical-exam block, so the four Labs and two Assignments are paid for out of your own 104 hours.</div>
<h3>How it is taught</h3>
<p>Learning-Teaching Method, verbatim: <em>In-class lecture, Active Learning, Inquiry-Based Learning, Problem Based Learning.</em> Three of those four names mean the same thing in practice: you will be handed a problem or a question <em>before</em> the answer. Coming to class having read the session's sections is not optional decoration in a course taught this way.</p>
<div class="callout warn"><strong>The Pre-Requisite field says "Non".</strong> Not "None" — "Non", missing the final "e". That is what is printed on FLM and we copy it exactly rather than silently correcting the university's page. Read together with the field's obvious intent, it means there is no prerequisite subject; EEI101 is a first-semester course. If your lecturer or an academic adviser tells you otherwise, <strong>FLM and your adviser win, not this page</strong>.</div>
<h3>What to read next</h3>
<ul>
<li><strong>0.2</strong> — the five marks that make your grade, and the two parallel options hidden in every on-going mark.</li>
<li><strong>0.3</strong> — the eight learning outcomes (CLOs), which the exams are written against.</li>
<li><strong>0.4</strong> — the four materials and the three simulators. Read this before you buy a book.</li>
<li><strong>0.5</strong> — all 60 sessions, in the university's own order.</li>
<li><strong>0.6</strong> — the three student duties, including the 80% attendance rule.</li>
</ul>`,
    `<span class="eyebrow">EEI101 · Mục 0 · Bài 0.1</span>
<h2>Hồ sơ môn học — lấy thẳng từ syllabus FLM</h2>
<p class="lead">Đây là phần bạn đối chiếu được từng dòng với bản syllabus trường phát. Mọi con số dưới đây chép từ syllabus FLM 14452; không chỗ nào là suy diễn của web.</p>
<p class="nhan">${NGUON}</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Mã môn</span><span class="v">EEI101</span></div>
  <div class="kv"><span class="k">Tên syllabus</span><span class="v">Introduction to Electrical-Electronics Engineering_Nhập môn kỹ thuật điện - điện tử</span></div>
  <div class="kv"><span class="k">Tên tiếng Anh</span><span class="v">Introduction to Electrical-Electronics Engineering</span></div>
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Bậc</span><span class="v">Bachelor (đại học)</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10</span></div>
  <div class="kv"><span class="k">Điểm TB tối thiểu để qua</span><span class="v">5</span></div>
  <div class="kv"><span class="k">Có tính điểm</span><span class="v">True</span></div>
  <div class="kv"><span class="k">Môn tiên quyết</span><span class="v">"Non" — bản gốc FLM in đúng như vậy</span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60</span></div>
  <div class="kv"><span class="k">Phân bổ thời gian</span><span class="v">Study hour (150h) = 45h contact hours + 1h final exam + 104h self-study</span></div>
  <div class="kv"><span class="k">Công cụ</span><span class="v">MultisimLive · Tinkercad.com · Tina Circuits Simulator</span></div>
  <div class="kv"><span class="k">Số quyết định</span><span class="v">1028/QĐ-ĐHFPT ngày 21/08/2026</span></div>
  <div class="kv"><span class="k">Phê duyệt</span><span class="v">21/08/2026 · IsApproved: True · IsActive: True</span></div>
  <div class="kv"><span class="k">Syllabus ID</span><span class="v">14452</span></div>
  <div class="kv"><span class="k">Tự kiểm chứng</span><span class="v"><a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=14452" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=14452</a></span></div>
</div>
<h3>Trường mô tả môn này là gì</h3>
<p>Ô Description, trích nguyên văn rồi dịch:</p>
<ul>
<li>"The module provides general knowledge of circuit theory, and introduces basic components of electrical circuits, oscillators, amplifiers, wireless and wired signal transmitters, and power electronic devices, etc." — <em>Môn học cung cấp kiến thức chung về lý thuyết mạch, và giới thiệu các linh kiện cơ bản của mạch điện, mạch dao động, mạch khuếch đại, bộ phát tín hiệu không dây và có dây, cùng các linh kiện điện tử công suất, v.v.</em></li>
</ul>
<p>Từng thứ trong câu đó là một chương của kế hoạch 60 buổi: lý thuyết mạch (chương 1, 5, 6), linh kiện cơ bản (chương 4), mạch dao động (chương 11), mạch khuếch đại (chương 9, 10), truyền tín hiệu không dây/có dây (chương 14), điện tử công suất (chương 8).</p>
<h3>150 giờ đi đâu</h3>
<p>Ô Time Allocation, nguyên văn: <em>Study hour (150h) = 45h contact hours + 1h final exam + 104h self-study.</em></p>
<table>
  <thead><tr><th>Khối thời gian</th><th>Số giờ</th><th>Tỷ lệ</th></tr></thead>
  <tbody>
    <tr><td>Giờ lên lớp (60 buổi)</td><td>45</td><td>30%</td></tr>
    <tr><td>Tự học</td><td>104</td><td>69,3%</td></tr>
    <tr><td>Thi cuối kỳ</td><td>1</td><td>0,7%</td></tr>
    <tr><td><strong>Tổng</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>
  </tbody>
</table>
<div class="note-ct">Hai phép kiểm số học <strong>do web tự làm</strong> (không phải câu của FLM): 45 + 1 + 104 = <strong>đúng 150h</strong>, nên cách đọc trên là đúng; và 45 giờ lên lớp chia 60 buổi ra <strong>45 phút lớp mỗi buổi</strong>. Vì thế <strong>104 giờ tự học</strong> mới là khối lớn nhất — syllabus trông đợi bạn học ở nhà khoảng <strong>2,3 giờ cho mỗi giờ ở lớp</strong>. Còn một điều đáng chú ý là thứ KHÔNG có trong danh sách: không có khối giờ riêng cho thi thực hành, nên bốn bài Lab và hai Assignment đều tiêu vào chính 104 giờ tự học của bạn.</div>
<h3>Trường dạy môn này theo cách nào</h3>
<p>Ô Learning-Teaching Method, nguyên văn: <em>In-class lecture, Active Learning, Inquiry-Based Learning, Problem Based Learning.</em> Ba trong bốn tên đó trên thực tế nói cùng một điều: bạn sẽ được đưa một bài toán hoặc một câu hỏi <em>trước</em> khi được nghe đáp án. Trong một môn dạy theo lối này, việc đọc trước các mục của buổi không phải là "cho đẹp" — không đọc là ngồi ngoài buổi học.</p>
<div class="callout warn"><strong>Ô Pre-Requisite ghi "Non".</strong> Không phải "None" — mà là "Non", thiếu chữ "e" ở cuối. Đó là đúng những gì in trên FLM và web chép lại nguyên văn thay vì âm thầm "sửa hộ" trang của trường. Đọc theo dụng ý rõ ràng của ô này thì nghĩa là môn không có môn tiên quyết; EEI101 là môn kỳ 1. Nếu giảng viên hoặc cố vấn học tập nói khác, <strong>FLM và cố vấn đúng, không phải trang này</strong>.</div>
<h3>Đọc tiếp gì</h3>
<ul>
<li><strong>0.2</strong> — năm đầu điểm làm nên điểm môn, và hai phương án song song nằm ẩn trong mọi đầu điểm on-going.</li>
<li><strong>0.3</strong> — tám chuẩn đầu ra (CLO); đề thi viết theo CLO, không theo bài giảng.</li>
<li><strong>0.4</strong> — bốn giáo trình và ba công cụ mô phỏng. Đọc bài này TRƯỚC khi mua sách.</li>
<li><strong>0.5</strong> — đủ 60 buổi, theo đúng thứ tự của trường.</li>
<li><strong>0.6</strong> — ba nhiệm vụ của sinh viên, gồm quy định dự ≥80% số buổi.</li>
</ul>`,
  ]]), isFreePreview: true };

/* ── 0.2 Cách tính điểm ───────────────────────────────────────────────────── */
const l02 = doc('eei101-0-2-danh-gia',
  '0.2 — Grading: five marks, 20+10+20+10+40 = 100%|||0.2 — Cách tính điểm: năm đầu điểm, 20+10+20+10+40 = 100%',
  'Bảng 5 đầu điểm FLM đủ trọng số, tiêu chí đạt, thời lượng, CLO, số câu; tổng đúng 100%; hai phương án song song Option 1 / Option 2 của mọi đầu điểm on-going; thi cuối kỳ 60 phút 50 câu tiêu chí 4; ví dụ tính điểm.',
  [[
    `<span class="eyebrow">EEI101 · Section 0 · Lesson 0.2</span>
<h2>Your grade, mark by mark</h2>
<p class="lead">Five marks, five weights, and they add up to exactly 100%. Read this before session 2 — <strong>60% of your grade is decided before the final exam</strong>, and the <em>format</em> of that 60% depends on your lecturer.</p>
<p class="nhan">${NGUON} — Assessments table, verbatim</p>
<table>
  <thead><tr><th>Mark</th><th>Category</th><th>Parts</th><th>Weight</th><th>Completion criteria</th><th>Duration</th><th>CLOs</th><th>No. of questions</th></tr></thead>
  <tbody>
    <tr><td><strong>Assignment</strong></td><td>on-going</td><td><strong>2</strong></td><td><strong>20.0%</strong></td><td>&gt; 0</td><td>Option 1: At home. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td><td>AS1: CLO1-7; AS2: CLO1-2, CLO5-7. Number of questions: 1-2 for each CLOx</td><td>2 - 3</td></tr>
    <tr><td><strong>Group presentation</strong></td><td>on-going</td><td>1</td><td><strong>10.0%</strong></td><td>&gt; 0</td><td>~15'/group</td><td>All CLOs</td><td>Option 1: N/A. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td></tr>
    <tr><td><strong>Lab</strong></td><td>on-going</td><td><strong>4</strong></td><td><strong>20.0%</strong></td><td>&gt; 0</td><td>Option 1: In LAB. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td><td>All CLOs</td><td>Option 1: N/A. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td></tr>
    <tr><td><strong>Progress tests</strong></td><td>on-going</td><td><strong>2</strong></td><td><strong>10.0%</strong></td><td>&gt; 0</td><td>Option 1: 20'/each. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td><td>PT1: All CLOs; PT2: All CLOs. Number of questions: 3-8 for each CLOx</td><td>20 - 30</td></tr>
    <tr><td><strong>Final exam</strong></td><td><strong>Final exam</strong></td><td>1</td><td><strong>40.0%</strong></td><td><strong>4</strong></td><td>60'</td><td>All CLOs</td><td><strong>50</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>The weights add up to exactly 100%</strong> — 20 + 10 + 20 + 10 + 40 = 100. There is no hidden sixth mark and nothing is rounded.</div>
<div class="callout danger"><strong>Every on-going mark has TWO parallel options, and the syllabus does not choose for you.</strong> Each of the four on-going rows prints the same pair:<br>
<strong>Option 1</strong> — the normal arrangement (Assignment at home · Lab in the LAB · Progress test 20 minutes each).<br>
<strong>Option 2 (For Constructivism Approach only): Follow lecturer's proposal.</strong><br>
So the <em>format</em> of 60% of your grade — where you do it, how long it takes, how many questions — is set by <strong>your class and your lecturer</strong>, not by this table. Ask in session 1 and write the answer down. Anyone who tells you "the Lab is definitely in the lab room" is reading only half the cell.</div>
<h3>What each row actually is</h3>
<ul>
<li><strong>Assignment — 20%, TWO parts.</strong> FLM schedules them as whole sessions: <strong>Assignment 1 at session 30</strong> and <strong>Assignment 2 at session 51</strong>. Their CLO coverage differs: AS1 covers CLO1–7, AS2 covers only CLO1–2 and CLO5–7. Questions: "1-2 for each CLOx", total 2–3. Split evenly that is <strong>10% per assignment</strong>.</li>
<li><strong>Group presentation — 10%, one part, about 15 minutes per group, All CLOs.</strong> Sessions 59–60 are the presentation slots, and session 6 is "Introduction to presentation". Number of questions: Option 1 says <em>N/A</em>.</li>
<li><strong>Lab — 20%, FOUR parts, All CLOs.</strong> FLM gives each Lab three consecutive sessions: Lab 1 (10–12), Lab 2 (22–24), Lab 3 (40–42), Lab 4 (55–57). Twelve of the 60 sessions are Lab work. Split evenly that is <strong>5% per Lab</strong>.</li>
<li><strong>Progress tests — 10%, two parts, 20 minutes each under Option 1, 20–30 questions each.</strong> PT1 at session 34, PT2 at session 58. Questions: "3-8 for each CLOx".</li>
<li><strong>Final exam — 40%, 60 minutes, 50 questions</strong>, All CLOs. Note its completion criteria is <strong>4</strong>, not "&gt; 0" like the other four: score below 4 on this paper and the course is not passed whatever the other marks say.</li>
</ul>
<h3>Passing</h3>
<p>Scoring scale <strong>10</strong>; minimum average mark to pass <strong>5</strong>. Attendance, verbatim from StudentTasks: <em>"Students must attend at least 80% of contact slots in order to be accepted to the final examination."</em> With 60 sessions, 80% means you may miss <strong>at most 12</strong>.</p>
<div class="out">Weighted example (our arithmetic, not a university rule):<br>Assignment 8 × 20% = 1.60<br>Group presentation 9 × 10% = 0.90<br>Lab 7 × 20% = 1.40<br>Progress tests 6 × 10% = 0.60<br>Final exam 5 × 40% = 2.00<br><b>Average = 6.50 → above 5, and the final exam mark 5 is above the criteria of 4 → passed</b></div>
<div class="callout warn"><strong>Two numbers to keep in your head: 60% and 4.</strong> Assignment 20 + Group presentation 10 + Lab 20 + Progress tests 10 = <strong>60%</strong> is earned <em>during</em> the semester, half of it in Lab and Assignment work you hand in. And the final exam carries a hard floor of <strong>4</strong>: 50 questions in 60 minutes is <strong>72 seconds per question</strong>, so it rewards reflexes — knowing that Xc falls when frequency rises, that a silicon diode drops about 0.7 V — not page-turning.</div>
<div class="note-ct"><strong>What the syllabus does NOT say</strong>, so we will not guess: what happens when an on-going mark falls below its "&gt; 0" criteria; which topics each Lab covers; whether the Progress tests are multiple-choice (the table gives a question count, never a question type); how the group presentation is marked or how groups are formed; and, for every Option 2 class, essentially all of the above. Ask your lecturer in session 1 — and ask specifically <em>"are we on Option 1 or Option 2?"</em>, because that single answer changes four rows of this table.</div>`,
    `<span class="eyebrow">EEI101 · Mục 0 · Bài 0.2</span>
<h2>Điểm môn của bạn, từng đầu điểm một</h2>
<p class="lead">Năm đầu điểm, năm trọng số, cộng lại đúng 100%. Đọc bài này trước buổi 2 — <strong>60% điểm môn đã chốt trước kỳ thi cuối</strong>, và <em>hình thức</em> của 60% đó phụ thuộc vào giảng viên của bạn.</p>
<p class="nhan">${NGUON} — bảng Assessments, nguyên văn</p>
<table>
  <thead><tr><th>Đầu điểm</th><th>Loại</th><th>Số phần</th><th>Trọng số</th><th>Tiêu chí đạt</th><th>Thời lượng / nơi làm</th><th>CLO</th><th>Số câu</th></tr></thead>
  <tbody>
    <tr><td><strong>Assignment</strong> (bài tập lớn)</td><td>on-going</td><td><strong>2</strong></td><td><strong>20,0%</strong></td><td>&gt; 0</td><td>Option 1: At home (làm ở nhà). Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td><td>AS1: CLO1-7; AS2: CLO1-2, CLO5-7. Số câu: 1-2 cho mỗi CLOx</td><td>2 - 3</td></tr>
    <tr><td><strong>Group presentation</strong> (thuyết trình nhóm)</td><td>on-going</td><td>1</td><td><strong>10,0%</strong></td><td>&gt; 0</td><td>~15 phút/nhóm</td><td>All CLOs</td><td>Option 1: N/A. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td></tr>
    <tr><td><strong>Lab</strong> (thực hành)</td><td>on-going</td><td><strong>4</strong></td><td><strong>20,0%</strong></td><td>&gt; 0</td><td>Option 1: In LAB (làm tại phòng LAB). Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td><td>All CLOs</td><td>Option 1: N/A. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td></tr>
    <tr><td><strong>Progress tests</strong> (kiểm tra tiến độ)</td><td>on-going</td><td><strong>2</strong></td><td><strong>10,0%</strong></td><td>&gt; 0</td><td>Option 1: 20 phút/bài. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td><td>PT1: All CLOs; PT2: All CLOs. Số câu: 3-8 cho mỗi CLOx</td><td>20 - 30</td></tr>
    <tr><td><strong>Final exam</strong> (thi cuối kỳ)</td><td><strong>Final exam</strong></td><td>1</td><td><strong>40,0%</strong></td><td><strong>4</strong></td><td>60 phút</td><td>All CLOs</td><td><strong>50</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Trọng số cộng lại đúng 100%</strong> — 20 + 10 + 20 + 10 + 40 = 100. Không có đầu điểm thứ sáu ẩn đâu đó và không có chỗ nào phải làm tròn.</div>
<div class="callout danger"><strong>Mọi đầu điểm on-going đều có HAI phương án song song, và syllabus KHÔNG chọn sẵn cho bạn.</strong> Cả bốn dòng on-going đều in cùng một cặp:<br>
<strong>Option 1</strong> — cách thường (Assignment làm ở nhà · Lab làm tại phòng LAB · Progress test 20 phút mỗi bài).<br>
<strong>Option 2 (For Constructivism Approach only): Follow lecturer's proposal</strong> — tức "theo phương án của giảng viên".<br>
Nghĩa là <em>hình thức</em> của 60% điểm môn — làm ở đâu, trong bao lâu, mấy câu — do <strong>lớp và giảng viên của bạn</strong> quyết, không phải do bảng này. Hãy hỏi ngay buổi 1 và ghi lại câu trả lời. Ai nói chắc "Lab kiểu gì cũng làm ở phòng lab" là mới đọc một nửa ô đó.</div>
<h3>Từng dòng thực chất là gì</h3>
<ul>
<li><strong>Assignment — 20%, HAI bài.</strong> FLM xếp hẳn buổi riêng: <strong>Assignment 1 ở buổi 30</strong> và <strong>Assignment 2 ở buổi 51</strong>. Phạm vi CLO của hai bài KHÁC nhau: AS1 phủ CLO1–7, AS2 chỉ phủ CLO1–2 và CLO5–7. Số câu: "1-2 cho mỗi CLOx", tổng 2–3. Chia đều là <strong>10% mỗi bài</strong>.</li>
<li><strong>Group presentation — 10%, một lượt, khoảng 15 phút/nhóm, All CLOs.</strong> Buổi 59–60 là hai buổi thuyết trình, và buổi 6 là "Introduction to presentation". Số câu: Option 1 ghi <em>N/A</em> (không áp dụng).</li>
<li><strong>Lab — 20%, BỐN bài, All CLOs.</strong> FLM dành cho mỗi Lab ba buổi liền: Lab 1 (10–12), Lab 2 (22–24), Lab 3 (40–42), Lab 4 (55–57). Tức <strong>12 trong 60 buổi</strong> là giờ Lab. Chia đều là <strong>5% mỗi bài Lab</strong>.</li>
<li><strong>Progress tests — 10%, hai bài, theo Option 1 là 20 phút mỗi bài, 20–30 câu mỗi bài.</strong> PT1 ở buổi 34, PT2 ở buổi 58. Số câu: "3-8 cho mỗi CLOx".</li>
<li><strong>Final exam — 40%, 60 phút, 50 câu</strong>, phủ All CLOs. Chú ý tiêu chí đạt của nó là <strong>4</strong>, không phải "&gt; 0" như bốn đầu điểm kia: dưới 4 ở bài này là không qua môn, bất kể các đầu điểm khác đẹp tới đâu.</li>
</ul>
<h3>Điều kiện qua môn</h3>
<p>Thang điểm <strong>10</strong>; điểm trung bình tối thiểu để qua môn là <strong>5</strong>. Điểm danh, nguyên văn ô StudentTasks: <em>"Students must attend at least 80% of contact slots in order to be accepted to the final examination."</em> — dự ít nhất 80% số buổi mới được vào thi cuối kỳ. Với 60 buổi, 80% nghĩa là vắng <strong>tối đa 12 buổi</strong>.</p>
<div class="out">Ví dụ tính điểm (số học của web, không phải quy định của trường):<br>Assignment 8 × 20% = 1,60<br>Group presentation 9 × 10% = 0,90<br>Lab 7 × 20% = 1,40<br>Progress tests 6 × 10% = 0,60<br>Final exam 5 × 40% = 2,00<br><b>Điểm trung bình = 6,50 → trên 5, và điểm thi cuối 5 đã trên tiêu chí 4 → qua môn</b></div>
<div class="callout warn"><strong>Hai con số nên nhớ: 60% và 4.</strong> Assignment 20 + Thuyết trình 10 + Lab 20 + Progress tests 10 = <strong>60%</strong> kiếm được <em>trong</em> học kỳ, một nửa trong đó là bài Lab và Assignment bạn nộp. Còn thi cuối kỳ có một sàn cứng là <strong>4</strong>: 50 câu trong 60 phút tức <strong>72 giây một câu</strong>, nên nó chấm phản xạ — biết ngay Xc giảm khi tần số tăng, diode silic sụt khoảng 0,7 V — chứ không chấm việc lật vở.</div>
<div class="note-ct"><strong>Những chỗ syllabus KHÔNG nói</strong> nên web không đoán: một đầu điểm on-going dưới tiêu chí "&gt; 0" thì xử lý thế nào; mỗi bài Lab làm về chủ đề gì; Progress tests có phải trắc nghiệm không (bảng chỉ cho số câu, không hề cho dạng đề); thuyết trình nhóm chấm theo tiêu chí nào và chia nhóm ra sao; và với lớp đi theo Option 2 thì gần như tất cả những điều trên. Hãy hỏi giảng viên ngay buổi 1 — và hỏi đúng câu <em>"lớp mình theo Option 1 hay Option 2?"</em>, vì chỉ một câu trả lời đó làm đổi bốn dòng của bảng này.</div>`,
  ]]);

/* ── 0.3 Tám CLO ──────────────────────────────────────────────────────────── */
const l03 = doc('eei101-0-3-clo',
  '0.3 — The eight CLOs, verbatim + where each is taught|||0.3 — Tám chuẩn đầu ra (CLO), nguyên văn + học ở buổi nào',
  'Tám CLO nguyên văn tiếng Anh kèm dịch, ánh xạ CLO ↔ buổi ↔ chương trên web, CLO ↔ đầu điểm; nêu rõ buổi 6 không có CLO nào, buổi 52–54 bản gốc in "CL01", và CLO8 không có buổi riêng nào.',
  [[
    `<span class="eyebrow">EEI101 · Section 0 · Lesson 0.3</span>
<h2>The eight course learning outcomes</h2>
<p class="lead">Exams are written against these eight sentences, not against a lecture. The final exam and three of the four on-going marks are tagged <strong>All CLOs</strong>, so there is no outcome you can skip.</p>
<p class="nhan">${NGUON} — CLO table, verbatim</p>
<table>
  <thead><tr><th>CLO</th><th>Verbatim (FLM)</th><th>Translation</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>Understand the basic theoretical principles necessary to comprehend the operation of electronic circuits.</td><td>Hiểu các nguyên lý lý thuyết cơ bản cần thiết để nắm được hoạt động của mạch điện tử.</td></tr>
    <tr><td><strong>CLO2</strong></td><td>Identify and apply passive and active electronic components within circuits.</td><td>Nhận biết và sử dụng được linh kiện điện tử thụ động và chủ động trong mạch.</td></tr>
    <tr><td><strong>CLO3</strong></td><td>Analyze electrical circuits and calculate key parameters.</td><td>Phân tích mạch điện và tính được các tham số chính.</td></tr>
    <tr><td><strong>CLO4</strong></td><td>Understand the technological principles related to semiconductor manufacturing.</td><td>Hiểu các nguyên lý công nghệ liên quan tới chế tạo bán dẫn.</td></tr>
    <tr><td><strong>CLO5</strong></td><td>Develop, design, and create simple analog and digital circuits.</td><td>Phát triển, thiết kế và tạo ra được các mạch tương tự và mạch số đơn giản.</td></tr>
    <tr><td><strong>CLO6</strong></td><td>Use simulation software to design, test, and optimize basic electronic circuits.</td><td>Dùng phần mềm mô phỏng để thiết kế, kiểm thử và tối ưu mạch điện tử cơ bản.</td></tr>
    <tr><td><strong>CLO7</strong></td><td>Measure the characteristics of electronic circuits and effectively present experimental results.</td><td>Đo các đặc tính của mạch điện tử và trình bày kết quả thực nghiệm một cách hiệu quả.</td></tr>
    <tr><td><strong>CLO8</strong></td><td>Be able to develop necessary soft skills, including learning attitude, teamwork, communication and problem solving.</td><td>Phát triển được các kỹ năng mềm cần thiết: thái độ học tập, làm việc nhóm, giao tiếp và giải quyết vấn đề.</td></tr>
  </tbody>
</table>
<h3>CLO → FLM sessions → chapter on this site</h3>
<table>
  <thead><tr><th>CLO</th><th>Sessions where FLM names it explicitly</th><th>Chapter here</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>1, 2, 3 · 52, 53, 54</td><td>Chapter 1 (1.1–1.3) · Chapter 12</td></tr>
    <tr><td>CLO2</td><td>13, 14, 15 · 25, 26 · 27–29, 31–33 · 37, 38, 39 · 49, 50</td><td>Chapters 2, 5, 6, 8, 11</td></tr>
    <tr><td>CLO3</td><td>16, 17, 18 · 19, 20, 21</td><td>Chapter 3</td></tr>
    <tr><td>CLO4</td><td>25, 26</td><td>Chapter 5</td></tr>
    <tr><td>CLO5</td><td>27–29, 31–33 · 35, 36 · 37, 38, 39 · 43, 44, 45 · 46, 47, 48</td><td>Chapters 6, 8, 10</td></tr>
    <tr><td>CLO6</td><td>4, 5 · 51</td><td>Chapter 1 (1.4–1.5) · Chapter 11 (11.3)</td></tr>
    <tr><td>CLO7</td><td>7, 8, 9</td><td>Chapter 1 (1.7–1.9)</td></tr>
    <tr><td><strong>CLO8</strong></td><td><strong>no session names it on its own</strong> — it is reached only through the "All CLOs" sessions: Labs (10–12, 22–24, 40–42, 55–57), Assignments (30, 51), Progress tests (34, 58) and the presentations (59, 60)</td><td>Chapters 2, 4, 7, 9, 13</td></tr>
  </tbody>
</table>
<h3>CLO → which mark tests it</h3>
<table>
  <thead><tr><th>Mark</th><th>Weight</th><th>CLOs covered (FLM, verbatim)</th></tr></thead>
  <tbody>
    <tr><td>Assignment (2 parts)</td><td>20%</td><td>AS1: CLO1-7 · AS2: CLO1-2, CLO5-7</td></tr>
    <tr><td>Group presentation</td><td>10%</td><td>All CLOs</td></tr>
    <tr><td>Lab (4 parts)</td><td>20%</td><td>All CLOs</td></tr>
    <tr><td>Progress tests (2 parts)</td><td>10%</td><td>PT1: All CLOs · PT2: All CLOs</td></tr>
    <tr><td>Final exam</td><td>40%</td><td>All CLOs</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Three oddities in the original tables — know them so you are not confused in class.</strong><br>
<strong>1. Session 6 has NO CLO at all.</strong> "Introduction to presentation" has an empty CLO cell. The university publishes nothing there, so we assign nothing. Reading the paper, session 6 clearly serves the Group presentation and CLO8, but that is a <em>reading</em>, not a published fact.<br>
<strong>2. Sessions 52–54 print "CL01" — with a digit zero, not the letter O.</strong> Every other session writes "CLO1". It is a typing slip on FLM's page; we write CLO1 in our tables and tell you here rather than silently correcting the university's paper.<br>
<strong>3. CLO8 — the soft-skills outcome — has no dedicated session.</strong> It is never named in the session plan, yet the Group presentation (10%), all four Labs (20%) and both Progress tests (10%) are tagged "All CLOs", which includes it. So 60% of the grade formally covers an outcome that is taught in no single lecture. In practice you earn CLO8 by turning up prepared, working in your Lab group and presenting clearly — not by revising a chapter.</div>
<div class="note-ct"><strong>Reading the table honestly</strong> (our note): because the final exam, the presentation, the Labs and both Progress tests all say "All CLOs", the syllabus does <em>not</em> tell you that Progress test 1 at session 34 covers only sessions 1–33. The session plan implies it, the assessment table does not restrict it, and the question spec ("3-8 questions for each CLOx") points at wide coverage. Prepare to be examined on everything taught so far, and confirm the scope with your lecturer before each test.</div>`,
    `<span class="eyebrow">EEI101 · Mục 0 · Bài 0.3</span>
<h2>Tám chuẩn đầu ra của môn</h2>
<p class="lead">Đề thi được viết theo tám câu này, không theo bài giảng. Thi cuối kỳ và ba trong bốn đầu điểm on-going đều gắn <strong>All CLOs</strong>, nên không có chuẩn đầu ra nào bỏ qua được.</p>
<p class="nhan">${NGUON} — bảng CLO, nguyên văn</p>
<table>
  <thead><tr><th>CLO</th><th>Nguyên văn (FLM)</th><th>Dịch</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>Understand the basic theoretical principles necessary to comprehend the operation of electronic circuits.</td><td>Hiểu các nguyên lý lý thuyết cơ bản cần thiết để nắm được hoạt động của mạch điện tử.</td></tr>
    <tr><td><strong>CLO2</strong></td><td>Identify and apply passive and active electronic components within circuits.</td><td>Nhận biết và sử dụng được linh kiện điện tử thụ động và chủ động trong mạch.</td></tr>
    <tr><td><strong>CLO3</strong></td><td>Analyze electrical circuits and calculate key parameters.</td><td>Phân tích mạch điện và tính được các tham số chính.</td></tr>
    <tr><td><strong>CLO4</strong></td><td>Understand the technological principles related to semiconductor manufacturing.</td><td>Hiểu các nguyên lý công nghệ liên quan tới chế tạo bán dẫn.</td></tr>
    <tr><td><strong>CLO5</strong></td><td>Develop, design, and create simple analog and digital circuits.</td><td>Phát triển, thiết kế và tạo ra được các mạch tương tự và mạch số đơn giản.</td></tr>
    <tr><td><strong>CLO6</strong></td><td>Use simulation software to design, test, and optimize basic electronic circuits.</td><td>Dùng phần mềm mô phỏng để thiết kế, kiểm thử và tối ưu mạch điện tử cơ bản.</td></tr>
    <tr><td><strong>CLO7</strong></td><td>Measure the characteristics of electronic circuits and effectively present experimental results.</td><td>Đo các đặc tính của mạch điện tử và trình bày kết quả thực nghiệm một cách hiệu quả.</td></tr>
    <tr><td><strong>CLO8</strong></td><td>Be able to develop necessary soft skills, including learning attitude, teamwork, communication and problem solving.</td><td>Phát triển được các kỹ năng mềm cần thiết: thái độ học tập, làm việc nhóm, giao tiếp và giải quyết vấn đề.</td></tr>
  </tbody>
</table>
<h3>CLO → buổi học theo FLM → chương trên web</h3>
<table>
  <thead><tr><th>CLO</th><th>Buổi mà FLM gọi tên nó rõ ràng</th><th>Chương trên web</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>1, 2, 3 · 52, 53, 54</td><td>Chương 1 (bài 1.1–1.3) · Chương 12</td></tr>
    <tr><td>CLO2</td><td>13, 14, 15 · 25, 26 · 27–29, 31–33 · 37, 38, 39 · 49, 50</td><td>Chương 2, 5, 6, 8, 11</td></tr>
    <tr><td>CLO3</td><td>16, 17, 18 · 19, 20, 21</td><td>Chương 3</td></tr>
    <tr><td>CLO4</td><td>25, 26</td><td>Chương 5</td></tr>
    <tr><td>CLO5</td><td>27–29, 31–33 · 35, 36 · 37, 38, 39 · 43, 44, 45 · 46, 47, 48</td><td>Chương 6, 8, 10</td></tr>
    <tr><td>CLO6</td><td>4, 5 · 51</td><td>Chương 1 (bài 1.4–1.5) · Chương 11 (bài 11.3)</td></tr>
    <tr><td>CLO7</td><td>7, 8, 9</td><td>Chương 1 (bài 1.7–1.9)</td></tr>
    <tr><td><strong>CLO8</strong></td><td><strong>không buổi nào gọi tên riêng</strong> — chỉ tới được qua các buổi ghi "All CLOs": Lab (10–12, 22–24, 40–42, 55–57), Assignment (30, 51), Progress test (34, 58) và thuyết trình (59, 60)</td><td>Chương 2, 4, 7, 9, 13</td></tr>
  </tbody>
</table>
<h3>CLO → đầu điểm nào kiểm</h3>
<table>
  <thead><tr><th>Đầu điểm</th><th>Trọng số</th><th>CLO được kiểm (FLM, nguyên văn)</th></tr></thead>
  <tbody>
    <tr><td>Assignment (2 bài)</td><td>20%</td><td>AS1: CLO1-7 · AS2: CLO1-2, CLO5-7</td></tr>
    <tr><td>Group presentation</td><td>10%</td><td>All CLOs</td></tr>
    <tr><td>Lab (4 bài)</td><td>20%</td><td>All CLOs</td></tr>
    <tr><td>Progress tests (2 bài)</td><td>10%</td><td>PT1: All CLOs · PT2: All CLOs</td></tr>
    <tr><td>Final exam</td><td>40%</td><td>All CLOs</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Ba chỗ bất thường trong bảng gốc — biết để không hoang mang trong lớp.</strong><br>
<strong>1. Buổi 6 KHÔNG có CLO nào.</strong> "Introduction to presentation" có ô CLO để trống. Trường không công bố gì ở đó nên web không gán gì. Đọc theo bản giấy thì buổi 6 rõ ràng phục vụ Group presentation và CLO8, nhưng đó là <em>cách đọc</em>, không phải điều trường công bố.<br>
<strong>2. Buổi 52–54 in "CL01" — dùng SỐ KHÔNG, không phải chữ O.</strong> Mọi buổi khác ghi "CLO1". Đây là lỗi gõ trên trang FLM; web ghi CLO1 trong các bảng của mình và nói rõ chỗ này ở đây, thay vì âm thầm sửa bản của trường.<br>
<strong>3. CLO8 — chuẩn đầu ra về kỹ năng mềm — không có buổi riêng nào.</strong> Nó không hề được gọi tên trong kế hoạch buổi, nhưng Group presentation (10%), cả bốn bài Lab (20%) và cả hai Progress test (10%) đều gắn "All CLOs", tức bao gồm nó. Vậy 60% điểm môn chính thức phủ một chuẩn đầu ra không được dạy trong buổi giảng nào. Thực tế bạn kiếm CLO8 bằng việc đến lớp có chuẩn bị, làm việc trong nhóm Lab và trình bày rõ ràng — không phải bằng việc ôn một chương.</div>
<div class="note-ct"><strong>Đọc bảng cho đúng</strong> (ghi chú của web): vì thi cuối kỳ, thuyết trình, các bài Lab và cả hai Progress test đều ghi "All CLOs", syllabus <em>không</em> nói rằng Progress test 1 ở buổi 34 chỉ phủ buổi 1–33. Kế hoạch buổi thì hàm ý thế, bảng đánh giá không giới hạn lại, mà đặc tả số câu ("3-8 câu cho mỗi CLOx") lại chỉ về phía phủ rộng. Hãy chuẩn bị theo hướng bị hỏi mọi thứ đã học, và xác nhận phạm vi với giảng viên trước mỗi bài kiểm tra.</div>`,
  ]]);

/* ── 0.4 Giáo trình &amp; công cụ ─────────────────────────────────────────────── */
const l04 = doc('eei101-0-4-giao-trinh-cong-cu',
  '0.4 — The four materials (mind the edition!) & the three free simulators|||0.4 — Bốn giáo trình (coi kỹ BẢN!) & ba công cụ mô phỏng miễn phí',
  'Bốn dòng Materials của FLM dựng thành thẻ: sách chính Tooley bản 3rd (2006) ISBN 9780750669238 trên thư viện TRẢ PHÍ books24x7, ba tài liệu tham khảo không link (Westcott 2023, Tooley bản 5th 2019, Rashid 2011); ba công cụ mô phỏng miễn phí chạy trên trình duyệt.',
  [[
    `<span class="eyebrow">EEI101 · Section 0 · Lesson 0.4</span>
<h2>Materials &amp; tools — the university's own list</h2>
<p class="lead">The Materials table has four rows. Row 1 is marked <em>Is Main Material = True</em>. Two things about it matter more than the title: it is the <strong>2006, 3rd edition</strong>, and its link goes to a <strong>paid library</strong>.</p>
<p class="nhan">${NGUON} — Materials table, verbatim (author, publisher, year, edition, ISBN, URL)</p>
${KHOI_SACH(true)}
<h3>The same four rows, field by field</h3>
<table>
  <thead><tr><th>#</th><th>Material description</th><th>Author</th><th>Publisher</th><th>Year</th><th>Edition</th><th>ISBN</th><th>Main?</th><th>Note/URL</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Electronic Circuits: Fundamentals and Applications</td><td>Mike Tooley</td><td>Routledge</td><td><strong>2006</strong></td><td><strong>3rd</strong></td><td>9780750669238</td><td><strong>True — main</strong></td><td>Link: https://library.books24x7.com/toc.aspx?bookid=32309</td></tr>
    <tr><td>2</td><td>Basic Electronics: Theory and Practice, Fourth Edition</td><td>Sean Westcott and Jean Riescher Westcott</td><td>Mercury Learning</td><td>2023</td><td>4th</td><td>9781683929574</td><td>False</td><td>reference 2</td></tr>
    <tr><td>3</td><td>Electronic Circuits: Fundamentals and Applications</td><td>Mike Tooley</td><td>Routledge</td><td><strong>2019</strong></td><td><strong>5th</strong></td><td>9780367421991</td><td>False</td><td>reference 1</td></tr>
    <tr><td>4</td><td>Power Electronics Handbook: Devices, Circuits, and Applications, Third Edition</td><td>Muhammad H. Rashid (ed)</td><td>Butterworth-Heinemann</td><td>2011</td><td>3rd</td><td>9780123820365</td><td>False</td><td>reference 3</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>Rows 1 and 3 are the SAME book in two editions — and the university names the OLDER one as the main text.</strong> Row 1 is Tooley's 3rd edition (2006, ISBN 9780750669238) and it carries <em>Is Main Material = True</em>. Row 3 is Tooley's 5th edition (2019, ISBN 9780367421991) and it is only "reference 1". So when a lecturer says "chapter 8, section 8.5", the section numbers that count are the <strong>3rd edition's</strong>. Buying or borrowing the 5th by mistake is not a disaster — it is the newer, fuller book — but you will be one edition out of step on numbering, and the 60-session plan is numbered against the 3rd.</div>
<div class="callout warn"><strong>The main textbook is NOT free.</strong> Its link goes to <a href="https://library.books24x7.com/toc.aspx?bookid=32309" target="_blank" rel="noopener">library.books24x7.com</a> — a subscription library that asks you to sign in. If your FPTU account does not open it, ask the library staff; do not assume the link is broken. The other three rows have no link at all on the syllabus, so treat them as print references.</div>
<h3>How this course maps onto the main textbook</h3>
<table>
  <thead><tr><th>Book chapter (3rd ed)</th><th>FLM sessions</th><th>Chapter here</th></tr></thead>
  <tbody>
    <tr><td>1 — Electrical fundamentals</td><td>1–3</td><td>Ch. 1 (1.1–1.3)</td></tr>
    <tr><td>2 — Circuit simulation</td><td>4–5</td><td>Ch. 1 (1.4–1.5)</td></tr>
    <tr><td>3 — Test equipment and measurements</td><td>7–9</td><td>Ch. 1 (1.7–1.9)</td></tr>
    <tr><td>4 — Passive components</td><td>13–15</td><td>Ch. 2</td></tr>
    <tr><td>5 — D.C. circuits · 6 — Alternating voltage and current</td><td>16–21</td><td>Ch. 3</td></tr>
    <tr><td>7 — Semiconductors</td><td>25–26</td><td>Ch. 5</td></tr>
    <tr><td>8 — Power sources and supplies</td><td>27–29, 31–33</td><td>Ch. 6</td></tr>
    <tr><td>9 — Amplifiers · 10 — Operational amplifiers</td><td>35–39</td><td>Ch. 8</td></tr>
    <tr><td>11 — Oscillators · 12 — Logic circuits</td><td>43–48</td><td>Ch. 10</td></tr>
    <tr><td>13 — Sensors and interfacing</td><td>49–50</td><td>Ch. 11</td></tr>
    <tr><td>14 — Wireless and wired signal transmitters</td><td>52–54</td><td>Ch. 12</td></tr>
  </tbody>
</table>
<p class="ghi-chu">The plan uses 14 consecutive chapters with none skipped — unusual, and it means the book is genuinely the spine of this course.</p>
<h3>Tools — verbatim from the syllabus</h3>
<p>The Tools field reads: <em>Simulation tools for Lab:</em></p>
<ul>
<li><strong>MultisimLive</strong> — <a href="https://www.multisim.com" target="_blank" rel="noopener">https://www.multisim.com</a> (online simulation)</li>
<li><strong>Tinkercad.com</strong> — <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">tinkercad.com</a></li>
<li><strong>Tina Circuits Simulator</strong></li>
</ul>
<div class="callout ok"><strong>All three run in a web browser and cost nothing.</strong> There is no heavyweight install anywhere in this course — no Proteus, no OrCAD, no LTspice required. A laptop that can open a browser tab can do every Lab in the syllabus. Students arrive expecting to fight an installer; you do not have to.</div>
<div class="note-ct"><strong>Which one to use, and when</strong> (our advice, not a rule): start in <strong>Tinkercad Circuits</strong>, because it gives you a breadboard, a battery, resistors and a working multimeter you drag onto the screen — the measurement habits of sessions 7–9 are easier to build there. Move to <strong>MultisimLive</strong> when you need real analysis types (DC operating point, AC sweep, transient), which is what CLO6 and sessions 4–5 are about. TINA is the third option; TINACloud is browser-based while the desktop build is a trial. The syllabus does <strong>not</strong> say which tool each Lab is marked on — ask your lecturer before Lab 1 (sessions 10–12).</div>`,
    `<span class="eyebrow">EEI101 · Mục 0 · Bài 0.4</span>
<h2>Giáo trình &amp; công cụ — danh sách của chính trường</h2>
<p class="lead">Bảng Materials có bốn dòng. Dòng 1 được đánh dấu <em>Is Main Material = True</em>. Hai điều về nó quan trọng hơn cả cái tên sách: đó là bản <strong>3rd, năm 2006</strong>, và link của nó dẫn vào một <strong>thư viện trả phí</strong>.</p>
<p class="nhan">${NGUON} — bảng Materials, nguyên văn (tác giả, NXB, năm, bản, ISBN, URL)</p>
${KHOI_SACH(false)}
<h3>Vẫn bốn dòng đó, đủ từng trường</h3>
<table>
  <thead><tr><th>#</th><th>Mô tả tài liệu</th><th>Tác giả</th><th>NXB</th><th>Năm</th><th>Bản</th><th>ISBN</th><th>Chính?</th><th>Ghi chú/URL</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Electronic Circuits: Fundamentals and Applications</td><td>Mike Tooley</td><td>Routledge</td><td><strong>2006</strong></td><td><strong>3rd</strong></td><td>9780750669238</td><td><strong>True — sách chính</strong></td><td>Link: https://library.books24x7.com/toc.aspx?bookid=32309</td></tr>
    <tr><td>2</td><td>Basic Electronics: Theory and Practice, Fourth Edition</td><td>Sean Westcott and Jean Riescher Westcott</td><td>Mercury Learning</td><td>2023</td><td>4th</td><td>9781683929574</td><td>False</td><td>reference 2</td></tr>
    <tr><td>3</td><td>Electronic Circuits: Fundamentals and Applications</td><td>Mike Tooley</td><td>Routledge</td><td><strong>2019</strong></td><td><strong>5th</strong></td><td>9780367421991</td><td>False</td><td>reference 1</td></tr>
    <tr><td>4</td><td>Power Electronics Handbook: Devices, Circuits, and Applications, Third Edition</td><td>Muhammad H. Rashid (ed)</td><td>Butterworth-Heinemann</td><td>2011</td><td>3rd</td><td>9780123820365</td><td>False</td><td>reference 3</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>Dòng 1 và dòng 3 là CÙNG MỘT CUỐN SÁCH ở hai bản — và trường chỉ định bản CŨ làm giáo trình chính.</strong> Dòng 1 là bản 3rd của Tooley (2006, ISBN 9780750669238) và nó mang <em>Is Main Material = True</em>. Dòng 3 là bản 5th của Tooley (2019, ISBN 9780367421991) và chỉ được xếp "reference 1". Nghĩa là khi giảng viên nói "chương 8, mục 8.5" thì số mục có hiệu lực là số mục của <strong>bản 3rd</strong>. Mua/mượn nhầm bản 5th không phải thảm hoạ — nó mới hơn, đầy hơn — nhưng bạn sẽ lệch một bản về cách đánh số, mà kế hoạch 60 buổi lại đánh số theo bản 3rd.</div>
<div class="callout warn"><strong>Giáo trình chính KHÔNG miễn phí.</strong> Link của nó dẫn tới <a href="https://library.books24x7.com/toc.aspx?bookid=32309" target="_blank" rel="noopener">library.books24x7.com</a> — một thư viện thuê bao, vào phải đăng nhập. Nếu tài khoản FPTU của bạn chưa mở được, hãy hỏi thư viện; đừng kết luận là link hỏng. Ba dòng còn lại syllabus KHÔNG kèm link nào, nên coi chúng là tài liệu tham khảo bản in.</div>
<h3>Môn này khớp vào giáo trình chính thế nào</h3>
<table>
  <thead><tr><th>Chương sách (bản 3rd)</th><th>Buổi FLM</th><th>Chương trên web</th></tr></thead>
  <tbody>
    <tr><td>1 — Electrical fundamentals</td><td>1–3</td><td>Chương 1 (bài 1.1–1.3)</td></tr>
    <tr><td>2 — Circuit simulation</td><td>4–5</td><td>Chương 1 (bài 1.4–1.5)</td></tr>
    <tr><td>3 — Test equipment and measurements</td><td>7–9</td><td>Chương 1 (bài 1.7–1.9)</td></tr>
    <tr><td>4 — Passive components</td><td>13–15</td><td>Chương 2</td></tr>
    <tr><td>5 — D.C. circuits · 6 — Alternating voltage and current</td><td>16–21</td><td>Chương 3</td></tr>
    <tr><td>7 — Semiconductors</td><td>25–26</td><td>Chương 5</td></tr>
    <tr><td>8 — Power sources and supplies</td><td>27–29, 31–33</td><td>Chương 6</td></tr>
    <tr><td>9 — Amplifiers · 10 — Operational amplifiers</td><td>35–39</td><td>Chương 8</td></tr>
    <tr><td>11 — Oscillators · 12 — Logic circuits</td><td>43–48</td><td>Chương 10</td></tr>
    <tr><td>13 — Sensors and interfacing</td><td>49–50</td><td>Chương 11</td></tr>
    <tr><td>14 — Wireless and wired signal transmitters</td><td>52–54</td><td>Chương 12</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Kế hoạch dùng 14 chương liên tục, không bỏ chương nào — chuyện hiếm, và nó nghĩa là cuốn sách này thực sự là xương sống của môn.</p>
<h3>Công cụ — nguyên văn syllabus</h3>
<p>Ô Tools ghi: <em>Simulation tools for Lab:</em> (công cụ mô phỏng cho Lab)</p>
<ul>
<li><strong>MultisimLive</strong> — <a href="https://www.multisim.com" target="_blank" rel="noopener">https://www.multisim.com</a> (mô phỏng trực tuyến)</li>
<li><strong>Tinkercad.com</strong> — <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">tinkercad.com</a></li>
<li><strong>Tina Circuits Simulator</strong></li>
</ul>
<div class="callout ok"><strong>Cả ba chạy trên trình duyệt và không mất tiền.</strong> Cả môn này không có bản cài nặng nào — không cần Proteus, không cần OrCAD, không bắt buộc LTspice. Một cái laptop mở được tab trình duyệt là làm được mọi bài Lab trong syllabus. Sinh viên thường vào môn với tâm thế phải vật lộn với bộ cài; bạn không cần phải thế.</div>
<div class="note-ct"><strong>Dùng cái nào, lúc nào</strong> (lời khuyên của web, không phải quy định): hãy bắt đầu bằng <strong>Tinkercad Circuits</strong>, vì nó cho bạn một breadboard, một cục pin, mấy con điện trở và một chiếc đồng hồ vạn năng kéo thả được — thói quen đo đạc của buổi 7–9 dễ hình thành ở đó. Chuyển sang <strong>MultisimLive</strong> khi cần các loại phân tích thật (điểm làm việc DC, quét tần số AC, quá độ), vốn chính là nội dung của CLO6 và buổi 4–5. TINA là lựa chọn thứ ba; TINACloud chạy trên trình duyệt còn bản desktop là bản dùng thử. Syllabus <strong>không</strong> nói mỗi bài Lab chấm trên công cụ nào — hãy hỏi giảng viên trước Lab 1 (buổi 10–12).</div>`,
  ]]);

/* ── 0.5 Kế hoạch đủ 60 buổi ──────────────────────────────────────────────── */
const l05 = doc('eei101-0-5-ke-hoach-60-buoi',
  '0.5 — All 60 sessions, as published by FLM|||0.5 — Kế hoạch đủ 60 buổi, nguyên bản FLM',
  'Bảng 60 buổi nguyên bản FLM: chủ đề tiếng Anh giữ nguyên văn + cột dịch tiếng Việt, cột CLO, và cột "Bài trên web" để đối chiếu; kèm ghi chú buổi 6 trống CLO, buổi 52–54 in "CL01", và 12 buổi Lab + 2 buổi Assignment + 2 buổi thuyết trình.',
  [[
    `<span class="eyebrow">EEI101 · Section 0 · Lesson 0.5</span>
<h2>The 60-session plan</h2>
<p class="lead">This is the university's schedule, row for row, so you can match any page on this site to the paper you were given. The last column is <strong>our</strong> mapping to the lessons here — it is not part of the syllabus.</p>
<p class="nhan">${NGUON} — Session plan, all 60 rows, topics and CLO column verbatim</p>
<table>
  <thead><tr><th>#</th><th>Topic (FLM, verbatim)</th><th>CLO</th><th>Page here</th></tr></thead>
  <tbody>
${hangBuoi(false)}
  </tbody>
</table>
<div class="callout warn"><strong>Two oddities in the original table — read them so you are not confused in class.</strong><br>
<strong>1. Session 6 has an EMPTY CLO cell.</strong> "Introduction to presentation" is the only session with no outcome attached. We print "(trống — trường không công bố)" instead of guessing; the obvious reading is that it serves the Group presentation and CLO8, but the university publishes nothing there.<br>
<strong>2. Sessions 52, 53 and 54 print "CL01" — a digit zero instead of the letter O.</strong> Every other row writes CLO1. It is a typing slip on FLM's page; we keep the original spelling in the table above with a note, rather than silently correcting the university's paper.</div>
<div class="note-ct"><strong>How to read the shape of this course</strong> (our arithmetic, not the syllabus): of the 60 sessions, <strong>12 are Lab</strong> (10–12, 22–24, 40–42, 55–57), <strong>2 are Assignment</strong> (30, 51), <strong>2 are Progress test</strong> (34, 58) and <strong>2 are Presentation</strong> (59–60). That is 18 sessions — nearly a third of the course — spent on things that are <em>marked</em>, worth 60% in total. The remaining 42 sessions march through 14 chapters of one book with nothing skipped, which means the pace is fast and there is no "catch-up week". Before each session, open the page in the last column and read it once.</div>`,
    `<span class="eyebrow">EEI101 · Mục 0 · Bài 0.5</span>
<h2>Kế hoạch 60 buổi</h2>
<p class="lead">Đây là lịch của trường, từng dòng một, để bạn đối chiếu được mọi trang trên web này với bản trường phát. Cột cuối là ánh xạ <strong>của web</strong> sang các bài ở đây — không thuộc syllabus.</p>
<p class="nhan">${NGUON} — bảng kế hoạch, đủ 60 dòng, chủ đề và cột CLO giữ nguyên văn</p>
<table>
  <thead><tr><th>#</th><th>Chủ đề (FLM, nguyên văn)</th><th>Dịch tiếng Việt</th><th>CLO</th><th>Bài trên web</th></tr></thead>
  <tbody>
${hangBuoi(true)}
  </tbody>
</table>
<div class="callout warn"><strong>Hai chỗ bất thường trong bảng gốc — đọc để không hoang mang trong lớp.</strong><br>
<strong>1. Buổi 6 có ô CLO TRỐNG.</strong> "Introduction to presentation" là buổi duy nhất không gắn chuẩn đầu ra nào. Web ghi "(trống — trường không công bố)" thay vì đoán; cách đọc hiển nhiên là buổi đó phục vụ Group presentation và CLO8, nhưng trường không công bố gì ở ô đó.<br>
<strong>2. Buổi 52, 53 và 54 in "CL01" — dùng SỐ KHÔNG thay cho chữ O.</strong> Mọi dòng khác ghi CLO1. Đây là lỗi gõ trên trang FLM; web giữ đúng cách viết gốc trong bảng trên kèm ghi chú, thay vì âm thầm sửa bản của trường.</div>
<div class="note-ct"><strong>Đọc hình dáng của môn này</strong> (số học của web, không phải của syllabus): trong 60 buổi thì <strong>12 buổi là Lab</strong> (10–12, 22–24, 40–42, 55–57), <strong>2 buổi Assignment</strong> (30, 51), <strong>2 buổi Progress test</strong> (34, 58) và <strong>2 buổi thuyết trình</strong> (59–60). Tổng 18 buổi — gần một phần ba cả môn — dành cho những thứ <em>có điểm</em>, cộng lại 60%. 42 buổi còn lại đi liền mạch qua 14 chương của một cuốn sách, không bỏ chương nào, nghĩa là nhịp học nhanh và không có "tuần bù". Trước mỗi buổi, hãy mở bài ở cột cuối và đọc một lượt.</div>`,
  ]]);

/* ── 0.6 Nhiệm vụ sinh viên ───────────────────────────────────────────────── */
const l06 = doc('eei101-0-6-nhiem-vu-sinh-vien',
  '0.6 — Student tasks: the three rules, verbatim|||0.6 — Nhiệm vụ sinh viên: ba quy định, nguyên văn',
  'Ba gạch đầu dòng StudentTasks của FLM nguyên văn kèm dịch và nghĩa thực tế: dự ≥80% buổi mới được thi cuối kỳ (vắng tối đa 12/60), làm và nộp bài đúng hạn + làm quiz trong giờ, theo dõi thông báo trên FLM.',
  [[
    `<span class="eyebrow">EEI101 · Section 0 · Lesson 0.6</span>
<h2>What the syllabus requires of you</h2>
<p class="lead">Three lines in the StudentTasks field. The first one can end your semester, so read it first.</p>
<p class="nhan">${NGUON} — StudentTasks, verbatim (three bullets, nothing omitted)</p>
<table>
  <thead><tr><th>#</th><th>Verbatim (FLM)</th><th>What it means day to day</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Students must attend at least 80% of contact slots in order to be accepted to the final examination.</td><td>60 sessions → you may miss <strong>at most 12</strong>. Miss the 13th and you are not admitted to the final exam (40%), no matter how good the other four marks are.</td></tr>
    <tr><td>2</td><td>Student is responsible to do all exercises given by instructor in class or at home and submit on time. Do quizzes during class.</td><td>Two duties in one line: hand work in on time, <em>and</em> do the in-class quizzes. The two Assignments (20%) and four Labs (20%) come from the first half — 40% of the grade is "did you do the work and hand it in".</td></tr>
    <tr><td>3</td><td>Constantly follow announcements on LMS at https://flm.fpt.edu.vn/ for up-to-date course information regarding assignment submission and feedback on assignments and project work.</td><td>FLM is the source of truth for deadlines and feedback. This site follows syllabus 14452 (decision 1028/QĐ-ĐHFPT, 21/08/2026); if FLM and this site ever disagree, <strong>FLM wins</strong>.</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>The 80% rule is the only one that cannot be repaired at the end of the semester.</strong> A low mark can be pulled up by the next mark; a 13th absence cannot be pulled up by anything. Count your own absences — do not assume someone will warn you. And note where the Lab sessions sit: they come in blocks of three (10–12, 22–24, 40–42, 55–57), so one bad week costs three slots at once.</div>
<div class="note-ct"><strong>A study routine that fits the syllabus' own numbers</strong> (ours, not a rule): the syllabus budgets <strong>104 self-study hours</strong> against 45 contact hours — about <strong>7 hours a week</strong> outside class over a 15-week semester. For a circuits course, split it: 1.5h reading the session's sections in Tooley <em>before</em> class (this course is taught Problem-Based, so the question comes first), 3h working problems <strong>with a pen — writing the formula, substituting numbers, checking the unit</strong>, 1.5h in the simulator rebuilding the circuit you just calculated and seeing whether the simulator agrees with your arithmetic, and 1h on the current Assignment or Lab report. That simulator hour is the cheapest mark-insurance in the course: a wrong calculation you never simulated becomes a wrong answer in the exam, while a wrong calculation the simulator contradicts becomes a lesson.</div>`,
    `<span class="eyebrow">EEI101 · Mục 0 · Bài 0.6</span>
<h2>Trường yêu cầu gì ở bạn</h2>
<p class="lead">Ba dòng trong ô StudentTasks. Dòng đầu có thể kết thúc cả học kỳ của bạn, nên đọc nó trước.</p>
<p class="nhan">${NGUON} — ô StudentTasks, nguyên văn (ba gạch đầu dòng, không lược bỏ)</p>
<table>
  <thead><tr><th>#</th><th>Nguyên văn (FLM)</th><th>Nghĩa thực tế hằng ngày</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Students must attend at least 80% of contact slots in order to be accepted to the final examination.</td><td>Dự ít nhất 80% số buổi mới được vào thi cuối kỳ. 60 buổi → vắng <strong>tối đa 12</strong>. Vắng buổi thứ 13 là không được thi cuối kỳ (40%), dù bốn đầu điểm kia đẹp tới đâu.</td></tr>
    <tr><td>2</td><td>Student is responsible to do all exercises given by instructor in class or at home and submit on time. Do quizzes during class.</td><td>Hai việc trong một dòng: làm hết bài tập giảng viên giao ở lớp hoặc ở nhà và nộp đúng hạn, <em>và</em> làm quiz trong giờ. Hai bài Assignment (20%) và bốn bài Lab (20%) sinh ra từ nửa đầu — 40% điểm môn là "có làm và có nộp hay không".</td></tr>
    <tr><td>3</td><td>Constantly follow announcements on LMS at https://flm.fpt.edu.vn/ for up-to-date course information regarding assignment submission and feedback on assignments and project work.</td><td>Theo dõi thông báo trên LMS (FLM) thường xuyên để biết hạn nộp và nhận xét. FLM là nguồn sự thật. Web này bám syllabus 14452 (QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026); nếu FLM và web có chỗ nào khác nhau thì <strong>FLM đúng</strong>.</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>Quy định 80% là thứ duy nhất không sửa được vào cuối kỳ.</strong> Một đầu điểm thấp còn có đầu điểm sau kéo lên; buổi vắng thứ 13 thì không có gì kéo lại. Hãy tự đếm số buổi vắng của mình — đừng trông vào việc sẽ có ai nhắc. Và để ý chỗ các buổi Lab nằm: chúng đi theo khối ba buổi liền (10–12, 22–24, 40–42, 55–57), nên nghỉ hỏng một tuần là mất ba buổi một lúc.</div>
<div class="note-ct"><strong>Một nếp học khớp với chính con số của syllabus</strong> (gợi ý của web, không phải quy định): syllabus dành <strong>104 giờ tự học</strong> so với 45 giờ lên lớp — khoảng <strong>7 giờ mỗi tuần</strong> ngoài lớp cho một kỳ 15 tuần. Với một môn mạch điện, hãy chia: 1,5h đọc các mục của buổi trong sách Tooley <em>trước</em> khi lên lớp (môn này dạy theo lối Problem-Based, câu hỏi đến trước), 3h làm bài tập <strong>bằng bút — viết công thức ra, thay số vào, kiểm lại đơn vị</strong>, 1,5h vào phần mềm mô phỏng dựng lại đúng cái mạch vừa tính và xem máy có đồng ý với số học của bạn không, 1h cho Assignment hoặc báo cáo Lab đang tới hạn. Một giờ mô phỏng đó là thứ bảo hiểm điểm rẻ nhất của cả môn: một phép tính sai mà bạn không hề mô phỏng lại sẽ thành một câu trả lời sai trong phòng thi, còn một phép tính sai bị phần mềm phản bác thì thành một bài học.</div>`,
  ]]);

/* ── Quiz Mục 0 ───────────────────────────────────────────────────────────── */
const q0 = quiz('eei101-0-quiz', 'Quiz 0 — Do you know the rules?|||Quiz 0 — Bạn đã nắm luật chơi chưa?', [
  { id: 'q1',
    question: 'Which mark has the LARGEST weight in EEI101?|||Đầu điểm nào có trọng số LỚN NHẤT của EEI101?',
    options: ['Assignment, 20%|||Assignment, 20%', 'Lab, 20%|||Lab, 20%', 'Final exam, 40%|||Final exam (thi cuối kỳ), 40%', 'Group presentation, 10%|||Group presentation, 10%'],
    correctIndex: 2, points: 1,
    explanation: 'Final exam 40%. Weights: Assignment 20 + Group presentation 10 + Lab 20 + Progress tests 10 + Final exam 40 = 100%.|||Final exam 40%. Trọng số: Assignment 20 + Group presentation 10 + Lab 20 + Progress tests 10 + Final exam 40 = 100%.' },
  { id: 'q2',
    question: 'With 60 sessions, the 80% attendance rule means you may miss at most how many?|||Với 60 buổi, quy định dự ≥80% nghĩa là vắng tối đa mấy buổi?',
    options: ['6|||6', '12|||12', '18|||18', '20|||20'],
    correctIndex: 1, points: 1,
    explanation: '80% of 60 = 48 sessions attended, so at most 12 absences — and the penalty is not being admitted to the final exam.|||80% của 60 = phải dự 48 buổi, nên vắng tối đa 12 buổi — và hậu quả là không được vào thi cuối kỳ.' },
  { id: 'q3',
    question: 'How long is the final exam, how many questions, and what is its completion criteria?|||Thi cuối kỳ dài bao lâu, bao nhiêu câu, và tiêu chí đạt là bao nhiêu?',
    options: ['60 minutes, 50 questions, criteria 4|||60 phút, 50 câu, tiêu chí 4', '60 minutes, 30 questions, criteria 5|||60 phút, 30 câu, tiêu chí 5', '20 minutes, 20 questions, criteria > 0|||20 phút, 20 câu, tiêu chí > 0', '90 minutes, 50 questions, criteria 4|||90 phút, 50 câu, tiêu chí 4'],
    correctIndex: 0, points: 1,
    explanation: '60 minutes, 50 questions, completion criteria 4 — the only mark whose criteria is not "> 0". 20 minutes / 20-30 questions is a Progress test.|||60 phút, 50 câu, tiêu chí đạt 4 — đầu điểm duy nhất không có tiêu chí "> 0". 20 phút / 20-30 câu là một bài Progress test.' },
  { id: 'q4',
    question: 'How many Labs and how many Assignments does the syllabus schedule, and what are they worth?|||Syllabus xếp bao nhiêu bài Lab và bao nhiêu Assignment, mỗi loại bao nhiêu phần trăm?',
    options: ['5 labs 10% · 1 assignment 15%|||5 Lab 10% · 1 Assignment 15%', '4 labs 20% · 2 assignments 20%|||4 Lab 20% · 2 Assignment 20%', '3 labs 20% · 2 assignments 10%|||3 Lab 20% · 2 Assignment 10%', '4 labs 10% · 1 assignment 20%|||4 Lab 10% · 1 Assignment 20%'],
    correctIndex: 1, points: 1,
    explanation: 'Lab: 4 parts, 20% total (sessions 10-12, 22-24, 40-42, 55-57). Assignment: 2 parts, 20% total (sessions 30 and 51). That is 5% per lab and 10% per assignment.|||Lab: 4 bài, tổng 20% (buổi 10-12, 22-24, 40-42, 55-57). Assignment: 2 bài, tổng 20% (buổi 30 và 51). Tức 5% mỗi Lab và 10% mỗi Assignment.' },
  { id: 'q5',
    question: 'The MAIN textbook of EEI101 is which edition, and is it free?|||Giáo trình CHÍNH của EEI101 là bản nào, và có miễn phí không?',
    options: ['Tooley, 5th edition 2019 — free PDF|||Tooley, bản 5th 2019 — PDF miễn phí', 'Tooley, 3rd edition 2006 — behind a paid library (books24x7)|||Tooley, bản 3rd 2006 — nằm trong thư viện trả phí (books24x7)', 'Westcott, Basic Electronics 2023 — free|||Westcott, Basic Electronics 2023 — miễn phí', 'Rashid, Power Electronics Handbook 2011 — free|||Rashid, Power Electronics Handbook 2011 — miễn phí'],
    correctIndex: 1, points: 1,
    explanation: 'Row 1, Is Main Material = True: Tooley, Electronic Circuits: Fundamentals and Applications, Routledge, 2006, 3rd ed, ISBN 9780750669238, linked on library.books24x7.com — a subscription library. The 5th edition (2019) exists but is only "reference 1".|||Dòng 1, Is Main Material = True: Tooley, Electronic Circuits: Fundamentals and Applications, Routledge, 2006, bản 3rd, ISBN 9780750669238, link trên library.books24x7.com — thư viện thuê bao. Bản 5th (2019) có trong danh sách nhưng chỉ là "reference 1".' },
  { id: 'q6',
    question: 'What does FLM publish in the Pre-Requisite field of EEI101?|||FLM ghi gì ở ô Pre-Requisite (môn tiên quyết) của EEI101?',
    options: ['It is empty|||Ô đó để trống', 'It says "Non" — printed exactly like that|||Ghi "Non" — in đúng như vậy', 'It says "CSI106"|||Ghi "CSI106"', 'It says "MAE101"|||Ghi "MAE101"'],
    correctIndex: 1, points: 1,
    explanation: 'The field contains the word "Non" — very likely "None" with the final e missing. We copy it verbatim instead of correcting the university page. Read by intent: no prerequisite subject.|||Ô đó chứa chữ "Non" — rất có thể là "None" bị thiếu chữ e cuối. Web chép nguyên văn thay vì sửa hộ trang của trường. Đọc theo dụng ý: không có môn tiên quyết.' },
  { id: 'q7',
    question: 'Every on-going mark lists an Option 1 and an Option 2. What does Option 2 say?|||Mọi đầu điểm on-going đều có Option 1 và Option 2. Option 2 ghi gì?',
    options: ['A retake with a different format|||Thi lại với hình thức khác', 'For Constructivism Approach only: Follow lecturer\'s proposal|||For Constructivism Approach only: theo phương án của giảng viên', 'Only for students who fail Option 1|||Chỉ dành cho sinh viên trượt Option 1', 'An online version of the same test|||Bản online của cùng bài kiểm tra'],
    correctIndex: 1, points: 1,
    explanation: 'Verbatim: "Option 2 (For Constructivism Approach only): Follow lecturer\'s proposal". So the format of 60% of the grade depends on your class and lecturer — ask which option your class is on.|||Nguyên văn: "Option 2 (For Constructivism Approach only): Follow lecturer\'s proposal". Nên hình thức của 60% điểm môn phụ thuộc lớp và giảng viên — hãy hỏi lớp mình theo phương án nào.' },
  { id: 'q8',
    question: 'How many CLOs does EEI101 have, and which one has no session of its own?|||EEI101 có bao nhiêu CLO, và CLO nào không có buổi riêng nào?',
    options: ['7 CLOs; CLO7|||7 CLO; CLO7', '8 CLOs; CLO8 (soft skills)|||8 CLO; CLO8 (kỹ năng mềm)', '8 CLOs; CLO4|||8 CLO; CLO4', '6 CLOs; CLO6|||6 CLO; CLO6'],
    correctIndex: 1, points: 1,
    explanation: 'Eight CLOs. CLO8 (learning attitude, teamwork, communication, problem solving) is never named in the session plan — you reach it only through the "All CLOs" sessions: Labs, Assignments, Progress tests and the presentation.|||Tám CLO. CLO8 (thái độ học tập, làm việc nhóm, giao tiếp, giải quyết vấn đề) không hề được gọi tên trong kế hoạch buổi — chỉ tới được qua các buổi ghi "All CLOs": Lab, Assignment, Progress test và thuyết trình.' },
], 540);

/* ════════════════════════════════════════════════════════════════════════════
 * CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1–9): Tooley ch.1 Electrical fundamentals +
 * ch.2 Circuit simulation + ch.3 Test equipment. CLO1 + CLO6 + CLO7.
 * MỌI phép tính đã tự kiểm lại bằng python3 (không có số nào chép từ ký ức).
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── 1.1 buổi 1 — CLO1 ───────────────────────────────────────────────────── */
const l11 = doc('eei101-1-1-don-vi-si',
  '1.1 — Course overview & the SI units of electricity|||1.1 — Tổng quan môn học & đơn vị SI trong điện',
  'Buổi 1, CLO1, Tooley 1.1: bảy đơn vị cơ bản SI, các đơn vị điện dẫn xuất (V, A, ohm, W, C, F, H, Hz) và định nghĩa của chúng, bảng tiền tố p/n/u/m/k/M/G, và cách đổi đơn vị không sai dấu phẩy. Có bài tập giải từng bước.',
  [[
    `<span class="eyebrow">EEI101 · Session 1 · CLO1</span>
<h2>Course overview, and the units everything else is built on</h2>
<p class="lead">After this session you can name the seven SI base units, say which electrical units are <em>derived</em> from them, and convert between pA and A without losing a decimal point. That last skill decides more exam marks than any theory in the course.</p>
<p class="nhan">${NGUON} · session 1 — "Course overview. Chapter 1: Electrical fundamentals — 1.1 Fundamental units (SI)"</p>
<h3>What this course is, in one paragraph</h3>
<p>Fourteen chapters of one book across 60 sessions: what electricity <em>is</em> (chapter 1), how to simulate a circuit (2) and measure one (3), the three passive components (4), how to analyse D.C. (5) and A.C. circuits (6), what a semiconductor is (7), how to build a power supply (8), how to amplify a signal (9, 10), how to make a circuit oscillate (11), how to make it think in 1s and 0s (12), how to attach it to the physical world (13) and how to send its signal somewhere (14). Nothing is skipped, so nothing can be postponed.</p>
<div class="note-ct">If you have never touched electronics: that list is not a warning, it is a promise. Every chapter reuses the same handful of ideas — voltage pushes, current flows, resistance opposes, power is the product. A student who is fluent with those four in week one finds the rest of the course to be variations.</div>
<h3>The seven SI base units</h3>
<p>Every other unit in physics is built from these seven. Exactly <strong>one</strong> of them is electrical.</p>
<table>
  <thead><tr><th>Quantity</th><th>Unit</th><th>Symbol</th></tr></thead>
  <tbody>
    <tr><td>Length</td><td>metre</td><td>m</td></tr>
    <tr><td>Mass</td><td>kilogram</td><td>kg</td></tr>
    <tr><td>Time</td><td>second</td><td>s</td></tr>
    <tr><td><strong>Electric current</strong></td><td><strong>ampere</strong></td><td><strong>A</strong></td></tr>
    <tr><td>Thermodynamic temperature</td><td>kelvin</td><td>K</td></tr>
    <tr><td>Amount of substance</td><td>mole</td><td>mol</td></tr>
    <tr><td>Luminous intensity</td><td>candela</td><td>cd</td></tr>
  </tbody>
</table>
<div class="callout"><strong>Only the ampere is a base electrical unit.</strong> Volt, ohm, watt, coulomb, farad, henry, hertz are all <em>derived</em> — each one is a shorthand for a combination of metre, kilogram, second and ampere. That is not trivia: it is why the units in a correct formula always cancel, and why a wrong formula usually announces itself as a wrong unit.</div>
<h3>The derived units you will use every week</h3>
<table>
  <thead><tr><th>Quantity</th><th>Symbol</th><th>Unit</th><th>Unit symbol</th><th>Equivalent to</th></tr></thead>
  <tbody>
    <tr><td>Charge</td><td>Q</td><td>coulomb</td><td>C</td><td>1 C = 1 A x 1 s (one amp flowing for one second)</td></tr>
    <tr><td>Voltage (potential difference, e.m.f.)</td><td>V</td><td>volt</td><td>V</td><td>1 V = 1 joule per coulomb</td></tr>
    <tr><td>Resistance</td><td>R</td><td>ohm</td><td>ohm</td><td>1 ohm = 1 V per A</td></tr>
    <tr><td>Power</td><td>P</td><td>watt</td><td>W</td><td>1 W = 1 J per second = 1 V x 1 A</td></tr>
    <tr><td>Capacitance</td><td>C</td><td>farad</td><td>F</td><td>1 F = 1 coulomb per volt</td></tr>
    <tr><td>Inductance</td><td>L</td><td>henry</td><td>H</td><td>1 H = 1 weber per ampere</td></tr>
    <tr><td>Frequency</td><td>f</td><td>hertz</td><td>Hz</td><td>1 Hz = 1 cycle per second</td></tr>
    <tr><td>Magnetic flux</td><td>(phi)</td><td>weber</td><td>Wb</td><td>the total magnetic "amount"</td></tr>
    <tr><td>Magnetic flux density</td><td>B</td><td>tesla</td><td>T</td><td>1 T = 1 Wb per square metre</td></tr>
  </tbody>
</table>
<p class="ghi-chu">On this site the ohm symbol is written "ohm" and the Greek letters are spelled out (pi, phi, mu written "u") so that the page renders correctly on every device. Your textbook and your exam paper will use the Greek symbols.</p>
<h3>Multiples and sub-multiples — the real exam hazard</h3>
<p>Electronics spans about 18 orders of magnitude: a picoampere of sensor leakage and a hundred amperes of starter-motor current are both "current". Prefixes keep the numbers readable.</p>
<table>
  <thead><tr><th>Prefix</th><th>Symbol</th><th>Multiplier</th><th>You will meet it in</th></tr></thead>
  <tbody>
    <tr><td>giga</td><td>G</td><td>10^9</td><td>GHz — radio, clocks</td></tr>
    <tr><td>mega</td><td><strong>M</strong></td><td>10^6</td><td>Mohm resistors, MHz</td></tr>
    <tr><td>kilo</td><td>k</td><td>10^3</td><td>kohm — the most common resistor size</td></tr>
    <tr><td>—</td><td>—</td><td>1</td><td>V, A, ohm, W</td></tr>
    <tr><td>milli</td><td><strong>m</strong></td><td>10^-3</td><td>mA, mV, mH</td></tr>
    <tr><td>micro</td><td>u (Greek mu)</td><td>10^-6</td><td>uF capacitors, uA</td></tr>
    <tr><td>nano</td><td>n</td><td>10^-9</td><td>nF capacitors, ns</td></tr>
    <tr><td>pico</td><td>p</td><td>10^-12</td><td>pF capacitors, pA leakage</td></tr>
  </tbody>
</table>
<h3>Converting, step by step</h3>
<div class="formula">To go from a prefixed value to the base unit, multiply by the prefix. To go the other way, divide.</div>
<pre><code class="language-text">0.000015 A  -&gt; how many microamps?
    1 uA = 10^-6 A, so divide by 10^-6:
    0.000015 / 0.000001 = 15          =&gt; 15 uA

47 kohm     -&gt; how many ohms?
    47 x 10^3 = 47000                 =&gt; 47000 ohm

2.2 Mohm    -&gt; how many ohms?
    2.2 x 10^6 = 2200000              =&gt; 2 200 000 ohm

100 nF      -&gt; how many uF?
    100 x 10^-9 = 0.0000001 F
    0.0000001 / 10^-6 = 0.1           =&gt; 0.1 uF</code></pre>
<div class="out">15 uA · 47000 ohm · 2 200 000 ohm · 0.1 uF</div>
<p>The last one is worth memorising as a pair: <strong>100 nF = 0.1 uF</strong>. The same capacitor is printed both ways depending on who made it, and confusing them by a factor of a thousand is a classic Lab-report error.</p>
<div class="pitfall"><b>m is not M.</b> <code>10 mA</code> is ten thousandths of an amp; <code>10 MA</code> would be ten million amps. Lower case milli, upper case mega — always. <b>Never mix prefixes inside one formula.</b> Put every quantity in base units (V, A, ohm) before you divide; "12 V divided by 100 kohm" is not 0.12 of anything. <b>k on its own means nothing.</b> A resistor written "10k" in a schematic means 10 kohm, but in your written answer the unit must be there — an exam answer of "0.12" with no unit is not a current. <b>Watch out for sloppy notation on components.</b> "4k7" means 4.7 kohm and "R47" means 0.47 ohm; the letter sits where the decimal point goes.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Express 0.000 000 022 F in nanofarads and in picofarads.</p>
<div class="dap-an"><pre><code class="language-text">0.000000022 F = 22 x 10^-9 F      =&gt; 22 nF
                = 22000 x 10^-12 F  =&gt; 22000 pF</code></pre>
<p>Going from nano to pico is three more decimal places, so the number gets a thousand times bigger while the physical capacitor does not change at all. Both labels appear on real parts.</p></div>
<p><b>E2.</b> A current of 0.5 C of charge passes a point in 10 s. What is the current, in milliamps?</p>
<div class="dap-an"><pre><code class="language-text">I = Q / t = 0.5 C / 10 s = 0.05 A
0.05 A = 50 x 10^-3 A     =&gt; 50 mA</code></pre>
<p>This is the definition of the ampere doing its job: <strong>current is charge per second</strong>. Notice how the units cancel — coulombs divided by seconds <em>is</em> amperes, which is a free check that the formula was the right way up.</p></div>
<p><b>E3.</b> Which is larger: 470 kohm or 0.47 Mohm?</p>
<div class="dap-an"><p><strong>They are equal.</strong> 470 x 10^3 = 470 000 and 0.47 x 10^6 = 470 000. Both are written on real resistors; the same part can carry either label.</p></div>`,
    `<span class="eyebrow">EEI101 · Buổi 1 · CLO1</span>
<h2>Tổng quan môn học, và những đơn vị mà tất cả phần sau dựng lên từ đó</h2>
<p class="lead">Học xong buổi này bạn kể được bảy đơn vị cơ bản SI, nói được đơn vị điện nào là <em>dẫn xuất</em>, và đổi từ pA sang A mà không mất dấu phẩy nào. Riêng kỹ năng cuối cùng đó quyết định nhiều điểm thi hơn bất kỳ phần lý thuyết nào của môn.</p>
<p class="nhan">${NGUON} · buổi 1 — "Course overview. Chapter 1: Electrical fundamentals — 1.1 Fundamental units (SI)"</p>
<h3>Môn này là gì, trong một đoạn</h3>
<p>Mười bốn chương của một cuốn sách trải trên 60 buổi: điện <em>là gì</em> (chương 1), mô phỏng một mạch (2) và đo một mạch (3), ba linh kiện thụ động (4), phân tích mạch một chiều D.C. (5) và mạch xoay chiều A.C. (6), bán dẫn là gì (7), dựng một bộ nguồn (8), khuếch đại một tín hiệu (9, 10), làm mạch dao động (11), làm mạch "nghĩ" bằng 1 và 0 (12), gắn mạch vào thế giới vật lý (13) và gửi tín hiệu của nó đi đâu đó (14). Không chương nào bị bỏ, nên cũng không chương nào hoãn được.</p>
<div class="note-ct">Nếu bạn chưa từng chạm vào điện tử: danh sách trên không phải lời cảnh báo, nó là một lời hứa. Mọi chương đều dùng lại đúng một nhóm nhỏ ý niệm — điện áp đẩy, dòng điện chảy, điện trở cản, công suất là tích của hai cái đầu. Ai thành thạo bốn thứ đó ngay tuần đầu thì phần còn lại của môn chỉ là các biến thể.</div>
<h3>Bảy đơn vị cơ bản SI</h3>
<p>Mọi đơn vị khác trong vật lý đều dựng từ bảy cái này. Và đúng <strong>một</strong> cái trong đó là đơn vị điện.</p>
<table>
  <thead><tr><th>Đại lượng</th><th>Đơn vị</th><th>Ký hiệu</th></tr></thead>
  <tbody>
    <tr><td>Chiều dài</td><td>mét (metre)</td><td>m</td></tr>
    <tr><td>Khối lượng</td><td>kilôgam (kilogram)</td><td>kg</td></tr>
    <tr><td>Thời gian</td><td>giây (second)</td><td>s</td></tr>
    <tr><td><strong>Dòng điện</strong></td><td><strong>ampe (ampere)</strong></td><td><strong>A</strong></td></tr>
    <tr><td>Nhiệt độ nhiệt động</td><td>kelvin</td><td>K</td></tr>
    <tr><td>Lượng chất</td><td>mol (mole)</td><td>mol</td></tr>
    <tr><td>Cường độ sáng</td><td>candela</td><td>cd</td></tr>
  </tbody>
</table>
<div class="callout"><strong>Chỉ ampe là đơn vị điện cơ bản.</strong> Volt, ohm, watt, coulomb, farad, henry, hertz đều là đơn vị <em>dẫn xuất</em> — mỗi cái là cách viết gọn của một tổ hợp mét, kilôgam, giây và ampe. Đây không phải chuyện bên lề: chính vì thế mà đơn vị trong một công thức đúng luôn triệt tiêu gọn gàng, và một công thức sai thường tự tố giác bằng việc ra đơn vị sai.</div>
<h3>Các đơn vị dẫn xuất bạn dùng hằng tuần</h3>
<table>
  <thead><tr><th>Đại lượng</th><th>Ký hiệu</th><th>Đơn vị</th><th>Viết tắt</th><th>Tương đương</th></tr></thead>
  <tbody>
    <tr><td>Điện tích</td><td>Q</td><td>coulomb</td><td>C</td><td>1 C = 1 A x 1 s (một ampe chảy trong một giây)</td></tr>
    <tr><td>Điện áp (hiệu điện thế, sức điện động)</td><td>V</td><td>volt</td><td>V</td><td>1 V = 1 joule trên mỗi coulomb</td></tr>
    <tr><td>Điện trở</td><td>R</td><td>ohm</td><td>ohm</td><td>1 ohm = 1 V trên mỗi A</td></tr>
    <tr><td>Công suất</td><td>P</td><td>watt</td><td>W</td><td>1 W = 1 J mỗi giây = 1 V x 1 A</td></tr>
    <tr><td>Điện dung</td><td>C</td><td>farad</td><td>F</td><td>1 F = 1 coulomb trên mỗi volt</td></tr>
    <tr><td>Điện cảm</td><td>L</td><td>henry</td><td>H</td><td>1 H = 1 weber trên mỗi ampe</td></tr>
    <tr><td>Tần số</td><td>f</td><td>hertz</td><td>Hz</td><td>1 Hz = 1 chu kỳ mỗi giây</td></tr>
    <tr><td>Từ thông</td><td>(phi)</td><td>weber</td><td>Wb</td><td>"tổng lượng" từ</td></tr>
    <tr><td>Mật độ từ thông</td><td>B</td><td>tesla</td><td>T</td><td>1 T = 1 Wb trên mỗi mét vuông</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Trên web này ký hiệu ohm được viết bằng chữ "ohm" và các chữ Hy Lạp viết bằng Latin (pi, phi, mu viết là "u") để trang hiện đúng trên mọi máy. Sách và đề thi của bạn sẽ dùng ký hiệu Hy Lạp.</p>
<h3>Bội số và ước số — cái bẫy thật sự trong phòng thi</h3>
<p>Điện tử trải khoảng 18 bậc độ lớn: dòng rỉ picoampe của một cảm biến và trăm ampe của củ đề đều được gọi là "dòng điện". Các tiền tố giữ cho con số còn đọc được.</p>
<table>
  <thead><tr><th>Tiền tố</th><th>Ký hiệu</th><th>Hệ số</th><th>Bạn gặp nó ở</th></tr></thead>
  <tbody>
    <tr><td>giga</td><td>G</td><td>10^9</td><td>GHz — vô tuyến, xung nhịp</td></tr>
    <tr><td>mega</td><td><strong>M</strong></td><td>10^6</td><td>điện trở Mohm, MHz</td></tr>
    <tr><td>kilo</td><td>k</td><td>10^3</td><td>kohm — cỡ điện trở thường gặp nhất</td></tr>
    <tr><td>—</td><td>—</td><td>1</td><td>V, A, ohm, W</td></tr>
    <tr><td>milli</td><td><strong>m</strong></td><td>10^-3</td><td>mA, mV, mH</td></tr>
    <tr><td>micro</td><td>u (chữ mu Hy Lạp)</td><td>10^-6</td><td>tụ uF, uA</td></tr>
    <tr><td>nano</td><td>n</td><td>10^-9</td><td>tụ nF, ns</td></tr>
    <tr><td>pico</td><td>p</td><td>10^-12</td><td>tụ pF, dòng rỉ pA</td></tr>
  </tbody>
</table>
<h3>Đổi đơn vị, từng bước</h3>
<div class="formula">Từ giá trị có tiền tố về đơn vị gốc thì NHÂN với hệ số của tiền tố. Đi chiều ngược lại thì CHIA.</div>
<pre><code class="language-text">0.000015 A  -&gt; bao nhiêu microampe?
    1 uA = 10^-6 A, nên chia cho 10^-6:
    0.000015 / 0.000001 = 15          =&gt; 15 uA

47 kohm     -&gt; bao nhiêu ohm?
    47 x 10^3 = 47000                 =&gt; 47000 ohm

2.2 Mohm    -&gt; bao nhiêu ohm?
    2.2 x 10^6 = 2200000              =&gt; 2 200 000 ohm

100 nF      -&gt; bao nhiêu uF?
    100 x 10^-9 = 0.0000001 F
    0.0000001 / 10^-6 = 0.1           =&gt; 0.1 uF</code></pre>
<div class="out">15 uA · 47000 ohm · 2 200 000 ohm · 0,1 uF</div>
<p>Cặp cuối cùng nên học thuộc: <strong>100 nF = 0,1 uF</strong>. Cùng một con tụ được in theo cả hai cách tuỳ nhà sản xuất, và lẫn hai cách đó là lệch nghìn lần — một lỗi báo cáo Lab kinh điển.</p>
<div class="pitfall"><b>m không phải M.</b> <code>10 mA</code> là mười phần nghìn ampe; <code>10 MA</code> sẽ là mười triệu ampe. milli viết thường, mega viết hoa — luôn luôn. <b>Đừng trộn tiền tố trong một công thức.</b> Đưa mọi đại lượng về đơn vị gốc (V, A, ohm) rồi mới chia; "12 V chia 100 kohm" không ra 0,12 của cái gì cả. <b>Chữ k đứng một mình không có nghĩa.</b> Trên sơ đồ, điện trở ghi "10k" nghĩa là 10 kohm, nhưng trong câu trả lời viết ra thì phải có đơn vị — đáp án "0,12" không kèm đơn vị thì không phải một dòng điện. <b>Coi kỹ cách ghi tắt trên linh kiện.</b> "4k7" là 4,7 kohm và "R47" là 0,47 ohm; chữ cái nằm đúng chỗ của dấu thập phân.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Viết 0,000 000 022 F ra nanofarad và ra picofarad.</p>
<div class="dap-an"><pre><code class="language-text">0.000000022 F = 22 x 10^-9 F      =&gt; 22 nF
                = 22000 x 10^-12 F  =&gt; 22000 pF</code></pre>
<p>Đi từ nano xuống pico là thêm ba bậc thập phân, nên con số to lên nghìn lần trong khi con tụ thật không đổi chút nào. Cả hai cách ghi đều có trên linh kiện thật.</p></div>
<p><b>E2.</b> Có 0,5 C điện tích đi qua một điểm trong 10 s. Dòng điện bằng bao nhiêu miliampe?</p>
<div class="dap-an"><pre><code class="language-text">I = Q / t = 0.5 C / 10 s = 0.05 A
0.05 A = 50 x 10^-3 A     =&gt; 50 mA</code></pre>
<p>Đây chính là định nghĩa của ampe đang làm việc: <strong>dòng điện là điện tích mỗi giây</strong>. Để ý đơn vị tự triệt tiêu — coulomb chia giây <em>chính là</em> ampe, và đó là một phép kiểm miễn phí xem công thức có bị lộn ngược hay không.</p></div>
<p><b>E3.</b> Cái nào lớn hơn: 470 kohm hay 0,47 Mohm?</p>
<div class="dap-an"><p><strong>Bằng nhau.</strong> 470 x 10^3 = 470 000 và 0,47 x 10^6 = 470 000. Cả hai cách đều được in trên điện trở thật; cùng một linh kiện có thể mang một trong hai nhãn.</p></div>`,
  ]]);

/* ── 1.2 buổi 2 — CLO1 (slug cũ: eei101-1-1-quantities-laws) ─────────────── */
const l12 = doc('eei101-1-1-quantities-laws',
  '1.2 — Voltage, current, resistance, Ohm\'s Law, fields & circuit diagrams|||1.2 — Điện áp, dòng điện, điện trở, định luật Ohm, điện/từ trường & sơ đồ mạch',
  'Buổi 2, CLO1, Tooley 1.2–1.6: vật dẫn và vật cách điện, ba đại lượng áp/dòng/trở và định luật Ohm với ví dụ tính có số thật, công suất, điện trường E = V/d, từ trường và mật độ từ thông B, cách đọc sơ đồ mạch. Có bài tập giải từng bước.',
  [[
    `<span class="eyebrow">EEI101 · Session 2 · CLO1</span>
<h2>The four quantities, one law, and how to read a circuit diagram</h2>
<p class="lead">This is the most important session of the course. After it you can calculate any one of voltage, current and resistance from the other two, work out the power a component must survive, and read a schematic well enough to build it in a simulator.</p>
<p class="nhan">${NGUON} · session 2 — "1.2 Conductors, insulators, voltage and resistance; 1.3 Ohm's Law; 1.4 Electric fields; 1.5 Magnetic fields; 1.6 Circuit diagrams"</p>
<h3>1.2 Conductors and insulators</h3>
<p>In some materials the outer electrons of each atom are barely held and can drift freely; apply a voltage and you get a current. Those are <strong>conductors</strong> — copper, aluminium, silver, and the carbon in a pencil. In others every electron is locked into a bond, so almost nothing moves: <strong>insulators</strong> — plastic, glass, rubber, dry air. In between sit the <strong>semiconductors</strong> (silicon, germanium), which conduct only a little until you do something to them; that "something" is chapter 7 and the entire electronics industry.</p>
<table>
  <thead><tr><th>Class</th><th>Examples</th><th>Job in a circuit</th></tr></thead>
  <tbody>
    <tr><td>Conductor</td><td>copper, aluminium, gold</td><td>wires, tracks, contacts — carry current with as little loss as possible</td></tr>
    <tr><td>Resistive conductor</td><td>carbon, nichrome, metal film</td><td>resistors, heating elements — conduct a <em>controlled</em> amount</td></tr>
    <tr><td>Insulator</td><td>PVC, glass, ceramic, air</td><td>keep current where it belongs; the dielectric inside a capacitor</td></tr>
    <tr><td>Semiconductor</td><td>silicon, germanium</td><td>diodes, transistors, every chip (chapter 7)</td></tr>
  </tbody>
</table>
<h3>Voltage, current and resistance</h3>
<p>One picture makes all three behave sensibly. Think of water in a pipe: <strong>voltage</strong> is the pressure that pushes, <strong>current</strong> is how much water flows per second, and <strong>resistance</strong> is how narrow the pipe is. Pressure can exist with no flow (a closed tap); flow cannot exist without pressure.</p>
<table>
  <thead><tr><th>Quantity</th><th>Symbol</th><th>Unit</th><th>Measured how</th><th>Water analogy</th></tr></thead>
  <tbody>
    <tr><td>Voltage (potential difference)</td><td>V</td><td>volt (V)</td><td>voltmeter <strong>across</strong> the component</td><td>pressure difference</td></tr>
    <tr><td>Current</td><td>I</td><td>ampere (A)</td><td>ammeter <strong>in series</strong>, in the path</td><td>litres per second</td></tr>
    <tr><td>Resistance</td><td>R</td><td>ohm</td><td>ohmmeter, component disconnected</td><td>narrowness of the pipe</td></tr>
    <tr><td>Power</td><td>P</td><td>watt (W)</td><td>calculated, not usually measured</td><td>how fast energy is spent</td></tr>
  </tbody>
</table>
<div class="callout"><strong>Voltage is always "between two points".</strong> A single point does not have a voltage until you say what it is measured against — which is why every circuit has a reference node called <strong>ground</strong> (0 V). "The voltage at pin 3" is shorthand for "the voltage between pin 3 and ground".</div>
<h3>1.3 Ohm's Law</h3>
<div class="formula">V = I x R &nbsp;&nbsp;·&nbsp;&nbsp; I = V / R &nbsp;&nbsp;·&nbsp;&nbsp; R = V / I</div>
<p>Three ways of writing one fact: in a resistor, current is proportional to voltage. Alongside it, the power a component turns into heat:</p>
<div class="formula">P = V x I &nbsp;&nbsp;·&nbsp;&nbsp; P = I^2 x R &nbsp;&nbsp;·&nbsp;&nbsp; P = V^2 / R</div>
<p><strong>Worked example 1 — find the current and the power.</strong> A 12 V battery is connected across a single 100 ohm resistor.</p>
<pre><code class="language-text">Given:  V = 12 V, R = 100 ohm
I = V / R      = 12 / 100        = 0.12 A   = 120 mA
P = V x I      = 12 x 0.12       = 1.44 W
check: P = I^2 x R = 0.12^2 x 100 = 1.44 W  (agrees)
check: P = V^2 / R = 144 / 100    = 1.44 W  (agrees)</code></pre>
<div class="out">I = 120 mA · P = 1.44 W</div>
<p>Three formulas for power, one answer — always compute it twice by different routes. It costs ten seconds and catches almost every arithmetic slip.</p>
<p><strong>Worked example 2 — a resistor that is too small will burn.</strong> A 470 ohm resistor sits across a 9 V battery.</p>
<pre><code class="language-text">I = V / R = 9 / 470     = 0.019149 A  = 19.1 mA  (3 s.f.)
P = V^2 / R = 81 / 470  = 0.172340 W  = 172 mW
A 0.25 W resistor survives 172 mW; a 0.125 W one does not.</code></pre>
<div class="out">I = 19.1 mA · P = 172 mW -&gt; use a 0.25 W part or bigger</div>
<p><strong>Worked example 3 — sizing the resistor for an LED.</strong> An LED needs 15 mA and drops 2 V. The supply is 5 V. What series resistor?</p>
<pre><code class="language-text">Voltage left for the resistor = 5 - 2 = 3 V
R = V / I = 3 / 0.015 = 200 ohm
Nearest standard value: 220 ohm (which gives slightly less current - safe)
Power in the resistor: P = V x I = 3 x 0.015 = 0.045 W = 45 mW</code></pre>
<div class="out">R = 200 ohm (use 220 ohm), dissipating 45 mW</div>
<p>This calculation is the single most-performed piece of arithmetic in electronics, and it is nothing but Ohm's law applied to the <em>leftover</em> voltage.</p>
<h3>1.4 Electric fields</h3>
<p>Put a voltage across two plates with a gap and the space between them is no longer empty — it carries an <strong>electric field</strong>, the thing that would push a charge if you put one there. Its strength is</p>
<div class="formula">E = V / d &nbsp;&nbsp;(volts per metre)</div>
<pre><code class="language-text">12 V across a gap of 0.5 mm:
d = 0.5 mm = 0.0005 m
E = 12 / 0.0005 = 24000 V/m = 24 kV/m</code></pre>
<div class="out">E = 24 kV/m</div>
<p>Two consequences you will meet again. First, a thin insulator in a strong field <strong>breaks down</strong> and conducts — which is why capacitors have a maximum voltage rating. Second, the field between plates is exactly what stores energy in a capacitor (chapter 4).</p>
<h3>1.5 Magnetic fields</h3>
<p>A current always produces a <strong>magnetic field</strong> around itself — wrap the wire into a coil and the fields add up into something strong enough to move an armature. Two quantities matter: total <strong>flux</strong> (phi, in webers) and <strong>flux density</strong></p>
<div class="formula">B = phi / A &nbsp;&nbsp;(teslas = webers per square metre)</div>
<pre><code class="language-text">A flux of 0.5 mWb passes through a pole face of 2 cm^2:
phi = 0.5 mWb = 0.0005 Wb
A   = 2 cm^2  = 0.0002 m^2
B   = 0.0005 / 0.0002 = 2.5 T</code></pre>
<div class="out">B = 2.5 T</div>
<p>Note the unit conversion, because it is where this calculation usually goes wrong: 1 cm^2 is 10^-4 m^2, not 10^-2. Magnetism is how motors, relays, loudspeakers and transformers (session 20) work, and it is why a coil resists a <em>change</em> of current — the inductor of session 14.</p>
<h3>1.6 Reading a circuit diagram</h3>
<p>A schematic is not a picture of the board; it is a map of <em>connections</em>. Lines are wires with no resistance, a dot means a real junction, and crossing lines with no dot are not connected.</p>
<table>
  <thead><tr><th>Symbol (as drawn)</th><th>Component</th><th>What to notice</th></tr></thead>
  <tbody>
    <tr><td>long line + short line</td><td>cell / battery</td><td>the LONG line is positive</td></tr>
    <tr><td>rectangle (or zig-zag)</td><td>resistor</td><td>no polarity — either way round</td></tr>
    <tr><td>two parallel lines</td><td>capacitor</td><td>if one plate is curved or marked +, it is polarised: fitting it backwards can destroy it</td></tr>
    <tr><td>coil of loops</td><td>inductor</td><td>a straight bar beside it means an iron core</td></tr>
    <tr><td>triangle + bar</td><td>diode</td><td>current flows toward the bar only; the bar is the cathode</td></tr>
    <tr><td>three horizontal lines, shrinking</td><td>ground (0 V)</td><td>every ground symbol on the sheet is the SAME node</td></tr>
  </tbody>
</table>
<div class="diagram"><pre>   +9V o----+
            |
           [ ] R1  470 ohm
            |
            +----o Vout   (this node is 'across R2')
            |
           [ ] R2  470 ohm
            |
          --+--  GND (0 V)</pre></div>
<p>Read it as a sentence: 9 volts pushes current down through R1 and R2 in series to ground. Two equal resistors, so each takes half the voltage — Vout is 4.5 V. That is the <strong>voltage divider</strong>, and you have just done chapter 5 a fortnight early.</p>
<div class="pitfall"><b>Mixing prefixes in Ohm's law.</b> 9 V across 470 ohm is 19.1 <em>milli</em>amps, not 19.1 amps; if you type 470 into a calculator while thinking "kohm" you land a thousand times out. <b>Forgetting the power rating.</b> The resistance tells you the current; only P = V x I tells you whether the part survives. A correct value with a burnt resistor is still a failed Lab. <b>Treating voltage as a property of one point.</b> It is always a difference; without a ground reference, "5 V here" says nothing. <b>Assuming crossing lines connect.</b> On a schematic, no dot means no connection — this single misreading is the most common reason a simulated circuit "should work" and does not.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A car side-light lamp is rated 12 V, 21 W. Find its operating current and its hot resistance.</p>
<div class="dap-an"><pre><code class="language-text">P = V x I  =&gt;  I = P / V = 21 / 12 = 1.75 A
R = V / I  = 12 / 1.75 = 6.857 ohm  (about 6.9 ohm)</code></pre>
<p>Two steps, each one formula. Note this is the <em>hot</em> resistance: a cold filament measures far less, which is why lamps draw a surge at switch-on. Measuring a cold lamp with an ohmmeter and expecting 6.9 ohm is a classic surprise.</p></div>
<p><b>E2.</b> A 1.2 kohm resistor is connected across a 24 V supply. Find the current, the power dissipated, and choose a power rating.</p>
<div class="dap-an"><pre><code class="language-text">R = 1.2 kohm = 1200 ohm
I = V / R = 24 / 1200 = 0.02 A = 20 mA
P = V x I = 24 x 0.02 = 0.48 W
check: P = I^2 x R = 0.02^2 x 1200 = 0.48 W  (agrees)

0.48 W is more than half of a 0.5 W rating, so it would run hot.
Rule of thumb (ours): pick at least twice the calculated power
-&gt; use a 1 W resistor.</code></pre>
<div class="out">I = 20 mA · P = 0.48 W · choose a 1 W resistor</div>
<p>The habit worth forming: convert kohm to ohm <em>first</em>, compute, then check the power by a second formula.</p></div>
<p><b>E3.</b> A voltmeter reads 6 V across a resistor while an ammeter in series reads 4 mA. What is the resistance?</p>
<div class="dap-an"><pre><code class="language-text">R = V / I = 6 / 0.004 = 1500 ohm = 1.5 kohm</code></pre>
<p>This is exactly what session 3's practical investigation does: measure V and I, divide, and you have measured a resistance without an ohmmeter.</p></div>`,
    `<span class="eyebrow">EEI101 · Buổi 2 · CLO1</span>
<h2>Bốn đại lượng, một định luật, và cách đọc sơ đồ mạch</h2>
<p class="lead">Đây là buổi quan trọng nhất của cả môn. Học xong bạn tính được bất kỳ một trong ba đại lượng áp/dòng/trở từ hai cái còn lại, tính được công suất mà linh kiện phải chịu, và đọc được sơ đồ đủ để dựng lại nó trong phần mềm mô phỏng.</p>
<p class="nhan">${NGUON} · buổi 2 — "1.2 Conductors, insulators, voltage and resistance; 1.3 Ohm's Law; 1.4 Electric fields; 1.5 Magnetic fields; 1.6 Circuit diagrams"</p>
<h3>1.2 Vật dẫn và vật cách điện</h3>
<p>Ở một số vật liệu, các electron ngoài cùng của mỗi nguyên tử bị giữ rất lỏng và trôi tự do được; đặt vào một điện áp là có dòng. Đó là <strong>vật dẫn (conductor)</strong> — đồng, nhôm, bạc, và cả than chì trong ruột bút chì. Ở vật liệu khác, mọi electron đều bị khoá vào liên kết nên gần như không gì dịch chuyển: <strong>vật cách điện (insulator)</strong> — nhựa, thuỷ tinh, cao su, không khí khô. Giữa hai loại đó là <strong>bán dẫn (semiconductor)</strong> (silic, germani), dẫn rất ít cho tới khi ta làm gì đó với nó; "làm gì đó" ấy là chương 7 và là cả ngành công nghiệp điện tử.</p>
<table>
  <thead><tr><th>Loại</th><th>Ví dụ</th><th>Việc của nó trong mạch</th></tr></thead>
  <tbody>
    <tr><td>Vật dẫn</td><td>đồng, nhôm, vàng</td><td>dây, đường mạch, tiếp điểm — dẫn dòng với tổn thất nhỏ nhất có thể</td></tr>
    <tr><td>Vật dẫn có điện trở</td><td>than (carbon), nichrome, màng kim loại</td><td>điện trở, dây điện trở nhiệt — dẫn một lượng <em>có kiểm soát</em></td></tr>
    <tr><td>Vật cách điện</td><td>PVC, thuỷ tinh, sứ, không khí</td><td>giữ dòng đi đúng chỗ; là chất điện môi trong tụ điện</td></tr>
    <tr><td>Bán dẫn</td><td>silic, germani</td><td>diode, transistor, mọi con chip (chương 7)</td></tr>
  </tbody>
</table>
<h3>Điện áp, dòng điện và điện trở</h3>
<p>Một hình ảnh làm cả ba đại lượng trở nên dễ hiểu. Hãy nghĩ tới nước trong ống: <strong>điện áp</strong> là áp lực đẩy, <strong>dòng điện</strong> là lượng nước chảy qua mỗi giây, và <strong>điện trở</strong> là độ hẹp của ống. Áp lực có thể tồn tại mà không có dòng chảy (khoá vòi lại); dòng chảy thì không thể có mà không có áp lực.</p>
<table>
  <thead><tr><th>Đại lượng</th><th>Ký hiệu</th><th>Đơn vị</th><th>Đo thế nào</th><th>Ví von với nước</th></tr></thead>
  <tbody>
    <tr><td>Điện áp (hiệu điện thế)</td><td>V</td><td>volt (V)</td><td>vôn kế mắc <strong>song song</strong> (ngang qua) linh kiện</td><td>chênh áp lực</td></tr>
    <tr><td>Dòng điện</td><td>I</td><td>ampe (A)</td><td>ampe kế mắc <strong>nối tiếp</strong>, nằm trên đường đi của dòng</td><td>lít mỗi giây</td></tr>
    <tr><td>Điện trở</td><td>R</td><td>ohm</td><td>đồng hồ đo trở, linh kiện phải tháo khỏi mạch</td><td>độ hẹp của ống</td></tr>
    <tr><td>Công suất</td><td>P</td><td>watt (W)</td><td>thường tính ra, không đo trực tiếp</td><td>năng lượng bị tiêu nhanh cỡ nào</td></tr>
  </tbody>
</table>
<div class="callout"><strong>Điện áp luôn là "giữa hai điểm".</strong> Một điểm đơn lẻ chưa có điện áp cho tới khi bạn nói nó được đo so với cái gì — chính vì thế mọi mạch đều có một nút tham chiếu gọi là <strong>đất (ground, 0 V)</strong>. "Điện áp tại chân 3" là cách nói gọn của "điện áp giữa chân 3 và đất".</div>
<h3>1.3 Định luật Ohm</h3>
<div class="formula">V = I x R &nbsp;&nbsp;·&nbsp;&nbsp; I = V / R &nbsp;&nbsp;·&nbsp;&nbsp; R = V / I</div>
<p>Ba cách viết của cùng một sự thật: trong một điện trở, dòng điện tỉ lệ với điện áp. Đi kèm nó là công suất mà linh kiện biến thành nhiệt:</p>
<div class="formula">P = V x I &nbsp;&nbsp;·&nbsp;&nbsp; P = I^2 x R &nbsp;&nbsp;·&nbsp;&nbsp; P = V^2 / R</div>
<p><strong>Ví dụ 1 — tìm dòng và công suất.</strong> Một pin 12 V nối vào một điện trở 100 ohm.</p>
<pre><code class="language-text">Cho:  V = 12 V, R = 100 ohm
I = V / R      = 12 / 100        = 0.12 A   = 120 mA
P = V x I      = 12 x 0.12       = 1.44 W
kiem: P = I^2 x R = 0.12^2 x 100 = 1.44 W  (khop)
kiem: P = V^2 / R = 144 / 100    = 1.44 W  (khop)</code></pre>
<div class="out">I = 120 mA · P = 1,44 W</div>
<p>Ba công thức công suất, một đáp án — hãy luôn tính lại bằng một đường khác. Mất mười giây và bắt được gần hết mọi lỗi số học.</p>
<p><strong>Ví dụ 2 — chọn điện trở quá nhỏ là cháy.</strong> Một điện trở 470 ohm nối vào pin 9 V.</p>
<pre><code class="language-text">I = V / R = 9 / 470     = 0.019149 A  = 19.1 mA  (3 chu so co nghia)
P = V^2 / R = 81 / 470  = 0.172340 W  = 172 mW
Dien tro 0.25 W chiu duoc 172 mW; loai 0.125 W thi khong.</code></pre>
<div class="out">I = 19,1 mA · P = 172 mW -&gt; phải dùng loại 0,25 W trở lên</div>
<p><strong>Ví dụ 3 — tính điện trở hạn dòng cho LED.</strong> Một LED cần 15 mA và sụt 2 V. Nguồn 5 V. Điện trở nối tiếp bằng bao nhiêu?</p>
<pre><code class="language-text">Dien ap con lai cho dien tro = 5 - 2 = 3 V
R = V / I = 3 / 0.015 = 200 ohm
Gia tri chuan gan nhat: 220 ohm (cho dong nho hon chut - an toan)
Cong suat tren dien tro: P = V x I = 3 x 0.015 = 0.045 W = 45 mW</code></pre>
<div class="out">R = 200 ohm (dùng 220 ohm), tiêu tán 45 mW</div>
<p>Đây là phép tính được làm nhiều nhất trong điện tử, và nó không là gì khác ngoài định luật Ohm áp lên phần điện áp <em>còn dư</em>.</p>
<h3>1.4 Điện trường</h3>
<p>Đặt một điện áp lên hai bản cực có khe hở thì khoảng không giữa chúng không còn "trống" — nó mang một <strong>điện trường (electric field)</strong>, thứ sẽ đẩy một điện tích nếu bạn đặt điện tích vào đó. Cường độ của nó là</p>
<div class="formula">E = V / d &nbsp;&nbsp;(volt trên mét)</div>
<pre><code class="language-text">12 V dat len khe ho 0.5 mm:
d = 0.5 mm = 0.0005 m
E = 12 / 0.0005 = 24000 V/m = 24 kV/m</code></pre>
<div class="out">E = 24 kV/m</div>
<p>Hai hệ quả bạn sẽ gặp lại. Thứ nhất, một lớp cách điện mỏng nằm trong điện trường mạnh sẽ <strong>đánh xuyên (breakdown)</strong> và dẫn điện — đó là lý do tụ điện có thông số điện áp tối đa. Thứ hai, chính điện trường giữa hai bản cực là nơi tụ điện trữ năng lượng (chương 4).</p>
<h3>1.5 Từ trường</h3>
<p>Dòng điện luôn sinh ra một <strong>từ trường (magnetic field)</strong> quanh nó — cuộn dây lại thành vòng thì các từ trường cộng dồn thành thứ đủ mạnh để hút một lõi sắt. Hai đại lượng cần nhớ: <strong>từ thông</strong> tổng (phi, đơn vị weber) và <strong>mật độ từ thông</strong></p>
<div class="formula">B = phi / A &nbsp;&nbsp;(tesla = weber trên mét vuông)</div>
<pre><code class="language-text">Tu thong 0.5 mWb di qua mat cuc 2 cm^2:
phi = 0.5 mWb = 0.0005 Wb
A   = 2 cm^2  = 0.0002 m^2
B   = 0.0005 / 0.0002 = 2.5 T</code></pre>
<div class="out">B = 2,5 T</div>
<p>Để ý phép đổi đơn vị, vì đó là chỗ phép tính này thường sai: 1 cm^2 là 10^-4 m^2, không phải 10^-2. Từ trường là cách động cơ, rơ-le, loa và biến áp (buổi 20) làm việc, và nó là lý do một cuộn dây chống lại sự <em>thay đổi</em> của dòng — cuộn cảm của buổi 14.</p>
<h3>1.6 Đọc một sơ đồ mạch</h3>
<p>Sơ đồ mạch không phải ảnh của bo mạch; nó là bản đồ các <em>kết nối</em>. Đường kẻ là dây không có điện trở, một dấu chấm nghĩa là có nối thật, và hai đường cắt nhau mà không có chấm thì KHÔNG nối.</p>
<table>
  <thead><tr><th>Ký hiệu (cách vẽ)</th><th>Linh kiện</th><th>Điều cần để ý</th></tr></thead>
  <tbody>
    <tr><td>một vạch dài + một vạch ngắn</td><td>pin / nguồn một chiều</td><td>vạch DÀI là cực dương</td></tr>
    <tr><td>hình chữ nhật (hoặc đường gấp khúc)</td><td>điện trở</td><td>không có cực — lắp chiều nào cũng được</td></tr>
    <tr><td>hai vạch song song</td><td>tụ điện</td><td>nếu một bản cong hoặc có dấu +, đó là tụ có cực: lắp ngược có thể làm nổ tụ</td></tr>
    <tr><td>chuỗi vòng xoắn</td><td>cuộn cảm</td><td>có thêm một vạch thẳng bên cạnh nghĩa là có lõi sắt</td></tr>
    <tr><td>tam giác + vạch</td><td>diode</td><td>dòng chỉ chảy theo chiều về phía vạch; vạch đó là cực cathode</td></tr>
    <tr><td>ba vạch ngang, ngắn dần</td><td>đất (ground, 0 V)</td><td>mọi ký hiệu đất trên cùng bản vẽ đều là CÙNG MỘT nút</td></tr>
  </tbody>
</table>
<div class="diagram"><pre>   +9V o----+
            |
           [ ] R1  470 ohm
            |
            +----o Vout   (nut nay nam 'ngang qua R2')
            |
           [ ] R2  470 ohm
            |
          --+--  GND (0 V)</pre></div>
<p>Hãy đọc nó như một câu: 9 volt đẩy dòng đi xuống qua R1 rồi R2 nối tiếp về đất. Hai điện trở bằng nhau nên mỗi con lấy một nửa điện áp — Vout bằng 4,5 V. Đó chính là <strong>bộ chia áp (voltage divider)</strong>, và bạn vừa học trước chương 5 hai tuần.</p>
<div class="pitfall"><b>Trộn tiền tố trong định luật Ohm.</b> 9 V trên 470 ohm là 19,1 <em>mili</em>ampe, không phải 19,1 ampe; nếu bấm máy tính số 470 mà trong đầu nghĩ "kohm" thì bạn lệch một nghìn lần. <b>Quên thông số công suất.</b> Điện trở cho bạn biết dòng; chỉ P = V x I mới cho biết linh kiện có sống nổi hay không. Trị số đúng mà điện trở cháy thì bài Lab vẫn trượt. <b>Coi điện áp là thuộc tính của một điểm.</b> Nó luôn là một chênh lệch; không có mốc đất thì "5 V ở đây" chẳng nói gì. <b>Tưởng hai đường cắt nhau là nối nhau.</b> Trên sơ đồ, không có chấm là không nối — riêng cái đọc sai này là lý do phổ biến nhất khiến một mạch mô phỏng "đúng ra phải chạy" mà không chạy.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Một bóng đèn hậu xe hơi ghi 12 V, 21 W. Tìm dòng làm việc và điện trở khi nóng của nó.</p>
<div class="dap-an"><pre><code class="language-text">P = V x I  =&gt;  I = P / V = 21 / 12 = 1.75 A
R = V / I  = 12 / 1.75 = 6.857 ohm  (khoang 6.9 ohm)</code></pre>
<p>Hai bước, mỗi bước một công thức. Chú ý đây là điện trở khi <em>nóng</em>: dây tóc nguội đo ra nhỏ hơn nhiều, và đó là lý do bóng đèn rút một dòng vọt lên lúc mới bật. Đo bóng đèn nguội bằng đồng hồ rồi trông đợi 6,9 ohm là một cú bất ngờ kinh điển.</p></div>
<p><b>E2.</b> Một điện trở 1,2 kohm nối vào nguồn 24 V. Tìm dòng, công suất tiêu tán, và chọn thông số công suất cho nó.</p>
<div class="dap-an"><pre><code class="language-text">R = 1.2 kohm = 1200 ohm
I = V / R = 24 / 1200 = 0.02 A = 20 mA
P = V x I = 24 x 0.02 = 0.48 W
kiem: P = I^2 x R = 0.02^2 x 1200 = 0.48 W  (khop)

0.48 W da qua nua cua loai 0.5 W, nen no se rat nong.
Kinh nghiem (cua web): chon it nhat gap doi cong suat tinh duoc
-&gt; dung dien tro 1 W.</code></pre>
<div class="out">I = 20 mA · P = 0,48 W · chọn điện trở 1 W</div>
<p>Thói quen nên tạo: đổi kohm về ohm <em>trước</em>, rồi tính, rồi kiểm lại công suất bằng một công thức thứ hai.</p></div>
<p><b>E3.</b> Vôn kế đọc 6 V trên một điện trở, còn ampe kế mắc nối tiếp đọc 4 mA. Điện trở bằng bao nhiêu?</p>
<div class="dap-an"><pre><code class="language-text">R = V / I = 6 / 0.004 = 1500 ohm = 1.5 kohm</code></pre>
<p>Đây đúng là việc mà phần thực hành khảo sát của buổi 3 làm: đo V và I, chia cho nhau, thế là đo được điện trở mà không cần đồng hồ đo trở.</p></div>`,
  ]]);

/* ── 1.3 buổi 3 — CLO1 ───────────────────────────────────────────────────── */
const l13 = doc('eei101-1-3-khao-sat-va-bai-tap-dien-co-ban',
  '1.3 — Practical investigation: proving Ohm\'s Law, and problems|||1.3 — Thực hành khảo sát: chứng minh định luật Ohm, và bài tập',
  'Buổi 3, CLO1, Tooley 1.7: dựng bảng đo V–I của một điện trở và suy ra R từ độ nghiêng, vì sao một bóng đèn KHÔNG tuân theo đường thẳng, công suất và điện năng (kWh), bộ bài tập tổng hợp có lời giải từng bước.',
  [[
    `<span class="eyebrow">EEI101 · Session 3 · CLO1</span>
<h2>Practical investigation: does Ohm's Law actually hold?</h2>
<p class="lead">After this session you can run the classic V–I experiment, get a resistance out of a table of measurements instead of a single reading, and explain why the same experiment on a lamp gives a curve rather than a straight line.</p>
<p class="nhan">${NGUON} · session 3 — "1.7 Practical investigation &amp; Problems"</p>
<h3>The experiment</h3>
<p>Wire a variable supply to a resistor with an <strong>ammeter in series</strong> and a <strong>voltmeter across</strong> the resistor. Raise the supply in steps and record both readings. You can do this on a bench or in Tinkercad in about ten minutes; the point is the <em>table</em>, not any one reading.</p>
<div class="diagram"><pre>  variable      (A)  ammeter IN SERIES
   supply  o----(A)----+
                       |
                      [ ] R = 1 kohm   (V) voltmeter ACROSS R
                       |         |
                       +---------+
                       |
                     --+--  0 V</pre></div>
<table>
  <thead><tr><th>Step</th><th>V (measured)</th><th>I (measured)</th><th>V / I</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>2.0 V</td><td>2.0 mA</td><td>1000 ohm</td></tr>
    <tr><td>2</td><td>4.0 V</td><td>4.0 mA</td><td>1000 ohm</td></tr>
    <tr><td>3</td><td>6.0 V</td><td>6.0 mA</td><td>1000 ohm</td></tr>
    <tr><td>4</td><td>8.0 V</td><td>8.0 mA</td><td>1000 ohm</td></tr>
    <tr><td>5</td><td>10.0 V</td><td>10.0 mA</td><td>1000 ohm</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Idealised figures for teaching the method. On real hardware you will read 1.98 V / 2.01 mA and so on — see session 9 for how much error to expect and why.</p>
<p><strong>The conclusion, and how to state it properly.</strong> V/I is constant, so the resistor is <strong>linear (ohmic)</strong>, and the constant is its resistance. Plotted, V against I is a straight line through the origin whose slope is R:</p>
<pre><code class="language-text">R = (change in V) / (change in I)
  = (10.0 - 2.0) V / (10.0 - 2.0) mA
  = 8.0 V / 0.008 A
  = 1000 ohm</code></pre>
<div class="out">R = 1000 ohm = 1 kohm</div>
<div class="note-ct">Why use the slope rather than one row? (our note) Because a single division carries the error of both meters at that one point, while the slope over a wide span averages them out and, more importantly, it <strong>cancels any fixed offset</strong> — if a meter reads 0.1 V high at every step, every V/I row is wrong but the slope is still right. This is the first piece of real laboratory technique in the course, and it is worth marks in every Lab report you write.</div>
<h3>The same experiment on a lamp — and why it bends</h3>
<p>Repeat it with a 12 V filament lamp and V/I is <em>not</em> constant: it rises as the voltage rises. Nothing is broken and Ohm's Law is not violated — R is simply not constant, because the filament gets hotter and a hot metal has a higher resistivity. Ohm's Law still describes the resistor <em>at that moment</em>; what fails is the assumption that R is a fixed number.</p>
<table>
  <thead><tr><th>Device</th><th>V–I graph</th><th>Called</th></tr></thead>
  <tbody>
    <tr><td>Metal-film resistor</td><td>straight line through origin</td><td>linear / ohmic</td></tr>
    <tr><td>Filament lamp</td><td>curve, flattening as V rises</td><td>non-linear (temperature effect)</td></tr>
    <tr><td>Diode (chapter 7)</td><td>almost nothing, then a sudden rise near 0.7 V</td><td>non-linear (junction)</td></tr>
  </tbody>
</table>
<h3>Power and energy — different questions</h3>
<div class="formula">P = V x I &nbsp;(watts, how fast energy is used) &nbsp;&nbsp;·&nbsp;&nbsp; W = P x t &nbsp;(energy used)</div>
<pre><code class="language-text">A 230 V lamp draws 0.26 A:
P = V x I = 230 x 0.26 = 59.8 W   (about 60 W)

Leave that 60 W lamp on for 3 hours:
W = P x t = 60 W x 3 h = 180 Wh = 0.18 kWh
(the kWh is what the electricity bill counts)</code></pre>
<div class="out">P = 59.8 W · energy in 3 h = 0.18 kWh</div>
<h3>Problems</h3>
<p><b>P1.</b> A 1 kohm resistor is connected across 12 V. Find the current and the power, and say whether a 0.25 W resistor is adequate.</p>
<div class="dap-an"><pre><code class="language-text">I = V / R = 12 / 1000 = 0.012 A = 12 mA
P = V^2 / R = 144 / 1000 = 0.144 W = 144 mW
check: P = V x I = 12 x 0.012 = 0.144 W  (agrees)

144 mW is 58% of 250 mW -&gt; a 0.25 W resistor IS adequate,
though it will be noticeably warm. A 0.5 W part runs cool.</code></pre>
<div class="out">I = 12 mA · P = 144 mW · 0.25 W is adequate (0.5 W is comfortable)</div>
<p>Why "adequate but warm" matters: a resistor run at 58% of rating drifts in value as it heats, which shows up as a slowly changing reading in your Lab.</p></div>
<p><b>P2.</b> What voltage must be applied to a 2.2 kohm resistor to make 5 mA flow?</p>
<div class="dap-an"><pre><code class="language-text">V = I x R = 0.005 A x 2200 ohm = 11 V
check: I = V / R = 11 / 2200 = 0.005 A  (agrees)</code></pre>
<p>Both quantities were converted to base units before multiplying — 5 mA became 0.005 A and 2.2 kohm became 2200 ohm. Do the conversion on paper, not in your head.</p></div>
<p><b>P3.</b> An electric field of 24 kV/m exists across a 0.5 mm insulating film. What voltage is across it? Then: the film breaks down at 30 kV/m — what is the maximum safe voltage?</p>
<div class="dap-an"><pre><code class="language-text">E = V / d  =&gt;  V = E x d
V = 24000 V/m x 0.0005 m = 12 V

Breakdown: V(max) = 30000 x 0.0005 = 15 V
So 12 V is safe; 15 V is the edge; above it the film conducts.</code></pre>
<div class="out">V = 12 V · breakdown at 15 V</div>
<p>This is precisely how a capacitor's voltage rating is arrived at, and why a 16 V capacitor on a 12 V rail is a sensible choice while a 16 V capacitor on a 15 V rail is not.</p></div>
<p><b>P4.</b> Two resistors, 1 kohm and 2.2 kohm, are wired in series across 9 V. Without using any formula from chapter 5, find the current.</p>
<div class="dap-an"><pre><code class="language-text">In series the SAME current flows through both, and the two
voltage drops must add up to 9 V. The pair therefore behaves
like one resistor of 1000 + 2200 = 3200 ohm:

I = V / R(total) = 9 / 3200 = 0.0028125 A = 2.81 mA  (3 s.f.)

Check by adding the drops:
  V(R1) = 0.0028125 x 1000 = 2.81 V
  V(R2) = 0.0028125 x 2200 = 6.19 V
  2.81 + 6.19 = 9.00 V  (agrees)</code></pre>
<div class="out">I = 2.81 mA · drops 2.81 V + 6.19 V = 9.00 V</div>
<p>The check is the lesson: <strong>if the drops do not add back up to the supply, the arithmetic is wrong.</strong> That is Kirchhoff's voltage law, which you will meet by name in session 16.</p></div>`,
    `<span class="eyebrow">EEI101 · Buổi 3 · CLO1</span>
<h2>Thực hành khảo sát: định luật Ohm có đúng thật không?</h2>
<p class="lead">Học xong buổi này bạn chạy được thí nghiệm V–I kinh điển, suy ra điện trở từ một bảng số đo thay vì từ một lần đọc, và giải thích được vì sao cùng thí nghiệm đó làm trên bóng đèn lại ra đường cong chứ không ra đường thẳng.</p>
<p class="nhan">${NGUON} · buổi 3 — "1.7 Practical investigation &amp; Problems"</p>
<h3>Thí nghiệm</h3>
<p>Nối một nguồn điều chỉnh được vào một điện trở, với <strong>ampe kế mắc nối tiếp</strong> và <strong>vôn kế mắc ngang qua</strong> điện trở. Tăng nguồn theo từng bước và ghi lại cả hai số đọc. Việc này làm trên bàn thí nghiệm hay trong Tinkercad đều mất khoảng mười phút; điều quan trọng là cái <em>bảng</em>, không phải một lần đọc nào.</p>
<div class="diagram"><pre>  nguon dieu     (A)  ampe ke NOI TIEP
  chinh duoc o----(A)----+
                         |
                        [ ] R = 1 kohm   (V) von ke NGANG QUA R
                         |         |
                         +---------+
                         |
                       --+--  0 V</pre></div>
<table>
  <thead><tr><th>Bước</th><th>V (đo được)</th><th>I (đo được)</th><th>V / I</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>2,0 V</td><td>2,0 mA</td><td>1000 ohm</td></tr>
    <tr><td>2</td><td>4,0 V</td><td>4,0 mA</td><td>1000 ohm</td></tr>
    <tr><td>3</td><td>6,0 V</td><td>6,0 mA</td><td>1000 ohm</td></tr>
    <tr><td>4</td><td>8,0 V</td><td>8,0 mA</td><td>1000 ohm</td></tr>
    <tr><td>5</td><td>10,0 V</td><td>10,0 mA</td><td>1000 ohm</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Số liệu lý tưởng hoá để dạy phương pháp. Trên thiết bị thật bạn sẽ đọc 1,98 V / 2,01 mA và tương tự — xem buổi 9 về mức sai số phải trông đợi và vì sao có nó.</p>
<p><strong>Kết luận, và cách phát biểu cho đúng.</strong> V/I không đổi, nên điện trở là linh kiện <strong>tuyến tính (ohmic)</strong>, và hằng số đó chính là điện trở của nó. Vẽ V theo I ra một đường thẳng qua gốc toạ độ, độ nghiêng của nó là R:</p>
<pre><code class="language-text">R = (do bien thien cua V) / (do bien thien cua I)
  = (10.0 - 2.0) V / (10.0 - 2.0) mA
  = 8.0 V / 0.008 A
  = 1000 ohm</code></pre>
<div class="out">R = 1000 ohm = 1 kohm</div>
<div class="note-ct">Vì sao dùng độ nghiêng thay vì một dòng? (ghi chú của web) Vì một phép chia đơn lẻ mang theo sai số của cả hai đồng hồ tại đúng điểm đó, còn độ nghiêng trên một khoảng rộng thì làm trung bình sai số, và quan trọng hơn là nó <strong>triệt tiêu mọi độ lệch cố định</strong> — nếu một đồng hồ đọc cao hơn 0,1 V ở mọi bước thì mọi dòng V/I đều sai nhưng độ nghiêng vẫn đúng. Đây là mảnh kỹ thuật phòng thí nghiệm thật đầu tiên của môn, và nó có điểm trong mọi báo cáo Lab bạn viết sau này.</div>
<h3>Cùng thí nghiệm đó trên bóng đèn — và vì sao nó bị cong</h3>
<p>Làm lại với một bóng đèn dây tóc 12 V thì V/I <em>không</em> còn là hằng số: nó tăng lên khi điện áp tăng. Không có gì hỏng và định luật Ohm cũng không bị vi phạm — chỉ là R không phải hằng số, vì dây tóc nóng lên và kim loại nóng có điện trở suất cao hơn. Định luật Ohm vẫn mô tả đúng điện trở <em>tại thời điểm đó</em>; thứ sai là giả định rằng R là một con số cố định.</p>
<table>
  <thead><tr><th>Linh kiện</th><th>Đồ thị V–I</th><th>Gọi là</th></tr></thead>
  <tbody>
    <tr><td>Điện trở màng kim loại</td><td>đường thẳng qua gốc</td><td>tuyến tính / ohmic</td></tr>
    <tr><td>Bóng đèn dây tóc</td><td>đường cong, phẳng dần khi V tăng</td><td>phi tuyến (hiệu ứng nhiệt độ)</td></tr>
    <tr><td>Diode (chương 7)</td><td>gần như không gì, rồi vọt lên quanh 0,7 V</td><td>phi tuyến (do tiếp giáp)</td></tr>
  </tbody>
</table>
<h3>Công suất và điện năng — hai câu hỏi khác nhau</h3>
<div class="formula">P = V x I &nbsp;(watt, năng lượng bị tiêu NHANH cỡ nào) &nbsp;&nbsp;·&nbsp;&nbsp; W = P x t &nbsp;(lượng điện năng đã tiêu)</div>
<pre><code class="language-text">Mot bong den 230 V rut dong 0.26 A:
P = V x I = 230 x 0.26 = 59.8 W   (khoang 60 W)

De bong 60 W do sang trong 3 gio:
W = P x t = 60 W x 3 h = 180 Wh = 0.18 kWh
(kWh la cai ma hoa don dien dem)</code></pre>
<div class="out">P = 59,8 W · điện năng trong 3 h = 0,18 kWh</div>
<h3>Bài tập</h3>
<p><b>P1.</b> Một điện trở 1 kohm nối vào 12 V. Tìm dòng và công suất, rồi nói xem điện trở loại 0,25 W có đủ hay không.</p>
<div class="dap-an"><pre><code class="language-text">I = V / R = 12 / 1000 = 0.012 A = 12 mA
P = V^2 / R = 144 / 1000 = 0.144 W = 144 mW
kiem: P = V x I = 12 x 0.012 = 0.144 W  (khop)

144 mW la 58% cua 250 mW -&gt; loai 0.25 W ĐỦ dung,
nhung se am nong ro rang. Loai 0.5 W thi chay mat.</code></pre>
<div class="out">I = 12 mA · P = 144 mW · loại 0,25 W là đủ (0,5 W thì thoải mái)</div>
<p>Vì sao "đủ nhưng nóng" lại đáng nói: một điện trở chạy ở 58% định mức sẽ trôi trị số khi nóng lên, và điều đó hiện ra thành một số đọc cứ nhích dần trong bài Lab của bạn.</p></div>
<p><b>P2.</b> Phải đặt điện áp bao nhiêu lên một điện trở 2,2 kohm để có dòng 5 mA?</p>
<div class="dap-an"><pre><code class="language-text">V = I x R = 0.005 A x 2200 ohm = 11 V
kiem: I = V / R = 11 / 2200 = 0.005 A  (khop)</code></pre>
<p>Cả hai đại lượng đã được đổi về đơn vị gốc trước khi nhân — 5 mA thành 0,005 A và 2,2 kohm thành 2200 ohm. Hãy đổi đơn vị trên giấy, đừng đổi trong đầu.</p></div>
<p><b>P3.</b> Một điện trường 24 kV/m tồn tại trên một lớp màng cách điện dày 0,5 mm. Điện áp trên nó là bao nhiêu? Rồi: màng đó đánh xuyên ở 30 kV/m — điện áp an toàn tối đa là bao nhiêu?</p>
<div class="dap-an"><pre><code class="language-text">E = V / d  =&gt;  V = E x d
V = 24000 V/m x 0.0005 m = 12 V

Danh xuyen: V(max) = 30000 x 0.0005 = 15 V
Vay 12 V la an toan; 15 V la ngay sat gioi han; tren nua thi mang dan dien.</code></pre>
<div class="out">V = 12 V · đánh xuyên ở 15 V</div>
<p>Đây đúng là cách người ta ra được thông số điện áp của một con tụ, và là lý do tụ 16 V dùng cho đường nguồn 12 V là lựa chọn hợp lý, còn tụ 16 V cho đường 15 V thì không.</p></div>
<p><b>P4.</b> Hai điện trở 1 kohm và 2,2 kohm mắc nối tiếp vào 9 V. Không dùng công thức nào của chương 5, hãy tìm dòng điện.</p>
<div class="dap-an"><pre><code class="language-text">Noi tiep thi CUNG MOT dong chay qua ca hai, va hai phan sut ap
phai cong lai bang 9 V. Nen cap do hoat dong nhu mot dien tro
1000 + 2200 = 3200 ohm:

I = V / R(tong) = 9 / 3200 = 0.0028125 A = 2.81 mA  (3 chu so)

Kiem bang cach cong hai phan sut ap:
  V(R1) = 0.0028125 x 1000 = 2.81 V
  V(R2) = 0.0028125 x 2200 = 6.19 V
  2.81 + 6.19 = 9.00 V  (khop)</code></pre>
<div class="out">I = 2,81 mA · sụt áp 2,81 V + 6,19 V = 9,00 V</div>
<p>Phép kiểm chính là bài học: <strong>nếu các phần sụt áp cộng lại không bằng nguồn thì số học đã sai.</strong> Đó là định luật điện áp Kirchhoff, thứ bạn sẽ được gọi tên ở buổi 16.</p></div>`,
  ]]);

/* ── 1.4 buổi 4 — CLO6 ───────────────────────────────────────────────────── */
const l14 = doc('eei101-1-4-mo-phong-mach',
  '1.4 — Circuit simulation: types of analysis, netlists & component models|||1.4 — Mô phỏng mạch: các loại phân tích, netlist & mô hình linh kiện',
  'Buổi 4, CLO6, Tooley 2.1–2.2: ba loại phân tích (DC operating point, AC sweep, transient), netlist SPICE là gì và cách đọc từng dòng, mô hình linh kiện lý tưởng so với thật; hướng dẫn mở MultisimLive/Tinkercad trên trình duyệt và dựng mạch chia áp đầu tiên.',
  [[
    `<span class="eyebrow">EEI101 · Session 4 · CLO6</span>
<h2>Circuit simulation — and your first circuit, built in a browser tab</h2>
<p class="lead">After this session you can name the three analyses every simulator offers and say which question each one answers, read a SPICE netlist line by line, and build a working voltage divider in MultisimLive or Tinkercad without installing anything.</p>
<p class="nhan">${NGUON} · session 4 — "Chapter 2: Circuit simulation — 2.1 Types of analysis; 2.2 Netlists and component models"</p>
<h3>Why simulate at all</h3>
<p>A simulator answers a question in ten seconds that a breadboard answers in twenty minutes, and it cannot burn a component or a finger. It also tells you things a bench cannot: the current in the middle of a track, the waveform at a node you have no probe for, the response at 500 frequencies. What it cannot do is notice that your <em>model</em> is wrong — so the last section of this lesson matters more than the first two.</p>
<div class="callout ok"><strong>Nothing to install.</strong> All three tools the syllabus names run in a browser: <a href="https://www.multisim.com" target="_blank" rel="noopener">MultisimLive</a>, <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a>, and TINACloud. CLO6 — "use simulation software to design, test and optimize basic electronic circuits" — is examined in every Lab, so get an account before session 10.</div>
<h3>2.1 The three types of analysis</h3>
<table>
  <thead><tr><th>Analysis</th><th>The question it answers</th><th>What you get</th><th>You will use it in</th></tr></thead>
  <tbody>
    <tr><td><strong>DC operating point</strong> (bias)</td><td>"With the supply on and nothing changing, what is the voltage at every node and the current in every branch?"</td><td>a single number per node</td><td>chapter 5, transistor biasing (session 36)</td></tr>
    <tr><td><strong>AC / frequency sweep</strong></td><td>"How does the circuit respond as the frequency changes?"</td><td>gain and phase against frequency (a Bode plot)</td><td>chapter 6, amplifier frequency response (session 35)</td></tr>
    <tr><td><strong>Transient</strong> (time domain)</td><td>"What happens over time after something changes?"</td><td>a waveform, like an oscilloscope trace</td><td>chapter 8 rectifiers, chapter 11 oscillators</td></tr>
  </tbody>
</table>
<p>A fourth, <strong>logic simulation</strong>, treats signals as 0s and 1s rather than volts; that is session 5.</p>
<div class="callout"><strong>Choosing the wrong analysis produces a right answer to a question you did not ask.</strong> Run a DC operating point on an oscillator and it reports a static, perfectly stable set of voltages — the circuit is oscillating, but a DC analysis has no time axis with which to see it. Symptom: "the simulator says my oscillator does nothing." Cure: transient analysis.</div>
<h3>2.2 Netlists — what the simulator actually reads</h3>
<p>Behind the schematic editor, every simulator builds a text file called a <strong>netlist</strong>. One line per component: a name, the two nodes it connects, and its value. Nodes are just labels, and <strong>node 0 is always ground</strong>.</p>
<pre><code class="language-text">* Voltage divider, 5 V across 2k + 3k
V1  in   0    DC 5
R1  in   out  2k
R2  out  0    3k
.op
.end</code></pre>
<p>Read it as five statements:</p>
<table>
  <thead><tr><th>Line</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>* ...</code></td><td>a comment — the first line of a SPICE file is traditionally the title</td></tr>
    <tr><td><code>V1 in 0 DC 5</code></td><td>a 5 V DC source named V1, positive terminal at node <code>in</code>, negative at node <code>0</code> (ground)</td></tr>
    <tr><td><code>R1 in out 2k</code></td><td>a 2 kohm resistor between nodes <code>in</code> and <code>out</code></td></tr>
    <tr><td><code>R2 out 0 3k</code></td><td>a 3 kohm resistor between <code>out</code> and ground</td></tr>
    <tr><td><code>.op</code></td><td>the analysis to run: DC operating point</td></tr>
    <tr><td><code>.end</code></td><td>end of file</td></tr>
  </tbody>
</table>
<p><strong>Predict the answer before you run it.</strong> This is the habit that makes simulation teach you something instead of replacing you:</p>
<pre><code class="language-text">Series total    = 2k + 3k = 5000 ohm
I               = 5 / 5000 = 0.001 A = 1 mA
V(out) = I x R2 = 0.001 x 3000 = 3 V
(same by the divider ratio: 5 x 3000/5000 = 3 V)</code></pre>
<div class="out">Predicted: I = 1 mA, V(out) = 3.000 V — and that is what the simulator reports</div>
<div class="note-ct"><strong>Predict, then simulate, then compare</strong> (our method, not a syllabus rule). If the two agree, you have learned that your arithmetic is sound. If they disagree, one of the two is wrong and you have a real question to chase — which is worth far more than a number you accepted without thinking. A Lab report that says "I expected 3 V, I measured 2.94 V, the difference is the meter loading" earns marks that "V = 2.94 V" does not.</div>
<h3>2.2 continued — component models, and why simulators lie</h3>
<p>A simulator does not contain resistors; it contains <strong>models</strong>. The simplest model of a resistor is one number. Real parts need more, and the gap between the two is where "it works in simulation but not on the bench" comes from.</p>
<table>
  <thead><tr><th>Component</th><th>Ideal model</th><th>What the real part also has</th></tr></thead>
  <tbody>
    <tr><td>Wire</td><td>zero resistance</td><td>a few milliohms, and inductance at high frequency</td></tr>
    <tr><td>Resistor</td><td>R only</td><td>a tolerance (5%, 1%), a power limit, drift with temperature</td></tr>
    <tr><td>Capacitor</td><td>C only</td><td>series resistance (ESR), leakage, a voltage rating, tolerance up to 20%</td></tr>
    <tr><td>Voltage source</td><td>holds V at any current</td><td>a real internal resistance, a current limit, and it sags under load</td></tr>
    <tr><td>Diode</td><td>on above 0.7 V, off below</td><td>an exponential curve, reverse leakage, capacitance, temperature dependence</td></tr>
  </tbody>
</table>
<p>Simulators offer several levels for the same part — an ideal op-amp, or a model of a specific LM741 with its real gain and bandwidth. Use the ideal one to understand the principle, then re-run with the real model before you trust a design.</p>
<h3>Do it now: your first simulation</h3>
<ol>
<li>Open <a href="https://www.multisim.com" target="_blank" rel="noopener">multisim.com</a> and sign in (free), or open <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">tinkercad.com/circuits</a> and choose "Create new Circuit".</li>
<li>Place a <strong>DC voltage source</strong> and set it to 5 V. Place two resistors, 2 kohm and 3 kohm.</li>
<li>Wire them as a chain: source + to R1, R1 to R2, R2 back to source −. Attach a <strong>ground</strong> symbol to the source −. Without a ground the simulator has no reference and will refuse to solve, or report nonsense.</li>
<li>Put a voltmeter across R2 (or click the node to probe it) and run.</li>
<li>Read the value. You predicted 3 V above. Change R2 to 8 kohm and predict again <em>before</em> re-running: 5 x 8000/10000 = 4 V.</li>
</ol>
<div class="pitfall"><b>No ground node.</b> The single most common first-simulation failure: "singular matrix", "node has no DC path to ground", or simply no result. Every circuit needs one ground symbol. <b>A floating node.</b> A wire that looks connected but is not — zoom in and check the junction dots, exactly as in a schematic. <b>Reading the ideal model as reality.</b> An ideal 5 V source delivering 10 A into a short circuit is the model working as designed; a real battery would sag or catch fire. <b>Choosing DC analysis for a question about time.</b> If the answer should be a waveform, you need transient. <b>Trusting a simulation you did not predict.</b> If you had no expectation, the simulator cannot be wrong — and neither can you learn anything.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Write the netlist for a 9 V source feeding 1 kohm in series with 470 ohm, and predict the current and the voltage across the 470 ohm.</p>
<div class="dap-an"><pre><code class="language-text">* Divider 9 V, 1k + 470
V1  in   0    DC 9
R1  in   out  1k
R2  out  0    470
.op
.end

Prediction:
R(total) = 1000 + 470 = 1470 ohm
I        = 9 / 1470 = 0.0061224 A = 6.12 mA  (3 s.f.)
V(out)   = 0.0061224 x 470 = 2.878 V  -&gt; about 2.88 V
check by ratio: 9 x 470 / 1470 = 2.878 V  (agrees)</code></pre>
<div class="out">I = 6.12 mA · V(out) = 2.88 V</div>
<p>Two routes to V(out) — Ohm's law on R2, and the divider ratio — must agree. When they do not, you have mistyped a number.</p></div>
<p><b>E2.</b> Which analysis would you choose for each of these, and why?</p>
<div class="dap-an"><table>
  <thead><tr><th>Question</th><th>Analysis</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>What is the base voltage of this transistor when idle?</td><td>DC operating point</td><td>nothing is changing; you want one number per node</td></tr>
    <tr><td>Does my filter really cut off at 1 kHz?</td><td>AC / frequency sweep</td><td>the answer is a curve against frequency</td></tr>
    <tr><td>How long does this capacitor take to charge?</td><td>Transient</td><td>the answer is a shape over time</td></tr>
    <tr><td>Does my rectifier output ripple?</td><td>Transient</td><td>ripple exists only in the time domain; a DC analysis averages it away</td></tr>
  </tbody>
</table></div>`,
    `<span class="eyebrow">EEI101 · Buổi 4 · CLO6</span>
<h2>Mô phỏng mạch — và mạch đầu tiên của bạn, dựng trong một tab trình duyệt</h2>
<p class="lead">Học xong buổi này bạn kể được ba loại phân tích mà mọi phần mềm mô phỏng đều có và nói được mỗi loại trả lời câu hỏi nào, đọc được một netlist SPICE từng dòng, và dựng được một bộ chia áp chạy thật trong MultisimLive hoặc Tinkercad mà không cài gì cả.</p>
<p class="nhan">${NGUON} · buổi 4 — "Chapter 2: Circuit simulation — 2.1 Types of analysis; 2.2 Netlists and component models"</p>
<h3>Vì sao phải mô phỏng</h3>
<p>Phần mềm mô phỏng trả lời trong mười giây một câu hỏi mà breadboard phải mất hai mươi phút, và nó không làm cháy linh kiện hay cháy tay. Nó còn cho bạn những thứ bàn thí nghiệm không cho được: dòng ở giữa một đường mạch, dạng sóng tại một nút bạn không có que đo, đáp ứng tại 500 tần số khác nhau. Điều nó KHÔNG làm được là nhận ra rằng <em>mô hình</em> của bạn sai — nên mục cuối của bài này quan trọng hơn hai mục đầu.</p>
<div class="callout ok"><strong>Không phải cài gì.</strong> Cả ba công cụ syllabus nêu đều chạy trên trình duyệt: <a href="https://www.multisim.com" target="_blank" rel="noopener">MultisimLive</a>, <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> và TINACloud. CLO6 — "dùng phần mềm mô phỏng để thiết kế, kiểm thử và tối ưu mạch điện tử cơ bản" — bị kiểm ở mọi bài Lab, nên hãy tạo tài khoản trước buổi 10.</div>
<h3>2.1 Ba loại phân tích</h3>
<table>
  <thead><tr><th>Loại phân tích</th><th>Câu hỏi nó trả lời</th><th>Bạn nhận được gì</th><th>Bạn sẽ dùng ở</th></tr></thead>
  <tbody>
    <tr><td><strong>DC operating point</strong> (điểm làm việc một chiều, phân cực)</td><td>"Khi đã cấp nguồn và không có gì thay đổi, điện áp tại mỗi nút và dòng trong mỗi nhánh là bao nhiêu?"</td><td>một con số cho mỗi nút</td><td>chương 5, phân cực transistor (buổi 36)</td></tr>
    <tr><td><strong>AC / quét tần số</strong></td><td>"Mạch đáp ứng thế nào khi tần số thay đổi?"</td><td>độ lợi và pha theo tần số (đồ thị Bode)</td><td>chương 6, đáp ứng tần số của mạch khuếch đại (buổi 35)</td></tr>
    <tr><td><strong>Transient</strong> (quá độ, miền thời gian)</td><td>"Sau khi có gì đó thay đổi thì diễn biến theo thời gian ra sao?"</td><td>một dạng sóng, giống hình trên dao động ký</td><td>chương 8 mạch chỉnh lưu, chương 11 mạch dao động</td></tr>
  </tbody>
</table>
<p>Loại thứ tư, <strong>mô phỏng logic</strong>, coi tín hiệu là 0 và 1 chứ không phải volt; đó là nội dung buổi 5.</p>
<div class="callout"><strong>Chọn sai loại phân tích thì nhận được câu trả lời ĐÚNG cho một câu hỏi bạn không hỏi.</strong> Chạy DC operating point trên một mạch dao động thì nó báo về một bộ điện áp tĩnh, hoàn toàn ổn định — mạch đang dao động thật, nhưng phân tích DC không có trục thời gian nào để thấy điều đó. Triệu chứng: "phần mềm nói mạch dao động của em không làm gì cả." Cách chữa: dùng transient.</div>
<h3>2.2 Netlist — thứ mà phần mềm thật sự đọc</h3>
<p>Phía sau cái khung vẽ sơ đồ, mọi phần mềm mô phỏng đều dựng ra một tệp văn bản gọi là <strong>netlist</strong>. Mỗi linh kiện một dòng: một cái tên, hai nút mà nó nối vào, và trị số. Nút chỉ là nhãn, và <strong>nút 0 luôn là đất (ground)</strong>.</p>
<pre><code class="language-text">* Bo chia ap, 5 V tren 2k + 3k
V1  in   0    DC 5
R1  in   out  2k
R2  out  0    3k
.op
.end</code></pre>
<p>Hãy đọc nó như năm câu phát biểu:</p>
<table>
  <thead><tr><th>Dòng</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td><code>* ...</code></td><td>một chú thích — dòng đầu của tệp SPICE theo truyền thống là tiêu đề</td></tr>
    <tr><td><code>V1 in 0 DC 5</code></td><td>một nguồn một chiều 5 V tên V1, cực dương ở nút <code>in</code>, cực âm ở nút <code>0</code> (đất)</td></tr>
    <tr><td><code>R1 in out 2k</code></td><td>một điện trở 2 kohm giữa nút <code>in</code> và nút <code>out</code></td></tr>
    <tr><td><code>R2 out 0 3k</code></td><td>một điện trở 3 kohm giữa <code>out</code> và đất</td></tr>
    <tr><td><code>.op</code></td><td>phân tích cần chạy: DC operating point</td></tr>
    <tr><td><code>.end</code></td><td>kết thúc tệp</td></tr>
  </tbody>
</table>
<p><strong>Hãy đoán đáp án TRƯỚC khi bấm chạy.</strong> Đây là thói quen làm cho việc mô phỏng dạy bạn điều gì đó, thay vì thay thế bạn:</p>
<pre><code class="language-text">Tong noi tiep  = 2k + 3k = 5000 ohm
I              = 5 / 5000 = 0.001 A = 1 mA
V(out) = I x R2 = 0.001 x 3000 = 3 V
(cach khac, theo ti so chia ap: 5 x 3000/5000 = 3 V)</code></pre>
<div class="out">Dự đoán: I = 1 mA, V(out) = 3,000 V — và đó đúng là con số phần mềm báo về</div>
<div class="note-ct"><strong>Đoán trước, mô phỏng sau, rồi đối chiếu</strong> (phương pháp của web, không phải quy định của syllabus). Nếu hai bên khớp, bạn học được rằng số học của mình vững. Nếu lệch nhau thì một trong hai đã sai và bạn có một câu hỏi thật để truy — thứ giá trị hơn nhiều so với một con số bạn nhận về mà không nghĩ. Một báo cáo Lab viết "em kỳ vọng 3 V, đo được 2,94 V, chênh lệch là do tải của đồng hồ đo" được điểm mà bản viết "V = 2,94 V" không có.</div>
<h3>2.2 (tiếp) — mô hình linh kiện, và vì sao phần mềm mô phỏng "nói dối"</h3>
<p>Phần mềm mô phỏng không chứa điện trở; nó chứa <strong>mô hình (model)</strong>. Mô hình đơn giản nhất của một điện trở là một con số. Linh kiện thật cần nhiều hơn thế, và đúng cái khoảng cách giữa hai bên là nơi sinh ra câu "mô phỏng thì chạy mà lắp thật thì không".</p>
<table>
  <thead><tr><th>Linh kiện</th><th>Mô hình lý tưởng</th><th>Linh kiện thật còn có thêm</th></tr></thead>
  <tbody>
    <tr><td>Dây dẫn</td><td>điện trở bằng 0</td><td>vài miliohm, và điện cảm ở tần số cao</td></tr>
    <tr><td>Điện trở</td><td>chỉ có R</td><td>sai số (5%, 1%), giới hạn công suất, trôi theo nhiệt độ</td></tr>
    <tr><td>Tụ điện</td><td>chỉ có C</td><td>điện trở nối tiếp (ESR), dòng rỉ, điện áp tối đa, sai số tới 20%</td></tr>
    <tr><td>Nguồn áp</td><td>giữ nguyên V ở mọi mức dòng</td><td>điện trở trong thật, giới hạn dòng, và bị sụt khi có tải</td></tr>
    <tr><td>Diode</td><td>dẫn khi trên 0,7 V, tắt khi dưới</td><td>một đường cong hàm mũ, dòng rỉ ngược, điện dung, phụ thuộc nhiệt độ</td></tr>
  </tbody>
</table>
<p>Phần mềm thường có nhiều mức mô hình cho cùng một linh kiện — một op-amp lý tưởng, hoặc mô hình của đúng con LM741 với độ lợi và băng thông thật của nó. Dùng bản lý tưởng để hiểu nguyên lý, rồi chạy lại bằng mô hình thật trước khi tin vào một thiết kế.</p>
<h3>Làm ngay: lần mô phỏng đầu tiên của bạn</h3>
<ol>
<li>Mở <a href="https://www.multisim.com" target="_blank" rel="noopener">multisim.com</a> và đăng nhập (miễn phí), hoặc mở <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">tinkercad.com/circuits</a> rồi chọn "Create new Circuit".</li>
<li>Đặt một <strong>nguồn áp DC</strong> và đặt giá trị 5 V. Đặt hai điện trở, 2 kohm và 3 kohm.</li>
<li>Nối thành một vòng: cực + của nguồn vào R1, R1 sang R2, R2 về cực − của nguồn. Gắn một ký hiệu <strong>ground</strong> vào cực − đó. Không có ground thì phần mềm không có mốc tham chiếu và sẽ từ chối giải, hoặc báo về số vô nghĩa.</li>
<li>Đặt một vôn kế ngang qua R2 (hoặc bấm vào nút đó để dò) rồi chạy.</li>
<li>Đọc giá trị. Ở trên bạn đã đoán 3 V. Giờ đổi R2 thành 8 kohm và đoán lại <em>trước</em> khi chạy: 5 x 8000/10000 = 4 V.</li>
</ol>
<div class="pitfall"><b>Thiếu nút ground.</b> Đây là lỗi mô phỏng lần đầu phổ biến nhất: "singular matrix", "node has no DC path to ground", hoặc đơn giản là không ra kết quả nào. Mọi mạch đều cần một ký hiệu ground. <b>Một nút bị hở (floating).</b> Một sợi dây trông như đã nối mà thật ra chưa — hãy phóng to và kiểm các điểm chấm nối, đúng như khi đọc sơ đồ. <b>Đọc mô hình lý tưởng thành hiện thực.</b> Một nguồn 5 V lý tưởng cấp 10 A vào chỗ ngắn mạch là mô hình đang chạy đúng thiết kế của nó; một cục pin thật thì sẽ sụt áp hoặc bốc cháy. <b>Chọn phân tích DC cho một câu hỏi về thời gian.</b> Nếu đáp án đúng ra phải là một dạng sóng thì bạn cần transient. <b>Tin vào một kết quả mô phỏng mà mình không hề đoán trước.</b> Không có kỳ vọng nào thì phần mềm không thể sai — và bạn cũng không học được gì.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Viết netlist cho nguồn 9 V cấp cho 1 kohm nối tiếp 470 ohm, và đoán trước dòng điện cùng điện áp trên con 470 ohm.</p>
<div class="dap-an"><pre><code class="language-text">* Chia ap 9 V, 1k + 470
V1  in   0    DC 9
R1  in   out  1k
R2  out  0    470
.op
.end

Du doan:
R(tong) = 1000 + 470 = 1470 ohm
I       = 9 / 1470 = 0.0061224 A = 6.12 mA  (3 chu so)
V(out)  = 0.0061224 x 470 = 2.878 V  -&gt; khoang 2.88 V
kiem bang ti so: 9 x 470 / 1470 = 2.878 V  (khop)</code></pre>
<div class="out">I = 6,12 mA · V(out) = 2,88 V</div>
<p>Hai đường tới V(out) — định luật Ohm trên R2, và tỉ số chia áp — phải cho cùng kết quả. Khi chúng không khớp thì bạn đã gõ sai một con số.</p></div>
<p><b>E2.</b> Với mỗi câu hỏi sau, bạn chọn loại phân tích nào, và vì sao?</p>
<div class="dap-an"><table>
  <thead><tr><th>Câu hỏi</th><th>Phân tích</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td>Điện áp tại chân base của transistor này khi mạch đứng yên là bao nhiêu?</td><td>DC operating point</td><td>không có gì thay đổi; bạn cần một con số cho mỗi nút</td></tr>
    <tr><td>Mạch lọc của em có cắt đúng ở 1 kHz không?</td><td>AC / quét tần số</td><td>đáp án là một đường cong theo tần số</td></tr>
    <tr><td>Con tụ này nạp đầy trong bao lâu?</td><td>Transient</td><td>đáp án là một hình dạng theo thời gian</td></tr>
    <tr><td>Đầu ra mạch chỉnh lưu của em có gợn (ripple) không?</td><td>Transient</td><td>gợn chỉ tồn tại trong miền thời gian; phân tích DC lấy trung bình nên xoá mất nó</td></tr>
  </tbody>
</table></div>`,
  ]]);

/* ── 1.5 buổi 5 — CLO6 ───────────────────────────────────────────────────── */
const l15 = doc('eei101-1-5-mo-phong-logic',
  '1.5 — Logic simulation, plus a practical investigation|||1.5 — Mô phỏng logic, kèm một bài thực hành khảo sát',
  'Buổi 5, CLO6, Tooley 2.3–2.4: mô phỏng logic khác mô phỏng tương tự thế nào, mức logic và bảng chân trị, biểu đồ thời gian và trễ truyền, mức X/Z; bài thực hành dựng mạch RC transient và quét tần số trong MultisimLive, kèm bài tập có lời giải.',
  [[
    `<span class="eyebrow">EEI101 · Session 5 · CLO6</span>
<h2>Logic simulation, and a practical investigation of your own</h2>
<p class="lead">After this session you can say why a logic simulator is faster than an analogue one and what it throws away to get there, read a timing diagram, and run a transient and a frequency sweep on an R–C circuit and compare both with your own calculation.</p>
<p class="nhan">${NGUON} · session 5 — "2.3 Logic simulation; 2.4 Practical Investigation &amp; Problems"</p>
<h3>2.3 Logic simulation — a different kind of pretending</h3>
<p>An analogue simulator solves equations for voltages and currents at thousands of time steps. A <strong>logic simulator</strong> refuses to do that. It says: this wire is either <strong>0</strong> or <strong>1</strong>, and a gate's output is a table lookup. That is thousands of times faster, which is the only reason simulating a circuit with a million gates is possible at all.</p>
<table>
  <thead><tr><th></th><th>Analogue simulation</th><th>Logic simulation</th></tr></thead>
  <tbody>
    <tr><td>A signal is</td><td>a voltage, any value</td><td>a state: 0, 1 (and X, Z)</td></tr>
    <tr><td>It computes</td><td>equations at each time step</td><td>truth tables plus delays</td></tr>
    <tr><td>Speed</td><td>slow</td><td>very fast</td></tr>
    <tr><td>It can show you</td><td>ripple, noise, a 2.4 V "in-between" level, a slow edge</td><td>which output changes, and when</td></tr>
    <tr><td>It cannot show you</td><td>—</td><td>anything analogue: a marginal level, a slow rise, a supply dip</td></tr>
  </tbody>
</table>
<p>Two extra states exist because a real wire has more than two conditions:</p>
<ul>
<li><strong>X — unknown.</strong> The simulator does not know; usually a flip-flop that was never initialised. X spreading across your diagram is a bug report, not a display fault.</li>
<li><strong>Z — high impedance.</strong> Nothing is driving the wire at all: an output turned off, or a bus nobody is talking on. Z is not 0; a floating input is a real hardware fault and Z is how the simulator tells you.</li>
</ul>
<h3>Logic levels: where 0 and 1 come from</h3>
<p>Underneath, a logic level is still a voltage band. For 5 V TTL, roughly: below 0.8 V is a guaranteed 0, above 2.0 V is a guaranteed 1, and in between is <strong>undefined</strong> — the chip may read it either way, and two chips may disagree. That forbidden band is exactly what a logic simulator hides from you, and it is where real digital circuits fail. Chapter 12 (sessions 46–48) returns to this.</p>
<h3>Truth table and timing diagram, for one AND gate</h3>
<pre><code class="language-text">Truth table (Y = A AND B)        Timing diagram, with 10 ns gate delay
  A  B | Y                        A  ___------______
  0  0 | 0                        B  ____------_____
  0  1 | 0                        Y  ______--_______
  1  0 | 0                              |    |
  1  1 | 1                              |    +-- Y falls 10 ns after B falls
                                        +-- Y rises 10 ns after both are high</code></pre>
<p>The truth table says <em>what</em>; the timing diagram says <em>when</em>. Y is high only while A and B overlap, and each edge of Y is shifted right by the gate's propagation delay. Every digital fault you will ever chase is one of those two questions.</p>
<div class="note-ct">Where to do this today (our suggestion): <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> has real 74-series logic chips and an LED you can watch; MultisimLive has gate symbols and a logic analyser view. Build one AND gate, drive it from two switches, and confirm all four rows of the table yourself. It takes five minutes and it makes session 46 trivial.</div>
<h3>2.4 Practical investigation — an R–C circuit, three ways</h3>
<p>Take R = 1.6 kohm in series with C = 100 nF, with the output taken across the capacitor. Do the arithmetic first, then make the simulator agree.</p>
<p><strong>(a) By hand — the time constant.</strong></p>
<pre><code class="language-text">Time constant  T = R x C
               T = 1600 ohm x 100e-9 F = 0.00016 s = 160 us

After one T the capacitor reaches 63.2% of the final voltage.
From a 5 V step:  5 x 0.632 = 3.16 V after 160 us
Practically fully charged after 5T = 800 us</code></pre>
<div class="out">T = 160 us · 3.16 V after one T · settled by 800 us</div>
<p><strong>(b) By hand — the cut-off frequency.</strong> The same R and C form a low-pass filter whose output has fallen to 0.707 of the input (that is −3 dB):</p>
<pre><code class="language-text">f(c) = 1 / (2 x pi x R x C)
     = 1 / (2 x 3.14159 x 1600 x 100e-9)
     = 1 / 0.00100531
     = 994.7 Hz    -&gt; about 1 kHz</code></pre>
<div class="out">f(c) = 994.7 Hz (call it 1 kHz)</div>
<p><strong>(c) In the simulator.</strong> Build it once and run two analyses on the same circuit:</p>
<ul>
<li><strong>Transient</strong>, with a 0-to-5 V step input and a 1 ms window: read the time at which the output crosses 3.16 V. It should be about 160 us.</li>
<li><strong>AC sweep</strong>, from 10 Hz to 100 kHz: find the frequency where the output has fallen to 0.707 of the input. It should be about 995 Hz.</li>
</ul>
<p>Two analyses, one circuit, two numbers you predicted. That is CLO6 in a single exercise, and it is a strong answer to any Lab question that asks you to "test and optimise" a circuit.</p>
<div class="pitfall"><b>Mixing units in the R–C product.</b> 1.6 kohm x 100 nF must become 1600 x 0.0000001; leaving either as a prefixed number gives a time constant out by thousands. <b>Reading 5 time constants as "fully charged".</b> It is 99.3%, not 100% — good enough for a Lab, not for an exam answer that claims exactness. <b>Expecting the logic simulator to show a bad level.</b> It cannot: it decided the wire was 0 or 1 before the question arose. A circuit that works in a logic simulator can still fail on a breadboard for analogue reasons. <b>Ignoring X.</b> An X on a flip-flop output is not cosmetic — it means the state was never initialised, and on real hardware it will be whatever the power-up happens to give you.</div>
<h3>Problems</h3>
<p><b>P1.</b> R = 10 kohm, C = 10 nF. Find the time constant and the cut-off frequency.</p>
<div class="dap-an"><pre><code class="language-text">T    = 10000 x 10e-9 = 0.0001 s = 100 us
f(c) = 1 / (2 x pi x 10000 x 10e-9)
     = 1 / 0.00062832
     = 1591.5 Hz    -&gt; about 1.59 kHz</code></pre>
<div class="out">T = 100 us · f(c) = 1591.5 Hz</div>
<p>Notice: this R is larger but this C is smaller, so T came out <em>shorter</em> and the cut-off <em>higher</em>. Only the product R x C matters — which is why an exam can give you many R/C pairs with the same answer.</p></div>
<p><b>P2.</b> A two-input AND gate has a 10 ns propagation delay. A is high from 0 to 100 ns; B is high from 40 to 140 ns. When is the output high?</p>
<div class="dap-an"><pre><code class="language-text">Both inputs are high during the overlap: 40 ns to 100 ns.
Add the 10 ns delay to each edge:
Output is high from 50 ns to 110 ns  (60 ns wide)</code></pre>
<div class="out">Y high from 50 ns to 110 ns</div>
<p>The pulse keeps its width; it is simply shifted right. Delays add along a chain of gates, and that accumulated shift is what sets the maximum clock speed of a digital circuit.</p></div>`,
    `<span class="eyebrow">EEI101 · Buổi 5 · CLO6</span>
<h2>Mô phỏng logic, và một bài khảo sát thực hành của chính bạn</h2>
<p class="lead">Học xong buổi này bạn nói được vì sao mô phỏng logic nhanh hơn mô phỏng tương tự và nó phải bỏ đi cái gì để nhanh được như vậy, đọc được biểu đồ thời gian, và chạy được cả transient lẫn quét tần số trên một mạch R–C rồi đối chiếu cả hai với phép tính của mình.</p>
<p class="nhan">${NGUON} · buổi 5 — "2.3 Logic simulation; 2.4 Practical Investigation &amp; Problems"</p>
<h3>2.3 Mô phỏng logic — một kiểu "giả lập" khác hẳn</h3>
<p>Phần mềm mô phỏng tương tự giải hệ phương trình cho điện áp và dòng điện tại hàng nghìn bước thời gian. Phần mềm <strong>mô phỏng logic</strong> từ chối làm việc đó. Nó nói: sợi dây này hoặc là <strong>0</strong> hoặc là <strong>1</strong>, và đầu ra của một cổng là một phép tra bảng. Cách đó nhanh hơn hàng nghìn lần, và đó là lý do duy nhất khiến việc mô phỏng một mạch có một triệu cổng là khả thi.</p>
<table>
  <thead><tr><th></th><th>Mô phỏng tương tự</th><th>Mô phỏng logic</th></tr></thead>
  <tbody>
    <tr><td>Một tín hiệu là</td><td>một điện áp, giá trị nào cũng được</td><td>một trạng thái: 0, 1 (và X, Z)</td></tr>
    <tr><td>Nó tính</td><td>phương trình tại từng bước thời gian</td><td>bảng chân trị cộng với độ trễ</td></tr>
    <tr><td>Tốc độ</td><td>chậm</td><td>rất nhanh</td></tr>
    <tr><td>Nó cho bạn thấy</td><td>gợn, nhiễu, một mức "lửng" 2,4 V, một cạnh lên chậm</td><td>đầu ra nào đổi, và đổi lúc nào</td></tr>
    <tr><td>Nó KHÔNG cho thấy</td><td>—</td><td>mọi thứ tương tự: một mức sát ngưỡng, một cạnh lên chậm, một cú sụt nguồn</td></tr>
  </tbody>
</table>
<p>Có thêm hai trạng thái nữa, vì một sợi dây thật có nhiều hơn hai tình huống:</p>
<ul>
<li><strong>X — không xác định (unknown).</strong> Phần mềm không biết; thường là một flip-flop chưa bao giờ được khởi tạo. Chữ X lan ra khắp biểu đồ là một bản báo lỗi, không phải sự cố hiển thị.</li>
<li><strong>Z — tổng trở cao (high impedance).</strong> Không có gì đang lái sợi dây đó cả: một đầu ra đã bị tắt, hoặc một bus không ai đang nói. Z KHÔNG phải là 0; một đầu vào bị bỏ hở là lỗi phần cứng thật, và Z là cách phần mềm nói điều đó với bạn.</li>
</ul>
<h3>Mức logic: 0 và 1 từ đâu ra</h3>
<p>Ở bên dưới, một mức logic vẫn là một dải điện áp. Với TTL 5 V, đại khái: dưới 0,8 V là mức 0 chắc chắn, trên 2,0 V là mức 1 chắc chắn, còn ở giữa là vùng <strong>không xác định</strong> — con chip có thể đọc thành cái nào cũng được, và hai con chip có thể hiểu khác nhau. Đúng cái dải cấm đó là thứ mà mô phỏng logic che khỏi mắt bạn, và nó là nơi các mạch số thật đổ vỡ. Chương 12 (buổi 46–48) sẽ quay lại chuyện này.</p>
<h3>Bảng chân trị và biểu đồ thời gian, cho một cổng AND</h3>
<pre><code class="language-text">Bang chan tri (Y = A AND B)      Bieu do thoi gian, tre cong 10 ns
  A  B | Y                        A  ___------______
  0  0 | 0                        B  ____------_____
  0  1 | 0                        Y  ______--_______
  1  0 | 0                              |    |
  1  1 | 1                              |    +-- Y xuong 10 ns sau khi B xuong
                                        +-- Y len 10 ns sau khi ca hai len cao</code></pre>
<p>Bảng chân trị nói <em>cái gì</em>; biểu đồ thời gian nói <em>lúc nào</em>. Y chỉ lên cao trong đoạn A và B chồng nhau, và mỗi cạnh của Y bị đẩy sang phải một khoảng bằng độ trễ truyền của cổng. Mọi lỗi mạch số bạn sẽ truy trong đời đều là một trong hai câu hỏi đó.</p>
<div class="note-ct">Hôm nay làm ở đâu (gợi ý của web): <a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> có IC logic họ 74 thật và một con LED để bạn nhìn; MultisimLive có ký hiệu cổng và cửa sổ logic analyser. Hãy dựng một cổng AND, lái nó bằng hai công tắc, và tự xác nhận cả bốn dòng của bảng. Mất năm phút và nó làm buổi 46 trở nên nhẹ tênh.</div>
<h3>2.4 Thực hành khảo sát — một mạch R–C, ba cách</h3>
<p>Lấy R = 1,6 kohm nối tiếp C = 100 nF, đầu ra lấy trên tụ. Làm phép tính trước, rồi bắt phần mềm mô phỏng phải đồng ý.</p>
<p><strong>(a) Bằng tay — hằng số thời gian.</strong></p>
<pre><code class="language-text">Hang so thoi gian  T = R x C
                   T = 1600 ohm x 100e-9 F = 0.00016 s = 160 us

Sau mot T, tu nap len 63.2% dien ap cuoi cung.
Tu buoc nhay 5 V:  5 x 0.632 = 3.16 V sau 160 us
Coi nhu nap day sau 5T = 800 us</code></pre>
<div class="out">T = 160 us · 3,16 V sau một T · ổn định sau 800 us</div>
<p><strong>(b) Bằng tay — tần số cắt.</strong> Cùng R và C đó tạo thành một mạch lọc thông thấp, tại tần số cắt thì đầu ra chỉ còn 0,707 lần đầu vào (tức −3 dB):</p>
<pre><code class="language-text">f(c) = 1 / (2 x pi x R x C)
     = 1 / (2 x 3.14159 x 1600 x 100e-9)
     = 1 / 0.00100531
     = 994.7 Hz    -&gt; khoang 1 kHz</code></pre>
<div class="out">f(c) = 994,7 Hz (coi như 1 kHz)</div>
<p><strong>(c) Trong phần mềm mô phỏng.</strong> Dựng mạch một lần rồi chạy hai loại phân tích trên đúng mạch đó:</p>
<ul>
<li><strong>Transient</strong>, đầu vào là bước nhảy 0 lên 5 V, cửa sổ 1 ms: đọc thời điểm đầu ra vượt 3,16 V. Phải khoảng 160 us.</li>
<li><strong>AC sweep</strong>, quét từ 10 Hz tới 100 kHz: tìm tần số mà đầu ra còn 0,707 lần đầu vào. Phải khoảng 995 Hz.</li>
</ul>
<p>Hai loại phân tích, một mạch, hai con số bạn đã đoán trước. Đó chính là CLO6 gói trong một bài tập, và là câu trả lời mạnh cho bất kỳ đề Lab nào yêu cầu "kiểm thử và tối ưu" một mạch.</p>
<div class="pitfall"><b>Trộn đơn vị trong phép nhân R x C.</b> 1,6 kohm x 100 nF phải thành 1600 x 0,0000001; để nguyên một bên có tiền tố là hằng số thời gian lệch hàng nghìn lần. <b>Coi 5 hằng số thời gian là "nạp đầy".</b> Đó là 99,3%, không phải 100% — đủ cho một bài Lab, không đủ cho một câu trả lời thi khẳng định là chính xác. <b>Trông đợi phần mềm logic chỉ ra một mức điện áp tồi.</b> Nó không làm được: nó đã quyết sợi dây là 0 hay 1 từ trước khi câu hỏi nảy ra. Một mạch chạy tốt trong phần mềm logic vẫn có thể hỏng trên breadboard vì lý do tương tự (analogue). <b>Bỏ qua chữ X.</b> Một chữ X ở đầu ra flip-flop không phải chuyện hình thức — nó nghĩa là trạng thái chưa bao giờ được khởi tạo, và trên phần cứng thật nó sẽ là bất cứ giá trị nào lúc cấp nguồn cho ra.</div>
<h3>Bài tập</h3>
<p><b>P1.</b> R = 10 kohm, C = 10 nF. Tìm hằng số thời gian và tần số cắt.</p>
<div class="dap-an"><pre><code class="language-text">T    = 10000 x 10e-9 = 0.0001 s = 100 us
f(c) = 1 / (2 x pi x 10000 x 10e-9)
     = 1 / 0.00062832
     = 1591.5 Hz    -&gt; khoang 1.59 kHz</code></pre>
<div class="out">T = 100 us · f(c) = 1591,5 Hz</div>
<p>Để ý: R này lớn hơn nhưng C này nhỏ hơn, nên T lại ra <em>ngắn hơn</em> và tần số cắt <em>cao hơn</em>. Chỉ có tích R x C là quan trọng — và đó là lý do một đề thi có thể cho nhiều cặp R/C khác nhau mà cùng một đáp án.</p></div>
<p><b>P2.</b> Một cổng AND hai đầu vào có trễ truyền 10 ns. A ở mức cao từ 0 tới 100 ns; B ở mức cao từ 40 tới 140 ns. Đầu ra ở mức cao trong khoảng nào?</p>
<div class="dap-an"><pre><code class="language-text">Ca hai dau vao cao trong doan chong nhau: 40 ns den 100 ns.
Cong them 10 ns tre vao moi canh:
Dau ra cao tu 50 ns den 110 ns  (rong 60 ns)</code></pre>
<div class="out">Y ở mức cao từ 50 ns tới 110 ns</div>
<p>Xung giữ nguyên độ rộng; nó chỉ bị đẩy sang phải. Các độ trễ cộng dồn dọc theo một chuỗi cổng, và chính độ dịch tích luỹ đó đặt ra tốc độ xung nhịp tối đa của một mạch số.</p></div>`,
  ]]);

/* ── 1.6 buổi 6 — cột CLO TRỐNG trên FLM ─────────────────────────────────── */
const l16 = doc('eei101-1-6-gioi-thieu-thuyet-trinh',
  '1.6 — Introduction to presentation (the 10% mark)|||1.6 — Giới thiệu về thuyết trình (đầu điểm 10%)',
  'Buổi 6, cột CLO TRỐNG trên FLM (nêu rõ, không gán bừa): Group presentation là 10% điểm môn, ~15 phút/nhóm, phủ All CLOs, trình bày ở buổi 59–60; cấu trúc một bài thuyết trình kỹ thuật, cách trình bày số đo, và danh sách câu cần hỏi giảng viên.',
  [[
    `<span class="eyebrow">EEI101 · Session 6 · CLO: not published</span>
<h2>Introduction to presentation — the mark nobody revises for</h2>
<p class="lead">After this session you know what the Group presentation is worth, when you give it, and how to structure fifteen minutes of technical talk so that the measurements you worked hard for actually land.</p>
<p class="nhan">${NGUON} · session 6 — "Introduction to presentation"</p>
<div class="callout warn"><strong>This is the only session in the whole plan with an EMPTY CLO cell.</strong> Every other row names an outcome; row 6 names none. We therefore do not tell you which CLO it serves. Reading the paper as a whole, it clearly prepares the Group presentation, which is tagged "All CLOs" and is the only mark that can reach CLO8 (soft skills) — but that is our <em>reading</em>, not something the university published.</div>
<h3>The facts the syllabus does give you</h3>
<table>
  <thead><tr><th>Field</th><th>Value (FLM, verbatim)</th></tr></thead>
  <tbody>
    <tr><td>Mark</td><td>Group presentation, category on-going, 1 part</td></tr>
    <tr><td>Weight</td><td><strong>10.0%</strong></td></tr>
    <tr><td>Completion criteria</td><td>&gt; 0</td></tr>
    <tr><td>Duration</td><td>~15'/group</td></tr>
    <tr><td>CLOs</td><td>All CLOs</td></tr>
    <tr><td>Number of questions</td><td>Option 1: N/A. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td></tr>
    <tr><td>When</td><td>sessions <strong>59 and 60</strong> ("Presentation")</td></tr>
  </tbody>
</table>
<p>Everything else — the topic, the group size, how groups are formed, the marking rubric, whether slides are required, whether every member must speak — is <strong>not published on the syllabus</strong>. Do not take a classmate's word for any of it.</p>
<h3>Fifteen minutes, structured</h3>
<p>Fifteen minutes is about 10–12 slides and no more. A structure that fits a circuits topic:</p>
<table>
  <thead><tr><th>Minutes</th><th>Section</th><th>What goes in it</th></tr></thead>
  <tbody>
    <tr><td>0–2</td><td>The problem</td><td>one sentence on what your circuit must do and for whom. No history, no definitions.</td></tr>
    <tr><td>2–5</td><td>The design</td><td>the schematic, large enough to read from the back, with the two or three values you chose and <em>why</em>.</td></tr>
    <tr><td>5–9</td><td>What you calculated</td><td>the formulas with numbers substituted — the predicted current, voltage, frequency.</td></tr>
    <tr><td>9–12</td><td>What you measured or simulated</td><td>a table or a plot, next to the prediction, so the two can be compared.</td></tr>
    <tr><td>12–14</td><td>The difference, explained</td><td>the strongest two minutes of any technical talk: name the gap and say what caused it.</td></tr>
    <tr><td>14–15</td><td>Conclusion</td><td>what works, what you would change. Then stop talking.</td></tr>
  </tbody>
</table>
<div class="callout"><strong>Predicted next to measured, in one table.</strong> That single habit is what separates a presentation that sounds like a student reading notes from one that sounds like an engineer. It is also how you demonstrate CLO7 — "measure the characteristics of electronic circuits and effectively present experimental results" — which is the only CLO in the list that contains the word <em>present</em>.</div>
<h3>How to show numbers so they are believed</h3>
<ul>
<li><strong>Units on everything.</strong> "2.88" is not a voltage. This is an instant credibility loss and it is free to avoid.</li>
<li><strong>Sensible significant figures.</strong> If your meter shows three digits, do not write six. 6.12 mA, not 6.122448 mA.</li>
<li><strong>A table beats a paragraph</strong> for measurements, and a plot beats a table once there are more than about six rows.</li>
<li><strong>Say the difference as a percentage.</strong> "Predicted 3.00 V, measured 2.94 V — 2% low, consistent with the meter's loading" is a complete, defensible sentence.</li>
<li><strong>Never present a number you did not obtain.</strong> If the simulation gave it, say "simulated". If the bench gave it, say "measured". Blurring the two is the one thing that can turn a technical question into an integrity question.</li>
</ul>
<div class="pitfall"><b>Reading the slides aloud.</b> The audience reads faster than you speak; the slide is the evidence, you are the explanation. <b>A schematic pasted at screenshot size.</b> If it cannot be read from the back row it is decoration. Redraw the relevant part. <b>Spending eight of fifteen minutes on theory.</b> The examiner knows Ohm's law. What they do not know is what <em>you</em> built and measured. <b>One member doing all the talking.</b> It is a <em>group</em> presentation tagged "All CLOs", and CLO8 is explicitly about teamwork and communication. <b>Leaving the topic and the rubric until week 10.</b> The presentation lands in sessions 59–60, the very end, next to Lab 4 and Progress test 2 — the busiest fortnight of the course.</div>
<h3>Ask your lecturer these, in session 6</h3>
<ol>
<li>Is our class on <strong>Option 1</strong> or <strong>Option 2</strong> for the on-going marks?</li>
<li>Who chooses the topic, and by when must it be agreed?</li>
<li>How many people per group, and how are groups formed?</li>
<li>Is there a marking rubric, and can we see it?</li>
<li>Must every member speak? Is there a Q&amp;A after the 15 minutes?</li>
<li>Are slides required, and is a written report required as well?</li>
</ol>
<div class="note-ct">Why this list, in this session (our advice): the presentation is the only mark in EEI101 whose <em>content</em> is not fixed by a chapter of the textbook, which makes it the easiest mark to lose by accident and one of the easier ones to secure early. Ten percent is the same weight as both Progress tests combined — and unlike them, you get to prepare it with your group, with the book open.</div>`,
    `<span class="eyebrow">EEI101 · Buổi 6 · CLO: trường không công bố</span>
<h2>Giới thiệu về thuyết trình — đầu điểm không ai ôn</h2>
<p class="lead">Học xong buổi này bạn biết Group presentation nặng bao nhiêu điểm, trình bày vào buổi nào, và cách bố cục mười lăm phút nói kỹ thuật sao cho những số đo bạn làm cực khổ mới có được thật sự tới được người nghe.</p>
<p class="nhan">${NGUON} · buổi 6 — "Introduction to presentation"</p>
<div class="callout warn"><strong>Đây là buổi DUY NHẤT trong cả kế hoạch có ô CLO TRỐNG.</strong> Mọi dòng khác đều gọi tên một chuẩn đầu ra; riêng dòng 6 không gọi tên cái nào. Vì thế web không nói với bạn buổi này phục vụ CLO nào. Đọc cả bản giấy thì rõ ràng nó chuẩn bị cho Group presentation — đầu điểm gắn "All CLOs" và là đầu điểm duy nhất chạm tới được CLO8 (kỹ năng mềm) — nhưng đó là <em>cách đọc</em> của web, không phải điều trường công bố.</div>
<h3>Những dữ kiện syllabus có cho bạn</h3>
<table>
  <thead><tr><th>Trường (field)</th><th>Giá trị (FLM, nguyên văn)</th></tr></thead>
  <tbody>
    <tr><td>Đầu điểm</td><td>Group presentation, loại on-going, 1 phần</td></tr>
    <tr><td>Trọng số</td><td><strong>10,0%</strong></td></tr>
    <tr><td>Tiêu chí đạt</td><td>&gt; 0</td></tr>
    <tr><td>Thời lượng</td><td>~15 phút/nhóm</td></tr>
    <tr><td>CLO</td><td>All CLOs</td></tr>
    <tr><td>Số câu</td><td>Option 1: N/A. Option 2 (For Constructivism Approach only): Follow lecturer's proposal</td></tr>
    <tr><td>Khi nào</td><td>buổi <strong>59 và 60</strong> ("Presentation")</td></tr>
  </tbody>
</table>
<p>Mọi thứ còn lại — đề tài, số người mỗi nhóm, cách chia nhóm, thang chấm (rubric), có bắt buộc slide hay không, có bắt buộc mọi thành viên phải nói hay không — <strong>syllabus KHÔNG công bố</strong>. Đừng tin lời một bạn cùng lớp về bất kỳ điểm nào trong số đó.</p>
<h3>Mười lăm phút, có bố cục</h3>
<p>Mười lăm phút là khoảng 10–12 slide, không hơn. Một bố cục vừa vặn cho đề tài về mạch điện:</p>
<table>
  <thead><tr><th>Phút</th><th>Phần</th><th>Đặt gì vào đó</th></tr></thead>
  <tbody>
    <tr><td>0–2</td><td>Bài toán</td><td>một câu về việc mạch của bạn phải làm gì và làm cho ai. Không lịch sử, không định nghĩa.</td></tr>
    <tr><td>2–5</td><td>Thiết kế</td><td>sơ đồ mạch, vẽ đủ lớn để đọc được từ hàng cuối, kèm hai ba trị số bạn đã chọn và <em>vì sao</em> chọn thế.</td></tr>
    <tr><td>5–9</td><td>Phần bạn tính</td><td>công thức đã thay số vào — dòng, áp, tần số dự đoán.</td></tr>
    <tr><td>9–12</td><td>Phần bạn đo hoặc mô phỏng</td><td>một bảng hoặc một đồ thị, đặt CẠNH phần dự đoán để so được với nhau.</td></tr>
    <tr><td>12–14</td><td>Giải thích chênh lệch</td><td>hai phút mạnh nhất của mọi bài nói kỹ thuật: chỉ ra khoảng lệch và nói nguyên nhân.</td></tr>
    <tr><td>14–15</td><td>Kết luận</td><td>cái gì chạy được, cái gì bạn sẽ đổi. Rồi dừng nói.</td></tr>
  </tbody>
</table>
<div class="callout"><strong>Dự đoán đặt cạnh số đo, trong cùng một bảng.</strong> Riêng thói quen đó phân biệt một bài thuyết trình nghe như sinh viên đọc vở với một bài nghe như kỹ sư trình bày. Nó cũng là cách bạn thể hiện CLO7 — "đo các đặc tính của mạch điện tử và trình bày kết quả thực nghiệm một cách hiệu quả" — chuẩn đầu ra duy nhất trong danh sách có chứa chữ <em>trình bày</em>.</div>
<h3>Trình bày số liệu sao cho người ta tin</h3>
<ul>
<li><strong>Có đơn vị ở mọi con số.</strong> "2,88" không phải một điện áp. Đây là kiểu mất uy tín tức thì mà không mất gì để tránh.</li>
<li><strong>Số chữ số có nghĩa hợp lý.</strong> Đồng hồ hiện ba chữ số thì đừng viết sáu. 6,12 mA, không phải 6,122448 mA.</li>
<li><strong>Một bảng hơn một đoạn văn</strong> khi trình bày số đo, và một đồ thị hơn một bảng khi đã quá khoảng sáu dòng.</li>
<li><strong>Nói chênh lệch bằng phần trăm.</strong> "Dự đoán 3,00 V, đo được 2,94 V — thấp hơn 2%, khớp với hiệu ứng tải của đồng hồ" là một câu hoàn chỉnh và bảo vệ được.</li>
<li><strong>Đừng bao giờ trình bày một con số bạn không tự lấy ra.</strong> Nếu nó từ mô phỏng thì nói "mô phỏng". Nếu nó từ bàn thí nghiệm thì nói "đo được". Làm mờ hai thứ đó là điều duy nhất có thể biến một câu hỏi kỹ thuật thành một câu hỏi về trung thực.</li>
</ul>
<div class="pitfall"><b>Đọc slide thành tiếng.</b> Người nghe đọc nhanh hơn bạn nói; slide là bằng chứng, còn bạn là phần giải thích. <b>Dán sơ đồ mạch ở cỡ ảnh chụp màn hình.</b> Nếu hàng cuối không đọc được thì nó chỉ là đồ trang trí. Hãy vẽ lại phần cần nói. <b>Dành tám trong mười lăm phút cho lý thuyết.</b> Người chấm biết định luật Ohm rồi. Thứ họ chưa biết là <em>bạn</em> đã dựng và đo được cái gì. <b>Một người nói hết.</b> Đó là thuyết trình <em>nhóm</em>, gắn "All CLOs", và CLO8 nói thẳng về làm việc nhóm và giao tiếp. <b>Để đề tài và thang chấm tới tuần 10 mới hỏi.</b> Thuyết trình rơi vào buổi 59–60, sát cuối kỳ, nằm ngay cạnh Lab 4 và Progress test 2 — hai tuần bận nhất của cả môn.</div>
<h3>Hãy hỏi giảng viên những câu này, ngay buổi 6</h3>
<ol>
<li>Lớp mình theo <strong>Option 1</strong> hay <strong>Option 2</strong> cho các đầu điểm on-going?</li>
<li>Ai chọn đề tài, và phải chốt đề tài trước thời điểm nào?</li>
<li>Mỗi nhóm bao nhiêu người, và chia nhóm theo cách nào?</li>
<li>Có thang chấm (rubric) không, và chúng em xem được không?</li>
<li>Mọi thành viên có bắt buộc phải nói không? Sau 15 phút có phần hỏi đáp không?</li>
<li>Có bắt buộc làm slide không, và có phải nộp thêm báo cáo viết không?</li>
</ol>
<div class="note-ct">Vì sao là danh sách này, ở đúng buổi này (lời khuyên của web): thuyết trình là đầu điểm duy nhất của EEI101 mà <em>nội dung</em> không bị cố định bởi một chương sách, nên nó là đầu điểm dễ mất oan nhất và cũng là một trong những đầu điểm dễ chốt sớm nhất. Mười phần trăm là bằng trọng số của cả hai bài Progress test cộng lại — và khác với chúng, cái này bạn được chuẩn bị cùng nhóm, với sách mở.</div>`,
  ]]);

/* ── 1.7 buổi 7 — CLO7 ───────────────────────────────────────────────────── */
const l17 = doc('eei101-1-7-dong-ho-van-nang',
  '1.7 — Test equipment: analogue and digital multi-range meters|||1.7 — Thiết bị đo: đồng hồ vạn năng kim và đồng hồ số',
  'Buổi 7, CLO7, Tooley 3.1–3.2: đồng hồ kim và độ nhạy ohm/volt, hiệu ứng TẢI của đồng hồ tính bằng số thật (đọc 4,0 V thay vì 5,0 V — lệch 20%), đồng hồ số 3 chữ số rưỡi và độ phân giải, cách mắc vôn kế/ampe kế/ôm kế cho đúng.',
  [[
    `<span class="eyebrow">EEI101 · Session 7 · CLO7</span>
<h2>The multimeter: how to connect it, and how it lies to you</h2>
<p class="lead">After this session you can connect a meter three different ways without damaging it, read the sensitivity spec on an analogue meter, and calculate exactly how much a meter changes the circuit it is measuring — a 20% error, in the worked example below.</p>
<p class="nhan">${NGUON} · session 7 — "Chapter 3: Test equipment and measurements — 3.1 Multi-range meters; 3.2 Digital multi-range meters"</p>
<h3>The three connections — get this wrong and something breaks</h3>
<table>
  <thead><tr><th>Measuring</th><th>Connect the meter</th><th>Ideal meter resistance</th><th>If you get it wrong</th></tr></thead>
  <tbody>
    <tr><td><strong>Voltage</strong></td><td><strong>in parallel</strong> (across the component)</td><td>infinite — it should take no current</td><td>it loads the circuit and reads low (see below)</td></tr>
    <tr><td><strong>Current</strong></td><td><strong>in series</strong> (break the path, put the meter in it)</td><td>zero — it should drop no voltage</td><td>a current meter placed in PARALLEL is a short circuit: blown fuse at best</td></tr>
    <tr><td><strong>Resistance</strong></td><td>across the component, <strong>power off, component disconnected</strong></td><td>—</td><td>with power on, you measure nonsense and may damage the meter</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>The single most expensive beginner mistake in this course.</strong> A meter set to <em>amps</em> has an internal resistance of almost zero. Put it across a battery and you have connected a wire across the battery. Result: a blown internal fuse, a scorched lead, sometimes a ruined meter. <strong>Current is measured in series, always — you must break the circuit to do it.</strong> If you did not have to unplug a wire, you are not measuring current.</div>
<h3>3.1 Analogue multi-range meters, and the sensitivity spec</h3>
<p>An analogue meter is a moving coil that deflects fully at a small current — the <strong>full-scale deflection (FSD)</strong>, often 50 uA. To read volts, a resistor is put in series with the movement; to read amps, a small resistor is put in parallel with it. The meter's quality is quoted as a <strong>sensitivity in ohms per volt</strong>:</p>
<div class="formula">input resistance on a range = sensitivity (ohm/V) x the range's full-scale voltage</div>
<pre><code class="language-text">A 20 kohm/V meter, set to the 10 V range:
input resistance = 20000 x 10 = 200000 ohm = 200 kohm

(and 20 kohm/V is exactly a 50 uA movement:
 1 / 20000 = 0.00005 A = 50 uA at full scale)</code></pre>
<div class="out">Input resistance on the 10 V range = 200 kohm</div>
<h3>Worked example — the loading effect, in numbers</h3>
<p>Two 100 kohm resistors form a divider across 10 V. Predict the reading, then compute what the meter actually shows.</p>
<div class="diagram"><pre>  10 V o----+
            |
           [ ] 100 kohm
            |
            +----o  measure HERE
            |
           [ ] 100 kohm
            |
          --+--  0 V</pre></div>
<pre><code class="language-text">TRUE voltage (no meter):  10 x 100k / (100k + 100k) = 5.00 V

Now attach the 20 kohm/V meter on its 10 V range (200 kohm):
it sits in PARALLEL with the lower resistor.
  100k in parallel with 200k = (100k x 200k) / 300k = 66.67 kohm
  reading = 10 x 66.67k / (100k + 66.67k)
          = 10 x 66.67 / 166.67
          = 4.00 V

Error = (4.00 - 5.00) / 5.00 = -0.20 = -20%</code></pre>
<div class="out">True 5.00 V · analogue meter reads 4.00 V · error -20%</div>
<p>Nothing is faulty. The meter is a 200 kohm resistor, and you added it to the circuit. Now repeat with a digital meter whose input resistance is 10 Mohm:</p>
<pre><code class="language-text">  100k in parallel with 10M = (100k x 10M) / 10.1M = 99.01 kohm
  reading = 10 x 99.01 / 199.01 = 4.98 V
  Error = (4.975 - 5.00) / 5.00 = -0.50%</code></pre>
<div class="out">Digital meter reads 4.98 V · error -0.5%</div>
<div class="callout"><strong>That comparison is the whole reason digital meters won.</strong> Same circuit, same physics: 20% error with a 200 kohm meter, 0.5% with a 10 Mohm one. The rule that follows: <strong>a voltmeter must be much higher in resistance than the circuit you point it at.</strong> With high-value resistors — 100 kohm and up, which is common around sensors and op-amp inputs — a cheap meter is not merely imprecise, it is misleading.</div>
<h3>3.2 Digital multi-range meters</h3>
<table>
  <thead><tr><th>Term</th><th>What it means</th><th>Typical</th></tr></thead>
  <tbody>
    <tr><td>Digits / counts</td><td>"3 and a half digits" = three full digits plus a leading 1, so it counts to <strong>1999</strong></td><td>3.5 digits (cheap), 4.5 digits (lab)</td></tr>
    <tr><td>Resolution</td><td>the smallest step it can show <em>on that range</em>: range divided by counts</td><td>20 V range / 2000 = 0.01 V</td></tr>
    <tr><td>Accuracy</td><td>how close the reading is to the truth, quoted as ±(% of reading + n digits)</td><td>±(0.5% + 2 digits) — see session 9</td></tr>
    <tr><td>Input resistance (V ranges)</td><td>how much it loads the circuit</td><td>10 Mohm</td></tr>
    <tr><td>Autorange</td><td>the meter picks the range itself</td><td>convenient, but it hides which range you are on</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Resolution is not accuracy.</strong> A meter showing 4.99 V is resolving to 0.01 V, which says nothing about whether the true value is 4.99 V. A cheap meter can display four digits of a wrong number very precisely. Session 9 turns the accuracy spec into an actual ± range.</div>
<div class="pitfall"><b>Ammeter in parallel.</b> Covered above, and worth repeating because it is the mistake that ends Lab sessions: current in series, voltage in parallel. <b>Leads left in the 10 A socket.</b> Most meters have a separate high-current jack. Leave the lead there, switch to volts, and you are measuring voltage through a near-short. Move the lead back every time. <b>Measuring resistance in a live circuit.</b> An ohmmeter works by pushing its own small current through the part; any other voltage present corrupts the answer. Power off, one leg lifted. <b>Measuring resistance in-circuit even with power off.</b> Other components in parallel are measured too, so you read <em>lower</em> than the part's value. <b>Forgetting the meter is part of the circuit.</b> The 20% error above is not a fault, it is physics — and it is a favourite exam question.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A 10 kohm/V analogue meter is used on its 50 V range. What is its input resistance? Would it load a divider made of two 1 kohm resistors noticeably?</p>
<div class="dap-an"><pre><code class="language-text">Input resistance = 10000 x 50 = 500000 ohm = 500 kohm

Loading a 1 kohm lower resistor:
  1k in parallel with 500k = (1000 x 500000) / 501000 = 998.0 ohm
  That is 0.2% below 1 kohm -&gt; the reading falls by about 0.1%.</code></pre>
<div class="out">500 kohm input resistance · loading error about 0.1% — negligible here</div>
<p>The lesson is comparative, not absolute: <strong>the same meter that ruined the 100 kohm measurement is perfectly good on a 1 kohm circuit.</strong> Loading depends on the ratio of meter resistance to circuit resistance, never on the meter alone.</p></div>
<p><b>E2.</b> You must measure the current through an LED that is already soldered onto a board. What must you do first, and what is the risk?</p>
<div class="dap-an"><p>You must <strong>break the path</strong> — unsolder one leg, or cut a track, or open a jumper — and insert the meter in series so the LED current flows through it. The risk of taking a short cut and touching the probes across the LED instead is that with the meter on a current range you place a near-short across that part of the circuit: at best the meter's fuse blows, at worst the LED and whatever drives it are damaged. If breaking the path is impossible, measure the voltage across the LED's series resistor instead and divide by its resistance — Ohm's law gives you the current without opening anything.</p>
<pre><code class="language-text">Example: 3.06 V measured across the 220 ohm series resistor
I = V / R = 3.06 / 220 = 0.01391 A = 13.9 mA</code></pre>
<div class="out">I = 13.9 mA, obtained without breaking the circuit</div></div>`,
    `<span class="eyebrow">EEI101 · Buổi 7 · CLO7</span>
<h2>Đồng hồ vạn năng: mắc thế nào, và nó "nói dối" bạn ra sao</h2>
<p class="lead">Học xong buổi này bạn mắc được đồng hồ theo ba cách khác nhau mà không làm hỏng nó, đọc được thông số độ nhạy của đồng hồ kim, và tính được chính xác đồng hồ làm sai lệch cái mạch nó đang đo bao nhiêu — 20% trong ví dụ dưới đây.</p>
<p class="nhan">${NGUON} · buổi 7 — "Chapter 3: Test equipment and measurements — 3.1 Multi-range meters; 3.2 Digital multi-range meters"</p>
<h3>Ba cách mắc — sai là hỏng đồ</h3>
<table>
  <thead><tr><th>Đo cái gì</th><th>Mắc đồng hồ thế nào</th><th>Điện trở lý tưởng của đồng hồ</th><th>Mắc sai thì sao</th></tr></thead>
  <tbody>
    <tr><td><strong>Điện áp</strong></td><td><strong>song song</strong> (ngang qua linh kiện)</td><td>vô cùng lớn — lý tưởng là không rút dòng nào</td><td>nó làm tải cho mạch và đọc thấp đi (xem bên dưới)</td></tr>
    <tr><td><strong>Dòng điện</strong></td><td><strong>nối tiếp</strong> (cắt đường đi của dòng, đặt đồng hồ vào đó)</td><td>bằng 0 — lý tưởng là không sụt volt nào</td><td>ampe kế mắc SONG SONG là một chỗ ngắn mạch: nhẹ thì đứt cầu chì</td></tr>
    <tr><td><strong>Điện trở</strong></td><td>ngang qua linh kiện, <strong>đã tắt nguồn, đã tháo linh kiện khỏi mạch</strong></td><td>—</td><td>còn điện thì số đọc vô nghĩa và có thể hỏng đồng hồ</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>Lỗi tốn kém nhất của người mới trong cả môn này.</strong> Một đồng hồ đang để ở thang <em>ampe</em> có điện trở trong gần như bằng 0. Đặt nó ngang qua cục pin là bạn vừa nối một sợi dây ngang qua pin. Kết quả: đứt cầu chì trong máy, cháy que đo, có khi hỏng luôn đồng hồ. <strong>Dòng điện luôn đo bằng cách mắc NỐI TIẾP — phải cắt mạch ra mới đo được.</strong> Nếu bạn không phải rút một sợi dây nào thì bạn đang không đo dòng.</div>
<h3>3.1 Đồng hồ kim đa thang đo, và thông số độ nhạy</h3>
<p>Đồng hồ kim là một cuộn dây động lệch hết thang ở một dòng rất nhỏ — gọi là <strong>độ lệch toàn thang (FSD)</strong>, thường là 50 uA. Muốn đo volt thì mắc thêm một điện trở nối tiếp với cơ cấu; muốn đo ampe thì mắc một điện trở nhỏ song song với nó. Chất lượng đồng hồ được ghi bằng <strong>độ nhạy tính theo ohm trên volt</strong>:</p>
<div class="formula">điện trở vào ở một thang = độ nhạy (ohm/V) x điện áp toàn thang của thang đó</div>
<pre><code class="language-text">Dong ho 20 kohm/V, dat o thang 10 V:
dien tro vao = 20000 x 10 = 200000 ohm = 200 kohm

(va 20 kohm/V chinh la co cau 50 uA:
 1 / 20000 = 0.00005 A = 50 uA o toan thang)</code></pre>
<div class="out">Điện trở vào ở thang 10 V = 200 kohm</div>
<h3>Ví dụ — hiệu ứng tải, bằng con số</h3>
<p>Hai điện trở 100 kohm tạo thành bộ chia áp trên 10 V. Hãy đoán số đọc, rồi tính xem đồng hồ thật sự chỉ bao nhiêu.</p>
<div class="diagram"><pre>  10 V o----+
            |
           [ ] 100 kohm
            |
            +----o  DO O DAY
            |
           [ ] 100 kohm
            |
          --+--  0 V</pre></div>
<pre><code class="language-text">Dien ap THAT (chua co dong ho): 10 x 100k / (100k + 100k) = 5.00 V

Gio gan dong ho 20 kohm/V o thang 10 V (200 kohm):
no nam SONG SONG voi dien tro phia duoi.
  100k song song 200k = (100k x 200k) / 300k = 66.67 kohm
  so doc = 10 x 66.67k / (100k + 66.67k)
         = 10 x 66.67 / 166.67
         = 4.00 V

Sai so = (4.00 - 5.00) / 5.00 = -0.20 = -20%</code></pre>
<div class="out">Thật 5,00 V · đồng hồ kim đọc 4,00 V · sai lệch −20%</div>
<p>Không có gì hỏng cả. Đồng hồ chính là một điện trở 200 kohm, và bạn vừa thêm nó vào mạch. Giờ làm lại với đồng hồ số có điện trở vào 10 Mohm:</p>
<pre><code class="language-text">  100k song song 10M = (100k x 10M) / 10.1M = 99.01 kohm
  so doc = 10 x 99.01 / 199.01 = 4.98 V
  Sai so = (4.975 - 5.00) / 5.00 = -0.50%</code></pre>
<div class="out">Đồng hồ số đọc 4,98 V · sai lệch −0,5%</div>
<div class="callout"><strong>Phép so sánh đó chính là toàn bộ lý do đồng hồ số thắng.</strong> Cùng một mạch, cùng một vật lý: sai 20% với đồng hồ 200 kohm, sai 0,5% với đồng hồ 10 Mohm. Quy tắc rút ra: <strong>vôn kế phải có điện trở LỚN HƠN NHIỀU so với mạch mà nó chĩa vào.</strong> Với các điện trở trị số lớn — từ 100 kohm trở lên, rất thường gặp quanh cảm biến và đầu vào op-amp — một cái đồng hồ rẻ không chỉ là kém chính xác, nó dẫn bạn tới kết luận sai.</div>
<h3>3.2 Đồng hồ số đa thang đo</h3>
<table>
  <thead><tr><th>Thuật ngữ</th><th>Nghĩa</th><th>Điển hình</th></tr></thead>
  <tbody>
    <tr><td>Số chữ số / số đếm (counts)</td><td>"3 chữ số rưỡi" = ba chữ số đầy đủ cộng một số 1 dẫn đầu, nên nó đếm tới <strong>1999</strong></td><td>3,5 chữ số (loại rẻ), 4,5 chữ số (loại phòng thí nghiệm)</td></tr>
    <tr><td>Độ phân giải (resolution)</td><td>bước nhỏ nhất nó hiện được <em>trên thang đó</em>: thang chia cho số đếm</td><td>thang 20 V / 2000 = 0,01 V</td></tr>
    <tr><td>Độ chính xác (accuracy)</td><td>số đọc gần sự thật tới đâu, ghi dạng ±(% của số đọc + n chữ số)</td><td>±(0,5% + 2 chữ số) — xem buổi 9</td></tr>
    <tr><td>Điện trở vào (các thang V)</td><td>nó làm tải cho mạch nhiều hay ít</td><td>10 Mohm</td></tr>
    <tr><td>Tự chọn thang (autorange)</td><td>đồng hồ tự chọn thang</td><td>tiện, nhưng nó che mất việc bạn đang ở thang nào</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Độ phân giải KHÔNG phải độ chính xác.</strong> Một đồng hồ hiện 4,99 V là đang phân giải tới 0,01 V, điều đó chẳng nói gì về việc giá trị thật có phải 4,99 V hay không. Một cái đồng hồ rẻ hiện được bốn chữ số của một con số sai rất chính xác. Buổi 9 sẽ biến thông số accuracy thành một khoảng ± cụ thể.</div>
<div class="pitfall"><b>Ampe kế mắc song song.</b> Đã nói ở trên, và đáng nhắc lại vì đó là lỗi làm kết thúc sớm các buổi Lab: dòng thì nối tiếp, áp thì song song. <b>Để que đo trong lỗ 10 A.</b> Hầu hết đồng hồ có một lỗ riêng cho dòng lớn. Để que ở đó, xoay về thang volt, thế là bạn đang đo điện áp qua một đường gần như ngắn mạch. Hãy cắm que về chỗ cũ, mỗi lần. <b>Đo điện trở trong mạch đang có điện.</b> Ôm kế làm việc bằng cách tự đẩy một dòng nhỏ qua linh kiện; mọi điện áp khác đang tồn tại đều làm sai kết quả. Tắt nguồn, nhấc một chân ra. <b>Đo điện trở ngay trên mạch dù đã tắt nguồn.</b> Các linh kiện khác mắc song song cũng bị đo luôn, nên bạn đọc ra trị số <em>nhỏ hơn</em> giá trị thật. <b>Quên rằng đồng hồ là một phần của mạch.</b> Sai số 20% ở trên không phải sự cố, nó là vật lý — và là một câu hỏi thi rất được ưa dùng.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Một đồng hồ kim 10 kohm/V dùng ở thang 50 V. Điện trở vào của nó là bao nhiêu? Nó có làm tải đáng kể cho một bộ chia áp gồm hai điện trở 1 kohm không?</p>
<div class="dap-an"><pre><code class="language-text">Dien tro vao = 10000 x 50 = 500000 ohm = 500 kohm

Lam tai cho dien tro 1 kohm phia duoi:
  1k song song 500k = (1000 x 500000) / 501000 = 998.0 ohm
  Thap hon 1 kohm khoang 0.2% -&gt; so doc giam khoang 0.1%.</code></pre>
<div class="out">Điện trở vào 500 kohm · sai số do tải khoảng 0,1% — không đáng kể ở đây</div>
<p>Bài học nằm ở tính so sánh, không phải tính tuyệt đối: <strong>chính cái đồng hồ đã phá phép đo 100 kohm lại hoàn toàn tốt trên một mạch 1 kohm.</strong> Hiệu ứng tải phụ thuộc vào TỈ LỆ giữa điện trở đồng hồ và điện trở mạch, chứ không bao giờ phụ thuộc vào đồng hồ một mình.</p></div>
<p><b>E2.</b> Bạn phải đo dòng qua một con LED đã hàn sẵn trên bo. Trước tiên phải làm gì, và rủi ro là gì?</p>
<div class="dap-an"><p>Bạn phải <strong>cắt đường đi của dòng</strong> — tháo hàn một chân, hoặc cắt một đường mạch, hoặc rút một jumper — rồi đưa đồng hồ vào nối tiếp để dòng của LED chạy qua nó. Rủi ro nếu làm tắt bằng cách chạm hai que ngang qua LED: với đồng hồ đang ở thang dòng, bạn đặt một đường gần như ngắn mạch lên đúng đoạn đó của mạch — nhẹ thì đứt cầu chì trong máy, nặng thì hỏng cả LED và thứ đang lái nó. Nếu không thể cắt mạch, hãy đo điện áp trên con điện trở hạn dòng nối tiếp với LED rồi chia cho trị số của nó — định luật Ohm cho bạn dòng điện mà không phải mở mạch ra.</p>
<pre><code class="language-text">Vi du: do duoc 3.06 V tren dien tro noi tiep 220 ohm
I = V / R = 3.06 / 220 = 0.01391 A = 13.9 mA</code></pre>
<div class="out">I = 13,9 mA, lấy được mà không phải cắt mạch</div></div>`,
  ]]);

/* ── 1.8 buổi 8 — CLO7 ───────────────────────────────────────────────────── */
const l18 = doc('eei101-1-8-dao-dong-ky',
  '1.8 — The oscilloscope: reading a waveform off the screen|||1.8 — Dao động ký: đọc dạng sóng trên màn hình',
  'Buổi 8, CLO7, Tooley 3.3: ba núm quan trọng (V/div, time/div, trigger), tính Vpp/Vpk/Vrms từ số ô đếm được (12 Vpp -> 4,24 Vrms), tính chu kỳ và tần số (2 ms -> 500 Hz), ghép AC/DC, bẫy que đo x10 và bẫy dây đất.',
  [[
    `<span class="eyebrow">EEI101 · Session 8 · CLO7</span>
<h2>The oscilloscope — a voltmeter with a time axis</h2>
<p class="lead">After this session you can set up a scope from cold, count divisions to get peak-to-peak voltage, period and frequency, convert those to RMS, and avoid the two mistakes that make a scope reading wrong by exactly a factor of ten.</p>
<p class="nhan">${NGUON} · session 8 — "3.3 The oscilloscope"</p>
<h3>What it is for</h3>
<p>A multimeter gives you one number per measurement. An oscilloscope draws <strong>voltage against time</strong>, so it answers questions a meter cannot: what shape is this signal, how fast is it, is there ripple on my supply, is that digital edge clean or rounded, are these two signals in step?</p>
<h3>Three controls, and what each one does</h3>
<table>
  <thead><tr><th>Control</th><th>Sets</th><th>Read it as</th></tr></thead>
  <tbody>
    <tr><td><strong>Volts/div</strong> (Y amplifier)</td><td>the vertical scale</td><td>voltage = (number of vertical divisions) x (V/div)</td></tr>
    <tr><td><strong>Time/div</strong> (timebase)</td><td>the horizontal scale</td><td>time = (number of horizontal divisions) x (time/div)</td></tr>
    <tr><td><strong>Trigger</strong></td><td>the voltage at which each sweep starts</td><td>get it wrong and the trace rolls or vanishes — the trace is not "broken"</td></tr>
  </tbody>
</table>
<p>Plus one switch that matters daily: <strong>AC / DC coupling</strong>. DC shows the signal as it is, including any steady offset. AC blocks the steady part and shows only the changing part — which is how you see 100 mV of ripple sitting on top of a 12 V rail without the trace flying off the screen.</p>
<h3>Reading the screen — worked example</h3>
<div class="diagram"><pre>   V/div = 2 V      time/div = 0.5 ms
   +----------------------------------------+
   |      .--.              .--.            |  &lt;- crest, 3 div above centre
   |     /    \\            /    \\           |
   |----/------\\----------/------\\----------|  &lt;- centre line (0 V)
   |           \\        /        \\        / |
   |            '--..--'          '--..--'  |  &lt;- trough, 3 div below centre
   +----------------------------------------+
     |&lt;--- 4 divisions = one whole cycle ---&gt;|</pre></div>
<pre><code class="language-text">VERTICAL: crest to trough spans 6 divisions
  Vpp  = 6 div x 2 V/div = 12 V peak-to-peak
  Vpk  = 12 / 2          = 6 V peak
  Vrms = Vpk / sqrt(2)   = 6 / 1.41421 = 4.243 V  -&gt; 4.24 V

HORIZONTAL: one cycle spans 4 divisions
  T = 4 div x 0.5 ms/div = 2 ms = 0.002 s
  f = 1 / T = 1 / 0.002  = 500 Hz</code></pre>
<div class="out">Vpp = 12 V · Vpk = 6 V · Vrms = 4.24 V · T = 2 ms · f = 500 Hz</div>
<div class="callout"><strong>The scope shows peaks; a multimeter shows RMS.</strong> Point both at the same sine wave and they disagree — the scope says 6 V peak, the AC meter says 4.24 V, and both are right. Mains "220 V" is an RMS figure whose peak is about 311 V, which is why insulation is rated for the peak and not for the number on the label. The conversion Vrms = Vpk / sqrt(2) only holds for a <strong>sine wave</strong>; for a square wave Vrms = Vpk, and a cheap "average-reading" meter gets non-sine waveforms wrong.</div>
<h3>Setting one up from cold</h3>
<ol>
<li>Probe attached, <strong>ground clip connected to the circuit's ground</strong> — not to a live node.</li>
<li>Coupling to <strong>DC</strong> first, so you can see where the signal actually sits.</li>
<li>Time/div to something plausible: for an audio signal, tens of microseconds to a millisecond.</li>
<li>Volts/div starting coarse (e.g. 5 V/div) and stepping finer until the waveform fills about 6 of the 8 vertical divisions. <strong>A trace that fills the screen is read more accurately</strong> — you are counting divisions, so more divisions means a smaller relative error.</li>
<li>Trigger level into the middle of the waveform, on a rising edge. The trace stops sliding.</li>
<li>Now count divisions, and write down the V/div and time/div settings <em>next to</em> your numbers in your Lab book. A division count without the settings is meaningless an hour later.</li>
</ol>
<div class="pitfall"><b>The x10 probe.</b> Most probes switch between x1 and x10. On x10 the probe divides the signal by ten, so the true voltage is <strong>ten times</strong> what the screen shows unless the scope knows the probe setting. Symptom: everything reads 10x too small, or 10x too big. Check the probe switch before you trust any measurement. <b>Confusing Vpp, Vpk and Vrms.</b> Three different numbers for the same wave. In the example above they are 12 V, 6 V and 4.24 V — an exam answer of "6 V" to "what is the RMS?" scores zero. <b>The ground clip on a live node.</b> The scope's ground is tied to mains earth, so clipping it to something that is not at 0 V shorts that node to earth through the probe. This destroys circuits and occasionally probes. <b>Blaming the scope for a trigger problem.</b> A rolling or blank trace is almost always the trigger level sitting outside the waveform, not a fault. <b>Leaving AC coupling on when you need the DC level.</b> On AC coupling a 12 V rail with 0.2 V of ripple appears centred on zero — you will read the ripple correctly and the rail voltage not at all.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A sine wave spans 5 divisions crest-to-trough at 0.5 V/div, and one cycle occupies 8 divisions at 20 us/div. Find Vpp, Vrms, the period and the frequency.</p>
<div class="dap-an"><pre><code class="language-text">Vpp  = 5 x 0.5 = 2.5 V
Vpk  = 2.5 / 2 = 1.25 V
Vrms = 1.25 / 1.41421 = 0.8839 V  -&gt; 0.884 V

T = 8 x 20 us = 160 us = 0.00016 s
f = 1 / 0.00016 = 6250 Hz = 6.25 kHz</code></pre>
<div class="out">Vpp = 2.5 V · Vrms = 0.884 V · T = 160 us · f = 6.25 kHz</div>
<p>Note the order: divisions x scale gives peak-to-peak, then halve for peak, then divide by sqrt(2) for RMS. Skipping the halving is the most common slip in this calculation.</p></div>
<p><b>E2.</b> On DC coupling, a trace sits 3 divisions above the centre line and is flat. V/div is 5 V. What are you looking at, and what would AC coupling show?</p>
<div class="dap-an"><p>A steady <strong>DC level of 3 x 5 = 15 V</strong> with no visible variation. Switch to AC coupling and the trace drops to the centre line and becomes an almost flat line at zero — because AC coupling removes the steady 15 V and shows only what changes, and nothing is changing. If you then increase the sensitivity to, say, 20 mV/div, any small ripple or noise riding on that 15 V becomes visible. That two-step move — AC couple, then increase sensitivity — is exactly how you measure power-supply ripple in chapter 8.</p></div>`,
    `<span class="eyebrow">EEI101 · Buổi 8 · CLO7</span>
<h2>Dao động ký — một chiếc vôn kế có trục thời gian</h2>
<p class="lead">Học xong buổi này bạn tự dựng được một phép đo trên dao động ký từ đầu, đếm ô để ra điện áp đỉnh-đỉnh, chu kỳ và tần số, đổi chúng sang giá trị hiệu dụng, và tránh được hai lỗi làm số đọc sai đúng mười lần.</p>
<p class="nhan">${NGUON} · buổi 8 — "3.3 The oscilloscope"</p>
<h3>Nó dùng để làm gì</h3>
<p>Đồng hồ vạn năng cho bạn một con số mỗi lần đo. Dao động ký vẽ <strong>điện áp theo thời gian</strong>, nên nó trả lời được những câu hỏi mà đồng hồ không trả lời được: tín hiệu này có dạng gì, nhanh cỡ nào, đường nguồn của tôi có gợn không, cạnh số kia có sắc hay bị tròn, hai tín hiệu này có đi cùng nhịp không?</p>
<h3>Ba núm điều khiển, mỗi núm làm gì</h3>
<table>
  <thead><tr><th>Núm</th><th>Đặt cái gì</th><th>Đọc thế nào</th></tr></thead>
  <tbody>
    <tr><td><strong>Volts/div</strong> (tầng khuếch đại Y)</td><td>thang chia theo chiều dọc</td><td>điện áp = (số ô theo chiều dọc) x (V/div)</td></tr>
    <tr><td><strong>Time/div</strong> (quét thời gian)</td><td>thang chia theo chiều ngang</td><td>thời gian = (số ô theo chiều ngang) x (time/div)</td></tr>
    <tr><td><strong>Trigger</strong> (đồng bộ)</td><td>mức điện áp mà mỗi lượt quét bắt đầu</td><td>đặt sai là hình trôi hoặc mất — hình KHÔNG phải "bị hỏng"</td></tr>
  </tbody>
</table>
<p>Cộng thêm một công tắc dùng hằng ngày: <strong>ghép AC / DC (coupling)</strong>. DC hiện tín hiệu đúng như nó là, gồm cả phần một chiều cố định. AC chặn phần cố định và chỉ hiện phần biến thiên — đó là cách bạn thấy được 100 mV gợn nằm trên một đường nguồn 12 V mà hình không bay ra khỏi màn.</p>
<h3>Đọc màn hình — ví dụ có số</h3>
<div class="diagram"><pre>   V/div = 2 V      time/div = 0.5 ms
   +----------------------------------------+
   |      .--.              .--.            |  &lt;- dinh, cao 3 o tren tam
   |     /    \\            /    \\           |
   |----/------\\----------/------\\----------|  &lt;- duong tam (0 V)
   |           \\        /        \\        / |
   |            '--..--'          '--..--'  |  &lt;- day, thap 3 o duoi tam
   +----------------------------------------+
     |&lt;--- 4 o = tron mot chu ky --------&gt;|</pre></div>
<pre><code class="language-text">CHIEU DOC: tu dinh xuong day trai ra 6 o
  Vpp  = 6 o x 2 V/o  = 12 V dinh-dinh
  Vpk  = 12 / 2       = 6 V dinh
  Vrms = Vpk / sqrt(2) = 6 / 1.41421 = 4.243 V  -&gt; 4.24 V

CHIEU NGANG: mot chu ky trai ra 4 o
  T = 4 o x 0.5 ms/o = 2 ms = 0.002 s
  f = 1 / T = 1 / 0.002 = 500 Hz</code></pre>
<div class="out">Vpp = 12 V · Vpk = 6 V · Vrms = 4,24 V · T = 2 ms · f = 500 Hz</div>
<div class="callout"><strong>Dao động ký cho bạn giá trị ĐỈNH; đồng hồ vạn năng cho giá trị HIỆU DỤNG.</strong> Chĩa cả hai vào cùng một sóng sin thì chúng nói khác nhau — dao động ký nói 6 V đỉnh, đồng hồ AC nói 4,24 V, và cả hai đều đúng. Điện lưới "220 V" là giá trị hiệu dụng, đỉnh của nó khoảng 311 V, và đó là lý do cách điện phải chịu theo giá trị đỉnh chứ không theo con số ghi trên nhãn. Phép đổi Vrms = Vpk / sqrt(2) chỉ đúng với <strong>sóng sin</strong>; với sóng vuông thì Vrms = Vpk, và một cái đồng hồ rẻ kiểu "đọc trung bình" sẽ đo sai các dạng sóng không phải sin.</div>
<h3>Dựng một phép đo từ đầu</h3>
<ol>
<li>Gắn que đo, <strong>kẹp đất nối vào đất của mạch</strong> — không nối vào một nút đang có điện.</li>
<li>Đặt coupling ở <strong>DC</strong> trước, để thấy được tín hiệu thật sự nằm ở đâu.</li>
<li>Đặt time/div ở một giá trị hợp lý: với tín hiệu âm tần thì cỡ vài chục microgiây tới một milligiây.</li>
<li>Bắt đầu V/div ở mức thô (ví dụ 5 V/ô) rồi giảm dần cho tới khi dạng sóng chiếm khoảng 6 trong 8 ô dọc. <strong>Hình càng lấp đầy màn thì đọc càng chính xác</strong> — bạn đang đếm ô, nên nhiều ô hơn nghĩa là sai số tương đối nhỏ hơn.</li>
<li>Đưa mức trigger vào giữa dạng sóng, chọn cạnh lên. Hình sẽ đứng lại.</li>
<li>Giờ mới đếm ô, và ghi lại thiết đặt V/div cùng time/div <em>ngay bên cạnh</em> các con số trong sổ Lab. Một con số đếm ô mà không có thiết đặt thì một giờ sau là vô nghĩa.</li>
</ol>
<div class="pitfall"><b>Que đo x10.</b> Hầu hết que đo có công tắc chuyển x1 / x10. Ở x10, que chia tín hiệu cho mười, nên điện áp thật <strong>gấp mười lần</strong> con số trên màn, trừ khi dao động ký đã biết thiết đặt của que. Triệu chứng: mọi thứ đọc ra nhỏ đi 10 lần, hoặc to lên 10 lần. Hãy kiểm công tắc trên que trước khi tin bất kỳ phép đo nào. <b>Lẫn Vpp, Vpk và Vrms.</b> Ba con số khác nhau cho cùng một sóng. Trong ví dụ trên chúng là 12 V, 6 V và 4,24 V — trả lời "6 V" cho câu hỏi "giá trị hiệu dụng bằng bao nhiêu?" là không có điểm. <b>Kẹp đất gắn vào nút đang có điện.</b> Đất của dao động ký nối với đất nguồn điện lưới, nên kẹp nó vào một chỗ không phải 0 V là bạn nối chỗ đó xuống đất qua que đo. Việc này phá mạch và thỉnh thoảng phá luôn que. <b>Trách dao động ký vì một chuyện thuộc trigger.</b> Hình trôi hoặc hình trắng gần như luôn là do mức trigger nằm ngoài dạng sóng, không phải do máy hỏng. <b>Để nguyên AC coupling khi cần biết mức một chiều.</b> Ở AC coupling, một đường nguồn 12 V có 0,2 V gợn sẽ hiện ra nằm quanh mức 0 — bạn đọc đúng phần gợn và không đọc được chút nào điện áp của đường nguồn.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Một sóng sin trải 5 ô từ đỉnh xuống đáy ở thang 0,5 V/ô, và một chu kỳ chiếm 8 ô ở thang 20 us/ô. Tìm Vpp, Vrms, chu kỳ và tần số.</p>
<div class="dap-an"><pre><code class="language-text">Vpp  = 5 x 0.5 = 2.5 V
Vpk  = 2.5 / 2 = 1.25 V
Vrms = 1.25 / 1.41421 = 0.8839 V  -&gt; 0.884 V

T = 8 x 20 us = 160 us = 0.00016 s
f = 1 / 0.00016 = 6250 Hz = 6.25 kHz</code></pre>
<div class="out">Vpp = 2,5 V · Vrms = 0,884 V · T = 160 us · f = 6,25 kHz</div>
<p>Chú ý đúng thứ tự: số ô nhân thang cho ra đỉnh-đỉnh, rồi chia hai để ra đỉnh, rồi chia sqrt(2) để ra hiệu dụng. Bỏ quên bước chia hai là lỗi phổ biến nhất trong phép tính này.</p></div>
<p><b>E2.</b> Ở chế độ ghép DC, vết sáng nằm cao hơn đường tâm 3 ô và phẳng. Thang V/div là 5 V. Bạn đang xem cái gì, và nếu chuyển sang ghép AC thì sẽ thấy gì?</p>
<div class="dap-an"><p>Một <strong>mức một chiều 3 x 5 = 15 V</strong> ổn định, không có biến thiên nào nhìn thấy được. Chuyển sang ghép AC thì vết sáng tụt về đường tâm và thành một đường gần như phẳng ở mức 0 — vì ghép AC bỏ đi phần 15 V cố định và chỉ hiện phần thay đổi, mà ở đây không có gì thay đổi. Nếu sau đó bạn tăng độ nhạy lên, chẳng hạn 20 mV/ô, thì mọi gợn hoặc nhiễu nhỏ nằm trên mức 15 V đó sẽ hiện ra. Đúng cặp động tác đó — ghép AC rồi tăng độ nhạy — là cách bạn đo gợn của bộ nguồn ở chương 8.</p></div>`,
  ]]);

/* ── 1.9 buổi 9 — CLO7 ───────────────────────────────────────────────────── */
const l19 = doc('eei101-1-9-khao-sat-va-bai-tap-do-luong',
  '1.9 — Practical investigation: measurement error, and problems|||1.9 — Thực hành khảo sát: sai số phép đo, và bài tập',
  'Buổi 9, CLO7, Tooley 3.4: biến thông số ±(0,5% số đọc + 2 chữ số) thành một khoảng ± thật, phân biệt sai số hệ thống và sai số ngẫu nhiên, chọn đúng thiết bị cho từng việc, và bộ bài tập tổng hợp cả chương 1 có lời giải từng bước.',
  [[
    `<span class="eyebrow">EEI101 · Session 9 · CLO7</span>
<h2>Practical investigation: how wrong is your reading?</h2>
<p class="lead">After this session you can turn a meter's accuracy specification into an actual "the true value lies between X and Y", tell a systematic error from a random one, and write a measurement in your Lab report that an examiner cannot pick holes in.</p>
<p class="nhan">${NGUON} · session 9 — "3.4 Practical investigation &amp; Problems"</p>
<h3>Turning the accuracy spec into a range</h3>
<p>A typical digital meter is specified as <strong>±(0.5% of reading + 2 digits)</strong>. Both terms matter: the percentage grows with the reading, the "digits" term is fixed and dominates at the bottom of a range.</p>
<pre><code class="language-text">Meter on the 20 V range, 3.5 digits -&gt; resolution 20/2000 = 0.01 V
Reading: 4.99 V

0.5% of reading   = 0.005 x 4.99 = 0.02495 V
2 digits          = 2 x 0.01     = 0.02    V
total uncertainty = 0.04495 V    -&gt; about 0.045 V

True value lies between 4.945 V and 5.035 V</code></pre>
<div class="out">4.99 V ± 0.045 V, i.e. 4.945 V to 5.035 V</div>
<p>So a meter displaying "4.99" cannot distinguish 4.95 V from 5.03 V. If your calculation predicted exactly 5.00 V, this measurement <strong>agrees with it</strong> — and saying so is a better Lab conclusion than reporting 4.99 and leaving the reader to wonder.</p>
<div class="callout"><strong>Use the whole range of an instrument.</strong> The "+2 digits" term is the same size wherever you are on the range, so it hurts most when the reading is small. Measuring 1.2 V on a 200 V range gives a huge relative uncertainty; the same 1.2 V on a 2 V range gives a small one. Same meter, same signal, very different answer quality — which is one reason autorange is convenient but worth double-checking.</div>
<h3>Two kinds of error, and only one of them averages away</h3>
<table>
  <thead><tr><th></th><th>Systematic error</th><th>Random error</th></tr></thead>
  <tbody>
    <tr><td>Behaviour</td><td>the same size and direction every time</td><td>scatters either side of the truth</td></tr>
    <tr><td>Causes</td><td>meter loading (session 7), a mis-zeroed needle, a x10 probe unaccounted for, wrong calibration</td><td>noise, reading a needle at an angle (parallax), the last digit flickering</td></tr>
    <tr><td>Repeating the measurement</td><td>does <strong>not</strong> help — you get the same wrong answer</td><td>does help: average several readings</td></tr>
    <tr><td>Cure</td><td>find and correct the cause, or calculate it out (as we did with the 20% loading)</td><td>repeat and average; take the slope of a line rather than one point</td></tr>
  </tbody>
</table>
<div class="note-ct"><strong>Why session 3's slope method was not fussiness</strong> (our note): taking R from the <em>slope</em> of a V–I line rather than from one V/I division defeats a systematic offset and averages random scatter at the same time. That is two error types handled by one habit, and it is the kind of sentence that earns marks in a Lab report — provided you say <em>why</em> you did it and not just <em>that</em> you did it.</div>
<h3>Which instrument for which job</h3>
<table>
  <thead><tr><th>You need to know</th><th>Use</th><th>Because</th></tr></thead>
  <tbody>
    <tr><td>A steady DC voltage, to 3 digits</td><td>digital multimeter</td><td>10 Mohm input, direct numeric reading</td></tr>
    <tr><td>Whether a supply has ripple on it</td><td>oscilloscope, AC coupled</td><td>a meter averages the ripple away</td></tr>
    <tr><td>The frequency of a signal</td><td>oscilloscope (or a frequency counter)</td><td>count divisions for T, then f = 1/T</td></tr>
    <tr><td>The value of a resistor out of circuit</td><td>ohmmeter</td><td>designed for it — power off, at least one leg lifted</td></tr>
    <tr><td>Whether a trace is slowly drifting</td><td>analogue meter (or a scope)</td><td>a moving needle shows a trend that flickering digits hide</td></tr>
    <tr><td>Current in a working circuit you must not break</td><td>measure V across a known resistor, divide</td><td>Ohm's law, no need to open the circuit</td></tr>
  </tbody>
</table>
<h3>Problems — the whole of chapter 1</h3>
<p><b>P1.</b> A meter specified ±(1% of reading + 3 digits) reads 12.34 V on a 20 V range with 0.01 V resolution. State the range the true value lies in.</p>
<div class="dap-an"><pre><code class="language-text">1% of reading = 0.01 x 12.34 = 0.1234 V
3 digits      = 3 x 0.01     = 0.03   V
total         = 0.1534 V      -&gt; about 0.15 V

True value: 12.34 - 0.15 = 12.19 V  to  12.34 + 0.15 = 12.49 V</code></pre>
<div class="out">12.34 V ± 0.15 V, i.e. 12.19 V to 12.49 V</div>
<p>Note that the percentage term (0.123 V) is now four times the digits term (0.03 V) — at the top of a range the percentage dominates, the opposite of the small-reading case.</p></div>
<p><b>P2.</b> Predicted 5.00 V; an analogue 20 kohm/V meter on its 10 V range reads 4.00 V across the lower resistor of a divider made from two 100 kohm resistors. Is the circuit faulty?</p>
<div class="dap-an"><p><strong>No — the circuit is fine and the meter is telling the truth about the circuit <em>with the meter attached</em>.</strong> From session 7:</p>
<pre><code class="language-text">Meter resistance = 20000 x 10 = 200 kohm
100k in parallel with 200k = (100k x 200k)/300k = 66.67 kohm
Reading = 10 x 66.67 / (100 + 66.67) = 4.00 V
Error = (4.00 - 5.00)/5.00 = -20%  (a SYSTEMATIC error)

Fix: measure with a 10 Mohm digital meter -&gt; 4.98 V, error -0.5%</code></pre>
<div class="out">Not a fault — meter loading, 20% systematic. A 10 Mohm meter reads 4.98 V.</div>
<p>Repeating the measurement ten times with the same analogue meter would give 4.00 V ten times: that is how you recognise a systematic error.</p></div>
<p><b>P3.</b> A scope on 2 V/div and 0.5 ms/div shows a sine wave 6 divisions crest-to-trough, one cycle in 4 divisions. A multimeter on AC volts is connected to the same signal. What should it read, and why is it different from the scope?</p>
<div class="dap-an"><pre><code class="language-text">Vpp  = 6 x 2 = 12 V
Vpk  = 6 V
Vrms = 6 / 1.41421 = 4.243 V  -&gt; the meter should read about 4.24 V
T    = 4 x 0.5 ms = 2 ms  =&gt;  f = 500 Hz</code></pre>
<div class="out">Meter reads about 4.24 V RMS; the scope shows 6 V peak. Both correct.</div>
<p>They measure different properties of the same wave. The scope measures <em>instantaneous</em> voltage and you read the extremes off it; an AC meter reports the <strong>RMS</strong> — the DC voltage that would deliver the same power. That is also why "220 V mains" peaks at about 311 V.</p></div>
<p><b>P4.</b> You measure 3.06 V across a 220 ohm resistor in series with an LED, on a meter specified ±(0.5% + 2 digits) with 0.01 V resolution. Find the current, and state how uncertain it is.</p>
<div class="dap-an"><pre><code class="language-text">I = V / R = 3.06 / 220 = 0.013909 A = 13.91 mA

Voltage uncertainty:
  0.5% of 3.06 = 0.0153 V
  2 digits     = 0.02   V
  total        = 0.0353 V  -&gt; about 0.035 V

Worst cases (taking the resistor as exact):
  I(min) = (3.06 - 0.035) / 220 = 0.013750 A = 13.75 mA
  I(max) = (3.06 + 0.035) / 220 = 0.014068 A = 14.07 mA

So I = 13.9 mA, somewhere between 13.75 and 14.07 mA (about +/-1.1%).
And the 220 ohm resistor is itself only 5% accurate, which would
widen the range far more than the meter does.</code></pre>
<div class="out">I = 13.9 mA (13.75 to 14.07 mA from the meter alone; the resistor's 5% tolerance dominates)</div>
<p>The point of the last line: <strong>quoting "13.909 mA" from a 5% resistor is false precision.</strong> Report 13.9 mA, and say which uncertainty is the big one. That single sentence is what separates a measurement from a number.</p></div>`,
    `<span class="eyebrow">EEI101 · Buổi 9 · CLO7</span>
<h2>Thực hành khảo sát: số bạn đọc được sai cỡ nào?</h2>
<p class="lead">Học xong buổi này bạn biến được thông số độ chính xác của đồng hồ thành một câu "giá trị thật nằm giữa X và Y", phân biệt được sai số hệ thống với sai số ngẫu nhiên, và viết được một phép đo trong báo cáo Lab mà người chấm không bắt lỗi được.</p>
<p class="nhan">${NGUON} · buổi 9 — "3.4 Practical investigation &amp; Problems"</p>
<h3>Biến thông số độ chính xác thành một khoảng</h3>
<p>Một đồng hồ số thông thường ghi <strong>±(0,5% số đọc + 2 chữ số)</strong>. Cả hai thành phần đều quan trọng: phần trăm lớn lên theo số đọc, còn phần "chữ số" là cố định và nó chiếm ưu thế khi số đọc nằm ở đáy thang.</p>
<pre><code class="language-text">Dong ho o thang 20 V, 3.5 chu so -&gt; do phan giai 20/2000 = 0.01 V
So doc: 4.99 V

0.5% cua so doc   = 0.005 x 4.99 = 0.02495 V
2 chu so          = 2 x 0.01     = 0.02    V
tong do bat dinh  = 0.04495 V    -&gt; khoang 0.045 V

Gia tri that nam giua 4.945 V va 5.035 V</code></pre>
<div class="out">4,99 V ± 0,045 V, tức từ 4,945 V tới 5,035 V</div>
<p>Vậy một đồng hồ hiện "4,99" không phân biệt được 4,95 V với 5,03 V. Nếu phép tính của bạn dự đoán đúng 5,00 V thì số đo này <strong>khớp với dự đoán</strong> — và nói ra điều đó là một kết luận Lab tốt hơn nhiều so với việc chỉ báo 4,99 rồi để người đọc tự thắc mắc.</p>
<div class="callout"><strong>Hãy dùng hết dải của một thiết bị.</strong> Thành phần "+2 chữ số" có độ lớn như nhau ở mọi chỗ trên thang, nên nó gây hại nhất khi số đọc nhỏ. Đo 1,2 V ở thang 200 V cho độ bất định tương đối rất lớn; đúng 1,2 V đó đo ở thang 2 V thì độ bất định rất nhỏ. Cùng một đồng hồ, cùng một tín hiệu, chất lượng đáp án khác nhau hẳn — và đó là một lý do khiến autorange tuy tiện nhưng vẫn đáng kiểm lại.</div>
<h3>Hai loại sai số, và chỉ một loại bị triệt tiêu khi lấy trung bình</h3>
<table>
  <thead><tr><th></th><th>Sai số hệ thống</th><th>Sai số ngẫu nhiên</th></tr></thead>
  <tbody>
    <tr><td>Biểu hiện</td><td>cùng độ lớn, cùng chiều, mọi lần đo</td><td>tán xạ về cả hai phía của giá trị thật</td></tr>
    <tr><td>Nguyên nhân</td><td>hiệu ứng tải của đồng hồ (buổi 7), kim chưa chỉnh về 0, quên que đo đang ở x10, hiệu chuẩn sai</td><td>nhiễu, đọc kim bị lệch góc mắt (parallax), chữ số cuối nhấp nháy</td></tr>
    <tr><td>Đo lại nhiều lần</td><td><strong>không</strong> giúp gì — bạn nhận đúng cái đáp án sai đó</td><td>có giúp: lấy trung bình vài lần đọc</td></tr>
    <tr><td>Cách chữa</td><td>tìm và sửa nguyên nhân, hoặc tính bù nó ra (như đã làm với sai số tải 20%)</td><td>đo lại rồi lấy trung bình; dùng độ nghiêng của một đường thẳng thay cho một điểm</td></tr>
  </tbody>
</table>
<div class="note-ct"><strong>Vì sao phương pháp lấy độ nghiêng ở buổi 3 không phải chuyện khó tính</strong> (ghi chú của web): lấy R từ <em>độ nghiêng</em> của đường V–I thay vì từ một phép chia V/I sẽ đánh bại một độ lệch hệ thống và đồng thời làm trung bình phần tán xạ ngẫu nhiên. Đó là hai loại sai số bị xử lý bằng một thói quen, và nó chính là kiểu câu có điểm trong báo cáo Lab — miễn là bạn nói <em>vì sao</em> mình làm thế, không chỉ nói rằng mình đã làm thế.</div>
<h3>Việc nào thì dùng thiết bị nào</h3>
<table>
  <thead><tr><th>Bạn cần biết</th><th>Dùng</th><th>Vì</th></tr></thead>
  <tbody>
    <tr><td>Một điện áp một chiều ổn định, tới 3 chữ số</td><td>đồng hồ số</td><td>điện trở vào 10 Mohm, đọc ra số trực tiếp</td></tr>
    <tr><td>Một bộ nguồn có gợn hay không</td><td>dao động ký, ghép AC</td><td>đồng hồ lấy trung bình nên xoá mất phần gợn</td></tr>
    <tr><td>Tần số của một tín hiệu</td><td>dao động ký (hoặc máy đếm tần)</td><td>đếm ô để ra T, rồi f = 1/T</td></tr>
    <tr><td>Trị số một điện trở đã tháo khỏi mạch</td><td>ôm kế</td><td>đúng công dụng của nó — tắt nguồn, nhấc ít nhất một chân</td></tr>
    <tr><td>Một giá trị có đang trôi chậm hay không</td><td>đồng hồ kim (hoặc dao động ký)</td><td>kim chuyển động cho thấy một xu thế mà chữ số nhấp nháy che mất</td></tr>
    <tr><td>Dòng trong một mạch đang chạy mà không được cắt</td><td>đo V trên một điện trở đã biết trị số rồi chia</td><td>định luật Ohm, không cần mở mạch</td></tr>
  </tbody>
</table>
<h3>Bài tập — tổng hợp cả chương 1</h3>
<p><b>P1.</b> Một đồng hồ ghi ±(1% số đọc + 3 chữ số) đọc 12,34 V ở thang 20 V có độ phân giải 0,01 V. Hãy nêu khoảng chứa giá trị thật.</p>
<div class="dap-an"><pre><code class="language-text">1% cua so doc = 0.01 x 12.34 = 0.1234 V
3 chu so      = 3 x 0.01     = 0.03   V
tong          = 0.1534 V      -&gt; khoang 0.15 V

Gia tri that: 12.34 - 0.15 = 12.19 V  den  12.34 + 0.15 = 12.49 V</code></pre>
<div class="out">12,34 V ± 0,15 V, tức từ 12,19 V tới 12,49 V</div>
<p>Để ý rằng thành phần phần trăm (0,123 V) giờ gấp bốn lần thành phần chữ số (0,03 V) — ở phía trên của một thang thì phần trăm chiếm ưu thế, ngược lại với trường hợp số đọc nhỏ.</p></div>
<p><b>P2.</b> Dự đoán 5,00 V; một đồng hồ kim 20 kohm/V ở thang 10 V đọc 4,00 V trên điện trở dưới của bộ chia áp gồm hai con 100 kohm. Mạch có bị lỗi không?</p>
<div class="dap-an"><p><strong>Không — mạch hoàn toàn bình thường, và đồng hồ đang nói thật về cái mạch <em>khi đã có đồng hồ gắn vào</em>.</strong> Theo buổi 7:</p>
<pre><code class="language-text">Dien tro dong ho = 20000 x 10 = 200 kohm
100k song song 200k = (100k x 200k)/300k = 66.67 kohm
So doc = 10 x 66.67 / (100 + 66.67) = 4.00 V
Sai so = (4.00 - 5.00)/5.00 = -20%  (sai so HE THONG)

Cach chua: do bang dong ho so 10 Mohm -&gt; 4.98 V, sai so -0.5%</code></pre>
<div class="out">Không phải lỗi mạch — đây là hiệu ứng tải, sai số hệ thống 20%. Đồng hồ 10 Mohm đọc 4,98 V.</div>
<p>Đo lại mười lần bằng đúng cái đồng hồ kim đó sẽ ra 4,00 V mười lần: đó là cách bạn nhận ra một sai số hệ thống.</p></div>
<p><b>P3.</b> Một dao động ký ở 2 V/ô và 0,5 ms/ô hiện một sóng sin cao 6 ô từ đỉnh xuống đáy, một chu kỳ chiếm 4 ô. Một đồng hồ vạn năng đặt ở thang AC volt được nối vào cùng tín hiệu đó. Nó phải đọc bao nhiêu, và vì sao khác với dao động ký?</p>
<div class="dap-an"><pre><code class="language-text">Vpp  = 6 x 2 = 12 V
Vpk  = 6 V
Vrms = 6 / 1.41421 = 4.243 V  -&gt; dong ho phai doc khoang 4.24 V
T    = 4 x 0.5 ms = 2 ms  =&gt;  f = 500 Hz</code></pre>
<div class="out">Đồng hồ đọc khoảng 4,24 V hiệu dụng; dao động ký cho thấy 6 V đỉnh. Cả hai đều đúng.</div>
<p>Chúng đo hai thuộc tính khác nhau của cùng một sóng. Dao động ký đo điện áp <em>tức thời</em> và bạn đọc các giá trị cực trị trên đó; đồng hồ AC báo về giá trị <strong>hiệu dụng (RMS)</strong> — là điện áp một chiều sinh ra cùng công suất. Đó cũng là lý do "điện lưới 220 V" có đỉnh khoảng 311 V.</p></div>
<p><b>P4.</b> Bạn đo được 3,06 V trên một điện trở 220 ohm nối tiếp với LED, bằng đồng hồ ghi ±(0,5% + 2 chữ số) với độ phân giải 0,01 V. Tìm dòng điện, và nêu độ bất định của nó.</p>
<div class="dap-an"><pre><code class="language-text">I = V / R = 3.06 / 220 = 0.013909 A = 13.91 mA

Do bat dinh cua dien ap:
  0.5% cua 3.06 = 0.0153 V
  2 chu so      = 0.02   V
  tong          = 0.0353 V  -&gt; khoang 0.035 V

Truong hop xau nhat (coi dien tro la chinh xac tuyet doi):
  I(min) = (3.06 - 0.035) / 220 = 0.013750 A = 13.75 mA
  I(max) = (3.06 + 0.035) / 220 = 0.014068 A = 14.07 mA

Vay I = 13.9 mA, nam dau do giua 13.75 va 14.07 mA (khoang +/-1.1%).
Va ban than con dien tro 220 ohm chi chinh xac 5%, dieu do lam
khoang bat dinh rong ra nhieu hon ca phan do dong ho gay ra.</code></pre>
<div class="out">I = 13,9 mA (13,75 tới 14,07 mA nếu chỉ tính đồng hồ; sai số 5% của điện trở còn lớn hơn)</div>
<p>Ý nghĩa của dòng cuối: <strong>ghi "13,909 mA" khi dùng một điện trở sai số 5% là độ chính xác GIẢ.</strong> Hãy báo 13,9 mA, và nói rõ độ bất định nào là cái lớn. Riêng câu đó phân biệt một phép đo với một con số.</p></div>`,
  ]]);

/* ── Quiz Chương 1 ────────────────────────────────────────────────────────── */
const c1q = quiz('eei101-quiz-1', 'Quiz 1 — Sessions 1–9: fundamentals, simulation, measurement|||Quiz 1 — Buổi 1–9: nền tảng, mô phỏng, đo lường', [
  { id: 'q1',
    question: 'Which of these is a BASE SI unit?|||Đơn vị nào sau đây là đơn vị CƠ BẢN của hệ SI?',
    options: ['volt|||volt', 'ohm|||ohm', 'ampere|||ampe (ampere)', 'watt|||watt'],
    correctIndex: 2, points: 1,
    explanation: 'The ampere is the only electrical base unit. Volt, ohm and watt are all derived from metre, kilogram, second and ampere.|||Ampe là đơn vị điện cơ bản duy nhất. Volt, ohm và watt đều là đơn vị dẫn xuất từ mét, kilôgam, giây và ampe.' },
  { id: 'q2',
    question: 'A 100 ohm resistor is connected across 12 V. What is the current and the power?|||Một điện trở 100 ohm nối vào 12 V. Dòng điện và công suất bằng bao nhiêu?',
    options: ['1.2 A and 14.4 W|||1,2 A và 14,4 W', '120 mA and 1.44 W|||120 mA và 1,44 W', '120 mA and 0.12 W|||120 mA và 0,12 W', '12 mA and 0.144 W|||12 mA và 0,144 W'],
    correctIndex: 1, points: 1,
    explanation: 'I = V/R = 12/100 = 0.12 A = 120 mA. P = V x I = 12 x 0.12 = 1.44 W; check P = V^2/R = 144/100 = 1.44 W.|||I = V/R = 12/100 = 0,12 A = 120 mA. P = V x I = 12 x 0,12 = 1,44 W; kiểm lại P = V^2/R = 144/100 = 1,44 W.' },
  { id: 'q3',
    question: '100 nF is the same capacitance as…|||100 nF bằng đúng điện dung nào sau đây?',
    options: ['0.1 uF|||0,1 uF', '10 uF|||10 uF', '1000 pF|||1000 pF', '0.001 uF|||0,001 uF'],
    correctIndex: 0, points: 1,
    explanation: '100 x 10^-9 F = 0.1 x 10^-6 F = 0.1 uF (and also 100 000 pF). The same real capacitor is printed both ways.|||100 x 10^-9 F = 0,1 x 10^-6 F = 0,1 uF (và cũng là 100 000 pF). Cùng một con tụ thật được in theo cả hai cách.' },
  { id: 'q4',
    question: 'How must an ammeter be connected, and why?|||Ampe kế phải mắc thế nào, và vì sao?',
    options: ['In parallel, because it has a high resistance|||Song song, vì nó có điện trở lớn', 'In series, because it must carry the current and has almost no resistance|||Nối tiếp, vì nó phải dẫn chính dòng đó và gần như không có điện trở', 'Either way; it detects the current automatically|||Cách nào cũng được; nó tự phát hiện dòng điện', 'In parallel, with the power switched off|||Song song, và phải tắt nguồn'],
    correctIndex: 1, points: 1,
    explanation: 'Current is measured in series — you must break the circuit. An ammeter has near-zero resistance, so connecting it in parallel is a short circuit: blown fuse at best.|||Dòng điện đo bằng cách mắc nối tiếp — phải cắt mạch ra. Ampe kế có điện trở gần bằng 0, nên mắc song song là tạo ngắn mạch: nhẹ nhất là đứt cầu chì.' },
  { id: 'q5',
    question: 'A 20 kohm/V analogue meter on its 10 V range measures the lower resistor of a divider made of two 100 kohm resistors across 10 V. The true value is 5.00 V. What does the meter read?|||Một đồng hồ kim 20 kohm/V ở thang 10 V đo điện trở dưới của bộ chia áp gồm hai con 100 kohm trên nguồn 10 V. Giá trị thật là 5,00 V. Đồng hồ đọc bao nhiêu?',
    options: ['5.00 V — meters do not change the circuit|||5,00 V — đồng hồ không làm đổi mạch', '4.98 V|||4,98 V', '4.00 V|||4,00 V', '2.50 V|||2,50 V'],
    correctIndex: 2, points: 1,
    explanation: 'The meter is 20000 x 10 = 200 kohm and sits in parallel with the 100 kohm: 100k||200k = 66.67 kohm, so the reading is 10 x 66.67/166.67 = 4.00 V — a 20% systematic loading error. A 10 Mohm digital meter would read 4.98 V.|||Đồng hồ là 20000 x 10 = 200 kohm và nằm song song với con 100 kohm: 100k||200k = 66,67 kohm, nên số đọc là 10 x 66,67/166,67 = 4,00 V — sai số tải hệ thống 20%. Đồng hồ số 10 Mohm sẽ đọc 4,98 V.' },
  { id: 'q6',
    question: 'On a scope at 2 V/div, a sine wave spans 6 divisions crest-to-trough. What is its RMS value?|||Trên dao động ký ở thang 2 V/ô, một sóng sin trải 6 ô từ đỉnh xuống đáy. Giá trị hiệu dụng của nó là bao nhiêu?',
    options: ['12 V|||12 V', '6 V|||6 V', '4.24 V|||4,24 V', '8.49 V|||8,49 V'],
    correctIndex: 2, points: 1,
    explanation: 'Vpp = 6 x 2 = 12 V, so Vpk = 6 V, and Vrms = Vpk/sqrt(2) = 6/1.41421 = 4.24 V. Forgetting to halve Vpp before dividing by sqrt(2) is the classic slip.|||Vpp = 6 x 2 = 12 V, nên Vpk = 6 V, và Vrms = Vpk/sqrt(2) = 6/1,41421 = 4,24 V. Quên chia đôi Vpp trước khi chia sqrt(2) là lỗi kinh điển.' },
  { id: 'q7',
    question: 'Which simulator analysis answers "does my filter cut off at 1 kHz?"|||Loại phân tích nào trả lời câu "mạch lọc của em có cắt ở 1 kHz không?"',
    options: ['DC operating point|||DC operating point (điểm làm việc một chiều)', 'AC / frequency sweep|||AC / quét tần số', 'Transient|||Transient (quá độ)', 'Logic simulation|||Mô phỏng logic'],
    correctIndex: 1, points: 1,
    explanation: 'The answer is a curve of gain against frequency, which is what an AC sweep produces. DC gives one number per node; transient gives a waveform over time.|||Đáp án là một đường cong độ lợi theo tần số, đúng thứ mà AC sweep tạo ra. DC cho một con số mỗi nút; transient cho một dạng sóng theo thời gian.' },
  { id: 'q8',
    question: 'In a SPICE netlist, what does node 0 always mean?|||Trong một netlist SPICE, nút số 0 luôn có nghĩa là gì?',
    options: ['The first component|||Linh kiện đầu tiên', 'A node carrying 0 A|||Một nút có dòng bằng 0 A', 'Ground — the reference node|||Đất (ground) — nút tham chiếu', 'An unconnected node|||Một nút không nối gì'],
    correctIndex: 2, points: 1,
    explanation: 'Node 0 is ground. Every circuit needs it; without a ground the simulator has no reference and reports an error such as "singular matrix" or no result at all.|||Nút 0 là đất. Mọi mạch đều cần nó; không có ground thì phần mềm không có mốc tham chiếu và sẽ báo lỗi kiểu "singular matrix" hoặc không ra kết quả nào.' },
  { id: 'q9',
    question: 'A meter specified ±(0.5% of reading + 2 digits) with 0.01 V resolution reads 4.99 V. Where does the true value lie?|||Một đồng hồ ghi ±(0,5% số đọc + 2 chữ số) với độ phân giải 0,01 V đọc 4,99 V. Giá trị thật nằm ở đâu?',
    options: ['Exactly 4.99 V|||Đúng 4,99 V', 'Between 4.945 V and 5.035 V|||Giữa 4,945 V và 5,035 V', 'Between 4.97 V and 5.01 V|||Giữa 4,97 V và 5,01 V', 'Between 4.49 V and 5.49 V|||Giữa 4,49 V và 5,49 V'],
    correctIndex: 1, points: 1,
    explanation: '0.5% of 4.99 = 0.02495 V, plus 2 digits = 0.02 V, total about 0.045 V. So 4.945 V to 5.035 V — which means this reading agrees with a prediction of exactly 5.00 V.|||0,5% của 4,99 = 0,02495 V, cộng 2 chữ số = 0,02 V, tổng khoảng 0,045 V. Vậy từ 4,945 V tới 5,035 V — nghĩa là số đọc này KHỚP với một dự đoán đúng 5,00 V.' },
  { id: 'q10',
    question: 'An LED needs 15 mA and drops 2 V. From a 5 V supply, what series resistor is required?|||Một LED cần 15 mA và sụt 2 V. Từ nguồn 5 V, cần điện trở nối tiếp bao nhiêu?',
    options: ['333 ohm|||333 ohm', '200 ohm|||200 ohm', '133 ohm|||133 ohm', '75 ohm|||75 ohm'],
    correctIndex: 1, points: 1,
    explanation: 'The resistor takes the leftover voltage: 5 - 2 = 3 V. R = V/I = 3/0.015 = 200 ohm (use the nearest standard value, 220 ohm). Dividing 5 V by 15 mA instead gives 333 ohm — the classic mistake of forgetting the LED\'s own drop.|||Điện trở nhận phần điện áp còn lại: 5 - 2 = 3 V. R = V/I = 3/0,015 = 200 ohm (dùng trị số chuẩn gần nhất, 220 ohm). Nếu lấy 5 V chia 15 mA thì ra 333 ohm — đúng cái lỗi kinh điển là quên phần sụt áp của chính con LED.' },
], 600);

/* ════════════════════════════════════════════════════════════════════════════
 * CHƯƠNG 2 → 13 — KHUNG (đúng tên bài, đúng buổi/CLO/mục sách, 3–6 dòng mốc).
 * Bài giảng chi tiết bổ sung sau: thay khung(...) bằng doc(...), giữ nguyên slug.
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── Chương 2 — Lab 1 &amp; linh kiện thụ động (buổi 10–15) ──────────────────── */
const k21 = khung('eei101-2-1-lab-1',
  '2.1 — Lab 1 (sessions 10–12)|||2.1 — Lab 1 (buổi 10–12)',
  'Buổi 10–12, All CLOs, 5% điểm môn: bài Lab đầu tiên, ba buổi liền; dựng và đo mạch cơ bản bằng công cụ mô phỏng trên trình duyệt, ghi số đo và viết báo cáo; hình thức phụ thuộc Option 1 (tại phòng LAB) hay Option 2 (theo giảng viên).',
  { s: '10–12', clo: 'All CLOs',
    flm: 'Lab 1',
    sach: 'chapters 1–3 (electrical fundamentals, simulation, test equipment)',
    hEn: '2.1 — Lab 1 (three sessions)',
    hVi: '2.1 — Lab 1 (ba buổi liền)',
    lEn: 'the first of four Labs, each worth <strong>5%</strong> of the course (Lab is 20% over 4 parts). It follows sessions 1–9, so expect building and measuring basic circuits: Ohm\'s law, a divider, meter and scope readings, in a simulator or on the bench. <strong>Where it happens depends on your class</strong> — Option 1 says "In LAB", Option 2 says "Follow lecturer\'s proposal"; the syllabus does not say which topics are set, so ask.',
    lVi: 'bài đầu trong bốn bài Lab, mỗi bài đáng <strong>5%</strong> điểm môn (Lab là 20% chia 4 phần). Nó nằm ngay sau buổi 1–9 nên hãy trông đợi việc dựng và đo các mạch cơ bản: định luật Ohm, một bộ chia áp, số đọc trên đồng hồ và dao động ký, làm trên phần mềm mô phỏng hoặc trên bàn thí nghiệm. <strong>Làm ở đâu thì phụ thuộc lớp của bạn</strong> — Option 1 ghi "In LAB", Option 2 ghi "Follow lecturer\'s proposal"; syllabus không nói chủ đề cụ thể, nên phải hỏi.',
    dEn: 'produce a Lab report that puts predicted values next to measured ones and explains the difference — the habit built in lessons 1.3 and 1.9.',
    dVi: 'viết được một báo cáo Lab đặt giá trị dự đoán cạnh giá trị đo được và giải thích chênh lệch — đúng thói quen đã dựng ở bài 1.3 và 1.9.' });

const k22 = khung('eei101-2-2-dien-tro-va-tu-dien',
  '2.2 — Passive components: resistors and capacitance|||2.2 — Linh kiện thụ động: điện trở và điện dung',
  'Buổi 13, CLO2, Tooley 4.1–4.2: các loại điện trở và thông số (trị số, sai số, công suất, hệ số nhiệt), đọc mã màu và mã chữ số, điện dung là gì, các loại tụ và tụ có cực, ghép nối tiếp/song song điện trở và tụ.',
  { s: '13', clo: 'CLO2',
    flm: 'Chapter 4: Passive Components — 4.1 Resistors; 4.2 Capacitance',
    sach: 'chapter 4, sections 4.1–4.2',
    hEn: '2.2 — Resistors and capacitance',
    hVi: '2.2 — Điện trở và điện dung',
    lEn: 'resistor types (carbon film, metal film, wirewound) and the four specs that matter — value, <strong>tolerance</strong>, power rating, temperature coefficient; reading the colour code and the "4k7" style marking; then capacitance, what a dielectric does, the main capacitor families and which ones are <strong>polarised</strong>; and how resistors and capacitors combine in series and parallel (they combine in opposite ways).',
    lVi: 'các loại điện trở (than, màng kim loại, dây quấn) và bốn thông số đáng quan tâm — trị số, <strong>sai số (tolerance)</strong>, công suất, hệ số nhiệt; cách đọc mã màu và cách ghi kiểu "4k7"; rồi điện dung, chất điện môi làm gì, các họ tụ chính và tụ nào <strong>có cực</strong>; và cách ghép điện trở với tụ theo nối tiếp/song song (hai loại ghép theo cách NGƯỢC nhau).',
    dEn: 'pick a real part from a calculated value — not just "200 ohm" but "220 ohm, 1%, 0.25 W" — and predict the value of any series/parallel combination.',
    dVi: 'chọn được một linh kiện thật từ một trị số đã tính — không chỉ "200 ohm" mà là "220 ohm, 1%, 0,25 W" — và tính trước được trị số của mọi cách ghép nối tiếp/song song.' });

const k23 = khung('eei101-2-3-cuon-cam',
  '2.3 — Passive components: inductors|||2.3 — Linh kiện thụ động: cuộn cảm',
  'Buổi 14, CLO2, Tooley 4.3: điện cảm và định luật Lenz, đơn vị henry, lõi không khí/ferrite/sắt, năng lượng trữ trong từ trường, vì sao cuộn cảm chống lại sự THAY ĐỔI của dòng, và xung điện áp ngược khi ngắt dòng.',
  { s: '14', clo: 'CLO2',
    flm: '4.3 Inductors',
    sach: 'chapter 4, section 4.3',
    hEn: '2.3 — Inductors',
    hVi: '2.3 — Cuộn cảm',
    lEn: 'inductance as the property that opposes a <em>change</em> of current, the henry, how the core material (air, ferrite, laminated iron) multiplies it, energy stored in the magnetic field, and the back-e.m.f. spike that appears when current through a coil is interrupted — the reason a relay or motor needs a protection diode.',
    lVi: 'điện cảm là tính chất chống lại sự <em>thay đổi</em> của dòng điện, đơn vị henry, vật liệu lõi (không khí, ferrite, sắt lá) làm điện cảm lớn lên bao nhiêu, năng lượng trữ trong từ trường, và xung sức điện động ngược xuất hiện khi ngắt dòng qua cuộn dây — lý do rơ-le hay động cơ cần một diode bảo vệ.',
    dEn: 'explain why a switch driving a coil sparks, and why the third passive component is the one that makes transformers (session 20) and switched-mode supplies (session 32) possible.',
    dVi: 'giải thích được vì sao một công tắc điều khiển cuộn dây lại phóng tia lửa, và vì sao linh kiện thụ động thứ ba này mới là thứ làm nên biến áp (buổi 20) và nguồn xung (buổi 32).' });

const k24 = khung('eei101-2-4-khao-sat-linh-kien-thu-dong',
  '2.4 — Practical investigation & problems on passive components|||2.4 — Thực hành khảo sát & bài tập về linh kiện thụ động',
  'Buổi 15, CLO2, Tooley 4.4: đo trị số thật và so với sai số ghi trên linh kiện, đo hằng số thời gian RC bằng dao động ký, bài tập ghép nối tiếp/song song và tính năng lượng trữ trong tụ và cuộn cảm.',
  { s: '15', clo: 'CLO2',
    flm: '4.4 Practical investigation &amp; Problems',
    sach: 'chapter 4, section 4.4',
    hEn: '2.4 — Practical investigation and problems',
    hVi: '2.4 — Thực hành khảo sát và bài tập',
    lEn: 'measuring real components and comparing them with their printed tolerance, observing an R–C time constant on a scope (the calculation you already did in lesson 1.5), and a problem set on series/parallel combinations plus the energy stored in a capacitor and in an inductor.',
    lVi: 'đo linh kiện thật rồi so với sai số in trên thân nó, quan sát hằng số thời gian R–C trên dao động ký (chính phép tính bạn đã làm ở bài 1.5), và một bộ bài tập về ghép nối tiếp/song song cộng với năng lượng trữ trong tụ điện và trong cuộn cảm.',
    dEn: 'state a measured component value with its uncertainty, and stop being surprised when a 100 uF capacitor measures 84 uF.',
    dVi: 'nêu được trị số linh kiện đo được kèm độ bất định, và không còn bất ngờ khi một con tụ 100 uF đo ra 84 uF.' });

const c2q = quiz('eei101-quiz-2', 'Quiz 2 — Passive components (sessions 10–15)|||Quiz 2 — Linh kiện thụ động (buổi 10–15)', [
  { id: 'q1', question: 'Two 1 kohm resistors in SERIES give what total resistance?|||Hai điện trở 1 kohm mắc NỐI TIẾP cho tổng điện trở bằng bao nhiêu?', options: ['500 ohm|||500 ohm', '1 kohm|||1 kohm', '2 kohm|||2 kohm', '1 Mohm|||1 Mohm'], correctIndex: 2, points: 1, explanation: 'In series, resistances add: 1000 + 1000 = 2000 ohm. In parallel the same pair would give 500 ohm.|||Nối tiếp thì điện trở cộng lại: 1000 + 1000 = 2000 ohm. Cũng cặp đó mắc song song thì ra 500 ohm.' },
  { id: 'q2', question: 'Capacitors in PARALLEL combine how?|||Tụ điện mắc SONG SONG ghép theo cách nào?', options: ['Capacitances add|||Điện dung cộng lại', 'Reciprocals add|||Nghịch đảo cộng lại', 'They cancel|||Chúng triệt tiêu nhau', 'The smallest wins|||Con nhỏ nhất quyết định'], correctIndex: 0, points: 1, explanation: 'Capacitors are the opposite of resistors: in parallel they ADD (more plate area), in series the reciprocals add. This reversal is a favourite exam trap.|||Tụ điện ngược với điện trở: mắc song song thì CỘNG (tăng diện tích bản cực), mắc nối tiếp thì nghịch đảo cộng lại. Sự đảo ngược này là một bẫy thi được ưa dùng.' },
  { id: 'q3', question: 'A resistor is marked "4k7". What is its value?|||Một điện trở ghi "4k7". Trị số của nó là bao nhiêu?', options: ['4.7 ohm|||4,7 ohm', '47 ohm|||47 ohm', '4.7 kohm|||4,7 kohm', '47 kohm|||47 kohm'], correctIndex: 2, points: 1, explanation: 'The letter sits where the decimal point goes: 4k7 = 4.7 kohm. Likewise R47 = 0.47 ohm and 1M2 = 1.2 Mohm.|||Chữ cái nằm đúng chỗ của dấu thập phân: 4k7 = 4,7 kohm. Tương tự R47 = 0,47 ohm và 1M2 = 1,2 Mohm.' },
  { id: 'q4', question: 'What does an inductor oppose?|||Cuộn cảm chống lại cái gì?', options: ['Any current at all|||Mọi dòng điện nói chung', 'A CHANGE of current|||Sự THAY ĐỔI của dòng điện', 'A change of voltage|||Sự thay đổi của điện áp', 'Direct current only|||Chỉ dòng một chiều'], correctIndex: 1, points: 1, explanation: 'An inductor opposes a change of current — that is why interrupting its current produces a back-e.m.f. spike, and why coil-driving circuits need a protection diode. A capacitor is the dual: it opposes a change of voltage.|||Cuộn cảm chống lại sự thay đổi của dòng — vì thế ngắt dòng qua nó sinh ra xung sức điện động ngược, và vì thế mạch lái cuộn dây cần diode bảo vệ. Tụ điện là cặp đối ngẫu: nó chống lại sự thay đổi của điện áp.' },
  { id: 'q5', question: 'How many Labs are there in EEI101 and what is each one worth?|||EEI101 có bao nhiêu bài Lab và mỗi bài đáng bao nhiêu phần trăm?', options: ['4 labs, 5% each|||4 bài, mỗi bài 5%', '4 labs, 10% each|||4 bài, mỗi bài 10%', '5 labs, 4% each|||5 bài, mỗi bài 4%', '2 labs, 10% each|||2 bài, mỗi bài 10%'], correctIndex: 0, points: 1, explanation: 'Lab: 4 parts, 20% in total, so 5% each — sessions 10-12, 22-24, 40-42 and 55-57.|||Lab: 4 phần, tổng 20%, tức 5% mỗi bài — buổi 10-12, 22-24, 40-42 và 55-57.' },
  { id: 'q6', question: 'Which capacitor type must be fitted the right way round?|||Loại tụ nào bắt buộc phải lắp đúng chiều?', options: ['Ceramic|||Tụ gốm (ceramic)', 'Polyester film|||Tụ màng polyester', 'Electrolytic (polarised)|||Tụ hoá (electrolytic, có cực)', 'Mica|||Tụ mica'], correctIndex: 2, points: 1, explanation: 'Electrolytic capacitors are polarised: the schematic marks one plate + or draws it curved, and fitting one backwards can make it vent or burst. Ceramic, film and mica types have no polarity.|||Tụ hoá là tụ có cực: sơ đồ đánh dấu một bản cực bằng dấu + hoặc vẽ bản cong, và lắp ngược có thể làm tụ xì hoặc nổ. Tụ gốm, tụ màng và tụ mica không có cực.' },
], 420);

/* ── Chương 3 — Mạch DC &amp; mạch AC (buổi 16–21) ───────────────────────────── */
const k31 = khung('eei101-2-1-dc-analysis',
  '3.1 — D.C. circuits: the theorems and laws|||3.1 — Mạch một chiều: các định lý và định luật',
  'Buổi 16, CLO3, Tooley 5.1: định luật Kirchhoff về dòng (KCL) và về áp (KVL), bộ chia áp và chia dòng, định lý Thevenin và Norton, nguyên lý xếp chồng, định lý truyền công suất cực đại.',
  { s: '16', clo: 'CLO3',
    flm: 'Chapter 5: D.C. circuits — 5.1 The Theorems and Laws',
    sach: 'chapter 5, section 5.1',
    hEn: '3.1 — The theorems and laws of D.C. circuits',
    hVi: '3.1 — Các định lý và định luật của mạch một chiều',
    lEn: '<strong>Kirchhoff\'s current law</strong> (what flows into a node flows out of it) and <strong>voltage law</strong> (the drops around a loop add up to the supply — the check you already used in lesson 1.3), the voltage and current divider formulas, <strong>Thevenin</strong> and <strong>Norton</strong> equivalents, superposition, and maximum power transfer.',
    lVi: '<strong>định luật dòng Kirchhoff</strong> (dòng vào một nút bằng dòng ra khỏi nút đó) và <strong>định luật áp Kirchhoff</strong> (các phần sụt áp quanh một vòng cộng lại bằng nguồn — chính phép kiểm bạn đã dùng ở bài 1.3), công thức chia áp và chia dòng, tương đương <strong>Thevenin</strong> và <strong>Norton</strong>, nguyên lý xếp chồng, và định lý truyền công suất cực đại.',
    dEn: 'analyse a circuit with more than one loop instead of guessing, and reduce any resistive network to one source and one resistance.',
    dVi: 'phân tích được một mạch có nhiều hơn một vòng thay vì đoán, và rút gọn được mọi mạng điện trở về một nguồn và một điện trở.' });

const k32 = khung('eei101-3-2-mach-lrc',
  '3.2 — L–R–C circuits|||3.2 — Mạch L–R–C',
  'Buổi 17, CLO3, Tooley 5.2: đáp ứng quá độ của mạch C–R và L–R, hằng số thời gian RC và L/R, nạp và xả tụ, dòng lên trong cuộn cảm, mạch L–C–R và dao động tắt dần.',
  { s: '17', clo: 'CLO3',
    flm: '5.2 L-R-C circuits',
    sach: 'chapter 5, section 5.2',
    hEn: '3.2 — L–R–C circuits and transient response',
    hVi: '3.2 — Mạch L–R–C và đáp ứng quá độ',
    lEn: 'what happens in the first instants after a switch closes: the <strong>C–R time constant</strong> T = R x C (calculated in lesson 1.5), the <strong>L–R time constant</strong> T = L / R, exponential charge and discharge curves, the 63.2% and 5T rules, and what an L–C–R circuit does when all three are present.',
    lVi: 'điều gì xảy ra trong những khoảnh khắc đầu sau khi đóng công tắc: <strong>hằng số thời gian C–R</strong> T = R x C (đã tính ở bài 1.5), <strong>hằng số thời gian L–R</strong> T = L / R, đường nạp và xả dạng hàm mũ, quy tắc 63,2% và 5T, và mạch L–C–R làm gì khi có đủ cả ba linh kiện.',
    dEn: 'calculate how long a circuit takes to settle, and read a transient simulation instead of only a DC operating point.',
    dVi: 'tính được một mạch mất bao lâu để ổn định, và đọc được một phép mô phỏng transient thay vì chỉ đọc điểm làm việc DC.' });

const k33 = khung('eei101-3-3-khao-sat-mach-dc',
  '3.3 — Practical investigation & problems on D.C. circuits|||3.3 — Thực hành khảo sát & bài tập mạch một chiều',
  'Buổi 18, CLO3, Tooley 5.3: kiểm KVL và KCL bằng phép đo thật, đo hằng số thời gian, bài tập nhiều vòng và bài tập Thevenin có lời giải, đối chiếu kết quả tính với mô phỏng.',
  { s: '18', clo: 'CLO3',
    flm: '5.3 Practical investigation &amp; Problems',
    sach: 'chapter 5, section 5.3',
    hEn: '3.3 — Practical investigation and problems',
    hVi: '3.3 — Thực hành khảo sát và bài tập',
    lEn: 'verifying KVL and KCL by measurement (do the drops really add up to the supply?), measuring a time constant, and a problem set on multi-loop networks and Thevenin reduction — each one worth re-checking in the simulator, as in lesson 1.4.',
    lVi: 'kiểm chứng KVL và KCL bằng phép đo (các phần sụt áp có thật sự cộng lại bằng nguồn không?), đo một hằng số thời gian, và một bộ bài tập về mạng nhiều vòng cùng phép rút gọn Thevenin — mỗi bài đều đáng kiểm lại trong phần mềm mô phỏng, đúng cách làm ở bài 1.4.',
    dEn: 'trust a calculation because a measurement and a simulation both agree with it — three independent routes to one number.',
    dVi: 'tin vào một phép tính vì cả phép đo lẫn phép mô phỏng đều đồng ý với nó — ba con đường độc lập tới cùng một con số.' });

const k34 = khung('eei101-3-1-ac-power',
  '3.4 — Alternating voltage and current; reactance|||3.4 — Điện áp và dòng xoay chiều; điện kháng',
  'Buổi 19, CLO3, Tooley 6.1–6.2: sóng sin và các đại lượng đỉnh/đỉnh-đỉnh/trung bình/hiệu dụng (đã dùng ở bài 1.8), chu kỳ và tần số, vì sao dùng AC, điện kháng của tụ Xc = 1/(2 pi f C) và của cuộn cảm Xl = 2 pi f L, trở kháng và lệch pha.',
  { s: '19', clo: 'CLO3',
    flm: 'Chapter 6: Alternating voltage and current — 6.1 Alternating versus direct current; 6.2 Reactance',
    sach: 'chapter 6, sections 6.1–6.2',
    hEn: '3.4 — A.C. versus D.C., and reactance',
    hVi: '3.4 — Xoay chiều so với một chiều, và điện kháng',
    lEn: 'the sine wave and its four different "sizes" — peak, peak-to-peak, average, <strong>RMS</strong> (the Vrms = Vpk / sqrt(2) you used on the scope in lesson 1.8) — period and frequency, why power is distributed as A.C. at all, and then <strong>reactance</strong>: Xc = 1 / (2 pi f C) falls as frequency rises while Xl = 2 pi f L rises, plus impedance and phase shift.',
    lVi: 'sóng sin và bốn "độ lớn" khác nhau của nó — đỉnh, đỉnh-đỉnh, trung bình, <strong>hiệu dụng (RMS)</strong> (chính công thức Vrms = Vpk / sqrt(2) bạn đã dùng trên dao động ký ở bài 1.8) — chu kỳ và tần số, vì sao điện lại được truyền tải dạng xoay chiều, rồi tới <strong>điện kháng</strong>: Xc = 1 / (2 pi f C) giảm khi tần số tăng còn Xl = 2 pi f L thì tăng, cộng thêm trở kháng và độ lệch pha.',
    dEn: 'say which of peak, peak-to-peak and RMS an exam question is asking for, and predict whether a capacitor or an inductor will pass a given frequency.',
    dVi: 'nói được đề thi đang hỏi giá trị đỉnh, đỉnh-đỉnh hay hiệu dụng, và đoán trước được tụ hay cuộn cảm sẽ cho một tần số cho trước đi qua.' });

const k35 = khung('eei101-3-5-he-so-cong-suat-va-bien-ap',
  '3.5 — Power factor, resonance and transformers|||3.5 — Hệ số công suất, cộng hưởng và biến áp',
  'Buổi 20, CLO3, Tooley 6.3–6.4: công suất thực/phản kháng/biểu kiến và hệ số công suất cos phi, cộng hưởng nối tiếp và song song với f0 = 1/(2 pi sqrt(LC)), hệ số Q, biến áp và tỉ số vòng dây, tổn thất trong biến áp.',
  { s: '20', clo: 'CLO3',
    flm: '6.3 Power factor and Resonance; 6.4 Transformers',
    sach: 'chapter 6, sections 6.3–6.4',
    hEn: '3.5 — Power factor, resonance and transformers',
    hVi: '3.5 — Hệ số công suất, cộng hưởng và biến áp',
    lEn: 'real power (watts), reactive power (VAR) and apparent power (VA), with <strong>power factor = P / S = cos phi</strong>; series and parallel <strong>resonance</strong> at f0 = 1 / (2 pi sqrt(L x C)) and the Q factor that says how sharp the peak is; then the <strong>transformer</strong>, its turns ratio Vs/Vp = Ns/Np, and where its losses go.',
    lVi: 'công suất thực (watt), công suất phản kháng (VAR) và công suất biểu kiến (VA), với <strong>hệ số công suất = P / S = cos phi</strong>; <strong>cộng hưởng</strong> nối tiếp và song song tại f0 = 1 / (2 pi sqrt(L x C)) cùng hệ số Q cho biết đỉnh cộng hưởng nhọn tới đâu; rồi tới <strong>biến áp</strong>, tỉ số vòng dây Vs/Vp = Ns/Np, và tổn thất của nó đi đâu.',
    dEn: 'calculate a resonant frequency, and explain why a factory pays for VA while it only uses W.',
    dVi: 'tính được tần số cộng hưởng, và giải thích được vì sao một nhà máy phải trả tiền theo VA trong khi chỉ dùng W.' });

const k36 = khung('eei101-3-6-khao-sat-mach-ac',
  '3.6 — Practical investigation & problems on A.C. circuits|||3.6 — Thực hành khảo sát & bài tập mạch xoay chiều',
  'Buổi 21, CLO3, Tooley 6.5: đo biên độ và tần số bằng dao động ký, dựng đường đáp ứng tần số của mạch R–C, tìm điểm cộng hưởng bằng thực nghiệm, bài tập điện kháng và hệ số công suất.',
  { s: '21', clo: 'CLO3',
    flm: '6.5 Practical investigation &amp; Problems',
    sach: 'chapter 6, section 6.5',
    hEn: '3.6 — Practical investigation and problems',
    hVi: '3.6 — Thực hành khảo sát và bài tập',
    lEn: 'measuring amplitude and frequency on a scope, plotting the frequency response of an R–C network point by point and finding the −3 dB corner (the 994.7 Hz calculation from lesson 1.5), locating a resonant peak experimentally, and a problem set on reactance and power factor.',
    lVi: 'đo biên độ và tần số trên dao động ký, dựng đường đáp ứng tần số của mạch R–C từng điểm một và tìm điểm cắt −3 dB (chính phép tính 994,7 Hz ở bài 1.5), xác định đỉnh cộng hưởng bằng thực nghiệm, và một bộ bài tập về điện kháng cùng hệ số công suất.',
    dEn: 'produce a measured frequency-response curve and compare it with the one you calculated — the strongest evidence you can put in a Lab report.',
    dVi: 'tạo ra được một đường đáp ứng tần số đo thật rồi so với đường bạn đã tính — bằng chứng mạnh nhất có thể đưa vào một báo cáo Lab.' });

const c3q = quiz('eei101-quiz-3', 'Quiz 3 — D.C. and A.C. circuits (sessions 16–21)|||Quiz 3 — Mạch một chiều và xoay chiều (buổi 16–21)', [
  { id: 'q1', question: 'What does Kirchhoff\'s voltage law (KVL) state?|||Định luật điện áp Kirchhoff (KVL) phát biểu điều gì?', options: ['Current into a node equals current out|||Dòng vào một nút bằng dòng ra khỏi nút', 'The voltage drops around a closed loop add up to the applied voltage|||Các phần sụt áp quanh một vòng kín cộng lại bằng điện áp đặt vào', 'Resistances in parallel add|||Điện trở mắc song song thì cộng lại', 'Power equals V times I|||Công suất bằng V nhân I'], correctIndex: 1, points: 1, explanation: 'KVL is energy conservation around a loop — the check used in lesson 1.3 when 2.81 V + 6.19 V had to make 9.00 V. "Current in equals current out" is KCL.|||KVL là bảo toàn năng lượng quanh một vòng — chính phép kiểm ở bài 1.3 khi 2,81 V + 6,19 V phải bằng 9,00 V. "Dòng vào bằng dòng ra" là KCL.' },
  { id: 'q2', question: 'A sine wave has a peak of 12 V. What is its RMS value?|||Một sóng sin có đỉnh 12 V. Giá trị hiệu dụng của nó là bao nhiêu?', options: ['12 V|||12 V', '6 V|||6 V', '8.49 V|||8,49 V', '16.97 V|||16,97 V'], correctIndex: 2, points: 1, explanation: 'Vrms = Vpk / sqrt(2) = 12 / 1.41421 = 8.49 V. Halving gives 6 V, which is a different quantity (and wrong here); multiplying by sqrt(2) goes the wrong way.|||Vrms = Vpk / sqrt(2) = 12 / 1,41421 = 8,49 V. Chia đôi ra 6 V là một đại lượng khác (và sai ở đây); nhân với sqrt(2) là đi ngược chiều.' },
  { id: 'q3', question: 'As frequency RISES, the reactance of a capacitor…|||Khi tần số TĂNG, điện kháng của tụ điện sẽ…',
    options: ['rises|||tăng', 'falls|||giảm', 'stays the same|||không đổi', 'becomes negative|||trở thành số âm'], correctIndex: 1, points: 1, explanation: 'Xc = 1 / (2 pi f C), so f in the denominator means Xc falls as f rises — a capacitor passes high frequencies more easily. An inductor is the opposite: Xl = 2 pi f L rises with f.|||Xc = 1 / (2 pi f C), f nằm ở mẫu nên f tăng thì Xc giảm — tụ cho tần số cao đi qua dễ hơn. Cuộn cảm thì ngược lại: Xl = 2 pi f L tăng theo f.' },
  { id: 'q4', question: 'Power factor is defined as…|||Hệ số công suất được định nghĩa là…', options: ['S / P|||S / P', 'P / S = cos phi|||P / S = cos phi', 'Q / P|||Q / P', 'Vrms x Irms|||Vrms x Irms'], correctIndex: 1, points: 1, explanation: 'Power factor = real power / apparent power = P/S = cos phi. Vrms x Irms is the apparent power S itself.|||Hệ số công suất = công suất thực / công suất biểu kiến = P/S = cos phi. Vrms x Irms chính là công suất biểu kiến S.' },
  { id: 'q5', question: 'The resonant frequency of a series L–C circuit is given by…|||Tần số cộng hưởng của mạch L–C nối tiếp được cho bởi…', options: ['f0 = 2 pi sqrt(LC)|||f0 = 2 pi sqrt(LC)', 'f0 = 1 / (2 pi sqrt(LC))|||f0 = 1 / (2 pi sqrt(LC))', 'f0 = 1 / (2 pi L C)|||f0 = 1 / (2 pi L C)', 'f0 = L / C|||f0 = L / C'], correctIndex: 1, points: 1, explanation: 'f0 = 1 / (2 pi sqrt(L x C)) — at that frequency Xl equals Xc and they cancel. Note the square root: leaving it out is the most common error.|||f0 = 1 / (2 pi sqrt(L x C)) — tại tần số đó Xl bằng Xc và chúng triệt tiêu nhau. Chú ý dấu căn: bỏ quên nó là lỗi phổ biến nhất.' },
  { id: 'q6', question: 'A transformer has 200 primary turns and 50 secondary turns, fed from 240 V. What is the secondary voltage?|||Một biến áp có 200 vòng sơ cấp và 50 vòng thứ cấp, cấp vào 240 V. Điện áp thứ cấp bằng bao nhiêu?', options: ['960 V|||960 V', '120 V|||120 V', '60 V|||60 V', '48 V|||48 V'], correctIndex: 2, points: 1, explanation: 'Vs/Vp = Ns/Np, so Vs = 240 x 50/200 = 60 V — a step-down transformer. Getting 960 V means the ratio was used upside down.|||Vs/Vp = Ns/Np, nên Vs = 240 x 50/200 = 60 V — biến áp hạ áp. Ra 960 V nghĩa là đã dùng tỉ số lộn ngược.' },
], 420);

/* ── Chương 4 — Lab 2 (buổi 22–24) ───────────────────────────────────────── */
const k41 = khung('eei101-4-1-lab-2',
  '4.1 — Lab 2 (sessions 22–24)|||4.1 — Lab 2 (buổi 22–24)',
  'Buổi 22–24, All CLOs, 5% điểm môn: bài Lab thứ hai, ba buổi liền, ngay sau chương linh kiện thụ động và mạch DC/AC; dựng-đo-đối chiếu mạch R, L, C và mạch chia áp; hình thức phụ thuộc Option 1 hay Option 2.',
  { s: '22–24', clo: 'All CLOs',
    flm: 'Lab 2',
    sach: 'chapters 4–6 (passive components, D.C. circuits, A.C. circuits)',
    hEn: '4.1 — Lab 2 (three sessions)',
    hVi: '4.1 — Lab 2 (ba buổi liền)',
    lEn: 'the second Lab, worth <strong>5%</strong>, placed straight after passive components and the D.C./A.C. chapters — so expect R, L and C networks, dividers, time constants and frequency response, built and measured. As with Lab 1, the format depends on whether your class follows Option 1 ("In LAB") or Option 2 ("Follow lecturer\'s proposal").',
    lVi: 'bài Lab thứ hai, đáng <strong>5%</strong>, được đặt ngay sau chương linh kiện thụ động và hai chương mạch DC/AC — nên hãy trông đợi các mạng R, L, C, bộ chia áp, hằng số thời gian và đáp ứng tần số, dựng lên rồi đo. Cũng như Lab 1, hình thức phụ thuộc lớp của bạn theo Option 1 ("In LAB") hay Option 2 ("Follow lecturer\'s proposal").',
    dEn: 'run a full predict-measure-explain cycle on a reactive circuit, not just a resistive one.',
    dVi: 'chạy trọn một vòng đoán-đo-giải thích trên một mạch có tụ và cuộn cảm, không chỉ trên mạch thuần điện trở.' });

/* ── Chương 5 — Bán dẫn (buổi 25–26) ─────────────────────────────────────── */
const k51 = khung('eei101-4-1-semiconductors',
  '5.1 — Semiconductor junctions, diodes and bipolar transistors|||5.1 — Tiếp giáp bán dẫn, diode và transistor lưỡng cực',
  'Buổi 25, CLO2 + CLO4, Tooley 7.1–7.2: pha tạp loại N và loại P, tiếp giáp P-N và diode (sụt thuận khoảng 0,7 V với silic), diode Zener, BJT với Ic = beta x Ib và ba vùng làm việc cut-off / active / saturation.',
  { s: '25', clo: 'CLO2, CLO4',
    flm: 'Chapter 7: Semiconductors — 7.1 Semiconductor junction and diodes; 7.2 Bipolar junction transistors',
    sach: 'chapter 7, sections 7.1–7.2',
    hEn: '5.1 — Junctions, diodes and bipolar transistors',
    hVi: '5.1 — Tiếp giáp, diode và transistor lưỡng cực',
    lEn: 'how doping turns silicon into N-type and P-type material, what happens where they meet (the <strong>P–N junction</strong>), the diode that results and its forward drop of about <strong>0.7 V</strong> for silicon, reverse breakdown and the Zener diode; then the <strong>bipolar transistor</strong>: Ic = beta x Ib, and the three regions — cut-off (off), active (amplifying), saturation (fully on).',
    lVi: 'pha tạp biến silic thành vật liệu loại N và loại P thế nào, điều gì xảy ra ở chỗ chúng gặp nhau (<strong>tiếp giáp P–N</strong>), con diode sinh ra từ đó và sụt áp thuận khoảng <strong>0,7 V</strong> với silic, đánh xuyên ngược và diode Zener; rồi tới <strong>transistor lưỡng cực</strong>: Ic = beta x Ib, và ba vùng làm việc — cut-off (tắt), active (khuếch đại), saturation (dẫn hoàn toàn).',
    dEn: 'subtract 0.7 V for every silicon diode in a path without being told to, and say whether a given transistor circuit is switching or amplifying.',
    dVi: 'tự trừ 0,7 V cho mỗi diode silic trên đường đi mà không cần ai nhắc, và nói được một mạch transistor cho trước đang làm khoá hay đang khuếch đại.' });

const k52 = khung('eei101-5-2-fet-va-ic',
  '5.2 — Field effect transistors, integrated circuits & investigation|||5.2 — Transistor hiệu ứng trường, mạch tích hợp & khảo sát',
  'Buổi 26, CLO2 + CLO4, Tooley 7.3–7.5: JFET và MOSFET điều khiển bằng điện áp cổng Vgs, so sánh BJT với FET, quy trình chế tạo IC và các mức tích hợp (SSI tới VLSI), thực hành đo đặc tuyến diode và transistor.',
  { s: '26', clo: 'CLO2, CLO4',
    flm: '7.3 Field effect transistors; 7.4 Integrated circuits; 7.5 Practical investigation &amp; Problems',
    sach: 'chapter 7, sections 7.3–7.5',
    hEn: '5.2 — FETs, integrated circuits and practical investigation',
    hVi: '5.2 — FET, mạch tích hợp và thực hành khảo sát',
    lEn: 'the <strong>field effect transistor</strong> — JFET and MOSFET — controlled by gate <em>voltage</em> rather than base current, and why that makes it efficient and easy to drive; a BJT-versus-FET comparison; how an <strong>integrated circuit</strong> is actually manufactured (the CLO4 topic: "technological principles related to semiconductor manufacturing") and the SSI-to-VLSI scale; then measuring a real diode and transistor characteristic.',
    lVi: '<strong>transistor hiệu ứng trường</strong> — JFET và MOSFET — điều khiển bằng <em>điện áp</em> cổng thay vì dòng base, và vì sao điều đó làm nó hiệu quả và dễ lái; bảng so sánh BJT với FET; một <strong>mạch tích hợp</strong> thực sự được chế tạo thế nào (đúng chủ đề của CLO4: "nguyên lý công nghệ liên quan tới chế tạo bán dẫn") và các mức từ SSI tới VLSI; rồi đo đặc tuyến thật của một con diode và một transistor.',
    dEn: 'choose between a BJT and a MOSFET for a switching job, and answer the CLO4 exam questions about how chips are made.',
    dVi: 'chọn được giữa BJT và MOSFET cho một việc đóng cắt, và trả lời được các câu hỏi thi thuộc CLO4 về cách chế tạo chip.' });

const c4q = quiz('eei101-quiz-4', 'Quiz 4 — Semiconductors (sessions 25–26)|||Quiz 4 — Bán dẫn (buổi 25–26)', [
  { id: 'q1', question: 'What is the typical forward voltage drop of a silicon diode?|||Sụt áp thuận điển hình của một diode silic là bao nhiêu?', options: ['0 V|||0 V', 'About 0.7 V|||Khoảng 0,7 V', 'About 5 V|||Khoảng 5 V', 'It equals the supply|||Bằng điện áp nguồn'], correctIndex: 1, points: 1, explanation: 'About 0.7 V for silicon (around 0.3 V for germanium, and 1.8-3.3 V for an LED depending on colour). Every diode in a current path removes its drop from the available voltage.|||Khoảng 0,7 V với silic (khoảng 0,3 V với germani, và 1,8–3,3 V với LED tuỳ màu). Mỗi con diode trên đường đi của dòng đều lấy đi phần sụt áp của nó từ điện áp còn dùng được.' },
  { id: 'q2', question: 'A BJT is controlled by ___ and a MOSFET by ___.|||BJT được điều khiển bằng ___ còn MOSFET bằng ___.', options: ['gate voltage / base current|||điện áp cổng / dòng base', 'base current / gate voltage (Vgs)|||dòng base / điện áp cổng (Vgs)', 'temperature / light|||nhiệt độ / ánh sáng', 'frequency / phase|||tần số / pha'], correctIndex: 1, points: 1, explanation: 'BJT: a small base CURRENT controls the collector current (Ic = beta x Ib). MOSFET: the gate VOLTAGE controls the channel, drawing almost no gate current — which is why it is easy to drive from a logic output.|||BJT: một DÒNG base nhỏ điều khiển dòng collector (Ic = beta x Ib). MOSFET: ĐIỆN ÁP cổng điều khiển kênh dẫn, gần như không rút dòng cổng — vì thế nó dễ lái trực tiếp từ một đầu ra logic.' },
  { id: 'q3', question: 'A transistor used as a fully-on switch is operating in which region?|||Một transistor dùng làm khoá đang dẫn hoàn toàn thì làm việc ở vùng nào?', options: ['Cut-off|||Cut-off (ngắt)', 'Active|||Active (khuếch đại)', 'Saturation|||Saturation (bão hoà)', 'Breakdown|||Breakdown (đánh xuyên)'], correctIndex: 2, points: 1, explanation: 'Saturation = fully conducting, like a closed switch. Cut-off is fully off; the active region in between is where amplification happens (chapter 9).|||Saturation = dẫn hoàn toàn, như một công tắc đóng. Cut-off là tắt hẳn; vùng active ở giữa là nơi diễn ra sự khuếch đại (chương 9).' },
  { id: 'q4', question: 'A transistor has beta = 100 and a base current of 50 uA. What is the collector current in the active region?|||Một transistor có beta = 100 và dòng base 50 uA. Dòng collector trong vùng active bằng bao nhiêu?', options: ['0.5 mA|||0,5 mA', '5 mA|||5 mA', '50 mA|||50 mA', '500 mA|||500 mA'], correctIndex: 1, points: 1, explanation: 'Ic = beta x Ib = 100 x 50 uA = 5000 uA = 5 mA. Watch the prefix: 50 uA is 0.00005 A.|||Ic = beta x Ib = 100 x 50 uA = 5000 uA = 5 mA. Coi kỹ tiền tố: 50 uA là 0,00005 A.' },
  { id: 'q5', question: 'What is a Zener diode normally used for?|||Diode Zener thường dùng để làm gì?', options: ['Rectifying A.C. to D.C.|||Chỉnh lưu AC thành DC', 'Conducting in reverse at a fixed voltage, as a reference or clamp|||Dẫn theo chiều ngược ở một điện áp cố định, làm điện áp tham chiếu hoặc ghim áp', 'Amplifying a small signal|||Khuếch đại một tín hiệu nhỏ', 'Storing charge|||Trữ điện tích'], correctIndex: 1, points: 1, explanation: 'A Zener is designed to break down at a specified reverse voltage and hold it, which makes it a simple voltage reference — the basis of the regulators in session 28.|||Zener được thiết kế để đánh xuyên ở một điện áp ngược định trước và giữ nguyên điện áp đó, nên nó là một nguồn tham chiếu đơn giản — nền tảng của các mạch ổn áp ở buổi 28.' },
  { id: 'q6', question: 'Which CLO does the "integrated circuit manufacturing" topic of session 26 belong to?|||Chủ đề "chế tạo mạch tích hợp" của buổi 26 thuộc CLO nào?', options: ['CLO3 — analyse circuits and calculate parameters|||CLO3 — phân tích mạch và tính tham số', 'CLO4 — technological principles of semiconductor manufacturing|||CLO4 — nguyên lý công nghệ chế tạo bán dẫn', 'CLO6 — use simulation software|||CLO6 — dùng phần mềm mô phỏng', 'CLO8 — soft skills|||CLO8 — kỹ năng mềm'], correctIndex: 1, points: 1, explanation: 'CLO4 is the only outcome about manufacturing, and FLM tags sessions 25 and 26 with "CLO2, CLO4" — they are the ONLY two sessions that carry CLO4.|||CLO4 là chuẩn đầu ra duy nhất nói về chế tạo, và FLM gắn buổi 25 với 26 là "CLO2, CLO4" — đó là HAI buổi duy nhất mang CLO4.' },
], 420);

/* ── Chương 6 — Nguồn &amp; bộ nguồn + Assignment 1 (buổi 27–33) ─────────────── */
const k61 = khung('eei101-6-1-chinh-luu-va-loc',
  '6.1 — Rectifiers, reservoir and smoothing circuits|||6.1 — Mạch chỉnh lưu, tụ trữ và mạch làm phẳng',
  'Buổi 27, CLO2 + CLO5, Tooley 8.1: chỉnh lưu nửa chu kỳ và toàn chu kỳ, cầu diode bốn con, tụ trữ (reservoir) và gợn (ripple), tần số gợn gấp đôi khi chỉnh lưu toàn chu kỳ, mạch lọc L–C.',
  { s: '27', clo: 'CLO2, CLO5',
    flm: 'Chapter 8: Power sources and supplies — 8.1 Rectifiers, Reservoir, and Smoothing Circuits',
    sach: 'chapter 8, section 8.1',
    hEn: '6.1 — Rectifiers, reservoir and smoothing',
    hVi: '6.1 — Chỉnh lưu, tụ trữ và làm phẳng',
    lEn: 'turning A.C. into D.C.: half-wave and full-wave rectification, the four-diode <strong>bridge</strong>, the reservoir capacitor and the <strong>ripple</strong> left on top of the output, why full-wave rectification doubles the ripple frequency (and so makes smoothing easier), and L–C smoothing filters.',
    lVi: 'biến AC thành DC: chỉnh lưu nửa chu kỳ và toàn chu kỳ, <strong>cầu</strong> bốn diode, tụ trữ (reservoir) và phần <strong>gợn (ripple)</strong> còn sót trên đầu ra, vì sao chỉnh lưu toàn chu kỳ làm tần số gợn tăng gấp đôi (và nhờ đó dễ làm phẳng hơn), và mạch lọc L–C.',
    dEn: 'draw the output waveform of a rectifier before and after the smoothing capacitor, and measure the ripple with the AC-coupling trick from lesson 1.8.',
    dVi: 'vẽ được dạng sóng đầu ra của mạch chỉnh lưu trước và sau tụ làm phẳng, và đo được phần gợn bằng mẹo ghép AC ở bài 1.8.' });

const k62 = khung('eei101-6-2-on-ap',
  '6.2 — Voltage regulators|||6.2 — Mạch ổn áp',
  'Buổi 28, CLO2 + CLO5, Tooley 8.2: ổn áp bằng Zener và điện trở hạn dòng, ổn áp nối tiếp dùng transistor, IC ổn áp ba chân họ 78xx/79xx, tản nhiệt và giới hạn công suất.',
  { s: '28', clo: 'CLO2, CLO5',
    flm: '8.2 Voltage Regulators',
    sach: 'chapter 8, section 8.2',
    hEn: '6.2 — Voltage regulators',
    hVi: '6.2 — Mạch ổn áp',
    lEn: 'holding the output steady when the load or the input changes: the simple <strong>Zener plus series resistor</strong> shunt regulator, the transistor series regulator that follows it, three-terminal IC regulators of the <strong>78xx / 79xx</strong> family, and the heat a linear regulator must get rid of.',
    lVi: 'giữ đầu ra ổn định khi tải hoặc đầu vào thay đổi: mạch ổn áp song song đơn giản dùng <strong>Zener cộng điện trở nối tiếp</strong>, mạch ổn áp nối tiếp dùng transistor phát triển từ đó, các IC ổn áp ba chân họ <strong>78xx / 79xx</strong>, và lượng nhiệt mà một mạch ổn áp tuyến tính phải thải đi.',
    dEn: 'design a 5 V rail from a 12 V source and calculate how much power the regulator will turn into heat.',
    dVi: 'thiết kế được một đường 5 V từ nguồn 12 V và tính được mạch ổn áp sẽ biến bao nhiêu công suất thành nhiệt.' });

const k63 = khung('eei101-6-3-tro-khang-ra-va-on-dinh-ap',
  '6.3 — Output resistance and voltage regulation|||6.3 — Điện trở ra và độ ổn định điện áp',
  'Buổi 29, CLO2 + CLO5, Tooley 8.3: điện trở ra của bộ nguồn, vì sao điện áp sụt khi có tải, tỉ số ổn định theo đường vào (line regulation) và theo tải (load regulation), cách đo cả hai bằng phép đo thật.',
  { s: '29', clo: 'CLO2, CLO5',
    flm: '8.3 Output resistance and voltage regulation',
    sach: 'chapter 8, section 8.3',
    hEn: '6.3 — Output resistance and regulation',
    hVi: '6.3 — Điện trở ra và độ ổn định',
    lEn: 'why a real supply sags when you load it: its <strong>output resistance</strong>, measured as the change in output voltage divided by the change in load current; <strong>line regulation</strong> (output versus input change) and <strong>load regulation</strong> (output versus load change), and how to measure both on the bench.',
    lVi: 'vì sao một bộ nguồn thật bị sụt áp khi mắc tải: <strong>điện trở ra</strong> của nó, đo bằng độ thay đổi điện áp ra chia cho độ thay đổi dòng tải; <strong>độ ổn định theo đường vào (line regulation)</strong> và <strong>theo tải (load regulation)</strong>, và cách đo cả hai trên bàn thí nghiệm.',
    dEn: 'quote a power supply\'s quality as a number instead of "it seems fine", and recognise the ideal-source assumption you met in lesson 1.4.',
    dVi: 'nêu được chất lượng một bộ nguồn bằng con số thay vì "trông thì ổn", và nhận ra lại giả định nguồn lý tưởng bạn đã gặp ở bài 1.4.' });

const k64 = khung('eei101-6-4-assignment-1',
  '6.4 — Assignment 1 (session 30)|||6.4 — Assignment 1 (buổi 30)',
  'Buổi 30, All CLOs, 10% điểm môn: Assignment 1 phủ CLO1-7 với 1-2 câu cho mỗi CLOx (tổng 2-3 câu); Option 1 làm ở nhà, Option 2 theo phương án giảng viên; phạm vi thực tế là buổi 1-29.',
  { s: '30', clo: 'All CLOs',
    flm: 'Assignment 1',
    sach: 'chapters 1–8 (everything up to session 29)',
    hEn: '6.4 — Assignment 1',
    hVi: '6.4 — Assignment 1',
    lEn: 'the first of two Assignments, together worth 20%, so this one is <strong>10%</strong> of the course. FLM specifies its CLO coverage as <strong>AS1: CLO1-7</strong> with "1-2 for each CLOx", total 2–3 questions. Duration: <em>Option 1: At home</em>; Option 2 follows the lecturer. By position it covers sessions 1–29 — fundamentals, simulation, measurement, passive components, D.C./A.C. circuits, semiconductors and power supplies.',
    lVi: 'bài đầu trong hai Assignment, hai bài cộng lại 20%, nên bài này là <strong>10%</strong> điểm môn. FLM ghi rõ phạm vi CLO của nó là <strong>AS1: CLO1-7</strong> với "1-2 câu cho mỗi CLOx", tổng 2–3 câu. Thời lượng: <em>Option 1: At home</em> (làm ở nhà); Option 2 thì theo giảng viên. Theo vị trí trong lịch, nó phủ buổi 1–29 — nền tảng, mô phỏng, đo lường, linh kiện thụ động, mạch DC/AC, bán dẫn và bộ nguồn.',
    dEn: 'note the one thing FLM does publish: AS1 covers CLO1–7, which means CLO8 is not in it — every other mark says "All CLOs".',
    dVi: 'để ý một điều FLM có công bố: AS1 phủ CLO1–7, tức là KHÔNG có CLO8 trong đó — trong khi mọi đầu điểm khác đều ghi "All CLOs".' });

const k65 = khung('eei101-6-5-mach-nguon-thuc-te',
  '6.5 — Practical power supply circuits|||6.5 — Các mạch nguồn thực tế',
  'Buổi 31, CLO2 + CLO5, Tooley 8.4: ghép đủ một bộ nguồn hoàn chỉnh (biến áp, cầu chỉnh lưu, tụ trữ, ổn áp), nguồn đối xứng dương-âm, bảo vệ quá dòng và cầu chì, chọn trị số linh kiện.',
  { s: '31', clo: 'CLO2, CLO5',
    flm: '8.4 Practical power supply circuits',
    sach: 'chapter 8, section 8.4',
    hEn: '6.5 — Practical power supply circuits',
    hVi: '6.5 — Các mạch nguồn thực tế',
    lEn: 'putting the pieces together into a complete supply — transformer, bridge rectifier, reservoir capacitor, regulator — plus dual (positive and negative) rails, over-current protection and fusing, and how the component values are actually chosen rather than copied.',
    lVi: 'ghép các mảnh lại thành một bộ nguồn hoàn chỉnh — biến áp, cầu chỉnh lưu, tụ trữ, mạch ổn áp — cộng thêm nguồn đối xứng (đường dương và đường âm), bảo vệ quá dòng và cầu chì, và cách chọn trị số linh kiện thật sự diễn ra thế nào thay vì chép lại.',
    dEn: 'read a complete power-supply schematic and say what every component is there for — the first circuit in the course with more than five parts.',
    dVi: 'đọc được một sơ đồ bộ nguồn hoàn chỉnh và nói được từng linh kiện có mặt để làm gì — mạch đầu tiên trong môn có hơn năm linh kiện.' });

const k66 = khung('eei101-6-6-nguon-xung',
  '6.6 — Switched-mode power supplies|||6.6 — Nguồn xung (switched-mode)',
  'Buổi 32, CLO2 + CLO5, Tooley 8.5: vì sao nguồn xung hiệu suất cao hơn nguồn tuyến tính, chuyển mạch tần số cao và điều chế độ rộng xung, các cấu hình buck/boost, nhiễu EMI là cái giá phải trả.',
  { s: '32', clo: 'CLO2, CLO5',
    flm: '8.5 Switched-mode power supplies',
    sach: 'chapter 8, section 8.5',
    hEn: '6.6 — Switched-mode power supplies',
    hVi: '6.6 — Nguồn xung (switched-mode)',
    lEn: 'why a linear regulator wastes the voltage it drops as heat while a switcher does not: high-frequency switching plus an inductor and <strong>pulse-width modulation</strong>, the buck and boost topologies, efficiency figures, and the price paid — switching noise and EMI. This is where the inductor of session 14 earns its keep.',
    lVi: 'vì sao mạch ổn áp tuyến tính đốt thành nhiệt đúng phần điện áp nó sụt xuống, còn nguồn xung thì không: chuyển mạch tần số cao cộng một cuộn cảm và <strong>điều chế độ rộng xung (PWM)</strong>, các cấu hình buck và boost, con số hiệu suất, và cái giá phải trả — nhiễu chuyển mạch và EMI. Đây là chỗ cuộn cảm của buổi 14 chứng tỏ giá trị của nó.',
    dEn: 'explain why a phone charger the size of a matchbox replaced a transformer the size of a brick.',
    dVi: 'giải thích được vì sao một cục sạc điện thoại bằng bao diêm lại thay thế được cái biến áp to bằng viên gạch.' });

const k67 = khung('eei101-6-7-khao-sat-bo-nguon',
  '6.7 — Practical investigation & problems on power supplies|||6.7 — Thực hành khảo sát & bài tập về bộ nguồn',
  'Buổi 33, CLO2 + CLO5, Tooley 8.6: đo gợn bằng dao động ký ghép AC, dựng đường đặc tuyến tải của bộ nguồn, tính điện trở ra từ hai điểm đo, bài tập chọn tụ trữ và tính công suất tản của mạch ổn áp.',
  { s: '33', clo: 'CLO2, CLO5',
    flm: '8.6 Practical investigation &amp; Problems',
    sach: 'chapter 8, section 8.6',
    hEn: '6.7 — Practical investigation and problems',
    hVi: '6.7 — Thực hành khảo sát và bài tập',
    lEn: 'measuring ripple with an AC-coupled scope (lesson 1.8), plotting a supply\'s load characteristic, calculating output resistance from two measured points, and a problem set on sizing a reservoir capacitor and on the power a regulator must dissipate.',
    lVi: 'đo gợn bằng dao động ký ghép AC (bài 1.8), dựng đường đặc tuyến tải của một bộ nguồn, tính điện trở ra từ hai điểm đo được, và một bộ bài tập về chọn trị số tụ trữ cùng công suất mà mạch ổn áp phải tản đi.',
    dEn: 'characterise a power supply the way a datasheet does, which is also the last preparation before Progress test 1.',
    dVi: 'đặc tả được một bộ nguồn theo đúng cách một datasheet làm, đồng thời là bước chuẩn bị cuối trước Progress test 1.' });

const c5q = quiz('eei101-quiz-5', 'Quiz 5 — Power sources and supplies (sessions 27–33)|||Quiz 5 — Nguồn và bộ nguồn (buổi 27–33)', [
  { id: 'q1', question: 'How many diodes does a full-wave BRIDGE rectifier use?|||Một mạch chỉnh lưu CẦU toàn chu kỳ dùng bao nhiêu diode?', options: ['1|||1', '2|||2', '4|||4', '6|||6'], correctIndex: 2, points: 1, explanation: 'Four, arranged so that whichever way the A.C. input swings, current leaves the bridge in the same direction. One diode gives half-wave rectification.|||Bốn con, xếp sao cho đầu vào AC lắc về phía nào thì dòng ra khỏi cầu vẫn theo một chiều. Một con diode thì chỉ cho chỉnh lưu nửa chu kỳ.' },
  { id: 'q2', question: 'What does the reservoir (smoothing) capacitor do?|||Tụ trữ (tụ làm phẳng) làm việc gì?', options: ['Increases the output voltage indefinitely|||Làm điện áp ra tăng lên vô hạn', 'Holds charge between rectifier peaks, reducing ripple|||Giữ điện tích giữa các đỉnh chỉnh lưu, làm giảm gợn', 'Converts D.C. back to A.C.|||Biến DC trở lại thành AC', 'Protects against reverse polarity|||Bảo vệ chống lắp sai cực'], correctIndex: 1, points: 1, explanation: 'It stores charge on each peak and supplies the load in between, so the output is a nearly steady D.C. with a small ripple riding on it. A bigger capacitor gives less ripple for the same load.|||Nó nạp điện ở mỗi đỉnh và cấp cho tải trong khoảng giữa, nên đầu ra thành một điện áp một chiều gần như phẳng với một phần gợn nhỏ nằm trên. Tụ lớn hơn thì gợn nhỏ hơn với cùng một tải.' },
  { id: 'q3', question: 'Full-wave rectification of a 50 Hz supply produces a ripple frequency of…|||Chỉnh lưu toàn chu kỳ một nguồn 50 Hz cho tần số gợn bằng…', options: ['25 Hz|||25 Hz', '50 Hz|||50 Hz', '100 Hz|||100 Hz', '200 Hz|||200 Hz'], correctIndex: 2, points: 1, explanation: '100 Hz — full-wave rectification flips the negative half up, so there are two peaks per input cycle. Half-wave would give 50 Hz, and the higher frequency is easier to smooth.|||100 Hz — chỉnh lưu toàn chu kỳ lật nửa âm lên trên, nên có hai đỉnh mỗi chu kỳ đầu vào. Nửa chu kỳ thì ra 50 Hz, và tần số cao hơn thì dễ làm phẳng hơn.' },
  { id: 'q4', question: 'A 7805 regulator supplies 5 V at 0.5 A from a 12 V input. How much power does it turn into heat?|||Một IC 7805 cấp 5 V ở 0,5 A từ đầu vào 12 V. Nó biến bao nhiêu công suất thành nhiệt?', options: ['2.5 W|||2,5 W', '3.5 W|||3,5 W', '6 W|||6 W', '8.5 W|||8,5 W'], correctIndex: 1, points: 1, explanation: 'It drops 12 - 5 = 7 V while passing 0.5 A, so P = 7 x 0.5 = 3.5 W of heat — which is why linear regulators need heatsinks and why switchers exist.|||Nó sụt 12 − 5 = 7 V trong khi cho 0,5 A chạy qua, nên P = 7 x 0,5 = 3,5 W nhiệt — đó là lý do mạch ổn áp tuyến tính cần tản nhiệt và là lý do nguồn xung tồn tại.' },
  { id: 'q5', question: 'Why is a switched-mode supply more efficient than a linear one?|||Vì sao nguồn xung hiệu suất cao hơn nguồn tuyến tính?', options: ['It uses fewer components|||Vì nó dùng ít linh kiện hơn', 'It switches fully on or fully off instead of dropping voltage as heat|||Vì nó đóng/cắt hoàn toàn thay vì sụt điện áp thành nhiệt', 'It runs at a lower frequency|||Vì nó chạy ở tần số thấp hơn', 'It needs no inductor|||Vì nó không cần cuộn cảm'], correctIndex: 1, points: 1, explanation: 'A switch that is fully on drops almost no voltage and one that is fully off passes almost no current, so in both states the power lost is small. The energy is shuttled through an inductor instead. The cost is switching noise and EMI.|||Một khoá đang dẫn hoàn toàn thì gần như không sụt áp, còn khi tắt hoàn toàn thì gần như không có dòng, nên ở cả hai trạng thái công suất mất đi đều nhỏ. Năng lượng được chuyển qua một cuộn cảm. Cái giá là nhiễu chuyển mạch và EMI.' },
  { id: 'q6', question: 'Assignment 1 is at session 30. What CLOs does FLM say it covers, and what is it worth?|||Assignment 1 ở buổi 30. FLM nói nó phủ những CLO nào, và đáng bao nhiêu phần trăm?', options: ['All CLOs, 20%|||All CLOs, 20%', 'CLO1-7, 10% (half of the 20% Assignment mark)|||CLO1-7, 10% (một nửa của đầu điểm Assignment 20%)', 'CLO1-2 and CLO5-7, 10%|||CLO1-2 và CLO5-7, 10%', 'CLO6 only, 20%|||Chỉ CLO6, 20%'], correctIndex: 1, points: 1, explanation: 'FLM writes "AS1: CLO1-7; AS2: CLO1-2, CLO5-7". Assignment is 20% over 2 parts, so each is 10%. AS2 (session 51) is the one with the narrower CLO list.|||FLM ghi "AS1: CLO1-7; AS2: CLO1-2, CLO5-7". Assignment là 20% chia 2 phần, nên mỗi bài 10%. AS2 (buổi 51) mới là bài có danh sách CLO hẹp hơn.' },
], 420);

/* ── Chương 7 — Progress test 1 (buổi 34) ────────────────────────────────── */
const k71 = khung('eei101-7-1-progress-test-1',
  '7.1 — Progress test 1 (session 34)|||7.1 — Progress test 1 (buổi 34)',
  'Buổi 34, All CLOs, 5% điểm môn: bài kiểm tra tiến độ đầu tiên; Option 1 là 20 phút/bài, 20-30 câu, 3-8 câu cho mỗi CLOx; phạm vi bảng đánh giá ghi All CLOs (không giới hạn lại), thực tế là buổi 1-33.',
  { s: '34', clo: 'All CLOs',
    flm: 'Progress test 1',
    sach: 'chapters 1–8 (everything up to session 33)',
    hEn: '7.1 — Progress test 1',
    hVi: '7.1 — Progress test 1',
    lEn: 'the first of two Progress tests. The pair is worth 10%, so this one is <strong>5%</strong>. FLM says: <em>Option 1: 20\'/each</em>, <strong>20–30 questions</strong>, "3-8 for each CLOx", and CLO coverage "<strong>PT1: All CLOs</strong>" — note that the assessment table does <em>not</em> narrow it to sessions 1–33, even though that is all that has been taught. The question <em>type</em> is not published anywhere.',
    lVi: 'bài đầu trong hai bài Progress test. Cặp này đáng 10%, nên bài này là <strong>5%</strong>. FLM ghi: <em>Option 1: 20 phút/bài</em>, <strong>20–30 câu</strong>, "3-8 câu cho mỗi CLOx", và phạm vi CLO là "<strong>PT1: All CLOs</strong>" — chú ý bảng đánh giá <em>không</em> thu hẹp lại thành buổi 1–33, dù đó là tất cả những gì đã được dạy. <em>Dạng</em> đề thì không được công bố ở bất cứ đâu.',
    dEn: 'revise the whole first half rather than the last chapter: the safe reading of "All CLOs" is that anything taught so far can appear.',
    dVi: 'ôn cả nửa đầu chứ không chỉ chương cuối: cách đọc an toàn của "All CLOs" là mọi thứ đã dạy đều có thể xuất hiện.' });

/* ── Chương 8 — Khuếch đại &amp; op-amp (buổi 35–39) ─────────────────────────── */
const k81 = khung('eei101-8-1-khuech-dai',
  '8.1 — Amplifiers: types, frequency response and negative feedback|||8.1 — Mạch khuếch đại: các loại, đáp ứng tần số và hồi tiếp âm',
  'Buổi 35, CLO5, Tooley 9.1–9.3: khuếch đại là gì và các lớp A/B/AB/C, độ lợi và decibel, đáp ứng tần số cùng băng thông và điểm −3 dB, hồi tiếp âm đổi độ lợi lấy tính ổn định, ba cấu hình khuếch đại transistor.',
  { s: '35', clo: 'CLO5',
    flm: 'Chapter 9: Amplifiers — 9.1 Types of Amplifier and Basic Operation; 9.2 Frequency Response and Characteristics; 9.3 Negative Feedback and Transistor Amplifiers',
    sach: 'chapter 9, sections 9.1–9.3',
    hEn: '8.1 — Amplifier types, frequency response, negative feedback',
    hVi: '8.1 — Các loại khuếch đại, đáp ứng tần số, hồi tiếp âm',
    lEn: 'what an amplifier does and the classes A, B, AB and C; gain expressed as a ratio and in <strong>decibels</strong>; the frequency response curve with its bandwidth and <strong>−3 dB points</strong> (the same 0.707 you met in lesson 1.5); <strong>negative feedback</strong>, which trades gain for stability and predictability; and the three transistor configurations — common emitter, common base, common collector.',
    lVi: 'mạch khuếch đại làm gì và các lớp A, B, AB, C; độ lợi biểu diễn dạng tỉ số và dạng <strong>decibel</strong>; đường đáp ứng tần số với băng thông và các <strong>điểm −3 dB</strong> (chính con số 0,707 bạn đã gặp ở bài 1.5); <strong>hồi tiếp âm</strong>, thứ đổi độ lợi để lấy tính ổn định và tính dự đoán được; và ba cấu hình transistor — common emitter, common base, common collector.',
    dEn: 'read a gain-versus-frequency plot and state a bandwidth, and explain why almost every real amplifier deliberately throws gain away.',
    dVi: 'đọc được đồ thị độ lợi theo tần số và nêu được băng thông, và giải thích được vì sao gần như mọi mạch khuếch đại thật đều cố tình bỏ đi một phần độ lợi.' });

const k82 = khung('eei101-8-2-mach-tuong-duong-va-phan-cuc',
  '8.2 — Equivalent circuits, biasing and practical amplifiers|||8.2 — Mạch tương đương, phân cực và mạch khuếch đại thực tế',
  'Buổi 36, CLO5, Tooley 9.4–9.6: mô hình tương đương và các tham số h, phân cực để đặt điểm làm việc tĩnh, dự đoán độ lợi và trở kháng vào/ra, ghép tầng bằng tụ, khảo sát một mạch khuếch đại thực tế.',
  { s: '36', clo: 'CLO5',
    flm: '9.4 Equivalent Circuits and Parameters; 9.5 Biasing and Performance Prediction; 9.6 Practical Amplifier Circuits and Investigation',
    sach: 'chapter 9, sections 9.4–9.6',
    hEn: '8.2 — Equivalent circuits, biasing, practical amplifiers',
    hVi: '8.2 — Mạch tương đương, phân cực, mạch khuếch đại thực tế',
    lEn: 'replacing a transistor with an <strong>equivalent circuit</strong> and its h-parameters so the maths becomes linear; <strong>biasing</strong> — setting the quiescent operating point so the signal has room to swing both ways (this is the DC operating point analysis of lesson 1.4); predicting gain and input/output impedance from component values; coupling stages with capacitors; and measuring a real amplifier.',
    lVi: 'thay transistor bằng một <strong>mạch tương đương</strong> cùng các tham số h để phép toán trở thành tuyến tính; <strong>phân cực (biasing)</strong> — đặt điểm làm việc tĩnh sao cho tín hiệu có chỗ lắc về cả hai phía (đúng là phân tích DC operating point ở bài 1.4); dự đoán độ lợi cùng trở kháng vào/ra từ trị số linh kiện; ghép các tầng bằng tụ điện; và đo một mạch khuếch đại thật.',
    dEn: 'calculate the gain of a transistor stage from its resistor values, and recognise a badly biased amplifier from its clipped output waveform.',
    dVi: 'tính được độ lợi của một tầng transistor từ trị số các điện trở, và nhận ra một mạch phân cực sai qua dạng sóng đầu ra bị cắt ngọn.' });

const k83 = khung('eei101-5-1-opamp',
  '8.3 — Operational amplifiers: symbols, parameters, characteristics|||8.3 — Khuếch đại thuật toán: ký hiệu, tham số, đặc tuyến',
  'Buổi 37, CLO2 + CLO5, Tooley 10.1–10.2: ký hiệu op-amp và hai đầu vào, các tham số thật (độ lợi vòng hở, trở kháng vào, offset, slew rate, CMRR), op-amp lý tưởng và hai quy tắc vàng, các ứng dụng cơ bản gồm bộ đệm và bộ so sánh.',
  { s: '37', clo: 'CLO2, CLO5',
    flm: 'Chapter 10: Operational amplifiers — 10.1 Symbols and Operational Amplifier Parameters; 10.2 Operational Amplifier Characteristics and Applications',
    sach: 'chapter 10, sections 10.1–10.2',
    hEn: '8.3 — Op-amp symbols, parameters and characteristics',
    hVi: '8.3 — Ký hiệu, tham số và đặc tuyến op-amp',
    lEn: 'the op-amp symbol and its inverting and non-inverting inputs; the real parameters a datasheet quotes — open-loop gain, input impedance, input offset voltage, <strong>slew rate</strong>, CMRR; the two "golden rules" of the ideal op-amp with negative feedback (no input current, and the two inputs sit at the same voltage); and the basic applications: buffer, comparator, summing amplifier.',
    lVi: 'ký hiệu op-amp cùng hai đầu vào đảo và không đảo; các tham số thật mà datasheet công bố — độ lợi vòng hở, trở kháng vào, điện áp offset đầu vào, <strong>slew rate</strong>, CMRR; hai "quy tắc vàng" của op-amp lý tưởng khi có hồi tiếp âm (không có dòng vào đầu vào, và hai đầu vào ở cùng một điện áp); và các ứng dụng cơ bản: bộ đệm, bộ so sánh, mạch cộng.',
    dEn: 'apply the two golden rules to solve an op-amp circuit in two lines instead of solving equations.',
    dVi: 'dùng hai quy tắc vàng để giải một mạch op-amp trong hai dòng thay vì phải giải hệ phương trình.' });

const k84 = khung('eei101-8-4-gain-bandwidth-va-hoi-tiep',
  '8.4 — Gain, bandwidth, configurations and feedback|||8.4 — Độ lợi, băng thông, các cấu hình và hồi tiếp',
  'Buổi 38, CLO2 + CLO5, Tooley 10.3–10.4: mạch đảo với Gain = -Rf/Rin và mạch không đảo với Gain = 1 + Rf/Rin, tích độ lợi x băng thông là hằng số, mạch cộng, mạch trừ (vi sai), mạch tích phân và vi phân.',
  { s: '38', clo: 'CLO2, CLO5',
    flm: '10.3 Gain, Bandwidth, and Configurations; 10.4 Operational Amplifier Circuits and Feedback',
    sach: 'chapter 10, sections 10.3–10.4',
    hEn: '8.4 — Gain, bandwidth, configurations and feedback',
    hVi: '8.4 — Độ lợi, băng thông, các cấu hình và hồi tiếp',
    lEn: 'the two standard configurations and their formulas — <strong>inverting: Gain = −Rf / Rin</strong> and <strong>non-inverting: Gain = 1 + Rf / Rin</strong>; the <strong>gain-bandwidth product</strong>, which is constant, so asking for more gain always costs you bandwidth; and the feedback circuits built from the same two ideas: summing, differential, integrator, differentiator.',
    lVi: 'hai cấu hình chuẩn và công thức của chúng — <strong>đảo: Gain = −Rf / Rin</strong> và <strong>không đảo: Gain = 1 + Rf / Rin</strong>; <strong>tích độ lợi-băng thông</strong> là một hằng số, nên đòi thêm độ lợi thì luôn phải trả bằng băng thông; và các mạch hồi tiếp dựng từ đúng hai ý niệm đó: mạch cộng, mạch vi sai, mạch tích phân, mạch vi phân.',
    dEn: 'design an amplifier to a required gain by picking two resistors, and predict the bandwidth you will get as a result.',
    dVi: 'thiết kế được một mạch khuếch đại đạt độ lợi yêu cầu bằng cách chọn hai điện trở, và đoán trước được băng thông mình sẽ nhận lại.' });

const k85 = khung('eei101-8-5-khuech-dai-nhieu-tang',
  '8.5 — Multi-stage amplifiers, investigation & important formulae|||8.5 — Khuếch đại nhiều tầng, khảo sát & các công thức quan trọng',
  'Buổi 39, CLO2 + CLO5, Tooley 10.5–10.6: ghép nhiều tầng và độ lợi nhân nhau (cộng theo dB), phối hợp trở kháng giữa các tầng, khảo sát thực hành một mạch op-amp, và bảng tổng hợp công thức quan trọng của chương 9-10.',
  { s: '39', clo: 'CLO2, CLO5',
    flm: '10.5 Multi-Stage Amplifiers and Practical Investigation; 10.6 Important Formulae',
    sach: 'chapter 10, sections 10.5–10.6',
    hEn: '8.5 — Multi-stage amplifiers and the formula summary',
    hVi: '8.5 — Khuếch đại nhiều tầng và bảng công thức',
    lEn: 'cascading stages, where gains <strong>multiply</strong> as ratios and <strong>add</strong> in decibels; impedance matching between stages and why a buffer is often inserted; a practical investigation on a real op-amp circuit; and section 10.6, the textbook\'s own summary of the important formulae — worth copying out before Progress test 2.',
    lVi: 'ghép tầng nối tiếp, trong đó độ lợi <strong>nhân nhau</strong> khi tính bằng tỉ số và <strong>cộng nhau</strong> khi tính bằng decibel; phối hợp trở kháng giữa các tầng và vì sao người ta thường chèn một bộ đệm vào giữa; một bài khảo sát thực hành trên mạch op-amp thật; và mục 10.6, chính bảng tổng hợp công thức quan trọng của giáo trình — đáng chép lại trước Progress test 2.',
    dEn: 'compute the overall gain of a chain of stages both ways (ratio and dB) and get the same answer.',
    dVi: 'tính được độ lợi tổng của một chuỗi tầng theo cả hai cách (tỉ số và dB) và ra cùng một đáp án.' });

const c6q = quiz('eei101-quiz-6', 'Quiz 6 — Amplifiers and op-amps (sessions 35–39)|||Quiz 6 — Khuếch đại và op-amp (buổi 35–39)', [
  { id: 'q1', question: 'The gain of a NON-inverting op-amp amplifier is…|||Độ lợi của mạch khuếch đại op-amp KHÔNG đảo là…', options: ['-Rf / Rin|||−Rf / Rin', '1 + Rf / Rin|||1 + Rf / Rin', 'Rf / Rin|||Rf / Rin', 'Rin / Rf|||Rin / Rf'], correctIndex: 1, points: 1, explanation: 'Non-inverting: Gain = 1 + Rf/Rin, always at least 1 and always positive. The inverting configuration is Gain = -Rf/Rin.|||Không đảo: Gain = 1 + Rf/Rin, luôn từ 1 trở lên và luôn dương. Cấu hình đảo mới là Gain = −Rf/Rin.' },
  { id: 'q2', question: 'With Rin = 1 kohm and Rf = 9 kohm in a non-inverting amplifier, what is Vout for Vin = 0.2 V?|||Với Rin = 1 kohm và Rf = 9 kohm trong mạch khuếch đại không đảo, Vout bằng bao nhiêu khi Vin = 0,2 V?', options: ['0.2 V|||0,2 V', '1.8 V|||1,8 V', '2.0 V|||2,0 V', '9.0 V|||9,0 V'], correctIndex: 2, points: 1, explanation: 'Gain = 1 + 9000/1000 = 10, so Vout = 10 x 0.2 = 2.0 V. Answering 1.8 V means the "1 +" was dropped.|||Gain = 1 + 9000/1000 = 10, nên Vout = 10 x 0,2 = 2,0 V. Trả lời 1,8 V nghĩa là đã bỏ mất phần "1 +".' },
  { id: 'q3', question: 'One of the two "golden rules" of an ideal op-amp with negative feedback is…|||Một trong hai "quy tắc vàng" của op-amp lý tưởng có hồi tiếp âm là…', options: ['A large current flows into the inputs|||Một dòng lớn chảy vào các đầu vào', 'The two inputs sit at the same voltage (a virtual short)|||Hai đầu vào ở cùng một điện áp (ngắn mạch ảo)', 'The output is always zero|||Đầu ra luôn bằng 0', 'The gain is always exactly 1|||Độ lợi luôn đúng bằng 1'], correctIndex: 1, points: 1, explanation: 'The two rules: no current flows into the inputs (infinite input impedance), and the op-amp drives its output until both inputs are at the same voltage. Those two lines solve most op-amp circuits.|||Hai quy tắc: không có dòng chảy vào các đầu vào (trở kháng vào vô cùng), và op-amp lái đầu ra cho tới khi hai đầu vào ở cùng điện áp. Hai dòng đó giải được phần lớn mạch op-amp.' },
  { id: 'q4', question: 'What does NEGATIVE feedback do to an amplifier?|||Hồi tiếp ÂM làm gì với một mạch khuếch đại?', options: ['Increases gain and reduces stability|||Tăng độ lợi và giảm tính ổn định', 'Reduces gain but improves stability, linearity and bandwidth|||Giảm độ lợi nhưng cải thiện tính ổn định, tính tuyến tính và băng thông', 'Makes the amplifier oscillate|||Làm mạch khuếch đại dao động', 'Has no effect below 1 kHz|||Không có tác dụng gì dưới 1 kHz'], correctIndex: 1, points: 1, explanation: 'Negative feedback trades gain for predictability: less gain, but the gain that remains is set by resistors instead of by the transistor. POSITIVE feedback is what makes a circuit oscillate (session 43).|||Hồi tiếp âm đổi độ lợi lấy tính dự đoán được: độ lợi ít hơn, nhưng phần độ lợi còn lại do các điện trở quyết định thay vì do transistor. Hồi tiếp DƯƠNG mới là thứ làm mạch dao động (buổi 43).' },
  { id: 'q5', question: 'Two amplifier stages with gains of 10 and 20 are cascaded. What is the overall gain?|||Hai tầng khuếch đại có độ lợi 10 và 20 ghép nối tiếp. Độ lợi tổng bằng bao nhiêu?', options: ['30|||30', '200|||200', '10|||10', '2|||2'], correctIndex: 1, points: 1, explanation: 'Gains multiply as ratios: 10 x 20 = 200. They only ADD when expressed in decibels (20 dB + 26 dB = 46 dB).|||Độ lợi nhân nhau khi tính bằng tỉ số: 10 x 20 = 200. Chúng chỉ CỘNG khi tính bằng decibel (20 dB + 26 dB = 46 dB).' },
  { id: 'q6', question: 'The gain-bandwidth product of an op-amp is constant. If you double the gain, the bandwidth…|||Tích độ lợi-băng thông của op-amp là hằng số. Nếu bạn tăng độ lợi lên gấp đôi thì băng thông…', options: ['doubles|||tăng gấp đôi', 'halves|||giảm một nửa', 'stays the same|||không đổi', 'becomes zero|||trở thành 0'], correctIndex: 1, points: 1, explanation: 'Constant product means gain x bandwidth stays fixed, so doubling one halves the other. This is why a high-gain stage is always a narrow-bandwidth stage, and why big gains are built from several modest stages.|||Tích không đổi nghĩa là độ lợi nhân băng thông luôn cố định, nên tăng một cái gấp đôi thì cái kia còn một nửa. Đó là lý do một tầng độ lợi cao luôn là một tầng băng thông hẹp, và là lý do người ta dựng độ lợi lớn từ nhiều tầng vừa phải.' },
], 420);

/* ── Chương 9 — Lab 3 (buổi 40–42) ───────────────────────────────────────── */
const k91 = khung('eei101-9-1-lab-3',
  '9.1 — Lab 3 (sessions 40–42)|||9.1 — Lab 3 (buổi 40–42)',
  'Buổi 40–42, All CLOs, 5% điểm môn: bài Lab thứ ba, ba buổi liền, đặt ngay sau chương bán dẫn, bộ nguồn, khuếch đại và op-amp; dựng và đo mạch có linh kiện chủ động; hình thức phụ thuộc Option 1 hay Option 2.',
  { s: '40–42', clo: 'All CLOs',
    flm: 'Lab 3',
    sach: 'chapters 7–10 (semiconductors, power supplies, amplifiers, op-amps)',
    hEn: '9.1 — Lab 3 (three sessions)',
    hVi: '9.1 — Lab 3 (ba buổi liền)',
    lEn: 'the third Lab, worth <strong>5%</strong>, sitting directly after semiconductors, power supplies, amplifiers and op-amps — so this is the first Lab with <em>active</em> devices in it: diodes, transistors, an op-amp stage. Format again depends on Option 1 ("In LAB") versus Option 2 ("Follow lecturer\'s proposal").',
    lVi: 'bài Lab thứ ba, đáng <strong>5%</strong>, nằm ngay sau các chương bán dẫn, bộ nguồn, khuếch đại và op-amp — nên đây là bài Lab đầu tiên có linh kiện <em>chủ động</em>: diode, transistor, một tầng op-amp. Hình thức lại phụ thuộc Option 1 ("In LAB") hay Option 2 ("Follow lecturer\'s proposal").',
    dEn: 'measure gain and bias points on a circuit that amplifies, and explain a clipped waveform instead of ignoring it.',
    dVi: 'đo được độ lợi và điểm phân cực trên một mạch có khuếch đại, và giải thích được một dạng sóng bị cắt ngọn thay vì bỏ qua nó.' });

/* ── Chương 10 — Dao động &amp; mạch logic (buổi 43–48) ──────────────────────── */
const k101 = khung('eei101-10-1-hoi-tiep-duong',
  '10.1 — Oscillators: positive feedback and the conditions for oscillation|||10.1 — Mạch dao động: hồi tiếp dương và điều kiện dao động',
  'Buổi 43, CLO5, Tooley 11.1: hồi tiếp dương khác hồi tiếp âm thế nào, tiêu chuẩn Barkhausen (độ lợi vòng bằng 1 và lệch pha 0 độ), vì sao một mạch khuếch đại có thể tự dao động ngoài ý muốn.',
  { s: '43', clo: 'CLO5',
    flm: 'Chapter 11: Oscillators — 11.1 Positive feedback and conditions for oscillation',
    sach: 'chapter 11, section 11.1',
    hEn: '10.1 — Positive feedback and the conditions for oscillation',
    hVi: '10.1 — Hồi tiếp dương và điều kiện dao động',
    lEn: '<strong>positive</strong> feedback, the mirror image of the negative feedback of session 35: feed the output back in phase and the circuit sustains its own signal. The two conditions (the <strong>Barkhausen criterion</strong>): loop gain of 1 and a total phase shift of 0 degrees at the oscillating frequency. Also the unwanted case — an amplifier that oscillates because of stray feedback you did not design in.',
    lVi: 'hồi tiếp <strong>dương</strong>, hình ảnh đối xứng của hồi tiếp âm ở buổi 35: đưa đầu ra về đúng pha thì mạch tự duy trì tín hiệu của chính nó. Hai điều kiện (<strong>tiêu chuẩn Barkhausen</strong>): độ lợi vòng bằng 1 và tổng độ lệch pha bằng 0 độ tại tần số dao động. Kèm theo trường hợp ngoài ý muốn — một mạch khuếch đại tự dao động vì đường hồi tiếp ký sinh mà bạn không hề thiết kế.',
    dEn: 'say whether a feedback loop will amplify or oscillate, from its phase alone.',
    dVi: 'nói được một vòng hồi tiếp sẽ khuếch đại hay sẽ dao động, chỉ từ pha của nó.' });

const k102 = khung('eei101-10-2-mach-dao-dong-tieu-bieu',
  '10.2 — Some typical oscillator circuits|||10.2 — Một số mạch dao động tiêu biểu',
  'Buổi 44, CLO5, Tooley 11.2: dao động dịch pha RC và mạch Wien bridge, dao động LC kiểu Hartley và Colpitts, dao động thạch anh và độ ổn định tần số, chọn mạch nào cho dải tần nào.',
  { s: '44', clo: 'CLO5',
    flm: '11.2 Some Typical Oscillator Circuits',
    sach: 'chapter 11, section 11.2',
    hEn: '10.2 — Typical oscillator circuits',
    hVi: '10.2 — Các mạch dao động tiêu biểu',
    lEn: 'the standard family: <strong>R–C</strong> oscillators (phase shift, Wien bridge) for audio frequencies, <strong>L–C</strong> oscillators (Hartley, Colpitts) for radio frequencies — tuned by the resonance formula from session 20 — and the <strong>crystal</strong> oscillator, whose frequency stability is what makes clocks and radios possible.',
    lVi: 'nhóm mạch chuẩn: dao động <strong>R–C</strong> (dịch pha, Wien bridge) cho dải âm tần, dao động <strong>L–C</strong> (Hartley, Colpitts) cho dải cao tần — được định tần bằng chính công thức cộng hưởng của buổi 20 — và dao động <strong>thạch anh</strong>, với độ ổn định tần số là thứ làm nên đồng hồ và máy thu phát.',
    dEn: 'choose an oscillator type for a target frequency, and calculate that frequency from the R, C or L, C values.',
    dVi: 'chọn được loại mạch dao động cho một tần số mục tiêu, và tính được tần số đó từ trị số R, C hoặc L, C.' });

const k103 = khung('eei101-10-3-astable-multivibrator',
  '10.3 — The astable multivibrator, practical oscillators & problems|||10.3 — Mạch đa hài phi ổn, mạch dao động thực tế & bài tập',
  'Buổi 45, CLO5, Tooley 11.3–11.4: mạch đa hài phi ổn (astable) không có trạng thái bền nào nên tự chạy, tính chu kỳ và chu kỳ nhiệm vụ từ R và C, IC 555, bài tập tính tần số dao động.',
  { s: '45', clo: 'CLO5',
    flm: '11.3 The astable multivibrator; 11.4 Practical oscillator circuits &amp; Problems',
    sach: 'chapter 11, sections 11.3–11.4',
    hEn: '10.3 — The astable multivibrator and practical oscillators',
    hVi: '10.3 — Mạch đa hài phi ổn và mạch dao động thực tế',
    lEn: 'the <strong>astable</strong> multivibrator, which has no stable state at all and therefore free-runs, producing a square wave; how its period and duty cycle come from the R–C time constants of session 17; the 555 timer as the packaged version; and a problem set on calculating oscillation frequency.',
    lVi: 'mạch đa hài <strong>phi ổn (astable)</strong> — không có trạng thái bền nào nên nó tự chạy, tạo ra sóng vuông; chu kỳ và chu kỳ nhiệm vụ của nó sinh ra từ chính các hằng số thời gian R–C của buổi 17; IC 555 là phiên bản đóng gói sẵn; và một bộ bài tập tính tần số dao động.',
    dEn: 'calculate the frequency of a square-wave generator from two resistors and a capacitor, and check it on a scope.',
    dVi: 'tính được tần số của một mạch tạo sóng vuông từ hai điện trở và một tụ, rồi kiểm lại trên dao động ký.' });

const k104 = khung('eei101-6-1-digital',
  '10.4 — Logic circuits: basic logic functions and gates|||10.4 — Mạch logic: các hàm logic cơ bản và cổng logic',
  'Buổi 46, CLO5, Tooley 12.1: mức logic 0/1 và ngưỡng điện áp, các cổng AND, OR, NOT, NAND, NOR, XOR cùng bảng chân trị, đại số Boole và định luật De Morgan, cổng NAND/NOR là cổng vạn năng.',
  { s: '46', clo: 'CLO5',
    flm: 'Chapter 12: Logic circuits — 12.1 Basic logic functions and gates',
    sach: 'chapter 12, section 12.1',
    hEn: '10.4 — Basic logic functions and gates',
    hVi: '10.4 — Các hàm logic cơ bản và cổng logic',
    lEn: 'logic levels 0 and 1 as voltage bands with a forbidden zone between them (the point lesson 1.5 made about what logic simulation hides); the gates <strong>AND, OR, NOT, NAND, NOR, XOR</strong> with their truth tables; <strong>Boolean algebra</strong> and <strong>De Morgan\'s theorems</strong> for simplifying an expression; and why NAND and NOR are called universal gates.',
    lVi: 'mức logic 0 và 1 là các dải điện áp với một vùng cấm ở giữa (đúng điều bài 1.5 đã nói về thứ mà mô phỏng logic che đi); các cổng <strong>AND, OR, NOT, NAND, NOR, XOR</strong> cùng bảng chân trị của chúng; <strong>đại số Boole</strong> và <strong>định luật De Morgan</strong> để rút gọn biểu thức; và vì sao NAND với NOR được gọi là cổng vạn năng.',
    dEn: 'write the truth table of any small gate network, and simplify a Boolean expression instead of building the gates you did not need.',
    dVi: 'viết được bảng chân trị của mọi mạng cổng nhỏ, và rút gọn được một biểu thức Boole thay vì đi lắp những cổng lẽ ra không cần.' });

const k105 = khung('eei101-10-5-flip-flop',
  '10.5 — Types of bistables (flip-flops)|||10.5 — Các loại mạch hai trạng thái bền (flip-flop)',
  'Buổi 47, CLO5, Tooley 12.2: mạch bistable có hai trạng thái bền nên nó NHỚ, chốt SR, flip-flop D và JK, kích theo mức và theo cạnh xung nhịp, ứng dụng làm bộ đếm và thanh ghi.',
  { s: '47', clo: 'CLO5',
    flm: '12.2 Types of Bistables',
    sach: 'chapter 12, section 12.2',
    hEn: '10.5 — Bistables: the circuits that remember',
    hVi: '10.5 — Mạch bistable: những mạch biết NHỚ',
    lEn: 'a <strong>bistable</strong> has two stable states, so unlike the astable of session 45 it stays where you put it — which is what <em>memory</em> means. The SR latch, then the D and JK flip-flops, level versus <strong>edge triggering</strong> from a clock, and what you build out of them: counters, shift registers, the storage inside every processor.',
    lVi: 'mạch <strong>bistable</strong> có hai trạng thái bền, nên khác với mạch astable ở buổi 45, nó nằm yên ở nơi bạn đặt nó vào — và đó chính là nghĩa của <em>bộ nhớ</em>. Chốt SR, rồi flip-flop D và JK, kích theo mức so với <strong>kích theo cạnh</strong> của xung nhịp, và những thứ dựng từ chúng: bộ đếm, thanh ghi dịch, phần lưu trữ bên trong mọi vi xử lý.',
    dEn: 'explain the difference between astable, monostable and bistable in one sentence each, and say why an uninitialised flip-flop shows X in a simulator (lesson 1.5).',
    dVi: 'giải thích được astable, monostable và bistable bằng một câu cho mỗi loại, và nói được vì sao một flip-flop chưa khởi tạo lại hiện chữ X trong phần mềm mô phỏng (bài 1.5).' });

const k106 = khung('eei101-10-6-ic-logic',
  '10.6 — Integrated circuit logic devices, investigation & problems|||10.6 — Các IC logic, khảo sát & bài tập',
  'Buổi 48, CLO5, Tooley 12.3–12.4: các họ logic TTL và CMOS, mức điện áp và fan-out, công suất tiêu thụ và trễ truyền, đọc datasheet một IC họ 74, thực hành kiểm bảng chân trị và bài tập.',
  { s: '48', clo: 'CLO5',
    flm: '12.3 Integrated circuit logic devices; 12.4 Practical investigation &amp; Problems',
    sach: 'chapter 12, sections 12.3–12.4',
    hEn: '10.6 — IC logic families and practical investigation',
    hVi: '10.6 — Các họ IC logic và thực hành khảo sát',
    lEn: 'the real chips: <strong>TTL</strong> and <strong>CMOS</strong> families, their logic level thresholds, fan-out, power consumption and propagation delay (the 10 ns that shifted the waveform in lesson 1.5); reading a 74-series datasheet; then verifying a truth table on real or simulated hardware, and a problem set.',
    lVi: 'các con chip thật: họ <strong>TTL</strong> và họ <strong>CMOS</strong>, ngưỡng mức logic của chúng, fan-out, công suất tiêu thụ và trễ truyền (đúng 10 ns đã đẩy dạng sóng ở bài 1.5); đọc datasheet một IC họ 74; rồi kiểm chứng một bảng chân trị trên phần cứng thật hoặc mô phỏng, và một bộ bài tập.',
    dEn: 'pick a logic family for a job, and read the two numbers in a datasheet that decide whether two chips can talk to each other.',
    dVi: 'chọn được họ logic cho một việc, và đọc được hai con số trong datasheet quyết định hai con chip có nói chuyện được với nhau hay không.' });

const c7q = quiz('eei101-quiz-7', 'Quiz 7 — Oscillators and logic circuits (sessions 43–48)|||Quiz 7 — Mạch dao động và mạch logic (buổi 43–48)', [
  { id: 'q1', question: 'What kind of feedback does an oscillator need?|||Một mạch dao động cần loại hồi tiếp nào?', options: ['Negative feedback|||Hồi tiếp âm', 'Positive feedback, with loop gain 1 and 0 degrees phase shift|||Hồi tiếp dương, với độ lợi vòng bằng 1 và lệch pha 0 độ', 'No feedback at all|||Không cần hồi tiếp nào', 'Feedback only above 1 MHz|||Chỉ cần hồi tiếp trên 1 MHz'], correctIndex: 1, points: 1, explanation: 'Positive feedback that returns the output in phase, satisfying the Barkhausen criterion: loop gain 1, total phase shift 0 degrees. Negative feedback does the opposite — it stabilises an amplifier.|||Hồi tiếp dương, đưa đầu ra về đúng pha, thoả tiêu chuẩn Barkhausen: độ lợi vòng bằng 1, tổng lệch pha 0 độ. Hồi tiếp âm làm điều ngược lại — nó ổn định hoá mạch khuếch đại.' },
  { id: 'q2', question: 'A circuit with NO stable state, which free-runs and produces a square wave, is a…|||Một mạch KHÔNG có trạng thái bền nào, tự chạy và tạo ra sóng vuông, là mạch…', options: ['bistable|||bistable (hai trạng thái bền)', 'monostable|||monostable (một trạng thái bền)', 'astable multivibrator|||astable multivibrator (đa hài phi ổn)', 'Schmitt trigger|||Schmitt trigger'], correctIndex: 2, points: 1, explanation: 'Astable = no stable state, so it keeps flipping: a square-wave generator. Bistable has two stable states (memory); monostable has one, and returns to it after a fixed time.|||Astable = không có trạng thái bền nào, nên nó cứ lật liên tục: một mạch tạo sóng vuông. Bistable có hai trạng thái bền (bộ nhớ); monostable có một, và tự quay về đó sau một thời gian cố định.' },
  { id: 'q3', question: 'A 2-input XOR gate outputs 1 when…|||Cổng XOR hai đầu vào cho ra 1 khi…', options: ['both inputs are 1|||cả hai đầu vào đều là 1', 'the inputs are different|||hai đầu vào KHÁC nhau', 'both inputs are 0|||cả hai đầu vào đều là 0', 'the inputs are the same|||hai đầu vào giống nhau'], correctIndex: 1, points: 1, explanation: 'XOR = exclusive OR: 1 when exactly one input is 1, i.e. when they differ. Both-1 gives 0, which is what distinguishes it from OR.|||XOR = OR loại trừ: ra 1 khi đúng một đầu vào là 1, tức khi hai đầu vào khác nhau. Cả hai đều 1 thì ra 0, và đó là điểm phân biệt nó với OR.' },
  { id: 'q4', question: 'De Morgan\'s theorem states that NOT(A AND B) equals…|||Định luật De Morgan phát biểu NOT(A AND B) bằng…', options: ['NOT A AND NOT B|||NOT A AND NOT B', 'NOT A OR NOT B|||NOT A OR NOT B', 'A OR B|||A OR B', 'A AND B|||A AND B'], correctIndex: 1, points: 1, explanation: 'NOT(A.B) = NOT A + NOT B, and dually NOT(A+B) = NOT A . NOT B. Break the bar, change the sign — the rule used constantly to simplify logic and to convert everything into NAND gates.|||NOT(A.B) = NOT A + NOT B, và đối ngẫu NOT(A+B) = NOT A . NOT B. Phá dấu gạch, đổi dấu phép toán — quy tắc dùng liên tục để rút gọn logic và để đổi mọi thứ về cổng NAND.' },
  { id: 'q5', question: 'Which gate is called "universal" because any logic function can be built from it alone?|||Cổng nào được gọi là "vạn năng" vì chỉ dùng nó cũng dựng được mọi hàm logic?', options: ['AND|||AND', 'XOR|||XOR', 'NAND (and likewise NOR)|||NAND (và NOR cũng vậy)', 'NOT|||NOT'], correctIndex: 2, points: 1, explanation: 'NAND and NOR are each universal: AND, OR and NOT can all be made from copies of one of them, which is why real chips are built mostly from NAND.|||NAND và NOR mỗi cái đều là cổng vạn năng: AND, OR và NOT đều dựng được từ nhiều bản sao của một trong hai cổng đó, và đó là lý do chip thật phần lớn dựng từ NAND.' },
  { id: 'q6', question: 'Which circuit REMEMBERS its state, and is therefore the basis of memory?|||Mạch nào NHỚ được trạng thái của nó, và vì thế là nền tảng của bộ nhớ?', options: ['The astable multivibrator|||Mạch đa hài phi ổn (astable)', 'The bistable (flip-flop)|||Mạch bistable (flip-flop)', 'The R-C low-pass filter|||Mạch lọc thông thấp R-C', 'The bridge rectifier|||Mạch chỉnh lưu cầu'], correctIndex: 1, points: 1, explanation: 'A bistable stays in whichever of its two stable states it was put into, so it stores one bit. Counters, shift registers and processor registers are all built from them.|||Mạch bistable nằm yên ở trạng thái bền nào mà nó được đặt vào, nên nó lưu được một bit. Bộ đếm, thanh ghi dịch và thanh ghi của vi xử lý đều dựng từ nó.' },
], 420);

/* ── Chương 11 — Cảm biến &amp; giao tiếp + Assignment 2 (buổi 49–51) ────────── */
const k111 = khung('eei101-7-1-sensors-actuators',
  '11.1 — Sensors and interfacing: instrumentation, transducers and sensors|||11.1 — Cảm biến và giao tiếp: hệ thống đo lường, bộ chuyển đổi và cảm biến',
  'Buổi 49, CLO2, Tooley 13.1–13.2: hệ thống đo lường và điều khiển dạng vòng, bộ chuyển đổi (transducer) khác cảm biến (sensor) thế nào, nhiệt điện trở và cặp nhiệt, cảm biến quang, cảm biến áp suất và biến dạng, chuẩn hoá tín hiệu trước khi đưa vào ADC.',
  { s: '49', clo: 'CLO2',
    flm: 'Chapter 13: Sensors and interfacing — 13.1 Instrumentation and control system; 13.2 Transducers and Sensors',
    sach: 'chapter 13, sections 13.1–13.2',
    hEn: '11.1 — Instrumentation, transducers and sensors',
    hVi: '11.1 — Hệ thống đo lường, bộ chuyển đổi và cảm biến',
    lEn: 'the shape of an instrumentation and control system — sense, condition, decide, act — and where electronics sits in it; the difference between a <strong>transducer</strong> and a <strong>sensor</strong>; the main families (thermistor and thermocouple, LDR and photodiode, strain gauge, pressure sensor); and <strong>signal conditioning</strong>: a resistive sensor plus one fixed resistor is the voltage divider of lesson 1.2, and the op-amp of session 37 is what scales it for an ADC.',
    lVi: 'hình dáng của một hệ thống đo lường và điều khiển — cảm nhận, chuẩn hoá, quyết định, tác động — và điện tử nằm ở đâu trong đó; khác biệt giữa <strong>bộ chuyển đổi (transducer)</strong> và <strong>cảm biến (sensor)</strong>; các họ chính (nhiệt điện trở và cặp nhiệt, quang điện trở và photodiode, cảm biến biến dạng, cảm biến áp suất); và <strong>chuẩn hoá tín hiệu</strong>: một cảm biến điện trở cộng một điện trở cố định chính là bộ chia áp của bài 1.2, còn op-amp của buổi 37 là thứ khuếch đại nó cho vừa dải của ADC.',
    dEn: 'design the front end that turns a physical quantity into a voltage an ADC can read — and see that it is made entirely of things taught in chapters 1 to 10.',
    dVi: 'thiết kế được tầng đầu biến một đại lượng vật lý thành điện áp mà ADC đọc được — và thấy rằng nó hoàn toàn dựng từ những thứ đã dạy ở chương 1 tới 10.' });

const k112 = khung('eei101-8-1-vehicle-electrical-mcu',
  '11.2 — Outputs and consumption load; practical investigation|||11.2 — Đầu ra và tải tiêu thụ; thực hành khảo sát',
  'Buổi 50, CLO2, Tooley 13.3–13.4: lái tải ở đầu ra (LED, rơ-le, động cơ, van điện từ), vì sao chân điều khiển phải qua transistor hay MOSFET, diode dập xung cho tải cảm, điều khiển công suất bằng PWM, thực hành khảo sát và bài tập.',
  { s: '50', clo: 'CLO2',
    flm: '13.3 Outputs and consumption load; 13.4 Practical investigation &amp; Problems',
    sach: 'chapter 13, sections 13.3–13.4',
    hEn: '11.2 — Outputs, loads and practical investigation',
    hVi: '11.2 — Đầu ra, tải tiêu thụ và thực hành khảo sát',
    lEn: 'the other end of the chain: driving real <strong>loads</strong> — LED, relay, motor, solenoid — and why a control output almost never drives them directly but through a transistor or MOSFET (session 26); the <strong>flyback diode</strong> an inductive load needs (session 14); controlling power with <strong>PWM</strong> so the average delivered voltage is the duty cycle times the supply; then a practical investigation and problems.',
    lVi: 'đầu còn lại của chuỗi: lái các <strong>tải</strong> thật — LED, rơ-le, động cơ, van điện từ — và vì sao một đầu ra điều khiển gần như không bao giờ lái chúng trực tiếp mà phải qua transistor hoặc MOSFET (buổi 26); <strong>diode dập xung (flyback)</strong> mà tải cảm bắt buộc phải có (buổi 14); điều khiển công suất bằng <strong>PWM</strong> sao cho điện áp trung bình cấp ra bằng chu kỳ nhiệm vụ nhân điện áp nguồn; rồi một bài khảo sát thực hành và bài tập.',
    dEn: 'size a driver stage for a given load and calculate the average voltage a PWM duty cycle delivers.',
    dVi: 'chọn được tầng lái cho một tải cho trước và tính được điện áp trung bình mà một chu kỳ nhiệm vụ PWM cấp ra.' });

const k113 = khung('eei101-11-3-assignment-2',
  '11.3 — Assignment 2 (session 51)|||11.3 — Assignment 2 (buổi 51)',
  'Buổi 51, cột CLO của buổi ghi CLO6 trong khi bảng đánh giá ghi AS2: CLO1-2 và CLO5-7 (nêu rõ chênh lệch này, không tự hoà giải); 10% điểm môn, 1-2 câu cho mỗi CLOx; Option 1 làm ở nhà.',
  { s: '51', clo: 'CLO6',
    flm: 'Assignment 2',
    sach: 'chapters 1–13 (everything up to session 50)',
    hEn: '11.3 — Assignment 2',
    hVi: '11.3 — Assignment 2',
    lEn: 'the second Assignment, <strong>10%</strong> of the course. Two different parts of the syllabus describe its scope and they do not match: the <strong>session plan</strong> tags session 51 as <strong>CLO6</strong> (simulation software), while the <strong>assessment table</strong> says <strong>AS2: CLO1-2, CLO5-7</strong> — which does not include CLO6. We report both rather than pick one. The safe reading is that it is a simulate-and-design task; confirm with your lecturer.',
    lVi: 'bài Assignment thứ hai, <strong>10%</strong> điểm môn. Hai chỗ khác nhau trong syllabus mô tả phạm vi của nó và chúng KHÔNG khớp: <strong>bảng kế hoạch buổi</strong> gắn buổi 51 là <strong>CLO6</strong> (phần mềm mô phỏng), còn <strong>bảng đánh giá</strong> ghi <strong>AS2: CLO1-2, CLO5-7</strong> — trong đó KHÔNG có CLO6. Web nêu cả hai chứ không chọn một. Cách đọc an toàn là đây là một bài thiết kế-và-mô phỏng; hãy xác nhận với giảng viên.',
    dEn: 'notice the mismatch yourself and ask about it — the kind of question that shows you read the syllabus and not just the slides.',
    dVi: 'tự phát hiện chỗ lệch đó và đi hỏi — đúng loại câu hỏi cho thấy bạn đã đọc syllabus, không chỉ đọc slide.' });

/* ── Chương 12 — Truyền tín hiệu (buổi 52–54) ────────────────────────────── */
const k121 = khung('eei101-12-1-co-ban-truyen-thong',
  '12.1 — Basics of electronic communication|||12.1 — Cơ bản về truyền thông điện tử',
  'Buổi 52, CLO1 (bản gốc in "CL01"), Tooley 14.1: chuỗi phát-kênh truyền-thu, tín hiệu và sóng mang, băng thông và nhiễu, tỉ số tín hiệu trên nhiễu, so sánh truyền có dây với không dây.',
  { s: '52', clo: 'CLO1',
    flm: 'Chapter 14: Wireless and wired signal transmitters — 14.1 Basics of Electronic Communication',
    sach: 'chapter 14, section 14.1',
    hEn: '12.1 — Basics of electronic communication',
    hVi: '12.1 — Cơ bản về truyền thông điện tử',
    lEn: 'the transmitter–channel–receiver chain; the difference between the <strong>signal</strong> and the <strong>carrier</strong> that carries it; bandwidth, noise and the signal-to-noise ratio; and a comparison of wired against wireless channels. <strong>Note:</strong> FLM prints the CLO for sessions 52–54 as "CL01" with a digit zero — it means CLO1.',
    lVi: 'chuỗi phát — kênh truyền — thu; khác biệt giữa <strong>tín hiệu</strong> và <strong>sóng mang</strong> chở nó đi; băng thông, nhiễu và tỉ số tín hiệu trên nhiễu; và so sánh kênh có dây với kênh không dây. <strong>Lưu ý:</strong> FLM in cột CLO của buổi 52–54 là "CL01" với số không — nó nghĩa là CLO1.',
    dEn: 'describe why a signal needs a carrier at all, and what bandwidth actually costs.',
    dVi: 'mô tả được vì sao một tín hiệu lại cần tới sóng mang, và băng thông thật sự phải trả giá bằng cái gì.' });

const k122 = khung('eei101-12-2-song-dien-tu-va-dieu-che',
  '12.2 — Electromagnetic waves and signal modulation|||12.2 — Sóng điện từ và các kỹ thuật điều chế',
  'Buổi 53, CLO1 (bản gốc in "CL01"), Tooley 14.2–14.3: phổ điện từ và các dải tần, bước sóng và tần số, ăng-ten; điều chế biên độ AM, điều chế tần số FM, điều chế pha, và các dạng điều chế số.',
  { s: '53', clo: 'CLO1',
    flm: '14.2 Types of Electromagnetic Waves; 14.3 Signal Modulation Techniques',
    sach: 'chapter 14, sections 14.2–14.3',
    hEn: '12.2 — Electromagnetic waves and modulation',
    hVi: '12.2 — Sóng điện từ và điều chế',
    lEn: 'the electromagnetic spectrum and its bands, the relation between wavelength and frequency, and what an antenna does; then <strong>modulation</strong>: <strong>AM</strong> varies the carrier\'s amplitude, <strong>FM</strong> varies its frequency, PM varies its phase, plus the digital equivalents (ASK, FSK, PSK) and why FM resists noise better than AM.',
    lVi: 'phổ điện từ và các dải tần, liên hệ giữa bước sóng và tần số, và ăng-ten làm việc gì; rồi tới <strong>điều chế</strong>: <strong>AM</strong> thay đổi biên độ sóng mang, <strong>FM</strong> thay đổi tần số của nó, PM thay đổi pha, cộng thêm các dạng số tương ứng (ASK, FSK, PSK) và vì sao FM chống nhiễu tốt hơn AM.',
    dEn: 'say which quantity of the carrier each modulation scheme changes, and why radio stations are labelled AM or FM.',
    dVi: 'nói được mỗi kiểu điều chế thay đổi đại lượng nào của sóng mang, và vì sao các đài phát thanh được ghi là AM hay FM.' });

const k123 = khung('eei101-12-3-ma-hoa-giai-ma',
  '12.3 — Signal encoding and decoding|||12.3 — Mã hoá và giải mã tín hiệu',
  'Buổi 54, CLO1 (bản gốc in "CL01"), Tooley 14.4: số hoá tín hiệu tương tự, lấy mẫu và lượng tử hoá, các mã đường truyền, phát hiện và sửa lỗi bằng bit chẵn lẻ và checksum, giải mã ở đầu thu.',
  { s: '54', clo: 'CLO1',
    flm: '14.4 Signal Encoding and Decoding',
    sach: 'chapter 14, section 14.4',
    hEn: '12.3 — Signal encoding and decoding',
    hVi: '12.3 — Mã hoá và giải mã tín hiệu',
    lEn: 'turning an analogue signal into bits: <strong>sampling</strong> and <strong>quantisation</strong> (the ADC at the end of the sensor chain of session 49), line codes, <strong>error detection</strong> with parity and checksums, and decoding at the receiver. This is the last taught chapter of the course — everything after session 54 is Lab 4, Progress test 2 and the presentations.',
    lVi: 'biến một tín hiệu tương tự thành các bit: <strong>lấy mẫu</strong> và <strong>lượng tử hoá</strong> (chính con ADC ở cuối chuỗi cảm biến của buổi 49), các mã đường truyền, <strong>phát hiện lỗi</strong> bằng bit chẵn lẻ và checksum, và việc giải mã ở đầu thu. Đây là chương cuối cùng được dạy của môn — mọi thứ sau buổi 54 là Lab 4, Progress test 2 và thuyết trình.',
    dEn: 'explain why a CD, a phone call and a car sensor all end up as numbers, and what is lost when they do.',
    dVi: 'giải thích được vì sao một cái CD, một cuộc gọi và một cảm biến trên xe cuối cùng đều thành những con số, và cái gì bị mất đi khi làm vậy.' });

const c8q = quiz('eei101-quiz-8', 'Quiz 8 — Sensors and signal transmission (sessions 49–54)|||Quiz 8 — Cảm biến và truyền tín hiệu (buổi 49–54)', [
  { id: 'q1', question: 'A thermistor senses which physical quantity?|||Nhiệt điện trở (thermistor) cảm nhận đại lượng vật lý nào?', options: ['Pressure|||Áp suất', 'Temperature|||Nhiệt độ', 'Light|||Ánh sáng', 'Magnetic field|||Từ trường'], correctIndex: 1, points: 1, explanation: 'A thermistor is a resistor whose value changes with temperature. Light is an LDR or photodiode; pressure is a strain gauge or piezoresistive sensor.|||Nhiệt điện trở là một điện trở có trị số thay đổi theo nhiệt độ. Ánh sáng thì dùng quang điện trở hoặc photodiode; áp suất thì dùng cảm biến biến dạng hoặc áp điện trở.' },
  { id: 'q2', question: 'Why is a relay or motor driven through a transistor rather than straight from a control output?|||Vì sao rơ-le hay động cơ phải lái qua transistor chứ không nối thẳng vào một đầu ra điều khiển?', options: ['Because the load needs a negative voltage|||Vì tải cần điện áp âm', 'Because the load draws more current than the output can supply|||Vì tải rút dòng lớn hơn mức đầu ra cấp được', 'Because the load is a digital signal|||Vì tải là một tín hiệu số', 'Because transistors reduce the voltage|||Vì transistor làm giảm điện áp'], correctIndex: 1, points: 1, explanation: 'A control output supplies a few milliamps; a relay coil or motor wants far more. The output drives a transistor or MOSFET, which switches the real current — and an inductive load also needs a flyback diode.|||Một đầu ra điều khiển cấp được vài miliampe; cuộn rơ-le hay động cơ cần nhiều hơn rất nhiều. Đầu ra đó lái một transistor hoặc MOSFET, và linh kiện này mới đóng cắt dòng thật — tải cảm còn cần thêm một diode dập xung.' },
  { id: 'q3', question: 'PWM at 75% duty cycle on a 12 V supply delivers an average voltage of about…|||PWM với chu kỳ nhiệm vụ 75% trên nguồn 12 V cấp ra điện áp trung bình khoảng…', options: ['3 V|||3 V', '6 V|||6 V', '9 V|||9 V', '12 V|||12 V'], correctIndex: 2, points: 1, explanation: 'Vavg = supply x duty = 12 x 0.75 = 9 V. At 25% duty it would be 3 V. The supply itself never changes — only the fraction of the time it is connected.|||Vavg = nguồn x chu kỳ nhiệm vụ = 12 x 0,75 = 9 V. Với duty 25% thì ra 3 V. Bản thân điện áp nguồn không hề đổi — chỉ đổi tỉ lệ thời gian nó được nối vào.' },
  { id: 'q4', question: 'In AM and FM, what does the modulation change?|||Trong AM và FM, phép điều chế thay đổi cái gì?', options: ['AM changes frequency, FM changes amplitude|||AM đổi tần số, FM đổi biên độ', 'AM changes the carrier\'s amplitude, FM changes its frequency|||AM đổi biên độ sóng mang, FM đổi tần số của nó', 'Both change the phase|||Cả hai đều đổi pha', 'Neither changes the carrier|||Cả hai đều không đổi sóng mang'], correctIndex: 1, points: 1, explanation: 'AM = amplitude modulation, FM = frequency modulation — the names say it. FM resists noise better, because most noise adds amplitude rather than shifting frequency.|||AM = điều chế biên độ, FM = điều chế tần số — chính cái tên đã nói. FM chống nhiễu tốt hơn, vì phần lớn nhiễu cộng thêm vào biên độ chứ không làm dịch tần số.' },
  { id: 'q5', question: 'What two steps turn an analogue signal into digital data?|||Hai bước nào biến một tín hiệu tương tự thành dữ liệu số?', options: ['Rectification and smoothing|||Chỉnh lưu và làm phẳng', 'Sampling and quantisation|||Lấy mẫu và lượng tử hoá', 'Modulation and demodulation|||Điều chế và giải điều chế', 'Amplification and filtering|||Khuếch đại và lọc'], correctIndex: 1, points: 1, explanation: 'Sampling takes the value at regular instants; quantisation rounds each value to the nearest of a finite set of levels. Rectification and smoothing belong to power supplies (chapter 8).|||Lấy mẫu là lấy giá trị tại các thời điểm cách đều; lượng tử hoá là làm tròn mỗi giá trị về mức gần nhất trong một tập hữu hạn mức. Chỉnh lưu và làm phẳng thuộc về bộ nguồn (chương 8).' },
  { id: 'q6', question: 'The session plan prints the CLO for sessions 52-54 as "CL01". What does that mean?|||Bảng kế hoạch in cột CLO của buổi 52-54 là "CL01". Điều đó nghĩa là gì?', options: ['A tenth CLO that is not in the CLO table|||Một CLO thứ mười không có trong bảng CLO', 'A typing slip for CLO1 — a digit zero instead of the letter O|||Một lỗi gõ của CLO1 — số không thay cho chữ O', 'It means "no CLO"|||Nó nghĩa là "không có CLO nào"', 'It means CLO1 and CLO10 together|||Nó nghĩa là CLO1 và CLO10 cùng lúc'], correctIndex: 1, points: 1, explanation: 'EEI101 has eight CLOs, CLO1 to CLO8, so "CL01" can only be CLO1 mistyped with a zero. This site keeps the original spelling visible and tells you about it rather than silently correcting the university\'s page.|||EEI101 có tám CLO, từ CLO1 tới CLO8, nên "CL01" chỉ có thể là CLO1 bị gõ lẫn số không. Web giữ nguyên cách viết gốc cho bạn thấy và nói rõ ra, thay vì âm thầm sửa trang của trường.' },
], 420);

/* ── Chương 13 — Lab 4, Progress test 2 &amp; thuyết trình (buổi 55–60) ──────── */
const k131 = khung('eei101-13-1-lab-4',
  '13.1 — Lab 4 (sessions 55–57)|||13.1 — Lab 4 (buổi 55–57)',
  'Buổi 55–57, All CLOs, 5% điểm môn: bài Lab cuối, ba buổi liền, sau khi đã học hết 14 chương; phủ được cả chuỗi cảm biến → chuẩn hoá → xử lý → lái tải; hình thức phụ thuộc Option 1 hay Option 2.',
  { s: '55–57', clo: 'All CLOs',
    flm: 'Lab 4',
    sach: 'chapters 1–14 (the whole course)',
    hEn: '13.1 — Lab 4 (three sessions)',
    hVi: '13.1 — Lab 4 (ba buổi liền)',
    lEn: 'the last Lab, worth <strong>5%</strong>, and the only one that comes after every chapter has been taught — so it can span the full chain: sensor, conditioning, logic or amplification, driver, load. Format follows Option 1 ("In LAB") or Option 2 ("Follow lecturer\'s proposal"), as always.',
    lVi: 'bài Lab cuối, đáng <strong>5%</strong>, và là bài duy nhất diễn ra sau khi đã dạy hết mọi chương — nên nó có thể phủ trọn chuỗi: cảm biến, chuẩn hoá tín hiệu, logic hoặc khuếch đại, tầng lái, tải. Hình thức theo Option 1 ("In LAB") hoặc Option 2 ("Follow lecturer\'s proposal"), như mọi lần.',
    dEn: 'build and characterise a small complete system rather than a single circuit — and reuse the report habits from Lab 1.',
    dVi: 'dựng và đặc tả được một hệ thống nhỏ hoàn chỉnh thay vì một mạch đơn lẻ — và dùng lại đúng các thói quen viết báo cáo từ Lab 1.' });

const k132 = khung('eei101-13-2-progress-test-2',
  '13.2 — Progress test 2 (session 58)|||13.2 — Progress test 2 (buổi 58)',
  'Buổi 58, All CLOs, 5% điểm môn: bài kiểm tra tiến độ thứ hai; Option 1 là 20 phút, 20-30 câu, 3-8 câu cho mỗi CLOx; phủ PT2: All CLOs, tức cả 14 chương, và là buổi có điểm cuối cùng trước hai buổi thuyết trình.',
  { s: '58', clo: 'All CLOs',
    flm: 'Progress test 2',
    sach: 'chapters 1–14 (the whole course)',
    hEn: '13.2 — Progress test 2',
    hVi: '13.2 — Progress test 2',
    lEn: 'the second Progress test, <strong>5%</strong>, and the last written mark before the final exam. FLM: <em>Option 1: 20\'/each</em>, <strong>20–30 questions</strong>, "3-8 for each CLOx", coverage "<strong>PT2: All CLOs</strong>" — by position that is all fourteen chapters. Treat it as the dress rehearsal for the final exam (60 minutes, 50 questions, completion criteria 4).',
    lVi: 'bài Progress test thứ hai, <strong>5%</strong>, và là đầu điểm viết cuối cùng trước kỳ thi cuối. FLM: <em>Option 1: 20 phút/bài</em>, <strong>20–30 câu</strong>, "3-8 câu cho mỗi CLOx", phạm vi "<strong>PT2: All CLOs</strong>" — theo vị trí thì là cả mười bốn chương. Hãy coi nó là buổi tổng duyệt cho kỳ thi cuối (60 phút, 50 câu, tiêu chí đạt 4).',
    dEn: 'use it as a diagnostic: whatever you get wrong here is what to revise for the 40% paper.',
    dVi: 'dùng nó như một phép chẩn đoán: chỗ nào sai ở đây chính là chỗ phải ôn cho bài thi 40%.' });

const k133 = khung('eei101-13-3-thuyet-trinh-nhom',
  '13.3 — Group presentation (sessions 59–60)|||13.3 — Thuyết trình nhóm (buổi 59–60)',
  'Buổi 59–60, All CLOs, 10% điểm môn: hai buổi thuyết trình nhóm, khoảng 15 phút mỗi nhóm; là đầu điểm duy nhất chạm được CLO8 (kỹ năng mềm); cấu trúc bài nói và cách trình bày số đo đã dựng ở bài 1.6.',
  { s: '59–60', clo: 'All CLOs',
    flm: 'Presentation',
    sach: 'chapters 1–14, plus the group\'s own chosen topic',
    hEn: '13.3 — Group presentation',
    hVi: '13.3 — Thuyết trình nhóm',
    lEn: 'the two presentation sessions the whole course points at. The mark is <strong>10%</strong> — the same as both Progress tests combined — at about <strong>15 minutes per group</strong>, tagged <strong>All CLOs</strong>, and it is the only mark that genuinely reaches <strong>CLO8</strong> (learning attitude, teamwork, communication, problem solving). The structure, the predicted-versus-measured table and the questions to ask your lecturer are all in <strong>lesson 1.6</strong>, which is finished — read it in week one, not week fourteen.',
    lVi: 'hai buổi thuyết trình mà cả môn hướng tới. Đầu điểm này là <strong>10%</strong> — bằng cả hai bài Progress test cộng lại — với khoảng <strong>15 phút mỗi nhóm</strong>, gắn <strong>All CLOs</strong>, và là đầu điểm duy nhất thật sự chạm tới <strong>CLO8</strong> (thái độ học tập, làm việc nhóm, giao tiếp, giải quyết vấn đề). Bố cục bài nói, bảng dự đoán-so-với-đo được và danh sách câu cần hỏi giảng viên đều nằm ở <strong>bài 1.6</strong>, bài đó đã viết xong — hãy đọc nó ở tuần một, đừng để tới tuần mười bốn.',
    dEn: 'present a circuit you built, measured and explained — and be the group whose slides show predictions next to measurements.',
    dVi: 'trình bày được một mạch bạn tự dựng, tự đo và tự giải thích — và là nhóm có slide đặt dự đoán cạnh số đo.' });

/* ═══════════════ EXPORT ═══════════════ */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'EEI101',
    slug: 'eei101-introduction-to-electrical-electronics-engineering',
    title: 'Introduction to Electrical-Electronics Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EEI101.webp',
    shortDescription: 'EEI101 on FLM syllabus 14452: all 60 sessions, 8 CLOs, five marks (20+10+20+10+40 = 100%), Tooley 3rd ed as the main text, three free browser simulators. Chapter 1 fully taught with checked calculations; chapters 2-13 are the framework.|||Nhập môn kỹ thuật điện - điện tử theo syllabus FLM 14452: đủ 60 buổi, 8 CLO, năm đầu điểm (20+10+20+10+40 = 100%), giáo trình chính Tooley bản 3rd, ba công cụ mô phỏng miễn phí. Chương 1 giảng đầy đủ, phép tính đã kiểm; chương 2-13 là khung.',
    description: 'Môn <strong>EEI101 — Introduction to Electrical-Electronics Engineering</strong> (Nhập môn kỹ thuật điện - điện tử), kỳ 1, 3 tín chỉ, 60 buổi. Web dựng lại môn này bám <strong>syllabus FLM 14452</strong> (QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026): <strong>Mục 0</strong> là khung chuẩn của trường — hồ sơ môn, năm đầu điểm (Assignment 20% · Group presentation 10% · Lab 20% · Progress tests 10% · Final exam 40% = 100%), tám CLO nguyên văn, bốn giáo trình (sách chính <em>Electronic Circuits: Fundamentals and Applications</em> của Mike Tooley, <strong>bản 3rd năm 2006</strong>, nằm trong thư viện TRẢ PHÍ books24x7) và ba công cụ mô phỏng miễn phí chạy trên trình duyệt, cùng bảng đủ <strong>60 buổi</strong> để bạn đối chiếu với bản trường phát. <strong>Chương 1 (buổi 1–9)</strong> đã giảng đầy đủ song ngữ: đơn vị SI, định luật Ohm, điện trường &amp; từ trường, đọc sơ đồ mạch, mô phỏng mạch (netlist, ba loại phân tích), đồng hồ vạn năng và dao động ký — mọi phép tính đều đã tự kiểm lại. <strong>Chương 2–13</strong> hiện là KHUNG: đúng tên bài, đúng buổi, đúng CLO, đúng mục sách — nội dung chi tiết bổ sung dần.',
    whatYouLearn: 'Khung môn theo FLM: đọc hiểu syllabus 14452, năm đầu điểm và trọng số, hai phương án Option 1 / Option 2 của mọi đầu điểm on-going, tám CLO, quy định dự ≥80% buổi, kế hoạch đủ 60 buổi. Chương 1 (đầy đủ): bảy đơn vị cơ bản SI và các đơn vị điện dẫn xuất, bảng tiền tố p/n/u/m/k/M/G và cách đổi không sai dấu phẩy, vật dẫn &amp; vật cách điện, áp/dòng/trở và định luật Ohm với ví dụ có số, ba công thức công suất và cách tự kiểm chéo, chọn điện trở hạn dòng cho LED, điện trường E = V/d và đánh xuyên, từ trường và mật độ từ thông B, đọc sơ đồ mạch và bộ chia áp, thí nghiệm V–I và lấy R từ độ nghiêng, công suất &amp; điện năng kWh, mô phỏng mạch (DC operating point / AC sweep / transient), đọc netlist SPICE, mô hình linh kiện lý tưởng so với thật, mô phỏng logic và các trạng thái X/Z, hằng số thời gian R–C và tần số cắt, bố cục một bài thuyết trình kỹ thuật, đồng hồ kim và hiệu ứng tải (sai 20%), đồng hồ số và độ phân giải, dao động ký (Vpp/Vpk/Vrms, chu kỳ, tần số, bẫy que x10), và sai số hệ thống so với sai số ngẫu nhiên. Khung chương 2–13: Lab 1–4, linh kiện thụ động, mạch DC &amp; AC, bán dẫn, bộ nguồn, khuếch đại &amp; op-amp, dao động &amp; mạch logic, cảm biến &amp; giao tiếp, truyền tín hiệu, hai Assignment, hai Progress test và thuyết trình nhóm.',
    requirements: 'Ô Pre-Requisite trên FLM ghi "Non" (bản gốc in đúng như vậy, gần như chắc là "None" bị thiếu chữ e) — không có môn tiên quyết. Web dạy môn này với giả định bạn CHƯA có nền điện tử. Cần toán phổ thông (đổi đơn vị, luỹ thừa 10, căn bậc hai) và một trình duyệt web: cả ba công cụ mô phỏng trường chỉ định — MultisimLive, Tinkercad, TINA — đều miễn phí và chạy online, không cần cài Proteus hay OrCAD. Giáo trình chính nằm trên thư viện trả phí books24x7 (cần tài khoản); bài 📚 Tài liệu có danh sách nguồn đọc miễn phí thay thế.',
  },
  sections: [
    { title: '📚 Resource hub — materials, free simulators & self-study path|||📚 Trung tâm tài liệu — giáo trình, công cụ mô phỏng miễn phí & lộ trình tự học',
      description: 'Bốn giáo trình FLM dạng thẻ (sách chính nằm trong thư viện TRẢ PHÍ), ba công cụ mô phỏng miễn phí chạy trên trình duyệt, cộng nguồn đọc miễn phí, video và lộ trình tự học do web gom thêm.',
      lessons: [taiLieu] },
    { title: 'Section 0 — Course framework from the FLM syllabus|||Mục 0 — Khung môn học theo syllabus FLM',
      description: 'Khung chuẩn 100% theo syllabus FLM 14452: hồ sơ môn (150h = 45h + 1h + 104h), 5 đầu điểm (20+10+20+10+40 = 100%) với hai phương án Option 1/Option 2, 8 CLO, 4 giáo trình & 3 công cụ, kế hoạch đủ 60 buổi, nhiệm vụ sinh viên.',
      lessons: [l01, l02, l03, l04, l05, l06, q0] },
    { title: 'Chapter 1 — Electrical fundamentals, simulation & measurement (sessions 1–9)|||Chương 1 — Điện cơ bản, mô phỏng mạch & thiết bị đo (buổi 1–9)',
      description: 'ĐẦY ĐỦ. Tooley chương 1, 2 và 3: đơn vị SI và tiền tố, áp/dòng/trở, định luật Ohm và công suất, điện trường & từ trường, đọc sơ đồ mạch, thí nghiệm V–I, mô phỏng mạch và netlist, mô phỏng logic, thuyết trình, đồng hồ vạn năng và hiệu ứng tải, dao động ký, sai số phép đo.',
      lessons: [l11, l12, l13, l14, l15, l16, l17, l18, l19, c1q] },
    { title: 'Chapter 2 — Lab 1 & passive components (sessions 10–15)|||Chương 2 — Lab 1 & linh kiện thụ động (buổi 10–15)',
      description: 'KHUNG. Lab 1 (buổi 10–12, 5%) và Tooley chương 4: điện trở và thông số, mã màu, điện dung và các loại tụ, cuộn cảm và xung ngược, thực hành khảo sát.',
      lessons: [k21, k22, k23, k24, c2q] },
    { title: 'Chapter 3 — D.C. and A.C. circuits (sessions 16–21)|||Chương 3 — Mạch DC và mạch AC (buổi 16–21)',
      description: 'KHUNG. Tooley chương 5 và 6: KCL/KVL, chia áp/chia dòng, Thevenin & Norton, mạch L–R–C và hằng số thời gian, sóng sin và RMS, điện kháng, hệ số công suất, cộng hưởng, biến áp.',
      lessons: [k31, k32, k33, k34, k35, k36, c3q] },
    { title: 'Chapter 4 — Lab 2 (sessions 22–24)|||Chương 4 — Lab 2 (buổi 22–24)',
      description: 'KHUNG. Bài Lab thứ hai, ba buổi liền, 5% điểm môn: mạng R, L, C, bộ chia áp, hằng số thời gian và đáp ứng tần số.',
      lessons: [k41] },
    { title: 'Chapter 5 — Semiconductors (sessions 25–26)|||Chương 5 — Bán dẫn (buổi 25–26)',
      description: 'KHUNG. Tooley chương 7: pha tạp N/P, tiếp giáp P–N và diode (0,7 V), Zener, BJT với Ic = beta x Ib, FET điều khiển bằng Vgs, chế tạo IC (hai buổi duy nhất mang CLO4).',
      lessons: [k51, k52, c4q] },
    { title: 'Chapter 6 — Power sources & supplies + Assignment 1 (sessions 27–33)|||Chương 6 — Nguồn & bộ nguồn + Assignment 1 (buổi 27–33)',
      description: 'KHUNG. Tooley chương 8 cộng Assignment 1 (buổi 30, 10%): chỉnh lưu và cầu diode, tụ trữ và gợn, ổn áp Zener/transistor/78xx, điện trở ra và độ ổn định, mạch nguồn thực tế, nguồn xung.',
      lessons: [k61, k62, k63, k64, k65, k66, k67, c5q] },
    { title: 'Chapter 7 — Progress test 1 (session 34)|||Chương 7 — Progress test 1 (buổi 34)',
      description: 'KHUNG. Bài kiểm tra tiến độ đầu tiên, 5% điểm môn: Option 1 là 20 phút, 20–30 câu, 3–8 câu mỗi CLOx, phạm vi ghi "All CLOs".',
      lessons: [k71] },
    { title: 'Chapter 8 — Amplifiers & operational amplifiers (sessions 35–39)|||Chương 8 — Khuếch đại & op-amp (buổi 35–39)',
      description: 'KHUNG. Tooley chương 9 và 10: các lớp khuếch đại, decibel và băng thông, hồi tiếp âm, phân cực và mạch tương đương, op-amp và hai quy tắc vàng, mạch đảo/không đảo, tích độ lợi-băng thông, ghép nhiều tầng.',
      lessons: [k81, k82, k83, k84, k85, c6q] },
    { title: 'Chapter 9 — Lab 3 (sessions 40–42)|||Chương 9 — Lab 3 (buổi 40–42)',
      description: 'KHUNG. Bài Lab thứ ba, ba buổi liền, 5% điểm môn: bài Lab đầu tiên có linh kiện chủ động — diode, transistor, một tầng op-amp.',
      lessons: [k91] },
    { title: 'Chapter 10 — Oscillators & logic circuits (sessions 43–48)|||Chương 10 — Mạch dao động & mạch logic (buổi 43–48)',
      description: 'KHUNG. Tooley chương 11 và 12: hồi tiếp dương và tiêu chuẩn Barkhausen, dao động RC/LC/thạch anh, mạch astable và IC 555, cổng logic và De Morgan, flip-flop, họ TTL và CMOS.',
      lessons: [k101, k102, k103, k104, k105, k106, c7q] },
    { title: 'Chapter 11 — Sensors & interfacing + Assignment 2 (sessions 49–51)|||Chương 11 — Cảm biến & giao tiếp + Assignment 2 (buổi 49–51)',
      description: 'KHUNG. Tooley chương 13 cộng Assignment 2 (buổi 51, 10%): hệ thống đo lường và điều khiển, bộ chuyển đổi và cảm biến, chuẩn hoá tín hiệu, lái tải và PWM, diode dập xung.',
      lessons: [k111, k112, k113] },
    { title: 'Chapter 12 — Wireless & wired signal transmission (sessions 52–54)|||Chương 12 — Truyền tín hiệu không dây & có dây (buổi 52–54)',
      description: 'KHUNG. Tooley chương 14: chuỗi phát-kênh-thu, sóng mang và băng thông, phổ điện từ, điều chế AM/FM/PM và ASK/FSK/PSK, lấy mẫu và lượng tử hoá, phát hiện lỗi. (Bản gốc in cột CLO là "CL01".)',
      lessons: [k121, k122, k123, c8q] },
    { title: 'Chapter 13 — Lab 4, Progress test 2 & the group presentation (sessions 55–60)|||Chương 13 — Lab 4, Progress test 2 & thuyết trình nhóm (buổi 55–60)',
      description: 'KHUNG. Lab 4 (buổi 55–57, 5%), Progress test 2 (buổi 58, 5%) và thuyết trình nhóm (buổi 59–60, 10%) — đầu điểm duy nhất chạm tới CLO8; cách chuẩn bị nằm ở bài 1.6.',
      lessons: [k131, k132, k133] },
  ],
};
