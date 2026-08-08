// Route-level loading state for /settings/*.
//
// This renders INSIDE settings/layout.tsx, so it only stands in for the
// content column — the sidebar and page chrome are already painted. It
// used to draw its own full-page header + tab bar (from before the layout
// existed), which double-rendered the heading during every navigation.
//
// Theme-aware: `--bg-card` / `--border-color` rather than the hardcoded
// dark values it used before, so it doesn't flash a black block on a
// light-theme page.
export default function Loading() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-48 rounded" style={{ background: 'var(--bg-surface-active)' }} />
        <div className="h-4 w-72 rounded" style={{ background: 'var(--bg-surface-hover)' }} />
      </div>

      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border p-5"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="mb-4 h-5 w-40 rounded" style={{ background: 'var(--bg-surface-active)' }} />
            <div className="space-y-3">
              <div className="h-4 w-full rounded" style={{ background: 'var(--bg-surface-hover)' }} />
              <div className="h-4 w-4/5 rounded" style={{ background: 'var(--bg-surface-hover)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
