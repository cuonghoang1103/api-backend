/*DU_LIEU*/
const DU_LIEU = {
 "n7-5:file:src/app/do-thu/page.tsx": "'use client';\nimport { Profiler, useState, type ProfilerOnRenderCallback } from 'react';\n\n// số đo: Profiler API (cùng nguồn actualDuration với tab Profiler của React DevTools) + số lần BieuDo render + Event Timing của trình duyệt\nconst prof: { id: string; phase: string; ms: number }[] = [];\nconst dem = { bieuDo: 0 };\nif (typeof window !== 'undefined') Object.assign(window, { __prof: prof, __dem: dem });\nconst ghi: ProfilerOnRenderCallback = (id, phase, actualDuration) => {\n  prof.push({ id, phase, ms: Math.round(actualDuration * 10) / 10 });\n};\n\nfunction cham(ms: number) {                                 // \"component chậm giả\": bận đúng ms mili giây\n  const t = performance.now();\n  while (performance.now() - t < ms) { /* bận */ }\n}\nfunction BieuDo() {\n  cham(30);\n  dem.bieuDo++;\n  return <p className=\"text-sm\">📈 biểu đồ (chậm giả 30 ms)</p>;\n}\n\n// TRƯỚC: state của ô tìm nằm ở cha ⇒ mỗi phím render lại cả BieuDo\nfunction Truoc() {\n  const [q, setQ] = useState('');\n  return (\n    <Profiler id=\"truoc\" onRender={ghi}>\n      <input id=\"o-truoc\" value={q} onChange={(e) => setQ(e.target.value)} placeholder=\"trước\" className=\"border px-1\" />\n      <BieuDo />\n    </Profiler>\n  );\n}\n\n// SAU: dời state xuống đúng ô tìm ⇒ BieuDo không bị kéo theo\nfunction OTim() {\n  const [q, setQ] = useState('');\n  return <input id=\"o-sau\" value={q} onChange={(e) => setQ(e.target.value)} placeholder=\"sau\" className=\"border px-1\" />;\n}\nfunction Sau() {\n  return (\n    <Profiler id=\"sau\" onRender={ghi}>\n      <OTim />\n      <BieuDo />\n    </Profiler>\n  );\n}\n\nexport default function DoThu() {\n  return <div className=\"grid grid-cols-2 gap-4 p-4 font-sans\"><div><Truoc /></div><div><Sau /></div></div>;\n}\n",
 "n7-5:trang": "$ npm run build 2>&1 | grep -E 'Compiled|do-thu'\n✓ Compiled successfully in 1205ms\n├ ○ /do-thu\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n7-5:c7": "$ npm run build -- --profile\n> next build --profile\n✓ Compiled successfully in 3.1s\n├ ○ /do-thu\n$ grep -l 'react-dom-profiling\\|__REACT_DEVTOOLS\\|onPostCommit' .next/static/chunks/*.js | head -3 | wc -l | xargs echo 'chunk có mã profiling:'\nchunk có mã profiling: 2",
 "n7-5:mo": "$ curl -s -o /dev/null -w 'next dev GET /do-thu → %{http_code}\\n' localhost:19365/do-thu\nnext dev GET /do-thu → 200\n$ curl -s -o /dev/null -w 'next start GET /do-thu → %{http_code}\\n' localhost:19366/do-thu\nnext start GET /do-thu → 200\n$ curl -s -o /dev/null -w 'next start (build --profile) GET /do-thu → %{http_code}\\n' localhost:19367/do-thu\nnext start (build --profile) GET /do-thu → 200",
 "n7-5:dung": "",
 "anh-nxj-7-5:dt-dev": {
  "url": "http://127.0.0.1:19365/do-thu",
  "vp": [
   640,
   120
  ],
  "rect": {
   "#o-truoc": [
    16,
    16,
    204,
    26
   ],
   "#o-sau": [
    328,
    16,
    204,
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
   "tai": {
    "prof": 2,
    "dem": 4
   },
   "truoc": {
    "prof": [
     "truoc:update:60.3",
     "truoc:update:60",
     "truoc:update:60.1",
     "truoc:update:60.1",
     "truoc:update:60"
    ],
    "dem": 10,
    "ev": [
     {
      "ten": "keydown",
      "ms": 72,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 72,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 64,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 64,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 64,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 64,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 64,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 64,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 64,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 64,
      "o": "o-truoc"
     }
    ]
   },
   "sau": {
    "prof": [
     "sau:update:0.1",
     "sau:update:0.1",
     "sau:update:0.1",
     "sau:update:0.1",
     "sau:update:0.1"
    ],
    "dem": 0,
    "ev": [
     {
      "ten": "keydown",
      "ms": 16,
      "o": "o-sau"
     },
     {
      "ten": "keypress",
      "ms": 16,
      "o": "o-sau"
     }
    ]
   }
  }
 },
 "anh-nxj-7-5:dt-start": {
  "url": "http://127.0.0.1:19366/do-thu",
  "vp": [
   640,
   120
  ],
  "rect": {
   "#o-truoc": [
    16,
    16,
    204,
    26
   ],
   "#o-sau": [
    328,
    16,
    204,
    26
   ]
  },
  "console": [],
  "ketQua": {
   "tai": {
    "prof": 0,
    "dem": 2
   },
   "truoc": {
    "prof": [],
    "dem": 5,
    "ev": [
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     }
    ]
   },
   "sau": {
    "prof": [],
    "dem": 0,
    "ev": []
   }
  }
 },
 "anh-nxj-7-5:dt-prof": {
  "url": "http://127.0.0.1:19367/do-thu",
  "vp": [
   640,
   120
  ],
  "rect": {
   "#o-truoc": [
    16,
    16,
    204,
    26
   ],
   "#o-sau": [
    328,
    16,
    204,
    26
   ]
  },
  "console": [],
  "ketQua": {
   "tai": {
    "prof": 2,
    "dem": 2
   },
   "truoc": {
    "prof": [
     "truoc:update:30",
     "truoc:update:30",
     "truoc:update:30",
     "truoc:update:30",
     "truoc:update:30"
    ],
    "dem": 5,
    "ev": [
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keydown",
      "ms": 32,
      "o": "o-truoc"
     },
     {
      "ten": "keypress",
      "ms": 32,
      "o": "o-truoc"
     }
    ]
   },
   "sau": {
    "prof": [
     "sau:update:0",
     "sau:update:0",
     "sau:update:0",
     "sau:update:0.1",
     "sau:update:0"
    ],
    "dem": 0,
    "ev": [
     {
      "ten": "keydown",
      "ms": 16,
      "o": "o-sau"
     },
     {
      "ten": "keypress",
      "ms": 16,
      "o": "o-sau"
     }
    ]
   }
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, zm, meter, flow } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-07-5', code: 'NXJ 7.5', title: 'Measure, don\'t guess', sub: 'Chapter 7 · Lesson 7.5' };
const O = (k) => { const v = DU_LIEU[`n7-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-7-5:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-07-5', ten, o);
const DV = AN('dt-dev').ketQua, ST = AN('dt-start').ketQua, PR = AN('dt-prof').ketQua;
const P = O('file:src/app/do-thu/page.tsx'), C7 = O('c7');
for (const s of ['function cham(ms: number) {', '<Profiler id="truoc" onRender={ghi}>', 'function OTim() {']) if (!P.includes(s)) throw new Error('do-thu đổi: ' + s);
const ms = (p) => p.map((x) => +x.split(':')[2]);
const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const kd = (q) => q.ev.filter((e) => e.ten === 'keydown').map((e) => e.ms);
const PT = ms(PR.truoc.prof), PS = ms(PR.sau.prof), DT = ms(DV.truoc.prof);
if (PT.length !== 5 || PS.length !== 5 || ST.truoc.prof.length !== 0 || ST.sau.prof.length !== 0 || DV.truoc.dem !== 10 || PR.truoc.dem !== 5 || ST.truoc.dem !== 5
  || PR.sau.dem !== 0 || !(avg(PT) >= 29 && avg(PT) < 40) || !(avg(DT) >= 55) || !(Math.max(...PS) <= 0.5) || kd(ST.sau).some((x) => x > 16) || kd(PR.sau).some((x) => x > 16) || kd(PR.truoc).length !== 5) throw new Error('số đo 7.5 đổi');
if (!/--profile/.test(C7)) throw new Error('c7 đổi');
const f1 = (x) => (Math.round(x * 10) / 10).toString();
const EVT = Math.round(avg(kd(PR.truoc))), EVD = Math.round(avg(kd(DV.truoc)));

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.5', t: 'Measure, don\'t guess', sub: 'Optimise what the profiler shows, not what you fear — with real numbers before and after',
    en: 'Lesson seven point five: measure, don\'t guess. Everything in this chapter is a tool, and every tool gets misused when it is applied without measuring. The single most important performance habit in React is the same as in Node: measure first. Reach for the profiler before React.memo, not after sprinkling it everywhere.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The profiler workflow: record a real interaction, read durations, ask why, change one thing</li>
    <li>A slow component, measured: <b>30 ms per keystroke</b> — then fixed by moving state, measured again</li>
    <li>The order of fixes: cheapest and most effective first — memo comes <b>last</b></li>
    <li>Why dev numbers lie: Strict Mode doubled every render — measured</li>
    <li>A production surprise: <code>&lt;Profiler&gt;</code> is <b>silent</b> unless you build with <code>--profile</code></li></ul>`,
    en: 'Five takeaways: the profiler workflow; a slow component measured at thirty milliseconds per keystroke, then fixed and measured again; the order of fixes, memo last; why dev numbers lie; and a production surprise — the Profiler is silent unless you build with the profile flag.' },
  { t: 'The React DevTools Profiler', body: two(steps([
      '<b>Record a real interaction</b> — type, scroll, open a modal.',
      '<b>Read the flamegraph</b> — wide or highlighted bars are where your time goes.',
      '<b>Check "why did this render?"</b> — props, state, parent, or context: the cause picks the fix.',
      '<b>Apply the smallest fix</b> — usually moving state down, sometimes a stable key, occasionally memo. Then measure again.',
    ]), D(box('Same numbers in code', 'The <code>&lt;Profiler id onRender&gt;</code> component reports the same <code>actualDuration</code> React DevTools shows — this lesson reads it in code so every number on the slides is measured, not screenshotted.', 'lam'),
      box('Highlight updates', 'A DevTools option that flashes what just re-rendered — the quick visual check before you open the profiler.', 'xanh')), ''),
    en: 'The React DevTools Profiler. Install React Developer Tools and you get a Profiler tab: record a real interaction, read the flamegraph — wide bars are your time — check why each component rendered, and apply the smallest fix, then measure again. The Profiler component reports the same actual-duration numbers in code, which is how this lesson measures.' },
  { t: 'A slow component, measured', body: tsx(`function BieuDo() {
  cham(30);                       // busy for 30 ms
  return <p>📈 biểu đồ</p>;
}
function Truoc() {                // state lives in the parent
  const [q, setQ] = useState('');
  return (
    <Profiler id="truoc" onRender={ghi}>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <BieuDo />
    </Profiler>
  );
}`, { sm: true, hl: [6, 10] }) +
      two(cmp(['Type "abcde" (next build --profile)', 'measured'], [
        ['BieuDo renders', `<b>${PR.truoc.dem}</b> — one per keystroke`], ['actualDuration per commit', `<b>${PT.map(f1).join(' · ')} ms</b>`], ['keydown → next paint (Event Timing)', `<b>~${EVT} ms</b> each`],
      ], { hl: [1] }), box('Why', 'The input\'s state lives in the parent, so every keystroke re-renders the slow chart beside it (cause 2, lesson 7.3). The profiler points straight at it.', 'do2'), 'r64'),
    en: 'A slow component, measured. A fake chart is busy for thirty milliseconds, rendered next to a search box whose state lives in the parent. Type five letters on a profiling build: the chart rendered five times, each commit took thirty milliseconds, and each keystroke took about thirty-two milliseconds to the next paint. The profiler points straight at the chart.' },
  { t: 'The order of fixes — cheapest and most effective first', body: two(steps([
      '<b>Move state down</b> — shrink the re-render radius by keeping state in the component that needs it (Chapter 3). Free, and often the whole fix.',
      '<b>Fix keys</b> — a bad key can remount a whole subtree; a good one avoids it (7.2). Also free.',
      '<b>Lift content up / children as props</b> — a subtree passed as <code>children</code> doesn\'t re-render when the wrapper\'s state changes (7.3).',
      '<b>Memoise</b> — <code>React.memo</code> / <code>useMemo</code> / <code>useCallback</code> on the expensive components the profiler identified, with stable props (7.4).',
    ]), tsx(`// fix #1: the box owns its state
function OTim() {
  const [q, setQ] = useState('');
  return <input value={q}
    onChange={(e) => setQ(e.target.value)} />;
}
<Profiler id="sau" onRender={ghi}>
  <OTim />
  <BieuDo />
</Profiler>`, { sm: true, hl: [3] }), ''),
    en: 'The order of fixes, cheapest first. One: move state down — free, and often the whole fix. Two: fix keys. Three: lift content up, pass a subtree as children. Four, last: memoise the expensive components the profiler identified, with stable props. Here fix number one is enough: the search box owns its own state.' },
  { t: 'Before / after — the number that proves it', body: two(D(cmp(['Type "abcde"', 'before (state in parent)', 'after (state in OTim)'], [
      ['BieuDo renders', `${PR.truoc.dem}`, `<b>${PR.sau.dem}</b>`], ['actualDuration / commit (avg)', `${f1(avg(PT))} ms`, `<b>${avg(PS).toFixed(2)} ms</b>`],
      ['keydown → next paint (Event Timing)', `~${EVT} ms, all 5`, `<b>≤ 16 ms</b> (${kd(PR.sau).length} of 5 even reached the 16 ms threshold)`],
    ], { hl: [1] }), B('dt-prof', { vp: 640, h: 70, w: 560, url: 'next start (build --profile) · /do-thu', mark: [[16, 16, 204, 26, 'before'], [336, 16, 204, 26, 'after']] })),
      D(meter([['before', avg(PT), '#b91c1c'], ['after', +avg(PS).toFixed(2), '#15803d']], { don: 'ms / keystroke', w: 470, nhan: 90, rh: 54 }),
        box('Proof, not a feeling', 'Record a metric before and after every change. If the bar does not get shorter, revert: an optimisation you cannot measure is complexity you cannot justify.', 'xanh')), ''),
    en: 'Before and after, the number that proves it. Before: the chart rendered five times, thirty milliseconds per commit, and every keystroke took about thirty-two milliseconds to paint. After moving the state into the search box: zero chart renders, about zero point one milliseconds, and keystrokes stayed at sixteen milliseconds or less. Record a metric before and after every change; if the bar does not get shorter, revert.' },
  { t: 'Measure on production — dev doubles the work', body: two(cmp(['Same page, type "abcde"', 'next dev', 'next build --profile + start'], [
      ['BieuDo renders', `<b>${DV.truoc.dem}</b> (Strict Mode ×2)`, `${PR.truoc.dem}`],
      ['actualDuration / commit', `<b>${f1(avg(DT))} ms</b>`, `${f1(avg(PT))} ms`],
      ['keydown → next paint', `~${EVD} ms`, `~${EVT} ms`],
    ], { hl: [0, 1] }), box('Dev is for "why", prod is for "how much"', 'The development build carries extra checks and Strict Mode\'s double render, so components render twice and each render is slower. Optimising by dev numbers chases problems that don\'t exist in production. The <i>cause</i> ("why did this render?") is correct in both.', 'lam'), 'r64') +
      box('Same advice for Lighthouse', 'Run it against the built app (<code>next build && next start</code>), never against <code>next dev</code>.', 'xanh'),
    en: 'Measure on production. The same page under next dev: the chart rendered ten times for five keystrokes — Strict Mode renders twice — and each commit took about sixty milliseconds instead of thirty. The development build carries extra checks, so its numbers are inflated. Use dev for "why did this render", and production for "how much". The same goes for Lighthouse: run it on the built app.' },
  { t: 'Surprise: the production Profiler is silent', body: two(D(cmp(['Profiler onRender calls while typing "abcde"', 'entries'], [
      ['next dev', `${DV.truoc.prof.length}`], ['next build → next start', `<b>${ST.truoc.prof.length}</b> — never called`], ['next build --profile → next start', `<b>${PR.truoc.prof.length}</b>`],
    ], { hl: [1] }), tn(C7.split('\n').filter((l) => /^\$ npm run build|^> next build|Compiled/.test(l)).join('\n'), { fs: 15, title: 'c7/my-app — a profiling build' })),
      D(box('Why', 'A normal production build ships React without its profiling timers — <code>&lt;Profiler&gt;</code> renders its children and does nothing else. The chart still rendered 5 times; nobody was timing it.', 'do2'),
        box('How to get real numbers', '<code>next build --profile</code> swaps in the profiling build of React: the Profiler component and the DevTools Profiler tab both work on production code. Use it to measure; ship the normal build.', 'xanh')), ''),
    en: 'A production surprise. In a normal next build plus next start, the Profiler\'s onRender was never called — zero entries — even though the chart rendered five times. A production build ships React without its profiling timers. Build with next build --profile and the Profiler component — and the DevTools Profiler tab — work on production code. Measure with that, ship the normal build.' },
  { t: 'Why premature optimisation actually hurts', body: two(icards([
      ['warn', 'A real, fixed cost', 'every memo/useMemo/useCallback adds a comparison and memory on every render'],
      ['code', 'Noisier code', 'wrappers, dependency arrays and stable references everywhere — harder to change'],
      ['gauge', 'For free renders', 'most of the re-renders it "saves" were cheap to begin with (7.3)'],
    ], 1), D(flow([{ t: 'write it plainly', mau: '#0070f3' }, { t: 'profile', s: 'production numbers' }, { t: 'fix the few', s: 'that proved costly', mau: '#15803d' }], { w: 600, h: 140, fs: 20 }),
      box('The discipline', 'Write the straightforward version, profile it, and optimise the few places the measurement proves matter. Lesson 7.4 measured a "memo everywhere" table: slower than no memo at all.', 'lam')), 'r46'),
    en: 'Why premature optimisation hurts. Wrapping everything in memo, useMemo and useCallback before measuring adds a real, fixed cost on every render, makes the code noisier and harder to change, and mostly "saves" renders that were free anyway. The discipline: write it plainly, profile, and optimise the few places the measurement proves matter.' },
  { t: 'Measure before you optimise', body: steps([
      '<b>Record a profile of the real interaction</b> — React DevTools → Profiler → record, do the slow thing, stop. You get every render with its duration.',
      '<b>Read durations, not counts</b> — sort by the longest bar. The top component is where the time is, however many times anything rendered.',
      '<b>Ask why it rendered</b> — props changed, state changed, parent rendered, context changed. That answer picks the fix for you.',
      '<b>Change one thing, then record again</b> — if the bar did not get shorter, revert. An optimisation you cannot measure is complexity you cannot justify.',
    ]),
    en: 'Measure before you optimise: record a profile of the real interaction; read durations, not counts; ask why the top component rendered, because that answer picks the fix; and change one thing, then record again — if the bar did not get shorter, revert.' },
  { t: 'Phase 2 complete — what comes next', body: two(D(flow([{ t: 'Ch 5', s: 'effects' }, { t: 'Ch 6', s: 'the hooks toolbox' }, { t: 'Ch 7', s: 'keys & renders', mau: '#0070f3' }], { w: 600, h: 130, fs: 22 }),
      box('You now know', 'How React works under the surface: effects sync with the outside and clean up; ref, memo, reducer, context and custom hooks; reconciliation, keys and the re-render rules that explain what actually updates and when.', 'xanh')),
      D(box('Progress check 2', 'Covers everything up to here — the chapter quiz follows this lesson.', 'lam'),
        box('Phase 3: Next.js itself', 'App Router, layouts, and Server Components — where your React runs on a server before it ever reaches the browser. Chapter 8 starts it.', 'do2')), ''),
    en: 'Phase two is complete. You now know how React works under the surface: effects that sync with the outside world and clean up; the hooks toolbox — ref, memoisation, reducer, context and custom hooks; and reconciliation, keys and the re-render rules. Phase three changes the game: Next.js, the App Router and Server Components, where your React runs on a server before it reaches the browser.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Profiler', 'the React DevTools tab that times each component render'), kw('actualDuration', 'milliseconds React spent rendering a commit'),
      kw('Measure first', 'find the real bottleneck before optimising anything'), kw('Bottleneck', 'the component or task that actually costs time'),
      kw('Highlight updates', 'a DevTools option that flashes what re-rendered'), kw('Before / after', 'compare a metric to prove a change helped'),
      kw('Premature optimisation', 'optimising by guesswork, usually in the wrong place'), kw('--profile build', 'production build with React\'s profiling timers on'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the Profiler; actual duration; measure first; bottleneck; highlight updates; before and after; premature optimisation; and the profiling build.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Open the React DevTools Profiler, record one interaction, and read which components rendered and for how long`,
      `Add a fake slow component (${c('cham(30)')}), confirm the profiler flags it, then fix it and measure again`,
      `Wrap a subtree in ${c('<Profiler onRender>')} and compare ${c('next dev')}, ${c('next start')} and ${c('next build --profile')}`,
      'Write down one metric before and after a change to prove it worked',
    ]), box('Keep these', `<ul><li>Profile first, then optimise</li><li>Durations, not counts</li><li>State down → key → children → memo</li><li>Numbers from a production build</li></ul>`, 'lam'), ''),
    en: 'Your turn: profile one interaction and read the durations; add a fake slow component, confirm the profiler flags it, fix it and measure again; compare the Profiler under next dev, next start and the profiling build; and write down one metric before and after a change. Keep: profile first; durations, not counts; state down, then keys, children, and memo last; numbers from a production build.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Lists, keys & render performance', bai: '7.5' }, S);
