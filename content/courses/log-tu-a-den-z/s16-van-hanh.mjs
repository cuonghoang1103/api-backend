/**
 * Chương 16 — Vận hành log cho đúng: thời gian lưu, chi phí, quyền riêng tư, toàn vẹn (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s16/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s16/ (bash _demo/s16/chay-s16.bash, ~6 phút: "máy chủ" may16 = Ubuntu 24.04 systemd trong container
 * lgz-c16-may (ảnh dựng từ _demo/s16/vm, --network none); Node 22 + pino/winston; Java 21 + Logback 1.5.38; nginx 1.27; gitleaks 8.30.1; Alloy 1.22; Loki 3.7.10;
 * MinIO Object Lock; bảng giá CloudWatch qua AWS Price List API), rồi node scratchpad/lgz/cong-cu/sinh-ma.mjs (repo: scripts/log-khoa/sinh-ma.mjs).
 * Tệp lệnh đuôi .bash — chay-demo.py không chạy chúng.
 */
import L161 from './s16/log-16-1-luu-bao-lau.mjs';
import L162 from './s16/log-16-2-dung-luong-chi-phi.mjs';
import L163 from './s16/log-16-3-khong-log-bi-mat.mjs';
import L164 from './s16/log-16-4-toan-ven-quyen.mjs';
import L165 from './s16/log-16-5-nep-hang-ngay.mjs';
import L166 from './s16/log-16-6-chinh-sach-log.mjs';
import L167 from './s16/log-16-7-lab.mjs';
import L168 from './s16/log-16-8-quiz.mjs';

export default { lessons: [L161, L162, L163, L164, L165, L166, L167, L168] };
