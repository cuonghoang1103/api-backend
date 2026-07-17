'use client';

/**
 * Isolated PREVIEW of the new landing page. This route exists only so the design
 * can be reviewed live — it does not change `/` (still the Feed), the nav, or any
 * backend. When approved, RiveLanding gets promoted to `/` and this route is
 * removed. Nothing here is wired to the Feed move or the LandingPromo backend yet.
 */
import RiveLanding from '@/components/home/landing/RiveLanding';

export default function LandingPreviewPage() {
  return (
    <div className="relative">
      <span className="fixed left-3 top-20 z-[60] rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300 backdrop-blur">
        Preview
      </span>
      <RiveLanding />
    </div>
  );
}
