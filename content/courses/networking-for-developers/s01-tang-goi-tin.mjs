/**
 * Networking for Developers — Chương 1: Các tầng và gói tin (soạn trọn 31/10/2026, đợt mẫu). Bài 1.1 bit/byte là bài MỚI
 * (khoá tự đủ từ số 0); các slug cũ của khung giữ nguyên, số hiển thị dịch đi một (netdev-1-1-osi-tcpip hiển thị 1.2…).
 * GIỮ NGUYÊN title chương (seeder neo bằng nó).
 */
import b10 from './bai/010-bit-byte.mjs';
import b11 from './bai/011-osi-tcpip.mjs';
import b12 from './bai/012-dong-goi.mjs';
import b13 from './bai/013-ethernet-arp.mjs';
import b14 from './bai/014-cong-socket.mjs';
import lab1 from './bai/015-lab1.mjs';
import q1 from './bai/016-quiz-ch1.mjs';

export default {
  title: 'Chapter 1 — Layers and packets|||Chương 1 — Các tầng và gói tin',
  description: 'Bit, byte, hex và thứ tự byte; mô hình tầng TCP/IP và từ vựng L2–L7; đọc một frame thật từng byte, MTU/MSS và bẫy offload; Ethernet, MAC, switch và ARP (cả lỗi cache cũ); cổng và socket, 127.0.0.1 với 0.0.0.0 — kèm lab chương giải phẫu một request của LabFlow.',
  lessons: [b10, b11, b12, b13, b14, lab1, q1],
};
