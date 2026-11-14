/*DU_LIEU*/
const DU_LIEU = {
 "t1-5:file:rong.mjs": "import resolveConfig from 'tailwindcss/resolveConfig.js';\nconst { theme } = resolveConfig({ content: [] });\nconst wk = Object.keys(theme.width);\nconsole.log('width keys:', wk.length, '| spacing keys:', Object.keys(theme.spacing).length);\nconsole.log(wk.filter(k => !(k in theme.spacing)).join(' '));\nconsole.log('screens:', JSON.stringify(theme.screens));\nconsole.log('radius :', Object.entries(theme.borderRadius).map(([k, v]) => k + '=' + v).join('  '));\n",
 "t1-5:v3w": "$ node rong.mjs\nwidth keys: 70 | spacing keys: 35\nauto 1/2 1/3 2/3 1/4 2/4 3/4 1/5 2/5 3/5 4/5 1/6 2/6 3/6 4/6 5/6 1/12 2/12 3/12 4/12 5/12 6/12 7/12 8/12 9/12 10/12 11/12 full screen svw lvw dvw min max fit\nscreens: {\"sm\":\"640px\",\"md\":\"768px\",\"lg\":\"1024px\",\"xl\":\"1280px\",\"2xl\":\"1536px\"}\nradius : none=0px  sm=0.125rem  DEFAULT=0.25rem  md=0.375rem  lg=0.5rem  xl=0.75rem  2xl=1rem  3xl=1.5rem  full=9999px",
 "t1-5:v4w": "$ grep -E -- '--(breakpoint|container)-(sm|md|lg|xs):' node_modules/tailwindcss/theme.css\n  --breakpoint-sm: 40rem;\n  --breakpoint-md: 48rem;\n  --breakpoint-lg: 64rem;\n  --container-xs: 20rem;\n  --container-sm: 24rem;\n  --container-md: 28rem;\n  --container-lg: 32rem;\n$ grep -E -- '--radius-[a-z0-9]+:' node_modules/tailwindcss/theme.css | tr -s ' ' | tr '\\n' ' '; echo\n --radius-xs: 0.125rem;  --radius-sm: 0.25rem;  --radius-md: 0.375rem;  --radius-lg: 0.5rem;  --radius-xl: 0.75rem;  --radius-2xl: 1rem;  --radius-3xl: 1.5rem;  --radius-4xl: 2rem; ",
 "t1-5:file:tailwind.config.js": "module.exports = { content: ['./trang.html'] };\n",
 "t1-5:file:nhap.css": "@tailwind utilities;\n",
 "t1-5:file:trang.html": "<div class=\"w-1/2 w-7/13 w-xs w-screen w-dvw w-fit max-w-prose h-screen h-dvh min-h-screen rounded rounded-sm rounded-xs\"></div>\n",
 "t1-5:so": "$ for c in 'w-1\\/2' 'w-7\\/13' 'w-xs' 'w-dvw' 'w-fit' 'max-w-prose' 'h-dvh' 'rounded' 'rounded-sm' 'rounded-xs'; do printf '%-13s v3: %-38s v4: %s\\n' \"$(echo $c | tr -d '\\\\')\" \"$(grep -A1 -F \".$c {\" out.css | tail -1 | tr -s ' ' | sed 's/^ //;s/;$//')\" \"$(grep -A1 -F \".$c {\" ../dinh4/out.css | tail -1 | tr -s ' ' | sed 's/^ //;s/;$//')\"; done\nw-1/2         v3: width: 50%                             v4: width: calc(1 / 2 * 100%)\nw-7/13        v3:                                        v4: width: calc(7 / 13 * 100%)\nw-xs          v3:                                        v4: width: var(--container-xs)\nw-dvw         v3: width: 100dvw                          v4: width: 100dvw\nw-fit         v3: width: -moz-fit-content                v4: width: fit-content\nmax-w-prose   v3: max-width: 65ch                        v4: max-width: 65ch\nh-dvh         v3: height: 100dvh                         v4: height: 100dvh\nrounded       v3: border-radius: 0.25rem                 v4: border-radius: 0.25rem\nrounded-sm    v3: border-radius: 0.125rem                v4: border-radius: var(--radius-sm)\nrounded-xs    v3:                                        v4: border-radius: var(--radius-xs)",
 "t1-5:kho": "$ for c in rounded rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl rounded-full; do printf \"%-14s %6d\\n\" \"$c\" \"$(grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | sed 's/className=\"//;s/\"$//' | tr ' ' '\\n' | grep -cx \"$c\")\"; done\nrounded           677\nrounded-sm         21\nrounded-md        304\nrounded-lg       1830\nrounded-xl       1863\nrounded-2xl       962\nrounded-full     1690\n$ for c in w-screen h-screen min-h-screen h-dvh min-h-dvh w-fit max-w-prose; do printf \"%-14s %6d\\n\" \"$c\" \"$(grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | sed 's/className=\"//;s/\"$//' | tr ' ' '\\n' | grep -cx \"$c\")\"; done\nw-screen            0\nh-screen            1\nmin-h-screen      153\nh-dvh               2\nmin-h-dvh           3\nw-fit              14\nmax-w-prose         0",
 "t1-5:file:khung.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"m-0 bg-white font-sans text-slate-800\">\n  <div class=\"flex\">\n    <aside id=\"ben\" class=\"w-100 shrink-0 overflow-hidden bg-slate-100 p-3\">\n      <p class=\"mb-2 text-sm font-bold\">thanh bên w-100 (400px) · overflow-hidden</p>\n      <div id=\"full\" class=\"mb-2 w-full bg-cyan-300 p-2\">w-full</div>\n      <div id=\"scr\" class=\"mb-2 w-screen bg-amber-300 p-2\">w-screen</div>\n      <div id=\"fit\" class=\"mb-2 w-fit rounded bg-cyan-700 px-3 py-1 text-white\">div w-fit · Lưu</div>\n      <div id=\"aut\" class=\"w-auto rounded bg-slate-500 px-3 py-1 text-white\">div w-auto · Lưu</div>\n    </aside>\n    <main class=\"p-3\"><p id=\"prose\" class=\"max-w-prose bg-cyan-50\">max-w-prose: cột chữ dài dừng ở khoảng 65 ký tự để mắt không phải chạy quá xa từ cuối dòng này về đầu dòng sau.</p></main>\n  </div>\n</body></html>\n",
 "t1-5:trang": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 24ms\n$ grep -A1 -E '^ *\\.(w-100|w-screen|max-w-prose) \\{' out.css\n  .w-100 {\n    width: calc(var(--spacing) * 100);\n--\n  .w-screen {\n    width: 100vw;\n--\n  .max-w-prose {\n    max-width: 65ch;",
 "anh-twc-1-5:khung": {
  "url": "http://127.0.0.1:20109/dinh4/khung.html",
  "vp": [
   1000,
   250
  ],
  "rect": {
   "#ben": [
    0,
    0,
    400,
    220
   ],
   "#full": [
    12,
    40,
    376,
    40
   ],
   "#scr": [
    12,
    88,
    1000,
    40
   ],
   "#fit": [
    12,
    136,
    123,
    32
   ],
   "#aut": [
    12,
    176,
    376,
    32
   ],
   "#prose": [
    412,
    12,
    576,
    48
   ]
  },
  "console": [],
  "ketQua": {
   "rong": "[[\"ben\",\"w-100\",400],[\"full\",\"w-full\",376],[\"scr\",\"w-screen\",1000],[\"fit\",\"w-fit\",123],[\"aut\",\"w-auto\",376],[\"prose\",\"max-w-prose\",576],[\"vw\",\"innerWidth\",1000],[\"ch\",\"font-size\",\"16px\"]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, tn, br, box, two, steps, kw, c, cmp, meter, icards } from './_twc-chung.mjs';

export const deck = { key: 'twc-01-5', code: 'TWC 1.5', title: 'Sizing: the scale plus the keys that are NOT lengths', sub: 'Chapter 1 · Lesson 1.5' };
const O = (k) => { const v = DU_LIEU[`t1-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-1-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-01-5', ten, { vp: 1000, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t1-5 · Tailwind 3.4.19 + 4.3.5 · Chromium 1000px · frontend/ 14/11/2026)
const V3 = doan('v3w', 'node rong.mjs');
const SO = doan('so', 'for c in').map((l) => { const m = l.match(/^(\S+)\s+v3: (.*?)\s+v4: (.*)$/); return [m[1], m[2].trim(), m[3].trim()]; });
const so = (k) => SO.find((r) => r[0] === k);
const bang = (dau) => Object.fromEntries(doan('kho', dau).map((l) => { const [k, v] = l.trim().split(/\s+/); return [k, +v]; }));
const RD = bang('for c in rounded '), VP = bang('for c in w-screen');
const R = Object.fromEntries(JSON.parse(A('khung').ketQua.rong).map(([id, k, w]) => [id, [k, w]]));
if (!V3[0].startsWith('width keys: 70 | spacing keys: 35') || so('w-7/13')[1] !== '' || !so('w-7/13')[2].includes('7 / 13') || so('rounded-sm')[1] !== 'border-radius: 0.125rem'
  || RD.rounded !== 677 || VP['min-h-screen'] !== 153 || R.full[1] !== 376 || R.scr[1] !== 1000 || R.fit[1] !== 123 || R.aut[1] !== 376 || R.prose[1] !== 576) throw new Error('số đo đổi');
const KHUNG = `<aside id="ben" class="w-100 shrink-0 overflow-hidden …">  <!-- 400px -->
  <div id="full" class="mb-2 w-full …">w-full</div>
  <div id="scr" class="mb-2 w-screen …">w-screen</div>
  <div id="fit" class="mb-2 w-fit …">div w-fit · Lưu</div>
  <div id="aut" class="w-auto …">div w-auto · Lưu</div>
</aside>`;

// mã hiển thị RÚT GỌN bằng "…": phần trước "…" của mỗi dòng phải có thật trong khung.html (so sau khi bỏ khoảng trắng)
const bo = (x) => x.replace(/\s+/g, '');
for (const l of KHUNG.split('\n')) { const dau = bo(l.split('…')[0].split('<!--')[0]); if (dau && !bo(O('file:khung.html')).includes(dau)) throw new Error('mã hiển thị KHÔNG khớp khung.html: ' + l); }
export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.5', t: 'Sizing: the scale plus<br>the keys that are NOT lengths', sub: 'Half of the width keys are the spacing scale. The other half resolve against something else — the parent, the window, the content — and that is where sizing bugs come from',
    en: 'Lesson one point five. Half of the width keys are the spacing scale you already know. The other half resolve against something else: the parent, the window or the content. That is where sizing bugs come from.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Counting the two halves of the sizing scale (Tailwind 3) — and what Tailwind 4 did instead</li>
    <li>Three reference frames: <b>parent</b>, <b>window</b>, <b>content</b></li>
    <li><code>w-screen</code> inside a sidebar, measured in Chromium</li>
    <li><code>w-fit</code>, <code>max-w-prose</code>, and the mobile <code>h-screen</code> trap</li>
    <li>Breakpoints and radius: what changed between Tailwind 3 and 4</li></ul>`,
    en: 'Five takeaways: the two halves of the sizing scale and what Tailwind 4 did instead; three reference frames, parent, window and content; w-screen inside a sidebar, measured; w-fit, max-w-prose and the mobile h-screen trap; and what changed in breakpoints and radius.' },
  { t: 'Counting the two halves (Tailwind 3.4.19)', body: tn(['$ node rong.mjs', ...V3.slice(0, 2)].join('\n'), { fs: 17, wrap: 92, title: 'Tailwind 3.4.19 (real)' }) +
    two(box('Read it', '<b>70</b> width keys: exactly half (35) are the spacing scale from lesson 1.1 — <code>w-4</code> = 16px. The other <b>35</b> keys are not lengths at all.', 'lam'),
      box('Three groups', 'Fractions (<code>1/2</code> … <code>11/12</code>, <code>full</code>) · viewport (<code>screen svw lvw dvw</code>) · content (<code>min max fit auto</code>).', 'xanh'), ''),
    en: 'Counting the two halves, in Tailwind 3. Seventy width keys: exactly half are the spacing scale from lesson one point one. The other thirty-five are not lengths at all: fractions, viewport units and content keywords.' },
  { t: 'Three reference frames', body: icards([
      ['layers', 'Fractions — the PARENT', `${c('w-1/2')} ⇒ <code>width: 50%</code> of the parent. Twelfths exist because 12 divides by 2, 3, 4 and 6 — the same reason grids use 12 columns.`],
      ['eye', 'Viewport — the WINDOW', `${c('w-screen')} = 100vw, ignoring the parent. ${c('svw')} / ${c('lvw')} / ${c('dvw')}: small, large, dynamic — because mobile browser bars appear and disappear while you scroll.`],
      ['box', 'Content — the BROWSER computes it', `${c('w-fit')} hugs the content but never exceeds the parent; ${c('w-min')} ≈ longest word; ${c('w-max')} ignores the parent (can overflow); ${c('w-auto')} depends on display.`],
    ]),
    en: 'Three reference frames. Fractions resolve against the parent: w one half is fifty percent of the parent. Viewport units resolve against the window, ignoring the parent. Content keywords let the browser compute the size from the content. Mixing up which frame a value uses causes most sizing bugs.' },
  { t: 'Tailwind 4: any fraction, plus a container scale', body: cmp(['class', 'Tailwind 3.4.19', 'Tailwind 4.3.5'], SO.map(([k, a, b]) => [k, a || '<b style="color:#c0392b">— no rule</b>', b])) +
    box('Read it', `No width list in v4: <code>w-7/13</code> is computed; <code>w-xs</code> comes from a new container scale (20rem). And <code>rounded-sm</code> <b>changed meaning</b>: 2px in v3, 4px in v4.`, 'lam'),
    en: 'Tailwind 4 has no width list. Any fraction is computed, w seven thirteenths included, and w-xs comes from a new container scale. And careful: rounded-sm changed meaning, from two pixels in Tailwind 3 to four pixels in Tailwind 4.' },
  { t: 'Parent vs window: w-screen inside a sidebar', body: two(D(html(KHUNG, { sm: true, hl: [3] }), B('khung', { url: 'dinh4/khung.html · Tailwind 4.3.5 · window 1000px', h: 230, w: 800 })),
    D(cmp(['class', 'measured width'], [['aside w-100', `${R.ben[1]}px`], ['w-full', `<b>${R.full[1]}px</b> (fills the sidebar)`], ['w-screen', `<b>${R.scr[1]}px</b> = the window`]]),
      box('Read it', `<code>w-screen</code> is <b>${R.scr[1]}px</b> inside a 400px sidebar. No error: it just overflows — and with <code>overflow-hidden</code> on the parent the extra part is <b>invisible</b>, so the symptom is "my element got cut off", not "my element is too wide".`, 'do2')), 'r64'),
    en: 'Parent versus window, measured. Inside a four hundred pixel sidebar, w-full is three hundred seventy-six pixels: it fills the sidebar. w-screen is one thousand: the whole window. No error. With overflow hidden on the parent the extra part is invisible, so the symptom is: my element got cut off.' },
  { t: 'The mobile viewport trap — and what this site does', body: two(D(steps([
      'On phones the address bar <b>hides as you scroll</b>, so the viewport height changes mid-scroll',
      `${c('h-screen')} (100vh) uses the <b>largest</b> possible viewport ⇒ the bottom of a full-height layout sits under the browser bar`,
      `${c('h-dvh')} tracks the current size; ${c('h-svh')} the smallest; ${c('min-h-screen')} grows with content`,
    ])), D(tn(['$ … grep -cx … # frontend/, 14/11/2026', ...doan('kho', 'for c in w-screen')].join('\n'), { fs: 16, title: 'frontend/ (real)' }),
      box('Read it', `This site already follows the rule: <code>min-h-screen</code> <b>${VP['min-h-screen']}</b> times, <code>h-screen</code> only ${VP['h-screen']}, <code>w-screen</code> ${VP['w-screen']}. (Desktop Chromium has no hiding bar, so dvh = vh there — test on a phone.)`, 'xanh')), 'r64'),
    en: 'The mobile viewport trap. On phones the address bar hides as you scroll, so the viewport height changes. h-screen uses the largest viewport, so the bottom of a full-height layout sits under the bar. h-dvh tracks the current size, and min-h-screen grows with the content. This site already uses min-h-screen one hundred fifty-three times and h-screen only once.' },
  { t: 'The content trio: w-fit vs w-auto, measured', body: two(D(cmp(['element in the 400px sidebar', 'measured width'], [['div w-fit', `<b>${R.fit[1]}px</b> — hugs its label`], ['div w-auto', `<b>${R.aut[1]}px</b> — fills the parent (block)`]]),
      B('khung', { url: 'dinh4/khung.html', h: 230, w: 520, vp: 1000 })),
    D(box('w-fit', '<code>width: fit-content</code>: as wide as the content, never wider than the parent. The right answer for a button or badge that must hug a label — instead of a guessed fixed width that breaks when the label is translated.', 'xanh'),
      box('w-auto depends on display', 'On a block element it fills the parent (376px here); on inline-block it hugs content. That context-dependence is why the explicit trio (<code>w-fit</code>, <code>w-min</code>, <code>w-max</code>) is usually clearer.', 'lam')), 'r64'),
    en: 'The content trio, measured. In the same sidebar, a div with w-fit is one hundred twenty-three pixels: it hugs its label. A div with w-auto is three hundred seventy-six: as a block it fills the parent. w-fit is the right answer for buttons and badges that must hug a label in any language.' },
  { t: 'max-w-prose: a key that encodes READABILITY', body: two(D(tn(["$ grep -A1 -E '^ *\\.(w-100|w-screen|max-w-prose) \\{' out.css", ...doan('trang', 'grep -A1').filter((l) => l !== '--')].join('\n'), { fs: 16, title: 'Tailwind 4.3.5 (real)' }),
      cmp(['measured', 'value'], [['max-w-prose at 16px', `<b>${R.prose[1]}px</b>`], ['= 65ch', '65 widths of the "0" glyph'], ['uses on this site', `${VP['max-w-prose']}`]])),
    D(box('Read it', `<code>max-w-prose</code> is <b>65ch</b> — the typographic convention for comfortable line length. It measured <b>${R.prose[1]}px</b> here. It is the right default for any long text column; most hand-made article layouts reinvent it as a magic pixel number.`, 'lam'),
      box('This site', `${VP['max-w-prose']} uses here — worth adopting for any long-text page.`, 'xanh')), 'r64'),
    en: 'max-w-prose is sixty-five ch, the typographic convention for comfortable line length: five hundred seventy-six pixels at a sixteen pixel font. It is the one key that encodes a readability rule, and the right default for long text. This site uses it zero times.' },
  { t: 'Breakpoints: a separate, smaller scale — min-width', body: two(D(tn(['$ node rong.mjs | grep screens       # Tailwind 3.4.19', V3[2], "$ grep -E -- '--breakpoint-(sm|md|lg):' theme.css   # Tailwind 4.3.5", ...doan('v4w', '--(breakpoint').filter((l) => /breakpoint/.test(l)).map((l) => l.trim())].join('\n'), { fs: 16, wrap: 70, title: 'real' })),
    D(box('Read it', 'Five values. Tailwind 3 stores px; Tailwind 4 stores <b>rem</b> (40rem = 640px at a 16px root). And both are <b>min-width</b>: <code>md:flex</code> means "flex at 768px <b>and up</b>", not "on medium screens".', 'lam'),
      box('So mobile-first is the direction of the system', 'The unprefixed class is the small case; each breakpoint overrides upward. Writing <code>md:</code> to mean "tablet only" applies the style on desktop too. Chapter 2 measures why breakpoints win.', 'xanh')), 'r64'),
    en: 'Breakpoints are a separate, smaller scale: five values. Tailwind 3 stores pixels, Tailwind 4 stores rem. And both are min-width: md flex means flex at seven hundred sixty-eight pixels and up, not on medium screens. Mobile-first is the direction of the whole system.' },
  { t: 'Radius: where this site disagrees with the default', body: two(D(meter(Object.entries(RD).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v, k === 'rounded' || k === 'rounded-sm' ? '#c28a00' : '#0891b2']), { don: '', nhan: 140, fs: 16, rh: 40, w: 560 }),
      tn(['$ node rong.mjs | grep radius   # Tailwind 3.4.19', V3[3]].join('\n'), { fs: 14, wrap: 64, title: 'real' })),
    D(box('Read it', `Bare <code>rounded</code> is 4px. This site leans much rounder: <code>rounded-xl</code> ${n(RD['rounded-xl'])}, <code>rounded-lg</code> ${n(RD['rounded-lg'])}, <code>rounded-full</code> ${n(RD['rounded-full'])}. A snippet copied from the docs will look sharper than the UI around it.`, 'lam'),
      box('Changed since the lesson was written', `The lesson said bare <code>rounded</code> "barely appears". Today: <b>${RD.rounded}</b> uses. And upgrading to Tailwind 4 would turn the ${RD['rounded-sm']} <code>rounded-sm</code> from 2px into <b>4px</b> (v4 renamed the scale: <code>rounded-xs</code> is the old <code>rounded-sm</code>).`, 'do2')), 'r64'),
    en: 'Radius, where this site disagrees with the default. Bare rounded is four pixels, but this site leans much rounder: rounded-xl, rounded-lg and rounded-full each well over a thousand uses. The written lesson said bare rounded barely appears; today it has six hundred seventy-seven uses. And Tailwind 4 renamed the scale: rounded-sm becomes four pixels.' },
  { t: 'Trap: h-screen for a full-height app shell', body: two(box('Wrong twice', '<code>h-screen</code> breaks on mobile (the bar), <b>and</b> it forces exactly the viewport height even when the content is longer — so the content is <b>cut off</b> instead of scrolling.', 'do2'),
    steps([`Shell that grows with content: ${c('min-h-screen')}`, `A genuine fixed-height scroll area: ${c('h-dvh')} + ${c('overflow-y-auto')}`, `Inside a constrained container, never ${c('w-screen')}: use ${c('w-full')}`]), 'r64'),
    en: 'The trap: h-screen for a full-height app shell. It is wrong twice: it breaks on mobile, and it forces exactly the viewport height, so longer content is cut off instead of scrolling. Use min-h-screen for a shell that grows, or h-dvh with overflow for a real fixed-height scroll area.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Fraction keys', 'w-1/2 = 50% of the PARENT'), kw('Viewport units', 'screen · svw · lvw · dvw'), kw('Content keys', 'fit · min · max · auto'),
      kw('--container-*', 'v4 container scale (w-xs = 20rem)'), kw('max-w-prose', '65ch readable line'), kw('min-width breakpoints', 'md: = 768px and up'),
      kw('h-dvh / min-h-screen', 'the mobile-safe heights'), kw('Radius rename (v4)', 'rounded-sm 2px ⇒ 4px'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: fraction keys; viewport units; content keys; the Tailwind 4 container scale; max-w-prose; min-width breakpoints; the mobile-safe heights h-dvh and min-h-screen; and the radius rename in Tailwind 4.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Put ${c('w-full')} and ${c('w-screen')} inside a 400px sidebar; measure both in DevTools`,
      `Compare ${c('w-fit')} and ${c('w-auto')} on a div, then on an inline-block`,
      `Open a full-height page on your phone: ${c('h-screen')} vs ${c('h-dvh')}`,
      `Grep your project for ${c('rounded-sm')} before upgrading to Tailwind 4`,
    ]), box('Keep these', '<ul><li>Half the keys are lengths; half are not</li><li>Parent · window · content</li><li>No w-screen inside a container</li><li>min-h-screen / h-dvh, not h-screen</li><li>Breakpoints are min-width</li></ul>', 'lam'), ''),
    en: 'Your turn: measure w-full against w-screen in a sidebar; compare w-fit and w-auto; open a full-height page on your phone; and grep rounded-sm before upgrading. Keep: half the keys are not lengths, know the reference frame, and breakpoints are min-width.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — The scale, the thing worth learning', bai: '1.5' }, S);
