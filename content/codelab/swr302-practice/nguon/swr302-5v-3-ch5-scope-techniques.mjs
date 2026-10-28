/**
 * SWR302 · 2.6 — Scope-representation techniques: context diagram, ecosystem map, feature tree, event list; keeping scope in focus (Wiegers Ch.5 slides 28–40).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Scope techniques 1 — which representation?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers gives four ways to represent scope: the <b>context diagram</b> (the system and its direct external entities), the <b>ecosystem map</b> (all related systems and the flows between them, even those not touching ours), the <b>feature tree</b> (major features broken into sub-features) and the <b>event list</b> (external events the system must respond to).</p>', vi: '<p>Wiegers đưa bốn cách biểu diễn phạm vi: <b>context diagram</b> (hệ thống và các thực thể ngoài trực tiếp), <b>ecosystem map</b> (mọi hệ thống liên quan và luồng giữa chúng, kể cả cái không chạm hệ thống mình), <b>feature tree</b> (tính năng chính chia thành tính năng con) và <b>event list</b> (sự kiện bên ngoài hệ thống phải phản hồi).</p>' },
  cau: [
    { en: 'You need to show that the library system exchanges data with the student information system, which itself feeds the finance system that our system never touches.', vi: 'Bạn cần cho thấy hệ thống thư viện trao đổi dữ liệu với hệ thống thông tin sinh viên, hệ thống này lại cấp dữ liệu cho hệ thống tài chính mà hệ thống ta không chạm tới.', lc: [['a', 'Context diagram'], ['b', 'Ecosystem map'], ['c', 'Feature tree'], ['d', 'Event list']], dap: 'b', giai: ['Only the ecosystem map shows flows between other systems.', 'Chỉ ecosystem map thể hiện luồng giữa các hệ thống khác.'] },
    { en: 'The sponsor wants a one-page picture of the main capabilities of release 1 and release 2, grouped by area.', vi: 'Nhà tài trợ muốn một trang hình các khả năng chính của bản 1 và bản 2, gom theo mảng.', lc: [['a', 'Feature tree'], ['b', 'Context diagram'], ['c', 'Event list'], ['d', 'DFD']], dap: 'a', giai: ['A feature tree shows features and sub-features; colour or marks can show the release.', 'Feature tree thể hiện tính năng và tính năng con; có thể đánh dấu bản phát hành.'] },
    { en: 'You must list everything that can happen outside the system and requires a response: a user request, a sensor signal, a date arriving.', vi: 'Bạn phải liệt kê mọi điều xảy ra bên ngoài hệ thống cần hệ thống phản hồi: yêu cầu người dùng, tín hiệu cảm biến, một mốc thời gian đến.', lc: [['a', 'Event list'], ['b', 'Feature tree'], ['c', 'Ecosystem map'], ['d', 'Use case diagram']], dap: 'a', giai: ['Business, signal and temporal events form the event list.', 'Sự kiện nghiệp vụ, tín hiệu và thời gian tạo thành event list.'] },
    { en: 'You want to show who is outside the system and what data crosses the boundary.', vi: 'Bạn muốn thể hiện ai ở ngoài hệ thống và dữ liệu nào đi qua biên.', lc: [['a', 'Context diagram'], ['b', 'Feature tree'], ['c', 'State diagram'], ['d', 'Event list']], dap: 'a', giai: ['That is exactly the context diagram.', 'Đúng là context diagram.'] },
  ],
  goiY: ['Luồng giữa các hệ thống KHÁC ⇒ ecosystem map.', 'Tính năng và tính năng con ⇒ feature tree; điều xảy ra cần phản hồi ⇒ event list.'],
  loiHayGap: ['Dùng context diagram để vẽ luồng giữa hai hệ thống bên ngoài.', 'Nhầm feature tree với sơ đồ phân rã chức năng chi tiết.'],
  giaiThich: '<p>Answers: b · a · a · a.</p>',
  thuatNgu: [...tn('contextDiagram'), { en: 'ecosystem map', vi: 'bản đồ hệ sinh thái — mọi hệ thống liên quan và luồng giữa chúng' }, { en: 'feature tree', vi: 'cây tính năng' }, { en: 'event list', vi: 'danh sách sự kiện bên ngoài cần hệ thống phản hồi' }],
  khaiNiem: ['scope representation'],
});

const E2 = phanLoai({
  tieuDe: 'Scope techniques 2 — business, signal or temporal event?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>An event list classifies external events: a <b>business event</b> (a person or system does something that requires a response), a <b>signal event</b> (a sensor, device or system sends a signal), and a <b>temporal event</b> (a time or date arrives). Classify the events of a smart-locker system.</p>', vi: '<p>Event list phân loại sự kiện bên ngoài: <b>business event</b> (người hoặc hệ thống làm gì đó cần phản hồi), <b>signal event</b> (cảm biến, thiết bị, hệ thống gửi tín hiệu), <b>temporal event</b> (một thời điểm/ngày tới). Phân loại sự kiện của hệ thống tủ khoá thông minh.</p>' },
  cot: 'Event type', luaChon: ['Business event', 'Signal event', 'Temporal event'],
  hang: [
    ['A student reserves a locker compartment in the app.', 'Business event'],
    ['The door sensor reports that a compartment was opened.', 'Signal event'],
    ['At 23:59 every day, the reservations that were never used expire.', 'Temporal event'],
    ['The courier scans a parcel at the locker.', 'Business event'],
    ['The locker’s battery sensor reports a level below 15%.', 'Signal event'],
    ['72 hours after delivery, an uncollected parcel must be returned to the sender.', 'Temporal event'],
    ['The payment gateway sends the result of a payment.', 'Signal event'],
  ],
  giaiThich: '<p>People acting ⇒ business events; devices or systems signalling ⇒ signal events (a gateway callback is a signal); the clock ⇒ temporal events. Temporal events are the ones teams forget.</p>',
  goiY: ['Có NGƯỜI chủ động làm gì? ⇒ business event.', 'Thiết bị/hệ thống báo tín hiệu ⇒ signal; đồng hồ/lịch ⇒ temporal.'],
  loiHayGap: ['Bỏ sót sự kiện thời gian (hết hạn, nhắc nhở).', 'Coi kết quả thanh toán từ cổng thanh toán là business event của người dùng.'],
  thuatNgu: [{ en: 'business / signal / temporal event', vi: 'sự kiện nghiệp vụ / tín hiệu / thời gian' }],
  khaiNiem: ['event list'],
});

const E3 = phanLoai({
  tieuDe: 'Scope techniques 3 — keeping scope in focus',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>A new request arrives in the middle of the smart-locker project. The vision: <i>"For students who receive parcels, the CampusLocker lets them collect parcels 24/7 from a locker near their dorm."</i> Business objective: <i>"Cut the parcel-collection queue at the mail room by 80% in one semester."</i> For each request decide: <b>In scope</b>, <b>Later release</b> (fits the vision but not this release’s objective) or <b>Out of scope</b> (does not fit the vision).</p>', vi: '<p>Có yêu cầu mới giữa dự án tủ khoá. Tầm nhìn và mục tiêu nghiệp vụ ở bản tiếng Anh. Với mỗi yêu cầu: <b>In scope</b> (trong phạm vi), <b>Later release</b> (hợp tầm nhìn nhưng không phục vụ mục tiêu bản này) hay <b>Out of scope</b> (không hợp tầm nhìn).</p>' },
  cot: 'Decision', luaChon: ['In scope', 'Later release', 'Out of scope'],
  hang: [
    ['Notify the student by SMS when the parcel is in the locker.', 'In scope'],
    ['Let students SEND parcels from the locker to other cities.', 'Later release'],
    ['Sell snacks from a vending module attached to the locker.', 'Out of scope'],
    ['Let the mail room assign a compartment to each incoming parcel.', 'In scope'],
    ['Let students rate the delivery company.', 'Later release'],
    ['Show campus news on the locker screen to earn advertising money.', 'Out of scope'],
  ],
  giaiThich: '<p>Test every request against the vision (does it belong to this product at all?) and against the business objective of the release (does it help cut the queue now?). Requests that pass the first test only go to a later release.</p>',
  goiY: ['Câu hỏi 1: có hợp tầm nhìn sản phẩm không? Không ⇒ Out of scope.', 'Câu hỏi 2: có giúp mục tiêu của bản này (giảm hàng chờ) không? Không ⇒ Later release.'],
  loiHayGap: ['Nhận mọi yêu cầu "hay" vào bản hiện tại.', 'Loại bỏ mọi thứ không thuộc bản này thay vì để cho bản sau.'],
  thuatNgu: tn('scope', 'scopeCreep', 'visionScope'),
  khaiNiem: ['scope management'],
});

export default moDun({
  slug: 'swr302-5v-3-ch5-scope-techniques',
  ten: '2.6 Scope techniques: ecosystem map, feature tree, event list',
  moTaModule: 'Bốn cách biểu diễn phạm vi (context diagram, ecosystem map, feature tree, event list), phân loại sự kiện nghiệp vụ / tín hiệu / thời gian, giữ phạm vi bằng tầm nhìn và mục tiêu nghiệp vụ.',
  de: [E1, E2, E3],
});
