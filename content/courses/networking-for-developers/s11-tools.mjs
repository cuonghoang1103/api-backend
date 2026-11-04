/**
 * Networking for Developers — Chương 11: Công cụ và phương pháp chẩn đoán (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-11-1 … netdev-11-4); thêm lab chương netdev-11-5 và quiz netdev-11-6. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: tcpdump→.pcap→tshark, curl -w/ping/mtr/iperf3 (netem 20ms ở router), bảng kiểm theo tầng (+ TLS tự ký ch11/tls.conf).
 * Output thật: bash lab/code/dung-output-ch11.sh.
 */
import b111 from './bai/110-tcpdump.mjs';
import b112 from './bai/111-wireshark.mjs';
import b113 from './bai/112-do-duong.mjs';
import b114 from './bai/113-phuong-phap.mjs';
import lab11 from './bai/114-lab11.mjs';
import q11 from './bai/115-quiz-ch11.mjs';

export default {
  title: 'Chapter 11 — Tools and troubleshooting method|||Chương 11 — Công cụ và phương pháp chẩn đoán',
  description: 'Học xong chương: bắt gói trên máy chủ không giao diện/trong container bằng tcpdump (bộ lọc BPF, -w/-r, nsenter) — đo thật bắt trọn một bắt tay + GET + 200 + đóng; đọc một bản bắt bằng tshark/Wireshark (lọc HTTP, theo một luồng TCP, nhận ra truyền lại/zero window/RST, phân biệt khoảng trống-máy-chủ với mất-gói-mạng); đo đường đi (curl -w tách DNS/connect/TTFB/total, ping RTT+mất, mtr mỗi hop, iperf3 băng thông) và phân biệt băng thông với độ trễ; và chẩn đoán theo TẦNG (DNS → định tuyến → cổng → TLS → HTTP → app, mỗi tầng một lệnh, dừng ở lỗi đầu tiên — "chạy ở máy tôi" là một tầng khác biệt; lỗi gián đoạn MTU/IPv6 nửa-hỏng; tìm nhị phân tầng) — đo thật trên lab với tcpdump/tshark/mtr/iperf3/openssl, kèm lab chương chẩn đoán một sự cố của LabFlow theo tầng.',
  lessons: [b111, b112, b113, b114, lab11, q11],
};
