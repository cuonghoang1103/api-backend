/**
 * Testing · 10.4 Live coding: test mergeBusy in 20 minutes — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-10-4).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-10-4-phong-van',
  ten: "10.4 Live coding: test mergeBusy in 20 minutes",
  khoa: KHOA,
  baiHoc: 'tst-10-4-phong-van',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 8 test
    deTuDong('tst-cl-10-4', { doKho: 'MEDIUM', phut: 25, tests: ["src/rules/busy.test.js"] }),
  ],
};
