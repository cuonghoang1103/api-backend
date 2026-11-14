/*DU_LIEU*/
const DU_LIEU = {
 "t2-1:file:tw.config.js": "module.exports = { content: ['./*.html'] };\n",
 "t2-1:file:in.css": "@import \"tailwindcss\";\n",
 "t2-1:file:page.html": "<div class=\"hover:bg-blue-500 md:flex group-hover:opacity-50\n            peer-checked:block dark:text-white flex\"></div>\n",
 "t2-1:v3": "$ node -p \"require('tailwindcss/package.json').version\"\n3.4.19\n$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 93ms.\n$ cat out.css\n.flex {\n  display: flex\n}\n\n.hover\\:bg-blue-500:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1))\n}\n\n.group:hover .group-hover\\:opacity-50 {\n  opacity: 0.5\n}\n\n.peer:checked ~ .peer-checked\\:block {\n  display: block\n}\n\n.dark\\:text-white:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1))\n}\n\n@media (min-width: 768px) {\n  .md\\:flex {\n    display: flex\n  }\n}",
 "t2-1:v4": "$ node -p \"require('tailwindcss/package.json').version\"\n4.3.5\n$ npx @tailwindcss/cli -i in.css -o out.css 2>&1 | tail -1\nDone in 23ms\n$ sed -n '/^@layer utilities {/,/^}/p' out.css\n@layer utilities {\n  .flex {\n    display: flex;\n  }\n  @media (hover: hover) {\n    :is(:where(.group):hover .group-hover\\:opacity-50) {\n      opacity: 50%;\n    }\n  }\n  :is(:where(.peer):checked ~ .peer-checked\\:block) {\n    display: block;\n  }\n  @media (hover: hover) {\n    .hover\\:bg-blue-500:hover {\n      background-color: var(--color-blue-500);\n    }\n  }\n  @media (width >= 48rem) {\n    .md\\:flex {\n      display: flex;\n    }\n  }\n  @media (prefers-color-scheme: dark) {\n    .dark\\:text-white {\n      color: var(--color-white);\n    }\n  }\n}\n$ sed -n '/^@layer utilities {/,/^}/p' out.css | grep -E '^ *(@|\\.|:)'\n@layer utilities {\n  .flex {\n  @media (hover: hover) {\n    :is(:where(.group):hover .group-hover\\:opacity-50) {\n  :is(:where(.peer):checked ~ .peer-checked\\:block) {\n  @media (hover: hover) {\n    .hover\\:bg-blue-500:hover {\n  @media (width >= 48rem) {\n    .md\\:flex {\n  @media (prefers-color-scheme: dark) {\n    .dark\\:text-white {",
 "t2-1:file:page-dark.html": "<div class=\"dark:text-white\"></div>\n",
 "t2-1:v4dark": "$ npx @tailwindcss/cli -i in.css -o out.css 2>&1 | tail -1\nDone in 29ms\n$ grep -A6 'dark\\\\:text-white' out.css\n  .dark\\:text-white:where(.dark, .dark *) {\n    color: var(--color-white);\n  }\n}",
 "t2-1:kho": "$ node -p \"require('tailwindcss/package.json').version\"\n3.4.19\n$ for v in hover focus disabled group-hover peer- dark sm md lg xl 2xl; do printf \"%-12s %6d\\n\" \"$v:\" \"$(git grep -ohE \"(^|[\\\"' \\`{])$v[a-z-]*:\" -- 'src/*.tsx' | wc -l)\"; done\nhover:         4729\nfocus:         1395\ndisabled:       838\ngroup-hover:    293\npeer-:            2\ndark:          1098\nsm:            2015\nmd:             654\nlg:             645\nxl:              87\n2xl:              8",
 "t2-1:file:tay.css": "/* CSS viết tay — độ đặc hiệu 0,2,0, KHÔNG nằm trong @layer nào */\n.card .title { display: block; }\n",
 "t2-1:file:sau.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"><link rel=\"stylesheet\" href=\"tay.css\"></head>\n<body style=\"font:24px system-ui;margin:16px\">\n<div class=\"card\"><h3 id=\"a\" class=\"title md:flex gap-2 rounded bg-slate-100 p-2\"><div class=\"w-44 rounded bg-cyan-200 px-2\">md:flex</div><div class=\"w-44 rounded bg-cyan-200 px-2\">B</div><div class=\"w-44 rounded bg-cyan-200 px-2\">C</div></h3></div>\n<div class=\"card\"><h3 id=\"b\" class=\"title hover:flex gap-2 rounded bg-slate-100 p-2\"><div class=\"w-44 rounded bg-amber-200 px-2\">hover:flex</div><div class=\"w-44 rounded bg-amber-200 px-2\">B</div><div class=\"w-44 rounded bg-amber-200 px-2\">C</div></h3></div>\n</body></html>\n",
 "t2-1:file:truoc.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"tay.css\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body style=\"font:24px system-ui;margin:16px\">\n<div class=\"card\"><h3 id=\"a\" class=\"title md:flex gap-2 rounded bg-slate-100 p-2\"><div class=\"w-44 rounded bg-cyan-200 px-2\">md:flex</div><div class=\"w-44 rounded bg-cyan-200 px-2\">B</div><div class=\"w-44 rounded bg-cyan-200 px-2\">C</div></h3></div>\n<div class=\"card\"><h3 id=\"b\" class=\"title hover:flex gap-2 rounded bg-slate-100 p-2\"><div class=\"w-44 rounded bg-amber-200 px-2\">hover:flex</div><div class=\"w-44 rounded bg-amber-200 px-2\">B</div><div class=\"w-44 rounded bg-amber-200 px-2\">C</div></h3></div>\n</body></html>\n",
 "t2-1:doi3": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 100ms.\n$ grep -B1 -A2 -E '^\\.hover\\\\:flex:hover|^  \\.md\\\\:flex' out.css\n\n.hover\\:flex:hover {\n  display: flex\n}\n--\n@media (min-width: 768px) {\n  .md\\:flex {\n    display: flex\n  }",
 "t2-1:doi4": "$ npx @tailwindcss/cli -i in.css -o out.css 2>&1 | tail -1\nDone in 25ms\n$ grep -c '^@layer' out.css\n4",
 "anh-twc-2-1:sau3": {
  "url": "http://127.0.0.1:20110/doi3/sau.html",
  "vp": [
   900,
   300
  ],
  "rect": {
   "#a": [
    16,
    28,
    868,
    115
   ],
   "#b": [
    16,
    171,
    868,
    115
   ]
  },
  "console": [],
  "ketQua": {
   "d": "[[\"a\",\"block\",900,false],[\"b\",\"block\",900,true]]"
  }
 },
 "anh-twc-2-1:truoc3": {
  "url": "http://127.0.0.1:20110/doi3/truoc.html",
  "vp": [
   900,
   300
  ],
  "rect": {
   "#a": [
    16,
    28,
    868,
    115
   ],
   "#b": [
    16,
    171,
    868,
    49
   ]
  },
  "console": [],
  "ketQua": {
   "d": "[[\"a\",\"block\",900,false],[\"b\",\"flex\",900,true]]"
  }
 },
 "anh-twc-2-1:truoc4": {
  "url": "http://127.0.0.1:20110/doi4/truoc.html",
  "vp": [
   900,
   300
  ],
  "rect": {
   "#a": [
    16,
    16,
    868,
    100
   ],
   "#b": [
    16,
    116,
    868,
    100
   ]
  },
  "console": [],
  "ketQua": {
   "d": "[[\"a\",\"block\",900,false],[\"b\",\"block\",900,true]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tn, br, box, two, steps, kw, c, cmp, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-02-1', code: 'TWC 2.1', title: 'Five variant shapes, read from the output', sub: 'Chapter 2 · Lesson 2.1' };
const O = (k) => { const v = DU_LIEU[`t2-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-2-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-02-1', ten, { vp: 900, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t2-1 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/, 14/11/2026)
const V3 = doan('v3', 'cat out.css').join('\n').trim();
const V4 = doan('v4', "sed -n").join('\n').trim();
const V4K = doan('v4', "| grep -E").join('\n').trim();
const V4D = doan('v4dark', 'grep -A6').join('\n').trim();
const KHO = Object.fromEntries(doan('kho', 'for v in').map((l) => { const [k, v] = l.trim().split(/\s+/); return [k.replace(/:$/, ''), +v]; }));
const DD = (k) => Object.fromEntries(JSON.parse(A(k).ketQua.d).map(([i, d, w, h]) => [i, { d, w, h }]));
const SAU3 = DD('sau3'), TRUOC3 = DD('truoc3'), TRUOC4 = DD('truoc4');
if (doan('v3', 'node -p')[0] !== '3.4.19' || doan('v4', 'node -p')[0] !== '4.3.5') throw new Error('phiên bản đổi');
if (!V3.includes('.dark\\:text-white:is(.dark *)') || !V3.includes('.peer:checked ~ .peer-checked\\:block') || !V4.includes('@media (hover: hover)') || !V4D.includes(':where(.dark, .dark *)')) throw new Error('đầu ra đổi');
if (SAU3.a.d !== 'block' || SAU3.b.d !== 'block' || TRUOC3.a.d !== 'block' || TRUOC3.b.d !== 'flex' || TRUOC4.b.d !== 'block' || !SAU3.b.h || !TRUOC3.b.h || !TRUOC4.b.h || SAU3.a.w !== 900) throw new Error('số đo Chromium đổi');
const PAGE = `<div class="hover:bg-blue-500 md:flex
            group-hover:opacity-50
            peer-checked:block
            dark:text-white flex"></div>`;
const TAY = `.card .title { display: block; }`;
const bo = (x) => x.replace(/\s+/g, '');
if (!bo(O('file:page.html')).includes(bo(PAGE))) throw new Error('mã hiển thị KHÔNG khớp page.html');
if (!bo(O('file:tay.css')).includes(bo(TAY))) throw new Error('mã hiển thị KHÔNG khớp tay.css');
const khoi = (dau) => { const ls = V3.split('\n'); const i = ls.findIndex((l) => l.includes(dau)); const r = []; for (let j = i; j < ls.length && ls[j].trim() !== ''; j++) r.push(ls[j]); return r.join('\n'); };
const HOVER = khoi('.hover\\:bg-blue-500'), GROUP = khoi('.group:hover'), PEER = khoi('.peer:checked'), DARK = khoi('.dark\\:text-white'), MD = khoi('@media');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.1', t: 'Five variant shapes,<br>read from the output', sub: 'One uniform syntax — prefix, colon, utility — compiles to five structurally different selectors. Built with the real CLI in Tailwind 3.4.19 and 4.3.5, measured in Chromium',
    en: 'Lesson two point one. A variant prefix looks like one uniform mechanism: a word and a colon in front of a utility. It is not. Five common prefixes compile to five structurally different selectors, and we read them straight from the real output.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>How to read a variant from the <b>compiled CSS</b>, not the documentation</li>
    <li>The five shapes: pseudo-class, <b>descendant</b>, <b>sibling</b>, ancestor test, media wrapper</li>
    <li>Which shapes raise specificity — and the one that does <b>not</b></li>
    <li>An asymmetry measured in Chromium: a hand-written rule beats <code>md:flex</code>, but <code>hover:flex</code> only sometimes</li>
    <li>What Tailwind 4 changed in all five</li></ul>`,
    en: 'Five takeaways: read a variant from the compiled CSS; the five shapes; which shapes raise specificity and the one that does not; an asymmetry measured in Chromium; and what Tailwind four changed.' },
  { t: 'The measurement: five prefixes, one file', body: two(D(html(PAGE, { sm: true }), tn(['$ npx tailwindcss -c tw.config.js -i in.css -o out.css', doan('v3', 'npx tailwindcss')[0]].join('\n'), { fs: 15, wrap: 50, title: 'Tailwind 3.4.19 · darkMode: \'class\' (real)' }),
      box('Why this way', 'Put one of each prefix in a file and read what comes out. No documentation involved — the compiled selector is the only thing the browser ever sees.', 'lam')),
    D(css(V3.replace(/\n\n/g, '\n'), { sm: true })), 'r46'),
    en: 'The measurement. One element with five prefixes plus a plain flex, built with Tailwind three point four nineteen, dark mode set to class, like this site. Read what comes out: five prefixes, five different selector structures.' },
  { t: 'Shape 1 — append a pseudo-class', body: two(D(css(HOVER, { sm: true }),
      box('Read it', `The colon in the class name is <b>escaped</b> as <code>\\:</code> — a bare colon in a selector would start a pseudo-class. Then the real <code>:hover</code> is appended. Same shape for <code>focus:</code>, <code>active:</code>, <code>disabled:</code>, <code>first:</code>, <code>checked:</code>.`, 'lam')),
    D(box('Consequence: specificity 0,2,0', 'One class plus one pseudo-class = <b>0,2,0</b>, against 0,1,0 for a bare utility. That is why <code>hover:bg-red-500</code> beats <code>bg-blue-500</code> regardless of source order — the hover rule really is more specific.', 'xanh'),
      meter([['hover:', KHO.hover], ['focus*:', KHO.focus], ['disabled:', KHO.disabled]], { don: '', nhan: 130, fs: 17, rh: 40, w: 480 }),
      `<div style="font-size:17px;color:#475569">uses at the start of a class in frontend/, 14/11/2026</div>`), 'r64'),
    en: 'Shape one: append a pseudo-class. The colon is escaped, then the real hover is appended. Specificity is zero two zero, one class plus one pseudo-class, so hover beats a bare utility regardless of order. This site uses it four thousand seven hundred times.' },
  { t: 'Shape 2 — a DESCENDANT combinator (group)', body: two(D(css(GROUP, { sm: true }),
      box('Notice the space', '<code>.group:hover</code> <b>␣</b> <code>.group-hover\\:opacity-50</code> — "an element with the class, <b>anywhere inside</b> an element with <code>group</code> that is hovered". Two separate elements take part.', 'lam')),
    D(box('Silent failure', `Forget <code>group</code> on an ancestor and the selector simply <b>never matches</b>. The CSS is generated, valid, and nothing warns you. Lesson 2.2 is entirely about this. (${n(KHO['group-hover'])} uses of <code>group-hover:</code> in this site.)`, 'do2')), 'r64'),
    en: 'Shape two: a descendant combinator. Notice the space: an element anywhere inside a hovered group. Two elements take part, so forgetting group on an ancestor fails silently: the selector simply never matches. Lesson two point two is about that.' },
  { t: 'Shape 3 — a SIBLING combinator, and it has a direction', body: two(D(css(PEER, { sm: true }),
      box('Read it', 'The <code>~</code> is the general sibling combinator. It only matches siblings that come <b>after</b> the peer in the document.', 'lam')),
    D(box('So the DOM order is fixed for you', 'A <code>peer-checked:</code> element placed <b>before</b> its peer never matches. That is why floating labels put the input first in the DOM and move the label up visually — not the other way round.', 'do2'),
      box('In this site', `<code>peer-*:</code> appears only <b>${KHO['peer-']}</b> times — rare, and that is exactly why it surprises people when they do reach for it.`, 'xanh')), 'r64'),
    en: 'Shape three: a sibling combinator, and it has a direction. The tilde only matches siblings that come after the peer. An element placed before its peer never matches, which is why floating labels put the input first in the DOM.' },
  { t: 'Shape 4 — an ancestor test with :is()', body: two(D(css(DARK, { sm: true }),
      box('Read it', '<code>:is(.dark *)</code> = "and this element is a descendant of something with class <code>dark</code>". Under <code>darkMode: \'class\'</code> the switch is a <b>class on an ancestor</b> — usually <code>&lt;html&gt;</code> — so dark mode is DOM state, not a media query.', 'lam')),
    D(box('Less obvious: 0,2,0', '<code>:is()</code> takes the specificity of its <b>most specific argument</b> (here <code>.dark</code>), so the selector is 0,2,0 and beats bare utilities.', 'xanh'),
      box('A real incident in this repo', `<code>.dark</code> on <code>&lt;html&gt;</code> switched on <b>every</b> <code>dark:</code> utility in the app at once and broke a three-theme switcher. The fix: name the global class <code>theme-dark</code>. Lesson 2.4. (${n(KHO.dark)} <code>dark:</code> uses today.)`, 'do2')), 'r64'),
    en: 'Shape four: an ancestor test with is. It means: and this element sits inside something with class dark. Dark mode becomes DOM state. And is takes the specificity of its most specific argument, so it is zero two zero. One dark class on html once switched on every dark utility in this app.' },
  { t: 'Shape 5 — a media-query WRAPPER', body: two(D(css(MD, { sm: true }),
      box('Structurally different', 'The selector does <b>not</b> change; the whole <b>rule</b> is wrapped. So specificity stays <b>0,1,0</b> — exactly a bare utility. A media query adds no specificity at all.', 'lam')),
    D(box('So what makes md:flex beat flex?', `<b>Source order</b>, and nothing else. Look at the file on slide 3: <code>.flex</code> is the first rule, the <code>@media</code> block is the last. Equal specificity ⇒ the later rule wins. Lesson 2.3 measures what happens when you rely on that without knowing it.`, 'xanh'),
      meter([['sm:', KHO.sm], ['md:', KHO.md], ['lg:', KHO.lg], ['xl:', KHO.xl], ['2xl:', KHO['2xl']]], { don: '', nhan: 90, fs: 16, rh: 34, w: 480 })), 'r64'),
    en: 'Shape five: a media query wrapper. The selector does not change; the whole rule is wrapped. Specificity stays zero one zero, exactly a bare utility. So md flex beats flex only because the media block is emitted later in the file.' },
  { t: 'Chromium: the asymmetry, measured', body: two(D(css(TAY, { sm: true }), B('sau3', { url: 'doi3/sau.html · tay.css AFTER Tailwind', h: 290, w: 520 }), B('truoc3', { url: 'doi3/truoc.html · tay.css BEFORE Tailwind', h: 290, w: 520 })),
    D(cmp(['900px wide, #b hovered', 'md:flex', 'hover:flex'], [
        ['tay.css after Tailwind', `<b>${SAU3.a.d}</b>`, `<b>${SAU3.b.d}</b>`],
        ['tay.css before Tailwind', `<b>${TRUOC3.a.d}</b>`, `<b>${TRUOC3.b.d}</b>`]]),
      box('Read it', `<code>md:flex</code> (0,1,0) loses to the 0,2,0 rule <b>in both orders</b> — at every width. <code>hover:flex</code> (0,2,0) <b>ties</b>, so order decides: it wins only when the hand-written rule comes first.`, 'lam'),
      box('Correction (measured 14/11/2026)', 'The written lesson said a 0,2,0 rule "beats md:flex while losing to hover:flex". True only when that rule sits <b>earlier</b> (e.g. <code>@layer components</code>). At the end of <code>globals.css</code> it beats <b>both</b>.', 'do2')), 'r64'),
    en: 'Chromium, the asymmetry measured. A hand-written zero two zero rule makes md flex lose in both orders, at every width. Hover flex ties at zero two zero, so order decides: it wins only when the hand-written rule comes first. If that rule sits at the end of globals dot css, it beats both.' },
  { t: 'Tailwind 4: the same five, compiled differently', body: two(D(tn(["$ sed -n '/^@layer utilities {/,/^}/p' out.css | grep -E '^ *(@|\\.|:)'", ...V4K.split('\n')].join('\n'), { fs: 13, wrap: 64, title: 'Tailwind 4.3.5 · selectors only (real)' })),
    D(cmp(['shape', 'Tailwind 3.4.19', 'Tailwind 4.3.5'], [
        ['hover:', '<code>.x:hover</code>', '+ <code>@media (hover: hover)</code>'],
        ['group-hover:', '<code>.group:hover .x</code>', '<code>:is(:where(.group):hover .x)</code>'],
        ['peer-checked:', '<code>.peer:checked ~ .x</code>', '<code>:is(:where(.peer):checked ~ .x)</code>'],
        ['md:', '<code>min-width: 768px</code>', '<code>width &gt;= 48rem</code>'],
        ['dark:', '<code>:is(.dark *)</code>', '<code>prefers-color-scheme</code>'],
      ]), box('Same five shapes', 'Descendant still has a space, sibling still has <code>~</code> — the failure modes of 2.2 are unchanged. Everything now lives inside <code>@layer utilities</code>.', 'xanh')), 'r46'),
    en: 'Tailwind four: the same five shapes, compiled differently. Hover is also wrapped in a hover-capable media query, group and peer use is with where, md is width at least forty-eight rem, and dark defaults to the operating system preference.' },
  { t: 'Tailwind 4: the class strategy, and the layer', body: two(D(tn(['$ cat in.css', ...O('file:in.css').trim().split('\n'), "$ grep -A6 'dark\\\\:text-white' out.css", ...V4D.split('\n')].join('\n'), { fs: 16, title: 'Tailwind 4.3.5 (real)' }),
      box('Read it', '<code>@custom-variant dark</code> gives the class strategy back — as <code>:where(.dark, .dark *)</code>. <code>:where()</code> adds <b>zero</b>: 0,1,0, not 0,2,0 as in Tailwind 3.', 'lam')),
    D(B('truoc4', { url: 'doi4/truoc.html · tay.css BEFORE Tailwind 4', h: 290, w: 520 }),
      box('Measured: unlayered CSS beats every utility', `Same page, built with Tailwind 4: <code>tay.css</code> loaded <b>first</b>, and both rows are still <b>${TRUOC4.a.d}</b> / <b>${TRUOC4.b.d}</b>. Utilities sit in <code>@layer utilities</code>; any rule outside a layer beats any layered rule, whatever the specificity or order. Chapter 7 is about layers.`, 'do2')), 'r64'),
    en: 'Tailwind four, the class strategy and the layer. A custom dark variant gives the class strategy back as where, which adds zero specificity. And measured: with Tailwind four, the hand-written rule loaded first still beats both, because utilities live in a layer and unlayered CSS always wins.' },
  { t: 'The five shapes on one table', body: cmp(['prefix', 'compiles to', 'specificity (v3)', 'how it fails'], [
      ['hover: focus: disabled:', 'append <code>:hover</code>…', '<b>0,2,0</b>', 'rarely — it legitimately wins'],
      ['group-hover:', 'descendant across <b>two</b> elements', '0,2,0', 'silently, if no ancestor has <code>group</code>'],
      ['peer-checked:', 'sibling <code>~</code>, <b>forward only</b>', '0,2,0', 'silently, if the peer comes after'],
      ['dark:', 'ancestor test <code>:is(.dark *)</code>', '0,2,0', 'one ancestor class switches the whole app'],
      ['md: sm: lg:', '<code>@media</code> wrapper', '<b>0,1,0</b>', 'any 0,2,0 hand rule beats it, at every width'],
    ], { hl: [4] }) + box('The trap', 'Assuming every variant raises specificity. Four of five do; breakpoints do not — and nothing in the syntax shows it. When a responsive class does nothing but a hover class on the same element works, check this first.', 'do2'),
    en: 'The five shapes on one table. Pseudo-class, descendant, directional sibling, ancestor test, and media wrapper. Four of them raise specificity to zero two zero; the breakpoint stays zero one zero and wins only by coming later. Nothing in the syntax shows that.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('variant prefix', 'one syntax, five compilations'), kw('\\: escape', 'the colon inside a class name'), kw('pseudo-class append', 'hover: ⇒ :hover, 0,2,0'),
      kw('descendant combinator', 'the space in group-hover'), kw('general sibling ~', 'peer-*, forward only'), kw(':is(.dark *)', 'ancestor test, 0,2,0'),
      kw(':where()', 'zero specificity (Tailwind 4 dark)'), kw('media wrapper', 'md:, 0,1,0, wins by order'), kw('@layer utilities', 'Tailwind 4: unlayered CSS wins'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: variant prefix; the escaped colon; pseudo-class append; descendant combinator; the general sibling tilde; the is ancestor test; where with zero specificity; the media wrapper; and the utilities layer of Tailwind four.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Put ${c('hover: md: group-hover: peer-checked: dark:')} on one element, build, and label each rule with its shape`,
      'Write each selector\'s specificity next to it — which one is 0,1,0?',
      `Add ${c('.card .title { display: block }')} after your CSS: which of ${c('md:flex')} / ${c('hover:flex')} still works? Move it before, and re-check`,
      'Build the same page with Tailwind 4 and diff the five selectors',
    ]), box('Keep these', '<ul><li>Read the compiled selector, not the class name</li><li>Space ⇒ needs an ancestor; ~ ⇒ needs an EARLIER sibling</li><li>dark: is an ancestor test</li><li>Breakpoints add no specificity — they win by order</li></ul>', 'lam'), ''),
    en: 'Your turn: put the five prefixes on one element, build, and label each rule with its shape and specificity; add a hand-written rule after and before your CSS and check which variant still works; then build with Tailwind four and compare. Keep: read the compiled selector, not the class name.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Variants, and what they compile to', bai: '2.1' }, S);
