'use client';

// /creator layout — admin-gated shell for the Content
// Creator area.
//
// The middleware already redirects non-admins to /login
// before this layout runs. We do a second check here
// (fetching /api/auth/admin-check) so we can show the
// user's name in the topbar and gracefully handle a
// stale cookie — if the cookie was rotated out, we
// bounce them to /login with a redirect hint.

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Clapperboard } from 'lucide-react';
import StudioShell from '@/components/studio/StudioShell';
import CreateProjectModal from '@/components/studio/CreateProjectModal';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter();
 const pathname = usePathname();
 const [authChecked, setAuthChecked] = useState(false);

 useEffect(() => {
 let cancelled = false;
 (async () => {
 try {
 const res = await fetch('/api/auth/admin-check', {
 credentials: 'include',
 cache: 'no-store',
 });
 if (cancelled) return;
 if (res.ok) {
 setAuthChecked(true);
 return;
 }
 } catch {
 // fall through to redirect
 }
 router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
 })();
 return () => {
 cancelled = true;
 };
 }, [pathname, router]);

 // Render the loading state as the studio shell itself so
 // the warm-amber background is already in place when the
 // auth check resolves — no jarring flash from black→amber.
 if (!authChecked) {
 return (
 <div className="relative min-h-[100dvh] flex items-center justify-center bg-darkbg">
 <div className="flex flex-col items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-studio-gradient flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.45)]">
 <Clapperboard className="w-6 h-6 text-studio-950" strokeWidth={2.4} />
 </div>
 <div className="flex flex-col items-center gap-1">
 <p className="text-text-primary font-heading text-sm">Content Studio</p>
 <p className="text-text-muted text-xs">Checking access…</p>
 </div>
 <div className="w-32 h-1 bg-darkcard rounded-full overflow-hidden">
 <div
 className="h-full w-1/3 bg-studio-gradient rounded-full"
 style={{ animation: 'shimmerSweep 1.4s linear infinite' }}
 />
 </div>
 </div>
 </div>
 );
 }

 return (
 <StudioShell>
 {children}
 {/* The "New project" modal is a single global dialog
 controlled by `useStudioStore`. It lives in the layout
 (not a page) so the topbar CTA can open it from any
 /creator/* route, including the per-project editor. */}
 <CreateProjectModal />
 </StudioShell>
 );
}
