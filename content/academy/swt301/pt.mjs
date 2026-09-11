/**
 * SWT301 · Progress Tests 1–3 and the Final Exam section.
 * Section titles and first-lesson slugs are kept from the previous version so
 * the seeder updates them in place. The questions are NEW scenario/calculation
 * questions (the chapter quizzes already contain every slide question); each
 * answer was worked out against the CTFL 2018 syllabus.
 */
import { bi } from './_slides.mjs';

const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });

/* ─────────────────────────────── PT1 ─────────────────────────────── */
const PT1Q = [
  q('Which is a typical objective of testing?|||Đâu là một mục tiêu điển hình của kiểm thử?', ['To prove the absence of defects|||Chứng minh không có lỗi', 'To find defects and build confidence in the level of quality|||Tìm lỗi và tạo niềm tin vào mức chất lượng', 'To fix the defects found|||Sửa các lỗi tìm được', 'To shorten the project|||Rút ngắn dự án'], 1),
  q('The invoice screen shows a wrong total. This observation is a…|||Màn hình hoá đơn hiển thị sai tổng tiền. Quan sát này là một…', ['error', 'defect', 'failure', 'root cause|||nguyên nhân gốc'], 2),
  q('Which statement about debugging is correct?|||Câu nào về debugging là đúng?', ['Debugging is a test level|||Debugging là một cấp test', 'Debugging finds, analyses and removes the causes of failures|||Debugging tìm, phân tích và gỡ nguyên nhân của failure', 'Debugging is done only by testers|||Debugging chỉ do tester làm', 'Debugging proves the fix is complete|||Debugging chứng minh bản sửa hoàn chỉnh'], 1),
  q('Which activity is quality ASSURANCE rather than quality control?|||Hoạt động nào là ĐẢM BẢO chất lượng chứ không phải kiểm soát chất lượng?', ['Executing system test cases|||Chạy test case hệ thống', 'Reviewing a design document for defects|||Review tài liệu thiết kế để tìm lỗi', 'Auditing whether the team follows the agreed coding process|||Kiểm tra (audit) nhóm có làm đúng quy trình code đã thống nhất', 'Running the regression suite|||Chạy bộ regression'], 2),
  q('Two of twelve modules contain 70% of the defects found. Which principle?|||Hai trong mười hai module chứa 70% số lỗi. Nguyên tắc nào?', ['Pesticide paradox', 'Defect clustering', 'Early testing', 'Absence-of-errors fallacy'], 1),
  q('For months the same regression suite has found no new defects while users still report bugs. Which principle?|||Nhiều tháng bộ regression không tìm ra lỗi mới trong khi người dùng vẫn báo lỗi. Nguyên tắc nào?', ['Pesticide paradox', 'Defect clustering', 'Testing is context dependent', 'Exhaustive testing is impossible'], 0),
  q('A form has 3 independent fields, each accepting 100 different values. How many combinations would exhaustive testing need?|||Một form có 3 trường độc lập, mỗi trường nhận 100 giá trị. Test vét cạn cần bao nhiêu tổ hợp?', ['300', '10,000', '1,000,000', '100'], 2),
  q('Which activity prevents defects earliest?|||Hoạt động nào ngăn lỗi sớm nhất?', ['System testing', 'Reviewing the requirements|||Review yêu cầu', 'Acceptance testing', 'Regression testing'], 1),
  q('Evaluating whether the exit criteria have been met is part of…|||Đánh giá đã đạt tiêu chí ra hay chưa thuộc về…', ['Test analysis', 'Test monitoring and control', 'Test implementation', 'Test design'], 1),
  q('Creating the test data and building the test environment happen in…|||Tạo dữ liệu test và dựng môi trường test diễn ra ở…', ['Test analysis', 'Test design', 'Test implementation', 'Test execution'], 2),
  q('A test charter is a work product of…|||Test charter là sản phẩm của…', ['Test planning', 'Test analysis', 'Test execution', 'Test completion'], 1),
  q('What is the main value of traceability between requirements and tests?|||Giá trị chính của truy vết giữa yêu cầu và test là gì?', ['It makes tests run faster|||Test chạy nhanh hơn', 'It supports impact analysis and coverage measurement|||Hỗ trợ phân tích tác động và đo độ bao phủ', 'It replaces the test plan|||Thay thế test plan', 'It removes the need for reviews|||Không cần review nữa'], 1),
  q('Which gives the HIGHEST level of test independence?|||Mức độc lập CAO nhất là…', ['The author tests their own code|||Tác giả tự test code', 'Another developer in the team|||Developer khác trong nhóm', 'A test team in the same company|||Nhóm test trong cùng công ty', 'Testers from a different organisation|||Tester từ một tổ chức khác'], 3),
  q('How should a tester communicate a defect?|||Tester nên báo lỗi thế nào?', ['Emphasise who made the mistake|||Nhấn mạnh ai mắc lỗi', 'Objectively, with facts and steps, without blaming the author|||Khách quan, có sự kiện và các bước, không đổ lỗi cho tác giả', 'Only verbally to avoid conflict|||Chỉ nói miệng để tránh xung đột', 'Only when the manager asks|||Chỉ khi quản lý hỏi'], 1),
  q('A tester is asked to mark failed safety tests as passed. Which ethics principle is most at stake?|||Tester bị yêu cầu đánh dấu các test an toàn đã fail thành pass. Nguyên tắc đạo đức nào bị vi phạm rõ nhất?', ['Colleagues', 'Self', 'Judgment (and Public)', 'Management'], 2),
  q('Which characteristic of good testing applies in EVERY lifecycle model?|||Đặc điểm kiểm thử tốt nào đúng với MỌI mô hình vòng đời?', ['Testing starts after coding|||Kiểm thử bắt đầu sau khi code', 'For every development activity there is a corresponding test activity|||Mỗi hoạt động phát triển có một hoạt động kiểm thử tương ứng', 'All tests are automated|||Mọi test đều tự động', 'Only testers review requirements|||Chỉ tester review yêu cầu'], 1),
  q('In the V-model, acceptance tests are designed from…|||Trong V-model, acceptance test được thiết kế từ…', ['the detailed design|||thiết kế chi tiết', 'the code|||code', 'the user requirements|||yêu cầu người dùng', 'the architecture|||kiến trúc'], 2),
  q('A typical testing problem in iterative and incremental development is…|||Vấn đề kiểm thử điển hình trong mô hình lặp và tăng dần là…', ['no test basis at all|||hoàn toàn không có test basis', 'a growing amount of regression testing|||lượng regression tăng dần', 'testing only at the end|||chỉ test ở cuối', 'no need for automation|||không cần tự động hoá'], 1),
  q('Which defect is most typically found in component testing?|||Lỗi nào điển hình nhất ở component testing?', ['Incorrect logic in a method|||Sai logic trong một phương thức', 'Interface mismatch between two systems|||Giao diện giữa hai hệ thống không khớp', 'Business rule not accepted by users|||Luật nghiệp vụ người dùng không chấp nhận', 'Backup cannot be restored|||Không khôi phục được bản sao lưu'], 0),
  q('A stub…|||Stub là…', ['calls the component under test|||thành phần gọi thành phần đang test', 'replaces a component that is called by the component under test|||thứ thay thế thành phần được gọi bởi thành phần đang test', 'is a real database|||một CSDL thật', 'is a test report|||một báo cáo test'], 1),
  q('Which integration strategy needs drivers?|||Chiến lược tích hợp nào cần driver?', ['Top-down', 'Bottom-up', 'Big-bang', 'Minimum capability from the top|||Minimum capability từ trên xuống'], 1),
  q('The environment for system testing should ideally…|||Môi trường system testing lý tưởng nên…', ['be the developer\'s laptop|||là laptop của developer', 'correspond to the production environment|||giống môi trường production', 'have no data|||không có dữ liệu', 'be the live production system|||chính là hệ thống production đang chạy'], 1),
  q('Operational acceptance testing is usually performed by…|||Operational acceptance testing thường do ai làm?', ['end users|||người dùng cuối', 'system administrators|||quản trị hệ thống', 'developers|||developer', 'the regulator|||cơ quan quản lý'], 1),
  q('Alpha testing is done…|||Alpha testing được làm…', ['by developers at their desks|||bởi developer tại chỗ ngồi', 'at the developer\'s site by people outside the development team|||tại nơi bên phát triển, bởi người ngoài nhóm phát triển', 'at the customer\'s site by customers|||tại nơi khách hàng, bởi khách hàng', 'only after release|||chỉ sau khi phát hành'], 1),
  q('"The search page returns within 3 s with 500 concurrent users" is a… test|||"Trang tìm kiếm trả kết quả trong 3 giây với 500 người dùng đồng thời" là test…', ['functional', 'non-functional', 'white-box', 'confirmation'], 1),
  q('White-box testing can be applied at…|||White-box testing có thể áp dụng ở…', ['component testing only|||chỉ component testing', 'any level, mostly component and component integration|||mọi cấp, chủ yếu component và component integration', 'acceptance testing only|||chỉ acceptance testing', 'no level|||không cấp nào'], 1),
  q('Re-executing the steps of a failed test on the fixed build is…|||Chạy lại các bước của một test đã fail trên bản build đã sửa là…', ['regression testing', 'confirmation testing', 'smoke testing', 'exploratory testing'], 1),
  q('The purpose of regression testing is to…|||Mục đích của regression testing là…', ['confirm one defect is fixed|||khẳng định một lỗi đã được sửa', 'detect unintended side-effects of changes|||phát hiện tác dụng phụ ngoài ý muốn của thay đổi', 'test new features only|||chỉ test tính năng mới', 'measure performance|||đo hiệu năng'], 1),
  q('Moving a system to a new database platform triggers maintenance testing of type…|||Chuyển hệ thống sang nền tảng CSDL mới kích hoạt kiểm thử bảo trì loại…', ['modification|||sửa đổi', 'migration|||chuyển đổi', 'retirement|||ngừng sử dụng', 'none|||không loại nào'], 1),
  q('Impact analysis in maintenance testing is used to…|||Phân tích tác động trong kiểm thử bảo trì dùng để…', ['fix defects faster|||sửa lỗi nhanh hơn', 'decide how much regression testing is needed|||quyết định cần regression bao nhiêu', 'write user manuals|||viết hướng dẫn sử dụng', 'estimate development cost|||ước lượng chi phí phát triển'], 1),
];

/* ─────────────────────────────── PT2 ─────────────────────────────── */
const PT2Q = [
  q('Which defect is static testing more likely to find than dynamic testing?|||Lỗi nào kiểm thử tĩnh dễ tìm hơn kiểm thử động?', ['A memory leak under load|||Rò rỉ bộ nhớ khi tải cao', 'An ambiguous requirement|||Một yêu cầu mơ hồ', 'A slow response time|||Thời gian đáp ứng chậm', 'A crash on a specific device|||Crash trên một thiết bị cụ thể'], 1),
  q('Logging the potential defects discussed in the review meeting belongs to…|||Ghi lại các lỗi tiềm năng được thảo luận trong buổi họp review thuộc hoạt động…', ['Planning', 'Initiate review', 'Individual review', 'Issue communication and analysis'], 3),
  q('Who ensures the review meeting runs effectively and mediates?|||Ai đảm bảo buổi họp review diễn ra hiệu quả và điều phối?', ['Author', 'Scribe', 'Facilitator (moderator)', 'Management'], 2),
  q('Who records the potential defects and decisions?|||Ai ghi lại các lỗi tiềm năng và quyết định?', ['Scribe (recorder)', 'Author', 'Reviewer', 'Management'], 0),
  q('Which review type is the most formal, with trained moderator, entry/exit criteria and metrics?|||Loại review nào chính thức nhất, có moderator được đào tạo, tiêu chí vào/ra và số liệu?', ['Informal review', 'Walkthrough', 'Technical review', 'Inspection'], 3),
  q('A walkthrough is usually led by…|||Walkthrough thường do ai dẫn dắt?', ['the author|||tác giả', 'a trained moderator|||moderator được đào tạo', 'the customer|||khách hàng', 'a tool|||công cụ'], 0),
  q('A weakness of checklist-based reviewing is that…|||Điểm yếu của review theo checklist là…', ['it needs no preparation|||không cần chuẩn bị', 'defects outside the checklist may be missed|||lỗi nằm ngoài checklist có thể bị bỏ sót', 'it cannot be used on code|||không dùng được cho code', 'it is the most expensive technique|||là kỹ thuật đắt nhất'], 1),
  q('Which defect can a static analysis tool typically detect?|||Công cụ phân tích tĩnh thường phát hiện được lỗi nào?', ['A variable used before it is assigned|||Biến được dùng trước khi gán', 'A wrong business rule|||Luật nghiệp vụ sai', 'A slow server|||Máy chủ chậm', 'An unhappy user|||Người dùng không hài lòng'], 0),
  q('A variable is defined and then defined again without being used in between. This data-flow anomaly is…|||Một biến được gán rồi lại gán tiếp mà không được dùng ở giữa. Bất thường luồng dữ liệu này là…', ['ur (undefined-referenced)', 'du (defined-undefined)', 'dd (defined-defined)', 'no anomaly|||không bất thường'], 2),
  q('A control-flow graph has 9 edges and 7 nodes (one connected component). What is its cyclomatic complexity?|||Đồ thị luồng điều khiển có 9 cạnh và 7 nút (một thành phần liên thông). Độ phức tạp chu trình là bao nhiêu?', ['2', '3', '4', '16'], 2),
  q('Code has three independent IF statements in sequence (no ELSE). Minimum tests for 100% decision coverage?|||Code có ba lệnh IF độc lập liên tiếp (không có ELSE). Số test tối thiểu để đạt 100% decision coverage?', ['1', '2', '3', '4'], 1),
  q('"IF a > b THEN print(a) ENDIF" — minimum tests for 100% statement coverage?|||"IF a > b THEN print(a) ENDIF" — số test tối thiểu cho 100% statement coverage?', ['1', '2', '3', '0'], 0),
  q('Which statement is true?|||Câu nào đúng?', ['100% statement coverage guarantees 100% decision coverage|||100% statement coverage đảm bảo 100% decision coverage', '100% decision coverage guarantees 100% statement coverage|||100% decision coverage đảm bảo 100% statement coverage', 'They are always equal|||Chúng luôn bằng nhau', 'Neither implies anything|||Không cái nào suy ra cái nào'], 1),
  q('An integer age field accepts 18–60. How many equivalence partitions (valid and invalid) are there for the value?|||Trường tuổi số nguyên nhận 18–60. Có bao nhiêu phân vùng tương đương (hợp lệ và không hợp lệ) cho giá trị?', ['2', '3', '4', '43'], 1),
  q('Using two-value BVA for the integer range 18–60, which set is correct?|||Dùng BVA hai giá trị cho khoảng số nguyên 18–60, bộ nào đúng?', ['18, 60', '17, 18, 60, 61', '17, 61', '0, 18, 60, 100'], 1),
  q('A password must have 6–12 characters. Which set tests all length boundaries?|||Mật khẩu phải dài 6–12 ký tự. Bộ nào test đủ các biên độ dài?', ['6, 12', '5, 6, 12, 13', '5, 13', '1, 6, 12, 20'], 1),
  q('A decision table with 3 Boolean conditions has how many rules before rationalising?|||Decision table với 3 điều kiện Boolean có bao nhiêu rule trước khi rút gọn?', ['3', '6', '8', '9'], 2),
  q('Decision-table coverage is measured as the percentage of…|||Coverage của decision table đo bằng phần trăm…', ['conditions tested|||điều kiện được test', 'rules (columns) exercised|||số rule (cột) được chạy', 'actions written|||hành động được viết', 'rows of the table|||số dòng của bảng'], 1),
  q('In state transition testing, covering every VALID transition at least once is…|||Trong state transition testing, chạy mỗi transition HỢP LỆ ít nhất một lần là…', ['all-states coverage|||phủ mọi trạng thái', 'all-transitions (0-switch) coverage|||phủ mọi transition (0-switch)', 'invalid-transition testing|||test transition không hợp lệ', 'decision coverage'], 1),
  q('An invalid-transition test…|||Một test transition không hợp lệ…', ['sends an event that is not allowed in the current state|||gửi một sự kiện không được phép ở trạng thái hiện tại', 'visits every state|||đi qua mọi trạng thái', 'is not needed|||không cần thiết', 'tests only the start state|||chỉ test trạng thái đầu'], 0),
  q('Use-case testing should cover…|||Use-case testing nên phủ…', ['only the main success scenario|||chỉ luồng thành công chính', 'the main scenario plus alternative and exception flows|||luồng chính cộng các luồng thay thế và ngoại lệ', 'only error messages|||chỉ thông báo lỗi', 'only the database|||chỉ CSDL'], 1),
  q('Tax: first 4,000 tax-free, next 1,500 at 10%, next 28,000 at 22%, the rest at 40%. Which salary is in the SAME partition as 5,800?|||Thuế: 4.000 đầu miễn thuế, 1.500 tiếp theo 10%, 28.000 tiếp theo 22%, phần còn lại 40%. Mức lương nào CÙNG phân vùng với 5.800?', ['4,800', '5,500', '28,000', '33,501'], 2),
  q('Error guessing is based on…|||Error guessing dựa trên…', ['a list of likely mistakes, defects and failures from experience|||danh sách lỗi hay gặp rút từ kinh nghiệm', 'the code structure|||cấu trúc code', 'random input|||dữ liệu ngẫu nhiên', 'the requirements only|||chỉ yêu cầu'], 0),
  q('Exploratory testing done with time-boxes and charters is called…|||Exploratory testing làm theo time-box và charter gọi là…', ['session-based testing|||session-based testing', 'checklist-based testing', 'regression testing', 'pair testing'], 0),
  q('Which technique suits a system with poor specifications under strong time pressure?|||Kỹ thuật nào hợp với hệ thống có đặc tả kém và áp lực thời gian lớn?', ['Decision table testing', 'Exploratory testing', 'Statement coverage', 'State transition testing'], 1),
  q('Which is a factor in choosing a test technique?|||Đâu là một yếu tố khi chọn kỹ thuật test?', ['The colour of the UI|||Màu giao diện', 'Regulatory standards and the risk of the system|||Chuẩn quy định và rủi ro của hệ thống', 'The tester\'s favourite tool|||Công cụ tester thích', 'The day of the week|||Ngày trong tuần'], 1),
  q('The test basis of white-box techniques is…|||Test basis của kỹ thuật white-box là…', ['the requirements|||yêu cầu', 'the internal structure (code, architecture)|||cấu trúc bên trong (code, kiến trúc)', 'user experience|||trải nghiệm người dùng', 'the market|||thị trường'], 1),
  q('100% statement coverage means…|||100% statement coverage nghĩa là…', ['the software has no defects|||phần mềm không có lỗi', 'every executable statement ran at least once|||mọi câu lệnh thực thi được đã chạy ít nhất một lần', 'every path was tested|||mọi đường đi đã được test', 'every decision outcome ran|||mọi kết quả quyết định đã chạy'], 1),
  q('In the PE unit-test template, Type "B" means…|||Trong template unit test của đề PE, Type "B" nghĩa là…', ['Blocked', 'Boundary', 'Bug', 'Black-box'], 1),
  q('Code: read A; IF A > 0 print "pos"; IF A % 2 == 0 print "even". Minimum tests for 100% DECISION coverage?|||Code: đọc A; IF A > 0 in "pos"; IF A % 2 == 0 in "even". Số test tối thiểu cho 100% DECISION coverage?', ['1', '2', '3', '4'], 1),
];

/* ─────────────────────────────── PT3 ─────────────────────────────── */
const PT3Q = [
  q('A benefit of independent testers is that they…|||Lợi ích của tester độc lập là họ…', ['share the developers\' assumptions|||có cùng giả định với developer', 'are likely to recognise different kinds of failures|||dễ nhận ra các loại failure khác', 'always finish faster|||luôn xong nhanh hơn', 'remove the need for developer testing|||khiến developer không cần test nữa'], 1),
  q('A drawback of test independence is…|||Nhược điểm của kiểm thử độc lập là…', ['isolation from the development team|||bị tách khỏi nhóm phát triển', 'too much knowledge of the code|||biết quá nhiều về code', 'no bias|||không có thiên kiến', 'lower cost|||chi phí thấp hơn'], 0),
  q('Writing and updating the test plan is typically the task of the…|||Viết và cập nhật test plan thường là việc của…', ['tester', 'test manager', 'developer', 'customer'], 1),
  q('A strategy based on an analysis of risks is…|||Chiến lược dựa trên phân tích rủi ro là…', ['analytical', 'reactive', 'directed (consultative)', 'regression-averse'], 0),
  q('Following ISO/IEC/IEEE 29119 because the industry requires it is a… strategy|||Làm theo ISO/IEC/IEEE 29119 vì ngành bắt buộc là chiến lược…', ['methodical', 'process-/standard-compliant', 'model-based', 'reactive'], 1),
  q('Designing tests while executing, reacting to what the system does, is a… strategy|||Thiết kế test ngay khi chạy, phản ứng theo hệ thống, là chiến lược…', ['reactive (dynamic)', 'analytical', 'methodical', 'model-based'], 0),
  q('Automating the regression of existing features to avoid breaking them is…|||Tự động hoá regression các tính năng cũ để khỏi làm hỏng chúng là…', ['regression-averse', 'directed', 'reactive', 'analytical'], 0),
  q('Which is a good EXIT criterion?|||Đâu là một tiêu chí RA tốt?', ['The test environment is ready|||Môi trường test đã sẵn sàng', '100% of requirements covered and no open critical defects|||Phủ 100% yêu cầu và không còn lỗi nghiêm trọng mở', 'Test data is available|||Có dữ liệu test', 'The code compiles|||Code biên dịch được'], 1),
  q('Which is a typical ENTRY criterion?|||Đâu là một tiêu chí VÀO điển hình?', ['The test environment and test data are ready|||Môi trường và dữ liệu test đã sẵn sàng', 'All defects are closed|||Mọi lỗi đã đóng', 'The summary report is approved|||Báo cáo tổng kết đã duyệt', 'Coverage is 100%|||Coverage đạt 100%'], 0),
  q('Metrics-based estimation relies on…|||Ước lượng dựa trên số liệu dựa vào…', ['historical data from similar projects|||dữ liệu lịch sử của dự án tương tự', 'the opinion of one expert|||ý kiến một chuyên gia', 'random numbers|||số ngẫu nhiên', 'the budget only|||chỉ ngân sách'], 0),
  q('Wideband Delphi and planning poker are…|||Wideband Delphi và planning poker là…', ['metrics-based techniques|||kỹ thuật dựa số liệu', 'expert-based techniques|||kỹ thuật dựa chuyên gia', 'test design techniques|||kỹ thuật thiết kế test', 'review types|||loại review'], 1),
  q('Three-point estimate with optimistic 2, most likely 5 and pessimistic 14 days: E = (a + 4m + b) / 6 = ?|||Ước lượng ba điểm với lạc quan 2, khả dĩ nhất 5, bi quan 14 ngày: E = (a + 4m + b) / 6 = ?', ['5', '6', '7', '7.5'], 1),
  q('Which metric is MOST useful during test execution?|||Chỉ số nào HỮU ÍCH nhất khi đang thực thi test?', ['Number of test cases executed and passed vs planned|||Số test case đã chạy và đã pass so với kế hoạch', 'Lines of code written|||Số dòng code đã viết', 'Number of meetings|||Số buổi họp', 'Office costs|||Chi phí văn phòng'], 0),
  q('Which is NOT normally part of a test summary report?|||Đâu KHÔNG thường có trong test summary report?', ['Summary of testing performed|||Tóm tắt việc test đã làm', 'Deviations from the plan|||Chênh lệch so với kế hoạch', 'The source code of each fix|||Mã nguồn của từng bản sửa', 'Metrics and residual risks|||Số liệu và rủi ro còn lại'], 2),
  q('The purpose of configuration management in testing is to…|||Mục đích của quản lý cấu hình trong kiểm thử là…', ['identify and control the versions of test items and testware|||nhận diện và kiểm soát phiên bản của hạng mục test và testware', 'design test cases|||thiết kế test case', 'estimate effort|||ước lượng công sức', 'hire testers|||tuyển tester'], 0),
  q('The level of a risk is determined by…|||Mức độ rủi ro được xác định bởi…', ['likelihood and impact|||khả năng xảy ra và mức tác động', 'cost only|||chỉ chi phí', 'the number of testers|||số tester', 'the test plan|||test plan'], 0),
  q('"The loan calculation may produce wrong interest" is a…|||"Tính khoản vay có thể ra lãi sai" là một…', ['project risk|||rủi ro dự án', 'product risk|||rủi ro sản phẩm', 'not a risk|||không phải rủi ro', 'defect report|||defect report'], 1),
  q('"The test environment may be delivered two weeks late" is a…|||"Môi trường test có thể được giao muộn hai tuần" là một…', ['product risk|||rủi ro sản phẩm', 'project risk|||rủi ro dự án', 'failure', 'root cause|||nguyên nhân gốc'], 1),
  q('Which field is essential for a developer to reproduce a defect?|||Trường nào thiết yếu để developer tái hiện lỗi?', ['The tester\'s opinion|||Ý kiến của tester', 'Steps to reproduce with test data and environment|||Các bước tái hiện kèm dữ liệu và môi trường', 'The reporter\'s phone number|||Số điện thoại người báo', 'The date of the next release|||Ngày phát hành tiếp theo'], 1),
  q('The company name is misspelt on the home page. Severity / priority?|||Tên công ty bị sai chính tả trên trang chủ. Severity / priority?', ['High / low|||Cao / thấp', 'Low / high|||Thấp / cao', 'High / high|||Cao / cao', 'Low / low|||Thấp / thấp'], 1),
  q('After the developer marks a defect "fixed", the tester should…|||Sau khi developer đánh dấu lỗi "đã sửa", tester nên…', ['close it immediately|||đóng ngay', 're-test (confirmation) and then close or reopen|||test lại (confirmation) rồi đóng hoặc mở lại', 'delete it|||xoá nó', 'raise its priority|||nâng priority'], 1),
  q('The "probe effect" of a tool means…|||"Probe effect" của công cụ nghĩa là…', ['the tool changes the behaviour of the system it measures|||công cụ làm thay đổi hành vi của hệ thống nó đo', 'the tool is too expensive|||công cụ quá đắt', 'the tool has no users|||không ai dùng công cụ', 'the tool finds all defects|||công cụ tìm hết lỗi'], 0),
  q('A typical risk of introducing a test tool is…|||Rủi ro điển hình khi đưa vào một công cụ test là…', ['unrealistic expectations of what the tool can do|||kỳ vọng phi thực tế về công cụ', 'too much repeatability|||lặp lại quá nhiều', 'more consistent tests|||test nhất quán hơn', 'faster feedback|||phản hồi nhanh hơn'], 0),
  q('An objective of a tool pilot project is to…|||Một mục tiêu của dự án thí điểm công cụ là…', ['roll the tool out to everyone at once|||triển khai cho mọi người cùng lúc', 'learn the tool and decide standard ways of using it|||học công cụ và quyết định cách dùng chuẩn', 'avoid any training|||tránh mọi đào tạo', 'replace all testers|||thay thế mọi tester'], 1),
  q('Data-driven testing…|||Data-driven testing…', ['separates test inputs and expected results from the script, often in a table|||tách dữ liệu vào và kết quả mong đợi khỏi script, thường để trong bảng', 'records a manual session|||ghi lại một phiên thao tác tay', 'uses only one data value|||chỉ dùng một giá trị dữ liệu', 'needs no script|||không cần script'], 0),
  q('Keyword-driven testing…|||Keyword-driven testing…', ['uses keywords that describe actions, so non-programmers can write tests|||dùng từ khoá mô tả hành động, người không lập trình cũng viết được test', 'is the same as capture/replay|||giống capture/replay', 'forbids tables|||cấm dùng bảng', 'only tests performance|||chỉ test hiệu năng'], 0),
  q('The Agile "whole-team approach" means…|||"Cách làm cả nhóm" trong Agile nghĩa là…', ['testers work alone at the end|||tester làm một mình ở cuối', 'business, developers and testers share responsibility for quality|||nghiệp vụ, developer và tester cùng chịu trách nhiệm chất lượng', 'no documentation at all|||không có tài liệu nào', 'only developers test|||chỉ developer test'], 1),
  q('Agile testing quadrant Q1 contains…|||Góc phần tư Q1 trong Agile testing chứa…', ['unit and component tests (technology-facing, supporting the team)|||unit và component test (hướng công nghệ, hỗ trợ nhóm)', 'usability tests|||test khả dụng', 'performance tests|||test hiệu năng', 'exploratory tests|||test khám phá'], 0),
  q('The TDD cycle is…|||Chu trình TDD là…', ['code → test → refactor', 'failing test → code to pass → refactor|||test fail → code cho pass → refactor', 'design → code → deploy', 'refactor → test → code'], 1),
  q('In INVEST, the "T" of a good user story stands for…|||Trong INVEST, chữ "T" của user story tốt là…', ['Timed', 'Testable', 'Technical', 'Traceable'], 1),
];

/* ─────────────────────────────── FE mock (CTFL blueprint) ─────────────────────────────── */
const FEQ = [
  q('[C1] A developer misunderstands a requirement and writes code that gives a user the wrong result. The misunderstanding is the…|||[C1] Developer hiểu sai yêu cầu và viết code khiến người dùng nhận kết quả sai. Việc hiểu sai là…', ['error', 'defect', 'failure', 'incident'], 0),
  q('[C1] Which is NOT one of the seven testing principles?|||[C1] Đâu KHÔNG phải một trong bảy nguyên tắc?', ['Early testing', 'Defect clustering', 'Testing proves the software is correct|||Kiểm thử chứng minh phần mềm đúng', 'Pesticide paradox'], 2),
  q('[C1] A bug-free booking app is never used because it does not solve the users\' real problem. Which principle?|||[C1] Một app đặt chỗ không lỗi nhưng không ai dùng vì không giải quyết đúng vấn đề. Nguyên tắc nào?', ['Absence-of-errors fallacy', 'Exhaustive testing is impossible', 'Early testing', 'Defect clustering'], 0),
  q('[C1] The test basis is…|||[C1] Test basis là…', ['the body of knowledge used as the basis for test analysis and design|||khối kiến thức làm cơ sở cho phân tích và thiết kế test', 'the test environment|||môi trường test', 'the test log|||test log', 'the defect database|||CSDL lỗi'], 0),
  q('[C1] Deriving test conditions from the SRS happens in…|||[C1] Suy ra test condition từ SRS diễn ra ở…', ['Test planning', 'Test analysis', 'Test implementation', 'Test completion'], 1),
  q('[C1] Which work products come from test implementation?|||[C1] Sản phẩm nào đến từ test implementation?', ['Test conditions|||Test condition', 'Test suites and the test execution schedule|||Test suite và lịch thực thi test', 'Test summary report', 'Change requests'], 1),
  q('[C1] Which mindset is typical of a good tester?|||[C1] Tư duy nào điển hình của tester giỏi?', ['Curiosity, professional pessimism and a critical eye|||Tò mò, bi quan chuyên nghiệp, con mắt phê phán', 'Confirmation of what the developer intended|||Khẳng định điều developer định làm', 'Avoiding bad news|||Tránh tin xấu', 'Blaming the author|||Đổ lỗi cho tác giả'], 0),
  q('[C1] Why is testing necessary?|||[C1] Vì sao cần kiểm thử?', ['To reduce the risk of failures in operation|||Để giảm rủi ro hỏng hóc khi vận hành', 'To prove there are no defects|||Để chứng minh không có lỗi', 'Because it is in the plan|||Vì có trong kế hoạch', 'To fill time before release|||Để lấp thời gian trước phát hành'], 0),
  q('[C2] Which is a characteristic of good testing in any lifecycle?|||[C2] Đặc điểm kiểm thử tốt trong mọi vòng đời?', ['Test analysis and design start during the corresponding development activity|||Phân tích và thiết kế test bắt đầu trong hoạt động phát triển tương ứng', 'Testing starts after coding|||Kiểm thử bắt đầu sau khi code', 'Only one test level is used|||Chỉ dùng một cấp test', 'Testers never review requirements|||Tester không review yêu cầu'], 0),
  q('[C2] Testing backup, restore and user management by system administrators is…|||[C2] Quản trị hệ thống test sao lưu, khôi phục và quản lý người dùng là…', ['UAT', 'OAT', 'Contractual AT', 'Beta testing'], 1),
  q('[C2] An interface mismatch between two components is typically found in…|||[C2] Giao diện không khớp giữa hai thành phần thường được phát hiện ở…', ['component testing', 'integration testing', 'acceptance testing', 'maintenance testing'], 1),
  q('[C2] Which is a NON-functional test at component level?|||[C2] Đâu là test PHI chức năng ở cấp component?', ['How compound interest is calculated|||Cách tính lãi kép', 'Time taken to perform a complex interest calculation|||Thời gian thực hiện một phép tính lãi phức tạp', 'How a banker handles a credit application|||Nhân viên xử lý hồ sơ tín dụng', 'Coverage of all decisions|||Phủ mọi quyết định'], 1),
  q('[C2] Which are triggers for maintenance testing?|||[C2] Đâu là các tác nhân kích hoạt kiểm thử bảo trì?', ['Modification, migration, retirement|||Sửa đổi, chuyển đổi, ngừng sử dụng', 'Planning, design, coding|||Lập kế hoạch, thiết kế, code', 'Alpha, beta, gamma', 'Reviews only|||Chỉ review'], 0),
  q('[C3] A key benefit of static testing is…|||[C3] Lợi ích chính của kiểm thử tĩnh là…', ['defects are found before execution, when they are cheaper to fix|||lỗi được tìm trước khi chạy, lúc sửa còn rẻ', 'it measures performance|||nó đo hiệu năng', 'it replaces dynamic testing|||nó thay thế kiểm thử động', 'it needs no people|||không cần con người'], 0),
  q('[C3] Reviewers examining the work product on their own and noting issues is the activity…|||[C3] Reviewer tự xem xét sản phẩm và ghi lại vấn đề là hoạt động…', ['planning', 'initiate review', 'individual review', 'fixing and reporting'], 2),
  q('[C3] Compared with a walkthrough, an inspection…|||[C3] So với walkthrough, inspection…', ['has no roles|||không có vai trò', 'has defined roles, entry/exit criteria and metrics, led by a trained moderator|||có vai trò rõ, tiêu chí vào/ra và số liệu, do moderator được đào tạo dẫn', 'is always informal|||luôn không chính thức', 'is led by the author|||do tác giả dẫn'], 1),
  q('[C3] A success factor for reviews is…|||[C3] Một yếu tố thành công của review là…', ['clear objectives and the right people involved|||mục tiêu rõ ràng và đúng người tham gia', 'using reviews to evaluate staff|||dùng review để đánh giá nhân viên', 'no time for preparation|||không có thời gian chuẩn bị', 'reviewing everything at once|||review mọi thứ một lượt'], 0),
  q('[C3] Static analysis tools are typically used by…|||[C3] Công cụ phân tích tĩnh thường do ai dùng?', ['developers, before and during component and integration testing|||developer, trước và trong component/integration testing', 'end users|||người dùng cuối', 'managers only|||chỉ quản lý', 'nobody|||không ai'], 0),
  q('[C4] Valid speeds are 50–90 km/h. Which value is in the same partition as 55?|||[C4] Tốc độ hợp lệ là 50–90 km/h. Giá trị nào cùng phân vùng với 55?', ['49', '91', '80', '95'], 2),
  q('[C4] Marks: 0–39 fail, 40–59 pass, 60–79 merit, 80–100 distinction (integers). Which set gives two-value BVA of all valid partitions?|||[C4] Điểm: 0–39 trượt, 40–59 đạt, 60–79 khá, 80–100 giỏi (số nguyên). Bộ nào là BVA hai giá trị cho mọi phân vùng hợp lệ?', ['0, 39, 40, 59, 60, 79, 80, 100', '1, 38, 41, 58, 61, 78, 81, 99', '0, 40, 60, 80, 100', '39, 59, 79'], 0),
  q('[C4] Loan: approve only if employed AND salary > 1,000; if not employed, reject regardless of salary. How many rules after collapsing the table?|||[C4] Cho vay: chỉ duyệt nếu có việc làm VÀ lương > 1.000; không có việc thì từ chối bất kể lương. Sau khi rút gọn bảng còn bao nhiêu rule?', ['2', '3', '4', '8'], 1),
  q('[C4] A state table has 4 states and 5 events. How many state/event combinations should be considered (valid and invalid)?|||[C4] Bảng trạng thái có 4 trạng thái và 5 sự kiện. Cần xét bao nhiêu tổ hợp trạng thái/sự kiện (hợp lệ và không hợp lệ)?', ['9', '20', '5', '4'], 1),
  q('[C4] Use-case testing is particularly good at finding defects in…|||[C4] Use-case testing đặc biệt giỏi tìm lỗi ở…', ['process flows during real-world use|||luồng xử lý khi sử dụng thực tế', 'variable declarations|||khai báo biến', 'code comments|||chú thích code', 'memory allocation|||cấp phát bộ nhớ'], 0),
  q('[C4] read A; IF A > 0 print "pos"; IF A % 2 == 0 print "even". Minimum tests for 100% STATEMENT coverage?|||[C4] đọc A; IF A > 0 in "pos"; IF A % 2 == 0 in "even". Số test tối thiểu cho 100% STATEMENT coverage?', ['1', '2', '3', '4'], 0),
  q('[C4] Same code. Minimum tests for 100% DECISION coverage?|||[C4] Cùng đoạn code. Số test tối thiểu cho 100% DECISION coverage?', ['1', '2', '3', '4'], 1),
  q('[C4] Which statement about coverage is true?|||[C4] Câu nào về coverage là đúng?', ['100% decision coverage implies 100% statement coverage|||100% decision coverage suy ra 100% statement coverage', '100% statement coverage implies 100% decision coverage|||100% statement coverage suy ra 100% decision coverage', '100% coverage means no defects|||100% coverage nghĩa là không có lỗi', 'Coverage cannot be measured|||Không đo được coverage'], 0),
  q('[C4] Experience-based techniques are most useful when…|||[C4] Kỹ thuật dựa kinh nghiệm hữu ích nhất khi…', ['specifications are poor and time is short|||đặc tả kém và thời gian ngắn', 'formal coverage is mandatory|||bắt buộc coverage chính thức', 'testers have no experience|||tester không có kinh nghiệm', 'the system is safety-critical and fully specified|||hệ thống an toàn-sống-còn và đặc tả đầy đủ'], 0),
  q('[C4] A test charter defines…|||[C4] Test charter xác định…', ['the objective (mission) of an exploratory session|||mục tiêu (nhiệm vụ) của một phiên khám phá', 'every test step|||mọi bước test', 'the code to write|||code phải viết', 'the budget|||ngân sách'], 0),
  q('[C4] Error guessing belongs to which category?|||[C4] Error guessing thuộc nhóm nào?', ['Black-box', 'White-box', 'Experience-based', 'Static'], 2),
  q('[C5] Which is a potential drawback of independent testing?|||[C5] Đâu là nhược điểm tiềm ẩn của kiểm thử độc lập?', ['Developers may lose a sense of responsibility for quality|||Developer có thể mất ý thức chịu trách nhiệm chất lượng', 'Testers find different defects|||Tester tìm được lỗi khác', 'Assumptions are challenged|||Giả định bị chất vấn', 'Less bias|||Ít thiên kiến hơn'], 0),
  q('[C5] Which is typical test-plan content?|||[C5] Đâu là nội dung điển hình của test plan?', ['Scope, objectives, risks, approach, schedule, entry and exit criteria|||Phạm vi, mục tiêu, rủi ro, cách tiếp cận, lịch, tiêu chí vào/ra', 'The source code|||Mã nguồn', 'Detailed defect fixes|||Chi tiết bản sửa lỗi', 'Marketing plan|||Kế hoạch marketing'], 0),
  q('[C5] Which is a common test metric?|||[C5] Đâu là một chỉ số test phổ biến?', ['Percentage of planned test cases executed|||Tỉ lệ test case đã chạy so với kế hoạch', 'Number of coffee breaks|||Số lần nghỉ giải lao', 'Office size|||Diện tích văn phòng', 'Number of emails|||Số email'], 0),
  q('[C5] A test progress report is produced…|||[C5] Báo cáo tiến độ test được lập…', ['during test monitoring and control|||trong khi giám sát và kiểm soát test', 'only at project start|||chỉ lúc bắt đầu dự án', 'only after release|||chỉ sau phát hành', 'never|||không bao giờ'], 0),
  q('[C5] Configuration management helps testing by…|||[C5] Quản lý cấu hình giúp kiểm thử nhờ…', ['uniquely identifying and version-controlling all test items and testware|||nhận diện duy nhất và kiểm soát phiên bản mọi hạng mục test và testware', 'designing test cases|||thiết kế test case', 'fixing defects|||sửa lỗi', 'hiring testers|||tuyển tester'], 0),
  q('[C5] In risk-based testing, test effort is allocated according to…|||[C5] Trong risk-based testing, công sức test được phân bổ theo…', ['the risk level of each item|||mức rủi ro của từng hạng mục', 'alphabetical order|||thứ tự chữ cái', 'the tester\'s preference|||sở thích tester', 'code length only|||chỉ độ dài code'], 0),
  q('[C5] Which is a PROJECT risk?|||[C5] Đâu là rủi ro DỰ ÁN?', ['Key testers may leave during the project|||Tester chủ chốt có thể nghỉ giữa dự án', 'The system may calculate tax incorrectly|||Hệ thống có thể tính thuế sai', 'The UI may be hard to use|||Giao diện có thể khó dùng', 'Response time may be too slow|||Thời gian đáp ứng có thể quá chậm'], 0),
  q('[C5] An objective of a defect report is to…|||[C5] Một mục tiêu của defect report là…', ['give developers the information needed to identify, isolate and fix the defect|||cung cấp cho developer thông tin để nhận diện, cô lập và sửa lỗi', 'blame the author|||đổ lỗi cho tác giả', 'replace the test plan|||thay test plan', 'close the project|||đóng dự án'], 0),
  q('[C5] Priorities (1 = highest): TC1 P2; TC2 P1 but depends on TC3; TC3 P3; TC4 P1. Best execution order?|||[C5] Độ ưu tiên (1 = cao nhất): TC1 P2; TC2 P1 nhưng phụ thuộc TC3; TC3 P3; TC4 P1. Thứ tự thực thi tốt nhất?', ['TC2, TC4, TC3, TC1', 'TC4, TC3, TC2, TC1', 'TC1, TC3, TC2, TC4', 'TC3, TC1, TC2, TC4'], 1),
  q('[C6] A test management tool typically supports…|||[C6] Công cụ quản lý test thường hỗ trợ…', ['traceability between requirements, tests and defects, and reporting|||truy vết giữa yêu cầu, test, lỗi, và báo cáo', 'compiling code|||biên dịch code', 'drawing UI mock-ups|||vẽ mock-up giao diện', 'payroll|||tính lương'], 0),
  q('[C6] A risk of test automation is…|||[C6] Một rủi ro của tự động hoá test là…', ['underestimating the time, cost and effort to introduce and maintain the tool|||đánh giá thấp thời gian, chi phí, công sức đưa vào và bảo trì công cụ', 'greater repeatability|||lặp lại tốt hơn', 'objective assessment|||đánh giá khách quan', 'faster regression|||regression nhanh hơn'], 0),
];

const PE_LIST = [['PE1', 'FA25 PE2'], ['PE2', 'FA25 PE1'], ['PE3', 'SU25 Practice'], ['PE4', 'SU25 PE2'], ['PE5', 'FALL24 PE4'], ['PE6', 'SP2025'], ['PE7', 'SP2025'], ['PE8', 'SP2024 Block 5'], ['PE9', 'FALL24 PE3'], ['PE10', 'FA2024 PE2'], ['PE11', 'FA2024 PE1'], ['PE12', 'Sample FA2024'], ['PE13', 'SU2024 B5PE1'], ['PE14', 'SU2024 PE1'], ['PE15', 'SP2024 Block 5 PE2'], ['PE16', 'SP2024 PE2'], ['PE17', 'SP2024 PE1'], ['PE18', 'FA2023 PE1.2'], ['PE19', 'FA2023 PE1'], ['PE20', 'SUM23'], ['PE21', 'SP2023'], ['PE22', 'SU2024 Block 10W PE2']];
const FE_LIST = [['FE1', 'SP26 RE'], ['FE2', 'SP26 FE'], ['FE3', 'FA25 RE'], ['FE4', 'SP2024 RE'], ['FE5', 'SU25 RE'], ['FE6', 'SP2025 RE'], ['FE7', 'SP2025 FE'], ['FE8', 'SU25 FE'], ['FE9', 'FA2024 FE'], ['FE11', 'FA2024 Block 5 RE'], ['FE12', 'FA2024 RE'], ['FE13', 'FA2024 Block 5 FE'], ['FE14', 'SU2024 Block 5 FE'], ['FE15', 'SUM23 FE'], ['FE16', 'SUM23 2nd FE'], ['FE17', 'FA2023 FE'], ['FE18', 'FA2023 RE'], ['FE20', 'SP2024 FE'], ['FE21', 'SU2024 RE'], ['FE22', 'SU2024 FE'], ['FE23', 'FA2022 FE'], ['FE24', 'SP2023 FE']];
const grid = (list) => `<div class="table-wrap"><table><thead><tr><th>Exam-room paper</th><th>Sitting</th><th>Paper</th><th>Sitting</th></tr></thead><tbody>${
  Array.from({ length: Math.ceil(list.length / 2) }, (_, i) => {
    const a = list[2 * i], b = list[2 * i + 1];
    return `<tr><td>SWT301-${a[0]}</td><td>${a[1]}</td><td>${b ? 'SWT301-' + b[0] : ''}</td><td>${b ? b[1] : ''}</td></tr>`;
  }).join('')}</tbody></table></div>`;
const EXAM = '<p class="di-toi"><a href="/exam?course=SWT301">📝 Open the SWT301 Exam room →</a></p>';
const EXAM_VI = '<p class="di-toi"><a href="/exam?course=SWT301">📝 Mở Phòng thi SWT301 →</a></p>';

const ptLesson = (n, slug, chapters, questions, descr) => ({
  title: `Progress Test ${n}|||Progress Test ${n}`,
  slug, type: 'QUIZ', description: descr,
  quiz: { timeLimitSeconds: 60 * questions.length, questions },
});

export const pt1 = {
  title: 'Progress Test 1 — Fundamentals & SDLC|||Progress Test 1 — Nền tảng & SDLC',
  description: 'Bài kiểm tra tiến độ 1 (mô phỏng): 30 câu tình huống và tính toán về Chương 1–2 — làm sau khi xong Quiz 1 và Quiz 2.',
  lessons: [ptLesson(1, 'swt301-progress-test-1', '1–2', PT1Q, 'Tổng hợp Chương 1–2: 30 câu mới (không trùng câu trên slide), 30 phút, có câu tính tổ hợp và câu phân loại tình huống.')],
};
export const pt2 = {
  title: 'Progress Test 2 — Static & test design|||Progress Test 2 — Static & thiết kế test',
  description: 'Bài kiểm tra tiến độ 2 (mô phỏng): 30 câu về kiểm thử tĩnh, black-box, white-box, dựa kinh nghiệm — nhiều câu tính EP/BVA/V(G)/coverage.',
  lessons: [ptLesson(2, 'swt301-progress-test-2', '3–6', PT2Q, 'Tổng hợp Chương 3–6: 30 câu, 30 phút, gồm câu tính phân vùng, giá trị biên, V(G), số test tối thiểu cho coverage.')],
};
export const pt3 = {
  title: 'Progress Test 3 — Management, tools & Agile|||Progress Test 3 — Quản lý, công cụ & Agile',
  description: 'Bài kiểm tra tiến độ 3 (mô phỏng): 31 câu về quản lý test, công cụ, Agile — cộng 2 đề PT3 thật trong Phòng thi.',
  lessons: [ptLesson(3, 'swt301-progress-test-3', '7–9', PT3Q, 'Tổng hợp Chương 7–9: 31 câu, gồm ước lượng ba điểm, severity/priority, chiến lược test, tool, TDD/INVEST. Đề PT3 thật: SWT301-PT3-1, PT3-2 trong Phòng thi.')],
};

const PE_GUIDE = {
  title: 'PE — Practical Exam: format, marking & the 22 papers in the Exam room|||PE — Thi thực hành: cấu trúc, cách chấm & 22 đề trong Phòng thi',
  slug: 'swt301-final-exam-pe',
  type: 'DOCUMENT',
  description: 'Cấu trúc đề PE (3 câu, 90 phút, không IDE, làm trên template Excel), cách chấm từng câu, chiến lược thời gian, và danh sách 22 đề PE thật có chấm AI trong Phòng thi.',
  content: [
    bi(`<span class="eyebrow">Final Exam · PE</span>
<h2>The Practical Exam</h2>
<p class="lead">90 minutes, no IDE, three questions answered in the official Excel templates. The <strong>PE section</strong> just before this one solves full past papers step by step; this lesson is the checklist for exam day.</p>
<table>
<thead><tr><th>Question</th><th>Task</th><th>Points</th><th>Where you learned it</th></tr></thead>
<tbody>
<tr><td>Q1</td><td>Review a Java class and find at least 6 issues (compile errors, coding practice, logic, robustness) — "Issue No | Description | Line"</td><td>3</td><td>Ch.3, Lab 1, Practice P.2</td></tr>
<tr><td>Q2</td><td>Design the minimum unit test cases for 100% statement and 100% decision coverage of a method, in the UTCID grid (conditions, inputs, confirm/return, exception, type N/A/B)</td><td>3</td><td>Ch.5, Lab 2</td></tr>
<tr><td>Q3</td><td>Black-box for a function spec: table 3.1 EP/BVA with tags, table 3.2 ten test cases covering the tags, table 3.3 preconditions and procedures</td><td>4</td><td>Ch.4, Practice P.3</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Zero-mark traps from the paper's own instructions:</b> any answer containing information irrelevant to the question gets 0; the blue sample text in the templates must be deleted; grey cells must not be edited.</div>
<h3>The 22 real PE papers you can take in the Exam room (AI-marked write-in answers)</h3>
${grid(PE_LIST)}
${EXAM}`,
    `<span class="eyebrow">Thi cuối kỳ · PE</span>
<h2>Bài thi thực hành</h2>
<p class="lead">90 phút, không IDE, ba câu làm trên template Excel chính thức. <strong>Phần PE</strong> ngay trước phần này giải trọn các đề cũ từng bước; bài này là checklist cho ngày thi.</p>
<table>
<thead><tr><th>Câu</th><th>Yêu cầu</th><th>Điểm</th><th>Đã học ở</th></tr></thead>
<tbody>
<tr><td>Q1</td><td>Review một lớp Java và tìm ít nhất 6 lỗi (lỗi biên dịch, thói quen code, logic, độ bền) — "Issue No | Description | Line"</td><td>3</td><td>Ch.3, Lab 1, Dự án luyện tập P.2</td></tr>
<tr><td>Q2</td><td>Thiết kế số unit test case tối thiểu để đạt 100% statement và 100% decision coverage của một phương thức, trên lưới UTCID (điều kiện, dữ liệu vào, confirm/return, exception, type N/A/B)</td><td>3</td><td>Ch.5, Lab 2</td></tr>
<tr><td>Q3</td><td>Black-box cho một đặc tả chức năng: bảng 3.1 EP/BVA có tag, bảng 3.2 mười test case phủ các tag, bảng 3.3 điều kiện trước và các bước</td><td>4</td><td>Ch.4, Dự án luyện tập P.3</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Bẫy 0 điểm ngay trong hướng dẫn của đề:</b> câu trả lời chứa thông tin không liên quan tới câu hỏi bị 0 điểm; chữ mẫu màu xanh trong template phải xoá; ô màu xám không được sửa.</div>
<h3>22 đề PE thật làm được trong Phòng thi (bài viết chấm bằng AI)</h3>
${grid(PE_LIST)}
${EXAM_VI}`),
  ].join('\n'),
};

const FE_GUIDE = {
  title: 'FE — Theory exam: blueprint, strategy & the 22 papers in the Exam room|||FE — Thi lý thuyết: cấu trúc, chiến lược & 22 đề trong Phòng thi',
  slug: 'swt301-final-exam-fe-guide',
  type: 'DOCUMENT',
  description: 'Đề lý thuyết (~60 câu, 60 phút): chương nào nhiều câu, cách ôn trong 2 tuần cuối, và danh sách 22 đề FE thật trong Phòng thi.',
  content: [
    bi(`<span class="eyebrow">Final Exam · FE</span>
<h2>The theory exam</h2>
<p class="lead">About 60 single-choice questions in 60 minutes, drawn from all chapters, in the same style as the ISTQB exam (lesson 0.5). The best preparation is volume: the Exam room holds 22 real papers.</p>
<ol>
<li><b>Two weeks before:</b> redo every chapter quiz here (all the slide questions are in them) until ≥ 90%.</li>
<li><b>From 10 days before:</b> one timed FE paper every day or two; after each, reread the slide behind every wrong answer.</li>
<li><b>3 days before:</b> the 40-question mock below under exam conditions, plus the mock exam in the main textbook (Ch.7, p.232).</li>
<li><b>On the day:</b> two passes, flag and return, no blanks.</li>
</ol>
<h3>The 22 real FE papers in the Exam room</h3>
${grid(FE_LIST)}
${EXAM}`,
    `<span class="eyebrow">Thi cuối kỳ · FE</span>
<h2>Bài thi lý thuyết</h2>
<p class="lead">Khoảng 60 câu một đáp án trong 60 phút, lấy từ mọi chương, cùng kiểu câu hỏi với đề ISTQB (bài 0.5). Cách chuẩn bị tốt nhất là làm nhiều: Phòng thi có sẵn 22 đề thật.</p>
<ol>
<li><b>Hai tuần trước:</b> làm lại mọi quiz chương trên trang (đã gồm toàn bộ câu hỏi trên slide) tới khi ≥ 90%.</li>
<li><b>Từ 10 ngày trước:</b> một đề FE bấm giờ mỗi một hai ngày; làm xong đọc lại đúng slide của từng câu sai.</li>
<li><b>3 ngày trước:</b> làm đề thử 40 câu bên dưới trong điều kiện như thi thật, cộng đề thử trong giáo trình chính (Ch.7, trang 232).</li>
<li><b>Ngày thi:</b> làm hai lượt, đánh dấu rồi quay lại, không bỏ trống.</li>
</ol>
<h3>22 đề FE thật trong Phòng thi</h3>
${grid(FE_LIST)}
${EXAM_VI}`),
  ].join('\n'),
};

const FE_MOCK = {
  title: 'FE mock exam — 40 questions on the CTFL blueprint|||Đề FE thử — 40 câu theo cấu trúc CTFL',
  slug: 'swt301-final-exam-fe',
  type: 'QUIZ',
  description: '40 câu phân bổ đúng như đề CTFL (C1 8 · C2 5 · C3 5 · C4 11 · C5 9 · C6 2), 60 phút — làm như thi thật.',
  quiz: { timeLimitSeconds: 3600, questions: FEQ },
};

export const finalExam = {
  title: 'Final Exam|||Thi cuối kỳ',
  description: 'Thi cuối kỳ gồm PE (thực hành, 3 câu, 90 phút) và FE (trắc nghiệm, ~60 câu, 60 phút): hướng dẫn, danh sách 22 đề PE + 22 đề FE thật trong Phòng thi, và một đề FE thử 40 câu.',
  lessons: [PE_GUIDE, FE_GUIDE, FE_MOCK],
};
