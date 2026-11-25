/**
 * 12.4 — Báo cáo cuối dự án dbg-cap: bộ chấm sau từng PR, bảng 10 lỗi, postmortem một trang cho LAB-1206, đưa vào hồ sơ thực tập.
 * Output thật: out/o-124-tung-pr.txt (tools/c12c.sh — dựng lại CSDL, biên dịch, chạy hai dịch vụ và kiem.mjs sau MỖI commit), o-124-kiem-sua.txt.
 */
import { SUA_DIFF } from './_ma-12.mjs';
import { TUNG_PR, LOG_STAT, KIEM_SUA } from './_ra-12.mjs';
import { lienKet, nguon } from '../_chung.mjs';
import { ma, ra, mo, song, bang, ds } from './_khung-12.mjs';

const BANG10 = (t) => bang(t, ['Ticket', t('Root cause (mechanism)', 'Nguyên nhân gốc (cơ chế)'), t('Found with', 'Tìm bằng'), t('Proof of fix', 'Bằng chứng đã sửa'), t('Lesson', 'Bài học')], [
  ['1201', t('<code>getQuanLy()</code> is null for new rooms; <code>thongKe()</code> dereferences it', 'phòng mới có <code>getQuanLy()</code> null; <code>thongKe()</code> gọi thẳng vào nó'), t('NPE message (JEP 358), exception breakpoint with Caught', 'thông điệp NPE (JEP 358), exception breakpoint bật Caught'), 'kiem #1', t('read the message first; the debugger can run SQL', 'đọc thông điệp trước; debugger có thể chạy SQL')],
  ['1202', t('1-based API passed to 0-based <code>PageRequest.of</code>', 'API đếm từ 1 truyền thẳng cho <code>PageRequest.of</code> đếm từ 0'), t('SQL log, OFFSET bound to 10', 'log SQL, OFFSET gán 10'), 'kiem #2', t('convert at one boundary', 'đổi ở đúng một ranh giới')],
  ['1203', t('preflight did not allow <code>X-Request-Id</code>', 'preflight không cho phép <code>X-Request-Id</code>'), t('Console + OPTIONS row, curl preflight', 'Console + dòng OPTIONS, curl preflight'), 'kiem #3', t('reproduce what the browser sends', 'tái hiện cái trình duyệt gửi')],
  ['1204', t('day cut with <code>toISOString()</code> (UTC)', 'cắt ngày bằng <code>toISOString()</code> (UTC)'), t('set comparison, AT TIME ZONE', 'so tập hợp, AT TIME ZONE'), 'kiem #4', t('equal totals prove nothing', 'tổng bằng nhau không chứng minh gì')],
  ['1205', t('lazy collection + lazy manager per room: 47 statements', 'mỗi phòng nạp lười collection + người quản lý: 47 câu'), t('pg_stat_statements, 2 ms latency proxy', 'pg_stat_statements, proxy trễ 2 ms'), t('kiem #5: 47 → 1', 'kiem #5: 47 → 1'), t('count round trips', 'đếm số lượt đi-về')],
  ['1206', t('check-then-insert without lock; first fix deadlocked on EXCLUDE', 'kiểm-rồi-ghi không khoá; bản sửa đầu deadlock trên EXCLUDE'), t('parallel script with warm-up, several rounds; PostgreSQL log', 'script song song có làm nóng, nhiều vòng; log PostgreSQL'), t('kiem #6, 8 rounds', 'kiem #6, 8 vòng'), t('a fix that passes once is not proven', 'bản sửa qua một lần chưa phải đã chứng minh')],
  ['1207', t('locks taken in parameter order', 'xin khoá theo thứ tự tham số'), t('pg_stat_activity + pg_blocking_pids, deadlock report', 'pg_stat_activity + pg_blocking_pids, báo cáo deadlock'), 'kiem #7', t('consistent lock order', 'thứ tự khoá nhất quán')],
  ['1208', t('setInterval per SSE connection never cleared', 'setInterval của mỗi kết nối SSE không bao giờ được dọn'), t('two heap snapshots, Comparison, Retainers', 'hai heap snapshot, Comparison, Retainers'), t('kiem #8: +300 → +0 timers', 'kiem #8: +300 → +0 hẹn giờ'), t('every open needs a close', 'mở gì cũng phải có đóng')],
  ['1209', t('10-minute cache, no invalidation from the owner', 'đệm 10 phút, chủ dữ liệu không báo huỷ'), t('curl -si, X-Cache header', 'curl -si, header X-Cache'), 'kiem #9', t('ask who tells the copy it is stale', 'hỏi ai báo cho bản sao là nó đã cũ')],
  ['1210', t('<code>&lt;</code> → <code>&lt;=</code> in a refactor (165b0d0)', '<code>&lt;</code> → <code>&lt;=</code> trong một refactor (165b0d0)'), t('git bisect run, exit 125 for wip commits', 'git bisect run, thoát 125 cho commit wip'), t('kiem #10 + lien-ke.test.mjs', 'kiem #10 + lien-ke.test.mjs'), t('bisect is as good as its test', 'bisect tốt bằng phép kiểm của nó')],
]);

const PM = `# Postmortem — LAB-1206: đặt trùng phòng khi mở đăng ký (dbg-cap 1.6.0)
Trạng thái: đã đóng · Người viết: <tên bạn> · Ngày: 24/11/2026 · Không đổ lỗi cho cá nhân

## Tóm tắt
Khi nhiều người đặt cùng một phòng, cùng khung giờ trong cùng một khoảnh khắc, dat-api xác nhận nhiều lượt cho một chỗ.
Bản sửa đầu (ràng buộc EXCLUDE) chặn được đặt trùng nhưng trả 500 thay vì 409 khi dồn request; bản sửa cuối thêm khoá tư vấn theo phòng.

## Ảnh hưởng (số đo thật trên bản tái hiện, labflow_cap)
- 20 request cùng lúc ⇒ 18 lượt được xác nhận cho một khung giờ (lần chạy khác: 16, 10, 20).
- Bản sửa đầu: 19/20 request trả 500 (40P01) ở lần chạy thứ hai; có request chờ 12–13 s.
- Migration thêm ràng buộc thất bại trên dữ liệu đã bẩn: "could not create exclusion constraint".

## Dòng thời gian (08:00–09:40 ngày 23/11 là kịch bản; ngày 24/11 là giờ của các lần chạy thật trên máy kiểm)
- 23/11 08:00 mở đăng ký tuần; 08:00:01 hai nhóm cùng nhận mã xác nhận Lab 22, thứ Hai 09:00–10:00.
- 23/11 09:40 thầy quản lý lab báo LAB-1206.
- 24/11 09:20 bộ kiểm 20 request song song chưa làm nóng: 1×201, 19×409 — race không lộ.
- 24/11 09:21 thêm bước làm nóng kết nối: 16×201 — tái hiện được.
- 24/11 09:33 dua.mjs: 18×201; thêm ràng buộc EXCLUDE trên dữ liệu đã bẩn ⇒ "could not create exclusion constraint".
- 24/11 09:40 bản sửa đầu (EXCLUDE + 409): lần 1 19×409, các lần sau 19×500; log PostgreSQL: hai INSERT chờ nhau ⇒ 40P01.
- 24/11 09:43 thêm pg_advisory_xact_lock theo phòng: 5/5 lần 1×201 + 19×409.
- 24/11 09:50 kiem #6 tăng từ 3 lên 8 vòng; bản sửa đầu bị bắt ở 2/3 lần chạy, bản cuối 8/8 vòng đúng.

## Nguyên nhân và các yếu tố góp phần
- Kiểm-rồi-ghi (SELECT rồi INSERT) không có gì ngăn request thứ hai giữa hai câu.
- CSDL không có ràng buộc nào cho "không chồng giờ trong một phòng" — mọi bảo đảm nằm ở mã ứng dụng.
- Test hiện có chạy tuần tự, kết nối chưa làm nóng ⇒ không bao giờ thấy race.
- Bản sửa đầu được kiểm bằng MỘT lần chạy; lỗi đồng thời có xác suất.
- Không có cảnh báo khi một khung giờ có > 1 lượt xác nhận.

## Hành động
| Việc | Người | Hạn |
|---|---|---|
| Ràng buộc EXCLUDE + khoá tư vấn theo phòng (đã xong, PR fix/LAB-1206) | Học viên | 24/11 |
| kiem #6 chạy 8 vòng trong CI cho mọi PR đụng dat-cho.mjs | Học viên | 26/11 |
| Truy vấn đêm: khung giờ có > 1 lượt xác nhận ⇒ cảnh báo kênh trực | Đội vận hành | 28/11 |
| Rà các đường ghi khác vào dat_cho (lich-api, script nhập) | Đội Java | 01/12 |

## Bài học
Bản sửa lỗi đồng thời phải được chứng minh bằng nhiều vòng có tải thật, và bảo đảm cuối cùng nên nằm trong CSDL.`;

const LIEN_KET = [
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-11-3-postmortem-nho', title: 'Bài 11.3 — Postmortem nhỏ', sub: 'Mẫu một trang, 5 Whys và chỗ nó dẫn sai.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'incident-response', bai: 'ir-14-4-postmortem-cuoi', title: 'Incident Response 14.4 — Postmortem cuối khoá', sub: 'Postmortem cho sự cố lớn, sau buổi diễn tập.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'interview-prep', bai: 'pv-10-3-nam-cau-chuyen', title: 'Interview Prep 10.3 — Năm câu chuyện STAR', sub: 'Biến LAB-1206 thành câu chuyện "lỗi khó nhất".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'tieng-anh-ky-thuat-di-lam', bai: 'tak-3-2-pr', title: 'Tiếng Anh kỹ thuật — Viết PR', sub: 'Mô tả PR bằng tiếng Anh cho khách nước ngoài.', cta: 'Mở bài →' }),
].join('\n');

const noiDung = song((t) => `
<span class="eyebrow">${t('Chapter 12 · Write-up', 'Chương 12 · Tổng kết')}</span>
<h2>${t('Ten fixes are a result; the write-up is what people remember', 'Mười bản sửa là kết quả; phần tổng kết mới là thứ người ta nhớ')}</h2>
<p class="lead">${t(
  'Your lead will not read ten journals. They read one table, one postmortem, and a commit history that proves every PR did exactly one thing. This lesson shows all three for the reference solution, generated from real runs.',
  'Trưởng nhóm sẽ không đọc mười cuốn nhật ký. Họ đọc một bảng, một postmortem, và một lịch sử commit chứng minh mỗi PR làm đúng một việc. Bài này cho cả ba của lời giải mẫu, sinh ra từ các lần chạy thật.')}</p>

<h3>${t('Proof that every PR fixed one thing', 'Bằng chứng mỗi PR sửa đúng một thứ')}</h3>
<p>${t(
  '<code>tools/c12c.sh</code> checks out each commit of the reference solution, rebuilds the database (schema + seed + that commit\'s migrations), compiles lich-api, starts both services and runs the grader. One column per bug, X = green:',
  '<code>tools/c12c.sh</code> checkout từng commit của lời giải mẫu, dựng lại CSDL (schema + seed + migration của commit đó), biên dịch lich-api, chạy hai dịch vụ rồi chạy bộ chấm. Mỗi lỗi một cột, X = xanh:')}</p>
${ra(TUNG_PR)}
<p>${t(
  'Read it like a reviewer: each row adds exactly one X and no X ever disappears — no PR broke another bug\'s check. The first LAB-1206 commit is the version that deadlocks under load: in this run its column stayed red; in one of three earlier runs the 8-round check let it pass. That is the whole point of the postmortem below.',
  'Đọc như người review: mỗi dòng thêm đúng một X và không X nào biến mất — không PR nào làm hỏng phép kiểm của lỗi khác. Commit LAB-1206 đầu tiên là bản deadlock khi dồn tải: ở lần chạy này cột của nó vẫn đỏ; trong ba lần chạy trước đó, có một lần phép kiểm 8 vòng để nó qua. Đó chính là chuyện của postmortem bên dưới.')}</p>
${ra(LOG_STAT)}
<p>${t('The grader on the final fixed build:', 'Bộ chấm trên bản sửa cuối:')}</p>
${ra(KIEM_SUA)}
${mo(t('sua.diff — every change, release → fixed', 'sua.diff — mọi thay đổi, bản phát hành → bản sửa'), ma(SUA_DIFF, 'diff'))}

<h3>${t('The final table', 'Bảng tổng kết')}</h3>
<p>${t('One row per ticket. "Root cause" is a mechanism a stranger can verify, not "wrong code".', 'Mỗi ticket một dòng. "Nguyên nhân gốc" là một cơ chế người lạ kiểm lại được, không phải "code sai".')}</p>
${BANG10(t)}
<p>${t('Add your own two columns: time spent (vs the budget in 12.1) and the hypothesis you tested first. Where the first hypothesis was wrong is the most useful information in the whole table — it tells you which instinct to retrain.', 'Thêm hai cột của riêng bạn: thời gian đã dùng (so với quỹ giờ ở 12.1) và giả thuyết bạn kiểm đầu tiên. Chỗ giả thuyết đầu sai là thông tin quý nhất của cả bảng — nó cho biết phản xạ nào cần luyện lại.')}</p>

<h3>${t('A one-page postmortem for the hardest bug', 'Postmortem một trang cho lỗi khó nhất')}</h3>
<p>${t(
  'LAB-1206 is the hardest not because the code is long but because the first fix looked correct. Measured facts come from the runs in 12.3; the registration times are the scenario. Format from lesson 11.3: numbers, timed events, several contributing factors, owned actions, no blame.',
  'LAB-1206 khó nhất không vì mã dài mà vì bản sửa đầu trông như đúng. Các số đo lấy từ lần chạy ở 12.3; giờ mở đăng ký là kịch bản. Định dạng theo bài 11.3: có số, có mốc giờ, nhiều yếu tố góp phần, hành động có người nhận, không đổ lỗi.')}</p>
${ma(PM, 'markdown')}

<h3>${t('Putting it in your OJT portfolio', 'Đưa vào hồ sơ OJT')}</h3>
${ds(t, [
  [`<strong>A README at the top of your fork</strong>: the table above, a link to each PR, the grader output before/after. Recruiters spend under a minute — the table is the minute.`, `<strong>README ở đầu bản fork của bạn</strong>: bảng ở trên, liên kết tới từng PR, output bộ chấm trước/sau. Người tuyển dụng dành chưa tới một phút — cái bảng chính là phút đó.`],
  [`<strong>CV bullets with numbers</strong>: "Diagnosed and fixed 10 seeded bugs in a Spring Boot + Node + PostgreSQL app; cut a room list from 47 SQL statements to 1 (0.24 s → 0.013 s over a 4 ms link); eliminated double booking under 20 concurrent requests with an exclusion constraint and per-room advisory locks."`, `<strong>Gạch đầu dòng CV có số</strong>: "Chẩn đoán và sửa 10 lỗi cài sẵn trong ứng dụng Spring Boot + Node + PostgreSQL; giảm danh sách phòng từ 47 câu SQL còn 1 (0,24 s → 0,013 s qua đường mạng 4 ms); loại bỏ đặt trùng dưới 20 request đồng thời bằng ràng buộc loại trừ và khoá tư vấn theo phòng."`],
  [`<strong>One story ready</strong> in STAR form — LAB-1206 (lesson 12.5 has the model answer).`, `<strong>Một câu chuyện sẵn sàng</strong> theo STAR — LAB-1206 (bài 12.5 có câu trả lời mẫu).`],
  [`<strong>Honesty line</strong>: say these were seeded bugs in a training app. Interviewers respect it; pretending it was production does not survive the second question.`, `<strong>Một dòng trung thực</strong>: nói rõ đây là lỗi cài sẵn trong ứng dụng luyện tập. Người phỏng vấn tôn trọng điều đó; giả vờ là production thì không qua nổi câu hỏi thứ hai.`],
])}

<h3>🎤 ${t('What an interviewer will ask', 'Phỏng vấn viên sẽ hỏi')}</h3>
${ds(t, [
  [`<strong>"How do you show a reviewer that your PR fixes only what it claims?"</strong> One bug per PR, a failing test or check first, and the full suite green before and after — like the table where each commit adds one X.`, `<strong>"Làm sao cho người review thấy PR chỉ sửa đúng điều nó nói?"</strong> Mỗi PR một lỗi, test hoặc phép kiểm đỏ trước, và cả bộ kiểm xanh trước và sau — như bảng mà mỗi commit thêm đúng một X.`],
  [`<strong>"Your fix passed the test, then failed in production. What happened?"</strong> Probably a concurrency or data-dependent bug tested once. Reproduce under realistic load several times, and move the guarantee into the database.`, `<strong>"Bản sửa qua test rồi hỏng trên production. Chuyện gì đã xảy ra?"</strong> Nhiều khả năng là lỗi đồng thời hoặc phụ thuộc dữ liệu chỉ được kiểm một lần. Tái hiện với tải thật nhiều lần, và đẩy bảo đảm xuống CSDL.`],
  [`<strong>"What goes in a postmortem for a bug nobody outside the team saw?"</strong> The same as for an outage, shorter: impact with numbers, timeline, contributing factors, actions with owners — the point is the system change, not the drama.`, `<strong>"Postmortem cho một lỗi người ngoài đội không ai thấy thì ghi gì?"</strong> Giống như cho một sự cố sập, ngắn hơn: ảnh hưởng có số, dòng thời gian, các yếu tố góp phần, hành động có người nhận — mục tiêu là thay đổi hệ thống, không phải kể chuyện.`],
], 'ol')}

${LIEN_KET}
${nguon('📘', 'Google SRE Book — Postmortem Culture', 'Postmortem không đổ lỗi.', 'https://sre.google/sre-book/postmortem-culture/')}
`);

export default {
  title: '12.4 — Final report and a postmortem for the hardest bug|||12.4 — Báo cáo cuối và postmortem cho lỗi khó nhất',
  slug: 'dbg-12-4-bao-cao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bộ chấm chạy sau TỪNG commit của lời giải mẫu (dựng lại CSDL, biên dịch, khởi động hai dịch vụ): mỗi PR thêm đúng một dòng xanh, không dòng nào đỏ lại. Bảng 10 lỗi (cơ chế, công cụ, bằng chứng, bài học), postmortem một trang cho LAB-1206 — bản sửa đầu qua một lần rồi deadlock — và cách đưa dự án vào hồ sơ OJT bằng README, gạch đầu dòng CV có số, một câu chuyện STAR.',
  content: noiDung,
};
