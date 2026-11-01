/**
 * Testing · 5.2 Who are you, and what may you see — 401, 403, 404 with real tokens — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-5-2).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-5-2-xac-thuc',
  ten: "5.2 Who are you, and what may you see — 401, 403, 404 with real tokens",
  khoa: KHOA,
  baiHoc: 'tst-5-2-xac-thuc',
  de: [
    // chạy trên máy (mutants not killable in browser) — web không chấm
    deTuDong('tst-cl-5-2', { doKho: 'MEDIUM', phut: 35, taiMay: true }),
  ],
};
