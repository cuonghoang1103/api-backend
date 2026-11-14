/*DU_LIEU*/
const DU_LIEU = {
 "t0-8:lich": "$ npm view tailwindcss time --json | node -e 'const t=JSON.parse(require(\"fs\").readFileSync(0));for(const v of [\"0.1.0\",\"1.0.0\",\"2.0.0\",\"3.0.0\",\"4.0.0\",\"3.4.19\",\"4.3.5\"])console.log(v.padEnd(7),t[v].slice(0,10))'\n0.1.0   2017-11-01\n1.0.0   2019-05-13\n2.0.0   2020-11-18\n3.0.0   2021-12-09\n4.0.0   2025-01-21\n3.4.19  2025-12-10\n4.3.5   2026-11-06\n$ for p in tailwindcss bootstrap; do printf '%-12s %s lượt tải/tuần\\n' $p \"$(curl -s https://api.npmjs.org/downloads/point/last-week/$p | node -e 'console.log(JSON.parse(require(\"fs\").readFileSync(0)).downloads.toLocaleString(\"vi-VN\"))')\"; done\ntailwindcss  177.145.893 lượt tải/tuần\nbootstrap    7.489.238 lượt tải/tuần",
 "t0-8:file:tw/index.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-slate-100 p-8\">\n  <div class=\"mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg\">\n    <h2 class=\"text-xl font-bold text-slate-900\">Khoá Tailwind CSS</h2>\n    <p class=\"mt-2 text-slate-600\">Từ lớp tiện ích tới hệ thiết kế.</p>\n    <button class=\"mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700\">Học ngay</button>\n  </div>\n</body></html>\n",
 "t0-8:file:tw/input.css": "@import \"tailwindcss\";\n",
 "t0-8:file:bs/index.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"bootstrap.min.css\"></head>\n<body class=\"bg-light p-5\">\n  <div class=\"card mx-auto shadow\" style=\"max-width: 24rem\">\n    <div class=\"card-body\">\n      <h2 class=\"h5 fw-bold\">Khoá Tailwind CSS</h2>\n      <p class=\"text-secondary\">Từ lớp tiện ích tới hệ thiết kế.</p>\n      <button class=\"btn btn-info text-white\">Học ngay</button>\n    </div>\n  </div>\n</body></html>\n",
 "t0-8:the": "$ npx @tailwindcss/cli -i input.css -o out.css --minify 2>&1 | tail -1\nDone in 39ms\n$ wc -c bs/bootstrap.min.css tw/out.css | sed '$d'\n  232360 bs/bootstrap.min.css\n    7420 tw/out.css\n$ for f in bs/bootstrap.min.css tw/out.css; do printf '%-22s gzip %6d byte\\n' $f $(gzip -9c $f | wc -c); done\nbs/bootstrap.min.css   gzip  30913 byte\ntw/out.css             gzip   2238 byte\n$ grep -oE '\\.[a-z][a-z0-9-]*' bs/bootstrap.min.css | sort -u | wc -l | sed 's/^ */lớp có trong bootstrap.min.css: /'\nlớp có trong bootstrap.min.css: 2032\n$ grep -oE 'class=\"[^\"]*\"' bs/index.html | sed 's/class=\"//;s/\"//' | tr ' ' '\\n' | sort -u | wc -l | sed 's/^ */lớp trang Bootstrap dùng: /'\nlớp trang Bootstrap dùng: 12\n$ grep -oE 'class=\"[^\"]*\"' tw/index.html | sed 's/class=\"//;s/\"//' | tr ' ' '\\n' | sort -u | wc -l | sed 's/^ */lớp trang Tailwind dùng: /'\nlớp trang Tailwind dùng: 20\n$ grep -oE '\\.[a-z][a-z0-9:\\\\-]*' tw/out.css | grep -vE '^\\.(sr|not-sr|com)$' | sort -u | tr '\\n' ' '; echo\n.bg-cyan-600 .bg-slate-100 .bg-white .font-bold .hover\\:bg-cyan-700:hover .max-w-sm .mt-2 .mt-4 .mx-auto .p-6 .p-8 .px-4 .py-2 .rounded-lg .rounded-xl .shadow-lg .text-slate-600 .text-slate-900 .text-white .text-xl \n$ tr '}' '\\n' < tw/out.css | grep -E '^\\.(p-6|text-xl|bg-cyan-600|mt-4)\\{' | sed 's/$/}/'\n.mt-4{margin-top:calc(var(--spacing) * 4)}\n.bg-cyan-600{background-color:var(--color-cyan-600)}\n.p-6{padding:calc(var(--spacing) * 6)}\n.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}",
 "t0-8:kho": "$ grep -A1 '\"node_modules/tailwindcss\"' package-lock.json | tail -1 | sed 's/^ *//'\n\"version\": \"3.4.19\",\n$ curl -s https://cuongthai.com/ | grep -oE '/_next/static/css/[^\"]+\\.css' | sort -u | head -3\n/_next/static/css/229003f43f8d4c54.css\n/_next/static/css/316bd18ad8701288.css\n/_next/static/css/390bc51c0bd104e8.css\n$ for u in $(curl -s https://cuongthai.com/ | grep -oE '/_next/static/css/[^\"]+\\.css' | sort -u); do curl -s https://cuongthai.com$u | wc -c; done | awk '{s+=$1} END {printf \"CSS của trang chủ cuongthai.com: %d byte\\n\", s}'\nCSS của trang chủ cuongthai.com: 705653 byte"
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tn, br, box, two, steps, kw, c, cmp, icards, meter, path } from './_twc-chung.mjs';

export const deck = { key: 'twc-00-8', code: 'TWC 0.0', title: 'What Tailwind CSS is, and why this course exists', sub: 'Section 0 · Start here (1/2)' };
const O = (k) => { const v = DU_LIEU[`t0-8:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-00-8', ten, { vp: 640, ...o });

// ── số đo (chạy thật t0-8 · Tailwind 4.3.5 CLI · Bootstrap 5.3.9 · npm registry · cuongthai.com)
const LICH = Object.fromEntries(doan('lich', 'npm view').map((l) => l.trim().split(/\s+/)));
const TAI = doan('lich', 'downloads').map((l) => l.match(/^(\S+)\s+([\d.]+)/).slice(1));
const KT = Object.fromEntries(doan('the', 'wc -c').map((l) => l.trim().split(/\s+/).reverse()));
const GZ = Object.fromEntries(doan('the', 'gzip -9c').map((l) => { const m = l.match(/^(\S+)\s+gzip\s+(\d+)/); return [m[1], m[2]]; }));
const BS_LOP = doan('the', 'bootstrap.min.css | sort')[0].match(/(\d+)$/)[1];
const BS_DUNG = doan('the', 'bs/index.html')[0].match(/(\d+)$/)[1], TW_DUNG = doan('the', 'tw/index.html')[0].match(/(\d+)$/)[1];
const TW_LOP = doan('the', 'tw/out.css | grep')[0].trim().split(' ');
const LUAT = doan('the', "tr '}'");
const PHIEN = doan('kho', 'package-lock')[0].match(/"([\d.]+)"/)[1], KHO_CSS = doan('kho', 'awk')[0].match(/(\d+) byte/)[1];
if (KT['bs/bootstrap.min.css'] !== '232360' || KT['tw/out.css'] !== '7420' || TW_LOP.length !== +TW_DUNG || PHIEN !== '3.4.19') throw new Error('số đo đổi');
// mã hiển thị = đúng mã của tệp, chỉ ngắt dòng cho vừa slide (kiểm bằng so khớp sau khi bỏ khoảng trắng)
const BS_MA = `<div class="card mx-auto shadow"
     style="max-width: 24rem">
  <div class="card-body">
    <h2 class="h5 fw-bold">Khoá Tailwind CSS</h2>
    <p class="text-secondary">Từ lớp tiện ích
      tới hệ thiết kế.</p>
    <button class="btn btn-info text-white">
      Học ngay</button>`;
const TW_MA = `<div class="mx-auto max-w-sm rounded-xl
            bg-white p-6 shadow-lg">
  <h2 class="text-xl font-bold text-slate-900">
    Khoá Tailwind CSS</h2>
  <p class="mt-2 text-slate-600">Từ lớp tiện ích
    tới hệ thiết kế.</p>
  <button class="mt-4 rounded-lg bg-cyan-600 px-4
    py-2 text-white hover:bg-cyan-700">Học ngay</button>`;
const gon = (x) => x.replace(/\s+/g, '');
if (!gon(F('bs/index.html')).includes(gon(BS_MA)) || !gon(F('tw/index.html')).includes(gon(TW_MA))) throw new Error('mã hiển thị lệch tệp');
const n = (x) => Number(x).toLocaleString('en-US');

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (1/2)', t: 'What Tailwind CSS is,<br>and why this course exists', sub: 'One card built twice — with a CSS library and with Tailwind — then weighed. The one sentence the whole course hangs on, where Tailwind came from, and what you will be able to do',
    en: 'Start here, part one. We build one card twice, with a CSS library and with Tailwind, and weigh both. Then the one sentence the whole course hangs on, where Tailwind came from, and what you will be able to do by the end.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Library vs generator: a fixed stylesheet you link, or one <b>written for your page</b></li>
    <li>The same card, measured: ${n(KT['bs/bootstrap.min.css'])} bytes vs ${n(KT['tw/out.css'])} bytes of CSS</li>
    <li>What one utility class compiles to</li>
    <li>Where Tailwind came from — release dates read from the npm registry</li>
    <li>What you will be able to do, and what you need to know first</li></ul>`,
    en: 'Five takeaways: the difference between a library you link and a generator that writes CSS for your page; the same card measured in bytes; what one utility class compiles to; where Tailwind came from, with dates read from the npm registry; and what you will be able to do, and need to know first.' },
  { t: 'The same card, two ways', body: two(D(html(BS_MA, { sm: true, hl: [1, 3, 4, 7] }), B('bs', { url: 'bs/index.html — Bootstrap 5.3.9', h: 220, w: 520 })),
      D(html(TW_MA, { sm: true, hl: [1, 2, 3, 8, 9] }), B('tw', { url: 'tw/index.html — Tailwind 4.3.5', h: 220, w: 520 })), ''),
    en: 'The same card, built two ways. On the left, Bootstrap: you link one big prepared stylesheet and use its named classes, card, card-body, btn. On the right, Tailwind: many small classes, each one job, written right on the elements. In Chromium the two look almost the same.' },
  { t: 'Measured: what each page ships as CSS', body: two(D(tn(['$ npx @tailwindcss/cli -i input.css -o out.css --minify', doan('the', '@tailwindcss/cli')[0], '$ wc -c bs/bootstrap.min.css tw/out.css', ...doan('the', 'wc -c'), '$ gzip -9c … | wc -c', ...doan('the', 'gzip -9c'), ...doan('the', 'bootstrap.min.css | sort'), ...doan('the', 'bs/index.html'), ...doan('the', 'tw/index.html')].join('\n'), { fs: 16, wrap: 64, title: 'build + measure (real)' })),
    D(meter([['bootstrap.min.css', +KT['bs/bootstrap.min.css'], '#7952b3'], ['Tailwind out.css', +KT['tw/out.css'], '#0891b2']], { don: 'bytes', nhan: 200, w: 520, fs: 18, rh: 56 }),
      box('Read it', `Bootstrap ships every one of its <b>${n(BS_LOP)}</b> classes; the page uses ${BS_DUNG}. Tailwind wrote <b>${TW_DUNG}</b> rules — exactly the ${TW_DUNG} classes in the HTML — plus its base styles. Gzipped: ${n(GZ['bs/bootstrap.min.css'])} vs ${n(GZ['tw/out.css'])} bytes.`, 'lam'),
      box('Not a verdict on Bootstrap', 'A library gives you designed components on day one; a generator gives you a vocabulary. The point here is the <b>mechanism</b>: a fixed file vs a file written for this page.', 'xanh')), 'r64'),
    en: 'Measured. The Bootstrap file is two hundred thirty-two thousand bytes and contains about two thousand classes; the page uses twelve. Tailwind built a file of seven thousand four hundred bytes containing exactly the twenty classes the page uses, plus its base styles. Gzipped, thirty-one kilobytes against two.' },
  { t: 'What Tailwind is, in one line', body: path([{ t: 'your files', s: 'index.html, *.tsx…' }, { t: 'scanner', s: 'reads them as TEXT', on: true }, { t: 'class list', s: `${TW_DUNG} words found` }, { t: 'generator', s: 'one rule per word' }, { t: 'out.css', s: `${n(KT['tw/out.css'])} bytes` }], { nhan: ['every build', 'looks like a class?', '', 'writes'] }) +
      box('The sentence the whole course hangs on', 'Tailwind reads your source files as text, collects every string that <b>looks like</b> a class name, and <b>writes</b> a stylesheet containing only those. It does not ship you a stylesheet — it writes one for your project, on every build.', 'xanh') +
      icards([['cut', 'Never written ⇒ never generated', 'A class built at runtime from pieces does not exist in the CSS (lesson 0.1).'],
        ['count', 'Size follows vocabulary', 'Reusing a class adds zero bytes; only new distinct classes add rules.'],
        ['list', 'Tailwind picks the order', 'It writes the file, so it decides which rule comes last (Chapter 3).']], 3),
    en: 'What Tailwind is, in one line. A scanner reads your files as plain text, collects every string that looks like a class name, and a generator writes one CSS rule per word it found. It does not ship you a stylesheet. It writes one for your project, every build.' },
  { t: 'What one utility class compiles to', body: css(LUAT.join('\n').replace(';line-height', ';\n  line-height'), { sm: true }) + two(D(box('One job each', '<code>mt-4</code> = one declaration, <code>bg-cyan-600</code> = one. The numbers are not magic: <code>4</code> is a step on a <b>scale</b> (<code>var(--spacing)</code> × 4), <code>600</code> a step on a colour scale. Chapter 1 teaches the scale — so you derive names instead of memorising them.', 'lam')),
    D(B('tw-hover', { url: 'hover — the same button', h: 220, w: 470, mark: [[152, 132, 101, 40, 'hover:bg-cyan-700']] }), box('A condition in a class name', '<code>hover:bg-cyan-700</code> compiled to a <code>:hover</code> rule. Chromium measured the colour change on hover. Inline <code>style=""</code> has no syntax for it (lesson 0.2).', 'xanh')), 'r64'),
    en: 'What one class compiles to. mt four is one declaration, bg cyan six hundred is one. The four is a step on a spacing scale, the six hundred a step on a colour scale, and chapter one teaches you to read those scales. And hover colon is a condition in the class name: Chromium measured the colour change. An inline style cannot do that.' },
  { t: 'Where Tailwind came from (npm registry)', body: two(D(tn(['$ npm view tailwindcss time --json  # release dates', ...doan('lich', 'npm view')].join('\n'), { fs: 15, title: 'npm registry (real)' }),
      tn(['$ curl api.npmjs.org/downloads/point/last-week/<pkg>', ...doan('lich', 'downloads')].join('\n'), { fs: 14, wrap: 60, title: 'npm downloads, last week (real)' })),
    D(cmp(['Ver.', 'What changed for you'], [
      ['0.1', 'first public release (Adam Wathan &amp; team)'],
      ['1.0', 'stable API'],
      ['2.0', 'dark mode, bigger palette'],
      ['3.0', 'on-demand engine: <b>only</b> used classes'],
      ['4.0', 'config moves into CSS (<code>@theme</code>)'],
    ]), box('Read the numbers honestly', 'Download counts include every project that pulls Tailwind in indirectly, so they measure reach, not "people who chose it". Still: ' + `${TAI[0][1]} vs ${TAI[1][1]} a week.`, 'do2')), 'r64'),
    en: 'Where it came from, read from the npm registry rather than from memory. Version zero point one on the first of November two thousand seventeen, one point zero in twenty nineteen, three point zero in December twenty twenty-one with the on-demand engine, and four point zero in January twenty twenty-five. Weekly downloads: about a hundred seventy-seven million, against seven and a half million for Bootstrap, though downloads measure reach, not choice.' },
  { t: 'Two versions you will meet', body: cmp(['', 'Tailwind 3.4', 'Tailwind 4'], [
      ['Who runs it', `cuongthai.com today (<code>${PHIEN}</code>), most tutorials`, `<code>npm i tailwindcss</code> today (<code>4.3.5</code>), new projects`],
      ['Pull it in', '<code>@tailwind base;</code> + 2 more lines', '<code>@import "tailwindcss";</code>'],
      ['Configure', '<code>tailwind.config.js</code>', '<code>@theme { … }</code> inside your CSS'],
      ['Which files are read', '<code>content: [ …globs ]</code>', 'everything not git-ignored'],
      ['CLI', '<code>npx tailwindcss</code>', '<code>npx @tailwindcss/cli</code>'],
    ]) + box('How this course handles it', `The written lessons measure the real app this site runs (Tailwind ${PHIEN}). The videos run <b>both</b>: Tailwind 4 for anything you start today, 3.4 where the lesson is about the existing app. Every difference is pointed out where it bites.`, 'lam'),
    en: 'Two versions you will meet. Tailwind three point four is what cuongthai.com runs today and what most tutorials show. Tailwind four is what npm installs today. They pull Tailwind in differently, configure differently, and even the command-line tool has a different name. The written lessons measure this site\'s real app; the videos run both and point out every difference where it matters.' },
  { t: 'What you will be able to do', body: icards([
      ['gauge', 'Read the scale', 'Derive any spacing, colour or size class from a rule instead of searching the docs (Ch. 1).'],
      ['bolt', 'Style conditionally', 'hover, focus, breakpoints, dark mode — and what they compile to (Ch. 2).'],
      ['merge', 'Win conflicts on purpose', 'Know which of two competing classes applies, and why (Ch. 3–4).'],
      ['wrench', 'Configure the generator', 'Extend the theme, theme with CSS variables, use layers (Ch. 5–7).'],
      ['search', 'Diagnose "my class does nothing"', 'One grep of the built CSS splits the causes in half (Ch. 8–10).'],
      ['eye', 'Ship it well', 'Measure output size and accessibility on a real app (Ch. 8–9).'],
    ], 2),
    en: 'What you will be able to do: read the scale and derive class names; style conditionally with hover, focus, breakpoints and dark mode; win conflicts on purpose; configure the generator; diagnose a class that does nothing with one grep of the built CSS; and ship well, measuring size and accessibility on a real app.' },
  { t: 'Measured on a real app: this site', body: two(D(tn(['$ grep -A1 \'"node_modules/tailwindcss"\' frontend/package-lock.json', ...doan('kho', 'package-lock'), '$ curl -s https://cuongthai.com/ | grep -oE \'/_next/static/css/[^"]+\\.css\'', ...doan('kho', 'head -3'), '…', '$ curl each file | wc -c  (sum)', ...doan('kho', 'awk')].join('\n'), { fs: 15, wrap: 62, title: 'cuongthai.com, today (real)' })),
    D(box('Why measure a real app', `Toy pages prove nothing about scale. The written lessons count classes in this site\'s own <code>frontend/</code> — thousands of components — so every claim is checkable.`, 'lam'),
      box('A first surprise', `The home page loads <b>${n(KHO_CSS)} bytes</b> of CSS — far more than our ${n(KT['tw/out.css'])}-byte card. Where those bytes come from, and whether it matters after gzip, is Chapter 8.`, 'do2')), 'r64'),
    en: 'And on a real app: this site. cuongthai.com runs Tailwind three point four point nineteen. Its home page loads about seven hundred thousand bytes of CSS, far more than our card. Where those bytes come from, and whether it matters after compression, is chapter eight. The written lessons count classes in this site\'s own frontend, so every claim can be checked.' },
  { t: 'Who this course is for', body: two(D(steps([
      `You can write basic HTML: elements, attributes, ${c('class')}`,
      `You know some CSS: ${c('padding')}, ${c('color')}, a class selector, roughly what the cascade is`,
      'You can open a terminal and run a command',
      `React is <b>not</b> required — examples use ${c('className')}, that is all`,
    ])), D(box('Missing a piece?', 'Web Foundations 3.1–3.5 (CSS basics, box model, flexbox, grid, responsive) is the plain CSS this course sits on. Part 2 of "Start here" lists exactly what to check first.', 'xanh'),
      box('Not covered here', 'Routing, server components (Next.js course), types (TypeScript course). This course is the layer in between: a generator and where it leaks.', 'lam')), ''),
    en: 'Who this course is for. You can write basic HTML and some CSS, you can run a command in a terminal, and you do not need React: the examples just use className. If a piece is missing, the Web Foundations course, lessons three point one to three point five, is the plain CSS everything here sits on.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Utility class', 'small, one job: p-4, flex'), kw('CSS library', 'a fixed stylesheet you link (Bootstrap)'),
      kw('Generator', 'writes CSS from the classes it finds'), kw('Scanner', 'reads your files as plain text'),
      kw('Scale', 'the fixed steps names come from'), kw('Variant', 'a condition prefix: hover:, md:'),
      kw('Utility-first', 'compose utilities in the markup'), kw('Built CSS', 'the generated file — grep it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: utility class; CSS library; generator; scanner; scale; variant; utility-first; and the built CSS, the file you will grep again and again.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Make a folder, ${c('npm i tailwindcss @tailwindcss/cli')}, write ${c('@import "tailwindcss";')} in ${c('input.css')}`,
      `Write a small card in ${c('index.html')}, run ${c('npx @tailwindcss/cli -i input.css -o out.css')}`,
      `Open ${c('out.css')}: find one rule per class you wrote — and none you did not`,
      `Add one class, build again, and ${c('wc -c out.css')}: what changed?`,
    ]), box('Keep these', '<ul><li>Tailwind <b>generates</b> CSS; it is not a library</li><li>It reads your files as text</li><li>Only classes it finds exist</li><li>Names come from a scale</li><li>Check the built CSS</li></ul>', 'lam'), ''),
    en: 'Your turn: install Tailwind four in an empty folder, write a small card, build it, and open the output: one rule per class you wrote, none you did not. Add a class, build again and compare the size. Keep: Tailwind generates CSS, reads your files as text, and only classes it finds exist.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Tailwind actually is', bai: 'Start here 1/2' }, S);
