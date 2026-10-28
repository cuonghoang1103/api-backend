/**
 * SWR302 · 4.8 — Data models: the conceptual ERD and cardinality (Wiegers Ch.13 slides 1–7 + LAB L.5).
 */
import { tn, CU_PHAP } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';
import { kiemErd } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const E1 = phanLoai({
  tieuDe: 'ERD 1 — read the crow’s foot',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>In Mermaid erDiagram the marker next to an entity says how many of THAT entity take part: <code>||</code> exactly one · <code>|o</code> / <code>o|</code> zero or one · <code>}o</code> / <code>o{</code> zero or many · <code>}|</code> / <code>|{</code> one or many. Read each relationship and choose its meaning.</p>', vi: '<p>Trong Mermaid erDiagram, ký hiệu sát một thực thể cho biết bao nhiêu thể hiện CỦA thực thể đó tham gia: <code>||</code> đúng một · <code>|o</code>/<code>o|</code> không hoặc một · <code>}o</code>/<code>o{</code> không hoặc nhiều · <code>}|</code>/<code>|{</code> một hoặc nhiều. Đọc mỗi quan hệ và chọn nghĩa.</p>' },
  cot: 'Meaning', luaChon: ['Each A has 0..many B; each B belongs to exactly one A', 'Each A has 1..many B; each B belongs to exactly one A', 'Each A has 0..1 B; each B belongs to exactly one A', 'Many-to-many', 'Each A has exactly one B and each B exactly one A'],
  hang: [
    ['CUSTOMER ||--o{ ORDER : places', 'Each A has 0..many B; each B belongs to exactly one A'],
    ['ORDER ||--|{ ORDER_LINE : contains', 'Each A has 1..many B; each B belongs to exactly one A'],
    ['EMPLOYEE ||--o| PARKING_PERMIT : holds', 'Each A has 0..1 B; each B belongs to exactly one A'],
    ['STUDENT }o--o{ COURSE : "enrols in"', 'Many-to-many'],
    ['PERSON ||--|| PASSPORT_RECORD : "is identified by"', 'Each A has exactly one B and each B exactly one A'],
  ],
  giaiThich: '<p>Read from each side: "one customer places zero or many orders; one order is placed by exactly one customer". The symbol nearest an entity counts that entity.</p>',
  goiY: ['Đọc hai chiều: "một A có … B" và "một B thuộc … A".', 'Ký hiệu sát thực thể nào thì đếm thực thể đó.'],
  loiHayGap: ['Đọc ký hiệu ở đầu xa (đảo nghĩa).', 'Nhầm o{ (0..nhiều) với |{ (1..nhiều).'],
  thuatNgu: tn('cardinality', 'erd'),
  khaiNiem: ['cardinality'],
});

const E2 = tracNghiem({
  tieuDe: 'ERD 2 — entity, attribute or relationship?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Conceptual ERD (course LAB L.5): entities are things the business keeps data about, each with an identifier; attributes describe an entity; relationships link entities with a verb and a cardinality. No foreign keys, no data types — that is design.</p>', vi: '<p>ERD khái niệm (LAB L.5): thực thể là thứ nghiệp vụ lưu dữ liệu, mỗi cái có định danh; thuộc tính mô tả thực thể; quan hệ nối thực thể bằng động từ và bản số. Không khoá ngoại, không kiểu dữ liệu — đó là thiết kế.</p>' },
  cau: [
    { en: 'In a hotel system, "room price" is…', vi: 'Trong hệ thống khách sạn, "giá phòng" là…', lc: [['a', 'an entity'], ['b', 'an attribute of Room (or of Room Type)'], ['c', 'a relationship'], ['d', 'an actor']], dap: 'b', giai: ['It describes a room; it has no identity of its own.', 'Nó mô tả phòng; không có danh tính riêng.'] },
    { en: 'Each stay of a guest in a room has its own check-in and check-out dates. Guest–Room is…', vi: 'Mỗi lần khách ở một phòng có ngày nhận/trả riêng. Guest–Room là…', lc: [['a', 'one-to-one'], ['b', 'many-to-many, best shown through an associative entity Stay (or Reservation)'], ['c', 'not a relationship'], ['d', 'an attribute of Guest']], dap: 'b', giai: ['A many-to-many link with its own data becomes an associative entity.', 'Nhiều–nhiều có dữ liệu riêng ⇒ thực thể kết hợp.'] },
    { en: 'Which line does NOT belong in a conceptual ERD?', vi: 'Dòng nào KHÔNG thuộc ERD khái niệm?', lc: [['a', 'GUEST ||--o{ STAY : makes'], ['b', 'string guestId PK'], ['c', 'string guestId FK (inside STAY)'], ['d', 'ROOM ||--o{ STAY : "is used in"']], dap: 'c', giai: ['The relationship line already says it; FKs are logical design.', 'Đường quan hệ đã nói điều đó; FK là thiết kế logic.'] },
    { en: 'The "Payment Gateway" that charges the guest is…', vi: '"Cổng thanh toán" trừ tiền khách là…', lc: [['a', 'an entity of the ERD'], ['b', 'an external system (an actor), not data the hotel keeps — the hotel keeps Payment records'], ['c', 'an attribute'], ['d', 'a relationship']], dap: 'b', giai: ['Do not draw external systems as entities.', 'Không vẽ hệ thống ngoài thành thực thể.'] },
  ],
  goiY: ['Có danh tính riêng và nhiều thể hiện ⇒ thực thể; mô tả một thực thể ⇒ thuộc tính.', 'Nhiều–nhiều có dữ liệu riêng ⇒ thực thể kết hợp.'],
  loiHayGap: ['Biến giá, trạng thái, ngày thành thực thể.', 'Vẽ cổng thanh toán thành thực thể.'],
  giaiThich: '<p>Answers: b · b · c · b.</p>',
  thuatNgu: tn('erd', 'associativeEntity'),
  khaiNiem: ['conceptual ERD'],
});

const GIAI = `
erDiagram
  GUEST ||--o{ RESERVATION : makes
  ROOM_TYPE ||--o{ ROOM : classifies
  ROOM ||--o{ RESERVATION : "is booked in"
  RESERVATION ||--o{ PAYMENT : "is paid by"
  GUEST {
    string guestId PK
    string fullName
    string phone
  }
  ROOM_TYPE {
    string typeCode PK
    string name
    decimal nightlyPrice
  }
  ROOM {
    string roomNumber PK
    int floor
  }
  RESERVATION {
    string reservationId PK
    date checkIn
    date checkOut
    string status
  }
  PAYMENT {
    string paymentId PK
    decimal amount
    datetime paidAt
  }
`;
const E3 = baiJs({
  tieuDe: 'ERD 3 — draw the conceptual ERD of a small hotel',
  doKho: 'HARD', phut: 18,
  moTa: { en: `<p>A small hotel keeps: <b>guests</b> (name, phone); <b>room types</b> (Standard, Deluxe… with a nightly price); <b>rooms</b> (number, floor), each of exactly one type; <b>reservations</b> — a guest reserves one specific room for a check-in and a check-out date, and a guest can have many reservations over time; <b>payments</b> — a reservation can be paid in several parts (deposit, balance). Draw the conceptual ERD.</p><p>${CU_PHAP.erd.en}</p>`, vi: `<p>Một khách sạn nhỏ lưu: <b>khách</b> (tên, điện thoại); <b>loại phòng</b> (Standard, Deluxe… có giá mỗi đêm); <b>phòng</b> (số, tầng), mỗi phòng đúng một loại; <b>đặt phòng</b> — khách đặt một phòng cụ thể cho ngày nhận và ngày trả, một khách có nhiều lượt đặt theo thời gian; <b>thanh toán</b> — một lượt đặt có thể trả nhiều lần (cọc, phần còn lại). Vẽ ERD khái niệm.</p><p>${CU_PHAP.erd.vi}</p>` },
  yeuCau: [{ en: 'Five entities with identifiers, verb-labelled relationships, the "many" end on the right side, no foreign keys.', vi: 'Năm thực thể có định danh, quan hệ nhãn động từ, phía "nhiều" đúng chỗ, không khoá ngoại.' }],
  viDu: [{ input: 'GUEST ||--o{ RESERVATION : makes', output: 'one guest makes zero or many reservations; each reservation is made by one guest', explanation: 'Read both directions.|||Đọc hai chiều.' }],
  tep: { 'erd.js': ['const ERD = ´\nerDiagram\n  GUEST {\n    string guestId PK\n  }\n´;\n', `const ERD = ´${GIAI.replace(/\s+$/, '')}\n´;\n`] },
  kiem: kiemErd({
    bien: 'ERD',
    tt: [{ ten: 'Guest', khop: ['guest|customer'] }, { ten: 'Room type', khop: ['type|category'] }, { ten: 'Room', khop: ['^room$'] }, { ten: 'Reservation', khop: ['reserv|booking|stay'] }, { ten: 'Payment', khop: ['payment'] }],
    camTt: [{ ten: 'Price / Date / Status', khop: ['^price|^date|^status|nightly'], lyDo: 'that is an attribute', lyDoVi: 'đó là thuộc tính' }],
    qh: [
      { ten: 'Guest 1 — N Reservation', a: ['guest|customer'], b: ['reserv|booking|stay'], nhieu: 'b' },
      { ten: 'Room type 1 — N Room', a: ['type|category'], b: ['^room$'], nhieu: 'b' },
      { ten: 'Room 1 — N Reservation', a: ['^room$'], b: ['reserv|booking|stay'], nhieu: 'b' },
      { ten: 'Reservation 1 — N Payment (paid in parts)', a: ['reserv|booking|stay'], b: ['payment'], nhieu: 'b', lyDo: 'a reservation can be paid in several parts', lyDoVi: 'một lượt đặt trả được nhiều lần' },
    ],
    khongTrucTiep: [{ ten: 'Guest–Room goes through Reservation', a: ['guest|customer'], b: ['^room$'], lyDo: 'each stay has its own dates — link Guest and Room through RESERVATION', lyDoVi: 'mỗi lượt ở có ngày riêng — nối Guest và Room qua RESERVATION' }],
  }),
  goiY: ['Năm thực thể: GUEST, ROOM_TYPE, ROOM, RESERVATION, PAYMENT.', '"Trả nhiều lần" ⇒ một lượt đặt — nhiều payment.'],
  loiHayGap: ['Nối thẳng GUEST với ROOM.', 'Ghi roomNumber FK trong RESERVATION.'],
  giaiThich: `<p>Reservation is the associative entity between Guest and Room; Room Type classifies rooms; payments hang off the reservation.</p>${khoiThamChieu('erd', GIAI, 'Conceptual ERD — small hotel')}`,
  thuatNgu: tn('erd', 'cardinality', 'associativeEntity'),
  khaiNiem: ['conceptual ERD'],
  boYeu: [{ ten: 'nối thẳng Guest–Room, có FK', tep: { 'erd.js': 'const ERD = `\nerDiagram\n  GUEST }o--o{ ROOM : stays\n  ROOM_TYPE ||--o{ ROOM : classifies\n  GUEST {\n    string guestId PK\n  }\n  ROOM {\n    string roomNumber PK\n    string typeCode FK\n  }\n  ROOM_TYPE {\n    string typeCode PK\n  }\n`;\n' } }],
});

const E4 = tracNghiem({
  tieuDe: 'ERD 4 — cardinality from business sentences',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Read each business sentence in both directions, then choose the Mermaid relationship that says the same thing.</p>', vi: '<p>Đọc mỗi câu nghiệp vụ theo hai chiều rồi chọn quan hệ Mermaid nói đúng điều đó.</p>' },
  cau: [
    { en: 'A department has one or more employees; an employee works in exactly one department.', vi: 'Một phòng có một hoặc nhiều nhân viên; một nhân viên thuộc đúng một phòng.', lc: [['a', 'DEPARTMENT ||--|{ EMPLOYEE : employs'], ['b', 'DEPARTMENT }|--|| EMPLOYEE : employs'], ['c', 'DEPARTMENT ||--o| EMPLOYEE : employs'], ['d', 'DEPARTMENT }o--o{ EMPLOYEE : employs']], dap: 'a', giai: ['Department side ||, employee side |{.', 'Phía phòng ||, phía nhân viên |{.'] },
    { en: 'A course may have no prerequisite or several; a course can be the prerequisite of several courses.', vi: 'Một môn có thể không có hoặc có nhiều môn tiên quyết; một môn có thể là tiên quyết của nhiều môn.', lc: [['a', 'COURSE ||--|| COURSE : requires'], ['b', 'COURSE }o--o{ COURSE : requires'], ['c', 'COURSE ||--o{ PREREQUISITE_COURSE : has'], ['d', 'no relationship']], dap: 'b', giai: ['A recursive many-to-many relationship (LAB L.5).', 'Quan hệ nhiều–nhiều đệ quy (LAB L.5).'] },
    { en: 'An order has at most one invoice, issued after payment; an invoice belongs to exactly one order.', vi: 'Một đơn có tối đa một hoá đơn, xuất sau khi thanh toán; một hoá đơn thuộc đúng một đơn.', lc: [['a', 'ORDER ||--o| INVOICE : "is billed by"'], ['b', 'ORDER ||--|{ INVOICE : "is billed by"'], ['c', 'ORDER }o--|| INVOICE : "is billed by"'], ['d', 'ORDER ||--|| INVOICE : "is billed by"']], dap: 'a', giai: ['Zero or one invoice per order (none before payment).', 'Mỗi đơn không hoặc một hoá đơn (chưa có trước khi trả).'] },
  ],
  goiY: ['Viết hai câu: "một A có … B" và "một B thuộc … A", rồi đặt ký hiệu sát đúng thực thể.', '"at most one" = o| ; "one or more" = |{.'],
  loiHayGap: ['Quên trường hợp "chưa có" (0) khi đơn vừa tạo.', 'Không nhận ra quan hệ đệ quy.'],
  giaiThich: '<p>Answers: a · b · a.</p>',
  thuatNgu: tn('cardinality'),
  khaiNiem: ['cardinality'],
});

export default moDun({
  slug: 'swr302-4-10-ch13-data-models',
  ten: '4.10 Data models: the conceptual ERD and cardinality',
  moTaModule: 'Đọc ký hiệu chân quạ Mermaid, thực thể / thuộc tính / quan hệ, bản số từ câu nghiệp vụ (cả quan hệ đệ quy), tự vẽ ERD khái niệm khách sạn có thực thể kết hợp Reservation — chấm bằng máy đọc erDiagram.',
  de: [E1, E2, E4, E3],
});
