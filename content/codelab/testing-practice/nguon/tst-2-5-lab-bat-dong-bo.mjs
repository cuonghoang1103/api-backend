/**
 * Testing · 2.5 Lab — async, time and errors, 8 mutants — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-lab-2).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-2-5-lab-bat-dong-bo',
  ten: "2.5 Lab — async, time and errors, 8 mutants",
  khoa: KHOA,
  baiHoc: 'tst-2-5-lab-bat-dong-bo',
  de: [
    // chấm trong trình duyệt — lời giải: 5 tệp test của khoá, 36 test
    deTuDong('tst-cl-lab-2', { doKho: 'HARD', phut: 45, tests: ["src/auth/login-guard.test.js","src/lib/retry.test.js","src/rules/days.test.js","src/booking/service.test.js","src/rules/cancel.test.js"] }),
  ],
};
