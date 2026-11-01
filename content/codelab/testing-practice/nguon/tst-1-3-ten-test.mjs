/**
 * Testing · 1.3 checkSlot as an it.each table — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-1-3).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-1-3-ten-test',
  ten: "1.3 checkSlot as an it.each table",
  khoa: KHOA,
  baiHoc: 'tst-1-3-ten-test',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 28 test
    deTuDong('tst-cl-1-3', { doKho: 'EASY', phut: 25, tests: ["src/rules/booking.test.js"] }),
  ],
};
