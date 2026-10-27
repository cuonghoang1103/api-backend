/**
 * SWT301 · DỰ ÁN XUYÊN SUỐT LabBook — mốc chương 4: thiết kế test hộp đen cho chức năng đặt chỗ (EP/BVA trên các trường,
 * bảng quyết định cho kết quả đặt chỗ, chuyển trạng thái của booking) — mọi ca CHẠY THẬT trên LabBook + Interview corner.
 */
import { doiDau, KHOA, hai, giai, lc, svg, jsLit, NOP_BAI, tn } from './_chung.mjs';
import { tinhDe } from './_de.mjs';
import { kiemKichBan, LABBOOK_API, DOT_BIEN_HE_THONG, DOT_BIEN_TICH_HOP } from './_labbook.mjs';

const b = (as, call, body, expect) => ({ as, call, ...(body !== undefined ? { body } : {}), ...(expect !== undefined ? { expect } : {}) });
const book = (as, labCode, date, startHour, duration, expect) => b(as, 'POST /api/bookings', { labCode, date, startHour, duration }, expect);
const huy = (as, code, expect) => b(as, `DELETE /api/bookings/${code}`, undefined, expect);
const ca = (id, technique, description, steps) => ({ id, technique, description, precondition: 'Seed data; clock Mon 2026-11-02 08:00', steps });
const V400 = (field) => ({ status: 400, body: { error: 'VALIDATION', field } });

const GIAI = [
  ca('BVA-01', 'BVA', 'startHour boundaries: 6 and 21 rejected, 7 and 20 accepted', [
    book('student1', 'LAB01', '2026-11-04', 6, 1, V400('startHour')),
    book('student1', 'LAB01', '2026-11-04', 7, 1, { status: 201 }),
    book('student1', 'LAB01', '2026-11-04', 20, 1, { status: 201 }),
    book('student1', 'LAB01', '2026-11-04', 21, 1, V400('startHour')),
  ]),
  ca('BVA-02', 'BVA', 'duration boundaries: 0 and 4 rejected, 1 and 3 accepted', [
    book('student1', 'LAB01', '2026-11-04', 9, 0, V400('duration')),
    book('student1', 'LAB01', '2026-11-04', 9, 1, { status: 201 }),
    book('student1', 'LAB01', '2026-11-05', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-06', 9, 4, V400('duration')),
  ]),
  ca('BVA-03', 'BVA', 'booking window: day −1 and day 15 rejected, day 0 (today, 1 h ahead) and day 14 accepted', [
    book('student1', 'LAB01', '2026-11-01', 9, 1, { status: 422, body: { error: 'OUT_OF_WINDOW' } }),
    book('student1', 'LAB01', '2026-11-02', 9, 1, { status: 201 }),
    book('student1', 'LAB01', '2026-11-16', 9, 1, { status: 201 }),
    book('student1', 'LAB01', '2026-11-17', 9, 1, { status: 422, body: { error: 'OUT_OF_WINDOW' } }),
  ]),
  ca('BVA-04', 'BVA', 'closing time: ends at 21:00 accepted, ends at 22:00 rejected', [
    book('student1', 'LAB01', '2026-11-04', 18, 3, { status: 201 }),
    book('student2', 'LAB01', '2026-11-04', 19, 3, { status: 422, body: { error: 'AFTER_CLOSING' } }),
  ]),
  ca('DT-01', 'DT', 'outcome rules: lab not found, lab closed, too soon', [
    book('student1', 'LAB99', '2026-11-04', 9, 1, { status: 404, body: { error: 'LAB_NOT_FOUND' } }),
    book('student1', 'LAB03', '2026-11-04', 9, 1, { status: 409, body: { error: 'LAB_CLOSED' } }),
    book('student1', 'LAB01', '2026-11-02', 8, 1, { status: 422, body: { error: 'TOO_SOON' } }),
  ]),
  ca('DT-02', 'DT', 'outcome rules: seat free → CONFIRMED, lab full → PENDING', [
    book('student1', 'LAB02', '2026-11-04', 9, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student2', 'LAB02', '2026-11-04', 9, 2, { status: 201, body: { status: 'PENDING' } }),
  ]),
  ca('DT-03', 'DT', 'outcome rules: overlap with own booking, weekly limit', [
    book('student1', 'LAB01', '2026-11-03', 9, 3, { status: 201 }),
    book('student1', 'LAB02', '2026-11-03', 10, 1, { status: 409, body: { error: 'OVERLAP' } }),
    book('student1', 'LAB01', '2026-11-04', 9, 3, { status: 201 }),
    book('student1', 'LAB01', '2026-11-05', 9, 1, { status: 422, body: { error: 'WEEKLY_LIMIT' } }),
  ]),
  ca('ST-01', 'ST', 'CONFIRMED → CANCELLED, then PENDING → CONFIRMED by promotion', [
    book('student1', 'LAB02', '2026-11-04', 9, 2, { status: 201, body: { code: 'BK0001', status: 'CONFIRMED' } }),
    book('student2', 'LAB02', '2026-11-04', 9, 2, { status: 201, body: { code: 'BK0002', status: 'PENDING' } }),
    huy('student1', 'BK0001', { status: 200, body: { status: 'CANCELLED' } }),
    b('student2', 'GET /api/bookings/me', undefined, { status: 200, body: { 0: { code: 'BK0002', status: 'CONFIRMED' } } }),
  ]),
  ca('ST-02', 'ST', 'PENDING → CANCELLED by the student, and CANCELLED → (cancel) rejected', [
    book('student1', 'LAB02', '2026-11-04', 9, 2, { status: 201 }),
    book('student2', 'LAB02', '2026-11-04', 9, 2, { status: 201, body: { code: 'BK0002', status: 'PENDING' } }),
    huy('student2', 'BK0002', { status: 200, body: { status: 'CANCELLED' } }),
    huy('student2', 'BK0002', { status: 409, body: { error: 'ALREADY_CANCELLED' } }),
  ]),
  ca('ST-03', 'ST', 'CONFIRMED and PENDING → CANCELLED by the lab-closure cascade', [
    book('student1', 'LAB01', '2026-11-04', 9, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student2', 'LAB01', '2026-11-04', 9, 2, { status: 201, body: { status: 'CONFIRMED' } }),
    book('student3', 'LAB01', '2026-11-04', 9, 2, { status: 201, body: { status: 'PENDING' } }),
    b('manager', 'PATCH /api/labs/LAB01', { status: 'CLOSED' }, { status: 200, body: { cancelled: 3 } }),
    b('student3', 'GET /api/bookings/me', undefined, { status: 200, body: { 0: { status: 'CANCELLED' } } }),
  ]),
];

const G = (ma, ten, nhom, an) => ({ ma, ten, nhom, ...(an ? { an: true } : {}) });
const CAN = [
  ...[6, 7, 20, 21].map((v) => G(`IN startHour=${v}`, `BVA startHour = ${v}`, 'f1')),
  ...[0, 1, 3, 4].map((v) => G(`IN duration=${v}`, `BVA duration = ${v}`, 'f1')),
  ...[-1, 0, 14, 15].map((v) => G(`IN day=${v}`, `BVA booking day ${v} (days from today)`, 'f1')),
  G('IN end=21', 'BVA end time 21:00 (accepted)', 'f1'), G('IN end=22', 'BVA end time 22:00 (rejected)', 'f1'),
  G('POST /api/bookings 404 LAB_NOT_FOUND', 'DT rule: unknown lab', 'f2'), G('POST /api/bookings 409 LAB_CLOSED', 'DT rule: closed lab', 'f2'),
  G('POST /api/bookings 422 TOO_SOON', 'DT rule: less than 1 hour ahead', 'f2'), G('POST /api/bookings 201 CONFIRMED', 'DT rule: seat free → CONFIRMED', 'f2'),
  G('POST /api/bookings 201 PENDING', 'DT rule: lab full → PENDING', 'f2'), G('POST /api/bookings 409 OVERLAP', 'DT rule: overlapping own booking', 'f2'),
  G('POST /api/bookings 422 WEEKLY_LIMIT', 'DT rule: weekly limit', 'f2'),
  G('TRANS NONE->CONFIRMED', 'ST: created as CONFIRMED', 'f3'), G('TRANS NONE->PENDING', 'ST: created as PENDING', 'f3'),
  G('TRANS CONFIRMED->CANCELLED', 'ST: CONFIRMED → CANCELLED', 'f3'), G('TRANS PENDING->CONFIRMED', 'ST: PENDING → CONFIRMED (promotion)', 'f3'),
  G('TRANS PENDING->CANCELLED', 'ST: PENDING → CANCELLED', 'f3'), G('DELETE /api/bookings/:code 409 ALREADY_CANCELLED', 'ST: invalid transition CANCELLED → cancel', 'f3'),
  G('EVENT CASCADE', 'ST: CONFIRMED → CANCELLED by a lab closure', 'f3'),
];
const KIEM = [
  {
    moTa: { en: 'Every case names its technique (EP, BVA, DT or ST)', vi: 'Mỗi ca ghi rõ kỹ thuật (EP, BVA, DT hoặc ST)' },
    chuanBi: "const __KQ = (function () { if (typeof TEST_CASES === 'undefined' || !Array.isArray(TEST_CASES)) return 'TEST_CASES is missing'; const i = TEST_CASES.findIndex((c) => ['EP', 'BVA', 'DT', 'ST'].indexOf(String(c.technique || '').toUpperCase()) < 0); return i < 0 ? 'OK' : (TEST_CASES[i].id || '#' + (i + 1)) + ': technique must be EP, BVA, DT or ST'; })();",
    goi: '__KQ', mongDoi: 'OK', nhom: 'f1',
  },
  ...kiemKichBan({
    bien: 'TEST_CASES', minCa: 8, can: CAN, nhomCauTruc: 'f1',
    dotBien: [
      DOT_BIEN_HE_THONG.find((m) => m.ma === 'S6'), DOT_BIEN_HE_THONG.find((m) => m.ma === 'S2'),
      DOT_BIEN_TICH_HOP.find((m) => m.ma === 'I8'), { ...DOT_BIEN_TICH_HOP.find((m) => m.ma === 'I5'), an: true },
    ], nhomDotBien: 'f3',
  }),
];

const VONG_DOI = svg({
  w: 600, h: 250, tieuDe: 'LabBook booking life cycle',
  nut: [
    { id: 's', x: 30, y: 125, hinh: 'dau', nhan: '' },
    { id: 'C', x: 200, y: 60, hinh: 'tt', nhan: 'CONFIRMED', rong: 110 },
    { id: 'P', x: 200, y: 195, hinh: 'tt', nhan: 'PENDING', rong: 100 },
    { id: 'X', x: 470, y: 125, hinh: 'tt', nhan: 'CANCELLED', rong: 110, mau: '#fee2e2' },
  ],
  canh: [
    { tu: 's', den: 'C', nhan: 'create (seat free)' }, { tu: 's', den: 'P', nhan: 'create (lab full)' },
    { tu: 'P', den: 'C', nhan: 'promote' },
    { tu: 'C', den: 'X', nhan: 'cancel / lab closed' }, { tu: 'P', den: 'X', nhan: 'cancel / lab closed' },
  ],
});

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 4 — Black-box Test Design for Booking',
  phu: { en: 'Running project · chapter 4 · EP/BVA · decision table · state transition · executed on LabBook · 10 marks', vi: 'Dự án xuyên suốt · chương 4 · EP/BVA · bảng quyết định · chuyển trạng thái · chạy thật trên LabBook · 10 điểm' },
  moTa: {
    en: `<p><b>LabBook</b> is the system you test through the whole course (milestone 1 read its requirements, milestones 2–3 planned levels and reviewed the code). In this milestone you design the <b>black-box</b> tests of its core feature — <code>POST /api/bookings</code> — with the four techniques of chapter 4, and you prove them by running them. Label each case with its technique: it is the habit interviewers look for (“why this test?”).</p>${VONG_DOI}<details><summary>LabBook API contract</summary>${LABBOOK_API.en}</details>`,
    vi: `<p><b>LabBook</b> là hệ thống bạn kiểm thử suốt môn (mốc 1 đọc yêu cầu, mốc 2–3 lập cấp test và review mã). Ở mốc này bạn thiết kế test <b>hộp đen</b> cho chức năng lõi — <code>POST /api/bookings</code> — bằng bốn kỹ thuật của chương 4, và chứng minh bằng cách chạy thật. Ghi kỹ thuật cho từng ca: đó là thói quen nhà tuyển dụng tìm (“vì sao có test này?”).</p>${VONG_DOI}<details><summary>Hợp đồng API LabBook</summary>${LABBOOK_API.vi}</details>`,
  },
  chucNangChinh: [
    { en: 'EP/BVA of every constrained field of the booking request.', vi: 'EP/BVA cho mọi trường có ràng buộc của yêu cầu đặt chỗ.' },
    { en: 'Decision-table rules of the booking outcome.', vi: 'Các luật bảng quyết định cho kết quả đặt chỗ.' },
    { en: 'Every transition of the booking life cycle, plus an invalid one.', vi: 'Mọi chuyển đổi của vòng đời booking, cộng một chuyển đổi không hợp lệ.' },
  ],
  yeuCauChung: [
    { en: 'Put both sides of a boundary in the same case (it shows the boundary and keeps the sheet short).', vi: 'Đặt hai phía của một biên trong cùng một ca (thấy rõ biên và sheet gọn).' },
    { en: 'Mind the weekly 6-hour limit when one case books several times.', vi: 'Để ý giới hạn 6 giờ/tuần khi một ca đặt nhiều lần.' },
  ],
  cayThuMuc: `answers/
└── booking-blackbox.js   ← const TEST_CASES = [ { id, technique: 'EP'|'BVA'|'DT'|'ST', description, precondition, steps } ]`,
  moHinh: {
    ten: 'POST /api/bookings request',
    truong: [
      ['labCode', 'string', { en: 'LAB01 (2 seats) · LAB02 (1 seat) · LAB03 (closed)', vi: 'LAB01 (2 chỗ) · LAB02 (1 chỗ) · LAB03 (đóng)' }],
      ['date', 'YYYY-MM-DD', { en: 'from today (2026-11-02) to 14 days ahead', vi: 'từ hôm nay (2026-11-02) tới 14 ngày sau' }],
      ['startHour', 'integer', { en: '7–20; today at least 1 hour ahead (≥ 9)', vi: '7–20; hôm nay phải trước ít nhất 1 giờ (≥ 9)' }],
      ['duration', 'integer', { en: '1–3 hours; must end by 21:00', vi: '1–3 giờ; phải kết thúc trước 21:00' }],
    ],
  },
  chucNang: [
    { ten: { en: 'EP / BVA of the request fields', vi: 'EP / BVA cho các trường của yêu cầu' }, diem: 4, yeuCau: [{ en: 'startHour 6|7, 20|21 · duration 0|1, 3|4 · day −1|0, 14|15 · end time 21|22 — each value in a step whose expected result is right.', vi: 'startHour 6|7, 20|21 · duration 0|1, 3|4 · ngày −1|0, 14|15 · giờ kết thúc 21|22 — mỗi giá trị nằm trong một bước có kết quả mong đợi đúng.' }], hook: ['BVA'] },
    { ten: { en: 'Decision-table rules of the outcome', vi: 'Luật bảng quyết định của kết quả' }, diem: 3, yeuCau: [{ en: 'Unknown lab · closed lab · too soon · seat free (CONFIRMED) · lab full (PENDING) · overlap · weekly limit.', vi: 'Phòng không tồn tại · phòng đóng · quá sát giờ · còn chỗ (CONFIRMED) · đầy (PENDING) · trùng giờ · giới hạn tuần.' }], hook: ['decision table'] },
    { ten: { en: 'Booking life cycle', vi: 'Vòng đời booking' }, diem: 3, yeuCau: [{ en: 'NONE→CONFIRMED, NONE→PENDING, CONFIRMED→CANCELLED, PENDING→CONFIRMED, PENDING→CANCELLED, a cascade cancellation and the invalid “cancel a cancelled booking”. Two faulty builds of the life cycle must be caught.', vi: 'NONE→CONFIRMED, NONE→PENDING, CONFIRMED→CANCELLED, PENDING→CONFIRMED, PENDING→CANCELLED, huỷ lan truyền và chuyển đổi sai “huỷ booking đã huỷ”. Phải bắt hai bản build lỗi của vòng đời.' }], hook: ['state transition'] },
  ],
  idBatBuoc: [['TEST_CASES', 'answers/booking-blackbox.js']],
  truDiem: [
    { en: 'Booking more than 6 hours inside one case and then wondering why a “valid” boundary returns WEEKLY_LIMIT.', vi: 'Đặt quá 6 giờ trong một ca rồi thắc mắc vì sao biên “hợp lệ” trả WEEKLY_LIMIT.' },
    { en: 'Testing day 0 with startHour 8 — that is the TOO_SOON rule, not the window boundary.', vi: 'Test ngày 0 với startHour 8 — đó là luật TOO_SOON, không phải biên cửa sổ.' },
  ],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 4 — Talking about test design',
  doKho: 'MEDIUM', phut: 10,
  moTa: {
    en: '<p><b>Interview corner.</b> Questions a junior QA/tester interview asks right after “Which test design techniques do you know?”. Pick the answer you would give — the explanations show why the others sound weaker to an interviewer.</p>',
    vi: '<p><b>Góc phỏng vấn.</b> Những câu phỏng vấn QA/tester junior hay hỏi ngay sau “Bạn biết kỹ thuật thiết kế test nào?”. Chọn câu bạn sẽ trả lời — phần giải thích cho thấy vì sao các câu kia nghe yếu hơn với người phỏng vấn.</p>',
  },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“What is the difference between equivalence partitioning and boundary value analysis?”', '“Phân vùng tương đương và phân tích giá trị biên khác nhau thế nào?”'), luaChon: lc(['a', 'They are the same technique with different names'], ['b', 'EP picks one value per group the system treats the same; BVA tests the edges of ordered groups, where off-by-one defects live — e.g. LabBook start hour: EP 12, BVA 6/7 and 20/21'], ['c', 'BVA is used for strings, EP for numbers'], ['d', 'EP is white-box, BVA is black-box']), dapAn: ['b'], giaiThich: giai('A strong answer defines both, says how they relate (BVA extends EP for ordered partitions) and gives a concrete example from your own project.', 'Câu trả lời tốt định nghĩa cả hai, nói quan hệ (BVA mở rộng EP cho vùng có thứ tự) và có ví dụ cụ thể từ dự án của mình.') },
    { ma: 'q2', de: hai('“When would you use a decision table instead of EP?”', '“Khi nào bạn dùng bảng quyết định thay vì EP?”'), luaChon: lc(['a', 'Never, EP is always enough'], ['b', 'When the result depends on a COMBINATION of conditions — e.g. a booking is CONFIRMED, PENDING or refused depending on lab status, free seats, overlap and weekly hours'], ['c', 'When the input is a number'], ['d', 'Only for UI testing']), dapAn: ['b'], giaiThich: giai('EP looks at one input at a time; business rules are combinations, which is what decision tables expose.', 'EP xét từng input; quy tắc nghiệp vụ là tổ hợp — đúng chỗ bảng quyết định làm lộ ra.') },
    { ma: 'q3', de: hai('“Tell me about a defect that state transition testing helps you find.”', '“Kể một lỗi mà kiểm thử chuyển trạng thái giúp bạn tìm.”'), luaChon: lc(['a', 'A typo on the login page'], ['b', 'An action allowed in a state where it should be rejected — e.g. cancelling an already-cancelled booking, or a waitlisted booking that never gets promoted'], ['c', 'A slow database query'], ['d', 'A missing unit test']), dapAn: ['b'], giaiThich: giai('State-based defects are about history: wrong transitions, missing transitions, actions accepted in the wrong state.', 'Lỗi theo trạng thái liên quan tới lịch sử: chuyển sai, thiếu chuyển, thao tác được nhận ở trạng thái sai.') },
    { ma: 'q4', de: hai('“You have one day to test the booking API. How do you choose what to test?”', '“Bạn có một ngày để test API đặt chỗ. Chọn test gì?”'), luaChon: lc(['a', 'Test everything, even if it takes a week'], ['b', 'Start from risk: the money/fairness rules (capacity, waitlist, weekly limit) and the boundaries most likely to be wrong; use EP/BVA for fields and decision tables for the rules; leave cosmetic checks for later'], ['c', 'Only test the happy path'], ['d', 'Ask the developer which tests to write']), dapAn: ['b'], giaiThich: giai('Interviewers want risk-based thinking + technique choice + an explicit trade-off.', 'Người phỏng vấn muốn thấy tư duy theo rủi ro + chọn kỹ thuật + đánh đổi rõ ràng.') },
    { ma: 'q5', de: hai('“How many test cases do you need for a field accepting 1–3 hours?”', '“Trường nhận 1–3 giờ cần bao nhiêu test case?”'), luaChon: lc(['a', 'Exactly one'], ['b', 'It depends on the technique: EP needs 3 (below, inside, above); 2-value BVA needs 4 (0, 1, 3, 4); and I would add “not a number” as an invalid partition'], ['c', 'Always 100'], ['d', 'As many as the developer wrote']), dapAn: ['b'], giaiThich: giai('Show that the number comes from the technique and the coverage target, not from habit.', 'Cho thấy con số đến từ kỹ thuật và mục tiêu độ phủ, không phải thói quen.') },
  ],
  goiY: ['Câu trả lời mạnh = định nghĩa + lý do + ví dụ thật (LabBook).', 'Nói rõ đánh đổi khi thời gian có hạn.'],
  loiHayGap: ['Trả lời “giống nhau” hoặc chỉ nêu tên kỹ thuật.', 'Không có ví dụ từ dự án của chính mình.'],
  giaiThich: '<p>All answers: b. In an interview, always pair the definition with a concrete example from your project (LabBook).</p>',
  thuatNgu: tn('ep', 'bva', 'decisionTable', 'stateTransition'),
  khaiNiem: ['interview', 'test design'],
});

export default doiDau({
  slug: 'swt301-4-project-labbook-blackbox',
  ten: 'LabBook Project 4 — Black-box Test Design for Booking',
  moTaModule: 'Dự án xuyên suốt LabBook — mốc chương 4: thiết kế test hộp đen cho POST /api/bookings (BVA mọi trường, luật kết quả, vòng đời booking) chạy thật, bắt 4 bản lỗi; kèm góc phỏng vấn về thiết kế test.',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-use-case',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 4 — Black-box Test Design for Booking (executed)',
      doKho: 'HARD', phut: 90, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: 'BVA-04: 18:00 + 3 h → 201; 19:00 + 3 h → 422 AFTER_CLOSING', output: 'both sides of the closing-time boundary', explanation: 'end = 21 accepted, end = 22 rejected.|||Kết thúc 21 được, 22 bị từ chối.' }],
      khaiNiem: ['equivalence partitioning', 'boundary value analysis', 'decision table testing', 'state transition testing'],
      tienQuyet: ['SWT301 chapter 4', 'LabBook API'],
      the: ['swt301', 'project', 'labbook'],
      banIn: BAN_IN,
      thuatNgu: tn('ep', 'bva', 'decisionTable', 'stateTransition', 'expected'),
      goiY: [
        'Mỗi ca kỹ thuật BVA: đặt hai phía biên trong cùng ca, đổi ngày giữa các lần đặt để không chạm giới hạn tuần/trùng giờ.',
        'Ngày −1 = 2026-11-01, ngày 14 = 2026-11-16, ngày 15 = 2026-11-17. Ngày 0 (hôm nay) cần startHour ≥ 9.',
        'Vòng đời: LAB02 có 1 chỗ ⇒ người thứ hai PENDING; người đầu huỷ ⇒ PENDING→CONFIRMED. Người PENDING tự huỷ ⇒ PENDING→CANCELLED.',
      ],
      loiHayGap: [
        'Đặt startHour 7 và 20 cùng ngày với 3 giờ mỗi lần — vượt 6 giờ/tuần.',
        'Quên ca chuyển đổi không hợp lệ (huỷ lần hai) — đó là test âm của máy trạng thái.',
        'Không ghi technique — người đọc sheet không biết ca để làm gì.',
      ],
      moTaNgan: 'Mốc 4 dự án LabBook: thiết kế test hộp đen cho đặt chỗ, chạy thật.',
      giaiThich: {
        en: '<p>Ten executable cases: four BVA cases (each field with both sides of each boundary), three decision-table cases (one outcome rule per step), three state-transition cases (every life-cycle transition plus the invalid “cancel twice”). The faulty builds S6 (day 15 accepted), S2 (PENDING counted as seated), I8 (overlap only within one lab) and I5 (closure leaves PENDING) are caught by BVA-03, ST-01, DT-03 and ST-03.</p>',
        vi: '<p>Mười ca chạy được: bốn ca BVA, ba ca bảng quyết định, ba ca chuyển trạng thái (gồm chuyển sai “huỷ hai lần”). Các bản lỗi S6, S2, I8, I5 bị BVA-03, ST-01, DT-03, ST-03 bắt.</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/booking-blackbox.js'], kiem: KIEM },
      khoiDau: { 'answers/booking-blackbox.js': `// Label every case with its technique: EP, BVA, DT (decision table) or ST (state transition).\nconst TEST_CASES = [\n${jsLit(GIAI[0], '  ').replace(/^/, '  ')},\n];\n` },
      loiGiai: { 'answers/booking-blackbox.js': `// LabBook milestone 4 — black-box design of POST /api/bookings, executed.\nconst TEST_CASES = ${jsLit(GIAI)};\n` },
      thamKhao: 'https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/',
      boYeu: [
        { ten: 'không có ca vòng đời', tep: { 'answers/booking-blackbox.js': `const TEST_CASES = ${jsLit(GIAI.filter((c) => c.technique !== 'ST'))};\n` }, phaiTruot: ['Covers: ST: PENDING → CANCELLED'] },
      ],
    },
    PHONG_VAN,
  ],
});
