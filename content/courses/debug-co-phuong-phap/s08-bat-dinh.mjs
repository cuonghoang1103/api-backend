/**
 * Chương 8 — Lỗi bất định: đồng thời, thời gian, cache và bộ nhớ (khoá debug-co-phuong-phap). Bài ĐÃ SOẠN, ghép vào khung bằng slug.
 * Mỗi bài một tệp trong s08/ (soạn 24/11/2026 trên máy nhà Linux; output chạy thật: PostgreSQL 16, Express 5 + Prisma 6.19.3 (Node 22),
 * Spring Boot 4.1.1 + Hibernate 7 (JDK 25), Docker Compose, nginx 1.27, Redis 7 — lưu ở vbg-dp/scratchpad/dbg/lab/ch8).
 * Mã lab: s08/_ma-8.mjs; output: s08/_ra-8.mjs (sinh tự động bởi lab/ch8/tools/sinh.mjs).
 */
import B1 from './s08/dbg-8-1-race.mjs';
import B2 from './s08/dbg-8-2-thoi-gian.mjs';
import B3 from './s08/dbg-8-3-cache.mjs';
import B4 from './s08/dbg-8-4-bo-nho.mjs';
import B5 from './s08/dbg-8-5-lab.mjs';
import B6 from './s08/dbg-8-6-quiz.mjs';

export default [B1, B2, B3, B4, B5, B6];
