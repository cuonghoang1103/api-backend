/**
 * Testing — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"): chương + bài + đề cương,
 * bài giảng chi tiết soạn sau theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

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
    requirements: 'Biết JavaScript/TypeScript cơ bản và Node.js. Nên học trước khoá Git, Docker (để chạy CSDL thật khi test) và GitHub Actions (để chạy test trong CI). Nếu đang học môn SWT301 (Software Testing) trên Academy: SWT301 dạy LÝ THUYẾT thiết kế ca test theo ISTQB (phân vùng tương đương, giá trị biên, bảng quyết định, white-box, quản lý defect); khoá này là phần THỰC HÀNH biến các ca test đó thành code tự động trên stack Node/TypeScript/React — hai bên bổ sung, không lặp lại nhau.',
    documentsNote: 'Tài liệu chính: vitest.dev • jestjs.io • testing-library.com • playwright.dev • testcontainers.com • martinfowler.com/testing.',
  },
  sections: khung('tst', [
    ['Section 0 — Why test, and how to study this course', 'Mục 0 — Vì sao phải test, và cách học khoá này', 'Test là gì, vì sao công ty đòi hỏi nó, và một lộ trình học không nản.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What testing is, and why every company asks about it', 'Bắt đầu tại đây (1/2) — Test là gì, và vì sao công ty nào cũng hỏi', 'Test bằng hình ảnh đời thường · Kiểm thử tự động khác kiểm thử tay · Lịch sử: xUnit, JUnit, TDD của Kent Beck · Test giúp gì trong đồ án và khi đi làm · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Life without tests: real incidents, and how to learn without giving up', 'Bắt đầu tại đây (2/2) — Khi không có test: sự cố thật, và cách học không bỏ cuộc', 'Sự cố thật do thiếu test (có nguồn) · Tình huống đồ án: sửa một chỗ hỏng ba chỗ · Nỗi sợ "viết test tốn thời gian" · Lộ trình tối thiểu và đầy đủ'],
      ['kim-tu-thap', 'The test pyramid (and the trophy)', 'Kim tự tháp test (và chiếc cúp)', 'Unit · integration · e2e: tốc độ, độ tin, chi phí · Testing trophy của Kent C. Dodds · Chọn tỉ lệ cho dự án của bạn · Nối với SWT301: các cấp test (Ch.2) và test pyramid (8.6) — ở đây là phần áp dụng'],
      ['cai-dat', 'Setting up: Vitest in a TypeScript project', 'Cài đặt: Vitest trong dự án TypeScript', 'Vitest vs Jest · Cấu hình tối thiểu · Chạy, watch mode, lọc test · Tích hợp VS Code'],
    ]],
    ['Chapter 1 — Your first unit tests', 'Chương 1 — Những unit test đầu tiên', 'Viết, đọc và đặt tên test; assert đúng thứ cần assert.', [
      ['cau-truc', 'Anatomy of a test: arrange, act, assert', 'Giải phẫu một test: chuẩn bị, hành động, khẳng định', 'describe/it/expect · AAA · Một test một lý do để đỏ'],
      ['matcher', 'Matchers that say what you mean', 'Matcher nói đúng điều bạn muốn', 'toBe vs toEqual vs toStrictEqual · Số thực · Ngoại lệ · Snapshot và khi nào không nên'],
      ['ten-test', 'Naming and organising tests', 'Đặt tên và sắp xếp test', 'Tên test là tài liệu · File cạnh code hay thư mục riêng · Test table (it.each)'],
      ['ham-thuan', 'Testing pure functions and edge cases', 'Test hàm thuần và các trường hợp biên', 'Biến ca test EP/BVA (đã học ở SWT301 bài 4.2–4.3) thành it.each · Đầu vào rỗng/null · Bảng quyết định (SWT301 4.4) thành test · Property-based testing (fast-check) nhập môn'],
    ]],
    ['Chapter 2 — Async code, time and errors', 'Chương 2 — Code bất đồng bộ, thời gian và lỗi', 'Promise, async/await, timer, và code ném lỗi.', [
      ['async', 'Testing async/await and promises', 'Test async/await và promise', 'Quên await thì test luôn xanh · resolves/rejects · Test song song'],
      ['thoi-gian', 'Controlling time: fake timers and dates', 'Điều khiển thời gian: fake timer và ngày giờ', 'vi.useFakeTimers · Date cố định · Debounce/retry · Múi giờ UTC vs +07'],
      ['loi', 'Testing errors and failure paths', 'Test lỗi và nhánh thất bại', 'Ném lỗi đúng kiểu · Thông báo lỗi · Nhánh catch thường bị bỏ quên'],
      ['ngau-nhien', 'Randomness, IDs and non-determinism', 'Ngẫu nhiên, ID và thứ không tất định', 'Seed · Inject hàm tạo ID · Test ổn định mỗi lần chạy'],
    ]],
    ['Chapter 3 — Test doubles without lying to yourself', 'Chương 3 — Mock, stub, spy mà không tự lừa mình', 'Khi nào thay thế một phụ thuộc, và cái giá của việc đó.', [
      ['phan-loai', 'Stub, mock, spy, fake: what each one is', 'Stub, mock, spy, fake: mỗi cái là gì', 'Bảng so sánh · vi.fn · vi.spyOn · Fake in-memory'],
      ['mock-module', 'Mocking modules and HTTP', 'Mock module và HTTP', 'vi.mock · MSW cho HTTP · Không mock thứ bạn không sở hữu'],
      ['qua-da', 'When mocks make tests worthless', 'Khi mock làm test vô giá trị', 'Test chỉ kiểm lại mock · Test gắn chặt cài đặt · Refactor làm đỏ cả loạt'],
      ['thiet-ke', 'Designing code that is easy to test', 'Thiết kế code dễ test', 'Dependency injection nhẹ · Tách I/O khỏi logic · Ports & adapters cho người mới'],
    ]],
    ['Chapter 4 — Integration tests with a real database', 'Chương 4 — Test tích hợp với cơ sở dữ liệu thật', 'Postgres thật trong Docker, dữ liệu mẫu, và cô lập giữa các test.', [
      ['vi-sao', 'Why a real database beats a mocked one', 'Vì sao CSDL thật hơn CSDL giả', 'Bug chỉ lộ ở SQL thật · SQLite không phải Postgres · Chi phí và tốc độ'],
      ['docker-db', 'Throwaway Postgres for tests (Docker, tmpfs)', 'Postgres dùng một lần cho test (Docker, tmpfs)', 'Compose cho test · tmpfs cho nhanh · Chờ sẵn sàng · Trỏ khoá Docker Ch13'],
      ['testcontainers', 'Testcontainers for Node', 'Testcontainers cho Node', 'Khởi động container trong test · Vòng đời · Chạy trong CI'],
      ['co-lap', 'Isolation: transactions, truncation, seed data', 'Cô lập: transaction, xoá bảng, dữ liệu mẫu', 'Rollback mỗi test · Truncate · Factory dữ liệu · Prisma trong test'],
    ]],
    ['Chapter 5 — Testing HTTP APIs', 'Chương 5 — Test API HTTP', 'Test Express/REST từ ngoài vào như một client thật.', [
      ['supertest', 'Supertest: requests without a running server', 'Supertest: gửi request mà không cần bật server', 'Tách app khỏi listen · Status, header, body · JSON schema'],
      ['xac-thuc', 'Testing authentication and authorisation', 'Test xác thực và phân quyền', 'Token giả hợp lệ · 401 vs 403 · Người A không đọc được dữ liệu người B'],
      ['validation', 'Validation and error responses', 'Kiểm dữ liệu vào và phản hồi lỗi', 'Zod · Trường thiếu/sai kiểu · Mã lỗi nhất quán'],
      ['hop-dong', 'Contract testing and OpenAPI', 'Contract test và OpenAPI', 'Frontend và backend lệch nhau · Kiểm theo OpenAPI · Pact nhập môn'],
    ]],
    ['Chapter 6 — Testing React components', 'Chương 6 — Test component React', 'Testing Library: test như người dùng dùng giao diện.', [
      ['testing-library', 'Testing Library: query by what users see', 'Testing Library: tìm phần tử theo thứ người dùng thấy', 'getByRole · Ưu tiên truy vấn · jsdom vs happy-dom'],
      ['tuong-tac', 'User events, forms and async UI', 'Sự kiện người dùng, form và giao diện bất đồng bộ', 'user-event · findBy/waitFor · Form có validation'],
      ['api-gia', 'Components that fetch data', 'Component có gọi API', 'MSW cho component · Trạng thái loading/lỗi/rỗng'],
      ['nextjs', 'Testing in Next.js (client and server components)', 'Test trong Next.js (client và server component)', 'Cái gì test được bằng unit · Cái gì để e2e · Route handler'],
    ]],
    ['Chapter 7 — End-to-end tests with Playwright', 'Chương 7 — Test end-to-end với Playwright', 'Trình duyệt thật, luồng thật, và test không chập chờn.', [
      ['playwright', 'Playwright: your first browser test', 'Playwright: test trình duyệt đầu tiên', 'Cài đặt · Locator · Auto-wait · Codegen'],
      ['luong', 'Testing real user flows', 'Test luồng người dùng thật', 'Đăng nhập một lần dùng lại (storageState) · Đặt lịch khám từ đầu tới cuối'],
      ['on-dinh', 'Making e2e tests stable', 'Làm test e2e ổn định', 'Chờ đúng cách · Dữ liệu riêng mỗi test · Trace viewer · Retry có kiểm soát'],
      ['da-trinh-duyet', 'Browsers, devices and visual checks', 'Nhiều trình duyệt, thiết bị và kiểm tra hình ảnh', 'Chromium/Firefox/WebKit · Mobile viewport · Screenshot so sánh'],
    ]],
    ['Chapter 8 — Coverage, quality and flaky tests', 'Chương 8 — Độ phủ, chất lượng và test chập chờn', 'Đọc số liệu cho đúng và giữ bộ test đáng tin.', [
      ['do-phu', 'Coverage: what it measures and what it cannot', 'Độ phủ: đo được gì và không đo được gì', 'Line/branch/function — statement & decision coverage đã học ở SWT301 Ch.5, ở đây đo bằng công cụ thật (v8/istanbul) · 100% vẫn có bug · Ngưỡng hợp lý'],
      ['mutation', 'Mutation testing: testing your tests', 'Mutation testing: kiểm tra chính bộ test', 'Stryker nhập môn · Test sống sót đột biến'],
      ['flaky', 'Flaky tests: finding and fixing them', 'Test chập chờn: tìm và sửa', 'Nguyên nhân phổ biến · Chạy lặp để bắt · Cách ly và sửa tận gốc'],
      ['toc-do', 'Keeping the suite fast', 'Giữ bộ test chạy nhanh', 'Song song · Chia shard · Chỉ chạy test bị ảnh hưởng'],
    ]],
    ['Chapter 9 — Tests in CI', 'Chương 9 — Test trong CI', 'Chạy cả bộ test trên GitHub Actions và chặn merge khi đỏ.', [
      ['github-actions', 'Running tests in GitHub Actions', 'Chạy test trong GitHub Actions', 'Workflow test · Cache npm · Service container Postgres · Trỏ khoá GitHub Actions'],
      ['bao-cao', 'Reports, annotations and artifacts', 'Báo cáo, annotation và artifact', 'JUnit report · Annotation trên PR · Lưu trace Playwright khi đỏ'],
      ['bat-buoc', 'Required checks and branch protection', 'Check bắt buộc và bảo vệ nhánh', 'Không merge khi test đỏ · Test chạy chậm để đêm'],
      ['ma-tran', 'Matrix and sharding in CI', 'Ma trận và chia nhỏ test trong CI', 'Nhiều phiên bản Node · Shard Playwright · Gộp kết quả'],
    ]],
    ['Chapter 10 — TDD and testing in real teams', 'Chương 10 — TDD và testing trong đội thật', 'Viết test trước, test code cũ, và văn hoá test.', [
      ['tdd', 'TDD in practice: red, green, refactor', 'TDD trong thực tế: đỏ, xanh, refactor', 'Một tính năng làm bằng TDD từ đầu · Khi nào TDD không hợp · Nối SWT301 9.6 (TDD/ATDD/BDD): ở đây là làm thật trên code'],
      ['code-cu', 'Adding tests to legacy code', 'Thêm test cho code cũ chưa có test', 'Characterization test · Tách phụ thuộc từng bước'],
      ['review', 'Reviewing tests in pull requests', 'Review test trong pull request', 'Test tốt trông thế nào · Mùi test xấu'],
      ['phong-van', 'Testing interview questions', 'Câu hỏi phỏng vấn về testing', 'Câu hỏi hay gặp và ý trả lời · Kể về cách bạn test dự án'],
    ]],
    ['Chapter 11 — Capstone: a fully tested booking app', 'Chương 11 — Dự án cuối khoá: ứng dụng đặt lịch được test đầy đủ', 'Dựng bộ test hoàn chỉnh cho app "Đặt lịch phòng khám".', [
      ['ke-hoach', 'Planning the test strategy', 'Lập chiến lược test', 'Rủi ro ở đâu · Tỉ lệ unit/integration/e2e · Dữ liệu mẫu'],
      ['backend', 'Testing the backend end to end', 'Test backend từ đầu tới cuối', 'Unit + integration với Postgres + API'],
      ['frontend', 'Testing the frontend and the full flow', 'Test frontend và luồng đầy đủ', 'Component + Playwright đặt lịch'],
      ['ci', 'Shipping it in CI, and the final checklist', 'Đưa vào CI, và checklist cuối', 'Workflow hoàn chỉnh · Checklist năng lực cả khoá'],
    ]],
  ]),
};
