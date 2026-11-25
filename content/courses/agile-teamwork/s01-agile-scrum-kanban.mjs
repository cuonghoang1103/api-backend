/**
 * Chương 1 — Agile, Scrum và Kanban trong thực tế (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s01/; ./s01/_ma.mjs là tệp SINH (mã lab + output thật, Node 22.22.2) bởi scratchpad/agt/lab/ch1/tao-ma.mjs.
 * Slug + title 4 bài cũ GIỮ NGUYÊN theo khung (agl-1-1 … agl-1-4); thêm agl-1-5-lab và agl-1-6-quiz (đã thêm vào khung trong ../agile-teamwork.mjs).
 */
import { Q } from './_chung.mjs';
import B1 from './s01/b1-agile.mjs';
import B2 from './s01/b2-scrum.mjs';
import B3 from './s01/b3-kanban.mjs';
import B4 from './s01/b4-chon.mjs';
import B5 from './s01/b5-lab.mjs';

const QUIZ1 = [
  Q('agl1-1', 'Which sentence matches the Agile Manifesto?|||Câu nào khớp với Tuyên ngôn Agile?', [
    'Agile teams do not write documentation|||Nhóm Agile không viết tài liệu',
    'Working software is valued more than comprehensive documentation, while documentation still has value|||Phần mềm chạy được được coi trọng hơn tài liệu đầy đủ, dù tài liệu vẫn có giá trị',
    'Agile means using Scrum with two-week sprints|||Agile nghĩa là dùng Scrum với sprint hai tuần',
    'Agile teams do not plan|||Nhóm Agile không lập kế hoạch',
  ], 1, '"That is, while there is value in the items on the right, we value the items on the left more." Lesson 1.1.|||"Dù các mục bên phải có giá trị, chúng tôi coi trọng các mục bên trái hơn." Bài 1.1.'),
  Q('agl1-2', 'In the toy model of lesson 1.1 both teams work the same 12 weeks. Why does the sprint team deliver more value?|||Trong mô hình đồ chơi bài 1.1, hai nhóm làm cùng 12 tuần. Vì sao nhóm chạy sprint giao được nhiều giá trị hơn?', [
    'It codes faster|||Nhóm đó code nhanh hơn',
    'It discovers misunderstandings earlier, when fewer features depend on them, and drops the least valuable work at the end|||Nhóm đó phát hiện hiểu lầm sớm hơn, khi ít tính năng phụ thuộc vào nó, và bỏ phần ít giá trị nhất ở cuối',
    'It has no misunderstandings|||Nhóm đó không có hiểu lầm nào',
    'It skips documentation|||Nhóm đó bỏ tài liệu',
  ], 1, 'Same misunderstandings, found at week 4 instead of week 12 (F3 dragged only F4, not F4 and F5). Lesson 1.1.|||Cùng các hiểu lầm, nhưng lộ ở tuần 4 thay vì tuần 12 (F3 chỉ kéo theo F4, không kéo cả F4 và F5). Bài 1.1.'),
  Q('agl1-3', 'Which is the commitment attached to the Increment in the 2020 Scrum Guide?|||Theo Scrum Guide 2020, cam kết gắn với Increment là gì?', [
    'Product Goal|||Product Goal', 'Sprint Goal|||Sprint Goal', 'Definition of Done|||Definition of Done', 'Velocity|||Velocity',
  ], 2, 'Product Backlog → Product Goal, Sprint Backlog → Sprint Goal, Increment → Definition of Done. Lesson 1.2.|||Product Backlog → Product Goal, Sprint Backlog → Sprint Goal, Increment → Definition of Done. Bài 1.2.'),
  Q('agl1-4', 'Who is the Daily Scrum for, and what is its purpose?|||Daily Scrum dành cho ai và để làm gì?', [
    'For the leader, to collect status from everyone|||Cho trưởng nhóm, để thu báo cáo của mọi người',
    'For the Developers, to inspect progress toward the Sprint Goal and adapt the plan for the next day|||Cho Developers, để soát tiến độ so với Sprint Goal và chỉnh kế hoạch ngày tới',
    'For the client, to see a demo|||Cho khách hàng, để xem demo',
    'For the Scrum Master, to assign tasks|||Cho Scrum Master, để giao việc',
  ], 1, 'A daily that is a status report to the leader is a known anti-pattern. Lesson 1.2, chapter 6.1.|||Daily thành buổi báo cáo cho trưởng nhóm là kiểu làm sai đã biết. Bài 1.2, bài 6.1.'),
  Q('agl1-5', 'Which is the strongest Sprint Goal?|||Sprint Goal nào mạnh nhất?', [
    'Do LF-21 to LF-30|||Làm LF-21 tới LF-30',
    'Finish the booking module|||Làm xong module đặt lịch',
    'A student can book a 2-hour slot and a lecturer can approve or reject it, end to end on the demo server|||Sinh viên đặt được một ca 2 giờ và giảng viên duyệt hoặc từ chối được, chạy trọn trên máy demo',
    'Write as much code as possible|||Viết được càng nhiều code càng tốt',
  ], 2, 'One user-visible, testable outcome; flexible on exact scope. Lesson 1.2.|||Một kết quả người dùng thấy được, kiểm được; phạm vi chi tiết linh hoạt. Bài 1.2.'),
  Q('agl1-6', 'A member says LF-23 "works, but tests and SRS are not written yet". By the team’s DoD, LF-23 is…|||Một bạn nói LF-23 "chạy rồi, chỉ chưa viết test và SRS". Theo DoD của nhóm, LF-23 đang…', [
    'Done|||Done', 'In progress — not part of the increment and not shown at the review|||Đang làm — chưa thuộc increment và không đem ra review', 'Done, tests can follow next sprint|||Done, test để sprint sau', 'Cancelled|||Bị huỷ',
  ], 1, 'Work that does not meet the DoD is not Done. Lesson 1.2.|||Việc chưa đạt DoD thì chưa Done. Bài 1.2.'),
  Q('agl1-7', 'A team finishes on average 2 cards per day and has 12 cards in progress. By Little’s Law the average cycle time is about…|||Một nhóm xong trung bình 2 thẻ/ngày và đang mở 12 thẻ. Theo định luật Little, cycle time trung bình khoảng…', [
    '24 days|||24 ngày', '6 days|||6 ngày', '2 days|||2 ngày', '12 days|||12 ngày',
  ], 1, 'Cycle time = WIP ÷ throughput = 12 ÷ 2 = 6 days (for a stable system). Lesson 1.3.|||Cycle time = WIP ÷ throughput = 12 ÷ 2 = 6 ngày (với hệ ổn định). Bài 1.3.'),
  Q('agl1-8', 'In the simulation, adding a WIP limit while only the leader reviews (rule B) left throughput unchanged but created 55 idle half-days. What does that idleness mean?|||Trong mô phỏng, thêm giới hạn WIP khi chỉ trưởng nhóm review (luật B) giữ nguyên throughput nhưng sinh ra 55 buổi rảnh. Sự rảnh đó nghĩa là gì?', [
    'WIP limits are bad and should be removed|||Giới hạn WIP có hại, nên bỏ',
    'Members are lazy|||Thành viên lười',
    'Review is the bottleneck; free members should help review|||Review là chỗ tắc; người rảnh nên giúp review',
    'The sprint is too long|||Sprint quá dài',
  ], 2, 'With everyone reviewing (rule C) the same team finished 38 cards instead of 27. Lessons 1.3, 1.5.|||Khi ai cũng review (luật C), cùng nhóm đó xong 38 thẻ thay vì 27. Bài 1.3, 1.5.'),
  Q('agl1-9', 'A burndown stays flat for most of the sprint and drops sharply in the last three days. The most likely meaning is…|||Burndown nằm ngang gần cả sprint rồi rơi mạnh ba ngày cuối. Khả năng cao nhất là…', [
    'The team is ahead of schedule|||Nhóm đang nhanh hơn kế hoạch',
    'Work was integrated or moved on the board only at the end — the leader could not see problems in time|||Việc chỉ được tích hợp hoặc kéo trên bảng vào cuối — trưởng nhóm không thấy vấn đề kịp thời',
    'Scope was added mid-sprint|||Phạm vi bị thêm giữa sprint',
    'The chart is broken|||Biểu đồ bị lỗi',
  ], 1, 'The "hockey stick" — team B in lab 1.5. Scope added mid-sprint shows as the line going up (team C).|||Hình "gậy khúc côn cầu" — nhóm B ở lab 1.5. Phạm vi thêm giữa sprint thì đường đi lên (nhóm C).'),
  Q('agl1-10', 'For a 5-person SWP391 team whose lecturer reviews at the end of each of 3 iterations, which setup does this chapter recommend?|||Với nhóm SWP391 năm người, giảng viên review cuối mỗi iteration (3 iteration), chương này đề xuất cách nào?', [
    'Pure Kanban with no sprints|||Kanban thuần, không sprint',
    'One sprint per iteration with a mid-sprint check, a Kanban board with WIP limits and shared review, written dailies on other days|||Mỗi iteration một sprint kèm soát giữa sprint, bảng Kanban có giới hạn WIP và cùng review, daily bằng chữ các ngày khác',
    'One-week sprints with daily video calls every day|||Sprint một tuần, gọi video daily mỗi ngày',
    'Waterfall: requirements first, all code in iteration 3|||Waterfall: yêu cầu trước, toàn bộ code ở iteration 3',
  ], 1, 'Scrum for the rhythm of your real stakeholder, Kanban for the flow inside the sprint. Lesson 1.4.|||Scrum cho nhịp của bên liên quan thật, Kanban cho dòng chảy bên trong sprint. Bài 1.4.'),
];

export default {
  title: 'Chapter 1 — Agile, Scrum and Kanban in practice|||Chương 1 — Agile, Scrum và Kanban trong thực tế',
  description: 'Không học thuộc Scrum Guide — chạy được một sprint: giá trị Agile thật (mô hình chạy thật giao dần vs giao một lần), Scrum Guide 2020 + DoD + lịch sprint .ics, Kanban với mô phỏng giới hạn WIP và định luật Little, chọn cách làm cho nhóm SWP391 + thoả thuận làm việc, lab Sprint 0 đọc burndown.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
      slug: 'agl-1-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: đọc đúng Tuyên ngôn Agile, vì sao giao dần thắng, cam kết của Increment, Daily dành cho ai, Sprint Goal mạnh, DoD, định luật Little, ý nghĩa thời gian rảnh khi có WIP, đọc burndown, chọn cách làm cho SWP391.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the scripts and situations of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các script và tình huống trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ1 },
    },
  ],
};
