/**
 * nxj-01-5 — Next.js · Chapter 1 · Lesson 1.5 "The rules of JSX & the mental model" (deck video + web, 13/11/2026).
 * Bài web: nextjs-1-5-luat-jsx. Output THẬT (scratchpad/nxj/demo/n1-5.txt · Next.js 16.4.6 · React 19.3.0 · Node 22.23.3, ~/.rtq-nxj/lab/c1/my-app)
 * + ảnh trình duyệt THẬT (Playwright, scratchpad/nxj/spec/nxj-1-5.json ⇒ _nxj-anh/nxj-01-5/*.webp):
 *  - Hai anh em không bọc ⇒ tsc TS2657 "JSX expressions must have one parent element."; next build (SWC) "Unterminated regexp literal" ở </p>.
 *  - <br> <img …> không đóng ⇒ tsc TS17008 "JSX element 'br' has no corresponding closing tag." (+ TS17002 …).
 *  - div ⇒ <div><h1>Title</h1><p>Body</p></div>; Fragment ⇒ <h1>Title</h1><p>Body</p>.
 *  - Xuống dòng giữa <b>Xin</b> / <i>chào</i> ⇒ HTML <b>Xin</b><i>chào</i> ("Xinchào"); có {' '} ⇒ <b>Xin</b> <i>chào</i>.
 *  - <userCard name="An" /> ⇒ tsc TS2339 "Property 'userCard' does not exist on type 'JSX.IntrinsicElements'"; next dev (terminal) cảnh báo
 *    "<userCard /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements."; trình duyệt: <usercard name="An"></usercard> 0×0.
 *    (web cũ: "không lỗi, không cảnh báo" — SAI với React 19 dev + .tsx; đã sửa.)
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-5:file:src/app/anhem/page.tsx": "export default function AnhEm() {\n  return (\n    <h1>Title</h1>\n    <p>Body</p>\n  );\n}\n",
 "n1-5:anhem": "$ npx tsc --noEmit\nsrc/app/anhem/page.tsx(3,5): error TS2657: JSX expressions must have one parent element.\n$ npm run build 2>&1 | grep -A12 'Build error'\n> Build error occurred\nError: Turbopack build failed with 1 error:\n./src/app/anhem/page.tsx:4:13\nError: Unterminated regexp literal\n  2 |   return (\n  3 |     <h1>Title</h1>\n> 4 |     <p>Body</p>\n    |             ^^^\n  5 |   );\n  6 | }\n  7 |\n\nParsing ecmascript source code failed",
 "n1-5:file:src/app/dong/page.tsx": "export default function Dong() {\n  return (\n    <div>\n      Dòng một<br>\n      <img src=\"/next.svg\" alt=\"logo\">\n    </div>\n  );\n}\n",
 "n1-5:dong": "$ npx tsc --noEmit\nsrc/app/dong/page.tsx(3,6): error TS17008: JSX element 'div' has no corresponding closing tag.\nsrc/app/dong/page.tsx(4,16): error TS17008: JSX element 'br' has no corresponding closing tag.\nsrc/app/dong/page.tsx(6,7): error TS17002: Expected corresponding JSX closing tag for 'img'.\nsrc/app/dong/page.tsx(8,1): error TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?\nsrc/app/dong/page.tsx(9,1): error TS1005: '</' expected.",
 "n1-5:file:frag.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nconst con = [h('h1', { key: 1 }, 'Title'), h('p', { key: 2 }, 'Body')];\nconsole.log('<div>      ' + renderToStaticMarkup(h('div', null, con)));\nconsole.log('<>…</>     ' + renderToStaticMarkup(h(React.Fragment, null, con)));\n",
 "n1-5:frag": "$ node frag.cjs\n<div>      <div><h1>Title</h1><p>Body</p></div>\n<>…</>     <h1>Title</h1><p>Body</p>",
 "n1-5:file:src/app/khoang/page.tsx": "export default function Khoang() {\n  return (\n    <div className=\"space-y-3 p-6 font-sans text-2xl\">\n      <p id=\"mot\">\n        <b>Xin</b>\n        <i>chào</i>\n      </p>\n      <p id=\"hai\">\n        <b>Xin</b>{' '}\n        <i>chào</i>\n      </p>\n    </div>\n  );\n}\n",
 "n1-5:file:src/app/bien/page.tsx": "import type { ReactNode } from 'react';\n\nfunction Header({ title, action }: { title: string; action: ReactNode }) {\n  return (\n    <header className=\"flex items-center justify-between border-b p-4 font-sans\">\n      <h1 className=\"text-2xl font-bold\">{title}</h1>\n      {action}\n    </header>\n  );\n}\n\nconst badge = <span className=\"rounded bg-blue-600 px-2 text-white\">New</span>;\nconst data = [{ id: 1, ten: 'Bài một' }, { id: 2, ten: 'Bài hai' }];\n\nexport default function Bien() {\n  const rows = data.map((d) => <li key={d.id}>{d.ten}</li>);\n  return (\n    <>\n      <Header title=\"Feed\" action={badge} />\n      <ul className=\"list-disc p-4 pl-10 font-sans\">{rows}</ul>\n    </>\n  );\n}\n",
 "n1-5:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -A16 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /bien\n├ ○ /dem\n├ ○ /gio\n├ ○ /hien\n├ ○ /key\n├ ○ /khoang\n├ ○ /tay\n├ ○ /the\n└ ○ /thuoc\n\n\n○  (Static)  prerendered as static content\n$ curl -s localhost:3000/khoang | grep -oE '<p id=\"(mot|hai)\">.*?</p>'\n<p id=\"mot\"><b>Xin</b><i>chào</i></p>\n<p id=\"hai\"><b>Xin</b> <i>chào</i></p>",
 "n1-5:file:src/app/thuong/page.tsx": "'use client';\nfunction userCard({ name }: { name: string }) {\n  return <p className=\"rounded border p-3\">Thẻ của {name}</p>;\n}\n\nexport default function Thuong() {\n  return (\n    <div className=\"p-6 font-sans\">\n      <h2 className=\"text-xl font-bold\">Danh sách</h2>\n      <userCard name=\"An\" />\n    </div>\n  );\n}\n",
 "n1-5:thuong": "$ npx tsc --noEmit\nsrc/app/thuong/page.tsx(10,7): error TS2339: Property 'userCard' does not exist on type 'JSX.IntrinsicElements'.\n$ npm run dev -- -p 19318\n$ curl -s -o /dev/null -w 'GET /thuong → %{http_code}\\n' localhost:19318/thuong\nGET /thuong → 200",
 "n1-5:log": "▲ Next.js 16.4.6 (Turbopack)\n- Local:         http://127.0.0.1:19318\n- Network:       http://127.0.0.1:19318\n✓ Ready in 558ms\n\n✓ Running next.config.ts took 33ms\n\n<userCard /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.\n GET /thuong 200 in 245ms (next.js: 141ms, application-code: 104ms)",
 "n1-5:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, cmp, box, two, steps, kw, c, path, hub, cay } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-01-5', code: 'NXJ 1.5', title: 'The rules of JSX & the mental model', sub: 'Chapter 1 · Lesson 1.5' };
const O = (k) => { const v = DU_LIEU[`n1-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (k, i) => { const ds = []; for (const l of O(k).split('\n')) { if (l.startsWith('$ ')) ds.push([l]); else if (ds.length) ds.at(-1).push(l); } return ds[i].join('\n'); };
const B = (ten, o) => br('nxj-01-5', ten, { vp: 640, ...o });
const LOG = O('log').split('\n').find((l) => l.includes('incorrect casing'));

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.5', t: 'The rules of JSX<br>& the mental model', sub: 'Every JSX rule is really a JavaScript rule — remember what it compiles to and the rules explain themselves',
    en: 'Lesson one point five: the rules of JSX and the mental model. Every JSX rule is really a JavaScript rule. Remember what JSX compiles to, and each rule explains itself.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why a component returns exactly one root — and Fragment <code>&lt;&gt;…&lt;/&gt;</code></li>
    <li>Close every tag — <code>&lt;br /&gt;</code>, <code>&lt;img /&gt;</code>, <code>&lt;input /&gt;</code></li>
    <li>Props are camelCase; whitespace between lines disappears</li>
    <li>JSX is a value: store it, pass it, return it</li>
    <li>The lowercase-component trap — what React 19 really says</li>
    <li>The mental model you carry into Chapter 2</li></ul>`,
    en: 'Six takeaways: one root per component and the Fragment; close every tag; camelCase props and disappearing whitespace; JSX as a value; the lowercase-component trap on React nineteen; and the mental model for chapter two.' },
  { t: 'Every JSX rule is a JavaScript rule', body: hub('JSX\n= JavaScript', [
      ['box', 'One root per return', 'a function returns ONE value'],
      ['code', 'Close every tag', 'each tag is a call that must end'],
      ['type', 'camelCase props', 'they are object keys'],
      ['layers', 'JSX is a value', 'store it, pass it, return it'],
      ['eye', 'Capital = component', 'a variable vs a string'],
      ['cut', 'Line-break spaces', 'dropped by the compiler'],
    ], { h: 360 }) + box('Remember the compiled form and you never need to memorise the rules', '<code>&lt;Card title="Hi" /&gt;</code> → <code>jsx(Card, { title: "Hi" })</code> — a function call that returns an object (lessons 1.2 – 1.3).', 'lam'),
    en: 'Every JSX rule is a JavaScript rule. One root, because a function returns one value. Close every tag, because each tag is a call that must end. CamelCase props, because they are object keys. JSX is a value, so you store it and pass it. A capital letter means a variable instead of a string. And whitespace between lines is dropped by the compiler.' },
  { t: 'Rule 1 · A component returns exactly one root', body: two(tsx(O('file:src/app/anhem/page.tsx').trim(), { hl: [3, 4] }) +
      box('Why?', '<code>return</code> gives back ONE value; <code>createElement</code> builds ONE element. Two siblings would be two values.', 'cam'),
      tn(O('anhem').split('\n').slice(0, 7).join('\n'), { fs: 13, wrap: 60 }) +
      box('Two tools, two messages', 'TypeScript says it plainly (<b>TS2657</b>). SWC in <code>next build</code> reads the slash of <code>&lt;/p&gt;</code> as a regex: <b>Unterminated regexp literal</b>. Odd message, same cause.', 'do2')),
    en: 'Rule one: a component returns exactly one root. A function returns one value, and createElement builds one element, so two siblings without a wrapper cannot compile. Measured: TypeScript says TS twenty-six fifty-seven, JSX expressions must have one parent element. Next build reports something odd, unterminated regexp literal at the closing p — the parser read the slash as a regular expression. Odd message, same cause.' },
  { t: 'Wrap them: a &lt;div&gt;, or a Fragment &lt;&gt;…&lt;/&gt;', body: two(
      `<div>${tsx(`return (
  <div>
    <h1>Title</h1>
    <p>Body</p>
  </div>
);`, { sm: true })}${cay({ t: '<div>', s: 'one more DOM node' }, [{ t: '<h1>' }, { t: '<p>' }], { w: 520, h: 180 })}</div>`,
      `<div>${tsx(`return (
  <>
    <h1>Title</h1>
    <p>Body</p>
  </>
);`, { sm: true })}${cay({ t: '<> Fragment', s: 'groups — renders NOTHING', mau: '#1f8a3b' }, [{ t: '<h1>', mau: '#1f8a3b' }, { t: '<p>', mau: '#1f8a3b' }], { w: 520, h: 180 })}</div>`) +
    tn(O('frag'), { fs: 15, wrap: 80 }),
    en: 'Fix it by wrapping. A div adds a real DOM node; a Fragment, the empty tag, groups the children without rendering any wrapper. Measured with react-dom server: the div version gives div h1 p close div; the Fragment version gives just h1 and p. The Fragment exists purely to satisfy return one thing without extra divs that break layouts.' },
  { t: 'Rule 2 · Close every tag', body: two(tsx(O('file:src/app/dong/page.tsx').trim(), { hl: [4, 5] }),
      tn(O('dong'), { fs: 13, wrap: 64 }), 'r46') +
    two(box('HTML forgives, JSX does not', 'HTML accepts <code>&lt;br&gt;</code> and <code>&lt;img src="…"&gt;</code> with no closing. In JSX each tag is a function call that must end somewhere.', 'do2'),
      box('Self-close empty tags', '<code>&lt;br /&gt;</code> · <code>&lt;img src="…" alt="…" /&gt;</code> · <code>&lt;input /&gt;</code> — XML-strict. One unclosed tag cascades into five errors.', 'xanh')),
    en: 'Rule two: close every tag. HTML forgives a br or an img with no closing; JSX does not, because each tag is a function call that must end somewhere. Measured: TypeScript reports TS seventeen-oh-oh-eight, JSX element br has no corresponding closing tag, and one unclosed tag cascades into five errors. Self-close empty tags: br slash, img slash, input slash.' },
  { t: 'Rule 3 · Props are camelCase (with two renames)', body: cmp(['HTML', 'JSX', 'Why'], [
      ['<code>class</code>', '<code>className</code>', 'reserved word in JavaScript'],
      ['<code>for</code>', '<code>htmlFor</code>', 'keyword in JavaScript'],
      ['<code>onclick</code>', '<code>onClick</code>', 'camelCase + a function, not a string'],
      ['<code>tabindex</code> · <code>readonly</code>', '<code>tabIndex</code> · <code>readOnly</code>', 'camelCase like any JS identifier'],
      ['<code>style="…"</code>', '<code>style={{ … }}</code>', 'an object with camelCase keys'],
    ]) + box('Same reason as lesson 1.3', 'The compiler passes attributes straight through as keys of the props object — so they follow JavaScript naming, not HTML naming. Tip: transform.tools converts pasted HTML to valid JSX.', 'lam'), to: true,
    en: 'Rule three, from lesson one point three: className not class, htmlFor not for, onClick not onclick, tabIndex, readOnly, and style as an object. The compiler passes attributes straight through as keys of the props object, so they follow JavaScript naming.' },
  { t: 'Rule 4 · Whitespace between lines disappears', body: two(tsx(O('file:src/app/khoang/page.tsx').split('\n').slice(3, 11).map((l) => l.slice(4)).join('\n'), { hl: [2, 3, 6] }),
      `<div>${B('khoang', { url: 'localhost:3000/khoang', h: 120, w: 500, mark: [[24, 24, 100, 32, ''], [24, 68, 110, 32, '']] })}</div>`) +
    tn(O('trang').split('\n').slice(-3).join('\n'), { fs: 16, wrap: 80 }) +
    box('A line break + indentation between tags = nothing', 'The server HTML has <code>&lt;b&gt;Xin&lt;/b&gt;&lt;i&gt;chào&lt;/i&gt;</code> — "Xinchào". Need a space? Write <code>{\' \'}</code> explicitly.', 'cam'),
    en: 'Rule four: whitespace between lines disappears. Two tags on separate lines, Xin and chào, render glued together: the real server HTML has b Xin close b directly followed by i chào. To keep a space, write an explicit space string in braces.' },
  { t: 'JSX is a value — store it, pass it, return it', body: tsx(O('file:src/app/bien/page.tsx').split('\n').slice(10, 22).join('\n'), { sm: true, hl: [1, 5, 8] }) +
    two(`<div>${B('bien', { url: 'localhost:3000/bien', h: 150, w: 520, mark: [[570, 16, 58, 32, 'badge']] })}</div>`,
    box('JSX is not a template language bolted onto JavaScript. It IS JavaScript.', 'An element is an object, so it goes in a variable (<code>badge</code>), an array (<code>rows</code>), or a prop (<code>action={badge}</code>). Variables, functions, arrays, conditions — all available, because you never left the language.', 'xanh')),
    en: 'JSX is a value. Because an element is just an object, you store it in a variable, put it in an array, return it, or pass it as a prop. Here the badge lives in a variable and is passed as the action prop; the rows are an array made by map. This is the deepest idea of the chapter: JSX is not a template language bolted onto JavaScript, it is JavaScript.' },
  { t: 'Trap: the lowercase component', body: two(
      tsx(O('file:src/app/thuong/page.tsx').split('\n').slice(1, 12).join('\n'), { sm: true, hl: [1, 9] }),
      `<div>${tn(O('thuong').split('\n').slice(0, 2).join('\n'), { fs: 12, wrap: 50 })}${tn(`$ npm run dev   # dev-server terminal\n${LOG}`, { fs: 12, wrap: 50 })}${B('thuong', { url: 'localhost:3000/thuong · next dev', h: 90, w: 430, mark: [[24, 52, 200, 10, '<usercard> · 0×0']] })}</div>`, 'r64') +
      box('Not silent on React 19 — but easy to miss', '<code>&lt;userCard /&gt;</code> → <code>createElement(\'userCard\')</code>, a string: your function never runs, the browser gets an empty <code>&lt;usercard&gt;</code>. .tsx refuses it (TS2339); .jsx only prints a dev-terminal warning. Check the capital letter first.', 'do2'),
    en: 'The trap: a lowercase component. userCard compiles to createElement with the string userCard, so your function never runs and the browser gets an empty usercard element, zero by zero. It is not entirely silent on React nineteen: in a TSX file TypeScript refuses it, TS twenty-three thirty-nine, and the dev server terminal warns, using incorrect casing, use PascalCase for React components. In plain JSX that terminal line is your only clue.' },
  { t: 'The mental model you carry into Chapter 2', body:
    path([{ t: 'You write components', s: 'functions → element trees' }, { t: 'JSX compiles', s: 'to createElement / jsx calls', on: true }, { t: 'React renders', s: 'into the DOM, then re-renders' }, { t: 'You describe', s: 'React finds the route' }], { h: 210, fs: 19, nhan: ['', '', ''] }) +
    two(box('Next: where "changing data" comes from', 'Chapter 2: props — how a parent hands data down to a child — and composition, building big UIs from small components.', 'lam'),
      box('Then the loop comes alive', 'Chapter 3 gives components a memory with state: change state ⇒ re-render ⇒ React applies the diff (lesson 1.1).', 'xanh')), to: true,
    en: 'The mental model for chapter two. You write components, functions that return element trees. JSX is syntax sugar compiled into createElement calls that build plain objects. React renders your description into the DOM and re-renders efficiently when data changes. You describe the destination; React finds the route. Next, chapter two: props and composition; then chapter three gives components a memory with state.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Single root', 'a component returns one root element (use a Fragment to avoid an extra div)'), kw('Fragment &lt;&gt;…&lt;/&gt;', 'groups children without rendering a wrapper'),
      kw('className / htmlFor', 'the JSX names for class and for'), kw('camelCase events', 'onClick, onChange — event props in camelCase'),
      kw('Self-closing tags', 'empty tags must close: &lt;img /&gt;, &lt;br /&gt;'), kw('Mental model', 'JSX is JS: attributes map to object props'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: single root; Fragment; className and htmlFor; camelCase events; self-closing tags; and the mental model.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Return two sibling elements with no wrapper and read the error; fix it with a <code>&lt;div&gt;</code>, then with a Fragment',
      `Convert HTML attributes: ${c('class')} → ${c('className')}, ${c('for')} → ${c('htmlFor')}, ${c('onclick')} → ${c('onClick')}; self-close an ${c('<img />')}`,
      'Write a component that breaks three JSX rules on purpose; fix each and note which error points at which rule',
      `Rename a component to lowercase and find the clue (tsc / dev terminal)`,
    ]), box('Keep these', `<ul><li>One root — Fragment avoids extra DOM</li><li>Close every tag</li><li>camelCase props; {' '} for a space</li><li>JSX is JavaScript — capital = component</li></ul>`, 'lam'), ''),
    en: 'Your turn: return two siblings and read the error, then fix with a div and with a Fragment; convert HTML attributes and self-close an img; break three rules on purpose and map each error to its rule; and rename a component to lowercase and find the clue. Keep: one root; close every tag; camelCase props; JSX is JavaScript.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — JSX & the render model', bai: '1.5' }, S);
