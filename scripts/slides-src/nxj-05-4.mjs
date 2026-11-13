/*DU_LIEU*/
const DU_LIEU = {
 "n5-4:file:src/app/khong-nen/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\nconst dem: Record<string, number> = {};\nconst tang = (k: string) => { dem[k] = (dem[k] ?? 0) + 1; };          // đếm render (đo dưới next start)\n\n// 1 — dẫn xuất state trong effect\nfunction GioEffect({ items }: { items: number[] }) {\n  tang('gioEffect');\n  const [total, setTotal] = useState(0);\n  useEffect(() => { setTotal(items.reduce((s, x) => s + x, 0)); }, [items]);   // ✗\n  return <p>effect: tổng <b id=\"t-e\">{total}</b></p>;\n}\nfunction GioRender({ items }: { items: number[] }) {\n  tang('gioRender');\n  const total = items.reduce((s, x) => s + x, 0);                            // ✓\n  return <p>render: tổng <b id=\"t-r\">{total}</b></p>;\n}\n\n// 2 — đặt lại state khi prop đổi\nfunction HoSoEffect({ user }: { user: string }) {\n  tang('hoSoEffect');\n  const [nhap, setNhap] = useState(user);\n  useEffect(() => { setNhap(user); }, [user]);                               // ✗\n  return <input id=\"hs-e\" value={nhap} onChange={(e) => setNhap(e.target.value)} className=\"rounded border px-1\" />;\n}\nfunction HoSoKey({ user }: { user: string }) {\n  tang('hoSoKey');\n  const [nhap, setNhap] = useState(user);                                    // ✓ cha đặt key={user}\n  return <input id=\"hs-k\" value={nhap} onChange={(e) => setNhap(e.target.value)} className=\"rounded border px-1\" />;\n}\n\n// 3 — logic sự kiện trong effect\nconst post = { effect: 0, handler: 0 };\nfunction TheoDoi({ daGui }: { daGui: boolean }) {\n  useEffect(() => { if (daGui) post.effect++; }, [daGui]);                   // ✗ phản ứng theo cờ\n  return <span>📊</span>;\n}\n\n// 4 — effect đặt state lên chính phụ thuộc của nó\nfunction VongWeb({ items }: { items: number[] }) {\n  const [total, setTotal] = useState(0);\n  useEffect(() => { tang('vongWebEffect'); setTotal(items.length); }, [items, total]);   // ví dụ của bài web\n  return <span id=\"vw\">{total}</span>;\n}\nfunction VongThat() {\n  const [n, setN] = useState(0);\n  useEffect(() => { setN(n + 1); }, [n]);                                    // ✗ mỗi lần một giá trị mới\n  return <span id=\"vt\">{n}</span>;\n}\n\n// 5 — chuỗi effect\nfunction Chuoi() {\n  tang('chuoi');\n  const [a, setA] = useState(0);\n  const [b, setB] = useState(0);\n  const [c, setC] = useState(0);\n  useEffect(() => { setB(a * 2); }, [a]);\n  useEffect(() => { setC(b + 1); }, [b]);\n  return <button id=\"ch\" onClick={() => setA(a + 1)} className=\"rounded border px-2\">a={a} b={b} c={c}</button>;\n}\n\nif (typeof window !== 'undefined') Object.assign(window, { __dem: dem, __post: post });   // để đo\n\nconst ITEMS = [[10, 20], [10, 20, 30]];\nexport default function KhongNen() {\n  const [i, setI] = useState(0);\n  const [user, setUser] = useState('An');\n  const [daGui, setDaGui] = useState(false);\n  const [kTheoDoi, setKTheoDoi] = useState(0);\n  const [vong, setVong] = useState(false);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <GioEffect items={ITEMS[i]!} /> <GioRender items={ITEMS[i]!} />\n      <button id=\"them\" onClick={() => setI(1)} className=\"rounded border px-2\">thêm món 30</button>\n      <p><HoSoEffect user={user} /> <HoSoKey key={user} user={user} />{' '}\n        <button id=\"doi\" onClick={() => setUser('Bình')} className=\"rounded border px-2\">đổi người dùng</button></p>\n      <p><TheoDoi key={kTheoDoi} daGui={daGui} />{' '}\n        <button id=\"gui\" onClick={() => { setDaGui(true); post.handler++; }} className=\"rounded border px-2\">gửi</button>{' '}\n        <button id=\"lai\" onClick={() => setKTheoDoi(kTheoDoi + 1)} className=\"rounded border px-2\">quay lại tab (gắn lại)</button></p>\n      <p>bài web: <VongWeb items={ITEMS[0]!} /> · {vong && <VongThat />}{' '}\n        <button id=\"vong\" onClick={() => setVong(!vong)} className=\"rounded border px-2\">vòng lặp thật</button></p>\n      <Chuoi />\n    </div>\n  );\n}\n",
 "n5-4:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint src/app/khong-nen/page.tsx\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/khong-nen/page.tsx\n  11:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders\n\nEffects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:\n* Update external systems with the latest state from React.\n* Subscribe for updates from some external system, calling setState in a callback function when external state changes.\n\nCalling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/khong-nen/page.tsx:11:21\n   9 |   tang('gioEffect');\n  10 |   const [total, setTotal] = useState(0);\n> 11 |   useEffect(() => { setTotal(items.reduce((s, x) => s + x, 0)); }, [items]);   // ✗\n     |                     ^^^^^^^^ Avoid calling setState() directly within an effect\n  12 |   return <p>effect: tổng <b id=\"t-e\">{total}</b></p>;\n  13 | }\n  14 | function GioRender({ items }: { items: number[] }) {                                                          react-hooks/set-state-in-effect\n  24:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders\n\nEffects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:\n* Update external systems with the latest state from React.\n* Subscribe for updates from some external system, calling setState in a callback function when external state changes.\n\nCalling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/khong-nen/page.tsx:24:21\n  22 |   tang('hoSoEffect');\n  23 |   const [nhap, setNhap] = useState(user);\n> 24 |   useEffect(() => { setNhap(user); }, [user]);                               // ✗\n     |                     ^^^^^^^ Avoid calling setState() directly within an effect\n  25 |   return <input id=\"hs-e\" value={nhap} onChange={(e) => setNhap(e.target.value)} className=\"rounded border px-1\" />;\n  26 | }\n  27 | function HoSoKey({ user }: { user: string }) {  react-hooks/set-state-in-effect\n  43:44  error  Error: Calling setState synchronously within an effect can trigger cascading renders\n\nEffects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:\n* Update external systems with the latest state from React.\n* Subscribe for updates from some external system, calling setState in a callback function when external state changes.\n\nCalling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/khong-nen/page.tsx:43:44\n  41 | function VongWeb({ items }: { items: number[] }) {\n  42 |   const [total, setTotal] = useState(0);\n> 43 |   useEffect(() => { tang('vongWebEffect'); setTotal(items.length); }, [items, total]);   // ví dụ của bài web\n     |                                            ^^^^^^^^ Avoid calling setState() directly within an effect\n  44 |   return <span id=\"vw\">{total}</span>;\n  45 | }\n  46 | function VongThat() {                         react-hooks/set-state-in-effect\n  48:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders\n\nEffects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:\n* Update external systems with the latest state from React.\n* Subscribe for updates from some external system, calling setState in a callback function when external state changes.\n\nCalling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/khong-nen/page.tsx:48:21\n  46 | function VongThat() {\n  47 |   const [n, setN] = useState(0);\n> 48 |   useEffect(() => { setN(n + 1); }, [n]);                                    // ✗ mỗi lần một giá trị mới\n     |                     ^^^^ Avoid calling setState() directly within an effect\n  49 |   return <span id=\"vt\">{n}</span>;\n  50 | }\n  51 |                                                                                                                       react-hooks/set-state-in-effect\n  58:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders\n\nEffects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:\n* Update external systems with the latest state from React.\n* Subscribe for updates from some external system, calling setState in a callback function when external state changes.\n\nCalling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/khong-nen/page.tsx:58:21\n  56 |   const [b, setB] = useState(0);\n  57 |   const [c, setC] = useState(0);\n> 58 |   useEffect(() => { setB(a * 2); }, [a]);\n     |                     ^^^^ Avoid calling setState() directly within an effect\n  59 |   useEffect(() => { setC(b + 1); }, [b]);\n  60 |   return <button id=\"ch\" onClick={() => setA(a + 1)} className=\"rounded border px-2\">a={a} b={b} c={c}</button>;\n  61 | }                                                    react-hooks/set-state-in-effect\n  59:21  error  Error: Calling setState synchronously within an effect can trigger cascading renders\n\nEffects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:\n* Update external systems with the latest state from React.\n* Subscribe for updates from some external system, calling setState in a callback function when external state changes.\n\nCalling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).\n\n/Users/admin/.rtq-nxj/lab/c1/my-app/src/app/khong-nen/page.tsx:59:21\n  57 |   const [c, setC] = useState(0);\n  58 |   useEffect(() => { setB(a * 2); }, [a]);\n> 59 |   useEffect(() => { setC(b + 1); }, [b]);\n     |                     ^^^^ Avoid calling setState() directly within an effect\n  60 |   return <button id=\"ch\" onClick={() => setA(a + 1)} className=\"rounded border px-2\">a={a} b={b} c={c}</button>;\n  61 | }\n  62 |                                                                                     react-hooks/set-state-in-effect\n\n✖ 6 problems (6 errors, 0 warnings)\n$ npm run build 2>&1 | grep -E 'Compiled|khong-nen'\n✓ Compiled successfully in 1309ms\n├ ○ /khong-nen",
 "n5-4:mo": "$ curl -s -o /dev/null -w 'next start GET /khong-nen → %{http_code}\\n' localhost:19343/khong-nen\nnext start GET /khong-nen → 200\n$ curl -s -o /dev/null -w 'next dev   GET /khong-nen → %{http_code}\\n' localhost:19342/khong-nen\nnext dev   GET /khong-nen → 200",
 "n5-4:dung": "",
 "anh-nxj-5-4:kn-dau": {
  "url": "http://127.0.0.1:19343/khong-nen",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#t-e": [
    124,
    26,
    24,
    23
   ],
   "#t-r": [
    129,
    62,
    24,
    23
   ],
   "#them": [
    24,
    96,
    129,
    30
   ],
   "#hs-e": [
    24,
    134,
    237,
    30
   ],
   "#hs-k": [
    266,
    134,
    237,
    30
   ],
   "#doi": [
    24,
    164,
    140,
    30
   ],
   "#gui": [
    50,
    202,
    44,
    30
   ],
   "#lai": [
    98,
    202,
    183,
    30
   ],
   "#vw": [
    98,
    243,
    11,
    23
   ],
   "#vong": [
    122,
    240,
    127,
    30
   ],
   "#ch": [
    24,
    278,
    117,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-5-4:kn-vong": {
  "url": "http://127.0.0.1:19343/khong-nen",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#t-e": [
    124,
    -6,
    24,
    23
   ],
   "#t-r": [
    129,
    30,
    24,
    23
   ],
   "#them": [
    24,
    64,
    129,
    30
   ],
   "#hs-e": [
    24,
    102,
    237,
    30
   ],
   "#hs-k": [
    266,
    102,
    237,
    30
   ],
   "#doi": [
    24,
    132,
    140,
    30
   ],
   "#gui": [
    50,
    170,
    44,
    30
   ],
   "#lai": [
    98,
    170,
    183,
    30
   ],
   "#vw": [
    98,
    211,
    11,
    23
   ],
   "#vong": [
    180,
    208,
    127,
    30
   ],
   "#ch": [
    24,
    246,
    116,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-5-4:kn-start": {
  "url": "http://127.0.0.1:19343/khong-nen",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#t-e": [
    124,
    -6,
    24,
    23
   ],
   "#t-r": [
    129,
    30,
    24,
    23
   ],
   "#them": [
    24,
    64,
    129,
    30
   ],
   "#hs-e": [
    24,
    102,
    237,
    30
   ],
   "#hs-k": [
    266,
    102,
    237,
    30
   ],
   "#doi": [
    24,
    132,
    140,
    30
   ],
   "#gui": [
    50,
    170,
    44,
    30
   ],
   "#lai": [
    98,
    170,
    183,
    30
   ],
   "#vw": [
    98,
    211,
    11,
    23
   ],
   "#vong": [
    122,
    208,
    127,
    30
   ],
   "#ch": [
    24,
    246,
    116,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "demTai": "{\"gioEffect\":2,\"gioRender\":1,\"hoSoEffect\":1,\"hoSoKey\":1,\"chuoi\":2,\"vongWebEffect\":2}",
   "khungGio": [
    "30 | 30",
    "30 | 60",
    "60 | 60"
   ],
   "demThem": "{\"gioEffect\":4,\"gioRender\":2,\"hoSoEffect\":3,\"hoSoKey\":2,\"chuoi\":3,\"vongWebEffect\":2}",
   "demGo": "{\"gioEffect\":4,\"gioRender\":2,\"hoSoEffect\":4,\"hoSoKey\":3,\"chuoi\":3,\"vongWebEffect\":2}",
   "khungHs": [
    "Anx | Anx",
    "Anx | Bình",
    "Bình | Bình"
   ],
   "demDoi": "{\"gioEffect\":5,\"gioRender\":3,\"hoSoEffect\":6,\"hoSoKey\":4,\"chuoi\":4,\"vongWebEffect\":2}",
   "postGui": "{\"effect\":1,\"handler\":1}",
   "postLai": "{\"effect\":2,\"handler\":1}",
   "vongWeb": "2",
   "demTruocChuoi": "{\"gioEffect\":7,\"gioRender\":5,\"hoSoEffect\":8,\"hoSoKey\":6,\"chuoi\":6,\"vongWebEffect\":2}",
   "demChuoi": "{\"gioEffect\":7,\"gioRender\":5,\"hoSoEffect\":8,\"hoSoKey\":6,\"chuoi\":9,\"vongWebEffect\":2}",
   "chuoiChu": "a=1 b=2 c=3",
   "vong1s": "44132",
   "sauTat": "đã gỡ"
  }
 },
 "anh-nxj-5-4:kn-dev-vong": {
  "url": "http://127.0.0.1:19342/khong-nen",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#t-e": [
    124,
    26,
    24,
    23
   ],
   "#t-r": [
    129,
    62,
    24,
    23
   ],
   "#them": [
    24,
    96,
    129,
    30
   ],
   "#hs-e": [
    24,
    134,
    237,
    30
   ],
   "#hs-k": [
    266,
    134,
    237,
    30
   ],
   "#doi": [
    24,
    164,
    140,
    30
   ],
   "#gui": [
    50,
    202,
    44,
    30
   ],
   "#lai": [
    98,
    202,
    183,
    30
   ],
   "#vw": [
    98,
    243,
    11,
    23
   ],
   "#vong": [
    177,
    240,
    127,
    30
   ],
   "#ch": [
    24,
    278,
    117,
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
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   }
  ]
 },
 "anh-nxj-5-4:kn-dev": {
  "url": "http://127.0.0.1:19342/khong-nen",
  "vp": [
   640,
   300
  ],
  "rect": {
   "#t-e": [
    124,
    26,
    24,
    23
   ],
   "#t-r": [
    129,
    62,
    24,
    23
   ],
   "#them": [
    24,
    96,
    129,
    30
   ],
   "#hs-e": [
    24,
    134,
    237,
    30
   ],
   "#hs-k": [
    266,
    134,
    237,
    30
   ],
   "#doi": [
    24,
    164,
    140,
    30
   ],
   "#gui": [
    50,
    202,
    44,
    30
   ],
   "#lai": [
    98,
    202,
    183,
    30
   ],
   "#vw": [
    98,
    243,
    11,
    23
   ],
   "#vong": [
    122,
    240,
    127,
    30
   ],
   "#ch": [
    24,
    278,
    117,
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
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   },
   {
    "kieu": "error",
    "chu": "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
   }
  ],
  "ketQua": {
   "vong1s": "13111",
   "sauTat": "đã gỡ"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-05-4', code: 'NXJ 5.4', title: 'Effects you should NOT write', sub: 'Chapter 5 · Lesson 5.4' };
const O = (k) => { const v = DU_LIEU[`n5-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-5-4:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const B = (ten, o) => br('nxj-05-4', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const J = (s) => JSON.parse(s);
const K = AN('kn-start').ketQua, DV = AN('kn-dev');
const P = O('file:src/app/khong-nen/page.tsx'), TR = O('trang');
const T0 = J(K.demTai), T1 = J(K.demThem), T2 = J(K.demGo), T3 = J(K.demDoi), C0 = J(K.demTruocChuoi), C1 = J(K.demChuoi), PL = J(K.postLai);
const d = (a, b, k) => b[k] - a[k];
const LOI = DV.console.filter((x) => x.chu.startsWith('Maximum update depth exceeded'));
for (const s of ['useEffect(() => { setTotal(items.reduce((s, x) => s + x, 0)); }, [items]);', 'useEffect(() => { setNhap(user); }, [user]);', 'useEffect(() => { if (daGui) post.effect++; }, [daGui]);',
  "useEffect(() => { tang('vongWebEffect'); setTotal(items.length); }, [items, total]);", 'useEffect(() => { setN(n + 1); }, [n]);', 'useEffect(() => { setB(a * 2); }, [a]);'])
  if (!P.includes(s)) throw new Error('khong-nen/page.tsx không có: ' + s);
if (T0.gioEffect !== 2 || T0.gioRender !== 1 || d(T0, T1, 'gioEffect') !== 2 || d(T0, T1, 'gioRender') !== 1 || K.khungGio[1] !== '30 | 60' || d(T2, T3, 'hoSoEffect') !== 2 || d(T2, T3, 'hoSoKey') !== 1
  || K.khungHs[1] !== 'Anx | Bình' || PL.effect !== 2 || PL.handler !== 1 || K.vongWeb !== '2' || T0.vongWebEffect !== 2 || C1.vongWebEffect !== 2 || d(C0, C1, 'chuoi') !== 3 || K.chuoiChu !== 'a=1 b=2 c=3'
  || +K.vong1s < 10000 || AN('kn-start').console.length !== 0 || LOI.length < 50) throw new Error('số đo 5.4 đổi — xem lại slide');
const LINT = TR.split('\n').filter((l) => /^\s+\d+:\d+\s+error|problems/.test(l)).map((l) => l.replace(/\s{2,}/g, '  ').trim());
if (LINT.length !== 7 || !LINT[6].includes('6 problems (6 errors')) throw new Error('ESLint đổi');
const BUILD = TR.split('\n').filter((l) => /^(✓ Compiled|├ ○ \/khong-nen)/.test(l));
if (BUILD.length !== 2) throw new Error('build đổi');
const N = (x) => Number(x).toLocaleString('en-US');

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.4', t: 'Effects you should<br>NOT write', sub: 'Most effects beginners write should not exist — measure what they cost, then delete them',
    en: 'Lesson five point four: the effects you should not write. useEffect is powerful, so people reach for it constantly — and most of those reaches are wrong. The React team wrote a whole page called You Might Not Need an Effect. Today we measure what each of these effects costs, then delete them.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Anti-pattern 1 — derived state in an effect — <b>measured</b></li>
    <li>Anti-pattern 2 — syncing props into state — <b>measured</b>, and the <code>key</code> fix</li>
    <li>Anti-pattern 3 — event logic in an effect — <b>measured</b></li>
    <li>The one question: "am I synchronising, or reacting?"</li>
    <li>Chains and loops — what really loops, <b>measured</b> in dev and production</li>
    <li>ESLint 7 now flags these as errors — <b>measured</b></li></ul>`,
    en: 'Six takeaways: derived state in an effect, measured; syncing props into state, measured, and the key fix; event logic in an effect, measured; the one question to ask; chains and loops, measured in development and production; and the new ESLint rule that flags them.' },
  { t: 'Anti-pattern 1: deriving state in an effect — measured', body: two(D(tsx(`// ✗ an effect to compute state from props
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((s, x) => s + x, 0));
}, [items]);

// ✓ just compute it during render
const total = items.reduce((s, x) => s + x, 0);`, { sm: true, hl: [4, 8] }),
      B('kn-dau', { vp: 640, h: 130, w: 520, url: 'localhost:3000/khong-nen', mark: [[118, 22, 40, 30, ''], [123, 58, 40, 30, '']] })),
      D(cmp(['Measured (next start)', 'effect', 'render'], [
        ['renders on load', T0.gioEffect, T0.gioRender], ['renders after adding an item', d(T0, T1, 'gioEffect'), d(T0, T1, 'gioRender')],
      ], { hl: [1] }), tn(['frames painted (effect | render):', ...K.khungGio.map((x, i) => `  ${i + 1}. ${x}${i === 1 ? '   ← stale total' : ''}`)].join('\n'), { fs: 15, title: 'requestAnimationFrame log' }),
        box('Simpler, always right', 'The effect version renders once with the old total, paints it, runs the effect, sets state, renders again. The render version is one line and never out of sync.', 'xanh'))),
    en: 'Anti-pattern one: deriving state in an effect, measured. A cart total kept in state and recomputed by an effect. Two renders on load instead of one; two renders per added item instead of one; and the frame log caught a stale frame: the effect version still said thirty while the render version already said sixty. Compute it during render: one line, always in sync.' },
  { t: 'Anti-pattern 2: syncing props into state — measured', body: two(tsx(`// ✗ copy a prop, then "keep it in sync"
function HoSoEffect({ user }) {
  const [nhap, setNhap] = useState(user);
  useEffect(() => { setNhap(user); }, [user]);
  …
}
// ✓ reset by remounting: the parent sets a key
<HoSoKey key={user} user={user} />`, { sm: true, hl: [4, 8] }),
      D(cmp(['After "đổi người dùng"', 'effect', 'key'], [['extra renders', d(T2, T3, 'hoSoEffect'), d(T2, T3, 'hoSoKey')]], { hl: [0] }),
        tn(['typed "x" in both, then switched user to Bình', 'frames painted (effect | key):', ...K.khungHs.map((x, i) => `  ${i + 1}. ${x}${i === 1 ? '   ← stale value' : ''}`)].join('\n'), { fs: 15, title: 'measured — Chromium' }),
        box('Two sources of truth', 'Copying a prop into state makes two owners you must reconcile — the bug React exists to prevent. Use the prop directly; if you need a local editable copy that resets when the prop changes, give the component a <code>key</code> (Chapter 7).', 'lam'))),
    en: 'Anti-pattern two: syncing props into state, measured. The profile input copies the user prop into state and resyncs it with an effect. We typed x into both inputs, then switched the user to Bình. The effect version needed two renders, the keyed one one, and the frame log shows a frame where the effect input still said Anx while the keyed one already said Bình. Give the component a key and let React remount it.' },
  { t: 'Anti-pattern 3: event logic in an effect — measured', body: tsx(`// ✗ react to a flag with an effect
function TheoDoi({ daGui }) {
  useEffect(() => {
    if (daGui) post.effect++;      // "send analytics"
  }, [daGui]);
}

// ✓ the event that causes it — in the handler
<button onClick={() => {
  setDaGui(true);
  post.handler++;
}}>gửi</button>`, { hl: [4, 10] }) + two(cmp(['POSTs counted', 'effect', 'handler'], [['after one click on "gửi"', 1, 1], ['after "quay lại tab" (remount, no click)', `<b>${PL.effect}</b>`, `<b>${PL.handler}</b>`]], { hl: [1] }),
        box('The effect does not know why', 'It only sees "the flag is true" — so a remount sent a second POST that nobody clicked for. The handler knows the user clicked, with all the context of the click, exactly once.', 'do2')),
    en: 'Anti-pattern three: event logic in an effect, measured. Analytics sent by an effect that watches a submitted flag, versus sent in the click handler. One click: one POST each. Then the tracking component is remounted — switching tabs back — with no click at all: the effect version sent a second POST, the handler version stayed at one. The effect only knows the flag is true; the handler knows the user clicked.' },
  { t: 'The test: "am I synchronising, or reacting?"', body: path([{ t: 'Why does this effect exist?', s: 'ask before writing it' }, { t: 'keep something OUTSIDE in step', s: 'subscription, title, widget', mau: '#15803d', on: true }, { t: '⇒ a real effect', s: 'with a matching cleanup', mau: '#15803d' }], { h: 140, fs: 19 }) +
    cmp(['If the answer is…', 'it is not an effect — put it in'], [
      ['"compute a value"', 'render: <code>const total = …</code>'],
      ['"copy a prop"', 'the prop itself, or a <code>key</code> to reset'],
      ['"respond to a click / submit"', 'the event handler'],
      ['"update state when other state changes"', 'compute the final value in one place'],
    ]) + box('When in doubt', 'react.dev → You Might Not Need an Effect has a decision tree for exactly this. An AI assistant will happily write all three anti-patterns — spotting them is part of the judgement this course is building.', 'lam'),
    en: 'The test: am I synchronising, or reacting? If the answer is “keep an external system in step with my state” — a subscription, the page title, a non-React widget — that is a real effect. If the answer is compute a value, copy a prop, or respond to a click, it is not an effect, and there is a simpler place for it. An AI assistant will happily write all three; spotting them is the judgement this course builds.' },
  { t: 'Chained effects: every link is a render — measured', body: tsx(`function Chuoi() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  useEffect(() => { setB(a * 2); }, [a]);
  useEffect(() => { setC(b + 1); }, [b]);
  return <button onClick={() => setA(a + 1)}>…</button>;
}`, { hl: [5, 6] }) + two(D(tn([`one click → "${K.chuoiChu}"`, `renders for that one click: ${d(C0, C1, 'chuoi')}`].join('\n'), { fs: 16, title: 'measured — next start' }),
        box('Compute the end state once', '<code>const b = a * 2; const c = b + 1;</code> — one render, no intermediate frames.', 'xanh')),
      steps(['click ⇒ <b>render 1</b> (a = 1)', 'effect sets b ⇒ <b>render 2</b>', 'effect sets c ⇒ <b>render 3</b>'])),
    en: 'Chained effects, measured. One effect sets b from a, another sets c from b. One click produced three renders: the click, then each link of the chain. Every link is a render and a possible intermediate frame. Compute the final values in one place: b equals a times two, c equals b plus one, one render.' },
  { t: 'Trap: an effect that sets its own dependency — measured', body: two(D(tsx(`// the lesson's example — does it loop?
useEffect(() => { setTotal(items.length); }, [items, total]);

// a real loop: a NEW value every time
useEffect(() => { setN(n + 1); }, [n]);`, { sm: true, hl: [2, 5] }),
        cmp(['Measured', 'result'], [['the lesson\'s example', `ran <b>${T0.vongWebEffect}</b>× then stopped (same value ⇒ bail out)`], ['<code>setN(n + 1)</code>, next start', `<b>${N(K.vong1s)}</b> renders in 1 s, <b>no message</b>`], ['<code>setN(n + 1)</code>, next dev', `<b>${LOI.length}</b> console errors in 1.5 s`]], { hl: [1, 2] })),
      D(tn(LOI[0].chu, { fs: 14, wrap: 50, title: 'Chromium console — next dev' }),
        box('What actually loops', 'Setting the <b>same</b> value bails out, so the example stops after one extra run. A loop needs a value that differs every time — <code>n + 1</code>, or a new object or array. In production it burns the CPU silently; only dev tells you, and the message does name <code>useEffect</code> and its dependencies.', 'do2'))),
    en: 'The trap: an effect that sets its own dependency, measured. The lesson’s example — set total to items dot length with total in the array — ran twice and stopped: setting the same value bails out. A real loop needs a new value every time, like n plus one: under next start it rendered over forty thousand times in one second with no message at all; under next dev the console filled with Maximum update depth exceeded, and the message names useEffect and its dependencies.' },
  { t: 'ESLint 7 flags them — the build does not', body: tn([`$ npx eslint src/app/khong-nen/page.tsx`, ...LINT].join('\n'), { fs: 15, wrap: 100, title: 'eslint-plugin-react-hooks 7.1.1' }) + two(
      tn(['$ npm run build', ...BUILD].join('\n'), { fs: 16, title: 'next build 16.4.6' }),
        box('react-hooks/set-state-in-effect', 'Every <code>setState</code> called synchronously in an effect body is now an <b>error</b>: "can trigger cascading renders". But <code>next build</code> in Next.js 16 does not run ESLint (Lesson 3.1) — run <code>npx eslint</code> yourself, or in CI.', 'lam')),
    en: 'ESLint version seven flags these, the build does not. Running npx eslint on the page reports six errors from the rule set-state-in-effect: calling setState synchronously within an effect can trigger cascading renders — every one of the anti-patterns above. But next build in Next.js sixteen does not run ESLint, and it compiled successfully. Run the linter yourself, or in CI.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Unnecessary effect', 'work that belongs in render or an event handler'), kw('Derive during render', 'compute values straight from state/props'),
      kw('Reset with key', 'change a component\'s key to remount it with fresh state'), kw('Event logic', 'do user-triggered work in the handler'),
      kw('Effect chain', 'effects setting state to trigger more effects'), kw('Bail out', 'setting the same value skips the re-render'),
      kw('set-state-in-effect', 'the ESLint 7 rule that flags these'), kw('You Might Not Need an Effect', 'the React docs page this lesson follows'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: unnecessary effect; derive during render; reset with key; event logic; effect chain; bail out; set-state-in-effect; and You Might Not Need an Effect.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Find an effect that only computes a value from state/props — delete it, compute during render',
      'Replace an effect that resets state on a prop change with a <code>key</code> on the component',
      'Move event-driven work out of an effect into the handler that caused it',
      `Run ${c('npx eslint')} on your app and fix every ${c('set-state-in-effect')} error`,
    ]), box('Keep these', `<ul><li>Synchronising with the outside ⇒ effect</li><li>Computing ⇒ render · copying a prop ⇒ key</li><li>Reacting to a click ⇒ handler</li><li>Every effect link is an extra render</li></ul>`, 'lam'), ''),
    en: 'Your turn: find an effect that only computes a value and delete it; replace an effect that resets state on a prop change with a key; move event-driven work into the handler that caused it; and run ESLint and fix every set-state-in-effect error. Keep: synchronising with the outside is an effect; computing belongs to render, copying a prop to a key, reacting to a click to the handler.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — Effects', bai: '5.4' }, S);
