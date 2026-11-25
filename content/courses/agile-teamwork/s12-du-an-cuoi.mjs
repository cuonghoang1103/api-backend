/**
 * Chương 12 — Dự án cuối khoá: điều hành một sprint cho dự án nhóm (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s12/; ./s12/_ma.mjs là tệp SINH (mã + output thật: Node 22.22.2, git 2.55.0) bởi scratchpad/agt/lab/ch12/tao-ma.mjs
 * (chạy lại tất cả: lab/ch12/chay-het.sh). Slug + title 4 bài cũ GIỮ NGUYÊN theo khung (agl-9-1 … agl-9-4, nhờ giuSlugDuAnCuoi);
 * thêm agl-9-5-de-thi (đề PE có giờ) + agl-9-6-quiz-tong (kiểm tra tổng kiểu FE) — key khác hẳn bài Chương 9 (agl-9-5-qa-cr, agl-9-6-uoc-luong-man-day).
 * Mô tả cũ của khung "Đặt lịch phòng khám" ⇒ LabFlow như Mục 0 đã hứa.
 */
import { Q } from './_chung.mjs';
import B1 from './s12/b1-chuan-bi.mjs';
import B2 from './s12/b2-thuc-hien.mjs';
import B3 from './s12/b3-ket-thuc.mjs';
import B4 from './s12/b4-tong-ket.mjs';
import B5 from './s12/b5-de-thi.mjs';

const QUIZ12 = [
  Q('agl12-1', 'Which statement is one of the four values of the Agile Manifesto?|||Câu nào là một trong bốn giá trị của Tuyên ngôn Agile?', [
    'Processes and tools over individuals and interactions|||Quy trình và công cụ hơn cá nhân và tương tác',
    'Responding to change over following a plan|||Phản hồi thay đổi hơn làm theo kế hoạch',
    'Comprehensive documentation over working software|||Tài liệu đầy đủ hơn phần mềm chạy được',
    'Contract negotiation over customer collaboration|||Đàm phán hợp đồng hơn cộng tác với khách hàng',
  ], 1, 'The manifesto values the items on the left more — it does not throw the right ones away. Lesson 1.1.|||Tuyên ngôn coi trọng vế trái hơn — không vứt bỏ vế phải. Bài 1.1.'),
  Q('agl12-2', 'According to the Scrum Guide 2020, what is the Sprint Goal?|||Theo Scrum Guide 2020, Sprint Goal là gì?', [
    'The list of all tickets in the sprint|||Danh sách mọi ticket trong sprint',
    'The single objective of the sprint, which gives the team flexibility in the exact work|||Mục tiêu duy nhất của sprint, cho đội linh hoạt về phần việc cụ thể',
    'The velocity target for the sprint|||Chỉ tiêu velocity của sprint',
    'The date of the sprint review|||Ngày sprint review',
  ], 1, 'And a good one is checkable by someone outside the team. Lessons 1.2, 12.1.|||Và mục tiêu tốt thì người ngoài nhóm kiểm được. Bài 1.2, 12.1.'),
  Q('agl12-3', 'Little’s Law for a Kanban board says…|||Định luật Little cho bảng Kanban nói…', [
    'average cycle time = average WIP ÷ average throughput|||cycle time trung bình = WIP trung bình ÷ thông lượng trung bình',
    'more WIP always means more throughput|||WIP càng nhiều thì thông lượng càng cao',
    'cycle time does not depend on WIP|||cycle time không phụ thuộc WIP',
    'throughput = story points ÷ people|||thông lượng = story point ÷ số người',
  ], 0, 'So cutting WIP cuts waiting time. Lesson 1.3.|||Vì vậy giảm WIP là giảm thời gian chờ. Bài 1.3.'),
  Q('agl12-4', 'Why does an SWP391 team split work by screen (domain), not by layer (FE/BE)?|||Vì sao nhóm SWP391 chia việc theo màn (miền) chứ không theo tầng (FE/BE)?', [
    'Because layers are harder to learn|||Vì chia tầng khó học hơn',
    'Because LOC is graded per person per screen, and one owner per screen removes hand-offs|||Vì LOC chấm theo người theo màn, và một chủ mỗi màn bỏ được việc bàn giao',
    'Because the supervisor forbids layers|||Vì giảng viên cấm chia tầng',
    'Because backend code has no LOC|||Vì mã backend không tính LOC',
  ], 1, 'Lessons 2.2, 12.1.|||Bài 2.2, 12.1.'),
  Q('agl12-5', 'LF-25 is carried over: 5 points, only the review fixes left (about 1 point of work). How did sprint 3 plan it?|||LF-25 dở từ sprint trước: 5 điểm, chỉ còn sửa theo review (khoảng 1 điểm việc). Sprint 3 lên kế hoạch thế nào?', [
    'Count 5 points against capacity|||Tính 5 điểm vào năng lực',
    'Count its remaining 1 point against capacity; velocity still gets 5 when it is done — and looks better than the work done|||Tính 1 điểm còn lại vào năng lực; velocity vẫn được 5 khi xong — và đẹp hơn phần việc thật',
    'Drop it from the sprint|||Bỏ nó khỏi sprint',
    'Split it into five 1-point tickets|||Chia thành năm ticket 1 điểm',
  ], 1, 'The same effect makes the first two days of the burndown look steep. Lessons 12.1, 12.3.|||Cũng hiệu ứng đó làm hai ngày đầu burndown dốc đứng. Bài 12.1, 12.3.'),
  Q('agl12-6', 'The leader spends about 30 % of their time coordinating. How should capacity handle it?|||Trưởng nhóm dành khoảng 30 % thời gian để điều phối. Năng lực nên xử lý thế nào?', [
    'Ignore it|||Bỏ qua',
    'Subtract it from this sprint only|||Chỉ trừ ở sprint này',
    'Subtract it in both the reference sprint and this sprint (or in neither)|||Trừ ở cả sprint tham chiếu lẫn sprint này (hoặc không trừ ở đâu)',
    'Double the leader’s points|||Nhân đôi điểm của trưởng nhóm',
  ], 2, 'Otherwise the same overhead is counted twice. Lesson 12.1.|||Không thì cùng một phần điều phối bị đếm hai lần. Bài 12.1.'),
  Q('agl12-7', 'The team capacity fits, but one member is +2.9 points over their personal capacity and another −3.1. What do you do?|||Năng lực nhóm vừa, nhưng một người vượt năng lực riêng +2.9 điểm và một người thiếu −3.1. Bạn làm gì?', [
    'Nothing — the total fits|||Không làm gì — tổng vừa rồi',
    'Move a ticket of the overloaded member to stretch and bring one of the other member’s own tickets into the commitment|||Chuyển một ticket của người quá tải xuống dự phòng và đưa một ticket của chính người thiếu việc lên cam kết',
    'Give the overloaded member’s screen to the other member|||Đưa màn của người quá tải cho người kia',
    'Ask the overloaded member to work harder|||Bảo người quá tải cố gắng hơn',
  ], 1, 'Screens keep their owners (LOC); planning only nudges. Lessons 6.6, 12.1.|||Màn giữ chủ (LOC); planning chỉ chỉnh được một chút. Bài 6.6, 12.1.'),
  Q('agl12-8', 'Which commit message follows Conventional Commits and the team’s ticket rule?|||Lời nhắn commit nào theo Conventional Commits và luật mã ticket của nhóm?', [
    'update code|||update code',
    'feat(LF-74): nhắc trả thiết bị quá hạn qua email|||feat(LF-74): nhắc trả thiết bị quá hạn qua email',
    'LF-74 done!!!|||LF-74 xong!!!',
    'fix stuff from review|||sửa theo review',
  ], 1, 'The ticket in the scope lets reports map commits to screens. Lessons 3.1, 3.5.|||Mã ticket trong scope giúp báo cáo quy commit về màn. Bài 3.1, 3.5.'),
  Q('agl12-9', 'A PR contains a password. The author adds a second commit that removes it. Is the PR safe to merge?|||PR có mật khẩu. Tác giả thêm commit thứ hai xoá nó. PR đã an toàn để merge chưa?', [
    'Yes — the latest file is clean|||Rồi — tệp mới nhất đã sạch',
    'No — the password is still in the first commit; rotate it, then rewrite the branch|||Chưa — mật khẩu vẫn nằm trong commit đầu; đổi mật khẩu, rồi viết lại nhánh',
    'Yes, if the repository is private|||Rồi, nếu repo là private',
    'Only after squash merge|||Chỉ sau khi squash merge',
  ], 1, 'Anyone who fetched the branch still has it (the drill showed C2’s clone). Lesson 12.2.|||Ai đã fetch nhánh vẫn còn giữ nó (bài diễn tập cho thấy bản clone của C2). Bài 12.2.'),
  Q('agl12-10', 'What did the Uber 2016 breach show about private repositories?|||Vụ Uber 2016 cho thấy gì về repo private?', [
    'Private repositories cannot be accessed by attackers|||Kẻ tấn công không vào được repo private',
    'Once an account is taken over, credentials stored in a private repo are exposed|||Khi một tài khoản bị chiếm, thông tin đăng nhập trong repo private bị lộ',
    'Only public repositories need secret scanning|||Chỉ repo public mới cần quét bí mật',
    'GitHub leaked the data|||GitHub làm lộ dữ liệu',
  ], 1, 'Attackers used reused passwords, found AWS keys, took data of about 57 million users. Lesson 12.2.|||Kẻ tấn công dùng mật khẩu tái sử dụng, thấy khoá AWS, lấy dữ liệu khoảng 57 triệu người dùng. Bài 12.2.'),
  Q('agl12-11', 'A member has had a card for three working days without a commit and did not post a standup. Your first step?|||Một thành viên giữ thẻ ba ngày làm việc không commit và không gửi standup. Bước đầu tiên?', [
    'Report them to the supervisor|||Báo giảng viên',
    'Mention it at the daily in front of everyone|||Nêu ra ở daily trước mọi người',
    'Ask privately where they are stuck, and pair for an hour within 24 hours (R3-3)|||Hỏi riêng đang kẹt ở đâu, và ngồi cùng một giờ trong 24 giờ (R3-3)',
    'Do the ticket yourself|||Tự làm ticket đó',
  ], 2, 'In sprint 3 the cause was "stuck and embarrassed to ask", not laziness. Lessons 6.5, 12.2.|||Ở sprint 3 nguyên nhân là "kẹt và ngại hỏi", không phải lười. Bài 6.5, 12.2.'),
  Q('agl12-12', 'The supervisor adds a 2-point requirement in the middle of the sprint. What is the best response?|||Giảng viên thêm một yêu cầu 2 điểm giữa sprint. Cách xử lý tốt nhất?', [
    'Add it quietly to an existing ticket|||Lặng lẽ nhồi vào một ticket có sẵn',
    'Refuse until next sprint|||Từ chối tới sprint sau',
    'A separate ticket, traded against equal work, told to the affected member first, recorded so reports and burndown show it|||Ticket riêng, đổi lấy phần việc tương đương, báo người bị ảnh hưởng trước, ghi lại để báo cáo và burndown thấy',
    'Everyone works the weekend|||Cả nhóm làm cuối tuần',
  ], 2, 'Lesson 12.2.|||Bài 12.2.'),
  Q('agl12-13', 'A member complains in the team channel after their PR was blocked for a secret. How does the leader reply?|||Một thành viên phàn nàn trên kênh nhóm sau khi PR bị chặn vì có bí mật. Trưởng nhóm trả lời thế nào?', [
    'In the channel, firmly, so everyone learns|||Ngay trên kênh, cứng rắn, để cả nhóm rút kinh nghiệm',
    'Privately with facts, the reason and thanks; publicly only the incident and the fix|||Riêng tư với sự việc, lý do và lời cảm ơn; công khai chỉ sự cố và cách xử lý',
    'Ignore it|||Lờ đi',
    'Unblock the PR to keep the peace|||Gỡ chặn PR cho êm',
  ], 1, 'The rule stays; where you say each part changes. Lessons 6.5, 12.2.|||Luật giữ nguyên; thay đổi là nói phần nào ở đâu. Bài 6.5, 12.2.'),
  Q('agl12-14', 'Why did the reply checker first flag the GOOD message as "judging the person"?|||Vì sao lần đầu bộ soát tin trả lời cờ tin TỐT là "phán xét con người"?', [
    'The message was rude|||Tin thô lỗ',
    'The word list matched "ẩu" inside "mật khẩu" — substrings ignore Vietnamese syllables|||Danh sách từ khớp "ẩu" bên trong "mật khẩu" — so chuỗi con bỏ qua âm tiết tiếng Việt',
    'The message was too long|||Tin quá dài',
    'The message had no ticket number|||Tin không có mã ticket',
  ], 1, 'Fix: letter-class boundaries (\\p{L}, flag u). Same bug in "khá"/"Khác". Lessons 12.2, 12.3.|||Sửa: ranh giới theo lớp chữ cái (\\p{L}, cờ u). Cùng lỗi với "khá"/"Khác". Bài 12.2, 12.3.'),
  Q('agl12-15', 'A screen works on the developer’s laptop but failed its second review. Do you demo it at the sprint review?|||Một màn chạy trên máy lập trình viên nhưng trượt review lần hai. Có demo ở sprint review không?', [
    'Yes, it looks good|||Có, trông đẹp mà',
    'Yes, but mention the bug|||Có, nhưng nhắc lỗi',
    'No — work that does not meet the Definition of Done is not presented; say what is missing and when it will be shown|||Không — việc chưa đạt Definition of Done thì không trình bày; nói còn thiếu gì và khi nào demo',
    'Only if the supervisor asks|||Chỉ khi giảng viên hỏi',
  ], 2, 'Lesson 12.3.|||Bài 12.3.'),
  Q('agl12-16', 'The retro checker flagged "CI runs gitleaks on every PR…" as a zombie of "CI runs tests on every PR…" (which was done). What was wrong?|||Bộ soát retro cờ "CI chạy gitleaks cho mọi PR…" là xác sống của "CI chạy test cho mọi PR…" (đã làm xong). Sai ở đâu?', [
    'Nothing — it is a zombie|||Không sai — đúng là xác sống',
    'Similar wording is not repetition; a zombie repeats an earlier action that was NOT done|||Câu giống khuôn không phải lặp lại; xác sống là lặp lại hành động cũ CHƯA được làm',
    'gitleaks is not allowed in CI|||Không được dùng gitleaks trong CI',
    'The action had no owner|||Hành động không có chủ',
  ], 1, 'Check the checker. Lesson 12.3.|||Soát lại cả bộ soát. Bài 12.3.'),
  Q('agl12-17', 'In the retro log, actions with owner + deadline + ticket were done 8/8. Actions missing one of the three?|||Trong sổ retro, hành động có chủ + hạn + ticket được làm 8/8. Hành động thiếu một trong ba thì sao?', [
    '4/4|||4/4', '2/4|||2/4', '0/4|||0/4', '8/8|||8/8',
  ], 2, 'The strongest argument for the format. Lesson 12.3.|||Lý lẽ mạnh nhất cho cách viết đó. Bài 12.3.'),
  Q('agl12-18', 'The forecast for 8 tickets by 16/04 is 89 % with sprints 2 + 3 as the sample, 98 % with sprint 3 alone. Which goes in the report?|||Dự báo 8 ticket trước 16/04 là 89 % khi lấy mẫu sprint 2 + 3, 98 % khi chỉ lấy sprint 3. Báo cáo dùng số nào?', [
    '98 % — it is the latest data|||98 % — dữ liệu mới nhất',
    '89 %, saying that sprint 3 includes two carried-over merges whose work was done earlier|||89 %, nói rõ sprint 3 có hai lần merge của ticket dở mà việc đã làm từ trước',
    'Average them: 93.5 %|||Lấy trung bình: 93.5 %',
    'No number — just "on track"|||Không số — chỉ "đúng tiến độ"',
  ], 1, 'Lessons 7.4, 12.3.|||Bài 7.4, 12.3.'),
  Q('agl12-19', 'What does a green kiem-sprint.sh (exit code 0) prove?|||kiem-sprint.sh xanh (mã thoát 0) chứng minh điều gì?', [
    'That the sprint was a success|||Sprint thành công',
    'That nothing cheap is missing from the sprint pack; whether the goal was right is still your judgement|||Hồ sơ sprint không thiếu thứ gì dễ thấy; mục tiêu có đúng không vẫn là phán đoán của bạn',
    'That the code has no bugs|||Mã không có lỗi',
    'That the supervisor will approve|||Giảng viên sẽ duyệt',
  ], 1, 'Lesson 12.4.|||Bài 12.4.'),
  Q('agl12-20', 'Which STAR answer would pass the course’s checker?|||Câu trả lời STAR nào qua được bộ soát của khoá?', [
    '"Our team worked hard with Scrum and the teacher praised us."|||"Nhóm em làm Scrum rất chăm chỉ và được thầy khen."',
    'Four parts; "I" in the action; a result with numbers (39/47 points, a member from 0 to 13); no blame; a lesson|||Đủ bốn phần; "mình" trong hành động; kết quả có số (39/47 điểm, một bạn từ 0 lên 13); không chê ai; có bài học',
    'A list of technologies used|||Danh sách công nghệ đã dùng',
    'A story about a lazy teammate|||Chuyện về một đồng đội lười',
  ], 1, 'Lesson 12.4; technique in Interview prep 2.2.|||Bài 12.4; kỹ thuật ở Phỏng vấn 2.2.'),
];

export default {
  title: 'Chapter 12 — Capstone: run a sprint for a team project|||Chương 12 — Dự án cuối khoá: điều hành một sprint cho dự án nhóm',
  description: 'Dự án cuối khoá chạy thật: điều hành trọn sprint 3 của LabFlow (08/03–26/03/2027) bằng chính công cụ chương 1–8 — planning có cân LOC cả kỳ và năng lực từng người, ba tuần daily/PR/review với đổi phạm vi giữa sprint, thành viên im lặng, mật khẩu trong PR (diễn tập git thật, Uber 2016) và va chạm; review chỉ demo cái Done, retro bằng dữ liệu, dự báo, báo cáo tin xấu trước (HealthCare.gov 2013); một lệnh soát hồ sơ sprint, câu chuyện STAR có bằng chứng; đề thi PE 120 phút và kiểm tra tổng 20 câu.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '12.6 — Final quiz|||12.6 — Kiểm tra tổng',
      slug: 'agl-9-6-quiz-tong',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Hai mươi câu kiểu FE trải cả khoá, neo vào các lần chạy thật của dự án cuối khoá: Tuyên ngôn và Sprint Goal, định luật Little, chia theo màn, ticket dở và thời gian điều phối trong năng lực, cân theo người, Conventional Commits, bí mật trong PR và Uber 2016, thành viên im lặng, thêm việc giữa sprint, va chạm, lỗi so chuỗi con tiếng Việt, demo chỉ cái Done, xác sống retro, chọn mẫu dự báo, ý nghĩa của "xanh", STAR.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final quiz</span>
<h2>The whole course in twenty questions</h2>
<p class="lead">Twenty questions across the course, anchored in the real runs of the capstone. Thirty minutes. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra tổng</span>
<h2>Cả khoá trong hai mươi câu</h2>
<p class="lead">Hai mươi câu trải cả khoá, neo vào các lần chạy thật của dự án cuối khoá. Ba mươi phút. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 1800, questions: QUIZ12 },
    },
  ],
};
