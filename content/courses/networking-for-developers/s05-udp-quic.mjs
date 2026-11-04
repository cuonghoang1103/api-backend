/**
 * Networking for Developers — Chương 5: UDP và QUIC (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-5-1 … netdev-5-3); thêm lab chương netdev-5-4 và quiz netdev-5-5. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: lab cơ bản (compose.yml, project nfd) + máy chủ UDP echo + nginx HTTP/3 (ch05/h3.conf) trên web.
 */
import b51 from './bai/050-udp.mjs';
import b52 from './bai/051-quic.mjs';
import b53 from './bai/052-udp-thuc-te.mjs';
import lab5 from './bai/053-lab5.mjs';
import q5 from './bai/054-quiz-ch5.mjs';

export default {
  title: 'Chapter 5 — UDP and QUIC|||Chương 5 — UDP và QUIC',
  description: 'Học xong chương: đọc một trao đổi UDP (không bắt tay, không thứ tự, không truyền lại) và đo mất gói nỗ lực tối đa; nói được khi nào UDP thắng (DNS, VoIP, game, video trực tiếp) và việc ứng dụng phải tự làm; giải thích QUIC là tính tin cậy của TCP + TLS 1.3 dựng lại trên UDP ở không gian người dùng (1-RTT, bỏ nghẽn đầu hàng, chuyển kết nối); nhận diện HTTP/3 từ phía máy chủ (nginx nghe UDP + Alt-Svc) và dựng lại đường lùi êm ru khi mạng chặn UDP 443 — đo trên lab cơ bản bằng socat, tcpdump, node dgram, nginx HTTP/3, iptables; kèm lab chương quyết định tầng vận chuyển.',
  lessons: [b51, b52, b53, lab5, q5],
};
