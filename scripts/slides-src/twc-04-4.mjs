/*DU_LIEU*/
const DU_LIEU = {
 "t4-4:file:bang.cjs": "// bang.cjs — CUNG mot nut, hai cach viet: chuoi dieu kien (if-chain) vs cva 0.7.1; ca hai qua cn() THAT cua kho. Ra cung chuoi lop khong?\nconst K = '/Users/admin/.rtq-twc/lab/kho/node_modules/';\nconst { clsx } = require(K + 'clsx'); const { twMerge } = require(K + 'tailwind-merge'); const cn = (...i) => twMerge(clsx(i));\nconst { cva } = require('class-variance-authority');\nconst NEN = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors';\nconst neu = (variant, size) => cn(NEN,\n  variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700', variant === 'ghost' && 'bg-transparent text-blue-600 hover:bg-blue-50', variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',\n  size === 'sm' && 'h-8 px-3 text-xs', size === 'md' && 'h-10 px-4 text-sm', size === 'lg' && 'h-12 px-6 text-base',\n  variant === 'ghost' && size === 'sm' && 'border border-blue-200');                       // ngoai le KEP: phai hoi CA HAI truc\nconst button = cva(NEN, {\n  variants: { variant: { primary: 'bg-blue-600 text-white hover:bg-blue-700', ghost: 'bg-transparent text-blue-600 hover:bg-blue-50', danger: 'bg-red-600 text-white hover:bg-red-700' },\n              size: { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' } },\n  compoundVariants: [{ variant: 'ghost', size: 'sm', class: 'border border-blue-200' }],\n  defaultVariants: { variant: 'primary', size: 'md' },\n});\nlet giong = 0;\nfor (const v of ['primary', 'ghost', 'danger']) for (const s of ['sm', 'md', 'lg']) {\n  const a = neu(v, s), b = cn(button({ variant: v, size: s })); if (a === b) giong++;\n  console.log((v + ' ' + s).padEnd(11), a === b ? 'GIONG' : 'KHAC ', b.replace(NEN + ' ', ''));\n}\nconsole.log(`${giong}/9 to hop giong het · mac dinh button() =`, JSON.stringify(cn(button()).replace(NEN + ' ', '')));\nmodule.exports = { button, NEN };\n",
 "t4-4:bang": "$ node bang.cjs\nprimary sm  GIONG bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 text-xs\nprimary md  GIONG bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm\nprimary lg  GIONG bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 text-base\nghost sm    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-8 px-3 text-xs border border-blue-200\nghost md    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-10 px-4 text-sm\nghost lg    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-12 px-6 text-base\ndanger sm   GIONG bg-red-600 text-white hover:bg-red-700 h-8 px-3 text-xs\ndanger md   GIONG bg-red-600 text-white hover:bg-red-700 h-10 px-4 text-sm\ndanger lg   GIONG bg-red-600 text-white hover:bg-red-700 h-12 px-6 text-base\n9/9 to hop giong het · mac dinh button() = \"bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm\"",
 "t4-4:file:kieu.ts": "import { cva, type VariantProps } from 'class-variance-authority';\nconst button = cva('rounded-lg', {\n  variants: { variant: { primary: 'bg-blue-600', ghost: 'bg-transparent', danger: 'bg-red-600' }, size: { sm: 'h-8', md: 'h-10', lg: 'h-12' } },\n});\ntype ButtonProps = VariantProps<typeof button>;\nconst ok: ButtonProps = { variant: 'danger', size: 'lg' };\nconst sai: ButtonProps = { variant: 'blue', size: 'xl' };\n",
 "t4-4:kieu": "$ npx tsc --noEmit --strict kieu.ts 2>&1 | sed -E 's/^kieu\\.ts\\(([0-9]+),([0-9]+)\\)/kieu.ts:\\1:\\2/'\nkieu.ts:7:28: error TS2322: Type '\"blue\"' is not assignable to type '\"primary\" | \"ghost\" | \"danger\" | null | undefined'.\nkieu.ts:7:45: error TS2322: Type '\"xl\"' is not assignable to type '\"sm\" | \"md\" | \"lg\" | null | undefined'.",
 "t4-4:file:matran.cjs": "// matran.cjs — ma tran la DU LIEU: sinh trang thu \"du 9 to hop\" thang tu dinh nghia cva (khong viet tay mot the nao)\nconst { button } = require('./bang.cjs');\nlet h = '<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"mt.css\"></head><body class=\"p-4 font-sans\"><table class=\"border-separate border-spacing-3\">';\nh += '<tr><th></th>' + ['sm', 'md', 'lg'].map((s) => `<th class=\"text-slate-500 text-sm\">${s}</th>`).join('') + '</tr>';\nfor (const v of ['primary', 'ghost', 'danger']) h += `<tr><th class=\"text-slate-500 text-sm text-right\">${v}</th>` + ['sm', 'md', 'lg'].map((s) => `<td><button id=\"${v}-${s}\" class=\"${button({ variant: v, size: s })}\">Lưu</button></td>`).join('') + '</tr>';\nrequire('node:fs').writeFileSync('matran.html', h + '</table></body></html>\\n'); console.log('matran.html: 9 nut sinh tu dinh nghia');\n",
 "t4-4:file:mt-in.css": "@tailwind base;\n@tailwind utilities;\n",
 "t4-4:matran": "$ node matran.cjs 2>&1 | tail -1\nmatran.html: 9 nut sinh tu dinh nghia\n$ ../v3/node_modules/.bin/tailwindcss --content './matran.html' -i mt-in.css -o mt.css 2>&1 | tail -1\nDone in 98ms.",
 "t4-4:kho": "$ git grep -c 'cva(' -- 'src/*.ts' 'src/*.tsx' | wc -l\n       0\n$ grep -c 'class-variance-authority' package.json\n0\n$ git grep -lE 'variant(\\?)?:' -- 'src/*.tsx' | wc -l\n      20\n$ git grep -lE 'variant\\s*===' -- 'src/*.tsx' | wc -l\n       0\n$ git grep -lE '[A-Z_]{3,}\\[[a-zA-Z.]*(variant|tone|size|status|kind|level|type)\\]' -- 'src/*.tsx' | wc -l\n     147\n$ git grep -n '^const POST_TONE' -- src/app/admin/page.tsx\nsrc/app/admin/page.tsx:43:const POST_TONE: Record<string, Tone> = { PUBLISHED: 'green', DRAFT: 'gray', SCHEDULED: 'blue', ARCHIVED: 'gray' };\n$ git grep -n 'POST_TONE\\[' -- src/app/admin/page.tsx | cut -c1-110\nsrc/app/admin/page.tsx:263:                    <Status tone={POST_TONE[p.status] ?? 'gray'}>{p.status.charAt(0",
 "t4-4:file:xau.cjs": "// xau.cjs — bien the lay tu DU LIEU (binh luan, thong bao do nguoi dung gui): TypeScript khong ton tai luc chay\nconst { cva } = require('class-variance-authority');\nconst notice = cva('rounded p-3', { variants: { variant: { info: 'bg-slate-100', success: 'bg-green-100', system: 'bg-red-600 text-white font-bold' } }, defaultVariants: { variant: 'info' } });\nconst MAP = { info: 'bg-slate-100', success: 'bg-green-100', system: 'bg-red-600 text-white font-bold' };\nconst binhLuan = JSON.parse('[{\"variant\":\"system\"},{\"variant\":\"khong-co\"},{\"variant\":\"toString\"}]');   // ke xau tu dien JSON\nconst HOP_LE = ['info', 'success'];                                                               // nguoi dung CHI duoc chon hai cai nay\nfor (const { variant } of binhLuan) {\n  console.log(JSON.stringify(variant).padEnd(12), '| cva:', JSON.stringify(notice({ variant })).padEnd(52), '| bang tra:', JSON.stringify(`rounded p-3 ${MAP[variant] ?? ''}`).slice(0, 44));\n  console.log(''.padEnd(12), '| loc truoc:', JSON.stringify(notice({ variant: HOP_LE.includes(variant) ? variant : 'info' })));\n}\n",
 "t4-4:xau": "$ node xau.cjs\n\"system\"     | cva: \"rounded p-3 bg-red-600 text-white font-bold\"        | bang tra: \"rounded p-3 bg-red-600 text-white font-bold\n             | loc truoc: \"rounded p-3 bg-slate-100\"\n\"khong-co\"   | cva: \"rounded p-3\"                                        | bang tra: \"rounded p-3 \"\n             | loc truoc: \"rounded p-3 bg-slate-100\"\n\"toString\"   | cva: \"rounded p-3\"                                        | bang tra: \"rounded p-3 function toString() { [native c\n             | loc truoc: \"rounded p-3 bg-slate-100\"",
 "anh-twc-4-4:matran": {
  "url": "http://127.0.0.1:20123/c44/matran.html",
  "vp": [
   560,
   250
  ],
  "rect": {
   "#ghost-sm": [
    97,
    133,
    48,
    32
   ],
   "#ghost-md": [
    159,
    129,
    57,
    40
   ],
   "#primary-lg": [
    229,
    63,
    76,
    48
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"gsm\":\"1px\",\"gmd\":\"0px\",\"h\":[32,40,48]}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-04-4', code: 'TWC 4.4', title: 'Variants: if-chain to matrix', sub: 'Chapter 4 · Lesson 4.4' };
const O = (k) => { const v = DU_LIEU[`t4-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-4-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-04-4', ten, { vp: 560, ...o });
const bo = (x) => x.replace(/\s+/g, '');

// ── số đo (chạy thật t4-4 · class-variance-authority 0.7.1 · clsx + tailwind-merge 2.6.1 CỦA KHO · TypeScript 5 · Tailwind 3.4.19 · Chromium · frontend/ 14/11/2026)
const BG = doan('bang', 'node bang.cjs');
const GIONG = BG.at(-1).match(/^(\d)\/9/)[1];
const TS = doan('kieu', 'npx tsc');
const KH = (dau) => doan('kho', dau)[0].trim();
const KCVA = KH("'cva('"), KPKG = KH('class-variance-authority'), KVAR = KH("variant(\\?)?:"), KEQ = KH("variant\\s*==="), KMAP = KH('[A-Z_]{3,}');
const PT = KH('^const POST_TONE'), PTU = KH("'POST_TONE\\['");
const XA = doan('xau', 'node xau.cjs');
const MT = JSON.parse(A('matran').ketQua.s);
if (GIONG !== '9' || TS.length !== 2 || !TS[0].includes('"blue"') || !TS[1].includes('"xl"')) throw new Error('bảng/kiểu đổi');
if (KCVA !== '0' || KPKG !== '0' || KVAR !== '20' || KEQ !== '0' || KMAP !== '147') throw new Error('kho đổi');
if (MT.gsm !== '1px' || MT.gmd !== '0px' || MT.h.join() !== '32,40,48') throw new Error('Chromium đổi');
if (!XA[0].includes('bg-red-600') || !XA[2].includes('cva: "rounded p-3"') || !XA[4].includes('function toString')) throw new Error('xau đổi');
const SRC = O('file:bang.cjs');
const CVA = `const button = cva(NEN, {
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      ghost:   'bg-transparent text-blue-600 hover:bg-blue-50',
      danger:  'bg-red-600 text-white hover:bg-red-700' },
    size: { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-6 text-base' } },
  compoundVariants: [
    { variant: 'ghost', size: 'sm', class: 'border border-blue-200' }],
  defaultVariants: { variant: 'primary', size: 'md' },
});`;
if (!bo(SRC).includes(bo(CVA))) throw new Error('mã hiển thị KHÔNG khớp bang.cjs (cva)');
const NEU = `const neu = (variant, size) => cn(NEN,
  variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
  variant === 'ghost' && 'bg-transparent text-blue-600 hover:bg-blue-50',
  variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
  size === 'sm' && 'h-8 px-3 text-xs', size === 'md' && 'h-10 px-4 text-sm',
  size === 'lg' && 'h-12 px-6 text-base',
  variant === 'ghost' && size === 'sm' && 'border border-blue-200');`;
if (!bo(SRC).includes(bo(NEU))) throw new Error('mã hiển thị KHÔNG khớp bang.cjs (if)');
const KIEU = `import { cva, type VariantProps } from 'class-variance-authority';
const button = cva('rounded-lg', {
  variants: {
    variant: { primary: 'bg-blue-600', ghost: 'bg-transparent',
               danger: 'bg-red-600' },
    size: { sm: 'h-8', md: 'h-10', lg: 'h-12' } },
});
type ButtonProps = VariantProps<typeof button>;
const ok: ButtonProps = { variant: 'danger', size: 'lg' };
const sai: ButtonProps = { variant: 'blue', size: 'xl' };`;
if (bo(KIEU) !== bo(O('file:kieu.ts'))) throw new Error('mã hiển thị KHÔNG khớp kieu.ts');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.4', t: 'Variants: from if-chains<br>to a declarative matrix', sub: 'Three variants × three sizes = nine combinations. Measured: an if-chain and cva produce the same 9 strings — so the real question is when the matrix form earns its dependency. This site answered it without cva, 147 times',
    en: 'Lesson four point four. A button with three variants and three sizes has nine combinations. This lesson measures an if-chain against the cva library: they produce the same nine strings. So the real question is when the declarative form earns its dependency, and how this site answered it without cva.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The if-chain is <b>fine</b> — until the first <b>compound</b> case</li>
    <li><code>cva</code> vs if-chain, measured: <b>${GIONG}/9</b> identical class strings</li>
    <li>What the matrix form buys: <b>derived types</b> and a matrix you can <b>iterate</b></li>
    <li>This site: 0 <code>cva</code>, 0 <code>variant ===</code> — and <b>${KMAP}</b> files of lookup tables</li>
    <li>Variants from DATA: TypeScript does not exist at runtime</li></ul>`,
    en: `Five takeaways: the if-chain is fine until the first compound case; cva and the if-chain produce ${GIONG} of nine identical strings; what the matrix buys, derived types and something you can iterate; this site uses neither, but has ${KMAP} files of lookup tables; and variants that come from data.` },
  { t: 'The if-chain — and why it is genuinely fine', body: two(D(tsx(NEU, { sm: true })),
    D(box('Reads top to bottom', 'Three variants and three sizes, each axis <b>independent</b>. Most components never need more than this — and it costs no dependency and no second syntax.', 'xanh'),
      box('Look at the last line', 'The <b>compound</b> case: ghost <b>and</b> small needs a border that neither rule alone should add. It tests <b>both</b> axes at once — the first line that does not fit the two-list structure.', 'do2')), 'r64'),
    en: 'The if-chain, and why it is genuinely fine: three variants and three sizes, each axis independent, read top to bottom, no dependency. Now look at the last line: ghost and small needs a border neither rule alone should add. It tests both axes at once, the first line that breaks the structure.' },
  { t: 'Where it breaks: compound exceptions pile up', body: D(two(box('One compound line', 'Readable. You can still see the two independent lists, plus one exception.', 'ok'), box('Four compound lines', 'ghost+sm border, danger+lg shadow, primary+sm bolder, ghost+lg underline… The two lists disappear under the exceptions and nobody can say what one combination renders <b>without running it</b>.', 'do2'), ''),
    cmp(['', 'independent rules', 'compound rules', 'combinations to check by eye'], [['3 variants × 3 sizes', '6', '0', '9 — easy'], ['+ 1 exception', '6', '1', '9 — fine'], ['+ 4 exceptions', '6', '4', '9 — each needs a mental run of every line']], { hl: [2] }),
    box('The signal', 'Not the number of variants — the arrival of the <b>first</b> rule that tests two props at once.', 'lam')),
    en: 'Where it breaks: compound exceptions pile up. One compound line is readable. Four of them, and the two independent lists disappear under the exceptions; nobody can say what a combination renders without running it. The signal is not the number of variants, but the first rule that tests two props at once.' },
  { t: 'The declarative form: cva', body: two(D(tsx(CVA, { sm: true })),
    D(box('compoundVariants has a home', 'The ghost+sm exception is a <b>first-class entry</b>, not a line wedged into independent conditions.', 'xanh'),
      box('defaultVariants', 'What the caller gets when it passes nothing — measured next slide.', 'lam')), 'r64'),
    en: 'The declarative form with cva, version zero point seven point one. The same two axes as data: variants, compound variants with the ghost plus small exception as a first-class entry, and default variants for when the caller passes nothing.' },
  { t: `Same output, measured: ${GIONG} of 9 identical`, body: two(D(tn(['$ node bang.cjs   # if-chain vs cva, both through cn() of this site', ...BG.map((l) => l.replace(/text-white hover:bg-(blue|red)-700|text-blue-600 hover:bg-blue-50/, '…'))].join('\n'), { fs: 13, wrap: 74, title: 'cva 0.7.1 + tailwind-merge 2.6.1 (real)' })),
    D(box('Read it', `All <b>${GIONG}</b> combinations give byte-identical class strings, the ghost+sm border included. <code>cva</code> does not make different buttons — it makes the <b>same</b> buttons from a different shape of code.`, 'xanh'),
      box('It composes with chapter 3', '<code>cva</code> <b>selects</b>; it does not resolve conflicts. The full call is <code>cn(button({ variant, size }), className)</code> — cva picks, twMerge resolves, the caller is still last (4.3).', 'lam')), 'r64'),
    en: `Same output, measured. All ${GIONG} combinations give identical class strings, the compound border included. Cva does not make different buttons, it makes the same buttons from a different shape of code. It also does not resolve conflicts: the full call is cn of button, then className, so the caller is still last.` },
  { t: 'What it buys #1: the prop types are DERIVED', body: two(D(tsx(KIEU, { sm: true }), tn(['$ npx tsc --noEmit --strict kieu.ts', ...TS].join('\n'), { fs: 12, wrap: 76, title: 'TypeScript 5 (real)' })),
    D(box('One list, not two', '<code>VariantProps</code> generates <code>"primary" | "ghost" | "danger"</code> from the object. Add a variant, the type follows.', 'xanh'),
      box('Caught at compile time', '<code>"blue"</code> and <code>"xl"</code> are rejected <b>before</b> anything renders. An if-chain just matches no line.', 'ok')), 'r64'),
    en: 'What it buys, number one: the prop types are derived. VariantProps generates the union of variant names from the object, so adding a variant updates the type. Measured: TypeScript rejects variant blue and size x l before anything renders.' },
  { t: 'What it buys #2: the matrix is DATA', body: two(D(B('matran', { url: 'c44/matran.html · generated from the cva definition', h: 250, w: 520 })),
    D(tn(['$ node matran.cjs', ...doan('matran', 'node matran.cjs')].join('\n'), { fs: 15, wrap: 44, title: 'real' }),
      cmp(['measured in Chromium', 'value'], [['ghost + sm border', `<b>${MT.gsm}</b> (compound)`], ['ghost + md border', `${MT.gmd}`], ['danger sm / md / lg height', `${MT.h.join(' / ')} px`]], { hl: [0] }),
      box('A visual test page for free', 'A config object can be <b>iterated</b>: this page has every combination, written by no one. An if-chain cannot be enumerated.', 'xanh')), 'r46'),
    en: `What it buys, number two: the matrix is data. A short script iterates the definition and writes a page with all nine buttons, written by no one. Chromium confirms the compound border, ${MT.gsm} on ghost small and zero on ghost medium, and heights thirty-two, forty, forty-eight.` },
  { t: 'What this codebase chose', body: two(D(tn([`$ git grep -c 'cva(' … | wc -l`, KCVA, "$ grep -c 'class-variance-authority' package.json", KPKG, "$ git grep -lE 'variant(\\?)?:' … | wc -l", KVAR, "$ git grep -lE 'variant\\s*===' … | wc -l", KEQ, "$ git grep -lE '[A-Z_]{3,}\\[…(variant|tone|size|status…)\\]' … | wc -l", KMAP].join('\n'), { fs: 14, wrap: 60, title: 'frontend/ · 14/11/2026 (real)' }),
      tn([PT.replace(/^(\S+?:\d+:)/, '$1\n'), PTU.replace(/^(\S+?:\d+:)\s*/, '$1\n  ') + '…'].join('\n'), { fs: 13, wrap: 64, title: 'the house style (real)' })),
    D(box('Neither cva nor if-chains', `0 <code>cva</code>, 0 <code>variant ===</code> comparisons. The site writes variants as <b>lookup tables</b>: a plain object from value to classes, read with <code>MAP[value]</code> — in <b>${KMAP}</b> files.`, 'lam'),
      box('Correction', 'The old lesson read "zero cva" as "components here are single-axis". Measured: they are <b>already declarative</b> — a lookup table is a one-axis matrix as data. What is missing is only the compound slot and the derived types.', 'xanh')), 'r46'),
    en: `What this codebase chose: zero cva, and zero variant-equals comparisons. ${KVAR} files have a variant prop, and ${KMAP} files read lookup tables, like POST_TONE in the admin page. A lookup table is already a one-axis matrix written as data; what it lacks is the compound slot and derived types.` },
  { t: 'When to reach for which', body: cmp(['situation', 'use', 'why'], [['one axis', '<b>lookup table</b> <code>TONE[tone]</code>', 'already data, no dependency — this site\'s house style'], ['two independent axes, no exceptions', 'two lookups or a short if-chain', 'still readable top to bottom'], ['first rule that tests two axes', '<b>cva</b> <code>compoundVariants</code>', 'the exception gets a home; types derived'], ['a design-system package used by many apps', 'cva (or similar)', 'the matrix doubles as documentation and a visual test page']], { hl: [2] }) +
    two(box('Not in anticipation', 'Adopting <code>cva</code> for a one-axis component makes the config longer than the code it replaced, and gives the team two ways to write variants.', 'do2'), box('Tailwind 4?', '<code>cva</code> only builds strings — it is version-agnostic. What must match the Tailwind major is <code>tailwind-merge</code> (lesson 3.4).', 'lam'), ''),
    en: 'When to reach for which. One axis: a lookup table, this site\'s house style. Two independent axes: two lookups or a short if-chain. The first rule that tests two axes: cva with compound variants. A shared design-system package: cva, because the matrix doubles as documentation. Cva works with any Tailwind version.' },
  { t: 'Naming the variants: three opposite failures', body: cmp(['failure', 'what happens'], [['<b>too few</b>', 'callers cannot express what they need, reach for <code>className</code>, and the design system stops constraining anything (4.3)'], ['<b>too many</b>', 'an 11-member <code>variant</code> union is a component doing eleven jobs — a <code>Button</code> and an <code>IconButton</code> sharing only a radius should be two files'], ['<b>named by APPEARANCE</b>', '<code>variant="blue"</code> is a colour, not a role: when the brand changes, every call site is wrong. Name by <b>intent</b> — <code>primary</code>, <code>danger</code> — so the colour lives in one place']], { hl: [2] }) +
    box('This site does it right', `<code>POST_TONE</code> maps a <b>status</b> (PUBLISHED, DRAFT…) to a tone: callers say what the post <i>is</i>, the table decides how it looks.`, 'xanh'),
    en: 'Naming the variants: three opposite failures. Too few, and callers escape through className. Too many, and one component does eleven jobs. Named by appearance, like blue, and a rebrand makes every call site wrong. Name by intent. This site does it right: POST_TONE maps a status to a tone.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'A café menu: <b>size</b> S/M/L × <b>drink</b>. One printed price table beats a waiter reciting "if latte and if large…". And the one exception — "large iced tea is free on Mondays" — gets its own line on the board.', 'lam'),
      box('What if…', '…the variant comes from <b>data</b> — a comment, a notification, a URL? TypeScript is gone at runtime. Measured: an unknown value makes <code>cva</code> return the base only — <b>no default applied</b> — so the component renders unstyled.', 'xanh')),
    D(tn(['$ node xau.cjs   # variant read from user-submitted JSON', ...XA.map((l) => l.replace(/\s+\|/g, ' |'))].join('\n'), { fs: 12, wrap: 76, title: 'cva 0.7.1 (real)' }),
      box('The attacker\'s view: styling is a trust signal', 'If users can choose the variant, an attacker picks <code>"system"</code> and their comment wears the <b>official</b> red banner. A naive lookup table even turns <code>"toString"</code> into a function\'s source code in your class list. Defend: an <b>allow-list</b> of what users may pick, checked at runtime (zod / <code>includes</code>), then fall back.', 'do2')), 'r46'),
    en: 'In real life: a café menu with sizes and drinks, one printed table, and the Monday exception on its own line. What if the variant comes from data? Measured: an unknown value gives the base only, no default. The attacker view: users pick system and their comment wears the official banner. Allow-list at runtime.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('variant axis', 'one independent prop: variant, size'), kw('compound variant', 'a rule that tests two axes at once'), kw('cva', 'class-variance-authority: variants as data'),
      kw('VariantProps', 'prop types derived from the definition'), kw('defaultVariants', 'used when the prop is undefined — not when unknown'), kw('lookup table', `MAP[value] — ${KMAP} files here`),
      kw('name by intent', 'primary, danger — not blue'), kw('runtime allow-list', 'validate variants that come from data'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: variant axis; compound variant; cva; VariantProps; default variants, used when the prop is undefined but not when it is unknown; lookup table; naming by intent; and a runtime allow-list.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Write the 3×3 button as an if-chain, then as cva — diff all 9 outputs',
      `Pass ${c("variant: 'blue'")} and read the TypeScript error`,
      'Generate a page with every combination from the definition',
      `Feed ${c("'system'")} and ${c("'toString'")} from JSON — then add an allow-list`,
    ]), box('Keep these', '<ul><li>If-chains are fine until the first compound rule</li><li>cva = same strings, better shape: derived types, iterable</li><li>A lookup table is already a matrix</li><li>Validate variants that come from data</li></ul>', 'lam'), ''),
    en: 'Your turn: write the button both ways and diff the nine outputs; read the TypeScript error for blue; generate the matrix page; feed system and toString from JSON, then add an allow-list. Keep: if-chains are fine until the first compound rule; cva gives the same strings in a better shape; validate data.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Components, and the right place to reuse', bai: '4.4' }, S);
