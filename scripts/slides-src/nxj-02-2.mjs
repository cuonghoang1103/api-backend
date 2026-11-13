/*DU_LIEU*/
const DU_LIEU = {
 "n2-2:file:children.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;               // JSX <X a=\"1\">…</X>  =  h(X, { a: '1' }, …)\nlet nhan;\nfunction Hop({ children }) {\n  nhan = children;                           // ghi lại đúng thứ component nhận được\n  return null;\n}\nconst ta = (c) => c === undefined ? 'undefined' : Array.isArray(c) ? `mảng ${c.length} phần tử` : typeof c === 'object' ? `1 element <${c.type}>` : `${typeof c} '${c}'`;\nconst thu = [\n  ['<Hop />', h(Hop)],\n  ['<Hop>chào</Hop>', h(Hop, null, 'chào')],\n  ['<Hop><p /></Hop>', h(Hop, null, h('p'))],\n  ['<Hop><p /><b /></Hop>', h(Hop, null, h('p'), h('b'))],\n  ['<Hop children={<p />} />', h(Hop, { children: h('p') })],\n];\nfor (const [jsx, el] of thu) {\n  renderToStaticMarkup(el);\n  console.log(jsx.padEnd(26), '→', ta(nhan), '· Children.count =', React.Children.count(nhan));\n}\n",
 "n2-2:kieu": "$ node children.cjs\n<Hop />                    → undefined · Children.count = 0\n<Hop>chào</Hop>            → string 'chào' · Children.count = 1\n<Hop><p /></Hop>           → 1 element <p> · Children.count = 1\n<Hop><p /><b /></Hop>      → mảng 2 phần tử · Children.count = 2\n<Hop children={<p />} />   → 1 element <p> · Children.count = 1",
 "n2-2:file:quen.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nfunction Panel({ title }) {                  // ✗ quên {children}\n  return h('section', null, h('h2', null, title));\n}\nconsole.log(renderToStaticMarkup(h(Panel, { title: 'Hi' }, h('p', null, 'inner text'), h('button', null, 'OK'))));\n",
 "n2-2:file:src/thu22/bay.tsx": "function Title({ text }: { text: string }) {\n  return <h2>{text}</h2>;\n}\nfunction Hop({ children }: { children: React.ReactNode }) {\n  return <div>{children}</div>;\n}\nexport const a = <Title text=\"Hi\">thêm chữ</Title>;\nexport const b = <Hop children={<p>A</p>}><p>B</p></Hop>;\nexport const c = <Hop />;\n",
 "n2-2:quen": "$ node quen.cjs 2>&1; echo \"exit=$?\"\n<section><h2>Hi</h2></section>\nexit=0\n$ npx tsc --noEmit\nsrc/thu22/bay.tsx(7,19): error TS2322: Type '{ children: string; text: string; }' is not assignable to type 'IntrinsicAttributes & { text: string; }'.\n  Property 'children' does not exist on type 'IntrinsicAttributes & { text: string; }'.\nsrc/thu22/bay.tsx(8,23): error TS2710: 'children' are specified twice. The attribute named 'children' will be overwritten.\nsrc/thu22/bay.tsx(9,19): error TS2741: Property 'children' is missing in type '{}' but required in type '{ children: ReactNode; }'.",
 "n2-2:file:src/app/ghep/page.tsx": "type Co = { children: React.ReactNode };\n\nfunction Panel({ title, children }: { title: string } & Co) {\n  return (\n    <section className=\"panel rounded-xl border-2 border-sky-500 bg-white shadow\">\n      <h2 className=\"rounded-t-lg bg-sky-500 px-4 py-1 font-bold text-white\">{title}</h2>\n      <div className=\"body p-4\">{children}</div>\n    </section>\n  );\n}\n\ntype Slots = { sidebar: React.ReactNode; main: React.ReactNode };\n\nfunction Layout({ sidebar, main }: Slots) {\n  return (\n    <div className=\"grid grid-cols-[150px_1fr] gap-3\">\n      <aside className=\"rounded-xl bg-slate-100 p-3\">{sidebar}</aside>\n      <main>{main}</main>\n    </div>\n  );\n}\n\nexport default function Ghep() {\n  return (\n    <div className=\"space-y-3 bg-slate-50 p-5 font-sans text-sm text-slate-900\">\n      <div className=\"grid grid-cols-3 gap-3\">\n        <Panel title=\"Tin nhắn\">\n          <p>An: tối nay họp nhé?</p>\n          <p className=\"text-right\">Bình: ok 8h</p>\n        </Panel>\n        <Panel title=\"Cài đặt\">\n          <label className=\"block\"><input type=\"checkbox\" defaultChecked /> Thông báo</label>\n          <label className=\"block\"><input type=\"checkbox\" /> Chế độ tối</label>\n        </Panel>\n        <Panel title=\"Quiz\">\n          <p>2 + 2 = ?</p>\n          <button className=\"mt-1 rounded bg-sky-500 px-3 text-white\">4</button>\n        </Panel>\n      </div>\n      <Layout\n        sidebar={<nav className=\"space-y-1\"><p>🏠 Trang chủ</p><p>📚 Khoá học</p></nav>}\n        main={<Panel title=\"Bảng tin\"><p>Hai khe: sidebar và main</p></Panel>}\n      />\n    </div>\n  );\n}\n",
 "n2-2:file:src/app/vo/page.tsx": "'use client';\nimport { useState } from 'react';\n\nlet demTrong = 0;\nlet demNgoai = 0;\n\nfunction ChamTrong() {\n  demTrong++;\n  return <p id=\"trong\">ChamTrong (vẽ TRONG KhungA) render: {demTrong}</p>;\n}\nfunction ChamNgoai() {\n  demNgoai++;\n  return <p id=\"ngoai\">ChamNgoai (truyền làm children) render: {demNgoai}</p>;\n}\n\nfunction KhungA() {\n  const [n, setN] = useState(0);\n  return (\n    <div className=\"rounded border p-2\">\n      <button id=\"a\" className=\"rounded border px-3\" onClick={() => setN(n + 1)}>KhungA state: {n}</button>\n      <ChamTrong />\n    </div>\n  );\n}\nfunction KhungB({ children }: { children: React.ReactNode }) {\n  const [n, setN] = useState(0);\n  return (\n    <div className=\"rounded border p-2\">\n      <button id=\"b\" className=\"rounded border px-3\" onClick={() => setN(n + 1)}>KhungB state: {n}</button>\n      {children}\n    </div>\n  );\n}\n\nexport default function Vo() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <KhungA />\n      <KhungB>\n        <ChamNgoai />\n      </KhungB>\n    </div>\n  );\n}\n",
 "n2-2:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -A18 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /bien\n├ ○ /dem\n├ ○ /ghep\n├ ○ /gio\n├ ○ /hien\n├ ○ /key\n├ ○ /khoang\n├ ○ /memo\n├ ○ /tay\n├ ○ /the\n├ ○ /thuoc\n└ ○ /vo\n\n\n○  (Static)  prerendered as static content\n$ curl -s localhost:19322/ghep | grep -o '<section class=\"panel[^>]*><h2[^>]*>Quiz</h2>.*</button></div></section>' | sed -E 's/ class=\"[^\"]*\"//g'\n<section><h2>Quiz</h2><div><p>2 + 2 = ?</p><button>4</button></div></section>\n$ curl -s -o /dev/null -w 'GET /vo → %{http_code}\\n' localhost:19322/vo\nGET /vo → 200",
 "n2-2:dung": "",
 "n2-2:file:panel.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nfunction Panel({ title, children }) {\n  return h('section', { className: 'panel' }, h('h2', null, title), h('div', { className: 'body' }, children));\n}\n// <Panel title=\"Hi\"><p>inner text</p><button>OK</button></Panel>\nconsole.log(renderToStaticMarkup(h(Panel, { title: 'Hi' }, h('p', null, 'inner text'), h('button', null, 'OK'))));\n",
 "n2-2:panel": "$ node panel.cjs\n<section class=\"panel\"><h2>Hi</h2><div class=\"body\"><p>inner text</p><button>OK</button></div></section>\n$ grep -n -A9 'export default function RootLayout' src/app/layout.tsx\n20:export default function RootLayout({ children }: LayoutProps<\"/\">) {\n21-  return (\n22-    <html\n23-      lang=\"en\"\n24-      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}\n25-    >\n26-      <body className=\"min-h-full flex flex-col\">{children}</body>\n27-    </html>\n28-  );\n29-}"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, cmp, box, two, steps, kw, c, icards, tree } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-02-2', code: 'NXJ 2.2', title: 'children & composition', sub: 'Chapter 2 · Lesson 2.2' };
const O = (k) => { const v = DU_LIEU[`n2-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-02-2', ten, o);
const dongLenh = (k, i) => O(k).split('\n$ ')[i];

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.2', t: 'children &amp;<br>composition', sub: 'A component that owns the frame and delegates the content — the most useful pattern in React, and the one Next.js layouts are built on',
    en: 'Lesson two point two: children and composition. A component that owns the frame and lets the caller fill the content is the most useful pattern in React, and it is exactly how Next.js layouts work.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Whatever you nest between a component's tags arrives as <code>children</code></li>
    <li>You already use it: the root <code>layout.tsx</code></li>
    <li>What <code>children</code> really is — measured, five cases</li>
    <li>Two silent traps and the three TypeScript errors that catch them</li>
    <li>Composition beats configuration; named slots for several holes</li>
    <li>A bonus: children do not re-render when the wrapper's state changes</li></ul>`,
    en: 'Six takeaways: nested JSX arrives as children; you already use it in the root layout; what children really is, measured in five cases; two silent traps and the TypeScript errors that catch them; composition over configuration, with named slots; and a bonus — children passed in do not re-render when the wrapper\'s own state changes.' },
  { t: 'Anything you nest becomes children', body: two(tsx(`function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="body">{children}</div>
    </section>
  );
}

// the caller — <p> and <button> become Panel's children
<Panel title="Hi">
  <p>inner text</p>
  <button>OK</button>
</Panel>`, { sm: true, hl: [5, 11, 12] }),
      '<div>' + box('Panel owns the frame', 'A titled box with a body. It does not know — or care — what goes in the body.', 'lam') +
      box('The caller owns the content', 'Everything between <code>&lt;Panel&gt;</code> and <code>&lt;/Panel&gt;</code> arrives as the prop <code>children</code> — an ordinary prop with special syntax. Panel decides <b>where</b> to put it.', 'xanh') +
      tn(dongLenh('panel', 0), { fs: 14, wrap: 50 }) + '</div>'),
    en: 'Anything you nest between a component\'s tags becomes children. Panel owns the frame: a titled box with a body. The caller owns the content: the paragraph and the button arrive as the prop children, and Panel decides where to put them. Rendered for real, the paragraph and button land exactly inside the body div.' },
  { t: 'You already use children: the root layout', body: tsx(O('panel').split('\n$ ')[1].split('\n').slice(1).map((l) => l.replace(/^\d+[:-]/, '')).filter((l) => !/^\s+(lang=|className=\{|>$)/.test(l)).map((l) => l.replace('<html', '<html lang="en" className={…}>')).join('\n'), { sm: true, hl: [1, 4] }) + two(
      tree(['my-app/', '  src/app/', '*    layout.tsx   // RootLayout({ children })', '    page.tsx     // ⇒ children at "/"', '    memo/page.tsx  // ⇒ children at "/memo"'], { fs: 19 }),
      box('Next.js fills the slot', 'For every URL, Next.js renders the matching <code>page.tsx</code> and hands it to <code>RootLayout</code> as <code>children</code>. The layout is a Panel for the whole site; Chapter 8 nests them.', 'xanh')),
    en: 'You already use children. Open the root layout that create next app generated: RootLayout receives children and drops them inside body. For every URL, Next.js renders the matching page and hands it to the layout as children. The layout is a Panel for the whole site, and Chapter eight nests them.' },
  { t: 'What children really is — measured', body: tn(O('kieu'), { fs: 17, wrap: 100 }) + two(
      box('Not always an array', 'Nothing ⇒ <code>undefined</code>. One child ⇒ that child itself (a string or one element). Two or more ⇒ an array. Code that does <code>children.map</code> breaks on the first two.', 'do2'),
      box('Treat it as opaque', 'Just render <code>{children}</code>. If you truly must count or walk it, use the <code>React.Children</code> helpers — <code>Children.count</code> got it right in all five cases.', 'xanh')),
    en: 'What does a component actually receive? Measured with five cases: no children gives undefined; one string gives the string; one element gives that element itself; two elements give an array; and children written as an attribute is just one element. So it is not always an array — treat it as opaque, render it, and use the React Children helpers if you must count it.' },
  { t: 'Two silent traps — and what TypeScript says', body: two(tn(dongLenh('quen', 0), { fs: 15, wrap: 60, title: 'node — Panel forgot {children}' }),
      box('Forgot <code>{children}</code>? Content vanishes', 'The <code>&lt;p&gt;</code> and <code>&lt;button&gt;</code> are simply gone. No error, no warning, exit code 0.', 'do2'), 'r46') +
    tn('$ ' + dongLenh('quen', 1), { fs: 14, wrap: 104 }) +
    two(box('TS2322 · TS2741', 'A component that does not declare <code>children</code> rejects nested content; one that requires it rejects <code>&lt;Hop /&gt;</code>.', 'lam'),
      box('TS2710', '<code>children</code> as an attribute <b>and</b> nested: the attribute is overwritten — only TypeScript tells you.', 'cam')),
    en: 'Two silent traps. First: Panel forgets to render children — the paragraph and button simply vanish, no error, exit code zero. Second: children given twice. TypeScript catches both kinds: TS2322 when a component without a children prop receives nested content, TS2741 when a required children is missing, and TS2710 when children is specified twice and the attribute is overwritten.' },
  { t: 'Composition beats configuration', body: two(tsx(`// ❌ configuration: one prop per need
<Card
  title="Hi"
  bodyText="inner text"
  showButton={true}
  buttonLabel="OK"
  buttonVariant="primary"
/>

// ✅ composition: hand over a hole
<Card title="Hi">
  <p>inner text</p>
  <button className="primary">OK</button>
</Card>`, { sm: true, hl: [5, 6, 7, 11, 12, 13] }),
      cmp(['', 'Props road', 'children road'], [
        ['New need', 'add a prop', 'caller nests it'],
        ['After 10 needs', 'nobody knows which combos are valid', 'Card unchanged'],
        ['Unforeseen use', 'impossible without editing Card', 'already works'],
      ], { hl: [1] })) +
    box('Smell to watch for', 'A boolean added to serve exactly one call site — <code>&lt;Modal title confirmText cancelText showClose hideFooter danger wide /&gt;</code>. Flip it: render <code>children</code>.', 'do2'),
    en: 'Composition beats configuration. Without children, people bolt on a prop for every need: title, body text, show button, button label, button variant — until nobody knows which combinations are valid. Composition hands the caller a hole and lets them drop a real button in. The smell to watch for: a boolean added to serve exactly one call site.' },
  { t: 'One shell, any content — in a real browser', body: two(`<div>${B('ghep', { vp: 720, h: 250, w: 700, url: 'localhost:3000/ghep · next start', mark: [[20, 20, 219, 108, ''], [20, 140, 150, 84, 'sidebar={…}'], [182, 140, 518, 84, 'main={…}']] })}</div>`,
      `<div>` + box('Same Panel, three jobs', 'A message thread, a settings box, a quiz — one component, zero extra props. The difference lives in the JSX each caller nests.', 'xanh') +
      box('Two holes? Two props', '<code>Layout</code> takes <code>sidebar</code> and <code>main</code>: elements are ordinary values, so you can pass them through any prop.', 'lam') + `</div>`, 'r64'),
    en: 'One shell, any content, in a real browser after next build and next start. The same Panel wraps a message thread, a settings box, and a quiz with zero extra props. Below, a Layout component has two holes, so it takes two props, sidebar and main — elements are ordinary values you can pass through any prop.' },
  { t: 'Named slots: elements are values', body: two(tsx(O('file:src/app/ghep/page.tsx').split('\n').slice(11, 21).join('\n').replace(/ className="[^"]*"/g, '') + '\n\n// the caller (classes trimmed)\n<Layout\n  sidebar={<nav>…</nav>}\n  main={<Panel title="Bảng tin">…</Panel>}\n/>', { sm: true, hl: [1, 3, 6, 7, 14, 15] }),
      icards([
        ['plug', 'children = the default slot', 'Use it for the one main hole. Most wrappers need only this.'],
        ['stack', 'Named slots = element props', '<code>header</code>, <code>sidebar</code>, <code>footer</code>… typed as <code>React.ReactNode</code>.'],
        ['layers', 'No inheritance', 'A <code>PrimaryButton</code> wraps <code>&lt;button&gt;</code> with defaults; it never extends a base class.'],
      ], 1), 'r64'),
    en: 'Named slots work because elements are values. Layout declares two props typed as React node and places each one in its own region; the caller passes a nav element and a Panel element. Children is the default slot for the one main hole; named props cover the rest. And React has no inheritance: a PrimaryButton wraps a button with defaults, it never extends a base class.' },
  { t: 'Bonus, measured: children skip a re-render', body: two(tsx(`function KhungA() {   // makes the child
  const [n, setN] = useState(0);
  return <div>…<ChamTrong /></div>;
}
function KhungB({ children }) {  // gets it
  const [n, setN] = useState(0);
  return <div>…{children}</div>;
}

<KhungA />
<KhungB><ChamNgoai /></KhungB>`, { sm: true, hl: [3, 7, 11] }),
      `<div><div class="cap" style="font-weight:700">Each button clicked 3 times (real browser, next start)</div>${B('vo-sau', { vp: 640, h: 200, w: 560, url: 'localhost:3000/vo', mark: [[33, 63, 392, 28, ''], [33, 147, 392, 28, '']] })}</div>`) +
    two(box('ChamTrong: 4 renders', 'KhungA\'s state changed, so KhungA ran again — and created a <b>new</b> <code>&lt;ChamTrong /&gt;</code> element each time.', 'do2'),
      box('ChamNgoai: 1 render', 'The element was created by the parent, which never re-rendered. Same element ⇒ React skips it. Chapter 7 explains why; Chapter 9 reuses it for Server Components.', 'xanh')),
    en: 'A bonus, measured in a real browser. Two wrappers with their own counter state, each clicked three times. ChamTrong, rendered inside KhungA, ran four times, because every KhungA render creates a new element for it. ChamNgoai, passed in as children, ran once: its element was created by the parent, which never re-rendered, so React skipped it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('children', 'the special prop holding whatever JSX a component wraps'), kw('Composition', 'building UI by nesting components, not adding props'),
      kw('Slot', 'a named place to pass JSX through a prop, besides children'), kw('Wrapper component', 'a component whose job is to frame its children'),
      kw('Config vs composition', 'many boolean props versus passing the pieces in'), kw('React.Children', 'helpers to count or walk an opaque children value'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: children; composition; slot; wrapper component; configuration versus composition; and the React Children helpers.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a ${c('<Card>')} that renders ${c('{children}')} in a styled box; wrap three different pieces of JSX with it`,
      `Add a named slot ${c('header={…}')} next to ${c('children')}, typed ${c('React.ReactNode')}`,
      'Delete {children} from the Card on purpose — watch the content vanish with no error; put it back',
      'Refactor a ten-prop component into one that takes children — count the props you deleted',
    ]), box('Keep these', `<ul><li>Nested JSX = the <code>children</code> prop</li><li>The component owns the frame; the caller owns the content</li><li>Render <code>{children}</code>; never assume an array</li><li>Several holes ⇒ named element props</li></ul>`, 'lam'), ''),
    en: 'Your turn: build a Card that renders children and wrap three pieces of JSX; add a named header slot; delete children on purpose and watch the content vanish silently, then put it back; and refactor a ten-prop component to take children. Keep: nested JSX is the children prop; the component owns the frame, the caller owns the content; never assume an array; several holes means named element props.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Components, props & composition', bai: '2.2' }, S);
