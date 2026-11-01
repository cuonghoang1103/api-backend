/**
 * Testing · 11.3 The My bookings screen, as a user sees it — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-11-3, tst-cl-11-3b).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-11-3-frontend',
  ten: "11.3 The My bookings screen, as a user sees it",
  khoa: KHOA,
  baiHoc: 'tst-11-3-frontend',
  de: [
    // chạy trên máy (mutants not killable in browser) — web không chấm
    deTuDong('tst-cl-11-3', { doKho: 'MEDIUM', phut: 35, taiMay: true }),
    // chạy trên máy (playwright) — web không chấm
    deTuDong('tst-cl-11-3b', { doKho: 'MEDIUM', phut: 35, taiMay: true }),
  ],
};
