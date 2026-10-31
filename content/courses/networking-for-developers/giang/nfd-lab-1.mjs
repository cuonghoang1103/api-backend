/** Giảng theo slide — Lab chương 1 (deck nfd-lab-1, 7 slide). EN = dịch sát ý VI. */
import { walk } from '../_slides.mjs';

export default walk('nfd-lab-1', 'Lab 1 — Dissect one request of LabFlow', 'Lab 1 — Giải phẫu một request của LabFlow', [
  [1, 'Lab 1 — Dissect one request of LabFlow',
    `<p>The chapter lab puts every lesson of Chapter 1 to work on one request: bits and bytes, layers, encapsulation, MAC and ARP, ports and sockets. You will map the system, capture the request on both sides of the router, find a second connection you did not know existed, and then break the path and fix it.</p>`,
    `<p>Lab chương dùng mọi bài của Chương 1 cho đúng một request: bit và byte, các tầng, đóng gói, MAC và ARP, cổng và socket. Bạn sẽ vẽ bản đồ hệ thống, bắt request ở hai phía router, tìm ra một kết nối thứ hai mà bạn chưa biết là có, rồi làm hỏng đường đi và sửa lại.</p>`],
  [2, 'The situation',
    `<p>At the Monday stand-up two teammates make two claims: that the router rewrites the client's IP address — which is why the API sees 10.10.2.10 — and that nginx keeps one connection to the API open. Your lead wants both claims proved or disproved with captures, in a one-page report. This is also part 1 of the course project: a map of the request path of mini LabFlow, which every later chapter extends.</p>`,
    `<p>Trong buổi họp đầu tuần, hai bạn cùng nhóm đưa ra hai khẳng định: router viết lại địa chỉ IP của máy khách — nên API mới thấy 10.10.2.10 — và nginx giữ một kết nối mở sẵn tới API. Trưởng nhóm muốn cả hai khẳng định được chứng minh hoặc bác bỏ bằng bản bắt gói, trong một báo cáo một trang. Đây cũng là phần 1 của dự án xuyên khoá: bản đồ đường đi request của LabFlow thu nhỏ, mà chương nào về sau cũng nối dài thêm.</p>`],
  [3, 'The system you will dissect',
    `<p>The request is a single curl from the client to nginx on the web server, which forwards it to Node on the API server. It crosses the router between the two networks. Client2 is there for comparison and for the ARP part.</p>`,
    `<p>Request là một lệnh curl từ máy khách tới nginx trên máy web, nginx chuyển nó tới Node trên máy API. Nó đi qua router giữa hai mạng. Client2 có mặt để so sánh và cho phần ARP.</p>`],
  [4, 'Requirements',
    `<p>Six requirements. R1, a map of all five machines. R2, the four layers of the request with their byte sizes. R3, the same request on the far side of the router: what changed and what did not. R4, the ARP exchanges with empty caches. R5, the second connection from nginx to the API. R6, make the /hong/ route work by starting a service on port 4999 — first deliberately wrong, then right.</p>`,
    `<p>Sáu yêu cầu. R1, bản đồ cả năm máy. R2, bốn tầng của request kèm kích thước byte. R3, cùng request đó ở phía bên kia router: cái gì đổi, cái gì không. R4, các lượt ARP khi cache trống. R5, kết nối thứ hai từ nginx tới API. R6, làm đường /hong/ chạy bằng cách dựng một dịch vụ ở cổng 4999 — lần đầu cố ý sai, rồi làm đúng.</p>`],
  [5, 'Rubric — 10 points',
    `<p>Points per requirement: 1.5, 2, 2, 1.5, 1.5, 1.5. Full marks always need evidence — a command and its output — and one point is taken off for any claim without it. The report is one page of Markdown.</p>`,
    `<p>Điểm từng yêu cầu: 1,5, 2, 2, 1,5, 1,5, 1,5. Muốn điểm tối đa luôn cần bằng chứng — một lệnh và output của nó — và mỗi khẳng định không có bằng chứng bị trừ một điểm. Báo cáo là một trang Markdown.</p>`],
  [6, 'How to work',
    `<p>Three habits. Start the capture before the request, wait two seconds, stop it cleanly. Back every sentence of the report with an output. Use the hints in order and only when stuck for a while; the full solution comes last.</p>`,
    `<p>Ba thói quen. Bắt đầu bắt gói trước request, chờ hai giây, dừng nó gọn gàng. Câu nào trong báo cáo cũng có output làm chứng. Dùng gợi ý theo thứ tự và chỉ khi đã bí một lúc; lời giải đầy đủ để cuối cùng.</p>`],
  [7, 'Going further',
    `<p>For the fast: make nginx keep its connections to the API open and prove it; write the R2 report in JavaScript from raw bytes in the Code Lab lab module; and capture on the router itself to see which MAC pair each of its interfaces sees.</p>`,
    `<p>Cho ai làm nhanh: cho nginx giữ kết nối tới API và chứng minh điều đó; viết báo cáo R2 bằng JavaScript từ byte thô trong module lab của Code Lab; và bắt gói ngay trên router để xem mỗi card của nó thấy cặp MAC nào.</p>`],
]);
