/**
 * SWT301 · 6.2 — Choosing test techniques: formality and the factors that decide (SWT4 slide 109–112, LO-4.1.1).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const YT = ['Type of component/system', 'Complexity', 'Regulatory standards', 'Customer or contractual requirements', 'Risk levels and types', 'Test objectives', 'Available documentation', 'Tester knowledge and skills', 'Available tools', 'Time and budget', 'SDLC model', 'Expected use of the software', 'Expected types of defects'];
const E1 = tinhDe({
  tieuDe: 'Choosing techniques 1 — Which factor is at work?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Slides 111–112 list the factors that decide which technique fits. Each statement below shows one factor at work. Name it.</p>', vi: '<p>Slide 111–112 liệt kê các yếu tố quyết định kỹ thuật nào phù hợp. Mỗi phát biểu dưới đây cho thấy một yếu tố đang tác động. Gọi tên nó.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Statement → factor', 'Phát biểu → yếu tố'),
    cot: [{ ma: 's', ten: 'Statement' }, { ma: 'f', ten: 'Factor', luaChon: YT }],
    hang: [
      'The SRS of the refund rules already contains a decision table, so the team uses decision-table testing',
      'The flight-control software must be tested with EP, BVA and state transition testing because the aviation standard says so',
      'The fee calculator has many money calculations, so BVA is applied to every amount',
      'The release is in three days; the team plans two exploratory sessions instead of full test design',
      'The team wants confidence that students can complete their typical daily tasks, so it uses use case testing',
      'Past releases showed many off-by-one defects, so BVA is emphasised',
      'The new tester has never used state transition testing, so the senior tester pairs with her',
      'The contract with the university requires 100% decision coverage of the payment module',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.f': YT[6], 'r1.f': YT[2], 'r2.f': YT[0], 'r3.f': YT[9], 'r4.f': YT[5], 'r5.f': YT[12], 'r6.f': YT[7], 'r7.f': YT[3] },
    giaiThich: giai('Each row restates one factor of slides 111–112 (the teacher’s notes give the same examples: financial → BVA; aircraft → EP, BVA, state transition; typical tasks → use cases; existing decision tables/state graphs → their techniques).', 'Mỗi dòng nhắc lại một yếu tố của slide 111–112 (ghi chú của thầy/cô có đúng các ví dụ: tài chính → BVA; hàng không → EP, BVA, state transition; tác vụ điển hình → use case; đặc tả có sẵn decision table/đồ thị trạng thái → kỹ thuật tương ứng).'),
  }],
  goiY: ['Có chữ “chuẩn/luật bắt buộc” ⇒ regulatory; “hợp đồng” ⇒ contractual.', '“Lỗi hay gặp ở bản trước” ⇒ expected types of defects.'],
  loiHayGap: ['Gán dòng hợp đồng cho regulatory.', 'Gán dòng “ứng dụng nhiều phép tính tiền” cho complexity — slide gọi đó là loại hệ thống (financial).'],
  giaiThich: '<p>Documentation · Regulatory · Type of system · Time and budget · Test objectives · Expected defects · Tester knowledge · Contractual.</p>',
  thuatNgu: [{ en: 'factor', vi: 'yếu tố' }, { en: 'high-integrity system', vi: 'hệ thống đòi độ toàn vẹn cao' }],
  khaiNiem: ['choosing test techniques'],
});

const KTH = ['Equivalence partitioning', 'Boundary value analysis', 'Decision table testing', 'State transition testing', 'Use case testing', 'Decision coverage', 'Exploratory testing', 'Checklist-based testing'];
const E2 = tinhDe({
  tieuDe: 'Choosing techniques 2 — Pick the best technique for each LabBook feature',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Using the “typical consequence” column of the lesson (financial → BVA, combinations of rules → decision table, life cycle → state transition, typical tasks → use cases, no spec + time pressure → exploratory…), pick the technique that fits each situation best.</p>', vi: '<p>Dùng cột “hệ quả điển hình” của bài (tài chính → BVA, tổ hợp luật → decision table, vòng đời → state transition, tác vụ điển hình → use case, không có đặc tả + gấp → exploratory…), chọn kỹ thuật hợp nhất cho từng tình huống.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Situation → technique', 'Tình huống → kỹ thuật'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 't', ten: 'Technique', luaChon: KTH }],
    hang: [
      'The refund depends on three conditions together: hours before the start, booking status and whether the student is a teaching assistant',
      'A booking moves NONE → PENDING → CONFIRMED → CANCELLED and some events are not allowed in some states',
      'The weekly limit is “at most 6 hours”, an integer range with a clear edge',
      'The “lab type” field accepts one of five codes; each code is handled the same way',
      'A new lab-map screen arrived without any specification two days before the demo',
      'The team must show the department that the main scenarios “book, cancel, get promoted” work end to end',
      'The payment module must reach a measurable structural coverage before release',
      'Every new screen is checked against the team’s accessibility and UI conventions',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.t': KTH[2], 'r1.t': KTH[3], 'r2.t': KTH[1], 'r3.t': KTH[0], 'r4.t': KTH[6], 'r5.t': KTH[4], 'r6.t': KTH[5], 'r7.t': KTH[7] },
    giaiThich: giai('Combinations of conditions → decision table; states and events → state transition; ranges with edges → BVA; groups processed alike → EP; no spec + time pressure → exploratory; end-to-end scenarios → use case; structural coverage → decision coverage; recurring conventions → checklist.', 'Tổ hợp điều kiện → decision table; trạng thái và sự kiện → state transition; khoảng có biên → BVA; nhóm xử lý như nhau → EP; không đặc tả + gấp → exploratory; kịch bản đầu-cuối → use case; độ phủ cấu trúc → decision coverage; quy ước lặp lại → checklist.'),
  }],
  goiY: ['Có “cùng lúc nhiều điều kiện” ⇒ decision table.', '“Có biên rõ” ⇒ BVA; “xử lý như nhau” ⇒ EP.'],
  loiHayGap: ['Chọn EP cho giới hạn 6 giờ — có biên rõ thì BVA hiệu quả hơn.', 'Chọn use case cho vòng đời booking — trạng thái và sự kiện là state transition.'],
  giaiThich: '<p>DT · ST · BVA · EP · Exploratory · Use case · Decision coverage · Checklist.</p>',
  thuatNgu: [{ en: 'accessibility', vi: 'khả năng tiếp cận (người khuyết tật dùng được)' }],
  khaiNiem: ['choosing test techniques'],
});

const HT = ['More formal', 'Less formal'];
const E3 = tinhDe({
  tieuDe: 'Choosing techniques 3 — How formally? (slide 110)',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Which technique and how formally are two separate decisions. Slide 110 names four factors for formality: safety or regulatory industry, organisational maturity, lifecycle model, testers’ knowledge and skills. Decide whether each team should apply its techniques more or less formally.</p>', vi: '<p>Chọn kỹ thuật nào và áp dụng hình thức đến đâu là hai quyết định riêng. Slide 110 nêu bốn yếu tố của mức hình thức: ngành an toàn/có quy định, độ trưởng thành của tổ chức, mô hình vòng đời, kiến thức kỹ năng của tester. Quyết định mỗi nhóm nên áp dụng hình thức hơn hay ít hơn.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Team → formality', 'Nhóm → mức hình thức'),
    cot: [{ ma: 't', ten: 'Team' }, { ma: 'f', ten: 'Formality', luaChon: HT }],
    hang: [
      'A railway-signalling supplier audited against a safety standard',
      'A two-person student start-up building LabBook in one-week sprints',
      'A CMMI level-5 outsourcing company with a V-model contract',
      'A senior exploratory tester working alone on a prototype',
      'A team of first-year interns who have never designed tests',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.f': HT[0], 'r1.f': HT[1], 'r2.f': HT[0], 'r3.f': HT[1], 'r4.f': HT[0] },
    giaiThich: giai('Safety/regulation, maturity and sequential models push towards formal; short iterations and expert testers allow informal work; beginners need the structure of formal techniques.', 'An toàn/quy định, độ trưởng thành và mô hình tuần tự đẩy về phía hình thức; vòng lặp ngắn và tester giỏi cho phép phi hình thức; người mới cần khung của kỹ thuật hình thức.'),
  }],
  goiY: ['Người mới cần khung ⇒ hình thức hơn.', 'Chuyên gia + nguyên mẫu ⇒ phi hình thức vẫn hiệu quả.'],
  loiHayGap: ['Cho rằng người mới nên làm phi hình thức “cho nhanh”.', 'Cho rằng start-up Agile cần tài liệu như CMMI 5.'],
  giaiThich: '<p>More · Less · More · Less · More.</p>',
  thuatNgu: [{ en: 'CMMI', vi: 'mô hình đánh giá độ trưởng thành quy trình' }, { en: 'formality', vi: 'mức hình thức — tài liệu, truy vết' }],
  khaiNiem: ['formality of testing'],
});

const E4 = tinhDe({
  tieuDe: 'Choosing techniques 4 — Exam questions, internal and external factors',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Five FE-style questions, including the older CTFL 2011 grouping of the factors into internal (what the test team knows and has) and external (what the project, the customer and the law impose) — hidden slides 114–115.</p>', vi: '<p>Năm câu kiểu FE, gồm cả cách chia cũ của CTFL 2011 thành yếu tố bên trong (đội test biết và có gì) và bên ngoài (dự án, khách hàng, luật áp đặt gì) — slide ẩn 114–115.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is an EXTERNAL factor in the CTFL 2011 grouping?', 'Đâu là yếu tố BÊN NGOÀI theo cách chia CTFL 2011?'), luaChon: lc(['a', 'Tester knowledge and experience'], ['b', 'Regulatory requirements'], ['c', 'Models used'], ['d', 'Likely defects']), dapAn: ['b'], giaiThich: giai('External: risk, customer/contractual requirements, type of system, regulatory requirements, time and budget.', 'Bên ngoài: rủi ro, yêu cầu khách hàng/hợp đồng, loại hệ thống, yêu cầu quy định, thời gian và ngân sách.') },
    { ma: 'q2', de: hai('Which is an INTERNAL factor?', 'Đâu là yếu tố BÊN TRONG?'), luaChon: lc(['a', 'Time and budget'], ['b', 'Type of system'], ['c', 'Test objective'], ['d', 'Risk']), dapAn: ['c'], giaiThich: giai('Internal: models used, tester knowledge/experience, likely defects, test objective, documentation, lifecycle model.', 'Bên trong: mô hình dùng, kiến thức/kinh nghiệm tester, lỗi dự kiến, mục tiêu test, tài liệu, mô hình vòng đời.') },
    { ma: 'q3', de: hai('What is the best statement about choosing test techniques?', 'Phát biểu đúng nhất về chọn kỹ thuật test?'), luaChon: lc(['a', 'One technique is always the best'], ['b', 'Techniques are usually combined; the choice depends on many factors and some techniques fit some situations better'], ['c', 'Only black-box techniques are needed'], ['d', 'The cheapest technique is always chosen']), dapAn: ['b'], giaiThich: giai('No technique is best in all situations.', 'Không có kỹ thuật nào tốt nhất cho mọi tình huống.') },
    { ma: 'q4', de: hai('A sequential lifecycle model tends to lead to…', 'Mô hình vòng đời tuần tự có xu hướng dẫn tới…'), luaChon: lc(['a', 'more formal techniques'], ['b', 'only exploratory testing'], ['c', 'no test design'], ['d', 'only acceptance testing']), dapAn: ['a'], giaiThich: giai('Iterative models lean towards an exploratory approach.', 'Mô hình lặp nghiêng về cách tiếp cận khám phá.') },
    { ma: 'q5', de: hai('Safety-critical use (e.g. medical monitoring) mainly implies…', 'Phần mềm dùng trong tình huống an toàn sống còn (vd theo dõi y tế) chủ yếu đòi…'), luaChon: lc(['a', 'less testing'], ['b', 'more thorough testing'], ['c', 'only usability testing'], ['d', 'only exploratory testing']), dapAn: ['b'], giaiThich: giai('Expected use of the software.', 'Yếu tố cách phần mềm sẽ được dùng.') },
  ],
  goiY: ['Bên trong = đội test biết và có gì; bên ngoài = dự án, khách hàng, luật áp đặt gì.', 'Mô hình tuần tự ⇒ hình thức; mô hình lặp ⇒ khám phá.'],
  loiHayGap: ['Xếp “time and budget” vào bên trong.', 'Chọn “một kỹ thuật tốt nhất”.'],
  giaiThich: '<p>Answers: b · c · b · a · b.</p>',
  thuatNgu: [{ en: 'internal / external factors', vi: 'yếu tố bên trong / bên ngoài' }],
  khaiNiem: ['choosing test techniques'],
});

export default doiDau({
  slug: 'swt301-choosing-test-techniques',
  ten: '6.2 Choosing test techniques',
  moTaModule: 'Nhận diện 13 yếu tố chọn kỹ thuật, chọn kỹ thuật cho tám tình huống LabBook, quyết định mức hình thức, câu thi về yếu tố bên trong/bên ngoài.',
  khoa: KHOA,
  baiHoc: 'swt301-choosing-test-techniques',
  de: [E1, E2, E3, E4],
});
