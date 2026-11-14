/*DU_LIEU*/
const DU_LIEU = {
 "t3-4:file:m11.cjs": "// m11.cjs — cung muoi mot lop cua bai 3.2, cho qua cn() THAT cua kho (clsx 2.1.1 + tailwind-merge 2.6.1)\nconst K = '/Users/admin/.rtq-twc/lab/kho/node_modules/';\nconst { clsx } = require(K + 'clsx'); const { twMerge } = require(K + 'tailwind-merge');\nconst cn = (...i) => twMerge(clsx(i));\nconsole.log(cn('mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32'));\n",
 "t3-4:mt11": "$ node m11.cjs\nmt-32",
 "t3-4:file:bang.cjs": "// bang.cjs — twMerge (2.6.1 cua kho) tren tung cap: no gop hay GIU CA HAI?\nconst { twMerge } = require('/Users/admin/.rtq-twc/lab/kho/node_modules/tailwind-merge');\nfor (const s of ['p-2 p-8', 'px-4 p-8', 'mt-4 mb-4 my-8', 'top-0 inset-0', 'w-4 size-8', 'block flex', 'border border-2',\n  'text-[11px] text-sm', 'text-sm text-red-500', 'bg-red-500 bg-gradient-to-r']) console.log(JSON.stringify(s).padEnd(30), '->', JSON.stringify(twMerge(s)));\n",
 "t3-4:bang": "$ node bang.cjs\n\"p-2 p-8\"                      -> \"p-8\"\n\"px-4 p-8\"                     -> \"p-8\"\n\"mt-4 mb-4 my-8\"               -> \"my-8\"\n\"top-0 inset-0\"                -> \"inset-0\"\n\"w-4 size-8\"                   -> \"size-8\"\n\"block flex\"                   -> \"flex\"\n\"border border-2\"              -> \"border-2\"\n\"text-[11px] text-sm\"          -> \"text-sm\"\n\"text-sm text-red-500\"         -> \"text-sm text-red-500\"\n\"bg-red-500 bg-gradient-to-r\"  -> \"bg-red-500 bg-gradient-to-r\"",
 "t3-4:file:gia.cjs": "// gia.cjs — do gia twMerge (2.6.1 cua kho): 10.000 lan cung dau vao, 10.000 lan dau vao KHAC nhau\nconst { twMerge } = require('/Users/admin/.rtq-twc/lab/kho/node_modules/tailwind-merge');\nconst do_ = (ten, f) => { const t0 = process.hrtime.bigint(); for (let i = 0; i < 10000; i++) f(i); const ms = Number(process.hrtime.bigint() - t0) / 1e6; console.log(`${ten}: ${ms.toFixed(2)} ms => ${(ms / 10).toFixed(2)} micro-giay/lan`); };\ndo_('10.000 lan, cung dau vao ', () => twMerge('px-4 py-2 rounded text-sm font-medium', 'px-8 text-lg'));\ndo_('10.000 lan, dau vao khac', (i) => twMerge('px-4 py-2 rounded text-sm font-medium', `px-${i % 97} text-lg mt-${i % 13}`));\n",
 "t3-4:gia": "$ node gia.cjs\n10.000 lan, cung dau vao : 6.24 ms => 0.62 micro-giay/lan\n10.000 lan, dau vao khac: 35.48 ms => 3.55 micro-giay/lan\n$ node gia.cjs\n10.000 lan, cung dau vao : 6.53 ms => 0.65 micro-giay/lan\n10.000 lan, dau vao khac: 35.68 ms => 3.57 micro-giay/lan",
 "t3-4:file:pb.cjs": "// pb.cjs — tailwind-merge 2.6.1 (cua kho, cho Tailwind 3) vs 3.7.0 (cho Tailwind 4) tren ten lop cua CA HAI phien ban\nconst v2 = require('/Users/admin/.rtq-twc/lab/kho/node_modules/tailwind-merge').twMerge;\nconst v3 = require('./node_modules/tailwind-merge').twMerge;\nfor (const s of ['bg-red-500 bg-linear-to-r', 'bg-red-500 bg-gradient-to-r', 'p-4 p-(--x)', 'outline-hidden outline-none'])\n  console.log(JSON.stringify(s).padEnd(30), 'v2:', JSON.stringify(v2(s)).padEnd(30), 'v3:', JSON.stringify(v3(s)));\n",
 "t3-4:phienban": "$ node pb.cjs\n\"bg-red-500 bg-linear-to-r\"    v2: \"bg-linear-to-r\"               v3: \"bg-red-500 bg-linear-to-r\"\n\"bg-red-500 bg-gradient-to-r\"  v2: \"bg-red-500 bg-gradient-to-r\"  v3: \"bg-gradient-to-r\"\n\"p-4 p-(--x)\"                  v2: \"p-4 p-(--x)\"                  v3: \"p-(--x)\"\n\"outline-hidden outline-none\"  v2: \"outline-hidden outline-none\"  v3: \"outline-none\"\n$ grep '\"version\"' node_modules/tailwind-merge/package.json | head -1\n  \"version\": \"3.7.0\",",
 "t3-4:file:tb.cjs": "// tb.cjs — tien ich TUY BIEN cua kho (tailwind.config.ts: boxShadow neon, premium-card) — twMerge co biet khong?\nconst { twMerge, extendTailwindMerge } = require('/Users/admin/.rtq-twc/lab/kho/node_modules/tailwind-merge');\nconst day = extendTailwindMerge({ extend: { classGroups: { shadow: [{ shadow: ['neon', 'neon-lg', 'neon-cyan', 'premium-card'] }] } } });\nfor (const s of ['shadow-neon shadow-lg', 'shadow-premium-card shadow-none'])\n  console.log(JSON.stringify(s).padEnd(34), 'twMerge:', JSON.stringify(twMerge(s)).padEnd(36), 'da day:', JSON.stringify(day(s)));\n",
 "t3-4:tuybien": "$ node tb.cjs\n\"shadow-neon shadow-lg\"            twMerge: \"shadow-neon shadow-lg\"              da day: \"shadow-lg\"\n\"shadow-premium-card shadow-none\"  twMerge: \"shadow-premium-card shadow-none\"    da day: \"shadow-none\"\n$ git -C ../kho grep -c -E \"shadow-(neon|premium-card)\" -- 'src/*.tsx' | awk -F: '{s+=$2} END {print s \" luot shadow tuy bien trong \" NR \" tep\"}'\n52 luot shadow tuy bien trong 43 tep",
 "t3-4:file:in.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
 "t3-4:file:merge.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 text-base\">\n  <div class=\"border-t-4 border-slate-300\"><div id=\"tho\" class=\"mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32 rounded bg-amber-100 px-2\">chuỗi thô (11 lớp)</div></div>\n  <div class=\"border-t-4 border-slate-300\"><div id=\"cn\" class=\"mt-32 rounded bg-cyan-100 px-2\">qua cn() ⇒ \"mt-32\"</div></div>\n</body></html>\n",
 "t3-4:file:bong.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-8 bg-slate-100 p-8 text-base\">\n  <!-- cn('shadow-neon', 'shadow-lg'): twMerge 2.6.1 GIU CA HAI => bang kieu quyet -->\n  <div id=\"a\" class=\"shadow-neon shadow-lg rounded-xl bg-white p-4\">cn('shadow-neon', 'shadow-lg')</div>\n  <div id=\"b\" class=\"shadow-lg shadow-neon rounded-xl bg-white p-4\">cn('shadow-lg', 'shadow-neon')</div>\n</body></html>\n",
 "t3-4:chrome": "$ npx tailwindcss -c ../kho/tailwind.config.ts --content './*.html' -i in.css -o out.css 2>&1 | tail -1\nDone in 118ms.\n$ grep -nE '^\\.shadow-(lg|neon) \\{' out.css\n662:.shadow-lg {\n668:.shadow-neon {",
 "t3-4:file:tt.cjs": "// tt.cjs — luat NGUOI-GOI-CUOI: className = 'px-8' cua nguoi goi\nconst K = '/Users/admin/.rtq-twc/lab/kho/node_modules/';\nconst { clsx } = require(K + 'clsx'); const { twMerge } = require(K + 'tailwind-merge');\nconst cn = (...i) => twMerge(clsx(i)); const className = 'px-8';\nconsole.log(\"cn('px-4 py-2', className) =\", JSON.stringify(cn('px-4 py-2', className)));\nconsole.log(\"cn(className, 'px-4 py-2') =\", JSON.stringify(cn(className, 'px-4 py-2')));\nconsole.log(\"cn('px-4', false && 'px-6', null, undefined, className) =\", JSON.stringify(cn('px-4', false && 'px-6', null, undefined, className)));\n",
 "t3-4:thutu": "$ node tt.cjs\ncn('px-4 py-2', className) = \"py-2 px-8\"\ncn(className, 'px-4 py-2') = \"px-4 py-2\"\ncn('px-4', false && 'px-6', null, undefined, className) = \"px-8\"\n$ git -C ../kho grep -nE \"cn\\(\\s*className\\s*,\" -- 'src/*.tsx'\nsrc/components/work/xemTep/XemTep.tsx:282:    <div className={cn(className, '[&_img.w-doc-img]:cursor-zoom-in')} onClick={onClick}>",
 "anh-twc-3-4:merge": {
  "url": "http://127.0.0.1:20118/ttb/merge.html",
  "vp": [
   560,
   230
  ],
  "rect": {
   "#tho": [
    16,
    52,
    528,
    24
   ],
   "#cn": [
    16,
    208,
    528,
    24
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"tho\":\"32px\",\"cn\":\"128px\"}"
  }
 },
 "anh-twc-3-4:bong": {
  "url": "http://127.0.0.1:20118/ttb/bong.html",
  "vp": [
   560,
   230
  ],
  "rect": {
   "#a": [
    32,
    32,
    496,
    56
   ],
   "#b": [
    32,
    120,
    496,
    56
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"a\":\"rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(139, 92, 246, 0.3) 0px 0px 20px 0px\",\"b\":\"rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(139, 92, 246, 0.3) 0px 0px 20px 0px\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tsx, tn, br, box, two, steps, kw, c, cmp } from './_twc-chung.mjs';

export const deck = { key: 'twc-03-4', code: 'TWC 3.4', title: 'tailwind-merge restores last-wins', sub: 'Chapter 3 · Lesson 3.4' };
const O = (k) => { const v = DU_LIEU[`t3-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-3-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-03-4', ten, { vp: 560, ...o });
const bo = (x) => x.replace(/\s+/g, '');
const q = (s) => s.replace(/^"|"$/g, '');

// ── số đo (chạy thật t3-4 · tailwind-merge 2.6.1 + clsx 2.1.1 CỦA KHO, tailwind-merge 3.7.0 · Node 22.23.3 · Chromium · cấu hình thật frontend/, 14/11/2026)
const M11 = doan('mt11', 'node m11.cjs')[0].trim();
const BANG = doan('bang', 'node bang.cjs').map((l) => { const m = l.match(/^"([^"]+)"\s+->\s+"([^"]+)"$/); return [m[1], m[2]]; });
const GIA = doan('gia', 'node gia.cjs');
const us = (l) => +l.match(/=> ([\d.]+) micro/)[1];
const G1 = us(GIA[0]), G2 = us(GIA[1]);
const PB = doan('phienban', 'node pb.cjs').map((l) => { const m = l.match(/^"([^"]+)"\s+v2: "([^"]+)"\s+v3: "([^"]+)"$/); return [m[1], m[2], m[3]]; });
const TB = doan('tuybien', 'node tb.cjs').map((l) => { const m = l.match(/^"([^"]+)"\s+twMerge: "([^"]+)"\s+da day: "([^"]+)"$/); return [m[1], m[2], m[3]]; });
const TBN = doan('tuybien', 'awk')[0].trim();
const SHOrd = doan('chrome', "grep -nE").join('\n');
const TT = doan('thutu', 'node tt.cjs'), XT = doan('thutu', 'git -C')[0];
const MG = JSON.parse(A('merge').ketQua.s), BG = JSON.parse(A('bong').ketQua.s);
if (M11 !== 'mt-32' || MG.tho !== '32px' || MG.cn !== '128px') throw new Error('đầu ra mt11 đổi');
if (BANG.length !== 10 || BANG[1][1] !== 'p-8' || BANG[8][1] !== 'text-sm text-red-500' || BANG[9][1] !== 'bg-red-500 bg-gradient-to-r') throw new Error('bảng twMerge đổi');
if (!(G1 < 2 && G2 < 10)) throw new Error('giá đổi bất thường');
if (PB[0][1] !== 'bg-linear-to-r' || PB[0][2] !== 'bg-red-500 bg-linear-to-r' || PB[1][2] !== 'bg-gradient-to-r') throw new Error('bảng phiên bản đổi');
if (TB[0][1] !== 'shadow-neon shadow-lg' || TB[0][2] !== 'shadow-lg' || !TBN.startsWith('52 ') || !BG.a.includes('139, 92, 246') || !BG.b.includes('139, 92, 246')) throw new Error('số đo tuỳ biến đổi');
if (!SHOrd.includes('.shadow-lg {') || SHOrd.indexOf('.shadow-lg') > SHOrd.indexOf('.shadow-neon')) throw new Error('thứ tự shadow đổi');
if (!TT[0].endsWith('"py-2 px-8"') || !TT[1].endsWith('"px-4 py-2"') || !XT.includes('XemTep.tsx:282:')) throw new Error('đầu ra thứ tự đổi');
const TTF = `const cn = (...i) => twMerge(clsx(i));
const className = 'px-8';
console.log("cn('px-4 py-2', className) =",
  JSON.stringify(cn('px-4 py-2', className)));
console.log("cn(className, 'px-4 py-2') =",
  JSON.stringify(cn(className, 'px-4 py-2')));`;
if (!bo(O('file:tt.cjs')).includes(bo(TTF))) throw new Error('mã hiển thị KHÔNG khớp tt.cjs');
const tl = (a, b) => `<code>${a}</code> → <code>${b}</code>`;
const NOTE = ['same property', '<code>p</code> contains <code>px</code>', '<code>my</code> = <code>mt</code> + <code>mb</code>', '<code>inset</code> contains <code>top</code>', '<code>size</code> contains <code>w</code>', 'both set <code>display</code>', 'both set <code>border-width</code>', 'arbitrary vs scale', '<b>KEPT</b>: font-size vs colour', '<b>KEPT</b>: background-color vs image'];

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.4', t: 'tailwind-merge<br>restores last-wins', sub: 'The fix for chapter 3 is a library, not a trick — it knows Tailwind\'s property taxonomy. Measured with this site\'s own copy: what it merges, what it keeps, what it costs, and the two places it is blind',
    en: 'Lesson three point four. Three lessons built a problem. This one is the solution, and it is a library rather than a technique, because resolving these conflicts correctly needs the full taxonomy of Tailwind properties, which you do not want to write by hand.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The same eleven classes: Tailwind picks <code>mt-8</code>, <code>twMerge</code> picks the one written last</li>
    <li>It knows the <b>taxonomy</b>: <code>p</code> contains <code>px</code>, <code>text-sm</code> ≠ <code>text-red-500</code></li>
    <li>What it costs, measured: under a microsecond with cache</li>
    <li>The caller-last rule — and its mirror-image bug</li>
    <li>Where it is blind: custom utilities, static strings, and the <b>wrong major version</b></li></ul>`,
    en: 'Five takeaways: the same eleven classes, where Tailwind picks mt-eight and twMerge picks the last one written; it knows the taxonomy; what it costs, measured; the caller-last rule; and where it is blind: custom utilities, static strings, and the wrong major version.' },
  { t: 'The same eleven classes, both ways', body: two(D(tn(['$ node m11.cjs   # cn() = twMerge(clsx(…)) from this site\'s node_modules', "cn('mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32')", M11].join('\n'), { fs: 14, wrap: 58, title: 'tailwind-merge 2.6.1 (real)' }),
      cmp(['', 'who decides', 'winner'], [['raw string', 'Tailwind\'s generated order (3.2)', '<code>mt-8</code>'], ['through <code>cn()</code>', 'the order you <b>wrote</b>', `<code>${M11}</code>`]], { hl: [1] })),
    D(B('merge', { url: 'ttb/merge.html · Tailwind 3.4.19', h: 230, w: 540 }),
      box('Read it', `Raw: margin-top <b>${MG.tho}</b> (mt-8). Merged: <b>${MG.cn}</b> (mt-32). <code>twMerge</code> parses the string, finds the classes that target the same CSS property, throws away all but the last, and returns a string with <b>no conflicts left in it</b>.`, 'xanh')), 'r46'),
    en: 'The same eleven classes, both ways. Through cn, twMerge returns only mt-thirty-two, the last written. Chromium measures thirty-two pixels for the raw string and one hundred twenty-eight for the merged one. It returns a string with no conflicts left in it, so the stylesheet never has to decide.' },
  { t: 'It knows the TAXONOMY, not just prefixes', body: cmp(['input', 'twMerge 2.6.1 (real)', 'why'], BANG.map(([a, b], i) => [`<code>${a}</code>`, `<code>${b}</code>`, NOTE[i]]), { hl: [8, 9] }),
    en: 'It knows the taxonomy, measured. P-two p-eight becomes p-eight. Px-four p-eight becomes p-eight, because p contains px. Mt-four mb-four my-eight becomes my-eight. Inset contains top, size contains w. And the last two rows keep both classes: text-sm and text-red-500 set different properties.' },
  { t: 'Why this can NEVER be a regex', body: two(D(box('Same prefix, different property', '<code>text-sm</code> is <b>font-size</b>, <code>text-red-500</code> is <b>color</b>. <code>bg-red-500</code> is <b>background-color</b>, <code>bg-gradient-to-r</code> is <b>background-image</b>. A prefix-based merge deletes one of each pair and breaks your styling.', 'do2'),
      box('Different prefix, same property', 'Backwards too: <code>px-4 p-8</code> → <code>p-8</code> requires knowing that the <b>broader</b> utility, written later, replaces the narrower one; <code>my-8</code> swallows <code>mt-4 mb-4</code>.', 'lam')),
    D(box('So it is a model', 'A real model of Tailwind\'s property structure, maintained alongside Tailwind releases — exactly why writing it by hand is a bad idea, and why its <b>major version must match</b> your Tailwind (slide 11).', 'xanh'),
      box('Autocorrect, not search-and-replace', 'Like your phone\'s keyboard, it rewrites what you typed using a <b>dictionary</b>. Words it does not know, it leaves alone — keep that in mind for slide 9.', 'ok')), 'r46'),
    en: 'Why this can never be a regex. Same prefix, different property: text-sm is font-size, text-red-500 is colour; a prefix merge would delete one. Different prefix, same property: px-four then p-eight. It is a model of Tailwind, like a phone keyboard with a dictionary: unknown words are left alone.' },
  { t: 'The COST, measured', body: two(D(tn(['$ node gia.cjs   # tailwind-merge 2.6.1, Node 22.23.3, this course\'s machine', ...GIA].join('\n'), { fs: 14, wrap: 58, title: 'real' }),
      cmp(['', 'per merge'], [['same input (cache hit)', `<b>${G1} µs</b>`], ['different inputs (cache miss)', `<b>${G2} µs</b>`], ['one animation frame', '16,667 µs']])),
    D(box('Read it', `It <b>caches</b> by input string, so repeated renders with the same classes cost ~${G1} µs. Even with no cache at all, merging all 3,260 dynamic compositions of this site (lesson 3.3) in one render would take about <b>${(G2 * 3260 / 1000).toFixed(1)} ms</b> — an absolute worst case, since they are never on screen together.`, 'xanh'),
      box('Correction (measured)', 'The old lesson quoted 1.26 µs per merge without distinguishing cache hits from misses. On this machine: under 1 µs with cache, a few µs without. Either way, performance is not a reason to avoid it.', 'lam')), 'r46'),
    en: 'The cost, measured on this machine. Ten thousand merges with the same input: about zero point six microseconds each, because it caches. Ten thousand different inputs: about three and a half. Merging every dynamic composition of this site in one render would take about twelve milliseconds, a worst case that never happens.' },
  { t: 'The pattern for a component that accepts classes', body: two(D(tsx(`import { cn } from '@/lib/utils';
export function Button({ className, variant = 'primary', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center rounded-lg px-4 py-2 font-medium', // base
        variant === 'primary' && 'bg-blue-600 text-white',          // condition
        variant === 'ghost' && 'bg-transparent text-blue-600',
        className,                                                   // caller LAST
      )}
      {...props}
    />
  );
}`, { sm: true })),
    D(box('Caller className LAST', 'The outermost override must beat everything the component sets. Anywhere else silently limits the caller.', 'xanh'),
      box('Separate arguments · cond &amp;&amp; \'classes\'', `<code>cn('a', b, c)</code>, not <code>cn(\`a \${b}\`)</code>. <code>clsx</code> drops <code>false</code>/<code>null</code>/<code>undefined</code> — measured: <code>cn('px-4', false &amp;&amp; 'px-6', null, undefined, 'px-8')</code> → <code>${q(TT[2].split(' = ')[1])}</code>.`, 'ok')), 'r46'),
    en: 'The pattern. Base classes first, conditions as condition and-and classes, and the caller className last, as separate arguments. Clsx drops false, null and undefined, measured. The caller is the outermost override, so it must come last to beat everything the component sets.' },
  { t: 'Trap: cn() with the caller FIRST', body: two(D(tsx(TTF, { sm: true }), tn(['$ node tt.cjs', TT[0], TT[1]].join('\n'), { fs: 14, wrap: 56, title: 'tailwind-merge 2.6.1 (real)' })),
    D(box('The mirror-image bug', '<code>cn(className, \'px-4 py-2\')</code> compiles, merges correctly — and does the <b>opposite</b>: the component\'s classes beat the caller\'s every time. It survives a shallow "we use cn() everywhere" audit.', 'do2'),
      tn(["$ git grep -nE \"cn\\(\\s*className\\s*,\" …", XT.split(':').slice(0, 2).join(':').replace('src/components/', '…/'), '  ' + XT.slice(XT.indexOf('<div')).slice(0, 44) + '…'].join('\n'), { fs: 13, wrap: 50, title: 'frontend/ · 14/11/2026 (real)' }),
      box('Measured in this site', 'Exactly one hit. Its second argument is an arbitrary variant (<code>[&amp;_img…]:cursor-zoom-in</code>) that conflicts with nothing a caller would pass — harmless today, a pattern to fix when touched.', 'lam')), 'r46'),
    en: 'The trap: cn with the caller first. Cn of className then px-four py-two compiles, merges correctly, and does the opposite: the component beats the caller every time. In this site there is exactly one, in XemTep, and its second argument conflicts with nothing, so it is harmless today.' },
  { t: 'Blind spot 1: utilities it does not know', body: two(D(tn(['$ node tb.cjs   # this site\'s boxShadow: neon, premium-card…', ...TB.map(([a, b, c]) => `${a.padEnd(32)} → ${b}   | extended → ${c}`)].join('\n'), { fs: 12, wrap: 64, title: 'tailwind-merge 2.6.1 (real)' }),
      tn([`$ git grep -c -E "shadow-(neon|premium-card)" … | awk …`, TBN, '$ grep -nE \'^\\.shadow-(lg|neon) \\{\' out.css   # real tailwind.config.ts', SHOrd].join('\n'), { fs: 13, wrap: 64, title: 'frontend/ · 14/11/2026 (real)' })),
    D(B('bong', { url: 'ttb/bong.html · this site\'s real config', h: 210, w: 520 }),
      box('Read it', '<code>shadow-neon</code> comes from this site\'s <code>tailwind.config.ts</code>; the default <code>twMerge</code> does not know it, so it <b>keeps both</b>. The stylesheet then decides: <code>.shadow-neon</code> is generated after <code>.shadow-lg</code>, so the caller\'s <code>shadow-lg</code> loses in <b>both</b> orders — Chromium shows the violet glow twice. <code>extendTailwindMerge()</code> teaches it the extra names.', 'do2')), 'r46'),
    en: 'Blind spot one: utilities it does not know. This site defines shadow-neon in its config, used fifty-two times. The default twMerge keeps shadow-neon and shadow-lg both, so the stylesheet decides: neon is generated later and wins in both orders. Extend tailwind merge with the custom names, and it merges correctly.' },
  { t: 'Blind spot 2: strings that never go through cn()', body: D(cmp(['conflict', 'who catches it'], [['written literally in JSX — <code>class="mt-2 mt-10"</code>', 'the <b>linter</b> <code>no-contradicting-classname</code> (3.2 — 15 in this site)'], ['assembled at runtime from props', '<b>twMerge</b> via <code>cn()</code> (this lesson)'], ['custom utility (<code>shadow-neon</code>)', 'twMerge <b>only</b> after <code>extendTailwindMerge()</code>'], ['caller passed first', 'nobody — <b>review</b> the argument order']], { hl: [3] }),
    two(box('Static conflicts are the linter\'s job', 'If the string never passes through <code>cn()</code>, nothing merges it. Lint catches the literal ones; it cannot see runtime ones.', 'lam'), box('So you need both', 'Lint in CI for literal strings, <code>cn()</code> for composed ones, and <code>extendTailwindMerge()</code> kept in step with <code>tailwind.config</code>.', 'ok'), '')),
    en: 'Blind spot two: strings that never go through cn. A conflict written literally in JSX is the linter\'s job, from lesson three point two. A runtime conflict is twMerge\'s job. A custom utility needs extend tailwind merge. And the caller-first mistake is caught by nobody but review.' },
  { t: 'Match the MAJOR version: tailwind-merge 2 ⇔ Tailwind 3, 3 ⇔ 4', body: D(cmp(['input', 'tailwind-merge 2.6.1', 'tailwind-merge 3.7.0'], PB.map(([a, b, c]) => [`<code>${a}</code>`, `<code>${b}</code>`, `<code>${c}</code>`]), { hl: [0] }),
    two(box('Read it', '<code>bg-linear-to-r</code> is Tailwind 4\'s gradient. Merge 2 does not know it, guesses "a background colour", and <b>deletes</b> <code>bg-red-500</code>. Merge 3 keeps both — but treats Tailwind 3\'s <code>bg-gradient-to-r</code> as a colour.', 'do2'),
      box('This site', 'Tailwind <b>3.4.19</b> + tailwind-merge <b>2.6.1</b>: a matching pair. Upgrade Tailwind to 4 and tailwind-merge to 3 <b>in the same change</b>, or merges silently delete classes.', 'lam'), '')),
    en: 'Match the major version. Tailwind-merge two does not know Tailwind four\'s bg-linear-to-r, guesses a colour, and deletes bg-red-500. Version three keeps both, but mis-handles Tailwind three\'s gradient name. This site pairs Tailwind three with merge two, correctly. Upgrade both in the same change.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'Your phone keyboard autocorrects using its dictionary; a name it does not know stays untouched until you add it. <code>twMerge</code> = autocorrect; <code>extendTailwindMerge()</code> = "add to dictionary".', 'lam'),
      box('What if…', '…someone bumps tailwind-merge to 3 "to stay current" while the site is still on Tailwind 3? Every <code>bg-red-500 bg-gradient-to-r</code> merged through <code>cn()</code> silently loses its gradient (measured above, reversed).', 'xanh')),
    D(box('The attacker\'s view: code that runs on every render', 'tailwind-merge executes inside every visitor\'s browser, on every render. A hijacked package version (supply-chain attacks such as <code>event-stream</code> in 2018) would run there too. Defend: commit the lockfile, install with <code>npm ci</code>, review dependency bumps, run <code>npm audit</code>, and keep the dependency list short.', 'do2'),
      box('Related', 'Dependencies and lockfiles — Node.js course; the <code>className</code> prop contract — React 1.2.', 'ok')), 'r46'),
    en: 'In real life: twMerge is autocorrect, and extend tailwind merge is add-to-dictionary. What if someone bumps tailwind-merge to three while the site is still on Tailwind three? Gradients silently disappear. The attacker view: this code runs in every browser on every render; commit the lockfile, use npm ci, review bumps.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('twMerge', 'keeps the last class of each conflicting property'), kw('property taxonomy', 'p contains px, my = mt + mb, size ⊃ w'), kw('different-property keep', 'text-sm + text-red-500 both stay'),
      kw('caller-last rule', 'className is the last argument'), kw('cache', '~0.6 µs hit, ~3.6 µs miss (measured)'), kw('extendTailwindMerge()', 'teach it your custom utilities'),
      kw('major-version match', 'merge 2 ⇔ Tailwind 3, merge 3 ⇔ Tailwind 4'), kw('static conflict', 'the linter\'s job, not twMerge\'s'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: twMerge; the property taxonomy; different-property keep; the caller-last rule; the cache; extend tailwind merge; major-version match; and static conflicts, which are the linter\'s job.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run ${c("cn('mt-1 … mt-32')")} and compare with the raw string in DevTools`,
      `Feed ${c('twMerge')} the ten pairs of slide 4 — predict each answer first`,
      `Add your own custom utility to ${c('extendTailwindMerge()')} and re-test`,
      `Search your code for ${c('cn(className,')} — and check your tailwind-merge major`,
    ]), box('Keep these', '<ul><li>twMerge restores "last written wins"</li><li>It is a taxonomy, never a regex</li><li>Caller className goes LAST</li><li>Teach it custom utilities; match its major version</li></ul>', 'lam'), ''),
    en: 'Your turn: compare the eleven classes raw and merged; predict the ten pairs before running them; add a custom utility to extend tailwind merge; and search your code for cn with className first. Keep: twMerge restores last-wins; it is a taxonomy; the caller goes last.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Conflicts, where the model leaks', bai: '3.4' }, S);
