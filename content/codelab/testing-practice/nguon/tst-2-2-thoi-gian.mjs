/**
 * Testing · 2.2 Time rules: cancel, lock-out, retry, Viet Nam days — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-2-2).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-2-2-thoi-gian',
  ten: "2.2 Time rules: cancel, lock-out, retry, Viet Nam days",
  khoa: KHOA,
  baiHoc: 'tst-2-2-thoi-gian',
  de: [
    // chấm trong trình duyệt — lời giải: 4 tệp test của khoá, 16 test
    deTuDong('tst-cl-2-2', { doKho: 'MEDIUM', phut: 25, tests: ["demo2/th22.test.js","src/lib/retry.test.js","src/rules/days.test.js","src/auth/login-guard.test.js"] }),
  ],
};
