/**
 * node-01-5 — Node.js · Chapter 1 · Lesson 1.5 "Modules: CommonJS vs ES Modules" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: s01-javascript.mjs › nodejs-1-5-module. Output THẬT: that/c1cjs/*, that/c1esm/*, that/c1/{tla,dirname-esm,dynamic-import,detect-demo,module-errors}.
 * KHÁC bài web (theo output thật Node 22.23.3): require() một ES module CHẠY ĐƯỢC (trừ khi có top-level await); .js có import, không khai "type" ⇒ Node tự nhận ra ES module.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, cot, box, kw, bang, ma, ra, js, term } from './_node-chung.mjs';

export const deck = { key: 'node-01-5', code: 'NODE 1.5', title: 'Modules: CommonJS vs ES Modules', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', CAM = '#e08a1e', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const THAT = new URL('file:///Users/admin/Documents/video-bai-giang/src/khung/node/that/');
const nguon = (f) => readFileSync(new URL(f, THAT), 'utf8').replace(/\s+$/, '');

/* Cây quyết định (SVG). */
const cay = () => {
  const o = (x, y, w, h, t, m, co = 23) => `<rect data-k="cay" x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${m}12" stroke="${m}" stroke-width="3"/><text x="${x + w / 2}" y="${y + h / 2 + 8}" text-anchor="middle" font-size="${co}" font-weight="800" fill="${m}">${t}</text>`;
  const n = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#475569" stroke-width="3" marker-end="url(#m15)"/>`;
  const c = (x, y, t) => `<text x="${x}" y="${y}" font-size="21" font-weight="700" fill="#475569">${t}</text>`;
  return `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial"><defs><marker id="m15" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#475569"/></marker></defs>
${o(380, 4, 350, 62, 'Which extension?', LAM)}
${o(10, 150, 220, 62, 'ES module', NODE)}${o(255, 150, 220, 62, 'CommonJS', CAM)}${o(530, 150, 520, 62, 'Nearest package.json: "type"?', LAM)}
${o(400, 264, 220, 62, 'ES module', NODE)}${o(660, 264, 220, 62, 'CommonJS', CAM)}${o(900, 264, 200, 62, 'None: read code', TIM, 22)}
${n(440, 66, 130, 148)}${n(520, 66, 365, 148)}${n(620, 66, 790, 148)}
${n(650, 212, 520, 262)}${n(780, 212, 770, 262)}${n(920, 212, 1000, 262)}
${c(240, 98, '.mjs')}${c(372, 112, '.cjs')}${c(725, 100, '.js')}${c(462, 244, '"module"')}${c(790, 244, '"commonjs"')}${c(992, 230, 'none')}</svg>`;
};

export const slides = lamDeck({ chuong: 'Chapter 1 — JavaScript Foundations for Backend', bai: '1.5' }, [
  { cover: true, t: 'Modules: CommonJS<br>vs ES Modules', sub: 'Two systems, one Node.<br>Know which file you are in.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why Node has <b>two</b> module systems</li>
<li><code class="i">require</code> and <code class="i">import</code>, side by side</li>
<li>How Node decides what a file is</li>
<li>The classic errors, and what really happens on <b>Node 22</b></li>
<li>Which one to choose</li>
</ul>` },

  { t: 'Why modules? And why two systems?', to: true, giua: true, body: two(cot(box('Module', 'One file with its own private scope. It shares only what it <b>exports</b>.', 'xanh'), box('Why', 'Without modules, every name in one giant file collides.', '')), cot(box('CommonJS: the original', '<code class="i">require</code>, <code class="i">module.exports</code>. Node has used it since the start.', 'lam'), box('ES Modules: the standard', '<code class="i">import</code>, <code class="i">export</code>. Browsers and Node both speak it.', 'xanh'))) },

  { t: 'Side by side', body: two(cot(`<div class="tcap" style="font-size:20px">CommonJS · math.cjs + use-math.cjs</div>`, js(nguon('c1cjs/math.cjs'), { sm: true, hl: [4] }), js(nguon('c1cjs/use-math.cjs'), { sm: true, hl: [1] }), term(ra('c1cjs/use-math', 1, 3), { sm: true, title: 'real output', hl: [3] })), cot(`<div class="tcap" style="font-size:20px">ES Modules · math.mjs + use-math.mjs</div>`, js(nguon('c1esm/math.mjs'), { sm: true, hl: [1] }), js(nguon('c1esm/use-math.mjs'), { sm: true, hl: [1, 6] }), term(ra('c1esm/use-math', 1, 4), { sm: true, title: 'real output', hl: [3, 4] }))) },

  { t: 'Two differences you see right away', to: true, giua: true, body: bang(['', 'CommonJS', 'ES Modules'], [
    ['<code class="i">__dirname</code>', 'Available', 'undefined'],
    ['<code class="i">await</code> at top level', 'SyntaxError', 'Works'],
  ], { co: 26 }) + term(ra('c1/tla', 8, 8), { title: 'real output of tla.cjs: const x = await Promise.resolve(...)', hl: [1] }) },

  { t: 'Getting __dirname back in ESM', giua: true, body: `${js(ma('c1/dirname-esm'), { hl: [4, 6] })}${term(ra('c1/dirname-esm', 2, 3), { title: 'real output' })}
${box('On Node 22', '<code class="i">import.meta.dirname</code> gives the same thing in one word. You will still see the long form everywhere.', 'xanh')}
${box('Term', `${kw('__dirname', 'the folder of the current file')}`, 'lam')}` },

  { t: 'How Node decides what a file is', giua: true, body: `${cay()}
${box('Rule', 'The extension wins first. For <code class="i">.js</code>, Node walks up to the <b>nearest</b> package.json.', 'xanh')}` },

  { t: 'Proof: five files, real runs', to: true, giua: true, body: `${term(ra('c1/detect-demo'), { title: 'real output: each file prints which system it ran in', hl: [4, 5] })}
${term(ra('c1/module-errors', 1, 2), { title: 'a .js file using import, with no "type" anywhere' })}
${box('Node 22 detail', 'With no <code class="i">"type"</code> at all, Node reads the code: <code class="i">import</code> means ES module. Do not rely on it. Set the field.', 'xanh')}` },

  { t: 'The classic errors', giua: true, body: `${term(ra('c1/module-errors', 3, 8), { title: 'real output, Node 22' })}
${bang(['Error', 'Fix'], [
    ['Cannot use import statement', 'Add <code class="i">"type": "module"</code> or use <code class="i">.mjs</code>'],
    ['require is not defined', 'Use <code class="i">import</code>, or rename to <code class="i">.cjs</code>'],
    ['Cannot find module ./math', 'ES Modules need the extension: <code class="i">./math.mjs</code>'],
  ], { co: 22 })}` },

  { t: 'A module runs once, then it is cached', giua: true, body: two(cot(js(nguon('c1cjs/counter.cjs'), { sm: true }), js(nguon('c1cjs/use-counter.cjs'), { sm: true, hl: [1, 2] })), cot(term(ra('c1cjs/use-counter', 2, 4), { title: 'real output', hl: [1, 3] }), box('Read it', 'Two <code class="i">require</code> calls, but "loading" prints <b>once</b>. Both names get the same object.', 'xanh'))) + box('Why you care', 'This is how one database client gets shared by the whole app: put it in a module and import it everywhere.', 'lam') },

  { t: 'import is static. import() is dynamic.', to: true, giua: true, body: `${js(ma('c1/dynamic-import'), { hl: [4] })}${term(ra('c1/dynamic-import'), { title: 'real output' })}
${box('Rule', 'A normal <code class="i">import</code> is resolved <b>before</b> the file runs, so it cannot sit inside an <code class="i">if</code>. Need it later? <code class="i">await import(\'…\')</code>.', 'xanh')}` },

  { t: 'Mixing the two: what Node 22 really does', giua: true, body: `${term(ra('c1/module-errors', 9, 16).replace(/ The requested module.*/, ' …').replace(/ Use import\(\) instead.*/, ' …'), { title: 'real output, Node 22.23 · long lines cut with …' })}
${bang(['From', 'To', 'Result'], [
    ['ES module', 'CommonJS', 'Yes: safest as a <b>default</b> import'],
    ['CommonJS', 'ES module', 'Yes on Node 22, <b>unless</b> it uses top-level await'],
  ], { co: 21 })}
${box('Old advice', 'Older guides say require can never load ESM. That was true before Node 22.12. Some packages still say "ESM only".', '')}` },

  { t: 'Which one should you choose?', to: true, giua: true, body: two(cot(box('New code: ES Modules', 'The language standard. Works in browsers and Node. Top-level await.', 'xanh'), box('CommonJS', 'You must <b>read</b> it: old packages and tutorials are full of it. No need to write it.', 'lam')), box('This website', 'The backend sets <code class="i">"type": "module"</code>. TypeScript compiles to ESM, and maintenance scripts use await at the top level with no main() wrapper.', '')) },

  { t: 'Exercise: which system?', to: true, giua: true, body: `<ol>
<li><code class="i">server.mjs</code> in a project with <code class="i">"type": "commonjs"</code></li>
<li><code class="i">app.js</code> where the nearest package.json says <code class="i">"type": "module"</code></li>
<li><code class="i">tool.cjs</code> in that same folder</li>
</ol>
<div data-k="dapan">${box('Answers', '1. ES module: the extension wins. &nbsp; 2. ES module. &nbsp; 3. CommonJS: the extension wins.', 'xanh')}</div>` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>What does "Cannot use import statement outside a module" mean?</li>
<li>How many times does a module's top-level code run?</li>
<li>Why can't <code class="i">import './math'</code> work in an ES module?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Node treats the file as CommonJS. &nbsp; 2. Once: it is cached. &nbsp; 3. ESM needs the file extension.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>CommonJS: <code class="i">require</code>. ES Modules: <code class="i">import</code></li>
<li><code class="i">.mjs</code> and <code class="i">.cjs</code> win. <code class="i">.js</code> follows the nearest package.json</li>
<li>ESM: no <code class="i">__dirname</code>, top-level await, extension required</li>
<li>Modules run once and are cached</li>
<li>New code: ES Modules</li>
</ul>
${box('Next', 'Chapter 2 — Inside the Node.js runtime.', 'lam')}` },
]);
