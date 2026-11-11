export type LandingLocale = 'vi' | 'en';

export interface LandingRail {
  label: string;
  title: string;
  blurb: string;
  items: { name: string; href: string; note: string }[];
}

// Danh mục cập nhật 11/11/2026 (soát trang chủ): thêm Bảng tin, Tin nhắn, CuongMini Code; mô tả Academy/Phòng thi/AI Chat
// theo tính năng hiện có; dải 3 đổi thành "Luyện & kết nối" (MoneyFlow, Âm nhạc, Thuật toán vẫn ở menu trên cùng).
// KHÔNG ghi con số vào mô tả — số trôi theo dữ liệu, chữ thì không (luật 4 ở đầu RiveLanding.tsx).
const EN_RAILS: LandingRail[] = [
  {
    label: 'Learn',
    title: 'A clear order, from the first lesson',
    blurb: 'Full curricula instead of scattered tutorials — each one has an order, exercises and exams.',
    items: [
      { name: 'Academy', href: '/academy', note: 'University subjects on the official syllabus, a video for every lesson' },
      { name: 'Courses', href: '/courses', note: 'Long-form courses, from zero to in-depth' },
      { name: 'Code Lab', href: '/code-lab', note: 'Graded exercises across every stack' },
      { name: 'Exam Room', href: '/exam', note: 'Real past papers, timed, with an AI companion' },
      { name: 'IELTS', href: '/ielts', note: 'A 0→7.5 path with real tests' },
      { name: 'My Language', href: '/language', note: 'English · Japanese · Chinese' },
    ],
  },
  {
    label: 'Build',
    title: 'Tools that turn learning into work',
    blurb: 'A Jira-style workspace, AI that codes with you on the desktop and in your editor, a chat assistant and a CV that gets read.',
    items: [
      { name: 'CT Work', href: '/work', note: 'Jira-style projects & classrooms, AI agents, integrations' },
      { name: 'AI Code', href: '/download', note: 'Desktop app: an AI agent codes with you on your machine' },
      { name: 'CuongMini Code', href: '/ai-code', note: 'The same assistant inside VS Code, Cursor and friends' },
      { name: 'AI Chat', href: '/chat', note: 'Ask CuongMini about code, documents and images' },
      { name: 'CV Builder', href: '/cv', note: 'An IT résumé that survives the filter' },
      { name: 'Notes', href: '/notes', note: 'Write, organise and share' },
    ],
  },
  {
    label: 'Practise & connect',
    title: 'Stop reading. Put it under pressure.',
    blurb: 'Rehearse in realistic conditions, keep up with what is new, and talk it through with other people.',
    items: [
      { name: 'Interview', href: '/interview', note: 'Mock interviews, graded out loud' },
      { name: 'Feed', href: '/feed', note: 'Tech news and a daily lesson written by AI' },
      { name: 'Blog', href: '/tech-trends', note: 'Production incidents and deep technical guides' },
      { name: 'Forum', href: '/forum', note: 'Ask, argue and help' },
      { name: 'Messenger', href: '/messages', note: 'Chat with friends, pop-up chats on every page' },
      { name: 'Games', href: '/games', note: 'Short games, real leaderboards' },
    ],
  },
];

const VI_RAILS: LandingRail[] = [
  {
    label: 'Học',
    title: 'Có thứ tự rõ ràng ngay từ bài đầu',
    blurb: 'Lộ trình hoàn chỉnh thay cho những hướng dẫn rời rạc — có trình tự, bài tập và đề thi đi cùng.',
    items: [
      { name: 'Academy', href: '/academy', note: 'Môn trường theo khung FLM, video cho từng bài' },
      { name: 'Khóa học', href: '/courses', note: 'Khoá dài, từ số 0 tới chuyên sâu' },
      { name: 'Code Lab', href: '/code-lab', note: 'Bài tập lập trình có chấm điểm' },
      { name: 'Phòng thi', href: '/exam', note: 'Đề thật có bấm giờ, có AI đồng hành' },
      { name: 'IELTS', href: '/ielts', note: 'Lộ trình 0→7.5 có bài kiểm tra' },
      { name: 'Ngoại ngữ', href: '/language', note: 'Tiếng Anh · Nhật · Trung' },
    ],
  },
  {
    label: 'Làm',
    title: 'Công cụ biến kiến thức thành việc thật',
    blurb: 'Không gian làm việc kiểu Jira, AI lập trình cùng bạn trên desktop lẫn trong trình soạn mã, trợ lý chat và CV — những thứ biến việc học thành sản phẩm.',
    items: [
      { name: 'CT Work', href: '/work', note: 'Quản lý dự án & lớp học kiểu Jira, AI agent, tích hợp' },
      { name: 'AI Code', href: '/download', note: 'App desktop: AI agent lập trình cùng bạn trên máy bạn' },
      { name: 'CuongMini Code', href: '/ai-code', note: 'Trợ lý đó ngay trong VS Code, Cursor…' },
      { name: 'AI Chat', href: '/chat', note: 'Hỏi CuongMini về code, tài liệu và ảnh' },
      { name: 'CV Builder', href: '/cv', note: 'CV IT vượt qua vòng lọc' },
      { name: 'Ghi chú', href: '/notes', note: 'Viết, sắp xếp và chia sẻ' },
    ],
  },
  {
    label: 'Luyện & kết nối',
    title: 'Ngừng đọc. Đem kiến thức ra thử.',
    blurb: 'Luyện trong điều kiện gần với thực tế, theo kịp cái mới, và bàn với người khác.',
    items: [
      { name: 'Phỏng vấn', href: '/interview', note: 'Phỏng vấn thử, chấm trực tiếp' },
      { name: 'Bảng tin', href: '/feed', note: 'Tin công nghệ + bài "Học mỗi ngày" do AI soạn' },
      { name: 'Blog', href: '/tech-trends', note: 'Sự cố production và hướng dẫn kỹ thuật sâu' },
      { name: 'Diễn đàn', href: '/forum', note: 'Hỏi, tranh luận và giúp nhau' },
      { name: 'Tin nhắn', href: '/messages', note: 'Nhắn bạn bè, khung chat nổi ở mọi trang' },
      { name: 'Trò chơi', href: '/games', note: 'Game ngắn, bảng xếp hạng thật' },
    ],
  },
];

const VI_DEEP_DIVES: Record<string, { title: string; blurb: string; via?: string }> = {
  'How to Use the Command Line in Linux and macOS': {
    title: 'Dùng dòng lệnh trên Linux và macOS',
    blurb: 'Di chuyển, sửa tệp và nối lệnh với nhau — bắt đầu từ con số 0.',
  },
  'The Event Loop, Callbacks, Promises and Async/Await': {
    title: 'Event loop, callback, Promise và async/await',
    blurb: 'Vì sao JavaScript không chặn luồng, và await của bạn thật sự đi đâu.',
  },
  'Node.js From Zero to Production': {
    title: 'Node.js từ số 0 đến production',
    blurb: '19 chương về runtime, HTTP, PostgreSQL, xác thực, hàng đợi và quan sát hệ thống.',
    via: 'Khóa đầy đủ · 112 bài',
  },
  'An Introduction to GraphQL': {
    title: 'Nhập môn GraphQL',
    blurb: 'Schema, resolver và lý do GraphQL không phải thứ thay thế REST.',
  },
  'How to Structure and Organize a React Application': {
    title: 'Cấu trúc một ứng dụng React để còn sửa được lâu dài',
    blurb: 'Thư mục, ranh giới state và những đường nối sống sót qua một lần viết lại.',
  },
  'A Complete Guide to CSS Concepts and Fundamentals': {
    title: 'CSS từ nền tảng đến khi dùng đúng',
    blurb: 'Box model, cascade, specificity, flex và grid — giải thích đến nơi.',
  },
  'How to Use Redux and React': {
    title: 'Dùng Redux với React',
    blurb: 'Store, action, reducer — và lúc nào bạn thật sự cần chúng.',
  },
  'How to Use Vue, the JavaScript Framework': {
    title: 'Học Vue qua mô hình component của chính nó',
    blurb: 'Reactivity, component và cách một single-file component hoạt động.',
  },
  'How to Set Up webpack From Scratch': {
    title: 'Tự cấu hình webpack từ đầu',
    blurb: 'Entry, output, loader và plugin — để bundler không còn là hộp đen.',
  },
  'Shell Scripting for People Who Deploy Things': {
    title: 'Shell script cho người triển khai production',
    blurb: 'set -euo pipefail, trap và lý do script thường nuốt mất lỗi của chính nó.',
  },
  'How to Set up a Mac for Development': {
    title: 'Thiết lập máy Mac cho lập trình',
    blurb: 'Shell, Homebrew, Node, Docker và khóa SSH — một máy sẵn sàng làm việc.',
  },
  'Reading Production: Logs, Metrics and a Calm Head': {
    title: 'Đọc production: log, metric và một cái đầu lạnh',
    blurb: 'Nên nhìn đâu trước khi thứ bạn vừa triển khai bắt đầu bốc cháy.',
  },
  'Building a Jira-style Project Tool (CT Work)': {
    title: 'Dựng một công cụ quản lý dự án kiểu Jira (CT Work)',
    blurb: 'CT Work được dựng thế nào: mã thật, lỗi đã sửa, dòng thời gian — và cách dùng cho hiệu quả.',
    via: 'Bài đọc · tải app ở cuối bài',
  },
  'AI Code on the Desktop: An Agent That Codes With You': {
    title: 'AI Code trên app desktop: agent lập trình cùng bạn',
    blurb: 'Bên trong agent lập trình của app desktop: vòng lặp gọi công cụ, an toàn, chọn model theo chi phí đo thật, lỗi đã sửa.',
    via: 'Bài đọc · tải app ở cuối bài',
  },
};

export const LANDING_COPY = {
  en: {
    header: {
      identity: 'CuongHoang',
      welcome: 'Welcome to CuongThai',
      homeLabel: 'Welcome to CuongThai — home',
      languageLabel: 'Switch to Vietnamese',
      lightLabel: 'Use light theme',
      darkLabel: 'Use dark theme',
      guestCta: 'Sign in',
      memberCta: 'Continue',
    },
    hero: {
      title: 'Learn it.',
      mark: 'Build with it.',
      body: 'University subjects with a video for every lesson, graded exercises, real past papers, an AI tutor and the tools that go with them — for software, languages and career work. Read for free; practise with real feedback.',
      primary: 'Choose a path',
      secondary: 'Try an exercise',
      proofLabel: 'Real 3D playground',
      proofTitle: 'Drive into CuongThai',
      proofBody: 'This is a static preview. The 3D engine and its assets only load after you choose to enter.',
      proofCta: 'Explore in 3D',
    },
    deepDives: {
      title: 'Long reads worth finishing',
      body: 'One topic at a time, explained far enough that you can leave with something working.',
      read: 'Read guide',
      open: 'Open resource',
      items: {} as Record<string, { title: string; blurb: string; via?: string }>,
    },
    directory: {
      count: (count: number) => `${count} ways in`,
      open: 'Open',
    },
    assistant: {
      label: 'Ask CuongMini',
    },
    footer: {
      statement: 'Learning should end in doing.',
      credit: 'Built and written by CuongHoang.',
      about: 'About',
      writing: 'Writing',
      account: 'Create an account',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    playgroundGate: {
      eyebrow: 'Before you enter',
      title: 'This one runs on your graphics card',
      introBefore: 'The playground is a real-time 3D world. It renders entirely on ',
      introStrong: 'your device’s GPU',
      introAfter: ' — nothing is streamed from a server, so performance depends on the machine you are using.',
      facts: [
        ['~35 MB to download', 'The first visit takes a moment on a slow connection. It is cached afterwards.'],
        ['Needs a recent browser', 'Chrome, Edge or Safari from the last couple of years. WebGPU with a WebGL fallback.'],
        ['Not built for weak hardware', 'Older laptops, low-end phones and integrated graphics may stutter.'],
      ] as [string, string][],
      outro: 'Everything else on the site works without it. Drive around, break a wall for a vocabulary question, or use a gate to jump into CuongThai.',
      stay: 'Stay here',
      enter: 'Enter the playground',
      close: 'Close',
    },
  },
  vi: {
    header: {
      identity: 'CuongHoang',
      welcome: 'Welcome to CuongThai',
      homeLabel: 'Welcome to CuongThai — trang chủ',
      languageLabel: 'Chuyển sang tiếng Anh',
      lightLabel: 'Dùng giao diện sáng',
      darkLabel: 'Dùng giao diện tối',
      guestCta: 'Đăng nhập',
      memberCta: 'Tiếp tục',
    },
    hero: {
      title: 'Học cho hiểu.',
      mark: 'Làm cho được.',
      body: 'Môn trường có video từng bài, bài tập chấm điểm, đề thi thật, trợ lý AI CuongMini và công cụ thực hành — cho lập trình, ngoại ngữ và sự nghiệp. Đọc miễn phí; luyện bằng phản hồi thật.',
      primary: 'Chọn lộ trình',
      secondary: 'Làm thử một bài',
      proofLabel: 'Sân chơi 3D thật',
      proofTitle: 'Lái xe vào CuongThai',
      proofBody: 'Đây chỉ là ảnh xem trước. Engine 3D và tài nguyên chỉ tải sau khi bạn chủ động bước vào.',
      proofCta: 'Khám phá 3D',
    },
    deepDives: {
      title: 'Bài dài, đọc cho đáng',
      body: 'Mỗi bài đi hết một chủ đề — đủ sâu để đọc xong là có thứ chạy được trong tay.',
      read: 'Đọc hướng dẫn',
      open: 'Mở nội dung',
      items: VI_DEEP_DIVES,
    },
    directory: {
      count: (count: number) => `${count} lối vào`,
      open: 'Mở',
    },
    assistant: {
      label: 'Hỏi CuongMini',
    },
    footer: {
      statement: 'Học phải đi đến chỗ làm được.',
      credit: 'Được xây dựng và viết bởi CuongHoang.',
      about: 'Giới thiệu',
      writing: 'Bài viết',
      account: 'Tạo tài khoản',
      privacy: 'Bảo mật',
      terms: 'Điều khoản',
    },
    playgroundGate: {
      eyebrow: 'Trước khi bước vào',
      title: 'Sân chơi này chạy bằng card đồ họa của bạn',
      introBefore: 'Đây là một thế giới 3D thời gian thực, được dựng hoàn toàn bằng ',
      introStrong: 'GPU trên thiết bị của bạn',
      introAfter: ' — không stream từ máy chủ, nên độ mượt phụ thuộc vào chiếc máy bạn đang dùng.',
      facts: [
        ['Tải khoảng 35 MB', 'Lần đầu sẽ chờ một chút nếu mạng chậm; những lần sau trình duyệt dùng lại bộ nhớ đệm.'],
        ['Cần trình duyệt tương đối mới', 'Chrome, Edge hoặc Safari trong vài năm gần đây; WebGPU có WebGL dự phòng.'],
        ['Không dành cho máy yếu', 'Laptop cũ, điện thoại giá rẻ và GPU tích hợp có thể bị giật.'],
      ] as [string, string][],
      outro: 'Mọi phần khác của web vẫn chạy bình thường nếu bạn bỏ qua. Bạn có thể lái xe, phá tường để nhận câu hỏi từ vựng hoặc đi qua cổng để vào từng khu vực.',
      stay: 'Ở lại trang này',
      enter: 'Bước vào sân chơi',
      close: 'Đóng',
    },
  },
  rails: { en: EN_RAILS, vi: VI_RAILS },
};

export function getLandingCopy(locale: string) {
  return locale === 'vi' ? LANDING_COPY.vi : LANDING_COPY.en;
}

export function getLandingRails(locale: string) {
  return locale === 'vi' ? LANDING_COPY.rails.vi : LANDING_COPY.rails.en;
}
