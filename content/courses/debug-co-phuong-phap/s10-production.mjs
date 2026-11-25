/**
 * Chương 10 — Gỡ lỗi trên production an toàn (khoá debug-co-phuong-phap). Bài ĐÃ SOẠN, ghép vào khung bằng slug.
 * Mỗi bài một tệp trong s10/ (soạn 24/11/2026 trên máy nhà Linux; output chạy thật: Node 22 + CDP, pino 9, Spring Boot 4.1.1 + JDI,
 * PostgreSQL 16, nginx 1.27, Docker Compose — lưu ở vbg-dp/scratchpad/dbg/lab/ch10).
 * Mã lab: s10/_ma-10.mjs; output: s10/_ra-10.mjs (sinh tự động bởi lab/ch10/tools/sinh.mjs).
 */
import B1 from './s10/dbg-10-1-nguyen-tac.mjs';
import B2 from './s10/dbg-10-2-log-de-debug.mjs';
import B3 from './s10/dbg-10-3-feature-flag.mjs';
import B4 from './s10/dbg-10-4-tu-canh-bao.mjs';
import B5 from './s10/dbg-10-5-lab.mjs';
import B6 from './s10/dbg-10-6-quiz.mjs';

export default [B1, B2, B3, B4, B5, B6];
