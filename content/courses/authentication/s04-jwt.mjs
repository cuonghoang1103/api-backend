/**
 * Authentication — Chương 4: Token — mổ JWT từ bên trong (soạn lại trọn 03/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–3).
 * 4.1 giai-ma-bang-tay · 4.2 truong-alg · 4.3 cac-claim · 4.4 khoa-va-jwks · 4.5 cat-token-o-dau (slug giữ) · Lab 4 (MỚI auth-4-7-lab-kiem-jwt) · Quiz (slug giữ, 10 câu).
 * Code/output dùng chung ở ./s04/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.4 + jose 6.1.0 + Chromium 156 chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import giaiMaBangTay from './s04/giai-ma-bang-tay.mjs';
import truongAlg from './s04/truong-alg.mjs';
import cacClaim from './s04/cac-claim.mjs';
import khoaVaJwks from './s04/khoa-va-jwks.mjs';
import catTokenODau from './s04/cat-token-o-dau.mjs';
import lab from './s04/lab.mjs';
import quiz from './s04/quiz.mjs';

export default {
  title: 'Chapter 4 — Tokens: JWT from the inside|||Chương 4 — Token: mổ JWT từ bên trong',
  description: 'Câu trả lời còn lại cho "HTTP hay quên": một token không trạng thái mà client mang theo, dịch vụ tin được mà không cần hỏi cơ sở dữ liệu. LabFlow ID v0.4 mổ một JWT bằng Buffer (header.payload.signature, base64url, không mã hoá); chặn hai cú giả mạo kinh điển bằng cách lấy thuật toán từ KHOÁ chứ không từ token (alg:none và nhầm lẫn HS/RS, chạy thật ⇒ ALG_MISMATCH); kiểm bảy claim chuẩn với đúng luật dung sai đồng hồ và denylist jti; phát và xoay khoá EdDSA qua một JWKS công khai không ngừng dịch vụ (đối chiếu với jose, số đo HS/EdDSA/ES/RS); và chọn chỗ trình duyệt cất token bằng một cú trộm XSS thật trong Chromium 156 — rồi Lab 4 chấm một bộ xác minh trước hơn hai mươi token thù địch.',
  lessons: [giaiMaBangTay, truongAlg, cacClaim, khoaVaJwks, catTokenODau, lab, quiz],
};
