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
 Languages,
 Wand2,
 Plus,
 Shield,
 Film,
 LayoutDashboard,
 CalendarRange,
 Lightbulb,
 KanbanSquare,
 ListChecks,
 GraduationCap,
} from 'lucide-react';
import { laAppDesktop } from '@/components/sach-hoc/moiTruong';
import css from './studioTopbar.module.css';
import { useStudioStore } from '@/store/studioStore';
import { useStudioT, type StudioKey } from '@/lib/studio-i18n';

interface CreatorNavItem {
 labelKey: StudioKey;
 href: string;
 icon: React.ComponentType<{ className?: string }>;
}

const CREATOR_NAV: CreatorNavItem[] = [
 { labelKey: 'navDashboard', href: '/creator', icon: LayoutDashboard },
 // Hai lối vào AI (04/10/2026) — đứng ngay sau Tổng quan vì đó là việc chính:
 // quay bài giảng từ đúng nội dung khoá học, và biến một ý tưởng thành kịch bản.
 { labelKey: 'navFilmCourse', href: '/creator/quay-khoa-hoc', icon: GraduationCap },
 { labelKey: 'navAiIdeas', href: '/creator/y-tuong-ai', icon: Wand2 },
 { labelKey: 'navIdeas', href: '/creator/ideas', icon: Lightbulb },
 { labelKey: 'navPipeline', href: '/creator/pipeline', icon: KanbanSquare },
 { labelKey: 'navCalendar', href: '/creator/calendar', icon: CalendarRange },
 { labelKey: 'navList', href: '/creator/list', icon: ListChecks },
 ];

export default function StudioTopbar() {
 const { t, lang, setLang, doiDuocNgonNgu } = useStudioT();
 const pathname = usePathname();
 const router = useRouter();
 const openCreateModal = useStudioStore((s) => s.openCreateModal);
 const openSeriesModal = useStudioStore((s) => s.openSeriesModal);
 const [user, setUser] = useState<{ name: string } | null>(null);
 // Trong app desktop: không có trang /admin của web, và `/api/auth/admin-check`
 // là route của Next (app chạy ở app://…) — bỏ cả nút lẫn lời gọi.
 const [trongApp, setTrongApp] = useState(false);
 useEffect(() => { setTrongApp(laAppDesktop()); }, []);

 // We don't need a hard auth gate here — middleware + the
 // creator layout already verified the admin cookie. But
 // we do want to show the user's name on the pill, so we
 // pull it from the same admin-check endpoint the admin
 // panel uses.
 useEffect(() => {
 if (laAppDesktop()) return;
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
 className={`${css.bar} sticky top-0 z-30 border-b border-studio-500/20 bg-darkcard`}
 >
 <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
 {/* Brand — amber gradient chip + name. */}
 <Link
 href="/creator"
 className="flex items-center gap-2.5 shrink-0 group"
 >
 <div className="w-9 h-9 rounded-xl bg-studio-gradient flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_24px_rgba(245,158,11,0.55)] transition-shadow">
 <Clapperboard className="w-5 h-5 text-studio-950" strokeWidth={2.4} />
 </div>
 <div className={`${css.thuongHieu} flex-col leading-tight`}>
 <span className="font-heading font-bold text-sm text-text-primary">
 {t('studioName')}
 </span>
 <span className="text-[10px] uppercase tracking-[0.18em] text-studio-400">
 cuongthai.com / creator
 </span>
 </div>
 </Link>

 {/* In-area nav. Active route gets amber pill; inactive
 routes are dim. Mobile: icons only. Desktop: icon + label. */}
 <nav className="flex items-center gap-1 min-w-0 overflow-x-auto">
 {CREATOR_NAV.map((item) => {
 const isActive =
 pathname === item.href ||
 (item.href !== '/creator' && pathname?.startsWith(item.href));
 const Icon = item.icon;
 return (
 <Link
 key={item.href}
 href={item.href}
 title={t(item.labelKey)}
 className={`group flex items-center gap-1.5 px-2.5 h-9 shrink-0 rounded-lg text-sm font-medium transition-all ${
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
 <span className={css.nhanNav}>{t(item.labelKey)}</span>
 </Link>
 );
 })}
 </nav>

 <div className="ml-auto flex items-center gap-2 shrink-0">
 {/* Back to admin panel — quick escape hatch. */}
 {!trongApp && <Link
 href="/admin"
 title={t('backToAdmin')}
 className="flex items-center gap-1.5 px-2.5 h-9 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 <span className={css.nhanPhu}>{t('backToAdmin')}</span>
 </Link>}

 {/* New project CTA — primary amber. Opens the global
 CreateProjectModal via studioStore so this works from
 any /creator/* route (including the per-project editor,
 where navigating to /creator would lose the user's
 in-flight edits). */}
 <button
 onClick={() => openCreateModal()}
 title={t('newProject')}
 className="flex items-center gap-1.5 px-3 h-9 whitespace-nowrap rounded-lg bg-studio-gradient text-studio-950 font-semibold text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.45)] transition-shadow"
 >
 <Plus className="w-4 h-4" strokeWidth={2.6} />
 <span className={css.nhanChinh}>{t('newProject')}</span>
 </button>

 {/* Series generator — the bulk sibling of "New project".
     Sits next to it because the two answer the same question
     at different scales: one video, or a whole subject. */}
 <button
 type="button"
 onClick={() => openSeriesModal()}
 title={t('seriesGenTitle')}
 className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-studio-500/40 text-studio-300 hover:bg-studio-500/10 hover:border-studio-500/60 font-semibold text-sm transition-colors"
 >
 <Wand2 className="w-4 h-4" />
 <span className={css.nhanPhu}>{t('seriesGen')}</span>
 </button>

 {/* Language toggle. Writes the SITE locale, not a
     studio-only flag — switching here and then navigating
     to /admin should keep the language you chose. */}
 {doiDuocNgonNgu && <button
 type="button"
 onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
 title={t('languageLabel')}
 aria-label={t(lang === 'vi' ? 'switchToEn' : 'switchToVi')}
 className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg border border-darkborder text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
 >
 <Languages className="w-3.5 h-3.5 text-studio-400" />
 <span className="uppercase tracking-wider">{lang}</span>
 </button>}

 {/* Role pill — only shows on >=md. */}
 <div className={`${css.nguoi} items-center gap-1.5 pl-2.5 ml-1 border-l border-darkborder text-xs text-text-secondary`}>
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
