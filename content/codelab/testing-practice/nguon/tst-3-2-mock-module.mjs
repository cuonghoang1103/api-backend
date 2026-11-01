/**
 * Testing · 3.2 HTTP mailer adapter with MSW (+ vi.mock for the reminder) — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-3-2).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-3-2-mock-module',
  ten: "3.2 HTTP mailer adapter with MSW (+ vi.mock for the reminder)",
  khoa: KHOA,
  baiHoc: 'tst-3-2-mock-module',
  de: [
    // chấm trong trình duyệt — lời giải: 2 tệp test của khoá, 4 test
    deTuDong('tst-cl-3-2', { doKho: 'MEDIUM', phut: 25, tests: ["demo3/msw.test.js","demo3/vi-mock.test.js"] }),
  ],
};
