/*DU_LIEU*/
const DU_LIEU = {
 "n6-1:file:src/app/hop-ref/page.tsx": "'use client';\nimport { useEffect, useRef, useState } from 'react';\n\nconst dem = { hop: 0 };                                // đếm render (đo dưới next start)\nconst so = { cungHop: 0, khacHop: 0, lucRender: '', trongEffect: '', cu: -1, guong: -1 };\nlet hopDau: object | null = null;\n\n// 1 — ref vs state: đổi ref KHÔNG render lại\nfunction HopRef() {\n  dem.hop++;\n  const c = useRef(0);\n  const [n, setN] = useState(0);\n  useEffect(() => {                                    // mỗi lần render: có phải CÙNG cái hộp?\n    if (hopDau === null) hopDau = c;\n    if (hopDau === c) so.cungHop++; else so.khacHop++;\n    Object.assign(window, { __c: c });\n  });\n  return (\n    <p>\n      <button id=\"ref-tang\" onClick={() => { c.current++; }} className=\"rounded border px-2\">ref +1</button>{' '}\n      <button id=\"state-tang\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">state +1</button>{' '}\n      ref trên màn hình: <b id=\"hien-ref\">{c.current}</b> · state: <b id=\"hien-state\">{n}</b>\n    </p>\n  );\n}\n\n// 2 — ref tới nút DOM: null lúc render, có nút sau commit\nfunction OFocus() {\n  const inputRef = useRef<HTMLInputElement>(null);\n  if (!so.lucRender) so.lucRender = String(inputRef.current);       // đo: lúc render đầu\n  useEffect(() => {\n    so.trongEffect = inputRef.current?.tagName ?? 'null';\n    inputRef.current?.focus();                                       // focus lúc mount\n  }, []);\n  return <input id=\"o-ten\" ref={inputRef} placeholder=\"tên\" className=\"rounded border px-1\" />;\n}\n\n// 3 — giữ id bộ hẹn giờ: biến thường vs ref\nfunction DongHo({ kieu }: { kieu: 'bien' | 'ref' }) {\n  const [s, setS] = useState(0);\n  const refId = useRef(0);\n  let bienId = 0;                                                    // ✗ về 0 ở mỗi render\n  const batDau = () => {\n    const id = window.setInterval(() => setS((x) => x + 1), 100);\n    if (kieu === 'ref') refId.current = id; else bienId = id;\n  };\n  const dung = () => clearInterval(kieu === 'ref' ? refId.current : bienId);\n  return (\n    <p>{kieu === 'ref' ? 'useRef' : 'biến thường'}: <b id={`s-${kieu}`}>{s}</b>{' '}\n      <button id={`bd-${kieu}`} onClick={batDau} className=\"rounded border px-2\">bắt đầu</button>{' '}\n      <button id={`dg-${kieu}`} onClick={dung} className=\"rounded border px-2\">dừng</button></p>\n  );\n}\n\n// 4 — cần cả hai: hiện bằng state, bộ hẹn giờ đọc qua ref\nfunction Guong() {\n  const [n, setN] = useState(0);\n  const nRef = useRef(n);\n  useEffect(() => { nRef.current = n; }, [n]);                       // soi gương state → ref\n  useEffect(() => {\n    const id = setInterval(() => { so.cu = n; so.guong = nRef.current; }, 200);\n    return () => clearInterval(id);\n  }, []);                                                            // n ở đây: ảnh chụp lúc mount\n  return <p><button id=\"guong\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">n = {n}</button></p>;\n}\n\nif (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __so: so });   // để đo\n\nexport default function HopRefTrang() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <HopRef />\n      <OFocus />\n      <DongHo kieu=\"bien\" />\n      <DongHo kieu=\"ref\" />\n      <Guong />\n    </div>\n  );\n}\n",
 "n6-1:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|hop-ref'\n✓ Compiled successfully in 213ms\n├ ○ /hop-ref\n$ npx eslint -f json src/app/hop-ref/page.tsx | node tom-eslint.cjs\n10:3 error react-hooks/immutability — Error: This value cannot be modified\n22:44 error react-hooks/refs — Error: Cannot access refs during render\n30:22 error react-hooks/immutability — Error: This value cannot be modified\n30:44 error react-hooks/refs — Error: Cannot access refs during render\n45:50 error react-hooks/immutability — Error: Cannot reassign variable after render completes\n50:42 error react-hooks/immutability — Error: Cannot modify local variables after render completes\n63:6 warn  react-hooks/exhaustive-deps — React Hook useEffect has a missing dependency: 'n'. Either include it or remove the dependency array.",
 "n6-1:file:src/app/ref-web/page.tsx": "'use client';\nimport { useEffect, useRef } from 'react';\nfunction tick() {}\n\nexport default function RefWeb() {\n  const intervalId = useRef<number | null>(null);      // ✓ khai kiểu\n  useEffect(() => {\n    intervalId.current = window.setInterval(tick, 1000);\n    return () => { if (intervalId.current !== null) clearInterval(intervalId.current); };\n  }, []);\n  const inputRef = useRef<HTMLInputElement>(null);     // ✓ kiểu của nút DOM\n  useEffect(() => { inputRef.current?.focus(); }, []);\n  return <input ref={inputRef} />;\n}\n",
 "n6-1:web": "$ npx tsc --noEmit 2>&1 | grep -E 'error TS' | sed 's/^src.app.ref-web.//'\npage.tsx(8,5): error TS2322: Type 'Timeout' is not assignable to type 'null'.\npage.tsx(9,32): error TS2769: No overload matches this call.\npage.tsx(12,21): error TS18047: 'inputRef.current' is possibly 'null'.\npage.tsx(13,22): error TS2554: Expected 1 arguments, but got 0.\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n6-1:file:tom-eslint.cjs": "// tóm tắt ESLint mỗi lỗi một dòng: dòng:cột mức luật — thông điệp\nconst j = JSON.parse(require('fs').readFileSync(0, 'utf8'));\nfor (const m of j[0].messages)\n  console.log(`${m.line}:${m.column} ${m.severity === 2 ? 'error' : 'warn '} ${m.ruleId} — ${m.message.split('\\n')[0]}`);\n",
 "n6-1:mo": "$ curl -s -o /dev/null -w 'next start GET /hop-ref → %{http_code}\\n' localhost:19347/hop-ref\nnext start GET /hop-ref → 200\n$ curl -s -o /dev/null -w 'next dev   GET /hop-ref → %{http_code}\\n' localhost:19346/hop-ref\nnext dev   GET /hop-ref → 200",
 "n6-1:dung": "",
 "anh-nxj-6-1:hr-dau": {
  "url": "http://127.0.0.1:19347/hop-ref",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#ref-tang": [
    24,
    24,
    62,
    30
   ],
   "#state-tang": [
    91,
    24,
    81,
    30
   ],
   "#hien-ref": [
    328,
    27,
    12,
    23
   ],
   "#hien-state": [
    404,
    27,
    12,
    23
   ],
   "#o-ten": [
    24,
    62,
    237,
    30
   ],
   "#s-bien": [
    133,
    103,
    12,
    23
   ],
   "#s-ref": [
    91,
    141,
    12,
    23
   ],
   "#guong": [
    24,
    176,
    59,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-1:hr-3ref": {
  "url": "http://127.0.0.1:19347/hop-ref",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#ref-tang": [
    24,
    24,
    62,
    30
   ],
   "#state-tang": [
    91,
    24,
    81,
    30
   ],
   "#hien-ref": [
    328,
    27,
    12,
    23
   ],
   "#hien-state": [
    404,
    27,
    12,
    23
   ],
   "#o-ten": [
    24,
    62,
    237,
    30
   ],
   "#s-bien": [
    133,
    103,
    12,
    23
   ],
   "#s-ref": [
    91,
    141,
    12,
    23
   ],
   "#guong": [
    24,
    176,
    59,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-1:hr-state": {
  "url": "http://127.0.0.1:19347/hop-ref",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#ref-tang": [
    24,
    24,
    62,
    30
   ],
   "#state-tang": [
    91,
    24,
    81,
    30
   ],
   "#hien-ref": [
    328,
    27,
    12,
    23
   ],
   "#hien-state": [
    403,
    27,
    8,
    23
   ],
   "#o-ten": [
    24,
    62,
    237,
    30
   ],
   "#s-bien": [
    133,
    103,
    12,
    23
   ],
   "#s-ref": [
    91,
    141,
    12,
    23
   ],
   "#guong": [
    24,
    176,
    59,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-1:hr-dongho": {
  "url": "http://127.0.0.1:19347/hop-ref",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#ref-tang": [
    24,
    24,
    62,
    30
   ],
   "#state-tang": [
    91,
    24,
    81,
    30
   ],
   "#hien-ref": [
    328,
    27,
    12,
    23
   ],
   "#hien-state": [
    403,
    27,
    8,
    23
   ],
   "#o-ten": [
    24,
    62,
    237,
    30
   ],
   "#s-bien": [
    133,
    103,
    20,
    23
   ],
   "#s-ref": [
    91,
    141,
    20,
    23
   ],
   "#guong": [
    24,
    176,
    59,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-1:hr-guong": {
  "url": "http://127.0.0.1:19347/hop-ref",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#ref-tang": [
    24,
    24,
    62,
    30
   ],
   "#state-tang": [
    91,
    24,
    81,
    30
   ],
   "#hien-ref": [
    328,
    27,
    12,
    23
   ],
   "#hien-state": [
    403,
    27,
    8,
    23
   ],
   "#o-ten": [
    24,
    62,
    237,
    30
   ],
   "#s-bien": [
    133,
    103,
    24,
    23
   ],
   "#s-ref": [
    91,
    141,
    20,
    23
   ],
   "#guong": [
    24,
    176,
    58,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-1:hr-start": {
  "url": "http://127.0.0.1:19347/hop-ref",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#ref-tang": [
    24,
    24,
    62,
    30
   ],
   "#state-tang": [
    91,
    24,
    81,
    30
   ],
   "#hien-ref": [
    328,
    27,
    12,
    23
   ],
   "#hien-state": [
    403,
    27,
    8,
    23
   ],
   "#o-ten": [
    24,
    62,
    237,
    30
   ],
   "#s-bien": [
    133,
    103,
    20,
    23
   ],
   "#s-ref": [
    91,
    141,
    20,
    23
   ],
   "#guong": [
    24,
    176,
    58,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "dau": {
    "focus": "o-ten",
    "lucRender": "null",
    "trongEffect": "INPUT",
    "render": 1
   },
   "sau3ref": {
    "render": 1,
    "current": 3,
    "manHinh": "0"
   },
   "sauState": {
    "render": 2,
    "current": 3,
    "manHinh": "3",
    "state": "1"
   },
   "hop": {
    "cung": 2,
    "khac": 0
   },
   "dungLuc": {
    "bien": 10,
    "ref": 10
   },
   "sau1s": {
    "bien": 20,
    "ref": 10
   },
   "guong": {
    "manHinh": "n = 5",
    "cu": 0,
    "guong": 5
   }
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, path, br } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-06-1', code: 'NXJ 6.1', title: 'useRef: a value that survives renders', sub: 'Chapter 6 · Lesson 6.1' };
const O = (k) => { const v = DU_LIEU[`n6-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-6-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-06-1', ten, o);
const K = AN('hr-start').ketQua;
const P = O('file:src/app/hop-ref/page.tsx');
for (const s of ['const c = useRef(0);', '{ c.current++; }', '<b id="hien-ref">{c.current}</b>', 'let bienId = 0;', 'refId.current = id; else bienId = id;',
  'useEffect(() => { nRef.current = n; }, [n]);', 'so.cu = n; so.guong = nRef.current;', 'inputRef.current?.focus();'])
  if (!P.includes(s)) throw new Error('hop-ref/page.tsx không có: ' + s);
if (K.dau.render !== 1 || K.dau.focus !== 'o-ten' || K.dau.lucRender !== 'null' || K.dau.trongEffect !== 'INPUT'
  || K.sau3ref.render !== 1 || K.sau3ref.current !== 3 || K.sau3ref.manHinh !== '0' || K.sauState.render !== 2 || K.sauState.manHinh !== '3'
  || K.hop.cung !== 2 || K.hop.khac !== 0 || K.dungLuc.bien !== 10 || K.dungLuc.ref !== 10 || K.sau1s.bien !== 20 || K.sau1s.ref !== 10
  || K.guong.cu !== 0 || K.guong.guong !== 5 || K.guong.manHinh !== 'n = 5')
  throw new Error('số đo 6.1 đổi — xem lại slide');
const TR = O('trang');
const ESL = TR.slice(TR.indexOf('$ npx eslint'));
if (!/22:44 error react-hooks\/refs/.test(ESL) || !/45:50 error react-hooks\/immutability — Error: Cannot reassign variable after render completes/.test(ESL) || !/63:6 warn  react-hooks\/exhaustive-deps/.test(ESL))
  throw new Error('ESLint 6.1 đổi — xem lại slide');
const WEB = O('web');
for (const s of ["TS2322: Type 'Timeout' is not assignable to type 'null'", "TS18047: 'inputRef.current' is possibly 'null'", 'TS2554: Expected 1 arguments, but got 0'])
  if (!WEB.includes(s)) throw new Error('tsc 6.1 đổi: ' + s);
const WEB1 = WEB.slice(0, WEB.indexOf("$ npx tsc --noEmit && echo")).trim();
const WEB2 = WEB.slice(WEB.indexOf("$ npx tsc --noEmit && echo")).trim();

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.1', t: 'useRef: a box that survives<br>every render', sub: 'Write to it any time — React does not re-render. That one property is why it exists',
    en: 'Lesson six point one: useRef. Chapter four used a ref to read a form input. Its full job is wider: a ref is a mutable box whose current property you can read and write at any time, and — crucially — changing it does not cause a render. That single property is what separates it from state.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Ref vs state in one experiment — <b>measured</b>: 3 writes, still 1 render</li>
    <li>What a ref is: the <b>same box</b> on every render (measured), invisible to React</li>
    <li>Job 1 — remember a value invisibly: a timer id in a plain variable vs a ref, <b>measured</b></li>
    <li>Job 2 — reach a DOM node: <code>null</code> during render, the element after commit</li>
    <li>Do not touch refs during render (ESLint catches it) · state + ref together · useRef in TypeScript</li></ul>`,
    en: 'Five takeaways: ref versus state in one measured experiment; what a ref really is — the same box on every render, invisible to React; job one, remembering a value invisibly, with a timer id measured in a plain variable and in a ref; job two, reaching a DOM node; and the rules — no refs during render, state and ref together, and useRef in TypeScript.' },
  { t: 'Ref vs state, in one experiment — measured', body: two(D(tsx(`function HopRef() {
  const c = useRef(0);
  const [n, setN] = useState(0);
  return (<p>
    <button onClick={() => { c.current++; }}>ref +1</button>
    <button onClick={() => setN(n + 1)}>state +1</button>
    ref on screen: <b>{c.current}</b> · state: <b>{n}</b>
  </p>);
}`, { sm: true, hl: [5, 7] }), box('Already met in Lesson 4.4', 'There a ref read a form value. Here we look at the box itself: what changing it does — and does not — trigger.', 'lam')),
      D(cmp(['next start · Chromium', 'renders', 'c.current', 'on screen'], [
        ['after load', K.dau.render, 0, 0],
        ['3 × "ref +1"', `<b>${K.sau3ref.render}</b>`, `<b>${K.sau3ref.current}</b>`, `<b>${K.sau3ref.manHinh}</b>`],
        ['then 1 × "state +1"', `<b>${K.sauState.render}</b>`, K.sauState.current, `<b>${K.sauState.manHinh}</b>`],
      ], { hl: [1] }), B('hr-3ref', { vp: 640, h: 130, w: 520, url: 'localhost:3000/hop-ref · after 3 × "ref +1"', mark: [[328, 27, 12, 23, '']] }),
        box('', 'The box held 3 the whole time. The screen showed it only when <b>something else</b> (the state) re-rendered.', 'xanh')), 'r64'),
    en: 'Ref versus state, measured. One component, one ref and one state. Clicking ref plus one three times: the ref holds three, the component rendered once, and the screen still shows zero. Then one state click: the component renders a second time and the screen jumps to three. If c were state, each click would have re-rendered. That is the whole rule.' },
  { t: 'What a ref is — and what it is not', body: icards([
      ['box', 'A box that survives renders', `<code>useRef(0)</code> returns the <b>same object</b> on every render — measured: ${K.hop.cung} renders, ${K.hop.cung} × same box, ${K.hop.khac} × different. Writing <code>ref.current = 5</code> tells React nothing.`],
      ['power', 'Changing it never re-renders', 'That is the point. Use it for invisible UI values: a timer id, a previous value, a scroll position, a WebSocket instance, a "did I run this?" flag.'],
      ['link', 'Attach it to a DOM node', '<code>&lt;input ref={inputRef} /&gt;</code> — React fills <code>current</code> after commit, so it is <code>null</code> on the first render.'],
      ['eye', 'Read it in handlers and effects', 'Never during render: output that depends on a ref depends on something React does not track.'],
    ], 2) + box('Local variable · state · ref', 'A local variable is reset on every render. State survives and re-renders when it changes. A ref survives and stays <b>silent</b>.', 'lam'),
    en: 'What a ref is, and what it is not. A box that survives renders: useRef returns the same object on every render — we checked it on every render, same box every time. Changing it never re-renders — that is the point, so it holds invisible values like a timer id. Attach it to a DOM node with the ref prop; React fills current after commit. And read it only in handlers and effects.' },
  { t: 'Job 1 — remember a value invisibly: the timer id', body: two(D(tsx(`function DongHo({ kieu }) {
  const [s, setS] = useState(0);
  const refId = useRef(0);
  let bienId = 0;           // ✗ back to 0 on every render
  const batDau = () => {
    const id = setInterval(() => setS((x) => x + 1), 100);
    if (kieu === 'ref') refId.current = id;
    else bienId = id;       // lost at the next render
  };
  const dung = () =>
    clearInterval(kieu === 'ref' ? refId.current : bienId);
}`, { sm: true, hl: [4, 7, 8] }) + box('The rule behind it', 'A value written in one render\'s handler and needed by a <b>later</b> render\'s handler must live outside the render: in a ref (silent) or in state (shown).', 'lam')), D(cmp(['Start → 1 s → Stop', 'at Stop', '1 s later'], [
        ['plain variable', K.dungLuc.bien, `<b>${K.sau1s.bien}</b> ✗ still ticking`],
        ['useRef', K.dungLuc.ref, `<b>${K.sau1s.ref}</b> ✓ stopped`],
      ], { hl: [0] }), B('hr-dongho', { vp: 640, h: 165, w: 520, url: 'localhost:3000/hop-ref · Stop, then 1 s', mark: [[133, 103, 20, 23, ''], [91, 141, 20, 23, '']] }),
        box('Why', 'Every tick re-renders, and every render runs <code>let bienId = 0</code> again. "Stop" belongs to the newest render: it clears id 0 — nothing.', 'do2')), 'r64'),
    en: 'Job one: remember a value invisibly. A stopwatch keeps its interval id two ways. In a plain variable, every tick re-renders, every render resets the variable to zero, so Stop clears nothing: measured, ten at Stop, twenty one second later. In a ref, the box survives: ten at Stop, still ten a second later.' },
  { t: 'Job 2 — reach a DOM node', body: path([{ t: 'render', s: `inputRef.current = ${K.dau.lucRender}` }, { t: 'commit', s: 'React fills current' }, { t: 'effect', s: `current = <${K.dau.trongEffect}> · focus()`, on: true }], { h: 108, fs: 21, nhan: ['', ''] }) +
      two(tsx(`function OFocus() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();   // focus on mount
  }, []);
  return <input ref={inputRef} placeholder="tên" />;
}`, { hl: [2, 4, 6] }), D(B('hr-dau', { vp: 640, h: 100, w: 520, url: 'localhost:3000/hop-ref · just loaded', mark: [[24, 62, 237, 30, 'focused']] }),
        box('Measured in Chromium', `During the first render: <code>${K.dau.lucRender}</code>. Inside the effect: <code>${K.dau.trongEffect}</code>. <code>document.activeElement.id</code> = <code>"${K.dau.focus}"</code>.`, 'xanh')), 'r64') + icards([['eye', 'Focus', '<code>focus()</code> a field on mount or after an error'], ['map', 'Scroll', '<code>scrollIntoView()</code> the new message'],
      ['gauge', 'Measure', '<code>getBoundingClientRect()</code> for a tooltip'], ['power', 'Play / pause', '<code>video.play()</code> from a click handler']], 4),
    en: 'Job two: reach a DOM node. Attach a ref with the ref prop and React fills current with the real node after commit. Measured: during the first render, current is null; inside the effect it is the INPUT element, and after focus the active element is our input. So focus, scroll, measure or play media from an effect or a handler.' },
  { t: 'Do not read or write refs during render — ESLint knows', body: tn(ESL, { fs: 14, wrap: 106, title: `terminal — ${'ESLint · eslint-plugin-react-hooks 7'}` }) + cmp(['Line', 'What it caught'], [
      ['22:44 · 30:44', '<b>react-hooks/refs</b>: reading <code>c.current</code> / <code>inputRef.current</code> while rendering'],
      ['45:50 · 50:42', '<b>react-hooks/immutability</b>: the plain <code>bienId</code> changed after render — the timer bug of the last slide'],
      ['63:6', '<b>exhaustive-deps</b>: the interval reads a stale <code>n</code> (next slide)'],
      ['10:3 · 30:22', 'the lab page\'s own counters (written during render, only to measure)'],
    ], { hl: [0, 1] }) + box('', '<code>next build</code> stayed green (Next 16 does not lint during build) — run <code>npx eslint</code> yourself.', 'lam'),
    en: 'Do not read or write refs during render — and ESLint knows it. Running npx eslint on the lab page: react-hooks refs flags reading c.current and inputRef.current while rendering; react-hooks immutability flags the plain variable changed after render, exactly the stopwatch bug; exhaustive-deps flags a stale value. next build stayed green, because Next sixteen does not lint during build.' },
  { t: 'Need both? Keep it in state, mirror it into a ref', body: two(tsx(`function Guong() {
  const [n, setN] = useState(0);
  const nRef = useRef(n);
  useEffect(() => { nRef.current = n; }, [n]); // mirror
  useEffect(() => {
    const id = setInterval(() => {
      so.cu = n;                 // n of the first render
      so.guong = nRef.current;   // always the latest
    }, 200);
    return () => clearInterval(id);
  }, []);
  return <button onClick={() => setN(n + 1)}>n = {n}</button>;
}`, { sm: true, hl: [4, 7, 8] }), D(cmp(['After 5 clicks', 'value'], [
        ['on screen (state)', `<b>${K.guong.manHinh}</b>`], ['interval reads n', `<b>${K.guong.cu}</b> ✗ snapshot of mount`], ['interval reads nRef.current', `<b>${K.guong.guong}</b> ✓`],
      ], { hl: [1] }),
        box('The trap, the other way round', 'A <b>displayed</b> value in a ref never updates the screen (slide 3). A value read by a timer in state alone is a stale snapshot (Lesson 3.2). Need both? State for the screen, a ref mirrored in an effect for the timer.', 'lam')), 'r64'),
    en: 'Need both? A value shown on screen and also read by a long-running interval. Keep it in state for the screen, and mirror it into a ref inside an effect. Measured after five clicks: the screen shows five; the interval reading n still sees zero, the snapshot of the first render; the interval reading the ref sees five.' },
  { t: 'useRef in TypeScript (React 19) — type-checked', body: two(tn(WEB1, { fs: 14, wrap: 50, title: 'tsc — code copied as written' }),
      D(tsx(`const intervalId = useRef<number | null>(null);
intervalId.current = window.setInterval(tick, 1000);

const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();`, { hl: [1, 4] }), tn(WEB2.split('\n').slice(0, 2).join('\n'), { fs: 15, title: 'tsc — with types' })), 'r64') + cmp(['The ref holds…', 'Write', 'current is…'], [
      ['a DOM element', '<code>useRef&lt;HTMLInputElement&gt;(null)</code>', '<code>HTMLInputElement | null</code> — null until commit'],
      ['a timer id', '<code>useRef&lt;number | null&gt;(null)</code> + <code>window.setInterval</code>', '<code>number | null</code>'],
      ['<i>(no type)</i>', '<code>useRef(null)</code>', '<code>null</code> — nothing else may go in ⇒ TS2322 / TS18047'],
      ['<i>(no argument)</i>', '<code>useRef()</code>', 'React 19 types: TS2554 — pass <code>undefined</code> or a value'],
    ], { hl: [2, 3] }),
    en: 'useRef in TypeScript with React nineteen. The plain snippets of this lesson, type-checked: useRef of null infers the type null, so assigning the interval id fails, clearInterval finds no overload, focus fails because current is possibly null, and useRef with no argument is an error in React nineteen. Give the ref its type — number or null, HTMLInputElement — and use optional chaining: zero errors.' },
  { t: 'State or ref? One mechanical rule', body: cmp(['Ask', 'Use state', 'Use a ref'], [
      ['Does it appear in the JSX?', 'yes — React must re-render to show the new value', 'no'],
      ['Who reads it?', 'the render', 'handlers and effects only'],
      ['Typical values', 'a count shown, input text, open/closed', 'timer id, previous value, scroll position, WebSocket, DOM node'],
      ['Change it ⇒', 're-render', 'nothing — silently remembered'],
    ], { hl: [0] }) + box('If it is in the JSX, it is state', 'If it only exists to survive renders without being shown, it is a ref. A value in a ref that you also display is the classic "screen never updates" bug: DevTools shows the right number, the DOM shows the old one.', 'do2'),
    en: 'State or ref: one mechanical rule. If a value appears in the JSX, it is state, because React must re-render to show it. If it only exists to survive renders without being shown, it is a ref: a timer id, a previous value, a scroll position, a socket, a DOM node. Put a displayed value in a ref and the screen never updates.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('useRef', 'a box with .current that survives renders and never triggers one'), kw('.current', 'where a ref keeps its value'),
      kw('DOM ref', 'ref={node}: reach a real element to focus, measure, scroll'), kw('Mutable value', 'a ref holds a value you change without re-rendering'),
      kw('ref vs state', 'changing state re-renders; changing a ref does not'), kw('No refs in render', 'do not read a ref to build UI — use state'),
      kw('Mirror into a ref', 'state for the screen + a ref updated in an effect for timers'), kw('useRef&lt;T&gt;(null)', 'give the ref its type in TypeScript'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: useRef; dot current; a DOM ref; a mutable value; ref versus state; no refs during render; mirroring state into a ref; and useRef with a type in TypeScript.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Focus an input on mount with ${c('inputRef.current?.focus()')} in an effect`,
      'Store a changing value (previous value or interval id) in a ref and count renders: it does not re-render',
      'Put the interval id in a plain variable instead and press Stop: watch it keep ticking',
      'Compare in one line: changing a ref does not re-render; changing state does',
    ]), box('Keep these', `<ul><li>A ref is the same box on every render</li><li>Writing it never re-renders</li><li>DOM refs are null during render, filled after commit</li><li>Shown in JSX ⇒ state; touched only in handlers/effects ⇒ ref</li></ul>`, 'lam'), ''),
    en: 'Your turn: focus an input on mount; store a previous value or interval id in a ref and count renders; move the id into a plain variable and watch Stop fail; and say in one line how a ref differs from state. Keep: the same box on every render, writing never re-renders, DOM refs are filled after commit, and if it is shown in JSX it is state.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — The hooks toolbox', bai: '6.1' }, S);
