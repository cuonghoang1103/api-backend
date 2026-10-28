/**
 * SWR302 · 4.3 — The use case specification template (Wiegers Ch.8 slides 34–36, ATM example).
 */
import { tn, jsLit } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';
import { kiemDacTaUC } from './_kiemmh.mjs';

const E1 = phanLoai({
  tieuDe: 'Use case template 1 — which field?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Wiegers’ use case template has: ID and name, primary and secondary actors, description, trigger, preconditions, postconditions, normal flow, alternative flows, exceptions, priority, frequency of use, business rules, other information, assumptions. For the ATM use case <b>Withdraw Cash</b>, put each sentence in its field.</p>', vi: '<p>Template use case của Wiegers gồm: mã và tên, actor chính và phụ, mô tả, trigger, tiền điều kiện, hậu điều kiện, luồng chính, luồng thay thế, ngoại lệ, độ ưu tiên, tần suất, business rule, thông tin khác, giả định. Với use case ATM <b>Withdraw Cash</b>, đặt mỗi câu vào đúng trường.</p>' },
  cot: 'Field', luaChon: ['Primary actor', 'Secondary actor', 'Trigger', 'Precondition', 'Postcondition', 'Normal flow step', 'Exception', 'Business rule', 'Frequency of use'],
  hang: [
    ['Bank customer', 'Primary actor'],
    ['The bank’s core banking system that authorises the withdrawal', 'Secondary actor'],
    ['The customer inserts a card into the ATM.', 'Trigger'],
    ['The ATM is in service and has cash.', 'Precondition'],
    ['The account balance is reduced by the amount withdrawn and the cash has been dispensed.', 'Postcondition'],
    ['The customer selects the amount to withdraw.', 'Normal flow step'],
    ['The account has insufficient funds; the ATM shows the balance and returns the card.', 'Exception'],
    ['A customer may not withdraw more than 20,000,000 VND per day.', 'Business rule'],
    ['About 300 times per ATM per day.', 'Frequency of use'],
  ],
  giaiThich: '<p>The trigger starts the use case; preconditions must already be true; postconditions are true after success; exceptions prevent the goal; the daily limit is a business rule the use case enforces.</p>',
  goiY: ['Trigger = sự kiện khởi động; precondition = điều đã đúng TRƯỚC khi bắt đầu.', 'Postcondition = điều đúng SAU khi thành công.'],
  loiHayGap: ['Nhầm trigger với precondition.', 'Ghi "success" làm postcondition thay vì trạng thái cụ thể.'],
  thuatNgu: tn('trigger', 'precondition', 'normalFlow', 'exception', 'primaryActor'),
  khaiNiem: ['use case template'],
});

const E2 = tracNghiem({
  tieuDe: 'Use case template 2 — writing good flows',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>A normal flow is a numbered dialogue between the actor and the system, written from the user’s point of view, free of UI details ("click the blue button"), and ending in success. Alternative flows and exceptions name the step where they branch.</p>', vi: '<p>Luồng chính là đối thoại đánh số giữa actor và hệ thống, viết từ góc nhìn người dùng, không chi tiết giao diện ("bấm nút xanh"), và kết thúc thành công. Luồng thay thế và ngoại lệ ghi rõ bước rẽ nhánh.</p>' },
  cau: [
    { en: 'Which normal-flow step is written best?', vi: 'Bước luồng chính nào viết tốt nhất?', lc: [['a', 'Customer clicks the green OK button at the bottom right.'], ['b', 'Customer confirms the withdrawal amount.'], ['c', 'The SQL UPDATE runs on the accounts table.'], ['d', 'Stuff happens.']], dap: 'b', giai: ['Intent, not UI or implementation.', 'Ý định, không phải giao diện hay hiện thực.'] },
    { en: 'Where does "insufficient funds" belong?', vi: '"Không đủ số dư" thuộc về đâu?', lc: [['a', 'Normal flow'], ['b', 'Exception, attached to the step where the system checks the balance'], ['c', 'Precondition'], ['d', 'Postcondition']], dap: 'b', giai: ['It prevents the goal and branches at the check step.', 'Nó ngăn mục tiêu và rẽ nhánh ở bước kiểm tra.'] },
    { en: 'The customer may ask for a receipt. In the template this is…', vi: 'Khách có thể yêu cầu in hoá đơn. Trong template đây là…', lc: [['a', 'an alternative flow (or an extension)'], ['b', 'an exception'], ['c', 'a precondition'], ['d', 'a business rule']], dap: 'a', giai: ['An optional variation that still reaches the goal.', 'Một biến thể tuỳ chọn vẫn đạt mục tiêu.'] },
  ],
  goiY: ['Viết ý định của người dùng, không phải thao tác giao diện.', 'Ngoại lệ ngăn mục tiêu; luồng thay thế vẫn đạt mục tiêu.'],
  loiHayGap: ['Luồng chính đầy chi tiết nút bấm, màu sắc.', 'Không ghi bước rẽ nhánh của ngoại lệ.'],
  giaiThich: '<p>Answers: b · b · a.</p>',
  thuatNgu: tn('normalFlow', 'altFlow', 'exception'),
  khaiNiem: ['writing use case flows'],
});

const GIAI_SPEC = {
  id: 'UC-07',
  name: 'Renew Loan',
  primaryActor: 'Reader',
  secondaryActors: [],
  description: 'A reader extends the due date of a book they have borrowed so they can keep it longer without a fine.',
  trigger: 'The reader chooses Renew on one of their current loans.',
  preconditions: ['PRE-1. The reader is signed in.', 'PRE-2. The reader has at least one current loan.'],
  postconditions: ['POST-1. The due date of the loan is extended by 14 days.', 'POST-2. The renewal count of the loan is increased by one.'],
  normalFlow: [
    '1. Reader opens the list of current loans.',
    '2. System displays each loan with title, due date and number of renewals.',
    '3. Reader selects a loan and chooses Renew.',
    '4. System checks that the loan is not overdue, has fewer than 2 renewals and is not reserved by another reader.',
    '5. System extends the due date by 14 days and increases the renewal count.',
    '6. System displays the new due date.',
  ],
  alternativeFlows: [{ id: 'AF1', at: 3, name: 'Renew all loans', steps: ['3a. Reader chooses Renew all.', '3b. System applies steps 4–5 to every loan and shows which were renewed.'] }],
  exceptions: [
    { id: 'E1', at: 4, condition: 'The loan is overdue', steps: ['System explains that overdue loans cannot be renewed and shows the fine.'] },
    { id: 'E2', at: 4, condition: 'The loan already has 2 renewals (limit reached)', steps: ['System shows that the renewal limit is reached.'] },
    { id: 'E3', at: 4, condition: 'Another reader has reserved the book', steps: ['System shows that the book is reserved and must be returned by the due date.'] },
  ],
  priority: 'High',
  frequency: 'About 150 renewals per day',
  businessRules: ['BR-04', 'BR-05'],
  assumptions: ['Renewal periods are the same for every reader category.'],
};
const E3 = baiJs({
  tieuDe: 'Use case template 3 — write the specification of Renew Loan',
  doKho: 'HARD', phut: 20,
  moTa: { en: '<p>Library rules: a <b>reader</b> may renew a current loan, which extends the due date by 14 days (<b>BR-04</b>); a loan can be renewed at most twice, and never when it is overdue or when another reader has reserved the book (<b>BR-05</b>). A reader may also choose "Renew all". Write the full use case specification <b>UC-07 Renew Loan</b> in <code>UC_SPEC</code>.</p>', vi: '<p>Luật thư viện: <b>độc giả</b> được gia hạn lượt mượn đang có, gia hạn thêm 14 ngày (<b>BR-04</b>); một lượt mượn gia hạn tối đa hai lần, và không bao giờ khi đã quá hạn hoặc khi người khác đã đặt trước cuốn đó (<b>BR-05</b>). Độc giả cũng có thể chọn "Renew all". Viết đặc tả đầy đủ <b>UC-07 Renew Loan</b> trong <code>UC_SPEC</code>.</p>' },
  yeuCau: [{ en: 'Every field of the template; numbered Reader/System steps; "Renew all" as an alternative flow; the three refusals as exceptions at the checking step; postconditions that state the new data.', vi: 'Đủ mọi trường; bước Reader/System đánh số; "Renew all" là luồng thay thế; ba trường hợp từ chối là ngoại lệ ở bước kiểm tra; hậu điều kiện nêu dữ liệu mới.' }],
  viDu: [{ input: "exceptions: [{ id: 'E1', at: 4, condition: 'The loan is overdue', steps: [...] }]", output: 'an exception attached to step 4', explanation: '"at" is the normal-flow step where it branches.|||"at" là bước luồng chính nơi rẽ nhánh.' }],
  tep: { 'uc-spec.js': [
    "const UC_SPEC = {\n  id: 'UC-07', name: 'Renew Loan', primaryActor: '', secondaryActors: [], description: '', trigger: '',\n  preconditions: [], postconditions: [], normalFlow: [], alternativeFlows: [], exceptions: [],\n  priority: '', frequency: '', businessRules: [], assumptions: [],\n};\n",
    `const UC_SPEC = ${jsLit(GIAI_SPEC)};\n`,
  ] },
  kiem: kiemDacTaUC({
    bien: 'UC_SPEC',
    actorChinh: { ten: 'Reader', khop: ['reader|member|borrower|student'] },
    tienDK: [{ ten: 'the reader is signed in', khop: ['sign|log|authent'] }, { ten: 'the reader has a current loan', khop: ['loan|borrow'] }],
    hauDK: [{ ten: 'the due date is extended by 14 days', khop: ['due date|14'] }, { ten: 'the renewal count is increased', khop: ['renewal|count|times'] }],
    luongChinh: { toiThieu: 5, su: [{ ten: 'view current loans', khop: ['loan|list'] }, { ten: 'select a loan and choose Renew', khop: ['select|choose'] }, { ten: 'check the renewal rules', khop: ['check|verif|validat'] }, { ten: 'extend the due date', khop: ['extend|new due|update'] }] },
    thayThe: [{ ten: 'Renew all', khop: ['all'] }],
    ngoaiLe: [{ ten: 'loan overdue', khop: ['overdue|late'] }, { ten: 'renewal limit reached', khop: ['limit|twice|2 renewals|two renewals|maximum'] }, { ten: 'book reserved by another reader', khop: ['reserv'] }],
  }),
  goiY: ['Ba trường hợp bị từ chối (quá hạn, đủ 2 lần, có người đặt trước) đều rẽ ở bước hệ thống KIỂM TRA.', 'Postcondition: hạn trả +14 ngày và số lần gia hạn +1.'],
  loiHayGap: ['Viết "System renews the loan" mà không có bước kiểm tra luật.', 'Đưa "loan not overdue" vào tiền điều kiện thay vì ngoại lệ.'],
  giaiThich: '<p>The checking step (4) is where BR-04/BR-05 are enforced; each refusal is an exception at that step; "Renew all" is an alternative path that still reaches the goal.</p>',
  thuatNgu: tn('useCase', 'precondition', 'normalFlow', 'altFlow', 'exception', 'businessRule'),
  khaiNiem: ['use case specification'],
  boYeu: [{ ten: 'thiếu ngoại lệ, luồng toàn System', tep: { 'uc-spec.js': `const UC_SPEC = ${jsLit({ ...GIAI_SPEC, normalFlow: ['1. System shows loans.', '2. System renews.', '3. System saves.', '4. System notifies.', '5. System ends.'], exceptions: [] })};\n` } }],
});

const E4 = phanLoai({
  tieuDe: 'Template 4 — which field of the template?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Use case "Withdraw Cash" (ATM). Put each piece of information into the right field of the Wiegers use case template.</p>', vi: '<p>Use case "Rút tiền" (ATM). Đặt mỗi thông tin vào đúng trường của template use case Wiegers.</p>' },
  cot: 'Template field', luaChon: ['Trigger', 'Precondition', 'Postcondition', 'Normal flow step', 'Alternative flow', 'Exception', 'Business rules', 'Frequency of use', 'Assumptions'],
  hang: [
    ['The customer inserts a card.', 'Trigger'],
    ['The ATM is online and has cash.', 'Precondition'],
    ['The account balance is reduced by the amount withdrawn.', 'Postcondition'],
    ['The system asks for the amount.', 'Normal flow step'],
    ['The customer chooses a quick amount of 500,000 VND instead of typing one.', 'Alternative flow'],
    ['The PIN is wrong three times; the card is retained.', 'Exception'],
    ['BR-12 daily withdrawal limit of 20 million VND.', 'Business rules'],
    ['About 300 withdrawals per ATM per day.', 'Frequency of use'],
    ['The bank network answers within 5 seconds.', 'Assumptions'],
  ],
  giaiThich: '<p>Alternative flows still reach the goal by another path; exceptions prevent the goal; rules are referenced by id from the catalogue.</p>',
  goiY: ['Vẫn đạt mục tiêu theo đường khác ⇒ alternative flow.', 'Không đạt mục tiêu ⇒ exception.'],
  loiHayGap: ['Gọi việc đưa thẻ vào là precondition.', 'Ghi sai PIN 3 lần là luồng thay thế.'],
  thuatNgu: tn('trigger', 'precondition', 'altFlow', 'exception'),
  khaiNiem: ['use case template'],
});

export default moDun({
  slug: 'swr302-4-6-ch8-template',
  ten: '4.6 The use case specification template',
  moTaModule: 'Các trường của template use case Wiegers (ví dụ ATM), viết bước luồng chính tốt, ngoại lệ và luồng thay thế, tự viết đặc tả đầy đủ UC-07 Renew Loan có chấm theo luật thư viện.',
  de: [E1, E2, E3, E4],
});
