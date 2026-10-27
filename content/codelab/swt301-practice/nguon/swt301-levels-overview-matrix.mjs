/**
 * SWT301 · 2.6 — The teacher's overview (Overview.xlsx): UAT · SIT · ST · CIT · CT.
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const CAP = ['UAT', 'SIT', 'ST', 'CIT', 'CT'];
const E1 = tinhDe({
  tieuDe: 'Overview 1 — Rebuild the Overview.xlsx rows',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>The teacher’s spreadsheet <i>Overview.xlsx</i> compresses chapter 2 into one table using the five-level naming of FPT projects: <b>UAT</b> (user acceptance), <b>SIT</b> (system integration), <b>ST</b> (system), <b>CIT</b> (component integration), <b>CT</b> (component/unit). Put each cell back in its row.</p>', vi: '<p>Bảng <i>Overview.xlsx</i> của thầy/cô nén chương 2 vào một bảng theo cách gọi năm cấp của dự án FPT: <b>UAT</b>, <b>SIT</b>, <b>ST</b>, <b>CIT</b>, <b>CT</b>. Đặt mỗi ô về đúng dòng.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Cell → level', 'Ô → cấp'),
    cot: [{ ma: 'c', ten: 'Cell of the sheet' }, { ma: 'l', ten: 'Level', luaChon: CAP }],
    hang: [
      'Objective: validate user requirements / system requirements',
      'Objective: method correctness, robustness, coding logic',
      'Test basis: architectural design document (ADD), sequence diagrams',
      'Test basis: software requirement specification (SRS)',
      'Test object: subsystem / system interfaces',
      'Approach: business-process-based, user-requirement-based, monkey test',
      'Common test types: API test, GUI integration, front-end → back-end function integration',
      'Techniques: black-box on inputs/outputs of a method, white-box statement and branch coverage',
    ].map((c, i) => ({ ma: `r${i}`, o: { c } })),
    dapAn: { 'r0.l': 'UAT', 'r1.l': 'CT', 'r2.l': 'CIT', 'r3.l': 'ST', 'r4.l': 'SIT', 'r5.l': 'UAT', 'r6.l': 'CIT', 'r7.l': 'CT' },
    giaiThich: giai('Only UAT validates; every lower level verifies against a document: SRS for ST, ADD/sequence diagrams for CIT, the class specification for CT. White-box appears only at CT and CIT, done by developers.', 'Chỉ UAT validate; mọi cấp thấp hơn verify theo một tài liệu: SRS cho ST, ADD/sequence diagram cho CIT, đặc tả lớp cho CT. White-box chỉ có ở CT và CIT, do developer làm.'),
  }],
  goiY: ['Dòng trên validate, dòng dưới verify.', 'Mở tài liệu nào để thiết kế test? SRS ⇒ ST; ADD ⇒ CIT; đặc tả lớp ⇒ CT.'],
  loiHayGap: ['Gán SRS cho SIT — SIT verify theo đặc tả yêu cầu hệ thống nhưng đối tượng là GIAO DIỆN hệ thống.', 'Gán monkey test cho ST.'],
  giaiThich: '<p>UAT · CT · CIT · ST · SIT · UAT · CIT · CT.</p>',
  thuatNgu: [{ en: 'ADD', vi: 'tài liệu thiết kế kiến trúc' }, { en: 'monkey test', vi: 'nhập ngẫu nhiên không kịch bản xem có gì vỡ' }],
  khaiNiem: ['test levels overview'],
});

const E2 = tinhDe({
  tieuDe: 'Overview 2 — One requirement, four levels (PE FA23 style)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Requirement from a practical exam: “<i>Lab name is a required string of 5–30 characters; the first character must be a letter; no special characters.</i>” LabBook uses it in the “Create lab” function. Decide the level of each planned test.</p>', vi: '<p>Yêu cầu kiểu đề PE: “<i>Tên phòng lab là chuỗi bắt buộc 5–30 ký tự; ký tự đầu phải là chữ cái; không có ký tự đặc biệt.</i>” LabBook dùng nó trong chức năng “Tạo phòng lab”. Xác định cấp của từng test dự kiến.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Planned test → level', 'Test dự kiến → cấp'),
    cot: [{ ma: 't', ten: 'Planned test' }, { ma: 'l', ten: 'Level', luaChon: ['UAT', 'CIT', 'ST', 'CT'] }],
    hang: [
      'isValidLabName(String) with lengths 4, 5, 30, 31, a first digit and a “#”',
      'Branch coverage of isValidLabName',
      'The form posts the name to the service; the service’s error message comes back and is shown on the form',
      'The whole “Create lab” function through the UI against the SRS, with a decision table of name × capacity × building',
      'The head of the lab department creates the real labs for next semester end-to-end',
      'Postman: POST /labs with a 31-character name returns 400 and the error code LAB_NAME_LENGTH',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.l': 'CT', 'r1.l': 'CT', 'r2.l': 'CIT', 'r3.l': 'ST', 'r4.l': 'UAT', 'r5.l': 'CIT' },
    giaiThich: giai('The worked example of the lesson: EP + BVA and branch coverage on the method (CT); form ↔ service and API calls (CIT); the whole function against the SRS through the UI (ST); a real user end-to-end (UAT).', 'Ví dụ mẫu của bài: EP + BVA và branch coverage trên method (CT); form ↔ service và gọi API (CIT); cả chức năng theo SRS qua giao diện (ST); người dùng thật đầu-cuối (UAT).'),
  }],
  goiY: ['Gọi thẳng method ⇒ CT; gọi API/giữa hai lớp ⇒ CIT; qua UI theo SRS ⇒ ST.', 'Kiểm API bằng Postman thuộc CIT trong bảng của thầy/cô.'],
  loiHayGap: ['Gán Postman vào ST.', 'Gán branch coverage vào ST — white-box chỉ ở CT/CIT.'],
  giaiThich: '<p>CT · CT · CIT · ST · UAT · CIT.</p>',
  thuatNgu: [{ en: 'Postman', vi: 'công cụ gọi API thủ công/tự động' }],
  khaiNiem: ['test levels overview'],
});

const E3 = tinhDe({
  tieuDe: 'Overview 3 — Reading the sheet (exam style)',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Five questions that check you can read the overview table — the kind of reasoning PE Question 3 and the Lab reports (Report 5.1 unit, 5.2 integration, 5.3 system) rely on.</p>', vi: '<p>Năm câu kiểm tra bạn đọc được bảng tổng quan — kiểu lập luận mà câu 3 đề PE và các báo cáo Lab (Report 5.1 unit, 5.2 integration, 5.3 system) dựa vào.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which techniques appear at EVERY level of the sheet?', 'Kỹ thuật nào có ở MỌI cấp của bảng?'), luaChon: lc(['a', 'Statement and branch coverage'], ['b', 'Equivalence partitioning, boundary value analysis, decision tables'], ['c', 'Monkey testing'], ['d', 'Load testing']), dapAn: ['b'], giaiThich: giai('They are the black-box workhorses of chapter 4.', 'Chúng là “ngựa thồ” black-box của chương 4.') },
    { ma: 'q2', de: hai('Which FPT report template matches CT?', 'Template báo cáo nào của FPT ứng với CT?'), luaChon: lc(['a', 'Report 5.1 Unit Test'], ['b', 'Report 5.3 System Test'], ['c', 'Report 3 SRS'], ['d', 'None']), dapAn: ['a'], giaiThich: giai('5.1 = unit (Lab 2), 5.2 = integration (Lab 3), 5.3 = system (Lab 4).', '5.1 = unit (Lab 2), 5.2 = integration (Lab 3), 5.3 = system (Lab 4).') },
    { ma: 'q3', de: hai('Why do FPT projects report CIT and SIT separately?', 'Vì sao dự án FPT báo cáo CIT và SIT riêng?'), luaChon: lc(['a', 'The syllabus requires two separate levels'], ['b', 'Different people do them: developers with API tools (CIT) and the test team against external systems (SIT)'], ['c', 'SIT does not exist'], ['d', 'To have more reports']), dapAn: ['b'], giaiThich: giai('CTFL has one integration level with two sub-levels; industry often reports them separately.', 'CTFL có một cấp integration với hai cấp con; thực tế thường báo cáo riêng.') },
    { ma: 'q4', de: hai('In the sheet, which levels use white-box techniques?', 'Trong bảng, cấp nào dùng kỹ thuật white-box?'), luaChon: lc(['a', 'All levels'], ['b', 'Only CT and CIT, by developers'], ['c', 'Only UAT'], ['d', 'Only ST']), dapAn: ['b'], giaiThich: giai('Consistent with the slide: white-box at component and component-integration level is done by developers. (In theory white-box can be applied at any level — e.g. menu coverage at system level — but the sheet records common practice.)', 'Khớp slide: white-box ở component và component integration do developer làm. (Về lý thuyết white-box làm được ở mọi cấp — vd độ phủ menu ở system — nhưng bảng ghi theo thực tế phổ biến.)') },
    { ma: 'q5', de: hai('Which objective appears ONLY in the UAT row?', 'Mục tiêu nào CHỈ có ở dòng UAT?'), luaChon: lc(['a', 'Verify'], ['b', 'Validate'], ['c', 'Find interface defects'], ['d', 'Coding logic']), dapAn: ['b'], giaiThich: giai('Top row validates, lower rows verify.', 'Dòng trên validate, dòng dưới verify.') },
  ],
  goiY: ['5.1 / 5.2 / 5.3 = unit / integration / system.', 'Validate chỉ có ở UAT.'],
  loiHayGap: ['Chọn “mọi cấp” cho white-box trong bảng của thầy/cô.', 'Cho rằng syllabus có hai cấp integration riêng.'],
  giaiThich: '<p>Answers: b · a · b · b · b.</p>',
  thuatNgu: [{ en: 'Report 5.1 / 5.2 / 5.3', vi: 'template báo cáo unit / integration / system test của FPT' }],
  khaiNiem: ['test levels overview'],
});

const E4 = tinhDe({
  tieuDe: 'Overview 4 — Which document do you open first?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Before designing tests you open the test basis of the level. For each task of the LabBook team, pick the document to open first (the “Test approach / basis” column of the sheet).</p>', vi: '<p>Trước khi thiết kế test, bạn mở test basis của cấp đó. Với mỗi việc của nhóm LabBook, chọn tài liệu cần mở trước (cột “Test approach / basis” của bảng).</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Task → document', 'Việc → tài liệu'),
    cot: [{ ma: 't', ten: 'Task' }, { ma: 'd', ten: 'Document', luaChon: ['Detailed design (class specification / Javadoc)', 'Architectural design and sequence diagrams', 'Software requirement specification (SRS)', 'Business processes and user requirements'] }],
    hang: [
      'Write Report 5.1 for reserveSeat (Lab 2)',
      'Write Report 5.2 for the booking flow between the controller, BookingService and the repository (Lab 3)',
      'Write Report 5.3 for the whole “Book a seat” function (Lab 4)',
      'Prepare the acceptance week with the lab department',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.d': 'Detailed design (class specification / Javadoc)', 'r1.d': 'Architectural design and sequence diagrams', 'r2.d': 'Software requirement specification (SRS)', 'r3.d': 'Business processes and user requirements' },
    giaiThich: giai('CT ↔ detailed design; CIT ↔ ADD and sequence diagrams; ST ↔ SRS; UAT ↔ business processes and user requirements.', 'CT ↔ thiết kế chi tiết; CIT ↔ ADD và sequence diagram; ST ↔ SRS; UAT ↔ quy trình nghiệp vụ và yêu cầu người dùng.'),
  }],
  goiY: ['Mỗi báo cáo ứng với một cấp; mỗi cấp có một test basis.', 'Lab 2 dùng bộ Javadoc “Detail Design”.'],
  loiHayGap: ['Mở SRS cho Report 5.1.', 'Mở mã nguồn làm test basis cho system test.'],
  giaiThich: '<p>Detailed design · ADD/sequence · SRS · business processes.</p>',
  thuatNgu: [{ en: 'sequence diagram', vi: 'sơ đồ tuần tự — thứ tự lời gọi giữa các thành phần' }],
  khaiNiem: ['test basis'],
});

export default doiDau({
  slug: 'swt301-levels-overview-matrix',
  ten: '2.6 The teacher’s overview: UAT · SIT · ST · CIT · CT',
  moTaModule: 'Dựng lại bảng Overview.xlsx (mục tiêu, đối tượng, cơ sở, kỹ thuật của 5 cấp), một yêu cầu kiểu PE qua bốn cấp, đọc bảng kiểu đề, chọn tài liệu cần mở cho Report 5.1/5.2/5.3.',
  khoa: KHOA,
  baiHoc: 'swt301-levels-overview-matrix',
  de: [E1, E2, E3, E4],
});
