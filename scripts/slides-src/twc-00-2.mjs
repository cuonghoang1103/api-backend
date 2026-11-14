/*DU_LIEU*/
const DU_LIEU = {
 "t0-2:kho": "$ for v in hover focus active disabled group-hover focus-visible sm md lg xl 2xl; do printf \"%-14s %6d\\n\" \"$v:\" \"$(grep -rho \"\\b$v:\" src --include=\"*.tsx\" | wc -l)\"; done\nhover:           5242\nfocus:           1028\nactive:           284\ndisabled:         838\ngroup-hover:      312\nfocus-visible:    346\nsm:              2112\nmd:               734\nlg:               652\nxl:                87\n2xl:               11\n$ grep -rho 'style={{' src --include=\"*.tsx\" | wc -l | sed 's/^ */style={{ … }}: /'\nstyle={{ … }}: 6036",
 "t0-2:file:input.css": "@import \"tailwindcss\";\n",
 "t0-2:file:index.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-4 p-6 text-xl\">\n  <button id=\"inl\" style=\"background:#0891b2; color:#fff; padding:8px 16px; border-radius:8px\">inline style</button>\n  <button id=\"tw\" class=\"rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-800 md:px-10\">Tailwind</button>\n  <div class=\"h-4 w-80 rounded bg-slate-200\"><div id=\"pct\" class=\"h-4 rounded bg-cyan-600\" style=\"width: 37%\"></div></div>\n  <div class=\"h-4 w-80 rounded bg-slate-200\"><div id=\"bien\" class=\"h-4 w-(--pct) rounded bg-cyan-600 hover:bg-amber-500\" style=\"--pct: 37%\"></div></div>\n</body></html>\n",
 "t0-2:inl": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 40ms\n$ grep -nE '@media \\(hover|hover\\\\:bg-cyan-800|--color-cyan-800\\)' out.css\n218:  @media (hover: hover) {\n222:    .hover\\:bg-cyan-800:hover {\n223:      background-color: var(--color-cyan-800);\n$ grep -B1 -A3 'md\\\\:px-10 {' out.css | head -5\n  @media (width >= 48rem) {\n    .md\\:px-10 {\n      padding-inline: calc(var(--spacing) * 10);\n    }\n  }\n$ grep -A2 'w-\\\\(--pct\\\\) {' out.css\n  .w-\\(--pct\\) {\n    width: var(--pct);\n  }",
 "anh-twc-0-2:rong": {
  "url": "http://127.0.0.1:20103/index.html",
  "vp": [
   900,
   300
  ],
  "rect": {
   "#inl": [
    24,
    24,
    124,
    44
   ],
   "#tw": [
    153,
    24,
    150,
    44
   ],
   "#pct": [
    24,
    84,
    118,
    16
   ],
   "#bien": [
    24,
    116,
    118,
    16
   ]
  },
  "console": [],
  "ketQua": {
   "truoc": "[[\"inl\",\"rgb(8, 145, 178)\",\"16px\"],[\"tw\",\"oklch(0.609 0.126 221.723)\",\"40px\"]]"
  }
 },
 "anh-twc-0-2:hover-inl": {
  "url": "http://127.0.0.1:20103/index.html",
  "vp": [
   900,
   300
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "inl": "rgb(8, 145, 178)"
  }
 },
 "anh-twc-0-2:hover-tw": {
  "url": "http://127.0.0.1:20103/index.html",
  "vp": [
   900,
   300
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "tw": "oklch(0.45 0.085 224.283)"
  }
 },
 "anh-twc-0-2:hep": {
  "url": "http://127.0.0.1:20103/index.html",
  "vp": [
   500,
   300
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "hep": "[[\"inl\",\"16px\"],[\"tw\",\"16px\"]]"
  }
 },
 "anh-twc-0-2:bien": {
  "url": "http://127.0.0.1:20103/index.html",
  "vp": [
   900,
   300
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "bien": "[[\"pct\",\"118.391px\",\"oklch(0.609 0.126 221.723)\"],[\"bien\",\"118.391px\",\"oklch(0.769 0.188 70.08)\"]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, tsx, tn, br, box, two, steps, kw, c, cmp, icards, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-00-2', code: 'TWC 0.2', title: '"This is just inline styles" — measuring the objection', sub: 'Section 0 · Lesson 0.2' };
const O = (k) => { const v = DU_LIEU[`t0-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-0-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-00-2', ten, { vp: 900, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t0-2 · Tailwind 4.3.5 · Chromium · frontend/ 14/11/2026)
const DEM = Object.fromEntries(doan('kho', 'for v in').map((l) => { const m = l.match(/^(\S+):\s+(\d+)/); return [m[1], +m[2]]; }));
const TT = ['hover', 'focus', 'active', 'disabled', 'group-hover', 'focus-visible'], DN = ['sm', 'md', 'lg', 'xl', '2xl'];
const TONG_TT = TT.reduce((s, k) => s + DEM[k], 0), TONG_DN = DN.reduce((s, k) => s + DEM[k], 0);
const STYLE = doan('kho', 'style={{')[0].match(/(\d+)$/)[1];
const RONG = JSON.parse(A('rong').ketQua.truoc), HEP = JSON.parse(A('hep').ketQua.hep), BIEN = JSON.parse(A('bien').ketQua.bien);
const HI = A('hover-inl').ketQua.inl, HT = A('hover-tw').ketQua.tw;
if (HI !== RONG[0][1] || HT === RONG[1][1] || RONG[1][2] !== '40px' || HEP[1][1] !== '16px' || TONG_TT + TONG_DN !== 11646 || STYLE !== '6036') throw new Error('số đo đổi');
const MA = `<button id="inl" style="background:#0891b2; color:#fff;
        padding:8px 16px; border-radius:8px">inline style</button>
<button id="tw" class="rounded-lg bg-cyan-600 px-4 py-2
        text-white hover:bg-cyan-800 md:px-10">Tailwind</button>`;

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.2', t: '"This is just inline styles"<br>— measuring the objection', sub: 'Everyone says it on day one. The resemblance is real; the claim that they are equivalent is false in a way you can count — on a real page in Chromium, and in this site\'s own code',
    en: 'Lesson zero point two: "this is just inline styles". Everyone says it on day one. The resemblance is real, but the claim that they are equivalent is false in a way you can count, in Chromium and in this site\'s own code.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Where the objection is right: both put presentation in the markup</li>
    <li>Where it is wrong: <code>style=""</code> has no syntax for a condition</li>
    <li>Measured in Chromium: hover and a breakpoint, inline vs utility</li>
    <li>Counted in this site\'s code: how often an app needs conditions</li>
    <li>What inline style is still <b>for</b> — and the honest costs of utilities</li></ul>`,
    en: 'Five takeaways: where the objection is right; where it is wrong, because the style attribute has no syntax for a condition; that difference measured in Chromium; counted in this site\'s code; and what inline style is still for, with the honest costs of utilities.' },
  { t: 'Admit the resemblance', body: two(D(tsx(`<div style={{ display: 'flex', alignItems: 'center',
              padding: '1rem' }}>

<div className="flex items-center p-4">`, { sm: false })),
    D(box('It is a real resemblance', 'Both put presentation <b>in the markup</b>. Both make an element\'s look readable where it is used. Both mean a redesign touches component files, not one stylesheet.', 'lam'),
      box('A real disagreement', 'If your objection is "styling belongs in a separate file", utilities do not answer it — they <b>disagree</b> with it. That is a design choice, not a misunderstanding.', 'xanh')), ''),
    en: 'First, admit the resemblance. An inline style and a row of utilities both put presentation in the markup, both make the look readable where it is used, and both mean a redesign touches component files. If your objection is that styling belongs in a separate file, utilities simply disagree with it. That is a real design choice.' },
  { t: 'Where the resemblance stops', body: cmp(['You need…', 'inline style=""', 'utility class'], [
      ['a plain value: padding 1rem', '✅ <code>padding:1rem</code>', '✅ <code>p-4</code>'],
      ['darker on hover', '❌ no syntax', '✅ <code>hover:bg-cyan-800</code>'],
      ['wider padding from 768px', '❌ no syntax', '✅ <code>md:px-10</code>'],
      ['a ring only for keyboard focus', '❌ no syntax', '✅ <code>focus-visible:ring-2</code>'],
      ['a style in dark mode', '❌ no syntax', '✅ <code>dark:bg-slate-900</code>'],
    ]) + box('Why', 'The <code>style</code> attribute only accepts <b>declarations</b>. Conditions — <code>:hover</code>, <code>@media</code>, <code>::before</code> — live in <b>selectors</b>, and an attribute has no selector. Not clumsy: impossible.', 'do2'),
    en: 'Where the resemblance stops. A plain value works both ways. But darker on hover, wider padding from seven hundred sixty-eight pixels, a ring only for keyboard focus, a dark-mode colour: the style attribute has no syntax for any of them. It only accepts declarations; conditions live in selectors, and an attribute has no selector.' },
  { t: 'Measured in Chromium: hover and a breakpoint', body: two(D(html(MA, { sm: true, hl: [3, 4] }), tn(['# Chromium · getComputedStyle(button)', `inline  background   ${RONG[0][1]}`, `inline  on hover     ${HI}`, `utility background   ${RONG[1][1]}`, `utility on hover     ${HT}`, `inline  padding-left 900px: ${RONG[0][2]}  500px: ${HEP[0][1]}`, `utility padding-left 900px: ${RONG[1][2]}  500px: ${HEP[1][1]}`].join('\n'), { fs: 14, wrap: 64, title: 'Chromium (real)' })),
    D(B('hover-tw', { url: 'hover on the Tailwind button — 900px wide', h: 160, w: 470, mark: [[153, 24, 150, 44, 'hover + md:px-10']] }), B('hep', { url: 'the same page at 500px', h: 150, w: 470, vp: 500 }),
      box('Read it', 'Hover: the inline button does not change; the utility button goes darker. Width: from 768px the utility button gets 40px padding, below it 16px. The inline button cannot react to either.', 'lam')), 'r64'),
    en: 'Measured in Chromium. Hover over the inline button: the background does not change. Hover over the utility button: it goes darker. At nine hundred pixels wide the utility button has forty pixels of padding, at five hundred it has sixteen. The inline button cannot react to either.' },
  { t: 'What the utilities compiled to', body: two(D(tn(['$ grep -nE \'@media \\(hover|hover\\\\:bg-cyan-800\' out.css', ...doan('inl', '@media \\(hover'), '$ grep -B1 -A3 \'md\\\\:px-10 {\' out.css', ...doan('inl', 'md\\\\:px-10')].join('\n'), { fs: 16, title: 'Tailwind 4.3.5 output (real)' })),
    D(box('A reference, not a style', 'A utility class is a <b>named reference to a rule in a stylesheet</b>. Because the rule lives in a stylesheet, it gets everything stylesheets have: <code>@media</code>, <code>:hover</code>, the cascade. The reference sits in the markup; the rule does not.', 'xanh'),
      box('Tailwind 4 detail', 'Even <code>hover:</code> is wrapped in <code>@media (hover: hover)</code> — on a touch screen without a pointer, no sticky hover colour.', 'lam')), 'r64'),
    en: 'What the utilities compiled to. hover colon became a hover rule, and in Tailwind four it is wrapped in a media query for devices that can hover, so touch screens do not get a sticky colour. md colon became a rule inside a min-width media query. A utility is a named reference to a rule in a stylesheet; the rule gets everything stylesheets have.' },
  { t: 'Counted in this site\'s code', body: two(D(tn(['$ for v in hover … 2xl; do', '    grep -rho "\\b$v:" src | wc -l; done', ...doan('kho', 'for v in')].join('\n'), { fs: 15, title: 'frontend/ · 14/11/2026 (real)' })),
    D(meter([['states (hover, focus…)', TONG_TT, '#0891b2'], ['breakpoints (sm…2xl)', TONG_DN, '#7c3aed']], { don: '', nhan: 210, w: 460, fs: 16, rh: 52 }),
      box('Read it', `<b>${n(TONG_TT + TONG_DN)}</b> places in this app express something <code>style=""</code> has no syntax for (the lesson measured 7,758 when the app was half the size).`, 'lam'),
      box('Know what the command counts', `<code>\\bhover:</code> also matches inside <code>group-hover:</code> (${n(DEM['group-hover'])}), so the honest total is a little lower — still over ${n(TONG_TT + TONG_DN - DEM['group-hover'])}.`, 'do2')), 'r64'),
    en: 'Counted in this site\'s code today: about eight thousand state variants and three thousand six hundred breakpoints, eleven thousand six hundred places that inline style cannot express. And know what the command counts: the hover pattern also matches inside group-hover, so the honest total is a little lower, still over eleven thousand three hundred.' },
  { t: 'What inline style is still for', body: two(D(html(`<!-- a runtime value -->
<div style="width: 37%"> … </div>
<!-- through a CSS variable -->
<div class="w-(--pct) hover:bg-amber-500"
     style="--pct: 37%"> … </div>`, { sm: true }),
      tn(['# Chromium · width / background (hovering the second bar)', ...BIEN.map(([i, w, b]) => `${i.padEnd(5)} ${w.padEnd(11)} ${b}`), '$ grep -A2 \'w-\\(--pct\\) {\' out.css', ...doan('inl', 'w-\\\\(--pct')].join('\n'), { fs: 14, wrap: 56, title: 'Chromium + output (real)' })),
    D(B('bien', { url: 'hovering the second bar', h: 150, w: 430 }),
      box('The right boundary', `This app still uses <code>style={{…}}</code> <b>${n(STYLE)}</b> times — correctly, for values computed at runtime: a progress width, a chart bar, a colour from the database. A class cannot exist for a value the generator never saw (lesson 0.1).`, 'xanh'),
      box('Best of both', 'Need hover on a runtime value? Put the value in a CSS variable and point a utility at it: <code>w-(--pct)</code> (Chapter 6).', 'lam')), 'r64'),
    en: 'What inline style is still for: values computed at runtime. This app uses inline styles about six thousand times, correctly: a progress width, a chart bar, a colour from the database. A class cannot exist for a value the generator never saw. And if you need hover on such a value, put it in a CSS variable and point a utility at it; both bars measure the same width, and the second one changes colour on hover.' },
  { t: 'Which one, when', body: two(box('Use a utility class', 'The value comes from a <b>fixed set known at build time</b>: spacing, your colour palette, breakpoints, states, typography. It goes into the stylesheet, is de-duplicated across every use, and can carry variants.', 'xanh'),
      box('Use inline style (or a CSS variable)', 'The value is <b>computed at runtime</b> and unbounded: <code>width: ${pct}%</code>, a canvas position, a colour from an API. No variants — unless you route it through a variable (Chapter 6).', 'lam'), '') +
    steps(['Can I list every value in advance? ⇒ utility', 'Is it a number from data? ⇒ inline style', 'Data value but needs hover / dark / a breakpoint? ⇒ CSS variable + utility']),
    en: 'Which one, when. If you can list every value in advance, spacing, palette colours, breakpoints, states, use a utility. If the value comes from data at runtime, use an inline style. And if a data value needs hover, dark mode or a breakpoint, route it through a CSS variable and a utility.' },
  { t: 'The real costs, said honestly', body: icards([
      ['list', 'Noisier markup', 'A long class list is harder to scan than one semantic name. Fix: extract a component, not a shorter class list (Ch. 4).'],
      ['type', 'You must learn the scale', 'A few days up front. That is Chapter 1 — and why learning the scale beats memorising names.'],
      ['merge', 'Conflicts resolve surprisingly', 'Two utilities on one property: the winner is not the one you wrote last (Ch. 3).'],
      ['search', 'Finding a colour is harder', '"Where is this blue used?" is hundreds of hits across components. Fix: name colours in the config (Ch. 5).'],
    ], 2),
    en: 'The real costs, said honestly. Noisier markup, fixed by extracting components. A scale you must learn up front, which is chapter one. Conflicts that resolve surprisingly, chapter three. And harder searches for a colour, fixed by naming colours in the configuration, chapter five.' },
  { t: 'Trap: answering with a slogan', body: two(box('Slogan', '"Utilities scale better." — a claim; the other person is right not to believe it. A slogan keeps the argument going.', 'do2'),
      box('Number', `"<code>style</code> has no syntax for hover or a breakpoint — and here are <b>${n(TONG_TT + TONG_DN)}</b> places this app needs exactly that." A number ends the argument.`, 'xanh'), '') +
    box('One sentence', 'A utility class resembles an inline style only in <b>where it is referenced</b>. It is a reference to a stylesheet rule — so it gets media queries, pseudo-classes and the cascade, which the style attribute has no syntax for.', 'lam'),
    en: 'The trap: answering the objection with a slogan like "utilities scale better". That keeps the argument going. Answer with a number: the style attribute has no syntax for hover or a breakpoint, and here are eleven thousand places this app needs exactly that. A number ends the argument.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Inline style', 'style="" — declarations only, no selector'), kw('Utility class', 'a named reference to a stylesheet rule'),
      kw('Variant', 'a condition prefix: hover:, md:'), kw('State variant', 'hover, focus, active, disabled…'),
      kw('Breakpoint', 'sm/md/lg… = min-width media queries'), kw('Runtime value', 'computed from data ⇒ inline or a variable'),
      kw('CSS variable', '--pct: 37% ⇒ w-(--pct)'), kw('@media (hover: hover)', 'v4 wraps hover: in it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: inline style; utility class; variant; state variant; breakpoint; runtime value; CSS variable; and the hover media query Tailwind four wraps around hover.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Two buttons: one ${c('style=""')}, one with ${c('hover:')} and ${c('md:')} — hover and resize in DevTools`,
      `Open the built CSS: find the ${c(':hover')} rule and the ${c('@media')} block`,
      `A progress bar from a variable: inline ${c('width')}, then ${c('w-(--pct)')} with a hover colour`,
      `Count ${c('hover:')} in a project of yours — and check what your grep matched`,
    ]), box('Keep these', '<ul><li>Same place in the markup, different power</li><li><code>style=""</code> has no selector ⇒ no hover, no breakpoints</li><li>A utility references a stylesheet rule</li><li>Runtime values ⇒ inline or a CSS variable</li><li>Answer with a number</li></ul>', 'lam'), ''),
    en: 'Your turn: build both buttons and test hover and width in DevTools; find the hover rule and the media block in the built CSS; build a progress bar from a variable, then with a CSS variable and hover; and count hover in your own project, checking what the grep matched. Keep: same place, different power; and answer with a number.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Tailwind actually is', bai: '0.2' }, S);
