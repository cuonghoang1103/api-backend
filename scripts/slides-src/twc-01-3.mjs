/*DU_LIEU*/
const DU_LIEU = {
 "t1-3:file:mau.mjs": "import resolveConfig from 'tailwindcss/resolveConfig.js';\nconst { theme } = resolveConfig({ content: [] });\nconst families = Object.entries(theme.colors).filter(([, v]) => typeof v === 'object');\nconsole.log('families:', families.length);\nconsole.log('steps   :', Object.keys(theme.colors.slate).join(' '));\nconsole.log('flat    :', Object.entries(theme.colors).filter(([, v]) => typeof v !== 'object').map(([k]) => k).join(' '));\n",
 "t1-3:v3mau": "$ node mau.mjs\nfamilies: 22\nsteps   : 50 100 200 300 400 500 600 700 800 900 950\nflat    : inherit current transparent black white\n$ node -p \"require('tailwindcss/colors').slate[500]\"\n#64748b",
 "t1-3:v4mau": "$ grep -oE -- '--color-[a-z]+-500' node_modules/tailwindcss/theme.css | wc -l\n      26\n$ grep -oE -- '--color-[a-z]+-500' node_modules/tailwindcss/theme.css | sed 's/--color-//; s/-500//' | tr '\\n' ' '; echo\nred orange amber yellow lime green emerald teal cyan sky blue indigo violet purple fuchsia pink rose slate gray zinc neutral stone mauve olive mist taupe \n$ grep -E -- '--color-slate-(400|500|600):' node_modules/tailwindcss/theme.css\n  --color-slate-400: oklch(70.4% 0.04 256.788);\n  --color-slate-500: oklch(55.4% 0.046 257.417);\n  --color-slate-600: oklch(44.6% 0.043 257.281);",
 "t1-3:kho": "$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | tr ' \"' '\\n\\n' | grep -E '^text-' | grep -vE '^text-(xs|sm|base|lg|xl|[2-9]xl|left|right|center|justify|\\[[0-9.]+px\\])$' | sort | uniq -c | sort -rn | head -6\n2962 text-text-muted\n2290 text-text-primary\n1884 text-[var(--w-text-3)]\n1496 text-text-secondary\n1208 text-[var(--w-text-2)]\n 737 text-white\n$ for c in text-slate-400 text-gray-400 text-slate-500 text-gray-500; do printf '%-16s %s\\n' $c \"$(grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | tr ' \"' '\\n\\n' | grep -cx $c)\"; done\ntext-slate-400   224\ntext-gray-400    33\ntext-slate-500   293\ntext-gray-500    18",
 "t1-3:file:input.css": "@import \"tailwindcss\";\n",
 "t1-3:file:v4.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 font-sans\">\n  <p class=\"text-lg text-slate-400\">text-slate-400 · chữ phụ mờ mờ</p>\n  <p class=\"text-lg text-slate-500\">text-slate-500 · chữ phụ mờ mờ</p>\n  <p class=\"text-lg text-slate-600\">text-slate-600 · chữ phụ mờ mờ</p>\n  <p class=\"text-lg text-slate-700\">text-slate-700 · chữ phụ mờ mờ</p>\n  <p class=\"text-lg font-bold text-yellow-500\">text-yellow-500 · cùng bậc 500</p>\n  <p class=\"text-lg font-bold text-blue-500\">text-blue-500 · cùng bậc 500</p>\n  <div id=\"o4\" class=\"hidden\"><i class=\"bg-slate-50\"></i><i class=\"bg-slate-100\"></i><i class=\"bg-slate-200\"></i><i class=\"bg-slate-300\"></i><i class=\"bg-slate-400\"></i><i class=\"bg-slate-500\"></i><i class=\"bg-slate-600\"></i><i class=\"bg-slate-700\"></i><i class=\"bg-slate-800\"></i><i class=\"bg-slate-900\"></i><i class=\"bg-slate-950\"></i><i class=\"bg-yellow-500\"></i><i class=\"bg-blue-500\"></i></div>\n</body></html>\n",
 "t1-3:trang": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 55ms\n$ grep -A2 -F '.text-slate-500 {' ../mau3/out.css | head -3\n.text-slate-500 {\n  --tw-text-opacity: 1;\n  color: rgb(100 116 139 / var(--tw-text-opacity, 1));\n$ grep -A1 -F '.text-slate-500 {' out.css\n  .text-slate-500 {\n    color: var(--color-slate-500);",
 "anh-twc-1-3:v4": {
  "url": "http://127.0.0.1:20107/mau/v4.html",
  "vp": [
   640,
   300
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "bac": "[[\"slate-50\",\"oklch(0.984 0.003 247.858)\",\"#f8fafc\",0.9536,1.05],[\"slate-100\",\"oklch(0.968 0.007 247.896)\",\"#f1f5f9\",0.9085,1.1],[\"slate-200\",\"oklch(0.929 0.013 255.508)\",\"#e2e8f0\",0.8017,1.23],[\"slate-300\",\"oklch(0.869 0.022 252.894)\",\"#cad5e2\",0.6564,1.49],[\"slate-400\",\"oklch(0.704 0.04 256.788)\",\"#90a1b9\",0.3492,2.63],[\"slate-500\",\"oklch(0.554 0.046 257.417)\",\"#62748e\",0.1704,4.76],[\"slate-600\",\"oklch(0.446 0.043 257.281)\",\"#45556c\",0.0884,7.58],[\"slate-700\",\"oklch(0.372 0.044 257.287)\",\"#314158\",0.0514,10.36],[\"slate-800\",\"oklch(0.279 0.041 260.031)\",\"#1d293d\",0.0218,14.62],[\"slate-900\",\"oklch(0.208 0.042 265.755)\",\"#0f172b\",0.0089,17.83],[\"slate-950\",\"oklch(0.129 0.042 264.695)\",\"#020618\",0.0021,20.16],[\"yellow-500\",\"oklch(0.795 0.184 86.047)\",\"#f0b100\",0.4997,1.91],[\"blue-500\",\"oklch(0.623 0.214 259.815)\",\"#2b7fff\",0.2291,3.76]]"
  }
 },
 "anh-twc-1-3:v3": {
  "url": "http://127.0.0.1:20107/mau3/v3.html",
  "vp": [
   640,
   300
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "bac": "[[\"slate-50\",\"rgb(248, 250, 252)\",\"#f8fafc\",0.9536,1.05],[\"slate-100\",\"rgb(241, 245, 249)\",\"#f1f5f9\",0.9085,1.1],[\"slate-200\",\"rgb(226, 232, 240)\",\"#e2e8f0\",0.8017,1.23],[\"slate-300\",\"rgb(203, 213, 225)\",\"#cbd5e1\",0.6572,1.48],[\"slate-400\",\"rgb(148, 163, 184)\",\"#94a3b8\",0.3595,2.56],[\"slate-500\",\"rgb(100, 116, 139)\",\"#64748b\",0.1706,4.76],[\"slate-600\",\"rgb(71, 85, 105)\",\"#475569\",0.0886,7.58],[\"slate-700\",\"rgb(51, 65, 85)\",\"#334155\",0.0514,10.35],[\"slate-800\",\"rgb(30, 41, 59)\",\"#1e293b\",0.0218,14.63],[\"slate-900\",\"rgb(15, 23, 42)\",\"#0f172a\",0.0088,17.85],[\"slate-950\",\"rgb(2, 6, 23)\",\"#020617\",0.0021,20.17],[\"yellow-500\",\"rgb(234, 179, 8)\",\"#eab308\",0.4975,1.92],[\"blue-500\",\"rgb(59, 130, 246)\",\"#3b82f6\",0.2355,3.68]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, meter, icards, sw } from './_twc-chung.mjs';

export const deck = { key: 'twc-01-3', code: 'TWC 1.3', title: 'The colour scale, and the step where contrast passes', sub: 'Chapter 1 · Lesson 1.3' };
const O = (k) => { const v = DU_LIEU[`t1-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-1-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-01-3', ten, { vp: 640, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t1-3 · Tailwind 3.4.19 + 4.3.5 · Chromium: màu → canvas sRGB → độ chói WCAG → tỉ lệ trên nền trắng · frontend/ 14/11/2026)
const B3 = JSON.parse(A('v3').ketQua.bac), B4 = JSON.parse(A('v4').ketQua.bac);
const g = (ds, k) => ds.find((r) => r[0] === k);
const HO4 = doan('v4mau', "sed 's/--color-//")[0].trim().split(' ');
const TOP = doan('kho', 'head -6').map((l) => { const [, so, ten] = l.match(/^\s*(\d+) (.+)$/); return [ten, +so]; });
const RUI = Object.fromEntries(doan('kho', 'for c in').map((l) => { const [ten, so] = l.trim().split(/\s+/); return [ten, +so]; }));
if (doan('v3mau', 'node mau.mjs')[0] !== 'families: 22' || HO4.length !== 26 || g(B3, 'slate-400')[4] !== 2.56 || g(B3, 'slate-500')[4] !== 4.76 || g(B4, 'slate-500')[4] !== 4.76 || g(B4, 'slate-400')[4] !== 2.63
  || g(B3, 'blue-500')[4] !== 3.68 || g(B4, 'blue-500')[4] !== 3.76 || g(B4, 'yellow-500')[4] !== 1.91 || TOP[0][0] !== 'text-text-muted' || RUI['text-slate-400'] !== 224) throw new Error('số đo đổi');
const SLATE = B4.filter((r) => r[0].startsWith('slate'));
const LUM = `function lum(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => v <= 0.03928 ? v / 12.92
                             : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);`;
const qua = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? '<b>AA</b>' : r >= 3 ? 'large only' : '<b style="color:#c0392b">FAIL</b>');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.3', t: 'The colour scale,<br>and the step where contrast passes', sub: 'Which grey is safe for body text is not a matter of taste — it is a ratio you can compute. Measured in Chromium on Tailwind 3.4.19 (hex) and Tailwind 4.3.5 (oklch)',
    en: 'Lesson one point three. Which grey is safe for body text is not taste: it is a ratio you can compute. We measure it in Chromium on Tailwind 3, which uses hex colours, and Tailwind 4, which uses oklch.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The shape of the scale: families × 11 steps, higher = darker</li>
    <li>Relative luminance and the contrast ratio — computed, not eyeballed</li>
    <li>The 500 boundary on white, measured in both versions</li>
    <li>Why the boundary moves with hue (and a correction to the written lesson)</li>
    <li>Why this site prefers <code>text-text-muted</code> over <code>text-slate-600</code></li></ul>`,
    en: 'Five takeaways: the shape of the scale; luminance and the contrast ratio, computed; the five hundred boundary on white, measured in both versions; why the boundary moves with hue, including a correction to the written lesson; and why this site prefers semantic names.' },
  { t: 'The shape of the scale, read from the code', body: two(D(tn(['$ node mau.mjs          # Tailwind 3.4.19', ...doan('v3mau', 'node mau.mjs')].join('\n'), { fs: 16, wrap: 60, title: 'Tailwind 3.4.19 (real)' }),
      tn(["$ grep -oE -- '--color-[a-z]+-500' theme.css | wc -l", doan('v4mau', 'wc -l')[0], '$ … | sed … | tr "\\n" " "', HO4.join(' ')].join('\n'), { fs: 15, wrap: 60, title: 'Tailwind 4.3.5 (real)' })),
    D(box('Read it', `Tailwind 3: <b>22</b> families × <b>11</b> steps (50, 100–900, 950) + 5 keywords. Tailwind 4: <b>${HO4.length}</b> families — four new neutrals: <code>mauve</code>, <code>olive</code>, <code>mist</code>, <code>taupe</code>.`, 'lam'),
      box('Higher = darker', 'The number follows <b>ink</b>: 50 is near-white, 950 is near-black. <code>bg-slate-100 text-slate-900</code> reads instantly as "very light background, very dark text".', 'xanh')), 'r64'),
    en: 'The shape of the scale. Tailwind 3 has twenty-two families of eleven steps, plus five keywords. Tailwind 4 has twenty-six: four new neutrals, mauve, olive, mist and taupe. The number follows ink: fifty is near-white, nine fifty is near-black.' },
  { t: 'Slate 50 → 950: the real colours in Chromium', body: sw(SLATE.map(([k, , hex, , r]) => [k, hex, `${hex} · ${r}:1`]), { co: 18 }) +
      box('Read it', 'The same eleven steps, rendered by Chromium and read back as sRGB pixels. The label under each swatch is its contrast ratio against white — the number this lesson is about.', 'xanh'),
    en: 'Slate, from fifty to nine fifty: the real colours, rendered by Chromium and read back as pixels. Under each swatch is its contrast ratio against white, the number this whole lesson is about.' },
  { t: 'Relative luminance: computed, not guessed', body: two(D(tsx(LUM, { sm: true }),
      box('Read it', 'WCAG defines luminance (green weighs 0.7152, blue only 0.0722). It drops <b>fast and non-linearly</b>: 300 → 400 nearly halves, 400 → 500 halves again — because perceived lightness is roughly logarithmic.', 'lam')),
    D(meter(SLATE.map(([k, , , l]) => [k, l, '#64748b']), { don: 'L', nhan: 130, fs: 16, rh: 38, w: 440 })), 'r64'),
    en: 'Relative luminance is computed, not guessed. WCAG defines it, and green weighs far more than blue. Down the slate scale it drops fast and non-linearly: three hundred to four hundred nearly halves, four hundred to five hundred halves again, because we perceive lightness roughly logarithmically.' },
  { t: 'The measurement that decides your default', body: two(D(B('v4', { url: 'mau/v4.html · Tailwind 4.3.5', h: 125, w: 560 }),
      box('The rule', 'WCAG 2.1 AA: body text needs <b>4.5:1</b>. Ratio = (L<sub>light</sub> + 0.05) / (L<sub>dark</sub> + 0.05).', 'xanh')),
    cmp(['text on white', 'Tailwind 3 (hex)', 'Tailwind 4 (oklch)', 'AA body text'], ['slate-400', 'slate-500', 'slate-600', 'slate-700'].map((k) => [k, `${g(B3, k)[2]} · <b>${g(B3, k)[4]}</b>`, `${g(B4, k)[2]} · <b>${g(B4, k)[4]}</b>`, qua(g(B4, k)[4])])) +
    box('Read it', `slate-400 is not "close": ${g(B3, 'slate-400')[4]} is about <b>half</b> the requirement. slate-500 is the <b>first</b> step that passes, by 0.26. Tailwind 4 changed every value to oklch — and the boundary did not move.`, 'lam'), 'r64'),
    en: 'The measurement that decides your default. AA requires four point five to one for body text. Slate four hundred on white: two point five six in Tailwind 3, two point six three in Tailwind 4 — about half the requirement. Slate five hundred is the first step that passes, four point seven six in both. The values changed to oklch; the boundary did not move.' },
  { t: 'The rule that falls out', body: icards([
      ['type', 'Body text on white', '-500 is the <b>floor</b> and passes narrowly; -600 or darker is the <b>safe default</b>. -400 and lighter: decoration only.'],
      ['eye', 'Large text (24px, or 18.66px bold)', 'AA drops to <b>3:1</b>, so -400… still fails (2.6). Light grey headings need -500.'],
      ['layers', 'Text on a DARK background', 'The arithmetic mirrors: -400 and lighter pass on -900; the <b>middle</b> steps (-500, -600) are the dangerous ones.'],
      ['box', 'Borders and dividers', 'Not text: WCAG 1.4.11 asks 3:1 for <b>meaningful</b> boundaries only. Pure decoration has no requirement.'],
    ], 2),
    en: 'The rule that falls out. Body text on white: five hundred is the floor, six hundred or darker is the safe default. Large text needs three to one, and four hundred still fails at two point six. On dark backgrounds the arithmetic mirrors: the middle steps are the dangerous ones. Decorative borders have no requirement.' },
  { t: 'Same step, different hue — and a correction', body: two(D(cmp(['bold text on white', 'Tailwind 3', 'Tailwind 4', 'AA body (4.5)', 'large (3)'], ['yellow-500', 'blue-500'].map((k) => [k, `${g(B3, k)[2]} · <b>${g(B3, k)[4]}</b>`, `${g(B4, k)[2]} · <b>${g(B4, k)[4]}</b>`, '<b style="color:#c0392b">FAIL</b>', g(B4, k)[4] >= 3 ? 'pass' : '<b style="color:#c0392b">FAIL</b>'])),
      B('v4', { url: 'mau/v4.html', h: 190, w: 560 })),
    D(box('Hue changes everything', `Green dominates the luminance formula, so <code>yellow-500</code> is far lighter than <code>blue-500</code>: <b>${g(B4, 'yellow-500')[4]}</b> vs <b>${g(B4, 'blue-500')[4]}</b>. Same step number, very different contrast.`, 'lam'),
      box('Correction to the written lesson', `The lesson said <code>text-blue-500</code> on white "is fine". Measured: <b>${g(B3, 'blue-500')[4]}</b> (v3) / <b>${g(B4, 'blue-500')[4]}</b> (v4) — it <b>fails</b> AA for body text and passes only for large text. Compute per hue.`, 'do2')), 'r64'),
    en: 'Same step, different hue. Green dominates the formula, so yellow five hundred is one point nine one, blue five hundred three point seven six. And a correction: the written lesson said blue five hundred on white is fine. Measured, it fails AA for body text; it passes only for large text. Compute per hue.' },
  { t: 'What this site does instead — counted today', body: two(D(tn(["$ … | grep -E '^text-' | … | sort | uniq -c | sort -rn | head -6", ...doan('kho', 'head -6'), '$ for c in text-slate-400 text-gray-400 …', ...doan('kho', 'for c in')].join('\n'), { fs: 15, wrap: 64, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Read it', `The most-used text colours are not scale steps at all: <code>text-text-muted</code> <b>${n(TOP[0][1])}</b>, <code>text-text-primary</code> ${n(TOP[1][1])}, <code>text-text-secondary</code> ${n(TOP.find(([t]) => t === 'text-text-secondary')[1])}. They point at CSS variables that change per theme.`, 'xanh'),
      box('Worth a look', `<code>text-slate-400</code> still appears <b>${RUI['text-slate-400']}</b> times. On a dark background that is fine; on white it is 2.6:1. The class alone cannot tell you which — Chapter 9 audits it.`, 'do2')), 'r64'),
    en: 'What this site does instead, counted today. The most-used text colours are not scale steps: text muted almost three thousand, text primary over two thousand, text secondary fifteen hundred. They point at CSS variables. Slate four hundred still appears two hundred twenty-four times: fine on dark, two point six on white. Chapter nine audits it.' },
  { t: 'Numeric step vs semantic name', body: cmp(['', 'Numeric: text-slate-600', 'Semantic: text-text-muted'], [
      ['Says', 'what the colour <b>is</b>', 'what the colour is <b>for</b>'],
      ['Contrast decided', 'again at every call site', '<b>once</b>, in config, by someone who computed it'],
      ['Dark theme', 'needs a second class (or breaks)', 'the variable changes; the class does not'],
      ['Good for', 'one-off decisions, building the scale', 'the system default'],
      ['In this repo', `${n(RUI['text-slate-400'] + RUI['text-slate-500'])} uses of slate-400/500`, `${n(TOP[0][1] + TOP[1][1] + TOP.find(([t]) => t === 'text-text-secondary')[1])} uses of text-text-*`],
    ]) + box('Why it exists here', 'The config comment says it: a hard-coded light-theme hex made <code>text-text-primary</code> near-black on a dark background — invisible text. The fix resolves per theme, not per class (Chapter 6).', 'lam'),
    en: 'Numeric step versus semantic name. A numeric step says what the colour is, and re-decides contrast at every call site. A semantic name says what it is for: contrast is decided once, in config, by someone who computed it, and the dark theme changes the variable, not the class.' },
  { t: 'Tailwind 3 vs 4: what the class compiles to', body: two(D(tn(["$ grep -A2 -F '.text-slate-500 {' out.css   # Tailwind 3.4.19", ...doan('trang', '../mau3/out.css'), "$ grep -A1 -F '.text-slate-500 {' out.css   # Tailwind 4.3.5", ...doan('trang', "grep -A1 -F '.text-slate-500 {' out.css"), "$ grep -E -- '--color-slate-500:' theme.css", doan('v4mau', 'slate-(400')[1]].join('\n'), { fs: 15, wrap: 70, title: 'built CSS (real)' })),
    D(box('Read it', 'Tailwind 3 writes an <code>rgb()</code> with an opacity variable. Tailwind 4 writes <code>var(--color-slate-500)</code>, defined once as <b>oklch</b> — a colour space where equal steps look equally different.', 'xanh'),
      box('Same class, almost the same pixels', `slate-500 renders ${g(B3, 'slate-500')[2]} in v3 and ${g(B4, 'slate-500')[2]} in v4. Contrast: ${g(B3, 'slate-500')[4]} both. Upgrading did not break your greys — but always re-measure; slate-400 moved from ${g(B3, 'slate-400')[4]} to ${g(B4, 'slate-400')[4]}.`, 'lam')), 'r64'),
    en: 'What the class compiles to. Tailwind 3 writes an rgb value with an opacity variable. Tailwind 4 writes a variable defined once in oklch, a colour space where equal steps look equally different. Slate five hundred renders almost the same pixels, four point seven six both times; slate four hundred moved slightly, to two point six three.' },
  { t: 'Trap: assuming a step number is safe across hues', body: two(box('The mistake', '"500 passes on white" was measured on <b>slate</b>. <code>yellow-500</code> is 1.9:1 and <code>blue-500</code> 3.7:1 — both fail body text. A step number is not a contrast guarantee.', 'do2'),
    steps(['Compute the ratio for the <b>exact</b> pair (DevTools shows it in the colour picker)', 'Check the size: body 4.5:1, large 3:1, UI boundaries 3:1', 'Prefer a semantic class whose value someone already computed']), 'r64'),
    en: 'The trap: assuming a step number is safe across hues. Five hundred passes was measured on slate. Yellow and blue five hundred both fail body text. Compute the ratio for the exact pair, check the size rule, and prefer a semantic class whose value someone already computed.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Colour scale', 'families × 11 steps; higher = darker'), kw('Relative luminance', 'WCAG formula, green-heavy'), kw('Contrast ratio', '(L₁ + 0.05) / (L₂ + 0.05)'),
      kw('AA', '4.5:1 body · 3:1 large & UI'), kw('The 500 boundary', 'first slate step passing on white'), kw('Hue dependence', 'yellow-500 ≠ blue-500'),
      kw('oklch', 'Tailwind 4 colour space'), kw('Semantic name', 'text-text-muted: decided once'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: colour scale; relative luminance; contrast ratio; AA, four point five for body text and three for large text and UI; the five hundred boundary; hue dependence; oklch; and the semantic name.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Open DevTools on a grey paragraph: read the contrast ratio in the colour picker',
      `Compute ${c('lum()')} for slate-400…700 on white — do you get 2.6 / 4.76 / 7.58 / 10.35?`,
      `Try ${c('text-yellow-500')} and ${c('text-blue-500')} on white: pass or fail?`,
      `Grep your project for ${c('text-slate-400')} and check what background each one sits on`,
    ]), box('Keep these', '<ul><li>Higher step = darker</li><li>Contrast is a ratio: compute it</li><li>On white: 500 floor, 600 safe</li><li>The boundary moves with hue</li><li>Semantic names decide once</li></ul>', 'lam'), ''),
    en: 'Your turn: read a contrast ratio in DevTools; compute luminance for slate four hundred to seven hundred; test yellow and blue five hundred on white; and grep your project for slate four hundred. Keep: contrast is a ratio, five hundred is the floor on white, and the boundary moves with hue.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The scale, the thing worth learning', bai: '1.3' }, S);
