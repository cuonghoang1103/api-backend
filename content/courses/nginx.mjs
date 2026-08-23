/**
 * Nginx — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 13 mục (Mục 0 + Chương 1–12), zero → vận hành Nginx production, song ngữ EN/VI.
 * Sections tách theo file trong ./nginx/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * KHÔNG trùng khoá Docker (Nginx chỉ xuất hiện như một container ví dụ) và KHÔNG
 * trùng Node.js Chương 16 (nói về việc CHẠY SAU một proxy ngược). Khoá này dạy
 * CHÍNH Nginx — mô hình xử lý, cách nó chọn khối server và location, proxy ngược,
 * bộ đệm, TLS, giới hạn, và chẩn đoán.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/nginx.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/nginx.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/nginx.mjs --apply
 */

import s00 from './nginx/s00-intro.mjs';
import s01 from './nginx/s01-chon-server.mjs';
import s02 from './nginx/s02-location.mjs';
import s03 from './nginx/s03-reverse-proxy.mjs';
import s04 from './nginx/s04-tep-tinh.mjs';
import s05 from './nginx/s05-bo-dem-proxy.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'nginx',
    title: 'Nginx',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug nginx --icon nginx --color 009639 --title "Nginx" --subtitle "Request → Production"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/nginx.png',
    shortDescription: 'The server in front of your server: how one request finds one location block, why a proxy needs six headers to tell the truth, what a cache actually stores, and how to terminate TLS without downgrading it.|||Cái máy chủ đứng trước máy chủ của bạn: một request tìm ra một khối location bằng cách nào, vì sao một proxy cần tới sáu header mới nói đúng sự thật, một bộ đệm thật ra lưu cái gì, và kết thúc TLS thế nào mà không làm nó yếu đi.',
    description: 'Khoá Nginx từ số 0 tới mức vận hành được một máy chủ biên production, do CuongThai tự biên soạn. 13 mục đi từ mô hình sự kiện một tiến trình chủ nhiều tiến trình thợ, qua luật chọn server và location — thứ gây ra nhiều lỗi cấu hình nhất — proxy ngược và bộ header, phục vụ tệp tĩnh, bộ đệm, TLS và HTTP/2, nén, giới hạn tần suất và kết nối, ghi lại URL, cân bằng tải, cho tới một sách công thức chẩn đoán. Mọi ví dụ đều là cấu hình CHẠY THẬT trên nginx 1.24.0 với output đo được.',
    whatYouLearn: 'Hiểu vì sao Nginx xử lý mười nghìn kết nối bằng một nhúm tiến trình; đọc được luật chọn khối server và thứ tự ưu tiên của location để không còn đoán mò; dựng một proxy ngược mà ứng dụng phía sau vẫn biết IP thật, giao thức thật và host thật; phục vụ tệp tĩnh nhanh và đúng; đặt bộ đệm mà không phục vụ dữ liệu cũ; cấu hình TLS đạt điểm A mà không tắt mất khách hàng cũ; bật nén cho đúng thứ đáng nén; đặt giới hạn tần suất và giới hạn kết nối; viết rewrite mà không tạo vòng lặp; cân bằng tải kèm kiểm tra sức khoẻ; và chẩn đoán một cấu hình sai bằng chính log của nó.',
    requirements: 'Biết mở terminal và gõ lệnh cơ bản (khoá Linux & Bash của CuongThai bao phần đó). Hiểu HTTP ở mức request/response/header — khoá Nền tảng Web là đủ. KHÔNG cần biết Nginx trước: Mục 0 dựng lại từ đầu. Có một máy Linux hoặc Docker để chạy thử.',
    documentsNote: 'Tài liệu tham chiếu chính: nginx.org/en/docs (tài liệu chính thức — phần "Modules reference" là chỗ tra từng directive) • nginx.org/en/docs/beginners_guide.html (nhập môn ngắn của chính dự án) • Mozilla SSL Configuration Generator (ssl-config.mozilla.org, sinh cấu hình TLS theo mức tương thích). Phần thực hành đi kèm: track "Nginx" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
    s02,
    s03,
    s04,
    s05,
  ],
};
