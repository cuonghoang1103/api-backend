/**
 * React — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nền cho khoá
 * Next.js; bổ trợ môn FER202 ở Academy. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'frontend', name: 'Frontend', icon: 'Layout', sortOrder: 2 },
  course: {
    slug: 'react',
    title: 'React',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/react.png?v=1',
    shortDescription: 'React from the ground up, the modern way: components, props and state, effects without bugs, forms, data fetching, performance, testing and TypeScript — the foundation Next.js assumes you already have.|||React từ gốc, theo cách hiện đại: component, props và state, effect không dính bug, form, lấy dữ liệu, hiệu năng, testing và TypeScript — nền móng mà Next.js giả định bạn đã có.',
    description: 'Khoá React nền tảng với TypeScript và Vite. Đi từ JSX và component, props, state và cách React render lại, danh sách và key, sự kiện, form (kiểm soát, React Hook Form + Zod), effect và vòng đời (và vì sao bạn cần ít effect hơn bạn nghĩ), context và quản lý state (Zustand), lấy dữ liệu với TanStack Query, routing, hiệu năng (memo, lazy, đo bằng Profiler), khả năng tiếp cận, testing, tới dự án cuối khoá giao diện đặt lịch khám. Là nền trước khi học khoá Next.js.',
    whatYouLearn: 'Chia giao diện thành component hợp lý; quản lý state đúng chỗ; viết effect không vòng lặp vô hạn; làm form có kiểm dữ liệu; lấy và cache dữ liệu từ API; tối ưu render khi cần; viết giao diện dễ tiếp cận; test component; và gõ TypeScript cho React tự tin.',
    requirements: 'HTML, CSS, JavaScript cơ bản (khoá Web Foundations là đủ). Nên biết TypeScript cơ bản.',
    documentsNote: 'Tài liệu chính: react.dev • vite.dev • tanstack.com/query • react-hook-form.com • zustand docs • testing-library.com.',
  },
  sections: khung('rx', [
    ['Section 0 — Why React', 'Mục 0 — Vì sao React', 'React giải quyết gì và cách học.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What React is, where it came from, and why companies still hire for it', 'Bắt đầu tại đây (1/2) — React là gì, ra đời thế nào, vì sao công ty vẫn tuyển', 'UI là hàm của state · Lịch sử: Facebook 2013, Hooks 2019, React 19 · Hệ sinh thái · Câu hỏi phỏng vấn'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Frontend without structure, and learning React without burnout', 'Bắt đầu tại đây (2/2) — Frontend không cấu trúc, và học React không kiệt sức', 'Giao diện lệch dữ liệu · Tình huống đồ án · Lộ trình học'],
      ['cai-dat', 'Setting up with Vite and TypeScript', 'Cài đặt với Vite và TypeScript', 'Tạo dự án · Cấu trúc thư mục · DevTools'],
      ['jsx', 'JSX, really explained', 'JSX, giải thích cho rõ', 'JSX thành gì · Biểu thức · Điều kiện · Fragment'],
    ]],
    ['Chapter 1 — Components and props', 'Chương 1 — Component và props', 'Chia giao diện thành mảnh ghép.', [
      ['component', 'Components as functions', 'Component là hàm', 'Đặt tên · Tách file · Thuần khiết'],
      ['props', 'Props and TypeScript types', 'Props và kiểu TypeScript', 'Truyền dữ liệu xuống · children · Kiểu props'],
      ['danh-sach', 'Rendering lists and keys', 'Hiển thị danh sách và key', 'map · key ổn định · Bug khi dùng index'],
      ['chia-nho', 'Thinking in components', 'Tư duy theo component', 'Từ mock-up tới cây component'],
    ]],
    ['Chapter 2 — State and events', 'Chương 2 — State và sự kiện', 'Dữ liệu thay đổi và React render lại.', [
      ['use-state', 'useState and re-rendering', 'useState và render lại', 'Snapshot · Cập nhật theo hàm · Batching'],
      ['su-kien', 'Handling events', 'Xử lý sự kiện', 'onClick · preventDefault · Truyền handler'],
      ['object-array', 'Updating objects and arrays immutably', 'Cập nhật object và mảng bất biến', 'Spread · Immer · Bug sửa trực tiếp'],
      ['dat-state', 'Where state should live', 'State nên ở đâu', 'Nâng state lên · Nguồn sự thật duy nhất · State dẫn xuất'],
    ]],
    ['Chapter 3 — Forms', 'Chương 3 — Form', 'Form kiểm soát, kiểm dữ liệu và trải nghiệm tốt.', [
      ['controlled', 'Controlled and uncontrolled inputs', 'Input kiểm soát và không kiểm soát', 'value/onChange · useRef'],
      ['react-hook-form', 'React Hook Form + Zod', 'React Hook Form + Zod', 'Đăng ký trường · Schema dùng chung với backend'],
      ['loi', 'Errors, loading and submit states', 'Lỗi, đang gửi và trạng thái submit', 'Hiện lỗi đúng chỗ · Chặn bấm hai lần'],
      ['tieng-viet', 'Vietnamese input and IME gotchas', 'Gõ tiếng Việt và bẫy IME', 'compositionstart · Enter khi đang gõ dấu'],
    ]],
    ['Chapter 4 — Effects', 'Chương 4 — Effect', 'Đồng bộ với thế giới bên ngoài — và dùng ít effect hơn.', [
      ['use-effect', 'useEffect, dependencies and cleanup', 'useEffect, dependency và dọn dẹp', 'Khi nào chạy · Cleanup · Strict Mode chạy hai lần'],
      ['khong-can', 'You might not need an effect', 'Có thể bạn không cần effect', 'Tính trong render · Xử lý trong handler'],
      ['vong-lap', 'Infinite loops and stale closures', 'Vòng lặp vô hạn và closure cũ', 'Dependency object · useCallback đúng lúc'],
      ['custom-hook', 'Custom hooks', 'Hook tự viết', 'Tách logic dùng lại · Quy tắc hook'],
    ]],
    ['Chapter 5 — Sharing state', 'Chương 5 — Chia sẻ state', 'Context, reducer và thư viện state.', [
      ['context', 'Context without re-render storms', 'Context mà không render lại ồ ạt', 'Provider · Tách context · Khi nào đủ'],
      ['reducer', 'useReducer for complex state', 'useReducer cho state phức tạp', 'Action · Reducer thuần'],
      ['zustand', 'Zustand for app state', 'Zustand cho state toàn app', 'Store · Selector · Persist'],
      ['url-state', 'The URL as state', 'URL là state', 'Lọc/phân trang trên URL · Chia sẻ link'],
    ]],
    ['Chapter 6 — Data fetching', 'Chương 6 — Lấy dữ liệu', 'Gọi API, cache và đồng bộ với server.', [
      ['fetch', 'Fetching in effects, and why it hurts', 'Fetch trong effect, và vì sao đau đầu', 'Race condition · Huỷ request'],
      ['tanstack', 'TanStack Query', 'TanStack Query', 'useQuery · Cache · Làm mới · Trạng thái'],
      ['mutation', 'Mutations and optimistic updates', 'Mutation và cập nhật lạc quan', 'useMutation · Hoàn tác khi lỗi'],
      ['loi-api', 'Loading, error and empty states', 'Trạng thái đang tải, lỗi và rỗng', 'Skeleton · Error boundary · Thông báo'],
    ]],
    ['Chapter 7 — Routing and structure', 'Chương 7 — Định tuyến và cấu trúc', 'Nhiều trang và tổ chức dự án.', [
      ['router', 'React Router basics', 'React Router căn bản', 'Route · Link · Tham số'],
      ['layout', 'Layouts, nested routes and guards', 'Layout, route lồng nhau và chặn truy cập', 'Trang cần đăng nhập · 404'],
      ['cau-truc', 'Project structure that scales', 'Cấu trúc dự án mở rộng được', 'Theo tính năng · Thư mục chung'],
      ['sang-nextjs', 'From React to Next.js', 'Từ React sang Next.js', 'Khác gì · Khi nào cần · Trỏ khoá Next.js'],
    ]],
    ['Chapter 8 — Performance and accessibility', 'Chương 8 — Hiệu năng và khả năng tiếp cận', 'Nhanh và ai cũng dùng được.', [
      ['do', 'Measuring with the React Profiler', 'Đo bằng React Profiler', 'Tìm render thừa · Đừng tối ưu mò'],
      ['memo', 'memo, useMemo, useCallback — when they help', 'memo, useMemo, useCallback — khi nào có ích', 'Chi phí thật · React Compiler'],
      ['lazy', 'Code splitting and lazy loading', 'Chia nhỏ bundle và tải lười', 'lazy + Suspense · Ảnh'],
      ['a11y', 'Accessible components', 'Component dễ tiếp cận', 'Semantic HTML · Bàn phím · aria · Kiểm bằng axe'],
    ]],
    ['Chapter 9 — Testing React', 'Chương 9 — Test React', 'Test giao diện như người dùng dùng nó.', [
      ['testing-library', 'Testing Library basics', 'Testing Library căn bản', 'Truy vấn theo vai trò · user-event'],
      ['async', 'Testing async UI and API calls', 'Test giao diện bất đồng bộ và gọi API', 'findBy · MSW'],
      ['hook', 'Testing custom hooks', 'Test hook tự viết', 'renderHook'],
      ['phong-van', 'React interview questions', 'Câu hỏi phỏng vấn React', 'Câu hay gặp và ý trả lời · Trỏ khoá Testing'],
    ]],
    ['Chapter 10 — Capstone: the booking UI', 'Chương 10 — Dự án cuối khoá: giao diện đặt lịch', 'Giao diện đặt lịch khám hoàn chỉnh.', [
      ['thiet-ke', 'From design to component tree', 'Từ thiết kế tới cây component', 'Trang · State · Dữ liệu'],
      ['xay-dung', 'Building it', 'Dựng giao diện', 'Form đặt lịch · Lịch trống · TanStack Query'],
      ['chat-luong', 'Polish: performance, a11y, tests', 'Hoàn thiện: hiệu năng, tiếp cận, test', 'Profiler · axe · Test'],
      ['tong-ket', 'Deploy and the checklist', 'Deploy và checklist', 'Build · Deploy tĩnh · Checklist cả khoá'],
    ]],
  ]),
};
