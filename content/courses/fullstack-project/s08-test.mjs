/**
 * Chương 8 — Test cả hệ thống (khoá fullstack-project). Bài ĐÃ SOẠN 24/11/2026; ghép vào khung bằng slug.
 * Thêm bài quiz fp-8-5-quiz (slug mới). Output chạy thật: dự án mẫu scratchpad/fsp/chiase (nhánh ch8/test), Vitest 5.1.1,
 * Supertest 7.3.2, socket.io-client 4.8.4, Postgres 18 dùng một lần trong Docker.
 */
import B1 from './s08/fp-8-1-unit-service.mjs';
import B2 from './s08/fp-8-2-integration-db.mjs';
import B3 from './s08/fp-8-3-api-supertest.mjs';
import B4 from './s08/fp-8-4-checkpoint-8.mjs';
import B5 from './s08/fp-8-5-quiz.mjs';

export default [B1, B2, B3, B4, B5];
