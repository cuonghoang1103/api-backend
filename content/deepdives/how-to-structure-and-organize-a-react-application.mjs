/**
 * Deep Dive #6 — React structure.
 *
 * Prose in the sibling `.md` (same reason as #1–#5: dozens of fenced blocks).
 *
 * HOW IT WAS MEASURED. Lab in `scratchpad/react-lab/` (harness.mjs + 01..07),
 * **react 19.2.8 / react-dom 19.2.8 / jsdom 29.1.1 / Node 22.21.0**. Real
 * component trees mounted with `createRoot`, updates driven through real DOM
 * events, everything wrapped in `act()` from 'react'. Render counts come from a
 * counter called in each component body — the same technique the article hands
 * to the reader. Setup notes for whoever re-runs it:
 *   · Node 22's `globalThis.navigator` is a GETTER — assigning it throws, use
 *     `Object.defineProperty`.
 *   · `root.unmount()` is an update too: not wrapping it in `act()` produces
 *     exactly one "not wrapped in act" warning per unmount. That is where those
 *     warnings came from, NOT from the event dispatch.
 *   · Set `IS_REACT_ACT_ENVIRONMENT` before importing react.
 *
 * THREE THINGS THE RUNNING REFUTED — all three are in the article's last
 * section, and the first is the valuable one:
 *   1. **"Barrel files bloat your bundle."** FALSE for side-effect-free modules:
 *      49 B via a deep import and 49 B via a barrel re-exporting 27 KB of unused
 *      code — byte-identical. The cost is entirely top-level side effects: my
 *      first version built the arrays with `Array.from(...)` in module scope and
 *      the barrel DID retain them (192 B). Same rule as `sideEffects: false` in
 *      the webpack article, arriving from the other direction.
 *   2. My first `key` test read back its own write: I set `input.value` directly
 *      and then asserted on `input.value`. React 19's value tracker means a
 *      direct assignment never fires `onChange`, so component state never
 *      changed and BOTH key modes "lost" the value. Rewritten with a button that
 *      increments its own state, the difference showed immediately.
 *      (If you ever do need to type into a controlled input from a test, call the
 *      native setter: `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,
 *      'value').set.call(el, v)` then dispatch an `input` event — demo 05 does.)
 *   3. The `act()` warnings were the unmount, not the events. See above.
 *
 * Two corrections to received wisdom, both measured, both stated in the article:
 * `memo` does NOT protect a context consumer (ReadsUser re-rendered once with
 * memo when only `theme` changed), and `useMemo` does NOT prevent renders
 * (3 renders / 0 recomputations). The summary table near the end is the
 * six-way comparison: 5 → 3 → 2 → 1 → 1 → 0 components re-rendered.
 *
 * The "when not to restructure" section says plainly that this site is Next.js
 * with the app router, so the `features/` question is largely settled by the
 * file-system router and most of this guide's CSS-level advice does not appear
 * in it directly. Keep that honesty.
 *
 * Related: [[feedback_verify_the_checker_before_the_content]] — three of the
 * mistakes above were the instrument, not React.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./how-to-structure-and-organize-a-react-application.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'how-to-structure-and-organize-a-react-application',
  title: 'How to Structure and Organize a React Application',
  summary:
    'Folder trees are the least important part of the answer. The decisions that keep a React codebase workable — where state lives, what a key means, which contexts are separate, where the boundaries go — are measurable, so this guide measures them: 15 renders versus 3, and the six-way comparison that follows from it.',
  category: 'DeepDive',
  tags: ['react', 'frontend', 'architecture', 'performance', 'hooks'],
  coverEmoji: '⚛️',
  coverImageUrl: '/deepdives/react/where-state-lives.svg',
  readTimeMin: 26,
  isFeatured: false,
  trendingScore: 73,
  status: 'PUBLISHED',
  bodyMdx,
};
