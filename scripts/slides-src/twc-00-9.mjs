/*DU_LIEU*/
const DU_LIEU = {
 "t0-9:file:input.css": "@import \"tailwindcss\";\n",
 "t0-9:file:index.html": "<!doctype html><html><head><meta charset=\"utf-8\"><style>\n.do   { color: red; }\n.xanh { color: blue; }\n</style></head><body style=\"font: 28px sans-serif; padding: 16px\">\n<p id=\"a\" class=\"do xanh\">class=\"do xanh\"</p>\n<p id=\"b\" class=\"xanh do\">class=\"xanh do\"</p>\n</body></html>\n",
 "t0-9:cli": "$ npx tailwindcss -i input.css -o out.css      # lệnh của bài hướng dẫn cũ (Tailwind 3)\n\nDone in 25ms\n$ ls node_modules/.bin | grep -i tailwind\ntailwindcss\n$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 21ms\n$ grep -c '^\\.' out.css; echo \"(lệnh đếm '^\\.' của bài cũ)\"\n0\n(lệnh đếm '^\\.' của bài cũ)\n$ grep -cE '^ *\\.[a-z]' out.css; echo \"(đếm cả dòng thụt lề)\"\n3\n(đếm cả dòng thụt lề)\n$ grep -nE '^ *\\.(flex|p-4|text-xl) \\{' out.css\n166:  .flex {\n169:  .p-4 {\n172:  .text-xl {\n$ sed -n \"$(grep -n '@layer utilities' out.css | cut -d: -f1),+4p\" out.css\n@layer utilities {\n  .flex {\n    display: flex;\n  }\n  .p-4 {",
 "t0-9:file:tailwind.config.js": "module.exports = { content: ['./index.html'] };\n",
 "t0-9:cli3": "$ npx tailwindcss -i input.css -o out.css 2>&1 | tail -1\nDone in 95ms.\n$ grep -c '^\\.' out.css\n3\n$ grep -nE '^\\.(flex|p-4|text-xl) \\{' out.css\n557:.flex {\n561:.p-4 {\n565:.text-xl {",
 "t0-9:cascade": "",
 "t0-9:suco": "$ sed -n '4,10p' tailwind.config.ts\n  content: [\n    \"./src/pages/**/*.{js,ts,jsx,tsx,mdx}\",\n    \"./src/components/**/*.{js,ts,jsx,tsx,mdx}\",\n    \"./src/app/**/*.{js,ts,jsx,tsx,mdx}\",\n    // 14/11/2026: lớp màu khai trong src/lib (repos.ts huy hiệu ngôn ngữ, studio-meta.ts) trước đây KHÔNG được quét\n    // ⇒ 8 lớp không có trong CSS prod (huy hiệu Shell/Swift/C++/C#/JavaScript ở /repos mất màu; ring ở /creator).\n    \"./src/lib/**/*.{js,ts,jsx,tsx}\",\n$ git -C .. log -1 --format='%h %ad %s' --date=short -- frontend/tailwind.config.ts | cut -c1-110\n63c4a65f7 2026-11-14 fix(web): Tailwind quét cả src/lib — 8 lớp màu của huy hiệu /repos và /creator vắng khỏi \n$ grep -n \"Shell:\" src/lib/repos.ts\n22:  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',\n$ for u in $(curl -s https://cuongthai.com/repos | grep -oE '/_next/static/css/[^\"]+\\.css' | sort -u); do curl -s https://cuongthai.com$u; done > $TMPDIR/prod.css; wc -c < $TMPDIR/prod.css | sed 's/^ */CSS của trang \\/repos hôm nay: /;s/$/ byte/'\nCSS của trang /repos hôm nay: 682349 byte\n$ for s in '.bg-lime-500\\/20' '.text-lime-300' '.border-lime-500\\/30' '.bg-sky-500\\/20'; do printf '%-22s %s\\n' \"$s\" \"$(grep -cF \"$s{\" $TMPDIR/prod.css)\"; done\n.bg-lime-500\\/20       0\n.text-lime-300         0\n.border-lime-500\\/30   0\n.bg-sky-500\\/20        1\n$ grep -n \"2026-07-02 | Global theme put\" ../CLAUDE.md | cut -c1-160\n815:| 2026-07-02 | Global theme put `.dark` class on `<html>` → force-activated every Tailwind `dark:` utility inside Notes, breaking its own 3-theme (light/dar",
 "t0-9:cli0": "$ npm ls --depth=0 2>/dev/null | tail -n +2      # chỉ cài tailwindcss, như bài hướng dẫn cũ\n└── tailwindcss@4.3.5\n$ npx --no-install tailwindcss -i input.css -o out.css 2>&1 | tail -2\nnpm error could not determine executable to run\nnpm error A complete log of this run can be found in: /Users/admin/.npm/_logs/2026-11-14T02_43_13_486Z-debug-0.log\n$ ls node_modules/.bin 2>/dev/null | grep -c tailwind\n0",
 "anh-twc-0-9:cascade": {
  "url": "http://127.0.0.1:20101/index.html",
  "vp": [
   560,
   170
  ],
  "rect": {
   "#a": [
    24,
    52,
    512,
    32
   ],
   "#b": [
    24,
    112,
    512,
    32
   ]
  },
  "console": [],
  "ketQua": {
   "mau": "[[\"do xanh\",\"rgb(0, 0, 255)\"],[\"xanh do\",\"rgb(0, 0, 255)\"]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tn, br, box, two, steps, kw, c, cmp, icards, tiers } from './_twc-chung.mjs';

export const deck = { key: 'twc-00-9', code: 'TWC 0.0', title: 'What to know first, and how to learn this course', sub: 'Section 0 · Start here (2/2)' };
const O = (k) => { const v = DU_LIEU[`t0-9:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-0-9:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-00-9', ten, { vp: 560, ...o });

// ── số đo (chạy thật t0-9 · Tailwind 4.3.5 / 3.4.19 · Chromium · cuongthai.com)
const CASC = `<style>
.do   { color: red; }
.xanh { color: blue; }
</style>
<p id="a" class="do xanh">…</p>
<p id="b" class="xanh do">…</p>`;
const gon = (x) => x.replace(/\s+|…|class="[^"]*"<\/p>/g, '');
for (const l of CASC.split('\n')) if (!gon(DU_LIEU['t0-9:file:index.html'].replace(/>class="[^"]*"</g, '><')).includes(gon(l.replace('…', '')))) throw new Error('mã cascade lệch: ' + l);
const MAU = JSON.parse(A('cascade').ketQua.mau);
const LOI4 = doan('cli0', '--no-install')[0];
const DEM4 = doan('cli', "grep -c '^")[0], DEM3 = doan('cli3', "grep -c '^")[0];
const PROD = doan('suco', "for s in");
if (MAU[0][1] !== MAU[1][1] || !/could not determine executable/.test(LOI4) || DEM4 !== '0' || DEM3 !== '3' || !PROD.slice(0, 3).every((l) => / 0$/.test(l))) throw new Error('số đo đổi');

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (2/2)', t: 'What to know first,<br>and how to learn this course', sub: 'The one sentence, the CSS you need underneath it, two real incidents on this site, two traps from old tutorials — and a way of learning that sticks',
    en: 'Start here, part two. The one sentence the course hangs on, the plain CSS you need underneath it, two real incidents on this very site, two traps from old tutorials, and a way of learning that actually sticks.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The one mental model, and the three things it predicts</li>
    <li>The CSS you must know first — and a 5-question self-check</li>
    <li>The chapter map: vocabulary → leaks → configuration → operations</li>
    <li>Two real incidents on cuongthai.com, both from that one sentence</li>
    <li>Two traps when you follow a Tailwind 3 tutorial with Tailwind 4</li>
    <li>How to learn it: run the command, then grep the built CSS</li></ul>`,
    en: 'Six takeaways: the mental model and what it predicts; the CSS to know first, with a self-check; the chapter map; two real incidents on cuongthai.com; two traps when an old tutorial meets Tailwind four; and the learning loop of running the command and grepping the built CSS.' },
  { t: 'One sentence carries the course', body: box('The mental model', 'Tailwind reads your source as <b>text</b> and writes a stylesheet containing <b>only</b> the classes it finds.', 'xanh') +
      icards([['cut', 'A class built at runtime does not exist', '<code>`text-${c}-500`</code> is never seen as a word ⇒ no rule. Lesson 0.1, Ch. 10.'],
        ['count', 'The stylesheet does not grow with reuse', 'Size follows the number of <i>distinct</i> classes. Lesson 0.1, Ch. 8.'],
        ['list', 'Tailwind decides who wins a conflict', 'It writes the file, so its order — not yours — breaks ties. Ch. 3.']], 3) +
      box('Why learn it first', 'Almost every "Tailwind is weird" moment is one of these three. If you can name which, you are already halfway to the fix.', 'lam'),
    en: 'One sentence carries the course: Tailwind reads your source as text and writes a stylesheet containing only the classes it finds. It predicts three things: a class built at runtime does not exist; the stylesheet does not grow when you reuse classes; and Tailwind, not you, decides who wins a conflict.' },
  { t: 'The CSS you need first: the cascade', body: two(D(html(CASC, { sm: true, hl: [2, 3, 5, 6] }),
      tn(['# Chromium · getComputedStyle(p).color', ...MAU.map(([k, m]) => `class="${k}"`.padEnd(18) + m)].join('\n'), { fs: 17, title: 'Chromium (real)' })),
    D(B('cascade', { url: '127.0.0.1:20101/index.html', h: 160, w: 520 }),
      box('Read it', 'Both paragraphs are <b>blue</b>. The order inside <code>class="…"</code> does nothing; with equal specificity, the rule written <b>later in the stylesheet</b> wins. That plain-CSS rule is why, in Tailwind, the stylesheet\'s order decides (Chapter 3).', 'lam')), 'r64'),
    en: 'The one piece of plain CSS you need first: the cascade. Two rules with the same specificity, red then blue. One paragraph lists the classes red-blue, the other blue-red. Chromium paints both blue: the order inside the class attribute does nothing; the rule later in the stylesheet wins. Hold on to that, chapter three is built on it.' },
  { t: 'Check yourself before Chapter 1', body: cmp(['If you cannot answer…', 'learn this first'], [
      ['What does <code>padding</code> change, and what does <code>margin</code> change?', 'Web Foundations 3.2 — the box model'],
      ['Two rules match with the same specificity: which wins?', 'Web Foundations 3.1 — selectors, cascade'],
      ['<code>display:flex</code>: main axis vs cross axis?', 'Web Foundations 3.3 — flexbox'],
      ['What does <code>@media (min-width: 768px)</code> mean?', 'Web Foundations 3.5 — responsive'],
      ['How do you run a command and read its output?', 'Linux &amp; Bash course, or any terminal intro'],
    ]) + box('Not needed', 'React, Sass, PostCSS, build tools. Where they matter, the lesson explains them in place.', 'xanh'),
    en: 'Check yourself before chapter one. What padding and margin change; which of two equally specific rules wins; main axis and cross axis in flexbox; what a min-width media query means; and how to run a command. If one stumps you, the matching Web Foundations lesson is the shortest way in. React, Sass and build tools are not needed.' },
  { t: 'The map: four stages, eleven chapters', body: tiers([
      ['type', 'Ch. 1–2 · Vocabulary', 'the scale, and what a variant prefix compiles to'],
      ['merge', 'Ch. 3–4 · Where the model leaks', 'conflicts, and composing classes without stepping on it'],
      ['wrench', 'Ch. 5–7 · Configuring the generator', 'extending the theme, CSS variables for theming, layers'],
      ['gauge', 'Ch. 8–10 · Running it', 'output size, accessibility, a diagnosis cookbook'],
      ['flag', 'Ch. 11 · What survived', 'what held up under measurement, and a final exam'],
    ], { th: 58, gap: 18 }),
    en: 'The map. Chapters one and two are the vocabulary: the scale, and what a variant compiles to. Three and four are where the model leaks: conflicts and dynamic classes. Five to seven configure the generator. Eight to ten run it: size, accessibility and a diagnosis cookbook. Chapter eleven sums up what survived measurement, with a final exam.' },
  { t: 'Real incident 1: badges that lost their colour', body: two(D(tn(['$ sed -n \'4,10p\' frontend/tailwind.config.ts', ...doan('suco', "sed -n '4,10p'").map((l) => l.length > 96 ? l.slice(0, 95) + '…' : l), '$ git log -1 -- frontend/tailwind.config.ts', ...doan('suco', 'git -C')].join('\n'), { fs: 13, wrap: 98, title: 'frontend/ (real)' }),
      tn(['$ grep -n "Shell:" src/lib/repos.ts', ...doan('suco', 'Shell:'), '$ grep -cF \'<class>{\' <live CSS of /repos>', ...PROD].join('\n'), { fs: 14, wrap: 64, title: 'live cuongthai.com today (real)' })),
    box('What happened', 'Badge colours lived in <code>src/lib/repos.ts</code>, but the Tailwind 3 <code>content</code> list never scanned <code>src/lib</code> — so those classes were never generated. The fix (one line) is in the repository; until it is deployed, the live CSS still has <b>0</b> of them. The one sentence predicted it exactly.', 'do2'), 'r64'),
    en: 'A real incident on this site. The badge colours on the repos page live in a file under src lib, but Tailwind three was never told to scan src lib, so those classes were never generated. The fix is one line, already in the repository today. Until it is deployed, the live CSS still contains zero of them, while a colour used elsewhere is there.' },
  { t: 'Real incident 2: one class name broke a feature', body: two(D(tn(['$ grep -n "2026-07-02 | Global theme put" CLAUDE.md', ...doan('suco', 'Global theme put').map((l) => l.replace(/^(\d+:)/, '$1\n'))].join('\n'), { fs: 15, wrap: 64, title: 'the repository\'s incident log (real)' })),
    D(box('What happened', 'The site-wide dark theme put a class named <code>dark</code> on <code>&lt;html&gt;</code>. In Tailwind, that exact class switches on <b>every</b> <code>dark:</code> utility below it — including those of the Notes page, which had its own three-theme switcher. Notes broke.', 'do2'),
      box('The fix, and the lesson', 'The global class was renamed <code>theme-dark</code>; <code>dark</code> is reserved for Notes. A variant is a selector you did not write by hand — Chapter 2.4 reads what <code>dark:</code> compiles to.', 'xanh')), 'r64'),
    en: 'A second real incident, from the repository\'s own incident log. The site-wide dark theme put a class called dark on the html element. In Tailwind that exact class turns on every dark-prefixed utility below it, including those of the Notes page, which had its own theme switcher. Notes broke. The fix renamed the global class. Lesson two point four reads what dark compiles to.' },
  { t: 'Trap 1: an old tutorial\'s command on Tailwind 4', body: two(D(tn(['$ npm i tailwindcss          # only this, as a v3 tutorial says', ...doan('cli0', 'npm ls'), '$ npx tailwindcss -i input.css -o out.css', LOI4, '$ ls node_modules/.bin | grep -c tailwind', ...doan('cli0', 'node_modules/.bin')].join('\n'), { fs: 15, wrap: 64, title: 'Tailwind 4.3.5 — only "tailwindcss" installed (real)' }),
      tn(['$ npm i @tailwindcss/cli', '$ npx @tailwindcss/cli -i input.css -o out.css', ...doan('cli', '@tailwindcss/cli')].join('\n'), { fs: 15, title: 'with the CLI package (real)' })),
    box('Why', 'In Tailwind 4 the <code>tailwindcss</code> package is only the engine. The command-line tool moved to <code>@tailwindcss/cli</code> (once installed, it also provides the <code>tailwindcss</code> command). Same goes for build tools: <code>@tailwindcss/postcss</code>, <code>@tailwindcss/vite</code>.', 'lam'), 'r64'),
    en: 'Trap one: following a version-three tutorial on Tailwind four. Install only tailwindcss, run npx tailwindcss, and npm says it could not determine an executable to run. In version four that package is only the engine; the command-line tool moved to at-tailwindcss slash cli. Install that, and the build is done in about twenty milliseconds.' },
  { t: 'Trap 2: the counting command that returns 0', body: two(D(tn(['$ grep -c \'^\\.\' out.css      # Tailwind 4.3.5', DEM4, '$ grep -cE \'^ *\\.[a-z]\' out.css', ...doan('cli', "grep -cE").slice(0, 1), ...doan('cli', "sed -n")].join('\n'), { fs: 15, title: 'Tailwind 4 output (real)' })),
      D(tn(['$ grep -c \'^\\.\' out.css      # Tailwind 3.4.19', DEM3, ...doan('cli3', "grep -nE")].join('\n'), { fs: 15, title: 'Tailwind 3 output (real)' }),
        box('Read it', 'Same page, same three classes. Tailwind 3 writes rules at the start of the line; Tailwind 4 nests them inside <code>@layer utilities { … }</code>, indented — so "count lines starting with a dot" says <b>0</b>. Check what a command measures before you trust its number.', 'do2')), 'r64'),
    en: 'Trap two: a counting command from older material. Grep for lines starting with a dot: Tailwind three says three, Tailwind four says zero, for the same page. Version four nests its rules inside an at-layer utilities block, indented, so the pattern never matches. Before you trust a number, check what the command actually measures.' },
  { t: 'How to learn this course', body: two(steps([
      'Read the lesson once — just the claim and the numbers',
      'Run the <b>same command</b> on your own folder (the "Run it yourself" box)',
      'Compare: same result? If not, find out why — that is the lesson',
      `Before reaching for ${c('!important')}: ${c('grep')} the built CSS for the rule`,
      'Do the Code Lab module for the chapter, then the chapter quiz',
    ]), D(box('Minimum path (≈ 2 weeks)', 'Section 0, Ch. 1–4, Ch. 10 — enough to style real pages and fix "my class does nothing".', 'xanh'),
      box('Full path (≈ 5–6 weeks)', 'All 11 chapters + final exam. A session: one lesson + its commands (45–60 min), Code Lab the next day.', 'lam')), ''),
    en: 'How to learn it. Read the claim and its numbers, run the same command on your own folder, and compare. If your result differs, finding out why is the lesson. Before reaching for important, grep the built CSS for the rule. Then the Code Lab module and the quiz. Minimum path, about two weeks; the full course, five to six.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Mental model', 'reads text, writes only what it finds'), kw('Cascade', 'equal specificity ⇒ later rule wins'),
      kw('Specificity', 'how strong a selector is'), kw('content globs (v3)', 'the files Tailwind 3 scans'),
      kw('@tailwindcss/cli (v4)', 'the CLI, separate from the engine'), kw('@layer utilities', 'where v4 nests its rules'),
      kw('Built CSS', 'the generated file — grep it first'), kw('Measured vs reasoned', 'a number someone ran vs one inferred'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the mental model; the cascade; specificity; content globs in Tailwind three; the separate command-line package in Tailwind four; the at-layer utilities block; the built CSS; and measured versus reasoned numbers.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Make the cascade page: two classes, two orders in ${c('class=""')}; check the colour in DevTools`,
      `In an empty folder, ${c('npm i tailwindcss')} only, run ${c('npx tailwindcss')} — read the error`,
      `Add ${c('@tailwindcss/cli')}, build, then count rules with both grep patterns`,
      'Answer the 5 self-check questions; open the lessons for any you missed',
    ]), box('Keep these', '<ul><li>Reads text, writes only what it finds</li><li>Stylesheet order breaks ties, not class order</li><li>v4: engine and CLI are separate packages</li><li>Know what a command measures</li><li>Run it, then grep the built CSS</li></ul>', 'lam'), ''),
    en: 'Your turn: build the cascade page and check both colours; reproduce the npx error in an empty folder, then fix it with the CLI package and count rules with both patterns; and answer the five self-check questions. Keep: stylesheet order breaks ties, the engine and the CLI are separate in version four, and run the command before you believe the number.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Tailwind actually is', bai: 'Start here 2/2' }, S);
