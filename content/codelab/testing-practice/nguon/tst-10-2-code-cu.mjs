/**
 * Testing · 10.2 Characterize a legacy report before anyone touches it — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-10-2).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-10-2-code-cu',
  ten: "10.2 Characterize a legacy report before anyone touches it",
  khoa: KHOA,
  baiHoc: 'tst-10-2-code-cu',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 1 test
    deTuDong('tst-cl-10-2', { doKho: 'MEDIUM', phut: 25, tests: ["demo10/dac-ta/4-golden.test.js"] }),
  ],
};
