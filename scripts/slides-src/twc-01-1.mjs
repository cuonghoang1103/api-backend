/*DU_LIEU*/
const DU_LIEU = {
 "t1-1:file:scale.mjs": "import resolveConfig from 'tailwindcss/resolveConfig.js';\nconst { theme } = resolveConfig({ content: [] });\nfor (const [k, v] of Object.entries(theme.spacing)) {\n  const px = v.endsWith('rem') ? parseFloat(v) * 16 : v;\n  console.log(k.padEnd(5), String(v).padEnd(10), px);\n}\n",
 "t1-1:v3thang": "$ node -p \"require('tailwindcss/package.json').version\"\n3.4.19\n$ node scale.mjs | head -12\n0     0px        0px\n1     0.25rem    4\n2     0.5rem     8\n3     0.75rem    12\n4     1rem       16\n5     1.25rem    20\n6     1.5rem     24\n7     1.75rem    28\n8     2rem       32\n9     2.25rem    36\n10    2.5rem     40\n11    2.75rem    44\n$ node scale.mjs | tail -4\n0.5   0.125rem   2\n1.5   0.375rem   6\n2.5   0.625rem   10\n3.5   0.875rem   14\n$ node scale.mjs | wc -l\n      35\n$ node -e \"const t=require('tailwindcss/resolveConfig')({content:[]}).theme.spacing; console.log('vang 1..24:', Array.from({length:24},(_,i)=>i+1).filter(n=>!(n in t)).join(' '))\"\nvang 1..24: 13 15 17 18 19 21 22 23",
 "t1-1:file:tailwind.config.js": "module.exports = { content: ['./icon.html'] };\n",
 "t1-1:file:nhap.css": "@tailwind base;\n@tailwind utilities;\n",
 "t1-1:file:trang.html": "<div class=\"p-4 p-13 p-4.5 p-1.3 p-px p-[16px]\"></div>\n",
 "t1-1:v3build": "$ npx tailwindcss -i nhap.css -o out.css 2>&1 | tail -1\nDone in 91ms.\n$ for c in '.p-4 {' '.p-13 {' '.p-4\\.5 {' '.p-px {' '.p-\\[16px\\] {'; do printf '%-16s %s\\n' \"$c\" \"$(grep -cF \"$c\" out.css)\"; done\n.p-4 {           1\n.p-13 {          0\n.p-4\\.5 {        0\n.p-px {          1\n.p-\\[16px\\] {    1\n$ grep -A1 '^\\.p-4 {' out.css\n.p-4 {\n  padding: 1rem",
 "t1-1:file:input.css": "@import \"tailwindcss\";\n",
 "t1-1:v4build": "$ node -p \"require('tailwindcss/package.json').version\"\n4.3.5\n$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 26ms\n$ for c in '.p-4 {' '.p-13 {' '.p-4\\.5 {' '.p-1\\.3 {' '.p-px {' '.p-\\[16px\\] {'; do printf '%-16s %s\\n' \"$c\" \"$(grep -cF \"$c\" out.css)\"; done\n.p-4 {           1\n.p-13 {          1\n.p-4\\.5 {        1\n.p-1\\.3 {        0\n.p-px {          1\n.p-\\[16px\\] {    1\n$ grep -A1 -E '^ *\\.p-(4|13|4\\\\.5) \\{' out.css\n  .p-4 {\n    padding: calc(var(--spacing) * 4);\n--\n  .p-4\\.5 {\n    padding: calc(var(--spacing) * 4.5);\n--\n  .p-13 {\n    padding: calc(var(--spacing) * 13);\n$ grep -m1 -- '--spacing:' out.css\n    --spacing: 0.25rem;",
 "t1-1:kho": "$ node -p \"require('tailwindcss/package.json').version\"\n3.4.19\n$ git grep -lwE '[wh]-[45]\\.5' -- 'src/*.tsx' | wc -l\n       7\n$ git grep -ohwE '[wh]-[45]\\.5' -- 'src/*.tsx' | sort | uniq -c\n   7 h-4.5\n   1 h-5.5\n   7 w-4.5\n   1 w-5.5\n$ git grep -lF 'w-4.5 h-4.5 text-neon-violet' -- 'src/*.tsx'\nsrc/components/shop/DigitalShopTermsGate.tsx\n$ git grep -hF 'w-4.5 h-4.5 text-neon-violet' -- 'src/*.tsx' | sed 's/^ *//'\n<Icon className=\"w-4.5 h-4.5 text-neon-violet\" style={{ width: 18, height: 18 }} />\n$ for c in '.w-4{' '.w-4\\.5{' '.h-4\\.5{' '.w-5\\.5{'; do printf '%-10s %s\\n' \"$c\" \"$(cat .next/static/css/*.css | grep -cF \"$c\")\"; done\n.w-4{      1\n.w-4\\.5{   0\n.h-4\\.5{   0\n.w-5\\.5{   0",
 "t1-1:file:goc.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-slate-100 p-4 font-sans\">\n  <div id=\"a\" class=\"mb-3 inline-block bg-cyan-200 p-4\"><span class=\"block bg-white px-2 text-lg\">p-4</span></div>\n  <div id=\"b\" class=\"inline-block bg-amber-200 p-[16px]\"><span class=\"block bg-white px-2 text-lg\">p-[16px]</span></div>\n</body></html>\n",
 "t1-1:rem": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 53ms\n$ grep -A1 -E '^ *\\.p-(4|\\\\\\[16px\\\\\\]) \\{' out.css\n  .p-4 {\n    padding: calc(var(--spacing) * 4);\n--\n  .p-\\[16px\\] {\n    padding: 16px;",
 "t1-1:file:icon.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 text-lg\">\n  <p class=\"flex items-center gap-2\"><svg id=\"i4\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"w-4 h-4 text-cyan-700\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"currentColor\"/></svg> w-4 h-4</p>\n  <p class=\"flex items-center gap-2\"><svg id=\"i45\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"w-4.5 h-4.5 text-cyan-700\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"currentColor\"/></svg> w-4.5 h-4.5</p>\n</body></html>\n",
 "t1-1:icon": "$ npx tailwindcss -i nhap.css -o out.css 2>&1 | tail -1\nDone in 90ms.\n$ grep -cF '.w-4\\.5' out.css\n0\n$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 22ms\n$ grep -A1 -F '.w-4\\.5' out.css\n  .w-4\\.5 {\n    width: calc(var(--spacing) * 4.5);",
 "t1-1:v3full": "$ node scale.mjs\n0     0px        0px\n1     0.25rem    4\n2     0.5rem     8\n3     0.75rem    12\n4     1rem       16\n5     1.25rem    20\n6     1.5rem     24\n7     1.75rem    28\n8     2rem       32\n9     2.25rem    36\n10    2.5rem     40\n11    2.75rem    44\n12    3rem       48\n14    3.5rem     56\n16    4rem       64\n20    5rem       80\n24    6rem       96\n28    7rem       112\n32    8rem       128\n36    9rem       144\n40    10rem      160\n44    11rem      176\n48    12rem      192\n52    13rem      208\n56    14rem      224\n60    15rem      240\n64    16rem      256\n72    18rem      288\n80    20rem      320\n96    24rem      384\npx    1px        1px\n0.5   0.125rem   2\n1.5   0.375rem   6\n2.5   0.625rem   10\n3.5   0.875rem   14",
 "anh-twc-1-1:goc": {
  "url": "http://127.0.0.1:20105/rem/goc.html",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#a": [
    16,
    16,
    78,
    60
   ],
   "#b": [
    98,
    16,
    117,
    60
   ]
  },
  "console": [],
  "ketQua": {
   "pad": "[[\"p-4\",\"16px\",\"16px\"],[\"p-[16px]\",\"16px\",\"16px\"]]"
  }
 },
 "anh-twc-1-1:to": {
  "url": "http://127.0.0.1:20105/rem/to.html",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#a": [
    20,
    20,
    96,
    75
   ],
   "#b": [
    121,
    24,
    137,
    67
   ]
  },
  "console": [],
  "ketQua": {
   "pad": "[[\"p-4\",\"20px\",\"20px\"],[\"p-[16px]\",\"16px\",\"20px\"]]"
  }
 },
 "anh-twc-1-1:icon3": {
  "url": "http://127.0.0.1:20105/icon3/icon.html",
  "vp": [
   640,
   130
  ],
  "rect": {
   "#i4": [
    16,
    22,
    16,
    16
   ],
   "#i45": [
    16,
    46,
    24,
    24
   ]
  },
  "console": [],
  "ketQua": {
   "kt": "[[\"w-4 h-4\",16],[\"w-4.5 h-4.5\",24]]"
  }
 },
 "anh-twc-1-1:icon4": {
  "url": "http://127.0.0.1:20105/icon4/icon.html",
  "vp": [
   640,
   130
  ],
  "rect": {
   "#i4": [
    16,
    22,
    16,
    16
   ],
   "#i45": [
    16,
    49,
    18,
    18
   ]
  },
  "console": [],
  "ketQua": {
   "kt": "[[\"w-4 h-4\",16],[\"w-4.5 h-4.5\",18]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, sw } from './_twc-chung.mjs';

export const deck = { key: 'twc-01-1', code: 'TWC 1.1', title: 'Every spacing value is the number times 4px', sub: 'Chapter 1 · Lesson 1.1' };
const O = (k) => { const v = DU_LIEU[`t1-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-1-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-01-1', ten, { vp: 640, ...o });

// ── số đo (chạy thật t1-1 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/ 14/11/2026)
const V3N = doan('v3thang', 'wc -l')[0].trim();
const VANG = doan('v3thang', 'vang 1..24')[0].replace('vang 1..24: ', '');
const R3 = doan('v3build', 'for c in'), R4 = doan('v4build', 'for c in');
const co = (rows, k) => rows.find((l) => l.startsWith(k + ' ')).trim().split(/\s+/).pop();
const KHO = doan('kho', 'uniq -c').map((l) => l.trim().split(/\s+/));
const SO_KHO = KHO.reduce((s, [n]) => s + +n, 0), TEP_KHO = doan('kho', 'wc -l')[0].trim();
const CSS_KHO = doan('kho', 'for c in');
const PAD = { goc: JSON.parse(A('goc').ketQua.pad), to: JSON.parse(A('to').ketQua.pad) };
const ICO = { v3: JSON.parse(A('icon3').ketQua.kt), v4: JSON.parse(A('icon4').ketQua.kt) };
if (V3N !== '35' || VANG !== '13 15 17 18 19 21 22 23' || co(R3, '.p-13') !== '0' || co(R4, '.p-13') !== '1' || co(R3, '.p-4\\.5') !== '0' || co(R4, '.p-1\\.3') !== '0'
  || SO_KHO !== 16 || TEP_KHO !== '7' || co(CSS_KHO, '.w-4\\.5{') !== '0' || PAD.to[0][1] !== '20px' || PAD.to[1][1] !== '16px' || ICO.v3[1][1] !== 24 || ICO.v4[1][1] !== 18) throw new Error('số đo đổi');
const SCALE = `import resolveConfig from 'tailwindcss/resolveConfig.js';
const { theme } = resolveConfig({ content: [] });
for (const [k, v] of Object.entries(theme.spacing)) {
  const px = v.endsWith('rem') ? parseFloat(v) * 16 : v;
  console.log(k.padEnd(5), String(v).padEnd(10), px);
}`;
const lenh = (l) => l.replace(/^\$ /, '');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.1', t: 'Every spacing value<br>is the number times 4px', sub: 'One multiplication replaces thousands of class names — read from Tailwind 3.4.19 (this site) and Tailwind 4.3.5 (what you install today), and checked in Chromium',
    en: 'Lesson one point one. One multiplication replaces thousands of spacing class names. We read the scale from Tailwind 3, which this site runs, and from Tailwind 4, which you install today, and check it in Chromium.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The rule: <b>key × 4px</b> — and how to use it in both directions</li>
    <li>Tailwind 3 stores a <b>list</b> of 35 keys; Tailwind 4 stores a <b>formula</b></li>
    <li>The two literals that break the pattern: <code>0</code> and <code>px</code></li>
    <li>A real bug: 16 classes in this site's code that generate <b>nothing</b></li>
    <li>Why the scale is <code>rem</code>, measured at two root font sizes</li></ul>`,
    en: 'Five takeaways: the rule, key times four pixels, in both directions; Tailwind 3 stores a list of thirty-five keys while Tailwind 4 stores a formula; the two literals; a real bug, sixteen classes in this site that generate nothing; and why the scale is rem.' },
  { t: 'The rule: key × 4px', body: two(D(sw([['p-1', '4px', '1 × 4 = 4px'], ['p-2', '8px', '2 × 4 = 8px'], ['p-3', '12px', '3 × 4 = 12px'], ['p-4', '16px', '4 × 4 = 16px = 1rem'], ['p-6', '24px', '6 × 4 = 24px'], ['p-8', '32px', '8 × 4 = 32px'], ['p-12', '48px', '12 × 4 = 48px'], ['p-24', '96px', '24 × 4 = 96px']], { kieu: 'dai', w: 560, co: 20 })),
    D(box('One sentence', `<code>p-4</code> is <code>1rem</code> is <b>16px</b>, because 4 × 4px = 16px. ${c('m-2')} = 8px · ${c('gap-6')} = 24px · ${c('mt-10')} = 40px.`, 'xanh'),
      box('Why 4px', '4 divides the common design steps (8, 12, 16, 24, 32, 48) and is still small enough to fine-tune. Most design systems use a 4px grid — Tailwind adopted the convention, it did not invent it.', 'lam')), 'r64'),
    en: 'The rule: key times four pixels. p one is four pixels, p four is sixteen pixels, which is one rem, p twenty-four is ninety-six. Four divides the common design steps and is small enough to fine-tune; most design systems use a four-pixel grid.' },
  { t: 'Tailwind 3 (this site): a LIST of 35 keys', body: two(D(tsx(SCALE, { sm: true }), tn([`$ ${lenh('node scale.mjs | head -12')}`, ...doan('v3thang', 'head -12').slice(0, 9), '…', `$ node scale.mjs | wc -l`, `      ${V3N}`].join('\n'), { fs: 15, title: 'Tailwind 3.4.19 (real)' })),
    D(tn(['$ node -e "… keys 1..24 that are NOT in theme.spacing"', `vang 1..24: ${VANG}`].join('\n'), { fs: 16, wrap: 50, title: 'missing keys (real)' }),
      box('Read it', `Every value is its key × 4 — and there are exactly <b>${V3N}</b> keys. Between 12 and 24 the list <b>skips</b>: ${VANG.split(' ').slice(0, 5).join(', ')}… In Tailwind 3, <code>p-13</code> is not "13 × 4" — it is <b>nothing</b>.`, 'lam'),
      box('Note', 'JavaScript prints integer keys first, so <code>px</code> and the halves (0.5, 1.5…) come at the end of the real output.', 'xanh')), 'r64'),
    en: 'Tailwind 3, which this site runs, stores a list. The script from the written lesson prints every value as its key times four, and counts exactly thirty-five keys. Between twelve and twenty-four the list skips thirteen, fifteen, seventeen, eighteen, nineteen. In Tailwind 3, p thirteen is not thirteen times four: it is nothing.' },
  { t: 'Tailwind 4 (today): a FORMULA', body: two(D(tn([`$ grep -m1 -- '--spacing:' out.css`, ...doan('v4build', '--spacing'), `$ grep -A1 … '.p-(4|13|4\\.5) {' out.css`, ...doan('v4build', 'grep -A1').filter((l) => l !== '--')].join('\n'), { fs: 16, title: 'Tailwind 4.3.5 (real)' })),
    cmp(['same page, same classes', 'Tailwind 3.4.19', 'Tailwind 4.3.5'], [
      ['p-4', co(R3, '.p-4') + ' rule', co(R4, '.p-4') + ' rule'],
      ['p-13', `<b>${co(R3, '.p-13')}</b> rules`, co(R4, '.p-13') + ' rule'],
      ['p-4.5', `<b>${co(R3, '.p-4\\.5')}</b> rules`, co(R4, '.p-4\\.5') + ' rule'],
      ['p-1.3', '—', `<b>${co(R4, '.p-1\\.3')}</b> rules (not a ¼ step)`],
      ['p-px · p-[16px]', co(R3, '.p-px') + ' · ' + co(R3, '.p-\\[16px\\]'), co(R4, '.p-px') + ' · ' + co(R4, '.p-\\[16px\\]')],
    ]) + box('Read it', 'Tailwind 4 keeps <b>one</b> variable, <code>--spacing: 0.25rem</code>, and writes <code>calc(var(--spacing) * n)</code> for any n in steps of 0.25. The rule × 4 is now literally the code.', 'xanh'), 'r64'),
    en: 'Tailwind 4, what you install today, stores a formula: one variable, spacing equals a quarter rem, and every class is calc of spacing times n. Same page, same classes: p thirteen and p four point five get a rule in Tailwind 4 and nothing in Tailwind 3. p one point three is dropped, because it is not a quarter step.' },
  { t: 'The two literals that break the pattern — on purpose', body: two(D(cmp(['key', 'value', 'why'], [
      ['0', '0px', 'no space — needs no unit'],
      ['px', '1px', 'the one value × 4 cannot write: hairlines, 1px offsets'],
      ['0.5 … 96 (v3)', 'key × 4px', `the other ${+V3N - 2} entries — pure arithmetic`],
      ['any ¼ step (v4)', 'key × 4px', 'the formula; 0 and px stay literals'],
    ])),
    box('Why "px" and not "0.25"', '<code>0.25</code> × 4 = 1px would be a confusing way to spell a hairline. Both versions keep the two literals: the build above has a rule for <code>.p-px</code> in Tailwind 3 <b>and</b> 4 (<code>padding: 1px</code>).', 'lam'), 'r64'),
    en: 'Two keys are not numbers, on purpose. Zero needs no unit. px is exactly one pixel, the one value times four cannot write, for hairline borders and one-pixel offsets. Writing it as zero point two five would be confusing. Both versions keep the two literals.' },
  { t: 'Measured in this site\'s code: 16 classes that do NOTHING', body: two(D(tn(['$ cd frontend   # Tailwind 3.4.19', `$ git grep -lwE '[wh]-[45]\\.5' -- 'src/*.tsx' | wc -l`, `       ${TEP_KHO}`, `$ git grep -ohwE '[wh]-[45]\\.5' -- 'src/*.tsx' | sort | uniq -c`, ...doan('kho', 'uniq -c'), '$ grep -cF … .next/static/css/*.css   # built CSS', ...CSS_KHO].join('\n'), { fs: 15, wrap: 64, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Read it', `<b>${SO_KHO}</b> uses of <code>w-4.5</code>, <code>h-4.5</code>, <code>w-5.5</code>, <code>h-5.5</code> in ${TEP_KHO} files. Tailwind 3 has no key 4.5, so the built CSS has <b>0</b> rules for them — while <code>.w-4{</code> exists.`, 'do2'),
      box('Someone noticed', `${c(doan('kho', 'sed').join(' ').replace(/^<Icon /, '').slice(0, 60))}… — one file patched it with an inline <code>style</code>. The other six still render at the icon's default size.`, 'lam')), 'r64'),
    en: 'Measured in this site\'s code: sixteen uses of w four point five, h four point five and five point five, in seven files. Tailwind 3 has no key four point five, so the built stylesheet has zero rules for them. One file noticed and patched it with an inline style; the other six render at the icon\'s default size.' },
  { t: 'Chromium: the same icon, Tailwind 3 vs Tailwind 4', body: two(D(B('icon3', { url: 'icon3/icon.html · Tailwind 3.4.19', h: 90, w: 520 }), B('icon4', { url: 'icon4/icon.html · Tailwind 4.3.5', h: 90, w: 520 })),
    D(cmp(['svg width="24" + class', 'Tailwind 3.4.19', 'Tailwind 4.3.5'], ICO.v3.map(([k, w], i) => [k, `${w}px`, `${ICO.v4[i][1]}px`])),
      box('Read it', `The icon library writes <code>width="24"</code>. With no rule for <code>w-4.5</code>, Tailwind 3 leaves it at <b>${ICO.v3[1][1]}px</b>; Tailwind 4 writes 4.5 × 4 = <b>${ICO.v4[1][1]}px</b>. No error, no warning — just a bigger icon.`, 'do2')), 'r64'),
    en: 'Chromium, the same markup. The icon library writes width twenty-four. With no rule for w four point five, Tailwind 3 leaves the icon at twenty-four pixels; Tailwind 4 writes four point five times four, eighteen pixels. No error, no warning, just a bigger icon.' },
  { t: 'Why the scale is rem — measured at two root font sizes', body: two(D(B('goc', { url: 'rem/goc.html · root 16px', h: 92, w: 520 }), B('to', { url: 'rem/to.html · root 20px (user setting)', h: 100, w: 520 })),
    D(cmp(['class', 'root 16px', 'root 20px'], PAD.goc.map(([k, p], i) => [k, p, `<b>${PAD.to[i][1]}</b>`])),
      box('Read it', '<code>p-4</code> is stored as <code>1rem</code> (v3) or <code>0.25rem × 4</code> (v4): it <b>grows</b> with a user who raises the base font size. <code>p-[16px]</code> stays 16px. "It is the same thing" is not the same thing.', 'lam'),
      box('So', 'The pixel numbers in this lesson are a convenience for reasoning at the default 16px root — not the value on the wire. Chapter 9 measures accessibility in full.', 'xanh')), 'r64'),
    en: 'Why rem matters, measured. At the default root of sixteen pixels, p four and p bracket sixteen px are both sixteen pixels. When a user raises the root to twenty pixels, p four becomes twenty, p bracket sixteen px stays sixteen. The pixel numbers are a convenience for reasoning, not the value on the wire.' },
  { t: 'What the rule buys you: both directions', body: steps([
      `<b>Design → class.</b> The mockup says 24px of padding. 24 ÷ 4 = 6 ⇒ ${c('p-6')}. No lookup.`,
      `<b>Class → pixels.</b> A review shows ${c('gap-3')}. 3 × 4 = 12px — judge it without opening a browser.`,
      `<b>Off the grid.</b> The mockup says 30px: 30 ÷ 4 = 7.5. Tailwind 3 has no 7.5; Tailwind 4 writes ${c('p-7.5')}. Either way it is a <b>signal</b>: round to ${c('p-8')} and keep the grid, or decide you need an escape hatch (lesson 1.2).`,
    ]) + box('Tailwind 4 removes the error, not the decision', 'A formula means no silent "nothing" for p-13 — but 13 × 4 = 52px may still be off your design grid. The arithmetic is free; the grid is a choice.', 'lam'),
    en: 'What the rule buys you: both directions. Design to class: twenty-four divided by four is p six. Class to pixels: gap three times four is twelve. Off the grid: thirty divided by four is seven point five; Tailwind 3 has no such key, Tailwind 4 writes it, but either way it is a signal to round to p eight or choose an escape hatch.' },
  { t: 'Trap: reading the number as pixels', body: two(D(box('The mistake', 'Reading <code>p-4</code> as "4 pixels". It is <b>16px</b>. Layouts come out <b>four times too tight</b>, and because everything is wrong evenly it looks like a different bug.', 'do2'),
      box('The second trap (Tailwind 3)', 'Assuming every number works. <code>w-4.5</code>, <code>p-13</code>, <code>gap-15</code> are silently <b>nothing</b> in 3.4.19 — measured above in this very site.', 'do2')),
    D(steps(['Read the built CSS once: <code>grep -A1 \'.p-4 {\' out.css</code>', 'Multiply by 4, then check the key exists in <i>your</i> version', 'In Tailwind 3, a missing key means: extend the scale or write <code>w-[18px]</code>'])), 'r64'),
    en: 'Trap one: reading p four as four pixels. It is sixteen, so layouts come out four times too tight, evenly, and it looks like another bug. Trap two, in Tailwind 3: assuming every number works. w four point five and p thirteen are silently nothing, measured in this very site.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('key × 4px rule', 'p-4 = 16px, gap-6 = 24px'), kw('Spacing scale', 'v3: a list of 35 keys'), kw('--spacing', 'v4: one variable, 0.25rem'),
      kw('calc(var(--spacing) * n)', 'v4: any ¼ step works'), kw('The two literals', '0 and px (exactly 1px)'), kw('rem vs px', 'rem grows with the user\'s root size'),
      kw('resolveConfig', 'v3: read the real theme in code'), kw('Silent no-op class', 'a key that does not exist ⇒ no rule, no error'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the key times four rule; the spacing scale, a list of thirty-five keys in Tailwind 3; the spacing variable of Tailwind 4 and its calc formula; the two literals; rem versus px; resolveConfig; and the silent no-op class.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build ${c('p-13')} and ${c('p-4.5')} in Tailwind 3 and in Tailwind 4; grep each output`,
      `Run ${c('node scale.mjs | wc -l')} on Tailwind 3 — do you get 35?`,
      `Open a page with ${c('p-4')} and ${c('p-[16px]')}, set ${c('html { font-size: 125% }')}, measure both`,
      `Search your own project: ${c("git grep -ohwE '[a-z]+-[0-9]+\\.5'")} — which keys exist in your version?`,
    ]), box('Keep these', '<ul><li>key × 4px, both directions</li><li>v3: a list of 35 keys · v4: one formula</li><li>0 and px are literals</li><li>A missing key is silent — grep the CSS</li><li>rem grows with the user; px does not</li></ul>', 'lam'), ''),
    en: 'Your turn: build p thirteen and p four point five in both versions and grep the output; count the Tailwind 3 scale; measure p four against p bracket sixteen at a bigger root size; and search your own project for half keys. Keep: key times four, a list in Tailwind 3 and a formula in Tailwind 4, and a missing key is silent.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The scale, the thing worth learning', bai: '1.1' }, S);
