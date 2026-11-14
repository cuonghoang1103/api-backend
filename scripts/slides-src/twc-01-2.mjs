/*DU_LIEU*/
const DU_LIEU = {
 "t1-2:file:co.mjs": "import resolveConfig from 'tailwindcss/resolveConfig.js';\nconst { theme } = resolveConfig({ content: [] });\nfor (const [k, v] of Object.entries(theme.fontSize)) {\n  const size = Array.isArray(v) ? v[0] : v;\n  console.log(`text-${k}`.padEnd(12), size.padEnd(10), parseFloat(size) * 16 + 'px');\n}\n",
 "t1-2:v3co": "$ node co.mjs\ntext-xs      0.75rem    12px\ntext-sm      0.875rem   14px\ntext-base    1rem       16px\ntext-lg      1.125rem   18px\ntext-xl      1.25rem    20px\ntext-2xl     1.5rem     24px\ntext-3xl     1.875rem   30px\ntext-4xl     2.25rem    36px\ntext-5xl     3rem       48px\ntext-6xl     3.75rem    60px\ntext-7xl     4.5rem     72px\ntext-8xl     6rem       96px\ntext-9xl     8rem       128px",
 "t1-2:v4co": "$ grep -E '^ *--text-[a-z0-9]+: ' node_modules/tailwindcss/theme.css\n  --text-xs: 0.75rem;\n  --text-sm: 0.875rem;\n  --text-base: 1rem;\n  --text-lg: 1.125rem;\n  --text-xl: 1.25rem;\n  --text-2xl: 1.5rem;\n  --text-3xl: 1.875rem;\n  --text-4xl: 2.25rem;\n  --text-5xl: 3rem;\n  --text-6xl: 3.75rem;\n  --text-7xl: 4.5rem;\n  --text-8xl: 6rem;\n  --text-9xl: 8rem;\n$ grep -cE '^ *--text-[a-z0-9]+: ' node_modules/tailwindcss/theme.css\n13",
 "t1-2:kho": "$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | sed 's/className=\"//; s/\"$//' | tr ' ' '\\n' | grep '\\[' | sort | uniq -c | sort -rn | head -8\n1884 text-[var(--w-text-3)]\n1710 text-[12px]\n1453 text-[13px]\n1417 text-[11px]\n1208 text-[var(--w-text-2)]\n 936 border-[var(--w-border)]\n 797 text-[12.5px]\n 632 text-[10px]\n$ for c in 'text-[10px]' 'text-[11px]' 'text-[13px]' 'text-[12px]'; do printf '%-13s %s\\n' \"$c\" \"$(grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | tr ' \"' '\\n\\n' | grep -cxF \"$c\")\"; done\ntext-[10px]   632\ntext-[11px]   1417\ntext-[13px]   1453\ntext-[12px]   1710\n$ grep -rho 'text-\\[11px\\]' src --include=\"*.tsx\" | wc -l\n    1544\n$ git ls-files 'src/*.tsx' | xargs grep -l 'text-\\[11px\\]' | wc -l\n     529\n$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | tr ' \"' '\\n\\n' | grep -cE '^[a-z-]+-\\[var\\(--'\n9374\n$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | tr ' \"' '\\n\\n' | grep -cxE 'text-text-(primary|secondary|muted)'\n6748",
 "t1-2:file:tailwind.config.js": "module.exports = {\n  content: ['./trang.html'],\n  theme: { extend: { fontSize: { xxs: '0.6875rem' } } },\n};\n",
 "t1-2:file:nhap.css": "@tailwind utilities;\n",
 "t1-2:file:trang.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 font-sans text-slate-800\">\n  <p class=\"mb-2\"><span id=\"a\" class=\"rounded bg-cyan-100 px-2 py-0.5 text-[11px] font-semibold\">text-[11px] · NEW</span> <span class=\"text-sm\">ghép thủ công, 11px</span></p>\n  <p class=\"mb-2\"><span id=\"b\" class=\"rounded bg-cyan-100 px-2 py-0.5 text-xxs font-semibold\">text-xxs · NEW</span> <span class=\"text-sm\">mục thang có tên</span></p>\n  <p><span id=\"c\" class=\"rounded bg-cyan-100 px-2 py-0.5 text-xs font-semibold\">text-xs · NEW</span> <span class=\"text-sm\">đáy thang mặc định, 12px</span></p>\n</body></html>\n",
 "t1-2:mo3": "$ npx tailwindcss -i nhap.css -o out.css 2>&1 | tail -1\nDone in 177ms.\n$ cat out.css\n.text-\\[11px\\] {\n  font-size: 11px\n}\n\n.text-xxs {\n  font-size: 0.6875rem\n}",
 "t1-2:file:input.css": "@import \"tailwindcss\";\n@theme {\n  --text-xxs: 0.6875rem;\n}\n",
 "t1-2:mo4": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 42ms\n$ grep -A3 -F '.text-xxs {' out.css\n  .text-xxs {\n    font-size: var(--text-xxs);\n  }\n  .font-semibold {\n$ grep -A1 -F '.text-\\[11px\\] {' out.css\n  .text-\\[11px\\] {\n    font-size: 11px;\n$ grep -m1 -- '--text-xxs:' out.css\n    --text-xxs: 0.6875rem;",
 "anh-twc-1-2:co": {
  "url": "http://127.0.0.1:20106/mo4/trang.html",
  "vp": [
   640,
   150
  ],
  "rect": {
   "#a": [
    16,
    21,
    112,
    17
   ],
   "#b": [
    16,
    53,
    97,
    17
   ],
   "#c": [
    16,
    84,
    96,
    19
   ]
  },
  "console": [],
  "ketQua": {
   "co": "[[\"text-[11px]\",\"11px\"],[\"text-xxs\",\"11px\"],[\"text-xs\",\"12px\"]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, css, tn, br, box, two, steps, kw, c, cmp, meter, icards } from './_twc-chung.mjs';

export const deck = { key: 'twc-01-2', code: 'TWC 1.2', title: 'Where the scale runs out, measured', sub: 'Chapter 1 · Lesson 1.2' };
const O = (k) => { const v = DU_LIEU[`t1-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-1-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-01-2', ten, { vp: 640, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t1-2 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/ 14/11/2026)
const V3 = doan('v3co', 'node co.mjs');
const V4N = doan('v4co', 'grep -cE')[0].trim();
const TOP = doan('kho', 'uniq -c').map((l) => { const [, so, ten] = l.match(/^\s*(\d+) (.+)$/); return [ten, +so]; });
const DEM = Object.fromEntries(doan('kho', 'for c in').map((l) => { const [ten, so] = l.trim().split(/\s+/); return [ten, +so]; }));
const W11 = +doan('kho', "grep -rho 'text-")[0].trim(), F11 = +doan('kho', 'xargs grep -l')[0].trim();
const BIEN = +doan('kho', 'var\\(--')[0].trim(), NGU = +doan('kho', 'text-text-')[0].trim();
const LO = DEM['text-[10px]'] + DEM['text-[11px]'] + DEM['text-[13px]'] + (TOP.find(([t]) => t === 'text-[12.5px]')?.[1] ?? 0);
const CO = JSON.parse(A('co').ketQua.co);
if (V3.length !== 13 || V4N !== '13' || DEM['text-[11px]'] !== 1417 || W11 !== 1544 || F11 !== 529 || BIEN !== 9374 || NGU !== 6748 || LO !== 4299 || CO[0][1] !== '11px' || CO[1][1] !== '11px' || CO[2][1] !== '12px') throw new Error('số đo đổi');
const CFG3 = `module.exports = {
  content: ['./trang.html'],
  theme: { extend: { fontSize: { xxs: '0.6875rem' } } },
};`;
const CFG4 = `@import "tailwindcss";
@theme {
  --text-xxs: 0.6875rem;
}`;

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.2', t: 'Where the scale<br>runs out, measured', sub: 'A scale is someone else\'s guess about the values you need. Where the guess is wrong, your code records it — and you can count it',
    en: 'Lesson one point two. A scale is someone else\'s guess about the values you need. Where the guess is wrong, your code records it as arbitrary values, and you can count them.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The font-size scale: 13 sizes, a floor at 12px, no 13px — in Tailwind 3 <b>and</b> 4</li>
    <li>What this site's code reaches for instead, counted today</li>
    <li>Three responses: round, arbitrary value, or extend the scale</li>
    <li>The counting rule that decides between them</li>
    <li>Extending the scale in Tailwind 3 (<code>extend</code>) and Tailwind 4 (<code>@theme</code>), built and measured</li></ul>`,
    en: 'Five takeaways: the font-size scale, thirteen sizes with a floor at twelve pixels in both versions; what this site reaches for instead, counted today; three responses; the counting rule that decides between them; and extending the scale in Tailwind 3 and 4, built and measured.' },
  { t: 'The font-size scale, read from the code', body: two(D(tn(['$ node co.mjs        # Tailwind 3.4.19 · resolveConfig', ...V3].join('\n'), { fs: 16, title: 'Tailwind 3.4.19 (real)' })),
    D(tn(["$ grep -cE '^ *--text-[a-z0-9]+: ' theme.css", V4N, "$ grep -E '^ *--text-[a-z0-9]+: ' theme.css | head -3", ...doan('v4co', "grep -E").slice(0, 3).map((l) => l.trim())].join('\n'), { fs: 16, title: 'Tailwind 4.3.5 · node_modules/tailwindcss/theme.css (real)' }),
      box('Two facts that matter', `The <b>floor</b> is <code>text-xs</code> = 12px — nothing smaller. The first step is 12 → 14px, so <b>13px</b> cannot be expressed either. Tailwind 4 keeps the same ${V4N} sizes as theme variables.`, 'lam')), 'r64'),
    en: 'The font-size scale, read from the code. Tailwind 3 resolves thirteen sizes; Tailwind 4 keeps the same thirteen as theme variables in theme dot css. Two facts matter: the floor is text xs, twelve pixels, and the first step jumps from twelve to fourteen, so thirteen cannot be expressed either.' },
  { t: 'What this site actually reaches for — counted today', body: two(D(tn(['$ grep -ho \'className="[^"]*"\' -r src --include="*.tsx" \\', '    | sed … | tr \' \' \'\\n\' | grep \'\\[\' \\', '    | sort | uniq -c | sort -rn | head -8', ...doan('kho', 'uniq -c')].join('\n'), { fs: 16, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Changed since the lesson was written', `The written lesson measured <code>text-[11px]</code> 803, <code>text-[10px]</code> 595, <code>text-[13px]</code> 240. Today: <b>${n(DEM['text-[11px]'])}</b>, <b>${n(DEM['text-[10px]'])}</b>, <b>${n(DEM['text-[13px]'])}</b> — and two newcomers: <code>text-[12px]</code> ${n(DEM['text-[12px]'])}, <code>text-[12.5px]</code> ${n(TOP.find(([t]) => t === 'text-[12.5px]')[1])}.`, 'lam'),
      box('Read it as data', 'Badges, metadata rows, timestamps, table cells: a <b>dense</b> UI legitimately needs text below 12px. The scale was tuned for content pages. Neither side is wrong — the count measures the mismatch.', 'xanh')), 'r64'),
    en: 'What this site reaches for, counted today. Text bracket eleven px: one thousand four hundred seventeen. Ten px: six hundred thirty-two. Thirteen px: one thousand four hundred fifty-three. When the lesson was written these were half as big. Read it as data: a dense interface legitimately needs text below twelve pixels.' },
  { t: 'Four holes — and one value that is NOT a hole', body: meter([
      ['text-[10px] · below the floor', DEM['text-[10px]'], '#c0392b'], ['text-[11px] · below the floor', DEM['text-[11px]'], '#c0392b'],
      ['text-[12.5px] · between 12 and 14', TOP.find(([t]) => t === 'text-[12.5px]')[1], '#c0392b'], ['text-[13px] · between 12 and 14', DEM['text-[13px]'], '#c0392b'],
      ['text-[12px] · = text-xs, ON the scale', DEM['text-[12px]'], '#c28a00'],
    ], { don: 'uses', nhan: 420, fs: 19, rh: 54 }) + two(box('The holes', `${n(LO)} escapes come from exactly the gaps above: nothing under 12px, nothing between 12 and 14. (The written lesson counted 1,638.)`, 'do2'),
      box('Not a hole', `<code>text-[12px]</code> is <b>${n(DEM['text-[12px]'])}</b> uses of a value the scale already names: <code>text-xs</code>. The scale was fine; people did not use it. Counting finds that too.`, 'lam'), 'r64'),
    en: 'Four holes and one value that is not a hole. Ten, eleven, twelve and a half and thirteen pixels: four thousand two hundred ninety-nine escapes from exactly the gaps in the scale. But text bracket twelve px, one thousand seven hundred ten uses, is text xs: the scale already had it, people just did not use it.' },
  { t: 'Three responses, and when each is right', body: icards([
      ['cut', 'Round to the scale — <i>one-off differences</i>', `Mockup says 30px of padding: use ${c('p-8')} (32px). Nobody sees 2px and the grid stays intact. Most "the design does not fit the scale" cases are this one.`],
      ['code', 'Arbitrary value — <i>a genuine one-off</i>', `${c('top-[37px]')} to align with a third-party widget, ${c('w-[calc(100%-2rem)]')} for one layout. A handful of uses is exactly what the bracket syntax is for.`],
      ['stack', 'Extend the scale — <i>once the count passes ~10</i>', `${n(DEM['text-[11px]'])} uses of ${c('text-[11px]')} are not one-offs — they are an <b>unnamed</b> part of the design system. One config entry names them.`],
    ]),
    en: 'Three responses. Round to the scale: thirty pixels becomes p eight, and nobody sees two pixels. Use an arbitrary value for a genuine one-off, like aligning with a third-party widget. And extend the scale once the count passes about ten: over a thousand uses of text eleven px are an unnamed part of the design system.' },
  { t: 'The counting rule', body: two(D(cmp(['uses of the SAME arbitrary value', 'do this'], [
      ['1–3', 'leave it arbitrary — naming costs more than it saves'],
      ['4–10', 'judgement: one feature ⇒ leave it; across features ⇒ name it'],
      ['10+', '<b>extend the scale</b> — it is already a system value, just unnamed'],
    ]), tn([`$ grep -rho 'text-\\[11px\\]' src --include="*.tsx" | wc -l`, `    ${n(W11).replace(',', '')}`, `$ git ls-files 'src/*.tsx' | xargs grep -l 'text-\\[11px\\]' | wc -l`, `     ${F11}`].join('\n'), { fs: 16, title: 'frontend/ (real)' })),
    box('The cost of never crossing the threshold', `Design decides badges should be 12px, not 11px. With a named value: <b>one line</b> of config. With arbitrary values: ${n(W11)} replacements across <b>${F11} files</b> — and search-and-replace cannot tell "11px because it is a badge" from "11px for one alignment". The <i>why</i> is lost.`, 'do2'), 'r64'),
    en: 'The counting rule. One to three uses: leave it arbitrary. Four to ten: judgement. Ten or more: extend the scale. Counted today, text bracket eleven px appears one thousand five hundred forty-four times in five hundred twenty-nine files. Changing badges to twelve pixels would be one line with a named value, or fifteen hundred blind replacements without one.' },
  { t: 'Extending the scale: Tailwind 3 vs Tailwind 4', body: two(D(tsx(CFG3, { sm: true }), tn(['$ npx tailwindcss -i nhap.css -o out.css && cat out.css', ...doan('mo3', 'cat out.css')].join('\n'), { fs: 15, title: 'Tailwind 3.4.19 (real)' })),
    D(css(CFG4, { sm: true }), tn(["$ grep -A1 -F '.text-xxs {' out.css", ...doan('mo4', '.text-xxs').slice(0, 2), "$ grep -m1 -- '--text-xxs:' out.css", ...doan('mo4', '--text-xxs:')].join('\n'), { fs: 15, title: 'Tailwind 4.3.5 (real)' }),
      box('Read it', 'Tailwind 3: one key in <code>theme.extend.fontSize</code>. Tailwind 4: one variable inside <code>@theme</code> in your CSS — no config file. Either way <code>text-xxs</code> now exists, and the scale grew by <b>one name</b>.', 'xanh')), 'r64'),
    en: 'Extending the scale. In Tailwind 3, one key under theme extend font size, and the build writes text xxs at zero point six eight seven five rem. In Tailwind 4, one variable inside an at-theme block in your CSS file, no config file at all, and the build writes text xxs from that variable.' },
  { t: 'Chromium: the named value renders like the escape', body: B('co', { url: 'mo4/trang.html · Tailwind 4.3.5', h: 104, w: 1110 }) + two(D(
      cmp(['class', 'getComputedStyle().fontSize'], CO.map(([k, v]) => [k, `<b>${v}</b>`]))),
    D(box('Read it', `<code>text-[11px]</code> and <code>text-xxs</code> both measure <b>${CO[0][1]}</b>; <code>text-xs</code> is ${CO[2][1]}. Naming changes nothing on screen — it gives you one place to edit and one name to search for. (Tailwind 4 also accepts ${c('text-(--x)')} for a variable: still an arbitrary value.)`, 'lam')), 'r64'),
    en: 'Chromium. Text bracket eleven px and text xxs both measure eleven pixels; text xs is twelve. Naming the value changes nothing on screen. It changes what you can do later: one place to edit, one name to search for.' },
  { t: 'The same story in the colour column', body: two(D(tn(["$ … | grep -cE '^[a-z-]+-\\[var\\(--'     # [var(--…)] escapes", n(BIEN).replace(',', ''), "$ … | grep -cxE 'text-text-(primary|secondary|muted)'", n(NGU).replace(',', '')].join('\n'), { fs: 16, title: 'frontend/ (real)' }),
      meter([['[var(--…)] inside brackets', BIEN, '#c28a00'], ['text-text-* (config → variable)', NGU, '#0891b2']], { don: 'uses', nhan: 250, fs: 17, rh: 50, w: 540 })),
    D(box('A different kind of gap', `${n(BIEN)} classes put a <b>CSS variable</b> inside brackets: <code>text-[var(--w-text-3)]</code>, <code>border-[var(--w-border)]</code>… The scale is not missing a value — the value must change <b>per theme, at run time</b>.`, 'lam'),
      box('The fix already exists here', `<code>text-text-primary</code>, <code>-secondary</code>, <code>-muted</code> (${n(NGU)} uses) are config entries pointing at variables: <code>primary: "var(--text-primary)"</code>. Clean class name, theme-aware value. Chapter 6 is that technique.`, 'xanh')), 'r64'),
    en: 'The same story in the colour column. Nine thousand three hundred seventy-four classes put a CSS variable inside brackets. That is a different gap: the value must change per theme at run time. The fix already exists in this code: text text primary, secondary and muted, six thousand seven hundred forty-eight uses, are config entries pointing at variables. Chapter six is that technique.' },
  { t: 'Trap: treating arbitrary values as forbidden', body: two(box('The opposite mistake', 'A team <b>bans</b> arbitrary values and rounds everything to the scale. Now a button sits 2px off the third-party widget it must align with — <b>forever</b>, because the scale has no 37px.', 'do2'),
    steps(['Escape hatches are necessary — that is why the brackets exist', 'The rule is not "never": it is <b>count</b>, and name what <b>repeats</b>', `Run the count before arguing: ${c("grep -rho 'text-\\[11px\\]' src | wc -l")}`]), 'r64'),
    en: 'The trap in the other direction: banning arbitrary values and rounding everything. Then a button sits two pixels off the widget it must align with, forever. Escape hatches are necessary. The rule is not never; it is count, and name what repeats.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Font-size scale', '13 sizes; floor 12px; no 13px'), kw('Arbitrary value', 'text-[11px] — a value the scale lacks'), kw('Escape hatch', 'a few uses: legitimate'),
      kw('The counting rule', '1–3 leave · 4–10 judge · 10+ extend'), kw('Extend the scale', 'v3 theme.extend · v4 @theme'), kw('--text-*', 'v4 theme variables for sizes'),
      kw('CSS-variable escape', 'text-[var(--x)] — belongs in config'), kw('Unnamed system value', 'repeated arbitrary value'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the font-size scale; arbitrary value; escape hatch; the counting rule; extending the scale, with theme extend in Tailwind 3 and at-theme in Tailwind 4; the text theme variables; the CSS-variable escape; and the unnamed system value.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run the bracket count on your own project: ${c("grep '\\[' | sort | uniq -c | sort -rn | head")}`,
      'For the top value, count files as well as uses',
      `Add one named size: ${c('theme.extend.fontSize')} (v3) or ${c('--text-xxs')} in ${c('@theme')} (v4); build and grep`,
      'Find an arbitrary value that duplicates a scale value (like 12px = text-xs)',
    ]), box('Keep these', '<ul><li>A scale is a guess; escapes measure where it is wrong</li><li>Round · arbitrary · extend</li><li>Count: 10+ uses ⇒ name it</li><li>v3 extend ⇄ v4 @theme</li><li>Variables in brackets belong in config</li></ul>', 'lam'), ''),
    en: 'Your turn: count the bracket classes in your own project; for the top value count files too; add one named size in Tailwind 3 or 4 and grep the build; and look for an arbitrary value that duplicates a scale value. Keep: a scale is a guess, and the count tells you when to name a value.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The scale, the thing worth learning', bai: '1.2' }, S);
