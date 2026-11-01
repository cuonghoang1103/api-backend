/** Web Foundations · deck bài 14.1 — Bản dựng production thật ra làm gì. */
import { deckWf, js, css, html, bash, term, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-14-1', code: 'WF 14.1', title: 'What a production build does', sub: 'Web Foundations · Chapter 14' };

const BG = OUT['_t14/out/bundle-grep'].split('\n');
const BG_CODE = BG.slice(0, 2).join('\n');
const BG_GREP = BG.slice(3).join('\n');

export const slides = deckWf({ chuong: 'Chapter 14 — Shipping it', bai: '14.1' }, [
  { cover: true, t: 'What a production build does', sub: 'From the files you edit to the files users download — measured on a real Vite build' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain why the files you write are <b>not</b> what you ship</li>
    <li>Run <code class="i">vite build</code> and read its report</li>
    <li>Name the four jobs: <b>bundle, minify, tree-shake, hash</b></li>
    <li>Preview the build locally before deploying</li>
    <li>Say why <code class="i">dist/</code> is never committed</li></ul>
    ${box('Why', 'Every course after this one ends with "build and deploy". Most "works on my machine" bugs live exactly here.', 'info')}` },

  { t: 'Development and production are different', giua: true, body: `${term('_t14/out/dev-vs-build', null, { title: 'measured in Chromium: the same page, two servers' })}
    ${vsd('<ul><li>Many small files, readable</li><li>Hot reload client, source maps</li><li>Fast to <b>start</b></li></ul>', '<ul><li>Few files, minified</li><li>No dev tools inside</li><li>Fast to <b>download</b></li></ul>', 'npm run dev', 'npm run build')}` },

  { t: 'The project', giua: true, body: `${js('_t14/src/main.js', null, { chi: [1, 11] })}
    ${js('_t14/src/format.js', null, { chi: [2, 4] })}
    ${box('index.html', 'Loads <code class="i">/src/style.css</code> and <code class="i">/src/main.js</code> as a module. <code class="i">format.js</code> also exports <code class="i">unusedReportGenerator</code>, which nothing imports.', 'info')}` },

  { t: 'vite build', giua: true, body: `${bash(null, 'npm run build      # = vite build')}
    ${term('_t14/out/build', null, { title: 'vite v8.3.5' })}
    ${box('Read the report', 'Three files, sizes before and after <b>gzip</b> (what the network actually carries).', 'info')}` },

  { t: 'What is inside dist/', giua: true, body: `${term('_t14/out/dist-files', null, { title: 'bytes   file' })}
    ${steps(['<code class="i">index.html</code> — rewritten to point at the hashed files', '<code class="i">assets/index-27wt_Xcd.js</code> — all JS in one bundle, name = content hash', '<code class="i">robots.txt</code> — copied as-is from <code class="i">public/</code>'])}` },

  { t: 'Minified, tree-shaken, dev code removed', giua: true, body: `${term(null, BG_CODE, { title: 'the end of the bundle' })}
    ${term(null, BG_GREP, { title: 'grep in the bundle' })}` },

  { t: 'The four jobs of a build', to: true, giua: true, body: tbl(['Job', 'What it does', 'Seen here'], [
      ['Bundle', 'many modules ⇒ few files', '6 modules ⇒ 1 JS file'],
      ['Minify', 'remove spaces, shorten names', 'formatVnd ⇒ e'],
      ['Tree-shake', 'drop exports nobody imports', 'unusedReportGenerator gone'],
      ['Hash', 'file name = fingerprint of content', 'index-27wt_Xcd.js'],
    ]) + box('Also', 'Replaces <code class="i">import.meta.env.*</code> with values and deletes <code class="i">if (import.meta.env.DEV)</code> blocks.', 'info') },

  { t: 'Why hashed file names?', giua: true, body: `${flow([{ t: 'deploy v1', s: 'index-27wt.js' }, { t: 'browser caches', s: 'for a year', mau: '#2f7d4f' }, { t: 'deploy v2', s: 'index-Q9a1.js', mau: '#b85a2b' }, { t: 'new HTML ⇒ new name', s: 'fresh download' }])}
    ${box('The deal', 'Assets can be cached "forever" because a change produces a new name. Only <code class="i">index.html</code> must never be cached long (lesson 14.3).', 'ok')}` },

  { t: 'Build traps', to: true, giua: true, body: vsd('<ul><li>Committing <code class="i">dist/</code></li><li>Testing only with <code class="i">npm run dev</code></li><li>Opening <code class="i">dist/index.html</code> by double-click (file://)</li></ul>', '<ul><li><code class="i">dist/</code> in .gitignore, build in CI/deploy</li><li><code class="i">npm run build &amp;&amp; npm run preview</code></li><li>Serve dist over HTTP</li></ul>', '✗ Trap', '✓ Instead') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>You edit source; users download the build</li>
    <li>bundle · minify · tree-shake · hash</li>
    <li>Read sizes after gzip</li>
    <li>Always preview the build before deploying</li></ul>`,
    box('Practice (20 min)', 'Create a Vite project, add an unused export and a <code class="i">DEV</code>-only log, build, and prove with <code class="i">grep</code> that both are gone.<br><br><b>Done when</b>: <code class="i">npm run preview</code> shows the page, <code class="i">dist/</code> has hashed names, and changing one line changes the JS hash but not the CSS hash.', 'ok')) },
]);
