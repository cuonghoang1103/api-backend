/*DU_LIEU*/
const DU_LIEU = {
 "t4-1:phanbo": "$ git ls-files 'src/*.tsx' | wc -l\n    1678\n$ git grep -hoE 'className=\"[^\"]*\"' -- 'src/*.tsx' | awk '{n=length; if(n<40)a++; else if(n<80)b++; else if(n<160)c++; else d++; if(n>m)m=n} END{t=a+b+c+d; printf \"  <40:    %5d (%4.1f%%)\\n  40-79:  %5d (%4.1f%%)\\n  80-159: %5d (%4.1f%%)\\n  160+:   %5d (%4.1f%%)\\n  tong %d chuoi · dai nhat %d ky tu\\n\",a,100*a/t,b,100*b/t,c,100*c/t,d,100*d/t,t,m}'\n  <40:    21651 (43.8%)\n  40-79:  18781 (38.0%)\n  80-159:  7399 (15.0%)\n  160+:    1547 ( 3.1%)\n  tong 49378 chuoi · dai nhat 796 ky tu",
 "t4-1:ungvien": "$ git grep -hoE 'className=\"[^\"]{120,}\"' -- 'src/*.tsx' | sort | uniq -c | sort -rn | head -4 | cut -c1-118\n  12 className=\"w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder\n  12 className=\"w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outli\n  11 className=\"flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover\n   9 className=\"inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white f\n$ git grep -hoE 'className=\"[^\"]{120,}\"' -- 'src/*.tsx' | sort | uniq -c | awk '$1>=4{n++; s+=$1} $1>=2{m++} END{print n \" chuoi dai >=120 lap >=4 lan (\" s \" luot) · \" m \" chuoi dai lap >=2 lan\"}'\n31 chuoi dai >=120 lap >=4 lan (172 luot) · 234 chuoi dai lap >=2 lan",
 "t4-1:file:troi.cjs": "// troi.cjs — \"mot o nhap\" cua trang nay duoc viet bao nhieu kieu? Lay ho chuoi className co du 5 dau hieu, so tung cach viet voi cach pho bien nhat.\nconst { execSync } = require('node:child_process');\nconst ra = execSync(`git -C ../kho grep -hoE 'className=\"[^\"]*\"' -- 'src/*.tsx'`, { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\\n');\nconst ho = ra.filter((s) => ['w-full', 'px-4 py-2.5', 'border', 'rounded-xl', 'focus:border-neon-violet'].every((d) => s.includes(d)));\nconst dem = new Map(); for (const s of ho) dem.set(s, (dem.get(s) || 0) + 1);\nconst xep = [...dem].sort((a, b) => b[1] - a[1]); const goc = new Set(xep[0][0].slice(11, -1).split(' '));\nconsole.log(`${ho.length} luot, ${xep.length} cach viet khac nhau`);\nfor (const [s, n] of xep.slice(0, 6)) {\n  const t = new Set(s.slice(11, -1).split(' '));\n  const them = [...t].filter((x) => !goc.has(x)), thieu = [...goc].filter((x) => !t.has(x));\n  console.log(String(n).padStart(3), 'x', (them.map((x) => '+' + x).concat(thieu.map((x) => '-' + x)).join(' ') || '(cach viet goc)'));\n}\n",
 "t4-1:troi": "$ node troi.cjs\n71 luot, 28 cach viet khac nhau\n 12 x (cach viet goc)\n 12 x +placeholder:text-text-muted\n  6 x +bg-darkcard +placeholder:text-text-muted +transition-colors -bg-darkbg\n  5 x +cursor-pointer\n  5 x +placeholder:text-text-muted +transition-colors\n  4 x +placeholder:text-text-muted +resize-y\n$ git -C ../kho grep -lE 'className=\"[^\"]*px-4 py-2\\.5[^\"]*focus:border-neon-violet[^\"]*\"' -- 'src/*.tsx' | wc -l\n      16\n$ git -C ../kho grep -c 'TextInput' -- 'src/*.tsx' | wc -l\n       5",
 "t4-1:file:in.css": "@tailwind utilities;\n",
 "t4-1:file:mot.html": "<input class=\"w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50\" placeholder=\"Tìm…\">\n",
 "t4-1:bytes": "$ npx tailwindcss -c ../kho/tailwind.config.ts --content './mot.html' -i in.css -o a.css --minify 2>&1 | tail -1\nDone in 138ms.\n$ npx tailwindcss -c ../kho/tailwind.config.ts --content './muoihai.html' -i in.css -o b.css --minify 2>&1 | tail -1\nDone in 119ms.\n$ wc -c mot.html muoihai.html a.css b.css\n     204 mot.html\n    2448 muoihai.html\n     727 a.css\n     727 b.css\n    4106 total\n$ cmp a.css b.css && echo \"a.css va b.css GIONG HET tung byte\"\na.css va b.css GIONG HET tung byte\n$ echo \"gzip: mot.html $(gzip -c mot.html | wc -c) B · muoihai.html $(gzip -c muoihai.html | wc -c) B\"\ngzip: mot.html      176 B · muoihai.html      201 B",
 "t4-1:file:in2.css": "@tailwind base;\n@tailwind utilities;\n:root { --text-primary: #e4e6eb; --text-muted: #8a8d91; }\n",
 "t4-1:file:bon.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out2.css\"></head>\n<body class=\"bg-[#18191a] p-4 space-y-3 text-[13px] text-slate-300\">\n  <div>12× · cách viết gốc<input id=\"a\" class=\"w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50\" placeholder=\"Tìm bài học…\"></div>\n  <div>12× · thiếu placeholder:<input id=\"b\" class=\"w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50\" placeholder=\"Tìm bài học…\"></div>\n  <div>6× · bg-darkcard + transition<input id=\"c\" class=\"w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors\" placeholder=\"Tìm bài học…\"></div>\n</body></html>\n",
 "t4-1:chrome": "$ npx tailwindcss -c ../kho/tailwind.config.ts --content './bon.html' -i in2.css -o out2.css 2>&1 | tail -1\nDone in 121ms.",
 "anh-twc-4-1:bon": {
  "url": "http://127.0.0.1:20120/c41/bon.html",
  "vp": [
   560,
   250
  ],
  "rect": {
   "#a": [
    16,
    36,
    528,
    42
   ],
   "#b": [
    16,
    109,
    528,
    42
   ],
   "#c": [
    16,
    183,
    528,
    42
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"a\":{\"ph\":\"rgb(138, 141, 145)\",\"bg\":\"rgb(24, 25, 26)\",\"tr\":\"all\"},\"b\":{\"ph\":\"rgb(156, 163, 175)\",\"bg\":\"rgb(24, 25, 26)\",\"tr\":\"all\"},\"c\":{\"ph\":\"rgb(138, 141, 145)\",\"bg\":\"rgb(36, 37, 38)\",\"tr\":\"color, background-color, border-color, text-decoration-color, fill, stroke\"}}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-04-1', code: 'TWC 4.1', title: 'Measuring "class soup"', sub: 'Chapter 4 · Lesson 4.1' };
const O = (k) => { const v = DU_LIEU[`t4-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-4-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-04-1', ten, { vp: 560, ...o });
const so = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ── số đo (chạy thật t4-1 · git grep trên frontend/ của trang · Tailwind 3.4.19 + cấu hình thật · Chromium · 14/11/2026)
const TEP = doan('phanbo', 'git ls-files')[0].trim();
const PB = doan('phanbo', 'awk');
const XO = PB.slice(0, 4).map((l) => { const m = l.match(/^\s+(\S+):\s+(\d+)\s+\(\s*([\d.]+)%\)$/); return [m[1], +m[2], +m[3]]; });
const TONG = +PB[4].match(/tong (\d+)/)[1], DAI = +PB[4].match(/dai nhat (\d+)/)[1];
const UV = doan('ungvien', 'head -4');
const UVT = doan('ungvien', "awk '$1>=4")[0];
const UV4 = UVT.match(/^(\d+) chuoi dai >=120 lap >=4 lan \((\d+) luot\) · (\d+) chuoi/);
const TR = doan('troi', 'node troi.cjs');
const TRN = TR[0].match(/^(\d+) luot, (\d+) cach viet/);
const TRF = doan('troi', 'git -C ../kho grep -lE')[0].trim(), TIN = doan('troi', "grep -c 'TextInput'")[0].trim();
const WC = doan('bytes', 'wc -c').map((l) => l.trim().split(/\s+/));
const CMP = doan('bytes', 'cmp a.css')[0], GZ = doan('bytes', 'echo "gzip')[0];
const BB = JSON.parse(A('bon').ketQua.s);
if (TEP !== '1678' || TONG !== 49378 || DAI !== 796 || XO[3][2] !== 3.1) throw new Error('phân bố đổi');
if (!UV4 || UV4[1] !== '31' || TRN[1] !== '71' || TRN[2] !== '28' || TRF !== '16') throw new Error('ứng viên/trôi đổi');
if (WC[2][0] !== WC[3][0] || !CMP.includes('GIONG HET')) throw new Error('bytes đổi');
if (BB.a.ph === BB.b.ph || BB.a.bg === BB.c.bg) throw new Error('Chromium trôi đổi');
const DUOI80 = (XO[0][2] + XO[1][2]).toFixed(1);
const TRF6 = TR.slice(1, 7).map((l) => { const m = l.match(/^\s*(\d+) x (.*)$/); return [m[1], m[2]]; });
const tag = (s) => s === '(cach viet goc)' ? '<i>the most common spelling</i>' : s.split(' ').map((x) => `<code>${x}</code>`).join(' ');
const MAU = `w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50`;
if (!O('file:mot.html').includes(MAU)) throw new Error('chuỗi mẫu KHÔNG khớp mot.html');
const INP = `import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
// ONE name for the thing written 71 ways
export const Input = forwardRef<HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} {...props} className={cn(
      'w-full rounded-xl border border-darkborder bg-darkbg',
      'px-4 py-2.5 text-sm text-text-primary',
      'placeholder:text-text-muted transition-colors',
      'focus:outline-none focus:border-neon-violet/50',
      className)} />));`;

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.1', t: 'Measuring "class soup"<br>instead of arguing about it', sub: `"Utility classes make markup unreadable" is a claim about a distribution. Measured on this site's ${so(TONG)} class attributes: how long they really are, which long ones repeat, and the input written ${TRN[2]} different ways`,
    en: 'Lesson four point one, the start of chapter four. The most durable objection to Tailwind is that long class lists make markup unreadable. That is a claim about a distribution, so this lesson measures the distribution instead of arguing from one ugly screenshot.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The real distribution: <b>${DUOI80}%</b> of class attributes are under 80 characters</li>
    <li>Why both sides of the argument are right — about different data</li>
    <li>The extraction signal is <b>repetition</b>, not length</li>
    <li><b>Drift</b>: one input in this site, written <b>${TRN[2]}</b> ways</li>
    <li>What the soup costs — not CSS bytes, but <b>places that must change together</b></li></ul>`,
    en: `Five takeaways: the real distribution, where ${DUOI80} percent of attributes are under eighty characters; why both sides of the argument are right; repetition, not length, is the signal; drift, one input written ${TRN[2]} ways; and what the soup really costs.` },
  { t: 'The distribution, measured', body: two(D(tn(['$ git grep -hoE \'className="[^"]*"\' -- \'src/*.tsx\' | awk …', ...PB].join('\n'), { fs: 15, wrap: 56, title: `frontend/ · ${so(+TEP)} .tsx files · 14/11/2026 (real)` }),
      meter(XO.map(([t, n, p], i) => [`${t} chars · ${p}%`, n, i === 3 ? '#dc2626' : '#0891b2']), { don: '', nhan: 210, fs: 18, rh: 44, w: 560 })),
    D(box('Read it', `<b>${so(TONG)}</b> attributes. <b>${DUOI80}%</b> fit on one readable line (under 80 characters). The horror cases exist — <b>${so(XO[3][1])}</b> exceed 160, the longest is <b>${DAI}</b> — but they are <b>${XO[3][2]}%</b>.`, 'xanh'),
      box('Re-measured', 'This lesson used to say 26,343 attributes, 79% under 80, 4.4% over 160, longest 787. The site doubled since; the shape held: short strings are the norm.', 'lam')), 'r64'),
    en: `The distribution, measured with git grep on this site. ${so(TONG)} class attributes. ${DUOI80} percent are under eighty characters, one readable line. ${so(XO[3][1])} exceed one hundred sixty, and the longest is ${DAI}. But that is ${XO[3][2]} percent. The site doubled since the lesson was written; the shape held.` },
  { t: 'Both sides are right — about different data', body: D(two(box('"In practice it reads fine"', `The advocate is describing the <b>${DUOI80}%</b>: <code>flex items-center gap-2</code>. One job, obvious at a glance.`, 'ok'),
      box('"Look at this monster"', `The critic is holding up the <b>${XO[3][2]}%</b>: a ${DAI}-character attribute. Real — and rare.`, 'do2'), ''),
    cmp(['', 'used once', 'used 2–3 times', 'used 4+ times'], [['short', 'leave it', 'leave it', 'leave it — <code>flex items-center</code> has no identity'], ['long (120+)', '<b>leave it</b> — a one-off hero is fine', 'judgement: drifting? extract', `<b>extract</b> — ${UV4[1]} strings here (${UV4[2]} uses)`]], { hl: [1] }),
    box('The useful question', 'Not "which experience is typical" but <b>what the long, repeated ones have in common</b>. That is where the design signal is.', 'lam')),
    en: `Both sides are right about different data. The advocate describes the short majority; the critic describes the rare monster. The useful question is what the long and repeated strings have in common. Here, ${UV4[1]} strings of over one hundred twenty characters appear four or more times.` },
  { t: 'What a long, repeated class list is telling you', body: two(D(`<div style="font:19px/1.55 Consolas,monospace;background:#1e1e1e;color:#ce9178;border-radius:12px;padding:14px 18px">className="<span style="background:#0e7490;color:#fff">w-full px-4 py-2.5</span> <span style="background:#7c3aed;color:#fff">bg-darkbg border border-darkborder rounded-xl</span> <span style="background:#b45309;color:#fff">text-sm text-text-primary placeholder:text-text-muted</span> <span style="background:#15803d;color:#fff">focus:outline-none focus:border-neon-violet/50</span>"</div>`,
      cmp(['colour', 'job'], [['<span style="color:#0e7490">■</span>', '<b>box</b> — width, padding'], ['<span style="color:#7c3aed">■</span>', '<b>surface</b> — background, border, radius'], ['<span style="color:#b45309">■</span>', '<b>text</b> — size, colour, placeholder'], ['<span style="color:#15803d">■</span>', '<b>interaction</b> — focus state']])),
    D(box('Four jobs, one identity, no name', `This exact string appears <b>12 times</b> in this site. It is not "a div with classes" — it is <b>the search/text input</b>. Hand-written CSS would have called it <code>.input</code>. The long string is a <b>missing name</b> announcing itself.`, 'xanh'),
      box('Naming it in React = a component', 'Not a CSS class (lesson 4.2 measures why), but <code>&lt;Input /&gt;</code> — the name lives in JSX, the utilities stay utilities.', 'ok')), 'r64'),
    en: 'What a long repeated class list is telling you. Colour the most repeated string here by job: box, surface, text, interaction. Four jobs, one identity: it is the text input, written twelve times. Hand-written CSS would have named it. The long string is a missing name, and in React a name is a component.' },
  { t: 'Finding the candidates mechanically', body: D(tn(['$ git grep -hoE \'className="[^"]{120,}"\' -- \'src/*.tsx\' | sort | uniq -c | sort -rn | head -4', ...UV.map((l) => l.replace(/^\s+/, '').slice(0, 96) + '…'), '$ … | awk \'$1>=4 …\'', UVT].join('\n'), { fs: 15, wrap: 112, title: 'frontend/ · 14/11/2026 (real)' }),
    two(box('Why this beats reading files', 'It ranks by the thing that actually costs you — <b>duplication that must be kept in sync by hand</b>. The top of the list is your component backlog.', 'xanh'),
      box('Two near-twins at the top', 'Rows 1 and 2 are the <b>same input</b>, 12 copies each — one with <code>placeholder:text-text-muted</code>, one without. Exact-match counting splits them. The next slide counts the whole family.', 'do2'), '')),
    en: `Finding candidates mechanically: grep every class attribute over one hundred twenty characters, sort, count, rank. ${UV4[1]} strings repeat four times or more. Look at the top two: twelve copies each of the same input, one with a placeholder colour and one without. Exact counting splits the family.` },
  { t: `Drift: one input, ${TRN[2]} spellings`, body: two(D(tn(['$ node troi.cjs   # family = w-full · px-4 py-2.5 · border · rounded-xl · focus:border-neon-violet', ...TR].join('\n'), { fs: 15, wrap: 64, title: 'frontend/ · 14/11/2026 (real)' }),
      cmp(['copies', 'difference from the most common spelling'], TRF6.map(([n, d]) => [`${n}×`, tag(d)]), { hl: [1, 2] })),
    D(box('Read it', `<b>${TRN[1]}</b> uses, <b>${TRN[2]}</b> different strings, in <b>${TRF}</b> files. Some differences are deliberate (<code>resize-y</code> on a textarea). Others are <b>accidents</b>: half the copies forgot the placeholder colour, some use a lighter background.`, 'do2'),
      box('Drift is the signal', 'Copies drifting apart means the concept is <b>real</b> and <b>unnamed</b>. Each copy evolves separately, and nobody can say which spelling is "the input".', 'lam')), 'r64'),
    en: `Drift: the same input family appears ${TRN[1]} times as ${TRN[2]} different strings in ${TRF} files. Some differences are deliberate, like resize on a textarea. Others are accidents: half the copies forgot the placeholder colour, some use a lighter background. Drift is the signal that a real concept has no name.` },
  { t: 'Drift you can SEE — three spellings in Chromium', body: two(D(B('bon', { url: 'c41/bon.html · this site\'s real tailwind.config.ts', h: 250, w: 440 })),
      D(cmp(['spelling', 'placeholder colour', 'background'], [['12× most common', `<code>${BB.a.ph}</code>`, `<code>${BB.a.bg}</code>`], ['12× no <code>placeholder:</code>', `<code>${BB.b.ph}</code> ← browser/preflight grey`, `<code>${BB.b.bg}</code>`], ['6× <code>bg-darkcard</code>', `<code>${BB.c.ph}</code>`, `<code>${BB.c.bg}</code> ← lighter`]], { hl: [1, 2] }),
      box('Three "identical" inputs', 'Same page, same purpose, three looks. Each difference is a pixel or two — exactly the kind nobody notices in review and every user notices across pages.', 'do2')), 'r46'),
    en: 'Drift you can see. Three spellings rendered in Chromium with this site\'s real config. Without the placeholder class, the placeholder falls back to the preflight grey. With bg-darkcard, the background is lighter. Same purpose, three looks: small enough to pass review, visible across pages.' },
  { t: 'What the soup costs — it is NOT the CSS', body: two(D(tn(['$ wc -c mot.html muoihai.html a.css b.css', ...doan('bytes', 'wc -c'), '$ cmp a.css b.css && echo …', CMP, GZ].join('\n'), { fs: 15, wrap: 60, title: 'Tailwind 3.4.19 + this site\'s config (real)' })),
    D(box('Read it', `1 copy or 12 copies of the long string: the stylesheet is <b>${WC[2][0]} bytes both times, byte for byte identical</b>. The HTML grows 12×, but gzip squeezes the repetition (<b>${GZ.match(/mot.html\s+(\d+)/)[1]} → ${GZ.match(/muoihai.html\s+(\d+)/)[1]} B</b>).`, 'xanh'),
      box('The real cost', `<b>Places that must change together.</b> Rebrand the focus colour from violet to cyan: ${TRN[1]} edits across ${TRF} files, by hand, and the ${TRN[2]} spellings mean a search for one string misses most of them.`, 'do2')), 'r46'),
    en: `What the soup costs. One copy or twelve copies of the long string: the stylesheet is ${WC[2][0]} bytes both times, identical byte for byte, and gzip squeezes the HTML repetition. The real cost is places that must change together: rebrand the focus colour and that is ${TRN[1]} edits in ${TRF} files.` },
  { t: 'The fix is a name — and this site already has one', body: two(D(tsx(INP, { sm: true })),
    D(box('A component, not a CSS class', 'Same short call site (<code>&lt;Input placeholder="…" /&gt;</code>), utilities still deduplicated in the stylesheet, <code>cn()</code> still resolves conflicts (3.4), and the caller can still position it.', 'xanh'),
      box('Measured: it exists, but only in one corner', `<code>settings/primitives.tsx</code> exports a themed <code>TextInput</code> — mentioned in only <b>${TIN}</b> files. The other <b>${TRF}</b> files hand-write the ${TRN[2]} spellings. Lesson 4.5 reads that file.`, 'lam')), 'r64'),
    en: `The fix is a name. An Input component keeps the call site short, the utilities deduplicated, and cn still resolves conflicts. This site already has a themed TextInput in the settings primitives, mentioned in only ${TIN} files, while ${TRF} files hand-write the input. Lesson four point five reads that file.` },
  { t: 'Trap: treating line LENGTH as the metric', body: D(two(box('The rule teams add', 'A lint rule capping class-attribute length at, say, 120 characters. It feels like the fix for the monster screenshots.', 'lam'),
      box('What it produces', '(1) one-off layouts split into meaningless sub-components to satisfy the linter; (2) classes moved into a variable — <b>same length, same duplication, now hidden</b>.', 'do2'), ''),
    box('The metric that matters', `<b>How many places must change together.</b> No character count measures that; <code>uniq -c</code> on the strings does. A ${DAI}-character string used once costs nothing; a 150-character string used 12 times in 4 files is a bug waiting for the next redesign.`, 'xanh')),
    en: 'The trap: treating length as the metric. A lint rule capping attribute length produces meaningless sub-components and classes moved into variables, the same duplication now hidden. The metric that matters is how many places must change together, and uniq dash c measures it.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'A long recipe written once on the menu is fine. The same recipe <b>photocopied onto 12 order slips</b> and edited by hand on each one — soon nobody knows which version the kitchen means. That is drift.', 'lam'),
      box('What if…', `…the designer changes the focus ring to cyan? Someone searches for <code>focus:border-neon-violet/50</code>, fixes ${TRF} files, and ships. The pages they missed keep the old colour — the bug report says "inconsistent", not "broken", so it lives for months.`, 'xanh')),
    D(box('The attacker\'s view: your look is copy-paste', 'With utilities, the full appearance travels <b>inside the markup</b>. A phishing page can clone your login form by copying its HTML and your public stylesheet — pixel-perfect, no design work. Appearance proves nothing: users must check the <b>domain</b>; the site should use passkeys or 2FA so a stolen password is not enough.', 'do2'),
      box('Related', 'React 1.4 — thinking in components; React 13.2 — hooks and styling; next: 4.2 measures <code>@apply</code>.', 'ok')), 'r46'),
    en: 'In real life: a recipe photocopied onto twelve slips and edited by hand drifts. What if the focus colour changes? Search misses the other spellings, and the bug lives for months. The attacker view: utilities carry your whole look in the markup, so a phishing clone is copy-paste. Check the domain; use passkeys or 2FA.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('class soup', `long utility strings — ${XO[3][2]}% over 160 chars here`), kw('distribution', 'measure every attribute, not one screenshot'), kw('missing abstraction', 'a long list doing several jobs, with no name'),
      kw('repetition over length', 'the extraction signal'), kw('drift', `copies diverging — ${TRN[2]} spellings of one input`), kw('extraction threshold', 'long + used 4+ times ⇒ extract'),
      kw('leaf element', 'short one-job list: leave it alone'), kw('change-together cost', 'what soup really costs (not CSS bytes)'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: class soup; distribution; missing abstraction; repetition over length; drift; the extraction threshold; leaf element; and the change-together cost.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run the ${c('awk')} distribution on your own project — what % is under 80?`,
      `${c('sort | uniq -c | sort -rn')} on strings of 120+ chars — list your top 5`,
      'Pick one family and count its spellings (adapt troi.cjs)',
      'Name it: one component, then replace the copies one by one',
    ]), box('Keep these', '<ul><li>Class soup is real — and rare</li><li>Extract on repetition, not length</li><li>Drift = a real concept with no name</li><li>The cost is change-together, not bytes</li></ul>', 'lam'), ''),
    en: 'Your turn: run the distribution on your own project, rank the long repeated strings, count the spellings of one family, and name it as a component. Keep: soup is real and rare; extract on repetition; drift means a missing name; the cost is change-together, not bytes.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Components, and the right place to reuse', bai: '4.1' }, S);
