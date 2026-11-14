/*DU_LIEU*/
const DU_LIEU = {
 "t4-5:kho": "$ wc -l src/components/*/primitives.tsx\n     209 src/components/finance/primitives.tsx\n     350 src/components/language/primitives.tsx\n     390 src/components/settings/primitives.tsx\n     949 total\n$ for f in settings finance language; do printf \"%-9s export %2s · dark: that su %s\\n\" $f $(grep -c '^export' src/components/$f/primitives.tsx) $(grep -n 'dark:' src/components/$f/primitives.tsx | grep -vcE '^[0-9]+:\\s*(\\*|//|/\\*)'); done\nsettings  export 12 · dark: that su 0\nfinance   export 11 · dark: that su 0\nlanguage  export 13 · dark: that su 0\n$ git log --diff-filter=A --format='%h %ad' --date=short -- src/components/settings/primitives.tsx\nda160fbb4 2026-08-08\n$ sed -n 3,14p src/components/settings/primitives.tsx\n/**\n * Shared building blocks for /settings (added 2026-08-08).\n *\n * Every control here is theme-aware via CSS variables (`--bg-card`,\n * `--text-primary`, …). The page this replaced hardcoded `#0a0a14` and\n * `rgba(15,23,42,.6)`, which meant the settings screen stayed pitch black\n * in light mode while the rest of the site turned white.\n *\n * Per CLAUDE.md: the global dark class is `theme-dark`, never `dark` —\n * Tailwind's `dark:` variant is reserved for the Notes wrapper. Nothing in\n * this file uses a `dark:` utility; it reads the CSS variables instead, so\n * it follows whichever theme is active without a second code path.",
 "t4-5:bo": "$ git show da160fbb4^:frontend/src/app/settings/notifications/page.tsx | grep -nE \"0a0a14|rgba\\(15, ?23, ?42\" | cut -c1-110\n166:        background: 'rgba(15,23,42,0.6)',\n298:    <div className=\"min-h-screen w-full relative\" style={{ background: '#0a0a14' }}>\n330:            background: 'rgba(15,23,42,0.6)',\n$ sed -n 7,9p src/app/settings/notifications/page.tsx\n *\n *   - Theme-aware. The old page hardcoded `background: '#0a0a14'` and\n *     `rgba(15,23,42,.6)` panels, so it stayed pitch black in light mode.",
 "t4-5:file:hai.cjs": "// hai.cjs — hai Button o hai tep primitives (finance vs settings): da HOI TU toi dau? So tung lop cua chuoi nen.\nconst fs = require('node:fs'); const K = '/Users/admin/.rtq-twc/lab/kho/src/components/';\nconst nen = (tep, mau) => fs.readFileSync(K + tep, 'utf8').match(mau)[1].split(/\\s+/);\nconst fi = nen('finance/primitives.tsx', /cn\\('(inline-flex items-center justify-center[^']*)'/);\nconst se = nen('settings/primitives.tsx', /'(inline-flex items-center justify-center[^']*)'/);\nconst chung = fi.filter((x) => se.includes(x));\nconsole.log(`finance ${fi.length} lop · settings ${se.length} lop · chung ${chung.length}`);\nconsole.log('chi finance :', fi.filter((x) => !se.includes(x)).join(' '));\nconsole.log('chi settings:', se.filter((x) => !fi.includes(x)).join(' '));\n",
 "t4-5:hai": "$ node hai.cjs\nfinance 12 lop · settings 12 lop · chung 10\nchi finance : gap-1.5 transition-colors\nchi settings: gap-2 transition-all",
 "t4-5:file:theme.html": "<!doctype html><html><head><meta charset=\"utf-8\"><style>\n  /* gia tri THAT tu frontend/src/app/globals.css */\n  :root { --bg-card: #ffffff; --bg-primary: #f0f2f5; --text-primary: #050505; }\n  html.theme-dark { --bg-card: #242526; --bg-primary: #18191a; --text-primary: #e4e6eb; }\n  body { margin: 0; padding: 16px; background: var(--bg-primary); font: 15px system-ui, sans-serif; display: flex; gap: 12px; }\n  .the { flex: 1; border-radius: 14px; padding: 14px; color: var(--text-primary); border: 1px solid #8885; }\n</style></head><body>\n  <div id=\"cu\" class=\"the\" style=\"background: #0a0a14\">Trang CŨ: nền viết cứng #0a0a14<br><b>Thông báo đẩy</b> — Bật</div>\n  <div id=\"moi\" class=\"the\" style=\"background: var(--bg-card)\">primitives: nền var(--bg-card)<br><b>Thông báo đẩy</b> — Bật</div>\n</body></html>\n",
 "t4-5:chrome": "",
 "t4-5:conlai": "$ git grep -l 'bg-\\[#0a0a14\\]' -- 'src/*.tsx'\nsrc/app/games/[slug]/GamePlayClient.tsx\nsrc/components/messaging/BlockedUsersModal.tsx\nsrc/components/messaging/MessageList.tsx\nsrc/components/messaging/NicknamePopover.tsx\nsrc/components/messaging/ThreadRowMenu.tsx\n$ grep -n '0a0a14' src/app/globals.css\n419:  .bg-\\[\\#0a0a14\\],",
 "t4-5:xau": "$ git grep -c 'target=\"_blank\"' -- 'src/*.tsx' | awk -F: '{s+=$2} END {print s \" lan target=_blank trong \" NR \" tep\"}'\n232 lan target=_blank trong 145 tep\n$ git grep -hoE '<a [^>]*target=\"_blank\"[^>]*>' -- 'src/*.tsx' | awk '{n++} /rel=/{r++} END {print n \" the <a> viet mot dong · \" r \" co rel= · \" n-r \" thieu\"}'\n138 the <a> viet mot dong · 137 co rel= · 1 thieu\n$ git grep -nE '<a [^>]*target=\"_blank\"[^>]*>' -- 'src/*.tsx' | grep -v 'rel=' | cut -c1-96\nsrc/components/messaging/AnhLightbox.tsx:6: * Trước đây bấm ảnh trong tin nhắn là `<a target=\"_b",
 "anh-twc-4-5:sang": {
  "url": "http://127.0.0.1:20124/c45/theme.html",
  "vp": [
   560,
   150
  ],
  "rect": {
   "#cu": [
    16,
    16,
    258,
    84
   ],
   "#moi": [
    286,
    16,
    258,
    84
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"cu\":{\"bg\":\"rgb(10, 10, 20)\",\"chu\":\"rgb(5, 5, 5)\",\"tl\":\"1.04\"},\"moi\":{\"bg\":\"rgb(255, 255, 255)\",\"chu\":\"rgb(5, 5, 5)\",\"tl\":\"20.38\"}}"
  }
 },
 "anh-twc-4-5:toi": {
  "url": "http://127.0.0.1:20124/c45/theme.html",
  "vp": [
   560,
   150
  ],
  "rect": {
   "#cu": [
    16,
    16,
    258,
    84
   ],
   "#moi": [
    286,
    16,
    258,
    84
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"cu\":{\"bg\":\"rgb(10, 10, 20)\",\"chu\":\"rgb(228, 230, 235)\",\"tl\":\"15.77\"},\"moi\":{\"bg\":\"rgb(36, 37, 38)\",\"chu\":\"rgb(228, 230, 235)\",\"tl\":\"12.30\"}}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp } from './_twc-chung.mjs';

export const deck = { key: 'twc-04-5', code: 'TWC 4.5', title: 'A real extraction, and its bug', sub: 'Chapter 4 · Lesson 4.5' };
const O = (k) => { const v = DU_LIEU[`t4-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-4-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-04-5', ten, { vp: 560, ...o });

// ── số đo (chạy thật t4-5 · frontend/ + lịch sử git · Chromium · 14/11/2026)
const WC = doan('kho', 'wc -l'), EXP = doan('kho', 'for f in'), NGAY = doan('kho', 'git log')[0], HDR = doan('kho', 'sed -n 3,14p');
const BO = doan('bo', 'git show'), BO2 = doan('bo', 'sed -n 7,9p');
const HAI = doan('hai', 'node hai.cjs');
const CL = doan('conlai', "git grep -l"), CLG = doan('conlai', 'grep -n')[0];
const XB = doan('xau', "git grep -c"), XR = doan('xau', 'awk \'{n++}')[0], XC = doan('xau', "grep -v 'rel='")[0];
const SG = JSON.parse(A('sang').ketQua.s), TO = JSON.parse(A('toi').ketQua.s);
if (!WC.at(-1).includes('949') || !EXP.every((l) => l.endsWith('dark: that su 0')) || !NGAY.startsWith('da160fbb4 2026-08-08')) throw new Error('kho đổi');
if (BO.length !== 3 || !BO[1].includes("'#0a0a14'")) throw new Error('bọ cũ đổi');
if (!HAI[0].includes('chung 10')) throw new Error('hai Button đổi');
if (CL.length !== 5 || !CLG.startsWith('419:')) throw new Error('còn lại đổi');
if (SG.cu.tl !== '1.04' || SG.moi.tl !== '20.38' || TO.cu.tl !== '15.77') throw new Error('Chromium đổi');
if (!XR.startsWith('138 ') || !XC.includes('AnhLightbox.tsx:6: *')) throw new Error('target đổi');
const n12 = EXP[0].match(/export\s+(\d+)/)[1];

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.5', t: 'A real extraction,<br>and the bug that caused it', sub: 'Lessons 4.1–4.4 gave rules. This one reads an extraction that actually happened in this site — the settings primitives of 2026-08-08 — re-runs the bug that forced it, and checks what the file header promised',
    en: 'Lesson four point five, the last video of chapter four. The previous lessons gave rules for when to extract. This one reads an extraction that really happened in this site, re-runs the bug that forced it in Chromium, and checks every promise its file header makes.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three <code>primitives.tsx</code> files, 949 lines — and the header that is the real lesson</li>
    <li>The bug, re-run: hard-coded <code>#0a0a14</code> in light mode = contrast <b>${SG.cu.tl}</b></li>
    <li>The strongest reason to extract: <b>duplicated wrongness</b></li>
    <li>Feature-scoped vs global: two Buttons, <b>10 of 12</b> classes already the same</li>
    <li>Fixing one place: the security version of the same idea</li></ul>`,
    en: `Five takeaways: three primitives files and the header that is the real lesson; the bug re-run, where the hard-coded colour gives a contrast of ${SG.cu.tl} in light mode; duplicated wrongness as the strongest reason to extract; two Buttons that already share ten of twelve classes; and the security version of fixing one place.` },
  { t: 'What was extracted', body: two(D(tn(['$ wc -l src/components/*/primitives.tsx', ...WC, '$ for f in settings finance language; do … grep -c "^export" …', ...EXP, '$ git log --diff-filter=A … settings/primitives.tsx', NGAY].join('\n'), { fs: 15, wrap: 60, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Three files, one per feature area', `Each holds that area\'s building blocks. Settings exports <b>${n12}</b>: <code>SettingsPage</code>, <code>SettingsCard</code>, <code>SettingsRow</code>, <code>Toggle</code>, <code>TextInput</code>, <code>Button</code>, <code>StatusPill</code>…`, 'xanh'),
      box('Measured against the header', 'The header says the file uses <b>no</b> <code>dark:</code> utility. Counting only code lines (not comments): <b>0</b> in all three files. The promise holds three months later.', 'ok')), 'r64'),
    en: `What was extracted: three primitives files, nine hundred forty-nine lines, one per feature area. Settings exports ${n12} components, added on the eighth of August. The header promises no dark utility; counting only code lines, all three files have zero. The promise still holds.` },
  { t: 'The header — which is the actual lesson', body: two(D(tn(HDR.join('\n'), { fs: 15, wrap: 74, title: 'src/components/settings/primitives.tsx:3-14 (real)' })),
    D(cmp(['piece of knowledge', 'what it records'], [['<b>the bug</b>', '"stayed pitch black in light mode"'], ['<b>the mechanism</b>', 'CSS variables, not <code>dark:</code> — one class, both themes (chapter 6)'], ['<b>the constraint</b>', '"per CLAUDE.md": <code>theme-dark</code>, never <code>dark</code> (lesson 2.4)']], { hl: [0] }),
      box('Twelve lines, three facts', 'Each is the kind of thing that gets lost when it lives only in someone\'s memory. Six months later this is the difference between "why no <code>dark:</code>?" and knowing not to ask.', 'lam')), 'r64'),
    en: 'The header, which is the actual lesson. Twelve lines record three facts: the bug, the screen stayed pitch black in light mode; the mechanism, CSS variables instead of the dark variant; and the constraint from lesson two point four, theme-dark and never dark.' },
  { t: 'The bug, from git history', body: two(D(tn(["$ git show da160fbb4^:…/settings/notifications/page.tsx | grep -nE '0a0a14|rgba(15,23,42'", ...BO, '$ sed -n 7,9p src/app/settings/notifications/page.tsx', ...BO2].join('\n'), { fs: 14, wrap: 76, title: 'git history · the page BEFORE the extraction (real)' })),
    box('Not a duplication problem — a CORRECTNESS problem', 'Hard-coded colours scattered across a page: every copy of <code>#0a0a14</code> was a place the light theme could not reach, and there was no single place to fix it. The page that replaced it says so in its own header.', 'do2'), 'r64'),
    en: 'The bug, from git history. The notifications page before the extraction hard-coded hash zero a zero a one four on the whole page and a dark navy on two panels. Not a duplication problem, a correctness problem: every copy was a place the light theme could not reach.' },
  { t: 'Re-run the bug in Chromium — both themes', body: two(D(B('sang', { url: 'c45/theme.html · light theme (no class)', h: 150, w: 520 }), B('toi', { url: 'c45/theme.html · html.theme-dark', h: 150, w: 520 })),
    D(cmp(['card', 'theme', 'background', 'contrast'], [['hard-coded <code>#0a0a14</code>', 'light', `<code>${SG.cu.bg}</code>`, `<b>${SG.cu.tl}</b> ✗`], ['<code>var(--bg-card)</code>', 'light', `<code>${SG.moi.bg}</code>`, `${SG.moi.tl}`], ['hard-coded', 'dark', `<code>${TO.cu.bg}</code>`, `${TO.cu.tl}`], ['<code>var(--bg-card)</code>', 'dark', `<code>${TO.moi.bg}</code>`, `${TO.moi.tl}`]], { hl: [0] }),
      box('Read it', `The text colour follows the theme (<code>--text-primary</code> = #050505 in light). The hard-coded background does not. Result: near-black on near-black, <b>${SG.cu.tl}:1</b> — WCAG asks for 4.5. In dark mode both look fine, which is why nobody saw it while building.`, 'do2')), 'r46'),
    en: `Re-run the bug in Chromium with the site's real values. In light mode the text follows the theme and turns near-black, but the hard-coded background stays black: contrast ${SG.cu.tl} to one, against four point five required. In dark mode both cards look fine, which is exactly why nobody noticed while building.` },
  { t: 'Why this is the strongest reason to extract', body: D(cmp(['', 'copies are correct', 'copies are WRONG'], [['cost of duplication', 'maintenance — four places to edit', '<b>correctness</b> — the bug exists in every copy'], ['who notices', 'the next developer', 'every user in light mode'], ['what extraction buys', 'one place to change', 'one place to <b>fix</b>, and the fix reaches everyone']], { hl: [0] }),
    two(box('Lesson 4.1 said "long and repeated"', 'This extraction was triggered by something stronger: the duplicated thing was <b>wrong</b>, and being duplicated meant it was wrong in many places at once.', 'xanh'),
      box('Trap: extract, but keep the values', 'Moving <code>#0a0a14</code> from twenty call sites into one component makes it <b>easier</b> to fix later — the screen is still black in light mode until someone does. Extraction and correction are two steps; ship both.', 'do2'), '')),
    en: 'Why this is the strongest reason to extract. When the copies are correct, duplication costs maintenance. When the copies are wrong, it costs correctness, and every user sees it. The trap: extracting the component but keeping the hard-coded values. Extraction and correction are two steps; ship both.' },
  { t: 'Is the pattern gone? Measured', body: two(D(tn(["$ git grep -l 'bg-\\[#0a0a14\\]' -- 'src/*.tsx'", ...CL, "$ grep -n '0a0a14' src/app/globals.css", CLG].join('\n'), { fs: 15, wrap: 60, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Five files still paint #0a0a14', 'Messaging popovers and the game frame. They are <b>deliberate dark islands</b> — a popover that is dark in both themes.', 'lam'),
      box('And a safety net catches them', `<code>globals.css</code> line ${CLG.split(':')[0]} lists <code>.bg-[#0a0a14]</code> among the dark surfaces that re-declare the text variables to their dark values — so text inside stays readable in light mode. Lesson 9.2 measures that net.`, 'xanh')), 'r46'),
    en: `Is the pattern gone? Five files still paint hash zero a zero a one four: messaging popovers and the game frame. They are deliberate dark islands, and a safety net in globals dot css, line ${CLG.split(':')[0]}, re-declares the text colours inside them, so the text stays readable. Lesson nine point two measures that net.` },
  { t: 'What makes the file worth copying as a pattern', body: cmp(['choice', 'why it works'], [['<b>scoped to a feature</b> — <code>settings/primitives.tsx</code>', 'not <code>components/ui/</code>: building blocks are not reused where they do not fit, then generalised until they fit badly everywhere'], ['<b>one file, not twelve</b>', `${n12} small components in 390 lines — read and changed together`], ['<b>a header that says WHY</b>', 'the date, the bug, the mechanism, the constraint'], ['<b>consistent internals</b>', 'every control takes <code>className</code>, routes through <code>cn</code>, forwards refs (lesson 4.3) — learn one, know twelve']], { hl: [2] }),
    en: 'What makes the file worth copying: scoped to a feature rather than a global UI folder; one file with twelve small components instead of twelve files; a header that says why; and consistent internals, where every control takes className, goes through cn, and forwards refs.' },
  { t: 'Feature-scoped vs global — two Buttons, measured', body: two(D(tn(['$ node hai.cjs   # base classes of the two Button components', ...HAI].join('\n'), { fs: 15, wrap: 60, title: 'frontend/ · 14/11/2026 (real)' }),
      cmp(['', 'feature-scoped (this site)', 'global design system'], [['Button copies', '2 (finance, settings)', '1'], ['change one area', 'no regression sweep elsewhere', 'every change is cross-cutting'], ['risk', 'visual drift between areas', 'one component accreting every variant (4.4)']])),
    D(box('Converged: the signal to consolidate', '<b>10 of 12</b> base classes are already identical. The differences — <code>gap-1.5</code> vs <code>gap-2</code>, <code>transition-colors</code> vs <code>transition-all</code> — look like drift, not intent. When two areas\' primitives converge, duplication no longer buys independence.', 'lam'),
      box('Neither is universally right', 'Start feature-scoped; promote to a shared component when copies converge — not before.', 'ok')), 'r64'),
    en: 'Feature-scoped versus global, measured. The finance and settings Buttons share ten of twelve base classes; the two differences look like drift, not intent. That convergence is the signal to consolidate: duplication no longer buys independence. Start feature-scoped, promote when the copies converge.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'A typo in a <b>printed form template</b> is copied onto every form photocopied from it. Fixing the template fixes every future copy; fixing one form fixes one form. Extract when the copies are <b>wrong</b>.', 'lam'),
      box('What if…', '…the light theme had shipped before the extraction? Every settings card unreadable for every light-mode user — and the fix would have been twenty edits, each a chance to miss one.', 'xanh')),
    D(tn(['$ git grep -c \'target="_blank"\' … | awk …', ...XB, '$ git grep -hoE \'<a [^>]*target="_blank"[^>]*>\' … | awk …', XR, "$ … | grep -v 'rel='", XC].join('\n'), { fs: 13, wrap: 64, title: 'frontend/ · 14/11/2026 (real)' }),
      box('The attacker\'s view: a security fix is also "duplicated rightness"', '<code>target="_blank"</code> without <code>rel="noopener"</code> once let the opened page rewrite your tab (reverse tabnabbing → phishing). Here 137 of 138 one-line links carry <code>rel=</code>; the "missing" one is a <b>comment</b>. 232 hand-written copies of a fix are 232 chances to forget — an <code>&lt;ExternalLink&gt;</code> component makes it one.', 'do2')), 'r46'),
    en: 'In real life: a typo in a printed form template is copied onto every form. The attacker view: target blank without rel noopener once let the opened page rewrite your tab, a phishing trick. Here a hundred thirty-seven of a hundred thirty-eight one-line links have rel; the missing one is a comment. One component would make it one place.' },
  { t: 'Chapter 4 in one slide', body: cmp(['lesson', 'rule', 'measured on this site'], [['4.1', 'extract on <b>repetition</b>, not length', 'one input, 28 spellings, 16 files'], ['4.2', '<code>@apply</code> copies — use a component', '0 <code>@apply</code> in 24,610 lines of CSS'], ['4.3', '<code>className</code> is a contract: closed or merged last', '50 of 141 concatenate'], ['4.4', 'if-chain → lookup table → cva at the first compound rule', '147 files of lookup tables'], ['4.5', 'extract hardest when the copies are <b>wrong</b>', `contrast ${SG.cu.tl} → ${SG.moi.tl}`]], { hl: [4] }),
    en: `Chapter four in one slide. Extract on repetition. At-apply copies, so use a component. ClassName is a contract. Variants go from if-chain to lookup table to cva at the first compound rule. And extract hardest when the copies are wrong: contrast ${SG.cu.tl} became ${SG.moi.tl}.` },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('primitives file', 'one area\'s building blocks, one file'), kw('duplicated wrongness', 'the strongest reason to extract'), kw('hard-coded colour', 'a place the theme cannot reach'),
      kw('theme variable', 'var(--bg-card): one class, both themes'), kw('feature-scoped', 'settings/, finance/ — not a global ui/'), kw('convergence', '10/12 identical ⇒ consolidate'),
      kw('header that says WHY', 'date · bug · mechanism · constraint'), kw('dark island', 'deliberately dark in both themes'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: primitives file; duplicated wrongness; hard-coded colour; theme variable; feature-scoped; convergence; a header that says why; and a dark island.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Find hard-coded colours in your project: ${c("git grep -nE 'bg-\\[#[0-9a-f]{6}\\]'")}`,
      'Open one page in light AND dark — measure the contrast in DevTools',
      'Pick two copies of the same component — count shared classes',
      'Write a 10-line header for one extraction: date, bug, mechanism, rule',
    ]), box('Keep these', '<ul><li>Extract hardest when copies are wrong</li><li>Extraction + correction = two steps</li><li>Feature-scoped first; consolidate on convergence</li><li>The header records the WHY</li></ul>', 'lam'), ''),
    en: 'Your turn: find hard-coded colours, open a page in both themes and measure contrast, compare two copies of a component, and write a header for one extraction. Keep: extract hardest when copies are wrong; extraction and correction are two steps; consolidate on convergence; record the why.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Components, and the right place to reuse', bai: '4.5' }, S);
