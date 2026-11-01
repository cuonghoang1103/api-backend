/**
 * Authentication — Chương 1: Tín vật, và những nguyên hàm bên dưới (soạn lại trọn 01/11/2026, đợt mẫu — xem ./_HOP-DONG.md).
 * 1.1 tin-vat · 1.2 ngau-nhien · 1.3 so-sanh (BÀI MẪU) · 1.4 bam-mac-chu-ky · 1.5 bi-mat-ro (slug giữ) · Lab 1 (MỚI auth-1-7-lab-bo-cong-cu) · Quiz (slug giữ, 10 câu).
 * Code/output dùng chung ở ./s01/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import tinVat from './s01/tin-vat.mjs';
import ngauNhien from './s01/ngau-nhien.mjs';
import soSanh from './s01/so-sanh.mjs';
import bamMacChuKy from './s01/bam-mac-chu-ky.mjs';
import biMatRo from './s01/bi-mat-ro.mjs';
import lab from './s01/lab.mjs';
import quiz from './s01/quiz.mjs';

export default {
  title: 'Chapter 1 — Credentials, and the primitives underneath|||Chương 1 — Tín vật, và những nguyên hàm bên dưới',
  description: 'Tín vật kiểu bearer và những đường nó rò (Referer, log), ngẫu nhiên mật mã đối lại Math.random (đoán được từ 4 giá trị), so sánh hằng thời gian đo thật và tra digest thay vì so, băm/MAC/chữ ký (length extension, khoá dùng chung, CTR đối lại GCM), những chỗ bí mật rò mà không ai tấn công — rồi Lab 1 dựng bộ công cụ nguyên hàm của LabFlow ID có máy chấm.',
  lessons: [tinVat, ngauNhien, soSanh, bamMacChuKy, biMatRo, lab, quiz],
};
