/**
 * Testing · 11.1 A traceability matrix that tells the truth — đề `mutation` dựng TỰ ĐỘNG từ đề của khoá (tst-cl-11-1).
 * Nguồn sự thật: content/courses/testing/_de-codelab-mutation.json + _labflow-lite. Bộ dựng: ./_tu-dong.mjs.
 * Danh sách `tests` = tệp test tham khảo của khoá chạy được trong bộ chạy trình duyệt và đủ diệt mọi đột biến (chọn bằng
 * phép phủ tham lam, kiểm lại bằng codelab-xuat-de). `taiMay: true` = cần PostgreSQL/Playwright/HTTP thật ⇒ người học chạy
 * cham-tai-may.mjs trên máy rồi tự đánh dấu.
 */
import { deTuDong } from './_tu-dong.mjs';
import { KHOA } from './_chung.mjs';

export default {
  slug: 'tst-11-1-ke-hoach',
  ten: "11.1 A traceability matrix that tells the truth",
  khoa: KHOA,
  baiHoc: 'tst-11-1-ke-hoach',
  de: [
    // chấm trong trình duyệt — lời giải: 1 tệp test của khoá, 19 test
    deTuDong('tst-cl-11-1', { doKho: 'MEDIUM', phut: 25, tests: ["src/ci/rtm.test.js"] }),
  ],
};
