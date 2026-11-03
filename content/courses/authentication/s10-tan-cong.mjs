/**
 * Authentication — Chương 10: Các cú tấn công (soạn lại trọn 04/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–9).
 * 10.1 nhoi-tin-vat · 10.2 lua-dao · 10.3 cap-phien · 10.4 tang-con-nguoi · 10.5 chiem-truoc-va-dua (slug giữ) ·
 * Lab 10 (MỚI auth-10-7-lab-chong-nhoi) · Quiz (slug giữ auth-10-6-quiz, 10 câu).
 * Code/output dùng chung ở ./s10/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.10 (src/defense/stuffing.js) + demo10 chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import nhoiTinVat from './s10/nhoi-tin-vat.mjs';
import luaDao from './s10/lua-dao.mjs';
import capPhien from './s10/cap-phien.mjs';
import tangConNguoi from './s10/tang-con-nguoi.mjs';
import chiemTruocVaDua from './s10/chiem-truoc-va-dua.mjs';
import lab from './s10/lab.mjs';
import quiz from './s10/quiz.mjs';

export default {
  title: 'Chapter 10 — The attacks, in order of how often they happen|||Chương 10 — Các cú tấn công, xếp theo TẦN SUẤT THẬT',
  description: 'Chín chương vừa rồi dựng phòng thủ; chương này là tấn công — những cú một dịch vụ danh tính thật gặp, xếp theo mức THƯỜNG XUYÊN, không phải mức tinh vi. Trên LabFlow ID v0.10: 10.1 nhồi tín vật (phát lại mật khẩu đã lộ; khoá tài khoản là một DoS tự gây; decide() phòng thủ IP/độ lan, thách đố con người) — ĐO THẬT: 10k spray ⇒ 0 kẻ tấn công lọt, 0 người thật bị khoá; 10.2 lừa đảo AiTM (relay trang đăng nhập THẬT, trộm phiên; OTP bị relay, passkey gắn-origin bị từ chối); 10.3 cắp phiên (bốn kênh: XSS/mạng/thiết bị/log-URL; cookie __Host- HttpOnly Secure gục trước không kênh nào); 10.4 tầng con người (mệt mỏi MFA ⇒ ghép số; bàn hỗ trợ; SIM swap); 10.5 chiếm-trước (không gộp vào tài khoản chưa xác minh, nối theo sub) + đua TOCTOU (consume nguyên tử ở DB). Rồi Lab 10 chấm decide() bằng máy (chặn cú tấn công mà không khoá người thật). Theo OWASP Credential Stuffing + OAT-008, OWASP MFA + Session Management, NIST SP 800-63B, USENIX 2022 pre-hijacking.',
  lessons: [nhoiTinVat, luaDao, capPhien, tangConNguoi, chiemTruocVaDua, lab, quiz],
};
