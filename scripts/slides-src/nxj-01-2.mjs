/**
 * nxj-01-2 — Next.js · Chapter 1 · Lesson 1.2 "JSX is JavaScript in disguise" (deck video + web, 13/11/2026).
 * Bài web: nextjs-1-2-jsx-la-javascript. Output THẬT (scratchpad/nxj/demo/n1-2.txt · React 19.3.0 · TypeScript 5 của my-app · Node 22.23.3):
 * ts.transpileModule: jsx 'react' ⇒ React.createElement("h1", { className: "title" }, "Hello"); 'react-jsx' ⇒ import { jsx as _jsx } from "react/jsx-runtime";
 * _jsx("h1", { className: "title", children: "Hello" }). Element ⇒ {"type":"h1","props":{"className":"title","children":"Hello"}}.
 * renderToStaticMarkup: Greeting ⇒ <p>Hi, Bình!</p>; 'greeting' (chữ thường) ⇒ <greeting name="Bình"></greeting>.
 * Bẫy class/for (React 19): VẪN render class="card", for="email" + cảnh báo dev "Invalid DOM property `class`. Did you mean `className`?";
 * TSX: tsc TS2322 "Property 'class' does not exist … Did you mean 'className'?" (web cũ nói "div không có class" — SAI với React 19).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-2:file:jsx-demo.mjs": "import ts from 'typescript';\nconst src = `const el = <h1 className=\"title\">Hello</h1>;`;\nfor (const jsx of ['react', 'react-jsx']) {\n  const out = ts.transpileModule(src, { compilerOptions: { jsx: jsx === 'react' ? ts.JsxEmit.React : ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });\n  console.log(`--- jsx: ${jsx}\\n${out.outputText.trim()}`);\n}\n",
 "n1-2:bien-dich": "$ node jsx-demo.mjs\n--- jsx: react\nconst el = React.createElement(\"h1\", { className: \"title\" }, \"Hello\");\n--- jsx: react-jsx\nimport { jsx as _jsx } from \"react/jsx-runtime\";\nconst el = _jsx(\"h1\", { className: \"title\", children: \"Hello\" });",
 "n1-2:file:el.cjs": "const React = require('react');\nconst el = React.createElement('h1', { className: 'title' }, 'Hello');\nconsole.log(JSON.stringify({ type: el.type, props: el.props }));\n",
 "n1-2:object": "$ node el.cjs\n{\"type\":\"h1\",\"props\":{\"className\":\"title\",\"children\":\"Hello\"}}",
 "n1-2:file:greet.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nfunction Greeting({ name }) { return React.createElement('p', null, 'Hi, ', name, '!'); }\nconsole.log(renderToStaticMarkup(React.createElement(Greeting, { name: 'Bình' })));\nconsole.log(renderToStaticMarkup(React.createElement('greeting', { name: 'Bình' })));\n",
 "n1-2:render": "$ node greet.cjs\n<p>Hi, Bình!</p>\n<greeting name=\"Bình\"></greeting>",
 "n1-2:file:cls.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconsole.log(renderToStaticMarkup(React.createElement('div', { class: 'card' }, 'Thẻ')));\nconsole.log(renderToStaticMarkup(React.createElement('label', { for: 'email' }, 'Email')));\n",
 "n1-2:class": "$ NODE_ENV=development node cls.cjs\n<div class=\"card\">Thẻ</div>\n<label for=\"email\">Email</label>\nInvalid DOM property `class`. Did you mean `className`?\nInvalid DOM property `for`. Did you mean `htmlFor`?",
 "n1-2:file:src/app/cls/page.tsx": "export default function Cls() {\n  return <div class=\"card\">Thẻ</div>;\n}\n",
 "n1-2:class-tsc": "$ npx tsc --noEmit\nsrc/app/cls/page.tsx(2,15): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.\n  Property 'class' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'. Did you mean 'className'?"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, js, tn, cmp, box, two, steps, kw, c, path, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-01-2', code: 'NXJ 1.2', title: 'JSX is JavaScript in disguise', sub: 'Chapter 1 · Lesson 1.2' };
const O = (k) => { const v = DU_LIEU[`n1-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.2', t: 'JSX is JavaScript<br>in disguise', sub: 'The angle brackets are a lie told by the build tool — we watch the compiler rewrite them',
    en: 'Lesson one point two: JSX is JavaScript in disguise. The angle brackets are a lie told by the build tool — we will run the compiler and watch it rewrite them into plain function calls.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What JSX compiles to — the classic and the automatic runtime</li>
    <li>An element is just an object: type + props</li>
    <li>A component is a function that returns elements</li>
    <li>Why the capital letter matters</li>
    <li>The <code>class</code> / <code>for</code> trap — what React 19 really does</li></ul>`,
    en: 'Five takeaways: what JSX compiles to under both runtimes; an element is an object with type and props; a component is a function returning elements; why the capital letter matters; and the class and for trap, measured on React nineteen.' },
  { t: 'What JSX compiles to — run the compiler', body: tsx('const el = <h1 className="title">Hello</h1>;') +
    path([{ t: 'Your JSX', s: 'looks like HTML' }, { t: 'Compiler', s: 'TypeScript / SWC / Babel', on: true }, { t: 'Plain JS', s: 'function calls' }], { h: 150, nhan: ['before it runs', 'rewritten'] }) +
    tn(O('bien-dich'), { fs: 15, wrap: 100 }),
    en: 'What JSX compiles to, measured: we ran the TypeScript compiler on one line of JSX. With the classic runtime it becomes React dot createElement of h1, an object with className, and Hello. With the automatic runtime it becomes an import from react slash jsx-runtime and a call to jsx, with children inside props. By the time code runs, the angle brackets are gone.' },
  { t: 'Tag → 1st argument, attributes → props, children → the rest', body: cmp(['JSX part', 'Becomes', 'In our example'], [
      ['Tag name', '1st argument: a string for DOM tags, a function for components', '<code>"h1"</code>'],
      ['Attributes', 'one props object — JavaScript names', '<code>{ className: "title" }</code>'],
      ['Children', 'the remaining arguments (classic) or <code>props.children</code> (automatic)', '<code>"Hello"</code>'],
    ]) + two(box('So JSX follows JavaScript\'s rules', 'It is an expression: store it in a variable, pass it as an argument, return it from a function.', 'xanh'),
      box('Why some files import React and some do not', 'Classic runtime needs <code>React</code> in scope. Since React 17 the automatic runtime imports <code>jsx</code> for you — modern Next.js files never import React for JSX.', 'lam')),
    en: 'The mapping: the tag name becomes the first argument — a string for a DOM tag, the function itself for a component; attributes become one props object with JavaScript names; children become the remaining arguments, or props dot children in the automatic runtime. JSX is therefore an expression. And this explains the import React question: since React seventeen the automatic runtime imports the helper for you.' },
  { t: 'An element is just an object — type + props', body: js(O('file:el.cjs').trim(), { sm: true }) + tn(O('object'), { fs: 16, wrap: 70 }) + two(
      steps(['<b>type</b>: what to render — <code>"h1"</code> for a DOM tag, a function for a component', '<b>props</b>: everything passed in, <b>children</b> included', ]), steps(['No DOM node, no HTML — a lightweight description', 'Cheap to create ⇒ React builds a whole tree each render and throws it away']), ''),
    en: 'An element is just an object. Logged for real: type h1, props with className title and children Hello. Type says what to render — a string for a DOM tag or a function for a component — and props carries everything passed in, children included. It is not a DOM node and not HTML, so React can build a whole tree on every render and throw it away.' },
  { t: 'A component is a function that returns elements', body: tsx(`function Greeting({ name }: { name: string }) {
  return <p>Hi, {name}!</p>;
}
renderToStaticMarkup(<Greeting name="Bình" />)   // react-dom/server`, { hl: [4] }) + tn(KQ('render').split('\n')[0], { fs: 18 }) +
    box('Rendered for real through react-dom/server', 'The function received <code>{ name: "Bình" }</code> as props and returned an element; React turned the element tree into this HTML.', 'xanh'),
    en: 'A component is a function whose name starts with a capital letter and returns a tree of elements. Rendered for real through react-dom server: Greeting with name Bình produces a paragraph, Hi, Bình. The function received the props object and returned elements; React turned them into HTML.' },
  { t: 'The capital letter is how the compiler decides', body: vsd(tsx(`<greeting name="Bình" />
// → createElement('greeting', …)  a STRING`, { sm: true }) + tn(KQ('render').split('\n')[1], { fs: 16 }),
    tsx(`<Greeting name="Bình" />
// → createElement(Greeting, …)  the FUNCTION`, { sm: true }) + tn(KQ('render').split('\n')[0], { fs: 16 }),
    '✗ lowercase = an HTML tag', '✓ Capital = your component') + '' +
    box('Forget the capital and nothing errors', 'React renders an unknown <code>&lt;greeting&gt;</code> tag into the page — your component never runs.', 'cam'), to: true,
    en: 'The capital letter is not style; it is how the compiler decides. Lowercase greeting compiles to createElement with the string greeting — an HTML tag that does not exist — and React really rendered an empty greeting element. Capital Greeting passes the function itself, so your component runs. Forget the capital and nothing errors.' },
  { t: 'Trap: class instead of className — what React 19 really does', body: js(O('file:cls.cjs').split('\n').slice(2).join('\n').trim(), { sm: true }) +
    two(tn(O('class').split('\n').slice(1).join('\n'), { fs: 13, wrap: 56 }), tn(O('class-tsc').split('\n').slice(0, 3).join('\n'), { fs: 13, wrap: 56 })) +
    box('Measured: it still renders — but warns, and .tsx refuses it', 'React 19 passes <code>class</code> / <code>for</code> through to the HTML with a dev warning <b>Did you mean `className`?</b> (older advice says the class is dropped — not here). In a .tsx file TypeScript fails with <b>TS2322 … Did you mean \'className\'?</b> Use <code>className</code> and <code>htmlFor</code>.', 'cam'),
    en: 'The trap, measured on React nineteen. Writing class and for still renders: the HTML has class equals card and for equals email, with a dev warning, invalid DOM property class, did you mean className. Older advice says the class is silently dropped — not on this version. In a TSX file it does not compile: TS twenty three twenty two, did you mean className. Use className and htmlFor.' },
  { t: 'What the compiler does with your JSX', body: steps([
      'It is not HTML — <code>&lt;Card title="Hi" /&gt;</code> compiles to a function call that returns an object, so JSX follows JavaScript\'s rules',
      'Attributes become props with JavaScript names: <code>className</code>, <code>htmlFor</code>, <code>onClick</code> — <code>class</code> and <code>for</code> are keywords',
      'Whatever sits between the tags arrives as <code>props.children</code> — that is what makes wrapper components possible',
      'So a component is just a function: defaults, destructuring, early returns all apply',
    ]), to: true,
    en: 'In short: JSX is not HTML, it is a function call returning an object; attributes become props with JavaScript names like className, htmlFor and onClick; children arrive as props dot children, which makes wrapper components possible; and a component is just a function, so everything you know about functions applies.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('JSX', 'HTML-like syntax compiled to function calls'), kw('React.createElement', 'the classic-runtime call JSX becomes'), kw('jsx() / automatic runtime', 'the React 17+ form, auto-imported'),
      kw('Transpiler', 'TypeScript / SWC / Babel rewrite JSX before it runs'), kw('Expression', 'JSX produces a value — it goes anywhere a value goes'), kw('Element object', '{ type, props } — not a DOM node'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: JSX; React createElement; the automatic runtime and jsx; the transpiler; an expression; and the element object.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Paste a small JSX snippet into the Babel REPL (or ${c('ts.transpileModule')}) and read the output`,
      'Hand-write one element as a function call, then convert it back',
      'Explain why JSX can go wherever an expression can',
      `Try ${c('<div class="x">')} in a .tsx file and read TypeScript's message`,
    ]), box('Keep these', `<ul><li>JSX → plain function calls</li><li>Element = { type, props }</li><li>Capital = component, lowercase = tag</li><li>className / htmlFor</li></ul>`, 'lam'), ''),
    en: 'Your turn: compile a JSX snippet in the Babel REPL or with transpileModule and read it; hand-write an element as a call and back; explain why JSX goes anywhere an expression goes; and try class in a TSX file. Keep: JSX becomes function calls; an element is type plus props; capital means component; use className and htmlFor.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — JSX & the render model', bai: '1.2' }, S);
