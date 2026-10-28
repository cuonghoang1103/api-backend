/**
 * SWR302 · 4.4 — Working with use cases: from use cases to functional requirements (Wiegers Ch.8 slides 25–33).
 */
import { tn, kiemTuy, kiemKhoa } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Working with use cases 1 — use cases and functional requirements',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Use cases capture what users need to do; functional requirements state what developers must build. Wiegers: derive functional requirements from each step, each alternative flow, each exception and each business rule of a use case — and write them in the SRS so that they can be tested.</p>', vi: '<p>Use case ghi điều người dùng cần làm; yêu cầu chức năng nêu điều dev phải xây. Wiegers: rút yêu cầu chức năng từ từng bước, từng luồng thay thế, từng ngoại lệ và từng business rule của use case — rồi ghi vào SRS để test được.</p>' },
  cau: [
    { en: 'Where do most functional requirements come from in a use-case-driven project?', vi: 'Trong dự án lấy use case làm gốc, phần lớn yêu cầu chức năng đến từ đâu?', lc: [['a', 'From the steps, alternative flows, exceptions and business rules of the use cases'], ['b', 'From the database design'], ['c', 'From the developers’ ideas'], ['d', 'From the test cases']], dap: 'a', giai: ['Each of those produces system behaviour that must be specified.', 'Mỗi phần đó sinh hành vi hệ thống cần đặc tả.'] },
    { en: 'Is a use case alone enough as a specification for developers?', vi: 'Một use case có đủ làm đặc tả cho dev không?', lc: [['a', 'Always'], ['b', 'Often not — details such as validations, messages, rules and data are added as functional requirements'], ['c', 'Never useful'], ['d', 'Only if it has a diagram']], dap: 'b', giai: ['The use case gives context; the FRs give precise, testable behaviour.', 'Use case cho bối cảnh; FR cho hành vi chính xác, test được.'] },
    { en: 'An exception "the slot was taken by someone else" produces…', vi: 'Ngoại lệ "khung giờ đã bị người khác lấy" sinh ra…', lc: [['a', 'nothing'], ['b', 'a functional requirement for how the system detects and responds to it'], ['c', 'a business objective'], ['d', 'a quality attribute only']], dap: 'b', giai: ['Exceptions are rich sources of functional requirements.', 'Ngoại lệ là nguồn yêu cầu chức năng phong phú.'] },
  ],
  goiY: ['Mỗi bước hệ thống, mỗi rẽ nhánh, mỗi luật ⇒ ứng viên yêu cầu chức năng.', 'Use case = bối cảnh; FR = hành vi chính xác.'],
  loiHayGap: ['Chỉ viết FR cho luồng chính.', 'Bỏ qua business rule khi rút FR.'],
  giaiThich: '<p>Answers: a · b · b.</p>',
  thuatNgu: tn('useCase', 'functionalReq'),
  khaiNiem: ['deriving functional requirements'],
});

const E2 = phanLoai({
  tieuDe: 'Working with use cases 2 — where does each FR come from?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Functional requirements derived from <b>UC-07 Renew Loan</b> (normal flow: view loans → select → system checks → system extends the due date; alternative flow: Renew all; exceptions: overdue, limit reached, reserved; business rules BR-04 +14 days, BR-05 max 2 renewals). Name the source of each.</p>', vi: '<p>Yêu cầu chức năng rút từ <b>UC-07 Renew Loan</b>. Gọi tên nguồn của từng yêu cầu.</p>' },
  cot: 'Source', luaChon: ['Normal flow', 'Alternative flow', 'Exception', 'Business rule'],
  hang: [
    ['The system shall display each current loan with its title, due date and number of renewals.', 'Normal flow'],
    ['The system shall renew every eligible loan when the reader chooses Renew all and report the loans that were not renewed.', 'Alternative flow'],
    ['The system shall refuse to renew an overdue loan and display the fine owed.', 'Exception'],
    ['The system shall set the new due date to the current due date plus 14 days.', 'Business rule'],
    ['The system shall refuse a renewal when the book is reserved by another reader.', 'Exception'],
    ['The system shall allow at most two renewals per loan.', 'Business rule'],
  ],
  giaiThich: '<p>Steps give display and processing requirements; the alternative flow gives batch behaviour; exceptions give refusals with messages; business rules give the precise values (14 days, 2 renewals).</p>',
  goiY: ['Con số chính xác (14 ngày, 2 lần) thường đến từ business rule.', 'Từ chối + thông báo thường đến từ ngoại lệ.'],
  loiHayGap: ['Xếp "tối đa hai lần" là ngoại lệ — luật là nguồn, ngoại lệ là chỗ áp dụng.', 'Bỏ qua yêu cầu từ luồng thay thế.'],
  thuatNgu: tn('functionalReq', 'altFlow', 'exception', 'businessRule'),
  khaiNiem: ['deriving functional requirements'],
});

const E3 = baiJs({
  tieuDe: 'Working with use cases 3 — derive the functional requirements',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>UC <b>Check In Patient</b> (ClinicCare): 1. Receptionist searches the patient by phone number or ID. 2. System shows today’s appointments of the patient. 3. Receptionist selects the appointment and confirms arrival. 4. System checks that the patient arrived no more than 15 minutes late (<b>BR-12</b>). 5. System marks the appointment Checked-in and gives a queue number. 6. System adds the patient to the doctor’s waiting list. <i>Exception at 4</i>: more than 15 minutes late ⇒ the system asks the receptionist to rebook. <i>Exception at 2</i>: no appointment today ⇒ the system offers a walk-in booking. Write at least 6 functional requirements in <code>FRS</code>.</p>', vi: '<p>UC <b>Check In Patient</b> (ClinicCare) như bản tiếng Anh. Viết ít nhất 6 yêu cầu chức năng trong <code>FRS</code>.</p>' },
  yeuCau: [{ en: '"The system shall …", one requirement per statement, verifiable, covering search, the 15-minute rule, the queue number, the waiting list and both exceptions.', vi: '"The system shall …", mỗi câu một yêu cầu, kiểm chứng được, phủ tìm kiếm, luật 15 phút, số thứ tự, danh sách chờ và hai ngoại lệ.' }],
  viDu: [{ input: 'Step 5', output: 'The system shall assign a queue number to a patient when the receptionist confirms the arrival.', explanation: 'One step, one testable requirement.|||Một bước, một yêu cầu test được.' }],
  tep: { 'frs.js': ["const FRS = [\n  'The system shall …',\n];\n", "const FRS = [\n  'The system shall let the receptionist search a patient by phone number or patient ID.',\n  'The system shall display all appointments of the selected patient for the current day.',\n  'The system shall refuse a check-in more than 15 minutes after the appointment time and ask the receptionist to rebook the patient.',\n  'The system shall mark the appointment as Checked-in when the receptionist confirms the arrival.',\n  'The system shall assign a queue number to the patient when the appointment is checked in.',\n  'The system shall add a checked-in patient to the waiting list of the appointment\\'s doctor.',\n  'The system shall offer a walk-in booking when the patient has no appointment on the current day.',\n];\n"] },
  kiem: [
    kiemTuy({ en: 'at least 6 requirements, each "The system shall …", one per statement', vi: 'ít nhất 6 yêu cầu, mỗi câu "The system shall …", mỗi câu một yêu cầu' }, function () {
      if (typeof FRS === 'undefined' || !Array.isArray(FRS) || FRS.length < 6) return 'write at least 6 requirements in FRS';
      for (var i = 0; i < FRS.length; i++) {
        var r = String(FRS[i]).trim();
        if (!/^the system shall\b/i.test(r)) return 'FRS[' + i + '] must start with "The system shall"';
        if ((r.match(/\bshall\b/gi) || []).length > 2) return 'FRS[' + i + '] contains several requirements';
        if (/\b(etc|and\/or|user[- ]friendly|fast|quickly|appropriate|properly)\b/i.test(r)) return 'FRS[' + i + '] uses a vague word';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'the 15-minute rule (BR-12) is stated with its value', vi: 'luật 15 phút (BR-12) có ghi đúng giá trị' }, function () {
      if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
      return FRS.some(function (r) { return /15 minutes|fifteen minutes/i.test(r); }) ? 'OK' : 'no requirement states the 15-minute late limit';
    }),
    kiemTuy({ en: 'the queue number and the waiting list are covered', vi: 'có số thứ tự và danh sách chờ' }, function () {
      if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
      var t = FRS.join(' | ').toLowerCase();
      if (!/queue number|number/.test(t)) return 'no requirement for the queue number';
      return /waiting list|queue of the doctor|doctor.*list/.test(t) ? 'OK' : 'no requirement for the doctor’s waiting list';
    }),
    kiemTuy({ en: 'both exceptions produce requirements (rebook, walk-in)', vi: 'hai ngoại lệ đều sinh yêu cầu (đặt lại, khám vãng lai)' }, function () {
      if (typeof FRS === 'undefined' || !Array.isArray(FRS)) return 'FRS is missing';
      var t = FRS.join(' | ').toLowerCase();
      if (!/rebook|re-book|new appointment/.test(t)) return 'no requirement for the late patient (rebook)';
      return /walk-in|walk in/.test(t) ? 'OK' : 'no requirement for a patient without an appointment (walk-in)';
    }, { an: true }),
  ],
  goiY: ['Mỗi bước System và mỗi ngoại lệ ⇒ ít nhất một yêu cầu.', 'Ghi đúng con số 15 phút từ BR-12.'],
  loiHayGap: ['Chép lại bước use case ("Receptionist searches…") thay vì viết hành vi hệ thống.', 'Bỏ ngoại lệ "không có lịch hôm nay".'],
  giaiThich: '<p>Search, display, refuse-late, mark checked-in, queue number, waiting list, walk-in: seven testable statements from one short use case.</p>',
  thuatNgu: tn('functionalReq', 'exception', 'businessRule'),
  khaiNiem: ['deriving functional requirements'],
});

export default moDun({
  slug: 'swr302-4-5-ch8-working',
  ten: '4.4 From use cases to functional requirements',
  moTaModule: 'Rút yêu cầu chức năng từ bước, luồng thay thế, ngoại lệ và business rule của use case; xác định nguồn của từng FR; tự viết FR cho use case Check In Patient có chấm.',
  de: [E1, E2, E3],
});
