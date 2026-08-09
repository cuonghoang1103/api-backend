/**
 * Web Foundations — khoá NỀN TẢNG của CuongThai (Courses, academyType=GENERAL).
 * Zero → đủ nền để vào Node.js và Next.js/React. Song ngữ EN/VI.
 * 11 chương (Mục 0 + Ch1-10). Sections tách theo file ./web-foundations/sNN-*.mjs.
 *
 * Seed: node scripts/course-seed.mjs --file ./content/courses/web-foundations.mjs --apply
 * Kiểm:  node scripts/course-content-check.mjs ./content/courses/web-foundations.mjs
 */
import s00 from './web-foundations/s00-intro.mjs';
import s01 from './web-foundations/s01-tools.mjs';
import s02 from './web-foundations/s02-html.mjs';
import s03 from './web-foundations/s03-css.mjs';
import s04 from './web-foundations/s04-js.mjs';
import s05 from './web-foundations/s05-js-async.mjs';

export default {
  category: { slug: 'frontend', name: 'Frontend', icon: 'Layout', sortOrder: 2 },
  course: {
    slug: 'web-foundations',
    title: 'Nền tảng Lập trình Web',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Bìa: chạy TRONG container backend rồi seed lại (đừng sửa tay).
    // node scripts/course-cover.mjs --slug web-foundations --icon html5 --color E34F26 \
    //   --title "Nền tảng Lập trình Web" --subtitle "Zero → sẵn sàng học Node.js & Next.js"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/web-foundations.png?v=1',
    shortDescription: 'The bedrock every web course assumes: how the web works, the tools, HTML, CSS, JavaScript, HTTP and APIs, cookies and auth, data and SQL, TypeScript, and how to think like a programmer — so Node.js and Next.js finally make sense.|||Nền móng mà mọi khoá web đều mặc định bạn đã có: web hoạt động thế nào, công cụ, HTML, CSS, JavaScript, HTTP và API, cookie và xác thực, dữ liệu và SQL, TypeScript, và cách tư duy như một lập trình viên — để Node.js và Next.js cuối cùng trở nên dễ hiểu.',
    description: 'Khoá nền tảng do CuongThai biên soạn cho người mới hoàn toàn. Nếu bạn từng mở một khoá Node.js hay Next.js và thấy "chả hiểu gì" — thường không phải vì bạn kém, mà vì khoá đó mặc định bạn đã biết HTML/CSS/JavaScript, hiểu luồng client–server, HTTP, cookie, API… Khoá này lấp đúng khoảng trống đó: 11 chương đi từ "một trang web hiện ra thế nào" tới đủ vốn để tự tin vào các khoá chuyên sâu. Mỗi khái niệm đều được định nghĩa, ví von cho dễ nhớ, có ví dụ mô phỏng chạy được và video minh hoạ nhúng từ YouTube.',
    whatYouLearn: 'Hiểu một trang web đi từ URL tới màn hình thế nào (client/server, DNS, HTTP/HTTPS); dùng thành thạo bộ công cụ (terminal, VS Code, Git/GitHub, Node & npm); viết HTML có cấu trúc và CSS bố cục/responsive; nắm JavaScript cốt lõi và JS bất đồng bộ (Promise, async/await, event loop, fetch); đọc hiểu luồng HTTP và REST API (method, status, headers, JSON, query/params); hiểu cookie, session, đăng nhập/JWT, CORS và HTTPS; nắm khái niệm cơ sở dữ liệu, SQL và CRUD; đọc được TypeScript cơ bản; và tư duy lập trình — chia nhỏ vấn đề, gỡ lỗi, đọc thông báo lỗi.',
    requirements: 'Không cần biết lập trình từ trước — khoá bắt đầu từ số 0. Chỉ cần một máy tính (Windows, macOS hoặc Linux) nối mạng, và sự kiên nhẫn gõ theo từng ví dụ. Mọi phần mềm dùng trong khoá đều miễn phí.',
    documentsNote: 'Tài liệu tham chiếu chính: developer.mozilla.org (MDN — bách khoa toàn thư về web, chuẩn nhất) • roadmap.sh (lộ trình học trực quan) • javascript.info (JavaScript từ cơ bản tới sâu). Học xong khoá này, bước tiếp theo là khoá Node.js (backend) và Next.js & React (frontend) của CuongThai.',
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
