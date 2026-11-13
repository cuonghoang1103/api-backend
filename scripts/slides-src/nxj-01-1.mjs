/**
 * nxj-01-1 — Next.js · Chapter 1 · Lesson 1.1 "What React actually does" (deck video + web, 13/11/2026).
 * Bài web: nextjs-1-1-react-lam-gi. Output THẬT (scratchpad/nxj/demo/n1-1.txt · Next.js 16.4.6 · React 19.3.0 · Chromium/Playwright):
 * counter DOM trần (public/vanilla.html) bấm 2 lần ⇒ "Count: 2"; counter React (/dem) có MutationObserver: bấm 3 lần ⇒ ĐÚNG 3 đột biến DOM, mỗi cái là
 * characterData của MỘT nút #text '0'→'1', '1'→'2', '2'→'3' (p và button không bị dựng lại). React.createElement('p', null, 'Count: 0') = object thuần
 * { $$typeof: Symbol(react.transitional.element), type: 'p', key: null, props: { children: 'Count: 0' } … }. Bẫy: "Sửa tay DOM" gán 999 ⇒ bấm +1 (setState)
 * ⇒ React vẽ lại 101, số 999 biến mất.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-1:file:public/vanilla.html": "<!doctype html>\n<html><body style=\"font-family:sans-serif;padding:32px\">\n<script>\nlet count = 0;\nconst p = document.createElement('p');\nconst button = document.createElement('button');\nbutton.textContent = 'Add';\np.textContent = `Count: ${count}`;\nbutton.addEventListener('click', () => {\n  count = count + 1;\n  p.textContent = `Count: ${count}`;   // bạn phải TỰ NHỚ cập nhật dòng này\n});\ndocument.body.append(p, button);\n</script>\n</body></html>\n",
 "n1-1:file:src/app/dem/page.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className=\"p-8 font-sans\">\n      <p>Count: {count}</p>\n      <button className=\"rounded border px-3\" onClick={() => setCount(count + 1)}>Add</button>\n    </div>\n  );\n}\n",
 "n1-1:file:src/app/tay/page.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function Tong() {\n  const [sum, setSum] = useState(100);\n  return (\n    <div className=\"p-8 font-sans\">\n      <p>Tổng: <b id=\"total\">{sum}</b></p>\n      <button className=\"mr-2 rounded border px-3\" onClick={() => {\n        document.getElementById('total')!.textContent = '999';   // ✗ với tay vào DOM\n      }}>Sửa tay DOM</button>\n      <button className=\"rounded border px-3\" onClick={() => setSum(sum + 1)}>+1 (setState)</button>\n    </div>\n  );\n}\n",
 "n1-1:tao": "$ npm run build 2>&1 | grep -A8 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /dem\n└ ○ /tay\n\n\n○  (Static)  prerendered as static content",
 "n1-1:phan-tu": "$ node -e \"console.log(React.createElement('p', null, 'Count: 0'))\"\n{\n  '$$typeof': Symbol(react.transitional.element),\n  type: 'p',\n  key: null,\n  props: { children: 'Count: 0' },\n  _owner: null,\n  _store: {}\n}",
 "n1-1:chay": "$ curl -s -o /dev/null -w '/dem → %{http_code}\\n' localhost:19310/dem\n/dem → 200",
 "n1-1:dotbien": "[{\"loai\": \"characterData\", \"nut\": \"#text\", \"cu\": \"0\", \"moi\": \"1\"}, {\"loai\": \"characterData\", \"nut\": \"#text\", \"cu\": \"1\", \"moi\": \"2\"}, {\"loai\": \"characterData\", \"nut\": \"#text\", \"cu\": \"2\", \"moi\": \"3\"}]",
 "n1-1:tay-sau": "101"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, js, tn, br, cmp, box, two, steps, kw, c, path, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-01-1', code: 'NXJ 1.1', title: 'What React actually does', sub: 'Chapter 1 · Lesson 1.1' };
const O = (k) => { const v = DU_LIEU[`n1-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-01-1', ten, { vp: 640, ...o });
const MUT = JSON.parse(DU_LIEU['n1-1:dotbien'] ?? '[]');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.1', t: 'What React<br>actually does', sub: 'You DESCRIBE the UI; React makes the screen match — measured with a real browser',
    en: 'Lesson one point one: what React actually does. You describe the UI; React makes the screen match the description. We will measure exactly what React touches in a real browser.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The old way: commanding the DOM, step by step</li>
    <li>The React way: describing the result for the current data</li>
    <li>What React really changes on screen — measured</li>
    <li>The loop: state → render → reconcile → commit</li>
    <li>A React element is a plain object</li>
    <li>The trap: reaching into the DOM yourself</li></ul>`,
    en: 'Six takeaways: the imperative old way; the declarative React way; what React really changes, measured; the four-word loop; a React element is a plain object; and the trap of touching the DOM yourself.' },
  { t: 'The old way: command the DOM yourself', body: js(O('file:public/vanilla.html').split('\n').slice(3, 13).join('\n'), { sm: true, hl: [9] }) + two(
      `<div>${B('vanilla', { url: 'localhost/vanilla.html · clicked 2×', h: 150, w: 420 })}</div>`,
      box('The screen is a COPY', '<code>count</code> is the truth; <code>p.textContent</code> is a copy you must update by hand at every place that changes it. Forget one ⇒ the screen silently shows an old value.', 'do2'), 'r46'),
    en: 'The old way: command the DOM. Create a paragraph and a button, then on every click update count AND remember to update the paragraph\'s text. The truth is count; the screen is a copy you keep in sync by hand. A real app has hundreds of such places — forget one and the screen silently drifts from the data.' },
  { t: 'The React way: describe the result', body: tsx(O('file:src/app/dem/page.tsx').trim(), { sm: true, hl: [8, 9] }) + two(
      `<div>${B('dem', { url: 'localhost:3000/dem · clicked 3×', h: 120, w: 420, mark: [[32, 32, 120, 24, '']] })}</div>`,
      box('No "update the text" anywhere', 'You say: the paragraph shows count. When count changes, React calls the function again, gets a new description, compares, and changes only what differs.', 'xanh'), 'r46'),
    en: 'The React way: write what the UI is for a given count. There is no instruction to update the text anywhere. When count changes, React runs the function again, gets a new description, compares it with the old one, and changes only the text node that really differs. You describe; React executes.' },
  { t: 'Measured: what React touches when you click', body: cmp(['Click', 'DOM mutation recorded', 'Node', 'Old → new'], MUT.map((m, i) => [`#${i + 1}`, m.loai, `<code>${m.nut}</code>`, `'${m.cu}' → '${m.moi}'`])) +
    two(box('3 clicks ⇒ exactly 3 tiny edits', 'A MutationObserver in Chromium recorded every DOM change: each click changed ONE text node. The <code>&lt;p&gt;</code> and the <code>&lt;button&gt;</code> were never rebuilt.', 'xanh'),
      box('That is the reconciler at work', 'React re-ran <code>Counter()</code> three times, but only applied the difference — which is why re-rendering on every keystroke stays cheap.', 'lam')),
    en: 'Measured in a real browser. A MutationObserver recorded every DOM change while we clicked three times: exactly three mutations, each a character-data change of a single text node — zero to one, one to two, two to three. The paragraph and the button were never rebuilt. React re-ran the component three times but applied only the difference.' },
  { t: 'The loop, in four words', body: path([{ t: 'State', s: 'data that can change' }, { t: 'Render', s: 'call your component', on: true }, { t: 'Reconcile', s: 'compare old vs new', on: true }, { t: 'Commit', s: 'apply only the diff' }], { nhan: ['changes', 'returns elements', 'the diff'], h: 270, fs: 26 }) +
    box('Declarative: your code declares the destination, not the route', 'A component is a function of state — same state in, same UI description out. Re-renders, stale values, effects running twice: they all stop being mysterious once you really believe this.', 'cam'), to: true,
    en: 'The loop in four words. State: data that can change. Render: React calls your component, which returns a description. Reconcile: React compares it with the previous one. Commit: it applies only the differences to the real DOM. That is why React is called declarative: your code declares the destination, not the route. A component is a function of state.' },
  { t: 'A React element is just a plain object', body: two(tn(O('phan-tu'), { fs: 15, wrap: 60 }),
      steps(['JSX like <code>&lt;p&gt;Count: 0&lt;/p&gt;</code> becomes an object: <b>type</b>, <b>props</b>, <b>children</b>', 'Cheap to create, cheap to throw away — no DOM touched yet', 'React builds a tree of these (the "virtual tree") and diffs it against the previous one', 'Same position + same type ⇒ keep the DOM node; different type ⇒ tear down and rebuild']), 'r64'), to: true,
    en: 'A React element is just a plain object. Called from Node, createElement for a paragraph returns an object with a type, p, and props with the children. Creating and discarding these is cheap — nothing touches the DOM yet. React builds a tree of them, compares it with the previous tree, keeps DOM nodes in the same position with the same type, and rebuilds only when the type changes.' },
  { t: 'Trap: reaching into the DOM inside a component', body: two(`<div><div class="cap" style="font-weight:700;color:#c0392b">1 · "Sửa tay DOM" sets the text to 999</div>${B('tay-2', { url: 'localhost:3000/tay', h: 170, w: 520, mark: [[30, 31, 80, 25, '']] })}</div>`,
      `<div><div class="cap" style="font-weight:700;color:#1f8a3b">2 · then +1 (setState) — React wins: ${O('tay-sau')}</div>${B('tay-1', { url: 'localhost:3000/tay', h: 170, w: 520, mark: [[30, 31, 80, 25, '']] })}</div>`) +
    tsx(`onClick={() => { document.getElementById('total')!.textContent = '999'; }}   // ✗ fights React
onClick={() => setSum(sum + 1)}                                             // ✓ change the data`, { sm: true, hl: [1] }) +
    box('If a value is on screen, it lives in state', 'Your manual edit survives only until the next render, when React restores what its tree says. Until then the screen and the state disagree.', 'do2'), giua: true,
    en: 'The trap: reaching into the DOM yourself. Measured: the Sửa tay button wrote nine nine nine straight into the DOM, while the state still said one hundred. The next setState made React render one hundred and one and the manual edit vanished. If a value appears on screen, it belongs in state, not in a manual DOM edit.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Declarative', 'describe the UI for the current data'), kw('Imperative', 'command the DOM step by step'), kw('React element', 'a plain object describing what to render'),
      kw('Virtual tree', 'React\'s in-memory picture of the UI'), kw('Render', 'calling your component for the current state'), kw('Reconcile / commit', 'diff the trees, apply only changes'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: declarative and imperative; a React element; the virtual tree; render; and reconcile and commit.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write a counter with raw DOM (${c('createElement')}, ${c('textContent')}); list every line that keeps the screen in sync`,
      'Rewrite it as a React component that only describes the UI',
      'Optional: paste a MutationObserver in the console and count what one click changes',
      'One sentence: commanding the DOM vs describing the UI',
    ]), box('Keep these', `<ul><li>React: data → UI, and it updates the DOM</li><li>You describe; React executes</li><li>Elements are plain objects; React applies the minimal diff</li><li>Never patch the DOM behind React's back</li></ul>`, 'lam'), ''),
    en: 'Your turn: write a raw DOM counter and list every syncing line; rewrite it in React; optionally paste a MutationObserver into the console and count what one click changes; and say in one sentence how commanding differs from describing. Keep: React turns data into UI and updates the DOM; you describe, React executes; elements are plain objects and React applies the minimal diff; never patch the DOM behind React\'s back.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — JSX & the render model', bai: '1.1' }, S);
