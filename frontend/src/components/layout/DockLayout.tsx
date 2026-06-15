'use client';

import NavigationDock from './NavigationDock';

// The navigation dock is now a floating panel that hides
// itself off-screen and slides in only when the user taps
// the menu button. It does NOT shift the page content, so
// DockLayout no longer needs to reserve any left padding
// for it. The dock lives at z-68 (panel) and z-65
// (backdrop), which is above the rest of the page but
// below any modal that might need to render on top.
//
// We still keep this component as a wrapper around the
// dock so that the layout root stays symmetric with any
// future per-page dock override.
export default function DockLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationDock />
      <main className="min-h-screen w-full">
        {children}
      </main>
    </>
  );
}
