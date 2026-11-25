/**
 * Chương 11 — Deploy và tổng kết dự án (khoá fullstack-project). Bài ĐÃ SOẠN 25/11/2026 (agent trên Mac tiếp quản fsp); ghép vào
 * khung bằng slug. Thêm bài quiz fp-11-5-quiz (slug mới). Output chạy thật trên VPS MÔ PHỎNG (container Ubuntu 24.04 + OpenSSH +
 * Docker 29.10.1 lồng bên trong, RAM 2 GB) trên máy nhà; HTTPS bằng Pebble (máy chủ ACME thử nghiệm của Let’s Encrypt) + certbot 2.9.0;
 * registry:2 cục bộ đóng vai GHCR. KHÔNG đụng VPS thật nào; tên miền chiase.test là tên giả.
 */
import B1 from './s11/fp-11-1-chuan-bi-vps.mjs';
import B2 from './s11/fp-11-2-deploy-domain.mjs';
import B3 from './s11/fp-11-3-smoke-rollback.mjs';
import B4 from './s11/fp-11-4-tong-ket.mjs';
import B5 from './s11/fp-11-5-quiz.mjs';

export default [B1, B2, B3, B4, B5];
