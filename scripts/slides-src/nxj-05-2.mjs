/*DU_LIEU*/
const DU_LIEU = {
 "n5-2:file:src/app/phu-thuoc/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\nconst dem = { khong: 0, rong: 0, coA: 0 };\n\nfunction BaTruongHop({ a, b }: { a: number; b: number }) {\n  useEffect(() => { dem.khong++; });            // không mảng ⇒ sau MỖI render\n  useEffect(() => { dem.rong++; }, []);         // mảng rỗng ⇒ một lần\n  useEffect(() => { dem.coA++; }, [a]);         // [a] ⇒ khi a đổi\n  return <p id=\"ba\">a={a} b={b}</p>;\n}\n\nconst nhatKy: string[] = [];\nfunction VongDoi({ dep }: { dep: number }) {\n  useEffect(() => {\n    nhatKy.push(`effect ${dep}`);\n    return () => { nhatKy.push(`cleanup ${dep}`); };\n  }, [dep]);\n  return <p>dep = {dep}</p>;\n}\n\nconst nhip = { tick: 0 };\nfunction DongHo({ donDep }: { donDep: boolean }) {\n  useEffect(() => {\n    const id = setInterval(() => { nhip.tick++; }, 100);\n    if (donDep) return () => clearInterval(id);  // ✓ cleanup khớp setup\n  }, [donDep]);                                   // ✗ thiếu cleanup ⇒ interval cũ chạy mãi\n  return <span>⏱</span>;\n}\n\nconst demObj = { obj: 0, so: 0 };\nfunction PhongChat({ room, b }: { room: string; b: number }) {\n  const opt = { room };                             // object mới MỖI render\n  useEffect(() => { demObj.obj++; }, [opt]);        // ✗ luôn \"đã đổi\"\n  useEffect(() => { demObj.so++; }, [opt.room]);    // ✓ so chuỗi\n  return <span id=\"pc\">{room} {b}</span>;\n}\n\nfunction TimKiem() {\n  const [query, setQuery] = useState('a');\n  const [kq, setKq] = useState('');\n  useEffect(() => {\n    const id = setInterval(() => setKq(`tìm \"${query}\"`), 200);\n    return () => clearInterval(id);\n  }, []);                                           // ✗ thiếu query ⇒ đóng băng ở 'a'\n  return <p><input id=\"q\" value={query} onChange={(e) => setQuery(e.target.value)} className=\"rounded border px-1\" /> <b id=\"tk\">{kq}</b></p>;\n}\n\nif (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __nhatKy: nhatKy, __nhip: nhip, __demObj: demObj });   // để đo\n\nexport default function PhuThuoc() {\n  const [a, setA] = useState(0);\n  const [b, setB] = useState(0);\n  const [dep, setDep] = useState(1);\n  const [coVD, setCoVD] = useState(true);\n  const [dh, setDh] = useState<'' | 'thieu' | 'du'>('');\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <BaTruongHop a={a} b={b} />\n      <button id=\"a1\" onClick={() => setA(a + 1)} className=\"rounded border px-2\">a+1</button>{' '}\n      <button id=\"b1\" onClick={() => setB(b + 1)} className=\"rounded border px-2\">b+1</button>\n      <div>{coVD && <VongDoi dep={dep} />}\n        <button id=\"d1\" onClick={() => setDep(1)} className=\"rounded border px-2\">dep=1</button>{' '}\n        <button id=\"d2\" onClick={() => setDep(2)} className=\"rounded border px-2\">dep=2</button>{' '}\n        <button id=\"go\" onClick={() => setCoVD(false)} className=\"rounded border px-2\">gỡ</button></div>\n      <div>{dh && <DongHo key={dh + b} donDep={dh === 'du'} />}\n        <button id=\"thieu\" onClick={() => setDh('thieu')} className=\"rounded border px-2\">đồng hồ thiếu cleanup</button>{' '}\n        <button id=\"du\" onClick={() => setDh('du')} className=\"rounded border px-2\">đồng hồ đủ cleanup</button>{' '}\n        <button id=\"tat\" onClick={() => setDh('')} className=\"rounded border px-2\">tắt</button></div>\n      <PhongChat room=\"react\" b={b} />\n      <TimKiem />\n    </div>\n  );\n}\n",
 "n5-2:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint src/app/phu-thuoc/page.tsx\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/phu-thuoc/page.tsx\n  33:9  warning  The 'opt' object makes the dependencies of useEffect Hook (at line 34) change on every render. To fix this, wrap the initialization of 'opt' in its own useMemo() Hook                                                    react-hooks/exhaustive-deps\n  45:6  warning  React Hook useEffect has a missing dependency: 'query'. Either include it or remove the dependency array. You can also replace multiple useState variables with useReducer if 'setKq' needs the current value of 'query'  react-hooks/exhaustive-deps\n\n✖ 2 problems (0 errors, 2 warnings)\n$ npm run build 2>&1 | grep -E 'Compiled|phu-thuoc'\n✓ Compiled successfully in 326ms\n├ ○ /phu-thuoc\n$ curl -s -o /dev/null -w 'GET /phu-thuoc → %{http_code}\\n' localhost:19339/phu-thuoc\nGET /phu-thuoc → 200",
 "n5-2:mo": "",
 "n5-2:dung": "",
 "anh-nxj-5-2:pt-ba": {
  "url": "http://127.0.0.1:19339/phu-thuoc",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#ba": [
    24,
    24,
    592,
    28
   ],
   "#a1": [
    24,
    60,
    45,
    30
   ],
   "#b1": [
    73,
    60,
    46,
    30
   ],
   "#d1": [
    24,
    126,
    66,
    30
   ],
   "#d2": [
    94,
    126,
    70,
    30
   ],
   "#go": [
    169,
    126,
    39,
    30
   ],
   "#thieu": [
    24,
    164,
    202,
    30
   ],
   "#du": [
    230,
    164,
    181,
    30
   ],
   "#tat": [
    416,
    164,
    42,
    30
   ],
   "#pc": [
    24,
    204,
    58,
    23
   ],
   "#q": [
    24,
    230,
    237,
    30
   ],
   "#tk": [
    266,
    233,
    58,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "demTai": "{\"khong\":1,\"rong\":1,\"coA\":1}",
   "objTai": "{\"obj\":1,\"so\":1}",
   "demSau": "{\"khong\":4,\"rong\":1,\"coA\":2}",
   "objSau": "{\"obj\":4,\"so\":1}"
  }
 },
 "anh-nxj-5-2:pt-vong": {
  "url": "http://127.0.0.1:19339/phu-thuoc",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#ba": [
    24,
    24,
    592,
    28
   ],
   "#a1": [
    24,
    60,
    45,
    30
   ],
   "#b1": [
    73,
    60,
    46,
    30
   ],
   "#d1": [
    24,
    98,
    66,
    30
   ],
   "#d2": [
    94,
    98,
    70,
    30
   ],
   "#go": [
    169,
    98,
    39,
    30
   ],
   "#thieu": [
    24,
    136,
    202,
    30
   ],
   "#du": [
    230,
    136,
    181,
    30
   ],
   "#tat": [
    416,
    136,
    42,
    30
   ],
   "#pc": [
    24,
    176,
    54,
    23
   ],
   "#q": [
    24,
    202,
    237,
    30
   ],
   "#tk": [
    266,
    205,
    58,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "nk0": "[\"effect 1\"]",
   "nk1": "[\"effect 1\"]",
   "nk2": "[\"effect 1\",\"cleanup 1\",\"effect 2\"]",
   "nk3": "[\"effect 1\",\"cleanup 1\",\"effect 2\",\"cleanup 2\"]"
  }
 },
 "anh-nxj-5-2:pt-thieu": {
  "url": "http://127.0.0.1:19339/phu-thuoc",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#ba": [
    24,
    24,
    592,
    28
   ],
   "#a1": [
    24,
    60,
    45,
    30
   ],
   "#b1": [
    73,
    60,
    46,
    30
   ],
   "#d1": [
    24,
    126,
    66,
    30
   ],
   "#d2": [
    94,
    126,
    70,
    30
   ],
   "#go": [
    169,
    126,
    39,
    30
   ],
   "#thieu": [
    24,
    164,
    202,
    30
   ],
   "#du": [
    230,
    164,
    181,
    30
   ],
   "#tat": [
    416,
    164,
    42,
    30
   ],
   "#pc": [
    24,
    204,
    58,
    23
   ],
   "#q": [
    24,
    230,
    237,
    30
   ],
   "#tk": [
    266,
    233,
    58,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "nhipDangChay": 40,
   "nhipSauTat": 40
  }
 },
 "anh-nxj-5-2:pt-du": {
  "url": "http://127.0.0.1:19339/phu-thuoc",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#ba": [
    24,
    24,
    592,
    28
   ],
   "#a1": [
    24,
    60,
    45,
    30
   ],
   "#b1": [
    73,
    60,
    46,
    30
   ],
   "#d1": [
    24,
    126,
    66,
    30
   ],
   "#d2": [
    94,
    126,
    70,
    30
   ],
   "#go": [
    169,
    126,
    39,
    30
   ],
   "#thieu": [
    24,
    164,
    202,
    30
   ],
   "#du": [
    230,
    164,
    181,
    30
   ],
   "#tat": [
    416,
    164,
    42,
    30
   ],
   "#pc": [
    24,
    204,
    58,
    23
   ],
   "#q": [
    24,
    230,
    237,
    30
   ],
   "#tk": [
    266,
    233,
    58,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "nhipDangChay": 10,
   "nhipSauTat": 0
  }
 },
 "anh-nxj-5-2:pt-tk": {
  "url": "http://127.0.0.1:19339/phu-thuoc",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#ba": [
    24,
    24,
    592,
    28
   ],
   "#a1": [
    24,
    60,
    45,
    30
   ],
   "#b1": [
    73,
    60,
    46,
    30
   ],
   "#d1": [
    24,
    126,
    66,
    30
   ],
   "#d2": [
    94,
    126,
    70,
    30
   ],
   "#go": [
    169,
    126,
    39,
    30
   ],
   "#thieu": [
    24,
    164,
    202,
    30
   ],
   "#du": [
    230,
    164,
    181,
    30
   ],
   "#tat": [
    416,
    164,
    42,
    30
   ],
   "#pc": [
    24,
    204,
    59,
    23
   ],
   "#q": [
    24,
    230,
    237,
    30
   ],
   "#tk": [
    266,
    233,
    58,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "tk": "abc → tìm \"a\""
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp, path, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-05-2', code: 'NXJ 5.2', title: 'Dependencies & cleanup', sub: 'Chapter 5 · Lesson 5.2' };
const O = (k) => { const v = DU_LIEU[`n5-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-5-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const B = (ten, o) => br('nxj-05-2', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const J = (s) => JSON.parse(s);
const BA = AN('pt-ba').ketQua, VD = AN('pt-vong').ketQua, TH = AN('pt-thieu').ketQua, DU = AN('pt-du').ketQua, TK = AN('pt-tk').ketQua.tk;
const P = O('file:src/app/phu-thuoc/page.tsx'), TR = O('trang');
const S0 = J(BA.demSau), OB = J(BA.objSau), NK = J(VD.nk3);
for (const s of ['useEffect(() => { dem.khong++; });', 'useEffect(() => { dem.rong++; }, []);', 'useEffect(() => { dem.coA++; }, [a]);', "return () => { nhatKy.push(`cleanup ${dep}`); };",
  'if (donDep) return () => clearInterval(id);', 'const opt = { room };', '}, []);                                           // ✗ thiếu query'])
  if (!P.includes(s)) throw new Error('phu-thuoc/page.tsx không có: ' + s);
if (S0.khong !== 4 || S0.rong !== 1 || S0.coA !== 2 || OB.obj !== 4 || OB.so !== 1 || NK.join() !== 'effect 1,cleanup 1,effect 2,cleanup 2' || VD.nk1 !== VD.nk0
  || TH.nhipDangChay !== 40 || TH.nhipSauTat !== 40 || DU.nhipDangChay !== 10 || DU.nhipSauTat !== 0 || TK !== 'abc → tìm "a"') throw new Error('số đo 5.2 đổi — xem lại slide');
const LINT = TR.split('\n').filter((l) => /warning|problems/.test(l)).map((l) => l.replace(/\s{2,}/g, '  ').trim());
if (LINT.length !== 3 || !LINT[0].includes("The 'opt' object makes the dependencies") || !LINT[1].includes("missing dependency: 'query'")) throw new Error('ESLint đổi');

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.2', t: 'Dependencies<br>& cleanup', sub: 'The array decides when an effect runs again; the cleanup undoes the previous run — get both right and effects become predictable',
    en: 'Lesson five point two: dependencies and cleanup. The dependency array decides when an effect runs again; the cleanup function undoes the previous run first. Get both right and effects become predictable; get them wrong and you get stale data, leaks and doubled subscriptions.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The three dependency shapes — run counts <b>measured</b></li>
    <li>How React compares: <code>Object.is</code>, value by value</li>
    <li>Cleanup runs before the next effect and on unmount — order <b>measured</b></li>
    <li>A missing cleanup leaks — timers <b>measured</b></li>
    <li>Objects as dependencies re-run every render — <b>measured</b></li>
    <li>Lying in the array freezes the effect — <b>measured</b> with ESLint</li></ul>`,
    en: 'Six takeaways: the three dependency shapes, with run counts measured; how React compares, with Object dot is; the cleanup order, measured; the leak from a missing cleanup, measured; objects as dependencies, measured; and what happens when you lie in the array, measured with ESLint.' },
  { t: 'Three shapes of the array — measured', body: tsx(`function BaTruongHop({ a, b }) {
  useEffect(() => { dem.khong++; });        // no array
  useEffect(() => { dem.rong++; }, []);     // empty
  useEffect(() => { dem.coA++; }, [a]);     // [a]
  return <p>a={a} b={b}</p>;
}`, { hl: [2, 3, 4] }) + two(cmp(['You write', 'Runs', 'Measured'], [
        [c('useEffect(fn)'), 'after <b>every</b> render', `<b>${S0.khong}</b>`],
        [c('useEffect(fn, [])'), 'once, after the first render', `<b>${S0.rong}</b>`],
        [c('useEffect(fn, [a])'), 'first render + whenever <code>a</code> changes', `<b>${S0.coA}</b>`],
      ], { hl: [0] }), box('The run', 'Chromium, <code>next start</code>: load, then <b>b+1, b+1, a+1</b> — four renders. Only the empty array stayed at 1; only <code>[a]</code> noticed the one change of <code>a</code>.', 'lam'), 'r64'),
    en: 'The three shapes, measured. One component with three effects that only count. Load the page, then click b plus one, b plus one, a plus one: four renders. The effect with no array ran four times, after every render. The empty array ran once. The effect listing a ran twice: after the first render, and once more when a changed. b changed twice and it did not care.' },
  { t: 'How React decides: Object.is, value by value', body: two(steps([
      'After each render React takes the <b>new</b> dependency array',
      `It compares every item with last time\'s using ${c('Object.is')} — like ${c('===')}`,
      'All equal ⇒ <b>skip</b> the effect. Any one different ⇒ cleanup, then run it again',
    ]), box('The rule that keeps you safe', `Every value from the component scope the effect <b>reads</b> — props, state, functions declared in the component — goes in the array. The lint rule <code>react-hooks/exhaustive-deps</code> enforces it. A missing dependency is exactly how an effect reads a stale value — the snapshot rule from Chapter 3, back again.`, 'lam')),
    en: 'How React decides. After each render, React takes the new dependency array and compares every item with last time’s using Object dot is, which behaves like triple equals. All equal: the effect is skipped. Any one different: cleanup, then run again. Hence the rule: every value from the component scope that the effect reads goes in the array, and the lint rule exhaustive-deps enforces it.' },
  { t: 'Cleanup runs before the next effect, and on unmount — measured', body: tsx(`function VongDoi({ dep }) {
  useEffect(() => {
    nhatKy.push(\`effect \${dep}\`);
    return () => { nhatKy.push(\`cleanup \${dep}\`); };
  }, [dep]);
  return <p>dep = {dep}</p>;
}`, { sm: true, hl: [3, 4] }) + two(
      tn([`load (dep=1)        → ${VD.nk0}`, `re-render, dep=1    → ${VD.nk1}   (skipped)`, `dep=2               → ${VD.nk2}`, `unmount             → ${VD.nk3}`].join('\n'), { fs: 14, wrap: 52, title: 'measured — Chromium, next start' }),
    seq(['React', 'dep=1', 'dep=2'], [
      [0, 1, 'mount: effect 1'], [0, 0, '1 → 1: skip', '#64748b'], [0, 1, '1 → 2: cleanup 1', '#c0392b'], [0, 2, 'then effect 2', '#15803d'], [0, 2, 'unmount: cleanup 2', '#c0392b'],
    ], { rh: 36, fs: 16, w: 540 })),
    en: 'The cleanup order, measured. An effect that logs effect dep, and returns a cleanup that logs cleanup dep. On load: effect one. A re-render with the same dep: nothing — Object dot is said equal, the effect was skipped. dep becomes two: cleanup one first, then effect two. Unmount: cleanup two. React always tears the old one down before setting the new one up.' },
  { t: 'Mental model: a fresh setup + cleanup pair per value', body: icards([
      ['refresh', 'Not "mount / unmount"', 'Do not think "runs on mount, cleans on unmount". Think: each time the dependencies change, React <b>re-synchronises</b>.'],
      ['link', 'A matched pair', 'Setup and its cleanup describe <b>one</b> synchronised state — connected to room 1. New input ⇒ React swaps the whole pair.'],
      ['check', 'Correct at any count', 'If the cleanup perfectly undoes the setup, the effect is correct however many times it runs — Lesson 5.3 puts this to the test.'],
    ].map(([i, h, p]) => [i === 'refresh' ? 'loop' : i, h, p]), 3) +
    path([{ t: 'room 1', s: 'setup: connect(1)' }, { t: 'roomId → 2', s: 'cleanup: disconnect(1)', mau: '#c0392b' }, { t: 'room 2', s: 'setup: connect(2)', on: true }, { t: 'unmount', s: 'cleanup: disconnect(2)', mau: '#c0392b' }], { h: 150, fs: 19 }) +
    box('Measured on the lesson page', `The log never showed two effects in a row: <code>${NK.join(' → ')}</code>. Every setup was undone before the next one started.`, 'xanh'),
    en: 'The mental model. Do not think “runs on mount, cleans on unmount”. Think: each time the dependencies change, React re-synchronises. A setup and its cleanup are one matched pair that describes one synchronised state — connected to room one. When the input changes, React swaps the whole pair: disconnect one, connect two. If the cleanup perfectly undoes the setup, the effect is correct however many times it runs.' },
  { t: 'A missing cleanup leaks — measured', body: tsx(`function DongHo({ donDep }) {
  useEffect(() => {
    const id = setInterval(() => { nhip.tick++; }, 100);
    if (donDep) return () => clearInterval(id);  // ✓
  }, [donDep]);                                   // ✗ without it
  return <span>⏱</span>;
}
// remounted 3 times (key change), then unmounted`, { sm: true, hl: [4] }) + two(cmp(['Ticks per second (100 ms timer)', 'no cleanup', 'with cleanup'], [
        ['after 3 remounts', `<b>${TH.nhipDangChay}</b>`, `<b>${DU.nhipDangChay}</b>`],
        ['after unmount', `<b>${TH.nhipSauTat}</b>`, `<b>${DU.nhipSauTat}</b>`],
      ], { hl: [1] }), box('Four timers, forever', 'Each mount started one interval and nobody stopped it: 4 intervals ⇒ 40 ticks a second, and still 40 after the component is gone. With the cleanup there is exactly one while mounted, zero after.', 'do2')),
    en: 'A missing cleanup leaks, measured. A clock that starts a one-hundred-millisecond interval. Remount it three times, then unmount it. Without a cleanup: forty ticks a second — four intervals — and still forty after the component is gone. With the cleanup that clears the interval: ten while mounted, zero after. Whatever the setup starts, the cleanup must stop: remove the listener, close the socket, clear the timer, abort the request.' },
  { t: 'Objects as dependencies re-run every render — measured', body: tsx(`function PhongChat({ room, b }) {
  const opt = { room };              // a NEW object each render
  useEffect(() => { demObj.obj++; }, [opt]);       // ✗
  useEffect(() => { demObj.so++; }, [opt.room]);   // ✓ a string
  return <span>{room} {b}</span>;
}`, { sm: true, hl: [2, 3, 4] }) + two(
      D(cmp(['Dependency', 'Runs after 4 renders'], [[c('[opt]'), `<b>${OB.obj}</b> — every render`], [c('[opt.room]'), `<b>${OB.so}</b> — room never changed`]], { hl: [0] }),
        box('Why', '<code>{ }</code>, <code>[ ]</code>, <code>() =&gt; {}</code> made during render are new every time. Depend on the primitive, move it into the effect, or memoise it (Chapter 6).', 'lam')),
      tn(LINT[0], { fs: 14, wrap: 52, title: 'npx eslint — react-hooks/exhaustive-deps' })),
    en: 'Objects and functions as dependencies, measured. opt is an object literal created during render — a new reference every time — so Object dot is always says changed: that effect ran four times in four renders. Depending on opt dot room, a string, it ran once. ESLint warns about exactly this. Depend on the primitive inside, move the object into the effect, or memoise it, Chapter six.' },
  { t: 'Trap: deleting a dependency to stop re-runs — measured', body: two(D(tsx(`const [query, setQuery] = useState('a');
useEffect(() => {
  const id = setInterval(() =>
    setKq(\`tìm "\${query}"\`), 200);
  return () => clearInterval(id);
}, []);                     // ✗ query is missing`, { sm: true, hl: [4, 6] }),
      tn(LINT[1], { fs: 13, wrap: 64, title: 'npx eslint — the warning you silenced' })),
      D(B('pt-tk', { vp: 640, h: 270, w: 430, url: 'localhost:3000/phu-thuoc · typed "bc"', mark: [[24, 230, 236, 30, ''], [266, 233, 60, 23, '']] }),
        tn(`input → result:  ${TK}`, { fs: 15, title: 'measured' }),
        box('Frozen on the first render', 'The effect closed over <code>query = \'a\'</code> forever. No error — just the wrong request. List <code>query</code>, or move the value into a ref / the setter\'s function form.', 'do2'))),
    en: 'The trap: deleting a dependency to stop re-runs, measured. The lint rule says query is missing; removing it from the array silences the warning and freezes the effect on the first render’s value. Typing b c into the box: the input says abc, the effect still searches for a. No error anywhere — the request succeeds, it is just the wrong request. The array is a claim about what the effect reads, not a switch.' },
  { t: 'The contract, in four lines', body: steps([
      '<b>No array — runs after EVERY render.</b> Almost never what you want; with a setState inside it is an infinite loop',
      '<b>Empty array — runs once on mount</b>, and its cleanup once on unmount. Right for a subscription that never needs to change',
      '<b>With dependencies — re-runs when they change.</b> The cleanup for the old values runs first, then the effect for the new values. React is re-synchronising, not "updating"',
      '<b>The cleanup undoes exactly what the effect did</b> — remove the listener, close the socket, clear the timer, abort the request. If the effect subscribed, the cleanup unsubscribes',
    ]),
    en: 'The contract in four lines. No array: runs after every render — almost never what you want. Empty array: once on mount, its cleanup once on unmount. With dependencies: re-runs when they change, cleanup for the old values first. And the cleanup undoes exactly what the effect did.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Dependency', 'a value the effect reads; it re-runs when one changes'), kw('Empty array []', 'run once after mount, clean up on unmount'),
      kw('No array', 'run after every render (rarely intended)'), kw('Object.is', 'how React compares old and new dependencies'),
      kw('Cleanup', 'returned from the effect; runs before the next run and on unmount'), kw('Re-synchronise', 'tear down the old pair, set up the new one'),
      kw('Stale closure', 'an effect reading an old value because a dependency is missing'), kw('exhaustive-deps', 'the lint rule that catches missing dependencies'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: dependency; empty array; no array; Object dot is; cleanup; re-synchronise; stale closure; and exhaustive-deps.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Start a ${c('setInterval')} in an effect, return a cleanup that clears it; mount and unmount and count the timers`,
      'Add a value to the array and watch the effect re-run only when it changes; remove it and read the lint warning',
      'Log effect and cleanup with the dependency value; change it twice and read the order',
      `Explain ${c('[]')}, ${c('[x]')} and no array in one sentence each`,
    ]), box('Keep these', `<ul><li>The array lists what the effect reads</li><li>Compared with <code>Object.is</code> — objects are always "new"</li><li>Old cleanup runs before the new effect</li><li>Whatever setup starts, cleanup stops</li></ul>`, 'lam'), ''),
    en: 'Your turn: start an interval in an effect with a cleanup that clears it, and count timers across mount and unmount; add a value to the array and watch it re-run only when that changes, then remove it and read the lint warning; log effect and cleanup with the dependency value; and explain the three shapes. Keep: the array lists what the effect reads; compared with Object dot is; old cleanup before new effect; whatever setup starts, cleanup stops.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — Effects', bai: '5.2' }, S);
