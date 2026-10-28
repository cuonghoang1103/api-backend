/**
 * Kỹ năng nghề · 🎤 4.2 — Slide & biểu đồ: chọn biểu đồ đúng, soi lỗi slide, một ý mỗi slide, số có nguồn, code đọc được.
 */
import { moDun, tracNghiem, phanLoai, TN } from './_chung.mjs';

const C1 = tracNghiem({
  tieuDe: 'Slides 1 — Choose the right chart (or a table) for the result',
  doKho: 'EASY', phut: 7,
  moTa: {
    en: '<p>The chart type follows the <b>question the slide answers</b>: comparison between categories → bar; change over time → line; part of a whole with 2–3 parts → a 100% bar (or a pie at most); a few exact numbers people will quote → a small table. When in doubt, a sorted bar chart with labelled values beats anything 3D. Choose the best visual for each result.</p>',
    vi: '<p>Loại biểu đồ đi theo <b>câu hỏi mà slide trả lời</b>: so sánh giữa các nhóm → cột; thay đổi theo thời gian → đường; phần của tổng thể với 2–3 phần → cột 100% (tối đa là tròn); vài con số chính xác người nghe sẽ trích → bảng nhỏ. Phân vân thì cột đã sắp xếp có ghi giá trị luôn hơn mọi thứ 3D. Chọn hình phù hợp nhất cho từng kết quả.</p>',
  },
  cau: [
    { en: 'Pass/fail of the 22 integration cases in Round 1, 2 and 3.', vi: 'Pass/fail của 22 ca tích hợp ở Round 1, 2, 3.', lc: [['a', 'Stacked bar per round (pass + fail = 22), values labelled'], ['b', 'Three pie charts side by side'], ['c', '3D cylinder chart'], ['d', 'Line chart of the case IDs']], dap: 'a', giai: ['Comparing the same total across rounds: stacked bars of equal height make “nothing changed” obvious.', 'So cùng một tổng qua các round: cột chồng cao bằng nhau cho thấy ngay "không đổi".'] },
    { en: 'Case types of the 113 unit tests: Normal 22 · Abnormal 68 · Boundary 23.', vi: 'Loại ca của 113 unit test: Normal 22 · Abnormal 68 · Boundary 23.', lc: [['a', 'One horizontal 100% bar (or a 3-row table with counts and %)'], ['b', 'Line chart'], ['c', 'Scatter plot'], ['d', 'A word cloud']], dap: 'a', giai: ['Three parts of one whole. The table version is also fine if you want people to quote 60.2%.', 'Ba phần của một tổng. Dạng bảng cũng được nếu muốn người nghe trích con số 60,2%.'] },
    { en: 'Daily count of open defects over a 3-week sprint.', vi: 'Số lỗi còn mở mỗi ngày trong sprint 3 tuần.', lc: [['a', 'Line chart over days'], ['b', 'Pie chart'], ['c', 'One big number'], ['d', 'Bulleted list of defect titles']], dap: 'a', giai: ['Change over time → line (it is a burn-down).', 'Thay đổi theo thời gian → đường (một dạng burn-down).'] },
    { en: 'Line and branch coverage for 2 classes (AuthFilter 100%/100%, UserDAO 98.4%/83%).', vi: 'Độ phủ dòng và nhánh của 2 lớp (AuthFilter 100%/100%, UserDAO 98,4%/83%).', lc: [['a', 'A 2×2 table with the four percentages, the 83% highlighted'], ['b', 'A radar chart'], ['c', 'Four pie charts'], ['d', 'A screenshot of the full JaCoCo page at small size']], dap: 'a', giai: ['Four exact numbers: a table, with the one number you will talk about highlighted.', 'Bốn con số chính xác: bảng, tô nổi con số bạn sẽ nói tới.'] },
    { en: 'Defects found per module (A 15, B 7, C 4, D 9, E 3).', vi: 'Số lỗi theo module (A 15, B 7, C 4, D 9, E 3).', lc: [['a', 'Bar chart sorted from most to fewest, values labelled'], ['b', 'Bar chart in alphabetical order with no labels'], ['c', 'Line chart A→E'], ['d', 'Donut chart with a legend']], dap: 'a', giai: ['Categories with no natural order → sort by value; a line would suggest a trend that does not exist.', 'Các nhóm không có thứ tự tự nhiên → sắp theo giá trị; đường sẽ gợi một xu hướng không có thật.'] },
  ],
  goiY: ['Hỏi trước: slide trả lời câu hỏi gì — so sánh, xu hướng, tỉ lệ hay vài con số chính xác?', 'Vài con số người nghe sẽ trích lại ⇒ bảng nhỏ là đủ.'],
  loiHayGap: ['Dùng biểu đồ tròn cho dữ liệu theo thời gian.', 'Biểu đồ 3D làm sai cảm nhận độ lớn.', 'Không ghi giá trị trên cột ⇒ người nghe phải đoán.'],
  thuatNgu: [{ en: 'stacked bar chart', vi: 'biểu đồ cột chồng' }, { en: 'line chart', vi: 'biểu đồ đường' }, { en: 'data label', vi: 'nhãn giá trị ghi trên cột/điểm' }],
  khaiNiem: ['chart choice', 'data visualisation'],
});

const C2 = tracNghiem({
  tieuDe: 'Slides 2 — Spot every problem on these slides',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: '<p>Each question describes a real-looking slide. Tick <b>every</b> problem it has (several answers per question). Typical problems: a wall of text read aloud, numbers without a source, a screenshot nobody can read, code at a size nobody can read, more than one message, a topic-label headline.</p>',
    vi: '<p>Mỗi câu mô tả một slide trông như thật. Tích <b>mọi</b> lỗi của nó (nhiều đáp án mỗi câu). Lỗi điển hình: mảng chữ dày đọc nguyên văn, số không nguồn, ảnh chụp không ai đọc nổi, code cỡ chữ không ai đọc nổi, nhiều hơn một thông điệp, tiêu đề chỉ là tên chủ đề.</p>',
  },
  cau: [
    { en: 'Title “Unit Test”. Body: 14 bullet lines, font 14 pt, copied from the report; the speaker reads them.', vi: 'Tiêu đề "Unit Test". Thân: 14 dòng gạch đầu dòng, cỡ 14, chép từ báo cáo; người nói đọc nguyên văn.', nhieu: true, lc: [['a', 'Topic-label headline'], ['b', 'Wall of text read aloud'], ['c', 'Font too small for a projector'], ['d', 'Uses a chart']], dap: ['a', 'b', 'c'], giai: ['Rule of thumb: ≤ 6 short lines, ≥ 24 pt, and you SAY more than the slide shows.', 'Quy tắc: ≤ 6 dòng ngắn, ≥ 24 pt, và bạn NÓI nhiều hơn slide ghi.'] },
    { en: 'Title “Coverage is 99%”. Body: full-page JaCoCo screenshot, no highlight, no date, no project name.', vi: 'Tiêu đề "Coverage is 99%". Thân: ảnh JaCoCo cả trang, không khoanh, không ngày, không tên dự án.', nhieu: true, lc: [['a', 'Screenshot unreadable and not highlighted'], ['b', 'Number without a source (which run? which classes?)'], ['c', 'Headline states a conclusion'], ['d', '99% is ambiguous: lines or branches?']], dap: ['a', 'b', 'd'], giai: ['Crop to the 2–3 rows that matter, circle the number, write “JaCoCo, module A, run 28/10” under it, say “line coverage”.', 'Cắt còn 2–3 dòng cần nói, khoanh con số, ghi "JaCoCo, module A, chạy 28/10" bên dưới, nói rõ "độ phủ dòng".'] },
    { en: 'Title “Bug SS-28”. Body: 60 lines of UpdateProfileServlet.java in 10 pt, no line highlighted.', vi: 'Tiêu đề "Bug SS-28". Thân: 60 dòng UpdateProfileServlet.java cỡ 10, không tô dòng nào.', nhieu: true, lc: [['a', 'Code unreadable from the back row'], ['b', 'Nothing tells the eye where to look (line 77)'], ['c', 'Headline does not say what the bug does'], ['d', 'Shows source code at all is forbidden']], dap: ['a', 'b', 'c'], giai: ['Code on slides is fine: 5–10 lines, ≥ 20 pt, the guilty line highlighted, file:line in the caption.', 'Code trên slide được: 5–10 dòng, ≥ 20 pt, tô dòng gây lỗi, chú thích tệp:dòng.'] },
    { en: 'Title “Results and Lessons and Next steps”. Body: a table of 3 rounds, a list of 6 bugs and 4 lessons.', vi: 'Tiêu đề "Results and Lessons and Next steps". Thân: bảng 3 round, danh sách 6 lỗi và 4 bài học.', nhieu: true, lc: [['a', 'More than one message on one slide'], ['b', 'Topic-label headline'], ['c', 'Too much to read while listening'], ['d', 'Missing a logo']], dap: ['a', 'b', 'c'], giai: ['Split into three slides, each with an assertion headline. A logo is decoration, not a problem.', 'Tách thành ba slide, mỗi slide một tiêu đề khẳng định. Logo là trang trí, không phải lỗi.'] },
  ],
  goiY: ['Mỗi câu có nhiều lỗi — tích hết mới đúng.', 'Bẫy: "có code trên slide" không phải lỗi; code khó đọc mới là lỗi.'],
  loiHayGap: ['Chỉ tích lỗi rõ nhất, bỏ sót lỗi "số không nguồn".', 'Cho rằng không được đưa code lên slide.'],
  thuatNgu: [TN.headline, { en: 'callout / highlight', vi: 'khoanh/tô nổi chỗ cần nhìn' }, { en: 'caption', vi: 'chú thích dưới hình (nguồn, ngày)' }],
  khaiNiem: ['slide design', 'readability'],
});

const C3 = phanLoai({
  tieuDe: 'Slides 3 — One message per slide: pick the headline for each body',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>The SportShop deck has six slides with their bodies finished and headlines missing. Give each slide the assertion headline that its body actually proves. A headline that the body does not prove is worse than no headline — the teacher will ask for the evidence.</p>',
    vi: '<p>Bộ slide SportShop có sáu slide đã xong thân, thiếu tiêu đề. Gán cho mỗi slide tiêu đề khẳng định mà thân slide thật sự chứng minh. Tiêu đề không được thân slide chứng minh còn tệ hơn không có — cô sẽ hỏi bằng chứng.</p>',
  },
  cotCau: 'Slide body',
  cot: 'Headline',
  luaChon: [
    'Module A = 9 classes I own end-to-end',
    '113 unit tests, no database: Mockito fakes every dependency',
    '93/113 unit tests pass — the 20 fails point at real defects',
    'Integration on the real API + test database: 16/22, same in 3 rounds',
    'SS-28: any user can change another account’s password',
    'Fix order: SS-28 → SS-23 → SS-19',
  ],
  hang: [
    ['List: Login, Register, Logout, Forgot, ChangePassword, Profile, UpdateProfile, AuthFilter, UserDAO.', 'Module A = 9 classes I own end-to-end'],
    ['Code: when(req.getParameter("username")).thenReturn("john_doe"); mockConstruction(UserDAO.class) …', '113 unit tests, no database: Mockito fakes every dependency'],
    ['Bar: Pass 93 · Fail 20 (82.3%); list of the tickets linked to the fails.', '93/113 unit tests pass — the 20 fails point at real defects'],
    ['Stacked bars R1/R2/R3, each 16 + 6; Newman report.html thumbnail.', 'Integration on the real API + test database: 16/22, same in 3 rounds'],
    ['Two DB rows before/after IT17: user A edits the read-only username field to B’s name; B’s password changes.', 'SS-28: any user can change another account’s password'],
    ['Table: ticket · user impact · effort — SS-28 account takeover, SS-23 passwords readable in the DB, SS-19 guests get HTTP 500.', 'Fix order: SS-28 → SS-23 → SS-19'],
  ],
  giaiBang: ['Each body proves exactly one sentence. If two headlines seem to fit, the body is carrying two messages — split it.', 'Mỗi thân slide chứng minh đúng một câu. Thấy hai tiêu đề cùng hợp ⇒ thân đang mang hai thông điệp — tách ra.'],
  goiY: ['Đọc thân slide trước, rồi hỏi: "slide này chứng minh câu nào?"', 'Bảng ưu tiên lỗi ⇒ tiêu đề nói thứ tự sửa.'],
  loiHayGap: ['Gán tiêu đề hay nhất cho slide đẹp nhất, không theo bằng chứng.', 'Nhầm slide "Mockito" với slide kết quả unit test.'],
  giaiThich: '<p>Rows map to the headlines in the order listed.</p>',
  thuatNgu: [TN.headline, TN.evidence],
  khaiNiem: ['one message per slide'],
});

const C4 = tracNghiem({
  tieuDe: 'Slides 4 — Numbers with a source, code people can read',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>Teachers and reviewers trust a number when they can see <b>where it came from</b> (tool, run, date) and they understand code when they can see <b>which line matters</b>. Choose the better practice in each case — these are the questions a committee asks when a number looks too good.</p>',
    vi: '<p>Thầy cô và người review tin một con số khi thấy <b>nó đến từ đâu</b> (công cụ, lần chạy, ngày), và hiểu code khi thấy <b>dòng nào quan trọng</b>. Chọn cách làm tốt hơn trong mỗi trường hợp — đây là những câu hội đồng hỏi khi một con số trông quá đẹp.</p>',
  },
  cau: [
    { en: 'How do you show “82.3% of unit tests pass”?', vi: 'Thể hiện "82,3% unit test đạt" thế nào?', lc: [['a', '“82.3%” in huge font, nothing else'], ['b', '“93 / 113 = 82.3% — JUnit run 28/10, Report 5.1 › Test Report”'], ['c', '“Most tests pass”'], ['d', '“About 80%”']], dap: 'b', giai: ['Raw counts + the ratio + the source. The teacher can open Report 5.1 and find the same 93 and 113.', 'Số đếm gốc + tỉ lệ + nguồn. Cô mở Report 5.1 là thấy đúng 93 và 113.'] },
    { en: 'A number on your slide does not match the Excel report.', vi: 'Một con số trên slide lệch với báo cáo Excel.', lc: [['a', 'Leave it, nobody will check'], ['b', 'Fix the slide before the talk; the report is the source of truth'], ['c', 'Round it so the difference disappears'], ['d', 'Remove all numbers from the deck']], dap: 'b', giai: ['One mismatched number makes every other number suspect.', 'Một con số lệch khiến mọi con số khác bị nghi.'] },
    { en: 'You need to show the cause of SS-19 (AuthFilter.java line 45).', vi: 'Cần chỉ nguyên nhân SS-19 (AuthFilter.java dòng 45).', lc: [['a', 'Show 6–8 lines around line 45, ≥ 20 pt, line 45 highlighted, caption “AuthFilter.java:45”'], ['b', 'Show the whole file'], ['c', 'Describe it in words only'], ['d', 'Show a photo of your monitor']], dap: 'a', giai: ['Small window, big font, one highlight, file:line caption — the teacher can open the same line during Q&A.', 'Cửa sổ nhỏ, chữ to, tô một dòng, chú thích tệp:dòng — cô mở đúng dòng đó khi hỏi đáp.'] },
    { en: 'Where should exact numbers you will be asked about live?', vi: 'Các con số chính xác sẽ bị hỏi nên nằm ở đâu?', lc: [['a', 'Only in your memory'], ['b', 'On the slide AND in a backup slide/table you can jump to in Q&A'], ['c', 'Only in the report, which you will not open'], ['d', 'In the speaker notes only']], dap: 'b', giai: ['Backup (appendix) slides let you answer “show me” questions in seconds.', 'Slide dự phòng (phụ lục) giúp trả lời câu "cho cô xem" trong vài giây.'] },
    { en: 'Which caption is best under a screenshot of Lab 4 evidence?', vi: 'Chú thích nào tốt nhất dưới ảnh bằng chứng Lab 4?', lc: [['a', '“Screenshot”'], ['b', '“RL02 step 1, Round 1 — guest opens /dashboard → HTTP 500 (SS-19)”'], ['c', '“Image 3”'], ['d', 'No caption']], dap: 'b', giai: ['Case, step, round, what you see, ticket — the same naming as the file RL02_S1_R1.jpg.', 'Ca, bước, round, thấy gì, mã lỗi — cùng cách đặt tên với tệp RL02_S1_R1.jpg.'] },
  ],
  goiY: ['Số đáng tin = số đếm gốc + tỉ lệ + nguồn.', 'Code trên slide: ít dòng, chữ to, tô một dòng, ghi tệp:dòng.'],
  loiHayGap: ['Làm tròn số cho đẹp ("khoảng 80%") — mất khả năng đối chiếu.', 'Không có slide dự phòng, bị hỏi chi tiết phải mở Excel lục tìm trước cả lớp.'],
  thuatNgu: [TN.evidence, { en: 'backup slide / appendix', vi: 'slide dự phòng / phụ lục — mở khi bị hỏi' }, { en: 'source of truth', vi: 'nguồn sự thật — nơi con số gốc nằm' }],
  khaiNiem: ['data credibility', 'code on slides'],
});

export default moDun({
  slug: 'ssg105-4-2-slides-charts',
  ten: '4.2 Slides and charts: right chart, one message, sourced numbers',
  moTaModule: 'Chọn biểu đồ/bảng theo câu hỏi của slide, soi mọi lỗi của slide (chữ dày, số không nguồn, ảnh/code không đọc nổi, nhiều thông điệp), gán tiêu đề khẳng định cho thân slide SportShop, số có nguồn và code đọc được.',
  baiHoc: 'ssg105-4-1-presentation',
  de: [C1, C2, C3, C4],
});
