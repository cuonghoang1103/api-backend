/**
 * Networking for Developers — Chương 3: DNS tới tận gốc (soạn trọn 01/11/2026). Slug bài của khung giữ nguyên
 * (netdev-3-1 … netdev-3-5); thêm lab chương netdev-3-6 và quiz netdev-3-7. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: phần DNS của "Internet trong một hộp" (lab/moi-truong/dns.yml chồng lên internet.yml).
 */
import b31 from './bai/030-phan-giai.mjs';
import b32 from './bai/031-ban-ghi.mjs';
import b33 from './bai/032-ttl-cache.mjs';
import b34 from './bai/033-anycast-geodns.mjs';
import b35 from './bai/034-dns-an-toan.mjs';
import lab3 from './bai/035-lab3.mjs';
import q3 from './bai/036-quiz-ch3.mjs';

export default {
  title: 'Chapter 3 — DNS in depth|||Chương 3 — DNS tới tận gốc',
  description: 'Học xong chương: lần một cái tên từ máy chủ gốc xuống và nói được ai trả phần nào, đọc và viết các bản ghi lập trình viên dùng (A/AAAA, CNAME, MX, TXT, SRV, CAA, HTTPS) và tránh lỗi CNAME ở đỉnh, đổi DNS không làm khổ người dùng (TTL, cache âm, cache của Java/Node), giải thích anycast, GeoDNS và DNS round-robin, chẩn đoán SERVFAIL do DNSSEC, máy chủ tên chết, tên miền hết hạn — đo trên một cây DNS riêng (gốc, TLD, máy chủ tên của LabFlow, resolver kiểm DNSSEC, DNS công cộng anycast hai nơi) gắn vào "Internet trong một hộp", đối chiếu với cuongthai.com; kèm lab chương DNS của LabFlow.',
  lessons: [b31, b32, b33, b34, b35, lab3, q3],
};
