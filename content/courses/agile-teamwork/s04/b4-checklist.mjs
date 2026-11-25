/**
 * 4.4 — Checklist review (agl-4-4-checklist). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT (scratchpad/agt/lab/ch4): kb-bao-mat.sh — API "Lịch của tôi" v1/v2 (JDK HttpServer + JDBC, Java 25) trên PostgreSQL 16
 * (container agt-pg4, 2g/2 CPU, đã xoá), 7 lời gọi curl mỗi bản; soat-diff.mjs trên diff v1 và diff v1→v2; goto-fail.c với GCC 16.1.1
 * (không cờ vs -Wall ⇒ -Wmisleading-indentation); bai-tap-44.mjs (luật nghi IDOR) — qua ./_ma.mjs.
 * Nguồn (đọc 24/11): Wikipedia "Unreachable code" (CVE-2014-1266 "goto fail", hai goto fail liên tiếp bỏ qua bước kiểm chữ ký);
 * OWASP Top 10:2021 A01 Broken Access Control. Liên kết chéo: web-security 1.1 (SQLi), 3.1 (IDOR), testing 5.2 (401/403/404).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { java } from '../../spring-boot/_chung.mjs';
import { MA, RA } from './_ma.mjs';

const ca = (src, n) => src.split(/\n(?=## )/).find((x) => x.startsWith(`## ${n}.`));
const [SD1, SD2] = RA.soatDiff.split(/\n\n(?=\$ git diff --no-index v1)/);
const doan = (src, a, b) => src.split('\n').slice(a - 1, b).join('\n');

export const L44 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.4', 'Chương 4 · Bài 4.4', `
<h2>${t('4.4 — A review checklist', '4.4 — Checklist review')}</h2>
<p class="lead">${t(
    'Reviewers do not miss bugs because they are stupid; they miss them because they look at what the diff shows and forget what it does not show — a missing condition, a missing check, a missing test. A checklist puts the invisible questions in front of you every time. This lesson builds LabFlow’s checklist in priority order, splits it into what a script can catch and what only a human can, and proves each item with a real attack on the leader’s PR from 4.2.',
    'Người review bỏ sót lỗi không phải vì kém; họ bỏ sót vì nhìn vào thứ diff cho thấy và quên thứ diff không cho thấy — một điều kiện thiếu, một phép kiểm thiếu, một test thiếu. Checklist đặt những câu hỏi vô hình đó trước mắt bạn mỗi lần. Bài này dựng checklist của LabFlow theo thứ tự ưu tiên, tách thành phần script bắt được và phần chỉ con người bắt được, và chứng minh từng mục bằng một đòn tấn công thật vào PR của trưởng nhóm ở bài 4.2.')}</p>

<h3>${t('Everyday picture: the pre-flight checklist', 'Liên tưởng đời thường: checklist trước khi cất cánh')}</h3>
<p>${t(
    'Experienced pilots still read a checklist before every take-off — not because they forgot how to fly, but because the deadly mistakes are the boring omissions (a lock left on, a switch not flipped) that expertise makes you skip. A code review checklist is the same: short, ordered by danger, and read every time, especially when you are tired or the author is someone you trust.',
    'Phi công nhiều kinh nghiệm vẫn đọc checklist trước mỗi lần cất cánh — không phải vì quên cách bay, mà vì lỗi chết người là những thiếu sót nhàm chán (quên mở một chốt, quên gạt một công tắc) mà sự thành thạo khiến người ta bỏ qua. Checklist review cũng vậy: ngắn, xếp theo mức nguy hiểm, và đọc mỗi lần, nhất là khi bạn mệt hoặc tác giả là người bạn tin tưởng.')}</p>

<h3>${t('LabFlow’s checklist, in priority order', 'Checklist của LabFlow, theo thứ tự ưu tiên')}</h3>
${bang(['#', t('Area', 'Hạng mục'), t('Question to ask', 'Câu cần hỏi'), t('How to check quickly', 'Kiểm nhanh thế nào')], [
    ['1', t('Correct', 'Đúng'), t('Does each acceptance criterion of the ticket have code that implements it? Edge cases: empty, duplicate, overlapping time, past dates?', 'Mỗi tiêu chí chấp nhận của ticket có dòng mã thực hiện chưa? Ca biên: rỗng, trùng, trùng giờ, ngày đã qua?'), t('Open the ticket next to the diff; tick each AC; run the PR locally for anything with UI.', 'Mở ticket cạnh diff; tick từng AC; chạy PR trên máy với phần có giao diện.')],
    ['2', t('Access', 'Quyền'), t('For every query by id: whose data is this, and is that checked on the <strong>server</strong>? Missing login ⇒ 401, not 200.', 'Với mỗi truy vấn theo id: dữ liệu này của ai, và có kiểm ở <strong>phía máy chủ</strong> không? Thiếu đăng nhập ⇒ 401, không phải 200.'), t('Call the API as user A with user B’s id. Hiding a button in React is not a check.', 'Gọi API với tư cách người A bằng id của người B. Ẩn nút trong React không phải là kiểm quyền.')],
    ['3', t('Input', 'Đầu vào'), t('Is every value that reaches SQL, a shell, a file path or HTML passed as a parameter or escaped?', 'Mọi giá trị đi tới SQL, lệnh shell, đường dẫn tệp hay HTML đều đi qua tham số hoặc được thoát chưa?'), t('Search the diff for string concatenation into queries; type a single quote into each field.', 'Tìm trong diff chỗ nối chuỗi vào câu truy vấn; gõ một dấu nháy vào từng ô.')],
    ['4', t('Data exposure', 'Lộ dữ liệu'), t('Does the response or log contain fields the caller should not see (notes, phone numbers, emails, stack traces, SQL)?', 'Phản hồi hay log có trường người gọi không được thấy không (ghi chú, SĐT, email, stack trace, câu SQL)?'), t('Read one real response; trigger one error.', 'Đọc một phản hồi thật; cố tình gây một lỗi.')],
    ['5', t('Data integrity', 'Toàn vẹn dữ liệu'), t('Transactions around read-then-write; database constraints for rules (unique, check, foreign key); migration order (3.3).', 'Giao dịch quanh cặp đọc-rồi-ghi; ràng buộc CSDL cho luật (unique, check, khoá ngoại); thứ tự migration (3.3).'), t('Ask "what if two people press the button at the same time?"', 'Hỏi "nếu hai người bấm nút cùng lúc thì sao?"')],
    ['6', 'Test', t('Is there a test for the main AC and for the case that would hurt most (another user’s id, overlapping booking)?', 'Có test cho AC chính và cho ca gây hại nhất chưa (id của người khác, lịch trùng giờ)?'), t('Read tests first — they tell you what the author thinks the code does (', 'Đọc test trước — test cho biết tác giả nghĩ mã làm gì (') + cs('testing', 'tst-10-3-review', 'Testing 10.3') + ').'],
    ['7', t('Readable', 'Dễ đọc'), t('Names, function length, a comment for every "why" that is not obvious, no duplicate of existing code.', 'Tên, độ dài hàm, chú thích cho mọi "vì sao" không hiển nhiên, không chép lại mã đã có.'), t('Could another member change this screen next month without asking?', 'Tháng sau một thành viên khác sửa được màn này mà không phải hỏi không?')],
    ['8', t('Performance', 'Hiệu năng'), t('Queries inside loops (N+1), missing index for a new filter column, loading whole tables.', 'Truy vấn trong vòng lặp (N+1), thiếu chỉ mục cho cột lọc mới, tải nguyên bảng.'), t('Count queries for one page load in the log.', 'Đếm số truy vấn cho một lần tải trang trong log.')],
  ])}
${note(t('Style (quotes, spacing, import order) is not on the list: a formatter and linter in CI decide it (chapter 3). Every minute a human spends on style is a minute not spent on items 1–4.', 'Văn phong (dấu nháy, khoảng trắng, thứ tự import) không có trong danh sách: formatter và linter trong CI quyết (chương 3). Mỗi phút con người dành cho văn phong là một phút không dành cho mục 1–4.'))}

<h3>${t('Lab — the leader’s PR, attacked for real', 'Lab — PR của trưởng nhóm, bị tấn công thật')}</h3>
<p>${t('PR #31 (S23 "My bookings") as C1 opened it. To keep the lab small the controller is written with the JDK’s built-in HTTP server and plain JDBC; in Spring Boot it would be a <code>@GetMapping</code> with <code>JdbcTemplate</code> and the bugs would be identical. The logged-in user comes from a header instead of a session, for the same reason.', 'PR #31 (S23 "Lịch của tôi") đúng như C1 mở. Để lab gọn, controller viết bằng máy chủ HTTP có sẵn của JDK và JDBC thuần; trong Spring Boot nó là một <code>@GetMapping</code> dùng <code>JdbcTemplate</code> và lỗi y hệt. Người đăng nhập lấy từ một header thay cho phiên đăng nhập, cùng lý do.')}</p>
${java(MA.apiV1)}
<p>${t('Test data: three students, one lab manager, four bookings — two with private notes:', 'Dữ liệu thử: ba sinh viên, một quản lý lab, bốn lịch — hai lịch có ghi chú riêng tư:')}</p>
${out(MA.duLieu)}
<p>${t('The script that starts PostgreSQL 16 in a memory-limited container, runs each version and calls it seven times (the full file is in the lab folder):', 'Script khởi động PostgreSQL 16 trong container giới hạn bộ nhớ, chạy từng bản và gọi nó bảy lần (cả tệp nằm trong thư mục lab):')}</p>
${out(doan(MA.kbBaoMat, 1, 14))}
<p>${t('Version 1 — the normal case works, which is all the author tested:', 'Bản 1 — ca bình thường chạy đúng, và đó là tất cả những gì tác giả đã thử:')}</p>
${out(RA.baoMatV1.split('\n## 2.')[0])}
<p>${t('Now the checklist questions, one by one:', 'Giờ đến các câu hỏi của checklist, từng câu một:')}</p>
${out([2, 3, 4, 5, 7].map((n) => ca(RA.baoMatV1, n).replace(/\n## log máy chủ[\s\S]*$/, '')).join('\n'))}
${cl('danger', `<p><strong>${t('Five checklist items, five failures', 'Năm mục checklist, năm lần trượt')}</strong></p><ul>
<li>${t('<strong>#2 Access — IDOR.</strong> An changed 101 to 102 and read Bình’s booking with a private note. Nothing in the diff <em>looks</em> wrong: the bug is the condition that is not there.', '<strong>#2 Quyền — IDOR.</strong> An đổi 101 thành 102 và đọc được lịch của Bình kèm ghi chú riêng. Không gì trong diff <em>trông</em> sai cả: lỗi là điều kiện không có mặt.')}</li>
<li>${t('<strong>#3 Input — SQL injection.</strong> <code>LAB-1\' or \'1\'=\'1</code> returned every booking of every student, notes and phone number included.', '<strong>#3 Đầu vào — SQL injection.</strong> <code>LAB-1\' or \'1\'=\'1</code> trả mọi lịch của mọi sinh viên, cả ghi chú lẫn số điện thoại.')}</li>
<li>${t('<strong>#2 again — no login, 200.</strong> The header is missing, the SQL compares with <code>null</code>, the API happily answers 200 with an empty list. The frontend cannot tell "not logged in" from "no bookings".', '<strong>#2 lần nữa — không đăng nhập, vẫn 200.</strong> Thiếu header, câu SQL so sánh với <code>null</code>, API vui vẻ trả 200 kèm danh sách rỗng. Giao diện không phân biệt được "chưa đăng nhập" với "không có lịch".')}</li>
<li>${t('<strong>#4 Exposure.</strong> One quote mark and the response contains the full SQL statement and column names — a map for the next attack.', '<strong>#4 Lộ dữ liệu.</strong> Một dấu nháy và phản hồi chứa nguyên câu SQL cùng tên cột — tấm bản đồ cho đòn tấn công tiếp theo.')}</li>
<li>${t('<strong>#3 Output.</strong> A note containing <code>"</code> breaks the JSON; with HTML instead of JSON the same omission is stored XSS.', '<strong>#3 Đầu ra.</strong> Ghi chú chứa <code>"</code> làm vỡ JSON; nếu là HTML thay vì JSON, cùng thiếu sót đó chính là stored XSS.')}</li>
</ul>`)}
<p>${t('Version 2 after review — the diff C2 re-checked (lesson 4.3):', 'Bản 2 sau review — diff mà C2 kiểm lại (bài 4.3):')}</p>
${java(doan(MA.apiV2, 19, 52))}
${out(RA.baoMatV2.split('\n## log máy chủ')[0])}
<p>${t('Same seven calls: another student’s booking is now 404 (not 403, so the attacker cannot even learn the id exists), the injection returns nothing, missing login is 401, the quote gives an empty list instead of SQL, the JSON parses — and the lab manager still sees booking 102 as BR-07 allows. Fixing access control must not break the people who <em>are</em> allowed.', 'Cùng bảy lời gọi: lịch của sinh viên khác giờ là 404 (không phải 403, để kẻ tấn công không biết được id đó có tồn tại), injection không trả gì, thiếu đăng nhập là 401, dấu nháy cho danh sách rỗng thay vì câu SQL, JSON đọc được — và quản lý lab vẫn xem được lịch 102 như BR-07 cho phép. Sửa kiểm quyền không được làm hỏng những người <em>được</em> phép.')}</p>

<h3>${t('What a script catches, and what it cannot', 'Script bắt được gì, và không bắt được gì')}</h3>
<p>${t('Before reading a PR, the reviewer runs the team’s <code>soat-diff.mjs</code>: simple patterns on the added lines, deliberately over-eager, followed by the checklist items no pattern can decide.', 'Trước khi đọc PR, người review chạy <code>soat-diff.mjs</code> của nhóm: các mẫu đơn giản trên những dòng được thêm, cố ý bắt thừa, theo sau là các mục checklist mà không mẫu nào quyết được.')}</p>
${js(MA.soatDiff)}
${out(SD1)}
${out(SD2)}
${cl('info', `<ul>
<li>${t('Line 30 is flagged for the <em>wrong</em> reason: <code>Long.parseLong</code> makes that concatenation harmless. The real bug on that line — no owner condition — is not flagged at all. Tools point; people judge.', 'Dòng 30 bị đánh dấu vì lý do <em>sai</em>: <code>Long.parseLong</code> làm phép nối đó vô hại. Lỗi thật trên dòng đó — thiếu điều kiện chủ — hoàn toàn không bị đánh dấu. Công cụ chỉ chỗ; con người phán xét.')}</li>
<li>${t('The three remaining warnings on v2 are non-blocking (console output, a narrow catch around parsing). The SQL and error-leak findings disappeared because the code changed, not because someone silenced the rule.', 'Ba cảnh báo còn lại ở v2 đều không chặn (in ra console, một catch hẹp quanh việc đọc số). Các phát hiện về SQL và lộ lỗi biến mất vì mã đã đổi, không phải vì ai đó tắt luật.')}</li>
<li>${t('In a real repo the same idea is a SAST tool in CI (Semgrep, CodeQL, SpotBugs) — see ', 'Ở repo thật, cùng ý tưởng là công cụ SAST trong CI (Semgrep, CodeQL, SpotBugs) — xem ') + cs('web-security', 'sec-1-1-sql', 'Web Security 1.1') + t(' for SQL injection in depth and ', ' về SQL injection chuyên sâu và ') + cs('web-security', 'sec-3-1-idor', 'Web Security 3.1') + t(' for IDOR. Automated tests for 401/403/404: ', ' về IDOR. Test tự động cho 401/403/404: ') + cs('testing', 'tst-5-2-xac-thuc', 'Testing 5.2') + '.'}</li>
</ul>`)}

<h3>🕵️ ${t('Hacker’s corner: the line nobody saw — Apple "goto fail" (2014)', 'Góc hacker: dòng không ai thấy — "goto fail" của Apple (2014)')}</h3>
<p>${t(
    'In February 2014 Apple patched CVE-2014-1266 in iOS and macOS: in the TLS code that verifies a server’s signature, a line <code>goto fail;</code> appeared twice in a row. The second one was unconditional, so the final signature check was always skipped and the function returned "success" — any attacker on the same Wi-Fi could impersonate any HTTPS site (',
    'Tháng 2/2014 Apple vá CVE-2014-1266 trên iOS và macOS: trong đoạn mã TLS kiểm chữ ký của máy chủ, dòng <code>goto fail;</code> xuất hiện hai lần liên tiếp. Dòng thứ hai không có điều kiện, nên bước kiểm chữ ký cuối cùng luôn bị bỏ qua và hàm trả về "thành công" — kẻ tấn công cùng mạng Wi-Fi có thể giả làm bất kỳ trang HTTPS nào (')}${ng('https://en.wikipedia.org/wiki/Unreachable_code', 'Wikipedia: Unreachable code')}${t('). The shape, rebuilt minimally (not Apple’s code):', '). Hình dạng lỗi, dựng lại tối giản (không phải mã của Apple):')}</p>
${out(MA.gotoFail)}
${out(RA.gotoFail)}
<p>${t(
    'A forged signature is accepted. In a diff, the duplicated line looks like a harmless copy; indentation makes the eye believe it is guarded. GCC’s <code>-Wall</code> (which includes <code>-Wmisleading-indentation</code>) points straight at it. Two checklist lessons: <strong>turn on the compiler’s and linter’s warnings in CI and treat them as errors</strong>, and <strong>a security-critical path needs a test for the failure case</strong> — "a bad signature must be rejected" would have failed immediately.',
    'Chữ ký giả được chấp nhận. Trong diff, dòng lặp lại trông như một bản sao vô hại; thụt lề khiến mắt tin rằng nó nằm trong if. <code>-Wall</code> của GCC (bao gồm <code>-Wmisleading-indentation</code>) chỉ thẳng vào nó. Hai bài học checklist: <strong>bật cảnh báo của trình biên dịch và linter trong CI và coi chúng là lỗi</strong>, và <strong>đường đi quan trọng về bảo mật cần test cho ca thất bại</strong> — một test "chữ ký sai phải bị từ chối" sẽ đỏ ngay lập tức.')}</p>
<p>${t('Access control failures — the IDOR above — are first in the ', 'Lỗi kiểm soát truy cập — như IDOR ở trên — đứng đầu bảng ')}${ng('https://owasp.org/Top10/A01_2021-Broken_Access_Control/', 'OWASP Top 10:2021 (A01 Broken Access Control)')}${t('. They are the class of bug reviewers miss most, because there is nothing to see.', '. Đó là loại lỗi người review bỏ sót nhiều nhất, vì chẳng có gì để thấy.')}</p>

<h3>${t('At work', 'Đi làm')}</h3>
<p>${t(
    'Outsourcing companies usually have a review checklist per language and per project (often an Excel sheet with "OK / NG / N/A" per item), and customers in finance or healthcare add their own security checklist. Your job as a new member is to know it exists, run it on your own PR before asking for review, and add an item when a bug slips through — "this was missed in review" should end with a new checklist line, not with blame.',
    'Công ty outsourcing thường có checklist review theo ngôn ngữ và theo dự án (hay là tệp Excel với "OK / NG / N/A" cho từng mục), và khách ngành tài chính hay y tế còn thêm checklist bảo mật riêng. Việc của bạn khi mới vào là biết nó tồn tại, tự chạy nó trên PR của mình trước khi nhờ review, và thêm một mục khi có lỗi lọt qua — "lỗi này review bỏ sót" nên kết thúc bằng một dòng checklist mới, không phải bằng việc đổ lỗi.')}</p>

<h3>🧪 ${t('Exercise', 'Bài tập')}</h3>
<p>${t('Add one rule to <code>soat-diff.mjs</code> that flags a query fetching a row <em>only</em> by id (a hint of IDOR). Run it on v1 and v2. Does it catch the bug in v1? Does it flag anything in v2, and is that a real problem?', 'Thêm một luật vào <code>soat-diff.mjs</code> để đánh dấu câu truy vấn lấy một dòng <em>chỉ</em> theo id (dấu hiệu IDOR). Chạy trên v1 và v2. Nó có bắt được lỗi ở v1 không? Nó có đánh dấu gì ở v2 không, và đó có phải vấn đề thật không?')}</p>
${giai(t('Answer', 'Đáp án'), `${js(MA.baiTap44.split('\n').filter((l) => l.includes('nghi IDOR')).join('\n'))}
${out(RA.baiTap44)}
<ul>
<li>${t('v1 line 30 — the real IDOR — is now flagged as blocking.', 'Dòng 30 của v1 — IDOR thật — giờ bị đánh dấu chặn.')}</li>
<li>${t('v2 line 48 is flagged too: <code>select vai from nguoi_dung where id = ?</code>. It reads the <em>caller’s own</em> role with the caller’s own id — a false positive. The reviewer writes that in the thread and moves on. This is why such rules are "hints to check", and why the human part of the checklist stays.', 'Dòng 48 của v2 cũng bị đánh dấu: <code>select vai from nguoi_dung where id = ?</code>. Nó đọc vai trò <em>của chính người gọi</em> bằng id của chính họ — báo nhầm. Người review ghi điều đó vào luồng rồi đi tiếp. Đó là lý do các luật như vậy chỉ là "gợi ý cần kiểm", và vì sao phần con người trong checklist vẫn phải giữ.')}</li>
</ul>`)}

${phongVan([
    [t('"What do you look for first when reviewing a pull request?"', '"Khi review pull request bạn nhìn gì trước tiên?"'), t('Whether it does what the ticket asks — each acceptance criterion — then access control: for every query by id, whose data it is and whether the server checks that. Then input handling, data exposure, integrity, tests, readability, performance. Style is the linter’s job.', 'Nó có làm đúng điều ticket yêu cầu không — từng tiêu chí chấp nhận — rồi tới kiểm quyền: với mỗi truy vấn theo id, dữ liệu của ai và máy chủ có kiểm không. Sau đó là xử lý đầu vào, lộ dữ liệu, toàn vẹn, test, dễ đọc, hiệu năng. Văn phong là việc của linter.')],
    [t('"What is IDOR and why is it hard to catch in review?"', '"IDOR là gì và vì sao khó bắt khi review?"'), t('Insecure direct object reference: the API returns an object by id without checking it belongs to the caller. It is hard to catch because the bug is an absent condition — nothing in the diff looks wrong. I check by calling the endpoint as one user with another user’s id.', 'Insecure direct object reference: API trả một đối tượng theo id mà không kiểm nó có thuộc về người gọi không. Khó bắt vì lỗi là một điều kiện vắng mặt — không gì trong diff trông sai. Mình kiểm bằng cách gọi endpoint với tư cách một người dùng bằng id của người khác.')],
    [t('"Why return 404 instead of 403 for someone else’s resource?"', '"Vì sao trả 404 thay vì 403 cho tài nguyên của người khác?"'), t('403 confirms the id exists, which helps enumeration. 404 reveals nothing. Users who are allowed — like a lab manager — must still get 200.', '403 xác nhận id đó tồn tại, giúp kẻ tấn công dò tìm. 404 không tiết lộ gì. Người được phép — như quản lý lab — vẫn phải nhận 200.')],
    [t('"What does the goto fail bug teach?"', '"Lỗi goto fail dạy điều gì?"'), t('A duplicated unconditional goto in Apple’s TLS code (CVE-2014-1266, 2014) skipped signature verification. Compiler warnings like -Wmisleading-indentation catch that shape, and a test for the failure case — a bad signature is rejected — would have caught it. Review alone is not enough.', 'Một lệnh goto không điều kiện bị lặp trong mã TLS của Apple (CVE-2014-1266, 2014) đã bỏ qua bước kiểm chữ ký. Cảnh báo trình biên dịch như -Wmisleading-indentation bắt được hình dạng đó, và một test cho ca thất bại — chữ ký sai bị từ chối — cũng sẽ bắt được. Chỉ review thôi là không đủ.')],
  ], en)}

${thuatNgu([
    ['IDOR / BOLA', t('Object fetched by id without an ownership check.', 'Lấy đối tượng theo id mà không kiểm quyền sở hữu.')],
    ['SQL injection', t('Input changes the meaning of a query because it was concatenated.', 'Đầu vào làm đổi nghĩa câu truy vấn vì bị nối chuỗi.')],
    ['PreparedStatement', t('Query with <code>?</code> parameters; values never become SQL.', 'Câu truy vấn có tham số <code>?</code>; giá trị không bao giờ thành SQL.')],
    ['SAST', t('Static analysis that scans code for vulnerable patterns.', 'Phân tích tĩnh quét mã tìm mẫu dễ bị tấn công.')],
    ['false positive', t('A tool flags something that is not a problem.', 'Công cụ đánh dấu thứ không phải vấn đề.')],
    ['-Wall / -Werror', t('Enable common warnings / treat warnings as errors.', 'Bật các cảnh báo phổ biến / coi cảnh báo là lỗi.')],
    ['N+1', t('One query for a list, then one more per item.', 'Một truy vấn cho danh sách, rồi thêm một truy vấn cho mỗi phần tử.')],
  ], en)}

${tomTat([
    t('Checklist order: correct → access → input → exposure → integrity → tests → readable → performance; style is automated.', 'Thứ tự checklist: đúng → quyền → đầu vào → lộ dữ liệu → toàn vẹn → test → dễ đọc → hiệu năng; văn phong để máy lo.'),
    t('The worst bugs are missing lines: check them by attacking (another user’s id, a quote, no login, an error).', 'Lỗi tệ nhất là dòng còn thiếu: kiểm bằng cách tấn công (id người khác, dấu nháy, không đăng nhập, gây lỗi).'),
    t('PR #31: 7 real calls found IDOR, SQL injection, 200 without login, SQL in error, broken JSON; v2 fixed all and kept the lab manager’s access.', 'PR #31: 7 lời gọi thật tìm ra IDOR, SQL injection, 200 khi chưa đăng nhập, lộ SQL trong lỗi, JSON vỡ; v2 sửa hết mà vẫn giữ quyền của quản lý lab.'),
    t('Scripts point (and sometimes point wrongly); people judge. Compiler and linter warnings belong in CI.', 'Script chỉ chỗ (đôi khi chỉ sai); con người phán xét. Cảnh báo trình biên dịch và linter thuộc về CI.'),
    t('goto fail (2014): a duplicated line skipped signature checks — a warning and a failure-case test would have caught it.', 'goto fail (2014): một dòng lặp bỏ qua bước kiểm chữ ký — một cảnh báo và một test ca thất bại đã có thể bắt được.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-4-5-lab', t('4.5 — Lab: a review day on LabFlow', '4.5 — Lab: một ngày review của LabFlow'))}.</p>
`);
};

export default {
  title: '4.4 — A review checklist|||4.4 — Checklist review',
  slug: 'agl-4-4-checklist',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Checklist review LabFlow theo thứ tự ưu tiên (đúng, quyền, đầu vào, lộ dữ liệu, toàn vẹn, test, dễ đọc, hiệu năng); lab chạy thật trên PostgreSQL 16: PR #31 của trưởng nhóm bị 7 lời gọi curl lộ IDOR, SQL injection, 200 khi chưa đăng nhập, lộ câu SQL, JSON vỡ — bản sau review sửa hết; script soat-diff.mjs bắt được gì và không bắt được gì; góc hacker: goto fail của Apple 2014 dựng lại bằng C, GCC -Wall chỉ ra; OWASP A01.',
  content: L44(true) + L44(false),
};
