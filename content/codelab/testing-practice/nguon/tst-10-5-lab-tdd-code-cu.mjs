/**
 * Testing · 10.5 Lab 10: weekly bookings test-first, the club fee pinned and refactored — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-lab-10).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-10-5-lab-tdd-code-cu',
  ten: "10.5 Lab 10: weekly bookings test-first, the club fee pinned and refactored",
  khoa: KHOA,
  baiHoc: 'tst-10-5-lab-tdd-code-cu',
  de: [
    // chấm trong trình duyệt — lời giải: 2 tệp test của khoá, 25 test
    deTuDong('tst-cl-lab-10', { doKho: 'HARD', phut: 45, tests: ["src/legacy/clubFee.test.js","src/rules/recurring.test.js"] }),
  ],
};
