/**
 * 12.1 — Đề bài dự án cuối khoá: ứng dụng dbg-cap (LabFlow: Spring Boot + Node + React + PostgreSQL), 10 bug report, luật chơi, cách chấm.
 * Soạn 24/11/2026 trên máy nhà Linux. Mọi output là THẬT — scratchpad/dbg/lab/ch12 (cap/ = bản lỗi, cap-sua/ = bản sửa, out/ = output).
 */
import { CHAY, SCHEMA, SEED, KIEM, API_JS, APP_NODE } from './_ma-12.mjs';
import { KIEM_LOI, O3_WEB, CHAY_RA } from './_ra-12.mjs';
import { lienKet, nguon } from '../_chung.mjs';
import { ma, ra, mo, song, bang, ds } from './_khung-12.mjs';

export const TICKET = (t) => [
  ['LAB-1201', t('QA (Hằng), staging 1.6.0', 'QA (Hằng), staging 1.6.0'),
    t('Room detail page for "Lab 7" shows "Something went wrong: HTTP 500". "Lab 3" is fine. "Lab 19" also fails.',
      'Trang chi tiết phòng "Lab 7" hiện "Có lỗi xảy ra: HTTP 500". "Lab 3" bình thường. "Lab 19" cũng lỗi.')],
  ['LAB-1202', t('Student (Sinh viên 03), feedback form', 'Sinh viên 03, qua form góp ý'),
    t('"My bookings" does not show my newest booking (13/12, 07:30, Lab 1). I clicked Next to page 7 and it is empty.',
      '"Lịch của tôi" không thấy lịch mới nhất của em (13/12, 07:30, Lab 1). Bấm "Sau" tới trang 7 thì trống trơn.')],
  ['LAB-1203', t('PM, right after deploying web 1.6', 'PM, ngay sau khi deploy web 1.6'),
    t('Rooms page says "Failed to fetch", the Book button says "Cannot reach the server". The developer says Postman calls the API fine.',
      'Trang Phòng báo "Failed to fetch", nút Đặt báo "Không kết nối được máy chủ". Dev nói gọi API bằng Postman vẫn được.')],
  ['LAB-1204', t('Academic office', 'Phòng đào tạo'),
    t('The daily report for 01/12 says 96 bookings — the same number as the schedule screen — but the list contains six 06:30 bookings of 02/12 and is missing six 06:30 bookings of 01/12.',
      'Báo cáo ngày 01/12 ghi 96 lượt — đúng bằng con số ở màn Lịch — nhưng danh sách có 6 lượt ca 06:30 của ngày 02/12 và thiếu 6 lượt ca 06:30 của chính ngày 01/12.')],
  ['LAB-1205', t('Tech lead', 'Trưởng nhóm kỹ thuật'),
    t('On staging (database on another machine) GET /api/phong takes about 0.24 s; on developer laptops it is a few tens of ms. We have 24 rooms now, 120 next semester.',
      'Trên staging (CSDL ở máy khác) GET /api/phong mất khoảng 0,24 s; trên máy dev chỉ vài chục ms. Hiện có 24 phòng, học kỳ sau 120 phòng.')],
  ['LAB-1206', t('Lab manager (lecturer)', 'Thầy quản lý phòng lab'),
    t('Monday 09:00–10:00 in Lab 22: two groups both have a confirmation code. Registration opened at 08:00 and many students clicked at the same moment.',
      'Lab 22, thứ Hai 09:00–10:00: hai nhóm đều có mã xác nhận. Đăng ký mở lúc 08:00 và rất nhiều bạn bấm cùng một lúc.')],
  ['LAB-1207', t('Alert from the log pipeline', 'Cảnh báo từ hệ thống log'),
    t('"Swap time slots" sometimes returns 500. The log says "deadlock detected". Nobody can reproduce it by clicking.',
      '"Đổi giờ" thỉnh thoảng trả 500. Log có "deadlock detected". Bấm tay không ai tái hiện được.')],
  ['LAB-1208', t('Operations', 'Vận hành'),
    t('dat-api memory grows steadily, about 40 MB a day; a restart "fixes" it. Last week the container was OOMKilled. No unusual traffic.',
      'Bộ nhớ dat-api tăng đều, khoảng 40 MB mỗi ngày; khởi động lại là "hết". Tuần trước container bị OOMKilled. Không có tải bất thường.')],
  ['LAB-1209', t('Admin', 'Quản trị viên'),
    t('Renamed "Lab 21" to "Lab 21 — Mac room" in the admin page (lich-api) at 10:02; at 10:10 the students\' Rooms page still shows the old name. Ctrl+F5 does not help.',
      'Đổi tên "Lab 21" thành "Lab 21 — Phòng máy Mac" ở trang quản trị (lich-api) lúc 10:02; tới 10:10 trang Phòng của sinh viên vẫn hiện tên cũ. Ctrl+F5 không đỡ.')],
  ['LAB-1210', t('Student', 'Sinh viên'),
    t('Since 1.6 I cannot book back-to-back slots: I have 10:00–11:00 and booking 11:00–12:00 says "Room already booked for this slot". It worked last semester (1.4).',
      'Từ bản 1.6 không đặt được ca liền kề: đã có 10:00–11:00, đặt tiếp 11:00–12:00 bị báo "Phòng đã có người đặt khung giờ này". Kỳ trước (bản 1.4) vẫn đặt được.')],
];

const NHAT_KY = `# LAB-12xx — &lt;triệu chứng, một dòng&gt;
Bắt đầu: 24/11 14:05 · Xong: 24/11 15:20 (75 phút)

## 1. Tái hiện (một lệnh, tự kiểm — thoát ≠ 0 khi lỗi còn)
\`\`\`bash
curl -s -o /dev/null -w '%{http_code}' 127.0.0.1:41201/api/phong/7/thong-ke | grep -qx 200
\`\`\`
Tần suất: 10/10 lần · Chỉ phòng 7 và 19 (truy vấn: SELECT id FROM phong WHERE quan_ly_id IS NULL)

## 2. Khoanh vùng
Tầng: web → lich-api → CSDL. Gọi thẳng lich-api bằng curl vẫn 500 ⇒ không phải web.

## 3. Giả thuyết → cách kiểm → kết quả
| # | Giả thuyết | Kiểm bằng | Kết quả |
|---|---|---|---|
| 1 | Phòng 7 bị xoá | psql: SELECT * FROM phong WHERE id = 7 | Sai — có dòng |
| 2 | quan_ly_id NULL làm hỏng | log: "because … getQuanLy() is null" | Đúng |

## 4. Nguyên nhân gốc (cơ chế, không phải "code sai")
## 5. Bản sửa (PR nhỏ: fix/LAB-12xx, diff ≤ ~30 dòng) + vì sao đúng
## 6. Test chặn tái phát — đã thấy ĐỎ trên mã cũ, XANH trên mã mới (dán output cả hai)
## 7. Bài học (một câu) · Kỹ thuật đã dùng`;

const KIEM_GI = (t) => bang(t, ['#', t('What the grader does', 'Bộ chấm làm gì'), t('Green when', 'Xanh khi')], [
  ['1', t('GET thong-ke for every room whose quan_ly_id is NULL', 'GET thong-ke cho mọi phòng có quan_ly_id NULL'), t('200 and quanLy = null', '200 và quanLy = null')],
  ['2', t('page 1 vs the newest booking in SQL; walks every page', 'so trang 1 với lượt mới nhất trong SQL; đi hết mọi trang'), t('page 1 starts at the newest; pages cover all bookings exactly once', 'trang 1 bắt đầu ở lượt mới nhất; các trang phủ đủ mọi lượt, không trùng')],
  ['3', t('preflight OPTIONS like Chrome sends, with Origin + x-request-id', 'gửi preflight OPTIONS như Chrome, có Origin + x-request-id'), t('origin, method and both headers allowed', 'cho phép origin, method và cả hai header')],
  ['4', t('report ids vs SQL grouped by Vietnam date', 'so ids của báo cáo với SQL nhóm theo ngày giờ VN'), t('no missing, no extra', 'không thiếu, không thừa')],
  ['5', t('pg_stat_statements_reset(), one GET /api/phong, count SQL', 'pg_stat_statements_reset(), một lần GET /api/phong, đếm câu SQL'), t('≤ 3 statements', '≤ 3 câu')],
  ['6', t('3 rounds × 20 simultaneous POST /dat-cho for the same slot', '3 vòng × 20 POST /dat-cho cùng lúc cho cùng khung giờ'), t('every round: one 201, nineteen 409, one row', 'mọi vòng: một 201, mười chín 409, một dòng')],
  ['7', t('40 simultaneous swaps a⇄b and b⇄a', '40 lượt đổi giờ a⇄b và b⇄a cùng lúc'), t('all 200', 'cả 40 trả 200')],
  ['8', t('via the inspector: count live timers, open+close 300 SSE connections, count again', 'qua inspector: đếm bộ hẹn giờ còn sống, mở rồi đóng 300 kết nối SSE, đếm lại'), t('grows by < 5', 'tăng < 5')],
  ['9', t('read room 21 through dat-api, rename it in lich-api, read again 1.5 s later', 'đọc phòng 21 qua dat-api, đổi tên ở lich-api, 1,5 s sau đọc lại'), t('new name', 'thấy tên mới')],
  ['10', t('book 10:00–11:00 then 11:00–12:00', 'đặt 10:00–11:00 rồi 11:00–12:00'), t('both 201', 'cả hai 201')],
]);

const LIEN_KET = [
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-5-lab', title: 'Bài 1.5 — Lab: Năm lỗi nhỏ, mỗi lỗi một nhật ký gỡ lỗi', sub: 'Nơi bạn viết nhật ký gỡ lỗi lần đầu — mẫu ở bài này là bản đầy đủ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-11-4-lab', title: 'Bài 11.4 — Lab: Báo cáo, ghi bản sửa, postmortem', sub: 'Bộ chấm bằng máy cùng kiểu: chạy khối tái hiện trên bản lỗi và bản sửa.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'interview-prep', bai: 'pv-2-2-star', title: 'Interview Prep 2.2 — Câu chuyện STAR từ dự án của chính bạn', sub: 'Dự án này là nguồn câu chuyện "lỗi khó nhất tôi từng sửa".', cta: 'Mở bài →' }),
].join('\n');

const SO_DO = `            trình duyệt  http://localhost:41200   (React 19 + Vite)
              │  fetch + X-Request-Id            │  fetch + X-Request-Id
              ▼                                  ▼
   dat-api  127.0.0.1:41202  (Node 22)     lich-api  127.0.0.1:41201  (Spring Boot 4.1, Java 25)
   đặt chỗ · báo cáo ngày · /phong (đệm)   phòng · thống kê · lịch sử · đổi giờ
   /su-kien (SSE) · inspector :41209       JDWP :45005
              │  pg 8.23                         │  Hibernate 7 + HikariCP
              └──────────────► PostgreSQL 16  127.0.0.1:45432  (dbg-pg, labflow_cap) ◄──┘
                               pg_stat_statements · log_lock_waits · deadlock_timeout = 1 s`;

const noiDung = song((t) => `
<span class="eyebrow">${t('Chapter 12 · Capstone', 'Chương 12 · Dự án cuối khoá')}</span>
<h2>${t('Ten bugs, one app, and the method you have practised for eleven chapters', 'Mười lỗi, một ứng dụng, và phương pháp bạn đã luyện suốt mười một chương')}</h2>
<p class="lead">${t(
  'This is the closest thing to your first month at an outsourcing company: an app you did not write, three services in two languages, and a queue of tickets written by people who do not know where the bug is. Every bug here really exists in the code — the grader proves it by turning red on the shipped version and green on the reference fix.',
  'Đây là thứ gần nhất với tháng đầu tiên của bạn ở một công ty outsourcing: một ứng dụng bạn không viết, ba dịch vụ bằng hai ngôn ngữ, và một hàng ticket do những người không biết lỗi nằm đâu viết ra. Mỗi lỗi ở đây đều có thật trong mã — bộ chấm chứng minh điều đó bằng cách báo ĐỎ trên bản đang phát hành và XANH trên bản sửa mẫu.')}</p>

<h3>${t('The app: LabFlow, booking university lab rooms', 'Ứng dụng: LabFlow, đặt lịch phòng lab của trường')}</h3>
<p>${t(
  'Same domain as the labs of earlier chapters, but now as a small system: a React web app talks to <strong>two</strong> back-ends. <code>lich-api</code> (Spring Boot) owns rooms and history; <code>dat-api</code> (Node) takes bookings, builds the daily report, caches the room list and pushes live events. Both share one PostgreSQL 16 database.',
  'Cùng nghiệp vụ với các lab ở những chương trước, nhưng giờ là một hệ thống nhỏ: web React nói chuyện với <strong>hai</strong> back-end. <code>lich-api</code> (Spring Boot) giữ dữ liệu phòng và lịch sử; <code>dat-api</code> (Node) nhận đặt chỗ, dựng báo cáo ngày, đệm danh sách phòng và đẩy sự kiện trực tiếp. Hai bên dùng chung một CSDL PostgreSQL 16.')}</p>
${ma(SO_DO, 'text')}
${bang(t, [t('Data', 'Dữ liệu'), t('Amount (seed.sql, deterministic)', 'Số lượng (seed.sql, tất định)')], [
  [t('students + grader account', 'sinh viên + tài khoản bộ kiểm'), t('30 + 1 (id 31, kiem@labflow.test)', '30 + 1 (id 31, kiem@labflow.test)')],
  [t('rooms', 'phòng'), t('24 — rooms 7 and 19 have no manager yet', '24 — phòng 7 và 19 chưa có người quản lý')],
  [t('bookings', 'lượt đặt'), t('2,784, from 16/11 to 14/12/2026, six slots a day; the early slot 06:30 is 23:30 UTC of the previous day', '2.784, từ 16/11 tới 14/12/2026, sáu ca mỗi ngày; ca sớm 06:30 là 23:30 UTC của hôm trước')],
])}
${mo(t('db/schema.sql · db/seed.sql', 'db/schema.sql · db/seed.sql'), ma(SCHEMA, 'sql'), ma(SEED, 'sql'))}
${mo(t('dat-api src/app.mjs · web src/api.js', 'dat-api src/app.mjs · web src/api.js'), ma(APP_NODE), ma(API_JS))}

<h3>${t('Run it (10 minutes)', 'Chạy lên (10 phút)')}</h3>
<p>${t(
  'You need Docker, JDK 21+ with Maven, Node 22, <code>jq</code> and Chrome. <code>chay.sh</code> rebuilds the database from scratch every time — that is deliberate: every experiment starts from the same data, so numbers in your journal can be compared.',
  'Bạn cần Docker, JDK 21+ kèm Maven, Node 22, <code>jq</code> và Chrome. <code>chay.sh</code> dựng lại CSDL từ đầu mỗi lần chạy — cố ý như vậy: mọi thí nghiệm bắt đầu từ cùng một dữ liệu, nên các con số trong nhật ký của bạn so được với nhau.')}</p>
${ma(`cd dbg-lab/ch12/cap               # repo mẫu của khoá (Chương 0)
./chay.sh                       # CSDL + lich-api + dat-api + web, ở nền
(cd kiem &amp;&amp; npm ci) &amp;&amp; node kiem/kiem.mjs     # bộ chấm: ĐỎ = lỗi còn đó
./dung.sh                       # dừng 3 dịch vụ (giữ container dbg-pg)`, 'bash')}
${ra(CHAY_RA)}
<p>${t('About 11 seconds on this machine (Maven with a warm local repository). Logs go to <code>.chay/</code>.', 'Khoảng 11 giây trên máy này (Maven với kho cục bộ đã có sẵn thư viện). Log ghi vào <code>.chay/</code>.')}</p>
${mo('chay.sh', ma(CHAY, 'bash'))}
<p>${t('The grader on the shipped version (run on this machine, 24/11/2026). Numbers in rows 6–8 change from run to run — that is what concurrency bugs look like:', 'Bộ chấm trên bản đang phát hành (chạy trên máy này, 24/11/2026). Số ở dòng 6–8 đổi theo từng lần chạy — lỗi đồng thời trông như vậy đấy:')}</p>
${ra(KIEM_LOI)}
<p>${t('And this is what a student sees in Chrome before touching any code (Chrome 150 headless driven over CDP, Console + Network):', 'Còn đây là thứ sinh viên thấy trong Chrome trước khi đụng vào dòng mã nào (Chrome 150 headless lái qua CDP, Console + Network):')}</p>
${ra(O3_WEB)}

<h3>${t('The ten tickets (verbatim)', 'Mười ticket (nguyên văn)')}</h3>
<p>${t('Exactly as they arrive: vague, mixed with guesses, sometimes wrong about the cause. Your job starts by turning each into a reproduction.', 'Đúng như khi chúng tới: mơ hồ, lẫn phỏng đoán, có khi đoán sai nguyên nhân. Việc của bạn bắt đầu bằng biến mỗi cái thành một bản tái hiện.')}</p>
${bang(t, ['Ticket', t('Reported by', 'Người báo'), t('Text', 'Nội dung')], TICKET(t).map(([a, b, c]) => [a, b, c]))}

<h3>${t('Rules', 'Luật chơi')}</h3>
${ds(t, [
  [`<strong>One bug, one branch, one small PR</strong> (<code>fix/LAB-1201</code>…). A fix that touches files unrelated to its bug is sent back.`, `<strong>Một lỗi, một nhánh, một PR nhỏ</strong> (<code>fix/LAB-1201</code>…). Bản sửa đụng tệp không liên quan tới lỗi của nó sẽ bị trả về.`],
  [`<strong>Reproduce before you read code.</strong> The first section of every journal is a command that exits non-zero while the bug exists.`, `<strong>Tái hiện trước khi đọc mã.</strong> Mục đầu tiên của mọi nhật ký là một lệnh thoát với mã khác 0 khi lỗi còn đó.`],
  [`<strong>Use the tool the chapter taught</strong>: debugger (IntelliJ/VS Code/DevTools), SQL log, <code>pg_stat_statements</code>, <code>pg_locks</code>, heap snapshot, <code>git bisect run</code>. "I read the code and guessed" scores zero on method.`, `<strong>Dùng đúng công cụ chương trước đã dạy</strong>: debugger (IntelliJ/VS Code/DevTools), log SQL, <code>pg_stat_statements</code>, <code>pg_locks</code>, heap snapshot, <code>git bisect run</code>. "Em đọc mã rồi đoán" được 0 điểm phương pháp.`],
  [`<strong>A regression test you saw fail.</strong> Paste the red run on the old code and the green run on the fix.`, `<strong>Test chặn tái phát mà bạn đã thấy hỏng.</strong> Dán lần chạy đỏ trên mã cũ và lần chạy xanh trên bản sửa.`],
  [`<strong>AI may explain, not fix.</strong> Asking "what does 40P01 mean?" or "how does EXCLUDE work?" is fine. Pasting the ticket and asking for a patch is not — at OJT the code review will ask you <em>why</em>, and only the journal answers that.`, `<strong>AI được giải thích, không được sửa hộ.</strong> Hỏi "40P01 nghĩa là gì?" hay "EXCLUDE hoạt động thế nào?" thì được. Dán ticket rồi xin bản vá thì không — lúc OJT, buổi review mã sẽ hỏi bạn <em>vì sao</em>, và chỉ nhật ký mới trả lời được câu đó.`],
  [`<strong>Do not edit <code>kiem/</code>.</strong> The grader uses its own copy.`, `<strong>Không sửa <code>kiem/</code>.</strong> Bộ chấm dùng bản của nó.`],
])}

<h3>${t('Debug journal — one per ticket', 'Nhật ký gỡ lỗi — mỗi ticket một bản')}</h3>
${ma(NHAT_KY, 'markdown')}

<h3>${t('How it is graded (100 points, pass ≥ 70)', 'Chấm thế nào (100 điểm, đạt khi ≥ 70)')}</h3>
${bang(t, [t('Part', 'Phần'), t('How', 'Cách chấm'), t('Points', 'Điểm')], [
  [t('Result', 'Kết quả'), t('<code>node kiem/kiem.mjs</code> on your branch: 4 points per green row', '<code>node kiem/kiem.mjs</code> trên nhánh của bạn: 4 điểm mỗi dòng xanh'), '40'],
  [t('Method', 'Phương pháp'), t('journal: self-checking reproduction, ≥ 2 hypotheses each with how it was tested, evidence pasted from a real run — 3 per ticket', 'nhật ký: tái hiện tự kiểm, ≥ 2 giả thuyết mỗi cái kèm cách kiểm, bằng chứng dán từ lần chạy thật — 3 điểm mỗi ticket'), '30'],
  [t('Safety net', 'Lưới an toàn'), t('regression test red-then-green + PR description "why" — 2 per ticket', 'test chặn tái phát đỏ rồi xanh + mô tả PR có "vì sao" — 2 điểm mỗi ticket'), '20'],
  [t('Write-up', 'Tổng kết'), t('final table + one-page postmortem (lesson 12.4)', 'bảng tổng kết + postmortem một trang (bài 12.4)'), '10'],
])}
<p>${t('What the grader checks, row by row:', 'Bộ chấm kiểm gì, từng dòng:')}</p>
${KIEM_GI(t)}
${mo('kiem/kiem.mjs', ma(KIEM))}

<h3>${t('Suggested order and time budget', 'Thứ tự gợi ý và quỹ thời gian')}</h3>
${bang(t, [t('Order', 'Thứ tự'), 'Tickets', t('Re-read', 'Đọc lại'), t('Budget', 'Quỹ giờ')], [
  ['1', '1201, 1202', t('2.2 Java stack traces · 4.1–4.2 IntelliJ · 7.1 SQL log', '2.2 stack trace Java · 4.1–4.2 IntelliJ · 7.1 log SQL'), t('2 h', '2 giờ')],
  ['2', '1203, 1204', t('5.2 Network/CORS · 6.2 curl · 8.2 time zones', '5.2 Network/CORS · 6.2 curl · 8.2 múi giờ'), t('2 h', '2 giờ')],
  ['3', '1205, 1210', t('7.1 N+1 · 9.1 bisect run', '7.1 N+1 · 9.1 bisect run'), t('2 h', '2 giờ')],
  ['4', '1206, 1207', t('8.1 race · 7.4 locks and deadlocks', '8.1 race · 7.4 khoá và deadlock'), t('4 h', '4 giờ')],
  ['5', '1208, 1209', t('8.4 heap snapshots · 8.3 stale state', '8.4 heap snapshot · 8.3 trạng thái cũ'), t('3 h', '3 giờ')],
  ['6', t('write-up', 'tổng kết'), '11.1–11.3', t('2 h', '2 giờ')],
])}
<p>${t('About 15 hours. If one ticket eats more than twice its budget, stop and write down what you know — exactly what you would do at work before asking a senior.', 'Khoảng 15 giờ. Nếu một ticket ngốn quá gấp đôi quỹ giờ, dừng lại và ghi những gì đã biết — đúng việc bạn sẽ làm ở công ty trước khi hỏi người đi trước.')}</p>

<h3>${t('Everyday analogy', 'Liên hệ đời thường')}</h3>
<p>${t('A mechanic with ten cars in the yard does not start by opening the engine of the first one. They drive each car, hear the noise, write "rattle at 60 km/h, only when cold", and only then pick up a tool. The tickets are the drivers\' complaints; your reproduction is the test drive.', 'Một thợ sửa xe có mười chiếc trong sân không bắt đầu bằng mở máy chiếc đầu tiên. Họ lái thử từng chiếc, nghe tiếng kêu, ghi "kêu lạch cạch ở 60 km/h, chỉ khi máy nguội", rồi mới cầm đồ nghề. Ticket là lời than của chủ xe; bản tái hiện của bạn là lần lái thử.')}</p>

<h3>${t('At work: the same week at an outsourcing company', 'Đi làm: cùng tuần đó ở công ty outsourcing')}</h3>
<p>${t('A Japanese client sends LAB-1204 in English on Friday evening. Your lead asks on Monday standup: "reproduced? root cause? ETA?" With a journal you answer in thirty seconds: "Reproduced with one command; the report groups by UTC date; fix is one query; test added; PR today." Without it, you say "still investigating" for the third day.', 'Một khách Nhật gửi LAB-1204 bằng tiếng Anh tối thứ Sáu. Sáng thứ Hai họp đứng, trưởng nhóm hỏi: "tái hiện chưa? nguyên nhân? bao giờ xong?" Có nhật ký, bạn trả lời trong ba mươi giây: "Tái hiện bằng một lệnh; báo cáo nhóm theo ngày UTC; sửa một câu truy vấn; đã thêm test; PR trong hôm nay." Không có, bạn nói "em vẫn đang tìm" sang ngày thứ ba.')}</p>

<h3>🎤 ${t('What an interviewer will ask', 'Phỏng vấn viên sẽ hỏi')}</h3>
${ds(t, [
  [`<strong>"You get ten tickets on day one. Where do you start?"</strong> Triage: reproduce all ten quickly (minutes each), rank by impact × confidence, do the data-integrity ones (double booking, wrong report) before the cosmetic ones, and say which ones you could not reproduce.`, `<strong>"Ngày đầu bạn nhận mười ticket. Bắt đầu từ đâu?"</strong> Phân loại: tái hiện nhanh cả mười (mỗi cái vài phút), xếp theo ảnh hưởng × độ chắc chắn, làm những lỗi hỏng dữ liệu (đặt trùng, báo cáo sai) trước lỗi hiển thị, và nói rõ cái nào chưa tái hiện được.`],
  [`<strong>"The developer says Postman works. Who is right?"</strong> Both: Postman does not send CORS preflight. Reproduce exactly what the browser sends (Copy as cURL, or an OPTIONS request with Origin and Access-Control-Request-Headers).`, `<strong>"Dev nói Postman vẫn chạy. Ai đúng?"</strong> Cả hai: Postman không gửi preflight CORS. Tái hiện đúng cái trình duyệt gửi (Copy as cURL, hoặc một request OPTIONS có Origin và Access-Control-Request-Headers).`],
  [`<strong>"How do you prove a concurrency bug is fixed?"</strong> A script that fires the requests at the same moment, several rounds, warm connections — and a constraint in the database, because a test that passed once proves little (ticket 1206 shows why).`, `<strong>"Làm sao chứng minh lỗi đồng thời đã sửa xong?"</strong> Một script bắn các request cùng một lúc, nhiều vòng, kết nối đã làm nóng — cộng một ràng buộc trong CSDL, vì một test qua một lần chứng minh được rất ít (ticket 1206 cho thấy vì sao).`],
  [`<strong>"What would you put in a debug journal?"</strong> The reproduction command, hypotheses with how each was tested, the evidence, the mechanism of the root cause, the regression test output red/green, time spent.`, `<strong>"Bạn ghi gì vào nhật ký gỡ lỗi?"</strong> Lệnh tái hiện, các giả thuyết kèm cách kiểm từng cái, bằng chứng, cơ chế của nguyên nhân gốc, output test chặn tái phát đỏ/xanh, thời gian đã dùng.`],
], 'ol')}

${LIEN_KET}
${nguon('📘', 'Google SRE Book — Effective Troubleshooting', 'Chương 12: triage, examine, diagnose, test — đúng vòng lặp của khoá này.', 'https://sre.google/sre-book/effective-troubleshooting/')}
`);

export default {
  title: '12.1 — The brief: the app, the 10 bug reports, rules and grading|||12.1 — Đề bài: ứng dụng, 10 bug report, luật chơi và cách chấm',
  slug: 'dbg-12-1-de-bai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dự án cuối khoá: LabFlow (React 19 + Spring Boot 4.1 + Node 22 + PostgreSQL 16) với 10 lỗi có thật — NPE, phân trang lệch, CORS, múi giờ, N+1, đặt trùng, deadlock, rò rỉ SSE, đệm cũ, hồi quy. Mười ticket nguyên văn, luật (một lỗi một PR, tái hiện trước, AI chỉ giải thích), mẫu nhật ký gỡ lỗi, rubric 100 điểm và bộ chấm kiem.mjs: 0/10 xanh trên bản phát hành, 10/10 trên bản sửa.',
  content: noiDung,
};
