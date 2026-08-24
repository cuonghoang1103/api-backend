/**
 * Tailwind CSS — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 11 mục (Mục 0 + Chương 1–10), zero → một hệ thiết kế
 * chạy được trên một ứng dụng thật, song ngữ EN/VI.
 * Sections tách theo file trong ./tailwind-css/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * KHÔNG trùng các khoá đã có:
 *   - Web Foundations dạy CSS THUẦN (cascade, box model, flex/grid nguyên bản).
 *   - Next.js dạy KHUNG (routing, render, server component).
 *   - TypeScript dạy KIỂU.
 * Khoá này dạy CÁI TẦNG giữa: một trình sinh CSS đọc mã nguồn của bạn rồi phát
 * sinh đúng phần CSS bạn dùng — và những chỗ mô hình đó rò rỉ.
 *
 * Mọi số đo lấy từ chính `frontend/` của kho này (Tailwind 3.4.14, 793 file
 * .tsx, 26.343 className, 3.683 lớp duy nhất) và từ Tailwind CLI 3.4.14 chạy
 * thật, KHÔNG chép từ tài liệu.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/tailwind-css.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/tailwind-css.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/tailwind-css.mjs --apply
 */

import s00 from './tailwind-css/s00-intro.mjs';
import s01 from './tailwind-css/s01-thang.mjs';
import s02 from './tailwind-css/s02-bien-the.mjs';
import s03 from './tailwind-css/s03-xung-dot.mjs';
import s04 from './tailwind-css/s04-component.mjs';
import s05 from './tailwind-css/s05-cau-hinh.mjs';
import s06 from './tailwind-css/s06-bien-css.mjs';
import s07 from './tailwind-css/s07-layer.mjs';
import s08 from './tailwind-css/s08-kich-thuoc.mjs';
import s09 from './tailwind-css/s09-tiep-can.mjs';
import s10 from './tailwind-css/s10-chan-doan.mjs';
import s11 from './tailwind-css/s11-on-thi.mjs';

export default {
  // Category ĐÃ CÓ (dùng chung với Next.js và Web Foundations) — giữ NGUYÊN
  // icon `Layout` và sortOrder 2, nếu không lần seed này sẽ ghi đè mục lọc
  // của hai khoá kia trên trang /courses.
  category: { slug: 'frontend', name: 'Frontend', icon: 'Layout', sortOrder: 2 },
  course: {
    slug: 'tailwind-css',
    title: 'Tailwind CSS',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug tailwind-css --icon tailwindcss --color 06B6D4 --title "Tailwind CSS" --subtitle "Lớp tiện ích → Hệ thiết kế"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/tailwind-css.png',
    shortDescription: 'Tailwind is a CSS generator that reads your source and emits only what you used. Everything surprising about it follows from that one sentence — measured on a real app with 793 components and 3,683 distinct utility classes.|||Tailwind là một trình sinh CSS đọc mã nguồn của bạn rồi phát sinh đúng phần bạn đã dùng. Mọi thứ gây bất ngờ ở nó đều suy ra từ một câu đó — đo trên một ứng dụng thật với 793 component và 3.683 lớp tiện ích khác nhau.',
    description: 'Khoá Tailwind CSS từ số 0 tới một hệ thiết kế chạy được, do CuongThai tự biên soạn. 11 mục đi từ mô hình tinh thần đúng (Tailwind KHÔNG phải thư viện CSS — nó là một trình sinh quét mã nguồn), qua thang giá trị và vì sao thang mới là thứ đáng học chứ không phải tên lớp, cách các biến thể trạng thái và điểm ngắt thật sự biên dịch ra, chỗ mô hình rò rỉ (thứ tự phát sinh quyết định lớp nào thắng — KHÔNG phải thứ tự bạn viết), cách soạn lớp động mà không dính lỗi đó, cách mở rộng cấu hình bằng biến CSS để một lớp đúng ở cả theme sáng lẫn tối, tối ưu kích thước, khả năng tiếp cận, và một sách công thức chẩn đoán. Mọi kết quả đều ĐO THẬT trên một ứng dụng 793 component và bằng Tailwind CLI chạy thật, không chép từ tài liệu.',
    whatYouLearn: 'Hiểu Tailwind như một trình sinh CSS chứ không phải một bộ lớp có sẵn — và vì sao mọi hành vi lạ đều suy ra từ đó; đọc thang giá trị thay vì học thuộc tên lớp, nên đoán được lớp chưa từng gặp; biết CHÍNH XÁC lớp nào thắng khi hai lớp xung đột, và vì sao `mt-8` thắng `mt-32` trong một chuỗi mười một lớp; soạn lớp động an toàn bằng `clsx` + `tailwind-merge` và biết 76% mã của một dự án thật đang KHÔNG làm thế; mở rộng cấu hình bằng biến CSS để một lớp đúng ở cả hai theme mà không cần một biến thể `dark:` nào; dùng `@layer` cho đúng — và đo được 88% CSS của một dự án thật đang nằm NGOÀI mọi layer; giữ kích thước CSS nhỏ mà không cần đoán; và chẩn đoán "lớp không ăn" theo một cây quyết định thay vì thêm `!important`.',
    requirements: 'Biết HTML và CSS ở mức căn bản: selector, box model, và ý niệm cascade (khoá Web Foundations của CuongThai bao phần đó, và khoá này sẽ nhắc lại chỗ cần). Biết đọc một component React/JSX ở mức nhìn ra `className` — KHÔNG cần giỏi React. KHÔNG cần biết Sass, PostCSS hay build tool trước. Có Node 18+ để chạy Tailwind CLI là đủ thực hành toàn bộ khoá.',
    documentsNote: 'Tài liệu tham chiếu chính: tailwindcss.com/docs (mục "Core Concepts" là phần đáng đọc hết, đặc biệt "Styling with utility classes" và "Detecting classes in source files") • tailwindcss.com/docs/theme cho thang giá trị • github.com/dcastil/tailwind-merge cho phần soạn lớp động • developer.mozilla.org/en-US/docs/Web/CSS/@layer cho cascade layer (thứ Tailwind dựng trên) • MDN CSS specificity. Phần thực hành đi kèm: track "Tailwind CSS" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
    s02,
    s03,
    s04,
    s05,
    s06,
    s07,
    s08,
    s09,
    s10,
    s11,
  ],
};
