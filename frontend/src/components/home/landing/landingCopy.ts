export type LandingLocale = 'vi' | 'en';

export interface LandingRail {
  label: string;
  title: string;
  blurb: string;
  items: { name: string; href: string; note: string }[];
}

const EN_RAILS: LandingRail[] = [
  {
    label: 'Learn',
    title: 'A clear order, from the first lesson',
    blurb: 'Full curricula instead of scattered tutorials — each one has an order, exercises and exams.',
    items: [
      { name: 'Code Lab', href: '/code-lab', note: 'Graded exercises across every stack' },
      { name: 'Academy', href: '/academy', note: 'University subjects, worked end to end' },
      { name: 'Courses', href: '/courses', note: 'Long-form courses, chapter by chapter' },
      { name: 'IELTS', href: '/ielts', note: 'A 0→7.5 path with real tests' },
      { name: 'My Language', href: '/language', note: 'English · Japanese · Chinese' },
      { name: 'Exam Room', href: '/exam', note: 'Sit the real paper, timed' },
    ],
  },
  {
    label: 'Build',
    title: 'Tools that turn learning into work',
    blurb: 'A Jira-style workspace, a desktop AI coding app, notes, diagrams and a CV that gets read — the things that turn study into output.',
    items: [
      { name: 'CT Work', href: '/work', note: 'Jira-style projects & classrooms, AI agents, integrations' },
      { name: 'AI Code', href: '/download', note: 'Desktop app: an AI agent codes with you, runs offline' },
      { name: 'CV Builder', href: '/cv', note: 'An IT résumé that survives the filter' },
      { name: 'Notes', href: '/notes', note: 'Write, organise and share' },
      { name: 'AI Chat', href: '/chat', note: 'Ask about code, documents and ideas' },
      { name: 'Algorithms', href: '/algorithms', note: 'See the code while it executes' },
    ],
  },
  {
    label: 'Practise & play',
    title: 'Stop reading. Put it under pressure.',
    blurb: 'Rehearse in realistic conditions, then take a break somewhere that has nothing to do with work.',
    items: [
      { name: 'Interview', href: '/interview', note: 'Mock interviews, graded out loud' },
      { name: 'Blog', href: '/tech-trends', note: 'Production incidents and deep technical guides' },
      { name: 'Forum', href: '/forum', note: 'Ask, argue and help' },
      { name: 'Games', href: '/games', note: 'Short games, real leaderboards' },
      { name: 'Music', href: '/music', note: 'Listen together' },
      { name: 'MoneyFlow', href: '/finance', note: 'Track spending and budgets' },
    ],
  },
];

const VI_RAILS: LandingRail[] = [
  {
    label: 'Học',
    title: 'Có thứ tự rõ ràng ngay từ bài đầu',
    blurb: 'Lộ trình hoàn chỉnh thay cho những hướng dẫn rời rạc — có trình tự, bài tập và đề thi đi cùng.',
    items: [
      { name: 'Code Lab', href: '/code-lab', note: 'Bài tập lập trình có chấm điểm' },
      { name: 'Academy', href: '/academy', note: 'Môn đại học, học từ đầu đến cuối' },
      { name: 'Khóa học', href: '/courses', note: 'Bài dài, chia theo từng chương' },
      { name: 'IELTS', href: '/ielts', note: 'Lộ trình 0→7.5 có bài kiểm tra' },
      { name: 'Ngoại ngữ', href: '/language', note: 'Tiếng Anh · Nhật · Trung' },
      { name: 'Phòng thi', href: '/exam', note: 'Làm đề thật, có bấm giờ' },
    ],
  },
  {
    label: 'Làm',
    title: 'Công cụ biến kiến thức thành việc thật',
    blurb: 'Không gian làm việc kiểu Jira, app lập trình AI trên desktop, ghi chú, sơ đồ và CV — những thứ biến việc học thành sản phẩm.',
    items: [
      { name: 'CT Work', href: '/work', note: 'Quản lý dự án & lớp học kiểu Jira, AI agent, tích hợp' },
      { name: 'AI Code', href: '/download', note: 'App desktop: AI agent lập trình cùng bạn, chạy offline' },
      { name: 'CV Builder', href: '/cv', note: 'CV IT vượt qua vòng lọc' },
      { name: 'Ghi chú', href: '/notes', note: 'Viết, sắp xếp và chia sẻ' },
      { name: 'AI Chat', href: '/chat', note: 'Hỏi về code, tài liệu và ý tưởng' },
      { name: 'Thuật toán', href: '/algorithms', note: 'Nhìn mã chạy thay vì chỉ đọc' },
    ],
  },
  {
    label: 'Luyện & chơi',
    title: 'Ngừng đọc. Đem kiến thức ra thử.',
    blurb: 'Luyện trong điều kiện gần với thực tế, rồi nghỉ ở một nơi chẳng liên quan gì tới công việc.',
    items: [
      { name: 'Phỏng vấn', href: '/interview', note: 'Phỏng vấn thử, chấm trực tiếp' },
      { name: 'Blog', href: '/tech-trends', note: 'Sự cố production và hướng dẫn kỹ thuật sâu' },
      { name: 'Diễn đàn', href: '/forum', note: 'Hỏi, tranh luận và giúp nhau' },
      { name: 'Trò chơi', href: '/games', note: 'Game ngắn, bảng xếp hạng thật' },
      { name: 'Âm nhạc', href: '/music', note: 'Nghe cùng nhau' },
      { name: 'MoneyFlow', href: '/finance', note: 'Quản lý chi tiêu, ngân sách' },
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
    blurb: 'Modular monolith: board, sprint và issue, AI agent qua MCP, tích hợp lịch · Notion · Slack.',
    via: 'Sản phẩm · mở CT Work',
  },
  'AI Code on the Desktop: An Agent That Codes With You': {
    title: 'AI Code trên app desktop: agent lập trình cùng bạn',
    blurb: 'Agent Claude qua cổng riêng, chạy trong app Electron — trả lời chảy dần, nhiều model để chọn.',
    via: 'App desktop · tải về',
  },
};

export const LANDING_COPY = {
  en: {
    header: {
      identity: 'CuongHoang',
      welcome: 'Wellcome to CuongThai',
      homeLabel: 'Wellcome to CuongThai — home',
      languageLabel: 'Switch to Vietnamese',
      lightLabel: 'Use light theme',
      darkLabel: 'Use dark theme',
      guestCta: 'Sign in',
      memberCta: 'Continue',
    },
    hero: {
      title: 'Learn it.',
      mark: 'Build with it.',
      body: 'Curricula, graded exercises, past exam papers and practical tools for software, languages and career work. Read for free; practise with real feedback.',
      primary: 'Choose a path',
      secondary: 'Try an exercise',
      proofLabel: 'Real 3D playground',
      proofTitle: 'Drive into CuongThai',
      proofBody: 'This is a static preview. The 3D engine and its assets only load after you choose to enter.',
      proofCta: 'Explore in 3D',
    },
    stats: {
      exercises: 'graded exercises',
      examQuestions: 'exam questions',
      subjects: 'subjects & courses',
      roadmapNodes: 'roadmap steps',
      vocabWords: 'vocabulary entries',
      hanziChars: 'hanzi & kanji taught',
      // Ghi rõ số ở trên đến TỪ ĐÂU. Đây là điểm khác biệt thật của site so
      // với những trang gõ cứng "8k+ câu hỏi": đếm được thì mới hiện.
      countedAt: (when: string) => `Counted straight from the database · ${when}`,
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
      welcome: 'Wellcome to CuongThai',
      homeLabel: 'Wellcome to CuongThai — trang chủ',
      languageLabel: 'Chuyển sang tiếng Anh',
      lightLabel: 'Dùng giao diện sáng',
      darkLabel: 'Dùng giao diện tối',
      guestCta: 'Đăng nhập',
      memberCta: 'Tiếp tục',
    },
    hero: {
      title: 'Học cho hiểu.',
      mark: 'Làm cho được.',
      body: 'Lộ trình, bài tập chấm điểm, đề thi và công cụ thực hành cho lập trình, ngoại ngữ và sự nghiệp. Đọc miễn phí; luyện bằng phản hồi thật.',
      primary: 'Chọn lộ trình',
      secondary: 'Làm thử một bài',
      proofLabel: 'Sân chơi 3D thật',
      proofTitle: 'Lái xe vào CuongThai',
      proofBody: 'Đây chỉ là ảnh xem trước. Engine 3D và tài nguyên chỉ tải sau khi bạn chủ động bước vào.',
      proofCta: 'Khám phá 3D',
    },
    stats: {
      exercises: 'bài tập có chấm điểm',
      examQuestions: 'câu hỏi luyện thi',
      subjects: 'môn học & lộ trình',
      roadmapNodes: 'bước trong lộ trình',
      vocabWords: 'từ vựng ngoại ngữ',
      hanziChars: 'chữ Hán & Kanji',
      countedAt: (when: string) => `Đếm thẳng từ cơ sở dữ liệu · ${when}`,
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
