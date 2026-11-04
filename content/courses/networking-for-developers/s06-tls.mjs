/**
 * Networking for Developers — Chương 6: TLS và chứng chỉ (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-6-1 … netdev-6-4); thêm lab chương netdev-6-5 và quiz netdev-6-6. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: lab cơ bản + mini CA (lab/code/ch06/setup-ca.sh) + nginx HTTPS tráo chứng chỉ trên web.
 */
import b61 from './bai/060-tls-la-gi.mjs';
import b62 from './bai/061-bat-tay-tls.mjs';
import b63 from './bai/062-chung-chi.mjs';
import b64 from './bai/063-loi-tls.mjs';
import lab6 from './bai/064-lab6.mjs';
import q6 from './bai/065-quiz-ch6.mjs';

export default {
  title: 'Chapter 6 — TLS and certificates|||Chương 6 — TLS và chứng chỉ',
  description: 'Học xong chương: nói chính xác TLS bảo đảm gì (bí mật, toàn vẹn, xác thực) và không (tính sẵn sàng, giấu site); đọc một cú bắt tay TLS 1.3 trên dây (SNI/ALPN dạng chữ, 1-RTT, nối lại phiên) và giải mã TLS của chính bạn bằng SSLKEYLOGFILE; đọc một chứng chỉ và lần chuỗi lá ← trung gian ← gốc, hiểu cấp phát ACME/Let’s Encrypt và lỗi thiếu trung gian; chẩn đoán lỗi TLS (hết hạn, sai tên, tự ký, chưa hiệu lực, Cloudflare Full vs Full strict, mTLS) — đo trên lab cơ bản với một mini CA và nginx HTTPS bằng openssl, tshark + keylog, curl; kèm lab chương siết HTTPS của LabFlow.',
  lessons: [b61, b62, b63, b64, lab6, q6],
};
