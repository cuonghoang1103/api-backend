/*DU_LIEU*/
const DU_LIEU = {
 "t3-5:file:tw.config.js": "module.exports = { content: ['./*.html'], important: true };\n",
 "t3-5:file:in.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
 "t3-5:file:page.html": "<div class=\"p-8! !p-6 p-2 hover:text-red-500!\"></div>\n",
 "t3-5:v3": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 87ms.\n$ cat out.css\n.\\!p-8 {\n  padding: 2rem !important\n}\n\n.p-2 {\n  padding: 0.5rem\n}\n\n.hover\\:\\!text-red-500:hover {\n  --tw-text-opacity: 1 !important;\n  color: rgb(239 68 68 / var(--tw-text-opacity, 1)) !important\n}",
 "t3-5:v4": "$ npx @tailwindcss/cli -i in.css -o ../im4o/out.css 2>&1 | tail -1\nDone in 24ms\n$ grep -A3 -E '^ *\\.(p-8\\\\!|\\\\!p-6|p-2|hover\\\\:text-red-500\\\\!) ' ../im4o/out.css | grep -vE '^ *}$' | head -14\n  .\\!p-6 {\n    padding: calc(var(--spacing) * 6) !important;\n  .p-2 {\n    padding: calc(var(--spacing) * 2);\n  .p-8\\! {\n    padding: calc(var(--spacing) * 8) !important;\n  @media (hover: hover) {",
 "t3-5:file:ben3.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\">\n<style>/* CSS cua mot widget ben thu ba — ban KHONG sua duoc */\n  #widget .title { color: rgb(37, 99, 235); }\n  #widget2 .title { color: rgb(37, 99, 235) !important; }</style></head>\n<body class=\"space-y-2 p-4 text-lg\">\n  <div id=\"a\" class=\"rounded bg-slate-100\" style=\"padding:4px\">A · style=\"padding:4px\" + class p-8</div>\n  <div id=\"b\" class=\"rounded bg-slate-100 !p-8\" style=\"padding:4px\">B · style=\"padding:4px\" + class !p-8</div>\n  <div id=\"widget\"><p id=\"c\" class=\"title text-red-600\">C · #widget .title + text-red-600</p></div>\n  <div id=\"widget\"><p id=\"d\" class=\"title !text-red-600\">D · #widget .title + !text-red-600</p></div>\n  <div id=\"widget2\"><p id=\"e\" class=\"title !text-red-600\">E · #widget2 .title (!important) + !text-red-600</p></div>\n</body></html>\n",
 "t3-5:file:layer4/in.css": "@import \"tailwindcss\";\n@layer base { .x { color: rgb(22, 163, 74) !important; } }\n.card { padding: 4px; }\n",
 "t3-5:file:layer4/lop.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-2 p-4 text-lg\">\n  <div id=\"f\" class=\"card p-8 rounded bg-slate-100\">F · .card (NGOAI layer) + p-8</div>\n  <div id=\"g\" class=\"card p-8! rounded bg-slate-100\">G · .card (NGOAI layer) + p-8!</div>\n  <p id=\"h\" class=\"x text-red-600!\">H · @layer base .x { green !important } + text-red-600!</p>\n</body></html>\n",
 "t3-5:chrome": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 94ms.\n$ cd layer4 && npx @tailwindcss/cli -i in.css -o ../../imc4o.css 2>&1 | tail -1 && cp ../../imc4o.css out.css\nDone in 23ms\n$ grep -nE '^@layer|^\\.card|^  \\.x \\{' layer4/out.css | head -6\n2:@layer properties;\n3:@layer theme, base, components, utilities;\n4:@layer theme {\n20:@layer base {\n168:@layer utilities {\n197:@layer base {",
 "t3-5:kho": "$ git grep -ohE 'className=\"[^\"]*\"' -- 'src/*.tsx' | sed 's/^className=\"//; s/\"$//' | tr ' ' '\\n' | grep -c .\n197276\n$ git grep -ohE 'className=\"[^\"]*\"' -- 'src/*.tsx' | sed 's/^className=\"//; s/\"$//' | tr ' ' '\\n' | grep -cE '^[a-z0-9:-]*!'\n370\n$ git grep -ohE 'className=\"[^\"]*\"' -- 'src/*.tsx' | sed 's/^className=\"//; s/\"$//' | tr ' ' '\\n' | grep -E '^[a-z0-9:-]*!' | sort | uniq -c | sort -rn | head -5\n  48 !h-8\n  36 !w-auto\n  21 !h-[28px]\n  20 max-sm:!hidden\n  13 !h-auto\n$ git grep -c '!important' -- '*.css' | sort -t: -k2 -rn | head -4\nsrc/app/globals.css:46\nsrc/app/language/[code]/ielts/chung/cdt.module.css:13\nsrc/components/sach-hoc/course.module.css:12\nsrc/components/net-lab/netlab.module.css:10\n$ git grep -n 'className=\"!h-8 !w-auto\"' -- 'src/*.tsx' | head -2 | cut -c1-120\nsrc/app/work/[ws]/[key]/approvals/page.tsx:108:            <Select aria-label={wt('common.status')} value={status} onCha\nsrc/components/work/desk/DeskView.tsx:115:          <Select aria-label={wt('desk.team')} className=\"!h-8 !w-auto\" value=\n$ grep -n \"w-input disabled\" src/components/work/settings/shared.tsx\n207:    <select {...rest} className={cn('w-input disabled:cursor-not-allowed disabled:opacity-60', className)}>\n$ grep -n -A2 '^:is(input, select, textarea):where(.w-input) {' src/app/work/work.css\n362::is(input, select, textarea):where(.w-input) {\n363-  width: 100%; height: 32px; padding: 0 10px; border-radius: var(--w-radius);\n364-  border: 1px solid var(--w-border-strong); background: var(--w-panel); color: var(--w-text);",
 "t3-5:file:chon.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"><link rel=\"stylesheet\" href=\"/kho/src/app/work/work.css\"></head>\n<body class=\"space-y-3 bg-white p-4 text-base\">\n  <!-- Select cua CT Work = <select class=\"w-input …\">, nguoi goi them lop qua cn(). s0: chi w-input · s1: + h-8 w-auto · s2: + !h-8 !w-auto (nhu approvals/page.tsx:108) -->\n  <select id=\"s0\" class=\"w-input\"><option>Trạng thái: tất cả</option></select>\n  <select id=\"s1\" class=\"w-input h-8 w-auto\"><option>Trạng thái: tất cả</option></select>\n  <select id=\"s2\" class=\"w-input !h-8 !w-auto\"><option>Trạng thái: tất cả</option></select>\n</body></html>\n",
 "t3-5:ctw": "$ npx tailwindcss -c ../kho/tailwind.config.ts --content ./chon.html -i in.css -o out.css 2>&1 | tail -1\nDone in 116ms.",
 "t3-5:file:cfg.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body style=\"margin:0;padding:16px\">\n  <!-- thu vien bieu do dat chieu rong bang inline style tu JavaScript -->\n  <div id=\"w\" class=\"w-full bg-cyan-200\" style=\"width:300px\">widget: class w-full + style width:300px</div>\n</body></html>\n",
 "t3-5:cauhinh": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 89ms.\n$ grep -A2 '^\\.w-full' out.css\n.w-full {\n  width: 100% !important\n}",
 "anh-twc-3-5:ben": {
  "url": "http://127.0.0.1:20119/imc/ben3.html",
  "vp": [
   560,
   260
  ],
  "rect": {
   "#a": [
    16,
    16,
    528,
    36
   ],
   "#b": [
    16,
    60,
    528,
    92
   ],
   "#c": [
    16,
    160,
    528,
    28
   ],
   "#d": [
    16,
    196,
    528,
    28
   ],
   "#e": [
    16,
    232,
    528,
    28
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"a\":\"4px\",\"b\":\"32px\",\"c\":\"rgb(37, 99, 235)\",\"d\":\"rgb(220, 38, 38)\",\"e\":\"rgb(37, 99, 235)\"}"
  }
 },
 "anh-twc-3-5:lop": {
  "url": "http://127.0.0.1:20119/imc/layer4/lop.html",
  "vp": [
   560,
   190
  ],
  "rect": {
   "#f": [
    16,
    16,
    528,
    36
   ],
   "#g": [
    16,
    60,
    528,
    92
   ],
   "#h": [
    16,
    160,
    528,
    28
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"f\":\"4px\",\"g\":\"32px\",\"h\":\"rgb(22, 163, 74)\"}"
  }
 },
 "anh-twc-3-5:chon": {
  "url": "http://127.0.0.1:20119/imk/chon.html",
  "vp": [
   560,
   190
  ],
  "rect": {
   "#s0": [
    16,
    16,
    528,
    32
   ],
   "#s1": [
    16,
    60,
    128,
    32
   ],
   "#s2": [
    148,
    60,
    128,
    32
   ]
  },
  "console": [],
  "ketQua": {
   "s": "[[\"s0\",\"32px\",528],[\"s1\",\"32px\",128],[\"s2\",\"32px\",128]]"
  }
 },
 "anh-twc-3-5:cfg": {
  "url": "http://127.0.0.1:20119/imi/cfg.html",
  "vp": [
   560,
   90
  ],
  "rect": {
   "#w": [
    16,
    16,
    528,
    18
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"w\":528}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tsx, tn, br, box, two, steps, kw, c, cmp } from './_twc-chung.mjs';

export const deck = { key: 'twc-03-5', code: 'TWC 3.5', title: 'The escalation ladder, and where !important belongs', sub: 'Chapter 3 · Lesson 3.5' };
const O = (k) => { const v = DU_LIEU[`t3-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-3-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-03-5', ten, { vp: 560, ...o });
const bo = (x) => x.replace(/\s+/g, '');

// ── số đo (chạy thật t3-5 · Tailwind 3.4.19 + 4.3.5 · Chromium · cấu hình thật + work.css của frontend/, 14/11/2026)
const V3 = doan('v3', 'cat out.css').join('\n').trim();
const V4 = doan('v4', 'grep -A3').join('\n');
const BEN = JSON.parse(A('ben').ketQua.s), LOP = JSON.parse(A('lop').ketQua.s), CFG = JSON.parse(A('cfg').ketQua.s);
const CHON = Object.fromEntries(JSON.parse(A('chon').ketQua.s).map(([i, h, w]) => [i, [h, w]]));
const NTOK = +doan('kho', 'grep -c .')[0].trim(), NBANG = +doan('kho', "grep -cE '^[a-z0-9:-]*!'")[0].trim();
const TOP = doan('kho', 'uniq -c'), IMP = doan('kho', "git grep -c '!important'");
const HIT = doan('kho', '!h-8 !w-auto'), WIN = doan('kho', 'w-input disabled')[0], WCSS = doan('kho', 'where(.w-input)');
const CFGO = doan('cauhinh', "grep -A2").join('\n');
if (!V3.includes('padding: 2rem !important') || !V3.includes('--tw-text-opacity: 1 !important') || !V4.includes('.p-8\\!') || !V4.includes('.\\!p-6')) throw new Error('đầu ra đổi');
if (BEN.a !== '4px' || BEN.b !== '32px' || BEN.c !== 'rgb(37, 99, 235)' || BEN.d !== 'rgb(220, 38, 38)' || BEN.e !== 'rgb(37, 99, 235)') throw new Error('số đo bên thứ ba đổi');
if (LOP.f !== '4px' || LOP.g !== '32px' || LOP.h !== 'rgb(22, 163, 74)' || CFG.w !== 528) throw new Error('số đo layer/config đổi');
if (CHON.s0[1] !== 528 || CHON.s1[0] !== '32px' || CHON.s1[1] !== CHON.s2[1] || CHON.s1[0] !== CHON.s2[0]) throw new Error('số đo CT Work đổi');
if (NTOK !== 197276 || NBANG !== 370 || !IMP[0].includes('globals.css:46')) throw new Error('số đo kho đổi');
const BEN_HTML = `<style>/* CSS cua mot widget ben thu ba — ban KHONG sua duoc */
  #widget .title { color: rgb(37, 99, 235); }
  #widget2 .title { color: rgb(37, 99, 235) !important; }</style>`;
if (!bo(O('file:ben3.html')).includes(bo(BEN_HTML))) throw new Error('mã hiển thị KHÔNG khớp ben3.html');
const LAY = `@layer base { .x { color: rgb(22, 163, 74) !important; } }
.card { padding: 4px; }`;
if (!bo(O('file:layer4/in.css')).includes(bo(LAY))) throw new Error('mã hiển thị KHÔNG khớp layer4/in.css');
const mau = (s) => s === 'rgb(37, 99, 235)' ? 'blue (widget)' : s === 'rgb(220, 38, 38)' ? '<b>red</b> (yours)' : s === 'rgb(22, 163, 74)' ? 'green (base layer)' : s;
const pct = (NBANG / NTOK * 100).toFixed(2);

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.5', t: 'The escalation ladder,<br>and where !important belongs', sub: 'Every conflict has a right fix and a quick fix; ! is almost always the quick one. What it compiles to, the ladder to climb first, the uses that are legitimate — and what this site actually does',
    en: 'Lesson three point five. Every conflict in this chapter has a right fix and a quick fix, and the important modifier is almost always the quick one. This lesson gives an ordered ladder to climb, and measures how a real codebase behaves.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What <code>!</code> compiles to in Tailwind 3 (<code>!p-8</code>) and Tailwind 4 (<code>p-8!</code>)</li>
    <li>What <code>!important</code> really does: a higher <b>origin</b>, not more specificity</li>
    <li>The ladder: remove → merge → check the layer → only then <code>!</code></li>
    <li>The legitimate uses, measured in Chromium — and the surprise with layers</li>
    <li>This site: <b>${NBANG}</b> <code>!</code> utilities — and a measured case where they were not needed</li></ul>`,
    en: 'Five takeaways: what the bang compiles to in both versions; what important really does; the ladder to climb first; the legitimate uses, measured, plus a surprise with layers; and this site\'s three hundred seventy bang utilities, including a case where they were not needed.' },
  { t: 'What the modifier compiles to', body: two(D(html('<div class="!p-8 p-2 hover:!text-red-500"></div>', { sm: true }), css(V3, { sm: true }), box('Tailwind 3.4.19 (real)', '<code>!</code> appends <code>!important</code> to <b>every</b> declaration the utility emits — two for the colour. Placement: after the variant, <code>hover:!text-red-500</code>.', 'lam')),
    D(html('<div class="p-8! !p-6 p-2 hover:text-red-500!"></div>', { sm: true }), tn(['$ … grep the built CSS   # Tailwind 4.3.5', V4].join('\n'), { fs: 13, wrap: 56, title: 'Tailwind 4.3.5 (real)' }),
      box('Tailwind 4', 'The documented spelling moves to the <b>end</b>: <code>p-8!</code>, <code>hover:text-red-500!</code>. The old leading <code>!p-6</code> still compiles — measured.', 'xanh')), 'r46'),
    en: 'What the modifier compiles to. In Tailwind three, bang p-eight appends important to every declaration it emits, two for a colour, and the bang goes after the variant. Tailwind four documents it at the end, p-eight bang, and the old leading form still compiles.' },
  { t: 'What !important REALLY does', body: two(D(box('Not more specificity — a higher origin', '<code>!important</code> moves the declaration to a separate, higher <b>cascade origin</b> that is resolved first. Every normal declaration loses to it, whatever its specificity. The only thing that beats it is another <code>!important</code> — and then specificity decides again.', 'lam'),
      box('No rung above it', 'Once two sides both use <code>!important</code>, there is no escape hatch left. That is why it is the <b>last</b> rung.', 'do2')),
    D(B('ben', { url: 'imc/ben3.html · Tailwind 3.4.19', h: 250, w: 540 }),
      cmp(['case', 'measured'], [['inline <code>padding:4px</code> + <code>p-8</code>', `<b>${BEN.a}</b> — inline wins`], ['inline + <code>!p-8</code>', `<b>${BEN.b}</b> ✓`], ['<code>#widget .title</code> + <code>text-red-600</code>', mau(BEN.c)], ['…+ <code>!text-red-600</code>', mau(BEN.d)], ['widget also <code>!important</code>', mau(BEN.e) + ' — specificity again']], { hl: [4] })), 'r46'),
    en: 'What important really does. It moves the declaration to a higher cascade origin. Measured: an inline padding of four pixels beats p-eight; bang p-eight wins. A third-party id selector beats text-red; the bang version wins. But when the widget also uses important, specificity decides again, and the widget wins.' },
  { t: 'The ladder, in the order you should climb it', body: cmp(['rung', 'do this', 'because'], [
      ['1 · remove the conflict', 'delete the class you did not mean to write', 'same property + same scope is a bug (3.2); the only fix that leaves simpler code'],
      ['2 · merge, don\'t concatenate', 'compose runtime classes through <code>cn()</code>', 'last-written wins, as the code already looks (3.4)'],
      ['3 · check the layer', 'is a hand-written rule beating you by <b>specificity</b> or by being <b>outside @layer</b>?', 'the fixes differ — Chapter 7 measures this site'],
      ['4 · only then <code>!</code>', 'for CSS you cannot change: third-party, injected inline styles', 'leave a comment saying which rule you are overriding'],
    ], { hl: [3] }) + box('Before ANY rung: 30 seconds in DevTools', 'Select the element, read Styles top-down: the winning declaration is the top one not struck through, and its selector tells you whether you fight a utility (rung 2), your own CSS (rung 3), or something you do not control (rung 4).', 'xanh'),
    en: 'The ladder. First, remove the conflict. Second, merge instead of concatenating. Third, check the layer: is a hand-written rule winning by specificity or by being outside a layer? Only then, the bang, for CSS you cannot change. And before any rung, thirty seconds in DevTools tells you which rung you need.' },
  { t: 'Rung 3 in Tailwind 4: layers, and the inversion', body: two(D(css(LAY, { sm: true }), html('<div class="card p-8">…</div>\n<div class="card p-8!">…</div>\n<p class="x text-red-600!">…</p>', { sm: true })),
    D(B('lop', { url: 'imc/layer4/lop.html · Tailwind 4.3.5', h: 120, w: 520 }),
      cmp(['case', 'measured'], [['unlayered <code>.card</code> + <code>p-8</code>', `<b>${LOP.f}</b>`], ['… + <code>p-8!</code>', `<b>${LOP.g}</b>`], ['base <code>!important</code> vs <code>text-red-600!</code>', `<b>${mau(LOP.h)}</b>`]], { hl: [2] }),
      box('The counter-intuitive rule', 'Normal: <b>later</b> layers win. <code>!important</code>: the order <b>reverses</b> — base beats utilities. Measured: green.', 'do2')), 'r46'),
    en: 'Rung three in Tailwind four. An unlayered rule beats a utility inside the utilities layer: four pixels; the bang version wins. And the counter-intuitive rule: for important declarations, layer order reverses. An important in the base layer beat the important utility. Measured: green.' },
  { t: 'Legitimate uses — the short list', body: cmp(['use', 'why ! is right here'], [
      ['third-party CSS you cannot edit', 'a date picker or embedded widget with high-specificity selectors — you do not own the losing side'],
      ['overriding an <b>inline style</b> set by a library', 'inline styles beat every normal rule; measured above: <code>!p-8</code> was the only way past <code>padding:4px</code>'],
      ['print stylesheets', '<code>print:!hidden</code> — deliberate, narrow, rarely contested'],
      ['a dated one-line hotfix', 'ship now, fix properly later — with a comment naming the rule it overrides'],
    ]) + box('The characteristic bad use', 'Reaching for <code>!</code> <b>before</b> identifying what is winning. It compounds: week 3 <code>!important</code> on .card, week 7 a more specific <code>!important</code>, week 12 <code>!p-0</code> — and nobody can predict any padding without DevTools.', 'do2'),
    en: 'Legitimate uses: third-party CSS you cannot edit; overriding an inline style set by a library; print stylesheets; and a dated one-line hotfix with a comment. The bad use is reaching for the bang before identifying what is winning. It compounds, week after week.' },
  { t: `This site: ${NBANG} ! utilities — up from 11`, body: two(D(tn(['$ … tr \' \' \'\\n\' | grep -c .     # class tokens in className="…"', String(NTOK), "$ … | grep -cE '^[a-z0-9:-]*!'   # with the ! modifier", String(NBANG), '$ … | sort | uniq -c | sort -rn | head -5', ...TOP].join('\n'), { fs: 13, wrap: 58, title: 'frontend/ · 14/11/2026 (real)' })),
    D(tn(["$ git grep -c '!important' -- '*.css' | sort … | head -4", ...IMP].join('\n'), { fs: 13, wrap: 58, title: 'frontend/ · 14/11/2026 (real)' }),
      box('Read it', `<b>${NBANG}</b> of ${NTOK.toLocaleString('en-US')} class tokens (<b>${pct}%</b>) — still disciplined, but 34× the 11 this lesson first counted. The top two, <code>!h-8</code> and <code>!w-auto</code>, come from one place: CT Work's <code>&lt;Select&gt;</code>. Next slide: were they needed?`, 'lam')), 'r46'),
    en: 'This site, re-measured. Three hundred seventy bang utilities out of nearly two hundred thousand class tokens: zero point one nine percent, still disciplined, but thirty-four times the eleven first counted. The top two, bang h-eight and bang w-auto, come from one component: CT Work\'s Select.' },
  { t: 'A real case: were those ! needed? Measure first', body: two(D(tsx(`// ${HIT[0].split(':').slice(0, 2).join(':').replace('src/app/work/[ws]/[key]/', 'work/…/')}\n<Select … className="!h-8 !w-auto">\n\n// shared.tsx:${WIN.split(':')[0]}\n<select {...rest}\n  className={cn('w-input …', className)}>`, { sm: true }),
      css(WCSS.map((l) => l.replace(/^\d+[:-]/, '')).slice(0, 2).join('\n').replace(/; /g, ';\n  '), { sm: true })),
    D(cmp(['&lt;select class="w-input …"&gt;', 'height', 'width'], [['(nothing added)', CHON.s0[0], `${CHON.s0[1]}px (100%)`], ['<code>h-8 w-auto</code> — no !', `<b>${CHON.s1[0]}</b>`, `<b>${CHON.s1[1]}px</b>`], ['<code>!h-8 !w-auto</code> — as shipped', CHON.s2[0], `${CHON.s2[1]}px`]], { hl: [1] }),
      box('Read it', 'The <code>.w-input</code> rule is wrapped in <code>:is(…):where(.w-input)</code> — specificity 0,0,1, lower than any utility (0,1,0). So <code>w-auto</code> already wins <b>without</b> <code>!</code>, and <code>h-8</code> (32px) equals the rule\'s own height. Measured with this site\'s real config and <code>work.css</code>: identical results. The <code>!</code> were an escalation nobody needed — harmless today, a habit worth not copying.', 'do2')), 'r46'),
    en: 'A real case: were those bangs needed? CT Work\'s input rule is wrapped in is and where, so its specificity is lower than any utility. Measured with the real config and stylesheet: w-auto already wins without the bang, and h-eight equals the rule\'s own height. Identical results. An escalation nobody needed.' },
  { t: 'The config switch, and why not to use it', body: two(D(tn(['$ cat tw.config.js', "module.exports = { content: ['./*.html'],", '  important: true };', "$ grep -A2 '^\\.w-full' out.css", CFGO].join('\n'), { fs: 14, wrap: 46, title: 'Tailwind 3.4.19 (real)' }),
      html('<!-- a chart library sets the width -->\n<div class="w-full"\n     style="width:300px">widget</div>', { sm: true })),
    D(B('cfg', { url: 'imi/cfg.html · important: true', h: 90, w: 500 }),
      box('Read it', `With <code>important: true</code> <b>every</b> utility is <code>!important</code>. A library that sizes its widget with an inline <code>width:300px</code> is now overridden: measured <b>${CFG.w}px</b>, not 300. Components cannot be customised either — the only tool left is more <code>!important</code>.`, 'do2'),
      box('Its one legitimate scenario', 'Adopting Tailwind <b>gradually</b> inside an app with a large legacy stylesheet you cannot remove. Outside that migration, it is a trap.', 'lam')), 'r46'),
    en: 'The config switch. Important true makes every utility important. A chart library that sets an inline width of three hundred pixels is now overridden: measured five hundred twenty-eight. Its one legitimate scenario is adopting Tailwind gradually inside a big legacy stylesheet.' },
  { t: 'Trap: ! that hides a LAYER problem', body: two(D(box('The most common wasted escalation', 'A hand-written rule outside <code>@layer</code> beats your utility for a <b>structural</b> reason. <code>!p-8</code> fixes <b>one</b> element; the same structural problem remains for every other utility in the app.', 'do2'),
      box('Fix the structure instead', 'Move the rule into <code>@layer components</code> (Tailwind 3: <code>@layer</code> handled by the build; Tailwind 4: native cascade layers) — it fixes all of them at once. Chapter 7 measures this site.', 'xanh')),
    D(box('Comment template for a legitimate !', '<code>{/* !h-10: overrides .datepicker input { height: 44px } from react-datepicker — remove when upgrading to v7 */}</code><br>Which rule, why, and when it can go — so the clean-up can actually happen.', 'lam'),
      box('Related', 'Cascade layers and the 88% unlayered measurement — Chapter 7. Specificity — Web Foundations 3.1.', 'ok')), 'r46'),
    en: 'The trap: a bang that hides a layer problem. A rule outside any layer beats your utility for a structural reason; the bang fixes one element and leaves the problem for every other. Move the rule into a layer instead. And when a bang is legitimate, comment which rule, why, and when it can go.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'Writing "URGENT!!!" on every email: the first one works, the tenth is ignored, and real emergencies get lost. <code>!important</code> on everything is the same — it stops meaning anything.', 'lam'),
      box('What if…', '…a plugin you install injects <code>style="display:none"</code> on an element you need? A narrow <code>!</code> with a comment is the right tool — that is exactly case B above.', 'xanh')),
    D(box('The attacker\'s view: !important in injected CSS', 'Browser extensions, ad scripts or an XSS can inject CSS. With <code>!important</code> they beat almost all of your normal rules — hide a "Report" button, show a fake overlay, restyle a login form. Defend: a <b>Content-Security-Policy</b> that restricts <code>style-src</code>, escape user content, and remember that hiding is not protecting (lesson 2.2).', 'do2')), 'r46'),
    en: 'In real life: writing urgent on every email means nothing is urgent. What if a plugin injects display none? A narrow, commented bang is right. The attacker view: injected CSS with important beats almost all your rules. Defend with a Content-Security-Policy on style sources and by escaping user content.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('! prefix / suffix', 'v3 !p-8 · v4 p-8!'), kw('cascade origin', '!important changes origin, not specificity'), kw('escalation ladder', 'remove → merge → layer → !'),
      kw('important layer inversion', '!important in base beats !important utilities'), kw('legitimate uses', 'third-party, inline styles, print, dated hotfix'), kw('DevTools first', 'top un-struck declaration = winner'),
      kw('important: true', 'migration-only config switch'), kw('Content-Security-Policy', 'limits injected styles'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the bang prefix and suffix; cascade origin; the escalation ladder; the important layer inversion; legitimate uses; DevTools first; the important true config switch; and Content-Security-Policy.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build ${c('!p-8')} (v3) and ${c('p-8!')} (v4) and read the CSS`,
      `Beat an inline ${c('style')} with and without ${c('!')}; measure it`,
      `In Tailwind 4, put ${c('!important')} in ${c('@layer base')} and watch it beat a ${c('!')} utility`,
      `Count ${c('!')} utilities in your project; remove one and measure if anything changes`,
    ]), box('Keep these', '<ul><li>! = higher origin, not more specificity</li><li>Climb: remove → merge → layer → !</li><li>Legitimate: CSS you do not control</li><li>Measure before escalating — this site\'s ! were not needed</li></ul>', 'lam'), ''),
    en: 'Your turn: build the bang in both versions; beat an inline style with and without it; watch an important in the base layer beat an important utility; and count the bangs in your project, removing one to measure whether anything changes. Keep: measure before escalating.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Conflicts, where the model leaks', bai: '3.5' }, S);
