/**
 * SWR302 · 1.2 — Levels and types of requirements (Wiegers Ch.1 slides 6–16, Figure 1-1).
 */
import { tn, kiemKhoa } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Levels and types 1 — Figure 1-1',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Figure 1-1 of Wiegers reads top-down: <b>business requirements</b> (why) → <b>user requirements</b> (what users must be able to do) → <b>functional requirements</b> (what the system must do), each stored in its own artefact; <b>business rules</b>, <b>quality attributes</b>, <b>external interfaces</b> and <b>constraints</b> feed in from the sides.</p>', vi: '<p>Hình 1-1 của Wiegers đọc từ trên xuống: <b>business requirements</b> (vì sao) → <b>user requirements</b> (người dùng phải làm được gì) → <b>functional requirements</b> (hệ thống phải làm gì), mỗi loại lưu trong tài liệu riêng; <b>business rules</b>, <b>quality attributes</b>, <b>external interfaces</b> và <b>constraints</b> đi vào từ hai bên.</p>' },
  cau: [
    { en: 'Which level answers WHY the organisation builds the system?', vi: 'Cấp nào trả lời VÌ SAO tổ chức xây hệ thống?', lc: [['a', 'User requirements'], ['b', 'Business requirements'], ['c', 'Functional requirements'], ['d', 'System requirements']], dap: 'b', giai: ['Business requirements state the business benefits sought.', 'Business requirement nêu lợi ích nghiệp vụ mong đạt.'] },
    { en: 'Where are business requirements usually recorded?', vi: 'Business requirement thường được ghi ở đâu?', lc: [['a', 'In the SRS'], ['b', 'In the vision and scope document'], ['c', 'In the source code'], ['d', 'In the test plan']], dap: 'b', giai: ['The vision and scope document (Chapter 5).', 'Tài liệu tầm nhìn & phạm vi (Chương 5).'] },
    { en: 'User requirements are typically represented as…', vi: 'User requirement thường được biểu diễn bằng…', lc: [['a', 'use cases, user stories or event-response tables'], ['b', 'class diagrams'], ['c', 'database schemas'], ['d', 'Gantt charts']], dap: 'a', giai: ['They describe what users must be able to do.', 'Chúng mô tả người dùng phải làm được gì.'] },
    { en: 'A business rule is…', vi: 'Một business rule là…', lc: [['a', 'a functional requirement written by the business'], ['b', 'a policy, regulation, standard or algorithm that exists outside any one application and often leads to functional requirements'], ['c', 'a rule in the code'], ['d', 'a UI guideline']], dap: 'b', giai: ['It is not itself a software requirement, but functional requirements trace back to it.', 'Tự nó không phải yêu cầu phần mềm, nhưng yêu cầu chức năng truy về nó.'] },
    { en: 'In Wiegers’ book, "system requirements" means…', vi: 'Trong sách Wiegers, "system requirements" nghĩa là…', lc: [['a', 'very detailed software requirements'], ['b', 'requirements of a product made of several components — software, hardware, even people'], ['c', 'the requirements of the operating system'], ['d', 'nonfunctional requirements']], dap: 'b', giai: ['The book does NOT use the term for "detailed software requirements".', 'Sách KHÔNG dùng thuật ngữ này cho "yêu cầu phần mềm chi tiết".'] },
  ],
  goiY: ['Ba cấp dọc: business (vì sao) → user (làm được gì) → functional (hệ thống làm gì).', 'Bốn loại đi vào từ hai bên: business rules, quality attributes, external interfaces, constraints.'],
  loiHayGap: ['Ghi business requirement vào SRS thay vì Vision & Scope.', 'Hiểu "system requirements" là yêu cầu phần mềm chi tiết.'],
  giaiThich: '<p>Answers: b · b · a · b · b.</p>',
  thuatNgu: tn('businessReq', 'userReq', 'functionalReq', 'businessRule', 'visionScope'),
  khaiNiem: ['levels of requirements', 'Figure 1-1'],
});

const LOAI = ['Business requirement', 'User requirement', 'Functional requirement', 'Business rule', 'Quality attribute', 'External interface', 'Constraint'];
const E2 = phanLoai({
  tieuDe: 'Levels and types 2 — classify the requirements of an airline kiosk',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>The textbook’s running example: an airline builds self-service check-in kiosks. Classify each statement with the types of Figure 1-1.</p>', vi: '<p>Ví dụ xuyên suốt của giáo trình: một hãng bay xây kiosk tự check-in. Phân loại từng phát biểu theo các loại của Hình 1-1.</p>' },
  cot: 'Type', luaChon: LOAI,
  hang: [
    ['Reduce the cost of counter staff by 25% within two years.', 'Business requirement', 'Giảm 25% chi phí nhân viên quầy trong hai năm.'],
    ['A passenger needs to check in for a flight and print a boarding pass.', 'User requirement', 'Hành khách cần check-in và in thẻ lên máy bay.'],
    ['The kiosk shall print a boarding pass for every flight segment the passenger has checked in for.', 'Functional requirement', 'Kiosk in thẻ cho mọi chặng đã check-in.'],
    ['Passengers may check in no earlier than 24 hours before departure.', 'Business rule', 'Chỉ được check-in sớm nhất 24 giờ trước giờ bay.'],
    ['A first-time passenger shall complete check-in in under 2 minutes in 90% of cases.', 'Quality attribute', 'Hành khách lần đầu check-in xong dưới 2 phút trong 90% trường hợp.'],
    ['The kiosk shall read passports through the reader’s USB HID interface.', 'External interface', 'Kiosk đọc hộ chiếu qua giao diện USB HID của đầu đọc.'],
    ['The kiosk software must run on the vendor’s locked-down Linux image.', 'Constraint', 'Phần mềm kiosk phải chạy trên bản Linux khoá của nhà cung cấp.'],
    ['Seats in emergency exit rows may only be assigned to passengers aged 15 or older.', 'Business rule', 'Ghế hàng thoát hiểm chỉ xếp cho khách từ 15 tuổi.'],
    ['The kiosk shall send each check-in to the departure control system through its SOAP API.', 'External interface', 'Kiosk gửi mỗi lượt check-in tới hệ thống điều hành chuyến bay qua API SOAP.'],
    ['A passenger wants to choose a seat while checking in.', 'User requirement', 'Hành khách muốn chọn ghế khi check-in.'],
  ],
  giaiThich: '<p>Why (business) → what users do (user) → what the kiosk does (functional); policies outside the software (business rule); how well (quality attribute); connections to devices and systems (external interface); limits on the design (constraint).</p>',
  goiY: ['"Reduce cost by 25%" là mục tiêu nghiệp vụ; "a passenger needs to…" là việc của người dùng.', 'Một luật của hãng/nhà nước tồn tại dù không có kiosk ⇒ business rule.'],
  loiHayGap: ['Xếp luật 24 giờ là functional — đó là business rule; yêu cầu chức năng (từ chối check-in quá sớm) được rút ra từ nó.', 'Xếp giao diện đọc hộ chiếu là constraint — đó là external interface.'],
  thuatNgu: tn('businessReq', 'userReq', 'functionalReq', 'businessRule', 'qualityAttr', 'externalInterface', 'constraint'),
  khaiNiem: ['types of requirements'],
});

const E3 = sapXep({
  tieuDe: 'Levels and types 3 — from why to what',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Requirements at different levels must align: every functional requirement should trace up to a user requirement, which traces up to a business requirement. Put each chain in order, from the top level down.</p>', vi: '<p>Yêu cầu ở các cấp phải thẳng hàng: mỗi yêu cầu chức năng truy lên một yêu cầu người dùng, yêu cầu người dùng truy lên một yêu cầu nghiệp vụ. Sắp mỗi chuỗi theo thứ tự từ cấp trên xuống.</p>' },
  cau: [
    { en: 'A kiosk chain', vi: 'Chuỗi của kiosk', dung: ['Reduce counter staff cost by 25%', 'A passenger checks in for a flight', 'The kiosk shall print a boarding pass for each checked-in segment', 'Test: a two-segment trip prints two boarding passes'], hien: [2, 0, 3, 1], giai: ['Business → user → functional → the test that verifies it.', 'Business → user → functional → test kiểm chứng nó.'] },
    { en: 'A library chain', vi: 'Chuỗi của thư viện', dung: ['Halve the number of books returned late', 'A reader wants to know when each loan is due', 'The system shall e-mail a reminder 2 days before a loan is due', 'The reminder job runs every day at 07:00'], hien: [3, 1, 0, 2], giai: ['Objective → user need → functional requirement → design/implementation detail.', 'Mục tiêu → nhu cầu người dùng → yêu cầu chức năng → chi tiết thiết kế/hiện thực.'] },
  ],
  goiY: ['Cấp cao nhất nói về lợi ích của TỔ CHỨC.', 'Cấp thấp nhất là thứ kiểm chứng hoặc hiện thực yêu cầu chức năng.'],
  loiHayGap: ['Đặt yêu cầu chức năng lên trên yêu cầu người dùng.', 'Coi chi tiết hiện thực (job chạy 07:00) là yêu cầu người dùng.'],
  giaiThich: '<p>Business → user → functional → test / design detail.</p>',
  thuatNgu: tn('businessReq', 'userReq', 'functionalReq'),
  khaiNiem: ['alignment of requirement levels', 'traceability'],
});

const E4 = baiJs({
  tieuDe: 'Levels and types 4 — trace each functional requirement to its user requirement',
  doKho: 'HARD', phut: 12,
  moTa: { en: `<p>The kiosk team wrote three user requirements and eight functional requirements. Every functional requirement must trace to exactly one user requirement; one of them traces to none — it is <b>gold plating</b> (nobody asked for it).</p>
<ul><li><b>UR-1</b> A passenger checks in for a flight.</li><li><b>UR-2</b> A passenger chooses or changes a seat.</li><li><b>UR-3</b> A passenger checks a bag.</li></ul>
<ul><li><b>FR-1</b> The kiosk shall find a booking by booking reference or passport.</li><li><b>FR-2</b> The kiosk shall show the seat map of the flight.</li><li><b>FR-3</b> The kiosk shall print a bag tag for each checked bag.</li><li><b>FR-4</b> The kiosk shall print the boarding pass.</li><li><b>FR-5</b> The kiosk shall refuse a seat in an exit row to a passenger younger than 15.</li><li><b>FR-6</b> The kiosk shall weigh each bag and show the excess-baggage fee.</li><li><b>FR-7</b> The kiosk shall play a welcome video with the airline’s latest promotions.</li><li><b>FR-8</b> The kiosk shall refuse check-in earlier than 24 hours before departure.</li></ul>
<p>Write <code>TRACE</code>: for each FR the user requirement it comes from, or <code>"NONE"</code>.</p>`, vi: '<p>Đội kiosk viết ba yêu cầu người dùng và tám yêu cầu chức năng. Mỗi yêu cầu chức năng phải truy về đúng một yêu cầu người dùng; có một cái không truy về đâu — đó là <b>gold plating</b> (không ai yêu cầu). Viết <code>TRACE</code>: với mỗi FR ghi UR nguồn, hoặc <code>"NONE"</code>.</p>' },
  yeuCau: [{ en: 'One entry per functional requirement, value "UR-1", "UR-2", "UR-3" or "NONE".', vi: 'Mỗi FR một mục, giá trị "UR-1", "UR-2", "UR-3" hoặc "NONE".' }],
  viDu: [{ input: 'FR-4 The kiosk shall print the boarding pass.', output: 'UR-1', explanation: 'Printing the boarding pass is part of checking in.|||In thẻ lên máy bay là một phần của check-in.' }],
  tep: {
    'answer.js': [
      "// One value per FR: 'UR-1' | 'UR-2' | 'UR-3' | 'NONE'\nconst TRACE = { 'FR-1': '', 'FR-2': '', 'FR-3': '', 'FR-4': 'UR-1', 'FR-5': '', 'FR-6': '', 'FR-7': '', 'FR-8': '' };\n",
      "// Check-in: find booking, boarding pass, the 24-hour rule. Seat: seat map, exit-row rule. Bags: tag, weight/fee.\n// FR-7 traces to no user requirement — gold plating unless a business objective asks for it.\nconst TRACE = { 'FR-1': 'UR-1', 'FR-2': 'UR-2', 'FR-3': 'UR-3', 'FR-4': 'UR-1', 'FR-5': 'UR-2', 'FR-6': 'UR-3', 'FR-7': 'NONE', 'FR-8': 'UR-1' };\n",
    ],
  },
  kiem: kiemKhoa([
    ...['FR-1', 'FR-2', 'FR-3', 'FR-5', 'FR-6', 'FR-8'].map((k) => ({ moTa: { en: `${k} traces to the right user requirement`, vi: `${k} truy về đúng yêu cầu người dùng` }, bieuThuc: `TRACE['${k}']`, chap: [{ 'FR-1': 'UR-1', 'FR-2': 'UR-2', 'FR-3': 'UR-3', 'FR-5': 'UR-2', 'FR-6': 'UR-3', 'FR-8': 'UR-1' }[k]] })),
    { moTa: { en: 'The gold-plated requirement is found', vi: 'Tìm ra yêu cầu mạ vàng' }, bieuThuc: "TRACE['FR-7']", chap: ['NONE'], goiY: 'which FR answers no user need?' },
  ]),
  goiY: ['Đọc từng FR và hỏi: nó giúp hành khách làm việc nào (check-in, chọn ghế, gửi hành lý)?', 'Luật (24 giờ, 15 tuổi) được thực thi bên trong use case mà nó chặn.'],
  loiHayGap: ['Gán FR-5 (luật ghế thoát hiểm) cho UR-1 vì nó xảy ra lúc check-in — nó thuộc việc chọn ghế.', 'Cho rằng video quảng cáo truy về check-in.'],
  giaiThich: '<p>FR-1, FR-4, FR-8 → UR-1; FR-2, FR-5 → UR-2; FR-3, FR-6 → UR-3; FR-7 → NONE (gold plating). Tracing upward is how you find requirements nobody asked for.</p>',
  thuatNgu: [...tn('userReq', 'functionalReq', 'goldPlating', 'rtm')],
  khaiNiem: ['traceability between levels', 'gold plating'],
});

export default moDun({
  slug: 'swr302-1-4-ch1-levels-types',
  ten: '1.4 Levels and types of requirements (Figure 1-1)',
  moTaModule: 'Hình 1-1 của Wiegers: ba cấp business → user → functional và bốn loại đi vào từ hai bên; phân loại yêu cầu kiosk check-in; sắp chuỗi từ "vì sao" tới "làm gì"; truy mỗi FR về yêu cầu người dùng để bắt gold plating.',
  de: [E1, E2, E3, E4],
});
