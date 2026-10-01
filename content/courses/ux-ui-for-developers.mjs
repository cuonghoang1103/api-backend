/**
 * UX/UI cho lập trình viên — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: tailwind-css (Ch6 biến CSS làm theme, Ch9 khả năng tiếp cận ĐO THẬT ở mức CSS), react Ch8 (a11y trong
 * component), nextjs Ch13 (Tailwind/dark mode/theme trong Next), web-foundations Ch3/Ch12 (CSS). Khoá này dạy THIẾT KẾ:
 * nghiên cứu người dùng, luồng, wireframe, Figma, thị giác, design system/token, WCAG ở mức thiết kế, viết chữ UX, kiểm thử
 * khả dụng — và bàn giao sang code. Chỗ chạm có bài "Nếu đã học …". Không dạy lại cú pháp Tailwind/React.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'frontend', name: 'Frontend', icon: 'Layout', sortOrder: 2 },
  course: {
    slug: 'ux-ui-for-developers',
    title: 'UX/UI for Developers',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/ux-ui-for-developers.png?v=4',
    shortDescription: 'Design skills for coders: UX principles, user research, flows, Figma wireframes and prototypes, typography, colour, grids, design tokens, accessibility (WCAG), dark mode, UX writing and usability testing — handed off to React.|||Kỹ năng thiết kế cho người viết code: nguyên lý UX, nghiên cứu người dùng, luồng, wireframe và prototype Figma, chữ, màu, lưới, design token, khả năng tiếp cận (WCAG), dark mode, viết chữ UX, usability test — bàn giao sang React.',
    description: 'Khoá UX/UI cho lập trình viên tự làm giao diện mà không có designer bên cạnh. Phần UX: nguyên lý (Norman, heuristics của Nielsen, các định luật UX), nghiên cứu người dùng nhanh và rẻ, persona, hành trình, kiến trúc thông tin, luồng người dùng. Phần UI: wireframe → prototype trong Figma (Auto Layout, component, variant), typography, màu và độ tương phản, khoảng cách và lưới, phân cấp thị giác, icon và hình ảnh, chuyển động có mục đích. Phần hệ thống: design system, design token, dark mode, responsive và mobile-first. Khả năng tiếp cận theo WCAG 2.2 ở mức thiết kế, viết chữ UX tiếng Việt, trạng thái rỗng/lỗi/đang tải, form, kiểm thử khả dụng và đo bằng dữ liệu. Dự án cuối: thiết kế lại một luồng thật của cuongthai.com hoặc LabFlow từ nghiên cứu tới Figma tới code React + Tailwind.',
    whatYouLearn: 'Phỏng vấn và quan sát người dùng để tìm vấn đề thật; vẽ luồng, wireframe và prototype bấm được trong Figma; chọn chữ, màu, khoảng cách theo thang có hệ thống; dựng design system với token dùng chung giữa Figma và code; thiết kế đạt WCAG 2.2 AA; làm dark mode đúng; viết nhãn, thông báo lỗi và trạng thái rỗng dễ hiểu; tổ chức một buổi usability test và sửa theo kết quả; bàn giao thiết kế sang React/Tailwind không lệch.',
    requirements: 'Biết HTML/CSS cơ bản và đã làm một giao diện web (React là lợi thế). Không cần năng khiếu vẽ. Cần tài khoản Figma miễn phí. Nên học trước Nền tảng Web; học song song hoặc sau React và Tailwind CSS.',
    documentsNote: 'Tài liệu chính: "The Design of Everyday Things" (Don Norman) • nngroup.com (Nielsen Norman Group) • "Refactoring UI" (Wathan & Schoger) • "Don’t Make Me Think" (Steve Krug) • w3.org/WAI/WCAG22 và w3.org/WAI/ARIA/apg • help.figma.com • m3.material.io và developer.apple.com/design/human-interface-guidelines • lawsofux.com • designtokens.org (W3C Design Tokens Community Group).',
  },
  sections: khung('uxui', [
    ['Section 0 — Why developers should learn design', 'Mục 0 — Vì sao lập trình viên nên học thiết kế', 'UX/UI là gì bằng lời đời thường, lịch sử, sự cố thật, và chuẩn bị công cụ.', [
      ['bat-dau-tai-day', 'Start here (1/2) — UX and UI in everyday words, their history, and design failures with real consequences', 'Bắt đầu tại đây (1/2) — UX và UI bằng lời đời thường, lịch sử, và những thất bại thiết kế có hậu quả thật', 'UI là cái nhìn thấy, UX là cảm giác khi dùng · Xerox PARC → Macintosh 1984 → "The Design of Everyday Things" (1988) → 10 heuristics của Nielsen (1994) → iPhone 2007 → Figma (ra mắt công khai 2016) · Hawaii 13/01/2018: báo động tên lửa nhầm, giao diện chọn cảnh báo bị chỉ trích rộng rãi · Robles kiện Domino’s: website không dùng được với trình đọc màn hình (Tối cao Pháp viện Mỹ từ chối thụ lý kháng cáo, 2019)'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Tự làm giao diện trông chuyên nghiệp và dễ dùng · Nói chuyện được với designer, đọc được file Figma · Vị trí: frontend, product engineer, UX engineer · Lộ trình: web-foundations → khoá này ↔ react/tailwind-css → seo-analytics · Cách học: mỗi chương thiết kế lại một màn hình thật'],
      ['cai-dat', 'Tools: Figma, plugins, and a React + Tailwind playground', 'Công cụ: Figma, plugin, và sân chơi React + Tailwind', 'Figma miễn phí, gói giáo dục · Plugin kiểm tương phản, Iconify · Excalidraw vẽ luồng · Dự án Vite/Next + Tailwind để dựng lại thiết kế'],
      ['mat-nhin', 'Training your eye: redesigning a screen in 30 minutes', 'Luyện mắt: thiết kế lại một màn hình trong 30 phút', 'Chụp một màn hình mình từng làm · Tìm 10 lỗi theo danh sách · Sửa bằng khoảng cách, cỡ chữ, màu · So trước/sau'],
    ]],
    ['Chapter 1 — UX principles', 'Chương 1 — Nguyên lý UX', 'Vì sao người dùng làm (hoặc không làm) điều bạn muốn.', [
      ['norman', 'Affordances, signifiers, feedback and mental models', 'Affordance, dấu hiệu, phản hồi và mô hình tư duy', 'Cửa kéo hay đẩy · Nút trông như nút · Phản hồi mỗi hành động · Mô hình của người dùng vs của lập trình viên'],
      ['heuristics', 'Nielsen’s 10 usability heuristics', '10 heuristics khả dụng của Nielsen', 'Hiển thị trạng thái, khớp thế giới thật, kiểm soát, nhất quán, phòng lỗi… · Đánh giá heuristic một trang của cuongthai.com'],
      ['dinh-luat', 'Laws of UX: Fitts, Hick, Jakob, Miller, Tesler', 'Các định luật UX: Fitts, Hick, Jakob, Miller, Tesler', 'Nút to và gần · Ít lựa chọn hơn · Người dùng quen với web khác · Độ phức tạp không biến mất, chỉ chuyển chỗ'],
      ['tam-ly', 'Cognitive load, attention and dark patterns', 'Tải nhận thức, sự chú ý và dark pattern', 'Người dùng quét chứ không đọc (mẫu chữ F) · Dark pattern: huỷ gói khó, tick sẵn · Vì sao không nên dùng dù tăng số liệu'],
    ]],
    ['Chapter 2 — User research on a budget', 'Chương 2 — Nghiên cứu người dùng khi ít tiền', 'Hiểu người dùng trước khi vẽ.', [
      ['phong-van', 'User interviews that do not lie', 'Phỏng vấn người dùng không bị nói dối', 'Hỏi về quá khứ, không hỏi "bạn có dùng không" · The Mom Test (Rob Fitzpatrick) · Kịch bản 20 phút · Ghi chép và xin phép ghi âm'],
      ['quan-sat', 'Observation, surveys and analytics as research', 'Quan sát, khảo sát và analytics như nghiên cứu', 'Ngồi xem bạn cùng lớp dùng app · Câu hỏi khảo sát không dẫn dắt · Heatmap/session replay và quyền riêng tư · Trỏ seo-analytics'],
      ['tong-hop', 'Synthesis: affinity maps, personas and jobs to be done', 'Tổng hợp: affinity map, persona và jobs to be done', 'Gom ghi chú thành nhóm · Persona dựa trên dữ liệu, không bịa · "Khi…, tôi muốn…, để…"'],
      ['hanh-trinh', 'Journey maps and problem statements', 'Bản đồ hành trình và phát biểu vấn đề', 'Các bước, cảm xúc, điểm đau · How might we · Chọn một vấn đề để giải'],
    ]],
    ['Chapter 3 — Information architecture and flows', 'Chương 3 — Kiến trúc thông tin và luồng', 'Sắp xếp nội dung và các bước.', [
      ['ia', 'Information architecture: structure, labels, navigation', 'Kiến trúc thông tin: cấu trúc, nhãn, điều hướng', 'Sơ đồ trang · Card sorting · Điều hướng chính/phụ · Bài học: một tính năng đặt sai chỗ bằng như không có'],
      ['luong', 'User flows and task flows', 'Luồng người dùng và luồng tác vụ', 'Vẽ luồng đăng ký, mua gói Pro, nộp bài · Nhánh lỗi · Đếm số bước'],
      ['trang-thai', 'Designing every state: empty, loading, error, partial, success', 'Thiết kế mọi trạng thái: rỗng, đang tải, lỗi, một phần, thành công', 'Trạng thái rỗng dạy người dùng làm gì tiếp · Skeleton vs spinner · Lỗi có lối thoát'],
    ]],
    ['Chapter 4 — Wireframes and prototypes in Figma', 'Chương 4 — Wireframe và prototype trong Figma', 'Từ phác thảo tới bản bấm được.', [
      ['phac-thao', 'Sketching and low-fidelity wireframes', 'Phác thảo và wireframe độ trung thực thấp', 'Giấy bút trước · Crazy 8s · Wireframe xám để bàn cấu trúc, không bàn màu'],
      ['figma-co-ban', 'Figma essentials: frames, Auto Layout, constraints', 'Figma cơ bản: frame, Auto Layout, constraint', 'Auto Layout ≈ flexbox · Constraint cho responsive · Phím tắt hay dùng'],
      ['component', 'Components, variants and properties', 'Component, variant và property', 'Nút có trạng thái · Instance swap · Nghĩ như component React'],
      ['prototype', 'Interactive prototypes and sharing for feedback', 'Prototype tương tác và chia sẻ lấy góp ý', 'Kết nối màn hình · Smart Animate · Chia sẻ link, nhận bình luận · Prototype để test trước khi code'],
    ]],
    ['Chapter 5 — Visual design: typography, colour, spacing', 'Chương 5 — Thiết kế thị giác: chữ, màu, khoảng cách', 'Làm giao diện trông "xịn" bằng hệ thống, không bằng cảm hứng.', [
      ['chu', 'Typography: type scale, line height, font pairing, Vietnamese diacritics', 'Chữ: thang cỡ chữ, chiều cao dòng, phối font, dấu tiếng Việt', 'Thang tỉ lệ · 45–75 ký tự mỗi dòng · Font hỗ trợ đủ dấu tiếng Việt (kiểm ô vuông/dấu lệch) · next/font'],
      ['mau', 'Colour: palettes, semantic colours and contrast', 'Màu: bảng màu, màu theo ngữ nghĩa và độ tương phản', 'Thang 50–900 · Màu chính, trung tính, trạng thái · Tỉ lệ tương phản 4.5:1 · OKLCH nhập môn'],
      ['khoang-cach', 'Spacing, grids and layout', 'Khoảng cách, lưới và bố cục', 'Thang 4/8 · Lưới 12 cột · Khoảng trắng nhóm nội dung (Gestalt) · Nếu đã học tailwind-css Ch1: thang spacing — ở đây là vì sao chọn thang'],
      ['phan-cap', 'Visual hierarchy and composition', 'Phân cấp thị giác và bố cục', 'Cỡ, đậm, màu, vị trí · Một hành động chính mỗi màn · Làm mờ thứ phụ thay vì tô đậm thứ chính'],
      ['icon-anh', 'Icons, illustrations, images and motion', 'Icon, minh hoạ, hình ảnh và chuyển động', 'Một bộ icon nhất quán · Ảnh có tỉ lệ cố định chống nhảy layout · Chuyển động 150–300ms có mục đích · prefers-reduced-motion'],
    ]],
    ['Chapter 6 — Design systems and tokens', 'Chương 6 — Design system và token', 'Một nguồn sự thật cho màu, chữ, khoảng cách — ở cả Figma và code.', [
      ['design-system', 'What a design system is (and is not)', 'Design system là gì (và không là gì)', 'Nguyên tắc + token + component + tài liệu · Material, Apple HIG, Ant Design · Khi nào đội nhỏ cần'],
      ['token', 'Design tokens: primitive, semantic, component', 'Design token: nguyên thuỷ, ngữ nghĩa, component', 'blue-500 → color-primary → button-bg · Variables trong Figma · Chuẩn W3C Design Tokens (bản nháp cộng đồng)'],
      ['figma-code', 'Syncing tokens from Figma to CSS variables and Tailwind', 'Đồng bộ token từ Figma sang biến CSS và Tailwind', 'Xuất token JSON · Style Dictionary · Nếu đã học tailwind-css Ch6: biến CSS làm theme — ở đây là nguồn của biến đó'],
      ['thu-vien', 'Building a small component library with docs', 'Dựng thư viện component nhỏ có tài liệu', 'shadcn/ui làm điểm xuất phát · Storybook · Quy tắc đặt tên và biến thể'],
    ]],
    ['Chapter 7 — Accessibility by design (WCAG 2.2)', 'Chương 7 — Khả năng tiếp cận từ khâu thiết kế (WCAG 2.2)', 'Thiết kế cho mọi người, kể cả người khiếm thị, khiếm thính, dùng bàn phím.', [
      ['wcag', 'WCAG: POUR principles and levels A/AA/AAA', 'WCAG: nguyên tắc POUR và các mức A/AA/AAA', 'WCAG 1.0 (1999) → 2.0 (2008) → 2.1 (2018) → 2.2 (2023) · Mức AA là mục tiêu thực tế · Luật tiếp cận ở các nước (nêu trung tính)'],
      ['thiet-ke-a11y', 'Designing for contrast, focus, target size and not relying on colour', 'Thiết kế cho tương phản, focus, cỡ vùng bấm và không chỉ dựa vào màu', 'Vòng focus luôn thấy được · Vùng bấm tối thiểu (WCAG 2.2 thêm 2.5.8) · Lỗi form không chỉ báo bằng màu đỏ'],
      ['ban-phim-screen-reader', 'Keyboard and screen reader experience', 'Trải nghiệm bàn phím và trình đọc màn hình', 'Thứ tự tab · VoiceOver/NVDA thử thật · Chú thích ảnh · Nếu đã học react Ch8 và tailwind-css Ch9: phần code — ở đây là phần thiết kế và kiểm'],
      ['kiem-a11y', 'Auditing accessibility: automated and manual', 'Kiểm khả năng tiếp cận: tự động và thủ công', 'axe, Lighthouse chỉ bắt khoảng một phần lỗi · Checklist thủ công · Ghi lỗi có mức độ'],
    ]],
    ['Chapter 8 — Theming, dark mode and responsive design', 'Chương 8 — Theme, dark mode và thiết kế responsive', 'Một thiết kế, nhiều màn hình, nhiều chế độ.', [
      ['dark-mode', 'Dark mode done right', 'Dark mode làm cho đúng', 'Không chỉ đảo màu · Nền không đen tuyệt đối · Độ nổi bằng sáng hơn thay vì bóng đổ · Bài học cuongthai.com: lớp theme-dark vs dark của Tailwind · Nếu đã học nextjs Ch13 — ở đây là phần thiết kế'],
      ['mobile-first', 'Mobile-first and responsive layouts', 'Mobile-first và bố cục responsive', 'Breakpoint theo nội dung · Điều hướng trên điện thoại · Bảng rộng trên màn hẹp · Trang phải chịu được cửa sổ hẹp'],
      ['nen-tang', 'Platform conventions: web, iOS, Android, desktop', 'Quy ước từng nền tảng: web, iOS, Android, desktop', 'HIG vs Material · App desktop không dùng layout web · Cử chỉ và vùng an toàn'],
    ]],
    ['Chapter 9 — UX writing and forms', 'Chương 9 — Viết chữ UX và form', 'Chữ trên giao diện cũng là thiết kế.', [
      ['ux-writing', 'UX writing in Vietnamese: clear, short, human', 'Viết chữ UX tiếng Việt: rõ, ngắn, có tính người', 'Động từ trên nút · Giọng văn nhất quán (bạn/mình) · Tránh thuật ngữ kỹ thuật · Song ngữ Việt–Anh không lệch nghĩa'],
      ['thong-bao-loi', 'Error messages, confirmations and empty states', 'Thông báo lỗi, xác nhận và trạng thái rỗng', 'Nói chuyện gì xảy ra + làm gì tiếp · Không đổ lỗi người dùng · Xác nhận hành động nguy hiểm'],
      ['form', 'Form design: labels, validation, input types', 'Thiết kế form: nhãn, kiểm tra, kiểu ô nhập', 'Nhãn luôn hiện, không dùng placeholder thay nhãn · Kiểm tra khi rời ô · Bàn phím đúng kiểu trên điện thoại · Chia bước form dài'],
    ]],
    ['Chapter 10 — Usability testing and iteration', 'Chương 10 — Kiểm thử khả dụng và lặp cải tiến', 'Xem người thật dùng, rồi sửa.', [
      ['usability-test', 'Running a usability test with five users', 'Tổ chức usability test với năm người', 'Vì sao năm người tìm ra phần lớn vấn đề (Nielsen) · Kịch bản nhiệm vụ · Nói to suy nghĩ · Không giúp người dùng'],
      ['phan-tich', 'Analysing findings and prioritising fixes', 'Phân tích kết quả và ưu tiên sửa', 'Mức độ nghiêm trọng × tần suất · Video làm bằng chứng · Báo cáo một trang'],
      ['do-luong', 'Measuring UX: task success, time, SUS, analytics', 'Đo UX: tỉ lệ hoàn thành, thời gian, SUS, analytics', 'System Usability Scale · Phễu chuyển đổi · A/B test (trỏ seo-analytics) · Số liệu và định tính bổ sung nhau'],
    ]],
    ['Chapter 11 — Handoff and working with code', 'Chương 11 — Bàn giao và làm việc với code', 'Từ Figma tới React mà không lệch một pixel quan trọng.', [
      ['dev-mode', 'Figma Dev Mode, redlines and specs', 'Figma Dev Mode, thông số và đặc tả', 'Đọc khoảng cách, token, trạng thái · Đặc tả tương tác và trạng thái lỗi · Ghi chú cho lập trình viên'],
      ['dung-lai', 'Building the design in React + Tailwind', 'Dựng thiết kế bằng React + Tailwind', 'Ánh xạ component Figma → component React · Token → biến CSS · Kiểm lệch bằng chồng ảnh'],
      ['ai-thiet-ke', 'AI tools in design: what they are good and bad at', 'Công cụ AI trong thiết kế: giỏi và dở ở đâu', 'Sinh ý tưởng, sinh ảnh, sinh code UI · Giao diện "na ná nhau" · Bài học: model tốt làm UI vẫn cần mắt người duyệt'],
      ['portfolio', 'Presenting design work in your portfolio and interviews', 'Trình bày thiết kế trong portfolio và phỏng vấn', 'Case study: vấn đề → nghiên cứu → phương án → kết quả · Trước/sau có số liệu · Trỏ interview-prep'],
    ]],
    ['Chapter 12 — Capstone: redesign a real flow end to end', 'Chương 12 — Dự án cuối khoá: thiết kế lại một luồng thật từ đầu tới cuối', 'Một luồng của cuongthai.com (đăng ký → học thử → nâng cấp Pro) hoặc LabFlow (đặt phòng lab), từ nghiên cứu tới code chạy trên production.', [
      ['nghien-cuu', 'Research: interviews, analytics and heuristic review', 'Nghiên cứu: phỏng vấn, analytics và đánh giá heuristic', '5 cuộc phỏng vấn · Phễu hiện tại · Danh sách vấn đề có ưu tiên'],
      ['thiet-ke', 'Design: flows, wireframes, visual design, tokens', 'Thiết kế: luồng, wireframe, thị giác, token', 'Luồng mới · Prototype Figma · Token sáng/tối · Kiểm WCAG AA'],
      ['kiem-thu', 'Test the prototype and iterate', 'Kiểm thử prototype và lặp', 'Usability test 5 người · Sửa · Test lại'],
      ['dung-do', 'Build, ship and measure', 'Dựng, phát hành và đo', 'React/Next + Tailwind · Deploy lên Docker + VPS sau Cloudflare · So số liệu trước/sau'],
      ['tong-ket', 'Review and portfolio case study', 'Tổng kết và case study cho portfolio', 'Checklist cả khoá · Viết case study và kể trong phỏng vấn'],
    ]],
  ]),
};
