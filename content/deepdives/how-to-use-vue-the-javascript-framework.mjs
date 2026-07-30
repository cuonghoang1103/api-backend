/**
 * Deep Dive #8 — Vue.
 *
 * Prose in the sibling `.md` (same reason as #1–#7).
 *
 * HOW IT WAS MEASURED. Lab in `scratchpad/vue-lab/` (01..10 plus `bench-*.mjs`
 * and `size/`), **vue 3.5.40 / @vue/compiler-sfc 3.5.40 / @vue/server-renderer
 * 3.5.40 / react 19.2.8 / jsdom 29.1.1 / node 22.21.0**. Reactivity measured with
 * `watchEffect(…, { flush: 'sync' })` counters; components mounted in jsdom with
 * the harness copied from `scratchpad/react-lab/harness.mjs` (article #6); render
 * counts from a `probe()` called inside the TEMPLATE — templates, not hand-written
 * render functions, because the compiler's PatchFlags change the runtime's
 * behaviour and a render() fn has none. Two independent counters (`probe()` and
 * the `updated` hook) agree, which is the only reason the counts are trusted.
 * DOM work counted with a real `MutationObserver`. Compiler output is genuine
 * `@vue/compiler-sfc` / `@vue/compiler-dom` output, not transcribed. Bundle bytes
 * from esbuild, minified, `NODE_ENV=production`. `ALL-OUTPUT.txt` in the lab has
 * every run.
 *
 * SIX THINGS THE RUNNING REFUTED — all six are in the article's last section:
 *   1. **"Vue 3's Proxy reactivity is faster than Vue 2's defineProperty."**
 *      BACKWARDS. Per write: defineProperty **3.2 ns** vs reactive **290 ns**
 *      (~90× slower). A bare Proxy with pass-through traps already costs 182 ns,
 *      so most of the gap is the language. Proxy bought CORRECTNESS (new keys,
 *      delete, array index/length, Map/Set) and a **17×** faster init
 *      (0.31 ms vs 5.39 ms on a 1,000-node tree) because conversion is lazy.
 *      Do not restore a "faster" claim.
 *   2. **"Never destructure a reactive object."** Only true for PRIMITIVES.
 *      Destructuring a nested object/array yields the child proxy and stays
 *      reactive (+1 effect run both times). This is why the advice confuses
 *      beginners — half their destructures work.
 *   3. **"v-model is :value + @input."** The compiled vnode has NO `value` prop:
 *      it is `onUpdate:modelValue` + the `_vModelText` runtime directive, with
 *      modifiers in a 4th slot. The directive is what handles IME composition.
 *   4. **Precompiling templates speeds up mount.** First run said 8 ms saved on a
 *      1,000-row mount while compiling both templates took 0.9 ms — impossible.
 *      Cause: both frameworks in ONE process, so the later run inherited a warm
 *      JIT. One process per variant, 7 iterations, median → difference gone
 *      (45.4 vs 41.9 ms). Keep `bench-list.mjs` per-process if you re-measure.
 *   5. **"A hydration mismatch throws away the server subtree."** `<h1>` was the
 *      same DOM node before hydration, after hydration and after a click. Vue
 *      patches text in place and warns. (That model came from React 18.)
 *   6. **"A text change rewrites one text node's value."** MutationObserver saw
 *      `childList` 1 (1 added, 1 removed) and `characterData` 0 — `el.textContent
 *      = v` replaces children per spec. One DOM op, different op.
 *
 * Other numbers worth not breaking if you edit the body:
 *   · render scope, one root state change: Vue child with unchanged prop +0,
 *     child with no props +0; React +1/+1, and +0 only with memo().
 *   · 1,000-row prepend, row render calls: Vue keyed **1**, Vue unkeyed **1001**,
 *     React plain **1001**, React+memo **1**. Vue's default == React with memo
 *     everywhere; forgetting :key costs what forgetting memo() costs.
 *   · keys: without :key the typed "xxx" ended up on the NEW row, and old <li>
 *     nodes were reused 3/3 in BOTH cases — so keys are not about node recreation.
 *   · 100 mutations in one handler → 1 render, DOM still old until the flush.
 *     Flush order measured: sync → pre → beforeUpdate → render → post → updated.
 *   · nextTick: the DOM is already current in the FIRST plain microtask after the
 *     write (Vue queues the flush at write time); a microtask queued BEFORE the
 *     write sees the old DOM. nextTick() is correct regardless of ordering.
 *   · computed: lazy (0 computes until read), 5 reads → 1 compute, and Vue 3.4+
 *     does not notify when the VALUE is unchanged (3 dep changes → 0 effect runs).
 *   · bundles gzip: @vue/reactivity alone 4,974 B · Vue runtime 21,004 B (options
 *     API off) / 24,243 B (on) · React+react-dom 60,040 B · Vue WITH the runtime
 *     template compiler 67,317 B.
 *   · SSR: HTML is SMALLER than the same data as JSON (0.66× at 1,000 rows);
 *     hydration without state transfer = 3 warnings and a visible 41 → 1.
 *   · provide(ref) → Deep +1, Middle +0, Root +0. provide(plain value) → never.
 *
 * The "when not to use Vue" section says plainly that THIS SITE is Next.js/React,
 * that the choice was really a meta-framework choice, and lists four real Vue
 * friction points (two API styles in the docs, the compiler being load-bearing,
 * template typing depending on vue-tsc, long-tail ecosystem). Keep it — same
 * honesty as the GraphQL, webpack and Redux articles.
 *
 * Related: [[feedback_verify_the_checker_before_the_content]],
 * [[feedback_verify_by_running_not_reading]].
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./how-to-use-vue-the-javascript-framework.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'how-to-use-vue-the-javascript-framework',
  title: 'How to Use Vue, the JavaScript Framework',
  summary:
    'What Vue\'s reactivity actually tracks (per property, and it is 90× slower per write than Vue 2 — measured), what the compiler really emits for v-model and v-for, and the render counts that explain the whole Vue-vs-React argument: a 1,000-row prepend costs 1 row render in Vue and 1,001 in React, and exactly 1,001 in Vue if you forget the key.',
  category: 'DeepDive',
  tags: ['vue', 'reactivity', 'frontend', 'javascript', 'components'],
  coverEmoji: '💚',
  coverImageUrl: '/deepdives/vue/reactivity-tracking.svg',
  readTimeMin: 27,
  isFeatured: false,
  trendingScore: 70,
  status: 'PUBLISHED',
  bodyMdx,
};
