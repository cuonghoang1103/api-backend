/**
 * Deep Dive #7 — Redux and React.
 *
 * Prose in the sibling `.md` (same reason as #1–#6).
 *
 * HOW IT WAS MEASURED. Lab in `scratchpad/redux-lab/` (01..06, plus `size/` for
 * the bundle numbers), **@reduxjs/toolkit 2.12.0 / react-redux 9.3.0 /
 * redux 5.0.1 / react 19.2.8 / jsdom 29.1.1**. Reducers dispatched directly in
 * Node; components mounted with the same jsdom harness as article #6 (copied
 * from `scratchpad/react-lab/harness.mjs`); render counts from a counter in each
 * component body; bundle sizes from esbuild with react marked external.
 * Timings ran in Node, not in the preview pane — safe, unlike browser timings.
 *
 * FIVE THINGS THE RUNNING REFUTED — all five are in the article's last section:
 *   1. **"Redux Toolkit removes a lot of boilerplate."** Same two-action feature:
 *      classic **14 lines / 500 chars** vs createSlice **13 lines / 370 chars**.
 *      ONE line. The real benefits are correctness (no action-type constants to
 *      desync, no hand-written immutable updates, dev guards on) — not volume.
 *      Do not restore a "much less code" claim; the measurement contradicts it.
 *   2. Mutating state outside a reducer is NOT caught by the immutability
 *      middleware on the next dispatch — RTK freezes state with immer, so it
 *      throws `TypeError: Cannot assign to read only property` AT the offending
 *      line, before any dispatch. Better guarantee, different mechanism.
 *   3. `.unwrap()` throws a plain serialised **Object**, not an Error —
 *      `e instanceof Error === false`. Check `e.message`.
 *   4. Three dispatches in one handler: store notified **3×**, component
 *      rendered **1×** (react-redux is on useSyncExternalStore, React batches).
 *      Store notifications and renders are different counters.
 *   5. "A createSelector taking an argument thrashes its one-slot cache" is
 *      obsolete on RTK 2: 6 calls / 3 ids → **3** computations with the default
 *      `weakMapMemoize`, 6 only with an explicit `lruMemoize`.
 *
 * Other numbers worth not breaking if you edit the body:
 *   · useSelector render scope: ui/toggle → ReadsTheme ×1 only; cart/addItem →
 *     ReadsCount ×1 only. Extends the six-row table in article #6.
 *   · selector returning a new object: 3 unrelated dispatches → 3 renders;
 *     shallowEqual or createSelector → 0.
 *   · createSelector: 5 calls unchanged state → 1 compute; 3 dispatches to a
 *     DIFFERENT slice → 0; 3 that change the slice → 3.
 *   · RTK Query: 3 components / 1 fetch, 4th mount / 0 fetches, invalidatesTags
 *     / 1 refetch. Listener middleware: 4 keystrokes → effect completed once.
 *   · Replay: 4 actions = 147 B of JSON → identical state (this is what makes
 *     the serializability check matter, and it is the payoff for the constraints).
 *   · Bundle: useState 176 B gzip · 9-line store 249 B · RTK+react-redux
 *     10,670 B. Dispatch: 0.3 µs prod, 1.8 µs with dev checks.
 *
 * The "when you don't need Redux" section says plainly that most apps don't,
 * that server state belongs in a query library, and that THIS SITE does not use
 * Redux (Next.js app router; server state in server components, client state
 * local or in a few contexts). Keep that — it is the same honesty as the GraphQL
 * and webpack articles.
 *
 * Related: [[feedback_verify_the_checker_before_the_content]].
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./how-to-use-redux-and-react.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'how-to-use-redux-and-react',
  title: 'How to Use Redux and React',
  summary:
    'What a store actually is, what Redux Toolkit actually saves you (one line — measured), and what it costs: 10.7 KB gzipped and 0.3 µs per dispatch. With the selector trap that re-renders on every dispatch in your app, and the 147-byte action log that reproduces a bug exactly.',
  category: 'DeepDive',
  tags: ['redux', 'react', 'state-management', 'frontend', 'rtk'],
  coverEmoji: '🧰',
  coverImageUrl: '/deepdives/redux/dispatch-cycle.svg',
  readTimeMin: 26,
  isFeatured: false,
  trendingScore: 69,
  status: 'PUBLISHED',
  bodyMdx,
};
