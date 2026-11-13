/*DU_LIEU*/
const DU_LIEU = {
 "n7-3:file:src/app/vi-sao/page.tsx": "'use client';\nimport { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';\n\nconst dem: Record<string, number> = {};                     // số lần render ĐÃ commit mỗi component — để đo\nconst ms: number[] = [];                                    // thời gian một lần bấm → commit xong (ms)\nif (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __ms: ms });\nfunction useDem(ten: string) {\n  useEffect(() => { dem[ten] = (dem[ten] ?? 0) + 1; });     // không mảng phụ thuộc ⇒ chạy sau MỖI commit\n}\n\n// A — nguyên nhân 2: cha render ⇒ mọi con render, props có đổi hay không\nfunction ConKhongProp() { useDem('conKhongProp'); return <p>con không prop</p>; }\nfunction ConPropCoDinh({ nhan }: { nhan: string }) { useDem('conPropCoDinh'); return <p>con prop cố định: {nhan}</p>; }\nfunction ChaGiuState() {\n  const [n, setN] = useState(0);\n  const t0 = useRef(0);\n  useDem('cha');\n  useLayoutEffect(() => { if (t0.current) ms.push(performance.now() - t0.current); });\n  return (\n    <section id=\"a\" className=\"rounded border p-2\">\n      <button id=\"cha-bam\" onClick={() => { t0.current = performance.now(); setN(n + 1); }} className=\"rounded border px-2\">cha: {n}</button>\n      <ConKhongProp />\n      <ConPropCoDinh nhan=\"cố định\" />\n    </section>\n  );\n}\n\n// B — dời state xuống: chỉ cái nút giữ state, anh em không render\nfunction NutDem() { const [n, setN] = useState(0); useDem('nutDem'); return <button id=\"nut-dem\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">nút: {n}</button>; }\nfunction AnhEm() { useDem('anhEm'); return <p>anh em của nút</p>; }\n\n// C — nguyên nhân 3: context đổi ⇒ chỗ đọc render, dù cha của nó không render\nconst Ctx = createContext(0);\nfunction KhoCtx({ children }: { children: ReactNode }) {\n  const [v, setV] = useState(0);\n  return <Ctx value={v}><button id=\"ctx-bam\" onClick={() => setV(v + 1)} className=\"rounded border px-2\">context: {v}</button>{children}</Ctx>;\n}\nfunction DocCtx() { const v = useContext(Ctx); useDem('docCtx'); return <p>đọc context: {v}</p>; }\nfunction KhongDocCtx() { useDem('khongDocCtx'); return <p>không đọc context</p>; }\n\n// D — nguyên nhân 4: key đổi ⇒ không phải render lại, mà gỡ + gắn\nconst gan = { conKey: 0 };\nif (typeof window !== 'undefined') Object.assign(window, { __gan: gan });\nfunction ConKey() {\n  const [n, setN] = useState(0);\n  useEffect(() => { gan.conKey++; }, []);\n  return <button id=\"con-key\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">state riêng: {n}</button>;\n}\nfunction DoiKey() {\n  const [k, setK] = useState(0);\n  return <p><button id=\"doi-key\" onClick={() => setK(k + 1)} className=\"rounded border px-2\">đổi key</button> <ConKey key={k} /></p>;\n}\n\nexport default function ViSao() {\n  return (\n    <div className=\"grid grid-cols-2 gap-3 p-4 font-sans text-base\">\n      <ChaGiuState />\n      <section id=\"b\" className=\"rounded border p-2\"><NutDem /><AnhEm /></section>\n      <section id=\"c\" className=\"rounded border p-2\"><KhoCtx><DocCtx /><KhongDocCtx /></KhoCtx></section>\n      <section id=\"d\" className=\"rounded border p-2\"><DoiKey /></section>\n    </div>\n  );\n}\n",
 "n7-3:trang": "$ npm run build 2>&1 | grep -E 'Compiled|vi-sao'\n✓ Compiled successfully in 1074ms\n├ ○ /vi-sao\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n7-3:mo": "$ curl -s -o /dev/null -w 'next start GET /vi-sao → %{http_code}\\n' localhost:19361/vi-sao\nnext start GET /vi-sao → 200\n$ curl -s -o /dev/null -w 'next dev GET /vi-sao → %{http_code}\\n' localhost:19362/vi-sao\nnext dev GET /vi-sao → 200",
 "n7-3:dung": "",
 "anh-nxj-7-3:vs-dau": {
  "url": "http://127.0.0.1:19361/vi-sao",
  "vp": [
   640,
   240
  ],
  "rect": {
   "#a": [
    16,
    16,
    298,
    92
   ],
   "#b": [
    326,
    16,
    298,
    92
   ],
   "#c": [
    16,
    120,
    298,
    92
   ],
   "#d": [
    326,
    120,
    298,
    92
   ],
   "#cha-bam": [
    25,
    25,
    64,
    26
   ],
   "#nut-dem": [
    335,
    25,
    61,
    26
   ],
   "#ctx-bam": [
    25,
    129,
    93,
    26
   ],
   "#doi-key": [
    335,
    129,
    70,
    26
   ],
   "#con-key": [
    409,
    129,
    115,
    26
   ]
  },
  "console": []
 },
 "anh-nxj-7-3:vs-sau": {
  "url": "http://127.0.0.1:19361/vi-sao",
  "vp": [
   640,
   240
  ],
  "rect": {
   "#a": [
    16,
    16,
    298,
    92
   ],
   "#b": [
    326,
    16,
    298,
    92
   ],
   "#c": [
    16,
    120,
    298,
    92
   ],
   "#d": [
    326,
    120,
    298,
    92
   ],
   "#cha-bam": [
    25,
    25,
    63,
    26
   ],
   "#nut-dem": [
    335,
    25,
    61,
    26
   ],
   "#ctx-bam": [
    25,
    129,
    92,
    26
   ],
   "#doi-key": [
    335,
    129,
    70,
    26
   ],
   "#con-key": [
    409,
    129,
    115,
    26
   ]
  },
  "console": []
 },
 "anh-nxj-7-3:vs-start": {
  "url": "http://127.0.0.1:19361/vi-sao",
  "vp": [
   640,
   240
  ],
  "rect": {
   "#a": [
    16,
    16,
    298,
    92
   ],
   "#b": [
    326,
    16,
    298,
    92
   ],
   "#c": [
    16,
    120,
    298,
    92
   ],
   "#d": [
    326,
    120,
    298,
    92
   ],
   "#cha-bam": [
    25,
    25,
    63,
    26
   ],
   "#nut-dem": [
    335,
    25,
    61,
    26
   ],
   "#ctx-bam": [
    25,
    129,
    92,
    26
   ],
   "#doi-key": [
    335,
    129,
    70,
    26
   ],
   "#con-key": [
    409,
    129,
    115,
    26
   ]
  },
  "console": [],
  "ketQua": {
   "dem0": {
    "conKhongProp": 1,
    "conPropCoDinh": 1,
    "cha": 1,
    "nutDem": 1,
    "anhEm": 1,
    "docCtx": 1,
    "khongDocCtx": 1
   },
   "demA": {
    "conKhongProp": 4,
    "conPropCoDinh": 4,
    "cha": 4,
    "nutDem": 1,
    "anhEm": 1,
    "docCtx": 1,
    "khongDocCtx": 1
   },
   "moA": [
    "text 0→1 @cha-bam",
    "text 1→2 @cha-bam",
    "text 2→3 @cha-bam"
   ],
   "msA": [
    0.40000003576278687,
    0.30000001192092896,
    0.19999998807907104
   ],
   "demB": {
    "conKhongProp": 4,
    "conPropCoDinh": 4,
    "cha": 4,
    "nutDem": 4,
    "anhEm": 1,
    "docCtx": 1,
    "khongDocCtx": 1
   },
   "demC": {
    "conKhongProp": 4,
    "conPropCoDinh": 4,
    "cha": 4,
    "nutDem": 4,
    "anhEm": 1,
    "docCtx": 4,
    "khongDocCtx": 1
   },
   "key0": "state riêng: 2",
   "gan0": {
    "conKey": 1
   },
   "key1": "state riêng: 0",
   "gan1": {
    "conKey": 2
   }
  }
 },
 "anh-nxj-7-3:vs-dev": {
  "url": "http://127.0.0.1:19362/vi-sao",
  "vp": [
   640,
   240
  ],
  "rect": {
   "#a": [
    16,
    16,
    298,
    92
   ],
   "#b": [
    326,
    16,
    298,
    92
   ],
   "#c": [
    16,
    120,
    298,
    92
   ],
   "#d": [
    326,
    120,
    298,
    92
   ],
   "#cha-bam": [
    25,
    25,
    63,
    26
   ],
   "#nut-dem": [
    335,
    25,
    61,
    26
   ],
   "#ctx-bam": [
    25,
    129,
    92,
    26
   ],
   "#doi-key": [
    335,
    129,
    70,
    26
   ],
   "#con-key": [
    409,
    129,
    115,
    26
   ]
  },
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   }
  ],
  "ketQua": {
   "dem0": {
    "conKhongProp": 2,
    "conPropCoDinh": 2,
    "cha": 2,
    "nutDem": 2,
    "anhEm": 2,
    "docCtx": 2,
    "khongDocCtx": 2
   },
   "demA": {
    "conKhongProp": 5,
    "conPropCoDinh": 5,
    "cha": 5,
    "nutDem": 2,
    "anhEm": 2,
    "docCtx": 2,
    "khongDocCtx": 2
   },
   "moA": [
    "text 0→1 @cha-bam",
    "text 1→2 @cha-bam",
    "text 2→3 @cha-bam"
   ],
   "msA": [
    1,
    0.5999999642372131,
    0.5999999642372131
   ],
   "demB": {
    "conKhongProp": 5,
    "conPropCoDinh": 5,
    "cha": 5,
    "nutDem": 5,
    "anhEm": 2,
    "docCtx": 2,
    "khongDocCtx": 2
   },
   "demC": {
    "conKhongProp": 5,
    "conPropCoDinh": 5,
    "cha": 5,
    "nutDem": 5,
    "anhEm": 2,
    "docCtx": 5,
    "khongDocCtx": 2
   },
   "key0": "state riêng: 2",
   "gan0": {
    "conKey": 2
   },
   "key1": "state riêng: 0",
   "gan1": {
    "conKey": 4
   }
  }
 },
 "anh-nxj-7-3:vs-a": {
  "url": "http://127.0.0.1:19361/vi-sao",
  "vp": [
   640,
   240
  ],
  "rect": {
   "#a": [
    16,
    16,
    298,
    92
   ],
   "#b": [
    326,
    16,
    298,
    92
   ],
   "#c": [
    16,
    120,
    298,
    92
   ],
   "#d": [
    326,
    120,
    298,
    92
   ],
   "#cha-bam": [
    25,
    25,
    63,
    26
   ],
   "#nut-dem": [
    335,
    25,
    61,
    26
   ],
   "#ctx-bam": [
    25,
    129,
    93,
    26
   ],
   "#doi-key": [
    335,
    129,
    70,
    26
   ],
   "#con-key": [
    409,
    129,
    115,
    26
   ]
  },
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, zm, meter, flow, hub } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-07-3', code: 'NXJ 7.3', title: 'Why a component re-renders', sub: 'Chapter 7 · Lesson 7.3' };
const O = (k) => { const v = DU_LIEU[`n7-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-7-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-07-3', ten, o);
const S0 = AN('vs-start').ketQua, DV = AN('vs-dev').ketQua;
const P = O('file:src/app/vi-sao/page.tsx');
for (const s of ['useEffect(() => { dem[ten] = (dem[ten] ?? 0) + 1; });', '<ConPropCoDinh nhan="cố định" />', '<KhoCtx><DocCtx /><KhongDocCtx /></KhoCtx>', '<ConKey key={k} />'])
  if (!P.includes(s)) throw new Error('vi-sao/page.tsx không có: ' + s);
const J = (a) => JSON.stringify(a);
const A3 = S0.demA, B3 = S0.demB, C3 = S0.demC;
if (A3.cha !== 4 || A3.conKhongProp !== 4 || A3.conPropCoDinh !== 4 || A3.nutDem !== 1 || B3.nutDem !== 4 || B3.anhEm !== 1 || C3.docCtx !== 4 || C3.khongDocCtx !== 1
  || J(S0.moA) !== J(['text 0→1 @cha-bam', 'text 1→2 @cha-bam', 'text 2→3 @cha-bam']) || S0.key0 !== 'state riêng: 2' || S0.key1 !== 'state riêng: 0' || S0.gan0.conKey !== 1 || S0.gan1.conKey !== 2
  || DV.dem0.cha !== 2 || DV.demA.conKhongProp !== 5 || DV.demB.anhEm !== 2) throw new Error('số đo 7.3 đổi');
const ms = (a) => a.map((x) => x.toFixed(1)).join(' · ');
const MS = ms(S0.msA), MSD = ms(DV.msA), MAX = Math.max(...S0.msA).toFixed(1);

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.3', t: 'Why a component re-renders', sub: 'Three causes (plus a fourth that is not a re-render at all) — measured before optimising anything',
    en: 'Lesson seven point three: why a component re-renders. Before you optimise anything you need to know what actually causes a re-render. There are exactly three causes, and the second one surprises people most: a component re-renders whenever its parent does, whether or not its props changed.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The causes: own state · parent rendered · context changed — and a key change, which is a remount</li>
    <li>Cause 2, measured: every child re-renders with its parent, props or not</li>
    <li>"Re-render" ≠ "DOM update" — a <code>MutationObserver</code> and a stopwatch say how cheap it was</li>
    <li>The first fix is structural: state lower = smaller re-render radius (measured)</li>
    <li>Measure duration, not count — and measure on <code>next start</code></li></ul>`,
    en: 'Five takeaways: the causes of a re-render, and the key change that is really a remount; cause two, measured; a re-render is not a DOM update; the first fix is moving state down; and measure duration, not count, on a production build.' },
  { t: 'The causes', body: two(icards([
      ['box', '1 · its own state', 'a setter ran with a new value (Chapter 3)'], ['tree', '2 · its parent rendered', 'by default all children render, recursively'],
      ['link', '3 · a context it reads', 'every consumer renders when the value changes (6.4)'], ['warn', '4 · its key changed', 'not a re-render: unmount + mount, state lost'],
    ], 2), D(cmp(['Measured on next start, 3 clicks each', 'renders'], [
      ['parent with state → child without props', `${A3.conKhongProp}`], ['state moved into the button → its sibling', `${B3.anhEm}`],
      ['context value changed → the consumer', `${C3.docCtx}`], ['… → a sibling that does not read it', `${C3.khongDocCtx}`],
    ], { hl: [0] }), box('Counting', 'Each component counts committed renders in a <code>useEffect</code> with no dependency array — it runs after every commit.', 'lam')), ''),
    en: 'The causes. One: its own state changed — a setter ran with a new value. Two: its parent rendered — by default React renders all of a component\'s children, recursively. Three: a context it reads changed. And a fourth that is not a re-render at all: its key changed, which is an unmount and a mount. The numbers on the right are measured on next start.' },
  { t: 'Cause 2: the parent renders → every child renders', body: tsx(`function ChaGiuState() {
  const [n, setN] = useState(0);
  return <section>
    <button onClick={() => setN(n + 1)}>cha: {n}</button>
    <ConKhongProp />                  {/* no props */}
    <ConPropCoDinh nhan="cố định" />  {/* props never change */}
  </section>;
}`, { sm: true, hl: [5, 6] }) +
      two(D(cmp(['After 3 clicks on "cha"', 'committed renders'], [['ChaGiuState', `${A3.cha}`], ['ConKhongProp (no props)', `<b>${A3.conKhongProp}</b>`], ['ConPropCoDinh (props unchanged)', `<b>${A3.conPropCoDinh}</b>`]], { hl: [1, 2] }),
        box('1 + 3', 'One render at load, plus one per click — for the parent <i>and</i> both children. Props did not matter.', 'do2')),
        B('vs-sau', { vp: 640, h: 112, w: 440, url: 'next start · /vi-sao', mark: [[16, 16, 298, 92, '']] }), 'r64'),
    en: 'Cause two, measured. A parent holds a counter and renders two children: one with no props, one with a prop that never changes. Three clicks: the parent rendered four times — one at load plus one per click — and so did both children. Their props did not matter. When a component renders, React renders its whole subtree by default.' },
  { t: '"Re-render" is not "DOM update"', body: two(D(flow([{ t: 'render', s: 'call the function', mau: '#0070f3' }, { t: 'reconcile', s: 'compare' }, { t: 'commit', s: 'write the difference', mau: '#15803d' }], { w: 620, h: 130, fs: 20 }),
      box('What a re-render is', 'Calling the component function again to get a new description. Most re-renders produce an identical description; React compares, finds nothing new, and leaves the DOM alone.', 'lam')),
      tn(S0.moA.join('\n'), { fs: 17, title: 'MutationObserver on section A — 3 clicks' }), '') +
      zm(cmp(['3 clicks on "cha" · section A', 'measured on next start'], [
        ['components rendered', `3 components × 3 clicks = <b>9</b> renders`], ['DOM records (MutationObserver)', `<b>${S0.moA.length}</b> — only the counter text`], ['click → commit, per click', `<b>${MS} ms</b> (on the course machine)`],
      ], { hl: [1] }), 1.1),
    en: 'A re-render is not a DOM update. It means calling the component function again to get a new description. Measured: three clicks rendered three components three times — nine renders — but the mutation observer saw only three records, the counter text. Each click, render plus commit, took well under one millisecond on the course machine. Re-rendering is much cheaper than beginners fear.' },
  { t: 'When re-rendering actually becomes a problem', body: icards([
      ['gauge', 'An expensive render', 'it sorts a big list, does heavy computation, or renders thousands of nodes'],
      ['bolt', 'Frequent', 'it re-renders on every keystroke, scroll or tick'],
      ['eye', 'With no visible change', 'the output is the same each time — the work is wasted'],
    ], 3) + two(box('State as low as possible', 'Keep state in the smallest component that needs it (Chapter 3). A setter high in the tree re-renders everything below it; a setter in a leaf re-renders only the leaf.', 'xanh'),
      box('Most re-renders are free', 'Don\'t optimise a re-render you have not measured. A cheap component re-rendering often costs nothing worth fixing.', 'lam'), ''),
    en: 'When re-rendering becomes a problem: only when a render is expensive — a big sort, heavy computation, thousands of nodes — and it happens often, with no visible change. That narrow case is what the next lesson\'s tool targets. Two guiding facts: keep state as low as possible, and most re-renders are free — don\'t optimise one you have not measured.' },
  { t: 'The first fix: move state down — measured', body: tsx(`// state lives in the button that uses it
function NutDem() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>nút: {n}</button>;
}
function AnhEm() { return <p>anh em của nút</p>; }

<section><NutDem /><AnhEm /></section>`, { sm: true, hl: [3] }) +
      meter([['state in the parent: each child', A3.conKhongProp, '#b91c1c'], ['state in the button: its sibling', B3.anhEm, '#15803d']], { don: 'renders (3 clicks)', w: 1000, nhan: 360, rh: 50 }) +
        box('Smaller radius', 'The tool against "too many re-renders" is not <code>React.memo</code> — it is where you put state. Reach for memoisation only when structure is not enough and a profiler proves a real cost.', 'xanh'),
    en: 'The first fix is structural: move state down. Here the count lives in the button that uses it. Three clicks: the button rendered four times, its sibling only once — at load. Compare four for every child when the parent held the state. Lower state means a smaller re-render radius. Memoisation comes later, and only when a profiler proves a real cost.' },
  { t: 'Cause 3: context — and the children trick', body: tsx(`const Ctx = createContext(0);
function KhoCtx({ children }) {
  const [v, setV] = useState(0);
  return <Ctx value={v}>
    <button onClick={() => setV(v + 1)}>context: {v}</button>
    {children}
  </Ctx>;
}
function DocCtx() { const v = useContext(Ctx); … }
// page:
<KhoCtx><DocCtx /><KhongDocCtx /></KhoCtx>`, { sm: true, hl: [6, 9, 11] }) +
      two(cmp(['3 clicks on "context"', 'renders'], [['DocCtx (reads the context)', `<b>${C3.docCtx}</b>`], ['KhongDocCtx (does not read it)', `<b>${C3.khongDocCtx}</b>`]], { hl: [0] }),
        box('Why KhongDocCtx stayed at 1', '<code>children</code> was created by the <b>page</b>, which did not re-render. A subtree passed as children does not re-render when the wrapper\'s state changes — only the context consumer inside it does.', 'xanh'), ''),
    en: 'Cause three: context. A wrapper holds a value in state, provides it, and receives its content as children. Three clicks: the component that reads the context rendered four times; its sibling that does not read it stayed at one. The children were created by the page, which did not re-render — so only the consumer was pulled in. That children trick reappears in lesson seven point five.' },
  { t: 'Cause 4: a key change is not a re-render', body: tsx(`function ConKey() {
  const [n, setN] = useState(0);
  useEffect(() => { gan.conKey++; }, []);   // counts mounts
  return <button onClick={() => setN(n + 1)}>state riêng: {n}</button>;
}
function DoiKey() {
  const [k, setK] = useState(0);
  return <><button onClick={() => setK(k + 1)}>đổi key</button>
    <ConKey key={k} /></>;
}`, { sm: true, hl: [9] }) +
      two(cmp(['', 'shows', 'mounts'], [['after 2 clicks inside', S0.key0, `${S0.gan0.conKey}`], ['after "đổi key"', `<b>${S0.key1}</b>`, `<b>${S0.gan1.conKey}</b>`]], { hl: [1] }),
        box('Unmount + mount', 'A new key is a new component as far as React is concerned (7.2): state does not survive, mount effects run again.', 'do2'), ''),
    en: 'Cause four — which is not a re-render at all. Click the inner button twice: its own state is two, mounted once. Change its key: the state is back to zero and the mount counter says two. A new key means unmount and a fresh mount, exactly like lesson seven point two.' },
  { t: 'Count on next start — dev doubles the mount', body: cmp(['Section A', 'next start', 'next dev'], [
      ['effect runs right after load', `${S0.dem0.cha}`, `<b>${DV.dem0.cha}</b> (Strict Mode)`],
      ['after 3 clicks (each child)', `${A3.conKhongProp}`, `${DV.demA.conKhongProp}`],
      ['click → commit (ms)', MS, MSD],
    ], { hl: [0] }) + two(box('Same causes, different numbers', 'Strict Mode runs every mount effect twice in dev (5.3) and dev React does extra checks, so each commit is slower. The <b>causes</b> are identical; the <b>counts and timings</b> are not.', 'lam'),
      box('Rule', 'Read "why did this render?" anywhere; read <b>how many and how long</b> on <code>next build && next start</code>.', 'xanh'), ''),
    en: 'Count on next start. Under next dev, Strict Mode runs every mount effect twice, so every counter starts at two, and each click takes longer because dev React does extra checks. The causes are the same in both modes; the numbers are not. Ask why something rendered anywhere; measure how many and how long on a production build.' },
  { t: 'Pitfall: optimising by render COUNT', body: two(D(meter([['40 renders × 0.2 ms', 8, '#15803d', 'fine'], ['2 renders × 300 ms', 600, '#b91c1c', 'problem']], { don: 'ms', w: 600, nhan: 210, rh: 50 }),
      box('Measure duration, not frequency', 'The React DevTools profiler shows how many milliseconds each render took. "This component rendered 40 times" sounds alarming and usually costs nothing.', 'lam')),
      box('Sprinkling memo everywhere', 'Optimising by count leads to <code>memo</code> and <code>useCallback</code> on everything: more comparisons, more code — often slower. Lesson 7.4 shows when <code>memo</code> pays; 7.5 shows how to measure first.', 'do2'), ''),
    en: 'The pitfall: assuming every re-render is a performance problem. "This component rendered forty times" sounds alarming and usually costs nothing: forty renders at zero point two milliseconds is eight milliseconds. Two renders at three hundred milliseconds is the real problem. Measure duration, not frequency — optimising by count leads to memo everywhere, more comparisons and often slower code.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Re-render', 'React calls a component again to recompute its UI'), kw('State change', 'the component\'s own state updates — it re-renders'),
      kw('Parent render', 'a parent re-render re-renders its children by default'), kw('Context change', 'consumers re-render when the context value changes'),
      kw('Unchanged props', 'a child still re-renders with its parent unless memoised'), kw('Move state down', 'push state to where it is used to shrink the radius'),
      kw('Render ≠ commit', 'rendering computes; only differences reach the DOM'), kw('Key change', 'not a re-render: unmount + mount'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: re-render; state change; parent render; context change; unchanged props; moving state down; render is not commit; and a key change.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Count renders in a child (${c('useEffect')} with no deps) and confirm it re-renders with its parent even when its props don't change`,
      'Move the state down into the component that uses it — watch the siblings stop re-rendering',
      `Put a ${c('MutationObserver')} on the subtree: renders vs DOM records`,
      `Change a ${c('key')} and count mounts; then repeat the counts on ${c('next start')}`,
    ]), box('Keep these', `<ul><li>State · parent · context (· key = remount)</li><li>Children render with the parent by default</li><li>Re-render ≠ DOM write; usually cheap</li><li>Lower state first; measure before memo</li></ul>`, 'lam'), ''),
    en: 'Your turn: count renders in a child and confirm it re-renders with its parent; move the state down and watch the siblings stop; compare renders with DOM records using a mutation observer; and change a key and count mounts, on next start. Keep: three causes plus the key remount; children render with the parent by default; a re-render is not a DOM write; lower state first, measure before memo.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Lists, keys & render performance', bai: '7.3' }, S);
