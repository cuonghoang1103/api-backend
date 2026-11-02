/**
 * The site-wide menu tree — ONE source for the desktop mega-menu, the mobile
 * sheet and the ⌘K palette (02/11/2026, replaces the ☰ NavigationDock).
 *
 * Every destination the old dock and the old icon bar reached lives here or in
 * `ACCOUNT_LINKS` (the avatar menu). Removing an entry removes the only way to
 * reach that page from the chrome — check the page has another entry point first.
 *
 * ⚠️ This module pulls in ~50 lucide icons and every description in two
 * languages. It is imported ONLY by lazily loaded chunks (MegaPanel, MobileSheet,
 * CommandPalette, the About page). The always-on bar (`SiteNav.tsx`) must keep
 * importing `navLabels.ts` instead, or every page pays for the whole tree.
 *
 * ⚠️ `desktop/src/renderer/routes.test.ts` reads THIS file with the regex
 * `{ href: '…'` and asserts the only /academy entry is `/academy` itself (the
 * Academy's sub-pages are steps inside it, never siblings in a menu). Keep the
 * `{ href: '…'` literal shape, and do not add /academy/* entries.
 */
import type { LucideIcon } from 'lucide-react';
import {
  GraduationCap, BookMarked, Target, Map as MapIcon, PlayCircle, ClipboardCheck,
  Library, Award, Code2, Binary, Waypoints, CircuitBoard, Briefcase, FileText,
  Languages, Sparkles, AudioLines, Blocks, Puzzle, Terminal, KeyRound, Gauge,
  KanbanSquare, NotebookPen, Wallet, Music, Gamepad2, Wifi, Crown, ShoppingBag,
  Newspaper, BookOpen, Megaphone, Users, MessagesSquare, FolderOpen, Github,
  FileCode2, Bookmark, User, Store, Send, Workflow, ShieldCheck, MonitorDown,
  LayoutDashboard, Settings, Receipt, Ticket, Shield,
} from 'lucide-react';
import type { MenuId } from './navLabels';
import { CART_ENABLED, SHOP_ENABLED, INTERVIEW_ENABLED, CV_BUILDER_ENABLED } from '@/lib/featureFlags';

export type Bi = { en: string; vi: string };

/** Who may see an entry. Evaluated by `isVisible` with the viewer's state. */
export type Gate = 'auth' | 'admin' | 'music' | 'shop' | 'cart' | 'interview' | 'cv';

export interface NavItem {
  href: string;
  icon: LucideIcon;
  title: Bi;
  desc: Bi;
  gate?: Gate;
  /** Extra words the ⌘K palette matches on (old labels, Vietnamese names…). */
  keywords?: string;
}

export interface NavSection {
  id: string;
  heading: Bi;
  items: NavItem[];
}

export interface NavFooter {
  text: Bi;
  cta: { href: string; label: Bi };
}

export interface NavMenu {
  id: MenuId;
  sections: NavSection[];
  /** Desktop panel column count for the section grid. */
  columns: 2 | 3;
  footer: NavFooter;
}

export const NAV_TREE: NavMenu[] = [
  {
    id: 'learn',
    columns: 2,
    sections: [
      {
        id: 'paths',
        heading: { en: 'Study paths', vi: 'Lộ trình học' },
        items: [
          { href: '/academy', icon: GraduationCap,
            title: { en: 'Academy', vi: 'Academy' },
            desc: { en: 'FPT University curriculum by major and term — slides, notes and exam practice.', vi: 'Chương trình FPT University theo ngành và kỳ — slide, ghi chú và luyện đề.' },
            keywords: 'fptu fpt hoc vien' },
          { href: '/courses', icon: BookMarked,
            title: { en: 'Courses', vi: 'Khoá học' },
            desc: { en: 'Fifteen terms of self-paced courses, from your first terminal to production.', vi: 'Mười lăm kỳ khoá học tự học, từ dòng lệnh đầu tiên tới hệ thống thật.' },
            keywords: 'khoa hoc curriculum' },
          { href: '/roadmap', icon: MapIcon,
            title: { en: 'Roadmap', vi: 'Lộ trình nghề' },
            desc: { en: 'Step-by-step paths by role and skill: frontend, backend, DevOps, data.', vi: 'Lộ trình từng bước theo vai trò và kỹ năng: frontend, backend, DevOps, dữ liệu.' } },
          { href: '/hoc-tap', icon: Target,
            title: { en: 'Semester coach', vi: 'Huấn luyện học kỳ' },
            desc: { en: 'An AI plans each subject, checks the evidence you hand in and flags fail risk.', vi: 'AI lập kế hoạch từng môn, chấm bằng chứng bạn nộp và báo động nguy cơ trượt.' },
            keywords: 'hoc ky hoc tap semester' },
        ],
      },
      {
        id: 'exams',
        heading: { en: 'Exams & reading', vi: 'Thi & đọc' },
        items: [
          { href: '/exam', icon: ClipboardCheck,
            title: { en: 'Exam Room', vi: 'Phòng thi' },
            desc: { en: 'Real past FE and PE papers, graded automatically and by AI.', vi: 'Đề FE và PE thật, chấm tự động và bằng AI.' },
            keywords: 'phong thi de thi' },
          { href: '/books', icon: Library,
            title: { en: 'Library', vi: 'Thư viện sách' },
            desc: { en: 'Practical books on technology, thinking and people skills.', vi: 'Sách thực hành về công nghệ, tư duy và kỹ năng làm việc.' },
            keywords: 'sach books' },
        ],
      },
      {
        id: 'mine',
        heading: { en: 'Your learning', vi: 'Việc học của bạn' },
        items: [
          { href: '/my-courses', icon: PlayCircle,
            title: { en: 'My courses', vi: 'Khoá học của tôi' },
            desc: { en: 'Pick up where you left off.', vi: 'Học tiếp từ chỗ bạn dừng.' } },
          { href: '/certificates/my', icon: Award,
            title: { en: 'Certificates', vi: 'Chứng chỉ' },
            desc: { en: 'Certificates you earned by finishing courses.', vi: 'Chứng chỉ bạn nhận được khi học xong khoá.' },
            gate: 'auth', keywords: 'chung chi' },
        ],
      },
    ],
    footer: {
      text: { en: 'New here? A roadmap shows what to learn first.', vi: 'Mới bắt đầu? Lộ trình chỉ bạn nên học gì trước.' },
      cta: { href: '/roadmap', label: { en: 'Choose a path', vi: 'Chọn lộ trình' } },
    },
  },
  {
    id: 'practice',
    columns: 2,
    sections: [
      {
        id: 'code',
        heading: { en: 'Write code', vi: 'Viết code' },
        items: [
          { href: '/code-lab', icon: Code2,
            title: { en: 'Code Lab', vi: 'Code Lab' },
            desc: { en: 'Exercises graded in the browser, chapter by chapter.', vi: 'Bài tập chấm ngay trong trình duyệt, theo từng chương.' },
            keywords: 'bai tap exercises' },
          { href: '/algorithms', icon: Binary,
            title: { en: 'Algorithms', vi: 'Thuật toán' },
            desc: { en: 'Watch sorting and searching run step by step, then edit the code.', vi: 'Xem sắp xếp, tìm kiếm chạy từng bước rồi tự sửa code.' } },
          { href: '/simulation', icon: Waypoints,
            title: { en: 'Simulation studio', vi: 'Xưởng mô phỏng' },
            desc: { en: 'Animated REST, caching, JWT, WebSocket, Git and Docker internals.', vi: 'Hoạt hình REST, bộ đệm, JWT, WebSocket, Git và Docker bên trong.' } },
          { href: '/maker-lab', icon: CircuitBoard,
            title: { en: 'IoT Odin', vi: 'IoT Odin' },
            desc: { en: 'A home-built AI robot: parts, wiring, firmware and a live dashboard.', vi: 'Robot AI tự làm: linh kiện, nối dây, firmware và bảng điều khiển trực tiếp.' },
            keywords: 'maker lab robot esp32' },
        ],
      },
      {
        id: 'career',
        heading: { en: 'Career', vi: 'Nghề nghiệp' },
        items: [
          { href: '/interview', icon: Briefcase, gate: 'interview',
            title: { en: 'Interview practice', vi: 'Luyện phỏng vấn' },
            desc: { en: 'Technical questions with model answers, rubrics and AI grading.', vi: 'Câu hỏi kỹ thuật có đáp án mẫu, rubric và AI chấm.' },
            keywords: 'phong van' },
          { href: '/cv', icon: FileText, gate: 'cv',
            title: { en: 'CV Builder', vi: 'Tạo CV' },
            desc: { en: 'An honest CV for IT jobs — it asks what you really did.', vi: 'CV trung thực cho ngành IT — hỏi ra điều bạn thực sự đã làm.' } },
          { href: '/language', icon: Languages,
            title: { en: 'My Language', vi: 'Ngoại ngữ' },
            desc: { en: 'English, Japanese and Chinese with flashcards, quizzes and an AI tutor.', vi: 'Tiếng Anh, Nhật, Trung với flashcard, quiz và gia sư AI.' },
            keywords: 'ngoai ngu tieng anh japanese ielts' },
        ],
      },
    ],
    footer: {
      text: { en: 'Practise for free. Pro adds unlimited AI grading.', vi: 'Luyện tập miễn phí. Pro mở chấm AI không giới hạn.' },
      cta: { href: '/pro', label: { en: 'See Pro', vi: 'Xem gói Pro' } },
    },
  },
  {
    id: 'tools',
    columns: 3,
    sections: [
      {
        id: 'ai',
        heading: { en: 'AI assistants', vi: 'Trợ lý AI' },
        items: [
          { href: '/chat', icon: Sparkles,
            title: { en: 'AI Chat', vi: 'AI Chat' },
            desc: { en: 'Ask anything, attach images and PDFs.', vi: 'Hỏi gì cũng được, đính kèm ảnh và PDF.' } },
          { href: '/voice-mini', icon: AudioLines,
            title: { en: 'Voice CuongMini', vi: 'Voice CuongMini' },
            desc: { en: 'Paste text, pick a voice, listen right away.', vi: 'Dán văn bản, chọn giọng, nghe ngay.' },
            keywords: 'text to speech giong noi' },
          { href: '/ai-templates', icon: Blocks,
            title: { en: 'AI Templates', vi: 'Mẫu AI' },
            desc: { en: 'Ready-made skills, agents and MCP configs for Claude Code.', vi: 'Skill, agent và cấu hình MCP dựng sẵn cho Claude Code.' } },
        ],
      },
      {
        id: 'dev',
        heading: { en: 'For developers', vi: 'Cho lập trình viên' },
        items: [
          { href: '/ai-code', icon: Puzzle,
            title: { en: 'AI Code for VS Code', vi: 'AI Code cho VS Code' },
            desc: { en: 'An AI that reads and edits code in VS Code or Cursor.', vi: 'AI đọc và sửa code ngay trong VS Code, Cursor.' },
            keywords: 'cuongmini code extension' },
          { href: '/cli', icon: Terminal,
            title: { en: 'CuongMini CLI', vi: 'CuongMini CLI' },
            desc: { en: 'The same AI in your terminal, on any OS.', vi: 'Cũng AI đó, chạy trong terminal mọi hệ điều hành.' } },
          { href: '/llm-key', icon: KeyRound,
            title: { en: 'Key terminal', vi: 'Key terminal' },
            desc: { en: 'Get an API key for the CLI.', vi: 'Lấy key dùng cho CLI.' } },
          { href: '/kiem-tra-key', icon: Gauge,
            title: { en: 'Key usage check', vi: 'Kiểm tra hạn mức key' },
            desc: { en: 'Paste a key to see how much is left.', vi: 'Dán key để xem còn bao nhiêu.' },
            keywords: 'kiem tra key quota' },
        ],
      },
      {
        id: 'work',
        heading: { en: 'Productivity', vi: 'Làm việc' },
        items: [
          { href: '/work', icon: KanbanSquare,
            title: { en: 'CT Work', vi: 'CT Work' },
            desc: { en: 'Projects, sprints, docs and tests for student teams.', vi: 'Dự án, sprint, tài liệu và kiểm thử cho nhóm sinh viên.' },
            keywords: 'jira project quan ly du an' },
          { href: '/notes', icon: NotebookPen,
            title: { en: 'Notes', vi: 'Ghi chú' },
            desc: { en: 'Rich notes by subject, shareable with friends.', vi: 'Ghi chú theo môn, chia sẻ được với bạn bè.' },
            keywords: 'ghi chu' },
          { href: '/finance', icon: Wallet,
            title: { en: 'MoneyFlow', vi: 'MoneyFlow' },
            desc: { en: 'Track income, spending and debts.', vi: 'Theo dõi thu chi và khoản nợ.' },
            keywords: 'tai chinh finance' },
        ],
      },
      {
        id: 'fun',
        heading: { en: 'Downtime', vi: 'Giải trí' },
        items: [
          { href: '/music', icon: Music, gate: 'music',
            title: { en: 'Music', vi: 'Nhạc' },
            desc: { en: 'Playlists, and listening together.', vi: 'Danh sách nhạc và nghe cùng nhau.' } },
          { href: '/games', icon: Gamepad2,
            title: { en: 'Games', vi: 'Trò chơi' },
            desc: { en: 'Browser games built from scratch.', vi: 'Trò chơi trình duyệt tự viết.' } },
          { href: '/toc-do-mang', icon: Wifi,
            title: { en: 'Speed test', vi: 'Tốc độ mạng' },
            desc: { en: 'Measure your connection.', vi: 'Đo tốc độ đường truyền.' },
            keywords: 'toc do mang speedtest' },
        ],
      },
      {
        id: 'store',
        heading: { en: 'Plans & store', vi: 'Gói & cửa hàng' },
        items: [
          { href: '/pro', icon: Crown,
            title: { en: 'CuongThai Pro', vi: 'CuongThai Pro' },
            desc: { en: 'More AI, more grading, no daily caps.', vi: 'Thêm AI, thêm lượt chấm, bỏ giới hạn ngày.' },
            keywords: 'update pro nang cap' },
          { href: '/shop', icon: ShoppingBag, gate: 'shop',
            title: { en: 'Shop', vi: 'Cửa hàng' },
            desc: { en: 'AI tools and keys.', vi: 'Công cụ AI và key.' } },
          { href: '/download', icon: MonitorDown,
            title: { en: 'Desktop app', vi: 'App máy tính' },
            desc: { en: 'CuongThai for macOS and Windows.', vi: 'CuongThai cho macOS và Windows.' },
            keywords: 'get app tai app' },
        ],
      },
    ],
    footer: {
      text: { en: 'Everything here also runs in the desktop app.', vi: 'Mọi thứ ở đây cũng chạy trong app máy tính.' },
      cta: { href: '/download', label: { en: 'Get the app', vi: 'Tải app' } },
    },
  },
  {
    id: 'community',
    columns: 2,
    sections: [
      {
        id: 'read',
        heading: { en: 'Read & discuss', vi: 'Đọc & thảo luận' },
        items: [
          { href: '/feed', icon: Newspaper,
            title: { en: 'Feed', vi: 'Bảng tin' },
            desc: { en: 'Posts, videos and music from the community.', vi: 'Bài viết, video và nhạc của cộng đồng.' } },
          { href: '/tech-trends', icon: BookOpen,
            title: { en: 'Blog', vi: 'Blog' },
            desc: { en: 'Real production incidents, deep dives and exam tips.', vi: 'Sự cố production thật, bài chuyên sâu và mẹo ôn thi.' },
            keywords: 'tech trends bai viet' },
          { href: '/forum', icon: Megaphone,
            title: { en: 'Forum', vi: 'Diễn đàn' },
            desc: { en: 'Announcements and open discussion.', vi: 'Thông báo và thảo luận chung.' },
            keywords: 'dien dan' },
        ],
      },
      {
        id: 'people',
        heading: { en: 'People', vi: 'Mọi người' },
        items: [
          { href: '/friends', icon: Users,
            title: { en: 'Friends', vi: 'Bạn bè' },
            desc: { en: 'Find people and manage friend requests.', vi: 'Tìm người và quản lý lời mời kết bạn.' },
            keywords: 'ban be tim nguoi search people' },
          { href: '/messages', icon: MessagesSquare, gate: 'auth',
            title: { en: 'Messenger', vi: 'Tin nhắn' },
            desc: { en: 'Direct messages and support chat.', vi: 'Nhắn tin riêng và hỗ trợ.' },
            keywords: 'tin nhan chat' },
        ],
      },
      {
        id: 'build',
        heading: { en: 'Built here', vi: 'Dự án & tài nguyên' },
        items: [
          { href: '/projects', icon: FolderOpen,
            title: { en: 'Projects', vi: 'Dự án' },
            desc: { en: 'Case studies of things built on this site.', vi: 'Các dự án đã làm, kể lại chi tiết.' } },
          { href: '/repos', icon: Github,
            title: { en: 'GitHub repos', vi: 'Kho GitHub' },
            desc: { en: 'Curated repositories with reviews and lessons.', vi: 'Kho mã chọn lọc kèm nhận xét và bài học.' } },
          { href: '/exp-hub', icon: FileCode2,
            title: { en: 'Exp Hub', vi: 'Exp Hub' },
            desc: { en: 'Engineering notes and experience write-ups.', vi: 'Ghi chép kỹ thuật và kinh nghiệm.' } },
          { href: '/hub', icon: Bookmark,
            title: { en: 'Hub', vi: 'Hub' },
            desc: { en: 'Your bookmarks for links, articles and tools.', vi: 'Nơi lưu liên kết, bài viết và công cụ.' },
            keywords: 'bookmark' },
        ],
      },
    ],
    footer: {
      text: { en: 'Got a question? Ask it in the forum.', vi: 'Có câu hỏi? Hỏi trên diễn đàn.' },
      cta: { href: '/forum', label: { en: 'Open the forum', vi: 'Vào diễn đàn' } },
    },
  },
  {
    id: 'about',
    columns: 2,
    sections: [
      {
        id: 'site',
        heading: { en: 'CuongThai', vi: 'CuongThai' },
        items: [
          { href: '/about', icon: User,
            title: { en: 'About this site & me', vi: 'Về trang này & về mình' },
            desc: { en: 'What CuongThai is, what you can do here, and who builds it.', vi: 'CuongThai là gì, làm được gì ở đây, và ai đang làm nó.' },
            keywords: 'gioi thieu about me' },
          { href: '/about/bao-mat', icon: ShieldCheck,
            title: { en: 'Security & privacy', vi: 'Bảo mật & quyền riêng tư' },
            desc: { en: 'How your data is stored and protected.', vi: 'Dữ liệu của bạn được lưu và bảo vệ thế nào.' },
            keywords: 'bao mat' },
        ],
      },
      {
        id: 'hire',
        heading: { en: 'Work with me', vi: 'Hợp tác' },
        items: [
          { href: '/about/studio', icon: Store,
            title: { en: 'Studio', vi: 'Studio' },
            desc: { en: 'What the studio builds, with real case studies.', vi: 'Studio làm gì, kèm dự án thật.' } },
          { href: '/about/nhan-du-an', icon: Send,
            title: { en: 'Start a project', vi: 'Gửi yêu cầu dự án' },
            desc: { en: 'Pick a package and send a request.', vi: 'Chọn gói và gửi yêu cầu.' },
            keywords: 'nhan du an' },
          { href: '/about/quy-trinh', icon: Workflow,
            title: { en: 'How projects run', vi: 'Quy trình làm dự án' },
            desc: { en: 'Every stage from intake to maintenance.', vi: 'Từng giai đoạn từ tiếp nhận tới bảo trì.' },
            keywords: 'quy trinh' },
        ],
      },
    ],
    footer: {
      text: { en: 'Prefer to talk first? Message me directly.', vi: 'Muốn trao đổi trước? Nhắn trực tiếp cho mình.' },
      cta: { href: '/about#contact', label: { en: 'Contact', vi: 'Liên hệ' } },
    },
  },
];

/** Avatar-menu destinations (also searchable in ⌘K). Order = menu order. */
export const ACCOUNT_LINKS: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, gate: 'auth',
    title: { en: 'Dashboard', vi: 'Bảng điều khiển' }, desc: { en: 'Your overview.', vi: 'Tổng quan của bạn.' } },
  { href: '/profile', icon: User, gate: 'auth',
    title: { en: 'Profile', vi: 'Trang cá nhân' }, desc: { en: 'Your public profile.', vi: 'Trang cá nhân công khai.' } },
  { href: '/my-courses', icon: PlayCircle, gate: 'auth',
    title: { en: 'My courses', vi: 'Khoá học của tôi' }, desc: { en: 'Courses you are taking.', vi: 'Khoá bạn đang học.' } },
  { href: '/certificates/my', icon: Award, gate: 'auth',
    title: { en: 'Certificates', vi: 'Chứng chỉ' }, desc: { en: 'Certificates you earned.', vi: 'Chứng chỉ bạn đã nhận.' } },
  { href: '/my-orders', icon: Receipt, gate: 'cart',
    title: { en: 'Orders', vi: 'Lịch sử mua hàng' }, desc: { en: 'Your purchases.', vi: 'Các đơn bạn đã mua.' } },
  { href: '/wallet', icon: Wallet, gate: 'cart',
    title: { en: 'Points wallet', vi: 'Ví điểm' }, desc: { en: 'Points balance and history.', vi: 'Số dư điểm và lịch sử.' },
    keywords: 'vi diem' },
  { href: '/my-codes', icon: Ticket, gate: 'auth',
    title: { en: 'My codes', vi: 'Mã của tôi' }, desc: { en: 'Codes and keys you own.', vi: 'Mã và key bạn sở hữu.' } },
  { href: '/settings', icon: Settings, gate: 'auth',
    title: { en: 'Settings', vi: 'Cài đặt' }, desc: { en: 'Account, appearance and notifications.', vi: 'Tài khoản, giao diện và thông báo.' },
    keywords: 'cai dat' },
  { href: '/admin', icon: Shield, gate: 'admin',
    title: { en: 'Admin dashboard', vi: 'Trang quản trị' }, desc: { en: 'Site administration.', vi: 'Quản trị trang.' } },
];

export interface Viewer {
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasMusicAccess: boolean;
}

export function isVisible(item: NavItem, v: Viewer): boolean {
  switch (item.gate) {
    case undefined: return true;
    case 'auth': return v.isAuthenticated;
    case 'admin': return v.isAdmin;
    case 'music': return v.hasMusicAccess;
    case 'shop': return SHOP_ENABLED;
    case 'cart': return CART_ENABLED && v.isAuthenticated;
    case 'interview': return INTERVIEW_ENABLED;
    case 'cv': return CV_BUILDER_ENABLED;
  }
}

/** Menu with gated items removed and empty sections dropped. */
export function visibleMenu(menu: NavMenu, v: Viewer): NavMenu {
  return {
    ...menu,
    sections: menu.sections
      .map((s) => ({ ...s, items: s.items.filter((it) => isVisible(it, v)) }))
      .filter((s) => s.items.length > 0),
  };
}

export function menuById(id: MenuId): NavMenu {
  return NAV_TREE.find((m) => m.id === id)!;
}

/** Accent-insensitive fold so "hoc ky" matches "Học kỳ". */
export function foldText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/** True when `pathname` is inside `href` (exact for "/"). */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const base = href.split('#')[0];
  if (base === '/') return pathname === '/';
  return pathname === base || pathname.startsWith(`${base}/`);
}
