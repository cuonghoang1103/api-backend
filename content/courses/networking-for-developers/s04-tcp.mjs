/**
 * Networking for Developers — Chương 4: TCP (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-4-1 … netdev-4-5); thêm lab chương netdev-4-6 và quiz netdev-4-7. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: lab cơ bản (lab/moi-truong/compose.yml, project nfd: client — router — web — api).
 */
import b41 from './bai/040-bat-tay.mjs';
import b42 from './bai/041-tin-cay.mjs';
import b43 from './bai/042-tac-nghen.mjs';
import b44 from './bai/043-trang-thai.mjs';
import b45 from './bai/044-keepalive-pool.mjs';
import lab4 from './bai/045-lab4.mjs';
import q4 from './bai/046-quiz-ch4.mjs';

export default {
  title: 'Chapter 4 — TCP|||Chương 4 — TCP',
  description: 'Học xong chương: đọc trọn một kết nối TCP trong bản bắt gói (bắt tay, dữ liệu, đóng, RST, SYN không ai trả lời), đo chi phí một vòng khứ hồi và keep-alive, theo độ tin cậy (số thứ tự, ACK, truyền lại, SACK, nghẽn đầu hàng), xem kiểm soát luồng và tắc nghẽn (cửa sổ nhận, slow start, cwnd, Reno/CUBIC/BBR), chẩn đoán trạng thái kết nối (TIME_WAIT, cạn cổng, hàng đợi accept) và các núm trong code (pool, connect/read timeout, Nagle/TCP_NODELAY, TCP keepalive) — đo trên lab LabFlow bằng tcpdump, tshark, ss, iperf3; kèm lab chương mổ xẻ TCP.',
  lessons: [b41, b42, b43, b44, b45, lab4, q4],
};
