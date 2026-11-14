/*DU_LIEU*/
const DU_LIEU = {
 "t4-3:file:hd.cjs": "// hd.cjs — 141 tep co prop className cua trang: hop dong muc nao? (gop cuoi bang cn / noi chuoi / chuyen thang) + co rai ...props, co forwardRef\nconst { execSync } = require('node:child_process'); const fs = require('node:fs');\nconst K = '/Users/admin/.rtq-twc/lab/kho/';\nconst ds = execSync(`git -C ${K} grep -lP 'className\\\\??:\\\\s*string' -- 'src/*.tsx'`, { encoding: 'utf8' }).trim().split('\\n');\nconst dem = { 'cn(..., className)': 0, '`... ${className}`': 0, 'className={className}': 0, 'khac': 0 }; let rai = 0, raiBat = 0, ref = 0;\nfor (const f of ds) {\n  const s = fs.readFileSync(K + f, 'utf8');\n  if (/cn\\([^)]*className\\s*,?\\s*\\)/.test(s)) dem['cn(..., className)']++; else if (/\\$\\{className/.test(s)) dem['`... ${className}`']++;\n  else if (/className=\\{className\\}/.test(s)) dem['className={className}']++; else dem.khac++;\n  if (/\\{\\.\\.\\.(props|rest|others)\\}/.test(s)) rai++; if (/\\{\\.\\.\\.[a-zA-Z]+\\}/.test(s)) raiBat++; if (/forwardRef/.test(s)) ref++;\n}\nconsole.log(ds.length, 'tep co prop className');\nfor (const [k, v] of Object.entries(dem)) console.log('  ' + k.padEnd(24), v);\nconsole.log('  co rai {...props}        ', rai); console.log('  co rai bat ky {...x}     ', raiBat); console.log('  co forwardRef            ', ref);\n",
 "t4-3:kho": "$ node hd.cjs\n141 tep co prop className\n  cn(..., className)       33\n  `... ${className}`       50\n  className={className}    23\n  khac                     35\n  co rai {...props}         2\n  co rai bat ky {...x}      4\n  co forwardRef             8\n$ git -C ../kho grep -nE 'p-5 \\$\\{className' -- src/components/admin/ui.tsx\nsrc/components/admin/ui.tsx:54:    <section className={`rounded-[20px] border border-white/[0.13] bg-[var(--a-card)] p-5 ${className}`}>\n$ sed -n 231,251p ../kho/src/components/settings/primitives.tsx\nexport const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(\n  function TextInput({ className, style, ...props }, ref) {\n    return (\n      <input\n        ref={ref}\n        {...props}\n        className={cn(\n          'w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors',\n          'focus:border-violet-500',\n          className,\n        )}\n        style={{\n          background: 'var(--bg-surface)',\n          borderColor: 'var(--border-color)',\n          color: 'var(--text-primary)',\n          ...style,\n        }}\n      />\n    );\n  },\n);",
 "t4-3:file:hop.cjs": "// hop.cjs — BON hop dong cua mot nut, dung React 18.3.1 + clsx + tailwind-merge CUA KHO; nguoi goi dua className=\"p-0 bg-pink-400\" + aria-label + data-testid\nconst K = '/Users/admin/.rtq-twc/lab/kho/node_modules/';\nconst React = require(K + 'react'); const { renderToStaticMarkup } = require(K + 'react-dom/server');\nconst { clsx } = require(K + 'clsx'); const { twMerge } = require(K + 'tailwind-merge'); const cn = (...i) => twMerge(clsx(i));\nconst h = React.createElement; const NEN = 'rounded-lg bg-blue-600 px-5 py-2 text-white';\nconst Dong = ({ variant = 'primary', children }) => h('button', { className: variant === 'danger' ? NEN.replace('blue', 'red') : NEN }, children);\nconst CnCuoi = ({ className, ...props }) => h('button', { ...props, className: cn(NEN, className) });\nconst Noi = ({ className, children }) => h('button', { className: `${NEN} ${className}` }, children);\nconst BocNgoai = ({ className, ...props }) => h('div', { className: cn('w-64', className) }, h('input', { ...props, className: 'w-full rounded border border-slate-300 px-2 py-1' }));\nconst goi = { className: 'p-0 bg-pink-400', 'aria-label': 'Luu ban nhap', 'data-testid': 'luu', children: 'Lưu' };\nconst the = [['dong', h(Dong, goi)], ['cn', h(CnCuoi, goi)], ['noi', h(Noi, goi)], ['boc', h(BocNgoai, { className: 'border-2 border-red-500', placeholder: 'Email' })]];\nlet page = '<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head><body class=\"p-4 space-y-3 text-sm\">\\n';\nfor (const [id, el] of the) { const m = renderToStaticMarkup(el); console.log(id.padEnd(5), m); page += `<div id=\"${id}\" class=\"flex items-center gap-3\"><code class=\"w-14\">${id}</code>${m}</div>\\n`; }\nrequire('node:fs').writeFileSync('hop.html', page + '</body></html>\\n');\n",
 "t4-3:file:in.css": "@tailwind base;\n@tailwind utilities;\n",
 "t4-3:hop": "$ node hop.cjs\ndong  <button class=\"rounded-lg bg-blue-600 px-5 py-2 text-white\">Lưu</button>\ncn    <button aria-label=\"Luu ban nhap\" data-testid=\"luu\" class=\"rounded-lg text-white p-0 bg-pink-400\">Lưu</button>\nnoi   <button class=\"rounded-lg bg-blue-600 px-5 py-2 text-white p-0 bg-pink-400\">Lưu</button>\nboc   <div class=\"w-64 border-2 border-red-500\"><input placeholder=\"Email\" class=\"w-full rounded border border-slate-300 px-2 py-1\"/></div>\n$ npx tailwindcss --content './hop.html' -i in.css -o out.css 2>&1 | tail -1\nDone in 113ms.\n$ grep -nE '^\\.(p-0|px-5|bg-blue-600|bg-pink-400) \\{' out.css\n613:.bg-blue-600 {\n618:.bg-pink-400 {\n623:.p-0 {\n636:.px-5 {",
 "t4-3:file:xau.cjs": "// xau.cjs — rai {...props} la mot phan cua hop dong: neu \"props\" den tu DU LIEU (JSON tu API, ho so nguoi dung)… React 18.3.1 cua kho\nconst K = '/Users/admin/.rtq-twc/lab/kho/node_modules/';\nconst React = require(K + 'react'); const { renderToStaticMarkup } = require(K + 'react-dom/server');\nconst LinkCard = ({ className, children, ...props }) => React.createElement('a', { ...props, className: 'rounded border px-3 py-2 ' + (className || '') }, children);\nconst tuApi = JSON.parse('{\"href\":\"javascript:alert(document.cookie)\",\"dangerouslySetInnerHTML\":{\"__html\":\"<img src=x onerror=alert(1)>\"}}');\nconst err = console.error; console.error = (...a) => console.log('  [React canh bao]', String(a[0]).slice(0, 90));\ntry { console.log(renderToStaticMarkup(React.createElement(LinkCard, tuApi))); } catch (e) { console.log('  [loi]', e.message.slice(0, 120)); }\nconsole.error = err;\n",
 "t4-3:xau": "$ node xau.cjs\n  [React canh bao] Warning: A future version of React will block javascript: URLs as a security precaution. U\n<a href=\"javascript:alert(document.cookie)\" class=\"rounded border px-3 py-2 \"><img src=x onerror=alert(1)></a>",
 "anh-twc-4-3:hop": {
  "url": "http://127.0.0.1:20122/c43/hop.html",
  "vp": [
   560,
   230
  ],
  "rect": {
   "#dong button": [
    84,
    16,
    64,
    36
   ],
   "#cn button": [
    84,
    64,
    24,
    20
   ],
   "#noi button": [
    84,
    96,
    64,
    36
   ],
   "#boc div": [
    84,
    144,
    256,
    34
   ],
   "#boc input": [
    86,
    146,
    252,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"dong\":{\"pl\":\"20px\",\"bg\":\"rgb(37, 99, 235)\",\"aria\":null},\"cn\":{\"pl\":\"0px\",\"bg\":\"rgb(244, 114, 182)\",\"aria\":\"Luu ban nhap\"},\"noi\":{\"pl\":\"20px\",\"bg\":\"rgb(244, 114, 182)\",\"aria\":null},\"boc\":{\"div\":\"rgb(239, 68, 68)\",\"input\":\"rgb(203, 213, 225)\"}}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, meter } from './_twc-chung.mjs';

export const deck = { key: 'twc-04-3', code: 'TWC 4.3', title: 'The className prop is a contract', sub: 'Chapter 4 · Lesson 4.3' };
const O = (k) => { const v = DU_LIEU[`t4-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-4-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-04-3', ten, { vp: 560, ...o });
const bo = (x) => x.replace(/\s+/g, '');

// ── số đo (chạy thật t4-3 · React 18.3.1 + clsx 2.1.1 + tailwind-merge 2.6.1 CỦA KHO · Tailwind 3.4.19 · Chromium · frontend/ 14/11/2026)
const HD = doan('kho', 'node hd.cjs');
const so = (nhan) => { const l = HD.find((x) => x.trim().startsWith(nhan)); if (!l) throw new Error('thiếu ' + nhan); return +l.trim().split(/\s+/).pop(); };
const TONG = +HD[0].split(' ')[0], CN = so('cn('), NOI = so('`'), THANG = so('className={className}'), KHAC = so('khac'), RAI = so('co rai {'), RAIB = so('co rai bat'), REF = so('co forwardRef');
const UI = doan('kho', "grep -nE 'p-5")[0];
const TI = doan('kho', 'sed -n 231').join('\n');
const HOP = doan('hop', 'node hop.cjs').map((l) => [l.slice(0, 5).trim(), l.slice(6)]);
const ORD = doan('hop', 'grep -nE');
const XA = doan('xau', 'node xau.cjs');
const M = JSON.parse(A('hop').ketQua.s);
if (TONG !== 141 || CN + NOI + THANG + KHAC !== 141 || NOI !== 50 || RAI !== 2 || REF !== 8) throw new Error('đo kho đổi');
if (!UI.startsWith('src/components/admin/ui.tsx:54:')) throw new Error('ui.tsx:54 đổi');
if (M.cn.pl !== '0px' || M.noi.pl !== '20px' || M.noi.bg !== M.cn.bg || M.dong.aria !== null || M.cn.aria === null || M.boc.div === M.boc.input) throw new Error('Chromium đổi');
if (!XA.some((l) => l.includes('javascript:alert')) || !XA.some((l) => l.includes('onerror=alert(1)'))) throw new Error('xau đổi');
const TIH = `export const TextInput = forwardRef<HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, style, ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          'w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors',
          'focus:border-violet-500',
          className,
        )}
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)',
          color: 'var(--text-primary)', ...style, }}
      />`;
if (!bo(TI).includes(bo(TIH))) throw new Error('mã hiển thị KHÔNG khớp primitives.tsx');
const tag = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ord = (s) => ORD.find((l) => l.includes(`.${s} {`)).split(':')[0];

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.3', t: 'The className prop<br>is a contract', sub: 'Adding className looks like a convenience. It is a public promise that the caller\'s classes will take effect. One caller, four components, measured — and how this site\'s 141 components keep or break it',
    en: 'Lesson four point three. Adding className to a component looks like a small convenience. It is really a public promise: classes you pass in will take effect. This lesson measures one caller against four components, then checks how this site\'s one hundred forty-one components keep that promise.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three levels of contract: <b>closed</b>, <b>merged last</b>, <b>concatenated</b></li>
    <li>One caller, four components — what Chromium actually renders</li>
    <li>This site: <b>${NOI}</b> of ${TONG} components concatenate; only <b>${RAI}</b> spread the rest of the props</li>
    <li>The four requirements once you accept <code>className</code></li>
    <li>Spread is part of the contract — and an attack surface</li></ul>`,
    en: `Five takeaways: three levels of contract; one caller against four components in Chromium; this site, where ${NOI} of ${TONG} components concatenate and only ${RAI} spread their remaining props; the four requirements; and why spread is both contract and attack surface.` },
  { t: 'Three levels of contract', body: cmp(['level', 'how', 'what the promise is'], [['<b>closed</b> — no className', 'named props only: <code>variant</code>, <code>size</code>', 'nothing promised, nothing broken — right default for a design-system primitive'], ['<b>merged last</b>', '<code>cn(base, variants, className)</code>', 'every caller class wins its conflict — documentable without caveats'], ['<b>concatenated</b>', '<code>`${base} ${className}`</code>', 'works for classes that do not collide, <b>fails silently</b> for those that do — terms vary by input']], { hl: [2] }) +
    two(box('Like a rental contract', '"You may repaint the room" — and the landlord\'s paint goes on <b>after</b> yours for some colours. That clause is worse than "no repainting".', 'lam'), box('Next slide', 'One caller passes <code>className="p-0 bg-pink-400"</code>, an <code>aria-label</code> and a <code>data-testid</code> to all four.', 'ok'), ''),
    en: 'Three levels of contract. Closed: no className, named props only, nothing promised. Merged last with cn: every caller class wins. Concatenated: works for classes that do not collide and fails silently for those that do, a contract whose terms depend on the input. Like a rental clause with fine print.' },
  { t: 'One caller, four components — measured', body: two(D(B('hop', { url: 'c43/hop.html · React 18.3.1 + Tailwind 3.4.19', h: 200, w: 470 }),
      tn(['$ node hop.cjs   # caller: className="p-0 bg-pink-400" aria-label data-testid', ...HOP.map(([k, v]) => `${k.padEnd(5)}${v}`)].join('\n'), { fs: 12, wrap: 78, title: 'renderToStaticMarkup (real)' })),
    D(cmp(['component', 'padding-left', 'background', 'aria-label'], [['closed', M.dong.pl, '<code>blue-600</code>', '— dropped'], ['<code>cn()</code> last', `<b>${M.cn.pl}</b>`, '<code>pink-400</code>', '✓ kept'], ['concatenated', `<b>${M.noi.pl}</b> ✗`, '<code>pink-400</code> ✓', '— dropped'], ['wrapper', 'red border on <b>div</b>', 'input stays grey', '—']], { hl: [2, 3] }),
      box('Read it', `Concatenated: the background obeys (<code>.bg-pink-400</code> line ${ord('bg-pink-400')} is after <code>.bg-blue-600</code> ${ord('bg-blue-600')}), the padding does not (<code>.p-0</code> ${ord('p-0')} is <b>before</b> <code>.px-5</code> ${ord('px-5')}). Half a promise — decided by the stylesheet, not by you.`, 'do2')), 'r46'),
    en: `One caller, four components, rendered with this site's React and measured in Chromium. Closed: ignores everything. Cn last: padding zero, pink, aria-label kept. Concatenated: pink wins but padding stays twenty pixels, because p-zero comes before px-five in the stylesheet. Half a promise. Wrapper: the red border lands on the div.` },
  { t: 'Why "no className" is a real option', body: two(D(tsx(`{/* open: every caller can make this button anything */}
<Button className="rounded-none bg-pink-400 px-1 text-[9px]" />

{/* closed: the component owns its look */}
<Button variant="danger" size="sm" />`), box('Measured on slide 4', `The closed button ignored <code>p-0</code>, <code>bg-pink-400</code> and the <code>aria-label</code> — <b>by design</b>. Nothing was promised, so nothing broke. But note the cost: a closed component must still let <code>aria-*</code> through, or it is closed about accessibility too.`, 'lam')),
    D(box('The open version, six months later', 'An audit finds eleven visually different buttons, all rendered by <code>&lt;Button&gt;</code>. <code>className</code> is the path of least resistance whenever the design does not quite fit.', 'do2'),
      box('A useful middle position', 'Accept <code>className</code> for <b>layout</b> (margin, width, grid placement — only the parent knows those), review anything else as a request for a new <b>variant</b>.', 'xanh')), 'r64'),
    en: 'Why no className is a real option. The open version means the button component does not control what buttons look like; six months later there are eleven different buttons. A middle position: accept className for layout, which only the parent knows, and treat colours and padding as requests for a new variant.' },
  { t: `This site: ${TONG} components, measured`, body: two(D(tn(['$ node hd.cjs   # every .tsx with a className?: string prop', ...HD].join('\n'), { fs: 15, wrap: 52, title: 'frontend/ · 14/11/2026 (real)' }),
      meter([['cn(…, className)', CN, '#16a34a'], ['`… ${className}`', NOI, '#dc2626'], ['className={className}', THANG, '#0891b2'], ['other', KHAC, '#94a3b8']], { don: '', nhan: 230, fs: 17, rh: 40, w: 540 })),
    D(box(`${NOI} promises that depend on the input`, `Concatenation is the most common contract here — more than <code>cn()</code> (${CN}). Lesson 3.3 measured the same exposure from the other side. <code>className={className}</code> (${THANG}) passes it through with no base, which is honest.`, 'do2'),
      box(`Only ${RAI} spread the rest of the props`, `${RAIB} spread anything at all. The others accept <code>className</code> but swallow <code>aria-label</code>, <code>data-testid</code>, <code>onKeyDown</code>… — open about looks, closed about behaviour. <b>${REF}</b> forward a ref.`, 'lam')), 'r46'),
    en: `This site, measured: ${TONG} component files take a className prop. ${NOI} concatenate, more than the ${CN} that merge with cn. Only ${RAI} spread the rest of the props, so most accept className but swallow aria-label and test ids. ${REF} forward a ref.` },
  { t: 'The four requirements when you DO accept it', body: cmp(['requirement', 'why', 'measured / where'], [['<b>merge, and merge LAST</b>', '<code>cn(base, conditionals, className)</code> — anywhere else the component beats the caller', 'slide 4 · lesson 3.4'], ['<b>spread the rest</b>', '<code>{...props}</code> so <code>aria-*</code>, <code>data-*</code>, handlers get through', `${RAI} of ${TONG} here`], ['<b>forward the ref</b>', 'focus management, positioning libraries, scroll-into-view need the DOM node', `${REF} of ${TONG} · React 19: <code>ref</code> is a plain prop`], ['<b>the RIGHT element</b>', 'wrapper or control? document it — or the class lands where nobody looks', 'slide 4, last row']], { hl: [0] }) +
    box('React version note', 'This site runs React <b>18.3.1</b>, where a function component needs <code>forwardRef</code>. React 19 passes <code>ref</code> as an ordinary prop, so the requirement stays but the wrapper disappears.', 'lam'),
    en: 'The four requirements once you accept className. Merge it last with cn. Spread the rest of the props so aria and data attributes get through. Forward the ref; this site runs React eighteen, where that needs forwardRef, while React nineteen passes ref as a normal prop. And put the class on the right element.' },
  { t: 'What this repository does right: TextInput', body: D(tsx(TIH, { sm: true }),
    two(box('Three things right at once', 'Ref forwarded, rest spread, <code>className</code> merged <b>last</b> through <code>cn()</code> — even <code>...style</code> goes last. Typed as <code>InputHTMLAttributes</code>: the spread is honest.', 'xanh'),
      box('Corrected', 'The old lesson showed <code>{...props}</code> after <code>className</code>. The real file spreads <b>first</b>, so a caller\'s class always goes through <code>cn()</code>.', 'lam'), '')),
    en: 'What this repository does right: TextInput in the settings primitives. The ref is forwarded, the rest is spread, className is merged last through cn, and even style puts the caller last. The real file spreads props first and sets className after, so the caller\'s class always goes through cn.' },
  { t: 'Exposure in this site: admin Section', body: two(D(tn([`$ git grep -nE 'p-5 \\$\\{className' -- src/components/admin/ui.tsx`, UI.replace(/^(\S+?:\d+:)\s+/, '$1\n  ')].join('\n'), { fs: 14, wrap: 64, title: 'frontend/ · 14/11/2026 (real)' }),
      tsx(`// today: concatenated — caller's p-0 loses to p-5
<section className={\`… p-5 \${className}\`}>

// keeping the promise:
<section className={cn('… p-5', className)}>`, { sm: true })),
    D(box('Measured in 3.1 and 3.3', '<code>&lt;Section className="p-0"&gt;</code> renders with <b>20px</b> padding in both Tailwind 3 and 4: <code>.p-0</code> is generated before <code>.p-5</code>. Through <code>cn()</code> it is 0.', 'do2'),
      box('Status', 'Not fixed in the repository (14/11/2026) — reported, not edited in this lesson. A one-line change; every caller that passes padding today is silently ignored.', 'lam')), 'r46'),
    en: 'Exposure in this site: the admin Section in ui dot tsx line fifty-four concatenates p-five with className. Measured in lessons three point one and three point three: a caller passing p-zero still gets twenty pixels. Through cn it would be zero. Not fixed yet; reported, a one-line change.' },
  { t: 'Trap: className on a wrapper the caller cannot see', body: two(D(B('hop', { url: 'c43/hop.html · last row', h: 200, w: 470, mark: [[84, 144, 256, 34]] })),
    D(tn(['boc  ' + HOP.find(([k]) => k === 'boc')[1]].join('\n'), { fs: 13, wrap: 60, title: 'renderToStaticMarkup (real)' }),
      cmp(['element', 'border colour (Chromium)'], [['wrapper <code>&lt;div&gt;</code>', `<code>${M.boc.div}</code> ← caller's red`], ['<code>&lt;input&gt;</code>', `<code>${M.boc.input}</code> ← unchanged`]], { hl: [0] }),
      box('Nothing errors', 'The class is applied — on the wrong element. DevTools shows it "working". Either put <code>className</code> on the control and add <code>wrapperClassName</code>, or document which element receives it.', 'do2')), 'r46'),
    en: 'The trap: className on a wrapper. The caller passes a red error border; it lands on the outer div, measured, while the input keeps its grey border. Nothing errors and DevTools shows the class applied, on the wrong element. Put className on the control, or add a separate wrapperClassName.' },
  { t: 'The contract you cannot express in types', body: D(two(tsx(`type Props = { className?: string };   // ✓ compiles
// 1) cn(base, className)        — keeps the promise
// 2) \`\${base} \${className}\`     — keeps half of it
// 3) cn(className, base)        — breaks it every time (3.4)`), box('TypeScript says "string"', 'It cannot say "and it will actually take effect". All three implementations type-check identically.', 'lam'), 'r64'),
    cmp(['implementation', 'caller passes', 'result (measured)', 'here'], [['<code>cn(base, className)</code>', '<code>p-0</code>', '<b>0px</b> — promise kept (slide 4)', `${CN} files`], ['<code>`${base} ${className}`</code>', '<code>p-0</code>', '<b>20px</b> — silently ignored (slide 4)', `<b>${NOI}</b> files`], ['<code>cn(className, base)</code>', '<code>px-8</code>', '<b>px-4</b> — reversed (lesson 3.4)', '1 call (XemTep)']], { hl: [1] }),
    box('So enforce it elsewhere', `Lint (a rule against <code>\`… \${className}\`</code> in <code>className=</code>), a review checklist, or a test that renders the component with a conflicting class. ${NOI} files here pass the compiler and break the promise.`, 'xanh')),
    en: `The contract you cannot express in types. TypeScript can say className is a string. It cannot say the class will take effect: cn last, concatenation and cn with the caller first all type-check the same. So enforce it with lint, review or a test. ${NOI} files here pass the compiler and break the promise.` },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'A rental contract that says "you may repaint" while the landlord paints over some colours. "No repainting" would be more honest.', 'lam'),
      box('What if…', '…an admin passes <code>className="p-0"</code> to Section to put a full-bleed table inside? The table sits in 20px of padding, the admin adds a negative margin hack, and the hack breaks on the next redesign.', 'xanh')),
    D(tn(['$ node xau.cjs   # LinkCard spreads {...props}; props come from JSON', ...XA].join('\n'), { fs: 12, wrap: 70, title: 'React 18.3.1 of this site (real)' }),
      box('The attacker\'s view: spread is part of the contract', '<code>{...props}</code> forwards <b>everything</b>. If the object comes from data (an API, a user profile), an attacker controls attributes: React 18.3.1 rendered <code>href="javascript:…"</code> with only a warning, and <code>dangerouslySetInnerHTML</code> as raw HTML. Spread only props written in <b>code</b>; pick fields from data explicitly.', 'do2')), 'r46'),
    en: 'In real life: a rental contract that lets you repaint, then paints over some colours. The attacker view: spread forwards everything. If the props come from data, an attacker controls attributes. Measured with this site\'s React eighteen: a javascript URL rendered with only a warning, and dangerously set inner HTML as raw HTML.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('className contract', 'a public promise the class takes effect'), kw('closed component', 'named variants only, no className'), kw('merged last', 'cn(base, …, className)'),
      kw('concatenated', `\`\${base} \${className}\` — ${NOI} here`), kw('rest spread', `{...props} — only ${RAI} here`), kw('forwardRef', 'React 18; React 19: ref is a prop'),
      kw('wrapper trap', 'the class lands on the wrong element'), kw('spread from data', 'attacker-controlled attributes'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the className contract; a closed component; merged last; concatenated; rest spread; forwardRef; the wrapper trap; and spreading from data.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Render one component with ${c('className="p-0 bg-pink-400"')} — which half wins?`,
      `Count your own ${c('`${className}`')} vs ${c('cn(…, className)')}`,
      'Pass aria-label and data-testid — do they reach the DOM?',
      `Fix one concatenation with ${c('cn()')} and re-measure`,
    ]), box('Keep these', '<ul><li>className is a promise, not a convenience</li><li>Closed, or merged last — never concatenated</li><li>Spread the rest, forward the ref, right element</li><li>Never spread props that came from data</li></ul>', 'lam'), ''),
    en: 'Your turn: render a component with a conflicting class and see which half wins; count your concatenations; check that aria-label reaches the DOM; fix one with cn. Keep: className is a promise; closed or merged last, never concatenated; spread, forward the ref, right element; never spread data.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Components, and the right place to reuse', bai: '4.3' }, S);
