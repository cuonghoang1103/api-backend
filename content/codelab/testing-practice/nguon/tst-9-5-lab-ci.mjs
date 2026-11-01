/**
 * Testing · 9.5 Lab — rules that keep a workflow safe — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-lab-9).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-9-5-lab-ci',
  ten: "9.5 Lab — rules that keep a workflow safe",
  khoa: KHOA,
  baiHoc: 'tst-9-5-lab-ci',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 15 test
    deTuDong('tst-cl-lab-9', { doKho: 'HARD', phut: 45, tests: ["src/ci/policy.test.js"] }),
  ],
};
