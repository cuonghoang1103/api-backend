/**
 * Testing · 8.5 Lab 8: check-in and no-shows — strong and stable — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-lab-8).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-8-5-lab-chat-luong',
  ten: "8.5 Lab 8: check-in and no-shows — strong and stable",
  khoa: KHOA,
  baiHoc: 'tst-8-5-lab-chat-luong',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 16 test
    deTuDong('tst-cl-lab-8', { doKho: 'HARD', phut: 45, tests: ["src/rules/checkin.test.js"] }),
  ],
};
