/**
 * Bảng điều hướng — nguồn sự thật cho sidebar, command palette và router.
 *
 * MỌI route ở đây đều tồn tại thật trên cuongthai.com (đối chiếu bằng
 * `find frontend/src/app -name page.tsx` ngày 16/08/2026). Không mục nào là
 * trang bịa: một mục sidebar dẫn tới tính năng không tồn tại còn tệ hơn là
 * không có mục đó, vì người dùng sẽ đi tìm thứ không bao giờ có.
 *
 * Route đã có màn hình native hay chưa KHÔNG khai báo ở đây — nó được suy ra từ
 * `page-registry.ts` bằng `isPorted()`. Giữ hai danh sách song song là mời gọi
 * chúng lệch nhau; suy ra từ một nguồn thì không lệch được.
 *
 * ─── Những trang CỐ Ý không đưa vào ───
 *   • `/admin/**`  — chỉ quản trị viên; không phải điều hướng thường ngày.
 *   • `/shop` `/cart` `/checkout` `/my-orders` — thương mại đang TẮT bằng cờ
 *     (`frontend/src/lib/featureFlags.ts`); middleware của web đã chuyển hướng
 *     chúng về trang chủ, nên đưa vào đây là dẫn người dùng vào ngõ cụt.
 *   • `/chinh-sach-*` `/huong-dan-mua-hang` — trang chính sách, đọc một lần.
 *   • `/login` `/register` `/reset-password` `/verify-*` `/oauth-callback`
 *     — thuộc luồng xác thực, app có màn riêng.
 *   • `/offline` `/landing-preview` — trang kỹ thuật của web.
 */
import type { LucideIcon } from 'lucide-react';
import {
  Binary,
  Bookmark,
  BookOpen,
  Bot,
  Braces,
  Briefcase,
  Car,
  ClipboardList,
  Cpu,
  FileText,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Library,
  MessageSquareCode,
  MessagesSquare,
  Mic,
  Music,
  Newspaper,
  NotebookPen,
  Route as RouteIcon,
  Rss,
  Sparkles,
  UserRound,
  Users,
  Wallet,
  Wand2,
} from 'lucide-react';
import { nativePageFor } from './page-registry';

export type RouteGroup = 'chinh' | 'ai' | 'hoc' | 'lam' | 'khac';

export interface RouteDef {
  /** Đường dẫn, trùng với đường dẫn trên web để mở ngoài là ra đúng trang. */
  path: string;
  label: string;
  icon: LucideIcon;
  group: RouteGroup;
  /**
   * Cần tài khoản Pro — CHỈ để hiển thị; quyền thật do server quyết.
   *
   * ⚠️ Hiện KHÔNG route nào đặt cờ này (22/08/2026). `/interview` từng đặt và
   * đã gỡ: nhãn nói quá, vì phần lõi của trang đó miễn phí. Cơ chế giữ lại vì
   * nó đúng và sẽ cần khi có trang thật sự chỉ dành cho Pro — nhưng gắn nó thì
   * phải chắc CẢ TRANG cần Pro, không phải một vài tính năng trong đó. Nhãn
   * sai làm người dùng free bỏ qua thứ họ dùng được.
   */
  pro?: boolean;
  /** Từ khoá phụ cho command palette. Viết cả dạng KHÔNG DẤU vì gõ nhanh hay bỏ dấu. */
  keywords?: string[];
}

export const ROUTES: readonly RouteDef[] = [
  // ── Chính ────────────────────────────────────────────────
  { path: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard, group: 'chinh',
    keywords: ['home', 'trang chủ', 'dashboard'] },
  { path: '/feed', label: 'Bảng tin', icon: Rss, group: 'chinh',
    keywords: ['feed', 'newsfeed', 'bai viet'] },
  { path: '/messages', label: 'Tin nhắn', icon: MessagesSquare, group: 'chinh',
    keywords: ['nhắn tin', 'messenger', 'inbox', 'tin nhan'] },
  { path: '/notes', label: 'Ghi chú', icon: NotebookPen, group: 'chinh',
    keywords: ['notes', 'ghi chep', 'notion'] },
  { path: '/friends', label: 'Bạn bè', icon: Users, group: 'chinh',
    keywords: ['friends', 'ban be', 'ket ban'] },

  // ── AI ───────────────────────────────────────────────────
  { path: '/chat', label: 'AI Chat', icon: Bot, group: 'ai',
    keywords: ['ai', 'chat', 'gpt', 'tro ly', 'hoi dap'] },
  { path: '/ai-templates', label: 'Mẫu AI', icon: Wand2, group: 'ai',
    keywords: ['ai templates', 'mau ai', 'prompt'] },
  { path: '/voice', label: 'Giọng nói', icon: Mic, group: 'ai',
    keywords: ['voice', 'tts', 'giong noi', 'doc van ban'] },

  // ── Học tập ──────────────────────────────────────────────
  { path: '/academy', label: 'Học viện', icon: GraduationCap, group: 'hoc',
    keywords: ['academy', 'khoá học', 'môn', 'fpt', 'hoc vien'] },
  { path: '/courses', label: 'Khoá học', icon: Library, group: 'hoc',
    keywords: ['courses', 'khoa hoc'] },
  { path: '/code-lab', label: 'Code Lab', icon: Braces, group: 'hoc',
    keywords: ['code', 'lab', 'bài tập', 'thuc hanh'] },
  { path: '/exam', label: 'Phòng thi', icon: ClipboardList, group: 'hoc',
    keywords: ['exam', 'thi', 'de thi', 'kiem tra', 'phong thi'] },
  { path: '/language', label: 'Ngoại ngữ', icon: Languages, group: 'hoc',
    keywords: ['my language', 'tiếng anh', 'tiếng nhật', 'ngoai ngu'] },
  { path: '/algorithms', label: 'Thuật toán', icon: Binary, group: 'hoc',
    keywords: ['algorithm', 'thuat toan', 'visualizer'] },
  { path: '/simulation', label: 'Mô phỏng', icon: FlaskConical, group: 'hoc',
    keywords: ['simulation', 'mo phong', 'kich ban'] },
  { path: '/roadmap', label: 'Lộ trình', icon: RouteIcon, group: 'hoc',
    keywords: ['roadmap', 'lo trinh'] },
  /* ⚠️ KHÔNG gắn `pro: true`. Nhãn đó từng ở đây và nó NÓI QUÁ: chế độ `STATIC`
     (ngân hàng câu hỏi + đáp án mẫu + rubric + tự chấm + máy chấm) hoàn toàn
     MIỄN PHÍ — chỉ chấm-bằng-AI, cá nhân hoá từ CV và chế độ dự án mới cần Pro
     (`tax.aiAllowed` trong `app/interview/page.tsx`). Một nhãn "Cần tài khoản
     Pro" ở thanh bên làm người dùng free bỏ qua thứ họ dùng được đầy đủ.
     Bản thân trang đã nói đúng chuyện này: nó khoá riêng từng chế độ AI. */
  { path: '/interview', label: 'Phỏng vấn', icon: MessageSquareCode, group: 'hoc',
    keywords: ['interview', 'luyện phỏng vấn', 'phong van', 'mock interview', 'luyen phong van'] },

  // ── Làm & sáng tạo ───────────────────────────────────────
  { path: '/maker-lab', label: 'Maker Lab', icon: Cpu, group: 'lam',
    keywords: ['maker', 'robot', 'odin', 'esp32', 'phan cung'] },
  { path: '/creator', label: 'Xưởng nội dung', icon: Sparkles, group: 'lam',
    keywords: ['creator', 'studio', 'kich ban', 'video', 'xuong'] },
  { path: '/projects', label: 'Dự án', icon: Briefcase, group: 'lam',
    keywords: ['projects', 'du an'] },
  { path: '/repos', label: 'Kho mã', icon: Library, group: 'lam',
    keywords: ['repos', 'github', 'kho ma'] },
  { path: '/exp-hub', label: 'Exp Hub', icon: BookOpen, group: 'lam',
    keywords: ['exp', 'kinh nghiệm', 'snippet', 'hub'] },
  { path: '/cv', label: 'CV Builder', icon: FileText, group: 'lam',
    keywords: ['cv', 'resume', 'hồ sơ', 'ho so'] },

  // ── Khác ─────────────────────────────────────────────────
  { path: '/tech-trends', label: 'Tech Trends', icon: Newspaper, group: 'khac',
    keywords: ['tin công nghệ', 'blog', 'bài viết', 'tech'] },
  { path: '/music', label: 'Nhạc', icon: Music, group: 'khac',
    keywords: ['music', 'nghe nhạc', 'remix', 'nhac'] },
  { path: '/games', label: 'Trò chơi', icon: Gamepad2, group: 'khac',
    keywords: ['games', 'tro choi'] },
  /* Sân chơi 3D. Trên web đây là một ứng dụng Vite tĩnh trong `public/`; trong
     app nó là màn hình native mở ra CỬA SỔ RIÊNG — xem features/sanchoi. */
  { path: '/playground', label: 'Sân chơi 3D', icon: Car, group: 'khac',
    keywords: ['playground', 'san choi', '3d', 'game', 'lai xe', 'sinh ton'] },
  { path: '/finance', label: 'Tài chính', icon: Wallet, group: 'khac',
    keywords: ['finance', 'tai chinh', 'moneyflow', 'chi tieu'] },
  { path: '/forum', label: 'Diễn đàn', icon: Users, group: 'khac',
    keywords: ['forum', 'thảo luận', 'dien dan'] },
  { path: '/saved', label: 'Đã lưu', icon: Bookmark, group: 'khac',
    keywords: ['saved', 'da luu', 'bookmark'] },
  { path: '/profile', label: 'Trang cá nhân', icon: UserRound, group: 'khac',
    keywords: ['profile', 'ca nhan', 'trang ca nhan'] },
  { path: '/pro', label: 'Pro', icon: Sparkles, group: 'khac',
    keywords: ['pro', 'nâng cấp', 'gói', 'nang cap'] },
];

export const GROUP_LABELS: Record<RouteGroup, string> = {
  chinh: 'Chính',
  ai: 'AI',
  hoc: 'Học tập',
  lam: 'Làm & sáng tạo',
  khac: 'Khác',
};

export const GROUP_ORDER: readonly RouteGroup[] = ['chinh', 'ai', 'hoc', 'lam', 'khac'];

/** Route nội bộ của app — không có trên web, nên không mở ngoài được. */
export const INTERNAL_ROUTES = {
  settings: '/app/settings',
  about: '/app/about',
} as const;

export function findRoute(path: string): RouteDef | undefined {
  return ROUTES.find((route) => route.path === path);
}

/**
 * Route đã có màn hình native chưa — SUY RA từ sổ đăng ký, không khai báo tay.
 * Thêm một trang vào `NATIVE_PAGES` là sidebar tự biết ngay.
 */
export function isPorted(path: string): boolean {
  return nativePageFor(path) !== undefined;
}
