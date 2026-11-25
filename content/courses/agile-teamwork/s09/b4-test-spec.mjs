/**
 * 9.4 — Test spec và test case dạng Excel: các cột, evidence, checklist UT (agl-9-4-test-spec). Soạn 24/11/2026.
 * Output test: chạy thật `npm test` (node --test, Node 22.22.2) trong scratchpad/agl/lab/dang-ky, lần 1 (trước sửa) và lần 2 (sau sửa);
 * evidence curl: máy chủ thật 127.0.0.1:43117. Số tổng hợp: LibreOffice tính COUNTIF trên TestSpec-mau_SCR-PAT-REG-01.xlsx.
 * Ranh giới: ma trận Unit Test Case/PCL kiểu Nhật + N/A/B + coverage đã dạy kỹ ở SWT301 Lab 2 (Academy) — ở đây chỉ nhắc và liên kết.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, bash, ac, ag, cs, vo, taiMau } from '../_chung.mjs';
import { TS, LOI, bangHtml, tsv } from '../_mau.mjs';

const LAN1 = out(`$ npm test
> agl-dang-ky@1.0.0 test
> node --test --test-reporter=spec test/*.test.mjs

✔ TC-REG-001 Dữ liệu hợp lệ đủ 7 mục ⇒ 201, MSG-I001, chuyển SCR-PAT-REG-02 (52.221213ms)
✔ TC-REG-002 Bỏ trống cả 7 mục ⇒ 7 lỗi cùng lúc (2.422175ms)
… (TC-REG-003 → TC-REG-017: 15 dòng ✔, lược bớt)
✔ TC-REG-018 Email đã có (giống hệt) ⇒ 409, MSG-E005 (39.385215ms)
✖ TC-REG-019 Email đã có nhưng khác hoa/thường (QA-001) ⇒ 409, MSG-E005 (89.009112ms)
✔ TC-REG-020 Mật khẩu lưu dạng băm, không lưu bản rõ (50.371332ms)
ℹ tests 20
ℹ suites 0
ℹ pass 19
ℹ fail 1
…
✖ failing tests:

test at test/dang-ky.test.mjs:52:1
✖ TC-REG-019 Email đã có nhưng khác hoa/thường (QA-001) ⇒ 409, MSG-E005 (89.009112ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  201 !== 409`);

const SUA = out(`$ diff -u /tmp/agl-kho-cu.mjs src/kho.mjs      # bản trước khi sửa ↔ bản sau (chỉ giữ các dòng đổi, bỏ dòng tiêu đề và ngữ cảnh)
-    demEmail(email) { return hang.filter((h) => h.email === email).length; },   // SELECT COUNT(*) … WHERE email = :email
+    // QA-001 (khách trả lời 25/11): so email KHÔNG phân biệt hoa/thường; vẫn lưu nguyên như người dùng gõ.
+    demEmail(email) { return hang.filter((h) => h.email.toLowerCase() === email.toLowerCase()).length; },   // … WHERE LOWER(email) = LOWER(:email)`);

const LAN2 = out(`$ npm test
…
✔ TC-REG-019 Email đã có nhưng khác hoa/thường (QA-001) ⇒ 409, MSG-E005 (…ms)
✔ TC-REG-020 Mật khẩu lưu dạng băm, không lưu bản rõ (47.295141ms)
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 924.8133`);

const EV1 = out(`$ curl -s -i -X POST http://127.0.0.1:43117/api/patients/register -H "content-type: application/json" -d @hop-le.json
HTTP/1.1 201 Created
content-type: application/json; charset=utf-8
Date: Tue, 24 Nov 2026 05:50:26 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"id":1,"ma":"MSG-I001","chuyenToi":"SCR-PAT-REG-02"}`);
const EV19 = out(`$ curl -s -X POST http://127.0.0.1:43117/api/patients/register -H "content-type: application/json" -d @hoa-thuong.json
{"loi":{"email":{"ma":"MSG-E005","noiDung":"Email này đã được đăng ký."}}}`);

const TONG = out(`Tổng hợp (sheet do LibreOffice tính bằng COUNTIF trên cột "Trạng thái")
Chỉ số / Metric,Giá trị / Value
Tổng số test case,22
Pass,20
Fail,0
Blocked,1
N/A,1
Chưa chạy (Untested),0
Tỉ lệ Pass trên số đã chạy (%),100
Số bug tìm được,1`);

const DEM_DONG = out(`$ grep -vcE '^\\s*(//.*)?$' src/*.mjs        # dòng code, bỏ dòng trống và dòng chú thích
src/dang-ky.mjs:9
src/kho.mjs:16
src/kiem-tra.mjs:48
src/server.mjs:21`);

export const L94 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Outsourcing projects', 'Chương 9 · Dự án outsourcing', `
<h2>${t('9.4 — Test specifications and test cases in Excel: columns, evidence, UT checklists', '9.4 — Test spec và test case dạng Excel: các cột, evidence, checklist UT')}</h2>
<p class="lead">${t(
    'On an outsourcing project, a test that is not written down did not happen. The customer pays for tested software and wants proof: a test specification listing every case, the actual result of each run, a screenshot or log for the important ones, and a report with numbers. This lesson builds that package for the registration screen from lesson 9.3 — with real test runs, a real bug and a real retest.',
    'Ở dự án outsourcing, test mà không ghi lại thì coi như chưa test. Khách trả tiền cho phần mềm đã được kiểm và muốn bằng chứng: một test spec liệt kê mọi case, kết quả thực tế mỗi lần chạy, ảnh chụp hoặc log cho các case quan trọng, và một báo cáo có số liệu. Bài này dựng trọn gói đó cho màn hình đăng ký ở bài 9.3 — với lần chạy test thật, một bug thật và một lần test lại thật.')}</p>

${cl('info', t('<strong>Where the theory lives.</strong> Equivalence partitioning, boundary values and decision tables are taught in ', '<strong>Lý thuyết nằm ở đâu.</strong> Phân vùng tương đương, giá trị biên, bảng quyết định được dạy ở ') + ac('software-testing', 'swt301-test-types', 'SWT301 ch2') + t(' and the course ', ' và khoá ') + cs('testing', 'tst-1-1-cau-truc', 'Testing') + t('. The Japanese-style <em>Unit Test Case matrix</em> (PCL: conditions × UTCID columns, N/A/B types, 100 % coverage evidence) is taught in depth in ', '. <em>Ma trận Unit Test Case</em> kiểu Nhật (PCL: điều kiện × cột UTCID, loại N/A/B, evidence coverage 100 %) được dạy kỹ ở ') + ac('software-testing', 'swt301-lab2-template-worked', 'SWT301 Lab 2 (L2.8)') + t('. This lesson covers the <em>row-style</em> test specification used for function, integration and system testing, plus evidence and the test report — what a developer hands over every sprint.', '. Bài này dạy <em>test spec dạng hàng</em> dùng cho test chức năng, tích hợp và hệ thống, cùng evidence và báo cáo test — thứ lập trình viên bàn giao mỗi sprint.'))}

<h3>${t('Everyday analogy', 'Liên tưởng đời thường')}</h3>
<p>${t('A vehicle inspection centre does not tell you "the car is fine". It hands you a sheet: 40 numbered checks, each with a measured value, pass/fail, the inspector\'s name and the date, and photos of the problems. A test spec is that sheet for software.', 'Trạm đăng kiểm không nói với bạn "xe ổn". Họ đưa một tờ phiếu: 40 hạng mục đánh số, mỗi mục có giá trị đo, đạt/không đạt, tên người kiểm, ngày, và ảnh chụp chỗ hỏng. Test spec là tờ phiếu đó cho phần mềm.')}</p>

<h3>${t('The columns you will meet', 'Các cột bạn sẽ gặp')}</h3>
${bang([t('Column', 'Cột'), t('What to write', 'Ghi gì'), t('Typical mistake', 'Lỗi hay gặp')], [
    ['No / TC ID', t('Stable unique ID (TC-REG-019). Never renumber after the customer has seen the sheet.', 'Mã duy nhất, cố định (TC-REG-019). Không đánh số lại sau khi khách đã xem.'), t('Re-sorting rows and breaking all references in bug reports', 'Sắp xếp lại hàng làm gãy mọi tham chiếu trong bug')],
    [t('Target', 'Màn hình, mục'), t('Document IDs: ITM-02, BTN-01 step 3', 'Mã tài liệu: ITM-02, BTN-01 bước 3'), t('"Email field" with no ID', '"Ô email" mà không có mã')],
    [t('Viewpoint (観点)', 'Quan điểm kiểm (観点)'), t('What aspect is checked: boundary, format, duplicate, security…', 'Khía cạnh được kiểm: biên, định dạng, trùng, bảo mật…'), t('Copying the step text here', 'Chép lại câu ở cột bước')],
    [t('Precondition', 'Điều kiện trước'), t('Data and state before the test (table empty, user X exists, system date)', 'Dữ liệu và trạng thái trước khi test (bảng rỗng, đã có user X, ngày hệ thống)'), t('Missing — the test cannot be repeated', 'Bỏ trống — không ai lặp lại được test')],
    [t('Steps', 'Bước'), t('Numbered, executable by someone else', 'Đánh số, người khác làm theo được'), t('"Test the screen"', '"Test màn hình"')],
    [t('Data', 'Dữ liệu'), t('Exact values', 'Giá trị chính xác'), t('"Invalid email"', '"Email sai"')],
    [t('Expected result', 'Kết quả mong đợi'), t('Exact, checkable: message ID and text, HTTP status, DB state', 'Chính xác, kiểm được: mã và câu thông báo, mã HTTP, trạng thái DB'), t('"Works correctly", "shows an error"', '"Hoạt động đúng", "hiện lỗi"')],
    [t('Actual result', 'Kết quả thực tế'), t('"As expected", or exactly what happened', '"Như mong đợi", hoặc chính xác điều đã xảy ra'), t('Left empty for passed cases', 'Bỏ trống với case Pass')],
    [t('Status', 'Trạng thái'), 'Pass / Fail / Blocked / N/A / ' + t('(empty = not run)', '(trống = chưa chạy)'), t('Marking Pass before running', 'Ghi Pass trước khi chạy')],
    ['Evidence', t('File name of the screenshot/log: EV_TC-REG-019_01', 'Tên tệp ảnh/log: EV_TC-REG-019_01'), t('Screenshots without names', 'Ảnh không đặt tên')],
    [t('Tester, date', 'Người test, ngày'), t('Who ran it, when', 'Ai chạy, khi nào'), t('Filled once for the whole sheet', 'Điền một lần cho cả sheet')],
    ['Bug ID', t('Link to the defect list when Fail', 'Liên kết sang danh sách lỗi khi Fail'), t('Bug fixed silently, no record', 'Sửa lặng lẽ, không ghi lại')],
  ])}

<h3>${t('Statuses — use them honestly', 'Trạng thái — dùng cho trung thực')}</h3>
<ul>
<li>${t('<strong>Pass</strong>: run, result equals the expected result exactly.', '<strong>Pass</strong>: đã chạy, kết quả đúng y kết quả mong đợi.')}</li>
<li>${t('<strong>Fail</strong>: run, result differs. Always with a bug ID.', '<strong>Fail</strong>: đã chạy, kết quả khác. Luôn kèm mã bug.')}</li>
<li>${t('<strong>Blocked</strong>: cannot be run now (environment missing, another bug blocks it). Write why.', '<strong>Blocked</strong>: chưa chạy được (thiếu môi trường, bug khác chặn). Ghi lý do.')}</li>
<li>${t('<strong>N/A</strong>: not applicable in this test level or scope. Write why.', '<strong>N/A</strong>: không áp dụng ở mức test/phạm vi này. Ghi lý do.')}</li>
</ul>
${cl('danger', t('<strong>Never mark Pass for a case you did not run</strong>, and never "fix" a screenshot. Fabricated evidence is not a quality problem, it is dishonesty — companies treat it as a serious disciplinary matter, and customers re-run samples of your cases during acceptance.', '<strong>Không bao giờ ghi Pass cho case chưa chạy</strong>, và không bao giờ "sửa" ảnh chụp. Evidence giả không phải lỗi chất lượng, mà là gian dối — công ty xử lý kỷ luật nặng, và khách sẽ chạy lại một số case của bạn khi nghiệm thu.'))}

<h3>${t('Where test cases come from', 'Test case lấy từ đâu')}</h3>
<p>${t('Walk the DD item table and event table and derive cases systematically — one row of the DD produces several cases:', 'Đi qua bảng mục và bảng sự kiện của DD, rút case có hệ thống — một hàng DD sinh ra nhiều case:')}</p>
${bang([t('DD rule', 'Quy tắc trong DD'), t('Cases', 'Các case')], [
    ['ITM-01 ' + t('required, 1–50', 'bắt buộc, 1–50'), t('empty · only spaces · 50 (boundary) · 51 (boundary + 1) · Vietnamese NFD 50', 'rỗng · chỉ dấu cách · 50 (biên) · 51 (biên + 1) · tiếng Việt NFD 50')],
    ['ITM-02 ' + t('format, ≤ 254, unique', 'định dạng, ≤ 254, không trùng'), t('missing @ · 255 chars · same e-mail · same e-mail different case', 'thiếu @ · 255 ký tự · trùng y hệt · trùng khác hoa/thường')],
    ['ITM-04 ' + t('date ≤ today', 'ngày ≤ hôm nay'), t('impossible date (30/02) · today · tomorrow', 'ngày không có thật (30/02) · hôm nay · ngày mai')],
    ['BTN-01 ' + t('step 4', 'bước 4'), t('password stored hashed · DB error → MSG-E999', 'mật khẩu lưu dạng băm · lỗi DB → MSG-E999')],
    [t('Every Q&amp;A answer', 'Mỗi câu trả lời Q&amp;A'), t('at least one case that proves it (QA-001 → TC-REG-019)', 'ít nhất một case chứng minh nó (QA-001 → TC-REG-019)')],
  ])}

<h3>${t('The sample test specification', 'Test spec mẫu')}</h3>
${taiMau('TestSpec-mau_SCR-PAT-REG-01.xlsx', en)}
${bangHtml(TS, { chiCot: [1, 2, 3, 6, 7, 9, 10, 13, 14] })}
<p>${t('Copy the full sheet (all 15 columns) into Excel or Google Sheets: select the block, copy, click cell A1, paste — each tab becomes a column.', 'Chép nguyên sheet (đủ 15 cột) vào Excel hoặc Google Sheets: bôi đen khối dưới, chép, bấm ô A1, dán — mỗi dấu tab thành một cột.')}</p>
${tsv(TS)}

<h3>${t('Running it for real: first round', 'Chạy thật: vòng 1')}</h3>
<p>${t('The 20 automatable cases are also written as automated tests whose names start with the TC ID, so the runner\'s output maps 1:1 onto the sheet. First round, 24/11:', '20 case tự động hoá được cũng được viết thành test tự động, tên bắt đầu bằng mã TC, nên output của trình chạy khớp 1:1 với sheet. Vòng 1, ngày 24/11:')}</p>
${LAN1}
<p>${t('TC-REG-019 fails: the API accepted <code>An.Nguyen@Example.com</code> although <code>an.nguyen@example.com</code> exists — exactly what QA-001 (answered by the customer) said must be rejected. The tester does three things: status Fail, actual result "201, a second patient was created", and a new row in the defect list:', 'TC-REG-019 hỏng: API nhận <code>An.Nguyen@Example.com</code> dù đã có <code>an.nguyen@example.com</code> — đúng thứ mà QA-001 (khách đã trả lời) nói phải từ chối. Người test làm ba việc: trạng thái Fail, kết quả thực tế "201, tạo thêm bệnh nhân thứ hai", và thêm một dòng vào danh sách lỗi:')}</p>
${bangHtml(LOI)}

<h3>${t('Fix, retest, and update the sheet', 'Sửa, test lại, cập nhật sheet')}</h3>
${SUA}
${LAN2}
<p>${t('Then the API-level evidence for the key cases, captured against the running server (port 43117) — raw request and response, not a retyped summary:', 'Rồi evidence mức API cho các case quan trọng, lấy trên máy chủ đang chạy (cổng 43117) — request và response nguyên văn, không gõ lại tóm tắt:')}</p>
<p><strong>EV_TC-REG-001_01</strong></p>
${EV1}
<p><strong>EV_TC-REG-019_01</strong> ${t('(after BUG-001 was fixed)', '(sau khi sửa BUG-001)')}</p>
${EV19}
<p>${t('The TC-REG-019 row now says Pass, keeps the bug ID, and its note records the history ("Round 1 Fail… retest Pass 25/11"). Do not delete the failure: the history is the evidence that the bug was found and fixed.', 'Dòng TC-REG-019 giờ ghi Pass, giữ mã bug, và cột ghi chú ghi lại lịch sử ("Lần 1 Fail… chạy lại 25/11 Pass"). Đừng xoá lần hỏng: chính lịch sử là bằng chứng bug đã được tìm ra và sửa.')}</p>

<h3>${t('Evidence rules that save you at acceptance', 'Quy tắc evidence giúp bạn khi nghiệm thu')}</h3>
<ol>
<li>${t('<strong>Name by case</strong>: <code>EV_&lt;TC ID&gt;_&lt;nn&gt;</code>, one folder per test round (<code>evidence/round2/</code>).', '<strong>Đặt tên theo case</strong>: <code>EV_&lt;mã TC&gt;_&lt;nn&gt;</code>, mỗi vòng test một thư mục (<code>evidence/lan2/</code>).')}</li>
<li>${t('<strong>Show context</strong>: for UI, the whole window with URL and system clock; for API, the full request and response; for DB, the query and its result.', '<strong>Có bối cảnh</strong>: giao diện thì chụp cả cửa sổ có URL và đồng hồ hệ thống; API thì request và response đầy đủ; DB thì câu truy vấn và kết quả.')}</li>
<li>${t('<strong>Before and after</strong> when state changes (row count before and after INSERT).', '<strong>Trước và sau</strong> khi trạng thái thay đổi (số dòng trước và sau INSERT).')}</li>
<li>${t('<strong>Mask personal data</strong> if you test with anything resembling real data — and preferably never use real data at all (chapter 10).', '<strong>Che dữ liệu cá nhân</strong> nếu test với thứ gì giống dữ liệu thật — tốt nhất là không bao giờ dùng dữ liệu thật (chương 10).')}</li>
<li>${t('<strong>Never edit</strong> a screenshot or log. If it is wrong, re-run.', '<strong>Không chỉnh sửa</strong> ảnh hay log. Sai thì chạy lại.')}</li>
</ol>

<h3>${t('The test report', 'Báo cáo test')}</h3>
<p>${t('A one-page summary that the leader forwards to the customer. The numbers below were computed by the spreadsheet itself (COUNTIF on the Status column):', 'Một trang tóm tắt leader gửi khách. Các số dưới đây do chính bảng tính tính ra (COUNTIF trên cột Trạng thái):')}</p>
${TONG}
<p>${t('Add the quality figures your project tracks. With the lab code:', 'Thêm các chỉ số chất lượng dự án bạn theo dõi. Với mã của lab:')}</p>
${DEM_DONG}
<ul>
<li>${t('Size: 9 + 16 + 48 + 21 = 94 lines ≈ 0.094 KLOC.', 'Kích thước: 9 + 16 + 48 + 21 = 94 dòng ≈ 0,094 KLOC.')}</li>
<li>${t('Test-case density: 22 / 0.094 ≈ 234 cases per KLOC. Bug density: 1 / 0.094 ≈ 10.6 bugs per KLOC.', 'Mật độ test case: 22 / 0,094 ≈ 234 case/KLOC. Mật độ bug: 1 / 0,094 ≈ 10,6 bug/KLOC.')}</li>
<li>${t('Such tiny code inflates every density — on real modules the leader compares your numbers with the project\'s target ranges and asks you to explain anything outside them (too few cases? too few bugs found?).', 'Code nhỏ như vậy làm mọi mật độ phình lên — ở module thật, leader so số của bạn với khoảng mục tiêu của dự án và yêu cầu giải thích chỗ nằm ngoài (ít case quá? tìm ít bug quá?).')}</li>
<li>${t('Conclusion line: "UT completed for SCR-PAT-REG-01: 20 Pass, 1 Blocked (TC-REG-021, DB fault injection — to IT), 1 N/A (UI link — to IT). 1 bug found and fixed. Open: QA-003 (TC-REG-012 run against our proposal)."', 'Dòng kết luận: "Hoàn tất UT SCR-PAT-REG-01: 20 Pass, 1 Blocked (TC-REG-021, giả lập lỗi DB — chuyển IT), 1 N/A (liên kết giao diện — chuyển IT). Tìm và sửa 1 bug. Còn mở: QA-003 (TC-REG-012 chạy theo đề xuất của đội)."')}</li>
</ul>

<h3>${t('A UT self-checklist before you say "done"', 'Checklist tự kiểm UT trước khi nói "xong"')}</h3>
<ul>
<li>${t('Every item, every message ID and every event step in the DD has at least one case.', 'Mọi mục, mọi mã thông báo, mọi bước sự kiện trong DD có ít nhất một case.')}</li>
<li>${t('Every boundary has the value on it and just outside it.', 'Mọi biên có giá trị đúng biên và ngay ngoài biên.')}</li>
<li>${t('Every closed Q&amp;A item has a case; every open one is mentioned in the notes.', 'Mọi Q&amp;A đã đóng có case; Q&amp;A còn mở được nhắc trong ghi chú.')}</li>
<li>${t('No status is empty; every Fail has a bug ID; every Blocked/N/A has a reason.', 'Không trạng thái nào trống; Fail nào cũng có mã bug; Blocked/N/A nào cũng có lý do.')}</li>
<li>${t('Evidence files exist for each referenced name.', 'Tên evidence nào được ghi cũng có tệp thật.')}</li>
<li>${t('The automated tests were re-run after the last code change.', 'Test tự động đã chạy lại sau lần sửa code cuối.')}</li>
</ul>

<h3>${t('Exercise', 'Bài tập')}</h3>
<p>${t('Rewrite these expected results so that a stranger could decide Pass/Fail without asking you.', 'Viết lại các kết quả mong đợi sau để một người lạ quyết được Pass/Fail mà không cần hỏi bạn.')}</p>
<ol>
<li>${t('"An error is shown."', '"Hiện lỗi."')}</li>
<li>${t('"Registration works."', '"Đăng ký được."')}</li>
<li>${t('"The password is safe."', '"Mật khẩu an toàn."')}</li>
</ol>
${giai(t('Suggested answers', 'Đáp án gợi ý'), `<ol>
<li>${t('"MSG-E004 \'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.\' is shown in red under ITM-03; other fields keep their values; no row is added to patient."', '"Hiện MSG-E004 \'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.\' màu đỏ dưới ITM-03; các mục khác giữ giá trị; bảng patient không thêm dòng."')}</li>
<li>${t('"HTTP 201; screen moves to SCR-PAT-REG-02 showing MSG-I001; patient has exactly one new row with status = 0 and the entered e-mail."', '"HTTP 201; chuyển SCR-PAT-REG-02 hiện MSG-I001; bảng patient có đúng một dòng mới, status = 0, email đúng như đã nhập."')}</li>
<li>${t('"password_hash matches scrypt$&lt;32 hex&gt;$&lt;64 hex&gt; and does not contain the plain password."', '"password_hash khớp mẫu scrypt$&lt;32 hex&gt;$&lt;64 hex&gt; và không chứa mật khẩu gốc."')}</li>
</ol>`)}

<h3>${t('Lab: write and run 15 cases yourself', 'Lab: tự viết và chạy 15 case')}</h3>
<p>${t('Take the screen "Change password" (SCR-PAT-PWD-01): items current password, new password (same rule as ITM-05), confirm; messages E001, E006, E007, plus a new MSG-E010 "Mật khẩu hiện tại không đúng." and MSG-E011 "Mật khẩu mới phải khác mật khẩu hiện tại." Write 15 cases in the sheet format, then (optional) automate them like the sample.', 'Lấy màn hình "Đổi mật khẩu" (SCR-PAT-PWD-01): mục mật khẩu hiện tại, mật khẩu mới (cùng quy tắc ITM-05), nhập lại; thông báo E001, E006, E007, thêm MSG-E010 "Mật khẩu hiện tại không đúng." và MSG-E011 "Mật khẩu mới phải khác mật khẩu hiện tại." Viết 15 case theo đúng mẫu sheet, rồi (tuỳ chọn) tự động hoá như bài mẫu.')}</p>
${giai(t('Checklist for grading your 15 cases', 'Checklist chấm 15 case của bạn'), `<ul>
<li>${t('Empty × 3 fields (or one case with all empty asserting three E001)', 'Rỗng × 3 mục (hoặc một case rỗng cả ba kiểm ba E001)')}</li>
<li>${t('New password: 7, 8, 64, 65 characters; letters only; digits only', 'Mật khẩu mới: 7, 8, 64, 65 ký tự; toàn chữ; toàn số')}</li>
<li>${t('Confirm differs → E007; current wrong → E010; new = current → E011', 'Nhập lại khác → E007; hiện tại sai → E010; mới = hiện tại → E011')}</li>
<li>${t('Success: old password no longer works, new one works, hash changed', 'Thành công: mật khẩu cũ không dùng được nữa, mật khẩu mới dùng được, hash đã đổi')}</li>
<li>${t('Order question for Q&amp;A: if current is wrong AND new is invalid, which errors show?', 'Câu hỏi thứ tự cho Q&amp;A: hiện tại sai VÀ mật khẩu mới không hợp lệ thì hiện lỗi nào?')}</li>
</ul>`)}

${phongVan([
    [t('What makes a good test case?', 'Thế nào là một test case tốt?'), t('Repeatable by someone else (precondition, steps, exact data), a single clear viewpoint, an exact checkable expected result, and traceability to a requirement ID.', 'Người khác lặp lại được (điều kiện trước, bước, dữ liệu chính xác), một quan điểm kiểm rõ, kết quả mong đợi chính xác kiểm được, và truy vết được tới mã yêu cầu.')],
    [t('What is the difference between Blocked and Fail?', 'Blocked khác Fail thế nào?'), t('Fail means the test ran and the result was wrong (there is a bug). Blocked means it could not run (environment, dependency, another bug) — no conclusion about the feature yet.', 'Fail là đã chạy và kết quả sai (có bug). Blocked là chưa chạy được (môi trường, phụ thuộc, bug khác) — chưa kết luận gì về chức năng.')],
    [t('Why keep evidence if the tests are automated?', 'Test đã tự động rồi sao còn cần evidence?'), t('The customer cannot run our pipeline; evidence is the auditable record of what ran, when and with which result. Automated test output, logs and coverage reports are themselves evidence — attached and named per case.', 'Khách không chạy được pipeline của mình; evidence là hồ sơ kiểm tra được: chạy gì, khi nào, kết quả ra sao. Output test tự động, log, báo cáo coverage chính là evidence — đính kèm và đặt tên theo case.')],
    [t('You found a bug in your own code during UT. Do you record it?', 'Tự tìm ra bug trong code của mình lúc UT, có ghi lại không?'), t('Yes, per project rules — UT defects feed the quality metrics; hiding them makes UT look useless and distorts the numbers that decide where to review harder.', 'Có, theo quy định dự án — lỗi UT là đầu vào cho số liệu chất lượng; giấu đi làm UT trông như vô ích và làm méo số liệu dùng để quyết định chỗ nào cần review kỹ hơn.')],
  ], en)}

${thuatNgu([
    [t('Test specification (テスト仕様書)', 'Test spec (テスト仕様書)'), t('The list of test cases with expected and actual results', 'Danh sách test case kèm kết quả mong đợi và thực tế')],
    [t('Viewpoint (観点)', 'Quan điểm kiểm (観点)'), t('The aspect a case checks', 'Khía cạnh mà case kiểm')],
    ['Evidence (エビデンス)', t('Proof of a test run: screenshot, log, report', 'Bằng chứng một lần chạy: ảnh, log, báo cáo')],
    ['Pass / Fail / Blocked / N/A', t('Test statuses', 'Các trạng thái test')],
    [t('Defect (bug) list', 'Danh sách lỗi'), t('Record of each bug: steps, expected/actual, severity, cause, status', 'Ghi mỗi bug: bước, mong đợi/thực tế, mức độ, nguyên nhân, trạng thái')],
    [t('Retest / regression test', 'Test lại / test hồi quy'), t('Re-running the failed case / re-running everything after a change', 'Chạy lại case hỏng / chạy lại tất cả sau thay đổi')],
    ['KLOC', t('Thousand lines of code — the size unit for densities', 'Nghìn dòng code — đơn vị kích thước cho mật độ')],
  ], en)}

${tomTat([
    t('Each case: ID, target, viewpoint, precondition, steps, data, exact expected result, actual, status, evidence, tester, date.', 'Mỗi case: mã, đối tượng, quan điểm, điều kiện trước, bước, dữ liệu, mong đợi chính xác, thực tế, trạng thái, evidence, người test, ngày.'),
    t('Derive cases from every DD row, every boundary and every Q&amp;A answer.', 'Rút case từ mọi hàng DD, mọi biên và mọi câu trả lời Q&amp;A.'),
    t('Fail → bug list → fix → retest; keep the history.', 'Fail → danh sách lỗi → sửa → test lại; giữ lịch sử.'),
    t('Evidence named per case, unedited, with context; never fake a Pass.', 'Evidence đặt tên theo case, không chỉnh sửa, có bối cảnh; không bao giờ ghi Pass giả.'),
  ], en)}
<p>${t('Test management theory: ', 'Lý thuyết quản lý test: ')}${ac('software-testing', 'swt301-test-monitoring-control', 'SWT301 7.3')} · ${ac('software-testing', 'swt301-bug-lifecycle', 'SWT301 7.6')}. ${t('Next', 'Tiếp theo')}: ${ag('agl-9-5-qa-cr', t('9.5 — Q&amp;A list and change requests', '9.5 — Q&amp;A list và change request'))}.</p>
`);
};
