/*DU_LIEU*/
const DU_LIEU = {
 "t2-5:file:tw.config.js": "module.exports = { content: ['./*.html'] };\n",
 "t2-5:file:in.css": "@tailwind base;\n@tailwind utilities;\n",
 "t2-5:file:page.html": "<div class=\"[&>svg]:h-4 [&_p]:mt-2 supports-[display:grid]:grid\n            motion-reduce:transition-none print:hidden\n            aria-expanded:rotate-180 data-[state=open]:block has-[img]:p-0\"></div>\n",
 "t2-5:v3": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 106ms.\n$ grep -E '^[.@]|^  \\.' out.css\n.has-\\[img\\]\\:p-0:has(img) {\n.aria-expanded\\:rotate-180[aria-expanded=\"true\"] {\n.data-\\[state\\=open\\]\\:block[data-state=\"open\"] {\n@supports (display:grid) {\n  .supports-\\[display\\:grid\\]\\:grid {\n@media (prefers-reduced-motion: reduce) {\n  .motion-reduce\\:transition-none {\n@media print {\n  .print\\:hidden {\n.\\[\\&\\>svg\\]\\:h-4>svg {\n.\\[\\&_p\\]\\:mt-2 p {",
 "t2-5:file:page4.html": "<div class=\"[&>svg]:h-4 [&_p]:mt-2 supports-[display:grid]:grid\n            motion-reduce:transition-none print:hidden\n            aria-expanded:rotate-180 data-[state=open]:block data-open:flex has-[img]:p-0\"></div>\n",
 "t2-5:v4": "$ npx @tailwindcss/cli -i in.css -o out.css 2>&1 | tail -1\nDone in 34ms\n$ sed -n '/^@layer utilities {/,/^}/p' out.css | grep -E '^ *(@|\\.|:)'\n@layer utilities {\n  .has-\\[img\\]\\:p-0:has(:is(img)) {\n  .aria-expanded\\:rotate-180[aria-expanded=\"true\"] {\n  .data-open\\:flex[data-open] {\n  .data-\\[state\\=open\\]\\:block[data-state=\"open\"] {\n  @supports (display:grid) {\n    .supports-\\[display\\:grid\\]\\:grid {\n  @media (prefers-reduced-motion: reduce) {\n    .motion-reduce\\:transition-none {\n  @media print {\n    .print\\:hidden {\n  .\\[\\&_p\\]\\:mt-2 p {\n  .\\[\\&\\>svg\\]\\:h-4 > svg {",
 "t2-5:file:p.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 text-xl\">\n  <button id=\"b\" aria-expanded=\"false\" onclick=\"this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); document.getElementById('d').dataset.state = this.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed'\"\n    class=\"group flex items-center gap-3 rounded bg-slate-100 px-3 py-2\">Mục hỏi đáp\n    <span id=\"m1\" class=\"inline-block aria-expanded:rotate-180\">▼ aria-expanded:</span>\n    <span id=\"m2\" class=\"inline-block group-aria-expanded:rotate-180\">▼ group-aria-expanded:</span></button>\n  <div id=\"d\" data-state=\"closed\" class=\"hidden rounded bg-cyan-50 p-3 data-[state=open]:block\">Nội dung mở ra (data-state=open)</div>\n  <div class=\"flex gap-3\">\n    <div id=\"c1\" class=\"w-48 rounded border-2 border-slate-300 p-6 has-[img]:p-0\">thẻ chữ</div>\n    <div id=\"c2\" class=\"w-48 rounded border-2 border-slate-300 p-6 has-[img]:p-0\"><img src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='60'%3E%3Crect width='192' height='60' fill='%2306b6d4'/%3E%3C/svg%3E\" alt=\"\"></div>\n  </div>\n  <div id=\"ic\" class=\"flex items-center gap-2 [&>svg]:h-4 [&>svg]:w-4\"><svg viewBox=\"0 0 10 10\"><circle cx=\"5\" cy=\"5\" r=\"5\" fill=\"#0891b2\"/></svg>icon từ thư viện, [&amp;&gt;svg]:h-4</div>\n</body></html>\n",
 "t2-5:chrome": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 106ms.\n$ grep -E 'aria-expanded|data-\\\\\\[state|has-\\\\\\[img|svg\\\\\\]' out.css | grep '{'\n.has-\\[img\\]\\:p-0:has(img) {\n.aria-expanded\\:rotate-180[aria-expanded=\"true\"] {\n.group[aria-expanded=\"true\"] .group-aria-expanded\\:rotate-180 {\n.data-\\[state\\=open\\]\\:block[data-state=\"open\"] {\n.\\[\\&\\>svg\\]\\:h-4>svg {\n.\\[\\&\\>svg\\]\\:w-4>svg {",
 "t2-5:kho": "$ for v in 'data-\\[' 'aria-[a-z]+:' 'has-\\[' 'group-has' '\\[&' 'motion-reduce:' 'motion-safe:' 'print:' 'supports-'; do printf \"%-16s %5d\\n\" \"$v\" \"$(git grep -ohE \"(^|[\\\"' \\`{])$v\" -- 'src/*.tsx' | wc -l)\"; done\ndata-\\[             12\naria-[a-z]+:         0\nhas-\\[               0\ngroup-has            0\n\\[&                274\nmotion-reduce:      23\nmotion-safe:         2\nprint:              11\nsupports-            0\n$ git grep -ohE \"(^|[\\\"' \\`{])animate-[a-z-]+\" -- 'src/*.tsx' | wc -l\n     876\n$ sed -n '/animation: {/,/},/p' tailwind.config.ts | grep -vE 'animation: [{]' | grep -oE \"^ +['\\\"]?[a-z0-9-]+['\\\"]?:\" | tr -d \" '\\\":\" | tr '\\n' ' '\nfade-in slide-up slide-down float glow pulse-slow aurora-drift-slow aurora-drift-slower shimmer-sweep caret-blink scroll-cue-pulse reel-spin projector-pulse \n$ git grep -ohE \"(^|[\\\"' \\`{])motion-reduce:[a-z-]+\" -- 'src/*.tsx' | sed -E 's/^[^m]//' | sort | uniq -c | sort -rn\n   9 motion-reduce:animate-none\n   8 motion-reduce:transition-none\n   3 motion-reduce:transform-none\n   2 motion-reduce:group-hover\n   1 motion-reduce:hover",
 "t2-5:file:xau.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 text-xl\">\n  <h2 class=\"font-bold\">Hồ sơ của: sinhvien_a</h2>\n  <button id=\"tai\" class=\"rounded bg-cyan-600 px-4 py-2 text-white\">Tải bài giảng</button>\n  <!-- lớp dưới đây lấy từ ô \"màu hồ sơ\" người dùng tự nhập: className={`bio ${user.theme}`} -->\n  <div id=\"bio\" class=\"bio fixed inset-0 z-50 cursor-pointer opacity-0\"><a id=\"bay\" href=\"https://example.invalid/dang-nhap-gia\">.</a></div>\n  <p class=\"text-slate-600\">Giới thiệu: mình học Tailwind.</p>\n</body></html>\n",
 "t2-5:xau": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 136ms.\n$ grep -cE '^\\.(fixed|inset-0|z-50|opacity-0) \\{' out.css\n4",
 "anh-twc-2-5:dong": {
  "url": "http://127.0.0.1:20114/avc/p.html",
  "vp": [
   700,
   330
  ],
  "rect": {
   "#b": [
    16,
    16,
    521,
    44
   ],
   "#m1": [
    148,
    24,
    152,
    28
   ],
   "#m2": [
    312,
    24,
    212,
    28
   ],
   "#d": null,
   "#c1": [
    16,
    72,
    192,
    80
   ],
   "#c2": [
    220,
    72,
    192,
    80
   ],
   "#ic": [
    16,
    164,
    668,
    28
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"aria\":\"false\",\"m1\":\"none\",\"m2\":\"none\",\"d\":\"none\",\"c1\":\"24px\",\"c2\":\"0px\",\"svg\":16}"
  }
 },
 "anh-twc-2-5:mo": {
  "url": "http://127.0.0.1:20114/avc/p.html",
  "vp": [
   700,
   330
  ],
  "rect": {
   "#b": [
    16,
    16,
    521,
    44
   ],
   "#m1": [
    148,
    24,
    152,
    28
   ],
   "#m2": [
    312,
    24,
    212,
    28
   ],
   "#d": [
    16,
    72,
    668,
    52
   ],
   "#c1": [
    16,
    136,
    192,
    80
   ],
   "#c2": [
    220,
    136,
    192,
    80
   ],
   "#ic": [
    16,
    228,
    668,
    28
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"aria\":\"true\",\"m1\":\"none\",\"m2\":\"matrix(-1, 0, 0, -1, 0, 0)\",\"d\":\"block\",\"c1\":\"24px\",\"c2\":\"0px\",\"svg\":16}"
  }
 },
 "anh-twc-2-5:xau": {
  "url": "http://127.0.0.1:20114/avc/xau.html",
  "vp": [
   700,
   220
  ],
  "rect": {
   "#tai": [
    16,
    56,
    141,
    44
   ],
   "#bio": [
    0,
    12,
    700,
    208
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"tai\":[16,56,141,44],\"trung\":\"bio\",\"cl\":\"bio\",\"opacity\":\"0\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, tsx, tn, br, box, two, kw, c, cmp, meter, steps } from './_twc-chung.mjs';

export const deck = { key: 'twc-02-5', code: 'TWC 2.5', title: 'Arbitrary variants, and the ones worth knowing', sub: 'Chapter 2 · Lesson 2.5' };
const O = (k) => { const v = DU_LIEU[`t2-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-2-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-02-5', ten, { vp: 700, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t2-5 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/, 14/11/2026)
const V3 = doan('v3', 'grep -E'), V4 = doan('v4', 'grep -E'), CH = doan('chrome', 'grep -E');
const S0 = JSON.parse(A('dong').ketQua.s), S1 = JSON.parse(A('mo').ketQua.s), XA = JSON.parse(A('xau').ketQua.s);
if (XA.trung !== 'bio' || XA.opacity !== '0') throw new Error('số đo xau đổi');
const KV = Object.fromEntries(doan('kho', 'for v in').map((l) => { const m = l.trim().match(/^(\S+)\s+(\d+)$/); return [m[1], +m[2]]; }));
const NANIM = +doan('kho', 'animate-[a-z-]+')[0].trim(), ANIM = doan('kho', "sed -n '/animation")[0].trim().split(/\s+/), MR = doan('kho', 'motion-reduce:[a-z-]+').map((l) => l.trim());
if (S1.aria !== 'true' || S1.m1 !== 'none' || !S1.m2.startsWith('matrix(-1') || S0.d !== 'none' || S1.d !== 'block' || S1.c1 !== '24px' || S1.c2 !== '0px' || S1.svg !== 16) throw new Error('số đo Chromium đổi');
if (ANIM.length !== 13 || NANIM !== 876 || KV['\\[&'] !== 274) throw new Error('số đo kho đổi');
const PAGE = `<div class="[&>svg]:h-4 [&_p]:mt-2 supports-[display:grid]:grid
            motion-reduce:transition-none print:hidden
            aria-expanded:rotate-180 data-[state=open]:block has-[img]:p-0"></div>`;
const BTN = `<span id="m1"
  class="inline-block aria-expanded:rotate-180">
  ▼ aria-expanded:</span>
<span id="m2"
  class="inline-block group-aria-expanded:rotate-180">
  ▼ group-aria-expanded:</span>`;
const bo = (x) => x.replace(/\s+/g, '');
if (!bo(O('file:page.html')).includes(bo(PAGE)) || !bo(O('file:p.html')).includes(bo(BTN))) throw new Error('mã hiển thị KHÔNG khớp tệp');
const MRS = MR.map((l) => l.replace(/^(\d+)\s+/, '$1 × ')).join('<br>');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.5', t: 'Arbitrary variants,<br>and the ones worth knowing', sub: 'A selector written inline, and modern variants that replace pieces of JavaScript — compiled in Tailwind 3.4.19 and 4.3.5, clicked in Chromium, counted in this site',
    en: 'Lesson two point five. The variants so far all had names. Tailwind also lets you write an arbitrary selector inline, and ships modern variants that solve problems people used to reach for JavaScript to solve. Both change what is possible without leaving the class attribute.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Eight prefixes and what each one compiles to</li>
    <li><code>[&amp;…]</code>: <code>&amp;</code> is the element, <code>_</code> is a space — the escape hatch</li>
    <li><code>data-[]</code> and <code>aria-*</code> — and an arrow that did <b>not</b> rotate, measured</li>
    <li><code>has-[]</code>, the parent selector CSS never had</li>
    <li><code>motion-reduce</code>, counted against this site's 13 animations</li></ul>`,
    en: 'Five takeaways: eight prefixes and their compiled forms; ampersand is the element and underscore is a space; data and aria variants, with an arrow that did not rotate; has, the parent selector; and motion-reduce counted against this site\'s thirteen animations.' },
  { t: 'The measurement: eight prefixes', body: two(D(html(PAGE, { sm: true }), tn(["$ grep -E '^[.@]|^  \\.' out.css", ...V3].join('\n'), { fs: 13, wrap: 64, title: 'Tailwind 3.4.19 (real)' })),
    D(box('Read it', 'Selector-shaped ones: <code>:has(img)</code>, <code>[aria-expanded="true"]</code>, <code>[data-state="open"]</code>. Wrapper-shaped ones: <code>@supports</code>, <code>@media (prefers-reduced-motion)</code>, <code>@media print</code>. And the general mechanism: <code>.x&gt;svg</code>, <code>.x p</code>.', 'lam'),
      box('Read the last two first', 'They are the <b>general</b> mechanism; the named ones are special cases.', 'xanh')), 'r46'),
    en: 'The measurement. Eight prefixes; the compiled forms show exactly what each buys. Some add to the selector: has, an aria attribute, a data attribute. Some wrap the rule: supports, reduced motion, print. Read the last two first: they are the general mechanism.' },
  { t: 'Arbitrary variants: & IS the element', body: two(D(tn(V3.filter((l) => l.includes('svg') || l.includes('_p')).join('\n'), { fs: 17, wrap: 50, title: 'compiled (real)' }),
      cmp(['you write', 'compiles to'], [['<code>[&amp;&gt;svg]:h-4</code>', '<code>.x &gt; svg</code>'], ['<code>[&amp;_p]:mt-2</code>', '<code>.x p</code> — <code>_</code> is a space'], ['<code>[[aria-expanded=true]&gt;&amp;]:…</code>', 'parent attribute test']])),
    D(box('Why _ and not a space', 'A real space would end the class attribute. So <code>_</code> stands in for it inside the brackets.', 'lam'),
      box('The escape hatch', `Styling children you do <b>not</b> control — markdown output, a third-party widget, an SVG from an icon library — used to force a trip to a stylesheet. <code>[&amp;&gt;svg]:h-4</code> keeps it at the call site. This site uses <code>[&amp;…]</code> <b>${n(KV['\\[&'])}</b> times.`, 'xanh')), 'r46'),
    en: 'Arbitrary variants: the ampersand is the element carrying the class, like in Sass; everything else is plain selector syntax, and underscore stands for a space. It is the escape hatch for children you do not control. This site uses it two hundred seventy-four times.' },
  { t: 'data-[] — replacing conditional class logic', body: two(D(tsx(`{/* the usual way: compute the class list in JS */}
<div className={isOpen ? 'block' : 'hidden'}>

{/* the data-attribute way: state in the DOM, styling in CSS */}
<div data-state={isOpen ? 'open' : 'closed'}
     className="hidden data-[state=open]:block">`, { sm: true }), B('dong', { url: 'avc/p.html · before click (data-state="closed")', h: 260, w: 520 })),
    D(cmp(['', 'before click', 'after click'], [['<code>data-state</code>', 'closed', 'open'], ['panel display', `<b>${S0.d}</b>`, `<b>${S1.d}</b>`]]),
      box('Why it matters', 'The state is <b>inspectable</b> in DevTools without React tools; it works in server-rendered HTML with no hydration; and headless UI libraries (Radix, Headless UI, this site\'s Radix-based components) <b>already set</b> <code>data-state</code>, <code>data-side</code>, <code>data-disabled</code> for you.', 'lam'),
      box('In this site', `<code>data-[…]:</code> appears <b>${KV['data-\\[']}</b> times at the start of a class.`, 'xanh')), 'r46'),
    en: 'Data variants move the condition out of JavaScript into the selector. Measured in Chromium: before the click the panel is display none, after the click data-state is open and it is block. The state is inspectable, works without hydration, and headless libraries already set it.' },
  { t: 'aria-* — and the arrow that did NOT rotate', body: two(D(html(BTN, { sm: true }), B('mo', { url: 'after click: aria-expanded="true" on the BUTTON', h: 70, w: 500 }),
      cmp(['arrow', 'transform after click'], [['aria-expanded: on the span', `<b>${S1.m1}</b>`], ['group-aria-expanded:', `<b>${S1.m2}</b>`]])),
    D(box('Read the selector', '<code>aria-expanded:rotate-180</code> ⇒ <code>.x[aria-expanded="true"]</code>: the attribute is tested on the <b>same element</b>. The button has it, the arrow does not — the arrow never turns.', 'do2'),
      box('Correction (measured 14/11/2026)', `The lesson says the arrow "can only rotate if the ARIA attribute is set" — on the arrow itself. Inside a button use <code>group</code> + <code>group-aria-expanded:</code>. The gain stays: forget the attribute and the bug is <b>loud</b>. This site: ${KV['aria-[a-z]+:']} <code>aria-*:</code> uses.`, 'lam')), 'r46'),
    en: 'Aria variants, and an arrow that did not rotate. Aria-expanded rotate compiles to an attribute test on the same element. The button has the attribute, the arrow does not, so it stayed at none. With group on the button and group-aria-expanded on the arrow, it turned one hundred eighty degrees.' },
  { t: 'has-[] — the parent selector CSS never had', body: two(D(tn(V3.filter((l) => l.includes(':has')).join('\n'), { fs: 17, wrap: 50, title: 'compiled (real)' }), B('mo', { url: 'two cards, both with has-[img]:p-0', h: 230, w: 520 })),
    D(cmp(['card', 'padding measured'], [['text only', `<b>${S1.c1}</b>`], ['contains an &lt;img&gt;', `<b>${S1.c2}</b>`]]),
      box('Read it', 'Style an element by what is <b>inside</b> it. For twenty years this was the textbook "CSS cannot do that". A card dropping its padding around an image, a field turning red around an invalid input — now one class.', 'lam'),
      box('Use it to enhance', `<code>:has()</code> is the newest feature here. Losing padding on an old browser is fine; a menu becoming unreachable is not. This site: <b>${KV['has-\\[']}</b> uses.`, 'do2')), 'r46'),
    en: 'Has, the parent selector. Two identical cards with has image p-zero: the text card keeps twenty-four pixels, the card with an image drops to zero, measured. For twenty years that needed JavaScript. It is the newest feature here, so use it to enhance, not for anything load-bearing.' },
  { t: 'motion-reduce — counted against 13 animations', body: two(D(tn(V3.filter((l) => l.includes('reduced-motion') || l.includes('motion-reduce')).join('\n'), { fs: 17, wrap: 50, title: 'compiled (real)' }),
      box(`The ${ANIM.length} custom animations in tailwind.config.ts`, ANIM.map((a) => `<code>${a}</code>`).join(' '), 'lam')),
    D(meter([['animate-* uses', NANIM, '#c0392b'], ['motion-reduce:*', KV['motion-reduce:'], '#1f8a3b']], { don: '', nhan: 170, fs: 17, rh: 44, w: 480 }),
      box('Read it', `An OS-level setting people enable because motion causes nausea, dizziness or migraines — not an aesthetic preference. <b>${n(NANIM)}</b> <code>animate-*</code> uses against <b>${KV['motion-reduce:']}</b> <code>motion-reduce:</code> ones:<br>${MRS}`, 'do2'),
      box('The rule', 'Loops forever or moves a large area (aurora drift, reel spin) ⇒ stop it under this query. A 200ms fade is fine.', 'xanh')), 'r46'),
    en: 'Motion-reduce compiles to the prefers-reduced-motion media query, an operating-system setting people turn on because motion makes them sick. This site defines thirteen animations and uses animate classes eight hundred seventy-six times, against only twenty-three motion-reduce uses.' },
  { t: 'print: and supports-[]', body: two(D(tn(V3.filter((l) => l.includes('print') || l.includes('supports')).join('\n'), { fs: 17, wrap: 50, title: 'compiled (real)' })),
    D(box('print:', `Compiles to <code>@media print</code>. One <code>print:hidden</code> on the navigation and the chat widget is often the <b>entire</b> print stylesheet a web app needs. This site: <b>${KV['print:']}</b> uses.`, 'lam'),
      box('supports-[]', `Feature detection through <code>@supports</code>. Rarely needed now that layout features are widely supported, but the right tool for genuinely new CSS. This site: <b>${KV['supports-']}</b> uses.`, 'xanh')), 'r46'),
    en: 'Print compiles to a print media query: one print hidden on the navigation and the chat widget is often the whole print stylesheet an app needs. Supports compiles to feature detection; rarely needed now, but right for genuinely new CSS.' },
  { t: 'The full set, ranked by how often you will want it', body: cmp(['variant', 'why'], [
      ['<code>data-[state=open]:</code>', 'the workhorse — headless libraries set these; removes conditional class logic'],
      ['<code>[&amp;&gt;svg]:</code> <code>[&amp;_p]:</code>', 'children you did not write — the escape hatch'],
      ['<code>aria-expanded:</code> <code>group-aria-*:</code>', 'prefer over data-* when a real ARIA attribute exists — mind <b>which element</b> carries it'],
      ['<code>motion-reduce:</code>', 'every looping or large animation — not optional for the people who need it'],
      ['<code>has-[img]:</code>', 'parent selector — enhance, do not make it load-bearing'],
      ['<code>print:</code> <code>supports-[]:</code>', 'the print stylesheet in one class; feature detection'],
    ]),
    en: 'The full set, ranked: data variants are the workhorse; arbitrary ampersand variants for children you did not write; aria variants, minding which element carries the attribute; motion-reduce for every looping animation; has to enhance; and print and supports.' },
  { t: 'Trap: an arbitrary variant where a component belongs', body: two(D(html('<div class="[&>div>span:nth-child(2)]:text-red-500">…</div>', { sm: true }),
      box('Valid, generated correctly, and unreadable', 'Arbitrary variants are for reaching into markup you do <b>not</b> control. When you do control it, put the class on the element.', 'do2')),
    D(box('Moved, not removed', 'A selector you cannot read at a glance has moved complexity, not removed it. The syntax existing does not make it the right answer.', 'lam'),
      box('A quick test', 'If you would write the same bracket expression in two places, it wants to be a component (Chapter 4).', 'xanh')), 'r46'),
    en: 'The trap: reaching for an arbitrary variant when a component would be better. It is valid and unreadable. Arbitrary variants are for markup you do not control; when you control it, put the class on the element. An unreadable selector moves complexity, it does not remove it.' },
  { t: 'Tailwind 4: same ideas, a few new spellings', body: two(D(tn(["$ … out.css | grep -E '^ *(@|\\.|:)'", ...V4].join('\n'), { fs: 13, wrap: 62, title: 'Tailwind 4.3.5 (real)' })),
    D(box('What changed', '<code>has-[img]</code> ⇒ <code>:has(:is(img))</code>. New shorthand <code>data-open:</code> ⇒ <code>[data-open]</code> (attribute present). Everything still lives in <code>@layer utilities</code>.', 'lam'),
      box('What did not', 'Same <code>&amp;</code> and <code>_</code> rules, same same-element attribute test for <code>aria-*</code> — the arrow trap applies unchanged.', 'xanh')), 'r46'),
    en: 'Tailwind four: has image becomes has is image, and a new shorthand data-open tests that the attribute is present. The ampersand and underscore rules are the same, and so is the same-element aria test: the arrow trap applies unchanged.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(B('xau', { url: 'avc/xau.html · looks normal', h: 170, w: 500 }),
      tn(['// click at the centre of "Tải bài giảng" — what is really there?', `document.elementFromPoint(…) ⇒ #${XA.trung} (opacity ${XA.opacity})`].join('\n'), { fs: 15, wrap: 60, title: 'Chromium (real)' }),
      box('If a class comes from user data…', 'A profile "theme" field fed into <code>className</code>: someone types <code>fixed inset-0 z-50 opacity-0</code> — classes that <b>already exist</b> in the build — and an invisible layer covers the page. Measured: the click on the button lands on the overlay link. Clickjacking without a single line of their own CSS.', 'do2')),
    D(box('Every day', 'An accordion on your phone (data-state), an icon from a library sized with <code>[&amp;&gt;svg]:h-4</code>, a chat bubble hidden by <code>print:hidden</code> when you print a receipt, the OS "reduce motion" switch on a classmate\'s phone.', 'lam'),
      box('What if…', '…the arrow trap ships? Sighted users see a dead arrow; screen-reader users still hear "expanded" — the bug is loud, which is the point of aria-*.', 'xanh'),
      box('Defend', 'Never put user input into <code>className</code>; map it through a fixed list (<code>{ blue: \'bg-blue-600\' }</code>, Chapter 4 / lesson 10.5). In DevTools, <code>elementFromPoint</code> or the element picker reveals any invisible layer.', 'ok')), 'r46'),
    en: 'In real life, and the attacker view. If a class comes from user data, someone can type fixed inset-zero z-fifty opacity-zero, classes that already exist, and cover the page with an invisible layer. Measured: the click on the download button lands on the overlay link. Never put user input into className; map it through a fixed list.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('arbitrary variant', '[&…], & = element, _ = space'), kw('data-[]', 'state in the DOM'), kw('aria-*', 'attribute on the SAME element'),
      kw('group-aria-*', 'attribute on the group ancestor'), kw('has-[]', ':has(), parent selector'), kw('motion-reduce', 'prefers-reduced-motion'),
      kw('print: / supports-[]', '@media print / @supports'), kw('data-open: (v4)', '[data-open] shorthand'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: arbitrary variant; data; aria, tested on the same element; group-aria, on the ancestor; has; motion-reduce; print and supports; and Tailwind four data-open.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build an accordion: ${c('data-[state=open]:block')} on the panel, measure display before and after`,
      `Put ${c('aria-expanded:rotate-180')} on the arrow inside the button — then fix it with ${c('group-aria-expanded:')}`,
      `Two cards with ${c('has-[img]:p-0')}: measure both paddings`,
      'Count animate-* vs motion-reduce: in your project',
    ]), box('Keep these', '<ul><li>& is the element, _ is a space</li><li>data-[] removes conditional class logic</li><li>aria-* tests the SAME element</li><li>Every looping animation needs motion-reduce</li></ul>', 'lam'), ''),
    en: 'Your turn: build an accordion with a data variant; put aria-expanded on the inner arrow and fix it with group-aria-expanded; measure two has cards; count animate against motion-reduce in your project. Keep: aria tests the same element.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Variants, and what they compile to', bai: '2.5' }, S);
