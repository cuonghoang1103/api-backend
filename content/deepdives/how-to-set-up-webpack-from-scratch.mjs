/**
 * Deep Dive #4 — webpack from scratch.
 *
 * Prose in the sibling `.md` (same reason as #1–#3: ~95 fenced code blocks, and
 * template-literal backticks would all need escaping).
 *
 * Every byte count, build time and error message in the body came out of a real
 * lab built in a scratch directory with **webpack 5.109.2 / webpack-cli 6.0.1 /
 * Node 22.21.0**, plus one demo against **webpack 5.90.0** (the version Next
 * 14.2.15 compiles into itself — verified with
 * `require('next/dist/compiled/webpack/webpack.js').webpack.version`). Nothing
 * was added to this repo's package.json; the site has no webpack dependency of
 * its own.
 *
 * SIX THINGS THE RUNNING REFUTED — all six are admitted in the article's last
 * section, and they are the reason it exists:
 *   1. "You need css-loader for CSS." FALSE on 5.109, where
 *      `experiments.css` defaults to `'auto'` — a bare `import './x.css'`
 *      emits main.css with no rules at all. TRUE on 5.90, which errors with
 *      `Module parse failed: Unexpected token (1:5)`. The answer is a version,
 *      not a fact, and this site's own Next build is on the old side of it.
 *   2. "Dev and prod build the same chunk graph." FALSE:
 *      `splitChunks.minSize` is 10000 in development, 20000 in production, so
 *      the lab app has 3 chunks in dev and 2 in prod. `chunkIds` also flips
 *      named → deterministic, so chunk FILENAMES differ too.
 *   3. "Deep-import lodash to help tree shaking." FALSE for lodash-es:
 *      `lodash-es/sumBy.js` and `{ sumBy } from 'lodash-es'` produced a
 *      byte-identical bundle (14133 B, same SHA-256 e04c786d…6545). The real
 *      5× cliff is `lodash` (CJS, 71321 B) vs `lodash-es` (`sideEffects:false`).
 *   4. "babel-loader gives you an ES5 bundle." FALSE — targeting `ie 11` still
 *      left 35 arrow functions and 69 const/let, because webpack's own runtime
 *      is generated AFTER loaders run. `target: ['web','es5']` takes both to 0.
 *      Transpiling node_modules too (dropping `exclude`) cost 2.7 KB + 135 ms
 *      and fixed nothing — that was my first, wrong, hypothesis.
 *   5. "Babel is a significant build cost." With `targets: 'defaults'` in 2026
 *      it cost FOUR BYTES and a time delta smaller than run-to-run noise.
 *   6. My own measuring scripts lied THREE times: (a) walking `stats.modules`
 *      double-counted concatenated modules → "prod has more modules than dev";
 *      (b) the same bug reported "105 modules duplicated across chunks" — the
 *      tell was empty `chunks` arrays; (c) `grep -c currency` hit the
 *      `currency:` key inside Intl options, not the mangled function. The
 *      trustworthy checks are bytes on disk, file hashes, and STRING LITERALS
 *      (a minifier cannot rename those). See
 *      [[feedback_verify_the_checker_before_the_content]].
 *
 * `scratchpad/svg-fit.mjs` was ALSO wrong twice while checking this article's
 * diagrams, and both were fixed there with new self-tests: it counted `&quot;`
 * as 6 characters, and it ignored `text-anchor="end"` (x is the RIGHT edge).
 *
 * The four diagrams carry measured numbers, so if you re-run the lab with a
 * different webpack version they go stale together with the prose. The
 * "when not to use webpack" section says plainly that this site runs Next and
 * should not have a webpack.config.js, and points new apps at Vite. Keep that
 * — same reason as the GraphQL article's version of it.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./how-to-set-up-webpack-from-scratch.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'how-to-set-up-webpack-from-scratch',
  title: 'How to Set Up webpack From Scratch',
  summary:
    'A bundler you can reason about: entry, output, loaders, plugins and the optimisations mode turns on behind your back — built up from an empty directory, with every byte count, build time and error message measured. Including the four things every webpack tutorial (and my own plan) got wrong.',
  category: 'DeepDive',
  tags: ['webpack', 'bundler', 'build-tools', 'javascript', 'frontend'],
  coverEmoji: '📦',
  coverImageUrl: '/deepdives/webpack/entry-to-output.svg',
  readTimeMin: 27,
  isFeatured: false,
  trendingScore: 70,
  status: 'PUBLISHED',
  bodyMdx,
};
