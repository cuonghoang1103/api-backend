/*DU_LIEU*/
const DU_LIEU = {
 "t2-4:file:in.css": "@tailwind base;\n@tailwind utilities;\n",
 "t2-4:file:page.html": "<div class=\"dark:text-white\"></div>\n",
 "t2-4:file:media.config.js": "module.exports = { content: ['./page.html'] };\n",
 "t2-4:file:class.config.js": "module.exports = { content: ['./*.html'], darkMode: 'class' };\n",
 "t2-4:file:selector.config.js": "module.exports = { content: ['./*.html'], darkMode: ['selector', '.dark'] };\n",
 "t2-4:ba": "$ for m in media class selector; do echo \"# darkMode: $m\"; npx tailwindcss -c $m.config.js -i in.css -o o-$m.css 2>/dev/null; grep -v -- '--tw-text-opacity' o-$m.css; done\n# darkMode: media\n@media (prefers-color-scheme: dark) {\n  .dark\\:text-white {\n  }\n}\n# darkMode: class\n.dark\\:text-white:is(.dark *) {\n}\n# darkMode: selector\n.dark\\:text-white:where(.theme-dark, .theme-dark *) {\n}",
 "t2-4:file:tay.css": "/* CSS viết tay — độ đặc hiệu 0,1,0, nạp SAU Tailwind */\n.note { color: rgb(220 38 38); }\n",
 "t2-4:file:doi-class.html": "<!doctype html><html class=\"dark\"><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"class.css\"><link rel=\"stylesheet\" href=\"tay.css\"></head>\n<body class=\"bg-slate-800 p-4 text-2xl\"><p id=\"p\" class=\"note dark:text-white\">darkMode: 'class' — chữ này màu gì?</p></body></html>\n",
 "t2-4:file:doi-selector.html": "<!doctype html><html class=\"dark\"><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"selector.css\"><link rel=\"stylesheet\" href=\"tay.css\"></head>\n<body class=\"bg-slate-800 p-4 text-2xl\"><p id=\"p\" class=\"note dark:text-white\">darkMode: selector — chữ này màu gì?</p></body></html>\n",
 "t2-4:file:no-dark.html": "<!doctype html><html class=\"dark\"><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"class.css\"></head>\n<body class=\"space-y-3 bg-white p-4 text-xl\">\n  <div class=\"rounded bg-slate-200 p-3\">Vỏ ứng dụng (theme toàn cục đặt .dark lên &lt;html&gt;)</div>\n  <div class=\"notes-theme-root rounded p-3\" data-notes-theme=\"brown\">\n    <div id=\"n\" class=\"rounded bg-amber-100 p-3 text-amber-900 dark:bg-slate-900 dark:text-slate-100\">Notes đang ở theme NÂU</div></div>\n</body></html>\n",
 "t2-4:file:no-themedark.html": "<!doctype html><html class=\"theme-dark\"><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"class.css\"></head>\n<body class=\"space-y-3 bg-white p-4 text-xl\">\n  <div class=\"rounded bg-slate-200 p-3\">Vỏ ứng dụng (theme toàn cục đặt .theme-dark lên &lt;html&gt;)</div>\n  <div class=\"notes-theme-root rounded p-3\" data-notes-theme=\"brown\">\n    <div id=\"n\" class=\"rounded bg-amber-100 p-3 text-amber-900 dark:bg-slate-900 dark:text-slate-100\">Notes đang ở theme NÂU</div></div>\n</body></html>\n",
 "t2-4:chrome": "$ npx tailwindcss -c class.config.js -i in.css -o class.css 2>&1 | tail -1\nDone in 105ms.\n$ npx tailwindcss -c selector.config.js -i in.css -o selector.css 2>&1 | tail -1\nDone in 132ms.\n$ grep -A2 'dark\\\\:text-white' class.css selector.css | grep -v opacity\nclass.css:.dark\\:text-white:is(.dark *) {\n--\nselector.css:.dark\\:text-white:where(.dark, .dark *) {",
 "t2-4:kho": "$ grep -n 'darkMode' tailwind.config.ts\n12:  darkMode: \"class\",\n$ git grep -oh 'dark:[^ \"'\"'\"'`]*' -- 'src/*.tsx' | wc -l\n    1102\n$ git grep -oh 'dark:[^ \"'\"'\"'`]*' -- 'src/components/notes/*.tsx' 'src/components/notes/**/*.tsx' | wc -l\n     915\n$ git grep -oh 'dark:[^ \"'\"'\"'`]*' -- 'src/*.tsx' ':!src/components/notes' | wc -l\n     187\n$ git grep -l 'dark:' -- 'src/*.tsx' ':!src/components/notes' | wc -l\n      56\n$ git grep -l 'dark:' -- 'src/*.tsx' ':!src/components/notes' | cut -d/ -f2-3 | sort | uniq -c | sort -rn | head -6\n   8 components/work\n   7 components/exp-hub\n   5 components/language\n   4 app/tech-trends\n   4 app/language\n   3 app/cv\n$ git grep -oh 'dark:[a-z0-9/\\[\\]#.-]*' -- 'src/*.tsx' | wc -l\n       0\n$ git grep -n \"type NotesTheme\" -- 'src/*.tsx'\nsrc/components/notes/NotesThemeProvider.tsx:29:export type NotesTheme = 'dark' | 'brown' | 'light';\n$ git grep -c 'theme-dark' -- src/app/globals.css\nsrc/app/globals.css:35",
 "t2-4:file:mac-dinh.css": "@import \"tailwindcss\";\n",
 "t2-4:file:lop.css": "@import \"tailwindcss\";\n@custom-variant dark (&:where(.dark, .dark *));\n",
 "t2-4:v4": "$ npx @tailwindcss/cli -i mac-dinh.css -o o1.css 2>&1 | tail -1; grep -B1 -A2 'dark\\\\:text-white {' o1.css\nDone in 25ms\n  @media (prefers-color-scheme: dark) {\n    .dark\\:text-white {\n      color: var(--color-white);\n    }\n$ npx @tailwindcss/cli -i lop.css -o o2.css 2>&1 | tail -1; grep -A1 'dark\\\\:text-white:' o2.css\nDone in 24ms\n  .dark\\:text-white:where(.dark, .dark *) {\n    color: var(--color-white);",
 "anh-twc-2-4:class": {
  "url": "http://127.0.0.1:20113/dkc/doi-class.html",
  "vp": [
   620,
   110
  ],
  "rect": {
   "#p": [
    16,
    16,
    588,
    32
   ]
  },
  "console": [],
  "ketQua": {
   "m": "[\"rgb(255, 255, 255)\",\"dark\"]"
  }
 },
 "anh-twc-2-4:selector": {
  "url": "http://127.0.0.1:20113/dkc/doi-selector.html",
  "vp": [
   620,
   110
  ],
  "rect": {
   "#p": [
    16,
    16,
    588,
    32
   ]
  },
  "console": [],
  "ketQua": {
   "m": "[\"rgb(220, 38, 38)\",\"dark\"]"
  }
 },
 "anh-twc-2-4:nodark": {
  "url": "http://127.0.0.1:20113/dkc/no-dark.html",
  "vp": [
   620,
   210
  ],
  "rect": {
   "#n": [
    28,
    92,
    564,
    52
   ]
  },
  "console": [],
  "ketQua": {
   "m": "[\"rgb(15, 23, 42)\",\"rgb(241, 245, 249)\",\"dark\"]"
  }
 },
 "anh-twc-2-4:notheme": {
  "url": "http://127.0.0.1:20113/dkc/no-themedark.html",
  "vp": [
   620,
   210
  ],
  "rect": {
   "#n": [
    28,
    92,
    564,
    52
   ]
  },
  "console": [],
  "ketQua": {
   "m": "[\"rgb(254, 243, 199)\",\"rgb(120, 53, 15)\",\"theme-dark\"]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tn, br, box, two, steps, kw, c, cmp, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-02-4', code: 'TWC 2.4', title: 'Dark mode, and the class name that broke a feature', sub: 'Chapter 2 · Lesson 2.4' };
const O = (k) => { const v = DU_LIEU[`t2-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-2-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-02-4', ten, { vp: 620, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t2-4 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/, 14/11/2026)
const BA = doan('ba', 'for m in').join('\n');
const M = (k) => JSON.parse(A(k).ketQua.m);
const CL = M('class'), SE = M('selector'), ND = M('nodark'), NT = M('notheme');
const K = (dau) => doan('kho', dau).map((l) => l.trim());
const TONG = +K("-- 'src/*.tsx' | wc -l")[0], NOTES = +K("src/components/notes/*.tsx'")[0], NGOAI = +K("':!src/components/notes' | wc -l")[0], NFILE = +K("git grep -l 'dark:' -- 'src/*.tsx' ':!src/components/notes' | wc -l")[0];
const NOI = K('cut -d/'), BAY = +K("dark:[a-z0-9")[0], TD = K("git grep -c 'theme-dark'")[0];
const V4A = doan('v4', 'mac-dinh.css').join('\n'), V4B = doan('v4', 'lop.css').join('\n');
const PT = ((NOTES / TONG) * 100).toFixed(1);
if (!BA.includes(':is(.dark *)') || !BA.includes(':where(.theme-dark, .theme-dark *)') || !BA.includes('prefers-color-scheme')) throw new Error('đầu ra đổi');
if (CL[0] !== 'rgb(255, 255, 255)' || SE[0] !== 'rgb(220, 38, 38)' || ND[0] !== 'rgb(15, 23, 42)' || NT[0] !== 'rgb(254, 243, 199)') throw new Error('số đo Chromium đổi');
if (TONG !== NOTES + NGOAI || BAY !== 0 || TONG !== 1102) throw new Error('số đo kho đổi');
const TAY = `.note { color: rgb(220 38 38); }`;
const P = `<p id="p" class="note dark:text-white">`;
const bo = (x) => x.replace(/\s+/g, '');
if (!bo(O('file:tay.css')).includes(bo(TAY)) || !bo(O('file:doi-class.html')).includes(bo(P))) throw new Error('mã hiển thị KHÔNG khớp tệp');
const mau = (s) => ({ 'rgb(255, 255, 255)': 'white', 'rgb(220, 38, 38)': 'red (.note)', 'rgb(15, 23, 42)': 'slate-900 (DARK)', 'rgb(254, 243, 199)': 'amber-100 (brown)' }[s] || s);

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.4', t: 'Dark mode, and the<br>class name that broke a feature', sub: 'The variant with the largest blast radius: one class on one element changes thousands of utilities. Three strategies compiled, the repo\'s incident reproduced in Chromium, the rule counted',
    en: 'Lesson two point four. Dark mode is the variant with the largest blast radius: one class on one element changes how thousands of utilities behave across an app. This repo has the incident to prove it, and the mechanism is visible in the compiled output.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three <code>darkMode</code> strategies, three different compilations</li>
    <li>The specificity difference nobody expects — <b>measured</b>: white vs red</li>
    <li>The incident: <code>.dark</code> on <code>&lt;html&gt;</code>, reproduced</li>
    <li>Why the fix was a <b>naming</b> fix, not a code fix</li>
    <li>Counting whether the rule holds — and a measurement that returned <b>0</b></li></ul>`,
    en: 'Five takeaways: three dark mode strategies, three compilations; the specificity difference, measured; the incident reproduced; why the fix was a naming fix; and counting whether the rule holds, including a measurement that returned zero.' },
  { t: 'Three strategies, three compilations', body: two(D(html('<div class="dark:text-white"></div>', { sm: true }), tn(['$ for m in media class selector; do … npx tailwindcss -c $m.config.js …; done', ...BA.split('\n')].join('\n'), { fs: 15, wrap: 64, title: 'Tailwind 3.4.19 (real · opacity lines hidden)' })),
    D(cmp(['darkMode', 'trigger', 'specificity'], [
        ["'media' (default)", 'the OS setting — no DOM state, the user cannot override it in your UI', '0,1,0'],
        ["'class' (this repo)", '<code>:is(.dark *)</code> — descendants of <code>.dark</code> only', '<b>0,2,0</b>'],
        ["['selector', '.x']", '<code>:where(.x, .x *)</code> — the element itself and descendants', '<b>0,1,0</b>'],
      ], { hl: [1] })), 'r46'),
    en: 'Three strategies. Media follows the operating system, zero one zero, and the user cannot override it in your interface. Class compiles to is dot dark star: descendants only, zero two zero. Selector compiles to where, which adds nothing: zero one zero.' },
  { t: 'The difference nobody expects — measured', body: two(D(css(TAY, { sm: true }), html(P + '…</p>', { sm: true }),
      B('class', { url: "doi-class.html · darkMode: 'class'", h: 64, w: 520 }), B('selector', { url: "doi-selector.html · darkMode: ['selector', '.dark']", h: 64, w: 520 })),
    D(cmp(['build', 'dark:text-white is', 'measured colour'], [["'class'", '0,2,0 — beats .note', `<b>${mau(CL[0])}</b>`], ["'selector'", '0,1,0 — ties, .note is later', `<b>${mau(SE[0])}</b>`]]),
      box('Read it', 'Same HTML, same hand-written <code>.note</code> loaded after Tailwind, <code>&lt;html class="dark"&gt;</code> in both. Switching the strategy changed which rule <b>wins</b> — without changing one line of markup.', 'do2'),
      box('So', 'Migrating from <code>class</code> to <code>selector</code> (or to Tailwind 4\'s <code>:where</code>) and some dark styles stop applying? They used to win on a specificity they no longer have.', 'lam')), 'r46'),
    en: 'The difference nobody expects, measured. Same page, html has class dark, a hand-written note rule loaded after Tailwind. With class strategy the text is white: zero two zero beats note. With selector it is red: zero one zero ties, and note comes later.' },
  { t: 'The incident', body: two(D(tn(['CLAUDE.md, 2026-07-02 (paraphrased from the repo\'s own log):', 'Global theme put .dark on <html> → force-activated', 'every Tailwind dark: utility inside Notes, breaking', 'its own 3-theme (light/dark/brown) switcher.'].join('\n'), { fs: 17, wrap: 58, title: 'the repo\'s incident log' }),
      box('What was intended', 'Two <b>independent</b> theme systems: a global light/dark switch for the app shell, and a three-way switcher inside Notes. Two switches, two scopes.', 'lam')),
    D(box('What the selector actually says', '<code>:is(.dark *)</code> has <b>no scope</b>. Any <code>.dark</code> ancestor anywhere switches on every <code>dark:</code> utility beneath it. The two systems were never independent — they shared <b>one keyword</b>.', 'do2'),
      box('Blast radius', `<code>.dark</code> on <code>&lt;html&gt;</code> makes every element a descendant of <code>.dark</code>: all <b>${n(TONG)}</b> <code>dark:</code> uses in this app fire at once.`, 'do2')), 'r46'),
    en: 'The incident. The global theme put dot dark on html, and that force-activated every dark utility inside Notes, breaking its own three-theme switcher. The intent was two independent systems. The selector has no scope: they shared one keyword.' },
  { t: 'Reproduced in Chromium: Notes in BROWN, still dark', body: two(D(B('nodark', { url: 'no-dark.html · <html class="dark">', h: 200, w: 560 }), B('notheme', { url: 'no-themedark.html · <html class="theme-dark">', h: 200, w: 560 })),
    D(cmp(['&lt;html&gt; class', 'Notes box background', 'text'], [['dark', `<b>${mau(ND[0])}</b>`, ND[1]], ['theme-dark', `<b>${mau(NT[0])}</b>`, NT[1]]], { hl: [0] }),
      box('Read it', 'The Notes wrapper says <code>data-notes-theme="brown"</code>, and its box has <code>bg-amber-100 dark:bg-slate-900</code>. With <code>.dark</code> on <code>&lt;html&gt;</code> the box is <b>dark</b> anyway. Rename the global class to <code>theme-dark</code> and the brown theme is back.', 'lam')), 'r46'),
    en: 'Reproduced in Chromium. The Notes wrapper is in brown theme, its box has amber background and a dark variant. With dot dark on html the box is slate nine hundred anyway. Rename the global class to theme-dark and the box is amber again.' },
  { t: 'The fix is a NAMING fix, not a code fix', body: two(D(tn(['CLAUDE.md rule (the repo\'s own wording, condensed):', 'The GLOBAL dark theme class is theme-dark, NEVER dark.', 'Tailwind dark: variants are RESERVED for the Notes wrapper', '(NotesThemeProvider puts .dark on .notes-theme-root).', 'Global theme styles use html.theme-dark … or theme CSS variables.'].join('\n'), { fs: 16, wrap: 62, title: 'the rule' }),
      tn([`$ grep -n 'darkMode' tailwind.config.ts`, ...K("grep -n 'darkMode'"), `$ git grep -c 'theme-dark' -- src/app/globals.css`, TD].join('\n'), { fs: 15, wrap: 62, title: 'frontend/ (real)' })),
    D(box('Nothing in the Tailwind config changed', '<code>darkMode</code> is still <code>"class"</code>. The global theme was <b>renamed</b> to a class Tailwind knows nothing about, freeing <code>.dark</code> to mean exactly one thing: the Notes wrapper\'s dark state.', 'xanh'),
      box('Namespace separation', 'Two systems now use <b>different words</b> for different concepts — which is what they should have done from the start.', 'lam')), 'r46'),
    en: 'The fix is a naming fix. Nothing in the Tailwind config changed: dark mode is still class. The global theme was renamed to theme-dark, which Tailwind knows nothing about, freeing dot dark to mean one thing: the Notes wrapper. Two systems, two words.' },
  { t: 'Does the rule hold? Count it', body: two(D(tn([`$ git grep -oh 'dark:[^ "'\`]*' -- 'src/*.tsx' | wc -l`, String(TONG), `$ … -- 'src/components/notes/…' | wc -l`, String(NOTES), `$ … -- 'src/*.tsx' ':!src/components/notes' | wc -l`, String(NGOUT()), `$ git grep -l 'dark:' … ':!src/components/notes' | wc -l`, String(NFILE)].join('\n'), { fs: 15, wrap: 60, title: 'frontend/ · 14/11/2026 (real)' }),
      meter([['inside notes/', NOTES, '#1f8a3b'], ['outside notes/', NGOAI, '#c0392b']], { don: '', nhan: 150, fs: 17, rh: 42, w: 480 })),
    D(box('Read it', `<b>${PT}%</b> compliance today: ${n(NOTES)} of ${n(TONG)} <code>dark:</code> uses live in Notes. The lesson measured <b>91.9%</b> (722 of 786, 64 outside in 32 files). The drift has <b>grown</b>: ${NGOAI} uses in ${NFILE} files.`, 'do2'),
      box('Why it matters', 'Outside Notes, nothing ever sets <code>.dark</code>, so those utilities never fire: <b>dead styles</b>. Harmless today, a trap the moment someone puts <code>.dark</code> higher in the tree again. They should move to <code>html.theme-dark</code> CSS or be deleted.', 'lam')), 'r46'),
    en: 'Does the rule hold? Count it. Today eighty-three percent of the dark uses live in Notes; the lesson measured ninety-one point nine. The drift has grown: one hundred eighty-seven uses in fifty-six files. Nothing outside Notes sets dot dark, so they are dead styles.' },
  { t: 'Where the dead dark: styles live', body: two(D(tn([`$ git grep -l 'dark:' -- 'src/*.tsx' ':!src/components/notes' | cut -d/ -f2-3 | sort | uniq -c | sort -rn | head -6`, ...NOI].join('\n'), { fs: 16, wrap: 60, title: 'frontend/ (real)' })),
    D(box('Read it', 'They cluster in features built <b>after</b> the rule was written — CT Work, exp-hub, language, tech-trends, cv. Each one is a person who <b>believed</b> they were styling something.', 'lam'),
      box('A documented rule is a hypothesis', `${PT}% compliance <b>looks</b> like success and is simultaneously live debt. None of it gets moved or deleted unless someone <b>counts</b>.`, 'xanh')), 'r46'),
    en: 'Where the dead styles live: CT Work, exp-hub, language, tech-trends, cv — features built after the rule. Each is someone who believed they were styling something. A documented rule is a hypothesis; nothing gets cleaned unless someone counts.' },
  { t: 'Trap: a measurement that returns 0', body: two(D(tn([`$ git grep -oh 'dark:[a-z0-9/\\[\\]#.-]*' -- 'src/*.tsx' | wc -l`, String(BAY), `$ git grep -oh 'dark:[^ "'\`]*' -- 'src/*.tsx' | wc -l`, String(TONG)].join('\n'), { fs: 16, wrap: 60, title: 'frontend/ (real) — reproduced 14/11/2026' })),
    D(box('Read it', 'The escaped brackets <b>inside</b> a character class broke the class itself, and the pattern matched <b>nothing</b>. The number is obviously wrong <b>only</b> because there is a baseline (1,102) to compare against.', 'do2'),
      box('The habit', 'A measurement that returns zero is more suspicious than one that returns a surprising number. Always keep a baseline count next to the filtered one.', 'xanh')), 'r46'),
    en: 'The trap: a measurement that returns zero. Escaped brackets inside a character class broke it, and the count is zero. It is obviously wrong only because a baseline count of one thousand one hundred two sits next to it. Zero is more suspicious than a surprise.' },
  { t: 'Tailwind 4: media by default, :where() for classes', body: two(D(tn(['$ cat mac-dinh.css  →  @import "tailwindcss";', ...V4A.split('\n'), '$ cat lop.css  →  + @custom-variant dark (&:where(.dark, .dark *));', ...V4B.split('\n')].join('\n'), { fs: 14, wrap: 62, title: 'Tailwind 4.3.5 (real)' })),
    D(box('Read it', 'Default is <code>prefers-color-scheme</code>. The class strategy is a one-line <code>@custom-variant</code> — compiled with <code>:where()</code>, so <b>0,1,0</b>, like the <code>selector</code> strategy measured red on slide 4.', 'lam'),
      box('For this repo, if it migrates', `Every <code>dark:</code> rule loses one level of specificity, and rules that won by it (white over <code>.note</code>) can start losing. The variant name is yours to choose: <code>@custom-variant notes-dark (…)</code> makes the namespace split explicit.`, 'do2')), 'r46'),
    en: 'Tailwind four: media by default, and the class strategy is a one-line custom variant compiled with where: zero one zero. If this repo migrates, every dark rule loses a level of specificity. And you choose the variant name, which makes the namespace split explicit.' },
  { t: 'The whole lesson on one table', body: cmp(['', 'trigger', 'specificity', 'scope'], [
      ["darkMode: 'media'", 'OS setting', '0,1,0', 'whole page, user cannot override'],
      ["darkMode: 'class'", '<code>.dark</code> ancestor', '<b>0,2,0</b>', '<b>none</b> — any ancestor anywhere'],
      ["['selector', '.x']", '<code>.x</code> on self or ancestor', '0,1,0', 'none'],
      ['Tailwind 4 @custom-variant', 'what you write', '0,1,0 with :where', 'what you write'],
    ], { hl: [1] }) + box('One sentence', '<code>dark:</code> compiles to an ancestor test with no scope, so one class high in the DOM switches on every such utility at once — which is why the global theme here is called <code>theme-dark</code> and <code>.dark</code> is reserved.', 'xanh'),
    en: 'The whole lesson on one table: media, class, selector, and Tailwind four. Dark compiles to an ancestor test with no scope, so one class high in the DOM switches everything. That is why the global theme here is theme-dark and dot dark is reserved.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'Your phone switches to dark mode at night (the <code>media</code> strategy). A site with only half its <code>dark:</code> styles shows dark text on a dark background — readable at noon, invisible at 11pm.', 'lam'),
      box('What if…', `…someone puts <code>.dark</code> back on <code>&lt;html&gt;</code>? All ${NGOAI} dead <code>dark:</code> uses in ${NFILE} files wake up at once — CT Work, exp-hub, CV — the 02/07 incident again, wider.`, 'xanh')),
    D(box('The attacker\'s view: text one theme hides', 'White text on a white card (or black on black): scam pages hide fees and terms this way, SEO spam hides keywords, and pages hide instructions aimed at AI assistants that read them ("prompt injection").', 'do2'),
      box('Defend', 'Press <b>Ctrl/⌘ + A</b> — selection reveals hidden text; switch the theme and look again. As a developer: check contrast in <b>both</b> themes (Chapter 9).', 'ok')), 'r46'),
    en: 'In real life: phones switch to dark at night, and half-finished dark styles give dark text on dark backgrounds. What if dot dark goes back on html? One hundred eighty-seven dead uses wake up. And the attacker view: text hidden in one theme, for fees, spam or instructions aimed at AI. Select all to reveal it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw("darkMode: 'media'", 'OS preference, no DOM state'), kw("darkMode: 'class'", ':is(.dark *), 0,2,0'), kw("['selector', '.x']", ':where(), 0,1,0'),
      kw('blast radius', 'one ancestor, every dark: utility'), kw('namespace separation', 'theme-dark vs .dark'), kw('dead styles', 'dark: that never fires'),
      kw('baseline count', 'catches a measurement of 0'), kw('@custom-variant (v4)', 'name and scope it yourself'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: media, class and selector strategies; blast radius; namespace separation; dead styles; a baseline count; and Tailwind four custom variants.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Build one dark: class with media, class and selector — compare the three selectors',
      `Load a 0,1,0 hand rule after Tailwind and switch ${c("'class'")} → ${c("'selector'")}: what colour wins?`,
      'Put a brown-themed wrapper inside html.dark and measure its background',
      'Count dark: inside and outside the scope it is reserved for — next to a baseline',
    ]), box('Keep these', '<ul><li>dark: is an ancestor test with no scope</li><li>class = 0,2,0; selector / :where = 0,1,0</li><li>Fix collisions by naming, not by config</li><li>A rule that nobody counts drifts</li></ul>', 'lam'), ''),
    en: 'Your turn: compile the three strategies; switch class to selector and watch a colour change; put a brown wrapper inside html dark and measure it; count dark uses inside and outside their scope next to a baseline. Keep: dark is an ancestor test with no scope.' },
];
function NGOUT() { return NGOAI; }
export const slides = lamDeck({ chuong: 'Chapter 2 — Variants, and what they compile to', bai: '2.4' }, S);
