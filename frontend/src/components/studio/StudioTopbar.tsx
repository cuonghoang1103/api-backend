'use client';

// StudioTopbar — the sticky amber-accent top bar for the
// /creator area. Lives inside the creator layout (so it
// sits below the global Navbar, not on top of it). Shows
// the area title, a back-to-admin link, a quick "New
// project" CTA, and a status pill summarising the
// current user's role.
//
// The bar is a thin client component — it doesn't own any
// state besides the auth check. All real actions go
// through `Link` (navigation) or `router.push`.

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
 ArrowLeft,
 Clapperboard,
 Plus,
 Shield,
 Film,
 LayoutDashboard,
 CalendarRange,
 Lightbulb,
 KanbanSquare,
 ListChecks,
} from 'lucide-react';

interface CreatorNavItem {
 label: string;
 href: string;
 icon: React.ComponentType<{ className?: string }>;
}

const CREATOR_NAV: CreatorNavItem[] = [
 { label: 'Dashboard', href: '/creator', icon: LayoutDashboard },
 { label: 'Idea Bank', href: '/creator/ideas', icon: Lightbulb },
 { label: 'Pipeline', href: '/creator/pipeline', icon: KanbanSquare },
 { label: 'Calendar', href: '/creator/calendar', icon: CalendarRange },
 { label: 'List', href: '/creator/list', icon: ListChecks },
 ];

export default function StudioTopbar() {
 const pathname = usePathname();
 const router = useRouter();
 const [user, setUser] = useState<{ name: string } | null>(null);

 // We don't need a hard auth gate here — middleware + the
 // creator layout already verified the admin cookie. But
 // we do want to show the user's name on the pill, so we
 // pull it from the same admin-check endpoint the admin
 // panel uses.
 useEffect(() => {
 let cancelled = false;
 (async () => {
 try {
 const res = await fetch('/api/auth/admin-check', {
 credentials: 'include',
 cache: 'no-store',
 });
 if (!res.ok) return;
 const data = await res.json();
 if (cancelled) return;
 const u = data?.data;
 setUser({ name: u?.fullName || u?.username || 'Admin' });
 } catch {
 // Non-fatal — pill will just show "Admin".
 }
 })();
 return () => {
 cancelled = true;
 };
 }, []);

 return (
 <motion.header
 initial={{ y: -10, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
 className="sticky top-0 z-20 border-b border-studio-500/20 bg-darkcard/70 backdrop-blur-xl"
 >
 <div className="flex items-center gap-4 px-4 sm:px-6 h-14">
 {/* Brand — amber gradient chip + name. */}
 <Link
 href="/creator"
 className="flex items-center gap-2.5 shrink-0 group"
 >
 <div className="w-9 h-9 rounded-xl bg-studio-gradient flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_24px_rgba(245,158,11,0.55)] transition-shadow">
 <Clapperboard className="w-5 h-5 text-studio-950" strokeWidth={2.4} />
 </div>
 <div className="hidden sm:flex flex-col leading-tight">
 <span className="font-heading font-bold text-sm text-text-primary">
 Content Studio
 </span>
 <span className="text-[10px] uppercase tracking-[0.18em] text-studio-400">
 cuonghoang.dev / creator
 </span>
 </div>
 </Link>

 {/* In-area nav. Active route gets amber pill; inactive
 routes are dim. Mobile: icons only. Desktop: icon + label. */}
 <nav className="flex items-center gap-1 ml-2 overflow-x-auto">
 {CREATOR_NAV.map((item) => {
 const isActive =
 pathname === item.href ||
 (item.href !== '/creator' && pathname?.startsWith(item.href));
 const Icon = item.icon;
 return (
 <Link
 key={item.href}
 href={item.href}
 className={`group flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition-all ${
 isActive
 ? 'bg-studio-500/15 text-studio-300 ring-1 ring-studio-500/30'
 : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
 }`}
 >
 <Icon
 className={`w-4 h-4 ${
 isActive ? 'text-studio-400' : 'text-text-muted group-hover:text-text-secondary'
 }`}
 />
 <span className="hidden md:inline whitespace-nowrap">{item.label}</span>
 </Link>
 );
 })}
 </nav>

 <div className="ml-auto flex items-center gap-2">
 {/* Back to admin panel — quick escape hatch. */}
 <Link
 href="/admin"
 className="hidden sm:flex items-center gap-1.5 px-2.5 h-9 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 <span>Admin</span>
 </Link>

 {/* New project CTA — primary amber. */}
 <button
 onClick={() => router.push('/creator?new=1')}
 className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-studio-gradient text-studio-950 font-semibold text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] transition-shadow"
 >
 <Plus className="w-4 h-4" strokeWidth={2.6} />
 <span className="hidden sm:inline">New project</span>
 </button>

 {/* Role pill — only shows on >=md. */}
 <div className="hidden md:flex items-center gap-1.5 pl-2.5 ml-1 border-l border-darkborder text-xs text-text-secondary">
 <Shield className="w-3.5 h-3.5 text-studio-400" />
 <span className="max-w-[120px] truncate">{user?.name ?? 'Admin'}</span>
 </div>
 </div>
 </div>

 {/* Thin amber progress line under the bar — purely
 decorative, makes the studio area feel framed. */}
 <div
 className="h-px w-full"
 style={{
 background:
 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.5) 50%, transparent 100%)',
 }}
 />
 </motion.header>
 );
}
