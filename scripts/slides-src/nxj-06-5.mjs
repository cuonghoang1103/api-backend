/*DU_LIEU*/
const DU_LIEU = {
 "n6-5:file:src/app/hook-rieng/web/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\nfunction useWindowWidth() {                               // chép NGUYÊN đoạn mã của bài web\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const onResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', onResize);\n    return () => window.removeEventListener('resize', onResize);   // cleanup, of course\n  }, []);\n  return width;\n}\n\nexport default function Header() {\n  const width = useWindowWidth();\n  return <nav>{width < 768 ? 'Menu' : 'FullNav'}</nav>;\n}\n",
 "n6-5:web": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Error occurred|ReferenceError|^> |Export encountered'\n> my-app@0.1.0 build\n> next build\nError occurred prerendering page \"/hook-rieng/web\". Read more: https://nextjs.org/docs/messages/prerender-error\nReferenceError: window is not defined\n> 5 |   const [width, setWidth] = useState(window.innerWidth);\nExport encountered an error on /hook-rieng/web/page: /hook-rieng/web, exiting the build.",
 "n6-5:file:src/lib/useWindowWidth.ts": "'use client';\nimport { useSyncExternalStore } from 'react';\n\nfunction subscribe(onChange: () => void) {\n  window.addEventListener('resize', onChange);\n  return () => window.removeEventListener('resize', onChange);   // cleanup\n}\n\nexport function useWindowWidth() {\n  return useSyncExternalStore(\n    subscribe,\n    () => window.innerWidth,                              // trình duyệt: đọc thật\n    () => 0,                                              // máy chủ: chưa có window\n  );\n}\n",
 "n6-5:file:src/app/hook-rieng/page.tsx": "'use client';\nimport { useState } from 'react';\nimport { useWindowWidth } from '@/lib/useWindowWidth';\n\n// 1 — một hook có tên, dùng ở hai component\nfunction Header() {\n  const width = useWindowWidth();\n  return <nav id=\"header\">Header: {width < 768 ? 'Menu' : 'FullNav'}</nav>;\n}\nfunction DoRong() {\n  const width = useWindowWidth();\n  return <p id=\"do-rong\">width = {width}</p>;\n}\n\n// 2 — mỗi lời gọi có state RIÊNG\nfunction useToggle(dau = false) {\n  const [on, setOn] = useState(dau);\n  const toggle = () => setOn((v) => !v);\n  return [on, toggle] as const;\n}\nfunction CongTac({ id }: { id: string }) {\n  const [on, toggle] = useToggle();\n  return <button id={id} onClick={toggle} className=\"rounded border px-2\">{id}: {on ? 'BẬT' : 'tắt'}</button>;\n}\n\n// 3 — hook có điều kiện: React ghép state theo THỨ TỰ gọi, không theo tên\nfunction HoSo({ dao }: { dao: boolean }) {\n  let ten: unknown, daXem: unknown;\n  if (dao) { [daXem] = useState(true); [ten] = useState('An'); }   // ✗ thứ tự đảo khi dao đổi\n  else { [ten] = useState('An'); [daXem] = useState(true); }\n  return <span id=\"ho-so\">tên: {String(ten)} · đã xem: {String(daXem)}</span>;\n}\n\nexport default function HookRieng() {\n  const [dao, setDao] = useState(false);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <Header />\n      <DoRong />\n      <p className=\"space-x-2\"><CongTac id=\"den-a\" /><CongTac id=\"den-b\" /></p>\n      <p><button id=\"dao\" onClick={() => setDao(!dao)} className=\"rounded border px-2\">đảo thứ tự</button> <HoSo dao={dao} /></p>\n    </div>\n  );\n}\n",
 "n6-5:file:src/app/hook-rieng/thanh-toan/page.tsx": "'use client';\nimport { useCallback, useEffect, useState } from 'react';\n\nexport default function ThanhToan() {\n  const [mounted, setMounted] = useState(false);\n  useEffect(() => { setMounted(true); }, []);\n  if (!mounted) return <p>đang tải…</p>;               // ✗ return sớm TRƯỚC một hook\n  const onPay = useCallback(() => alert('trả tiền'), []);\n  return <button id=\"tra-tien\" onClick={onPay} className=\"rounded border px-2\">Thanh toán</button>;\n}\n",
 "n6-5:file:src/lib/khongUse.ts": "import { useState } from 'react';\n\nexport function layDoRong() {                             // ✗ thiếu tiền tố use\n  const [w] = useState(0);\n  return w;\n}\n",
 "n6-5:trang": "$ npm run build 2>&1 | grep -E 'Compiled|hook-rieng'\n✓ Compiled successfully in 218ms\n├ ○ /hook-rieng\n├ ○ /hook-rieng/thanh-toan\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint -f json src/app/hook-rieng/page.tsx | node tom-eslint.cjs\n29:24 error react-hooks/rules-of-hooks — React Hook \"useState\" is called conditionally. React Hooks must be called in the exact same order in every component render.\n29:48 error react-hooks/rules-of-hooks — React Hook \"useState\" is called conditionally. React Hooks must be called in the exact same order in every component render.\n30:18 error react-hooks/rules-of-hooks — React Hook \"useState\" is called conditionally. React Hooks must be called in the exact same order in every component render.\n30:44 error react-hooks/rules-of-hooks — React Hook \"useState\" is called conditionally. React Hooks must be called in the exact same order in every component render.\n$ npx eslint -f json src/app/hook-rieng/thanh-toan/page.tsx | node tom-eslint.cjs\n6:21 error react-hooks/set-state-in-effect — Error: Calling setState synchronously within an effect can trigger cascading renders\n8:17 error react-hooks/rules-of-hooks — React Hook \"useCallback\" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?\n$ npx eslint -f json src/lib/khongUse.ts | node tom-eslint.cjs\n4:15 error react-hooks/rules-of-hooks — React Hook \"useState\" is called in function \"layDoRong\" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word \"use\".",
 "n6-5:mo": "$ curl -s localhost:19356/hook-rieng | grep -o '<nav id=\"header\">[^<]*<!-- -->[^<]*</nav>\\|<p id=\"do-rong\">[^<]*<!-- -->[^<]*</p>'\n<nav id=\"header\">Header: <!-- -->Menu</nav>\n<p id=\"do-rong\">width = <!-- -->0</p>\n$ curl -s -o /dev/null -w 'next dev GET /hook-rieng → %{http_code}\\n' localhost:19355/hook-rieng\nnext dev GET /hook-rieng → 200\n$ curl -s -o /dev/null -w 'next dev GET /hook-rieng/thanh-toan → %{http_code}\\n' localhost:19355/hook-rieng/thanh-toan\nnext dev GET /hook-rieng/thanh-toan → 200",
 "n6-5:dung": "",
 "anh-nxj-6-5:hk-start-640": {
  "url": "http://127.0.0.1:19356/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    592,
    28
   ],
   "#do-rong": [
    24,
    60,
    592,
    28
   ],
   "#den-a": [
    24,
    96,
    100,
    30
   ],
   "#den-b": [
    132,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-6-5:hk-start-1000": {
  "url": "http://127.0.0.1:19356/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    952,
    28
   ],
   "#do-rong": [
    24,
    60,
    952,
    28
   ],
   "#den-a": [
    24,
    96,
    100,
    30
   ],
   "#den-b": [
    132,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-6-5:hk-start-dao": {
  "url": "http://127.0.0.1:19356/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    592,
    28
   ],
   "#do-rong": [
    24,
    60,
    592,
    28
   ],
   "#den-a": [
    24,
    96,
    110,
    30
   ],
   "#den-b": [
    142,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-6-5:hk-start": {
  "url": "http://127.0.0.1:19356/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    592,
    28
   ],
   "#do-rong": [
    24,
    60,
    592,
    28
   ],
   "#den-a": [
    24,
    96,
    110,
    30
   ],
   "#den-b": [
    142,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "w640": {
    "header": "Header: Menu",
    "doRong": "width = 640"
   },
   "w1000": {
    "header": "Header: FullNav",
    "doRong": "width = 1000"
   },
   "den": {
    "a": "den-a: BẬT",
    "b": "den-b: tắt"
   },
   "hoSo0": "tên: An · đã xem: true",
   "hoSo1": "tên: true · đã xem: An"
  }
 },
 "anh-nxj-6-5:hk-dev-640": {
  "url": "http://127.0.0.1:19355/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    592,
    28
   ],
   "#do-rong": [
    24,
    60,
    592,
    28
   ],
   "#den-a": [
    24,
    96,
    100,
    30
   ],
   "#den-b": [
    132,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
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
 "anh-nxj-6-5:hk-dev-1000": {
  "url": "http://127.0.0.1:19355/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    952,
    28
   ],
   "#do-rong": [
    24,
    60,
    952,
    28
   ],
   "#den-a": [
    24,
    96,
    100,
    30
   ],
   "#den-b": [
    132,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
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
 "anh-nxj-6-5:hk-dev-dao": {
  "url": "http://127.0.0.1:19355/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    592,
    28
   ],
   "#do-rong": [
    24,
    60,
    592,
    28
   ],
   "#den-a": [
    24,
    96,
    110,
    30
   ],
   "#den-b": [
    142,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
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
 "anh-nxj-6-5:hk-dev": {
  "url": "http://127.0.0.1:19355/hook-rieng",
  "vp": [
   640,
   230
  ],
  "rect": {
   "#header": [
    24,
    24,
    592,
    28
   ],
   "#do-rong": [
    24,
    60,
    592,
    28
   ],
   "#den-a": [
    24,
    96,
    110,
    30
   ],
   "#den-b": [
    142,
    96,
    101,
    30
   ],
   "#dao": [
    24,
    134,
    103,
    30
   ],
   "#ho-so": [
    132,
    137,
    176,
    23
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
   "w640": {
    "header": "Header: Menu",
    "doRong": "width = 640"
   },
   "w1000": {
    "header": "Header: FullNav",
    "doRong": "width = 1000"
   },
   "den": {
    "a": "den-a: BẬT",
    "b": "den-b: tắt"
   },
   "hoSo0": "tên: An · đã xem: true",
   "hoSo1": "tên: true · đã xem: An"
  }
 },
 "anh-nxj-6-5:tt-start": {
  "url": "http://127.0.0.1:19356/hook-rieng/thanh-toan",
  "vp": [
   640,
   230
  ],
  "rect": {},
  "console": [
   {
    "kieu": "pageerror",
    "chu": "Minified React error #310; visit https://react.dev/errors/310 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ],
  "ketQua": {
   "chu": "This page couldn’t load\n\nReload to try again, or go back.\n\nReload\nBack"
  }
 },
 "anh-nxj-6-5:tt-dev": {
  "url": "http://127.0.0.1:19355/hook-rieng/thanh-toan",
  "vp": [
   640,
   230
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
    "chu": "React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks\n\n   Previous render            Next render\n   ------------------------------------------------------\n%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n ThanhToan 1. useState                   useState\n2. useEffect                  useEffect\n3. undefined                  useCallback\n"
   },
   {
    "kieu": "pageerror",
    "chu": "Rendered more hooks than during the previous render."
   }
  ],
  "ketQua": {
   "chu": "This page couldn’t load\n\nReload to try again, or go back.\n\nReload\nBack"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, br, hub, zm } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-06-5', code: 'NXJ 6.5', title: 'Custom hooks: package reusable logic', sub: 'Chapter 6 · Lesson 6.5' };
const O = (k) => { const v = DU_LIEU[`n6-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-6-5:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-06-5', ten, o);
const HS = AN('hk-start').ketQua, HD = AN('hk-dev').ketQua, TS = AN('tt-start'), TDV = AN('tt-dev');
const W = O('web'), TR = O('trang'), MO = O('mo');
const P = O('file:src/app/hook-rieng/page.tsx'), U = O('file:src/lib/useWindowWidth.ts'), TT = O('file:src/app/hook-rieng/thanh-toan/page.tsx');
for (const s of ['() => 0,', '() => window.innerWidth,']) if (!U.includes(s)) throw new Error('useWindowWidth.ts không có: ' + s);
for (const s of ["if (dao) { [daXem] = useState(true); [ten] = useState('An'); }", 'const [on, setOn] = useState(dau);']) if (!P.includes(s)) throw new Error('hook-rieng/page.tsx không có: ' + s);
if (!TT.includes("if (!mounted) return <p>đang tải…</p>;") || !TT.includes('const onPay = useCallback(')) throw new Error('thanh-toan đổi');
if (!/ReferenceError: window is not defined/.test(W) || !/Error occurred prerendering page "\/hook-rieng\/web"/.test(W)) throw new Error('web 6.5 đổi');
if (HS.w640.doRong !== 'width = 640' || HS.w640.header !== 'Header: Menu' || HS.w1000.header !== 'Header: FullNav' || HS.w1000.doRong !== 'width = 1000' || HS.den.a !== 'den-a: BẬT' || HS.den.b !== 'den-b: tắt'
  || HS.hoSo0 !== 'tên: An · đã xem: true' || HS.hoSo1 !== 'tên: true · đã xem: An' || HD.hoSo1 !== 'tên: true · đã xem: An' || AN('hk-dev').console.some((x) => /order of Hooks/.test(x.chu)))
  throw new Error('số đo 6.5 đổi');
if (!TS.console.some((x) => x.kieu === 'pageerror' && /Minified React error #310/.test(x.chu)) || !/couldn’t load/.test(TS.ketQua.chu) || !TDV.console.some((x) => /Rendered more hooks than during the previous render/.test(x.chu))) throw new Error('#310 đổi');
if (!/<nav id="header">Header: <!-- -->Menu<\/nav>/.test(MO) || !/width = <!-- -->0/.test(MO)) throw new Error('curl SSR 6.5 đổi');
const ESL = TR.slice(TR.indexOf('$ npx eslint')).trim();
const E1 = ESL.split('\n').filter((l) => /^29:24|^30:44/.test(l)).join('\n'), E2 = ESL.split('\n').filter((l) => /^8:17/.test(l)).join('\n'), E3 = ESL.split('\n').filter((l) => /^4:15/.test(l)).join('\n');
if (!/Did you accidentally call a React Hook after an early return\?/.test(E2) || !/React Hook names must start with the word "use"/.test(E3)) throw new Error('ESLint 6.5 đổi');
const LOI310 = TS.console.find((x) => /#310/.test(x.chu)).chu.split(';')[0];

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.5', t: 'Custom hooks: name and reuse<br>stateful logic', sub: 'A function whose name starts with use and that calls other hooks — that is the whole concept',
    en: 'Lesson six point five: custom hooks. A custom hook is just a function whose name starts with use and that calls other hooks. That is the entire concept. It lets you pull a piece of stateful logic — an effect plus some state — out of a component, give it a name, and reuse it, with no new React feature.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>From repeated logic to a named hook — and why the lesson's <code>useWindowWidth</code> <b>breaks next build</b> (measured)</li>
    <li>The Next.js-safe version: <code>useSyncExternalStore</code> with a server snapshot — measured in curl and Chromium</li>
    <li>What makes it a hook: the <code>use</code> prefix and hook calls — ESLint, measured</li>
    <li>Each call has its own state · return shape · composing hooks</li>
    <li>The rules of hooks, measured: swapped order mixes state silently; an early return is <b>React #310</b></li></ul>`,
    en: 'Five takeaways: from repeated logic to a named hook — and why the lesson\'s window-width hook breaks next build; the Next.js-safe version with useSyncExternalStore; what makes a function a hook, checked by ESLint; independent state per call, return shape and composition; and the rules of hooks, measured.' },
  { t: 'Extract it — then run next build', body: two(tsx(`function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () =>
      window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

export default function Header() {
  const width = useWindowWidth();
  return <nav>{width < 768 ? 'Menu' : 'FullNav'}</nav>;
}`, { sm: true, hl: [2] }),
      D(tn(W.split('\n').filter((l) => !/^> (my-app|next build)/.test(l)).join('\n'), { fs: 13, wrap: 52, title: 'the lesson\'s snippet in a "use client" page' }),
        box('Why it crashes', '<code>"use client"</code> does not mean "browser only": Next.js <b>prerenders client components on the server</b> at build time. There is no <code>window</code> there, and <code>useState(window.innerWidth)</code> runs during that render.', 'do2')), 'r64'),
    en: 'Two components both track the window width, so we extract a hook — exactly the lesson\'s code, in a use client page. tsc is green, but next build fails: window is not defined, while prerendering the page. "use client" does not mean browser-only: Next.js prerenders client components on the server, where there is no window.' },
  { t: 'The Next.js-safe hook: useSyncExternalStore', body: two(D(tsx(`function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange);
  return () =>
    window.removeEventListener('resize', onChange);
}
export function useWindowWidth() {
  return useSyncExternalStore(
    subscribe,
    () => window.innerWidth,  // browser
    () => 0,                  // server
  );
}`, { sm: true, hl: [9, 10] }),
      box('Three arguments', '<b>subscribe</b> (add/remove the listener — the cleanup), a <b>browser snapshot</b>, and a <b>server snapshot</b> used for the HTML and for hydration.', 'lam')),
      D(cmp(['Where', 'Header', 'width'], [
        ['server HTML (curl)', 'Menu', '0'], ['Chromium 640 px', HS.w640.header.replace('Header: ', ''), HS.w640.doRong.replace('width = ', '')], ['resized to 1000 px', `<b>${HS.w1000.header.replace('Header: ', '')}</b>`, `<b>${HS.w1000.doRong.replace('width = ', '')}</b>`],
      ], { hl: [0] }),
        box('Honest trade-off', 'A desktop visitor first sees the server HTML ("Menu"), then hydration switches to FullNav. For layout, prefer CSS media queries (Chapter 13).', '')), 'r64'),
    en: 'The Next.js-safe hook: useSyncExternalStore. Subscribe adds and removes the resize listener — the cleanup — then a browser snapshot and a server snapshot. Measured: the server HTML says Menu and width zero; in Chromium at six hundred forty pixels, Menu and six forty; resized to one thousand, FullNav and one thousand. A desktop visitor briefly sees the server HTML; for pure layout, prefer CSS media queries.' },
  { t: 'What makes it a hook: the use prefix + hook calls', body: two(tsx(`// a plain function that calls a hook
export function layDoRong() {     // ✗ no "use"
  const [w] = useState(0);
  return w;
}`, { sm: true, hl: [2, 3] }), tn(`$ npx eslint -f json src/lib/khongUse.ts | node tom-eslint.cjs\n${E3}`, { fs: 13, wrap: 48, title: 'npx eslint' }), 'r64') +
      icards([['check', 'use + calls hooks', 'Both matter. The prefix tells React and the linter the Rules of Hooks apply inside it.'],
        ['warn', 'Not a utility', 'Because it calls hooks, call it at the top level of a component or another hook — never in a loop or an if.'],
        ['type', 'Name it after the job', 'useWindowWidth, useToggle, useCart, useInterval — the name is the documentation.']], 3) +
      box('Compose freely', 'A custom hook may call useState, useEffect, useRef, useSyncExternalStore — and other custom hooks. That is how you build capabilities out of small pieces.', 'xanh'),
    en: 'What makes it a hook: the use prefix, and the fact that it calls other hooks. Both matter. A plain function named without use that calls useState is flagged by ESLint: neither a component nor a custom hook — hook names must start with use. Because it calls hooks, it follows the rules: top level only, never in a loop or an if.' },
  { t: 'Each call has its own state — measured', body: two(tsx(`function useToggle(dau = false) {
  const [on, setOn] = useState(dau);
  const toggle = () => setOn((v) => !v);
  return [on, toggle] as const;
}
function CongTac({ id }) {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>
    {id}: {on ? 'BẬT' : 'tắt'}</button>;
}`, { sm: true, hl: [2, 7] }),
      D(B('hk-start-dao', { vp: 640, h: 135, w: 470, url: 'clicked "den-a" once', mark: [[24, 96, 110, 30, ''], [142, 96, 101, 30, '']] }),
        cmp(['After one click on den-a', 'shows'], [['den-a', `<b>${HS.den.a.split(': ')[1]}</b>`], ['den-b', `<b>${HS.den.b.split(': ')[1]}</b>`]], { hl: [0] }),
        box('A recipe, not a store', 'Two components that call <code>useToggle()</code> each get independent state. A hook shares <b>logic</b>, not state — it is not a global variable.', 'xanh')), 'r64') +
      icards([['code', 'Return an array…', 'for a pair the caller names: <code>const [on, toggle] = useToggle()</code>'], ['box', '…or an object', 'when there are several named values: <code>const { data, error } = useFetch(url)</code>']], 2),
    en: 'Each call has its own state, measured. Two buttons each call useToggle. One click on den-a: it shows on, den-b stays off. A hook shares logic, not state — it is a recipe, not a store. Return what the caller needs: an array for a pair the caller names, an object when there are several named values.' },
  { t: 'Rules of hooks: state is paired by ORDER', body: two(tsx(`function HoSo({ dao }) {
  let ten, daXem;
  if (dao) { [daXem] = useState(true); [ten] = useState('An'); }
  else     { [ten] = useState('An'); [daXem] = useState(true); }
  return <span>tên: {String(ten)} · đã xem: {String(daXem)}</span>;
}`, { sm: true, hl: [3, 4] }), D(cmp(['Click "đảo thứ tự"', 'next start', 'next dev'], [['before', HS.hoSo0, HD.hoSo0], ['after', `<b>${HS.hoSo1}</b> ✗`, `<b>${HD.hoSo1}</b> ✗`], ['React warning', 'none', 'none']], { hl: [1] })), 'r64') +
      tn(`$ npx eslint -f json src/app/hook-rieng/page.tsx | node tom-eslint.cjs\n${E1}\n… (4 errors in total)`, { fs: 13, wrap: 120, title: 'npx eslint — the only thing that noticed' }) +
      box('Silent', 'Same hook type in each slot, so React cannot tell: a boolean where a string was expected, no error anywhere.', 'do2'),
    en: 'React pairs hooks with their state by call order, not by name. When the order of two useStates flips, the first slot keeps the name\'s state and the second keeps the boolean: measured, "name: true, seen: An", in dev and production, with no warning at all. Only ESLint rules-of-hooks noticed.' },
  { t: 'Early return before a hook = React #310', body: two(tsx(`export default function ThanhToan() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <p>đang tải…</p>; // ✗
  const onPay = useCallback(() => alert('pay'), []);
  return <button onClick={onPay}>Thanh toán</button>;
}`, { sm: true, hl: [4, 5] }),
      D(tn(`next start · Chromium pageerror:\n${LOI310}\n\nnext dev · console:\nRendered more hooks than during the previous render.`, { fs: 13, wrap: 52, title: 'measured' }),
        B('tt-start', { vp: 640, h: 130, w: 420, url: 'next start · /hook-rieng/thanh-toan', mark: [] })), 'r64') +
      tn(E2, { fs: 13, wrap: 120, title: 'npx eslint — while tsc and next build stay green' }) +
      box('cuongthai.com, 13 → 25/09/2026', '<code>/checkout</code> was a white page for <b>12 days</b> for everyone: a <code>useCallback</code> after <code>if (!mounted) return</code>. tsc, next build and deploy were all green — the build does not lint. The fix was moving the hook above the return, plus an ESLint sweep that found two more.', 'do2'),
    en: 'An early return before a hook is React error three-ten. After mount, the component calls one more hook than before. Production: "This page couldn\'t load" and minified error three-ten. Dev: "Rendered more hooks than during the previous render". ESLint asks: did you call a hook after an early return? cuongthai.com had exactly this on the checkout page: white for twelve days, everything green.' },
  { t: 'Judgement: extract when it earns it', body: cmp(['Situation', 'Extract a hook?'], [
      ['a one-line useState', 'no — nothing to name'], ['the same three lines in two components', 'not yet — could be a coincidence'],
      ['the same logic in four places', '<b>yes</b> — it is a named pattern'], ['complex enough to deserve a name and a test', '<b>yes</b>'], ['hiding it makes the component read better', '<b>yes</b>'],
    ], { hl: [2, 3, 4] }) + box('Same test as components (Chapter 2)', 'Does it deserve to exist? Applied to logic instead of UI. Real hooks look exactly like this: useLocalStorage, useDebounce, useFetch, useMediaQuery, useOnClickOutside.', 'lam'),
    en: 'Judgement: extract when it earns it. Not a one-line useState; not three identical lines in two places, that may be a coincidence. Yes when the logic repeats in four places, when it is complex enough to deserve a name and a test, or when hiding it makes the component read better. The same "does it deserve to exist" test as components.' },
  { t: 'The hooks toolbox — complete', body: hub('your\ncustom hook', [
      ['box', 'useState · useEffect', 'Chapters 3–5: most of the work'], ['link', 'useRef', 'remember, no render (6.1)'], ['gauge', 'useMemo · useCallback', 'skip work at boundaries (6.2)'],
      ['layers', 'useReducer', 'complex transitions (6.3)'], ['tree', 'useContext', 'shared values (6.4)'], ['code', 'useSyncExternalStore', 'outside world (6.5)'],
    ], { h: 330 }) + box('Next: Chapter 7', 'How React actually decides what re-renders — reconciliation, keys, and the performance rules that follow.', 'xanh'),
    en: 'The hooks toolbox, complete. useState and useEffect do most of the work; useRef remembers without rendering; useMemo and useCallback skip work at boundaries; useReducer organises complex transitions; useContext distributes shared values; useSyncExternalStore subscribes to the outside world; and custom hooks package any of them. Next, chapter seven: how React decides what re-renders.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Custom hook', 'a function that calls hooks to package reusable logic'), kw('use prefix', 'the name must start with use so the rules apply'),
      kw('Independent state', 'each call gets its own state — not a shared singleton'), kw('Rules of Hooks', 'top level only, only from components/hooks'),
      kw('Call order', 'React pairs hooks with state by the order they are called'), kw('React #310', 'rendered more hooks than the previous render'),
      kw('useSyncExternalStore', 'subscribe + browser snapshot + server snapshot'), kw('Prerender', 'Next.js renders client components on the server too'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: custom hook; the use prefix; independent state; the rules of hooks; call order; React error three-ten; useSyncExternalStore; and prerender.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Extract a repeated piece of logic (e.g. ${c('useToggle')} or ${c('useLocalStorage')}) into a hook whose name starts with use`,
      'Use it in two components and confirm each has its own state',
      `Run ${c('next build')} with a hook that reads ${c('window')} or ${c('localStorage')} during render — then fix it`,
      `Run ${c('npx eslint')} and never switch off ${c('react-hooks/rules-of-hooks')}`,
    ]), box('Keep these', `<ul><li>A function that calls hooks, named use…</li><li>Shares logic, not state</li><li>"use client" still prerenders on the server</li><li>Same order every render — lint it</li></ul>`, 'lam'), ''),
    en: 'Your turn: extract useToggle or useLocalStorage; use it in two components and confirm independent state; run next build with a hook that reads window during render, then fix it; and lint with rules-of-hooks, never off. Keep: a function that calls hooks, named use; logic not state; use client still prerenders on the server; and the same order every render.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — The hooks toolbox', bai: '6.5' }, S);
