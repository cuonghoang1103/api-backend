/**
 * Chương 6 — Họp và giao tiếp (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s06/; ./s06/_ma.mjs là tệp SINH (mã + output thật: Node 22.22.2, git 2.55.0, Google Chrome 150 headless)
 * bởi scratchpad/agt/lab/ch6/tao-ma.mjs (chạy lại tất cả: lab/ch6/chay-het.sh). Slug + title 4 bài cũ GIỮ NGUYÊN theo khung
 * (agl-6-1 … agl-6-4); thêm agl-6-5-thanh-vien (thành viên trễ/im lặng/xung đột — Mục 0 đã hứa), agl-6-6-lab, agl-6-7-quiz (đã thêm vào khung).
 */
import { Q } from './_chung.mjs';
import B1 from './s06/b1-standup.mjs';
import B2 from './s06/b2-planning-retro.mjs';
import B3 from './s06/b3-bao-cao.mjs';
import B4 from './s06/b4-tu-xa.mjs';
import B5 from './s06/b5-thanh-vien.mjs';
import B6 from './s06/b6-lab.mjs';

const QUIZ6 = [
  Q('agl6-1', 'According to the 2020 Scrum Guide, what must a Daily Scrum produce?|||Theo Scrum Guide 2020, Daily Scrum phải tạo ra gì?', [
    'Answers to the three questions from every developer|||Câu trả lời ba câu hỏi của mọi developer',
    'A status report for the Scrum Master|||Một báo cáo trạng thái cho Scrum Master',
    'An actionable plan for the next day, focused on the Sprint Goal|||Một kế hoạch hành động được cho ngày kế tiếp, hướng về Sprint Goal',
    'An updated burndown chart|||Một biểu đồ burndown mới',
  ], 2, 'The three questions were removed in 2020; structure is the team’s choice. Lesson 6.1.|||Ba câu hỏi đã bị bỏ năm 2020; cấu trúc do đội chọn. Bài 6.1.'),
  Q('agl6-2', 'On 22/02 C4 wrote "carrying on with S30, not blocked". What did the data show?|||Ngày 22/02 C4 viết "làm tiếp S30, không vướng". Dữ liệu cho thấy gì?', [
    'Nothing unusual|||Không có gì bất thường',
    'The card had been marked blocked on the board since 18/02 and had no commit for 3 working days|||Thẻ đã bị đánh dấu chặn trên bảng từ 18/02 và 3 ngày làm việc không có commit',
    'C4 was absent|||C4 đang vắng',
    'The PR was waiting for review|||PR đang chờ review',
  ], 1, 'Words vs data — ask privately the same evening. Lesson 6.1.|||Lời nói và dữ liệu lệch nhau — hỏi riêng ngay tối đó. Bài 6.1.'),
  Q('agl6-3', 'The first version of standup.mjs flagged C2 as "4 working days without a commit" on 26/02. Why was that wrong?|||Bản đầu standup.mjs báo C2 "4 ngày làm việc không commit" ngày 26/02. Vì sao sai?', [
    'C2 committed under another name|||C2 commit dưới tên khác',
    'Weekends were counted|||Có tính cả cuối tuần',
    'C2 had announced two exam days; announced absences must be subtracted|||C2 đã báo hai ngày thi; ngày vắng đã báo phải được trừ',
    'Git was out of date|||Git chưa cập nhật',
  ], 2, 'Data without context accuses innocent people; never post the warning list. Lesson 6.1.|||Dữ liệu thiếu ngữ cảnh buộc tội người vô can; không bao giờ dán danh sách cảnh báo. Bài 6.1.'),
  Q('agl6-4', 'Capacity is 43.5 points; the team wants 59. What is the best planning outcome?|||Năng lực 43,5 điểm; nhóm muốn 59. Kết quả planning tốt nhất là gì?', [
    'Commit 59 and work weekends|||Cam kết 59 và làm cả cuối tuần',
    'Commit about 43, keep stretch items, and tell the supervisor the same night which screens move|||Cam kết khoảng 43, giữ mục dự phòng, và báo giảng viên ngay tối đó màn nào chuyển đi',
    'Commit 59 and report at the end if it fails|||Cam kết 59, cuối sprint hỏng thì báo',
    'Commit 30 to be safe without telling anyone|||Cam kết 30 cho chắc, không báo ai',
  ], 1, 'Promising more does not add points; it delays bad news until nobody can help. Lessons 6.2, 6.3.|||Hứa nhiều không tạo thêm điểm; nó chỉ dời tin xấu tới lúc không ai giúp được. Bài 6.2, 6.3.'),
  Q('agl6-5', 'Why can a commitment line cut by priority still be wrong for an SWP391 team?|||Vì sao đường cam kết cắt theo ưu tiên vẫn có thể sai với nhóm SWP391?', [
    'Priorities are always wrong|||Ưu tiên lúc nào cũng sai',
    'It can overload one member and leave another with almost no screens (LOC is graded per person)|||Nó có thể làm một người quá tải và người khác gần như không có màn (LOC chấm theo từng người)',
    'Story points cannot be added|||Story point không cộng được',
    'The supervisor sets priorities|||Giảng viên đặt ưu tiên',
  ], 1, 'can-bang.mjs: C2 +5.1 in exam week, C3 −6.1, C5’s only screen 5 points. Lesson 6.2.|||can-bang.mjs: C2 +5,1 trong tuần thi, C3 −6,1, màn duy nhất của C5 chỉ 5 điểm. Bài 6.2.'),
  Q('agl6-6', 'Which retro action is most likely to become a "zombie"?|||Hành động retro nào dễ thành "xác sống" nhất?', [
    '"CI blocks merge when tests fail — C1, 19/02, LF-61"|||"CI chặn merge khi test đỏ — C1, 19/02, LF-61"',
    '"Everyone try to review faster"|||"Mọi người cố gắng review nhanh hơn"',
    '"PR waiting > 1 working day: reviewer named at the daily — C1, 01/03, LF-63"|||"PR chờ quá 1 ngày làm việc: nêu tên người duyệt ở daily — C1, 01/03, LF-63"',
    '"Move the QR component to fe/src/chung, owner in CODEOWNERS — C3, 01/03, LF-64"|||"Chuyển component QR vào fe/src/chung, chủ ghi trong CODEOWNERS — C3, 01/03, LF-64"',
  ], 1, 'No owner, no date, no ticket, not measurable — it came back in the next retro. Lesson 6.2.|||Không chủ, không hạn, không ticket, không đo được — nó quay lại ở retro sau. Bài 6.2.'),
  Q('agl6-7', 'A good weekly report to the supervisor…|||Một báo cáo tuần tốt gửi giảng viên…', [
    'Is the first place the supervisor learns about a scope problem|||Là nơi đầu tiên giảng viên biết về vấn đề phạm vi',
    'Uses a colour computed by a written rule, puts bad news first, and records decisions already sent the same day|||Dùng màu được tính bằng luật viết ra, đặt tin xấu lên đầu, và ghi lại những quyết định đã gửi ngay trong ngày',
    'Shows only green to keep morale high|||Chỉ hiện xanh để giữ tinh thần',
    'Describes members with adjectives so the supervisor understands|||Tả thành viên bằng tính từ để giảng viên hiểu',
  ], 1, 'Against watermelon reports. Lesson 6.3.|||Chống báo cáo "dưa hấu". Bài 6.3.'),
  Q('agl6-8', 'C2 wrote on PR #29: "migration V3 looks a bit odd, can you check?" and approved. What would have made it useful?|||C2 viết ở PR #29: "migration V3 hơi lạ, bạn xem lại được không?" rồi duyệt. Viết thế nào mới có ích?', [
    'Adding an emoji|||Thêm biểu tượng cảm xúc',
    'Saying what will break (staging is at V4, Flyway will reject V3), proposing V5, and a deadline before approving|||Nói rõ điều gì sẽ hỏng (staging đã ở V4, Flyway sẽ từ chối V3), đề xuất V5, kèm hạn trước khi duyệt',
    'Sending it with @all|||Gửi kèm @all',
    'Sending a screenshot|||Gửi ảnh chụp màn hình',
  ], 1, 'Vague worries are easy to ignore; the staging incident followed. Lesson 6.4.|||Lo ngại mơ hồ rất dễ bị bỏ qua; sự cố staging xảy ra sau đó. Bài 6.4.'),
  Q('agl6-9', 'A message that looks like the team leader asks you on chat for the GitHub token "urgently, for the demo". What do you do?|||Một tin nhắn trông như của trưởng nhóm xin token GitHub "gấp, để demo". Bạn làm gì?', [
    'Send it — the demo matters|||Gửi — demo quan trọng',
    'Send it, then change it after the demo|||Gửi, demo xong thì đổi',
    'Verify through a second channel you already trust (call, ticket) before doing anything|||Xác minh qua kênh thứ hai mình vốn tin (gọi điện, ticket) trước khi làm gì',
    'Post it in the group so everyone sees|||Đăng lên nhóm cho mọi người thấy',
  ], 2, 'Arup 2024: a whole video call of deepfakes, about US$25.6 million. Lesson 6.4.|||Arup 2024: cả cuộc gọi video toàn deepfake, khoảng 25,6 triệu USD. Bài 6.4.'),
  Q('agl6-10', 'A member’s only card has had no commit for five working days. What is the right next step?|||Thẻ duy nhất của một thành viên đã năm ngày làm việc không có commit. Bước tiếp theo đúng là gì?', [
    'Do the screen yourself tonight|||Tối nay tự làm màn đó',
    'Complain in the group chat|||Than phiền trên nhóm chat',
    'A private 15-minute 1:1: facts, impact, ask the cause, agree a dated checkpoint, take notes|||1:1 riêng 15 phút: sự việc, tác động, hỏi nguyên nhân, thống nhất mốc kiểm có ngày, ghi chú',
    'Report to the supervisor immediately without telling the member|||Báo giảng viên ngay mà không nói với thành viên',
  ], 2, 'Step 2 of the ladder; doing it yourself hides the problem and removes their LOC. Lesson 6.5.|||Bậc 2 của bậc thang; tự làm thay giấu vấn đề và xoá LOC của bạn ấy. Bài 6.5.'),
];

export default {
  title: 'Chapter 6 — Meetings and communication|||Chương 6 — Họp và giao tiếp',
  description: 'Phía trưởng nhóm của họp và giao tiếp, chạy thật trên dữ liệu sprint 2 LabFlow (nhật ký sự kiện + CSV CT Work + repo git dựng lại): chuẩn bị daily bằng script đi bảng từ phải sang trái, bắt "không vướng"/"sắp xong" lệch dữ liệu (và bản đầu đổ oan bạn đi thi); planning theo năng lực 43,5 điểm vs mong muốn 59, cân tải theo người; retro có Prime Directive, soát hành động "xác sống"; báo cáo tuần cho giảng viên sinh từ git + bảng + sổ rủi ro, luật màu, soát 8 luật (Challenger 1986); tin nhắn tự đủ + Chrome thật cho lỗi camera, Arup deepfake 2024; thành viên trễ/im lặng/xung đột: bậc thang, 1:1 SBI, phát lại cảnh báo sớm; lab mốc dự án: bộ giao tiếp trong repo.',
  lessons: [B1, B2, B3, B4, B5, B6,
    {
      title: '6.7 — Chapter 6 quiz|||6.7 — Kiểm tra Chương 6',
      slug: 'agl-6-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: đầu ra của Daily Scrum, lời nói lệch dữ liệu, ngày vắng đã báo, cam kết theo năng lực, cân tải theo người, hành động xác sống, báo cáo tuần, lo ngại mơ hồ ở PR, xác minh kênh thứ hai, bậc thang xử lý thành viên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the real runs of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các lần chạy thật trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ6 },
    },
  ],
};
