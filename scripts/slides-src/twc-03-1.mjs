/*DU_LIEU*/
const DU_LIEU = {
 "t3-1:file:tw.config.js": "module.exports = { content: ['./*.html'] };\n",
 "t3-1:file:in.css": "@tailwind base;\n@tailwind utilities;\n",
 "t3-1:v3": "$ echo '<div class=\"p-2 p-8\"></div>' > page.html\n$ npx tailwindcss -c tw.config.js -i in.css -o a.css 2>&1 | tail -1\nDone in 89ms.\n$ echo '<div class=\"p-8 p-2\"></div>' > page.html\n$ npx tailwindcss -c tw.config.js -i in.css -o b.css 2>&1 | tail -1\nDone in 103ms.\n$ diff a.css b.css && echo \"=> giong het tung byte\"\n=> giong het tung byte\n$ shasum a.css b.css\ne71dfed6b20c3f09f524b9cb403f61bc96b23c20  a.css\ne71dfed6b20c3f09f524b9cb403f61bc96b23c20  b.css\n$ cat a.css\n.p-2 {\n  padding: 0.5rem\n}\n\n.p-8 {\n  padding: 2rem\n}",
 "t3-1:v4": "$ echo '<div class=\"p-2 p-8\"></div>' > page.html\n$ npx @tailwindcss/cli -i in.css -o ../tt4o/a.css 2>&1 | tail -1\nDone in 30ms\n$ echo '<div class=\"p-8 p-2\"></div>' > page.html\n$ npx @tailwindcss/cli -i in.css -o ../tt4o/b.css 2>&1 | tail -1\nDone in 27ms\n$ diff ../tt4o/a.css ../tt4o/b.css && echo \"=> giong het tung byte\"\n=> giong het tung byte\n$ grep -A2 -E '^ *\\.p-(2|8) \\{' ../tt4o/a.css\n  .p-2 {\n    padding: calc(var(--spacing) * 2);\n  }\n  .p-8 {\n    padding: calc(var(--spacing) * 8);\n  }",
 "t3-1:file:thu-tu.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 font-mono text-lg\">\n  <div id=\"a\" class=\"p-2 p-8 rounded bg-cyan-100\">class=\"p-2 p-8\"</div>\n  <div id=\"b\" class=\"p-8 p-2 rounded bg-cyan-100\">class=\"p-8 p-2\"</div>\n  <div id=\"c\" class=\"rounded bg-amber-100\" style=\"padding:2px; padding:8px\">style=\"padding:2px; padding:8px\"</div>\n</body></html>\n",
 "t3-1:file:nut.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 text-lg\">\n  <!-- Button: nen + className cua nguoi goi noi vao CUOI chuoi -->\n  <button id=\"n1\" class=\"px-4 py-2 rounded bg-cyan-600 text-white px-8\">nền px-4 · gọi px-8</button>\n  <button id=\"n2\" class=\"px-4 py-2 rounded bg-cyan-600 text-white px-10\">nền px-4 · gọi px-10</button>\n  <button id=\"n3\" class=\"px-8 py-2 rounded bg-cyan-600 text-white px-4\">nền px-8 · gọi px-4</button>\n</body></html>\n",
 "t3-1:file:v4/in.css": "@import \"tailwindcss\";\n",
 "t3-1:file:v4/nut.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 text-lg\">\n  <!-- cung ba nut, dung bang Tailwind 4 -->\n  <button id=\"n1\" class=\"px-4 py-2 rounded bg-cyan-600 text-white px-8\">nền px-4 · gọi px-8</button>\n  <button id=\"n2\" class=\"px-4 py-2 rounded bg-cyan-600 text-white px-10\">nền px-4 · gọi px-10</button>\n  <button id=\"n3\" class=\"px-8 py-2 rounded bg-cyan-600 text-white px-4\">nền px-8 · gọi px-4</button>\n</body></html>\n",
 "t3-1:chrome": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 107ms.\n$ grep -oE '^\\.px?-[0-9]+' out.css | tr '\\n' ' '\n.p-0 .p-10 .p-2 .p-4 .p-5 .p-8 .px-10 .px-4 .px-8 \n$ cd v4 && npx @tailwindcss/cli -i in.css -o ../../ttc4o.css 2>&1 | tail -1 && cp ../../ttc4o.css out.css\nDone in 28ms\n$ grep -oE '^ *\\.px?-[0-9]+' v4/out.css | tr -d ' ' | tr '\\n' ' '\n.p-0 .p-4 .p-5 .p-8 .p-10 .px-4 .px-8 .px-10 ",
 "t3-1:kho": "$ git ls-files 'src/*.tsx' | wc -l\n    1675\n$ git grep -ohE 'className=\\{`[^`]*\\$\\{className\\}`\\}' -- 'src/*.tsx' | wc -l\n      53\n$ git grep -ohE 'className=\\{`[^`]*\\$\\{className\\}`\\}' -- 'src/*.tsx' | grep -E '\\b(p|px|py)-[0-9]' | head -3\nclassName={`rounded-[20px] border border-white/[0.13] bg-[var(--a-card)] p-5 ${className}`}\nclassName={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}\nclassName={`p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors ${className}`}\n$ git grep -nE 'className=\\{`[^`]*p-5 \\$\\{className\\}`\\}' -- 'src/*.tsx' | head -2\nsrc/components/admin/ui.tsx:54:    <section className={`rounded-[20px] border border-white/[0.13] bg-[var(--a-card)] p-5 ${className}`}>",
 "t3-1:file:sec.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 bg-slate-800 p-4 text-lg text-white\">\n  <!-- admin/ui.tsx:54 — `... p-5 ${className}`, nguoi goi dua p-0 / p-8 / p-10 -->\n  <section id=\"s0\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-5 p-0\">Section · gọi p-0</section>\n  <section id=\"s8\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-5 p-8\">Section · gọi p-8</section>\n  <section id=\"s10\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-5 p-10\">Section · gọi p-10</section>\n</body></html>\n",
 "t3-1:file:v4/sec.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 bg-slate-800 p-4 text-lg text-white\">\n  <!-- cung ba Section, dung bang Tailwind 4 -->\n  <section id=\"s0\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-5 p-0\">Section · gọi p-0</section>\n  <section id=\"s8\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-5 p-8\">Section · gọi p-8</section>\n  <section id=\"s10\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-5 p-10\">Section · gọi p-10</section>\n</body></html>\n",
 "anh-twc-3-1:thutu": {
  "url": "http://127.0.0.1:20115/ttc/thu-tu.html",
  "vp": [
   560,
   230
  ],
  "rect": {
   "#a": [
    16,
    16,
    528,
    92
   ],
   "#b": [
    16,
    120,
    528,
    92
   ],
   "#c": [
    16,
    224,
    528,
    44
   ]
  },
  "console": [],
  "ketQua": {
   "pad": "[[\"a\",\"32px\"],[\"b\",\"32px\"],[\"c\",\"8px\"]]"
  }
 },
 "anh-twc-3-1:nut3": {
  "url": "http://127.0.0.1:20115/ttc/nut.html",
  "vp": [
   560,
   220
  ],
  "rect": {
   "#n1": [
    16,
    28,
    217,
    44
   ],
   "#n2": [
    238,
    28,
    193,
    44
   ],
   "#n3": [
    16,
    84,
    217,
    44
   ]
  },
  "console": [],
  "ketQua": {
   "pad": "[[\"n1\",\"32px\"],[\"n2\",\"16px\"],[\"n3\",\"32px\"]]"
  }
 },
 "anh-twc-3-1:nut4": {
  "url": "http://127.0.0.1:20115/ttc/v4/nut.html",
  "vp": [
   560,
   220
  ],
  "rect": {
   "#n1": [
    16,
    16,
    217,
    44
   ],
   "#n2": [
    238,
    16,
    241,
    44
   ],
   "#n3": [
    16,
    72,
    217,
    44
   ]
  },
  "console": [],
  "ketQua": {
   "pad": "[[\"n1\",\"32px\"],[\"n2\",\"40px\"],[\"n3\",\"32px\"]]"
  }
 },
 "anh-twc-3-1:sec3": {
  "url": "http://127.0.0.1:20115/ttc/sec.html",
  "vp": [
   560,
   300
  ],
  "rect": {
   "#s0": [
    16,
    16,
    528,
    70
   ],
   "#s8": [
    16,
    98,
    528,
    94
   ],
   "#s10": [
    16,
    204,
    528,
    70
   ]
  },
  "console": [],
  "ketQua": {
   "pad": "[[\"s0\",\"20px\"],[\"s8\",\"32px\"],[\"s10\",\"20px\"]]"
  }
 },
 "anh-twc-3-1:sec4": {
  "url": "http://127.0.0.1:20115/ttc/v4/sec.html",
  "vp": [
   560,
   300
  ],
  "rect": {
   "#s0": [
    16,
    16,
    528,
    70
   ],
   "#s8": [
    16,
    98,
    528,
    94
   ],
   "#s10": [
    16,
    204,
    528,
    110
   ]
  },
  "console": [],
  "ketQua": {
   "pad": "[[\"s0\",\"20px\"],[\"s8\",\"32px\"],[\"s10\",\"40px\"]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tsx, tn, br, box, two, steps, kw, c, cmp } from './_twc-chung.mjs';

export const deck = { key: 'twc-03-1', code: 'TWC 3.1', title: 'Written order has ZERO effect', sub: 'Chapter 3 · Lesson 3.1' };
const O = (k) => { const v = DU_LIEU[`t3-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-3-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-03-1', ten, { vp: 560, ...o });

// ── số đo (chạy thật t3-1 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/, 14/11/2026)
const V3 = O('v3').split('\n').filter((l) => !l.startsWith('$ cat')).join('\n').replace(/\n\.p-2 \{[\s\S]*$/, '').trim();
const CAT3 = doan('v3', 'cat a.css').join('\n').trim();
const SHA = doan('v3', 'shasum');
const V4 = doan('v4', 'grep -A2').join('\n');
const DIFF4 = doan('v4', 'diff ')[0];
const pad = (k) => Object.fromEntries(JSON.parse(A(k).ketQua.pad));
const TT = pad('thutu'), N3 = pad('nut3'), N4 = pad('nut4'), S3 = pad('sec3'), S4 = pad('sec4');
const ORD3 = doan('chrome', "grep -oE '^\\.px?")[0].trim(), ORD4 = doan('chrome', "grep -oE '^ *\\.px?")[0].trim();
const NTSX = +doan('kho', 'git ls-files')[0].trim(), NNOI = +doan('kho', "}`\\}' -- 'src/*.tsx' | wc")[0].trim();
const VD = doan('kho', '| head -3'), SEC = doan('kho', 'p-5')[0];
if (SHA[0].split(' ')[0] !== SHA[1].split(' ')[0] || DIFF4 !== '=> giong het tung byte') throw new Error('đầu ra đổi');
if (TT.a !== '32px' || TT.b !== '32px' || TT.c !== '8px') throw new Error('số đo thứ tự đổi');
if (N3.n1 !== '32px' || N3.n2 !== '16px' || N3.n3 !== '32px' || N4.n2 !== '40px' || N4.n3 !== '32px') throw new Error('số đo nút đổi');
if (S3.s0 !== '20px' || S3.s8 !== '32px' || S3.s10 !== '20px' || S4.s10 !== '40px' || S4.s0 !== '20px') throw new Error('số đo Section đổi');
if (NTSX !== 1675 || NNOI !== 53 || !SEC.includes('admin/ui.tsx:54:')) throw new Error('số đo kho đổi');
const bo = (x) => x.replace(/\s+/g, '');
const SECT = SEC.match(/className=\{`([^`]*)`\}/)[1].split(' ');
const SECM = '<section className={`' + [SECT.slice(0, 3), SECT.slice(3, 5), SECT.slice(5)].map((g) => g.join(' ')).join('\n  ') + '`}>';
if (bo(SECM) !== bo('<section className={`' + SECT.join(' ') + '`}>')) throw new Error('mã Section hiển thị lệch');
const NUT = `<button id="n1" class="px-4 py-2 rounded bg-cyan-600
  text-white px-8">nền px-4 · gọi px-8</button>
<button id="n2" class="px-4 py-2 rounded bg-cyan-600
  text-white px-10">nền px-4 · gọi px-10</button>
<button id="n3" class="px-8 py-2 rounded bg-cyan-600
  text-white px-4">nền px-8 · gọi px-4</button>`;
if (!bo(O('file:nut.html')).includes(bo(NUT)) || !bo(O('file:v4/nut.html')).includes(bo(NUT))) throw new Error('mã hiển thị KHÔNG khớp nut.html');
const ok = (v, nen) => (v === nen ? `${v} — <b style="color:#b91c1c">caller LOST</b>` : `<b>${v}</b> — caller won`);

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.1', t: 'Written order has<br>ZERO effect', sub: 'Swap two conflicting utilities and the built CSS is byte-identical. The class attribute is a set, not a sequence — measured in Tailwind 3 and 4, in Chromium, and in this site\'s own components',
    en: 'Lesson three point one. This is the sharpest edge of Tailwind, and it catches experienced CSS developers hardest, because their intuition is right about CSS and wrong about this. The fix is not a trick; it is knowing what the class attribute really is.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Proof: <code>p-2 p-8</code> and <code>p-8 p-2</code> build <b>byte-identical</b> CSS (Tailwind 3 and 4)</li>
    <li>Why: <code>class</code> is an unordered <b>set</b> of references; the <b>stylesheet</b> breaks the tie</li>
    <li>Where "the last one wins" IS true: declarations inside one <code>style</code></li>
    <li>The real failure: a <code>className</code> override that works for <b>some</b> values — measured</li>
    <li>Why reordering is never the fix, and what an attacker learns from this</li></ul>`,
    en: 'Five takeaways: proof that both orders build byte-identical CSS; why, because class is a set and the stylesheet breaks the tie; where last-wins really is true; the real failure, an override that works only for some values; and why reordering is never a fix.' },
  { t: 'The experiment: swap the two classes', body: two(D(tn(V3, { fs: 14, wrap: 64, title: 'Tailwind 3.4.19 (real)' })),
    D(css(CAT3, { sm: true }), tn([`$ diff a.css b.css   # Tailwind 4.3.5, same experiment`, DIFF4].join('\n'), { fs: 15, wrap: 56, title: 'Tailwind 4.3.5 (real)' }),
      box('Read it', '<code>diff</code> prints nothing and the two SHA-1 hashes are <b>identical</b>. Not "usually the same": the same bytes. Swapping the classes changed nothing, because the class attribute is not where order is decided.', 'lam')), 'r46'),
    en: 'The experiment. Build p-2 p-8, then p-8 p-2, and compare. Diff prints nothing and both SHA-1 hashes are identical, in Tailwind three and in Tailwind four. Not usually the same: the same bytes. The class attribute is not where order is decided.' },
  { t: 'So which one wins? The STYLESHEET decides', body: two(D(css(CAT3, { sm: true }), css(V4, { sm: true }),
      box('Tie-break', 'Equal specificity (0,1,0 each) ⇒ the rule that appears <b>later in the stylesheet</b> wins. <code>.p-8</code> is generated second, so it wins — in both files.', 'xanh')),
    D(B('thutu', { url: 'ttc/thu-tu.html · Tailwind 3.4.19', h: 210, w: 560 }),
      cmp(['element', 'computed padding'], [['<code>class="p-2 p-8"</code>', `<b>${TT.a}</b>`], ['<code>class="p-8 p-2"</code>', `<b>${TT.b}</b>`], ['<code>style="padding:2px; padding:8px"</code>', `<b>${TT.c}</b> — here order DOES count`]], { hl: [2] })), 'r46'),
    en: 'So which one wins? The stylesheet. Both rules have the same specificity, so the one that appears later in the stylesheet wins. Chromium measures thirty-two pixels for both orders. The inline style is different: eight pixels, because there, order counts.' },
  { t: 'Where the intuition comes from — and why it is right about CSS', body: two(D(box('inline style — order MATTERS', '<code>style="padding:2px; padding:8px"</code> is a list of <b>declarations inside ONE rule</b>, read in sequence, so the later one wins: <b>' + TT.c + '</b> measured. The intuition is perfectly correct here.', 'xanh'),
      box('class attribute — order is MEANINGLESS', '<code>class="p-2 p-8"</code> is a set of <b>references</b> to two separate rules elsewhere. The HTML spec defines <code>class</code> as "a <b>set</b> of space-separated tokens". Nothing in CSS ever looks at token order.', 'do2')),
    D(box('Not a Tailwind flaw', 'This is how <code>class</code> has always worked: <code>btn btn-primary</code> vs <code>btn-primary btn</code> in Bootstrap is the same non-event. Utility CSS only makes you notice, because it is the one style where you routinely put two conflicting classes on one element.', 'lam'),
      box('One line', 'Markup lists <b>which</b> rules apply. The stylesheet decides <b>who wins</b>.', 'ok')), 'r46'),
    en: 'Where the intuition comes from. An inline style is a list of declarations in one rule, read in order, so the later one wins. A class attribute is a set of references to separate rules. The HTML spec says set. This is not a Tailwind flaw; Bootstrap behaves the same.' },
  { t: 'The real failure: an override that works for SOME values', body: two(D(html(NUT, { sm: true }), tn(['$ grep -oE \'^\\.px?-[0-9]+\' out.css   # Tailwind 3.4.19', ORD3].join('\n'), { fs: 14, wrap: 60, title: 'generated order (real)' })),
    D(B('nut3', { url: 'ttc/nut.html · Tailwind 3.4.19', h: 132, w: 560 }),
      cmp(['base + caller', 'padding-left (Tailwind 3)'], [['px-4 + <b>px-8</b>', ok(N3.n1, '16px')], ['px-4 + <b>px-10</b>', ok(N3.n2, '16px')], ['px-8 + <b>px-4</b>', ok(N3.n3, '32px')]], { hl: [1, 2] }),
      box('So', 'Same component, same code path — the caller wins with <code>px-8</code> and loses with <code>px-10</code> or <code>px-4</code>. Who wins is decided by where each rule landed in <code>out.css</code>, not by "the caller wrote it last".', 'do2')), 'r46'),
    en: 'The real failure. A button puts the caller class at the end of the string. Measured in Chromium: px-four plus px-eight, the caller wins. Px-four plus px-ten, the caller loses. Px-eight plus px-four, the caller loses. Same code, different values, different winner.' },
  { t: 'Tailwind 4 changes WHICH one wins — not the rule', body: two(D(tn(['# Tailwind 3.4.19', ORD3, '# Tailwind 4.3.5', ORD4].join('\n'), { fs: 15, wrap: 56, title: 'generated order (real)' }),
      box('Read it', 'Tailwind 3 sorts values as <b>strings</b> (<code>10</code> before <code>4</code>); Tailwind 4 sorts them as <b>numbers</b>. Lesson 3.2 measures this fully. The class attribute is still ignored in both.', 'lam')),
    D(B('nut4', { url: 'ttc/v4/nut.html · Tailwind 4.3.5', h: 132, w: 560 }),
      cmp(['base + caller', 'Tailwind 3', 'Tailwind 4'], [['px-4 + px-8', N3.n1, N4.n1], ['px-4 + px-10', `<b style="color:#b91c1c">${N3.n2}</b>`, `<b>${N4.n2}</b>`], ['px-8 + px-4', `<b style="color:#b91c1c">${N3.n3}</b>`, `<b style="color:#b91c1c">${N4.n3}</b>`]], { hl: [1] }),
      box('Upgrade trap', 'Upgrading 3 → 4 silently <b>flips</b> the px-10 case. Nobody touched the component; a visual changed anyway.', 'do2')), 'r46'),
    en: 'Tailwind four changes which one wins, not the rule. Version three sorts values as strings, so ten comes before four; version four sorts them as numbers. The px-ten case flips from sixteen to forty pixels on upgrade, without anyone touching the component. Order in the class attribute is still ignored.' },
  { t: 'Why this is a DESIGN problem, not just a bug', body: cmp(['a className prop that…', 'what happens', 'how you find out'], [
      ['never works', 'the first caller notices', 'immediately, in development'],
      ['always works', 'fine', '—'],
      ['works for <b>some</b> values', 'passes the test someone wrote, fails for the value someone else needs', 'in production, from a screenshot'],
    ], { hl: [2] }) + box('Reading DevTools', 'The losing class <b>is</b> on the element. In the Styles panel you see the winning rule active and the loser\'s declaration <b>struck through</b> — the browser resolved it before painting. Chapter 4 is about making this prop honest.', 'lam'),
    en: 'Why this is a design problem. A prop that never works is noticed at once. A prop that works for some values passes the test someone wrote and fails for the value someone else needs. In DevTools the losing class is on the element, its declaration struck through.' },
  { t: 'Measured in this site: 53 components append ${className}', body: two(D(tn([`$ git ls-files 'src/*.tsx' | wc -l`, String(NTSX), "$ git grep -ohE 'className=\\{`[^`]*\\$\\{className\\}`\\}' \\\n    -- 'src/*.tsx' | wc -l", String(NNOI)].join('\n'), { fs: 15, wrap: 52, title: 'frontend/ · 14/11/2026 (real)' }),
      box('First three hits — read the END of each string', VD.map((l) => `<code>…${l.replace(/`\}$/, '').split(' ').slice(-3).join(' ')}</code>`).join('<br>'), 'lam')),
    D(tsx(SECM, { sm: true }),
      box('A real exposure, not a bug (yet)', '<code>admin/ui.tsx:54</code> — the admin <code>Section</code> ends its class string with <code>p-5 ${className}</code>. Today its callers pass <code>mb-8</code>, which conflicts with nothing. The day someone passes a padding, lesson 3.1 decides the result.', 'do2')), 'r46'),
    en: 'Measured in this site. Fifty-three components end a template string with dollar className. One is the admin Section, which ends with p-five then the caller classes. Today callers pass margin-bottom eight, which conflicts with nothing. It is an exposure, not a bug, until someone passes a padding.' },
  { t: 'What if… a caller passes a padding to Section?', body: two(D(B('sec3', { url: 'ttc/sec.html · Section copy · Tailwind 3.4.19', h: 290, w: 520 })),
    D(cmp(['caller passes', 'Tailwind 3', 'Tailwind 4'], [['<code>p-0</code> (flush)', `<b style="color:#b91c1c">${S3.s0}</b>`, `<b style="color:#b91c1c">${S4.s0}</b>`], ['<code>p-8</code>', `<b>${S3.s8}</b>`, `<b>${S4.s8}</b>`], ['<code>p-10</code>', `<b style="color:#b91c1c">${S3.s10}</b>`, `<b>${S4.s10}</b>`]], { hl: [0] }),
      box('Read it', 'Base is <code>p-5</code> = 20px. Asking for <b>no</b> padding (<code>p-0</code>) is ignored in both versions; <code>p-10</code> is ignored in Tailwind 3 only. Nothing errors. The fix is lesson 3.4 (<code>cn()</code>), not moving words around.', 'do2')), 'r46'),
    en: 'What if a caller passes a padding to that Section? Rebuilt the same class string. Asking for p-zero is ignored in both versions: twenty pixels. P-ten is ignored in Tailwind three and works in four. Nothing errors. The fix is the merge of lesson three point four.' },
  { t: 'Trap: "fixing" it by reordering the classes', body: two(D(box('What people try first', 'Move the class to the <b>end</b> of the string. Sometimes it seems to work — when the utility happens to be generated later anyway (<code>px-8</code> after <code>px-4</code>). That apparent success is a <b>coincidence</b>, and the wrong lesson gets carried forward.', 'do2'),
      box('Prove it to yourself in 30 seconds', 'DevTools → Elements → edit the class attribute, swap the two utilities. The struck-through declaration stays struck through. That is this whole lesson, live.', 'lam')),
    D(box('The real fixes', '<ul><li><b>Remove</b> the conflict you did not mean to write (3.2)</li><li><b>Merge</b> runtime class strings with <code>cn()</code> = <code>twMerge(clsx(…))</code> (3.4)</li><li>Escalate with <code>!</code> only for CSS you do not control (3.5)</li></ul>', 'ok')), 'r46'),
    en: 'The trap: fixing it by reordering. Moving the class to the end sometimes seems to work, when that utility happens to be generated later anyway. That success is a coincidence. The real fixes: remove the conflict, merge runtime strings with cn, and escalate only for CSS you do not control.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'A guest list does not decide the seating — the seating chart does. Same here: the class list says <b>who is invited</b>, the stylesheet says <b>who sits where</b>. You meet this every time a shared <code>Button</code>/<code>Card</code> "ignores" the class you passed.', 'lam'),
      box('What if…', '…your team upgrades Tailwind 3 → 4? Measured above: overrides like <code>px-10</code> start working, others still fail, and visuals shift on pages nobody edited. Screenshot-diff the key pages on upgrade.', 'xanh')),
    D(box('The attacker\'s view: you cannot win by position', 'If user content may carry a <code>class</code> (comments, markdown, CMS), "put our safe classes last" protects <b>nothing</b> — their <code>hidden</code> or <code>fixed inset-0</code> wins or loses by stylesheet order. Strip or allow-list classes from user input on the <b>server</b>.', 'do2'),
      box('Related', 'Cascade &amp; specificity — Web Foundations 3.1. Overlay attacks from user classes — lesson 2.5.', 'ok')), 'r46'),
    en: 'In real life: a guest list does not decide the seating; the seating chart does. What if your team upgrades to Tailwind four? Some overrides start working and pages nobody edited shift. The attacker view: you cannot defend by putting safe classes last; strip or allow-list user classes on the server.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('unordered token set', 'class is a SET — no order'), kw('reference, not declaration', 'class names point to rules elsewhere'), kw('cascade tie-break', 'equal specificity ⇒ later in the stylesheet'),
      kw('declaration order', 'inside one rule/style, last wins'), kw('silent override failure', 'caller class present, not applied'), kw('generated order', 'v3 string sort · v4 numeric sort'),
      kw('exposure', 'a place where a future conflict breaks silently'), kw('reorder is not a fix', 'apparent success is coincidence'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: unordered token set; reference, not declaration; cascade tie-break; declaration order inside one rule; silent override failure; generated order, string sort in version three and numeric in four; exposure; and reorder is not a fix.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build ${c('p-2 p-8')} then ${c('p-8 p-2')}: ${c('diff')} and ${c('shasum')} the two files`,
      `Put ${c('style="padding:2px; padding:8px"')} next to them and read the computed padding`,
      `Write the three buttons (px-4+px-8, px-4+px-10, px-8+px-4) in Tailwind 3 and 4 — who wins?`,
      `In your project: ${c("git grep -n '${className}`'")} and open every component that appends it`,
    ]), box('Keep these', '<ul><li>class is a set: order in it does nothing</li><li>The stylesheet breaks ties: later rule wins</li><li>Appending ${className} works only by luck</li><li>Reordering is never the fix — merging is</li></ul>', 'lam'), ''),
    en: 'Your turn: build both orders and diff them; compare with an inline style; write the three buttons in both versions; and search your own project for components that append className. Keep: class is a set, the stylesheet breaks ties, and reordering is never the fix.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Conflicts, where the model leaks', bai: '3.1' }, S);
