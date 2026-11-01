/** Giảng theo slide — Lab chương 3 (deck nfd-lab-3, 7 slide). EN = dịch sát ý VI. */
import { walk } from '../_slides.mjs';

export default walk('nfd-lab-3', 'Lab 3 — LabFlow’s DNS', 'Lab 3 — DNS của LabFlow', [
  [1, 'Lab 3 — LabFlow’s DNS',
    `<p>The chapter lab puts every lesson of Chapter 3 to work on LabFlow's own DNS: map the delegation, add records safely, move the API without hurting users, and diagnose two incidents injected while you work.</p>`,
    `<p>Lab chương đưa mọi bài của Chương 3 vào DNS của chính LabFlow: vẽ phần ủy quyền, thêm bản ghi an toàn, chuyển API mà không làm khổ người dùng, và chẩn đoán hai sự cố được cài vào trong lúc bạn làm.</p>`],
  [2, 'The situation',
    `<p>A status page launches next week and needs four new records. The API moves to the Singapore edge, and nobody may get the old address for more than about ten seconds. Your lead wants a map with TTLs and DNSSEC status. And on-call is yours: two incidents will arrive, and your report must explain them — with a script that would have caught them.</p>`,
    `<p>Tuần sau ra mắt trang trạng thái, cần bốn bản ghi mới. API chuyển sang máy biên Singapore, và không ai được nhận địa chỉ cũ quá khoảng mười giây. Trưởng nhóm muốn một bản đồ có TTL và trạng thái DNSSEC. Và bạn trực sự cố: sẽ có hai sự cố, và báo cáo của bạn phải giải thích chúng — kèm một script lẽ ra đã bắt được chúng.</p>`],
  [3, 'The system: the DNS lab',
    `<p>You work on the DNS lab from lesson 3.1: the root, the registry of .test, LabFlow's two name servers, the CDN's DNS and the ISP's resolver. The zone source lives on ns1, and the TLD machine plays the registrar's panel.</p>`,
    `<p>Bạn làm trên lab DNS của bài 3.1: máy chủ gốc, nhà quản lý .test, hai máy chủ tên của LabFlow, DNS của CDN và resolver của nhà mạng. Nguồn của vùng nằm trên ns1, còn máy TLD đóng vai trang quản trị của nhà đăng ký.</p>`],
  [4, 'Requirements',
    `<p>Six requirements. R1 the delegation map. R2 the launch records, checked before loading. R3 the API move with a measured timeline. R4 and R5 the two incidents: inject, observe like a customer, find the cause, fix it in the right place and prove it. R6 a monitoring script.</p>`,
    `<p>Sáu yêu cầu. R1 bản đồ ủy quyền. R2 các bản ghi ra mắt, kiểm trước khi nạp. R3 chuyển API kèm dòng thời gian đo được. R4 và R5 hai sự cố: cài vào, quan sát như khách hàng, tìm nguyên nhân, sửa đúng chỗ và chứng minh. R6 một script giám sát.</p>`],
  [5, 'Rubric — 10 points',
    `<p>Points per requirement: 1.5, 1.5, 2, 2, 2 and 1. Full marks always need evidence — a command and its output — and one point is taken off for every claim without it. The report is Markdown, two pages at most.</p>`,
    `<p>Điểm từng yêu cầu: 1,5, 1,5, 2, 2, 2 và 1. Muốn điểm tối đa luôn cần bằng chứng — một lệnh và output của nó — và mỗi khẳng định không có bằng chứng bị trừ một điểm. Báo cáo viết bằng Markdown, tối đa hai trang.</p>`],
  [6, 'How to work',
    `<p>Edit a copy of the zone, check it, read the warnings, bump the serial, then reload. Do not read the incident scripts: inject them, look from the laptop like a customer, and follow the checklist of lesson 3.5. Start from a clean lab, and open the hints only after ten and twenty minutes.</p>`,
    `<p>Sửa một bản chép của vùng, kiểm nó, đọc cảnh báo, tăng serial, rồi mới nạp. Đừng đọc các kịch bản sự cố: cài chúng vào, nhìn từ laptop như một khách hàng, và làm theo bảng kiểm của bài 3.5. Bắt đầu từ một lab sạch, và chỉ mở gợi ý sau mười và hai mươi phút.</p>`],
  [7, 'Going further',
    `<p>If you finish early: do a correct key rollover, add a third name server in another network, write the functions behind this report in the Code Lab, and add a DNS page to your course-project design.</p>`,
    `<p>Nếu xong sớm: làm một lần đổi khoá đúng cách, thêm máy chủ tên thứ ba ở một mạng khác, viết các hàm đứng sau báo cáo này trong Code Lab, và thêm một trang DNS vào thiết kế dự án xuyên khoá của bạn.</p>`],
]);
