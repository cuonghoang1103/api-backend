/*DU_LIEU*/
const DU_LIEU = {
 "n3-1:file:src/app/nho/page.tsx": "'use client';\nimport { useState } from 'react';\n\nlet lanVe = 0;                                   // đếm số lần component Nho render (chỉ để đo)\n\nexport default function Nho() {\n  lanVe++;\n  let bien = 0;                                  // ✗ biến thường\n  const [count, setCount] = useState(0);         // ✓ state\n  const [a, setA] = useState(0);\n  const [b, setB] = useState(0);\n  const [n, setN] = useState(0);\n\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <p id=\"ve\">Nho đã render: {lanVe} lần</p>\n      <button id=\"bien\" className=\"block rounded border px-3\" onClick={() => { bien++; console.log('bien =', bien); }}>Biến thường: {bien}</button>\n      <button id=\"state\" className=\"block rounded border px-3\" onClick={() => setCount(count + 1)}>useState: {count}</button>\n      <button id=\"hai\" className=\"block rounded border px-3\" onClick={() => { setA(a + 1); setA(a + 1); }}>setA(a + 1) ×2: {a}</button>\n      <button id=\"ham\" className=\"block rounded border px-3\" onClick={() => { setB((x) => x + 1); setB((x) => x + 1); }}>setB(x =&gt; x + 1) ×2: {b}</button>\n      <button id=\"bacai\" className=\"block rounded border px-3\" onClick={() => { setCount((x) => x + 1); setA((x) => x + 1); setB((x) => x + 1); }}>3 setter một lần bấm</button>\n      <button id=\"giong\" className=\"block rounded border px-3\" onClick={() => setN(0)}>setN(0) khi n đang là {n}</button>\n    </div>\n  );\n}\n",
 "n3-1:file:src/app/giup/page.tsx": "'use client';\nimport { useState } from 'react';\n\nfunction dungDem() {                             // hàm THƯỜNG (không bắt đầu bằng use) gọi hook\n  return useState(0);\n}\n\nexport default function Giup() {\n  const [k, setK] = dungDem();\n  const [loi, setLoi] = useState('');\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <button id=\"k\" className=\"block rounded border px-3\" onClick={() => setK(k + 1)}>hook trong hàm thường, gọi lúc render: {k}</button>\n      <button id=\"sk\" className=\"block rounded border px-3\" onClick={() => {\n        try { useState(0); } catch (e) { setLoi(String((e as Error).message).split('\\n')[0]); }\n      }}>gọi useState trong hàm xử lý sự kiện</button>\n      <p id=\"loi\" className=\"text-red-600\">{loi}</p>\n    </div>\n  );\n}\n",
 "n3-1:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint src/app/giup/page.tsx 2>&1 | sed 's#.*/my-app/##'\n\nsrc/app/giup/page.tsx\n   5:10  error  React Hook \"useState\" is called in function \"dungDem\" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word \"use\"  react-hooks/rules-of-hooks\n  15:15  error  React Hook \"useState\" cannot be called inside a callback. React Hooks must be called in a React function component or a custom React Hook function                                                                                             react-hooks/rules-of-hooks\n\n✖ 2 problems (2 errors, 0 warnings)\n$ npm run build 2>&1 | grep -E 'Compiled|Failed|Error|nho|giup' | head -8\n✓ Compiled successfully in 969ms\n├ ○ /giup\n├ ○ /nho\n$ curl -s -o /dev/null -w 'GET /nho → %{http_code}\\n' localhost:19326/nho\nGET /nho → 200",
 "n3-1:file:src/app/dieu-kien/page.tsx": "'use client';\nimport { useState } from 'react';\n\nfunction Hop({ mo }: { mo: boolean }) {\n  const [ten] = useState('An');\n  if (mo) {\n    const [tuoi] = useState(20);                  // ✗ hook trong if\n    return <p>{ten} · {tuoi}</p>;\n  }\n  return <p>{ten}</p>;\n}\n\nexport default function DieuKien() {\n  const [mo, setMo] = useState(false);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <button id=\"mo\" className=\"rounded border px-3\" onClick={() => setMo(!mo)}>mo = {String(mo)}</button>\n      <Hop mo={mo} />\n    </div>\n  );\n}\n",
 "n3-1:dieukien": "$ npx eslint src/app/dieu-kien/page.tsx 2>&1 | sed 's#.*/my-app/##'\n\nsrc/app/dieu-kien/page.tsx\n  7:20  error  React Hook \"useState\" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?  react-hooks/rules-of-hooks\n\n✖ 1 problem (1 error, 0 warnings)\n$ curl -s -o /dev/null -w 'GET /dieu-kien (dev) → %{http_code}\\n' localhost:19327/dieu-kien\nGET /dieu-kien (dev) → 200",
 "n3-1:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, three, steps, kw, c, icards, meter, cmp, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-03-1', code: 'NXJ 3.1', title: 'useState: give a component a memory', sub: 'Chapter 3 · Lesson 3.1' };
const O = (k) => { const v = DU_LIEU[`n3-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-03-1', ten, o);
const lenh = (k, re) => { const ds = O(k).split('\n$ '); const i = ds.findIndex((x) => re.test(x)); return (i ? '$ ' : '') + ds[i]; };

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.1', t: 'useState: give a<br>component a memory', sub: 'Why a plain variable cannot remember, what the setter really does, and the rules every hook lives by — measured in a real browser',
    en: 'Lesson three point one: useState, giving a component a memory. Why a plain variable cannot remember, what the setter really does, and the rules every hook lives by — all measured in a real browser.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why a plain variable fails — two separate reasons, measured</li>
    <li><code>useState</code>: a value React keeps for you, and its setter</li>
    <li>The setter schedules a re-render; it does not change your variable</li>
    <li><code>setA(a + 1)</code> twice adds one; the function form adds two</li>
    <li>Batching and the <code>Object.is</code> bail-out — counted renders</li>
    <li>The rules of hooks: what ESLint, dev and production each say</li></ul>`,
    en: 'Six takeaways: why a plain variable fails, measured; useState and its setter; the setter schedules a re-render instead of changing your variable; set a plus one twice adds one while the function form adds two; batching and the Object is bail-out, with counted renders; and the rules of hooks — what ESLint, development and production each say.' },
  { t: 'Why a plain variable cannot remember', body: two(tsx(`function Counter() {
  let count = 0;       // reset each render
  return (
    <button onClick={() => { count++; }}>
      {count}
    </button>
  );
}`, { hl: [2, 4] }) +
      box('Two separate failures', '<b>1.</b> Changing a variable tells React nothing — no re-render, the screen never updates.<br><b>2.</b> Even if it did re-render, <code>Counter()</code> runs from the top and <code>let count = 0</code> resets it.', 'do2'),
      `<div><div class="cap" style="font-weight:700">Measured on /nho (next start), clicked 3 times</div>${B('nho-sau', { vp: 640, h: 100, w: 470, url: 'localhost:3000/nho', mark: [[24, 60, 148, 30, '']] })}</div>` +
      tn('console:\nbien = 1\nbien = 2\nbien = 3', { fs: 15, title: 'browser console' }) +
      box('The variable DID change', 'The console counts 1, 2, 3 — but the button still says <b>0</b> and the page rendered <b>once</b>. Nothing told React.', 'cam')),
    en: 'Why a plain variable cannot remember. Two separate failures: changing a variable tells React nothing, so the screen never updates; and even if React re-rendered, the function would run from the top and reset the variable to zero. Measured: clicked three times, the console counted one, two, three — the variable did change — but the button still showed zero and the page rendered only once.' },
  { t: 'useState: a value React keeps for you', body: two(tsx(`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`, { hl: [4, 6] }),
      '<div>' + box('A pair', '<code>useState(0)</code> returns <b>the current value</b> and <b>a setter</b>. React stores the value <i>outside</i> your function, so it survives re-renders.', 'xanh') +
      box('Initial value: first render only', 'On later renders <code>useState</code> ignores the <code>0</code> and returns whatever the state currently is.', 'lam') +
      box('Measured', '3 clicks ⇒ <code>useState: 3</code>, and the page rendered <b>3 more times</b> (1 → 4). Each setter call caused one re-render.', 'cam') + '</div>'),
    en: 'useState declares a value React keeps for you. It returns a pair: the current value and a setter. React stores the value outside your function, so it survives re-renders, and the initial value is only used the first time. Measured: three clicks, the button showed three, and the page rendered three more times — one re-render per setter call.' },
  { t: 'The setter does two things', body: seq(['Event handler', 'React', 'Counter()', 'DOM'], [
      [0, 1, 'setCount(count + 1)', '#0070f3'], [1, 1, 'store new value · schedule', '#0070f3'], [1, 2, 'call again — useState returns the new value', '#1f8a3b'],
      [2, 1, 'new JSX', '#1f8a3b'], [1, 3, 'commit only what changed', '#b85a2b']], { w: 1110, rh: 54, fs: 17 }) +
    two(box('Calling a setter is the only way', 'to make a component re-render itself. Screen not updating? You did not call a setter, or you mutated instead of replacing (lesson 3.3).', 'lam'),
      box('It does NOT change your variable', '<code>count</code> keeps its old value until this function ends. The new value shows up on the <b>next</b> render (lesson 3.2).', 'do2')),
    en: 'The setter does two things: React stores the new value and schedules a re-render. Then it calls your component again, useState returns the new value, and React commits only what changed to the DOM. It is the only way for a component to re-render itself — and it does not change the variable you are holding.' },
  { t: 'Measured: two setters, one increment', body: two(tsx(`// a = 0
setA(a + 1);   // = setA(0 + 1)
setA(a + 1);   // = setA(0 + 1)
// ⇒ a = 1

// b = 0
setB((x) => x + 1);   // 0 → 1
setB((x) => x + 1);   // 1 → 2
// ⇒ b = 2`, { hl: [3, 8] }),
      `<div><div class="cap" style="font-weight:700">One click each (real browser)</div>${B('nho-ham', { vp: 640, h: 210, w: 540, url: 'localhost:3000/nho', mark: [[24, 136, 155, 30, ''], [24, 174, 195, 30, '']] })}</div>` +
      box('Not a batching bug', 'Both calls read the <b>same</b> <code>a</code> from this render\'s closure. The function form receives the result of the previous call. Measured: <b>a: 0 → 1</b>, <b>b: 0 → 2</b> — and one render each.', 'cam')),
    en: 'Measured: two setters, one increment. Both set a plus one calls read the same a from this render, so both say: set zero plus one. One click, a went from zero to one. The function form receives the result of the previous call, so b went from zero to two. Use the function form whenever the next value depends on the previous one.' },
  { t: 'Measured: batching and the Object.is bail-out', body: two('<div>' + meter([
      ['3 setters, one click', 1, '#0070f3'],
      ['setN(0) while n = 0 (×2)', 0, '#16a34a'],
      ['3 clicks on useState', 3, '#e0590b'],
    ], { w: 580, don: 'renders', nhan: 250, fs: 17, rh: 48 }) +
      box('Batching', 'Several setter calls in one event ⇒ <b>one</b> re-render. React collects them and applies them together.', 'xanh') +
      box('Bail-out', 'Same primitive value ⇒ <b>no</b> re-render (<code>Object.is</code>). A new object with the same content <b>is</b> a different value — lesson 3.3.', 'lam') + '</div>',
      `<div>${B('nho-sau', { vp: 640, h: 290, w: 500, url: 'localhost:3000/nho · after all clicks', mark: [[24, 24, 200, 28, ''], [24, 212, 197, 30, ''], [24, 250, 212, 30, '']] })}` +
      box('How it was counted', 'A module-level counter (<code>Nho đã render: N lần</code>) read before and after each action, under <code>next start</code> — production, so no Strict Mode doubling.', 'cam') + '</div>'),
    en: 'Measured with a render counter. Three setters in one click: count, a and b all changed, but the page rendered once — that is batching. Setting n to zero while it was already zero, twice: zero re-renders, because Object is says the value did not change. A new object with the same content would count as different — lesson three point three.' },
  { t: 'The rules of hooks — and who enforces them', body: two(tsx(`function Hop({ mo }) {
  const [ten] = useState('An');
  if (mo) {
    const [tuoi] = useState(20); // ✗ in an if
    return <p>{ten} · {tuoi}</p>;
  }
  return <p>{ten}</p>;
}`, { sm: true, hl: [4] }) + tn(lenh('dieukien', /eslint/).split('\n').filter((l) => /error|problem|\$/.test(l)).join('\n'), { fs: 13, wrap: 64 }),
      `<div>${B('dieu-kien', { vp: 960, h: 420, w: 560, url: '/dieu-kien · next dev' })}</div>` +
      box('Why order matters', 'React matches state to hooks by <b>call order</b>. Flip <code>mo</code> and the second render calls one more hook: <b>Rendered more hooks than during the previous render.</b>', 'do2'), 'r46'),
    en: 'The rules of hooks: call them at the top level, never inside an if, a loop or a nested function. React matches state to hooks by call order. Here, ESLint flags the hook inside the if as called conditionally. In next dev, flipping mo makes the second render call one more hook, and React stops with: Rendered more hooks than during the previous render.' },
  { t: 'Measured: what really happens when you break them', body: tn(lenh('trang', /eslint/).split('\n').filter((l) => /error|problem|\$/.test(l)).join('\n') + '\n' + lenh('trang', /build/), { fs: 12, wrap: 125 }) +
    cmp(['Where the hook is called', 'ESLint', 'At runtime'], [
      ['Inside a plain function <code>dungDem()</code>, during render', 'error', '<b>works</b> (k counted to 2) — silently'],
      ['Inside a click handler', 'error', '<b>Minified React error #321</b> (Invalid hook call)'],
      ['Inside an <code>if</code>, condition flips', 'error', 'Rendered more hooks than during the previous render'],
    ], { hl: [0] }) +
    box('next build stays green', 'Next.js 16 no longer runs ESLint during <code>next build</code>. Run <code>npx eslint .</code> yourself (or in CI) — it is the only layer that catches the first row.', 'cam'),
    en: 'What really happens when you break the rules, measured. A hook inside a plain helper function, called during render, actually works at runtime — only ESLint complains. A hook inside a click handler throws Minified React error three twenty one, invalid hook call. A conditional hook breaks when the condition flips. And next build stays green in Next.js sixteen: it no longer runs ESLint, so run it yourself.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('useState', 'a hook that gives a component a value surviving re-renders'), kw('State variable', 'the current value useState returns for this render'),
      kw('Setter', 'stores a new value and schedules a re-render'), kw('Updater function', 'setX(prev => next) — chains correctly'),
      kw('Batching', 'several setters in one event ⇒ one re-render'), kw('Rules of hooks', 'top level, same order, only in components or hooks'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: useState; state variable; setter; updater function; batching; and the rules of hooks.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a counter with ${c('useState(0)')}; then swap in a plain ${c('let')} and log it — watch the console move while the screen does not`,
      `Call ${c('setCount(count + 1)')} twice in one handler; then use ${c('setCount(c => c + 1)')} twice`,
      'Add a render counter; click a button that calls three setters — count the renders',
      `Put a hook inside an ${c('if')}; run ${c('npx eslint')}, then flip the condition in ${c('next dev')}`,
    ]), box('Keep these', `<ul><li>State = a value React keeps between renders</li><li>The setter schedules a re-render; your variable stays old</li><li>Next value depends on the previous ⇒ <code>setX(x =&gt; …)</code></li><li>Hooks: top level, same order — and run ESLint yourself</li></ul>`, 'lam'), ''),
    en: 'Your turn: build a counter, then swap in a plain variable and watch the console move while the screen does not; call the setter twice both ways; add a render counter and click a button with three setters; and put a hook inside an if, run ESLint, then flip the condition in next dev. Keep: state is a value React keeps between renders; the setter schedules a re-render; use the function form when the next value depends on the previous; and run ESLint yourself.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — State & the re-render model', bai: '3.1' }, S);
