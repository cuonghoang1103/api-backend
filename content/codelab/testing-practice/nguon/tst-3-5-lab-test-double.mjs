/**
 * Testing · 3.5 Lab — e-mail flow, 8 mutants — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-lab-3).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-3-5-lab-test-double',
  ten: "3.5 Lab — e-mail flow, 8 mutants",
  khoa: KHOA,
  baiHoc: 'tst-3-5-lab-test-double',
  de: [
    // chấm trong trình duyệt — lời giải: 2 tệp test của khoá, 11 test
    deTuDong('tst-cl-lab-3', { doKho: 'HARD', phut: 45, tests: ["src/notify/notify.test.js","src/lib/mailer.test.js"] }),
  ],
};
