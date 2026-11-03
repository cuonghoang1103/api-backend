/**
 * Authentication — Chương 7: Yếu tố thứ hai và passkey (soạn lại trọn 04/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–6).
 * 7.1 yeu-to-thu-hai · 7.2 totp · 7.3 dang-ky-va-khoi-phuc · 7.4 passkey · 7.5 trien-khai-passkey (slug giữ) ·
 * Lab 7 (MỚI auth-7-7-lab-totp) · Quiz (slug giữ auth-7-6-quiz, 10 câu).
 * Code/output dùng chung ở ./s07/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.7 + PostgreSQL 17.11 + Chromium thật (virtual
 * authenticator) chạy trong env -i (đừng sửa tay). TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import yeuToThuHai from './s07/yeu-to-thu-hai.mjs';
import totp from './s07/totp.mjs';
import dangKyVaKhoiPhuc from './s07/dang-ky-va-khoi-phuc.mjs';
import passkey from './s07/passkey.mjs';
import trienKhaiPasskey from './s07/trien-khai-passkey.mjs';
import lab from './s07/lab.mjs';
import quiz from './s07/quiz.mjs';

export default {
  title: 'Chapter 7 — The second factor, and passkeys|||Chương 7 — Yếu tố thứ hai, và passkey',
  description: 'Mật khẩu vẫn hỏng dù bạn băm nó đúng cách nhất, vì người dùng dùng lại nó và vì họ bị lừa gõ nó vào chỗ khác. Chương này dựng yếu tố thứ hai từ số 0 trên LabFlow ID v0.7. Phân ba họ yếu tố (biết/có/là) và nói rõ một yếu tố thứ hai mua được gì — và không mua được gì (mã độc, phiên đã trộm, lừa đảo thời gian thực của TOTP/push). TOTP viết TAY theo RFC 6238 trên RFC 4226, chứng minh khớp cả 6 vector Appendix B và otplib; đăng ký có xác nhận trước khi tin + mã khôi phục một lần (lưu băm); rồi passkey — thứ DUY NHẤT trong khoá thật sự CHẶN lừa đảo: một cặp khoá mà khoá riêng không rời thiết bị, ký lên origin, đo thật bằng Chromium + virtual authenticator (đăng ký/xác thực verified=true, cùng chữ ký với origin giả ⇒ false); và cách đưa passkey lên production (bảng, bốn tuyến, bộ đếm chữ ký, di trú rời mật khẩu). Rồi Lab 7 chấm một TOTP viết từ gốc với vector RFC. Theo NIST SP 800-63B, RFC 6238/4226, W3C WebAuthn L3, FIDO.',
  lessons: [yeuToThuHai, totp, dangKyVaKhoiPhuc, passkey, trienKhaiPasskey, lab, quiz],
};
