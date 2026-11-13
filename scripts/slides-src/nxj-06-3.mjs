/*DU_LIEU*/
const DU_LIEU = {
 "n6-3:file:src/lib/demReducer.ts": "export type Dem = { n: number };\nexport type HanhDong = { type: 'inc' } | { type: 'add'; by: number };\n\nexport function demReducer(state: Dem, action: HanhDong): Dem {\n  switch (action.type) {\n    case 'inc': return { n: state.n + 1 };\n    case 'add': return { n: state.n + action.by };\n    default:    return state;\n  }\n}\n",
 "n6-3:file:src/lib/demReducer.test.ts": "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { demReducer } from './demReducer.ts';\n\ntest('inc → add 5 → inc, từ { n: 0 }', () => {\n  let s = { n: 0 };\n  s = demReducer(s, { type: 'inc' });\n  s = demReducer(s, { type: 'add', by: 5 });\n  s = demReducer(s, { type: 'inc' });\n  console.log('REDUCER n=', s.n);\n  assert.equal(s.n, 7);\n});\n\ntest('thuần: không sửa state cũ', () => {\n  const cu = { n: 1 };\n  const moi = demReducer(cu, { type: 'inc' });\n  assert.equal(cu.n, 1);\n  assert.notEqual(moi, cu);\n});\n",
 "n6-3:file:src/app/bo-giam/page.tsx": "'use client';\nimport { useEffect, useReducer, useState } from 'react';\nimport { demReducer } from '@/lib/demReducer';\n\n// 1 — bộ đếm: component chỉ dispatch, reducer quyết định\nfunction BoDem() {\n  const [state, dispatch] = useReducer(demReducer, { n: 0 });\n  return (\n    <p>\n      <button id=\"inc\" onClick={() => dispatch({ type: 'inc' })} className=\"rounded border px-2\">+1</button>{' '}\n      <button id=\"add5\" onClick={() => dispatch({ type: 'add', by: 5 })} className=\"rounded border px-2\">+5</button>{' '}\n      n = <b id=\"n\">{state.n}</b>\n    </p>\n  );\n}\n\n// 2 — bẫy: sửa thẳng state trong reducer\ntype Ds = { items: string[] };\nconst dem = { goiSai: 0, goiDung: 0 };\nfunction dsSai(state: Ds, action: { type: 'add'; item: string }): Ds {\n  dem.goiSai++;\n  state.items.push(action.item);                         // ✗ sửa thẳng object cũ\n  return state;                                          // ✗ trả lại CHÍNH nó\n}\nfunction dsDung(state: Ds, action: { type: 'add'; item: string }): Ds {\n  dem.goiDung++;\n  return { ...state, items: [...state.items, action.item] };   // ✓ object mới\n}\nconst dau = { sai: { items: [] as string[] }, dung: { items: [] as string[] } };\nfunction DanhSach() {\n  const [sai, dSai] = useReducer(dsSai, dau.sai);\n  const [dung, dDung] = useReducer(dsDung, dau.dung);\n  const [, setVoCan] = useState(0);\n  useEffect(() => { Object.assign(window, { __sai: sai, __dung: dung }); });\n  return (\n    <p>\n      <button id=\"them-sai\" onClick={() => dSai({ type: 'add', item: 'sữa' })} className=\"rounded border px-2\">thêm (sửa thẳng)</button>{' '}\n      <button id=\"them-dung\" onClick={() => dDung({ type: 'add', item: 'sữa' })} className=\"rounded border px-2\">thêm (object mới)</button>{' '}\n      <button id=\"vo-can\" onClick={() => setVoCan((x) => x + 1)} className=\"rounded border px-2\">render vô can</button>{' '}\n      màn hình: sửa thẳng <b id=\"m-sai\">{sai.items.length}</b> · object mới <b id=\"m-dung\">{dung.items.length}</b>\n    </p>\n  );\n}\n\n// 3 — tổ hợp bất khả: ba mẩu state rời vs một reducer\nfunction TaiBool() {\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n  const [data, setData] = useState<string | null>(null);\n  const tai = (hong: boolean) => {\n    setLoading(true);                                    // ✗ quên xoá error/data cũ\n    setTimeout(() => { if (hong) setError('mạng lỗi'); else setData('An'); setLoading(false); }, 400);\n  };\n  return (\n    <p>\n      <button id=\"b-hong\" onClick={() => tai(true)} className=\"rounded border px-2\">tải (hỏng)</button>{' '}\n      <button id=\"b-tai\" onClick={() => tai(false)} className=\"rounded border px-2\">tải</button>{' '}\n      3 useState: <b id=\"b-hien\">{loading && 'đang tải… '}{error && `lỗi: ${error} `}{data && `dữ liệu: ${data}`}</b>\n    </p>\n  );\n}\ntype TrangThai = { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: string } | { status: 'ok'; data: string };\ntype Tai = { type: 'start' } | { type: 'fail'; error: string } | { type: 'done'; data: string };\nconst dauTai = { start: 0, boQua: 0 };\nfunction taiReducer(s: TrangThai, a: Tai): TrangThai {\n  switch (a.type) {\n    case 'start':\n      if (s.status === 'loading') { dauTai.boQua++; return s; }   // luật: đang tải thì bỏ qua\n      dauTai.start++; return { status: 'loading' };\n    case 'fail': return { status: 'error', error: a.error };\n    case 'done': return { status: 'ok', data: a.data };\n  }\n}\nfunction TaiReducer() {\n  const [s, dispatch] = useReducer(taiReducer, { status: 'idle' });\n  const tai = (hong: boolean) => {\n    dispatch({ type: 'start' });\n    setTimeout(() => dispatch(hong ? { type: 'fail', error: 'mạng lỗi' } : { type: 'done', data: 'An' }), 400);\n  };\n  return (\n    <p>\n      <button id=\"r-hong\" onClick={() => tai(true)} className=\"rounded border px-2\">tải (hỏng)</button>{' '}\n      <button id=\"r-tai\" onClick={() => tai(false)} className=\"rounded border px-2\">tải</button>{' '}\n      reducer: <b id=\"r-hien\">{s.status === 'loading' ? 'đang tải…' : s.status === 'error' ? `lỗi: ${s.error}` : s.status === 'ok' ? `dữ liệu: ${s.data}` : '—'}</b>\n    </p>\n  );\n}\n\nif (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __dauTai: dauTai });   // để đo\n\nexport default function BoGiam() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <BoDem />\n      <DanhSach />\n      <TaiBool />\n      <TaiReducer />\n    </div>\n  );\n}\n",
 "n6-3:trang": "$ node --test src/lib/demReducer.test.mjs 2>&1 | grep -E 'REDUCER|^# (pass|fail)|^ok|^not ok'\n# REDUCER n= 7\nok 1 - inc → add 5 → inc, từ { n: 0 }\nok 2 - thuần: không sửa state cũ\n# pass 2\n# fail 0\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|bo-giam'\n✓ Compiled successfully in 347ms\n├ ○ /bo-giam",
 "n6-3:file:src/app/bo-giam-sai/page.tsx": "'use client';\nimport { useReducer } from 'react';\nimport { demReducer } from '@/lib/demReducer';\n\ntype TrangThai = { status: 'loading' } | { status: 'error'; error: string };\nconst t: TrangThai = { status: 'loading', error: 'x' };     // tổ hợp bất khả\n\nexport default function Sai() {\n  const [state, dispatch] = useReducer(demReducer, { n: 0 });\n  dispatch({ type: 'add' });                                  // quên by\n  dispatch({ type: 'incc' });                                 // gõ nhầm tên action\n  return <p>{state.n} {t.status}</p>;\n}\n",
 "n6-3:kieu": "$ npx tsc --noEmit 2>&1 | grep -E 'error TS' | sed 's/^src.app.bo-giam-sai.//'\npage.tsx(6,43): error TS2353: Object literal may only specify known properties, and 'error' does not exist in type '{ status: \"loading\"; }'.\npage.tsx(10,12): error TS2345: Argument of type '{ type: \"add\"; }' is not assignable to parameter of type 'HanhDong'.\npage.tsx(11,14): error TS2820: Type '\"incc\"' is not assignable to type '\"inc\" | \"add\"'. Did you mean '\"inc\"'?",
 "n6-3:file:src/lib/demReducer.test.mjs": "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { demReducer } from './demReducer.ts';\n\ntest('inc → add 5 → inc, từ { n: 0 }', () => {\n  let s = { n: 0 };\n  s = demReducer(s, { type: 'inc' });\n  s = demReducer(s, { type: 'add', by: 5 });\n  s = demReducer(s, { type: 'inc' });\n  console.log('REDUCER n=', s.n);\n  assert.equal(s.n, 7);\n});\n\ntest('thuần: không sửa state cũ', () => {\n  const cu = { n: 1 };\n  const moi = demReducer(cu, { type: 'inc' });\n  assert.equal(cu.n, 1);\n  assert.notEqual(moi, cu);\n});\n",
 "n6-3:mo": "$ curl -s -o /dev/null -w 'next start GET /bo-giam → %{http_code}\\n' localhost:19352/bo-giam\nnext start GET /bo-giam → 200\n$ curl -s -o /dev/null -w 'next dev   GET /bo-giam → %{http_code}\\n' localhost:19351/bo-giam\nnext dev   GET /bo-giam → 200",
 "n6-3:dung": "",
 "anh-nxj-6-3:bgs-sai": {
  "url": "http://127.0.0.1:19352/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    8,
    23
   ],
   "#m-dung": [
    188,
    94,
    8,
    23
   ],
   "#b-hien": [
    262,
    131,
    0,
    23
   ],
   "#r-hien": [
    240,
    169,
    16,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-3:bgs-bool": {
  "url": "http://127.0.0.1:19352/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    8,
    23
   ],
   "#m-dung": [
    188,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    195,
    23
   ],
   "#r-hien": [
    240,
    169,
    16,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-3:bgs-red": {
  "url": "http://127.0.0.1:19352/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    8,
    23
   ],
   "#m-dung": [
    188,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    203,
    23
   ],
   "#r-hien": [
    240,
    169,
    85,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-3:bgs-cuoi": {
  "url": "http://127.0.0.1:19352/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    8,
    23
   ],
   "#m-dung": [
    188,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    203,
    23
   ],
   "#r-hien": [
    240,
    169,
    93,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-3:bg-start": {
  "url": "http://127.0.0.1:19352/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    8,
    23
   ],
   "#m-dung": [
    188,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    203,
    23
   ],
   "#r-hien": [
    240,
    169,
    93,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "n": "7",
   "sai1": {
    "manHinh": "0",
    "data": 1,
    "goi": 1
   },
   "dung1": {
    "manHinh": "1",
    "data": 1,
    "goi": 1
   },
   "voCan": {
    "sai": "1",
    "dataSai": 1,
    "dung": "1"
   },
   "boolLoi": "lỗi: mạng lỗi ",
   "boolGiua": "đang tải… lỗi: mạng lỗi ",
   "boolSau": "lỗi: mạng lỗi dữ liệu: An",
   "redLoi": "lỗi: mạng lỗi",
   "redGiua": "đang tải…",
   "dauTai": {
    "start": 2,
    "boQua": 1
   },
   "redSau": "dữ liệu: An"
  }
 },
 "anh-nxj-6-3:bgd-sai": {
  "url": "http://127.0.0.1:19351/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    12,
    23
   ],
   "#m-dung": [
    192,
    94,
    8,
    23
   ],
   "#b-hien": [
    262,
    131,
    0,
    23
   ],
   "#r-hien": [
    240,
    169,
    16,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
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
  ]
 },
 "anh-nxj-6-3:bgd-bool": {
  "url": "http://127.0.0.1:19351/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    12,
    23
   ],
   "#m-dung": [
    192,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    195,
    23
   ],
   "#r-hien": [
    240,
    169,
    16,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
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
  ]
 },
 "anh-nxj-6-3:bgd-red": {
  "url": "http://127.0.0.1:19351/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    12,
    23
   ],
   "#m-dung": [
    192,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    203,
    23
   ],
   "#r-hien": [
    240,
    169,
    85,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
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
  ]
 },
 "anh-nxj-6-3:bgd-cuoi": {
  "url": "http://127.0.0.1:19351/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    12,
    23
   ],
   "#m-dung": [
    192,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    203,
    23
   ],
   "#r-hien": [
    240,
    169,
    93,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
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
  ]
 },
 "anh-nxj-6-3:bg-dev": {
  "url": "http://127.0.0.1:19351/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    12,
    23
   ],
   "#m-dung": [
    192,
    94,
    8,
    23
   ],
   "#b-hien": [
    267,
    131,
    203,
    23
   ],
   "#r-hien": [
    240,
    169,
    93,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
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
   "n": "7",
   "sai1": {
    "manHinh": "0",
    "data": 2,
    "goi": 2
   },
   "dung1": {
    "manHinh": "1",
    "data": 1,
    "goi": 2
   },
   "voCan": {
    "sai": "2",
    "dataSai": 2,
    "dung": "1"
   },
   "boolLoi": "lỗi: mạng lỗi ",
   "boolGiua": "đang tải… lỗi: mạng lỗi ",
   "boolSau": "lỗi: mạng lỗi dữ liệu: An",
   "redLoi": "lỗi: mạng lỗi",
   "redGiua": "đang tải…",
   "dauTai": {
    "start": 4,
    "boQua": 2
   },
   "redSau": "dữ liệu: An"
  }
 },
 "anh-nxj-6-3:bgs-sai1": {
  "url": "http://127.0.0.1:19352/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    12,
    23
   ],
   "#m-dung": [
    193,
    94,
    12,
    23
   ],
   "#b-hien": [
    262,
    131,
    0,
    23
   ],
   "#r-hien": [
    240,
    169,
    16,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-6-3:bgd-sai1": {
  "url": "http://127.0.0.1:19351/bo-giam",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#n": [
    136,
    27,
    10,
    23
   ],
   "#m-sai": [
    77,
    94,
    12,
    23
   ],
   "#m-dung": [
    193,
    94,
    12,
    23
   ],
   "#b-hien": [
    262,
    131,
    0,
    23
   ],
   "#r-hien": [
    240,
    169,
    16,
    23
   ],
   "#them-sai": [
    24,
    62,
    157,
    30
   ],
   "#them-dung": [
    186,
    62,
    162,
    30
   ],
   "#vo-can": [
    352,
    62,
    130,
    30
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
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, path, br, hub, zm } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-06-3', code: 'NXJ 6.3', title: 'useReducer: state transitions as data', sub: 'Chapter 6 · Lesson 6.3' };
const O = (k) => { const v = DU_LIEU[`n6-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-6-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-06-3', ten, o);
const ST = AN('bg-start').ketQua, V = AN('bg-dev').ketQua;
const P = O('file:src/app/bo-giam/page.tsx'), R = O('file:src/lib/demReducer.ts');
for (const s of ['const [state, dispatch] = useReducer(demReducer, { n: 0 });', "dispatch({ type: 'inc' })", "dispatch({ type: 'add', by: 5 })", 'n = <b id="n">{state.n}</b>', "case 'start':", "case 'fail': return { status: 'error', error: a.error };"]) if (!P.includes(s)) throw new Error('bo-giam/page.tsx không có: ' + s);
for (const s of ["case 'inc': return { n: state.n + 1 };", "case 'add': return { n: state.n + action.by };"]) if (!R.includes(s)) throw new Error('demReducer.ts không có: ' + s);
for (const s of ['state.items.push(action.item);', 'return { ...state, items: [...state.items, action.item] };', "if (s.status === 'loading') { dauTai.boQua++; return s; }", 'setLoading(true);'])
  if (!P.includes(s)) throw new Error('bo-giam/page.tsx không có: ' + s);
if (ST.n !== '7' || ST.sai1.manHinh !== '0' || ST.sai1.data !== 1 || ST.voCan.sai !== '1' || ST.dung1.manHinh !== '1' || V.sai1.data !== 2 || V.sai1.goi !== 2 || V.sai1.manHinh !== '0' || V.voCan.sai !== '2'
  || V.dung1.data !== 1 || V.dung1.goi !== 2 || ST.boolGiua !== 'đang tải… lỗi: mạng lỗi ' || ST.boolSau !== 'lỗi: mạng lỗi dữ liệu: An' || ST.redGiua !== 'đang tải…' || ST.redSau !== 'dữ liệu: An'
  || ST.dauTai.start !== 2 || ST.dauTai.boQua !== 1 || V.dauTai.start !== 4 || V.dauTai.boQua !== 2)
  throw new Error('số đo 6.3 đổi — xem lại slide');
const TR = O('trang'), TEST = TR.slice(0, TR.indexOf('$ npx tsc')).trim(), KIEU = O('kieu');
if (!/REDUCER n= 7/.test(TEST) || !/# pass 2/.test(TEST)) throw new Error('test reducer đổi');
for (const s of ['TS2353', 'TS2345', "TS2820: Type '\"incc\"' is not assignable to type '\"inc\" | \"add\"'. Did you mean '\"inc\"'?"]) if (!KIEU.includes(s)) throw new Error('tsc 6.3 đổi: ' + s);

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.3', t: 'useReducer: state transitions<br>as data', sub: 'When several pieces of state change together by rules, put every possible change in one pure function',
    en: 'Lesson six point three: useReducer. useState is perfect for independent values. But when state is complex — several fields that update together, transitions with rules like "you cannot submit while loading" — scattering setter calls across handlers becomes fragile. useReducer centralises every way the state can change in one pure function.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A reducer is a pure function of (state, action) — tested on its own with <code>node --test</code></li>
    <li>Wiring it with useReducer: components <b>dispatch</b> what happened; the reducer decides what it means</li>
    <li>Typed actions and impossible states — <b>measured</b>: three useStates show "loading" and "error" at once</li>
    <li>When a reducer beats several useStates</li>
    <li>The trap — mutating state in a reducer, <b>measured</b>: production hides it, Strict Mode doubles it</li></ul>`,
    en: 'Five takeaways: a reducer is a pure function you can test on its own; wiring it with useReducer, where components dispatch what happened; typed actions and impossible states, measured; when a reducer beats several useStates; and the trap of mutating state inside a reducer, measured in production and in development.' },
  { t: 'A reducer is a pure function of (state, action)', body: two(zm(tsx(R, { sm: true, hl: [6, 7] }), 0.9), D(tn(TEST, { fs: 14, wrap: 44, title: 'node --test — no React, no browser' }),
      box('Pure', 'No side effects, no mutation: a new state object — test it alone.', 'xanh')), 'r64') +
      path([{ t: '{ n: 0 }' }, { t: '{ n: 1 }', s: 'inc' }, { t: '{ n: 6 }', s: 'add 5' }, { t: '{ n: 7 }', s: 'inc', on: true }], { h: 110, fs: 22, nhan: ['inc', 'add 5', 'inc'] }),
    en: 'A reducer is a pure function of state and action. It takes the current state and an action — an object describing what happened — and returns the next state, without mutating anything. Because it is just a function, we tested it alone with node test, no React and no browser: from n zero, inc, add five, inc gives seven, and the old state was untouched.' },
  { t: 'Wiring it with useReducer', body: two(tsx(`function BoDem() {
  const [state, dispatch] = useReducer(demReducer, { n: 0 });
  return (<p>
    <button onClick={() =>
      dispatch({ type: 'inc' })}>+1</button>
    <button onClick={() =>
      dispatch({ type: 'add', by: 5 })}>+5</button>
    n = <b>{state.n}</b>
  </p>);
}`, { sm: true, hl: [2, 5, 7] }), D(B('bgs-sai', { vp: 640, h: 50, w: 390, url: 'after +1, +5, +1', mark: [[136, 27, 10, 23, '']] }),
        box('What happened ≠ how state changes', 'The handler dispatches an <b>intent</b>; the reducer decides what it means.', 'lam')), 'r64') +
      cmp(['dispatch(…)', 'the reducer returns'], [[c("{ type: 'inc' }"), c('{ n: state.n + 1 }')], [c("{ type: 'add', by: 5 }"), c('{ n: state.n + action.by }')], ['anything else', c('state') + ' — unchanged']]) +
      path([{ t: 'click' }, { t: 'dispatch(action)', s: "{ type: 'add', by: 5 }" }, { t: 'reducer(state, action)', s: 'decides', on: true }, { t: 'new state → render', s: `n = ${ST.n}` }], { h: 110, fs: 19 }),
    en: 'Wiring it with useReducer: it returns the current state and a dispatch function. Instead of computing the next state in a handler and calling a setter, the handler dispatches an action — a description of intent — and the reducer decides what it means. In Chromium: plus one, plus five, plus one shows seven.' },
  { t: 'Typed actions: the compiler checks every dispatch', body: two(tsx(`type HanhDong =
  | { type: 'inc' }
  | { type: 'add'; by: number };

dispatch({ type: 'add' });   // forgot by
dispatch({ type: 'incc' });  // typo

type TrangThai =
  | { status: 'loading' }
  | { status: 'error'; error: string };
const t: TrangThai = { status: 'loading', error: 'x' };`, { sm: true, hl: [5, 6, 11] }), D(tn(KIEU, { fs: 14, wrap: 58, title: 'npx tsc --noEmit' }),
      box('A union of actions', 'Each action is one shape. TypeScript rejects a missing field, a typo (and suggests the right name), and a state shape that cannot exist.', 'xanh')), 'r64'),
    en: 'Typed actions: describe the actions as a union, one shape per action. Then the compiler checks every dispatch: add without by is rejected, a typo like incc is rejected with "did you mean inc", and the impossible state loading with an error does not even type-check.' },
  { t: 'Impossible states — three useStates vs one reducer, measured', body: two(D(tsx(`const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
const tai = (hong) => {
  setLoading(true);   // ✗ forgot to clear error/data
  …
};`, { sm: true, hl: [5] }), cmp(['Fail, then reload', '3 useStates', 'reducer'], [
      ['while reloading', `<b>${ST.boolGiua.trim()}</b> ✗`, `<b>${ST.redGiua}</b>`], ['after reload', `<b>${ST.boolSau}</b> ✗`, `<b>${ST.redSau}</b>`],
    ], { hl: [0, 1] })), D(B('bgs-bool', { vp: 640, h: 230, w: 470, url: 'while reloading', mark: [[24, 128, 600, 30, '3 useStates'], [24, 166, 330, 30, 'reducer']] }),
      box('One thing with shapes', 'Loading, data and error are ONE thing with several shapes — not three booleans that happen to sit next to each other.', 'lam')), 'r64'),
    en: 'Impossible states, measured. Three separate useStates: fail once, then reload. While reloading the screen shows "loading" and "error: network" at the same time; afterwards it shows the error and the data together. The reducer version, with one status union, shows only "loading", then only the data. Loading, data and error are one thing with shapes.' },
  { t: 'The transitions ARE the logic', body: two(tsx(`type TrangThai =
  | { status: 'idle' } | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ok'; data: string };

function taiReducer(s: TrangThai, a: Tai): TrangThai {
  switch (a.type) {
    case 'start':
      if (s.status === 'loading') return s; // rule
      return { status: 'loading' };
    case 'fail': return { status: 'error', error: a.error };
    case 'done': return { status: 'ok', data: a.data };
  }
}`, { sm: true, hl: [8, 9] }), D(cmp(['Two fast clicks on "tải"', 'count'], [['start accepted', `<b>${ST.dauTai.start}</b> (the earlier fail + this reload)`], ['start ignored while loading', `<b>${ST.dauTai.boQua}</b>`]], { hl: [1] }),
        box('A rule in one place', '"You cannot start while loading" is one line in the reducer — not an <code>if</code> repeated in every handler that might start a load.', 'xanh')), 'r64') + path([{ t: 'idle' }, { t: 'loading', s: 'start while loading ⇒ ignored', on: true }, { t: 'error', s: 'fail', mau: '#c0392b' }, { t: 'ok', s: 'done', mau: '#1f8a3b' }], { h: 110, fs: 20, nhan: ['start', 'fail', 'start → done'] }),
    en: 'The transitions are the logic. The rule "you cannot start while loading" is one line in the reducer: if the status is already loading, return the same state. Measured: two fast clicks on reload — the second start was ignored. Every handler that dispatches start gets the rule for free.' },
  { t: 'useState or useReducer?', body: cmp(['', 'useState', 'useReducer'], [
      ['Shape of state', 'a few independent values: a boolean, an input string, a counter', 'several related fields; one thing with several shapes'],
      ['Next state', 'simple, from one handler', 'depends on the old one in a non-trivial way; same transition from many places'],
      ['Testing', 'through the component', 'the reducer alone — a plain function'],
      ['Most components', '✓', 'when setters have multiplied and logic is smeared across handlers'],
    ], { hl: [1] }) + hub('reducer\n(state, action)', [['code', 'useReducer', 'this lesson'], ['layers', 'Redux Toolkit', 'createSlice — Chapter 14'], ['box', 'Zustand', 'set(state ⇒ …) — Chapter 14'], ['test', 'unit tests', 'node --test, Vitest — Chapter 19']], { h: 214 }),
    en: 'useState or useReducer? They are equally powerful. useState for a few independent values — most components. useReducer when several fields are related, the next state depends on the old one in a non-trivial way, the same transitions fire from many places, or you want to unit-test the logic. The same shape scales up to Redux and Zustand in Chapter fourteen.' },
  { t: 'The trap — mutating state inside a reducer, measured', body: two(tsx(`function dsSai(state, action) {
  state.items.push(action.item);   // ✗ mutate
  return state;                    // ✗ the SAME object
}
function dsDung(state, action) {
  return { ...state, items: [...state.items, action.item] };
}`, { sm: true, hl: [2, 3] }), cmp(['One click "thêm"', 'next start', 'next dev'], [
      ['mutating: data', ST.sai1.data, `<b>${V.sai1.data}</b> ✗`], ['mutating: on screen', `<b>${ST.sai1.manHinh}</b> ✗`, `<b>${V.sai1.manHinh}</b> ✗`], ['… after an unrelated render', ST.voCan.sai, V.voCan.sai],
      ['new object: data · screen', `${ST.dung1.data} · ${ST.dung1.manHinh}`, `${V.dung1.data} · ${V.dung1.manHinh}`],
    ], { hl: [0, 1] }), 'r64') + B('bgs-sai1', { vp: 640, h: 125, w: 760, url: 'localhost:3000/bo-giam · one click on "thêm (sửa thẳng)"', mark: [[77, 94, 8, 23, 'screen 0 · data 1']] }) + box('Why the screen stays at 0', 'The reducer returned the <b>same</b> object, so <code>Object.is(old, new)</code> is true and React bails out — no re-render. The data changed; nothing told React.', 'do2'),
    en: 'The trap: mutating state inside a reducer. The mutating version pushes into the old array and returns the same object, so React sees nothing changed. Measured in production: the data has one item but the screen shows zero, until an unrelated render reveals it. In development it is worse: one click added the item twice.' },
  { t: 'Why dev added it twice: Strict Mode calls reducers twice', body: steps([
      `<b>In development, React calls your reducer twice per dispatch</b> — measured: ${V.sai1.goi} calls for one click (${ST.sai1.goi} in production), like the double effect of Lesson 5.3`,
      `<b>A pure reducer does not care</b> — the new-object version was called ${V.dung1.goi}× and still holds ${V.dung1.data} item`,
      `<b>A mutating reducer is exposed</b> — it pushed into the same array twice: data ${V.sai1.data}, screen ${V.sai1.manHinh}`,
      `<b>Even a counter is a side effect</b> — the reducer's own counters doubled in dev: start ${V.dauTai.start} vs ${ST.dauTai.start}, ignored ${V.dauTai.boQua} vs ${ST.dauTai.boQua}`,
    ]) + box('The rule', 'A reducer must return a NEW object and touch nothing outside itself: <code>return { ...state, items: [...state.items, action.item] }</code>. Same rule as useState — just easier to break, because a reducer looks like a place where imperative code is allowed.', 'do2'),
    en: 'Why did development add it twice? In development React calls your reducer twice per dispatch, like the double effect of lesson five point three. A pure reducer does not care: called twice, it still holds one item. A mutating reducer is exposed: two pushes into the same array. Even a counter inside a reducer is a side effect — ours doubled.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('useReducer', 'manage state through a reducer (state, action) ⇒ newState'), kw('Action', 'a plain object describing what happened ({ type, … })'),
      kw('dispatch', 'the function you call to send an action to the reducer'), kw('Pure reducer', 'computes new state with no side effects, no mutation'),
      kw('Transition', 'one case of the reducer: how one action changes state'), kw('vs useState', 'prefer a reducer when related fields change together by rules'),
      kw('Impossible state', 'a combination (loading + error) a union type cannot express'), kw('Discriminated union', 'one shape per status, told apart by a type/status field'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: useReducer; action; dispatch; pure reducer; transition; versus useState; impossible state; and discriminated union.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Convert a component with three related useStates into one useReducer with a typed action union',
      `Test the reducer alone with ${c('node --test')}: dispatch two actions, check the result and that the old state is untouched`,
      'Mutate state in one case on purpose; click once in next dev and count — then return a new object',
      'Write one sentence on when a reducer beats several useStates',
    ]), box('Keep these', `<ul><li>Components dispatch; the reducer decides</li><li>Pure: new object, no side effects</li><li>A status union removes impossible states</li><li>Mutation hides in prod, doubles in dev</li></ul>`, 'lam'), ''),
    en: 'Your turn: convert three related useStates into one reducer with typed actions; test the reducer alone with node test; mutate state in one case on purpose and count in development; and say when a reducer wins. Keep: components dispatch, the reducer decides; pure means a new object; a status union removes impossible states; mutation hides in production and doubles in development.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — The hooks toolbox', bai: '6.3' }, S);
