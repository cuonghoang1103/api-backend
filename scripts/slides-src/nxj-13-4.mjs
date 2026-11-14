/*DU_LIEU*/
const DU_LIEU = {
 "n13-4:file:src/app/globals.css": "@import \"tailwindcss\";\n@custom-variant dark (&:where(.dark, .dark *));\n\n/* token theo VAI TRÒ, ba theme. Chỉ đổi giá trị, không đụng component */\n:root            { --text-primary: #111111; --surface: #ffffff; }\nhtml.theme-dark  { --text-primary: #eeeeee; --surface: #0b0b0b; }\nhtml.theme-brown { --text-primary: #f3e9d8; --surface: #2b211a; }\n\n/* component đọc BIẾN, không đọc màu cố định */\n.card { color: var(--text-primary); background: var(--surface); padding: 16px; }\n\n/* nối biến vào Tailwind 4 ⇒ có lớp bg-surface / text-fg (create-next-app làm y hệt với --background) */\n@theme inline {\n  --color-surface: var(--surface);\n  --color-fg: var(--text-primary);\n  --font-sans: var(--font-geist-sans);\n  --font-mono: var(--font-geist-mono);\n}\n\nbody { font-family: Arial, Helvetica, sans-serif; }\n",
 "n13-4:file:src/app/the/page.tsx": "// app/the/page.tsx — một thẻ CSS thường và một thẻ Tailwind, cùng đọc biến\nexport default function Trang() {\n  return (\n    <main className=\"flex gap-4 p-4 text-xl\">\n      <div id=\"css\" className=\"card\">.card (CSS)</div>\n      <div id=\"tw\" className=\"bg-surface p-4 text-fg\">bg-surface text-fg</div>\n      <div id=\"mo\" className=\"bg-fg/50 p-4\">bg-fg/50</div>\n    </main>\n  );\n}\n",
 "n13-4:bien": "$ sed -n '8,13p' src/app/globals.css      # create-next-app ĐÃ nối sẵn một biến vào Tailwind\n@theme inline {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --font-sans: var(--font-geist-sans);\n  --font-mono: var(--font-geist-mono);\n}\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/the'\n✓ Compiled successfully in 3.6s\n└ ○ /the\n$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py bg-surface text-fg bg-fg/50 | sed -E 's/\\{background-color:color-mix.*/{… color-mix(… var(--text-primary) 50% …)}/'\nbg-surface             ⇒ .bg-surface{background-color:var(--surface)}\ntext-fg                ⇒ .text-fg{color:var(--text-primary)}\nbg-fg/50               ⇒ .bg-fg\\/50{background-color:var(--text-primary)}\n$ Chromium: đổi class trên <html> — màu tính được của ba thẻ\n(gốc)        css nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | tw nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | mo nền oklab(0.177637 0.00000810623 0.00000356138 / 0.5)\ntheme-dark   css nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | tw nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | mo nền oklab(0.949113 0.0000431836 0.0000190735 / 0.5)\ntheme-brown  css nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | tw nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | mo nền oklab(0.937341 0.00390819 0.02477 / 0.5)",
 "n13-4:file:src/app/ghi-chu/page.tsx": "// app/ghi-chu/page.tsx — Notes có công tắc theme RIÊNG: .dark chỉ đặt trên vỏ của Notes\nexport default function Trang() {\n  const notesTheme = 'light' as 'light' | 'dark';   // người dùng chọn Notes SÁNG (giá trị đến từ cài đặt)\n  return (\n    <main className=\"card min-h-screen p-4 text-xl\">\n      <p>Trang chung (đọc biến --surface)</p>\n      <section id=\"notes\" className={notesTheme === 'dark' ? 'dark' : ''}>\n        <div id=\"o\" className=\"mt-3 rounded-lg border bg-white p-4 text-black dark:bg-zinc-900 dark:text-white\">Notes · chọn SÁNG</div>\n      </section>\n    </main>\n  );\n}\n",
 "n13-4:va-cham": "$ head -2 src/app/globals.css      # dark: theo CLASS (bài 13.3), như cuongthai.com\n@import \"tailwindcss\";\n@custom-variant dark (&:where(.dark, .dark *));\n$ npm run build 2>&1 | grep -E 'Compiled|/ghi-chu'\n✓ Compiled successfully in 642ms\n├ ○ /ghi-chu\n$ Chromium: theme TOÀN TRANG tối, Notes chọn sáng — đặt bằng <html class=\"dark\"> so với <html class=\"theme-dark\">\nva-cham-dark   · html.class có \"dark\" · Notes nền lab(8.30603 0.618205 -2.16572)\nva-cham-theme  · html.class chỉ \"theme-dark\" · Notes nền rgb(255, 255, 255)",
 "n13-4:file:tailwind.config.js": "// tailwind.config.js — Tailwind 3: nối biến vào bảng màu trong config\nmodule.exports = {\n  content: ['./app/**/*.{js,jsx}'],\n  theme: { extend: { colors: { surface: 'var(--surface)', fg: 'rgb(var(--fg-rgb) / <alpha-value>)' } } },\n};\n",
 "n13-4:file:app/mo/page.jsx": "export default function Trang() {\n  return <p className=\"bg-surface bg-surface/50 text-fg text-fg/50 p-6\">alpha</p>;\n}\n",
 "n13-4:v3": "$ npm run build 2>&1 | grep -E 'Compiled|/mo'\n ✓ Compiled successfully\n└ ○ /mo                                  153 B          87.4 kB\n$ for s in '.bg-surface{' '.bg-surface\\/50{' '.text-fg{' '.text-fg\\/50{'; do printf '%-18s %s\\n' \"$s\" \"$(cat .next/static/css/*.css | grep -cF \"$s\")\"; done\n.bg-surface{       1\n.bg-surface\\/50{   0\n.text-fg{          1\n.text-fg\\/50{      1\n$ cat .next/static/css/*.css | grep -oE '\\.(bg-surface|text-fg\\\\/50)\\{[^}]*\\}' | head -3\n.bg-surface{background-color:var(--surface)}\n.text-fg\\/50{color:rgb(var(--fg-rgb)/.5)}",
 "n13-4:kho": "$ grep -oE -- '--[a-zA-Z0-9-]+\\s*:' src/app/globals.css | sort -u | wc -l | sed 's/^ */biến CSS trong globals.css: /'\nbiến CSS trong globals.css: 107\n$ sed -n '87,92p' src/app/globals.css\n  html.theme-dark {\n    color-scheme: dark;\n    --bg-primary: #18191a;\n    --bg-card: #242526;\n    --bg-surface: #303031;\n    --bg-surface-hover: rgba(255, 255, 255, 0.08);\n$ grep -n 'notes-theme-root' src/components/notes/NotesThemeProvider.tsx | head -3\n183:        bên trong cây con. className `notes-theme-root` chỉ để\n192:        className={`notes-theme-root h-full ${theme === 'dark' ? 'dark' : ''}`}\n$ sed -n '/^  theme:/,/colors/p' tailwind.config.ts | head -3; grep -c \"var(--\" tailwind.config.ts | sed 's/^/dòng màu trỏ vào var(--…) trong tailwind.config.ts: /'\n  theme: {\n    extend: {\n      colors: {\ndòng màu trỏ vào var(--…) trong tailwind.config.ts: 18",
 "anh-nxj-13-4:the-sang": {
  "url": "http://127.0.0.1:19395/the",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-4:the-toi": {
  "url": "http://127.0.0.1:19395/the",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-4:the": {
  "url": "http://127.0.0.1:19395/the",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "(gốc)": "css nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | tw nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | mo nền oklab(0.177637 0.00000810623 0.00000356138 / 0.5)",
   "theme-dark": "css nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | tw nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | mo nền oklab(0.949113 0.0000431836 0.0000190735 / 0.5)",
   "theme-brown": "css nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | tw nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | mo nền oklab(0.937341 0.00390819 0.02477 / 0.5)"
  }
 },
 "anh-nxj-13-4:va-cham-dark": {
  "url": "http://127.0.0.1:19395/ghi-chu",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "ket": "html.class có \"dark\" · Notes nền lab(8.30603 0.618205 -2.16572)"
  }
 },
 "anh-nxj-13-4:va-cham-theme": {
  "url": "http://127.0.0.1:19395/ghi-chu",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "ket": "html.class chỉ \"theme-dark\" · Notes nền rgb(255, 255, 255)"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, css, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-13-4', code: 'NXJ 13.4', title: 'Theming with CSS variables (and a naming trap)', sub: 'Chapter 13 · Lesson 13.4' };
const O = (k) => { const v = DU_LIEU[`n13-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-13-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ app\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-13-4', ten, o);

// ── số đo (n13-4 · Next.js 16.4.6 + Tailwind 4.3.3 · Chromium; c13-14 = Next 14.2.35 + Tailwind 3.4.19)
const G = F('src/app/globals.css').split('\n');
const TOKEN = G.slice(G.findIndex((l) => l.startsWith('/* token')), G.findIndex((l) => l.startsWith('.card')) + 1).join('\n');
const THEME = G.slice(G.findIndex((l) => l.startsWith('@theme inline')), G.findIndex((l) => l.startsWith('@theme inline')) + 4).join('\n') + '\n  …\n}';
const CNA = doan('bien', "sed -n '8,13p'");
const RULE = doan('bien', 'doc-css.py bg-surface');
const KQ = A('the').ketQua;
const VC1 = A('va-cham-dark').ketQua.ket, VC2 = A('va-cham-theme').ketQua.ket;
const CFG3 = F('tailwind.config.js').replace("theme: { extend: { colors: { surface: 'var(--surface)', fg: 'rgb(var(--fg-rgb) / <alpha-value>)' } } },", "theme: { extend: { colors: {\n    surface: 'var(--surface)',\n    fg: 'rgb(var(--fg-rgb) / <alpha-value>)',\n  } } },");
const V3 = doan('v3', "for s in '.bg-surface{'"), V3R = doan('v3', "grep -oE '\\.(bg-surface");
const KHO = O('kho');
const hang = (v) => Object.fromEntries(v.split(' | ').map((x) => { const [id, ...r] = x.split(' '); return [id, r.join(' ')]; }));
const SANG = hang(KQ['(gốc)']), TOI = hang(KQ['theme-dark']), NAU = hang(KQ['theme-brown']);
if (SANG.css !== SANG.tw || TOI.css !== TOI.tw || NAU.css !== NAU.tw || !/rgb\(11, 11, 11\)/.test(TOI.css) || !/\/ 0\.5\)$/.test(SANG.mo)) throw new Error('biến đổi');
if (!/lab\(8\./.test(VC1) || !/rgb\(255, 255, 255\)$/.test(VC2)) throw new Error('va chạm đổi');
if (!/0$/.test(V3.find((l) => l.startsWith('.bg-surface\\/50'))) || !/1$/.test(V3.find((l) => l.startsWith('.text-fg\\/50')))) throw new Error('v3 alpha đổi');
const hex = (v) => v.replace(/rgb\((\d+), (\d+), (\d+)\)/g, (_, r, g, b) => '#' + [r, g, b].map((x) => Number(x).toString(16).padStart(2, '0')).join('')).replace(/^nền /, 'bg ').replace(' chữ ', ' · text ');
const ngan = (s) => s.replace(/oklab\([^/]*\/ 0\.5\)/, 'oklab(… / 0.5)').replace(/^nền /, '');
const GHI = bo(F('src/app/ghi-chu/page.tsx')).split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n')
  .replace(' className="mt-3 rounded-lg border bg-white p-4 text-black dark:bg-zinc-900 dark:text-white"', '\n          className="… bg-white text-black\n                     dark:bg-zinc-900 dark:text-white"').replace('dark:text-white">Notes · chọn SÁNG</div>', 'dark:text-white">\n          Notes · chọn SÁNG</div>')
  .replace('<section id="notes" className={notesTheme === \'dark\' ? \'dark\' : \'\'}>', '<section id="notes"\n        className={notesTheme === \'dark\' ? \'dark\' : \'\'}>')
  .replace("  const notesTheme = 'light' as 'light' | 'dark';   // người dùng chọn Notes SÁNG (giá trị đến từ cài đặt)", "  const notesTheme = 'light' as 'light' | 'dark'; // user picked LIGHT");

export const S = [
  { cover: true, nhan: 'Chapter 13 · Lesson 13.4', t: 'Theming with CSS variables<br>(and a naming trap)', sub: 'Role-named tokens, three themes from one class swap, wiring them into Tailwind 4 and 3 — and the global .dark class that hijacked cuongthai.com\'s Notes, reproduced',
    en: 'Lesson thirteen point four: theming with CSS variables. Role-named tokens, three themes from one class swap, wiring the tokens into Tailwind four and three, and the global dark class that once hijacked cuongthai.com\'s Notes, reproduced in Chromium.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Tokens on <code>:root</code>, redefined per theme class — components read <code>var(--…)</code></li>
    <li>Name tokens by <b>role</b> (<code>--surface</code>), not by colour (<code>--gray-100</code>)</li>
    <li>Wire them into Tailwind 4 with <code>@theme inline</code> — <code>create-next-app</code> already does</li>
    <li>Tailwind 3: <code>colors</code> in the config, and the alpha trap (<code>/50</code> not generated)</li>
    <li>The trap: a global <code>.dark</code> class turns on <em>every</em> <code>dark:</code> utility</li></ul>`,
    en: 'Five takeaways: tokens on root, redefined per theme class; naming tokens by role, not by colour; wiring them into Tailwind four with theme inline, which create-next-app already does; Tailwind three\'s config and its alpha trap; and the trap where a global dark class turns on every dark utility.' },
  { t: 'Tokens + one class swap = three themes', body: css(TOKEN, { sm: true, hl: [2, 3, 4, 7] }) + two(D(B('the-sang', { url: '<html>', vp: 640, h: 80, w: 470 }), B('the-toi', { url: '<html class="theme-dark">', vp: 640, h: 80, w: 470 })),
    cmp(['&lt;html&gt; class', '.card (CSS)', 'bg-surface text-fg'], [
        ['(none)', hex(SANG.css), hex(SANG.tw)],
        ['<code>theme-dark</code>', hex(TOI.css), hex(TOI.tw)],
        ['<code>theme-brown</code>', hex(NAU.css), hex(NAU.tw)],
      ]), ''),
    en: 'Tokens plus one class swap give three themes. Root defines text-primary and surface; html dot theme-dark and theme-brown redefine the values. Measured: swapping one class on html recoloured both the plain CSS card and the Tailwind card, without touching any component.' },
  { t: 'Name tokens by role, not by colour', body: cmp(['', 'Literal name', 'Role name'], [
      ['Example', '<code>--gray-100</code>, <code>--blue-600</code>', '<code>--surface</code>, <code>--text-primary</code>, <code>--border</code>'],
      ['In the dark theme', '<code>--gray-100: #1a1a1a</code> — the name now lies', '<code>--surface: #0b0b0b</code> — still true'],
      ['When you redesign', 'every use must be checked by hand', 'change the value, every use follows'],
      ['Tells you where it belongs', 'no — so it spreads anywhere', 'yes — it is the card surface'],
    ]) + two(box('Rule', 'Tokens describe a <b>job</b> (<code>--danger</code>), never a <b>colour</b> (<code>--red</code>). The palette lives in one theme block; components only know roles.', 'xanh'),
      box('cuongthai.com', `${KHO.split('\n')[1].split(': ').pop()} CSS variables in <code>globals.css</code> — <code>--bg-primary</code>, <code>--bg-card</code>, <code>--text-primary</code>… all role names.`, 'lam'), ''),
    en: 'Name tokens by role, not by colour. A literal name like gray one hundred becomes a lie in the dark theme, where its value is nearly black. A role name like surface stays true in every theme, and tells you where it belongs. cuongthai.com\'s global stylesheet defines one hundred seven variables, all role names.' },
  { t: 'Wire tokens into Tailwind 4: @theme inline', body: two(D(css(THEME, { sm: true, hl: [2, 3] }), tn(['$ sed -n 8,13p src/app/globals.css   # fresh create-next-app', ...CNA].join('\n'), { fs: 13, title: 'create-next-app 16.4.6 (real)' })),
    D(tn(['$ python3 doc-css.py bg-surface text-fg bg-fg/50', ...RULE.map((l) => l.replace(/\{background-color:color-mix.*/, '{…}'))].join('\n'), { fs: 13, wrap: 58, title: 'built CSS (real)' }),
      box('Read it', '<code>--color-surface</code> in <code>@theme</code> creates <code>bg-surface</code>, <code>text-surface</code>, <code>border-surface</code>… <code>inline</code> makes the class read <code>var(--surface)</code> directly, so it follows the theme. Opacity works too: <code>bg-fg/50</code> measured <code>' + ngan(SANG.mo) + '</code>.', 'xanh')), ''),
    en: 'Wiring tokens into Tailwind four: a color variable inside at-theme inline creates utilities like bg-surface and text-fg that read var surface directly, so they follow the theme. A fresh create-next-app already does exactly this for background and foreground. Opacity modifiers work: bg-fg slash fifty measured half alpha.' },
  { t: 'Tailwind 3: colors in the config — and the alpha trap', body: two(D(tsx(CFG3, { sm: true, hl: [5, 6] }), tn(['$ npm run build && grep <built CSS>   # Next 14.2.35 + Tailwind 3.4.19', ...V3, ...V3R].join('\n'), { fs: 13, wrap: 58, title: 'built CSS (real)' })),
    D(box('Read it', 'A plain <code>var(--surface)</code> colour works for <code>bg-surface</code>, but <code>bg-surface/50</code> was <b>never generated</b> — Tailwind 3 cannot add alpha to an opaque variable. The <code>rgb(var(--fg-rgb) / &lt;alpha-value&gt;)</code> form works.', 'do2'),
      box('cuongthai.com', `Runs Tailwind 3 with ${KHO.split('\n').pop().split(': ').pop()} colour lines pointing at <code>var(--…)</code> in <code>tailwind.config.ts</code> — the alpha trap is real there.`, 'lam')), ''),
    en: 'Tailwind three wires variables in the config under colors. A plain var colour works for bg-surface, but bg-surface slash fifty was never generated: Tailwind three cannot add alpha to an opaque variable. The rgb with alpha-value form works. cuongthai.com runs Tailwind three with eighteen colour lines pointing at variables.' },
  { t: 'The trap, reproduced: a global .dark hijacks Notes', body: two(D(tsx(GHI, { sm: true, hl: [7, 9, 10] })),
    D(B('va-cham-dark', { url: '<html class="dark theme-dark">', vp: 520, h: 110, w: 420 }), B('va-cham-theme', { url: '<html class="theme-dark">', vp: 520, h: 110, w: 420 }),
      cmp(['global dark theme set as', 'Notes (user chose LIGHT)'], [['<code>html.dark</code>', `<b style="color:#c0392b">${VC1.split('nền ').pop().replace(/^lab\(8\..*/, 'dark (zinc-900)')}</b>`], ['<code>html.theme-dark</code>', VC2.split('nền ').pop().replace('rgb(255, 255, 255)', 'white ✓')]])), 'r64'),
    en: 'The trap, reproduced. Notes has its own light and dark switch: a dark class on Notes\' own wrapper. The user picked light. When the global dark theme was put on html as class dark, Notes turned dark anyway. With the global class named theme-dark, Notes stayed white, as the user chose.' },
  { t: 'Why: dark: matches every descendant of .dark', body: two(D(tn([':where(.dark, .dark *)   ← the class variant (13.3)', '', '<html class="dark">        ← global theme', '  <main>                   ← .dark *', '    <section id="notes">   ← .dark *  (Notes: light!)', '      <div class="dark:bg-zinc-900">  ← .dark *  ⇒ DARK'].join('\n'), { fs: 16, title: 'selector vs tree' })),
    D(box('The cause', '<code>dark:</code> is "inside any <code>.dark</code>". A <code>.dark</code> on <code>&lt;html&gt;</code> is an ancestor of <b>everything</b>, so every <code>dark:</code> utility on the page turns on — including the ones Notes reserved for its own theme.', 'do2'),
      box('The fix', 'Two systems, two names: the global theme switches CSS variables with <code>theme-dark</code>; <code>dark:</code> stays reserved for the one scoped area that uses it.', 'xanh')), ''),
    en: 'Why. The dark variant means inside any element with class dark. A dark class on html is an ancestor of everything, so every dark utility on the page turns on, including those Notes reserved for its own theme. The fix is two systems with two names: theme-dark for the global variables, and dark kept for the scoped area.' },
  { t: 'cuongthai.com today', body: two(D(tn(KHO, { fs: 13, wrap: 64, title: 'frontend/ (real)' })),
    D(box('Global theme', '<code>html.theme-dark</code> redefines role variables (<code>--bg-primary</code>, <code>--bg-card</code>…). Pages read the variables.', 'lam'),
      box('Notes', '<code>NotesThemeProvider</code> puts <code>.dark</code> on <code>.notes-theme-root</code> only — the one place <code>dark:</code> utilities are allowed to key off.', 'xanh'),
      box('Rule in the repo', 'The global dark class is <code>theme-dark</code>, never <code>dark</code>. Global theme styles use variables or <code>html.theme-dark …</code>, not <code>dark:</code>.', 'do2')), 'r64'),
    en: 'cuongthai.com today: html dot theme-dark redefines the role variables that pages read; NotesThemeProvider puts dark only on the notes-theme-root wrapper, the one place dark utilities may key off. And the repository\'s rule: the global dark class is theme-dark, never dark.' },
  { t: 'Recipe: theming with CSS variables', body: icards([
      ['layers', '1 · Tokens on :root', 'Role names: <code>--surface</code>, <code>--text-primary</code>, <code>--border</code>, <code>--danger</code>.'],
      ['loop', '2 · One block per theme', '<code>html.theme-dark { … }</code> redefines values. Components never know themes exist.'],
      ['plug', '3 · Wire into Tailwind', 'v4: <code>@theme inline { --color-surface: var(--surface) }</code> · v3: <code>colors</code> (+ <code>&lt;alpha-value&gt;</code>).'],
      ['shield', '4 · Keep names apart', 'A global theme class must not be <code>dark</code> if any area uses <code>dark:</code> on its own.'],
    ], 2),
    en: 'The recipe: role-named tokens on root; one block per theme that redefines the values; wire them into Tailwind with theme inline, or colors with alpha-value in version three; and keep the global theme class apart from dark.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('CSS variable', '--x, read with var(--x)'), kw('Semantic token', 'named by role, not colour'), kw('Theme class', 'html.theme-dark redefines tokens'),
      kw('@theme inline', 'v4: token ⇒ utility class'), kw('<alpha-value>', 'v3: opacity on a variable'), kw('Naming collision', 'global .dark ⇒ every dark: on'),
      kw('theme-dark', 'a name that cannot collide'), kw('Scoped .dark', 'one area, its own switch'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: CSS variable; semantic token; theme class; theme inline; alpha-value in Tailwind three; the naming collision; theme-dark; and a scoped dark class.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Define ${c('--surface')} and ${c('--text-primary')} on ${c(':root')}; redefine them under ${c('html.theme-dark')}`,
      `Add them to ${c('@theme inline')}; use ${c('bg-surface text-fg')} and ${c('bg-fg/50')}; swap the class in DevTools`,
      `Give one area its own ${c('.dark')} wrapper with ${c('dark:')} utilities; put ${c('dark')} on ${c('<html>')} — watch it break`,
      `Rename the global class to ${c('theme-dark')}; check again`,
    ]), box('Keep these', `<ul><li>Components read roles, themes set values</li><li>Name by role, never by colour</li><li>v4: @theme inline · v3: config + &lt;alpha-value&gt;</li><li>Global theme class ≠ dark</li><li>Test every theme on every screen</li></ul>`, 'lam'), ''),
    en: 'Your turn: define role tokens and a theme-dark block; wire them into theme inline and swap the class in DevTools; give one area its own dark wrapper, put dark on html and watch it break; then rename the global class to theme-dark. Keep: components read roles, themes set values, and the global theme class is never dark.' },
];
export const slides = lamDeck({ chuong: 'Chapter 13 — Styling, Tailwind & theming', bai: '13.4' }, S);
