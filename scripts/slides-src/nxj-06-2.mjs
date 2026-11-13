/*DU_LIEU*/
const DU_LIEU = {
 "n6-2:file:src/app/ghi-nho/page.tsx": "'use client';\nimport { memo, useCallback, useEffect, useMemo, useState } from 'react';\n\nconst so = { tinhKhong: 0, tinhMemo: 0, msKhong: 0, msMemo: 0, chonMoi: 0, effectHam: 0, effectCb: 0 };\nconst render: Record<string, number> = {};\nconst truoc: { chon?: () => void } = {};\nfunction useDemRender(ten: string) {                    // đếm lần render ĐÃ commit (đo trong effect)\n  useEffect(() => { render[ten] = (render[ten] ?? 0) + 1; });\n}\n\nconst ds = Array.from({ length: 20000 }, (_, i) => (i * 7919) % 20000);   // 20.000 số\nfunction locVaSap(ai: 'Khong' | 'Memo', nguong: number) {               // \"phép tính đắt\"\n  const t0 = performance.now();\n  const kq = ds.filter((x) => x >= nguong).toSorted((a, b) => a - b);\n  so[`tinh${ai}`]++;\n  so[`ms${ai}`] += performance.now() - t0;\n  return kq;\n}\n\n// 1 — useMemo: chỉ tính lại khi phụ thuộc đổi\nfunction KhongMemo({ nguong }: { nguong: number }) {\n  const kq = locVaSap('Khong', nguong);                                  // mỗi render đều tính\n  return <p>không memo: {kq.length} số</p>;\n}\nfunction CoMemo({ nguong }: { nguong: number }) {\n  const kq = useMemo(() => locVaSap('Memo', nguong), [nguong]);          // chỉ khi nguong đổi\n  return <p>useMemo: {kq.length} số</p>;\n}\n\n// 2 — useCallback chỉ có ích khi con được memo\nfunction ConThuong({ onChon }: { onChon: () => void }) {\n  useDemRender('conThuong');\n  return <button onClick={onChon} className=\"rounded border px-2\">con thường</button>;\n}\nconst ConMemo = memo(function ConMemo({ ten, onChon }: { ten: string; onChon: () => void; kieu?: { dam: boolean } }) {\n  useDemRender(ten);\n  return <button onClick={onChon} className=\"rounded border px-2\">memo · {ten}</button>;\n});\n\n// 3 — thiếu phụ thuộc ⇒ kết quả cũ\nfunction NhanCu({ nguong }: { nguong: number }) {\n  const nhan = useMemo(() => `ngưỡng ${nguong}`, []);                   // ✗ thiếu nguong\n  return <p>nhãn useMemo thiếu phụ thuộc: <b id=\"nhan-cu\">{nhan}</b> · thật: <b id=\"nhan-that\">{nguong}</b></p>;\n}\n\nif (typeof window !== 'undefined') Object.assign(window, { __so: so, __render: render });   // để đo\n\nexport default function GhiNho() {\n  const [nguong, setNguong] = useState(10000);\n  const [voCan, setVoCan] = useState(0);\n  const chon = useCallback(() => { console.log('chọn', nguong); }, [nguong]);\n  const taiLai = () => {};                                               // hàm mới mỗi render\n  useDemRender('cha');\n  useEffect(() => { if (truoc.chon !== chon) { so.chonMoi++; truoc.chon = chon; } });\n  useEffect(() => { so.effectHam++; }, [taiLai]);\n  useEffect(() => { so.effectCb++; }, [chon]);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <p>\n        <button id=\"vo-can\" onClick={() => setVoCan(voCan + 1)} className=\"rounded border px-2\">render vô can ({voCan})</button>{' '}\n        <button id=\"doi-nguong\" onClick={() => setNguong(nguong + 5000)} className=\"rounded border px-2\">đổi ngưỡng ({nguong})</button>\n      </p>\n      <KhongMemo nguong={nguong} />\n      <CoMemo nguong={nguong} />\n      <p className=\"space-x-2\">\n        <ConThuong onChon={chon} />\n        <ConMemo ten=\"inline\" onChon={() => chon()} />\n        <ConMemo ten=\"cb\" onChon={chon} />\n        <ConMemo ten=\"obj\" onChon={chon} kieu={{ dam: true }} />\n      </p>\n      <NhanCu nguong={nguong} />\n    </div>\n  );\n}\n",
 "n6-2:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|ghi-nho'\n✓ Compiled successfully in 1050ms\n├ ○ /ghi-nho\n$ npx eslint -f json src/app/ghi-nho/page.tsx | node tom-eslint.cjs\n42:50 warn  react-hooks/exhaustive-deps — React Hook useMemo has a missing dependency: 'nguong'. Either include it or remove the dependency array.\n52:9 warn  react-hooks/exhaustive-deps — The 'taiLai' function makes the dependencies of useEffect Hook (at line 55) change on every render. Move it inside the useEffect callback. Alternatively, wrap the definition of 'taiLai' in its own useCallback() Hook.",
 "n6-2:mo": "$ curl -s -o /dev/null -w 'next start GET /ghi-nho → %{http_code}\\n' localhost:19349/ghi-nho\nnext start GET /ghi-nho → 200",
 "n6-2:dung": "",
 "n6-2:file:next.config.ts": "import type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  reactCompiler: true,                       // bật React Compiler (babel-plugin-react-compiler)\n  turbopack: {\n    rules: {\n      \"*.css\": {\n        loaders: [\"@tailwindcss/turbopack\"],\n        as: \"*.css\",\n      },\n    },\n  },\n};\n\nexport default nextConfig;\n",
 "n6-2:bien-dich": "$ npm i -D babel-plugin-react-compiler@1.0.0 2>&1 | grep -E 'added|up to date'\nadded 1 package, and audited 362 packages in 4s\n$ npm run build 2>&1 | grep -E 'Next.js|Compiled|ghi-nho|ompiler'\n▲ Next.js 16.4.6 (Turbopack)\n✓ Compiled successfully in 2.4s\n├ ○ /ghi-nho\n$ echo \"c6 (Compiler bật): $(grep -rl 'memo_cache_sentinel' .next/static/chunks | wc -l) tệp JS có bộ nhớ đệm của Compiler\"\nc6 (Compiler bật):       27 tệp JS có bộ nhớ đệm của Compiler\n$ echo \"c1 (Compiler tắt): $(grep -rl 'memo_cache_sentinel' .next/static/chunks | wc -l) tệp JS có bộ nhớ đệm của Compiler\"\nc1 (Compiler tắt):        1 tệp JS có bộ nhớ đệm của Compiler",
 "n6-2:mo-bd": "$ curl -s -o /dev/null -w 'next start (React Compiler) GET /ghi-nho → %{http_code}\\n' localhost:19350/ghi-nho\nnext start (React Compiler) GET /ghi-nho → 200",
 "n6-2:dung-bd": "",
 "anh-nxj-6-2:gn-dau": {
  "url": "http://127.0.0.1:19349/ghi-nho",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#vo-can": [
    24,
    24,
    157,
    30
   ],
   "#doi-nguong": [
    185,
    24,
    180,
    30
   ],
   "#nhan-cu": [
    294,
    174,
    129,
    23
   ],
   "#nhan-that": [
    480,
    174,
    58,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-6-2:gn-sau": {
  "url": "http://127.0.0.1:19349/ghi-nho",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#vo-can": [
    24,
    24,
    156,
    30
   ],
   "#doi-nguong": [
    184,
    24,
    179,
    30
   ],
   "#nhan-cu": [
    294,
    174,
    129,
    23
   ],
   "#nhan-that": [
    480,
    174,
    58,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-6-2:gn-start": {
  "url": "http://127.0.0.1:19349/ghi-nho",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#vo-can": [
    24,
    24,
    156,
    30
   ],
   "#doi-nguong": [
    184,
    24,
    179,
    30
   ],
   "#nhan-cu": [
    294,
    174,
    129,
    23
   ],
   "#nhan-that": [
    480,
    174,
    58,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "s0": {
    "so": {
     "tinhKhong": 1,
     "tinhMemo": 1,
     "msKhong": 3,
     "msMemo": 5.399999976158142,
     "chonMoi": 1,
     "effectHam": 1,
     "effectCb": 1
    },
    "render": {
     "conThuong": 1,
     "inline": 1,
     "cb": 1,
     "obj": 1,
     "cha": 1
    }
   },
   "s1": {
    "so": {
     "tinhKhong": 3,
     "tinhMemo": 1,
     "msKhong": 7.199999988079071,
     "msMemo": 5.399999976158142,
     "chonMoi": 1,
     "effectHam": 3,
     "effectCb": 1
    },
    "render": {
     "conThuong": 3,
     "inline": 3,
     "cb": 1,
     "obj": 3,
     "cha": 3
    }
   },
   "s2": {
    "so": {
     "tinhKhong": 4,
     "tinhMemo": 2,
     "msKhong": 7.900000035762787,
     "msMemo": 6.099999964237213,
     "chonMoi": 2,
     "effectHam": 4,
     "effectCb": 2
    },
    "render": {
     "conThuong": 4,
     "inline": 4,
     "cb": 2,
     "obj": 4,
     "cha": 4
    }
   },
   "nhan": {
    "cu": "ngưỡng 10000",
    "that": "15000"
   }
  }
 },
 "anh-nxj-6-2:gnb-dau": {
  "url": "http://127.0.0.1:19350/ghi-nho",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#vo-can": [
    24,
    24,
    157,
    30
   ],
   "#doi-nguong": [
    185,
    24,
    180,
    30
   ],
   "#nhan-cu": [
    294,
    174,
    129,
    23
   ],
   "#nhan-that": [
    480,
    174,
    58,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-6-2:gnb-sau": {
  "url": "http://127.0.0.1:19350/ghi-nho",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#vo-can": [
    24,
    24,
    156,
    30
   ],
   "#doi-nguong": [
    184,
    24,
    179,
    30
   ],
   "#nhan-cu": [
    294,
    174,
    128,
    23
   ],
   "#nhan-that": [
    479,
    174,
    58,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-6-2:gn-bd": {
  "url": "http://127.0.0.1:19350/ghi-nho",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#vo-can": [
    24,
    24,
    156,
    30
   ],
   "#doi-nguong": [
    184,
    24,
    179,
    30
   ],
   "#nhan-cu": [
    294,
    174,
    128,
    23
   ],
   "#nhan-that": [
    479,
    174,
    58,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "s0": {
    "so": {
     "tinhKhong": 1,
     "tinhMemo": 1,
     "msKhong": 2.5,
     "msMemo": 3.299999952316284,
     "chonMoi": 1,
     "effectHam": 1,
     "effectCb": 1
    },
    "render": {
     "conThuong": 1,
     "inline": 1,
     "cb": 1,
     "obj": 1,
     "cha": 1
    }
   },
   "s1": {
    "so": {
     "tinhKhong": 1,
     "tinhMemo": 1,
     "msKhong": 2.5,
     "msMemo": 3.299999952316284,
     "chonMoi": 1,
     "effectHam": 1,
     "effectCb": 1
    },
    "render": {
     "conThuong": 1,
     "inline": 1,
     "cb": 1,
     "obj": 1,
     "cha": 3
    }
   },
   "s2": {
    "so": {
     "tinhKhong": 2,
     "tinhMemo": 2,
     "msKhong": 3.300000011920929,
     "msMemo": 3.899999976158142,
     "chonMoi": 2,
     "effectHam": 1,
     "effectCb": 2
    },
    "render": {
     "conThuong": 2,
     "inline": 2,
     "cb": 2,
     "obj": 2,
     "cha": 4
    }
   },
   "nhan": {
    "cu": "ngưỡng 15000",
    "that": "15000"
   }
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, path, br, meter, tiers } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-06-2', code: 'NXJ 6.2', title: 'useMemo & useCallback', sub: 'Chapter 6 · Lesson 6.2' };
const O = (k) => { const v = DU_LIEU[`n6-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-6-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-06-2', ten, o);
const K = AN('gn-start').ketQua, KB = AN('gn-bd').ketQua;
const P = O('file:src/app/ghi-nho/page.tsx');
for (const s of ["const kq = locVaSap('Khong', nguong);", "const kq = useMemo(() => locVaSap('Memo', nguong), [nguong]);", "const chon = useCallback(() => { console.log('chọn', nguong); }, [nguong]);",
  'const taiLai = () => {};', 'useEffect(() => { so.effectHam++; }, [taiLai]);', 'useEffect(() => { so.effectCb++; }, [chon]);', "const nhan = useMemo(() => `ngưỡng ${nguong}`, []);",
  '<ConMemo ten="inline" onChon={() => chon()} />', '<ConMemo ten="obj" onChon={chon} kieu={{ dam: true }} />', '<ConThuong onChon={chon} />'])
  if (!P.includes(s)) throw new Error('ghi-nho/page.tsx không có: ' + s);
const S2 = K.s2, B2 = KB.s2, R = S2.render, RB = B2.render;
if (S2.so.tinhKhong !== 4 || S2.so.tinhMemo !== 2 || S2.so.effectHam !== 4 || S2.so.effectCb !== 2 || S2.so.chonMoi !== 2 || R.cha !== 4 || R.conThuong !== 4 || R.inline !== 4 || R.cb !== 2 || R.obj !== 4
  || K.s1.so.tinhKhong !== 3 || K.s1.so.tinhMemo !== 1 || K.nhan.cu !== 'ngưỡng 10000' || K.nhan.that !== '15000'
  || B2.so.tinhKhong !== 2 || B2.so.effectHam !== 1 || RB.conThuong !== 2 || RB.inline !== 2 || RB.cb !== 2 || RB.obj !== 2 || RB.cha !== 4 || KB.nhan.cu !== 'ngưỡng 15000')
  throw new Error('số đo 6.2 đổi — xem lại slide');
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1);
const VC_K = K.s1.so.msKhong - K.s0.so.msKhong, VC_M = K.s1.so.msMemo - K.s0.so.msMemo;
if (VC_M !== 0 || VC_K < 1) throw new Error('đo thời gian 6.2 đổi');
const TR = O('trang'), ESL = TR.slice(TR.indexOf('$ npx eslint'));
if (!/42:50 warn  react-hooks\/exhaustive-deps — React Hook useMemo has a missing dependency: 'nguong'/.test(ESL) || !/52:9 warn  react-hooks\/exhaustive-deps — The 'taiLai' function makes the dependencies/.test(ESL)) throw new Error('ESLint 6.2 đổi');
const BD = O('bien-dich');
if (!/added 1 package/.test(BD) || !/27 tệp JS/.test(BD) || !/c1 \(Compiler tắt\):\s+1 tệp/.test(BD)) throw new Error('bien-dich 6.2 đổi');
const ESL1 = ESL.split('\n').filter((l) => l.startsWith('42:50')).join('\n'), ESL2 = ESL.split('\n').filter((l) => l.startsWith('52:9')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.2', t: 'useMemo & useCallback:<br>skip work, keep references stable', sub: 'One idea for two things — remember a result across renders, recompute only when its inputs change',
    en: 'Lesson six point two: useMemo and useCallback. They are one idea applied to two things: remember a result across renders and recompute only when its inputs change. useMemo remembers a value; useCallback remembers a function. Both are optimisations — use them for a reason, not by reflex.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>useMemo: recompute only when a dependency changes — <b>measured</b>: 4 renders, 2 computations</li>
    <li>useCallback = useMemo for a function — <b>measured</b>: a new identity only when its dependency changes</li>
    <li>Why a function's identity matters: an effect dependency, a <code>memo</code> child — both <b>measured</b></li>
    <li>When NOT to use them — which is most of the time · a missing dependency gives a stale result</li>
    <li>React Compiler 1.0 in Next.js 16: the same page with the compiler on, <b>measured</b></li></ul>`,
    en: 'Five takeaways: useMemo recomputes only when a dependency changes, measured; useCallback is useMemo for a function, measured; why a function identity matters, for an effect and for a memo child; when not to use them, and the stale result of a missing dependency; and the React Compiler in Next.js sixteen, measured on the same page.' },
  { t: 'useMemo — recompute only when deps change', body: two(D(tsx(`// "expensive": filter + sort 20,000 numbers
function KhongMemo({ nguong }) {
  const kq = locVaSap('Khong', nguong);      // every render
  return <p>{kq.length} numbers</p>;
}
function CoMemo({ nguong }) {
  // only when nguong changes:
  const kq = useMemo(
    () => locVaSap('Memo', nguong), [nguong]);
  return <p>{kq.length} numbers</p>;
}`, { sm: true, hl: [3, 8, 9] })),
      D(cmp(['next start · same 4 renders', 'computations', 'time (sum)'], [
        ['no useMemo', `<b>${S2.so.tinhKhong}</b>`, `${f1(S2.so.msKhong)} ms`], ['useMemo([nguong])', `<b>${S2.so.tinhMemo}</b>`, `${f1(S2.so.msMemo)} ms`],
      ], { hl: [1] }), box('Read it carefully', 'Mount + 2 unrelated renders + 1 dependency change = 4 renders. The function ran <b>2</b> times with useMemo — the same number the lesson recorded with react-dom — and <b>4</b> times without.', 'xanh')), 'r64') +
      path([{ t: 'render 1 · mount', s: 'compute', on: true }, { t: 'render 2 · unrelated', s: 'cached' }, { t: 'render 3 · unrelated', s: 'cached' }, { t: 'render 4 · dep changed', s: 'compute', on: true }], { h: 110, fs: 18 }),
    en: 'useMemo: React runs your function on the first render and caches the result. On later renders it reruns it only when a dependency changes, compared with Object.is like an effect. Measured over four renders — mount, two unrelated renders, one dependency change: without useMemo the expensive function ran four times; with it, twice.' },
  { t: 'Is it really "expensive"? Measure before you memoise', body: meter([
      ['2 unrelated renders — no useMemo', +f1(VC_K), '#c0392b'], ['2 unrelated renders — useMemo', +f1(VC_M) || 0.05, '#1f8a3b', f1(VC_M) + ' ms: nothing recomputed'], ['one frame at 60 fps', 16.7, '#94a3b8'],
    ], { don: 'ms', nhan: 400 }) + tsx(P.slice(P.indexOf('function locVaSap'), P.indexOf('// 1 —')).trim(), { sm: true, hl: [2, 3, 5] }) + two(box('What we saved', `Filtering and sorting 20,000 numbers: during the two unrelated renders the plain version spent <b>${f1(VC_K)} ms</b>, the memo version <b>${f1(VC_M)} ms</b> (course machine, <code>performance.now()</code>). Real, but small next to a 16.7 ms frame.`, 'lam'),
      box('The honest default', 'Write it plainly first. Reach for memoisation when a profiler (Chapter 7) shows a real cost — not because a value <i>looks</i> expensive.', 'xanh'), ''),
    en: 'Is it really expensive? During the two unrelated renders, filtering and sorting twenty thousand numbers cost the plain version about four milliseconds on the course machine, and the memo version nothing. Real, but small next to a sixteen point seven millisecond frame. So write it plainly first and measure.' },
  { t: 'useCallback — the same thing, for a function', body: two(tsx(`const chon = useCallback(
  () => { console.log('chọn', nguong); },
  [nguong],
);
// exactly the same as:
const chon2 = useMemo(
  () => () => { console.log('chọn', nguong); },
  [nguong],
);`, { hl: [1, 3] }), D(cmp(['4 renders of the parent', 'value'], [
        ['renders', R.cha], ['new identity for chon', `<b>${S2.so.chonMoi}</b> (mount + nguong changed)`], ['a plain arrow function', `new on <b>every</b> render (${R.cha})`],
      ], { hl: [1] }), box('Why care about a function\'s identity?', 'Two reasons only: (1) it is a dependency of an effect or a memo; (2) it is a prop of a child wrapped in <code>React.memo</code> (Chapter 7).', 'lam')), 'r64'),
    en: 'useCallback is the same idea for a function: useCallback of fn and deps is exactly useMemo of a function returning fn. It returns the same function reference across renders until a dependency changes. Measured: over four parent renders, chon got a new identity only twice — on mount and when nguong changed. Why care? Only for an effect dependency or a memo child.' },
  { t: 'Reason 1 — a function as an effect dependency', body: two(tsx(`const taiLai = () => {};            // new every render
useEffect(() => { so.effectHam++; }, [taiLai]);

const chon = useCallback(() => {…}, [nguong]);
useEffect(() => { so.effectCb++; }, [chon]);`, { hl: [1, 4] }), cmp(['4 renders', 'effect runs'], [
        ['deps: [taiLai]', `<b>${S2.so.effectHam}</b> — every render`], ['deps: [chon] (useCallback)', `<b>${S2.so.effectCb}</b> — mount + real change`],
      ], { hl: [0] }), 'r64') + tn(ESL2, { fs: 14, wrap: 110, title: 'npx eslint — the Chapter 5 trap, caught' }) +
      box('Often the better fix', 'Move the function <b>inside</b> the effect, or out of the component — then there is nothing to stabilise. useCallback is for when the function must also be used elsewhere.', 'xanh'),
    en: 'Reason one: a function used as an effect dependency. A plain arrow function is new on every render, so an effect depending on it ran on all four renders — the Chapter five trap. Wrapped in useCallback it ran twice: mount and the real change. ESLint says it plainly, and often the better fix is to move the function inside the effect.' },
  { t: 'Reason 2 — a prop for a memo child (the trap)', body: two(tsx(`<ConThuong onChon={chon} />            // not memo
<ConMemo ten="inline" onChon={() => chon()} />
<ConMemo ten="cb"     onChon={chon} />
<ConMemo ten="obj"    onChon={chon} kieu={{ dam: true }} />`, { sm: true, hl: [3] }),
      D(cmp(['Child · parent rendered 4×', 'renders'], [
        ['plain child + useCallback prop', `<b>${R.conThuong}</b> ✗`], ['memo child + inline arrow', `<b>${R.inline}</b> ✗`], ['memo child + useCallback', `<b>${R.cb}</b> ✓`], ['memo child + useCallback + {…} literal', `<b>${R.obj}</b> ✗`],
      ], { hl: [2] })), 'r64') + meter([['plain child + useCallback', R.conThuong, '#c0392b'], ['memo + inline arrow', R.inline, '#c0392b'], ['memo + useCallback', R.cb, '#1f8a3b'], ['memo + useCallback + {…}', R.obj, '#c0392b']], { don: 'renders', nhan: 360, rh: 36 }) +
      box('The pair only works together', '<code>useCallback</code> in the parent <b>and</b> <code>memo</code> on the child — and only if every other prop is stable too. One object literal breaks it.', 'do2'),
    en: 'Reason two: a prop for a child wrapped in memo. Over four parent renders: a plain child re-rendered four times even though its prop was a useCallback — the classic trap, you paid for memoisation and bought nothing. A memo child with an inline arrow: four. A memo child with the useCallback: two. Add one object literal prop: four again.' },
  { t: 'A missing dependency gives a stale result', body: two(tsx(`function NhanCu({ nguong }) {
  const nhan = useMemo(
    () => \`ngưỡng \${nguong}\`, []); // ✗
  return <p>{nhan} · real: {nguong}</p>;
}`, { hl: [3] }), D(B('gn-sau', { vp: 640, h: 200, w: 520, url: 'after "đổi ngưỡng"', mark: [[294, 174, 129, 23, 'stale'], [480, 174, 58, 23, '']] }),
      cmp(['After one change', 'shows'], [['label from useMemo', `<b>${K.nhan.cu}</b> ✗`], ['real value', `<b>${K.nhan.that}</b>`]], { hl: [0] })), 'r64') +
      tn(ESL1, { fs: 14, wrap: 110, title: 'npx eslint' }) + box('', 'The cache is keyed on the dependency array. Leave an input out and the memo happily returns the old value forever — exactly like a stale effect.', 'lam'),
    en: 'A missing dependency gives a stale result. The label is memoised with an empty array, forgetting nguong. After one change the real value is fifteen thousand, but the memo still returns threshold ten thousand, forever. The cache is keyed on the dependency array; ESLint exhaustive-deps warns you, and next build does not.' },
  { t: 'When NOT to use them — which is most of the time', body: tiers([
      ['gauge', 'useMemo — yes', 'a measured expensive computation, or a result that must stay stable as a dependency', '#1f8a3b'],
      ['link', 'useCallback — yes', 'a function that is an effect/memo dependency, or a prop for a memo child', '#1f8a3b'],
      ['trash', 'Both — no', 'cheap work · a value only shown as text · a handler for a plain DOM element', '#c0392b'],
    ], { th: 96, gap: 34 }) + box('They are not free', 'Each one stores a value, compares dependencies on every render, and adds a line the next reader must understand. Sprinkled everywhere, they make an app slower and harder to read.', 'do2'),
    en: 'When not to use them — most of the time. useMemo for a measured expensive computation or a value that must stay stable as a dependency. useCallback for a function that is a dependency, or a prop of a memo child. Never for cheap work, a value only shown as text, or a handler on a plain DOM element. They store values and compare dependencies every render.' },
  { t: 'React Compiler 1.0 — the same page, compiler on', body: two(D(tn(BD.split('\n').filter((l) => !/^\$ echo/.test(l)).join('\n'), { fs: 14, wrap: 64, title: 'copy of the lab · reactCompiler: true' }),
      box('Next.js 16', '<code>create-next-app</code> asks <i>"Would you like to use React Compiler?"</i> — this course answered No. Turning it on = <code>babel-plugin-react-compiler</code> + <code>reactCompiler: true</code>.', 'lam')),
      cmp(['Same clicks', 'compiler off', 'compiler on'], [
        ['plain compute (no useMemo)', S2.so.tinhKhong, `<b>${B2.so.tinhKhong}</b>`], ['effect on [taiLai]', S2.so.effectHam, `<b>${B2.so.effectHam}</b>`],
        ['plain child', R.conThuong, `<b>${RB.conThuong}</b>`], ['memo + inline arrow', R.inline, `<b>${RB.inline}</b>`], ['memo + {…} literal', R.obj, `<b>${RB.obj}</b>`],
        ['useMemo missing dep', K.nhan.cu, `<b>${KB.nhan.cu}</b>`], ['JS files with compiler cache', 1, '<b>27</b>'],
      ], { hl: [0, 2, 5] }), 'r64'),
    en: 'React Compiler one point zero, on a copy of the lab with reactCompiler true. Same clicks: the plain computation ran twice instead of four times, the effect on taiLai ran once, and every child rendered only twice — the compiler inserted the memoisation for us. It even repaired the missing dependency. The one file with a cache symbol when it is off is React itself.' },
  { t: 'useMemo & useCallback — in four lines', body: steps([
      '<b>useMemo remembers a value, useCallback remembers a function</b> — both keyed on a dependency array, compared with Object.is',
      '<b>Wrong array, wrong result</b> — a missing dependency returns a stale value; an unstable one recomputes every time',
      '<b>useCallback only pays off with a memo child or as a dependency</b> — a plain child re-renders anyway',
      '<b>Measure first</b> — and with React Compiler on, most manual memoisation becomes unnecessary; learn it to read existing code',
    ]),
    en: 'In four lines. useMemo remembers a value, useCallback a function, both keyed on dependencies. Wrong array, wrong result. useCallback only pays off with a memo child or as a dependency. Measure first — and with the compiler on, most manual memoisation is unnecessary.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('useMemo', 'caches a computed value between renders, keyed on dependencies'), kw('useCallback', 'caches a function identity so a memo child can skip'),
      kw('Referential stability', 'the same reference across renders, so comparisons hold'), kw('Dependencies', 'the array that decides when the cache is rebuilt'),
      kw('Premature memo', 'memoising cheap work only adds cost — measure first'), kw('Pairs with memo', 'useCallback helps only when the child is React.memo'),
      kw('React Compiler', 'inserts memoisation automatically (reactCompiler: true)'), kw('Stale memo', 'a missing dependency keeps returning the old value'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: useMemo; useCallback; referential stability; dependencies; premature memo; pairs with memo; the React Compiler; and a stale memo.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Add a deliberately heavy computation in render, wrap it in useMemo with the right dependencies, and count how often it runs',
      'Wrap a callback passed to a memo child in useCallback and show the child stops re-rendering — then pass it to a plain child',
      'Drop a dependency from a memo and watch the stale result; put it back',
      `Optional: copy the project, add ${c('reactCompiler: true')} and compare the counts`,
    ]), box('Keep these', `<ul><li>Same idea: value vs function</li><li>The array is the cache key</li><li>useCallback + memo child, together</li><li>Measure first; the compiler does most of it</li></ul>`, 'lam'), ''),
    en: 'Your turn: memoise a deliberately heavy computation and count its runs; pass a useCallback to a memo child and then to a plain child; drop a dependency and watch the stale result; and optionally turn the compiler on in a copy and compare. Keep: value versus function, the array is the cache key, useCallback goes with memo, and measure first.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — The hooks toolbox', bai: '6.2' }, S);
