/*DU_LIEU*/
const DU_LIEU = {
 "t0-3:kho": "$ cat postcss.config.js\nmodule.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n$ sed -n '4,11p' tailwind.config.ts\n  content: [\n    \"./src/pages/**/*.{js,ts,jsx,tsx,mdx}\",\n    \"./src/components/**/*.{js,ts,jsx,tsx,mdx}\",\n    \"./src/app/**/*.{js,ts,jsx,tsx,mdx}\",\n    // 14/11/2026: lớp màu khai trong src/lib (repos.ts huy hiệu ngôn ngữ, studio-meta.ts) trước đây KHÔNG được quét\n    // ⇒ 8 lớp không có trong CSS prod (huy hiệu Shell/Swift/C++/C#/JavaScript ở /repos mất màu; ring ở /creator).\n    \"./src/lib/**/*.{js,ts,jsx,tsx}\",\n  ],\n$ grep -n 'plugins:' tailwind.config.ts\n239: plugins: [],\n$ sed -n '1,4p' src/app/globals.css\n@import \"../../tokens.css\";\n\n@tailwind base;\n@tailwind components;\n$ grep -n -B1 -A1 'tailwindcss/typography' src/app/globals.css | head -4\n1169- * the VSCode-style code blocks. We do NOT depend on\n1170: * @tailwindcss/typography because that would force\n1171- * `.prose` colors we don't want in our dark theme.",
 "t0-3:file:pages/index.html": "<div class=\"flex items-center gap-4 p-6 text-4xl font-bold\">Xin chào</div>\n",
 "t0-3:file:input.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
 "t0-3:file:tailwind.config.js": "module.exports = { content: ['./pages/**/*.html'] };\n",
 "t0-3:sai": "$ npx tailwindcss -i input.css -o out.css 2>&1 | grep -vE '^$|rowserslist|update-browserslist|Why you should' | head -4\nRebuilding...\nwarn - No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.\nwarn - https://tailwindcss.com/docs/content-configuration\nDone in 145ms.\n$ grep -c '^\\.' out.css\n0\n$ grep -n '^\\.flex' out.css; echo \"(.flex: $(grep -c '^\\.flex {' out.css))\"\n(.flex: 0)",
 "t0-3:dung": "$ npx tailwindcss -i input.css -o out.css 2>&1 | tail -1\nDone in 121ms.\n$ grep -c '^\\.' out.css\n6\n$ grep -E '^\\.(flex|p-6|text-4xl) \\{' out.css\n.flex {\n.p-6 {\n.text-4xl {",
 "t0-3:nm": "$ npx tailwindcss -i input.css -o out.css 2>&1 | grep -vE '^$|rowserslist|update-browserslist|Why you should' | head -6\nRebuilding...\nwarn - Your `content` configuration includes a pattern which looks like it's accidentally matching all of `node_modules` and can cause serious performance issues.\nwarn - Pattern: `./**/*.js`\nwarn - See our documentation for recommendations:\nwarn - https://tailwindcss.com/docs/content-configuration#pattern-recommendations\nDone in 4048ms.\n$ find -L . -path ./node_modules -prune -o -name '*.js' -print | wc -l | sed 's/^ */tệp .js ngoài node_modules: /'\ntệp .js ngoài node_modules: 1\n$ find -L node_modules -name '*.js' | wc -l | sed 's/^ */tệp .js trong node_modules: /'\ntệp .js trong node_modules: 699\n$ for i in 1 2 3; do /usr/bin/time -p npx tailwindcss -i input.css -o out.css 2>&1 | grep real; done\nreal 6.07\nreal 4.31\nreal 5.39\n$ for i in 1 2 3; do /usr/bin/time -p npx tailwindcss -i input.css -o out.css 2>&1 | grep real; done\nreal 0.66\nreal 0.72\nreal 0.57",
 "t0-3:file:index.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"input.css\"></head>\n<body><div id=\"h\" class=\"flex items-center gap-4 p-6 text-4xl font-bold\"><span>Xin</span><span>chào</span></div></body></html>\n",
 "t0-3:file:thua.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\">\n<style>.the p { margin-top: 0; }</style></head>\n<body class=\"p-6 text-xl\"><div class=\"the bg-slate-100 p-4\"><p id=\"p\" class=\"mt-8 bg-cyan-100\">mt-8 có trong CSS — nhưng thua</p></div></body></html>\n",
 "t0-3:thuan": "$ npx tailwindcss -i input.css -o out.css 2>&1 | tail -1\nDone in 123ms.\n$ grep -A2 '^\\.mt-8 {' out.css\n.mt-8 {\n  margin-top: 2rem;\n}",
 "t0-3:v4": "$ grep -c . input.css; cat input.css\n1\n@import \"tailwindcss\";\n$ ls tailwind.config.* postcss.config.* 2>&1 | sed 's/^ls: //'\npostcss.config.*: No such file or directory\ntailwind.config.*: No such file or directory",
 "anh-twc-0-3:thuan": {
  "url": "http://127.0.0.1:20104/index.html",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#h": [
    8,
    8,
    624,
    18
   ]
  },
  "console": [],
  "ketQua": {
   "kq": "{\"display\":\"block\",\"fontSize\":\"16px\",\"rules\":[]}"
  }
 },
 "anh-twc-0-3:thua": {
  "url": "http://127.0.0.1:20104/thua.html",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#p": [
    40,
    40,
    560,
    28
   ]
  },
  "console": [],
  "ketQua": {
   "mt": "0px"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tn, br, box, two, steps, kw, c, cmp, tiers, path, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-00-3', code: 'TWC 0.3', title: 'The four moving parts, and which one breaks', sub: 'Section 0 · Lesson 0.3' };
const O = (k) => { const v = DU_LIEU[`t0-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-0-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-00-3', ten, { vp: 640, ...o });
const cat = (a, n = 92) => a.map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l));

// ── số đo (chạy thật t0-3 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/ 14/11/2026)
const SAI = doan('sai', 'grep -vE'), SAI_N = doan('sai', "grep -c '^")[0], DUNG_N = doan('dung', "grep -c '^")[0];
const NM = doan('nm', 'grep -vE'), NM_MS = +NM.find((l) => /^Done in/.test(l)).match(/(\d+)ms/)[1];
const T_NM = doan('nm', 'for i in').map((l) => +l.split(' ')[1]);
const T_OK = O('nm').split('\n').slice(-3).map((l) => +l.split(' ')[1]);
const TH = JSON.parse(A('thuan').ketQua.kq), MT = A('thua').ketQua.mt;
const gon = (x) => x.replace(/\s+|…/g, '');
if (!gon(DU_LIEU['t0-3:file:index.html']).includes(gon('<div id="h" class="flex items-center gap-4 p-6 text-4xl font-bold">')) || !gon(DU_LIEU['t0-3:file:thua.html']).includes(gon('<style>.the p { margin-top: 0; }</style>'))) throw new Error('mã hiển thị lệch');
if (SAI_N !== '0' || DUNG_N !== '6' || TH.display !== 'block' || TH.rules.length !== 0 || MT !== '0px' || !(Math.min(...T_NM) > 3 * Math.max(...T_OK))) throw new Error('số đo đổi');

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.3', t: 'The four moving parts,<br>and which one breaks', sub: 'Every Tailwind setup failure has the same symptom — "my class does nothing". Four parts, how each one breaks (measured), and the one grep that splits the problem in half',
    en: 'Lesson zero point three. Every Tailwind setup failure produces the same symptom: my class does nothing. We take the four moving parts, break each one for real, and learn the one grep that splits the problem in half.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four parts: where to scan, where to insert, the scale, who runs it</li>
    <li>What they look like in this repository (Tailwind 3.4) — and in Tailwind 4</li>
    <li>Diagnose by <b>scope</b>: one class, one file, or everything</li>
    <li>Three failures, measured: a wrong glob, no PostCSS, a lost cascade fight</li>
    <li>Why <code>plugins: []</code> is a decision — and the glob that slows every build</li></ul>`,
    en: 'Five takeaways: the four parts; what they look like in this repository and in Tailwind four; diagnosing by scope; three failures measured for real; and why an empty plugins list is a decision, plus the glob that slows every build.' },
  { t: 'The four parts (Tailwind 3)', body: tiers([
      ['search', '1 · content — WHERE to scan', 'glob patterns; matching files are read as text. Others are invisible.'],
      ['plug', '2 · @tailwind — WHERE to insert', 'three directives in your root CSS, each replaced by generated CSS'],
      ['type', '3 · theme — the SCALE', 'what the 4 in p-4 and the 500 in text-blue-500 mean'],
      ['cpu', '4 · PostCSS — WHO runs it', 'Tailwind is a PostCSS plugin; something must call PostCSS at build time'],
    ], { th: 66, gap: 22 }) + box('All four, one symptom', 'Any of them wrong ⇒ "my class does nothing". The fix is to ask which part can produce <b>this exact</b> kind of nothing.', 'lam'),
    en: 'The four parts in Tailwind three. One, content: where to scan; files outside it are invisible. Two, the at-tailwind directives: where to insert the generated CSS. Three, the theme: the scale. Four, PostCSS: who runs it at build time. Any of them wrong gives the same symptom, so we ask which part can produce this exact kind of nothing.' },
  { t: 'The four parts in this repository', body: two(D(tn(['$ cat frontend/postcss.config.js           # part 4', ...doan('kho', 'postcss.config.js'), '$ sed -n \'1,4p\' src/app/globals.css       # part 2', ...doan('kho', "sed -n '1,4p'"), '$ grep -n \'plugins:\' tailwind.config.ts', ...doan('kho', "plugins:")].join('\n'), { fs: 15, title: 'frontend/ · 14/11/2026 (real)' })),
    D(tn(['$ sed -n \'4,11p\' tailwind.config.ts       # part 1', ...cat(doan('kho', "sed -n '4,11p'"), 64)].join('\n'), { fs: 13, wrap: 66, title: 'part 1 — content (real)' }),
      box('Read it', 'Part 3, the theme, is the other ~230 lines of <code>tailwind.config.ts</code>. Note what changed since the lesson was written: <code>globals.css</code> now starts with <code>@import "../../tokens.css";</code>, and <code>content</code> gained <code>./src/lib/**</code> on 14/11/2026.', 'lam')), 'r64'),
    en: 'The four parts in this repository. PostCSS is configured in postcss dot config, with Tailwind and autoprefixer. The three directives sit at the top of globals dot css, now after an import of tokens dot css. The content globs scan pages, components, app, and since today src lib. The theme is the rest of the config file.' },
  { t: 'Tailwind 4: the same four parts, moved', body: cmp(['Part', 'Tailwind 3 (this repo)', 'Tailwind 4 (npm today)'], [
      ['1 · where to scan', '<code>content: [ globs ]</code>', 'automatic: every file not git-ignored · <code>@source "…"</code> to add, <code>@source not "…"</code> to skip'],
      ['2 · where to insert', '<code>@tailwind base/components/utilities</code>', '<code>@import "tailwindcss";</code> (real <code>@layer</code>s inside)'],
      ['3 · the scale', '<code>theme.extend</code> in JS', '<code>@theme { --spacing: …; --color-…: … }</code> in CSS'],
      ['4 · who runs it', 'PostCSS plugin <code>tailwindcss</code>', '<code>@tailwindcss/postcss</code> · <code>/vite</code> · <code>/cli</code>'],
    ]) + two(tn(['$ cat input.css      # a whole Tailwind 4 setup', ...doan('v4', 'grep -c .').slice(1), '$ ls tailwind.config.* postcss.config.*', ...doan('v4', 'ls tailwind')].join('\n'), { fs: 15, title: 'Tailwind 4.3.5 (real)' }),
      box('Same diagnosis', 'The parts moved, the questions did not: is the file scanned? is Tailwind inserted? does the scale have the step? is the build tool running it?', 'xanh'), 'r64'),
    en: 'Tailwind four keeps the same four parts but moves them. Scanning is automatic, every file not git-ignored, with at-source to add or skip paths. One import line inserts everything. The scale lives in CSS, inside at-theme. And the runner is a separate package for PostCSS, Vite or the command line. A whole setup is one line, with no config files. The questions stay the same.' },
  { t: 'Diagnose by scope', body: cmp(['What you see', 'Which part', 'Next step'], [
      ['<b>one</b> class broken, others in the same file work', 'none of 1–4', 'typo · built name (0.1) · losing a conflict (Ch. 3)'],
      ['<b>every</b> class in <b>one file</b> broken', '1 · content', 'is the path inside a glob? a new top-level folder?'],
      ['<b>everything, everywhere</b>, no CSS at all', '2 or 4', 'root CSS not imported, or PostCSS never ran — check Network'],
      ['the rule <b>is</b> in the CSS, the element ignores it', 'not 1–4: cascade', 'specificity / later rule (Ch. 7, 10) — not <code>!important</code> yet'],
      ['works in dev, broken in production', '1 · content', 'a path only reachable in dev; prod scans once with the real globs'],
    ]),
    en: 'Diagnose by scope. One class broken while others work: not a setup problem; it is a typo, a built name, or a lost conflict. Every class in one file: content. Everything everywhere, no CSS at all: the directives or PostCSS. The rule is in the CSS but ignored: the cascade. Works in dev but not in production: content again.' },
  { t: 'Measured: a content glob that matches nothing', body: two(D(tn(['$ cat tailwind.config.js', DU_LIEU['t0-3:file:tailwind.config.js'] ? '' : '', "module.exports = { content: ['./src/**/*.html'] };   // the page is in pages/", '$ npx tailwindcss -i input.css -o out.css', ...SAI, "$ grep -c '^\\.' out.css", SAI_N].filter(Boolean).join('\n'), { fs: 14, wrap: 70, title: 'Tailwind 3.4.19 (real)' }),
      tn(["$ # content: ['./pages/**/*.html']", '$ npx tailwindcss -i input.css -o out.css', ...doan('dung', 'npx tailwindcss'), "$ grep -c '^\\.' out.css", DUNG_N, ...doan('dung', 'grep -E')].join('\n'), { fs: 14, title: 'fixed glob (real)' })),
    box('Read it', `A near-empty output is the clearest signal there is: <b>${SAI_N}</b> utility rules, and Tailwind 3 even warns <i>No utility classes were detected</i>. Point the glob at the right folder: <b>${DUNG_N}</b>. One command, no browser needed. (The lesson text said 2; 3.4.19 emits 0.)`, 'lam'), 'r64'),
    en: 'Measured: a content glob that matches nothing. The page sits in pages, the glob points at src. Tailwind three warns that no utility classes were detected, and the output has zero utility rules. Point the glob at pages: six rules, including flex, p six and text four xl. One command, no browser.' },
  { t: 'Measured: PostCSS never ran', body: two(D(html(`<link rel="stylesheet" href="input.css">
<div id="h" class="flex items-center gap-4
     p-6 text-4xl font-bold">…</div>`, { sm: false, hl: [1] }),
      tn(['# the browser received the RAW input.css:', ...DU_LIEU['t0-3:file:input.css'].trim().split('\n'), '# Chromium · rules it understood / computed style', `cssRules: ${TH.rules.length}`, `display: ${TH.display}   font-size: ${TH.fontSize}`].join('\n'), { fs: 15, title: 'Chromium (real)' })),
    D(B('thuan', { url: 'index.html — CSS never built', h: 110, w: 470 }),
      box('Read it', '<code>@tailwind</code> is not CSS — it is a placeholder for the build step. Unprocessed, the browser drops it: <b>0 rules</b>, so <code>flex</code>, <code>text-4xl</code>… do nothing <b>everywhere</b>. That is part 2 or 4. Check the Network tab: is a built stylesheet loading, and does it contain <code>.flex</code>?', 'do2')), 'r64'),
    en: 'Measured: PostCSS never ran. The page links the raw input file. The at-tailwind lines are not CSS, they are placeholders for the build step, so Chromium drops them: zero rules. The div is a plain block with sixteen-pixel text. Everything, everywhere, does nothing: that is part two or part four.' },
  { t: 'Measured: the rule exists, and loses', body: two(D(html(`<link rel="stylesheet" href="out.css">
<style>.the p { margin-top: 0; }</style>
<div class="the bg-slate-100 p-4">
  <p id="p" class="mt-8 bg-cyan-100">…</p>
</div>`, { sm: false, hl: [2, 4] }),
      tn(["$ grep -A2 '^\\.mt-8 {' out.css", ...doan('thuan', 'grep -A2'), '# Chromium · getComputedStyle(#p).marginTop', MT].join('\n'), { fs: 16, title: 'built CSS + Chromium (real)' })),
    D(B('thua', { url: 'thua.html', h: 130, w: 470 }),
      box('Read it', '<code>.mt-8</code> <b>is</b> in the built CSS. It loses: <code>.the p</code> (one class + one element) is more specific than <code>.mt-8</code> (one class). Not a setup problem at all — a cascade problem (Ch. 7, 10). <code>!important</code> here would hide the real cause.', 'lam')), 'r64'),
    en: 'Measured: the rule exists and loses. mt eight is right there in the built CSS, two rem. But a hand-written rule, dot the p, has one class and one element, more specific than one class. Chromium measures zero margin. This is not a setup problem at all; it is the cascade. Reaching for important would hide the real cause.' },
  { t: 'One grep splits the whole table', body: path([{ t: 'class does nothing', s: 'symptom' }, { t: 'grep built CSS', s: 'is the rule there?', on: true }, { t: 'absent', s: 'never generated', mau: '#c0392b' }, { t: 'parts 1 · 2 · 4', s: 'scan · insert · run', mau: '#c0392b' }], { nhan: ['', 'no', ''] }) +
      path([{ t: 'grep built CSS', s: 'is the rule there?', on: true }, { t: 'present', s: 'generated', mau: '#1f8a3b' }, { t: 'lost the cascade', s: 'specificity / order', mau: '#1f8a3b' }, { t: 'Ch. 3 · 7 · 10', s: 'not !important yet', mau: '#1f8a3b' }], { nhan: ['yes', '', ''] }) +
      box('One command', 'If <code>.text-4xl</code> is <b>not</b> in the output file, it was never generated (part 1, 2 or 4). If it <b>is</b> there and the element ignores it, it lost a cascade fight. One grep halves the search.', 'xanh'),
    en: 'One grep splits the whole table. Search the built CSS for the rule. Absent means it was never generated: scan, insert or run, parts one, two or four. Present but ignored means it lost a cascade fight: chapters three, seven and ten. One command halves the search.' },
  { t: 'plugins: [] is a decision', body: two(D(tn(['$ grep -n \'plugins:\' tailwind.config.ts', ...doan('kho', 'plugins:'), '$ grep -n -B1 -A1 \'tailwindcss/typography\' src/app/globals.css', ...doan('kho', 'typography')].join('\n'), { fs: 15, wrap: 64, title: 'frontend/ (real)' })),
    D(box('Why it is empty', '<code>@tailwindcss/typography</code> is the most-installed Tailwind plugin, and it ships opinionated <code>.prose</code> <b>colours</b> along with typography. In a custom dark theme you would fight those colours everywhere — so the team wrote its own <code>.rich-content</code> rules instead.', 'lam'),
      box('The pattern worth copying', 'Not "never use plugins" — but <b>write the reason next to the code</b>, so the next person does not "helpfully" install it and quietly break the theme.', 'xanh')), 'r64'),
    en: 'plugins, empty, is a decision. The comment in globals dot css says why: the typography plugin ships its own prose colours, which would fight this site\'s dark theme, so the team wrote its own rules instead. The pattern worth copying is writing the reason next to the code.' },
  { t: 'Trap: a glob that matches node_modules', body: two(D(tn(["$ # content: ['./**/*.{html,js}']    \"to be safe\"", '$ npx tailwindcss -i input.css -o out.css', ...cat(NM.filter((l) => !/^Rebuilding/.test(l)), 78), ...doan('nm', 'ngoài node_modules'), ...doan('nm', 'trong node_modules')].join('\n'), { fs: 13, wrap: 80, title: 'Tailwind 3.4.19 (real)' })),
    D(meter([['./**/*.{html,js}', Math.round(T_NM.reduce((a, b) => a + b) / T_NM.length * 100) / 100, '#c0392b'], ['./pages/**/*.html', Math.round(T_OK.reduce((a, b) => a + b) / T_OK.length * 100) / 100, '#1f8a3b']], { don: 's', nhan: 170, w: 430, fs: 16, rh: 54 }),
      box('Read it', `One stray <code>**</code> pulls ${doan('nm', 'trong node_modules')[0].match(/(\d+)$/)[1]} files of <code>node_modules</code> into every build: ${NM_MS} ms instead of ~100 ms (wall time incl. npx, 3 runs each, on the course machine). Need classes from one package? Add <b>that</b> package's path, never the whole folder.`, 'do2')), 'r64'),
    en: 'A trap: widening the glob to be safe. Two stars over every js file also matches node modules: Tailwind three warns about it, and the build reads seven hundred extra files. On the course machine a build went from well under a second to four to six seconds. If you need classes from one package, add that package\'s path, never the whole folder.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('content (globs)', 'v3: the files that are scanned'), kw('@source', 'v4: add or skip a path'),
      kw('@tailwind / @import', 'where generated CSS is inserted'), kw('theme / @theme', 'the scale'),
      kw('PostCSS', 'the build step that runs the plugin'), kw('Diagnose by scope', 'one class · one file · everything'),
      kw('Built-CSS grep', 'absent = never generated'), kw('Specificity', 'why a present rule can still lose'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: content globs; at-source; the at-tailwind directives and the import line; theme and at-theme; PostCSS; diagnosing by scope; the built-CSS grep; and specificity.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Point ${c('content')} at the wrong folder; read the warning and count rules; fix it`,
      `Link the raw ${c('input.css')} in a page; count ${c('document.styleSheets[0].cssRules')}`,
      `Add ${c('.the p { margin-top: 0 }')} and watch ${c('mt-8')} lose; explain with specificity`,
      `Try ${c('./**/*.js')}: read the warning, time the build, then narrow it`,
    ]), box('Keep these', '<ul><li>Four parts: scan · insert · scale · run</li><li>Diagnose by scope</li><li>grep the built CSS first</li><li>Present but ignored = cascade</li><li>Never glob node_modules</li></ul>', 'lam'), ''),
    en: 'Your turn: break the glob and fix it; serve the raw input file and count the rules; make mt eight lose to a more specific rule; and time a build with a glob that matches node modules. Keep: four parts, diagnose by scope, grep the built CSS first.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Tailwind actually is', bai: '0.3' }, S);
