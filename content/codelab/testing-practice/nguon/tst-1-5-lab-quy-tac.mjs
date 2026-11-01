/**
 * Testing · 1.5 Lab — rules suite, 8 mutants — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-lab-1).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-1-5-lab-quy-tac',
  ten: "1.5 Lab — rules suite, 8 mutants",
  khoa: KHOA,
  baiHoc: 'tst-1-5-lab-quy-tac',
  de: [
    // chấm trong trình duyệt — lời giải: 2 tệp test của khoá, 40 test
    deTuDong('tst-cl-lab-1', { doKho: 'HARD', phut: 45, tests: ["src/rules/booking.test.js","src/rules/time.test.js"] }),
  ],
};
