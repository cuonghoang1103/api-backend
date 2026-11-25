/**
 * 12.6 — Kiểm tra tổng kết (20 câu trộn cả khoá, dựa trên output chạy thật của các chương) + checklist gỡ lỗi in ra dán cạnh màn hình.
 * Phân bố đáp án: A5 B5 C5 D5.
 */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const CHECKLIST_VI = `<ol>
<li><strong>Tái hiện</strong>: một lệnh, tự kiểm, thoát ≠ 0 khi lỗi còn. Ghi tần suất (10/10? 3/10?).</li>
<li><strong>Đọc thông báo lỗi tới hết</strong> — dòng đầu stack trace thuộc mã của mình, "Caused by" cuối cùng, Console của trình duyệt.</li>
<li><strong>Bản đang chạy là bản nào?</strong> /health: phiên bản + commit. Bộ đệm ở tầng nào?</li>
<li><strong>Khoanh vùng theo tầng</strong>: trình duyệt → mạng → API → CSDL. Gọi thẳng tầng dưới bằng curl/psql.</li>
<li><strong>Ghi giả thuyết trước khi kiểm</strong>, mỗi lần một thay đổi.</li>
<li><strong>Đếm, đừng đoán</strong>: số câu SQL, số lượt 201/409/500, số đối tượng trong heap.</li>
<li><strong>Đồng thời?</strong> Script song song, kết nối đã làm nóng, chạy nhiều vòng.</li>
<li><strong>Hôm qua còn chạy?</strong> git bisect run với test ngoài repo, 125 cho commit không kiểm được.</li>
<li><strong>Production</strong>: chỉ đọc trước, không dừng tiến trình, che dữ liệu nhạy cảm.</li>
<li><strong>Sửa</strong>: một lỗi một PR, test thấy đỏ trước, xanh sau, mô tả "vì sao".</li>
<li><strong>Ghi lại</strong>: sổ lỗi 5 dòng; lỗi đáng kể thì postmortem một trang.</li>
</ol>`;
const CHECKLIST_EN = `<ol>
<li><strong>Reproduce</strong>: one self-checking command, exits non-zero while the bug exists. Note the frequency (10/10? 3/10?).</li>
<li><strong>Read the error to the end</strong> — first stack frame in your code, the last "Caused by", the browser Console.</li>
<li><strong>Which version is running?</strong> /health: version + commit. Which layer caches?</li>
<li><strong>Narrow by layer</strong>: browser → network → API → database. Call the lower layer directly with curl/psql.</li>
<li><strong>Write the hypothesis before testing</strong>, one change at a time.</li>
<li><strong>Count, do not guess</strong>: SQL statements, 201/409/500 counts, objects in the heap.</li>
<li><strong>Concurrency?</strong> Parallel script, warm connections, several rounds.</li>
<li><strong>Worked yesterday?</strong> git bisect run with a test outside the repo, 125 for untestable commits.</li>
<li><strong>Production</strong>: read-only first, never pause the process, mask sensitive data.</li>
<li><strong>Fix</strong>: one bug one PR, a test seen red then green, a "why" description.</li>
<li><strong>Write it down</strong>: five-line bug log; one-page postmortem for anything significant.</li>
</ol>`;

export default {
  title: '12.6 — Final quiz and checklist|||12.6 — Kiểm tra tổng kết và checklist',
  slug: 'dbg-12-6-tong-ket',
  type: 'QUIZ',
  isFreePreview: true,
  description: '20 câu tình huống trộn cả khoá (tái hiện, stack trace, debugger VS Code/IntelliJ/DevTools, CORS, SQL, khoá, race, múi giờ, bộ nhớ, bisect, production, bug report, postmortem) — đáp án dựa trên output chạy thật của các chương — và checklist gỡ lỗi 11 bước in ra dán cạnh màn hình.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final check</span>
<h2>Twenty situations from the whole course</h2>
<p class="lead">Each question comes from a run you saw in a lesson. Aim for 16/20; for every miss, reopen the chapter named in the explanation.</p>
<h3>The checklist — print it and keep it next to your screen</h3>
${CHECKLIST_EN}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra cuối</span>
<h2>Hai mươi tình huống từ cả khoá</h2>
<p class="lead">Mỗi câu lấy từ một lần chạy bạn đã thấy trong bài. Hãy nhắm 16/20; câu nào sai thì mở lại chương được nêu trong phần giải thích.</p>
<h3>Checklist — in ra và dán cạnh màn hình</h3>
${CHECKLIST_VI}
</div>
`,
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      q('A ticket says "booking fails sometimes". What is the first deliverable?|||Ticket ghi "thỉnh thoảng đặt không được". Sản phẩm đầu tiên là gì?', [
        'A self-checking reproduction command with its frequency|||Một lệnh tái hiện tự kiểm, kèm tần suất',
        'A fix in the code that looks most suspicious|||Một bản sửa ở đoạn mã đáng ngờ nhất',
        'More logging everywhere|||Thêm log khắp nơi',
        'Restarting the service|||Khởi động lại dịch vụ',
      ], 0, 'EN: Chapter 1 — without a reproduction you cannot tell whether a change fixed anything.|||VI: Chương 1 — không có bản tái hiện thì không biết thay đổi nào sửa được gì.'),
      q('The log says: Cannot invoke "NguoiDung.getTen()" because the return value of "Phong.getQuanLy()" is null. What is null?|||Log ghi: Cannot invoke "NguoiDung.getTen()" because the return value of "Phong.getQuanLy()" is null. Cái gì null?', [
        'The NguoiDung class|||Lớp NguoiDung',
        'The room\'s manager returned by getQuanLy()|||Người quản lý của phòng do getQuanLy() trả về',
        'The room object|||Đối tượng phòng',
        'The method getTen()|||Hàm getTen()',
      ], 1, 'EN: JEP 358 messages name the null expression: the return value of getQuanLy() (rooms 7 and 19 have no manager). Chapter 2, 12.2.|||VI: Thông điệp JEP 358 nêu biểu thức bị null: giá trị trả về của getQuanLy() (phòng 7 và 19 chưa có người quản lý). Chương 2, 12.2.'),
      q('An IntelliJ exception breakpoint on NullPointerException never stops, yet the API returns 500 with that NPE in the log. Most likely?|||Exception breakpoint NullPointerException trong IntelliJ không bao giờ dừng, dù API trả 500 và log có NPE đó. Khả năng cao nhất?', [
        'The JVM was started without debug info|||JVM chạy không có thông tin debug',
        'NPE cannot be caught by a debugger|||Debugger không bắt được NPE',
        'Only "Uncaught" is ticked, but Spring catches the exception|||Chỉ tick "Uncaught", mà Spring đã bắt ngoại lệ',
        'The breakpoint is on the wrong line|||Breakpoint đặt sai dòng',
      ], 2, 'EN: jdb showed "to be caught at DirectMethodHandleAccessor.invoke()" — the framework catches it. Tick Caught. 4.2, 12.2.|||VI: jdb in "to be caught at DirectMethodHandleAccessor.invoke()" — framework bắt nó. Hãy tick Caught. 4.2, 12.2.'),
      q('While paused, you print a lazy Hibernate collection in the debugger. What can happen?|||Đang dừng ở breakpoint, bạn in một collection lười của Hibernate trong debugger. Điều gì có thể xảy ra?', [
        'Nothing; the debugger only reads memory|||Không gì cả; debugger chỉ đọc bộ nhớ',
        'The JVM crashes|||JVM sập',
        'The collection is cleared|||Collection bị xoá rỗng',
        'A SQL query runs to load it, changing program state and timing|||Một câu SQL chạy để nạp nó, làm đổi trạng thái và thời gian chạy',
      ], 3, 'EN: In 12.2, "print p.datCho" ran SELECT … FROM dat_cho six seconds after the first query. The debugger is not neutral.|||VI: Ở 12.2, "print p.datCho" chạy SELECT … FROM dat_cho sáu giây sau câu đầu. Debugger không trung lập.'),
      q('Postman can POST to dat-api; the browser shows "Failed to fetch". What do you reproduce?|||Postman POST được vào dat-api; trình duyệt báo "Failed to fetch". Bạn tái hiện cái gì?', [
        'The OPTIONS preflight with Origin and Access-Control-Request-Headers|||Preflight OPTIONS có Origin và Access-Control-Request-Headers',
        'The same POST from Postman again|||Lại đúng POST đó bằng Postman',
        'A ping to the server|||Một lệnh ping tới server',
        'A DNS lookup|||Một lần tra DNS',
      ], 0, 'EN: Postman sends no preflight; Chrome reported HeaderDisallowedByPreflightResponse for x-request-id. 5.2, 12.2.|||VI: Postman không gửi preflight; Chrome báo HeaderDisallowedByPreflightResponse cho x-request-id. 5.2, 12.2.'),
      q('The fix for that CORS error that is NOT acceptable:|||Cách sửa lỗi CORS đó KHÔNG chấp nhận được:', [
        'Add X-Request-Id to Access-Control-Allow-Headers|||Thêm X-Request-Id vào Access-Control-Allow-Headers',
        'Reflect any Origin back with credentials allowed|||Phản chiếu mọi Origin và cho phép credentials',
        'Serve web and API from the same origin through a proxy|||Phục vụ web và API cùng origin qua một proxy',
        'List the exact web origin|||Liệt kê đúng origin của web',
      ], 1, 'EN: Reflecting every origin with credentials lets any site call the API as the user. API Design 6.4.|||VI: Phản chiếu mọi origin kèm credentials cho phép bất kỳ trang nào gọi API dưới danh nghĩa người dùng. API Design 6.4.'),
      q('Page 1 of a history API starts at the 11th newest row; page 0 shows the newest. Cause?|||Trang 1 của API lịch sử bắt đầu ở dòng mới thứ 11; trang 0 mới là dòng mới nhất. Nguyên nhân?', [
        'The index is missing|||Thiếu index',
        'Sorting is ascending|||Sắp xếp tăng dần',
        'A 1-based page number passed to 0-based PageRequest.of (OFFSET 10)|||Số trang đếm từ 1 truyền cho PageRequest.of đếm từ 0 (OFFSET 10)',
        'The cache is stale|||Bộ đệm cũ',
      ], 2, 'EN: The bind log showed OFFSET = 10 for trang=1. 7.1, 12.2.|||VI: Log tham số cho thấy OFFSET = 10 với trang=1. 7.1, 12.2.'),
      q('A daily report has the right total but the wrong rows (6 missing, 6 extra, all at 06:30 Vietnam time). Cause?|||Báo cáo ngày đúng tổng nhưng sai dòng (thiếu 6, thừa 6, đều là 06:30 giờ VN). Nguyên nhân?', [
        'Daylight saving time in Vietnam|||Giờ mùa hè ở Việt Nam',
        'Rounding of minutes|||Làm tròn phút',
        'Duplicated rows in the table|||Bảng có dòng trùng',
        'Days cut with toISOString() (UTC): 06:30 +07 is 23:30 UTC the day before|||Cắt ngày bằng toISOString() (UTC): 06:30 +07 là 23:30 UTC hôm trước',
      ], 3, 'EN: Vietnam has no DST. Compare sets, and cut days with AT TIME ZONE \'Asia/Ho_Chi_Minh\'. 8.2, 12.2.|||VI: Việt Nam không có giờ mùa hè. So tập hợp, và cắt ngày bằng AT TIME ZONE \'Asia/Ho_Chi_Minh\'. 8.2, 12.2.'),
      q('GET /api/phong is fast on a laptop and 0.24 s on staging. The best first measurement:|||GET /api/phong nhanh trên laptop, 0,24 s trên staging. Phép đo đầu tiên tốt nhất:', [
        'Count SQL statements for one request (pg_stat_statements or SQL log)|||Đếm số câu SQL của một request (pg_stat_statements hoặc log SQL)',
        'CPU usage of the JVM|||Mức dùng CPU của JVM',
        'Heap size|||Kích thước heap',
        'Browser rendering time|||Thời gian trình duyệt vẽ trang',
      ], 0, 'EN: 47 statements × ~4 ms round trip ≈ the 0.24 s; the fix made it 1 statement. 7.1, 12.2.|||VI: 47 câu × ~4 ms mỗi lượt đi-về ≈ 0,24 s; bản sửa còn 1 câu. 7.1, 12.2.'),
      q('Your race reproduction with 20 parallel requests shows no duplicates. Next step?|||Bản tái hiện race với 20 request song song không ra lượt trùng. Bước kế?', [
        'Conclude there is no race|||Kết luận không có race',
        'Warm up HTTP keep-alive and the DB pool first, then run several rounds|||Làm nóng keep-alive HTTP và pool CSDL trước, rồi chạy nhiều vòng',
        'Add sleep() in production code|||Thêm sleep() vào mã production',
        'Increase to 10,000 requests sequentially|||Tăng lên 10.000 request tuần tự',
      ], 1, 'EN: Cold connections staggered the requests by milliseconds (1×201, 19×409); warmed: 16×201. 8.1, 12.3.|||VI: Kết nối nguội làm request lệch nhau vài ms (1×201, 19×409); làm nóng rồi: 16×201. 8.1, 12.3.'),
      q('After adding an EXCLUDE constraint, a burst of 20 identical bookings returns 1×201 and 19×500. The PostgreSQL log says "deadlock detected" between INSERTs. Best fix?|||Sau khi thêm ràng buộc EXCLUDE, 20 lượt đặt giống nhau cùng lúc trả 1×201 và 19×500. Log PostgreSQL ghi "deadlock detected" giữa các INSERT. Sửa tốt nhất?', [
        'Drop the constraint|||Bỏ ràng buộc',
        'Raise deadlock_timeout|||Tăng deadlock_timeout',
        'Serialise writes per room (advisory lock in the transaction) and keep the constraint|||Xếp hàng các lượt ghi theo phòng (khoá tư vấn trong giao dịch) và giữ ràng buộc',
        'Return 500 as 409 without investigating|||Đổi 500 thành 409 mà không điều tra',
      ], 2, 'EN: The final fix gave 1×201 + 19×409 in every round; EXCLUDE stays as the last guard. 12.3.|||VI: Bản sửa cuối cho 1×201 + 19×409 ở mọi vòng; EXCLUDE giữ làm lưới cuối. 12.3.'),
      q('Swap(a, b) and swap(b, a) run together and one dies with 40P01. The durable fix:|||Đổi(a, b) và đổi(b, a) chạy cùng lúc và một bên chết với 40P01. Cách sửa bền:', [
        'Retry forever|||Thử lại mãi mãi',
        'Use a bigger connection pool|||Dùng pool kết nối lớn hơn',
        'Remove the transaction|||Bỏ giao dịch',
        'Lock the rows in a consistent order (smaller id first)|||Khoá các dòng theo thứ tự nhất quán (id nhỏ trước)',
      ], 3, 'EN: PostgreSQL docs 13.3.4: acquire locks in a consistent order. 37/40 → 0/40 errors. 7.4, 12.3.|||VI: Tài liệu PostgreSQL 13.3.4: xin khoá theo thứ tự nhất quán. 37/40 → 0/40 lỗi. 7.4, 12.3.'),
      q('Two heap snapshots around 2,000 closed SSE connections show +2,000 ServerResponse, +2,000 Socket, +2,001 Timeout. Where do you look next?|||Hai heap snapshot kẹp 2.000 kết nối SSE đã đóng cho thấy +2.000 ServerResponse, +2.000 Socket, +2.001 Timeout. Nhìn tiếp vào đâu?', [
        'Retainers of one ServerResponse|||Retainers của một ServerResponse',
        'The largest string|||Chuỗi lớn nhất',
        'GC settings|||Cấu hình GC',
        'The V8 version|||Phiên bản V8',
      ], 0, 'EN: Retainers showed Timeout → closure → res: a setInterval never cleared on close. 8.4, 12.3.|||VI: Retainers cho thấy Timeout → closure → res: một setInterval không được dọn khi đóng. 8.4, 12.3.'),
      q('Admin renames a room; students see the old name for minutes; Ctrl+F5 does not help; X-Cache: HIT. Where is the stale copy?|||Quản trị đổi tên phòng; sinh viên thấy tên cũ nhiều phút; Ctrl+F5 không đỡ; X-Cache: HIT. Bản sao cũ nằm đâu?', [
        'Browser cache|||Bộ đệm trình duyệt',
        'In-memory cache of the service that copies the data (dat-api)|||Bộ đệm trong bộ nhớ của dịch vụ sao chép dữ liệu (dat-api)',
        'The database|||Trong CSDL',
        'DNS|||DNS',
      ], 1, 'EN: lich-api already had the new name; dat-api served HIT; age=2 for up to 600 s. Fixed with LISTEN/NOTIFY. 8.3, 12.3.|||VI: lich-api đã có tên mới; dat-api trả HIT; age=2 tới 600 s. Sửa bằng LISTEN/NOTIFY. 8.3, 12.3.'),
      q('git bisect run npm test blames a "wip" commit that does not even load. What went wrong?|||git bisect run npm test đổ cho một commit "wip" mà mã còn không nạp được. Sai ở đâu?', [
        'bisect is broken|||bisect bị hỏng',
        'The good tag is wrong|||Tag tốt bị sai',
        'The test did not cover the bug, and "cannot load" was reported as bad instead of 125|||Test không phủ lỗi, và "không nạp được" bị báo là xấu thay vì 125',
        'There were too many commits|||Có quá nhiều commit',
      ], 2, 'EN: The correct script skipped 3 commits and found the < → <= refactor. 9.1, 12.3.|||VI: Script đúng bỏ qua 3 commit và tìm ra refactor đổi < thành <=. 9.1, 12.3.'),
      q('A bug only appears in production. Which action is NOT appropriate as a first step?|||Một lỗi chỉ xuất hiện trên production. Việc nào KHÔNG phù hợp làm bước đầu?', [
        'Check /health for version and commit|||Xem /health để biết phiên bản và commit',
        'Search logs by request id|||Tìm log theo request id',
        'Compare configuration with staging|||So cấu hình với staging',
        'Attach a debugger and set a breakpoint on the hot path|||Gắn debugger và đặt breakpoint trên đường xử lý chính',
      ], 3, 'EN: A breakpoint pauses real users\' requests. Read-only first. Chapter 10.|||VI: Breakpoint làm dừng request của người dùng thật. Chỉ đọc trước. Chương 10.'),
      q('Which regression test do you trust?|||Bạn tin test chặn tái phát nào?', [
        'One you saw fail on the old code for the reported reason, then pass on the fix|||Test bạn đã thấy hỏng trên mã cũ đúng vì lỗi đã báo, rồi qua trên bản sửa',
        'One that passes on both versions|||Test qua trên cả hai bản',
        'One that checks the status is 200|||Test kiểm trạng thái là 200',
        'One written after merging|||Test viết sau khi merge',
      ], 0, 'EN: The hasty "returns 200" test in 11.4 was green on the buggy build. 11.2, 11.4.|||VI: Test vội "trả về 200" ở 11.4 xanh cả trên bản lỗi. 11.2, 11.4.'),
      q('You attach a HAR file to a bug report. What must you do first?|||Bạn đính kèm tệp HAR vào bug report. Phải làm gì trước?', [
        'Compress it|||Nén nó',
        'Remove secrets — cookies, tokens, passwords, also in bodies and URLs|||Gỡ bí mật — cookie, token, mật khẩu, cả trong body và URL',
        'Convert it to PDF|||Đổi sang PDF',
        'Nothing; Chrome sanitizes everything|||Không cần; Chrome đã che hết',
      ], 1, 'EN: Chrome\'s sanitized export still left the password, a token in the body and a token in the URL (11.1). Okta 10/2023.|||VI: Bản xuất "sanitized" của Chrome vẫn còn mật khẩu, token trong body và token trong URL (11.1). Okta 10/2023.'),
      q('A five-whys ends with "because Minh forgot". What should a blameless postmortem do instead?|||5 Whys kết thúc ở "vì Minh quên". Postmortem không đổ lỗi nên làm gì thay?', [
        'Name Minh in the summary|||Nêu tên Minh trong phần tóm tắt',
        'Add "be more careful" as an action|||Thêm "cẩn thận hơn" vào hành động',
        'List contributing factors in the system (no constraint, sequential tests, single-run check) with owned actions|||Liệt kê các yếu tố góp phần trong hệ thống (không ràng buộc, test tuần tự, kiểm một lần) kèm hành động có người nhận',
        'Skip the postmortem|||Bỏ qua postmortem',
      ], 2, 'EN: The LAB-1206 postmortem lists five factors and four owned actions. 11.3, 12.4.|||VI: Postmortem LAB-1206 liệt kê năm yếu tố và bốn hành động có người nhận. 11.3, 12.4.'),
      q('After a whole day on one ticket you are stuck. What do you bring to the senior?|||Sau cả ngày với một ticket, bạn bế tắc. Bạn mang gì tới người đi trước?', [
        '"It doesn\'t work, can you look?"|||"Nó không chạy, anh xem giúp em?"',
        'The whole codebase zipped|||Nén cả mã nguồn',
        'A screenshot of the error only|||Chỉ một ảnh chụp lỗi',
        'The reproduction, what you ruled out and how, and one specific question|||Bản tái hiện, những gì đã loại trừ và bằng cách nào, và một câu hỏi cụ thể',
      ], 3, 'EN: The journal from 12.1 is exactly this. 12.5.|||VI: Nhật ký ở 12.1 chính là thứ này. 12.5.'),
    ],
  },
};
