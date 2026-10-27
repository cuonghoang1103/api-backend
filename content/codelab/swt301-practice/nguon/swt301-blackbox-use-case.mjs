/**
 * SWT301 · 4.6 — Use case testing + mixed review of all black-box techniques (SWT4 slide 73–81, LO-4.2.5 K2).
 */
import { doiDau, KHOA, hai, giai, lc, tn, jsLit } from './_chung.mjs';
import { tinhDe, jsDe } from './_de.mjs';
import { kiemKichBan, LABBOOK_API } from './_labbook.mjs';

const E1 = tinhDe({
  tieuDe: 'Use case 1 — What use case testing covers (K2)',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Use case testing tests the system transaction by transaction, from start to finish, the way an actor uses it: one test for the main success scenario and one for each alternative, exception and error path (the ATM use case of SWT4 slide 73 gives 4 tests). Five questions.</p>', vi: '<p>Kiểm thử use case test hệ thống theo từng giao dịch, từ đầu tới cuối, đúng cách tác nhân sử dụng: một test cho kịch bản thành công chính và một test cho mỗi nhánh thay thế, ngoại lệ, lỗi (use case ATM ở slide SWT4 73 cho 4 test). Năm câu hỏi.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('A use case has a main success scenario and 3 extensions (2a, 4a, 4b). What is the minimum number of tests for full use case coverage?', 'Một use case có kịch bản chính và 3 nhánh mở rộng (2a, 4a, 4b). Số test tối thiểu để phủ đủ use case là bao nhiêu?'), luaChon: lc(['a', '1'], ['b', '3'], ['c', '4'], ['d', '8']), dapAn: ['c'], giaiThich: giai('One for the main scenario + one per extension = 4 — exactly the ATM example of slide 73.', 'Một cho kịch bản chính + một cho mỗi nhánh = 4 — đúng ví dụ ATM ở slide 73.') },
    { ma: 'q2', de: hai('Use case coverage is measured as…', 'Độ phủ use case được đo bằng…'), luaChon: lc(['a', 'the number of actors tested'], ['b', 'the percentage of use case behaviours (main, alternative, exception paths) tested'], ['c', 'the number of screens visited'], ['d', 'statement coverage of the controller']), dapAn: ['b'], giaiThich: giai('Coverage = use case behaviours tested ÷ total use case behaviours, as a percentage.', 'Độ phủ = số hành vi use case đã test ÷ tổng số hành vi, tính %.') },
    { ma: 'q3', de: hai('At which test levels is use case testing most useful?', 'Kiểm thử use case hữu ích nhất ở cấp test nào?'), luaChon: lc(['a', 'Component testing only'], ['b', 'System and acceptance testing (and integration of actor–system interactions)'], ['c', 'Static testing only'], ['d', 'It cannot be used at any level']), dapAn: ['b'], giaiThich: giai('Use cases describe actor–system interactions end to end, the natural basis for system and acceptance testing.', 'Use case mô tả tương tác tác nhân–hệ thống đầu cuối, là cơ sở tự nhiên cho system và acceptance test.') },
    { ma: 'q4', de: hai('Which defect is use case testing especially good at finding?', 'Use case testing đặc biệt giỏi tìm lỗi loại nào?'), luaChon: lc(['a', 'Off-by-one errors in a loop'], ['b', 'Defects in the process flows during real-world use, including integration defects'], ['c', 'Unused variables'], ['d', 'Missing database indexes']), dapAn: ['b'], giaiThich: giai('The syllabus: tests based on use cases uncover defects in the process flows during real use of the system.', 'Syllabus: test dựa use case phát hiện lỗi trong luồng xử lý khi dùng hệ thống thực tế.') },
    { ma: 'q5', de: hai('In use case notation “4a Invalid PIN”, what does “4a” mean?', 'Trong ký hiệu use case “4a Invalid PIN”, “4a” nghĩa là gì?'), luaChon: lc(['a', 'The fourth use case of the system'], ['b', 'An extension that branches off at step 4 of the main scenario'], ['c', 'Test case number 4, version a'], ['d', 'The fourth actor']), dapAn: ['b'], giaiThich: giai('Extensions are numbered after the step where they branch off.', 'Nhánh mở rộng được đánh số theo bước mà nó rẽ ra.') },
  ],
  goiY: ['Mỗi đường (chính + mỗi nhánh) một test.', 'Use case = tương tác tác nhân ↔ hệ thống, đầu tới cuối.'],
  loiHayGap: ['Chỉ test kịch bản chính.', 'Đếm số tác nhân thay vì số đường đi.'],
  giaiThich: '<p>Answers: c · b · b · b · b.</p>',
  thuatNgu: [{ en: 'use case', vi: 'ca sử dụng — chuỗi tương tác tác nhân–hệ thống để đạt một mục tiêu' }, { en: 'main success scenario', vi: 'kịch bản thành công chính' }, { en: 'extension / alternative flow', vi: 'nhánh mở rộng / luồng thay thế' }, { en: 'actor', vi: 'tác nhân (người dùng hoặc hệ thống ngoài)' }],
  khaiNiem: ['use case testing'],
});

/* E2 — test use case “Book a lab seat” chạy thật trên LabBook */
const b = (as, call, body, expect) => ({ as, call, ...(body !== undefined ? { body } : {}), ...(expect !== undefined ? { expect } : {}) });
const book = (as, labCode, date, startHour, duration, expect) => b(as, 'POST /api/bookings', { labCode, date, startHour, duration }, expect);
const PRE = 'Student logged in; seed data; clock 2026-11-02 08:00';
const GIAI2 = [
  { id: 'UC03-MAIN', description: 'Main success scenario: the student books a free seat and sees it in My Bookings', precondition: PRE, steps: [
    book('student1', 'LAB01', '2026-11-04', 9, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    b('student1', 'GET /api/bookings/me', undefined, { status: 200, body: { length: 1, 0: { status: 'CONFIRMED' } } }),
  ] },
  { id: 'UC03-2a', description: '2a Invalid input: the start hour is outside 7–20', precondition: PRE, steps: [book('student1', 'LAB01', '2026-11-04', 22, 1, { status: 400, body: { error: 'VALIDATION', field: 'startHour' } })] },
  { id: 'UC03-3a', description: '3a Lab full: the student is put on the waitlist', precondition: 'LAB02 (1 seat) already booked by another student at that time', steps: [
    book('student2', 'LAB02', '2026-11-04', 9, 2, { status: 201 }),
    book('student1', 'LAB02', '2026-11-04', 9, 2, { status: 201, body: { status: 'PENDING' } }),
  ] },
  { id: 'UC03-3b', description: '3b Lab closed: the booking is refused', precondition: PRE, steps: [book('student1', 'LAB03', '2026-11-04', 9, 1, { status: 409, body: { error: 'LAB_CLOSED' } })] },
  { id: 'UC03-4a', description: '4a The student already has a booking at that time', precondition: 'The student has LAB01 09:00–11:00 on 2026-11-04', steps: [
    book('student1', 'LAB01', '2026-11-04', 9, 2, { status: 201 }),
    book('student1', 'LAB02', '2026-11-04', 10, 1, { status: 409, body: { error: 'OVERLAP' } }),
  ] },
  { id: 'UC03-4b', description: '4b Weekly limit: more than 6 hours in the week is refused', precondition: 'The student already booked 6 hours this week', steps: [
    book('student1', 'LAB01', '2026-11-03', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-05', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-06', 9, 1, { status: 422, body: { error: 'WEEKLY_LIMIT' } }),
  ] },
];
const USE_CASE = `UC-03  Book a lab seat                 Primary actor: Student
Pre-condition: the student is logged in
Main success scenario
  1. Student opens the booking form
  2. Student enters lab, date, start hour and duration
  3. System checks the lab and the free seats
  4. System checks the student's own schedule and weekly hours
  5. System confirms the booking (CONFIRMED) and shows it in My Bookings
Extensions
  2a. Invalid data (e.g. start hour outside 7-20)   → System rejects the form (VALIDATION)
  3a. No free seat                                  → System adds the student to the waitlist (PENDING)
  3b. Lab is closed                                 → System refuses the booking (LAB_CLOSED)
  4a. Student already has a booking at that time    → System refuses (OVERLAP)
  4b. More than 6 booked hours in the week          → System refuses (WEEKLY_LIMIT)`;
const E2 = jsDe({
  tieuDe: 'Use case 2 — Test the use case “Book a lab seat” on LabBook (main + 5 extensions)',
  doKho: 'MEDIUM', phut: 20,
  moTa: {
    en: `<p>Derive the tests of use case UC-03 and run them on <b>LabBook</b>: one test for the main success scenario and one for each extension. Each test is an executable scenario (see the API contract below).</p><pre>${USE_CASE}</pre><details><summary>LabBook API contract</summary>${LABBOOK_API.en}</details>`,
    vi: `<p>Rút test của use case UC-03 và chạy trên <b>LabBook</b>: một test cho kịch bản chính và một test cho mỗi nhánh mở rộng. Mỗi test là một kịch bản chạy được (xem hợp đồng API bên dưới).</p><pre>${USE_CASE}</pre><details><summary>Hợp đồng API LabBook</summary>${LABBOOK_API.vi}</details>`,
  },
  yeuCau: [
    { en: '<code>TEST_CASES = [{ id, description, precondition, steps: [{ as, call, body, expect }] }]</code> — 6 cases, one per path.', vi: '<code>TEST_CASES = [{ id, description, precondition, steps: [{ as, call, body, expect }] }]</code> — 6 ca, mỗi đường một ca.' },
    { en: 'Set up each extension’s pre-condition inside the case (e.g. another student books LAB02 first for 3a).', vi: 'Dựng tiền điều kiện của từng nhánh ngay trong ca (vd sinh viên khác đặt LAB02 trước cho 3a).' },
  ],
  viDu: [{ input: "3b: { as: 'student1', call: 'POST /api/bookings', body: { labCode: 'LAB03', … }, expect: { status: 409, body: { error: 'LAB_CLOSED' } } }", output: 'covers extension 3b', explanation: 'LAB03 is closed in the seed data.|||LAB03 đang đóng trong dữ liệu mẫu.' }],
  goiY: ['3a cần phòng đầy: LAB02 chỉ có 1 chỗ — cho student2 đặt trước cùng giờ.', '4b: hai booking 3 giờ trong cùng tuần (03/11 và 05/11), rồi đặt thêm 1 giờ.'],
  loiHayGap: ['Gộp mọi nhánh vào một ca dài — lỗi ở nhánh đầu che các nhánh sau.', 'Dùng ngày ở tuần sau cho 4b — không chạm giới hạn tuần.'],
  giaiThich: '<p>Use case coverage = 6 behaviours / 6 = 100% with one case per path. Each extension case first creates its precondition (a full lab, an existing booking, 6 booked hours), then performs the branching step.</p>',
  thuatNgu: [{ en: 'use case coverage', vi: 'độ phủ use case = số đường đã test / tổng số đường' }, ...tn('precondition')],
  khaiNiem: ['use case testing', 'use case coverage'],
  tep: {
    'answer.js': [
      `// One executable test case per use-case path of UC-03.\nconst TEST_CASES = [\n${jsLit(GIAI2[0], '  ').replace(/^/, '  ')},\n];\n`,
      `// UC-03 Book a lab seat — main success scenario + 5 extensions = 6 tests (100% use case coverage).\nconst TEST_CASES = ${jsLit(GIAI2)};\n`,
    ],
  },
  kiem: kiemKichBan({
    bien: 'TEST_CASES', minCa: 6,
    can: [
      { ma: 'POST /api/bookings 201 CONFIRMED', ten: 'main success scenario (CONFIRMED)', tenVi: 'kịch bản chính (CONFIRMED)' },
      { ma: 'GET /api/bookings/me 200', ten: 'step 5 — the booking appears in My Bookings', tenVi: 'bước 5 — booking hiện trong Booking của tôi' },
      { ma: 'POST /api/bookings 400 VALIDATION', ten: 'extension 2a — invalid data', tenVi: 'nhánh 2a — dữ liệu sai' },
      { ma: 'POST /api/bookings 201 PENDING', ten: 'extension 3a — waitlist', tenVi: 'nhánh 3a — danh sách chờ' },
      { ma: 'POST /api/bookings 409 LAB_CLOSED', ten: 'extension 3b — lab closed', tenVi: 'nhánh 3b — phòng đóng' },
      { ma: 'POST /api/bookings 409 OVERLAP', ten: 'extension 4a — overlapping booking', tenVi: 'nhánh 4a — trùng giờ' },
      { ma: 'POST /api/bookings 422 WEEKLY_LIMIT', ten: 'extension 4b — weekly limit', tenVi: 'nhánh 4b — giới hạn tuần' },
    ],
    dotBien: [
      { ma: 'S4', moTa: { en: 'a closed lab accepts bookings', vi: 'phòng đóng vẫn nhận booking' } },
      { ma: 'I8', an: true, moTa: { en: 'overlap only checked in the same lab', vi: 'chỉ kiểm trùng giờ trong cùng phòng' } },
    ],
  }),
});

const BUOC = [
  ['a', 'Identify the actor, the pre-conditions and the post-conditions of the use case'],
  ['b', 'Write a test for the main success scenario'],
  ['c', 'Write a test for each alternative / extension path'],
  ['d', 'Write a test for each exception and error path'],
  ['e', 'Check the use case coverage (behaviours tested ÷ behaviours) and add missing paths'],
];
const E3 = tinhDe({
  tieuDe: 'Use case 3 — Order the steps of deriving tests from a use case',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>A use case (actor, pre-conditions, main success scenario, extensions, post-conditions) is the test basis of use case testing. Put the steps of use case test design in the order a tester performs them, from understanding the use case to checking the coverage that was reached.</p>', vi: '<p>Use case (tác nhân, tiền điều kiện, kịch bản chính, nhánh mở rộng, hậu điều kiện) là test basis của kiểm thử use case. Sắp các bước thiết kế test từ use case theo thứ tự tester thực hiện, từ hiểu use case tới kiểm tra độ phủ đạt được.</p>' },
  loai: 'order',
  cauHoi: [{ ma: 'o1', de: hai('Use case test design — from first to last', 'Thiết kế test từ use case — từ đầu tới cuối'), muc: lc(BUOC[3], BUOC[0], BUOC[4], BUOC[1], BUOC[2]), dapAn: ['a', 'b', 'c', 'd', 'e'], giaiThich: giai('Understand the use case (actor, pre/post-conditions), then cover its behaviours from the main path outwards, then measure coverage.', 'Hiểu use case (tác nhân, tiền/hậu điều kiện), rồi phủ các hành vi từ đường chính ra ngoài, rồi đo độ phủ.') }],
  goiY: ['Bắt đầu bằng việc hiểu use case: ai, khi nào, kết quả gì.', 'Đo độ phủ ở cuối để biết còn thiếu đường nào.'],
  loiHayGap: ['Viết test nhánh lỗi trước khi có test đường chính.', 'Bỏ qua hậu điều kiện (post-condition) khi viết kết quả mong đợi.'],
  giaiThich: '<p>a → b → c → d → e.</p>',
  thuatNgu: [{ en: 'post-condition', vi: 'hậu điều kiện — trạng thái hệ thống sau khi use case kết thúc' }],
  khaiNiem: ['use case testing'],
});

const E4 = tinhDe({
  tieuDe: 'Use case 4 — Mixed black-box review (EP · BVA · decision table · state transition · use case)',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Seven exam-style questions mixing all five black-box techniques — the kind of block that closes SWT4 and fills the FE. Calculate carefully.</p>', vi: '<p>Bảy câu kiểu đề thi trộn cả năm kỹ thuật black-box — đúng kiểu khối câu cuối SWT4 và đề FE. Tính cẩn thận.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('A parking app charges by the started hour: 1–2 h 20,000; 3–5 h 40,000; 6–24 h 60,000; anything else is invalid (whole hours). Using 2-value BVA, which set contains only boundary values?', 'Ứng dụng gửi xe tính theo giờ bắt đầu: 1–2 giờ 20.000; 3–5 giờ 40.000; 6–24 giờ 60.000; ngoài ra không hợp lệ (giờ nguyên). Theo BVA hai giá trị, bộ nào chỉ gồm giá trị biên?'), luaChon: lc(['a', '0, 1, 2, 3, 5, 6, 24, 25'], ['b', '1, 2, 4, 6, 24'], ['c', '0, 1, 12, 24, 25'], ['d', '1, 3, 6, 24']), dapAn: ['a'], giaiThich: giai('Edges of every partition: 0|1, 2|3, 5|6, 24|25.', 'Mép mọi vùng: 0|1, 2|3, 5|6, 24|25.') },
    { ma: 'q2', de: hai('For the same parking app, what is the minimum number of tests for 100% equivalence partition coverage (valid and invalid)?', 'Cùng ứng dụng gửi xe, số test tối thiểu cho 100% độ phủ phân vùng (đúng và sai) là bao nhiêu?'), luaChon: lc(['a', '3'], ['b', '4'], ['c', '5'], ['d', '8']), dapAn: ['c'], giaiThich: giai('Partitions: < 1, 1–2, 3–5, 6–24, > 24 = 5 (one input, so no combining).', 'Vùng: < 1, 1–2, 3–5, 6–24, > 24 = 5 (một input nên không ghép được).') },
    { ma: 'q3', de: hai('A decision table has conditions “registered?”, “premium?”, “promo code?” and the rule “premium is only possible for registered users”. How many FEASIBLE rules does the full table have?', 'Bảng quyết định có điều kiện “đã đăng ký?”, “premium?”, “mã khuyến mãi?” và luật “chỉ người đã đăng ký mới có premium”. Bảng đầy đủ có bao nhiêu luật KHẢ THI?'), luaChon: lc(['a', '4'], ['b', '6'], ['c', '7'], ['d', '8']), dapAn: ['b'], giaiThich: giai('8 combinations minus the 2 with premium = T and registered = F → 6.', '8 tổ hợp trừ 2 tổ hợp premium = T mà registered = F → 6.') },
    { ma: 'q4', de: hai('A media player has states STOPPED, PLAYING, PAUSED and events play, pause, stop. Valid transitions: STOPPED-play→PLAYING, PLAYING-pause→PAUSED, PAUSED-play→PLAYING, PLAYING-stop→STOPPED, PAUSED-stop→STOPPED. How many INVALID state–event combinations are there?', 'Trình phát nhạc có trạng thái STOPPED, PLAYING, PAUSED và sự kiện play, pause, stop. Chuyển đổi hợp lệ: STOPPED-play→PLAYING, PLAYING-pause→PAUSED, PAUSED-play→PLAYING, PLAYING-stop→STOPPED, PAUSED-stop→STOPPED. Có bao nhiêu tổ hợp trạng thái–sự kiện KHÔNG hợp lệ?'), luaChon: lc(['a', '3'], ['b', '4'], ['c', '5'], ['d', '9']), dapAn: ['b'], giaiThich: giai('3 states × 3 events = 9 cells − 5 valid = 4 invalid (STOPPED-pause, STOPPED-stop, PLAYING-play, PAUSED-pause).', '3 trạng thái × 3 sự kiện = 9 ô − 5 hợp lệ = 4 không hợp lệ.') },
    { ma: 'q5', de: hai('Same media player: which single test sequence (from STOPPED) achieves 0-switch coverage?', 'Cùng trình phát: chuỗi test nào (từ STOPPED) đạt độ phủ 0-switch?'), luaChon: lc(['a', 'play · pause · play · stop'], ['b', 'play · pause · stop · play · stop'], ['c', 'play · pause · play · pause · stop · play · stop'], ['d', 'play · stop']), dapAn: ['c'], giaiThich: giai('It needs all 5 transitions: play (S→P), pause (P→Pa), play (Pa→P), stop from PLAYING and stop from PAUSED. Only (c) contains both stops; (b) misses PAUSED-play.', 'Cần đủ 5 chuyển đổi, gồm stop từ PLAYING và stop từ PAUSED. Chỉ (c) có cả hai; (b) thiếu PAUSED-play.') },
    { ma: 'q6', de: hai('Which technique is the best choice for “the system must handle 15 different combinations of membership level, payment method and delivery option”?', 'Kỹ thuật nào phù hợp nhất cho “hệ thống phải xử lý 15 tổ hợp khác nhau của hạng thành viên, phương thức thanh toán và cách giao hàng”?'), luaChon: lc(['a', 'Boundary value analysis'], ['b', 'Decision table testing'], ['c', 'Statement testing'], ['d', 'Use case testing']), dapAn: ['b'], giaiThich: giai('Combinations of conditions leading to actions = decision table.', 'Tổ hợp điều kiện dẫn tới hành động = bảng quyết định.') },
    { ma: 'q7', de: hai('A password must be 8–20 characters. A tester tests 7, 8, 20 and 21 characters. What do these tests achieve?', 'Mật khẩu phải 8–20 ký tự. Tester test 7, 8, 20 và 21 ký tự. Các test này đạt được gì?'), luaChon: lc(['a', '100% two-value BVA coverage of the length, and 100% EP coverage of it'], ['b', '100% two-value BVA coverage only'], ['c', '50% BVA coverage'], ['d', '100% three-value BVA coverage']), dapAn: ['a'], giaiThich: giai('The four values are the two-value boundaries; they also fall into all three partitions (< 8, 8–20, > 20), so EP is 100% too.', 'Bốn giá trị là biên hai giá trị; chúng cũng nằm trong cả ba vùng (< 8, 8–20, > 20) nên EP cũng 100%.') },
  ],
  goiY: ['Viết ra trục số trước khi chọn đáp án BVA/EP.', 'Bảng trạng thái: số ô = số trạng thái × số sự kiện.'],
  loiHayGap: ['Câu 2 đếm thiếu vùng sai hai phía.', 'Câu 5 chọn (b) vì "có hai lần stop" mà quên PAUSED-play.'],
  giaiThich: '<p>Answers: a · c · b · b · c · b · a.</p>',
  thuatNgu: tn('ep', 'bva', 'decisionTable', 'stateTransition'),
  khaiNiem: ['black-box techniques review'],
});

export default doiDau({
  slug: 'swt301-blackbox-use-case',
  ten: '4.6 Use case testing & black-box review',
  moTaModule: 'Use case testing: câu hỏi K2, test use case “Book a lab seat” chạy thật trên LabBook (đường chính + 5 nhánh, bắt 2 bản lỗi), thứ tự thiết kế test, và 7 câu ôn tổng hợp năm kỹ thuật black-box.',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-use-case',
  de: [E1, E2, E3, E4],
});
