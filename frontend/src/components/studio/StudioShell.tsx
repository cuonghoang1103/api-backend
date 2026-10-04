'use client';

// StudioShell — the outermost wrapper for every page in
// the /creator area. Composes the three studio layers
// (background z=0, ambient z=1, content z=10+) and the
// sticky topbar.
//
// Why this exists as a single component rather than in
// app/creator/layout.tsx directly:
// • Easier to unit-test the layering in isolation
// • Other layouts (e.g. a future "preview" mode) can
// reuse the same visual scaffolding without copying it
// • The framer-motion + framer-motion-aware hooks stay
// client-only — `app/creator/layout.tsx` can stay
// server-rendered for the auth check.

import type { CSSProperties, ReactNode } from 'react';

/**
 * Studio luôn là "phòng quay tối" (nền `bg-darkbg` cố định). Nhưng chữ đọc biến
 * chủ đề của site (`--text-primary`…): khi site đang ở theme SÁNG, chữ thành màu
 * tối trên nền tối — gần như không đọc được. Ghim bộ biến tối ngay trên khung
 * studio (04/10/2026) để /creator đúng màu ở cả hai theme.
 */
const BIEN_TOI = {
 '--bg-primary': '#18191a',
 '--bg-card': '#242526',
 '--bg-surface': '#303031',
 '--border-color': '#3e4042',
 '--text-primary': '#e4e6eb',
 '--text-secondary': '#b0b3b8',
 '--text-muted': '#8a8d91',
 colorScheme: 'dark',
} as CSSProperties;
import StudioBackground from './StudioBackground';
import StudioAmbient from './StudioAmbient';
import StudioTopbar from './StudioTopbar';

export default function StudioShell({ children }: { children: ReactNode }) {
 return (
 <div className="relative min-h-[100dvh] text-text-primary" style={BIEN_TOI}>
 {/* z=0 — background grid + amber key light + vignette */}
 <StudioBackground />
 {/* z=1 — film grain + drifting practical-light bokeh */}
 <StudioAmbient />
 {/* z=30 — sticky amber topbar. The site-wide Navbar +
 NavigationDock + FloatingAIAssistant are all hidden on
 /creator (see app/creator/layout.tsx and the path-aware
 returns in those components), so z=30 only has to beat
 the studio's own z=10 content — but we keep it above
 the studio's bg/ambient layers (z=0/1) for clarity. */}
 <StudioTopbar />
 {/* z=10 — main content. Sits below the topbar so the
 topbar can stick on top while the page scrolls under it. */}
 <main className="relative" style={{ zIndex: 10 }}>
 {children}
 </main>
 </div>
 );
}
