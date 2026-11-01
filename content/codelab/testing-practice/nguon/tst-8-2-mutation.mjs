/**
 * Testing · 8.2 Kill what Stryker found alive — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-8-2).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-8-2-mutation',
  ten: "8.2 Kill what Stryker found alive",
  khoa: KHOA,
  baiHoc: 'tst-8-2-mutation',
  de: [
    // chấm trong trình duyệt — lời giải: 2 tệp test của khoá, 10 test
    deTuDong('tst-cl-8-2', { doKho: 'MEDIUM', phut: 25, tests: ["src/rules/mutation-gaps.test.js","src/lib/retry-last.test.js"] }),
  ],
};
