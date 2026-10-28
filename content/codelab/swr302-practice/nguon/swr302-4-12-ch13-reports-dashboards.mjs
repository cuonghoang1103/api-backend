/**
 * SWR302 · 4.10 — Specifying reports and dashboards (Wiegers Ch.13 slides 13–24).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Reports 1 — the parts of a report specification',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Wiegers’ report specification template covers, among others: report ID and title, purpose, priority, users, trigger, delivery and format, latency, layout, header/footer, report body (fields, sorting, totals), end-of-report indicator, interactivity, and security access. Put each sentence of the "Monthly overdue loans" report spec in its field.</p>', vi: '<p>Template đặc tả báo cáo của Wiegers gồm (một phần): mã và tên, mục đích, độ ưu tiên, người dùng, trigger, cách gửi và định dạng, độ trễ dữ liệu, bố cục, đầu/chân trang, thân báo cáo (trường, sắp xếp, tổng), chỉ báo hết báo cáo, tương tác, quyền truy cập. Đặt mỗi câu của đặc tả báo cáo "Monthly overdue loans" vào đúng trường.</p>' },
  cot: 'Field', luaChon: ['Purpose', 'Users', 'Trigger', 'Delivery and format', 'Latency', 'Report body', 'Security access', 'Interactivity'],
  hang: [
    ['Help the library director decide whether to change the fine policy.', 'Purpose'],
    ['Library director and head librarian.', 'Users'],
    ['Generated automatically at 06:00 on the first day of every month.', 'Trigger'],
    ['E-mailed as a PDF and available as an .xlsx download.', 'Delivery and format'],
    ['Data no older than the end of the previous day.', 'Latency'],
    ['One row per overdue loan: reader, title, days overdue, fine; sorted by days overdue, descending; total fine at the end.', 'Report body'],
    ['Only staff with the Manager role can open it, because it shows readers’ names.', 'Security access'],
    ['Clicking a reader opens the reader’s loan history.', 'Interactivity'],
  ],
  giaiThich: '<p>A report spec answers who needs it and why, when and how it is produced, what it contains and how it is ordered and totalled, how fresh the data is, and who may see it.</p>',
  goiY: ['Vì sao cần ⇒ purpose; khi nào sinh ⇒ trigger; dữ liệu cũ tới mức nào ⇒ latency.', 'Trường, sắp xếp, tổng ⇒ report body.'],
  loiHayGap: ['Nhầm trigger với latency.', 'Bỏ quyền truy cập dù báo cáo có dữ liệu cá nhân.'],
  thuatNgu: [{ en: 'report specification', vi: 'đặc tả báo cáo' }, { en: 'latency', vi: 'độ trễ — dữ liệu trong báo cáo cũ tới mức nào' }],
  khaiNiem: ['report specification'],
});

const E2 = tracNghiem({
  tieuDe: 'Reports 2 — questions to elicit a report',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers suggests eliciting reports by asking about their use (who, why, what decisions) and then their content: data sources and selection criteria, user-selectable parameters, calculations, sorting, page breaks and totals, behaviour with no data, ad hoc reporting, and whether it can be a template for similar reports.</p>', vi: '<p>Wiegers gợi ý khai thác báo cáo bằng cách hỏi về việc dùng (ai, vì sao, quyết định gì) rồi về nội dung: nguồn dữ liệu và tiêu chí chọn, tham số người dùng chọn, phép tính, sắp xếp, ngắt trang và tổng, hành vi khi không có dữ liệu, báo cáo tuỳ biến, và có làm mẫu cho báo cáo tương tự được không.</p>' },
  cau: [
    { en: 'Which question should be asked FIRST?', vi: 'Câu hỏi nào nên hỏi TRƯỚC?', lc: [['a', 'Which font should the report use?'], ['b', 'What decision will this report help you make?'], ['c', 'How many pages should it have?'], ['d', 'Which colour for the header?']], dap: 'b', giai: ['Purpose first; layout later.', 'Mục đích trước; bố cục sau.'] },
    { en: 'A report shows nothing when no loan is overdue. The spec should…', vi: 'Báo cáo không hiện gì khi không có lượt quá hạn. Đặc tả nên…', lc: [['a', 'ignore this case'], ['b', 'state what the report shows when no data is returned (e.g. "No overdue loans this month")'], ['c', 'show an error'], ['d', 'not send the report']], dap: 'b', giai: ['The empty case is a requirement.', 'Trường hợp rỗng cũng là một yêu cầu.'] },
    { en: 'A dashboard differs from a report mainly because it…', vi: 'Dashboard khác báo cáo chủ yếu vì nó…', lc: [['a', 'is printed'], ['b', 'shows several key indicators at a glance, often updated frequently, with drill-down'], ['c', 'has no data'], ['d', 'is only for developers']], dap: 'b', giai: ['Dashboards show multiple indicators at once.', 'Dashboard hiện nhiều chỉ số cùng lúc.'] },
  ],
  goiY: ['Bắt đầu từ quyết định mà báo cáo phục vụ.', 'Luôn hỏi "khi không có dữ liệu thì sao?".'],
  loiHayGap: ['Bắt đầu bằng bố cục, màu sắc.', 'Quên trường hợp không có dữ liệu.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: [{ en: 'dashboard', vi: 'bảng điều khiển — nhiều chỉ số chính trên một màn hình' }, { en: 'drill-down', vi: 'bấm vào để xem chi tiết hơn' }],
  khaiNiem: ['report elicitation', 'dashboards'],
});

const E3 = phanLoai({
  tieuDe: 'Reports 3 — write the report body from a request',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>The canteen manager asks: <i>"Every Monday I want last week’s sales per dish, best sellers first, with the quantity, the revenue and the share of total revenue, a total line at the end, and one page per canteen."</i> Classify each element of the request.</p>', vi: '<p>Quản lý căng-tin yêu cầu (bản tiếng Anh): mỗi thứ Hai muốn doanh số tuần trước theo món, món bán chạy trước, có số lượng, doanh thu và tỉ trọng, dòng tổng ở cuối, mỗi căng-tin một trang. Phân loại từng phần của yêu cầu.</p>' },
  cot: 'Element', luaChon: ['Trigger', 'Selection criterion', 'Field', 'Calculated field', 'Sort order', 'Total', 'Page break'],
  hang: [
    ['Every Monday', 'Trigger'],
    ['last week’s sales', 'Selection criterion'],
    ['the quantity sold of each dish', 'Field'],
    ['the share of total revenue', 'Calculated field'],
    ['best sellers first', 'Sort order'],
    ['a total line at the end', 'Total'],
    ['one page per canteen', 'Page break'],
  ],
  giaiThich: '<p>Turning a sentence into trigger, selection, fields, calculations, sorting, totals and page breaks is exactly what the report body of the template asks for.</p>',
  goiY: ['"Mỗi thứ Hai" ⇒ trigger; "tuần trước" ⇒ tiêu chí chọn dữ liệu.', 'Tỉ trọng phải tính ra ⇒ calculated field.'],
  loiHayGap: ['Coi "tuần trước" là trigger.', 'Coi tỉ trọng là trường lưu sẵn.'],
  thuatNgu: [{ en: 'selection criterion', vi: 'tiêu chí chọn dữ liệu' }, { en: 'calculated field', vi: 'trường tính toán' }],
  khaiNiem: ['report body'],
});

const E4 = tracNghiem({
  tieuDe: 'Reports 4 — dashboards',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Wiegers: a dashboard is a screen or report that shows several key indicators at once — often charts, gauges and tables — so a user can see the state of the business at a glance and drill down for detail. Specify each element: its data, its refresh rate, its thresholds and colours, and what clicking it does.</p>', vi: '<p>Wiegers: dashboard là màn hình/báo cáo hiện nhiều chỉ số chính cùng lúc — biểu đồ, đồng hồ đo, bảng — để người dùng nhìn là thấy tình hình và bấm vào xem chi tiết. Đặc tả từng phần tử: dữ liệu, tần suất làm mới, ngưỡng và màu, bấm vào thì làm gì.</p>' },
  cau: [
    { en: 'A gauge "today’s orders" turns red below 300 orders. This is its…', vi: 'Đồng hồ "đơn hôm nay" chuyển đỏ khi dưới 300 đơn. Đây là… của nó', lc: [['a', 'refresh rate'], ['b', 'threshold'], ['c', 'drill-down'], ['d', 'security']], dap: 'b', giai: ['Thresholds and colours must be specified.', 'Ngưỡng và màu phải được đặc tả.'] },
    { en: '"The sales tile is updated every 5 minutes." This is its…', vi: '"Ô doanh số cập nhật mỗi 5 phút." Đây là… của nó', lc: [['a', 'refresh rate (latency)'], ['b', 'threshold'], ['c', 'layout'], ['d', 'purpose']], dap: 'a', giai: ['How fresh the data must be.', 'Dữ liệu phải mới tới mức nào.'] },
    { en: 'Clicking the "late deliveries" chart shows the list of late orders. This is…', vi: 'Bấm vào biểu đồ "giao trễ" hiện danh sách đơn trễ. Đây là…', lc: [['a', 'drill-down'], ['b', 'a business rule'], ['c', 'a trigger'], ['d', 'a constraint']], dap: 'a', giai: ['From the indicator to the details.', 'Từ chỉ số xuống chi tiết.'] },
  ],
  goiY: ['Ngưỡng và màu, tần suất làm mới, bấm vào làm gì — mỗi phần tử đều cần.', 'Drill-down = xem chi tiết đằng sau một chỉ số.'],
  loiHayGap: ['Đặc tả dashboard chỉ bằng ảnh chụp mock-up.', 'Quên tần suất làm mới.'],
  giaiThich: '<p>Answers: b · a · a.</p>',
  thuatNgu: [{ en: 'dashboard', vi: 'bảng điều khiển' }, { en: 'drill-down', vi: 'xem chi tiết' }, { en: 'threshold', vi: 'ngưỡng' }],
  khaiNiem: ['dashboards'],
});

export default moDun({
  slug: 'swr302-4-12-ch13-reports-dashboards',
  ten: '4.12 Specifying reports and dashboards',
  moTaModule: 'Các trường của đặc tả báo cáo Wiegers (mục đích, người dùng, trigger, định dạng, độ trễ, thân báo cáo, quyền), câu hỏi khai thác báo cáo, khác biệt báo cáo và dashboard.',
  de: [E1, E2, E3, E4],
});
