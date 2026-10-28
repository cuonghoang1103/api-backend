/**
 * Kỹ năng nghề · 🎤 4.3 — Bài nhóm & bằng chứng: chia giờ, ngân sách từ, "câu cô hay hỏi ↔ mở bằng chứng nào", kịch bản demo.
 * Tệp/đường dẫn thật: ~/Documents/SWT301-SportShop/bao-cao (ON-TAP-REVIEW.md mục 7–8).
 */
import { moDun, bangDe, phanLoai, sapXep, tracNghiem, giai, hai, TN } from './_chung.mjs';

const PHUT = ['0.5', '1', '1.5', '2', '2.5', '3'];
const TU = ['65', '130', '195', '260', '390', '520'];
const T1 = bangDe({
  tieuDe: 'Team 1 — Time-box a 15-minute team presentation',
  doKho: 'MEDIUM', phut: 10,
  moTa: {
    en: `<p>Your team of <b>5</b> has a <b>15-minute</b> slot (SWT301 Lab 2+3, one module per member). The team agreed these rules:</p>
<ul><li>Q&amp;A reserve = <b>20%</b> of the slot (teachers always ask; a talk that eats the Q&amp;A loses marks).</li>
<li>Opening (agenda + who owns which module) = 1 minute; closing summary = 1 minute.</li>
<li>One live demo on the leader’s laptop = 2 minutes.</li>
<li>Hand-over buffer for switching speakers and the projector = 0.5 minute in total.</li>
<li>The remaining time is split <b>equally</b> between the 5 module speakers.</li></ul>
<p>Fill the minutes per segment (table 1), then the word budget at a clear speaking pace of <b>130 words per minute</b> (table 2).</p>`,
    vi: `<p>Nhóm <b>5</b> người có <b>15 phút</b> (SWT301 Lab 2+3, mỗi người một module). Nhóm thống nhất: dành <b>20%</b> cho hỏi đáp; mở đầu 1 phút, tổng kết 1 phút; một demo trên máy trưởng nhóm 2 phút; tổng thời gian đổi người/đổi máy chiếu 0,5 phút; thời gian còn lại chia <b>đều</b> cho 5 người trình bày module. Điền số phút mỗi phần (bảng 1), rồi ngân sách số từ ở tốc độ nói rõ ràng <b>130 từ/phút</b> (bảng 2).</p>`,
  },
  bang: [
    {
      ma: 'b1', de: hai('Table 1 — minutes per segment', 'Bảng 1 — số phút mỗi phần'),
      cot: [{ ma: 's', ten: 'Segment' }, { ma: 'm', ten: 'Minutes', luaChon: PHUT }],
      hang: ['Q&A reserve', 'Opening', 'Live demo', 'Hand-over buffer (total)', 'Closing summary', 'EACH module speaker (A–E)'].map((s, i) => ({ ma: `r${i}`, o: { s } })),
      dapAn: { 'r0.m': '3', 'r1.m': '1', 'r2.m': '2', 'r3.m': '0.5', 'r4.m': '1', 'r5.m': '1.5' },
      giaiThich: giai('20% × 15 = 3. Fixed parts: 1 + 2 + 0.5 + 1 = 4.5. Left: 15 − 3 − 4.5 = 7.5 minutes ÷ 5 speakers = 1.5 minutes each.', '20% × 15 = 3. Phần cố định: 1 + 2 + 0,5 + 1 = 4,5. Còn: 15 − 3 − 4,5 = 7,5 phút ÷ 5 người = 1,5 phút mỗi người.'),
    },
    {
      ma: 'b2', de: hai('Table 2 — word budget at 130 words per minute', 'Bảng 2 — ngân sách từ ở 130 từ/phút'),
      cot: [{ ma: 's', ten: 'Part' }, { ma: 'w', ten: 'Max words', luaChon: TU }],
      hang: ['Opening (1 min)', 'EACH module speaker (1.5 min)', 'Your solo 3-minute talk (another class)', 'A 2-minute OJT update'].map((s, i) => ({ ma: `r${i}`, o: { s } })),
      dapAn: { 'r0.w': '130', 'r1.w': '195', 'r2.w': '390', 'r3.w': '260' },
      giaiThich: giai('words = minutes × 130. 1.5 × 130 = 195 — a typical first draft of “my module” is 400+ words, i.e. twice too long.', 'số từ = số phút × 130. 1,5 × 130 = 195 — bản nháp "module của em" đầu tiên thường 400+ từ, tức dài gấp đôi.'),
    },
  ],
  goiY: ['Tính phần hỏi đáp trước (20% của 15), rồi trừ các phần cố định, phần còn lại chia 5.', 'Số từ = số phút × 130.'],
  loiHayGap: ['Quên dành giờ hỏi đáp — chia hết 15 phút cho phần nói.', 'Quên thời gian đổi người/đổi máy — mỗi lần đổi mất 5–10 giây thật.', 'Viết phần của mình theo cảm giác rồi đọc nhanh cho kịp.'],
  giaiThich: { en: '<p>3 · 1 · 2 · 0.5 · 1 · 1.5 — then 130 · 195 · 390 · 260.</p>', vi: '<p>3 · 1 · 2 · 0,5 · 1 · 1,5 — rồi 130 · 195 · 390 · 260.</p>' },
  thuatNgu: [TN.timebox, TN.wpm, { en: 'hand-over', vi: 'chuyển lượt cho người nói sau' }],
  khaiNiem: ['time-boxing', 'team presentation'],
});

const BC = [
  'AuthFilterTest (failing case) + AuthFilter.java:45',
  'bao-cao/lab2/coverage-module-A.txt (JaCoCo per class)',
  'Report 5.1 › Test Report sheet',
  'bao-cao/lab3/postman/R2/report.html (Newman, round 2)',
  'bao-cao/lab3/postman/R1/db-queries.log (SELECT after IT17)',
  'bao-cao/lab4/R1/evidence/RL02_S1_R1.jpg',
  'Report 5.2 tester column + the note on ticket SS-18',
];
const T2 = phanLoai({
  tieuDe: 'Team 2 — Question from the teacher ↔ evidence you open',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: '<p>In a lab defence the teacher rarely asks “explain testing”; she asks <b>“show me”</b>. Answering means opening the right file within seconds. These are the owner’s real evidence files for SportShop module A. Match each likely question to the evidence you open first.</p>',
    vi: '<p>Khi bảo vệ lab, cô hiếm khi hỏi "giải thích kiểm thử là gì"; cô hỏi <b>"cho cô xem"</b>. Trả lời nghĩa là mở đúng tệp trong vài giây. Đây là các tệp bằng chứng thật của module A SportShop. Ghép mỗi câu hỏi với bằng chứng mở đầu tiên.</p>',
  },
  cotCau: 'Question',
  cot: 'Open first',
  luaChon: BC,
  hang: [
    ['“Show me one failing unit test and the code line that makes it fail.”', BC[0], '“Cho cô xem một unit test fail và dòng code làm nó fail.”'],
    ['“Why is UserDAO branch coverage only 83%?”', BC[1], '“Sao độ phủ nhánh của UserDAO chỉ 83%?”'],
    ['“How many unit test cases, how many pass?”', BC[2], '“Bao nhiêu ca unit test, bao nhiêu ca đạt?”'],
    ['“Did you really run round 2, or copy round 1?”', BC[3], '“Em có chạy round 2 thật không hay chép round 1?”'],
    ['“IT17 says another account’s password changed — prove it in the database.”', BC[4], '“IT17 nói mật khẩu tài khoản khác bị đổi — chứng minh trong CSDL.”'],
    ['“What does a guest actually see on /dashboard?”', BC[5], '“Khách chưa đăng nhập thực sự thấy gì ở /dashboard?”'],
    ['“The plan said another member runs round 2. Who actually ran it?”', BC[6], '“Kế hoạch ghi thành viên khác chạy round 2. Thực tế ai chạy?”'],
  ],
  giaiBang: ['Each question names an artefact: a test + a line, a coverage file, the statistics sheet, a dated round report, a DB log, a screenshot, the honest tester record.', 'Mỗi câu hỏi trỏ tới một sản phẩm: test + dòng, tệp độ phủ, sheet thống kê, báo cáo round có ngày, log CSDL, ảnh chụp, ghi chép trung thực về người chạy.'],
  goiY: ['"Chứng minh trong CSDL" ⇒ log câu SELECT, không phải ảnh giao diện.', '"Ai chạy" ⇒ trả lời đúng sự thật, chỉ vào cột tester và ghi chú trên thẻ.'],
  loiHayGap: ['Mở Excel rồi cuộn tìm trước cả lớp — chuẩn bị sẵn tab theo thứ tự câu hỏi.', 'Trả lời câu "ai chạy round 2" bằng tên người không chạy — vừa sai vừa mất điểm đạo đức.'],
  giaiThich: '<p>Rows map to the evidence list in order.</p>',
  thuatNgu: [TN.evidence, TN.qa, { en: 'round', vi: 'vòng chạy test (R1, R2, R3)' }],
  khaiNiem: ['evidence', 'lab defence'],
});

const T3 = sapXep({
  tieuDe: 'Team 3 — Order the demo and the pre-demo checklist',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p>A two-minute demo works when it tells <b>one story</b> and when the machine was checked before the room filled up. The SportShop story is “one bug, three levels”: the same defect SS-19 seen as a line of code, a failing unit test, a failing integration case and a system-test screenshot. Order the demo, then the checklist.</p>',
    vi: '<p>Demo hai phút chạy tốt khi kể <b>một câu chuyện</b> và máy đã được kiểm trước khi vào phòng. Chuyện SportShop là "một lỗi, ba cấp": cùng lỗi SS-19 thấy ở một dòng code, một unit test fail, một ca tích hợp fail và một ảnh test hệ thống. Sắp thứ tự demo, rồi danh sách kiểm trước demo.</p>',
  },
  cau: [
    {
      en: 'Demo: one bug (SS-19), three levels', vi: 'Demo: một lỗi (SS-19), ba cấp',
      dung: ['Open AuthFilter.java:45 — getRole() on a null account', 'Run AuthFilterTest — the guest case fails with NullPointerException', 'Show IT10 in Report 5.2 — real Tomcat + DB answer HTTP 500', 'Show RL02_S1_R1.jpg — what a guest really sees in Chrome', 'Say the takeaway: one null check, three levels caught it'],
      giai: ['Cause → unit → integration → system → takeaway: each step zooms out, so the audience follows the same bug from code to user.', 'Nguyên nhân → unit → tích hợp → hệ thống → câu chốt: mỗi bước lùi ra một tầng, người nghe theo cùng một lỗi từ code tới người dùng.'],
    },
    {
      en: 'Pre-demo checklist (the evening before / 15 minutes before)', vi: 'Kiểm trước demo (tối trước / 15 phút trước)',
      dung: ['Start Docker Desktop; check the sportshop-mssql container is running', 'Run the unit tests: expect 113 found, 93 pass, 20 fail', 'Reset the test database', 'Run one trial integration round: expect 16 pass, 6 fail', 'Open the files and tabs in demo order, font size up', 'Keep the recorded evidence (report.html, screenshots) one click away as plan B'],
      giai: ['Infrastructure → known-good numbers → clean data → integration → layout → backup. If any step shows different numbers, you find out tonight, not in front of the class.', 'Hạ tầng → con số đã biết → dữ liệu sạch → tích hợp → sắp cửa sổ → phương án dự phòng. Bước nào ra số khác thì biết ngay tối nay, không phải trước cả lớp.'],
    },
  ],
  goiY: ['Demo đi từ trong ra ngoài: dòng code → test đơn vị → API thật → màn hình người dùng.', 'Kiểm số đã biết (113/93/20, 22/16/6) trước khi demo — lệch là có chuyện.'],
  loiHayGap: ['Demo mỗi thứ một chút, không có câu chuyện chung.', 'Không reset CSDL test — round thử để lại dữ liệu bẩn, số lệch ngay trước lớp.', 'Không có phương án B khi Docker/Tomcat không lên.'],
  thuatNgu: [{ en: 'plan B / fallback', vi: 'phương án dự phòng khi demo sống hỏng' }, TN.evidence],
  khaiNiem: ['live demo', 'checklist'],
});

const T4 = tracNghiem({
  tieuDe: 'Team 4 — When the demo goes wrong',
  doKho: 'EASY', phut: 5,
  moTa: {
    en: '<p>Live demos fail in front of an audience more often than at home: the Wi-Fi is different, the projector changes the resolution, a container did not start. What the committee grades is how you <b>recover</b>. Choose the best reaction.</p>',
    vi: '<p>Demo sống hỏng trước khán giả nhiều hơn ở nhà: Wi-Fi khác, máy chiếu đổi độ phân giải, container không lên. Điều hội đồng chấm là cách bạn <b>xử lý</b>. Chọn phản ứng tốt nhất.</p>',
  },
  cau: [
    { en: 'Tomcat does not start in front of the class.', vi: 'Tomcat không chạy trước cả lớp.', lc: [['a', 'Debug it live for five minutes'], ['b', '“The live server is not cooperating — here is the same run recorded this morning” and open report.html'], ['c', 'Skip the demo without a word'], ['d', 'Blame the school network']], dap: 'b', giai: ['Name it in one sentence, switch to plan B, keep the clock.', 'Nói một câu, chuyển phương án B, giữ đồng hồ.'] },
    { en: 'The test result on screen differs from your slide (17 pass instead of 16).', vi: 'Kết quả trên màn hình khác slide (17 đạt thay vì 16).', lc: [['a', 'Pretend you did not see it'], ['b', 'Say what you see, give the likely reason (dirty test data) and that you will re-run on a clean database after class'], ['c', 'Change the slide on the spot'], ['d', 'Say the tool is broken']], dap: 'b', giai: ['Honest and specific: what differs, a hypothesis, a follow-up.', 'Trung thực và cụ thể: lệch gì, giả thuyết, việc sẽ làm.'] },
    { en: 'The projector makes your code unreadable.', vi: 'Máy chiếu làm code không đọc được.', lc: [['a', 'Zoom the editor (Ctrl/Cmd +) to ≥ 20 pt, or switch to the slide with the 6-line excerpt'], ['b', 'Ask everyone to come closer'], ['c', 'Read the code character by character'], ['d', 'Continue anyway']], dap: 'a', giai: ['Prepare both: a zoom shortcut and a slide copy of the key lines.', 'Chuẩn bị cả hai: phím phóng to và bản slide của mấy dòng chính.'] },
    { en: 'A teammate’s laptop (with their module) will not connect to the projector.', vi: 'Laptop của bạn cùng nhóm (có module của bạn ấy) không nối được máy chiếu.', lc: [['a', 'Their part is skipped'], ['b', 'Use the shared deck on the leader’s laptop — every member’s slides were merged into one file the night before'], ['c', 'Wait until it works'], ['d', 'Present their part yourself without telling anyone']], dap: 'b', giai: ['One merged deck on one machine removes the most common team-talk failure.', 'Một bộ slide gộp trên một máy loại bỏ lỗi phổ biến nhất của bài nhóm.'] },
  ],
  goiY: ['Mọi phương án tốt đều có: một câu nói thẳng + một phương án B đã chuẩn bị.', 'Không sửa lỗi sống trước lớp quá 30 giây.'],
  loiHayGap: ['Gỡ lỗi sống trước lớp tới hết giờ.', 'Đổ lỗi cho mạng/công cụ — nghe như không chuẩn bị.'],
  thuatNgu: [{ en: 'plan B / fallback', vi: 'phương án dự phòng' }, { en: 'recover', vi: 'xử lý, lấy lại nhịp sau sự cố' }],
  khaiNiem: ['demo recovery'],
});

export default moDun({
  slug: 'ssg105-4-3-team-talk-evidence',
  ten: '4.3 Team talk and evidence: time-box, “show me”, the demo',
  moTaModule: 'Chia giờ bài nhóm 15 phút (dành 20% hỏi đáp) và ngân sách số từ ở 130 từ/phút, ghép "câu cô hay hỏi" với tệp bằng chứng thật của SportShop, sắp demo "một lỗi – ba cấp" + danh sách kiểm trước demo, xử lý khi demo hỏng.',
  baiHoc: 'ssg105-4-1-presentation',
  de: [T1, T2, T3, T4],
});
