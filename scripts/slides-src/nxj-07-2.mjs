/*DU_LIEU*/
const DU_LIEU = {
 "n7-2:file:src/app/khoa-ds/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\ntype Muc = { id: number; ten: string };\nconst BAN_DAU: Muc[] = [{ id: 1, ten: 'An' }, { id: 2, ten: 'Bình' }, { id: 3, ten: 'Chi' }];\nconst gan: Record<string, number> = {};                     // đếm lần GẮN (mount) mỗi danh sách — để đo\nif (typeof window !== 'undefined') Object.assign(window, { __gan: gan });\n\n// mỗi hàng có state RIÊNG: ô tick + ô ghi chú\nfunction Hang({ ten, nhom }: { ten: string; nhom: string }) {\n  const [tick, setTick] = useState(false);\n  const [ghi, setGhi] = useState('');\n  useEffect(() => { gan[nhom] = (gan[nhom] ?? 0) + 1; }, [nhom]);\n  return (\n    <li className=\"flex items-center gap-2\">\n      <input type=\"checkbox\" checked={tick} onChange={(e) => setTick(e.target.checked)} />\n      <span className=\"w-12\">{ten}</span>\n      <input value={ghi} onChange={(e) => setGhi(e.target.value)} className=\"w-24 border px-1\" />\n    </li>\n  );\n}\n\n// 7.1: cùng type cùng ô ⇒ chung state · key khác ⇒ hai component khác nhau\nfunction DemNguoi({ ten }: { ten: string }) {\n  const [n, setN] = useState(0);\n  return <button id=\"dem\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">{ten}: {n}</button>;\n}\n\nexport default function KhoaDs() {\n  const [ds, setDs] = useState(BAN_DAU);\n  const [laAn, setLaAn] = useState(true);\n  return (\n    <div className=\"grid grid-cols-2 gap-x-6 gap-y-2 p-6 font-sans text-lg\">\n      <div id=\"cot-i\"><p className=\"font-bold\">key={'{i}'}</p>\n        <ul id=\"ds-i\">{ds.map((m, i) => <Hang key={i} ten={m.ten} nhom=\"i\" />)}</ul></div>\n      <div id=\"cot-id\"><p className=\"font-bold\">key={'{m.id}'}</p>\n        <ul id=\"ds-id\">{ds.map((m) => <Hang key={m.id} ten={m.ten} nhom=\"id\" />)}</ul></div>\n      <p><button id=\"xoa-dau\" onClick={() => setDs(ds.slice(1))} className=\"rounded border px-2\">xoá dòng đầu</button></p>\n      <p><button id=\"doi-nguoi\" onClick={() => setLaAn(!laAn)} className=\"rounded border px-2\">đổi người</button>{' '}\n        {laAn ? <DemNguoi key=\"an\" ten=\"An\" /> : <DemNguoi key=\"binh\" ten=\"Bình\" />}</p>\n    </div>\n  );\n}\n",
 "n7-2:file:src/app/khoa-ds/ngau-nhien/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\nconst gan = { i: 0, nn: 0 };                                // đếm lần GẮN mỗi ô — để đo\nif (typeof window !== 'undefined') Object.assign(window, { __ganNN: gan });\n\nfunction Dong({ id, ghi, doi, nhom }: { id: string; ghi: string; doi: (v: string) => void; nhom: 'i' | 'nn' }) {\n  useEffect(() => { gan[nhom]++; }, [nhom]);\n  return <li><input id={id} value={ghi} onChange={(e) => doi(e.target.value)} className=\"w-40 border px-1\" /></li>;\n}\n\nexport default function NgauNhien() {\n  const [a, setA] = useState(['', '', '']);\n  const [b, setB] = useState(['', '', '']);\n  const sua = (ds: string[], dat: (x: string[]) => void, i: number) => (v: string) => dat(ds.map((g, j) => (j === i ? v : g)));\n  return (\n    <div className=\"grid grid-cols-2 gap-6 p-6 font-sans text-lg\">\n      <ul><li className=\"font-bold\">key={'{i}'}</li>\n        {a.map((g, i) => <Dong key={i} id={`i-${i}`} ghi={g} doi={sua(a, setA, i)} nhom=\"i\" />)}</ul>\n      <ul><li className=\"font-bold\">key={'{Math.random()}'}</li>\n        {b.map((g, i) => <Dong key={Math.random()} id={`nn-${i}`} ghi={g} doi={sua(b, setB, i)} nhom=\"nn\" />)}</ul>\n    </div>\n  );\n}\n",
 "n7-2:file:src/app/khoa-ds/trung/page.tsx": "'use client';\nconst ds = [{ id: 1, ten: 'An' }, { id: 1, ten: 'Bình' }, { id: 2, ten: 'Chi' }];   // ✗ hai phần tử cùng id 1\n\nexport default function Trung() {\n  return <ul className=\"p-6 font-sans text-lg\">{ds.map((m) => <li key={m.id}>{m.ten}</li>)}</ul>;\n}\n",
 "n7-2:trang": "$ npm run build 2>&1 | grep -E 'Compiled|khoa-ds'\n✓ Compiled successfully in 884ms\n├ ○ /khoa-ds\n├ ○ /khoa-ds/ngau-nhien\n├ ○ /khoa-ds/trung\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint -f json src/app/khoa-ds/ngau-nhien/page.tsx | node tom-eslint.cjs\n21:37 error react-hooks/purity — Error: Cannot call impure function during render\n$ npx eslint -f json src/app/khoa-ds/page.tsx | node tom-eslint.cjs; echo \"khoa-ds/page.tsx: $(npx eslint src/app/khoa-ds/page.tsx | grep -c error) lỗi\"\nkhoa-ds/page.tsx: 0 lỗi",
 "n7-2:mo": "$ curl -s -o /dev/null -w 'next start GET /khoa-ds → %{http_code}\\n' localhost:19359/khoa-ds\nnext start GET /khoa-ds → 200\n$ curl -s -o /dev/null -w 'next dev GET /khoa-ds/trung → %{http_code}\\n' localhost:19360/khoa-ds/trung\nnext dev GET /khoa-ds/trung → 200",
 "n7-2:dung": "",
 "anh-nxj-7-2:kd-truoc": {
  "url": "http://127.0.0.1:19359/khoa-ds",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#cot-i": [
    24,
    24,
    284,
    118
   ],
   "#cot-id": [
    332,
    24,
    284,
    118
   ],
   "#xoa-dau": [
    24,
    150,
    130,
    30
   ],
   "#doi-nguoi": [
    332,
    150,
    94,
    30
   ],
   "#dem": [
    430,
    150,
    62,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-2:kd-sau": {
  "url": "http://127.0.0.1:19359/khoa-ds",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#cot-i": [
    24,
    24,
    284,
    88
   ],
   "#cot-id": [
    332,
    24,
    284,
    88
   ],
   "#xoa-dau": [
    24,
    120,
    130,
    30
   ],
   "#doi-nguoi": [
    332,
    120,
    94,
    30
   ],
   "#dem": [
    430,
    120,
    62,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-2:kd-nguoi": {
  "url": "http://127.0.0.1:19359/khoa-ds",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#cot-i": [
    24,
    24,
    284,
    88
   ],
   "#cot-id": [
    332,
    24,
    284,
    88
   ],
   "#xoa-dau": [
    24,
    120,
    130,
    30
   ],
   "#doi-nguoi": [
    332,
    120,
    94,
    30
   ],
   "#dem": [
    430,
    120,
    77,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-2:kd-start": {
  "url": "http://127.0.0.1:19359/khoa-ds",
  "vp": [
   640,
   250
  ],
  "rect": {
   "#cot-i": [
    24,
    24,
    284,
    88
   ],
   "#cot-id": [
    332,
    24,
    284,
    88
   ],
   "#xoa-dau": [
    24,
    120,
    130,
    30
   ],
   "#doi-nguoi": [
    332,
    120,
    94,
    30
   ],
   "#dem": [
    430,
    120,
    62,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "gan0": {
    "i": 3,
    "id": 3
   },
   "truoc": {
    "i": [
     {
      "ten": "An",
      "tick": false,
      "ghi": ""
     },
     {
      "ten": "Bình",
      "tick": true,
      "ghi": "ghi B"
     },
     {
      "ten": "Chi",
      "tick": false,
      "ghi": ""
     }
    ],
    "id": [
     {
      "ten": "An",
      "tick": false,
      "ghi": ""
     },
     {
      "ten": "Bình",
      "tick": true,
      "ghi": "ghi B"
     },
     {
      "ten": "Chi",
      "tick": false,
      "ghi": ""
     }
    ]
   },
   "sau": {
    "i": [
     {
      "ten": "Bình",
      "tick": false,
      "ghi": "",
      "goc": "An"
     },
     {
      "ten": "Chi",
      "tick": true,
      "ghi": "ghi B",
      "goc": "Bình"
     }
    ],
    "id": [
     {
      "ten": "Bình",
      "tick": true,
      "ghi": "ghi B",
      "goc": "Bình"
     },
     {
      "ten": "Chi",
      "tick": false,
      "ghi": "",
      "goc": "Chi"
     }
    ]
   },
   "mo": {
    "i": [
     "-LI(Chi)",
     "text An→Bình",
     "text Bình→Chi"
    ],
    "id": [
     "-LI(An)"
    ]
   },
   "gan1": {
    "i": 3,
    "id": 3
   },
   "dem0": "An: 3",
   "dem1": "Bình: 0",
   "dem2": "An: 0"
  }
 },
 "anh-nxj-7-2:nn-sau": {
  "url": "http://127.0.0.1:19359/khoa-ds/ngau-nhien",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#i-0": [
    24,
    52,
    160,
    30
   ],
   "#nn-0": [
    332,
    52,
    160,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-7-2:nn-start": {
  "url": "http://127.0.0.1:19359/khoa-ds/ngau-nhien",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#i-0": [
    24,
    52,
    160,
    30
   ],
   "#nn-0": [
    332,
    52,
    160,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "gan0": {
    "i": 3,
    "nn": 3
   },
   "i": {
    "value": "abc",
    "active": "i-0"
   },
   "nn": {
    "value": "a",
    "active": "BODY"
   },
   "gan1": {
    "i": 3,
    "nn": 15
   }
  }
 },
 "anh-nxj-7-2:trung-dev": {
  "url": "http://127.0.0.1:19360/khoa-ds/trung",
  "vp": [
   640,
   160
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
   },
   {
    "kieu": "error",
    "chu": "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. 1"
   }
  ],
  "ketQua": {
   "chu": "An\nBình\nChi"
  }
 },
 "anh-nxj-7-2:kd-dev": {
  "url": "http://127.0.0.1:19360/khoa-ds",
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
   "gan0": {
    "i": 6,
    "id": 6
   }
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, zm, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-07-2', code: 'NXJ 7.2', title: 'Keys: identity in a list', sub: 'Chapter 7 · Lesson 7.2' };
const O = (k) => { const v = DU_LIEU[`n7-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-7-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-07-2', ten, o);
const K = AN('kd-start').ketQua, N = AN('nn-start').ketQua, KDV = AN('kd-dev').ketQua;
const TR = O('trang'), P = O('file:src/app/khoa-ds/page.tsx'), PN = O('file:src/app/khoa-ds/ngau-nhien/page.tsx');
for (const s of ['<Hang key={i} ten={m.ten} nhom="i" />', '<Hang key={m.id} ten={m.ten} nhom="id" />', '<DemNguoi key="an" ten="An" />', 'onClick={() => setDs(ds.slice(1))}']) if (!P.includes(s)) throw new Error('khoa-ds/page.tsx không có: ' + s);
if (!PN.includes('key={Math.random()}')) throw new Error('ngau-nhien đổi');
const J = (a) => JSON.stringify(a);
const hang = (r) => `${r.ten}${r.tick ? ' ☑' : ' ☐'}${r.ghi ? ` "${r.ghi}"` : ''}`;
if (J(K.sau.i.map(hang)) !== J(['Bình ☐', 'Chi ☑ "ghi B"']) || J(K.sau.id.map(hang)) !== J(['Bình ☑ "ghi B"', 'Chi ☐'])
  || J(K.mo.i) !== J(['-LI(Chi)', 'text An→Bình', 'text Bình→Chi']) || J(K.mo.id) !== J(['-LI(An)'])
  || J(K.sau.i.map((r) => r.goc)) !== J(['An', 'Bình']) || J(K.sau.id.map((r) => r.goc)) !== J(['Bình', 'Chi'])
  || K.dem0 !== 'An: 3' || K.dem1 !== 'Bình: 0' || K.dem2 !== 'An: 0' || K.gan1.i !== 3 || KDV.gan0.i !== 6) throw new Error('số đo 7.2 đổi');
if (N.i.value !== 'abc' || N.i.active !== 'i-0' || N.nn.value !== 'a' || N.nn.active !== 'BODY' || N.gan1.i !== 3 || N.gan1.nn !== 15) throw new Error('ngẫu nhiên 7.2 đổi');
const TRUNG = AN('trung-dev').console.find((x) => /same key/.test(x.chu)).chu;
if (!/Encountered two children with the same key/.test(TRUNG) || AN('kd-dev').console.some((x) => /same key/.test(x.chu))) throw new Error('trùng key đổi');
const ESL = TR.split('\n').find((l) => /react-hooks\/purity/.test(l)), ESL0 = TR.split('\n').find((l) => /^khoa-ds\/page\.tsx: \d+ lỗi/.test(l));
if (!ESL || !/Cannot call impure function during render/.test(ESL) || ESL0 !== 'khoa-ds/page.tsx: 0 lỗi') throw new Error('ESLint 7.2 đổi');
const TRUNG1 = TRUNG.replace('`%s`', '`1`').replace(/ 1$/, '').split(' — ')[0];

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.2', t: 'Keys: identity in a list', sub: 'Why a list needs keys — and why the array index is the wrong key',
    en: 'Lesson seven point two: keys. Reconciliation matches elements by position. That breaks down for a list, because items get inserted, removed and reordered. The key prop gives each item a stable identity, so React can follow it through those changes.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why position is not enough in a list — and what a key tells React</li>
    <li>The index-as-key bug, measured: a tick and a note move to the wrong row</li>
    <li>What React really did to the DOM: which <code>&lt;li&gt;</code> nodes it kept, removed and rewrote</li>
    <li>Keys made during render (<code>Math.random()</code>): focus lost after one key — measured</li>
    <li>Unique among siblings · stable · and a key change as a <b>reset</b> on purpose</li></ul>`,
    en: 'Five takeaways: why position is not enough in a list; the index-as-key bug, measured; what React really did to the DOM nodes; keys made during render and the focus they destroy; and the rules — unique among siblings, stable across renders — plus changing a key on purpose to reset state.' },
  { t: 'What a key does', body: two(D(tsx(`{todos.map((todo) => (
  <TodoRow key={todo.id} todo={todo} />
))}`, { hl: [2] }), box('Match by key, not by position', 'In a list React matches old and new items <b>by key</b>. "Key 42 is still here, just at a new index — keep its DOM node and its state, only move it." Without keys it falls back to position and gets it wrong as soon as the list changes shape.', 'xanh')),
      icards([['link', 'Identity', 'Answers "is it the same item?" — not "where is it in the array?"'], ['box', 'From the data', 'a database id, a slug, a uuid made when the item was created'], ['warn', 'Not the position', 'position changes on insert, delete and sort — identity must not']], 1), 'r64'),
    en: 'What a key does. When React reconciles a list it matches old and new items by key, not by position. A stable key lets it say: the item with key forty-two is still here, just at a new index — keep its DOM node and its state, only move it. Without keys React falls back to position and gets it wrong as soon as the list changes shape.' },
  { t: 'The index-as-key bug — measured on next start', body: two(D(tsx(`{ds.map((m, i) => <Hang key={i} ten={m.ten} />)}     // ❌
{ds.map((m) => <Hang key={m.id} ten={m.ten} />)}     // ✅
// each Hang has its OWN state: a tick + a note`, { sm: true, hl: [1] }),
      cmp(['After "xoá dòng đầu" (delete An)', 'key={i}', 'key={m.id}'], [
        ['row 1', `<b>${hang(K.sau.i[0])}</b>`, hang(K.sau.id[0])], ['row 2', `<b>${hang(K.sau.i[1])}</b> ✗`, hang(K.sau.id[1])]], { hl: [1] }),
      box('Read it', 'You ticked <b>Bình</b> and wrote "ghi B" on Bình. With <code>key={i}</code> the tick and the note now sit on <b>Chi</b>. The data is fine — the state React kept is attached to the wrong item.', 'do2')),
      D(B('kd-truoc', { vp: 640, h: 165, w: 440, url: 'before: Bình ticked + "ghi B"', mark: [[24, 82, 230, 30, ''], [332, 82, 230, 30, '']] }),
        B('kd-sau', { vp: 640, h: 165, w: 440, url: 'after deleting An', mark: [[24, 82, 230, 30, ''], [332, 52, 230, 30, '']] })), 'r64'),
    en: 'The index-as-key bug, measured. Two copies of the same list, each row with its own tick and note. Tick Bình, write "ghi B" on Bình, then delete the first row, An. With key equals i, the tick and the note now sit on Chi. With key equals the id they stay on Bình. The data is fine; the state React kept is attached to the wrong item.' },
  { t: 'What React actually did to the DOM', body: zm(two(
      cmp(['key={i}: keys 0,1,2 → 0,1', 'MutationObserver'], K.mo.i.map((x) => [x.startsWith('-') ? 'key 2 gone → remove the <b>last</b> li' : 'keys 0, 1 kept → rewrite text', `<code>${x}</code>`]), { hl: [0] }),
      D(cmp(['key={m.id}: keys 1,2,3 → 2,3', 'MutationObserver'], K.mo.id.map((x) => ['key 1 gone → remove <b>An\'s</b> li', `<code>${x}</code>`]), { hl: [0] }),
        meter([['key={i}', K.mo.i.length, '#b91c1c'], ['key={m.id}', K.mo.id.length, '#15803d']], { don: 'DOM record(s)', w: 430, nhan: 120, rh: 44 })), ''), 1.08) +
    two(D(box('The kept nodes', `Rows now showing ${K.sau.i.map((r) => `<b>${r.ten}</b>`).join(', ')} are the <b>old</b> nodes of ${K.sau.i.map((r) => `<b>${r.goc}</b>`).join(', ')} — with their state. So An\'s empty state is shown as Bình, Bình\'s tick as Chi.`, 'do2'),
      box('One record', `Nodes ${K.sau.id.map((r) => `<b>${r.goc}</b>`).join(', ')} stay with their own data — no text rewritten, state where it belongs.`, 'xanh')),
      B('kd-sau', { vp: 640, h: 165, w: 470, url: 'after deleting An', mark: [[24, 52, 230, 60, 'old An, Bình nodes'], [332, 52, 230, 60, 'Bình, Chi nodes']] }), 'r64'),
    en: 'What React actually did, read from a mutation observer. With index keys, keys zero, one, two became zero, one: key two disappeared, so React removed the last li — Chi\'s node — and rewrote the text of the two nodes it kept: An became Bình, Bình became Chi. Those nodes carried their state with them. With id keys there is exactly one record: remove An\'s li.' },
  { t: 'Rules for keys', body: zm(cmp(['', 'Rule'], [
      ['✅ Do', 'use a stable, unique id from the data: <code>item.id</code>, a database key, a slug'],
      ['❌ Don\'t', 'use the array index when the list can reorder, or insert/delete anywhere but the end'],
      ['❌ Don\'t', 'use <code>Math.random()</code> or any new value per render — every item gets a new key every time'],
      ['🟡 OK', 'index only for a static list that never reorders, whose items hold no state'],
    ], { hl: [1] }), 1.12) + two(tn(`$ npx eslint src/app/khoa-ds/page.tsx   # uses key={i}\n${ESL0}`, { fs: 15, title: 'ESLint does not flag key={i}' }),
      box('No id in the data?', 'Generate one <b>when the item is created</b> (e.g. <code>crypto.randomUUID()</code> in the add handler) and store it with the item — never in the key expression at render time.', 'lam'), ''),
    en: 'The rules. Do use a stable, unique id from the data. Don\'t use the index when the list can reorder or change anywhere but the end. Don\'t use Math.random or anything new per render. The index is acceptable only for a static list whose items hold no state. Note: ESLint does not flag key equals i — measured, zero errors. If the data has no id, create one when the item is created and store it.' },
  { t: 'A key made during render: Math.random()', body: two(D(tsx(`// each row: <input value={ghi} onChange={…} />
{a.map((g, i) => <Dong key={i} … />)}
{b.map((g, i) => <Dong key={Math.random()} … />)}   // ❌`, { sm: true, hl: [3] }),
        tn(`$ npx eslint -f json src/app/khoa-ds/ngau-nhien/page.tsx | node tom-eslint.cjs\n${ESL}`, { fs: 13, wrap: 60, title: 'npx eslint' }),
        B('nn-sau', { vp: 640, h: 150, w: 600, url: 'next start · /khoa-ds/ngau-nhien', mark: [[24, 52, 160, 30, ''], [332, 52, 160, 30, '']] })),
      D(cmp(['Click row 1, type "abc"', 'key={i}', 'key={Math.random()}'], [
        ['value', `"${N.i.value}"`, `<b>"${N.nn.value}"</b>`], ['focus after typing', `#${N.i.active}`, `<b>${N.nn.active}</b>`], ['mounts in total', `${N.gan1.i}`, `<b>${N.gan1.nn}</b>`]], { hl: [0, 1] }),
        box('Why 15', `Every render of the page gives every row a brand-new key, so React unmounts all rows and mounts new ones: 3 at load + 3 per render × 4 renders (3 keystrokes in the other list, 1 here). The warning disappears; the worst behaviour is guaranteed.`, 'do2')), ''),
    en: 'A key made during render. Same rows, one list keyed by index, one by Math.random. Click the first row and type a, b, c. Index keys: "abc", focus stays. Random keys: only "a", and focus falls to the body — after the first keystroke the input was replaced. The random list was mounted fifteen times: three at load and three on every render of the page, even renders caused by typing in the other list. ESLint flags it: cannot call an impure function during render.' },
  { t: 'Unique among siblings — not globally', body: two(D(tsx(`const ds = [{ id: 1, ten: 'An' }, { id: 1, ten: 'Bình' },
            { id: 2, ten: 'Chi' }];   // ✗ two items with id 1
ds.map((m) => <li key={m.id}>{m.ten}</li>)`, { sm: true, hl: [1] }),
        tn(`next dev · console.error:\n${TRUNG1} — Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.`, { fs: 14, wrap: 60, title: 'Chromium console (next dev)' })),
      D(box('Siblings only', 'On <code>/khoa-ds</code> both lists use keys <code>1</code> and <code>2</code> — two different parents, so <b>no warning</b> (measured: dev console clean). React only compares keys inside one parent.', 'xanh'),
        box('Stable across renders', 'The same item must get the same key every render. A key that changes is not "a bit slower" — it is an unmount and a fresh mount (lesson 7.3, reason 4).', 'lam')), ''),
    en: 'Keys must be unique among siblings, not globally. Two items with id one in the same list: next dev prints "Encountered two children with the same key" — non-unique keys may cause children to be duplicated or omitted. But on our page both lists use keys one and two under different parents, and the console stays clean. And the same item must get the same key on every render.' },
  { t: 'A key change resets state — on purpose', body: tsx(`function DemNguoi({ ten }: { ten: string }) {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{ten}: {n}</button>;
}
// 7.1: same slot, same type → Bình inherited An's count. Now: a key each
{laAn ? <DemNguoi key="an" ten="An" /> : <DemNguoi key="binh" ten="Bình" />}`, { sm: true, hl: [6] }) +
      two(cmp(['Action', '7.1 (no key)', '7.2 (key)'], [['3 clicks on An', 'An: 3', K.dem0], ['switch to Bình', 'Bình: 3 ✗', `<b>${K.dem1}</b>`], ['switch back to An', '—', `<b>${K.dem2}</b>`]], { hl: [1] }),
        B('kd-nguoi', { vp: 640, h: 165, w: 440, url: 'after "đổi người"', mark: [[430, 120, 66, 30, '']] }), 'r64') +
      box('Reset a form', 'The idiomatic way to clear a form when the selected record changes: <code>&lt;EditForm key={user.id} user={user} /&gt;</code> — a new key mounts a fresh form (measured in lesson 3.4).', 'xanh'),
    en: 'A key change resets state, on purpose. The surprise from lesson seven point one: Bình inherited An\'s count. Give the two a different key and React treats them as different components: An three, switch, Bình zero, switch back, An zero — the unmounted An lost its state. That is the idiomatic way to reset a form when the selected record changes.' },
  { t: 'What a key is for', body: steps([
      '<b>It answers "is this the same item?"</b> — not "where is it in the array?". A stable id lets React follow an item from position 1 to position 4.',
      '<b>It must come from the data</b> — a database id, a slug, a uuid created with the item: something that belongs to the item, not to its current position.',
      '<b>Unique among siblings, not globally</b> — two different lists may both use key "1". React compares only within one parent.',
      '<b>It is also a deliberate reset</b> — change a component\'s key to remount it from scratch, e.g. clear a form when the record changes.',
    ]),
    en: 'What a key is for, in four points. It answers "is this the same item", not "where is it". It must come from the data, not from the position. It must be unique among siblings, not globally. And changing it is a deliberate reset: a new key mounts the component from scratch.' },
  { t: 'Symptoms of a key bug — and when the index is fine', body: two(icards([
      ['warn', 'State jumps rows', 'a checkbox ticked on the wrong item after an insert, delete or sort'],
      ['warn', 'Text moves to a neighbour', 'an input keeps the text of a deleted neighbour'],
      ['warn', 'Focus lost on every key', 'the key changes every render (random / uuid in render)'],
      ['warn', 'Animation on the wrong card', 'an effect runs on the wrong item'],
    ], 2), D(box('First suspect', 'List items behave strangely after the list changes? Suspect <code>key={index}</code> first. Switching to <code>key={item.id}</code> usually fixes it for good.', 'do2'),
      box('When index is OK', 'A static list that never reorders, never inserts or deletes in the middle, and whose rows hold no state (no input, no checkbox, no effect).', 'lam')), 'r64'),
    en: 'Symptoms of a key bug: state or focus jumps to the wrong row after an insert, delete or sort; a checkbox ticked on the wrong item; an input keeping a deleted neighbour\'s text; focus lost on every keystroke; an animation on the wrong card. Suspect key equals index first. The index is fine only for a static list whose rows hold no state.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('key', 'a stable identity React uses to match items across renders'), kw('Stable id', 'a value tied to the data (a DB id), not to the position'),
      kw('Index as key', 'fragile — reorder/insert makes React reuse the wrong item'), kw('Identity', 'which item is which, so state and DOM follow the right row'),
      kw('Unique among siblings', 'keys need only be unique within one list'), kw('State corruption', 'a wrong key moves input state to the wrong item'),
      kw('Reset by key', 'a new key = unmount + fresh mount, on purpose'), kw('Impure render', 'Math.random() in render — flagged by react-hooks/purity'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: key; stable id; index as key; identity; unique among siblings; state corruption; reset by key; and impure render.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Render an editable list with ${c('key={i}')}, type in a row, delete a row above it — watch the text jump`,
      `Switch to ${c('key={item.id}')} and confirm the bug is gone; count DOM records with a ${c('MutationObserver')}`,
      `Try ${c('key={Math.random()}')}: type "abc" and see where focus goes; read ESLint ${c('purity')}`,
      `Reset a form on purpose with ${c('key={record.id}')}`,
    ]), box('Keep these', `<ul><li>Key = identity, from the data</li><li>Index only for static, stateless lists</li><li>Never create keys during render</li><li>Unique among siblings · a new key resets</li></ul>`, 'lam'), ''),
    en: 'Your turn: reproduce the index-key bug by deleting a row above the one you typed in; switch to the id and count DOM records; try a random key and watch focus; and reset a form on purpose with a key. Keep: a key is identity from the data; index only for static, stateless lists; never create keys during render; unique among siblings, and a new key resets.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Lists, keys & render performance', bai: '7.2' }, S);
