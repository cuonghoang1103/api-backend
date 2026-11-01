/**
 * Testing · 6.4 Next.js: free slots, a route handler and its data — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-6-4).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-6-4-nextjs',
  ten: "6.4 Next.js: free slots, a route handler and its data",
  khoa: KHOA,
  baiHoc: 'tst-6-4-nextjs',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 3 test
    deTuDong('tst-cl-6-4', { doKho: 'MEDIUM', phut: 25, tests: ["demo6/route.test.js"] }),
  ],
};
