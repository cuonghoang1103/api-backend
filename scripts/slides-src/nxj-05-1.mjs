/*DU_LIEU*/
const DU_LIEU = {
 "n5-1:file:src/app/hieu-ung/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\nfunction ThuTu() {\n  const [n, setN] = useState(0);\n  console.log(`render n=${n}`);\n  useEffect(() => {\n    const dom = document.getElementById('so')!.textContent;\n    console.log(`effect n=${n} · DOM đang hiện ${dom}`);\n    document.title = `Đã bấm ${n} lần`;              // đồng bộ một thứ NGOÀI React\n  }, [n]);\n  return (\n    <p>Đã bấm <b id=\"so\">{n}</b> lần{' '}\n      <button id=\"bam\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">+1</button>\n    </p>\n  );\n}\n\nconst ban = (ms: number) => { const het = performance.now() + ms; while (performance.now() < het) {} };\n\nfunction DoVe() {\n  const [a, setA] = useState(0);\n  useEffect(() => {\n    if (a === 0) return;\n    (window as unknown as { __effect: number }).__effect = performance.now();   // effect bắt đầu lúc nào\n    ban(300);                                                                   // effect bận 300 ms\n  }, [a]);\n  return (\n    <p>a = <b id=\"ve-so\">{a}</b>{' '}\n      <button id=\"ve-bam\" onClick={() => setA(a + 1)} className=\"rounded border px-2\">bấm</button>{' '}\n      <button id=\"ve-hen\" onClick={() => setTimeout(() => setA((x) => x + 1), 0)} className=\"rounded border px-2\">hẹn giờ</button>\n    </p>\n  );\n}\n\nlet demE = 0, demR = 0;   // đếm render (đo dưới next start)\n\nfunction HoTenEffect() {\n  const [ten, setTen] = useState('An');\n  const [hoTen, setHoTen] = useState('');\n  demE++;\n  useEffect(() => { setHoTen('Nguyễn ' + ten); }, [ten]);   // ✗ state dẫn xuất qua effect\n  return <p>effect: <input id=\"ten-e\" value={ten} onChange={(e) => setTen(e.target.value)} className=\"rounded border px-1\" /> → <b id=\"hoten-e\">{hoTen}</b> · render <i id=\"dem-e\">{demE}</i></p>;\n}\n\nfunction HoTenRender() {\n  const [ten, setTen] = useState('An');\n  const hoTen = 'Nguyễn ' + ten;                            // ✓ tính ngay trong lúc render\n  demR++;\n  return <p>render: <input id=\"ten-r\" value={ten} onChange={(e) => setTen(e.target.value)} className=\"rounded border px-1\" /> → <b id=\"hoten-r\">{hoTen}</b> · render <i id=\"dem-r\">{demR}</i></p>;\n}\n\nexport default function HieuUng() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <ThuTu />\n      <DoVe />\n      <HoTenEffect />\n      <HoTenRender />\n    </div>\n  );\n}\n",
 "n5-1:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|render n=|effect n=|hieu-ung'\n✓ Compiled successfully in 930ms\nrender n=0\n├ ○ /hieu-ung\n$ curl -s localhost:19338/hieu-ung | grep -o '<title>[^<]*</title>'\n<title>Create Next App</title>\n$ curl -s localhost:19338/hieu-ung | grep -oE 'id=\"(so|hoten-e|hoten-r)\">[^<]*<'\nid=\"so\">0<\nid=\"hoten-e\"><\nid=\"hoten-r\">Nguyễn An<",
 "anh-nxj-5-1:hu-dau": {
  "url": "http://127.0.0.1:19338/hieu-ung",
  "vp": [
   640,
   190
  ],
  "rect": {
   "#so": [
    92,
    27,
    12,
    23
   ],
   "#bam": [
    139,
    24,
    35,
    30
   ],
   "#ve-so": [
    53,
    65,
    12,
    23
   ],
   "#ve-bam": [
    70,
    62,
    54,
    30
   ],
   "#ve-hen": [
    129,
    62,
    79,
    30
   ],
   "#ten-e": [
    81,
    100,
    237,
    30
   ],
   "#hoten-e": [
    346,
    103,
    96,
    23
   ],
   "#dem-e": [
    512,
    103,
    11,
    23
   ],
   "#ten-r": [
    86,
    138,
    237,
    30
   ],
   "#hoten-r": [
    351,
    141,
    96,
    23
   ],
   "#dem-r": [
    518,
    141,
    7,
    23
   ]
  },
  "console": [
   {
    "kieu": "log",
    "chu": "render n=0"
   },
   {
    "kieu": "log",
    "chu": "effect n=0 · DOM đang hiện 0"
   }
  ]
 },
 "anh-nxj-5-1:hu-sau": {
  "url": "http://127.0.0.1:19338/hieu-ung",
  "vp": [
   640,
   190
  ],
  "rect": {
   "#so": [
    92,
    25,
    12,
    23
   ],
   "#bam": [
    138,
    22,
    35,
    30
   ],
   "#ve-so": [
    53,
    63,
    12,
    23
   ],
   "#ve-bam": [
    69,
    60,
    54,
    30
   ],
   "#ve-hen": [
    128,
    60,
    79,
    30
   ],
   "#ten-e": [
    81,
    98,
    237,
    30
   ],
   "#hoten-e": [
    346,
    101,
    107,
    23
   ],
   "#dem-e": [
    523,
    101,
    11,
    23
   ],
   "#ten-r": [
    86,
    136,
    237,
    30
   ],
   "#hoten-r": [
    351,
    139,
    107,
    23
   ],
   "#dem-r": [
    529,
    139,
    11,
    23
   ]
  },
  "console": [
   {
    "kieu": "log",
    "chu": "render n=0"
   },
   {
    "kieu": "log",
    "chu": "effect n=0 · DOM đang hiện 0"
   },
   {
    "kieu": "log",
    "chu": "render n=1"
   },
   {
    "kieu": "log",
    "chu": "effect n=1 · DOM đang hiện 1"
   },
   {
    "kieu": "log",
    "chu": "render n=2"
   },
   {
    "kieu": "log",
    "chu": "effect n=2 · DOM đang hiện 2"
   }
  ],
  "ketQua": {
   "titleDau": "Create Next App",
   "renderDau": "2 / 1",
   "titleSau": "Đã bấm 2 lần",
   "veBam": {
    "tu": "0",
    "sang": "1",
    "khungMoiTruEffect": 300,
    "veTruoc": false
   },
   "veHen": {
    "tu": "1",
    "sang": "2",
    "khungMoiTruEffect": 300,
    "veTruoc": false
   },
   "tenE": {
    "khung": [
     "An | Nguyễn An",
     "Anh | Nguyễn An",
     "Anh | Nguyễn Anh"
    ],
    "render": "4"
   },
   "tenR": {
    "khung": [
     "An | Nguyễn An",
     "Anh | Nguyễn Anh"
    ],
    "render": "2"
   }
  }
 },
 "anh-nxj-5-1:hu-tatjs": {
  "url": "http://127.0.0.1:19338/hieu-ung",
  "vp": [
   640,
   190
  ],
  "rect": {
   "#so": [
    92,
    27,
    12,
    23
   ],
   "#hoten-e": [
    346,
    103,
    0,
    23
   ],
   "#dem-e": [
    412,
    103,
    7,
    23
   ],
   "#hoten-r": [
    351,
    141,
    96,
    23
   ],
   "#dem-r": [
    518,
    141,
    7,
    23
   ]
  },
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp, vsd, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-05-1', code: 'NXJ 5.1', title: 'What an effect is, and when it runs', sub: 'Chapter 5 · Lesson 5.1' };
const O = (k) => { const v = DU_LIEU[`n5-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-5-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const B = (ten, o) => br('nxj-05-1', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const KQ = AN('hu-sau').ketQua, CON = AN('hu-sau').console.map((x) => x.chu);
const P = O('file:src/app/hieu-ung/page.tsx'), TR = O('trang');
for (const s of ['console.log(`render n=${n}`);', 'document.title = `Đã bấm ${n} lần`;', 'ban(300);', "useEffect(() => { setHoTen('Nguyễn ' + ten); }, [ten]);", "const hoTen = 'Nguyễn ' + ten;"])
  if (!P.includes(s)) throw new Error('hieu-ung/page.tsx không có: ' + s);
if (CON[0] !== 'render n=0' || !CON[1].startsWith('effect n=0') || KQ.titleSau !== 'Đã bấm 2 lần' || KQ.veBam.veTruoc || KQ.veHen.veTruoc || KQ.renderDau !== '2 / 1'
  || KQ.tenE.render !== '4' || KQ.tenR.render !== '2' || KQ.tenE.khung[1] !== 'Anh | Nguyễn An' || !TR.includes('render n=0') || TR.split('npm run build')[1].split('$ curl')[0].split('\n').slice(1).some((l) => l.includes('effect n='))
  || !TR.includes('<title>Create Next App</title>') || !TR.includes('id="hoten-e"><')) throw new Error('số đo 5.1 đổi — xem lại slide');
const lenh = (k) => TR.split('\n').filter((l, i, a) => l.startsWith('$') ? l.includes(k) : a.slice(0, i).reverse().find((x) => x.startsWith('$'))?.includes(k));

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.1', t: 'What an effect is,<br>and when it runs', sub: 'Render computes the UI; an effect reaches outside React — after the DOM has been updated',
    en: 'Lesson five point one: what an effect is, and when it runs. Rendering must stay pure — it only computes the UI. An effect is the one place React gives you to reach outside: a timer, a subscription, the page title. It runs after React has updated the DOM.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why rendering must be pure, and what "an external system" means</li>
    <li>The shape: setup, cleanup, dependency array</li>
    <li>When it runs: render → commit → effect — <b>measured</b> in a real browser</li>
    <li>Effects never run on the server — <b>measured</b> with <code>next build</code> and <code>curl</code></li>
    <li>"After paint" is not a promise — a slow effect delays the screen, <b>measured</b></li>
    <li>The classic misuse: derived state in an effect — <b>measured</b></li></ul>`,
    en: 'Six takeaways: why rendering must be pure and what an external system means; the three-part shape; when it runs — render, commit, effect — measured in a real browser; that effects never run on the server, measured; that “after paint” is not a promise, measured; and the classic misuse, derived state in an effect, measured.' },
  { t: 'Render must be pure — an effect is the escape hatch', body: icards([
      ['cpu', 'Render = a calculation', 'Props + state in, JSX out. Same input ⇒ same output, no outside contact (Lesson 2.4).'],
      ['plug', 'An effect = synchronisation', 'Keeps something <b>outside React</b> in step with your state: a socket, a timer, the tab title, a map widget.'],
      ['clock', 'It runs afterwards', 'React calls it after the render is committed to the DOM — never in the middle of a render.'],
    ], 3) + cmp(['Use an effect ✓', 'Not an effect ✗ — do it elsewhere'], [
      ['subscribe to a WebSocket or an event', 'transform data for display ⇒ compute during render'],
      ['start / stop a timer', 'respond to a click ⇒ the event handler'],
      ['drive a non-React widget (map, chart)', 'derive state from props or state ⇒ compute during render'],
      ['set <code>document.title</code>, call a browser API', 'everything in Lesson 5.4'],
    ]),
    en: 'Render must be pure. A component is a calculation: props and state in, JSX out, no contact with the outside world. But a real app has to talk to things outside React — a WebSocket, a timer, a widget that is not React, the browser tab title. useEffect is the escape hatch for exactly that: it synchronises an external system with your state. What is not an effect: transforming data for display, responding to a click, deriving state — those belong to render or to an event handler.' },
  { t: 'The shape: three parts, three jobs', body: two(tsx(`import { useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const conn = createConnection(roomId);  // setup
    conn.connect();
    return () => conn.disconnect();         // cleanup
  }, [roomId]);                             // dependencies

  return <h1>Welcome to {roomId}</h1>;
}`, { hl: [5, 7, 8] }),
      icards([
        ['power', '1 · Setup', 'The function body — does the effect (open, start, subscribe).'],
        ['trash', '2 · Cleanup (optional)', 'The function it returns — undoes it (close, stop, unsubscribe). Lesson 5.2.'],
        ['list', '3 · Dependency array', `Decides when it runs again. ${c('[roomId]')} ⇒ when roomId changes.`],
      ], 1), 'r64'),
    en: 'The shape. useEffect takes a setup function that does the effect — here, open a connection to the room. That function may return a cleanup function that undoes it — disconnect. And the second argument, the dependency array, decides when the effect runs again: here, whenever roomId changes. Lesson five point two dissects the last two parts; for now, pin down the timing.' },
  { t: 'When it runs: render → commit → effect — measured', body: two(tsx(`function ThuTu() {
  const [n, setN] = useState(0);
  console.log(\`render n=\${n}\`);
  useEffect(() => {
    const dom = document.getElementById('so')!.textContent;
    console.log(\`effect n=\${n} · DOM đang hiện \${dom}\`);
    document.title = \`Đã bấm \${n} lần\`;
  }, [n]);
  return <p>Đã bấm <b id="so">{n}</b> lần <button …>+1</button></p>;
}`, { sm: true, hl: [3, 6, 7] }),
      D(tn(['// Chromium, next start: load, +1 twice', ...CON, `// document.title → "${KQ.titleSau}"`].join('\n'), { fs: 15, title: 'browser console — measured' })), 'r64') +
    path([{ t: '1 · render', s: 'call the function' }, { t: '2 · commit', s: 'DOM updated' }, { t: '3 · effect', s: 'reads the NEW DOM', on: true }], { h: 120, fs: 20 }),
    en: 'When it runs, measured in a real browser. The component logs during render, and logs again inside the effect, reading the number that is on the page. The console shows render n equals zero, then effect n equals zero with the DOM already showing zero; after each click, render then effect again, and the effect always sees the new number. The tab title followed: “Đã bấm 2 lần”. Render, then commit to the DOM, then the effect.' },
  { t: 'Effects never run on the server — measured', body: two(D(tn([...lenh('npm run build'), ...lenh('<title>'), ...lenh('hoten-e')].join('\n'), { fs: 14, wrap: 64, title: 'terminal — build + curl the server HTML' })),
      D(B('hu-tatjs', { vp: 640, h: 170, w: 520, url: 'localhost:3000/hieu-ung · JavaScript OFF', mark: [[320, 100, 100, 28, '']] }),
        box('What the server sends', 'The page is prerendered: render ran at build time and logged <code>render n=0</code>, but <b>no effect line</b>. The HTML title is still the layout\'s — the effect sets it only in the browser, after hydration. A value an effect computes is simply <b>missing</b> from the server HTML.', 'lam'))),
    en: 'Effects never run on the server — measured. The page is prerendered at build time: the build log shows render n equals zero, but no effect line, ever. curl the server HTML: the title is still Create Next App, and the name computed by an effect is an empty tag. With JavaScript off, that is what a visitor or a search engine sees. In Next.js, the first paint is the server HTML; effects only run after hydration.' },
  { t: '"After paint" is not a promise — measured', body: two(tsx(`useEffect(() => {
  if (a === 0) return;
  window.__effect = performance.now();
  ban(300);                 // effect busy for 300 ms
}, [a]);

<button onClick={() => setA(a + 1)}>bấm</button>
<button onClick={() => setTimeout(() =>
  setA((x) => x + 1), 0)}>hẹn giờ</button>`, { sm: true, hl: [4] }),
      D(tn([`click "bấm"     → new value painted ${KQ.veBam.khungMoiTruEffect} ms AFTER the effect started`,
        `click "hẹn giờ" → new value painted ${KQ.veHen.khungMoiTruEffect} ms AFTER the effect started`].join('\n'), { fs: 15, wrap: 52, title: 'measured — Chromium, requestAnimationFrame log' }),
        box('So what is guaranteed?', 'The effect runs <b>after commit</b>: the DOM is already new. Whether the browser paints first is up to React\'s scheduling — here, both times, the frame with the new value waited for the effect. Slow synchronous work in an effect freezes the screen.', 'do2'))) +
    path([{ t: 'click', s: 'setA(a + 1)' }, { t: 'render + commit', s: 'DOM already says 1' }, { t: 'effect', s: 'busy 300 ms', mau: '#c0392b', on: true }, { t: 'paint', s: `+${KQ.veBam.khungMoiTruEffect} ms: screen shows 1` }], { h: 130, fs: 19 }),
    en: 'After paint is not a promise — measured. An effect that busy-waits three hundred milliseconds. We log every animation frame and compare. Clicking the button: the new value reached the screen three hundred milliseconds after the effect started — the effect ran first. Even an update from a timer did the same here. What is guaranteed is that the effect runs after commit, with the DOM already updated. Whether the browser paints first is up to React’s scheduling. So never do slow synchronous work in an effect.' },
  { t: 'The dependency array changes everything', body: cmp(['You write', 'The effect runs', 'Typical use'], [
      [c('useEffect(fn, [x])'), 'after the first render, then again whenever <code>x</code> changes', 'sync with a value — the normal case'],
      [c('useEffect(fn, [])'), 'once, after the first render', 'a subscription that never changes'],
      [c('useEffect(fn)'), 'after <b>every</b> render', 'rarely right — with a setState inside, an infinite loop'],
    ], { hl: [0] }) + box('Not a seasoning — a statement', 'The array lists the values the effect <b>reads</b>. React compares each one with <code>Object.is</code> and skips the effect when nothing changed. Lesson 5.2 measures all three cases, plus the cleanup order.', 'lam'),
    en: 'The dependency array is not optional seasoning; it changes the behaviour completely. With x listed, the effect runs after the first render and again whenever x changes — the normal case. With an empty array, it runs once after the first render. With no array at all, it runs after every render — rarely what you want, and with a setState inside, the classic infinite loop. Lesson five point two measures all three.' },
  { t: 'When an effect is the right tool — and when it is not', body: steps([
      '<b>Rendering stays pure</b> — a component computes JSX from props and state. Anything that touches the outside — a subscription, a timer, a DOM measurement — must not happen during that calculation',
      '<b>An effect runs after commit</b> — React has rendered and updated the DOM, then your effect runs. On a Next.js page the first paint is the server HTML, long before any effect',
      `<b>It is for synchronising with something outside</b> — a WebSocket, a listener on ${c('window')}, a third-party widget, a browser API. "Outside" is the test`,
      '<b>Not for reacting to your own state</b> — transforming data, resetting a field when a prop changes, updating state from other state: those belong to render or to an event handler',
    ]),
    en: 'When an effect is the right tool. Rendering stays pure. An effect runs after commit — and on a Next.js page, the first paint is the server HTML. It is for synchronising with something outside React: a WebSocket, a window listener, a third-party widget, a browser API. Outside is the test. It is not for reacting to your own state — transforming data, resetting a field, updating state from other state belong to render or to a handler.' },
  { t: 'The classic misuse: derived state in an effect — measured', body: two(D(tsx(`// ✗ a second state, kept in sync by an effect
const [hoTen, setHoTen] = useState('');
useEffect(() => { setHoTen('Nguyễn ' + ten); }, [ten]);

// ✓ compute it while rendering
const hoTen = 'Nguyễn ' + ten;`, { sm: true, hl: [3, 6] }),
      B('hu-sau', { vp: 640, h: 180, w: 500, url: 'localhost:3000/hieu-ung · typed "h" in both', mark: [[490, 98, 60, 30, ''], [495, 136, 60, 30, '']] })),
      D(cmp(['Measured (next start)', 'effect', 'render'], [
        ['renders on load', KQ.renderDau.split(' / ')[0], KQ.renderDau.split(' / ')[1]],
        ['renders after typing "h"', String(KQ.tenE.render - KQ.renderDau.split(' / ')[0]), String(KQ.tenR.render - KQ.renderDau.split(' / ')[1])],
        ['server HTML', '(empty)', 'Nguyễn An'],
      ], { hl: [1] }),
        tn(['frames painted (input | name):', ...KQ.tenE.khung.map((k, i) => `  ${i + 1}. ${k}${i === 1 ? '   ← stale frame' : ''}`)].join('\n'), { fs: 15, title: 'effect version — requestAnimationFrame log' }))),
    en: 'The classic misuse, measured. Keeping a full name in a second state and syncing it with an effect works — but it costs an extra render every time: two renders on load instead of one, two per keystroke instead of one. Logging every animation frame shows a frame where the input already says Anh while the name still says Nguyễn An: the stale frame really reaches the screen. And the server HTML has an empty name. Compute it while rendering: one line, always correct.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('useEffect', 'runs code after commit to sync with something outside React'), kw('Side effect', 'anything beyond computing UI: DOM, network, timer, subscription'),
      kw('Pure render', 'same props and state ⇒ same JSX, no outside contact'), kw('Commit', 'React writes the new UI into the real DOM'),
      kw('Dependency array', 'the values the effect reads; decides when it runs again'), kw('Cleanup', 'the function an effect returns to undo itself'),
      kw('Escape hatch', 'a way out of React — not a place for ordinary logic'), kw('Hydration', 'React attaching to the server HTML; effects run only after it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: useEffect; side effect; pure render; commit; dependency array; cleanup; escape hatch; and hydration.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add a ${c('useEffect')} that sets ${c('document.title')} from state; click and watch the tab`,
      'Log once in the component body and once in the effect — read the order in the console',
      'curl your page: is the title from your effect in the HTML? (It should not be)',
      'Name one thing that fits an effect (outside React) and one that does not (a value for render)',
    ]), box('Keep these', `<ul><li>Render computes; an effect reaches outside</li><li>Order: render → commit → effect</li><li>Effects never run on the server</li><li>If you can compute it during render, you do not need an effect</li></ul>`, 'lam'), ''),
    en: 'Your turn: add an effect that sets the document title from state, and watch the tab; log in the body and in the effect, and read the order; curl your page and check the title is not in the HTML; and name one thing that fits an effect and one that does not. Keep: render computes, an effect reaches outside; render, commit, effect; effects never run on the server; and if you can compute it during render, you do not need an effect.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — Effects', bai: '5.1' }, S);
