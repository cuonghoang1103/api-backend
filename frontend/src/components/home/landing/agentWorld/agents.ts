/**
 * Dàn nhân vật của làng agent trên trang chủ (10/11/2026).
 *
 * Mọi nhân vật là thiết kế RIÊNG của CuongThai: gấu trúc CuongMini (đúng hình ở /chat) + sáu robot/sinh vật nhỏ
 * theo VAI. Không dùng linh vật, logo hay hình thương hiệu của công ty nào (Anthropic, OpenAI, Google, DeepSeek…).
 *
 * File này nhẹ, không kéo React — dùng chung cho phần SSR (danh sách "ai trực ở đâu") và phần cảnh tải lười.
 */
export type AgentKind = 'panda' | 'buddy' | 'coder' | 'tutor' | 'researcher' | 'reviewer' | 'translator' | 'builder';

type Vi<T> = { vi: T; en: T };

export interface AgentDef {
  id: AgentKind;
  name: string;
  /** Màu nhấn của nhân vật (mắt, đèn ngực) — chỉ dùng trong cảnh, không phải token trang. */
  accent: string;
  href: string;
  place: Vi<string>;
  tip: Vi<string>;
  /** Khoảng được đi lại, tính theo phần bề rộng sân khấu (0..1). */
  range: [number, number];
  /** Khoảng đi lại riêng cho màn hẹp (< 640px), nếu khác. */
  narrowRange?: [number, number];
  /** 0 = hàng trước, 1 = hàng sau (nhỏ hơn, mờ hơn chút, nằm sau). */
  lane: 0 | 1;
  /** Tốc độ đi (px/giây). */
  speed: number;
  /** Sân khấu hẹp hơn mức này thì nhân vật nghỉ (vẫn có trong danh sách bên dưới). */
  minWidth?: number;
  /** Ngồi một chỗ (không đi lại, không quay mặt). */
  seated?: boolean;
}

export const AGENTS: AgentDef[] = [
  {
    id: 'panda',
    name: 'CuongMini',
    accent: '#8b6cff',
    href: '/chat',
    place: { vi: 'AI Chat', en: 'AI Chat' },
    tip: {
      vi: 'Bí chỗ nào cứ hỏi mình — code, đề thi, cả ngữ pháp tiếng Nhật.',
      en: 'Stuck? Ask me — code, exam questions, even Japanese grammar.',
    },
    range: [0.36, 0.5],
    narrowRange: [0.27, 0.42],
    lane: 0,
    speed: 34,
  },
  {
    // Code Buddy (10/11/2026) — sinh vật pixel tròn màu mật ong, hai râu ăng-ten, ngồi gõ laptop cạnh đống lửa.
    // Thiết kế RIÊNG theo tinh thần "bạn code cùng" mà user thích; KHÔNG mô phỏng linh vật/logo của Anthropic
    // (khác dáng, khác màu, khác tỉ lệ) và không gắn tên "Claude".
    id: 'buddy',
    name: 'Code Buddy',
    accent: '#ffb547',
    href: '/ai-code',
    place: { vi: 'CuongMini Code', en: 'CuongMini Code' },
    tip: {
      vi: 'Mình ngồi code cùng bạn từng dòng — chạy test, sửa, rồi chạy lại tới khi xanh.',
      en: 'I pair with you line by line — run the tests, fix, run again until it’s green.',
    },
    range: [0.6, 0.6],
    narrowRange: [0.69, 0.69],
    lane: 0,
    speed: 0,
    seated: true,
  },
  {
    id: 'coder',
    name: 'Coder',
    accent: '#2dd4bf',
    href: '/code-lab',
    place: { vi: 'Code Lab', en: 'Code Lab' },
    tip: {
      vi: 'Viết code, bấm chạy, máy chấm trả điểm ngay. Làm một bài không?',
      en: 'Write code, hit run, and the grader scores it on the spot. One exercise?',
    },
    range: [0.05, 0.3],
    lane: 0,
    speed: 40,
  },
  {
    id: 'tutor',
    name: 'Tutor',
    accent: '#fbbf24',
    href: '/academy',
    place: { vi: 'Academy', en: 'Academy' },
    tip: {
      vi: 'Môn trên trường, giảng lại từ số 0 — có slide, video và lab.',
      en: 'University subjects re-taught from zero — slides, videos and labs.',
    },
    range: [0.22, 0.44],
    lane: 1,
    speed: 30,
  },
  {
    id: 'researcher',
    name: 'Researcher',
    accent: '#60a5fa',
    href: '/roadmap',
    place: { vi: 'RoadMap', en: 'RoadMap' },
    tip: {
      vi: 'Chưa biết học gì trước? Mình soi đường từng bước cho.',
      en: 'Not sure what to learn first? I’ll light the path, step by step.',
    },
    range: [0.55, 0.78],
    lane: 1,
    speed: 46,
    minWidth: 720,
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    accent: '#fb7185',
    href: '/exam',
    place: { vi: 'Phòng thi', en: 'Exam Room' },
    tip: {
      vi: 'Đề thật, bấm giờ thật. Nộp xong là mình chấm liền.',
      en: 'Real papers, real timer. Hand it in and I grade it straight away.',
    },
    range: [0.7, 0.86],
    lane: 0,
    speed: 32,
    minWidth: 560,
  },
  {
    id: 'translator',
    name: 'Translator',
    accent: '#34d399',
    href: '/language',
    place: { vi: 'Học ngoại ngữ', en: 'Languages' },
    tip: {
      vi: 'Anh · Nhật · Trung. Mỗi ngày vài từ, đều tay là giỏi.',
      en: 'English · Japanese · Chinese. A few words a day adds up.',
    },
    range: [0.1, 0.36],
    lane: 1,
    speed: 26,
    minWidth: 560,
  },
  {
    id: 'builder',
    name: 'Builder',
    accent: '#a78bfa',
    href: '/work',
    place: { vi: 'CT Work', en: 'CT Work' },
    tip: {
      vi: 'Dự án nhóm kiểu Jira — thẻ việc, sprint, có agent phụ một tay.',
      en: 'Jira-style team projects — cards, sprints, and an agent to help out.',
    },
    range: [0.82, 0.95],
    lane: 1,
    speed: 28,
  },
];

export const WORLD_COPY = {
  vi: {
    eyebrow: 'Làng CuongMini · ca trực đêm',
    title: 'Góc nào trên web cũng có người trực.',
    body: (n: number) =>
      `CuongMini cùng ${n} người bạn nhỏ, mỗi bạn trông một góc — luyện code, học trên trường, đi thi, học tiếng, làm dự án nhóm. Chạm vào một bạn để nghe gợi ý, hoặc đi thẳng tới chỗ bạn ấy trông.`,
    cast: 'Ai trực ở đâu',
    open: (place: string) => `Mở ${place}`,
    talk: (name: string, place: string) => `${name}, trực ở ${place} — nghe gợi ý`,
    scene: 'Cảnh làng đêm: CuongMini và các agent đi lại dưới dây đèn',
    credit: 'Làng này được dựng cùng Claude Code.',
  },
  en: {
    eyebrow: 'The CuongMini village · night shift',
    title: 'Someone’s on duty in every corner.',
    body: (n: number) =>
      `CuongMini and ${n} small friends each look after one part of the site — coding, coursework, exams, languages, team projects. Tap one for a tip, or walk straight to the corner they keep.`,
    cast: 'Who keeps what',
    open: (place: string) => `Open ${place}`,
    talk: (name: string, place: string) => `${name}, keeps ${place} — hear a tip`,
    scene: 'Night village scene: CuongMini and the agents wandering under string lights',
    credit: 'This village was built with help from Claude Code.',
  },
};
