/**
 * Testing — khoá học CuongThai (Courses, GENERAL). SOẠN TRỌN 31/10–01/11/2026: Mục 0 + Chương 1–11 (./testing/s00-intro.mjs … s10-tdd-doi-that.mjs,
 * s11-du-an-cuoi-khoa.mjs — dự án cuối khoá US-11, bài thi cuối khoá 18 câu, học tiếp). Dự án xuyên khoá LabFlow Lite (./testing/_labflow-lite);
 * slide deck tst-* ở scripts/slides-src, ảnh R2 images/academy/TST/v1 (bản dựng lại: VER trong testing/_slides.mjs). Quy trình soạn: testing/_HOP-DONG.md.
 * Khung 24/09/2026 đã thay hết bằng chương thật (title chương giữ nguyên như khung — seeder neo chương bằng tiêu đề).
 */
import s00 from './testing/s00-intro.mjs';
import s01 from './testing/s01-unit-dau-tien.mjs';
import s02 from './testing/s02-bat-dong-bo.mjs';
import s03 from './testing/s03-test-double.mjs';
import s04 from './testing/s04-tich-hop-db.mjs';
import s05 from './testing/s05-api-http.mjs';
import s06 from './testing/s06-react.mjs';
import s07 from './testing/s07-e2e.mjs';
import s08 from './testing/s08-chat-luong.mjs';
import s09 from './testing/s09-ci.mjs';
import s10 from './testing/s10-tdd-doi-that.mjs';
import s11 from './testing/s11-du-an-cuoi-khoa.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'testing',
    title: 'Testing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/testing.png?v=1',
    shortDescription: 'Write tests that catch real bugs and run in CI: unit, integration against a real database, API and end-to-end browser tests, mocks without lying to yourself, and a test suite your team trusts.|||Viết test bắt được lỗi thật và chạy trong CI: unit, integration với cơ sở dữ liệu thật, test API và end-to-end trên trình duyệt, mock mà không tự lừa mình, và một bộ test cả nhóm tin được.',
    description: 'Khoá Testing từ số 0 tới mức tự dựng được bộ test cho một ứng dụng Node/TypeScript + Next.js thật và chạy nó trong GitHub Actions. Đi từ vì sao cần test và kim tự tháp test, qua Vitest/Jest cho unit test, test code bất đồng bộ, mock đúng chỗ, test tích hợp với Postgres thật trong Docker, test API bằng Supertest, test giao diện React bằng Testing Library, end-to-end bằng Playwright, đo độ phủ và đọc nó cho đúng, test không ổn định (flaky), TDD trong thực tế, tới một dự án cuối khoá và câu hỏi phỏng vấn về testing.',
    whatYouLearn: 'Viết unit test rõ ràng cho hàm và class TypeScript; test code async và bắt lỗi thời gian; biết khi nào mock, khi nào dùng thứ thật; dựng test tích hợp chạy với Postgres thật trong container; test REST API đầu-cuối; test component React theo cách người dùng dùng nó; viết test e2e Playwright ổn định; đọc độ phủ mà không bị nó lừa; và cắm cả bộ test vào CI.',
    requirements: 'Biết JavaScript cơ bản (hàm, mảng, object, import/export, try/catch) và dùng được terminal; cần Node.js 22.12 trở lên (bài 0.3 hướng dẫn cài). Không cần biết gì về testing, TypeScript, React, Docker hay SQL — chương nào dùng tới thì dạy tới đó. Khoá tự đủ; nếu đang học SWT301 (Software Testing) trên Academy thì hai bên bổ sung nhau: SWT301 dạy lý thuyết ISTQB và thiết kế test case trên giấy/Report 5.x, khoá này biến chính các kỹ thuật đó (phân vùng, giá trị biên, bảng quyết định…) thành test tự động chạy thật trên dự án LabFlow Lite.',
    documentsNote: 'Tài liệu chính: vitest.dev • jestjs.io • testing-library.com • playwright.dev • testcontainers.com • martinfowler.com/testing.',
  },
  sections: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11],
};
