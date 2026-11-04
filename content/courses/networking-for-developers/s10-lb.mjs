/**
 * Networking for Developers — Chương 10: Cân bằng tải và proxy (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-10-1 … netdev-10-4); thêm lab chương netdev-10-5 và quiz netdev-10-6. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: 3 backend (ch10/backend.mjs) + nginx LB L7 (ch10/lb.conf: round robin, consistent hash, timeout, dead upstream) +
 * socat L4 + socat tunnel. Output thật: bash lab/code/dung-output-ch10.sh.
 */
import b101 from './bai/100-l4-l7.mjs';
import b102 from './bai/101-thuat-toan.mjs';
import b103 from './bai/102-reverse-forward.mjs';
import b104 from './bai/103-ma-loi-gateway.mjs';
import lab10 from './bai/104-lab10.mjs';
import q10 from './bai/105-quiz-ch10.mjs';

export default {
  title: 'Chapter 10 — Load balancing and proxies|||Chương 10 — Cân bằng tải và proxy',
  description: 'Học xong chương: phân biệt cân bằng tải L4 (chuyển kết nối thô, cho TLS đi qua) và L7 (hiểu HTTP — thêm X-Forwarded-For, định tuyến theo path/host, retry, cache, nhưng phải giữ chứng chỉ) — đo thật trên nginx vs socat; chọn thuật toán (round robin · least connections · consistent hashing sticky — đo thật · weighted) và kiểm sức khoẻ (bị động max_fails vs chủ động /health) + rút êm (drain) để deploy không gián đoạn (đo thật failover giết backend); đặt proxy (reverse đứng trước máy chủ · forward đứng trước client) và đường hầm (SSH/Cloudflare Tunnel — đo thật socat, sự cố cổng 22 bị chặn → SSH 993); và đọc đúng 502/503/504/524 (ai phát, backend hỏng/thiếu/chậm — đo thật, sự cố 502 bảy phút) — kèm lab chương dựng tầng cân bằng tải của LabFlow.',
  lessons: [b101, b102, b103, b104, lab10, q10],
};
