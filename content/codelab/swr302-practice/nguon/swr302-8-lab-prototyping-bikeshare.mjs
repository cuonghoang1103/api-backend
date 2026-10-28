/**
 * SWR302 · LAB 8 — Prototyping and the step to design: CampusBike bike-sharing (Wiegers Ch.15 + LAB L.6 dialog map + OO design).
 * A. loại prototype (phạm vi · tương lai · hình thức) · B. dialog map (Mermaid stateDiagram — trạng thái = màn hình) ·
 * C. review wireframe so với yêu cầu · D. rủi ro & yếu tố thành công của prototyping · E. phân tích danh từ/động từ ⇒ lớp, thuộc tính, thao tác.
 */
import { CU_PHAP, tn, kiemTuy, kiemKhoa, preMa } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';
import { kiemState } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const KICH_BAN = [
  ['S1', 'Check whether unlocking a bike over Bluetooth in under 3 seconds is technically possible with the lock vendor’s SDK. (scope?)', ['PROOF_OF_CONCEPT']],
  ['S2', 'Show students what the rental screens could look like at tomorrow’s focus group; quick sketches are enough. (form?)', ['PAPER']],
  ['S3', 'The prototype will be grown step by step into the real app, with production-quality code from the first day. (future?)', ['EVOLUTIONARY']],
  ['S4', 'Try three layouts of the map screen in one afternoon and keep only the idea of the best one. (future?)', ['THROWAWAY']],
  ['S5', 'A clickable Figma prototype of every screen, tested with 8 students on their phones. (form?)', ['ELECTRONIC']],
  ['S6', 'Show the whole flow of screens with fake data and no back end at all. (scope?)', ['MOCK_UP']],
];
const GIAI_DIALOG = `
stateDiagram-v2
  [*] --> SignIn : open app
  state "Sign In" as SignIn
  state "Station Map" as Map
  state "Bike Details" as BikeDetails
  state "Confirm Rental" as ConfirmRental
  state "Payment Failed" as PaymentFailed
  state "Ride In Progress" as Ride
  state "Return Summary" as ReturnSummary
  state "My Rentals" as MyRentals
  state "Rental Detail" as RentalDetail
  SignIn --> Map : sign in [credentials valid]
  Map --> BikeDetails : tap a bike
  BikeDetails --> Map : back
  BikeDetails --> ConfirmRental : tap Rent
  ConfirmRental --> Map : cancel
  ConfirmRental --> Ride : confirm [payment authorised]
  ConfirmRental --> PaymentFailed : confirm [payment declined]
  PaymentFailed --> ConfirmRental : try another card
  PaymentFailed --> Map : give up
  Ride --> ReturnSummary : bike locked at a station
  ReturnSummary --> Map : done
  Map --> MyRentals : tap My rentals
  MyRentals --> RentalDetail : tap a rental
  RentalDetail --> MyRentals : back
  MyRentals --> Map : back
  Map --> Profile : tap Profile
  Profile --> Map : back
  Profile --> SignIn : sign out
`;
const WIRE = `+--------------------------------------------+
|  < Back            Confirm rental          |
|--------------------------------------------|
|  Bike #B-117   (e-bike)                    |
|  Station: Library Gate                     |
|  Price: 5,000 VND per 30 minutes           |
|  Pay with: Campus e-wallet  ****2231  [v]  |
|                                            |
|  [ Cancel ]                 [ Confirm ]    |
+--------------------------------------------+`;
const YC = [
  ['FR-21', 'The Confirm Rental screen shall show the price per 30 minutes.'],
  ['FR-22', 'The Confirm Rental screen shall show the battery level of an e-bike.'],
  ['FR-23', 'The Confirm Rental screen shall offer a Cancel action that returns to the Station Map.'],
  ['FR-24', 'The Confirm Rental screen shall show the latest time by which the bike must be returned (22:00).'],
  ['FR-25', 'The Confirm Rental screen shall show the payment method that will be charged.'],
];
const RUI_RO = [
  ['R1', 'Stakeholders who see a polished prototype may push to release it as the product.', 'TRUE'],
  ['R2', 'A throwaway prototype should include full input validation and defensive coding.', 'FALSE'],
  ['R3', 'Users may expect the final system to be as fast as a prototype that has no real back end.', 'TRUE'],
  ['R4', 'A prototype can replace the written requirements once users like it.', 'FALSE'],
  ['R5', 'Prototype the parts of the system that are uncertain, not the requirements you already understand.', 'TRUE'],
  ['R6', 'Use plausible data in the prototype so users react to realistic screens.', 'TRUE'],
];
const TU = [
  ['W1', 'member', 'CLASS'], ['W2', 'bike', 'CLASS'], ['W3', 'station', 'CLASS'], ['W4', 'rental', 'CLASS'],
  ['W5', 'start time', 'ATTRIBUTE'], ['W6', 'battery level', 'ATTRIBUTE'], ['W7', 'fee', 'ATTRIBUTE'],
  ['W8', 'unlock', 'OPERATION'], ['W9', 'compute the fee', 'OPERATION'],
];

const KIEM = [
  ...kiemBang('PROTOTYPES', Object.fromEntries(KICH_BAN.map((x) => [x[0], x[2]])), { nhom: 'f1', ten: (k) => `A — prototype dimension asked in ${k}`, tenVi: (k) => `A — chiều prototype được hỏi trong ${k}` }),
  ...kiemState({
    bien: 'DIALOG_MAP', tenDoiTuong: 'the screen', kiemTen: false, canCuoi: false, nhom: { cuPhap: 'f2', thanhPhan: 'f3', chuyen: 'f3' }, toiThieu: 8,
    st: [
      { ten: 'Sign In', khop: ['sign ?in|log ?in'] }, { ten: 'Station Map / Home', khop: ['map|home'] }, { ten: 'Bike Details', khop: ['bike|detail'] },
      { ten: 'Confirm Rental', khop: ['confirm'] }, { ten: 'Payment Failed', khop: ['fail|declin|error'] }, { ten: 'Ride In Progress', khop: ['ride|riding|in progress|active'] },
      { ten: 'Return Summary', khop: ['return|summary|receipt'] }, { ten: 'My Rentals', khop: ['my rental|history|rentals'] },
    ],
    ch: [
      { ten: 'confirm with payment authorised ⇒ ride (guard)', tenVi: 'xác nhận và thanh toán được duyệt ⇒ đang đi (guard)', tu: ['confirm'], den: ['ride|riding|in progress|active'], guard: true, lyDo: 'two arrows leave Confirm Rental on the same action — the payment result decides', lyDoVi: 'hai mũi tên rời Confirm Rental cùng một thao tác — kết quả thanh toán quyết định' },
      { ten: 'payment declined ⇒ error screen (guard)', tenVi: 'thanh toán bị từ chối ⇒ màn hình lỗi (guard)', tu: ['confirm'], den: ['fail|declin|error'], guard: true, lyDo: 'show the unhappy path', lyDoVi: 'vẽ đường không thuận' },
      { ten: 'cancel on Confirm Rental returns to the map (FR-23)', tenVi: 'Cancel ở Confirm Rental quay về bản đồ (FR-23)', tu: ['confirm'], den: ['map|home'], suKien: ['cancel|back'] },
      { ten: 'bike locked at a station ⇒ return summary', tenVi: 'khoá xe ở trạm ⇒ tóm tắt lượt trả', tu: ['ride|riding|in progress|active'], den: ['return|summary|receipt'] },
    ],
  }).map((k) => ({ ...k, moTa: { en: k.moTa.en.replace(/^State diagram/, 'Dialog map').replace(/^Transition/, 'Navigation').replace('states are', 'screens are').replace(' — valid syntax; one initial pseudostate, at least one final state', ' — valid syntax; one initial screen'), vi: k.moTa.vi.replace(/^Sơ đồ trạng thái/, 'Dialog map').replace(/^Chuyển trạng thái/, 'Điều hướng') } })),
  kiemTuy({ en: 'Dialog map — no dead end: from every screen the user can get back to the Station Map', vi: 'Dialog map — không ngõ cụt: từ mọi màn hình người dùng quay về được Station Map' }, function () {
    if (typeof DIALOG_MAP !== 'string') return 'DIALOG_MAP is missing';
    var ch = [], ten = {};
    String(DIALOG_MAP).split('\n').forEach(function (d) {
      d = d.trim();
      var m = /^state\s+"([^"]+)"\s+as\s+(\w+)/.exec(d);
      if (m) { ten[m[2]] = m[1]; return; }
      m = /^(\[\*\]|\w+)\s*-+>\s*(\[\*\]|\w+)/.exec(d);
      if (m) ch.push([m[1], m[2]]);
    });
    var nhan = function (id) { return String(ten[id] || id).toLowerCase(); };
    var map = Object.keys(ten).concat(ch.map(function (c) { return c[0]; }), ch.map(function (c) { return c[1]; })).filter(function (id) { return /map|home/.test(nhan(id)); })[0];
    if (!map) return 'no Station Map / Home screen';
    var ds = {};
    ch.forEach(function (c) { if (c[0] !== '[*]') ds[c[0]] = 1; if (c[1] !== '[*]') ds[c[1]] = 1; });
    var ve = function (tu) { var thay = {}, hang = [tu]; for (var i = 0; i < hang.length; i++) ch.forEach(function (c) { if (c[0] === hang[i] && !thay[c[1]]) { thay[c[1]] = 1; hang.push(c[1]); } }); return !!thay[map] || tu === map; };
    var cut = Object.keys(ds).filter(function (id) { return !/sign ?in|log ?in/.test(nhan(id)) && !ve(id); });
    return cut.length ? 'no way back to the map from: ' + cut.map(nhan).join(', ') : 'OK';
  }, { nhom: 'f3' }),
  kiemKhoa([{ moTa: { en: 'C — requirements the wireframe does NOT satisfy', vi: 'C — yêu cầu wireframe CHƯA đáp ứng' }, bieuThuc: '(WIREFRAME_GAPS || []).map(String)', chap: [['FR-22', 'FR-24']], kieu: 'tap', nhom: 'f4', goiY: 'read every line of the wireframe against each requirement' }])[0],
  ...kiemBang('PROTOTYPING_TRUTHS', Object.fromEntries(RUI_RO.map((x) => [x[0], x[2]])), { nhom: 'f5', ten: (k) => `D — statement ${k}`, tenVi: (k) => `D — phát biểu ${k}` }),
  ...kiemBang('DESIGN_CANDIDATES', Object.fromEntries(TU.map((x) => [x[0], x[2]])), { nhom: 'f6', an: ['W9'], ten: (k) => `E — ${k}: class, attribute or operation`, tenVi: (k) => `E — ${k}: lớp, thuộc tính hay thao tác` }),
];

const TEP = {
  'answers/a-prototypes.js': [`// A. Answer the dimension asked in brackets: MOCK_UP | PROOF_OF_CONCEPT (scope) · THROWAWAY | EVOLUTIONARY (future) · PAPER | ELECTRONIC (form)\n${objTrong('PROTOTYPES', Object.fromEntries(KICH_BAN.map((x) => [x[0], ''])))}`, `// A. Mock-up = horizontal (screens, no depth); proof of concept = vertical (one slice, real technology).\n${objDong('PROTOTYPES', Object.fromEntries(KICH_BAN.map((x) => [x[0], x[2][0]])))}`],
  'answers/b-dialog-map.js': [`// B. Dialog map: states are SCREENS, transitions are USER ACTIONS (Mermaid stateDiagram-v2).\nconst DIALOG_MAP = ´\nstateDiagram-v2\n  [*] --> SignIn\n  state "Sign In" as SignIn\n´;\n`, `// B. Every screen has a way back to the map; the payment result splits Confirm Rental with guards.\nconst DIALOG_MAP = ´${GIAI_DIALOG.replace(/\s+$/, '')}\n´;\n`],
  'answers/c-wireframe.js': ["// C. IDs of the requirements the wireframe does not satisfy.\nconst WIREFRAME_GAPS = [];\n", "// C. No battery level for the e-bike (FR-22) and no return deadline (FR-24).\nconst WIREFRAME_GAPS = ['FR-22', 'FR-24'];\n"],
  'answers/d-truths.js': [`// D. TRUE | FALSE\n${objTrong('PROTOTYPING_TRUTHS', Object.fromEntries(RUI_RO.map((x) => [x[0], ''])))}`, `// D. Wiegers Ch.15: risks and success factors of prototyping.\n${objDong('PROTOTYPING_TRUTHS', Object.fromEntries(RUI_RO.map((x) => [x[0], x[2]])))}`],
  'answers/e-design.js': [`// E. CLASS | ATTRIBUTE | OPERATION\n${objTrong('DESIGN_CANDIDATES', Object.fromEntries(TU.map((x) => [x[0], ''])))}`, `// E. Nouns that have their own identity and behaviour ⇒ classes; nouns that describe them ⇒ attributes; verbs ⇒ operations.\n${objDong('DESIGN_CANDIDATES', Object.fromEntries(TU.map((x) => [x[0], x[2]])))}`],
};

export default deLon({
  slug: 'swr302-8-lab-prototyping-bikeshare',
  ten: 'Lab 8 — Prototyping and Design: CampusBike',
  moTaModule: 'Lab chương 8: chọn loại prototype (mock-up/proof of concept, throwaway/evolutionary, giấy/điện tử), dialog map các màn hình thuê xe có guard và không ngõ cụt, review wireframe so với yêu cầu, rủi ro và yếu tố thành công của prototyping, phân tích danh từ/động từ thành lớp, thuộc tính, thao tác.',
  baiHoc: 'swr302-8-1-oo-design-prototyping',
  tieuDe: 'Lab 8 — Prototyping and Design: CampusBike',
  phu: { en: 'Chapter 8 lab · kinds of prototypes, dialog map, wireframe review, prototyping risks, from requirements to classes · 10 marks', vi: 'Lab chương 8 · loại prototype, dialog map, review wireframe, rủi ro prototyping, từ yêu cầu tới lớp · 10 điểm' },
  moTa: {
    en: `<p><b>CampusBike</b> rents bicycles and e-bikes from stations around the campus. A member signs in, sees a map of stations, opens a bike's details, confirms the rental (the e-wallet is charged when the bike is unlocked), rides, and locks the bike at any station to end the rental; the app then shows a return summary. From the map the member can also open <i>My rentals</i> (and the detail of each) and the <i>Profile</i> screen, where they can sign out. If the payment is declined, an error screen lets the member try another card or give up.</p>
<p><b>A. Prototyping decisions</b> — answer the dimension asked in brackets:</p><ul>${KICH_BAN.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>
<p><b>B.</b> Draw the <b>dialog map</b> of the app: one state per screen, one transition per user action (or system result), guards where an action can lead to two screens.</p>
<p><b>C. Wireframe of the Confirm Rental screen</b>:</p>${preMa(WIRE)}<ul>${YC.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>
<p><b>D. Statements about prototyping</b>:</p><ul>${RUI_RO.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>
<p><b>E.</b> Requirement: "A <u>member</u> <u>unlocks</u> a <u>bike</u> at a <u>station</u>; the system records the <u>start time</u> of the <u>rental</u>, shows the <u>battery level</u> of an e-bike and <u>computes the fee</u> when the bike is returned." Classify W1–W9: ${TU.map((x) => `<b>${x[0]}</b> ${x[1]}`).join(' · ')}.</p>`,
    vi: `<p><b>CampusBike</b> cho thuê xe đạp và xe điện ở các trạm trong khuôn viên. Hội viên đăng nhập, xem bản đồ trạm, mở chi tiết xe, xác nhận thuê (ví điện tử bị trừ khi mở khoá), đi xe, và khoá xe ở trạm bất kỳ để kết thúc; app hiện tóm tắt lượt trả. Từ bản đồ còn mở được <i>My rentals</i> (và chi tiết từng lượt) và <i>Profile</i> (đăng xuất ở đó). Thanh toán bị từ chối ⇒ màn hình lỗi cho thử thẻ khác hoặc bỏ cuộc.</p>
<p><b>A.</b> Sáu quyết định prototype S1–S6 — trả lời đúng chiều được hỏi trong ngoặc. <b>B.</b> Vẽ <b>dialog map</b>: mỗi màn hình một trạng thái, mỗi thao tác một chuyển, có guard khi một thao tác dẫn tới hai màn hình. <b>C.</b> Đối chiếu wireframe với FR-21…FR-25. <b>D.</b> Sáu phát biểu về prototyping: đúng/sai. <b>E.</b> Phân loại W1–W9 thành lớp, thuộc tính hay thao tác.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Kinds of prototypes.', vi: 'A. Loại prototype.' },
    { en: 'B. The dialog map of the app.', vi: 'B. Dialog map của app.' },
    { en: 'C. Wireframe review against the requirements.', vi: 'C. Review wireframe so với yêu cầu.' },
    { en: 'D. Prototyping risks and success factors.', vi: 'D. Rủi ro và yếu tố thành công của prototyping.' },
    { en: 'E. From requirements to design candidates.', vi: 'E. Từ yêu cầu tới ứng viên thiết kế.' },
  ],
  yeuCauChung: [{ en: 'In a dialog map, states are screens (a screen may be named with a verb, e.g. "Confirm Rental"); transitions are what the user does.', vi: 'Trong dialog map, trạng thái là màn hình (tên màn hình có thể là động từ, vd "Confirm Rental"); chuyển là việc người dùng làm.' }],
  cayThuMuc: `answers/
├── a-prototypes.js   ← const PROTOTYPES = { S1: '…', … }
├── b-dialog-map.js   ← const DIALOG_MAP = ´stateDiagram-v2 …´
├── c-wireframe.js    ← const WIREFRAME_GAPS = ['FR-…']
├── d-truths.js       ← const PROTOTYPING_TRUTHS = { R1: 'TRUE' | 'FALSE', … }
└── e-design.js       ← const DESIGN_CANDIDATES = { W1: 'CLASS' | 'ATTRIBUTE' | 'OPERATION', … }`,
  moHinh: {
    ten: 'Answer records',
    truong: [
      ['PROTOTYPES.*', 'string', { en: 'MOCK_UP · PROOF_OF_CONCEPT · THROWAWAY · EVOLUTIONARY · PAPER · ELECTRONIC', vi: 'MOCK_UP · PROOF_OF_CONCEPT · THROWAWAY · EVOLUTIONARY · PAPER · ELECTRONIC' }],
      ['DIALOG_MAP', 'string', CU_PHAP.state],
      ['WIREFRAME_GAPS', 'string[]', { en: 'IDs FR-21…FR-25', vi: 'mã FR-21…FR-25' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Kinds of prototypes', vi: 'A. Loại prototype' }, diem: 1.5, yeuCau: [{ en: 'Scope, future and form of each prototype.', vi: 'Phạm vi, tương lai và hình thức của từng prototype.' }], hook: ['mock-up', 'proof of concept'] },
    { ten: { en: 'B1. Dialog map notation', vi: 'B1. Ký pháp dialog map' }, diem: 1, moTa: CU_PHAP.state, yeuCau: [{ en: 'One start screen, labelled navigations, every screen reachable.', vi: 'Một màn hình đầu, điều hướng có nhãn, màn hình nào cũng tới được.' }], hook: ['dialog map'] },
    { ten: { en: 'B2. Screens and navigation of the case', vi: 'B2. Màn hình và điều hướng của đề' }, diem: 2.5, yeuCau: [{ en: 'The screens of the case, the guarded payment result, no dead end.', vi: 'Đủ màn hình, kết quả thanh toán có guard, không ngõ cụt.' }], hook: ['navigation'] },
    { ten: { en: 'C. Wireframe review', vi: 'C. Review wireframe' }, diem: 1.5, yeuCau: [{ en: 'The requirements the wireframe misses.', vi: 'Yêu cầu wireframe bỏ sót.' }], hook: ['wireframe'] },
    { ten: { en: 'D. Prototyping risks', vi: 'D. Rủi ro prototyping' }, diem: 1.5, yeuCau: [{ en: 'True or false, per Wiegers Ch.15.', vi: 'Đúng hay sai theo Wiegers Ch.15.' }], hook: ['throwaway vs evolutionary'] },
    { ten: { en: 'E. Design candidates', vi: 'E. Ứng viên thiết kế' }, diem: 2, yeuCau: [{ en: 'Classes, attributes, operations from nouns and verbs.', vi: 'Lớp, thuộc tính, thao tác từ danh từ và động từ.' }], hook: ['noun/verb analysis'] },
  ],
  idBatBuoc: [['PROTOTYPES', 'answers/a-prototypes.js'], ['DIALOG_MAP', 'answers/b-dialog-map.js'], ['WIREFRAME_GAPS', 'answers/c-wireframe.js'], ['PROTOTYPING_TRUTHS', 'answers/d-truths.js'], ['DESIGN_CANDIDATES', 'answers/e-design.js']],
  truDiem: [
    { en: 'A dialog map with a screen you cannot leave (Payment Failed with no way back).', vi: 'Dialog map có màn hình không thoát được (Payment Failed không có đường về).' },
    { en: 'Two arrows from Confirm Rental on "confirm" with no guard.', vi: 'Hai mũi tên rời Confirm Rental cùng "confirm" mà không có guard.' },
    { en: 'Treating a liked prototype as the requirements — the SRS is still needed.', vi: 'Coi prototype được thích là đủ yêu cầu — vẫn cần SRS.' },
  ],
  goiY: [
    'A: proof of concept = một lát cắt dọc dùng công nghệ thật để thử tính khả thi; mock-up = cắt ngang, chỉ giao diện.',
    'B: liệt kê màn hình trước (Sign In, Station Map, Bike Details, Confirm Rental, Payment Failed, Ride In Progress, Return Summary, My Rentals, Rental Detail, Profile), rồi mỗi nút bấm một mũi tên.',
    'E: danh từ có danh tính riêng và hành vi ⇒ lớp; danh từ mô tả một lớp ⇒ thuộc tính; động từ ⇒ thao tác.',
  ],
  loiHayGap: [
    'Coi prototype bằng Figma là proof of concept — nó là mock-up điện tử.',
    'Xếp "fee" thành lớp — nó là một thuộc tính (của Rental) được tính ra.',
    'Bỏ sót FR-24 vì wireframe trông "đủ".',
  ],
  giaiThich: {
    en: `<p><b>A.</b> S1 proof of concept · S2 paper · S3 evolutionary · S4 throwaway · S5 electronic · S6 mock-up. <b>C.</b> FR-22 (battery level) and FR-24 (return deadline) are missing. <b>D.</b> R1, R3, R5, R6 true; R2, R4 false. <b>E.</b> Member, bike, station, rental are classes; start time, battery level, fee are attributes; unlock and compute the fee are operations.</p>${khoiThamChieu('state', GIAI_DIALOG, 'Dialog map — CampusBike', { __dau: [60, 90], SignIn: [180, 200], Map: [420, 200], BikeDetails: [420, 40], ConfirmRental: [660, 40], PaymentFailed: [880, 120], Ride: [880, 260], ReturnSummary: [660, 340], MyRentals: [420, 400], RentalDetail: [660, 480], Profile: [180, 400] })}`,
    vi: `<p><b>A.</b> S1 proof of concept · S2 giấy · S3 tiến hoá · S4 bỏ đi · S5 điện tử · S6 mock-up. <b>C.</b> Thiếu FR-22 (mức pin) và FR-24 (hạn trả xe). <b>D.</b> R1, R3, R5, R6 đúng; R2, R4 sai. <b>E.</b> Member, bike, station, rental là lớp; start time, battery level, fee là thuộc tính; unlock và compute the fee là thao tác.</p>${khoiThamChieu('state', GIAI_DIALOG, 'Dialog map — CampusBike', { __dau: [60, 90], SignIn: [180, 200], Map: [420, 200], BikeDetails: [420, 40], ConfirmRental: [660, 40], PaymentFailed: [880, 120], Ride: [880, 260], ReturnSummary: [660, 340], MyRentals: [420, 400], RentalDetail: [660, 480], Profile: [180, 400] })}`,
  },
  khaiNiem: ['prototyping', 'mock-up vs proof of concept', 'throwaway vs evolutionary', 'dialog map', 'wireframe', 'noun/verb analysis'],
  tienQuyet: ['SWR302 lessons 8.1–8.4', 'LAB L.6 (dialog maps)'],
  thuatNgu: [...tn('prototype', 'dialogMap', 'wireframe', 'guard'), { en: 'mock-up (horizontal prototype)', vi: 'prototype ngang — chỉ giao diện, không chiều sâu' }, { en: 'proof of concept (vertical prototype)', vi: 'prototype dọc — một lát cắt chạy thật qua mọi tầng để thử khả thi' }, { en: 'throwaway / evolutionary', vi: 'bỏ đi sau khi học được / phát triển dần thành sản phẩm' }],
  moTaNgan: 'Lab chương 8: CampusBike — loại prototype, dialog map, wireframe, rủi ro, lớp/thuộc tính/thao tác.',
  phut: 50,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'dialog map ngõ cụt + không guard', tep: { 'answers/b-dialog-map.js': 'const DIALOG_MAP = `\nstateDiagram-v2\n  [*] --> SignIn\n  state "Sign In" as SignIn\n  state "Station Map" as Map\n  state "Confirm Rental" as ConfirmRental\n  state "Payment Failed" as PaymentFailed\n  state "Ride In Progress" as Ride\n  SignIn --> Map : sign in\n  Map --> ConfirmRental : rent\n  ConfirmRental --> Ride : confirm\n  ConfirmRental --> PaymentFailed : confirm\n  Ride --> Map : lock bike\n  PaymentFailed --> PaymentFailed : retry\n`;\n' }, phaiTruot: ['no dead end', 'payment authorised'] },
    { ten: 'Figma là proof of concept, fee là lớp', tep: { 'answers/a-prototypes.js': objDong('PROTOTYPES', { S1: 'PROOF_OF_CONCEPT', S2: 'PAPER', S3: 'EVOLUTIONARY', S4: 'THROWAWAY', S5: 'PROOF_OF_CONCEPT', S6: 'MOCK_UP' }), 'answers/e-design.js': objDong('DESIGN_CANDIDATES', { ...Object.fromEntries(TU.map((x) => [x[0], x[2]])), W7: 'CLASS' }) }, phaiTruot: ['asked in S5', 'W7: class'] },
  ],
});
