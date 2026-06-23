'use client';

// StudioAmbient — the second visual layer (z=1) of the
// /creator area. Sits ABOVE the background and BELOW the
// content (z=10+). Two pieces:
//
// 1. A film-grain overlay across the whole viewport —
// gives the studio that "shooting on film" texture
// without an actual <canvas>.
// 2. A pair of slowly-drifting amber bokeh dots near the
// bottom-right — mimics out-of-focus practical lights in
// a real studio. The drift is a CSS transform-only loop
// (animate-aurora-drift-slow) so it stays GPU-friendly
// and never causes layout thrash.
//
// Both decorations are pointer-events:none + aria-hidden
// so they never interfere with the editor.

export default function StudioAmbient() {
 return (
 <div
 className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden film-grain"
 style={{ zIndex: 1 }}
 aria-hidden="true"
 >
 {/* Two drifting "practical light" bokeh dots. Position
 is fixed (top/right) so the user sees the same warm
 pool of light regardless of scroll position. */}
 <div
 className="absolute animate-aurora-drift-slow"
 style={{
 top: '60%',
 right: '8%',
 width: '420px',
 height: '420px',
 background:
 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.05) 35%, transparent 65%)',
 borderRadius: '50%',
 filter: 'blur(8px)',
 }}
 />
 <div
 className="absolute animate-aurora-drift-slower"
 style={{
 top: '75%',
 right: '20%',
 width: '320px',
 height: '320px',
 background:
 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 60%)',
 borderRadius: '50%',
 filter: 'blur(10px)',
 }}
 />
 </div>
 );
}
