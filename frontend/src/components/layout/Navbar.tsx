'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useMessagingStore } from '@/store/messagingStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import NotificationDropdown from '@/components/social/NotificationDropdown';
import UserSearchBox from '@/components/social/UserSearchBox';
import {
 Home, BookOpen, FolderOpen, Music, MessageCircle, Sparkles, TrendingUp,
 User, UserCircle, LogOut, Settings, ChevronDown, KeyRound,
 Globe, ShoppingBag, GraduationCap, Bell, Clapperboard, NotebookPen,
} from 'lucide-react';
import { toast } from 'sonner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal';

const TOP_NAV_LINKS = [
 { href: '/', label: 'Home', icon: Home },
 { href: '/academy', label: 'Academy', icon: GraduationCap },
 { href: '/about', label: 'About', icon: User },
 { href: '/blog', label: 'Blog', icon: BookOpen },
 { href: '/projects', label: 'Projects', icon: FolderOpen },
 { href: '/notes', label: 'Notes', icon: NotebookPen, authOnly: true },
 // Content Studio — admin-only. Filtered out at render
 // time unless the verified admin check passes. Distinct
 // amber accent vs the violet used everywhere else.
 { href: '/creator', label: 'Studio', icon: Clapperboard, adminOnly: true },
 { href: '/tech-trends', label: 'Tech Trends', icon: TrendingUp },
 { href: '/music', label: 'Music', icon: Music },
 { href: '/messages', label: 'Messages', icon: MessageCircle, authOnly: true },
 { href: '/chat', label: 'AI Chat', icon: Sparkles },
];

// Facebook Messenger bubble — official-style lightning chat icon.
function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 2C9.4 2 2.5 8.6 2.5 16.7c0 4.7 2.3 8.9 5.9 11.7.2.2.4.4.4.7v3.5c0 .4.4.7.8.5l3.9-2.2c.2-.1.4-.1.6-.1 1.3.4 2.6.6 4 .6 8.6 0 15.5-6.6 15.5-14.7S26.6 2 18 2zm1.2 19.1l-4.1-4.4-7.4 4.4 8.1-8.6 4.2 4.4 7.3-4.4-8.1 8.6z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user: backendUser, isAuthenticated: isBackendAuth } = useAuthStore();
  const { getTotalItems, openDrawer } = useCartStore();
  const unreadMessages = useMessagingStore((s) => s.unreadTotal);
  const initMessaging = useMessagingStore((s) => s.init);
  const disconnectMessaging = useMessagingStore((s) => s.shutdown);
  const unreadNotifications = useNotificationStore((s) => s.unreadCount);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Start the socket listener for real-time in-app notifications.
  // This is idempotent — re-renders are no-ops.
  useNotificationSocket();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [locale, setLocale] = useState('en');

  // iOS-dock state for the top nav links. When the cursor is over
  // the nav row we expand the labels and run a magnify wave across
  // the icons — same paradigm as the left sidebar.
  const [topNavHoveredIdx, setTopNavHoveredIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const match = document.cookie.match(/locale=(\w+)/);
    setLocale(match && (match[1] === 'vi' || match[1] === 'en') ? match[1] : 'en');
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setUserMenuOpen(false); }, [pathname]);

  // ── Admin verification ──────────────────────────────────────────────────
  const [verifiedAdmin, setVerifiedAdmin] = useState(false);

  const verifyAdmin = useCallback(async () => {
    let cachedAdmin = false;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const user = JSON.parse(stored);
          cachedAdmin = (user?.roles || []).some(
            (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN',
          );
          if (cachedAdmin) setVerifiedAdmin(true);
        }
      } catch {}
    }
    try {
      const res = await fetch('/api/auth/admin-check', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const isAdmin = (data.data?.roles ?? []).some(
          (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN',
        );
        setVerifiedAdmin(isAdmin);
      } else {
        setVerifiedAdmin(cachedAdmin);
      }
    } catch {
      setVerifiedAdmin(cachedAdmin);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    verifyAdmin();
  }, [mounted, verifyAdmin]);

  useEffect(() => {
    if (!mounted) return;
    const handler = (e: Event) => {
      const { action, roles, role } = (e as CustomEvent<{ action?: string; role?: string; roles?: string[] }>).detail ?? {};
      const isAdmin = role === 'ADMIN' || (roles ?? []).some(
        (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN',
      );
      if (action === 'login' || action === 'role-updated' || isAdmin) {
        setTimeout(verifyAdmin, 150);
      }
    };
    window.addEventListener('auth-changed', handler);
    window.addEventListener('auth-updated', handler as EventListener);
    return () => {
      window.removeEventListener('auth-changed', handler);
      window.removeEventListener('auth-updated', handler as EventListener);
    };
  }, [mounted, verifyAdmin]);

  // ── Auth state ──────────────────────────────────────────────────────────
  const isAuthenticated = mounted && (isBackendAuth || !!session);
  const displayUser = mounted
    ? ((isBackendAuth ? backendUser : session?.user) as any)
    : null;
  const isAdmin = mounted && verifiedAdmin;

  // Connect messaging socket as soon as the user is authenticated so
  // the unread badge updates in real time and works on every page.
  useEffect(() => {
    if (!mounted) return;
    if (isAuthenticated) {
      initMessaging();
    } else {
      disconnectMessaging();
    }
  }, [mounted, isAuthenticated, initMessaging, disconnectMessaging]);

  // Periodically refresh the unread count in case socket events miss.
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    let cancelled = false;
    const tick = async () => {
      try {
        await useMessagingStore.getState().refreshUnread();
      } catch {}
    };
    tick();
    const id = window.setInterval(() => { if (!cancelled) tick(); }, 30000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, [mounted, isAuthenticated]);

  const switchLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(newLocale);
    window.dispatchEvent(new Event('locale-changed'));
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    useAuthStore.getState().logout();
    try { await signOut({ redirect: false }); } catch {}
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

 const isAuthPage = pathname === '/login' || pathname === '/register';
 // /creator (Content Studio) is a full-screen workspace with
 // its own amber-accent topbar. Hide the site-wide Navbar
 // there so it doesn't sit on top of the studio topbar
 // (z-40 > z-20) and clip the first row of editor controls.
 const isStudioPage = pathname?.startsWith('/creator') ?? false;
 if (isAuthPage || isStudioPage) return null;

  const contactItems = [
    { href: 'tel:+84399360938', icon: 'phone' },
    { href: 'https://zalo.me/0399360938', icon: 'zalo' },
    { href: 'mailto:cuongthaihnhe176322@gmail.com', icon: 'mail' },
    { href: 'https://www.facebook.com/CuongHoangswit/', icon: 'fb' },
  ];

  return (
    <div suppressHydrationWarning>
      {/* ── Top Navbar ───────────────────────────────────────── */}
      <nav
        className={`fixed top-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'h-16 bg-[#0d0f18]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'h-16 bg-transparent'
        }`}
        style={{ left: 'var(--dock-shift, 0px)' }}
      >
        <div className="h-full pl-28 pr-28 flex items-center justify-between gap-2">

            {/* Left: Logo (avatar + wordmark) — pulled in past
                the screen edge so the row never overlaps the
                floating iOS dock toggle on the left, even
                when the dock is pinned open. */}
            <Link href="/" className="flex items-center gap-2.5 ml-8 shrink-0 group">
              <img
                src="/images/avatar.png"
                alt="CuongHoang"
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-neon-violet/30 group-hover:ring-neon-violet/60 transition-all"
              />
              <span className="font-heading font-bold text-sm text-text-primary hidden sm:block group-hover:text-neon-violet transition-colors">
                CuongHoang
              </span>
            </Link>

            {/* People search (global) — additive; sits between the
                logo and the center nav links. */}
            <div className="ml-2 shrink-0">
              <UserSearchBox />
            </div>

            {/* Center: nav links — icons only, no labels. */}
            <div className="hidden sm:flex items-center ml-1">
              {TOP_NAV_LINKS.filter((l) => {
 if (l.adminOnly) return isAdmin;
 if (l.authOnly) return isAuthenticated;
 return true;
 }).map((link, idx) => {
                const isActive = pathname === link.href ||
                  (link.href === '/messages' && pathname?.startsWith('/messages'));
                const isMessages = link.href === '/messages';
                return (
                  <TopNavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                    isActive={isActive}
                    isMessages={isMessages}
                    isHovered={topNavHoveredIdx === idx}
                    onHover={() => setTopNavHoveredIdx(idx)}
                    onLeave={() => {
                      if (topNavHoveredIdx === idx) setTopNavHoveredIdx(null);
                    }}
                    unreadCount={unreadMessages}
                    showUnread={isMessages && isAuthenticated && mounted}
                  />
                );
              })}
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-1.5">

              {/* Contact icons */}
              <div className="hidden lg:flex items-center gap-0.5 mr-1">
                {contactItems.map(({ href, icon }) => {
                  const icons: Record<string, React.ReactNode> = {
                    phone: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.05h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
                    zalo: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.5.92 4.79 2.45 6.55L2 22l3.55-2.45A9.96 9.96 0 0012 20c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.27 14.14c-.24.67-1.41 1.24-1.96 1.32-.53.08-1.03.11-1.47-.13-.43-.24-.67-.53-.93-.86-.23-.3-.48-.64-.68-.9-.12-.15-.14-.26-.11-.42.05-.28.24-.55.65-.72.78-.33 1.38-.27 1.88.16.58.5 1.15 1.01 1.73 1.51.37.32.74.43 1.2.31.44-.12.82-.37 1.19-.68.25-.21.44-.37.62-.5.14-.1.25-.18.35-.23.13-.08.27-.13.43-.13h.23c.21-.01.29-.09.34-.2l.01-.03c.06-.18.05-.45-.03-.67-.04-.11-.09-.22-.15-.32l-.09-.15c-.1-.17-.21-.34-.33-.5-.12-.16-.25-.31-.39-.46-.15-.15-.3-.29-.46-.42-.16-.13-.34-.25-.52-.35-.17-.1-.34-.19-.52-.26-.16-.06-.32-.11-.49-.15l-.48-.1-.48-.07c-.16-.02-.32-.04-.48-.04l-.48-.01-.48.02-.48.06-.48.09-.47.15-.47.21c-.15.08-.3.16-.44.25-.14.09-.28.19-.41.3-.13.11-.25.22-.37.34-.12.12-.23.24-.33.37-.11.13-.21.26-.3.4-.09.14-.17.28-.25.42-.08.14-.14.29-.2.44-.06.15-.11.3-.15.45-.04.15-.08.3-.1.45-.02.15-.04.3-.05.45v.48c.01.16.03.32.06.48.03.16.07.32.12.48l.09.47.15.47c.05.15.12.3.18.45.07.15.14.29.22.43.08.14.17.28.27.41.09.13.19.25.3.37l.33.33.18.15.2.14c.14.09.29.17.44.24.15.07.31.13.47.19l.47.12.48.09.48.06.48.03h.48c.16 0 .32-.02.48-.04l.48-.07.48-.1.48-.15c.16-.05.32-.11.47-.18l.47-.21c.15-.08.3-.16.44-.25.14-.09.28-.19.41-.3.13-.11.25-.22.37-.34.12-.12.23-.24.33-.37.11-.13.21-.26.3-.4.09-.14.17-.28.25-.42.08-.14.14-.29.2-.44.06-.15.11-.3.15-.45.04-.15.08-.3.1-.45.02-.15.04-.3.05-.45v-.48c0-.16-.01-.32-.03-.48l-.06-.48c-.03-.16-.07-.32-.12-.48l-.09-.47-.15-.47c-.05-.15-.12-.3-.18-.44-.07-.14-.14-.29-.22-.42-.08-.14-.17-.27-.26-.4-.1-.13-.2-.25-.31-.37-.11-.11-.23-.22-.35-.32-.12-.1-.25-.2-.38-.29-.13-.09-.26-.17-.4-.25-.14-.08-.28-.15-.42-.21-.14-.06-.29-.12-.44-.17l-.45-.12-.47-.09-.47-.06-.48-.03h-.48c-.16 0-.32.02-.48.04l-.48.07-.48.1-.48.15c-.16.05-.32.11-.47.18l-.47.21c-.15.08-.3.16-.44.25-.14.09-.28.19-.41.3-.13.11-.25.22-.37.34-.12.12-.23.24-.33.37-.11.13-.21.26-.3.4-.09.14-.17.28-.25.42-.08.14-.14.29-.2.44-.06.15-.11.3-.15.45-.04.15-.08.3-.1.45-.02.15-.04.3-.05.45v.48c0 .16.01.32.02.48.02.16.04.32.07.48l.09.48.12.48c.05.16.11.32.17.48.07.16.14.31.22.47l.26.46c.09.15.19.3.29.44.1.14.21.28.32.41.11.13.23.26.35.38.12.12.25.24.38.35.13.11.27.22.41.32.14.1.29.19.44.28l.46.23.48.18.48.15.48.11.48.07.48.03h.48c.16 0 .32-.01.48-.03l.48-.07.48-.11.48-.15.48-.18.48-.23.48-.28.48-.32c.16-.11.32-.23.47-.35.15-.13.3-.26.44-.4.14-.14.28-.28.41-.43.13-.15.26-.3.38-.46.12-.16.23-.32.34-.48.1-.16.2-.33.29-.5l.24-.51c.07-.17.13-.35.18-.52.05-.18.09-.35.13-.53.03-.18.06-.36.08-.53.02-.18.03-.36.03-.53v-.53c0-.18-.01-.36-.03-.53l-.06-.53c-.03-.18-.07-.35-.12-.53-.05-.17-.11-.35-.17-.52-.07-.17-.14-.34-.22-.51-.08-.16-.17-.33-.26-.49-.09-.16-.19-.32-.29-.48-.1-.15-.21-.3-.32-.45-.11-.14-.23-.29-.35-.42-.12-.13-.25-.26-.38-.39-.13-.12-.27-.24-.41-.35-.14-.11-.29-.21-.44-.31-.15-.09-.31-.18-.47-.26-.16-.08-.33-.15-.5-.21-.17-.06-.34-.12-.52-.16-.18-.05-.36-.08-.53-.11-.18-.03-.36-.05-.53-.06-.18-.01-.36-.02-.53-.02-.18 0-.36.01-.53.03l-.53.06c-.18.03-.35.07-.53.12-.17.05-.35.11-.52.17-.17.06-.34.13-.5.21-.17.08-.33.16-.5.25-.16.09-.32.19-.47.29-.15.1-.3.21-.44.33-.14.11-.28.23-.41.36-.13.13-.26.26-.38.39-.12.13-.23.27-.34.41-.11.14-.21.29-.31.44-.09.15-.18.3-.26.45-.08.15-.15.31-.22.46-.07.16-.13.31-.18.47-.05.16-.1.32-.13.48-.04.16-.06.32-.08.48Z"/></svg>,
                    mail: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
                    fb: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                  };
                  return (
                    <a
                      key={icon}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-all"
                      title={icon}
                    >
                      {icons[icon]}
                    </a>
                  );
                })}
              </div>

              {/* Cart */}
              <button
                onClick={openDrawer}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl
                  bg-white/[0.04] border border-white/[0.06]
                  hover:border-neon-violet/30 hover:bg-neon-violet/5 transition-all"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-text-secondary" />
                {mounted && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-violet text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-neon-violet/30">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Notification bell — only for authenticated users */}
              {isAuthenticated && mounted && (
                <button
                  ref={bellRef}
                  type="button"
                  onClick={() => {
                    setBellOpen((o) => !o);
                    if (!bellOpen) {
                      // Hydrate the notification list on first open.
                      useNotificationStore.getState().loadInitial();
                    }
                  }}
                  className="relative flex items-center justify-center w-9 h-9 rounded-xl
                    bg-white/[0.04] border border-white/[0.06]
                    hover:border-neon-violet/30 hover:bg-neon-violet/5 transition-all"
                  title="Thông báo"
                  aria-label="Notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-text-secondary" />
                  {(unreadNotifications ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-neon-fuchsia text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-neon-fuchsia/30">
                      {(unreadNotifications ?? 0) > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </button>
              )}

              <LanguageSwitcher />

              {/* User */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl
                      bg-white/[0.04] border border-white/[0.06]
                      hover:border-neon-violet/30 transition-all"
                  >
                    {displayUser?.avatarUrl ? (
                      <img src={displayUser.avatarUrl} alt={displayUser.displayName || displayUser.username || 'User'} className="w-6 h-6 rounded-lg object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 rounded-xl
                        bg-[#0d0f18]/95 backdrop-blur-xl border border-white/[0.08]
                        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                        z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-sm font-medium text-text-primary">
                            {displayUser?.displayName || displayUser?.name || displayUser?.username}
                          </p>
                          <p className="text-xs text-text-muted truncate">{displayUser?.email}</p>
                        </div>
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors">
                            <Settings className="w-4 h-4" />Admin Dashboard
                          </Link>
                        )}
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors">
                          <Globe className="w-4 h-4" />Dashboard
                        </Link>
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors">
                          <UserCircle className="w-4 h-4" />Profile
                        </Link>
                        <Link href="/settings/notifications" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors">
                          <Settings className="w-4 h-4" />Notification sounds
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            setChangePasswordOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                          Change password
                        </button>
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" />Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1.5">
                  <Link href="/login"
                    className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
                    Login
                  </Link>
                  <Link href="/register"
                    className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-neon-indigo to-neon-violet text-white rounded-lg hover:opacity-90 transition-opacity">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        className="sm:hidden fixed bottom-0 right-0 z-40
        bg-[#0d0f18]/90 backdrop-blur-xl border-t border-white/[0.06] transition-[left] duration-300"
        style={{ left: 'var(--dock-shift, 0px)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {TOP_NAV_LINKS.filter((l) => {
 if (l.adminOnly) return isAdmin;
 if (l.authOnly) return isAuthenticated;
 return true;
 }).map((link) => {
            const isActive = pathname === link.href ||
              (link.href === '/messages' && pathname?.startsWith('/messages'));
            const isMessages = link.href === '/messages';
            return (
              <Link key={link.href} href={link.href}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-neon-violet' : 'text-text-muted'
                }`}>
                {isMessages ? (
                  <MessengerIcon className="w-4 h-4" />
                ) : (
                  <link.icon className="w-4 h-4" />
                )}
                <span className="text-[9px] font-medium">{link.label}</span>
                {isMessages && isAuthenticated && mounted && (unreadMessages ?? 0) > 0 && (
                  <span className="absolute top-0 right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {(unreadMessages ?? 0) > 99 ? '99+' : unreadMessages}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Change password modal — opened from user menu */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />

      {/* Notification dropdown — portal so it escapes stacking contexts */}
      {isAuthenticated && mounted && (
        <NotificationDropdown
          anchor={bellRef.current}
          open={bellOpen}
          onClose={() => setBellOpen(false)}
        />
      )}
    </div>
  );
}

// ── Single top-nav link (icon-only) ──────────────────────────────
//
// Just an icon pill. No label, no magnify. The row is a
// 36x36 fixed-size square; the icon inside it is fixed-size
// 16x16. Hovering the row only changes the icon pill's
// background color and the icon's text color. The icon
// NEVER scales or moves.
function TopNavLink({
  href,
  label,
  icon: Icon,
  isActive,
  isMessages,
  isHovered,
  onHover,
  onLeave,
  unreadCount,
  showUnread,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  isMessages: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  unreadCount: number;
  showUnread: boolean;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link
        href={href}
        title={label}
        aria-label={label}
        className={cn(
          'relative flex items-center justify-center w-9 h-9 mx-0.5 rounded-xl select-none',
          'transition-colors duration-150',
        )}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0
            transition-all duration-150"
          style={{
            backgroundColor: isActive
              ? 'rgba(14,165,233,0.15)'
              : isHovered
                ? 'rgba(139,92,246,0.10)'
                : 'rgba(255,255,255,0.04)',
            boxShadow: isActive
              ? '0 0 12px rgba(14,165,233,0.30)'
              : isHovered
                ? '0 0 8px rgba(139,92,246,0.18)'
                : 'none',
          }}
        >
          {isMessages ? (
            <MessengerIcon
              className={cn(
                'shrink-0 transition-colors duration-150 w-4 h-4',
                isActive ? 'text-[#0ea5e9]' : isHovered ? 'text-text-primary' : 'text-text-muted',
              )}
            />
          ) : (
            <Icon
              className={cn(
                'shrink-0 transition-colors duration-150 w-4 h-4',
                isActive ? 'text-[#0ea5e9]' : isHovered ? 'text-text-primary' : 'text-text-muted',
              )}
            />
          )}
        </div>

        {/* Unread badge — Messenger-style. */}
        {showUnread && (
          <MessengerUnreadBadge count={unreadCount} />
        )}

        {/* Active dot */}
        {isActive && (
          <div
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            style={{ background: '#0ea5e9', opacity: 0.7 }}
          />
        )}
      </Link>

      {/* Facebook-style floating tooltip — appears below the icon
          on hover, with a small arrow (▼) pointing up at the icon.
          Same paradigm as the Facebook chat list (image 2 from
          the user). Tooltip is wrapped in AnimatePresence so it
          fades in / out with a tiny translate. */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="topnav-tip"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.32, 0.94, 0.6, 1] }}
            className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
          >
            <div className="relative">
              {/* Tooltip body — Facebook chat-list style. */}
              <div
                className="px-2.5 py-1 rounded-md
                  bg-black/90 text-white text-[12px] font-semibold
                  whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                  border border-white/10"
              >
                {label}
              </div>
              {/* Upward arrow — a small rotated square that
                  points at the icon. The 2px shift keeps the
                  tip glued to the tooltip body so the rotation
                  doesn't leave a hairline gap. */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2
                  w-2 h-2 rotate-45
                  bg-black/90 border-l border-t border-white/10"
                style={{ marginTop: '1px' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Tiny utility — duplicated from lib/utils to avoid an extra import
// (the dock file already imports plenty; we keep this self-contained).
function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

// ── Messenger-style unread badge (top navbar) ─────────────────────
// Numeric count is hidden when zero (no badge shown). A bounce
// animation runs every time the displayed text changes, so the
// badge "pops" when a new message arrives — same feel as the
// iOS / Facebook Messenger app icon. The key prop on the inner
// motion.span is what triggers the spring re-mount.
function MessengerUnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  const text = count > 99 ? '99+' : String(count);
  return (
    <motion.span
      key={text}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: [0.4, 1.25, 1], opacity: 1 }}
      transition={{
        duration: 0.45,
        times: [0, 0.55, 1],
        ease: [0.32, 0.94, 0.6, 1],
      }}
      className="absolute -top-1 -right-1.5 inline-flex items-center justify-center
        min-w-[18px] h-[18px] px-1.5 rounded-full
        text-white text-[10px] font-bold
        bg-[#ef4444]
        ring-2 ring-[#0d0f18]
        shadow-[0_0_10px_rgba(239,68,68,0.55),0_2px_4px_rgba(0,0,0,0.4)]
        tabular-nums"
      style={{ fontVariantNumeric: 'tabular-nums' }}
      title={`${count} unread messages`}
      aria-label={`${count} unread messages`}
    >
      {text}
    </motion.span>
  );
}
