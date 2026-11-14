/*DU_LIEU*/
const DU_LIEU = {
 "n13-5:file:src/lib/button.ts": "// lib/button.ts — đoạn mã của bài, chép nguyên (+ import, export)\nimport { cva } from 'class-variance-authority';\n\nexport const button = cva('rounded font-medium', {\n  variants: {\n    intent: { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' },\n    size:   { sm: 'px-2 py-1 text-sm', lg: 'px-5 py-3 text-lg' },\n  },\n});\n",
 "n13-5:file:src/app/nut-cva/page.tsx": "// app/nut-cva/page.tsx — dùng biến thể: đúng, và một biến thể KHÔNG có\nimport { button } from '@/lib/button';\n\nexport default function Trang() {\n  return (\n    <main className=\"flex gap-3 p-4\">\n      <button className={button({ intent: 'primary', size: 'lg' })}>Lưu</button>\n      <button className={button({ intent: 'danger', size: 'sm' })}>Xoá</button>\n    </main>\n  );\n}\n",
 "n13-5:cva": "$ npx tsc --noEmit      # intent: 'danger' — không có trong variants\nnut-cva/page.tsx(8,35): error TS2322: Type '\"danger\"' is not assignable to type '\"primary\" | \"ghost\" | null | undefined'.\n$ npx tsc --noEmit && echo \"tsc: 0 lỗi (danger → ghost)\"\ntsc: 0 lỗi (danger → ghost)\n$ npx tsx -e \"…button(…)\"      # cva trả về CHUỖI lớp\nbutton({ intent: 'primary', size: 'lg' }) → \"rounded font-medium bg-blue-600 text-white px-5 py-3 text-lg\"\nbutton({ intent: 'ghost', size: 'sm' })  → \"rounded font-medium bg-transparent px-2 py-1 text-sm\"\nbutton()                                 → \"rounded font-medium\"\n$ (bài) <button class={button({ intent: 'primary', size: 'lg' })}>\nnut-cva/bai.tsx(2,32): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTML",
 "n13-5:file:src/app/globals.css": "@import \"tailwindcss\";\n@custom-variant dark (&:where(.dark, .dark *));\n\n:root            { --text-primary: #111111; --surface: #ffffff; }\nhtml.theme-dark  { --text-primary: #eeeeee; --surface: #0b0b0b; }\n\n@theme inline {\n  --color-surface: var(--surface);\n  --color-fg: var(--text-primary);\n}\n\nbody { background: var(--surface); color: var(--text-primary); font-family: Arial, Helvetica, sans-serif; }\n",
 "n13-5:file:src/app/den/page.tsx": "// app/den/page.tsx — bốn bề mặt, đo tương phản ở CẢ HAI theme\nexport default function Trang() {\n  return (\n    <main className=\"grid grid-cols-2 gap-3 p-4 text-lg\">\n      {/* A — BẪY: nền tối CỐ ĐỊNH, chữ thừa hưởng biến theme */}\n      <section id=\"A\" className=\"rounded-lg bg-zinc-900 p-4\">A · nền cố định, chữ theo theme</section>\n      {/* B — SỬA: bề mặt cố định thì ghim CẢ màu chữ */}\n      <section id=\"B\" className=\"rounded-lg bg-zinc-900 p-4 text-white\">B · nền cố định + text-white</section>\n      {/* C — BẪY ngược: nền theo theme, chữ CỐ ĐỊNH */}\n      <section id=\"C\" className=\"rounded-lg border bg-surface p-4 text-gray-900\">C · nền theo theme, chữ cố định</section>\n      {/* D — cố định CẢ HAI: đọc được, nhưng không theo theme */}\n      <section id=\"D\" className=\"rounded-lg bg-white p-4 text-gray-900\">D · bg-white text-gray-900</section>\n    </main>\n  );\n}\n",
 "n13-5:den": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/den'\n✓ Compiled successfully in 4.4s\n├ ○ /den\n$ Chromium: tương phản WCAG (chữ ÷ nền) của bốn bề mặt — theme sáng và theme-dark\nden-sang  · A 1.07:1 · B 17.72:1 · C 17.75:1 · D 17.75:1\nden-toi   · A 15.27:1 · B 17.72:1 · C 1.11:1 · D 17.75:1",
 "n13-5:file:src/app/focus/page.tsx": "// app/focus/page.tsx — ba nút: chuột bấm và phím Tab\nexport default function Trang() {\n  return (\n    <main className=\"flex gap-4 p-6 text-lg\">\n      <button id=\"f1\" className=\"rounded bg-blue-600 px-4 py-2 text-white focus:ring-4 focus:ring-orange-400\">focus:ring</button>\n      <button id=\"f2\" className=\"rounded bg-blue-600 px-4 py-2 text-white outline-none focus-visible:ring-4 focus-visible:ring-orange-400\">focus-visible:ring</button>\n      <button id=\"f3\" className=\"rounded bg-blue-600 px-4 py-2 text-white outline-none\">outline-none</button>\n    </main>\n  );\n}\n",
 "n13-5:focus": "$ npm run build 2>&1 | grep -E 'Compiled|/focus'\n✓ Compiled successfully in 698ms\n└ ○ /focus\n$ Chromium: mỗi nút — bấm CHUỘT rồi đọc vòng focus; bấm TAB rồi đọc vòng focus\nf1 · chuột         CÓ vòng\nf2 · chuột         không vòng · outline none\nf3 · chuột         không vòng · outline none\nTab 1               không vòng · outline none\nTab 2              f1 CÓ vòng\nTab 3              f2 CÓ vòng\nTab 4              f3 không vòng · outline none",
 "n13-5:kho": "$ git show --stat --format='%h %ad %s' --date=short 019db6d3f | head -1 | cut -c1-110\n019db6d3f 2026-08-22 fix(cv): /cv/xem chữ gần-đen trên nền cố định tối — tương phản 1,08\n$ git show --stat --format='%h %ad' --date=short 562f6379d | sed -n '1p;$p'\n562f6379d 2026-11-08\n 109 files changed, 3285 insertions(+), 3210 deletions(-)\n$ grep -rlE \"outline-none\" frontend/src --include='*.tsx' | wc -l | sed 's/^ */tệp .tsx có outline-none: /'\ntệp .tsx có outline-none: 321",
 "anh-nxj-13-5:den-sang": {
  "url": "http://127.0.0.1:19395/den",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "tuongPhan": "A 1.07:1 · B 17.72:1 · C 17.75:1 · D 17.75:1"
  }
 },
 "anh-nxj-13-5:den-toi": {
  "url": "http://127.0.0.1:19395/den",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "tuongPhan": "A 15.27:1 · B 17.72:1 · C 1.11:1 · D 17.75:1"
  }
 },
 "anh-nxj-13-5:focus-tab2": {
  "url": "http://127.0.0.1:19395/focus",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-5:focus-tab3": {
  "url": "http://127.0.0.1:19395/focus",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-5:focus": {
  "url": "http://127.0.0.1:19395/focus",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "f1 · chuột": "CÓ vòng",
   "f2 · chuột": "không vòng · outline none",
   "f3 · chuột": "không vòng · outline none",
   "Tab 1": " không vòng · outline none",
   "Tab 2": "f1 CÓ vòng",
   "Tab 3": "f2 CÓ vòng",
   "Tab 4": "f3 không vòng · outline none"
  }
 },
 "anh-nxj-13-5:focus-tab4": {
  "url": "http://127.0.0.1:19395/focus",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-13-5', code: 'NXJ 13.5', title: 'Styling at scale, and the black-on-black trap', sub: 'Chapter 13 · Lesson 13.5' };
const O = (k) => { const v = DU_LIEU[`n13-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-13-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-13-5', ten, { vp: 640, ...o });

// ── số đo (n13-5 · Next.js 16.4.6 + Tailwind 4.3.3 · cva 0.7.1 · Chromium)
const TSC = doan('cva', "intent: 'danger'"), TSC2 = doan('cva', 'danger → ghost'), RUN = doan('cva', 'button(…)'), BAI = doan('cva', '(bài)');
const tp = (k) => Object.fromEntries(A(k).ketQua.tuongPhan.split(' · ').map((x) => x.split(' ')));
const S1 = tp('den-sang'), S2 = tp('den-toi');
const FO = A('focus').ketQua;
const KHO = O('kho');
const so = (v) => Number(v.split(':')[0]);
if (!/TS2322: Type '"danger"'/.test(TSC[0]) || !/0 lỗi/.test(TSC2[0]) || !/class: string/.test(BAI[0])) throw new Error('cva đổi');
if (!(so(S1.A) < 1.5 && so(S2.A) > 4.5 && so(S1.C) > 4.5 && so(S2.C) < 1.5 && so(S1.D) > 4.5 && so(S2.D) > 4.5 && so(S1.B) > 4.5 && so(S2.B) > 4.5)) throw new Error('tương phản đổi');
if (FO['f1 · chuột'] !== 'CÓ vòng' || !/không/.test(FO['f2 · chuột']) || FO['Tab 3'] !== 'f2 CÓ vòng' || !/^f3 không/.test(FO['Tab 4'])) throw new Error('focus đổi');
const mauTP = (v) => (so(v) < 4.5 ? `<b style="color:#c0392b">${v} ✗</b>` : `${v} ✓`);

const BTN = bo(F('src/lib/button.ts')).split('\n').filter((l) => l.trim()).join('\n').replace("intent: { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' },", "intent: {\n      primary: 'bg-blue-600 text-white',\n      ghost: 'bg-transparent',\n    },").replace("size:   { sm: 'px-2 py-1 text-sm', lg: 'px-5 py-3 text-lg' },", "size: {\n      sm: 'px-2 py-1 text-sm',\n      lg: 'px-5 py-3 text-lg',\n    },");
const DEN = bo(F('src/app/den/page.tsx')).split('\n').filter((l) => /<section/.test(l)).map((l) => l.trim().replace(/>[A-D] · .*<\/section>/, '>…</section>').replace(/rounded-lg (border )?/, '').replace(' p-4', '')).join('\n');
const FOC = bo(F('src/app/focus/page.tsx')).split('\n').filter((l) => /<button/.test(l)).map((l) => l.trim().replace(/<button id="(f\d)" className="rounded bg-blue-600 px-4 py-2 text-white ([^"]*)">.*<\/button>/, '<button id="$1"\n  className="… $2">').replace('outline-none focus-visible:ring-4', 'outline-none\n    focus-visible:ring-4')).join('\n');
const enFo = (v) => v.replace('CÓ vòng', 'ring shown').replace('không vòng · outline none', 'NO ring, outline none');

export const S = [
  { cover: true, nhan: 'Chapter 13 · Lesson 13.5', t: 'Styling at scale, and<br>the black-on-black trap', sub: 'Variants declared once with cva and checked by tsc; four surfaces measured for contrast in both themes; focus rings for the keyboard — and what cuongthai.com had to fix',
    en: 'Lesson thirteen point five: styling at scale. Variants declared once with cva and checked by tsc; four surfaces measured for contrast in both themes, including the black-on-black trap; focus rings for keyboard users; and what cuongthai.com had to fix.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>cva</code>: variants declared once — an unknown variant is a <code>tsc</code> error</li>
    <li>Black-on-black: a <b>fixed</b> background with a <b>theme</b> text colour — 1.07:1, measured</li>
    <li>The mirror image: theme background, fixed text — invisible in the other theme</li>
    <li>Contrast 4.5:1, and why every screen must be checked in both themes</li>
    <li><code>focus-visible</code>: a ring for the keyboard, none for the mouse</li></ul>`,
    en: 'Five takeaways: cva, where variants are declared once and an unknown variant is a tsc error; black-on-black, a fixed background with a theme text colour, measured at one point zero seven to one; its mirror image; contrast four point five to one in both themes; and focus-visible.' },
  { t: 'Variants once, with cva — and tsc checks them', body: two(D(tsx(BTN, { sm: true, hl: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }), tn(['$ npx tsx -e "…button(…)"   # cva returns a class STRING', ...RUN].join('\n'), { fs: 12, wrap: 62, title: 'cva run (real)' })),
    D(tn(["$ npx tsc --noEmit   # button({ intent: 'danger' })", ...TSC, ...TSC2].join('\n'), { fs: 13, wrap: 52, title: 'tsc (real)' }),
      box('Read it', 'The variant table lives in one file. <code>button({ intent: \'danger\' })</code> is a type error: <code>"danger"</code> is not <code>"primary" | "ghost"</code>. With no <code>defaultVariants</code>, <code>button()</code> returns only the base classes.', 'xanh')), 'r64'),
    en: 'Variants once, with cva. The table of variants lives in one file, and cva returns a plain class string. Asking for a variant that does not exist, intent danger, is a tsc error. Without defaultVariants, calling button with nothing returns only the base classes.' },
  { t: "The lesson's usage line: className, not class", body: two(D(tsx("<button class={button({ intent: 'primary', size: 'lg' })}>", { sm: true }), tn(['$ npx tsc --noEmit   # the lesson\'s line in a .tsx file', ...BAI].join('\n'), { fs: 14, wrap: 56, title: 'tsc (real)' }), tsx("<button className={button({ intent: 'primary', size: 'lg' })}>", { sm: true })),
    D(box('Read it', 'Same slip as 13.2: <code>class=</code> is HTML; in JSX it is <code>TS2322</code>. Use <code>className</code>.', 'do2'),
      box('Variants + cn', 'Let callers add classes with <code>cn(button({ … }), className)</code> (13.2) so their override wins.', 'lam')), 'r64'),
    en: 'The lesson\'s usage line writes class equals, HTML style. In a tsx file that is TS two three two two again; use className. And let callers add their own classes through cn, so their override wins.' },
  { t: 'Four surfaces, measured in both themes', body: two(D(B('den-sang', { url: 'light theme', h: 200, w: 520 }), B('den-toi', { url: 'html.theme-dark', h: 200, w: 520 })),
    D(cmp(['Surface', 'light', 'theme-dark'], [
        ['A · fixed bg, theme text', mauTP(S1.A), mauTP(S2.A)],
        ['B · fixed bg + text-white', mauTP(S1.B), mauTP(S2.B)],
        ['C · theme bg, fixed text', mauTP(S1.C), mauTP(S2.C)],
        ['D · bg-white text-gray-900', mauTP(S1.D), mauTP(S2.D)],
      ]), box('How', 'WCAG contrast of the computed text and background colour, in Chromium. 4.5:1 is the minimum for body text.', 'lam')), ''),
    en: 'Four surfaces, measured in both themes with the WCAG formula. A, a fixed dark background with the theme text colour: one point zero seven to one in light — invisible. B pins its text white and passes in both. C, a theme background with a fixed dark text: invisible in dark. D, white with gray nine hundred, passes in both.' },
  { t: 'The black-on-black rule', body: two(D(tsx(DEN, { sm: true }), box('Why A failed', 'Its background never changes, but its text follows <code>--text-primary</code>, which is near-black in the light theme. Near-black on <code>zinc-900</code>: <b>' + S1.A + '</b>. In the theme you built it in (dark) it looked fine: ' + S2.A + '.', 'do2'),
      box('Why C failed', 'The mirror image: the background follows the theme, the text is pinned dark. Fine in light, <b>' + S2.C + '</b> in dark.', 'do2')),
    D(box('The rule', 'A surface either follows the theme <b>completely</b> (background <i>and</i> text from tokens), or opts out <b>completely</b> — a fixed background must pin its own <code>color</code> too (B).', 'xanh'),
      box('Catch it', 'Every screen, both themes, before shipping. These bugs are invisible in the theme you developed in.', 'lam')), ''),
    en: 'The rule. A failed because its background never changes while its text follows the theme; in the dark theme you built it in, it looked fine. C is the mirror image. So a surface either follows the theme completely, background and text from tokens, or opts out completely and pins its own text colour too. And check every screen in both themes.' },
  { t: 'Correction: D is readable — it ignores the theme', body: two(D(B('den-toi', { url: 'D in html.theme-dark', h: 200, w: 520, mark: [[322, 70, 300, 56, '']] }),
      cmp(['bg-white text-gray-900', 'contrast'], [['light', S1.D], ['theme-dark', S2.D]])),
    D(box('Measured', 'The lesson calls <code>bg-white text-gray-900</code> "invisible in light mode and unreadable in dark". It is <b>' + S1.D + '</b> in both. The real problem: a white island on a dark page — it does not follow the theme.', 'do2'),
      box('What is actually invisible', 'Mixing: fixed with themed (A, C). Ban raw colours in components and use role tokens, so a component cannot opt out by half.', 'xanh')), ''),
    en: 'A correction. The lesson says bg-white with text gray nine hundred is invisible in light and unreadable in dark. Measured: seventeen point seven five to one in both. The real problem is a white island on a dark page. What is actually invisible is mixing fixed and themed colours, like A and C.' },
  { t: 'Focus rings: focus-visible for the keyboard', body: two(D(tsx(FOC, { sm: true }), tn(['# Chromium · click each button, then Tab through them', ...Object.entries(FO).filter(([k]) => k !== 'Tab 1').map(([k, v]) => `${k.replace(' · chuột', ' · mouse click').replace(/^Tab \d/, 'Tab').padEnd(16)} ${enFo(v)}`)].join('\n'), { fs: 13, wrap: 60, title: 'Chromium (real)' })),
    D(B('focus-tab3', { url: 'Tab → focus-visible:ring', vp: 640, h: 100, w: 470 }), B('focus-tab4', { url: 'Tab → outline-none', vp: 640, h: 100, w: 470 }),
      box('Read it', '<code>focus:</code> shows the ring on a mouse click too. <code>focus-visible:</code> shows it only when the browser judges it useful — keyboard. <code>outline-none</code> alone: focused, and <b>nothing visible</b>.', 'do2')), ''),
    en: 'Focus rings. focus ring shows even after a mouse click. focus-visible shows it only for keyboard focus: measured, no ring on click, a ring on Tab. And outline-none on its own: the button is focused and nothing shows — a keyboard user is lost.' },
  { t: 'cuongthai.com: the same bugs, in the history', body: two(D(tn(KHO, { fs: 14, wrap: 60, title: 'git log + frontend/ (real)' })),
    D(box('Black-on-black, shipped', '<code>019db6d3f</code>: near-black text on a fixed dark background on <code>/cv/xem</code> — contrast <b>1.08</b>.', 'do2'),
      box('The sweep', '<code>562f6379d</code> replaced fixed dark backgrounds and fixed white/slate text with tokens across <b>109 files</b>.', 'lam'),
      box('Still to audit', '<code>outline-none</code> appears in 321 <code>.tsx</code> files — every one must put a visible focus back (Tailwind CSS course 9.4 audits them).', 'xanh')), 'r64'),
    en: 'The same bugs in cuongthai.com\'s history: one commit fixed near-black text on a fixed dark background on the CV viewer, contrast one point zero eight; another swept fixed dark backgrounds and fixed text into tokens across one hundred nine files. And outline-none appears in three hundred twenty-one files; every one must put a visible focus back.' },
  { t: 'Constraints beat discipline', body: icards([
      ['gauge', '1 · The scale, not arbitrary values', '<code>p-4</code>, not <code>p-[17px]</code>. Every escape hatch is a value nobody reuses.'],
      ['box', '2 · A component, not a class string', 'Copied strings drift; <code>&lt;Button intent="ghost"&gt;</code> changes in one place (cva).'],
      ['eye', '3 · Contrast when you pick colours', '4.5:1 body text, 3:1 large text. Measure, do not eyeball.'],
      ['check', '4 · Both themes, every screen', 'Fixed + themed is invisible in one of them. Tokens for both, or pin both.'],
    ], 2),
    en: 'Constraints beat discipline: use the scale, not arbitrary values; extract a component instead of copying class strings; check contrast when you pick colours; and test both themes on every screen.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('cva', 'variants declared once, typed'), kw('Variant', 'intent / size → class string'), kw('Black-on-black', 'fixed bg + theme text'),
      kw('Contrast ratio', 'WCAG: 4.5:1 body text'), kw('Opt out completely', 'fixed bg ⇒ pin color'), kw('focus-visible', 'ring for keyboard focus'),
      kw('outline-none', 'removes focus — put one back'), kw('Two-theme check', 'every screen, both themes'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: cva; variant; black-on-black; contrast ratio; opting out completely; focus-visible; outline-none; and the two-theme check.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write a ${c('button')} with ${c('cva')}; call it with a variant that does not exist and read the ${c('tsc')} error`,
      `Build surfaces A–D; measure contrast in both themes (DevTools → Inspect → contrast)`,
      `Fix A by pinning ${c('text-white')}; fix C with tokens for both colours`,
      `Tab through your page: replace every bare ${c('outline-none')} with ${c('focus-visible:ring')}`,
    ]), box('Keep these', `<ul><li>Variants in one place (cva), typed</li><li>Fixed bg ⇒ pin text too</li><li>Never mix fixed and themed</li><li>4.5:1, both themes, every screen</li><li>focus-visible for keyboard focus</li></ul>`, 'lam'), ''),
    en: 'Your turn: write a cva button and trigger the type error; build the four surfaces and measure contrast in both themes; fix A and C; and tab through your page, replacing every bare outline-none with a focus-visible ring. Keep: variants in one place, never mix fixed and themed colours, and check both themes.' },
];
export const slides = lamDeck({ chuong: 'Chapter 13 — Styling, Tailwind & theming', bai: '13.5' }, S);
