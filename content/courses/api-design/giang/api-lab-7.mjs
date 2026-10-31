/** Giảng theo slide — Lab 7 "Hàng chờ thiết kế trước" (deck api-lab-7, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-7', "Lab 7 — Design-first waitlist", "Lab 7 — Hàng chờ thiết kế trước", [
  [1, "Cover",
    `<p>Lab 7: the contract, the lint, the gate and the mock come first; the code comes last.</p>`,
    `<p>Lab 7: hợp đồng, lint, cổng và mock đi trước; code đi sau cùng.</p>`],
  [2, "The request",
    `<p>Students queue for a slot that is already booked, see their position, and leave the queue; nothing existing may break. Four timed steps.</p>`,
    `<p>Sinh viên xếp hàng chờ một khung giờ đã có người đặt, xem vị trí của mình, và rời hàng; không gì đang có được phép gãy. Bốn bước có giới hạn thời gian.</p>`],
  [3, "Part A",
    `<p>Copy the baseline, add three operations with every error and examples, bump to 2.1.0; lint reports no errors and the gate finds only new operations.</p>`,
    `<p>Chép bản mốc, thêm ba thao tác đủ mọi lỗi và ví dụ, nâng lên 2.1.0; lint không báo lỗi và cổng chỉ thấy thao tác mới.</p>`],
  [4, "Part B",
    `<p>The typed client runs against the mock before any server code; against the real server the same client first gets 409 slot available, then 201 at position 1.</p>`,
    `<p>Client có kiểu chạy với mock trước khi có dòng code server nào; với server thật, cùng client đó nhận 409 khung giờ còn trống, rồi 201 ở vị trí 1.</p>`],
  [5, "Part C",
    `<p>The contract check grows to 27 checks, all passing, and the existing tests stay green. Position is computed, never stored.</p>`,
    `<p>Bộ kiểm hợp đồng tăng lên 27 phép, đều đạt, và các test cũ vẫn xanh. Vị trí được tính, không lưu.</p>`],
  [6, "Rubric",
    `<p>Ten points across contract, gates, design reasons, the client, the implementation and an honest transcript; pass at seven.</p>`,
    `<p>Mười điểm cho hợp đồng, các cổng, lý do thiết kế, client, phần cài đặt và transcript trung thực; đạt từ bảy.</p>`],
]);
