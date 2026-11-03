/**
 * Authentication — Chương 9: Mô hình phân quyền (soạn lại trọn 04/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–8).
 * 9.1 phan-quyen-la-gi · 9.2 rbac · 9.3 abac-rebac · 9.4 nhieu-tenant · 9.5 dat-phep-kiem-o-dau (slug giữ) ·
 * Lab 9 (MỚI auth-9-7-lab-can) · Quiz (slug giữ auth-9-6-quiz, 10 câu).
 * Code/output dùng chung ở ./s09/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.9 (src/authz: policy.js + gate.js) + demo9 chạy thật (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import phanQuyenLaGi from './s09/phan-quyen-la-gi.mjs';
import rbac from './s09/rbac.mjs';
import abacRebac from './s09/abac-rebac.mjs';
import nhieuTenant from './s09/nhieu-tenant.mjs';
import datPhepKiem from './s09/dat-phep-kiem-o-dau.mjs';
import lab from './s09/lab.mjs';
import quiz from './s09/quiz.mjs';

export default {
  title: 'Chapter 9 — Authorization models|||Chương 9 — Mô hình phân quyền',
  description: 'Tám chương vừa rồi trả lời câu "bạn là ai". Chương này trả lời câu tốn tiền hơn: "bạn được làm gì". Kiểm soát truy cập hỏng là lỗ hổng số MỘT của web theo OWASP, và nó hỏng không phải vì mật mã sai mà vì có ai đó quên một dòng — nên chương lo cả MÔ HÌNH lẫn CÁCH DỰNG sao cho khó quên. LabFlow ID v0.9 canh phòng và lượt đặt qua hai tenant (FPT HCM/HN) bằng MỘT cổng can(user, action, resource) gộp bốn mô hình: RBAC (một bảng ROLE_GRANTS), ABAC (sở hữu lượt đặt), ReBAC (trưởng khoa của phòng), và ranh giới tenant kiểm TRƯỚC mọi vai — khác tenant trả 404 giống hệt "không tồn tại" để không dò được. Phép kiểm sống trong một middleware authorize() tự nạp tài nguyên nên không tuyến nào quên, và một tệp test là đặc tả cho cả bốn mươi tuyến. Chạy THẬT: demo ma trận một-câu-năm-đáp-án + cổng HTTP bốn kết cục (48 test xanh). Rồi Lab 9 chấm can() bằng máy. Theo OWASP A01, NIST RBAC/ABAC (SP 800-162), Google Zanzibar.',
  lessons: [phanQuyenLaGi, rbac, abacRebac, nhieuTenant, datPhepKiem, lab, quiz],
};
