/*DU_LIEU*/
const DU_LIEU = {
 "n2-3:file:badge.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nfunction Badge({ label = 'New' }) {\n  return h('span', { className: 'badge' }, label);\n}\nconst thu = [\n  ['<Badge />', {}],\n  ['<Badge label=\"Hot\" />', { label: 'Hot' }],\n  ['<Badge label={undefined} />', { label: undefined }],\n  ['<Badge label={null} />', { label: null }],\n  ['<Badge label=\"\" />', { label: '' }],\n];\nfor (const [jsx, props] of thu) console.log(jsx.padEnd(28), '→', renderToStaticMarkup(h(Badge, props)));\n",
 "n2-3:mau": "$ node badge.cjs\n<Badge />                    → <span class=\"badge\">New</span>\n<Badge label=\"Hot\" />        → <span class=\"badge\">Hot</span>\n<Badge label={undefined} />  → <span class=\"badge\">New</span>\n<Badge label={null} />       → <span class=\"badge\"></span>\n<Badge label=\"\" />           → <span class=\"badge\"></span>",
 "n2-3:file:spread.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nfunction Input({ label, ...rest }) {\n  return h('label', null, label, h('input', rest));          // <input {...rest} />\n}\nconsole.log(renderToStaticMarkup(h(Input, { label: 'Email', type: 'email', placeholder: 'you@site.com' })));\nconsole.log(renderToStaticMarkup(h(Input, { label: 'Email', isActive: true })));   // prop lạ lọt xuống <input>\nfunction NutA(props) { return h('button', { ...props, type: 'button' }); }       // <button {...props} type=\"button\">\nfunction NutB(props) { return h('button', { type: 'button', ...props }); }       // <button type=\"button\" {...props}>\nconsole.log('NutA:', renderToStaticMarkup(h(NutA, { type: 'submit' }, 'Gửi')));\nconsole.log('NutB:', renderToStaticMarkup(h(NutB, { type: 'submit' }, 'Gửi')));\n",
 "n2-3:spread": "$ NODE_ENV=development node spread.cjs 2>&1\n<label>Email<input type=\"email\" placeholder=\"you@site.com\"/></label>\nReact does not recognize the `isActive` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `isactive` instead. If you accidentally passed it from a parent component, remove it from the DOM element.\n<label>Email<input/></label>\nNutA: <button type=\"button\">Gửi</button>\nNutB: <button type=\"submit\">Gửi</button>",
 "n2-3:file:src/thu23/kieu.tsx": "import type { FC } from 'react';\n\ntype BadgeProps = {\n  label?: string;          // tuỳ chọn\n  tone: 'info' | 'warn';   // bắt buộc, chỉ hai giá trị này\n};\nfunction Badge({ label = 'New', tone }: BadgeProps) {\n  return <span className={`badge badge-${tone}`}>{label}</span>;\n}\nexport const a = <Badge />;\nexport const b = <Badge tone=\"danger\" />;\nexport const c = <Badge tone=\"info\" />;\n\nconst Card: FC<{ title: string }> = ({ title }) => <h2>{title}</h2>;\nexport const d = <Card title=\"Hi\">nội dung</Card>;\n\nfunction Chart({ data }: { data: any }) {\n  return <p>{data.points.map((p: number) => p * 2).join(',')}</p>;\n}\nexport const e = <Chart data={{}} />;\n\nfunction Chart2({ data }: { data: unknown }) {\n  return <p>{data.points.join(',')}</p>;\n}\n",
 "n2-3:file:any.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nfunction Chart({ data }) {                    // data: any — tsc không kiểm gì\n  return React.createElement('p', null, data.points.map((p) => p * 2).join(','));\n}\ntry {\n  console.log(renderToStaticMarkup(React.createElement(Chart, { data: {} })));\n} catch (e) {\n  console.log(e.constructor.name + ': ' + e.message);\n}\n",
 "n2-3:kieu": "$ npx tsc --noEmit\nsrc/thu23/kieu.tsx(10,19): error TS2741: Property 'tone' is missing in type '{}' but required in type 'BadgeProps'.\nsrc/thu23/kieu.tsx(11,25): error TS2322: Type '\"danger\"' is not assignable to type '\"info\" | \"warn\"'.\nsrc/thu23/kieu.tsx(15,19): error TS2322: Type '{ children: string; title: string; }' is not assignable to type 'IntrinsicAttributes & { title: string; }'.\n  Property 'children' does not exist on type 'IntrinsicAttributes & { title: string; }'.\nsrc/thu23/kieu.tsx(23,14): error TS18046: 'data' is of type 'unknown'.\n$ node any.cjs\nTypeError: Cannot read properties of undefined (reading 'map')",
 "n2-3:file:src/app/tim/page.tsx": "'use client';\nimport { useState } from 'react';\n\ntype Props = { onSearch: (q: string) => void };\n\nfunction SearchBar({ onSearch }: Props) {\n  return (\n    <div className=\"flex gap-2\">\n      <button id=\"r\" className=\"rounded border px-3\" onClick={() => onSearch('react')}>Search react</button>\n      <button id=\"n\" className=\"rounded border px-3\" onClick={() => onSearch('next')}>Search next</button>\n    </div>\n  );\n}\n\nexport default function Tim() {\n  const [log, setLog] = useState<string[]>([]);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <SearchBar onSearch={(q) => setLog((cu) => [...cu, `searching ${q}`])} />\n      <p id=\"dem\">Page nhận {log.length} lần gọi</p>\n      <ol id=\"log\" className=\"list-decimal pl-6\">\n        {log.map((x, i) => <li key={i}>{x}</li>)}\n      </ol>\n    </div>\n  );\n}\n",
 "n2-3:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -A20 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /bien\n├ ○ /dem\n├ ○ /ghep\n├ ○ /gio\n├ ○ /hien\n├ ○ /key\n├ ○ /khoang\n├ ○ /memo\n├ ○ /tay\n├ ○ /the\n├ ○ /thuoc\n├ ○ /tim\n└ ○ /vo\n\n\n○  (Static)  prerendered as static content\n$ curl -s -o /dev/null -w 'GET /tim → %{http_code}\\n' localhost:19323/tim\nGET /tim → 200",
 "n2-3:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, cmp, box, two, steps, kw, c, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-02-3', code: 'NXJ 2.3', title: 'Props patterns: defaults, spread, callbacks & types', sub: 'Chapter 2 · Lesson 2.3' };
const O = (k) => { const v = DU_LIEU[`n2-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-02-3', ten, o);
const lenh = (k, i) => O(k).split('\n$ ').map((x, j) => (j ? '$ ' + x : x))[i];
const dong = (k, ...ds) => { const L = O(k).split('\n'); return ds.map((i) => L[i]).join('\n'); };
const KIEU = O('file:src/thu23/kieu.tsx').split('\n');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.3', t: 'Props patterns:<br>defaults, spread,<br>callbacks &amp; types', sub: 'Props are just an object — four patterns cover most real components, and each has one trap worth measuring',
    en: 'Lesson two point three: props patterns. Props are just an object, so everything you know about JavaScript objects applies. Four patterns cover most real components: defaults, spread, callbacks and types. Each has one trap worth measuring.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Default values — and the one value that does <b>not</b> trigger them</li>
    <li>Spreading <code>{...rest}</code> — and two ways it bites</li>
    <li>Callback props: data down, events up — in a real browser</li>
    <li>Typing props with TypeScript — the errors you get for free</li>
    <li>A myth corrected: <code>React.FC</code> and <code>children</code></li>
    <li><code>any</code> vs <code>unknown</code> — compiles vs crashes</li></ul>`,
    en: 'Six takeaways: default values and the one value that does not trigger them; spreading rest props and two ways it bites; callback props, data down and events up, in a real browser; typing props with TypeScript; a myth corrected about React FC and children; and any versus unknown.' },
  { t: '1 · Default values are plain JavaScript', body: two('<div>' + tsx(O('file:badge.cjs').split('\n').slice(3, 6).join('\n').replace("h('span', { className: 'badge' }, label)", '<span className="badge">{label}</span>'), { hl: [1] }) +
      box('No React mechanism', 'This is a JavaScript default parameter inside destructuring. React passes the props object; JavaScript fills the hole.', 'lam') + '</div>',
      tn(O('mau'), { fs: 14, wrap: 62 })) +
    two(box('Default fires only for <code>undefined</code>', 'Missing prop or <code>label={undefined}</code> ⇒ <b>New</b>.', 'xanh'),
      box('<code>null</code> and <code>""</code> do NOT', '<code>label={null}</code> renders an <b>empty</b> badge — the parent passed a value, so the default is skipped. Use <code>label ?? \'New\'</code> if null must fall back too.', 'do2')),
    en: 'One: default values. Give a prop a fallback right in the destructuring, and the caller can omit it. This is plain JavaScript, no React mechanism. Measured with five calls: omitted or undefined gives New. But null and the empty string give an empty badge, because the parent did pass a value. If null must fall back too, use the nullish operator in the body.' },
  { t: '2 · Spread the rest through', body: two(tsx(`function Input({ label, ...rest }) {
  return (
    <label>
      {label}
      <input {...rest} />
    </label>
  );
}

<Input label="Email" type="email"
       placeholder="you@site.com" />`, { hl: [1, 5] }),
      '<div>' + box('<code>...rest</code> collects, <code>{...rest}</code> forwards', 'Everything you did not name — <code>type</code>, <code>placeholder</code>, <code>value</code>, <code>onChange</code> — lands on the <code>&lt;input&gt;</code>. The wrapper stays thin.', 'xanh') +
      box('Name what you use', 'Destructure by name only what the wrapper itself needs (<code>label</code>). Anything named is <b>not</b> forwarded — the spread never sees it.', 'lam') + '</div>', 'r64') +
    tn(lenh('spread', 0).split('\n').slice(0, 2).join('\n'), { fs: 15, wrap: 100 }),
    en: 'Two: spread. When a wrapper wants to forward arbitrary props to the element underneath, collect the rest with three dots and spread them back on. Label is taken by name; type and placeholder flow through to the input. Measured: the real output is a label with an input carrying type email and the placeholder.' },
  { t: 'Spread bites twice — measured on React 19', body: tn(lenh('spread', 0).split('\n').slice(0, 1).concat(O('spread').split('\n').slice(2, 6)).join('\n'), { fs: 14, wrap: 104 }) +
    two(box('Unknown props leak to the DOM', '<code>isActive</code> reached <code>&lt;input&gt;</code>: React warns <i>does not recognize the isActive prop on a DOM element</i> and drops it. Pull such props out by name before spreading.', 'do2'),
      box('Order decides who wins', '<code>&lt;button {...props} type="button"&gt;</code> ⇒ <b>button</b> (written last wins). <code>&lt;button type="button" {...props}&gt;</code> ⇒ the caller\'s <b>submit</b> wins. Put defaults <b>before</b> the spread, locks <b>after</b>.', 'cam')),
    en: 'Spread bites twice. First, unknown props leak: isActive reached the input, and React warned that it does not recognize the isActive prop on a DOM element. Second, order decides who wins: whatever is written last overrides. Put defaults before the spread so callers can override them, and put values you must lock after it.' },
  { t: '3 · Callbacks: data down, events up', body: tsx(O('file:src/app/tim/page.tsx').split('\n').slice(3, 13).join('\n').replace(/ className="[^"]*"/g, '').replace(/ id="\w+"/g, '') + '\n// Page owns the behaviour:  <SearchBar onSearch={(q) => setLog((cu) => [...cu, `searching ${q}`])} />', { sm: true, hl: [1, 3, 6, 7, 11] }) +
    two(`<div><div class="cap" style="font-weight:700">Clicked react · next · react (real browser, next start)</div>${B('tim-sau', { vp: 640, h: 190, w: 470, url: 'localhost:3000/tim' })}</div>`,
      seq(['Page', 'SearchBar'], [[0, 1, 'onSearch (a function) ↓', '#0070f3'], [1, 0, "onSearch('react') ↑ child calls it", '#1f8a3b', true]], { w: 600, rh: 50, fs: 16 }), 'r46'),
    en: 'Three: callbacks. Props flow down, but a child often needs to tell its parent something happened. The parent passes a function down; the child calls it. SearchBar does not know what searching means — it just calls onSearch. In a real browser, three clicks reached the page three times, logged in order. In Chapter three that callback will call setState.' },
  { t: '4 · Type the props — errors for free', body: tsx(KIEU.slice(2, 12).join('\n'), { sm: true, hl: [8, 9] }) +
    tn('$ npx tsc --noEmit\n' + dong('kieu', 1, 2), { fs: 14, wrap: 104 }) +
    two(box('TS2741 · missing required prop', '<code>&lt;Badge /&gt;</code> forgot <code>tone</code> — caught before the app runs.', 'lam'),
      box('TS2322 · value not allowed', '<code>tone="danger"</code> is not <code>"info" | "warn"</code>. Your editor autocompletes the allowed values too.', 'cam')),
    en: 'Four: type the props with TypeScript. Label is optional with a question mark and has a default; tone is required and can only be info or warn. Measured with tsc: Badge with no tone is TS2741, a missing required property; tone equals danger is TS2322, a value not allowed. Both are caught before the app ever runs.' },
  { t: 'Myth corrected: React.FC does not add children', body: tsx(KIEU.slice(13, 15).join('\n'), { hl: [2] }) + tn('$ npx tsc --noEmit\n' + dong('kieu', 3, 4), { fs: 14, wrap: 104 }) + two(
      box('Old advice, still everywhere', '"Avoid <code>React.FC</code>: it silently adds a <code>children</code> prop." That was true for <b>@types/react 17</b>.', 'cam'),
      box('Measured today (React 19 types)', '<code>FC&lt;{ title: string }&gt;</code> has <b>no</b> <code>children</code>: nesting content is TS2322. Annotate the parameter <code>({ title }: CardProps)</code> anyway — simpler, and it works with generics and defaults.', 'xanh')),
    en: 'A myth corrected. A lot of advice, including the old text of this lesson, says React FC silently adds a children prop. That was true for the React seventeen type definitions. Measured today with the React nineteen types: FC of title has no children, and nesting content is error TS2322. Still, annotating the parameter directly is simpler.' },
  { t: 'any compiles — then crashes', body: tsx(KIEU.slice(16, 24).join('\n'), { sm: true, hl: [1, 2, 6, 7] }) +
      tn('$ npx tsc --noEmit\n' + dong('kieu', 5) + '\n' + lenh('kieu', 1), { fs: 14, wrap: 104 }) +
    two(box('<code>data: any</code> ⇒ tsc says nothing', '<code>data.points.map</code> is unchecked; <code>&lt;Chart data={{}} /&gt;</code> compiles — and throws <b>TypeError: Cannot read properties of undefined (reading \'map\')</b> at runtime.', 'do2'),
      box('<code>data: unknown</code> ⇒ TS18046', 'The honest choice: tsc forces you to check the shape right where you use it. Better still: type it from a schema (Zod, Chapter 16).', 'xanh')),
    en: 'Any compiles, then crashes. Typing a prop as any makes the red squiggle disappear: tsc says nothing about data dot points dot map, and passing an empty object compiles. At runtime: TypeError, cannot read properties of undefined, reading map. Unknown is the honest choice: tsc reports TS18046 and forces a check exactly where you use it.' },
  { t: 'Typing a component\'s props — the checklist', body: icards([
      ['type', '1 · Name the shape once', '<code>type CardProps = { title: string; onClose?: () =&gt; void }</code> — one declaration checks every call site.'],
      ['code', '2 · Annotate the parameter', '<code>function Card({ title }: CardProps)</code>. <code>React.FC</code> no longer adds children, but buys you nothing either.'],
      ['check', '3 · Optional ⇒ give it a default', '<code>{ size = \'md\' }</code> — remember: only <code>undefined</code> triggers it, not <code>null</code>.'],
      ['box', '4 · children is React.ReactNode', 'The widest renderable type. Add it only when the component actually renders it.'],
    ], 2),
    en: 'The checklist: name the shape once with a type; annotate the parameter, not the function; give optional props a default, remembering only undefined triggers it; and type children as React node, only when the component actually renders it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Prop type', 'a TypeScript type describing a component\'s inputs'), kw('Optional prop', 'prop?: T — may be omitted; usually paired with a default'),
      kw('Default value', 'fallback set in destructuring; fires only for undefined'), kw('Callback prop', 'a function prop the child calls to send events up'),
      kw('Spread props', '{...rest} forwards many props at once — order matters'), kw('unknown vs any', 'unknown forces a check; any switches checking off'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: prop type; optional prop; default value; callback prop; spread props; and unknown versus any.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Type a ${c('Badge')} with an optional ${c('label')} (default) and a required union ${c('tone')}; try ${c('label={null}')}`,
      `Pass ${c('onSelect')} from a parent to a child and call it on click; show the result in the parent`,
      `Wrap ${c('<button>')} with ${c('{...rest}')} — test both spread orders with ${c('type="submit"')}`,
      `Change a prop to ${c('any')}, pass ${c('{}')}, watch it compile and crash; switch to ${c('unknown')}`,
    ]), box('Keep these', `<ul><li>Defaults fire only for <code>undefined</code></li><li>Spread: unknown props leak; last one wins</li><li>Data down, events up via callbacks</li><li>Type props; prefer <code>unknown</code> over <code>any</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: type a Badge with a default label and a required tone, then try label null; pass onSelect down and call it; wrap a button with rest props and test both spread orders; and change a prop to any, watch it compile and crash, then switch to unknown. Keep: defaults fire only for undefined; spread leaks unknown props and the last one wins; data down, events up; type your props.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Components, props & composition', bai: '2.3' }, S);
