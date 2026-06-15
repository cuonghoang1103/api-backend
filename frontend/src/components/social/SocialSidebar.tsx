'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Bell,
  MessageCircle,
  Bookmark,
  User as UserIcon,
  Sparkles,
  Hash,
  Users,
  Music,
  Code2,
  GraduationCap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

interface SocialSidebarProps {
  unreadNotifications?: number;
  unreadMessages?: number;
}

/**
 * Left navigation column of the 3-column social layout.
 * Compact icon-only on the rail; expands to icon+label on hover
 * (or always-expanded on >=lg screens). Active route is highlighted
 * with the violet accent so users can see where they are at a glance.
 *
 * Items here mirror the top-level destination of the social app.
 * They are decorative; the real navigation happens in the right
 * Navbar. We keep this rail small and consistent so the centre
 * column (the feed) keeps the visual focus.
 */
export default function SocialSidebar({
  unreadNotifications = 0,
  unreadMessages = 0,
}: SocialSidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isAdmin = mounted && (user as any)?.roles?.some((r: string) =>
    ['admin', 'ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN'].includes(r)
  );

  const items = [
    { href: '/social', label: 'Home', icon: Home, exact: true },
    { href: '/social/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { href: '/chat', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
    { href: '/social/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  const explore = [
    { href: '/social/explore', label: 'Explore', icon: Hash },
    { href: '/blog', label: 'Blog', icon: Sparkles },
    { href: '/projects', label: 'Projects', icon: Code2 },
    { href: '/music', label: 'Music', icon: Music },
    { href: '/courses', label: 'Courses', icon: GraduationCap },
  ];

  return (
    <aside className="sticky top-20 self-start w-full">
      <div className="space-y-1">
        {items.map((it) => {
          const active = it.exact ? pathname === it.href : pathname?.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active ? 'bg-white/[0.06] text-text-primary' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="social-sidebar-active"
                  className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-neon-violet to-neon-indigo"
                />
              )}
              <span className="relative">
                <Icon className="h-5 w-5" />
                {typeof it.badge === 'number' && it.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold text-white bg-neon-fuchsia flex items-center justify-center">
                    {it.badge > 99 ? '99+' : it.badge}
                  </span>
                )}
              </span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
        Khám phá
      </div>
      <div className="mt-2 space-y-1">
        {explore.map((it) => {
          const active = pathname?.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                active ? 'bg-white/[0.06] text-text-primary' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>

      {mounted && isAdmin && (
        <>
          <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Quản trị
          </div>
          <div className="mt-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-yellow-400/80 hover:bg-yellow-500/10 hover:text-yellow-300 transition-all"
            >
              <Users className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}
