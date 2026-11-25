/**
 * 12.2 — Lỗi 1–5 của dbg-cap: NPE trong Spring, phân trang lệch một, CORS, múi giờ, N+1. Gợi ý 3 tầng + lời giải chạy thật.
 * Output thật: scratchpad/dbg/lab/ch12/out (c12a.sh); diff = từng commit của repo lời giải (tools/tao-pr.py, c12c.sh).
 */
import { PHONG_SV, DATCHO_SV, CORS, BAO_CAO, TRINH_DUYET, D1, D2, D3, D4, D5 } from './_ma-12.mjs';
import { O1_CURL, O1_LOG, O1_SQL, O1_JDB, O1_JDB_SQL, O2_CURL, O2_LOG, O2_SQL, O3_WEB, O3_CURL, O4_DEM, O4_SQL, O4_NODE, O5_LOG, O5_PGSS, O5_XA } from './_ra-12.mjs';
import { lienKet, nguon } from '../_chung.mjs';
import { ma, ra, mo, song, ds } from './_khung-12.mjs';

const goiY = (t, a, b, c) => [
  mo(t('Hint 1 — where to look', 'Gợi ý 1 — nhìn vào đâu'), `<p>${t(...a)}</p>`),
  mo(t('Hint 2 — which tool', 'Gợi ý 2 — dùng công cụ nào'), `<p>${t(...b)}</p>`),
  mo(t('Hint 3 — which code', 'Gợi ý 3 — vùng mã nào'), `<p>${t(...c)}</p>`),
].join('\n');

const LIEN_KET = [
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-2-2-java', title: 'Bài 2.2 — NullPointerException và "Caused by"', sub: 'Đọc thông điệp NPE kiểu JEP 358 trước khi mở debugger.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-4-2-breakpoint-nang-cao', title: 'Bài 4.2 — Breakpoint nâng cao trong IntelliJ', sub: 'Exception breakpoint: Caught và Uncaught khác nhau thế nào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-2-network', title: 'Bài 5.2 — Network: CORS, preflight, Copy as cURL', sub: 'Nền của lỗi 3.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-2-thoi-gian', title: 'Bài 8.2 — Lỗi thời gian', sub: 'Nền của lỗi 4: múi giờ, toISOString, giờ máy.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-7-1-sql-that', title: 'Bài 7.1 — Nhìn thấy SQL thật', sub: 'Nền của lỗi 2 và 5: log Hibernate, pg_stat_statements.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-7-1-n-cong-1', title: 'Spring Boot 7.1 — N+1', sub: 'Các cách sửa N+1 khác: fetch join, @EntityGraph, batch size.', cta: 'Mở bài →' }),
].join('\n');

const noiDung = song((t) => `
<span class="eyebrow">${t('Chapter 12 · Bugs 1–5', 'Chương 12 · Lỗi 1–5')}</span>
<h2>${t('Five bugs you can catch with one tool each — if you pick the right one', 'Năm lỗi, mỗi lỗi bắt được bằng một công cụ — nếu chọn đúng công cụ')}</h2>
<p class="lead">${t(
  'Try each ticket yourself first. Open the hints one at a time; the walkthrough is the run on this machine, with real output, so you can compare your journal with it line by line.',
  'Tự làm từng ticket trước. Mở gợi ý từng bậc một; phần lời giải là lần chạy trên máy này, có output thật, để bạn so nhật ký của mình với nó từng dòng.')}</p>

<h3>${t('Bug 1 · LAB-1201 — "Lab 7" page returns 500', 'Lỗi 1 · LAB-1201 — trang "Lab 7" trả 500')}</h3>
<p>${t('Technique required: read the exception message, then an <strong>exception breakpoint</strong> (IntelliJ: Run → View Breakpoints → + → Java Exception Breakpoints).', 'Kỹ thuật bắt buộc: đọc thông điệp ngoại lệ, rồi <strong>exception breakpoint</strong> (IntelliJ: Run → View Breakpoints → + → Java Exception Breakpoints).')}</p>
${goiY(t,
  ['The response body says nothing (good — production should not leak internals). The log of lich-api says everything.', 'Thân response không nói gì (tốt — production không nên lộ chi tiết bên trong). Log của lich-api nói hết.'],
  ['Read the NullPointerException message to the end: since Java 14 it names the exact expression that was null (JEP 358). Then ask SQL what is special about rooms 7 and 19.', 'Đọc thông điệp NullPointerException tới hết: từ Java 14 nó nêu đúng biểu thức bị null (JEP 358). Rồi hỏi SQL phòng 7 và 19 có gì đặc biệt.'],
  ['<code>PhongService.thongKe()</code> — compare it with <code>doiTen()</code> a few lines below.', '<code>PhongService.thongKe()</code> — so với <code>doiTen()</code> ngay bên dưới.'])}
${mo(t('Walkthrough (open after your own attempt)', 'Lời giải (mở sau khi đã tự làm)'), `
<p>${t('Reproduce: one room fails, another works.', 'Tái hiện: một phòng lỗi, phòng khác chạy.')}</p>
${ra(O1_CURL)}
<p>${t('The log line is the whole diagnosis — the frame is <code>PhongService.java:34</code> and the message names <code>getQuanLy()</code>:', 'Dòng log là cả bản chẩn đoán — frame là <code>PhongService.java:34</code> và thông điệp nêu tên <code>getQuanLy()</code>:')}</p>
${ra(O1_LOG)}
${ra(O1_SQL)}
<p>${t(
  'Now the debugger, to see the state. IntelliJ\'s Java Exception Breakpoint on NullPointerException is the same JDWP request as <code>catch</code> in <code>jdb</code>, which is what ran here (attached to 127.0.0.1:45005). Note the first line: <em>to be caught at DirectMethodHandleAccessor.invoke()</em> — Spring catches the exception and turns it into a 500, so an exception breakpoint set to "Uncaught" only would <strong>never stop</strong>. Tick "Caught".',
  'Giờ tới debugger, để thấy trạng thái. Java Exception Breakpoint của IntelliJ cho NullPointerException là cùng một yêu cầu JDWP với lệnh <code>catch</code> của <code>jdb</code> — thứ đã chạy ở đây (gắn vào 127.0.0.1:45005). Để ý dòng đầu: <em>to be caught at DirectMethodHandleAccessor.invoke()</em> — Spring bắt ngoại lệ rồi biến nó thành 500, nên exception breakpoint chỉ đặt "Uncaught" sẽ <strong>không bao giờ dừng</strong>. Hãy tick "Caught".')}</p>
${ra(O1_JDB)}
<p>${t(
  'A trap worth a line in your journal: typing <code>print p.datCho</code> made the debugger call <code>toString()</code> on a lazy Hibernate collection — and that <strong>ran a SQL query</strong> six seconds after the first one. IntelliJ\'s variable view does the same when "Enable toString() object view" is on. The debugger is not a neutral observer.',
  'Một cái bẫy đáng một dòng trong nhật ký: gõ <code>print p.datCho</code> khiến debugger gọi <code>toString()</code> trên một collection lười của Hibernate — và việc đó <strong>chạy một câu SQL</strong>, sáu giây sau câu đầu. Khung biến của IntelliJ cũng làm vậy khi bật "Enable toString() object view". Debugger không phải người đứng xem vô hại.')}</p>
${ra(O1_JDB_SQL)}
<p>${t('The fix (one commit). <code>doiTen()</code> already handled null; the two methods had drifted apart, so one helper now serves both:', 'Bản sửa (một commit). <code>doiTen()</code> đã xử lý null từ trước; hai hàm lệch nhau, nên giờ một hàm phụ dùng chung cho cả hai:')}</p>
${ma(D1, 'diff')}
<p>${t('Why not <code>Map.of("quanLy", …)</code>? <code>Map.of</code> rejects null values with another NullPointerException — the record keeps null and Jackson writes <code>"quanLy": null</code>. Regression check: row 1 of <code>kiem.mjs</code> goes green (lesson 12.4 shows the run after every commit).', 'Vì sao không dùng <code>Map.of("quanLy", …)</code>? <code>Map.of</code> từ chối giá trị null bằng một NullPointerException khác — record giữ được null và Jackson ghi <code>"quanLy": null</code>. Kiểm chặn tái phát: dòng 1 của <code>kiem.mjs</code> chuyển xanh (bài 12.4 có lần chạy sau từng commit).')}</p>
${mo('PhongService.java (bản phát hành)', ma(PHONG_SV, 'java'))}
`)}
<p><strong>${t('Lesson:', 'Bài học:')}</strong> ${t('read the message before opening the debugger; when you do open it, remember it can change state.', 'đọc thông điệp trước khi mở debugger; khi đã mở, nhớ rằng nó có thể làm đổi trạng thái.')}</p>

<h3>${t('Bug 2 · LAB-1202 — newest booking missing, last page empty', 'Lỗi 2 · LAB-1202 — thiếu lịch mới nhất, trang cuối trống')}</h3>
<p>${t('Technique required: compare the API with a SQL query you trust, and read the SQL the ORM actually sent (bind values).', 'Kỹ thuật bắt buộc: so API với một câu SQL bạn tin, và đọc câu SQL mà ORM thật sự gửi (kèm giá trị tham số).')}</p>
${goiY(t,
  ['Page 1 vs the ten newest rows for user 3 in the database. Also try page 0 — the way a developer "tests in Postman".', 'Trang 1 so với mười dòng mới nhất của người 3 trong CSDL. Thử cả trang 0 — cách một dev "thử bằng Postman".'],
  ['<code>logging.level.org.hibernate.SQL=DEBUG</code> and <code>logging.level.org.hibernate.orm.jdbc.bind=TRACE</code> (commented in application.properties). Look at the OFFSET parameter.', '<code>logging.level.org.hibernate.SQL=DEBUG</code> và <code>logging.level.org.hibernate.orm.jdbc.bind=TRACE</code> (đã có sẵn dạng chú thích trong application.properties). Nhìn tham số OFFSET.'],
  ['<code>DatChoService.lichSu()</code> and the Javadoc of <code>PageRequest.of(int page, int size)</code>: "zero-based page index".', '<code>DatChoService.lichSu()</code> và Javadoc của <code>PageRequest.of(int page, int size)</code>: "zero-based page index".'])}
${mo(t('Walkthrough (open after your own attempt)', 'Lời giải (mở sau khi đã tự làm)'), `
${ra(O2_CURL)}
${ra(O2_SQL)}
<p>${t('Page 1 starts at #2360 — the <strong>eleventh</strong> row. Page 0 is the real first page. The SQL log confirms it: OFFSET is bound to 10 for <code>trang=1</code>.', 'Trang 1 bắt đầu ở #2360 — dòng <strong>thứ mười một</strong>. Trang 0 mới là trang đầu thật. Log SQL xác nhận: OFFSET được gán 10 cho <code>trang=1</code>.')}</p>
${ra(O2_LOG)}
<p>${t('Root cause: the API speaks 1-based (like the UI), Spring Data speaks 0-based, and nobody converted. Convert in exactly one place — the API boundary — and reject impossible values:', 'Nguyên nhân gốc: API nói ngôn ngữ đếm từ 1 (như giao diện), Spring Data đếm từ 0, và không ai đổi. Đổi đúng một chỗ — ranh giới API — và từ chối giá trị vô lý:')}</p>
${ma(D2, 'diff')}
${mo('DatChoService.java (bản phát hành)', ma(DATCHO_SV, 'java'))}
`)}
<p><strong>${t('Lesson:', 'Bài học:')}</strong> ${t('"I tested it in Postman" usually means "I tested the input I imagined" — the UI sends 1.', '"Em thử bằng Postman rồi" thường nghĩa là "em thử với đầu vào em tưởng tượng" — giao diện gửi 1.')}</p>

<h3>${t('Bug 3 · LAB-1203 — "Failed to fetch", but Postman works', 'Lỗi 3 · LAB-1203 — "Failed to fetch", nhưng Postman chạy')}</h3>
<p>${t('Technique required: DevTools Console + Network (the OPTIONS row), then reproduce the preflight with curl.', 'Kỹ thuật bắt buộc: DevTools Console + Network (dòng OPTIONS), rồi tái hiện preflight bằng curl.')}</p>
${goiY(t,
  ['Console, not the page. "Failed to fetch" is all JavaScript is allowed to know; the reason is printed only in the Console.', 'Console, không phải trang. "Failed to fetch" là tất cả những gì JavaScript được phép biết; lý do chỉ in ra ở Console.'],
  ['Network tab: is there an OPTIONS request before the GET/POST? What did it answer in <code>Access-Control-Allow-Headers</code>? Which header did web 1.6 start sending?', 'Tab Network: có request OPTIONS trước GET/POST không? Nó trả gì ở <code>Access-Control-Allow-Headers</code>? Web 1.6 bắt đầu gửi header nào?'],
  ['<code>node/src/cors.mjs</code> and <code>web/src/api.js</code>.', '<code>node/src/cors.mjs</code> và <code>web/src/api.js</code>.'])}
${mo(t('Walkthrough (open after your own attempt)', 'Lời giải (mở sau khi đã tự làm)'), `
<p>${t('Chrome (headless, driven over CDP by <code>tools/trinh-duyet.mjs</code>) prints the exact reason and the failure class <code>HeaderDisallowedByPreflightResponse</code>:', 'Chrome (headless, lái qua CDP bằng <code>tools/trinh-duyet.mjs</code>) in đúng lý do và loại lỗi <code>HeaderDisallowedByPreflightResponse</code>:')}</p>
${ra(O3_WEB)}
<p>${t('The same preflight with curl, and the "Postman" request that works because no browser is involved:', 'Cùng preflight đó bằng curl, và request "Postman" chạy được vì không có trình duyệt nào ở giữa:')}</p>
${ra(O3_CURL)}
<p>${t(
  '<code>X-Request-Id</code> is not a CORS-safelisted header, so the browser must ask first; <code>Content-Type: application/json</code> also forces a preflight on the POST. The server allowed only <code>Content-Type</code>. Fix the server, not the client: removing the header from the web app would also remove the request id you need to trace calls across services (lesson 6.4).',
  '<code>X-Request-Id</code> không thuộc nhóm header "CORS-safelisted", nên trình duyệt phải hỏi trước; <code>Content-Type: application/json</code> cũng buộc POST có preflight. Server chỉ cho phép <code>Content-Type</code>. Sửa phía server, đừng sửa phía client: bỏ header khỏi web là bỏ luôn request id bạn cần để lần theo request qua nhiều dịch vụ (bài 6.4).')}</p>
${ma(D3, 'diff')}
<p>${t('Not a fix: <code>Access-Control-Allow-Origin: *</code> together with cookies, or reflecting any Origin back. Both turn a CORS error into a security hole (see API Design 6.4).', 'Không phải bản sửa: <code>Access-Control-Allow-Origin: *</code> kèm cookie, hoặc phản chiếu mọi Origin. Cả hai biến lỗi CORS thành lỗ hổng bảo mật (xem API Design 6.4).')}</p>
${mo('cors.mjs · tools/trinh-duyet.mjs', ma(CORS), ma(TRINH_DUYET))}
`)}
<p><strong>${t('Lesson:', 'Bài học:')}</strong> ${t('reproduce what the browser sends, not what you would send.', 'tái hiện cái trình duyệt gửi, không phải cái bạn sẽ gửi.')}</p>

<h3>${t('Bug 4 · LAB-1204 — the daily report has the right total and the wrong rows', 'Lỗi 4 · LAB-1204 — báo cáo ngày đúng tổng mà sai dòng')}</h3>
<p>${t('Technique required: compare sets, not counts; look at one row in three time zones.', 'Kỹ thuật bắt buộc: so tập hợp, không so con số; nhìn một dòng ở ba múi giờ.')}</p>
${goiY(t,
  ['Which bookings are wrong? All of them are 06:30. What is 06:30 in Vietnam in UTC?', 'Những lượt nào sai? Tất cả đều là ca 06:30. 06:30 giờ Việt Nam là mấy giờ UTC?'],
  ['<code>psql</code> with <code>AT TIME ZONE</code>, and two one-line <code>node -e</code> experiments with <code>toISOString()</code>.', '<code>psql</code> với <code>AT TIME ZONE</code>, và hai thí nghiệm một dòng <code>node -e</code> với <code>toISOString()</code>.'],
  ['<code>node/src/bao-cao.mjs</code> — the <code>filter</code> line.', '<code>node/src/bao-cao.mjs</code> — dòng <code>filter</code>.'])}
${mo(t('Walkthrough (open after your own attempt)', 'Lời giải (mở sau khi đã tự làm)'), `
<p>${t('The totals agree — which is exactly why a human checking the number signs it off:', 'Tổng khớp nhau — chính vì vậy người kiểm bằng con số đã duyệt cho qua:')}</p>
${ra(O4_DEM)}
<p>${t('The rows do not. Every 06:30 booking in Vietnam is 23:30 UTC <em>the day before</em>:', 'Các dòng thì không. Mọi lượt 06:30 giờ Việt Nam đều là 23:30 UTC <em>của hôm trước</em>:')}</p>
${ra(O4_SQL)}
${ra(O4_NODE)}
<p>${t('<code>toISOString()</code> is always UTC; <code>new Date("2026-12-01")</code> is UTC midnight but <code>new Date("2026-12-01T00:00")</code> is the <em>machine\'s</em> midnight. Do not patch with "+7 hours" in JavaScript — cut the day in SQL with the named zone:', '<code>toISOString()</code> luôn là UTC; <code>new Date("2026-12-01")</code> là nửa đêm UTC nhưng <code>new Date("2026-12-01T00:00")</code> là nửa đêm của <em>máy</em>. Đừng vá bằng "cộng 7 giờ" trong JavaScript — cắt ngày trong SQL bằng tên múi giờ:')}</p>
${ma(D4, 'diff')}
${mo('bao-cao.mjs (bản phát hành)', ma(BAO_CAO))}
`)}
<p><strong>${t('Lesson:', 'Bài học:')}</strong> ${t('a matching total is not evidence; compare the sets (kiem row 4 prints "missing 6, extra 6").', 'tổng khớp không phải bằng chứng; hãy so hai tập hợp (dòng 4 của kiem in "thiếu 6, thừa 6").')}</p>

<h3>${t('Bug 5 · LAB-1205 — fast on my laptop, slow on staging', 'Lỗi 5 · LAB-1205 — máy em nhanh, staging chậm')}</h3>
<p>${t('Technique required: count statements (Hibernate SQL log or <code>pg_stat_statements</code>), then simulate network distance.', 'Kỹ thuật bắt buộc: đếm câu SQL (log SQL của Hibernate hoặc <code>pg_stat_statements</code>), rồi giả lập khoảng cách mạng.')}</p>
${goiY(t,
  ['Time on a laptop hides round trips (≈ 0.1 ms each). Count them instead of timing them.', 'Đo giờ trên laptop che mất các lượt đi-về (≈ 0,1 ms mỗi lượt). Đếm chúng thay vì đo giờ.'],
  ['<code>SELECT pg_stat_statements_reset()</code>, one request, then <code>calls</code> per query. To feel staging: a TCP proxy that adds 2 ms each way (<code>tre.mjs</code> from Lab 7).', '<code>SELECT pg_stat_statements_reset()</code>, một request, rồi xem <code>calls</code> của từng câu. Để cảm được staging: một proxy TCP thêm 2 ms mỗi chiều (<code>tre.mjs</code> từ Lab 7).'],
  ['<code>PhongService.danhSach()</code>: <code>p.getDatCho()</code> and <code>p.getQuanLy()</code> inside a stream over all rooms.', '<code>PhongService.danhSach()</code>: <code>p.getDatCho()</code> và <code>p.getQuanLy()</code> trong một stream chạy qua mọi phòng.'])}
${mo(t('Walkthrough (open after your own attempt)', 'Lời giải (mở sau khi đã tự làm)'), `
<p>${t('One GET, 47 statements: 1 for rooms, 24 lazy collections, 22 managers (two rooms have none):', 'Một lần GET, 47 câu SQL: 1 cho phòng, 24 collection lười, 22 người quản lý (hai phòng không có):')}</p>
${ra(O5_LOG)}
${ra(O5_PGSS)}
<p>${t('Note <code>rows = 2784</code> on the collection query: to count "upcoming bookings" the code loaded <em>every booking of every room</em> into memory. With 2 ms of latency each way:', 'Để ý <code>rows = 2784</code> ở câu nạp collection: để đếm "lịch sắp tới", mã nạp <em>mọi lượt đặt của mọi phòng</em> lên bộ nhớ. Với 2 ms trễ mỗi chiều:')}</p>
${ra(O5_XA)}
<p>${t('0.24 s vs 0.013 s — and the gap grows linearly with rooms (120 next semester). The fix asks the database to count, in one statement:', '0,24 s so với 0,013 s — và khoảng cách tăng tuyến tính theo số phòng (học kỳ sau 120). Bản sửa nhờ CSDL đếm, trong một câu:')}</p>
${ma(D5, 'diff')}
<p>${t('Other valid fixes: <code>join fetch</code> / <code>@EntityGraph</code> for the manager and a grouped count query, or <code>hibernate.default_batch_fetch_size</code>. Whatever you choose, the evidence in the PR is the statement count before/after, not "feels faster".', 'Các cách sửa khác cũng đúng: <code>join fetch</code> / <code>@EntityGraph</code> cho người quản lý cộng một câu đếm có GROUP BY, hoặc <code>hibernate.default_batch_fetch_size</code>. Chọn cách nào thì bằng chứng trong PR cũng là số câu SQL trước/sau, không phải "thấy nhanh hơn".')}</p>
`)}
<p><strong>${t('Lesson:', 'Bài học:')}</strong> ${t('performance bugs that depend on distance are invisible on localhost; count round trips.', 'lỗi hiệu năng phụ thuộc khoảng cách thì vô hình trên localhost; hãy đếm số lượt đi-về.')}</p>

<h3>🎤 ${t('What an interviewer will ask', 'Phỏng vấn viên sẽ hỏi')}</h3>
${ds(t, [
  [`<strong>"An exception breakpoint never hits, but the log shows the exception. Why?"</strong> The framework catches it (Spring turns it into a 500); the breakpoint is set to Uncaught only. Enable Caught, and add a class filter so you do not stop in library code.`, `<strong>"Exception breakpoint không bao giờ dừng, nhưng log có ngoại lệ. Vì sao?"</strong> Framework đã bắt nó (Spring biến thành 500); breakpoint chỉ đặt Uncaught. Bật Caught, và thêm bộ lọc lớp để khỏi dừng trong mã thư viện.`],
  [`<strong>"Postman works, the browser does not."</strong> CORS is enforced by browsers; Postman sends no preflight. Read the Console message, find the OPTIONS row, reproduce it with curl including Origin and Access-Control-Request-Headers.`, `<strong>"Postman chạy, trình duyệt không."</strong> CORS do trình duyệt thực thi; Postman không gửi preflight. Đọc thông báo ở Console, tìm dòng OPTIONS, tái hiện bằng curl có Origin và Access-Control-Request-Headers.`],
  [`<strong>"How do you find an N+1 problem?"</strong> Count statements for one request — SQL log or pg_stat_statements — and look for one query repeated N times with different ids. Then prove the fix with the count, not a stopwatch.`, `<strong>"Bạn tìm N+1 thế nào?"</strong> Đếm số câu SQL của một request — log SQL hoặc pg_stat_statements — và tìm một câu lặp N lần với id khác nhau. Rồi chứng minh bản sửa bằng con số đó, không phải bằng đồng hồ bấm giờ.`],
  [`<strong>"How do you store and display times for users in one country but servers in UTC?"</strong> Store instants (timestamptz), cut calendar days with the named zone (Asia/Ho_Chi_Minh) at the edge, never with a fixed offset or toISOString().`, `<strong>"Lưu và hiển thị giờ thế nào khi người dùng ở một nước còn server chạy UTC?"</strong> Lưu thời điểm (timestamptz), cắt ngày lịch bằng tên múi giờ (Asia/Ho_Chi_Minh) ở ranh giới, không bao giờ bằng độ lệch cố định hay toISOString().`],
], 'ol')}

${LIEN_KET}
${nguon('📘', 'JEP 358 — Helpful NullPointerExceptions', 'Vì sao thông điệp NPE nêu được đúng biểu thức bị null.', 'https://openjdk.org/jeps/358')}
${nguon('📘', 'MDN — Cross-Origin Resource Sharing (CORS)', 'Preflight, CORS-safelisted request headers.', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS')}
${nguon('📘', 'PostgreSQL 16 — pg_stat_statements', 'calls, rows, pg_stat_statements_reset().', 'https://www.postgresql.org/docs/16/pgstatstatements.html')}
`);

export default {
  title: '12.2 — Bugs 1–5: Spring NPE, pagination off-by-one, CORS, time zone, N+1|||12.2 — Lỗi 1–5: NPE trong Spring, phân trang lệch một, CORS, múi giờ, N+1',
  slug: 'dbg-12-2-loi-1-5',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm lỗi đầu của dự án cuối khoá, mỗi lỗi gợi ý 3 tầng và lời giải chạy thật: NPE phòng chưa có quản lý (jdb catch = exception breakpoint của IntelliJ, phải bật Caught; in collection lười làm chạy SQL), trang 1 bắt đầu ở dòng 11 (OFFSET 10), CORS chặn X-Request-Id mà Postman không thấy, báo cáo ngày đúng tổng sai dòng (thiếu 6 thừa 6), N+1 47 câu SQL — 0,24 s so với 0,013 s khi CSDL ở xa.',
  content: noiDung,
};
