/**
 * Web Foundations — Mục 0: Giới thiệu · Nền tảng · Cài đặt · Cách học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * ⚠️ KHÔNG dùng backtick trần trong content (dùng &#96;); mọi `${` trong code mẫu
 * escape thành \${. Bài QUIZ (nếu có) phải có field content (string).
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L04 from './s00/wf-0-4-cach-hoc.mjs';
import L03 from './s00/wf-0-3-cai-dat-may.mjs';
import L02 from './s00/wf-0-2-web-hoat-dong.mjs';
import L01 from './s00/wf-0-1-gioi-thieu-lo-trinh.mjs';

export default {
  title: 'Section 0 — Introduction, Foundations & Setup|||Mục 0 — Giới thiệu, Nền tảng & Cài đặt',
  description: 'Đọc trước tiên: khoá này dành cho ai, vì sao cần nền tảng trước khi học Node.js/Next.js, một trang web hoạt động ra sao, cài đặt máy như thế nào, và cách học sao cho hiệu quả.',
  lessons: [
    /* ─────────────────── 0.0 slide bài giảng ─────────────────── */
    {
      title: '0.0 — Lecture slides: Section 0 in 11 slides|||0.0 — Slide bài giảng: Mục 0 trong 11 slide',
      slug: 'wf-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ slide mở đầu — web hoạt động thế nào, cài máy, và cách học để không bỏ cuộc.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: Section 0 in 11 slides</h2>
<p>Skim this before anything else. It is the map of the whole course: what you are about to learn and in what order.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: Mục 0 trong 11 slide</h2>
<p>Lướt bộ này trước tiên. Nó là bản đồ của cả khoá: sắp học gì và theo thứ tự nào.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-web0', [
  [1, "Bìa"],
  [2, "Nội dung mục 0"],
  [3, "Khoá này dành cho ai"],
  [4, "Gõ địa chỉ rồi chuyện gì xảy ra"],
  [5, "Client và Server"],
  [6, "Frontend · Backend · Full-stack"],
  [7, "Bốn phần mềm cần cài"],
  [8, "Kiểm đã cài xong chưa"],
  [9, "DevTools — công cụ dùng mỗi ngày"],
  [10, "Cách học để không bỏ cuộc"],
  [11, "Bản đồ cả khoá"],
])}
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    L01,

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    L02,

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    L03,

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    L04,
  ],
};
