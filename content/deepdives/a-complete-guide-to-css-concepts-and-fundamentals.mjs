/**
 * Deep Dive #5 — CSS concepts and fundamentals.
 *
 * Prose in the sibling `.md` (same reason as #1–#4: ~100 fenced code blocks).
 *
 * HOW IT WAS MEASURED — worth knowing before you edit any number in the body.
 * Every value came from a lab page in `scratchpad/css-lab/` (v1 → v6, kept so
 * the runs are reproducible) served over HTTP and read back with
 * `getComputedStyle` / `getBoundingClientRect` / `elementFromPoint` in
 * **Chromium 148.0.7778.280, viewport 846×998**. A `css-lab` entry was added to
 * `.claude/launch.json` (untracked directory) because `file://` pages outside
 * the project render as static snapshots in the preview pane and cannot run JS.
 *
 * ⚠️ The measuring tab is a BACKGROUND tab. Layout numbers are trustworthy
 * there; TIMING is not — see [[feedback_claude_browser_pane_never_renders_3d]].
 * That is why the article contains no transition/animation benchmarks and says
 * so out loud. Do not "improve" it by adding timing numbers from this setup.
 *
 * SIX THINGS THE RUNNING REFUTED — all six are in the article's last section:
 *   1. `1.5em` nested 3 deep from `html{16px}` = 54px. It measured **47.25px**,
 *      because `em` compounds from the PARENT and `body` sets `font: 14px/1.6`.
 *      14 × 1.5³ = 47.25. `rem` stayed 24px at every level.
 *   2. `min-height: auto` holds a declared `height: 200px` in a 100px flex
 *      column. It does NOT — `auto` is the min-CONTENT size, so a child with one
 *      line of text shrank to 100px happily. Reproducing the real trap needed a
 *      child with 6 real lines: 134.39px in a 100px column.
 *   3. `z-index: -1` hides a child behind its parent. It does not: hit tests put
 *      it ABOVE the parent's background and BELOW the parent's in-flow text.
 *   4. My `:is()` test "disproved" the spec — actually the selector
 *      `:is(#nope, .cls) .isTest` never matched, because the test element had no
 *      `.cls`. A rule that loses and a rule that never applied look identical
 *      from the outside. After the fix it won (1-1-0 beats 0-3-0) as documented.
 *   5. Three hit tests returned `null`: `elementFromPoint` takes VIEWPORT
 *      coordinates and the growing <pre> had pushed the stage below the fold.
 *      Every hit test in the article runs after `scrollIntoView`.
 *   6. `padding: 5px; padding: var(--bad)` falls back to 5px. It falls to
 *      **0px** — invalid at computed-value time means `unset`, i.e. initial.
 *
 * One test was DROPPED rather than reported: `display: contents` gave identical
 * widths (8.43px) with and without it, because the probe child was text with no
 * intrinsic width, so being a flex item changed nothing. An inconclusive test is
 * not a finding — see [[feedback_verify_the_checker_before_the_content]].
 *
 * The "when not to reach for CSS" section says plainly that this site styles its
 * ~40 modules with Tailwind + CSS variables and that almost none of this CSS
 * appears in it directly — the value is diagnosis, not hand-written rules. Keep
 * that; an all-sell guide is the kind readers stop believing.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./a-complete-guide-to-css-concepts-and-fundamentals.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'a-complete-guide-to-css-concepts-and-fundamentals',
  title: 'A Complete Guide to CSS Concepts and Fundamentals',
  summary:
    'The five models under the properties — the box, the cascade, inheritance, normal flow and stacking — with every claim measured in a real browser: why your flex row overflows, why z-index is ignored, why a spacer div adds no space, and why a typo in var() wipes your padding instead of falling back.',
  category: 'DeepDive',
  tags: ['css', 'frontend', 'layout', 'flexbox', 'cascade'],
  coverEmoji: '🎨',
  coverImageUrl: '/deepdives/css/box-and-flow.svg',
  readTimeMin: 26,
  isFeatured: false,
  trendingScore: 71,
  status: 'PUBLISHED',
  bodyMdx,
};
