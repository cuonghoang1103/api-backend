/**
 * Testing · 3.1 bookAndNotify with the right double for each job — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-3-1).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-3-1-phan-loai',
  ten: "3.1 bookAndNotify with the right double for each job",
  khoa: KHOA,
  baiHoc: 'tst-3-1-phan-loai',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 6 test
    deTuDong('tst-cl-3-1', { doKho: 'MEDIUM', phut: 25, tests: ["demo3/doubles.test.js"] }),
  ],
};
