/**
 * Authentication — Chương 12: Chẩn đoán (soạn lại trọn 04/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–11). CHƯƠNG CUỐI.
 * 12.1 nam-phut-dau · 12.2 tam-hinh-dang · 12.3 hop-do-nghe · 12.4 soat-kho-ma · 12.5 loi-ket (slug giữ) ·
 * Thi cuối khoá (slug giữ auth-12-6-kiem-cuoi-khoa, 20 câu) · Lab 12 = DỰ ÁN CUỐI KHOÁ (MỚI auth-12-7-lab-du-an-cuoi-khoa, 100 điểm, đạt 70).
 * Code/output dùng chung ở ./s12/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v1.0 (demo12 + cham-cuoi-khoa + sub-cuoi) chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import namPhutDau from './s12/nam-phut-dau.mjs';
import tamHinhDang from './s12/tam-hinh-dang.mjs';
import hopDoNghe from './s12/hop-do-nghe.mjs';
import soatKhoMa from './s12/soat-kho-ma.mjs';
import loiKet from './s12/loi-ket.mjs';
import quiz from './s12/quiz.mjs';
import lab from './s12/lab.mjs';

export default {
  title: 'Chapter 12 — Diagnosis, and where to start|||Chương 12 — Chẩn đoán, và bắt đầu từ đâu',
  description: 'Chương cuối: không phải tính năng mới mà là CHẨN ĐOÁN nhanh khi thứ bạn dựng hỏng, soát một hệ bạn không viết, và dự án cuối khoá. Trên LabFlow ID v1.0: 12.1 năm phút đầu — ĐO TRƯỚC KHI ĐOÁN (curl đọc mã: 404 build cũ, 500 phụ thuộc sập, 403 phân quyền, 401 ống nguyên vẹn, 200 nhìn qua đăng nhập); 12.2 tám hình dạng hỏng (đọc DÁNG ai+khi nào ⇒ chương để mở); 12.3 hộp đồ nghề (giải JWT bằng tay, kiểm cookie, đo thời gian — giải để chẩn đoán KHÔNG để phân quyền); 12.4 soát kho mã không phải bạn viết (bắt đầu từ cổng, lần một token, grep phản mẫu, hỏi dữ liệu, xác minh cái chắn); 12.5 lời kết (đừng tự cuộn — hiểu để chọn/debug; phân quyền từ ngày đầu; passkey + tấn công tự động là cái đổi, các nguyên thuỷ là hằng). Thi cuối khoá 20 câu cả khoá. DỰ ÁN CUỐI: LabFlow ID v1.0 chấm bởi ~12 kịch bản tấn công thật (tham khảo 100/100, yếu 25/100) — kể theo STAR cho CV. Theo OWASP ASVS/Authentication/A01, NIST SP 800-63B, MDN HTTP status.',
  lessons: [namPhutDau, tamHinhDang, hopDoNghe, soatKhoMa, loiKet, quiz, lab],
};
