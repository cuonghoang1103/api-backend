/**
 * SWT301 · 1.1 — What is testing? Definition, objectives, testing vs debugging (SWT1 slide 1–31, LO-1.1.1 K1, LO-1.1.2 K2).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const E1 = tinhDe({
  tieuDe: 'What is testing 1 — Definition and objectives (K1)',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>ISTQB: testing is a <b>process</b> of all lifecycle activities, both static and dynamic, concerned with planning, preparation and evaluation of a component or system and related work products, to determine that they satisfy specified requirements, to demonstrate that they are fit for purpose and to detect defects. Six questions on the definition and the typical objectives.</p>', vi: '<p>ISTQB: kiểm thử là một <b>quy trình</b> gồm mọi hoạt động trong vòng đời, cả tĩnh lẫn động, liên quan tới lập kế hoạch, chuẩn bị và đánh giá một thành phần/hệ thống cùng sản phẩm liên quan, để xác định chúng thoả yêu cầu, chứng minh phù hợp mục đích và tìm defect. Sáu câu về định nghĩa và các mục tiêu điển hình.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which statement matches the ISTQB view of testing?', 'Phát biểu nào khớp quan điểm ISTQB về kiểm thử?'), luaChon: lc(['a', 'Testing is only executing the software'], ['b', 'Testing includes static activities such as reviews, and dynamic activities that execute the software'], ['c', 'Testing starts after coding is complete'], ['d', 'Testing proves the software has no defects']), dapAn: ['b'], giaiThich: giai('Testing is a process across the lifecycle, static and dynamic; it cannot prove absence of defects.', 'Kiểm thử là quy trình xuyên vòng đời, gồm tĩnh và động; không chứng minh được không còn lỗi.') },
    { ma: 'q2', de: hai('Which is a typical objective of testing?', 'Đâu là mục tiêu điển hình của kiểm thử?'), luaChon: lc(['a', 'To deliver the project faster'], ['b', 'To provide sufficient information to stakeholders to allow them to make informed decisions'], ['c', 'To decide the developers’ bonuses'], ['d', 'To write the requirements']), dapAn: ['b'], giaiThich: giai('Informing stakeholders is one of the listed objectives (slide 20). Shortening the project is not.', 'Cung cấp thông tin cho bên liên quan là một mục tiêu (slide 20). Rút ngắn dự án thì không.') },
    { ma: 'q3', de: hai('Which is NOT a typical objective of testing?', 'Đâu KHÔNG phải mục tiêu điển hình của kiểm thử?'), luaChon: lc(['a', 'To evaluate work products such as requirements, user stories, design and code'], ['b', 'To reduce the level of risk of inadequate software quality'], ['c', 'To prevent defects'], ['d', 'To guarantee that the project finishes on time']), dapAn: ['d'], giaiThich: giai('Evaluating work products, reducing risk and preventing defects are objectives; schedule guarantees are not.', 'Đánh giá sản phẩm, giảm rủi ro và ngăn ngừa lỗi là mục tiêu; bảo đảm tiến độ thì không.') },
    { ma: 'q4', de: hai('Verification vs validation: which pair is correct?', 'Verification và validation: cặp nào đúng?'), luaChon: lc(['a', 'Verification: are we building the right product? Validation: are we building the product right?'], ['b', 'Verification: does it meet the specified requirements? Validation: does it meet the users’ needs in its operational environment?'], ['c', 'Both mean executing tests'], ['d', 'Validation is only done by developers']), dapAn: ['b'], giaiThich: giai('Verification checks against the specification (building it right); validation checks fitness for the users (building the right thing).', 'Verification so với đặc tả (làm đúng cách); validation kiểm sự phù hợp với người dùng (làm đúng thứ cần).') },
    { ma: 'q5', de: hai('The objectives of testing…', 'Mục tiêu của kiểm thử…'), luaChon: lc(['a', 'are the same for every project'], ['b', 'vary with the context — the component or system, the test level and the lifecycle model'], ['c', 'are always to find as many defects as possible'], ['d', 'are set by the developers']), dapAn: ['b'], giaiThich: giai('E.g. component testing aims at finding defects and building code coverage; acceptance testing aims at confidence and fitness for use.', 'Vd component test nhắm tìm lỗi và độ phủ mã; acceptance test nhắm tạo niềm tin và phù hợp sử dụng.') },
    { ma: 'q6', de: hai('A tester finds two contradictory requirements while reading the SRS. Which objective does this mainly serve?', 'Tester thấy hai yêu cầu mâu thuẫn khi đọc SRS. Việc này chủ yếu phục vụ mục tiêu nào?'), luaChon: lc(['a', 'Comply with legal requirements'], ['b', 'Prevent defects (by evaluating work products early)'], ['c', 'Measure performance'], ['d', 'Train users']), dapAn: ['b'], giaiThich: giai('Finding the contradiction before design and code prevents the defects it would cause.', 'Tìm mâu thuẫn trước khi thiết kế và viết mã ngăn các lỗi mà nó sẽ gây ra.') },
  ],
  goiY: ['Kiểm thử = quy trình, gồm cả tĩnh và động.', 'Mục tiêu thay đổi theo ngữ cảnh, cấp test, mô hình vòng đời.'],
  loiHayGap: ['Cho rằng kiểm thử chứng minh phần mềm không có lỗi.', 'Đảo nghĩa verification/validation.'],
  giaiThich: '<p>Answers: b · b · d · b · b · b.</p>',
  thuatNgu: [{ en: 'verification', vi: 'kiểm chứng — đúng với đặc tả' }, { en: 'validation', vi: 'thẩm định — đúng nhu cầu người dùng' }, { en: 'stakeholder', vi: 'bên liên quan' }],
  khaiNiem: ['testing definition', 'test objectives'],
});

const KHO = ['Static · verification', 'Static · validation', 'Dynamic · verification', 'Dynamic · validation'];
const E2 = tinhDe({
  tieuDe: 'What is testing 2 — Static or dynamic? Verification or validation?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Classify each LabBook activity on two axes: does it execute the software (dynamic) or not (static)? Does it check against the specification (verification) or against the users’ real needs (validation)?</p>', vi: '<p>Phân loại từng hoạt động LabBook theo hai trục: có chạy phần mềm (dynamic) hay không (static)? Kiểm theo đặc tả (verification) hay theo nhu cầu thật của người dùng (validation)?</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Kind of each activity', 'Loại của từng hoạt động'),
    cot: [{ ma: 'a', ten: 'Activity' }, { ma: 'k', ten: 'Kind', luaChon: KHO }],
    hang: [
      'A tester reads the SRS and finds two requirements that contradict each other',
      'A JUnit test checks that reserveSeat rejects 7 hours, as the design says',
      'Students try the beta and say booking a seat takes too many clicks',
      'The product owner walks through the screen mock-ups with real students to see if they match how they book labs',
      'Postman checks that DELETE returns 409 TOO_LATE as the API contract says',
      'A UX expert reads the user stories and asks whether a waitlist is what students actually want',
    ].map((a, i) => ({ ma: `r${i}`, o: { a } })),
    dapAn: { 'r0.k': KHO[0], 'r1.k': KHO[2], 'r2.k': KHO[3], 'r3.k': KHO[1], 'r4.k': KHO[2], 'r5.k': KHO[1] },
    giaiThich: giai('Reading/reviewing = static; running = dynamic. Against a document (SRS, design, API contract) = verification; against what users need = validation.', 'Đọc/review = tĩnh; chạy = động. So với tài liệu (SRS, thiết kế, hợp đồng API) = verification; so với điều người dùng cần = validation.'),
  }],
  goiY: ['Trục 1: có chạy phần mềm không?', 'Trục 2: so với tài liệu hay với nhu cầu người dùng thật?'],
  loiHayGap: ['Cho rằng mọi việc đọc tài liệu đều là verification — hỏi “sinh viên có thật sự cần…?” là validation.', 'Coi phản hồi beta là verification.'],
  giaiThich: '<p>Static·verification · Dynamic·verification · Dynamic·validation · Static·validation · Dynamic·verification · Static·validation.</p>',
  thuatNgu: [{ en: 'beta testing', vi: 'người dùng thật dùng thử bản beta' }],
  khaiNiem: ['static vs dynamic', 'verification vs validation'],
});

const AI = ['Testing (tester)', 'Debugging (developer)'];
const E3 = tinhDe({
  tieuDe: 'What is testing 3 — Testing or debugging?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Testing shows failures caused by defects; debugging is the development activity that finds, analyses and removes the cause. Confirmation testing then checks the fix. Classify each step of one LabBook bug’s life.</p>', vi: '<p>Kiểm thử làm lộ failure do defect gây ra; debugging là hoạt động phát triển tìm, phân tích và loại bỏ nguyên nhân. Sau đó confirmation testing kiểm lại bản sửa. Phân loại từng bước trong đời một lỗi của LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Testing or debugging?', 'Kiểm thử hay gỡ lỗi?'),
    cot: [{ ma: 's', ten: 'Step' }, { ma: 'k', ten: 'Activity', luaChon: AI }],
    hang: [
      'Run the system test: a booking of exactly 6 weekly hours is refused',
      'Set a breakpoint in BookingService and step through the weekly-limit check',
      'Change >= to > on line 17 and commit',
      'Re-run the failed system test on the new build (confirmation testing)',
      'Re-run the whole booking regression suite to check nothing else broke',
      'Find in the logs which method computed the weekly total',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': AI[0], 'r1.k': AI[1], 'r2.k': AI[1], 'r3.k': AI[0], 'r4.k': AI[0], 'r5.k': AI[1] },
    giaiThich: giai('Running tests that show failures, re-testing and regression testing are testing; locating, analysing and fixing the cause are debugging.', 'Chạy test làm lộ failure, test lại và hồi quy là kiểm thử; định vị, phân tích, sửa nguyên nhân là gỡ lỗi.'),
  }],
  goiY: ['Có sửa/định vị mã không? ⇒ debugging.', 'Chạy test để quan sát kết quả ⇒ testing (kể cả test lại sau khi sửa).'],
  loiHayGap: ['Xếp confirmation testing vào debugging vì "liên quan đến lỗi".', 'Cho rằng tester phải tự sửa lỗi.'],
  giaiThich: '<p>Testing · Debugging · Debugging · Testing · Testing · Debugging.</p>',
  thuatNgu: [{ en: 'debugging', vi: 'gỡ lỗi — tìm, phân tích, sửa nguyên nhân' }, { en: 'confirmation testing', vi: 'kiểm thử xác nhận — chạy lại test đã fail sau khi sửa' }],
  khaiNiem: ['testing vs debugging'],
});

const E4 = tinhDe({
  tieuDe: 'What is testing 4 — Objectives in context (exam style)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Five questions in the style of SWT1 slides 21–25: which objective fits which test level or situation.</p>', vi: '<p>Năm câu theo kiểu slide SWT1 21–25: mục tiêu nào hợp với cấp test hay tình huống nào.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('What is typically the main objective of component testing?', 'Mục tiêu chính điển hình của component testing là gì?'), luaChon: lc(['a', 'To confirm that the system meets legal requirements'], ['b', 'To find as many failures as possible so that defects are identified and fixed early'], ['c', 'To demonstrate the system to the customer'], ['d', 'To measure user satisfaction']), dapAn: ['b'], giaiThich: giai('Component testing aims at finding defects early (and building code coverage); compliance and confidence are acceptance-level objectives.', 'Component test nhắm tìm lỗi sớm (và độ phủ mã); tuân thủ và niềm tin là mục tiêu cấp acceptance.') },
    { ma: 'q2', de: hai('What is typically the main objective of acceptance testing?', 'Mục tiêu chính điển hình của acceptance testing là gì?'), luaChon: lc(['a', 'To find as many defects as possible in the code'], ['b', 'To confirm that the system works as expected and build confidence that it is fit for use'], ['c', 'To measure statement coverage'], ['d', 'To debug the code']), dapAn: ['b'], giaiThich: giai('Acceptance testing focuses on validation and confidence rather than defect hunting.', 'Acceptance test tập trung vào thẩm định và niềm tin hơn là săn lỗi.') },
    { ma: 'q3', de: hai('During maintenance testing after a small change, which objective is most important?', 'Khi kiểm thử bảo trì sau một thay đổi nhỏ, mục tiêu nào quan trọng nhất?'), luaChon: lc(['a', 'Finding new requirements'], ['b', 'Checking that no new defects were introduced (regression)'], ['c', 'Training the users'], ['d', 'Writing the user guide']), dapAn: ['b'], giaiThich: giai('Regression and confirmation of the change dominate maintenance testing.', 'Hồi quy và xác nhận thay đổi là chủ đạo của kiểm thử bảo trì.') },
    { ma: 'q4', de: hai('A bank must show auditors that every transfer rule was tested. Which objective is this?', 'Ngân hàng phải cho kiểm toán thấy mọi luật chuyển tiền đã được test. Đây là mục tiêu nào?'), luaChon: lc(['a', 'To comply with contractual, legal or regulatory requirements or standards'], ['b', 'To prevent defects'], ['c', 'To reduce costs'], ['d', 'To find failures']), dapAn: ['a'], giaiThich: giai('Compliance with laws/standards and verifying compliance is an explicit objective.', 'Tuân thủ luật/chuẩn và kiểm chứng sự tuân thủ là một mục tiêu rõ ràng.') },
    { ma: 'q5', de: hai('Why can testing NOT show that software is defect-free?', 'Vì sao kiểm thử KHÔNG chứng minh được phần mềm hết lỗi?'), luaChon: lc(['a', 'Because testers are not careful enough'], ['b', 'Because testing can show the presence of defects but cannot prove their absence; exhaustive testing is impossible'], ['c', 'Because tools are not good enough'], ['d', 'It can, with enough tests']), dapAn: ['b'], giaiThich: giai('Principles 1 and 2 (lesson 1.3).', 'Nguyên tắc 1 và 2 (bài 1.3).') },
  ],
  goiY: ['Cấp thấp ⇒ tìm lỗi; cấp cao ⇒ niềm tin, phù hợp sử dụng, tuân thủ.', 'Bảo trì ⇒ hồi quy.'],
  loiHayGap: ['Cho rằng acceptance test nhắm tìm thật nhiều lỗi.', 'Chọn "giảm chi phí" cho câu kiểm toán.'],
  giaiThich: '<p>Answers: b · b · b · a · b.</p>',
  thuatNgu: [{ en: 'regression', vi: 'hồi quy — lỗi mới do thay đổi gây ra ở phần cũ' }],
  khaiNiem: ['test objectives'],
});

export default doiDau({
  slug: 'swt301-fundamentals-principles',
  ten: '1.1 What is testing? Objectives, testing vs debugging',
  moTaModule: 'Định nghĩa kiểm thử theo ISTQB, mục tiêu điển hình và theo ngữ cảnh, tĩnh/động × verification/validation trên tình huống LabBook, phân biệt testing với debugging.',
  khoa: KHOA,
  baiHoc: 'swt301-fundamentals-principles',
  de: [E1, E2, E3, E4],
});
