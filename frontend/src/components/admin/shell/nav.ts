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
  /** Nhãn tiếng Việt (nút VI/EN trên thanh admin đổi qua lại). */
  vi?: string;
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
  viLabel?: string | null;
  /** Biến màu của nhóm (admin.css) — ô biểu tượng trong nhóm mang hue này. */
  hue?: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    id: 'home',
    label: null,
    items: [
      { label: 'Dashboard', vi: 'Tổng quan', href: '/admin', icon: LayoutDashboard, keywords: 'tổng quan overview home' },
      { label: 'Inbox', vi: 'Hộp thư', href: '/admin/thong-bao', icon: Inbox, keywords: 'thông báo việc chờ notifications tasks' },
      { label: 'Content Studio', vi: 'Xưởng nội dung', href: '/creator', icon: Clapperboard, external: true, matchPrefix: '/creator', keywords: 'studio creator video kịch bản' },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
    viLabel: 'Học tập',
    hue: 'var(--n-learning)',
    items: [
      { label: 'Courses', vi: 'Khoá học', href: '/admin/courses', icon: BookOpen, keywords: 'khoá học quản lý khoá học' },
      { label: 'Course categories', vi: 'Danh mục khoá', href: '/admin/course-categories', icon: Tag, keywords: 'danh mục khoá học' },
      { label: 'Enrollments', vi: 'Học viên', href: '/admin/course-enrollments', icon: UsersRound, keywords: 'học viên khoá học' },
      { label: 'Academy (FPT)', vi: 'Academy (FPT)', href: '/admin/academy', icon: GraduationCap, keywords: 'fpt academy lms môn học học kỳ' },
      { label: 'Lessons', vi: 'Bài giảng', href: '/admin/lessons', icon: LibraryBig, keywords: 'bài giảng quản lý bài giảng' },
      { label: 'Code Lab', vi: 'Code Lab', href: '/admin/code-lab', icon: FlaskConical, keywords: 'bài tập lộ trình' },
      { label: 'Interview', vi: 'Phỏng vấn', href: '/admin/interview', icon: Briefcase, keywords: 'phỏng vấn interview simulator' },
      { label: 'CV Builder', vi: 'Làm CV', href: '/admin/cv', icon: FileText, keywords: 'cv hồ sơ' },
      { label: 'Languages', vi: 'Học ngôn ngữ', href: '/admin/language', icon: Languages, keywords: 'my language ngôn ngữ từ vựng' },
      { label: 'Language analytics', vi: 'Thống kê ngôn ngữ', href: '/admin/language-analytics', icon: BarChart3, keywords: 'thống kê ngôn ngữ' },
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    viLabel: 'Kinh doanh',
    hue: 'var(--n-commerce)',
    items: [
      { label: 'Revenue', vi: 'Doanh thu', href: '/admin/commerce', icon: TrendingUp, keywords: 'thương mại doanh thu đối soát chuyển khoản duyệt key ngân hàng' },
      { label: 'Shop', vi: 'Cửa hàng', href: '/admin/shop', icon: ShoppingBag, keywords: 'quản lý shop sản phẩm' },
      { label: 'Orders', vi: 'Đơn hàng', href: '/admin/orders', icon: Receipt, keywords: 'đơn hàng quản lý đơn hàng' },
      { label: 'Course orders', vi: 'Đơn khoá học', href: '/admin/course-orders', icon: CreditCard, keywords: 'đơn hàng khoá học vnpay' },
      { label: 'Discounts', vi: 'Mã giảm giá', href: '/admin/discounts', icon: Tag, keywords: 'mã giảm giá coupon' },
      { label: 'Pro codes', vi: 'Mã Pro', href: '/admin/pro-codes', icon: Crown, keywords: 'mã pro membership' },
      { label: 'Access codes', vi: 'Mã truy cập', href: '/admin/code-academy', icon: KeyRound, keywords: 'quản lý mã code academy' },
      { label: 'User codes', vi: 'Mã của user', href: '/admin/user-codes', icon: Ticket, keywords: 'cấp mã cho user' },
      { label: 'Reviews', vi: 'Đánh giá', href: '/admin/reviews', icon: Star, keywords: 'duyệt đánh giá' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    viLabel: 'Nội dung',
    hue: 'var(--n-content)',
    items: [
      { label: 'Posts', vi: 'Bài viết', href: '/admin/posts', icon: FileText, keywords: 'bài viết quản lý posts' },
      { label: 'Tech Trends', vi: 'Tech Trends', href: '/admin/tech-trends', icon: Newspaper, keywords: 'blog bài báo tin công nghệ' },
      { label: 'Homepage promos', vi: 'Video trang chủ', href: '/admin/landing', icon: MonitorPlay, keywords: 'trang chủ promo videos landing' },
      { label: 'Projects', vi: 'Dự án', href: '/admin/projects', icon: FolderKanban, keywords: 'dự án quản lý projects case study' },
      { label: 'Skills', vi: 'Kỹ năng', href: '/admin/skills', icon: Code2, keywords: 'kỹ năng quản lý skills' },
      { label: 'Repo Hub', vi: 'Kho GitHub', href: '/admin/repos', icon: Github, keywords: 'github repo' },
      { label: 'EXP Hub', vi: 'EXP Hub', href: '/admin/exp-hub', icon: Code2, keywords: 'snippets exp hub tài liệu' },
      { label: 'Music', vi: 'Nhạc', href: '/admin/music', icon: Music, keywords: 'quản lý nhạc bài hát' },
      { label: 'Music posts', vi: 'Post nhạc', href: '/admin/music-posts', icon: Music, keywords: 'music post post nền' },
      { label: 'Voice', vi: 'Vlog & Reaction', href: '/admin/voice', icon: Radio, keywords: 'vlog reaction podcast' },
      { label: 'Video categories', vi: 'Danh mục video', href: '/admin/video-categories', icon: Clapperboard, keywords: 'danh mục video' },
      { label: 'Games', vi: 'Trò chơi', href: '/admin/games', icon: Gamepad2, keywords: 'trò chơi' },
      { label: 'Stickers', vi: 'Nhãn dán', href: '/admin/stickers', icon: Sticker, keywords: 'nhãn dán quản lý nhãn dán' },
      { label: 'SEO', vi: 'SEO', href: '/admin/seo', icon: Search, keywords: 'seo tools indexnow sitemap' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    viLabel: 'Người dùng',
    hue: 'var(--n-people)',
    items: [
      { label: 'Users', vi: 'Người dùng', href: '/admin/users', icon: Users, keywords: 'người dùng quản lý users tài khoản' },
      { label: 'Reports', vi: 'Báo cáo vi phạm', href: '/admin/reports', icon: AlertTriangle, keywords: 'báo cáo vi phạm' },
      { label: 'Deletion requests', vi: 'Yêu cầu xoá TK', href: '/admin/deletion-requests', icon: UserX, keywords: 'yêu cầu xoá tài khoản' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    viLabel: 'Hệ thống',
    hue: 'var(--n-system)',
    items: [
      { label: 'Traffic', vi: 'Lượt truy cập', href: '/admin/analytics', icon: Activity, keywords: 'lượt truy cập analytics' },
      { label: 'AI analytics', vi: 'Thống kê AI', href: '/admin/ai-analytics', icon: Sparkles, keywords: 'ai chat analytics thống kê' },
      { label: 'AI knowledge', vi: 'Kho tri thức AI', href: '/admin/ai-knowledge', icon: Database, keywords: 'knowledge base rag tài liệu ai' },
      { label: 'Embed queue', vi: 'Hàng đợi embed', href: '/admin/embed-jobs', icon: Zap, keywords: 'embedding hàng đợi' },
      { label: 'Infrastructure', vi: 'Hạ tầng', href: '/admin/ha-tang', icon: Server, keywords: 'hạ tầng vps gpu máy nhà' },
      { label: 'Voice studio', vi: 'Xưởng giọng', href: '/admin/xuong-giong', icon: Mic, keywords: 'xưởng giọng thu âm train tts' },
      { label: 'System stats', vi: 'Thống kê hệ thống', href: '/admin/stats', icon: BarChart3, keywords: 'thống kê hệ thống' },
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
