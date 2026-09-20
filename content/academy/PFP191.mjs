/**
 * PFP191 — Programming Fundamentals with Python (Cơ sở lập trình với Python).
 * Kỳ 1, ngành IT/AI, 3 tín chỉ, 60 buổi.
 * ─────────────────────────────────────────────────────────────────────────────
 * KHUNG BÁM 100% SYLLABUS FLM 12224 (QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024, thu
 * 19/09/2026 từ flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=12224):
 *   Mục 0    = hồ sơ môn + 5 đầu điểm + 7 CLO + 4 giáo trình/công cụ +
 *              đủ 60 buổi + nhiệm vụ SV.  ← ĐẦY ĐỦ, chính xác từng con số.
 *   Chương 1 = buổi 1–9 (PY4E ch.1 + ch.2 + Lab 1). ← ĐẦY ĐỦ, dạy được ngay.
 *   Chương 2–10 = KHUNG: đúng tên chương, đúng tên bài, đúng buổi/CLO/mục PY4E,
 *              mỗi bài 4 dòng mốc nội dung. Bài giảng chi tiết bổ sung sau.
 *
 * CÁCH BỔ SUNG NỘI DUNG SAU NÀY: một bài khung là một lời gọi khung(...).
 * Thay lời gọi đó bằng doc(slug, title, desc, [[ '…EN…', '…VI…' ]]) — GIỮ
 * NGUYÊN slug và vị trí trong section là xong; không phải dựng lại cấu trúc.
 *
 * QUY TẮC TÁCH NGUỒN: mọi thứ của trường có <p class="nhan">Nguồn: FLM…</p>;
 * mọi thứ web tự thêm nằm trong <div class="note-ct">. Ô trống của syllabus ghi
 * "trường không công bố" — KHÔNG đoán.
 *
 * ⚠️ Giữ NGUYÊN 24 slug cũ (sinh viên đã lưu link) — xem cột "slug cũ" dưới.
 * ⚠️ title ≤255 ký tự tính CẢ hai vế EN|||VI. course.shortDescription ≤500.
 * ⚠️ Trong chuỗi: KHÔNG backtick lồng, KHÔNG ${ }; "\n" của Python viết \\n;
 *    code escape &lt; &gt; &amp;. Mọi <pre><code> phải có class language-python.
 * ⚠️ MỌI đoạn Python của Chương 1 đã chạy thật bằng python3 (3.14, macOS);
 *    output trong khối .out là output THẬT đã bắt lại, không đoán.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PFP191.mjs --apply
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions, timeLimitSeconds = 480) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds, questions } });

const NGUON = 'Nguồn: FLM · Syllabus 12224 · QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024';

/**
 * Bài KHUNG (chương 2 → hết). m = {
 *   s: '10' | '18–19'   số buổi FLM
 *   clo: 'CLO3', itu: 'IT'
 *   flm: chủ đề buổi NGUYÊN VĂN tiếng Anh của FLM
 *   py4e: mục trong sách Python for Everybody
 *   hEn/hVi: tiêu đề bài · lEn/lVi: học gì · dEn/dVi: sau buổi làm được gì
 * }
 * Cố tình KHÔNG dùng template literal lồng ở đây (luật: không ${ } trong chuỗi).
 */
const khung = (slug, title, desc, m) => doc(slug, title, desc, [[
  '<span class="eyebrow">PFP191 · Session ' + m.s + ' · ' + m.clo + '</span>\n'
  + '<h2>' + m.hEn + '</h2>\n'
  + '<p class="lead">Framework page. The session number, the outcome and the textbook sections below are fixed from the FLM syllabus; the full teaching text, runnable Python and exercises are being written.</p>\n'
  + '<p class="nhan">' + NGUON + ' · buổi ' + m.s + ' — "' + m.flm + '"</p>\n'
  + '<ul>\n'
  + '<li><strong>Session</strong> ' + m.s + ' · <strong>' + m.clo + '</strong> · ITU <span class="badge">' + m.itu + '</span> — as published by FLM.</li>\n'
  + '<li><strong>Textbook</strong> — Python for Everybody, ' + m.py4e + '.</li>\n'
  + '<li><strong>What this session covers</strong> — ' + m.lEn + '</li>\n'
  + '<li><strong>What you can do afterwards</strong> — ' + m.dEn + '</li>\n'
  + '</ul>\n'
  + '<div class="note-ct">This page is a <strong>framework</strong> for now — that is deliberate, not an accident. What is already correct and will not move: the session number, the CLO, the ITU level and the textbook sections. What comes later: the explanation, the runnable programs, the traps and the exercises. <strong>Chapter 1 is finished</strong> — open it to see what a completed lesson on this site looks like.</div>',
  '<span class="eyebrow">PFP191 · Buổi ' + m.s + ' · ' + m.clo + '</span>\n'
  + '<h2>' + m.hVi + '</h2>\n'
  + '<p class="lead">Bài khung. Số buổi, chuẩn đầu ra và mục giáo trình dưới đây đã chốt theo syllabus FLM; phần giảng chi tiết, code Python chạy được và bài tập sẽ bổ sung sau.</p>\n'
  + '<p class="nhan">' + NGUON + ' · buổi ' + m.s + ' — "' + m.flm + '"</p>\n'
  + '<ul>\n'
  + '<li><strong>Buổi</strong> ' + m.s + ' · <strong>' + m.clo + '</strong> · mức ITU <span class="badge">' + m.itu + '</span> — theo đúng bản trường công bố.</li>\n'
  + '<li><strong>Giáo trình</strong> — Python for Everybody, ' + m.py4e + '.</li>\n'
  + '<li><strong>Buổi này học gì</strong> — ' + m.lVi + '</li>\n'
  + '<li><strong>Học xong làm được gì</strong> — ' + m.dVi + '</li>\n'
  + '</ul>\n'
  + '<div class="note-ct">Bài này đang là <strong>khung</strong> — có chủ đích, không phải bỏ sót. Phần đã đúng và sẽ không đổi: số buổi, CLO, mức ITU, mục giáo trình. Phần bổ sung sau: lời giảng, chương trình chạy được, bẫy thường gặp, bài tập. <strong>Chương 1 đã viết xong đầy đủ</strong> — mở ra xem một bài hoàn chỉnh của web trông thế nào.</div>',
]]);

/* ════════════════════════════════════════════════════════════════════════════
 * KẾ HOẠCH 60 BUỔI — NGUYÊN BẢN FLM (bài 0.5 dựng bảng từ mảng này)
 * [số buổi, chủ đề tiếng Anh NGUYÊN VĂN, dịch tiếng Việt, cột LO, cột ITU, bài trên web]
 * KHÔNG sửa cột chủ đề và cột LO — sinh viên phải đối chiếu được với bản trường phát.
 * ══════════════════════════════════════════════════════════════════════════ */
const BUOI_A = [
  ['1', 'Chapter 1. Why should you learn to write programs? (Part 1) — 1.1 Creativity and Motivation; 1.2 Computer hardware architecture; 1.3 Understanding programming', 'Chương 1. Vì sao bạn nên học lập trình? (Phần 1) — 1.1 Sáng tạo và động lực; 1.2 Kiến trúc phần cứng máy tính; 1.3 Hiểu về lập trình', 'LO1', 'I', '1.1'],
  ['2', '1.4 Words and sentences; 1.5 Conversing with Python; 1.6 Terminology: Interpreter and compiler', '1.4 Từ và câu; 1.5 Đối thoại với Python; 1.6 Thuật ngữ: trình thông dịch và trình biên dịch', 'LO1', 'I', '1.1'],
  ['3', 'Chapter 1 (Part 2) — 1.7 Writing a program; 1.8 What is a program?; 1.9 The building blocks of programs; 1.10 What could possibly go wrong?; 1.11 Debugging; 1.12 The learning journey; 1.13 Introduce IDE', 'Chương 1 (Phần 2) — 1.7 Viết một chương trình; 1.8 Chương trình là gì?; 1.9 Các khối xây dựng chương trình; 1.10 Có thể sai ở đâu?; 1.11 Gỡ lỗi; 1.12 Hành trình học; 1.13 Giới thiệu IDE', 'LO1', 'I', '1.2'],
  ['4', 'Chapter 2. Variables, expressions, and statements (Part 1) — 2.1 Values and types; 2.2 Variables; 2.3 Variable names and keywords; 2.4 Statements', 'Chương 2. Biến, biểu thức và câu lệnh (Phần 1) — 2.1 Giá trị và kiểu; 2.2 Biến; 2.3 Tên biến và từ khoá; 2.4 Câu lệnh', 'LO2', 'I,T', '1.3'],
  ['5', '2.5 Operators and operands; 2.6 Expressions', '2.5 Toán tử và toán hạng; 2.6 Biểu thức', 'LO2', 'I,T', '1.4'],
  ['6', 'Chapter 2 (Part 2) — 2.7 Order of operations; 2.8 Modulus operator; 2.9 String operations', 'Chương 2 (Phần 2) — 2.7 Thứ tự ưu tiên; 2.8 Toán tử chia lấy dư; 2.9 Thao tác trên chuỗi', 'LO2', 'I,T', '1.5'],
  ['7', '2.10 Asking the user for input; 2.11 Comments; 2.12 Choosing mnemonic variable names; 2.13 Debugging', '2.10 Hỏi dữ liệu từ người dùng; 2.11 Chú thích; 2.12 Chọn tên biến dễ nhớ; 2.13 Gỡ lỗi', 'LO2', 'I,T', '1.6'],
  ['8', 'Lab 1 assistance', 'Hướng dẫn Lab 1', 'LO1, LO2', 'U', '1.7'],
  ['9', 'Lab 1 assistance (cont.)', 'Hướng dẫn Lab 1 (tiếp)', 'LO1, LO2', 'U', '1.7'],
  ['10', 'Chapter 3. Conditional execution — 3.1 Boolean expressions; 3.2 Logical operators; 3.3 Conditional execution; 3.4 Alternative execution', 'Chương 3. Thực thi có điều kiện — 3.1 Biểu thức boolean; 3.2 Toán tử logic; 3.3 Thực thi có điều kiện; 3.4 Thực thi thay thế', 'LO3', 'IT', '2.1'],
  ['11', '3.5 Chained conditionals; 3.6 Nested conditionals; 3.7 Catching exceptions using try and except; 3.8 Short-circuit evaluation of logical expressions; 3.9 Debugging', '3.5 Điều kiện nối chuỗi; 3.6 Điều kiện lồng; 3.7 Bắt ngoại lệ bằng try và except; 3.8 Đánh giá đoản mạch biểu thức logic; 3.9 Gỡ lỗi', 'LO3', 'IT', '2.2'],
  ['12', 'Chapter 4. Iteration — 4.1 Updating variables; 4.2 The while statement; 4.3 Infinite loops; 4.4 Finishing iterations with continue', 'Chương 4. Vòng lặp — 4.1 Cập nhật biến; 4.2 Câu lệnh while; 4.3 Vòng lặp vô hạn; 4.4 Kết thúc lượt lặp bằng continue', 'LO3', 'IT', '2.3'],
  ['13', '4.5 Definite loops using for; 4.6 Loop patterns; 4.7 Debugging', '4.5 Vòng lặp xác định bằng for; 4.6 Các mẫu vòng lặp; 4.7 Gỡ lỗi', 'LO3', 'IT', '2.4'],
  ['14', 'Chapter 5. Functions (Part 1) — 5.1 Function calls; 5.2 Built-in functions; 5.3 Type conversion functions', 'Chương 5. Hàm (Phần 1) — 5.1 Lời gọi hàm; 5.2 Hàm dựng sẵn; 5.3 Hàm chuyển đổi kiểu', 'LO3', 'I,T', '3.1'],
  ['15', '5.4 Math functions; 5.5 Random numbers; 5.6 Adding new functions', '5.4 Hàm toán học; 5.5 Số ngẫu nhiên; 5.6 Thêm hàm mới', 'LO3', 'I,T', '3.2'],
  ['16', 'Chapter 5. Functions (Part 2) — 5.7 Definitions and uses; 5.8 Flow of execution; 5.9 Parameters and arguments', 'Chương 5. Hàm (Phần 2) — 5.7 Định nghĩa và sử dụng; 5.8 Luồng thực thi; 5.9 Tham số và đối số', 'LO3', 'I,T', '3.3'],
  ['17', '5.10 Fruitful functions and void functions; 5.11 Why functions?; 5.12 Debugging', '5.10 Hàm có trả về và hàm void; 5.11 Vì sao dùng hàm?; 5.12 Gỡ lỗi', 'LO3', 'I,T', '3.4'],
  ['18', 'Lab 2 assistance', 'Hướng dẫn Lab 2', 'LO3', 'U', '3.5'],
  ['19', 'Lab 2 assistance (cont.)', 'Hướng dẫn Lab 2 (tiếp)', 'LO3', 'U', '3.5'],
  ['20', 'Progress test 1', 'Kiểm tra tiến độ 1', 'LO1, LO2, LO3', 'I,U', '4.1'],
  ['21', 'Chapter 6. Strings (Part 1) — 6.1 A string is a sequence; 6.2 Getting the length of a string using len; 6.3 Traversal through a string with a loop', 'Chương 6. Chuỗi (Phần 1) — 6.1 Chuỗi là một dãy; 6.2 Lấy độ dài chuỗi bằng len; 6.3 Duyệt chuỗi bằng vòng lặp', 'LO4', 'I,T', '5.1'],
  ['22', '6.4 String slices; 6.5 Strings are immutable; 6.6 Loop and counting', '6.4 Cắt lát chuỗi; 6.5 Chuỗi là bất biến; 6.6 Vòng lặp và đếm', 'LO4', 'I,T', '5.2'],
  ['23', 'Chapter 6. Strings (Part 2) — 6.7 The in operator; 6.8 String comparison; 6.9 String methods', 'Chương 6. Chuỗi (Phần 2) — 6.7 Toán tử in; 6.8 So sánh chuỗi; 6.9 Các method của chuỗi', 'LO4', 'I,T', '5.3'],
  ['24', '6.10 Parsing strings; 6.11 Format operator; 6.12 Debugging', '6.10 Phân tích chuỗi; 6.11 Toán tử định dạng; 6.12 Gỡ lỗi', 'LO4', 'I,T', '5.4'],
  ['25', 'Chapter 7. Files — 7.1 Persistence; 7.2 Opening files; 7.3 Text files and lines; 7.4 Reading files', 'Chương 7. Tệp — 7.1 Tính bền vững; 7.2 Mở tệp; 7.3 Tệp văn bản và dòng; 7.4 Đọc tệp', 'LO5', 'IT', '6.1'],
  ['26', '7.5 Searching through a file; 7.6 Letting the user choose the file name; 7.7 Using try, except, and open; 7.8 Writing files; 7.9 Debugging', '7.5 Tìm kiếm trong tệp; 7.6 Để người dùng chọn tên tệp; 7.7 Dùng try, except và open; 7.8 Ghi tệp; 7.9 Gỡ lỗi', 'LO5', 'IT', '6.2'],
  ['27', 'Lab 3 assistance', 'Hướng dẫn Lab 3', 'LO5', 'U', '6.3'],
  ['28', 'Lab 3 assistance (cont.)', 'Hướng dẫn Lab 3 (tiếp)', 'LO5', 'U', '6.3'],
  ['29', 'Chapter 8. Lists (Part 1) — 8.1 A list is a sequence; 8.2 Lists are mutable; 8.3 Traversing a list', 'Chương 8. Danh sách (Phần 1) — 8.1 List là một dãy; 8.2 List thay đổi được; 8.3 Duyệt một list', 'LO6', 'I,T', '7.1'],
  ['30', '8.4 List operations; 8.5 List slices; 8.6 List methods', '8.4 Phép toán trên list; 8.5 Cắt lát list; 8.6 Các method của list', 'LO6', 'I,T', '7.2'],
];
const BUOI_B = [
  ['31', 'Chapter 8. Lists (Part 2) — 8.7 Deleting elements; 8.8 Lists and functions; 8.9 Lists and strings; 8.10 Parsing lines', 'Chương 8. Danh sách (Phần 2) — 8.7 Xoá phần tử; 8.8 List và hàm; 8.9 List và chuỗi; 8.10 Phân tích dòng', 'LO6', 'IT', '7.3'],
  ['32', '8.11 Objects and values; 8.12 Aliasing; 8.13 List arguments; 8.14 Debugging', '8.11 Đối tượng và giá trị; 8.12 Bí danh (aliasing); 8.13 Truyền list làm đối số; 8.14 Gỡ lỗi', 'LO6', 'IT', '7.4'],
  ['33', 'Chapter 9. Dictionaries — 9.1 Dictionary as a set of counters; 9.2 Dictionaries and files; 9.3 Looping and dictionaries', 'Chương 9. Từ điển — 9.1 Dictionary làm bộ đếm; 9.2 Dictionary và tệp; 9.3 Vòng lặp và dictionary', 'LO6', 'IT', '7.5'],
  ['34', '9.4 Advanced text parsing; 9.5 Debugging', '9.4 Phân tích văn bản nâng cao; 9.5 Gỡ lỗi', 'LO6', 'IT', '7.6'],
  ['35', 'Chapter 10. Tuples (Part 1) — 10.1 Tuples are immutable', 'Chương 10. Tuple (Phần 1) — 10.1 Tuple là bất biến', 'LO6', 'I,T', '7.7'],
  ['36', '10.2 Comparing tuples', '10.2 So sánh tuple', 'LO6', 'I,T', '7.8'],
  ['37', '10.3 Tuple assignment', '10.3 Gán tuple', 'LO6', 'I,T', '7.9'],
  ['38', '10.4 Dictionaries and tuples', '10.4 Dictionary và tuple', 'LO6', 'I,T', '7.10'],
  ['39', 'Lab 4 assistance', 'Hướng dẫn Lab 4', 'LO6', 'U', '7.11'],
  ['40', 'Lab 4 assistance (cont.)', 'Hướng dẫn Lab 4 (tiếp)', 'LO6', 'U', '7.11'],
  ['41', 'Chapter 14. Object-oriented programming — 14.1 Introduction to OOP', 'Chương 14. Lập trình hướng đối tượng — 14.1 Giới thiệu OOP', 'LO7', 'I,T', '8.1'],
  ['42', '14.2 Classes and Objects', '14.2 Lớp và đối tượng', 'LO7', 'I,T', '8.2'],
  ['43', '14.3 Encapsulation and Data Hiding', '14.3 Đóng gói và ẩn dữ liệu', 'LO7', 'I,T', '8.3'],
  ['44', '14.4 Abstraction and Modular Design', '14.4 Trừu tượng hoá và thiết kế module', 'LO7', 'I,T', '8.4'],
  ['45', '14.5 Inheritance', '14.5 Kế thừa', 'LO7', 'I,T', '8.5'],
  ['46', '14.6 Polymorphism and Method Overloading', '14.6 Đa hình và nạp chồng method', 'LO7', 'I,T', '8.6'],
  ['47', 'Assignment assistance', 'Hướng dẫn Assignment', 'LO1 - LO7', 'U', '9.1'],
  ['48', 'Assignment assistance (cont.)', 'Hướng dẫn Assignment (tiếp)', 'LO1 - LO7', 'U', '9.1'],
  ['49', '14.7 Using Objects and Work with OOP Programs', '14.7 Dùng đối tượng và làm việc với chương trình OOP', 'LO7', 'I,T', '8.7'],
  ['50', '14.8 Object Lifecycle', '14.8 Vòng đời đối tượng', 'LO7', 'I,T', '8.8'],
  ['51', 'Progress test 2', 'Kiểm tra tiến độ 2', 'LO1 - LO7', 'U', '10.1'],
  ['52', '14.9 Advanced OOP Concepts and Design Patterns', '14.9 Khái niệm OOP nâng cao và mẫu thiết kế', 'LO7', 'I,T', '8.9'],
  ['53', '14.10 Case Studies', '14.10 Các tình huống nghiên cứu', 'LO7', 'I,T', '8.10'],
  ['54', '14.11 Summary', '14.11 Tổng kết', 'LO7', 'I,T', '8.11'],
  ['55', 'Lab 5 assistance', 'Hướng dẫn Lab 5', 'LO7', 'I,T', '10.2'],
  ['56', 'Lab 5 assistance (cont.)', 'Hướng dẫn Lab 5 (tiếp)', 'LO7', 'I,T', '10.2'],
  ['57', 'Assignment review', 'Chữa Assignment', 'LO1 - LO7', 'U', '9.2'],
  ['58', 'Assignment review (cont.)', 'Chữa Assignment (tiếp)', 'LO1 - LO7', 'U', '9.2'],
  ['59', 'Review', 'Ôn tập', 'All LOs', '—', '10.3'],
  ['60', 'Review', 'Ôn tập', 'All LOs', '—', '10.3'],
];
const BUOI = BUOI_A.concat(BUOI_B);

/** Dựng thân bảng 60 buổi. Cố tình không dùng template literal (luật không ${ }). */
const hangBuoi = (viet) => BUOI.map((r) => '    <tr><td>' + r[0] + '</td><td>' + r[1] + '</td>'
  + (viet ? '<td>' + r[2] + '</td>' : '')
  + '<td>' + r[3] + '</td><td>' + r[4] + '</td><td><strong>' + r[5] + '</strong></td></tr>').join('\n');

/* ════════════════════════════════════════════════════════════════════════════
 * THẺ SÁCH — 4 giáo trình FLM. Luật 20/09/2026: sách phải là THẺ BẤM ĐƯỢC,
 * không được viết link như chữ thường (xem _HOP-DONG-SOAN-BAI.md § SÁCH).
 * Dùng lại được ở bất kỳ bài nào nhắc tới sách — đúng quy tắc 5 của mục đó.
 * ══════════════════════════════════════════════════════════════════════════ */
const SACH_PDF = (nutEn) => '<a class="the-sach chinh" href="http://do1.dr-chuck.com/pythonlearn/EN_us/pythonlearn.pdf" target="_blank" rel="noopener">'
  + '<span class="sach-ico">📗</span><span class="sach-than">'
  + '<span class="sach-ten">Python for Everybody: Exploring Data Using Python 3</span>'
  + '<span class="sach-phu">Charles R. Severance · Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License · 2016 · 1st ed · ISBN 978-1530051120</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan chinh">' + (nutEn ? 'Main textbook' : 'Giáo trình chính') + '</span>'
  + '<span class="sach-nhan mien-phi">' + (nutEn ? 'Free' : 'Miễn phí') + '</span></span></span>'
  + '<span class="sach-nut">' + (nutEn ? 'Download PDF →' : 'Tải PDF →') + '</span></a>';
const SACH_WEB = (nutEn) => '<a class="the-sach" href="https://www.py4e.com/" target="_blank" rel="noopener">'
  + '<span class="sach-ico">🌐</span><span class="sach-than">'
  + '<span class="sach-ten">Python for Everybody (PY4E) — ' + (nutEn ? 'the same book as a website' : 'bản web của chính cuốn sách') + '</span>'
  + '<span class="sach-phu">Charles R. Severance · py4e.com — ' + (nutEn ? 'readings, videos and auto-graded exercises' : 'bài đọc, video, bài tập tự chấm') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan mien-phi">' + (nutEn ? 'Free' : 'Miễn phí') + '</span></span></span>'
  + '<span class="sach-nut">' + (nutEn ? 'Read online →' : 'Đọc online →') + '</span></a>';
const SACH_COURSERA = (nutEn) => '<a class="the-sach" href="https://www.coursera.org/specializations/python" target="_blank" rel="noopener">'
  + '<span class="sach-ico">🎥</span><span class="sach-than">'
  + '<span class="sach-ten">Python for Everybody Specialization (Coursera)</span>'
  + '<span class="sach-phu">Charles R. Severance · ' + (nutEn ? 'audit for free; you pay only for the certificate' : 'học (audit) miễn phí, chỉ trả tiền nếu muốn lấy chứng chỉ') + '</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan mien-phi">' + (nutEn ? 'Free to learn' : 'Học miễn phí') + '</span></span></span>'
  + '<span class="sach-nut">' + (nutEn ? 'Open the course →' : 'Mở khoá học →') + '</span></a>';
const SACH_BERKELEY = (nutEn) => '<a class="the-sach" href="https://pythonnumericalmethods.studentorg.berkeley.edu/notebooks/Index.html" target="_blank" rel="noopener">'
  + '<span class="sach-ico">📙</span><span class="sach-than">'
  + '<span class="sach-ten">Python Programming and Numerical Methods — A Guide for Engineers and Scientists</span>'
  + '<span class="sach-phu">' + (nutEn ? 'author, publisher, year, edition and ISBN: not published on the FLM syllabus' : 'tác giả, NXB, năm, bản, ISBN: trường không công bố trên syllabus') + ' · UC Berkeley</span>'
  + '<span class="sach-nhan-nhom"><span class="sach-nhan tham-khao">' + (nutEn ? 'Reference' : 'Tham khảo') + '</span>'
  + '<span class="sach-nhan mien-phi">' + (nutEn ? 'Free' : 'Miễn phí') + '</span></span></span>'
  + '<span class="sach-nut">' + (nutEn ? 'Read online →' : 'Đọc online →') + '</span></a>';
const KHOI_SACH = (nutEn) => '<div class="khoi-sach">\n' + SACH_PDF(nutEn) + '\n' + SACH_WEB(nutEn) + '\n' + SACH_COURSERA(nutEn) + '\n' + SACH_BERKELEY(nutEn) + '\n</div>';

/* ═══════════════ 📚 TRUNG TÂM TÀI LIỆU (web bổ sung) ═══════════════ */
const taiLieu = doc('pfp191-tai-lieu-tham-khao', '📚 Resource hub: free Python materials|||📚 Trung tâm tài liệu: nguồn học Python miễn phí',
  'Bốn giáo trình FLM dạng thẻ bấm được (cả bốn đều miễn phí), cộng tài liệu tra cứu, kênh YouTube, công cụ online và lộ trình tự học do web gom thêm. Danh sách chính thức của trường ở bài 0.4.',
  [[
    `<span class="eyebrow">PFP191 · Resource hub</span>
<h2>Everything you need to learn Python, in one page</h2>
<p class="lead">Start here. <strong>All four materials the university names for PFP191 are free</strong> — you never have to buy a book for this course. Tap a card to open it.</p>
${KHOI_SACH(true)}
<p class="nhan">${NGUON} — the four rows of the Materials table, verbatim. The official list with every field is in lesson 0.4.</p>
<div class="note-ct">Everything below this line is added by CuongThai and is <strong>not</strong> part of the FLM syllabus. Use it to get better, not to replace what your lecturer asks for.</div>
<h3>Reference docs you will use every week</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">docs.python.org/3/tutorial</a> — the official Python tutorial, the authoritative source.</li>
<li><a href="https://docs.python.org/3/library/functions.html" target="_blank" rel="noopener">Built-in functions</a> — the exact behaviour of <code>print</code>, <code>input</code>, <code>int</code>, <code>len</code>, <code>range</code>…</li>
<li><a href="https://www.w3schools.com/python/" target="_blank" rel="noopener">W3Schools Python</a> — quick, searchable syntax lookup.</li>
</ul>
<h3>Run Python with nothing installed</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — named by the syllabus; runs in the browser, nothing to install.</li>
<li><a href="https://pythontutor.com/" target="_blank" rel="noopener">Python Tutor</a> — step through your code and <strong>watch the variables change</strong>. The single best tool for sessions 4–13.</li>
<li><a href="https://www.online-python.com/" target="_blank" rel="noopener">online-python.com</a> — paste, run, done.</li>
</ul>
<h3>Video, when reading is not enough</h3>
<ul>
<li><a href="https://www.youtube.com/@Dr_Chuck" target="_blank" rel="noopener">Dr. Chuck (Charles Severance)</a> — the author of your textbook, lecture by lecture, in the same order as this course.</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — clear, practical Python.</li>
</ul>
<h3>Tools the syllabus names</h3>
<ul>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Visual Studio Code</a> + the Python extension — the editor FPTU uses.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a>.</li>
<li><a href="https://www.python.org/downloads/" target="_blank" rel="noopener">Python 3</a> — the interpreter itself (on Windows tick "Add python.exe to PATH").</li>
</ul>
<p class="nhan">${NGUON} — Tools field, verbatim: "Visual Studio Code, Google Colab"</p>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Sessions 1–9</strong> — why programming, then variables, types, operators, input. Type every example by hand; Lab 1 is graded.</li>
<li><strong>Sessions 10–19</strong> — conditionals, loops, functions. This is where the Progress Test 1 scope ends (session 20).</li>
<li><strong>Sessions 21–28</strong> — strings and files.</li>
<li><strong>Sessions 29–40</strong> — lists, dictionaries, tuples — the heart of the Practical Exam.</li>
<li><strong>Sessions 41–60</strong> — OOP, the Assignment, Lab 5, then review.</li>
</ol></div>`,
    `<span class="eyebrow">PFP191 · Trung tâm tài liệu</span>
<h2>Mọi thứ để học Python, gom về một trang</h2>
<p class="lead">Bắt đầu ở đây. <strong>Cả bốn tài liệu trường chỉ định cho PFP191 đều MIỄN PHÍ</strong> — môn này bạn không phải mua sách. Bấm vào thẻ để mở.</p>
${KHOI_SACH(false)}
<p class="nhan">${NGUON} — bốn dòng của bảng Materials, nguyên văn. Danh sách chính thức đầy đủ từng trường ở bài 0.4.</p>
<div class="note-ct">Mọi thứ dưới vạch này do CuongThai thêm vào và <strong>không</strong> thuộc syllabus FLM. Dùng để giỏi hơn, không dùng thay cho thứ giảng viên yêu cầu.</div>
<h3>Tài liệu tra cứu, dùng gần như mỗi tuần</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">docs.python.org/3/tutorial</a> — tài liệu Python chính thức, nguồn chuẩn nhất.</li>
<li><a href="https://docs.python.org/3/library/functions.html" target="_blank" rel="noopener">Hàm dựng sẵn</a> — hành vi chính xác của <code>print</code>, <code>input</code>, <code>int</code>, <code>len</code>, <code>range</code>…</li>
<li><a href="https://www.w3schools.com/python/" target="_blank" rel="noopener">W3Schools Python</a> — tra cú pháp nhanh, có thanh tìm.</li>
</ul>
<h3>Chạy Python khi máy chưa cài gì</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chính syllabus chỉ định; chạy trên trình duyệt, không cần cài.</li>
<li><a href="https://pythontutor.com/" target="_blank" rel="noopener">Python Tutor</a> — chạy từng bước và <strong>xem biến thay đổi</strong>. Công cụ tốt nhất cho buổi 4–13.</li>
<li><a href="https://www.online-python.com/" target="_blank" rel="noopener">online-python.com</a> — dán code, bấm chạy, xong.</li>
</ul>
<h3>Video, khi đọc chưa đủ</h3>
<ul>
<li><a href="https://www.youtube.com/@Dr_Chuck" target="_blank" rel="noopener">Dr. Chuck (Charles Severance)</a> — chính tác giả giáo trình của bạn, giảng từng bài, cùng thứ tự với môn này.</li>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — Python rõ ràng, thực tế.</li>
</ul>
<h3>Công cụ trường chỉ định</h3>
<ul>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Visual Studio Code</a> + tiện ích Python — trình soạn thảo trường dùng.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a>.</li>
<li><a href="https://www.python.org/downloads/" target="_blank" rel="noopener">Python 3</a> — chính trình thông dịch (Windows nhớ tick "Add python.exe to PATH").</li>
</ul>
<p class="nhan">${NGUON} — ô Tools, nguyên văn: "Visual Studio Code, Google Colab"</p>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Buổi 1–9</strong> — vì sao lập trình, rồi biến, kiểu, toán tử, input. Gõ lại từng ví dụ bằng tay; Lab 1 có điểm.</li>
<li><strong>Buổi 10–19</strong> — rẽ nhánh, vòng lặp, hàm. Đây là hết phạm vi Progress Test 1 (thi ở buổi 20).</li>
<li><strong>Buổi 21–28</strong> — chuỗi và tệp.</li>
<li><strong>Buổi 29–40</strong> — list, dictionary, tuple — phần ruột của kỳ thi thực hành.</li>
<li><strong>Buổi 41–60</strong> — OOP, Assignment, Lab 5, rồi ôn tập.</li>
</ol></div>`,
  ]]);

/* ════════════════════════════════════════════════════════════════════════════
 * MỤC 0 — KHUNG MÔN HỌC THEO SYLLABUS FLM 12224 (phải đúng từng con số)
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── 0.1 Hồ sơ môn (slug cũ: pfp191-gioi-thieu) ───────────────────────────── */
const l01 = { ...doc('pfp191-gioi-thieu',
  '0.1 — Course profile: PFP191 on the FLM syllabus|||0.1 — Hồ sơ môn học: PFP191 trên syllabus FLM',
  'Mã môn, 3 tín chỉ, bậc Bachelor, thang điểm 10, phân bổ 150 giờ, môn tiên quyết, phương pháp dạy-học, công cụ, số quyết định 1286/QĐ-ĐHFPT và link FLM sylID 12224 để tự kiểm chứng.',
  [[
    `<span class="eyebrow">PFP191 · Section 0 · Lesson 0.1</span>
<h2>Course profile — straight from the FLM syllabus</h2>
<p class="lead">This page is the part of the course you can check line by line against the paper your university hands you. Every number below is copied from FLM syllabus 12224; nothing here is our interpretation.</p>
<p class="nhan">${NGUON}</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Subject code</span><span class="v">PFP191</span></div>
  <div class="kv"><span class="k">Syllabus name</span><span class="v">Programming Fundamentals with Python_Cơ sở lập trình (với Python)</span></div>
  <div class="kv"><span class="k">Course name (English)</span><span class="v">Programming Fundamentals with Python</span></div>
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Degree level</span><span class="v">Bachelor</span></div>
  <div class="kv"><span class="k">Scoring scale</span><span class="v">10</span></div>
  <div class="kv"><span class="k">Min average mark to pass</span><span class="v">5</span></div>
  <div class="kv"><span class="k">Is scored</span><span class="v">True</span></div>
  <div class="kv"><span class="k">Pre-requisite</span><span class="v">blank on FLM — the university publishes nothing here</span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60</span></div>
  <div class="kv"><span class="k">Tools</span><span class="v">Visual Studio Code, Google Colab</span></div>
  <div class="kv"><span class="k">Decision No.</span><span class="v">1286/QĐ-ĐHFPT dated 11/22/2024</span></div>
  <div class="kv"><span class="k">Approved</span><span class="v">11/22/2024 · IsApproved: True · IsActive: True</span></div>
  <div class="kv"><span class="k">Syllabus ID</span><span class="v">12224</span></div>
  <div class="kv"><span class="k">Verify it yourself</span><span class="v"><a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=12224" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=12224</a></span></div>
</div>
<h3>What the syllabus says the course is</h3>
<p>The Description field is three bullets — quoted:</p>
<ul>
<li>"Knowledge about programming language has become an essential part of an education in computer science because the realization of ideas, approaches, models, and algorithms is extremely important for the field of education and research as well as production. In order to deploy from an idea to a product, programming language tools are required."</li>
<li>"In recent years, python has emerged as a popular, powerful, multitasking and widely applicable 3rd generation language, especially in some new technology fields such as AI, Fintech, Data Science, IoT, and so on."</li>
<li>"This course covers the essential aspects of programming, including fundamental concepts, coding design, and the Python programming language, with an emphasis on <strong>object-oriented programming (OOP)</strong>, given its importance for advanced software development and subsequent courses."</li>
</ul>
<h3>Where the 150 hours go</h3>
<p>Time Allocation, verbatim: <em>45h (60 sessions) contact hours + 1h TE + 1.5h PE + 102.5h self-study.</em></p>
<table>
  <thead><tr><th>Block</th><th>Hours</th><th>Share</th></tr></thead>
  <tbody>
    <tr><td>Contact hours (60 sessions)</td><td>45</td><td>30%</td></tr>
    <tr><td>Self-study</td><td>102.5</td><td>68.3%</td></tr>
    <tr><td>Practical Exam (PE)</td><td>1.5</td><td>1%</td></tr>
    <tr><td>Theoretical / final exam (TE)</td><td>1</td><td>0.7%</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>
  </tbody>
</table>
<div class="note-ct">Two arithmetic checks <strong>we</strong> did on those figures (not statements from FLM): the four blocks add up to exactly <strong>150h</strong>, so the reading above is the right one; and 45 contact hours across 60 sessions is <strong>45 minutes of class per session</strong>. That is why <strong>102.5 self-study hours</strong> is by far the biggest block: the syllabus expects about <strong>2.3 hours at home for every hour in class</strong>. A first programming course cannot be absorbed by listening.</div>
<h3>How it is taught</h3>
<p>Learning-Teaching Method, verbatim: <em>In-class lecture, Inquiry-based Teaching, Offline.</em> "Inquiry-based" means the lecturer will put a question in front of you before giving the answer; "Offline" means the sessions are on campus, not online.</p>
<div class="callout"><strong>Pre-requisite: the field is empty on FLM.</strong> The university does not write "None" there — it writes nothing. We therefore do not claim there is no pre-requisite; we say the university publishes none. In practice PFP191 is a first-semester course and this site teaches it assuming you have never programmed.</div>
<h3>What to read next</h3>
<ul>
<li><strong>0.2</strong> — the five marks that make your grade, with the weight of each.</li>
<li><strong>0.3</strong> — the seven learning outcomes (CLOs), which the exams are written against.</li>
<li><strong>0.4</strong> — the four materials and the two tools the university names. All four materials are free.</li>
<li><strong>0.5</strong> — all 60 sessions, in the university's own order.</li>
<li><strong>0.6</strong> — the three student duties, including the 80% attendance rule.</li>
</ul>`,
    `<span class="eyebrow">PFP191 · Mục 0 · Bài 0.1</span>
<h2>Hồ sơ môn học — lấy thẳng từ syllabus FLM</h2>
<p class="lead">Đây là phần bạn đối chiếu được từng dòng với bản syllabus trường phát. Mọi con số dưới đây chép từ syllabus FLM 12224; không chỗ nào là suy diễn của web.</p>
<p class="nhan">${NGUON}</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Mã môn</span><span class="v">PFP191</span></div>
  <div class="kv"><span class="k">Tên syllabus</span><span class="v">Programming Fundamentals with Python_Cơ sở lập trình (với Python)</span></div>
  <div class="kv"><span class="k">Tên tiếng Anh</span><span class="v">Programming Fundamentals with Python</span></div>
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Bậc</span><span class="v">Bachelor (đại học)</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10</span></div>
  <div class="kv"><span class="k">Điểm TB tối thiểu để qua</span><span class="v">5</span></div>
  <div class="kv"><span class="k">Có tính điểm</span><span class="v">True</span></div>
  <div class="kv"><span class="k">Môn tiên quyết</span><span class="v">ô này TRỐNG trên FLM — trường không công bố</span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60</span></div>
  <div class="kv"><span class="k">Công cụ</span><span class="v">Visual Studio Code, Google Colab</span></div>
  <div class="kv"><span class="k">Số quyết định</span><span class="v">1286/QĐ-ĐHFPT ngày 22/11/2024</span></div>
  <div class="kv"><span class="k">Phê duyệt</span><span class="v">22/11/2024 · IsApproved: True · IsActive: True</span></div>
  <div class="kv"><span class="k">Syllabus ID</span><span class="v">12224</span></div>
  <div class="kv"><span class="k">Tự kiểm chứng</span><span class="v"><a href="https://flm.fpt.edu.vn/gui/role/student/SyllabusDetails?sylID=12224" target="_blank" rel="noopener">flm.fpt.edu.vn · sylID=12224</a></span></div>
</div>
<h3>Trường mô tả môn này là gì</h3>
<p>Ô Description gồm ba gạch đầu dòng — trích nguyên văn kèm dịch:</p>
<ul>
<li>"Knowledge about programming language has become an essential part of an education in computer science…" — <em>Kiến thức về ngôn ngữ lập trình đã trở thành phần thiết yếu của giáo dục khoa học máy tính, vì việc biến ý tưởng, cách tiếp cận, mô hình và thuật toán thành hiện thực là cực kỳ quan trọng cho cả giáo dục, nghiên cứu và sản xuất. Muốn đi từ ý tưởng tới sản phẩm thì phải có công cụ ngôn ngữ lập trình.</em></li>
<li>"In recent years, python has emerged as a popular, powerful, multitasking and widely applicable 3rd generation language…" — <em>Những năm gần đây Python nổi lên như ngôn ngữ thế hệ 3 phổ biến, mạnh, đa nhiệm và ứng dụng rộng, đặc biệt trong các lĩnh vực công nghệ mới như AI, Fintech, Khoa học dữ liệu, IoT…</em></li>
<li>"This course covers the essential aspects of programming… with an emphasis on object-oriented programming (OOP)…" — <em>Môn này phủ các mặt cốt lõi của lập trình: khái niệm nền, thiết kế code và ngôn ngữ Python, <strong>nhấn mạnh lập trình hướng đối tượng (OOP)</strong> vì nó quan trọng cho phát triển phần mềm nâng cao và các môn sau.</em></li>
</ul>
<h3>150 giờ đi đâu</h3>
<p>Ô Time Allocation, nguyên văn: <em>45h (60 sessions) contact hours + 1h TE + 1.5h PE + 102.5h self-study.</em></p>
<table>
  <thead><tr><th>Khối thời gian</th><th>Số giờ</th><th>Tỷ lệ</th></tr></thead>
  <tbody>
    <tr><td>Giờ lên lớp (60 buổi)</td><td>45</td><td>30%</td></tr>
    <tr><td>Tự học</td><td>102,5</td><td>68,3%</td></tr>
    <tr><td>Thi thực hành (PE)</td><td>1,5</td><td>1%</td></tr>
    <tr><td>Thi cuối kỳ (TE)</td><td>1</td><td>0,7%</td></tr>
    <tr><td><strong>Tổng</strong></td><td><strong>150</strong></td><td><strong>100%</strong></td></tr>
  </tbody>
</table>
<div class="note-ct">Hai phép kiểm số học <strong>do web tự làm</strong> (không phải câu của FLM): bốn khối cộng lại đúng <strong>150h</strong> — nghĩa là cách đọc trên là đúng; và 45 giờ lên lớp chia 60 buổi ra <strong>45 phút lớp mỗi buổi</strong>. Vì thế <strong>102,5 giờ tự học</strong> mới là khối lớn nhất: syllabus trông đợi bạn học ở nhà khoảng <strong>2,3 giờ cho mỗi giờ ở lớp</strong>. Môn lập trình đầu tiên không học được bằng cách ngồi nghe.</div>
<h3>Trường dạy môn này theo cách nào</h3>
<p>Ô Learning-Teaching Method, nguyên văn: <em>In-class lecture, Inquiry-based Teaching, Offline.</em> "Inquiry-based" (dạy theo lối truy vấn) nghĩa là giảng viên đặt câu hỏi trước rồi mới tới đáp án; "Offline" nghĩa là học trên lớp, không phải online.</p>
<div class="callout"><strong>Môn tiên quyết: ô này TRỐNG trên FLM.</strong> Trường không ghi "None" — trường không ghi gì cả. Nên web không dám kết luận "môn này không có tiên quyết"; web chỉ nói đúng điều quan sát được là trường không công bố. Thực tế PFP191 là môn kỳ 1 và web dạy nó với giả định bạn chưa từng lập trình.</div>
<h3>Đọc tiếp gì</h3>
<ul>
<li><strong>0.2</strong> — năm đầu điểm làm nên điểm môn, kèm trọng số từng cái.</li>
<li><strong>0.3</strong> — bảy chuẩn đầu ra (CLO); đề thi viết theo CLO, không theo bài giảng.</li>
<li><strong>0.4</strong> — bốn giáo trình và hai công cụ trường chỉ định. Cả bốn giáo trình đều miễn phí.</li>
<li><strong>0.5</strong> — đủ 60 buổi, theo đúng thứ tự của trường.</li>
<li><strong>0.6</strong> — ba nhiệm vụ của sinh viên, gồm quy định dự ≥80% số buổi.</li>
</ul>`,
  ]]), isFreePreview: true };

/* ── 0.2 Cách tính điểm ───────────────────────────────────────────────────── */
const l02 = doc('pfp191-0-2-danh-gia',
  '0.2 — Grading: the five marks, weights 15+10+30+15+30 = 100%|||0.2 — Cách tính điểm: năm đầu điểm, trọng số 15+10+30+15+30 = 100%',
  'Bảng 5 đầu điểm FLM đủ trọng số, tiêu chí đạt, thời lượng, CLO, dạng đề và số câu; tổng đúng 100%; thang 10, qua môn từ 5, dự ≥80% buổi mới được thi cuối kỳ; ví dụ tính điểm.',
  [[
    `<span class="eyebrow">PFP191 · Section 0 · Lesson 0.2</span>
<h2>Your grade, mark by mark</h2>
<p class="lead">Five marks, five weights, and they add up to exactly 100%. Read this before session 2 — <strong>55% of your grade is decided before the final exam</strong>.</p>
<p class="nhan">${NGUON} — Assessments table, verbatim</p>
<table>
  <thead><tr><th>Mark</th><th>Category</th><th>Parts</th><th>Weight</th><th>Completion criteria</th><th>Duration</th><th>CLOs</th><th>Question type</th><th>No. of questions</th></tr></thead>
  <tbody>
    <tr><td><strong>Assignment</strong></td><td>on-going</td><td>1</td><td><strong>15%</strong></td><td>&gt; 0</td><td>28 slots</td><td>CLO1 – CLO7</td><td>Review</td><td>not published</td></tr>
    <tr><td><strong>Lab</strong></td><td>on-going</td><td><strong>5</strong></td><td><strong>10%</strong></td><td>&gt; 0</td><td>90' each</td><td>CLO1 – CLO7</td><td>Review</td><td>not published</td></tr>
    <tr><td><strong>Practical Exam</strong></td><td>on-going</td><td>1</td><td><strong>30%</strong></td><td>&gt; 0</td><td>85' each</td><td>CLO1 – CLO7</td><td>PEA (hands-on programming)</td><td>not published</td></tr>
    <tr><td><strong>Progress Test</strong></td><td>on-going</td><td><strong>2</strong></td><td><strong>15%</strong></td><td>&gt; 0</td><td>30' each</td><td>CLO1 – CLO7</td><td>Multiple choices, marked by computer or a suitable format</td><td><strong>20 each</strong></td></tr>
    <tr><td><strong>Final Exam</strong></td><td><strong>Final exam</strong></td><td>1</td><td><strong>30%</strong></td><td><strong>4</strong></td><td>60' each</td><td>CLO1 – CLO7</td><td>Multiple choices, marked by computer</td><td><strong>50</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>The weights add up to exactly 100%</strong> — 15 + 10 + 30 + 15 + 30 = 100. There is no hidden sixth mark and nothing is rounded.</div>
<h3>What each row actually is</h3>
<ul>
<li><strong>Assignment — 15%, one part.</strong> The Duration column says "28 slots", so it is not a one-sitting task: it runs across 28 of the 60 sessions. FLM schedules guided time for it in sessions 47–48 and a review in sessions 57–58. Which 28 sessions it spans is <strong>not published</strong>.</li>
<li><strong>Lab — 10%, five parts, 90 minutes each.</strong> FLM schedules them in pairs: Lab 1 (sessions 8–9), Lab 2 (18–19), Lab 3 (27–28), Lab 4 (39–40), Lab 5 (55–56). Ten percent split five ways means <strong>2% per lab</strong>.</li>
<li><strong>Practical Exam — 30%, 85 minutes.</strong> Question type "PEA": you write and run real programs. This is the single heaviest mark in the course.</li>
<li><strong>Progress Test — 15%, two parts, 30 minutes and 20 questions each.</strong> PT1 at session 20, PT2 at session 51. Marked by computer "or a suitable format".</li>
<li><strong>Final Exam — 30%, 60 minutes, 50 multiple-choice questions</strong>, marked by computer. Note its completion criteria is <strong>4</strong>, not "&gt; 0" like the others.</li>
</ul>
<h3>Passing</h3>
<p>Scoring scale <strong>10</strong>; minimum average mark to pass <strong>5</strong>. Attendance, verbatim from StudentTasks: <em>"Students must attend at least 80% of contact slots in order to be accepted to the final examination."</em> With 60 sessions, 80% means you may miss <strong>at most 12</strong>.</p>
<div class="out">Weighted example (our arithmetic, not a university rule):<br>Assignment 8 × 15% = 1.20<br>Lab 9 × 10% = 0.90<br>Practical Exam 6 × 30% = 1.80<br>Progress Test 7 × 15% = 1.05<br>Final Exam 5 × 30% = 1.50<br><b>Average = 6.45 → above 5, passed</b></div>
<div class="callout warn"><strong>One number to keep in your head: 55%.</strong> Assignment 15 + Lab 10 + Practical Exam 30 = 55% is earned <em>during</em> the semester, and 30% of that is 85 minutes at a keyboard. Memorising slides cannot produce those marks — typing working Python can. The Final Exam is 30% and is 50 multiple-choice questions in 60 minutes, which is <strong>72 seconds per question</strong>: you need reflexes, not notes.</div>
<div class="note-ct"><strong>What the syllabus does NOT say</strong>, so we will not guess: how a mark that falls below its completion criteria is handled; how many questions the Assignment or the Labs contain; which 28 sessions the Assignment spans; whether the Practical Exam is auto-marked. Ask your lecturer in session 1 and write the answer down — those are the questions worth asking.</div>`,
    `<span class="eyebrow">PFP191 · Mục 0 · Bài 0.2</span>
<h2>Điểm môn của bạn, từng đầu điểm một</h2>
<p class="lead">Năm đầu điểm, năm trọng số, cộng lại đúng 100%. Đọc bài này trước buổi 2 — <strong>55% điểm môn đã chốt trước kỳ thi cuối</strong>.</p>
<p class="nhan">${NGUON} — bảng Assessments, nguyên văn</p>
<table>
  <thead><tr><th>Đầu điểm</th><th>Loại</th><th>Số phần</th><th>Trọng số</th><th>Tiêu chí đạt</th><th>Thời lượng</th><th>CLO</th><th>Dạng đề</th><th>Số câu</th></tr></thead>
  <tbody>
    <tr><td><strong>Assignment</strong> (bài tập lớn)</td><td>on-going</td><td>1</td><td><strong>15%</strong></td><td>&gt; 0</td><td>28 slots (28 buổi)</td><td>CLO1 – CLO7</td><td>Review</td><td>trường không công bố</td></tr>
    <tr><td><strong>Lab</strong> (thực hành)</td><td>on-going</td><td><strong>5</strong></td><td><strong>10%</strong></td><td>&gt; 0</td><td>90 phút/bài</td><td>CLO1 – CLO7</td><td>Review</td><td>trường không công bố</td></tr>
    <tr><td><strong>Practical Exam</strong> (thi thực hành)</td><td>on-going</td><td>1</td><td><strong>30%</strong></td><td>&gt; 0</td><td>85 phút/lượt</td><td>CLO1 – CLO7</td><td>PEA — lập trình trực tiếp</td><td>trường không công bố</td></tr>
    <tr><td><strong>Progress Test</strong> (kiểm tra tiến độ)</td><td>on-going</td><td><strong>2</strong></td><td><strong>15%</strong></td><td>&gt; 0</td><td>30 phút/bài</td><td>CLO1 – CLO7</td><td>Trắc nghiệm, máy chấm hoặc hình thức phù hợp</td><td><strong>20 câu/bài</strong></td></tr>
    <tr><td><strong>Final Exam</strong> (thi cuối kỳ)</td><td><strong>Final exam</strong></td><td>1</td><td><strong>30%</strong></td><td><strong>4</strong></td><td>60 phút</td><td>CLO1 – CLO7</td><td>Trắc nghiệm, máy chấm</td><td><strong>50 câu</strong></td></tr>
  </tbody>
</table>
<div class="callout ok"><strong>Trọng số cộng lại đúng 100%</strong> — 15 + 10 + 30 + 15 + 30 = 100. Không có đầu điểm thứ sáu ẩn đâu đó và không có chỗ nào phải làm tròn.</div>
<h3>Từng dòng thực chất là gì</h3>
<ul>
<li><strong>Assignment — 15%, một phần.</strong> Cột Duration ghi "28 slots", nên nó không phải bài làm một lần: nó trải trên 28 buổi trong tổng 60. FLM xếp giờ hướng dẫn ở buổi 47–48 và giờ chữa ở buổi 57–58. Cụ thể là 28 buổi nào thì <strong>trường không công bố</strong>.</li>
<li><strong>Lab — 10%, năm bài, mỗi bài 90 phút.</strong> FLM xếp theo cặp buổi: Lab 1 (buổi 8–9), Lab 2 (18–19), Lab 3 (27–28), Lab 4 (39–40), Lab 5 (55–56). 10% chia năm bài là <strong>2% mỗi bài</strong>.</li>
<li><strong>Practical Exam — 30%, 85 phút.</strong> Dạng đề "PEA": bạn viết và chạy chương trình thật. Đây là đầu điểm NẶNG NHẤT của cả môn.</li>
<li><strong>Progress Test — 15%, hai bài, mỗi bài 30 phút và 20 câu.</strong> PT1 ở buổi 20, PT2 ở buổi 51. Máy chấm "hoặc hình thức phù hợp".</li>
<li><strong>Final Exam — 30%, 60 phút, 50 câu trắc nghiệm</strong>, máy chấm. Chú ý tiêu chí đạt của nó là <strong>4</strong>, không phải "&gt; 0" như bốn đầu điểm kia.</li>
</ul>
<h3>Điều kiện qua môn</h3>
<p>Thang điểm <strong>10</strong>; điểm trung bình tối thiểu để qua môn là <strong>5</strong>. Điểm danh, nguyên văn ô StudentTasks: <em>"Students must attend at least 80% of contact slots in order to be accepted to the final examination."</em> — phải dự ít nhất 80% số buổi mới được vào thi cuối kỳ. Với 60 buổi, 80% nghĩa là vắng <strong>tối đa 12 buổi</strong>.</p>
<div class="out">Ví dụ tính điểm (số học của web, không phải quy định của trường):<br>Assignment 8 × 15% = 1,20<br>Lab 9 × 10% = 0,90<br>Practical Exam 6 × 30% = 1,80<br>Progress Test 7 × 15% = 1,05<br>Final Exam 5 × 30% = 1,50<br><b>Điểm trung bình = 6,45 → trên 5, qua môn</b></div>
<div class="callout warn"><strong>Một con số nên nhớ: 55%.</strong> Assignment 15 + Lab 10 + Practical Exam 30 = 55% kiếm được <em>trong</em> học kỳ, và 30% trong đó là 85 phút ngồi gõ. Học thuộc slide không tạo ra được số điểm đó — gõ được Python chạy thì có. Thi cuối kỳ 30%, 50 câu trắc nghiệm trong 60 phút, tức <strong>72 giây một câu</strong>: cần phản xạ, không phải cần vở.</div>
<div class="note-ct"><strong>Những chỗ syllabus KHÔNG nói</strong> nên web không đoán: một đầu điểm dưới tiêu chí đạt thì xử lý thế nào; Assignment và Lab gồm bao nhiêu câu/bao nhiêu phần; 28 buổi của Assignment là buổi nào; Practical Exam có chấm tự động hay không. Hãy hỏi giảng viên ngay buổi 1 và ghi lại câu trả lời — đó là những câu đáng hỏi.</div>`,
  ]]);

/* ── 0.3 Bảy CLO ──────────────────────────────────────────────────────────── */
const l03 = doc('pfp191-0-3-clo',
  '0.3 — The seven CLOs, verbatim + where each is taught|||0.3 — Bảy chuẩn đầu ra (CLO), nguyên văn + học ở đâu',
  'Bảy CLO nguyên văn tiếng Anh kèm dịch, ánh xạ CLO ↔ buổi học ↔ chương trên web, CLO ↔ đầu điểm; và ghi chú việc trường dùng lẫn lộn hai nhãn "CLO" và "LO" cho cùng một thứ.',
  [[
    `<span class="eyebrow">PFP191 · Section 0 · Lesson 0.3</span>
<h2>The seven course learning outcomes</h2>
<p class="lead">Exams are written against these seven sentences, not against a lecture. All five marks are tagged <strong>CLO1 – CLO7</strong>, so there is no outcome you can skip.</p>
<p class="nhan">${NGUON} — CLO table, verbatim</p>
<table>
  <thead><tr><th>CLO</th><th>Verbatim (FLM)</th><th>Translation</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>Understand the development environment (IDE), programming concepts and python's world</td><td>Hiểu môi trường phát triển (IDE), các khái niệm lập trình và thế giới Python</td></tr>
    <tr><td><strong>CLO2</strong></td><td>Understand variables, expression and statement</td><td>Hiểu biến, biểu thức và câu lệnh</td></tr>
    <tr><td><strong>CLO3</strong></td><td>Understand Conditional Execution, Functions, Loop and Iterations</td><td>Hiểu thực thi có điều kiện, hàm, vòng lặp và phép lặp</td></tr>
    <tr><td><strong>CLO4</strong></td><td>Understand Strings</td><td>Hiểu chuỗi (string)</td></tr>
    <tr><td><strong>CLO5</strong></td><td>Understand Files</td><td>Hiểu tệp tin (file)</td></tr>
    <tr><td><strong>CLO6</strong></td><td>Understand List, Dictionaries, Tuples</td><td>Hiểu list, dictionary, tuple</td></tr>
    <tr><td><strong>CLO7</strong></td><td>Understand OOP and how to apply this technology to an actual application</td><td>Hiểu OOP và cách áp dụng nó vào một ứng dụng thật</td></tr>
  </tbody>
</table>
<h3>CLO → FLM sessions → chapter on this site</h3>
<table>
  <thead><tr><th>CLO</th><th>FLM sessions (from the LO column)</th><th>Chapter here</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>1, 2, 3 · and 8–9 together with CLO2 · 20 · 47–48 · 51 · 57–60</td><td>Chapter 1 (1.1–1.2, 1.7)</td></tr>
    <tr><td>CLO2</td><td>4, 5, 6, 7 · 8–9 · 20 · 47–48 · 51 · 57–60</td><td>Chapter 1 (1.3–1.7)</td></tr>
    <tr><td>CLO3</td><td>10–19 · 20 · 47–48 · 51 · 57–60</td><td>Chapters 2 and 3</td></tr>
    <tr><td>CLO4</td><td>21, 22, 23, 24 · 47–48 · 51 · 57–60</td><td>Chapter 5</td></tr>
    <tr><td>CLO5</td><td>25, 26, 27–28 · 47–48 · 51 · 57–60</td><td>Chapter 6</td></tr>
    <tr><td>CLO6</td><td>29–40 · 47–48 · 51 · 57–60</td><td>Chapter 7</td></tr>
    <tr><td>CLO7</td><td>41–46, 49, 50, 52, 53, 54, 55–56 · 47–48 · 51 · 57–60</td><td>Chapters 8 and 10</td></tr>
  </tbody>
</table>
<h3>CLO → which mark tests it</h3>
<table>
  <thead><tr><th>Mark</th><th>Weight</th><th>CLOs covered (FLM)</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>15%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Lab (5 parts)</td><td>10%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Practical Exam</td><td>30%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Progress Test (2 parts)</td><td>15%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Final Exam</td><td>30%</td><td>CLO1 – CLO7</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>The university uses two different labels for the same thing: "CLO" and "LO".</strong> The outcomes table calls them <em>CLO1 … CLO7</em>; the 60-session plan tags every session <em>LO1 … LO7</em>. They are the same seven outcomes — LO3 <strong>is</strong> CLO3. We keep both spellings exactly where the university uses them so you can match our pages to the paper you were given.</div>
<div class="note-ct"><strong>Reading the table honestly</strong> (our note): every mark says "CLO1 – CLO7", which means the syllabus does <em>not</em> tell you that, say, the Progress Test at session 20 will only ask about CLO1–CLO3. The session plan implies it (session 20 is tagged LO1, LO2, LO3), but the assessment table does not restrict it. Plan to be examined on everything taught so far, and confirm the scope with your lecturer before each test.</div>`,
    `<span class="eyebrow">PFP191 · Mục 0 · Bài 0.3</span>
<h2>Bảy chuẩn đầu ra của môn</h2>
<p class="lead">Đề thi được viết theo bảy câu này, không theo bài giảng. Cả năm đầu điểm đều gắn <strong>CLO1 – CLO7</strong>, nên không có chuẩn đầu ra nào bỏ qua được.</p>
<p class="nhan">${NGUON} — bảng CLO, nguyên văn</p>
<table>
  <thead><tr><th>CLO</th><th>Nguyên văn (FLM)</th><th>Dịch</th></tr></thead>
  <tbody>
    <tr><td><strong>CLO1</strong></td><td>Understand the development environment (IDE), programming concepts and python's world</td><td>Hiểu môi trường phát triển (IDE), các khái niệm lập trình và thế giới Python</td></tr>
    <tr><td><strong>CLO2</strong></td><td>Understand variables, expression and statement</td><td>Hiểu biến, biểu thức và câu lệnh</td></tr>
    <tr><td><strong>CLO3</strong></td><td>Understand Conditional Execution, Functions, Loop and Iterations</td><td>Hiểu thực thi có điều kiện, hàm, vòng lặp và phép lặp</td></tr>
    <tr><td><strong>CLO4</strong></td><td>Understand Strings</td><td>Hiểu chuỗi (string)</td></tr>
    <tr><td><strong>CLO5</strong></td><td>Understand Files</td><td>Hiểu tệp tin (file)</td></tr>
    <tr><td><strong>CLO6</strong></td><td>Understand List, Dictionaries, Tuples</td><td>Hiểu list, dictionary, tuple</td></tr>
    <tr><td><strong>CLO7</strong></td><td>Understand OOP and how to apply this technology to an actual application</td><td>Hiểu OOP và cách áp dụng nó vào một ứng dụng thật</td></tr>
  </tbody>
</table>
<h3>CLO → buổi học theo FLM → chương trên web</h3>
<table>
  <thead><tr><th>CLO</th><th>Buổi theo FLM (cột LO)</th><th>Chương trên web</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>1, 2, 3 · và 8–9 cùng CLO2 · 20 · 47–48 · 51 · 57–60</td><td>Chương 1 (bài 1.1–1.2, 1.7)</td></tr>
    <tr><td>CLO2</td><td>4, 5, 6, 7 · 8–9 · 20 · 47–48 · 51 · 57–60</td><td>Chương 1 (bài 1.3–1.7)</td></tr>
    <tr><td>CLO3</td><td>10–19 · 20 · 47–48 · 51 · 57–60</td><td>Chương 2 và 3</td></tr>
    <tr><td>CLO4</td><td>21, 22, 23, 24 · 47–48 · 51 · 57–60</td><td>Chương 5</td></tr>
    <tr><td>CLO5</td><td>25, 26, 27–28 · 47–48 · 51 · 57–60</td><td>Chương 6</td></tr>
    <tr><td>CLO6</td><td>29–40 · 47–48 · 51 · 57–60</td><td>Chương 7</td></tr>
    <tr><td>CLO7</td><td>41–46, 49, 50, 52, 53, 54, 55–56 · 47–48 · 51 · 57–60</td><td>Chương 8 và 10</td></tr>
  </tbody>
</table>
<h3>CLO → đầu điểm nào kiểm</h3>
<table>
  <thead><tr><th>Đầu điểm</th><th>Trọng số</th><th>CLO được kiểm (theo FLM)</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>15%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Lab (5 bài)</td><td>10%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Practical Exam</td><td>30%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Progress Test (2 bài)</td><td>15%</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Final Exam</td><td>30%</td><td>CLO1 – CLO7</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Trường dùng LẪN LỘN hai nhãn cho cùng một thứ: "CLO" và "LO".</strong> Bảng chuẩn đầu ra gọi là <em>CLO1 … CLO7</em>; bảng kế hoạch 60 buổi lại gắn mỗi buổi <em>LO1 … LO7</em>. Đó vẫn là bảy chuẩn đầu ra ấy — LO3 <strong>chính là</strong> CLO3. Web giữ nguyên cả hai cách viết đúng ở chỗ trường dùng, để bạn đối chiếu được với bản trường phát.</div>
<div class="note-ct"><strong>Đọc bảng cho đúng</strong> (ghi chú của web): mọi đầu điểm đều ghi "CLO1 – CLO7", nghĩa là syllabus <em>không</em> nói rằng Progress Test ở buổi 20 chỉ hỏi CLO1–CLO3. Bảng kế hoạch buổi thì hàm ý thế (buổi 20 gắn LO1, LO2, LO3), nhưng bảng đánh giá không giới hạn lại. Hãy chuẩn bị theo hướng bị hỏi mọi thứ đã học, và xác nhận phạm vi với giảng viên trước mỗi bài kiểm tra.</div>`,
  ]]);

/* ── 0.4 Giáo trình & công cụ ─────────────────────────────────────────────── */
const l04 = doc('pfp191-0-4-giao-trinh-cong-cu',
  '0.4 — The four materials (all free) & the two tools|||0.4 — Bốn giáo trình (đều miễn phí) & hai công cụ trường chỉ định',
  'Bốn mục giáo trình FLM dựng thành thẻ bấm được: sách chính Python for Everybody (Severance, 2016, ISBN 978-1530051120, PDF miễn phí), py4e.com, Coursera Specialization, Berkeley Numerical Methods; công cụ VS Code + Google Colab.',
  [[
    `<span class="eyebrow">PFP191 · Section 0 · Lesson 0.4</span>
<h2>Materials &amp; tools — the university's own list</h2>
<p class="lead">The Materials table has four rows. Row 1 is marked <em>Is Main Material = True</em>, and here is the unusual part: <strong>all four are free</strong>. This course costs you nothing in books.</p>
<p class="nhan">${NGUON} — Materials table, verbatim (author, publisher, year, edition, ISBN, URL)</p>
${KHOI_SACH(true)}
<h3>The same four rows, field by field</h3>
<table>
  <thead><tr><th>#</th><th>Material description</th><th>Author</th><th>Publisher</th><th>Year</th><th>Edition</th><th>ISBN</th><th>Main?</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Python for Everybody: Exploring Data Using Python 3</td><td>Charles R. Severance</td><td>Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</td><td>2016</td><td>1st</td><td>978-1530051120</td><td><strong>True — main</strong></td></tr>
    <tr><td>2</td><td>Python for Everybody (PY4E)</td><td>Charles R. Severance</td><td>not published</td><td>—</td><td>—</td><td>—</td><td>False</td></tr>
    <tr><td>3</td><td>Python for Everybody Specialization</td><td>Charles R. Severance</td><td>not published</td><td>—</td><td>—</td><td>—</td><td>False</td></tr>
    <tr><td>4</td><td>Python Programming and Numerical Methods - A Guide for Engineers and Scientists</td><td>not published</td><td>not published</td><td>—</td><td>—</td><td>—</td><td>False</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Fields shown as "—" or "not published" are blank on the FLM syllabus. We do not guess them.</p>
<h3>Why "free" matters here</h3>
<p>The publisher field of row 1 is not a company — it is a <strong>Creative Commons licence</strong>. That is the reason you can legally download the whole book as a PDF, read the same text on py4e.com, and watch the author teach it on YouTube without paying anyone. The Coursera specialization (row 3) can be <em>audited</em> for free; you pay only if you want the certificate.</p>
<h3>How this course maps onto the book</h3>
<table>
  <thead><tr><th>Book chapter</th><th>FLM sessions</th><th>Chapter here</th></tr></thead>
  <tbody>
    <tr><td>1 — Why should you learn to write programs?</td><td>1–3</td><td>Ch. 1 (1.1–1.2)</td></tr>
    <tr><td>2 — Variables, expressions, statements</td><td>4–7</td><td>Ch. 1 (1.3–1.6)</td></tr>
    <tr><td>3 — Conditional execution · 4 — Iteration</td><td>10–13</td><td>Ch. 2</td></tr>
    <tr><td>5 — Functions</td><td>14–17</td><td>Ch. 3</td></tr>
    <tr><td>6 — Strings</td><td>21–24</td><td>Ch. 5</td></tr>
    <tr><td>7 — Files</td><td>25–26</td><td>Ch. 6</td></tr>
    <tr><td>8 — Lists · 9 — Dictionaries · 10 — Tuples</td><td>29–38</td><td>Ch. 7</td></tr>
    <tr><td>14 — Object-oriented programming</td><td>41–46, 49–50, 52–54</td><td>Ch. 8</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>The syllabus jumps from Chapter 10 to Chapter 14 — chapters 11, 12 and 13 are not in this course.</strong> That is what FLM publishes, and it is not a mistake on our side: in the PY4E book chapters 11–13 are Regular Expressions, Networked Programs and Using Databases, and PFP191 does not schedule them. Do not go looking for "session 39 = chapter 11". If your lecturer adds them, that is their choice, not the syllabus'.</div>
<h3>Tools — verbatim from the syllabus</h3>
<ul>
<li><strong>Visual Studio Code</strong> — install it plus the Microsoft Python extension.</li>
<li><strong>Google Colab</strong> — <a href="https://colab.research.google.com/" target="_blank" rel="noopener">colab.research.google.com</a>; nothing to install, runs in a browser.</li>
</ul>
<p class="nhan">${NGUON} — Tools field, verbatim: "Visual Studio Code, Google Colab"</p>
<div class="note-ct"><strong>Which one to use, and when</strong> (our advice, not a rule): use <strong>Colab</strong> in the first two weeks so that nothing stands between you and your first running program. Move to <strong>VS Code</strong> by session 7, because the Practical Exam is a real file you run, not a notebook cell, and because you need to be comfortable with a terminal and an error message that names a line number. The syllabus does <strong>not</strong> say which tool the Practical Exam is taken on — ask your lecturer.</div>`,
    `<span class="eyebrow">PFP191 · Mục 0 · Bài 0.4</span>
<h2>Giáo trình &amp; công cụ — danh sách của chính trường</h2>
<p class="lead">Bảng Materials có bốn dòng. Dòng 1 được đánh dấu <em>Is Main Material = True</em>, và đây là chỗ bất thường đáng mừng: <strong>cả bốn đều MIỄN PHÍ</strong>. Môn này bạn không tốn đồng nào tiền sách.</p>
<p class="nhan">${NGUON} — bảng Materials, nguyên văn (tác giả, NXB, năm, bản, ISBN, URL)</p>
${KHOI_SACH(false)}
<h3>Vẫn bốn dòng đó, đủ từng trường</h3>
<table>
  <thead><tr><th>#</th><th>Mô tả tài liệu</th><th>Tác giả</th><th>NXB</th><th>Năm</th><th>Bản</th><th>ISBN</th><th>Chính?</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Python for Everybody: Exploring Data Using Python 3</td><td>Charles R. Severance</td><td>Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</td><td>2016</td><td>1st</td><td>978-1530051120</td><td><strong>True — sách chính</strong></td></tr>
    <tr><td>2</td><td>Python for Everybody (PY4E)</td><td>Charles R. Severance</td><td>trường không công bố</td><td>—</td><td>—</td><td>—</td><td>False</td></tr>
    <tr><td>3</td><td>Python for Everybody Specialization</td><td>Charles R. Severance</td><td>trường không công bố</td><td>—</td><td>—</td><td>—</td><td>False</td></tr>
    <tr><td>4</td><td>Python Programming and Numerical Methods - A Guide for Engineers and Scientists</td><td>trường không công bố</td><td>trường không công bố</td><td>—</td><td>—</td><td>—</td><td>False</td></tr>
  </tbody>
</table>
<p class="ghi-chu">Ô ghi "—" hoặc "trường không công bố" là ô TRỐNG trên syllabus FLM. Web không đoán thay.</p>
<h3>Vì sao chữ "miễn phí" ở đây quan trọng</h3>
<p>Ô NXB của dòng 1 không phải một công ty — nó là một <strong>giấy phép Creative Commons</strong>. Chính vì thế bạn tải được cả cuốn sách dạng PDF một cách hợp pháp, đọc đúng nội dung đó trên py4e.com, và xem chính tác giả giảng trên YouTube mà không phải trả cho ai đồng nào. Khoá Coursera (dòng 3) học kiểu <em>audit</em> thì miễn phí; chỉ trả tiền nếu muốn lấy chứng chỉ.</p>
<h3>Môn này khớp vào sách thế nào</h3>
<table>
  <thead><tr><th>Chương sách</th><th>Buổi FLM</th><th>Chương trên web</th></tr></thead>
  <tbody>
    <tr><td>1 — Why should you learn to write programs?</td><td>1–3</td><td>Chương 1 (bài 1.1–1.2)</td></tr>
    <tr><td>2 — Variables, expressions, statements</td><td>4–7</td><td>Chương 1 (bài 1.3–1.6)</td></tr>
    <tr><td>3 — Conditional execution · 4 — Iteration</td><td>10–13</td><td>Chương 2</td></tr>
    <tr><td>5 — Functions</td><td>14–17</td><td>Chương 3</td></tr>
    <tr><td>6 — Strings</td><td>21–24</td><td>Chương 5</td></tr>
    <tr><td>7 — Files</td><td>25–26</td><td>Chương 6</td></tr>
    <tr><td>8 — Lists · 9 — Dictionaries · 10 — Tuples</td><td>29–38</td><td>Chương 7</td></tr>
    <tr><td>14 — Object-oriented programming</td><td>41–46, 49–50, 52–54</td><td>Chương 8</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Syllabus NHẢY từ Chapter 10 sang Chapter 14 — không có chương 11, 12, 13 trong môn này.</strong> Đó là đúng bản FLM công bố, không phải web ghi sai: trong sách PY4E, chương 11–13 là Biểu thức chính quy (Regular Expressions), Chương trình mạng (Networked Programs) và Cơ sở dữ liệu (Using Databases), và PFP191 không xếp buổi nào cho chúng. Đừng đi tìm "buổi 39 = chương 11". Nếu giảng viên có dạy thêm, đó là lựa chọn của giảng viên, không phải quy định của syllabus.</div>
<h3>Công cụ — nguyên văn syllabus</h3>
<ul>
<li><strong>Visual Studio Code</strong> — cài thêm tiện ích Python của Microsoft.</li>
<li><strong>Google Colab</strong> — <a href="https://colab.research.google.com/" target="_blank" rel="noopener">colab.research.google.com</a>; không cần cài gì, chạy trên trình duyệt.</li>
</ul>
<p class="nhan">${NGUON} — ô Tools, nguyên văn: "Visual Studio Code, Google Colab"</p>
<div class="note-ct"><strong>Dùng cái nào, lúc nào</strong> (lời khuyên của web, không phải quy định): hai tuần đầu hãy dùng <strong>Colab</strong> để không có gì chắn giữa bạn và chương trình chạy được đầu tiên. Từ khoảng buổi 7 hãy chuyển sang <strong>VS Code</strong>, vì kỳ thi thực hành là một tệp thật bạn chạy, không phải một ô notebook, và vì bạn cần quen với terminal và với thông báo lỗi có chỉ số dòng. Syllabus <strong>không</strong> nói thi thực hành làm trên công cụ nào — hãy hỏi giảng viên.</div>`,
  ]]);

/* ── 0.5 Kế hoạch đủ 60 buổi ──────────────────────────────────────────────── */
const l05 = doc('pfp191-0-5-ke-hoach-60-buoi',
  '0.5 — All 60 sessions, as published by FLM|||0.5 — Kế hoạch đủ 60 buổi, nguyên bản FLM',
  'Bảng 60 buổi nguyên bản FLM: chủ đề tiếng Anh giữ nguyên văn + cột dịch tiếng Việt, cột LO, cột ITU, và cột "Bài trên web" để đối chiếu; kèm hai ghi chú chỗ bản gốc bất thường.',
  [[
    `<span class="eyebrow">PFP191 · Section 0 · Lesson 0.5</span>
<h2>The 60-session plan</h2>
<p class="lead">This is the university's schedule, row for row, so you can match any page on this site to the paper you were given. The last column is <strong>our</strong> mapping to the lessons here — it is not part of the syllabus.</p>
<p class="nhan">${NGUON} — Session plan, all 60 rows, topics verbatim</p>
<p><strong>ITU</strong> = how deeply the session touches that outcome: <strong>I</strong>ntroduce · <strong>T</strong>each · <strong>U</strong>tilize. FLM writes it sometimes as "I,T" and sometimes as "IT" — both appear below exactly as published.</p>
<table>
  <thead><tr><th>#</th><th>Topic (FLM, verbatim)</th><th>LO</th><th>ITU</th><th>Page here</th></tr></thead>
  <tbody>
${hangBuoi(false)}
  </tbody>
</table>
<div class="callout warn"><strong>Two oddities in the original table — read them so you are not confused in class.</strong><br>
<strong>1. Chapter 10 → Chapter 14.</strong> Session 38 ends Chapter 10 (Tuples) and session 41 starts "Chapter 14. Object-oriented programming". There is no Chapter 11, 12 or 13 anywhere in the plan. In the PY4E book those are Regular Expressions, Networked Programs and Databases — not part of PFP191. We do not add them and we do not renumber the university's chapters.<br>
<strong>2. Session 25 is printed as "7/3 Text files and lines" on FLM</strong> — a slash where a full stop belongs. It is section <strong>7.3</strong> of the book. We write 7.3 above and tell you here, rather than silently "fixing" the university's page.</div>
<div class="note-ct"><strong>How to use this table</strong> (our suggestion): before each session, open the page in the last column and read it once — about 15 minutes. After the session, do its exercises. The five Lab pairs (8–9, 18–19, 27–28, 39–40, 55–56) are <strong>10% of the grade</strong> and the Assignment sessions (47–48, 57–58) carry <strong>15%</strong>; those seven pairs are the ones you never postpone.</div>`,
    `<span class="eyebrow">PFP191 · Mục 0 · Bài 0.5</span>
<h2>Kế hoạch 60 buổi</h2>
<p class="lead">Đây là lịch của trường, từng dòng một, để bạn đối chiếu được mọi trang trên web này với bản trường phát. Cột cuối là ánh xạ <strong>của web</strong> sang các bài ở đây — không thuộc syllabus.</p>
<p class="nhan">${NGUON} — bảng kế hoạch, đủ 60 dòng, chủ đề giữ nguyên văn tiếng Anh</p>
<p><strong>ITU</strong> = mức độ buổi đó tác động lên chuẩn đầu ra: <strong>I</strong>ntroduce (giới thiệu) · <strong>T</strong>each (dạy) · <strong>U</strong>tilize (vận dụng). FLM chỗ ghi "I,T" chỗ ghi "IT" — dưới đây giữ đúng như bản công bố.</p>
<table>
  <thead><tr><th>#</th><th>Chủ đề (FLM, nguyên văn)</th><th>Dịch tiếng Việt</th><th>LO</th><th>ITU</th><th>Bài trên web</th></tr></thead>
  <tbody>
${hangBuoi(true)}
  </tbody>
</table>
<div class="callout warn"><strong>Hai chỗ bất thường trong bảng gốc — đọc để không hoang mang trong lớp.</strong><br>
<strong>1. Chapter 10 → Chapter 14.</strong> Buổi 38 kết thúc Chapter 10 (Tuples) và buổi 41 mở "Chapter 14. Object-oriented programming". Không có Chapter 11, 12, 13 ở bất kỳ đâu trong kế hoạch. Trong sách PY4E, ba chương đó là Biểu thức chính quy, Chương trình mạng và Cơ sở dữ liệu — không thuộc PFP191. Web KHÔNG thêm vào và KHÔNG đánh số lại chương của trường.<br>
<strong>2. Buổi 25 trên FLM in là "7/3 Text files and lines"</strong> — dấu gạch chéo ở chỗ đáng lẽ là dấu chấm. Đó là mục <strong>7.3</strong> của sách. Web ghi 7.3 ở bảng trên và nói rõ chỗ này ở đây, thay vì âm thầm "sửa" trang của trường.</div>
<div class="note-ct"><strong>Dùng bảng này thế nào</strong> (gợi ý của web): trước mỗi buổi, mở bài ở cột cuối đọc một lượt — khoảng 15 phút. Sau buổi học thì làm bài tập của bài đó. Năm cặp buổi Lab (8–9, 18–19, 27–28, 39–40, 55–56) là <strong>10% điểm môn</strong> và hai cặp buổi Assignment (47–48, 57–58) gánh <strong>15%</strong>; bảy cặp buổi đó là thứ không bao giờ được hoãn.</div>`,
  ]]);

/* ── 0.6 Nhiệm vụ sinh viên ───────────────────────────────────────────────── */
const l06 = doc('pfp191-0-6-nhiem-vu-sinh-vien',
  '0.6 — Student tasks: the three rules, verbatim|||0.6 — Nhiệm vụ sinh viên: ba quy định, nguyên văn',
  'Ba gạch đầu dòng StudentTasks của FLM nguyên văn kèm dịch và nghĩa thực tế: dự ≥80% buổi mới được thi cuối kỳ, làm và nộp đúng hạn mọi bài tập, theo FLM để lấy thông tin mới nhất.',
  [[
    `<span class="eyebrow">PFP191 · Section 0 · Lesson 0.6</span>
<h2>What the syllabus requires of you</h2>
<p class="lead">Three lines in the StudentTasks field. The first one can end your semester, so read it first.</p>
<p class="nhan">${NGUON} — StudentTasks, verbatim (three bullets, nothing omitted)</p>
<table>
  <thead><tr><th>#</th><th>Verbatim (FLM)</th><th>What it means day to day</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Students must attend at least 80% of contact slots in order to be accepted to the final examination.</td><td>60 sessions → you may miss <strong>at most 12</strong>. Miss the 13th and you are not admitted to the Final Exam (30%), no matter how good the other four marks are.</td></tr>
    <tr><td>2</td><td>Student is responsible to do all exercises given by instructor in class or at home and submit on time</td><td>The Assignment (15%) and the five Labs (10%) come from this line — 25% of the grade is "did you do the work and hand it in".</td></tr>
    <tr><td>3</td><td>Constantly follow https://flm.fpt.edu.vn/ for up-to-date course information regarding assignment submission and feedback on assignments and project work.</td><td>FLM is the source of truth for deadlines and feedback. This site follows syllabus 12224 (decision 1286/QĐ-ĐHFPT, 22/11/2024); if FLM and this site ever disagree, <strong>FLM wins</strong>.</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>The 80% rule is the only one that cannot be repaired at the end of the semester.</strong> A low mark can be pulled up by the next mark; a 13th absence cannot be pulled up by anything. Count your own absences — do not assume someone will warn you.</div>
<div class="note-ct"><strong>A study routine that fits the syllabus' own numbers</strong> (ours, not a rule): the syllabus budgets <strong>102.5 self-study hours</strong> against 45 contact hours — about <strong>7 hours a week</strong> outside class over a 15-week semester. Split it: 1.5h re-reading the session page and <em>re-typing</em> its examples by hand (typing, not copy-paste — that is where syntax becomes automatic), 3.5h on exercises, 2h on the Assignment. If you spend zero hours outside class, the Practical Exam (30%, 85 minutes at a keyboard) will tell you so in the most expensive way available.</div>`,
    `<span class="eyebrow">PFP191 · Mục 0 · Bài 0.6</span>
<h2>Trường yêu cầu gì ở bạn</h2>
<p class="lead">Ba dòng trong ô StudentTasks. Dòng đầu có thể kết thúc cả học kỳ của bạn, nên đọc nó trước.</p>
<p class="nhan">${NGUON} — ô StudentTasks, nguyên văn (ba gạch đầu dòng, không lược bỏ)</p>
<table>
  <thead><tr><th>#</th><th>Nguyên văn (FLM)</th><th>Nghĩa thực tế hằng ngày</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Students must attend at least 80% of contact slots in order to be accepted to the final examination.</td><td>Dự ít nhất 80% số buổi mới được vào thi cuối kỳ. 60 buổi → vắng <strong>tối đa 12</strong>. Vắng buổi thứ 13 là không được thi Final Exam (30%), dù bốn đầu điểm kia đẹp tới đâu.</td></tr>
    <tr><td>2</td><td>Student is responsible to do all exercises given by instructor in class or at home and submit on time</td><td>Làm hết bài tập giảng viên giao ở lớp hoặc ở nhà và nộp đúng hạn. Assignment (15%) và năm bài Lab (10%) sinh ra từ dòng này — 25% điểm môn là "có làm và có nộp hay không".</td></tr>
    <tr><td>3</td><td>Constantly follow https://flm.fpt.edu.vn/ for up-to-date course information regarding assignment submission and feedback on assignments and project work.</td><td>Theo FLM thường xuyên để biết hạn nộp và nhận xét. FLM là nguồn sự thật. Web này bám syllabus 12224 (QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024); nếu FLM và web có chỗ nào khác nhau thì <strong>FLM đúng</strong>.</td></tr>
  </tbody>
</table>
<div class="callout danger"><strong>Quy định 80% là thứ duy nhất không sửa được vào cuối kỳ.</strong> Một đầu điểm thấp còn có đầu điểm sau kéo lên; buổi vắng thứ 13 thì không có gì kéo lại. Hãy tự đếm số buổi vắng của mình — đừng trông vào việc sẽ có ai nhắc.</div>
<div class="note-ct"><strong>Một nếp học khớp với chính con số của syllabus</strong> (gợi ý của web, không phải quy định): syllabus dành <strong>102,5 giờ tự học</strong> so với 45 giờ lên lớp — khoảng <strong>7 giờ mỗi tuần</strong> ngoài lớp cho một kỳ 15 tuần. Chia ra: 1,5h đọc lại bài của buổi và <em>gõ lại</em> các ví dụ bằng tay (gõ, không copy-paste — cú pháp thành phản xạ chính ở chỗ này), 3,5h làm bài tập, 2h làm Assignment. Nếu bạn dành 0 giờ ngoài lớp thì kỳ thi thực hành (30%, 85 phút ngồi gõ) sẽ nói cho bạn biết điều đó theo cách đắt nhất.</div>`,
  ]]);

/* ── Quiz Mục 0 ───────────────────────────────────────────────────────────── */
const q0 = quiz('pfp191-0-quiz', 'Quiz 0 — Do you know the rules?|||Quiz 0 — Bạn đã nắm luật chơi chưa?', [
  { id: 'q1',
    question: 'Which mark has the LARGEST weight in PFP191?|||Đầu điểm nào có trọng số LỚN NHẤT của PFP191?',
    options: ['Assignment, 15%|||Assignment, 15%', 'Practical Exam, 30%|||Practical Exam, 30%', 'Lab, 10%|||Lab, 10%', 'Progress Test, 15%|||Progress Test, 15%'],
    correctIndex: 1, points: 1,
    explanation: 'Practical Exam and Final Exam are both 30%, but the PE is on-going — it is the heaviest mark you earn before the final. Weights: 15 + 10 + 30 + 15 + 30 = 100%.|||Practical Exam và Final Exam đều 30%, nhưng PE là đầu điểm nặng nhất bạn kiếm được TRƯỚC kỳ thi cuối. Trọng số: 15 + 10 + 30 + 15 + 30 = 100%.' },
  { id: 'q2',
    question: 'With 60 sessions, the 80% attendance rule means you may miss at most how many?|||Với 60 buổi, quy định dự ≥80% nghĩa là vắng tối đa mấy buổi?',
    options: ['6|||6', '8|||8', '12|||12', '20|||20'],
    correctIndex: 2, points: 1,
    explanation: '80% of 60 = 48 sessions attended, so at most 12 absences — and the penalty is not being admitted to the final exam.|||80% của 60 = phải dự 48 buổi, nên vắng tối đa 12 buổi — và hậu quả là không được vào thi cuối kỳ.' },
  { id: 'q3',
    question: 'How long is the Final Exam and how many questions?|||Thi cuối kỳ dài bao lâu và bao nhiêu câu?',
    options: ['60 minutes, 50 questions|||60 phút, 50 câu', '85 minutes, 50 questions|||85 phút, 50 câu', '30 minutes, 20 questions|||30 phút, 20 câu', '90 minutes, 60 questions|||90 phút, 60 câu'],
    correctIndex: 0, points: 1,
    explanation: 'Final Exam: 60 minutes, 50 multiple-choice questions marked by computer. 85 minutes is the Practical Exam; 30 minutes / 20 questions is one Progress Test.|||Final Exam: 60 phút, 50 câu trắc nghiệm máy chấm. 85 phút là Practical Exam; 30 phút / 20 câu là một bài Progress Test.' },
  { id: 'q4',
    question: 'How many Labs are there, and what are they worth in total?|||Có bao nhiêu bài Lab, và tổng cộng bao nhiêu phần trăm?',
    options: ['5 labs, 10%|||5 bài, 10%', '3 labs, 15%|||3 bài, 15%', '5 labs, 30%|||5 bài, 30%', '2 labs, 15%|||2 bài, 15%'],
    correctIndex: 0, points: 1,
    explanation: 'The Assessments table says Lab: 5 parts, 10%, 90 minutes each — so 2% per lab. Two parts at 15% is the Progress Test.|||Bảng Assessments ghi Lab: 5 phần, 10%, mỗi bài 90 phút — tức 2% một bài. "2 phần, 15%" là Progress Test.' },
  { id: 'q5',
    question: 'The MAIN textbook of PFP191 is…|||Giáo trình CHÍNH của PFP191 là…',
    options: ['Python Crash Course|||Python Crash Course', 'Python for Everybody — Charles R. Severance, free (CC licence)|||Python for Everybody — Charles R. Severance, miễn phí (giấy phép CC)', 'The lecturer\'s slides on FLM|||Slide của giảng viên trên FLM', 'Python Programming and Numerical Methods (Berkeley)|||Python Programming and Numerical Methods (Berkeley)'],
    correctIndex: 1, points: 1,
    explanation: 'Row 1 of the Materials table, Is Main Material = True: Python for Everybody: Exploring Data Using Python 3, 2016, 1st ed, ISBN 978-1530051120 — free PDF and free online at py4e.com. The Berkeley guide is a reference.|||Dòng 1 bảng Materials, Is Main Material = True: Python for Everybody: Exploring Data Using Python 3, 2016, bản 1st, ISBN 978-1530051120 — PDF miễn phí và đọc online miễn phí ở py4e.com. Tài liệu Berkeley chỉ là tham khảo.' },
  { id: 'q6',
    question: 'PFP191 has how many credits, and what does FLM publish as the pre-requisite?|||PFP191 có bao nhiêu tín chỉ, và FLM công bố môn tiên quyết là gì?',
    options: ['3 credits; the field is blank — nothing is published|||3 tín chỉ; ô đó để trống — trường không công bố', '3 credits; requires CSI106|||3 tín chỉ; cần CSI106', '4 credits; the field is blank|||4 tín chỉ; ô đó để trống', '3 credits; it says "None"|||3 tín chỉ; ghi rõ "None"'],
    correctIndex: 0, points: 1,
    explanation: '3 credits, Bachelor level. The Pre-Requisite field is EMPTY — FLM does not even write "None", so the honest statement is "the university publishes nothing here".|||3 tín chỉ, bậc Bachelor. Ô Pre-Requisite để TRỐNG — FLM không ghi cả chữ "None", nên câu nói trung thực là "trường không công bố".' },
  { id: 'q7',
    question: 'Which book chapters does the syllabus SKIP between Tuples and OOP?|||Syllabus BỎ QUA những chương sách nào giữa Tuple và OOP?',
    options: ['None — it goes 10, 11, 12, 13, 14|||Không bỏ chương nào — đi 10, 11, 12, 13, 14', 'Chapters 11, 12 and 13 (Regex, Networked programs, Databases)|||Chương 11, 12, 13 (Regex, chương trình mạng, cơ sở dữ liệu)', 'Chapters 8 and 9|||Chương 8 và 9', 'Chapter 5 only|||Chỉ chương 5'],
    correctIndex: 1, points: 1,
    explanation: 'Session 38 ends Chapter 10 and session 41 starts "Chapter 14. Object-oriented programming". Chapters 11–13 of PY4E are not scheduled in PFP191 — that is how FLM publishes it.|||Buổi 38 hết Chapter 10, buổi 41 mở "Chapter 14. Object-oriented programming". Chương 11–13 của PY4E không được xếp buổi nào trong PFP191 — đó là đúng bản FLM công bố.' },
  { id: 'q8',
    question: 'How many self-study hours does the syllabus budget, out of the 150 study hours?|||Syllabus dành bao nhiêu giờ tự học trong tổng 150 giờ?',
    options: ['45h|||45h', '60h|||60h', '102.5h|||102,5h', '1.5h|||1,5h'],
    correctIndex: 2, points: 1,
    explanation: '150h = 45h contact (60 sessions) + 1h TE + 1.5h PE + 102.5h self-study. Self-study is 68% of the course — the biggest block by far.|||150h = 45h lên lớp (60 buổi) + 1h TE + 1,5h PE + 102,5h tự học. Tự học chiếm 68% cả môn — khối lớn nhất.' },
], 540);

/* ════════════════════════════════════════════════════════════════════════════
 * CHƯƠNG 1 — ĐẦY ĐỦ (buổi 1–9): PY4E ch.1 + ch.2 + Lab 1. CLO1 + CLO2.
 * MỌI chương trình dưới đây đã chạy thật bằng python3 trên macOS; khối .out là
 * output THẬT đã bắt lại. Nguồn: scratchpad/pfp191/py/*.py
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── 1.1 buổi 1–2 (slug cũ: pfp191-1-1-vi-sao-lap-trinh) ─────────────────── */
const l11 = { ...doc('pfp191-1-1-vi-sao-lap-trinh',
  '1.1 — Why should you learn to write programs?|||1.1 — Vì sao bạn nên học lập trình?',
  'Buổi 1–2, CLO1, PY4E 1.1–1.6: sáng tạo & động lực, kiến trúc phần cứng (CPU/RAM/đĩa/vào-ra), lập trình là gì, từ và câu của Python, đối thoại với trình thông dịch, thông dịch vs biên dịch. Có chương trình chạy thật.',
  [[
    `<span class="eyebrow">PFP191 · Session 1–2 · CLO1</span>
<h2>Why should you learn to write programs?</h2>
<p class="lead">After these two sessions you can say what a program is, name the four parts of a computer that your program touches, and hold a short conversation with the Python interpreter.</p>
<p class="nhan">${NGUON} · buổi 1 — "Chapter 1. Why should you learn to write programs? (Part 1) — 1.1 Creativity and Motivation; 1.2 Computer hardware architecture; 1.3 Understanding programming" · buổi 2 — "1.4 Words and sentences; 1.5 Conversing with Python; 1.6 Terminology: Interpreter and compiler"</p>
<h3>1.1 Creativity and motivation</h3>
<p>A computer is fast and obedient and has no ideas of its own. You have ideas and no patience for repetition. Programming is the trade where those two facts meet: you describe a procedure once, and the machine performs it a million times without complaining or getting bored.</p>
<p>There are two motivations, and both are legitimate. The first is that it is <strong>useful</strong>: renaming 3,000 files, summing a spreadsheet nobody wants to touch, downloading a year of prices. The second is that it is <strong>creative</strong> — the same reason people build things out of wood. This course cares about the first; your career will care about the second.</p>
<h3>1.2 Computer hardware architecture</h3>
<p>Every program you write in this course uses these four parts, and knowing which one is which explains most beginner confusion.</p>
<table>
  <thead><tr><th>Part</th><th>Speed</th><th>Remembers after power off?</th><th>What your program uses it for</th></tr></thead>
  <tbody>
    <tr><td><strong>CPU</strong> (central processing unit)</td><td>billions of steps per second</td><td>—</td><td>executes your instructions, one after another</td></tr>
    <tr><td><strong>Main memory (RAM)</strong></td><td>very fast</td><td><strong>No</strong></td><td>holds your variables while the program runs</td></tr>
    <tr><td><strong>Secondary storage</strong> (disk / SSD)</td><td>slow</td><td><strong>Yes</strong></td><td>holds your <code>.py</code> file and any data file</td></tr>
    <tr><td><strong>Input / output devices</strong></td><td>human speed</td><td>—</td><td>keyboard, screen — how you and the program talk</td></tr>
  </tbody>
</table>
<div class="diagram"><pre>  you  --keyboard-->  +-----------+        +--------------+
                      |    CPU    | &lt;----&gt; |  RAM         |  forgets on power off
  you  &lt;--screen----  +-----------+        |  (variables) |
                            |              +--------------+
                            v
                    +----------------+
                    | disk / SSD     |  keeps files forever
                    | (your .py)     |
                    +----------------+</pre></div>
<div class="note-ct">Why this matters on day one (our note, not the syllabus): "my variable disappeared when the program ended" is not a bug — variables live in <strong>RAM</strong>, and RAM is emptied when the program stops. Keeping something after the program ends is the subject of Chapter 7, Files (sessions 25–26).</div>
<h3>1.3 Understanding programming</h3>
<p>To write a program you need exactly two skills, and they are independent. One: know the <strong>vocabulary and grammar</strong> of a language — small, learnable, boring. Two: <strong>tell a story</strong> in it — take a problem and break it into steps the machine can do, in an order that works. You will finish skill one in about three weeks. Skill two is what the remaining 57 sessions are for.</p>
<h3>1.4 Words and sentences</h3>
<p>Python's vocabulary is tiny. It has <strong>35 reserved words</strong> — words you may not use as names because Python already means something by them — plus the built-in functions like <code>print()</code>. A "sentence" is a statement: one instruction on one line.</p>
<pre><code class="language-python"># Your first program
print("Hello, PFP191!")
print("Toi la may tinh. Toi lam dung nhung gi ban viet.")
</code></pre>
<div class="out">Hello, PFP191!<br><b>Toi la may tinh. Toi lam dung nhung gi ban viet.</b></div>
<h3>1.5 Conversing with Python</h3>
<p>Type <code>python3</code> in a terminal and you get the interactive prompt <code>&gt;&gt;&gt;</code>. You type one line, Python answers immediately. This is a <em>conversation</em> — the fastest way to check "what does this do?" without writing a file.</p>
<pre><code class="language-python">&gt;&gt;&gt; 2 + 3
5
&gt;&gt;&gt; print("xin chao")
xin chao
&gt;&gt;&gt; x = 6
&gt;&gt;&gt; x * 7
42
&gt;&gt;&gt; quit()
</code></pre>
<p>Two things to notice. At the prompt, an expression prints its value <em>without</em> <code>print()</code> — inside a file it does not, which surprises everyone once. And <code>quit()</code> leaves the conversation.</p>
<h3>1.6 Interpreter and compiler</h3>
<table>
  <thead><tr><th></th><th>Interpreter (Python)</th><th>Compiler (C, C++, Java)</th></tr></thead>
  <tbody>
    <tr><td>When is your code translated?</td><td>while it runs, line by line</td><td>all at once, before it runs</td></tr>
    <tr><td>What do you ship?</td><td>the source file</td><td>a machine-code executable</td></tr>
    <tr><td>How fast do you see a mistake?</td><td>when that line is reached</td><td>at compile time, before anything runs</td></tr>
    <tr><td>Typical speed</td><td>slower</td><td>faster</td></tr>
  </tbody>
</table>
<p>Python is <strong>interpreted</strong>. That is why <code>python3 hello.py</code> runs instantly with no build step — and why a typo on line 40 stays invisible until line 40 executes.</p>
<h3>Read the book alongside this page</h3>
<div class="khoi-sach">${SACH_WEB(true)}</div>
<p class="ghi-chu">Sections 1.1–1.6 of Chapter 1 — the same text as the free PDF, plus the author's video for each part.</p>
<div class="pitfall"><b>Case matters.</b> <code>Print("hi")</code> is not <code>print("hi")</code> — Python answers <code>NameError: name 'Print' is not defined</code>. <b>Quotes must match.</b> <code>print("hi')</code> is a syntax error. <b>The prompt is not the program.</b> At <code>&gt;&gt;&gt;</code> typing <code>2+3</code> shows 5; in a <code>.py</code> file the same line shows nothing — you need <code>print(2+3)</code>. <b>"Interpreted" does not mean "no errors".</b> It means errors arrive later, which is worse, not better.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Print your name and your class on two lines.</p>
<div class="dap-an"><pre><code class="language-python">print("Nguyen Van An")
print("PFP191 - K19")
</code></pre>
<div class="out">Nguyen Van An<br><b>PFP191 - K19</b></div>
<p>Two statements, executed top to bottom — that is "sequential execution", the first building block of every program.</p></div>
<p><b>E2.</b> Without running it, say which of the four hardware parts still holds your data after the program ends: RAM or disk?</p>
<div class="dap-an"><p><b>Disk.</b> RAM is emptied when the program stops, so anything you want to keep must be written to a file (Chapter 7, sessions 25–26).</p></div>`,
    `<span class="eyebrow">PFP191 · Buổi 1–2 · CLO1</span>
<h2>Vì sao bạn nên học lập trình?</h2>
<p class="lead">Học xong hai buổi này bạn nói được chương trình là gì, kể được bốn bộ phận của máy tính mà chương trình của bạn chạm tới, và nói chuyện được một lượt ngắn với trình thông dịch Python.</p>
<p class="nhan">${NGUON} · buổi 1 — "Chapter 1. Why should you learn to write programs? (Part 1) — 1.1 Creativity and Motivation; 1.2 Computer hardware architecture; 1.3 Understanding programming" · buổi 2 — "1.4 Words and sentences; 1.5 Conversing with Python; 1.6 Terminology: Interpreter and compiler"</p>
<h3>1.1 Sáng tạo và động lực</h3>
<p>Máy tính nhanh, biết vâng lời, và không có ý tưởng nào của riêng nó. Bạn thì có ý tưởng và không có kiên nhẫn làm việc lặp lại. Lập trình là cái nghề ở chỗ hai điều đó gặp nhau: bạn mô tả một quy trình đúng một lần, máy làm nó một triệu lần mà không cãi và không chán.</p>
<p>Có hai động lực, cả hai đều chính đáng. Thứ nhất là nó <strong>hữu ích</strong>: đổi tên 3.000 tệp, cộng một bảng tính không ai muốn mở, tải giá cả một năm. Thứ hai là nó <strong>sáng tạo</strong> — cùng lý do khiến người ta đóng đồ gỗ. Môn này quan tâm điều thứ nhất; sự nghiệp của bạn sẽ quan tâm điều thứ hai.</p>
<h3>1.2 Kiến trúc phần cứng máy tính</h3>
<p>Mọi chương trình bạn viết trong môn này đều dùng bốn bộ phận sau, và biết cái nào là cái nào giải thích được phần lớn những chỗ người mới hay rối.</p>
<table>
  <thead><tr><th>Bộ phận</th><th>Tốc độ</th><th>Còn nhớ sau khi tắt máy?</th><th>Chương trình dùng để làm gì</th></tr></thead>
  <tbody>
    <tr><td><strong>CPU</strong> (bộ xử lý trung tâm)</td><td>hàng tỉ bước mỗi giây</td><td>—</td><td>thực thi từng lệnh của bạn, cái này nối cái kia</td></tr>
    <tr><td><strong>Bộ nhớ chính (RAM)</strong></td><td>rất nhanh</td><td><strong>Không</strong></td><td>giữ các biến trong lúc chương trình chạy</td></tr>
    <tr><td><strong>Bộ nhớ phụ</strong> (đĩa / SSD)</td><td>chậm</td><td><strong>Có</strong></td><td>giữ tệp <code>.py</code> của bạn và mọi tệp dữ liệu</td></tr>
    <tr><td><strong>Thiết bị vào / ra</strong></td><td>tốc độ người</td><td>—</td><td>bàn phím, màn hình — chỗ bạn và chương trình nói chuyện</td></tr>
  </tbody>
</table>
<div class="diagram"><pre>  bạn --bàn phím-->  +-----------+        +--------------+
                      |    CPU    | &lt;----&gt; |  RAM         |  tắt máy là quên
  bạn &lt;--màn hình---  +-----------+        |  (các biến)  |
                            |              +--------------+
                            v
                    +----------------+
                    | đĩa / SSD      |  giữ tệp mãi mãi
                    | (tệp .py)      |
                    +----------------+</pre></div>
<div class="note-ct">Vì sao điều này quan trọng ngay buổi đầu (ghi chú của web, không phải syllabus): "biến của em biến mất khi chương trình kết thúc" không phải lỗi — biến sống trong <strong>RAM</strong>, và RAM bị xoá khi chương trình dừng. Muốn giữ lại thứ gì sau khi chương trình kết thúc thì đó là nội dung Chương 7, Tệp (buổi 25–26).</div>
<h3>1.3 Hiểu về lập trình</h3>
<p>Để viết chương trình bạn cần đúng hai kỹ năng, và chúng độc lập với nhau. Một: biết <strong>từ vựng và ngữ pháp</strong> của một ngôn ngữ — ít, học được, và hơi nhàm. Hai: <strong>kể một câu chuyện</strong> bằng nó — lấy một bài toán và chia thành các bước máy làm được, theo một thứ tự chạy đúng. Kỹ năng một bạn xong trong khoảng ba tuần. Kỹ năng hai là việc của 57 buổi còn lại.</p>
<h3>1.4 Từ và câu</h3>
<p>Từ vựng của Python rất nhỏ. Nó có <strong>35 từ khoá</strong> — những từ bạn không được dùng làm tên biến vì Python đã có nghĩa riêng cho chúng — cộng với các hàm dựng sẵn như <code>print()</code>. Một "câu" là một câu lệnh: một chỉ thị trên một dòng.</p>
<pre><code class="language-python"># Chuong trinh dau tien
print("Hello, PFP191!")
print("Toi la may tinh. Toi lam dung nhung gi ban viet.")
</code></pre>
<div class="out">Hello, PFP191!<br><b>Toi la may tinh. Toi lam dung nhung gi ban viet.</b></div>
<p class="ghi-chu">Chuỗi trong code viết tiếng Việt KHÔNG DẤU vì console Windows hay hỏng font; phần giải thích ngoài code thì có dấu bình thường.</p>
<h3>1.5 Đối thoại với Python</h3>
<p>Gõ <code>python3</code> trong terminal là bạn có dấu nhắc tương tác <code>&gt;&gt;&gt;</code>. Bạn gõ một dòng, Python trả lời ngay. Đây là một <em>cuộc đối thoại</em> — cách nhanh nhất để kiểm "cái này làm gì?" mà không cần tạo tệp.</p>
<pre><code class="language-python">&gt;&gt;&gt; 2 + 3
5
&gt;&gt;&gt; print("xin chao")
xin chao
&gt;&gt;&gt; x = 6
&gt;&gt;&gt; x * 7
42
&gt;&gt;&gt; quit()
</code></pre>
<p>Hai điều đáng chú ý. Ở dấu nhắc, một biểu thức tự in ra giá trị <em>không cần</em> <code>print()</code> — trong tệp thì không, và điều này làm ai cũng ngạc nhiên đúng một lần. Và <code>quit()</code> để thoát khỏi cuộc đối thoại.</p>
<h3>1.6 Trình thông dịch và trình biên dịch</h3>
<table>
  <thead><tr><th></th><th>Thông dịch (Python)</th><th>Biên dịch (C, C++, Java)</th></tr></thead>
  <tbody>
    <tr><td>Code được dịch khi nào?</td><td>trong lúc chạy, từng dòng</td><td>dịch hết một lượt, trước khi chạy</td></tr>
    <tr><td>Bạn giao đi cái gì?</td><td>chính tệp mã nguồn</td><td>một tệp thực thi mã máy</td></tr>
    <tr><td>Thấy lỗi nhanh cỡ nào?</td><td>khi chạy tới dòng đó</td><td>lúc biên dịch, trước khi chạy gì cả</td></tr>
    <tr><td>Tốc độ thường thấy</td><td>chậm hơn</td><td>nhanh hơn</td></tr>
  </tbody>
</table>
<p>Python là ngôn ngữ <strong>thông dịch</strong>. Vì thế <code>python3 hello.py</code> chạy ngay, không có bước build — và cũng vì thế một lỗi gõ ở dòng 40 vẫn nằm im cho tới khi dòng 40 được thực thi.</p>
<h3>Đọc sách song song với trang này</h3>
<div class="khoi-sach">${SACH_WEB(false)}</div>
<p class="ghi-chu">Mục 1.1–1.6 của Chương 1 — đúng nội dung như bản PDF miễn phí, kèm video của chính tác giả cho từng phần.</p>
<div class="pitfall"><b>Chữ hoa chữ thường có phân biệt.</b> <code>Print("hi")</code> không phải <code>print("hi")</code> — Python trả lời <code>NameError: name 'Print' is not defined</code>. <b>Dấu nháy phải khớp.</b> <code>print("hi')</code> là lỗi cú pháp. <b>Dấu nhắc không phải chương trình.</b> Ở <code>&gt;&gt;&gt;</code> gõ <code>2+3</code> thì hiện 5; trong tệp <code>.py</code> cùng dòng đó không hiện gì — phải <code>print(2+3)</code>. <b>"Thông dịch" không có nghĩa là "không có lỗi".</b> Nó có nghĩa là lỗi đến MUỘN hơn, tức là tệ hơn, không phải tốt hơn.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> In tên bạn và tên lớp trên hai dòng.</p>
<div class="dap-an"><pre><code class="language-python">print("Nguyen Van An")
print("PFP191 - K19")
</code></pre>
<div class="out">Nguyen Van An<br><b>PFP191 - K19</b></div>
<p>Hai câu lệnh, chạy từ trên xuống — đó chính là "chạy tuần tự", khối xây dựng đầu tiên của mọi chương trình.</p></div>
<p><b>E2.</b> Không cần chạy, hãy nói bộ phận nào còn giữ dữ liệu sau khi chương trình kết thúc: RAM hay đĩa?</p>
<div class="dap-an"><p><b>Đĩa.</b> RAM bị xoá khi chương trình dừng, nên thứ gì muốn giữ lại thì phải ghi ra tệp (Chương 7, buổi 25–26).</p></div>`,
  ]]), isFreePreview: true };

/* ── 1.2 buổi 3 ───────────────────────────────────────────────────────────── */
const l12 = doc('pfp191-1-2-viet-chuong-trinh-va-ide',
  '1.2 — Writing a program: six building blocks, errors, IDE|||1.2 — Viết chương trình: sáu khối xây dựng, lỗi, IDE',
  'Buổi 3, CLO1, PY4E 1.7–1.13: viết và chạy một tệp .py, chương trình là gì, sáu khối xây dựng (nhập/xuất/tuần tự/rẽ nhánh/lặp/tái sử dụng), ba loại lỗi với thông báo lỗi THẬT, gỡ lỗi, VS Code & Colab.',
  [[
    `<span class="eyebrow">PFP191 · Session 3 · CLO1</span>
<h2>Writing a program — and what to do when it breaks</h2>
<p class="lead">After this session you can create a <code>.py</code> file, run it, read the error message it produces, and name which of the three kinds of error you are looking at.</p>
<p class="nhan">${NGUON} · buổi 3 — "Chapter 1 (Part 2) — 1.7 Writing a program; 1.8 What is a program?; 1.9 The building blocks of programs; 1.10 What could possibly go wrong?; 1.11 Debugging; 1.12 The learning journey; 1.13 Introduce IDE"</p>
<h3>1.7 Writing a program</h3>
<p>A conversation at <code>&gt;&gt;&gt;</code> is forgotten the moment you close the terminal. A <strong>program</strong> is the same instructions saved in a file so they can be run again, given to someone else, and corrected. Three steps, and they never change: <strong>save</strong> a file ending in <code>.py</code> · <strong>run</strong> it with <code>python3 filename.py</code> · <strong>read</strong> what it printed.</p>
<h3>1.8 What is a program?</h3>
<p>A program is a set of instructions that expresses <em>a way of solving a problem</em>. The instructions are the small part; the "way of solving" is the whole skill. Two programs that print the same thing can be one line apart in length and a week apart in how easy they are to change.</p>
<h3>1.9 The building blocks of programs</h3>
<p>Almost every program ever written is made of six kinds of instruction. This is the map of the entire course — everything after session 3 is one of these six, in more detail.</p>
<table>
  <thead><tr><th>Block</th><th>In Python</th><th>Taught in</th></tr></thead>
  <tbody>
    <tr><td><strong>Input</strong> — get data in</td><td><code>input()</code>, reading a file</td><td>session 7 · sessions 25–26</td></tr>
    <tr><td><strong>Output</strong> — show results</td><td><code>print()</code>, writing a file</td><td>session 1 · session 26</td></tr>
    <tr><td><strong>Sequential execution</strong> — one line after another</td><td>the default</td><td>session 3</td></tr>
    <tr><td><strong>Conditional execution</strong> — choose</td><td><code>if</code> / <code>elif</code> / <code>else</code></td><td>sessions 10–11</td></tr>
    <tr><td><strong>Repeated execution</strong> — loop</td><td><code>while</code>, <code>for</code></td><td>sessions 12–13</td></tr>
    <tr><td><strong>Reuse</strong> — name a chunk and call it</td><td><code>def</code></td><td>sessions 14–17</td></tr>
  </tbody>
</table>
<p>Here is one small program that uses all six, so you can see the shape of everything to come:</p>
<pre><code class="language-python"># p11b.py - sau khoi xay dung cua moi chuong trinh
x = 6           # gan (input duoi dang co dinh)
print("x =", x) # xuat
if x &gt; 5:       # re nhanh
    print("x lon hon 5")
else:
    print("x khong lon hon 5")
tong = 0
for i in range(1, x + 1):   # lap
    tong = tong + i
print("tong 1..x =", tong)
def binh_phuong(n):        # tai su dung
    return n * n
print("binh phuong cua x =", binh_phuong(x))
</code></pre>
<div class="out">x = 6<br>x lon hon 5<br>tong 1..x = 21<br><b>binh phuong cua x = 36</b></div>
<p>You are not expected to write this yet. You <em>are</em> expected to point at each line and say which of the six blocks it is.</p>
<h3>1.10 What could possibly go wrong?</h3>
<p>Three kinds of error, in increasing order of how much they will cost you.</p>
<p><strong>Syntax error</strong> — the grammar is wrong, so Python refuses to start. Nothing runs at all.</p>
<pre><code class="language-python">print("Xin chao"
</code></pre>
<div class="out">  File "err_syntax.py", line 1<br>&nbsp;&nbsp;&nbsp;&nbsp;print("Xin chao"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br><b>SyntaxError: '(' was never closed</b></div>
<p><strong>Runtime error</strong> — the grammar is fine, but something impossible happens while running. Python stops at that line and prints a <em>traceback</em>.</p>
<pre><code class="language-python">so = 10
print(so / 0)
</code></pre>
<div class="out">Traceback (most recent call last):<br>&nbsp;&nbsp;File "err_runtime.py", line 2, in &lt;module&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;print(so / 0)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~~~^~~<br><b>ZeroDivisionError: division by zero</b></div>
<p><strong>Logic error</strong> — the program runs, prints something, and the something is wrong. Python cannot help you here; only you know what the answer should have been.</p>
<pre><code class="language-python"># Muon tinh trung binh cua 2 va 4 -> phai la 3.0
tb = 2 + 4 / 2
print("Trung binh (sai) =", tb)
print("Trung binh (dung) =", (2 + 4) / 2)
</code></pre>
<div class="out">Trung binh (sai) = 4.0<br><b>Trung binh (dung) = 3.0</b></div>
<h3>1.11 Debugging</h3>
<p>Debugging is not guessing. Four moves, in this order: <strong>read the message</strong> (it names the file, the line and the kind of error) · <strong>look at the line it names, and the line above it</strong> · <strong>print the values</strong> you think you have, to find out what you actually have · <strong>make the program smaller</strong> until the bug either disappears or becomes obvious.</p>
<div class="callout ok">The error message is the most useful text on your screen and the one beginners skip. Read the <strong>last line</strong> first — that is the error type and the reason. Then read the line number.</div>
<h3>1.12 The learning journey</h3>
<p>The first weeks feel like grammar drills with no story, and that is normal: you cannot write a paragraph before you can write a sentence. Two habits decide who is comfortable by session 20 — <strong>type every example by hand</strong> (copy-paste teaches your clipboard, not you), and <strong>run it before you believe it</strong>.</p>
<h3>1.13 The IDE</h3>
<table>
  <thead><tr><th>Tool</th><th>Install?</th><th>Good for</th></tr></thead>
  <tbody>
    <tr><td><strong>Visual Studio Code</strong> + Python extension</td><td>yes</td><td>real <code>.py</code> files, a terminal, a debugger — what the Practical Exam looks like</td></tr>
    <tr><td><strong>Google Colab</strong></td><td>no — browser only</td><td>the first two weeks, and any machine you cannot install on</td></tr>
  </tbody>
</table>
<p class="nhan">${NGUON} — Tools field, verbatim: "Visual Studio Code, Google Colab"</p>
<div class="pitfall"><b>Indentation is syntax in Python.</b> A stray space at the start of a line gives <code>IndentationError</code>; mixing tabs and spaces gives the same error while looking perfectly aligned. Set your editor to insert 4 spaces for Tab and never think about it again. <b>Naming your file after a module.</b> A file called <code>random.py</code> makes <code>import random</code> import <em>your</em> file. <b>Saving before running.</b> An unsaved editor runs the old file and you debug a ghost. <b>Reading only the first line of a traceback.</b> The useful line is the last one.</div>
<h3>Exercise</h3>
<p><b>E1.</b> The program below has one syntax error and one logic error. Find both without running it, then fix them.</p>
<pre><code class="language-python">gia = 20000
so_luong = 3
print("Tong:" gia + so_luong)
</code></pre>
<div class="dap-an"><p><b>Syntax:</b> a missing comma between the two arguments of <code>print</code>. <b>Logic:</b> the total of 3 items at 20,000 each is <code>gia * so_luong</code>, not <code>gia + so_luong</code> — adding a price to a quantity is meaningless.</p>
<pre><code class="language-python">gia = 20000
so_luong = 3
print("Tong:", gia * so_luong)
</code></pre>
<div class="out"><b>Tong: 60000</b></div>
<p>The syntax error stops the program; the logic error would have printed 20003 and looked fine. That is why logic errors are the expensive ones.</p></div>
<p><b>E2.</b> Which of the six building blocks does <code>for i in range(1, 4):</code> belong to, and which does <code>input()</code> belong to?</p>
<div class="dap-an"><p><code>for</code> is <b>repeated execution</b>; <code>input()</code> is <b>input</b>. They are taught in sessions 13 and 7 respectively.</p></div>`,
    `<span class="eyebrow">PFP191 · Buổi 3 · CLO1</span>
<h2>Viết chương trình — và làm gì khi nó vỡ</h2>
<p class="lead">Học xong buổi này bạn tạo được một tệp <code>.py</code>, chạy được nó, đọc được thông báo lỗi nó in ra, và gọi đúng tên loại lỗi trong ba loại.</p>
<p class="nhan">${NGUON} · buổi 3 — "Chapter 1 (Part 2) — 1.7 Writing a program; 1.8 What is a program?; 1.9 The building blocks of programs; 1.10 What could possibly go wrong?; 1.11 Debugging; 1.12 The learning journey; 1.13 Introduce IDE"</p>
<h3>1.7 Viết một chương trình</h3>
<p>Cuộc đối thoại ở <code>&gt;&gt;&gt;</code> bị quên ngay khi bạn đóng terminal. Một <strong>chương trình</strong> là đúng những chỉ thị đó nhưng lưu vào tệp, để chạy lại được, đưa cho người khác được, và sửa được. Ba bước, không bao giờ đổi: <strong>lưu</strong> một tệp có đuôi <code>.py</code> · <strong>chạy</strong> bằng <code>python3 ten_tep.py</code> · <strong>đọc</strong> thứ nó in ra.</p>
<h3>1.8 Chương trình là gì?</h3>
<p>Chương trình là một tập chỉ thị diễn đạt <em>một cách giải quyết vấn đề</em>. Phần chỉ thị là phần nhỏ; phần "cách giải quyết" mới là toàn bộ kỹ năng. Hai chương trình in ra cùng một thứ có thể chỉ chênh nhau một dòng về độ dài mà chênh nhau một tuần về độ dễ sửa.</p>
<h3>1.9 Các khối xây dựng chương trình</h3>
<p>Gần như mọi chương trình từng được viết đều gồm sáu loại chỉ thị. Đây là bản đồ của cả môn học — mọi thứ sau buổi 3 chỉ là một trong sáu cái này, nói kỹ hơn.</p>
<table>
  <thead><tr><th>Khối</th><th>Trong Python</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td><strong>Nhập</strong> — lấy dữ liệu vào</td><td><code>input()</code>, đọc tệp</td><td>buổi 7 · buổi 25–26</td></tr>
    <tr><td><strong>Xuất</strong> — hiện kết quả</td><td><code>print()</code>, ghi tệp</td><td>buổi 1 · buổi 26</td></tr>
    <tr><td><strong>Chạy tuần tự</strong> — dòng này rồi dòng kia</td><td>mặc định</td><td>buổi 3</td></tr>
    <tr><td><strong>Rẽ nhánh</strong> — chọn đường</td><td><code>if</code> / <code>elif</code> / <code>else</code></td><td>buổi 10–11</td></tr>
    <tr><td><strong>Lặp lại</strong> — làm nhiều lần</td><td><code>while</code>, <code>for</code></td><td>buổi 12–13</td></tr>
    <tr><td><strong>Tái sử dụng</strong> — đặt tên cho một mảng code rồi gọi</td><td><code>def</code></td><td>buổi 14–17</td></tr>
  </tbody>
</table>
<p>Đây là một chương trình nhỏ dùng đủ cả sáu, để bạn thấy hình dáng của mọi thứ sắp tới:</p>
<pre><code class="language-python"># p11b.py - sau khoi xay dung cua moi chuong trinh
x = 6           # gan (input duoi dang co dinh)
print("x =", x) # xuat
if x &gt; 5:       # re nhanh
    print("x lon hon 5")
else:
    print("x khong lon hon 5")
tong = 0
for i in range(1, x + 1):   # lap
    tong = tong + i
print("tong 1..x =", tong)
def binh_phuong(n):        # tai su dung
    return n * n
print("binh phuong cua x =", binh_phuong(x))
</code></pre>
<div class="out">x = 6<br>x lon hon 5<br>tong 1..x = 21<br><b>binh phuong cua x = 36</b></div>
<p>Chưa ai đòi bạn viết được cái này. Nhưng bạn <em>phải</em> chỉ được vào từng dòng và nói nó thuộc khối nào trong sáu khối.</p>
<h3>1.10 Có thể sai ở đâu?</h3>
<p>Ba loại lỗi, xếp theo mức độ tốn kém tăng dần.</p>
<p><strong>Lỗi cú pháp (syntax error)</strong> — sai ngữ pháp, nên Python từ chối khởi động. Không dòng nào chạy cả.</p>
<pre><code class="language-python">print("Xin chao"
</code></pre>
<div class="out">  File "err_syntax.py", line 1<br>&nbsp;&nbsp;&nbsp;&nbsp;print("Xin chao"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br><b>SyntaxError: '(' was never closed</b></div>
<p><strong>Lỗi lúc chạy (runtime error)</strong> — ngữ pháp đúng, nhưng giữa đường xảy ra một chuyện bất khả thi. Python dừng ở dòng đó và in ra một <em>traceback</em>.</p>
<pre><code class="language-python">so = 10
print(so / 0)
</code></pre>
<div class="out">Traceback (most recent call last):<br>&nbsp;&nbsp;File "err_runtime.py", line 2, in &lt;module&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;print(so / 0)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~~~^~~<br><b>ZeroDivisionError: division by zero</b></div>
<p><strong>Lỗi logic</strong> — chương trình chạy, in ra một cái gì, và cái đó sai. Python không giúp được ở đây; chỉ bạn biết đáp án đúng phải là bao nhiêu.</p>
<pre><code class="language-python"># Muon tinh trung binh cua 2 va 4 -> phai la 3.0
tb = 2 + 4 / 2
print("Trung binh (sai) =", tb)
print("Trung binh (dung) =", (2 + 4) / 2)
</code></pre>
<div class="out">Trung binh (sai) = 4.0<br><b>Trung binh (dung) = 3.0</b></div>
<h3>1.11 Gỡ lỗi (debugging)</h3>
<p>Gỡ lỗi không phải đoán. Bốn bước, theo đúng thứ tự này: <strong>đọc thông báo</strong> (nó ghi rõ tệp nào, dòng nào, loại lỗi gì) · <strong>xem đúng dòng nó chỉ, và dòng ngay trên</strong> · <strong>in giá trị ra</strong> để biết mình đang thực sự có gì, thay vì tin mình có gì · <strong>làm chương trình nhỏ lại</strong> cho tới khi lỗi biến mất hoặc lộ ra.</p>
<div class="callout ok">Thông báo lỗi là đoạn chữ hữu ích nhất trên màn hình và là đoạn người mới hay bỏ qua nhất. Đọc <strong>dòng CUỐI</strong> trước — đó là loại lỗi và lý do. Rồi mới đọc số dòng.</div>
<h3>1.12 Hành trình học</h3>
<p>Mấy tuần đầu giống học ngữ pháp mà chưa có câu chuyện nào, và điều đó là bình thường: chưa viết được câu thì chưa viết được đoạn. Hai thói quen quyết định ai thoải mái ở buổi 20 — <strong>gõ lại mọi ví dụ bằng tay</strong> (copy-paste dạy cái clipboard, không dạy bạn), và <strong>chạy thử trước khi tin</strong>.</p>
<h3>1.13 IDE</h3>
<table>
  <thead><tr><th>Công cụ</th><th>Phải cài?</th><th>Hợp cho việc gì</th></tr></thead>
  <tbody>
    <tr><td><strong>Visual Studio Code</strong> + tiện ích Python</td><td>có</td><td>tệp <code>.py</code> thật, có terminal, có debugger — giống hình dáng kỳ thi thực hành</td></tr>
    <tr><td><strong>Google Colab</strong></td><td>không — chỉ cần trình duyệt</td><td>hai tuần đầu, và mọi máy bạn không cài được gì</td></tr>
  </tbody>
</table>
<p class="nhan">${NGUON} — ô Tools, nguyên văn: "Visual Studio Code, Google Colab"</p>
<div class="pitfall"><b>Thụt lề là CÚ PHÁP trong Python.</b> Một dấu cách lạc đầu dòng cho <code>IndentationError</code>; trộn tab với dấu cách cho đúng lỗi đó trong khi mắt nhìn thấy thẳng tắp. Đặt editor chèn 4 dấu cách khi bấm Tab rồi đừng nghĩ về nó nữa. <b>Đặt tên tệp trùng tên module.</b> Tệp tên <code>random.py</code> làm <code>import random</code> nạp chính tệp <em>của bạn</em>. <b>Chạy mà chưa lưu.</b> Editor chưa lưu thì bạn chạy tệp cũ và đi debug một con ma. <b>Chỉ đọc dòng đầu của traceback.</b> Dòng hữu ích là dòng cuối.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Chương trình dưới đây có một lỗi cú pháp và một lỗi logic. Tìm cả hai mà không chạy, rồi sửa.</p>
<pre><code class="language-python">gia = 20000
so_luong = 3
print("Tong:" gia + so_luong)
</code></pre>
<div class="dap-an"><p><b>Cú pháp:</b> thiếu dấu phẩy giữa hai đối số của <code>print</code>. <b>Logic:</b> tổng tiền của 3 món giá 20.000 là <code>gia * so_luong</code>, không phải <code>gia + so_luong</code> — cộng giá với số lượng là vô nghĩa.</p>
<pre><code class="language-python">gia = 20000
so_luong = 3
print("Tong:", gia * so_luong)
</code></pre>
<div class="out"><b>Tong: 60000</b></div>
<p>Lỗi cú pháp làm chương trình dừng; lỗi logic thì in ra 20003 và trông vẫn ổn. Đó là lý do lỗi logic mới là loại đắt tiền.</p></div>
<p><b>E2.</b> <code>for i in range(1, 4):</code> thuộc khối xây dựng nào, và <code>input()</code> thuộc khối nào?</p>
<div class="dap-an"><p><code>for</code> là <b>lặp lại</b>; <code>input()</code> là <b>nhập</b>. Chúng được học lần lượt ở buổi 13 và buổi 7.</p></div>`,
  ]]);

/* ── 1.3 buổi 4 (slug cũ: pfp191-2-1-bien-bieu-thuc) ─────────────────────── */
const l13 = doc('pfp191-2-1-bien-bieu-thuc',
  '1.3 — Values, types, variables, names & statements|||1.3 — Giá trị, kiểu, biến, tên biến & câu lệnh',
  'Buổi 4, CLO2, PY4E 2.1–2.4: giá trị và bốn kiểu cơ bản (int/float/str/bool), biến và phép gán, quy tắc đặt tên và 35 từ khoá, câu lệnh. Code chạy thật kèm type().',
  [[
    `<span class="eyebrow">PFP191 · Session 4 · CLO2</span>
<h2>Values, types, variables and statements</h2>
<p class="lead">After this session you can create a variable, say what type it holds, prove it with <code>type()</code>, and name it in a way that will not be rejected by Python or by the person reading your code.</p>
<p class="nhan">${NGUON} · buổi 4 — "Chapter 2. Variables, expressions, and statements (Part 1) — 2.1 Values and types; 2.2 Variables; 2.3 Variable names and keywords; 2.4 Statements"</p>
<h3>2.1 Values and types</h3>
<p>A <strong>value</strong> is the most basic thing a program works with: the number 20, the text "An". Every value has a <strong>type</strong>, and the type decides what the value can do. <code>20 + 1</code> is 21; <code>"20" + 1</code> is an error, because text and numbers are not the same kind of thing even when they look alike.</p>
<table>
  <thead><tr><th>Type</th><th>Means</th><th>Example</th><th>Written how</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>whole number</td><td><code>20</code>, <code>-3</code>, <code>0</code></td><td>digits, no quotes, no dot</td></tr>
    <tr><td><code>float</code></td><td>real number</td><td><code>8.5</code>, <code>-0.25</code></td><td>with a dot</td></tr>
    <tr><td><code>str</code></td><td>text (a string)</td><td><code>"An"</code>, <code>'20'</code></td><td>inside quotes</td></tr>
    <tr><td><code>bool</code></td><td>true or false</td><td><code>True</code>, <code>False</code></td><td>capital T and F, no quotes</td></tr>
  </tbody>
</table>
<h3>2.2 Variables</h3>
<p>A <strong>variable</strong> is a name that refers to a value. The <code>=</code> sign is not equality — it is <em>assignment</em>: "make this name refer to that value". Unlike C or Java, you never declare a type; Python takes the type from the value, and a name can later refer to a value of a different type.</p>
<pre><code class="language-python">tuoi = 20
diem = 8.5
ten = "An"
dat = True
print(tuoi, diem, ten, dat)
print(type(tuoi))
print(type(diem))
print(type(ten))
print(type(dat))
print(type("20"))
tuoi = "hai muoi"      # Python cho phep gan lai kieu KHAC
print(tuoi, type(tuoi))
</code></pre>
<div class="out">20 8.5 An True<br>&lt;class 'int'&gt;<br>&lt;class 'float'&gt;<br>&lt;class 'str'&gt;<br>&lt;class 'bool'&gt;<br>&lt;class 'str'&gt;<br><b>hai muoi &lt;class 'str'&gt;</b></div>
<p>Look at line 5 of the output: <code>"20"</code> in quotes is a <strong>str</strong>, not an int. That single distinction causes more first-week errors than anything else.</p>
<div class="diagram"><pre>  tuoi ----+
           |          +---------+
           +--------&gt; |   20    |   the VALUE lives in RAM
                      +---------+   the NAME is just a label pointing at it

  tuoi = "hai muoi"   moves the label to a different value; 20 is now unused</pre></div>
<h3>2.3 Variable names and keywords</h3>
<p>The rules Python enforces: a name may contain letters, digits and <code>_</code>; it may <strong>not</strong> start with a digit; it may not contain a space or <code>-</code>; and it may not be one of the <strong>35 reserved words</strong>. Case matters: <code>Tuoi</code> and <code>tuoi</code> are two different variables.</p>
<pre><code class="language-python">import keyword
print(len(keyword.kwlist), "tu khoa:")
print(keyword.kwlist)
</code></pre>
<div class="out">35 tu khoa:<br><b>['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']</b></div>
<table>
  <thead><tr><th>Name</th><th>Legal?</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td><code>tong_tien</code></td><td>✅ and good</td><td>lowercase, underscores, says what it holds</td></tr>
    <tr><td><code>diem2</code></td><td>✅</td><td>a digit is fine, just not first</td></tr>
    <tr><td><code>2diem</code></td><td>❌</td><td>starts with a digit</td></tr>
    <tr><td><code>tong tien</code></td><td>❌</td><td>contains a space — Python reads two names</td></tr>
    <tr><td><code>tong-tien</code></td><td>❌</td><td><code>-</code> is the minus operator</td></tr>
    <tr><td><code>class</code></td><td>❌</td><td>a reserved word</td></tr>
  </tbody>
</table>
<h3>2.4 Statements</h3>
<p>A <strong>statement</strong> is one instruction Python executes. You have met two: an <em>assignment</em> (<code>x = 5</code>) which produces no output, and an <em>expression statement</em> such as <code>print(x)</code> which does. Statements run top to bottom, one at a time, and a script is nothing more than a list of them.</p>
<h3>Read the book alongside this page</h3>
<div class="khoi-sach">${SACH_PDF(true)}</div>
<p class="ghi-chu">Chapter 2, sections 2.1–2.4 — read them before session 4 and you will spend the class understanding instead of copying.</p>
<div class="pitfall"><b><code>=</code> is not <code>==</code>.</b> <code>x = 5</code> stores; <code>x == 5</code> asks. <b>Quotes turn numbers into text.</b> <code>"20"</code> is a str; <code>"20" * 3</code> gives <code>202020</code>, not 60. <b>Using a name before assigning it</b> gives <code>NameError</code> — assignment must come first, in execution order, not in reading order. <b>Case.</b> <code>Diem = 8</code> then <code>print(diem)</code> is a <code>NameError</code>, and the two names sitting next to each other make it hard to see.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Create variables for a student's name, age, GPA and pass/fail status, then print each value with its type.</p>
<div class="dap-an"><pre><code class="language-python">ten = "An"
tuoi = 20
gpa = 8.5
dat = True
print(ten, type(ten))
print(tuoi, type(tuoi))
print(gpa, type(gpa))
print(dat, type(dat))
</code></pre>
<div class="out">An &lt;class 'str'&gt;<br>20 &lt;class 'int'&gt;<br>8.5 &lt;class 'float'&gt;<br><b>True &lt;class 'bool'&gt;</b></div>
<p>Four values, four different types, and no type was ever declared — Python read it from the value itself.</p></div>
<p><b>E2.</b> Which of these are illegal names, and why: <code>gia_ban</code>, <code>1gia</code>, <code>for</code>, <code>gia ban</code>, <code>_tam</code>?</p>
<div class="dap-an"><p>Illegal: <code>1gia</code> (starts with a digit), <code>for</code> (reserved word), <code>gia ban</code> (space). Legal: <code>gia_ban</code> and <code>_tam</code> — a leading underscore is allowed, and by convention means "internal, do not touch".</p></div>`,
    `<span class="eyebrow">PFP191 · Buổi 4 · CLO2</span>
<h2>Giá trị, kiểu, biến và câu lệnh</h2>
<p class="lead">Học xong buổi này bạn tạo được biến, nói được nó giữ kiểu gì, chứng minh bằng <code>type()</code>, và đặt tên theo cách mà cả Python lẫn người đọc code của bạn đều chấp nhận.</p>
<p class="nhan">${NGUON} · buổi 4 — "Chapter 2. Variables, expressions, and statements (Part 1) — 2.1 Values and types; 2.2 Variables; 2.3 Variable names and keywords; 2.4 Statements"</p>
<h3>2.1 Giá trị và kiểu</h3>
<p><strong>Giá trị</strong> là thứ cơ bản nhất mà chương trình làm việc với: số 20, đoạn chữ "An". Mọi giá trị đều có một <strong>kiểu</strong>, và kiểu quyết định giá trị đó làm được gì. <code>20 + 1</code> là 21; <code>"20" + 1</code> là lỗi, vì chữ và số không cùng một loại dù nhìn giống nhau.</p>
<table>
  <thead><tr><th>Kiểu</th><th>Nghĩa</th><th>Ví dụ</th><th>Viết thế nào</th></tr></thead>
  <tbody>
    <tr><td><code>int</code></td><td>số nguyên</td><td><code>20</code>, <code>-3</code>, <code>0</code></td><td>chữ số, không nháy, không dấu chấm</td></tr>
    <tr><td><code>float</code></td><td>số thực</td><td><code>8.5</code>, <code>-0.25</code></td><td>có dấu chấm thập phân</td></tr>
    <tr><td><code>str</code></td><td>chuỗi (text)</td><td><code>"An"</code>, <code>'20'</code></td><td>nằm trong dấu nháy</td></tr>
    <tr><td><code>bool</code></td><td>đúng hoặc sai</td><td><code>True</code>, <code>False</code></td><td>T và F viết hoa, không nháy</td></tr>
  </tbody>
</table>
<h3>2.2 Biến</h3>
<p><strong>Biến</strong> là một cái tên trỏ tới một giá trị. Dấu <code>=</code> không phải "bằng nhau" — nó là phép <em>gán</em>: "cho cái tên này trỏ tới giá trị kia". Khác C hay Java, bạn không bao giờ khai báo kiểu; Python lấy kiểu từ chính giá trị, và một cái tên về sau có thể trỏ sang giá trị kiểu khác.</p>
<pre><code class="language-python">tuoi = 20
diem = 8.5
ten = "An"
dat = True
print(tuoi, diem, ten, dat)
print(type(tuoi))
print(type(diem))
print(type(ten))
print(type(dat))
print(type("20"))
tuoi = "hai muoi"      # Python cho phep gan lai kieu KHAC
print(tuoi, type(tuoi))
</code></pre>
<div class="out">20 8.5 An True<br>&lt;class 'int'&gt;<br>&lt;class 'float'&gt;<br>&lt;class 'str'&gt;<br>&lt;class 'bool'&gt;<br>&lt;class 'str'&gt;<br><b>hai muoi &lt;class 'str'&gt;</b></div>
<p>Nhìn dòng thứ 5 của kết quả: <code>"20"</code> có nháy là một <strong>str</strong>, không phải int. Riêng chỗ phân biệt đó gây ra nhiều lỗi tuần đầu hơn mọi thứ khác cộng lại.</p>
<div class="diagram"><pre>  tuoi ----+
           |          +---------+
           +--------&gt; |   20    |   GIÁ TRỊ nằm trong RAM
                      +---------+   TÊN chỉ là cái nhãn trỏ vào nó

  tuoi = "hai muoi"   chuyển nhãn sang giá trị khác; số 20 thành vô chủ</pre></div>
<h3>2.3 Tên biến và từ khoá</h3>
<p>Luật Python bắt buộc: tên gồm chữ cái, chữ số và <code>_</code>; <strong>không</strong> được bắt đầu bằng chữ số; không được có dấu cách hay <code>-</code>; và không được là một trong <strong>35 từ khoá</strong>. Phân biệt hoa thường: <code>Tuoi</code> và <code>tuoi</code> là hai biến khác nhau.</p>
<pre><code class="language-python">import keyword
print(len(keyword.kwlist), "tu khoa:")
print(keyword.kwlist)
</code></pre>
<div class="out">35 tu khoa:<br><b>['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']</b></div>
<table>
  <thead><tr><th>Tên</th><th>Hợp lệ?</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td><code>tong_tien</code></td><td>✅ và hay</td><td>chữ thường, gạch dưới, nói rõ nó chứa gì</td></tr>
    <tr><td><code>diem2</code></td><td>✅</td><td>có chữ số được, chỉ là không được đứng đầu</td></tr>
    <tr><td><code>2diem</code></td><td>❌</td><td>bắt đầu bằng chữ số</td></tr>
    <tr><td><code>tong tien</code></td><td>❌</td><td>có dấu cách — Python đọc thành hai cái tên</td></tr>
    <tr><td><code>tong-tien</code></td><td>❌</td><td><code>-</code> là toán tử trừ</td></tr>
    <tr><td><code>class</code></td><td>❌</td><td>là từ khoá</td></tr>
  </tbody>
</table>
<h3>2.4 Câu lệnh</h3>
<p><strong>Câu lệnh</strong> là một chỉ thị Python thực thi. Bạn đã gặp hai loại: một phép <em>gán</em> (<code>x = 5</code>) không in ra gì, và một <em>câu lệnh biểu thức</em> như <code>print(x)</code> thì có. Câu lệnh chạy từ trên xuống, mỗi lần một cái, và một script chẳng qua là một danh sách câu lệnh.</p>
<h3>Đọc sách song song với trang này</h3>
<div class="khoi-sach">${SACH_PDF(false)}</div>
<p class="ghi-chu">Chương 2, mục 2.1–2.4 — đọc trước buổi 4 thì vào lớp bạn dành thời gian để HIỂU chứ không phải để chép.</p>
<div class="pitfall"><b><code>=</code> không phải <code>==</code>.</b> <code>x = 5</code> là cất vào; <code>x == 5</code> là hỏi. <b>Dấu nháy biến số thành chữ.</b> <code>"20"</code> là str; <code>"20" * 3</code> ra <code>202020</code>, không phải 60. <b>Dùng tên trước khi gán</b> cho <code>NameError</code> — phép gán phải tới trước theo thứ tự CHẠY, không phải thứ tự đọc. <b>Hoa thường.</b> <code>Diem = 8</code> rồi <code>print(diem)</code> là <code>NameError</code>, mà hai cái tên nằm cạnh nhau thì rất khó nhìn ra.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Tạo biến cho tên, tuổi, điểm GPA và trạng thái đạt/trượt của một sinh viên, rồi in từng giá trị kèm kiểu của nó.</p>
<div class="dap-an"><pre><code class="language-python">ten = "An"
tuoi = 20
gpa = 8.5
dat = True
print(ten, type(ten))
print(tuoi, type(tuoi))
print(gpa, type(gpa))
print(dat, type(dat))
</code></pre>
<div class="out">An &lt;class 'str'&gt;<br>20 &lt;class 'int'&gt;<br>8.5 &lt;class 'float'&gt;<br><b>True &lt;class 'bool'&gt;</b></div>
<p>Bốn giá trị, bốn kiểu khác nhau, và không chỗ nào khai báo kiểu — Python đọc kiểu từ chính giá trị.</p></div>
<p><b>E2.</b> Trong các tên sau, cái nào KHÔNG hợp lệ và vì sao: <code>gia_ban</code>, <code>1gia</code>, <code>for</code>, <code>gia ban</code>, <code>_tam</code>?</p>
<div class="dap-an"><p>Không hợp lệ: <code>1gia</code> (bắt đầu bằng chữ số), <code>for</code> (từ khoá), <code>gia ban</code> (có dấu cách). Hợp lệ: <code>gia_ban</code> và <code>_tam</code> — gạch dưới đứng đầu được phép, và theo quy ước nó mang nghĩa "dùng nội bộ, đừng đụng vào".</p></div>`,
  ]]);

/* ── 1.4 buổi 5 ───────────────────────────────────────────────────────────── */
const l14 = doc('pfp191-1-4-toan-tu-va-bieu-thuc',
  '1.4 — Operators, operands and expressions|||1.4 — Toán tử, toán hạng và biểu thức',
  'Buổi 5, CLO2, PY4E 2.5–2.6: bảy toán tử số học của Python, toán hạng, biểu thức là gì, khác biệt / và // (float vs int), luỹ thừa **. Code chạy thật kèm type() của kết quả.',
  [[
    `<span class="eyebrow">PFP191 · Session 5 · CLO2</span>
<h2>Operators, operands and expressions</h2>
<p class="lead">After this session you can read any arithmetic line in Python and say both the value it produces and the <em>type</em> it produces — which is not the same question.</p>
<p class="nhan">${NGUON} · buổi 5 — "2.5 Operators and operands; 2.6 Expressions"</p>
<h3>2.5 Operators and operands</h3>
<p>An <strong>operator</strong> is a symbol that performs a computation; the values it works on are the <strong>operands</strong>. In <code>7 + 2</code>, the operator is <code>+</code> and the operands are 7 and 2. Python has seven arithmetic operators, and two of them surprise people coming from a calculator.</p>
<table>
  <thead><tr><th>Operator</th><th>Name</th><th>Example</th><th>Result</th><th>Result type</th></tr></thead>
  <tbody>
    <tr><td><code>+</code></td><td>addition</td><td><code>7 + 2</code></td><td>9</td><td>int</td></tr>
    <tr><td><code>-</code></td><td>subtraction</td><td><code>7 - 2</code></td><td>5</td><td>int</td></tr>
    <tr><td><code>*</code></td><td>multiplication</td><td><code>7 * 2</code></td><td>14</td><td>int</td></tr>
    <tr><td><code>/</code></td><td>division</td><td><code>7 / 2</code></td><td>3.5</td><td><strong>always float</strong></td></tr>
    <tr><td><code>//</code></td><td>floor division</td><td><code>7 // 2</code></td><td>3</td><td>int</td></tr>
    <tr><td><code>%</code></td><td>modulus (remainder)</td><td><code>7 % 2</code></td><td>1</td><td>int</td></tr>
    <tr><td><code>**</code></td><td>power</td><td><code>7 ** 2</code></td><td>49</td><td>int</td></tr>
  </tbody>
</table>
<pre><code class="language-python">a = 7
b = 2
print("a + b  =", a + b)
print("a - b  =", a - b)
print("a * b  =", a * b)
print("a / b  =", a / b)
print("a // b =", a // b)
print("a % b  =", a % b)
print("a ** b =", a ** b)
print("type(a / b)  =", type(a / b))
print("type(a // b) =", type(a // b))
</code></pre>
<div class="out">a + b&nbsp;&nbsp;= 9<br>a - b&nbsp;&nbsp;= 5<br>a * b&nbsp;&nbsp;= 14<br>a / b&nbsp;&nbsp;= 3.5<br>a // b = 3<br>a % b&nbsp;&nbsp;= 1<br>a ** b = 49<br>type(a / b)&nbsp;&nbsp;= &lt;class 'float'&gt;<br><b>type(a // b) = &lt;class 'int'&gt;</b></div>
<p>The last two lines are the point of this session. <code>/</code> gives a <strong>float even when the division is exact</strong> — <code>6 / 2</code> is <code>3.0</code>, not <code>3</code>. If you need a whole number, use <code>//</code>.</p>
<h3>2.6 Expressions</h3>
<p>An <strong>expression</strong> is any combination of values, variables and operators that Python can reduce to a single value. <code>20</code> is an expression. <code>a</code> is an expression. <code>a * 2 + 1</code> is an expression. Python <em>evaluates</em> it — replaces it with its value — and then does whatever the surrounding statement says with that value.</p>
<div class="diagram"><pre>  tong = gia * so_luong + phi
         \\_______________________/
          an EXPRESSION: Python reduces it to ONE value first,
          then the assignment stores that value in "tong"</pre></div>
<div class="note-ct">A habit worth building now (ours, not the syllabus): when a line confuses you, put it at the <code>&gt;&gt;&gt;</code> prompt on its own and press Enter. An expression answers immediately, with no <code>print()</code> needed. Ten seconds there beats ten minutes of staring.</div>
<div class="pitfall"><b><code>/</code> always returns a float.</b> <code>10 / 5</code> is <code>2.0</code>. Printing "you have 2.0 items" looks broken; use <code>//</code> for counts. <b><code>//</code> rounds toward minus infinity, not toward zero.</b> <code>-7 // 2</code> is <code>-4</code>, not <code>-3</code>. <b>Dividing by zero is a runtime error</b> — <code>ZeroDivisionError</code> — and it stops the program. <b>Mixing int and float gives float.</b> <code>3 + 0.0</code> is <code>3.0</code>.</div>
<h3>Exercise</h3>
<p><b>E1.</b> A shop sells 3 items at 25,000 each. Print the total, and print the price per item if that total were split between 2 people (a real number is fine here).</p>
<div class="dap-an"><pre><code class="language-python">gia = 25000
so_luong = 3
tong = gia * so_luong
print("Tong =", tong)
print("Chia doi =", tong / 2)
</code></pre>
<div class="out">Tong = 75000<br><b>Chia doi = 37500.0</b></div>
<p>Note the <code>.0</code>: <code>/</code> produced a float even though 75000 divides evenly by 2.</p></div>
<p><b>E2.</b> Without running it, what is <code>type(4 ** 2)</code> and <code>type(4 / 2)</code>?</p>
<div class="dap-an"><p><code>4 ** 2</code> is <code>16</code>, an <b>int</b>. <code>4 / 2</code> is <code>2.0</code>, a <b>float</b> — <code>/</code> is the only arithmetic operator that changes the type no matter what the operands are.</p></div>`,
    `<span class="eyebrow">PFP191 · Buổi 5 · CLO2</span>
<h2>Toán tử, toán hạng và biểu thức</h2>
<p class="lead">Học xong buổi này bạn đọc được mọi dòng tính toán trong Python và nói được cả giá trị nó tạo ra lẫn <em>kiểu</em> nó tạo ra — hai câu hỏi khác nhau.</p>
<p class="nhan">${NGUON} · buổi 5 — "2.5 Operators and operands; 2.6 Expressions"</p>
<h3>2.5 Toán tử và toán hạng</h3>
<p><strong>Toán tử</strong> là ký hiệu thực hiện một phép tính; các giá trị nó tác động lên là <strong>toán hạng</strong>. Trong <code>7 + 2</code>, toán tử là <code>+</code> và toán hạng là 7 với 2. Python có bảy toán tử số học, và hai trong số đó làm người quen dùng máy tính bỏ túi bất ngờ.</p>
<table>
  <thead><tr><th>Toán tử</th><th>Tên</th><th>Ví dụ</th><th>Kết quả</th><th>Kiểu kết quả</th></tr></thead>
  <tbody>
    <tr><td><code>+</code></td><td>cộng</td><td><code>7 + 2</code></td><td>9</td><td>int</td></tr>
    <tr><td><code>-</code></td><td>trừ</td><td><code>7 - 2</code></td><td>5</td><td>int</td></tr>
    <tr><td><code>*</code></td><td>nhân</td><td><code>7 * 2</code></td><td>14</td><td>int</td></tr>
    <tr><td><code>/</code></td><td>chia</td><td><code>7 / 2</code></td><td>3.5</td><td><strong>LUÔN là float</strong></td></tr>
    <tr><td><code>//</code></td><td>chia lấy nguyên</td><td><code>7 // 2</code></td><td>3</td><td>int</td></tr>
    <tr><td><code>%</code></td><td>chia lấy dư (modulo)</td><td><code>7 % 2</code></td><td>1</td><td>int</td></tr>
    <tr><td><code>**</code></td><td>luỹ thừa</td><td><code>7 ** 2</code></td><td>49</td><td>int</td></tr>
  </tbody>
</table>
<pre><code class="language-python">a = 7
b = 2
print("a + b  =", a + b)
print("a - b  =", a - b)
print("a * b  =", a * b)
print("a / b  =", a / b)
print("a // b =", a // b)
print("a % b  =", a % b)
print("a ** b =", a ** b)
print("type(a / b)  =", type(a / b))
print("type(a // b) =", type(a // b))
</code></pre>
<div class="out">a + b&nbsp;&nbsp;= 9<br>a - b&nbsp;&nbsp;= 5<br>a * b&nbsp;&nbsp;= 14<br>a / b&nbsp;&nbsp;= 3.5<br>a // b = 3<br>a % b&nbsp;&nbsp;= 1<br>a ** b = 49<br>type(a / b)&nbsp;&nbsp;= &lt;class 'float'&gt;<br><b>type(a // b) = &lt;class 'int'&gt;</b></div>
<p>Hai dòng cuối mới là điểm chính của buổi này. <code>/</code> cho ra <strong>float kể cả khi chia hết</strong> — <code>6 / 2</code> là <code>3.0</code>, không phải <code>3</code>. Cần số nguyên thì dùng <code>//</code>.</p>
<h3>2.6 Biểu thức</h3>
<p><strong>Biểu thức</strong> là bất kỳ tổ hợp nào của giá trị, biến và toán tử mà Python rút gọn được về một giá trị duy nhất. <code>20</code> là biểu thức. <code>a</code> là biểu thức. <code>a * 2 + 1</code> là biểu thức. Python <em>tính</em> nó — thay nó bằng giá trị của nó — rồi câu lệnh bao quanh mới làm gì đó với giá trị ấy.</p>
<div class="diagram"><pre>  tong = gia * so_luong + phi
         \\_______________________/
          một BIỂU THỨC: Python rút về MỘT giá trị trước,
          rồi phép gán mới cất giá trị đó vào "tong"</pre></div>
<div class="note-ct">Một thói quen nên tập ngay (của web, không phải syllabus): dòng nào làm bạn rối thì đem nó ra dấu nhắc <code>&gt;&gt;&gt;</code> đứng một mình rồi Enter. Biểu thức trả lời ngay, không cần <code>print()</code>. Mười giây ở đó hơn mười phút ngồi nhìn.</div>
<div class="pitfall"><b><code>/</code> luôn trả về float.</b> <code>10 / 5</code> là <code>2.0</code>. In ra "ban co 2.0 mon hang" thì trông như hỏng; đếm thì dùng <code>//</code>. <b><code>//</code> làm tròn xuống phía âm vô cực, không phải về phía 0.</b> <code>-7 // 2</code> là <code>-4</code>, không phải <code>-3</code>. <b>Chia cho 0 là lỗi lúc chạy</b> — <code>ZeroDivisionError</code> — và nó dừng chương trình. <b>Trộn int với float ra float.</b> <code>3 + 0.0</code> là <code>3.0</code>.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Một cửa hàng bán 3 món, mỗi món 25.000. In tổng tiền, và in số tiền mỗi người nếu chia đôi tổng đó cho 2 người (ở đây ra số thực là được).</p>
<div class="dap-an"><pre><code class="language-python">gia = 25000
so_luong = 3
tong = gia * so_luong
print("Tong =", tong)
print("Chia doi =", tong / 2)
</code></pre>
<div class="out">Tong = 75000<br><b>Chia doi = 37500.0</b></div>
<p>Để ý cái <code>.0</code>: <code>/</code> cho ra float dù 75000 chia hết cho 2.</p></div>
<p><b>E2.</b> Không chạy, hãy cho biết <code>type(4 ** 2)</code> và <code>type(4 / 2)</code> là gì?</p>
<div class="dap-an"><p><code>4 ** 2</code> là <code>16</code>, kiểu <b>int</b>. <code>4 / 2</code> là <code>2.0</code>, kiểu <b>float</b> — <code>/</code> là toán tử số học duy nhất đổi kiểu bất kể toán hạng là gì.</p></div>`,
  ]]);

/* ── 1.5 buổi 6 ───────────────────────────────────────────────────────────── */
const l15 = doc('pfp191-1-5-uu-tien-modulo-chuoi',
  '1.5 — Order of operations, modulus, string operations|||1.5 — Thứ tự ưu tiên, toán tử chia lấy dư, thao tác chuỗi',
  'Buổi 6, CLO2, PY4E 2.7–2.9: thứ tự ưu tiên PEMDAS và hai chỗ Python khác thói quen (2**3**2, -2**2), modulo dùng để tách giờ-phút-giây và kiểm chẵn lẻ, + và * trên chuỗi. Code chạy thật.',
  [[
    `<span class="eyebrow">PFP191 · Session 6 · CLO2</span>
<h2>Order of operations, modulus, and strings that add and multiply</h2>
<p class="lead">After this session you can predict the value of a mixed arithmetic line without running it, use <code>%</code> to split a number into parts, and know exactly what <code>+</code> and <code>*</code> do when the operands are text.</p>
<p class="nhan">${NGUON} · buổi 6 — "Chapter 2 (Part 2) — 2.7 Order of operations; 2.8 Modulus operator; 2.9 String operations"</p>
<h3>2.7 Order of operations</h3>
<p>When several operators appear in one expression, Python applies them in a fixed order — <strong>PEMDAS</strong>.</p>
<table>
  <thead><tr><th>Priority</th><th>Operator</th><th>Grouping when tied</th></tr></thead>
  <tbody>
    <tr><td>1 (highest)</td><td><code>( )</code> parentheses</td><td>innermost first</td></tr>
    <tr><td>2</td><td><code>**</code> power</td><td><strong>right to left</strong></td></tr>
    <tr><td>3</td><td>unary <code>-</code> (negation)</td><td>—</td></tr>
    <tr><td>4</td><td><code>*</code> <code>/</code> <code>//</code> <code>%</code></td><td>left to right</td></tr>
    <tr><td>5 (lowest)</td><td><code>+</code> <code>-</code></td><td>left to right</td></tr>
  </tbody>
</table>
<pre><code class="language-python">print("2 + 3 * 4       =", 2 + 3 * 4)
print("(2 + 3) * 4     =", (2 + 3) * 4)
print("2 ** 3 ** 2     =", 2 ** 3 ** 2)
print("-2 ** 2         =", -2 ** 2)
print("7 // 2 * 2 + 7 % 2 =", 7 // 2 * 2 + 7 % 2)
giay = 3725
print("gio  =", giay // 3600)
print("phut =", giay % 3600 // 60)
print("giay =", giay % 60)
print("9 chan?  ", 9 % 2 == 0)
</code></pre>
<div class="out">2 + 3 * 4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 14<br>(2 + 3) * 4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 20<br>2 ** 3 ** 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 512<br>-2 ** 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -4<br>7 // 2 * 2 + 7 % 2 = 7<br>gio&nbsp;&nbsp;= 1<br>phut = 2<br>giay = 5<br><b>9 chan?&nbsp;&nbsp;&nbsp;False</b></div>
<p>Two of those lines are the reason this section exists. <code>2 ** 3 ** 2</code> is <strong>512</strong>, not 64 — <code>**</code> groups right to left, so it is 2<sup>(3<sup>2</sup>)</sup> = 2<sup>9</sup>. And <code>-2 ** 2</code> is <strong>-4</strong>, not 4 — the power binds tighter than the minus sign, so it means <code>-(2 ** 2)</code>.</p>
<h3>2.8 The modulus operator</h3>
<p><code>%</code> gives the <strong>remainder</strong> of a division, and it is far more useful than it sounds. Three jobs you will do with it all semester:</p>
<table>
  <thead><tr><th>Question</th><th>Expression</th><th>Why it works</th></tr></thead>
  <tbody>
    <tr><td>Is <code>n</code> even?</td><td><code>n % 2 == 0</code></td><td>even numbers leave no remainder when halved</td></tr>
    <tr><td>Last digit of <code>n</code></td><td><code>n % 10</code></td><td>what is left after removing all the tens</td></tr>
    <tr><td>Split 3725 seconds</td><td><code>// 3600</code>, <code>% 3600 // 60</code>, <code>% 60</code></td><td><code>//</code> takes the whole units, <code>%</code> keeps the leftovers</td></tr>
  </tbody>
</table>
<p>Read the output above: 3725 seconds is 1 hour, 2 minutes, 5 seconds. Check it by hand — 3600 + 120 + 5 = 3725. This <code>//</code> and <code>%</code> pair is how every "convert into units" problem is solved, and it appears in Practical Exams.</p>
<h3>2.9 String operations</h3>
<p>Two arithmetic operators also work on text, and they do something sensible rather than something numeric.</p>
<pre><code class="language-python">print("Py" + "thon")
print("ab" * 3)
print("-" * 20)
ho = "Nguyen"
ten = "An"
print(ho + " " + ten)
print(len(ho + ten))
# print("tuoi: " + 20)   # loi TypeError
print("tuoi: " + str(20))
</code></pre>
<div class="out">Python<br>ababab<br>--------------------<br>Nguyen An<br>8<br><b>tuoi: 20</b></div>
<ul>
<li><code>+</code> on two strings is <strong>concatenation</strong> — gluing, not adding. <code>"2" + "3"</code> is <code>"23"</code>.</li>
<li><code>*</code> on a string and an int is <strong>repetition</strong>. <code>"-" * 20</code> is the cheapest way to draw a separator line.</li>
<li><code>+</code> on a string and a number is a <strong>TypeError</strong>. Convert first with <code>str()</code>.</li>
</ul>
<div class="note-ct">Notice the third line of output: <code>"-" * 20</code> printed exactly 20 dashes. In the Lab you will use it for table borders. That is the whole trick — no loop needed.</div>
<div class="pitfall"><b><code>2 ** 3 ** 2</code> is 512.</b> Power is the only operator that groups right to left. When in doubt, add parentheses; nobody has ever been marked down for clarity. <b><code>-2 ** 2</code> is -4.</b> Write <code>(-2) ** 2</code> if you meant 4. <b><code>"2" + "3"</code> is "23".</b> If your total comes out as a suspiciously long number, one of your operands is still a string. <b><code>"abc" * "2"</code> is a TypeError</b> — repetition needs an int on one side.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Draw a hollow rectangle 12 characters wide and 3 lines tall using only string repetition — no loops.</p>
<div class="dap-an"><pre><code class="language-python">RONG = 12
print("*" * RONG)
print("*" + " " * (RONG - 2) + "*")
print("*" * RONG)
</code></pre>
<div class="out">************<br>*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br><b>************</b></div>
<p><code>RONG - 2</code> because the two <code>*</code> at the ends already take two of the twelve columns. Naming the width as a constant means changing one number changes all three lines.</p></div>
<p><b>E2.</b> Convert 3725 seconds into hours, minutes and seconds.</p>
<div class="dap-an"><pre><code class="language-python">tong_giay = 3725
gio = tong_giay // 3600
phut = tong_giay % 3600 // 60
giay = tong_giay % 60
print(gio, "gio", phut, "phut", giay, "giay")
</code></pre>
<div class="out"><b>1 gio 2 phut 5 giay</b></div>
<p>The pattern is always the same: <code>//</code> to take the whole units out, <code>%</code> to keep what is left for the next unit down.</p></div>`,
    `<span class="eyebrow">PFP191 · Buổi 6 · CLO2</span>
<h2>Thứ tự ưu tiên, chia lấy dư, và chuỗi cũng cộng cũng nhân</h2>
<p class="lead">Học xong buổi này bạn đoán được giá trị của một dòng tính toán trộn nhiều toán tử mà không cần chạy, dùng được <code>%</code> để tách một con số thành nhiều phần, và biết chính xác <code>+</code> với <code>*</code> làm gì khi toán hạng là chữ.</p>
<p class="nhan">${NGUON} · buổi 6 — "Chapter 2 (Part 2) — 2.7 Order of operations; 2.8 Modulus operator; 2.9 String operations"</p>
<h3>2.7 Thứ tự ưu tiên</h3>
<p>Khi một biểu thức có nhiều toán tử, Python áp dụng chúng theo một thứ tự cố định — <strong>PEMDAS</strong>.</p>
<table>
  <thead><tr><th>Ưu tiên</th><th>Toán tử</th><th>Khi bằng nhau thì nhóm thế nào</th></tr></thead>
  <tbody>
    <tr><td>1 (cao nhất)</td><td><code>( )</code> ngoặc</td><td>trong cùng trước</td></tr>
    <tr><td>2</td><td><code>**</code> luỹ thừa</td><td><strong>từ phải sang trái</strong></td></tr>
    <tr><td>3</td><td><code>-</code> một toán hạng (đổi dấu)</td><td>—</td></tr>
    <tr><td>4</td><td><code>*</code> <code>/</code> <code>//</code> <code>%</code></td><td>trái sang phải</td></tr>
    <tr><td>5 (thấp nhất)</td><td><code>+</code> <code>-</code></td><td>trái sang phải</td></tr>
  </tbody>
</table>
<pre><code class="language-python">print("2 + 3 * 4       =", 2 + 3 * 4)
print("(2 + 3) * 4     =", (2 + 3) * 4)
print("2 ** 3 ** 2     =", 2 ** 3 ** 2)
print("-2 ** 2         =", -2 ** 2)
print("7 // 2 * 2 + 7 % 2 =", 7 // 2 * 2 + 7 % 2)
giay = 3725
print("gio  =", giay // 3600)
print("phut =", giay % 3600 // 60)
print("giay =", giay % 60)
print("9 chan?  ", 9 % 2 == 0)
</code></pre>
<div class="out">2 + 3 * 4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 14<br>(2 + 3) * 4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 20<br>2 ** 3 ** 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 512<br>-2 ** 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -4<br>7 // 2 * 2 + 7 % 2 = 7<br>gio&nbsp;&nbsp;= 1<br>phut = 2<br>giay = 5<br><b>9 chan?&nbsp;&nbsp;&nbsp;False</b></div>
<p>Hai trong số các dòng đó chính là lý do mục này tồn tại. <code>2 ** 3 ** 2</code> ra <strong>512</strong>, không phải 64 — <code>**</code> nhóm từ phải sang trái, nên nó là 2<sup>(3<sup>2</sup>)</sup> = 2<sup>9</sup>. Và <code>-2 ** 2</code> ra <strong>-4</strong>, không phải 4 — luỹ thừa bám chặt hơn dấu trừ, nên nó nghĩa là <code>-(2 ** 2)</code>.</p>
<h3>2.8 Toán tử chia lấy dư</h3>
<p><code>%</code> cho <strong>số dư</strong> của phép chia, và nó hữu dụng hơn nhiều so với cái tên của nó. Ba việc bạn sẽ làm với nó suốt cả kỳ:</p>
<table>
  <thead><tr><th>Câu hỏi</th><th>Biểu thức</th><th>Vì sao chạy đúng</th></tr></thead>
  <tbody>
    <tr><td><code>n</code> có chẵn không?</td><td><code>n % 2 == 0</code></td><td>số chẵn chia 2 không còn dư</td></tr>
    <tr><td>Chữ số cuối của <code>n</code></td><td><code>n % 10</code></td><td>phần còn lại sau khi bỏ hết các chục</td></tr>
    <tr><td>Tách 3725 giây</td><td><code>// 3600</code>, <code>% 3600 // 60</code>, <code>% 60</code></td><td><code>//</code> lấy trọn đơn vị, <code>%</code> giữ phần dư lại</td></tr>
  </tbody>
</table>
<p>Đọc kết quả ở trên: 3725 giây là 1 giờ, 2 phút, 5 giây. Kiểm lại bằng tay — 3600 + 120 + 5 = 3725. Cặp <code>//</code> và <code>%</code> này là cách giải mọi bài "đổi về đơn vị", và nó có mặt trong đề thi thực hành.</p>
<h3>2.9 Thao tác trên chuỗi</h3>
<p>Hai toán tử số học cũng làm việc được với chữ, và chúng làm một việc hợp lý chứ không phải một việc số học.</p>
<pre><code class="language-python">print("Py" + "thon")
print("ab" * 3)
print("-" * 20)
ho = "Nguyen"
ten = "An"
print(ho + " " + ten)
print(len(ho + ten))
# print("tuoi: " + 20)   # loi TypeError
print("tuoi: " + str(20))
</code></pre>
<div class="out">Python<br>ababab<br>--------------------<br>Nguyen An<br>8<br><b>tuoi: 20</b></div>
<ul>
<li><code>+</code> giữa hai chuỗi là <strong>nối chuỗi (concatenation)</strong> — dán lại, không phải cộng. <code>"2" + "3"</code> ra <code>"23"</code>.</li>
<li><code>*</code> giữa chuỗi và số nguyên là <strong>lặp chuỗi</strong>. <code>"-" * 20</code> là cách rẻ nhất để vẽ một đường kẻ.</li>
<li><code>+</code> giữa chuỗi và số là <strong>TypeError</strong>. Phải đổi trước bằng <code>str()</code>.</li>
</ul>
<div class="note-ct">Để ý dòng thứ ba của kết quả: <code>"-" * 20</code> in ra đúng 20 dấu gạch. Trong bài Lab bạn sẽ dùng nó để kẻ viền bảng. Chỉ có thế thôi — không cần vòng lặp nào.</div>
<div class="pitfall"><b><code>2 ** 3 ** 2</code> là 512.</b> Luỹ thừa là toán tử duy nhất nhóm từ phải sang trái. Không chắc thì thêm ngoặc; chưa ai bị trừ điểm vì viết rõ ràng. <b><code>-2 ** 2</code> là -4.</b> Muốn ra 4 thì viết <code>(-2) ** 2</code>. <b><code>"2" + "3"</code> là "23".</b> Nếu tổng của bạn ra một con số dài đáng ngờ, nghĩa là một toán hạng vẫn còn là chuỗi. <b><code>"abc" * "2"</code> là TypeError</b> — lặp chuỗi cần một bên là int.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Vẽ một khung chữ nhật rỗng rộng 12 ký tự, cao 3 dòng, chỉ dùng phép lặp chuỗi — không dùng vòng lặp.</p>
<div class="dap-an"><pre><code class="language-python">RONG = 12
print("*" * RONG)
print("*" + " " * (RONG - 2) + "*")
print("*" * RONG)
</code></pre>
<div class="out">************<br>*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br><b>************</b></div>
<p><code>RONG - 2</code> vì hai dấu <code>*</code> ở hai đầu đã chiếm hai trong mười hai cột. Đặt chiều rộng thành một hằng số nghĩa là đổi một con số thì cả ba dòng đổi theo.</p></div>
<p><b>E2.</b> Đổi 3725 giây thành giờ, phút, giây.</p>
<div class="dap-an"><pre><code class="language-python">tong_giay = 3725
gio = tong_giay // 3600
phut = tong_giay % 3600 // 60
giay = tong_giay % 60
print(gio, "gio", phut, "phut", giay, "giay")
</code></pre>
<div class="out"><b>1 gio 2 phut 5 giay</b></div>
<p>Khuôn luôn giống nhau: <code>//</code> để lấy trọn đơn vị ra, <code>%</code> để giữ phần còn lại cho đơn vị nhỏ hơn kế tiếp.</p></div>`,
  ]]);

/* ── 1.6 buổi 7 ───────────────────────────────────────────────────────────── */
const l16 = doc('pfp191-1-6-input-chu-thich-debug',
  '1.6 — input(), comments, mnemonic names, debugging|||1.6 — input(), chú thích, tên biến dễ nhớ, gỡ lỗi',
  'Buổi 7, CLO2, PY4E 2.10–2.13: input() luôn trả về chuỗi và cách ép kiểu, TypeError kinh điển với traceback thật, chú thích giải thích VÌ SAO, đặt tên biến có nghĩa, bốn bước gỡ lỗi.',
  [[
    `<span class="eyebrow">PFP191 · Session 7 · CLO2</span>
<h2>Getting data from the user — and the error everyone hits</h2>
<p class="lead">After this session you can read a number typed by the user and do arithmetic with it, explain why <code>input()</code> alone is never enough, and write comments a marker will thank you for.</p>
<p class="nhan">${NGUON} · buổi 7 — "2.10 Asking the user for input; 2.11 Comments; 2.12 Choosing mnemonic variable names; 2.13 Debugging"</p>
<h3>2.10 Asking the user for input</h3>
<p><code>input()</code> prints a prompt, waits for the user to type a line and press Enter, and hands you what was typed. One rule decides everything: <strong><code>input()</code> always returns a <code>str</code></strong> — even when the user typed digits.</p>
<pre><code class="language-python">ten = input("Ten cua ban: ")
tuoi_chu = input("Tuoi cua ban: ")
print("Kieu cua tuoi_chu:", type(tuoi_chu))
tuoi = int(tuoi_chu)
print("Chao", ten + ",", "sang nam ban", tuoi + 1, "tuoi")
</code></pre>
<div class="out">Input typed: <b>An</b> then <b>20</b><br>Ten cua ban: Tuoi cua ban: Kieu cua tuoi_chu: &lt;class 'str'&gt;<br><b>Chao An, sang nam ban 21 tuoi</b></div>
<p>Now the version without the conversion — this is the single most common first-month error, so look at the real message:</p>
<pre><code class="language-python">tuoi = input("Tuoi: ")
print(tuoi + 1)
</code></pre>
<div class="out">Input typed: <b>20</b><br>Tuoi: Traceback (most recent call last):<br>&nbsp;&nbsp;File "err.py", line 2, in &lt;module&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;print(tuoi + 1)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~~~~~^~~<br><b>TypeError: can only concatenate str (not "int") to str</b></div>
<p>Read the last line the way Python means it: "<code>+</code> on a str can only glue another str on". The fix is to convert as early as possible — wrap the <code>input()</code> itself:</p>
<pre><code class="language-python">tuoi = int(input("Tuoi cua ban: "))    # doi ngay tai cho nhan du lieu
gpa = float(input("Diem GPA: "))       # so thuc thi dung float
</code></pre>
<h3>2.11 Comments</h3>
<p>Everything after <code>#</code> on a line is ignored by Python. A comment is for the human — and the useful comment explains <strong>why</strong>, not <em>what</em>.</p>
<table>
  <thead><tr><th>Comment</th><th>Verdict</th></tr></thead>
  <tbody>
    <tr><td><code># cong 1 vao tuoi</code> above <code>tuoi = tuoi + 1</code></td><td>useless — the code already says that</td></tr>
    <tr><td><code># quy dinh cua cong vien, khong phai con so tuy y</code> above a discount rate</td><td>useful — it says where the number came from</td></tr>
  </tbody>
</table>
<h3>2.12 Choosing mnemonic variable names</h3>
<p>Python does not care whether you write <code>x</code> or <code>gia_ve_nguoi_lon</code>. Everyone who reads your code does, including you in three weeks, and including the person marking your Lab.</p>
<pre><code class="language-python"># Gia ve vao cong vien: nguoi lon 50k, tre em duoi 12 tuoi giam 40%
GIA_VE_NGUOI_LON = 50000
TI_LE_GIAM_TRE_EM = 0.4     # quy dinh cua cong vien, khong phai con so tuy y

tuoi = int(input("Tuoi khach: "))
if tuoi &lt; 12:
    gia = GIA_VE_NGUOI_LON * (1 - TI_LE_GIAM_TRE_EM)
else:
    gia = GIA_VE_NGUOI_LON
print("Gia ve =", int(gia), "dong")
</code></pre>
<div class="out">Input typed: <b>9</b> → Tuoi khach: <b>Gia ve = 30000 dong</b><br>Input typed: <b>30</b> → Tuoi khach: <b>Gia ve = 50000 dong</b></div>
<p>Compare that with <code>if a &lt; 12: p = b * (1 - c)</code>. Same behaviour, and impossible to check. Convention: <code>snake_case</code> for variables, <code>ALL_CAPS</code> for values that never change.</p>
<h3>2.13 Debugging</h3>
<p>Four moves, cheapest first. <strong>Read the last line of the error</strong> — it names the type and the reason. <strong>Print what you think you have:</strong> <code>print(type(tuoi), repr(tuoi))</code> settles "is this a string?" in one second. <strong>Cut the program in half</strong> until the bug is on one side. <strong>Say the line out loud</strong> in plain Vietnamese; if you cannot, you have found the line you do not understand.</p>
<div class="callout ok">Three error types and their usual cause at this stage: <code>TypeError</code> — you forgot <code>int()</code> around an <code>input()</code>. <code>ValueError</code> — you called <code>int("hai muoi")</code>, i.e. the user typed something that is not a number. <code>NameError</code> — a typo in a variable name, or you used it before assigning it.</div>
<div class="pitfall"><b><code>input()</code> returns a str, always.</b> <code>int(input(...))</code> is the habit to build. <b><code>int("8.5")</code> is a ValueError</b> — <code>int</code> will not accept a decimal point in text. Use <code>float()</code> for decimals. <b>A prompt with no space</b> — <code>input("Tuoi:")</code> — makes the user type right against the colon. Write <code>"Tuoi: "</code>. <b>Converting too late.</b> If you keep the string and convert in five places, you will forget one of them.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Ask for a length and a width in metres, then print the area. Use mnemonic names and one comment that explains a decision.</p>
<div class="dap-an"><pre><code class="language-python"># Dien tich phong, do bang met nen dung float (co the nhap 3.5)
chieu_dai = float(input("Chieu dai (m): "))
chieu_rong = float(input("Chieu rong (m): "))
dien_tich = chieu_dai * chieu_rong
print("Dien tich =", dien_tich, "m2")
</code></pre>
<div class="out">Input typed: <b>3.5</b> then <b>4</b><br>Chieu dai (m): Chieu rong (m): <b>Dien tich = 14.0 m2</b></div>
<p><code>float</code> and not <code>int</code>, because a room can be 3.5 m long — and the comment says exactly that, which is the kind of comment worth writing.</p></div>
<p><b>E2.</b> What error does this produce, and what is the one-word fix?</p>
<pre><code class="language-python">n = input("So: ")
print(n * 2)
</code></pre>
<div class="dap-an"><p>No error at all — and that is worse. If the user types <code>5</code>, it prints <code>55</code>, because <code>n</code> is the string <code>"5"</code> and <code>*</code> on a string repeats it. This is a <b>logic error</b>: it runs and gives the wrong answer. Fix: <code>n = int(input("So: "))</code>.</p></div>`,
    `<span class="eyebrow">PFP191 · Buổi 7 · CLO2</span>
<h2>Lấy dữ liệu từ người dùng — và cái lỗi ai cũng gặp</h2>
<p class="lead">Học xong buổi này bạn đọc được một con số người dùng gõ vào và tính toán được với nó, giải thích được vì sao chỉ <code>input()</code> thì chưa bao giờ đủ, và viết được chú thích mà người chấm sẽ cảm ơn bạn.</p>
<p class="nhan">${NGUON} · buổi 7 — "2.10 Asking the user for input; 2.11 Comments; 2.12 Choosing mnemonic variable names; 2.13 Debugging"</p>
<h3>2.10 Hỏi dữ liệu từ người dùng</h3>
<p><code>input()</code> in ra một lời nhắc, chờ người dùng gõ một dòng rồi Enter, và trao lại cho bạn thứ vừa được gõ. Một luật quyết định tất cả: <strong><code>input()</code> LUÔN trả về <code>str</code></strong> — kể cả khi người dùng gõ chữ số.</p>
<pre><code class="language-python">ten = input("Ten cua ban: ")
tuoi_chu = input("Tuoi cua ban: ")
print("Kieu cua tuoi_chu:", type(tuoi_chu))
tuoi = int(tuoi_chu)
print("Chao", ten + ",", "sang nam ban", tuoi + 1, "tuoi")
</code></pre>
<div class="out">Input đã gõ: <b>An</b> rồi <b>20</b><br>Ten cua ban: Tuoi cua ban: Kieu cua tuoi_chu: &lt;class 'str'&gt;<br><b>Chao An, sang nam ban 21 tuoi</b></div>
<p>Giờ tới bản KHÔNG ép kiểu — đây là lỗi phổ biến nhất của tháng đầu tiên, nên hãy xem thông báo thật:</p>
<pre><code class="language-python">tuoi = input("Tuoi: ")
print(tuoi + 1)
</code></pre>
<div class="out">Input đã gõ: <b>20</b><br>Tuoi: Traceback (most recent call last):<br>&nbsp;&nbsp;File "err.py", line 2, in &lt;module&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;print(tuoi + 1)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~~~~~^~~<br><b>TypeError: can only concatenate str (not "int") to str</b></div>
<p>Hãy đọc dòng cuối theo đúng ý Python: "<code>+</code> trên một str thì chỉ dán được một str khác vào". Cách sửa là ép kiểu càng sớm càng tốt — bọc luôn chính lời gọi <code>input()</code>:</p>
<pre><code class="language-python">tuoi = int(input("Tuoi cua ban: "))    # doi ngay tai cho nhan du lieu
gpa = float(input("Diem GPA: "))       # so thuc thi dung float
</code></pre>
<h3>2.11 Chú thích</h3>
<p>Mọi thứ sau dấu <code>#</code> trên một dòng đều bị Python bỏ qua. Chú thích là để cho người đọc — và chú thích hữu ích là chú thích giải thích <strong>VÌ SAO</strong>, không phải <em>LÀM GÌ</em>.</p>
<table>
  <thead><tr><th>Chú thích</th><th>Đánh giá</th></tr></thead>
  <tbody>
    <tr><td><code># cong 1 vao tuoi</code> đặt trên <code>tuoi = tuoi + 1</code></td><td>vô dụng — code đã nói đúng câu đó rồi</td></tr>
    <tr><td><code># quy dinh cua cong vien, khong phai con so tuy y</code> đặt trên một tỉ lệ giảm giá</td><td>hữu ích — nó cho biết con số đó từ đâu ra</td></tr>
  </tbody>
</table>
<h3>2.12 Chọn tên biến dễ nhớ</h3>
<p>Python không quan tâm bạn viết <code>x</code> hay <code>gia_ve_nguoi_lon</code>. Nhưng mọi người đọc code của bạn thì quan tâm, kể cả chính bạn ba tuần sau, và kể cả người chấm bài Lab của bạn.</p>
<pre><code class="language-python"># Gia ve vao cong vien: nguoi lon 50k, tre em duoi 12 tuoi giam 40%
GIA_VE_NGUOI_LON = 50000
TI_LE_GIAM_TRE_EM = 0.4     # quy dinh cua cong vien, khong phai con so tuy y

tuoi = int(input("Tuoi khach: "))
if tuoi &lt; 12:
    gia = GIA_VE_NGUOI_LON * (1 - TI_LE_GIAM_TRE_EM)
else:
    gia = GIA_VE_NGUOI_LON
print("Gia ve =", int(gia), "dong")
</code></pre>
<div class="out">Input đã gõ: <b>9</b> → Tuoi khach: <b>Gia ve = 30000 dong</b><br>Input đã gõ: <b>30</b> → Tuoi khach: <b>Gia ve = 50000 dong</b></div>
<p>So với <code>if a &lt; 12: p = b * (1 - c)</code>. Hành vi y như nhau, và không thể kiểm được. Quy ước: <code>snake_case</code> cho biến, <code>CHỮ_HOA</code> cho giá trị không bao giờ đổi.</p>
<h3>2.13 Gỡ lỗi</h3>
<p>Bốn bước, rẻ nhất làm trước. <strong>Đọc dòng cuối của thông báo lỗi</strong> — nó ghi loại lỗi và lý do. <strong>In ra thứ bạn nghĩ mình đang có:</strong> <code>print(type(tuoi), repr(tuoi))</code> giải quyết câu "cái này có phải chuỗi không" trong một giây. <strong>Cắt chương trình làm đôi</strong> tới khi con bug nằm hẳn về một phía. <strong>Đọc dòng đó thành tiếng</strong> bằng tiếng Việt bình thường; nếu đọc không nổi thì bạn vừa tìm ra đúng dòng mình chưa hiểu.</p>
<div class="callout ok">Ba loại lỗi và nguyên nhân thường gặp ở giai đoạn này: <code>TypeError</code> — bạn quên <code>int()</code> quanh một <code>input()</code>. <code>ValueError</code> — bạn gọi <code>int("hai muoi")</code>, tức người dùng gõ thứ không phải số. <code>NameError</code> — gõ sai tên biến, hoặc dùng nó trước khi gán.</div>
<div class="pitfall"><b><code>input()</code> trả về str, luôn luôn.</b> <code>int(input(...))</code> là thói quen cần tập. <b><code>int("8.5")</code> là ValueError</b> — <code>int</code> không nhận dấu thập phân trong chuỗi. Số thập phân thì dùng <code>float()</code>. <b>Lời nhắc không có dấu cách</b> — <code>input("Tuoi:")</code> — làm người dùng gõ sát vào dấu hai chấm. Hãy viết <code>"Tuoi: "</code>. <b>Ép kiểu quá muộn.</b> Nếu bạn giữ nguyên chuỗi rồi ép kiểu ở năm chỗ, bạn sẽ quên một chỗ.</div>
<h3>Bài tập</h3>
<p><b>E1.</b> Hỏi chiều dài và chiều rộng theo mét, rồi in diện tích. Dùng tên biến có nghĩa và một chú thích giải thích một quyết định.</p>
<div class="dap-an"><pre><code class="language-python"># Dien tich phong, do bang met nen dung float (co the nhap 3.5)
chieu_dai = float(input("Chieu dai (m): "))
chieu_rong = float(input("Chieu rong (m): "))
dien_tich = chieu_dai * chieu_rong
print("Dien tich =", dien_tich, "m2")
</code></pre>
<div class="out">Input đã gõ: <b>3.5</b> rồi <b>4</b><br>Chieu dai (m): Chieu rong (m): <b>Dien tich = 14.0 m2</b></div>
<p>Dùng <code>float</code> chứ không <code>int</code>, vì một căn phòng có thể dài 3,5 m — và chú thích nói đúng điều đó, đó mới là loại chú thích đáng viết.</p></div>
<p><b>E2.</b> Đoạn này gây ra lỗi gì, và sửa bằng một từ thế nào?</p>
<pre><code class="language-python">n = input("So: ")
print(n * 2)
</code></pre>
<div class="dap-an"><p>Không có lỗi nào cả — và như thế còn tệ hơn. Nếu người dùng gõ <code>5</code>, nó in ra <code>55</code>, vì <code>n</code> là chuỗi <code>"5"</code> và <code>*</code> trên chuỗi là lặp chuỗi. Đây là <b>lỗi logic</b>: chạy được và cho kết quả sai. Sửa: <code>n = int(input("So: "))</code>.</p></div>`,
  ]]);

/* ── 1.7 Lab 1, buổi 8–9 ──────────────────────────────────────────────────── */
const l17 = doc('pfp191-1-7-lab-1',
  '1.7 — Lab 1: a receipt calculator (sessions 8–9)|||1.7 — Lab 1: máy tính hoá đơn (buổi 8–9)',
  'Buổi 8–9, CLO1+CLO2, Lab 1 (2% điểm môn, 90 phút): một chương trình hoàn chỉnh dùng input/ép kiểu/toán tử/hằng số/lặp chuỗi. Có đề, lời giải đã chạy thật, bảng tự kiểm và ba mở rộng.',
  [[
    `<span class="eyebrow">PFP191 · Session 8–9 · CLO1, CLO2</span>
<h2>Lab 1 — put sessions 1–7 into one program</h2>
<p class="lead">Two sessions with a lecturer in the room while you build one small, complete program. After this you can take a worded problem and turn it into working Python without being told which operator to use.</p>
<p class="nhan">${NGUON} · buổi 8 — "Lab 1 assistance" · buổi 9 — "Lab 1 assistance (cont.)" · LO1, LO2 · ITU <span class="badge">U</span></p>
<h3>What the syllabus says about the Labs</h3>
<table>
  <thead><tr><th>Field</th><th>Value (FLM)</th></tr></thead>
  <tbody>
    <tr><td>Weight of all 5 labs</td><td><strong>10%</strong> — so about <strong>2% each</strong></td></tr>
    <tr><td>Duration</td><td>90 minutes each</td></tr>
    <tr><td>CLOs</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Completion criteria</td><td>&gt; 0</td></tr>
    <tr><td>Type</td><td>Review</td></tr>
  </tbody>
</table>
<div class="note-ct">The exact task your lecturer sets is <strong>not published on FLM</strong>, so the exercise below is <strong>ours</strong>, built to use exactly what sessions 1–7 taught and nothing more. Do your lecturer's task for the mark; do this one for the practice.</div>
<h3>The task</h3>
<p>Write a program that prints a drinks-shop receipt. It must ask for the number of cups, the price of one cup, and how much the customer handed over; then print the goods total, 8% VAT, the total payable, and the change.</p>
<p>Constraints, so that it exercises the right things: use <code>int(input(...))</code> for every number; put the VAT rate in an <code>ALL_CAPS</code> constant with a comment saying where the number comes from; draw the two separator lines with string repetition, not by typing dashes.</p>
<h3>Solution</h3>
<div class="dap-an"><pre><code class="language-python"># lab1.py - Lab 1: may tinh hoa don quan nuoc (buoi 8-9, CLO1 + CLO2)
# Yeu cau: nhap so ly, gia mot ly, so tien khach tra
#          in ra tien hang, VAT 8%, tong phai tra, tien thoi lai

TI_LE_VAT = 0.08          # thue VAT 8% theo quy dinh hien hanh

so_ly = int(input("So ly: "))
gia_mot_ly = int(input("Gia mot ly (dong): "))
khach_tra = int(input("Khach tra (dong): "))

tien_hang = so_ly * gia_mot_ly
tien_vat = tien_hang * TI_LE_VAT
tong_phai_tra = tien_hang + tien_vat
tien_thoi = khach_tra - tong_phai_tra

print("-" * 32)
print("So ly        :", so_ly)
print("Tien hang    :", tien_hang)
print("VAT 8%       :", int(tien_vat))
print("Tong phai tra:", int(tong_phai_tra))
print("Tien thoi lai:", int(tien_thoi))
print("-" * 32)
</code></pre>
<div class="out">Input typed: <b>3</b>, <b>25000</b>, <b>100000</b><br>So ly: Gia mot ly (dong): Khach tra (dong): --------------------------------<br>So ly&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 3<br>Tien hang&nbsp;&nbsp;&nbsp;&nbsp;: 75000<br>VAT 8%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 6000<br>Tong phai tra: 81000<br>Tien thoi lai: 19000<br><b>--------------------------------</b></div>
<p>Three decisions worth defending. <strong>Why <code>int(...)</code> around every input</strong> — without it <code>so_ly * gia_mot_ly</code> would multiply two strings and crash. <strong>Why a named constant for 8%</strong> — when the rate changes you edit one line, and the comment tells the next reader the number is a regulation and not a guess. <strong>Why <code>int(tien_vat)</code> when printing</strong> — <code>75000 * 0.08</code> is a float, so it would print <code>6000.0</code>; money in đồng has no decimals.</p></div>
<h3>Check your own work before you submit</h3>
<table>
  <thead><tr><th>Check</th><th>How</th></tr></thead>
  <tbody>
    <tr><td>Arithmetic is right</td><td>3 × 25,000 = 75,000 · 8% of that = 6,000 · total 81,000 · change from 100,000 = 19,000. Do it on paper.</td></tr>
    <tr><td>No crash on a plain run</td><td>run it once, typing normal numbers</td></tr>
    <tr><td>Nothing is a string that should be a number</td><td>if the goods total looks like <code>32500002500000</code> you forgot an <code>int()</code></td></tr>
    <tr><td>Names readable</td><td>could a classmate read it without you narrating?</td></tr>
  </tbody>
</table>
<h3>Three extensions — try them, they are the level of the Practical Exam</h3>
<ol>
<li>Print the price of a single cup <em>including</em> VAT, as a real number.</li>
<li>If the customer handed over less than the total, the change comes out negative. Print it anyway — do not hide it; deciding what to do instead needs <code>if</code>, which is session 10.</li>
<li>Put the shop name in a constant and centre it over the 32-dash line using string repetition.</li>
</ol>
<div class="pitfall"><b>Forgetting <code>int()</code> on one of the three inputs.</b> The program does not fail where you forgot — it fails a few lines later, which is why you should convert at the input line. <b><code>int()</code> truncates, it does not round.</b> <code>int(6499.9)</code> is 6499. For money in this lab that is fine; say so in a comment rather than leaving it to chance. <b>Hard-coding 0.08 in three places.</b> Then the rate changes and you fix two of them. <b>Typing 32 dashes by hand.</b> It looks identical and it is one typo away from being 31.</div>`,
    `<span class="eyebrow">PFP191 · Buổi 8–9 · CLO1, CLO2</span>
<h2>Lab 1 — dồn buổi 1–7 vào một chương trình</h2>
<p class="lead">Hai buổi có giảng viên ngồi trong lớp trong lúc bạn dựng một chương trình nhỏ nhưng hoàn chỉnh. Xong bài này bạn lấy được một đề bài viết bằng lời và biến nó thành Python chạy được, mà không cần ai chỉ dùng toán tử nào.</p>
<p class="nhan">${NGUON} · buổi 8 — "Lab 1 assistance" · buổi 9 — "Lab 1 assistance (cont.)" · LO1, LO2 · ITU <span class="badge">U</span></p>
<h3>Syllabus nói gì về các bài Lab</h3>
<table>
  <thead><tr><th>Mục</th><th>Giá trị (FLM)</th></tr></thead>
  <tbody>
    <tr><td>Trọng số cả 5 bài Lab</td><td><strong>10%</strong> — nên khoảng <strong>2% mỗi bài</strong></td></tr>
    <tr><td>Thời lượng</td><td>90 phút mỗi bài</td></tr>
    <tr><td>CLO</td><td>CLO1 – CLO7</td></tr>
    <tr><td>Tiêu chí đạt</td><td>&gt; 0</td></tr>
    <tr><td>Dạng</td><td>Review</td></tr>
  </tbody>
</table>
<div class="note-ct">Đề cụ thể giảng viên giao <strong>không được công bố trên FLM</strong>, nên bài tập dưới đây là <strong>của web</strong>, soạn để dùng đúng những gì buổi 1–7 đã dạy và không hơn. Hãy làm đề của giảng viên để lấy điểm; làm đề này để lấy tay nghề.</div>
<h3>Đề bài</h3>
<p>Viết chương trình in hoá đơn cho một quán nước. Chương trình phải hỏi số ly, giá một ly, và số tiền khách đưa; rồi in tiền hàng, VAT 8%, tổng phải trả, và tiền thối lại.</p>
<p>Ràng buộc, để bài tập luyện đúng chỗ cần luyện: mọi con số phải nhập bằng <code>int(input(...))</code>; đặt tỉ lệ VAT vào một hằng số <code>CHỮ_HOA</code> kèm chú thích nói con số đó từ đâu ra; vẽ hai đường kẻ bằng phép lặp chuỗi, không gõ tay từng dấu gạch.</p>
<h3>Lời giải</h3>
<div class="dap-an"><pre><code class="language-python"># lab1.py - Lab 1: may tinh hoa don quan nuoc (buoi 8-9, CLO1 + CLO2)
# Yeu cau: nhap so ly, gia mot ly, so tien khach tra
#          in ra tien hang, VAT 8%, tong phai tra, tien thoi lai

TI_LE_VAT = 0.08          # thue VAT 8% theo quy dinh hien hanh

so_ly = int(input("So ly: "))
gia_mot_ly = int(input("Gia mot ly (dong): "))
khach_tra = int(input("Khach tra (dong): "))

tien_hang = so_ly * gia_mot_ly
tien_vat = tien_hang * TI_LE_VAT
tong_phai_tra = tien_hang + tien_vat
tien_thoi = khach_tra - tong_phai_tra

print("-" * 32)
print("So ly        :", so_ly)
print("Tien hang    :", tien_hang)
print("VAT 8%       :", int(tien_vat))
print("Tong phai tra:", int(tong_phai_tra))
print("Tien thoi lai:", int(tien_thoi))
print("-" * 32)
</code></pre>
<div class="out">Input đã gõ: <b>3</b>, <b>25000</b>, <b>100000</b><br>So ly: Gia mot ly (dong): Khach tra (dong): --------------------------------<br>So ly&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 3<br>Tien hang&nbsp;&nbsp;&nbsp;&nbsp;: 75000<br>VAT 8%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 6000<br>Tong phai tra: 81000<br>Tien thoi lai: 19000<br><b>--------------------------------</b></div>
<p>Ba quyết định đáng bảo vệ. <strong>Vì sao <code>int(...)</code> quanh mọi input</strong> — không có nó thì <code>so_ly * gia_mot_ly</code> sẽ nhân hai chuỗi và vỡ. <strong>Vì sao đặt hằng số cho 8%</strong> — khi tỉ lệ đổi thì bạn sửa một dòng, và chú thích nói cho người đọc sau biết con số đó là quy định, không phải đoán. <strong>Vì sao <code>int(tien_vat)</code> lúc in</strong> — <code>75000 * 0.08</code> là float nên nó sẽ in ra <code>6000.0</code>; tiền đồng không có phần thập phân.</p></div>
<h3>Tự kiểm trước khi nộp</h3>
<table>
  <thead><tr><th>Kiểm gì</th><th>Kiểm thế nào</th></tr></thead>
  <tbody>
    <tr><td>Số học đúng</td><td>3 × 25.000 = 75.000 · 8% của đó = 6.000 · tổng 81.000 · thối từ 100.000 = 19.000. Tính lại trên giấy.</td></tr>
    <tr><td>Chạy bình thường không vỡ</td><td>chạy một lượt, gõ số bình thường</td></tr>
    <tr><td>Không còn chuỗi ở chỗ phải là số</td><td>nếu tiền hàng ra kiểu <code>32500002500000</code> là bạn quên một <code>int()</code></td></tr>
    <tr><td>Tên biến đọc được</td><td>bạn cùng lớp đọc được mà không cần bạn thuyết minh không?</td></tr>
  </tbody>
</table>
<h3>Ba mở rộng — làm thử, đây đúng tầm của kỳ thi thực hành</h3>
<ol>
<li>In giá một ly <em>đã gồm</em> VAT, để dạng số thực.</li>
<li>Nếu khách đưa thiếu thì tiền thối ra số âm. Cứ in ra — đừng che; muốn xử lý khác thì cần <code>if</code>, mà đó là buổi 10.</li>
<li>Đặt tên quán vào một hằng số và canh nó vào giữa trên đường kẻ 32 dấu, bằng phép lặp chuỗi.</li>
</ol>
<div class="pitfall"><b>Quên <code>int()</code> ở một trong ba input.</b> Chương trình không vỡ ở chỗ bạn quên — nó vỡ vài dòng sau, và đó chính là lý do phải ép kiểu ngay tại dòng nhập. <b><code>int()</code> CẮT phần lẻ, không làm tròn.</b> <code>int(6499.9)</code> là 6499. Với tiền trong bài này thì được; hãy ghi rõ vào chú thích thay vì để may rủi. <b>Viết cứng 0.08 ở ba chỗ.</b> Rồi tỉ lệ đổi và bạn sửa được hai chỗ. <b>Gõ tay 32 dấu gạch.</b> Nhìn giống y hệt, và chỉ cách con số 31 đúng một lần gõ lỡ.</div>`,
  ]]);

/* ── Quiz chương 1 (slug cũ: pfp191-1-quiz) ──────────────────────────────── */
const c1q = quiz('pfp191-1-quiz', 'Quiz 1 — Sessions 1–9: from hardware to input()|||Quiz 1 — Buổi 1–9: từ phần cứng tới input()', [
  { id: 'q1',
    question: 'Python is which kind of language?|||Python là ngôn ngữ loại nào?',
    options: ['Compiled — translated fully before it runs|||Biên dịch — dịch hết trước khi chạy', 'Interpreted — translated line by line as it runs|||Thông dịch — dịch từng dòng trong lúc chạy', 'It needs no translation at all|||Không cần dịch gì cả', 'It only runs inside a browser|||Chỉ chạy trong trình duyệt'],
    correctIndex: 1, points: 1,
    explanation: 'Python is interpreted: there is no build step, which is why a typo on line 40 stays invisible until line 40 runs.|||Python là ngôn ngữ thông dịch: không có bước build, và vì thế một lỗi gõ ở dòng 40 vẫn nằm im tới khi dòng 40 được chạy.' },
  { id: 'q2',
    question: 'Which part of the computer FORGETS your variables when the program ends?|||Bộ phận nào của máy tính QUÊN các biến của bạn khi chương trình kết thúc?',
    options: ['The disk / SSD|||Ổ đĩa / SSD', 'Main memory (RAM)|||Bộ nhớ chính (RAM)', 'The CPU|||CPU', 'The keyboard|||Bàn phím'],
    correctIndex: 1, points: 1,
    explanation: 'Variables live in RAM, which is emptied when the program stops. Keeping data after that needs a file — Chapter 7, sessions 25–26.|||Biến sống trong RAM, và RAM bị xoá khi chương trình dừng. Muốn giữ dữ liệu sau đó thì phải dùng tệp — Chương 7, buổi 25–26.' },
  { id: 'q3',
    question: 'What does this program print?|||Chương trình này in ra gì?',
    code: 'x = 7\\nprint(x // 2, x % 2)', codeLang: 'python',
    options: ['3.5 1|||3.5 1', '3 1|||3 1', '3 3.5|||3 3.5', '1 3|||1 3'],
    correctIndex: 1, points: 1,
    explanation: '// is floor division (7 // 2 = 3) and % is the remainder (7 % 2 = 1). 3.5 would be 7 / 2 with a single slash.|||// là chia lấy nguyên (7 // 2 = 3) và % là số dư (7 % 2 = 1). 3.5 là 7 / 2 với một dấu gạch.' },
  { id: 'q4',
    question: 'What does this print?|||Đoạn này in ra gì?',
    code: 'print(2 + 3 * 4 ** 2)\\nprint(2 ** 3 ** 2)', codeLang: 'python',
    options: ['50 then 512|||50 rồi 512', '400 then 64|||400 rồi 64', '50 then 64|||50 rồi 64', '14 then 512|||14 rồi 512'],
    correctIndex: 0, points: 1,
    explanation: 'First line: ** first (4**2 = 16), then * (3*16 = 48), then + → 50. Second line: ** groups RIGHT to left, so it is 2**(3**2) = 2**9 = 512, not 64.|||Dòng 1: ** trước (4**2 = 16), rồi * (3*16 = 48), rồi + → 50. Dòng 2: ** nhóm từ PHẢI sang trái, nên là 2**(3**2) = 2**9 = 512, không phải 64.' },
  { id: 'q5',
    question: 'What type does input() always return?|||input() luôn trả về kiểu gì?',
    options: ['int', 'float', 'str (a string)|||str (một chuỗi)', 'whatever the user typed|||đúng kiểu người dùng gõ'],
    correctIndex: 2, points: 1,
    explanation: 'Always str, even for digits. Doing arithmetic on it without int() or float() gives TypeError: can only concatenate str (not "int") to str.|||Luôn là str, kể cả khi gõ chữ số. Tính toán trên nó mà không int() hay float() sẽ cho TypeError: can only concatenate str (not "int") to str.' },
  { id: 'q6',
    question: 'What does this print?|||Đoạn này in ra gì?',
    code: 'print("ab" * 2 + "c")\\nprint(type(7 / 1))', codeLang: 'python',
    options: ['ababc then &lt;class \'float\'&gt;|||ababc rồi &lt;class \'float\'&gt;', 'abab c then &lt;class \'int\'&gt;|||abab c rồi &lt;class \'int\'&gt;', 'ab2c then &lt;class \'float\'&gt;|||ab2c rồi &lt;class \'float\'&gt;', 'Error: cannot multiply a string|||Lỗi: không nhân được chuỗi'],
    correctIndex: 0, points: 1,
    explanation: 'On strings * repeats and + glues: "ab"*2 is "abab", then +"c" gives "ababc". And / always returns a float, so 7 / 1 is 7.0 of type float.|||Trên chuỗi thì * là lặp và + là dán: "ab"*2 ra "abab", cộng "c" ra "ababc". Và / luôn trả về float, nên 7 / 1 là 7.0 kiểu float.' },
  { id: 'q7',
    question: 'Which variable name is VALID in Python?|||Tên biến nào HỢP LỆ trong Python?',
    options: ['2diem', 'tong_tien', 'for', 'tong-tien'],
    correctIndex: 1, points: 1,
    explanation: 'A name may not start with a digit (2diem), may not be one of the 35 keywords (for), and may not contain a hyphen (that is the minus operator).|||Tên không được bắt đầu bằng chữ số (2diem), không được là một trong 35 từ khoá (for), và không được có dấu gạch ngang (đó là toán tử trừ).' },
  { id: 'q8',
    question: 'A program runs without any error message but prints the wrong total. What kind of error is it?|||Một chương trình chạy không báo lỗi gì nhưng in ra tổng sai. Đó là lỗi loại nào?',
    options: ['Syntax error|||Lỗi cú pháp', 'Runtime error|||Lỗi lúc chạy', 'Logic error|||Lỗi logic', 'A hardware fault|||Lỗi phần cứng'],
    correctIndex: 2, points: 1,
    explanation: 'Logic error — the grammar is fine and nothing crashes, so Python cannot help. Only you know what the answer should have been, which is why these are the expensive ones.|||Lỗi logic — ngữ pháp đúng, không vỡ chỗ nào, nên Python không giúp được. Chỉ bạn biết đáp án đúng phải là bao nhiêu, và đó là lý do loại lỗi này đắt nhất.' },
], 600);

/* ════════════════════════════════════════════════════════════════════════════
 * CHƯƠNG 2 → 10 — KHUNG (đúng tên bài, đúng buổi/CLO/mục PY4E, 4 dòng mốc).
 * Bài giảng chi tiết bổ sung sau: thay khung(...) bằng doc(...), giữ nguyên slug.
 * ══════════════════════════════════════════════════════════════════════════ */

/* ── Chương 2 — Rẽ nhánh & vòng lặp (buổi 10–13, CLO3) ───────────────────── */
const k21 = khung('pfp191-3-1-re-nhanh',
  '2.1 — Conditional execution: if / else|||2.1 — Thực thi có điều kiện: if / else',
  'Buổi 10, CLO3, PY4E 3.1–3.4: biểu thức boolean, toán tử so sánh, toán tử logic and/or/not, if và else, thụt lề làm nên khối lệnh.',
  { s: '10', clo: 'CLO3', itu: 'IT',
    flm: 'Chapter 3. Conditional execution — 3.1 Boolean expressions; 3.2 Logical operators; 3.3 Conditional execution; 3.4 Alternative execution',
    py4e: 'chapter 3, sections 3.1–3.4',
    hEn: '2.1 — Conditional execution: <code>if</code> / <code>else</code>',
    hVi: '2.1 — Thực thi có điều kiện: <code>if</code> / <code>else</code>',
    lEn: 'boolean expressions (True / False), the six comparison operators, the logical operators <code>and</code> / <code>or</code> / <code>not</code>, a bare <code>if</code>, and <code>if</code> with <code>else</code> — plus the rule that in Python a block is defined by <strong>indentation</strong>, not by braces.',
    lVi: 'biểu thức boolean (True / False), sáu toán tử so sánh, các toán tử logic <code>and</code> / <code>or</code> / <code>not</code>, <code>if</code> đứng một mình, và <code>if</code> kèm <code>else</code> — cùng với luật: trong Python một khối lệnh được xác định bằng <strong>thụt lề</strong>, không phải bằng ngoặc nhọn.',
    dEn: 'make a program take one of two paths depending on data, and predict which branch runs without executing it.',
    dVi: 'cho chương trình chọn một trong hai đường tuỳ theo dữ liệu, và đoán được nhánh nào chạy mà không cần thực thi.' });

const k22 = khung('pfp191-2-2-dieu-kien-long-va-try-except',
  '2.2 — Chained & nested conditionals, try / except|||2.2 — Điều kiện nối chuỗi & lồng nhau, try / except',
  'Buổi 11, CLO3, PY4E 3.5–3.9: elif nối chuỗi nhiều nhánh, điều kiện lồng, bắt ngoại lệ bằng try/except, đánh giá đoản mạch (short-circuit), gỡ lỗi khối lệnh.',
  { s: '11', clo: 'CLO3', itu: 'IT',
    flm: '3.5 Chained conditionals; 3.6 Nested conditionals; 3.7 Catching exceptions using try and except; 3.8 Short-circuit evaluation of logical expressions; 3.9 Debugging',
    py4e: 'chapter 3, sections 3.5–3.9',
    hEn: '2.2 — Chained and nested conditionals, <code>try</code> / <code>except</code>',
    hVi: '2.2 — Điều kiện nối chuỗi và lồng nhau, <code>try</code> / <code>except</code>',
    lEn: '<code>elif</code> for three or more branches, conditionals inside conditionals, catching a runtime error with <code>try</code> / <code>except</code> so the program survives bad input, and short-circuit evaluation (in <code>a and b</code>, if <code>a</code> is False, <code>b</code> is never evaluated).',
    lVi: '<code>elif</code> cho ba nhánh trở lên, điều kiện nằm trong điều kiện, bắt lỗi lúc chạy bằng <code>try</code> / <code>except</code> để chương trình sống sót khi dữ liệu vào sai, và đánh giá đoản mạch (trong <code>a and b</code>, nếu <code>a</code> sai thì <code>b</code> không hề được tính).',
    dEn: 'grade a score into Gioi / Dat / Truot, and write a program that does not crash when the user types text instead of a number.',
    dVi: 'xếp một điểm số thành Giỏi / Đạt / Trượt, và viết được chương trình không vỡ khi người dùng gõ chữ thay vì số.' });

const k23 = khung('pfp191-4-1-vong-lap',
  '2.3 — Iteration: while, infinite loops, continue|||2.3 — Vòng lặp: while, lặp vô hạn, continue',
  'Buổi 12, CLO3, PY4E 4.1–4.4: cập nhật biến, câu lệnh while, vòng lặp vô hạn và while True + break, kết thúc sớm một lượt lặp bằng continue.',
  { s: '12', clo: 'CLO3', itu: 'IT',
    flm: 'Chapter 4. Iteration — 4.1 Updating variables; 4.2 The while statement; 4.3 Infinite loops; 4.4 Finishing iterations with continue',
    py4e: 'chapter 4, sections 4.1–4.4',
    hEn: '2.3 — Iteration: <code>while</code>, infinite loops, <code>continue</code>',
    hVi: '2.3 — Vòng lặp: <code>while</code>, lặp vô hạn, <code>continue</code>',
    lEn: 'updating a variable from its own value (<code>n = n - 1</code>), the <code>while</code> statement, why a loop becomes infinite and the deliberate <code>while True</code> + <code>break</code> pattern, and <code>continue</code> to skip the rest of one pass.',
    lVi: 'cập nhật một biến từ chính giá trị của nó (<code>n = n - 1</code>), câu lệnh <code>while</code>, vì sao một vòng lặp thành vô hạn và mẫu <code>while True</code> + <code>break</code> có chủ đích, và <code>continue</code> để bỏ phần còn lại của một lượt.',
    dEn: 'repeat work an unknown number of times and always leave the loop — the most common beginner bug is a loop with no exit.',
    dVi: 'lặp một việc khi chưa biết trước số lần và luôn thoát ra được — lỗi phổ biến nhất của người mới là vòng lặp không có lối ra.' });

const k24 = khung('pfp191-2-4-for-va-mau-vong-lap',
  '2.4 — for loops and the five loop patterns|||2.4 — Vòng lặp for và năm mẫu vòng lặp',
  'Buổi 13, CLO3, PY4E 4.5–4.7: vòng lặp xác định bằng for và range, năm mẫu kinh điển (đếm, tổng, lớn nhất, nhỏ nhất, tìm kiếm), biến tích luỹ, gỡ lỗi vòng lặp.',
  { s: '13', clo: 'CLO3', itu: 'IT',
    flm: '4.5 Definite loops using for; 4.6 Loop patterns; 4.7 Debugging',
    py4e: 'chapter 4, sections 4.5–4.7',
    hEn: '2.4 — <code>for</code> loops and the five loop patterns',
    hVi: '2.4 — Vòng lặp <code>for</code> và năm mẫu vòng lặp',
    lEn: 'the definite loop <code>for x in ...</code> with <code>range()</code>, and the five patterns that reappear for the rest of the course: <strong>counting</strong>, <strong>summing</strong>, <strong>largest</strong>, <strong>smallest</strong>, <strong>searching</strong> — each built on an accumulator variable initialised before the loop.',
    lVi: 'vòng lặp xác định <code>for x in ...</code> với <code>range()</code>, và năm mẫu sẽ quay lại suốt phần còn lại của môn: <strong>đếm</strong>, <strong>tính tổng</strong>, <strong>tìm lớn nhất</strong>, <strong>tìm nhỏ nhất</strong>, <strong>tìm kiếm</strong> — mỗi mẫu dựa trên một biến tích luỹ được khởi tạo TRƯỚC vòng lặp.',
    dEn: 'walk through a sequence and produce a single answer from it — the shape of most Practical Exam questions.',
    dVi: 'duyệt qua một dãy và rút ra một câu trả lời duy nhất từ nó — đúng hình dáng của phần lớn câu hỏi thi thực hành.' });

const c2q = quiz('pfp191-2-quiz', 'Quiz 2 — Conditionals & loops (sessions 10–13)|||Quiz 2 — Rẽ nhánh & vòng lặp (buổi 10–13)', [
  { id: 'q1', question: 'In Python, how is a block of code (the body after if:) defined?|||Trong Python, một khối lệnh (thân sau if:) được xác định bằng gì?', options: ['Curly braces { }|||Ngoặc nhọn { }', 'Indentation|||Thụt lề', 'The word "end"|||Từ khoá "end"', 'A semicolon ;|||Dấu chấm phẩy ;'], correctIndex: 1, points: 1, explanation: 'Python uses indentation (4 spaces by convention). Mixing tabs and spaces gives IndentationError while looking perfectly aligned.|||Python dùng thụt lề (quy ước 4 dấu cách). Trộn tab với dấu cách cho IndentationError trong khi mắt nhìn thấy thẳng tắp.' },
  { id: 'q2', question: 'Which keyword handles the case where no earlier condition matched?|||Từ khoá nào xử lý trường hợp không điều kiện nào phía trên đúng?', options: ['elif', 'else', 'except', 'end'], correctIndex: 1, points: 1, explanation: 'else runs when every if/elif above it is False. elif adds another test; except catches an error.|||else chạy khi mọi if/elif phía trên đều sai. elif là thêm một phép kiểm; except là bắt lỗi.' },
  { id: 'q3', question: 'What does try / except do?|||try / except dùng để làm gì?', options: ['Repeat code|||Lặp lại code', 'Catch and handle a runtime error so the program survives|||Bắt và xử lý lỗi lúc chạy để chương trình sống sót', 'Define a function|||Định nghĩa hàm', 'Make the program faster|||Làm chương trình nhanh hơn'], correctIndex: 1, points: 1, explanation: 'try runs code that might fail; except catches the failure instead of letting the traceback stop the program.|||try chạy đoạn code có thể lỗi; except bắt lỗi đó thay vì để traceback dừng chương trình.' },
  { id: 'q4', question: 'Which loop fits best when you already know the number of repetitions?|||Vòng lặp nào hợp nhất khi đã biết trước số lần lặp?', options: ['while', 'for', 'if', 'try'], correctIndex: 1, points: 1, explanation: 'for (usually with range) suits a known count; while suits "keep going until something becomes true".|||for (thường kèm range) hợp khi biết trước số lần; while hợp khi "cứ chạy tới khi điều gì đó thành đúng".' },
  { id: 'q5', question: 'What does break do inside a loop, and how is continue different?|||break làm gì trong vòng lặp, và continue khác thế nào?', options: ['Both exit the loop|||Cả hai đều thoát vòng lặp', 'break leaves the loop; continue skips to the next pass|||break thoát vòng lặp; continue bỏ qua sang lượt kế', 'break skips one pass; continue exits|||break bỏ một lượt; continue thoát ra', 'Both restart the loop|||Cả hai bắt đầu lại vòng lặp'], correctIndex: 1, points: 1, explanation: 'break ends the loop entirely; continue abandons the current pass and goes straight to the next one.|||break kết thúc hẳn vòng lặp; continue bỏ lượt đang chạy và đi thẳng sang lượt kế.' },
  { id: 'q6', question: 'How many numbers does range(1, 6) produce?|||range(1, 6) sinh ra bao nhiêu số?', options: ['6 (1..6)', '5 (1..5)', '4 (2..5)', '7 (0..6)'], correctIndex: 1, points: 1, explanation: 'range(1, 6) gives 1, 2, 3, 4, 5 — it stops BEFORE 6. Five numbers. This off-by-one is the classic loop bug.|||range(1, 6) cho 1, 2, 3, 4, 5 — nó dừng TRƯỚC 6. Tất cả 5 số. Lệch một đơn vị chỗ này là lỗi vòng lặp kinh điển.' },
], 420);

/* ── Chương 3 — Hàm (buổi 14–19, CLO3) ───────────────────────────────────── */
const k31 = khung('pfp191-5-1-ham',
  '3.1 — Calling functions: built-ins and type conversion|||3.1 — Gọi hàm: hàm dựng sẵn và hàm ép kiểu',
  'Buổi 14, CLO3, PY4E 5.1–5.3: lời gọi hàm và cú pháp đối số, các hàm dựng sẵn (print, input, len, max, min), và ba hàm ép kiểu int() / float() / str().',
  { s: '14', clo: 'CLO3', itu: 'I,T',
    flm: 'Chapter 5. Functions (Part 1) — 5.1 Function calls; 5.2 Built-in functions; 5.3 Type conversion functions',
    py4e: 'chapter 5, sections 5.1–5.3',
    hEn: '3.1 — Calling functions: built-ins and type conversion',
    hVi: '3.1 — Gọi hàm: hàm dựng sẵn và hàm ép kiểu',
    lEn: 'what a function <em>call</em> is, the built-in functions you already use (<code>print</code>, <code>input</code>, <code>len</code>, <code>max</code>, <code>min</code>), and the three conversion functions <code>int()</code>, <code>float()</code>, <code>str()</code> — the same ones that fix the <code>input()</code> TypeError from session 7.',
    lVi: '<em>lời gọi hàm</em> là gì, các hàm dựng sẵn bạn vẫn dùng (<code>print</code>, <code>input</code>, <code>len</code>, <code>max</code>, <code>min</code>), và ba hàm ép kiểu <code>int()</code>, <code>float()</code>, <code>str()</code> — đúng những hàm đã chữa lỗi TypeError của <code>input()</code> ở buổi 7.',
    dEn: 'read a call like <code>max(3, 41, 12)</code> and say what goes in, what comes out, and what type it is.',
    dVi: 'đọc một lời gọi như <code>max(3, 41, 12)</code> và nói được cái gì đi vào, cái gì đi ra, và nó kiểu gì.' });

const k32 = khung('pfp191-3-2-math-random-va-def',
  '3.2 — math, random, and writing your own function|||3.2 — math, random, và tự viết hàm đầu tiên',
  'Buổi 15, CLO3, PY4E 5.4–5.6: module math (sqrt, pi, floor), module random và randint, import, và định nghĩa hàm đầu tiên bằng def.',
  { s: '15', clo: 'CLO3', itu: 'I,T',
    flm: '5.4 Math functions; 5.5 Random numbers; 5.6 Adding new functions',
    py4e: 'chapter 5, sections 5.4–5.6',
    hEn: '3.2 — <code>math</code>, <code>random</code>, and writing your own function',
    hVi: '3.2 — <code>math</code>, <code>random</code>, và tự viết hàm đầu tiên',
    lEn: 'what a <strong>module</strong> is and how <code>import</code> works, the <code>math</code> module (<code>sqrt</code>, <code>pi</code>, <code>floor</code>), the <code>random</code> module (<code>random()</code>, <code>randint</code>), and your first <code>def</code>.',
    lVi: '<strong>module</strong> là gì và <code>import</code> hoạt động thế nào, module <code>math</code> (<code>sqrt</code>, <code>pi</code>, <code>floor</code>), module <code>random</code> (<code>random()</code>, <code>randint</code>), và lời <code>def</code> đầu tiên của bạn.',
    dEn: 'stop rewriting the same three lines: give them a name with <code>def</code> and call the name instead.',
    dVi: 'thôi viết lại ba dòng giống nhau: đặt cho chúng một cái tên bằng <code>def</code> rồi gọi cái tên đó.' });

const k33 = khung('pfp191-3-3-tham-so-va-luong-thuc-thi',
  '3.3 — Definitions vs uses, flow of execution, parameters|||3.3 — Định nghĩa vs sử dụng, luồng thực thi, tham số',
  'Buổi 16, CLO3, PY4E 5.7–5.9: khác nhau giữa định nghĩa và lời gọi, luồng thực thi nhảy vào hàm rồi quay về, tham số vs đối số, biến cục bộ.',
  { s: '16', clo: 'CLO3', itu: 'I,T',
    flm: 'Chapter 5. Functions (Part 2) — 5.7 Definitions and uses; 5.8 Flow of execution; 5.9 Parameters and arguments',
    py4e: 'chapter 5, sections 5.7–5.9',
    hEn: '3.3 — Definitions vs uses, flow of execution, parameters and arguments',
    hVi: '3.3 — Định nghĩa vs sử dụng, luồng thực thi, tham số và đối số',
    lEn: 'why a <code>def</code> block does not run when Python reads it, how execution jumps into the function at the call and comes back to the line after it, and the difference between a <strong>parameter</strong> (the name in the definition) and an <strong>argument</strong> (the value passed in).',
    lVi: 'vì sao khối <code>def</code> không chạy lúc Python đọc tới nó, luồng thực thi nhảy vào hàm ở chỗ gọi rồi quay về dòng ngay sau đó thế nào, và khác nhau giữa <strong>tham số</strong> (cái tên trong định nghĩa) với <strong>đối số</strong> (giá trị truyền vào).',
    dEn: 'trace by hand which line runs next in a program that calls functions — the skill the Progress Test tests.',
    dVi: 'lần được bằng tay dòng nào chạy tiếp trong một chương trình có gọi hàm — đúng kỹ năng Progress Test kiểm.' });

const k34 = khung('pfp191-3-4-ham-tra-ve-va-vi-sao-dung-ham',
  '3.4 — Fruitful vs void functions, why functions, debugging|||3.4 — Hàm có trả về vs hàm void, vì sao dùng hàm, gỡ lỗi',
  'Buổi 17, CLO3, PY4E 5.10–5.12: return và hàm có trả về, hàm void trả về None, bốn lý do dùng hàm, và gỡ lỗi hàm bằng cách kiểm từng hàm riêng.',
  { s: '17', clo: 'CLO3', itu: 'I,T',
    flm: '5.10 Fruitful functions and void functions; 5.11 Why functions?; 5.12 Debugging',
    py4e: 'chapter 5, sections 5.10–5.12',
    hEn: '3.4 — Fruitful vs void functions, why functions, debugging',
    hVi: '3.4 — Hàm có trả về vs hàm void, vì sao dùng hàm, gỡ lỗi',
    lEn: '<code>return</code> and the difference between a function that hands a value back and one that only acts (and quietly returns <code>None</code>); the four reasons functions exist — remove repetition, name a chunk, debug once, divide a big problem; and how to test one function on its own.',
    lVi: '<code>return</code> và khác biệt giữa hàm trả một giá trị về với hàm chỉ làm việc (rồi âm thầm trả <code>None</code>); bốn lý do hàm tồn tại — xoá lặp lại, đặt tên cho một mảng code, gỡ lỗi một lần, chia nhỏ bài toán lớn; và cách kiểm thử một hàm đứng riêng.',
    dEn: 'split a 40-line script into four named functions, and explain why <code>print</code> inside a function is usually the wrong choice.',
    dVi: 'chia một script 40 dòng thành bốn hàm có tên, và giải thích vì sao <code>print</code> bên trong hàm thường là lựa chọn sai.' });

const k35 = khung('pfp191-3-5-lab-2',
  '3.5 — Lab 2: conditionals, loops and functions|||3.5 — Lab 2: rẽ nhánh, vòng lặp và hàm',
  'Buổi 18–19, CLO3, Lab 2 (2% điểm môn, 90 phút): gộp if/elif/else, while/for và def vào một chương trình; chuẩn bị trực tiếp cho Progress Test 1 ở buổi 20.',
  { s: '18–19', clo: 'CLO3', itu: 'U',
    flm: 'Lab 2 assistance / Lab 2 assistance (cont.)',
    py4e: 'chapters 3, 4 and 5 together',
    hEn: '3.5 — Lab 2: conditionals, loops and functions in one program',
    hVi: '3.5 — Lab 2: rẽ nhánh, vòng lặp và hàm trong một chương trình',
    lEn: 'two guided sessions building one program that uses everything from sessions 10–17. Worth <strong>2%</strong> (one of five labs at 10% total), 90 minutes, completion criteria &gt; 0. The exact task is set by your lecturer and is not published on FLM.',
    lVi: 'hai buổi có hướng dẫn để dựng một chương trình dùng hết những gì buổi 10–17 đã dạy. Giá trị <strong>2%</strong> (một trong năm bài Lab, tổng 10%), 90 phút, tiêu chí đạt &gt; 0. Đề cụ thể do giảng viên giao, FLM không công bố.',
    dEn: 'walk into Progress Test 1 (session 20) having already written, not just read, the whole CLO1–CLO3 syllabus.',
    dVi: 'bước vào Progress Test 1 (buổi 20) sau khi đã tự VIẾT, không chỉ đọc, toàn bộ phần CLO1–CLO3.' });

const c3q = quiz('pfp191-3-quiz', 'Quiz 3 — Functions (sessions 14–19)|||Quiz 3 — Hàm (buổi 14–19)', [
  { id: 'q1', question: 'Which keyword defines a function in Python?|||Từ khoá nào định nghĩa một hàm trong Python?', options: ['function', 'def', 'func', 'define'], correctIndex: 1, points: 1, explanation: 'Python uses def, followed by the name, the parameters in brackets, and a colon.|||Python dùng def, rồi tới tên hàm, các tham số trong ngoặc, và dấu hai chấm.' },
  { id: 'q2', question: 'What does a "fruitful" function do that a "void" one does not?|||Hàm "có trả về" khác hàm "void" ở chỗ nào?', options: ['It prints something|||Nó in ra cái gì đó', 'It hands a value back with return|||Nó trả một giá trị về bằng return', 'It runs faster|||Nó chạy nhanh hơn', 'It takes no arguments|||Nó không nhận đối số'], correctIndex: 1, points: 1, explanation: 'A fruitful function returns a value you can store or use in an expression; a void function just acts and returns None.|||Hàm có trả về đưa lại một giá trị bạn cất được hoặc dùng được trong biểu thức; hàm void chỉ làm việc và trả về None.' },
  { id: 'q3', question: 'In def greet(name):, what is "name"?|||Trong def greet(name):, "name" là gì?', options: ['An argument|||Một đối số', 'A parameter|||Một tham số', 'A module|||Một module', 'The return value|||Giá trị trả về'], correctIndex: 1, points: 1, explanation: 'name is a PARAMETER — it lives in the definition. The value you pass at the call, e.g. greet("An"), is the ARGUMENT.|||name là THAM SỐ — nó nằm trong định nghĩa. Giá trị bạn truyền lúc gọi, ví dụ greet("An"), mới là ĐỐI SỐ.' },
  { id: 'q4', question: 'Where does a variable created inside a function live?|||Biến tạo bên trong một hàm sống ở đâu?', options: ['Everywhere in the program|||Khắp chương trình', 'Only inside that function — it disappears when the function returns|||Chỉ bên trong hàm đó — nó mất khi hàm kết thúc', 'In a file on disk|||Trong một tệp trên đĩa', 'In the function name|||Trong tên hàm'], correctIndex: 1, points: 1, explanation: 'It is local. To get a result out of a function you must return it — that is exactly what return is for.|||Nó là biến cục bộ. Muốn lấy kết quả ra khỏi hàm thì phải return nó — return có đúng để làm việc đó.' },
], 420);

/* ── Chương 4 — Progress Test 1 (buổi 20) ────────────────────────────────── */
const k41 = khung('pfp191-4-progress-test-1',
  '4.1 — Progress Test 1 (session 20): 20 questions, 30 minutes|||4.1 — Progress Test 1 (buổi 20): 20 câu, 30 phút',
  'Buổi 20, CLO1–CLO3, Progress Test 1: một trong hai bài của đầu điểm Progress Test (15% tổng), 30 phút, 20 câu trắc nghiệm máy chấm; phạm vi là buổi 1–19.',
  { s: '20', clo: 'CLO1, CLO2, CLO3', itu: 'I,U',
    flm: 'Progress test 1',
    py4e: 'chapters 1–5 (everything up to session 19)',
    hEn: '4.1 — Progress Test 1',
    hVi: '4.1 — Progress Test 1 (Kiểm tra tiến độ 1)',
    lEn: 'the first of the two Progress Tests. FLM publishes: <strong>2 parts at 15% together</strong>, <strong>30 minutes</strong> and <strong>20 questions</strong> each, "Multiple choices, marked by computer or a suitable format", completion criteria &gt; 0. The session plan tags this one LO1, LO2, LO3 — sessions 1–19.',
    lVi: 'bài đầu trong hai bài Progress Test. FLM công bố: <strong>2 bài, tổng 15%</strong>, mỗi bài <strong>30 phút</strong> và <strong>20 câu</strong>, "Multiple choices, marked by computer or a suitable format", tiêu chí đạt &gt; 0. Bảng kế hoạch gắn buổi này LO1, LO2, LO3 — tức buổi 1–19.',
    dEn: 'know before you sit down that 30 minutes for 20 questions is <strong>90 seconds each</strong>, so the marks come from reflexes built in the labs, not from notes.',
    dVi: 'biết trước khi ngồi vào chỗ rằng 30 phút cho 20 câu là <strong>90 giây một câu</strong>, nên điểm đến từ phản xạ luyện trong lab, không đến từ vở.' });

const c4q = quiz('pfp191-4-quiz', 'Quiz 4 — Progress Test 1 rehearsal (sessions 1–19)|||Quiz 4 — Ôn Progress Test 1 (buổi 1–19)', [
  { id: 'q1', question: 'How long is each Progress Test and how many questions?|||Mỗi bài Progress Test dài bao lâu và bao nhiêu câu?', options: ['30 minutes, 20 questions|||30 phút, 20 câu', '60 minutes, 50 questions|||60 phút, 50 câu', '85 minutes, 20 questions|||85 phút, 20 câu', '90 minutes, 30 questions|||90 phút, 30 câu'], correctIndex: 0, points: 1, explanation: '30 minutes and 20 questions each, two parts, 15% together. 60 min / 50 questions is the Final Exam; 85 min is the Practical Exam; 90 min is a Lab.|||Mỗi bài 30 phút và 20 câu, hai bài, tổng 15%. 60 phút / 50 câu là Final Exam; 85 phút là Practical Exam; 90 phút là một bài Lab.' },
  { id: 'q2', question: 'What does this print?|||Đoạn này in ra gì?', code: 'a = "5"\\nb = 3\\nprint(int(a) + b)', codeLang: 'python', options: ['53', '8', '"53"', 'TypeError'], correctIndex: 1, points: 1, explanation: 'int("5") is the number 5, so 5 + 3 = 8. Without int() it would be "5" + 3 → TypeError, because + on a str can only glue another str.|||int("5") là số 5, nên 5 + 3 = 8. Không có int() thì là "5" + 3 → TypeError, vì + trên str chỉ dán được một str khác.' },
  { id: 'q3', question: 'What does this print?|||Đoạn này in ra gì?', code: 'print(17 % 5, 17 // 5)', codeLang: 'python', options: ['3 2', '2 3', '3.4 3.4', '2 3.4'], correctIndex: 1, points: 1, explanation: '17 % 5 is the remainder = 2; 17 // 5 is the whole part = 3. The pair // and % is how you split a number into units.|||17 % 5 là số dư = 2; 17 // 5 là phần nguyên = 3. Cặp // và % chính là cách tách một số thành các đơn vị.' },
  { id: 'q4', question: 'Which three CLOs does the session plan tag for Progress Test 1?|||Bảng kế hoạch gắn Progress Test 1 với ba CLO nào?', options: ['CLO1, CLO2, CLO3', 'CLO4, CLO5, CLO6', 'CLO5, CLO6, CLO7', 'All seven|||Cả bảy'], correctIndex: 0, points: 1, explanation: 'Session 20 is tagged LO1, LO2, LO3 in the plan — the material of sessions 1–19. Careful though: the assessment table itself says every mark covers CLO1–CLO7, so confirm the scope with your lecturer.|||Buổi 20 được gắn LO1, LO2, LO3 trong bảng kế hoạch — nội dung buổi 1–19. Nhưng cẩn thận: chính bảng đánh giá lại ghi mọi đầu điểm phủ CLO1–CLO7, nên hãy xác nhận phạm vi với giảng viên.' },
], 420);

/* ── Chương 5 — Chuỗi (buổi 21–24, CLO4) ─────────────────────────────────── */
const k51 = khung('pfp191-6-1-chuoi',
  '5.1 — A string is a sequence: len and traversal|||5.1 — Chuỗi là một dãy: len và duyệt chuỗi',
  'Buổi 21, CLO4, PY4E 6.1–6.3: chuỗi là dãy ký tự, chỉ số bắt đầu từ 0 và chỉ số âm, len(), duyệt chuỗi bằng while và bằng for.',
  { s: '21', clo: 'CLO4', itu: 'I,T',
    flm: 'Chapter 6. Strings (Part 1) — 6.1 A string is a sequence; 6.2 Getting the length of a string using len; 6.3 Traversal through a string with a loop',
    py4e: 'chapter 6, sections 6.1–6.3',
    hEn: '5.1 — A string is a sequence: <code>len</code> and traversal',
    hVi: '5.1 — Chuỗi là một dãy: <code>len</code> và duyệt chuỗi',
    lEn: 'a string as an ordered sequence of characters, indexing from <strong>0</strong> (and from the end with <code>-1</code>), <code>len()</code>, and walking a string character by character with both a <code>while</code> loop and a <code>for</code> loop.',
    lVi: 'chuỗi là một dãy ký tự có thứ tự, chỉ số bắt đầu từ <strong>0</strong> (và đếm ngược từ cuối bằng <code>-1</code>), <code>len()</code>, và duyệt từng ký tự bằng cả vòng <code>while</code> lẫn vòng <code>for</code>.',
    dEn: 'get any single character out of a piece of text and count how many characters it has.',
    dVi: 'lấy ra bất kỳ ký tự nào trong một đoạn chữ và đếm được nó có bao nhiêu ký tự.' });

const k52 = khung('pfp191-5-2-cat-lat-va-dem',
  '5.2 — Slices, immutability, and counting in a loop|||5.2 — Cắt lát, tính bất biến, và đếm trong vòng lặp',
  'Buổi 22, CLO4, PY4E 6.4–6.6: cắt lát s[a:b] và quy tắc "tới nhưng không gồm b", chuỗi là bất biến (immutable), và mẫu đếm bằng biến tích luỹ.',
  { s: '22', clo: 'CLO4', itu: 'I,T',
    flm: '6.4 String slices; 6.5 Strings are immutable; 6.6 Loop and counting',
    py4e: 'chapter 6, sections 6.4–6.6',
    hEn: '5.2 — Slices, immutability, and counting in a loop',
    hVi: '5.2 — Cắt lát, tính bất biến, và đếm trong vòng lặp',
    lEn: 'the slice <code>s[a:b]</code> and the rule that it stops <em>before</em> <code>b</code>; why <code>s[0] = "J"</code> is an error — strings are <strong>immutable</strong>, so every method returns a NEW string; and the counting pattern from session 13 applied to characters.',
    lVi: 'phép cắt lát <code>s[a:b]</code> và luật "dừng TRƯỚC <code>b</code>"; vì sao <code>s[0] = "J"</code> là lỗi — chuỗi <strong>bất biến</strong>, nên mọi method đều trả về một chuỗi MỚI; và mẫu đếm của buổi 13 áp lên từng ký tự.',
    dEn: 'cut a substring out of any text and count how many times a letter appears in it.',
    dVi: 'cắt được một đoạn con từ bất kỳ chuỗi nào và đếm được một chữ cái xuất hiện bao nhiêu lần trong đó.' });

const k53 = khung('pfp191-5-3-in-so-sanh-va-method',
  '5.3 — The in operator, comparison, and string methods|||5.3 — Toán tử in, so sánh chuỗi, và các method của chuỗi',
  'Buổi 23, CLO4, PY4E 6.7–6.9: toán tử in kiểm tra chuỗi con, so sánh chuỗi theo thứ tự từ điển, và các method thường dùng (upper, lower, strip, find, replace, startswith).',
  { s: '23', clo: 'CLO4', itu: 'I,T',
    flm: 'Chapter 6. Strings (Part 2) — 6.7 The in operator; 6.8 String comparison; 6.9 String methods',
    py4e: 'chapter 6, sections 6.7–6.9',
    hEn: '5.3 — The <code>in</code> operator, comparison, and string methods',
    hVi: '5.3 — Toán tử <code>in</code>, so sánh chuỗi, và các method của chuỗi',
    lEn: '<code>in</code> as a one-word substring test, comparing strings with <code>&lt;</code> and <code>==</code> (dictionary order, and why <code>"Apple" &lt; "apple"</code>), and the method-call syntax <code>s.method()</code>: <code>upper</code>, <code>lower</code>, <code>strip</code>, <code>find</code>, <code>replace</code>, <code>startswith</code>.',
    lVi: '<code>in</code> là phép kiểm chuỗi con chỉ bằng một từ, so sánh chuỗi bằng <code>&lt;</code> và <code>==</code> (thứ tự từ điển, và vì sao <code>"Apple" &lt; "apple"</code>), và cú pháp gọi method <code>s.method()</code>: <code>upper</code>, <code>lower</code>, <code>strip</code>, <code>find</code>, <code>replace</code>, <code>startswith</code>.',
    dEn: 'search inside text and clean it up without writing a loop for it.',
    dVi: 'tìm kiếm bên trong một đoạn chữ và làm sạch nó mà không phải tự viết vòng lặp.' });

const k54 = khung('pfp191-5-4-parsing-va-format',
  '5.4 — Parsing strings and the format operator|||5.4 — Phân tích chuỗi và toán tử định dạng',
  'Buổi 24, CLO4, PY4E 6.10–6.12: tách lấy phần cần trong một dòng văn bản bằng find và slice, toán tử định dạng %, f-string, và gỡ lỗi chuỗi.',
  { s: '24', clo: 'CLO4', itu: 'I,T',
    flm: '6.10 Parsing strings; 6.11 Format operator; 6.12 Debugging',
    py4e: 'chapter 6, sections 6.10–6.12',
    hEn: '5.4 — Parsing strings and the format operator',
    hVi: '5.4 — Phân tích chuỗi và toán tử định dạng',
    lEn: 'pulling the piece you need out of a line of text by combining <code>find()</code> with a slice, the format operator <code>%</code> from the book plus the modern <code>f"..."</code> string, and the debugging habit of printing <code>repr(s)</code> so you can see the invisible spaces.',
    lVi: 'rút đúng mẩu cần dùng ra khỏi một dòng văn bản bằng cách ghép <code>find()</code> với phép cắt lát, toán tử định dạng <code>%</code> theo sách cộng với chuỗi hiện đại <code>f"..."</code>, và thói quen gỡ lỗi là in <code>repr(s)</code> để nhìn thấy các dấu cách vô hình.',
    dEn: 'take a line like <code>From an@fpt.edu.vn Sat Jan 5</code> and extract just the domain — the classic PY4E exercise, and a classic exam question.',
    dVi: 'lấy một dòng như <code>From an@fpt.edu.vn Sat Jan 5</code> và rút ra đúng phần tên miền — bài tập kinh điển của PY4E, và cũng là câu hỏi thi kinh điển.' });

const c5q = quiz('pfp191-5-quiz', 'Quiz 5 — Strings (sessions 21–24)|||Quiz 5 — Chuỗi (buổi 21–24)', [
  { id: 'q1', question: 'For s = "Python", what is s[0] and what is s[-1]?|||Với s = "Python", s[0] và s[-1] là gì?', options: ['"P" and "n"|||"P" và "n"', '"y" and "o"|||"y" và "o"', '"P" and "o"|||"P" và "o"', 'Error — indexing starts at 1|||Lỗi — chỉ số bắt đầu từ 1'], correctIndex: 0, points: 1, explanation: 'Indexing starts at 0, so s[0] is "P"; a negative index counts from the end, so s[-1] is the last character "n".|||Chỉ số bắt đầu từ 0 nên s[0] là "P"; chỉ số âm đếm ngược từ cuối nên s[-1] là ký tự cuối "n".' },
  { id: 'q2', question: 'What does it mean that strings are "immutable"?|||"Bất biến (immutable)" của chuỗi nghĩa là gì?', options: ['They are very fast|||Chúng rất nhanh', 'They cannot be changed in place — every method returns a new string|||Không sửa tại chỗ được — mọi method đều trả về chuỗi mới', 'They hold only numbers|||Chỉ chứa số', 'They must be short|||Phải ngắn'], correctIndex: 1, points: 1, explanation: 's[0] = "J" raises TypeError. s.upper() does not change s — it hands back a new string, which you must assign somewhere if you want to keep it.|||s[0] = "J" báo TypeError. s.upper() KHÔNG đổi s — nó trả về một chuỗi mới, và bạn phải gán nó đi đâu đó nếu muốn giữ.' },
  { id: 'q3', question: 'For s = "Python", what does s[0:3] give?|||Với s = "Python", s[0:3] cho gì?', options: ['"Pyth"', '"Pyt"', '"ytho"', '"Python"'], correctIndex: 1, points: 1, explanation: 'A slice runs from the first index UP TO BUT NOT INCLUDING the second — indexes 0, 1, 2 → "Pyt". Same off-by-one rule as range().|||Phép cắt lát chạy từ chỉ số đầu TỚI NHƯNG KHÔNG GỒM chỉ số sau — chỉ số 0, 1, 2 → "Pyt". Cùng luật lệch một như range().' },
  { id: 'q4', question: 'What does "th" in "Python" evaluate to?|||"th" in "Python" cho kết quả gì?', options: ['2 (the position)|||2 (vị trí)', 'True', '"th"', 'An error|||Một lỗi'], correctIndex: 1, points: 1, explanation: 'in is a boolean test: it answers True or False, not a position. For the position use s.find("th"), which returns 2 — or -1 if not found.|||in là một phép kiểm boolean: nó trả lời True hoặc False, không trả về vị trí. Muốn vị trí thì dùng s.find("th"), trả về 2 — hoặc -1 nếu không tìm thấy.' },
], 420);

/* ── Chương 6 — Tệp (buổi 25–28, CLO5) ───────────────────────────────────── */
const k61 = khung('pfp191-7-1-tep',
  '6.1 — Files: persistence, open, lines, reading|||6.1 — Tệp: tính bền vững, open, dòng, đọc tệp',
  'Buổi 25, CLO5, PY4E 7.1–7.4: vì sao cần lưu ra tệp, open() và đối tượng tệp, ký tự xuống dòng và khái niệm "dòng", đọc cả tệp và đọc từng dòng bằng for.',
  { s: '25', clo: 'CLO5', itu: 'IT',
    flm: 'Chapter 7. Files — 7.1 Persistence; 7.2 Opening files; 7.3 Text files and lines; 7.4 Reading files',
    py4e: 'chapter 7, sections 7.1–7.4',
    hEn: '6.1 — Files: persistence, <code>open</code>, lines, reading',
    hVi: '6.1 — Tệp: tính bền vững, <code>open</code>, dòng, đọc tệp',
    lEn: 'why anything you want to keep must leave RAM (the point made back in session 1), <code>open(name)</code> and what a file handle actually is, the newline character and what "a line" means to Python, and the two ways to read: all at once with <code>read()</code> or line by line with <code>for line in f</code>.',
    lVi: 'vì sao thứ gì muốn giữ lại đều phải rời khỏi RAM (đúng điều đã nói từ buổi 1), <code>open(name)</code> và cái "file handle" thật ra là gì, ký tự xuống dòng và "một dòng" nghĩa là gì với Python, và hai cách đọc: đọc hết một lần bằng <code>read()</code> hoặc đọc từng dòng bằng <code>for line in f</code>.',
    dEn: 'read a data file your program did not create and process it line by line.',
    dVi: 'đọc được một tệp dữ liệu không do chương trình của bạn tạo ra và xử lý nó theo từng dòng.' });

const k62 = khung('pfp191-6-2-tim-kiem-va-ghi-tep',
  '6.2 — Searching a file, try/except/open, writing files|||6.2 — Tìm kiếm trong tệp, try/except/open, ghi tệp',
  'Buổi 26, CLO5, PY4E 7.5–7.9: lọc dòng theo điều kiện, để người dùng nhập tên tệp, bọc open trong try/except bắt FileNotFoundError, ghi tệp với chế độ "w" và "a", và with.',
  { s: '26', clo: 'CLO5', itu: 'IT',
    flm: '7.5 Searching through a file; 7.6 Letting the user choose the file name; 7.7 Using try, except, and open; 7.8 Writing files; 7.9 Debugging',
    py4e: 'chapter 7, sections 7.5–7.9',
    hEn: '6.2 — Searching a file, <code>try</code>/<code>except</code>/<code>open</code>, writing files',
    hVi: '6.2 — Tìm kiếm trong tệp, <code>try</code>/<code>except</code>/<code>open</code>, ghi tệp',
    lEn: 'selecting only the lines you want with <code>startswith</code> and <code>strip</code>, asking the user for the file name, wrapping <code>open</code> in <code>try</code>/<code>except</code> to survive a wrong name (<code>FileNotFoundError</code>), and writing with mode <code>"w"</code> (erases!) versus <code>"a"</code> — plus <code>with open(...) as f</code>, which closes the file for you.',
    lVi: 'chỉ lấy những dòng cần bằng <code>startswith</code> và <code>strip</code>, hỏi người dùng tên tệp, bọc <code>open</code> trong <code>try</code>/<code>except</code> để sống sót khi tên sai (<code>FileNotFoundError</code>), và ghi tệp với chế độ <code>"w"</code> (XOÁ sạch!) so với <code>"a"</code> — cùng với <code>with open(...) as f</code>, thứ tự đóng tệp giúp bạn.',
    dEn: 'read one file, keep only the lines that matter, and write the result into another file without ever losing data.',
    dVi: 'đọc một tệp, giữ lại đúng những dòng cần, và ghi kết quả sang tệp khác mà không làm mất dữ liệu.' });

const k63 = khung('pfp191-6-3-lab-3',
  '6.3 — Lab 3: a program that reads and writes files|||6.3 — Lab 3: chương trình đọc và ghi tệp',
  'Buổi 27–28, CLO5, Lab 3 (2% điểm môn, 90 phút): ghép chuỗi và tệp thành một chương trình đọc dữ liệu thật, lọc, và ghi kết quả ra tệp mới.',
  { s: '27–28', clo: 'CLO5', itu: 'U',
    flm: 'Lab 3 assistance / Lab 3 assistance (cont.)',
    py4e: 'chapters 6 and 7 together',
    hEn: '6.3 — Lab 3: a program that reads and writes files',
    hVi: '6.3 — Lab 3: chương trình đọc và ghi tệp',
    lEn: 'two guided sessions combining strings (sessions 21–24) with files (25–26). Worth <strong>2%</strong>, 90 minutes, completion criteria &gt; 0. The exact task is set by your lecturer and is not published on FLM.',
    lVi: 'hai buổi có hướng dẫn, ghép chuỗi (buổi 21–24) với tệp (25–26). Giá trị <strong>2%</strong>, 90 phút, tiêu chí đạt &gt; 0. Đề cụ thể do giảng viên giao, FLM không công bố.',
    dEn: 'handle a missing file, a blank line and a malformed line without the program stopping — the difference between code that works and code that is finished.',
    dVi: 'xử lý được tệp không tồn tại, dòng trống và dòng hỏng mà chương trình không dừng — khác biệt giữa code chạy được và code làm xong.' });

const c6q = quiz('pfp191-6-quiz', 'Quiz 6 — Files (sessions 25–28)|||Quiz 6 — Tệp (buổi 25–28)', [
  { id: 'q1', question: 'What does open("out.txt", "w") do if the file already exists?|||open("out.txt", "w") làm gì nếu tệp đã tồn tại?', options: ['Appends to the end|||Ghi thêm vào cuối', 'Erases it and starts fresh|||Xoá sạch và ghi mới', 'Raises an error|||Báo lỗi', 'Opens it for reading|||Mở để đọc'], correctIndex: 1, points: 1, explanation: 'Mode "w" truncates the file to zero length first. To add to the end, use mode "a". This is a one-character mistake that destroys data.|||Chế độ "w" cắt tệp về rỗng trước. Muốn thêm vào cuối phải dùng chế độ "a". Đây là lỗi sai một ký tự mà mất dữ liệu.' },
  { id: 'q2', question: 'Why is "with open(...) as f:" preferred?|||Vì sao nên dùng "with open(...) as f:"?', options: ['It reads faster|||Đọc nhanh hơn', 'It closes the file automatically, even if an error happens|||Tự đóng tệp, kể cả khi có lỗi giữa chừng', 'It never raises errors|||Không bao giờ lỗi', 'It writes in binary|||Nó ghi nhị phân'], correctIndex: 1, points: 1, explanation: 'The file is closed when the with block ends, error or no error — so you cannot leave a half-written file behind.|||Tệp được đóng khi khối with kết thúc, có lỗi hay không cũng vậy — nên bạn không để lại một tệp ghi dở.' },
  { id: 'q3', question: 'Opening a file that does not exist raises which error?|||Mở một tệp không tồn tại thì báo lỗi nào?', options: ['ValueError', 'FileNotFoundError', 'ZeroDivisionError', 'IndexError'], correctIndex: 1, points: 1, explanation: 'FileNotFoundError. Whenever the name comes from the user, wrap open in try/except — that is section 7.7 and it is why session 26 revisits try.|||FileNotFoundError. Hễ tên tệp do người dùng nhập thì phải bọc open trong try/except — đó là mục 7.7 và là lý do buổi 26 quay lại với try.' },
  { id: 'q4', question: 'When you loop "for line in f:", what does each line end with?|||Khi lặp "for line in f:", mỗi dòng kết thúc bằng gì?', options: ['Nothing|||Không gì cả', 'A newline character, which is why strip() is usually needed|||Một ký tự xuống dòng, và vì thế thường phải strip()', 'A full stop|||Một dấu chấm', 'A space|||Một dấu cách'], correctIndex: 1, points: 1, explanation: 'Each line keeps its trailing newline, so comparisons fail unexpectedly until you call line.strip(). It is the most common file bug.|||Mỗi dòng vẫn giữ ký tự xuống dòng ở cuối, nên phép so sánh sai một cách khó hiểu cho tới khi bạn gọi line.strip(). Đó là lỗi tệp hay gặp nhất.' },
], 420);

/* ── Chương 7 — List, Dictionary, Tuple (buổi 29–40, CLO6) ───────────────── */
const k71 = khung('pfp191-8-1-list',
  '7.1 — A list is a sequence, lists are mutable|||7.1 — List là một dãy, list thay đổi được',
  'Buổi 29, CLO6, PY4E 8.1–8.3: list là dãy có thứ tự chứa mọi kiểu, list thay đổi được (mutable) khác hẳn chuỗi, duyệt list bằng for.',
  { s: '29', clo: 'CLO6', itu: 'I,T',
    flm: 'Chapter 8. Lists (Part 1) — 8.1 A list is a sequence; 8.2 Lists are mutable; 8.3 Traversing a list',
    py4e: 'chapter 8, sections 8.1–8.3',
    hEn: '7.1 — A list is a sequence, and lists are mutable',
    hVi: '7.1 — List là một dãy, và list thay đổi được',
    lEn: 'a list as an ordered sequence that can hold values of any type, indexed from 0 like a string — but <strong>mutable</strong>: <code>nums[0] = 99</code> works, where the same line on a string is an error. Then traversing with <code>for</code>.',
    lVi: 'list là một dãy có thứ tự, chứa được giá trị của mọi kiểu, đánh chỉ số từ 0 như chuỗi — nhưng <strong>thay đổi được</strong>: <code>nums[0] = 99</code> chạy được, trong khi đúng dòng đó trên chuỗi là lỗi. Rồi tới duyệt bằng <code>for</code>.',
    dEn: 'hold many values under one name instead of inventing <code>diem1</code>, <code>diem2</code>, <code>diem3</code>.',
    dVi: 'giữ nhiều giá trị dưới một cái tên thay vì nghĩ ra <code>diem1</code>, <code>diem2</code>, <code>diem3</code>.' });

const k72 = khung('pfp191-7-2-phep-toan-slice-method-list',
  '7.2 — List operations, slices and methods|||7.2 — Phép toán, cắt lát và method của list',
  'Buổi 30, CLO6, PY4E 8.4–8.6: nối list bằng + và lặp bằng *, cắt lát list, và các method append, extend, sort, pop, remove.',
  { s: '30', clo: 'CLO6', itu: 'I,T',
    flm: '8.4 List operations; 8.5 List slices; 8.6 List methods',
    py4e: 'chapter 8, sections 8.4–8.6',
    hEn: '7.2 — List operations, slices and methods',
    hVi: '7.2 — Phép toán, cắt lát và method của list',
    lEn: '<code>+</code> to join two lists and <code>*</code> to repeat one, slicing with the same "up to but not including" rule as strings, and the methods that change a list <em>in place</em>: <code>append</code>, <code>extend</code>, <code>sort</code>, <code>pop</code>, <code>remove</code>.',
    lVi: '<code>+</code> để nối hai list và <code>*</code> để lặp một list, cắt lát theo đúng luật "tới nhưng không gồm" như chuỗi, và các method sửa list <em>tại chỗ</em>: <code>append</code>, <code>extend</code>, <code>sort</code>, <code>pop</code>, <code>remove</code>.',
    dEn: 'build a list up one item at a time inside a loop — the single most used pattern in the rest of the course.',
    dVi: 'dựng dần một list từng phần tử một bên trong vòng lặp — mẫu được dùng nhiều nhất trong phần còn lại của môn.' });

const k73 = khung('pfp191-7-3-xoa-phan-tu-list-va-chuoi',
  '7.3 — Deleting items, lists with functions and strings|||7.3 — Xoá phần tử, list với hàm và với chuỗi',
  'Buổi 31, CLO6, PY4E 8.7–8.10: xoá phần tử bằng pop/del/remove, list làm đối số và giá trị trả về của hàm, split() cắt chuỗi thành list, và phân tích một dòng dữ liệu.',
  { s: '31', clo: 'CLO6', itu: 'IT',
    flm: 'Chapter 8. Lists (Part 2) — 8.7 Deleting elements; 8.8 Lists and functions; 8.9 Lists and strings; 8.10 Parsing lines',
    py4e: 'chapter 8, sections 8.7–8.10',
    hEn: '7.3 — Deleting items, lists with functions and with strings',
    hVi: '7.3 — Xoá phần tử, list với hàm và với chuỗi',
    lEn: 'three ways to remove an item (<code>pop</code>, <code>del</code>, <code>remove</code>) and when each is right; the built-ins that take a list (<code>len</code>, <code>max</code>, <code>min</code>, <code>sum</code>); <code>split()</code> which turns a line of text into a list of words; and <code>join()</code> which does the reverse.',
    lVi: 'ba cách xoá một phần tử (<code>pop</code>, <code>del</code>, <code>remove</code>) và khi nào dùng cái nào; các hàm dựng sẵn nhận list (<code>len</code>, <code>max</code>, <code>min</code>, <code>sum</code>); <code>split()</code> biến một dòng chữ thành list các từ; và <code>join()</code> làm điều ngược lại.',
    dEn: 'turn a line from a file into the individual fields you need — the bridge between chapter 6, chapter 7 and chapter 8.',
    dVi: 'biến một dòng trong tệp thành đúng các trường bạn cần — cây cầu nối chương 6, chương 7 và chương 8.' });

const k74 = khung('pfp191-7-4-aliasing-va-truyen-list',
  '7.4 — Objects, values, aliasing and list arguments|||7.4 — Đối tượng, giá trị, bí danh và truyền list vào hàm',
  'Buổi 32, CLO6, PY4E 8.11–8.14: khác nhau giữa "bằng nhau" và "cùng một đối tượng", bí danh (aliasing) và bản sao, hệ quả khi truyền list vào hàm, gỡ lỗi list.',
  { s: '32', clo: 'CLO6', itu: 'IT',
    flm: '8.11 Objects and values; 8.12 Aliasing; 8.13 List arguments; 8.14 Debugging',
    py4e: 'chapter 8, sections 8.11–8.14',
    hEn: '7.4 — Objects, values, aliasing and list arguments',
    hVi: '7.4 — Đối tượng, giá trị, bí danh và truyền list vào hàm',
    lEn: 'the difference between "equal" (<code>==</code>) and "the same object" (<code>is</code>); <strong>aliasing</strong> — after <code>b = a</code> there is one list with two names, so changing <code>b</code> changes <code>a</code>; how to make a real copy; and why a function that modifies its list argument changes the caller\'s list too.',
    lVi: 'khác nhau giữa "bằng nhau" (<code>==</code>) và "cùng một đối tượng" (<code>is</code>); <strong>bí danh (aliasing)</strong> — sau <code>b = a</code> chỉ có MỘT list mang hai cái tên, nên đổi <code>b</code> là đổi luôn <code>a</code>; cách tạo bản sao thật; và vì sao một hàm sửa list được truyền vào cũng sửa luôn list của nơi gọi.',
    dEn: 'explain the bug where "my list changed by itself" — the most confusing bug of the whole semester.',
    dVi: 'giải thích được con bug "list của em tự nhiên đổi" — con bug khó hiểu nhất cả kỳ.' });

const k75 = khung('pfp191-9-1-dict',
  '7.5 — Dictionaries as counters, with files and loops|||7.5 — Dictionary làm bộ đếm, với tệp và vòng lặp',
  'Buổi 33, CLO6, PY4E 9.1–9.3: dictionary ánh xạ khoá → giá trị, dùng dict đếm tần suất, get() với giá trị mặc định, đọc tệp đếm từ, và duyệt dict.',
  { s: '33', clo: 'CLO6', itu: 'IT',
    flm: 'Chapter 9. Dictionaries — 9.1 Dictionary as a set of counters; 9.2 Dictionaries and files; 9.3 Looping and dictionaries',
    py4e: 'chapter 9, sections 9.1–9.3',
    hEn: '7.5 — Dictionaries as counters, with files and loops',
    hVi: '7.5 — Dictionary làm bộ đếm, với tệp và vòng lặp',
    lEn: 'a dictionary as a <strong>key → value</strong> map (looked up by a key you choose, not by position), the counting idiom <code>d[k] = d.get(k, 0) + 1</code>, counting words across a whole file, and looping over keys, values and items.',
    lVi: 'dictionary là ánh xạ <strong>khoá → giá trị</strong> (tra theo khoá bạn tự chọn, không theo vị trí), thành ngữ đếm <code>d[k] = d.get(k, 0) + 1</code>, đếm từ trên cả một tệp, và duyệt theo khoá, theo giá trị, theo cặp.',
    dEn: 'count how many times each word appears in a file — the signature PY4E program, and a favourite exam question.',
    dVi: 'đếm mỗi từ xuất hiện bao nhiêu lần trong một tệp — chương trình đặc trưng của PY4E, và là câu hỏi thi được ưa chuộng.' });

const k76 = khung('pfp191-7-6-phan-tich-van-ban-nang-cao',
  '7.6 — Advanced text parsing and debugging|||7.6 — Phân tích văn bản nâng cao và gỡ lỗi',
  'Buổi 34, CLO6, PY4E 9.4–9.5: làm sạch văn bản thật (dấu câu, hoa thường), ghép split + dict để thống kê, và gỡ lỗi khi dữ liệu vào không sạch.',
  { s: '34', clo: 'CLO6', itu: 'IT',
    flm: '9.4 Advanced text parsing; 9.5 Debugging',
    py4e: 'chapter 9, sections 9.4–9.5',
    hEn: '7.6 — Advanced text parsing and debugging',
    hVi: '7.6 — Phân tích văn bản nâng cao và gỡ lỗi',
    lEn: 'real text is dirty: punctuation, capitals, blank lines. Stripping punctuation with <code>translate</code> or <code>replace</code>, normalising case with <code>lower()</code>, and the debugging habit of printing the dictionary at intermediate steps instead of only at the end.',
    lVi: 'văn bản thật thì bẩn: dấu câu, chữ hoa, dòng trống. Bỏ dấu câu bằng <code>translate</code> hoặc <code>replace</code>, đưa về cùng dạng chữ bằng <code>lower()</code>, và thói quen gỡ lỗi là in dictionary ở các bước trung gian chứ không chỉ in ở cuối.',
    dEn: 'get the same answer whether the text says "Python," or "python" — which is what makes a word count actually correct.',
    dVi: 'cho ra cùng một đáp án dù văn bản viết "Python," hay "python" — đó mới là cái làm cho phép đếm từ thực sự đúng.' });

const k77 = khung('pfp191-10-1-tuple',
  '7.7 — Tuples are immutable|||7.7 — Tuple là bất biến',
  'Buổi 35, CLO6, PY4E 10.1: tuple là dãy giống list nhưng không sửa được, cú pháp dấu phẩy, bẫy tuple một phần tử (5,), và khi nào chọn tuple thay vì list.',
  { s: '35', clo: 'CLO6', itu: 'I,T',
    flm: 'Chapter 10. Tuples (Part 1) — 10.1 Tuples are immutable',
    py4e: 'chapter 10, section 10.1',
    hEn: '7.7 — Tuples are immutable',
    hVi: '7.7 — Tuple là bất biến',
    lEn: 'a tuple is a sequence like a list but <strong>immutable</strong>; the comma is what makes it (so <code>(5,)</code> is a tuple and <code>(5)</code> is just the number 5); and why immutability buys you something — a tuple can be a dictionary key, a list cannot.',
    lVi: 'tuple là một dãy giống list nhưng <strong>bất biến</strong>; chính dấu phẩy làm nên tuple (nên <code>(5,)</code> là tuple còn <code>(5)</code> chỉ là số 5); và vì sao tính bất biến có cái giá của nó — tuple làm khoá dictionary được, list thì không.',
    dEn: 'choose between a list and a tuple on purpose, instead of always reaching for a list.',
    dVi: 'chọn giữa list và tuple một cách có chủ đích, thay vì lúc nào cũng với tay lấy list.' });

const k78 = khung('pfp191-7-8-so-sanh-tuple',
  '7.8 — Comparing tuples|||7.8 — So sánh tuple',
  'Buổi 36, CLO6, PY4E 10.2: so sánh tuple theo từng phần tử từ trái sang, ứng dụng để sắp xếp theo nhiều tiêu chí, và mẫu DSU (decorate-sort-undecorate).',
  { s: '36', clo: 'CLO6', itu: 'I,T',
    flm: '10.2 Comparing tuples',
    py4e: 'chapter 10, section 10.2',
    hEn: '7.8 — Comparing tuples',
    hVi: '7.8 — So sánh tuple',
    lEn: 'tuples compare element by element from the left, so <code>(1, 9) &lt; (2, 0)</code>; this gives sorting by several keys for free, and it is the basis of the <em>decorate-sort-undecorate</em> pattern used to sort a dictionary by value.',
    lVi: 'tuple so sánh từng phần tử một từ trái sang, nên <code>(1, 9) &lt; (2, 0)</code>; nhờ đó có ngay phép sắp xếp theo nhiều tiêu chí, và đó là nền của mẫu <em>decorate-sort-undecorate</em> dùng để sắp xếp dictionary theo giá trị.',
    dEn: 'sort a word-count dictionary from most frequent to least — the exercise that closes PY4E chapter 10.',
    dVi: 'sắp xếp một dictionary đếm từ theo thứ tự nhiều nhất tới ít nhất — đúng bài tập khép lại chương 10 của PY4E.' });

const k79 = khung('pfp191-7-9-gan-tuple',
  '7.9 — Tuple assignment|||7.9 — Gán tuple (unpacking)',
  'Buổi 37, CLO6, PY4E 10.3: gán nhiều biến cùng lúc, hoán đổi hai biến trong một dòng, tháo tuple từ kết quả của split, và bẫy số lượng không khớp.',
  { s: '37', clo: 'CLO6', itu: 'I,T',
    flm: '10.3 Tuple assignment',
    py4e: 'chapter 10, section 10.3',
    hEn: '7.9 — Tuple assignment (unpacking)',
    hVi: '7.9 — Gán tuple (unpacking)',
    lEn: 'assigning several names at once — <code>x, y = 1, 2</code> — which gives the one-line swap <code>a, b = b, a</code> with no temporary variable, and unpacking straight out of a <code>split()</code>. The trap: the counts on both sides must match exactly, or you get <code>ValueError</code>.',
    lVi: 'gán nhiều tên cùng lúc — <code>x, y = 1, 2</code> — nhờ đó có phép hoán đổi một dòng <code>a, b = b, a</code> không cần biến tạm, và tháo thẳng kết quả của <code>split()</code>. Bẫy: số lượng hai vế phải khớp chính xác, không thì <code>ValueError</code>.',
    dEn: 'split "an@fpt.edu.vn" into user and domain in one line.',
    dVi: 'tách "an@fpt.edu.vn" thành tên người dùng và tên miền trong đúng một dòng.' });

const k710 = khung('pfp191-7-10-dict-va-tuple',
  '7.10 — Dictionaries and tuples together|||7.10 — Dictionary và tuple đi cùng nhau',
  'Buổi 38, CLO6, PY4E 10.4: items() trả về các tuple (khoá, giá trị), sắp xếp dict theo giá trị, dùng tuple làm khoá dict, và tổng hợp list + dict + tuple.',
  { s: '38', clo: 'CLO6', itu: 'I,T',
    flm: '10.4 Dictionaries and tuples',
    py4e: 'chapter 10, section 10.4',
    hEn: '7.10 — Dictionaries and tuples together',
    hVi: '7.10 — Dictionary và tuple đi cùng nhau',
    lEn: '<code>d.items()</code> hands you a sequence of <code>(key, value)</code> tuples, which — combined with tuple comparison from session 36 — is how you sort a dictionary by its values. Also: using a tuple as a composite dictionary key.',
    lVi: '<code>d.items()</code> trao cho bạn một dãy các tuple <code>(khoá, giá trị)</code>, và kết hợp với phép so sánh tuple của buổi 36, đó chính là cách sắp xếp một dictionary theo giá trị. Thêm nữa: dùng tuple làm khoá ghép của dictionary.',
    dEn: 'produce a "top 10 most common words" report — list, dict and tuple all doing the job they are best at.',
    dVi: 'làm ra một báo cáo "10 từ xuất hiện nhiều nhất" — list, dict và tuple cùng làm đúng việc mỗi thứ giỏi nhất.' });

const k711 = khung('pfp191-7-11-lab-4',
  '7.11 — Lab 4: lists, dictionaries and tuples|||7.11 — Lab 4: list, dictionary và tuple',
  'Buổi 39–40, CLO6, Lab 4 (2% điểm môn, 90 phút): một chương trình đọc dữ liệu, thống kê bằng dictionary, sắp xếp bằng tuple và báo cáo kết quả.',
  { s: '39–40', clo: 'CLO6', itu: 'U',
    flm: 'Lab 4 assistance / Lab 4 assistance (cont.)',
    py4e: 'chapters 8, 9 and 10 together',
    hEn: '7.11 — Lab 4: lists, dictionaries and tuples in one program',
    hVi: '7.11 — Lab 4: list, dictionary và tuple trong một chương trình',
    lEn: 'two guided sessions on the three collections at once — read data, count with a dictionary, sort with tuples, report. Worth <strong>2%</strong>, 90 minutes, completion criteria &gt; 0. The exact task is set by your lecturer and is not published on FLM.',
    lVi: 'hai buổi có hướng dẫn trên cả ba kiểu tập hợp cùng lúc — đọc dữ liệu, đếm bằng dictionary, sắp xếp bằng tuple, rồi báo cáo. Giá trị <strong>2%</strong>, 90 phút, tiêu chí đạt &gt; 0. Đề cụ thể do giảng viên giao, FLM không công bố.',
    dEn: 'finish the part of the course the Practical Exam leans on hardest: sessions 29–40 are twelve of the sixty.',
    dVi: 'hoàn tất đúng phần mà kỳ thi thực hành dựa vào nhiều nhất: buổi 29–40 là mười hai trong sáu mươi buổi.' });

const c7q = quiz('pfp191-7-quiz', 'Quiz 7 — Lists, dictionaries, tuples (sessions 29–40)|||Quiz 7 — List, dictionary, tuple (buổi 29–40)', [
  { id: 'q1', question: 'How do lists differ from strings?|||List khác chuỗi ở điểm nào?', options: ['Lists are immutable|||List bất biến', 'Lists are mutable — you can change an item in place|||List thay đổi được — sửa được một phần tử tại chỗ', 'Lists hold only text|||List chỉ chứa chữ', 'Lists have no order|||List không có thứ tự'], correctIndex: 1, points: 1, explanation: 'nums[0] = 99 works on a list; s[0] = "J" on a string raises TypeError. Both are sequences indexed from 0.|||nums[0] = 99 chạy được trên list; s[0] = "J" trên chuỗi thì báo TypeError. Cả hai đều là dãy đánh chỉ số từ 0.' },
  { id: 'q2', question: 'After b = nums and then b.append(99), what happened to nums?|||Sau b = nums rồi b.append(99), nums thế nào?', options: ['Unchanged|||Không đổi', 'It got 99 too — b and nums are two names for ONE list|||Nó cũng có 99 — b và nums là hai cái tên của MỘT list', 'It was emptied|||Bị xoá sạch', 'An error|||Báo lỗi'], correctIndex: 1, points: 1, explanation: 'This is aliasing (section 8.12): b = nums copies the reference, not the list. For a real copy use b = nums[:] or list(nums).|||Đây là bí danh/aliasing (mục 8.12): b = nums chép cái tham chiếu, không chép list. Muốn bản sao thật thì dùng b = nums[:] hoặc list(nums).' },
  { id: 'q3', question: 'What does counts.get(word, 0) return when word is not a key yet?|||counts.get(word, 0) trả về gì khi word chưa phải là khoá?', options: ['KeyError', '0', 'None', 'An empty list|||Một list rỗng'], correctIndex: 1, points: 1, explanation: 'get returns the second argument as a default, which is why d[k] = d.get(k, 0) + 1 counts safely. Plain d[k] on a missing key raises KeyError.|||get trả về đối số thứ hai làm giá trị mặc định, và vì thế d[k] = d.get(k, 0) + 1 đếm được an toàn. Còn d[k] trên khoá chưa có thì báo KeyError.' },
  { id: 'q4', question: 'Which of these can be used as a dictionary key?|||Cái nào dùng làm khoá dictionary được?', options: ['A list [1, 2]|||Một list [1, 2]', 'A tuple (1, 2)|||Một tuple (1, 2)', 'Both|||Cả hai', 'Neither|||Không cái nào'], correctIndex: 1, points: 1, explanation: 'A key must be immutable. A tuple is; a list is not, so Python raises TypeError: unhashable type: list.|||Khoá phải bất biến. Tuple thì bất biến; list thì không, nên Python báo TypeError: unhashable type: list.' },
  { id: 'q5', question: 'What does a, b = b, a do?|||a, b = b, a làm gì?', options: ['Deletes a and b|||Xoá a và b', 'Swaps their values in one line, with no temporary variable|||Hoán đổi giá trị hai biến trong một dòng, không cần biến tạm', 'Sets both to 0|||Đặt cả hai bằng 0', 'Raises an error|||Báo lỗi'], correctIndex: 1, points: 1, explanation: 'Tuple assignment evaluates the whole right side first, then assigns — so the swap needs no temp. The counts on both sides must match, or ValueError.|||Gán tuple tính trọn vế phải trước rồi mới gán — nên phép hoán đổi không cần biến tạm. Số lượng hai vế phải khớp, không thì ValueError.' },
  { id: 'q6', question: 'What is the key difference between a tuple and a list?|||Khác biệt then chốt giữa tuple và list là gì?', options: ['A tuple is immutable|||Tuple bất biến', 'A tuple holds only numbers|||Tuple chỉ chứa số', 'A tuple has no order|||Tuple không có thứ tự', 'A tuple is always longer|||Tuple luôn dài hơn'], correctIndex: 0, points: 1, explanation: 'Immutability is the whole difference — and it is what lets a tuple be a dictionary key and lets tuples be compared element by element for sorting.|||Tính bất biến là toàn bộ khác biệt — và chính nó cho phép tuple làm khoá dictionary và cho phép so sánh tuple từng phần tử để sắp xếp.' },
], 480);

/* ── Chương 8 — OOP (buổi 41–46, 49–50, 52–54, CLO7) ─────────────────────── */
const k81 = khung('pfp191-11-1-oop',
  '8.1 — Introduction to OOP|||8.1 — Giới thiệu lập trình hướng đối tượng',
  'Buổi 41, CLO7, PY4E 14.1: vì sao cần OOP khi chương trình lớn lên, đối tượng gói dữ liệu cùng hành vi, và bốn trụ cột sẽ học ở các buổi sau.',
  { s: '41', clo: 'CLO7', itu: 'I,T',
    flm: 'Chapter 14. Object-oriented programming — 14.1 Introduction to OOP',
    py4e: 'chapter 14, section 14.1',
    hEn: '8.1 — Introduction to OOP',
    hVi: '8.1 — Giới thiệu lập trình hướng đối tượng',
    lEn: 'why a 500-line program made of loose variables and functions becomes unmanageable, and how an <strong>object</strong> fixes it by keeping data and the functions that work on that data in one unit. The four pillars are named here and taught one per session from 43 onwards.',
    lVi: 'vì sao một chương trình 500 dòng gồm toàn biến rời và hàm rời thì trở nên không quản nổi, và một <strong>đối tượng</strong> chữa điều đó thế nào bằng cách giữ dữ liệu cùng các hàm thao tác lên dữ liệu ấy trong một khối. Bốn trụ cột được gọi tên ở đây và dạy mỗi buổi một cái từ buổi 43 trở đi.',
    dEn: 'say what problem OOP solves — because the FLM course description names OOP as the emphasis of this whole subject.',
    dVi: 'nói được OOP giải quyết vấn đề gì — vì ô mô tả môn của FLM ghi rõ OOP là trọng tâm của cả môn này.' });

const k82 = khung('pfp191-8-2-class-va-object',
  '8.2 — Classes and objects|||8.2 — Lớp và đối tượng',
  'Buổi 42, CLO7, PY4E 14.2: class là bản thiết kế, object là thực thể, __init__ là hàm dựng, self là gì, thuộc tính và method.',
  { s: '42', clo: 'CLO7', itu: 'I,T',
    flm: '14.2 Classes and Objects',
    py4e: 'chapter 14, section 14.2',
    hEn: '8.2 — Classes and objects',
    hVi: '8.2 — Lớp và đối tượng',
    lEn: 'a <strong>class</strong> is a blueprint, an <strong>object</strong> is one thing built from it; <code>__init__</code> runs at creation; <code>self</code> is the object the method was called on, and it is the first parameter of every method whether you like it or not; attributes hold data, methods hold behaviour.',
    lVi: '<strong>class</strong> là bản thiết kế, <strong>object</strong> là một vật dựng từ nó; <code>__init__</code> chạy lúc tạo; <code>self</code> chính là đối tượng mà method được gọi lên, và nó là tham số đầu tiên của mọi method dù bạn có thích hay không; thuộc tính giữ dữ liệu, method giữ hành vi.',
    dEn: 'write your first class and create two objects from it that do not interfere with each other.',
    dVi: 'viết được class đầu tiên và tạo hai đối tượng từ nó mà chúng không giẫm lên nhau.' });

const k83 = khung('pfp191-8-3-dong-goi-va-an-du-lieu',
  '8.3 — Encapsulation and data hiding|||8.3 — Đóng gói và ẩn dữ liệu',
  'Buổi 43, CLO7, PY4E 14.3: giữ dữ liệu bên trong đối tượng, quy ước _tên và __tên trong Python, getter/setter, và vì sao chạm thẳng vào thuộc tính là rủi ro.',
  { s: '43', clo: 'CLO7', itu: 'I,T',
    flm: '14.3 Encapsulation and Data Hiding',
    py4e: 'chapter 14, section 14.3',
    hEn: '8.3 — Encapsulation and data hiding',
    hVi: '8.3 — Đóng gói và ẩn dữ liệu',
    lEn: 'keeping an object\'s data inside it and touching it only through methods; Python\'s conventions <code>_name</code> ("internal, please don\'t") and <code>__name</code> (name mangling); getters and setters, and the argument for validating in one place instead of in twenty.',
    lVi: 'giữ dữ liệu của đối tượng ở bên trong nó và chỉ chạm vào qua method; quy ước của Python là <code>_ten</code> ("nội bộ, xin đừng đụng") và <code>__ten</code> (name mangling); getter và setter, và lập luận cho việc kiểm tra dữ liệu ở một chỗ thay vì ở hai mươi chỗ.',
    dEn: 'stop a nonsensical value (a negative mark, an empty name) from ever getting into an object.',
    dVi: 'chặn một giá trị vô nghĩa (điểm âm, tên rỗng) không bao giờ lọt được vào bên trong đối tượng.' });

const k84 = khung('pfp191-8-4-truu-tuong-va-thiet-ke-module',
  '8.4 — Abstraction and modular design|||8.4 — Trừu tượng hoá và thiết kế module',
  'Buổi 44, CLO7, PY4E 14.4: phơi ra "làm gì" và giấu "làm thế nào", chia chương trình thành module/tệp, import class của mình, và tiêu chí một lớp làm đúng một việc.',
  { s: '44', clo: 'CLO7', itu: 'I,T',
    flm: '14.4 Abstraction and Modular Design',
    py4e: 'chapter 14, section 14.4',
    hEn: '8.4 — Abstraction and modular design',
    hVi: '8.4 — Trừu tượng hoá và thiết kế module',
    lEn: 'exposing <em>what</em> a class does and hiding <em>how</em>; splitting a program into several <code>.py</code> files and importing your own classes; and the test for a good class — can you describe it in one sentence without saying "and"?',
    lVi: 'phơi ra <em>làm gì</em> và giấu <em>làm thế nào</em>; chia chương trình thành nhiều tệp <code>.py</code> và import class của chính mình; và phép thử cho một lớp tốt — bạn mô tả được nó trong một câu mà không cần dùng chữ "và" không?',
    dEn: 'change how a class works internally without a single line outside it needing an edit.',
    dVi: 'đổi cách một lớp hoạt động bên trong mà không dòng nào bên ngoài nó phải sửa.' });

const k85 = khung('pfp191-8-5-ke-thua',
  '8.5 — Inheritance|||8.5 — Kế thừa',
  'Buổi 45, CLO7, PY4E 14.5: lớp con kế thừa lớp cha, cú pháp class Con(Cha), gọi super().__init__(), ghi đè method, và khi nào KHÔNG nên kế thừa.',
  { s: '45', clo: 'CLO7', itu: 'I,T',
    flm: '14.5 Inheritance',
    py4e: 'chapter 14, section 14.5',
    hEn: '8.5 — Inheritance',
    hVi: '8.5 — Kế thừa',
    lEn: 'a subclass reusing and extending a parent: <code>class Cat(Animal)</code>, calling <code>super().__init__()</code>, overriding a method, and how Python looks a method up (child first, then parent). Also the honest warning: inheritance is for "is a", not for "reuses some code".',
    lVi: 'lớp con dùng lại và mở rộng lớp cha: <code>class Cat(Animal)</code>, gọi <code>super().__init__()</code>, ghi đè một method, và Python tìm method theo thứ tự nào (con trước, rồi tới cha). Kèm một lời cảnh báo thật lòng: kế thừa là để diễn tả "là một", không phải để "dùng lại vài dòng code".',
    dEn: 'model Student and Lecturer as two kinds of Person without writing the shared part twice.',
    dVi: 'mô hình hoá Sinh viên và Giảng viên thành hai loại Người mà không viết phần chung hai lần.' });

const k86 = khung('pfp191-8-6-da-hinh-va-nap-chong',
  '8.6 — Polymorphism and method overloading|||8.6 — Đa hình và nạp chồng method',
  'Buổi 46, CLO7, PY4E 14.6: cùng một tên method chạy đúng cho từng lớp, duck typing, __str__ và __repr__, và vì sao Python không có nạp chồng kiểu Java.',
  { s: '46', clo: 'CLO7', itu: 'I,T',
    flm: '14.6 Polymorphism and Method Overloading',
    py4e: 'chapter 14, section 14.6',
    hEn: '8.6 — Polymorphism and method overloading',
    hVi: '8.6 — Đa hình và nạp chồng method',
    lEn: 'one method name behaving correctly for several classes, so a single <code>for</code> loop can drive a list of different objects; <em>duck typing</em>; the special methods <code>__str__</code> and <code>__repr__</code>; and why Python does <strong>not</strong> overload by signature the way Java does — it uses default and keyword arguments instead.',
    lVi: 'một tên method chạy đúng cho nhiều lớp khác nhau, nhờ đó một vòng <code>for</code> duy nhất điều khiển được một list các đối tượng khác loại; <em>duck typing</em>; hai method đặc biệt <code>__str__</code> và <code>__repr__</code>; và vì sao Python <strong>không</strong> nạp chồng theo chữ ký như Java — nó dùng đối số mặc định và đối số có tên thay thế.',
    dEn: 'print a list of mixed objects with one loop and have each print itself correctly.',
    dVi: 'in một list gồm nhiều loại đối tượng bằng một vòng lặp, và mỗi cái tự in ra đúng kiểu của nó.' });

const k87 = khung('pfp191-8-7-dung-doi-tuong',
  '8.7 — Using objects, working with OOP programs|||8.7 — Dùng đối tượng, làm việc với chương trình OOP',
  'Buổi 49, CLO7, PY4E 14.7: đọc và sửa một chương trình OOP có sẵn, list chứa các đối tượng, đối tượng chứa đối tượng, và lần theo luồng qua nhiều lớp.',
  { s: '49', clo: 'CLO7', itu: 'I,T',
    flm: '14.7 Using Objects and Work with OOP Programs',
    py4e: 'chapter 14, section 14.7',
    hEn: '8.7 — Using objects and working with OOP programs',
    hVi: '8.7 — Dùng đối tượng và làm việc với chương trình OOP',
    lEn: 'reading and modifying an OOP program you did not write: a list of objects, an object holding another object, and tracing a call across several classes. Note the session order — FLM puts the Assignment sessions 47–48 in the middle of this chapter.',
    lVi: 'đọc và sửa một chương trình OOP không do bạn viết: một list chứa các đối tượng, một đối tượng chứa đối tượng khác, và lần theo một lời gọi đi qua nhiều lớp. Chú ý thứ tự buổi — FLM đặt hai buổi Assignment 47–48 vào giữa chương này.',
    dEn: 'work inside an existing codebase, which is what every job actually consists of.',
    dVi: 'làm việc bên trong một kho mã có sẵn, và đó mới là thứ mọi công việc thật sự bao gồm.' });

const k88 = khung('pfp191-8-8-vong-doi-doi-tuong',
  '8.8 — Object lifecycle|||8.8 — Vòng đời đối tượng',
  'Buổi 50, CLO7, PY4E 14.8: đối tượng được tạo, dùng, rồi huỷ; __init__ và __del__; đếm tham chiếu và bộ dọn rác của Python; vì sao hiếm khi cần __del__.',
  { s: '50', clo: 'CLO7', itu: 'I,T',
    flm: '14.8 Object Lifecycle',
    py4e: 'chapter 14, section 14.8',
    hEn: '8.8 — Object lifecycle',
    hVi: '8.8 — Vòng đời đối tượng',
    lEn: 'created (<code>__init__</code>), used, destroyed; how Python decides an object is finished (reference counting plus a garbage collector), <code>__del__</code> and why you almost never write one, and what this has to do with the aliasing lesson from session 32.',
    lVi: 'được tạo (<code>__init__</code>), được dùng, rồi bị huỷ; Python quyết định một đối tượng đã xong thế nào (đếm tham chiếu cộng bộ dọn rác), <code>__del__</code> và vì sao gần như không bao giờ phải tự viết, và điều này liên quan gì tới bài về bí danh ở buổi 32.',
    dEn: 'answer "when does my object disappear?" — the question that links OOP back to the RAM diagram in session 1.',
    dVi: 'trả lời được "đối tượng của em biến mất lúc nào?" — câu hỏi nối OOP ngược về sơ đồ RAM ở buổi 1.' });

const k89 = khung('pfp191-8-9-oop-nang-cao-va-design-pattern',
  '8.9 — Advanced OOP concepts and design patterns|||8.9 — OOP nâng cao và mẫu thiết kế',
  'Buổi 52, CLO7, PY4E 14.9: thuộc tính/method của lớp so với của thực thể, @property, composition so với inheritance, và ý niệm mẫu thiết kế.',
  { s: '52', clo: 'CLO7', itu: 'I,T',
    flm: '14.9 Advanced OOP Concepts and Design Patterns',
    py4e: 'chapter 14, section 14.9',
    hEn: '8.9 — Advanced OOP concepts and design patterns',
    hVi: '8.9 — OOP nâng cao và mẫu thiết kế',
    lEn: 'class attributes versus instance attributes (and the classic bug where one is shared by every object), <code>@property</code> for a getter that reads like an attribute, <em>composition</em> as the usual alternative to inheritance, and what a <strong>design pattern</strong> is — a named solution to a problem that keeps recurring.',
    lVi: 'thuộc tính của lớp so với thuộc tính của thực thể (và con bug kinh điển khi một thứ bị mọi đối tượng dùng chung), <code>@property</code> để viết getter mà đọc như thuộc tính, <em>composition</em> là lựa chọn thường dùng thay cho kế thừa, và <strong>mẫu thiết kế</strong> là gì — một lời giải có tên cho một bài toán cứ lặp lại.',
    dEn: 'recognise when a class is doing too much, and know the standard way out.',
    dVi: 'nhận ra lúc một lớp đang ôm quá nhiều việc, và biết lối ra tiêu chuẩn.' });

const k810 = khung('pfp191-8-10-case-study',
  '8.10 — Case studies|||8.10 — Các tình huống nghiên cứu',
  'Buổi 53, CLO7, PY4E 14.10: đi trọn một bài toán thật từ mô tả bằng lời tới các lớp; chọn danh từ làm lớp, động từ làm method; và đánh giá lại thiết kế sau khi code.',
  { s: '53', clo: 'CLO7', itu: 'I,T',
    flm: '14.10 Case Studies',
    py4e: 'chapter 14, section 14.10',
    hEn: '8.10 — Case studies',
    hVi: '8.10 — Các tình huống nghiên cứu',
    lEn: 'one full problem taken from a paragraph of Vietnamese to a working set of classes: find the nouns (candidate classes), find the verbs (candidate methods), write the smallest version that runs, then look again and see what the code taught you about the design.',
    lVi: 'một bài toán trọn vẹn đi từ một đoạn văn tiếng Việt tới một bộ lớp chạy được: tìm các danh từ (ứng viên làm lớp), tìm các động từ (ứng viên làm method), viết bản nhỏ nhất chạy được, rồi nhìn lại xem code vừa dạy bạn điều gì về thiết kế.',
    dEn: 'do what the Assignment asks — this session is the rehearsal for it.',
    dVi: 'làm đúng thứ Assignment yêu cầu — buổi này là buổi tập dượt cho nó.' });

const k811 = khung('pfp191-8-11-tong-ket-oop',
  '8.11 — OOP summary|||8.11 — Tổng kết OOP',
  'Buổi 54, CLO7, PY4E 14.11: gom bốn trụ cột về một bảng, checklist đọc một class lạ, các lỗi OOP hay gặp, và chốt phạm vi CLO7 cho Progress Test 2 và thi cuối kỳ.',
  { s: '54', clo: 'CLO7', itu: 'I,T',
    flm: '14.11 Summary',
    py4e: 'chapter 14, section 14.11',
    hEn: '8.11 — OOP summary',
    hVi: '8.11 — Tổng kết OOP',
    lEn: 'the four pillars in one table, a checklist for reading an unfamiliar class, the OOP mistakes that cost marks (a forgotten <code>self</code>, attributes never set in <code>__init__</code>, a class attribute used where an instance attribute was meant), and the CLO7 scope for the exams.',
    lVi: 'bốn trụ cột gom về một bảng, checklist để đọc một class lạ, những lỗi OOP hay mất điểm (quên <code>self</code>, thuộc tính không bao giờ được gán trong <code>__init__</code>, dùng thuộc tính lớp ở chỗ đáng lẽ là thuộc tính thực thể), và phạm vi CLO7 cho các kỳ thi.',
    dEn: 'walk into Progress Test 2 (session 51 — note it falls before this summary) and the Final Exam knowing exactly what CLO7 asks of you.',
    dVi: 'bước vào Progress Test 2 (buổi 51 — chú ý nó rơi TRƯỚC buổi tổng kết này) và kỳ thi cuối với hiểu biết rõ CLO7 đòi gì ở bạn.' });

const c8q = quiz('pfp191-8-quiz', 'Quiz 8 — OOP (sessions 41–54)|||Quiz 8 — Hướng đối tượng (buổi 41–54)', [
  { id: 'q1', question: 'What is the relationship between a class and an object?|||Quan hệ giữa lớp (class) và đối tượng (object) là gì?', options: ['They are the same thing|||Chúng là một', 'A class is a blueprint; an object is one thing built from it|||Lớp là bản thiết kế; đối tượng là một vật dựng từ nó', 'An object is a blueprint for a class|||Đối tượng là bản thiết kế của lớp', 'A class is a kind of loop|||Lớp là một loại vòng lặp'], correctIndex: 1, points: 1, explanation: 'One class, many objects — each object has its own attribute values but shares the class\'s methods.|||Một lớp, nhiều đối tượng — mỗi đối tượng có giá trị thuộc tính riêng nhưng dùng chung các method của lớp.' },
  { id: 'q2', question: 'When a subclass writes its own version of a parent method, that is…|||Khi lớp con tự viết lại một method của lớp cha, đó là…', options: ['Encapsulation|||Đóng gói', 'Inheritance only|||Chỉ là kế thừa', 'Polymorphism (overriding)|||Đa hình (ghi đè)', 'Abstraction|||Trừu tượng hoá'], correctIndex: 2, points: 1, explanation: 'Overriding is what makes one loop over a mixed list print each object correctly — the practical payoff of polymorphism.|||Ghi đè chính là thứ làm một vòng lặp trên list nhiều loại in đúng từng đối tượng — cái lợi thực tế của đa hình.' },
  { id: 'q3', question: 'What is the first parameter of every instance method called?|||Tham số đầu tiên của mọi method thực thể tên là gì?', options: ['this', 'self', 'me', 'obj'], correctIndex: 1, points: 1, explanation: 'self — the object the method was called on. Forgetting it is the classic first-class error: TypeError about the number of arguments.|||self — chính đối tượng mà method được gọi lên. Quên nó là lỗi kinh điển của bài OOP đầu tiên: TypeError về số lượng đối số.' },
  { id: 'q4', question: 'Which method runs automatically when you create an object?|||Method nào tự chạy khi bạn tạo một đối tượng?', options: ['__str__', '__init__', '__del__', 'main'], correctIndex: 1, points: 1, explanation: '__init__ is the constructor: it sets the object\'s attributes. __del__ runs at the end of the lifecycle; __str__ runs when the object is printed.|||__init__ là hàm dựng: nó gán các thuộc tính của đối tượng. __del__ chạy ở cuối vòng đời; __str__ chạy khi đối tượng được in ra.' },
  { id: 'q5', question: 'Keeping data inside an object and touching it only through methods is…|||Giữ dữ liệu bên trong đối tượng và chỉ chạm vào qua method gọi là…', options: ['Inheritance|||Kế thừa', 'Encapsulation|||Đóng gói', 'Polymorphism|||Đa hình', 'Iteration|||Lặp'], correctIndex: 1, points: 1, explanation: 'Encapsulation, taught in session 43. Its practical value: a bad value can be rejected in ONE place instead of everywhere.|||Đóng gói, dạy ở buổi 43. Giá trị thực tế của nó: một giá trị sai bị chặn ở MỘT chỗ thay vì ở khắp nơi.' },
], 420);

/* ── Chương 9 — Assignment (buổi 47–48, 57–58, CLO1–CLO7) ────────────────── */
const k91 = khung('pfp191-9-assignment-huong-dan',
  '9.1 — Assignment: guided sessions (47–48)|||9.1 — Assignment: hai buổi hướng dẫn (47–48)',
  'Buổi 47–48, CLO1–CLO7, Assignment (15% điểm môn, trải 28 buổi): hai buổi có giảng viên hướng dẫn; phân tích đề, chia việc, dựng khung chương trình.',
  { s: '47–48', clo: 'CLO1 – CLO7', itu: 'U',
    flm: 'Assignment assistance / Assignment assistance (cont.)',
    py4e: 'everything from chapters 1–10 and 14',
    hEn: '9.1 — Assignment: the two guided sessions',
    hVi: '9.1 — Assignment: hai buổi hướng dẫn',
    lEn: 'FLM publishes about the Assignment: <strong>15% of the grade</strong>, 1 part, type "Review", CLO1–CLO7, completion criteria &gt; 0, and a Duration of <strong>"28 slots"</strong> — it runs across 28 sessions, not one sitting. These two sessions are the guided ones; sessions 57–58 are the review.',
    lVi: 'FLM công bố về Assignment: <strong>15% điểm môn</strong>, 1 phần, dạng "Review", CLO1–CLO7, tiêu chí đạt &gt; 0, và Duration ghi <strong>"28 slots"</strong> — nó trải trên 28 buổi chứ không làm một lần. Hai buổi này là buổi hướng dẫn; buổi 57–58 mới là buổi chữa.',
    dEn: 'leave session 48 with a written plan and a skeleton that runs, not with an idea. Which 28 sessions the Assignment spans is not published — ask your lecturer for the deadline in week 1.',
    dVi: 'rời buổi 48 với một bản kế hoạch viết ra giấy và một bộ khung chạy được, chứ không phải với một ý tưởng. Cụ thể là 28 buổi nào thì trường không công bố — hãy hỏi giảng viên hạn nộp ngay tuần đầu.' });

const k92 = khung('pfp191-9-assignment-review',
  '9.2 — Assignment review (sessions 57–58)|||9.2 — Chữa Assignment (buổi 57–58)',
  'Buổi 57–58, CLO1–CLO7: hai buổi chữa Assignment — trình bày, nhận xét, sửa lỗi; đây là hai buổi cuối trước phần ôn thi ở buổi 59–60.',
  { s: '57–58', clo: 'CLO1 – CLO7', itu: 'U',
    flm: 'Assignment review / Assignment review (cont.)',
    py4e: 'everything from chapters 1–10 and 14',
    hEn: '9.2 — Assignment review',
    hVi: '9.2 — Chữa Assignment',
    lEn: 'the two sessions where the Assignment is gone through. Expect to explain your own code out loud: what each class is for, why you chose a dictionary over a list, what happens when the input file is missing.',
    lVi: 'hai buổi ngồi chữa Assignment. Hãy chuẩn bị tinh thần giải thích code của chính mình thành tiếng: mỗi lớp để làm gì, vì sao chọn dictionary thay vì list, chuyện gì xảy ra khi tệp dữ liệu không tồn tại.',
    dEn: 'defend a design decision, which is a different skill from making the program run — and the one that is still useful after graduation.',
    dVi: 'bảo vệ được một quyết định thiết kế, một kỹ năng khác hẳn với việc làm cho chương trình chạy — và là kỹ năng còn dùng được sau khi ra trường.' });

const c9q = quiz('pfp191-9-quiz', 'Quiz 9 — The Assignment: rules and planning|||Quiz 9 — Assignment: quy định và cách lên kế hoạch', [
  { id: 'q1', question: 'What is the Assignment worth, and how many parts does FLM list?|||Assignment chiếm bao nhiêu phần trăm, và FLM ghi mấy phần?', options: ['15%, 1 part|||15%, 1 phần', '10%, 5 parts|||10%, 5 phần', '30%, 1 part|||30%, 1 phần', '15%, 2 parts|||15%, 2 phần'], correctIndex: 0, points: 1, explanation: '15%, one part, type "Review", CLO1–CLO7, completion criteria > 0. 10% with 5 parts is the Lab; 15% with 2 parts is the Progress Test.|||15%, một phần, dạng "Review", CLO1–CLO7, tiêu chí đạt > 0. 10% với 5 phần là Lab; 15% với 2 phần là Progress Test.' },
  { id: 'q2', question: 'The Duration column for the Assignment says "28 slots". What does that mean?|||Cột Duration của Assignment ghi "28 slots". Nghĩa là gì?', options: ['It takes 28 minutes|||Làm trong 28 phút', 'It runs across 28 sessions, not one sitting|||Nó trải trên 28 buổi, không làm một lần', 'There are 28 questions|||Có 28 câu hỏi', '28 students per group|||28 sinh viên một nhóm'], correctIndex: 1, points: 1, explanation: 'It is a long-running piece of work. FLM schedules guided sessions at 47–48 and a review at 57–58; exactly which 28 sessions it spans is not published.|||Đây là một đầu việc chạy dài. FLM xếp buổi hướng dẫn ở 47–48 và buổi chữa ở 57–58; cụ thể là 28 buổi nào thì trường không công bố.' },
  { id: 'q3', question: 'Which sessions does FLM schedule for Assignment review?|||FLM xếp buổi nào để chữa Assignment?', options: ['47–48', '51', '57–58', '59–60'], correctIndex: 2, points: 1, explanation: '47–48 are "Assignment assistance", 57–58 are "Assignment review". Session 51 is Progress Test 2 and 59–60 are the final Review.|||47–48 là "Assignment assistance", 57–58 là "Assignment review". Buổi 51 là Progress Test 2 còn 59–60 là ôn tập cuối kỳ.' },
  { id: 'q4', question: 'Which CLOs does the Assignment cover, according to the assessment table?|||Theo bảng đánh giá, Assignment phủ những CLO nào?', options: ['CLO1 – CLO3', 'CLO7 only|||Chỉ CLO7', 'CLO1 – CLO7 (all of them)|||CLO1 – CLO7 (tất cả)', 'CLO4 – CLO6'], correctIndex: 2, points: 1, explanation: 'Every one of the five marks is tagged CLO1 – CLO7 in the FLM table — the Assignment included. There is no outcome you can leave out of it.|||Cả năm đầu điểm trong bảng FLM đều gắn CLO1 – CLO7, Assignment cũng vậy. Không có chuẩn đầu ra nào bỏ ra ngoài được.' },
], 420);

/* ── Chương 10 — Progress Test 2, Lab 5 & ôn thi (buổi 51, 55–56, 59–60) ── */
const k101 = khung('pfp191-10-progress-test-2',
  '10.1 — Progress Test 2 (session 51): 20 questions, 30 minutes|||10.1 — Progress Test 2 (buổi 51): 20 câu, 30 phút',
  'Buổi 51, CLO1–CLO7, Progress Test 2: bài thứ hai của đầu điểm Progress Test (15% tổng), 30 phút, 20 câu; FLM gắn LO1–LO7 nên phạm vi là cả môn tính tới buổi 50.',
  { s: '51', clo: 'CLO1 – CLO7', itu: 'U',
    flm: 'Progress test 2',
    py4e: 'chapters 1–10 and 14.1–14.8',
    hEn: '10.1 — Progress Test 2',
    hVi: '10.1 — Progress Test 2 (Kiểm tra tiến độ 2)',
    lEn: 'the second Progress Test: <strong>30 minutes, 20 questions</strong>, multiple choice marked by computer, completion criteria &gt; 0, and it shares the 15% with PT1. FLM tags this session <strong>LO1 – LO7</strong>, not just the OOP outcome — so the scope is the whole course up to session 50.',
    lVi: 'bài Progress Test thứ hai: <strong>30 phút, 20 câu</strong>, trắc nghiệm máy chấm, tiêu chí đạt &gt; 0, và nó chia chung 15% với PT1. FLM gắn buổi này <strong>LO1 – LO7</strong>, không phải mỗi chuẩn đầu ra về OOP — nên phạm vi là cả môn tính tới buổi 50.',
    dEn: 'notice the ordering: PT2 is at session 51 but the OOP summary is at session 54, so do not wait for the summary to revise OOP.',
    dVi: 'để ý thứ tự: PT2 ở buổi 51 nhưng buổi tổng kết OOP lại ở buổi 54, nên đừng đợi buổi tổng kết mới ôn OOP.' });

const k102 = khung('pfp191-10-lab-5',
  '10.2 — Lab 5: the OOP lab (sessions 55–56)|||10.2 — Lab 5: bài lab về OOP (buổi 55–56)',
  'Buổi 55–56, CLO7, Lab 5 (2% điểm môn, 90 phút): bài lab cuối, dựng một chương trình có lớp, kế thừa và đa hình; là bài lab duy nhất FLM gắn mức ITU là I,T.',
  { s: '55–56', clo: 'CLO7', itu: 'I,T',
    flm: 'Lab 5 assistance / Lab 5 assistance (cont.)',
    py4e: 'chapter 14',
    hEn: '10.2 — Lab 5: the OOP lab',
    hVi: '10.2 — Lab 5: bài lab về OOP',
    lEn: 'the last of the five labs — worth <strong>2%</strong>, 90 minutes, completion criteria &gt; 0 — building a program with classes, inheritance and polymorphism. A detail worth noticing: FLM tags Lab 5 with ITU <strong>I,T</strong> while the other four labs are tagged <strong>U</strong>. We report that as published and do not guess why.',
    lVi: 'bài cuối trong năm bài lab — giá trị <strong>2%</strong>, 90 phút, tiêu chí đạt &gt; 0 — dựng một chương trình có lớp, kế thừa và đa hình. Một chi tiết đáng để ý: FLM gắn Lab 5 mức ITU <strong>I,T</strong> trong khi bốn bài lab kia đều là <strong>U</strong>. Web ghi lại đúng như bản công bố và không đoán lý do.',
    dEn: 'have written OOP yourself before the Final Exam asks 50 questions about it.',
    dVi: 'tự tay viết OOP trước khi kỳ thi cuối hỏi 50 câu về nó.' });

const k103 = khung('pfp191-10-on-thi-cuoi-ky',
  '10.3 — Final review (sessions 59–60) & exam strategy|||10.3 — Ôn tập cuối kỳ (buổi 59–60) & chiến thuật thi',
  'Buổi 59–60, tất cả CLO: hai buổi ôn tập cuối cùng; kèm phân tích cấu trúc thi cuối kỳ (30%, 60 phút, 50 câu máy chấm = 72 giây một câu) và cách ôn theo CLO.',
  { s: '59–60', clo: 'All LOs', itu: '—',
    flm: 'Review / Review',
    py4e: 'the whole book as scheduled: chapters 1–10 and 14',
    hEn: '10.3 — Final review and exam strategy',
    hVi: '10.3 — Ôn tập cuối kỳ và chiến thuật thi',
    lEn: 'the last two sessions. FLM leaves the ITU column <strong>blank</strong> for these two and tags them "All LOs". What the Final Exam is, from the assessment table: <strong>30%</strong>, <strong>60 minutes</strong>, <strong>50 multiple-choice questions</strong>, marked by computer, CLO1–CLO7, completion criteria <strong>4</strong>.',
    lVi: 'hai buổi cuối cùng. FLM để TRỐNG cột ITU cho hai buổi này và gắn "All LOs". Thi cuối kỳ là gì, theo bảng đánh giá: <strong>30%</strong>, <strong>60 phút</strong>, <strong>50 câu trắc nghiệm</strong>, máy chấm, CLO1–CLO7, tiêu chí đạt <strong>4</strong>.',
    dEn: 'do the arithmetic before the exam, not during it: 60 minutes over 50 questions is <strong>72 seconds each</strong>, so revise by re-typing code, not by re-reading notes. Remember the other rule as well — under 80% attendance and you are not admitted at all.',
    dVi: 'làm phép tính trước kỳ thi chứ không phải trong kỳ thi: 60 phút cho 50 câu là <strong>72 giây một câu</strong>, nên hãy ôn bằng cách gõ lại code, đừng ôn bằng cách đọc lại vở. Và nhớ luôn quy định kia — dự dưới 80% số buổi là không được vào thi.' });

const c10q = quiz('pfp191-10-quiz', 'Quiz 10 — Exam rules & the whole-course map|||Quiz 10 — Quy định thi & bản đồ cả môn', [
  { id: 'q1', question: 'The Final Exam is 50 questions in 60 minutes. How long is that per question?|||Thi cuối kỳ 50 câu trong 60 phút. Trung bình bao lâu một câu?', options: ['About 30 seconds|||Khoảng 30 giây', 'About 72 seconds|||Khoảng 72 giây', 'About 2 minutes|||Khoảng 2 phút', 'About 5 minutes|||Khoảng 5 phút'], correctIndex: 1, points: 1, explanation: '60 × 60 / 50 = 72 seconds. That is reading time plus deciding time, so the marks come from reflexes, not from recall.|||60 × 60 / 50 = 72 giây. Đó là cả thời gian đọc lẫn thời gian quyết, nên điểm đến từ phản xạ chứ không từ trí nhớ.' },
  { id: 'q2', question: 'Which session is Progress Test 2, and which is Lab 5?|||Progress Test 2 là buổi nào, và Lab 5 là buổi nào?', options: ['PT2 at 51; Lab 5 at 55–56|||PT2 ở buổi 51; Lab 5 ở buổi 55–56', 'PT2 at 55; Lab 5 at 51|||PT2 ở buổi 55; Lab 5 ở buổi 51', 'PT2 at 20; Lab 5 at 39–40|||PT2 ở buổi 20; Lab 5 ở buổi 39–40', 'PT2 at 59; Lab 5 at 60|||PT2 ở buổi 59; Lab 5 ở buổi 60'], correctIndex: 0, points: 1, explanation: 'Session 51 is Progress test 2 and sessions 55–56 are Lab 5 assistance. Session 20 is PT1; 39–40 is Lab 4; 59–60 is Review.|||Buổi 51 là Progress test 2 và buổi 55–56 là Lab 5 assistance. Buổi 20 là PT1; 39–40 là Lab 4; 59–60 là ôn tập.' },
  { id: 'q3', question: 'You attended 47 of the 60 sessions. What happens?|||Bạn dự 47 trên 60 buổi. Chuyện gì xảy ra?', options: ['Nothing — 47 is fine|||Không sao — 47 là đủ', 'You are not admitted to the final exam: 80% of 60 is 48|||Bạn không được vào thi cuối kỳ: 80% của 60 là 48', 'You lose 5 marks|||Bạn bị trừ 5 điểm', 'You must retake the labs|||Bạn phải học lại các bài lab'], correctIndex: 1, points: 1, explanation: 'StudentTasks, verbatim: at least 80% of contact slots to be accepted to the final examination. 80% of 60 = 48, so 47 is one short — and this is the one rule no later mark can repair.|||Ô StudentTasks, nguyên văn: dự ít nhất 80% số buổi mới được vào thi cuối kỳ. 80% của 60 = 48, nên 47 là thiếu một buổi — và đây là quy định duy nhất không đầu điểm nào về sau cứu được.' },
  { id: 'q4', question: 'Which two chapters of the syllabus are adjacent even though their numbers are not?|||Hai chương nào của syllabus đứng cạnh nhau dù số hiệu không liền?', options: ['Chapter 6 and Chapter 8|||Chương 6 và Chương 8', 'Chapter 10 (Tuples) and Chapter 14 (OOP)|||Chương 10 (Tuple) và Chương 14 (OOP)', 'Chapter 2 and Chapter 5|||Chương 2 và Chương 5', 'Chapter 1 and Chapter 3|||Chương 1 và Chương 3'], correctIndex: 1, points: 1, explanation: 'Session 38 ends Chapter 10 and session 41 opens Chapter 14. PY4E chapters 11–13 (Regex, Networked programs, Databases) are not part of PFP191.|||Buổi 38 khép Chương 10 và buổi 41 mở Chương 14. Chương 11–13 của PY4E (Regex, chương trình mạng, cơ sở dữ liệu) không thuộc PFP191.' },
], 420);

const c11q = quiz('pfp191-11-quiz', 'Quiz 11 — Final Exam rehearsal: a bit of everything|||Quiz 11 — Thi thử cuối kỳ: mỗi thứ một chút', [
  { id: 'q1', question: 'What does this print?|||Đoạn này in ra gì?', code: 'print(7 // 2, 7 % 2, 7 / 2)', codeLang: 'python', options: ['3 1 3.5', '3.5 1 3', '3 3.5 1', '1 3 3.5'], correctIndex: 0, points: 1, explanation: '// is the whole part (3), % is the remainder (1), / always returns a float (3.5). CLO2, session 5.|||// là phần nguyên (3), % là số dư (1), / luôn trả về float (3.5). CLO2, buổi 5.' },
  { id: 'q2', question: 'What type does input() return?|||input() trả về kiểu gì?', options: ['int', 'str', 'float', 'bool'], correctIndex: 1, points: 1, explanation: 'Always str. Arithmetic on it without int()/float() gives TypeError. CLO2, session 7.|||Luôn là str. Tính toán trên nó mà không int()/float() sẽ cho TypeError. CLO2, buổi 7.' },
  { id: 'q3', question: 'In Python, a block of code is marked by…|||Trong Python, một khối lệnh được đánh dấu bằng…', options: ['Braces { }|||Ngoặc nhọn { }', 'Indentation|||Thụt lề', 'begin / end', 'Semicolons|||Dấu chấm phẩy'], correctIndex: 1, points: 1, explanation: 'Indentation, which is why IndentationError exists at all. CLO3, session 10.|||Thụt lề, và đó là lý do tồn tại của lỗi IndentationError. CLO3, buổi 10.' },
  { id: 'q4', question: 'Which of these is IMMUTABLE?|||Cái nào BẤT BIẾN?', options: ['list', 'dict', 'tuple', 'All of them are mutable|||Cả ba đều thay đổi được'], correctIndex: 2, points: 1, explanation: 'Tuples and strings are immutable; lists and dicts are not. That is why a tuple can be a dictionary key. CLO6, session 35.|||Tuple và chuỗi là bất biến; list và dict thì không. Vì thế tuple làm khoá dictionary được. CLO6, buổi 35.' },
  { id: 'q5', question: 'What does open("data.txt", "w") do to an existing file?|||open("data.txt", "w") làm gì với một tệp đã có?', options: ['Appends|||Ghi thêm vào cuối', 'Erases it first|||Xoá sạch nó trước', 'Raises an error|||Báo lỗi', 'Reads it|||Đọc nó'], correctIndex: 1, points: 1, explanation: 'Mode "w" truncates. Use "a" to append. CLO5, session 26.|||Chế độ "w" cắt tệp về rỗng. Muốn ghi thêm thì dùng "a". CLO5, buổi 26.' },
  { id: 'q6', question: 'What is the first parameter of an instance method?|||Tham số đầu tiên của một method thực thể là gì?', options: ['this', 'self', 'cls', 'object'], correctIndex: 1, points: 1, explanation: 'self. CLO7, session 42 — and forgetting it is the most common OOP error in the exam.|||self. CLO7, buổi 42 — và quên nó là lỗi OOP phổ biến nhất trong đề thi.' },
  { id: 'q7', question: 'What does this print?|||Đoạn này in ra gì?', code: 'd = {}\\nfor w in "a b a c a".split():\\n    d[w] = d.get(w, 0) + 1\\nprint(d["a"], len(d))', codeLang: 'python', options: ['3 3', '3 5', '1 3', '5 3'], correctIndex: 0, points: 1, explanation: 'split() gives [a, b, a, c, a]; "a" appears 3 times, and the dictionary has 3 distinct keys (a, b, c). CLO6, session 33.|||split() cho [a, b, a, c, a]; "a" xuất hiện 3 lần, và dictionary có 3 khoá khác nhau (a, b, c). CLO6, buổi 33.' },
  { id: 'q8', question: 'A program runs, prints a number, and the number is wrong. Which kind of error?|||Chương trình chạy, in ra một con số, và con số đó sai. Lỗi loại nào?', options: ['Syntax|||Cú pháp', 'Runtime', 'Logic', 'Indentation'], correctIndex: 2, points: 1, explanation: 'A logic error — no message, no crash, just a wrong answer. CLO1, session 3, and the reason you always check the arithmetic by hand.|||Lỗi logic — không thông báo, không vỡ, chỉ là đáp án sai. CLO1, buổi 3, và là lý do lúc nào cũng phải kiểm lại số học bằng tay.' },
], 600);

/* ═══════════════ EXPORT ═══════════════ */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'PFP191',
    slug: 'pfp191-programming-fundamentals-with-python',
    title: 'Programming Fundamentals with Python',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PFP191.webp',
    shortDescription: 'Programming Fundamentals with Python on FLM syllabus 12224: all 60 sessions, 7 CLOs, the five marks, free Python for Everybody textbook. Chapter 1 fully taught with runnable Python; chapters 2-10 are the framework.|||Cơ sở lập trình với Python theo syllabus FLM 12224: đủ 60 buổi, 7 CLO, năm đầu điểm, giáo trình Python for Everybody miễn phí. Chương 1 giảng đầy đủ, code chạy được; chương 2-10 là khung.',
    description: 'Môn <strong>PFP191 — Programming Fundamentals with Python</strong> (Cơ sở lập trình với Python) là môn lập trình <strong>nền</strong> đầu tiên của ngành IT/AI, kỳ 1, 3 tín chỉ, 60 buổi. Web dựng lại môn này bám <strong>syllabus FLM 12224</strong> (QĐ 1286/QĐ-ĐHFPT ngày 22/11/2024): <strong>Mục 0</strong> là khung chuẩn của trường — hồ sơ môn, năm đầu điểm (Assignment 15% · Lab 10% · Practical Exam 30% · Progress Test 15% · Final Exam 30% = 100%), bảy CLO nguyên văn, bốn giáo trình (đều MIỄN PHÍ, sách chính <em>Python for Everybody</em> của Charles R. Severance), và bảng đủ <strong>60 buổi</strong> để bạn đối chiếu với bản trường phát. <strong>Chương 1 (buổi 1–9)</strong> đã giảng đầy đủ song ngữ với code Python chạy thật. <strong>Chương 2–10</strong> hiện là KHUNG: đúng tên bài, đúng buổi, đúng CLO, đúng mục sách — nội dung chi tiết bổ sung dần. Công cụ: VS Code, Google Colab.',
    whatYouLearn: 'Khung môn theo FLM: đọc hiểu syllabus 12224, năm đầu điểm và trọng số, bảy CLO, quy định dự ≥80% buổi, kế hoạch đủ 60 buổi. Chương 1 (đầy đủ): máy tính chạy chương trình thế nào (CPU/RAM/đĩa/vào-ra), thông dịch vs biên dịch, sáu khối xây dựng chương trình, ba loại lỗi và cách gỡ, giá trị &amp; bốn kiểu cơ bản, biến và 35 từ khoá, bảy toán tử số học và khác biệt / với //, thứ tự ưu tiên PEMDAS cùng hai bẫy 2**3**2 và -2**2, modulo để tách đơn vị, nối và lặp chuỗi, input() luôn trả về str và cách ép kiểu, chú thích giải thích VÌ SAO, đặt tên biến có nghĩa, và Lab 1 hoàn chỉnh. Khung chương 2–10: rẽ nhánh &amp; vòng lặp, hàm, chuỗi, tệp, list/dictionary/tuple, OOP (class, đóng gói, trừu tượng, kế thừa, đa hình, vòng đời, design pattern), Assignment, hai Progress Test và ôn thi cuối kỳ.',
    requirements: 'Ô Pre-Requisite trên FLM để TRỐNG — trường không công bố môn tiên quyết. Web dạy môn này với giả định bạn chưa từng lập trình. Cần một máy cài được Python 3 và VS Code, hoặc chỉ cần trình duyệt để dùng Google Colab (cả hai công cụ đều do syllabus chỉ định). Không phải mua sách: cả bốn giáo trình trường chỉ định đều miễn phí.',
  },
  sections: [
    { title: '📚 Resource hub — free Python materials|||📚 Trung tâm tài liệu — nguồn học Python miễn phí',
      description: 'Bốn giáo trình FLM dạng thẻ bấm được (cả bốn đều miễn phí) cộng tài liệu tra cứu, công cụ online, video và lộ trình tự học do web gom thêm.',
      lessons: [taiLieu] },
    { title: 'Section 0 — Course framework from the FLM syllabus|||Mục 0 — Khung môn học theo syllabus FLM',
      description: 'Khung chuẩn 100% theo syllabus FLM 12224: hồ sơ môn, 5 đầu điểm (15+10+30+15+30 = 100%), 7 CLO, 4 giáo trình & 2 công cụ, kế hoạch đủ 60 buổi, nhiệm vụ sinh viên.',
      lessons: [l01, l02, l03, l04, l05, l06, q0] },
    { title: 'Chapter 1 — Why program? Variables & expressions (sessions 1–9)|||Chương 1 — Vì sao lập trình? Biến & biểu thức (buổi 1–9)',
      description: 'ĐẦY ĐỦ. PY4E chương 1 và 2 cộng Lab 1: phần cứng, thông dịch vs biên dịch, sáu khối xây dựng, ba loại lỗi, kiểu & biến, toán tử, ưu tiên, modulo, chuỗi, input(), chú thích.',
      lessons: [l11, l12, l13, l14, l15, l16, l17, c1q] },
    { title: 'Chapter 2 — Conditionals & loops (sessions 10–13)|||Chương 2 — Rẽ nhánh & vòng lặp (buổi 10–13)',
      description: 'KHUNG. PY4E chương 3 và 4: boolean, if/elif/else, try/except, short-circuit, while, lặp vô hạn, break/continue, for và năm mẫu vòng lặp.',
      lessons: [k21, k22, k23, k24, c2q] },
    { title: 'Chapter 3 — Functions (sessions 14–19)|||Chương 3 — Hàm (buổi 14–19)',
      description: 'KHUNG. PY4E chương 5 cộng Lab 2: lời gọi hàm, hàm dựng sẵn, ép kiểu, math & random, def, tham số vs đối số, luồng thực thi, fruitful vs void.',
      lessons: [k31, k32, k33, k34, k35, c3q] },
    { title: 'Chapter 4 — Progress Test 1 (session 20)|||Chương 4 — Progress Test 1 (buổi 20)',
      description: 'KHUNG. Bài kiểm tra tiến độ đầu tiên: 30 phút, 20 câu trắc nghiệm máy chấm, phạm vi buổi 1–19 (LO1–LO3 theo bảng kế hoạch).',
      lessons: [k41, c4q] },
    { title: 'Chapter 5 — Strings (sessions 21–24)|||Chương 5 — Chuỗi (buổi 21–24)',
      description: 'KHUNG. PY4E chương 6: chuỗi là một dãy, len, duyệt, cắt lát, bất biến, toán tử in, so sánh, method, phân tích chuỗi và định dạng.',
      lessons: [k51, k52, k53, k54, c5q] },
    { title: 'Chapter 6 — Files (sessions 25–28)|||Chương 6 — Tệp (buổi 25–28)',
      description: 'KHUNG. PY4E chương 7 cộng Lab 3: tính bền vững, open, dòng và ký tự xuống dòng, đọc, tìm kiếm, try/except/open, ghi tệp và with.',
      lessons: [k61, k62, k63, c6q] },
    { title: 'Chapter 7 — Lists, dictionaries, tuples (sessions 29–40)|||Chương 7 — List, dictionary, tuple (buổi 29–40)',
      description: 'KHUNG. PY4E chương 8, 9, 10 cộng Lab 4: list thay đổi được, method, aliasing, dictionary làm bộ đếm, phân tích văn bản, tuple bất biến, unpacking, items().',
      lessons: [k71, k72, k73, k74, k75, k76, k77, k78, k79, k710, k711, c7q] },
    { title: 'Chapter 8 — Object-oriented programming (sessions 41–54)|||Chương 8 — Lập trình hướng đối tượng (buổi 41–54)',
      description: 'KHUNG. PY4E chương 14: class & object, self, đóng gói, trừu tượng hoá, kế thừa, đa hình, dùng đối tượng, vòng đời, OOP nâng cao, case study, tổng kết.',
      lessons: [k81, k82, k83, k84, k85, k86, k87, k88, k89, k810, k811, c8q] },
    { title: 'Chapter 9 — The Assignment (sessions 47–48, 57–58)|||Chương 9 — Assignment (buổi 47–48, 57–58)',
      description: 'KHUNG. Assignment là 15% điểm môn và trải 28 buổi: hai buổi hướng dẫn (47–48) và hai buổi chữa (57–58), phủ CLO1–CLO7.',
      lessons: [k91, k92, c9q] },
    { title: 'Chapter 10 — Progress Test 2, Lab 5 & final review (sessions 51, 55–56, 59–60)|||Chương 10 — Progress Test 2, Lab 5 & ôn thi (buổi 51, 55–56, 59–60)',
      description: 'KHUNG. Progress Test 2 (buổi 51), Lab 5 về OOP (buổi 55–56), ôn tập cuối kỳ (buổi 59–60) và chiến thuật cho đề 50 câu trong 60 phút.',
      lessons: [k101, k102, k103, c10q, c11q] },
  ],
};
