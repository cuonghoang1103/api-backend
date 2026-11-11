'use client';

import LandingBipRail from './LandingBipRail';

/**
 * Home header strip (02/11/2026).
 *
 * The brand / language / theme / sign-in row that used to live here moved into
 * the site-wide top bar (`components/layout/nav/SiteNav.tsx`), which now shows
 * on "/" too — the home page needs the same menus as every other page, and two
 * stacked bars with the same buttons read as a mistake.
 *
 * What stays is the robot rail. Its scene rises ~3.6rem above the rail line on
 * desktop, so the empty `landing-header-stage` keeps that much room below the
 * fixed nav for the robot to walk in (see `.landing-header-stage` in
 * globals.css). The strip is no longer sticky: the fixed nav already is.
 */
export default function LandingHeader() {
  return (
    <header className="landing-header landing-header--under-nav">
      <div className="landing-header-stage" aria-hidden />
      <LandingBipRail />
    </header>
  );
}
