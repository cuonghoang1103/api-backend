/**
 * SDI101m — Introduction to Semiconductor Devices (Nhập môn thiết bị bán dẫn).
 * Kỳ 1, ngành Thiết kế vi mạch bán dẫn, 3 tín chỉ, 60 buổi.
 * ─────────────────────────────────────────────────────────────────────────────
 * KHUNG BÁM 100% SYLLABUS FLM 12239 (QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024, thu
 * 19/09/2026 từ flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=12239):
 *   Mục 0     = hồ sơ môn + 7 đầu điểm + 4 CLO + 4 giáo trình (BA cái là
 *               giáo trình CHÍNH) + đủ 60 buổi + nhiệm vụ SV.  ← ĐẦY ĐỦ.
 *   Chương 1  = buổi 1–11, TOÀN BỘ phần vật lý điện từ. ← ĐẦY ĐỦ, dạy được ngay.
 *   Chương 2–11 = KHUNG: đúng tên chương, đúng tên bài, đúng buổi/CLO,
 *               mỗi bài 3–6 dòng mốc nội dung. Bài giảng bổ sung sau.
 *
 * ⚠️ MÔN CHIA HAI NỬA: buổi 1–21 vật lý điện từ (CLO1, CLO2) · buổi 22–60 vật
 *    lý bán dẫn & linh kiện (CLO3, CLO4). Nói rõ ngay ở bài 0.1.
 *
 * CÁCH BỔ SUNG NỘI DUNG SAU NÀY: một bài khung là một lời gọi khung(...).
 * Thay lời gọi đó bằng doc(slug, title, desc, [[ '…EN…', '…VI…' ]]) — GIỮ
 * NGUYÊN slug và vị trí trong section là xong; không phải dựng lại cấu trúc.
 *
 * ⚠️ GIỮ NGUYÊN 18 slug cũ (sinh viên đã lưu link). Ánh xạ sang chỗ mới,
 *    chọn theo NỘI DUNG chứ không theo số hiệu chương:
 *      sdi101m-0-0-tai-lieu      → trung tâm tài liệu (giữ nguyên chỗ)
 *      sdi101m-0-1-overview      → 0.1 Hồ sơ môn học
 *      sdi101m-1-1-vat-lieu      → 4.2 Crystal Properties (buổi 23)
 *      sdi101m-2-1-hat-dan       → 5.1 Carrier Concentration (buổi 27)
 *      sdi101m-3-1-dong-dien     → 5.2 Drift of Carriers (buổi 28)
 *      sdi101m-4-1-pn-junction   → 6.1 p-n Junction (buổi 31)
 *      sdi101m-5-1-diode-ung-dung→ 6.5 Junction Capacitance & Application (35)
 *      sdi101m-6-1-bjt           → 7.5 Bipolar Junction Transistors 1 (buổi 41)
 *      sdi101m-7-1-mosfet        → 7.2 MOS Field-Effect Transistor 1 (buổi 38)
 *      sdi101m-8-1-ic            → 9.1 Integrated Circuit & Memory 1 (buổi 47)
 *      sdi101m-quiz-1..8         → quiz của các chương 4,5,5,6,8,7,7,9 theo chủ đề
 *
 * ⚠️ title ≤255 ký tự tính CẢ hai vế EN|||VI. course.shortDescription ≤500.
 * ⚠️ Trong chuỗi: KHÔNG backtick lồng, KHÔNG ${ }; "&" → "&amp;" trong HTML.
 * ⚠️ MỌI phép tính số của Chương 1 đã tự kiểm bằng python3 trước khi đưa vào
 *    bài (scratchpad/sdi101m/kiem.py — 70+ giá trị). Không con số nào là đoán.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SDI101m.mjs --apply
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions, timeLimitSeconds = 480) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds, questions } });

const NGUON = 'Nguồn: FLM · Syllabus 12239 · QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024';

/**
 * Bài KHUNG (chương 2 → hết). m = {
 *   s: '23' | '51–53'   số buổi FLM
 *   clo: 'CLO3'         cột CLO NGUYÊN VĂN của FLM
 *   flm: chủ đề buổi NGUYÊN VĂN tiếng Anh của FLM
 *   sach: mục giáo trình gợi ý (Streetman chương/KAIST khoá) — của web, ghi rõ
 *   hEn/hVi: tiêu đề bài · lEn/lVi: học gì · dEn/dVi: sau buổi làm được gì
 * }
 * Cố tình KHÔNG dùng template literal lồng ở đây (luật: không ${ } trong chuỗi).
 */
const khung = (slug, title, desc, m) => doc(slug, title, desc, [[
  '<span class="eyebrow">SDI101m · Session ' + m.s + ' · ' + m.clo + '</span>\n'
  + '<h2>' + m.hEn + '</h2>\n'
  + '<p class="lead">Framework page. The session number, the CLO and the outcome below are fixed from the FLM syllabus; the full teaching text, the worked numbers and the exercises are being written.</p>\n'
  + '<p class="nhan">' + NGUON + ' · session ' + m.s + ' — "' + m.flm + '"</p>\n'
  + '<ul>\n'
  + '<li><strong>Session</strong> ' + m.s + ' · <strong>' + m.clo + '</strong> — exactly as published by FLM.</li>\n'
  + '<li><strong>Reading</strong> — ' + m.sach + ' <span class="ghi-chu">(this mapping is CuongThai\'s, not FLM\'s — the syllabus does not say which chapter belongs to which session)</span></li>\n'
  + '<li><strong>What this session covers</strong> — ' + m.lEn + '</li>\n'
  + '<li><strong>What you can do afterwards</strong> — ' + m.dEn + '</li>\n'
  + '</ul>\n'
  + '<div class="note-ct">This page is a <strong>framework</strong> for now — deliberately, not by accident. What is already correct and will not move: the session number, the CLO and the FLM topic line. What comes later: the physics, the worked numbers, the traps and the exercises. <strong>Chapter 1 (sessions 1–11) is finished</strong> — open it to see what a completed lesson here looks like.</div>',
  '<span class="eyebrow">SDI101m · Buổi ' + m.s + ' · ' + m.clo + '</span>\n'
  + '<h2>' + m.hVi + '</h2>\n'
  + '<p class="lead">Bài khung. Số buổi, CLO và chuẩn đầu ra dưới đây đã chốt theo syllabus FLM; phần giảng chi tiết, số liệu tính tay và bài tập sẽ bổ sung sau.</p>\n'
  + '<p class="nhan">' + NGUON + ' · buổi ' + m.s + ' — "' + m.flm + '"</p>\n'
  + '<ul>\n'
  + '<li><strong>Buổi</strong> ' + m.s + ' · <strong>' + m.clo + '</strong> — đúng như bản trường công bố.</li>\n'
  + '<li><strong>Đọc gì</strong> — ' + m.sach + ' <span class="ghi-chu">(ánh xạ này do CuongThai đề xuất, KHÔNG phải của FLM — syllabus không nói buổi nào đọc chương nào)</span></li>\n'
  + '<li><strong>Buổi này học gì</strong> — ' + m.lVi + '</li>\n'
  + '<li><strong>Học xong làm được gì</strong> — ' + m.dVi + '</li>\n'
  + '</ul>\n'
  + '<div class="note-ct">Bài này đang là <strong>khung</strong> — có chủ đích, không phải bỏ sót. Phần đã đúng và sẽ không đổi: số buổi, CLO, dòng chủ đề nguyên văn của FLM. Phần bổ sung sau: vật lý, ví dụ tính số, bẫy thường gặp, bài tập. <strong>Chương 1 (buổi 1–11) đã viết xong đầy đủ</strong> — mở ra xem một bài hoàn chỉnh của web trông thế nào.</div>',
]]);

/* ════════════════════════════════════════════════════════════════════════════
 * KẾ HOẠCH 60 BUỔI — NGUYÊN BẢN FLM (bài 0.5 dựng bảng từ mảng này)
 * [số buổi, chủ đề tiếng Anh NGUYÊN VĂN, dịch tiếng Việt, cột CLO NGUYÊN VĂN,
 *  bài trên web]
 * ⚠️ KHÔNG sửa cột chủ đề và cột CLO — sinh viên phải đối chiếu được với bản
 *    trường phát. Buổi 9 bản gốc ghi "CLO 1" (CÓ DẤU CÁCH) — giữ nguyên, nêu ở
 *    bài 0.3 và 0.5.
 * ══════════════════════════════════════════════════════════════════════════ */
const BUOI = [
  ['1', 'Course Introduction; Measurement', 'Giới thiệu môn học; Đo lường', 'CLO1', '1.1'],
  ['2', "Coulomb's Law", 'Định luật Coulomb', 'CLO1', '1.2'],
  ['3', 'Electric Fields', 'Điện trường', 'CLO1', '1.3'],
  ['4', "Gauss' Law", 'Định luật Gauss', 'CLO1', '1.4'],
  ['5', 'Electric Potential', 'Điện thế', 'CLO1', '1.5'],
  ['6', 'Capacitance', 'Điện dung', 'CLO1', '1.6'],
  ['7', 'Current and Resistance', 'Dòng điện và điện trở', 'CLO1', '1.7'],
  ['8', 'Electrical Circuits', 'Mạch điện', 'CLO1', '1.8'],
  ['9', 'Magnetic Fields', 'Từ trường', 'CLO 1', '1.9'],
  ['10', 'Inductance and Alternating Current', 'Điện cảm và dòng điện xoay chiều', 'CLO1', '1.10'],
  ['11', 'Electromagnetic Waves', 'Sóng điện từ', 'CLO1', '1.11'],
  ['12', 'Assignment 1', 'Bài tập lớn 1', 'CLO1', '2.1'],
  ['13', 'Assignment 1', 'Bài tập lớn 1', 'CLO1', '2.1'],
  ['14', 'Assignment 1', 'Bài tập lớn 1', 'CLO1', '2.1'],
  ['15', 'Progress Test 1', 'Kiểm tra tiến độ 1', 'CLO1, CLO2', '2.2'],
  ['16', 'LAB 1: RLC CIRCUITS — 1', 'LAB 1: MẠCH RLC — 1', 'CLO1, CLO2', '3.1'],
  ['17', 'LAB 1: RLC CIRCUITS — 2', 'LAB 1: MẠCH RLC — 2', 'CLO1, CLO2', '3.1'],
  ['18', 'LAB 1: RLC CIRCUITS — 3', 'LAB 1: MẠCH RLC — 3', 'CLO1, CLO2', '3.2'],
  ['19', 'LAB 1: RLC CIRCUITS — 4', 'LAB 1: MẠCH RLC — 4', 'CLO1, CLO2', '3.2'],
  ['20', 'LAB 1: RLC CIRCUITS — 5', 'LAB 1: MẠCH RLC — 5', 'CLO1, CLO2', '3.3'],
  ['21', 'LAB 1: RLC CIRCUITS — 6', 'LAB 1: MẠCH RLC — 6', 'CLO1, CLO2', '3.3'],
  ['22', 'Overview, Semiconductor History &amp; Industry', 'Tổng quan, lịch sử &amp; ngành công nghiệp bán dẫn', 'CLO3', '4.1'],
  ['23', 'Crystal Properties', 'Tính chất tinh thể', 'CLO3', '4.2'],
  ['24', 'Atoms, Electrons and Schrodinger Equation', 'Nguyên tử, electron và phương trình Schrödinger', 'CLO3', '4.3'],
  ['25', 'Energy Bands', 'Dải năng lượng', 'CLO3', '4.4'],
  ['26', 'Intrinsic vs Extrinsic Semiconductor', 'Bán dẫn thuần và bán dẫn pha tạp', 'CLO3', '4.5'],
  ['27', 'Carrier Concentration', 'Nồng độ hạt tải điện', 'CLO3', '5.1'],
  ['28', 'Drift of Carriers in Electric and Magnetic Fields', 'Sự trôi của hạt tải trong điện trường và từ trường', 'CLO3', '5.2'],
  ['29', 'Optical Absorption and Luminescence', 'Hấp thụ quang và phát quang', 'CLO3', '5.3'],
  ['30', 'Diffusion of Carriers', 'Khuếch tán của hạt tải', 'CLO3', '5.4'],
  ['31', 'p-n Junction', 'Chuyển tiếp p-n', 'CLO3', '6.1'],
  ['32', 'p-n Junction Electrostatics', 'Tĩnh điện của chuyển tiếp p-n', 'CLO3', '6.2'],
  ['33', 'Current Flow at p-n Junction — Forward and Reverse-Biased Junctions', 'Dòng qua chuyển tiếp p-n — phân cực thuận và phân cực nghịch', 'CLO3', '6.3'],
  ['34', 'Current Flow at p-n Junction — Forward and Reverse-Biased Junctions (continue)', 'Dòng qua chuyển tiếp p-n — phân cực thuận và nghịch (tiếp)', 'CLO3', '6.4'],
  ['35', 'Junction Capacitance &amp; p-n Junction Application; p-n junction Fabrication', 'Điện dung chuyển tiếp &amp; ứng dụng chuyển tiếp p-n; chế tạo chuyển tiếp p-n', 'CLO3', '6.5'],
  ['36', 'Metal–Semiconductor Junctions', 'Chuyển tiếp kim loại–bán dẫn', 'CLO3', '6.6'],
  ['37', 'Transistor Operation and The Junction FET', 'Hoạt động của transistor và JFET (FET chuyển tiếp)', 'CLO3', '7.1'],
  ['38', 'MOS Field-Effect Transistor — 1', 'Transistor hiệu ứng trường MOS — 1', 'CLO3', '7.2'],
  ['39', 'MOS Field-Effect Transistor — 2', 'Transistor hiệu ứng trường MOS — 2', 'CLO3', '7.3'],
  ['40', 'MOS Field-Effect Transistor — 3', 'Transistor hiệu ứng trường MOS — 3', 'CLO3', '7.4'],
  ['41', 'Bipolar Junction Transistors — 1', 'Transistor lưỡng cực (BJT) — 1', 'CLO3', '7.5'],
  ['42', 'Bipolar Junction Transistors — 2', 'Transistor lưỡng cực (BJT) — 2', 'CLO3', '7.6'],
  ['43', 'Optoelectronic Devices — 1', 'Linh kiện quang điện tử — 1', 'CLO3', '8.1'],
  ['44', 'Optoelectronic Devices — 2', 'Linh kiện quang điện tử — 2', 'CLO3', '8.2'],
  ['45', 'CMOS Technology — 1', 'Công nghệ CMOS — 1', 'CLO3', '8.3'],
  ['46', 'CMOS Technology — 2', 'Công nghệ CMOS — 2', 'CLO3', '8.4'],
  ['47', 'Integrated Circuit &amp; Memory — 1', 'Mạch tích hợp &amp; bộ nhớ — 1', 'CLO3', '9.1'],
  ['48', 'Integrated Circuit &amp; Memory — 2', 'Mạch tích hợp &amp; bộ nhớ — 2', 'CLO3', '9.2'],
  ['49', 'Introduction of AI Chip — 1', 'Nhập môn chip AI — 1', 'CLO3', '9.3'],
  ['50', 'Introduction of AI Chip — 2', 'Nhập môn chip AI — 2', 'CLO3', '9.4'],
  ['51', 'Assignment 2', 'Bài tập lớn 2', 'CLO3', '10.1'],
  ['52', 'Assignment 2', 'Bài tập lớn 2', 'CLO3', '10.1'],
  ['53', 'Assignment 2', 'Bài tập lớn 2', 'CLO3', '10.1'],
  ['54', 'Progress Test 2', 'Kiểm tra tiến độ 2', 'CLO3, CLO4', '10.2'],
  ['55', 'LAB 2: Semiconductors — 1', 'LAB 2: Bán dẫn — 1', 'CLO3, CLO4', '11.1'],
  ['56', 'LAB 2: Semiconductors — 2', 'LAB 2: Bán dẫn — 2', 'CLO3, CLO4', '11.1'],
  ['57', 'LAB 2: Semiconductors — 3', 'LAB 2: Bán dẫn — 3', 'CLO3, CLO4', '11.2'],
  ['58', 'LAB 2: Semiconductors — 4', 'LAB 2: Bán dẫn — 4', 'CLO3, CLO4', '11.2'],
  ['59', 'LAB 2: Semiconductors — 5', 'LAB 2: Bán dẫn — 5', 'CLO3, CLO4', '11.3'],
  ['60', 'LAB 2: Semiconductors — 6', 'LAB 2: Bán dẫn — 6', 'CLO3, CLO4', '11.3'],
];

/** Dựng thân bảng 60 buổi. Cố tình không dùng template literal (luật không ${ }). */
const hangBuoi = (viet) => BUOI.map((r) => '    <tr><td>' + r[0] + '</td><td>' + r[1] + '</td>'
  + (viet ? '<td>' + r[2] + '</td>' : '')
  + '<td>' + r[3] + '</td><td><strong>' + r[4] + '</strong></td></tr>').join('\n');

/* ════════════════════════════════════════════════════════════════════════════
 * THẺ SÁCH — 4 dòng bảng Materials của FLM. Luật 20/09/2026: sách phải là THẺ
 * BẤM ĐƯỢC, không viết link như chữ thường (_HOP-DONG-SOAN-BAI.md § SÁCH).
 * ⚠️ BA dòng đầu đều Is Main Material = True → môn này có BA giáo trình chính.
 * ⚠️ Streetman và Halliday không có URL trên FLM → the-sach khong-link, KHÔNG
 *    có .sach-nut (đừng giả vờ bấm được).
 * ══════════════════════════════════════════════════════════════════════════ */
const SACH_STREETMAN = (en) => '<div class="the-sach khong-link">'
  + '<span class="sach-ico">📘</span><span class="sach-than">'
  + '<span class="sach-ten">Solid State Electronic Devices</span>'
  + '<span class="sach-phu">Ben G. Streetman, Sanjay Kumar Banerjee · Pearson/Prentice Hall · 2015 · 7th ed · ISBN 9780132017206 / 0132017202</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">' + (en ? 'Main textbook' : 'Giáo trình chính') + '</span>'
  + '<span class="sach-nhan giay">' + (en ? 'Print only — no link on FLM' : 'Sách giấy — FLM không có link') + '</span></span></span></div>';
const SACH_KAIST1 = (en) => '<a class="the-sach chinh" href="https://www.coursera.org/learn/semiconductor-1" target="_blank" rel="noopener">'
  + '<span class="sach-ico">🎓</span><span class="sach-than">'
  + '<span class="sach-ten">Semiconductor Physics and Devices 1</span>'
  + '<span class="sach-phu">Korea Advanced Institute of Science and Technology (KAIST) · Coursera · '
  + (en ? 'audit for free; you pay only if you want the certificate' : 'học (audit) miễn phí, chỉ trả tiền nếu muốn lấy chứng chỉ') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">' + (en ? 'Main textbook' : 'Giáo trình chính') + '</span>'
  + '<span class="sach-nhan mien-phi">' + (en ? 'Free to audit' : 'Học miễn phí (audit)') + '</span></span></span>'
  + '<span class="sach-nut">' + (en ? 'Open the course →' : 'Mở khoá học →') + '</span></a>';
const SACH_KAIST2 = (en) => '<a class="the-sach chinh" href="https://www.coursera.org/learn/semiconductor-2" target="_blank" rel="noopener">'
  + '<span class="sach-ico">🎓</span><span class="sach-than">'
  + '<span class="sach-ten">Semiconductor Physics and Devices 2</span>'
  + '<span class="sach-phu">Korea Advanced Institute of Science and Technology (KAIST) · Coursera · '
  + (en ? 'audit for free; you pay only if you want the certificate' : 'học (audit) miễn phí, chỉ trả tiền nếu muốn lấy chứng chỉ') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">' + (en ? 'Main textbook' : 'Giáo trình chính') + '</span>'
  + '<span class="sach-nhan mien-phi">' + (en ? 'Free to audit' : 'Học miễn phí (audit)') + '</span></span></span>'
  + '<span class="sach-nut">' + (en ? 'Open the course →' : 'Mở khoá học →') + '</span></a>';
const SACH_HALLIDAY = (en) => '<div class="the-sach khong-link">'
  + '<span class="sach-ico">📙</span><span class="sach-than">'
  + '<span class="sach-ten">Principles of Physics</span>'
  + '<span class="sach-phu">David Halliday, Robert Resnick, Jearl Walker · Wiley · 2011 · 9th ed · ISBN 9780470561584</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">' + (en ? 'Reference' : 'Tham khảo') + '</span>'
  + '<span class="sach-nhan giay">' + (en ? 'Print only — no link on FLM' : 'Sách giấy — FLM không có link') + '</span></span></span></div>';
const KHOI_SACH = (en) => '<div class="khoi-sach">\n' + SACH_STREETMAN(en) + '\n' + SACH_KAIST1(en) + '\n' + SACH_KAIST2(en) + '\n' + SACH_HALLIDAY(en) + '\n</div>';

/* ═══════════════ 📚 TRUNG TÂM TÀI LIỆU (web bổ sung) ═══════════════ */
const taiLieu = doc('sdi101m-0-0-tai-lieu',
  '📚 Resource hub: the 4 FLM materials + free tools|||📚 Trung tâm tài liệu: 4 giáo trình FLM + công cụ miễn phí',
  'Bốn tài liệu FLM dạng thẻ bấm được (ba là giáo trình CHÍNH: Streetman + hai khoá KAIST trên Coursera), cộng tài liệu tra cứu, mô phỏng nanoHUB/Falstad, video và lộ trình tự học do web gom thêm. Danh sách chính thức đầy đủ từng trường ở bài 0.4.',
  [[
    `<span class="eyebrow">SDI101m · Resource hub</span>
<h2>Everything the university names, plus what helps</h2>
<p class="lead">SDI101m is unusual: <strong>three of its four materials are marked "Is Main Material = True"</strong> — one printed book and two full Coursera courses from KAIST. Tap a card to open it.</p>
` + KHOI_SACH(true) + `
<p class="nhan">` + NGUON + ` — the four rows of the Materials table. Full field-by-field list in lesson 0.4.</p>
<div class="callout warn"><strong>Read the Coursera labels exactly.</strong> Both KAIST courses can be <em>audited</em> — watched and studied — for free. You pay only if you want the certificate. So "free" and "paid" are both wrong as one-word answers; the truth is <strong>free to learn, paid to certify</strong>.</div>
<div class="note-ct">Everything below this line is added by CuongThai and is <strong>not</strong> part of the FLM syllabus. Use it to get better, not to replace what your lecturer asks for.</div>
<h3>The syllabus names no tools at all</h3>
<p>The Tools field of syllabus 12239 is <strong>empty</strong> — and that is surprising, because the course contains two LAB blocks (sessions 16–21 and 55–60). We will not guess a software name the university did not publish. Ask your lecturer in session 1 which instrument or simulator the labs use. What follows is our own list of free things that help you learn the physics; none of it is required.</p>
<h3>Simulators — see the physics move</h3>
<ul>
<li><a href="https://nanohub.org/" target="_blank" rel="noopener">nanoHUB (Purdue)</a> — free browser tools for p-n junctions, MOS capacitors and MOSFETs, plus recorded device-physics lectures.</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — RLC circuits, diodes and transistors animated with moving charge. The fastest way to prepare for LAB 1.</li>
<li><a href="https://phet.colorado.edu/en/simulations/filter?subjects=physics" target="_blank" rel="noopener">PhET (Colorado)</a> — electric fields, capacitors, Ohm's law and circuit construction, all interactive.</li>
</ul>
<h3>Reference you will use every week</h3>
<ul>
<li><a href="https://www.ioffe.ru/SVA/NSM/Semicond/" target="_blank" rel="noopener">Ioffe NSM Archive</a> — the standard free table of semiconductor constants (band gap, mobility, permittivity for Si, Ge, GaAs…).</li>
<li><a href="https://physics.nist.gov/cuu/Constants/" target="_blank" rel="noopener">NIST fundamental constants</a> — the authoritative values of q, ε₀, k, h. Use these, not a rounded number from a slide.</li>
<li><a href="https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/" target="_blank" rel="noopener">MIT OCW 6.012 Microelectronic Devices</a> — free lecture notes and problem sets covering sessions 22–50.</li>
</ul>
<h3>Video, when reading is not enough</h3>
<ul>
<li><a href="https://www.youtube.com/@jordanedmundsPhysics" target="_blank" rel="noopener">Jordan Edmunds</a> — semiconductor physics worked out on a whiteboard, in the same order as the second half of this course.</li>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — electromagnetism and circuits with real instruments; good for sessions 7–10.</li>
<li><a href="https://www.youtube.com/@Asianometry" target="_blank" rel="noopener">Asianometry</a> — the semiconductor <em>industry</em>: fabs, lithography, memory, AI chips. Background for sessions 22 and 49–50.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Sessions 1–11</strong> — electromagnetism. Every formula here reappears inside a device later: Gauss' law becomes the depletion region, capacitance becomes the MOS gate, drift becomes mobility.</li>
<li><strong>Sessions 12–15</strong> — Assignment 1 (10%) and Progress Test 1 (15%). A quarter of your grade, decided before the semiconductor half even starts.</li>
<li><strong>Sessions 16–21</strong> — LAB 1, RLC circuits. 270 minutes of bench work for 5%.</li>
<li><strong>Sessions 22–36</strong> — crystals, bands, carriers, then the p-n junction. The junction is the hinge of the whole course.</li>
<li><strong>Sessions 37–50</strong> — transistors (JFET, MOSFET, BJT), optoelectronics, CMOS, IC/memory and AI chips.</li>
<li><strong>Sessions 51–60</strong> — Assignment 2, Progress Test 2, then LAB 2.</li>
</ol></div>`,
    `<span class="eyebrow">SDI101m · Trung tâm tài liệu</span>
<h2>Mọi thứ trường chỉ định, cộng thứ giúp bạn học được</h2>
<p class="lead">SDI101m có một chỗ khác thường: <strong>ba trong bốn tài liệu đều được đánh dấu "Is Main Material = True"</strong> — một cuốn sách in và hai khoá Coursera đầy đủ của KAIST. Bấm vào thẻ để mở.</p>
` + KHOI_SACH(false) + `
<p class="nhan">` + NGUON + ` — bốn dòng của bảng Materials. Danh sách chính thức đủ từng trường ở bài 0.4.</p>
<div class="callout warn"><strong>Đọc đúng nhãn của hai khoá Coursera.</strong> Cả hai khoá KAIST đều <em>học (audit) MIỄN PHÍ</em> — xem và học được hết. Chỉ trả tiền nếu muốn lấy chứng chỉ. Nên nói "miễn phí" cộc lốc là sai, mà nói "trả phí" cũng sai; sự thật là <strong>học miễn phí, lấy chứng chỉ mới trả tiền</strong>.</div>
<div class="note-ct">Mọi thứ dưới vạch này do CuongThai thêm vào và <strong>không</strong> thuộc syllabus FLM. Dùng để giỏi hơn, không dùng thay cho thứ giảng viên yêu cầu.</div>
<h3>Syllabus KHÔNG chỉ định công cụ nào</h3>
<p>Ô Tools của syllabus 12239 <strong>để TRỐNG</strong> — và đó là chỗ đáng ngạc nhiên, vì môn này có hai khối LAB (buổi 16–21 và 55–60). Web KHÔNG đoán tên phần mềm mà trường không công bố. Hãy hỏi giảng viên ngay buổi 1 xem LAB dùng thiết bị đo hay phần mềm mô phỏng nào. Dưới đây là danh sách riêng của web, toàn thứ miễn phí giúp bạn hiểu vật lý; không cái nào là bắt buộc.</p>
<h3>Mô phỏng — xem vật lý chuyển động</h3>
<ul>
<li><a href="https://nanohub.org/" target="_blank" rel="noopener">nanoHUB (Purdue)</a> — công cụ chạy trên trình duyệt, miễn phí, mô phỏng chuyển tiếp p-n, tụ MOS và MOSFET; kèm bài giảng vật lý linh kiện.</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — mạch RLC, diode và transistor có hoạt hình dòng điện tích chạy. Cách nhanh nhất để chuẩn bị cho LAB 1.</li>
<li><a href="https://phet.colorado.edu/en/simulations/filter?subjects=physics" target="_blank" rel="noopener">PhET (Colorado)</a> — điện trường, tụ điện, định luật Ohm và dựng mạch, tất cả đều tương tác được.</li>
</ul>
<h3>Tài liệu tra cứu dùng gần như mỗi tuần</h3>
<ul>
<li><a href="https://www.ioffe.ru/SVA/NSM/Semicond/" target="_blank" rel="noopener">Ioffe NSM Archive</a> — bảng hằng số bán dẫn miễn phí chuẩn nhất (khe cấm, độ linh động, hằng số điện môi của Si, Ge, GaAs…).</li>
<li><a href="https://physics.nist.gov/cuu/Constants/" target="_blank" rel="noopener">Hằng số cơ bản NIST</a> — giá trị chính thức của q, ε₀, k, h. Hãy dùng các giá trị này, đừng dùng số đã làm tròn trên một slide.</li>
<li><a href="https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2009/" target="_blank" rel="noopener">MIT OCW 6.012 Microelectronic Devices</a> — bài giảng và bài tập miễn phí, phủ đúng buổi 22–50.</li>
</ul>
<h3>Video, khi đọc chưa đủ</h3>
<ul>
<li><a href="https://www.youtube.com/@jordanedmundsPhysics" target="_blank" rel="noopener">Jordan Edmunds</a> — vật lý bán dẫn giải trên bảng, cùng thứ tự với nửa sau của môn này.</li>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — điện từ và mạch điện với thiết bị thật; tốt cho buổi 7–10.</li>
<li><a href="https://www.youtube.com/@Asianometry" target="_blank" rel="noopener">Asianometry</a> — <em>ngành</em> bán dẫn: nhà máy, quang khắc, bộ nhớ, chip AI. Nền cho buổi 22 và 49–50.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Buổi 1–11</strong> — vật lý điện từ. Mọi công thức ở đây sẽ quay lại bên trong một linh kiện: định luật Gauss thành vùng nghèo, điện dung thành cực cổng MOS, dòng trôi thành độ linh động.</li>
<li><strong>Buổi 12–15</strong> — Assignment 1 (10%) và Progress Test 1 (15%). Một phần tư điểm môn, chốt xong trước khi nửa bán dẫn bắt đầu.</li>
<li><strong>Buổi 16–21</strong> — LAB 1, mạch RLC. 270 phút làm việc trên bàn thí nghiệm để lấy 5%.</li>
<li><strong>Buổi 22–36</strong> — tinh thể, dải năng lượng, hạt tải, rồi chuyển tiếp p-n. Chuyển tiếp là bản lề của cả môn.</li>
<li><strong>Buổi 37–50</strong> — transistor (JFET, MOSFET, BJT), linh kiện quang, CMOS, IC/bộ nhớ và chip AI.</li>
<li><strong>Buổi 51–60</strong> — Assignment 2, Progress Test 2, rồi LAB 2.</li>
</ol></div>`,
  ]]);

/* ════════════════════════════════════════════════════════════════════════════
 * MỤC 0 — KHUNG MÔN HỌC THEO SYLLABUS FLM 12239 (phải đúng từng con số)
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── 0.1 Hồ sơ môn (slug cũ: sdi101m-0-1-overview) ────────────────────────── */
const l01 = { ...doc('sdi101m-0-1-overview',
  '0.1 — Course profile: SDI101m on the FLM syllabus|||0.1 — Hồ sơ môn học: SDI101m trên syllabus FLM',
  'Mã môn, 3 tín chỉ, bậc Bachelor, thang điểm 10, phân bổ 150 giờ (45h/60 buổi + 1h thi + 104h tự học), ô tiên quyết TRỐNG, phương pháp dạy-học, QĐ 1286/QĐ-ĐHFPT và link FLM sylID 12239; và điều quan trọng nhất: môn chia HAI NỬA rõ rệt.',
  [[
    `<span class="eyebrow">SDI101m · Section 0 · Lesson 0.1</span>
<h2>Course profile — straight from the FLM syllabus</h2>
<p class="lead">Every number on this page is copied from FLM syllabus 12239. Nothing here is our interpretation, and where the university's form is blank we say so instead of filling it in.</p>
<p class="nhan">` + NGUON + `</p>
<div class="callout"><span class="badge">Read this first</span> <strong>SDI101m is two courses in one coat.</strong> Sessions <strong>1–21</strong> are classical <strong>electromagnetism</strong> — charge, field, potential, capacitance, current, circuits, magnetism, waves — tagged <strong>CLO1</strong> and <strong>CLO2</strong>. Sessions <strong>22–60</strong> are <strong>semiconductor physics and devices</strong> — crystals, bands, carriers, the p-n junction, MOSFET, BJT, CMOS, memory, AI chips — tagged <strong>CLO3</strong> and <strong>CLO4</strong>. This is the entry course of the <strong>semiconductor IC design</strong> major, and the first half exists because none of the second half can be understood without it.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Subject code</span><span class="v">SDI101m</span></div>
  <div class="kv"><span class="k">Syllabus name</span><span class="v">Introduction to Semiconductor Devices_Nhập môn thiết bị bán dẫn</span></div>
  <div class="kv"><span class="k">Course name (English)</span><span class="v">Introduction to Semiconductor Devices</span></div>
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Degree level</span><span class="v">Bachelor</span></div>
  <div class="kv"><span class="k">Scoring scale</span><span class="v">10</span></div>
  <div class="kv"><span class="k">Min average mark to pass</span><span class="v">5</span></div>
  <div class="kv"><span class="k">Is scored</span><span class="v">True</span></div>
  <div class="kv"><span class="k">Pre-requisite</span><span class="v">blank on FLM — the university publishes nothing here</span></div>
  <div class="kv"><span class="k">Time allocation</span><span class="v">45h (60 sessions) contact hours + 1h final exam + 104h self-study</span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60</span></div>
  <div class="kv"><span class="k">Tools</span><span class="v">blank on FLM — no tool or software is published</span></div>
  <div class="kv"><span class="k">Learning-Teaching Method</span><span class="v">Inquiry-Based Learning, In-class lecture, Active Learning</span></div>
  <div class="kv"><span class="k">Decision No.</span><span class="v">1286/QĐ-ĐHFPT dated 11/22/2024</span></div>
  <div class="kv"><span class="k">Approved</span><span class="v">11/22/2024 · IsApproved: True · IsActive: True</span></div>
  <div class="kv"><span class="k">Syllabus ID</span><span class="v">12239</span></div>
  <div class="kv"><span class="k">Verify it yourself</span><span class="v"><a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=12239" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=12239</a></span></div>
</div>
<h3>What the syllabus says the course is</h3>
<p>The Description field opens with one sentence and then two bullets — quoted:</p>
<ul>
<li>"The course includes two parts."</li>
<li>"The first part covers a sufficient understanding of fundamental physics concepts about electromagnetism. This part explores the principles of electromagnetism, such as electromagnetic field, current, potential, capacitance, resistance, circuit..."</li>
<li>"The second part of this course aims to provide a general understanding of semiconductor devices. This part explores the principles and the operation mechanism of semiconductor, such as charge transfer, p-n junction, junction capacitors, and Metal-Oxide-Semiconductor Field Effect Transistors (MOSFETs), the Metal-Semiconductor Contact, Metal-Oxide-Semiconductor (MOS) capacitor, CMOS, Metal-Semiconductor Field Effect Transistors (MESFETs), Memory and Bipolar Junction Transistor (BJT) to improve the overall knowledge of semiconductor industry."</li>
</ul>
<div class="callout warn"><strong>The Description names MESFETs, and the 60-session plan does not.</strong> The nearest sessions are 36 (Metal–Semiconductor Junctions) and 37 (Transistor Operation and The Junction FET). We report both facts and change neither: the syllabus text mentions MESFET, the session table does not contain the word. Ask your lecturer whether MESFETs are examinable.</div>
<h3>Where the 150 hours go</h3>
<p>Time Allocation, verbatim: <em>45h (60 sessions) contact hours + 1h final exam + 104h self-study.</em></p>
<table>
  <thead><tr><th>Block</th><th>Hours</th><th>Share</th></tr></thead>
  <tbody>
    <tr><td>Contact hours (60 sessions)</td><td>45</td><td>30%</td></tr>
    <tr><td>Self-study</td><td>104</td><td>69.3%</td></tr>
    <tr><td>Final exam</td><td>1</td><td>0.7%</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>
  </tbody>
</table>
<div class="note-ct">Two arithmetic checks <strong>we</strong> did on those figures (not statements from FLM): the three blocks add to exactly <strong>150h</strong>, so the reading above is the right one; and 45 contact hours over 60 sessions is <strong>45 minutes of class per session</strong>. So the syllabus budgets <strong>104 self-study hours against 45 contact hours — about 2.3 hours at home for every hour in class</strong>. A physics course with this much formula work cannot be absorbed by listening.</div>
<h3>How it is taught</h3>
<p>Learning-Teaching Method, verbatim: <em>Inquiry-Based Learning, In-class lecture, Active Learning.</em> "Inquiry-based" means the lecturer puts the question in front of you before the answer; "Active Learning" means you are expected to derive, measure and calculate in class, not copy.</p>
<div class="callout"><strong>Pre-requisite: the field is EMPTY on FLM.</strong> The university does not write "None" there — it writes nothing. So we do not claim "this course has no pre-requisite"; we say only what we observe: <strong>the university publishes none</strong>. In practice SDI101m is a first-semester course and this site teaches Chapter 1 assuming you have only high-school physics.</div>
<h3>What to read next</h3>
<ul>
<li><strong>0.2</strong> — the seven marks that make your grade, weights 10+10+5+5+15+15+40 = 100%.</li>
<li><strong>0.3</strong> — the four CLOs, verbatim, and which sessions carry each one.</li>
<li><strong>0.4</strong> — the four materials. <strong>Three</strong> of them are main materials, which is rare.</li>
<li><strong>0.5</strong> — all 60 sessions in the university's own order.</li>
<li><strong>0.6</strong> — the four student duties, including the 80% attendance rule.</li>
</ul>`,
    `<span class="eyebrow">SDI101m · Mục 0 · Bài 0.1</span>
<h2>Hồ sơ môn học — lấy thẳng từ syllabus FLM</h2>
<p class="lead">Mọi con số trên trang này chép từ syllabus FLM 12239. Không chỗ nào là suy diễn của web, và chỗ nào ô của trường để trống thì web nói thẳng là trống chứ không điền vào.</p>
<p class="nhan">` + NGUON + `</p>
<div class="callout"><span class="badge">Đọc dòng này trước</span> <strong>SDI101m là HAI môn khoác một cái áo.</strong> Buổi <strong>1–21</strong> là <strong>vật lý điện từ</strong> cổ điển — điện tích, điện trường, điện thế, điện dung, dòng điện, mạch điện, từ trường, sóng — gắn <strong>CLO1</strong> và <strong>CLO2</strong>. Buổi <strong>22–60</strong> là <strong>vật lý bán dẫn &amp; linh kiện</strong> — tinh thể, dải năng lượng, hạt tải, chuyển tiếp p-n, MOSFET, BJT, CMOS, bộ nhớ, chip AI — gắn <strong>CLO3</strong> và <strong>CLO4</strong>. Đây là môn nhập môn của ngành <strong>Thiết kế vi mạch bán dẫn</strong>, và nửa đầu tồn tại vì không có nó thì không hiểu được một dòng nào của nửa sau.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mã môn</span><span class="v">SDI101m</span></div>
  <div class="kv"><span class="k">Tên syllabus</span><span class="v">Introduction to Semiconductor Devices_Nhập môn thiết bị bán dẫn</span></div>
  <div class="kv"><span class="k">Tên tiếng Anh</span><span class="v">Introduction to Semiconductor Devices</span></div>
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Bậc</span><span class="v">Bachelor (đại học)</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10</span></div>
  <div class="kv"><span class="k">Điểm TB tối thiểu để qua</span><span class="v">5</span></div>
  <div class="kv"><span class="k">Có tính điểm</span><span class="v">True</span></div>
  <div class="kv"><span class="k">Môn tiên quyết</span><span class="v">ô này TRỐNG trên FLM — trường không công bố</span></div>
  <div class="kv"><span class="k">Phân bổ thời gian</span><span class="v">45h (60 buổi) trên lớp + 1h thi cuối kỳ + 104h tự học</span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60</span></div>
  <div class="kv"><span class="k">Công cụ</span><span class="v">ô này TRỐNG trên FLM — trường không công bố công cụ/phần mềm nào</span></div>
  <div class="kv"><span class="k">Phương pháp dạy-học</span><span class="v">Inquiry-Based Learning, In-class lecture, Active Learning</span></div>
  <div class="kv"><span class="k">Số quyết định</span><span class="v">1286/QĐ-ĐHFPT ngày 22/11/2024</span></div>
  <div class="kv"><span class="k">Phê duyệt</span><span class="v">22/11/2024 · IsApproved: True · IsActive: True</span></div>
  <div class="kv"><span class="k">Syllabus ID</span><span class="v">12239</span></div>
  <div class="kv"><span class="k">Tự kiểm chứng</span><span class="v"><a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=12239" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=12239</a></span></div>
</div>
<h3>Trường mô tả môn này là gì</h3>
<p>Ô Description mở bằng một câu rồi hai gạch đầu dòng — trích nguyên văn kèm dịch:</p>
<ul>
<li>"The course includes two parts." — <em>Môn học gồm hai phần.</em></li>
<li>"The first part covers a sufficient understanding of fundamental physics concepts about electromagnetism…" — <em>Phần thứ nhất cung cấp hiểu biết đủ về các khái niệm vật lý nền tảng của điện từ học: trường điện từ, dòng điện, điện thế, điện dung, điện trở, mạch điện…</em></li>
<li>"The second part of this course aims to provide a general understanding of semiconductor devices…" — <em>Phần thứ hai cho hiểu biết tổng quát về linh kiện bán dẫn: nguyên lý và cơ chế hoạt động của bán dẫn, như dịch chuyển điện tích, chuyển tiếp p-n, tụ chuyển tiếp, transistor hiệu ứng trường kim loại–oxit–bán dẫn (MOSFET), tiếp xúc kim loại–bán dẫn, tụ MOS, CMOS, transistor hiệu ứng trường kim loại–bán dẫn (MESFET), bộ nhớ và transistor lưỡng cực (BJT), nhằm nâng hiểu biết chung về ngành công nghiệp bán dẫn.</em></li>
</ul>
<div class="callout warn"><strong>Ô Description có nhắc MESFET, nhưng bảng 60 buổi thì KHÔNG.</strong> Hai buổi gần nhất là buổi 36 (Metal–Semiconductor Junctions) và buổi 37 (Transistor Operation and The Junction FET). Web nêu cả hai sự thật và không sửa cái nào: phần mô tả có chữ MESFET, bảng kế hoạch buổi không có chữ đó. Hãy hỏi giảng viên xem MESFET có nằm trong phạm vi thi không.</div>
<h3>150 giờ đi đâu</h3>
<p>Ô Time Allocation, nguyên văn: <em>45h (60 sessions) contact hours + 1h final exam + 104h self-study.</em></p>
<table>
  <thead><tr><th>Khối thời gian</th><th>Số giờ</th><th>Tỷ lệ</th></tr></thead>
  <tbody>
    <tr><td>Giờ lên lớp (60 buổi)</td><td>45</td><td>30%</td></tr>
    <tr><td>Tự học</td><td>104</td><td>69,3%</td></tr>
    <tr><td>Thi cuối kỳ</td><td>1</td><td>0,7%</td></tr>
    <tr><td><strong>Tổng</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>
  </tbody>
</table>
<div class="note-ct">Hai phép kiểm số học <strong>do web tự làm</strong> (không phải câu của FLM): ba khối cộng lại đúng <strong>150h</strong> — cách đọc trên là đúng; và 45 giờ lên lớp chia 60 buổi ra <strong>45 phút lớp mỗi buổi</strong>. Vậy syllabus dành <strong>104 giờ tự học so với 45 giờ lên lớp — khoảng 2,3 giờ ở nhà cho mỗi giờ ở lớp</strong>. Một môn vật lý nhiều công thức như thế này không học được bằng cách ngồi nghe.</div>
<h3>Trường dạy môn này theo cách nào</h3>
<p>Ô Learning-Teaching Method, nguyên văn: <em>Inquiry-Based Learning, In-class lecture, Active Learning.</em> "Inquiry-Based" (học theo truy vấn) nghĩa là giảng viên đặt câu hỏi trước rồi mới tới đáp án; "Active Learning" (học chủ động) nghĩa là bạn phải tự suy ra, tự đo, tự tính ngay trong lớp, không phải chép.</p>
<div class="callout"><strong>Môn tiên quyết: ô này TRỐNG trên FLM.</strong> Trường không ghi "None" — trường không ghi gì cả. Nên web không kết luận "môn này không có tiên quyết"; web chỉ nói đúng điều quan sát được: <strong>trường không công bố</strong>. Thực tế SDI101m là môn kỳ 1 và web dạy Chương 1 với giả định bạn chỉ có vật lý phổ thông.</div>
<h3>Đọc tiếp gì</h3>
<ul>
<li><strong>0.2</strong> — bảy đầu điểm làm nên điểm môn, trọng số 10+10+5+5+15+15+40 = 100%.</li>
<li><strong>0.3</strong> — bốn CLO nguyên văn và buổi nào gánh CLO nào.</li>
<li><strong>0.4</strong> — bốn tài liệu. <strong>BA</strong> trong số đó là giáo trình chính — chuyện hiếm gặp.</li>
<li><strong>0.5</strong> — đủ 60 buổi theo đúng thứ tự của trường.</li>
<li><strong>0.6</strong> — bốn nhiệm vụ của sinh viên, gồm quy định dự ≥80% số buổi.</li>
</ul>`,
  ]]), isFreePreview: true };

/* ── 0.2 Cách tính điểm ───────────────────────────────────────────────────── */
const l02 = doc('sdi101m-0-2-danh-gia',
  '0.2 — Grading: 7 marks, 10+10+5+5+15+15+40 = 100%|||0.2 — Cách tính điểm: 7 đầu điểm, 10+10+5+5+15+15+40 = 100%',
  'Bảng 7 đầu điểm FLM đủ trọng số, tiêu chí đạt, thời lượng (Assignment 135′, Lab 270′, PT 45′, thi 60′ 50 câu), CLO và số câu; tổng đúng 100%; hai chỗ lệch CLO giữa bảng điểm và kế hoạch buổi; thang 10, qua môn từ 5.',
  [[
    `<span class="eyebrow">SDI101m · Section 0 · Lesson 0.2</span>
<h2>Your grade, mark by mark</h2>
<p class="lead">Seven marks. They add up to exactly 100%, and <strong>60% of your grade is decided before the final exam</strong>. Read this in week one, not in week ten.</p>
<p class="nhan">` + NGUON + ` — Assessments table, verbatim</p>
<table>
  <thead><tr><th>#</th><th>Category</th><th>Type</th><th>Part</th><th>Weight</th><th>Completion criteria</th><th>Duration</th><th>CLO</th><th>No. of questions</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><strong>Assignment 1</strong></td><td>on-going</td><td>1</td><td><strong>10.0%</strong></td><td>&gt; 0</td><td>135'</td><td>CLO1</td><td>by instructor</td></tr>
    <tr><td>2</td><td><strong>Assignment 2</strong></td><td>on-going</td><td>1</td><td><strong>10.0%</strong></td><td>&gt; 0</td><td>135'</td><td><strong>CLO2</strong></td><td>by instructor</td></tr>
    <tr><td>3</td><td><strong>Lab 1</strong></td><td>on-going</td><td>1</td><td><strong>5.0%</strong></td><td>&gt; 0</td><td><strong>270'</strong></td><td>CLO1, CLO2</td><td>by instructor</td></tr>
    <tr><td>4</td><td><strong>Lab 2</strong></td><td>on-going</td><td>1</td><td><strong>5.0%</strong></td><td>&gt; 0</td><td><strong>270'</strong></td><td>CLO3, CLO4</td><td>by instructor</td></tr>
    <tr><td>5</td><td><strong>Progress test 1</strong></td><td>on-going</td><td>1</td><td><strong>15.0%</strong></td><td>&gt; 0</td><td><strong>45'</strong></td><td>CLO1</td><td><strong>30</strong></td></tr>
    <tr><td>6</td><td><strong>Progress test 2</strong></td><td>on-going</td><td>1</td><td><strong>15.0%</strong></td><td>&gt; 0</td><td><strong>45'</strong></td><td>CLO3</td><td><strong>30</strong></td></tr>
    <tr><td>7</td><td><strong>Final exam</strong></td><td><strong>Final exam</strong></td><td>1</td><td><strong>40.0%</strong></td><td><strong>4</strong></td><td>60'</td><td>CLO1, CLO2, CLO3, CLO4</td><td><strong>50</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>The weights add up to exactly 100%</strong> — 10 + 10 + 5 + 5 + 15 + 15 + 40 = 100. There is no hidden eighth mark and nothing is rounded.</div>
<h3>Two numbers, side by side</h3>
<p>These are the syllabus' own figures, with no comment from us:</p>
<table>
  <thead><tr><th>Mark</th><th>Duration</th><th>Weight</th></tr></thead>
  <tbody>
    <tr><td>Lab 1</td><td><strong>270 minutes</strong></td><td><strong>5%</strong></td></tr>
    <tr><td>Lab 2</td><td><strong>270 minutes</strong></td><td><strong>5%</strong></td></tr>
    <tr><td>Progress test 1</td><td><strong>45 minutes</strong></td><td><strong>15%</strong></td></tr>
    <tr><td>Progress test 2</td><td><strong>45 minutes</strong></td><td><strong>15%</strong></td></tr>
  </tbody>
</table>
<p>So each Lab occupies 270 minutes and carries 5%, while each Progress test occupies 45 minutes and carries 15%. Those are the published figures; the university does not explain the ratio and neither will we.</p>
<h3>Two places where the tables disagree with each other</h3>
<div class="callout warn"><strong>1. Assignment 2 is tagged CLO2, but the session plan puts it in the semiconductor half.</strong> CLO2 is about "the electrical and electronic components used in RLC circuit" and "electric circuit safety" — the <em>first</em> half of the course. Yet the 60-session plan schedules Assignment 2 at <strong>sessions 51, 52 and 53</strong>, which sit between the AI-chip sessions (49–50) and Progress Test 2 (54), deep inside the semiconductor half where every session is tagged CLO3.<br>
<strong>2. The Progress Tests carry different CLO tags in the two tables.</strong> The Assessments table tags Progress test 1 as <strong>CLO1</strong>, but session 15 in the plan is tagged <strong>"CLO1, CLO2"</strong>. The Assessments table tags Progress test 2 as <strong>CLO3</strong>, but session 54 in the plan is tagged <strong>"CLO3, CLO4"</strong>.<br>
We report both readings and change neither table. Before each test, ask your lecturer which reading applies, and prepare for the wider one.</div>
<h3>Passing</h3>
<p>Scoring scale <strong>10</strong>; minimum average mark to pass <strong>5</strong>. Note that only the Final exam has a completion criteria of <strong>4</strong> — the other six are "&gt; 0". Attendance, verbatim from StudentTasks: <em>"Students must attend at least 80% of contact slots in order to be accepted to the final examination."</em> With 60 sessions, 80% means you may miss <strong>at most 12</strong>.</p>
<div class="out">Weighted example (our arithmetic, not a university rule):<br>Assignment 1 &nbsp;8 × 10% = 0.80<br>Assignment 2 &nbsp;7 × 10% = 0.70<br>Lab 1 &nbsp;9 × 5% = 0.45<br>Lab 2 &nbsp;9 × 5% = 0.45<br>Progress test 1 &nbsp;6 × 15% = 0.90<br>Progress test 2 &nbsp;6 × 15% = 0.90<br>Final exam &nbsp;5 × 40% = 2.00<br><b>Average = 6.20 → above 5, passed</b></div>
<div class="callout warn"><strong>Three numbers worth keeping in your head.</strong> <strong>60%</strong> is earned during the semester (10+10+5+5+15+15), so the final exam cannot rescue a lost semester. <strong>30%</strong> sits in the two Progress Tests alone — 90 minutes of multiple choice for almost a third of the grade. And the final exam is 50 questions in 60 minutes, i.e. <strong>72 seconds per question</strong>: that is reflex speed, not note-reading speed.</div>
<div class="note-ct"><strong>What the syllabus does NOT say</strong>, so we will not guess: what an Assignment consists of (the No-Question column says only "by instructor"), how the 135 minutes of an Assignment are scheduled, whether the Labs are graded on the report or on the bench work, and what happens to a mark that falls below its completion criteria. Ask in session 1 and write the answers down.</div>`,
    `<span class="eyebrow">SDI101m · Mục 0 · Bài 0.2</span>
<h2>Điểm môn của bạn, từng đầu điểm một</h2>
<p class="lead">Bảy đầu điểm. Cộng lại đúng 100%, và <strong>60% điểm môn đã chốt trước kỳ thi cuối</strong>. Đọc bài này ở tuần một, đừng để tới tuần mười.</p>
<p class="nhan">` + NGUON + ` — bảng Assessments, nguyên văn</p>
<table>
  <thead><tr><th>#</th><th>Đầu điểm</th><th>Loại</th><th>Số phần</th><th>Trọng số</th><th>Tiêu chí đạt</th><th>Thời lượng</th><th>CLO</th><th>Số câu</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><strong>Assignment 1</strong> (bài tập lớn 1)</td><td>on-going</td><td>1</td><td><strong>10.0%</strong></td><td>&gt; 0</td><td>135 phút</td><td>CLO1</td><td>giảng viên quyết định</td></tr>
    <tr><td>2</td><td><strong>Assignment 2</strong> (bài tập lớn 2)</td><td>on-going</td><td>1</td><td><strong>10.0%</strong></td><td>&gt; 0</td><td>135 phút</td><td><strong>CLO2</strong></td><td>giảng viên quyết định</td></tr>
    <tr><td>3</td><td><strong>Lab 1</strong></td><td>on-going</td><td>1</td><td><strong>5.0%</strong></td><td>&gt; 0</td><td><strong>270 phút</strong></td><td>CLO1, CLO2</td><td>giảng viên quyết định</td></tr>
    <tr><td>4</td><td><strong>Lab 2</strong></td><td>on-going</td><td>1</td><td><strong>5.0%</strong></td><td>&gt; 0</td><td><strong>270 phút</strong></td><td>CLO3, CLO4</td><td>giảng viên quyết định</td></tr>
    <tr><td>5</td><td><strong>Progress test 1</strong> (kiểm tra tiến độ 1)</td><td>on-going</td><td>1</td><td><strong>15.0%</strong></td><td>&gt; 0</td><td><strong>45 phút</strong></td><td>CLO1</td><td><strong>30 câu</strong></td></tr>
    <tr><td>6</td><td><strong>Progress test 2</strong> (kiểm tra tiến độ 2)</td><td>on-going</td><td>1</td><td><strong>15.0%</strong></td><td>&gt; 0</td><td><strong>45 phút</strong></td><td>CLO3</td><td><strong>30 câu</strong></td></tr>
    <tr><td>7</td><td><strong>Final exam</strong> (thi cuối kỳ)</td><td><strong>Final exam</strong></td><td>1</td><td><strong>40.0%</strong></td><td><strong>4</strong></td><td>60 phút</td><td>CLO1, CLO2, CLO3, CLO4</td><td><strong>50 câu</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Trọng số cộng lại đúng 100%</strong> — 10 + 10 + 5 + 5 + 15 + 15 + 40 = 100. Không có đầu điểm thứ tám ẩn đâu đó và không có chỗ nào phải làm tròn.</div>
<h3>Hai con số, đặt cạnh nhau</h3>
<p>Đây là số liệu của chính syllabus, web không bình luận gì thêm:</p>
<table>
  <thead><tr><th>Đầu điểm</th><th>Thời lượng</th><th>Trọng số</th></tr></thead>
  <tbody>
    <tr><td>Lab 1</td><td><strong>270 phút</strong></td><td><strong>5%</strong></td></tr>
    <tr><td>Lab 2</td><td><strong>270 phút</strong></td><td><strong>5%</strong></td></tr>
    <tr><td>Progress test 1</td><td><strong>45 phút</strong></td><td><strong>15%</strong></td></tr>
    <tr><td>Progress test 2</td><td><strong>45 phút</strong></td><td><strong>15%</strong></td></tr>
  </tbody>
</table>
<p>Vậy mỗi bài Lab chiếm 270 phút và mang 5%, còn mỗi bài Progress test chiếm 45 phút và mang 15%. Đó là con số trường công bố; trường không giải thích tỷ lệ này và web cũng không giải thích thay.</p>
<h3>Hai chỗ hai bảng của trường nói khác nhau</h3>
<div class="callout warn"><strong>1. Assignment 2 gắn CLO2, nhưng kế hoạch buổi lại xếp nó vào nửa bán dẫn.</strong> CLO2 nói về "các phần tử điện và điện tử dùng trong mạch RLC" và "an toàn điện" — tức nửa <em>đầu</em> của môn. Thế nhưng bảng 60 buổi xếp Assignment 2 ở <strong>buổi 51, 52 và 53</strong>, nằm giữa hai buổi chip AI (49–50) và Progress Test 2 (54), tức sâu trong nửa bán dẫn nơi mọi buổi đều gắn CLO3.<br>
<strong>2. Hai bài Progress Test mang nhãn CLO khác nhau ở hai bảng.</strong> Bảng Assessments gắn Progress test 1 là <strong>CLO1</strong>, nhưng buổi 15 trong kế hoạch lại ghi <strong>"CLO1, CLO2"</strong>. Bảng Assessments gắn Progress test 2 là <strong>CLO3</strong>, nhưng buổi 54 trong kế hoạch lại ghi <strong>"CLO3, CLO4"</strong>.<br>
Web nêu cả hai cách đọc và KHÔNG sửa bảng nào. Trước mỗi bài kiểm tra hãy hỏi giảng viên cách đọc nào áp dụng, và ôn theo cách đọc RỘNG hơn.</div>
<h3>Điều kiện qua môn</h3>
<p>Thang điểm <strong>10</strong>; điểm trung bình tối thiểu để qua môn là <strong>5</strong>. Chú ý chỉ Final exam có tiêu chí đạt là <strong>4</strong> — sáu đầu điểm còn lại là "&gt; 0". Điểm danh, nguyên văn ô StudentTasks: <em>"Students must attend at least 80% of contact slots in order to be accepted to the final examination."</em> — dự ít nhất 80% số buổi mới được vào thi cuối kỳ. Với 60 buổi, 80% nghĩa là vắng <strong>tối đa 12 buổi</strong>.</p>
<div class="out">Ví dụ tính điểm (số học của web, không phải quy định của trường):<br>Assignment 1 &nbsp;8 × 10% = 0,80<br>Assignment 2 &nbsp;7 × 10% = 0,70<br>Lab 1 &nbsp;9 × 5% = 0,45<br>Lab 2 &nbsp;9 × 5% = 0,45<br>Progress test 1 &nbsp;6 × 15% = 0,90<br>Progress test 2 &nbsp;6 × 15% = 0,90<br>Final exam &nbsp;5 × 40% = 2,00<br><b>Điểm trung bình = 6,20 → trên 5, qua môn</b></div>
<div class="callout warn"><strong>Ba con số nên nhớ.</strong> <strong>60%</strong> kiếm được trong học kỳ (10+10+5+5+15+15), nên kỳ thi cuối không cứu được một học kỳ đã buông. <strong>30%</strong> nằm trong hai bài Progress Test — 90 phút trắc nghiệm cho gần một phần ba điểm môn. Và thi cuối kỳ 50 câu trong 60 phút, tức <strong>72 giây một câu</strong>: đó là tốc độ phản xạ, không phải tốc độ tra vở.</div>
<div class="note-ct"><strong>Những chỗ syllabus KHÔNG nói</strong> nên web không đoán: một bài Assignment gồm những gì (cột Số câu chỉ ghi "by instructor" — giảng viên quyết định), 135 phút của Assignment được xếp vào lúc nào, Lab chấm theo báo cáo hay theo thao tác trên bàn, và một đầu điểm dưới tiêu chí đạt thì xử lý thế nào. Hãy hỏi ngay buổi 1 và ghi lại câu trả lời.</div>`,
  ]]);

/* ── 0.3 Bốn CLO ──────────────────────────────────────────────────────────── */
const l03 = doc('sdi101m-0-3-clo',
  '0.3 — The four CLOs, verbatim + which sessions carry them|||0.3 — Bốn chuẩn đầu ra (CLO), nguyên văn + buổi nào gánh CLO nào',
  'Bốn CLO nguyên văn tiếng Anh kèm dịch; ánh xạ CLO ↔ buổi (CLO1: 1–21 · CLO2: 15–21 · CLO3: 22–60 · CLO4: 54–60) ↔ chương trên web; CLO ↔ đầu điểm; và lỗi gõ "CLO 1" có dấu cách ở buổi 9.',
  [[
    `<span class="eyebrow">SDI101m · Section 0 · Lesson 0.3</span>
<h2>The four course learning outcomes</h2>
<p class="lead">Exams are written against these four sentences. Two of them (CLO1, CLO2) belong to the electromagnetism half and two (CLO3, CLO4) to the semiconductor half — which is why the course feels like it changes subject at session 22. It does.</p>
<p class="nhan">` + NGUON + ` — CLO table, verbatim</p>
<table>
  <thead><tr><th>CLO</th><th>Verbatim (FLM)</th><th>Translation</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>Understand what is electrical and electronic fundamental concepts</td><td>Hiểu các khái niệm nền tảng về điện và điện tử</td></tr>
    <tr><td><strong>CLO2</strong></td><td>Practice with the electrical and electronic components used in RLC circuit. Learning and having responsibility in how to deal with the electric circuit safety.</td><td>Thực hành với các phần tử điện và điện tử dùng trong mạch RLC. Học và có trách nhiệm về cách xử lý an toàn khi làm việc với mạch điện.</td></tr>
    <tr><td><strong>CLO3</strong></td><td>Understand what is semiconductor, semiconductor devices. Understand the principles and operation mechanism of semiconductor devices.</td><td>Hiểu bán dẫn là gì, linh kiện bán dẫn là gì. Hiểu nguyên lý và cơ chế hoạt động của linh kiện bán dẫn.</td></tr>
    <tr><td><strong>CLO4</strong></td><td>Familiarize with semiconductor devices. Observe and verify the operating characteristics of semiconductor devices.</td><td>Làm quen với linh kiện bán dẫn. Quan sát và kiểm chứng đặc tuyến hoạt động của linh kiện bán dẫn.</td></tr>
  </tbody>
</table>
<h3>CLO → FLM sessions → chapter on this site</h3>
<table>
  <thead><tr><th>CLO</th><th>Sessions that carry it (from the CLO column of the plan)</th><th>Chapters here</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>1, 2, 3, 4, 5, 6, 7, 8, <strong>9</strong>, 10, 11 (alone) · 12, 13, 14 (Assignment 1) · 15–21 (together with CLO2)</td><td>Chapter 1, and chapters 2–3</td></tr>
    <tr><td><strong>CLO2</strong></td><td>15 · 16, 17, 18, 19, 20, 21 — <strong>only these seven sessions</strong>, always together with CLO1</td><td>Chapters 2–3</td></tr>
    <tr><td><strong>CLO3</strong></td><td>22 – 53 (alone) · 54 – 60 (together with CLO4)</td><td>Chapters 4–11</td></tr>
    <tr><td><strong>CLO4</strong></td><td>54 · 55, 56, 57, 58, 59, 60 — <strong>only these seven sessions</strong>, always together with CLO3</td><td>Chapters 10–11</td></tr>
  </tbody>
</table>
<div class="note-ct"><strong>Our own reading of that table</strong> (arithmetic, not an FLM statement): <strong>CLO2 and CLO4 never appear alone in any session</strong>, and each appears in only seven of sixty sessions — CLO2 in 15–21, CLO4 in 54–60. Both of those blocks are a Progress Test plus a LAB. That is consistent with what the two outcomes say: CLO2 is "practice… and safety", CLO4 is "observe and verify characteristics" — outcomes you reach on a bench, not in a lecture. It also means the two LAB blocks are the <em>only</em> place those outcomes are taught, while the Final exam (40%) is tagged all four.</div>
<h3>CLO → which mark tests it</h3>
<table>
  <thead><tr><th>Mark</th><th>Weight</th><th>CLO (FLM)</th></tr></thead>
  <tbody>
    <tr><td>Assignment 1</td><td>10%</td><td>CLO1</td></tr>
    <tr><td>Assignment 2</td><td>10%</td><td>CLO2</td></tr>
    <tr><td>Lab 1</td><td>5%</td><td>CLO1, CLO2</td></tr>
    <tr><td>Lab 2</td><td>5%</td><td>CLO3, CLO4</td></tr>
    <tr><td>Progress test 1</td><td>15%</td><td>CLO1</td></tr>
    <tr><td>Progress test 2</td><td>15%</td><td>CLO3</td></tr>
    <tr><td>Final exam</td><td>40%</td><td>CLO1, CLO2, CLO3, CLO4</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>A typo in the original, reported for completeness.</strong> In the session plan every row writes the outcome as <code>CLO1</code>, <code>CLO3</code> and so on — except <strong>session 9 (Magnetic Fields), which is printed as "CLO 1" with a space</strong>. It is the same CLO1; it is a keystroke, not a different outcome. We keep the university's spelling in the table at 0.5 rather than silently tidying it, so that your page matches the paper you were handed.</div>
<div class="callout"><strong>The two CLO mismatches</strong> between the Assessments table and the session plan are written out in lesson <strong>0.2</strong>: Assignment 2 is tagged CLO2 yet scheduled at sessions 51–53, and both Progress Tests carry one CLO in the Assessments table but two in the plan. Read that before your first test.</div>`,
    `<span class="eyebrow">SDI101m · Mục 0 · Bài 0.3</span>
<h2>Bốn chuẩn đầu ra của môn</h2>
<p class="lead">Đề thi được viết theo bốn câu này. Hai câu (CLO1, CLO2) thuộc nửa điện từ và hai câu (CLO3, CLO4) thuộc nửa bán dẫn — đó là lý do môn học có cảm giác đổi hẳn chủ đề ở buổi 22. Đúng là nó đổi thật.</p>
<p class="nhan">` + NGUON + ` — bảng CLO, nguyên văn</p>
<table>
  <thead><tr><th>CLO</th><th>Nguyên văn (FLM)</th><th>Dịch</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>Understand what is electrical and electronic fundamental concepts</td><td>Hiểu các khái niệm nền tảng về điện và điện tử</td></tr>
    <tr><td><strong>CLO2</strong></td><td>Practice with the electrical and electronic components used in RLC circuit. Learning and having responsibility in how to deal with the electric circuit safety.</td><td>Thực hành với các phần tử điện và điện tử dùng trong mạch RLC. Học và có trách nhiệm về cách xử lý an toàn khi làm việc với mạch điện.</td></tr>
    <tr><td><strong>CLO3</strong></td><td>Understand what is semiconductor, semiconductor devices. Understand the principles and operation mechanism of semiconductor devices.</td><td>Hiểu bán dẫn là gì, linh kiện bán dẫn là gì. Hiểu nguyên lý và cơ chế hoạt động của linh kiện bán dẫn.</td></tr>
    <tr><td><strong>CLO4</strong></td><td>Familiarize with semiconductor devices. Observe and verify the operating characteristics of semiconductor devices.</td><td>Làm quen với linh kiện bán dẫn. Quan sát và kiểm chứng đặc tuyến hoạt động của linh kiện bán dẫn.</td></tr>
  </tbody>
</table>
<h3>CLO → buổi theo FLM → chương trên web</h3>
<table>
  <thead><tr><th>CLO</th><th>Buổi gánh CLO đó (theo cột CLO của kế hoạch)</th><th>Chương trên web</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>1, 2, 3, 4, 5, 6, 7, 8, <strong>9</strong>, 10, 11 (một mình) · 12, 13, 14 (Assignment 1) · 15–21 (cùng CLO2)</td><td>Chương 1, và chương 2–3</td></tr>
    <tr><td><strong>CLO2</strong></td><td>15 · 16, 17, 18, 19, 20, 21 — <strong>chỉ bảy buổi này</strong>, và luôn đi kèm CLO1</td><td>Chương 2–3</td></tr>
    <tr><td><strong>CLO3</strong></td><td>22 – 53 (một mình) · 54 – 60 (cùng CLO4)</td><td>Chương 4–11</td></tr>
    <tr><td><strong>CLO4</strong></td><td>54 · 55, 56, 57, 58, 59, 60 — <strong>chỉ bảy buổi này</strong>, và luôn đi kèm CLO3</td><td>Chương 10–11</td></tr>
  </tbody>
</table>
<div class="note-ct"><strong>Cách web đọc bảng trên</strong> (số học của web, không phải câu của FLM): <strong>CLO2 và CLO4 không bao giờ xuất hiện một mình ở buổi nào</strong>, và mỗi cái chỉ có mặt ở bảy trên sáu mươi buổi — CLO2 ở buổi 15–21, CLO4 ở buổi 54–60. Cả hai khối đó đều là một bài Progress Test cộng một khối LAB. Điều đó khớp với chính nội dung hai chuẩn đầu ra: CLO2 là "thực hành… và an toàn", CLO4 là "quan sát và kiểm chứng đặc tuyến" — những thứ đạt được trên bàn thí nghiệm, không đạt được khi ngồi nghe. Nó cũng nghĩa là hai khối LAB là chỗ <em>duy nhất</em> dạy hai chuẩn đầu ra ấy, trong khi Final exam (40%) lại gắn cả bốn CLO.</div>
<h3>CLO → đầu điểm nào kiểm</h3>
<table>
  <thead><tr><th>Đầu điểm</th><th>Trọng số</th><th>CLO (theo FLM)</th></tr></thead>
  <tbody>
    <tr><td>Assignment 1</td><td>10%</td><td>CLO1</td></tr>
    <tr><td>Assignment 2</td><td>10%</td><td>CLO2</td></tr>
    <tr><td>Lab 1</td><td>5%</td><td>CLO1, CLO2</td></tr>
    <tr><td>Lab 2</td><td>5%</td><td>CLO3, CLO4</td></tr>
    <tr><td>Progress test 1</td><td>15%</td><td>CLO1</td></tr>
    <tr><td>Progress test 2</td><td>15%</td><td>CLO3</td></tr>
    <tr><td>Final exam</td><td>40%</td><td>CLO1, CLO2, CLO3, CLO4</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Một lỗi gõ trong bản gốc, nêu cho đủ.</strong> Trong bảng kế hoạch buổi, mọi dòng đều ghi chuẩn đầu ra là <code>CLO1</code>, <code>CLO3</code>… — trừ <strong>buổi 9 (Magnetic Fields) in là "CLO 1" CÓ DẤU CÁCH</strong>. Vẫn là CLO1 ấy; đó là một cú gõ tay, không phải một chuẩn đầu ra khác. Web giữ đúng cách viết của trường trong bảng ở bài 0.5 thay vì âm thầm dọn lại, để trang này khớp với bản giấy bạn được phát.</div>
<div class="callout"><strong>Hai chỗ lệch CLO</strong> giữa bảng Assessments và kế hoạch buổi được viết rõ ở bài <strong>0.2</strong>: Assignment 2 gắn CLO2 mà lại xếp ở buổi 51–53, và hai bài Progress Test mang một CLO ở bảng Assessments nhưng hai CLO ở kế hoạch buổi. Đọc bài đó trước bài kiểm tra đầu tiên.</div>`,
  ]]);

/* ── 0.4 Giáo trình & công cụ ─────────────────────────────────────────────── */
const l04 = doc('sdi101m-0-4-giao-trinh-cong-cu',
  '0.4 — Materials: THREE main textbooks, and no tools|||0.4 — Giáo trình: BA giáo trình chính, và không công cụ nào',
  'Bốn dòng bảng Materials dựng thành thẻ bấm được: Streetman & Banerjee 7th 2015 ISBN 9780132017206 (sách giấy, không link) + hai khoá Coursera của KAIST (học audit miễn phí) — cả BA đều Is Main Material = True — và Halliday 9th 2011 ISBN 9780470561584 tham khảo; ô Tools TRỐNG.',
  [[
    `<span class="eyebrow">SDI101m · Section 0 · Lesson 0.4</span>
<h2>Materials &amp; tools — the university's own list</h2>
<p class="lead">The Materials table has four rows, and here is the rare part: <strong>rows 1, 2 and 3 are all marked "Is Main Material = True"</strong>. This course has <strong>three</strong> main textbooks — one printed book and two complete Coursera courses.</p>
<p class="nhan">` + NGUON + ` — Materials table, verbatim (author, publisher, year, edition, ISBN, URL)</p>
` + KHOI_SACH(true) + `
<h3>The same four rows, field by field</h3>
<table>
  <thead><tr><th>#</th><th>Material description</th><th>Author</th><th>Publisher</th><th>Year</th><th>Edition</th><th>ISBN</th><th>Main?</th><th>URL</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Solid State Electronic Devices</td><td>Ben G. Streetman, Sanjay Kumar Banerjee</td><td>Pearson/Prentice Hall</td><td>2015</td><td>7th</td><td>9780132017206 / 0132017202</td><td><strong>True — main</strong></td><td>blank</td></tr>
    <tr><td>2</td><td>Semiconductor Physics and Devices 1</td><td>Korea Advanced Institute of Science and Technology (KAIST)</td><td>Coursera</td><td>blank</td><td>blank</td><td>blank</td><td><strong>True — main</strong></td><td>coursera.org/learn/semiconductor-1</td></tr>
    <tr><td>3</td><td>Semiconductor Physics and Devices 2</td><td>Korea Advanced Institute of Science and Technology (KAIST)</td><td>Coursera</td><td>blank</td><td>blank</td><td>blank</td><td><strong>True — main</strong></td><td>coursera.org/learn/semiconductor-2</td></tr>
    <tr><td>4</td><td>Principles of Physics</td><td>David Halliday, Robert Resnick, Jearl Walker</td><td>Wiley</td><td>2011</td><td>9th</td><td>9780470561584</td><td>False — reference</td><td>blank</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Fields shown as "blank" are empty on the FLM syllabus. We do not guess them.</p>
<div class="callout warn"><strong>How rows 2 and 3 actually look on FLM.</strong> In the original syllabus the <em>Material Description</em> cell of those two rows is <strong>the raw URL itself</strong> — the text "https://www.coursera.org/learn/semiconductor-1" is used as the name of the material. On this page we have given each one a readable title (<em>Semiconductor Physics and Devices 1</em> and <em>2</em>, the real names of the KAIST courses) and moved the link onto the card's button. The content is identical; the presentation is ours. We tell you so that you recognise the row when you open FLM yourself.</div>
<div class="callout ok"><strong>Both Coursera courses: free to learn, paid only to certify.</strong> You can <em>audit</em> them — watch every lecture, read every reading — without paying. You pay only if you want the certificate. So neither "free" nor "paid" is the whole truth, and it matters: the two main textbooks of the semiconductor half of this course cost you nothing to study.</div>
<h3>Which material for which half of the course</h3>
<table>
  <thead><tr><th>Material</th><th>Fits sessions</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td><em>Principles of Physics</em> — Halliday, Resnick, Walker</td><td>1–21</td><td>Measurement, Coulomb, fields, Gauss, potential, capacitance, current, circuits, magnetism, inductance, EM waves — the topics of sessions 1–11 are, in order, chapters of this book.</td></tr>
    <tr><td><em>Solid State Electronic Devices</em> — Streetman &amp; Banerjee</td><td>22–60</td><td>Crystal properties, energy bands, carriers, p-n junction, FET, BJT, optoelectronics, ICs — the session titles from 22 on follow this book's structure closely.</td></tr>
    <tr><td>KAIST <em>Semiconductor Physics and Devices 1 &amp; 2</em></td><td>22–60</td><td>Video lectures over the same ground, useful when a page of Streetman does not open up on the third reading.</td></tr>
  </tbody>
</table>
<p class="ghi-chu">This mapping is CuongThai's, not FLM's — the syllabus does not say which material belongs to which session. Note also that the <em>reference</em> book (row 4) is the one that covers the first 21 sessions, while all three <em>main</em> materials cover the second half.</p>
<h3>Tools</h3>
<div class="callout danger"><strong>The Tools field is completely EMPTY.</strong> The university publishes no software, no instrument and no simulator for SDI101m — even though the course contains two LAB blocks totalling 540 minutes (sessions 16–21 and 55–60). We will not invent a name to fill the gap: <strong>the university does not publish any tool</strong>. Ask your lecturer in session 1 what LAB 1 and LAB 2 are actually performed on, and write the answer down.</div>
<div class="note-ct">Free things that help you <em>learn</em> the physics — our list, not a requirement and not a guess at what the labs use — are collected in the <strong>Resource hub</strong> page at the top of this course: nanoHUB and Falstad for simulation, the Ioffe archive for semiconductor constants, NIST for the fundamental constants, MIT OCW 6.012 for problem sets.</div>`,
    `<span class="eyebrow">SDI101m · Mục 0 · Bài 0.4</span>
<h2>Giáo trình &amp; công cụ — danh sách của chính trường</h2>
<p class="lead">Bảng Materials có bốn dòng, và đây là chỗ hiếm gặp: <strong>dòng 1, 2 và 3 đều được đánh dấu "Is Main Material = True"</strong>. Môn này có <strong>BA</strong> giáo trình chính — một cuốn sách in và hai khoá Coursera đầy đủ.</p>
<p class="nhan">` + NGUON + ` — bảng Materials, nguyên văn (tác giả, NXB, năm, bản, ISBN, URL)</p>
` + KHOI_SACH(false) + `
<h3>Vẫn bốn dòng đó, đủ từng trường</h3>
<table>
  <thead><tr><th>#</th><th>Mô tả tài liệu</th><th>Tác giả</th><th>NXB</th><th>Năm</th><th>Bản</th><th>ISBN</th><th>Chính?</th><th>URL</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Solid State Electronic Devices</td><td>Ben G. Streetman, Sanjay Kumar Banerjee</td><td>Pearson/Prentice Hall</td><td>2015</td><td>7th</td><td>9780132017206 / 0132017202</td><td><strong>True — chính</strong></td><td>trống</td></tr>
    <tr><td>2</td><td>Semiconductor Physics and Devices 1</td><td>Korea Advanced Institute of Science and Technology (KAIST)</td><td>Coursera</td><td>trống</td><td>trống</td><td>trống</td><td><strong>True — chính</strong></td><td>coursera.org/learn/semiconductor-1</td></tr>
    <tr><td>3</td><td>Semiconductor Physics and Devices 2</td><td>Korea Advanced Institute of Science and Technology (KAIST)</td><td>Coursera</td><td>trống</td><td>trống</td><td>trống</td><td><strong>True — chính</strong></td><td>coursera.org/learn/semiconductor-2</td></tr>
    <tr><td>4</td><td>Principles of Physics</td><td>David Halliday, Robert Resnick, Jearl Walker</td><td>Wiley</td><td>2011</td><td>9th</td><td>9780470561584</td><td>False — tham khảo</td><td>trống</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Ô ghi "trống" là ô TRỐNG trên syllabus FLM. Web không đoán thay.</p>
<div class="callout warn"><strong>Dòng 2 và 3 trên FLM thật ra trông thế nào.</strong> Trong bản gốc, ô <em>Material Description</em> của hai dòng đó <strong>chính là đường link thô</strong> — dòng chữ "https://www.coursera.org/learn/semiconductor-1" được dùng làm TÊN tài liệu. Ở trang này web đặt cho mỗi cái một cái tên đọc được (<em>Semiconductor Physics and Devices 1</em> và <em>2</em>, đúng tên thật của hai khoá KAIST) và chuyển đường link sang nút của thẻ sách. Nội dung không đổi; cách trình bày là của web. Web nói ra để bạn nhận được đúng dòng đó khi tự mở FLM.</div>
<div class="callout ok"><strong>Cả hai khoá Coursera: học miễn phí, chỉ trả tiền nếu muốn lấy chứng chỉ.</strong> Bạn <em>audit</em> được — xem hết bài giảng, đọc hết tài liệu — mà không phải trả đồng nào. Chỉ trả tiền khi muốn lấy chứng chỉ. Nên nói "miễn phí" hay "trả phí" đều không phải toàn bộ sự thật, và điều này quan trọng: hai trong ba giáo trình chính của nửa bán dẫn không tốn của bạn đồng nào để học.</div>
<h3>Tài liệu nào cho nửa nào của môn</h3>
<table>
  <thead><tr><th>Tài liệu</th><th>Khớp buổi</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td><em>Principles of Physics</em> — Halliday, Resnick, Walker</td><td>1–21</td><td>Đo lường, Coulomb, điện trường, Gauss, điện thế, điện dung, dòng điện, mạch, từ trường, điện cảm, sóng điện từ — tên các buổi 1–11 gần như là tên các chương của cuốn này, theo đúng thứ tự.</td></tr>
    <tr><td><em>Solid State Electronic Devices</em> — Streetman &amp; Banerjee</td><td>22–60</td><td>Tính chất tinh thể, dải năng lượng, hạt tải, chuyển tiếp p-n, FET, BJT, linh kiện quang, IC — tên buổi từ 22 trở đi đi rất sát cấu trúc cuốn này.</td></tr>
    <tr><td>KAIST <em>Semiconductor Physics and Devices 1 &amp; 2</em></td><td>22–60</td><td>Bài giảng video trên cùng phần nội dung, hữu ích khi một trang Streetman đọc tới lần thứ ba vẫn chưa mở ra.</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Ánh xạ này do CuongThai đề xuất, KHÔNG phải của FLM — syllabus không nói tài liệu nào dùng cho buổi nào. Cũng chú ý một chỗ đáng chú ý: cuốn <em>tham khảo</em> (dòng 4) mới là cuốn phủ 21 buổi đầu, còn cả BA tài liệu <em>chính</em> đều phủ nửa sau.</p>
<h3>Công cụ</h3>
<div class="callout danger"><strong>Ô Tools để TRỐNG HOÀN TOÀN.</strong> Trường không công bố phần mềm nào, thiết bị nào, mô phỏng nào cho SDI101m — dù môn có hai khối LAB tổng 540 phút (buổi 16–21 và 55–60). Web KHÔNG bịa một cái tên để lấp chỗ trống: <strong>trường không công bố công cụ/phần mềm nào</strong>. Hãy hỏi giảng viên ngay buổi 1 xem LAB 1 và LAB 2 thực sự làm trên thiết bị gì, và ghi lại câu trả lời.</div>
<div class="note-ct">Những thứ miễn phí giúp bạn <em>hiểu</em> vật lý — danh sách của web, không phải yêu cầu và cũng không phải phỏng đoán về thiết bị của LAB — được gom ở trang <strong>Trung tâm tài liệu</strong> ở đầu môn: nanoHUB và Falstad để mô phỏng, Ioffe để tra hằng số bán dẫn, NIST để tra hằng số cơ bản, MIT OCW 6.012 để lấy bài tập.</div>`,
  ]]);

/* ── 0.5 Kế hoạch đủ 60 buổi ──────────────────────────────────────────────── */
const l05 = doc('sdi101m-0-5-ke-hoach-60-buoi',
  '0.5 — All 60 sessions, as published by FLM|||0.5 — Kế hoạch đủ 60 buổi, nguyên bản FLM',
  'Bảng 60 buổi nguyên bản FLM: chủ đề tiếng Anh nguyên văn + cột dịch tiếng Việt + cột CLO nguyên văn + cột "Bài trên web" để đối chiếu; kèm ghi chú các chỗ bản gốc bất thường (lỗi "CLO 1" buổi 9, Assignment 2 ở buổi 51–53, hai LAB 6 buổi liền).',
  [[
    `<span class="eyebrow">SDI101m · Section 0 · Lesson 0.5</span>
<h2>The 60-session plan</h2>
<p class="lead">This is the university's schedule, row for row, so you can match any page on this site to the paper you were given. The last column is <strong>our</strong> mapping to the lessons here — it is not part of the syllabus.</p>
<p class="nhan">` + NGUON + ` — Session plan, all 60 rows, topics and CLO column verbatim</p>
<div class="callout"><span class="badge">Shape of the course</span> Sessions <strong>1–11</strong> electromagnetism · <strong>12–14</strong> Assignment 1 · <strong>15</strong> Progress Test 1 · <strong>16–21</strong> LAB 1 (RLC) · <strong>22–50</strong> semiconductors and devices · <strong>51–53</strong> Assignment 2 · <strong>54</strong> Progress Test 2 · <strong>55–60</strong> LAB 2. Two lecture blocks, two assignments, two tests, two labs.</div>
<table>
  <thead><tr><th>#</th><th>Topic (FLM, verbatim)</th><th>CLO (FLM, verbatim)</th><th>Page here</th></tr></thead>
  <tbody>
` + hangBuoi(false) + `
  </tbody>
</table>
<div class="callout warn"><strong>Four things in the original table to know about before class.</strong><br>
<strong>1. Session 9 is tagged "CLO 1", with a space.</strong> Every other row writes CLO1, CLO3 and so on with no space. Same outcome; a keystroke. Kept as published.<br>
<strong>2. Assignment 2 sits at sessions 51–53, in the middle of the semiconductor block</strong> — yet the Assessments table tags Assignment 2 with <strong>CLO2</strong>, which is about RLC circuits and electrical safety, taught at sessions 15–21. We do not resolve the contradiction; we point at it. See lesson 0.2.<br>
<strong>3. Progress Test 1 (session 15) is tagged "CLO1, CLO2" here but "CLO1" in the Assessments table</strong>; Progress Test 2 (session 54) is "CLO3, CLO4" here but "CLO3" there. Prepare for the wider reading.<br>
<strong>4. Each LAB runs six consecutive sessions</strong> (16–21 and 55–60) and each is worth 5%. The Duration column of the Assessments table gives 270 minutes per lab, which at 45 minutes per session is exactly those six sessions — the one place where the two tables agree perfectly.</div>
<div class="note-ct"><strong>How to use this table</strong> (our suggestion): before each session, open the page in the last column and read it once. The sessions you can never postpone are the ones that carry marks — <strong>12–14</strong> and <strong>51–53</strong> (Assignment 1 and 2, 10% each), <strong>15</strong> and <strong>54</strong> (Progress Tests, 15% each), <strong>16–21</strong> and <strong>55–60</strong> (LAB 1 and 2, 5% each). That is 60% of the grade sitting in 20 of the 60 sessions.</div>`,
    `<span class="eyebrow">SDI101m · Mục 0 · Bài 0.5</span>
<h2>Kế hoạch 60 buổi</h2>
<p class="lead">Đây là lịch của trường, từng dòng một, để bạn đối chiếu được mọi trang trên web này với bản trường phát. Cột cuối là ánh xạ <strong>của web</strong> sang các bài ở đây — không thuộc syllabus.</p>
<p class="nhan">` + NGUON + ` — bảng kế hoạch, đủ 60 dòng, cột chủ đề và cột CLO giữ nguyên văn</p>
<div class="callout"><span class="badge">Hình dáng cả môn</span> Buổi <strong>1–11</strong> vật lý điện từ · <strong>12–14</strong> Assignment 1 · <strong>15</strong> Progress Test 1 · <strong>16–21</strong> LAB 1 (mạch RLC) · <strong>22–50</strong> bán dẫn và linh kiện · <strong>51–53</strong> Assignment 2 · <strong>54</strong> Progress Test 2 · <strong>55–60</strong> LAB 2. Hai khối bài giảng, hai bài tập lớn, hai bài kiểm tra, hai bài lab.</div>
<table>
  <thead><tr><th>#</th><th>Chủ đề (FLM, nguyên văn)</th><th>Dịch tiếng Việt</th><th>CLO (FLM, nguyên văn)</th><th>Bài trên web</th></tr></thead>
  <tbody>
` + hangBuoi(true) + `
  </tbody>
</table>
<div class="callout warn"><strong>Bốn chỗ trong bảng gốc cần biết trước khi vào lớp.</strong><br>
<strong>1. Buổi 9 gắn "CLO 1", có dấu cách.</strong> Mọi dòng khác viết CLO1, CLO3… không dấu cách. Cùng một chuẩn đầu ra; chỉ là một cú gõ. Giữ nguyên như bản công bố.<br>
<strong>2. Assignment 2 nằm ở buổi 51–53, giữa khối bán dẫn</strong> — trong khi bảng Assessments gắn Assignment 2 với <strong>CLO2</strong>, tức mạch RLC và an toàn điện, được dạy ở buổi 15–21. Web không tự giải quyết chỗ trái ngược đó; web chỉ ra nó. Xem bài 0.2.<br>
<strong>3. Progress Test 1 (buổi 15) ở đây ghi "CLO1, CLO2" nhưng bảng Assessments ghi "CLO1"</strong>; Progress Test 2 (buổi 54) ở đây là "CLO3, CLO4" nhưng bên kia là "CLO3". Hãy ôn theo cách đọc rộng hơn.<br>
<strong>4. Mỗi LAB chạy sáu buổi liền</strong> (16–21 và 55–60) và mỗi LAB được 5%. Cột Duration của bảng Assessments ghi 270 phút một lab, mà 270 phút chia 45 phút/buổi đúng bằng sáu buổi đó — đây là chỗ duy nhất hai bảng khớp nhau hoàn hảo.</div>
<div class="note-ct"><strong>Dùng bảng này thế nào</strong> (gợi ý của web): trước mỗi buổi, mở bài ở cột cuối đọc một lượt. Những buổi không bao giờ được hoãn là những buổi có điểm — <strong>12–14</strong> và <strong>51–53</strong> (Assignment 1 và 2, mỗi cái 10%), <strong>15</strong> và <strong>54</strong> (Progress Test, mỗi bài 15%), <strong>16–21</strong> và <strong>55–60</strong> (LAB 1 và 2, mỗi bài 5%). Đó là 60% điểm môn nằm trong 20 trên 60 buổi.</div>`,
  ]]);

/* ── 0.6 Nhiệm vụ sinh viên ───────────────────────────────────────────────── */
const l06 = doc('sdi101m-0-6-nhiem-vu-sinh-vien',
  '0.6 — Student tasks: the four rules, verbatim|||0.6 — Nhiệm vụ sinh viên: bốn quy định, nguyên văn',
  'Bốn gạch đầu dòng StudentTasks của FLM nguyên văn kèm dịch và nghĩa thực tế: dự ≥80% buổi mới được thi cuối kỳ (vắng tối đa 12/60), làm và nộp đúng hạn mọi bài tập/assignment/lab, chỉ dùng laptop để học, theo FLM để lấy thông tin mới nhất.',
  [[
    `<span class="eyebrow">SDI101m · Section 0 · Lesson 0.6</span>
<h2>What the syllabus requires of you</h2>
<p class="lead">Four lines in the StudentTasks field. The first one can end your semester, so read it first.</p>
<p class="nhan">` + NGUON + ` — StudentTasks, verbatim (four bullets, nothing omitted)</p>
<table>
  <thead><tr><th>#</th><th>Verbatim (FLM)</th><th>What it means day to day</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Students must attend at least 80% of contact slots in order to be accepted to the final examination.</td><td>60 sessions → you may miss <strong>at most 12</strong>. Miss the 13th and you are not admitted to the Final exam — which is <strong>40%</strong> of the grade, the largest single mark in the course.</td></tr>
    <tr><td>2</td><td>Student is responsible to do all exercises, assignments and labs given by instructor in class or at home and submit on time</td><td>This line is where the 30% of Assignment 1 + Assignment 2 + Lab 1 + Lab 2 comes from. Note that this syllabus names <strong>labs</strong> explicitly — LAB 1 and LAB 2 occupy twelve sessions between them.</td></tr>
    <tr><td>3</td><td>Use laptop in class only for learning purpose</td><td>A conduct rule. The teaching method is "Active Learning", so the laptop is expected to be open — for the work, not for anything else.</td></tr>
    <tr><td>4</td><td>Promptly access to the FU FLM at https://flm.fpt.edu.vn/ for up-to-date course information</td><td>FLM is the source of truth for deadlines and announcements. This site follows syllabus 12239 (decision 1286/QĐ-ĐHFPT, 22/11/2024); if FLM and this site ever disagree, <strong>FLM wins</strong>.</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>The 80% rule is the only one that cannot be repaired at the end of the semester.</strong> A weak mark can be pulled up by the next mark; a 13th absence cannot be pulled up by anything, and it costs you a 40% exam. Count your own absences — do not assume someone will warn you.</div>
<div class="note-ct"><strong>A study routine that fits the syllabus' own numbers</strong> (ours, not a rule): the syllabus budgets <strong>104 self-study hours</strong> against 45 contact hours — about <strong>7 hours a week</strong> outside class over a 15-week semester. For a course like this one, split it: <strong>3h re-deriving the formulas by hand</strong> (writing Gauss' law out yourself is what makes the depletion region make sense at session 32), <strong>2.5h on numerical exercises</strong> with the units written next to every number, <strong>1.5h on the Assignment</strong>. Reading a formula is not the same as being able to reproduce it, and 30% of your grade is two closed-book multiple-choice tests.</div>`,
    `<span class="eyebrow">SDI101m · Mục 0 · Bài 0.6</span>
<h2>Trường yêu cầu gì ở bạn</h2>
<p class="lead">Bốn dòng trong ô StudentTasks. Dòng đầu có thể kết thúc cả học kỳ của bạn, nên đọc nó trước.</p>
<p class="nhan">` + NGUON + ` — ô StudentTasks, nguyên văn (bốn gạch đầu dòng, không lược bỏ)</p>
<table>
  <thead><tr><th>#</th><th>Nguyên văn (FLM)</th><th>Nghĩa thực tế hằng ngày</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Students must attend at least 80% of contact slots in order to be accepted to the final examination.</td><td>Dự ít nhất 80% số buổi mới được vào thi cuối kỳ. 60 buổi → vắng <strong>tối đa 12</strong>. Vắng buổi thứ 13 là không được thi Final exam — mà đó là <strong>40%</strong> điểm môn, đầu điểm lớn nhất của cả môn.</td></tr>
    <tr><td>2</td><td>Student is responsible to do all exercises, assignments and labs given by instructor in class or at home and submit on time</td><td>Làm hết bài tập, assignment và lab giảng viên giao ở lớp hoặc ở nhà, nộp đúng hạn. Dòng này là nơi sinh ra 30% của Assignment 1 + Assignment 2 + Lab 1 + Lab 2. Chú ý syllabus này nhắc thẳng chữ <strong>labs</strong> — LAB 1 và LAB 2 chiếm tổng mười hai buổi.</td></tr>
    <tr><td>3</td><td>Use laptop in class only for learning purpose</td><td>Chỉ dùng laptop trong lớp cho việc học. Đây là quy định về nề nếp. Phương pháp dạy là "Active Learning" nên laptop được mong là mở — để làm việc, không để làm việc khác.</td></tr>
    <tr><td>4</td><td>Promptly access to the FU FLM at https://flm.fpt.edu.vn/ for up-to-date course information</td><td>Vào FLM thường xuyên để lấy thông tin mới nhất. FLM là nguồn sự thật về hạn nộp và thông báo. Web này bám syllabus 12239 (QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024); nếu FLM và web có chỗ nào khác nhau thì <strong>FLM đúng</strong>.</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>Quy định 80% là thứ duy nhất không sửa được vào cuối kỳ.</strong> Một đầu điểm yếu còn có đầu điểm sau kéo lên; buổi vắng thứ 13 thì không có gì kéo lại, và nó lấy của bạn một kỳ thi 40%. Hãy tự đếm số buổi vắng của mình — đừng trông vào việc sẽ có ai nhắc.</div>
<div class="note-ct"><strong>Một nếp học khớp với chính con số của syllabus</strong> (gợi ý của web, không phải quy định): syllabus dành <strong>104 giờ tự học</strong> so với 45 giờ lên lớp — khoảng <strong>7 giờ mỗi tuần</strong> ngoài lớp cho một kỳ 15 tuần. Với một môn như thế này hãy chia: <strong>3h tự suy lại công thức bằng tay</strong> (chính việc tự viết lại định luật Gauss là thứ làm vùng nghèo ở buổi 32 trở nên dễ hiểu), <strong>2,5h làm bài tập có số</strong> và viết đơn vị bên cạnh từng con số, <strong>1,5h làm Assignment</strong>. Đọc hiểu một công thức không giống với việc tái hiện lại được nó, và 30% điểm môn là hai bài trắc nghiệm không được mở tài liệu.</div>`,
  ]]);

/* ── Quiz Mục 0 ───────────────────────────────────────────────────────────── */
const q0 = quiz('sdi101m-0-quiz', 'Quiz 0 — Do you know the rules of SDI101m?|||Quiz 0 — Bạn đã nắm luật chơi của SDI101m chưa?', [
  { id: 'q1',
    question: 'Which mark has the LARGEST weight in SDI101m?|||Đầu điểm nào có trọng số LỚN NHẤT của SDI101m?',
    options: ['Progress test 1, 15%|||Progress test 1, 15%', 'Final exam, 40%|||Final exam, 40%', 'Assignment 1, 10%|||Assignment 1, 10%', 'Lab 1, 5%|||Lab 1, 5%'],
    correctIndex: 1, points: 1,
    explanation: 'Final exam is 40%. The seven weights are 10 + 10 + 5 + 5 + 15 + 15 + 40 = 100%.|||Final exam 40%. Bảy trọng số là 10 + 10 + 5 + 5 + 15 + 15 + 40 = 100%.' },
  { id: 'q2',
    question: 'How long is each Lab, and what is it worth?|||Mỗi bài Lab dài bao lâu và được bao nhiêu phần trăm?',
    options: ['45 minutes, 15%|||45 phút, 15%', '135 minutes, 10%|||135 phút, 10%', '270 minutes, 5%|||270 phút, 5%', '60 minutes, 40%|||60 phút, 40%'],
    correctIndex: 2, points: 1,
    explanation: 'The Assessments table: Lab 1 and Lab 2 are 270 minutes each and 5% each. 45 minutes / 15% is a Progress test; 135 minutes / 10% is an Assignment.|||Bảng Assessments: Lab 1 và Lab 2 mỗi bài 270 phút và mỗi bài 5%. 45 phút / 15% là Progress test; 135 phút / 10% là Assignment.' },
  { id: 'q3',
    question: 'At which session does the course switch from electromagnetism to semiconductors?|||Môn học chuyển từ vật lý điện từ sang bán dẫn ở buổi nào?',
    options: ['Session 12|||Buổi 12', 'Session 16|||Buổi 16', 'Session 22|||Buổi 22', 'Session 31|||Buổi 31'],
    correctIndex: 2, points: 1,
    explanation: 'Sessions 1–21 are electromagnetism (CLO1, CLO2); session 22 "Overview, Semiconductor History & Industry" opens the semiconductor half (CLO3, CLO4) which runs to session 60.|||Buổi 1–21 là vật lý điện từ (CLO1, CLO2); buổi 22 "Overview, Semiconductor History & Industry" mở nửa bán dẫn (CLO3, CLO4) và chạy tới buổi 60.' },
  { id: 'q4',
    question: 'How many of the four FLM materials are marked "Is Main Material = True"?|||Trong bốn tài liệu FLM, bao nhiêu cái được đánh dấu "Is Main Material = True"?',
    options: ['One — only Streetman|||Một — chỉ Streetman', 'Two|||Hai', 'Three — Streetman and both KAIST courses|||Ba — Streetman và cả hai khoá KAIST', 'All four|||Cả bốn'],
    correctIndex: 2, points: 1,
    explanation: 'Rows 1, 2 and 3 are all True: Solid State Electronic Devices (Streetman & Banerjee, 7th, ISBN 9780132017206) plus Semiconductor Physics and Devices 1 and 2 from KAIST. Principles of Physics (Halliday, ISBN 9780470561584) is the reference.|||Dòng 1, 2 và 3 đều True: Solid State Electronic Devices (Streetman & Banerjee, bản 7, ISBN 9780132017206) cộng Semiconductor Physics and Devices 1 và 2 của KAIST. Principles of Physics (Halliday, ISBN 9780470561584) là tài liệu tham khảo.' },
  { id: 'q5',
    question: 'The two KAIST Coursera courses are…|||Hai khoá Coursera của KAIST là…',
    options: ['Completely free, certificate included|||Miễn phí hoàn toàn, có cả chứng chỉ', 'Free to audit; you pay only for the certificate|||Học (audit) miễn phí; chỉ trả tiền nếu muốn lấy chứng chỉ', 'Paid, with no free option|||Trả phí, không có cách học miễn phí', 'Only available to KAIST students|||Chỉ sinh viên KAIST học được'],
    correctIndex: 1, points: 1,
    explanation: 'Auditing is free — every lecture and reading. The fee buys the certificate, nothing else. Saying just "free" or just "paid" is wrong.|||Audit thì miễn phí — xem hết bài giảng và tài liệu. Tiền chỉ mua chứng chỉ, không mua gì khác. Nói cộc lốc "miễn phí" hay "trả phí" đều sai.' },
  { id: 'q6',
    question: 'What does the FLM syllabus publish in the Tools field for SDI101m?|||Ô Tools của syllabus SDI101m trên FLM công bố gì?',
    options: ['LTspice and MATLAB|||LTspice và MATLAB', 'Nothing — the field is empty|||Không gì cả — ô đó để trống', 'A digital multimeter and an oscilloscope|||Đồng hồ đo và máy hiện sóng', 'nanoHUB|||nanoHUB'],
    correctIndex: 1, points: 1,
    explanation: 'The Tools field is completely empty, even though the course has two LAB blocks (sessions 16–21 and 55–60). The honest answer is that the university publishes no tool — ask your lecturer, and do not trust a guessed software name.|||Ô Tools để trống hoàn toàn, dù môn có hai khối LAB (buổi 16–21 và 55–60). Câu trả lời trung thực là trường không công bố công cụ nào — hãy hỏi giảng viên, và đừng tin một cái tên phần mềm do ai đó đoán ra.' },
  { id: 'q7',
    question: 'With 60 sessions, the 80% attendance rule means you may miss at most how many?|||Với 60 buổi, quy định dự ≥80% nghĩa là vắng tối đa mấy buổi?',
    options: ['6|||6', '12|||12', '15|||15', '20|||20'],
    correctIndex: 1, points: 1,
    explanation: '80% of 60 = 48 sessions attended, so at most 12 absences — and the penalty is losing access to the 40% final exam.|||80% của 60 = phải dự 48 buổi, nên vắng tối đa 12 buổi — và hậu quả là mất quyền thi cuối kỳ 40%.' },
  { id: 'q8',
    question: 'Assignment 2 is tagged CLO2 (RLC circuits, electrical safety). Where does the session plan schedule it?|||Assignment 2 gắn CLO2 (mạch RLC, an toàn điện). Kế hoạch buổi xếp nó ở đâu?',
    options: ['Sessions 16–18, inside LAB 1|||Buổi 16–18, trong LAB 1', 'Sessions 12–14, right after the electromagnetism block|||Buổi 12–14, ngay sau khối điện từ', 'Sessions 51–53, in the middle of the semiconductor block|||Buổi 51–53, giữa khối bán dẫn', 'Sessions 59–60, at the very end|||Buổi 59–60, ở cuối cùng'],
    correctIndex: 2, points: 1,
    explanation: 'Sessions 51, 52 and 53 — between the AI-chip sessions and Progress Test 2, where every neighbouring session is tagged CLO3. Sessions 12–14 are Assignment 1. This mismatch is in the published syllabus; the site reports it and does not "fix" it.|||Buổi 51, 52 và 53 — giữa hai buổi chip AI và Progress Test 2, nơi mọi buổi lân cận đều gắn CLO3. Buổi 12–14 là Assignment 1. Chỗ lệch này nằm trong bản syllabus trường công bố; web nêu ra và KHÔNG tự "sửa".' },
], 540);

/* ════════════════════════════════════════════════════════════════════════════
 * CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1–11): TOÀN BỘ phần vật lý điện từ. CLO1 (+CLO2).
 * ⚠️ MỌI con số trong chương này đã kiểm bằng python3 (scratchpad/sdi101m/
 *    kiem.py và kiem2.py). Hằng số dùng nhất quán cả chương:
 *      q = 1,602e-19 C · k = 8,99e9 N·m²/C² · ε0 = 8,854e-12 F/m
 *      k_B = 1,380649e-23 J/K · h = 6,626e-34 J·s · c = 2,998e8 m/s
 *      m_e = 9,109e-31 kg · μ0 = 4π×1e-7 H/m · εr(Si) = 11,7 · εr(SiO2) = 3,9
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── 1.1 buổi 1: Đo lường & đơn vị SI ────────────────────────────────────── */
const l11 = doc('sdi101m-1-1-do-luong',
  '1.1 — Measurement: the SI units this course runs on|||1.1 — Đo lường: bộ đơn vị SI mà cả môn này chạy trên',
  'Buổi 1, CLO1: bảy đơn vị cơ bản SI, đơn vị dẫn xuất của điện (C, V, F, Ω, T, H), tiền tố từ femto tới tera, bảng hằng số dùng suốt môn, electron-volt, và bẫy lớn nhất của ngành bán dẫn: cm lẫn với m. Có ví dụ tính và bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 1 · CLO1</span>
<h2>Measurement — the units this whole course runs on</h2>
<p class="lead">After this session you can write any quantity in this course with the right unit, convert between the metre-world and the centimetre-world that semiconductor engineers actually use, and check a formula for correctness using nothing but its units.</p>
<p class="nhan">` + NGUON + ` · session 1 — "Course Introduction; Measurement"</p>
<h3>Why a semiconductor course opens with units</h3>
<p>Because in this subject the numbers are absurd and the units are the only handrail. A doping concentration is 10<sup>16</sup> per cubic centimetre. A gate oxide is 2 nanometres thick. A field inside that oxide is 5 million volts per centimetre. Get an exponent wrong and the answer is not slightly wrong — it is wrong by a factor of a million, and it still <em>looks</em> like a number. The habit that protects you is: <strong>write the unit next to every number, on every line, including the intermediate ones</strong>.</p>
<h3>The seven SI base units</h3>
<table>
  <thead><tr><th>Quantity</th><th>Unit</th><th>Symbol</th><th>Where it shows up here</th></tr></thead>
  <tbody>
    <tr><td>length</td><td>metre</td><td>m</td><td>oxide thickness, depletion width, channel length</td></tr>
    <tr><td>mass</td><td>kilogram</td><td>kg</td><td>electron mass in m·v and in ½mv²</td></tr>
    <tr><td>time</td><td>second</td><td>s</td><td>switching delay, carrier lifetime, RC constants</td></tr>
    <tr><td>electric current</td><td>ampere</td><td>A</td><td>drain current, diode current</td></tr>
    <tr><td>temperature</td><td>kelvin</td><td>K</td><td>always 300 K unless stated — carrier counts depend on it</td></tr>
    <tr><td>amount of substance</td><td>mole</td><td>mol</td><td>doping chemistry</td></tr>
    <tr><td>luminous intensity</td><td>candela</td><td>cd</td><td>LED output (session 43–44)</td></tr>
  </tbody>
</table>
<h3>The derived units you will actually type</h3>
<table>
  <thead><tr><th>Quantity</th><th>Unit</th><th>In base units</th><th>Session</th></tr></thead>
  <tbody>
    <tr><td>charge Q</td><td>coulomb (C)</td><td>A·s</td><td>2</td></tr>
    <tr><td>electric field E</td><td>volt per metre (V/m)</td><td>also N/C — the same thing</td><td>3</td></tr>
    <tr><td>potential V</td><td>volt (V)</td><td>J/C</td><td>5</td></tr>
    <tr><td>capacitance C</td><td>farad (F)</td><td>C/V</td><td>6</td></tr>
    <tr><td>resistance R</td><td>ohm (Ω)</td><td>V/A</td><td>7</td></tr>
    <tr><td>magnetic field B</td><td>tesla (T)</td><td>N/(A·m)</td><td>9</td></tr>
    <tr><td>inductance L</td><td>henry (H)</td><td>V·s/A</td><td>10</td></tr>
    <tr><td>energy</td><td>joule (J)</td><td>N·m</td><td>5</td></tr>
  </tbody>
</table>
<h3>Prefixes — the ones this course lives in</h3>
<div class="diagram"><pre>  f       p       n       µ       m       (1)     k       M       G       T
 1e-15   1e-12   1e-9    1e-6    1e-3            1e3     1e6     1e9     1e12
femto   pico    nano    micro   milli           kilo    mega    giga    tera
  |       |       |       |       |               |       |       |       |
 fF of  pF of   nm of   µm of   mA of          kΩ of   MV/cm   GHz of  T-flops
 gate   circuit oxide   wafer   drain          bias    field   clock   of chip
 cap    cap     &amp; gate  feature current                                (s.49-50)</pre></div>
<h3>The constants — use these everywhere in this course</h3>
<table>
  <thead><tr><th>Constant</th><th>Symbol</th><th>Value</th><th>Unit</th></tr></thead>
  <tbody>
    <tr><td>elementary charge</td><td>q</td><td>1.602 × 10⁻¹⁹</td><td>C</td></tr>
    <tr><td>Coulomb constant</td><td>k = 1/(4πε₀)</td><td>8.99 × 10⁹</td><td>N·m²/C²</td></tr>
    <tr><td>vacuum permittivity</td><td>ε₀</td><td>8.854 × 10⁻¹²</td><td>F/m</td></tr>
    <tr><td>Boltzmann constant</td><td>k<sub>B</sub></td><td>1.380649 × 10⁻²³</td><td>J/K</td></tr>
    <tr><td>Planck constant</td><td>h</td><td>6.626 × 10⁻³⁴</td><td>J·s</td></tr>
    <tr><td>speed of light</td><td>c</td><td>2.998 × 10⁸</td><td>m/s</td></tr>
    <tr><td>electron rest mass</td><td>m<sub>e</sub></td><td>9.109 × 10⁻³¹</td><td>kg</td></tr>
    <tr><td>vacuum permeability</td><td>μ₀</td><td>4π × 10⁻⁷</td><td>H/m</td></tr>
    <tr><td>relative permittivity of Si</td><td>ε<sub>r</sub></td><td>11.7</td><td>—</td></tr>
    <tr><td>relative permittivity of SiO₂</td><td>ε<sub>r</sub></td><td>3.9</td><td>—</td></tr>
  </tbody>
</table>
<h3>The electron-volt, and why it exists</h3>
<p>A joule is a terrible unit for one electron. So we define: <strong>1 eV is the energy one elementary charge gains crossing a potential difference of 1 volt</strong>.</p>
<div class="formula">1 eV = q × 1 V = 1.602 × 10⁻¹⁹ J</div>
<p>This is why the band gap of silicon is written <strong>1.12 eV</strong> and not 1.794 × 10⁻¹⁹ J. And it is why the thermal energy at room temperature, <strong>k<sub>B</sub>T ≈ 0.0259 eV</strong>, can be compared with 1.12 eV at a glance: room temperature is about 43 times too small to lift an electron across the gap — which is exactly why pure silicon barely conducts.</p>
<h3>Worked example 1 — orders of magnitude on a wafer</h3>
<p>A 300 mm wafer has radius r = 150 mm = 15.0 cm. Area = πr².</p>
<div class="out">A = π × (15.0 cm)² = <b>706.858 cm²</b> = 0.0706858 m²<br>Gate length of a modern transistor ≈ 5 nm = 5 × 10⁻⁹ m<br>Ratio wafer diameter / gate length = 0.300 m ÷ 5 × 10⁻⁹ m = <b>6 × 10⁷</b></div>
<p>Seven orders of magnitude on one disc. That is the reason this industry needs both centimetres and nanometres in the same sentence.</p>
<h3>Worked example 2 — checking a formula with units only</h3>
<p>The drift current density formula from session 28 is J = q·n·μ·E. Is it dimensionally right? Substitute the units engineers use:</p>
<div class="out">[q] = C · [n] = cm⁻³ · [μ] = cm²/(V·s) · [E] = V/cm<br>C × cm⁻³ × cm² × V⁻¹ s⁻¹ × V × cm⁻¹<br>= C × cm<sup>(−3+2−1)</sup> × s⁻¹ = C × cm⁻² × s⁻¹<br>= (C/s) / cm² = <b>A/cm²</b> — a current density. ✔</div>
<p>You just verified a formula you have not been taught yet, without knowing any physics. Do this on every formula in the exam: if the units do not come out right, the formula is copied wrong.</p>
<div class="callout warn"><strong>The centimetre trap — the single most common source of wrong answers in this course.</strong> Semiconductor practice uses <strong>cm</strong>: concentrations in cm⁻³, mobility in cm²/(V·s), resistivity in Ω·cm, fields in V/cm or MV/cm. But ε₀ and every SI formula use <strong>m</strong>. The two conversions you will need constantly:<br>
<strong>1 cm⁻³ = 10⁶ m⁻³</strong> (because 1 m³ = 10⁶ cm³) · <strong>1 cm²/(V·s) = 10⁻⁴ m²/(V·s)</strong> · <strong>1 V/cm = 100 V/m</strong> · <strong>1 MV/cm = 10⁸ V/m</strong>.</div>
<div class="pitfall"><b>Mixing cm and m in one formula.</b> Putting n in cm⁻³ next to ε₀ in F/m gives an answer wrong by 10⁶. Decide which system the whole line is in <em>before</em> you start. <b>Forgetting that 1 nm = 10⁻⁹ m, not 10⁻⁶.</b> Micro is 10⁻⁶ (a wafer feature), nano is 10⁻⁹ (an oxide). <b>Writing eV where J is needed.</b> An eV is an energy, but you cannot put it into ½mv² — multiply by 1.602 × 10⁻¹⁹ first. <b>Dropping the unit on intermediate lines</b> and only writing it on the answer. That is where the exponent gets lost, every time.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A donor concentration is given as N<sub>D</sub> = 10¹⁶ cm⁻³ and an electron mobility as μ<sub>n</sub> = 1350 cm²/(V·s). Rewrite both in pure SI units.</p>
<div class="dap-an"><div class="out">N<sub>D</sub> = 10¹⁶ cm⁻³ × 10⁶ = <b>10²² m⁻³</b><br>μ<sub>n</sub> = 1350 cm²/(V·s) × 10⁻⁴ = <b>0.135 m²/(V·s)</b></div>
<p>Why it matters: session 32 computes the depletion field with ε<sub>Si</sub> in F/m, so N<sub>D</sub> must be in m⁻³ on that line. Convert once, at the start, and label it.</p></div>
<p><b>E2.</b> A gate oxide is 2 nm thick and the silicon lattice constant is 0.543 nm. How many lattice constants thick is the oxide, and what field does 1 V across it produce (in V/m and in MV/cm)?</p>
<div class="dap-an"><div class="out">2 nm ÷ 0.543 nm = <b>3.68</b> lattice constants<br>E = V/d = 1 V ÷ 2 × 10⁻⁹ m = <b>5 × 10⁸ V/m</b> = <b>5 MV/cm</b></div>
<p>Two lessons in one answer. The insulator that holds a modern transistor together is under four atomic spacings thick, and one volt across it produces a field of five million volts per centimetre — within a factor of two of where SiO₂ breaks down. That is why gate voltages fell as transistors shrank.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 1 · CLO1</span>
<h2>Đo lường — bộ đơn vị mà cả môn này chạy trên</h2>
<p class="lead">Học xong buổi này bạn viết được mọi đại lượng của môn kèm đúng đơn vị, đổi qua lại được giữa thế giới mét và thế giới centimet mà dân bán dẫn thật sự dùng, và kiểm được một công thức đúng hay sai chỉ bằng đơn vị của nó.</p>
<p class="nhan">` + NGUON + ` · buổi 1 — "Course Introduction; Measurement"</p>
<h3>Vì sao môn bán dẫn lại mở đầu bằng đơn vị</h3>
<p>Vì trong môn này các con số đều vô lý, và đơn vị là tay vịn duy nhất. Một nồng độ pha tạp là 10<sup>16</sup> trên một centimet khối. Một lớp oxit cổng dày 2 nanomet. Điện trường trong lớp oxit đó là 5 triệu volt trên centimet. Sai một số mũ thì đáp án không phải "hơi sai" — nó sai đi một triệu lần, mà nhìn vào vẫn <em>giống</em> một con số. Thói quen bảo vệ bạn là: <strong>viết đơn vị bên cạnh mọi con số, ở mọi dòng, kể cả dòng trung gian</strong>.</p>
<h3>Bảy đơn vị cơ bản SI</h3>
<table>
  <thead><tr><th>Đại lượng</th><th>Đơn vị</th><th>Ký hiệu</th><th>Xuất hiện ở đâu trong môn</th></tr></thead>
  <tbody>
    <tr><td>độ dài</td><td>mét</td><td>m</td><td>bề dày oxit, bề rộng vùng nghèo, chiều dài kênh</td></tr>
    <tr><td>khối lượng</td><td>kilôgam</td><td>kg</td><td>khối lượng electron trong m·v và trong ½mv²</td></tr>
    <tr><td>thời gian</td><td>giây</td><td>s</td><td>thời gian chuyển mạch, thời gian sống hạt tải, hằng số RC</td></tr>
    <tr><td>cường độ dòng điện</td><td>ampe</td><td>A</td><td>dòng máng (drain), dòng diode</td></tr>
    <tr><td>nhiệt độ</td><td>kelvin</td><td>K</td><td>luôn là 300 K nếu không nói gì khác — số hạt tải phụ thuộc nó</td></tr>
    <tr><td>lượng chất</td><td>mol</td><td>mol</td><td>hoá học của pha tạp</td></tr>
    <tr><td>cường độ sáng</td><td>candela</td><td>cd</td><td>quang thông LED (buổi 43–44)</td></tr>
  </tbody>
</table>
<h3>Đơn vị dẫn xuất mà bạn sẽ gõ thật</h3>
<table>
  <thead><tr><th>Đại lượng</th><th>Đơn vị</th><th>Theo đơn vị cơ bản</th><th>Buổi</th></tr></thead>
  <tbody>
    <tr><td>điện tích Q</td><td>coulomb (C)</td><td>A·s</td><td>2</td></tr>
    <tr><td>điện trường E</td><td>volt trên mét (V/m)</td><td>cũng là N/C — cùng một thứ</td><td>3</td></tr>
    <tr><td>điện thế V</td><td>volt (V)</td><td>J/C</td><td>5</td></tr>
    <tr><td>điện dung C</td><td>fara (F)</td><td>C/V</td><td>6</td></tr>
    <tr><td>điện trở R</td><td>ôm (Ω)</td><td>V/A</td><td>7</td></tr>
    <tr><td>cảm ứng từ B</td><td>tesla (T)</td><td>N/(A·m)</td><td>9</td></tr>
    <tr><td>độ tự cảm L</td><td>henry (H)</td><td>V·s/A</td><td>10</td></tr>
    <tr><td>năng lượng</td><td>jun (J)</td><td>N·m</td><td>5</td></tr>
  </tbody>
</table>
<h3>Tiền tố — những cái mà môn này sống trong đó</h3>
<div class="diagram"><pre>  f       p       n       µ       m       (1)     k       M       G       T
 1e-15   1e-12   1e-9    1e-6    1e-3            1e3     1e6     1e9     1e12
femto   pico    nano    micro   mili            kilo    mega    giga    tera
  |       |       |       |       |               |       |       |       |
 fF của pF của  nm của  µm của  mA dòng        kΩ điện  MV/cm   GHz xung TFLOPS
 tụ cổng tụ mạch oxit   chi tiết máng          trở      điện    nhịp    của chip
                &amp; cổng  trên wafer                     trường           (buổi 49-50)</pre></div>
<h3>Bảng hằng số — dùng đúng bộ này suốt cả môn</h3>
<table>
  <thead><tr><th>Hằng số</th><th>Ký hiệu</th><th>Giá trị</th><th>Đơn vị</th></tr></thead>
  <tbody>
    <tr><td>điện tích nguyên tố</td><td>q</td><td>1,602 × 10⁻¹⁹</td><td>C</td></tr>
    <tr><td>hằng số Coulomb</td><td>k = 1/(4πε₀)</td><td>8,99 × 10⁹</td><td>N·m²/C²</td></tr>
    <tr><td>hằng số điện của chân không</td><td>ε₀</td><td>8,854 × 10⁻¹²</td><td>F/m</td></tr>
    <tr><td>hằng số Boltzmann</td><td>k<sub>B</sub></td><td>1,380649 × 10⁻²³</td><td>J/K</td></tr>
    <tr><td>hằng số Planck</td><td>h</td><td>6,626 × 10⁻³⁴</td><td>J·s</td></tr>
    <tr><td>tốc độ ánh sáng</td><td>c</td><td>2,998 × 10⁸</td><td>m/s</td></tr>
    <tr><td>khối lượng nghỉ electron</td><td>m<sub>e</sub></td><td>9,109 × 10⁻³¹</td><td>kg</td></tr>
    <tr><td>hằng số từ của chân không</td><td>μ₀</td><td>4π × 10⁻⁷</td><td>H/m</td></tr>
    <tr><td>hằng số điện môi tương đối của Si</td><td>ε<sub>r</sub></td><td>11,7</td><td>—</td></tr>
    <tr><td>hằng số điện môi tương đối của SiO₂</td><td>ε<sub>r</sub></td><td>3,9</td><td>—</td></tr>
  </tbody>
</table>
<h3>Electron-volt, và vì sao nó tồn tại</h3>
<p>Jun là một đơn vị tệ cho một electron. Nên người ta định nghĩa: <strong>1 eV là năng lượng một điện tích nguyên tố nhận được khi đi qua hiệu điện thế 1 volt</strong>.</p>
<div class="formula">1 eV = q × 1 V = 1,602 × 10⁻¹⁹ J</div>
<p>Đó là lý do khe cấm của silic được viết là <strong>1,12 eV</strong> chứ không phải 1,794 × 10⁻¹⁹ J. Và đó là lý do năng lượng nhiệt ở nhiệt độ phòng, <strong>k<sub>B</sub>T ≈ 0,0259 eV</strong>, có thể so với 1,12 eV chỉ bằng một cái nhìn: nhiệt độ phòng nhỏ hơn khoảng 43 lần so với mức cần để nhấc một electron qua khe cấm — và đó chính là lý do silic tinh khiết gần như không dẫn điện.</p>
<h3>Ví dụ 1 — bậc độ lớn trên một phiến wafer</h3>
<p>Một wafer 300 mm có bán kính r = 150 mm = 15,0 cm. Diện tích = πr².</p>
<div class="out">A = π × (15,0 cm)² = <b>706,858 cm²</b> = 0,0706858 m²<br>Chiều dài cổng của một transistor hiện đại ≈ 5 nm = 5 × 10⁻⁹ m<br>Tỷ số đường kính wafer / chiều dài cổng = 0,300 m ÷ 5 × 10⁻⁹ m = <b>6 × 10⁷</b></div>
<p>Bảy bậc độ lớn trên cùng một cái đĩa. Đó là lý do ngành này cần cả centimet lẫn nanomet trong cùng một câu.</p>
<h3>Ví dụ 2 — kiểm một công thức chỉ bằng đơn vị</h3>
<p>Công thức mật độ dòng trôi của buổi 28 là J = q·n·μ·E. Nó có đúng về thứ nguyên không? Thay bằng đơn vị mà dân kỹ thuật dùng:</p>
<div class="out">[q] = C · [n] = cm⁻³ · [μ] = cm²/(V·s) · [E] = V/cm<br>C × cm⁻³ × cm² × V⁻¹ s⁻¹ × V × cm⁻¹<br>= C × cm<sup>(−3+2−1)</sup> × s⁻¹ = C × cm⁻² × s⁻¹<br>= (C/s) / cm² = <b>A/cm²</b> — đúng là một mật độ dòng. ✔</div>
<p>Bạn vừa kiểm được một công thức chưa hề được dạy, mà không cần biết vật lý nào. Hãy làm đúng việc này với mọi công thức trong đề thi: nếu đơn vị không ra đúng thì công thức đã bị chép sai.</p>
<div class="callout warn"><strong>Bẫy centimet — nguồn sai đáp án phổ biến nhất của cả môn.</strong> Thực hành bán dẫn dùng <strong>cm</strong>: nồng độ theo cm⁻³, độ linh động theo cm²/(V·s), điện trở suất theo Ω·cm, điện trường theo V/cm hoặc MV/cm. Nhưng ε₀ và mọi công thức SI lại dùng <strong>m</strong>. Bốn phép đổi bạn sẽ cần liên tục:<br>
<strong>1 cm⁻³ = 10⁶ m⁻³</strong> (vì 1 m³ = 10⁶ cm³) · <strong>1 cm²/(V·s) = 10⁻⁴ m²/(V·s)</strong> · <strong>1 V/cm = 100 V/m</strong> · <strong>1 MV/cm = 10⁸ V/m</strong>.</div>
<div class="pitfall"><b>Trộn cm với m trong cùng một công thức.</b> Đặt n theo cm⁻³ cạnh ε₀ theo F/m cho đáp án sai 10⁶ lần. Hãy quyết hệ đơn vị cho CẢ dòng <em>trước khi</em> bắt đầu tính. <b>Quên rằng 1 nm = 10⁻⁹ m, không phải 10⁻⁶.</b> Micro là 10⁻⁶ (chi tiết trên wafer), nano là 10⁻⁹ (lớp oxit). <b>Viết eV ở chỗ cần J.</b> eV là một năng lượng, nhưng không thể nhét nó vào ½mv² — phải nhân 1,602 × 10⁻¹⁹ trước. <b>Bỏ đơn vị ở các dòng trung gian</b> và chỉ viết đơn vị ở đáp án. Số mũ bị mất chính ở chỗ đó, lần nào cũng vậy.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Một nồng độ donor cho là N<sub>D</sub> = 10¹⁶ cm⁻³ và độ linh động electron là μ<sub>n</sub> = 1350 cm²/(V·s). Hãy viết lại cả hai theo đơn vị SI thuần.</p>
<div class="dap-an"><div class="out">N<sub>D</sub> = 10¹⁶ cm⁻³ × 10⁶ = <b>10²² m⁻³</b><br>μ<sub>n</sub> = 1350 cm²/(V·s) × 10⁻⁴ = <b>0,135 m²/(V·s)</b></div>
<p>Vì sao quan trọng: buổi 32 tính điện trường trong vùng nghèo với ε<sub>Si</sub> theo F/m, nên N<sub>D</sub> buộc phải ở m⁻³ trên dòng đó. Hãy đổi một lần, ngay đầu bài, và ghi nhãn rõ.</p></div>
<p><b>B2.</b> Một lớp oxit cổng dày 2 nm, hằng số mạng của silic là 0,543 nm. Lớp oxit đó dày bằng bao nhiêu hằng số mạng, và 1 V đặt lên nó sinh ra điện trường bao nhiêu (theo V/m và theo MV/cm)?</p>
<div class="dap-an"><div class="out">2 nm ÷ 0,543 nm = <b>3,68</b> hằng số mạng<br>E = V/d = 1 V ÷ 2 × 10⁻⁹ m = <b>5 × 10⁸ V/m</b> = <b>5 MV/cm</b></div>
<p>Hai bài học trong một đáp án. Lớp cách điện giữ cả một transistor hiện đại đứng được dày chưa tới bốn khoảng cách nguyên tử, và một volt đặt lên nó sinh ra điện trường năm triệu volt trên centimet — chỉ còn cách ngưỡng đánh thủng của SiO₂ một hệ số chừng hai. Đó là lý do điện áp cổng phải hạ xuống khi transistor thu nhỏ.</p></div>`,
  ]]);

/* ── 1.2 buổi 2: Định luật Coulomb ───────────────────────────────────────── */
const l12 = doc('sdi101m-1-2-dinh-luat-coulomb',
  '1.2 — Coulomb\'s Law: the force between two charges|||1.2 — Định luật Coulomb: lực giữa hai điện tích',
  'Buổi 2, CLO1: định luật Coulomb F = k·q₁·q₂/r², nghĩa vật lý của từng ký hiệu, dấu của điện tích và chiều của lực, nguyên lý chồng chập, vai trò hằng số điện môi (lực trong Si nhỏ hơn 11,7 lần). Ba ví dụ tính có số và bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 2 · CLO1</span>
<h2>Coulomb's Law</h2>
<p class="lead">After this session you can compute the force between any two charges, get its direction right from the signs alone, add several forces by superposition, and say why the same two charges pull on each other 11.7 times more weakly inside silicon than in vacuum.</p>
<p class="nhan">` + NGUON + ` · session 2 — "Coulomb's Law"</p>
<h3>The law</h3>
<div class="formula">F = k · |q₁ · q₂| / r²&nbsp;&nbsp;&nbsp;with k = 1/(4πε₀) = 8.99 × 10⁹ N·m²/C²</div>
<table>
  <thead><tr><th>Symbol</th><th>Meaning</th><th>Unit</th><th>Physical reading</th></tr></thead>
  <tbody>
    <tr><td>F</td><td>force between the two charges</td><td>N</td><td>equal and opposite on each — Newton's third law holds here too</td></tr>
    <tr><td>q₁, q₂</td><td>the two charges</td><td>C</td><td>double one charge and the force doubles</td></tr>
    <tr><td>r</td><td>distance between them</td><td>m</td><td>halve it and the force goes up <strong>four</strong> times</td></tr>
    <tr><td>k</td><td>Coulomb constant</td><td>N·m²/C²</td><td>a property of the <em>medium</em>, not of the charges</td></tr>
  </tbody>
</table>
<h3>What "inverse square" actually means</h3>
<p>The r² in the denominator is not a decorative exponent. It is geometry: the influence of a point charge spreads over the surface of a sphere, and the area of that sphere is 4πr². Spread the same amount of influence over four times the area and you get a quarter of the effect. Every inverse-square law in physics — gravity, light intensity, sound — comes from the same spherical geometry.</p>
<div class="diagram"><pre>  r doubles  ->  sphere area x4  ->  force /4

     q+                q+
      *----r----o       *---------2r---------o
              F = F0                        F = F0/4</pre></div>
<h3>Sign and direction — treat them separately</h3>
<p>Put the <em>magnitudes</em> into the formula, then decide direction from the signs:</p>
<ul>
<li><strong>Same signs</strong> (+ +, or − −) → <strong>repulsion</strong>, pushing apart along the line joining them.</li>
<li><strong>Opposite signs</strong> (+ −) → <strong>attraction</strong>, pulling together along that line.</li>
</ul>
<p>Force is a vector; the formula gives only its length. Feeding a negative charge in with its minus sign and then also reasoning about direction is how you end up with the force pointing the wrong way.</p>
<h3>Worked example 1 — two charges on a bench</h3>
<p>q₁ = +2 nC and q₂ = −3 nC, separated by r = 5 cm. Find the force.</p>
<div class="out">F = 8.99 × 10⁹ × (2 × 10⁻⁹ × 3 × 10⁻⁹) ÷ (0.05)²<br>&nbsp;&nbsp;&nbsp;= 8.99 × 10⁹ × 6 × 10⁻¹⁸ ÷ 2.5 × 10⁻³<br>&nbsp;&nbsp;&nbsp;= 5.394 × 10⁻⁸ ÷ 2.5 × 10⁻³<br>&nbsp;&nbsp;&nbsp;= <b>2.1576 × 10⁻⁵ N = 21.6 µN</b><br>Signs are opposite → <b>attraction</b>.</div>
<p>Note that 5 cm had to become 0.05 m before squaring. Squaring the 5 would have given an answer 10 000 times too small.</p>
<h3>Worked example 2 — inside a hydrogen atom</h3>
<p>Electron and proton, r = 5.29 × 10⁻¹¹ m (the Bohr radius), each carrying one elementary charge.</p>
<div class="out">F = 8.99 × 10⁹ × (1.602 × 10⁻¹⁹)² ÷ (5.29 × 10⁻¹¹)²<br>&nbsp;&nbsp;&nbsp;= <b>8.245 × 10⁻⁸ N = 82.4 nN</b></div>
<p>Eighty nanonewtons sounds like nothing. On an electron of mass 9.109 × 10⁻³¹ kg it is an enormous force — which is why atoms hold together at all, and why it takes an energy of order an electron-volt to pull a valence electron loose. That energy is the band gap of session 25.</p>
<h3>Worked example 3 — superposition on a line</h3>
<p>q₁ = +1 nC at x = 0, q₂ = +1 nC at x = 10 cm. What force acts on q₃ = +2 nC placed at x = 4 cm?</p>
<div class="out">From q₁ (4 cm away, pushes in +x):<br>F₃₁ = 8.99e9 × 1e-9 × 2e-9 ÷ (0.04)² = <b>1.12375 × 10⁻⁵ N</b><br>From q₂ (6 cm away, pushes in −x):<br>F₃₂ = 8.99e9 × 1e-9 × 2e-9 ÷ (0.06)² = <b>4.99444 × 10⁻⁶ N</b><br>Net = 1.12375e-5 − 4.99444e-6 = <b>6.243 × 10⁻⁶ N in the +x direction</b></div>
<p><strong>Superposition</strong> is the rule that makes everything later possible: the force from many charges is the vector sum of the individual forces, each computed as if the others were absent. The field of a whole depletion region (session 32) is built exactly this way.</p>
<h3>Why k changes inside a material</h3>
<p>Inside a dielectric, the medium's own charges shift slightly and partly cancel the field. We account for it with the relative permittivity ε<sub>r</sub>:</p>
<div class="formula">F = q₁·q₂ / (4π · ε<sub>r</sub> · ε₀ · r²)&nbsp;&nbsp;→&nbsp;&nbsp;force in silicon is <strong>11.7 times weaker</strong> than in vacuum at the same distance</div>
<p>This single number is why a dopant atom in silicon holds its extra electron so loosely that room temperature can free it — the whole basis of doping in session 26.</p>
<div class="pitfall"><b>Not converting cm to m before squaring.</b> (5 cm)² is 0.0025 m², not 25. This is the most frequent arithmetic loss of marks on this topic. <b>Putting the minus sign of a negative charge into the formula and then also arguing about direction</b> — decide direction from the signs, feed magnitudes to the formula. <b>Using k = 8.99 × 10⁹ inside silicon.</b> Divide by ε<sub>r</sub> = 11.7 when the charges sit in silicon, by 3.9 in SiO₂. <b>Confusing r with a coordinate.</b> r is the distance <em>between the two charges</em>, not a position on an axis.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Two electrons are 1 nm apart in vacuum. What force do they exert on each other, and in which direction?</p>
<div class="dap-an"><div class="out">F = 8.99 × 10⁹ × (1.602 × 10⁻¹⁹)² ÷ (1 × 10⁻⁹)²<br>&nbsp;&nbsp;&nbsp;= 8.99e9 × 2.5664 × 10⁻³⁸ ÷ 1 × 10⁻¹⁸<br>&nbsp;&nbsp;&nbsp;= <b>2.307 × 10⁻¹⁰ N = 0.231 nN</b>, <b>repulsive</b> (both negative)</div>
<p>One nanometre is about half a gate-oxide thickness, and two electrons that close push each other with a fifth of a nanonewton. Squeezing charge into small volumes costs energy — that is where the whole idea of capacitance comes from in session 6.</p></div>
<p><b>E2.</b> Two charges of 1 µC each are in vacuum. How far apart must they be for the force between them to be exactly 1 N?</p>
<div class="dap-an"><div class="out">r = √(k·q₁·q₂ / F) = √(8.99 × 10⁹ × 10⁻⁶ × 10⁻⁶ ÷ 1)<br>&nbsp;&nbsp;&nbsp;= √(8.99 × 10⁻³) = <b>0.0948 m = 9.48 cm</b></div>
<p>Rearranging for r is the standard second half of any Coulomb question. Notice the sanity check available for free: a microcoulomb is a <em>huge</em> charge on this scale, so it must produce 1 N at a human distance — and it does, about 9.5 cm.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 2 · CLO1</span>
<h2>Định luật Coulomb</h2>
<p class="lead">Học xong buổi này bạn tính được lực giữa hai điện tích bất kỳ, xác định đúng chiều của nó chỉ từ dấu, cộng được nhiều lực bằng nguyên lý chồng chập, và nói được vì sao cũng hai điện tích ấy hút nhau yếu đi 11,7 lần khi nằm trong silic so với trong chân không.</p>
<p class="nhan">` + NGUON + ` · buổi 2 — "Coulomb's Law"</p>
<h3>Định luật</h3>
<div class="formula">F = k · |q₁ · q₂| / r²&nbsp;&nbsp;&nbsp;với k = 1/(4πε₀) = 8,99 × 10⁹ N·m²/C²</div>
<table>
  <thead><tr><th>Ký hiệu</th><th>Ý nghĩa</th><th>Đơn vị</th><th>Đọc theo nghĩa vật lý</th></tr></thead>
  <tbody>
    <tr><td>F</td><td>lực giữa hai điện tích</td><td>N</td><td>bằng nhau và ngược chiều trên mỗi bên — định luật 3 Newton vẫn đúng ở đây</td></tr>
    <tr><td>q₁, q₂</td><td>hai điện tích</td><td>C</td><td>gấp đôi một điện tích thì lực gấp đôi</td></tr>
    <tr><td>r</td><td>khoảng cách giữa chúng</td><td>m</td><td>giảm một nửa thì lực tăng <strong>bốn</strong> lần</td></tr>
    <tr><td>k</td><td>hằng số Coulomb</td><td>N·m²/C²</td><td>là tính chất của <em>môi trường</em>, không phải của điện tích</td></tr>
  </tbody>
</table>
<h3>"Nghịch đảo bình phương" thực ra nghĩa là gì</h3>
<p>Số r² dưới mẫu không phải một số mũ trang trí. Nó là hình học: ảnh hưởng của một điện tích điểm lan ra trên mặt một hình cầu, và diện tích hình cầu đó là 4πr². Lan cùng một lượng ảnh hưởng ra diện tích gấp bốn thì nhận được một phần tư hiệu ứng. Mọi định luật nghịch đảo bình phương trong vật lý — hấp dẫn, cường độ sáng, âm thanh — đều sinh ra từ đúng hình học cầu ấy.</p>
<div class="diagram"><pre>  r gap doi  ->  dien tich cau x4  ->  luc /4

     q+                q+
      *----r----o       *---------2r---------o
              F = F0                        F = F0/4</pre></div>
<h3>Dấu và chiều — xử lý tách nhau</h3>
<p>Hãy đưa <em>độ lớn</em> vào công thức, rồi mới xác định chiều từ dấu:</p>
<ul>
<li><strong>Cùng dấu</strong> (+ +, hoặc − −) → <strong>đẩy nhau</strong>, đẩy ra xa theo đường nối hai điện tích.</li>
<li><strong>Trái dấu</strong> (+ −) → <strong>hút nhau</strong>, kéo lại gần theo đúng đường đó.</li>
</ul>
<p>Lực là một vectơ; công thức chỉ cho độ dài của nó. Vừa nhét dấu trừ của điện tích âm vào công thức vừa lập luận về chiều là cách chắc chắn nhất để ra lực ngược hướng.</p>
<h3>Ví dụ 1 — hai điện tích trên bàn</h3>
<p>q₁ = +2 nC và q₂ = −3 nC, cách nhau r = 5 cm. Tìm lực.</p>
<div class="out">F = 8,99 × 10⁹ × (2 × 10⁻⁹ × 3 × 10⁻⁹) ÷ (0,05)²<br>&nbsp;&nbsp;&nbsp;= 8,99 × 10⁹ × 6 × 10⁻¹⁸ ÷ 2,5 × 10⁻³<br>&nbsp;&nbsp;&nbsp;= 5,394 × 10⁻⁸ ÷ 2,5 × 10⁻³<br>&nbsp;&nbsp;&nbsp;= <b>2,1576 × 10⁻⁵ N = 21,6 µN</b><br>Hai điện tích trái dấu → <b>hút nhau</b>.</div>
<p>Chú ý 5 cm phải thành 0,05 m TRƯỚC khi bình phương. Bình phương số 5 sẽ cho đáp án nhỏ đi 10 000 lần.</p>
<h3>Ví dụ 2 — bên trong một nguyên tử hydro</h3>
<p>Electron và proton, r = 5,29 × 10⁻¹¹ m (bán kính Bohr), mỗi hạt mang một điện tích nguyên tố.</p>
<div class="out">F = 8,99 × 10⁹ × (1,602 × 10⁻¹⁹)² ÷ (5,29 × 10⁻¹¹)²<br>&nbsp;&nbsp;&nbsp;= <b>8,245 × 10⁻⁸ N = 82,4 nN</b></div>
<p>Tám mươi nanonewton nghe như chẳng có gì. Với một electron khối lượng 9,109 × 10⁻³¹ kg thì đó là một lực khổng lồ — và đó là lý do nguyên tử gắn kết được, cũng là lý do phải tốn năng lượng cỡ một electron-volt mới bứt được một electron hoá trị ra. Năng lượng đó chính là khe cấm của buổi 25.</p>
<h3>Ví dụ 3 — chồng chập trên một đường thẳng</h3>
<p>q₁ = +1 nC ở x = 0, q₂ = +1 nC ở x = 10 cm. Lực tác dụng lên q₃ = +2 nC đặt ở x = 4 cm là bao nhiêu?</p>
<div class="out">Từ q₁ (cách 4 cm, đẩy theo chiều +x):<br>F₃₁ = 8,99e9 × 1e-9 × 2e-9 ÷ (0,04)² = <b>1,12375 × 10⁻⁵ N</b><br>Từ q₂ (cách 6 cm, đẩy theo chiều −x):<br>F₃₂ = 8,99e9 × 1e-9 × 2e-9 ÷ (0,06)² = <b>4,99444 × 10⁻⁶ N</b><br>Tổng hợp = 1,12375e-5 − 4,99444e-6 = <b>6,243 × 10⁻⁶ N theo chiều +x</b></div>
<p><strong>Nguyên lý chồng chập</strong> là quy tắc làm cho mọi thứ về sau trở nên khả thi: lực từ nhiều điện tích là tổng vectơ của từng lực riêng, mỗi lực tính như thể các điện tích khác không có mặt. Điện trường của cả một vùng nghèo (buổi 32) được dựng lên đúng theo cách này.</p>
<h3>Vì sao k thay đổi khi ở trong vật liệu</h3>
<p>Bên trong một chất điện môi, các điện tích của chính vật liệu dịch đi một chút và triệt tiêu một phần điện trường. Ta kể đến điều đó bằng hằng số điện môi tương đối ε<sub>r</sub>:</p>
<div class="formula">F = q₁·q₂ / (4π · ε<sub>r</sub> · ε₀ · r²)&nbsp;&nbsp;→&nbsp;&nbsp;lực trong silic <strong>yếu hơn 11,7 lần</strong> so với trong chân không ở cùng khoảng cách</div>
<p>Chỉ một con số đó thôi đã là lý do một nguyên tử tạp trong silic giữ electron thừa của nó lỏng đến mức nhiệt độ phòng cũng giải phóng được — chính là nền tảng của pha tạp ở buổi 26.</p>
<div class="pitfall"><b>Không đổi cm sang m trước khi bình phương.</b> (5 cm)² là 0,0025 m², không phải 25. Đây là chỗ mất điểm số học thường gặp nhất của chủ đề này. <b>Nhét dấu trừ của điện tích âm vào công thức rồi lại lập luận thêm về chiều</b> — hãy xác định chiều từ dấu, và đưa độ lớn vào công thức. <b>Dùng k = 8,99 × 10⁹ ở trong silic.</b> Phải chia cho ε<sub>r</sub> = 11,7 khi điện tích nằm trong silic, chia 3,9 khi trong SiO₂. <b>Lẫn r với một toạ độ.</b> r là khoảng cách <em>giữa hai điện tích</em>, không phải vị trí trên một trục.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Hai electron cách nhau 1 nm trong chân không. Chúng tác dụng lên nhau lực bao nhiêu, và theo chiều nào?</p>
<div class="dap-an"><div class="out">F = 8,99 × 10⁹ × (1,602 × 10⁻¹⁹)² ÷ (1 × 10⁻⁹)²<br>&nbsp;&nbsp;&nbsp;= 8,99e9 × 2,5664 × 10⁻³⁸ ÷ 1 × 10⁻¹⁸<br>&nbsp;&nbsp;&nbsp;= <b>2,307 × 10⁻¹⁰ N = 0,231 nN</b>, <b>đẩy nhau</b> (cùng âm)</div>
<p>Một nanomet là cỡ nửa bề dày lớp oxit cổng, và hai electron gần nhau tới thế đẩy nhau bằng một phần năm nanonewton. Dồn điện tích vào một thể tích nhỏ thì phải trả giá bằng năng lượng — và từ đó sinh ra toàn bộ khái niệm điện dung ở buổi 6.</p></div>
<p><b>B2.</b> Hai điện tích mỗi cái 1 µC trong chân không. Chúng phải cách nhau bao xa để lực giữa chúng đúng bằng 1 N?</p>
<div class="dap-an"><div class="out">r = √(k·q₁·q₂ / F) = √(8,99 × 10⁹ × 10⁻⁶ × 10⁻⁶ ÷ 1)<br>&nbsp;&nbsp;&nbsp;= √(8,99 × 10⁻³) = <b>0,0948 m = 9,48 cm</b></div>
<p>Biến đổi để rút r ra là nửa sau chuẩn mực của mọi câu hỏi Coulomb. Chú ý một phép kiểm tỉnh táo có sẵn miễn phí: một micrôcoulomb là điện tích <em>khổng lồ</em> ở thang này, nên nó phải tạo ra 1 N ở một khoảng cách cỡ bàn tay người — và đúng vậy, khoảng 9,5 cm.</p></div>`,
  ]]);

/* ── 1.3 buổi 3: Điện trường ─────────────────────────────────────────────── */
const l13 = doc('sdi101m-1-3-dien-truong',
  '1.3 — Electric Fields: the force per unit charge|||1.3 — Điện trường: lực trên một đơn vị điện tích',
  'Buổi 3, CLO1: định nghĩa E = F/q, trường của điện tích điểm E = kq/r², đường sức, trường đều giữa hai bản E = V/d, lực và gia tốc của electron trong trường. Ví dụ tính trường trong lớp oxit 2 nm và bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 3 · CLO1</span>
<h2>Electric fields</h2>
<p class="lead">After this session you can compute the field of a point charge, read a field-line picture, work with the uniform field between two plates, and calculate the force and acceleration a field puts on an electron — the calculation that becomes "drift velocity" in session 28.</p>
<p class="nhan">` + NGUON + ` · session 3 — "Electric Fields"</p>
<h3>Why invent the field at all</h3>
<p>Coulomb's law needs two charges. But a transistor has 10¹⁶ dopant atoms per cm³, and nobody computes 10¹⁶ pairwise forces. So we split the problem in two: first ask <em>what condition does this arrangement of charge create in space?</em> — that is the <strong>field</strong> — and only then ask <em>what happens to a charge placed in it?</em></p>
<div class="formula">E = F / q&nbsp;&nbsp;&nbsp;⟺&nbsp;&nbsp;&nbsp;F = q · E&nbsp;&nbsp;&nbsp;[E] = N/C = V/m</div>
<p>E is the force a <strong>unit positive test charge</strong> would feel. Its two unit names are identical: N/C and V/m are the same unit written from two directions, which is the first hint that field and voltage are two views of one thing (session 5).</p>
<h3>Field of a point charge</h3>
<div class="formula">E = k · |q| / r²&nbsp;&nbsp;&nbsp;pointing <strong>away</strong> from a positive q, <strong>towards</strong> a negative q</div>
<h3>Field lines — the rules</h3>
<div class="diagram"><pre>   point charge +q          point charge -q         two plates (uniform)
        \   |   /                \  |  /            + + + + + + + + + +
         \  |  /                  \ | /             |  |  |  |  |  |  |
       ----(+)----                --(-)--           v  v  v  v  v  v  v
         /  |  \                  / | \             - - - - - - - - - -
        /   |   \                /  |  \            E = V/d, same everywhere
   lines go OUT            lines come IN            between the plates</pre></div>
<ul>
<li>Lines <strong>start on positive</strong> charge and <strong>end on negative</strong> charge.</li>
<li>The <strong>density of lines</strong> is the strength of E. Crowded lines, strong field.</li>
<li>Lines <strong>never cross</strong> — if they did, the field would have two directions at one point.</li>
<li>The force on a <strong>positive</strong> charge is along the line; on an <strong>electron</strong> it is exactly opposite. Remember this once and you will never again get the direction of drift current wrong.</li>
</ul>
<h3>Worked example 1 — field of a small charge</h3>
<p>q = 4 nC. What is E at r = 2 cm?</p>
<div class="out">E = 8.99 × 10⁹ × 4 × 10⁻⁹ ÷ (0.02)²<br>&nbsp;&nbsp;&nbsp;= 35.96 ÷ 4 × 10⁻⁴ = <b>8.99 × 10⁴ V/m</b>, directed away from q</div>
<h3>Worked example 2 — the uniform field, and the field inside a gate oxide</h3>
<p>Between two parallel plates a distance d apart, held at a potential difference V, the field is uniform:</p>
<div class="formula">E = V / d</div>
<p>This is the geometry of the MOS gate you will meet at session 38: metal gate, thin oxide, silicon. Put 5 V across an oxide 100 nm thick, then across one 2 nm thick:</p>
<div class="out">d = 100 nm: E = 5 V ÷ 100 × 10⁻⁹ m = <b>5 × 10⁷ V/m</b> = 0.5 MV/cm<br>d = 2 nm, V = 1.2 V: E = 1.2 ÷ 2 × 10⁻⁹ = <b>6 × 10⁸ V/m</b> = <b>6 MV/cm</b><br>SiO₂ breaks down at roughly 1 × 10⁹ V/m ≈ 10 MV/cm</div>
<p>So a modern gate runs at more than half the breakdown field of its own insulator, permanently. That is not sloppy engineering — it is the price of a thin oxide, and the reason supply voltages fell from 5 V to about 1 V as oxides thinned.</p>
<h3>Worked example 3 — what a field does to an electron</h3>
<p>Take E = 5 × 10⁷ V/m from the example above and drop a free electron into it.</p>
<div class="out">F = q·E = 1.602 × 10⁻¹⁹ × 5 × 10⁷ = <b>8.01 × 10⁻¹² N</b><br>a = F/m<sub>e</sub> = 8.01 × 10⁻¹² ÷ 9.109 × 10⁻³¹ = <b>8.79 × 10¹⁸ m/s²</b></div>
<p>Nine billion billion metres per second squared. If nothing got in the way, that electron would pass the speed of light in a fraction of a nanosecond. Something does get in the way: inside a crystal the electron collides with the lattice every ~0.1 ps, so instead of accelerating forever it reaches a modest steady <strong>drift velocity</strong>. Mobility μ (session 28) is nothing more than the bookkeeping for those collisions.</p>
<div class="pitfall"><b>Using E = kq/r² for a uniform field.</b> Between plates the field does not fall off with distance — it is V/d everywhere. Pick the formula from the geometry. <b>Forgetting that the force on an electron is opposite to E.</b> The field points one way, the electron moves the other; conventional current then points back along E. <b>Leaving d in nm inside V/d.</b> 5 V ÷ 2 nm is not 2.5; it is 2.5 × 10⁹ V/m only after nm becomes 10⁻⁹ m. <b>Saying "the field at the charge itself".</b> E = kq/r² diverges as r → 0; the formula describes the field a point charge creates <em>elsewhere</em>.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A single ionised donor atom in silicon has lost one electron, so it carries +q. Ignoring the screening of the crystal, what field does it create 1 µm away?</p>
<div class="dap-an"><div class="out">E = 8.99 × 10⁹ × 1.602 × 10⁻¹⁹ ÷ (1 × 10⁻⁶)²<br>&nbsp;&nbsp;&nbsp;= 1.4402 × 10⁻⁹ ÷ 1 × 10⁻¹² = <b>1440 V/m</b></div>
<p>One atom, a field of 1.4 kV/m at a micron. Now recall there are 10¹⁶ of them per cm³ in a doped region: session 32 does not add up 10¹⁶ such fields one by one — it uses Gauss' law (session 4) to get the answer in one line. That is what the next session is for.</p></div>
<p><b>E2.</b> An oxide is 2 nm thick. At what gate voltage does the field in it reach 10 MV/cm, the rough breakdown field of SiO₂?</p>
<div class="dap-an"><div class="out">10 MV/cm = 1 × 10⁹ V/m<br>V = E · d = 1 × 10⁹ × 2 × 10⁻⁹ = <b>2 V</b></div>
<p>Two volts destroys a 2 nm oxide. Modern logic runs at about 0.8–1.2 V, so the margin is less than a factor of three — and this is exactly why a static-electricity spark from your finger (thousands of volts) destroys a chip instantly, and why wafer handling uses grounded wrist straps. The electrical-safety part of CLO2 starts here, not in the lab.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 3 · CLO1</span>
<h2>Điện trường</h2>
<p class="lead">Học xong buổi này bạn tính được điện trường của một điện tích điểm, đọc được hình vẽ đường sức, làm việc được với trường đều giữa hai bản, và tính được lực cùng gia tốc mà trường gây ra cho một electron — đúng phép tính sẽ thành "vận tốc trôi" ở buổi 28.</p>
<p class="nhan">` + NGUON + ` · buổi 3 — "Electric Fields"</p>
<h3>Vì sao phải bày ra khái niệm trường</h3>
<p>Vì định luật Coulomb cần hai điện tích. Mà một transistor có 10¹⁶ nguyên tử tạp trên mỗi cm³, và không ai đi tính 10¹⁶ lực từng đôi một. Nên ta chẻ bài toán làm hai: trước tiên hỏi <em>cách sắp xếp điện tích này tạo ra trạng thái gì trong không gian?</em> — đó là <strong>điện trường</strong> — rồi mới hỏi <em>một điện tích đặt vào đó thì bị gì?</em></p>
<div class="formula">E = F / q&nbsp;&nbsp;&nbsp;⟺&nbsp;&nbsp;&nbsp;F = q · E&nbsp;&nbsp;&nbsp;[E] = N/C = V/m</div>
<p>E là lực mà <strong>một đơn vị điện tích thử dương</strong> sẽ chịu. Hai cái tên đơn vị của nó là một: N/C và V/m là cùng một đơn vị viết từ hai phía, và đó là gợi ý đầu tiên rằng điện trường và điện áp là hai cách nhìn của cùng một thứ (buổi 5).</p>
<h3>Điện trường của một điện tích điểm</h3>
<div class="formula">E = k · |q| / r²&nbsp;&nbsp;&nbsp;hướng <strong>ra xa</strong> nếu q dương, <strong>hướng vào</strong> nếu q âm</div>
<h3>Đường sức — các quy tắc</h3>
<div class="diagram"><pre>  dien tich diem +q       dien tich diem -q       hai ban (truong deu)
        \   |   /                \  |  /          + + + + + + + + + +
         \  |  /                  \ | /           |  |  |  |  |  |  |
       ----(+)----                --(-)--          v  v  v  v  v  v  v
         /  |  \                  / | \           - - - - - - - - - -
        /   |   \                /  |  \          E = V/d, moi cho nhu nhau
   duong suc di RA         duong suc di VAO       trong khoang hai ban</pre></div>
<ul>
<li>Đường sức <strong>bắt đầu ở điện tích dương</strong> và <strong>kết thúc ở điện tích âm</strong>.</li>
<li><strong>Mật độ đường sức</strong> là độ lớn của E. Đường sức dày thì trường mạnh.</li>
<li>Đường sức <strong>không bao giờ cắt nhau</strong> — nếu cắt thì tại một điểm trường sẽ có hai hướng.</li>
<li>Lực lên điện tích <strong>dương</strong> cùng chiều đường sức; lên <strong>electron</strong> thì ngược chiều hẳn. Nhớ điều này một lần thì sẽ không bao giờ xác định sai chiều dòng trôi nữa.</li>
</ul>
<h3>Ví dụ 1 — trường của một điện tích nhỏ</h3>
<p>q = 4 nC. Điện trường tại r = 2 cm là bao nhiêu?</p>
<div class="out">E = 8,99 × 10⁹ × 4 × 10⁻⁹ ÷ (0,02)²<br>&nbsp;&nbsp;&nbsp;= 35,96 ÷ 4 × 10⁻⁴ = <b>8,99 × 10⁴ V/m</b>, hướng ra xa q</div>
<h3>Ví dụ 2 — trường đều, và trường trong lớp oxit cổng</h3>
<p>Giữa hai bản song song cách nhau d, đặt hiệu điện thế V, trường là đều:</p>
<div class="formula">E = V / d</div>
<p>Đây chính là hình học của cực cổng MOS bạn sẽ gặp ở buổi 38: kim loại cổng, lớp oxit mỏng, silic. Đặt 5 V lên lớp oxit dày 100 nm, rồi lên lớp dày 2 nm:</p>
<div class="out">d = 100 nm: E = 5 V ÷ 100 × 10⁻⁹ m = <b>5 × 10⁷ V/m</b> = 0,5 MV/cm<br>d = 2 nm, V = 1,2 V: E = 1,2 ÷ 2 × 10⁻⁹ = <b>6 × 10⁸ V/m</b> = <b>6 MV/cm</b><br>SiO₂ đánh thủng ở khoảng 1 × 10⁹ V/m ≈ 10 MV/cm</div>
<p>Vậy một cực cổng hiện đại làm việc ở hơn một nửa điện trường đánh thủng của chính lớp cách điện của nó, và làm việc như thế thường xuyên. Đó không phải kỹ thuật cẩu thả — đó là cái giá của lớp oxit mỏng, và là lý do điện áp nguồn tụt từ 5 V xuống còn khoảng 1 V khi oxit mỏng đi.</p>
<h3>Ví dụ 3 — trường làm gì với một electron</h3>
<p>Lấy E = 5 × 10⁷ V/m ở ví dụ trên và thả một electron tự do vào đó.</p>
<div class="out">F = q·E = 1,602 × 10⁻¹⁹ × 5 × 10⁷ = <b>8,01 × 10⁻¹² N</b><br>a = F/m<sub>e</sub> = 8,01 × 10⁻¹² ÷ 9,109 × 10⁻³¹ = <b>8,79 × 10¹⁸ m/s²</b></div>
<p>Chín tỉ tỉ mét trên giây bình phương. Nếu không có gì cản, electron ấy sẽ vượt tốc độ ánh sáng trong một phần nhỏ của nanogiây. Có một thứ cản thật: trong tinh thể, electron va vào mạng khoảng mỗi ~0,1 ps, nên thay vì tăng tốc mãi nó đạt một <strong>vận tốc trôi</strong> khiêm tốn và ổn định. Độ linh động μ (buổi 28) không là gì khác ngoài cách ghi sổ cho các va chạm ấy.</p>
<div class="pitfall"><b>Dùng E = kq/r² cho trường đều.</b> Giữa hai bản, trường không giảm theo khoảng cách — nó bằng V/d ở mọi chỗ. Hãy chọn công thức theo hình học. <b>Quên rằng lực lên electron ngược chiều E.</b> Trường hướng một phía, electron chạy phía kia; dòng điện quy ước lại quay về cùng chiều E. <b>Để d ở nm trong V/d.</b> 5 V ÷ 2 nm không phải 2,5; nó là 2,5 × 10⁹ V/m chỉ sau khi nm thành 10⁻⁹ m. <b>Nói "điện trường tại chính điện tích đó".</b> E = kq/r² phân kỳ khi r → 0; công thức mô tả trường mà điện tích điểm tạo ra ở <em>nơi khác</em>.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Một nguyên tử donor bị ion hoá trong silic đã mất một electron, nên nó mang +q. Bỏ qua sự che chắn của tinh thể, nó tạo ra điện trường bao nhiêu ở cách 1 µm?</p>
<div class="dap-an"><div class="out">E = 8,99 × 10⁹ × 1,602 × 10⁻¹⁹ ÷ (1 × 10⁻⁶)²<br>&nbsp;&nbsp;&nbsp;= 1,4402 × 10⁻⁹ ÷ 1 × 10⁻¹² = <b>1440 V/m</b></div>
<p>Một nguyên tử, điện trường 1,4 kV/m ở cách một micrômét. Giờ hãy nhớ rằng trong một vùng pha tạp có tới 10¹⁶ nguyên tử như thế trên mỗi cm³: buổi 32 KHÔNG cộng 10¹⁶ điện trường đó từng cái một — nó dùng định luật Gauss (buổi 4) để ra đáp án trong một dòng. Buổi sau tồn tại để làm đúng việc đó.</p></div>
<p><b>B2.</b> Một lớp oxit dày 2 nm. Ở điện áp cổng bao nhiêu thì trường trong nó đạt 10 MV/cm, tức ngưỡng đánh thủng xấp xỉ của SiO₂?</p>
<div class="dap-an"><div class="out">10 MV/cm = 1 × 10⁹ V/m<br>V = E · d = 1 × 10⁹ × 2 × 10⁻⁹ = <b>2 V</b></div>
<p>Hai volt là phá huỷ một lớp oxit 2 nm. Logic hiện đại chạy ở khoảng 0,8–1,2 V, nên biên an toàn chưa tới ba lần — và đây đúng là lý do một tia tĩnh điện từ ngón tay bạn (hàng nghìn volt) phá một con chip tức thì, cũng là lý do khi thao tác wafer người ta phải đeo vòng tay nối đất. Phần an toàn điện của CLO2 bắt đầu ở đây, không phải ở trong phòng lab.</p></div>`,
  ]]);

/* ── 1.4 buổi 4: Định luật Gauss ─────────────────────────────────────────── */
const l14 = doc('sdi101m-1-4-dinh-luat-gauss',
  '1.4 — Gauss\' Law: charge inside decides flux outside|||1.4 — Định luật Gauss: điện tích bên trong quyết định thông lượng bên ngoài',
  'Buổi 4, CLO1: thông lượng điện Φ = E·A·cosθ, định luật Gauss Φ = Q/ε₀, ba hình đối xứng (cầu, mặt phẳng, trụ), trường ngoài mặt vật dẫn σ/ε₀. Ví dụ dùng Gauss tính trường trong vùng nghèo pha tạp 10¹⁶ cm⁻³ — đúng phép tính của buổi 32.',
  [[
    `<span class="eyebrow">SDI101m · Session 4 · CLO1</span>
<h2>Gauss' Law</h2>
<p class="lead">After this session you can compute electric flux, state Gauss' law and use it on the three symmetric shapes that matter, and — the payoff — derive the field inside a doped silicon slab in three lines. That derivation <em>is</em> the p-n junction electrostatics of session 32.</p>
<p class="nhan">` + NGUON + ` · session 4 — "Gauss' Law"</p>
<h3>Electric flux — counting field lines through a surface</h3>
<div class="formula">Φ = E · A · cos θ&nbsp;&nbsp;&nbsp;[Φ] = N·m²/C = V·m</div>
<p>θ is the angle between the field and the <strong>normal</strong> (perpendicular) to the surface. Three cases worth memorising: field perpendicular to the surface (θ = 0) gives the maximum Φ = E·A; field parallel to the surface (θ = 90°) gives <strong>zero</strong> flux, because no line actually passes through; anything in between scales as cos θ.</p>
<h3>The law</h3>
<div class="formula">Φ<sub>closed surface</sub> = Q<sub>enclosed</sub> / ε₀&nbsp;&nbsp;&nbsp;(in a material: Q<sub>enc</sub> / (ε<sub>r</sub>ε₀) )</div>
<p>Read it in words: <strong>the total flux out of any closed surface depends only on the charge inside it</strong> — not on where inside, not on its shape, and not at all on charges outside. That is a remarkable statement, and it is what makes the law useful: choose a clever surface and the integral collapses to multiplication.</p>
<h3>The three shapes you will actually use</h3>
<table>
  <thead><tr><th>Symmetry</th><th>Gaussian surface</th><th>Result</th><th>Used in</th></tr></thead>
  <tbody>
    <tr><td>point charge / sphere</td><td>sphere of radius r</td><td>E = q / (4πε₀r²) — Coulomb, recovered</td><td>session 2–3</td></tr>
    <tr><td>infinite charged plane, surface density σ</td><td>a box straddling the plane</td><td>E = σ / (2ε₀), and it does <strong>not</strong> depend on distance</td><td>MOS capacitor, session 38</td></tr>
    <tr><td>just outside a charged conductor</td><td>a box with one face in the metal</td><td>E = σ / ε₀, perpendicular to the surface</td><td>gate metal, interconnect</td></tr>
  </tbody>
</table>
<p>Inside a conductor in equilibrium, E = 0 — otherwise its free charges would still be moving. All the charge sits on the surface. This is why a metal box shields its interior, and why the substrate contact of a chip defines a reference.</p>
<h3>Worked example 1 — flux from a known charge</h3>
<p>A closed surface encloses 10⁶ electrons. What is the flux through it?</p>
<div class="out">Q<sub>enc</sub> = −10⁶ × 1.602 × 10⁻¹⁹ = −1.602 × 10⁻¹³ C<br>Φ = Q/ε₀ = −1.602 × 10⁻¹³ ÷ 8.854 × 10⁻¹² = <b>−0.0181 N·m²/C</b></div>
<p>The sign is the whole message: negative flux means the lines go <em>in</em>, which is what a negative enclosure does. And note what we never needed to know — the shape of the surface, or where in it the electrons sit.</p>
<h3>Worked example 2 — the field inside doped silicon (this is session 32, early)</h3>
<p>Take an n-type region doped N<sub>D</sub> = 10¹⁶ cm⁻³ in which the mobile electrons have been swept away, leaving the fixed positive donor ions behind. This is a <strong>depletion region</strong>. Let its width be W = 0.3 µm. What field does that fixed charge build?</p>
<div class="out">Step 1 — into SI: N<sub>D</sub> = 10¹⁶ cm⁻³ × 10⁶ = 10²² m⁻³<br>Step 2 — charge density: ρ = q·N<sub>D</sub> = 1.602 × 10⁻¹⁹ × 10²² = <b>1602 C/m³</b><br>Step 3 — permittivity of silicon: ε<sub>Si</sub> = 11.7 × 8.854 × 10⁻¹² = <b>1.0359 × 10⁻¹⁰ F/m</b><br>Step 4 — Gauss in slab form, dE/dx = ρ/ε<sub>Si</sub> = 1602 ÷ 1.0359e-10 = <b>1.5465 × 10¹³ V/m per m</b><br>Step 5 — field at the edge, over W = 0.3 µm:<br>E<sub>max</sub> = (ρ/ε<sub>Si</sub>) · W = 1.5465e13 × 0.3 × 10⁻⁶ = <b>4.639 × 10⁶ V/m = 46.4 kV/cm</b><br>Step 6 — potential across it (area of the triangular E profile):<br>V = ½ · E<sub>max</sub> · W = 0.5 × 4.639e6 × 0.3e-6 = <b>0.696 V</b></div>
<div class="callout ok"><strong>Look at that last number.</strong> We assumed nothing about diodes, and out fell <strong>0.70 V</strong> — the built-in potential of a silicon p-n junction, the same 0.7 V you will use to bias every diode from session 33 onwards. It is not a magic constant from a datasheet. It is Gauss' law plus the doping of silicon.</div>
<h3>Why the field profile is a triangle</h3>
<div class="diagram"><pre>  charge density rho            field E(x)               potential V(x)
  |                             |                        |
  |######## +q.ND               |\                       |      ______
  |                             | \                      |    /
  +--------- x                  |  \                     |  /
                                +---\----- x             +/--------- x
  uniform inside W        E grows linearly from       V is the AREA under E
                         the edge inward (Gauss)      -> parabola, total 0.7 V</pre></div>
<p>Uniform charge gives a linear field (because Gauss says the slope of E is ρ/ε) and a linear field gives a parabolic potential (because V is the area under E). Those three pictures — box, triangle, parabola — are the single most reused diagram in the whole second half of this course.</p>
<div class="pitfall"><b>Using the enclosed charge wrong.</b> Only charge <em>inside</em> the closed surface counts. A charge sitting just outside contributes exactly zero net flux. <b>Forgetting cos θ.</b> Flux through a surface parallel to the field is zero, not maximum. <b>Using ε₀ inside silicon.</b> It must be ε<sub>Si</sub> = 11.7 ε₀ = 1.0359 × 10⁻¹⁰ F/m, or your field comes out 11.7 times too big. <b>Mixing cm⁻³ with F/m.</b> Convert N<sub>D</sub> to m⁻³ first — this is the step people skip, and it costs a factor of 10⁶.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Repeat worked example 2 for a more heavily doped region: N<sub>D</sub> = 10¹⁷ cm⁻³, depletion width W = 0.1 µm. Find E<sub>max</sub>.</p>
<div class="dap-an"><div class="out">N<sub>D</sub> = 10¹⁷ cm⁻³ = 10²³ m⁻³<br>ρ = 1.602 × 10⁻¹⁹ × 10²³ = <b>16 020 C/m³</b><br>E<sub>max</sub> = ρ·W / ε<sub>Si</sub> = 16 020 × 1 × 10⁻⁷ ÷ 1.0359 × 10⁻¹⁰<br>&nbsp;&nbsp;&nbsp;= <b>1.546 × 10⁷ V/m = 0.155 MV/cm</b></div>
<p>Ten times the doping and a third of the width gives roughly three times the field. The general lesson, and it will come back at session 35: <strong>doping harder makes the depletion region thinner and the field stronger</strong>. Push far enough and the field reaches the breakdown field of silicon — that is the Zener diode.</p></div>
<p><b>E2.</b> A metal plate carries a surface charge density σ = 1 × 10⁻⁶ C/m². What is the field just outside it, in vacuum?</p>
<div class="dap-an"><div class="out">E = σ / ε₀ = 1 × 10⁻⁶ ÷ 8.854 × 10⁻¹² = <b>1.129 × 10⁵ V/m</b></div>
<p>Use σ/ε₀ (not σ/2ε₀) because a conductor has field on one side only — inside the metal E = 0, so all the flux leaves through the outer face. Choosing between σ/ε₀ and σ/2ε₀ is a standard exam trap: <strong>conductor surface → σ/ε₀ · isolated thin sheet of charge → σ/2ε₀</strong>.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 4 · CLO1</span>
<h2>Định luật Gauss</h2>
<p class="lead">Học xong buổi này bạn tính được thông lượng điện, phát biểu được định luật Gauss và dùng nó trên ba hình đối xứng đáng dùng, và — phần đáng giá nhất — suy ra được điện trường trong một khối silic pha tạp trong ba dòng. Phép suy ra đó <em>chính là</em> tĩnh điện của chuyển tiếp p-n ở buổi 32.</p>
<p class="nhan">` + NGUON + ` · buổi 4 — "Gauss' Law"</p>
<h3>Thông lượng điện — đếm đường sức xuyên qua một mặt</h3>
<div class="formula">Φ = E · A · cos θ&nbsp;&nbsp;&nbsp;[Φ] = N·m²/C = V·m</div>
<p>θ là góc giữa điện trường và <strong>pháp tuyến</strong> (đường vuông góc) của mặt. Ba trường hợp nên nhớ: trường vuông góc với mặt (θ = 0) cho Φ lớn nhất là E·A; trường song song với mặt (θ = 90°) cho thông lượng <strong>bằng không</strong>, vì thật ra không có đường sức nào xuyên qua; ở giữa thì tỷ lệ theo cos θ.</p>
<h3>Định luật</h3>
<div class="formula">Φ<sub>mặt kín</sub> = Q<sub>bên trong</sub> / ε₀&nbsp;&nbsp;&nbsp;(trong vật liệu: Q<sub>trong</sub> / (ε<sub>r</sub>ε₀) )</div>
<p>Đọc bằng lời: <strong>tổng thông lượng ra khỏi một mặt kín bất kỳ chỉ phụ thuộc điện tích nằm bên trong nó</strong> — không phụ thuộc nằm ở đâu bên trong, không phụ thuộc hình dạng, và hoàn toàn không phụ thuộc các điện tích ở bên ngoài. Đó là một phát biểu đáng chú ý, và chính nó làm định luật này hữu dụng: chọn được mặt khéo thì tích phân sụp xuống thành một phép nhân.</p>
<h3>Ba hình bạn thật sự sẽ dùng</h3>
<table>
  <thead><tr><th>Tính đối xứng</th><th>Mặt Gauss chọn</th><th>Kết quả</th><th>Dùng ở</th></tr></thead>
  <tbody>
    <tr><td>điện tích điểm / hình cầu</td><td>mặt cầu bán kính r</td><td>E = q / (4πε₀r²) — thu lại đúng Coulomb</td><td>buổi 2–3</td></tr>
    <tr><td>mặt phẳng tích điện vô hạn, mật độ mặt σ</td><td>một hộp kẹp qua mặt phẳng</td><td>E = σ / (2ε₀), và <strong>không</strong> phụ thuộc khoảng cách</td><td>tụ MOS, buổi 38</td></tr>
    <tr><td>ngay bên ngoài một vật dẫn tích điện</td><td>một hộp có một mặt nằm trong kim loại</td><td>E = σ / ε₀, vuông góc với bề mặt</td><td>kim loại cổng, dây nối</td></tr>
  </tbody>
</table>
<p>Bên trong một vật dẫn ở trạng thái cân bằng, E = 0 — nếu không thì các điện tích tự do của nó vẫn còn đang chạy. Toàn bộ điện tích nằm trên bề mặt. Đó là lý do một hộp kim loại che chắn được phần bên trong, và là lý do tiếp điểm đế (substrate contact) của một con chip định ra được mốc điện thế.</p>
<h3>Ví dụ 1 — thông lượng từ một điện tích đã biết</h3>
<p>Một mặt kín bao quanh 10⁶ electron. Thông lượng qua nó là bao nhiêu?</p>
<div class="out">Q<sub>trong</sub> = −10⁶ × 1,602 × 10⁻¹⁹ = −1,602 × 10⁻¹³ C<br>Φ = Q/ε₀ = −1,602 × 10⁻¹³ ÷ 8,854 × 10⁻¹² = <b>−0,0181 N·m²/C</b></div>
<p>Dấu mới là toàn bộ thông điệp: thông lượng âm nghĩa là đường sức đi <em>vào</em>, đúng như một vùng tích điện âm phải làm. Và hãy để ý những thứ ta chưa bao giờ cần biết — hình dạng của mặt kín, hay vị trí các electron bên trong nó.</p>
<h3>Ví dụ 2 — điện trường trong silic pha tạp (đây là buổi 32, làm sớm)</h3>
<p>Lấy một vùng loại n pha tạp N<sub>D</sub> = 10¹⁶ cm⁻³ mà các electron di động đã bị quét đi hết, để lại các ion donor dương cố định. Đó là một <strong>vùng nghèo</strong>. Cho bề rộng W = 0,3 µm. Điện tích cố định đó dựng nên điện trường bao nhiêu?</p>
<div class="out">Bước 1 — đổi sang SI: N<sub>D</sub> = 10¹⁶ cm⁻³ × 10⁶ = 10²² m⁻³<br>Bước 2 — mật độ điện tích: ρ = q·N<sub>D</sub> = 1,602 × 10⁻¹⁹ × 10²² = <b>1602 C/m³</b><br>Bước 3 — hằng số điện của silic: ε<sub>Si</sub> = 11,7 × 8,854 × 10⁻¹² = <b>1,0359 × 10⁻¹⁰ F/m</b><br>Bước 4 — Gauss dạng phiến, dE/dx = ρ/ε<sub>Si</sub> = 1602 ÷ 1,0359e-10 = <b>1,5465 × 10¹³ V/m trên mỗi m</b><br>Bước 5 — trường tại biên, trên bề rộng W = 0,3 µm:<br>E<sub>max</sub> = (ρ/ε<sub>Si</sub>) · W = 1,5465e13 × 0,3 × 10⁻⁶ = <b>4,639 × 10⁶ V/m = 46,4 kV/cm</b><br>Bước 6 — điện thế trên vùng đó (diện tích của tam giác E):<br>V = ½ · E<sub>max</sub> · W = 0,5 × 4,639e6 × 0,3e-6 = <b>0,696 V</b></div>
<div class="callout ok"><strong>Hãy nhìn con số cuối.</strong> Ta chưa giả thiết gì về diode, mà rơi ra <strong>0,70 V</strong> — chính là điện thế nội của một chuyển tiếp p-n silic, đúng cái 0,7 V bạn sẽ dùng để phân cực mọi diode từ buổi 33 trở đi. Nó không phải một hằng số phép thuật lấy từ datasheet. Nó là định luật Gauss cộng với nồng độ pha tạp của silic.</div>
<h3>Vì sao dạng của điện trường là một tam giác</h3>
<div class="diagram"><pre>  mat do dien tich rho         dien truong E(x)         dien the V(x)
  |                            |                        |
  |######## +q.ND              |\                       |      ______
  |                            | \                      |    /
  +--------- x                 |  \                     |  /
                               +---\----- x             +/--------- x
  deu ben trong W       E tang tuyen tinh tu bien       V la DIEN TICH duoi E
                        vao trong (theo Gauss)          -> parabol, tong 0,7 V</pre></div>
<p>Điện tích đều cho điện trường tuyến tính (vì Gauss nói độ dốc của E là ρ/ε) và điện trường tuyến tính cho điện thế parabol (vì V là diện tích dưới đường E). Ba hình đó — hộp, tam giác, parabol — là hình vẽ được dùng lại nhiều nhất trong cả nửa sau của môn này.</p>
<div class="pitfall"><b>Dùng sai điện tích bên trong.</b> Chỉ điện tích <em>nằm trong</em> mặt kín được tính. Một điện tích nằm ngay sát bên ngoài đóng góp đúng bằng không vào thông lượng toàn phần. <b>Quên cos θ.</b> Thông lượng qua một mặt song song với điện trường là bằng không, không phải lớn nhất. <b>Dùng ε₀ ở trong silic.</b> Phải là ε<sub>Si</sub> = 11,7 ε₀ = 1,0359 × 10⁻¹⁰ F/m, nếu không điện trường ra lớn gấp 11,7 lần. <b>Trộn cm⁻³ với F/m.</b> Phải đổi N<sub>D</sub> sang m⁻³ trước — đây đúng là bước người ta hay nhảy qua, và nó làm sai 10⁶ lần.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Làm lại ví dụ 2 cho một vùng pha tạp đậm hơn: N<sub>D</sub> = 10¹⁷ cm⁻³, bề rộng vùng nghèo W = 0,1 µm. Tìm E<sub>max</sub>.</p>
<div class="dap-an"><div class="out">N<sub>D</sub> = 10¹⁷ cm⁻³ = 10²³ m⁻³<br>ρ = 1,602 × 10⁻¹⁹ × 10²³ = <b>16 020 C/m³</b><br>E<sub>max</sub> = ρ·W / ε<sub>Si</sub> = 16 020 × 1 × 10⁻⁷ ÷ 1,0359 × 10⁻¹⁰<br>&nbsp;&nbsp;&nbsp;= <b>1,546 × 10⁷ V/m = 0,155 MV/cm</b></div>
<p>Pha tạp gấp mười lần và bề rộng còn một phần ba thì điện trường mạnh lên chừng ba lần. Bài học chung, và nó sẽ quay lại ở buổi 35: <strong>pha tạp đậm hơn làm vùng nghèo mỏng hơn và điện trường mạnh hơn</strong>. Đẩy đủ xa thì điện trường đạt ngưỡng đánh thủng của silic — đó chính là diode Zener.</p></div>
<p><b>B2.</b> Một bản kim loại mang mật độ điện tích mặt σ = 1 × 10⁻⁶ C/m². Điện trường ngay bên ngoài nó, trong chân không, là bao nhiêu?</p>
<div class="dap-an"><div class="out">E = σ / ε₀ = 1 × 10⁻⁶ ÷ 8,854 × 10⁻¹² = <b>1,129 × 10⁵ V/m</b></div>
<p>Dùng σ/ε₀ (không phải σ/2ε₀) vì một vật dẫn chỉ có điện trường ở một phía — trong kim loại E = 0, nên toàn bộ thông lượng đi ra qua mặt ngoài. Chọn giữa σ/ε₀ và σ/2ε₀ là một bẫy đề thi kinh điển: <strong>bề mặt vật dẫn → σ/ε₀ · một tấm điện tích mỏng cô lập → σ/2ε₀</strong>.</p></div>`,
  ]]);

/* ── 1.5 buổi 5: Điện thế ────────────────────────────────────────────────── */
const l15 = doc('sdi101m-1-5-dien-the',
  '1.5 — Electric Potential: energy per unit charge|||1.5 — Điện thế: năng lượng trên một đơn vị điện tích',
  'Buổi 5, CLO1: điện thế V = W/q, điện thế của điện tích điểm V = kq/r, quan hệ E = −dV/dx, mặt đẳng thế, electron-volt, và điện áp nhiệt V_T = kT/q = 25,9 mV ở 300 K — hằng số xuất hiện trong mọi phương trình diode. Ví dụ tính và bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 5 · CLO1</span>
<h2>Electric potential</h2>
<p class="lead">After this session you can move between field and voltage in both directions, compute the energy a charge gains or loses crossing a potential difference, and compute the thermal voltage k<sub>B</sub>T/q — the 25.9 mV that appears in every diode equation from session 33 onwards.</p>
<p class="nhan">` + NGUON + ` · session 5 — "Electric Potential"</p>
<h3>From force to energy</h3>
<p>Fields tell you about force. Circuits are described with <em>voltage</em>, which is about energy. The bridge is one definition:</p>
<div class="formula">V = W / q&nbsp;&nbsp;&nbsp;(work per unit charge)&nbsp;&nbsp;&nbsp;[V] = J/C = volt</div>
<p>And its reverse, the one you will use constantly: the energy a charge q gains crossing a potential difference ΔV is</p>
<div class="formula">W = q · ΔV</div>
<h3>Potential of a point charge, and the crucial difference from E</h3>
<table>
  <thead><tr><th></th><th>Field E</th><th>Potential V</th></tr></thead>
  <tbody>
    <tr><td>Point charge</td><td>E = k·q/r²</td><td>V = k·q/r</td></tr>
    <tr><td>Falls off as</td><td>1/r²</td><td>1/r — <strong>more slowly</strong></td></tr>
    <tr><td>Kind of quantity</td><td><strong>vector</strong> — has direction</td><td><strong>scalar</strong> — just a number</td></tr>
    <tr><td>Adding several sources</td><td>vector sum (components, angles)</td><td><strong>plain algebraic sum</strong></td></tr>
  </tbody>
</table>
<p>That last row is why potential is the physicist's favourite: adding up V from many charges is arithmetic, while adding up E is trigonometry. When a problem gives you a choice, go through V.</p>
<h3>The link between E and V</h3>
<div class="formula">E = − dV/dx&nbsp;&nbsp;&nbsp;and, for a uniform field,&nbsp;&nbsp;&nbsp;V = E · d</div>
<p>In words: <strong>the field is the slope of the potential, and it points downhill</strong>. The minus sign is the statement that a positive charge is pushed from high potential to low. Look again at the three-picture diagram of session 4 — box, triangle, parabola: the triangle is the slope of the parabola. That is this formula.</p>
<h3>Equipotential surfaces</h3>
<div class="diagram"><pre>     .-''-.            equipotentials (dashed) are ALWAYS
   .'      '.           perpendicular to field lines (arrows)
  ;   .--.   ;
  |  ; (+) ; |    -->   moving a charge ALONG an equipotential
  ;   '--'   ;          costs NO work  (W = q.dV = 0)
   '.      .'
     '-..-'             for a point charge: concentric spheres
                        for two plates: flat parallel planes</pre></div>
<h3>Worked example 1 — accelerating an electron</h3>
<p>An electron starts at rest and crosses a potential difference of 10 V. How much energy does it gain, and how fast is it going?</p>
<div class="out">W = q·ΔV = 1.602 × 10⁻¹⁹ × 10 = <b>1.602 × 10⁻¹⁸ J = 10 eV</b><br>Set W = ½m<sub>e</sub>v² → v = √(2·q·V / m<sub>e</sub>)<br>v = √(2 × 1.602e-19 × 10 ÷ 9.109e-31) = √(3.517 × 10¹²)<br>&nbsp;&nbsp;= <b>1.875 × 10⁶ m/s</b></div>
<p>Ten volts, and the electron is doing 1.9 million metres per second — about 0.6% of the speed of light. Notice the shortcut the eV gives you: "10 V of potential" and "10 eV of energy" are the same statement for one elementary charge, so no exponent arithmetic is needed to compare energies.</p>
<h3>Worked example 2 — the thermal voltage, the most reused number in the course</h3>
<p>A particle in thermal equilibrium at temperature T carries a random thermal energy of order k<sub>B</sub>T. Expressed as a voltage, that is the <strong>thermal voltage</strong>:</p>
<div class="formula">V<sub>T</sub> = k<sub>B</sub>·T / q</div>
<div class="out">At T = 300 K: k<sub>B</sub>T = 1.380649 × 10⁻²³ × 300 = <b>4.142 × 10⁻²¹ J</b><br>V<sub>T</sub> = 4.142 × 10⁻²¹ ÷ 1.602 × 10⁻¹⁹ = <b>0.02585 V = 25.9 mV</b><br>(in energy units: k<sub>B</sub>T = <b>0.0259 eV</b>)<br>At T = 350 K: V<sub>T</sub> = <b>30.2 mV</b> — it rises with temperature</div>
<div class="callout"><span class="badge">Keep this</span> <strong>V<sub>T</sub> = 25.9 mV at room temperature.</strong> It is the scale against which every voltage in a semiconductor is measured. The built-in potential of a junction, 0.7 V, is 0.7 / 0.02585 ≈ <strong>27 thermal voltages</strong> — that ratio is why the diode current rises so steeply, and it is the exponent in the Shockley equation of session 33.</div>
<div class="pitfall"><b>Adding potentials as vectors.</b> V is a scalar; just add the numbers, with their signs. <b>Confusing V = kq/r with E = kq/r².</b> One power of r apart, and swapping them is the most common single error on this topic. <b>Reading "voltage at a point" as absolute.</b> Only <em>differences</em> in potential have physical meaning; a reference (ground) has to be chosen first. <b>Using k<sub>B</sub>T in eV where joules are needed.</b> 0.0259 eV and 4.142 × 10⁻²¹ J are the same energy — but only one of them can go into ½mv².</div>
<h3>Exercise</h3>
<p><b>E1.</b> An ionised donor carries +q. What is the potential it creates 1 µm away in vacuum?</p>
<div class="dap-an"><div class="out">V = k·q/r = 8.99 × 10⁹ × 1.602 × 10⁻¹⁹ ÷ 1 × 10⁻⁶<br>&nbsp;&nbsp;&nbsp;= <b>1.44 × 10⁻³ V = 1.44 mV</b></div>
<p>Compare with exercise E1 of session 3, where the same charge at the same distance gave E = 1440 V/m. Same charge, same distance, two different quantities — and the numbers even look related, because V = E·r for a point charge. Use that as a check on your own algebra.</p></div>
<p><b>E2.</b> An electron crosses the 0.7 V built-in potential of a silicon junction. How much energy in joules and in eV? How many thermal voltages is 0.7 V at 300 K?</p>
<div class="dap-an"><div class="out">W = q·V = 1.602 × 10⁻¹⁹ × 0.7 = <b>1.1214 × 10⁻¹⁹ J = 0.7 eV</b><br>0.7 V ÷ 0.02585 V = <b>27.1 thermal voltages</b></div>
<p>Twenty-seven V<sub>T</sub> is a very high barrier for a thermally-driven particle, because thermal population falls off exponentially: e⁻²⁷ is about 2 × 10⁻¹². That is precisely why an unbiased diode does not conduct, and why lowering the barrier by only 0.6 V with forward bias turns the current on by many orders of magnitude (session 33).</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 5 · CLO1</span>
<h2>Điện thế</h2>
<p class="lead">Học xong buổi này bạn đi được cả hai chiều giữa điện trường và điện áp, tính được năng lượng một điện tích nhận hoặc mất khi đi qua một hiệu điện thế, và tính được điện áp nhiệt k<sub>B</sub>T/q — con số 25,9 mV xuất hiện trong mọi phương trình diode từ buổi 33 trở đi.</p>
<p class="nhan">` + NGUON + ` · buổi 5 — "Electric Potential"</p>
<h3>Từ lực sang năng lượng</h3>
<p>Điện trường cho ta biết về lực. Còn mạch điện lại được mô tả bằng <em>điện áp</em>, tức bằng năng lượng. Cây cầu nối hai bên là một định nghĩa:</p>
<div class="formula">V = W / q&nbsp;&nbsp;&nbsp;(công trên một đơn vị điện tích)&nbsp;&nbsp;&nbsp;[V] = J/C = volt</div>
<p>Và dạng ngược của nó, cái bạn sẽ dùng liên tục: năng lượng mà điện tích q nhận được khi đi qua hiệu điện thế ΔV là</p>
<div class="formula">W = q · ΔV</div>
<h3>Điện thế của điện tích điểm, và khác biệt then chốt so với E</h3>
<table>
  <thead><tr><th></th><th>Điện trường E</th><th>Điện thế V</th></tr></thead>
  <tbody>
    <tr><td>Điện tích điểm</td><td>E = k·q/r²</td><td>V = k·q/r</td></tr>
    <tr><td>Giảm theo</td><td>1/r²</td><td>1/r — <strong>chậm hơn</strong></td></tr>
    <tr><td>Loại đại lượng</td><td><strong>vectơ</strong> — có hướng</td><td><strong>vô hướng</strong> — chỉ là một con số</td></tr>
    <tr><td>Cộng nhiều nguồn</td><td>tổng vectơ (chiếu thành phần, góc)</td><td><strong>cộng đại số bình thường</strong></td></tr>
  </tbody>
</table>
<p>Dòng cuối là lý do dân vật lý yêu điện thế: cộng V từ nhiều điện tích là số học, còn cộng E là lượng giác. Khi bài toán cho bạn chọn, hãy đi qua V.</p>
<h3>Mối liên hệ giữa E và V</h3>
<div class="formula">E = − dV/dx&nbsp;&nbsp;&nbsp;và, với trường đều,&nbsp;&nbsp;&nbsp;V = E · d</div>
<p>Nói bằng lời: <strong>điện trường là độ dốc của điện thế, và nó chỉ xuống dốc</strong>. Dấu trừ chính là phát biểu rằng điện tích dương bị đẩy từ nơi điện thế cao sang nơi điện thế thấp. Hãy nhìn lại hình ba khung của buổi 4 — hộp, tam giác, parabol: tam giác chính là độ dốc của parabol. Đó là công thức này.</p>
<h3>Mặt đẳng thế</h3>
<div class="diagram"><pre>     .-''-.            duong dang the (net gach) LUON vuong goc
   .'      '.           voi duong suc (mui nhon)
  ;   .--.   ;
  |  ; (+) ; |    -->   di chuyen dien tich DOC theo duong dang the
  ;   '--'   ;          KHONG ton cong  (W = q.dV = 0)
   '.      .'
     '-..-'             dien tich diem: cac mat cau dong tam
                        hai ban phang: cac mat phang song song</pre></div>
<h3>Ví dụ 1 — tăng tốc một electron</h3>
<p>Một electron ban đầu nằm yên, đi qua hiệu điện thế 10 V. Nó nhận bao nhiêu năng lượng, và chạy nhanh bao nhiêu?</p>
<div class="out">W = q·ΔV = 1,602 × 10⁻¹⁹ × 10 = <b>1,602 × 10⁻¹⁸ J = 10 eV</b><br>Cho W = ½m<sub>e</sub>v² → v = √(2·q·V / m<sub>e</sub>)<br>v = √(2 × 1,602e-19 × 10 ÷ 9,109e-31) = √(3,517 × 10¹²)<br>&nbsp;&nbsp;= <b>1,875 × 10⁶ m/s</b></div>
<p>Mười volt, và electron đã chạy 1,9 triệu mét mỗi giây — khoảng 0,6% tốc độ ánh sáng. Chú ý lối đi tắt mà eV cho bạn: "10 V điện thế" và "10 eV năng lượng" là cùng một phát biểu đối với một điện tích nguyên tố, nên so sánh năng lượng không cần tính số mũ nào.</p>
<h3>Ví dụ 2 — điện áp nhiệt, con số được dùng lại nhiều nhất của cả môn</h3>
<p>Một hạt ở cân bằng nhiệt tại nhiệt độ T mang năng lượng nhiệt ngẫu nhiên cỡ k<sub>B</sub>T. Diễn đạt nó dưới dạng một điện áp thì được <strong>điện áp nhiệt</strong>:</p>
<div class="formula">V<sub>T</sub> = k<sub>B</sub>·T / q</div>
<div class="out">Ở T = 300 K: k<sub>B</sub>T = 1,380649 × 10⁻²³ × 300 = <b>4,142 × 10⁻²¹ J</b><br>V<sub>T</sub> = 4,142 × 10⁻²¹ ÷ 1,602 × 10⁻¹⁹ = <b>0,02585 V = 25,9 mV</b><br>(theo đơn vị năng lượng: k<sub>B</sub>T = <b>0,0259 eV</b>)<br>Ở T = 350 K: V<sub>T</sub> = <b>30,2 mV</b> — nó tăng theo nhiệt độ</div>
<div class="callout"><span class="badge">Nhớ con số này</span> <strong>V<sub>T</sub> = 25,9 mV ở nhiệt độ phòng.</strong> Đó là cái thước để đo mọi điện áp trong một chất bán dẫn. Điện thế nội của một chuyển tiếp, 0,7 V, bằng 0,7 / 0,02585 ≈ <strong>27 lần điện áp nhiệt</strong> — tỷ số đó là lý do dòng diode tăng dốc đến thế, và nó chính là số mũ trong phương trình Shockley ở buổi 33.</div>
<div class="pitfall"><b>Cộng điện thế như cộng vectơ.</b> V là vô hướng; chỉ cần cộng các con số kèm dấu. <b>Lẫn V = kq/r với E = kq/r².</b> Chỉ khác nhau một bậc của r, và đổi chỗ hai công thức này là lỗi đơn lẻ phổ biến nhất của chủ đề. <b>Hiểu "điện thế tại một điểm" là tuyệt đối.</b> Chỉ <em>hiệu</em> điện thế mới có ý nghĩa vật lý; phải chọn mốc (đất) trước. <b>Dùng k<sub>B</sub>T theo eV ở chỗ cần jun.</b> 0,0259 eV và 4,142 × 10⁻²¹ J là cùng một năng lượng — nhưng chỉ một trong hai được phép đưa vào ½mv².</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Một donor bị ion hoá mang +q. Điện thế nó tạo ra ở cách 1 µm trong chân không là bao nhiêu?</p>
<div class="dap-an"><div class="out">V = k·q/r = 8,99 × 10⁹ × 1,602 × 10⁻¹⁹ ÷ 1 × 10⁻⁶<br>&nbsp;&nbsp;&nbsp;= <b>1,44 × 10⁻³ V = 1,44 mV</b></div>
<p>So với bài B1 của buổi 3, nơi cũng điện tích ấy ở cũng khoảng cách ấy cho E = 1440 V/m. Cùng điện tích, cùng khoảng cách, hai đại lượng khác nhau — và hai con số thậm chí trông có liên hệ, vì với điện tích điểm thì V = E·r. Hãy dùng đúng điều đó để tự kiểm phép biến đổi của mình.</p></div>
<p><b>B2.</b> Một electron đi qua điện thế nội 0,7 V của một chuyển tiếp silic. Năng lượng bao nhiêu theo jun và theo eV? 0,7 V bằng bao nhiêu lần điện áp nhiệt ở 300 K?</p>
<div class="dap-an"><div class="out">W = q·V = 1,602 × 10⁻¹⁹ × 0,7 = <b>1,1214 × 10⁻¹⁹ J = 0,7 eV</b><br>0,7 V ÷ 0,02585 V = <b>27,1 lần điện áp nhiệt</b></div>
<p>Hai mươi bảy V<sub>T</sub> là một rào thế rất cao đối với một hạt được nhiệt độ đẩy, vì mật độ hạt theo nhiệt giảm theo hàm mũ: e⁻²⁷ vào khoảng 2 × 10⁻¹². Đó đúng là lý do một diode chưa phân cực thì không dẫn, và là lý do chỉ cần hạ rào thế đi 0,6 V bằng phân cực thuận là dòng bật lên nhiều bậc độ lớn (buổi 33).</p></div>`,
  ]]);

/* ── 1.6 buổi 6: Điện dung ───────────────────────────────────────────────── */
const l16 = doc('sdi101m-1-6-dien-dung',
  '1.6 — Capacitance: storing charge, and the MOS gate|||1.6 — Điện dung: tích trữ điện tích, và cực cổng MOS',
  'Buổi 6, CLO1: C = Q/V, tụ phẳng C = εA/d, ghép nối tiếp/song song, năng lượng U = ½CV², vai trò chất điện môi. Ví dụ tính điện dung cổng MOS trên 1 µm² với oxit 2 nm (17,3 fF) và số electron trên cực cổng; bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 6 · CLO1</span>
<h2>Capacitance</h2>
<p class="lead">After this session you can compute the capacitance of a parallel-plate structure, combine capacitors in series and parallel, find the stored energy — and compute the gate capacitance of a real MOSFET, which is the same formula applied to a 2 nm layer of glass.</p>
<p class="nhan">` + NGUON + ` · session 6 — "Capacitance"</p>
<h3>The definition</h3>
<div class="formula">C = Q / V&nbsp;&nbsp;&nbsp;[C] = C/V = farad (F)</div>
<p>Capacitance is <strong>how much charge a structure holds per volt applied</strong>. It is a property of geometry and material — not of the voltage. Double the voltage and you store double the charge; C does not change.</p>
<p>A farad is enormous. Real values: a circuit-board capacitor is nF or µF; a chip's internal nodes are fF (femtofarads, 10⁻¹⁵ F). You will meet fF constantly from session 38 onwards.</p>
<h3>The parallel-plate capacitor — the geometry of the MOS gate</h3>
<div class="formula">C = ε<sub>r</sub> · ε₀ · A / d</div>
<div class="diagram"><pre>  plate A  +++++++++++++    <- gate (metal / poly-Si)
           ===========      <- dielectric, thickness d (SiO2, eps_r = 3.9)
  plate B  -----------      <- silicon channel

  C grows when: A bigger, d smaller, eps_r bigger.
  A MOSFET gate IS this capacitor. That is why "MOS capacitor"
  is a whole session of its own (38-40).</pre></div>
<table>
  <thead><tr><th>Change</th><th>Effect on C</th><th>Why it matters in a chip</th></tr></thead>
  <tbody>
    <tr><td>area A doubled</td><td>C doubles</td><td>a wider transistor drives more current but loads the previous stage more</td></tr>
    <tr><td>thickness d halved</td><td>C doubles</td><td>thinner oxide = stronger gate control = the whole scaling story</td></tr>
    <tr><td>ε<sub>r</sub> raised (3.9 → 25)</td><td>C rises 6×</td><td>"high-k" gate dielectrics: more capacitance without thinning further</td></tr>
  </tbody>
</table>
<h3>Series and parallel</h3>
<div class="formula">parallel: C = C₁ + C₂ &nbsp;&nbsp;·&nbsp;&nbsp; series: 1/C = 1/C₁ + 1/C₂</div>
<p>Note this is the <strong>opposite</strong> of resistors, and the reason is physical, not a convention to memorise: capacitors in parallel share the same voltage and their plate areas add, so capacitance adds. In series the same charge sits on every capacitor while the voltages add, so the total capacitance is <em>smaller</em> than the smallest one.</p>
<h3>Stored energy</h3>
<div class="formula">U = ½ · C · V²&nbsp;&nbsp;&nbsp;= ½ · Q · V&nbsp;&nbsp;&nbsp;= Q² / (2C)</div>
<p>This is where the power consumption of every digital chip comes from: each time a node switches, roughly ½CV² of energy is dissipated. Multiply by a billion transistors and a billion switches per second and you have the thermal design problem of the entire industry.</p>
<h3>Worked example 1 — a discrete capacitor</h3>
<p>C = 100 pF charged to 12 V.</p>
<div class="out">Q = C·V = 100 × 10⁻¹² × 12 = <b>1.2 × 10⁻⁹ C = 1.2 nC</b><br>U = ½CV² = 0.5 × 100 × 10⁻¹² × 144 = <b>7.2 × 10⁻⁹ J = 7.2 nJ</b><br>With a second 220 pF capacitor: parallel → <b>320 pF</b>; series → 1/(1/100 + 1/220) = <b>68.75 pF</b></div>
<h3>Worked example 2 — the gate capacitance of a real MOSFET</h3>
<p>Gate oxide SiO₂, ε<sub>r</sub> = 3.9, thickness t<sub>ox</sub> = 2 nm, gate area A = 1 µm² = 10⁻¹² m². Engineers quote capacitance <em>per unit area</em>, written C<sub>ox</sub>′:</p>
<div class="out">C<sub>ox</sub>′ = ε<sub>ox</sub>/t<sub>ox</sub> = 3.9 × 8.854 × 10⁻¹² ÷ 2 × 10⁻⁹<br>&nbsp;&nbsp;&nbsp;= <b>0.017265 F/m² = 1.727 µF/cm² = 17.27 fF/µm²</b><br>For A = 1 µm²: C = 1.727e-2 × 1e-12 = <b>1.727 × 10⁻¹⁴ F = 17.3 fF</b></div>
<p>Seventeen femtofarads. And now the number that makes a semiconductor course feel real — how many electrons does 1 V put on that gate?</p>
<div class="out">Q = C·V = 1.727 × 10⁻¹⁴ × 1 = 1.727 × 10⁻¹⁴ C<br>N = Q/q = 1.727 × 10⁻¹⁴ ÷ 1.602 × 10⁻¹⁹ = <b>≈ 1.08 × 10⁵ electrons</b></div>
<p>About a hundred thousand electrons hold the gate of one transistor at one volt. That is a small enough number that individual statistical fluctuations start to matter — which is one of the real limits of shrinking transistors further.</p>
<div class="pitfall"><b>Using ε₀ instead of ε<sub>r</sub>ε₀.</b> For SiO₂ multiply by 3.9, for silicon by 11.7. Leaving ε<sub>r</sub> out makes every gate capacitance wrong by a factor of 3.9. <b>Swapping the series and parallel rules with those for resistors.</b> Capacitors add in <em>parallel</em>. <b>Forgetting to square V in U = ½CV².</b> Doubling the voltage quadruples the stored energy. <b>Mixing µm² with m².</b> 1 µm² = 10⁻¹² m², not 10⁻⁶ — an area conversion squares the length conversion.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A gate oxide is 5 nm thick and the gate area is 100 µm². Find C<sub>ox</sub>′ and the total capacitance.</p>
<div class="dap-an"><div class="out">C<sub>ox</sub>′ = 3.9 × 8.854 × 10⁻¹² ÷ 5 × 10⁻⁹ = <b>6.906 × 10⁻³ F/m²</b><br>A = 100 µm² = 100 × 10⁻¹² m² = 10⁻¹⁰ m²<br>C = 6.906 × 10⁻³ × 10⁻¹⁰ = <b>6.906 × 10⁻¹³ F = 0.691 pF</b></div>
<p>Compare with worked example 2: the oxide is 2.5 times thicker so C′ is 2.5 times smaller, but the area is 100 times bigger, so the total is 40 times larger. Both factors are linear in C — this is the trade-off every device engineer works inside.</p></div>
<p><b>E2.</b> That same 0.691 pF gate is held at 1 V. How much charge, and how many electrons?</p>
<div class="dap-an"><div class="out">Q = C·V = 6.906 × 10⁻¹³ × 1 = <b>6.906 × 10⁻¹³ C = 0.691 pC</b><br>N = Q/q = 6.906 × 10⁻¹³ ÷ 1.602 × 10⁻¹⁹ = <b>≈ 4.31 × 10⁶ electrons</b></div>
<p>Four million electrons on an older, larger device versus a hundred thousand on the 1 µm² one. As transistors shrink, the charge that represents a logic "1" shrinks with them — which is why noise, leakage and a single stray alpha particle all became design problems at the same time.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 6 · CLO1</span>
<h2>Điện dung</h2>
<p class="lead">Học xong buổi này bạn tính được điện dung của một cấu trúc hai bản song song, ghép được tụ nối tiếp và song song, tìm được năng lượng tích trữ — và tính được điện dung cổng của một MOSFET thật, vốn chỉ là đúng công thức đó áp lên một lớp thuỷ tinh dày 2 nm.</p>
<p class="nhan">` + NGUON + ` · buổi 6 — "Capacitance"</p>
<h3>Định nghĩa</h3>
<div class="formula">C = Q / V&nbsp;&nbsp;&nbsp;[C] = C/V = fara (F)</div>
<p>Điện dung là <strong>lượng điện tích một cấu trúc giữ được trên mỗi volt đặt vào</strong>. Nó là tính chất của hình học và vật liệu — không phải của điện áp. Gấp đôi điện áp thì tích trữ gấp đôi điện tích; C không đổi.</p>
<p>Một fara là cực lớn. Giá trị thật: tụ trên bảng mạch là nF hoặc µF; các nút bên trong một con chip là fF (femtofara, 10⁻¹⁵ F). Bạn sẽ gặp fF liên tục từ buổi 38 trở đi.</p>
<h3>Tụ phẳng hai bản — chính là hình học của cực cổng MOS</h3>
<div class="formula">C = ε<sub>r</sub> · ε₀ · A / d</div>
<div class="diagram"><pre>  ban A   +++++++++++++    <- cuc cong (kim loai / poly-Si)
          ===========       <- chat dien moi, day d (SiO2, eps_r = 3,9)
  ban B   -----------       <- kenh silic

  C tang khi: A lon hon, d nho hon, eps_r lon hon.
  Cuc cong MOSFET CHINH LA cai tu nay. Do la ly do "tu MOS"
  co han ba buoi rieng cho no (38-40).</pre></div>
<table>
  <thead><tr><th>Thay đổi</th><th>Tác động lên C</th><th>Ý nghĩa trong một con chip</th></tr></thead>
  <tbody>
    <tr><td>diện tích A gấp đôi</td><td>C gấp đôi</td><td>transistor rộng hơn thì đẩy được dòng lớn hơn nhưng lại làm nặng tầng trước</td></tr>
    <tr><td>bề dày d còn một nửa</td><td>C gấp đôi</td><td>oxit mỏng hơn = cổng điều khiển mạnh hơn = toàn bộ câu chuyện thu nhỏ</td></tr>
    <tr><td>ε<sub>r</sub> nâng lên (3,9 → 25)</td><td>C tăng 6 lần</td><td>điện môi cổng "high-k": tăng điện dung mà không phải mỏng thêm</td></tr>
  </tbody>
</table>
<h3>Nối tiếp và song song</h3>
<div class="formula">song song: C = C₁ + C₂ &nbsp;&nbsp;·&nbsp;&nbsp; nối tiếp: 1/C = 1/C₁ + 1/C₂</div>
<p>Chú ý đây là <strong>ngược</strong> với điện trở, và lý do là vật lý chứ không phải một quy ước phải học thuộc: tụ ghép song song cùng chịu một điện áp và diện tích bản của chúng cộng lại, nên điện dung cộng. Ghép nối tiếp thì cùng một điện tích nằm trên mọi tụ trong khi điện áp cộng lại, nên điện dung tổng <em>nhỏ hơn</em> cả cái nhỏ nhất.</p>
<h3>Năng lượng tích trữ</h3>
<div class="formula">U = ½ · C · V²&nbsp;&nbsp;&nbsp;= ½ · Q · V&nbsp;&nbsp;&nbsp;= Q² / (2C)</div>
<p>Đây là nơi sinh ra công suất tiêu thụ của mọi con chip số: mỗi lần một nút chuyển trạng thái, khoảng ½CV² năng lượng bị tiêu tán. Nhân với một tỉ transistor và một tỉ lần chuyển mỗi giây thì bạn có đúng bài toán nhiệt của cả ngành.</p>
<h3>Ví dụ 1 — một tụ rời</h3>
<p>C = 100 pF nạp tới 12 V.</p>
<div class="out">Q = C·V = 100 × 10⁻¹² × 12 = <b>1,2 × 10⁻⁹ C = 1,2 nC</b><br>U = ½CV² = 0,5 × 100 × 10⁻¹² × 144 = <b>7,2 × 10⁻⁹ J = 7,2 nJ</b><br>Thêm một tụ 220 pF: song song → <b>320 pF</b>; nối tiếp → 1/(1/100 + 1/220) = <b>68,75 pF</b></div>
<h3>Ví dụ 2 — điện dung cổng của một MOSFET thật</h3>
<p>Oxit cổng SiO₂, ε<sub>r</sub> = 3,9, bề dày t<sub>ox</sub> = 2 nm, diện tích cổng A = 1 µm² = 10⁻¹² m². Dân kỹ thuật ghi điện dung <em>trên một đơn vị diện tích</em>, viết là C<sub>ox</sub>′:</p>
<div class="out">C<sub>ox</sub>′ = ε<sub>ox</sub>/t<sub>ox</sub> = 3,9 × 8,854 × 10⁻¹² ÷ 2 × 10⁻⁹<br>&nbsp;&nbsp;&nbsp;= <b>0,017265 F/m² = 1,727 µF/cm² = 17,27 fF/µm²</b><br>Với A = 1 µm²: C = 1,727e-2 × 1e-12 = <b>1,727 × 10⁻¹⁴ F = 17,3 fF</b></div>
<p>Mười bảy femtofara. Và giờ là con số làm một môn bán dẫn trở nên có thật — 1 V đặt lên cực cổng đó thì có bao nhiêu electron?</p>
<div class="out">Q = C·V = 1,727 × 10⁻¹⁴ × 1 = 1,727 × 10⁻¹⁴ C<br>N = Q/q = 1,727 × 10⁻¹⁴ ÷ 1,602 × 10⁻¹⁹ = <b>≈ 1,08 × 10⁵ electron</b></div>
<p>Chừng một trăm nghìn electron giữ cực cổng của một transistor ở một volt. Con số đó đã nhỏ tới mức các dao động thống kê của từng hạt bắt đầu có ý nghĩa — và đó là một trong những giới hạn thật của việc thu nhỏ transistor thêm nữa.</p>
<div class="pitfall"><b>Dùng ε₀ thay vì ε<sub>r</sub>ε₀.</b> Với SiO₂ phải nhân 3,9, với silic nhân 11,7. Bỏ ε<sub>r</sub> ra là mọi điện dung cổng sai đi 3,9 lần. <b>Đổi chỗ luật nối tiếp/song song với luật của điện trở.</b> Tụ cộng lại khi ghép <em>song song</em>. <b>Quên bình phương V trong U = ½CV².</b> Gấp đôi điện áp thì năng lượng tích trữ gấp bốn. <b>Trộn µm² với m².</b> 1 µm² = 10⁻¹² m², không phải 10⁻⁶ — đổi diện tích là bình phương phép đổi độ dài.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Một lớp oxit cổng dày 5 nm, diện tích cổng 100 µm². Tìm C<sub>ox</sub>′ và điện dung tổng.</p>
<div class="dap-an"><div class="out">C<sub>ox</sub>′ = 3,9 × 8,854 × 10⁻¹² ÷ 5 × 10⁻⁹ = <b>6,906 × 10⁻³ F/m²</b><br>A = 100 µm² = 100 × 10⁻¹² m² = 10⁻¹⁰ m²<br>C = 6,906 × 10⁻³ × 10⁻¹⁰ = <b>6,906 × 10⁻¹³ F = 0,691 pF</b></div>
<p>So với ví dụ 2: oxit dày gấp 2,5 lần nên C′ nhỏ đi 2,5 lần, nhưng diện tích lớn gấp 100 lần, nên tổng lớn hơn 40 lần. Cả hai hệ số đều tuyến tính với C — đây chính là chỗ đánh đổi mà mọi người thiết kế linh kiện phải làm việc bên trong.</p></div>
<p><b>B2.</b> Vẫn cực cổng 0,691 pF đó, giữ ở 1 V. Bao nhiêu điện tích, và bao nhiêu electron?</p>
<div class="dap-an"><div class="out">Q = C·V = 6,906 × 10⁻¹³ × 1 = <b>6,906 × 10⁻¹³ C = 0,691 pC</b><br>N = Q/q = 6,906 × 10⁻¹³ ÷ 1,602 × 10⁻¹⁹ = <b>≈ 4,31 × 10⁶ electron</b></div>
<p>Bốn triệu electron trên một linh kiện cũ, lớn, so với một trăm nghìn trên cái 1 µm². Khi transistor thu nhỏ, lượng điện tích đại diện cho một bit logic "1" cũng nhỏ đi theo — và đó là lý do nhiễu, dòng rò và một hạt alpha đi lạc cùng lúc trở thành bài toán thiết kế.</p></div>`,
  ]]);

/* ── 1.7 buổi 7: Dòng điện & điện trở ────────────────────────────────────── */
const l17 = doc('sdi101m-1-7-dong-dien-dien-tro',
  '1.7 — Current and Resistance: from drift to Ohm|||1.7 — Dòng điện và điện trở: từ dòng trôi tới định luật Ohm',
  'Buổi 7, CLO1: I = ΔQ/Δt, mật độ dòng J = I/A, định luật Ohm V = IR, điện trở suất R = ρL/A, độ dẫn σ = q·n·μ, công suất P = I²R, vận tốc trôi thật của electron trong dây đồng (0,073 mm/s). Tính điện trở suất của Si pha tạp 10¹⁶ cm⁻³ và bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 7 · CLO1</span>
<h2>Current and resistance</h2>
<p class="lead">After this session you can compute current, current density and resistance, use σ = q·n·μ to turn a doping level into a resistivity — the formula that connects this half of the course to the other — and explain why electrons drift through copper at less than a millimetre per second while a lamp lights instantly.</p>
<p class="nhan">` + NGUON + ` · session 7 — "Current and Resistance"</p>
<h3>Current: charge per second</h3>
<div class="formula">I = ΔQ / Δt&nbsp;&nbsp;&nbsp;[I] = C/s = ampere (A)</div>
<p>Two conventions cause most of the confusion, so fix them now. <strong>Conventional current</strong> flows from + to −, i.e. the direction a <em>positive</em> charge would move. <strong>Electrons</strong> move the opposite way. Both descriptions are correct and give the same physics; in a semiconductor both actually happen at once, because holes (positive) and electrons (negative) both carry current — which is why session 27 counts them separately.</p>
<h3>Current density: current per unit area</h3>
<div class="formula">J = I / A&nbsp;&nbsp;&nbsp;[J] = A/m², but semiconductor practice uses <strong>A/cm²</strong></div>
<p>Current density, not current, is what destroys things. 1 mA is harmless in a wire and fatal in a 1 µm² via:</p>
<div class="out">J = 1 mA ÷ 1 µm² = 10⁻³ A ÷ 10⁻⁸ cm² = <b>10⁵ A/cm²</b></div>
<p>A hundred thousand amperes per square centimetre. Metal interconnect fails by <em>electromigration</em> at densities of this order, which is why chip design has current-density rules and not just current limits.</p>
<h3>Ohm's law and resistivity</h3>
<div class="formula">V = I · R&nbsp;&nbsp;·&nbsp;&nbsp;R = ρ · L / A&nbsp;&nbsp;·&nbsp;&nbsp;σ = 1/ρ&nbsp;&nbsp;·&nbsp;&nbsp;J = σ · E</div>
<table>
  <thead><tr><th>Quantity</th><th>Symbol</th><th>Unit</th><th>Depends on</th></tr></thead>
  <tbody>
    <tr><td>resistance</td><td>R</td><td>Ω</td><td>the material <strong>and</strong> the shape (L, A)</td></tr>
    <tr><td>resistivity</td><td>ρ</td><td>Ω·m or <strong>Ω·cm</strong></td><td>the material only — shape-independent</td></tr>
    <tr><td>conductivity</td><td>σ = 1/ρ</td><td>S/m or S/cm</td><td>the material only</td></tr>
  </tbody>
</table>
<p>The distinction matters: two silicon regions with the same doping have the same ρ but completely different R if one is long and thin. Datasheets quote ρ; circuits feel R.</p>
<h3>Where conductivity comes from — the bridge to the second half of this course</h3>
<div class="formula">σ = q · n · μ&nbsp;&nbsp;&nbsp;(and with both carriers: σ = q·(n·μ<sub>n</sub> + p·μ<sub>p</sub>) )</div>
<p>Read it as a product of three independent things: <strong>how much charge each carrier has</strong> (q, fixed), <strong>how many carriers there are</strong> (n — set by doping, session 26), and <strong>how easily each one moves</strong> (μ — set by the crystal and by scattering, session 28). Doping changes n by many orders of magnitude, and that is the entire trick of semiconductor engineering: a material whose resistivity you can dial.</p>
<h3>Worked example 1 — a copper wire, and the surprise inside it</h3>
<p>A 2 m copper wire of cross-section 1 mm², with ρ = 1.68 × 10⁻⁸ Ω·m, carrying 1 A. Copper has about n = 8.5 × 10²⁸ free electrons per m³.</p>
<div class="out">R = ρL/A = 1.68 × 10⁻⁸ × 2 ÷ 10⁻⁶ = <b>0.0336 Ω</b><br>Drift velocity: v<sub>d</sub> = I / (n·q·A)<br>&nbsp;&nbsp;= 1 ÷ (8.5 × 10²⁸ × 1.602 × 10⁻¹⁹ × 10⁻⁶) = 1 ÷ 1.3617 × 10⁴<br>&nbsp;&nbsp;= <b>7.34 × 10⁻⁵ m/s = 0.073 mm/s</b><br>Time for one electron to travel the 2 m: 2 ÷ 7.34e-5 ≈ <b>7.6 hours</b></div>
<div class="callout"><strong>The lamp lights immediately, but the electrons crawl.</strong> Both are true. The signal travels at nearly the speed of light because the <em>field</em> propagates that fast and pushes on every electron in the wire at once; the individual electrons then shuffle forward at 0.073 mm/s. The wire was already full of electrons — you do not have to wait for one to arrive from the switch.</div>
<h3>Worked example 2 — resistivity of doped silicon</h3>
<p>n-type silicon, N<sub>D</sub> = 10¹⁶ cm⁻³ so n ≈ 10¹⁶ cm⁻³, with μ<sub>n</sub> ≈ 1350 cm²/(V·s). Work entirely in centimetre units:</p>
<div class="out">σ = q·n·μ<sub>n</sub> = 1.602 × 10⁻¹⁹ × 10¹⁶ × 1350 = <b>2.1627 S/cm</b><br>ρ = 1/σ = <b>0.4624 Ω·cm</b><br>A bar 1 cm long with cross-section 1 mm² (= 10⁻² cm²):<br>R = ρL/A = 0.4624 × 1 ÷ 10⁻² = <b>46.2 Ω</b></div>
<p>Compare: copper is 1.68 × 10⁻⁶ Ω·cm, this silicon is 0.46 Ω·cm — about 275 000 times more resistive, and yet 10⁹ times <em>less</em> resistive than undoped silicon. Semiconductors sit in the middle, and doping is the dial.</p>
<h3>Power</h3>
<div class="formula">P = V · I = I² · R = V² / R&nbsp;&nbsp;&nbsp;[P] = watt (W)</div>
<div class="out">Example: 0.1 A through the 0.0336 Ω copper wire → P = (0.1)² × 0.0336 = <b>3.36 × 10⁻⁴ W = 0.336 mW</b></div>
<p>Use I²R when you know the current (series elements), V²/R when you know the voltage (parallel elements). Picking the wrong one is not wrong physics, only extra work.</p>
<div class="pitfall"><b>Mixing Ω·cm with metres.</b> If ρ is in Ω·cm then L must be in cm and A in cm². Choose the system for the whole line. <b>Confusing R with ρ.</b> "The resistance of silicon" is meaningless without dimensions; the resistivity is the material property. <b>Forgetting that A in R = ρL/A is the cross-section</b>, perpendicular to the current — not the surface area of the sample. <b>Assuming Ohm's law always holds.</b> It does for metals and for lightly-biased semiconductors. It fails completely for a diode (session 33), where I depends exponentially on V — which is exactly what makes a diode useful.</div>
<h3>Exercise</h3>
<p><b>E1.</b> p-type silicon is doped N<sub>A</sub> = 10¹⁷ cm⁻³, giving p ≈ 10¹⁷ cm⁻³ with μ<sub>p</sub> ≈ 480 cm²/(V·s). Find σ and ρ.</p>
<div class="dap-an"><div class="out">σ = q·p·μ<sub>p</sub> = 1.602 × 10⁻¹⁹ × 10¹⁷ × 480 = <b>7.6896 S/cm</b><br>ρ = 1/σ = <b>0.1300 Ω·cm</b></div>
<p>Ten times the doping of the worked example, but only 3.6 times the conductivity — because holes are less mobile than electrons (480 against 1350). Mobility is not a detail: it is why n-channel MOSFETs are faster than p-channel ones, and therefore why a CMOS inverter is drawn with a wider PMOS (session 45).</p></div>
<p><b>E2.</b> Make a bar of that p-type silicon 10 µm long with a 1 µm² cross-section — the size of an on-chip resistor. What is its resistance?</p>
<div class="dap-an"><div class="out">Work in cm: L = 10 µm = 10 × 10⁻⁴ cm = 10⁻³ cm · A = 1 µm² = 10⁻⁸ cm²<br>R = ρL/A = 0.1300 × 10⁻³ ÷ 10⁻⁸ = <b>1.30 × 10⁴ Ω = 13.0 kΩ</b></div>
<p>Thirteen kilo-ohms from a speck of silicon ten micrometres long. This is how resistors are actually made inside a chip — no component is added, a strip of doped silicon simply <em>is</em> the resistor, and the designer sets its value by choosing the doping and the shape.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 7 · CLO1</span>
<h2>Dòng điện và điện trở</h2>
<p class="lead">Học xong buổi này bạn tính được dòng điện, mật độ dòng và điện trở, dùng được σ = q·n·μ để biến một mức pha tạp thành một điện trở suất — công thức nối nửa này của môn với nửa kia — và giải thích được vì sao electron trôi trong dây đồng chưa tới một milimet mỗi giây mà bóng đèn lại sáng tức thì.</p>
<p class="nhan">` + NGUON + ` · buổi 7 — "Current and Resistance"</p>
<h3>Dòng điện: điện tích trên mỗi giây</h3>
<div class="formula">I = ΔQ / Δt&nbsp;&nbsp;&nbsp;[I] = C/s = ampe (A)</div>
<p>Hai quy ước gây ra phần lớn sự lẫn lộn, nên hãy chốt luôn. <strong>Dòng điện quy ước</strong> chảy từ + sang −, tức chiều mà một điện tích <em>dương</em> sẽ di chuyển. <strong>Electron</strong> chạy theo chiều ngược lại. Cả hai cách mô tả đều đúng và cho cùng một vật lý; trong chất bán dẫn thì cả hai xảy ra thật cùng lúc, vì lỗ trống (dương) và electron (âm) đều mang dòng — và đó là lý do buổi 27 đếm chúng riêng.</p>
<h3>Mật độ dòng: dòng trên một đơn vị diện tích</h3>
<div class="formula">J = I / A&nbsp;&nbsp;&nbsp;[J] = A/m², nhưng thực hành bán dẫn dùng <strong>A/cm²</strong></div>
<p>Thứ phá hỏng linh kiện là mật độ dòng, không phải dòng. 1 mA thì vô hại trong một sợi dây và chết người trong một via 1 µm²:</p>
<div class="out">J = 1 mA ÷ 1 µm² = 10⁻³ A ÷ 10⁻⁸ cm² = <b>10⁵ A/cm²</b></div>
<p>Một trăm nghìn ampe trên mỗi centimet vuông. Dây nối kim loại bị hỏng do <em>di chuyển điện di</em> (electromigration) ở đúng cỡ mật độ này, và đó là lý do thiết kế chip có quy tắc về mật độ dòng chứ không chỉ giới hạn về dòng.</p>
<h3>Định luật Ohm và điện trở suất</h3>
<div class="formula">V = I · R&nbsp;&nbsp;·&nbsp;&nbsp;R = ρ · L / A&nbsp;&nbsp;·&nbsp;&nbsp;σ = 1/ρ&nbsp;&nbsp;·&nbsp;&nbsp;J = σ · E</div>
<table>
  <thead><tr><th>Đại lượng</th><th>Ký hiệu</th><th>Đơn vị</th><th>Phụ thuộc</th></tr></thead>
  <tbody>
    <tr><td>điện trở</td><td>R</td><td>Ω</td><td>vật liệu <strong>và</strong> hình dạng (L, A)</td></tr>
    <tr><td>điện trở suất</td><td>ρ</td><td>Ω·m hoặc <strong>Ω·cm</strong></td><td>chỉ vật liệu — không phụ thuộc hình dạng</td></tr>
    <tr><td>độ dẫn</td><td>σ = 1/ρ</td><td>S/m hoặc S/cm</td><td>chỉ vật liệu</td></tr>
  </tbody>
</table>
<p>Phân biệt này quan trọng: hai vùng silic pha tạp giống nhau có cùng ρ nhưng R khác hẳn nhau nếu một vùng dài và mảnh. Datasheet ghi ρ; mạch điện thì cảm nhận R.</p>
<h3>Độ dẫn sinh ra từ đâu — cây cầu sang nửa sau của môn</h3>
<div class="formula">σ = q · n · μ&nbsp;&nbsp;&nbsp;(và khi có cả hai loại hạt tải: σ = q·(n·μ<sub>n</sub> + p·μ<sub>p</sub>) )</div>
<p>Hãy đọc nó như tích của ba thứ độc lập: <strong>mỗi hạt tải mang bao nhiêu điện tích</strong> (q, cố định), <strong>có bao nhiêu hạt tải</strong> (n — do pha tạp quyết định, buổi 26), và <strong>mỗi hạt di chuyển dễ đến đâu</strong> (μ — do tinh thể và do tán xạ quyết định, buổi 28). Pha tạp làm n thay đổi nhiều bậc độ lớn, và đó là toàn bộ mẹo của kỹ thuật bán dẫn: một vật liệu mà điện trở suất của nó bạn xoay được như xoay núm.</p>
<h3>Ví dụ 1 — một dây đồng, và điều bất ngờ bên trong nó</h3>
<p>Dây đồng dài 2 m, tiết diện 1 mm², ρ = 1,68 × 10⁻⁸ Ω·m, mang dòng 1 A. Đồng có khoảng n = 8,5 × 10²⁸ electron tự do trên mỗi m³.</p>
<div class="out">R = ρL/A = 1,68 × 10⁻⁸ × 2 ÷ 10⁻⁶ = <b>0,0336 Ω</b><br>Vận tốc trôi: v<sub>d</sub> = I / (n·q·A)<br>&nbsp;&nbsp;= 1 ÷ (8,5 × 10²⁸ × 1,602 × 10⁻¹⁹ × 10⁻⁶) = 1 ÷ 1,3617 × 10⁴<br>&nbsp;&nbsp;= <b>7,34 × 10⁻⁵ m/s = 0,073 mm/s</b><br>Thời gian một electron đi hết 2 m: 2 ÷ 7,34e-5 ≈ <b>7,6 giờ</b></div>
<div class="callout"><strong>Bóng đèn sáng tức thì, mà electron thì bò.</strong> Cả hai đều đúng. Tín hiệu đi gần bằng tốc độ ánh sáng vì chính <em>điện trường</em> lan nhanh như thế và đẩy lên mọi electron trong dây cùng một lúc; còn từng electron thì lê từng bước ở 0,073 mm/s. Sợi dây vốn đã đầy electron — bạn không phải chờ một electron nào từ công tắc đi tới.</div>
<h3>Ví dụ 2 — điện trở suất của silic pha tạp</h3>
<p>Silic loại n, N<sub>D</sub> = 10¹⁶ cm⁻³ nên n ≈ 10¹⁶ cm⁻³, với μ<sub>n</sub> ≈ 1350 cm²/(V·s). Làm hoàn toàn theo đơn vị centimet:</p>
<div class="out">σ = q·n·μ<sub>n</sub> = 1,602 × 10⁻¹⁹ × 10¹⁶ × 1350 = <b>2,1627 S/cm</b><br>ρ = 1/σ = <b>0,4624 Ω·cm</b><br>Một thanh dài 1 cm, tiết diện 1 mm² (= 10⁻² cm²):<br>R = ρL/A = 0,4624 × 1 ÷ 10⁻² = <b>46,2 Ω</b></div>
<p>So sánh: đồng là 1,68 × 10⁻⁶ Ω·cm, silic này là 0,46 Ω·cm — trở kháng hơn khoảng 275 000 lần, mà lại <em>ít</em> trở kháng hơn silic chưa pha tạp cỡ 10⁹ lần. Chất bán dẫn nằm ở giữa, và pha tạp chính là cái núm xoay.</p>
<h3>Công suất</h3>
<div class="formula">P = V · I = I² · R = V² / R&nbsp;&nbsp;&nbsp;[P] = watt (W)</div>
<div class="out">Ví dụ: 0,1 A qua dây đồng 0,0336 Ω → P = (0,1)² × 0,0336 = <b>3,36 × 10⁻⁴ W = 0,336 mW</b></div>
<p>Dùng I²R khi biết dòng (phần tử nối tiếp), dùng V²/R khi biết điện áp (phần tử song song). Chọn sai không phải sai vật lý, chỉ là tính dài hơn.</p>
<div class="pitfall"><b>Trộn Ω·cm với mét.</b> Nếu ρ theo Ω·cm thì L phải theo cm và A theo cm². Hãy chọn hệ đơn vị cho cả dòng tính. <b>Lẫn R với ρ.</b> "Điện trở của silic" là câu vô nghĩa nếu chưa có kích thước; điện trở suất mới là tính chất vật liệu. <b>Quên rằng A trong R = ρL/A là tiết diện</b>, vuông góc với dòng — không phải diện tích bề mặt của mẫu. <b>Cho rằng định luật Ohm luôn đúng.</b> Nó đúng với kim loại và với bán dẫn phân cực nhẹ. Nó sai hoàn toàn với một diode (buổi 33), nơi I phụ thuộc V theo hàm mũ — mà chính điều đó mới làm diode có ích.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Silic loại p pha tạp N<sub>A</sub> = 10¹⁷ cm⁻³, cho p ≈ 10¹⁷ cm⁻³ với μ<sub>p</sub> ≈ 480 cm²/(V·s). Tìm σ và ρ.</p>
<div class="dap-an"><div class="out">σ = q·p·μ<sub>p</sub> = 1,602 × 10⁻¹⁹ × 10¹⁷ × 480 = <b>7,6896 S/cm</b><br>ρ = 1/σ = <b>0,1300 Ω·cm</b></div>
<p>Pha tạp gấp mười lần ví dụ trên, nhưng độ dẫn chỉ gấp 3,6 lần — vì lỗ trống linh động kém hơn electron (480 so với 1350). Độ linh động không phải một chi tiết nhỏ: nó là lý do MOSFET kênh n nhanh hơn kênh p, và do đó là lý do một cổng đảo CMOS được vẽ với PMOS rộng hơn (buổi 45).</p></div>
<p><b>B2.</b> Làm một thanh silic loại p đó dài 10 µm, tiết diện 1 µm² — cỡ một điện trở trên chip. Điện trở của nó bằng bao nhiêu?</p>
<div class="dap-an"><div class="out">Làm theo cm: L = 10 µm = 10 × 10⁻⁴ cm = 10⁻³ cm · A = 1 µm² = 10⁻⁸ cm²<br>R = ρL/A = 0,1300 × 10⁻³ ÷ 10⁻⁸ = <b>1,30 × 10⁴ Ω = 13,0 kΩ</b></div>
<p>Mười ba kilô-ôm từ một mẩu silic dài mười micrômét. Điện trở bên trong một con chip được làm đúng như thế — không thêm linh kiện nào, một dải silic pha tạp tự nó <em>là</em> cái điện trở, và người thiết kế đặt giá trị bằng cách chọn nồng độ pha tạp và hình dạng.</p></div>`,
  ]]);

/* ── 1.8 buổi 8: Mạch điện ───────────────────────────────────────────────── */
const l18 = doc('sdi101m-1-8-mach-dien',
  '1.8 — Electrical Circuits: Kirchhoff, dividers, RC|||1.8 — Mạch điện: Kirchhoff, mạch chia áp, mạch RC',
  'Buổi 8, CLO1: ghép điện trở nối tiếp/song song, hai định luật Kirchhoff (KCL, KVL), mạch chia áp, nạp/xả tụ với hằng số thời gian τ = RC (63,2% sau 1τ, 99,3% sau 5τ), và bài toán điện trở hạn dòng cho LED — chuẩn bị trực tiếp cho LAB 1. Ví dụ tính và bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 8 · CLO1</span>
<h2>Electrical circuits</h2>
<p class="lead">After this session you can reduce a resistor network, apply Kirchhoff's two laws, design a voltage divider, compute an RC time constant, and size the series resistor for an LED. Everything here is used directly with real instruments in LAB 1 (sessions 16–21).</p>
<p class="nhan">` + NGUON + ` · session 8 — "Electrical Circuits"</p>
<h3>Series and parallel resistors</h3>
<div class="formula">series: R = R₁ + R₂ + …&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;parallel: 1/R = 1/R₁ + 1/R₂ + …</div>
<div class="diagram"><pre>  SERIES                         PARALLEL
   +--[R1]--[R2]--+                +--[R1]--+
   |              |                |        |
  (V)            GND           +---+--[R2]--+---+
                                |                |
  same CURRENT through both    (V)              GND
  voltages ADD                  same VOLTAGE across both
  R total is BIGGER             currents ADD
                                R total is SMALLER than either</pre></div>
<p>The one-line sanity check that catches most mistakes: a series total must be <strong>larger</strong> than the largest resistor; a parallel total must be <strong>smaller</strong> than the smallest. If your answer is not, you used the wrong formula.</p>
<h3>Kirchhoff's two laws</h3>
<table>
  <thead><tr><th>Law</th><th>Statement</th><th>What it really is</th></tr></thead>
  <tbody>
    <tr><td><strong>KCL</strong> (current, at a node)</td><td>Σ I<sub>in</sub> = Σ I<sub>out</sub></td><td>charge is conserved — nothing accumulates at a junction</td></tr>
    <tr><td><strong>KVL</strong> (voltage, round a loop)</td><td>Σ V = 0</td><td>energy is conserved — go round a loop and you are back at the same potential</td></tr>
  </tbody>
</table>
<h3>The voltage divider — the most used circuit in electronics</h3>
<div class="formula">V<sub>out</sub> = V<sub>in</sub> · R₂ / (R₁ + R₂)</div>
<h3>Worked example 1 — a series circuit end to end</h3>
<p>12 V across R₁ = 1 kΩ and R₂ = 2 kΩ in series.</p>
<div class="out">R = 1000 + 2000 = 3000 Ω<br>I = V/R = 12 ÷ 3000 = <b>4 × 10⁻³ A = 4 mA</b> (the same in both resistors)<br>V₁ = I·R₁ = 4 mA × 1 kΩ = <b>4 V</b> · V₂ = 4 mA × 2 kΩ = <b>8 V</b><br>Check KVL: 4 + 8 = 12 ✔<br>P = V·I = 12 × 4 × 10⁻³ = <b>0.048 W = 48 mW</b><br>Same two resistors in parallel: R = 1/(1/1000 + 1/2000) = <b>666.67 Ω</b></div>
<p>The divider ratio comes out of this for free: the 2 kΩ took 8 V of the 12 V, i.e. 2/(1+2) of it. Note also that the <em>larger</em> resistor takes the <em>larger</em> share of the voltage — while in parallel it would take the smaller share of the current.</p>
<h3>Charging a capacitor — the time constant</h3>
<div class="formula">v(t) = V · (1 − e<sup>−t/τ</sup>)&nbsp;&nbsp;·&nbsp;&nbsp;discharge: v(t) = V · e<sup>−t/τ</sup>&nbsp;&nbsp;·&nbsp;&nbsp;τ = R · C</div>
<div class="out">R = 10 kΩ, C = 100 nF → τ = 10 × 10³ × 100 × 10⁻⁹ = <b>10⁻³ s = 1 ms</b><br>after 1τ: 1 − e⁻¹ = <b>63.2%</b> of the final voltage<br>after 5τ: 1 − e⁻⁵ = <b>99.3%</b> — in practice, "fully charged"</div>
<p>Check the unit of τ once and you will never doubt it: Ω × F = (V/A) × (C/V) = C/A = s. A time constant really does come out in seconds. This is the quantity you will measure on an oscilloscope in LAB 1, and the same τ, hidden as R<sub>on</sub>·C<sub>load</sub>, sets the switching speed of every logic gate in session 45.</p>
<h3>Worked example 2 — the LED resistor (you will do this on a breadboard)</h3>
<p>A 5 V supply, an LED with forward voltage V<sub>f</sub> = 2.0 V, and a target current of 10 mA. KVL says the resistor must take up the difference:</p>
<div class="out">V<sub>R</sub> = 5 − 2.0 = 3.0 V<br>R = V<sub>R</sub>/I = 3.0 ÷ 10 × 10⁻³ = <b>300 Ω</b><br>P<sub>R</sub> = I²R = (10 × 10⁻³)² × 300 = <b>0.03 W = 30 mW</b></div>
<div class="callout warn"><strong>Why the resistor is not optional.</strong> An LED is a diode: its current rises exponentially with voltage (session 33), so it has no stable operating point of its own. Connect 5 V straight across it and the current is limited only by the supply — the LED dies in milliseconds. The resistor makes the current <em>set by Ohm's law</em> instead of by the diode. This is the first real appearance of the electrical-safety half of CLO2, and the first thing checked in a lab.</div>
<div class="pitfall"><b>Adding parallel resistors directly.</b> 1 kΩ ∥ 2 kΩ is 667 Ω, not 3 kΩ; the reciprocals add. <b>Forgetting to invert at the end</b> of the parallel formula — a very common half-finished answer. <b>Assuming the same current in parallel branches.</b> Parallel shares voltage, series shares current. Say which one out loud before writing the equation. <b>Using nF and kΩ raw in τ = RC.</b> 10 kΩ × 100 nF = 1 ms only after both go into base units. <b>Connecting an LED without a series resistor.</b> It works for about one second.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A 10 V supply feeds R₁ = 4.7 kΩ in series with R₂ = 10 kΩ. Find the current and the voltage across R₂.</p>
<div class="dap-an"><div class="out">R = 4700 + 10 000 = 14 700 Ω<br>I = 10 ÷ 14 700 = <b>6.80 × 10⁻⁴ A = 0.680 mA</b><br>V₂ = V·R₂/(R₁+R₂) = 10 × 10 000 ÷ 14 700 = <b>6.80 V</b></div>
<p>Two routes to V₂ — I·R₂ and the divider formula — and they agree. Always take the second route as a check when a problem is worth marks; it costs one line.</p></div>
<p><b>E2.</b> A 1 kΩ resistor charges a 1 µF capacitor from a 5 V supply. Find τ, and the time for the capacitor to reach 4 V.</p>
<div class="dap-an"><div class="out">τ = R·C = 1000 × 1 × 10⁻⁶ = <b>10⁻³ s = 1 ms</b><br>4 = 5(1 − e<sup>−t/τ</sup>) → e<sup>−t/τ</sup> = 0.2 → t = −τ·ln(0.2)<br>t = 1 ms × 1.609 = <b>1.61 ms</b></div>
<p>Note that 4 V out of 5 V is 80%, which needs about 1.6 time constants — more than the 63.2% one constant gives, less than the 99.3% at five. Sketching the exponential and reading it roughly before calculating is the fastest defence against an answer with the wrong order of magnitude.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 8 · CLO1</span>
<h2>Mạch điện</h2>
<p class="lead">Học xong buổi này bạn thu gọn được một mạng điện trở, áp dụng được hai định luật Kirchhoff, thiết kế được mạch chia áp, tính được hằng số thời gian RC, và chọn được điện trở nối tiếp cho một LED. Mọi thứ ở đây được dùng trực tiếp với thiết bị thật trong LAB 1 (buổi 16–21).</p>
<p class="nhan">` + NGUON + ` · buổi 8 — "Electrical Circuits"</p>
<h3>Điện trở nối tiếp và song song</h3>
<div class="formula">nối tiếp: R = R₁ + R₂ + …&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;song song: 1/R = 1/R₁ + 1/R₂ + …</div>
<div class="diagram"><pre>  NOI TIEP                       SONG SONG
   +--[R1]--[R2]--+                +--[R1]--+
   |              |                |        |
  (V)            GND           +---+--[R2]--+---+
                                |                |
  cung DONG qua ca hai         (V)              GND
  dien ap CONG lai              cung DIEN AP tren ca hai
  R tong LON hon                cac dong CONG lai
                                R tong NHO hon ca hai</pre></div>
<p>Phép kiểm một dòng bắt được phần lớn lỗi: tổng nối tiếp phải <strong>lớn hơn</strong> điện trở lớn nhất; tổng song song phải <strong>nhỏ hơn</strong> điện trở nhỏ nhất. Nếu đáp án của bạn không như vậy thì bạn đã dùng sai công thức.</p>
<h3>Hai định luật Kirchhoff</h3>
<table>
  <thead><tr><th>Định luật</th><th>Phát biểu</th><th>Thực chất là gì</th></tr></thead>
  <tbody>
    <tr><td><strong>KCL</strong> (dòng, tại một nút)</td><td>Σ I<sub>vào</sub> = Σ I<sub>ra</sub></td><td>bảo toàn điện tích — không có gì tích tụ lại ở một nút</td></tr>
    <tr><td><strong>KVL</strong> (áp, quanh một vòng)</td><td>Σ V = 0</td><td>bảo toàn năng lượng — đi hết một vòng là quay về đúng điện thế cũ</td></tr>
  </tbody>
</table>
<h3>Mạch chia áp — mạch được dùng nhiều nhất trong điện tử</h3>
<div class="formula">V<sub>ra</sub> = V<sub>vào</sub> · R₂ / (R₁ + R₂)</div>
<h3>Ví dụ 1 — một mạch nối tiếp từ đầu đến cuối</h3>
<p>12 V đặt lên R₁ = 1 kΩ nối tiếp R₂ = 2 kΩ.</p>
<div class="out">R = 1000 + 2000 = 3000 Ω<br>I = V/R = 12 ÷ 3000 = <b>4 × 10⁻³ A = 4 mA</b> (bằng nhau ở cả hai điện trở)<br>V₁ = I·R₁ = 4 mA × 1 kΩ = <b>4 V</b> · V₂ = 4 mA × 2 kΩ = <b>8 V</b><br>Kiểm KVL: 4 + 8 = 12 ✔<br>P = V·I = 12 × 4 × 10⁻³ = <b>0,048 W = 48 mW</b><br>Vẫn hai điện trở đó ghép song song: R = 1/(1/1000 + 1/2000) = <b>666,67 Ω</b></div>
<p>Tỷ số chia áp rơi ra miễn phí từ đây: điện trở 2 kΩ lấy 8 V trong 12 V, tức 2/(1+2) của nó. Cũng chú ý điện trở <em>lớn hơn</em> lấy phần điện áp <em>lớn hơn</em> — trong khi nếu ghép song song thì nó lại lấy phần dòng nhỏ hơn.</p>
<h3>Nạp một tụ điện — hằng số thời gian</h3>
<div class="formula">v(t) = V · (1 − e<sup>−t/τ</sup>)&nbsp;&nbsp;·&nbsp;&nbsp;khi xả: v(t) = V · e<sup>−t/τ</sup>&nbsp;&nbsp;·&nbsp;&nbsp;τ = R · C</div>
<div class="out">R = 10 kΩ, C = 100 nF → τ = 10 × 10³ × 100 × 10⁻⁹ = <b>10⁻³ s = 1 ms</b><br>sau 1τ: 1 − e⁻¹ = <b>63,2%</b> điện áp cuối<br>sau 5τ: 1 − e⁻⁵ = <b>99,3%</b> — trong thực tế coi là "đã nạp xong"</div>
<p>Kiểm đơn vị của τ một lần là sẽ không bao giờ còn nghi ngờ: Ω × F = (V/A) × (C/V) = C/A = s. Một hằng số thời gian thật sự ra đơn vị giây. Đây là đại lượng bạn sẽ đo trên máy hiện sóng trong LAB 1, và cũng chính τ đó, núp dưới dạng R<sub>on</sub>·C<sub>tải</sub>, quyết định tốc độ chuyển mạch của mọi cổng logic ở buổi 45.</p>
<h3>Ví dụ 2 — điện trở cho LED (bạn sẽ làm đúng việc này trên breadboard)</h3>
<p>Nguồn 5 V, một LED có điện áp thuận V<sub>f</sub> = 2,0 V, và dòng mong muốn 10 mA. KVL nói điện trở phải gánh phần chênh:</p>
<div class="out">V<sub>R</sub> = 5 − 2,0 = 3,0 V<br>R = V<sub>R</sub>/I = 3,0 ÷ 10 × 10⁻³ = <b>300 Ω</b><br>P<sub>R</sub> = I²R = (10 × 10⁻³)² × 300 = <b>0,03 W = 30 mW</b></div>
<div class="callout warn"><strong>Vì sao điện trở đó KHÔNG phải tuỳ chọn.</strong> LED là một diode: dòng của nó tăng theo hàm mũ theo điện áp (buổi 33), nên bản thân nó không có điểm làm việc ổn định nào. Nối thẳng 5 V vào nó thì dòng chỉ còn bị giới hạn bởi nguồn — LED chết trong vài milligiây. Điện trở làm cho dòng <em>do định luật Ohm quyết định</em> thay vì do diode quyết định. Đây là lần xuất hiện thật đầu tiên của nửa "an toàn điện" trong CLO2, và là thứ đầu tiên bị kiểm khi vào lab.</div>
<div class="pitfall"><b>Cộng thẳng điện trở song song.</b> 1 kΩ ∥ 2 kΩ là 667 Ω, không phải 3 kΩ; phải cộng nghịch đảo. <b>Quên nghịch đảo lại ở bước cuối</b> của công thức song song — một đáp án làm dở rất thường gặp. <b>Cho rằng các nhánh song song có cùng dòng.</b> Song song thì chung điện áp, nối tiếp thì chung dòng. Hãy nói to xem đang là cái nào trước khi viết phương trình. <b>Dùng nF và kΩ thô trong τ = RC.</b> 10 kΩ × 100 nF chỉ bằng 1 ms sau khi cả hai về đơn vị cơ bản. <b>Nối LED mà không có điện trở nối tiếp.</b> Nó hoạt động được khoảng một giây.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Nguồn 10 V cấp cho R₁ = 4,7 kΩ nối tiếp R₂ = 10 kΩ. Tìm dòng và điện áp trên R₂.</p>
<div class="dap-an"><div class="out">R = 4700 + 10 000 = 14 700 Ω<br>I = 10 ÷ 14 700 = <b>6,80 × 10⁻⁴ A = 0,680 mA</b><br>V₂ = V·R₂/(R₁+R₂) = 10 × 10 000 ÷ 14 700 = <b>6,80 V</b></div>
<p>Hai đường tới V₂ — I·R₂ và công thức chia áp — và chúng khớp nhau. Với câu hỏi có điểm thì luôn đi thêm đường thứ hai để kiểm; nó chỉ tốn một dòng.</p></div>
<p><b>B2.</b> Một điện trở 1 kΩ nạp cho tụ 1 µF từ nguồn 5 V. Tìm τ, và thời gian để tụ đạt 4 V.</p>
<div class="dap-an"><div class="out">τ = R·C = 1000 × 1 × 10⁻⁶ = <b>10⁻³ s = 1 ms</b><br>4 = 5(1 − e<sup>−t/τ</sup>) → e<sup>−t/τ</sup> = 0,2 → t = −τ·ln(0,2)<br>t = 1 ms × 1,609 = <b>1,61 ms</b></div>
<p>Chú ý 4 V trên 5 V là 80%, và nó cần khoảng 1,6 hằng số thời gian — nhiều hơn 63,2% mà một hằng số cho, ít hơn 99,3% ở năm hằng số. Vẽ nhanh đường hàm mũ rồi đọc ước lượng trước khi tính là cách phòng vệ nhanh nhất chống lại một đáp án sai bậc độ lớn.</p></div>`,
  ]]);

/* ── 1.9 buổi 9: Từ trường (FLM in cột CLO là "CLO 1" — có dấu cách) ─────── */
const l19 = doc('sdi101m-1-9-tu-truong',
  '1.9 — Magnetic Fields: force on moving charge, Hall effect|||1.9 — Từ trường: lực lên điện tích chuyển động, hiệu ứng Hall',
  'Buổi 9, CLO1: lực Lorentz F = qvB·sinθ, quy tắc bàn tay, lực lên dây F = BIL, từ trường của dây thẳng và ống dây, và HIỆU ỨNG HALL — phép đo duy nhất cho biết hạt tải là electron hay lỗ trống, nền của buổi 28. Ví dụ tính và bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 9 · CLO1</span>
<h2>Magnetic fields</h2>
<p class="lead">After this session you can compute the force a magnetic field puts on a moving charge and on a current-carrying wire, find the field of a straight wire and a solenoid, and use the <strong>Hall effect</strong> — the one measurement that tells you whether the carriers in a sample are electrons or holes, and how many there are.</p>
<p class="nhan">` + NGUON + ` · session 9 — "Magnetic Fields". <span class="ghi-chu">The FLM plan prints this row's outcome as "CLO 1" with a space; every other row writes CLO1. Same outcome — see lesson 0.3.</span></p>
<h3>The force on a moving charge</h3>
<div class="formula">F = q · v · B · sin θ&nbsp;&nbsp;&nbsp;[B] = tesla (T)</div>
<p>Three properties of this force are unlike anything in the electric case, and all three matter:</p>
<ul>
<li>It needs <strong>motion</strong>. A charge sitting still in a magnetic field feels nothing at all.</li>
<li>It is <strong>perpendicular to both</strong> v and B — not along either of them.</li>
<li>Because it is perpendicular to the motion, it <strong>does no work</strong>. A magnetic field can bend a charge's path but never change its speed.</li>
</ul>
<p>θ is the angle between v and B: maximum force when they are perpendicular (sin 90° = 1), <strong>zero</strong> when the charge moves along the field (sin 0° = 0).</p>
<div class="diagram"><pre>  B into the page (x)      electron moving right (v ->)

   x   x   x   x           force on a POSITIVE charge: UP
   x   x   x   x           force on an ELECTRON:      DOWN
   x  (v)->  x   x         (same v, same B, opposite sign)
   x   x   x   x
                           -> charge piles up on one face
   the path curves into a circle of        = the HALL VOLTAGE
   radius r = m.v / (q.B)</pre></div>
<h3>Force on a current-carrying wire, and fields from currents</h3>
<div class="formula">F = B · I · L · sin θ&nbsp;&nbsp;·&nbsp;&nbsp;straight wire: B = μ₀·I / (2π·r)&nbsp;&nbsp;·&nbsp;&nbsp;solenoid: B = μ₀·n·I</div>
<p>with μ₀ = 4π × 10⁻⁷ H/m and n the number of turns per metre. A current is just moving charge, so the force on a wire is the same law summed over all its carriers.</p>
<h3>Worked example 1 — fields and forces with real numbers</h3>
<div class="out">Field 2 cm from a wire carrying 5 A:<br>B = 4π × 10⁻⁷ × 5 ÷ (2π × 0.02) = <b>5 × 10⁻⁵ T = 50 µT</b><br>&nbsp;&nbsp;(for scale: Earth's field is about 50 µT — this wire matches it at 2 cm)<br><br>Solenoid, n = 1000 turns/m, I = 2 A:<br>B = 4π × 10⁻⁷ × 1000 × 2 = <b>2.51 × 10⁻³ T = 2.51 mT</b><br><br>Force on a wire, B = 0.2 T, I = 3 A, L = 0.1 m, perpendicular:<br>F = 0.2 × 3 × 0.1 = <b>0.06 N</b><br><br>Electron at v = 10⁶ m/s across B = 0.5 T:<br>F = 1.602 × 10⁻¹⁹ × 10⁶ × 0.5 = <b>8.01 × 10⁻¹⁴ N</b><br>radius of its circular path: r = m<sub>e</sub>v/(qB) = 9.109e-31 × 1e6 ÷ (1.602e-19 × 0.5)<br>&nbsp;&nbsp;= <b>1.14 × 10⁻⁵ m = 11.4 µm</b></div>
<h3>The Hall effect — why this session belongs in a semiconductor course</h3>
<p>Pass a current I along a slab of thickness t, and apply a magnetic field B through it. The moving carriers are pushed sideways by the magnetic force, pile up on one face, and build a transverse electric field until the electric force balances the magnetic one. The voltage across that direction is the <strong>Hall voltage</strong>:</p>
<div class="formula">V<sub>H</sub> = I · B / (n · q · t)</div>
<div class="callout"><span class="badge">Why it is irreplaceable</span> Everything else you can measure about a sample — resistance, resistivity, conductivity — gives you the <em>product</em> n·μ. The Hall effect gives <strong>n on its own</strong>, so combining the two gives μ as well. And the <strong>sign</strong> of V<sub>H</sub> tells you the sign of the carriers: <strong>positive for holes (p-type), negative for electrons (n-type)</strong>. That is how you find out, experimentally, whether a wafer is n-type or p-type — and it is why session 28 is titled "Drift of Carriers in Electric <em>and Magnetic</em> Fields".</div>
<h3>Worked example 2 — a Hall measurement</h3>
<p>A silicon sample with n = 10¹⁶ cm⁻³, thickness t = 0.5 mm, current I = 1 mA, field B = 0.1 T.</p>
<div class="out">Into SI: n = 10¹⁶ cm⁻³ × 10⁶ = 10²² m⁻³ · t = 5 × 10⁻⁴ m<br>V<sub>H</sub> = I·B / (n·q·t) = (10⁻³ × 0.1) ÷ (10²² × 1.602 × 10⁻¹⁹ × 5 × 10⁻⁴)<br>&nbsp;&nbsp;= 10⁻⁴ ÷ 0.801 = <b>1.248 × 10⁻⁴ V = 0.125 mV</b></div>
<p>A tenth of a millivolt. Small, but perfectly measurable — and notice from the formula that V<sub>H</sub> is <em>larger</em> for a thinner, more lightly doped sample. That is why Hall measurements use thin films, and why the same physics turns into a cheap magnetic sensor (the Hall sensor in a phone compass or a brushless motor).</p>
<div class="pitfall"><b>Forgetting sin θ.</b> A charge moving <em>along</em> the field feels no force at all — this is a favourite exam question. <b>Thinking the magnetic force changes the speed.</b> It cannot; it is always perpendicular to v, so it does zero work. Only the direction changes. <b>Using the same hand rule for electrons as for positive charges.</b> Get the direction for a positive carrier, then reverse it for an electron. <b>Leaving n in cm⁻³ and t in mm in the Hall formula.</b> Convert both first, or the answer is out by orders of magnitude.</div>
<h3>Exercise</h3>
<p><b>E1.</b> What is the magnetic field 5 cm from a long straight wire carrying 10 A?</p>
<div class="dap-an"><div class="out">B = μ₀·I/(2πr) = 4π × 10⁻⁷ × 10 ÷ (2π × 0.05)<br>&nbsp;&nbsp;= (2 × 10⁻⁷ × 10) ÷ 0.05 = <b>4 × 10⁻⁵ T = 40 µT</b></div>
<p>Useful shortcut: μ₀/(2π) = 2 × 10⁻⁷ exactly, so B = 2 × 10⁻⁷ · I/r. It removes the π from the arithmetic and one source of slips.</p></div>
<p><b>E2.</b> A Hall measurement on a 0.2 mm thick sample gives V<sub>H</sub> = 1.2 mV with I = 1 mA and B = 0.2 T, and V<sub>H</sub> comes out <em>negative</em>. Find the carrier concentration and say what type the sample is.</p>
<div class="dap-an"><div class="out">n = I·B / (q·V<sub>H</sub>·t)<br>&nbsp;&nbsp;= (10⁻³ × 0.2) ÷ (1.602 × 10⁻¹⁹ × 1.2 × 10⁻³ × 2 × 10⁻⁴)<br>&nbsp;&nbsp;= 2 × 10⁻⁴ ÷ 3.845 × 10⁻²⁶ = <b>5.20 × 10²¹ m⁻³ = 5.20 × 10¹⁵ cm⁻³</b><br>V<sub>H</sub> negative → carriers are <b>electrons</b> → the sample is <b>n-type</b></div>
<p>One measurement, two answers: how many carriers, and which kind. That pair is exactly what you need before you can predict anything about a device made from the wafer — which is why the Hall effect is the standard acceptance test for material coming out of a crystal grower.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 9 · CLO1</span>
<h2>Từ trường</h2>
<p class="lead">Học xong buổi này bạn tính được lực từ trường tác dụng lên một điện tích chuyển động và lên một dây có dòng, tìm được từ trường của dây thẳng và của ống dây, và dùng được <strong>hiệu ứng Hall</strong> — phép đo duy nhất cho biết hạt tải trong một mẫu là electron hay lỗ trống, và có bao nhiêu hạt.</p>
<p class="nhan">` + NGUON + ` · buổi 9 — "Magnetic Fields". <span class="ghi-chu">Bảng kế hoạch FLM in chuẩn đầu ra của dòng này là "CLO 1" có dấu cách; mọi dòng khác viết CLO1. Vẫn là chuẩn đầu ra ấy — xem bài 0.3.</span></p>
<h3>Lực lên một điện tích chuyển động</h3>
<div class="formula">F = q · v · B · sin θ&nbsp;&nbsp;&nbsp;[B] = tesla (T)</div>
<p>Ba tính chất của lực này khác hẳn mọi thứ ở phần điện, và cả ba đều quan trọng:</p>
<ul>
<li>Nó cần <strong>chuyển động</strong>. Một điện tích nằm yên trong từ trường không chịu lực nào cả.</li>
<li>Nó <strong>vuông góc với CẢ</strong> v và B — không dọc theo cái nào trong hai.</li>
<li>Vì vuông góc với chuyển động, nó <strong>không sinh công</strong>. Từ trường bẻ được đường đi của điện tích nhưng không bao giờ đổi được tốc độ của nó.</li>
</ul>
<p>θ là góc giữa v và B: lực lớn nhất khi chúng vuông góc (sin 90° = 1), <strong>bằng không</strong> khi điện tích chạy dọc theo từ trường (sin 0° = 0).</p>
<div class="diagram"><pre>  B huong VAO trang (x)     electron chay sang phai (v ->)

   x   x   x   x           luc len dien tich DUONG:  LEN
   x   x   x   x           luc len ELECTRON:         XUONG
   x  (v)->  x   x         (cung v, cung B, nguoc dau)
   x   x   x   x
                           -> dien tich don lai o mot mat
   duong di uon thanh cung tron          = DIEN AP HALL
   ban kinh r = m.v / (q.B)</pre></div>
<h3>Lực lên dây có dòng, và từ trường do dòng sinh ra</h3>
<div class="formula">F = B · I · L · sin θ&nbsp;&nbsp;·&nbsp;&nbsp;dây thẳng: B = μ₀·I / (2π·r)&nbsp;&nbsp;·&nbsp;&nbsp;ống dây: B = μ₀·n·I</div>
<p>với μ₀ = 4π × 10⁻⁷ H/m và n là số vòng trên mỗi mét. Một dòng điện chỉ là điện tích đang chuyển động, nên lực lên một dây chính là định luật ấy cộng lại trên mọi hạt tải của nó.</p>
<h3>Ví dụ 1 — từ trường và lực với số thật</h3>
<div class="out">Từ trường cách 2 cm một dây mang 5 A:<br>B = 4π × 10⁻⁷ × 5 ÷ (2π × 0,02) = <b>5 × 10⁻⁵ T = 50 µT</b><br>&nbsp;&nbsp;(để so: từ trường Trái Đất khoảng 50 µT — dây này bằng nó ở cách 2 cm)<br><br>Ống dây, n = 1000 vòng/m, I = 2 A:<br>B = 4π × 10⁻⁷ × 1000 × 2 = <b>2,51 × 10⁻³ T = 2,51 mT</b><br><br>Lực lên một dây, B = 0,2 T, I = 3 A, L = 0,1 m, vuông góc:<br>F = 0,2 × 3 × 0,1 = <b>0,06 N</b><br><br>Electron với v = 10⁶ m/s cắt ngang B = 0,5 T:<br>F = 1,602 × 10⁻¹⁹ × 10⁶ × 0,5 = <b>8,01 × 10⁻¹⁴ N</b><br>bán kính đường tròn của nó: r = m<sub>e</sub>v/(qB) = 9,109e-31 × 1e6 ÷ (1,602e-19 × 0,5)<br>&nbsp;&nbsp;= <b>1,14 × 10⁻⁵ m = 11,4 µm</b></div>
<h3>Hiệu ứng Hall — vì sao buổi này thuộc về một môn bán dẫn</h3>
<p>Cho một dòng I chạy dọc một phiến dày t, rồi đặt từ trường B xuyên qua nó. Các hạt tải đang chuyển động bị lực từ đẩy sang một bên, dồn lại ở một mặt, và dựng lên một điện trường ngang cho tới khi lực điện cân bằng lực từ. Điện áp theo phương ngang đó là <strong>điện áp Hall</strong>:</p>
<div class="formula">V<sub>H</sub> = I · B / (n · q · t)</div>
<div class="callout"><span class="badge">Vì sao không gì thay được nó</span> Mọi thứ khác mà bạn đo được trên một mẫu — điện trở, điện trở suất, độ dẫn — đều cho bạn cái <em>tích</em> n·μ. Hiệu ứng Hall cho <strong>riêng n</strong>, nên ghép hai phép đo lại là có luôn μ. Và <strong>dấu</strong> của V<sub>H</sub> cho biết dấu của hạt tải: <strong>dương với lỗ trống (loại p), âm với electron (loại n)</strong>. Đó chính là cách người ta biết bằng thực nghiệm một phiến wafer là loại n hay loại p — và là lý do buổi 28 có tên là "Drift of Carriers in Electric <em>and Magnetic</em> Fields".</div>
<h3>Ví dụ 2 — một phép đo Hall</h3>
<p>Một mẫu silic với n = 10¹⁶ cm⁻³, bề dày t = 0,5 mm, dòng I = 1 mA, từ trường B = 0,1 T.</p>
<div class="out">Đổi sang SI: n = 10¹⁶ cm⁻³ × 10⁶ = 10²² m⁻³ · t = 5 × 10⁻⁴ m<br>V<sub>H</sub> = I·B / (n·q·t) = (10⁻³ × 0,1) ÷ (10²² × 1,602 × 10⁻¹⁹ × 5 × 10⁻⁴)<br>&nbsp;&nbsp;= 10⁻⁴ ÷ 0,801 = <b>1,248 × 10⁻⁴ V = 0,125 mV</b></div>
<p>Một phần mười milivolt. Nhỏ, nhưng đo được hoàn toàn — và hãy để ý từ công thức rằng V<sub>H</sub> <em>lớn hơn</em> với mẫu mỏng hơn và pha tạp nhạt hơn. Đó là lý do phép đo Hall dùng màng mỏng, và là lý do đúng vật lý ấy biến thành một cảm biến từ rẻ tiền (cảm biến Hall trong la bàn điện thoại hay trong động cơ không cổ góp).</p>
<div class="pitfall"><b>Quên sin θ.</b> Một điện tích chạy <em>dọc theo</em> từ trường không chịu lực nào cả — đây là câu hỏi ưa thích của đề thi. <b>Nghĩ rằng lực từ làm đổi tốc độ.</b> Nó không thể; nó luôn vuông góc với v nên sinh công bằng không. Chỉ hướng thay đổi. <b>Dùng cùng một quy tắc bàn tay cho electron như cho điện tích dương.</b> Hãy tìm chiều cho hạt tải dương trước, rồi đảo lại cho electron. <b>Để n ở cm⁻³ và t ở mm trong công thức Hall.</b> Phải đổi cả hai trước, nếu không đáp án lệch nhiều bậc độ lớn.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Từ trường cách 5 cm một dây thẳng dài mang dòng 10 A là bao nhiêu?</p>
<div class="dap-an"><div class="out">B = μ₀·I/(2πr) = 4π × 10⁻⁷ × 10 ÷ (2π × 0,05)<br>&nbsp;&nbsp;= (2 × 10⁻⁷ × 10) ÷ 0,05 = <b>4 × 10⁻⁵ T = 40 µT</b></div>
<p>Một lối tắt hữu dụng: μ₀/(2π) = 2 × 10⁻⁷ đúng bằng như vậy, nên B = 2 × 10⁻⁷ · I/r. Nó bỏ được số π khỏi phép tính, và bỏ luôn một nguồn sai sót.</p></div>
<p><b>B2.</b> Một phép đo Hall trên mẫu dày 0,2 mm cho V<sub>H</sub> = 1,2 mV với I = 1 mA và B = 0,2 T, và V<sub>H</sub> ra dấu <em>âm</em>. Tìm nồng độ hạt tải và cho biết mẫu là loại gì.</p>
<div class="dap-an"><div class="out">n = I·B / (q·V<sub>H</sub>·t)<br>&nbsp;&nbsp;= (10⁻³ × 0,2) ÷ (1,602 × 10⁻¹⁹ × 1,2 × 10⁻³ × 2 × 10⁻⁴)<br>&nbsp;&nbsp;= 2 × 10⁻⁴ ÷ 3,845 × 10⁻²⁶ = <b>5,20 × 10²¹ m⁻³ = 5,20 × 10¹⁵ cm⁻³</b><br>V<sub>H</sub> âm → hạt tải là <b>electron</b> → mẫu là <b>loại n</b></div>
<p>Một phép đo, hai câu trả lời: có bao nhiêu hạt tải, và loại nào. Đúng cặp thông tin đó là thứ bạn cần trước khi có thể dự đoán bất cứ điều gì về một linh kiện làm từ phiến wafer — và đó là lý do hiệu ứng Hall là phép kiểm nghiệm thu chuẩn cho vật liệu ra khỏi lò kéo tinh thể.</p></div>`,
  ]]);

/* ── 1.10 buổi 10: Điện cảm & dòng xoay chiều (nền trực tiếp cho LAB 1) ──── */
const l110 = doc('sdi101m-1-10-dien-cam-dong-xoay-chieu',
  '1.10 — Inductance and Alternating Current: the RLC circuit|||1.10 — Điện cảm và dòng xoay chiều: mạch RLC',
  'Buổi 10, CLO1 (+nền CLO2): tự cảm L, sức điện động cảm ứng, năng lượng ½LI², dung kháng và cảm kháng, tổng trở Z, RMS, và CỘNG HƯỞNG f₀ = 1/(2π√LC). Tính đầy đủ một mạch RLC 100 Ω / 10 mH / 100 nF → f₀ = 5,03 kHz — đúng mạch của LAB 1. Bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 10 · CLO1</span>
<h2>Inductance and alternating current</h2>
<p class="lead">After this session you can compute inductive and capacitive reactance, find the impedance and phase of a series RLC circuit, and find its resonant frequency. This is the direct preparation for LAB 1 (sessions 16–21, "LAB 1: RLC CIRCUITS"), which is 5% of your grade and the home of CLO2.</p>
<p class="nhan">` + NGUON + ` · session 10 — "Inductance and Alternating Current"</p>
<h3>Inductance — a capacitor's mirror image</h3>
<div class="formula">emf = − L · dI/dt&nbsp;&nbsp;·&nbsp;&nbsp;U = ½ · L · I²&nbsp;&nbsp;·&nbsp;&nbsp;[L] = henry (H) = V·s/A</div>
<p>An inductor opposes a <em>change</em> of current, exactly as a capacitor opposes a change of voltage. That symmetry is worth memorising as a table, because it halves what you have to remember:</p>
<table>
  <thead><tr><th></th><th>Capacitor</th><th>Inductor</th></tr></thead>
  <tbody>
    <tr><td>stores energy in</td><td>the electric field</td><td>the magnetic field</td></tr>
    <tr><td>energy</td><td>½CV²</td><td>½LI²</td></tr>
    <tr><td>resists a change of</td><td>voltage</td><td>current</td></tr>
    <tr><td>at DC (f = 0)</td><td>blocks — open circuit</td><td>passes — short circuit</td></tr>
    <tr><td>at very high f</td><td>passes</td><td>blocks</td></tr>
    <tr><td>reactance</td><td>X<sub>C</sub> = 1/(2πfC), falls with f</td><td>X<sub>L</sub> = 2πfL, rises with f</td></tr>
  </tbody>
</table>
<div class="out">Example: L = 10 mH, current changing 2 A in 1 ms:<br>emf = L·dI/dt = 10 × 10⁻³ × 2 ÷ 10⁻³ = <b>20 V</b><br>Energy stored at I = 0.5 A: U = ½ × 10 × 10⁻³ × 0.25 = <b>1.25 mJ</b></div>
<p>That 20 V from a 10 mH coil is worth remembering. It is why switching off an inductive load (a relay, a motor) produces a voltage spike far larger than the supply, and why a diode is placed across such a load to absorb it — a diode doing a job you will only fully understand at session 33.</p>
<h3>AC quantities: peak and RMS</h3>
<div class="formula">V<sub>rms</sub> = V<sub>peak</sub> / √2&nbsp;&nbsp;⟺&nbsp;&nbsp;V<sub>peak</sub> = V<sub>rms</sub> · √2</div>
<div class="out">Mains at 220 V<sub>rms</sub> → V<sub>peak</sub> = 220 × 1.4142 = <b>311 V</b></div>
<p>RMS is defined so that an AC voltage delivers the same average power into a resistor as a DC voltage of the same number. A multimeter shows RMS; an oscilloscope shows peaks. In LAB 1 you will be reading both instruments at once, so know which one is telling you what — and note that the 311 V peak is the number that matters for insulation and for safety, not the 220 V on the label.</p>
<h3>The series RLC circuit</h3>
<div class="formula">Z = √( R² + (X<sub>L</sub> − X<sub>C</sub>)² )&nbsp;&nbsp;·&nbsp;&nbsp;tan φ = (X<sub>L</sub> − X<sub>C</sub>) / R&nbsp;&nbsp;·&nbsp;&nbsp;I = V/Z</div>
<p>Reactances subtract, not add, because the inductor's voltage and the capacitor's voltage are 180° out of phase — they fight each other. When they cancel exactly, the circuit is at <strong>resonance</strong>:</p>
<div class="formula">X<sub>L</sub> = X<sub>C</sub>&nbsp;&nbsp;⟹&nbsp;&nbsp;f₀ = 1 / (2π · √(L·C))&nbsp;&nbsp;·&nbsp;&nbsp;Q = X<sub>L</sub>/R = 2πf₀L/R</div>
<h3>Worked example — the full LAB 1 circuit</h3>
<p>Series R = 100 Ω, L = 10 mH, C = 100 nF. Find the resonant frequency, then the impedance at resonance and at 1 kHz.</p>
<div class="out">f₀ = 1 / (2π√(10 × 10⁻³ × 100 × 10⁻⁹)) = 1/(2π√(10⁻⁹))<br>&nbsp;&nbsp;= 1 ÷ (2π × 3.1623 × 10⁻⁵) = <b>5032.9 Hz = 5.03 kHz</b><br><br><b>At f₀ = 5032.9 Hz:</b><br>X<sub>L</sub> = 2π × 5032.9 × 0.01 = <b>316.2 Ω</b><br>X<sub>C</sub> = 1/(2π × 5032.9 × 100 × 10⁻⁹) = <b>316.2 Ω</b> — equal, as they must be<br>Z = √(100² + 0²) = <b>100 Ω = R</b> — the minimum possible<br>Q = 316.2 / 100 = <b>3.16</b><br><br><b>At f = 1 kHz (below resonance):</b><br>X<sub>L</sub> = 2π × 1000 × 0.01 = <b>62.8 Ω</b><br>X<sub>C</sub> = 1/(2π × 1000 × 100 × 10⁻⁹) = <b>1591.5 Ω</b><br>Z = √(100² + (62.8 − 1591.5)²) = √(10⁴ + 2.337 × 10⁶) = <b>1532 Ω</b><br>φ = arctan(−1528.7 / 100) = <b>−86.3°</b> — current lags far behind: capacitive</div>
<div class="callout ok"><strong>Read what those numbers say.</strong> At 1 kHz the circuit shows 1532 Ω; at 5.03 kHz it shows 100 Ω. Same three components, a <strong>fifteenfold</strong> change in impedance from frequency alone — and at resonance the circuit behaves as if L and C were not there. Sweeping the generator and watching the current peak is exactly the measurement LAB 1 asks for, and the peak should sit at 5.03 kHz.</div>
<div class="pitfall"><b>Adding X<sub>L</sub> and X<sub>C</sub>.</b> They subtract: Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²). <b>Forgetting the 2π.</b> ω = 2πf; using f where ω belongs makes f₀ wrong by 6.28. <b>Mixing mH with nF unconverted</b> inside the square root. <b>Assuming Z = R + X<sub>L</sub> + X<sub>C</sub>.</b> Impedances combine like vectors at right angles, not like resistances in series. <b>Confusing RMS with peak on the bench.</b> The multimeter and the oscilloscope disagree by √2 and both are right.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Find the resonant frequency of L = 1 mH with C = 10 nF.</p>
<div class="dap-an"><div class="out">L·C = 10⁻³ × 10⁻⁸ = 10⁻¹¹ · √(10⁻¹¹) = 3.1623 × 10⁻⁶<br>f₀ = 1 ÷ (2π × 3.1623 × 10⁻⁶) = <b>50 329 Hz = 50.3 kHz</b></div>
<p>Compare with the worked example: both L and C are ten times smaller, and f₀ came out exactly ten times higher. Because f₀ depends on 1/√(LC), dividing the product by 100 multiplies the frequency by 10 — a good ratio to know for a quick sanity check in the lab.</p></div>
<p><b>E2.</b> For the LAB 1 circuit (R = 100 Ω, L = 10 mH, C = 100 nF), find Z and the phase at f = 2 kHz.</p>
<div class="dap-an"><div class="out">X<sub>L</sub> = 2π × 2000 × 0.01 = <b>125.7 Ω</b><br>X<sub>C</sub> = 1/(2π × 2000 × 100 × 10⁻⁹) = <b>795.8 Ω</b><br>X<sub>L</sub> − X<sub>C</sub> = −670.1 Ω<br>Z = √(100² + 670.1²) = <b>677.5 Ω</b><br>φ = arctan(−670.1/100) = <b>−81.5°</b></div>
<p>Still below resonance, so still capacitive (negative phase), but closer than at 1 kHz: Z has fallen from 1532 Ω to 677 Ω on the way down to 100 Ω at 5.03 kHz. Plotting Z against f from these three points already draws the resonance curve you will measure.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 10 · CLO1</span>
<h2>Điện cảm và dòng điện xoay chiều</h2>
<p class="lead">Học xong buổi này bạn tính được cảm kháng và dung kháng, tìm được tổng trở và góc lệch pha của mạch RLC nối tiếp, và tìm được tần số cộng hưởng của nó. Đây là phần chuẩn bị trực tiếp cho LAB 1 (buổi 16–21, "LAB 1: RLC CIRCUITS"), vốn chiếm 5% điểm môn và là nơi trú của CLO2.</p>
<p class="nhan">` + NGUON + ` · buổi 10 — "Inductance and Alternating Current"</p>
<h3>Điện cảm — hình ảnh phản chiếu của tụ điện</h3>
<div class="formula">sđđ = − L · dI/dt&nbsp;&nbsp;·&nbsp;&nbsp;U = ½ · L · I²&nbsp;&nbsp;·&nbsp;&nbsp;[L] = henry (H) = V·s/A</div>
<p>Cuộn cảm chống lại sự <em>thay đổi</em> của dòng, đúng như tụ điện chống lại sự thay đổi của điện áp. Tính đối xứng đó nên học dưới dạng một bảng, vì nó giảm một nửa lượng phải nhớ:</p>
<table>
  <thead><tr><th></th><th>Tụ điện</th><th>Cuộn cảm</th></tr></thead>
  <tbody>
    <tr><td>tích trữ năng lượng trong</td><td>điện trường</td><td>từ trường</td></tr>
    <tr><td>năng lượng</td><td>½CV²</td><td>½LI²</td></tr>
    <tr><td>chống lại sự thay đổi của</td><td>điện áp</td><td>dòng điện</td></tr>
    <tr><td>với DC (f = 0)</td><td>chặn — như hở mạch</td><td>cho qua — như ngắn mạch</td></tr>
    <tr><td>với f rất cao</td><td>cho qua</td><td>chặn</td></tr>
    <tr><td>trở kháng phản kháng</td><td>X<sub>C</sub> = 1/(2πfC), giảm theo f</td><td>X<sub>L</sub> = 2πfL, tăng theo f</td></tr>
  </tbody>
</table>
<div class="out">Ví dụ: L = 10 mH, dòng đổi 2 A trong 1 ms:<br>sđđ = L·dI/dt = 10 × 10⁻³ × 2 ÷ 10⁻³ = <b>20 V</b><br>Năng lượng tích trữ ở I = 0,5 A: U = ½ × 10 × 10⁻³ × 0,25 = <b>1,25 mJ</b></div>
<p>Con số 20 V từ một cuộn 10 mH đáng nhớ. Đó là lý do ngắt một tải có cuộn dây (rơ-le, động cơ) sinh ra một xung điện áp lớn hơn nguồn rất nhiều, và là lý do người ta mắc một diode song song với tải đó để hấp thụ nó — một việc mà diode làm, nhưng bạn chỉ hiểu trọn ở buổi 33.</p>
<h3>Đại lượng xoay chiều: giá trị đỉnh và giá trị hiệu dụng</h3>
<div class="formula">V<sub>hd</sub> = V<sub>đỉnh</sub> / √2&nbsp;&nbsp;⟺&nbsp;&nbsp;V<sub>đỉnh</sub> = V<sub>hd</sub> · √2</div>
<div class="out">Điện lưới 220 V hiệu dụng → V<sub>đỉnh</sub> = 220 × 1,4142 = <b>311 V</b></div>
<p>Giá trị hiệu dụng (RMS) được định nghĩa sao cho một điện áp xoay chiều toả ra cùng công suất trung bình trên một điện trở như một điện áp một chiều cùng con số. Đồng hồ đo hiện giá trị hiệu dụng; máy hiện sóng hiện giá trị đỉnh. Trong LAB 1 bạn sẽ đọc cả hai thiết bị cùng lúc, nên phải biết cái nào đang nói điều gì — và chú ý rằng 311 V đỉnh mới là con số quyết định về cách điện và về an toàn, không phải 220 V trên nhãn.</p>
<h3>Mạch RLC nối tiếp</h3>
<div class="formula">Z = √( R² + (X<sub>L</sub> − X<sub>C</sub>)² )&nbsp;&nbsp;·&nbsp;&nbsp;tan φ = (X<sub>L</sub> − X<sub>C</sub>) / R&nbsp;&nbsp;·&nbsp;&nbsp;I = V/Z</div>
<p>Hai trở kháng phản kháng TRỪ nhau, không cộng, vì điện áp trên cuộn cảm và trên tụ lệch pha nhau 180° — chúng chống nhau. Khi chúng triệt tiêu đúng bằng nhau thì mạch ở trạng thái <strong>cộng hưởng</strong>:</p>
<div class="formula">X<sub>L</sub> = X<sub>C</sub>&nbsp;&nbsp;⟹&nbsp;&nbsp;f₀ = 1 / (2π · √(L·C))&nbsp;&nbsp;·&nbsp;&nbsp;Q = X<sub>L</sub>/R = 2πf₀L/R</div>
<h3>Ví dụ — trọn mạch của LAB 1</h3>
<p>Nối tiếp R = 100 Ω, L = 10 mH, C = 100 nF. Tìm tần số cộng hưởng, rồi tổng trở tại cộng hưởng và tại 1 kHz.</p>
<div class="out">f₀ = 1 / (2π√(10 × 10⁻³ × 100 × 10⁻⁹)) = 1/(2π√(10⁻⁹))<br>&nbsp;&nbsp;= 1 ÷ (2π × 3,1623 × 10⁻⁵) = <b>5032,9 Hz = 5,03 kHz</b><br><br><b>Tại f₀ = 5032,9 Hz:</b><br>X<sub>L</sub> = 2π × 5032,9 × 0,01 = <b>316,2 Ω</b><br>X<sub>C</sub> = 1/(2π × 5032,9 × 100 × 10⁻⁹) = <b>316,2 Ω</b> — bằng nhau, đúng như phải vậy<br>Z = √(100² + 0²) = <b>100 Ω = R</b> — giá trị nhỏ nhất có thể<br>Q = 316,2 / 100 = <b>3,16</b><br><br><b>Tại f = 1 kHz (dưới cộng hưởng):</b><br>X<sub>L</sub> = 2π × 1000 × 0,01 = <b>62,8 Ω</b><br>X<sub>C</sub> = 1/(2π × 1000 × 100 × 10⁻⁹) = <b>1591,5 Ω</b><br>Z = √(100² + (62,8 − 1591,5)²) = √(10⁴ + 2,337 × 10⁶) = <b>1532 Ω</b><br>φ = arctan(−1528,7 / 100) = <b>−86,3°</b> — dòng trễ rất xa: mạch mang tính dung</div>
<div class="callout ok"><strong>Hãy đọc điều những con số đó nói.</strong> Ở 1 kHz mạch cho 1532 Ω; ở 5,03 kHz nó cho 100 Ω. Vẫn ba linh kiện ấy, mà tổng trở đổi <strong>mười lăm lần</strong> chỉ do tần số — và tại cộng hưởng mạch hành xử như thể L và C không có ở đó. Quét tần số máy phát rồi xem dòng đạt đỉnh chính là phép đo mà LAB 1 yêu cầu, và đỉnh đó phải nằm ở 5,03 kHz.</div>
<div class="pitfall"><b>Cộng X<sub>L</sub> với X<sub>C</sub>.</b> Chúng trừ nhau: Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²). <b>Quên số 2π.</b> ω = 2πf; dùng f ở chỗ của ω là f₀ sai đi 6,28 lần. <b>Trộn mH với nF mà chưa đổi đơn vị</b> trong dấu căn. <b>Cho rằng Z = R + X<sub>L</sub> + X<sub>C</sub>.</b> Các trở kháng ghép như các vectơ vuông góc, không như điện trở nối tiếp. <b>Lẫn giá trị hiệu dụng với giá trị đỉnh khi làm thực nghiệm.</b> Đồng hồ đo và máy hiện sóng lệch nhau √2 lần và cả hai đều đúng.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Tìm tần số cộng hưởng của L = 1 mH với C = 10 nF.</p>
<div class="dap-an"><div class="out">L·C = 10⁻³ × 10⁻⁸ = 10⁻¹¹ · √(10⁻¹¹) = 3,1623 × 10⁻⁶<br>f₀ = 1 ÷ (2π × 3,1623 × 10⁻⁶) = <b>50 329 Hz = 50,3 kHz</b></div>
<p>So với ví dụ trên: cả L và C đều nhỏ đi mười lần, và f₀ ra cao lên đúng mười lần. Vì f₀ phụ thuộc 1/√(LC), chia tích đó cho 100 thì tần số nhân 10 — một tỷ số nên biết để kiểm nhanh khi đang ở phòng lab.</p></div>
<p><b>B2.</b> Với mạch LAB 1 (R = 100 Ω, L = 10 mH, C = 100 nF), tìm Z và góc lệch pha ở f = 2 kHz.</p>
<div class="dap-an"><div class="out">X<sub>L</sub> = 2π × 2000 × 0,01 = <b>125,7 Ω</b><br>X<sub>C</sub> = 1/(2π × 2000 × 100 × 10⁻⁹) = <b>795,8 Ω</b><br>X<sub>L</sub> − X<sub>C</sub> = −670,1 Ω<br>Z = √(100² + 670,1²) = <b>677,5 Ω</b><br>φ = arctan(−670,1/100) = <b>−81,5°</b></div>
<p>Vẫn dưới cộng hưởng nên vẫn mang tính dung (pha âm), nhưng đã gần hơn so với ở 1 kHz: Z tụt từ 1532 Ω xuống 677 Ω trên đường về 100 Ω tại 5,03 kHz. Vẽ Z theo f từ ba điểm này là đã ra đúng đường cộng hưởng mà bạn sẽ đo.</p></div>`,
  ]]);

/* ── 1.11 buổi 11: Sóng điện từ (nối trực tiếp sang khe cấm & quang khắc) ── */
const l111 = doc('sdi101m-1-11-song-dien-tu',
  '1.11 — Electromagnetic Waves: photons, band gap, lithography|||1.11 — Sóng điện từ: photon, khe cấm và quang khắc',
  'Buổi 11, CLO1: c = λf, phổ điện từ, năng lượng photon E = hc/λ và hằng số 1240 eV·nm; ứng dụng thẳng vào bán dẫn: Si Eg = 1,12 eV ↔ 1107 nm (vì sao Si trong suốt với hồng ngoại), LED đổi màu theo khe cấm, và quang khắc DUV 193 nm / EUV 13,5 nm. Bài tập kèm lời giải.',
  [[
    `<span class="eyebrow">SDI101m · Session 11 · CLO1</span>
<h2>Electromagnetic waves</h2>
<p class="lead">This is the session where the electromagnetism half hands over to the semiconductor half. After it you can convert between wavelength, frequency and photon energy, and you can answer three real device questions with one formula: what colour an LED emits, what light a silicon detector can see, and why lithography moved to 13.5 nm.</p>
<p class="nhan">` + NGUON + ` · session 11 — "Electromagnetic Waves"</p>
<h3>What a wave is, from the previous ten sessions</h3>
<p>A changing electric field creates a magnetic field, and a changing magnetic field creates an electric field. Once started, the pair sustains each other and travels without any medium. That is light — and it is the last thing Maxwell's equations say after everything in sessions 2 to 10.</p>
<div class="formula">c = λ · f = 2.998 × 10⁸ m/s&nbsp;&nbsp;·&nbsp;&nbsp;E/B = c&nbsp;&nbsp;·&nbsp;&nbsp;E and B are perpendicular to each other and to the direction of travel</div>
<div class="out">550 nm green light: f = c/λ = 2.998 × 10⁸ ÷ 550 × 10⁻⁹ = <b>5.45 × 10¹⁴ Hz = 545 THz</b><br>2.4 GHz Wi-Fi: λ = c/f = 2.998 × 10⁸ ÷ 2.4 × 10⁹ = <b>0.125 m = 12.5 cm</b><br>A wave with E₀ = 100 V/m has B₀ = 100/c = <b>0.334 µT</b></div>
<h3>The photon, and the one constant to memorise</h3>
<div class="formula">E = h · f = h · c / λ&nbsp;&nbsp;&nbsp;⟹&nbsp;&nbsp;&nbsp;E(eV) = 1240 / λ(nm)</div>
<p>That 1240 is hc/q expressed in eV·nm, and with the constants of this course it comes out at exactly 1240. Learn this one number and you can do every optical-semiconductor question in your head. Short wavelength means high energy; long wavelength means low energy.</p>
<h3>Application 1 — the band gap decides what a material sees and emits</h3>
<p>A semiconductor can only absorb a photon whose energy is at least its band gap E<sub>g</sub> — anything weaker passes straight through. And when an electron falls back across the gap, the photon it emits carries about E<sub>g</sub>. So <strong>the band gap fixes both the absorption edge and the emission colour</strong>:</p>
<table>
  <thead><tr><th>Material</th><th>E<sub>g</sub> (eV)</th><th>λ = 1240/E<sub>g</sub></th><th>Region</th><th>Device</th></tr></thead>
  <tbody>
    <tr><td>Ge</td><td>0.66</td><td><strong>1879 nm</strong></td><td>infrared</td><td>IR detector</td></tr>
    <tr><td><strong>Si</strong></td><td><strong>1.12</strong></td><td><strong>1107 nm</strong></td><td>near infrared</td><td>solar cell, camera sensor</td></tr>
    <tr><td>GaAs</td><td>1.42</td><td><strong>873 nm</strong></td><td>near infrared</td><td>laser diode, fibre optics</td></tr>
    <tr><td>red LED material</td><td>≈ 1.9</td><td><strong>653 nm</strong></td><td>red light</td><td>red LED</td></tr>
    <tr><td>GaN</td><td>≈ 2.7</td><td><strong>459 nm</strong></td><td>blue light</td><td>blue LED, white lighting</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Two facts you can now derive instead of memorise.</strong> First: <strong>silicon is transparent to infrared light beyond 1107 nm</strong> — a 1550 nm fibre-optic signal goes through a silicon chip as if it were glass, which is why fibre detectors are made of germanium or InGaAs and not silicon. Second: <strong>a blue LED needs a wide-gap material</strong>, about 2.7 eV. Silicon cannot make one at any price. That single fact is the whole reason gallium nitride exists as an industry, and the reason the blue LED took until the 1990s.</div>
<h3>Application 2 — lithography, where the wavelength sets the limit</h3>
<p>Photolithography prints the transistor pattern with light, and you cannot print features much finer than the wavelength you print with. So shrinking transistors means shrinking λ:</p>
<div class="out">DUV, λ = 193 nm: photon energy = 1240 ÷ 193 = <b>6.42 eV</b><br>EUV, λ = 13.5 nm: photon energy = 1240 ÷ 13.5 = <b>91.9 eV</b></div>
<p>Ninety-two electron-volts per photon. That is far above the energy that holds any molecule together, which is why EUV light is absorbed by air, by glass and by ordinary photoresist — an EUV machine must run in vacuum and use mirrors rather than lenses. The whole economics of the modern fab is contained in the jump from 6.4 eV to 91.9 eV, and you just computed it with 1240/λ.</p>
<div class="diagram"><pre>  wavelength   1 m      1 mm    1 um     1107nm   550nm   193nm  13.5nm
               |        |       |        |        |       |      |
               radio    micro   infrared |        visible DUV    EUV
                                         |
                              Si absorption edge (Eg = 1.12 eV)
               <--- lower photon energy ------- higher --->
               Si is TRANSPARENT here | Si ABSORBS here</pre></div>
<div class="pitfall"><b>Mixing nm and m in E = hc/λ.</b> Either use SI throughout, or use the shortcut E(eV) = 1240/λ(nm) — but never half of each. <b>Thinking a brighter light has more energetic photons.</b> Brightness is the <em>number</em> of photons; energy per photon depends only on wavelength. A dim blue photon beats a bright red one at freeing an electron. <b>Expecting a photon below E<sub>g</sub> to do something if you make it intense enough.</b> It does not: below the gap the material is transparent, at any intensity. <b>Assuming λ and f are independent.</b> They are locked by c = λf; fix one and the other follows.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Can 450 nm blue light generate an electron-hole pair in silicon (E<sub>g</sub> = 1.12 eV)? What about 1500 nm infrared?</p>
<div class="dap-an"><div class="out">450 nm: E = 1240 ÷ 450 = <b>2.756 eV</b> — greater than 1.12 eV → <b>yes, absorbed</b><br>1500 nm: E = 1240 ÷ 1500 = <b>0.827 eV</b> — less than 1.12 eV → <b>no, silicon is transparent</b></div>
<p>This is the entire physics of a silicon camera sensor and a silicon solar cell in two lines. It also explains a fact you can check yourself: a silicon solar cell wastes the energy of blue photons (2.756 eV absorbed to produce a 1.12 eV pair — the remaining 1.6 eV becomes heat) and cannot use infrared at all. Those two losses together are why a single-junction silicon cell has a hard theoretical efficiency ceiling.</p></div>
<p><b>E2.</b> A LED emits at 653 nm. What is the band gap of its material, and in which direction must the gap change to make the LED blue?</p>
<div class="dap-an"><div class="out">E<sub>g</sub> = 1240 ÷ 653 = <b>1.90 eV</b><br>Blue is about 459 nm → E<sub>g</sub> = 1240 ÷ 459 = <b>2.70 eV</b><br>The gap must get <b>wider</b>, by about 0.8 eV</div>
<p>You cannot widen a gap by changing the voltage or the current — it is a property of the material. Making a blue LED means changing the semiconductor itself, from a roughly 1.9 eV alloy to GaN at 2.7 eV. That is the step sessions 43–44 (Optoelectronic Devices) are about, and the reason it earned a Nobel Prize.</p></div>`,
    `<span class="eyebrow">SDI101m · Buổi 11 · CLO1</span>
<h2>Sóng điện từ</h2>
<p class="lead">Đây là buổi mà nửa điện từ trao tay cho nửa bán dẫn. Học xong nó bạn đổi được qua lại giữa bước sóng, tần số và năng lượng photon, và trả lời được ba câu hỏi linh kiện thật chỉ bằng một công thức: một LED phát màu gì, một đầu thu silic nhìn được ánh sáng nào, và vì sao quang khắc phải chuyển sang 13,5 nm.</p>
<p class="nhan">` + NGUON + ` · buổi 11 — "Electromagnetic Waves"</p>
<h3>Sóng là gì, nhìn từ mười buổi trước</h3>
<p>Điện trường biến thiên sinh ra từ trường, và từ trường biến thiên sinh ra điện trường. Một khi đã khởi động, cặp đó tự nuôi nhau và truyền đi mà không cần môi trường nào. Đó chính là ánh sáng — và là điều cuối cùng mà hệ phương trình Maxwell nói ra sau tất cả những gì đã học từ buổi 2 tới buổi 10.</p>
<div class="formula">c = λ · f = 2,998 × 10⁸ m/s&nbsp;&nbsp;·&nbsp;&nbsp;E/B = c&nbsp;&nbsp;·&nbsp;&nbsp;E và B vuông góc với nhau và vuông góc với phương truyền</div>
<div class="out">Ánh sáng lục 550 nm: f = c/λ = 2,998 × 10⁸ ÷ 550 × 10⁻⁹ = <b>5,45 × 10¹⁴ Hz = 545 THz</b><br>Wi-Fi 2,4 GHz: λ = c/f = 2,998 × 10⁸ ÷ 2,4 × 10⁹ = <b>0,125 m = 12,5 cm</b><br>Một sóng có E₀ = 100 V/m thì B₀ = 100/c = <b>0,334 µT</b></div>
<h3>Photon, và hằng số duy nhất cần học thuộc</h3>
<div class="formula">E = h · f = h · c / λ&nbsp;&nbsp;&nbsp;⟹&nbsp;&nbsp;&nbsp;E(eV) = 1240 / λ(nm)</div>
<p>Số 1240 đó là hc/q diễn đạt theo eV·nm, và với bộ hằng số của môn này nó ra đúng 1240. Học đúng một con số này là bạn làm được mọi câu hỏi quang–bán dẫn trong đầu. Bước sóng ngắn thì năng lượng cao; bước sóng dài thì năng lượng thấp.</p>
<h3>Ứng dụng 1 — khe cấm quyết định vật liệu nhìn thấy gì và phát ra gì</h3>
<p>Một chất bán dẫn chỉ hấp thụ được photon có năng lượng ít nhất bằng khe cấm E<sub>g</sub> của nó — photon yếu hơn thì đi xuyên qua. Và khi một electron rơi trở lại qua khe cấm, photon nó phát ra mang năng lượng cỡ E<sub>g</sub>. Nên <strong>khe cấm chốt cả biên hấp thụ lẫn màu phát ra</strong>:</p>
<table>
  <thead><tr><th>Vật liệu</th><th>E<sub>g</sub> (eV)</th><th>λ = 1240/E<sub>g</sub></th><th>Vùng phổ</th><th>Linh kiện</th></tr></thead>
  <tbody>
    <tr><td>Ge</td><td>0,66</td><td><strong>1879 nm</strong></td><td>hồng ngoại</td><td>đầu thu hồng ngoại</td></tr>
    <tr><td><strong>Si</strong></td><td><strong>1,12</strong></td><td><strong>1107 nm</strong></td><td>hồng ngoại gần</td><td>pin mặt trời, cảm biến ảnh</td></tr>
    <tr><td>GaAs</td><td>1,42</td><td><strong>873 nm</strong></td><td>hồng ngoại gần</td><td>laser diode, thông tin quang</td></tr>
    <tr><td>vật liệu LED đỏ</td><td>≈ 1,9</td><td><strong>653 nm</strong></td><td>ánh sáng đỏ</td><td>LED đỏ</td></tr>
    <tr><td>GaN</td><td>≈ 2,7</td><td><strong>459 nm</strong></td><td>ánh sáng lam</td><td>LED lam, chiếu sáng trắng</td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Hai sự thật mà từ giờ bạn suy ra được chứ không phải học thuộc.</strong> Thứ nhất: <strong>silic trong suốt với ánh sáng hồng ngoại dài hơn 1107 nm</strong> — một tín hiệu quang 1550 nm đi qua một con chip silic như đi qua thuỷ tinh, và đó là lý do đầu thu cho cáp quang làm bằng germani hay InGaAs chứ không phải silic. Thứ hai: <strong>một LED lam cần vật liệu khe cấm rộng</strong>, khoảng 2,7 eV. Silic không làm được, với bất cứ giá nào. Chỉ một sự thật đó thôi là toàn bộ lý do tồn tại của cả ngành gallium nitride, và là lý do LED lam phải chờ tới thập niên 1990.</div>
<h3>Ứng dụng 2 — quang khắc, nơi bước sóng đặt ra giới hạn</h3>
<p>Quang khắc in hình mẫu transistor bằng ánh sáng, và ta không in được chi tiết nhỏ hơn bước sóng dùng để in bao nhiêu. Nên thu nhỏ transistor nghĩa là phải thu nhỏ λ:</p>
<div class="out">DUV, λ = 193 nm: năng lượng photon = 1240 ÷ 193 = <b>6,42 eV</b><br>EUV, λ = 13,5 nm: năng lượng photon = 1240 ÷ 13,5 = <b>91,9 eV</b></div>
<p>Chín mươi hai electron-volt cho một photon. Đó là cao hơn rất nhiều so với năng lượng giữ bất cứ phân tử nào lại với nhau, và đó là lý do ánh sáng EUV bị không khí, bị thuỷ tinh và bị chất cản quang thường hấp thụ hết — một máy EUV buộc phải chạy trong chân không và dùng gương thay vì thấu kính. Toàn bộ bài toán kinh tế của một nhà máy chip hiện đại nằm trong bước nhảy từ 6,4 eV lên 91,9 eV, mà bạn vừa tính ra bằng 1240/λ.</p>
<div class="diagram"><pre>  buoc song   1 m      1 mm    1 um     1107nm   550nm   193nm  13.5nm
              |        |       |        |        |       |      |
              radio    vi ba   hong ngoai        kha kien DUV   EUV
                                        |
                             bien hap thu cua Si (Eg = 1,12 eV)
              <--- nang luong photon THAP ------- CAO --->
              Si TRONG SUOT o day  |  Si HAP THU o day</pre></div>
<div class="pitfall"><b>Trộn nm với m trong E = hc/λ.</b> Hoặc dùng SI suốt, hoặc dùng lối tắt E(eV) = 1240/λ(nm) — nhưng đừng nửa nọ nửa kia. <b>Nghĩ ánh sáng sáng hơn thì photon mạnh hơn.</b> Độ sáng là <em>số lượng</em> photon; năng lượng mỗi photon chỉ phụ thuộc bước sóng. Một photon lam mờ vẫn thắng một photon đỏ chói trong việc bứt một electron. <b>Trông đợi một photon dưới E<sub>g</sub> làm được gì đó nếu chiếu đủ mạnh.</b> Không: dưới khe cấm thì vật liệu trong suốt, ở mọi cường độ. <b>Cho rằng λ và f độc lập.</b> Chúng bị c = λf khoá lại; chốt một cái là cái kia theo luôn.</div>
<h3>Bài tập</h3>
<p><b>B1.</b> Ánh sáng lam 450 nm có sinh được một cặp electron–lỗ trống trong silic (E<sub>g</sub> = 1,12 eV) không? Còn hồng ngoại 1500 nm thì sao?</p>
<div class="dap-an"><div class="out">450 nm: E = 1240 ÷ 450 = <b>2,756 eV</b> — lớn hơn 1,12 eV → <b>có, bị hấp thụ</b><br>1500 nm: E = 1240 ÷ 1500 = <b>0,827 eV</b> — nhỏ hơn 1,12 eV → <b>không, silic trong suốt</b></div>
<p>Đây là toàn bộ vật lý của một cảm biến ảnh silic và một pin mặt trời silic, gói trong hai dòng. Nó cũng giải thích một điều bạn tự kiểm được: pin mặt trời silic làm mất năng lượng của photon lam (hấp thụ 2,756 eV để sinh ra một cặp 1,12 eV — phần 1,6 eV còn lại thành nhiệt) và hoàn toàn không dùng được hồng ngoại. Hai tổn thất đó cộng lại là lý do pin silic một chuyển tiếp có một trần hiệu suất lý thuyết không vượt qua được.</p></div>
<p><b>B2.</b> Một LED phát ở 653 nm. Khe cấm của vật liệu nó là bao nhiêu, và muốn LED thành màu lam thì khe cấm phải đổi theo chiều nào?</p>
<div class="dap-an"><div class="out">E<sub>g</sub> = 1240 ÷ 653 = <b>1,90 eV</b><br>Màu lam khoảng 459 nm → E<sub>g</sub> = 1240 ÷ 459 = <b>2,70 eV</b><br>Khe cấm phải <b>rộng ra</b>, thêm chừng 0,8 eV</div>
<p>Không thể làm khe cấm rộng ra bằng cách đổi điện áp hay đổi dòng — nó là tính chất của vật liệu. Làm một LED lam nghĩa là đổi chính chất bán dẫn, từ một hợp chất khoảng 1,9 eV sang GaN 2,7 eV. Đó đúng là bước mà buổi 43–44 (Optoelectronic Devices) nói tới, và là lý do nó được trao giải Nobel.</p></div>`,
  ]]);

/* ── Quiz Chương 1 ───────────────────────────────────────────────────────── */
const c1q = quiz('sdi101m-1-quiz', 'Quiz 1 — Electromagnetism (sessions 1–11)|||Quiz 1 — Vật lý điện từ (buổi 1–11)', [
  { id: 'q1',
    question: 'Two charges 5 cm apart feel a force F. Move them to 10 cm. The new force is…|||Hai điện tích cách nhau 5 cm chịu lực F. Đưa ra 10 cm. Lực mới là…',
    options: ['F/2|||F/2', 'F/4|||F/4', '2F|||2F', 'F — unchanged|||F — không đổi'],
    correctIndex: 1, points: 1,
    explanation: 'Coulomb is inverse-square: doubling r divides F by 2² = 4. The r² comes from the area of a sphere, 4πr².|||Coulomb là nghịch đảo bình phương: gấp đôi r thì F chia 2² = 4. Số r² sinh ra từ diện tích hình cầu 4πr².' },
  { id: 'q2',
    question: 'A doping level is 10¹⁶ cm⁻³. In SI units that is…|||Một nồng độ pha tạp là 10¹⁶ cm⁻³. Theo đơn vị SI thì đó là…',
    options: ['10¹⁰ m⁻³|||10¹⁰ m⁻³', '10¹⁶ m⁻³|||10¹⁶ m⁻³', '10²² m⁻³|||10²² m⁻³', '10²⁸ m⁻³|||10²⁸ m⁻³'],
    correctIndex: 2, points: 1,
    explanation: '1 m³ = 10⁶ cm³, so 1 cm⁻³ = 10⁶ m⁻³ and 10¹⁶ cm⁻³ = 10²² m⁻³. Skipping this conversion is the single most common source of answers wrong by 10⁶.|||1 m³ = 10⁶ cm³, nên 1 cm⁻³ = 10⁶ m⁻³ và 10¹⁶ cm⁻³ = 10²² m⁻³. Nhảy qua phép đổi này là nguồn sai 10⁶ lần phổ biến nhất.' },
  { id: 'q3',
    question: 'What is the thermal voltage kT/q at 300 K?|||Điện áp nhiệt kT/q ở 300 K bằng bao nhiêu?',
    options: ['2.59 mV|||2,59 mV', '25.9 mV|||25,9 mV', '259 mV|||259 mV', '0.7 V|||0,7 V'],
    correctIndex: 1, points: 1,
    explanation: 'kBT = 1.380649e-23 × 300 = 4.142e-21 J; divided by q = 1.602e-19 C gives 0.02585 V = 25.9 mV. 0.7 V is the built-in potential of a silicon junction — about 27 thermal voltages.|||kBT = 1,380649e-23 × 300 = 4,142e-21 J; chia cho q = 1,602e-19 C được 0,02585 V = 25,9 mV. 0,7 V là điện thế nội của chuyển tiếp silic — khoảng 27 lần điện áp nhiệt.' },
  { id: 'q4',
    question: 'Gauss\' law says the flux out of a closed surface depends on…|||Định luật Gauss nói thông lượng ra khỏi một mặt kín phụ thuộc vào…',
    options: ['the shape of the surface|||hình dạng của mặt kín', 'only the charge enclosed inside it|||chỉ điện tích nằm bên trong nó', 'all charges, inside and outside|||mọi điện tích, cả trong và ngoài', 'the distance to the nearest charge|||khoảng cách tới điện tích gần nhất'],
    correctIndex: 1, points: 1,
    explanation: 'Φ = Q_enclosed / ε₀. Shape does not matter and outside charges contribute zero net flux — which is what lets you pick a convenient surface and turn an integral into a multiplication.|||Φ = Q_trong / ε₀. Hình dạng không quan trọng và điện tích bên ngoài đóng góp thông lượng toàn phần bằng không — chính điều đó cho phép chọn mặt tiện lợi và biến tích phân thành phép nhân.' },
  { id: 'q5',
    question: 'A gate oxide is 2 nm thick with εr = 3.9. Its capacitance per unit area Cox′ is about…|||Một lớp oxit cổng dày 2 nm với εr = 3,9. Điện dung trên đơn vị diện tích Cox′ khoảng…',
    options: ['1.73 nF/cm²|||1,73 nF/cm²', '1.73 µF/cm²|||1,73 µF/cm²', '1.73 mF/cm²|||1,73 mF/cm²', '1.73 pF/cm²|||1,73 pF/cm²'],
    correctIndex: 1, points: 1,
    explanation: 'Cox′ = εox/tox = 3.9 × 8.854e-12 ÷ 2e-9 = 0.01727 F/m² = 1.73 µF/cm² = 17.3 fF/µm². Forgetting εr = 3.9 makes it wrong by that factor.|||Cox′ = εox/tox = 3,9 × 8,854e-12 ÷ 2e-9 = 0,01727 F/m² = 1,73 µF/cm² = 17,3 fF/µm². Quên εr = 3,9 là sai đi đúng hệ số đó.' },
  { id: 'q6',
    question: 'In σ = q·n·μ, which factor does doping change?|||Trong σ = q·n·μ, pha tạp làm thay đổi yếu tố nào?',
    options: ['q, the charge per carrier|||q, điện tích mỗi hạt tải', 'n, the number of carriers|||n, số hạt tải', 'μ only, the mobility|||chỉ μ, độ linh động', 'none of them|||không yếu tố nào'],
    correctIndex: 1, points: 1,
    explanation: 'Doping sets n, over many orders of magnitude — that is the whole trick of semiconductors. q is a constant of nature; μ is set by the crystal and by scattering (heavy doping does reduce μ somewhat, but n is what moves by decades).|||Pha tạp đặt ra n, qua nhiều bậc độ lớn — đó là toàn bộ mẹo của bán dẫn. q là hằng số của tự nhiên; μ do tinh thể và tán xạ quyết định (pha tạp đậm có làm μ giảm chút ít, nhưng chính n mới thay đổi hàng chục lần bậc).' },
  { id: 'q7',
    question: 'A series RLC with R = 100 Ω, L = 10 mH, C = 100 nF resonates at about…|||Mạch RLC nối tiếp R = 100 Ω, L = 10 mH, C = 100 nF cộng hưởng ở khoảng…',
    options: ['503 Hz|||503 Hz', '5.03 kHz|||5,03 kHz', '50.3 kHz|||50,3 kHz', '503 kHz|||503 kHz'],
    correctIndex: 1, points: 1,
    explanation: 'f₀ = 1/(2π√(LC)) = 1/(2π√(1e-2 × 1e-7)) = 1/(2π × 3.1623e-5) = 5033 Hz. At resonance XL = XC = 316 Ω and Z drops to R = 100 Ω.|||f₀ = 1/(2π√(LC)) = 1/(2π√(1e-2 × 1e-7)) = 1/(2π × 3,1623e-5) = 5033 Hz. Tại cộng hưởng XL = XC = 316 Ω và Z tụt về R = 100 Ω.' },
  { id: 'q8',
    question: 'Silicon has Eg = 1.12 eV. Which light does it NOT absorb?|||Silic có Eg = 1,12 eV. Nó KHÔNG hấp thụ ánh sáng nào?',
    options: ['450 nm blue|||lam 450 nm', '653 nm red|||đỏ 653 nm', '1000 nm near-infrared|||hồng ngoại gần 1000 nm', '1550 nm infrared|||hồng ngoại 1550 nm'],
    correctIndex: 3, points: 1,
    explanation: 'E(eV) = 1240/λ(nm). 1550 nm gives 0.80 eV, below the 1.12 eV gap, so silicon is transparent to it — the reason fibre-optic detectors are not made of silicon. The other three are 2.76, 1.90 and 1.24 eV, all above the gap.|||E(eV) = 1240/λ(nm). 1550 nm cho 0,80 eV, dưới khe cấm 1,12 eV, nên silic trong suốt với nó — đó là lý do đầu thu cáp quang không làm bằng silic. Ba cái kia là 2,76, 1,90 và 1,24 eV, đều trên khe cấm.' },
  { id: 'q9',
    question: 'A Hall measurement gives a POSITIVE Hall voltage. The sample is…|||Một phép đo Hall cho điện áp Hall DƯƠNG. Mẫu là…',
    options: ['n-type, carriers are electrons|||loại n, hạt tải là electron', 'p-type, carriers are holes|||loại p, hạt tải là lỗ trống', 'intrinsic, n = p|||thuần, n = p', 'a metal|||một kim loại'],
    correctIndex: 1, points: 1,
    explanation: 'The sign of VH gives the sign of the carriers: positive → holes → p-type. This is the only routine measurement that distinguishes n from p; resistivity alone cannot, because it depends on the product n·μ.|||Dấu của VH cho dấu của hạt tải: dương → lỗ trống → loại p. Đây là phép đo thường quy duy nhất phân biệt được n với p; chỉ đo điện trở suất thì không, vì nó phụ thuộc tích n·μ.' },
  { id: 'q10',
    question: 'An LED on a 5 V supply has Vf = 2.0 V and should draw 10 mA. The series resistor is…|||Một LED trên nguồn 5 V có Vf = 2,0 V và cần dòng 10 mA. Điện trở nối tiếp là…',
    options: ['200 Ω|||200 Ω', '300 Ω|||300 Ω', '500 Ω|||500 Ω', 'none needed|||không cần điện trở'],
    correctIndex: 1, points: 1,
    explanation: 'KVL: the resistor takes 5 − 2.0 = 3.0 V, so R = 3.0 / 0.010 = 300 Ω. The resistor is not optional: a diode\'s current rises exponentially with voltage, so without it the current is limited only by the supply and the LED is destroyed.|||KVL: điện trở gánh 5 − 2,0 = 3,0 V, nên R = 3,0 / 0,010 = 300 Ω. Điện trở không phải tuỳ chọn: dòng của diode tăng theo hàm mũ theo điện áp, nên thiếu nó thì dòng chỉ bị nguồn giới hạn và LED cháy.' },
], 600);

/* ════════════════════════════════════════════════════════════════════════════
 * CHƯƠNG 2 → 11 — KHUNG. Đúng tên chương, đúng tên bài, đúng buổi/CLO của FLM,
 * mỗi bài 3–6 dòng mốc nội dung. Thay khung(...) bằng doc(...) khi viết nội
 * dung, GIỮ NGUYÊN slug và vị trí.
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── Chương 2 — Assignment 1 & Progress Test 1 (buổi 12–15) ──────────────── */
const k21 = khung('sdi101m-2-1-assignment-1',
  '2.1 — Assignment 1: sessions 12–14, worth 10%|||2.1 — Assignment 1: buổi 12–14, chiếm 10%',
  'KHUNG. Buổi 12–14, CLO1, 135 phút, 10% điểm môn, số câu "by instructor". Phạm vi: toàn bộ vật lý điện từ buổi 1–11.',
  { s: '12–14', clo: 'CLO1', flm: 'Assignment 1', sach: 'Halliday, Resnick &amp; Walker, Principles of Physics — the electromagnetism chapters behind sessions 1–11',
    hEn: 'Assignment 1 — the first 10% of your grade',
    hVi: 'Assignment 1 — 10% điểm môn đầu tiên',
    lEn: 'the syllabus gives Assignment 1 three sessions (12, 13 and 14), a duration of <strong>135 minutes</strong>, a weight of <strong>10%</strong>, a completion criteria of "&gt; 0", CLO1, and a question count of "by instructor" — so the form of the task is set in class, not in the syllabus. Its scope is the whole electromagnetism block, sessions 1–11.',
    lVi: 'syllabus dành cho Assignment 1 ba buổi (12, 13 và 14), thời lượng <strong>135 phút</strong>, trọng số <strong>10%</strong>, tiêu chí đạt "&gt; 0", CLO1, và số câu ghi "by instructor" — nên hình thức bài do lớp chốt, không do syllabus. Phạm vi của nó là cả khối điện từ, buổi 1–11.',
    dEn: 'apply Coulomb, Gauss, potential, capacitance, resistance and RLC to a problem set rather than to single formulas, and hand in on time — StudentTasks rule 2 makes on-time submission part of the requirement.',
    dVi: 'áp dụng Coulomb, Gauss, điện thế, điện dung, điện trở và RLC vào một bộ bài toán chứ không chỉ vào từng công thức rời, và nộp đúng hạn — quy định 2 trong StudentTasks đặt việc nộp đúng hạn thành một phần của yêu cầu.' });

const k22 = khung('sdi101m-2-2-progress-test-1',
  '2.2 — Progress Test 1: session 15, 45 min, 30 questions, 15%|||2.2 — Progress Test 1: buổi 15, 45 phút, 30 câu, 15%',
  'KHUNG. Buổi 15, 45 phút, 30 câu, 15% điểm môn. ⚠️ Bảng đánh giá gắn CLO1, kế hoạch buổi ghi "CLO1, CLO2" — ôn theo cách đọc rộng hơn.',
  { s: '15', clo: 'CLO1, CLO2', flm: 'Progress Test 1', sach: 'chapter 1 of this site (sessions 1–11) plus your own worked exercises',
    hEn: 'Progress Test 1 — 30 questions in 45 minutes',
    hVi: 'Progress Test 1 — 30 câu trong 45 phút',
    lEn: '45 minutes, <strong>30 questions</strong>, <strong>15%</strong> of the grade — 90 seconds per question. <strong>Note the CLO mismatch:</strong> the Assessments table tags this test <strong>CLO1</strong>, while the session plan tags session 15 <strong>"CLO1, CLO2"</strong>. Both readings are published; prepare for the wider one and confirm the scope with your lecturer.',
    lVi: '45 phút, <strong>30 câu</strong>, <strong>15%</strong> điểm môn — 90 giây một câu. <strong>Chú ý chỗ lệch CLO:</strong> bảng Assessments gắn bài này là <strong>CLO1</strong>, còn kế hoạch buổi gắn buổi 15 là <strong>"CLO1, CLO2"</strong>. Cả hai cách đọc đều được công bố; hãy ôn theo cách rộng hơn và xác nhận phạm vi với giảng viên.',
    dEn: 'answer a numerical electromagnetism question in about a minute, which means the unit conversions (cm ↔ m, nm, µF/cm²) have to be automatic rather than derived on the spot.',
    dVi: 'giải một câu điện từ có số trong khoảng một phút, nghĩa là các phép đổi đơn vị (cm ↔ m, nm, µF/cm²) phải thành phản xạ chứ không phải suy lại tại chỗ.' });

/* ── Chương 3 — LAB 1: mạch RLC (buổi 16–21) ─────────────────────────────── */
const k31 = khung('sdi101m-3-1-lab1-an-toan-va-dung-cu',
  '3.1 — LAB 1 (sessions 16–17): safety, instruments, R-L-C|||3.1 — LAB 1 (buổi 16–17): an toàn, dụng cụ, đo R-L-C',
  'KHUNG. Buổi 16–17, CLO1+CLO2. Mở LAB 1: an toàn điện (nửa chưa ai dạy của CLO2), đồng hồ đo, máy phát, máy hiện sóng, đo giá trị R-L-C thật.',
  { s: '16–17', clo: 'CLO1, CLO2', flm: 'LAB 1: RLC CIRCUITS — 1, 2', sach: 'lesson 1.8 and 1.10 of this site; the syllabus publishes NO tool or instrument list — ask your lecturer',
    hEn: 'LAB 1, part 1 — safety first, then the instruments',
    hVi: 'LAB 1, phần 1 — an toàn trước, rồi tới dụng cụ',
    lEn: 'the opening of the only block that teaches <strong>CLO2</strong>, whose second half is literally "having responsibility in how to deal with the electric circuit safety". Expect: what to touch and what not to, why 220 V<sub>rms</sub> is a 311 V peak, discharging a capacitor before handling it, then the instruments — multimeter, function generator, oscilloscope — and measuring the real R, L and C values against their markings.',
    lVi: 'buổi mở đầu của khối duy nhất dạy <strong>CLO2</strong>, mà nửa sau của CLO2 nguyên văn là "có trách nhiệm về cách xử lý an toàn khi làm việc với mạch điện". Dự kiến: được chạm gì và không được chạm gì, vì sao 220 V hiệu dụng là 311 V đỉnh, xả tụ trước khi cầm, rồi tới dụng cụ — đồng hồ đo, máy phát hàm, máy hiện sóng — và đo giá trị R, L, C thật so với trị số ghi trên thân.',
    dEn: 'set up a bench safely, read an oscilloscope trace, and state the difference between what the multimeter shows (RMS) and what the scope shows (peak).',
    dVi: 'dựng được một bàn thí nghiệm an toàn, đọc được một vết trên máy hiện sóng, và nói được khác biệt giữa thứ đồng hồ hiện (hiệu dụng) và thứ máy hiện sóng hiện (đỉnh).' });

const k32 = khung('sdi101m-3-2-lab1-rc-rl',
  '3.2 — LAB 1 (sessions 18–19): RC and RL, time constants|||3.2 — LAB 1 (buổi 18–19): mạch RC và RL, hằng số thời gian',
  'KHUNG. Buổi 18–19, CLO1+CLO2. Đo nạp/xả RC, hằng số thời gian τ = RC, đáp ứng RL, và đối chiếu số đo với số tính.',
  { s: '18–19', clo: 'CLO1, CLO2', flm: 'LAB 1: RLC CIRCUITS — 3, 4', sach: 'lesson 1.8 (τ = RC, 63.2% and 99.3%) and 1.10 (X_L, X_C)',
    hEn: 'LAB 1, part 2 — RC and RL: measuring a time constant',
    hVi: 'LAB 1, phần 2 — RC và RL: đo một hằng số thời gian',
    lEn: 'charge and discharge curves on the scope, extracting τ from the 63.2% point, comparing the measured τ with the calculated R·C, and the same exercise for an RL circuit. This is where component tolerance stops being an abstraction: a 10% resistor and a 20% capacitor give a τ that is visibly not the nominal one.',
    lVi: 'đường nạp và xả trên máy hiện sóng, rút τ ra từ điểm 63,2%, so τ đo được với R·C tính được, rồi làm lại đúng bài đó cho mạch RL. Đây là chỗ sai số linh kiện thôi trừu tượng: một điện trở 10% và một tụ 20% cho ra một τ lệch thấy rõ so với trị số danh định.',
    dEn: 'measure a time constant from a trace, quote it with an uncertainty, and explain a disagreement with the calculated value in terms of tolerance rather than blaming the instrument.',
    dVi: 'đo được hằng số thời gian từ một vết sóng, ghi kèm sai số, và giải thích được chỗ lệch với giá trị tính bằng sai số linh kiện chứ không quy cho thiết bị.' });

const k33 = khung('sdi101m-3-3-lab1-rlc-cong-huong',
  '3.3 — LAB 1 (sessions 20–21): RLC resonance and the report|||3.3 — LAB 1 (buổi 20–21): cộng hưởng RLC và báo cáo',
  'KHUNG. Buổi 20–21, CLO1+CLO2. Quét tần số, tìm f₀ = 1/(2π√(LC)), đo Z(f) và góc pha, hệ số Q, viết báo cáo — kết thúc 270 phút của Lab 1 (5%).',
  { s: '20–21', clo: 'CLO1, CLO2', flm: 'LAB 1: RLC CIRCUITS — 5, 6', sach: 'lesson 1.10 — the worked R = 100 Ω, L = 10 mH, C = 100 nF circuit resonates at 5.03 kHz',
    hEn: 'LAB 1, part 3 — resonance, and writing it up',
    hVi: 'LAB 1, phần 3 — cộng hưởng, và viết báo cáo',
    lEn: 'sweeping the generator, finding the current maximum, checking it against f₀ = 1/(2π√(LC)), plotting Z against f, measuring the phase shift changing sign as you pass through resonance, and estimating Q. Then the report — which, together with sessions 16–19, completes the <strong>270 minutes</strong> that the Assessments table gives Lab 1 for its <strong>5%</strong>.',
    lVi: 'quét tần số máy phát, tìm điểm dòng cực đại, đối chiếu với f₀ = 1/(2π√(LC)), vẽ Z theo f, đo góc lệch pha đổi dấu khi đi qua cộng hưởng, và ước lượng Q. Rồi viết báo cáo — cộng với buổi 16–19 là trọn <strong>270 phút</strong> mà bảng Assessments dành cho Lab 1 để lấy <strong>5%</strong>.',
    dEn: 'measure a resonance curve, locate f₀ to within the tolerance of your components, and present measured against calculated values in a table that an examiner can check.',
    dVi: 'đo được một đường cộng hưởng, xác định f₀ trong phạm vi sai số linh kiện, và trình bày số đo so với số tính trong một bảng mà người chấm kiểm lại được.' });

/* ── Chương 4 — Nhập môn bán dẫn & tinh thể (buổi 22–26) ─────────────────── */
const k41 = khung('sdi101m-4-1-tong-quan-nganh',
  '4.1 — Overview, semiconductor history & industry|||4.1 — Tổng quan, lịch sử & ngành công nghiệp bán dẫn',
  'KHUNG. Buổi 22, CLO3. Buổi mở nửa sau của môn: bán dẫn là gì, mốc lịch sử (transistor 1947, IC 1958, MOSFET, CMOS), chuỗi giá trị ngành và chỗ đứng của Việt Nam.',
  { s: '22', clo: 'CLO3', flm: 'Overview, Semiconductor History &amp; Industry', sach: 'Streetman &amp; Banerjee ch.1; KAIST Semiconductor Physics and Devices 1, opening week',
    hEn: 'Overview, history and the industry',
    hVi: 'Tổng quan, lịch sử và ngành công nghiệp',
    lEn: 'the hinge of the course: sessions 1–21 were electromagnetism, and from here to session 60 everything is semiconductors. Expect the conductor / semiconductor / insulator picture, the milestones (point-contact transistor 1947, integrated circuit 1958, MOSFET, CMOS, Moore\'s law), and the shape of the industry — design, fab, OSAT, equipment, EDA.',
    lVi: 'bản lề của cả môn: buổi 1–21 là vật lý điện từ, và từ đây tới buổi 60 mọi thứ là bán dẫn. Dự kiến: bức tranh dẫn điện / bán dẫn / cách điện, các mốc lịch sử (transistor tiếp điểm 1947, mạch tích hợp 1958, MOSFET, CMOS, định luật Moore), và hình dáng của ngành — thiết kế, nhà máy chế tạo, đóng gói kiểm thử, thiết bị, EDA.',
    dEn: 'say where a chip comes from, name the steps between a design and a packaged part, and place this course in the semiconductor IC design major.',
    dVi: 'nói được một con chip đến từ đâu, kể được các bước giữa một bản thiết kế và một linh kiện đã đóng gói, và định vị được môn này trong ngành Thiết kế vi mạch bán dẫn.' });

const k42 = khung('sdi101m-1-1-vat-lieu',
  '4.2 — Crystal properties: lattice, unit cell, Miller indices|||4.2 — Tính chất tinh thể: mạng, ô cơ sở, chỉ số Miller',
  'KHUNG. Buổi 23, CLO3. Mạng tinh thể, ô cơ sở, cấu trúc kim cương của Si (hằng số mạng 0,543 nm), chỉ số Miller, mật độ nguyên tử ~5×10²² cm⁻³, wafer và mặt (100)/(111).',
  { s: '23', clo: 'CLO3', flm: 'Crystal Properties', sach: 'Streetman &amp; Banerjee ch.1 (crystal lattices, planes and directions)',
    hEn: 'Crystal properties',
    hVi: 'Tính chất tinh thể',
    lEn: 'why an ordered crystal, and not a lump of silicon, is what has a band gap at all. Expect: lattice and unit cell, the <strong>diamond structure of silicon with lattice constant 0.543 nm</strong>, atom density of about 5 × 10²² cm⁻³, Miller indices for planes and directions, and why wafers are cut on the (100) or (111) plane.',
    lVi: 'vì sao một tinh thể có trật tự, chứ không phải một cục silic, mới là thứ có khe cấm. Dự kiến: mạng và ô cơ sở, <strong>cấu trúc kim cương của silic với hằng số mạng 0,543 nm</strong>, mật độ nguyên tử khoảng 5 × 10²² cm⁻³, chỉ số Miller cho mặt và phương, và vì sao wafer được cắt theo mặt (100) hoặc (111).',
    dEn: 'read a Miller index, compute an atomic density from a lattice constant, and explain why a 2 nm oxide is under four lattice constants thick (lesson 1.1, exercise E2).',
    dVi: 'đọc được một chỉ số Miller, tính được mật độ nguyên tử từ hằng số mạng, và giải thích được vì sao một lớp oxit 2 nm dày chưa tới bốn hằng số mạng (bài 1.1, bài tập B2).' });

const k43 = khung('sdi101m-4-3-nguyen-tu-schrodinger',
  '4.3 — Atoms, electrons and the Schrödinger equation|||4.3 — Nguyên tử, electron và phương trình Schrödinger',
  'KHUNG. Buổi 24, CLO3. Nguyên tử Bohr và giới hạn của nó, lưỡng tính sóng–hạt, phương trình Schrödinger, hộp thế, số lượng tử và nguyên lý loại trừ Pauli.',
  { s: '24', clo: 'CLO3', flm: 'Atoms, Electrons and Schrodinger Equation', sach: 'Streetman &amp; Banerjee ch.2 (atoms and electrons); KAIST course 1',
    hEn: 'Atoms, electrons and the Schrödinger equation',
    hVi: 'Nguyên tử, electron và phương trình Schrödinger',
    lEn: 'the one genuinely quantum session of the course, and it is here for a single reason: energy bands (session 25) cannot be motivated classically. Expect: why the Bohr atom fails, wave–particle duality, the Schrödinger equation and what "solving" it means, the particle in a box giving <em>discrete</em> allowed energies, quantum numbers and the Pauli exclusion principle.',
    lVi: 'buổi lượng tử thật sự duy nhất của môn, và nó có mặt vì đúng một lý do: dải năng lượng (buổi 25) không thể giải thích được bằng vật lý cổ điển. Dự kiến: vì sao mẫu nguyên tử Bohr thất bại, lưỡng tính sóng–hạt, phương trình Schrödinger và "giải" nó nghĩa là gì, bài toán hạt trong hộp cho ra các mức năng lượng <em>rời rạc</em>, số lượng tử và nguyên lý loại trừ Pauli.',
    dEn: 'explain why allowed electron energies are discrete in an atom and become bands in a crystal — the sentence session 25 starts from.',
    dVi: 'giải thích được vì sao các mức năng lượng của electron là rời rạc trong một nguyên tử và trở thành dải trong một tinh thể — chính là câu mà buổi 25 bắt đầu từ đó.' });

const k44 = khung('sdi101m-4-4-dai-nang-luong',
  '4.4 — Energy bands: valence, conduction and the gap|||4.4 — Dải năng lượng: dải hoá trị, dải dẫn và khe cấm',
  'KHUNG. Buổi 25, CLO3. Từ mức rời rạc thành dải, dải hoá trị/dải dẫn, khe cấm Eg (Si 1,12 eV · Ge 0,66 eV · GaAs 1,42 eV), khe cấm trực tiếp/gián tiếp, kim loại vs bán dẫn vs cách điện.',
  { s: '25', clo: 'CLO3', flm: 'Energy Bands', sach: 'Streetman &amp; Banerjee ch.3 (energy bands)',
    hEn: 'Energy bands and the band gap',
    hVi: 'Dải năng lượng và khe cấm',
    lEn: 'bring N atoms together and each discrete level splits into a band. Expect: valence band, conduction band, the forbidden gap E<sub>g</sub>, the numbers (<strong>Si 1.12 eV, Ge 0.66 eV, GaAs 1.42 eV</strong>), the difference between a <strong>direct</strong> gap (GaAs — can emit light) and an <strong>indirect</strong> one (Si — cannot, efficiently), and the band picture of metal vs semiconductor vs insulator. Lesson 1.11 already used these numbers to predict LED colours.',
    lVi: 'ghép N nguyên tử lại thì mỗi mức rời rạc tách thành một dải. Dự kiến: dải hoá trị, dải dẫn, khe cấm E<sub>g</sub>, các con số (<strong>Si 1,12 eV, Ge 0,66 eV, GaAs 1,42 eV</strong>), khác biệt giữa khe cấm <strong>trực tiếp</strong> (GaAs — phát sáng được) và khe cấm <strong>gián tiếp</strong> (Si — không phát hiệu quả được), và hình dải của kim loại so với bán dẫn so với chất cách điện. Bài 1.11 đã dùng chính các con số này để đoán màu LED.',
    dEn: 'draw the band diagram of the three material classes, and say from E<sub>g</sub> alone what light a material absorbs and emits.',
    dVi: 'vẽ được sơ đồ dải của ba loại vật liệu, và chỉ từ E<sub>g</sub> nói được vật liệu hấp thụ và phát ra ánh sáng nào.' });

const k45 = khung('sdi101m-4-5-thuan-va-pha-tap',
  '4.5 — Intrinsic vs extrinsic: doping, donors and acceptors|||4.5 — Bán dẫn thuần và pha tạp: donor và acceptor',
  'KHUNG. Buổi 26, CLO3. Bán dẫn thuần (n = p = nᵢ ≈ 1,5×10¹⁰ cm⁻³ ở 300 K), pha tạp nhóm V/III, loại n và loại p, hạt tải đa số/thiểu số, n·p = nᵢ².',
  { s: '26', clo: 'CLO3', flm: 'Intrinsic vs Extrinsic Semiconductor', sach: 'Streetman &amp; Banerjee ch.3 (intrinsic and extrinsic material)',
    hEn: 'Intrinsic vs extrinsic semiconductor',
    hVi: 'Bán dẫn thuần và bán dẫn pha tạp',
    lEn: 'the session where silicon becomes engineerable. Expect: intrinsic silicon with n = p = n<sub>i</sub> ≈ 1.5 × 10¹⁰ cm⁻³ at 300 K, group-V <strong>donors</strong> (P, As) making n-type, group-III <strong>acceptors</strong> (B) making p-type, majority and minority carriers, and the mass-action law <strong>n·p = n<sub>i</sub>²</strong>. Recall from lesson 1.2 why a dopant holds its extra carrier so loosely: inside silicon the Coulomb attraction is 11.7 times weaker.',
    lVi: 'buổi mà silic trở thành thứ kỹ sư điều khiển được. Dự kiến: silic thuần với n = p = n<sub>i</sub> ≈ 1,5 × 10¹⁰ cm⁻³ ở 300 K, tạp <strong>donor</strong> nhóm V (P, As) cho loại n, tạp <strong>acceptor</strong> nhóm III (B) cho loại p, hạt tải đa số và thiểu số, và định luật tác dụng khối <strong>n·p = n<sub>i</sub>²</strong>. Nhớ lại từ bài 1.2 vì sao một nguyên tử tạp giữ hạt tải thừa của nó lỏng như vậy: trong silic lực hút Coulomb yếu đi 11,7 lần.',
    dEn: 'compute the minority-carrier concentration from a doping level, and turn a doping level into a resistivity with σ = q·n·μ from lesson 1.7.',
    dVi: 'tính được nồng độ hạt tải thiểu số từ một mức pha tạp, và biến một mức pha tạp thành điện trở suất bằng σ = q·n·μ của bài 1.7.' });

/* ── Chương 5 — Hạt tải điện (buổi 27–30) ───────────────────────────────── */
const k51 = khung('sdi101m-2-1-hat-dan',
  '5.1 — Carrier concentration: Fermi level and temperature|||5.1 — Nồng độ hạt tải: mức Fermi và nhiệt độ',
  'KHUNG. Buổi 27, CLO3. Phân bố Fermi–Dirac, mức Fermi E_F, mật độ trạng thái, n và p theo E_F, mức Fermi dịch theo pha tạp, và sự phụ thuộc nhiệt độ.',
  { s: '27', clo: 'CLO3', flm: 'Carrier Concentration', sach: 'Streetman &amp; Banerjee ch.3 (carrier concentrations, Fermi level)',
    hEn: 'Carrier concentration',
    hVi: 'Nồng độ hạt tải điện',
    lEn: 'how many carriers there actually are, at a given temperature and doping. Expect: the Fermi–Dirac distribution, the <strong>Fermi level E<sub>F</sub></strong> and what it means physically, density of states, the expressions for n and p in terms of E<sub>F</sub>, how E<sub>F</sub> moves up in n-type and down in p-type material, and the temperature dependence — where the 25.9 mV of lesson 1.5 reappears as k<sub>B</sub>T.',
    lVi: 'thật ra có bao nhiêu hạt tải, ở một nhiệt độ và một mức pha tạp cho trước. Dự kiến: phân bố Fermi–Dirac, <strong>mức Fermi E<sub>F</sub></strong> và ý nghĩa vật lý của nó, mật độ trạng thái, biểu thức của n và p theo E<sub>F</sub>, cách E<sub>F</sub> dịch lên trong vật liệu loại n và dịch xuống trong loại p, và sự phụ thuộc nhiệt độ — chỗ mà 25,9 mV của bài 1.5 quay lại dưới dạng k<sub>B</sub>T.',
    dEn: 'locate the Fermi level on a band diagram from the doping type, and explain why carrier concentration — and therefore every device — drifts with temperature.',
    dVi: 'định được vị trí mức Fermi trên sơ đồ dải từ loại pha tạp, và giải thích được vì sao nồng độ hạt tải — và do đó mọi linh kiện — trôi theo nhiệt độ.' });

const k52 = khung('sdi101m-3-1-dong-dien',
  '5.2 — Drift of carriers in electric and magnetic fields|||5.2 — Sự trôi của hạt tải trong điện trường và từ trường',
  'KHUNG. Buổi 28, CLO3. Vận tốc trôi v = μE, độ linh động (Si: μn ≈ 1350, μp ≈ 480 cm²/V·s), tán xạ, bão hoà vận tốc, σ = q(nμn + pμp), và hiệu ứng Hall để đo n và loại hạt tải.',
  { s: '28', clo: 'CLO3', flm: 'Drift of Carriers in Electric and Magnetic Fields', sach: 'Streetman &amp; Banerjee ch.3 (drift of carriers in fields)',
    hEn: 'Drift of carriers in electric and magnetic fields',
    hVi: 'Sự trôi của hạt tải trong điện trường và từ trường',
    lEn: 'the session lessons 1.3, 1.7 and 1.9 were built for. Expect: drift velocity v<sub>d</sub> = μ·E, <strong>mobility</strong> (Si: μ<sub>n</sub> ≈ 1350, μ<sub>p</sub> ≈ 480 cm²/V·s) and why it is not infinite — lattice and impurity scattering, velocity saturation at high field, σ = q(n·μ<sub>n</sub> + p·μ<sub>p</sub>), and the <strong>Hall effect</strong> as the measurement that separates n from μ and tells you the carrier sign.',
    lVi: 'buổi mà các bài 1.3, 1.7 và 1.9 được viết ra để chuẩn bị cho. Dự kiến: vận tốc trôi v<sub>d</sub> = μ·E, <strong>độ linh động</strong> (Si: μ<sub>n</sub> ≈ 1350, μ<sub>p</sub> ≈ 480 cm²/V·s) và vì sao nó không phải vô hạn — tán xạ bởi mạng và bởi tạp chất, bão hoà vận tốc ở trường mạnh, σ = q(n·μ<sub>n</sub> + p·μ<sub>p</sub>), và <strong>hiệu ứng Hall</strong> như phép đo tách được n khỏi μ và cho biết dấu hạt tải.',
    dEn: 'compute a drift current density from doping and field, and explain from mobility alone why NMOS is faster than PMOS.',
    dVi: 'tính được mật độ dòng trôi từ pha tạp và điện trường, và chỉ từ độ linh động giải thích được vì sao NMOS nhanh hơn PMOS.' });

const k53 = khung('sdi101m-5-3-hap-thu-quang-phat-quang',
  '5.3 — Optical absorption and luminescence|||5.3 — Hấp thụ quang và phát quang',
  'KHUNG. Buổi 29, CLO3. Hấp thụ photon E ≥ Eg sinh cặp electron–lỗ trống, hệ số hấp thụ, phát quang và tái hợp, khe cấm trực tiếp vs gián tiếp, thời gian sống hạt tải.',
  { s: '29', clo: 'CLO3', flm: 'Optical Absorption and Luminescence', sach: 'Streetman &amp; Banerjee ch.4 (optical absorption, luminescence)',
    hEn: 'Optical absorption and luminescence',
    hVi: 'Hấp thụ quang và phát quang',
    lEn: 'light in, carriers out — and the reverse. Expect: the absorption edge at E<sub>g</sub> and the 1240/λ rule you already used in lesson 1.11, the absorption coefficient and penetration depth, radiative and non-radiative recombination, why a <strong>direct</strong>-gap material emits light efficiently and an indirect one does not, and carrier lifetime.',
    lVi: 'ánh sáng vào, hạt tải ra — và chiều ngược lại. Dự kiến: biên hấp thụ ở E<sub>g</sub> và quy tắc 1240/λ bạn đã dùng ở bài 1.11, hệ số hấp thụ và độ sâu xuyên, tái hợp phát xạ và không phát xạ, vì sao vật liệu khe cấm <strong>trực tiếp</strong> phát sáng hiệu quả mà khe cấm gián tiếp thì không, và thời gian sống của hạt tải.',
    dEn: 'predict whether a given wavelength generates carriers in a given material, and say why silicon makes an excellent detector and a hopeless emitter.',
    dVi: 'đoán được một bước sóng cho trước có sinh hạt tải trong một vật liệu cho trước hay không, và nói được vì sao silic là một đầu thu xuất sắc nhưng một nguồn phát vô vọng.' });

const k54 = khung('sdi101m-5-4-khuech-tan',
  '5.4 — Diffusion of carriers, and the Einstein relation|||5.4 — Khuếch tán của hạt tải và hệ thức Einstein',
  'KHUNG. Buổi 30, CLO3. Dòng khuếch tán theo gradient nồng độ, hệ số khuếch tán D, hệ thức Einstein D/μ = kT/q, dòng tổng trôi + khuếch tán, phương trình liên tục, độ dài khuếch tán.',
  { s: '30', clo: 'CLO3', flm: 'Diffusion of Carriers', sach: 'Streetman &amp; Banerjee ch.4 (diffusion of carriers)',
    hEn: 'Diffusion of carriers',
    hVi: 'Khuếch tán của hạt tải',
    lEn: 'the second, and less obvious, way current flows: down a concentration gradient, with no field at all. Expect: J = q·D·dn/dx, the diffusion coefficient D, the <strong>Einstein relation D/μ = k<sub>B</sub>T/q = 25.9 mV</strong> — the same thermal voltage again, now linking the two transport mechanisms — the total current as drift plus diffusion, the continuity equation and the diffusion length.',
    lVi: 'cách thứ hai, và kém hiển nhiên hơn, để có dòng điện: chảy xuôi theo gradient nồng độ, không cần điện trường nào. Dự kiến: J = q·D·dn/dx, hệ số khuếch tán D, <strong>hệ thức Einstein D/μ = k<sub>B</sub>T/q = 25,9 mV</strong> — lại đúng điện áp nhiệt đó, giờ nối hai cơ chế dẫn với nhau — dòng tổng bằng trôi cộng khuếch tán, phương trình liên tục và độ dài khuếch tán.',
    dEn: 'compute a diffusion current from a concentration profile, and recognise diffusion as the mechanism of the forward diode current in session 33.',
    dVi: 'tính được dòng khuếch tán từ một phân bố nồng độ, và nhận ra khuếch tán chính là cơ chế của dòng thuận qua diode ở buổi 33.' });

/* ── Chương 6 — Chuyển tiếp p-n (buổi 31–36) ────────────────────────────── */
const k61 = khung('sdi101m-4-1-pn-junction',
  '6.1 — The p-n junction: depletion region and built-in potential|||6.1 — Chuyển tiếp p-n: vùng nghèo và điện thế nội',
  'KHUNG. Buổi 31, CLO3. Ghép p với n, khuếch tán và tái hợp, vùng nghèo, điện trường nội, điện thế nội V_bi ≈ 0,7 V, cân bằng giữa dòng trôi và dòng khuếch tán, mức Fermi thẳng khi cân bằng.',
  { s: '31', clo: 'CLO3', flm: 'p-n Junction', sach: 'Streetman &amp; Banerjee ch.5 (junctions); KAIST Semiconductor Physics and Devices 2',
    hEn: 'The p-n junction',
    hVi: 'Chuyển tiếp p-n',
    lEn: 'the single most important structure in the course — a diode is one junction, a BJT is two, and a MOSFET controls junctions with a field. Expect: what happens when p meets n, diffusion then recombination, the <strong>depletion region</strong> of fixed ionised dopants, the built-in field, the <strong>built-in potential V<sub>bi</sub> ≈ 0.7 V for silicon</strong>, and equilibrium as the exact cancellation of drift against diffusion. You already derived that 0.7 V from Gauss\' law in lesson 1.4, worked example 2.',
    lVi: 'cấu trúc quan trọng nhất của cả môn — một diode là một chuyển tiếp, một BJT là hai, và một MOSFET dùng điện trường để điều khiển chuyển tiếp. Dự kiến: chuyện gì xảy ra khi p gặp n, khuếch tán rồi tái hợp, <strong>vùng nghèo</strong> gồm các ion tạp cố định, điện trường nội, <strong>điện thế nội V<sub>bi</sub> ≈ 0,7 V với silic</strong>, và cân bằng chính là chỗ dòng trôi triệt tiêu đúng bằng dòng khuếch tán. Bạn đã tự suy ra con số 0,7 V đó từ định luật Gauss ở bài 1.4, ví dụ 2.',
    dEn: 'draw the junction at equilibrium — charge, field, potential and band diagram — and compute V<sub>bi</sub> from the doping on both sides.',
    dVi: 'vẽ được chuyển tiếp ở trạng thái cân bằng — điện tích, điện trường, điện thế và sơ đồ dải — và tính được V<sub>bi</sub> từ mức pha tạp hai bên.' });

const k62 = khung('sdi101m-6-2-tinh-dien-chuyen-tiep',
  '6.2 — p-n junction electrostatics: field and width|||6.2 — Tĩnh điện chuyển tiếp p-n: điện trường và bề rộng',
  'KHUNG. Buổi 32, CLO3. Xấp xỉ vùng nghèo, giải phương trình Poisson, E_max = qN_D W/ε_Si, bề rộng W theo pha tạp và theo phân cực, chuyển tiếp một phía, dạng hộp–tam giác–parabol.',
  { s: '32', clo: 'CLO3', flm: 'p-n Junction Electrostatics', sach: 'Streetman &amp; Banerjee ch.5 (space charge at a junction)',
    hEn: 'p-n junction electrostatics',
    hVi: 'Tĩnh điện của chuyển tiếp p-n',
    lEn: 'the quantitative session, and the one that pays off lesson 1.4 in full. Expect: the depletion approximation, solving Poisson\'s equation across the junction, <strong>E<sub>max</sub> = q·N·W/ε<sub>Si</sub></strong>, the depletion width W as a function of doping and of applied bias, the one-sided (p⁺n or n⁺p) junction, and the box–triangle–parabola trio of charge, field and potential.',
    lVi: 'buổi định lượng, và là buổi trả hết phần nợ mà bài 1.4 đã ứng trước. Dự kiến: xấp xỉ vùng nghèo, giải phương trình Poisson qua chuyển tiếp, <strong>E<sub>max</sub> = q·N·W/ε<sub>Si</sub></strong>, bề rộng vùng nghèo W như một hàm của pha tạp và của phân cực ngoài, chuyển tiếp một phía (p⁺n hoặc n⁺p), và bộ ba hộp–tam giác–parabol của điện tích, điện trường và điện thế.',
    dEn: 'compute W and E<sub>max</sub> for a given doping and bias, and predict which side of an asymmetric junction the depletion region grows into.',
    dVi: 'tính được W và E<sub>max</sub> với một mức pha tạp và một phân cực cho trước, và đoán được vùng nghèo lan vào phía nào của một chuyển tiếp bất đối xứng.' });

const k63 = khung('sdi101m-6-3-dong-qua-chuyen-tiep',
  '6.3 — Current flow: forward and reverse bias (1)|||6.3 — Dòng qua chuyển tiếp: phân cực thuận và nghịch (1)',
  'KHUNG. Buổi 33, CLO3. Phân cực thuận hạ rào thế, phân cực nghịch nâng rào thế, phương trình Shockley I = I_S(e^(V/nV_T) − 1), vai trò của V_T = 25,9 mV, đặc tuyến I–V.',
  { s: '33', clo: 'CLO3', flm: 'Current Flow at p-n Junction — Forward and Reverse-Biased Junctions', sach: 'Streetman &amp; Banerjee ch.5 (forward- and reverse-biased junctions)',
    hEn: 'Current flow at the junction, part 1',
    hVi: 'Dòng qua chuyển tiếp, phần 1',
    lEn: 'where the diode finally appears. Expect: forward bias lowering the barrier, reverse bias raising it, the injection of minority carriers, and the <strong>Shockley equation I = I<sub>S</sub>(e^(V/nV<sub>T</sub>) − 1)</strong> with the same V<sub>T</sub> = 25.9 mV computed in lesson 1.5 — which is why forward current rises by roughly a decade per 60 mV, and why the "0.7 V turn-on" is a convenient description rather than a threshold.',
    lVi: 'chỗ mà diode cuối cùng xuất hiện. Dự kiến: phân cực thuận hạ rào thế, phân cực nghịch nâng rào thế, sự phun hạt tải thiểu số, và <strong>phương trình Shockley I = I<sub>S</sub>(e^(V/nV<sub>T</sub>) − 1)</strong> với đúng V<sub>T</sub> = 25,9 mV đã tính ở bài 1.5 — đó là lý do dòng thuận tăng chừng mười lần mỗi 60 mV, và là lý do "mở ở 0,7 V" chỉ là một cách nói tiện chứ không phải một ngưỡng thật.',
    dEn: 'sketch the I–V curve on both linear and log axes, and explain why an LED needs the series resistor you sized in lesson 1.8.',
    dVi: 'vẽ được đặc tuyến I–V trên cả trục thẳng và trục log, và giải thích được vì sao LED cần đúng cái điện trở nối tiếp bạn đã tính ở bài 1.8.' });

const k64 = khung('sdi101m-6-4-dong-qua-chuyen-tiep-tiep',
  '6.4 — Current flow: forward and reverse bias (2)|||6.4 — Dòng qua chuyển tiếp: phân cực thuận và nghịch (2)',
  'KHUNG. Buổi 34, CLO3 (buổi tiếp của 33). Dòng bão hoà I_S theo nhiệt độ, hệ số phát xạ n, dòng tái hợp, sụt áp trên điện trở nối tiếp, đánh thủng: Zener và thác lũ.',
  { s: '34', clo: 'CLO3', flm: 'Current Flow at p-n Junction — Forward and Reverse-Biased Junctions (continue)', sach: 'Streetman &amp; Banerjee ch.5 (reverse-bias breakdown)',
    hEn: 'Current flow at the junction, part 2',
    hVi: 'Dòng qua chuyển tiếp, phần 2',
    lEn: 'the continuation session: the parts of the real diode that the ideal equation leaves out. Expect: the temperature dependence of I<sub>S</sub> (and therefore of a diode as a thermometer), the ideality factor n, recombination current, series-resistance droop at high current, and reverse <strong>breakdown</strong> — Zener tunnelling in heavily doped junctions versus avalanche multiplication in lightly doped ones. Lesson 1.4 exercise E1 already showed why heavy doping raises the field and brings breakdown closer.',
    lVi: 'buổi tiếp: những phần của một diode thật mà phương trình lý tưởng bỏ qua. Dự kiến: sự phụ thuộc nhiệt độ của I<sub>S</sub> (và do đó việc dùng diode làm cảm biến nhiệt), hệ số phát xạ n, dòng tái hợp, sụt áp do điện trở nối tiếp khi dòng lớn, và <strong>đánh thủng</strong> khi phân cực nghịch — xuyên hầm Zener ở chuyển tiếp pha tạp đậm so với nhân thác lũ ở chuyển tiếp pha tạp nhạt. Bài tập B1 của bài 1.4 đã cho thấy vì sao pha tạp đậm làm điện trường mạnh lên và đưa đánh thủng tới gần hơn.',
    dEn: 'tell a Zener breakdown from an avalanche one by its doping and its temperature coefficient, and read a real diode datasheet curve.',
    dVi: 'phân biệt được đánh thủng Zener với thác lũ qua mức pha tạp và hệ số nhiệt của nó, và đọc được đường đặc tuyến trong datasheet của một diode thật.' });

const k65 = khung('sdi101m-5-1-diode-ung-dung',
  '6.5 — Junction capacitance, applications, fabrication|||6.5 — Điện dung chuyển tiếp, ứng dụng, chế tạo',
  'KHUNG. Buổi 35, CLO3. Điện dung vùng nghèo C_j ∝ 1/√(V_bi − V) và varactor, điện dung khuếch tán, ứng dụng diode (chỉnh lưu, Zener, varactor, photodiode), và các bước chế tạo chuyển tiếp p-n.',
  { s: '35', clo: 'CLO3', flm: 'Junction Capacitance &amp; p-n Junction Application; p-n junction Fabrication', sach: 'Streetman &amp; Banerjee ch.5 (junction capacitance and fabrication)',
    hEn: 'Junction capacitance, applications and fabrication',
    hVi: 'Điện dung chuyển tiếp, ứng dụng và chế tạo',
    lEn: 'a depletion region is an insulator between two conductors, so it <em>is</em> a capacitor — and a voltage-controlled one. Expect: junction capacitance C<sub>j</sub> ∝ 1/√(V<sub>bi</sub> − V) and the varactor, diffusion capacitance under forward bias, why C<sub>j</sub> limits switching speed, the diode application set (rectifier, Zener regulator, varactor, photodiode), and an outline of fabrication — oxidation, lithography, implantation, diffusion, metallisation. Lesson 1.6 gave you C = εA/d; this is the same formula with d = W(V).',
    lVi: 'một vùng nghèo là lớp cách điện nằm giữa hai vùng dẫn, nên nó <em>chính là</em> một tụ điện — và là tụ điều khiển được bằng điện áp. Dự kiến: điện dung chuyển tiếp C<sub>j</sub> ∝ 1/√(V<sub>bi</sub> − V) và linh kiện varactor, điện dung khuếch tán khi phân cực thuận, vì sao C<sub>j</sub> giới hạn tốc độ chuyển mạch, bộ ứng dụng của diode (chỉnh lưu, ổn áp Zener, varactor, photodiode), và các bước chế tạo — oxy hoá, quang khắc, cấy ion, khuếch tán, tạo lớp kim loại. Bài 1.6 đã cho bạn C = εA/d; đây vẫn công thức đó với d = W(V).',
    dEn: 'compute a junction capacitance at a given reverse bias, and explain why a varactor tunes a radio.',
    dVi: 'tính được điện dung chuyển tiếp ở một mức phân cực nghịch cho trước, và giải thích được vì sao một varactor dò được đài.' });

const k66 = khung('sdi101m-6-6-chuyen-tiep-kim-loai-ban-dan',
  '6.6 — Metal–semiconductor junctions: Schottky and ohmic|||6.6 — Chuyển tiếp kim loại–bán dẫn: Schottky và ohmic',
  'KHUNG. Buổi 36, CLO3. Công thoát, rào Schottky, diode Schottky (áp thuận thấp, chuyển mạch nhanh), tiếp xúc ohmic và vì sao mọi chip cần cả hai loại.',
  { s: '36', clo: 'CLO3', flm: 'Metal–Semiconductor Junctions', sach: 'Streetman &amp; Banerjee ch.5 (metal-semiconductor junctions)',
    hEn: 'Metal–semiconductor junctions',
    hVi: 'Chuyển tiếp kim loại–bán dẫn',
    lEn: 'every chip has metal touching silicon at millions of places, and the physics of that contact is not optional. Expect: work function, the <strong>Schottky barrier</strong>, the Schottky diode (lower forward drop ≈ 0.3 V, majority-carrier operation so very fast switching), the <strong>ohmic contact</strong> and how heavy doping produces one, and why a design needs Schottky contacts in some places and ohmic ones everywhere else. Note that the course Description also mentions MESFETs, which are built on this junction — the session plan does not list them (see lesson 0.1).',
    lVi: 'mọi con chip đều có kim loại chạm vào silic ở hàng triệu chỗ, và vật lý của tiếp xúc đó không phải thứ tuỳ chọn. Dự kiến: công thoát, <strong>rào Schottky</strong>, diode Schottky (sụt áp thuận thấp ≈ 0,3 V, hoạt động bằng hạt tải đa số nên chuyển mạch rất nhanh), <strong>tiếp xúc ohmic</strong> và cách pha tạp đậm tạo ra nó, và vì sao một thiết kế cần tiếp xúc Schottky ở vài chỗ và tiếp xúc ohmic ở mọi chỗ khác. Chú ý ô Description của môn cũng nhắc MESFET, vốn dựng trên chuyển tiếp này — nhưng bảng kế hoạch buổi không có nó (xem bài 0.1).',
    dEn: 'tell a Schottky contact from an ohmic one from the doping and the work functions, and say why a Schottky diode switches faster than a p-n diode.',
    dVi: 'phân biệt được tiếp xúc Schottky với tiếp xúc ohmic qua mức pha tạp và công thoát, và nói được vì sao diode Schottky chuyển mạch nhanh hơn diode p-n.' });

/* ── Chương 7 — Transistor: JFET, MOSFET, BJT (buổi 37–42) ──────────────── */
const k71 = khung('sdi101m-7-1-jfet',
  '7.1 — Transistor operation and the junction FET|||7.1 — Nguyên lý transistor và JFET',
  'KHUNG. Buổi 37, CLO3. Transistor làm gì (khuếch đại và chuyển mạch), cấu tạo JFET, kênh bị vùng nghèo thắt lại, điện áp thắt kênh, vùng tuyến tính và vùng bão hoà, đặc tuyến ra.',
  { s: '37', clo: 'CLO3', flm: 'Transistor Operation and The Junction FET', sach: 'Streetman &amp; Banerjee ch.6 (field-effect transistors, JFET)',
    hEn: 'Transistor operation and the junction FET',
    hVi: 'Nguyên lý transistor và JFET (FET chuyển tiếp)',
    lEn: 'what a transistor is for, then the simplest field-effect device. Expect: the two jobs every transistor does — amplify and switch — then the JFET: a channel whose width is squeezed by the depletion region of a reverse-biased gate junction, pinch-off voltage, the linear and saturation regions, and the output characteristics. The JFET comes first because it is nothing but the session-32 depletion region used as a valve.',
    lVi: 'transistor dùng để làm gì, rồi tới linh kiện hiệu ứng trường đơn giản nhất. Dự kiến: hai việc mà mọi transistor đều làm — khuếch đại và chuyển mạch — rồi tới JFET: một kênh dẫn mà bề rộng bị vùng nghèo của chuyển tiếp cổng phân cực nghịch bóp lại, điện áp thắt kênh, vùng tuyến tính và vùng bão hoà, và đặc tuyến ra. JFET được dạy trước vì nó không là gì khác ngoài vùng nghèo của buổi 32 đem dùng làm một cái van.',
    dEn: 'read a JFET output characteristic, mark pinch-off, and state which region you would bias in for an amplifier and which for a switch.',
    dVi: 'đọc được đặc tuyến ra của JFET, chỉ ra điểm thắt kênh, và nói được nên phân cực ở vùng nào để làm mạch khuếch đại và vùng nào để làm khoá.' });

const k72 = khung('sdi101m-7-1-mosfet',
  '7.2 — MOS field-effect transistor (1): the MOS capacitor|||7.2 — Transistor hiệu ứng trường MOS (1): tụ MOS',
  'KHUNG. Buổi 38, CLO3. Chồng lớp kim loại–oxit–bán dẫn, ba chế độ (tích tụ, nghèo, đảo), điện áp ngưỡng V_th, C_ox = ε_ox/t_ox, và vì sao cổng gần như không lấy dòng.',
  { s: '38', clo: 'CLO3', flm: 'MOS Field-Effect Transistor — 1', sach: 'Streetman &amp; Banerjee ch.6 (the MOS capacitor and MOSFET)',
    hEn: 'MOSFET (1) — the MOS capacitor',
    hVi: 'MOSFET (1) — tụ MOS',
    lEn: 'the device that runs the digital world, started from its capacitor. Expect: the metal–oxide–semiconductor stack, the three regimes of the MOS capacitor (<strong>accumulation, depletion, inversion</strong>), the <strong>threshold voltage V<sub>th</sub></strong> as the gate voltage at which an inversion channel forms, C<sub>ox</sub>′ = ε<sub>ox</sub>/t<sub>ox</sub>, and why the gate draws almost no current. You already computed C<sub>ox</sub>′ = 1.727 µF/cm² and 17.3 fF for a 1 µm² gate in lesson 1.6.',
    lVi: 'linh kiện điều hành thế giới số, bắt đầu từ cái tụ của nó. Dự kiến: chồng lớp kim loại–oxit–bán dẫn, ba chế độ của tụ MOS (<strong>tích tụ, nghèo, đảo</strong>), <strong>điện áp ngưỡng V<sub>th</sub></strong> là điện áp cổng mà tại đó kênh đảo hình thành, C<sub>ox</sub>′ = ε<sub>ox</sub>/t<sub>ox</sub>, và vì sao cực cổng gần như không lấy dòng. Bạn đã tự tính C<sub>ox</sub>′ = 1,727 µF/cm² và 17,3 fF cho một cổng 1 µm² ở bài 1.6.',
    dEn: 'draw the band diagram of a MOS capacitor in all three regimes and compute C<sub>ox</sub>′ from an oxide thickness.',
    dVi: 'vẽ được sơ đồ dải của tụ MOS trong cả ba chế độ và tính được C<sub>ox</sub>′ từ bề dày oxit.' });

const k73 = khung('sdi101m-7-3-mosfet-dac-tuyen',
  '7.3 — MOS field-effect transistor (2): I–V characteristics|||7.3 — Transistor hiệu ứng trường MOS (2): đặc tuyến I–V',
  'KHUNG. Buổi 39, CLO3. NMOS và PMOS, tăng cường và nghèo, vùng tuyến tính và bão hoà, I_D = ½·μ·C_ox·(W/L)·(V_GS − V_th)², độ hỗ dẫn g_m, dòng dưới ngưỡng.',
  { s: '39', clo: 'CLO3', flm: 'MOS Field-Effect Transistor — 2', sach: 'Streetman &amp; Banerjee ch.6 (MOSFET current-voltage characteristics)',
    hEn: 'MOSFET (2) — the I–V characteristics',
    hVi: 'MOSFET (2) — đặc tuyến I–V',
    lEn: 'the equations you will use for the rest of your degree. Expect: NMOS and PMOS, enhancement and depletion types, the linear region where the device acts as a voltage-controlled resistor, saturation with <strong>I<sub>D</sub> = ½·μ·C<sub>ox</sub>′·(W/L)·(V<sub>GS</sub> − V<sub>th</sub>)²</strong>, the role of the aspect ratio W/L, transconductance g<sub>m</sub>, and subthreshold conduction — the leakage that decides the standby power of a phone.',
    lVi: 'những phương trình bạn sẽ dùng suốt phần còn lại của chương trình học. Dự kiến: NMOS và PMOS, loại tăng cường và loại nghèo, vùng tuyến tính nơi linh kiện hành xử như điện trở điều khiển bằng áp, vùng bão hoà với <strong>I<sub>D</sub> = ½·μ·C<sub>ox</sub>′·(W/L)·(V<sub>GS</sub> − V<sub>th</sub>)²</strong>, vai trò của tỷ số W/L, độ hỗ dẫn g<sub>m</sub>, và dẫn dưới ngưỡng — dòng rò quyết định công suất chờ của một chiếc điện thoại.',
    dEn: 'compute I<sub>D</sub> for a given W/L and bias, and choose W/L to hit a target current.',
    dVi: 'tính được I<sub>D</sub> với một W/L và một mức phân cực cho trước, và chọn được W/L để đạt một dòng mong muốn.' });

const k74 = khung('sdi101m-7-4-mosfet-thu-nho',
  '7.4 — MOS field-effect transistor (3): scaling and short channel|||7.4 — Transistor hiệu ứng trường MOS (3): thu nhỏ và hiệu ứng kênh ngắn',
  'KHUNG. Buổi 40, CLO3. Luật thu nhỏ, hiệu ứng kênh ngắn, tụt V_th, DIBL, dòng rò cổng, high-k/metal gate, FinFET và GAA — và vì sao 1,2 V trên oxit 2 nm là giới hạn thật.',
  { s: '40', clo: 'CLO3', flm: 'MOS Field-Effect Transistor — 3', sach: 'Streetman &amp; Banerjee ch.6 (short-channel effects, scaling)',
    hEn: 'MOSFET (3) — scaling and short-channel effects',
    hVi: 'MOSFET (3) — thu nhỏ và hiệu ứng kênh ngắn',
    lEn: 'why making transistors smaller stopped being simple. Expect: scaling rules, short-channel effects, V<sub>th</sub> roll-off, drain-induced barrier lowering, gate leakage by tunnelling through an oxide only a few atoms thick, high-k dielectrics and metal gates as the fix, and the move to 3D structures (FinFET, gate-all-around). Lesson 1.3 exercise E2 computed the hard limit directly: 2 V destroys a 2 nm oxide, so the supply cannot simply be kept at 5 V.',
    lVi: 'vì sao việc làm transistor nhỏ đi thôi đơn giản. Dự kiến: các luật thu nhỏ, hiệu ứng kênh ngắn, V<sub>th</sub> tụt dần, rào thế bị cực máng hạ xuống (DIBL), dòng rò cổng do xuyên hầm qua lớp oxit chỉ dày vài nguyên tử, điện môi high-k và cổng kim loại như cách chữa, và bước sang cấu trúc 3D (FinFET, cổng bao quanh). Bài tập B2 của bài 1.3 đã tính thẳng ra giới hạn cứng: 2 V là phá lớp oxit 2 nm, nên không thể cứ giữ nguồn ở 5 V.',
    dEn: 'explain the trade-off behind every node shrink, and name which effect a given fix (high-k, FinFET) is there to solve.',
    dVi: 'giải thích được chỗ đánh đổi nằm sau mỗi bước thu nhỏ công nghệ, và chỉ ra được mỗi cách chữa (high-k, FinFET) sinh ra để giải quyết hiệu ứng nào.' });

const k75 = khung('sdi101m-6-1-bjt',
  '7.5 — Bipolar junction transistors (1): structure and action|||7.5 — Transistor lưỡng cực (1): cấu tạo và nguyên lý',
  'KHUNG. Buổi 41, CLO3. NPN và PNP, ba cực E-B-C, hai chuyển tiếp, base mỏng pha tạp nhẹ, ba vùng làm việc (tắt, active, bão hoà), I_C = β·I_B, I_E = I_B + I_C.',
  { s: '41', clo: 'CLO3', flm: 'Bipolar Junction Transistors — 1', sach: 'Streetman &amp; Banerjee ch.7 (bipolar junction transistors)',
    hEn: 'BJT (1) — structure and transistor action',
    hVi: 'BJT (1) — cấu tạo và nguyên lý hoạt động',
    lEn: 'two junctions back to back, and the device that came first historically. Expect: NPN and PNP, the emitter–base–collector structure, why the base must be <strong>thin and lightly doped</strong>, the three operating regions (cut-off, active, saturation), current gain <strong>I<sub>C</sub> = β·I<sub>B</sub></strong> with β typically 50–300, and I<sub>E</sub> = I<sub>B</sub> + I<sub>C</sub>. Note the contrast with the MOSFET: a BJT is <strong>current</strong>-controlled and its base draws real current, while a MOSFET is voltage-controlled and its gate draws almost none.',
    lVi: 'hai chuyển tiếp đặt lưng vào nhau, và là linh kiện ra đời trước về mặt lịch sử. Dự kiến: NPN và PNP, cấu trúc emitter–base–collector, vì sao vùng base phải <strong>mỏng và pha tạp nhẹ</strong>, ba vùng làm việc (tắt, active, bão hoà), hệ số khuếch đại dòng <strong>I<sub>C</sub> = β·I<sub>B</sub></strong> với β thường 50–300, và I<sub>E</sub> = I<sub>B</sub> + I<sub>C</sub>. Chú ý chỗ đối lập với MOSFET: BJT điều khiển bằng <strong>dòng</strong> và cực base lấy dòng thật, còn MOSFET điều khiển bằng điện áp và cực cổng gần như không lấy dòng.',
    dEn: 'identify a BJT\'s operating region from its terminal voltages, and compute I<sub>C</sub> from I<sub>B</sub> and β.',
    dVi: 'xác định được vùng làm việc của một BJT từ điện áp các cực, và tính được I<sub>C</sub> từ I<sub>B</sub> và β.' });

const k76 = khung('sdi101m-7-6-bjt-khuech-dai',
  '7.6 — Bipolar junction transistors (2): gain and frequency|||7.6 — Transistor lưỡng cực (2): khuếch đại và tần số',
  'KHUNG. Buổi 42, CLO3. Đặc tuyến ra, hiệu ứng Early, mô hình tín hiệu nhỏ (g_m = I_C/V_T), tần số cắt f_T, BJT so với MOSFET, và các chỗ BJT vẫn thắng.',
  { s: '42', clo: 'CLO3', flm: 'Bipolar Junction Transistors — 2', sach: 'Streetman &amp; Banerjee ch.7 (BJT characteristics, frequency limits)',
    hEn: 'BJT (2) — gain, small signal and frequency limits',
    hVi: 'BJT (2) — khuếch đại, tín hiệu nhỏ và giới hạn tần số',
    lEn: 'the BJT as a working amplifier. Expect: output characteristics and the Early effect, base-width modulation, the small-signal model with <strong>g<sub>m</sub> = I<sub>C</sub>/V<sub>T</sub></strong> — the 25.9 mV of lesson 1.5 appearing in an amplifier gain — the cut-off frequency f<sub>T</sub>, and an honest BJT-versus-MOSFET comparison: the BJT still wins on matching, on noise and on drive current per area, which is why analogue and RF design has not abandoned it.',
    lVi: 'BJT với vai trò một mạch khuếch đại thật. Dự kiến: đặc tuyến ra và hiệu ứng Early, sự điều biến bề rộng base, mô hình tín hiệu nhỏ với <strong>g<sub>m</sub> = I<sub>C</sub>/V<sub>T</sub></strong> — đúng 25,9 mV của bài 1.5 xuất hiện trong hệ số khuếch đại — tần số cắt f<sub>T</sub>, và một phép so BJT với MOSFET trung thực: BJT vẫn thắng về độ tương hợp, về nhiễu và về dòng trên một đơn vị diện tích, và đó là lý do thiết kế tương tự và RF chưa từ bỏ nó.',
    dEn: 'compute g<sub>m</sub> at a given bias current and say when you would choose a BJT over a MOSFET.',
    dVi: 'tính được g<sub>m</sub> ở một dòng phân cực cho trước và nói được khi nào nên chọn BJT thay vì MOSFET.' });

/* ── Chương 8 — Linh kiện quang & CMOS (buổi 43–46) ─────────────────────── */
const k81 = khung('sdi101m-8-1-linh-kien-quang',
  '8.1 — Optoelectronic devices (1): photodiode and solar cell|||8.1 — Linh kiện quang điện tử (1): photodiode và pin mặt trời',
  'KHUNG. Buổi 43, CLO3. Photon vào thành dòng ra: photodiode, dòng quang, độ đáp ứng, PIN và APD, pin mặt trời (V_oc, I_sc, hệ số lấp đầy, hiệu suất) và vì sao silic mất năng lượng photon lam.',
  { s: '43', clo: 'CLO3', flm: 'Optoelectronic Devices — 1', sach: 'Streetman &amp; Banerjee ch.8 (optoelectronic devices)',
    hEn: 'Optoelectronic devices (1) — light in',
    hVi: 'Linh kiện quang điện tử (1) — ánh sáng đi vào',
    lEn: 'a reverse-biased junction with light falling on it. Expect: photocurrent, responsivity and quantum efficiency, the PIN photodiode and the avalanche photodiode, and the solar cell — open-circuit voltage, short-circuit current, fill factor and efficiency. Lesson 1.11 exercise E1 already derived both loss mechanisms: silicon wastes 1.6 eV of every blue photon and cannot use 1550 nm at all.',
    lVi: 'một chuyển tiếp phân cực nghịch có ánh sáng rọi vào. Dự kiến: dòng quang, độ đáp ứng và hiệu suất lượng tử, photodiode PIN và photodiode thác lũ, và pin mặt trời — điện áp hở mạch, dòng ngắn mạch, hệ số lấp đầy và hiệu suất. Bài tập B1 của bài 1.11 đã suy ra cả hai cơ chế tổn thất: silic bỏ mất 1,6 eV của mỗi photon lam và hoàn toàn không dùng được 1550 nm.',
    dEn: 'compute a photocurrent from an optical power and a responsivity, and explain the efficiency ceiling of a single-junction silicon cell.',
    dVi: 'tính được dòng quang từ công suất quang và độ đáp ứng, và giải thích được trần hiệu suất của một pin silic một chuyển tiếp.' });

const k82 = khung('sdi101m-8-2-linh-kien-quang-2',
  '8.2 — Optoelectronic devices (2): LED and laser diode|||8.2 — Linh kiện quang điện tử (2): LED và laser diode',
  'KHUNG. Buổi 44, CLO3. Dòng vào thành ánh sáng ra: LED (màu do khe cấm), λ = 1240/Eg, vì sao silic không phát sáng được, LED trắng, laser diode và điều kiện đảo mật độ.',
  { s: '44', clo: 'CLO3', flm: 'Optoelectronic Devices — 2', sach: 'Streetman &amp; Banerjee ch.8 (LEDs, lasers)',
    hEn: 'Optoelectronic devices (2) — light out',
    hVi: 'Linh kiện quang điện tử (2) — ánh sáng đi ra',
    lEn: 'the same junction run the other way. Expect: the LED with its colour fixed by <strong>λ = 1240/E<sub>g</sub></strong>, why a direct-gap material is required and silicon is therefore hopeless as an emitter, how white LEDs are made from a blue die plus a phosphor, and the laser diode — population inversion, the optical cavity, threshold current. Lesson 1.11 exercise E2 already computed the 1.9 eV of a red LED and the 2.7 eV a blue one needs.',
    lVi: 'vẫn chuyển tiếp đó, chạy theo chiều ngược lại. Dự kiến: LED với màu do <strong>λ = 1240/E<sub>g</sub></strong> chốt lại, vì sao phải là vật liệu khe cấm trực tiếp và do đó silic vô vọng trong vai trò nguồn phát, cách người ta làm LED trắng từ một đế lam cộng một lớp phosphor, và laser diode — đảo mật độ, buồng quang học, dòng ngưỡng. Bài tập B2 của bài 1.11 đã tính ra 1,9 eV của LED đỏ và 2,7 eV mà LED lam cần.',
    dEn: 'pick a material for a required LED colour, and say what a laser diode has that an LED does not.',
    dVi: 'chọn được vật liệu cho một màu LED yêu cầu, và nói được laser diode có gì mà LED không có.' });

const k83 = khung('sdi101m-8-3-cmos-1',
  '8.3 — CMOS technology (1): the inverter and static logic|||8.3 — Công nghệ CMOS (1): cổng đảo và logic tĩnh',
  'KHUNG. Buổi 45, CLO3. NMOS + PMOS bù nhau, cổng đảo CMOS, vì sao công suất tĩnh gần bằng không, đặc tuyến truyền đạt, NAND/NOR, và vì sao PMOS phải rộng hơn.',
  { s: '45', clo: 'CLO3', flm: 'CMOS Technology — 1', sach: 'Streetman &amp; Banerjee ch.6 and 9 (CMOS)',
    hEn: 'CMOS technology (1) — the inverter',
    hVi: 'Công nghệ CMOS (1) — cổng đảo',
    lEn: 'how two transistors become a logic gate. Expect: the complementary NMOS + PMOS pair, the CMOS inverter, why its <strong>static power is almost zero</strong> and current flows mainly during a transition, the transfer characteristic and noise margins, building NAND and NOR, and why the PMOS is drawn wider — because μ<sub>p</sub> ≈ 480 against μ<sub>n</sub> ≈ 1350, the mobility numbers from lesson 1.7. Dynamic power is the ½CV²·f of lesson 1.6, multiplied by a billion gates.',
    lVi: 'hai transistor trở thành một cổng logic bằng cách nào. Dự kiến: cặp bù NMOS + PMOS, cổng đảo CMOS, vì sao <strong>công suất tĩnh của nó gần bằng không</strong> và dòng chủ yếu chỉ chảy trong lúc chuyển trạng thái, đặc tuyến truyền đạt và biên nhiễu, dựng cổng NAND và NOR, và vì sao PMOS được vẽ rộng hơn — vì μ<sub>p</sub> ≈ 480 so với μ<sub>n</sub> ≈ 1350, đúng hai con số độ linh động của bài 1.7. Công suất động chính là ½CV²·f của bài 1.6, nhân với một tỉ cổng.',
    dEn: 'draw a CMOS inverter and a CMOS NAND, and estimate the dynamic power of a node from C, V and f.',
    dVi: 'vẽ được một cổng đảo CMOS và một cổng NAND CMOS, và ước lượng được công suất động của một nút từ C, V và f.' });

const k84 = khung('sdi101m-8-4-cmos-2',
  '8.4 — CMOS technology (2): the process flow|||8.4 — Công nghệ CMOS (2): dòng công nghệ chế tạo',
  'KHUNG. Buổi 46, CLO3. Từ wafer tới chip: oxy hoá, quang khắc (DUV 193 nm, EUV 13,5 nm), cấy ion, ăn mòn, lắng màng, CMP, nhiều lớp kim loại, latch-up, hiệu suất sản xuất.',
  { s: '46', clo: 'CLO3', flm: 'CMOS Technology — 2', sach: 'Streetman &amp; Banerjee ch.9 (integrated-circuit fabrication)',
    hEn: 'CMOS technology (2) — the process flow',
    hVi: 'Công nghệ CMOS (2) — dòng công nghệ chế tạo',
    lEn: 'how a CMOS wafer is actually built. Expect: the full sequence — oxidation, <strong>photolithography</strong>, ion implantation, etching, thin-film deposition, CMP, several metal layers — twin-well and latch-up, and yield. Lesson 1.11 gave the lithography numbers directly: DUV at 193 nm is 6.42 eV per photon, EUV at 13.5 nm is 91.9 eV, which is why EUV needs vacuum and mirrors instead of air and lenses.',
    lVi: 'một phiến wafer CMOS được dựng lên thật ra thế nào. Dự kiến: trọn trình tự — oxy hoá, <strong>quang khắc</strong>, cấy ion, ăn mòn, lắng màng mỏng, CMP, nhiều lớp kim loại — giếng đôi và hiện tượng latch-up, và hiệu suất sản xuất (yield). Bài 1.11 đã cho luôn các con số của quang khắc: DUV 193 nm là 6,42 eV một photon, EUV 13,5 nm là 91,9 eV, và đó là lý do EUV cần chân không và gương thay vì không khí và thấu kính.',
    dEn: 'put the process steps in order for a simple CMOS structure, and explain why a shorter wavelength is the price of a smaller feature.',
    dVi: 'xếp đúng thứ tự các bước công nghệ cho một cấu trúc CMOS đơn giản, và giải thích được vì sao bước sóng ngắn hơn là cái giá phải trả cho chi tiết nhỏ hơn.' });

/* ── Chương 9 — IC, bộ nhớ & chip AI (buổi 47–50) ───────────────────────── */
const k91 = khung('sdi101m-8-1-ic',
  '9.1 — Integrated circuit & memory (1): from device to IC|||9.1 — Mạch tích hợp & bộ nhớ (1): từ linh kiện tới IC',
  'KHUNG. Buổi 47, CLO3. Mạch tích hợp là gì, mức tích hợp SSI→VLSI, định luật Moore, dây nối và ký sinh, IC số vs tương tự vs tín hiệu trộn, đóng gói và kiểm thử.',
  { s: '47', clo: 'CLO3', flm: 'Integrated Circuit &amp; Memory — 1', sach: 'Streetman &amp; Banerjee ch.9 (integrated circuits)',
    hEn: 'Integrated circuit and memory (1) — from device to IC',
    hVi: 'Mạch tích hợp và bộ nhớ (1) — từ linh kiện tới IC',
    lEn: 'the step from one transistor to a billion. Expect: what integration buys you, the SSI → MSI → LSI → VLSI ladder, <strong>Moore\'s law</strong> and what is actually doubling, interconnect and parasitic resistance and capacitance (why wires, not transistors, now limit speed), digital versus analogue versus mixed-signal ICs, and packaging and test. The current-density limit of lesson 1.7 — 10⁵ A/cm² in a 1 µm² via — is a real interconnect design rule.',
    lVi: 'bước từ một transistor lên một tỉ transistor. Dự kiến: tích hợp mua được gì cho ta, bậc thang SSI → MSI → LSI → VLSI, <strong>định luật Moore</strong> và thật ra cái gì đang gấp đôi, dây nối cùng điện trở và điện dung ký sinh (vì sao giờ dây nối, chứ không phải transistor, mới là chỗ giới hạn tốc độ), IC số so với tương tự so với tín hiệu trộn, và đóng gói cùng kiểm thử. Giới hạn mật độ dòng của bài 1.7 — 10⁵ A/cm² trong một via 1 µm² — là một quy tắc thiết kế dây nối thật.',
    dEn: 'explain what Moore\'s law does and does not promise, and say why interconnect delay grew into the dominant problem.',
    dVi: 'giải thích được định luật Moore hứa gì và không hứa gì, và nói được vì sao trễ trên dây nối lớn lên thành bài toán chi phối.' });

const k92 = khung('sdi101m-9-2-bo-nho',
  '9.2 — Integrated circuit & memory (2): SRAM, DRAM, flash|||9.2 — Mạch tích hợp & bộ nhớ (2): SRAM, DRAM, flash',
  'KHUNG. Buổi 48, CLO3. Ô SRAM 6 transistor, ô DRAM 1T1C và vì sao phải làm mới, flash với cổng nổi và xuyên hầm, bộ nhớ khả biến vs bất khả biến, phân cấp bộ nhớ.',
  { s: '48', clo: 'CLO3', flm: 'Integrated Circuit &amp; Memory — 2', sach: 'Streetman &amp; Banerjee ch.9 (memory devices)',
    hEn: 'Integrated circuit and memory (2) — SRAM, DRAM, flash',
    hVi: 'Mạch tích hợp và bộ nhớ (2) — SRAM, DRAM, flash',
    lEn: 'three ways to store a bit, each a direct consequence of the physics in chapters 4–7. Expect: the 6-transistor SRAM cell (fast, big), the 1-transistor-1-capacitor DRAM cell and <strong>why it must be refreshed</strong> — the stored charge leaks away — and flash with its floating gate written and erased by tunnelling. Then volatile versus non-volatile and the memory hierarchy. Lesson 1.6 makes the DRAM refresh intuitive: a bit is only about 10⁵ electrons on a small capacitor.',
    lVi: 'ba cách lưu một bit, mỗi cách là hệ quả trực tiếp của vật lý trong chương 4–7. Dự kiến: ô SRAM 6 transistor (nhanh, to), ô DRAM 1 transistor 1 tụ và <strong>vì sao nó buộc phải được làm mới</strong> — điện tích lưu bị rò đi — và flash với cổng nổi được ghi và xoá bằng xuyên hầm. Rồi bộ nhớ khả biến so với bất khả biến và phân cấp bộ nhớ. Bài 1.6 làm việc làm mới DRAM trở nên trực quan: một bit chỉ là chừng 10⁵ electron trên một cái tụ nhỏ.',
    dEn: 'compare SRAM, DRAM and flash on cell size, speed and retention, and explain each difference from device physics rather than from a table.',
    dVi: 'so được SRAM, DRAM và flash về kích thước ô, tốc độ và khả năng giữ dữ liệu, và giải thích từng khác biệt bằng vật lý linh kiện chứ không bằng một bảng học thuộc.' });

const k93 = khung('sdi101m-9-3-chip-ai-1',
  '9.3 — Introduction of AI chip (1): why CPUs are not enough|||9.3 — Nhập môn chip AI (1): vì sao CPU không đủ',
  'KHUNG. Buổi 49, CLO3. Phép nhân ma trận là hạt nhân của AI, giới hạn von Neumann, GPU/TPU/NPU, mảng systolic, độ chính xác thấp (FP16/INT8), và bài toán bức tường bộ nhớ.',
  { s: '49', clo: 'CLO3', flm: 'Introduction of AI Chip — 1', sach: 'no FLM material covers this — expect lecturer slides; Asianometry and vendor whitepapers are useful background',
    hEn: 'AI chip (1) — why a CPU is not enough',
    hVi: 'Chip AI (1) — vì sao một CPU thì không đủ',
    lEn: 'the most modern session in the syllabus, and the one with no textbook behind it. Expect: matrix multiplication as the kernel of every neural network, the von Neumann bottleneck, the GPU / TPU / NPU family, systolic arrays, reduced precision (FP16, INT8) and why it works, and the <strong>memory wall</strong> — moving data now costs more energy than computing on it, which is a direct consequence of the ½CV² of lesson 1.6 paid on every long wire.',
    lVi: 'buổi hiện đại nhất của syllabus, và là buổi không có giáo trình nào đứng sau. Dự kiến: phép nhân ma trận như hạt nhân của mọi mạng nơ-ron, chỗ nghẽn von Neumann, họ GPU / TPU / NPU, mảng systolic, độ chính xác thấp (FP16, INT8) và vì sao nó vẫn dùng được, và <strong>bức tường bộ nhớ</strong> — di chuyển dữ liệu giờ tốn năng lượng hơn tính toán trên nó, vốn là hệ quả trực tiếp của ½CV² ở bài 1.6 phải trả trên mỗi đường dây dài.',
    dEn: 'say what an AI accelerator does differently from a CPU, and why the bottleneck moved from arithmetic to data movement.',
    dVi: 'nói được một bộ tăng tốc AI làm khác CPU ở chỗ nào, và vì sao chỗ nghẽn chuyển từ phép tính sang việc di chuyển dữ liệu.' });

const k94 = khung('sdi101m-9-4-chip-ai-2',
  '9.4 — Introduction of AI chip (2): HBM, packaging, roadmap|||9.4 — Nhập môn chip AI (2): HBM, đóng gói và hướng đi',
  'KHUNG. Buổi 50, CLO3. HBM và bộ nhớ xếp lớp 3D, đóng gói tiên tiến (2.5D/3D, chiplet, TSV), tính toán trong bộ nhớ, tính toán tương tự và mạch nhớ (memristor), giới hạn công suất và nhiệt.',
  { s: '50', clo: 'CLO3', flm: 'Introduction of AI Chip — 2', sach: 'no FLM material covers this — expect lecturer slides',
    hEn: 'AI chip (2) — memory, packaging and where it is going',
    hVi: 'Chip AI (2) — bộ nhớ, đóng gói và hướng đi tiếp',
    lEn: 'the answers the industry is currently trying. Expect: <strong>HBM</strong> and 3D-stacked DRAM, advanced packaging (2.5D and 3D, chiplets, through-silicon vias), in-memory and near-memory computing, analogue and memristor approaches, and the power and thermal ceiling that decides how big an accelerator can get. This session closes the arc that began at session 22: from one silicon crystal to a package that trains a model.',
    lVi: 'những câu trả lời mà ngành đang thử. Dự kiến: <strong>HBM</strong> và DRAM xếp lớp 3D, đóng gói tiên tiến (2.5D và 3D, chiplet, via xuyên silic), tính toán trong bộ nhớ và cạnh bộ nhớ, hướng tương tự và memristor, và trần công suất cùng trần nhiệt quyết định một bộ tăng tốc lớn được tới đâu. Buổi này khép lại vòng cung mở từ buổi 22: từ một tinh thể silic tới một khối đóng gói huấn luyện được một mô hình.',
    dEn: 'explain why HBM sits next to the die rather than on the board, and name the physical limit each packaging trick is buying around.',
    dVi: 'giải thích được vì sao HBM nằm sát cạnh đế chip chứ không nằm trên bảng mạch, và chỉ ra được mỗi mẹo đóng gói đang mua đường quanh giới hạn vật lý nào.' });

/* ── Chương 10 — Assignment 2 & Progress Test 2 (buổi 51–54) ────────────── */
const k101 = khung('sdi101m-10-1-assignment-2',
  '10.1 — Assignment 2: sessions 51–53, 10% — and a CLO puzzle|||10.1 — Assignment 2: buổi 51–53, 10% — và một chỗ lệch CLO',
  'KHUNG. Buổi 51–53, kế hoạch buổi ghi CLO3 nhưng bảng đánh giá gắn CLO2. 135 phút, 10%. ⚠️ Nêu rõ chỗ lệch: CLO2 là mạch RLC và an toàn điện (buổi 15–21), mà Assignment 2 lại xếp giữa khối bán dẫn.',
  { s: '51–53', clo: 'CLO3', flm: 'Assignment 2', sach: 'depends on which reading applies — ask your lecturer first (see below)',
    hEn: 'Assignment 2 — and the CLO mismatch you must ask about',
    hVi: 'Assignment 2 — và chỗ lệch CLO bạn buộc phải hỏi',
    lEn: '135 minutes, <strong>10%</strong>, three sessions (51, 52, 53). <strong>Read this carefully:</strong> the session plan tags these three sessions <strong>CLO3</strong> (semiconductors), but the Assessments table tags Assignment 2 with <strong>CLO2</strong> — "practice with the components used in RLC circuit… electric circuit safety", which was taught back at sessions 15–21. Both statements are in the published syllabus. This site does not pick one; it tells you to ask, because the scope of a 10% mark hangs on the answer.',
    lVi: '135 phút, <strong>10%</strong>, ba buổi (51, 52, 53). <strong>Đọc kỹ chỗ này:</strong> kế hoạch buổi gắn ba buổi này là <strong>CLO3</strong> (bán dẫn), nhưng bảng Assessments gắn Assignment 2 với <strong>CLO2</strong> — "thực hành với các phần tử dùng trong mạch RLC… an toàn điện", vốn được dạy ở buổi 15–21. Cả hai phát biểu đều nằm trong bản syllabus trường công bố. Web KHÔNG chọn hộ một bên; web nói bạn phải đi hỏi, vì phạm vi của một đầu điểm 10% treo vào câu trả lời đó.',
    dEn: 'walk in knowing which of the two readings your lecturer is using, and having asked in session 51 rather than discovering it when the mark comes back.',
    dVi: 'bước vào với việc đã biết giảng viên đang dùng cách đọc nào trong hai cách, và đã hỏi ngay ở buổi 51 thay vì phát hiện ra khi điểm đã trả về.' });

const k102 = khung('sdi101m-10-2-progress-test-2',
  '10.2 — Progress Test 2: session 54, 45 min, 30 questions, 15%|||10.2 — Progress Test 2: buổi 54, 45 phút, 30 câu, 15%',
  'KHUNG. Buổi 54, 45 phút, 30 câu, 15%. ⚠️ Bảng đánh giá gắn CLO3, kế hoạch buổi ghi "CLO3, CLO4" — ôn theo cách đọc rộng hơn. Phạm vi: buổi 22–53.',
  { s: '54', clo: 'CLO3, CLO4', flm: 'Progress Test 2', sach: 'chapters 4–9 of this site (sessions 22–50); Streetman ch.1–9',
    hEn: 'Progress Test 2 — 30 questions in 45 minutes',
    hVi: 'Progress Test 2 — 30 câu trong 45 phút',
    lEn: '45 minutes, <strong>30 questions</strong>, <strong>15%</strong> — the mirror of Progress Test 1, now over the semiconductor half. <strong>Same CLO mismatch:</strong> the Assessments table says <strong>CLO3</strong>, the session plan says <strong>"CLO3, CLO4"</strong>. Since CLO4 is "observe and verify the operating characteristics", and LAB 2 has not happened yet at session 54, ask whether lab-style questions are in scope.',
    lVi: '45 phút, <strong>30 câu</strong>, <strong>15%</strong> — bản đối xứng của Progress Test 1, giờ trên nửa bán dẫn. <strong>Vẫn chỗ lệch CLO đó:</strong> bảng Assessments ghi <strong>CLO3</strong>, kế hoạch buổi ghi <strong>"CLO3, CLO4"</strong>. Vì CLO4 là "quan sát và kiểm chứng đặc tuyến hoạt động", mà tới buổi 54 thì LAB 2 chưa diễn ra, hãy hỏi xem câu hỏi dạng thực hành có nằm trong phạm vi hay không.',
    dEn: 'answer a band-diagram, junction or transistor question in about 90 seconds, which needs the diagrams drawn from memory rather than reconstructed.',
    dVi: 'trả lời được một câu về sơ đồ dải, chuyển tiếp hay transistor trong khoảng 90 giây, và điều đó cần các sơ đồ vẽ ra từ trí nhớ chứ không phải dựng lại từ đầu.' });

/* ── Chương 11 — LAB 2: bán dẫn (buổi 55–60) ────────────────────────────── */
const k111 = khung('sdi101m-11-1-lab2-diode',
  '11.1 — LAB 2 (sessions 55–56): diode I–V characteristic|||11.1 — LAB 2 (buổi 55–56): đo đặc tuyến I–V của diode',
  'KHUNG. Buổi 55–56, CLO3+CLO4. Mở LAB 2: đo đặc tuyến thuận và nghịch của diode, vẽ trên trục log, rút ra I_S và hệ số phát xạ n, so với phương trình Shockley.',
  { s: '55–56', clo: 'CLO3, CLO4', flm: 'LAB 2: Semiconductors — 1, 2', sach: 'lesson 6.3 (Shockley equation) and lesson 1.8 (why the series resistor is mandatory)',
    hEn: 'LAB 2, part 1 — the diode I–V curve',
    hVi: 'LAB 2, phần 1 — đường đặc tuyến I–V của diode',
    lEn: 'the opening of the only block that teaches <strong>CLO4</strong>: "observe and verify the operating characteristics of semiconductor devices". Expect: measuring forward and reverse I–V point by point, always through a current-limiting resistor (lesson 1.8), plotting log I against V to get a straight line, and extracting I<sub>S</sub> and the ideality factor n from that line to test the Shockley equation against a real part.',
    lVi: 'buổi mở đầu của khối duy nhất dạy <strong>CLO4</strong>: "quan sát và kiểm chứng đặc tuyến hoạt động của linh kiện bán dẫn". Dự kiến: đo đặc tuyến thuận và nghịch từng điểm một, luôn qua một điện trở hạn dòng (bài 1.8), vẽ log I theo V để ra một đường thẳng, và rút I<sub>S</sub> cùng hệ số phát xạ n từ đường thẳng đó để kiểm phương trình Shockley trên một linh kiện thật.',
    dEn: 'measure an I–V curve safely, and compare a real diode with the ideal equation instead of trusting either one blindly.',
    dVi: 'đo được một đường I–V một cách an toàn, và so một diode thật với phương trình lý tưởng thay vì tin mù vào bên nào.' });

const k112 = khung('sdi101m-11-2-lab2-transistor',
  '11.2 — LAB 2 (sessions 57–58): transistor characteristics|||11.2 — LAB 2 (buổi 57–58): đặc tuyến transistor',
  'KHUNG. Buổi 57–58, CLO3+CLO4. Đo họ đặc tuyến ra của BJT và/hoặc MOSFET, rút β hoặc V_th và g_m, xác định vùng làm việc, và đo hiệu ứng nhiệt độ.',
  { s: '57–58', clo: 'CLO3, CLO4', flm: 'LAB 2: Semiconductors — 3, 4', sach: 'lessons 7.3 (MOSFET I–V) and 7.5–7.6 (BJT); the syllabus does not say which device the lab uses',
    hEn: 'LAB 2, part 2 — transistor characteristics',
    hVi: 'LAB 2, phần 2 — đặc tuyến transistor',
    lEn: 'from one junction to a three-terminal device. Expect: measuring a family of output curves (I<sub>C</sub> against V<sub>CE</sub> for several I<sub>B</sub>, or I<sub>D</sub> against V<sub>DS</sub> for several V<sub>GS</sub>), extracting β or V<sub>th</sub> and g<sub>m</sub> from the data, identifying the operating regions on the plot, and observing that the curves move with temperature. Which device the lab uses is not published — ask.',
    lVi: 'từ một chuyển tiếp lên một linh kiện ba cực. Dự kiến: đo một họ đặc tuyến ra (I<sub>C</sub> theo V<sub>CE</sub> với vài giá trị I<sub>B</sub>, hoặc I<sub>D</sub> theo V<sub>DS</sub> với vài giá trị V<sub>GS</sub>), rút β hoặc V<sub>th</sub> và g<sub>m</sub> từ số liệu, chỉ ra các vùng làm việc trên đồ thị, và quan sát các đường dịch đi theo nhiệt độ. Linh kiện cụ thể mà lab dùng thì trường không công bố — hãy hỏi.',
    dEn: 'produce a measured output-characteristic family, mark its regions, and quote β or V<sub>th</sub> with an uncertainty.',
    dVi: 'dựng được một họ đặc tuyến ra từ số liệu đo, đánh dấu các vùng trên đó, và ghi β hoặc V<sub>th</sub> kèm sai số.' });

const k113 = khung('sdi101m-11-3-lab2-bao-cao',
  '11.3 — LAB 2 (sessions 59–60): light-sensitive devices & report|||11.3 — LAB 2 (buổi 59–60): linh kiện cảm quang & báo cáo',
  'KHUNG. Buổi 59–60, CLO3+CLO4. Kết LAB 2: LED/photodiode/LDR, kiểm λ = 1240/Eg bằng màu LED thật, viết báo cáo — hết 270 phút của Lab 2 (5%), và là hai buổi cuối của môn.',
  { s: '59–60', clo: 'CLO3, CLO4', flm: 'LAB 2: Semiconductors — 5, 6', sach: 'lesson 1.11 (λ = 1240/Eg) and lessons 8.1–8.2 (optoelectronic devices)',
    hEn: 'LAB 2, part 3 — light-sensitive devices, and the report',
    hVi: 'LAB 2, phần 3 — linh kiện cảm quang, và báo cáo',
    lEn: 'the last two sessions of the course. Expect: LEDs of several colours, a photodiode or LDR, measuring forward voltage against emitted colour and testing it against <strong>λ = 1240/E<sub>g</sub></strong> from lesson 1.11, then the LAB 2 report — which completes the <strong>270 minutes</strong> and <strong>5%</strong> of Lab 2. Note that the plan has <strong>no revision session</strong>: session 60 is LAB 2, and the 40% final exam comes after it, so your own revision has to be scheduled by you.',
    lVi: 'hai buổi cuối cùng của môn. Dự kiến: LED nhiều màu, một photodiode hoặc LDR, đo điện áp thuận theo màu phát ra và đối chiếu với <strong>λ = 1240/E<sub>g</sub></strong> của bài 1.11, rồi viết báo cáo LAB 2 — hoàn tất <strong>270 phút</strong> và <strong>5%</strong> của Lab 2. Chú ý kế hoạch <strong>KHÔNG có buổi ôn tập nào</strong>: buổi 60 là LAB 2, và kỳ thi cuối 40% diễn ra sau đó, nên việc ôn tập là do chính bạn tự xếp lịch.',
    dEn: 'verify a physical law you were taught in session 11 with a component in your hand, and write a lab report that shows measured against predicted.',
    dVi: 'kiểm chứng được một định luật vật lý đã học ở buổi 11 bằng một linh kiện nằm trong tay, và viết được một báo cáo cho thấy số đo bên cạnh số dự đoán.' });

/* ════════════════════════════════════════════════════════════════════════════
 * QUIZ CỦA CÁC CHƯƠNG KHUNG — GIỮ NGUYÊN 8 slug cũ (sdi101m-quiz-1..8), đặt
 * vào chương khớp CHỦ ĐỀ của chúng, và viết lại thành song ngữ EN|||VI.
 * ══════════════════════════════════════════════════════════════════════════ */

const q4 = quiz('sdi101m-quiz-1', 'Quiz 2 — Crystals, bands & doping (22–26)|||Quiz 2 — Tinh thể, dải năng lượng & pha tạp (22–26)', [
  { id: 'q1', question: 'The dominant semiconductor of the IC industry is…|||Chất bán dẫn chủ đạo của ngành vi mạch là…',
    options: ['Copper (Cu)|||Đồng (Cu)', 'Silicon (Si)|||Silic (Si)', 'Gold (Au)|||Vàng (Au)', 'Glass|||Thuỷ tinh'],
    correctIndex: 1, points: 1,
    explanation: 'Si, a group-IV element with 4 valence electrons, wins on abundance and on having a stable native oxide (SiO2) — the insulator that makes the MOS gate possible.|||Si, nguyên tố nhóm IV với 4 electron hoá trị, thắng nhờ trữ lượng dồi dào và nhờ có lớp oxit tự nhiên bền (SiO2) — chính là lớp cách điện làm nên cực cổng MOS.' },
  { id: 'q2', question: 'The band gap Eg is…|||Khe cấm (band gap) Eg là…',
    options: ['the forbidden energy range between valence and conduction band|||khoảng năng lượng cấm giữa dải hoá trị và dải dẫn', 'the number of valence electrons|||số electron hoá trị', 'the resistance of the crystal|||điện trở của tinh thể', 'the distance between two atoms|||khoảng cách giữa hai nguyên tử'],
    correctIndex: 0, points: 1,
    explanation: 'Eg is the energy gap an electron must cross to become mobile: Si 1.12 eV, Ge 0.66 eV, GaAs 1.42 eV. At 300 K kT is only 0.0259 eV, about 43 times too small — which is why pure silicon barely conducts.|||Eg là khe năng lượng mà một electron phải vượt để trở nên di động: Si 1,12 eV, Ge 0,66 eV, GaAs 1,42 eV. Ở 300 K, kT chỉ là 0,0259 eV, nhỏ hơn khoảng 43 lần — và đó là lý do silic tinh khiết gần như không dẫn.' },
  { id: 'q3', question: 'A group-V donor (P, As) added to silicon gives…|||Tạp donor nhóm V (P, As) thêm vào silic cho…',
    options: ['p-type material|||vật liệu loại p', 'n-type material|||vật liệu loại n', 'intrinsic material|||vật liệu thuần', 'an insulator|||một chất cách điện'],
    correctIndex: 1, points: 1,
    explanation: 'Five valence electrons where four are needed leaves one loosely bound electron → n-type, electrons are the majority carriers. Group-III boron does the opposite and gives p-type.|||Năm electron hoá trị ở chỗ chỉ cần bốn thì còn lại một electron liên kết lỏng → loại n, electron là hạt tải đa số. Bo nhóm III làm điều ngược lại và cho loại p.' },
  { id: 'q4', question: 'Intrinsic silicon at 300 K has n = p = ni ≈ …|||Silic thuần ở 300 K có n = p = ni ≈ …',
    options: ['1.5 × 10^10 cm^-3|||1,5 × 10^10 cm⁻³', '1.5 × 10^16 cm^-3|||1,5 × 10^16 cm⁻³', '5 × 10^22 cm^-3|||5 × 10^22 cm⁻³', 'zero|||bằng không'],
    correctIndex: 0, points: 1,
    explanation: 'ni ≈ 1.5e10 cm^-3, against an atom density of about 5e22 cm^-3 — roughly one carrier per 3 × 10^12 atoms. Doping at 1e16 cm^-3 raises the carrier count by a million, which is the entire point of doping.|||ni ≈ 1,5e10 cm⁻³, so với mật độ nguyên tử khoảng 5e22 cm⁻³ — tức chừng một hạt tải trên 3 × 10¹² nguyên tử. Pha tạp ở mức 1e16 cm⁻³ nâng số hạt tải lên một triệu lần, và đó là toàn bộ mục đích của pha tạp.' },
], 360);

const q5a = quiz('sdi101m-quiz-2', 'Quiz 3 — Carriers & concentration (27)|||Quiz 3 — Hạt tải & nồng độ (27)', [
  { id: 'q1', question: 'In n-type material the majority carriers are…|||Trong vật liệu loại n, hạt tải đa số là…',
    options: ['holes|||lỗ trống', 'electrons|||electron', 'donor ions|||ion donor', 'protons|||proton'],
    correctIndex: 1, points: 1,
    explanation: 'Donors give extra electrons, so electrons are the majority and holes the minority. The donor ions themselves are fixed in the lattice and carry no current — they are the charge that forms the depletion region.|||Donor cho thêm electron, nên electron là đa số và lỗ trống là thiểu số. Bản thân các ion donor bị cố định trong mạng và không mang dòng — chúng là điện tích tạo nên vùng nghèo.' },
  { id: 'q2', question: 'The mass-action law at thermal equilibrium says…|||Định luật tác dụng khối ở cân bằng nhiệt nói…',
    options: ['n + p = ni|||n + p = ni', 'n · p = ni²|||n · p = ni²', 'n = p always|||n = p luôn luôn', 'n · p = 0|||n · p = 0'],
    correctIndex: 1, points: 1,
    explanation: 'n·p = ni² always holds at equilibrium, so raising one concentration by doping drives the other down. In n-type Si with ND = 1e16, p = ni²/ND ≈ 2.25e4 cm^-3 — twelve orders of magnitude below n.|||n·p = ni² luôn đúng ở cân bằng, nên pha tạp làm một nồng độ tăng thì nồng độ kia phải giảm. Trong Si loại n với ND = 1e16, p = ni²/ND ≈ 2,25e4 cm⁻³ — thấp hơn n mười hai bậc độ lớn.' },
  { id: 'q3', question: 'The Fermi level in n-type material sits…|||Mức Fermi trong vật liệu loại n nằm…',
    options: ['nearer the conduction band|||gần dải dẫn hơn', 'nearer the valence band|||gần dải hoá trị hơn', 'exactly mid-gap|||đúng giữa khe cấm', 'outside the gap|||ngoài khe cấm'],
    correctIndex: 0, points: 1,
    explanation: 'EF moves up towards the conduction band in n-type and down towards the valence band in p-type; it sits near mid-gap in intrinsic material. Where EF sits is exactly what makes the band diagram of a junction bend.|||EF dịch lên phía dải dẫn trong loại n và dịch xuống phía dải hoá trị trong loại p; nó nằm gần giữa khe cấm ở vật liệu thuần. Vị trí của EF chính là thứ làm sơ đồ dải của một chuyển tiếp bị uốn.' },
  { id: 'q4', question: 'Why does carrier concentration depend so strongly on temperature?|||Vì sao nồng độ hạt tải phụ thuộc mạnh vào nhiệt độ?',
    options: ['because mobility falls with T|||vì độ linh động giảm theo T', 'because thermal energy kT frees carriers across the gap, and it appears in an exponential|||vì năng lượng nhiệt kT giải phóng hạt tải qua khe cấm, và nó nằm trong một hàm mũ', 'because the lattice constant changes|||vì hằng số mạng thay đổi', 'it does not depend on temperature|||nó không phụ thuộc nhiệt độ'],
    correctIndex: 1, points: 1,
    explanation: 'Carrier generation across the gap goes as exp(−Eg/2kT), so a modest rise in T multiplies ni. That is why every semiconductor datasheet is quoted at a stated temperature and why leakage current roughly doubles every 10 °C.|||Sự sinh hạt tải qua khe cấm đi theo exp(−Eg/2kT), nên T tăng vừa phải là ni nhân lên nhiều lần. Đó là lý do mọi datasheet bán dẫn đều ghi kèm nhiệt độ, và là lý do dòng rò xấp xỉ gấp đôi mỗi 10 °C.' },
], 360);

const q5b = quiz('sdi101m-quiz-3', 'Quiz 4 — Drift, diffusion & light (28–30)|||Quiz 4 — Trôi, khuếch tán & quang (28–30)', [
  { id: 'q1', question: 'Drift current is caused by…|||Dòng trôi (drift) sinh ra do…',
    options: ['a concentration gradient|||chênh lệch nồng độ', 'an electric field acting on carriers|||điện trường tác dụng lên hạt tải', 'light|||ánh sáng', 'low temperature|||nhiệt độ thấp'],
    correctIndex: 1, points: 1,
    explanation: 'Drift: the field E gives a drift velocity v = μE, so J = q·n·μ·E. In lesson 1.3 the same field gave an acceleration of 8.79e18 m/s²; collisions with the lattice are what turn that into a modest steady drift velocity instead.|||Trôi: điện trường E cho vận tốc trôi v = μE, nên J = q·n·μ·E. Ở bài 1.3, cũng điện trường đó cho gia tốc 8,79e18 m/s²; chính va chạm với mạng biến nó thành một vận tốc trôi ổn định và khiêm tốn.' },
  { id: 'q2', question: 'Diffusion current is caused by…|||Dòng khuếch tán sinh ra do…',
    options: ['an electric field|||điện trường', 'a carrier concentration gradient|||chênh lệch (gradient) nồng độ hạt tải', 'a magnetic field|||từ trường', 'capacitance|||điện dung'],
    correctIndex: 1, points: 1,
    explanation: 'Carriers spread from dense to sparse with no field at all, like ink in water: J = q·D·dn/dx. The forward current of a diode is a diffusion current, which is why session 30 comes immediately before the p-n junction.|||Hạt tải lan từ nơi đậm sang nơi thưa mà không cần điện trường nào, như mực trong nước: J = q·D·dn/dx. Dòng thuận của một diode chính là dòng khuếch tán, và đó là lý do buổi 30 nằm ngay trước chuyển tiếp p-n.' },
  { id: 'q3', question: 'In silicon, electron mobility compared with hole mobility is…|||Trong silic, độ linh động của electron so với lỗ trống là…',
    options: ['smaller|||nhỏ hơn', 'equal|||bằng nhau', 'larger (about 1350 against 480 cm²/V·s)|||lớn hơn (khoảng 1350 so với 480 cm²/V·s)', 'zero|||bằng không'],
    correctIndex: 2, points: 1,
    explanation: 'μn ≈ 1350 > μp ≈ 480 cm²/(V·s). This single inequality is why NMOS is faster than PMOS and why a CMOS inverter is drawn with a wider PMOS (session 45).|||μn ≈ 1350 > μp ≈ 480 cm²/(V·s). Chỉ một bất đẳng thức đó là lý do NMOS nhanh hơn PMOS và là lý do cổng đảo CMOS được vẽ với PMOS rộng hơn (buổi 45).' },
  { id: 'q4', question: 'Silicon has Eg = 1.12 eV. A 1550 nm photon (0.80 eV) hitting it will…|||Silic có Eg = 1,12 eV. Một photon 1550 nm (0,80 eV) tới nó sẽ…',
    options: ['generate an electron-hole pair|||sinh một cặp electron–lỗ trống', 'pass through — silicon is transparent at that wavelength|||đi xuyên qua — silic trong suốt ở bước sóng đó', 'break the crystal|||phá vỡ tinh thể', 'be absorbed if the light is bright enough|||bị hấp thụ nếu ánh sáng đủ mạnh'],
    correctIndex: 1, points: 1,
    explanation: 'Below the gap nothing happens, at any intensity — brightness is the number of photons, not the energy of each. This is why fibre-optic detectors at 1550 nm are made of germanium or InGaAs, not silicon.|||Dưới khe cấm thì không có gì xảy ra, ở bất kỳ cường độ nào — độ sáng là số lượng photon, không phải năng lượng của từng photon. Đó là lý do đầu thu cáp quang ở 1550 nm làm bằng germani hay InGaAs, không phải silic.' },
], 360);

const q6 = quiz('sdi101m-quiz-4', 'Quiz 5 — The p-n junction (31–36)|||Quiz 5 — Chuyển tiếp p-n (31–36)', [
  { id: 'q1', question: 'The depletion region of a p-n junction is…|||Vùng nghèo của một chuyển tiếp p-n là…',
    options: ['full of mobile carriers|||đầy hạt tải di động', 'swept clear of mobile carriers, leaving fixed ions and a built-in field|||bị quét sạch hạt tải di động, để lại ion cố định và một điện trường nội', 'a metal layer|||một lớp kim loại', 'a perfect insulator at all biases|||một chất cách điện tuyệt đối ở mọi phân cực'],
    correctIndex: 1, points: 1,
    explanation: 'Carriers diffuse across and recombine, leaving the fixed ionised dopants behind. Gauss law on that fixed charge gives the triangular field profile and a built-in potential of about 0.7 V for silicon — the calculation done in lesson 1.4.|||Hạt tải khuếch tán qua và tái hợp, để lại các ion tạp cố định. Áp định luật Gauss lên điện tích cố định đó cho dạng điện trường tam giác và một điện thế nội khoảng 0,7 V với silic — đúng phép tính đã làm ở bài 1.4.' },
  { id: 'q2', question: 'A silicon diode conducts strongly when it is…|||Một diode silic dẫn mạnh khi nó được…',
    options: ['reverse biased|||phân cực nghịch', 'forward biased, above roughly 0.7 V|||phân cực thuận, trên khoảng 0,7 V', 'unbiased|||không phân cực', 'used only with AC|||chỉ dùng với dòng xoay chiều'],
    correctIndex: 1, points: 1,
    explanation: 'Forward bias lowers the barrier, and current rises exponentially: I = IS(e^(V/nVT) − 1) with VT = 25.9 mV, i.e. about a decade of current per 60 mV. "0.7 V turn-on" is a convenient description, not a true threshold.|||Phân cực thuận hạ rào thế, và dòng tăng theo hàm mũ: I = IS(e^(V/nVT) − 1) với VT = 25,9 mV, tức chừng mười lần dòng mỗi 60 mV. "Mở ở 0,7 V" chỉ là cách nói tiện, không phải một ngưỡng thật.' },
  { id: 'q3', question: 'Under reverse bias, the diode current is approximately…|||Khi phân cực nghịch, dòng qua diode xấp xỉ…',
    options: ['exponentially rising|||tăng theo hàm mũ', 'a small saturation current IS|||một dòng bão hoà nhỏ IS', 'infinite|||vô cùng', 'V/R|||V/R'],
    correctIndex: 1, points: 1,
    explanation: 'I ≈ −IS, tiny and almost independent of voltage — until breakdown. IS grows quickly with temperature, which is why reverse leakage roughly doubles every 10 °C.|||I ≈ −IS, rất nhỏ và gần như không phụ thuộc điện áp — cho tới khi đánh thủng. IS tăng nhanh theo nhiệt độ, và đó là lý do dòng rò nghịch xấp xỉ gấp đôi mỗi 10 °C.' },
  { id: 'q4', question: 'Doping both sides of a junction more heavily makes the depletion region…|||Pha tạp đậm hơn ở cả hai phía của chuyển tiếp làm vùng nghèo…',
    options: ['wider, with a weaker field|||rộng hơn, điện trường yếu hơn', 'narrower, with a stronger field|||hẹp hơn, điện trường mạnh hơn', 'unchanged|||không đổi', 'disappear|||biến mất'],
    correctIndex: 1, points: 1,
    explanation: 'More fixed charge per unit volume means Gauss law reaches the same potential over a shorter distance: W shrinks and Emax grows. Push far enough and the field reaches breakdown — that is a Zener diode, and lesson 1.4 exercise E1 computed exactly this effect.|||Nhiều điện tích cố định trên một đơn vị thể tích hơn nghĩa là định luật Gauss đạt cùng điện thế đó trên một khoảng ngắn hơn: W hẹp lại và Emax lớn lên. Đẩy đủ xa thì điện trường đạt ngưỡng đánh thủng — đó là diode Zener, và bài tập B1 của bài 1.4 đã tính đúng hiệu ứng này.' },
], 360);

const q7a = quiz('sdi101m-quiz-6', 'Quiz 6 — The BJT (41–42)|||Quiz 6 — Transistor lưỡng cực BJT (41–42)', [
  { id: 'q1', question: 'The three terminals of a BJT are…|||Ba cực của một BJT là…',
    options: ['Gate, Source, Drain|||Gate, Source, Drain', 'Emitter, Base, Collector|||Emitter, Base, Collector', 'Anode, Cathode, Gate|||Anode, Cathode, Gate', 'P, N, I|||P, N, I'],
    correctIndex: 1, points: 1,
    explanation: 'Emitter, Base, Collector — three doped regions and therefore two p-n junctions. Gate/Source/Drain belongs to a FET, which is voltage-controlled instead.|||Emitter, Base, Collector — ba vùng pha tạp và do đó hai chuyển tiếp p-n. Gate/Source/Drain là của FET, loại điều khiển bằng điện áp.' },
  { id: 'q2', question: 'In the active region, the BJT current relation is…|||Ở vùng active, quan hệ dòng của BJT là…',
    options: ['IB = β · IC|||IB = β · IC', 'IC = β · IB|||IC = β · IB', 'IC = 0|||IC = 0', 'IC = IE − 2·IB|||IC = IE − 2·IB'],
    correctIndex: 1, points: 1,
    explanation: 'A small base current controls a much larger collector current: IC = β·IB with β typically 50–300, and IE = IB + IC. This is current control — unlike the MOSFET, whose gate draws almost nothing.|||Một dòng base nhỏ điều khiển dòng collector lớn hơn nhiều: IC = β·IB với β thường 50–300, và IE = IB + IC. Đây là điều khiển bằng dòng — khác MOSFET, loại mà cực cổng gần như không lấy dòng.' },
  { id: 'q3', question: 'A BJT acts as a closed switch in which region?|||BJT hoạt động như một khoá ĐÓNG ở vùng nào?',
    options: ['Cut-off|||Cut-off (tắt)', 'Active|||Active (khuếch đại)', 'Saturation|||Saturation (bão hoà)', 'Breakdown|||Breakdown (đánh thủng)'],
    correctIndex: 2, points: 1,
    explanation: 'Saturation: both junctions forward biased, so the device conducts hard with a small VCE. Cut-off is the open switch; active is the amplifier.|||Bão hoà (saturation): cả hai chuyển tiếp phân cực thuận, nên linh kiện dẫn mạnh với VCE nhỏ. Cut-off là khoá hở; active là mạch khuếch đại.' },
  { id: 'q4', question: 'Why must the base of a BJT be thin and lightly doped?|||Vì sao vùng base của BJT phải mỏng và pha tạp nhẹ?',
    options: ['to reduce its cost|||để giảm giá thành', 'so most injected carriers cross it to the collector instead of recombining|||để phần lớn hạt tải phun vào vượt qua nó sang collector thay vì tái hợp', 'to make it mechanically strong|||để nó bền về cơ học', 'to raise the breakdown voltage|||để nâng điện áp đánh thủng'],
    correctIndex: 1, points: 1,
    explanation: 'Transistor action IS that survival: carriers injected from the emitter must reach the collector. A thick or heavily doped base recombines them, β collapses, and the device stops amplifying.|||Chính sự "sống sót" đó là nguyên lý transistor: hạt tải phun từ emitter phải tới được collector. Base dày hay pha tạp đậm sẽ làm chúng tái hợp, β sụp, và linh kiện không khuếch đại được nữa.' },
], 360);

const q7b = quiz('sdi101m-quiz-7', 'Quiz 7 — The MOSFET (37–40)|||Quiz 7 — Transistor MOSFET (37–40)', [
  { id: 'q1', question: 'A MOSFET is controlled mainly by…|||MOSFET được điều khiển chủ yếu bằng…',
    options: ['a large gate current|||một dòng cổng lớn', 'the gate voltage, with almost no gate current|||điện áp cổng, gần như không lấy dòng cổng', 'light|||ánh sáng', 'temperature|||nhiệt độ'],
    correctIndex: 1, points: 1,
    explanation: 'The gate sits on an insulating oxide, so it is a capacitor: control is by voltage and the DC gate current is essentially zero. That is why CMOS logic dissipates almost no static power.|||Cực cổng nằm trên một lớp oxit cách điện, nên nó là một tụ điện: điều khiển bằng điện áp và dòng cổng một chiều gần như bằng không. Đó là lý do logic CMOS gần như không tiêu tán công suất tĩnh.' },
  { id: 'q2', question: 'The channel of an enhancement NMOS forms when…|||Kênh dẫn của NMOS tăng cường hình thành khi…',
    options: ['VGS < 0|||VGS < 0', 'VGS exceeds the threshold voltage Vth|||VGS vượt điện áp ngưỡng Vth', 'VDS = 0|||VDS = 0', 'no voltage is needed|||không cần điện áp nào'],
    correctIndex: 1, points: 1,
    explanation: 'Above Vth the gate inverts the surface and a conducting channel links source to drain; below Vth the device is off (though subthreshold leakage never quite reaches zero).|||Trên Vth, cực cổng đảo bề mặt và một kênh dẫn nối source với drain; dưới Vth linh kiện tắt (dù dòng rò dưới ngưỡng không bao giờ về hẳn không).' },
  { id: 'q3', question: 'In saturation, the drain current of a MOSFET goes as…|||Ở vùng bão hoà, dòng máng của MOSFET đi theo…',
    options: ['(VGS − Vth)|||(VGS − Vth)', '(VGS − Vth)²|||(VGS − Vth)²', 'exp(VGS/VT)|||exp(VGS/VT)', 'VDS/R|||VDS/R'],
    correctIndex: 1, points: 1,
    explanation: 'ID = ½·μ·Cox′·(W/L)·(VGS − Vth)², so the current is set by the gate overdrive and by the aspect ratio W/L, and barely by VDS. Note Cox′ = εox/tox, the capacitance you computed in lesson 1.6.|||ID = ½·μ·Cox′·(W/L)·(VGS − Vth)², nên dòng do mức vượt ngưỡng ở cổng và tỷ số W/L quyết định, và gần như không do VDS. Chú ý Cox′ = εox/tox, chính điện dung bạn đã tính ở bài 1.6.' },
  { id: 'q4', question: 'Why did supply voltages fall from 5 V towards about 1 V as transistors shrank?|||Vì sao điện áp nguồn tụt từ 5 V xuống khoảng 1 V khi transistor thu nhỏ?',
    options: ['to save battery life only|||chỉ để tiết kiệm pin', 'because a thinner oxide would break down at the old voltage|||vì lớp oxit mỏng hơn sẽ bị đánh thủng ở điện áp cũ', 'because Vth rose|||vì Vth tăng lên', 'because mobility rose|||vì độ linh động tăng lên'],
    correctIndex: 1, points: 1,
    explanation: 'Lesson 1.3 exercise E2 computed it: 2 V across a 2 nm oxide is 10 MV/cm, roughly the breakdown field of SiO2. Thinner oxide forces lower voltage — and lower voltage also cuts the ½CV² switching energy, which is the second reason.|||Bài tập B2 của bài 1.3 đã tính ra: 2 V trên một lớp oxit 2 nm là 10 MV/cm, xấp xỉ điện trường đánh thủng của SiO2. Oxit mỏng hơn buộc điện áp phải thấp hơn — và điện áp thấp hơn cũng cắt bớt năng lượng chuyển mạch ½CV², đó là lý do thứ hai.' },
], 360);

const q8 = quiz('sdi101m-quiz-5', 'Quiz 8 — Optoelectronics & CMOS (43–46)|||Quiz 8 — Linh kiện quang & CMOS (43–46)', [
  { id: 'q1', question: 'A Zener diode is normally used for…|||Diode Zener thường được dùng để…',
    options: ['emitting light|||phát sáng', 'voltage regulation, working in reverse breakdown at a fixed voltage|||ổn áp, làm việc ở vùng đánh thủng nghịch tại một điện áp cố định', 'amplification|||khuếch đại', 'sensing light|||cảm biến ánh sáng'],
    correctIndex: 1, points: 1,
    explanation: 'Its reverse breakdown voltage is sharp and stable, so it clamps a node to that value. Heavy doping puts breakdown at a low voltage by tunnelling; lighter doping gives avalanche breakdown at a higher one.|||Điện áp đánh thủng nghịch của nó dứt khoát và ổn định, nên nó ghim một nút vào đúng giá trị đó. Pha tạp đậm đưa đánh thủng xuống điện áp thấp bằng xuyên hầm; pha tạp nhạt hơn cho đánh thủng thác lũ ở điện áp cao hơn.' },
  { id: 'q2', question: 'An LED emits light by…|||LED phát sáng nhờ…',
    options: ['resistive heating|||hiệu ứng toả nhiệt của điện trở', 'electron-hole recombination at a forward-biased junction|||tái hợp electron–lỗ trống ở chuyển tiếp phân cực thuận', 'incoming light generating current|||ánh sáng tới sinh ra dòng', 'reverse breakdown|||đánh thủng nghịch'],
    correctIndex: 1, points: 1,
    explanation: 'Recombination across the gap emits a photon of energy about Eg, so the colour follows λ = 1240/Eg: 1.9 eV gives 653 nm red, 2.7 eV gives 459 nm blue. Silicon has an indirect gap and cannot do this efficiently at any doping.|||Tái hợp qua khe cấm phát ra một photon năng lượng cỡ Eg, nên màu đi theo λ = 1240/Eg: 1,9 eV cho đỏ 653 nm, 2,7 eV cho lam 459 nm. Silic có khe cấm gián tiếp và không làm được việc này hiệu quả ở bất kỳ mức pha tạp nào.' },
  { id: 'q3', question: 'Why is CMOS used for essentially all digital chips?|||Vì sao CMOS được dùng cho gần như mọi chip số?',
    options: ['it has the highest gain|||vì nó khuếch đại mạnh nhất', 'it dissipates almost no static power|||vì nó gần như không tiêu tán công suất tĩnh', 'it emits light|||vì nó phát sáng', 'it tolerates high voltage|||vì nó chịu điện áp cao'],
    correctIndex: 1, points: 1,
    explanation: 'In a complementary pair one device is off in either logic state, so no DC path exists from supply to ground; current flows mainly during a transition, costing about ½CV² per switch.|||Trong một cặp bù, ở mỗi trạng thái logic luôn có một linh kiện tắt, nên không có đường một chiều nào từ nguồn xuống đất; dòng chủ yếu chỉ chảy trong lúc chuyển trạng thái, tốn chừng ½CV² mỗi lần.' },
  { id: 'q4', question: 'Why did lithography move from 193 nm to 13.5 nm light?|||Vì sao quang khắc phải chuyển từ ánh sáng 193 nm sang 13,5 nm?',
    options: ['because it is cheaper|||vì nó rẻ hơn', 'because you cannot print features much finer than the wavelength|||vì không in được chi tiết nhỏ hơn bước sóng bao nhiêu', 'because silicon absorbs 193 nm|||vì silic hấp thụ 193 nm', 'to reduce photon energy|||để giảm năng lượng photon'],
    correctIndex: 1, points: 1,
    explanation: 'Resolution is set by wavelength, so smaller features need shorter light. The price is photon energy: 1240/193 = 6.42 eV becomes 1240/13.5 = 91.9 eV, which air, glass and ordinary resist all absorb — hence vacuum and mirrors.|||Độ phân giải do bước sóng quyết định, nên chi tiết nhỏ hơn thì cần ánh sáng ngắn hơn. Cái giá là năng lượng photon: 1240/193 = 6,42 eV thành 1240/13,5 = 91,9 eV, mà không khí, thuỷ tinh và chất cản quang thường đều hấp thụ — nên phải chân không và phải dùng gương.' },
], 360);

const q9 = quiz('sdi101m-quiz-8', 'Quiz 9 — ICs, memory & AI chips (47–50)|||Quiz 9 — IC, bộ nhớ & chip AI (47–50)', [
  { id: 'q1', question: 'Moore\'s law states that…|||Định luật Moore phát biểu rằng…',
    options: ['voltage halves every year|||điện áp giảm một nửa mỗi năm', 'the number of transistors on a chip roughly doubles about every two years|||số transistor trên một chip xấp xỉ gấp đôi khoảng mỗi hai năm', 'clock speed doubles every year|||tốc độ xung nhịp gấp đôi mỗi năm', 'the band gap shrinks with each node|||khe cấm hẹp lại theo mỗi thế hệ công nghệ'],
    correctIndex: 1, points: 1,
    explanation: 'It is an observation about transistor count, not about speed and not a law of physics. Clock speed stopped following it around 2005, when power density became the binding constraint.|||Đó là một quan sát về SỐ LƯỢNG transistor, không phải về tốc độ, và không phải một định luật vật lý. Tốc độ xung nhịp thôi đi theo nó từ khoảng 2005, khi mật độ công suất trở thành ràng buộc chi phối.' },
  { id: 'q2', question: 'Why must DRAM be refreshed?|||Vì sao DRAM phải được làm mới (refresh)?',
    options: ['because its transistors wear out|||vì transistor của nó bị mòn', 'because the charge stored on its cell capacitor leaks away|||vì điện tích lưu trên tụ của ô nhớ bị rò đi', 'because it is non-volatile|||vì nó là bộ nhớ bất khả biến', 'because the bit line is too long|||vì đường bit quá dài'],
    correctIndex: 1, points: 1,
    explanation: 'A DRAM bit is a small charge on a tiny capacitor — of the order of 10^5 electrons, as computed in lesson 1.6 — and leakage removes it in milliseconds, so it must be read back and rewritten. SRAM holds its state actively with six transistors and needs no refresh.|||Một bit DRAM là một lượng điện tích nhỏ trên một cái tụ bé — cỡ 10⁵ electron, như đã tính ở bài 1.6 — và dòng rò lấy nó đi trong vài milligiây, nên phải đọc lại rồi ghi lại. SRAM giữ trạng thái một cách chủ động bằng sáu transistor và không cần làm mới.' },
  { id: 'q3', question: 'In wafer fabrication, the step that transfers the circuit pattern using light is…|||Trong chế tạo wafer, bước in hình mẫu mạch bằng ánh sáng là…',
    options: ['oxidation|||oxy hoá', 'photolithography|||quang khắc', 'packaging|||đóng gói', 'ion implantation|||cấy ion'],
    correctIndex: 1, points: 1,
    explanation: 'Photolithography exposes a photoresist through a mask; etching and implantation then act only where the resist was opened. It is repeated for every layer, and it is the step whose wavelength sets the minimum feature size.|||Quang khắc chiếu sáng một lớp cản quang qua một mặt nạ; ăn mòn và cấy ion sau đó chỉ tác dụng ở chỗ lớp cản quang đã mở. Nó được lặp lại cho mọi lớp, và là bước mà bước sóng của nó đặt ra kích thước chi tiết nhỏ nhất.' },
  { id: 'q4', question: 'The "memory wall" in AI chips means…|||"Bức tường bộ nhớ" trong chip AI nghĩa là…',
    options: ['memory chips are physically taller|||chip nhớ cao hơn về vật lý', 'moving data now costs more time and energy than computing on it|||di chuyển dữ liệu giờ tốn nhiều thời gian và năng lượng hơn tính toán trên nó', 'memory has run out of addresses|||bộ nhớ đã hết địa chỉ', 'DRAM cannot be stacked|||DRAM không xếp lớp được'],
    correctIndex: 1, points: 1,
    explanation: 'Arithmetic got cheap while data movement did not: every long wire costs the ½CV² of lesson 1.6 on each transition. HBM, 3D stacking and in-memory computing all exist to shorten that distance.|||Phép tính thành rẻ trong khi việc di chuyển dữ liệu thì không: mỗi đường dây dài phải trả ½CV² của bài 1.6 cho mỗi lần chuyển trạng thái. HBM, xếp lớp 3D và tính toán trong bộ nhớ đều tồn tại để làm ngắn khoảng cách đó.' },
], 360);

/* ═══════════════════════════════ EXPORT ═══════════════════════════════════ */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'SDI101m',
    slug: 'sdi101m-introduction-to-semiconductor-devices',
    title: 'Introduction to Semiconductor Devices',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SDI101m.webp',
    shortDescription: 'Introduction to Semiconductor Devices on FLM syllabus 12239: all 60 sessions, 4 CLOs, 7 marks, 3 main textbooks. Chapter 1 (sessions 1-11, electromagnetism) fully taught with checked worked numbers; chapters 2-11 are the framework.|||Nhập môn thiết bị bán dẫn theo syllabus FLM 12239: đủ 60 buổi, 4 CLO, 7 đầu điểm, 3 giáo trình chính. Chương 1 (buổi 1-11, vật lý điện từ) giảng đầy đủ, mọi phép tính đã kiểm; chương 2-11 là khung.',
    description: 'Môn <strong>SDI101m — Introduction to Semiconductor Devices</strong> (Nhập môn thiết bị bán dẫn) là môn nhập môn của ngành <strong>Thiết kế vi mạch bán dẫn</strong>, kỳ 1, 3 tín chỉ, 60 buổi. Web dựng lại môn này bám <strong>syllabus FLM 12239</strong> (QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024). ⚠️ Môn chia <strong>HAI NỬA rõ rệt</strong>: buổi <strong>1–21 là vật lý điện từ</strong> (CLO1, CLO2) và buổi <strong>22–60 là vật lý bán dẫn &amp; linh kiện</strong> (CLO3, CLO4). <strong>Mục 0</strong> là khung chuẩn của trường — hồ sơ môn, bảy đầu điểm (Assignment 1 10% · Assignment 2 10% · Lab 1 5% · Lab 2 5% · Progress test 1 15% · Progress test 2 15% · Final exam 40% = 100%), bốn CLO nguyên văn, bốn tài liệu (BA trong đó là giáo trình CHÍNH: Streetman &amp; Banerjee cộng hai khoá KAIST trên Coursera), và bảng đủ <strong>60 buổi</strong> để bạn đối chiếu với bản trường phát. <strong>Chương 1 (buổi 1–11)</strong> đã giảng đầy đủ song ngữ: đo lường &amp; đơn vị SI, Coulomb, điện trường, Gauss, điện thế, điện dung, dòng điện &amp; điện trở, mạch điện, từ trường, điện cảm &amp; RLC, sóng điện từ — mọi phép tính đã tự kiểm bằng python3. <strong>Chương 2–11</strong> hiện là KHUNG: đúng tên bài, đúng buổi, đúng CLO — nội dung chi tiết bổ sung dần.',
    whatYouLearn: 'Khung môn theo FLM: đọc hiểu syllabus 12239, bảy đầu điểm và trọng số, bốn CLO và buổi nào gánh CLO nào, quy định dự ≥80% buổi, kế hoạch đủ 60 buổi, và các chỗ syllabus gốc bất thường (Assignment 2 gắn CLO2 nhưng xếp ở buổi 51–53; hai Progress Test lệch CLO giữa hai bảng; ô Tools và ô tiên quyết để trống). Chương 1 (ĐẦY ĐỦ): đơn vị SI &amp; bẫy cm↔m, định luật Coulomb và vai trò hằng số điện môi, điện trường và trường trong lớp oxit 2 nm, định luật Gauss dùng để suy ra 0,7 V của chuyển tiếp p-n, điện thế và điện áp nhiệt 25,9 mV, điện dung và cực cổng MOS (17,3 fF trên 1 µm²), dòng điện &amp; điện trở với σ = q·n·μ, mạch điện và hằng số thời gian RC, từ trường và hiệu ứng Hall, điện cảm và cộng hưởng RLC (5,03 kHz), sóng điện từ với λ = 1240/Eg. Khung chương 2–11: Assignment 1 &amp; Progress Test 1, LAB 1 mạch RLC, tinh thể &amp; dải năng lượng, hạt tải &amp; khuếch tán, chuyển tiếp p-n, JFET/MOSFET/BJT, linh kiện quang &amp; CMOS, IC/bộ nhớ/chip AI, Assignment 2 &amp; Progress Test 2, LAB 2.',
    requirements: 'Ô Pre-Requisite trên FLM để TRỐNG — trường không công bố môn tiên quyết (và KHÔNG ghi "None"). Web dạy Chương 1 với giả định bạn chỉ có vật lý phổ thông: cần toán phổ thông (số mũ, căn, logarit, đạo hàm cơ bản) và một máy tính tay. Ô Tools của syllabus cũng để TRỐNG — trường không công bố công cụ hay phần mềm nào cho môn này dù có hai khối LAB; hãy hỏi giảng viên ở buổi 1. Về tài liệu: hai trong ba giáo trình chính là khoá Coursera của KAIST, học (audit) miễn phí, chỉ trả tiền nếu muốn lấy chứng chỉ.',
  },
  sections: [
    { title: '📚 Resource hub — the 4 FLM materials & free tools|||📚 Trung tâm tài liệu — 4 giáo trình FLM & công cụ miễn phí',
      description: 'Bốn tài liệu FLM dạng thẻ bấm được (BA là giáo trình chính), cộng mô phỏng nanoHUB/Falstad/PhET, bảng hằng số Ioffe & NIST, MIT OCW và lộ trình tự học do web gom thêm.',
      lessons: [taiLieu] },
    { title: 'Section 0 — Course framework from the FLM syllabus|||Mục 0 — Khung môn học theo syllabus FLM',
      description: 'Khung chuẩn 100% theo syllabus FLM 12239: hồ sơ môn (45h/60 buổi + 1h thi + 104h tự học), 7 đầu điểm (10+10+5+5+15+15+40 = 100%), 4 CLO, 4 tài liệu (3 chính) & ô Tools trống, kế hoạch đủ 60 buổi, nhiệm vụ sinh viên.',
      lessons: [l01, l02, l03, l04, l05, l06, q0] },
    { title: 'Chapter 1 — Electromagnetism (sessions 1–11)|||Chương 1 — Vật lý điện từ (buổi 1–11)',
      description: 'ĐẦY ĐỦ. Toàn bộ nửa điện từ của môn: đo lường & SI, Coulomb, điện trường, Gauss, điện thế, điện dung, dòng điện & điện trở, mạch điện, từ trường & Hall, điện cảm & RLC, sóng điện từ. Mọi phép tính đã kiểm bằng python3.',
      lessons: [l11, l12, l13, l14, l15, l16, l17, l18, l19, l110, l111, c1q] },
    { title: 'Chapter 2 — Assignment 1 & Progress Test 1 (sessions 12–15)|||Chương 2 — Assignment 1 & Progress Test 1 (buổi 12–15)',
      description: 'KHUNG. Assignment 1 (buổi 12–14, 135 phút, 10%) và Progress Test 1 (buổi 15, 45 phút, 30 câu, 15%) — cộng lại 25% điểm môn, chốt trước khi nửa bán dẫn bắt đầu.',
      lessons: [k21, k22] },
    { title: 'Chapter 3 — LAB 1: RLC circuits (sessions 16–21)|||Chương 3 — LAB 1: mạch RLC (buổi 16–21)',
      description: 'KHUNG. Sáu buổi liền, 270 phút, 5% — và là khối duy nhất dạy CLO2 (thực hành mạch RLC + an toàn điện): an toàn & dụng cụ, RC/RL và hằng số thời gian, cộng hưởng RLC & báo cáo.',
      lessons: [k31, k32, k33] },
    { title: 'Chapter 4 — Semiconductors, crystals & bands (sessions 22–26)|||Chương 4 — Nhập môn bán dẫn, tinh thể & dải năng lượng (buổi 22–26)',
      description: 'KHUNG. Nửa sau của môn bắt đầu: tổng quan & lịch sử ngành, tính chất tinh thể, nguyên tử & Schrödinger, dải năng lượng và khe cấm, bán dẫn thuần vs pha tạp.',
      lessons: [k41, k42, k43, k44, k45, q4] },
    { title: 'Chapter 5 — Charge carriers (sessions 27–30)|||Chương 5 — Hạt tải điện (buổi 27–30)',
      description: 'KHUNG. Nồng độ hạt tải & mức Fermi, sự trôi trong điện trường và từ trường (Hall), hấp thụ quang & phát quang, khuếch tán và hệ thức Einstein.',
      lessons: [k51, k52, k53, k54, q5a, q5b] },
    { title: 'Chapter 6 — The p-n junction (sessions 31–36)|||Chương 6 — Chuyển tiếp p-n (buổi 31–36)',
      description: 'KHUNG. Bản lề của cả môn: chuyển tiếp p-n và điện thế nội, tĩnh điện & bề rộng vùng nghèo, dòng thuận/nghịch và Shockley (hai buổi), điện dung chuyển tiếp & chế tạo, chuyển tiếp kim loại–bán dẫn.',
      lessons: [k61, k62, k63, k64, k65, k66, q6] },
    { title: 'Chapter 7 — Transistors: JFET, MOSFET, BJT (sessions 37–42)|||Chương 7 — Transistor: JFET, MOSFET, BJT (buổi 37–42)',
      description: 'KHUNG. Nguyên lý transistor & JFET, MOSFET ba buổi (tụ MOS, đặc tuyến I–V, thu nhỏ & kênh ngắn), BJT hai buổi (cấu tạo & nguyên lý, khuếch đại & tần số).',
      lessons: [k71, k72, k73, k74, k75, k76, q7b, q7a] },
    { title: 'Chapter 8 — Optoelectronics & CMOS (sessions 43–46)|||Chương 8 — Linh kiện quang & CMOS (buổi 43–46)',
      description: 'KHUNG. Photodiode & pin mặt trời, LED & laser diode (λ = 1240/Eg), cổng đảo CMOS & logic tĩnh, dòng công nghệ chế tạo CMOS và quang khắc DUV/EUV.',
      lessons: [k81, k82, k83, k84, q8] },
    { title: 'Chapter 9 — ICs, memory & AI chips (sessions 47–50)|||Chương 9 — IC, bộ nhớ & chip AI (buổi 47–50)',
      description: 'KHUNG. Từ linh kiện tới mạch tích hợp & định luật Moore, bộ nhớ SRAM/DRAM/flash, rồi hai buổi chip AI: vì sao CPU không đủ, và HBM/đóng gói tiên tiến/bức tường bộ nhớ.',
      lessons: [k91, k92, k93, k94, q9] },
    { title: 'Chapter 10 — Assignment 2 & Progress Test 2 (sessions 51–54)|||Chương 10 — Assignment 2 & Progress Test 2 (buổi 51–54)',
      description: 'KHUNG. Assignment 2 (buổi 51–53, 10%) — kèm chỗ lệch CLO phải đi hỏi giảng viên — và Progress Test 2 (buổi 54, 45 phút, 30 câu, 15%).',
      lessons: [k101, k102] },
    { title: 'Chapter 11 — LAB 2: semiconductors (sessions 55–60)|||Chương 11 — LAB 2: bán dẫn (buổi 55–60)',
      description: 'KHUNG. Sáu buổi cuối của môn, 270 phút, 5% — khối duy nhất dạy CLO4 (quan sát & kiểm chứng đặc tuyến): đặc tuyến diode, đặc tuyến transistor, linh kiện cảm quang & báo cáo.',
      lessons: [k111, k112, k113] },
  ],
};
