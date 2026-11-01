/**
 * Testing · 7.1 Your first browser tests: the sign-in page — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-7-1).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-7-1-playwright',
  ten: "7.1 Your first browser tests: the sign-in page",
  khoa: KHOA,
  baiHoc: 'tst-7-1-playwright',
  de: [
    // chạy trên máy (playwright) — web không chấm
    deTuDong('tst-cl-7-1', { doKho: 'MEDIUM', phut: 35, taiMay: true }),
  ],
};
