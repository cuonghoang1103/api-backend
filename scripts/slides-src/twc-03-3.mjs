/*DU_LIEU*/
const DU_LIEU = {
 "t3-3:kho": "$ git ls-files 'src/*.tsx' | wc -l\n    1677\n$ grep -nE \"clsx|twMerge|export const cn\" src/lib/utils.ts\n2:import { clsx, type ClassValue } from 'clsx';\n3:import { twMerge } from 'tailwind-merge';\n5:export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));\n$ git grep -ohP '\\bcn\\(' -- 'src/*.tsx' | wc -l\n    1100\n$ git grep -ohP 'className=\\{`[^`]*`\\}' -- 'src/*.tsx' | wc -l\n    1617\n$ git grep -ohP 'className=\\{`[^`]*`\\}' -- 'src/*.tsx' | grep -c '\\${'\n1616\n$ a=$(git grep -ohP 'className=\\{`[^`]*`\\}' -- 'src/*.tsx' | grep -c '\\${'); b=$(git grep -ohP '\\bcn\\(' -- 'src/*.tsx' | wc -l); echo \"$a $b\" | awk '{printf \"%.1f%% di vong bo hop nhat (grep theo dong)\\n\", $1*100/($1+$2)}'\n59.5% di vong bo hop nhat (grep theo dong)",
 "t3-3:prop": "$ git grep -lP 'className\\??:\\s*string' -- 'src/*.tsx' | wc -l\n     141\n$ git grep -lP 'className\\??:\\s*string' -- 'src/*.tsx' | xargs grep -l '\\${className' | wc -l\n      50\n$ git grep -lP 'className\\??:\\s*string' -- 'src/*.tsx' | xargs grep -lE 'cn\\([^)]*className' | wc -l\n      35\n$ git grep -lP 'className\\??:\\s*string' -- 'src/*.tsx' | xargs grep -l '\\${className' | head -4\nsrc/app/about/quy-trinh/StageDoc.tsx\nsrc/app/exam/ExamRichContent.tsx\nsrc/components/admin/ui.tsx\nsrc/components/chat/claude/CuongMiniPanda.tsx\n$ git grep -ohP '\\bclsx\\(' -- 'src/*.tsx' | wc -l\n       0",
 "t3-3:file:tron.cjs": "// tron.cjs — clsx (2.1.1) va tailwind-merge (2.6.1) LAY TU node_modules CUA KHO (chi doc), dung cn() y nhu src/lib/utils.ts\nconst K = '/Users/admin/.rtq-twc/lab/kho/node_modules/';\nconst { clsx } = require(K + 'clsx'); const { twMerge } = require(K + 'tailwind-merge');\nconst cn = (...i) => twMerge(clsx(i));\nconst NEN = 'rounded-[20px] border border-white/[0.13] bg-[var(--a-card)] p-5';\nfor (const goi of ['p-0', 'p-10', 'mb-8']) {\n  console.log(`goi ${goi.padEnd(5)} chuoi mau: \"${`${NEN} ${goi}`.split(' ').slice(-2).join(' ')}\"  cn(): \"${cn(NEN, goi).split(' ').slice(-2).join(' ')}\"`);\n}\nconsole.log('clsx(\"px-4\", \"px-8\")        =', JSON.stringify(clsx('px-4', 'px-8')));\nconsole.log('twMerge(clsx(\"px-4\",\"px-8\")) =', JSON.stringify(cn('px-4', 'px-8')));\n",
 "t3-3:tron": "$ node tron.cjs\ngoi p-0   chuoi mau: \"p-5 p-0\"  cn(): \"bg-[var(--a-card)] p-0\"\ngoi p-10  chuoi mau: \"p-5 p-10\"  cn(): \"bg-[var(--a-card)] p-10\"\ngoi mb-8  chuoi mau: \"p-5 mb-8\"  cn(): \"p-5 mb-8\"\nclsx(\"px-4\", \"px-8\")        = \"px-4 px-8\"\ntwMerge(clsx(\"px-4\",\"px-8\")) = \"px-8\"\n$ grep '\"version\"' ../kho/node_modules/clsx/package.json ../kho/node_modules/tailwind-merge/package.json\n../kho/node_modules/clsx/package.json:  \"version\": \"2.1.1\",\n../kho/node_modules/tailwind-merge/package.json:    \"version\": \"2.6.1\",\n../kho/node_modules/tailwind-merge/package.json:        \"version\": \"zx scripts/update-readme.mjs\",",
 "t3-3:file:tw.config.js": "module.exports = { content: ['./*.html'] };\n",
 "t3-3:file:in.css": "@tailwind base;\n@tailwind utilities;\n",
 "t3-3:file:sec.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 bg-slate-800 p-4 text-lg text-white\">\n  <!-- Section cua admin/ui.tsx:54, nguoi goi dua p-0. Chuoi lop = DUNG cai ma moi cach soan sinh ra (tron.cjs) -->\n  <section id=\"mau\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-5 p-0\">chuỗi mẫu `… p-5 ${className}`</section>\n  <section id=\"cn\" class=\"rounded-[20px] border border-white/20 bg-slate-700 p-0\">cn('… p-5', className)</section>\n</body></html>\n",
 "t3-3:chrome": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 104ms.",
 "t3-3:file:ast.cjs": "// ast.cjs — no-restricted-syntax tren frontend/src/**/*.tsx (CHI DOC): dem bang CAY CU PHAP (AST), khong bang grep theo dong\nmodule.exports = { root: true, parser: '@typescript-eslint/parser', parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },\n  rules: { 'no-restricted-syntax': ['warn',\n    { selector: 'JSXAttribute[name.name=\"className\"] > JSXExpressionContainer > TemplateLiteral[expressions.length>0]',\n      message: 'MAU: chuoi mau KHONG hop nhat, dung cn().' },\n    { selector: 'JSXAttribute[name.name=\"className\"] > JSXExpressionContainer > CallExpression[callee.name=\"cn\"]',\n      message: 'CN: da qua bo hop nhat.' }] } };\n",
 "t3-3:ast": "$ npx eslint --no-eslintrc --no-inline-config -c ast.cjs -f unix --no-ignore '/Users/admin/.rtq-twc/lab/kho/src/**/*.tsx' > $TMPDIR/ast-kho.txt 2>&1; tail -1 $TMPDIR/ast-kho.txt\n3260 problems\n$ grep -c 'MAU: chuoi mau' $TMPDIR/ast-kho.txt\n2169\n$ grep -c 'CN: da qua' $TMPDIR/ast-kho.txt\n1091\n$ m=$(grep -c 'MAU: chuoi mau' $TMPDIR/ast-kho.txt); c=$(grep -c 'CN: da qua' $TMPDIR/ast-kho.txt); echo \"$m $c\" | awk '{printf \"%.1f%% cach soan lop dong di vong bo hop nhat (AST)\\n\", $1*100/($1+$2)}'\n66.5% cach soan lop dong di vong bo hop nhat (AST)\n$ grep 'MAU: chuoi mau' $TMPDIR/ast-kho.txt | sed -E 's#^/Users/admin/.rtq-twc/lab/kho/##; s#:.*##' | sort | uniq -c | sort -rn | head -5\n  52 src/components/admin/crm/Views.tsx\n  45 src/components/admin/CongAnthropicAdmin.tsx\n  42 src/components/courses/chuong-trinh/ChuongTrinhClient.tsx\n  35 src/components/sach-hoc/nhat/OnTapThe.tsx\n  33 src/app/courses/[slug]/CoursePageClient.tsx\n$ grep 'MAU: chuoi mau' $TMPDIR/ast-kho.txt | grep -c 'components/admin/ui.tsx'\n3",
 "anh-twc-3-3:sec": {
  "url": "http://127.0.0.1:20117/ttm/sec.html",
  "vp": [
   560,
   190
  ],
  "rect": {
   "#mau": [
    16,
    16,
    528,
    70
   ],
   "#cn": [
    16,
    98,
    528,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"mau\":\"20px\",\"cn\":\"0px\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tsx, tn, br, box, two, steps, kw, c, cmp, bars } from './_twc-chung.mjs';

export const deck = { key: 'twc-03-3', code: 'TWC 3.3', title: 'Measuring one codebase\'s EXPOSURE', sub: 'Chapter 3 · Lesson 3.3' };
const O = (k) => { const v = DU_LIEU[`t3-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-3-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-03-3', ten, { vp: 560, ...o });
const bo = (x) => x.replace(/\s+/g, '');
const so = (k, dau) => +doan(k, dau)[0].trim();

// ── số đo (chạy thật t3-3 · frontend/ 14/11/2026 · clsx 2.1.1 + tailwind-merge 2.6.1 của kho · eslint 8 + @typescript-eslint/parser · Chromium)
const NTSX = so('kho', 'git ls-files'), NCN = so('kho', "'\\bcn\\('"), NMAU = so('kho', "`\\}' -- 'src/*.tsx' | wc -l"), NNOI = so('kho', "grep -c '\\${'");
const PGREP = doan('kho', 'awk')[0].trim();
const UT = doan('kho', 'utils.ts').map((l) => l.replace(/^\d+:/, '')).join('\n');
const NPROP = so('prop', "'src/*.tsx' | wc -l"), PMAU = so('prop', "'\\${className' | wc -l"), PCN = so('prop', 'cn\\(');
const PDS = doan('prop', 'head -4');
const NCLSX = so('prop', "'\\bclsx\\(");
const TRON = doan('tron', 'node tron.cjs');
const AM = so('ast', "grep -c 'MAU"), AC = so('ast', "grep -c 'CN"), PAST = doan('ast', 'awk')[0].trim(), ATOP = doan('ast', 'uniq -c'), AUI = so('ast', 'admin/ui.tsx');
const SEC = JSON.parse(A('sec').ketQua.s);
if (NTSX !== 1677 || NCN !== 1100 || NMAU !== 1617 || NNOI !== 1616 || !PGREP.startsWith('59.5%')) throw new Error('số đo grep đổi');
if (AM !== 2169 || AC !== 1091 || !PAST.startsWith('66.5%') || AUI !== 3) throw new Error('số đo AST đổi');
if (NCLSX !== 0 || NPROP !== 141 || PMAU !== 50 || PCN !== 35 || SEC.mau !== '20px' || SEC.cn !== '0px') throw new Error('số đo prop/Chromium đổi');
if (!TRON[0].includes('cn(): "bg-[var(--a-card)] p-0"') || TRON[3] !== 'clsx("px-4", "px-8")        = "px-4 px-8"') throw new Error('đầu ra tron đổi');
const AST = `rules: { 'no-restricted-syntax': ['warn',
  { selector: 'JSXAttribute[name.name="className"]
      > JSXExpressionContainer
      > TemplateLiteral[expressions.length>0]',
    message: 'MAU: chuoi mau KHONG hop nhat, dung cn().' },
  { selector: 'JSXAttribute[name.name="className"]
      > JSXExpressionContainer
      > CallExpression[callee.name="cn"]',
    message: 'CN: da qua bo hop nhat.' }] }`;
if (!bo(O('file:ast.cjs')).includes(bo(AST))) throw new Error('mã hiển thị KHÔNG khớp ast.cjs');
const pct = (s) => s.split('%')[0];

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.3', t: 'Measuring one codebase\'s<br>EXPOSURE', sub: '"This can happen" and "this is happening in 2,169 places" call for different responses. Counting this site\'s class composition — with grep, then with the syntax tree, and why the two disagree',
    en: 'Lesson three point three. Lessons three point one and three point two described a failure. This lesson asks how much of a real application is standing in it. "This can happen" and "this is happening in two thousand places" call for different responses.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The two ways to build a class string: <code>cn()</code> (merges) vs a template literal (concatenates)</li>
    <li>This site counted two ways: grep says <b>${pct(PGREP)}%</b>, the syntax tree says <b>${pct(PAST)}%</b> — and why</li>
    <li>Exposure is not defects — and where it matters most: the <code>className</code> prop</li>
    <li>A migration with no downside, measured in Chromium</li>
    <li>Making the rule enforceable — and why <code>clsx</code> alone is not enough</li></ul>`,
    en: 'Five takeaways: the two ways to build a class string; this site counted two ways, grep says fifty-nine and a half percent, the syntax tree says sixty-six and a half, and why; exposure is not defects; a migration with no downside; and making the rule enforceable.' },
  { t: 'Two ways to build a class string', body: two(D(tsx(`// frontend/src/lib/utils.ts\n${UT.replace(' => twMerge', ' =>\n  twMerge')}`, { sm: true }),
      box('Safe: cn()', '<code>clsx</code> flattens the conditions into one string; <code>twMerge</code> then <b>resolves</b> Tailwind conflicts inside it, so the class written <b>last</b> wins — the intuition of lesson 3.1, restored.', 'xanh'),
      box('Exposed: a template literal', '<code>className={`px-4 py-2 ${className}`}</code> only <b>concatenates</b>. Who wins is decided by the stylesheet (3.1) and the sort (3.2).', 'do2')),
    D(cmp(['caller passes', 'template string ends', 'cn() ends'], TRON.slice(0, 3).map((l) => { const m = l.match(/goi (\S+)\s+chuoi mau: "([^"]+)"\s+cn\(\): "([^"]+)"/); return [`<code>${m[1]}</code>`, `<code>…${m[2]}</code>`, `<code>…${m[3].split(' ').pop()}</code>`]; }), { hl: [0] }),
      box('Read it (node tron.cjs — clsx 2.1.1 + tailwind-merge 2.6.1 from this site)', 'For the admin <code>Section</code> (base <code>p-5</code>): the template keeps <b>both</b> <code>p-5 p-0</code>; <code>cn()</code> drops <code>p-5</code>. With <code>mb-8</code> (no conflict) both give the same string — that is the whole migration argument.', 'lam')), 'r46'),
    en: 'Two ways to build a class string. The site has a cn helper: clsx flattens, twMerge resolves conflicts, so the last class wins. A template literal only concatenates. Run with the site\'s own packages: the template keeps p-five p-zero; cn drops p-five. With mb-eight, both give the same string.' },
  { t: 'Count it: the grep way', body: two(D(tn([`$ git grep -ohP '\\bcn\\(' -- 'src/*.tsx' | wc -l`, String(NCN), "$ git grep -ohP 'className=\\{`[^`]*`\\}' -- 'src/*.tsx' | wc -l", String(NMAU), "$ … | grep -c '\\${'   # with a real interpolation", String(NNOI), '$ … | awk …', PGREP].join('\n'), { fs: 14, wrap: 58, title: `frontend/ · ${NTSX} .tsx · 14/11/2026 (real)` })),
    D(cmp(['', 'old lesson', '14/11/2026'], [['<code>cn(</code> calls', '197', `<b>${NCN}</b>`], ['template <code>className</code>', '633', `<b>${NMAU}</b>`], ['…with <code>${…}</code>', '631', `<b>${NNOI}</b>`], ['exposed share', '76,2%', `<b>${pct(PGREP)}%</b>`]], { hl: [3] }),
      box('Read it', `${NNOI} of ${NMAU} template strings interpolate — they are genuinely dynamic. The team writes far more <code>cn()</code> than when the lesson was first measured, and the share went down. But grep has a blind spot — next slide.`, 'lam')), 'r46'),
    en: 'Count it the grep way. One thousand one hundred cn calls. One thousand six hundred seventeen template class names, all but one interpolating. That is fifty-nine and a half percent going around the merger, down from seventy-six when this lesson was first written. But grep has a blind spot.' },
  { t: 'grep reads LINES — the syntax tree reads CODE', body: two(D(tsx(AST, { sm: true }), tn([`$ npx eslint --no-inline-config -c ast.cjs '…/src/**/*.tsx'`, `MAU (template in className): ${AM}`, `CN  (cn() in className):     ${AC}`, PAST].join('\n'), { fs: 14, wrap: 58, title: 'eslint 8 + @typescript-eslint/parser (real)' })),
    D(bars([[`template literal (AST)`, AM, '#b91c1c'], ['template literal (grep)', NNOI, '#f59e0b'], ['cn() in className (AST)', AC, '#0891b2']], { w: 500, nhan: 215, don: '', fs: 14 }),
      box('Why they disagree', `<code>git grep</code> matches one line at a time, so a template that spans several lines — common in long JSX — is <b>invisible</b> to it: ${AM - NNOI} of them. The AST rule parses the file. Exposure is <b>${pct(PAST)}%</b>, not ${pct(PGREP)}%.`, 'do2')), 'r46'),
    en: 'Grep reads lines; the syntax tree reads code. An ESLint rule that matches a template literal directly inside className finds two thousand one hundred sixty-nine, against one thousand ninety-one cn calls. Grep missed five hundred fifty-three multi-line templates. Exposure is sixty-six and a half percent.' },
  { t: 'What the percentage means — and does NOT mean', body: two(D(box('It is NOT 2,169 bugs', 'Most interpolations append a class that nothing else in the string competes with — <code>mb-8</code> after <code>p-5</code>. Those render correctly today and will keep doing so.', 'xanh'),
      box('It IS 2,169 exposures', 'Places where a <b>future</b> edit that introduces a competing utility will fail <b>silently</b> — no lint error, no test, no console message.', 'do2')),
    D(cmp(['place', 'today', 'after one future edit'], [['<code>Section</code> + <code>mb-8</code>', 'correct', '—'], ['<code>Section</code> + <code>p-0</code>', '—', `padding <b>${SEC.mau}</b>, not 0 (3.1)`]], { hl: [1] }),
      box('Vocabulary', 'Security people call this <b>attack surface</b>: you count unlocked windows, not burglaries. Exposure is the number that predicts future bugs.', 'lam')), 'r46'),
    en: 'What the percentage means. It is not two thousand bugs: most interpolations append a class nothing competes with. It is two thousand exposures: places where a future edit with a competing utility fails silently. Security people call it attack surface: you count unlocked windows, not burglaries.' },
  { t: 'Where exposure matters most: the className prop', body: two(D(tn([`$ git grep -lP 'className\\??:\\s*string' -- 'src/*.tsx' | wc -l`, String(NPROP), "$ … | xargs grep -l '${className' | wc -l     # template", String(PMAU), "$ … | xargs grep -lE 'cn\\([^)]*className' | wc -l   # cn()", String(PCN), '$ … | head -4', ...PDS].join('\n'), { fs: 13, wrap: 62, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('A contract', `${NPROP} components expose a <code>className</code> prop — each one a promise: "give me classes and I will apply them". Whether the promise holds depends entirely on whether the component merges. <b>${PMAU}</b> files concatenate it into a template; <b>${PCN}</b> pass it through <code>cn()</code>; the rest hand it straight to a child.`, 'lam'),
      box('Why here first', 'Inside a component, the author sees every class. Through a prop, a <b>caller</b> injects a class the author never saw — the exact situation of lesson 3.1.', 'do2')), 'r46'),
    en: 'Where exposure matters most: the className prop. One hundred forty-one components expose one, each a promise to apply the caller\'s classes. Fifty files concatenate it into a template, thirty-five merge it with cn. Through a prop, a caller injects a class the author never saw: lesson three point one exactly.' },
  { t: 'The honest version vs the coin-toss version', body: two(D(B('sec', { url: 'ttm/sec.html · Section + caller p-0 · Tailwind 3.4.19', h: 170, w: 560 }),
      cmp(['how the class string is built', 'padding-top'], [['template <code>`… p-5 ${className}`</code>', `<b style="color:#b91c1c">${SEC.mau}</b>`], ['<code>cn(\'… p-5\', className)</code>', `<b>${SEC.cn}</b> ✓`]], { hl: [1] })),
    D(box('Honest: cn(\'px-4 py-2\', className)', 'The caller\'s classes are merged <b>last</b> and win every conflict, for every possible input. This is a prop you can document.', 'ok'),
      box('Coin-toss: `px-4 py-2 ${className}`', 'Whether the caller wins depends on the generated order of two utilities that happen to collide: <code>px-8</code> wins, <code>px-10</code> loses (3.1). Same code, different result per input.', 'do2')), 'r46'),
    en: 'The honest version versus the coin-toss version. The same Section, the caller asks for p-zero. The template version measures twenty pixels; the cn version measures zero. With cn, the caller wins every conflict for every input. With the template, it depends on which two utilities collide.' },
  { t: 'Why fix it where nothing is broken yet', body: cmp(['check', 'does it catch a template conflict?'], [
      ['<code>tsc</code>', 'no — the template is valid TypeScript and valid JSX'],
      ['lint (<code>no-contradicting-classname</code>)', 'no — the conflict only exists <b>after</b> interpolation at runtime (3.2)'],
      ['runtime / console', 'no — the class attribute is built exactly as written; the DOM is correct'],
      ['DevTools', 'only if you open Styles and <b>notice</b> the struck-through declaration'],
      ['tests', 'only for the inputs someone tested — it passes with <code>mt-4</code>, fails with <code>px-10</code>'],
    ]) + box('Shape of the failure', 'Invisible to every automatic check, and <b>flaky per input</b>. That is why the migration is worth doing before anything breaks.', 'do2'),
    en: 'Why fix it before anything breaks. Tsc: no. The lint rule: no, the conflict only exists after interpolation. Runtime: no, the DOM is exactly as written. DevTools: only if you notice a struck-through line. Tests: only for the inputs someone tried. Invisible, and flaky per input.' },
  { t: 'A migration with no downside', body: two(D(tsx('// before — concatenates\nclassName={`rounded-lg p-5 ${className}`}\n\n// after — merges, caller last\nclassName={cn(\'rounded-lg p-5\', className)}', { sm: true }),
      box('Why it is safe', 'In every case <b>without</b> a conflict, <code>cn()</code> returns the same classes (measured: <code>mb-8</code> ⇒ <code>p-5 mb-8</code> both ways). In every case <b>with</b> one, it fixes it. There is no input where the template is right and <code>cn()</code> is wrong.', 'xanh')),
    D(box('Order of work', `<ol><li>The <b>${PMAU}</b> components that concatenate a <code>className</code> prop</li><li>New code: <code>cn()</code> only (enforced — next slide)</li><li>The rest of the ${AM.toLocaleString('en-US')} when you touch the file anyway</li></ol>`, 'lam'),
      box('Cost', 'Diff size only. Lesson 3.4 measures the runtime price of <code>twMerge</code>: about a microsecond.', 'ok')), 'r46'),
    en: 'A migration with no downside. Replace the template with cn, caller last. In every case without a conflict, cn returns the same classes; in every case with one, it fixes it. Start with the fifty components that concatenate a className prop, enforce cn for new code, and migrate the rest as you go.' },
  { t: 'Make the rule ENFORCEABLE', body: two(D(tsx(AST, { sm: true })),
    D(tn(['$ … | sort | uniq -c | sort -rn | head -5   # most exposed files', ...ATOP.map((l) => l.replace('src/components/', 'components/').replace('src/app/', 'app/'))].join('\n'), { fs: 13, wrap: 60, title: 'AST rule over frontend/ (real)' }),
      box('Warn first, then error for new code', `A rule that breaks the build on day one with ${AM.toLocaleString('en-US')} existing hits gets switched off on day two. Ship it as <b>warn</b> with the existing hits as accepted debt; make it <b>error</b> on changed lines only. The proof that memory alone fails: <code>cn()</code> exists and is used ${AC.toLocaleString('en-US')} times — the team knows — and still most composition goes around it.`, 'lam')), 'r46'),
    en: 'Make the rule enforceable. The same AST rule, as a team rule. Ship it as a warning, with the existing hits accepted as debt, and as an error on changed lines only. A rule that breaks the build on day one gets switched off on day two. The team knows cn, and still most composition goes around it.' },
  { t: 'Trap: "clsx is enough"', body: two(D(tn(['$ node tron.cjs   # last two lines', TRON[3], TRON[4]].join('\n'), { fs: 15, wrap: 56, title: 'clsx 2.1.1 · tailwind-merge 2.6.1 (real)' }),
      box('Read it', '<code>clsx</code> (and <code>classnames</code>) handle conditions beautifully and do <b>nothing</b> about Tailwind conflicts — they concatenate. <code>clsx(\'px-4\', \'px-8\')</code> is <code>"px-4 px-8"</code>, exactly the template problem.', 'do2')),
    D(box('So count it as exposed', `A codebase that composes with bare <code>clsx</code> is exactly as exposed as one using template literals. This site calls <code>clsx(</code> directly <b>${NCLSX}</b> times in its components — it is only used inside <code>cn()</code>, which wraps it in <code>twMerge</code> precisely because the two do different jobs.`, 'lam'),
      box('Related trap', 'Adding <code>cn()</code> but passing the caller <b>first</b>: <code>cn(className, \'px-4\')</code> merges correctly and does the opposite of what you meant. Lesson 3.4.', 'xanh')), 'r46'),
    en: 'The trap: clsx is enough. Clsx and classnames handle conditions well and do nothing about Tailwind conflicts: clsx of px-four and px-eight is the string px-four px-eight. Count bare clsx as exposed. This site only uses clsx inside cn, wrapped in twMerge, because the two do different jobs.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'Your phone\'s settings show <b>how many apps can read your location</b> — not how many have misused it. That count is exposure, and it is the number you act on. Same here: 2,169 unlatched windows, not 2,169 break-ins.', 'lam'),
      box('What if…', '…the design team adds a default <code>p-6</code> to a shared card next sprint? Every template caller that passes its own padding becomes a silent coin-toss overnight. The ones using <code>cn()</code> keep working.', 'xanh')),
    D(box('The attacker\'s view: cn() is not a sanitizer', '<code>cn()</code> makes the <b>last</b> class win — exactly what an attacker who controls the last argument wants. If a <code>className</code> can come from a CMS, a URL or user settings, <code>cn(base, userClass)</code> lets <code>hidden</code> or <code>fixed inset-0 z-50</code> win cleanly (lesson 2.5). Never pass user-controlled strings as classes; map user choices to an <b>allow-list</b> of known classes on the server.', 'do2')), 'r46'),
    en: 'In real life: your phone shows how many apps can read your location, not how many misused it; that count is exposure. What if the design team adds a default padding next sprint? Template callers break overnight. The attacker view: cn is not a sanitizer; it lets an attacker\'s last class win. Allow-list user choices.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('cn()', 'twMerge(clsx(inputs)) — flatten, then resolve'), kw('clsx', 'flattens conditions — never resolves conflicts'), kw('twMerge', 'keeps the last class of each property'),
      kw('exposure', 'places a FUTURE conflict breaks silently'), kw('attack surface', 'count unlocked windows, not break-ins'), kw('className prop', 'a contract — holds only if merged'),
      kw('AST rule', 'parses code; grep reads lines'), kw('warn, then error', 'accept old debt, block new'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: cn; clsx, which only flattens; twMerge, which resolves; exposure; attack surface; the className prop as a contract; the AST rule versus grep; and warn first, then error.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Count ${c('cn(')} and template ${c('className')} in your project with grep`,
      `Count them again with the ${c('no-restricted-syntax')} AST rule — compare`,
      `List components with a ${c('className?: string')} prop; which ones merge?`,
      `Migrate one to ${c("cn('…', className)")} and test it with a conflicting class`,
    ]), box('Keep these', '<ul><li>Measure exposure, do not guess it</li><li>grep reads lines; the AST reads code</li><li>Exposure ≠ defects — but it predicts them</li><li>clsx alone concatenates; cn() merges</li></ul>', 'lam'), ''),
    en: 'Your turn: count with grep, count again with the AST rule and compare, list the components with a className prop, and migrate one to cn, testing it with a conflicting class. Keep: measure exposure, grep reads lines, and exposure is not defects but predicts them.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Conflicts, where the model leaks', bai: '3.3' }, S);
