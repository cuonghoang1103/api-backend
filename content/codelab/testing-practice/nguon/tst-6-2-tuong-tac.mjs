/**
 * Testing · 6.2 Type, submit, wait: the booking form in use — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-6-2).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-6-2-tuong-tac',
  ten: "6.2 Type, submit, wait: the booking form in use",
  khoa: KHOA,
  baiHoc: 'tst-6-2-tuong-tac',
  de: [
    // chạy trên máy (mutants not killable in browser) — web không chấm
    deTuDong('tst-cl-6-2', { doKho: 'MEDIUM', phut: 35, taiMay: true }),
  ],
};
