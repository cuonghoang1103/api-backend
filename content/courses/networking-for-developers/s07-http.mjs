/**
 * Networking for Developers — Chương 7: HTTP từ 1.1 tới 3 (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-7-1 … netdev-7-5); thêm lab chương netdev-7-6 và quiz netdev-7-7. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: lab cơ bản + nginx h1/h2/h3 (lab/code/ch07/h7.conf) + máy chủ chunked + 2 proxy cho chuỗi X-Forwarded-For.
 */
import b71 from './bai/070-http11.mjs';
import b72 from './bai/071-http2.mjs';
import b73 from './bai/072-http3.mjs';
import b74 from './bai/073-header-quan-trong.mjs';
import b75 from './bai/074-proxy-header.mjs';
import lab7 from './bai/075-lab7.mjs';
import q7 from './bai/076-quiz-ch7.mjs';

export default {
  title: 'Chapter 7 — HTTP from 1.1 to 3|||Chương 7 — HTTP từ 1.1 tới 3',
  description: 'Học xong chương: đọc HTTP/1.1 như văn bản thuần (gõ tay bằng nc, Host, keep-alive, chunked, giới hạn 6 kết nối); giải thích HTTP/2 (ALPN, ghép kênh đọc theo stream id, HPACK, server push chết, nghẽn đầu hàng tầng TCP); HTTP/3 trên QUIC và cú nâng Alt-Svc; dùng các header đổi hành vi (Cache-Control/ETag/304, nén gzip/brotli/zstd, CORS là luật trình duyệt, HSTS); và tìm IP client thật qua một chuỗi proxy (X-Forwarded-For, trust proxy, CF-Connecting-IP, sự cố 429) — đo trên lab cơ bản với nginx thật phục vụ cả ba phiên bản; kèm lab chương mổ xẻ ngăn xếp HTTP của LabFlow.',
  lessons: [b71, b72, b73, b74, b75, lab7, q7],
};
