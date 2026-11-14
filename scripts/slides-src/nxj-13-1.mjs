/*DU_LIEU*/
const DU_LIEU = {
 "n13-1:khung": "$ grep -E '\"(next|tailwindcss|@tailwindcss/[a-z]+)\"' package.json      # create-next-app 16.4.6, chọn Tailwind = Yes\n    \"next\": \"16.4.6\",\n    \"@tailwindcss/turbopack\": \"4.3.3\",\n    \"tailwindcss\": \"4.3.3\",\n$ head -1 src/app/globals.css\n@import \"tailwindcss\";\n$ ls tailwind.config.* postcss.config.* 2>&1 | sed 's/^ls: //'\npostcss.config.*: No such file or directory\ntailwind.config.*: No such file or directory\n$ grep -A5 'turbopack' next.config.ts | sed -n '2,5p'\n    rules: {\n      \"*.css\": {\n        loaders: [\"@tailwindcss/turbopack\"],\n        as: \"*.css\",",
 "n13-1:file:src/app/globals.css": "@import \"tailwindcss\";\n\n:root {\n  --background: #ffffff;\n  --foreground: #171717;\n}\n\n@theme inline {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --font-sans: var(--font-geist-sans);\n  --font-mono: var(--font-geist-mono);\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --background: #0a0a0a;\n    --foreground: #ededed;\n  }\n}\n\nbody {\n  background: var(--background);\n  color: var(--foreground);\n  font-family: Arial, Helvetica, sans-serif;\n}\n\n/* 1 · global CSS: một phạm vi chung cho CẢ ứng dụng */\n.nut-global { border-radius: 8px; background: #2563eb; padding: 8px 16px; color: #fff; }\n.nut-global:hover { background: #1d4ed8; }\n",
 "n13-1:file:src/app/nut/Nut.module.css": "/* 2 · CSS Module: tên lớp chỉ có nghĩa trong tệp này */\n.nut { border-radius: 8px; background: #2563eb; padding: 8px 16px; color: #fff; }\n.nut:hover { background: #1d4ed8; }\n",
 "n13-1:file:src/app/nut/page.tsx": "// app/nut/page.tsx — CÙNG một cái nút, tô bằng bốn cách\nimport styles from './Nut.module.css';\n\nexport default function Trang() {\n  return (\n    <main className=\"flex flex-col items-start gap-4 p-6 text-xl\">\n      <button className=\"nut-global\">1 · global CSS</button>\n      <button className={styles.nut}>2 · CSS Module</button>\n      <button className=\"rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700\">3 · Tailwind</button>\n      <button style={{ borderRadius: 8, background: '#2563eb', padding: '8px 16px', color: '#fff' }}>4 · inline style</button>\n    </main>\n  );\n}\n",
 "n13-1:ba-cach": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/nut'\n✓ Compiled successfully in 2.9s\n└ ○ /nut\n$ curl -s localhost:3000/nut | grep -o '<button[^>]*>'      # bốn cái nút trong HTML thật\n<button class=\"nut-global\">\n<button>\n<button class=\"rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700\">\n<button style=\"border-radius:8px;background:#2563eb;padding:8px 16px;color:#fff\">\n$ find .next/static -name '*.css' | xargs wc -c      # tệp CSS sau build\n     101 0676obh1g-k3z.css\n   15346 0zyhz5aaj7ylm.css\n   15447 total\n$ for s in '.nut-global{' '.nut{' '.bg-blue-600{' '.hover\\:bg-blue-700:hover{'; do printf '%-27s %s\\n' \"$s\" \"$(cat .next/static/chunks/*.css | grep -cF \"$s\") tệp CSS có\"; done\n.nut-global{                1 tệp CSS có\n.nut{                       1 tệp CSS có\n.bg-blue-600{               1 tệp CSS có\n.hover\\:bg-blue-700:hover{  1 tệp CSS có",
 "n13-1:module": "$ grep -n 'as:' next.config.ts      # dòng create-next-app tự thêm\n9:        as: \"*.css\",\n$ sed -i '' '/as: \"\\*.css\",/d' next.config.ts      # xoá dòng 9\ndòng as: còn 0\n$ npm run build 2>&1 | grep -E 'Compiled|/nut'\n✓ Compiled successfully in 298ms\n└ ○ /nut\n$ curl -s localhost:3000/nut | grep -o '<button[^>]*>' | sed -n 2p\n<button class=\"u-Rnhq_nut\">\n$ cat .next/static/chunks/*.css | grep -oE '\\.[A-Za-z0-9_-]*nut\\{[^}]*\\}' | head -2\n.u-Rnhq_nut{color:#fff;background:#2563eb;border-radius:8px;padding:8px 16px}",
 "n13-1:quet": "$ grep -oE -- '--color-[a-z]+-[0-9]+:' node_modules/tailwindcss/theme.css | wc -l | sed 's/^ */màu có sẵn trong bảng của Tailwind 4.3.3: /'\nmàu có sẵn trong bảng của Tailwind 4.3.3: 286\n$ cat .next/static/chunks/*.css | grep -oE '\\.bg-[a-z]+-[0-9]+' | sort -u | tr '\\n' ' '; echo\n.bg-blue-600 .bg-zinc-50 \n$ cat .next/static/chunks/*.css | grep -oE '\\.(bg|text)-(pink|lime)-500' | sort -u | wc -l | sed 's/^ */lớp pink\\/lime trong CSS: /'\nlớp pink/lime trong CSS: 0\n$ echo 'Màu thương hiệu: bg-pink-500' >> README.md      # lớp chỉ nằm trong README\n$ mkdir build && echo '<div class=\"bg-lime-500\">' > build/nhap.html      # thư mục /build có trong .gitignore\n/build\n$ npm run build 2>&1 | grep -E 'Compiled'\n✓ Compiled successfully in 466ms\n$ for s in '.bg-pink-500{' '.bg-lime-500{'; do printf '%-16s %s\\n' \"$s\" \"$(cat .next/static/chunks/*.css | grep -cF \"$s\")\"; done\n.bg-pink-500{    1\n.bg-lime-500{    0\n$ sed -i '' '1a\\'$'\\n''@source \"../../build\";' src/app/globals.css      # chỉ đích danh thư mục bị bỏ qua\n@import \"tailwindcss\";\n@source \"../../build\";\n$ npm run build 2>&1 | grep -E 'Compiled'\n✓ Compiled successfully in 264ms\n$ for s in '.bg-pink-500{' '.bg-lime-500{'; do printf '%-16s %s\\n' \"$s\" \"$(cat .next/static/chunks/*.css | grep -cF \"$s\")\"; done\n.bg-pink-500{    1\n.bg-lime-500{    1",
 "n13-1:file:src/app/mau/page.tsx": "// app/mau/page.tsx — BẪY: ghép tên lớp từ một biến\nconst mau = 'red';   // giả sử đến từ props / cơ sở dữ liệu\n\nexport default function Trang() {\n  return <p id=\"sai\" className={`text-${mau}-500 p-6 text-3xl font-bold`}>Chữ này phải màu đỏ</p>;\n}\n",
 "n13-1:dong": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/mau'\n✓ Compiled successfully in 484ms\n├ ○ /mau\n$ curl -s localhost:3000/mau | grep -o '<p id=\"sai\"[^>]*>'      # lớp CÓ trong DOM\n<p id=\"sai\" class=\"text-red-500 p-6 text-3xl font-bold\">\n$ printf '%-16s %s\\n' '.text-red-500{' \"$(cat .next/static/chunks/*.css | grep -cF '.text-red-500{') tệp CSS có\"\n.text-red-500{   0 tệp CSS có\n$ Chromium: getComputedStyle(#sai).color\nmau-sai · {\"mau\":\"rgb(23, 23, 23)\"}",
 "n13-1:file:src/app/mau2/page.tsx": "// app/mau2/page.tsx — SỬA: bảng tra viết TRỌN tên lớp\nconst LOP = { red: 'text-red-500', green: 'text-green-600' } as const;\nconst mau: keyof typeof LOP = 'red';\n\nexport default function Trang() {\n  return <p id=\"dung\" className={`${LOP[mau]} p-6 text-3xl font-bold`}>Chữ này phải màu đỏ</p>;\n}\n",
 "n13-1:file:src/app/mau3/page.tsx": "// app/mau3/page.tsx — bộ quét đọc CHỮ THUẦN: một chú thích cũng sinh lớp\n// text-amber-500 (chỉ nằm trong chú thích này, không phần tử nào dùng)\nexport default function Trang() {\n  return <p className=\"p-6 text-3xl\">mau3</p>;\n}\n",
 "n13-1:dong2": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/mau'\n✓ Compiled successfully in 480ms\n├ ○ /mau\n├ ○ /mau2\n├ ○ /mau3\n$ for s in '.text-red-500{' '.text-green-600{' '.text-amber-500{'; do printf '%-18s %s\\n' \"$s\" \"$(cat .next/static/chunks/*.css | grep -cF \"$s\") tệp CSS có\"; done\n.text-red-500{     1 tệp CSS có\n.text-green-600{   1 tệp CSS có\n.text-amber-500{   1 tệp CSS có\n$ Chromium: /mau2 (bảng tra) và /mau (vẫn mã ghép biến, KHÔNG sửa)\nmau-dung    · {\"mau\":\"lab(55.4814 75.0732 48.8528)\"}\nmau-sai-sau · {\"mau\":\"lab(55.4814 75.0732 48.8528)\"}",
 "n13-1:file:tailwind.config.js": "// tailwind.config.js — Tailwind 3: PHẢI liệt kê tệp cần quét\nmodule.exports = {\n  content: ['./app/**/*.{js,jsx}'],\n};\n",
 "n13-1:file:postcss.config.js": "module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n",
 "n13-1:file:app/globals.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
 "n13-1:file:app/layout.jsx": "import './globals.css';\nexport default function RootLayout({ children }) {\n  return <html lang=\"vi\"><body style={{ fontFamily: 'sans-serif' }}>{children}</body></html>;\n}\n",
 "n13-1:file:lib/mau.js": "// lib/mau.js — bảng màu huy hiệu nằm NGOÀI thư mục app/\nexport const HUY_HIEU = { Shell: 'bg-lime-500/20 text-lime-700 border border-lime-500' };\n",
 "n13-1:file:app/huy/page.jsx": "import { HUY_HIEU } from '../../lib/mau';\nexport default function Trang() {\n  return <p className=\"p-6 text-2xl\"><span id=\"huy\" className={HUY_HIEU.Shell}>Shell</span></p>;\n}\n",
 "n13-1:v3": "$ grep -E '\"(next|tailwindcss)\"' package.json      # cùng bộ với cuongthai.com: Next 14.2 + Tailwind 3.4\n    \"next\": \"14.2.35\",\n    \"tailwindcss\": \"^3.4.19\"\n$ npm run build 2>&1 | grep -E 'Compiled|/huy'\n ✓ Compiled successfully\n└ ○ /huy                                 154 B          87.4 kB\n$ for s in '.bg-lime-500\\/20{' '.text-lime-700{' '.border-lime-500{'; do printf '%-20s %s\\n' \"$s\" \"$(cat .next/static/css/*.css | grep -cF \"$s\")\"; done\n.bg-lime-500\\/20{    0\n.text-lime-700{      0\n.border-lime-500{    0\n$ content: ['./app/**/*.{js,jsx}', './lib/**/*.js']      # thêm thư mục lib/\n  content: ['./app/**/*.{js,jsx}', './lib/**/*.js'],\n$ npm run build 2>&1 | grep -E 'Compiled'\n ✓ Compiled successfully\n$ for s in '.bg-lime-500\\/20{' '.text-lime-700{' '.border-lime-500{'; do printf '%-20s %s\\n' \"$s\" \"$(cat .next/static/css/*.css | grep -cF \"$s\")\"; done\n.bg-lime-500\\/20{    1\n.text-lime-700{      1\n.border-lime-500{    1",
 "n13-1:kho": "$ grep -E '\"(next|tailwindcss)\"' package.json\n    \"next\": \"^14.2.15\",\n    \"tailwindcss\": \"^3.4.14\",\n$ sed -n '4,8p' tailwind.config.ts      # content KHÔNG có ./src/lib\n  content: [\n    \"./src/pages/**/*.{js,ts,jsx,tsx,mdx}\",\n    \"./src/components/**/*.{js,ts,jsx,tsx,mdx}\",\n    \"./src/app/**/*.{js,ts,jsx,tsx,mdx}\",\n  ],\n$ sed -n '22p' src/lib/repos.ts\n  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',\n$ python3 doi-css.py      # mọi lớp trong src/lib/*.ts so với CSS THẬT của cuongthai.com hôm nay\nCSS prod: 705.624 byte\nsrc/lib/linkify.tsx: 1 lớp · VẮNG trong CSS prod: 0\nsrc/lib/repos.ts: 47 lớp · VẮNG trong CSS prod: 7 → bg-indigo-500/20 bg-lime-500/20 bg-pink-500/20 border-lime-500/30 border-pink-500/30 text-lime-300 text-yellow-200\nsrc/lib/studio-meta.ts: 18 lớp · VẮNG trong CSS prod: 1 → ring-cyan-500/30",
 "anh-nxj-13-1:nut-hong": {
  "url": "http://127.0.0.1:19395/nut",
  "vp": [
   560,
   300
  ],
  "rect": {
   "button:nth-of-type(2)": [
    24,
    84,
    141,
    28
   ]
  },
  "console": [],
  "ketQua": {
   "nut": "[{\"lop\":\"nut-global\",\"nen\":\"rgb(37, 99, 235)\"},{\"lop\":\"(không có)\",\"nen\":\"rgba(0, 0, 0, 0)\"},{\"lop\":\"rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700\",\"nen\":\"lab(44.0605 29.0279 -86.0352)\"},{\"lop\":\"(không có)\",\"nen\":\"rgb(37, 99, 235)\"}]"
  }
 },
 "anh-nxj-13-1:nut": {
  "url": "http://127.0.0.1:19395/nut",
  "vp": [
   560,
   300
  ],
  "rect": {
   "button:nth-of-type(2)": [
    24,
    84,
    173,
    44
   ]
  },
  "console": [],
  "ketQua": {
   "nut": "[{\"lop\":\"nut-global\",\"nen\":\"rgb(37, 99, 235)\"},{\"lop\":\"u-Rnhq_nut\",\"nen\":\"rgb(37, 99, 235)\"},{\"lop\":\"rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700\",\"nen\":\"lab(44.0605 29.0279 -86.0352)\"},{\"lop\":\"(không có)\",\"nen\":\"rgb(37, 99, 235)\"}]"
  }
 },
 "anh-nxj-13-1:mau-sai": {
  "url": "http://127.0.0.1:19395/mau",
  "vp": [
   560,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "mau": "rgb(23, 23, 23)"
  }
 },
 "anh-nxj-13-1:mau-dung": {
  "url": "http://127.0.0.1:19395/mau2",
  "vp": [
   560,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "mau": "lab(55.4814 75.0732 48.8528)"
  }
 },
 "anh-nxj-13-1:mau-sai-sau": {
  "url": "http://127.0.0.1:19395/mau",
  "vp": [
   560,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "mau": "lab(55.4814 75.0732 48.8528)"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, css, tn, br, box, two, steps, kw, c, cmp, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-13-1', code: 'NXJ 13.1', title: 'Styling options, and why Tailwind', sub: 'Chapter 13 · Lesson 13.1' };
const O = (k) => { const v = DU_LIEU[`n13-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-13-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ app\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-13-1', ten, { vp: 560, ...o });

// ── số đo (chạy thật n13-1 · Next.js 16.4.6 + Tailwind 4.3.3, và Next 14.2.35 + Tailwind 3.4.19)
const KHUNG = O('khung');
const NUT_HTML = doan('ba-cach', "grep -o '<button");
const CSS_KT = doan('ba-cach', 'xargs wc -c');
const CSS_CO = doan('ba-cach', "for s in '.nut-global{'");
const MOD_SAU = doan('module', "sed -n 2p")[0], MOD_CSS = doan('module', 'nut\\{')[0];
const PAL = O('quet').split('\n')[1].match(/: (\d+)$/)[1];
const BG = doan('quet', "grep -oE '\\.bg-")[0].trim();
const QL = O('quet').split('\n').filter((l) => /^\.bg-(pink|lime)-500\{/.test(l)); const QA = QL.slice(0, 2), QB = QL.slice(2);
if (!/0$/.test(QA[1]) || !/1$/.test(QB[1])) throw new Error('quét đổi');
const SAI_DOM = doan('dong', "id=\"sai\"")[0], SAI_CSS = doan('dong', "printf '%-16s")[0];
const D2 = doan('dong2', "'.text-red-500{' '.text-green-600{'");
const KHO = doan('kho', 'python3');
const MS = A('mau-sai').ketQua.mau, MD = A('mau-dung').ketQua.mau, MSS = A('mau-sai-sau').ketQua.mau;
const NUTH = JSON.parse(A('nut-hong').ketQua.nut), NUT = JSON.parse(A('nut').ketQua.nut);
if (NUT_HTML[1] !== '<button>' || !/u-\w+_nut/.test(MOD_SAU) || NUTH[1].lop !== '(không có)' || NUT[1].lop === '(không có)') throw new Error('CSS Module đổi');
if (!/0 tệp/.test(SAI_CSS) || MS !== 'rgb(23, 23, 23)' || MSS !== MD || !D2.every((l) => /1 tệp/.test(l))) throw new Error('lớp động đổi');
if (!/VẮNG trong CSS prod: 7/.test(KHO.join('\n'))) throw new Error('kho đổi');
const v3 = O('v3').split('\n');
const V3A = v3.slice(v3.findIndex((l) => l.includes("printf '%-20s")) + 1, v3.findIndex((l) => l.includes("printf '%-20s")) + 4);
const V3B = v3.slice(-3);
if (!V3A.every((l) => /0$/.test(l)) || !V3B.every((l) => /1$/.test(l))) throw new Error('v3 đổi');

const PAGE = bo(F('src/app/nut/page.tsx'))
  .replace('<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">3 · Tailwind</button>', '<button className="rounded-lg bg-blue-600 px-4 py-2\n        text-white hover:bg-blue-700">3 · Tailwind</button>')
  .replace("<button style={{ borderRadius: 8, background: '#2563eb', padding: '8px 16px', color: '#fff' }}>4 · inline style</button>", "<button style={{ borderRadius: 8, background: '#2563eb',\n        padding: '8px 16px', color: '#fff' }}>4 · inline style</button>");
const ngat = (s) => s.replace(/return <p (id="\w+") className=\{(`[^`]+`)\}>/, 'return <p $1\n    className={$2}>\n    ');
const MOD = F('src/app/nut/Nut.module.css');
const GLOB = F('src/app/globals.css').split('\n').slice(-3).join('\n');
const DUNG_HIEN = (x) => x.replace("{ red: 'text-red-500', green: 'text-green-600' } as const", "{\n  red: 'text-red-500',\n  green: 'text-green-600',\n} as const");
const SAI = ngat(bo(F('src/app/mau/page.tsx'))), DUNG = DUNG_HIEN(ngat(bo(F('src/app/mau2/page.tsx'))));

export const S = [
  { cover: true, nhan: 'Chapter 13 · Lesson 13.1 · Stage 4 begins', t: 'Styling options,<br>and why Tailwind', sub: 'One button styled four ways in a fresh Next.js 16 app — measured in the HTML and the built CSS. Plus the scanner that decides which Tailwind classes exist, and the trap it sets',
    en: 'Lesson thirteen point one opens stage four: styling. We style one button four ways in a fresh Next.js sixteen app and read the real HTML and the built CSS. Then we meet the scanner that decides which Tailwind classes exist at all, and the trap it sets.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Four ways to style: global CSS, CSS Modules, Tailwind, inline — what each puts in the HTML and the CSS</li>
    <li>A fresh <code>create-next-app</code> where CSS Modules silently do nothing — and the one-line fix</li>
    <li>How Tailwind 4 is wired: no config file, a scanner that reads your files as text</li>
    <li>The #1 Tailwind bug: a class name built from a variable</li>
    <li>Tailwind 3 (cuongthai.com): <code>content</code> globs, and 7 classes missing on the live site</li></ul>`,
    en: 'Five takeaways: the four ways to style and what each leaves in the HTML and the CSS; a fresh create-next-app where CSS Modules silently do nothing, and the one-line fix; how Tailwind four is wired, with a scanner that reads your files as text; the number one Tailwind bug, a class name built from a variable; and Tailwind three\'s content globs, with seven classes missing on cuongthai.com today.' },
  { t: 'One button, four ways', body: tsx(PAGE, { sm: true, hl: [6, 7, 8, 10] }) + css(MOD + '\n' + GLOB, { sm: true }),
    en: 'One button, four ways. One: a class written in globals dot css, one global scope for the whole app. Two: a CSS Module, a file whose classes are imported as an object. Three: Tailwind utility classes right in the markup. Four: an inline style object.' },
  { t: 'Measured: the HTML and the built CSS', body: two(D(tn(['$ curl -s localhost:3000/nut | grep -o \'<button[^>]*>\'', ...NUT_HTML, '$ wc -c .next/static/chunks/*.css', ...CSS_KT, ...CSS_CO].join('\n'), { fs: 13, wrap: 60, title: 'curl + build output (real)' })),
    D(B('nut-hong', { url: 'localhost:3000/nut', h: 250, w: 470, mark: [[18, 78, 155, 38, '']] }),
      box('Read it', 'Button 2 has <b>no class at all</b>, and the CSS contains a plain <code>.nut{…}</code> — the module was not scoped, and <code>styles.nut</code> is <code>undefined</code>. tsc stays green: a module\'s type is "any string key".', 'do2')), 'r64'),
    en: 'Measured. The global class and the Tailwind classes are in the HTML, the inline style is in the HTML too. But button two has no class at all, and the CSS contains a plain dot nut rule, not a scoped one. styles dot nut is undefined, and tsc stays green, because a CSS module is typed as any string key.' },
  { t: 'The template line that broke CSS Modules', body: two(D(tn(KHUNG.split('\n').slice(-5).join('\n'), { fs: 15, title: 'next.config.ts — as generated (real)' }),
      tn(O('module').split('\n').slice(0, 4).concat(O('module').split('\n').slice(-4)).join('\n'), { fs: 14, wrap: 58, title: 'fix + rebuild (real)' })),
    D(B('nut', { url: 'after deleting as: "*.css"', h: 270, w: 450, mark: [[18, 80, 182, 52, '']] }),
      box('Why', '<code>create-next-app 16.4.6</code> routes every <code>*.css</code> through the Tailwind loader <em>as</em> plain CSS — <code>.module.css</code> included, so it stops being a module. The Tailwind loader\'s own README has no <code>as</code> line. Delete it: modules are hashed again, Tailwind still works (also checked with 4.3.5).', 'xanh')), 'r64'),
    en: 'The cause is one line create-next-app generated: the turbopack rule sends every css file through the Tailwind loader as plain css, including module files, so they stop being modules. The loader\'s own README has no such line. Delete it, rebuild: the button gets a hashed class, and Tailwind still works. We also checked the newer loader, four point three point five: same behaviour.' },
  { t: 'How Tailwind is wired: version 3 vs version 4', body: cmp(['', 'Tailwind 3 (cuongthai.com: Next 14.2 + 3.4)', 'Tailwind 4 (this course: Next 16.4.6 + 4.3.3)'], [
      ['Pull Tailwind in', '<code>@tailwind base; @tailwind components; @tailwind utilities;</code>', '<code>@import "tailwindcss";</code>'],
      ['Which files are scanned', '<code>content: [...]</code> globs in <code>tailwind.config</code> — <b>only</b> those', 'every file in the project, except <code>.gitignore</code>d, <code>node_modules</code>, CSS, binaries'],
      ['Add or remove a source', 'edit <code>content</code>', '<code>@source "../path";</code> / <code>@source not …</code> in CSS'],
      ['Build hook', '<code>postcss.config.js</code>', '<code>@tailwindcss/turbopack</code> loader (or <code>@tailwindcss/postcss</code>)'],
      ['Config file', '<code>tailwind.config.js</code>', 'none — <code>@theme</code> in CSS (13.4)'],
    ]) + box('Measured', `<code>ls tailwind.config.* postcss.config.*</code> in the fresh app: <em>No such file or directory</em> for both. The lesson's "content globs" advice is Tailwind 3 — still exactly right for cuongthai.com.`, 'lam'),
    en: 'How Tailwind is wired depends on the major version. Tailwind three, which cuongthai.com runs, uses three at-tailwind directives and scans only the files listed in content globs. Tailwind four, in this course\'s app, is one import line, has no config file, and scans every file in the project except git-ignored ones, node modules, CSS and binaries. You add a source with at-source in CSS.' },
  { t: 'The scanner keeps only what it can see', body: two(D(tn(['$ grep -oE "\\.bg-[a-z]+-[0-9]+" <built CSS> | sort -u', BG, "$ echo 'bg-pink-500' >> README.md", "$ echo '<div class=\"bg-lime-500\">' > build/nhap.html  # /build: git-ignored", '$ npm run build && grep <built CSS>', ...QA, '$ sed -i \'1a @source "../../build";\' src/app/globals.css', '$ npm run build && grep <built CSS>', ...QB].join('\n'), { fs: 14, wrap: 62, title: 'build + grep the CSS (real)' })),
    D(box('Read it', `After the build the CSS holds exactly two <code>bg-*</code> colours: <code>${BG}</code> — the ones written in the source. Out of ${PAL} in the palette.`, 'lam'),
      box('It reads text, not code', 'A class that only sits in <code>README.md</code> was generated. One in <code>/build</code> (git-ignored) was not — until <code>@source "../../build"</code>.', 'xanh'),
      box('Tailwind 4 skips', '<code>.gitignore</code>d paths · <code>node_modules</code> · CSS files · binaries · lockfiles', 'do2')), 'r64'),
    en: 'The scanner keeps only what it can see. After the build, the CSS holds exactly two background colours, the two written in the source, out of two hundred eighty-six in the palette. And it reads text, not code: a class that only sits in the README was generated; one in a git-ignored folder was not, until we pointed at-source at it.' },
  { t: 'Trap: a class name built from a variable', body: two(D(tsx(SAI, { sm: true, hl: [4] }), tn(['$ curl -s localhost:3000/mau | grep -o \'<p id="sai"[^>]*>\'', SAI_DOM, '$ grep -cF \'.text-red-500{\' .next/static/chunks/*.css', SAI_CSS, `# Chromium · getComputedStyle(#sai).color`, MS].join('\n'), { fs: 13, wrap: 60, title: 'curl + build + Chromium (real)' })),
    D(B('mau-sai', { url: 'localhost:3000/mau', h: 110, w: 470 }),
      box('Read it', 'The class <b>is</b> in the DOM. It is <b>not</b> in the stylesheet: the scanner saw <code>text-</code>, <code>${mau}</code>, <code>-500</code> — never the word <code>text-red-500</code>. The text stays the body colour <code>rgb(23, 23, 23)</code>. No error anywhere.', 'do2'),
      box('What the scanner read', '<code>text-</code> · <code>-500</code> · <code>p-6</code> · <code>text-3xl</code> · <code>font-bold</code> ⇒ rules for the last three only.', 'lam')), 'r64'),
    en: 'The trap: a class name built from a variable. The class text red five hundred is in the DOM, but not in the stylesheet, because the scanner never saw that word, only its pieces. Chromium paints the paragraph in the body colour, twenty-three twenty-three twenty-three. No error anywhere.' },
  { t: 'The fix — and why the bug can hide', body: two(D(tsx(DUNG, { sm: true, hl: [1, 2, 3, 4] }), tn(['$ npm run build   # + /mau2 (lookup) and /mau3 (a comment)', ...D2, '# Chromium · getComputedStyle().color', `/mau2 (lookup)          ${MD}`, `/mau  (unchanged)       ${MSS}`].join('\n'), { fs: 13, wrap: 52, title: 'build + Chromium (real)' })),
    D(B('mau-dung', { url: 'localhost:3000/mau2', h: 110, w: 470 }),
      box('Write whole names', 'A lookup object spells every class out, so the scanner sees it. Even a <b>comment</b> generated <code>text-amber-500</code>.', 'xanh'),
      box('Why it hides', 'After adding <code>/mau2</code>, the broken <code>/mau</code> turned red too — another file now mentions <code>text-red-500</code>. Delete that file and the bug comes back.', 'do2')), 'r64'),
    en: 'The fix is a lookup object that spells every class out. And why the bug hides: after adding the lookup page, the broken page turned red too, because another file now mentions the full name. Delete that file, and the bug comes back. Even a comment generates a class: the scanner reads text.' },
  { t: 'Tailwind 3: the content globs decide', body: two(D(tsx(F('tailwind.config.js') + '\n\n' + F('lib/mau.js'), { sm: true, hl: [3] }),
      tn(['$ npm run build  # Next 14.2.35 + Tailwind 3.4.19', ...V3A, "# content: ['./app/**/*.{js,jsx}', './lib/**/*.js']", ...V3B].join('\n'), { fs: 14, title: 'build + grep the CSS (real)' })),
    D(box('Read it', 'Tailwind 3 scans <b>only</b> the globs. A class map in <code>lib/</code>, outside <code>./app</code>, produced 0 rules. Add the folder to <code>content</code>: 1, 1, 1.', 'lam'),
      box('First check when "my class does nothing"', 'Is the file (Tailwind 3) in <code>content</code>, or (Tailwind 4) git-ignored? Then: is the class written out whole?', 'xanh')), 'r64'),
    en: 'Tailwind three, the version cuongthai.com runs, scans only the content globs. A colour map in a lib folder outside app produced zero rules. Add the folder to content and all three classes appear. So the first check when a class does nothing: is the file scanned, and is the class written out whole?' },
  { t: 'cuongthai.com today: 7 classes that do not exist', body: two(D(tn(O('kho'), { fs: 13, wrap: 64, title: 'frontend/ + live CSS of cuongthai.com (real)' })),
    D(box('What happened', '<code>src/lib/repos.ts</code> maps languages to badge classes. <code>tailwind.config.ts</code> scans <code>src/pages</code>, <code>src/components</code>, <code>src/app</code> — not <code>src/lib</code>. Classes that appear only there are absent from the live CSS.', 'do2'),
      box('Effect', 'Shell (<code>lime</code>) loses all three colours; Swift/C++ (<code>pink</code>) and C# (<code>indigo</code>) lose their background; JavaScript loses its text colour. No error, no warning — exactly the trap above.', 'lam')), 'r64'),
    en: 'And on this course\'s own site, today. A file in src lib maps programming languages to badge classes, but the Tailwind config does not scan src lib. Measured against the live CSS: seven of those classes do not exist. The Shell badge has no colour at all, Swift, C plus plus and C sharp lose their background, and nothing ever reported it.' },
  { t: 'Why this course uses Tailwind', body: icards([
      ['code', 'Tailwind utilities', 'No names to invent; styles live on the element and leave with it. Only used classes are generated (15 KB here). Cost: long class strings.'],
      ['layers', 'CSS Modules', 'Real CSS, scoped per file (a hashed name). Good for complex selectors and animations. Cost: two files per component.'],
      ['page', 'Global CSS', 'One scope for the whole app: resets, fonts, CSS variables (13.4). Not for component styles — names collide.'],
      ['bolt', 'CSS-in-JS / inline', 'Runtime libraries need <code>\'use client\'</code> and ship JS. Inline <code>style</code> cannot do <code>:hover</code> or media queries.'],
    ], 2) + box('The real mix', 'Tailwind for components + a small <code>globals.css</code> for variables and base styles — what cuongthai.com does, and what 13.3–13.5 build on.', 'xanh'),
    en: 'Why Tailwind. No names to invent, styles live on the element and leave with it, and only used classes are generated. CSS Modules give real scoped CSS, at the cost of two files per component. Global CSS is for resets and variables, not components. Runtime CSS-in-JS needs client components and ships JavaScript, and inline styles cannot do hover or media queries. The real mix is Tailwind plus a small global stylesheet.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Global CSS', 'one scope for the whole app'), kw('CSS Module', '.module.css — hashed, local names'),
      kw('Utility class', 'one job: p-4, flex, bg-blue-600'), kw('Inline style', 'a style object — no :hover'),
      kw('Scanner', 'reads files as text, emits used classes'), kw('content (v3)', 'the globs Tailwind 3 scans'),
      kw('@source (v4)', 'add a path Tailwind 4 skipped'), kw('Dynamic class name', 'text-${c}-500 — never generated'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: global CSS; CSS Module; utility class; inline style; the scanner; content globs in Tailwind three; at-source in Tailwind four; and the dynamic class name trap.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Style one button four ways in a fresh app; ${c('curl')} the HTML — does the module button have a class?`,
      `Delete ${c('as: "*.css"')} from ${c('next.config.ts')}, rebuild, read the hashed name`,
      `Write ${c('text-${c}-500')}; ${c('grep')} the built CSS; fix it with a lookup object`,
      `Put a class only in ${c('README.md')}, then only in a git-ignored folder; build and grep`,
    ]), box('Keep these', `<ul><li>Tailwind generates only classes it can read</li><li>Write class names whole — never build them</li><li>v3: <code>content</code> globs · v4: everything not ignored</li><li>Check the built CSS, not the DOM</li><li>Tailwind + a small globals.css</li></ul>`, 'lam'), ''),
    en: 'Your turn: style a button four ways and check the module button\'s class; delete the as line and read the hashed name; write a class from a variable, grep the built CSS, and fix it with a lookup; and test the scanner with the README and a git-ignored folder. Keep: Tailwind generates only what it can read; write class names whole; and check the built CSS, not the DOM.' },
];
export const slides = lamDeck({ chuong: 'Chapter 13 — Styling, Tailwind & theming', bai: '13.1' }, S);
