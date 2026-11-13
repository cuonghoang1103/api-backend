/**
 * nxj-02-1 — Next.js · Chapter 2 · Lesson 2.1 "Props: a component's inputs" (deck video + web, 13/11/2026).
 * Bài web: nextjs-2-1-props. Output THẬT (scratchpad/nxj/demo/n2-1.txt · Next.js 16.4.6 · React 19.3.0 · Node 22.23.3, ~/.rtq-nxj/lab/c1/my-app)
 * + ảnh trình duyệt THẬT (Playwright, scratchpad/nxj/spec/nxj-2-1.json ⇒ _nxj-anh/nxj-02-1/*.webp):
 *  - UserCard ⇒ <link rel="preload" as="image" href="/a.png"/><div class="card"><img src="/a.png" alt="An"/><h3>An</h3></div>
 *    (React 19 TỰ thêm <link rel="preload"> cho ảnh — web cũ in output thiếu dòng này, đã sửa).
 *  - props.name = 'x': NODE_ENV=development ⇒ TypeError "Cannot assign to read only property 'name' of object '#<Object>'"; production ⇒ <p>Hi x</p> (lặng lẽ).
 *    next dev ⇒ lớp phủ "Runtime TypeError" chỉ đúng dòng 3.
 *  - items.push trong con: render 3 lần ⇒ mảng của cha 2 → 3 → 4 → 5 món.
 *  - memo + items={[]}: bấm 3 lần ⇒ ListA render 4 (mảng mới mỗi lần), ListB (items={RONG}) render 1.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-1:file:usercard.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nfunction Avatar({ src, alt }) {\n  return h('img', { src, alt });\n}\nfunction UserCard({ user }) {\n  return h('div', { className: 'card' }, h(Avatar, { src: user.avatar, alt: user.name }), h('h3', null, user.name));\n}\nconsole.log(renderToStaticMarkup(h(UserCard, { user: { name: 'An', avatar: '/a.png' } })));\n",
 "n2-1:card": "$ node usercard.cjs\n<link rel=\"preload\" as=\"image\" href=\"/a.png\"/><div class=\"card\"><img src=\"/a.png\" alt=\"An\"/><h3>An</h3></div>",
 "n2-1:file:props.cjs": "'use strict';\nconst React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nfunction Greeting(props) {\n  props.name = 'x';                       // ✗ sửa prop\n  return React.createElement('p', null, 'Hi ', props.name);\n}\ntry {\n  console.log(renderToStaticMarkup(React.createElement(Greeting, { name: 'An' })));\n} catch (e) {\n  console.log('TypeError: ' + e.message);\n}\n",
 "n2-1:dongbang": "$ NODE_ENV=development node props.cjs\nTypeError: Cannot assign to read only property 'name' of object '#<Object>'\n$ NODE_ENV=production node props.cjs\n<p>Hi x</p>",
 "n2-1:file:total.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nfunction Total({ items }) {\n  items.push({ price: 0 });               // ✗ mutate mảng của cha\n  return React.createElement('p', null, items.length, ' items');\n}\nconst gio = [{ price: 10 }, { price: 20 }];   // dữ liệu của CHA: 2 món\nfor (let lan = 1; lan <= 3; lan++) {\n  const html = renderToStaticMarkup(React.createElement(Total, { items: gio }));\n  console.log(`render #${lan}: ${html}   · mảng của cha giờ có ${gio.length} món`);\n}\n",
 "n2-1:mutate": "$ node total.cjs\nrender #1: <p>3 items</p>   · mảng của cha giờ có 3 món\nrender #2: <p>4 items</p>   · mảng của cha giờ có 4 món\nrender #3: <p>5 items</p>   · mảng của cha giờ có 5 món",
 "n2-1:file:src/app/memo/page.tsx": "'use client';\nimport { memo, useState } from 'react';\n\nlet demA = 0;\nlet demB = 0;\nconst RONG: string[] = [];\n\nconst ListA = memo(function ListA({ items }: { items: string[] }) {\n  demA++;\n  return <p id=\"a\">ListA (items={'{[]}'}) render: {demA} · {items.length} món</p>;\n});\nconst ListB = memo(function ListB({ items }: { items: string[] }) {\n  demB++;\n  return <p id=\"b\">ListB (items={'{RONG}'}) render: {demB} · {items.length} món</p>;\n});\n\nexport default function Memo() {\n  const [n, setN] = useState(0);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <button className=\"rounded border px-3\" onClick={() => setN(n + 1)}>Cha render lại: {n}</button>\n      <ListA items={[]} />\n      <ListB items={RONG} />\n    </div>\n  );\n}\n",
 "n2-1:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -A16 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /bien\n├ ○ /dem\n├ ○ /gio\n├ ○ /hien\n├ ○ /key\n├ ○ /khoang\n├ ○ /memo\n├ ○ /tay\n├ ○ /the\n└ ○ /thuoc\n\n\n○  (Static)  prerendered as static content\n$ curl -s -o /dev/null -w 'GET /memo → %{http_code}\\n' localhost:19320/memo\nGET /memo → 200",
 "n2-1:file:src/app/sua-prop/page.tsx": "'use client';\nfunction Greeting(props: { name: string }) {\n  props.name = 'x';\n  return <p className=\"p-6 font-sans text-xl\">Hi {props.name}</p>;\n}\n\nexport default function SuaProp() {\n  return <Greeting name=\"An\" />;\n}\n",
 "n2-1:dev": "$ curl -s -o /dev/null -w 'GET /sua-prop (dev) → %{http_code}\\n' localhost:19321/sua-prop\nGET /sua-prop (dev) → 500",
 "n2-1:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, cmp, box, two, steps, kw, c, cay, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-02-1', code: 'NXJ 2.1', title: "Props: a component's inputs", sub: 'Chapter 2 · Lesson 2.1' };
const O = (k) => { const v = DU_LIEU[`n2-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-02-1', ten, { vp: 640, ...o });

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.1', t: "Props: a component's<br>inputs", sub: 'A component is a function; props are its arguments — they flow down, one way, and are read-only',
    en: 'Lesson two point one: props, a component\'s inputs. A component is a function and props are its arguments. Data flows down, one way, and props are read-only.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Passing and receiving props — one object, destructured</li>
    <li>Data flows one way: down</li>
    <li>Props are read-only — what React 19 does when you write to them</li>
    <li>Mutating a prop corrupts the parent's data — measured</li>
    <li>To send data up, pass a function down</li>
    <li>The inline <code>[]</code> / <code>{}</code> prop trap</li></ul>`,
    en: 'Six takeaways: passing and receiving props; one-way data flow; props are read-only and what React nineteen does when you write to them; how mutating a prop corrupts the parent\'s data; sending data up with a function; and the inline array or object prop trap.' },
  { t: 'A component is a function; props are its arguments', body: two(tsx(`function Avatar({ src, alt }) {
  return <img src={src} alt={alt} />;
}

function UserCard({ user }) {
  return (
    <div className="card">
      <Avatar src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  );
}

<UserCard user={{ name: 'An', avatar: '/a.png' }} />`, { sm: true, hl: [8, 14] }),
      cay({ t: '<UserCard>', s: "props: { user }" }, [{ t: '<Avatar>', s: 'src, alt' }, { t: '<h3>', s: 'user.name' }], { w: 520, h: 230 }) +
      box('Parent passes attributes; child receives ONE object', 'React calls <code>UserCard({ user })</code>. You almost always destructure it right in the parameter list.', 'xanh')),
    en: 'A component is a function, and props are its arguments. The parent passes them like JSX attributes; the child receives a single object, which you almost always destructure. UserCard gets user and hands pieces of it down to Avatar. Rendered for real with react-dom server, React nineteen even adds a preload link for the image before the card.' },
  { t: 'Measured: React 19 adds a preload for the image', body: tn(O('card'), { fs: 15, wrap: 100 }) + two(
      box('Expected', '<code>&lt;div class="card"&gt;&lt;img src="/a.png" alt="An"/&gt;&lt;h3&gt;An&lt;/h3&gt;&lt;/div&gt;</code> — the tree you described.', 'lam'),
      box('Also there: <code>&lt;link rel="preload" as="image"&gt;</code>', 'React 19 hoists a preload hint for images it renders on the server, so the browser can start downloading <code>/a.png</code> early. Your tree is unchanged; React added a resource hint.', 'xanh')) +
    box('Same shape everywhere', 'A tree of components, each receiving props from its parent and passing props to its children. That is every React app.', 'cam'), to: true,
    en: 'One detail the old text missed: the real output starts with a link tag, rel preload, as image, for slash a dot png. React nineteen hoists a preload hint for images rendered on the server, so the browser starts downloading early. Your tree is unchanged — div class card, img, h3 An — React simply added a resource hint.' },
  { t: 'Props flow one way: down', body: two(seq(['Parent', 'Child A', 'Child B'], [
      [0, 1, 'props ↓', '#0070f3'], [0, 2, 'props ↓', '#0070f3'],
      [1, 2, '✗ no sideways props', '#c0392b', true], [1, 0, '✗ cannot read parent vars', '#c0392b', true],
      [1, 0, 'call a function prop ↑ (lesson 2.3)', '#1f8a3b', true],
    ], { w: 560, rh: 62, fs: 16 }),
      steps(['Data goes parent → child, never sideways or up', 'A child cannot reach into its parent\'s data', 'Siblings share data through their closest common parent', 'Feels limiting — but you always know where a component\'s data came from: its parent, via props'])) +
    box('No spooky action at a distance', 'Look at any component and you know exactly where its data came from. That predictability is the point.', 'xanh'),
    en: 'Props flow one way: down. Data goes from parent to child, never sideways or up. A child cannot reach into its parent\'s data, and siblings cannot pass props to each other — shared data lives in the closest common parent. It sounds limiting, but it means that looking at any component, you know exactly where its data came from.' },
  { t: 'Props are read-only — measured on React 19', body: tsx(O('file:props.cjs').split('\n').slice(3, 7).join('\n'), { sm: true, hl: [2] }) + two(
      tn(O('dongbang'), { fs: 13, wrap: 72 }),
      `<div>${br('nxj-02-1', 'sua-prop', { vp: 960, url: 'localhost:3000/sua-prop · next dev', h: 330, w: 430 })}</div>`, 'r64') +
    two(box('Development: React freezes props', 'Writing to one throws <b>Cannot assign to read only property \'name\'</b> — and <code>next dev</code> shows a Runtime TypeError overlay at the exact line.', 'do2'),
      box('Production: no freeze, silent', 'The same code prints <code>Hi x</code> — and the parent overwrites it on the next render anyway. A lie either way.', 'cam')),
    en: 'Props are read-only, measured. In development, React freezes the props object, so assigning to props dot name throws: cannot assign to read only property name. The Next dev server shows a Runtime TypeError overlay pointing at the exact line. In production nothing is frozen, so the same code silently prints Hi x — until the parent overwrites it on the next render. A lie either way.' },
  { t: 'Mutating a prop corrupts the parent\'s data', body: tsx(O('file:total.cjs').split('\n').slice(2, 9).join('\n'), { sm: true, hl: [2, 5] }) +
      tn(O('mutate'), { fs: 15, wrap: 100 }) +
    box('Freezing is shallow: the ARRAY is not frozen', '<code>items.push(…)</code> does not throw — it quietly grows the parent\'s array: 3 → 4 → 5 items over three renders. Treat props as frozen; compute a new value instead: <code>const sorted = [...items].sort(…)</code>.', 'do2') +
    box('The whole model depends on it', 'Same props in ⇒ same UI out. A component that writes to its inputs is no longer a pure function of props.', 'lam'),
    en: 'Mutating a prop corrupts the parent\'s data. The freeze is shallow: the array inside props is not frozen, so items dot push does not throw. Measured over three renders, the parent\'s cart grew from two items to three, four, five. Treat props as frozen and compute a new value instead — copy then sort. The whole model, same props in, same UI out, depends on it.' },
  { t: 'How data moves in a React tree', body: icards([
      ['tree', '1 · Props go down, only down', 'A parent passes values to a child. The child cannot reach back up — that one-way rule makes the tree predictable.'],
      ['lock', '2 · Props are read-only', 'Assigning to <code>props.title</code> throws in dev (frozen) and is silently overwritten in production.'],
      ['plug', '3 · To send data up, pass a function down', 'The parent owns the state and hands the child a callback. The child calls it; the parent decides what changes.'],
      ['merge', '4 · Siblings share by lifting state up', 'When two siblings need the same value, it moves to their closest common parent — the most common refactor in React.'],
    ], 2),
    en: 'Four rules for how data moves: props go down, only down; props are read-only; to send data up, pass a function down — the parent owns the state and decides; and siblings share by lifting state up to their closest common parent.' },
  { t: 'Trap: a new [] or {} on every render', body: two(
      tsx((() => { const L = O('file:src/app/memo/page.tsx').split('\n'); return [L[5], '// …', ...L.slice(21, 23).map((l) => l.trim())].join('\n'); })(), { hl: [3] }),
      `<div><div class="cap" style="font-weight:700">After clicking 3 times (real browser, next start)</div>${B('memo-sau', { url: 'localhost:3000/memo', h: 140, w: 520, mark: [[24, 62, 330, 28, ''], [24, 98, 340, 28, '']] })}</div>`) +
    two(box('items={[]} ⇒ a brand-new array each render', 'Equal by value, different by identity — so <code>React.memo</code> sees a changed prop: <b>ListA rendered 4 times</b>. Any <code>useEffect</code> depending on it fires every time too.', 'do2'),
      box('items={RONG} (a constant outside) ⇒ same identity', '<b>ListB rendered once.</b> Hoist constants out of the component, or memoize computed values with <code>useMemo</code> (Chapter 6).', 'xanh')),
    en: 'The trap: an inline array or object prop creates a brand-new value on every render. Measured in a real browser after three clicks: ListA, given items equals an empty array literal, rendered four times despite React memo, because the array has a new identity each time. ListB, given a constant defined outside the component, rendered once. Hoist constants out, or memoize with useMemo.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Props', 'a component\'s inputs, passed from the parent as attributes'), kw('Read-only', 'a child never modifies its props; data flows one way'),
      kw('One-way data flow', 'data goes parent → child; changes come back up via callbacks'), kw('Default prop', 'a fallback value used when the parent passes nothing'),
      kw('Props object', 'all props arrive as one object; destructure it for clarity'), kw('Reusable component', 'same component, different props — the core of composition'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: props; read-only; one-way data flow; default prop; the props object; and reusable components.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build ${c('<Greeting name=… />')} and render it three times with different names from a parent`,
      `Assign ${c('props.name = "x"')} in the child — run it in dev and read the error; move the change up to the parent`,
      'Add a second prop with a default value and render once without passing it',
      `Pass ${c('items={[]}')} to a memo child, click the parent, count the renders — then hoist the constant`,
    ]), box('Keep these', `<ul><li>Props = function arguments, one object</li><li>Data flows down, one way</li><li>Never write to props (dev throws; prod lies)</li><li>Send data up by passing a function down</li></ul>`, 'lam'), ''),
    en: 'Your turn: build a Greeting rendered three times; assign to props name in dev and read the error, then move the change to the parent; add a default prop; and pass an inline empty array to a memo child and count renders before hoisting it. Keep: props are function arguments; data flows down; never write to props; send data up by passing a function down.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Components, props & composition', bai: '2.1' }, S);
