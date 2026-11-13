/**
 * nxj-01-3 — Next.js · Chapter 1 · Lesson 1.3 "Putting values into JSX: curly braces" (deck video + web, 13/11/2026).
 * Bài web: nextjs-1-3-ngoac-nhon. Output THẬT (scratchpad/nxj/demo/n1-3.txt · Next.js 16.4.6 · React 19.3.0 · Node 22.23.3, dự án ~/.rtq-nxj/lab/c1/my-app)
 * + ảnh trình duyệt THẬT (Playwright, scratchpad/nxj/spec/nxj-1-3.json ⇒ _nxj-anh/nxj-01-3/*.webp):
 *  - Card {user.name} {user.age * 2} {toUpperCase()} {getFullYear()} {ternary} ⇒ Bình · 40 tuổi chó · BÌNH · Tham gia 2024 · Người lớn.
 *  - {if (…) …} ⇒ tsc TS1109 "Expression expected." · next build "Expected '</', got 'if'" · next dev: lớp phủ Build Error.
 *  - renderToStaticMarkup: chuỗi/số in ra; '' null undefined true false ⇒ rỗng; 0 và NaN in ra (NaN kèm cảnh báo dev); mảng nối; object ⇒ lỗi.
 *  - title="{x}" ⇒ title="{x}" (5 ký tự); title={'Hi'} = title="Hi"; style={{ marginTop: 8 }} ⇒ style="margin-top:8px" (tự thêm px);
 *    style dạng chuỗi ⇒ lỗi "The `style` prop expects a mapping…"; .tsx: onClick="…" ⇒ TS2322, style="…" ⇒ TS2559.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-3:file:src/app/loi/page.tsx": "const user = { name: 'Bình', age: 20 };\n\nexport default function Loi() {\n  return (\n    <div>\n      {if (user.age >= 18) { 'Người lớn' }}\n    </div>\n  );\n}\n",
 "n1-3:lenh": "$ npx tsc --noEmit\nsrc/app/loi/page.tsx(6,8): error TS1109: Expression expected.\nsrc/app/loi/page.tsx(6,21): error TS1382: Unexpected token. Did you mean `{'>'}` or `&gt;`?\nsrc/app/loi/page.tsx(6,43): error TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?\n$ npm run build 2>&1 | grep -A12 'Build error'\n> Build error occurred\nError: Turbopack build failed with 1 error:\n./src/app/loi/page.tsx:6:8\nError: Expected '</', got 'if'\n  4 |   return (\n  5 |     <div>\n> 6 |       {if (user.age >= 18) { 'Người lớn' }}\n    |        ^^\n  7 |     </div>\n  8 |   );\n  9 | }\n\nParsing ecmascript source code failed",
 "n1-3:file:hien.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst thu = [[\"'Bình'\", 'Bình'], ['42', 42], ['0', 0], ['NaN', NaN], [\"''\", ''], ['null', null],\n  ['undefined', undefined], ['true', true], ['false', false], [\"['a', null, 'b']\", ['a', null, 'b']]];\nfor (const [nhan, v] of thu) {\n  console.log(`{${nhan}}`.padEnd(19) + '→ ' + renderToStaticMarkup(React.createElement('p', null, v)));\n}\ntry { renderToStaticMarkup(React.createElement('p', null, { a: 1 })); }\ncatch (e) { console.log('{{ a: 1 }}'.padEnd(19) + '→ ' + e.message.split('.')[0]); }\n",
 "n1-3:gia-tri": "$ node hien.cjs\n{'Bình'}           → <p>Bình</p>\n{42}               → <p>42</p>\n{0}                → <p>0</p>\n{NaN}              → <p>NaN</p>\n{''}               → <p></p>\n{null}             → <p></p>\n{undefined}        → <p></p>\n{true}             → <p></p>\n{false}            → <p></p>\n{['a', null, 'b']} → <p>ab</p>\n{{ a: 1 }}         → Objects are not valid as a React child (found: object with keys {a})\nReceived NaN for the `children` attribute. If this is expected, cast the value to a string.",
 "n1-3:file:style.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst el = (props) => renderToStaticMarkup(React.createElement('button', props, 'Save'));\nconsole.log(el({ className: 'btn', style: { marginTop: 8, fontSize: 16, color: 'red' } }));\ntry { el({ style: 'margin-top: 8px' }); } catch (e) { console.log(e.message.split('. For')[0]); }\n",
 "n1-3:style": "$ node style.cjs\n<button class=\"btn\" style=\"margin-top:8px;font-size:16px;color:red\">Save</button>\nThe `style` prop expects a mapping from style properties to values, not a string",
 "n1-3:file:src/app/sai/page.tsx": "export default function Sai() {\n  return (\n    <button onClick=\"handleSave()\" style=\"margin-top: 8px\">\n      Save\n    </button>\n  );\n}\n",
 "n1-3:sai": "$ npx tsc --noEmit\nsrc/app/sai/page.tsx(3,13): error TS2322: Type 'string' is not assignable to type 'MouseEventHandler<HTMLButtonElement>'.\nsrc/app/sai/page.tsx(3,36): error TS2559: Type 'string' has no properties in common with type 'Properties<string | number, string & {}>'.",
 "n1-3:file:src/app/the/page.tsx": "const user = { name: 'Bình', age: 20, joinedAt: '2024-09-05' };\n\nfunction Card({ user }: { user: { name: string; age: number; joinedAt: string } }) {\n  return (\n    <div className=\"m-6 w-96 rounded-xl border p-6 font-sans text-lg\">\n      <h2 className=\"text-2xl font-bold\">{user.name}</h2>\n      <p>{user.age * 2} tuổi chó</p>\n      <p>{user.name.toUpperCase()}</p>\n      <p>Tham gia {new Date(user.joinedAt).getFullYear()}</p>\n      <p>{user.age >= 18 ? 'Người lớn' : 'Trẻ em'}</p>\n    </div>\n  );\n}\n\nexport default function Page() {\n  return <Card user={user} />;\n}\n",
 "n1-3:file:src/app/hien/page.tsx": "import type { ReactNode } from 'react';\n\nconst THU: [string, ReactNode][] = [[\"'Bình'\", 'Bình'], ['42', 42], ['0', 0], ['NaN', NaN], [\"''\", ''], ['null', null],\n  ['undefined', undefined], ['true', true], ['false', false], [\"['a', null, 'b']\", ['a', null, 'b']]];\n\nexport default function Hien() {\n  return (\n    <table className=\"m-6 font-mono text-lg\">\n      <tbody>\n        {THU.map(([nhan, v]) => (\n          <tr key={nhan} className=\"border-b border-gray-300\">\n            <td className=\"py-1 pr-8 text-gray-600\">{'{' + nhan + '}'}</td>\n            <td className=\"min-w-32 bg-yellow-100 px-3 py-1\">{v}</td>\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}\n",
 "n1-3:file:src/app/thuoc/page.tsx": "'use client';\nconst x = 'Hi';\n\nexport default function Thuoc() {\n  const handleSave = () => alert('Đã lưu');\n  return (\n    <div className=\"space-y-2 p-8 font-mono text-lg\">\n      <p id=\"a\" title=\"Hi\">title=\"Hi\"</p>\n      <p id=\"b\" title={'Hi'}>title={\"{'Hi'}\"}</p>\n      <p id=\"c\" title=\"{x}\">title=\"{'{x}'}\"</p>\n      <p id=\"d\" title={x}>title={'{x}'}</p>\n      <button className=\"btn rounded border px-3\" onClick={handleSave} style={{ marginTop: 8 }}>\n        Save\n      </button>\n    </div>\n  );\n}\n",
 "n1-3:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -A12 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /dem\n├ ○ /hien\n├ ○ /tay\n├ ○ /the\n└ ○ /thuoc\n\n\n○  (Static)  prerendered as static content\n$ curl -s localhost:3000/thuoc | grep -oE '<(p id|button)[^>]*>'\n<p id=\"a\" title=\"Hi\">\n<p id=\"b\" title=\"Hi\">\n<p id=\"c\" title=\"{x}\">\n<p id=\"d\" title=\"Hi\">\n<button class=\"btn rounded border px-3\" style=\"margin-top:8px\">",
 "n1-3:dev": "$ curl -s -o /dev/null -w 'GET /loi → %{http_code}\\n' localhost:19314/loi\nGET /loi → 500",
 "n1-3:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, cmp, box, two, steps, kw, c, path, icards, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-01-3', code: 'NXJ 1.3', title: 'Putting values into JSX: curly braces', sub: 'Chapter 1 · Lesson 1.3' };
const O = (k) => { const v = DU_LIEU[`n1-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
/** Đoạn thứ i (0-based) của transcript: mỗi đoạn bắt đầu bằng một dòng "$ …". */
const D = (k, i) => { const ds = []; for (const l of O(k).split('\n')) { if (l.startsWith('$ ')) ds.push([l]); else if (ds.length) ds.at(-1).push(l); } return ds[i].join('\n'); };
const B = (ten, o) => br('nxj-01-3', ten, { vp: 640, ...o });

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.3', t: 'Putting values into JSX:<br>curly braces', sub: 'One escape hatch back into JavaScript — and the one strict rule that comes with it',
    en: 'Lesson one point three: putting values into JSX with curly braces. They are the one escape hatch from markup back into JavaScript, and they come with one strict rule.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Curly braces: a window back into JavaScript</li>
    <li>Expressions fit — statements never do (and the real error you get)</li>
    <li>What React prints and what it silently skips — measured</li>
    <li>Attributes are props: camelCase, functions, objects</li>
    <li>Quotes vs braces, and the double braces of <code>style</code></li>
    <li>Four places braces appear — one rule for all of them</li></ul>`,
    en: 'Six takeaways: curly braces as a window into JavaScript; expressions fit but statements never do; what React prints and what it skips, measured; attributes are props with camelCase names; quotes versus braces and the double braces of style; and the four places braces appear, all with one rule.' },
  { t: 'Curly braces: a window back into JavaScript', body:
    path([{ t: '<h2>{user.name}</h2>', s: 'JSX markup' }, { t: 'evaluate', s: 'a JavaScript expression', on: true }, { t: '"Bình"', s: 'the value is inserted' }], { h: 130, nhan: ['open {', 'result'] }) +
    tsx(O('file:src/app/the/page.tsx').split('\n').slice(5, 10).map((l) => l.trim()).join('\n')) +
    two(`<div>${B('the', { url: 'localhost:3000/the', h: 225, w: 540, mark: [[44, 46, 150, 34, ''], [44, 86, 150, 112, '']] })}</div>`,
      box('Five braces, five expressions, five values', 'A variable, math, a method call, a <code>Date</code> call and a ternary — each one produces a value, and that value is what lands on the page.', 'xanh')),
    en: 'Inside JSX, whatever sits between curly braces is evaluated as a JavaScript expression and the result is inserted. We rendered this card for real: a variable gives Bình; age times two gives forty; a method call gives the name in capitals; a Date call gives twenty twenty-four; and a ternary gives Người lớn. Every one of them is an expression that produces a value.' },
  { t: 'Expressions fit — statements never do', body: two(cmp(['Inside { }', 'Result'], [
      ['<code>user.name</code>', '✓ a variable is a value'],
      ['<code>user.age * 2</code>', '✓ math produces a value'],
      ['<code>ok ? \'A\' : \'B\'</code>', '✓ a ternary is an expression'],
      ['<code>if</code> · <code>for</code> · <code>const</code>', '✗ statements — no value'],
      ['need logic?', 'ternary · <code>&&</code> · <code>.map()</code> · or compute above <code>return</code>'],
    ], { hl: [3] }),
      tsx(O('file:src/app/loi/page.tsx').trim(), { sm: true, hl: [6] }) + tn(D('lenh', 0), { fs: 13, wrap: 64 })),
    en: 'Variables, math, method calls and ternaries all fit, because each produces a value. Statements do not: if, for and const produce no value, so the braces cannot hold them. We tried it: TypeScript stops at the if with TS eleven-oh-nine, expression expected. For conditions use a ternary or double ampersand, for loops use map, and for anything bigger compute the value above the return.' },
  { t: 'What the statement really costs you: the build fails', body: two(`<div>${br('nxj-01-3', 'loi', { vp: 960, url: 'localhost:3000/loi · next dev', h: 420, w: 660 })}</div>`,
      tn(D('lenh', 1).split('\n').slice(0, 13).join('\n'), { fs: 12, wrap: 50 }), 'r64') +
    box('Not a runtime surprise — the page never compiles', 'In <code>next dev</code> the whole page is replaced by a <b>Build Error</b> overlay; <code>next build</code> stops with <b>Expected \'&lt;/\', got \'if\'</b>. The parser expected the closing tag because <code>{</code> can only hold a value.', 'do2'),
    en: 'What a statement really costs: the page does not even compile. In the dev server the whole screen becomes a Build Error overlay, expected closing tag, got if, pointing at the exact line. The production build stops with the same message. The parser was waiting for a value, found the keyword if, and gave up.' },
  { t: 'What React prints, and what it silently skips', body: two(`<div>${B('hien', { url: 'localhost:3000/hien', h: 400, w: 470, mark: [[402, 98, 214, 74, ''], [402, 172, 214, 185, '']] })}</div>`,
      tn(O('gia-tri'), { fs: 13, wrap: 70 }), 'r46') +
    box('Strings and numbers print. null, undefined, true, false render nothing — on purpose.', 'That is what makes conditional rendering work. But <code>0</code> and <code>NaN</code> are numbers, so they DO print (NaN with a dev warning); an array is joined; a plain object throws <b>Objects are not valid as a React child</b>.', 'cam'),
    en: 'What React prints and what it skips, measured twice: in a real browser and with react-dom server. Strings and numbers print. Empty string, null, undefined, true and false render nothing at all — on purpose, because conditional rendering depends on it. But zero and NaN are numbers, so they print; NaN even triggers a dev warning. An array is joined, and a plain object throws: objects are not valid as a React child.' },
  { t: 'Attributes are props — named the JavaScript way', body: cmp(['HTML', 'JSX', 'Why'], [
      ['<code>class="btn"</code>', '<code>className="btn"</code>', '<code>class</code> is a reserved word in JavaScript'],
      ['<code>for="email"</code>', '<code>htmlFor="email"</code>', '<code>for</code> is a keyword too'],
      ['<code>onclick="save()"</code>', '<code>onClick={handleSave}</code>', 'camelCase, and it takes a FUNCTION, not a string'],
      ['<code>style="margin-top: 8px"</code>', '<code>style={{ marginTop: 8 }}</code>', 'an object with camelCase keys, not a CSS string'],
    ]) + tsx(`<button className="btn" onClick={handleSave} style={{ marginTop: 8 }}>
  Save
</button>`, { sm: true }) + box('Attributes are not HTML — they are the props object passed to createElement', 'So they follow JavaScript naming (lesson 1.2): <code>className</code>, <code>htmlFor</code>, <code>onClick</code>, <code>tabIndex</code>…', 'lam'),
    en: 'Attributes look like HTML but are props passed to createElement, so they follow JavaScript naming. Class becomes className and for becomes htmlFor, because both are keywords. Event handlers are camelCase and take a function, not a string: onClick equals handleSave. And style is an object with camelCase keys, not a CSS string.' },
  { t: 'Quotes pass text, braces pass a value', body: two(`<div>${B('thuoc', { url: 'localhost:3000/thuoc', h: 230, w: 500, mark: [[32, 104, 160, 28, ''], [32, 140, 140, 28, '']] })}</div>`,
      tn(O('trang').split('\n').slice(-6).join('\n'), { fs: 14, wrap: 64 }), 'r46') +
    tsx(O('file:src/app/thuoc/page.tsx').split('\n').slice(7, 11).join('\n'), { sm: true, hl: [3] }) +
    box('No quotes around braces', '<code>title={\'Hi\'}</code> and <code>title="Hi"</code> are the same. <code>title="{x}"</code> is a plain string — the server HTML really contains <code>title="{x}"</code>, the three characters, not the value of <code>x</code>.', 'do2'),
    en: 'Quotes pass text; braces pass a value. We fetched the real HTML of this page: title equals Hi with quotes, and title equals the string Hi in braces, give the same attribute. Title equals x with braces gives Hi, the value. But x inside quotes passes three characters: open brace, x, close brace. Never put quotes around braces.' },
  { t: 'style={{ … }}: two pairs, two jobs', body: two(
      `<svg viewBox="0 0 520 210" width="520" height="210" font-family="Consolas,monospace"><rect x="0" y="0" width="520" height="210" rx="14" fill="#1e1e1e"/>` +
      `<text x="30" y="100" font-size="34" fill="#9cdcfe">style=<tspan fill="#ffd700" font-weight="bold">{</tspan><tspan fill="#da70d6" font-weight="bold">{</tspan><tspan fill="#9cdcfe"> marginTop</tspan><tspan fill="#d4d4d4">: </tspan><tspan fill="#b5cea8">8</tspan><tspan fill="#da70d6" font-weight="bold"> }</tspan><tspan fill="#ffd700" font-weight="bold">}</tspan></text>` +
      `<text x="132" y="150" font-size="20" fill="#ffd700" font-family="Arial" font-weight="700">↑ outer: "enter JavaScript"</text><text x="160" y="182" font-size="20" fill="#da70d6" font-family="Arial" font-weight="700">↑ inner: an object literal</text>` +
      `<text x="30" y="46" font-size="18" fill="#8b949e" font-family="Arial">not special syntax — data={{ id: 1 }} works the same</text></svg>`,
      tn(O('style'), { fs: 14, wrap: 60 }) + tn(O('sai'), { fs: 12, wrap: 64 })) +
    box('Measured: numbers get "px", strings are refused', 'React wrote <code>margin-top:8px;font-size:16px</code> from <code>{ marginTop: 8, fontSize: 16 }</code>. A CSS string throws <b>The `style` prop expects a mapping…</b> at runtime; in .tsx TypeScript stops it first (TS2559, and TS2322 for <code>onClick="…"</code>).', 'cam'),
    en: 'The double braces confuse everyone once. The outer pair means enter JavaScript; the inner pair is an object literal. It is not special syntax. Measured: React turned marginTop eight into margin-top eight pixels, adding the unit for you. A CSS string throws at runtime, the style prop expects a mapping, and in a TSX file TypeScript refuses it first, along with onClick given a string.' },
  { t: 'Four places, one rule: a JavaScript expression', body: icards([
      ['type', '1 · In text: <code>{value}</code>', 'Strings and numbers print; <code>null</code>, <code>undefined</code>, <code>false</code>, <code>true</code> draw nothing — which is why conditional rendering works.'],
      ['code', '2 · In an attribute: <code>prop={expr}</code>', 'No quotes around the braces. <code>title={\'Hi\'}</code> = <code>title="Hi"</code>; <code>title="{x}"</code> passes the three characters.'],
      ['layers', '3 · Double braces: <code>style={{…}}</code>', 'Outer = expression slot, inner = object literal. Same for <code>data={{ id: 1 }}</code>.'],
      ['warn', '4 · Expressions only, never statements', '<code>{if (x) …}</code> is a syntax error. Use a ternary, <code>&&</code>, or compute a variable above <code>return</code>.'],
    ], 2) + box('Trap preview (lesson 1.4 measures it): <code>{count && &lt;Badge /&gt;}</code> prints a lone 0', '<code>&&</code> returns the left side when it is falsy, and React prints the number 0. Guard with <code>count &gt; 0 &&</code> or a ternary with <code>null</code>.', 'do2'),
    en: 'Four places, one rule. In text, the value is drawn, and null, undefined and booleans draw nothing. In an attribute, no quotes around the braces. Double braces are just an expression slot holding an object. And only expressions, never statements. One trap, measured in the next lesson: count and-and Badge prints a lone zero when count is zero.' },
  { t: 'How cuongthai.com does it: className first, style for truly dynamic values', to: true, body: two(
      tsx(`// almost everything: Tailwind utility classes
<div className="flex items-center gap-2">
  <Avatar user={user} />
  <span className="font-semibold">{user.name}</span>
</div>`, { sm: true }),
      tsx(`// style only for values known at run time
<div style={{ aspectRatio: \`\${w} / \${h}\` }}>
  <video src={url} />
</div>
<div style={{ width: \`\${percent}%\` }} />`, { sm: true })) +
    two(box('className', 'Static look ⇒ Tailwind classes: cacheable, consistent, themeable. Chapter 13 is all about this choice.', 'xanh'),
      box('style={{…}}', 'A computed width, an aspect ratio measured from a video, a CSS variable set at run time — values that cannot be a class.', 'lam')),
    en: 'How cuongthai.com does it: almost everything is styled with Tailwind utility classes inside className. The style object is kept for the few values that are truly dynamic and cannot become a class: a computed width, an aspect ratio measured from a video, a CSS variable set at run time. Chapter thirteen is devoted to this choice.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Curly braces { }', 'the escape hatch to put a JavaScript expression into JSX'), kw('Expression vs statement', 'braces take expressions (values), not statements (if, for)'),
      kw('Interpolation', 'dropping a computed value into markup'), kw('Attribute value', 'attr={expr} passes a real value; quotes pass a literal string'),
      kw('Falsy rendering', 'false, null, undefined render nothing; 0 and "" can surprise'), kw('Child expression', 'text and {expr} between tags become the element\'s children'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: curly braces; expression versus statement; interpolation; attribute value; falsy rendering; and child expressions.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Render a variable, a math expression and a function call in JSX with { }; confirm each prints its value',
      `Put a statement (${c('if')}, ${c('for')}) inside braces and read the error — then rewrite it as a ternary or ${c('.map()')}`,
      `Pass values with braces (${c('src={url}')}) and compare with a quoted string`,
      'Render 0, null and false in a <code>&lt;p&gt;</code> and predict what you will see first',
    ]), box('Keep these', `<ul><li>{ } embeds any JavaScript expression</li><li>Expressions only — no if / for inside</li><li>attr={expr} = value · attr="x" = literal text</li><li>Falsy values vanish — except 0 (and NaN)</li></ul>`, 'lam'), ''),
    en: 'Your turn: render a variable, math and a function call with braces; put an if inside braces, read the error, and rewrite it as a ternary or map; pass values with braces and compare with quotes; and predict what zero, null and false render before you try. Keep: braces embed any expression; no statements inside; braces pass values, quotes pass text; falsy values vanish except zero.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — JSX & the render model', bai: '1.3' }, S);
