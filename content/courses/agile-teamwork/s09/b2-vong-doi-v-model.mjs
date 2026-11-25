/**
 * 9.2 — Vòng đời dự án thực tế: V-model ở dự án Nhật, Agile lai (agl-9-2-vong-doi-v-model). Soạn 24/11/2026.
 * Nguồn: K. Forsberg & H. Mooz, "The Relationship of System Engineering to the Project Cycle" (NCOSE/INCOSE 1991) — V-model;
 * V-Modell của chính phủ Liên bang Đức (bản đầu 1986–1992, V-Modell XT 2005); CMMI Institute — 5 mức trưởng thành
 * (cmmiinstitute.com; CMMI V3.0 phát hành 04/2023). Tên giai đoạn tiếng Nhật theo cách gọi phổ biến của IPA (情報処理推進機構).
 * Số liệu chất lượng (mật độ test/bug) chỉ minh hoạ: mỗi công ty/dự án tự đặt chuẩn — không bịa chuẩn của công ty cụ thể.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, ac, ag, vo } from '../_chung.mjs';

export const L92 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Outsourcing projects', 'Chương 9 · Dự án outsourcing', `
<h2>${t('9.2 — The lifecycle in practice: the V-model on Japanese projects, hybrid Agile', '9.2 — Vòng đời dự án thực tế: V-model ở dự án Nhật, Agile lai')}</h2>
<p class="lead">${t(
    'You have met the V-model in class as a diagram. On a Japanese outsourcing project it is your calendar: which document you read this week, which one you must produce, who reviews it, and what "done" means before the next phase can start. This lesson walks through an ordinary project phase by phase, from the developer\'s chair.',
    'Bạn đã gặp V-model trên lớp dưới dạng một sơ đồ. Ở dự án outsourcing Nhật, nó là lịch làm việc của bạn: tuần này đọc tài liệu nào, phải nộp tài liệu nào, ai review, và thế nào là "xong" trước khi được sang giai đoạn sau. Bài này đi qua một dự án bình thường từng giai đoạn, từ chỗ ngồi của lập trình viên.')}</p>

<h3>${t('Where the V comes from', 'Chữ V từ đâu ra')}</h3>
<p>${t(
    'The V-model was described for systems engineering by Kevin Forsberg and Harold Mooz (1991) and, independently, as the German federal government\'s <em>V-Modell</em> process standard (first versions 1986–1992, V-Modell XT in 2005). The idea: the left arm goes down from requirements to code; the right arm goes up through test levels; <strong>each test level verifies a document on the left arm</strong> (common pairing on Japanese projects: UT ↔ DD, IT ↔ BD, ST ↔ system/non-functional requirements, UAT ↔ business requirements in the RD). The theory — waterfall, V-model, incremental — is taught in ',
    'V-model được Kevin Forsberg và Harold Mooz mô tả cho kỹ thuật hệ thống (1991) và, độc lập, là tiêu chuẩn quy trình <em>V-Modell</em> của chính phủ Liên bang Đức (bản đầu 1986–1992, V-Modell XT năm 2005). Ý tưởng: nhánh trái đi xuống từ yêu cầu tới code; nhánh phải đi lên qua các mức test; <strong>mỗi mức test kiểm một tài liệu ở nhánh trái</strong> (dự án Nhật hay ghép: UT ↔ DD, IT ↔ BD, ST ↔ yêu cầu hệ thống/phi chức năng, UAT ↔ yêu cầu nghiệp vụ RD). Phần lý thuyết — waterfall, V-model, incremental — đã có ở ')}${ac('introduction-to-software-engineering', 'swe201c-waterfall', 'SWE201c 2.1')} ${t('and', 'và')} ${ac('software-testing', 'swt301-ch2-slides-2023', 'SWT301 2.7')}${t('. Here we look at what each step looks like on an ordinary weekday.', '. Ở đây ta xem mỗi bước trông thế nào vào một ngày thường.')}</p>

<pre><code>${t(
`  Requirements (RD) ───────────────────────────────▶ Acceptance test (UAT)   customer
     Basic design (BD) ──────────────────────▶ System test (ST)
        Detailed design (DD) ────────▶ Integration test (IT)
             Coding (PG) ──▶ Unit test (UT)                              offshore team
                      ╲      ╱
                       ╲____╱`,
`  Yêu cầu (RD) ────────────────────────────────────▶ Nghiệm thu (UAT)        khách
     Thiết kế cơ bản (BD) ───────────────────▶ Test hệ thống (ST)
        Thiết kế chi tiết (DD) ──────▶ Test tích hợp (IT)
             Code (PG) ──▶ Unit test (UT)                                  đội offshore
                      ╲      ╱
                       ╲____╱`)}</code></pre>
${note(t('Projects pair the levels slightly differently (some pair BD with IT and RD with ST). Read your project\'s test plan for the exact mapping.', 'Mỗi dự án ghép cặp hơi khác (có nơi ghép BD với IT và RD với ST). Đọc test plan của dự án để biết ghép chính xác.'))}

<h3>${t('The phases, their Japanese names and what you produce', 'Các giai đoạn, tên tiếng Nhật và thứ bạn phải nộp')}</h3>
${bang([t('Phase', 'Giai đoạn'), t('Japanese', 'Tiếng Nhật'), t('Output (deliverable)', 'Sản phẩm phải nộp'), t('Usually done by', 'Thường do ai làm'), t('A junior dev\'s day', 'Một ngày của dev mới')], [
    [t('Requirements definition (RD)', 'Định nghĩa yêu cầu (RD)'), '要件定義 (yōken teigi)', t('Requirements document, function list, non-functional requirements', 'Tài liệu yêu cầu, danh sách chức năng, yêu cầu phi chức năng'), t('Customer (+ vendor PM/BrSE)', 'Khách (+ PM/BrSE vendor)'), t('Rarely involved', 'Hiếm khi tham gia')],
    [t('Basic design (BD)', 'Thiết kế cơ bản (BD)'), '基本設計 (kihon sekkei) / 外部設計', t('Screen list, screen transitions, layouts, item definitions, table list, interface list, message list', 'Danh sách màn hình, luồng chuyển màn hình, bố cục, định nghĩa mục, danh sách bảng, danh sách giao tiếp, danh sách thông báo'), t('Customer or vendor; reviewed by customer', 'Khách hoặc vendor; khách review'), t('Read it to understand the system; ask Q&amp;A', 'Đọc để hiểu hệ thống; đặt Q&amp;A')],
    [t('Detailed design (DD)', 'Thiết kế chi tiết (DD)'), '詳細設計 (shōsai sekkei) / 内部設計', t('Processing per event, validation rules, SQL, class/method design', 'Xử lý từng sự kiện, quy tắc kiểm tra, SQL, thiết kế lớp/hàm'), t('Offshore team', 'Đội offshore'), t('Write or read DD for your screens; DD review', 'Viết hoặc đọc DD màn hình mình; review DD')],
    [t('Coding', 'Lập trình'), '製造 (seizō) / 実装 (PG)', t('Source code, self-check list, code review record', 'Mã nguồn, checklist tự kiểm, biên bản review code'), t('Offshore team', 'Đội offshore'), t('Code, self-review, PR, fix review comments', 'Code, tự review, mở PR, sửa theo nhận xét')],
    [t('Unit test (UT)', 'Unit test (UT)'), '単体テスト (tantai tesuto)', t('UT spec (test cases), evidence, UT report', 'UT spec (test case), evidence, báo cáo UT'), t('The developer who wrote the code', 'Chính dev viết code'), t('Write cases from DD, run, capture evidence', 'Viết case từ DD, chạy, chụp evidence')],
    [t('Integration test (IT)', 'Test tích hợp (IT)'), '結合テスト (ketsugō tesuto)', t('IT spec, evidence, bug list, IT report', 'IT spec, evidence, danh sách bug, báo cáo IT'), t('Tester/QC (+ devs)', 'Tester/QC (+ dev)'), t('Fix bugs assigned to you, retest', 'Sửa bug được giao, test lại')],
    [t('System test (ST)', 'Test hệ thống (ST)'), '総合テスト (sōgō tesuto)', t('ST spec, performance/security results, report', 'ST spec, kết quả hiệu năng/bảo mật, báo cáo'), t('Tester team, sometimes customer', 'Đội tester, đôi khi khách'), t('Fix bugs; support environment', 'Sửa bug; hỗ trợ môi trường')],
    [t('Acceptance test (UAT)', 'Nghiệm thu (UAT)'), '受入テスト (ukeire tesuto)', t('Acceptance result, sign-off', 'Kết quả nghiệm thu, ký nhận'), t('Customer', 'Khách'), t('Hot fixes, answer questions via BrSE', 'Sửa nóng, trả lời câu hỏi qua BrSE')],
  ])}

<h3>${t('What "done" means at each step: review, checklist, record', '"Xong" ở mỗi bước nghĩa là gì: review, checklist, biên bản')}</h3>
<p>${t(
    'A phase is not finished when you stop typing. In a process-driven company (CMMI, ISO 9001) each deliverable passes a small gate:',
    'Một giai đoạn không xong khi bạn ngừng gõ. Ở công ty theo quy trình (CMMI, ISO 9001), mỗi sản phẩm đi qua một cửa kiểm nhỏ:')}</p>
<ol>
<li>${t('<strong>Self-check</strong> against the project checklist (e.g. "every message ID used in code exists in the message sheet", "no hard-coded passwords").', '<strong>Tự kiểm</strong> theo checklist của dự án (ví dụ "mọi mã thông báo dùng trong code đều có trong sheet thông báo", "không có mật khẩu viết cứng").')}</li>
<li>${t('<strong>Peer review</strong> by the leader or a colleague — every comment is written down in a <strong>review record</strong> (who, when, how long, which defects, fixed or not).', '<strong>Review chéo</strong> bởi leader hoặc đồng nghiệp — mọi nhận xét được ghi vào <strong>biên bản review</strong> (ai, khi nào, bao lâu, lỗi gì, đã sửa chưa).')}</li>
<li>${t('<strong>Fix and confirm</strong>: the reviewer checks the fixes and closes the record.', '<strong>Sửa và xác nhận</strong>: người review kiểm phần sửa rồi đóng biên bản.')}</li>
<li>${t('<strong>Baseline</strong>: the document gets a version number and goes into configuration management. Changing it later needs a new version and a change history line.', '<strong>Baseline</strong>: tài liệu có số phiên bản và được đưa vào quản lý cấu hình. Muốn sửa sau đó phải lên phiên bản mới và thêm một dòng lịch sử sửa đổi.')}</li>
</ol>
<p>${t(
    'Why so much paper? Because the company collects <strong>numbers</strong> from these records: review effort, defects found per page of design, test cases per thousand lines of code, bugs per thousand lines, how many bugs escaped from UT to IT. If UT found almost no bugs but IT found many, the QA team will ask whether UT was really done. Each company sets its own target ranges; you will be told yours.',
    'Sao lắm giấy tờ vậy? Vì công ty thu <strong>số liệu</strong> từ chính các biên bản này: công review, số lỗi tìm được trên mỗi trang thiết kế, số test case trên nghìn dòng code, số bug trên nghìn dòng, bao nhiêu bug lọt từ UT sang IT. Nếu UT gần như không thấy bug mà IT lại thấy nhiều, đội QA sẽ hỏi UT có làm thật không. Mỗi công ty tự đặt khoảng mục tiêu; bạn sẽ được phổ biến chuẩn của dự án mình.')}</p>

<h3>${t('CMMI in one table (recognition level)', 'CMMI trong một bảng (mức nhận biết)')}</h3>
<p>${t('Many Vietnamese outsourcing companies advertise a CMMI maturity level. CMMI (Capability Maturity Model Integration) is maintained by the CMMI Institute; version 3.0 was released in 2023. The five maturity levels:', 'Nhiều công ty outsourcing Việt Nam công bố mức trưởng thành CMMI. CMMI (Capability Maturity Model Integration) do CMMI Institute duy trì; phiên bản 3.0 ra năm 2023. Năm mức trưởng thành:')}</p>
${bang([t('Level', 'Mức'), t('Name', 'Tên'), t('What you notice as a developer', 'Bạn nhận thấy gì khi là dev')], [
    ['1', 'Initial', t('Success depends on heroes; every project works differently', 'Thành công nhờ "anh hùng"; mỗi dự án làm một kiểu')],
    ['2', 'Managed', t('Projects have plans, tracked schedules, version control of documents', 'Dự án có kế hoạch, theo dõi tiến độ, quản lý phiên bản tài liệu')],
    ['3', 'Defined', t('Company-wide standard process, templates and checklists you must use', 'Quy trình chuẩn toàn công ty, mẫu và checklist bắt buộc dùng')],
    ['4', 'Quantitatively Managed', t('Quality is managed with numbers: defect density, review rates, targets', 'Quản lý chất lượng bằng số: mật độ lỗi, tỉ lệ review, mục tiêu')],
    ['5', 'Optimizing', t('Numbers drive continuous improvement (root-cause analysis, process changes)', 'Số liệu dẫn dắt cải tiến liên tục (phân tích nguyên nhân gốc, đổi quy trình)')],
  ])}
${note(t('Appraisal results are published by the CMMI Institute. Check the official list rather than marketing pages if you need to know a company\'s current level.', 'Kết quả thẩm định được CMMI Institute công bố. Muốn biết mức hiện tại của một công ty, hãy xem danh sách chính thức chứ đừng tin trang quảng cáo.'))}

<h3>${t('Hybrid Agile: sprints inside the V', 'Agile lai: sprint nằm trong chữ V')}</h3>
<p>${t(
    'Many Japanese customers now ask for "Agile", but keep fixed documents and acceptance. A common hybrid: the customer approves BD for a release; the offshore team then runs two-week sprints, each sprint covering DD → code → UT for a few screens, with a demo at the end; IT and ST run per release. You will still write a UT spec and evidence — just every sprint instead of once. Sprint vocabulary (backlog, planning, review, retro) is in ',
    'Nhiều khách Nhật giờ yêu cầu "Agile", nhưng vẫn giữ tài liệu cố định và nghiệm thu. Kiểu lai hay gặp: khách duyệt BD cho một bản phát hành; đội offshore chạy sprint hai tuần, mỗi sprint làm DD → code → UT cho vài màn hình, có demo cuối sprint; IT và ST chạy theo bản phát hành. Bạn vẫn viết UT spec và evidence — chỉ là mỗi sprint thay vì một lần. Từ vựng sprint (backlog, planning, review, retro) ở ')}${ag('agl-1-2-scrum', t('lesson 1.2', 'bài 1.2'))}.</p>

<h3>${t('A real-looking calendar', 'Một lịch làm việc kiểu thật')}</h3>
${bang([t('Week', 'Tuần'), t('Phase', 'Giai đoạn'), t('Your tasks', 'Việc của bạn')], [
    ['1', 'BD ' + t('reading', 'đọc'), t('Read BD for 4 screens, list unclear points, send 12 Q&amp;A items through BrSE', 'Đọc BD 4 màn hình, liệt kê chỗ chưa rõ, gửi 12 câu Q&amp;A qua BrSE')],
    ['2', 'DD', t('Write DD for 2 screens, DD review with leader (record: 9 comments)', 'Viết DD 2 màn hình, review DD với leader (biên bản: 9 nhận xét)')],
    ['3–4', t('Coding + UT', 'Code + UT'), t('Implement, self-check, PR review; write 60 UT cases, run, evidence, UT report', 'Cài đặt, tự kiểm, review PR; viết 60 case UT, chạy, evidence, báo cáo UT')],
    ['5', 'IT', t('Testers run IT; you fix 5 bugs within 1 day each, update bug list', 'Tester chạy IT; bạn sửa 5 bug, mỗi bug trong 1 ngày, cập nhật danh sách bug')],
    ['6', 'ST/UAT', t('Support, hot fixes, answer customer questions via BrSE', 'Hỗ trợ, sửa nóng, trả lời câu hỏi của khách qua BrSE')],
  ])}

<h3>${t('Common mistakes of newcomers', 'Lỗi hay gặp của người mới')}</h3>
<ul>
<li>${t('Starting to code before the DD is reviewed — then the review changes the design and half the code is thrown away.', 'Code trước khi DD được review — rồi review đổi thiết kế, nửa số code bỏ đi.')}</li>
<li>${t('Treating UT as "I ran it and it worked": without a test spec and evidence, UT did not happen as far as the process is concerned.', 'Coi UT là "em chạy thử thấy được rồi": không có test spec và evidence thì về mặt quy trình UT chưa từng diễn ra.')}</li>
<li>${t('Editing a baselined document without increasing the version or adding a history line.', 'Sửa tài liệu đã baseline mà không tăng phiên bản, không thêm dòng lịch sử.')}</li>
<li>${t('Fixing a bug found in IT without updating the UT spec — the same bug returns later.', 'Sửa bug tìm thấy ở IT mà không bổ sung UT spec — bug đó quay lại sau.')}</li>
</ul>

<h3>${t('Exercise', 'Bài tập')}</h3>
<p>${t('Match each bug to the test level that should have caught it, and the document it violates.', 'Ghép mỗi bug với mức test lẽ ra phải bắt được nó, và tài liệu nó vi phạm.')}</p>
<ol>
<li>${t('The registration API accepts a 51-character name although the item definition says max 50.', 'API đăng ký nhận tên 51 ký tự dù định nghĩa mục ghi tối đa 50.')}</li>
<li>${t('After registering, the login screen does not recognise the new account (the two screens use different e-mail normalisation).', 'Đăng ký xong, màn hình đăng nhập không nhận tài khoản mới (hai màn hình chuẩn hoá email khác nhau).')}</li>
<li>${t('With 200 concurrent users, the appointment list takes 9 seconds; the requirement says 3 seconds.', '200 người dùng cùng lúc, danh sách lịch khám mất 9 giây; yêu cầu ghi 3 giây.')}</li>
<li>${t('Clinic staff say the booking flow does not match how reception actually works.', 'Nhân viên phòng khám nói luồng đặt lịch không khớp cách quầy lễ tân thật sự làm việc.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('UT — violates the DD item definition (ITM-01 length).', 'UT — vi phạm định nghĩa mục trong DD (độ dài ITM-01).')}</li>
<li>${t('IT — the interface/consistency between two screens defined in BD.', 'IT — sự nhất quán giữa hai màn hình đã định nghĩa trong BD.')}</li>
<li>${t('ST — a non-functional requirement (performance) from RD/BD.', 'ST — yêu cầu phi chức năng (hiệu năng) trong RD/BD.')}</li>
<li>${t('UAT — the business requirement itself (RD). Often it leads to a change request, not a bug.', 'UAT — chính yêu cầu nghiệp vụ (RD). Thường dẫn tới change request chứ không phải bug.')}</li>
</ol>`)}

${phongVan([
    [t('Explain the V-model with an example from your project.', 'Giải thích V-model bằng ví dụ từ dự án của bạn.'), t('Left side = documents (RD, BD, DD), right side = test levels that verify them (UAT, ST, IT, UT). Then name one concrete case: "my UT cases came from the DD item table; the IT team tested the transition from registration to login described in BD."', 'Nhánh trái = tài liệu (RD, BD, DD), nhánh phải = các mức test kiểm chúng (UAT, ST, IT, UT). Rồi nêu một trường hợp cụ thể: "case UT của em lấy từ bảng định nghĩa mục trong DD; đội IT test chuyển từ màn đăng ký sang đăng nhập mô tả trong BD."')],
    [t('Is the V-model incompatible with Agile?', 'V-model có mâu thuẫn với Agile không?'), t('Not necessarily: many projects run sprints for DD/code/UT inside a V-shaped release with documented BD and acceptance. The point is short feedback loops while keeping the verification each document needs.', 'Không hẳn: nhiều dự án chạy sprint cho DD/code/UT bên trong một bản phát hành hình chữ V có BD và nghiệm thu bằng tài liệu. Cốt lõi là vòng phản hồi ngắn mà vẫn giữ việc kiểm chứng mà mỗi tài liệu cần.')],
    [t('What does CMMI level 3 mean for a developer?', 'CMMI mức 3 nghĩa là gì với lập trình viên?'), t('There is a defined company process: standard templates, checklists, review records, configuration management — and I am expected to follow them and record what I do.', 'Công ty có quy trình chuẩn: mẫu, checklist, biên bản review, quản lý cấu hình — và tôi phải làm theo và ghi lại việc mình làm.')],
  ], en)}

${thuatNgu([
    ['RD / BD / DD', t('Requirements / basic (external) design / detailed (internal) design', 'Yêu cầu / thiết kế cơ bản (bên ngoài) / thiết kế chi tiết (bên trong)')],
    ['UT / IT / ST / UAT', t('Unit / integration / system / user acceptance test', 'Test đơn vị / tích hợp / hệ thống / nghiệm thu')],
    [t('Deliverable', 'Deliverable (sản phẩm bàn giao)'), t('A document or artifact that must be handed over at a phase gate', 'Tài liệu/sản phẩm phải giao ở cửa kiểm của giai đoạn')],
    [t('Review record', 'Biên bản review'), t('Written log of review comments, effort and fixes', 'Ghi chép nhận xét review, công và phần đã sửa')],
    ['Baseline', t('An approved, versioned state of a document', 'Trạng thái đã duyệt, có phiên bản của tài liệu')],
    ['CMMI', t('Capability Maturity Model Integration — a 5-level process maturity model', 'Mô hình trưởng thành quy trình 5 mức')],
    [t('Defect density', 'Mật độ lỗi'), t('Defects per size unit (e.g. per KLOC or per page)', 'Số lỗi trên đơn vị kích thước (ví dụ trên KLOC hay trên trang)')],
  ], en)}

${tomTat([
    t('Each left-side document is verified by a test level on the right (commonly UT ↔ DD, IT ↔ BD).', 'Mỗi tài liệu nhánh trái được kiểm bởi một mức test nhánh phải (hay gặp: UT ↔ DD, IT ↔ BD).'),
    t('Offshore juniors live mostly in DD → code → UT → IT bug fixing.', 'Dev offshore mới chủ yếu ở DD → code → UT → sửa bug IT.'),
    t('"Done" = self-check + review record + fixes confirmed + baseline.', '"Xong" = tự kiểm + biên bản review + xác nhận sửa + baseline.'),
    t('Hybrid Agile keeps the documents but runs them in sprints.', 'Agile lai giữ tài liệu nhưng làm theo từng sprint.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-9-3-tai-lieu-bd-dd', t('9.3 — reading BD/DD in Excel', '9.3 — đọc BD/DD dạng Excel'))}.</p>
`);
};
