'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Users, Code2, Sparkles,
  LogOut, Menu, X, ChevronRight, Shield,
  MessageSquare, BarChart3, BookOpen, ShoppingBag, Tag, Receipt, Music, GraduationCap, Database, Zap,
 CreditCard, Github, Search, TrendingUp, AlertTriangle,
 KeyRound, UsersRound, Clapperboard, Sticker,
} from 'lucide-react';

const adminNav = [
 { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
 // Content Studio — distinct amber entry in the admin
 // sidebar. Sits at the top of the nav (right below
 // Dashboard) so the creator workflow is the first thing
 // the user sees when they open the admin panel.
 { label: 'Content Studio', href: '/creator', icon: Clapperboard, accent: 'studio' as const },
 { label: 'FPT Academy LMS', href: '/admin/academy', icon: GraduationCap },
 { label: 'Quản lý Mã Code', href: '/admin/code-academy', icon: KeyRound },
 { label: 'Quan ly Bai Giang', href: '/admin/lessons', icon: BookOpen },
  { label: 'Quan ly Nhac', href: '/admin/music', icon: Music },
  { label: 'Music Post (Post nền)', href: '/admin/music-posts', icon: Music },
 { label: 'Quản lý Khoá học', href: '/admin/courses', icon: BookOpen },
 { label: 'Danh mục Khoá học', href: '/admin/course-categories', icon: Sparkles },
 { label: 'Quản lý Shop', href: '/admin/shop', icon: ShoppingBag },
 { label: 'Quản lý Mã giảm giá', href: '/admin/discounts', icon: Tag },
 { label: 'Quản lý Đơn hàng', href: '/admin/orders', icon: Receipt },
 { label: 'Đơn hàng khoá học (VNPay)', href: '/admin/course-orders', icon: CreditCard },
 { label: 'Hoc vien khoa hoc', href: '/admin/course-enrollments', icon: UsersRound },
 { label: 'Quản lý Posts', href: '/admin/posts', icon: FileText },
 { label: 'GitHub Repo Hub', href: '/admin/repos', icon: Github },
 { label: 'Quản lý Users', href: '/admin/users', icon: Users },
 { label: 'Quản lý Skills', href: '/admin/skills', icon: Code2 },
 { label: 'Quản lý Projects', href: '/admin/projects', icon: Sparkles },
 { label: 'AI Knowledge Base', href: '/admin/ai-knowledge', icon: Database },
 { label: 'AI Chat Analytics', href: '/admin/ai-analytics', icon: MessageSquare },
 { label: 'Quản lý Nhãn dán', href: '/admin/stickers', icon: Sticker },
 { label: 'Báo cáo vi phạm', href: '/admin/reports', icon: AlertTriangle },
 { label: 'Embed Queue', href: '/admin/embed-jobs', icon: Zap },
 { label: 'SEO Tools', href: '/admin/seo', icon: Search },
 { label: 'Tech Trends', href: '/admin/tech-trends', icon: TrendingUp },
 { label: 'System Stats', href: '/admin/stats', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Server-side admin verification using admin-check endpoint
  // This validates the backend_token cookie against the backend.
  // It returns user data (fullName, email) on success, redirects on failure.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/admin-check', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          const user = data.data;
          setCurrentUser({
            name: user?.fullName || user?.username || 'Admin',
            email: user?.email || '',
          });
          setAuthChecked(true);
          return;
        }
      } catch {}

      // Not admin or not logged in → redirect to login
      router.push('/login?redirect=' + encodeURIComponent(pathname));
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    router.push('/login');
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-darkbg pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-neon-violet border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh bg-darkbg pt-16">
      {/* Desktop Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 border-r border-darkborder bg-darkcard flex flex-col transition-all duration-300 hidden md:flex`}>
        <div className="p-4 border-b border-darkborder flex items-center justify-between">
          <div className={`flex items-center gap-3 overflow-hidden ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <h1 className="font-heading font-bold text-text-primary text-sm truncate">Admin Panel</h1>
                <p className="text-xs text-text-muted truncate">{currentUser?.email}</p>
              </div>
            )}
          </div>
        </div>

 <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
 {adminNav.map((item) => {
 // Studio entry uses an amber accent class set; every
 // other entry uses the default violet. `isActive` is
 // also broader for studio so visiting /creator/* keeps
 // the sidebar item highlighted.
 const isStudio = item.accent === 'studio';
 const isActive = isStudio
 ? pathname === item.href || pathname?.startsWith('/creator')
 : pathname === item.href;
 const activeBg = isStudio ? 'bg-studio-500/15 text-studio-300' : 'bg-neon-violet/15 text-neon-violet';
 const activeIcon = isStudio ? 'text-studio-400' : 'text-neon-violet';
 const activeChevron = isStudio ? 'text-studio-500/50' : 'text-neon-violet/50';
 return (
 <Link
 key={item.href}
 href={item.href}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
 isActive
 ? activeBg
 : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
 } ${!sidebarOpen && 'justify-center'}`}
 title={!sidebarOpen ? item.label : undefined}
 >
 <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? activeIcon : 'text-text-muted group-hover:text-text-secondary'}`} />
 {sidebarOpen && <span className="truncate">{item.label}</span>}
 {isActive && sidebarOpen && (
 <ChevronRight className={`w-4 h-4 ml-auto ${activeChevron}`} />
 )}
 </Link>
 );
 })}
 </nav>

        <div className="p-3 border-t border-darkborder space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all ${!sidebarOpen && 'justify-center'}`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0 text-text-muted" />
            {sidebarOpen && <span>← Về trang chủ</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-darkcard border-r border-darkborder flex flex-col">
            <div className="p-4 border-b border-darkborder flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-text-primary text-sm">Admin Panel</h1>
                  <p className="text-xs text-text-muted">{currentUser?.name}</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
 <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
 {adminNav.map((item) => {
 const isStudio = item.accent === 'studio';
 const isActive = isStudio
 ? pathname === item.href || pathname?.startsWith('/creator')
 : pathname === item.href;
 const activeBg = isStudio ? 'bg-studio-500/15 text-studio-300' : 'bg-neon-violet/15 text-neon-violet';
 return (
 <Link
 key={item.href}
 href={item.href}
 onClick={() => setMobileOpen(false)}
 className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
 isActive
 ? activeBg
 : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
 }`}
 >
 <item.icon className="w-5 h-5" />
 <span>{item.label}</span>
 </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-darkborder">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 border-b border-darkborder flex items-center justify-between bg-darkcard/50 backdrop-blur-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-text-primary text-sm">Admin Dashboard</h1>
              <p className="text-xs text-text-muted hidden sm:block">
                Chào, {currentUser?.name}!
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
