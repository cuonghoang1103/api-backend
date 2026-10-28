/**
 * SWR302 · LAB 4B — Data & flow models: SwiftWash Campus Laundry.
 * A. context diagram · B. DFD mức 0 (cân bằng với CHÍNH context của người học, không hố đen/phép màu, kho có ghi có đọc) ·
 * C. data dictionary ký pháp Wiegers Ch.13 (primitive / structure / repeating group m:n{ } / tuỳ chọn ( )), kiểm khép kín ·
 * D. phân tích CRUD tìm yêu cầu thiếu.
 */
import { CU_PHAP, tn, jsLit, kiemTuy, bangHtml } from './_chung.mjs';
import { deLon, objDong } from './_lab.mjs';
import { kiemNguCanh, kiemDfd } from './_kiemmh.mjs';
import { kiemKhoa } from './_chung.mjs';
import { khoiThamChieu } from './_ve.mjs';

const BOI_CANH = {
  en: `<p><b>SwiftWash</b> is a laundry service for dormitory students. A <b>student</b> places a laundry order in the app: chooses one service — Wash &amp; Fold (code WF), Dry Clean (DC) or Ironing (IR) — puts 1 to 5 bags in the order, picks a pick-up slot, may add special instructions (at most 200 characters), and pays online through the <b>payment gateway</b>. The order ID has the form "SW" followed by 6 digits. SwiftWash then reserves a compartment of the dorm's <b>smart locker</b>, which later reports when bags are deposited or collected.</p>
<p>A <b>courier</b> receives the pick-up list, collects the bags from the locker, scans each bag's barcode and brings them to the shop. <b>Shop staff</b> see the list of bags to process, weigh each bag (in kg with one decimal, from 0.1 to 15.0) and mark the order ready; the price is computed from the weight and the service. The courier then receives the delivery list, puts the clean laundry back into the locker and confirms delivery; the student gets the locker code by SMS through the <b>SMS gateway</b> and can follow the order status in the app. After delivery the student can rate the order. A student may also cancel an order before pick-up and is refunded. The <b>shop manager</b> maintains the services and their prices and views the daily revenue report.</p>`,
  vi: `<p><b>SwiftWash</b> là dịch vụ giặt cho sinh viên ký túc xá. <b>Sinh viên</b> đặt đơn giặt trong app: chọn một dịch vụ — Giặt &amp; gấp (mã WF), Giặt khô (DC) hoặc Ủi (IR) — bỏ 1 tới 5 túi vào đơn, chọn khung giờ lấy đồ, CÓ THỂ ghi chú đặc biệt (tối đa 200 ký tự), và trả tiền trực tuyến qua <b>cổng thanh toán</b>. Mã đơn có dạng "SW" theo sau là 6 chữ số. SwiftWash rồi đặt trước một ngăn của <b>tủ khoá thông minh</b> ở ký túc xá; tủ sau đó báo khi túi được bỏ vào hoặc lấy ra.</p>
<p><b>Nhân viên giao nhận (courier)</b> nhận danh sách lấy đồ, lấy túi ở tủ, quét mã vạch từng túi và mang về tiệm. <b>Nhân viên tiệm</b> xem danh sách túi cần xử lý, cân từng túi (kg, một chữ số thập phân, từ 0.1 tới 15.0) và đánh dấu đơn đã xong; giá tính theo cân nặng và dịch vụ. Courier nhận danh sách giao, đặt đồ sạch vào tủ và xác nhận đã giao; sinh viên nhận mã mở tủ qua SMS do <b>cổng SMS</b> gửi và theo dõi trạng thái đơn trong app. Sau khi giao, sinh viên có thể chấm điểm đơn. Sinh viên cũng có thể huỷ đơn trước khi lấy đồ và được hoàn tiền. <b>Quản lý tiệm</b> quản lý dịch vụ và giá, xem báo cáo doanh thu ngày.</p>`,
};

const GIAI_CTX = `
flowchart LR
  S((SwiftWash))
  ST[Student]
  CO[Courier]
  SS[Shop Staff]
  MG[Shop Manager]
  PG[Payment Gateway]
  SMS[SMS Gateway]
  LK[Smart Locker]
  ST -->|laundry order| S
  ST -->|rating| S
  ST -->|cancellation request| S
  S -->|order confirmation| ST
  S -->|order status| ST
  CO -->|pick-up scan| S
  CO -->|delivery confirmation| S
  S -->|pick-up list| CO
  S -->|delivery list| CO
  SS -->|bag weight| S
  SS -->|ready notice| S
  S -->|bag list| SS
  MG -->|service and price list| S
  S -->|daily revenue report| MG
  S -->|payment request| PG
  S -->|refund request| PG
  PG -->|payment result| S
  S -->|SMS message| SMS
  S -->|locker reservation| LK
  LK -->|locker event| S
`;

const GIAI_DFD = `
flowchart LR
  ST[Student]
  CO[Courier]
  SS[Shop Staff]
  MG[Shop Manager]
  PG[Payment Gateway]
  SMS[SMS Gateway]
  LK[Smart Locker]
  P1((1.0 Place laundry order))
  P2((2.0 Collect bags))
  P3((3.0 Process laundry))
  P4((4.0 Deliver order))
  P5((5.0 Maintain services and report))
  P6((6.0 Cancel order))
  D1[(D1 Orders)]
  D2[(D2 Services and Prices)]
  D3[(D3 Payments)]
  D4[(D4 Bags)]
  ST -->|laundry order| P1
  P1 -->|order confirmation| ST
  P1 -->|payment request| PG
  PG -->|payment result| P1
  P1 -->|locker reservation| LK
  D2 -->|service price| P1
  P1 -->|new order| D1
  P1 -->|payment record| D3
  LK -->|locker event| P2
  CO -->|pick-up scan| P2
  D1 -->|orders to collect| P2
  P2 -->|pick-up list| CO
  P2 -->|bag record| D4
  P2 -->|collected status| D1
  D4 -->|bags to process| P3
  P3 -->|bag list| SS
  SS -->|bag weight| P3
  SS -->|ready notice| P3
  D2 -->|service price| P3
  P3 -->|weighed bag| D4
  P3 -->|order amount| D1
  D1 -->|ready orders| P4
  P4 -->|delivery list| CO
  CO -->|delivery confirmation| P4
  P4 -->|SMS message| SMS
  P4 -->|order status| ST
  ST -->|rating| P4
  P4 -->|delivered order| D1
  MG -->|service and price list| P5
  P5 -->|price list update| D2
  D3 -->|payments of the day| P5
  P5 -->|daily revenue report| MG
  ST -->|cancellation request| P6
  D1 -->|order to cancel| P6
  P6 -->|cancelled status| D1
  P6 -->|refund request| PG
  P6 -->|refund record| D3
`;

const GIAI_DD = [
  { element: 'Laundry Order', type: 'structure', composition: 'Order ID + Student ID + Service Code + Pick-up Slot + 1:5{Bag} + (Special Instructions) + Order Status', description: 'One request of a student to have laundry collected, cleaned and returned.' },
  { element: 'Order ID', type: 'primitive', dataType: 'alphanumeric', length: 8, values: '"SW" followed by 6 digits, e.g. SW000127', description: 'Unique identifier of a laundry order.' },
  { element: 'Student ID', type: 'primitive', dataType: 'alphanumeric', length: 8, values: 'university student code, e.g. SE180123', description: 'Identifies the student who placed the order.' },
  { element: 'Service Code', type: 'primitive', dataType: 'enumeration', length: 2, values: 'WF (Wash & Fold) | DC (Dry Clean) | IR (Ironing)', description: 'The one service chosen for the whole order.' },
  { element: 'Pick-up Slot', type: 'structure', composition: 'Pick-up Date + Pick-up Hour', description: 'When the courier will collect the bags from the locker.' },
  { element: 'Pick-up Date', type: 'primitive', dataType: 'date', length: 10, values: 'today to today + 7 days', description: 'Date of the pick-up.' },
  { element: 'Pick-up Hour', type: 'primitive', dataType: 'integer', length: 2, values: '8 to 20', description: 'Hour at which the pick-up slot starts.' },
  { element: 'Bag', type: 'structure', composition: 'Bag Barcode + (Weight)', description: 'One laundry bag; its weight is known only after the shop weighs it.' },
  { element: 'Bag Barcode', type: 'primitive', dataType: 'alphanumeric', length: 12, values: 'barcode printed on the bag', description: 'Identifies a physical bag when the courier scans it.' },
  { element: 'Weight', type: 'primitive', dataType: 'decimal', length: 4, values: '0.1 to 15.0 kg, one decimal', description: 'Weight of one bag measured by shop staff.' },
  { element: 'Special Instructions', type: 'primitive', dataType: 'text', length: 200, values: 'any text, at most 200 characters', description: 'Optional notes of the student for the shop.' },
  { element: 'Order Status', type: 'primitive', dataType: 'enumeration', length: 10, values: 'Placed | Collected | Ready | Delivered | Cancelled', description: 'Where the order is in its life.' },
];

/* ── kiểm data dictionary (tự chứa: phân tích biểu thức composition) ── */
function ddDoc() {
  if (typeof DATA_DICTIONARY === 'undefined' || !Array.isArray(DATA_DICTIONARY) || !DATA_DICTIONARY.length) return { loi: 'DATA_DICTIONARY is missing or empty' };
  var n = function (s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
  var ten = {};
  DATA_DICTIONARY.forEach(function (e) { if (e && e.element) ten[n(e.element)] = e; });
  function tach(comp) { // ⇒ [{ ten, tuyChon, lap:[m,n] | null }] hoặc chuỗi lỗi
    var out = [], phan = String(comp || '').split('+');
    for (var i = 0; i < phan.length; i++) {
      var t = phan[i].trim(), m;
      if (!t) return 'empty part in "' + comp + '"';
      if ((m = /^\(\s*([^(){}]+?)\s*\)$/.exec(t))) out.push({ ten: m[1], tuyChon: true, lap: null });
      else if ((m = /^(\d+)\s*:\s*(\d+|n)\s*\{\s*([^(){}]+?)\s*\}$/i.exec(t))) out.push({ ten: m[3], tuyChon: m[1] === '0', lap: [Number(m[1]), m[2].toLowerCase() === 'n' ? 'n' : Number(m[2])] });
      else if ((m = /^\{\s*([^(){}]+?)\s*\}$/.exec(t))) out.push({ ten: m[1], tuyChon: false, lap: [0, 'n'] });
      else if (/^[A-Za-z][\w .&'-]*$/.test(t)) out.push({ ten: t, tuyChon: false, lap: null });
      else return 'cannot read "' + t + '" — use A + B, (Optional), 1:5{Repeated}';
    }
    return out;
  }
  return { n: n, ten: ten, tach: tach };
}

const DD = ddDoc.toString();
const kiemDD = [
  kiemTuy({ en: 'C1 — every entry is a primitive or a structure written in Wiegers notation', vi: 'C1 — mỗi mục là primitive hoặc structure viết đúng ký pháp Wiegers' }, new Function(`var d = (${DD})(); if (d.loi) return d.loi;
    for (var i = 0; i < DATA_DICTIONARY.length; i++) {
      var e = DATA_DICTIONARY[i] || {};
      if (!e.element || String(e.description || '').trim().split(/\\s+/).length < 4) return 'entry ' + (i + 1) + ': needs an element name and a real description';
      if (e.type === 'structure') { var t = d.tach(e.composition); if (typeof t === 'string') return e.element + ': ' + t; }
      else if (e.type === 'primitive') { if (!e.dataType || (!e.length && !e.values)) return e.element + ': a primitive needs dataType and length or allowed values'; }
      else return e.element + ': type must be "primitive" or "structure"';
    }
    return 'OK';`), { nhom: 'f6' }),
  kiemTuy({ en: 'C1 — the dictionary is closed: every element used in a composition is defined', vi: 'C1 — từ điển khép kín: mọi phần tử dùng trong composition đều được định nghĩa' }, new Function(`var d = (${DD})(); if (d.loi) return d.loi;
    for (var i = 0; i < DATA_DICTIONARY.length; i++) {
      var e = DATA_DICTIONARY[i] || {};
      if (e.type !== 'structure') continue;
      var t = d.tach(e.composition); if (typeof t === 'string') return e.element + ': ' + t;
      for (var j = 0; j < t.length; j++) if (!d.ten[d.n(t[j].ten)]) return '"' + t[j].ten + '" is used in ' + e.element + ' but never defined — VI: dùng mà chưa định nghĩa';
    }
    return 'OK';`), { nhom: 'f6' }),
  kiemTuy({ en: 'C2 — Laundry Order: ID, student, service, slot, 1 to 5 bags (repeating group), optional instructions', vi: 'C2 — Laundry Order: mã, sinh viên, dịch vụ, khung giờ, 1 tới 5 túi (nhóm lặp), ghi chú tuỳ chọn' }, new Function(`var d = (${DD})(); if (d.loi) return d.loi;
    var e = d.ten['laundry order'] || d.ten['order'];
    if (!e || e.type !== 'structure') return 'define "Laundry Order" as a structure';
    var t = d.tach(e.composition); if (typeof t === 'string') return t;
    var co = function (re) { return t.filter(function (x) { return re.test(d.n(x.ten)); })[0]; };
    if (!co(/order id/) || !co(/student/) || !co(/service/) || !co(/slot|pick up/)) return 'Laundry Order must contain Order ID, Student ID, Service Code and the pick-up slot';
    var b = co(/bag/);
    if (!b || !b.lap) return 'bags repeat inside an order — write them as a repeating group m:n{Bag}';
    if (b.lap[0] !== 1 || b.lap[1] !== 5) return 'the case allows 1 to 5 bags per order — write 1:5{Bag}';
    var s = co(/instruction|note/);
    if (!s || !s.tuyChon) return 'special instructions are optional — write them in parentheses ( )';
    return 'OK';`), { nhom: 'f7' }),
  kiemTuy({ en: 'C2 — primitives carry the allowed values of the case (service codes, weight range, order ID format)', vi: 'C2 — primitive ghi đúng giá trị hợp lệ của đề (mã dịch vụ, khoảng cân nặng, dạng mã đơn)' }, new Function(`var d = (${DD})(); if (d.loi) return d.loi;
    var sc = d.ten['service code'] || d.ten['service'];
    if (!sc || !/wf/i.test(sc.values) || !/dc/i.test(sc.values) || !/ir/i.test(sc.values)) return 'Service Code: allowed values WF, DC, IR';
    var w = d.ten['weight'] || d.ten['bag weight'];
    if (!w || !/0\\.1/.test(String(w.values)) || !/15/.test(String(w.values)) || !/kg/i.test(String(w.values) + String(w.dataType) + String(w.description))) return 'Weight: 0.1 to 15.0 kg';
    var o = d.ten['order id'];
    if (!o || !/sw/i.test(String(o.values)) || !/6/.test(String(o.values) + ' ' + o.length)) return 'Order ID: "SW" followed by 6 digits';
    return 'OK';`), { nhom: 'f7' }),
  kiemTuy({ en: 'C2 — the weight is optional inside Bag (unknown until the shop weighs it)', vi: 'C2 — cân nặng là tuỳ chọn trong Bag (chưa biết tới khi tiệm cân)' }, new Function(`var d = (${DD})(); if (d.loi) return d.loi;
    var b = d.ten['bag']; if (!b || b.type !== 'structure') return 'define "Bag" as a structure';
    var t = d.tach(b.composition); if (typeof t === 'string') return t;
    var w = t.filter(function (x) { return /weight/.test(d.n(x.ten)); })[0];
    if (!w) return 'Bag contains its Weight';
    return w.tuyChon ? 'OK' : 'when the courier scans a bag its weight is not known yet — mark (Weight) optional';`), { nhom: 'f7', an: true }),
];

const MA_TRAN = [
  ['Register Account', { Student: 'C' }],
  ['Place Order', { Order: 'C', Service: 'R', Payment: 'C', Student: 'R' }],
  ['Collect Bags', { Order: 'U', Bag: 'C' }],
  ['Weigh Bag', { Order: 'U', Bag: 'U', Service: 'R' }],
  ['Deliver Order', { Order: 'U', Bag: 'R' }],
  ['Rate Order', { Order: 'R', Rating: 'C' }],
  ['Maintain Services', { Service: 'CRUD' }],
  ['View Daily Revenue', { Order: 'R', Payment: 'R' }],
  ['Update Profile', { Student: 'RU' }],
];
const THUC_THE = ['Student', 'Order', 'Bag', 'Service', 'Payment', 'Rating'];
const BANG_CRUD = bangHtml(['Use case', ...THUC_THE], MA_TRAN.map(([uc, o]) => [uc, ...THUC_THE.map((t) => o[t] || '')]));

const KIEM = [
  ...kiemNguCanh({
    bien: 'CONTEXT_DIAGRAM', nhom: { cuPhap: 'f1', thanhPhan: 'f2', luong: 'f2' },
    ngoai: [
      { ten: 'Student', khop: ['student'], can: ['vao', 'ra'] },
      { ten: 'Courier', khop: ['courier|driver|deliver'], can: ['vao', 'ra'] },
      { ten: 'Shop Staff', khop: ['shop staff|staff|washer|laundry staff'], can: ['vao', 'ra'] },
      { ten: 'Shop Manager', khop: ['manager|owner|admin'], can: ['vao', 'ra'] },
      { ten: 'Payment Gateway', khop: ['payment|gateway'], can: ['vao', 'ra'] },
      { ten: 'SMS Gateway', khop: ['sms|message|notif'], can: ['ra'] },
      { ten: 'Smart Locker', khop: ['locker'], can: ['vao', 'ra'] },
    ],
    cam: [{ ten: 'Bag / Order / Database', khop: ['^bag|^order|database|\\bdb\\b|laundry shop|^shop$'], lyDo: 'that is data or a place inside the business, not someone exchanging data with SwiftWash', lyDoVi: 'đó là dữ liệu hoặc nơi chốn, không phải ai đó trao đổi dữ liệu với SwiftWash' }],
  }),
  ...kiemDfd({
    bien: 'DFD', canBangVoi: 'CONTEXT_DIAGRAM', nhom: { cuPhap: 'f3', thanhPhan: 'f4', canBang: 'f5' },
    proc: [
      { ten: 'Place laundry order', khop: ['place|new order|create order|submit order|receive order'] },
      { ten: 'Collect bags', khop: ['collect|pick ?up'] },
      { ten: 'Process laundry (weigh, price)', khop: ['process|wash|weigh|clean|launder'] },
      { ten: 'Deliver order', khop: ['deliver|drop ?off'] },
      { ten: 'Maintain services / report revenue', khop: ['maintain|manage|service|price|report'] },
    ],
    kho: [
      { ten: 'Orders', khop: ['order'] }, { ten: 'Services and prices', khop: ['service|price'] },
      { ten: 'Payments', khop: ['payment|transaction'] }, { ten: 'Bags', khop: ['bag'] },
    ],
  }),
  ...kiemDD,
  ...kiemKhoa([
    { moTa: { en: 'D — entities created but never read by any other use case', vi: 'D — thực thể được tạo nhưng không use case nào khác đọc' }, bieuThuc: '(CRUD_GAPS.neverRead || []).map(String)', chap: [['Rating']], kieu: 'tap', nhom: 'f8' },
    { moTa: { en: 'D — the use case of the case that has no row in the matrix', vi: 'D — use case có trong đề nhưng thiếu dòng trong ma trận' }, bieuThuc: 'CRUD_GAPS.missingUseCase', chap: ['Cancel Order'], nhom: 'f8' },
    { moTa: { en: 'D — CRUD of the missing use case on Order', vi: 'D — CRUD của use case thiếu trên Order' }, bieuThuc: 'CRUD_GAPS.missingOnOrder', chap: ['U', 'RU', 'D', 'RD'], nhom: 'f8' },
    { moTa: { en: 'D — CRUD of the missing use case on Payment (the refund)', vi: 'D — CRUD của use case thiếu trên Payment (hoàn tiền)' }, bieuThuc: 'CRUD_GAPS.missingOnPayment', chap: ['C', 'U', 'RC', 'RU', 'CR'], nhom: 'f8' },
    { moTa: { en: 'D — the new requirement that closes the "never read" gap', vi: 'D — yêu cầu mới lấp khoảng trống "không ai đọc"' }, bieuThuc: 'CRUD_GAPS.newRequirement', chap: ['VIEW_RATINGS'], nhom: 'f8', an: true },
  ]),
];

const TEP = {
  'answers/a-context.js': [
    `// A. Context diagram of SwiftWash (Mermaid flowchart).\nconst CONTEXT_DIAGRAM = ´\nflowchart LR\n  S((SwiftWash))\n  ST[Student] -->|laundry order| S\n´;\n`,
    `// A. Seven external entities; one arrow per direction; labels = data.\nconst CONTEXT_DIAGRAM = ´${GIAI_CTX.replace(/\s+$/, '')}\n´;\n`,
  ],
  'answers/b-dfd-level0.js': [
    `// B. Level-0 DFD: numbered processes P1((1.0 …)), stores D1[(D1 …)], the same external entities and flows as YOUR context diagram.\nconst DFD = ´\nflowchart LR\n  ST[Student]\n  P1((1.0 Place laundry order))\n  D1[(D1 Orders)]\n  ST -->|laundry order| P1\n  P1 -->|new order| D1\n´;\n`,
    `// B. Six processes, four stores; every external flow copied from the context diagram (balancing); every store written and read.\nconst DFD = ´${GIAI_DFD.replace(/\s+$/, '')}\n´;\n`,
  ],
  'answers/c-data-dictionary.js': [
    `// C. Data dictionary (Wiegers Ch.13). structure: composition with  +  ( )  m:n{ }  ·  primitive: dataType, length, values.\nconst DATA_DICTIONARY = [\n  { element: 'Laundry Order', type: 'structure', composition: 'Order ID + …', description: '' },\n  { element: 'Order ID', type: 'primitive', dataType: '', length: 0, values: '', description: '' },\n];\n`,
    `// C. Closed dictionary: every element used in a composition is defined; 1:5{Bag}; (Special Instructions) and (Weight) optional.\nconst DATA_DICTIONARY = ${jsLit(GIAI_DD)};\n`,
  ],
  'answers/d-crud-gaps.js': [
    `// D. Gaps found with the CRUD matrix.\nconst CRUD_GAPS = {\n  neverRead: [],          // entities that are created but never read by another use case\n  missingUseCase: '',     // a use case of the case with no row in the matrix\n  missingOnOrder: '',     // its CRUD letters on Order\n  missingOnPayment: '',   // its CRUD letters on Payment\n  newRequirement: '',     // VIEW_RATINGS | DELETE_BAGS | EDIT_PAYMENT | PRINT_LABEL\n};\n`,
    `// D. Rating is created (Rate Order) and read by nobody; "cancel an order before pick-up and is refunded" has no row.\n${objDong('CRUD_GAPS', { neverRead: ['Rating'], missingUseCase: 'Cancel Order', missingOnOrder: 'RU', missingOnPayment: 'C', newRequirement: 'VIEW_RATINGS' }, { missingOnOrder: 'read the order, set its status to Cancelled', missingOnPayment: 'create the refund record', newRequirement: 'the manager must be able to read the ratings' })}`,
  ],
};

export default deLon({
  slug: 'swr302-4-lab-data-flow-swiftwash',
  ten: 'Lab 4B — Data & Flow Models: SwiftWash Campus Laundry',
  moTaModule: 'Lab chương 4B: context diagram, DFD mức 0 cân bằng với context của chính bạn (không hố đen/phép màu, kho có ghi có đọc), data dictionary ký pháp Wiegers kiểm khép kín, phân tích ma trận CRUD tìm yêu cầu thiếu.',
  baiHoc: 'swr302-4-2-domain-model-dfd',
  tieuDe: 'Lab 4B — Data & Flow Models: SwiftWash Campus Laundry',
  phu: { en: 'Chapter 4 lab · context diagram, level-0 DFD with balancing, data dictionary, CRUD gap analysis · 10 marks', vi: 'Lab chương 4 · context diagram, DFD mức 0 cân bằng, data dictionary, phân tích CRUD · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p><b>Part D input — the CRUD matrix the team wrote</b> (C create · R read · U update · D delete):</p>${BANG_CRUD}`,
    vi: `${BOI_CANH.vi}<p><b>Dữ liệu phần D — ma trận CRUD nhóm đã viết</b> (C tạo · R đọc · U sửa · D xoá): xem bảng ở bản tiếng Anh.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Draw the context diagram of SwiftWash.', vi: 'A. Vẽ sơ đồ ngữ cảnh của SwiftWash.' },
    { en: 'B. Decompose it into a level-0 DFD that balances with YOUR context diagram.', vi: 'B. Phân rã thành DFD mức 0 cân bằng với sơ đồ ngữ cảnh CỦA BẠN.' },
    { en: 'C. Write the data dictionary of a laundry order.', vi: 'C. Viết data dictionary của một đơn giặt.' },
    { en: 'D. Use the CRUD matrix to find missing requirements.', vi: 'D. Dùng ma trận CRUD tìm yêu cầu thiếu.' },
  ],
  yeuCauChung: [
    { en: 'Flow names are data (noun phrases). Use the same name for the same data everywhere — the grader compares names across your diagrams.', vi: 'Tên luồng là dữ liệu (cụm danh từ). Cùng một dữ liệu dùng cùng một tên ở mọi nơi — máy chấm so tên giữa các sơ đồ của bạn.' },
  ],
  cayThuMuc: `answers/
├── a-context.js          ← const CONTEXT_DIAGRAM = ´flowchart LR …´
├── b-dfd-level0.js       ← const DFD = ´flowchart LR …´        (P1((1.0 …)), D1[(D1 …)], E[…])
├── c-data-dictionary.js  ← const DATA_DICTIONARY = [ { element, type, composition | dataType+length+values, description } ]
└── d-crud-gaps.js        ← const CRUD_GAPS = { neverRead, missingUseCase, missingOnOrder, missingOnPayment, newRequirement }`,
  moHinh: {
    ten: 'Answer records',
    truong: [
      ['CONTEXT_DIAGRAM', 'string', CU_PHAP.context],
      ['DFD', 'string', CU_PHAP.dfd],
      ['DATA_DICTIONARY[i]', 'object', { en: 'structure: { element, type:"structure", composition:"A + B + (C) + 1:5{D}", description } · primitive: { element, type:"primitive", dataType, length, values, description }', vi: 'structure: composition dùng + ( ) m:n{ } · primitive: dataType, length, values' }],
      ['CRUD_GAPS', 'object', { en: 'letters as in the matrix (e.g. "RU"); newRequirement ∈ VIEW_RATINGS · DELETE_BAGS · EDIT_PAYMENT · PRINT_LABEL', vi: 'chữ cái như ma trận (vd "RU"); newRequirement chọn một mã' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1. Context diagram notation', vi: 'A1. Ký pháp sơ đồ ngữ cảnh' }, diem: 0.5, moTa: CU_PHAP.context, yeuCau: [{ en: 'One circle, rectangles, labelled one-way data flows.', vi: 'Một vòng tròn, hình chữ nhật, luồng dữ liệu một chiều có nhãn.' }], hook: ['context diagram'] },
    { ten: { en: 'A2. External entities', vi: 'A2. Thực thể ngoài' }, diem: 1.5, yeuCau: [{ en: 'All seven — four roles and three external systems — each with the directions the case describes.', vi: 'Đủ bảy — bốn vai trò và ba hệ thống ngoài — mỗi cái đúng chiều đề mô tả.' }], hook: ['external entity'] },
    { ten: { en: 'B1. DFD rules', vi: 'B1. Luật DFD' }, diem: 1.5, moTa: CU_PHAP.dfd, yeuCau: [{ en: 'Numbered verb-phrase processes; data only moves through a process; no black hole, no miracle; every store written and read.', vi: 'Process đánh số, tên động từ; dữ liệu chỉ đi qua process; không hố đen, không phép màu; kho nào cũng được ghi và đọc.' }], hook: ['DFD', 'black hole', 'miracle'] },
    { ten: { en: 'B2. Processes and stores', vi: 'B2. Process và kho' }, diem: 0.5, yeuCau: [{ en: 'The processes and stores the case needs.', vi: 'Đủ process và kho đề cần.' }], hook: ['data store'] },
    { ten: { en: 'B3. Balancing', vi: 'B3. Cân bằng' }, diem: 1, yeuCau: [{ en: 'Exactly the external flows of your context diagram — same names, same directions, nothing added or dropped.', vi: 'Đúng các luồng ngoài của sơ đồ ngữ cảnh của bạn — cùng tên, cùng chiều, không thêm không bớt.' }], hook: ['balancing'] },
    { ten: { en: 'C1. Dictionary notation and closure', vi: 'C1. Ký pháp và khép kín' }, diem: 1.5, yeuCau: [{ en: 'Primitives with type/length/values, structures in + ( ) m:n{ } notation, every referenced element defined.', vi: 'Primitive có kiểu/độ dài/giá trị, structure theo ký pháp + ( ) m:n{ }, mọi phần tử tham chiếu đều được định nghĩa.' }], hook: ['data dictionary'] },
    { ten: { en: 'C2. Dictionary content', vi: 'C2. Nội dung từ điển' }, diem: 1.5, yeuCau: [{ en: 'The order structure with 1:5 bags and optional instructions; the allowed values stated in the case.', vi: 'Cấu trúc đơn có 1:5 túi và ghi chú tuỳ chọn; giá trị hợp lệ như đề nêu.' }], hook: ['repeating group'] },
    { ten: { en: 'D. CRUD gap analysis', vi: 'D. Phân tích khoảng trống CRUD' }, diem: 2, yeuCau: [{ en: 'The entity nobody reads, the missing use case and its CRUD, the new requirement.', vi: 'Thực thể không ai đọc, use case thiếu và CRUD của nó, yêu cầu mới.' }], hook: ['CRUD matrix'] },
  ],
  idBatBuoc: [['CONTEXT_DIAGRAM', 'answers/a-context.js'], ['DFD', 'answers/b-dfd-level0.js'], ['DATA_DICTIONARY', 'answers/c-data-dictionary.js'], ['CRUD_GAPS', 'answers/d-crud-gaps.js']],
  truDiem: [
    { en: 'Renaming a flow in the DFD ("order" in the context, "laundry request" in the DFD): the levels no longer balance.', vi: 'Đổi tên luồng trong DFD ("order" ở context, "laundry request" ở DFD): hai mức không còn cân bằng.' },
    { en: 'An arrow from the Student straight into D1 Orders — data must pass through a process.', vi: 'Mũi tên từ Student thẳng vào D1 Orders — dữ liệu phải đi qua process.' },
    { en: 'A store that is written but never read (or the opposite).', vi: 'Kho được ghi mà không ai đọc (hoặc ngược lại).' },
    { en: 'Bag written as a single element of the order instead of a repeating group 1:5{Bag}.', vi: 'Viết Bag như một phần tử đơn của đơn thay vì nhóm lặp 1:5{Bag}.' },
  ],
  goiY: [
    'A: bảy thực thể ngoài — Student, Courier, Shop Staff, Shop Manager, Payment Gateway, SMS Gateway, Smart Locker. "Laundry shop" là nơi chốn, không phải thực thể.',
    'B: mỗi mũi tên ngoài của DFD phải trùng tên + chiều với một mũi tên của context. Mẹo: chép nguyên dòng "ST -->|laundry order| S" rồi đổi S thành process nhận nó.',
    'C: "1 to 5 bags" ⇒ 1:5{Bag}; "may add special instructions" ⇒ (Special Instructions); khi courier quét túi chưa biết cân nặng ⇒ (Weight).',
    'D: đọc theo CỘT: cột nào có C mà không dòng nào khác có R? Đọc đề tìm động từ không có dòng nào trong ma trận ("cancel … refunded").',
  ],
  loiHayGap: [
    'Vẽ process "1.0 Order" (danh từ) thay vì "1.0 Place laundry order" (động từ + tân ngữ).',
    'Kho dữ liệu tên số ít hoặc tên hành động ("Save order").',
    'Composition viết "Bags" (số nhiều) thay vì nhóm lặp 1:5{Bag}.',
    'Quên use case Cancel Order vì nó nằm ở câu cuối đoạn đề.',
  ],
  giaiThich: {
    en: `<p><b>Why this answer.</b> The context diagram has the seven parties of the case; the level-0 DFD keeps every one of those external flows with the same name and direction (balancing) and adds the stores the processes need. Every store is written by one process and read by another. In the dictionary, the order contains a repeating group of 1 to 5 bags and optional instructions; a bag's weight is optional because it is unknown when the courier scans it. The CRUD matrix shows Rating created and never read (missing "view ratings"), and "cancel an order … refunded" has no row: Cancel Order reads/updates the order and creates a refund payment record.</p>${khoiThamChieu('luong', GIAI_CTX, 'Context diagram — SwiftWash')}${khoiThamChieu('luong', GIAI_DFD, 'Level-0 DFD — SwiftWash')}`,
    vi: `<p><b>Vì sao đáp án như vậy.</b> Sơ đồ ngữ cảnh có bảy bên của đề; DFD mức 0 giữ nguyên mọi luồng ngoài đó cùng tên, cùng chiều (cân bằng) và thêm các kho mà process cần. Kho nào cũng được một process ghi và process khác đọc. Trong từ điển, đơn chứa nhóm lặp 1 tới 5 túi và ghi chú tuỳ chọn; cân nặng của túi là tuỳ chọn vì lúc courier quét chưa biết. Ma trận CRUD cho thấy Rating được tạo mà không ai đọc (thiếu "xem đánh giá"), và "huỷ đơn … được hoàn tiền" không có dòng nào: Cancel Order đọc/cập nhật đơn và tạo bản ghi hoàn tiền.</p>${khoiThamChieu('luong', GIAI_CTX, 'Context diagram — SwiftWash')}${khoiThamChieu('luong', GIAI_DFD, 'Level-0 DFD — SwiftWash')}`,
  },
  khaiNiem: ['context diagram', 'data flow diagram', 'balancing', 'data dictionary', 'CRUD matrix'],
  tienQuyet: ['SWR302 lesson 4.2 (domain model, data dictionary & DFD)', 'LAB L.2, L.5'],
  thuatNgu: [...tn('contextDiagram', 'dfd', 'dataStore', 'blackHole', 'balancing', 'dataDictionary', 'crud', 'externalEntity', 'dataFlow')],
  moTaNgan: 'Lab chương 4B: SwiftWash — context, DFD mức 0, data dictionary, CRUD.',
  phut: 80,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'DFD đổi tên luồng + Student ghi thẳng vào kho + kho chỉ ghi', tep: { 'answers/b-dfd-level0.js': `const DFD = \`${GIAI_DFD.replace('ST -->|laundry order| P1', 'ST -->|laundry request| P1').replace('P5 -->|daily revenue report| MG', 'P5 -->|daily revenue report| MG\n  ST -->|profile| D1').replace('D3 -->|payments of the day| P5', '')}\`;\n` }, phaiTruot: ['data only moves THROUGH a process', 'balanced with YOUR context diagram', 'every store is both written and read'] },
    { ten: 'từ điển không khép kín, Bag không lặp, ghi chú bắt buộc', tep: { 'answers/c-data-dictionary.js': `const DATA_DICTIONARY = ${jsLit([{ element: 'Laundry Order', type: 'structure', composition: 'Order ID + Student ID + Service Code + Pick-up Slot + Bags + Special Instructions', description: 'One order of a student.' }, ...GIAI_DD.slice(1)])};\n` }, phaiTruot: ['the dictionary is closed', 'Laundry Order: ID'] },
  ],
});
