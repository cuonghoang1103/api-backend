/**
 * SWR302 · 8.1 — From requirements to a first OO design (noun–verb analysis) + prototyping overview.
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'OO design 1 — noun–verb analysis',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Requirement (library app): "<i>A member borrows one or more copies of a book. Each loan has a due date. The system calculates the fine when a member returns a copy late.</i>" In noun–verb analysis, nouns suggest <b>classes</b> or <b>attributes</b>, verbs suggest <b>methods</b>. Classify each word.</p>', vi: '<p>Yêu cầu (thư viện): "Một hội viên mượn một hay nhiều bản sao của một cuốn sách. Mỗi lượt mượn có hạn trả. Hệ thống tính tiền phạt khi hội viên trả muộn." Danh từ gợi ý <b>lớp</b> hoặc <b>thuộc tính</b>, động từ gợi ý <b>phương thức</b>. Phân loại từng từ.</p>' },
  cot: 'Becomes', luaChon: ['Class', 'Attribute', 'Method', 'Not part of the model'],
  hang: [
    ['member', 'Class'], ['book', 'Class'], ['copy', 'Class'], ['loan', 'Class'],
    ['due date', 'Attribute'], ['fine', 'Attribute'],
    ['borrows', 'Method'], ['calculates (the fine)', 'Method'], ['returns', 'Method'],
    ['the system', 'Not part of the model'],
  ],
  giaiThich: '<p>Things with their own identity and several properties become classes (Member, Book, Copy, Loan); simple values describing them become attributes (Loan.dueDate, Loan.fine); verbs become responsibilities (Member.borrow(), Loan.calculateFine(), Copy.return() or Loan.close()). "The system" is the whole thing being designed, not a domain class.</p>',
  goiY: ['Danh từ có nhiều thuộc tính riêng ⇒ lớp; giá trị đơn ⇒ thuộc tính.', '"The system" là cả hệ thống — không thành lớp nghiệp vụ.'],
  loiHayGap: ['Biến "due date" thành lớp.', 'Tạo lớp System.'],
  thuatNgu: [{ en: 'noun–verb analysis', vi: 'phân tích danh từ – động từ' }, { en: 'class', vi: 'lớp' }, { en: 'responsibility', vi: 'trách nhiệm (phương thức) của lớp' }],
  khaiNiem: ['noun–verb analysis'],
});

const E2 = baiJs({
  tieuDe: 'OO design 2 — a first-cut class model from requirements',
  doKho: 'HARD', phut: 18,
  moTa: { en: '<p>Requirements (ClinicCare): "<i>A patient books an appointment with a doctor for a time slot. A doctor has many time slots. When the visit ends, the doctor writes a prescription that lists one or more medicines with a dosage for each. The system calculates the visit fee.</i>"</p><p>Write <code>MODEL = { classes: [{ name, attributes: [], methods: [] }], associations: [{ a, b, mult }] }</code> where <code>mult</code> is one of "1-1", "1-*", "*-1", "*-*" read from <code>a</code> to <code>b</code> (e.g. Doctor "1-*" TimeSlot). Use CamelCase class names; methods as names like "book" or "calculateFee" (no parentheses needed).</p>', vi: '<p>Từ yêu cầu ClinicCare, viết mô hình lớp sơ bộ: lớp (tên, thuộc tính, phương thức) và liên kết kèm bội số đọc từ a sang b.</p>' },
  yeuCau: [{ en: 'Classes: Patient, Doctor, Appointment, TimeSlot, Prescription, Medicine, and an association class for the dosage (e.g. PrescriptionItem).', vi: 'Các lớp: Patient, Doctor, Appointment, TimeSlot, Prescription, Medicine và một lớp chứa liều dùng (vd PrescriptionItem).' }],
  viDu: [{ input: 'Doctor has many time slots', output: "{ a: 'Doctor', b: 'TimeSlot', mult: '1-*' }", explanation: '|||' }],
  tep: { 'model.js': ["const MODEL = {\n  classes: [\n    // { name: 'Patient', attributes: ['name'], methods: ['book'] },\n  ],\n  associations: [\n    // { a: 'Doctor', b: 'TimeSlot', mult: '1-*' },\n  ],\n};\n", "const MODEL = {\n  classes: [\n    { name: 'Patient', attributes: ['patientId', 'name', 'phone'], methods: ['bookAppointment'] },\n    { name: 'Doctor', attributes: ['doctorId', 'name', 'specialty'], methods: ['writePrescription'] },\n    { name: 'TimeSlot', attributes: ['start', 'end', 'isFree'], methods: ['reserve'] },\n    { name: 'Appointment', attributes: ['appointmentId', 'status', 'fee'], methods: ['calculateFee', 'cancel'] },\n    { name: 'Prescription', attributes: ['prescriptionId', 'date'], methods: ['addItem'] },\n    { name: 'PrescriptionItem', attributes: ['dosage', 'quantity'], methods: [] },\n    { name: 'Medicine', attributes: ['medicineId', 'name', 'unit'], methods: [] },\n  ],\n  associations: [\n    { a: 'Patient', b: 'Appointment', mult: '1-*' },\n    { a: 'Doctor', b: 'TimeSlot', mult: '1-*' },\n    { a: 'Appointment', b: 'TimeSlot', mult: '1-1' },\n    { a: 'Appointment', b: 'Prescription', mult: '1-1' },\n    { a: 'Prescription', b: 'PrescriptionItem', mult: '1-*' },\n    { a: 'PrescriptionItem', b: 'Medicine', mult: '*-1' },\n  ],\n};\n"] },
  kiem: (function () {
    var LIB = "function cls(n){ return (MODEL.classes||[]).filter(function(c){ return c && String(c.name).toLowerCase().replace(/[^a-z]/g,'') === n; })[0]; }\n" +
      "function rev(m){ return m.split('-').reverse().join('-'); }\n" +
      "function assoc(x, y){ var r = null; (MODEL.associations||[]).forEach(function(s){ var a = String(s.a).toLowerCase().replace(/[^a-z]/g,''), b = String(s.b).toLowerCase().replace(/[^a-z]/g,''); if (a===x&&b===y) r = s.mult; else if (a===y&&b===x) r = rev(String(s.mult)); }); return r; }\n" +
      "if (typeof MODEL === 'undefined' || !MODEL || !Array.isArray(MODEL.classes) || !Array.isArray(MODEL.associations)) return 'MODEL must have classes and associations arrays';\n";
    function k(moTa, body, ex) { return kiemTuy(moTa, new Function(LIB + body), ex); }
    return [
      k({ en: 'the domain classes are present', vi: 'có đủ các lớp nghiệp vụ' }, "var need = ['patient','doctor','appointment','timeslot','prescription','medicine']; for (var i = 0; i < need.length; i++) if (!cls(need[i])) return 'missing class for ' + need[i]; if (cls('system') || cls('clinicsystem')) return 'do not model \"the system\" as a class'; return 'OK';"),
      k({ en: 'the dosage lives on an association class, not on Medicine', vi: 'liều dùng nằm ở lớp liên kết, không ở Medicine' }, "var med = cls('medicine'); if (med && (med.attributes||[]).some(function(a){ return /dos/i.test(a); })) return 'dosage depends on the prescription, not on the medicine'; var item = (MODEL.classes||[]).filter(function(c){ return (c.attributes||[]).some(function(a){ return /dos/i.test(a); }); })[0]; if (!item) return 'add a class holding the dosage (e.g. PrescriptionItem)'; var n = String(item.name).toLowerCase().replace(/[^a-z]/g,''); return assoc('prescription', n) === '1-*' && assoc(n, 'medicine') === '*-1' ? 'OK' : 'link Prescription 1-* ' + item.name + ' and ' + item.name + ' *-1 Medicine';"),
      k({ en: 'multiplicities: Doctor–TimeSlot, Patient–Appointment', vi: 'bội số: Doctor–TimeSlot, Patient–Appointment' }, "if (assoc('doctor','timeslot') !== '1-*') return 'a doctor has many time slots: Doctor 1-* TimeSlot'; if (assoc('patient','appointment') !== '1-*') return 'a patient can have many appointments: Patient 1-* Appointment'; return 'OK';"),
      k({ en: 'Appointment is linked to a TimeSlot and to the Prescription', vi: 'Appointment nối với TimeSlot và Prescription' }, "var t = assoc('appointment','timeslot'); if (t !== '1-1' && t !== '1-*') return 'link Appointment to TimeSlot so that a slot holds at most one appointment (Appointment 1-1 TimeSlot)'; if (!assoc('appointment','prescription') && !assoc('doctor','prescription')) return 'link the Prescription to the visit (Appointment) or the Doctor'; return 'OK';"),
      k({ en: 'verbs became methods on the right classes', vi: 'động từ thành phương thức đúng lớp' }, "function has(c, re){ var x = cls(c); return x && (x.methods||[]).some(function(m){ return re.test(m); }); }\nif (!has('patient', /book/i) && !has('appointment', /book|create/i)) return 'books ⇒ a book… method (Patient or Appointment)'; if (!has('doctor', /prescri|write/i) && !has('prescription', /create|write/i)) return 'writes a prescription ⇒ a method on Doctor or Prescription'; if (!(MODEL.classes||[]).some(function(c){ return (c.methods||[]).some(function(m){ return /fee/i.test(m); }); })) return 'calculates the visit fee ⇒ calculateFee method'; return 'OK';"),
      k({ en: 'every class has at least one attribute; names are CamelCase', vi: 'mỗi lớp có ít nhất một thuộc tính; tên CamelCase' }, "for (var i = 0; i < MODEL.classes.length; i++) { var c = MODEL.classes[i]; if (!/^[A-Z][A-Za-z0-9]*$/.test(String(c.name))) return 'class name \"' + c.name + '\" should be CamelCase without spaces'; if (!(c.attributes||[]).length) return c.name + ' has no attributes'; } return 'OK';", { an: true }),
    ];
  })(),
  goiY: ['"liều dùng cho MỖI thuốc trong MỘT đơn" ⇒ thuộc tính của dòng đơn (PrescriptionItem), không của Medicine.', 'Bội số đọc từ a sang b: "1-*" = một a có nhiều b.'],
  loiHayGap: ['Đặt dosage vào Medicine (liều khác nhau mỗi đơn).', 'Tạo lớp "ClinicSystem".'],
  giaiThich: '<p>Reference model: Patient 1—* Appointment; Doctor 1—* TimeSlot; Appointment 1—1 TimeSlot; Appointment 1—1 Prescription; Prescription 1—* PrescriptionItem *—1 Medicine (dosage on the item). Methods follow the verbs: bookAppointment, writePrescription, calculateFee. This is a first cut — refine with encapsulation and design patterns later.</p>',
  thuatNgu: [...tn('associativeEntity', 'cardinality'), { en: 'class diagram', vi: 'sơ đồ lớp' }],
  khaiNiem: ['OO design from requirements'],
  boYeu: [{ ten: 'dosage ở Medicine, có lớp System', tep: { 'model.js': "const MODEL={classes:[{name:'ClinicSystem',attributes:['x'],methods:['calculateFee']},{name:'Patient',attributes:['name'],methods:['book']},{name:'Doctor',attributes:['name'],methods:['writePrescription']},{name:'TimeSlot',attributes:['start'],methods:[]},{name:'Appointment',attributes:['status'],methods:[]},{name:'Prescription',attributes:['date'],methods:[]},{name:'Medicine',attributes:['name','dosage'],methods:[]}],associations:[{a:'Patient',b:'Appointment',mult:'1-*'},{a:'Doctor',b:'TimeSlot',mult:'1-*'},{a:'Appointment',b:'TimeSlot',mult:'1-1'},{a:'Appointment',b:'Prescription',mult:'1-1'},{a:'Prescription',b:'Medicine',mult:'*-*'}]};\n" } }],
});

const E3 = tracNghiem({
  tieuDe: 'OO design 3 — design from requirements, and why prototype',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Requirements say <i>what</i>; design says <i>how</i>. The domain model from analysis is the seed of the class design. A prototype is a partial, preliminary implementation built to <b>learn</b> — to reduce a risk before committing to full development.</p>', vi: '<p>Yêu cầu nói <i>cái gì</i>; thiết kế nói <i>thế nào</i>. Mô hình miền từ phân tích là hạt giống của thiết kế lớp. Prototype là hiện thực một phần để <b>học</b> — giảm rủi ro trước khi làm thật.</p>' },
  cau: [
    { en: 'Which analysis artefact is the best starting point for the class design?', vi: 'Sản phẩm phân tích nào là điểm khởi đầu tốt nhất cho thiết kế lớp?', lc: [['a', 'The conceptual ERD / domain model'], ['b', 'The context diagram'], ['c', 'The vision statement'], ['d', 'The project schedule']], dap: 'a', giai: ['Its entities and relationships become classes and associations.', 'Thực thể và quan hệ thành lớp và liên kết.'] },
    { en: 'Users cannot say whether the triage screen layout works for them. You should…', vi: 'Người dùng không nói được bố cục màn hình phân loại có hợp không. Bạn nên…', lc: [['a', 'build a quick throwaway mock-up and let them try it'], ['b', 'write a longer SRS section'], ['c', 'build the full system then ask'], ['d', 'skip the screen']], dap: 'a', giai: ['Prototype the uncertain part.', 'Làm prototype phần chưa chắc chắn.'] },
    { en: 'The "three amigos" refining a story are…', vi: '"Three amigos" cùng làm rõ một story là…', lc: [['a', 'BA/PO, developer and tester'], ['b', 'three developers'], ['c', 'CEO, CFO, CTO'], ['d', 'three customers']], dap: 'a', giai: ['What & why, how & feasibility, how to prove it.', 'Cái gì & vì sao, làm thế nào & khả thi, chứng minh thế nào.'] },
  ],
  goiY: ['Mô hình miền ⇒ lớp.', 'Prototype nhắm vào điều chưa chắc chắn.'],
  loiHayGap: ['Bắt đầu thiết kế từ context diagram.', 'Prototype toàn bộ hệ thống.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('prototype', 'erd'),
  khaiNiem: ['design from requirements', 'prototyping'],
});

const E4 = phanLoai({
  tieuDe: 'OO design 4 — class, attribute, association or method?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>From the requirement "<i>A customer places an order containing one or more books; the system calculates the order total including tax</i>", classify each design element of the first-cut class model.</p>', vi: '<p>Từ yêu cầu đặt sách, phân loại từng phần tử của mô hình lớp sơ bộ.</p>' },
  cot: 'Element', luaChon: ['Class', 'Attribute', 'Association', 'Method'],
  hang: [
    ['OrderLine', 'Class'],
    ['Order.total', 'Attribute'],
    ['Customer 1—* Order', 'Association'],
    ['Order.calculateTotal()', 'Method'],
    ['OrderLine.quantity', 'Attribute'],
    ['OrderLine *—1 Book', 'Association'],
  ],
  giaiThich: '<p>Nouns → classes and attributes; verbs → methods; relations between nouns → associations with multiplicities.</p>',
  goiY: ['"one or more books" ⇒ lớp dòng đơn + liên kết.', 'Động từ "calculates" ⇒ phương thức.'],
  loiHayGap: ['Biến total thành lớp.', 'Quên lớp OrderLine.'],
  thuatNgu: [{ en: 'association', vi: 'liên kết' }],
  khaiNiem: ['noun–verb analysis'],
});

export default moDun({
  slug: 'swr302-8-1-oo-design-prototyping',
  ten: '8.1 From requirements to an OO design',
  moTaModule: 'Phân tích danh từ–động từ thành lớp/thuộc tính/phương thức, tự dựng mô hình lớp sơ bộ ClinicCare (lớp liên kết cho liều dùng, bội số) chấm theo tính chất, thiết kế từ mô hình miền và vai trò prototype.',
  de: [E1, E3, E2, E4],
});
