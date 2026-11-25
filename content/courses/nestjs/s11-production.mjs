/**
 * Chương 11 — Production: Docker, health check, CI và vận hành (khoá nestjs). Bài ĐÃ SOẠN; ghép vào khung bằng slug.
 * Mỗi bài một tệp trong s11/ (soạn 24/11/2026, output chạy thật trong scratchpad/nst/lab/c11 — máy nhà, Node 22.22 / node:22(-alpine) 22.23.5,
 * Nest 12.6.0, Prisma 7.10.1, @nestjs/terminus 12.2.0, @nestjs/cache-manager 12.0.5, @nestjs/platform-fastify 12.6.0, PostgreSQL 16.16,
 * Redis 7.4, nginx 1.29.8, HAProxy 3.2, autocannon 9.0.0, Vitest 4.1.12, Jest 30.5.2; sổ đo: lab/c11/GHI-CHEP.md).
 */
import B1 from './s11/nst-11-1-docker.mjs';
import B2 from './s11/nst-11-2-health.mjs';
import B3 from './s11/nst-11-3-ci.mjs';
import B4 from './s11/nst-11-4-hieu-nang-bao-mat.mjs';
import B5 from './s11/nst-11-5-lab.mjs';
import B6 from './s11/nst-11-6-moc-du-an.mjs';
import B7 from './s11/nst-11-7-quiz.mjs';

export default [B1, B2, B3, B4, B5, B6, B7];
