/*DU_LIEU*/
const DU_LIEU = {
 "t0-1:kho": "$ find src -name \"*.tsx\" | wc -l\n    1673\n$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | wc -l\n   49298\n$ grep -ho 'className=\"[^\"]*\"' -r src --include=\"*.tsx\" | sed 's/className=\"//; s/\"$//' | tr ' ' '\\n' | grep -v '^$' | sort -u | wc -l\n    6169",
 "t0-1:file:input.css": "@import \"tailwindcss\";\n",
 "t0-1:file:index.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-slate-100 p-4 text-xl\">\n  <div class=\"bg-white\"><p id=\"a\" class=\"mt-8 mt-2 bg-cyan-100\">class=\"mt-8 mt-2\"</p></div>\n  <div class=\"bg-white\"><p id=\"b\" class=\"mt-2 mt-8 bg-cyan-100\">class=\"mt-2 mt-8\"</p></div>\n  <div class=\"bg-white\"><p id=\"c\" class=\"mt-[7px] bg-cyan-100\">class=\"mt-[7px]\"</p></div>\n</body></html>\n",
 "t0-1:vang": "$ npx @tailwindcss/cli -i input.css -o out.css --minify 2>&1 | tail -1\nDone in 51ms\n$ grep -c 'text-4xl' out.css\n0\n$ sed -i '' 's/text-2xl/text-4xl/' index.html && cat index.html\n<h1 class=\"text-4xl font-bold\">Xin chào</h1>\n$ npx @tailwindcss/cli -i input.css -o out.css --minify 2>&1 | tail -1\nDone in 25ms\n$ grep -o '\\.text-4xl{[^}]*}' out.css\n.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}",
 "t0-1:file:the.html": "<div class=\"rounded-xl bg-white p-6 shadow-lg\"><h2 class=\"text-xl font-bold\">Thẻ</h2><p class=\"mt-2 text-slate-600\">Nội dung</p></div>\n",
 "t0-1:phinh": "$ npx @tailwindcss/cli -i input.css -o out.css --minify 2>&1 | tail -1; wc -c < out.css | sed 's/^ */1 thẻ:     /;s/$/ byte/'\nDone in 120ms\n1 thẻ:     6652 byte\n$ grep -o 'class=\"' index.html | wc -l | sed 's/^ */thuộc tính class trong trang: /'\nthuộc tính class trong trang: 3000\n$ npx @tailwindcss/cli -i input.css -o out.css --minify 2>&1 | tail -1; wc -c < out.css | sed 's/^ */1000 thẻ:  /;s/$/ byte/'\nDone in 112ms\n1000 thẻ:  6652 byte",
 "t0-1:dong": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 22ms\n$ for s in '.text-red-500 ' '.text-red-600 ' '.text-green-600 ' '.font-bold '; do printf '%-18s %s\\n' \"$s\" \"$(grep -c -- \"^ *$s{\" out.css)\"; done\n.text-red-500      0\n.text-red-600      1\n.text-green-600    1\n.font-bold         1",
 "t0-1:thu": "$ npx @tailwindcss/cli -i input.css -o out.css 2>&1 | tail -1\nDone in 23ms\n$ grep -nE '^ *\\.mt-(2|8|\\\\\\[7px\\\\\\]) \\{' out.css\n169:  .mt-2 {\n172:  .mt-8 {\n175:  .mt-\\[7px\\] {\n$ grep -A2 'mt-\\\\\\[7px\\\\\\] {' out.css | head -2\n  .mt-\\[7px\\] {\n    margin-top: 7px;",
 "t0-1:chu": "$ sed -i '' 's#// VỠ — tên lớp ghép từ biến lúc chạy#// VỠ — mong ra text-red-500 nhưng tên ghép từ biến#' index.html && grep -n 'VỠ' index.html\n7:    // VỠ — mong ra text-red-500 nhưng tên ghép từ biến\n$ npx @tailwindcss/cli -i input.css -o out2.css 2>&1 | tail -1\nDone in 24ms\n$ printf '%-18s %s\\n' '.text-red-500 ' \"$(grep -c -- '^ *.text-red-500 {' out2.css)\"\n.text-red-500      1",
 "anh-twc-0-1:dong": {
  "url": "http://127.0.0.1:20102/dong/index.html",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#sai": [
    24,
    24,
    592,
    36
   ],
   "#dung": [
    24,
    60,
    592,
    36
   ]
  },
  "console": [],
  "ketQua": {
   "mau": "[[\"text-red-500 font-bold\",\"rgb(0, 0, 0)\"],[\"text-red-600 font-bold\",\"oklch(0.577 0.245 27.325)\"]]"
  }
 },
 "anh-twc-0-1:thu": {
  "url": "http://127.0.0.1:20102/thu/index.html",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#a": [
    16,
    48,
    608,
    28
   ],
   "#b": [
    16,
    108,
    608,
    28
   ],
   "#c": [
    16,
    143,
    608,
    28
   ]
  },
  "console": [],
  "ketQua": {
   "mt": "[[\"mt-8 mt-2 bg-cyan-100\",\"32px\"],[\"mt-2 mt-8 bg-cyan-100\",\"32px\"],[\"mt-[7px] bg-cyan-100\",\"7px\"]]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tn, br, box, two, steps, kw, c, cmp, icards, meter, tiers } from './_twc-chung.mjs';

export const deck = { key: 'twc-00-1', code: 'TWC 0.1', title: 'Tailwind is a generator, not a library', sub: 'Section 0 · Lesson 0.1' };
const O = (k) => { const v = DU_LIEU[`t0-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-0-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-00-1', ten, { vp: 640, ...o });
const n = (x) => Number(x).toLocaleString('en-US');

// ── số đo (chạy thật t0-1 · Tailwind 4.3.5 · Chromium · frontend/ 14/11/2026)
const KHO = O('kho').split('\n').filter((l) => /^\s*\d+$/.test(l)).map((l) => l.trim());
const P = Object.fromEntries(doan('phinh', '1 thẻ').concat(doan('phinh', '1000 thẻ')).filter((l) => /byte/.test(l)).map((l) => { const m = l.match(/^(\d+) thẻ:\s+(\d+) byte/); return [m[1], m[2]]; }));
const MAU = JSON.parse(A('dong').ketQua.mau), MT = JSON.parse(A('thu').ketQua.mt);
const DONG = doan('dong', "for s in");
if (KHO.join() !== '1673,49298,6169' || P['1'] !== P['1000'] || !/0$/.test(DONG[0]) || MAU[0][1] !== 'rgb(0, 0, 0)' || MT[0][1] !== MT[1][1] || !/ 1$/.test(doan('chu', 'printf')[0])) throw new Error('số đo đổi');
const SCRIPT = `const mau = 'red';
// VỠ — tên lớp ghép từ biến lúc chạy
sai.className = \`text-\${mau}-500 font-bold\`;
// CHẠY — bảng tra viết TRỌN tên lớp
const LOP = { red: 'text-red-600',
              green: 'text-green-600' };
dung.className = LOP[mau] + ' font-bold';`;

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.1', t: 'Tailwind is a generator,<br>not a library', sub: 'One sentence explains almost everything surprising about Tailwind. Three consequences, each proved with a real build — and measured again on this site\'s 1,673 components',
    en: 'Lesson zero point one. One sentence explains almost everything surprising about Tailwind. We prove its three consequences with real builds, and measure the idea again on this site\'s frontend.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why "library" is the wrong word — and the sentence that replaces it</li>
    <li>Consequence 1: a class never written is never generated</li>
    <li>Consequence 2: the scanner reads <b>text</b>, not code — so a built name does nothing</li>
    <li>Consequence 3: the output order is Tailwind's, not yours</li>
    <li>Why the stylesheet stops growing, measured on a real app</li></ul>`,
    en: 'Five takeaways: why library is the wrong word; consequence one, a class never written is never generated; consequence two, the scanner reads text, not code; consequence three, the order is Tailwind\'s; and why the stylesheet stops growing, measured on a real app.' },
  { t: 'Why "library" is the wrong word', body: cmp(['', 'A library (Bootstrap)', 'A generator (Tailwind)'], [
      ['The CSS file', 'fixed, prepared in advance', '<b>written</b> on every build, for your project'],
      ['Which classes exist', 'all of them, used or not', 'only the ones found in your files'],
      ['How it finds them', '—', 'a scanner reads your files as plain text'],
      ['Grows with', 'nothing (it is fixed)', 'the number of <i>distinct</i> classes you use'],
      ['Who orders the rules', 'the library author', 'Tailwind — when it writes the file'],
    ]) + box('The sentence', 'Tailwind reads your source files as text, collects every string that <b>looks like</b> a class name, and writes a CSS file containing <b>only</b> those.', 'xanh'),
    en: 'Why library is the wrong word. A library is a fixed file: every class exists whether you use it or not. A generator writes the file on every build, for your project, containing only classes a scanner found in your files as plain text. So it grows with the number of distinct classes, and Tailwind decides the order of the rules.' },
  { t: 'Consequence 1: never written ⇒ never generated', body: two(D(tn(['$ cat index.html', '<h1 class="text-2xl font-bold">Xin chào</h1>', '$ npx @tailwindcss/cli -i input.css -o out.css --minify', doan('vang', '@tailwindcss/cli')[0], "$ grep -c 'text-4xl' out.css", ...doan('vang', "grep -c 'text-4xl'"), '$ sed … text-2xl → text-4xl && cat index.html', ...doan('vang', 'sed -i'), '$ npx @tailwindcss/cli … && grep -o \'.text-4xl{…}\' out.css', ...doan('vang', 'grep -o')].join('\n'), { fs: 15, wrap: 66, title: 'Tailwind 4.3.5 (real)' })),
    D(box('Read it', 'Before the edit, <code>.text-4xl</code> is not "unused" — it is <b>absent</b>: 0 matches. Write the class once, build again, and the rule appears.', 'lam'),
      box('Why that is good', 'The output stays small: it contains your vocabulary and nothing else. The price comes next.', 'xanh')), 'r64'),
    en: 'Consequence one: a class never written is never generated. The page uses text two xl; grep the output for text four xl: zero. Not unused, absent. Change the page to text four xl, build again, and the rule appears, pointing at a size from the scale.' },
  { t: 'Consequence 2: the scanner reads text, not code', body: two(D(html(SCRIPT, { sm: true, hl: [3, 5, 6, 7] }), tn(['$ npx @tailwindcss/cli -i input.css -o out.css', ...doan('dong', '@tailwindcss/cli'), '$ grep -c \'^ *<class> {\' out.css', ...DONG].join('\n'), { fs: 15, title: 'build + grep (real)' })),
    D(B('dong', { url: 'dong/index.html', h: 110, w: 520 }),
      tn(['# Chromium · getComputedStyle(p).color', ...MAU.map(([k, m]) => `${k.padEnd(24)}${m}`)].join('\n'), { fs: 14, wrap: 60, title: 'Chromium (real)' }),
      box('Read it', 'The class <b>is</b> on the element. There is <b>no rule</b> for it: the scanner saw <code>text-</code> and <code>-500</code>, never the word <code>text-red-500</code>. The text stays black. No error anywhere.', 'do2')), 'r64'),
    en: 'Consequence two: the scanner reads text, not code. One paragraph builds its class from a variable, the other picks a whole name from a lookup object. The build has rules for text red six hundred and for font bold, but zero for text red five hundred. Chromium: the first paragraph is black, the second red. No error anywhere.' },
  { t: '…and why that bug can hide', body: two(D(tn(['$ sed … && grep -n VỠ index.html      # only a COMMENT changes', ...doan('chu', 'grep -n'), '$ npx @tailwindcss/cli -i input.css -o out2.css', ...doan('chu', '@tailwindcss/cli'), '$ grep -c \'^ *.text-red-500 {\' out2.css', ...doan('chu', 'printf')].join('\n'), { fs: 15, wrap: 66, title: 'Tailwind 4.3.5 (real)' })),
    D(box('Read it', 'A <b>comment</b> that mentions <code>text-red-500</code> makes the rule exist, and the "broken" paragraph turns red. The scanner does not know what a comment is — it reads text.', 'do2'),
      box('So', 'Built class names can look fine for months, because some other file, story or comment happens to spell the name out. Delete that file and the bug comes back. Lesson 10.5 hunts this family.', 'lam')), 'r64'),
    en: 'And why that bug can hide. Change nothing but a comment, so that it mentions text red five hundred, and build again: now the rule exists, and the broken paragraph turns red. The scanner does not know what a comment is. A built class name can look fine for months because another file happens to spell it out.' },
  { t: 'Consequence 3: the order is Tailwind\'s, not yours', body: two(D(tn(['$ grep -nE \'^ *\\.mt-(2|8|\\[7px\\]) \\{\' out.css', ...doan('thu', 'grep -nE'), '# Chromium · getComputedStyle(p).marginTop', ...MT.map(([k, m]) => `class="${k.replace(' bg-cyan-100', '')}"`.padEnd(22) + m)].join('\n'), { fs: 16, title: 'build + Chromium (real)' })),
    D(B('thu', { url: 'thu/index.html', h: 200, w: 520 }),
      box('Read it', '<code>mt-8 mt-2</code> and <code>mt-2 mt-8</code> both get <b>32px</b>. Tailwind wrote <code>.mt-8</code> after <code>.mt-2</code> in the file, so <code>mt-8</code> wins either way — the cascade from Start here 2/2. Chapter 3 measures that order exactly.', 'lam')), 'r64'),
    en: 'Consequence three: the order is Tailwind\'s, not yours. Two paragraphs list mt eight and mt two in opposite orders. Both get thirty-two pixels: in the file Tailwind wrote, mt eight comes after mt two, so it wins either way. That is just the cascade. Chapter three measures the order exactly.' },
  { t: 'Measured on a real app: this site\'s frontend', body: two(D(tn(['$ cd frontend', '$ find src -name "*.tsx" | wc -l', KHO[0], `$ grep -ho 'className="[^"]*"' -r src \\\n    --include="*.tsx" | wc -l`, KHO[1], '$ … | tr " " "\\n" | sort -u | wc -l   # distinct', KHO[2]].join('\n'), { fs: 16, wrap: 56, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Changed since the lesson was written', `The written lesson measured 793 files, 26,343 attributes, 3,683 distinct classes. Today: ${n(KHO[0])}, ${n(KHO[1])}, ${n(KHO[2])}. The app more than doubled — the ratio is what matters.`, 'lam'),
      box('Read the ratio', `${n(KHO[1])} class attributes use only ${n(KHO[2])} distinct utilities — about ${Math.round(KHO[1] / KHO[2])} uses each. The generated CSS follows the <b>vocabulary</b>, not the usage.`, 'xanh')), 'r64') +
    meter([['className="…" attributes', +KHO[1], '#94a3b8'], ['distinct utilities (≈ CSS rules)', +KHO[2], '#0891b2']], { don: '', nhan: 330, fs: 19, rh: 52 }),
    en: 'Measured on a real app, this site\'s frontend, today: one thousand six hundred seventy-three component files, forty-nine thousand class attributes, but only six thousand one hundred sixty-nine distinct utilities, about eight uses each. When the lesson was written the numbers were half that; the ratio is what matters. The CSS follows the vocabulary, not the usage.' },
  { t: 'Why the stylesheet stops growing', body: two(D(tn(['$ cat the.html     # one card, 7 classes', DU_LIEU['t0-1:file:the.html'].trim().replace('<p class', '\n  <p class').replace('<h2 class', '\n  <h2 class'), '$ npx @tailwindcss/cli … && wc -c < out.css', ...doan('phinh', '1 thẻ'), '$ for i in $(seq 1000); do cat the.html; done > index.html', '$ grep -o \'class="\' index.html | wc -l', ...doan('phinh', "grep -o 'class"), '$ npx @tailwindcss/cli … && wc -c < out.css', ...doan('phinh', '1000 thẻ')].join('\n'), { fs: 16, wrap: 66, title: 'Tailwind 4.3.5 (real)' })),
    box('Read it', `One card or a thousand copies of it: <b>${n(P['1'])} bytes</b> both times. In hand-written CSS a new component usually means a new rule block; under a generator, reusing classes adds <b>zero</b> bytes. Only a new <i>distinct</i> class adds a rule.`, 'lam'), 'r64') +
    meter([['1 card (7 class attributes)', +P['1'], '#0891b2'], ['1,000 cards (3,000 attributes)', +P['1000'], '#0891b2']], { don: 'bytes', nhan: 330, fs: 19, rh: 52 }),
    en: 'Why the stylesheet stops growing. One card with seven classes: six thousand six hundred fifty-two bytes of CSS. A thousand copies of the same card, three thousand class attributes: exactly the same size. Reusing classes adds zero bytes; only a new distinct class adds a rule.' },
  { t: 'Trap: searching the docs for a class name', body: two(D(tn(['$ grep -A2 \'mt-\\[7px\\] {\' out.css', ...doan('thu', 'grep -A2')].join('\n'), { fs: 17, title: 'an arbitrary value, built (real)' }),
      steps([`Need ${c('margin-top: 16px')}? 16 ÷ 4 = 4 ⇒ ${c('mt-4')} (the scale, Ch. 1)`, `Need a value off the scale? ${c('mt-[7px]')} — Tailwind writes the rule for you`, 'Names are generated from a few rules: learn the rules, the names fall out'])),
    box('The wrong strategy', 'Searching "tailwind class for …", finding nothing, and concluding Tailwind cannot do it. The class usually exists and follows from the <b>scale</b> — or the answer is an arbitrary value like <code>mt-[7px]</code>, measured above as <code>margin-top: 7px</code>.', 'do2'), 'r64'),
    en: 'A trap: searching the docs by name, finding nothing, and deciding Tailwind cannot do it. The class usually follows from the scale: sixteen pixels divided by four is mt four. And for a value off the scale, an arbitrary value like mt bracket seven px makes Tailwind write margin-top seven pixels. Learn the rules; the names fall out.' },
  { t: 'What this course does with the sentence', body: tiers([
      ['type', 'Ch. 1–2 · Vocabulary', 'the scale, and why learning it beats memorising names'],
      ['merge', 'Ch. 3–4 · Where it leaks', 'generated order decides conflicts; composing classes safely'],
      ['wrench', 'Ch. 5–7 · Configure the generator', 'extend the scale, CSS variables for themes, layers'],
      ['search', 'Ch. 8–10 · Operate it', 'size, accessibility, the "my class does nothing" cookbook'],
    ], { th: 62, gap: 20 }) + box('One sentence, three consequences', 'Never written ⇒ never generated · reused ⇒ zero bytes · conflicts ⇒ Tailwind\'s order.', 'xanh'),
    en: 'What the course does with that sentence. Chapters one and two give you the vocabulary. Three and four are where it leaks. Five to seven configure the generator. Eight to ten operate it. Hold the three consequences: never written means never generated, reuse costs zero bytes, and conflicts follow Tailwind\'s order.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Generator', 'writes CSS from the classes it finds'), kw('Library', 'a fixed stylesheet, every class present'),
      kw('Text scanner', 'reads files as text — no JSX, no expressions'), kw('Dynamic class bug', 'built at runtime ⇒ never generated'),
      kw('Vocabulary vs usage', 'size follows distinct classes'), kw('Source order', 'Tailwind orders the rules it writes'),
      kw('Arbitrary value', 'mt-[7px] — a rule for an off-scale value'), kw('Built CSS', 'grep it to see what exists'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: generator; library; text scanner; the dynamic class bug; vocabulary versus usage; source order; arbitrary value; and the built CSS.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a page without ${c('text-4xl')}, grep for it, add it, build again`,
      `Build a class from a variable; check the rule and the colour in DevTools; fix it with a lookup object`,
      'Mention the full name in a comment and watch the "bug" disappear — then remove it',
      `Copy one card 1,000 times: does ${c('wc -c out.css')} move?`,
    ]), box('Keep these', '<ul><li>Tailwind writes CSS from text it finds</li><li>Never written ⇒ never generated</li><li>Write class names whole</li><li>Reuse costs zero bytes</li><li>Tailwind\'s order decides conflicts</li></ul>', 'lam'), ''),
    en: 'Your turn: grep for a class before and after you write it; build a class from a variable and fix it with a lookup object; watch a comment hide the bug; and copy one card a thousand times and compare sizes. Keep: never written means never generated, write class names whole, and Tailwind\'s order decides conflicts.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — What Tailwind actually is', bai: '0.1' }, S);
