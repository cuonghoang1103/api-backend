/*DU_LIEU*/
const DU_LIEU = {
 "t1-4:kho": "$ for c in flex grid inline-flex block hidden absolute relative; do printf \"%-14s %6d\\n\" \"$c\" \"$(grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | sed 's/className=\"//;s/\"$//' | tr ' ' '\\n' | grep -cx \"$c\")\"; done\nflex             9107\ngrid             1173\ninline-flex      1645\nblock            1019\nhidden            412\nabsolute         1107\nrelative          826\n$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | grep -c 'flex'\n12547\n$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | grep 'flex' | grep -c 'items-center'\n7772\n$ for c in items-center gap-2 gap-3 justify-between flex-1 shrink-0 flex-wrap; do printf \"%-16s %6d\\n\" \"$c\" \"$(grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | sed 's/className=\"//;s/\"$//' | tr ' ' '\\n' | grep -cx \"$c\")\"; done\nitems-center       7739\ngap-2              3805\ngap-3              1378\njustify-between     853\nflex-1             1882\nshrink-0           2188\nflex-wrap          1657",
 "t1-4:file:input.css": "@import \"tailwindcss\";\n",
 "t1-4:file:keo.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 font-sans text-base text-slate-800\">\n  <div id=\"a\" class=\"mb-3 flex gap-2 rounded bg-slate-100 p-2\"><span class=\"w-6 bg-cyan-500\"></span><span>flex · chỉ display:flex<br>dòng thứ hai của nhãn</span></div>\n  <div id=\"b\" class=\"flex items-center gap-2 rounded bg-slate-100 p-2\"><span class=\"h-6 w-6 bg-cyan-500\"></span><span>flex items-center<br>dòng thứ hai của nhãn</span></div>\n</body></html>\n",
 "t1-4:file:co.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 font-sans text-base text-slate-800\">\n  <div class=\"mb-3 flex w-56 items-center gap-2 rounded bg-slate-100 p-2\"><span id=\"i1\" class=\"h-4 w-4 rounded-full bg-cyan-600\"></span><span>Mộtcáinhãnrấtdàichiếmhếtchỗ</span></div>\n  <div class=\"flex w-56 items-center gap-2 rounded bg-slate-100 p-2\"><span id=\"i2\" class=\"h-4 w-4 shrink-0 rounded-full bg-cyan-600\"></span><span class=\"truncate\">Mộtcáinhãnrấtdàichiếmhếtchỗ</span></div>\n</body></html>\n",
 "t1-4:file:bang.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 font-sans text-base text-slate-800\">\n  <p class=\"text-sm font-bold\">hàng flex lồng nhau</p>\n  <div class=\"mb-1 flex gap-4 bg-amber-50\"><span id=\"f1\">Tên</span><span id=\"f1b\" class=\"bg-amber-200\">Vai trò</span></div>\n  <div class=\"mb-3 flex gap-4 bg-amber-50\"><span id=\"f2\">Nguyễn Văn Thành</span><span id=\"f2b\" class=\"bg-amber-200\">Trưởng nhóm</span></div>\n  <p class=\"text-sm font-bold\">grid grid-cols-[auto_1fr]</p>\n  <div class=\"grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 bg-cyan-50\"><span>Tên</span><span id=\"g1b\" class=\"bg-cyan-200\">Vai trò</span><span>Nguyễn Văn Thành</span><span id=\"g2b\" class=\"bg-cyan-200\">Trưởng nhóm</span></div>\n</body></html>\n",
 "t1-4:trang": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 51ms\n$ grep -A1 -E '^ *\\.(flex|items-center|shrink-0) \\{' out.css\n  .flex {\n    display: flex;\n--\n  .shrink-0 {\n    flex-shrink: 0;\n--\n  .items-center {\n    align-items: center;",
 "anh-twc-1-4:keo": {
  "url": "http://127.0.0.1:20108/hang/keo.html",
  "vp": [
   640,
   170
  ],
  "rect": {
   "#a > span:first-child": [
    24,
    24,
    24,
    48
   ],
   "#b > span:first-child": [
    24,
    112,
    24,
    24
   ],
   "#a": [
    16,
    16,
    608,
    64
   ],
   "#b": [
    16,
    92,
    608,
    64
   ]
  },
  "console": [],
  "ketQua": {
   "keo": "[[\"mb-3 flex\",24,48],[\"flex items-center\",24,24]]"
  }
 },
 "anh-twc-1-4:co": {
  "url": "http://127.0.0.1:20108/hang/co.html",
  "vp": [
   640,
   130
  ],
  "rect": {
   "#i1": [
    24,
    28,
    0,
    16
   ],
   "#i2": [
    24,
    80,
    16,
    16
   ]
  },
  "console": [],
  "ketQua": {
   "co": "[[\"h-4 w-4\",0,16],[\"h-4 w-4 shrink-0\",16,16]]"
  }
 },
 "anh-twc-1-4:bang": {
  "url": "http://127.0.0.1:20108/hang/bang.html",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#f1b": [
    58,
    36,
    46,
    24
   ],
   "#f2b": [
    169,
    64,
    96,
    24
   ],
   "#g1b": [
    169,
    120,
    455,
    24
   ],
   "#g2b": [
    169,
    148,
    455,
    24
   ]
  },
  "console": [],
  "ketQua": {
   "x": "[[\"f1b\",58],[\"f2b\",169],[\"g1b\",169],[\"g2b\",169]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, tn, br, box, two, steps, kw, c, cmp, meter, icards } from './_twc-chung.mjs';

export const deck = { key: 'twc-01-4', code: 'TWC 1.4', title: 'Layout: why flex outnumbers grid', sub: 'Chapter 1 · Lesson 1.4' };
const O = (k) => { const v = DU_LIEU[`t1-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-1-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-01-4', ten, { vp: 640, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t1-4 · Tailwind 4.3.5 · Chromium · frontend/ Tailwind 3.4.19, 14/11/2026)
const bang = (dau) => Object.fromEntries(doan('kho', dau).map((l) => { const [k, v] = l.trim().split(/\s+/); return [k, +v]; }));
const PB = bang('for c in flex grid'), VT = bang('for c in items-center');
const CO_FLEX = +doan('kho', "grep -c 'flex'")[0], CAP = +doan('kho', "grep -c 'items-center'")[0];
const KEO = JSON.parse(A('keo').ketQua.keo), CO = JSON.parse(A('co').ketQua.co), X = Object.fromEntries(JSON.parse(A('bang').ketQua.x));
const TI = (PB.flex / PB.grid).toFixed(1), PT = ((CAP / CO_FLEX) * 100).toFixed(1);
if (PB.flex !== 9107 || PB.grid !== 1173 || CAP !== 7772 || VT['shrink-0'] !== 2188 || KEO[0][2] !== 48 || KEO[1][2] !== 24 || CO[0][1] !== 0 || CO[1][1] !== 16 || X.f1b === X.f2b || X.g1b !== X.g2b) throw new Error('số đo đổi');
const SHRINK = `<div class="mb-3 flex w-56 items-center gap-2 rounded bg-slate-100 p-2">
  <span id="i1" class="h-4 w-4 rounded-full bg-cyan-600"></span>
  <span>Mộtcáinhãnrấtdàichiếmhếtchỗ</span></div>
<div class="flex w-56 items-center gap-2 rounded bg-slate-100 p-2">
  <span id="i2" class="h-4 w-4 shrink-0 rounded-full bg-cyan-600"></span>
  <span class="truncate">Mộtcáinhãnrấtdàichiếmhếtchỗ</span></div>`;
const bo = (x) => x.replace(/\s+/g, '');
if (!bo(O('file:co.html')).includes(bo(SHRINK))) throw new Error('mã hiển thị KHÔNG khớp co.html');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.4', t: 'Layout: why flex<br>outnumbers grid', sub: 'The layout utilities are a thin rename of CSS. What is worth learning is the usage distribution — counted on this site today, and the three bugs it records, reproduced in Chromium',
    en: 'Lesson one point four. The layout utilities are a thin rename of CSS flexbox and grid. What is worth learning is how they are actually used, counted on this site today, and the bugs those counts record, reproduced in Chromium.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The distribution: which handful of classes carry the weight</li>
    <li>Why <code>flex</code> and <code>items-center</code> are really one idiom</li>
    <li>The short vocabulary worth knowing by heart</li>
    <li>Why <code>shrink-0</code> is a bug report — an icon measured at <b>0px</b></li>
    <li>Where grid is the right answer, shown on a table that breaks</li></ul>`,
    en: 'Five takeaways: the distribution, which handful of classes carry the weight; why flex and items-center are really one idiom; the short vocabulary worth knowing by heart; why shrink-zero is a bug report, with an icon measured at zero pixels; and where grid is the right answer.' },
  { t: 'The distribution — counted today', body: two(D(tn(['$ for c in flex grid inline-flex block hidden absolute relative; do', '    printf … "$(grep … | tr \' \' \'\\n\' | grep -cx "$c")"; done', ...doan('kho', 'for c in flex grid')].join('\n'), { fs: 16, title: 'frontend/ · 14/11/2026 (real)' })),
    D(meter(Object.entries(PB).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v, k === 'flex' ? '#0891b2' : k === 'grid' ? '#c28a00' : '#94a3b8']), { don: '', nhan: 130, fs: 16, rh: 40, w: 470 }),
      box('Read it', `<code>flex</code> beats <code>grid</code> <b>${n(PB.flex)}</b> to <b>${n(PB.grid)}</b> — <b>${TI}</b> to 1 (the lesson was written at 9.7). Not because grid is worse: most of an interface is arranging a few items along <b>one</b> axis.`, 'lam')), ''),
    en: 'The distribution, counted today. Flex beats grid nine thousand one hundred seven to one thousand one hundred seventy-three: about seven point eight to one. When the lesson was written it was nine point seven. Not because grid is worse: most of an interface is a few items along one axis.' },
  { t: 'The pair that dominates everything', body: two(D(tn(["$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | grep -c 'flex'", String(CO_FLEX), "$ … | grep 'flex' | grep -c 'items-center'", String(CAP)].join('\n'), { fs: 16, wrap: 60, title: 'frontend/ (real)' }),
      meter([['class attributes mentioning flex', CO_FLEX, '#94a3b8'], ['…that also have items-center', CAP, '#0891b2']], { don: '', nhan: 300, fs: 16, rh: 44, w: 560 })),
    box('Read it', `<b>${PT}%</b> of the class attributes that mention <code>flex</code> also say <code>items-center</code> (the lesson measured 69.1%). <code>flex</code> (${n(PB.flex)}) and <code>items-center</code> (${n(VT['items-center'])}) are the two most-used layout classes in the app — effectively <b>one idiom written as two words</b>.`, 'xanh'), 'r64'),
    en: 'The pair that dominates. Twelve thousand five hundred class attributes mention flex; seven thousand seven hundred seventy-two of them also say items-center: sixty-two percent. Flex and items-center are effectively one idiom written as two words.' },
  { t: 'Why the pair: display:flex alone STRETCHES', body: two(D(B('keo', { url: 'hang/keo.html · Tailwind 4.3.5', h: 170, w: 600 }),
      cmp(['row', 'icon box: width × height'], KEO.map(([k, w, h]) => [k, `${w} × <b>${h}px</b>`]))),
    D(box('Read it', `With only <code>flex</code>, <code>align-items</code> defaults to <b>stretch</b>: the 24px box grows to the label's height — measured <b>${KEO[0][2]}px</b>. Add <code>items-center</code> and it stays <b>${KEO[1][2]}px</b>, centred.`, 'lam'),
      box('So', 'If a row "looks off" — an icon floating to the top, a box too tall — a missing <code>items-center</code> is the first thing to check.', 'xanh')), 'r64'),
    en: 'Why the pair. Display flex alone stretches the children: align items defaults to stretch. Measured in Chromium, a twenty-four pixel box grows to forty-eight, the height of a two-line label. Add items-center and it stays twenty-four, centred. If a row looks off, check items-center first.' },
  { t: 'The vocabulary that actually matters — counted today', body: cmp(['class', 'uses today', 'what it is for'], [
      ['flex + items-center', `${n(CAP)} rows`, 'the base idiom: a row, children centred vertically'],
      ['gap-2 / gap-3', `${n(VT['gap-2'])} + ${n(VT['gap-3'])}`, 'space between children — replaces margin-on-every-child-but-the-last'],
      ['justify-between', n(VT['justify-between']), 'title left, actions right, space in the middle'],
      ['flex-1', n(VT['flex-1']), '"this child takes the remaining space" — content next to a fixed sidebar'],
      ['shrink-0', n(VT['shrink-0']), 'stop a child being squeezed below its size — almost always on icons'],
      ['flex-wrap', n(VT['flex-wrap']), 'let one row become several instead of overflowing'],
    ]),
    en: 'The vocabulary that matters, counted today. Flex with items-center; gap two and gap three, instead of margins on every child; justify-between, title left and actions right; flex-one, take the remaining space; shrink-zero, two thousand one hundred eighty-eight uses; and flex-wrap.' },
  { t: 'Reading shrink-0 as a bug report', body: two(D(meter([['shrink-0', VT['shrink-0'], '#c0392b'], ['grid', PB.grid, '#c28a00'], ['block', PB.block, '#94a3b8'], ['hidden', PB.hidden, '#94a3b8']], { don: '', nhan: 120, fs: 17, rh: 46, w: 540 }),
      box('Changed since the lesson was written', `The lesson said shrink-0 is used more than grid, block and hidden <b>combined</b>. Today: ${n(VT['shrink-0'])} vs ${n(PB.grid + PB.block + PB.hidden)} — still almost <b>twice</b> grid, no longer more than all three.`, 'lam')),
    D(box('Why it exists', 'Flexbox defaults to <code>flex-shrink: 1</code>: every child may be compressed below its content size when space runs out. Text copes. A 16×16 icon does not — and it only breaks at <b>narrow</b> widths, so it survives desktop testing and shows up on phones.', 'do2'),
      box('The surprise', '<code>h-4 w-4</code> does <b>not</b> stop it: width is a <i>starting</i> size, not a floor. Only <code>shrink-0</code> (or a <code>min-w-</code>) makes it one.', 'xanh')), 'r64'),
    en: 'Read shrink-zero as a bug report. It is used almost twice as often as grid. The written lesson said more than grid, block and hidden combined; that is no longer true. It exists because flex children shrink by default. An icon gets squeezed, only at narrow widths, so it survives desktop testing. And w-four does not stop it: width is a starting size, not a floor.' },
  { t: 'Chromium: the icon is squeezed to 0px', body: html(SHRINK, { sm: true, hl: [5] }) + two(D(B('co', { url: 'hang/co.html · Tailwind 4.3.5 · w-56 = 224px', h: 120, w: 600 }),
      cmp(['icon classes', 'measured width × height'], CO.map(([k, w, h]) => [k, `<b>${w}px</b> × ${h}px`]))),
    D(box('Read it', `The label is one long word, so its minimum width is the whole word. Flexbox takes the missing space from the icon: <b>${CO[0][1]}px</b> wide — it vanishes. With <code>shrink-0</code> it keeps <b>${CO[1][1]}px</b> and the label truncates instead.`, 'do2')), ''),
    en: 'Chromium. In a two hundred twenty-four pixel row, the label is one long word, so it cannot get narrower than that word. Flexbox takes the space from the icon: zero pixels wide, it vanishes, with h-four w-four still on it. With shrink-zero the icon keeps sixteen pixels and the label truncates instead.' },
  { t: 'Where grid IS the right answer', body: icards([
      ['list', 'Reach for flex — one axis, content-sized items', `Rows, toolbars, an icon next to a label, a stack of cards. Sizes come <b>from the content</b> and you arrange along one line. This is most of an app — hence ${n(PB.flex)} uses.`],
      ['layers', 'Reach for grid — two axes, or alignment ACROSS rows', 'A card gallery with equal widths, a form whose labels line up, a page shell with header / sidebar / content. The test: if things in <b>different rows</b> must line up, flex cannot do it and grid can.'],
    ], 2) + box('The ratio is a description, not advice', `${TI}:1 tells you what apps are made of. It does not tell you to avoid grid when the relationship is two-dimensional.`, 'lam'),
    en: 'Where grid is the right answer. Flex for one axis and content-sized items: rows, toolbars, icon and label. Grid for two axes, or when things in different rows must line up: card galleries, aligned forms, a page shell. The ratio describes apps; it is not advice to avoid grid.' },
  { t: 'Trap: a table built from nested flex rows', body: two(D(B('bang', { url: 'hang/bang.html · Tailwind 4.3.5', h: 175, w: 600 })),
    D(cmp(['second column starts at', 'row 1', 'row 2'], [['flex rows', `<b>${X.f1b}px</b>`, `<b>${X.f2b}px</b>`], ['grid grid-cols-[auto_1fr]', `${X.g1b}px`, `${X.g2b}px`]]),
      box('Read it', `Each flex row computes its own columns, so "Vai trò" starts at ${X.f1b}px in one row and ${X.f2b}px in the next. Grid gives both rows <b>one shared coordinate system</b>: ${X.g1b}px twice.`, 'do2'),
      box('The fix', `Reach for ${c('grid-cols-*')} instead of adding fixed widths to every cell.`, 'xanh')), 'r64'),
    en: 'The trap: a table built from nested flex rows. Each row computes its own columns, so the second column starts at fifty-eight pixels in one row and one hundred sixty-nine in the next. Grid gives both rows one shared coordinate system: one hundred sixty-nine twice. Reach for grid columns, not fixed widths on every cell.' },
  { t: 'Tailwind 3 vs Tailwind 4: the same rename', body: two(D(tn(["$ grep -A1 -E '^ *\\.(flex|items-center|shrink-0) \\{' out.css", ...doan('trang', 'grep -A1').filter((l) => l !== '--')].join('\n'), { fs: 17, title: 'Tailwind 4.3.5 (real)' })),
    D(box('Read it', '<code>flex</code> is <code>display: flex</code>, <code>items-center</code> is <code>align-items: center</code>, <code>shrink-0</code> is <code>flex-shrink: 0</code> — in Tailwind 3 and 4 alike. Nothing here changed between versions; only spacing values like <code>gap-2</code> now come from <code>--spacing</code> (lesson 1.1).', 'xanh'),
      box('Every number above', `The counts come from this site (Tailwind 3.4.19); the Chromium pages were built with Tailwind 4.3.5. The layout behaviour is plain CSS, so it is the same in both.`, 'lam')), 'r64'),
    en: 'Tailwind 3 versus 4: the same rename. Flex is display flex, items-center is align-items center, shrink-zero is flex-shrink zero, in both versions. The counts come from this site on Tailwind 3; the Chromium pages were built with Tailwind 4; the layout behaviour is plain CSS, so it is identical.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('flex + items-center', 'one idiom, two words'), kw('align-items: stretch', 'the default that grows boxes'), kw('gap-*', 'space between children'),
      kw('justify-between', 'title left, actions right'), kw('flex-1', 'take the remaining space'), kw('shrink-0', 'width becomes a floor'),
      kw('flex-wrap', 'one row ⇒ several'), kw('grid-cols-*', 'shared columns across rows'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: flex with items-center; align-items stretch, the default; gap; justify-between; flex-one; shrink-zero; flex-wrap; and grid columns, the shared coordinate system.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run the distribution loop on your own project: what is your flex : grid ratio?',
      `Build a row with only ${c('flex')} and a two-line label; measure the icon box, then add ${c('items-center')}`,
      `Shrink a row to ${c('w-56')} with a long word: measure the icon, then add ${c('shrink-0')}`,
      `Turn a two-row flex "table" into ${c('grid grid-cols-[auto_1fr]')} and compare column x positions`,
    ]), box('Keep these', '<ul><li>Learn the distribution, not the list</li><li>flex + items-center = one idiom</li><li>gap, not margins</li><li>Width is not a floor: shrink-0</li><li>Rows must align ⇒ grid</li></ul>', 'lam'), ''),
    en: 'Your turn: count your own flex to grid ratio; measure the stretch with and without items-center; squeeze an icon and fix it with shrink-zero; and turn a flex table into a grid. Keep: flex with items-center is one idiom, width is not a floor, and aligned rows need grid.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The scale, the thing worth learning', bai: '1.4' }, S);
