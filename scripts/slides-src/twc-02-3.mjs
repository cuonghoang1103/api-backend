/*DU_LIEU*/
const DU_LIEU = {
 "t2-3:file:tw.config.js": "module.exports = { content: ['./*.html'] };\n",
 "t2-3:file:in.css": "@import \"tailwindcss\";\n",
 "t2-3:file:page.html": "<div class=\"2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6\"></div>\n",
 "t2-3:xao": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 91ms.\n$ grep -E '^\\.|^@media' out.css\n.p-1 {\n@media (min-width: 640px) {\n@media (min-width: 768px) {\n@media (min-width: 1024px) {\n@media (min-width: 1280px) {\n@media (min-width: 1536px) {",
 "t2-3:file:max.html": "<div class=\"p-1 md:p-4 max-md:p-8 max-lg:p-6 md:max-lg:p-3\"></div>\n",
 "t2-3:file:tw2.config.js": "module.exports = { content: ['./max.html'] };\n",
 "t2-3:max3": "$ npx tailwindcss -c tw2.config.js -i in.css -o out2.css 2>&1 | tail -1\nDone in 154ms.\n$ grep -E '^\\.|^@media' out2.css\n.p-1 {\n@media not all and (min-width: 1024px) {\n@media not all and (min-width: 768px) {\n@media (min-width: 768px) {",
 "t2-3:file:page4.html": "<div class=\"2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6 max-md:p-7 max-lg:p-5 md:max-lg:p-3\"></div>\n",
 "t2-3:v4": "$ npx @tailwindcss/cli -i in.css -o out.css 2>&1 | tail -1\nDone in 25ms\n$ sed -n '/^@layer utilities {/,/^}/p' out.css | grep -E '^ *(@|\\.)'\n@layer utilities {\n  .p-1 {\n  @media (width < 64rem) {\n    .max-lg\\:p-5 {\n  @media (width < 48rem) {\n    .max-md\\:p-7 {\n  @media (width >= 40rem) {\n    .sm\\:p-2 {\n  @media (width >= 48rem) {\n    .md\\:p-4 {\n    @media (width < 64rem) {\n      .md\\:max-lg\\:p-3 {\n  @media (width >= 64rem) {\n    .lg\\:p-6 {\n  @media (width >= 80rem) {\n    .xl\\:p-8 {\n  @media (width >= 96rem) {\n    .\\32 xl\\:p-10 {",
 "t2-3:file:p.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"p-4 text-xl\">\n  <div id=\"h\" class=\"2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6 rounded bg-cyan-100\">hộp: viết lộn xộn</div>\n  <div id=\"m\" class=\"mt-3 p-1 md:p-4 max-lg:p-6 rounded bg-amber-100\">p-1 md:p-4 max-lg:p-6</div>\n  <div id=\"d\" class=\"mt-3 p-1 md:max-lg:p-3 rounded bg-emerald-100\">p-1 md:max-lg:p-3 (dải)</div>\n  <div id=\"n\" class=\"mt-3 md:hidden rounded bg-rose-100\">md:hidden — \"ẩn trên máy tính bảng\"?</div>\n</body></html>\n",
 "t2-3:chrome": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 102ms.",
 "t2-3:kho": "$ git ls-files 'src/*.tsx' | wc -l\n    1673\n$ git grep -lE '(^|[\" `{])(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l\n     671\n$ for v in sm md lg xl 2xl; do printf \"%-4s %6d\\n\" \"$v:\" \"$(git grep -ohE \"(^|[\\\"' \\`{])$v:\" -- 'src/*.tsx' | wc -l)\"; done\nsm:    2014\nmd:     654\nlg:     645\nxl:      83\n2xl:      8\n$ git grep -ohE '(^|[\" `{])max-(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l\n     170\n$ git grep -ohE '(^|[\" `{])(sm|md|lg|xl):max-(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l\n       0\n$ git grep -ohE '(^|[\" `{])(sm|md|lg|xl|2xl):hidden' -- 'src/*.tsx' | sed -E 's/^[\" `{]//' | sort | uniq -c\n  17 lg:hidden\n  29 md:hidden\n  16 sm:hidden\n   4 xl:hidden\n$ git grep -ohE \"2xl:[^ \\\"'\\`]+\" -- 'src/*.tsx' | sort | uniq -c\n   2 2xl:!hidden\n   1 2xl:grid-cols-[minmax(0,1fr)_340px]\n   1 2xl:grid-cols-3\n   3 2xl:grid-cols-4\n   1 2xl:grid-cols-8\n   1 2xl:hidden\n   1 2xl:pr-20\n   1 2xl:w-[240px]",
 "anh-twc-2-3:r500": {
  "url": "http://127.0.0.1:20112/bpc/p.html",
  "vp": [
   1100,
   330
  ],
  "rect": {
   "#h": [
    16,
    16,
    468,
    36
   ],
   "#m": [
    16,
    64,
    468,
    76
   ],
   "#d": [
    16,
    152,
    468,
    36
   ],
   "#n": [
    16,
    200,
    468,
    28
   ]
  },
  "console": []
 },
 "anh-twc-2-3:r800": {
  "url": "http://127.0.0.1:20112/bpc/p.html",
  "vp": [
   1100,
   330
  ],
  "rect": {
   "#h": [
    16,
    16,
    768,
    60
   ],
   "#m": [
    16,
    88,
    768,
    60
   ],
   "#d": [
    16,
    160,
    768,
    52
   ],
   "#n": null
  },
  "console": []
 },
 "anh-twc-2-3:r1600": {
  "url": "http://127.0.0.1:20112/bpc/p.html",
  "vp": [
   1100,
   330
  ],
  "rect": {
   "#h": [
    16,
    16,
    1568,
    108
   ],
   "#m": [
    16,
    136,
    1568,
    60
   ],
   "#d": [
    16,
    208,
    1568,
    36
   ],
   "#n": null
  },
  "console": []
 },
 "anh-twc-2-3:r1100": {
  "url": "http://127.0.0.1:20112/bpc/p.html",
  "vp": [
   1100,
   330
  ],
  "rect": {
   "#h": [
    16,
    16,
    1568,
    108
   ],
   "#m": [
    16,
    136,
    1568,
    60
   ],
   "#d": [
    16,
    208,
    1568,
    36
   ],
   "#n": null
  },
  "console": [],
  "ketQua": {
   "w500": "[500,\"4px\",\"24px\",\"4px\",\"block\"]",
   "w700": "[700,\"8px\",\"24px\",\"4px\",\"block\"]",
   "w800": "[800,\"16px\",\"16px\",\"12px\",\"none\"]",
   "w1100": "[1100,\"24px\",\"16px\",\"4px\",\"none\"]",
   "w1300": "[1300,\"32px\",\"16px\",\"4px\",\"none\"]",
   "w1600": "[1600,\"40px\",\"16px\",\"4px\",\"none\"]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tn, br, box, two, steps, kw, c, cmp, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-02-3', code: 'TWC 2.3', title: 'Breakpoints win by POSITION, not by specificity', sub: 'Chapter 2 · Lesson 2.3' };
const O = (k) => { const v = DU_LIEU[`t2-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-2-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, vp, o) => br('twc-02-3', ten, { vp, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t2-3 · Tailwind 3.4.19 + 4.3.5 · Chromium 500…1600px · frontend/, 14/11/2026)
const XAO = doan('xao', 'grep -E'), MAX = doan('max3', 'grep -E'), V4 = doan('v4', 'grep -E');
const W = Object.fromEntries(Object.entries(A('r1100').ketQua).map(([k, v]) => [k, JSON.parse(v)]));
const KHO = (dau) => doan('kho', dau).map((l) => l.trim());
const NTSX = +KHO("git ls-files")[0], NBP = +KHO("git grep -lE")[0], NMAX = +KHO("max-(sm|md|lg|xl|2xl):' --")[0], NDAI = +KHO(':max-(sm')[0];
const BP = Object.fromEntries(KHO('for v in sm').map((l) => { const [k, v] = l.split(/\s+/); return [k.replace(':', ''), +v]; }));
const HID = KHO(':hidden'), X2 = KHO('2xl:[^');
const PT = ((NBP / NTSX) * 100).toFixed(1);
if (XAO.join('|') !== '.p-1 {|@media (min-width: 640px) {|@media (min-width: 768px) {|@media (min-width: 1024px) {|@media (min-width: 1280px) {|@media (min-width: 1536px) {') throw new Error('thứ tự đổi');
if (!MAX[1].includes('not all and (min-width: 1024px)') || !MAX[3].includes('(min-width: 768px)')) throw new Error('max đổi');
if (W.w800[2] !== '16px' || W.w800[3] !== '12px' || W.w500[2] !== '24px' || W.w1600[4] !== 'none' || W.w1300[1] !== '32px' || NTSX !== 1673 || NBP !== 671) throw new Error('số đo đổi');
const PAGE = `<div class="2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6"></div>`;
const MAXP = `<div class="p-1 md:p-4 max-md:p-8 max-lg:p-6 md:max-lg:p-3"></div>`;
const bo = (x) => x.replace(/\s+/g, '');
if (!bo(O('file:page.html')).includes(bo(PAGE)) || !bo(O('file:max.html')).includes(bo(MAXP))) throw new Error('mã hiển thị KHÔNG khớp tệp');
const px = (s) => `<b>${s}</b>`;

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.3', t: 'Breakpoints win by<br>POSITION, not specificity', sub: 'md:flex and flex are both 0,1,0. The responsive one wins because Tailwind emits it LATER — measured in the CLI output, in Chromium at six widths, and in this site\'s code',
    en: 'Lesson two point three. Lesson two point one showed that a media query adds no specificity. So if md flex and flex are both zero one zero, how does the responsive one win? Source order. And Tailwind actively makes that order right.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Proof that the order you <b>write</b> breakpoints in means nothing</li>
    <li>Why ascending emit order <b>is</b> the whole mechanism</li>
    <li>"Mobile-first" as the direction of the cascade, not advice</li>
    <li><code>max-*</code>, its reversed order, and the <code>md:max-lg:</code> band</li>
    <li>Reading <code>md:</code> as a <b>threshold</b> — measured on <code>md:hidden</code></li></ul>`,
    en: 'Five takeaways: the order you write breakpoints in means nothing; ascending emit order is the whole mechanism; mobile-first is the direction of the cascade; max variants and the two-sided band; and md as a threshold, not a range.' },
  { t: 'The measurement: the order you WRITE does not matter', body: two(D(html(PAGE, { sm: true }), tn(['$ npx tailwindcss -c tw.config.js -i in.css -o out.css', doan('xao', 'npx tailwindcss')[0], "$ grep -E '^\\.|^@media' out.css", ...XAO].join('\n'), { fs: 16, wrap: 60, title: 'Tailwind 3.4.19 (real)' })),
    D(box('Read it', 'Written: <code>2xl</code>, <code>sm</code>, base, <code>xl</code>, <code>md</code>, <code>lg</code>. Emitted: base, 640, 768, 1024, 1280, 1536 — strictly <b>ascending</b>. Tailwind normalises breakpoint order at generation time.', 'lam'),
      box('So', 'The order of classes in your <code>class</code> attribute is meaningless. It is a <b>set</b>, not a sequence. <code>md:p-4 p-2</code> behaves exactly like <code>p-2 md:p-4</code>.', 'xanh')), 'r64'),
    en: 'The measurement. Breakpoints written deliberately shuffled: two-x-l, small, base, x-l, medium, large. Emitted: base, then six forty, seven sixty-eight, ten twenty-four, twelve eighty, fifteen thirty-six. Strictly ascending. The order you type is meaningless.' },
  { t: 'Why that order IS the mechanism — Chromium at six widths', body: two(D(cmp(['window', 'queries that match', 'padding measured'], [
        ['500px', 'none', px(W.w500[1]) + ' (p-1)'], ['700px', 'sm', px(W.w700[1]) + ' (sm:p-2)'], ['800px', 'sm md', px(W.w800[1]) + ' (md:p-4)'],
        ['1100px', 'sm md lg', px(W.w1100[1]) + ' (lg:p-6)'], ['1300px', 'sm md lg xl', px(W.w1300[1]) + ' (xl:p-8)'], ['1600px', 'all five', px(W.w1600[1]) + ' (2xl:p-10)'],
      ], { hl: [4] })),
    D(box('Read it', 'At 1300px, <b>four</b> media queries match at once. Four rules of equal specificity all apply, so the <b>last one in the file</b> wins — which, because of the ascending order, is the largest matching breakpoint: <code>xl:p-8</code>, 32px.', 'lam'),
      box('Reverse the order and it breaks', 'If the queries were emitted descending, <code>sm:p-2</code> would win at every width above 640px. Every responsive layout depends on this one ordering decision.', 'do2')), 'r64'),
    en: 'Why the order is the mechanism. In Chromium, the same box at six widths: four, eight, sixteen, twenty-four, thirty-two, forty pixels. At thirteen hundred pixels four queries match at once; equal specificity, so the last in the file wins: x-l p-eight. Emitted descending, every layout would break.' },
  { t: 'Consequence: the unprefixed class is the SMALLEST screen', body: two(D(html(`<!-- read: 1 column, then 2 from 768px, then 4 from 1024px -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">`, { sm: true }),
      box('Mobile-first = the direction of the cascade', 'Each breakpoint overrides <b>upward</b> from the base. The base class is not "the default for everything" — it is the <b>narrowest</b> layout.', 'lam')),
    D(box('Not a preference', 'You cannot write desktop-first with <code>min-width</code> breakpoints without fighting the whole system. The base class must always describe the narrowest layout, and each prefix adds a step <b>up</b>.', 'xanh'),
      box('Related', 'Web Foundations 3.5 builds the same thing in plain CSS: <code>@media (min-width: 640px)</code> blocks written mobile-first.', 'lam')), 'r64'),
    en: 'Consequence. Because each breakpoint overrides upward from the base, the unprefixed class is the smallest screen, not the default for everything. Mobile-first is not advice; it is the direction the cascade runs. The base class always describes the narrowest layout.' },
  { t: 'max-* variants, and their REVERSED order', body: two(D(html(MAXP, { sm: true }), tn(["$ grep -E '^\\.|^@media' out2.css", ...MAX].join('\n'), { fs: 16, wrap: 60, title: 'Tailwind 3.4.19 (real)' })),
    D(box('Read it, part 1', '<code>max-lg</code> compiles to <code>not all and (min-width: 1024px)</code>, not <code>max-width: 1023px</code> — logically equal, and it avoids the off-by-one gap of fractional pixel widths.', 'lam'),
      box('Read it, part 2', 'The <code>max-*</code> queries come out <b>descending</b>, and <b>all</b> of them before any <code>min-*</code>. At 500px both max-lg and max-md match; the narrower one comes later and wins.', 'xanh')), 'r64'),
    en: 'Max variants. Max-l-g compiles to not all and min-width ten twenty-four, which avoids the off-by-one gap of fractional pixel widths. They come out descending, and every max rule comes before every min rule. At five hundred pixels the narrower one is later and wins.' },
  { t: 'Mixing min- and max-: where it gets sharp', body: two(D(B('r800', 800, { url: 'bpc/p.html · 800px wide · Tailwind 3.4.19', h: 300, w: 560 })),
    D(cmp(['class list', '500px', '800px', '1100px'], [
        ['<code>p-1 md:p-4 max-lg:p-6</code>', px(W.w500[2]), px(W.w800[2]), px(W.w1100[2])],
        ['<code>p-1 md:max-lg:p-3</code>', px(W.w500[3]), px(W.w800[3]), px(W.w1100[3])],
      ], { hl: [0] }),
      box('Read it', 'At 800px <b>both</b> <code>max-lg:p-6</code> and <code>md:p-4</code> match. <code>md:p-4</code> wins (16px) because every <code>min-*</code> rule is emitted after every <code>max-*</code> — even if max-lg was arguably the more specific intent.', 'do2'),
      box('For a band, use both ends', '<code>md:max-lg:p-3</code> applies only between 768 and 1024: measured 12px at 800, 4px outside.', 'xanh')), 'r46'),
    en: 'Mixing min and max. At eight hundred pixels both max-l-g p-six and m-d p-four match, and m-d wins with sixteen pixels, because every min rule comes after every max rule. For a range, write both ends: m-d max-l-g p-three is twelve pixels at eight hundred, four outside.' },
  { t: 'The weakness that follows from ZERO specificity', body: two(D(css(`/* in globals.css — specificity 0,2,0 */
.card .title { display: block; }`, { sm: true }), html(`<!-- md:flex is 0,1,0 and LOSES at every width -->
<div class="card"><h3 class="title md:flex">…</h3></div>`, { sm: true })),
    D(box('Read it', 'Because <code>md:flex</code> is 0,1,0, <b>any</b> hand-written rule with two classes beats it — at every screen size. Lesson 2.1 measured this in Chromium: <code>block</code> at 900px in both load orders.', 'do2'),
      box('The tell-tale symptom', 'The responsive class does nothing at every breakpoint, while a <code>hover:</code> class on the same element (0,2,0) still works when the hand rule comes first. Recognising that asymmetry saves an afternoon.', 'lam')), 'r46'),
    en: 'The weakness. Because m-d flex is zero one zero, any hand-written rule with two classes beats it at every screen size; lesson two point one measured it. The symptom: the responsive class does nothing anywhere, while a hover class on the same element may still work.' },
  { t: 'Responsive coverage in this site — counted today', body: two(D(tn(["$ git ls-files 'src/*.tsx' | wc -l", String(NTSX), "$ git grep -lE '(^|[\" `{])(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l", String(NBP)].join('\n'), { fs: 15, wrap: 56, title: 'frontend/ · 14/11/2026 (real)' }),
      meter(Object.entries(BP).map(([k, v]) => [k + ':', v]), { don: '', nhan: 70, fs: 16, rh: 34, w: 480 })),
    D(box('Read it', `<b>${NBP}</b> of <b>${n(NTSX)}</b> .tsx files (${PT}%) carry at least one breakpoint (the lesson measured 372 of 793, 47%). The skew towards <code>sm:</code> says most responsive work here is <b>one jump</b> from phone to everything else.`, 'lam'),
      box('Correction: 2xl: is not an accident', `The lesson said the single <code>2xl:</code> use is "almost certainly an accident". Today: ${X2.length} distinct <code>2xl:</code> classes (grid columns, widths, <code>2xl:hidden</code>…) — deliberate wide-screen layouts. And <code>max-*:</code> ${NMAX} uses; the <code>md:max-lg:</code> band: ${NDAI}.`, 'do2')), 'r46'),
    en: 'Coverage today. Six hundred seventy-one of one thousand six hundred seventy-three files, about forty percent, carry a breakpoint. The skew to small says most responsive work is one jump from phone to everything else. And two-x-l is no longer a single accident: eight deliberate wide-screen layouts.' },
  { t: 'Trap: reading md: as "on medium screens"', body: two(D(B('r1600', 1600, { url: 'bpc/p.html · 1600px wide', h: 300, w: 560 }),
      cmp(['window', '<code>md:hidden</code> element'], [['500px', W.w500[4]], ['700px', W.w700[4]], ['800px', `<b>${W.w800[4]}</b>`], ['1600px', `<b>${W.w1600[4]}</b>`]])),
    D(box('Read it', '<code>md:</code> means "at 768px <b>and up</b>". <code>md:hidden</code> to hide something on tablets also hides it on <b>every</b> desktop — measured: gone at 800px and still gone at 1600px.', 'do2'),
      box('In this site', `${HID.map((l) => '<code>' + l.replace(/^(\d+)\s+/, '$1 × ') + '</code>').join(' · ')} — each one is "from that width up". To target a band you need both ends: <code>md:max-lg:hidden</code>.`, 'lam')), 'r46'),
    en: 'The trap: reading m-d as on medium screens. It means seven sixty-eight and up. M-d hidden to hide something on tablets also hides it on every desktop: measured, gone at eight hundred and still gone at sixteen hundred. To target a band, write both ends.' },
  { t: 'Tailwind 4: rem breakpoints, the same ordering', body: two(D(tn(["$ … out.css | grep -E '^ *(@|\\.)'", ...V4].join('\n'), { fs: 13, wrap: 60, title: 'Tailwind 4.3.5 (real)' })),
    D(box('Same mechanism', 'Still mobile-first, still sorted: all <code>max-*</code> first (descending), then <code>min-*</code> ascending. A band like <code>md:max-lg:p-3</code> is now a <b>nested</b> <code>@media</code> inside the <code>md</code> block.', 'xanh'),
      box('What changed', 'Breakpoints are <b>rem</b> and use range syntax: <code>(width &gt;= 48rem)</code>, <code>(width &lt; 64rem)</code>. 48rem = 768px only while the root font is 16px — raise it and every breakpoint moves. They are theme variables: <code>--breakpoint-md</code> in <code>@theme</code>.', 'lam')), 'r46'),
    en: 'Tailwind four: same mechanism. Max rules first, descending, then min rules ascending; a band is a nested media query. What changed: breakpoints are rem with range syntax, width at least forty-eight rem. That equals seven sixty-eight only while the root font is sixteen pixels.' },
  { t: 'Why breakpoint order in a class attribute means nothing', body: steps([
      '<b>Every responsive utility has zero extra specificity</b> — <code>md:p-4</code> is a plain class inside a media query',
      '<b>So the winner is the order in the stylesheet</b> — and Tailwind always emits breakpoints ascending, whatever order you typed',
      '<b>That is why mobile-first works</b> — the base applies everywhere and each larger breakpoint overrides it, because it is emitted later',
      '<b>And why <code>md:p-4 p-2</code> = <code>p-2 md:p-4</code></b> — the class attribute is a set, not a sequence',
    ]),
    en: 'Why the order in the class attribute means nothing: responsive utilities add no specificity; so the winner is the stylesheet order; Tailwind always emits ascending; that is why mobile-first works; and why the class attribute is a set, not a sequence.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'Rotate your phone to landscape and you cross 640 or 768px — the layout jumps. A laptop at 125% Windows display scaling has a <b>narrower</b> CSS width than its pixels and gets the tablet layout.', 'lam'),
      box('What if… the browser font is set to 20px?', 'Tailwind 4 breakpoints are rem: <code>md</code> = 48rem = 48 × 20 = <b>960px</b>. The desktop layout now starts at 960px — a surprise if you only test at 16px. Tailwind 3 px breakpoints do not move.', 'xanh')),
    D(box('The attacker\'s view: dark patterns by width', 'A fee line or the "cancel subscription" link inside <code>hidden md:block</code> exists only on desktop; on the phone where most people pay, it is not there. Scam pages do the reverse: an "official" badge only at phone widths.', 'do2'),
      box('Defend', 'Before paying or signing, view the page at two widths (DevTools device toolbar, or rotate the phone). As a developer: never put required text behind a breakpoint.', 'ok')), 'r46'),
    en: 'In real life: rotating a phone crosses a breakpoint; a laptop at one hundred twenty-five percent scaling gets the tablet layout. What if the font is enlarged? Tailwind four rem breakpoints move: m-d becomes nine hundred sixty pixels. And the dark pattern: fees or a cancel link hidden only on mobile. Check two widths before you pay.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('source-order win', 'equal specificity ⇒ later rule'), kw('ascending emit order', 'sm → md → lg → xl → 2xl'), kw('mobile-first', 'base = narrowest layout'),
      kw('max-* variants', 'not all and (min-width: X)'), kw('two-sided band', 'md:max-lg:'), kw('threshold, not range', 'md: = 768px and up'),
      kw('zero-specificity weakness', 'any 0,2,0 hand rule wins'), kw('rem breakpoints (v4)', 'width >= 48rem'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: source-order win; ascending emit order; mobile-first; max variants; the two-sided band; threshold, not range; the zero-specificity weakness; and Tailwind four rem breakpoints.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Shuffle six breakpoints on one element, build, and grep the @media lines',
      'Resize Chromium through 500 → 1600px and log the computed padding at each width',
      `Combine ${c('max-lg:p-6')} with ${c('md:p-4')}: predict the winner at 800px, then measure`,
      `Grep your project for ${c('md:hidden')} and check each one is meant for EVERY desktop`,
    ]), box('Keep these', '<ul><li>Breakpoints win by position, not specificity</li><li>min-* ascending, max-* descending and first</li><li>Base class = narrowest screen</li><li>md: is a threshold — bands need both ends</li></ul>', 'lam'), ''),
    en: 'Your turn: shuffle six breakpoints and read the output order; resize Chromium and log the padding; predict the winner of max-l-g against m-d at eight hundred pixels; and check every m-d hidden in your project. Keep: breakpoints win by position.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Variants, and what they compile to', bai: '2.3' }, S);
