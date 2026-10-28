/**
 * SWR302 · 22P.2 — Requirements for implementing a packaged solution (Wiegers Ch.22 slides 11–18).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'COTS implementation 1 — which kind of implementation requirement?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Five kinds of requirements for implementing a package: <b>configuration</b> (setting parameters), <b>integration</b> (interfaces with other applications), <b>extension</b> (new functionality to close a gap), <b>data</b> (mapping your data to the package’s) and <b>business process changes</b> (adapting your processes to the package). Classify.</p>', vi: '<p>Năm loại yêu cầu khi triển khai gói có sẵn.</p>' },
  cot: 'Kind', luaChon: ['Configuration', 'Integration', 'Extension', 'Data', 'Business process changes'],
  hang: [
    ['Set the slot length parameter to 15 minutes and opening hours to 07:00–20:00.', 'Configuration'],
    ['Send every e-prescription from the package to the national system.', 'Integration'],
    ['Build a custom family-booking module because the package has none.', 'Extension'],
    ['Map our "visit type" codes to the package’s "service category" field.', 'Data'],
    ['Receptionists will confirm bookings in the package instead of in a paper book.', 'Business process changes'],
  ],
  giaiThich: '<p>Most successful COTS implementations rely on configuration; extensions should be the exception.</p>',
  goiY: ['Đặt tham số ⇒ configuration.', 'Viết thêm module ⇒ extension.'],
  loiHayGap: ['Gọi ánh xạ dữ liệu là integration.', 'Coi thay đổi quy trình không phải yêu cầu.'],
  thuatNgu: [{ en: 'COTS', vi: 'phần mềm thương mại có sẵn' }],
  khaiNiem: ['COTS implementation requirements'],
});

const E2 = phanLoai({
  tieuDe: 'COTS implementation 2 — what to do with each gap',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>For each gap between what you need and what the package delivers, decide: <b>ignore it</b> (drop the requirement and live with the tool), <b>change your process</b> (do it outside the solution), or <b>build a bridge</b> (extend the package). Choose the most reasonable option.</p>', vi: '<p>Với mỗi khoảng trống: bỏ qua, đổi quy trình, hay xây cầu nối (mở rộng)?</p>' },
  cot: 'Decision', luaChon: ['Ignore it', 'Change your process', 'Build a bridge'],
  hang: [
    ['The package’s report header cannot show the clinic’s second logo.', 'Ignore it'],
    ['The package cannot send the legally required e-prescription to the national system.', 'Build a bridge'],
    ['The package requires payment before printing an invoice; today staff print first and collect later.', 'Change your process'],
    ['The package lists appointments by time, not grouped by doctor as staff are used to.', 'Change your process'],
  ],
  giaiThich: '<p>Extend only where a gap blocks a business objective or a legal requirement; otherwise adapt or accept.</p>',
  goiY: ['Bắt buộc theo luật ⇒ xây cầu nối.', 'Chỉ là thói quen ⇒ đổi quy trình.'],
  loiHayGap: ['Tuỳ biến mọi khác biệt nhỏ.', 'Bỏ qua yêu cầu pháp lý.'],
  thuatNgu: [{ en: 'customization', vi: 'tuỳ biến' }],
  khaiNiem: ['handling COTS gaps'],
});

const E3 = tracNghiem({
  tieuDe: 'COTS implementation 3 — configuration and process',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Define configuration requirements one process flow, use case or story at a time, walking through the vendor’s documentation. A package is usually chosen to be cheaper than custom software — so the organisation adapts its processes to the package, the reverse of custom development.</p>', vi: '<p>Định nghĩa yêu cầu cấu hình theo từng quy trình/use case; tổ chức thích nghi với gói.</p>' },
  cau: [
    { en: 'How should the team define configuration requirements?', vi: 'Đội nên định nghĩa yêu cầu cấu hình thế nào?', lc: [['a', 'One process flow or use case at a time, using the vendor’s manuals'], ['b', 'All at once from memory'], ['c', 'Let the vendor guess'], ['d', 'Skip configuration']], dap: 'a', giai: ['Systematic walkthrough.', 'Đi qua có hệ thống.'] },
    { en: 'In a COTS project, who usually adapts to whom?', vi: 'Trong dự án gói có sẵn, ai thường thích nghi với ai?', lc: [['a', 'The organisation’s processes adapt to the package'], ['b', 'The package is rewritten to match every process'], ['c', 'Nobody adapts'], ['d', 'The vendor adapts to every customer']], dap: 'a', giai: ['Otherwise, build custom.', 'Nếu không, hãy tự làm.'] },
  ],
  goiY: ['Từng quy trình một.', 'Quy trình thích nghi với gói.'],
  loiHayGap: ['Viết lại gói cho khớp quy trình cũ.', 'Cấu hình tuỳ hứng.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'configuration', vi: 'cấu hình' }],
  khaiNiem: ['configuration requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'COTS implementation 4 — users and expectations',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>As with any project, engage users in selection or early implementation so their needs are met — otherwise they may reject the solution. A package that looks great in a demo may not behave as expected after installation.</p>', vi: '<p>Mời người dùng tham gia chọn và triển khai sớm.</p>' },
  cau: [
    { en: 'How do you reduce the risk that users reject the package?', vi: 'Giảm rủi ro người dùng từ chối gói thế nào?', lc: [['a', 'Involve them in selection and early implementation'], ['b', 'Choose it without them'], ['c', 'Hide it until go-live'], ['d', 'Only train managers']], dap: 'a', giai: ['User involvement.', 'Người dùng tham gia.'] },
  ],
  goiY: ['Người dùng tham gia sớm.', 'Đừng chỉ tin demo.'],
  loiHayGap: ['Chọn gói không hỏi người dùng.', 'Chỉ đào tạo quản lý.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('userClass'),
  khaiNiem: ['COTS adoption'],
});

export default moDun({
  slug: 'swr302-22p-2-ch22-implementing',
  ten: '12.4 Implementing a packaged solution',
  moTaModule: 'Năm loại yêu cầu triển khai gói có sẵn (cấu hình, tích hợp, mở rộng, dữ liệu, thay đổi quy trình), xử lý từng khoảng trống (bỏ qua / đổi quy trình / xây cầu nối), cấu hình theo quy trình, người dùng tham gia.',
  de: [E1, E2, E3, E4],
});
