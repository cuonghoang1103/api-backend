/*DU_LIEU*/
const DU_LIEU = {
 "n7-1:file:src/app/doi-chieu/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\nimport { useWindowWidth } from '@/lib/useWindowWidth';\n\nconst nk: string[] = [];                                     // nhật ký mount/unmount (đo)\nif (typeof window !== 'undefined') Object.assign(window, { __nk: nk });\n\n// 1 — đoạn đo của bài: con ghi \"mount\" lúc gắn, \"unmount\" lúc gỡ\nfunction Child() {\n  useEffect(() => {\n    nk.push('mount');\n    return () => { nk.push('unmount'); };\n  }, []);\n  return <span>con</span>;\n}\n\n// 2 — cùng type, cùng vị trí: React coi là CÙNG một component\nfunction DemNguoi({ ten }: { ten: string }) {\n  const [n, setN] = useState(0);\n  return <button id=\"dem\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">{ten}: {n}</button>;\n}\n\n// 3 — Editor có state riêng (chữ trong ô)\nfunction Editor({ id }: { id: string }) {\n  const [text, setText] = useState('');\n  return <input id={id} value={text} onChange={(e) => setText(e.target.value)} className=\"border px-1\" />;\n}\n\nexport default function DoiChieu() {\n  const [laSection, setLaSection] = useState(false);\n  const [laAn, setLaAn] = useState(true);\n  const isWide = useWindowWidth() >= 768;\n  return (\n    <div id=\"vung\" className=\"space-y-2 p-6 font-sans text-lg\">\n      <div id=\"vung-boc\">\n        <button id=\"lat\" onClick={() => setLaSection(!laSection)} className=\"rounded border px-2\">lật bọc</button>{' '}\n        {laSection ? <section id=\"boc\"><Child /></section> : <div id=\"boc\"><Child /></div>}\n      </div>\n      <div>\n        <button id=\"doi-nguoi\" onClick={() => setLaAn(!laAn)} className=\"rounded border px-2\">đổi người</button>{' '}\n        {laAn ? <DemNguoi ten=\"An\" /> : <DemNguoi ten=\"Bình\" />}\n      </div>\n      <div id=\"sai\">❌ {isWide ? <section><Editor id=\"e-type\" /></section> : <div><Editor id=\"e-type\" /></div>}</div>\n      <div id=\"dung\">✅ <div className={isWide ? 'wide' : 'narrow'}><Editor id=\"e-class\" /></div></div>\n    </div>\n  );\n}\n",
 "n7-1:file:src/app/doi-chieu/long/page.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function Long() {\n  const [q, setQ] = useState('');\n  function OTim() {                                          // ✗ component định nghĩa BÊN TRONG component khác\n    return <input id=\"o-tim\" value={q} onChange={(e) => setQ(e.target.value)} className=\"border px-1\" />;\n  }\n  return <div className=\"space-x-2 p-6 font-sans text-lg\"><OTim /><span id=\"q\">q = {q}</span></div>;\n}\n",
 "n7-1:trang": "$ npm run build 2>&1 | grep -E 'Compiled|doi-chieu'\n✓ Compiled successfully in 922ms\n├ ○ /doi-chieu\n├ ○ /doi-chieu/long\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint -f json src/app/doi-chieu/long/page.tsx | node tom-eslint.cjs\n9:60 error react-hooks/static-components — Error: Cannot create components during render",
 "n7-1:mo": "$ curl -s -o /dev/null -w 'next start GET /doi-chieu → %{http_code}\\n' localhost:19357/doi-chieu\nnext start GET /doi-chieu → 200\n$ curl -s -o /dev/null -w 'next dev GET /doi-chieu → %{http_code}\\n' localhost:19358/doi-chieu\nnext dev GET /doi-chieu → 200",
 "n7-1:dung": "",
 "anh-nxj-7-1:dc-start-lat": {
  "url": "http://127.0.0.1:19357/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#lat": [
    24,
    24,
    75,
    30
   ],
   "#boc": [
    24,
    54,
    592,
    28
   ],
   "#doi-nguoi": [
    24,
    90,
    94,
    30
   ],
   "#dem": [
    122,
    90,
    62,
    30
   ],
   "#sai": [
    24,
    128,
    592,
    58
   ],
   "#dung": [
    24,
    194,
    592,
    58
   ],
   "#e-type": [
    24,
    156,
    237,
    30
   ],
   "#e-class": [
    24,
    222,
    237,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-1:dc-start-an": {
  "url": "http://127.0.0.1:19357/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#lat": [
    24,
    24,
    75,
    30
   ],
   "#boc": [
    24,
    54,
    592,
    28
   ],
   "#doi-nguoi": [
    24,
    90,
    94,
    30
   ],
   "#dem": [
    122,
    90,
    61,
    30
   ],
   "#sai": [
    24,
    128,
    592,
    58
   ],
   "#dung": [
    24,
    194,
    592,
    58
   ],
   "#e-type": [
    24,
    156,
    237,
    30
   ],
   "#e-class": [
    24,
    222,
    237,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-1:dc-start-binh": {
  "url": "http://127.0.0.1:19357/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#lat": [
    24,
    24,
    75,
    30
   ],
   "#boc": [
    24,
    54,
    592,
    28
   ],
   "#doi-nguoi": [
    24,
    90,
    94,
    30
   ],
   "#dem": [
    122,
    90,
    76,
    30
   ],
   "#sai": [
    24,
    128,
    592,
    58
   ],
   "#dung": [
    24,
    194,
    592,
    58
   ],
   "#e-type": [
    24,
    156,
    237,
    30
   ],
   "#e-class": [
    24,
    222,
    237,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-1:dc-start-640": {
  "url": "http://127.0.0.1:19357/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#lat": [
    24,
    22,
    75,
    30
   ],
   "#boc": [
    24,
    52,
    592,
    28
   ],
   "#doi-nguoi": [
    24,
    88,
    94,
    30
   ],
   "#dem": [
    122,
    88,
    76,
    30
   ],
   "#sai": [
    24,
    126,
    592,
    58
   ],
   "#dung": [
    24,
    192,
    592,
    58
   ],
   "#e-type": [
    24,
    154,
    237,
    30
   ],
   "#e-class": [
    24,
    220,
    237,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-1:dc-start-1000": {
  "url": "http://127.0.0.1:19357/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#lat": [
    24,
    22,
    75,
    30
   ],
   "#boc": [
    24,
    52,
    952,
    28
   ],
   "#doi-nguoi": [
    24,
    88,
    94,
    30
   ],
   "#dem": [
    122,
    88,
    76,
    30
   ],
   "#sai": [
    24,
    126,
    952,
    58
   ],
   "#dung": [
    24,
    192,
    952,
    58
   ],
   "#e-type": [
    24,
    154,
    237,
    30
   ],
   "#e-class": [
    24,
    220,
    237,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-1:dc-start": {
  "url": "http://127.0.0.1:19357/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#lat": [
    24,
    22,
    75,
    30
   ],
   "#boc": [
    24,
    52,
    952,
    28
   ],
   "#doi-nguoi": [
    24,
    88,
    94,
    30
   ],
   "#dem": [
    122,
    88,
    76,
    30
   ],
   "#sai": [
    24,
    126,
    952,
    58
   ],
   "#dung": [
    24,
    192,
    952,
    58
   ],
   "#e-type": [
    24,
    154,
    237,
    30
   ],
   "#e-class": [
    24,
    220,
    237,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "nk0": [
    "mount"
   ],
   "nk1": [
    "mount",
    "unmount",
    "mount"
   ],
   "moLat": {
    "boc": [
     "-DIV",
     "+SECTION"
    ],
    "nguoi": [],
    "sai": [],
    "dung": []
   },
   "dem0": "An: 3",
   "dem1": "Bình: 3",
   "moNguoi": {
    "boc": [],
    "nguoi": [
     "text",
     "text",
     "text",
     "text"
    ],
    "sai": [],
    "dung": []
   },
   "w640": {
    "type": "Xin chào",
    "cls": "Xin chào"
   },
   "w1000": {
    "type": "",
    "cls": "Xin chào"
   },
   "moRong": {
    "boc": [],
    "nguoi": [],
    "sai": [
     "-DIV",
     "+SECTION"
    ],
    "dung": [
     "class"
    ]
   }
  }
 },
 "anh-nxj-7-1:dc-dev": {
  "url": "http://127.0.0.1:19358/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {},
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
   "nk0": [
    "mount",
    "unmount",
    "mount"
   ],
   "nk1": [
    "mount",
    "unmount",
    "mount",
    "unmount",
    "mount",
    "unmount",
    "mount"
   ]
  }
 },
 "anh-nxj-7-1:long-start": {
  "url": "http://127.0.0.1:19357/doi-chieu/long",
  "vp": [
   640,
   120
  ],
  "rect": {
   "#o-tim": [
    24,
    24,
    237,
    30
   ],
   "#q": [
    269,
    27,
    39,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "go": {
    "q": "q = a",
    "value": "a",
    "active": "BODY"
   }
  }
 },
 "anh-nxj-7-1:dc-start-dau": {
  "url": "http://127.0.0.1:19357/doi-chieu",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#lat": [
    24,
    24,
    75,
    30
   ],
   "#boc": [
    24,
    54,
    592,
    28
   ],
   "#doi-nguoi": [
    24,
    90,
    94,
    30
   ],
   "#dem": [
    122,
    90,
    62,
    30
   ],
   "#sai": [
    24,
    128,
    592,
    58
   ],
   "#dung": [
    24,
    194,
    592,
    58
   ],
   "#e-type": [
    24,
    156,
    237,
    30
   ],
   "#e-class": [
    24,
    222,
    237,
    30
   ]
  },
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, cay, flow, zm, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-07-1', code: 'NXJ 7.1', title: 'Reconciliation: how React decides what changed', sub: 'Chapter 7 · Lesson 7.1' };
const O = (k) => { const v = DU_LIEU[`n7-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-7-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-07-1', ten, o);
const K = AN('dc-start').ketQua, KD = AN('dc-dev').ketQua, L = AN('long-start').ketQua;
const TR = O('trang'), P = O('file:src/app/doi-chieu/page.tsx'), PL = O('file:src/app/doi-chieu/long/page.tsx');
for (const s of ["nk.push('mount');", "{laSection ? <section id=\"boc\"><Child /></section> : <div id=\"boc\"><Child /></div>}", "{laAn ? <DemNguoi ten=\"An\" /> : <DemNguoi ten=\"Bình\" />}", "<div className={isWide ? 'wide' : 'narrow'}><Editor id=\"e-class\" /></div>"])
  if (!P.includes(s)) throw new Error('doi-chieu/page.tsx không có: ' + s);
if (!PL.includes('function OTim() {')) throw new Error('long/page.tsx đổi');
const J = (a) => JSON.stringify(a);
if (J(K.nk0) !== '["mount"]' || J(K.nk1) !== '["mount","unmount","mount"]' || J(K.moLat.boc) !== '["-DIV","+SECTION"]'
  || K.dem0 !== 'An: 3' || K.dem1 !== 'Bình: 3' || J(K.moNguoi.nguoi) !== '["text","text","text","text"]'
  || K.w640.type !== 'Xin chào' || K.w1000.type !== '' || K.w1000.cls !== 'Xin chào' || J(K.moRong.sai) !== '["-DIV","+SECTION"]' || J(K.moRong.dung) !== '["class"]'
  || J(KD.nk0) !== '["mount","unmount","mount"]' || J(KD.nk1) !== '["mount","unmount","mount","unmount","mount","unmount","mount"]'
  || L.go.q !== 'q = a' || L.go.value !== 'a' || L.go.active !== 'BODY') throw new Error('số đo 7.1 đổi');
const ESL = TR.split('\n').find((l) => /static-components/.test(l));
if (!ESL || !/Cannot create components during render/.test(ESL)) throw new Error('ESLint 7.1 đổi');
const BUILD = TR.split('\n').filter((l) => /Compiled|doi-chieu|^\$ npm run build/.test(l)).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.1', t: 'Reconciliation: how React<br>decides what changed', sub: 'Compare old and new trees slot by slot — same type keeps, different type rebuilds',
    en: 'Lesson seven point one: reconciliation. After every render React holds two element trees, the previous one and the new one, and walks them side by side. At each position it decides: update this node, or throw it away and build a new one. That decision process is reconciliation, and it explains a whole family of "my state disappeared" bugs.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The rule: compare by <b>position</b>, then by <b>type</b> — and what each outcome costs</li>
    <li>Watch it happen: mount / unmount log + a <code>MutationObserver</code> on the real DOM (next start)</li>
    <li>The surprise: same type at the same position is the <b>same component</b> — state carries over</li>
    <li>The breakpoint bug: a wrapper that changes type wipes a form — measured in Chromium</li>
    <li>A hidden type change: a component defined inside another component (ESLint catches it)</li></ul>`,
    en: 'Five takeaways: the rule, position then type; watching it happen with a mount log and a mutation observer on the real DOM; the surprise that the same type at the same spot is the same component; the breakpoint bug that wipes a form; and a hidden type change — a component defined inside another component.' },
  { t: 'Two trees, compared slot by slot', body: two(
      D(cay({ t: 'previous render', s: '<div id="vung">', mau: '#475569' }, [{ t: '<div>', s: 'wrapper' }, { t: '<button>', s: 'đổi người' }, { t: '<DemNguoi>', s: 'ten="An"' }], { w: 540, h: 230 }),
        cay({ t: 'new render', s: '<div id="vung">', mau: '#0070f3' }, [{ t: '<section>', s: 'type changed', mau: '#b91c1c' }, { t: '<button>', s: 'same', mau: '#15803d' }, { t: '<DemNguoi>', s: 'ten="Bình"', mau: '#15803d' }], { w: 540, h: 230 })),
      D(cmp(['Slot', 'Before → after', 'React does'], [
        ['1', '<code>div</code> → <code>section</code>', '<b>destroy + rebuild</b> the whole branch'],
        ['2', '<code>button</code> → <code>button</code>', 'keep the node, patch what changed'],
        ['3', '<code>DemNguoi</code> → <code>DemNguoi</code>', 'keep the instance — <b>state kept</b>, new props'],
      ], { hl: [0] }),
        box('It does not search', 'React looks at the same slot in both trees. It never scans the tree to find "where did this go?" — that is what keys are for (7.2).', 'lam')), 'r46'),
    en: 'Two trees, compared slot by slot. React walks the previous and the new element tree in parallel and looks at the same slot in both. Slot one changed type, div to section: destroy and rebuild that branch. Slot two is still a button: keep the node, patch what changed. Slot three is still DemNguoi: keep the instance and its state, just give it new props. React does not search the tree.' },
  { t: 'The rule: position first, then type', body: icards([
      ['check', 'Same type → update', 'Both <code>&lt;div&gt;</code>, or both <code>&lt;Profile&gt;</code>: React keeps the same DOM node / component instance and only updates the attributes and children that changed. <b>State is preserved.</b>'],
      ['warn', 'Different type → replace', '<code>&lt;div&gt;</code> becomes <code>&lt;section&gt;</code>, or <code>&lt;Login&gt;</code> becomes <code>&lt;Dashboard&gt;</code>: React tears down the old subtree and builds a new one. <b>State and effects reset.</b>'],
    ], 2) + tsx(`// same slot, different type → the subtree is rebuilt
{laSection ? <section><Child /></section> : <div><Child /></div>}

// same slot, same type → kept, only props change
{laAn ? <DemNguoi ten="An" /> : <DemNguoi ten="Bình" />}`, { sm: true, hl: [2, 5] }),
    en: 'The rule. At each slot React looks at the old element and the new one. Same type — both div, or both the same component — React keeps the DOM node or the component instance and only updates what changed; state is preserved. Different type — div becomes section, Login becomes Dashboard — React tears the old branch down and builds a new one; state and effects reset.' },
  { t: 'Watch it happen — measured on next start', body: two(tsx(`function Child() {
  useEffect(() => {
    nk.push('mount');
    return () => { nk.push('unmount'); };
  }, []);
  return <span>con</span>;
}
// ...
{laSection
  ? <section id="boc"><Child /></section>
  : <div id="boc"><Child /></div>}`, { hl: [9, 10, 11] }),
      D(B('dc-start-lat', { vp: 640, h: 92, w: 540, url: 'next start · /doi-chieu', mark: [[24, 52, 80, 28, '<section>']] }),
        box('Why the child died', 'Its own code never changed. Its <b>parent\'s type</b> did, so everything under it was destroyed and mounted again — state lost, effects re-run.', 'do2')), '') +
      zm(cmp(['Moment', 'mount log', 'DOM records (MutationObserver)'], [
        ['page loaded', `<code>${J(K.nk0)}</code>`, '—'],
        ['click "lật bọc"', `<code>${J(K.nk1)}</code>`, `<code>${K.moLat.boc.join(' ')}</code>`],
      ], { hl: [1] }), 1.1),
    en: 'Watch it happen. A child logs mount and unmount. We flip its wrapper from div to section — same slot, different type. Measured on next start: mount, then unmount, mount. A mutation observer on the real DOM saw exactly two records: the div removed, a section added. The child itself never changed; its parent\'s type did.' },
  { t: 'Measure on production — dev doubles the log', body: tn([
      `next dev   · after load : ${J(KD.nk0)}`, `next dev   · after flip : ${J(KD.nk1)}`, '',
      `next start · after load : ${J(K.nk0)}`, `next start · after flip : ${J(K.nk1)}`].join('\n'), { fs: 17, wrap: 110, title: 'window.__nk — read by Playwright (Chromium)' }) +
    two(cmp(['The flip adds', 'entries'], [['next start', `<b>${K.nk1.length - K.nk0.length}</b> — unmount old, mount new`], ['next dev', `<b>${KD.nk1.length - KD.nk0.length}</b> — the new child is Strict-checked too`]], { hl: [0] }),
      box('Not a reconciliation effect', 'In dev, Strict Mode mounts → unmounts → mounts every <b>newly mounted</b> component on purpose (Lesson 5.3) — at load and again after the flip. Read lifecycle logs on <code>next build && next start</code>.', 'lam'), ''),
    en: 'Measure on production. Under next dev the page already logs mount, unmount, mount right after load — Strict Mode testing your cleanup. After the flip, dev adds four entries instead of two, because the newly mounted child is Strict-checked as well. On next start the flip adds exactly two: unmount the old child, mount the new one. Read lifecycle logs on next build and next start.' },
  { t: 'Same type at the same slot = the same component', body: tsx(`function DemNguoi({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{ten}: {n}</button>;
}
{laAn ? <DemNguoi ten="An" /> : <DemNguoi ten="Bình" />}   // one slot, two "people"`, { sm: true, hl: [5] }) +
      two(D(two(B('dc-start-an', { vp: 640, h: 125, w: 300, url: 'after 3 clicks', mark: [[122, 88, 76, 30, '']] }),
        B('dc-start-binh', { vp: 640, h: 125, w: 300, url: 'after "đổi người"', mark: [[122, 88, 80, 30, '']] })),
        cmp(['Action', 'button shows', 'DOM records'], [['3 clicks on An', `<b>${K.dem0}</b>`, '3 × text'], ['switch An → Bình', `<b>${K.dem1}</b>`, '<b>1 × text</b> — node kept']], { hl: [1] })),
        box('Surprise', 'Two "different people", one counter: React only saw <code>DemNguoi</code> → <code>DemNguoi</code>, so Bình inherits An\'s <b>3</b>. Lesson 7.2: a <code>key</code> tells React they are different.', 'do2'), 'r64'),
    en: 'The surprise: same type at the same slot is the same component. Click An three times: An three. Switch to Bình: Bình three. Two different people, one counter, because React only saw DemNguoi then DemNguoi. The DOM recorded one text change — the button node itself stayed. Next lesson, a key tells React they are different.' },
  { t: 'The breakpoint bug: a wrapper that changes type', body: two(D(tsx(`// ❌ two types at the same slot → remount on resize
{isWide ? <section><Editor /></section> : <div><Editor /></div>}

// ✅ keep the type stable; swap the class instead
<div className={isWide ? 'wide' : 'narrow'}><Editor /></div>`, { sm: true, hl: [2, 5] }),
        box('Symptom', '"The form clears when I resize the window" — it happens at exactly one moment: when the width crosses the breakpoint.', 'do2'),
        cmp(['Typed "Xin chào", then 640 → 1000 px', '❌ type swap', '✅ class swap'], [
          ['value after resize', `<b>"${K.w1000.type}"</b> (wiped)`, `"${K.w1000.cls}"`],
          ['DOM records', `<code>${K.moRong.sai.join(' ')}</code>`, `<code>${K.moRong.dung.join(' ')}</code>`],
        ], { hl: [0] })),
      D(B('dc-start-640', { vp: 640, h: 250, w: 440, url: '640 px', mark: [[24, 154, 237, 30, ''], [24, 220, 237, 30, '']] }),
        B('dc-start-1000', { vp: 1000, h: 250, w: 440, url: 'resized to 1000 px', mark: [[24, 154, 237, 30, ''], [24, 220, 237, 30, '']] })), 'r64'),
    en: 'The breakpoint bug. One wrapper switches between section and div depending on the window width. Type "Xin chào" in both editors at six hundred forty pixels, then widen to one thousand. The type-swapping one is wiped to an empty string — the DOM shows the div removed and a section added. The class-swapping one keeps its text — one class attribute changed. It reproduces as "the form clears when I resize the window".' },
  { t: 'A hidden type change: a component defined inside a component', body: two(D(tsx(`export default function Long() {
  const [q, setQ] = useState('');
  function OTim() {        // ✗ a NEW function every render
    return <input value={q}
      onChange={(e) => setQ(e.target.value)} />;
  }
  return <div><OTim /> q = {q}</div>;
}`, { sm: true, hl: [3] }),
        tn(`$ npx eslint -f json src/app/doi-chieu/long/page.tsx | node tom-eslint.cjs\n${ESL}`, { fs: 13, wrap: 54, title: 'npx eslint' })),
      D(cmp(['Click the box, type "abc"', 'measured'], [['state q', `<b>${L.go.q}</b>`], ['input value', `"${L.go.value}"`], ['document.activeElement', `<b>${L.go.active}</b> — focus lost`]], { hl: [0] }),
        box('Why', 'Every render of <code>Long</code> creates a brand-new <code>OTim</code> function — a <b>new type</b> at the same slot. React unmounts the old input and mounts a new one after the first key, so focus is gone. Fix: define components at module top level.', 'do2')), ''),
    en: 'A hidden type change. A component defined inside another component is a brand-new function on every render, so to React it is a new type each time. Measured: click the box, type a b c — state holds only "a", the input shows "a", and focus has fallen back to the body. ESLint\'s static-components rule says: cannot create components during render. Define components at the top level of the module.' },
  { t: 'How React decides what to keep', body: steps([
      '<b>Compare slot by slot</b> — it walks the old and new trees in parallel and looks at the same slot on both sides. It does not search.',
      '<b>Same type, same slot → keep the DOM node</b> — the element stays, its state stays, only changed attributes are written. The fast path.',
      '<b>Different type → tear down and rebuild</b> — a <code>&lt;div&gt;</code> becoming <code>&lt;section&gt;</code> loses everything inside, including each child\'s state.',
      '<b>In a list, the key overrides position</b> — keys let React match items that moved; without them it falls back to position (Lesson 7.2).',
    ]) + box('One-line model', 'Position + type (+ key) answer one question: <i>"is this the same thing as before?"</i> Keep them stable and state survives; change them and state resets.', 'xanh'),
    en: 'How React decides what to keep, in four steps: compare slot by slot without searching; same type at the same slot keeps the DOM node and the state, writing only what changed; a different type tears down and rebuilds, losing everything inside; and in a list, a key overrides position. Position, type and key answer one question: is this the same thing as before?' },
  { t: 'The payoff: the smallest set of DOM operations', body: two(zm(cmp(['What changed (measured)', 'DOM records'], [
      ['wrapper type div → section', `${K.moLat.boc.length} (remove + add)`],
      ['3 clicks on a counter', '3 text changes'],
      ['same component, new props', '1 text change'],
      ['class swap at a breakpoint', '1 attribute'],
    ], { hl: [3] }), 1.1), D(flow([{ t: 'render', s: 'new element tree' }, { t: 'reconcile', s: 'diff by slot + type', mau: '#0070f3' }, { t: 'commit', s: 'minimal DOM writes', mau: '#15803d' }], { w: 600, h: 150, fs: 21 }),
      box('"Virtual DOM"', 'The element tree in memory that React compares before touching the real DOM. The comparison is cheap; the DOM writes are what cost — so React writes only the difference.', 'lam')), 'r46') +
    meter([['wrapper div → section', K.moLat.boc.length, '#b91c1c', 'remove + add'], ['3 clicks on a counter', K.moNguoi.nguoi.length - 1, '#0070f3', 'text'], ['new props, same component', 1, '#15803d', 'text'], ['class swap at 1000 px', K.moRong.dung.length, '#15803d', 'attribute']], { don: 'record(s)', w: 1110, rh: 38 }),
    en: 'The payoff: the smallest set of DOM operations. Measured: a wrapper type change cost two records, remove and add; three clicks cost three text changes; new props on the same component cost one text change; a class swap cost one attribute. Render builds a new element tree, reconciliation diffs it by slot and type, and commit writes only the difference.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Reconciliation', 'React compares the new element tree with the previous one'), kw('Diffing', 'compare by slot and element type to find changes'),
      kw('Same type = update', 'same type at the same slot: patch props in place, keep state'), kw('Different type = replace', 'type changes: unmount and rebuild the subtree'),
      kw('Virtual DOM', 'the in-memory tree React compares before touching the real DOM'), kw('Minimal DOM operations', 'only the real differences are written'),
      kw('Remount', 'unmount + mount: state reset, effects re-run'), kw('Static components', 'define components at module level, never inside render'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: reconciliation; diffing; same type means update; different type means replace; the virtual DOM; minimal DOM operations; remount; and static components.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Log ${c('mount')} / ${c('unmount')} in a child, flip its wrapper ${c('<div>')} ↔ ${c('<section>')} and read the log on ${c('next start')}`,
      `Put a ${c('MutationObserver')} on the container and count records: type swap vs class swap`,
      `Render ${c('<Counter name="A" />')} / ${c('<Counter name="B" />')} at one slot — explain why the count carries over`,
      `Run ${c('npx eslint')} on a component defined inside another and read ${c('static-components')}`,
    ]), box('Keep these', `<ul><li>Compare by slot, then type</li><li>Same type → patch, state kept</li><li>Different type → rebuild, state reset</li><li>Stable types, components at top level</li></ul>`, 'lam'), ''),
    en: 'Your turn: log mount and unmount, flip the wrapper, and read the log on next start; count DOM records for a type swap versus a class swap; render two counters at one slot and explain the shared count; and lint a component defined inside another. Keep: compare by slot then type; same type patches and keeps state; different type rebuilds and resets; keep types stable and components at the top level.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Lists, keys & render performance', bai: '7.1' }, S);
