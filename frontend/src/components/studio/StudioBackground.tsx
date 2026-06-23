'use client';

// StudioBackground — the deepest layer (z=0) of the
// /creator area. Pure CSS, no canvas / no Framer. Three
// fixed full-viewport layers stack up:
//
// 1. Solid dark base (--bg-primary) so the area never
// shows through to the page background.
// 2. A 128x128 amber grid (.studio-grid) sitting at very
// low opacity — gives a "set floor" feel without being
// noisy.
// 3. A radial amber glow in the top-left corner that
// fades to transparent by mid-screen — the studio "key
// light" coming from off-screen.
//
// Pointer-events:none + aria-hidden so it never blocks
// the editor. Stays in place while the user scrolls
// (position:fixed).

export default function StudioBackground() {
 return (
 <div
 className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden bg-darkbg"
 style={{ zIndex: 0 }}
 aria-hidden="true"
 >
 {/* Grid floor */}
 <div className="absolute inset-0 studio-grid opacity-70" />

 {/* Key light — amber radial in the top-left */}
 <div
 className="absolute animate-projector-pulse"
 style={{
 top: '-20%',
 left: '-15%',
 width: '70vw',
 height: '70vw',
 maxWidth: '1200px',
 maxHeight: '1200px',
 background:
 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.08) 35%, transparent 65%)',
 }}
 />

 {/* Fill light — softer amber on the right, balances
 the composition so the editor in the middle is well-lit. */}
 <div
 className="absolute"
 style={{
 top: '40%',
 right: '-20%',
 width: '60vw',
 height: '60vw',
 maxWidth: '1000px',
 maxHeight: '1000px',
 background:
 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.10) 0%, transparent 60%)',
 }}
 />

 {/* Vignette to ground the page edges. */}
 <div className="absolute inset-0 vignette" />
 </div>
 );
}
