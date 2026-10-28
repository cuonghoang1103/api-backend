/**
 * SWR302 · 3G.2 — Elicitation good practices (Wiegers Ch.3 slides 7–20).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';
import { NHOM_TH } from './_thuchanh.mjs';

const E1 = phanLoai({
  tieuDe: 'Elicitation practices 1 — which practice fits?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Choose the elicitation practice that fits each situation.</p>', vi: '<p>Chọn thực hành khai thác phù hợp với từng tình huống.</p>' },
  cot: 'Practice', luaChon: NHOM_TH.Elicitation,
  hang: [
    ['20,000 students across 4 campuses must give input on a library app.', 'Distribute questionnaires'],
    ['The help desk has 300 complaints about the current system.', 'Examine problem reports for requirement ideas'],
    ['The team needs to understand how warehouse staff really pick orders.', 'Observe users performing their jobs'],
    ['A new payroll module must follow the same tax rules as the old one.', 'Reuse existing requirements'],
    ['Five departments must agree on one ordering process quickly.', 'Hold facilitated elicitation workshops'],
    ['The old system’s manual and process documents are available.', 'Perform document analysis'],
    ['Each user class needs one person who speaks and decides for it.', 'Select a product champion for each user class'],
    ['A commercial product has thousands of users; you want feedback on its next version without giving them decision power.', 'Conduct focus groups with typical users'],
  ],
  giaiThich: '<p>Large, distributed populations ⇒ questionnaires; existing complaints ⇒ problem reports; tacit work ⇒ observation; shared rules ⇒ reuse; fast group agreement ⇒ workshops.</p>',
  goiY: ['Nhiều người, phân tán ⇒ questionnaire.', 'Có quyền quyết ⇒ product champion; không có quyền quyết ⇒ focus group.'],
  loiHayGap: ['Phỏng vấn từng người trong 20.000 người.', 'Nhầm focus group với product champion.'],
  thuatNgu: tn('elicitation', 'productChampion'),
  khaiNiem: ['elicitation practices'],
});

const E2 = phanLoai({
  tieuDe: 'Elicitation practices 2 — which kind of event?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>"Identify system events and responses": three classes of external events — <b>signal events</b> (control signals or data from hardware), <b>temporal events</b> (time-triggered), and <b>business events</b> (a user or another system starts something; they trigger use cases). An event-response table is a strong completeness check.</p>', vi: '<p>Ba loại sự kiện ngoài: tín hiệu (từ phần cứng), thời gian (theo lịch), nghiệp vụ (người/hệ thống khởi động, kích hoạt use case).</p>' },
  cot: 'Event type', luaChon: ['Signal event', 'Temporal event', 'Business event'],
  hang: [
    ['The barcode scanner sends a scanned code.', 'Signal event'],
    ['At 02:00 every night the system exports the day’s sales.', 'Temporal event'],
    ['A customer places an order.', 'Business event'],
    ['The temperature sensor reports 9 °C in the vaccine fridge.', 'Signal event'],
    ['Rent becomes 5 days overdue.', 'Temporal event'],
    ['A supplier sends a delivery note through the EDI interface.', 'Business event'],
  ],
  giaiThich: '<p>For each event, the table lists the system’s response — gaps in the table are missing requirements.</p>',
  goiY: ['Thiết bị phần cứng gửi tín hiệu ⇒ signal.', 'Theo đồng hồ/lịch ⇒ temporal.'],
  loiHayGap: ['Coi "quá hạn 5 ngày" là business event.', 'Coi đơn hàng của khách là signal.'],
  thuatNgu: [{ en: 'event-response table', vi: 'bảng sự kiện – phản hồi' }],
  khaiNiem: ['system events and responses'],
});

const E3 = tracNghiem({
  tieuDe: 'Elicitation practices 3 — vision, user classes, interviews',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>The vision and scope are the reference against which every proposed requirement is judged. Interviews are efficient because each person discusses only what matters to them, and they are useful to gather views separately before a workshop resolves conflicts.</p>', vi: '<p>Tầm nhìn và phạm vi là thước để xét mọi yêu cầu đề xuất; phỏng vấn hiệu quả và hữu ích trước một workshop.</p>' },
  cau: [
    { en: 'A stakeholder proposes a feature. What do you compare it with first?', vi: 'Một bên liên quan đề xuất tính năng. So với cái gì trước tiên?', lc: [['a', 'The vision and the scope of the current release'], ['b', 'The database schema'], ['c', 'The test plan'], ['d', 'The team’s preferences']], dap: 'a', giai: ['Vision and scope are the yardstick.', 'Tầm nhìn và phạm vi là thước đo.'] },
    { en: 'Why interview people separately before a workshop?', vi: 'Vì sao phỏng vấn riêng trước workshop?', lc: [['a', 'To collect each view without group pressure, then resolve conflicts together in the workshop'], ['b', 'Workshops are forbidden'], ['c', 'To avoid writing anything down'], ['d', 'To shorten the project']], dap: 'a', giai: ['Separate views, then joint resolution.', 'Ý kiến riêng, rồi giải quyết chung.'] },
  ],
  goiY: ['Mọi yêu cầu so với tầm nhìn/phạm vi.', 'Phỏng vấn riêng tránh áp lực nhóm.'],
  loiHayGap: ['Đưa tính năng vào mà không so với phạm vi.', 'Mời mọi người vào workshop khi chưa nghe riêng.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('visionScope', 'elicitation'),
  khaiNiem: ['elicitation practices'],
});

const E4 = tracNghiem({
  tieuDe: 'Elicitation practices 4 — what to reuse',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Great reuse candidates: requirements that enforce business rules (security) or regulations (accessibility), glossaries, data models, stakeholder profiles, user-class descriptions and personas.</p>', vi: '<p>Ứng viên tái sử dụng tốt: yêu cầu thực thi luật/quy định, glossary, mô hình dữ liệu, hồ sơ bên liên quan, mô tả lớp người dùng, persona.</p>' },
  cau: [
    { en: 'Which is the best candidate for reuse in a new hospital app?', vi: 'Ứng viên tái sử dụng tốt nhất cho app bệnh viện mới?', lc: [['a', 'The accessibility requirements already approved for the hospital’s other apps'], ['b', 'The colour palette of a competitor'], ['c', 'Last year’s sprint plan'], ['d', 'A developer’s personal notes']], dap: 'a', giai: ['Regulatory requirements are stable across projects.', 'Yêu cầu theo quy định ổn định giữa các dự án.'] },
    { en: 'What must you check before reusing a requirement?', vi: 'Phải kiểm gì trước khi tái sử dụng một yêu cầu?', lc: [['a', 'Whether the customers are flexible enough to accept the existing behaviour (or a small adaptation)'], ['b', 'Nothing'], ['c', 'Only the font'], ['d', 'Whether it is long']], dap: 'a', giai: ['Reuse needs flexible requirements and customers.', 'Tái sử dụng cần yêu cầu và khách linh hoạt.'] },
  ],
  goiY: ['Yêu cầu theo luật/quy định thường tái dùng được.', 'Khách phải chấp nhận hành vi sẵn có.'],
  loiHayGap: ['Tái dùng mà không hỏi khách.', 'Tái dùng thứ không phải yêu cầu.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'requirements reuse', vi: 'tái sử dụng yêu cầu' }],
  khaiNiem: ['reuse'],
});

export default moDun({
  slug: 'swr302-3g-2-ch3-elicitation',
  ten: '2.7 Good practices: elicitation',
  moTaModule: 'Mười ba thực hành khai thác: chọn đúng thực hành cho 8 tình huống, ba loại sự kiện (tín hiệu, thời gian, nghiệp vụ), tầm nhìn làm thước đo, phỏng vấn trước workshop, cái gì nên tái sử dụng.',
  de: [E1, E2, E3, E4],
});
