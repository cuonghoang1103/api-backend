/**
 * Chương 7 — Làm việc với các vai trò khác (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s07/; ./s07/_ma.mjs là tệp SINH (mã + output thật: Node 22.22.2, Google Chrome 150 headless qua CDP)
 * bởi scratchpad/agt/lab/ch7/tao-ma.mjs (chạy lại tất cả: lab/ch7/chay-het.sh). Slug + title 4 bài cũ GIỮ NGUYÊN theo khung
 * (agl-7-1 … agl-7-4); thêm agl-7-5-lab, agl-7-6-quiz (đã thêm vào khung).
 */
import { Q } from './_chung.mjs';
import B1 from './s07/b1-tester.mjs';
import B2 from './s07/b2-ba-po.mjs';
import B3 from './s07/b3-designer.mjs';
import B4 from './s07/b4-khach-hang.mjs';
import B5 from './s07/b5-lab.mjs';

const QUIZ7 = [
  Q('agl7-1', 'C1 marked LF-B12 "cannot reproduce" after it worked on their laptop. What did the replay show?|||C1 đánh LF-B12 "không tái hiện" sau khi thử trên laptop thấy chạy. Lần chạy lại cho thấy gì?', [
    'The tester made a mistake|||Tester nhầm',
    'The bug appears only with the environment in the report: the server runs TZ=UTC, so getHours() of 07:00+07:00 is 0|||Bug chỉ xuất hiện với môi trường ghi trong report: máy chủ chạy TZ=UTC nên getHours() của 07:00+07:00 là 0',
    'The bug was in the browser|||Bug nằm ở trình duyệt',
    'The data on staging was corrupted|||Dữ liệu trên staging bị hỏng',
  ], 1, '"Works on my machine" is the start of an investigation. Lesson 7.1.|||"Máy em chạy được" là điểm bắt đầu điều tra. Bài 7.1.'),
  Q('agl7-2', 'Before the demo, the university’s name is misspelled on the login page. Severity and priority?|||Trước buổi demo, tên trường bị viết sai ở trang đăng nhập. Severity và priority?', [
    'High severity, high priority|||Severity cao, priority cao',
    'Low severity, low priority|||Severity thấp, priority thấp',
    'Low severity, high priority|||Severity thấp, priority cao',
    'High severity, low priority|||Severity cao, priority thấp',
  ], 2, 'Severity is impact (tester); priority is when to fix (product owner). Lesson 7.1.|||Severity là tác động (tester); priority là khi nào sửa (PO). Bài 7.1.'),
  Q('agl7-3', 'In vong-doi.mjs, what distinguished bugs that bounced more?|||Trong vong-doi.mjs, điều gì phân biệt những bug nảy qua lại nhiều hơn?', [
    'Who fixed them|||Ai là người sửa',
    'Reports missing steps or environment: 1.1 rounds vs 0.4, and all "cannot reproduce" cases|||Report thiếu bước hoặc môi trường: 1,1 vòng so với 0,4, và mọi ca "không tái hiện"',
    'Critical severity|||Mức độ Critical',
    'The day of the week|||Ngày trong tuần',
  ], 1, 'A small sample — use it as a retro topic and a field in the template. Lesson 7.1.|||Mẫu nhỏ — dùng làm chủ đề retro và một trường trong mẫu report. Bài 7.1.'),
  Q('agl7-4', 'Which question is most likely to be answered by the supervisor in one line?|||Câu hỏi nào dễ được giảng viên trả lời bằng một dòng nhất?', [
    '"How should one week be calculated?"|||"Một tuần tính thế nào ạ?"',
    '"Can you explain the booking rules in more detail?"|||"Thầy giải thích kỹ hơn quy tắc đặt lịch được không ạ?"',
    '"Q-04: A: 7 calendar days, all of day 7 allowed; B: 168 hours; C: 5 working days. We propose A; default A if no answer by 03/03; blocks S22."|||"Q-04: A: 7 ngày lịch, cả ngày thứ 7 được; B: 168 giờ; C: 5 ngày làm việc. Nhóm đề xuất A; mặc định A nếu tới 03/03 chưa trả lời; đang chặn S22."',
    '"Is everything OK with our requirements?"|||"Yêu cầu của nhóm em ổn chưa ạ?"',
  ], 2, 'Options, a proposal, a deadline, what it blocks. Lesson 7.2.|||Phương án, đề xuất, hạn, việc bị chặn. Bài 7.2.'),
  Q('agl7-5', 'Rule v1 passed 5 of 6 agreed examples. Which example failed, and why?|||Quy tắc v1 qua 5/6 ví dụ đã thống nhất. Ví dụ nào trượt, vì sao?', [
    'Booking in the past — v1 allowed it|||Đặt vào quá khứ — v1 cho phép',
    'Day 7 in the afternoon — v1 counted 7 × 24 hours, the supervisor meant the whole of day 7|||Ngày thứ 7 buổi chiều — v1 tính 7 × 24 giờ, giảng viên muốn cả ngày thứ 7',
    'Same-day booking|||Đặt trong ngày',
    'Day 8 — v1 allowed it|||Ngày thứ 8 — v1 cho phép',
  ], 1, 'The tester’s boundary example exposed two readings of "one week". Lesson 7.2.|||Ví dụ biên của tester lộ ra hai cách hiểu "một tuần". Bài 7.2.'),
  Q('agl7-6', '"Students can view the attached guide through a link", built literally with sequential IDs. What happened?|||"Sinh viên xem được tài liệu đính kèm qua đường dẫn", làm đúng chữ với mã số tăng dần. Chuyện gì xảy ra?', [
    'Nothing — the requirement was met|||Không gì — yêu cầu đã đạt',
    'Any student, and even a request without a token, could read everyone’s documents by changing the number|||Mọi sinh viên, thậm chí request không có token, đọc được tài liệu của mọi người bằng cách đổi số',
    'The server crashed|||Máy chủ sập',
    'Only lecturers could read documents|||Chỉ giảng viên đọc được tài liệu',
  ], 1, 'Ask "who must NOT" — First American 2019. Lesson 7.2.|||Hỏi "ai KHÔNG được" — First American 2019. Bài 7.2.'),
  Q('agl7-7', 'Grey hint text #9ca3af on white measured 2.54:1. Why is that a bug and not a matter of taste?|||Chữ gợi ý xám #9ca3af trên nền trắng đo được 2,54:1. Vì sao đó là bug chứ không phải chuyện gu?', [
    'Because the designer said so|||Vì designer nói vậy',
    'WCAG AA requires 4.5:1 for normal text; accessibility has legal weight (Robles v. Domino’s, 2019)|||WCAG AA yêu cầu 4,5:1 cho chữ thường; khả năng tiếp cận có sức nặng pháp lý (Robles v. Domino’s, 2019)',
    'Because grey is not in the brand|||Vì màu xám không thuộc thương hiệu',
    'Because Chrome shows it differently|||Vì Chrome hiển thị khác',
  ], 1, 'Contrast is not negotiable away; a custom date picker is. Lesson 7.3.|||Tương phản không được thương lượng bỏ; bộ chọn ngày tự vẽ thì được. Bài 7.3.'),
  Q('agl7-8', 'The custom date picker in Figma would cost about two days. The best move?|||Bộ chọn ngày tự vẽ trong Figma tốn khoảng hai ngày. Cách làm tốt nhất?', [
    'Build it silently and slip the sprint|||Âm thầm làm và để sprint trễ',
    'Replace it silently with the browser’s input|||Âm thầm thay bằng ô nhập của trình duyệt',
    'Give the designer the cost, two options and a proposal with a deadline; record the decision as an approved deviation|||Báo designer chi phí, hai phương án và một đề xuất kèm hạn; ghi quyết định thành lệch đã duyệt',
    'Ask the supervisor to remove the screen|||Xin giảng viên bỏ màn đó',
  ], 2, 'QĐ-07 — the script then shows it as "≈", not as an error. Lesson 7.3.|||QĐ-07 — sau đó script hiện nó là "≈", không phải lỗi. Bài 7.3.'),
  Q('agl7-9', 'The supervisor asks whether iteration 3 will be ready by 16/04. With the team’s real throughput, what is the best answer?|||Giảng viên hỏi iteration 3 có kịp 16/04 không. Với thông lượng thật của nhóm, trả lời nào tốt nhất?', [
    '"Certainly, 100 % on time."|||"Chắc chắn xong 100 % đúng hạn ạ."',
    '"We don’t know."|||"Nhóm em không biết ạ."',
    '"About 68 % for all 14 screens, 85 % for 12; which two should be ‘if time allows’? We update every Friday."|||"Khoảng 68 % cho đủ 14 màn, 85 % cho 12 màn; thầy chọn hai màn nào là ‘nếu kịp’? Mỗi thứ Sáu nhóm cập nhật."',
    '"14 April."|||"Ngày 14/04 ạ."',
  ], 2, 'A single date is the 50 % line at best. Lesson 7.4.|||Một ngày duy nhất cùng lắm là mốc 50 %. Bài 7.4.'),
  Q('agl7-10', 'The first kiem-vai.sh printed "ĐẠT" although LF-B13 was incomplete. Why?|||Bản đầu kiem-vai.sh in "ĐẠT" dù LF-B13 thiếu trường. Vì sao?', [
    'tai-hien.mjs did not detect it|||tai-hien.mjs không phát hiện',
    'The check was piped into sed, and without pipefail a pipeline’s exit code is that of its last command|||Bước kiểm được đưa qua ống vào sed, và không có pipefail thì mã thoát của ống là mã của lệnh cuối',
    'Bash ignores exit code 2|||Bash bỏ qua mã thoát 2',
    'The JSON was invalid|||JSON không hợp lệ',
  ], 1, 'Always test that a guard can fail. Lesson 7.5.|||Luôn thử xem rào chắn có báo hỏng được không. Bài 7.5.'),
];

export default {
  title: 'Chapter 7 — Working with other roles|||Chương 7 — Làm việc với các vai trò khác',
  description: 'Lập trình viên làm việc với tester, BA/PO, designer và khách — chạy thật trên LabFlow: report lỗi JSON chạy lại trên đúng phiên bản + múi giờ ("máy em chạy được" vs staging UTC), thống kê bóng bàn bug, test chéo khi nhóm không có tester (Post Office Horizon 2019); soát chữ không kiểm được trong yêu cầu, câu hỏi đóng, ba bên + bảng ví dụ chạy được (v1 5/6 → v2 6/6), "ai KHÔNG được" (First American 2019, Mars Climate Orbiter 1999); so màn thật với spec designer trong Chrome headless (13 lệch → 0, tương phản WCAG, Robles v. Domino’s 2019); thư gửi giảng viên không thuật ngữ, dự báo Monte Carlo 68 %/85 % (TSB 2018); lab mốc dự án: bộ bốn vai + kiem-vai.sh.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'agl-7-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: "máy em chạy được" và múi giờ, severity/priority, report thiếu môi trường, câu hỏi đóng, ví dụ biên "một tuần", "ai KHÔNG được", tương phản WCAG, thương lượng thiết kế, dự báo có xác suất, pipefail.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the real runs of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các lần chạy thật trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ7 },
    },
  ],
};
