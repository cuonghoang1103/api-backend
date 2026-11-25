/**
 * Chương 7 — Xác thực và phân quyền: guard JWT và RBAC (khoá nestjs). Bài ĐÃ SOẠN; ghép vào khung bằng slug.
 * Mỗi bài một tệp trong s07/ (soạn 24/11/2026, output chạy thật trong scratchpad/nst/lab/c7 — máy nhà, Node 22.22, Nest 12.6.0,
 * @nestjs/jwt 12.0.5, @nestjs/passport 12.0.2, argon2 0.45.2, @casl/ability 7.1.3, @nestjs/throttler 6.8.0, ioredis 5.11.1;
 * PostgreSQL 16.16 + Prisma 7.10.1 cho mốc 7; Vitest 4.1.12).
 */
import B1 from './s07/nst-7-1-jwt-guard.mjs';
import B2 from './s07/nst-7-2-dang-nhap.mjs';
import B3 from './s07/nst-7-3-rbac.mjs';
import B4 from './s07/nst-7-4-so-huu.mjs';
import B5 from './s07/nst-7-5-throttler-helmet.mjs';
import B6 from './s07/nst-7-6-lab.mjs';
import B7 from './s07/nst-7-7-moc-du-an.mjs';
import B8 from './s07/nst-7-8-quiz.mjs';

export default [B1, B2, B3, B4, B5, B6, B7, B8];
