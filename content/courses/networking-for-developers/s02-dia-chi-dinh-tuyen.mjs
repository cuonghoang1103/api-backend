/**
 * Networking for Developers — Chương 2: Địa chỉ IP, định tuyến và NAT (soạn trọn 01/11/2026). Slug bài của khung giữ nguyên
 * (netdev-2-1 … netdev-2-5); thêm lab chương netdev-2-6 và quiz netdev-2-7. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: lab Ch1 (bài 2.1) + "Internet trong một hộp" (lab/moi-truong/internet.yml) cho 2.2–2.5 và Lab 2.
 */
import b21 from './bai/020-ipv4-cidr.mjs';
import b22 from './bai/021-dinh-tuyen.mjs';
import b23 from './bai/022-nat.mjs';
import b24 from './bai/023-ipv6.mjs';
import b25 from './bai/024-bgp.mjs';
import lab2 from './bai/025-lab2.mjs';
import q2 from './bai/026-quiz-ch2.mjs';

export default {
  title: 'Chapter 2 — IP addressing, routing and NAT|||Chương 2 — Địa chỉ IP, định tuyến và NAT',
  description: 'Học xong chương: đọc và chia subnet bằng tay, đọc bảng định tuyến và traceroute (kể cả * * * và vòng lặp), giải thích máy chủ thấy IP nào sau NAT/CGNAT/Docker, sửa các lỗi IPv6 hay gặp, hiểu BGP, cướp tuyến, RPKI và sự cố kiểu Facebook — đo trên lab LabFlow và "Internet trong một hộp" (router nhà, nhà mạng, điểm trao đổi chạy BGP thật, trung tâm dữ liệu); kèm lab chương con đường đi vào LabFlow.',
  lessons: [b21, b22, b23, b24, b25, lab2, q2],
};
