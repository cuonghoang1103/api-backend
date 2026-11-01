/**
 * Testing · 3.4 Pure core and injected reminder — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-3-4).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-3-4-thiet-ke',
  ten: "3.4 Pure core and injected reminder",
  khoa: KHOA,
  baiHoc: 'tst-3-4-thiet-ke',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 4 test
    deTuDong('tst-cl-3-4', { doKho: 'MEDIUM', phut: 25, tests: ["demo3/th34.test.js"] }),
  ],
};
