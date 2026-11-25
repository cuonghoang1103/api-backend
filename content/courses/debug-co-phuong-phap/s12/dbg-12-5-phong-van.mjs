/**
 * 12.5 — Câu hỏi phỏng vấn về gỡ lỗi (kèm gợi ý trả lời). Câu chuyện STAR lấy từ LAB-1206 của dự án cuối khoá (số đo thật ở 12.3).
 */
import { O1_LOG } from './_ra-12.mjs';
import { lienKet } from '../_chung.mjs';
import { ra, mo, song, ds, bang } from './_khung-12.mjs';

const CAU = (t) => [
  [t('"Tell me about the hardest bug you have fixed."', '"Kể về lỗi khó nhất bạn từng sửa."'),
    t(`<p><strong>S</strong> — In my debugging capstone (a training app with seeded bugs: Spring Boot + Node + PostgreSQL), two groups got confirmations for the same lab slot when registration opened.</p>
<p><strong>T</strong> — I owned the ticket: reproduce, fix, prove it.</p>
<p><strong>A</strong> — Clicking twice never reproduced it. I wrote a script firing 20 requests at once; still nothing until I warmed the connections like a real server — then 18 of 20 were confirmed. I added an exclusion constraint; the migration failed on the duplicates, so I cleaned data first. My first fix passed once, and on the second run 19 requests returned 500: the PostgreSQL log showed concurrent INSERTs deadlocking on the constraint. I added a per-room advisory lock and made the check run eight rounds.</p>
<p><strong>R</strong> — 1 confirmation and 19 clean "slot taken" replies in every round; the check runs on every PR. What I took away: a concurrency fix that passes once is not proven.</p>`,
      `<p><strong>S</strong> — Trong dự án cuối khoá gỡ lỗi (một ứng dụng luyện tập có lỗi cài sẵn: Spring Boot + Node + PostgreSQL), khi mở đăng ký, hai nhóm cùng nhận xác nhận cho một khung giờ phòng lab.</p>
<p><strong>T</strong> — Em nhận ticket đó: tái hiện, sửa, chứng minh.</p>
<p><strong>A</strong> — Bấm tay hai lần không bao giờ ra lỗi. Em viết script bắn 20 request cùng lúc; vẫn chưa ra, cho tới khi em làm nóng kết nối như một server thật — lúc đó 18/20 lượt được xác nhận. Em thêm ràng buộc loại trừ; migration lỗi vì dữ liệu đã trùng, nên phải dọn dữ liệu trước. Bản sửa đầu qua một lần, tới lần chạy thứ hai thì 19 request trả 500: log PostgreSQL cho thấy các INSERT cùng lúc deadlock trên ràng buộc. Em thêm khoá tư vấn theo phòng và cho phép kiểm chạy tám vòng.</p>
<p><strong>R</strong> — Mọi vòng đều 1 xác nhận và 19 phản hồi "đã có người đặt" đúng chuẩn; phép kiểm chạy cho mọi PR. Điều em rút ra: bản sửa lỗi đồng thời qua một lần thì chưa phải đã chứng minh.</p>`)],
  [t('"A bug only happens in production. What do you do?"', '"Một lỗi chỉ xảy ra trên production. Bạn làm gì?"'),
    t('Read-only first: logs by request id, metrics, the running version (/health). Do not attach a debugger that pauses threads. Build a reproduction from what differs — data, concurrency, time zone, network distance, configuration. Mitigate with a flag or rollback if users are hurt, then fix with a test. (Chapter 10.)',
      'Chỉ đọc trước: log theo request id, số đo, phiên bản đang chạy (/health). Không gắn debugger làm dừng luồng. Dựng bản tái hiện từ những gì khác biệt — dữ liệu, đồng thời, múi giờ, khoảng cách mạng, cấu hình. Nếu người dùng đang bị ảnh hưởng thì giảm thiểu bằng cờ hoặc rollback trước, rồi sửa kèm test. (Chương 10.)')],
  [t('"What does this NullPointerException mean?" (they show a log line)', '"NullPointerException này nghĩa là gì?" (họ đưa một dòng log)'),
    t('Read the message to the end: since Java 14 it names the expression that was null. Example from the capstone — the frame is PhongService.java:34 and the null value came from getQuanLy(), i.e. a room without a manager:',
      'Đọc thông điệp tới hết: từ Java 14 nó nêu biểu thức bị null. Ví dụ từ dự án cuối khoá — frame là PhongService.java:34 và giá trị null đến từ getQuanLy(), tức một phòng chưa có người quản lý:')],
  [t('"How do you use a debugger?"', '"Bạn dùng debugger thế nào?"'),
    t('With a hypothesis, not to browse. Conditional breakpoints and logpoints instead of stepping a loop; exception breakpoints with Caught when the framework swallows it; evaluate expressions to test the hypothesis; attach to a running JVM/Node with the port bound to 127.0.0.1 only. I remember the debugger can change state — printing a lazy collection runs SQL.',
      'Có giả thuyết rồi mới dùng, không lướt xem. Breakpoint có điều kiện và logpoint thay vì bước qua cả vòng lặp; exception breakpoint bật Caught khi framework nuốt ngoại lệ; evaluate biểu thức để kiểm giả thuyết; gắn vào JVM/Node đang chạy với cổng chỉ bind 127.0.0.1. Em nhớ debugger có thể làm đổi trạng thái — in một collection lười là chạy SQL.')],
  [t('"You cannot reproduce the bug. Now what?"', '"Bạn không tái hiện được lỗi. Giờ sao?"'),
    t('List what differs between the report and my attempt (account, data, time, version, browser, concurrency) and change one at a time. Ask the reporter for request id, HAR or exact steps. If still nothing, add targeted logging and say so honestly in the ticket instead of closing "cannot reproduce".',
      'Liệt kê những gì khác giữa bản báo và lần thử của mình (tài khoản, dữ liệu, thời điểm, phiên bản, trình duyệt, đồng thời) và đổi từng thứ một. Xin người báo request id, HAR hoặc các bước chính xác. Vẫn không ra thì thêm log có chủ đích và ghi thẳng điều đó vào ticket, thay vì đóng "không tái hiện được".')],
  [t('"The API is slow. How do you start?"', '"API chậm. Bạn bắt đầu từ đâu?"'),
    t('Where is the time: client, network, app, database? Then count, do not guess: statements per request (pg_stat_statements, SQL log), EXPLAIN ANALYZE for the slow one. The capstone room list ran 47 statements; 2 ms of latency made it 0.24 s.',
      'Thời gian nằm ở đâu: client, mạng, ứng dụng, CSDL? Rồi đếm, đừng đoán: số câu SQL mỗi request (pg_stat_statements, log SQL), EXPLAIN ANALYZE cho câu chậm. Danh sách phòng ở dự án cuối khoá chạy 47 câu; 2 ms trễ làm nó thành 0,24 s.')],
  [t('"When do you ask a senior for help?"', '"Khi nào bạn hỏi người đi trước?"'),
    t('After a time box (for me: twice my estimate), with my journal: the reproduction, what I tested and ruled out, and one specific question. Never "it doesn\'t work, can you look?".',
      'Sau một khoảng thời gian định trước (với em: gấp đôi ước lượng), kèm nhật ký: bản tái hiện, những gì đã kiểm và loại trừ, và một câu hỏi cụ thể. Không bao giờ là "nó không chạy, anh xem giúp em?".')],
];

const REVIEW = (t) => bang(t, [t('The lead asks', 'Trưởng nhóm hỏi'), t('A good answer points to', 'Câu trả lời tốt chỉ vào')], [
  [t('"How do I know this is the root cause and not a symptom?"', '"Sao anh biết đây là nguyên nhân gốc chứ không phải triệu chứng?"'), t('the mechanism + evidence (log line, SQL count, heap retainers)', 'cơ chế + bằng chứng (dòng log, số câu SQL, retainers của heap)')],
  [t('"Where is the test that fails without your change?"', '"Test nào hỏng nếu không có thay đổi của em?"'), t('the red run pasted in the PR', 'lần chạy đỏ dán trong PR')],
  [t('"Are there other places with the same pattern?"', '"Còn chỗ nào khác có cùng kiểu này không?"'), t('a grep / search you ran (e.g. other check-then-insert paths)', 'lệnh grep/tìm em đã chạy (ví dụ các đường kiểm-rồi-ghi khác)')],
  [t('"What happens to data that is already wrong?"', '"Dữ liệu đã sai rồi thì sao?"'), t('the data fix / migration plan (LAB-1206 duplicates)', 'kế hoạch sửa dữ liệu / migration (các lượt trùng của LAB-1206)')],
  [t('"How would we notice if it came back?"', '"Nếu nó quay lại thì mình biết bằng cách nào?"'), t('the regression test in CI, an alert or a nightly query', 'test chặn tái phát trong CI, một cảnh báo hoặc truy vấn hằng đêm')],
]);

const noiDung = song((t) => `
<span class="eyebrow">${t('Chapter 12 · Interview', 'Chương 12 · Phỏng vấn')}</span>
<h2>${t('Debugging questions are where juniors can stand out', 'Câu hỏi gỡ lỗi là chỗ người mới có thể nổi bật')}</h2>
<p class="lead">${t(
  'Interviewers for intern and junior roles cannot test years of experience, so they test how you think when something breaks. Every answer below is built from something you did in this course — answer with your own numbers, not these.',
  'Người phỏng vấn vị trí thực tập và junior không kiểm được nhiều năm kinh nghiệm, nên họ kiểm cách bạn nghĩ khi có gì đó hỏng. Mọi câu trả lời dưới đây đều dựng từ việc bạn đã làm trong khoá này — hãy trả lời bằng số của chính bạn, không phải số ở đây.')}</p>

<h3>${t('Seven questions with model answers', 'Bảy câu hỏi kèm câu trả lời mẫu')}</h3>
<p>${t('Say your answer aloud first (≤ 2 minutes, STAR for the first one), then open the model.', 'Tự nói câu trả lời thành tiếng trước (≤ 2 phút, câu đầu theo STAR), rồi mới mở câu mẫu.')}</p>
${CAU(t).map(([h, d], i) => mo(`${i + 1}. ${h}`, i === 2 ? `<p>${d}</p>\n${ra(O1_LOG)}` : (i === 0 ? d : `<p>${d}</p>`))).join('\n')}

<h3>${t('Questions a lead asks when reviewing your bug-fix PR', 'Câu trưởng nhóm hỏi khi review PR sửa lỗi của bạn')}</h3>
${REVIEW(t)}

<h3>${t('Common mistakes in answers', 'Lỗi hay gặp khi trả lời')}</h3>
${ds(t, [
  [`"We fixed it" — say <strong>I</strong> and what you did.`, `"Bọn em sửa được" — hãy nói <strong>em</strong> và việc em đã làm.`],
  [`"I added a try/catch" — catching is not fixing; say what was wrong.`, `"Em thêm try/catch" — bắt ngoại lệ không phải sửa; hãy nói cái gì sai.`],
  [`"I used console.log everywhere" — fine for a start, but name the next tool you would reach for.`, `"Em console.log khắp nơi" — khởi đầu thì được, nhưng hãy nói công cụ kế tiếp em sẽ dùng.`],
  [`No number at all. One measured number (47 → 1 statements, 18 → 1 bookings) beats three adjectives.`, `Không có con số nào. Một con số đo được (47 → 1 câu SQL, 18 → 1 lượt đặt) hơn ba tính từ.`],
])}

<h3>${t('Practice', 'Luyện tập')}</h3>
<p>${t('Record yourself answering questions 1, 2 and 4 (phone camera is enough). Watch it once: did you say a number? did you say "I"? did you finish under two minutes? Then do a full mock with a friend using the scoring sheet in Interview Prep 3.5.', 'Quay lại cảnh mình trả lời câu 1, 2 và 4 (camera điện thoại là đủ). Xem lại một lần: có nói con số không? có nói "em" không? có xong dưới hai phút không? Rồi phỏng vấn thử trọn vẹn với một người bạn, dùng phiếu chấm ở Interview Prep 3.5.')}</p>

${[
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-2-star', title: 'Interview Prep 2.2 — STAR từ dự án của bạn', sub: 'Cấu trúc, "em" thay vì "bọn em", con số.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'interview-prep', bai: 'pv-3-4-ngan-hang', title: 'Interview Prep 3.4 — 30 câu hỏi hành vi', sub: 'Khung trả lời cho từng câu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'interview-prep', bai: 'pv-3-5-lab-mock-hanh-vi', title: 'Interview Prep 3.5 — Phỏng vấn thử 30 phút', sub: 'Kịch bản và phiếu chấm.', cta: 'Mở bài →' }),
].join('\n')}
`);

export default {
  title: '12.5 — Interview questions on debugging (with model answers)|||12.5 — Câu hỏi phỏng vấn về gỡ lỗi (kèm gợi ý trả lời)',
  slug: 'dbg-12-5-phong-van',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảy câu phỏng vấn gỡ lỗi kèm câu trả lời mẫu dựng từ chính khoá học: "lỗi khó nhất" theo STAR (LAB-1206 — 18/20 lượt đặt trùng, bản sửa đầu deadlock), lỗi chỉ có trên production, đọc NPE, dùng debugger, không tái hiện được, API chậm, khi nào hỏi người đi trước; năm câu trưởng nhóm hỏi khi review PR sửa lỗi; lỗi hay gặp khi trả lời và cách tự luyện.',
  content: noiDung,
};
