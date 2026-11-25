/**
 * Chương 8 — 90 ngày đầu ở công ty (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s08/; ./s08/_ma.mjs là tệp SINH (mã + output thật: Node 22.22.2, git 2.55.0, node:22-alpine)
 * bởi scratchpad/agt/lab/ch8/tao-ma.mjs (chạy lại tất cả: lab/ch8/chay-het.sh). Slug + title 4 bài cũ GIỮ NGUYÊN theo khung
 * (agl-8-1 … agl-8-4); thêm agl-8-5-lab, agl-8-6-quiz (đã thêm vào khung).
 */
import { Q } from './_chung.mjs';
import B1 from './s08/b1-onboarding.mjs';
import B2 from './s08/b2-hoi.mjs';
import B3 from './s08/b3-viec-dau.mjs';
import B4 from './s08/b4-phat-trien.mjs';
import B5 from './s08/b5-lab.mjs';

const QUIZ8 = [
  Q('agl8-1', 'Which order of work in the first week did the chapter recommend?|||Chương này khuyên thứ tự công việc tuần đầu nào?', [
    'Read the whole codebase, then run it|||Đọc hết codebase, rồi mới chạy',
    'Run it (with a log) → one-page map → who to ask → one small change|||Cho chạy (kèm nhật ký) → bản đồ một trang → hỏi ai → một thay đổi nhỏ',
    'Take a big feature to prove yourself|||Nhận một tính năng lớn để chứng tỏ bản thân',
    'Refactor the messy parts first|||Refactor những phần lộn xộn trước',
  ], 1, 'Leave something behind each day; the onboarding log becomes your first PR. Lesson 8.1.|||Mỗi ngày để lại một sản phẩm; nhật ký onboarding thành PR đầu tiên. Bài 8.1.'),
  Q('agl8-2', 'In petclinic’s owner/ package, Dave Syer has the most commits of all time, Patrick Baumgartner the most in the last two years. Whom do you ask first about a change there?|||Ở gói owner/ của petclinic, Dave Syer có nhiều commit nhất mọi thời, Patrick Baumgartner nhiều nhất hai năm gần đây. Bạn hỏi ai trước về một thay đổi ở đó?', [
    'Dave Syer — most commits means most knowledge|||Dave Syer — nhiều commit nhất là hiểu nhất',
    'Patrick Baumgartner — recent changes, remembers why; then check the exact file’s history|||Patrick Baumgartner — vừa sửa gần đây, còn nhớ vì sao; rồi xem lịch sử của đúng tệp',
    'Whoever wrote the README|||Người viết README',
    'Nobody — read the code instead|||Không ai — tự đọc code',
  ], 1, 'And check name aliases ("Stephane"/"Stéphane") before concluding. Lesson 8.1.|||Và kiểm tên trùng người ("Stephane"/"Stéphane") trước khi kết luận. Bài 8.1.'),
  Q('agl8-3', 'What did the first grep-made map of petclinic get wrong?|||Bản đồ petclinic đầu tiên làm bằng grep sai ở đâu?', [
    'Nothing|||Không sai gì',
    'It missed the class-level @RequestMapping prefix and the array form @GetMapping({ "/vets" })|||Nó bỏ sót tiền tố @RequestMapping ở mức lớp và dạng mảng @GetMapping({ "/vets" })',
    'It counted test files as source files|||Nó đếm tệp test thành tệp nguồn',
    'It ran the application|||Nó chạy ứng dụng',
  ], 1, 'A map is a set of hypotheses; and the first fix dropped 7 routes — compare whole outputs. Lesson 8.1.|||Bản đồ là tập giả thuyết; và lần sửa đầu còn làm mất 7 đường dẫn — so toàn bộ output. Bài 8.1.'),
  Q('agl8-4', 'Your setup document contains database credentials and you are not sure which environment they belong to. What do you do?|||Tài liệu cài đặt có thông tin đăng nhập CSDL và bạn không chắc nó thuộc môi trường nào. Bạn làm gì?', [
    'Use them; the document must be right|||Dùng; tài liệu chắc là đúng',
    'Ask before using; if they are production, report it privately the same day so they can be rotated|||Hỏi trước khi dùng; nếu là production thì báo riêng ngay trong ngày để họ đổi',
    'Copy them to your notes for later|||Chép vào ghi chú để dùng sau',
    'Post them in the team chat to ask|||Dán lên nhóm chat để hỏi',
  ], 1, 'The 2017 first-day production wipe started from exactly this. Lesson 8.1.|||Vụ xoá CSDL production ngày đầu năm 2017 bắt đầu đúng từ chuyện này. Bài 8.1.'),
  Q('agl8-5', 'Question 4 passed the checker with 7/8 but is still a bad question. Why?|||Câu hỏi số 4 qua bộ soát với 7/8 mà vẫn là câu hỏi tồi. Vì sao?', [
    'It is too long|||Nó quá dài',
    'It asks how to disable npm ci’s lock check (the guessed solution Y) instead of how to install dependencies (the goal X)|||Nó hỏi cách tắt kiểm tra lock của npm ci (cách giải Y đã đoán) thay vì cách cài thư viện (mục tiêu X)',
    'It has no error message|||Nó không có thông báo lỗi',
    'It was sent in English|||Nó viết bằng tiếng Anh',
  ], 1, 'The XY problem — a script cannot detect it; state the goal first. Lesson 8.2.|||Vấn đề XY — script không phát hiện được; nêu mục tiêu trước. Bài 8.2.'),
  Q('agl8-6', 'What did the two-week question log show?|||Nhật ký hỏi hai tuần cho thấy gì?', [
    'Asking early wasted most of the team’s time|||Hỏi sớm làm tốn phần lớn thời gian của đội',
    'Waiting too long cost 330 minutes alone to save 11 minutes of a helper’s time; silence was the expensive mistake|||Chờ quá lâu tốn 330 phút tự kẹt để tiết kiệm 11 phút của người giúp; im lặng mới là sai lầm đắt',
    'Nobody answered|||Không ai trả lời',
    'All questions were already in the docs|||Mọi câu đều đã có trong tài liệu',
  ], 1, 'Hence the 15–30 minute rule. Lesson 8.2.|||Vì vậy có quy tắc 15–30 phút. Bài 8.2.'),
  Q('agl8-7', 'You pasted an npm token in the team chat. In which order do you act?|||Bạn lỡ dán token npm vào nhóm chat. Bạn làm theo thứ tự nào?', [
    'Delete the message, then hope nobody saw it|||Xoá tin nhắn, rồi mong không ai thấy',
    'Revoke and rotate the token, then delete the message, then tell your lead|||Thu hồi và đổi token, rồi xoá tin nhắn, rồi báo leader',
    'Do nothing — the chat is internal|||Không làm gì — chat là nội bộ',
    'Rename the channel|||Đổi tên kênh',
  ], 1, 'Deleting alone is not enough. Lesson 8.2.|||Chỉ xoá thôi là không đủ. Bài 8.2.'),
  Q('agl8-8', 'Why did kiem-pr-dau.mjs run CI on the FIRST test commit of the branch?|||Vì sao kiem-pr-dau.mjs chạy CI ở commit test ĐẦU TIÊN của nhánh?', [
    'To save time|||Để tiết kiệm thời gian',
    'That commit has the tests but not the fix: it must be red, proving the tests reproduce the bug|||Commit đó có test mà chưa có bản sửa: nó phải đỏ, chứng minh test tái hiện được lỗi',
    'Because the last commit cannot be tested|||Vì commit cuối không test được',
    'To check the commit message|||Để kiểm lời nhắn commit',
  ], 1, 'A test that is green before the fix proves nothing. Lesson 8.3.|||Test xanh trước khi sửa chẳng chứng minh gì. Bài 8.3.'),
  Q('agl8-9', 'The hurried LH-212 fix sorted correctly. Why was CI still red?|||Bản sửa vội LH-212 đã xếp đúng. Vì sao CI vẫn đỏ?', [
    'The tests were wrong|||Test sai',
    'It renamed topChoLau, and routes.mjs still imported the old name|||Nó đổi tên topChoLau, mà routes.mjs vẫn import tên cũ',
    'The branch name was too short|||Tên nhánh quá ngắn',
    'Node 22 does not support sort|||Node 22 không hỗ trợ sort',
  ], 1, '"While I’m here" changes break callers — refactors get their own ticket. Lesson 8.3.|||Thay đổi "tiện tay" làm hỏng nơi gọi — refactor có ticket riêng. Bài 8.3.'),
  Q('agl8-10', 'Which 30-60-90 goal passes the "checkable" rule?|||Mục tiêu 30-60-90 nào đạt luật "kiểm được"?', [
    '"Understand the team’s process"|||"Hiểu quy trình làm việc của team"',
    '"Code better, with fewer bugs"|||"Code tốt hơn, ít bug hơn"',
    '"Close 3 small tickets (≤ 2 points), each PR passing kiem-pr-dau.mjs before review"|||"Đóng 3 ticket nhỏ (≤ 2 điểm), mỗi PR qua kiem-pr-dau.mjs trước khi nhờ review"',
    '"Become a key member of the team"|||"Trở thành thành viên chủ lực của team"',
  ], 2, 'A visible product plus a number or a date. Lesson 8.4.|||Sản phẩm nhìn thấy được cộng một con số hoặc một ngày. Bài 8.4.'),
];

export default {
  title: 'Chapter 8 — Your first 90 days|||Chương 8 — 90 ngày đầu ở công ty',
  description: 'Người mới ở công ty — chạy thật: tuần đầu theo thứ tự chạy → bản đồ → con người → một thay đổi nhỏ, bản đồ một trang CHỈ ĐỌC repo công khai spring-petclinic (hỏi người sửa gần đây, tên trùng người, grep sai hai chỗ), chuyện thật 2017 (thông tin production trong tài liệu onboarding) và dependency confusion 2021; hỏi câu hỏi tốt với lỗi npm ci thật (EAI_AGAIN, EUSAGE), soát 8 luật, vấn đề XY, thu nhỏ lỗi sort(), nhật ký hỏi (330 phút kẹt vs 11 phút giúp), lộ bí mật (NDSS 2019); ticket đầu LH-212 làm hai cách, test đỏ trước, kiem-pr-dau.mjs, mốc kiểm nửa ước lượng (Knight Capital 2012); phản hồi, 1:1, 30-60-90 kiểm được, sổ thành tích; lab mốc dự án: hồ sơ hai tuần + bộ đón thành viên SWP391.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
      slug: 'agl-8-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: thứ tự tuần đầu, hỏi ai, bản đồ grep sai, thông tin production trong tài liệu, vấn đề XY, nhật ký hỏi, lỡ dán token, test đỏ trước khi sửa, đổi tên làm hỏng nơi gọi, mục tiêu kiểm được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the real runs of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các lần chạy thật trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ8 },
    },
  ],
};
