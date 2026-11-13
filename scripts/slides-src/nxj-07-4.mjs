/*DU_LIEU*/
const DU_LIEU = {
 "n7-4:file:src/app/memo-con/page.tsx": "'use client';\nimport { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';\n\nconst dem: Record<string, number> = {};                     // số lần render ĐÃ commit — để đo\nif (typeof window !== 'undefined') Object.assign(window, { __dem: dem });\nfunction useDem(ten: string) {\n  useEffect(() => { dem[ten] = (dem[ten] ?? 0) + 1; });\n}\nfunction go() {}\n\ntype P = { label: string; style?: { margin: number }; onClick?: () => void };\nfunction Thuong({ label }: P) { useDem('thuong'); return <li>thường · {label}</li>; }\nconst Memo = memo(function Memo({ label }: P) { useDem('memo'); return <li>memo · {label}</li>; });\nconst MemoInline = memo(function MemoInline({ label }: P) { useDem('memoInline'); return <li>memo + prop viết thẳng · {label}</li>; });\nconst MemoOnDinh = memo(function MemoOnDinh({ label }: P) { useDem('memoOnDinh'); return <li>memo + useMemo/useCallback · {label}</li>; });\n\nconst Ctx = createContext(0);\nconst MemoDocCtx = memo(function MemoDocCtx({ label }: P) { const v = useContext(Ctx); useDem('memoDocCtx'); return <li>memo đọc context · {label} · {v}</li>; });\nconst MemoState = memo(function MemoState({ label }: P) {\n  const [n, setN] = useState(0);\n  useDem('memoState');\n  return <li><button id=\"memo-state\" onClick={() => setN(n + 1)} className=\"rounded border px-1\">memo có state · {label}: {n}</button></li>;\n});\n\nexport default function MemoCon() {\n  const [n, setN] = useState(0);\n  const [v, setV] = useState(0);\n  const style = useMemo(() => ({ margin: 4 }), []);\n  const onClick = useCallback(() => go(), []);\n  return (\n    <Ctx value={v}>\n      <div className=\"space-y-1 p-4 font-sans text-base\">\n        <p className=\"space-x-2\">\n          <button id=\"cha\" onClick={() => setN(n + 1)} className=\"rounded border px-2\">cha: {n}</button>\n          <button id=\"ctx\" onClick={() => setV(v + 1)} className=\"rounded border px-2\">context: {v}</button>\n        </p>\n        <ul>\n          <Thuong label=\"x\" />\n          <Memo label=\"x\" />\n          <MemoInline label=\"x\" style={{ margin: 4 }} onClick={() => go()} />\n          <MemoOnDinh label=\"x\" style={style} onClick={onClick} />\n          <MemoDocCtx label=\"x\" />\n          <MemoState label=\"x\" />\n        </ul>\n      </div>\n    </Ctx>\n  );\n}\n",
 "n7-4:file:src/app/memo-con/bang/page.tsx": "'use client';\nimport { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';\n\n// 500 hàng \"không tầm thường\": định dạng tiền + ngày theo tiếng Việt ở mỗi lần render\nconst HANG = Array.from({ length: 500 }, (_, i) => ({ id: i, ten: `Bác sĩ ${i + 1}`, luong: 9_000_000 + i * 7919, ngay: new Date(2026, i % 12, 1 + (i % 28)) }));\ntype R = (typeof HANG)[number];\ntype Kieu = 'thuong' | 'memoHong' | 'memoDung';\nconst ms: Record<Kieu, number[]> = { thuong: [], memoHong: [], memoDung: [] };      // bấm → commit (ms)\nif (typeof window !== 'undefined') Object.assign(window, { __ms: ms });\n\nfunction Hang({ r, onSelect }: { r: R; onSelect: (id: number) => void }) {\n  return (\n    <tr onClick={() => onSelect(r.id)}>\n      <td>{r.ten}</td><td>{r.luong.toLocaleString('vi-VN')} ₫</td><td>{r.ngay.toLocaleDateString('vi-VN')}</td>\n    </tr>\n  );\n}\nconst HangMemo = memo(Hang);\n\nfunction Bang({ kieu }: { kieu: Kieu }) {\n  const [n, setN] = useState(0);                            // một bộ đếm KHÔNG liên quan tới các hàng\n  const [, setChon] = useState(-1);\n  const t0 = useRef(0);\n  useLayoutEffect(() => { if (t0.current) { ms[kieu].push(performance.now() - t0.current); t0.current = 0; } });\n  const onSelect = useCallback((id: number) => setChon(id), []);\n  return (\n    <div className=\"h-40 overflow-hidden rounded border p-1 text-xs\">\n      <button id={`b-${kieu}`} onClick={() => { t0.current = performance.now(); setN(n + 1); }} className=\"rounded border px-2\">{kieu}: {n}</button>\n      <table><tbody>\n        {HANG.map((r) =>\n          kieu === 'thuong' ? <Hang key={r.id} r={r} onSelect={(id) => setChon(id)} />\n          : kieu === 'memoHong' ? <HangMemo key={r.id} r={r} onSelect={(id) => setChon(id)} />\n          : <HangMemo key={r.id} r={r} onSelect={onSelect} />)}\n      </tbody></table>\n    </div>\n  );\n}\n\nexport default function BangMemo() {\n  return <div className=\"grid grid-cols-3 gap-2 p-2 font-sans\"><Bang kieu=\"thuong\" /><Bang kieu=\"memoHong\" /><Bang kieu=\"memoDung\" /></div>;\n}\n",
 "n7-4:trang": "$ npm run build 2>&1 | grep -E 'Compiled|memo-con'\n✓ Compiled successfully in 1053ms\n├ ○ /memo-con\n├ ○ /memo-con/bang\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint src/app/memo-con && echo 'eslint: 0 lỗi'\neslint: 0 lỗi",
 "n7-4:c6": "$ grep -n reactCompiler next.config.ts\n4:  reactCompiler: true,                       // bật React Compiler (babel-plugin-react-compiler)\n$ npm run build 2>&1 | grep -E 'Compiled|memo-con'\n✓ Compiled successfully in 1262ms\n├ ○ /memo-con\n├ ○ /memo-con/bang\n$ grep -l memo_cache_sentinel .next/static/chunks/*.js | xargs grep -l 'memo + prop' | wc -l | xargs echo 'chunk memo-con đã qua Compiler:'\nchunk memo-con đã qua Compiler: 1",
 "n7-4:mo": "$ curl -s -o /dev/null -w 'c1 next start GET /memo-con → %{http_code}\\n' localhost:19363/memo-con\nc1 next start GET /memo-con → 200\n$ curl -s -o /dev/null -w 'c6 (Compiler) next start GET /memo-con → %{http_code}\\n' localhost:19364/memo-con\nc6 (Compiler) next start GET /memo-con → 200",
 "n7-4:dung": "",
 "anh-nxj-7-4:mc-c1-cha": {
  "url": "http://127.0.0.1:19363/memo-con",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#cha": [
    16,
    16,
    63,
    26
   ],
   "#ctx": [
    87,
    16,
    93,
    26
   ],
   "#memo-state": [
    16,
    166,
    158,
    26
   ]
  },
  "console": []
 },
 "anh-nxj-7-4:mc-c1": {
  "url": "http://127.0.0.1:19363/memo-con",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#cha": [
    16,
    16,
    63,
    26
   ],
   "#ctx": [
    87,
    16,
    92,
    26
   ],
   "#memo-state": [
    16,
    166,
    157,
    26
   ]
  },
  "console": [],
  "ketQua": {
   "dem0": {
    "thuong": 1,
    "memo": 1,
    "memoInline": 1,
    "memoOnDinh": 1,
    "memoDocCtx": 1,
    "memoState": 1
   },
   "demCha": {
    "thuong": 3,
    "memo": 1,
    "memoInline": 3,
    "memoOnDinh": 1,
    "memoDocCtx": 1,
    "memoState": 1
   },
   "demCtx": {
    "thuong": 5,
    "memo": 1,
    "memoInline": 5,
    "memoOnDinh": 1,
    "memoDocCtx": 3,
    "memoState": 1
   },
   "demState": {
    "thuong": 5,
    "memo": 1,
    "memoInline": 5,
    "memoOnDinh": 1,
    "memoDocCtx": 3,
    "memoState": 3
   }
  }
 },
 "anh-nxj-7-4:mc-c6": {
  "url": "http://127.0.0.1:19364/memo-con",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#cha": [
    16,
    16,
    63,
    26
   ],
   "#ctx": [
    87,
    16,
    92,
    26
   ],
   "#memo-state": [
    16,
    166,
    157,
    26
   ]
  },
  "console": [],
  "ketQua": {
   "dem0": {
    "thuong": 1,
    "memo": 1,
    "memoInline": 1,
    "memoOnDinh": 1,
    "memoDocCtx": 1,
    "memoState": 1
   },
   "demCha": {
    "thuong": 1,
    "memo": 1,
    "memoInline": 1,
    "memoOnDinh": 1,
    "memoDocCtx": 1,
    "memoState": 1
   },
   "demCtx": {
    "thuong": 1,
    "memo": 1,
    "memoInline": 1,
    "memoOnDinh": 1,
    "memoDocCtx": 3,
    "memoState": 1
   },
   "demState": {
    "thuong": 1,
    "memo": 1,
    "memoInline": 1,
    "memoOnDinh": 1,
    "memoDocCtx": 3,
    "memoState": 3
   }
  }
 },
 "anh-nxj-7-4:bang-c1": {
  "url": "http://127.0.0.1:19363/memo-con/bang",
  "vp": [
   960,
   260
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "ms": {
    "thuong": [
     7.899999976158142,
     6.300000011920929,
     5.699999988079071,
     5.599999964237213,
     5.699999988079071,
     5.900000035762787,
     5.699999988079071,
     5.5,
     5.600000023841858,
     5.399999976158142,
     5.5,
     5.5,
     5.5,
     5.299999952316284,
     5.5,
     5.5,
     5.399999976158142,
     5.5,
     5.299999952316284,
     5.400000035762787,
     5.199999988079071,
     5.400000035762787,
     5.399999976158142,
     5.400000035762787,
     5.100000023841858
    ],
    "memoHong": [
     5.5,
     5.600000023841858,
     5.5,
     5.600000023841858,
     5.599999964237213,
     5.800000011920929,
     6.400000035762787,
     6.400000035762787,
     6.399999976158142,
     6.400000035762787,
     6.399999976158142,
     6.300000011920929,
     6.199999988079071,
     6.199999988079071,
     6.100000023841858,
     5.699999988079071,
     5.799999952316284,
     5.699999988079071,
     6.199999988079071,
     5.900000035762787,
     6.299999952316284,
     5.800000011920929,
     5.699999988079071,
     5.600000023841858,
     5.600000023841858
    ],
    "memoDung": [
     0.40000003576278687,
     0.30000001192092896,
     0.40000003576278687,
     0.2999999523162842,
     0.3999999761581421,
     0.2999999523162842,
     0.3999999761581421,
     0.30000001192092896,
     0.20000004768371582,
     0.40000003576278687,
     0.30000001192092896,
     0.30000001192092896,
     0.40000003576278687,
     0.3999999761581421,
     0.2999999523162842,
     0.3999999761581421,
     0.40000003576278687,
     0.30000001192092896,
     0.3999999761581421,
     0.30000001192092896,
     0.40000003576278687,
     0.40000003576278687,
     0.30000001192092896,
     0.2999999523162842,
     0.2999999523162842
    ]
   }
  }
 },
 "anh-nxj-7-4:bang-c6": {
  "url": "http://127.0.0.1:19364/memo-con/bang",
  "vp": [
   960,
   260
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "ms": {
    "thuong": [
     2.699999988079071,
     1.5,
     1.300000011920929,
     1.199999988079071,
     1.100000023841858,
     1.100000023841858,
     1.199999988079071,
     1,
     1,
     1.0999999642372131,
     1.0999999642372131,
     1,
     1,
     1,
     1,
     0.9000000357627869,
     1,
     1,
     0.8999999761581421,
     0.9000000357627869,
     0.9000000357627869,
     1,
     1.300000011920929,
     1,
     1
    ],
    "memoHong": [
     1.300000011920929,
     1,
     1,
     1,
     1.100000023841858,
     1.0999999642372131,
     1.199999988079071,
     1.0999999642372131,
     1.100000023841858,
     1,
     0.8999999761581421,
     1.100000023841858,
     1,
     1.0999999642372131,
     1,
     1.199999988079071,
     0.8999999761581421,
     1,
     1,
     1,
     0.8999999761581421,
     1,
     1.100000023841858,
     1.100000023841858,
     1.100000023841858
    ],
    "memoDung": [
     0.3999999761581421,
     0.40000003576278687,
     0.30000001192092896,
     0.30000001192092896,
     0.2999999523162842,
     0.3999999761581421,
     0.40000003576278687,
     0.3999999761581421,
     0.40000003576278687,
     0.30000001192092896,
     0.30000001192092896,
     0.30000001192092896,
     0.19999998807907104,
     0.30000001192092896,
     0.2999999523162842,
     0.30000001192092896,
     0.40000003576278687,
     0.30000001192092896,
     0.30000001192092896,
     0.30000001192092896,
     0.30000001192092896,
     0.2999999523162842,
     0.40000003576278687,
     0.19999998807907104,
     0.30000001192092896
    ]
   }
  }
 },
 "anh-nxj-7-4:mc-c1-dau": {
  "url": "http://127.0.0.1:19363/memo-con",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#cha": [
    16,
    16,
    64,
    26
   ],
   "#ctx": [
    88,
    16,
    93,
    26
   ],
   "#memo-state": [
    16,
    166,
    158,
    26
   ]
  },
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, zm, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-07-4', code: 'NXJ 7.4', title: 'React.memo & skipping re-renders', sub: 'Chapter 7 · Lesson 7.4' };
const O = (k) => { const v = DU_LIEU[`n7-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-7-4:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-07-4', ten, o);
const M1 = AN('mc-c1').ketQua, M6 = AN('mc-c6').ketQua;
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const T1 = Object.fromEntries(Object.entries(AN('bang-c1').ketQua.ms).map(([k, v]) => [k, med(v)]));
const T6 = Object.fromEntries(Object.entries(AN('bang-c6').ketQua.ms).map(([k, v]) => [k, med(v)]));
const N1 = AN('bang-c1').ketQua.ms.thuong.length;
const TR = O('trang'), C6 = O('c6'), P = O('file:src/app/memo-con/page.tsx'), PB = O('file:src/app/memo-con/bang/page.tsx');
for (const s of ['<MemoInline label="x" style={{ margin: 4 }} onClick={() => go()} />', '<MemoOnDinh label="x" style={style} onClick={onClick} />', 'const onClick = useCallback(() => go(), []);']) if (!P.includes(s)) throw new Error('memo-con đổi: ' + s);
if (!PB.includes("<HangMemo key={r.id} r={r} onSelect={(id) => setChon(id)} />") || !PB.includes('<HangMemo key={r.id} r={r} onSelect={onSelect} />')) throw new Error('bang đổi');
const c1 = M1.demCha, c1x = M1.demCtx, c1s = M1.demState, c6 = M6.demCha, c6x = M6.demCtx;
if (c1.thuong !== 3 || c1.memo !== 1 || c1.memoInline !== 3 || c1.memoOnDinh !== 1 || c1x.memoDocCtx !== 3 || c1x.memo !== 1 || c1s.memoState !== 3
  || c6.thuong !== 1 || c6.memoInline !== 1 || c6x.memoDocCtx !== 3) throw new Error('số đo 7.4 đổi');
if (!(T1.memoDung < T1.thuong / 5) || !(T1.memoHong >= T1.thuong * 0.9) || !(T6.thuong < T1.thuong)) throw new Error('thời gian 7.4 đổi hình dạng');
if (!/eslint: 0 lỗi/.test(TR) || !/reactCompiler: true/.test(C6) || !/đã qua Compiler: 1/.test(C6)) throw new Error('ESLint/Compiler 7.4 đổi');
const f = (x) => x.toFixed(1);

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.4', t: 'React.memo &amp;<br>skipping re-renders', sub: 'Skip a child\'s render when its props are the same — and why stable references decide whether that works',
    en: 'Lesson seven point four: React.memo. Lesson seven point three showed a child re-renders every time its parent does, even with unchanged props. React.memo opts a component out of that: wrap it, and React skips re-rendering it when its props are the same as last time.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What <code>React.memo</code> does: a shallow <code>Object.is</code> comparison of every prop — measured</li>
    <li>The trap: an inline object or arrow makes memo useless — measured, and fixed with <code>useMemo</code>/<code>useCallback</code></li>
    <li>What memo does <b>not</b> block: context and the component\'s own state</li>
    <li>The cost, measured on 500 rows: memo can be <b>slower</b> than nothing</li>
    <li>React Compiler 1.0 doing it for you — measured on the same pages</li></ul>`,
    en: 'Five takeaways: what React.memo does, measured; the inline-prop trap and its fix; what memo does not block — context and own state; the cost on five hundred rows, where memo can be slower than nothing; and React Compiler doing the work for you.' },
  { t: 'What React.memo does', body: two(D(tsx(`const Row = React.memo(function Row({ label }) {
  return <li>{label}</li>;
});`, { hl: [1] }), box('Shallow comparison', 'A memoised component compares new props with the previous ones — <code>Object.is</code> on each prop. If all are equal, React reuses the previous output and <b>skips calling the function</b>.', 'lam')),
      D(cmp(['One parent, re-rendered 3 times', 'renders'], [['plain child (props unchanged)', `<b>${c1.thuong}</b>`], ['memo child (props unchanged)', `<b>${c1.memo}</b>`]], { hl: [1] }),
        B('mc-c1-cha', { vp: 640, h: 200, w: 480, url: 'next start · /memo-con', mark: [[16, 16, 63, 26, '×2']] }),
        box('Matches the lesson', 'Plain: renders at load and on both parent updates. Memo: once, then skipped twice. That is the whole feature — skip work when the input is identical.', 'xanh')), 'r46'),
    en: 'What React.memo does. A memoised component compares the new props with the previous ones, Object dot is on each prop. If all are equal, React reuses the previous output and skips calling the function. Measured: one parent rendered three times; the plain child rendered three times, the memo child once. That is the whole feature: skip work when the input is identical.' },
  { t: 'The trap: props must be referentially stable', body: tsx(`// ❌ memo useless — a new object and a new function every render
<MemoInline label="x" style={{ margin: 4 }} onClick={() => go()} />

// ✅ stabilise the references so memo can actually skip
const style = useMemo(() => ({ margin: 4 }), []);
const onClick = useCallback(() => go(), []);
<MemoOnDinh label="x" style={style} onClick={onClick} />`, { hl: [2, 7] }) +
      two(meter([['plain', c1.thuong, '#64748b'], ['memo, label only', c1.memo, '#15803d'], ['memo + inline object/arrow', c1.memoInline, '#b91c1c'], ['memo + useMemo/useCallback', c1.memoOnDinh, '#15803d']], { don: 'renders', w: 600, nhan: 290, rh: 40 }),
        box('Why they travel together', '<code>{ margin: 4 }</code> and <code>() =&gt; go()</code> are new references every render, so <code>Object.is</code> always says "changed". <code>React.memo</code> is pointless unless its object/function props are memoised too.', 'do2'), ''),
    en: 'The trap: props must be referentially stable. An inline style object and an inline arrow are new references on every render, so the shallow comparison always says "changed": measured, three renders, exactly like the plain child. Stabilise them with useMemo and useCallback and memo skips again: one render. That is why React.memo, useMemo and useCallback go together.' },
  { t: 'Memo only guards the props path', body: tsx(`const MemoDocCtx = memo(function MemoDocCtx({ label }) {
  const v = useContext(Ctx);        // reads a context
  …
});
const MemoState = memo(function MemoState({ label }) {
  const [n, setN] = useState(0);    // has its own state
  …
});`, { hl: [2, 6] }) +
      two(zm(cmp(['After…', 'memo, props only', 'memo + context', 'memo + own state'], [
        ['2 clicks on "context"', `${c1x.memo}`, `<b>${c1x.memoDocCtx}</b>`, `${c1x.memoState}`],
        ['2 clicks inside MemoState', `${c1s.memo}`, `${c1s.memoDocCtx}`, `<b>${c1s.memoState}</b>`],
      ], { hl: [0, 1] }), 1.05), box('Not a wall', 'A memoised component still re-renders when its own state changes or when a context it reads changes. Memo only compares <b>props</b>.', 'lam'), 'r64'),
    en: 'Memo only guards the props path. Two clicks that change a context value: the memo component that reads the context rendered three times anyway. Two clicks inside a memo component with its own state: three renders. A memoised component still re-renders for its own state and for any context it reads; memo only compares props.' },
  { t: 'The cost — 500 rows, measured', body: tsx(`// each row formats money + a date in Vietnamese
const HangMemo = memo(Hang);
// the table re-renders for an UNRELATED counter:
<Hang     … onSelect={(id) => setChon(id)} />   // plain
<HangMemo … onSelect={(id) => setChon(id)} />   // memo, new arrow
<HangMemo … onSelect={onSelect} />              // memo + useCallback`, { hl: [5] }) +
      two(meter([['plain rows', T1.thuong, '#64748b'], ['memo + inline arrow', T1.memoHong, '#b91c1c'], ['memo + useCallback', T1.memoDung, '#15803d']], { don: 'ms', w: 540, nhan: 210, rh: 56 }),
        B('bang-c1', { vp: 960, h: 170, w: 540, url: `/memo-con/bang · median of ${N1}`, mark: [] }), '') +
      box('Read it', `A broken memo is not "free": <b>${f(T1.memoHong)} ms</b> vs <b>${f(T1.thuong)} ms</b> without memo — every row still renders, plus a failed comparison each. Fixed: <b>${f(T1.memoDung)} ms</b> — the rows are skipped entirely.`, 'do2'),
    en: 'The cost, measured on five hundred rows that each format money and a date. The table re-renders for an unrelated counter. Plain rows: about five and a half milliseconds per click. Memo rows with a new arrow every render: slightly slower — five hundred comparisons that all fail. Memo rows with useCallback: a fraction of a millisecond. Memo pays only when every prop is stable.' },
  { t: 'When to reach for it', body: icards([
      ['gauge', 'Expensive to render', 'a large list row, a heavy chart, a big table — not a label or a button'],
      ['loop', 'Re-renders often', 'driven by a parent that updates on every keystroke, scroll or tick'],
      ['check', 'Props usually unchanged', 'and you can keep every object/function prop stable'],
    ], 3) + two(box('Don\'t wrap everything', 'The comparison itself costs something; for a cheap component it is slower than just re-rendering. Measure first (lesson 7.5), then memo the few components the profiler points at.', 'do2'),
      box('cuongthai.com', 'Feed and message lists memoise their row components: hundreds of non-trivial rows re-rendering on every parent update was measurable. Row callbacks use <code>useCallback</code>; items come straight from the store, so references stay stable until an item really changes. Cheap components elsewhere are left un-memoised on purpose.', 'lam'), ''),
    en: 'When to reach for it: a component that is expensive to render, re-renders often, and usually gets the same props — and you can keep every object and function prop stable. Don\'t wrap everything: the comparison costs something, and for a cheap component it is slower than re-rendering. cuongthai.com memoises its feed and message rows, with stable callbacks and store objects, and leaves cheap components alone on purpose.' },
  { t: 'React Compiler does it for you — measured', body: two(D(cmp(['Same pages, built with reactCompiler: true', 'without', 'with Compiler'], [
      ['plain child, 3 parent renders', `${c1.thuong}`, `<b>${c6.thuong}</b>`], ['memo + inline props', `${c1.memoInline}`, `<b>${c6.memoInline}</b>`],
      ['memo reading a changing context', `${c1x.memoDocCtx}`, `${c6x.memoDocCtx}`],
      ['500 plain rows, ms / click', f(T1.thuong), `<b>${f(T6.thuong)}</b>`], ['500 memo rows + inline arrow, ms', f(T1.memoHong), `<b>${f(T6.memoHong)}</b>`],
    ], { hl: [0, 1, 3] }), tn(C6.split('\n').filter((l) => /reactCompiler|Compiler:/.test(l)).join('\n'), { fs: 14, wrap: 70, title: 'c6/my-app — a copy of the lab with the Compiler on' })),
      D(box('What changed', 'The Compiler (babel-plugin-react-compiler 1.0, lesson 6.2) caches JSX elements and inline values automatically — the inline object and arrow became stable, the plain child stopped re-rendering.', 'xanh'),
        box('What did not', 'Context and state still re-render consumers (3 → 3). And you still need to understand references to read why something renders.', 'lam')), 'r64'),
    en: 'React Compiler does it for you. The same pages built with the compiler on: the plain child rendered once instead of three times, the memo child with inline props once instead of three, and five hundred plain rows dropped from about five and a half to about one millisecond per click. The compiler caches elements and inline values for you. Context still re-renders its consumers, and you still need to understand references.' },
  { t: 'What React.memo actually does', body: steps([
      '<b>It compares props shallowly</b> — <code>Object.is</code> on each prop. If all are identical, React skips rendering this component and its subtree.',
      '<b>So every prop must be stable</b> — one inline object, array or arrow is enough to make the comparison fail every time, and you pay for the comparison for nothing.',
      '<b>It does not help with context or state</b> — a memoised component still re-renders when its own state or a context it reads changes. Memo guards only the props path.',
      '<b>It pays off for expensive subtrees</b> — a large list, a chart, a heavy table. For a small component the comparison can cost more than the render.',
    ]),
    en: 'What React.memo actually does, in four points: it compares props shallowly and skips the subtree when all are identical; so every prop must be stable, or you pay for a comparison that always fails; it does not help with context or state; and it pays off for expensive subtrees, while for a small component the comparison can cost more than the render.' },
  { t: 'Pitfall: memo + a new function from the parent', body: tsx(`export default memo(Row);
// parent:
{rows.map((r) =>
  <Row key={r.id} onSelect={() => select(r.id)} />)}`, { sm: true, hl: [4] }) +
      two(tn(`$ npx eslint src/app/memo-con && echo 'eslint: 0 lỗi'\n${TR.split('\n').find((l) => l === 'eslint: 0 lỗi')}`, { fs: 15, wrap: 40, title: 'ESLint says nothing about this' }),
      box('Measured above', `500 rows like this: <b>${f(T1.memoHong)} ms</b> per click vs <b>${f(T1.thuong)} ms</b> without memo — the rows render exactly as often as before, plus 500 failed comparisons. Fix: <code>useCallback</code> for handlers and <code>useMemo</code> for objects together, or let the Compiler do it.`, 'do2'), 'r46') +
      meter([['plain rows', T1.thuong, '#64748b'], ['memo + new arrow', T1.memoHong, '#b91c1c']], { don: 'ms / click', w: 1000, nhan: 220, rh: 46 }) +
      box('Measure first', 'If the profiler does not show this component as expensive, don\'t memo it.', 'lam'),
    en: 'The pitfall: wrapping a row in memo while the parent passes a new arrow every render. Nothing is memoised — the row renders exactly as often as before, plus a failed comparison per row. ESLint says nothing about it. Measured on five hundred rows: slightly slower than no memo. Fix it with useCallback and useMemo together, or let the compiler do it — and measure first.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('React.memo', 'wrap a component to skip re-rendering when props are shallowly equal'), kw('Shallow equality', 'props compared by reference — a new reference looks changed'),
      kw('Inline-prop trap', 'a new object/function each render defeats memo'), kw('useCallback / useMemo pair', 'stabilise props so memo can skip'),
      kw('Pure component', 'output depends only on props — where memo fits'), kw('Overuse cost', 'memo everywhere adds comparisons for nothing'),
      kw('Props path only', 'memo does not block own state or context'), kw('React Compiler', 'memoises elements and values automatically'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: React.memo; shallow equality; the inline-prop trap; the useCallback and useMemo pair; a pure component; the cost of overuse; props path only; and React Compiler.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Wrap a plain child in ${c('React.memo')} and confirm it skips re-renders when its props don't change`,
      `Pass an inline object or arrow and watch memo stop working; fix it with ${c('useMemo')}/${c('useCallback')}`,
      'Time a long list with and without memo (and with a broken memo) on next start',
      'Write one sentence: when React.memo is worth it, and when it is noise',
    ]), box('Keep these', `<ul><li>memo = shallow compare of props</li><li>Every prop stable, or it is useless</li><li>Not a wall: state and context still render</li><li>Memo the expensive few, after measuring</li></ul>`, 'lam'), ''),
    en: 'Your turn: wrap a child in React.memo and confirm it skips; pass an inline object or arrow and watch it stop working, then fix it; time a long list with and without memo on next start; and write one sentence on when memo is worth it. Keep: memo is a shallow props comparison; every prop must be stable; state and context still render; memo the expensive few, after measuring.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Lists, keys & render performance', bai: '7.4' }, S);
