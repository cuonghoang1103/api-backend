/**
 * Danh mục điều hướng /admin — MỘT chỗ duy nhất cho sidebar lẫn ⌘K.
 *
 * Trước 23/09/2026 sidebar là một danh sách phẳng 45 mục, nhãn trộn ba kiểu
 * ("Quan ly Bai Giang" không dấu, "Quản lý Mã Pro", "EXP Hub — Snippets").
 * Giờ nhãn là tiếng Anh ngắn, gom theo mảng việc; `keywords` giữ lại tên tiếng
 * Việt cũ để gõ ⌘K bằng tiếng nào cũng ra.
 *
 * Thêm trang admin mới: thêm MỘT dòng vào nhóm hợp lý bên dưới — không có
 * dòng ở đây thì trang chỉ vào được bằng cách gõ URL tay (đã xảy ra với
 * /admin/commerce trước 13/09/2026).
 */
import type { LucideIcon } from 'lucide-react';
import {
  Activity, AlertTriangle, BarChart3, BookOpen, Briefcase, Clapperboard, Code2,
  CreditCard, Crown, Database, FileText, FlaskConical, FolderKanban, Gamepad2, Github,
  GraduationCap, Inbox, KeyRound, Languages, LayoutDashboard, LibraryBig, Mic, MonitorPlay,
  Music, Newspaper, Radio, Receipt, Search, Server, ShoppingBag, Sparkles, Star, Sticker,
  Tag, Ticket, TrendingUp, UserX, Users, UsersRound, Zap,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Từ khoá thêm cho ⌘K (tên tiếng Việt cũ, từ đồng nghĩa). */
  keywords?: string;
  /** Mở sang không gian làm việc khác (không nằm trong khung /admin). */
  external?: boolean;
  /** Khớp cả các đường dẫn con (vd /creator/*) khi tô mục đang mở. */
  matchPrefix?: string;
}

export interface AdminNavGroup {
  id: string;
  label: string | null;
  /** Biến màu của nhóm (admin.css) — biểu tượng trong nhóm mang hue này. */
  hue?: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    id: 'home',
    label: null,
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, keywords: 'tổng quan overview home' },
      { label: 'Inbox', href: '/admin/thong-bao', icon: Inbox, keywords: 'thông báo việc chờ notifications tasks' },
      { label: 'Content Studio', href: '/creator', icon: Clapperboard, external: true, matchPrefix: '/creator', keywords: 'studio creator video kịch bản' },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
    hue: 'var(--n-learning)',
    items: [
      { label: 'Courses', href: '/admin/courses', icon: BookOpen, keywords: 'khoá học quản lý khoá học' },
      { label: 'Course categories', href: '/admin/course-categories', icon: Tag, keywords: 'danh mục khoá học' },
      { label: 'Enrollments', href: '/admin/course-enrollments', icon: UsersRound, keywords: 'học viên khoá học' },
      { label: 'Academy (FPT)', href: '/admin/academy', icon: GraduationCap, keywords: 'fpt academy lms môn học học kỳ' },
      { label: 'Lessons', href: '/admin/lessons', icon: LibraryBig, keywords: 'bài giảng quản lý bài giảng' },
      { label: 'Code Lab', href: '/admin/code-lab', icon: FlaskConical, keywords: 'bài tập lộ trình' },
      { label: 'Interview', href: '/admin/interview', icon: Briefcase, keywords: 'phỏng vấn interview simulator' },
      { label: 'CV Builder', href: '/admin/cv', icon: FileText, keywords: 'cv hồ sơ' },
      { label: 'Languages', href: '/admin/language', icon: Languages, keywords: 'my language ngôn ngữ từ vựng' },
      { label: 'Language analytics', href: '/admin/language-analytics', icon: BarChart3, keywords: 'thống kê ngôn ngữ' },
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    hue: 'var(--n-commerce)',
    items: [
      { label: 'Revenue', href: '/admin/commerce', icon: TrendingUp, keywords: 'thương mại doanh thu đối soát chuyển khoản duyệt key ngân hàng' },
      { label: 'Shop', href: '/admin/shop', icon: ShoppingBag, keywords: 'quản lý shop sản phẩm' },
      { label: 'Orders', href: '/admin/orders', icon: Receipt, keywords: 'đơn hàng quản lý đơn hàng' },
      { label: 'Course orders', href: '/admin/course-orders', icon: CreditCard, keywords: 'đơn hàng khoá học vnpay' },
      { label: 'Discounts', href: '/admin/discounts', icon: Tag, keywords: 'mã giảm giá coupon' },
      { label: 'Pro codes', href: '/admin/pro-codes', icon: Crown, keywords: 'mã pro membership' },
      { label: 'Access codes', href: '/admin/code-academy', icon: KeyRound, keywords: 'quản lý mã code academy' },
      { label: 'User codes', href: '/admin/user-codes', icon: Ticket, keywords: 'cấp mã cho user' },
      { label: 'Reviews', href: '/admin/reviews', icon: Star, keywords: 'duyệt đánh giá' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    hue: 'var(--n-content)',
    items: [
      { label: 'Posts', href: '/admin/posts', icon: FileText, keywords: 'bài viết quản lý posts' },
      { label: 'Tech Trends', href: '/admin/tech-trends', icon: Newspaper, keywords: 'blog bài báo tin công nghệ' },
      { label: 'Homepage promos', href: '/admin/landing', icon: MonitorPlay, keywords: 'trang chủ promo videos landing' },
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban, keywords: 'dự án quản lý projects case study' },
      { label: 'Skills', href: '/admin/skills', icon: Code2, keywords: 'kỹ năng quản lý skills' },
      { label: 'Repo Hub', href: '/admin/repos', icon: Github, keywords: 'github repo' },
      { label: 'EXP Hub', href: '/admin/exp-hub', icon: Code2, keywords: 'snippets exp hub tài liệu' },
      { label: 'Music', href: '/admin/music', icon: Music, keywords: 'quản lý nhạc bài hát' },
      { label: 'Music posts', href: '/admin/music-posts', icon: Music, keywords: 'music post post nền' },
      { label: 'Voice', href: '/admin/voice', icon: Radio, keywords: 'vlog reaction podcast' },
      { label: 'Video categories', href: '/admin/video-categories', icon: Clapperboard, keywords: 'danh mục video' },
      { label: 'Games', href: '/admin/games', icon: Gamepad2, keywords: 'trò chơi' },
      { label: 'Stickers', href: '/admin/stickers', icon: Sticker, keywords: 'nhãn dán quản lý nhãn dán' },
      { label: 'SEO', href: '/admin/seo', icon: Search, keywords: 'seo tools indexnow sitemap' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    hue: 'var(--n-people)',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users, keywords: 'người dùng quản lý users tài khoản' },
      { label: 'Reports', href: '/admin/reports', icon: AlertTriangle, keywords: 'báo cáo vi phạm' },
      { label: 'Deletion requests', href: '/admin/deletion-requests', icon: UserX, keywords: 'yêu cầu xoá tài khoản' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    hue: 'var(--n-system)',
    items: [
      { label: 'Traffic', href: '/admin/analytics', icon: Activity, keywords: 'lượt truy cập analytics' },
      { label: 'AI analytics', href: '/admin/ai-analytics', icon: Sparkles, keywords: 'ai chat analytics thống kê' },
      { label: 'AI knowledge', href: '/admin/ai-knowledge', icon: Database, keywords: 'knowledge base rag tài liệu ai' },
      { label: 'Embed queue', href: '/admin/embed-jobs', icon: Zap, keywords: 'embedding hàng đợi' },
      { label: 'Infrastructure', href: '/admin/ha-tang', icon: Server, keywords: 'hạ tầng vps gpu máy nhà' },
      { label: 'Voice studio', href: '/admin/xuong-giong', icon: Mic, keywords: 'xưởng giọng thu âm train tts' },
      { label: 'System stats', href: '/admin/stats', icon: BarChart3, keywords: 'thống kê hệ thống' },
    ],
  },
];

export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items);

/** Mục đang mở: khớp đường dẫn dài nhất để /admin/games/categories tô "Games". */
export function activeHref(pathname: string | null): string | null {
  if (!pathname) return null;
  let best: string | null = null;
  let bestLen = -1;
  for (const it of ADMIN_NAV_FLAT) {
    const prefix = it.matchPrefix ?? it.href;
    const hit = it.href === '/admin'
      ? pathname === '/admin'
      : pathname === prefix || pathname.startsWith(prefix + '/');
    if (hit && prefix.length > bestLen) { best = it.href; bestLen = prefix.length; }
  }
  return best;
}
