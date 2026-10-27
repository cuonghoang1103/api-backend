/**
 * SWT301 · 2.1 — Software development lifecycle models (SWT2 slide 1–35, LO-2.1.1–2.1.2).
 */
import { doiDau, KHOA, hai, giai, lc, svg } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const MO = ['Waterfall', 'V-model', 'Iterative & incremental (Scrum)', 'Kanban', 'Spiral'];
const E1 = tinhDe({
  tieuDe: 'SDLC 1 — Which lifecycle model is described?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Sequential models (waterfall, V-model) make one linear pass; iterative and incremental models (RUP, Scrum, Kanban, spiral) deliver working software in short cycles. Match each description to the model.</p>', vi: '<p>Mô hình tuần tự (waterfall, V-model) đi một lượt tuyến tính; mô hình lặp và tăng dần (RUP, Scrum, Kanban, spiral) giao phần mềm chạy được theo các vòng ngắn. Ghép mỗi mô tả với mô hình.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Description → model', 'Mô tả → mô hình'),
    cot: [{ ma: 'd', ten: 'Description' }, { ma: 'm', ten: 'Model', luaChon: MO }],
    hang: [
      'Each phase starts when the previous one is finished; testing happens once, at the end, after all code is written',
      'Each development phase on the left arm has a corresponding test level on the right arm; test planning starts with the requirements',
      'Fixed-length sprints; at the end of each sprint a potentially shippable increment is demonstrated',
      'No fixed iterations: work items flow through a board with work-in-progress limits; a feature can be released at any time',
      'Experimental increments are built, tested and possibly thrown away after a risk analysis in each loop',
    ].map((d, i) => ({ ma: `r${i}`, o: { d } })),
    dapAn: { 'r0.m': MO[0], 'r1.m': MO[1], 'r2.m': MO[2], 'r3.m': MO[3], 'r4.m': MO[4] },
    giaiThich: giai('Waterfall tests at the end; the V-model integrates the test process throughout; Scrum works in sprints; Kanban has no fixed iterations and limits WIP; Spiral (prototyping) builds experimental increments, heavily reworked or abandoned.', 'Waterfall test ở cuối; V-model gắn quy trình test xuyên suốt; Scrum chạy theo sprint; Kanban không có vòng cố định, giới hạn WIP; Spiral (prototyping) dựng bản thử nghiệm, có thể làm lại nhiều hay bỏ đi.'),
  }],
  goiY: ['Có chữ “sprint” ⇒ Scrum; “board, WIP” ⇒ Kanban; “risk analysis mỗi vòng, bỏ đi” ⇒ Spiral.', 'Test lên kế hoạch ngay từ yêu cầu và có nhánh trái/phải ⇒ V-model.'],
  loiHayGap: ['Nhầm V-model với waterfall vì cả hai đều tuần tự.', 'Gán Kanban có iteration cố định.'],
  giaiThich: '<p>Waterfall · V-model · Scrum · Kanban · Spiral.</p>',
  thuatNgu: [{ en: 'sequential model', vi: 'mô hình tuần tự' }, { en: 'iterative & incremental', vi: 'lặp và tăng dần' }, { en: 'WIP limit', vi: 'giới hạn việc đang làm' }, { en: 'increment', vi: 'phần tăng thêm — phần mềm chạy được sau một vòng' }],
  khaiNiem: ['SDLC models'],
});

const VSVG = svg({
  w: 640, h: 300, tieuDe: 'V-model',
  nut: [
    { id: 'r', x: 110, y: 40, nhan: 'User requirements', hinh: 'chu', rong: 170 },
    { id: 's', x: 170, y: 105, nhan: 'System requirements', hinh: 'chu', rong: 170 },
    { id: 'a', x: 230, y: 170, nhan: 'Architectural design', hinh: 'chu', rong: 170 },
    { id: 'd', x: 290, y: 235, nhan: 'Detailed design', hinh: 'chu', rong: 150 },
    { id: 'c', x: 320, y: 280, nhan: 'Coding', hinh: 'hop', rong: 90, cao: 26 },
    { id: 'ct', x: 350, y: 235, nhan: '(4) ?', hinh: 'chu', rong: 110 },
    { id: 'it', x: 410, y: 170, nhan: '(3) ?', hinh: 'chu', rong: 110 },
    { id: 'st', x: 470, y: 105, nhan: '(2) ?', hinh: 'chu', rong: 110 },
    { id: 'at', x: 530, y: 40, nhan: '(1) ?', hinh: 'chu', rong: 110 },
  ],
  canh: [
    { tu: 'r', den: 's' }, { tu: 's', den: 'a' }, { tu: 'a', den: 'd' }, { tu: 'd', den: 'c' }, { tu: 'c', den: 'ct' },
    { tu: 'ct', den: 'it' }, { tu: 'it', den: 'st' }, { tu: 'st', den: 'at' },
    { tu: 'r', den: 'at', net: 'dut' }, { tu: 's', den: 'st', net: 'dut' }, { tu: 'a', den: 'it', net: 'dut' }, { tu: 'd', den: 'ct', net: 'dut' },
  ],
});
const CAP = ['Component testing', 'Integration testing', 'System testing', 'Acceptance testing'];
const E2 = tinhDe({
  tieuDe: 'SDLC 2 — Complete the V-model',
  doKho: 'EASY', phut: 5,
  moTa: { en: `<p>In the V-model each development activity on the left has a corresponding test level on the right, and the test basis of that level is the work product on the left (dashed lines).</p>${VSVG}`, vi: `<p>Trong V-model mỗi hoạt động phát triển bên trái có một cấp test tương ứng bên phải, và test basis của cấp đó là sản phẩm bên trái (đường nét đứt).</p>${VSVG}` },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Name the test levels (1)–(4)', 'Gọi tên các cấp test (1)–(4)'),
    cot: [{ ma: 'b', ten: 'Box' }, { ma: 'l', ten: 'Test level', luaChon: CAP }],
    hang: ['(1) — paired with user requirements', '(2) — paired with system requirements', '(3) — paired with architectural design', '(4) — paired with detailed design'].map((b, i) => ({ ma: `r${i}`, o: { b } })),
    dapAn: { 'r0.l': CAP[3], 'r1.l': CAP[2], 'r2.l': CAP[1], 'r3.l': CAP[0] },
    giaiThich: giai('User requirements ↔ acceptance; system requirements ↔ system; architecture ↔ integration; detailed design ↔ component.', 'Yêu cầu người dùng ↔ acceptance; yêu cầu hệ thống ↔ system; kiến trúc ↔ integration; thiết kế chi tiết ↔ component.'),
  }],
  goiY: ['Đọc chữ V theo hàng ngang: tầng cao nhất bên trái đi với tầng cao nhất bên phải.', 'Sản phẩm bên trái là test basis của cấp bên phải: thiết kế chi tiết là cơ sở của component test.'],
  loiHayGap: ['Ghép kiến trúc với system testing.', 'Ghép yêu cầu hệ thống với acceptance — acceptance đi với yêu cầu NGƯỜI DÙNG/nghiệp vụ.'],
  giaiThich: '<p>(1) acceptance · (2) system · (3) integration · (4) component.</p>',
  thuatNgu: [{ en: 'V-model', vi: 'mô hình chữ V' }, { en: 'test level', vi: 'cấp kiểm thử' }],
  khaiNiem: ['V-model'],
});

const E3 = tinhDe({
  tieuDe: 'SDLC 3 — Good testing in any lifecycle (K2)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>The syllabus lists characteristics of good testing that hold for <b>every</b> lifecycle model. Select all of them, then answer four exam questions.</p>', vi: '<p>Syllabus nêu các đặc điểm của kiểm thử tốt đúng với <b>mọi</b> mô hình vòng đời. Chọn tất cả, rồi trả lời bốn câu thi.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', nhieu: true, de: hai('Select ALL characteristics of good testing in any SDLC.', 'Chọn TẤT CẢ đặc điểm của kiểm thử tốt trong mọi SDLC.'), luaChon: lc(
      ['a', 'For every development activity there is a corresponding test activity'],
      ['b', 'Each test level has test objectives specific to that level'],
      ['c', 'Test analysis and design for a level begin during the corresponding development activity'],
      ['d', 'Testers participate in discussions and review work products as soon as drafts are available'],
      ['e', 'Testing starts only when coding is finished'],
      ['f', 'Every project must use the same four test levels in the same order'],
    ), dapAn: ['a', 'b', 'c', 'd'], giaiThich: giai('a–d are the four characteristics; e and f contradict early testing and the need to adapt to context.', 'a–d là bốn đặc điểm; e, f trái với test sớm và việc điều chỉnh theo ngữ cảnh.') },
    { ma: 'q2', de: hai('In an iterative model, what grows with every iteration and calls for automation?', 'Trong mô hình lặp, thứ gì phình ra mỗi vòng và đòi tự động hoá?'), luaChon: lc(['a', 'The number of requirements documents'], ['b', 'The regression test suite'], ['c', 'The number of test levels'], ['d', 'The size of the test team']), dapAn: ['b'], giaiThich: giai('Each increment must not break the previous ones, so regression testing grows.', 'Mỗi phần tăng không được làm hỏng phần trước, nên regression phình ra.') },
    { ma: 'q3', de: hai('Why must a lifecycle model be adapted to the context?', 'Vì sao mô hình vòng đời phải điều chỉnh theo ngữ cảnh?'), luaChon: lc(['a', 'Because of project goal, type of product, business priorities (time-to-market) and identified product and project risks'], ['b', 'Because testers prefer Agile'], ['c', 'It must not be adapted'], ['d', 'Only to reduce documentation']), dapAn: ['a'], giaiThich: giai('E.g. a COTS integration may run integration testing at system level and acceptance in two steps; a safety-critical product needs a more formal model.', 'Vd tích hợp phần mềm thương mại có sẵn có thể test tích hợp ở mức hệ thống và acceptance hai bước; sản phẩm an toàn sống còn cần mô hình chính quy hơn.') },
    { ma: 'q4', de: hai('In the V-model, when should acceptance test design start?', 'Trong V-model, khi nào nên bắt đầu thiết kế acceptance test?'), luaChon: lc(['a', 'After system testing'], ['b', 'When the user requirements are written (test analysis and design begin during the corresponding development activity)'], ['c', 'After deployment'], ['d', 'When the customer complains']), dapAn: ['b'], giaiThich: giai('Early test design also reviews the requirements and finds defects in them.', 'Thiết kế test sớm cũng là review yêu cầu và tìm lỗi trong đó.') },
    { ma: 'q5', de: hai('Which is a typical risk of the waterfall model for testing?', 'Rủi ro điển hình của waterfall với kiểm thử là gì?'), luaChon: lc(['a', 'Too much regression testing'], ['b', 'Defects are found late, when they are expensive to fix, and testing is squeezed at the end'], ['c', 'No documentation'], ['d', 'Too many releases']), dapAn: ['b'], giaiThich: giai('Late feedback is the price of a single pass.', 'Phản hồi muộn là cái giá của một lượt duy nhất.') },
  ],
  goiY: ['Bốn đặc điểm: tương ứng hoạt động, mục tiêu riêng mỗi cấp, phân tích/thiết kế sớm, tester review bản nháp sớm.', 'Mô hình lặp ⇒ mỗi vòng thêm phần mới nhưng phải giữ phần cũ ⇒ hồi quy.'],
  loiHayGap: ['Chọn “mọi dự án dùng cùng bốn cấp” — các cấp có thể gộp hay bỏ theo ngữ cảnh.', 'Cho rằng V-model thiết kế acceptance test sau system test — thiết kế bắt đầu ngay khi có yêu cầu người dùng.'],
  giaiThich: '<p>q1 a, b, c, d · q2 b · q3 a · q4 b · q5 b.</p>',
  thuatNgu: [{ en: 'COTS', vi: 'phần mềm thương mại có sẵn (commercial off-the-shelf)' }, { en: 'time-to-market', vi: 'thời gian đưa sản phẩm ra thị trường' }],
  khaiNiem: ['SDLC models', 'good testing practices'],
});

const BOI = ['Sequential (V-model)', 'Iterative & incremental (Agile)'];
const E4 = tinhDe({
  tieuDe: 'SDLC 4 — Which family fits this project?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Choose the lifecycle family that fits each project best, using the comparison table of lesson 2.1 (test basis, change rate, risk, regulation).</p>', vi: '<p>Chọn họ mô hình hợp nhất với từng dự án, dựa vào bảng so sánh của bài 2.1 (test basis, tần suất thay đổi, rủi ro, quy định).</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Project → lifecycle family', 'Dự án → họ mô hình'),
    cot: [{ ma: 'p', ten: 'Project' }, { ma: 'f', ten: 'Family', luaChon: BOI }],
    hang: [
      'Software for a radiotherapy machine; every requirement must be approved by a regulator before coding',
      'LabBook: a student startup that wants feedback from real students every two weeks',
      'A bank’s fixed-price contract with a complete, signed requirements specification and one delivery date',
      'A mobile game whose features change after every A/B test',
    ].map((p, i) => ({ ma: `r${i}`, o: { p } })),
    dapAn: { 'r0.f': BOI[0], 'r1.f': BOI[1], 'r2.f': BOI[0], 'r3.f': BOI[1] },
    giaiThich: giai('Stable, formal, regulated requirements fit the V-model; frequent feedback and changing requirements fit iterative and incremental development.', 'Yêu cầu ổn định, chính thức, có quy định hợp V-model; phản hồi thường xuyên và yêu cầu hay đổi hợp mô hình lặp và tăng dần.'),
  }],
  goiY: ['Hỏi: yêu cầu có ổn định và được duyệt chính thức không? có cần phản hồi sớm không?', 'Quy định pháp lý + hợp đồng trọn gói ⇒ tài liệu chính thức ⇒ tuần tự.'],
  loiHayGap: ['Cho rằng Agile luôn tốt hơn — ngữ cảnh quyết định.', 'Chọn V-model cho sản phẩm đổi tính năng sau mỗi A/B test.'],
  giaiThich: '<p>V-model · Agile · V-model · Agile.</p>',
  thuatNgu: [{ en: 'regulator', vi: 'cơ quan quản lý' }, { en: 'fixed-price contract', vi: 'hợp đồng trọn gói' }],
  khaiNiem: ['SDLC models'],
});

export default doiDau({
  slug: 'swt301-sdlc-models',
  ten: '2.1 Software development lifecycle models',
  moTaModule: 'Waterfall, V-model, Scrum, Kanban, Spiral; hoàn thiện sơ đồ chữ V; bốn đặc điểm kiểm thử tốt; chọn họ mô hình theo ngữ cảnh dự án.',
  khoa: KHOA,
  baiHoc: 'swt301-sdlc-models',
  de: [E1, E2, E3, E4],
});
