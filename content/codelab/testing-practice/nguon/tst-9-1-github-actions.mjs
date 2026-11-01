/**
 * Testing · 9.1 Tests for the CI workflow itself — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-9-1).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-9-1-github-actions',
  ten: "9.1 Tests for the CI workflow itself",
  khoa: KHOA,
  baiHoc: 'tst-9-1-github-actions',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 15 test
    deTuDong('tst-cl-9-1', { doKho: 'MEDIUM', phut: 25, tests: ["src/ci/workflow.test.js"] }),
  ],
};
