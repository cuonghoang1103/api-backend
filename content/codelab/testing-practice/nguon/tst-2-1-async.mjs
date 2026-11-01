/**
 * Testing · 2.1 bookLab: async results and overlaps — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-2-1).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-2-1-async',
  ten: "2.1 bookLab: async results and overlaps",
  khoa: KHOA,
  baiHoc: 'tst-2-1-async',
  de: [
    // chấm trong trình duyệt — lời giải: 2 tệp test của khoá, 10 test
    deTuDong('tst-cl-2-1', { doKho: 'MEDIUM', phut: 25, tests: ["src/booking/service.test.js","demo2/th21.test.js"] }),
  ],
};
