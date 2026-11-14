/*DU_LIEU*/
const DU_LIEU = {
 "n13-2:file:src/app/luoi/page.tsx": "// app/luoi/page.tsx — lưới mobile-first: 1 cột → md 2 cột → lg 3 cột\nconst THE = ['Ghi chú', 'Lịch', 'Tệp', 'Nhóm', 'Báo cáo', 'Cài đặt'];\n\nexport default function Trang() {\n  return (\n    <div id=\"luoi\" className=\"grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3\">\n      {THE.map((t) => <div key={t} className=\"rounded-lg bg-blue-100 p-4 text-xl font-bold\">{t}</div>)}\n    </div>\n  );\n}\n",
 "n13-2:file:src/app/trang-thai/page.tsx": "// app/trang-thai/page.tsx — tiền tố trạng thái: hover / focus / disabled\nexport default function Trang() {\n  return (\n    <main className=\"flex flex-col items-start gap-4 p-6 text-xl\">\n      <button id=\"a\" className=\"rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-orange-400 disabled:opacity-50\">Lưu</button>\n      <button id=\"b\" disabled className=\"rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-orange-400 disabled:opacity-50\">Lưu (disabled)</button>\n      <p id=\"c\" className=\"p-4 bg-zinc-100\">p-4</p>\n      <p id=\"d\" className=\"p-[13px] bg-zinc-100\">p-[13px]</p>\n    </main>\n  );\n}\n",
 "n13-2:luoi": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/luoi|/trang-thai'\n✓ Compiled successfully in 4.5s\n├ ○ /luoi\n└ ○ /trang-thai\n$ python3 doc-css.py md:grid-cols-2 lg:grid-cols-3 hover:bg-blue-700 focus:ring-2 disabled:opacity-50 p-4 'p-[13px]'      # luật THẬT trong CSS đã build\nmd:grid-cols-2         ⇒ @media (min-width:48rem) › .md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}\nlg:grid-cols-3         ⇒ @media (min-width:64rem) › .lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}\nhover:bg-blue-700      ⇒ @media (hover:hover) › .hover\\:bg-blue-700:hover{background-color:var(--color-blue-700)}\nfocus:ring-2           ⇒ .focus\\:ring-2:focus{… box-shadow: vòng 2px …}\ndisabled:opacity-50    ⇒ .disabled\\:opacity-50:disabled{opacity:.5}\np-4                    ⇒ .p-4{padding:calc(var(--spacing) * 4)}\np-[13px]               ⇒ .p-\\[13px\\]{padding:13px}\n$ cat .next/static/chunks/*.css | grep -oE -- '--spacing:[^;]*' | head -1\n--spacing:.25rem\n$ Chromium: /luoi ở ba bề rộng · /trang-thai rê chuột, Tab, disabled — số cột và màu đo bằng getComputedStyle\n375px      1 cột\n800px      2 cột\n1100px     3 cột\nnen        lab(44.0605 29.0279 -86.0352)\nhover      lab(36.9089 35.0961 -85.6872)\nTab        a · rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, lab(70.0429 42.5156 75.8207) 0px 0px 0px 2px, rgba(0, 0, 0, 0) 0px 0px 0px 0px\ndisabled   0.5\np-4·p-[13px] 16px · 13px",
 "n13-2:file:src/app/xung/page.tsx": "// app/xung/page.tsx — BẪY: hai lớp cùng thuộc tính trên một phần tử. Lớp nào thắng?\nexport default function Trang() {\n  return (\n    <main className=\"flex flex-col items-start gap-3 text-xl\">\n      <p id=\"x1\" className=\"bg-amber-100 p-4 p-2\">p-4 p-2</p>\n      <p id=\"x2\" className=\"bg-amber-100 p-2 p-4\">p-2 p-4</p>\n      <p id=\"x3\" className=\"bg-amber-100 mt-32 mt-8\">mt-32 mt-8</p>\n      <p id=\"x4\" className=\"bg-amber-100 text-lg text-sm\">text-lg text-sm</p>\n    </main>\n  );\n}\n",
 "n13-2:file:src/lib/cn.ts": "// lib/cn.ts — clsx (ghép có điều kiện) + tailwind-merge (gỡ xung đột: cái SAU thắng)\nimport { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n",
 "n13-2:file:src/app/xung/Hop.tsx": "// app/xung/Hop.tsx — component nền đặt p-4, người gọi muốn p-2\nimport { cn } from '@/lib/cn';\n\nexport function HopTho({ className }: { className?: string }) {\n  return <div className={`bg-sky-100 p-4 ${className}`}>nối chuỗi</div>;\n}\nexport function HopCn({ className }: { className?: string }) {\n  return <div className={cn('bg-sky-100 p-4', className)}>cn()</div>;\n}\n",
 "n13-2:file:src/app/xung/hop/page.tsx": "import { HopTho, HopCn } from '../Hop';\nexport default function Trang() {\n  return <main className=\"flex flex-col items-start gap-3 text-xl\"><span id=\"h1\"><HopTho className=\"p-2\" /></span><span id=\"h2\"><HopCn className=\"p-2\" /></span></main>;\n}\n",
 "n13-2:file:src/app/xung/bai.tsx": "// app/xung/bai.tsx — đoạn mã của bài, chép nguyên vào một tệp .tsx\nimport { cn } from '@/lib/cn';\n\nexport function Nut({ isActive }: { isActive: boolean }) {\n  return <button class={cn('rounded px-4 py-2', isActive && 'bg-blue-600 text-white')}>Lưu</button>;\n}\n",
 "n13-2:xung": "$ npx tsc --noEmit      # đoạn mã cn của bài, chép nguyên (class=)\nxung/bai.tsx(5,18): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTMLProps<ButtonHTMLAttributes<HTMLBu\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi (class= → className=)'\ntsc: 0 lỗi (class= → className=)\n$ node -e \"…cn(…)\"      # chạy thật hàm cn của lib/cn.ts\ncn('p-2', 'p-4')                                               → \"p-4\"\ncn('p-4', 'p-2')                                               → \"p-2\"\ncn('px-4 py-2', 'p-2')                                         → \"p-2\"\ncn('rounded px-4 py-2', isActive && 'bg-blue-600 text-white')  → \"rounded px-4 py-2\"\n'p-2' + ' ' + 'p-4' (nối chuỗi)                                → \"p-2 p-4\"\n$ npm run build 2>&1 | grep -E 'Compiled|/xung'\n✓ Compiled successfully in 762ms\n├ ○ /xung\n└ ○ /xung/hop\n$ vị trí trong CSS (lớp đứng SAU thắng)\n.p-2{      byte 11777\n.p-4{      byte 11815\n.mt-8{     byte 9886\n.mt-32{    byte 9928\n.text-sm{  byte 12656\n.text-lg{  byte 12564\n$ Chromium: getComputedStyle — thuộc tính thắng ở mỗi phần tử\nthang                  p-4 p-2 ⇒ padding 16px | p-2 p-4 ⇒ padding 16px | mt-32 mt-8 ⇒ margin-top 128px | text-lg text-sm ⇒ font-size 14px\nhop                    bg-sky-100 p-4 p-2 ⇒ padding 16px | bg-sky-100 p-2 ⇒ padding 8px",
 "n13-2:file:src/app/max/page.tsx": "// app/max/page.tsx — \"dưới md\" CÓ tiền tố: max-md:\nexport default function Trang() {\n  return <p className=\"p-4 max-md:bg-red-100 md:bg-green-100\">màu nền theo bề rộng</p>;\n}\n",
 "n13-2:max": "$ npm run build 2>&1 | grep -E 'Compiled|/max'\n✓ Compiled successfully in 489ms\n└ ○ /max\n$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py max-md:bg-red-100 md:bg-green-100\nmax-md:bg-red-100      ⇒ @media not all and (min-width:48rem) › .max-md\\:bg-red-100{background-color:var(--color-red-100)}\nmd:bg-green-100        ⇒ @media (min-width:48rem) › .md\\:bg-green-100{background-color:var(--color-green-100)}",
 "anh-nxj-13-2:luoi-375": {
  "url": "http://127.0.0.1:19395/luoi",
  "vp": [
   375,
   560
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-2:luoi-800": {
  "url": "http://127.0.0.1:19395/luoi",
  "vp": [
   375,
   560
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-2:luoi": {
  "url": "http://127.0.0.1:19395/luoi",
  "vp": [
   375,
   560
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "375px": "1 cột",
   "800px": "2 cột",
   "1100px": "3 cột"
  }
 },
 "anh-nxj-13-2:trang-thai-hover": {
  "url": "http://127.0.0.1:19395/trang-thai",
  "vp": [
   520,
   330
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-2:trang-thai-tab": {
  "url": "http://127.0.0.1:19395/trang-thai",
  "vp": [
   520,
   330
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-13-2:trang-thai": {
  "url": "http://127.0.0.1:19395/trang-thai",
  "vp": [
   520,
   330
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "nen": "lab(44.0605 29.0279 -86.0352)",
   "hover": "lab(36.9089 35.0961 -85.6872)",
   "Tab": "a · rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, lab(70.0429 42.5156 75.8207) 0px 0px 0px 2px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
   "disabled": "0.5",
   "p-4·p-[13px]": "16px · 13px"
  }
 },
 "anh-nxj-13-2:xung": {
  "url": "http://127.0.0.1:19395/xung",
  "vp": [
   520,
   420
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "thang": "p-4 p-2 ⇒ padding 16px | p-2 p-4 ⇒ padding 16px | mt-32 mt-8 ⇒ margin-top 128px | text-lg text-sm ⇒ font-size 14px"
  }
 },
 "anh-nxj-13-2:hop": {
  "url": "http://127.0.0.1:19395/xung/hop",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "hop": "bg-sky-100 p-4 p-2 ⇒ padding 16px | bg-sky-100 p-2 ⇒ padding 8px"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-13-2', code: 'NXJ 13.2', title: 'Tailwind fundamentals: utilities, responsive, states', sub: 'Chapter 13 · Lesson 13.2' };
const O = (k) => { const v = DU_LIEU[`n13-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-13-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-13-2', ten, o);

// ── số đo (n13-2 · Next.js 16.4.6 + Tailwind 4.3.3)
const LUAT = doan('luoi', 'doc-css.py md:grid-cols-2');
const SPACING = doan('luoi', '--spacing')[0];
const L = A('luoi').ketQua, TT = A('trang-thai').ketQua;
const MAX = doan('max', 'max-md:bg-red-100');
const TSC = doan('xung', 'chép nguyên (class=)'), TSC2 = doan('xung', 'class= → className=');
const CN = doan('xung', 'cn(…)');
const VT = doan('xung', 'vị trí trong CSS');
const THANG = A('xung').ketQua.thang.split(' | '), HOP = A('hop').ketQua.hop.split(' | ');
const luat = (lop) => { const l = LUAT.find((x) => x.startsWith(lop + ' ')); if (!l) throw new Error('thiếu luật ' + lop); return l.replace(/^\S+\s+⇒ /, ''); };
if (L['375px'] !== '1 cột' || L['800px'] !== '2 cột' || L['1100px'] !== '3 cột') throw new Error('lưới đổi');
if (TT.disabled !== '0.5' || TT['p-4·p-[13px]'] !== '16px · 13px' || !/0px 0px 0px 2px/.test(TT.Tab) || TT.nen === TT.hover) throw new Error('trạng thái đổi');
if (!/padding 16px/.test(THANG[0]) || !/padding 16px/.test(THANG[1]) || !/128px/.test(THANG[2]) || !/14px/.test(THANG[3])) throw new Error('xung đột đổi');
if (!/16px/.test(HOP[0]) || !/8px/.test(HOP[1]) || !/not all and \(min-width:48rem\)/.test(MAX[0]) || !/TS2322/.test(TSC[0])) throw new Error('cn/max/tsc đổi');
const vt = (s) => Number(VT.find((l) => l.startsWith(s)).split('byte ')[1]);
if (!(vt('.p-4{') > vt('.p-2{') && vt('.mt-32{') > vt('.mt-8{') && vt('.text-sm{') > vt('.text-lg{'))) throw new Error('thứ tự CSS đổi');

const LUOI = bo(F('src/app/luoi/page.tsx'))
  .replace('<div id="luoi" className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">', '<div id="luoi"\n      className="grid grid-cols-1 gap-4 p-4\n                 md:grid-cols-2 lg:grid-cols-3">')
  .replace('{THE.map((t) => <div key={t} className="rounded-lg bg-blue-100 p-4 text-xl font-bold">{t}</div>)}', '{THE.map((t) => <div key={t}\n        className="rounded-lg bg-blue-100 p-4 …">{t}</div>)}');
const TTH = bo(F('src/app/trang-thai/page.tsx')).replace(/ className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-orange-400 disabled:opacity-50"/g, '\n        className="… hover:bg-blue-700 focus:ring-2\n          focus:ring-orange-400 disabled:opacity-50"').replace('">Lưu (disabled)</button>', '">\n        Lưu (disabled)</button>');
const CNF = bo(F('src/lib/cn.ts'));
const HOPF = bo(F('src/app/xung/Hop.tsx')).replace(/return <div className=\{(.*?)\}>/g, 'return <div\n    className={$1}>\n    ');
const BAI = `<button class={cn('rounded px-4 py-2', isActive && 'bg-blue-600 text-white')}>`;

export const S = [
  { cover: true, nhan: 'Chapter 13 · Lesson 13.2', t: 'Tailwind fundamentals:<br>utilities, responsive, states', sub: 'Every class is one CSS rule you can read. Measured in Chromium: breakpoints at three widths, hover, focus and disabled, which of two conflicting classes wins — and cn()',
    en: 'Lesson thirteen point two: Tailwind fundamentals. Every class is one CSS rule you can read in the build. We measure in Chromium: a grid at three widths, hover, focus and disabled, which of two conflicting classes wins, and the cn helper that fixes it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Read a class as its CSS rule: <code>p-4</code> = <code>calc(var(--spacing) * 4)</code> = 16px</li>
    <li>Mobile-first: <code>md:</code> is a <code>min-width</code> media query — and <code>max-md:</code> does exist</li>
    <li>State prefixes: <code>hover:</code>, <code>focus:</code>, <code>disabled:</code>, measured</li>
    <li>Two classes for one property: the stylesheet decides, not your order</li>
    <li><code>cn()</code> = <code>clsx</code> + <code>tailwind-merge</code>, and the lesson's <code>class=</code> that does not compile</li></ul>`,
    en: 'Five takeaways: reading a class as its CSS rule; mobile-first, where md is a min-width media query and max-md does exist; state prefixes, measured; two classes for one property, where the stylesheet decides; and cn, which is clsx plus tailwind-merge, with the lesson\'s class attribute that does not compile.' },
  { t: 'One class = one rule you can read', body: two(D(tn(['$ python3 doc-css.py p-4 \'p-[13px]\' disabled:opacity-50   # rules in the built CSS', `p-4         ⇒ ${luat('p-4')}`, `p-[13px]    ⇒ ${luat('p-[13px]')}`, `disabled:opacity-50 ⇒ ${luat('disabled:opacity-50')}`, '$ grep -o -- --spacing:… <built CSS>', SPACING, '# Chromium · getComputedStyle().padding', `p-4 · p-[13px]  ⇒  ${TT['p-4·p-[13px]']}`].join('\n'), { fs: 14, wrap: 64, title: 'built CSS + Chromium (real)' })),
    D(box('The scale', '<code>--spacing</code> is <code>.25rem</code> (4px). <code>p-4</code> = 4 × 4px = <b>16px</b>, <code>p-6</code> = 24px. Every spacing class is "number × 4px".', 'lam'),
      box('Escape hatch', '<code>p-[13px]</code> writes the literal value. It works — measured 13px — but it is a value nobody else on the team reuses. Stay on the scale unless you must.', 'xanh')), 'r64'),
    en: 'One class is one rule you can read. p-4 compiles to padding: calc of the spacing variable times four; the spacing variable is a quarter rem, four pixels, so Chromium measures sixteen pixels. The bracket form p-13px writes the literal value. It works, but nobody else reuses it, so stay on the scale.' },
  { t: 'Responsive: mobile-first, measured at three widths', body: two(D(tsx(LUOI, { sm: true, hl: [6, 7] }), tn([`md:grid-cols-2 ⇒ ${luat('md:grid-cols-2')}`, `lg:grid-cols-3 ⇒ ${luat('lg:grid-cols-3')}`, '# Chromium · columns in #luoi', `375px ⇒ ${L['375px']} · 800px ⇒ ${L['800px']} · 1100px ⇒ ${L['1100px']}`].join('\n'), { fs: 13, wrap: 66, title: 'built CSS + Chromium (real)' })),
    D(B('luoi-375', { url: '375px', vp: 375, h: 300, w: 190 }), B('luoi-800', { url: '800px', vp: 800, h: 240, w: 300 })), 'r64'),
    en: 'Responsive, mobile-first. The unprefixed grid-cols-1 applies everywhere. md colon becomes a media query, min-width forty-eight rem — seven hundred sixty-eight pixels — and lg is sixty-four rem. Measured in Chromium: one column at three seventy-five, two at eight hundred, three at eleven hundred.' },
  { t: '"There is no below-md prefix" — there is: max-md:', body: two(D(tsx(bo(F('src/app/max/page.tsx')), { sm: true }), tn(MAX.join('\n'), { fs: 14, wrap: 60, title: 'built CSS (real)' })),
    D(box('Measured', '<code>max-md:</code> compiles to <code>@media not all and (min-width:48rem)</code> — "below md". It has existed since Tailwind 3.2 and is in Tailwind 4.', 'do2'),
      box('Still design mobile-first', 'Start from the small screen with unprefixed classes and add <code>md:</code>/<code>lg:</code> on top. Use <code>max-*</code> for the rare "only on small screens" case.', 'xanh')), 'r64'),
    en: 'The lesson says there is no below-md prefix. There is: max-md compiles to a media query "not all and min-width forty-eight rem", below md. It exists since Tailwind three point two. Still design mobile-first, and keep max for the rare only-small-screen case.' },
  { t: 'States: hover, focus, disabled — measured', body: two(D(tsx(TTH.split('\n').slice(0, 9).join('\n') + '\n      …', { sm: true, hl: [4, 5] }),
      tn([`hover:bg-blue-700 ⇒ ${luat('hover:bg-blue-700')}`, `disabled:opacity-50 ⇒ ${luat('disabled:opacity-50')}`, '# Chromium · getComputedStyle', `#a background   ${TT.nen}`, `#a after hover  ${TT.hover}`, `#a after Tab    box-shadow …${TT.Tab.match(/lab\([^)]*\) 0px 0px 0px 2px/)[0]}`, `#b disabled     opacity ${TT.disabled}`].join('\n'), { fs: 13, wrap: 54, title: 'built CSS + Chromium (real)' })),
    D(B('trang-thai-hover', { url: 'mouse over "Lưu"', vp: 520, h: 140, w: 400 }), B('trang-thai-tab', { url: 'after Tab: focus (outline + 2px ring)', vp: 520, h: 140, w: 400 }),
      box('Tailwind 4 detail', '<code>hover:</code> sits inside <code>@media (hover:hover)</code>: on a phone with no mouse it never sticks after a tap.', 'lam')), 'r64'),
    en: 'States, measured. hover colon is a hover selector, and in Tailwind four it sits inside a media query hover:hover, so a tap on a phone does not leave it stuck. The background colour changed under the mouse; after Tab, focus ring two adds a two-pixel box-shadow; the disabled button has opacity zero point five.' },
  { t: 'Trap: two classes for one property', body: two(D(tsx(bo(F('src/app/xung/page.tsx')).split('\n').slice(1).join('\n'), { sm: true, hl: [4, 5, 6, 7] }),
      tn(['# Chromium · the value that won', ...THANG, '# byte offset of each rule in the built CSS', ...VT].join('\n'), { fs: 13, wrap: 64, title: 'Chromium + built CSS (real)' })),
    D(B('xung', { url: 'localhost:3000/xung', vp: 520, h: 330, w: 330 }),
      box('Read it', '<code>p-4 p-2</code> and <code>p-2 p-4</code> both give <b>16px</b>: <code>.p-4</code> comes later in the stylesheet. <code>mt-32</code> beat <code>mt-8</code>, <code>text-sm</code> beat <code>text-lg</code>. The class attribute order means nothing.', 'do2')), 'r64'),
    en: 'The trap: two classes for one property. p-4 p-2 and p-2 p-4 both measured sixteen pixels, because the p-4 rule comes later in the stylesheet. mt-32 beat mt-8, text-sm beat text-lg. The order you write in the class attribute means nothing; Tailwind\'s sort decides.' },
  { t: 'cn() = clsx + tailwind-merge: the caller wins', body: two(D(tsx(CNF, { sm: true }), tsx(HOPF.split('\n').slice(2).join('\n'), { sm: true, hl: [3, 8] })),
    D(tn(CN.join('\n'), { fs: 13, wrap: 54, title: 'npx tsx — cn() run (real)' }),
      tn(['# Chromium · base p-4, caller passes p-2', ...HOP].join('\n'), { fs: 13, wrap: 54, title: 'Chromium (real)' }),
      box('Read it', '<code>clsx</code> drops <code>false</code>; <code>twMerge</code> removes the earlier conflicting class, so the <b>last argument wins</b>. Plain string joining kept both — and the caller\'s <code>p-2</code> lost.', 'xanh')), ''),
    en: 'cn is clsx plus tailwind-merge. clsx drops the false from a condition; twMerge removes the earlier conflicting class, so the last argument wins: cn of p-2 and p-4 gives p-4. In the browser, a base component with p-4: plain string joining kept both classes and the caller\'s p-2 lost, sixteen pixels; with cn, eight pixels.' },
  { t: "The lesson's snippet, compiled: class= is not JSX", body: two(D(tsx(BAI, { sm: true }), tn(['$ npx tsc --noEmit   # snippet copied into a .tsx file', ...TSC, '$ npx tsc --noEmit   # class= → className=', ...TSC2].join('\n'), { fs: 14, wrap: 60, title: 'tsc (real)' })),
    D(box('Read it', 'The snippet is HTML-flavoured: <code>class=</code>. In a <code>.tsx</code> file it is <code>TS2322</code> — <code>class</code> is not a prop of <code>&lt;button&gt;</code> (Lesson 1.2). Write <code>className={cn(…)}</code>.', 'do2'),
      box('Where cn lives', 'One small file, <code>lib/cn.ts</code>, imported by every component that takes a <code>className</code> prop.', 'lam')), 'r64'),
    en: 'The lesson\'s snippet, compiled. It is written HTML-style with class equals. In a tsx file that is error TS two three two two: class is not a prop of button. Write className equals cn. Keep cn in one small file and import it wherever a component accepts a className.' },
  { t: 'Reading a Tailwind class string', body: icards([
      ['code', '1 · One class, one rule', '<code>p-4</code> = <code>padding: calc(var(--spacing) * 4)</code>. Know the scale, read CSS straight from the markup.'],
      ['gauge', '2 · The scale is the point', '4px steps for spacing, a palette in 11 steps. Constraints keep a team consistent.'],
      ['filter', '3 · Prefixes are conditions', '<code>md:</code> = media query · <code>hover:</code> = selector (+ hover media) · <code>dark:</code> = 13.3.'],
      ['merge', '4 · Conflicts: use cn()', 'Never rely on attribute order. One class per property, or <code>tailwind-merge</code>.'],
    ], 2),
    en: 'Reading a class string: one class is one rule; the scale is the point; prefixes are conditions — a media query or a selector; and for conflicts, never rely on order — use cn.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Utility', 'one class, one rule'), kw('--spacing', '.25rem: the 4px step'), kw('Arbitrary value', 'p-[13px] — off the scale'),
      kw('Breakpoint', 'md 48rem · lg 64rem'), kw('Mobile-first', 'unprefixed = all sizes'), kw('max-md:', 'below md (exists)'),
      kw('State variant', 'hover: focus: disabled:'), kw('cn()', 'clsx + tailwind-merge'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: utility; the spacing step; arbitrary value; breakpoint; mobile-first; max-md; state variant; and cn.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a card grid with ${c('grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}; resize and count the columns`,
      `Read the built CSS for ${c('md:grid-cols-2')} and ${c('hover:bg-blue-700')}`,
      `Put ${c('p-4 p-2')} on one element, then ${c('p-2 p-4')}; measure the padding`,
      `Write ${c('lib/cn.ts')}; pass ${c('className="p-2"')} to a ${c('p-4')} component with and without it`,
    ]), box('Keep these', `<ul><li>A class is a rule you can read</li><li>md: = min-width · max-md: = below</li><li>hover:/focus:/disabled: are selectors</li><li>Attribute order means nothing</li><li>cn() for every className prop</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the grid and count columns; read the built CSS of a breakpoint and a hover class; put two padding classes in both orders and measure; then write cn and pass p-2 to a p-4 component with and without it. Keep: a class is a rule you can read, attribute order means nothing, and use cn for every className prop.' },
];
export const slides = lamDeck({ chuong: 'Chapter 13 — Styling, Tailwind & theming', bai: '13.2' }, S);
