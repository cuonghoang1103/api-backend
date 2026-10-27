/**
 * SWT301 · 4.1 — Categories of test techniques (SWT4 slide 1–14, LO-4.1.1 K2).
 */
import { doiDau, KHOA, hai, giai, lc, tn } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const HO = ['Black-box', 'White-box', 'Experience-based'];
const E1 = tinhDe({
  tieuDe: 'Techniques 1 — Which family does each technique belong to?',
  doKho: 'EASY', phut: 5,
  moTa: {
    en: '<p>ISTQB groups test techniques into three families: <b>black-box</b> (specification-based), <b>white-box</b> (structure-based) and <b>experience-based</b>. SWT301 teaches ten techniques. Put each one in its family.</p>',
    vi: '<p>ISTQB chia kỹ thuật test thành ba họ: <b>black-box</b> (dựa đặc tả), <b>white-box</b> (dựa cấu trúc) và <b>dựa kinh nghiệm</b>. SWT301 dạy mười kỹ thuật. Hãy xếp mỗi kỹ thuật vào họ của nó.</p>',
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Family of each technique', 'Họ của từng kỹ thuật'),
    cot: [{ ma: 't', ten: 'Technique' }, { ma: 'h', ten: 'Family', luaChon: HO }],
    hang: ['Equivalence partitioning', 'Boundary value analysis', 'Decision table testing', 'State transition testing', 'Use case testing', 'Statement testing', 'Decision testing', 'Error guessing', 'Exploratory testing', 'Checklist-based testing'].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: Object.fromEntries([0, 0, 0, 0, 0, 1, 1, 2, 2, 2].map((h, i) => [`r${i}.h`, HO[h]])),
    giaiThich: giai('The five black-box techniques derive tests from the specification; statement and decision testing derive them from the code structure; error guessing, exploratory and checklist-based testing rely on the tester’s knowledge and experience. Careful: “decision TABLE testing” is black-box, “decision testing” is white-box.', 'Năm kỹ thuật black-box rút test từ đặc tả; statement và decision testing rút từ cấu trúc mã; error guessing, exploratory và checklist-based dựa vào kiến thức và kinh nghiệm của tester. Cẩn thận: “decision TABLE testing” là black-box, “decision testing” là white-box.'),
  }],
  goiY: ['Hỏi: test được rút ra từ đâu — đặc tả, mã, hay đầu người tester?', '“Decision table” (bảng quyết định nghiệp vụ) ≠ “decision” (if/else trong mã).'],
  loiHayGap: ['Xếp decision table testing vào white-box vì có chữ “decision”.', 'Xếp checklist-based vào black-box vì checklist “giống đặc tả” — checklist đến từ kinh nghiệm.'],
  giaiThich: '<p>Black-box: EP, BVA, decision table, state transition, use case. White-box: statement, decision. Experience-based: error guessing, exploratory, checklist-based.</p>',
  thuatNgu: [{ en: 'black-box technique', vi: 'kỹ thuật hộp đen — dựa đặc tả, không nhìn mã' }, { en: 'white-box technique', vi: 'kỹ thuật hộp trắng — dựa cấu trúc bên trong (mã)' }, { en: 'experience-based technique', vi: 'kỹ thuật dựa kinh nghiệm' }],
  khaiNiem: ['test technique categories'],
});

const E2 = tinhDe({
  tieuDe: 'Techniques 2 — Characteristics of the three families (K2)',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: '<p>Six questions on LO-4.1.1: the <b>test basis</b>, what each family <b>finds</b>, how <b>coverage</b> is measured and at which <b>levels</b> it is used.</p>',
    vi: '<p>Sáu câu về LO-4.1.1: <b>test basis</b>, mỗi họ <b>tìm ra</b> gì, đo <b>độ phủ</b> thế nào và dùng ở <b>cấp test</b> nào.</p>',
  },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is the typical test basis of WHITE-box techniques?', 'Test basis điển hình của kỹ thuật WHITE-box là gì?'), luaChon: lc(['a', 'User stories and acceptance criteria'], ['b', 'Code, architecture, detailed design and internal structure'], ['c', 'The tester’s knowledge of past defects'], ['d', 'Use cases and business process models']), dapAn: ['b'],
      giaiThich: giai('White-box = structure-based: code, architecture, detailed design. (a) and (d) are black-box bases; (c) is experience-based.', 'White-box = dựa cấu trúc: mã, kiến trúc, thiết kế chi tiết. (a), (d) là cơ sở của black-box; (c) là dựa kinh nghiệm.') },
    { ma: 'q2', de: hai('How is coverage measured for black-box techniques?', 'Độ phủ của kỹ thuật black-box được đo thế nào?'), luaChon: lc(['a', 'By the percentage of statements executed'], ['b', 'By the items of the test basis that were tested, e.g. partitions, boundaries, rules, transitions'], ['c', 'It cannot be measured'], ['d', 'By the number of defects found per hour']), dapAn: ['b'],
      giaiThich: giai('Black-box coverage = tested items of the test basis ÷ identified items. Statement % is white-box; “cannot be measured formally” is experience-based.', 'Độ phủ black-box = phần tử của test basis đã test ÷ đã xác định. % câu lệnh là white-box; “không đo chính thức được” là dựa kinh nghiệm.') },
    { ma: 'q3', de: hai('Which statement about EXPERIENCE-based techniques is correct?', 'Phát biểu nào về kỹ thuật DỰA KINH NGHIỆM là đúng?'), luaChon: lc(['a', 'They replace the need for black-box techniques'], ['b', 'They are useful when the specification is poor or outdated, and they can find defects other techniques miss'], ['c', 'Their coverage is measured as decision coverage'], ['d', 'They can only be used at acceptance level']), dapAn: ['b'],
      giaiThich: giai('Experience-based testing complements the systematic techniques; it works with little documentation; its coverage is hard to measure and its effectiveness depends on the tester.', 'Test dựa kinh nghiệm bổ trợ cho các kỹ thuật có hệ thống; dùng được khi ít tài liệu; độ phủ khó đo và hiệu quả phụ thuộc người test.') },
    { ma: 'q4', de: hai('Black-box techniques are especially good at finding…', 'Kỹ thuật black-box đặc biệt giỏi tìm…'), luaChon: lc(['a', 'code that is never executed'], ['b', 'gaps and deviations between the requirements and their implementation'], ['c', 'memory leaks'], ['d', 'violations of the coding standard']), dapAn: ['b'],
      giaiThich: giai('They check behaviour against the specification. Unexecuted code is found by white-box coverage; memory leaks and coding-standard violations by dynamic/static analysis.', 'Chúng kiểm hành vi so với đặc tả. Mã không bao giờ chạy do white-box phát hiện; rò bộ nhớ và vi phạm chuẩn mã do phân tích động/tĩnh.') },
    { ma: 'q5', de: hai('Which of these is NOT a factor the syllabus lists for choosing test techniques?', 'Yếu tố nào KHÔNG nằm trong danh sách yếu tố chọn kỹ thuật test của syllabus?'), luaChon: lc(['a', 'Risk levels and types of risk'], ['b', 'Available documentation'], ['c', 'Tester knowledge and skills'], ['d', 'The number of developers who wrote the code']), dapAn: ['d'],
      giaiThich: giai('Factors include: type and complexity of the component, regulatory standards, customer/contract requirements, risk levels and types, test objectives, available documentation, tester knowledge, tools, time and budget, SDLC model, expected use, past experience with defect types.', 'Các yếu tố: loại và độ phức tạp của thành phần, chuẩn quy định, yêu cầu khách hàng/hợp đồng, mức và loại rủi ro, mục tiêu test, tài liệu sẵn có, kiến thức tester, công cụ, thời gian và ngân sách, mô hình SDLC, cách dùng dự kiến, kinh nghiệm về loại lỗi.') },
    { ma: 'q6', de: hai('At which test levels can white-box techniques be applied?', 'Kỹ thuật white-box áp dụng được ở cấp test nào?'), luaChon: lc(['a', 'Only component testing'], ['b', 'All levels — most often component and integration testing'], ['c', 'Only system testing'], ['d', 'Only when no specification exists']), dapAn: ['b'],
      giaiThich: giai('Structure can be code (component), call graphs (integration), menu structures or business process models (system/acceptance). Statement/decision coverage is most common at component level.', 'Cấu trúc có thể là mã (component), đồ thị gọi (integration), cấu trúc menu hay mô hình quy trình (system/acceptance). Độ phủ lệnh/quyết định hay gặp nhất ở component.') },
  ],
  goiY: ['Black-box ↔ đặc tả; white-box ↔ cấu trúc; experience ↔ người.', 'Độ phủ: black-box đếm phần tử test basis; white-box đếm phần tử cấu trúc; experience-based không đo chính thức.'],
  loiHayGap: ['Cho rằng white-box chỉ dùng ở unit test — syllabus nói mọi cấp.', 'Cho rằng kỹ thuật dựa kinh nghiệm thay được kỹ thuật hệ thống.'],
  giaiThich: '<p>Answers: b · b · b · b · d · b.</p>',
  thuatNgu: [...tn('testBasis'), { en: 'coverage', vi: 'độ phủ — mức (%) phần tử đã được test' }],
  khaiNiem: ['test technique categories', 'test basis', 'coverage'],
});

const KT = ['Equivalence partitioning', 'Boundary value analysis', 'Decision table testing', 'State transition testing', 'Use case testing', 'Statement testing', 'Decision testing', 'Error guessing', 'Exploratory testing', 'Checklist-based testing'];
const E3 = tinhDe({
  tieuDe: 'Techniques 3 — Pick the technique for each situation',
  doKho: 'MEDIUM', phut: 10,
  moTa: {
    en: '<p>For every situation choose the ONE technique that fits best. The words of the situation point to it: ranges → BVA, groups → EP, combinations → decision table, history/state → state transition, end-to-end actor flow → use case, “every line / every branch” → white-box, “likely mistakes / charter / list” → experience-based.</p>',
    vi: '<p>Với mỗi tình huống chọn MỘT kỹ thuật phù hợp nhất. Từ khoá trong tình huống chỉ ra nó: khoảng → BVA, nhóm → EP, tổ hợp → bảng quyết định, lịch sử/trạng thái → chuyển trạng thái, luồng đầu-cuối của tác nhân → use case, “mọi dòng / mọi nhánh” → white-box, “lỗi hay gặp / charter / danh sách” → dựa kinh nghiệm.</p>',
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Best technique for each situation', 'Kỹ thuật phù hợp nhất cho mỗi tình huống'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'k', ten: 'Technique', luaChon: KT }],
    hang: [
      'An age field accepts 18–65: test 17, 18, 65 and 66',
      'A 200-country dropdown is processed in 3 tax regions: one country per region',
      'An insurance premium depends on combinations of age band, smoker status and previous claims',
      'A login locks after 3 failed attempts and unlocks after 30 minutes',
      '“Customer withdraws cash” tested from start to end, with the main flow and every alternative',
      'Make sure every line of the new validateTax() method runs at least once',
      'Make sure every if/else outcome of calculateTax() has been executed',
      'A tester with years in banking lists likely mistakes: rounding, leap years, negative amounts',
      'A 60-minute session with the charter “explore booking cancellation”',
      'Every new screen is checked against the team’s list of common UI defects',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': KT[1], 'r1.k': KT[0], 'r2.k': KT[2], 'r3.k': KT[3], 'r4.k': KT[4], 'r5.k': KT[5], 'r6.k': KT[6], 'r7.k': KT[7], 'r8.k': KT[8], 'r9.k': KT[9] },
    giaiThich: giai('Each situation uses the vocabulary of its technique (the slide 4.6 table “The specification talks about… → Use”).', 'Mỗi tình huống dùng đúng từ khoá của kỹ thuật (bảng “Đặc tả nói về… → Dùng” ở bài 4.6).'),
  }],
  goiY: ['Có ranh giới số cụ thể (17/18, 65/66) ⇒ BVA; chỉ cần một đại diện mỗi nhóm ⇒ EP.', '“Mọi dòng” = statement; “mọi kết quả if/else” = decision.'],
  loiHayGap: ['Chọn EP cho 17/18/65/66 — đó là giá trị biên.', 'Chọn use case cho khoá đăng nhập sau 3 lần sai — hành vi phụ thuộc lịch sử ⇒ state transition.'],
  giaiThich: '<p>BVA · EP · decision table · state transition · use case · statement · decision · error guessing · exploratory · checklist-based.</p>',
  thuatNgu: tn('ep', 'bva', 'decisionTable', 'stateTransition', 'statement', 'decision'),
  khaiNiem: ['choosing test techniques'],
});

const E4 = tinhDe({
  tieuDe: 'Techniques 4 — Compare the families (harder, multi-answer)',
  doKho: 'HARD', phut: 10,
  moTa: {
    en: '<p>Harder K2 questions. Some have <b>more than one</b> correct option — select all of them.</p>',
    vi: '<p>Các câu K2 khó hơn. Có câu <b>nhiều</b> đáp án đúng — chọn đủ tất cả.</p>',
  },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', nhieu: true, de: hai('Which TWO are common characteristics of black-box techniques?', 'HAI đặc điểm chung nào của kỹ thuật black-box?'),
      luaChon: lc(['a', 'Test conditions, test cases and test data are derived from a test basis such as requirements or use cases'], ['b', 'Test cases can detect gaps between the requirements and their implementation'], ['c', 'Coverage is measured on the code structure'], ['d', 'The tester must read the source code']), dapAn: [['a', 'b']],
      giaiThich: giai('(a) and (b) are the syllabus wording for black-box. (c) and (d) describe white-box.', '(a) và (b) là đúng câu chữ syllabus cho black-box. (c), (d) mô tả white-box.') },
    { ma: 'q2', nhieu: true, de: hai('Which TWO are characteristics of white-box techniques?', 'HAI đặc điểm nào của kỹ thuật white-box?'),
      luaChon: lc(['a', 'Tests are derived from code, architecture, detailed design or other structural information'], ['b', 'Coverage is measured on the items tested within a selected structure (e.g. statements, decisions)'], ['c', 'They work best when no documentation exists at all'], ['d', 'They are used only by business analysts']), dapAn: [['a', 'b']],
      giaiThich: giai('White-box: structure-based basis and structural coverage. Working without documentation is a strength of experience-based testing.', 'White-box: cơ sở là cấu trúc và độ phủ cấu trúc. Làm việc không cần tài liệu là thế mạnh của test dựa kinh nghiệm.') },
    { ma: 'q3', de: hai('A team has no written requirements, a tight deadline and an experienced tester. Which family will they most likely rely on?', 'Nhóm không có yêu cầu viết, hạn gấp và một tester giàu kinh nghiệm. Họ có khả năng dựa vào họ kỹ thuật nào nhất?'),
      luaChon: lc(['a', 'White-box, because coverage is objective'], ['b', 'Experience-based, because it needs little documentation and uses the tester’s knowledge'], ['c', 'Decision table testing, because it is systematic'], ['d', 'None — testing cannot start without requirements']), dapAn: ['b'],
      giaiThich: giai('Low documentation + time pressure + experienced tester are exactly the conditions under which experience-based techniques are recommended (combined with the others when possible).', 'Ít tài liệu + áp lực thời gian + tester giàu kinh nghiệm chính là điều kiện khuyên dùng kỹ thuật dựa kinh nghiệm (kết hợp kỹ thuật khác nếu có thể).') },
    { ma: 'q4', de: hai('Why are test techniques combined rather than used alone?', 'Vì sao kỹ thuật test thường được kết hợp chứ không dùng riêng lẻ?'),
      luaChon: lc(['a', 'Because each technique is designed to find particular kinds of defects, so one technique alone leaves others undetected'], ['b', 'Because standards forbid using a single technique'], ['c', 'Because combining techniques always reduces the number of test cases'], ['d', 'Because experience-based techniques need white-box results as input']), dapAn: ['a'],
      giaiThich: giai('The syllabus: “some techniques are more applicable to certain situations and test levels; others are applicable to all test levels” — using several gives the best results.', 'Syllabus: “một số kỹ thuật hợp với tình huống và cấp test nhất định; số khác dùng được ở mọi cấp” — dùng nhiều kỹ thuật cho kết quả tốt nhất.') },
    { ma: 'q5', de: hai('Which pair is correctly matched (technique → coverage item)?', 'Cặp nào ghép đúng (kỹ thuật → phần tử độ phủ)?'),
      luaChon: lc(['a', 'Decision table testing → decisions in the code'], ['b', 'State transition testing → transitions'], ['c', 'Statement testing → partitions'], ['d', 'Error guessing → statements']), dapAn: ['b'],
      giaiThich: giai('Decision table → rules (columns); statement testing → executable statements; error guessing has no formal coverage item.', 'Bảng quyết định → rule (cột); statement testing → câu lệnh thực thi được; error guessing không có phần tử độ phủ chính thức.') },
  ],
  goiY: ['Câu nhiều đáp án: kiểm từng phương án độc lập với câu chữ syllabus.', 'Ghép kỹ thuật ↔ phần tử độ phủ: partition, boundary, rule, transition, statement, decision.'],
  loiHayGap: ['Chọn “không thể bắt đầu test khi chưa có yêu cầu” — tĩnh và dựa kinh nghiệm vẫn làm được.', 'Nhầm “decision table” với “decision coverage”.'],
  giaiThich: '<p>Answers: a+b · a+b · b · a · b.</p>',
  thuatNgu: [{ en: 'coverage item', vi: 'phần tử độ phủ — thứ được đếm khi tính độ phủ' }],
  khaiNiem: ['test technique categories'],
});

export default doiDau({
  slug: 'swt301-test-technique-categories',
  ten: '4.1 Categories of test techniques',
  moTaModule: 'Ba họ kỹ thuật test (black-box · white-box · dựa kinh nghiệm): test basis, độ phủ, cấp test; chọn kỹ thuật theo tình huống — 4 đề trắc nghiệm/điền bảng có giải thích từng phương án.',
  khoa: KHOA,
  baiHoc: 'swt301-test-technique-categories',
  de: [E1, E2, E3, E4],
});
