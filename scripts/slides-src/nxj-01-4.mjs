/**
 * nxj-01-4 — Next.js · Chapter 1 · Lesson 1.4 "Lists and conditions" (deck video + web, 13/11/2026).
 * Bài web: nextjs-1-4-danh-sach-dieu-kien. Output THẬT (scratchpad/nxj/demo/n1-4.txt · Next.js 16.4.6 · React 19.3.0 · Node 22.23.3, ~/.rtq-nxj/lab/c1/my-app)
 * + ảnh trình duyệt THẬT (Playwright, scratchpad/nxj/spec/nxj-1-4.json ⇒ _nxj-anh/nxj-01-4/*.webp):
 *  - renderToStaticMarkup: map ⇒ <ul><li>a</li><li>b</li><li>c</li></ul>; forEach ⇒ <ul></ul>; map quên return ⇒ <ul></ul>; {0} ⇒ <div>0<span>x</span></div>; {false} ⇒ <div><span>x</span></div>.
 *  - tsc: forEach trong JSX ⇒ TS2322 "Type 'void' is not assignable to type 'ReactNode'"; map quên return ⇒ TS2322 "Type 'void[]' …".
 *  - next dev, thiếu key ⇒ console: Each child in a list should have a unique "key" prop. … Check the render method of `ThieuKey`.
 *  - /gio: bấm "Xoá hết" ⇒ cột items.length && … hiện "0" trơ trọi; cột items.length > 0 ? … : … hiện "Giỏ hàng trống".
 *  - /key: tích "An" cả hai cột, xoá dòng đầu ⇒ key={i}: "Bình ☑, Chi ☐" (dấu tích ở NHẦM dòng); key={p.id}: "Bình ☐, Chi ☐".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-4:file:ds.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nconst items = ['a', 'b', 'c'];\nconst r = (nhan, el) => console.log(nhan.padEnd(18) + renderToStaticMarkup(el));\nr('map', h('ul', null, items.map((t) => h('li', { key: t }, t))));\nr('forEach', h('ul', null, items.forEach((t) => h('li', { key: t }, t))));\nr('map, quên return', h('ul', null, items.map((t) => { h('li', { key: t }, t); })));\nr('{0}', h('div', null, 0, h('span', null, 'x')));\nr('{false}', h('div', null, false, h('span', null, 'x')));\n",
 "n1-4:ds": "$ node ds.cjs\nmap               <ul><li>a</li><li>b</li><li>c</li></ul>\nforEach           <ul></ul>\nmap, quên return  <ul></ul>\n{0}               <div>0<span>x</span></div>\n{false}           <div><span>x</span></div>",
 "n1-4:file:src/app/map/page.tsx": "const items = ['a', 'b', 'c'];\n\nexport default function DanhSach() {\n  return (\n    <>\n      <ul>{items.forEach((t) => <li key={t}>{t}</li>)}</ul>\n      <ul>{items.map((t) => { <li key={t}>{t}</li>; })}</ul>\n    </>\n  );\n}\n",
 "n1-4:ts": "$ npx tsc --noEmit\nsrc/app/map/page.tsx(6,11): error TS2322: Type 'void' is not assignable to type 'ReactNode'.\nsrc/app/map/page.tsx(7,11): error TS2322: Type 'void[]' is not assignable to type 'ReactNode'.\n  Type 'void[]' is not assignable to type 'Iterable<ReactNode>'.\n    The types returned by '[Symbol.iterator]().next(...)' are incompatible between these types.\n      Type 'IteratorResult<void, undefined>' is not assignable to type 'IteratorResult<ReactNode, any>'.\n        Type 'IteratorYieldResult<void>' is not assignable to type 'IteratorResult<ReactNode, any>'.\n          Type 'IteratorYieldResult<void>' is not assignable to type 'IteratorYieldResult<ReactNode>'.\n            Type 'void' is not assignable to type 'ReactNode'.",
 "n1-4:file:feed.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nfunction Feed({ posts, loading }) {\n  let body;\n  if (loading) body = h('p', null, 'Đang tải…');\n  else if (posts.length === 0) body = h('p', null, 'Chưa có bài nào');\n  else body = posts.map((p) => h('article', { key: p.id }, p.title));\n  return h('section', null, body);\n}\nconsole.log(renderToStaticMarkup(h(Feed, { loading: true, posts: [] })));\nconsole.log(renderToStaticMarkup(h(Feed, { loading: false, posts: [] })));\nconsole.log(renderToStaticMarkup(h(Feed, { loading: false, posts: [{ id: 1, title: 'Bài 1' }, { id: 2, title: 'Bài 2' }] })));\n",
 "n1-4:feed": "$ node feed.cjs\n<section><p>Đang tải…</p></section>\n<section><p>Chưa có bài nào</p></section>\n<section><article>Bài 1</article><article>Bài 2</article></section>",
 "n1-4:file:src/app/gio/page.tsx": "'use client';\nimport { useState } from 'react';\n\nconst BAN_DAU = [{ id: 1, ten: 'Bàn phím' }, { id: 2, ten: 'Chuột' }, { id: 3, ten: 'Lót chuột' }];\n\nexport default function Gio() {\n  const [items, setItems] = useState(BAN_DAU);\n  return (\n    <div className=\"grid grid-cols-2 gap-4 p-5 font-sans\">\n      <section id=\"sai\" className=\"rounded-xl border p-4\">\n        <h2 className=\"font-bold\">✗ items.length &amp;&amp; …</h2>\n        {items.length && <ul className=\"list-disc pl-5\">{items.map((m) => <li key={m.id}>{m.ten}</li>)}</ul>}\n      </section>\n      <section id=\"dung\" className=\"rounded-xl border p-4\">\n        <h2 className=\"font-bold\">✓ items.length &gt; 0 ? … : …</h2>\n        {items.length > 0 ? (\n          <ul className=\"list-disc pl-5\">{items.map((m) => <li key={m.id}>{m.ten}</li>)}</ul>\n        ) : (\n          <p className=\"text-gray-500\">Giỏ hàng trống</p>\n        )}\n      </section>\n      <button className=\"col-span-2 rounded border px-3 py-1\" onClick={() => setItems([])}>Xoá hết</button>\n    </div>\n  );\n}\n",
 "n1-4:file:src/app/key/page.tsx": "'use client';\nimport { useState } from 'react';\n\nconst DS = [{ id: 'an', ten: 'An' }, { id: 'binh', ten: 'Bình' }, { id: 'chi', ten: 'Chi' }];\n\nfunction Danh({ tieuDe, theoChiSo }: { tieuDe: string; theoChiSo: boolean }) {\n  const [ds, setDs] = useState(DS);\n  return (\n    <section className=\"rounded-xl border p-4\">\n      <h2 className=\"mb-2 font-bold\">{tieuDe}</h2>\n      {ds.map((p, i) => (\n        <label key={theoChiSo ? i : p.id} className=\"flex gap-2\">\n          <input type=\"checkbox\" /> {p.ten}\n        </label>\n      ))}\n      <button className=\"mt-2 rounded border px-2\" onClick={() => setDs(ds.slice(1))}>Xoá dòng đầu</button>\n    </section>\n  );\n}\n\nexport default function Key() {\n  return (\n    <div className=\"grid grid-cols-2 gap-4 p-5 font-sans\">\n      <Danh tieuDe=\"✗ key={i}\" theoChiSo />\n      <Danh tieuDe=\"✓ key={p.id}\" theoChiSo={false} />\n    </div>\n  );\n}\n",
 "n1-4:file:src/app/thieukey/page.tsx": "'use client';\nconst items = ['a', 'b', 'c'];\n\nexport default function ThieuKey() {\n  return <ul className=\"p-6 font-sans\">{items.map((t) => <li>{t}</li>)}</ul>;\n}\n",
 "n1-4:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -A14 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /dem\n├ ○ /gio\n├ ○ /hien\n├ ○ /key\n├ ○ /tay\n├ ○ /the\n├ ○ /thieukey\n└ ○ /thuoc\n\n\n○  (Static)  prerendered as static content\n$ curl -s -o /dev/null -w 'GET /gio → %{http_code}\\n' localhost:19315/gio\nGET /gio → 200\n$ curl -s -o /dev/null -w 'GET /thieukey (dev) → %{http_code}\\n' localhost:19316/thieukey\nGET /thieukey (dev) → 200",
 "n1-4:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, cmp, box, two, steps, kw, c, path, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-01-4', code: 'NXJ 1.4', title: 'Lists and conditions', sub: 'Chapter 1 · Lesson 1.4' };
const O = (k) => { const v = DU_LIEU[`n1-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-01-4', ten, { vp: 640, ...o });
const DS = O('ds').split('\n');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.4', t: 'Lists and<br>conditions', sub: 'Render many things, and render things sometimes — both are just expressions in braces',
    en: 'Lesson one point four: lists and conditions. Two patterns cover almost every dynamic UI: turning an array into elements, and showing something only when a condition holds. Both are just JavaScript expressions inside curly braces.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Lists: <code>.map()</code> an array into elements — never <code>forEach</code></li>
    <li>Every list item needs a stable <code>key</code> — and why the index bites</li>
    <li>Conditions: <code>&&</code> to show-or-not, the ternary to choose</li>
    <li>The 0 trap — measured in a real browser</li>
    <li>Pull logic above <code>return</code> when it grows</li>
    <li>Always handle the empty list</li></ul>`,
    en: 'Six takeaways: lists with map, never forEach; a stable key for every item and why the index bites; double ampersand to show or hide and the ternary to choose; the zero trap, measured; pulling logic above the return; and always handling the empty list.' },
  { t: 'Lists: .map() an array into elements', body:
    path([{ t: "['a', 'b', 'c']", s: 'an array of data' }, { t: '.map(t => <li>)', s: 'one element per item', on: true }, { t: '[<li>, <li>, <li>]', s: 'an array of elements' }, { t: '<ul>…</ul>', s: 'React renders the array' }], { h: 140, fs: 18, nhan: ['map', 'returns', 'render'] }) +
    two(tsx(`function List() {
  const items = ['a', 'b', 'c'];
  return (
    <ul>
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}`, { hl: [5] }), tn(`$ node ds.cjs   # rendered with react-dom/server\n${DS[1]}`, { fs: 15, wrap: 60 }) +
      box('JSX has no loop syntax', 'You turn data into an array of elements, and React knows how to render an array.', 'xanh')),
    en: 'JSX has no loop syntax. To render a list you turn an array of data into an array of elements with map, and React knows how to render an array. Rendered for real: the unordered list with three list items a, b and c.' },
  { t: 'map, never forEach — and remember the return', body: two(
      tsx(O('file:src/app/map/page.tsx').split('\n').slice(5, 7).map((l) => l.trim()).join('\n'), { sm: true }) +
      tn(DS.slice(0, 4).join('\n'), { fs: 14, wrap: 64 }),
      tn(O('ts').split('\n').slice(0, 4).join('\n'), { fs: 12, wrap: 64 })) +
    two(box('forEach returns undefined', 'So the braces receive nothing and the list is empty — the most common cause of "my list is blank". TypeScript catches it: <b>Type \'void\' is not assignable to type \'ReactNode\'</b>.', 'do2'),
      box('A body in { } needs an explicit return', '<code>map(t => { &lt;li/&gt; })</code> returns <code>undefined</code> for each item. Write <code>map(t => (&lt;li/&gt;))</code> — the parentheses return for you.', 'cam')),
    en: 'map, never forEach. forEach returns undefined, so the braces receive nothing: rendered for real, the list is empty. The same happens when you write a map with a curly-brace body and forget the return. TypeScript catches both: type void is not assignable to type ReactNode. With parentheses instead of braces, the arrow returns for you.' },
  { t: 'Every item in a list needs a key', body: two(`<div>${B('thieukey', { url: 'localhost:3000/thieukey · next dev', h: 200, w: 460 })}</div>`,
      tn(`Console (next dev, Chromium):\nEach child in a list should have a unique "key" prop.\nSee https://react.dev/link/warning-keys for more information.\nCheck the render method of \`ThieuKey\`.`, { fs: 14, wrap: 58, title: 'browser console — real' }), 'r46') +
    tsx(`{items.map((t) => <li>{t}</li>)}               // ✗ warning in dev
{items.map((item) => <li key={item.id}>{item.name}</li>)}   // ✓ a stable id from the data`, { sm: true, hl: [2] }) +
    box('A key is an identity, not a number', 'React uses it to match items between two renders. Prefer an id that comes with the data (<code>item.id</code>) over the array index.', 'lam'),
    en: 'Every element returned from map needs a key. Without one, the dev server prints a real warning in the browser console: each child in a list should have a unique key prop, check the render method of ThieuKey. A key is an identity React uses to match items between renders; take it from the data, an id, rather than the array index.' },
  { t: 'Why the index bites: delete the first row', body: two(
      `<div><div class="cap" style="font-weight:700">1 · tick "An" in both lists</div>${B('key-tich', { url: 'localhost:3000/key', h: 175, w: 540, mark: [[36, 70, 70, 22, ''], [344, 70, 70, 22, '']] })}</div>`,
      `<div><div class="cap" style="font-weight:700;color:#c0392b">2 · "Xoá dòng đầu" in both — An is gone</div>${B('key-xoa', { url: 'localhost:3000/key', h: 175, w: 540, mark: [[36, 70, 80, 22, 'tick moved to Bình!']] })}</div>`) +
    two(box('key={i}: the tick lands on the wrong row', 'After deleting row 0, Bình became index 0. React thinks item 0 is still item 0 — it keeps the old DOM node (with its tick) and only updates the text.', 'do2'),
      box('key={p.id}: correct', 'React sees that the item with key <code>an</code> is gone and removes exactly that node. Measured: <code>Bình ☐, Chi ☐</code>.', 'xanh')) +
    cmp(['key={i}', 'before', 'after deleting An', 'what React does'], [
      ['0', 'An ☑', '<b>Bình ☑</b>', 'keeps row 0 (tick and all), changes its text'],
      ['1', 'Bình', 'Chi', 'keeps row 1, changes its text'],
      ['2', 'Chi', '—', 'removes the LAST row'],
    ], { hl: [0] }),
    en: 'Why the index bites, measured in a real browser. We ticked An in both lists, then deleted the first row. With key equals index, the tick moved to Bình: Bình is now index zero, so React kept the old row, with its tick, and only changed the text. With key equals id, React removed exactly the row whose key was an. Chapter seven goes deep on this.' },
  { t: 'Conditions: && to show-or-not, the ternary to choose', to: true, body: cmp(['Pattern', 'Use when', 'Example'], [
      ['<code>cond && &lt;X /&gt;</code>', 'show X, or nothing', '<code>{isLoggedIn && &lt;p&gt;Welcome back!&lt;/p&gt;}</code>'],
      ['<code>cond && &lt;X /&gt;</code>', 'show a value only if it exists', '<code>{error && &lt;p className="err"&gt;{error}&lt;/p&gt;}</code>'],
      ['<code>cond ? &lt;A /&gt; : &lt;B /&gt;</code>', 'choose between two', '<code>{isLoggedIn ? &lt;Dashboard /&gt; : &lt;LoginForm /&gt;}</code>'],
    ]) + path([{ t: 'left side truthy', s: '&& returns the RIGHT side' }, { t: 'left side falsy', s: '&& returns the LEFT side', on: true }, { t: 'React', s: 'skips false / null — prints 0' }], { h: 130, fs: 18, nhan: ['', 'rendered'] }) +
    box('&& does not return true or false', 'It returns one of its operands. That detail is exactly where the next slide\'s bug comes from.', 'cam'),
    en: 'Conditions. To show something or nothing, use double ampersand: if the left side is truthy, the expression gives the right side, the element; if it is falsy, it gives the falsy value, which React skips. To choose between two things, use the ternary. Note that double ampersand returns one of its operands, not true or false — that is where the next bug comes from.' },
  { t: 'The 0 trap — measured in a real browser', body: two(
      `<div><div class="cap" style="font-weight:700">Before: 3 items</div>${B('gio-truoc', { url: 'localhost:3000/gio', h: 215, w: 540 })}</div>`,
      `<div><div class="cap" style="font-weight:700;color:#c0392b">After "Xoá hết": a lone 0</div>${B('gio-sau', { url: 'localhost:3000/gio', h: 210, w: 540, mark: [[34, 60, 26, 24, 'the 0']] })}</div>`) +
    two(tsx(`{items.length && <ul>…</ul>}            // ✗ 0 && … ⇒ 0
{items.length > 0 ? <ul>…</ul> : <p>Empty</p>}  // ✓`, { sm: true, hl: [1] }), tn(['$ node ds.cjs', ...DS.slice(4, 6)].join('\n'), { fs: 16, wrap: 60 })) +
    box('Fix: make the left side a real boolean', '<code>items.length &gt; 0 && …</code> or <code>items.length ? … : null</code>. The bug only shows at exactly one value — that is why it survives testing.', 'xanh'),
    en: 'The zero trap, measured. With three items both columns show the list. After clicking Xoá hết, the left column, items dot length and-and list, shows a lone zero: zero and-and anything is zero, and React prints numbers. The right column makes the left side a real boolean, greater than zero, and shows an empty-state message. React renders zero next to a span as zero x, while false renders nothing.' },
  { t: 'When it grows, compute it above return', body: tsx(`// JSX form of feed.cjs
function Feed({ posts, loading }) {
  let body;
  if (loading) body = <p>Đang tải…</p>;
  else if (posts.length === 0) body = <p>Chưa có bài nào</p>;
  else body = posts.map((p) => <article key={p.id}>{p.title}</article>);

  return <section>{body}</section>;
}`, { hl: [4, 5, 6] }) + two(tn(O('feed'), { fs: 15, wrap: 60 }),
    box('Real if statements are fine here', 'We are above <code>return</code>, in plain JavaScript — not inside JSX. Far easier to read than three nested ternaries, and the three states (loading / empty / data) are explicit. Output: the same component rendered in each state.', 'xanh')),
    en: 'When a condition or a branch grows, do not cram it into JSX: compute it above the return. Real if statements are fine there, because that is plain JavaScript. The Feed component handles loading, empty and data explicitly; rendered for real, it gives a loading paragraph, an empty-state paragraph, and two articles.' },
  { t: 'Drawing a list, correctly', body: icards([
      ['loop', '1 · map, not forEach', '<code>map</code> returns an array of elements; <code>forEach</code> returns <code>undefined</code> and draws nothing.'],
      ['code', '2 · Return the element', 'In <code>map(item => { … })</code> you need an explicit <code>return</code>; <code>map(item => (…))</code> returns for you.'],
      ['key', '3 · A stable key per item', 'From the data — an id — not the index. The key is how React matches items between renders.'],
      ['box', '4 · Handle the empty case', 'An empty array draws nothing, which looks like a bug. Show a message instead of a blank space.'],
    ], 2) + box('When a bare number appears on screen…', 'look for a <code>&&</code> with <code>.length</code> (or a count) on its left side.', 'do2'),
    en: 'Drawing a list, correctly, in four rules: map, not forEach; return the element; give each item a stable key from the data; and handle the empty case with a message. And whenever a bare number appears on screen, look for a double ampersand with length on its left.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('.map()', 'turns an array of data into an array of elements'), kw('key', 'a stable identity per item so React can track it across renders'),
      kw('Ternary', 'cond ? a : b — the expression way to choose between two results'), kw('Logical &&', 'cond && element — renders the element only when cond is truthy'),
      kw('The 0 trap', '0 && … renders 0; coerce to a boolean (count > 0 && …)'), kw('Empty state', 'the branch you render when a list has no items'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: map; key; the ternary; logical and; the zero trap; and the empty state.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Render an array with ${c('.map()')} and a stable key (not the index); watch the console warning disappear`,
      `Show one of three states with a ternary; show/hide a badge with ${c('&&')}`,
      `Break it on purpose with ${c('count && …')} when count can be 0, and see the stray 0`,
      'Combine: map a list and render a "no items" message when it is empty',
    ]), box('Keep these', `<ul><li>Lists: .map() + a stable key</li><li>Show-or-not: &&; choose: ternary</li><li>Coerce the left side of && to a boolean</li><li>Always handle the empty list</li></ul>`, 'lam'), ''),
    en: 'Your turn: map an array with a stable key and watch the warning disappear; show one of three states with a ternary and toggle a badge with and-and; break it with count and-and when count can be zero; then combine a mapped list with an empty message. Keep: map plus a stable key; and-and to show, ternary to choose; coerce the left side to a boolean; always handle the empty list.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — JSX & the render model', bai: '1.4' }, S);
