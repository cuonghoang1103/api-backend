/**
 * Làm việc nhóm phần mềm — Chương 11: Làm việc với khách Nhật và khách Mỹ (soạn 24/11/2026, agent agl).
 * Slug + title chương GIỮ NGUYÊN theo khung trong ../agile-teamwork.mjs (agl-11-1-khach-nhat … agl-11-6-quiz), ghép bằng ghep().
 * Nội dung từng bài ở ./s11/b*.mjs; mã lab + output THẬT ở ./s11/_ma.mjs (sinh bởi scratchpad/agl/lab/ch11/tao-ma.mjs:
 * Node 22.22.2 Intl/ICU lịch Nhật + IANA tz, git 2.55 bisect run, node --test trên bản sao dự án lab 9.8).
 * Lý thuyết văn hoá (Hall, Hofstede, Meyer) không giảng lại — liên kết IBC201; câu chữ tiếng Anh ⇒ tieng-anh-ky-thuat-di-lam ch4–6.
 */
import { Q } from './_chung.mjs';
import { L111 } from './s11/b1-khach-nhat.mjs';
import { L112 } from './s11/b2-khach-my.mjs';
import { L113 } from './s11/b3-mui-gio-hop.mjs';
import { L114 } from './s11/b4-tinh-huong-kho.mjs';
import { L115 } from './s11/b5-lab.mjs';

const hai = (L) => L(true) + L(false);

const QUIZ11 = [
  Q('agl11-1', 'In a review, the Japanese customer says "検討します" (we will consider it) about your proposal, with no date. What do you write in the daily report?|||Trong buổi review, khách Nhật nói "検討します" (sẽ xem xét) về đề xuất của bạn, không kèm ngày. Bạn ghi gì vào báo cáo ngày?', [
    '"Customer approved the proposal"|||"Khách đã đồng ý đề xuất"',
    '"Not decided — kept Open with a follow-up date; nothing implemented"|||"Chưa quyết — để Open có ngày hỏi lại; chưa làm gì"',
    '"Customer rejected it, closed"|||"Khách từ chối, đã đóng"',
    '"Started implementing to save time"|||"Đã bắt đầu làm cho kịp"',
  ], 1, 'It is often a polite no; never plan on it. Keep it open, ask the BrSE, confirm with a closed question. Lesson 11.1.|||Thường là lời từ chối lịch sự; đừng lập kế hoạch dựa vào nó. Để Open, hỏi BrSE, chốt bằng câu hỏi đóng. Bài 11.1.'),
  Q('agl11-2', 'The customer writes "〜していただけると助かります" (it would help us if you could…) about adding the screen ID to every footer. This is…|||Khách viết "〜していただけると助かります" (nếu làm được… thì đỡ cho chúng tôi lắm) về việc thêm mã màn hình vào chân trang. Đây là…', [
    'A compliment, no action needed|||Một lời khen, không cần làm gì',
    'A request: record it with owner and date, and check scope|||Một yêu cầu: ghi lại có người và hạn, và kiểm phạm vi',
    'A rejection of your design|||Lời từ chối thiết kế của bạn',
    'Something only the BrSE needs to know|||Việc chỉ BrSE cần biết',
  ], 1, 'Polite form, real request. Lesson 11.1.|||Hình thức lịch sự, yêu cầu thật. Bài 11.1.'),
  Q('agl11-3', 'Which test step violates the common rule "Latin letters and digits half-width, katakana full-width"?|||Bước test nào phạm quy ước thường gặp "chữ Latin và số dùng bán góc, katakana dùng toàn góc"?', [
    'ID欄に123を入力する|||ID欄に123を入力する',
    'ログインボタンを押す|||ログインボタンを押す',
    'ＩＤ欄に１２３を入力する|||ＩＤ欄に１２３を入力する',
    '「登録」ボタンを押す|||「登録」ボタンを押す',
  ], 2, 'Full-width ＩＤ１２３; NFKC suggests ID123. Lesson 11.1.|||ＩＤ１２３ toàn góc; NFKC gợi ý ID123. Bài 11.1.'),
  Q('agl11-4', 'A US PM asks "The search is slow. Thoughts?" The strongest first reply is…|||PM Mỹ hỏi "Tìm kiếm chậm. Thoughts?" Câu trả lời đầu mạnh nhất là…', [
    '"Yes, I will fix it."|||"Vâng, em sẽ sửa."',
    'A recommendation first, then up to three options with effort and risk, and a decision deadline|||Khuyến nghị trước, rồi tối đa ba phương án có công sức và rủi ro, và hạn quyết',
    'A long explanation of how the search works|||Giải thích dài về cách tìm kiếm hoạt động',
    'Start rewriting the search with Elasticsearch|||Bắt đầu viết lại tìm kiếm bằng Elasticsearch',
  ], 1, 'BLUF + options + the decision stays with them. Lesson 11.2.|||BLUF + phương án + quyền quyết vẫn ở họ. Bài 11.2.'),
  Q('agl11-5', 'A friendly US "customer" asks you in chat to send the production database export "for the audit" today. You…|||Một "khách" Mỹ thân thiện nhắn chat nhờ bạn gửi bản xuất database production "để kiểm toán" ngay hôm nay. Bạn…', [
    'Send it — they are the customer|||Gửi — họ là khách mà',
    'Send it encrypted|||Gửi bản đã mã hoá',
    'Tell your PM and verify the request through a second, known channel before anything moves|||Báo PM và xác minh yêu cầu qua một kênh thứ hai đã biết trước khi chuyển bất cứ thứ gì',
    'Ignore it|||Lờ đi',
  ], 2, 'Typical BEC pattern: friendly, urgent, unusual. Lessons 11.2 and 10.6.|||Mẫu BEC điển hình: thân thiện, gấp, bất thường. Bài 11.2 và 10.6.'),
  Q('agl11-6', 'The weekly call is 09:00 New York every Monday. On Monday 9 March 2026 (day after the US switch to summer time) it is, in Hanoi…|||Họp tuần 09:00 New York mỗi thứ Hai. Thứ Hai 9/3/2026 (ngay sau khi Mỹ sang giờ mùa hè) giờ Hà Nội là…', [
    '21:00|||21:00', '20:00|||20:00', '22:00|||22:00', '19:00|||19:00',
  ], 1, '09:00 EDT = 13:00 UTC = 20:00 ICT (it was 21:00 the week before). Lesson 11.3.|||09:00 EDT = 13:00 UTC = 20:00 ICT (tuần trước là 21:00). Bài 11.3.'),
  Q('agl11-7', 'Which action item would the minutes checker accept?|||Việc cần làm nào bộ soát biên bản chấp nhận?', [
    '- [ ] Send the test spec soon|||- [ ] Gửi lại test spec sớm',
    '- [ ] Team will look into the export|||- [ ] Cả đội sẽ xem phần xuất tệp',
    '- [ ] Update DD 3.2 per D-1 @Minh 2026-11-25|||- [ ] Sửa DD 3.2 theo D-1 @Minh 2026-11-25',
    '- [ ] Fix TC-14 ASAP @Lan|||- [ ] Sửa TC-14 ASAP @Lan',
  ], 2, 'One owner and one YYYY-MM-DD date, no vague words. Lesson 11.3.|||Một người và một ngày YYYY-MM-DD, không từ mơ hồ. Bài 11.3.'),
  Q('agl11-8', 'Two days before delivery the customer asks to make a field optional. Your first step is…|||Hai ngày trước khi giao, khách xin cho một trường thành không bắt buộc. Bước đầu tiên của bạn là…', [
    'Say yes and change the code|||Nói được và sửa mã ngay',
    'Say no, the spec is frozen|||Nói không, spec đã đóng băng',
    'Acknowledge, then measure the impact on code, tests and documents before offering options|||Ghi nhận, rồi đo ảnh hưởng trên mã, test và tài liệu trước khi đưa phương án',
    'Wait until after delivery to reply|||Đợi giao xong mới trả lời',
  ], 2, 'In the lab a one-condition change broke 1 of 20 tests and touched DD + test spec. Lesson 11.4.|||Trong lab, sửa một điều kiện làm hỏng 1/20 test và chạm cả DD + test spec. Bài 11.4.'),
  Q('agl11-9', 'git bisect found the bad commit. Which command tells the customer which releases are affected?|||git bisect đã tìm ra commit xấu. Lệnh nào cho khách biết những bản phát hành nào bị ảnh hưởng?', [
    'git log --oneline|||git log --oneline',
    'git tag --contains COMMIT_SHA|||git tag --contains COMMIT_SHA',
    'git blame sdt.mjs|||git blame sdt.mjs',
    'git status|||git status',
  ], 1, 'Lists every tag whose history includes the commit. Lesson 11.4.|||Liệt kê mọi tag có commit đó trong lịch sử. Bài 11.4.'),
  Q('agl11-10', 'The "prevention" section of an incident report should end in…|||Mục "phòng tái diễn" của báo cáo sự cố nên kết thúc ở…', [
    'The name of the developer who made the mistake|||Tên developer gây lỗi',
    'A promise to be more careful|||Lời hứa sẽ cẩn thận hơn',
    'A change in the process: checklist item, test cases, review rule|||Một thay đổi quy trình: mục checklist, test case, luật review',
    'Nothing — the bug is fixed|||Không gì cả — đã sửa lỗi rồi',
  ], 2, 'Why-why analysis goes down to the process, not to a person. Lesson 11.4.|||Phân tích vì sao – vì sao đi xuống tới quy trình, không tới một con người. Bài 11.4.'),
];

const BAI = (so, en, vi, slug, desc, L) => ({ title: `11.${so} — ${en}|||11.${so} — ${vi}`, slug, type: 'LESSON', isFreePreview: true, description: desc, content: hai(L) });

export default {
  title: 'Chapter 11 — Working with Japanese and American clients|||Chương 11 — Làm việc với khách Nhật và khách Mỹ',
  description: 'Đọc đúng khách Nhật (lời từ chối gián tiếp, nemawashi, chi tiết toàn/bán góc và niên hiệu), làm việc với khách Mỹ/châu Âu (đề xuất chủ động, phản biện có lý lẽ), múi giờ và biên bản họp, xử lý đổi yêu cầu sát hạn, khách phàn nàn lỗi (git bisect + báo cáo sự cố) và yêu cầu ngoài phạm vi — kèm lab đóng vai năm cảnh có phiếu chấm.',
  lessons: [
    BAI(1, 'Japanese clients: quality, detail, the indirect "no", hourensou, nemawashi', 'Khách Nhật: chất lượng, chi tiết, lời từ chối gián tiếp, hourensou, nemawashi', 'agl-11-1-khach-nhat',
      'Ngữ cảnh cao/thấp, khách Nhật coi trọng gì, bảng câu từ chối gián tiếp (検討します, 難しい, ちょっと…), nemawashi/ringi, soát niên hiệu và toàn/bán góc bằng Node (chạy thật), Reiwa 2019, tự soát trước khi gửi, danh sách 指摘, Mizuho 2021, góc hacker PPAP.', L111),
    BAI(2, 'American and European clients: directness, proactive proposals, reasoned pushback', 'Khách Mỹ và châu Âu: thẳng thắn, chủ động đề xuất, phản biện có lý lẽ', 'agl-11-2-khach-my',
      'So sánh Nhật–Mỹ, đọc lời nhận xét theo văn hoá (Meyer), email phương án kiểu BLUF, phản biện bốn phần và disagree-and-commit, tin nhắn bất đồng bộ tự đủ ý, hợp đồng T&M, góc hacker BEC (FBI IC3 2024), demo là báo cáo tiến độ.', L112),
    BAI(3, 'Time zones, meeting minutes and confirming in writing', 'Múi giờ, biên bản họp và xác nhận bằng văn bản', 'agl-11-3-mui-gio-hop',
      'Múi giờ và DST 2026, tính giờ họp chung bằng Intl (chạy thật), lỗi ghi giờ cố định, ghi chú bàn giao cuối ngày, biên bản 議事録 và bộ soát biên bản 30 dòng (chạy thật), email xác nhận, góc hacker Zoom-bombing 2020.', L113),
    BAI(4, 'Hard situations: last-minute changes, angry bug reports, out-of-scope requests', 'Tình huống khó: đổi yêu cầu sát hạn, khách phàn nàn lỗi, yêu cầu ngoài phạm vi', 'agl-11-4-tinh-huong-kho',
      'Đo ảnh hưởng một thay đổi trên dự án lab 9.8 (chạy thật), trả lời có phương án, git bisect run + git tag --contains (chạy thật), báo cáo sự cố và なぜなぜ分析, sự cố TSE 2020, yêu cầu ngoài phạm vi và gold plating, khách giận, góc hacker sự gấp gáp.', L114),
    BAI(5, 'Lab: role-play a Japanese client review and an American client demo', 'Lab: đóng vai họp review với khách Nhật và demo với khách Mỹ', 'agl-11-5-lab',
      'Năm cảnh một tuần mô phỏng: tự soát + nemawashi, review khách Nhật (ghi âm + biên bản qua bộ soát), demo khách Mỹ + email phương án, lời phàn nàn + bisect + báo cáo sự cố, lịch họp hai múi giờ; phiếu chấm 100 điểm, bài mẫu.', L115),
    {
      title: '11.6 — Chapter 11 quiz|||11.6 — Kiểm tra Chương 11',
      slug: 'agl-11-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: 検討します, yêu cầu lịch sự, toàn/bán góc, trả lời "thoughts?", BEC, giờ họp sau DST, việc cần làm hợp lệ, đổi yêu cầu sát hạn, git tag --contains, phòng tái diễn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chương này. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ11 },
    },
  ],
};
