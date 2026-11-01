/**
 * Testing · 11.4 The quality report and the gate — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-11-4).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-11-4-ci',
  ten: "11.4 The quality report and the gate",
  khoa: KHOA,
  baiHoc: 'tst-11-4-ci',
  de: [
    // chấm trong trình duyệt — lời giải: 2 tệp test của khoá, 22 test
    deTuDong('tst-cl-11-4', { doKho: 'MEDIUM', phut: 25, tests: ["src/ci/quality.test.js","src/ci/workflow.test.js"] }),
  ],
};
