/**
 * SWR302 · 4.2 — Use case anatomy: actors, flows, «include», «extend», generalization (Wiegers Ch.8 slides 12–24).
 */
import { tn, CU_PHAP } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';
import { kiemUseCase } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const E1 = tracNghiem({
  tieuDe: 'Use case anatomy 1 — «include» or «extend»?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p><b>«include»</b>: the base use case ALWAYS uses the included one (shared behaviour factored out); the arrow goes from the base to the included use case. <b>«extend»</b>: optional or conditional behaviour inserted into the base use case at an extension point; the arrow goes from the extension to the base.</p>', vi: '<p><b>«include»</b>: use case gốc LUÔN dùng use case được gộp (hành vi chung tách ra); mũi tên đi từ gốc tới use case được gộp. <b>«extend»</b>: hành vi tuỳ chọn hoặc có điều kiện chèn vào use case gốc tại điểm mở rộng; mũi tên đi từ use case mở rộng tới gốc.</p>' },
  cau: [
    { en: 'Every time a patient books an appointment, the system authenticates the patient. Booking ___ Authenticate.', vi: 'Mỗi lần đặt lịch, hệ thống xác thực bệnh nhân. Booking ___ Authenticate.', lc: [['a', '«include»'], ['b', '«extend»'], ['c', 'generalization'], ['d', 'association']], dap: 'a', giai: ['Always ⇒ include.', 'Luôn luôn ⇒ include.'] },
    { en: 'A patient MAY add a referral letter when booking. Attach Referral ___ Book Appointment.', vi: 'Bệnh nhân CÓ THỂ đính kèm giấy giới thiệu khi đặt lịch. Attach Referral ___ Book Appointment.', lc: [['a', '«include»'], ['b', '«extend»'], ['c', 'generalization'], ['d', 'nothing']], dap: 'b', giai: ['Optional ⇒ extend, arrow from Attach Referral to Book Appointment.', 'Tuỳ chọn ⇒ extend, mũi tên từ Attach Referral tới Book Appointment.'] },
    { en: 'In PlantUML, which line is correct for "Book Appointment always includes Pay Deposit"?', vi: 'Trong PlantUML, dòng nào đúng cho "Book Appointment luôn gộp Pay Deposit"?', lc: [['a', 'Book ..> Pay : &lt;&lt;include&gt;&gt;'], ['b', 'Pay ..> Book : &lt;&lt;include&gt;&gt;'], ['c', 'Book --> Pay'], ['d', 'Pay ..> Book : &lt;&lt;extend&gt;&gt;']], dap: 'a', giai: ['Base → included, dashed.', 'Gốc → được gộp, nét đứt.'] },
    { en: 'A late-cancellation fee is charged only when a patient cancels less than 24 h before. Which is right?', vi: 'Phí huỷ muộn chỉ thu khi bệnh nhân huỷ trong vòng 24 giờ trước. Cái nào đúng?', lc: [['a', 'Cancel Appointment ..> Charge Late Fee : &lt;&lt;include&gt;&gt;'], ['b', 'Charge Late Fee ..> Cancel Appointment : &lt;&lt;extend&gt;&gt;'], ['c', 'Charge Late Fee ..> Cancel Appointment : &lt;&lt;include&gt;&gt;'], ['d', 'Cancel Appointment ..> Charge Late Fee : &lt;&lt;extend&gt;&gt;']], dap: 'b', giai: ['Conditional ⇒ extend, from the extension to the base.', 'Có điều kiện ⇒ extend, từ use case mở rộng tới gốc.'] },
    { en: 'Can «include» connect an actor to a use case?', vi: '«include» có nối actor với use case được không?', lc: [['a', 'Yes'], ['b', 'No — include/extend only connect use cases; actors use plain associations'], ['c', 'Only for external systems'], ['d', 'Only with a dashed line']], dap: 'b', giai: ['A frequent PE mistake.', 'Lỗi hay gặp trong PE.'] },
  ],
  goiY: ['"Luôn luôn" ⇒ include (gốc → gộp). "Có thể / chỉ khi" ⇒ extend (mở rộng → gốc).', 'include/extend chỉ nối hai use case, nét đứt.'],
  loiHayGap: ['Đảo chiều mũi tên extend.', 'Dùng include để nối use case với actor như Payment Gateway.'],
  giaiThich: '<p>Answers: a · b · a · b · b.</p>',
  thuatNgu: tn('include', 'extend'),
  khaiNiem: ['«include»', '«extend»'],
});

const E2 = phanLoai({
  tieuDe: 'Use case anatomy 2 — normal flow, alternative flow or exception?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>For the use case <b>Book Appointment</b>: the <b>normal flow</b> is the most common success path; an <b>alternative flow</b> is another way that still reaches the goal; an <b>exception</b> is a condition that prevents the goal (and how the system handles it). Classify each fragment.</p>', vi: '<p>Với use case <b>Book Appointment</b>: <b>luồng chính</b> là đường thành công phổ biến nhất; <b>luồng thay thế</b> là cách khác vẫn đạt mục tiêu; <b>ngoại lệ</b> là điều kiện khiến không đạt mục tiêu (và cách hệ thống xử lý). Phân loại từng đoạn.</p>' },
  cot: 'Kind', luaChon: ['Normal flow', 'Alternative flow', 'Exception'],
  hang: [
    ['The patient selects a doctor, a date and a free slot, and confirms.', 'Normal flow'],
    ['The patient chooses "any available doctor" and the system picks the first free one.', 'Alternative flow'],
    ['The chosen slot is taken by someone else before confirmation; the system shows other slots.', 'Exception'],
    ['The deposit payment is declined; no appointment is created.', 'Exception'],
    ['The patient books for a family member instead of for herself.', 'Alternative flow'],
    ['The system creates the appointment and sends a confirmation.', 'Normal flow'],
  ],
  giaiThich: '<p>Alternative flows still end in a booked appointment; exceptions do not (or need recovery). Writing exceptions is where most missing requirements are found.</p>',
  goiY: ['Kết thúc có lịch hẹn được tạo không? Có ⇒ normal/alternative. Không ⇒ exception.', 'Luồng chính là đường phổ biến nhất.'],
  loiHayGap: ['Coi "đặt cho người nhà" là ngoại lệ — nó vẫn đạt mục tiêu.', 'Chỉ viết luồng chính.'],
  thuatNgu: tn('normalFlow', 'altFlow', 'exception'),
  khaiNiem: ['use case flows'],
});

const GIAI = `
@startuml
left to right direction
actor Patient
actor Receptionist
actor "Payment Gateway" as PG
rectangle "ClinicCare" {
  usecase "Book Appointment" as UC1
  usecase "Pay Deposit" as UC2
  usecase "Attach Referral Letter" as UC3
  usecase "Cancel Appointment" as UC4
  usecase "Charge Late Cancellation Fee" as UC5
}
Patient --> UC1
Receptionist --> UC1
UC1 ..> UC2 : <<include>>
UC2 --> PG
UC3 ..> UC1 : <<extend>>
Patient --> UC4
UC5 ..> UC4 : <<extend>>
UC5 --> PG
@enduml
`;
const E3 = baiJs({
  tieuDe: 'Use case anatomy 3 — model include and extend',
  doKho: 'HARD', phut: 12,
  moTa: { en: `<p>ClinicCare rules: (1) booking an appointment — by the patient or by the receptionist — ALWAYS requires a deposit, paid through the <b>payment gateway</b>; (2) when booking, a patient MAY attach a referral letter; (3) a patient cancels appointments; (4) if the cancellation is less than 24 hours before the appointment, a late fee is charged through the payment gateway. Draw the use case diagram with the right relationships.</p><p>${CU_PHAP.usecase.en}</p>`, vi: `<p>Luật ClinicCare: (1) đặt lịch — do bệnh nhân hay lễ tân — LUÔN cần đặt cọc, trả qua <b>cổng thanh toán</b>; (2) khi đặt, bệnh nhân CÓ THỂ đính giấy giới thiệu; (3) bệnh nhân huỷ lịch; (4) nếu huỷ trong vòng 24 giờ trước giờ hẹn thì thu phí huỷ muộn qua cổng thanh toán. Vẽ sơ đồ use case với quan hệ đúng.</p><p>${CU_PHAP.usecase.vi}</p>` },
  yeuCau: [{ en: 'Deposit = «include»; referral letter and late fee = «extend»; the payment gateway linked to the payment use cases with plain associations.', vi: 'Đặt cọc = «include»; giấy giới thiệu và phí huỷ muộn = «extend»; cổng thanh toán nối với các use case trả tiền bằng association thường.' }],
  viDu: [{ input: 'UC1 ..> UC2 : <<include>>', output: 'Book Appointment always uses Pay Deposit', explanation: 'Base → included.|||Gốc → được gộp.' }],
  tep: { 'usecase.js': ['const USE_CASE_DIAGRAM = ´\n@startuml\nactor Patient\nrectangle "ClinicCare" {\n  usecase "Book Appointment" as UC1\n}\nPatient --> UC1\n@enduml\n´;\n', `const USE_CASE_DIAGRAM = ´${GIAI.replace(/\s+$/, '')}\n´;\n`] },
  kiem: kiemUseCase({
    bien: 'USE_CASE_DIAGRAM',
    actors: [{ ten: 'Patient', khop: ['patient'] }, { ten: 'Receptionist', khop: ['reception'] }, { ten: 'Payment Gateway', khop: ['payment|gateway'] }],
    ucs: [
      { ten: 'Pay Deposit through the gateway', khop: ['deposit'], actor: [{ ten: 'Payment Gateway', khop: ['payment|gateway'] }] },
      { ten: 'Charge the late fee through the gateway', khop: ['late|fee'], actor: [{ ten: 'Payment Gateway', khop: ['payment|gateway'] }] },
    ],
    quanHe: [
      { loai: 'include', ten: 'Book Appointment «include» Pay Deposit', tu: ['book'], den: ['deposit'], lyDo: 'every booking requires a deposit', lyDoVi: 'lượt đặt nào cũng cần đặt cọc' },
      { loai: 'extend', ten: 'Attach Referral Letter «extend» Book Appointment', tu: ['referral|letter'], den: ['book'], lyDo: 'the patient MAY attach it', lyDoVi: 'bệnh nhân CÓ THỂ đính kèm' },
      { loai: 'extend', ten: 'Charge Late Fee «extend» Cancel Appointment', tu: ['late|fee'], den: ['cancel'], lyDo: 'only when cancelling less than 24 h before', lyDoVi: 'chỉ khi huỷ trong vòng 24 giờ trước' },
    ],
    moiKiemUC: 2,
  }),
  goiY: ['Ba quan hệ: một include, hai extend.', 'Payment Gateway nối bằng đường thường (-->) tới use case trả tiền, không bằng include.'],
  loiHayGap: ['Đảo chiều extend (Cancel ..> Late Fee).', 'Vẽ Book Appointment ..> Payment Gateway : <<include>>.'],
  giaiThich: `<p>Always ⇒ include from the base; optional or conditional ⇒ extend from the extension; actors connect with associations only.</p>${khoiThamChieu('uc', GIAI, 'Use case diagram — include and extend')}`,
  thuatNgu: tn('include', 'extend', 'actor'),
  khaiNiem: ['«include»', '«extend»'],
  boYeu: [{ ten: 'đảo chiều extend + include tới actor', tep: { 'usecase.js': `const USE_CASE_DIAGRAM = \`${GIAI.replace('UC5 ..> UC4 : <<extend>>', 'UC4 ..> UC5 : <<extend>>').replace('UC2 --> PG', 'UC2 ..> PG : <<include>>')}\`;\n` } }],
});

const E4 = tracNghiem({
  tieuDe: 'Use case anatomy 4 — actor generalization and primary/secondary actors',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>A <b>primary actor</b> starts the use case to reach a goal; a <b>secondary actor</b> is needed by the system to complete it (often an external system). <b>Generalization</b> between actors (child --|> parent) means the child can do everything the parent can, plus more.</p>', vi: '<p><b>Actor chính</b> khởi động use case để đạt mục tiêu; <b>actor phụ</b> là bên hệ thống cần để hoàn tất (thường là hệ thống ngoài). <b>Tổng quát hoá</b> giữa actor (con --|> cha) nghĩa là con làm được mọi thứ cha làm, và hơn thế.</p>' },
  cau: [
    { en: 'In "Pay Deposit", the payment gateway is…', vi: 'Trong "Pay Deposit", cổng thanh toán là…', lc: [['a', 'the primary actor'], ['b', 'a secondary actor'], ['c', 'not an actor'], ['d', 'a use case']], dap: 'b', giai: ['The patient starts it; the gateway helps complete it.', 'Bệnh nhân khởi động; cổng thanh toán giúp hoàn tất.'] },
    { en: 'A Head Receptionist can do everything a Receptionist can, plus approve refunds. How do you draw it?', vi: 'Lễ tân trưởng làm được mọi việc của lễ tân, thêm duyệt hoàn tiền. Vẽ thế nào?', lc: [['a', 'Receptionist --|> "Head Receptionist"'], ['b', '"Head Receptionist" --|> Receptionist, and link Head Receptionist to Approve Refund'], ['c', 'Two unrelated actors linked to all the same use cases'], ['d', '«include» between the actors']], dap: 'b', giai: ['Child --|> parent; the child adds its own use cases.', 'Con --|> cha; con thêm use case riêng.'] },
    { en: 'Which line is ILLEGAL in a use case diagram?', vi: 'Dòng nào SAI trong sơ đồ use case?', lc: [['a', 'Patient --> UC1'], ['b', 'Patient --> Receptionist'], ['c', 'UC3 ..> UC1 : <<extend>>'], ['d', 'Doctor --|> Staff']], dap: 'b', giai: ['Actors never interact with each other in a use case diagram.', 'Actor không bao giờ nối với nhau bằng association trong sơ đồ use case.'] },
  ],
  goiY: ['Actor chính khởi động; actor phụ được hệ thống gọi tới.', 'Mũi tên tổng quát hoá đi từ CON tới CHA.'],
  loiHayGap: ['Nối hai actor bằng đường thường để thể hiện "nói chuyện với nhau".', 'Đảo chiều tổng quát hoá.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('primaryActor', 'generalization'),
  khaiNiem: ['actor generalization', 'primary vs secondary actor'],
});

export default moDun({
  slug: 'swr302-4-4-ch8-anatomy',
  ten: '4.4 Use case anatomy: flows, «include», «extend», generalization',
  moTaModule: 'Khi nào «include», khi nào «extend» và chiều mũi tên, luồng chính / thay thế / ngoại lệ, tự mô hình hoá include/extend của ClinicCare có chấm, actor chính/phụ và tổng quát hoá actor.',
  de: [E1, E2, E4, E3],
});
