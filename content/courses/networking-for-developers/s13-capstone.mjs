/**
 * Networking for Developers — Chương 13: Dự án cuối khoá (capstone) — truy vết & tối ưu một đường đi request thật
 * (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên (netdev-13-1 … netdev-13-5); thêm quiz cuối khoá netdev-13-6.
 * GIỮ NGUYÊN title chương (seeder neo bằng nó). Lab: edge nginx có-thể-tinh-chỉnh (ch13/stack.conf) trước API — đo mỗi
 * chặng, tối ưu (nén 67KB→1.8KB, cache 3s→~0.3ms) đo trước/sau, làm hỏng (504/502/refused) + chẩn đoán. Output thật:
 * bash lab/code/dung-output-ch13.sh. Có rubric chấm 10 điểm + checklist hoàn thành.
 */
import b131 from './bai/130-dung-lab.mjs';
import b132 from './bai/131-do-duong-di.mjs';
import b133 from './bai/132-toi-uu.mjs';
import b134 from './bai/133-co-y-lam-hong.mjs';
import b135 from './bai/134-tong-ket.mjs';
import q13 from './bai/135-quiz-ch13.mjs';

export default {
  title: 'Chapter 13 — Capstone: trace and tune a real request path|||Chương 13 — Dự án cuối khoá: truy vết và tối ưu một đường đi request thật',
  description: 'DỰ ÁN CUỐI KHOÁ (kiểu PE/FE, 10 điểm): dựng một đường đi request thật client → nginx biên (reverse proxy) → API — phản chiếu stack production (Cloudflare → nginx → Docker → API → PG/Redis → R2). Phương pháp năm bước, đo THẬT trên lab: (1) DỰNG hệ thống và thấy một request đi qua biên tới API; (2) ĐO mỗi chặng, ghi mốc nền (curl -w tách DNS/connect/TTFB/total + size, bắt ở biên); (3) TỐI ƯU một núm một lúc, đo TRƯỚC/SAU (nén gzip 67.092 B → 1.809 B = 37×; cache biên một câu trả lời chậm 3s: MISS 3,0s → HIT ~0,3 ms; keep-alive/HTTP2/CDN); (4) CỐ Ý LÀM HỎNG rồi chẩn đoán theo tầng (504 upstream chậm, 502 upstream chết, refused cổng đóng; nc/curl -I/openssl; viết báo cáo sự cố triệu-chứng→tầng→sửa→ngừa); (5) TỔNG KẾT cả khoá như một đường request + câu chuyện phỏng vấn làm từ CON SỐ của bạn. Kèm rubric chấm + checklist hoàn thành + quiz cuối khoá.',
  lessons: [b131, b132, b133, b134, b135, q13],
};
