/**
 * SWR302 · 5.3 — TBDs, user interfaces in the SRS, the SRS template, and specification on agile projects (Wiegers Ch.10 slides 13–16).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'TBD 1 — proceeding with TBDs',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Resolve all TBDs before implementing a set of requirements: leftover uncertainty makes developers and testers guess (and they often guess rather than track down the originator). If you must proceed with TBDs, either <b>defer</b> those requirements or <b>design that part to be easily modifiable</b> when the TBD is resolved — and log each TBD as an issue with an owner.</p>', vi: '<p>Giải quyết TBD trước khi hiện thực; nếu buộc phải làm tiếp thì hoãn phần đó hoặc thiết kế phần đó dễ sửa khi TBD được giải.</p>' },
  cau: [
    { en: 'The late fee is TBD but the sprint starts tomorrow. Best option?', vi: 'Phí trễ còn TBD nhưng sprint bắt đầu ngày mai. Phương án tốt nhất?', lc: [['a', 'Build the late-fee calculation with the fee as a configurable value, and log the TBD with an owner and date'], ['b', 'Let the developer guess a fee'], ['c', 'Remove late fees forever'], ['d', 'Hard-code 10,000 VND and forget it']], dap: 'a', giai: ['Design for easy change; track the TBD.', 'Thiết kế dễ đổi; theo dõi TBD.'] },
    { en: 'Why are unresolved TBDs dangerous at implementation time?', vi: 'Vì sao TBD chưa giải nguy hiểm lúc hiện thực?', lc: [['a', 'Developers and testers will guess, often differently from what the customer wants'], ['b', 'They slow the compiler'], ['c', 'They are not dangerous'], ['d', 'They make the SRS longer']], dap: 'a', giai: ['Guessing produces wrong behaviour.', 'Đoán ⇒ hành vi sai.'] },
  ],
  goiY: ['Hoãn, hoặc thiết kế để dễ đổi.', 'TBD phải có người phụ trách và hạn.'],
  loiHayGap: ['Để dev đoán giá trị.', 'Hard-code giá trị tạm rồi quên.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('tbd'),
  khaiNiem: ['TBDs'],
});

const E2 = phanLoai({
  tieuDe: 'TBD 2 — screens in the SRS: benefit or risk?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Putting UI designs in the SRS has trade-offs. Benefits: mock-ups and wireframes make requirements tangible. Risks: screens describe solutions, may not be true requirements, bloat the document, and change often; screen layouts do not replace written requirements — developers should not have to deduce functionality and data from screenshots.</p>', vi: '<p>Đưa thiết kế giao diện vào SRS: lợi và hại.</p>' },
  cot: 'Effect', luaChon: ['Benefit', 'Risk'],
  hang: [
    ['Users understand the requirements faster when they see a wireframe.', 'Benefit'],
    ['Developers build exactly the pixels shown and miss the validation rules nobody wrote down.', 'Risk'],
    ['Every small layout change forces a new SRS version through change control.', 'Risk'],
    ['A mock-up reveals a missing field during the review.', 'Benefit'],
    ['The screenshots double the size of the document.', 'Risk'],
  ],
  giaiThich: '<p>If specific screens are genuinely required (e.g. a regulated form), state them as requirements; otherwise keep layouts in a separate UI specification or prototype and reference them.</p>',
  goiY: ['Làm yêu cầu cụ thể, dễ hiểu ⇒ lợi.', 'Thay thế yêu cầu viết, làm phình tài liệu ⇒ hại.'],
  loiHayGap: ['Thay toàn bộ yêu cầu bằng ảnh chụp màn hình.', 'Cấm mọi mock-up.'],
  thuatNgu: tn('wireframe', 'srs'),
  khaiNiem: ['UI in the SRS'],
});

const E3 = phanLoai({
  tieuDe: 'TBD 3 — where in Figure 10-2?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Figure 10-2 organises the SRS: 1 Introduction (purpose, conventions, scope, references) · 2 Overall description (perspective, user classes, environment, constraints, documentation, assumptions) · 3 System features (each with description, priority, functional requirements) · 4 Data requirements · 5 External interfaces (user, software, hardware, communications) · 6 Quality attributes · 7 Internationalization · 8 Other · Appendix A Glossary · Appendix B Analysis models. Where does each item go?</p>', vi: '<p>Mỗi mục thuộc phần nào của Hình 10-2?</p>' },
  cot: 'Section', luaChon: ['1.2 Document conventions', '1.4 References', '2.6 User documentation', '3.x Feature: description and priority', '5.3 Hardware interfaces', '5.4 Communications interfaces', '7 Internationalization and localization', 'Appendix A Glossary', 'Appendix B Analysis models'],
  hang: [
    ['"Bold text marks requirements still under review."', '1.2 Document conventions'],
    ['Link to the Vision and Scope document v1.2 and the ISO 29148 standard.', '1.4 References'],
    ['An online help system and a printed quick-start guide will be delivered.', '2.6 User documentation'],
    ['"Online booking — High priority: lets patients book any free slot of the next 14 days."', '3.x Feature: description and priority'],
    ['The kiosk reads NFC wristbands through the vendor’s USB reader.', '5.3 Hardware interfaces'],
    ['All messages to the SMS gateway use HTTPS with TLS 1.3.', '5.4 Communications interfaces'],
    ['Prices are shown in VND, dates as dd/mm/yyyy; the UI exists in Vietnamese and English.', '7 Internationalization and localization'],
    ['"No-show: a booked patient who has not checked in 15 minutes after the start."', 'Appendix A Glossary'],
    ['The state diagram of an appointment.', 'Appendix B Analysis models'],
  ],
  giaiThich: '<p>Knowing the template by heart is a common exam requirement; it is also a checklist of information to elicit.</p>',
  goiY: ['Định nghĩa thuật ngữ ⇒ Glossary.', 'Giao thức truyền thông ⇒ 5.4; thiết bị ⇒ 5.3.'],
  loiHayGap: ['Đặt sơ đồ trạng thái vào section 3.', 'Đặt định dạng tiền tệ vào quality attributes.'],
  thuatNgu: tn('srs'),
  khaiNiem: ['SRS template'],
});

const E4 = phanLoai({
  tieuDe: 'TBD 4 — more or less formal specification on an agile project?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>How much written specification an agile team needs depends on: whether just-in-time conversation can supply the details; whether informal communication keeps the team synchronised across time and space; whether requirements knowledge must be retained for maintenance, verification, audit, certification or contracts; and whether acceptance tests can serve as the detailed requirements. For each situation, does it push toward <b>more</b> or <b>less</b> written detail?</p>', vi: '<p>Mỗi tình huống đẩy về phía tài liệu chi tiết hơn hay ít hơn?</p>' },
  cot: 'Pushes toward', luaChon: ['More written detail', 'Less written detail'],
  hang: [
    ['The product owner sits with the team every day.', 'Less written detail'],
    ['The team is split between Hanoi and Berlin.', 'More written detail'],
    ['The medical device must be certified by a regulator.', 'More written detail'],
    ['Automated acceptance tests describe each story precisely.', 'Less written detail'],
    ['Another company will maintain the system for ten years.', 'More written detail'],
  ],
  giaiThich: '<p>Agile is not "no documentation": it is the minimum that guides the team, plus whatever the context (distance, regulation, maintenance) demands.</p>',
  goiY: ['Xa nhau, kiểm định, bàn giao bảo trì ⇒ nhiều hơn.', 'PO ngồi cạnh, test chấp nhận rõ ⇒ ít hơn.'],
  loiHayGap: ['Cho rằng agile luôn ít tài liệu bất kể bối cảnh.', 'Viết tài liệu dày chỉ vì "quy định công ty".'],
  thuatNgu: tn('acceptanceCriteria', 'userStory'),
  khaiNiem: ['specification on agile projects'],
});

export default moDun({
  slug: 'swr302-5-3-ch10-tbd-template-agile',
  ten: '5.3 TBDs, UI, the SRS template and agile',
  moTaModule: 'Xử lý TBD khi buộc phải làm tiếp, lợi/hại của đưa màn hình vào SRS, xếp 9 mục vào Hình 10-2 (conventions, references, giao diện phần cứng/truyền thông, i18n, phụ lục), mức tài liệu cho đội agile.',
  de: [E1, E2, E3, E4],
});
