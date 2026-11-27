/**
 * Chương 9 — Kiểm thử như một đội QA (mũ QA) (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 6 bài kiến thức (9.1–9.6), 1 bài Lab chu kỳ QA toàn diện trên CT Work LF #2 (9.7, dm5-9-lab)
 * và bài kiểm tra 12 câu tình huống (9.8, dm5-9-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s09/b1-test-plan-chien-luoc.mjs';
import B2 from './s09/b2-thiet-ke-test-case-uc-ac.mjs';
import B3 from './s09/b3-report-5-1-unit-test.mjs';
import B4 from './s09/b4-report-5-2-5-3-integration-system.mjs';
import B5 from './s09/b5-vong-doi-loi-defect-hoi-quy.mjs';
import B6 from './s09/b6-uat-cong-khach-ct-work.mjs';
import B7 from './s09/b7-lab.mjs';

const QUIZ9 = [
  Q('dm5-9-q1',
    'When authoring Report 5.0 (Test Documentation), the default Word template only ships 3 columns in the Test Levels table (Unit | Integration | System). What MUST you fix to avoid a classic FPT instructor deduction and the Ariane 5 (1996) blind spot?|||Khi viết Report 5.0 (Test Documentation), file mẫu Word mặc định chỉ vẽ 3 cột ở bảng Test Levels (Unit | Integration | System). Bạn BẮT BUỘC phải sửa gì để tránh bị thầy FPT bắt lỗi và tránh điểm mù kiểu Ariane 5 (1996)?',
    [
      'Delete the table completely and replace it with one screenshot of JUnit|||Xoá luôn bảng đó và thay bằng một ảnh chụp JUnit',
      'Add the 4th column <strong>Acceptance (added)</strong>, define all 4 levels together with each level\'s Test Basis (where tests come from), and map every X to real test files/evidence|||Thêm cột thứ 4 <strong>Acceptance (added)</strong>, định nghĩa rõ cả 4 cấp kèm Căn cứ kiểm thử (Test Basis — test lấy từ đâu) và gắn mọi dấu X với file/bằng chứng test thật',
      'Leave only Unit Testing checked because unit tests already cover everything|||Chỉ đánh dấu X ở Unit Testing vì unit test đã phủ sạch mọi thứ rồi',
      'Copy the C# / Angular tool versions from the sample apartment project|||Chép nguyên phiên bản công nghệ C# / Angular từ dự án mẫu chung cư',
    ],
    1,
    'Instructors explicitly flag missing 4th level (Acceptance) and unclear test basis; each test level catches defect classes the others miss (lesson of ESA Ariane 5 Flight 501, 1996). Lesson 9.1.|||Thầy hướng dẫn bắt rất chặt lỗi thiếu cấp thứ 4 (Acceptance) và không rõ test lấy từ đâu; mỗi cấp test bắt một nhóm lỗi cấp khác không thấy được (bài học Ariane 5 năm 1996). Bài 9.1.'),

  Q('dm5-9-q2',
    'In Report 5.0 Section 1 (Scope of Testing) for LabFlow AI, which combination makes your Scope defense-proof?|||Trong Report 5.0 Mục 1 (Scope of Testing) cho LabFlow AI, cách viết nào giúp phần Phạm vi đứng vững trước hội đồng?',
    [
      'List only screens with pretty UI and write "The system works well" as completion criteria|||Chỉ liệt kê các màn có giao diện đẹp và viết tiêu chí hoàn thành là "Hệ thống chạy tốt"',
      'List exact SRS feature names (including Non-UI background jobs like <code>N1–N4, N6</code>), explicitly list <strong>Features NOT to be tested</strong> with reasons, add NFR/Security Testing, and write quantified Completion Criteria|||Ghi đúng tên chức năng khớp SRS (gồm cả job Non-UI như <code>N1–N4, N6</code>), liệt kê rõ <strong>Features NOT to be tested</strong> kèm lý do, bổ sung NFR/Security Testing và viết Completion Criteria đo được bằng số',
      'Rename "Create Reservation" to "Book Lab" so it sounds shorter than the SRS|||Đổi tên "Create Reservation" thành "Book Lab" cho ngắn hơn SRS',
      'Skip Entry and Exit Criteria because you are working solo|||Bỏ qua Tiêu chí Vào/Ra vì bạn làm đồ án một mình',
    ],
    1,
    'Exact SRS naming, Non-UI coverage, explicit Out-of-Scope boundaries, Security Testing (2.1.4), and quantified Entry/Exit criteria prevent audit gaps and unfair scope attacks. Lesson 9.1.|||Tên khớp SRS, không quên job Non-UI, ghi rõ Ngoài phạm vi, thêm Security Testing (2.1.4) và Tiêu chí Vào/Ra đo được giúp chặn sạch lỗ hổng kiểm toán và câu hỏi vặn ngoài phạm vi. Bài 9.1.'),

  Q('dm5-9-q3',
    'LabFlow rule <code>BR-07</code> allows free cancellation ≥ 2 hours before start time (say 10:00). Applying Boundary Value Analysis (BVA) and FPT Report 5.1 Guideline, how are <code>08:00</code> (2h00m before) and <code>08:01</code> (1h59m before) classified?|||Luật <code>BR-07</code> của LabFlow cho phép huỷ miễn phí trước giờ bắt đầu (vd 10:00) ≥ 2 tiếng. Áp dụng Phân tích Giá trị Biên (BVA) và Guideline Report 5.1 của FPT, hai mốc <code>08:00</code> (tròn 2h00p trước) và <code>08:01</code> (1h59p trước) được xếp loại thế nào?',
    [
      'Both are Normal (<code>N</code>)|||Cả hai đều là Normal (<code>N</code>)',
      '<code>08:00</code> is <strong>Boundary (<code>B</code>)</strong> — exact valid edge, accepted; <code>08:01</code> is <strong>Abnormal (<code>A</code>)</strong> — 1 minute outside valid edge, rejected with exact <code>SM-xx</code>|||<code>08:00</code> là <strong>Boundary (<code>B</code>)</strong> — đúng mép biên hợp lệ, được chấp nhận; <code>08:01</code> là <strong>Abnormal (<code>A</code>)</strong> — lố ra ngoài biên 1 phút, bị từ chối kèm đúng mã <code>SM-xx</code>',
      '<code>08:00</code> is Abnormal (<code>A</code>) and <code>08:01</code> is Normal (<code>N</code>)|||<code>08:00</code> là Abnormal (<code>A</code>) và <code>08:01</code> là Normal (<code>N</code>)',
      'Skip both and test 05:00 twice instead|||Bỏ qua cả hai và chỉ test mốc 05:00 hai lần',
    ],
    1,
    'Per FPT Report 5.1 Guideline, exact valid boundaries (Min/Max) are B, while values 1 step outside the valid range (Min−1/Max+1) are A — catching off-by-one bugs like Microsoft Zune 2008. Lessons 9.2 &amp; 9.3.|||Theo Guideline Report 5.1 FPT, đúng mép biên hợp lệ (Min/Max) là B, còn giá trị lệch ra ngoài biên 1 bước (Min−1/Max+1) là A — bắt gọn lỗi lệch 1 đơn vị kiểu Microsoft Zune 2008. Bài 9.2 &amp; 9.3.'),

  Q('dm5-9-q4',
    'While writing test cases for <code>Create Reservation</code>, where MUST <em>"Student1 is ACTIVE; Lab IOT-01 already has a CONFIRMED booking 09:00–11:00"</em> be written — and where MUST Expected Results come from?|||Khi viết test case cho <code>Create Reservation</code>, dòng <em>"Student1 đang ACTIVE; Lab IOT-01 đã có lịch CONFIRMED 09:00–11:00"</em> BẮT BUỘC viết ở đâu — và Expected Results phải lấy từ đâu?',
    [
      'Write it as Step 1 of Procedure, and copy Expected Results from whatever your code currently prints|||Viết làm Bước 1 trong Procedure, và chép Expected Results theo đúng câu code hiện tại đang in ra',
      'Keep it strictly in the <strong>Pre-conditions</strong> section (NEVER mixed into Procedure/Input), and derive Expected Results strictly from the <strong>SRS (<code>BR-xx</code> &amp; <code>SM-xx</code>)</strong> — never from current code behavior|||Đặt trọn trong mục <strong>Pre-conditions</strong> (TUYỆT ĐỐI không viết lẫn vào Procedure/Input), và lấy Expected Results hoàn toàn từ <strong>SRS (<code>BR-xx</code> &amp; <code>SM-xx</code>)</strong> — không bao giờ chép theo hành vi hiện tại của code',
      'Omit Pre-conditions completely to keep the table short|||Bỏ luôn cột Pre-conditions cho bảng ngắn gọn',
      'Write "System shows error" as Expected Result for every negative case|||Ghi chung chung "System shows error" làm Expected Result cho mọi ca lỗi',
    ],
    1,
    'Mixing Preconditions into Steps and copying Expected from buggy code are two top FPT review deductions. Lesson 9.2.|||Viết lẫn Precondition vào Steps và lấy Expected theo code hiện tại là hai lỗi bị thầy FPT bắt rất gắt. Bài 9.2.'),

  Q('dm5-9-q5',
    'Your Report 5.1 <code>Statistics</code> sheet shows <strong>Test Coverage = 100%</strong>, while JaCoCo reports <strong>Branch Coverage = 62%</strong> on <code>ReservationService</code>. What does this gap tell you?|||Sheet <code>Statistics</code> của Report 5.1 báo <strong>Test Coverage = 100%</strong>, trong khi JaCoCo báo <strong>Branch Coverage = 62%</strong> trên <code>ReservationService</code>. Độ lệch này cho bạn biết điều gì?',
    [
      'JaCoCo is broken because Excel already proved 100% coverage|||JaCoCo bị lỗi vì Excel đã chứng minh phủ 100% rồi',
      'Excel Test Coverage only means you ran 100% of the cases you planned, whereas 38% of real Java decision branches were never tested — inspect JaCoCo red/yellow branches and add missing Abnormal/Boundary <code>UTCID</code> cases (avoiding Apple CVE-2014-1266 blind spots)|||Test Coverage Excel chỉ nói bạn đã chạy 100% số ca tự lên kế hoạch, trong khi 38% nhánh rẽ Java thật chưa từng được test — hãy soi nhánh đỏ/vàng trên JaCoCo và bổ sung các cột <code>UTCID</code> Biên/Bất thường còn thiếu (tránh điểm mù kiểu Apple CVE-2014-1266)',
      'You should delete the uncovered <code>if</code> statements so JaCoCo hits 100%|||Bạn nên xoá bớt các lệnh <code>if</code> chưa được phủ để JaCoCo lên 100%',
      'Hide the JaCoCo report and show only the Excel sheet at defense|||Giấu báo cáo JaCoCo đi và chỉ chiếu bảng Excel lúc bảo vệ',
    ],
    1,
    'Test Coverage (execution of planned cases) ≠ Code/Branch Coverage (JaCoCo); reconciling both exposes untested error paths like Apple\'s "goto fail" CVE-2014-1266. Lesson 9.3.|||Test Coverage (tỷ lệ chạy ca kế hoạch) ≠ Code/Branch Coverage (JaCoCo); đối soát cả hai sẽ lôi ra nhánh lỗi bị bỏ quên như vụ "goto fail" CVE-2014-1266 của Apple. Bài 9.3.'),

  Q('dm5-9-q6',
    'In Report 5.1, what does a single column <code>UTCID06</code> mocking <code>DataIntegrityViolationException</code> prove — and what does it NOT prove?|||Trong Report 5.1, một cột <code>UTCID06</code> dùng Mockito giả lập <code>DataIntegrityViolationException</code> chứng minh được điều gì — và KHÔNG chứng minh được điều gì?',
    [
      'It proves PostgreSQL\'s exclusion constraint works under 50 concurrent users|||Nó chứng minh ràng buộc loại trừ PostgreSQL chạy đúng dưới 50 người dùng đồng thời',
      'It ONLY proves your Java service catch/translation logic handles that exception cleanly; real database concurrency and constraints MUST still be proven in <strong>Report 5.2 Integration Test</strong> using real PostgreSQL via Testcontainers|||Nó CHỈ chứng minh logic bắt/chuyển đổi ngoại lệ trong Java chạy gọn; đồng thời và ràng buộc CSDL thật BẮT BUỘC vẫn phải chứng minh ở <strong>Report 5.2 Integration Test</strong> trên PostgreSQL thật qua Testcontainers',
      'It proves React displays the 409 toast banner correctly|||Nó chứng minh React hiển thị thông báo 409 đúng mẫu',
      'It proves nothing and should be deleted|||Nó không chứng minh được gì và nên xoá bỏ',
    ],
    1,
    'Mocks verify isolated Java logic in milliseconds, never real DB constraints or concurrency — that belongs in 5.2 Integration Test with Testcontainers. Lessons 9.3 &amp; 9.4.|||Mock kiểm logic Java cô lập trong mili-giây, không bao giờ kiểm được ràng buộc hay đồng thời DB thật — việc đó thuộc Report 5.2 Integration Test với Testcontainers. Bài 9.3 &amp; 9.4.'),

  Q('dm5-9-q7',
    'Which test case belongs in <strong>Report 5.2 (Integration Test)</strong> rather than <strong>Report 5.3 (System Test)</strong>?|||Ca kiểm thử nào thuộc về <strong>Report 5.2 (Integration Test)</strong> chứ KHÔNG đặt trong <strong>Report 5.3 (System Test)</strong>?',
    [
      'Student logs into staging in Chrome, books a lab via S22, Manager approves in S25, and Staff scans the QR on a mobile phone in S28|||Student đăng nhập staging trên Chrome, đặt lab ở S22, Manager duyệt ở S25, rồi Staff quét QR bằng điện thoại ở S28',
      'Sending 50 concurrent <code>POST /api/v1/reservations</code> API requests (and a direct Student JWT call to an Admin endpoint expecting HTTP 403) against Spring Boot + real Testcontainers PostgreSQL without the React UI|||Bắn 50 request API <code>POST /api/v1/reservations</code> đồng thời (và gọi thẳng API Admin bằng JWT Student mong đợi HTTP 403) vào Spring Boot + PostgreSQL thật qua Testcontainers không qua giao diện React',
      'Checking that the mobile responsive navigation drawer opens cleanly on Safari iOS|||Kiểm tra menu thu gọn trên di động mở mượt trên Safari iOS',
      'Verifying that typing <code>/approval-queue</code> in Chrome as a Student renders the 403 page|||Kiểm tra gõ thẳng <code>/approval-queue</code> trên Chrome bằng tài khoản Student hiện trang 403',
    ],
    1,
    'Report 5.2 tests collaborating backend/API/DB infrastructure directly (feature sheets); Report 5.3 tests end-to-end multi-role user workflows strictly through the deployed UI (workflow sheets). Lesson 9.4.|||Report 5.2 test trực tiếp hạ tầng backend/API/DB ghép nhau (sheet theo Feature); Report 5.3 test luồng người dùng nhiều vai hoàn toàn qua giao diện đã triển khai (sheet theo Workflow). Bài 9.4.'),

  Q('dm5-9-q8',
    'When auditing FPT\'s Excel Template3 / Report 5.2 / 5.3 after finishing 3 Rounds, which <strong>3 formula checkpoints</strong> must you verify and fix before submitting?|||Khi soát file Excel mẫu FPT (Template3 / Report 5.2 / 5.3) sau khi chạy xong 3 Vòng, bạn phải kiểm tra và sửa <strong>3 điểm công thức</strong> nào trước khi nộp?',
    [
      'Font size, margin width, and dark-mode colors|||Cỡ chữ, lề trang và màu chế độ tối',
      '(1) Verify <code>Number of TCs</code> matches actual test rows (neither mistyped nor counting <code>SCENARIO</code> headers); (2) fix the known template bug where Round 2 &amp; Round 3 <code>COUNTIF</code> rows point to the Round 1 column; (3) check whether <code>Test Statistics</code> has been updated from Round 1 to the final executed round and document it in <code>Notes</code>|||(1) Kiểm tra <code>Number of TCs</code> khớp đúng số ca thật (không gõ lệch hay đếm nhầm dòng tiêu đề <code>SCENARIO</code>); (2) sửa lỗi có sẵn trong mẫu nơi hàng <code>COUNTIF</code> của Round 2 &amp; Round 3 trỏ nhầm cột Round 1; (3) kiểm tra sheet <code>Test Statistics</code> đã cập nhật từ Round 1 sang vòng cuối đã chạy chưa và ghi rõ trong <code>Notes</code>',
      'Only changing the filename to <code>.csv</code>|||Chỉ cần đổi đuôi file sang <code>.csv</code>',
      'Deleting Round 1 results after Round 2 passes|||Xoá sạch kết quả Round 1 sau khi Round 2 chuyển Passed',
    ],
    1,
    'The Round 2/3 COUNTIF-column bug is a known defect in the shipped template, while checking Number of TCs and updating Test Statistics from Round 1 (without erasing Round 1 history!) keep your coverage figures accurate. Lesson 9.4.|||Lỗi hàng Round 2/3 đếm nhầm cột Round 1 có thật trong file mẫu, còn soát Number of TCs và cập nhật Test Statistics từ Round 1 (mà KHÔNG xoá lịch sử Round 1!) giúp số liệu coverage hoàn toàn chính xác. Bài 9.4.'),

  Q('dm5-9-q9',
    'During Iteration 2, your QA hat caught <strong>16 Defects</strong> before submission, and the lecturer found <strong>4 Leakages</strong> during SWP-M2 review. What is your <strong>Defect Removal Efficiency (DRE)</strong>, and what must happen to those 4 Leakages?|||Trong Iteration 2, mũ QA của bạn bắt được <strong>16 Defect</strong> trước khi nộp, và giảng viên tìm ra <strong>4 Leakage</strong> ở buổi chấm SWP-M2. Chỉ số <strong>Hiệu suất Diệt Lỗi (DRE)</strong> là bao nhiêu và bạn phải làm gì với 4 lỗi Leakage đó?',
    [
      'DRE = 75%; relabel the 4 Leakages as Defects so DRE looks like 100%|||DRE = 75%; đổi nhãn 4 Leakage thành Defect để DRE nhìn thành 100%',
      'DRE = <strong>80%</strong> (<code>16 ÷ (16 + 4)</code>); keep the <code>Leakage</code> label honestly, fix all 4 FIRST at the start of the next iteration, and add permanent automated regression tests so they never recur|||DRE = <strong>80%</strong> (<code>16 ÷ (16 + 4)</code>); giữ trung thực nhãn <code>Leakage</code>, ưu tiên sửa sạch cả 4 lỗi ĐẦU TIÊN ở đầu vòng sau và thêm test hồi quy tự động vĩnh viễn để không tái phát',
      'DRE = 25%; ignore the 4 Leakages until Final Presentation|||DRE = 25%; mặc kệ 4 Leakage tới buổi Bảo vệ cuối',
      'DRE = 400%; delete the Defects sheet|||DRE = 400%; xoá sheet Defects đi',
    ],
    1,
    'DRE = Defects / (Defects + Leakages) = 16 / 20 = 80%. Never fake Leakage labels; prioritize fixing Leakages first and prevent recurrence with automated regression tests. Lesson 9.5.|||DRE = Defects / (Defects + Leakages) = 16 / 20 = 80%. Không bao giờ giả nhãn Leakage; luôn vá Leakage đầu tiên và thêm test hồi quy tự động chặn tái phát. Bài 9.5.'),

  Q('dm5-9-q10',
    'You just fixed a security bug (<code>DF-19</code>: a Student could cancel another student\'s booking by guessing its ID) under hat C3. What is the correct Defect Lifecycle + Security Regression procedure before closing <code>DF-19</code>?|||Bạn vừa sửa một lỗi bảo mật (<code>DF-19</code>: Sinh viên có thể huỷ lịch của sinh viên khác bằng cách đoán ID) dưới mũ C3. Đâu là quy trình Vòng đời Lỗi + Hồi quy Bảo mật đúng trước khi đóng <code>DF-19</code>?',
    [
      'Immediately drag <code>DF-19</code> to <code>Closed</code> under hat C3 because you already tested it once in Postman|||Kéo ngay <code>DF-19</code> sang <code>Closed</code> dưới mũ C3 vì bạn đã thử 1 lần trên Postman rồi',
      'Add a <strong>permanent automated negative test (403/404 IDOR check)</strong> in CI first, merge PR, move card to <code>Fixed / 3_Done</code>, then switch to <strong>Red Hat (C5)</strong> to independently re-test + verify CI green before moving to <code>Closed</code> (keeping <code>DF-19</code> in Excel Notes)|||Thêm ngay một <strong>bài test âm tự động vĩnh viễn (kiểm chặn IDOR 403/404)</strong> trên CI, merge PR, đẩy thẻ sang <code>Fixed / 3_Done</code>, rồi chuyển sang <strong>Mũ Đỏ (C5)</strong> kiểm lại độc lập + xác nhận CI xanh mới chuyển <code>Closed</code> (giữ mã <code>DF-19</code> trong Note Excel)',
      'Patch it quietly without logging a Defect ticket so the bug count stays low|||Vá âm thầm không mở thẻ Defect để tổng số bug nhìn cho ít',
      'Mark it Low Priority and defer until after graduation|||Đánh Priority Thấp và để dành tới sau khi tốt nghiệp',
    ],
    1,
    'Every security bug MUST become a permanent automated regression test in CI, and the fixing Dev hat NEVER closes its own defect without independent QA re-test. Lesson 9.5.|||Mọi lỗi bảo mật BẮT BUỘC biến thành bài test hồi quy tự động vĩnh viễn trên CI, và mũ Dev sửa lỗi TUYỆT ĐỐI không tự đóng bug thiếu bước mũ QA kiểm lại độc lập. Bài 9.5.'),

  Q('dm5-9-q11',
    'While running User Acceptance Testing (UAT) on CT Work Client Portal (<code>portal/uat</code>), which practice ruins the validity of your UAT session?|||Khi tổ chức Kiểm thử Chấp nhận Người dùng (UAT) trên Cổng Khách CT Work (<code>portal/uat</code>), cách làm nào phá hỏng hoàn toàn giá trị của buổi UAT?',
    [
      'Inviting 2–3 real outside participants (classmates/lab staff/lecturer) using synthetic demo accounts on staging|||Mời 2–3 người ngoài thật (bạn học/nhân viên lab/giảng viên) dùng tài khoản demo giả trên staging',
      'Giving goal-oriented task cards without step-by-step click hints and observing silently with hands behind your back|||Phát phiếu nhiệm vụ theo mục tiêu không chỉ nút từng bước và ngồi im lặng khoanh tay quan sát',
      'Running UAT yourself (or pointing at every button for your friend while using real student emails/PII on staging) and treating new feature wishes as Critical bugs|||Tự mình đóng vai khách chạy UAT (hoặc chỉ tay từng nút cho bạn bấm kèm nạp email/PII sinh viên thật lên staging) và gom luôn ý muốn thêm tính năng mới vào lỗi Critical',
      'Logging Critical/High UAT findings as Bug cards (<code>LF-n</code>) to fix before Final Package while recording new feature wishes as future CRs|||Ghi lỗi Critical/High từ UAT thành thẻ Bug (<code>LF-n</code>) để sửa trước Final Package còn ý muốn tính năng mới tách sang backlog CR',
    ],
    2,
    'Self-UAT, hand-holding, real PII on staging, and mixing CR wishes with Critical bugs are the classic UAT red flags (lesson of NHS NPfIT &amp; UAT best practices). Lesson 9.6.|||Tự làm UAT, chỉ tay từng nút, dùng dữ liệu cá nhân thật trên staging và trộn CR với lỗi Critical là các cờ đỏ UAT kinh điển (bài học NHS NPfIT &amp; chuẩn UAT). Bài 9.6.'),

  Q('dm5-9-q12',
    'Before passing the Chapter 9 Lab Rubric, your audit finds: Report 5.3 has 100% Passed on Round 1 with zero Defects logged, UAT was run only by yourself, and <code>Test Statistics</code> still shows <code>#REF!</code>. Can you pass?|||Trước khi tự chấm Rubric Lab Chương 9, rà soát phát hiện: Report 5.3 ghi 100% Passed ngay từ Round 1 với 0 Defect, UAT do chính bạn tự chạy, và <code>Test Statistics</code> còn ô <code>#REF!</code>. Bạn có đạt bài lab không?',
    [
      'Yes, because 100% Passed in Round 1 looks super impressive|||Có, vì 100% Passed ngay Round 1 nhìn rất ấn tượng',
      'NO — those violate multiple red-line criteria (broken Excel formulas, fake self-UAT, and non-credible unverified execution trail); fix the formulas, run an honest full cycle, and invite ≥ 2 real outside UAT participants before passing|||KHÔNG — các điểm đó vi phạm nhiều lằn ranh đỏ (lỗi công thức Excel, tự làm UAT giả và thiếu dấu vết kiểm thử thật đáng tin cậy); phải sửa công thức, chạy lại chu kỳ trung thực và mời ≥ 2 người ngoài thật chạy UAT rồi mới tính Đạt',
      'Yes, if you hide the <code>Test Statistics</code> sheet before submitting|||Có, miễn là bạn ẩn sheet <code>Test Statistics</code> đi trước khi nộp',
      'Only <code>#REF!</code> matters; self-UAT is encouraged in solo projects|||Chỉ lỗi <code>#REF!</code> đáng lo; tự chạy UAT được khuyến khích ở đồ án làm một mình',
    ],
    1,
    'Zero red-line violations (clean Excel formulas, genuine execution &amp; defect trail, real outside UAT participants, zero PII) are mandatory to pass Lab 9.7. Lesson 9.7.|||Không vi phạm lằn ranh đỏ nào (công thức Excel sạch, dấu vết test &amp; defect trung thực, người thử UAT ngoài thật, 0 PII) là điều kiện bắt buộc để Đạt Lab 9.7. Bài 9.7.'),
];

export default {
  title: 'Chapter 9 — Testing Like a QA Team (QA Hat)|||Chương 9 — Kiểm thử như một đội QA (mũ QA)',
  description: 'Đội Chiếc Mũ Đỏ (C5 QA) vận hành trọn quy trình kiểm thử doanh nghiệp trên CT Work LF #2 và hồ sơ FPT Report 5.0–5.3: lập Test Plan & Chiến lược đủ 4 cấp + Tiêu chí Vào/Ra (bài học Ariane 5), thiết kế test case từ Use Case/AC bằng 5 kỹ thuật SWT301 + Abuse Case (bài học Zune 2008), Report 5.1 Unit Test (ma trận N/A/B + JUnit + JaCoCo, bài học Apple goto fail), Report 5.2 Integration (Testcontainers 50 luồng) & 5.3 System Test 3 vòng + soát 3 điểm công thức Excel (bài học CrowdStrike 2024), Vòng đời lỗi/Defect Log/Leakage/DRE/Hồi quy 3 tầng (NIST & HealthCare.gov), UAT ngoài qua Cổng Khách CT Work (NHS NPfIT), kèm Lab tổng hợp & Quiz 12 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    {
      title: '9.8 — Chapter 9 Quiz|||9.8 — Kiểm tra Chương 9',
      slug: 'dm5-9-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu hỏi tình huống bao trọn Chương 9: Report 5.0 đủ 4 cấp test & Scope có job Non-UI/Security (Ariane 5), BVA theo Guideline FPT 5.1 (Zune 2008), tách Precondition khỏi Input & lấy Expected từ SRS, phân biệt Test Coverage Excel vs JaCoCo Branch Coverage (Apple CVE-2014-1266), ranh giới 5.1 vs 5.2 vs 5.3 & soát 3 điểm công thức Excel, tính DRE & xử lý Leakage, Hồi quy Bảo mật IDOR + luật không tự đóng bug, UAT thật trên Cổng Khách CT Work (NHS NPfIT) và lằn ranh đỏ Lab 9.7.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>9.8 — Check your mastery of Testing Like a QA Team (QA Hat)</h2>
<p class="lead">Twelve scenario-based questions covering Lessons 9.1–9.7. Aim for at least 10/12 before moving to Chapter 10 (Iteration 3, Non-Functional Quality &amp; Release). Every explanation points directly back to the lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>9.8 — Kiểm tra độ nắm vững Kiểm thử như một đội QA (Mũ QA)</h2>
<p class="lead">Mười hai câu hỏi tình huống bao trọn Bài 9.1–9.7. Hãy đặt mục tiêu đạt tối thiểu 10/12 trước khi bước sang Chương 10 (Iteration 3, Chất lượng phi chức năng &amp; Phát hành). Mỗi lời giải đều trỏ thẳng về bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ9 },
    },
  ],
};
