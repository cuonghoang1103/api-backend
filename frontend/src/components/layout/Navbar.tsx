'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import {
  Home, BookOpen, FolderOpen, Music, MessageCircle,
  User, LogOut, Settings, ChevronDown, KeyRound,
  Globe, ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal';

const TOP_NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/music', label: 'Music', icon: Music },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user: backendUser, isAuthenticated: isBackendAuth } = useAuthStore();
  const { getTotalItems, openDrawer } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [locale, setLocale] = useState('en');

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
  if (isAuthPage) return null;

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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'h-16 bg-[#0d0f18]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
            : 'h-16 bg-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <img
                src="/images/avatar.png"
                alt="CuongHoang"
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-neon-violet/30 group-hover:ring-neon-violet/60 transition-all"
              />
              <span className="font-heading font-bold text-sm text-text-primary hidden sm:block group-hover:text-neon-violet transition-colors">
                CuongHoang
              </span>
            </Link>

            {/* Center: 5 core nav links — iOS Cyber Dock style */}
            <div className="hidden sm:flex items-center gap-0.5">
              {TOP_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[13px] font-bold transition-all duration-200 group ${
                      isActive
                        ? 'text-[#0ea5e9]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                    }`}
                  >
                    <link.icon className={`w-3.5 h-3.5 shrink-0 transition-all ${
                      isActive ? 'drop-shadow-[0_0_6px_#0ea5e9]' : ''
                    }`} />
                    <span>{link.label}</span>
                    {/* Subtle dot indicator — no heavy glow underline */}
                    {isActive && (
                      <motion.div
                        layoutId="top-nav-indicator"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#0ea5e9', opacity: 0.7 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
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
                    {displayUser?.image ? (
                      <img src={displayUser.image} alt={displayUser.name || 'User'} className="w-6 h-6 rounded-lg object-cover" />
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
                          <p className="text-sm font-medium text-text-primary">{displayUser?.name || displayUser?.username}</p>
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
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40
        bg-[#0d0f18]/90 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="flex items-center justify-around px-2 py-2">
          {TOP_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-neon-violet' : 'text-text-muted'
                }`}>
                <link.icon className="w-4 h-4" />
                <span className="text-[9px] font-medium">{link.label}</span>
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
    </div>
  );
}
