/**
 * Nội dung tĩnh của /about/studio — tách khỏi StudioClient để file giao diện
 * chỉ lo bố cục. Toàn bộ chữ GIỮ NGUYÊN từ bản trước (01/10/2026).
 *
 * ⛔ Luật số liệu (xem đầu `app/about/page.tsx`): không số bịa, không khách,
 * không lời khen. Sơ đồ của từng sản phẩm (`chart`) chỉ dựng lại những gì
 * phần mô tả `what` đã nói — không thêm tính năng, không thêm con số.
 */
export type Bi = readonly [string, string];

/** Một nút trong sơ đồ sản phẩm. `note` là chú thích nhỏ dưới tên. */
export interface ChartNode {
  label: Bi;
  note?: Bi;
}

/**
 * Sơ đồ chữ thuần CSS thay cho ảnh chụp màn hình (repo không có ảnh chụp thật
 * của sản phẩm, và vẽ lại khung trình duyệt là cấm — slop gate 47).
 *  - `fan`  : nhiều nguồn đổ về một trục (vd 3 ứng dụng → một API)
 *  - `chain`: chuỗi bước nối tiếp
 */
export interface ProductChart {
  kind: 'fan' | 'chain';
  from: ChartNode[];
  to?: ChartNode[];
  caption: Bi;
}

export interface Product {
  id: string;
  name: string;
  kind: Bi;
  what: Bi;
  stack: string[];
  status: Bi;
  href?: string;
  linkLabel?: Bi;
  chart: ProductChart;
}

/** Sản phẩm THẬT, mô tả theo README / package.json của repo. */
export const PRODUCTS: Product[] = [
  {
    id: 'site',
    name: 'cuongthai.com',
    kind: ['Nền tảng học tập song ngữ', 'Bilingual learning platform'],
    what: [
      'Khoá học, gia sư AI đọc phụ đề bài giảng và trích dẫn mốc thời gian, phòng thi, code lab, kèm ứng dụng desktop và iOS dùng chung một API.',
      'Courses, an AI tutor that reads lecture transcripts and cites timestamps, an exam room and a code lab, with desktop and iOS apps on the same API.',
    ],
    stack: ['Next.js', 'Express', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker', 'nginx', 'Cloudflare R2'],
    status: ['Đang chạy production trên VPS tự quản trị', 'In production on a self-administered VPS'],
    href: '/',
    linkLabel: ['Mở trang chủ', 'Open the site'],
    chart: {
      kind: 'fan',
      from: [
        { label: ['Web', 'Web'], note: ['Next.js', 'Next.js'] },
        { label: ['Desktop', 'Desktop'], note: ['Electron', 'Electron'] },
        { label: ['iOS', 'iOS'], note: ['SwiftUI', 'SwiftUI'] },
      ],
      to: [{ label: ['Một API', 'One API'], note: ['Express → PostgreSQL · R2', 'Express → PostgreSQL · R2'] }],
      caption: ['Ba ứng dụng, một API, một cơ sở dữ liệu.', 'Three apps, one API, one database.'],
    },
  },
  {
    id: 'ctwork',
    name: 'CT Work',
    kind: ['Quản lý dự án kiểu Jira', 'Jira-style project management'],
    what: [
      'Board, backlog, sprint, báo cáo burndown/velocity, quản lý kiểm thử và trợ lý AI. Đây là công cụ chạy dự án khách hàng theo quy trình ở bước 3 — khách theo dõi tiến độ qua link chia sẻ.',
      'Boards, backlog, sprints, burndown/velocity reports, test management and an AI assistant. It runs client projects through the process in step 3 — clients follow progress via a share link.',
    ],
    stack: ['Next.js', 'Express', 'PostgreSQL', 'WebSocket'],
    status: ['Đang dùng hằng ngày', 'In daily use'],
    href: '/work',
    linkLabel: ['Mở CT Work', 'Open CT Work'],
    chart: {
      kind: 'chain',
      from: [
        { label: ['Backlog', 'Backlog'] },
        { label: ['Sprint', 'Sprint'], note: ['Board', 'Board'] },
        { label: ['Kiểm thử', 'Testing'] },
        { label: ['Báo cáo', 'Reports'], note: ['Burndown · velocity', 'Burndown · velocity'] },
      ],
      to: [{ label: ['Link chia sẻ', 'Share link'], note: ['Khách theo dõi tiến độ', 'Clients follow progress'] }],
      caption: ['Đường đi của một việc, từ backlog tới tay khách.', 'How a task travels, from backlog to the client.'],
    },
  },
  {
    id: 'desktop',
    name: 'CuongThai Desktop',
    kind: ['Ứng dụng máy tính', 'Desktop app'],
    what: [
      'Ứng dụng Electron cho macOS, Windows và Linux, tự cập nhật qua GitHub Releases; có công cụ lập trình AI làm việc trên thư mục dự án của người dùng.',
      'An Electron app for macOS, Windows and Linux with auto-update via GitHub Releases, including an AI coding tool that works on the user’s project folder.',
    ],
    stack: ['Electron', 'React', 'TypeScript'],
    status: ['Phát hành công khai, tự cập nhật', 'Publicly released, auto-updating'],
    href: '/download',
    linkLabel: ['Trang tải về', 'Download page'],
    chart: {
      kind: 'fan',
      from: [
        { label: ['macOS', 'macOS'] },
        { label: ['Windows', 'Windows'] },
        { label: ['Linux', 'Linux'] },
      ],
      to: [{ label: ['GitHub Releases', 'GitHub Releases'], note: ['Tự cập nhật', 'Auto-update'] }],
      caption: ['Một mã nguồn, ba hệ điều hành, một kênh cập nhật.', 'One codebase, three operating systems, one update channel.'],
    },
  },
  {
    id: 'ios',
    name: 'CuongThai iOS',
    kind: ['Ứng dụng iPhone & iPad', 'iPhone & iPad app'],
    what: [
      'Ứng dụng SwiftUI đồng bộ với cuongthai.com: học theo ngành, vở viết tay trên iPad, thư viện sách.',
      'A SwiftUI app synced with cuongthai.com: study by major, handwritten notebooks on iPad, a book library.',
    ],
    stack: ['SwiftUI', 'Swift'],
    status: ['Phát hành thử nghiệm qua TestFlight', 'Shipped to TestFlight'],
    chart: {
      kind: 'fan',
      from: [
        { label: ['Học theo ngành', 'Study by major'] },
        { label: ['Vở viết tay', 'Handwritten notebooks'], note: ['iPad', 'iPad'] },
        { label: ['Thư viện sách', 'Book library'] },
      ],
      to: [{ label: ['cuongthai.com', 'cuongthai.com'], note: ['Đồng bộ', 'Synced'] }],
      caption: ['Ba phần của ứng dụng, đồng bộ về cùng một tài khoản web.', 'Three parts of the app, synced to the same web account.'],
    },
  },
  {
    id: 'labflow',
    name: 'LabFlow AI',
    kind: ['Đồ án tốt nghiệp', 'Graduation project'],
    what: [
      'Hệ thống đặt phòng lab và mượn thiết bị (đồ án SWP391 → SEP490, Đại học FPT). Được lên kế hoạch và quản lý theo đúng quy trình trên trang này: yêu cầu, cổng chất lượng, hồ sơ bảo vệ — tất cả nằm trên CT Work.',
      'A lab and equipment booking system (SWP391 → SEP490 capstone, FPT University), planned and run with the very process on this site: requirements, quality gates, defence documents — all on CT Work.',
    ],
    stack: ['Java 21', 'Spring Boot 3', 'React', 'PostgreSQL', 'ESP32'],
    status: ['Kế hoạch 20 tuần, bắt đầu 05/10/2026', '20-week plan starting 5 Oct 2026'],
    href: '/projects/labflow-ai',
    linkLabel: ['Xem hồ sơ dự án', 'Read the project file'],
    chart: {
      kind: 'chain',
      from: [
        { label: ['Yêu cầu', 'Requirements'] },
        { label: ['Cổng chất lượng', 'Quality gates'] },
        { label: ['Hồ sơ bảo vệ', 'Defence documents'] },
      ],
      to: [{ label: ['CT Work', 'CT Work'], note: ['SWP391 → SEP490', 'SWP391 → SEP490'] }],
      caption: ['Chạy bằng chính quy trình ở bước 3.', 'Run with the very process in step 3.'],
    },
  },
];

export const CAPABILITIES: { area: Bi; items: string[]; note: Bi }[] = [
  {
    area: ['Web & giao diện', 'Web & front end'],
    items: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'framer-motion'],
    note: ['Responsive từ 360px, sáng/tối, song ngữ.', 'Responsive from 360px, light/dark, bilingual.'],
  },
  {
    area: ['Backend & dữ liệu', 'Back end & data'],
    items: ['Node.js · Express', 'PostgreSQL', 'Prisma', 'pgvector', 'Redis', 'WebSocket'],
    note: ['Migration viết tay, có kiểm lệch schema trước khi triển khai.', 'Hand-written migrations, schema drift checked before deploy.'],
  },
  {
    area: ['Ứng dụng', 'Apps'],
    items: ['SwiftUI (iOS, iPadOS)', 'Electron (macOS, Windows, Linux)'],
    note: ['Một API chung cho web, desktop và di động.', 'One API shared by web, desktop and mobile.'],
  },
  {
    area: ['Hạ tầng & vận hành', 'Infrastructure & operations'],
    items: ['Docker', 'GHCR', 'nginx', 'Cloudflare', 'Linux VPS', 'GitHub Actions'],
    note: ['Build ở máy riêng, máy chủ chỉ kéo ảnh và tráo; có smoke-test sau mỗi lần triển khai.', 'Images built off-server; the server only pulls and swaps, with a smoke test after every deploy.'],
  },
  {
    area: ['AI & LLM', 'AI & LLM'],
    items: ['Cổng LLM nhiều nhà cung cấp', 'Định tuyến model theo việc', 'RAG', 'Trần chi phí theo ngày'],
    note: ['Chọn model bằng đo thật (giá, độ trễ, đúng/sai), không theo bảng giá niêm yết.', 'Models chosen by measurement (cost, latency, accuracy), not list prices.'],
  },
];

export const PRINCIPLES: { title: Bi; body: Bi }[] = [
  {
    title: ['Tiến độ nhìn thấy được', 'Progress you can see'],
    body: [
      'Mỗi dự án có một board chung trên CT Work và báo cáo hằng tuần: đã xong gì, tuần tới làm gì, rủi ro nào, cần bạn quyết gì.',
      'Every project has a shared CT Work board and a weekly report: what’s done, what’s next, which risks, which decisions we need from you.',
    ],
  },
  {
    title: ['Có tài liệu ở mọi bước', 'Documents at every step'],
    body: [
      'Mỗi giai đoạn kết thúc bằng tài liệu bàn giao và một cổng chất lượng có điều kiện rõ ràng — không sang bước sau bằng cảm giác.',
      'Each stage ends with a deliverable and a quality gate with explicit criteria — no moving on by feel.',
    ],
  },
  {
    title: ['Bàn giao trọn vẹn', 'A complete handover'],
    body: [
      'Mã nguồn, quyền truy cập, tài liệu vận hành và hướng dẫn sử dụng thuộc về bạn. Không giữ lại thứ gì để bạn phụ thuộc.',
      'Source code, access rights, runbooks and user guides are yours. Nothing is held back to keep you dependent.',
    ],
  },
  {
    title: ['Ghi lại sự cố thật', 'Real incidents, written down'],
    body: [
      'Nhật ký vận hành của cuongthai.com ghi từng sự cố production — nguyên nhân thật và chốt kiểm đã thêm để nó không lặp lại. Dự án của bạn được vận hành theo cùng thói quen đó.',
      'The cuongthai.com operations log records every production incident — the real cause and the check added so it can’t recur. Your project is run with the same habit.',
    ],
  },
];

export const SIZE_NOTES: Bi[] = [
  [
    'Studio là một kỹ sư chính. Dự án cần nhiều vai cùng lúc (thiết kế UX chuyên sâu, kiểm thử bảo mật độc lập…) sẽ có cộng sự riêng cho từng vai, nêu tên và phạm vi trong đề xuất.',
    'The studio is one lead engineer. Projects that need several roles at once (dedicated UX, independent security testing…) bring in specialists per role, named and scoped in the proposal.',
  ],
  [
    'Nếu yêu cầu vượt năng lực hoặc thời hạn không khả thi, bạn sẽ nhận câu trả lời “không” kèm lý do ngay ở bước đánh giá — trước khi có bất kỳ cam kết nào.',
    'If a request is beyond what we can deliver or the deadline isn’t feasible, you get a “no” with reasons at the assessment step — before any commitment.',
  ],
  [
    'Không có danh sách khách hàng hay lời giới thiệu trên trang này. Thứ để bạn đánh giá là sản phẩm đang chạy, mã nguồn công khai và quy trình được viết ra đầy đủ.',
    'There is no client list or testimonial here. What you can judge is the running product, the public code and a fully written-out process.',
  ],
];
