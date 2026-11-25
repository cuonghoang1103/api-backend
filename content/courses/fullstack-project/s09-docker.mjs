/**
 * Chương 9 — Docker hoá (khoá fullstack-project). Bài ĐÃ SOẠN 24–25/11/2026 (agent fsp, phiên Mac tiếp quản hoàn tất); ghép vào
 * khung bằng slug. Thêm bài quiz fp-9-5-quiz (slug mới). Output chạy thật: dự án mẫu scratchpad/fsp/chiase (nhánh ch9/docker,
 * cây làm việc chưa commit), Docker + Compose v2 trên máy nhà, node:22-slim, nginx:1.30-alpine, postgres:18-alpine, MinIO (chainguard).
 */
import B1 from './s09/fp-9-1-dockerfile-backend.mjs';
import B2 from './s09/fp-9-2-dockerfile-frontend.mjs';
import B3 from './s09/fp-9-3-docker-compose.mjs';
import B4 from './s09/fp-9-4-checkpoint-9.mjs';
import B5 from './s09/fp-9-5-quiz.mjs';

export default [B1, B2, B3, B4, B5];
