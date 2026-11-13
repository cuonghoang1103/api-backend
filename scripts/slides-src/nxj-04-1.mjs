/*DU_LIEU*/
const DU_LIEU = {
 "n4-1:file:src/app/goi-ngay/page.tsx": "'use client';\nimport { useState } from 'react';\n\nlet lanGoi = 0;\n\nexport default function GoiNgay() {\n  const [items] = useState(['An', 'Bình', 'Lan']);\n  function xoa(ten: string) {\n    lanGoi++;\n    console.log(`xoa('${ten}') chạy · lần ${lanGoi}`);\n  }\n  return (\n    <ul className=\"space-y-2 p-6 font-sans text-lg\">\n      {items.map((t) => (\n        <li key={t}>{t} <button className=\"rounded border px-2\" onClick={xoa(t)}>xoá</button></li>   // ✗ gọi ngay\n      ))}\n    </ul>\n  );\n}\n",
 "n4-1:file:src/app/goi-ngay2/page.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function GoiNgay2() {\n  const [items, setItems] = useState(['An', 'Bình', 'Lan']);\n  function xoa(ten: string) {\n    setItems(items.filter((x) => x !== ten));   // handler có đặt state\n  }\n  return (\n    <ul className=\"space-y-2 p-6 font-sans text-lg\">\n      {items.map((t) => (\n        <li key={t}>{t} <button className=\"rounded border px-2\" onClick={xoa(t)}>xoá</button></li>\n      ))}\n    </ul>\n  );\n}\n",
 "n4-1:file:src/app/goi-ngay3/page.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function GoiNgay3() {\n  const [dem, setDem] = useState(0);\n  function tang() {\n    setDem(dem + 1);\n  }\n  return <button className=\"m-6 rounded border px-2 font-sans text-lg\" onClick={tang()}>đã bấm {dem} lần</button>;\n}\n",
 "n4-1:file:src/app/goi-ngay/chuoi.tsx": "export function NutChuoi() {\n  return <button onClick=\"alert('hi')\">HTML cũ</button>;   // ✗ chuỗi, không phải hàm\n}\n",
 "n4-1:loi": "$ npx tsc --noEmit\nsrc/app/goi-ngay/chuoi.tsx(2,18): error TS2322: Type 'string' is not assignable to type 'MouseEventHandler<HTMLButtonElement>'.\nsrc/app/goi-ngay/page.tsx(15,65): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'.\nsrc/app/goi-ngay2/page.tsx(12,65): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'.\nsrc/app/goi-ngay3/page.tsx(9,72): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'.\n$ curl -s -o /dev/null -w 'GET /goi-ngay → %{http_code}\\n' localhost:19331/goi-ngay\nGET /goi-ngay → 200",
 "n4-1:don": "",
 "n4-1:file:src/app/su-kien/page.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function SuKien() {\n  const [nhat, setNhat] = useState<string[]>([]);\n  const ghi = (s: string) => setNhat((n) => [...n, s]);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <button id=\"bam\" className=\"rounded border px-2\"\n        onClick={(e) => ghi(`click · e.type=${e.type} · e.target=<${(e.target as HTMLElement).tagName.toLowerCase()}> · e.nativeEvent=${e.nativeEvent.constructor.name}`)}>\n        bấm tôi\n      </button>\n      <input id=\"o\" className=\"block rounded border px-2\" placeholder=\"gõ…\"\n        onChange={(e) => ghi(`change · e.target.value=\"${e.target.value}\"`)}\n        onKeyDown={(e) => { if (e.key === 'Enter') ghi(`keydown · e.key=Enter · isComposing=${e.nativeEvent.isComposing}`); }} />\n      <a id=\"lk\" href=\"#da-di\" className=\"text-blue-600 underline\" onClick={() => { ghi('click link · return false'); return false; }}>link có return false</a>\n      <ol id=\"nhat\" className=\"list-decimal pl-6 text-base\">{nhat.map((s, i) => <li key={i}>{s}</li>)}</ol>\n    </div>\n  );\n}\n",
 "n4-1:file:src/app/form-tai/page.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function FormTai() {\n  const [dem, setDem] = useState(0);\n  const [gui, setGui] = useState<string[]>([]);\n  const them = (s: string) => setGui((g) => [...g, s]);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <p id=\"trang-thai\">dem = {dem} · đã chạy: [{gui.join(', ')}]</p>\n      <button id=\"tang\" type=\"button\" className=\"rounded border px-2\" onClick={() => setDem(dem + 1)}>+1</button>\n      <form id=\"f1\" className=\"rounded border p-2\" onSubmit={() => them('f1')}>\n        ✗ quên preventDefault <input id=\"q1\" name=\"q\" className=\"rounded border px-2\" />\n      </form>\n      <form id=\"f2\" className=\"rounded border p-2\" onSubmit={(e) => { e.preventDefault(); them('f2'); }}>\n        ✓ e.preventDefault() <input id=\"q2\" name=\"q\" className=\"rounded border px-2\" />\n      </form>\n      <form id=\"f3\" className=\"rounded border p-2\" onSubmit={(e) => { e.preventDefault(); them('f3 onSubmit'); }}>\n        <input id=\"q3\" className=\"rounded border px-2\" /> <button id=\"nut3\" className=\"rounded border px-2\" onClick={() => them('f3 onClick nút')}>gửi</button>\n      </form>\n      <div className=\"rounded border p-2\">\n        <input id=\"q4\" className=\"rounded border px-2\" /> <button id=\"nut4\" className=\"rounded border px-2\" onClick={() => them('nut4 onClick')}>gửi (không có form)</button>\n      </div>\n    </div>\n  );\n}\n",
 "n4-1:file:src/app/nghin/page.tsx": "'use client';\nimport { useState } from 'react';\n\nconst SO = Array.from({ length: 1000 }, (_, i) => i + 1);\n\nexport default function Nghin() {\n  const [chon, setChon] = useState(0);\n  return (\n    <div className=\"p-6 font-sans\">\n      <p id=\"chon\">đã chọn: {chon}</p>\n      <div className=\"grid grid-cols-20 gap-1 text-xs\">\n        {SO.map((n) => <button key={n} className=\"rounded border\" onClick={() => setChon(n)}>{n}</button>)}\n      </div>\n    </div>\n  );\n}\n",
 "n4-1:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|su-kien|form-tai|nghin'\n✓ Compiled successfully in 178ms\n├ ○ /form-tai\n├ ○ /nghin\n├ ○ /su-kien\n$ curl -s -o /dev/null -w 'GET /su-kien → %{http_code}\\n' localhost:19332/su-kien\nGET /su-kien → 200\n$ curl -s -o /dev/null -w 'GET /form-tai → %{http_code}\\n' localhost:19332/form-tai\nGET /form-tai → 200",
 "n4-1:dung": "",
 "n4-1:nhatky": "$ npx next dev   (terminal máy chủ, trong lúc mở /goi-ngay, /goi-ngay2, /goi-ngay3)\n▲ Next.js 16.4.6 (Turbopack)\n- Local:         http://127.0.0.1:19331\n- Network:       http://127.0.0.1:19331\n✓ Ready in 375ms\n\n✓ Running next.config.ts took 69ms\n\nxoa('An') chạy · lần 1\nxoa('Bình') chạy · lần 2\nxoa('Lan') chạy · lần 3\n GET /goi-ngay 200 in 212ms (next.js: 113ms, application-code: 98ms)\nxoa('An') chạy · lần 4\nxoa('Bình') chạy · lần 5\nxoa('Lan') chạy · lần 6\n GET /goi-ngay 200 in 31ms (next.js: 1.0ms, application-code: 30ms)\n GET /goi-ngay2 200 in 32ms (next.js: 4ms, application-code: 27ms)\n⨯ Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.\n    at tang (src/app/goi-ngay3/page.tsx:7:5)\n    at GoiNgay3 (src/app/goi-ngay3/page.tsx:9:81)\n   5 |   const [dem, setDem] = useState(0);\n   6 |   function tang() {\n>  7 |     setDem(dem + 1);\n     |     ^\n   8 |   }\n   9 |   return <button className=\"m-6 rounded border px-2 font-sans text-lg\" onClick={tang()}>đã bấm {dem} lần</button>;\n  10 | } {\n  digest: '2648147188'\n}\n GET /goi-ngay3 500 in 301ms (next.js: 4ms, application-code: 296ms)\n[browser] Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.",
 "anh-nxj-4-1:goi-ngay": {
  "url": "http://127.0.0.1:19331/goi-ngay",
  "vp": [
   640,
   260
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
    "kieu": "log",
    "chu": "xoa('An') chạy · lần 1"
   },
   {
    "kieu": "log",
    "chu": "xoa('Bình') chạy · lần 2"
   },
   {
    "kieu": "log",
    "chu": "xoa('Lan') chạy · lần 3"
   },
   {
    "kieu": "log",
    "chu": "xoa('An') chạy · lần 4"
   },
   {
    "kieu": "log",
    "chu": "xoa('Bình') chạy · lần 5"
   },
   {
    "kieu": "log",
    "chu": "xoa('Lan') chạy · lần 6"
   }
  ],
  "ketQua": {
   "soDong": 3,
   "sauBam": [
    "An xoá",
    "Bình xoá",
    "Lan xoá"
   ]
  }
 },
 "anh-nxj-4-1:goi-ngay2": {
  "url": "http://127.0.0.1:19331/goi-ngay2",
  "vp": [
   640,
   260
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
   "dong": []
  }
 },
 "anh-nxj-4-1:goi-ngay3": {
  "url": "http://127.0.0.1:19331/goi-ngay3",
  "vp": [
   900,
   560
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   },
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   },
   {
    "kieu": "pageerror",
    "chu": "Too many re-renders. React limits the number of renders to prevent an infinite loop."
   }
  ]
 },
 "anh-nxj-4-1:su-kien": {
  "url": "http://127.0.0.1:19332/su-kien",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#bam": [
    24,
    24,
    80,
    30
   ],
   "#o": [
    24,
    62,
    245,
    30
   ],
   "#lk": [
    24,
    102,
    153,
    23
   ],
   "#nhat": [
    24,
    128,
    592,
    120
   ]
  },
  "console": [],
  "ketQua": {
   "nhat": [
    "#da-di",
    "click · e.type=click · e.target=<button> · e.nativeEvent=PointerEvent",
    "change · e.target.value=\"h\"",
    "change · e.target.value=\"hi\"",
    "keydown · e.key=Enter · isComposing=false",
    "click link · return false"
   ]
  }
 },
 "anh-nxj-4-1:form-truoc": {
  "url": "http://127.0.0.1:19332/form-tai",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#trang-thai": [
    24,
    24,
    592,
    28
   ],
   "#f1": [
    24,
    98,
    592,
    48
   ],
   "#f2": [
    24,
    154,
    592,
    48
   ],
   "#f3": [
    24,
    210,
    592,
    48
   ],
   "#q4": [
    33,
    275,
    245,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-4-1:form-sau": {
  "url": "http://127.0.0.1:19332/form-tai",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#trang-thai": [
    24,
    24,
    592,
    28
   ],
   "#f1": [
    24,
    98,
    592,
    48
   ],
   "#f2": [
    24,
    154,
    592,
    48
   ],
   "#f3": [
    24,
    210,
    592,
    48
   ],
   "#q4": [
    33,
    275,
    245,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "truoc": [
    "http://127.0.0.1:19332/form-tai",
    "dem = 3 · đã chạy: [f2, f3 onClick nút, f3 onSubmit]"
   ],
   "sau": [
    "http://127.0.0.1:19332/form-tai?q=x",
    "dem = 0 · đã chạy: []",
    "navigate"
   ]
  }
 },
 "nghe-nxj-4-1:nghin": {
  "soNut": 1000,
  "clickTrenCacNut": 1000,
  "document": {
   "tongListener": 144,
   "click": 2
  },
  "html": {
   "tongListener": 0,
   "click": 0
  },
  "body": {
   "tongListener": 0,
   "click": 0
  },
  "onclickTrenNut": "function tM(){}",
  "clickDocument": [
   "capture",
   "bubble"
  ],
  "sauBam42": "đã chọn: 42"
 },
 "nghe-nxj-4-1:ime": {
  "nhat": [
   "change · e.target.value=\"việ\"",
   "keydown · e.key=Enter · isComposing=true",
   "change · e.target.value=\"việt\"",
   "keydown · e.key=Enter · isComposing=false"
  ],
  "o": "việt"
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp, path, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-04-1', code: 'NXJ 4.1', title: 'Handling events', sub: 'Chapter 4 · Lesson 4.1' };
const O = (k) => { const v = DU_LIEU[`n4-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-4-1:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const NG = DU_LIEU['nghe-nxj-4-1:nghin'], IME = DU_LIEU['nghe-nxj-4-1:ime'];
const B = (ten, o) => br('nxj-04-1', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const LOG = O('nhatky').split('\n');
const TSC = O('loi').split('\n').filter((l) => /error TS/.test(l)).map((l) => l.replace('src/app/', ''));
const xoaLog = LOG.filter((l) => /^xoa\(/.test(l));
const SK = AN('su-kien').ketQua.nhat, FT = AN('form-sau').ketQua, G1 = AN('goi-ngay').ketQua, G2 = AN('goi-ngay2').ketQua;
const conG1 = AN('goi-ngay').console.filter((x) => /^xoa/.test(x.chu)).length;
const loiG3 = AN('goi-ngay3').console.find((x) => x.kieu === 'pageerror').chu;
if (xoaLog.length !== 6 || conG1 !== 6 || G2.dong.length !== 0 || !/Too many re-renders/.test(loiG3)) throw new Error('số đo 4.1 đổi — xem lại slide');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.1', t: 'Handling<br>events', sub: 'State changes in response to what the user does. You connect the two with event handlers — and there are two mistakes everyone makes once',
    en: 'Lesson four point one: handling events. State from Chapter three changes in response to what the user does — a click, a keystroke, a form submitted. You wire them up with event handlers, and there are two mistakes everyone makes exactly once.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Pass a function, don't call it — what <code>onClick={fn()}</code> really does, <b>measured</b></li>
    <li>Arguments through an arrow wrapper</li>
    <li>The event object: <code>e.target</code>, <code>e.key</code>, <code>e.nativeEvent</code></li>
    <li>One listener at the root — 1000 buttons, <b>counted</b></li>
    <li><code>preventDefault</code> and submitting on the form — the reload, <b>measured</b></li>
    <li>The IME trap: Enter while Vietnamese is still being composed</li></ul>`,
    en: 'Six takeaways: pass a function, don’t call it, with what the wrong version really does measured; arguments through an arrow wrapper; the event object; one listener at the root, with a thousand buttons counted; preventDefault and submitting on the form, with the reload measured; and the IME trap.' },
  { t: 'Pass a function — don\'t call it', body: two(tsx(`// ✅ pass the function; React calls it on click
<button onClick={handleClick}>Save</button>

// ❌ calls handleClick NOW, during render,
//    and passes its return value (undefined)
<button onClick={handleClick()}>Save</button>`, { hl: [2, 6] }),
      D(tn(['$ npx next dev   # open /goi-ngay — 3 rows, NO click yet', ...xoaLog.slice(0, 3), '  GET /goi-ngay 200'].join('\n'), { fs: 15, title: 'server terminal (next dev)' }),
        box('Measured: it runs before anyone clicks', `Opening the page ran <code>xoa()</code> once per row on the server, and <b>${conG1}</b> times in the browser (3 rows × Strict Mode's double render). Clicking "xoá" afterwards: <b>nothing</b> — the handler is <code>undefined</code>.`, 'do2'))) +
    box('() means "call it now"', 'Whatever the call returns — usually <code>undefined</code> — becomes the handler. If the function sets state, that render triggers another render: a loop (next slide).', 'cam'),
    en: 'Pass a function, don’t call it. onClick of handleClick passes the function and React calls it on click. onClick of handleClick with parentheses calls it right now, during render, and passes whatever it returns, usually undefined. Measured: just opening the page ran xoa once per row on the server and six times in the browser — three rows times Strict Mode’s double render — before anyone clicked. Clicking afterwards did nothing.' },
  { t: 'Calling during render: three outcomes, measured', body: cmp(['The handler…', 'What happened (next dev, Chromium)', 'Why'], [
      ['only logs', `ran <b>${conG1}×</b> at load, click does nothing — rows: ${G1.sauBam.length}`, 'its return value <code>undefined</code> became the handler'],
      ['removes an item (<code>setItems(filter…)</code>)', `the list <b>deleted itself</b> — rows left: <b>${G2.dong.length}</b>`, 'each render removes again, until nothing is left'],
      ['increments a counter (<code>setDem(dem + 1)</code>)', '<b>Too many re-renders</b> — server <b>500</b>, error overlay', 'every render sets state ⇒ renders again, forever'],
    ], { hl: [2] }) + two(D(B('goi-ngay3', { vp: 900, h: 300, w: 540, url: 'localhost:3000/goi-ngay3 · next dev' })),
      box('The stack points into React', '"Call Stack 12 — Show 12 ignore-listed frame(s)": every frame is React internals. The server terminal is kinder — it shows <code>at tang (page.tsx:7:5)</code> with the source line.', 'cam')),
    en: 'Calling during render has three outcomes, all measured. If the handler only logs, it runs at load and clicking does nothing. If it removes an item, the list deletes itself — zero rows left. If it increments a counter, every render sets state and renders again: React stops with Too many re-renders, the server answers five hundred, and the overlay’s stack is all React internals. The server terminal is kinder: it points at the source line.' },
  { t: 'TypeScript catches it — if the handler returns nothing', body: tn(['$ npx tsc --noEmit', ...TSC].join('\n'), { fs: 14, wrap: 116, title: 'terminal — tsc' }) + two(
      box('Correction to the usual advice', 'People say "the compiler can\'t save you — passing a return value is valid JavaScript". In plain <b>.js</b>, true. In <b>.tsx</b>, <code>onClick={xoa(t)}</code> where <code>xoa</code> returns nothing is <b>TS2322</b>: <code>void</code> is not a <code>MouseEventHandler</code>. A string is rejected too.', 'xanh'),
      box('Where TypeScript stays silent', 'If the function <i>returns a function</i> (a curried handler), the types line up and nothing warns you. And <code>next dev</code> never type-checks — the page ran anyway. Run <code>tsc</code> or <code>next build</code>.', 'cam')),
    en: 'TypeScript does catch it, when the handler returns nothing. The usual advice says the compiler cannot save you, and in plain JavaScript that is true. In a tsx file, passing the result of a function that returns nothing is error TS two three two two: void is not a mouse event handler; a string is rejected too. TypeScript stays silent if the function returns a function, and next dev never type-checks — the pages ran anyway.' },
  { t: 'Passing arguments: wrap it in an arrow', body: tsx(`// ✅ onClick receives a NEW function; handleDelete runs only on click
<button onClick={() => handleDelete(item.id)}>Delete</button>`, { hl: [2] }) + path([
      { t: 'render', s: 'only creates the arrow' },
      { t: 'user clicks', s: 'the browser fires click' },
      { t: 'React calls the arrow', s: 'your onClick' },
      { t: 'handleDelete(item.id)', s: 'runs now, with the argument', on: true },
    ], { h: 130, fs: 19 }) + two(
      box('A new arrow on every render is fine', 'The cost is invisible next to the bug it prevents. Optimise only if a measurement says so (Chapter 7).', 'xanh'),
      box('camelCase, a real function', 'React props are <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code> — and they take a function, never a string like HTML\'s <code>onclick="…"</code>.', 'lam')) +
    vsd('<code>onClick={handleDelete(item.id)}</code><br>runs while the list is drawn', '<code>onClick={() =&gt; handleDelete(item.id)}</code><br>runs only on that row\'s click', '✗ Called during render', '✓ Called on click'),
    en: 'To pass an argument, wrap the call in an arrow. On render, React only creates the arrow; it does not call it. When the user clicks, React calls the arrow, and only then does handleDelete run with the item id. A new arrow on every render is fine — the cost is invisible next to the bug it prevents. And the prop names are camelCase and take a real function, never a string.' },
  { t: 'The event object — measured in Chromium', body: two(D(tsx(`<button onClick={(e) => ghi(\`click · e.type=\${e.type} · …\`)}>
<input onChange={(e) => ghi(\`change · value="\${e.target.value}"\`)}
       onKeyDown={(e) => { if (e.key === 'Enter') … }} />`, { sm: true }) + tn(SK.slice(1).map((s, i) => `${i + 1}. ${s}`).join('\n'), { fs: 13, wrap: 64, title: 'what the page logged — click, type "h" "i", Enter, click link' })),
      D(B('su-kien', { vp: 640, h: 260, w: 470, url: 'localhost:3000/su-kien', mark: [[24, 24, 80, 30, ''], [24, 62, 245, 30, '']] }),
        box('A SyntheticEvent', 'React wraps the browser event with the same API: <code>e.target</code>, <code>e.key</code>, <code>e.preventDefault()</code>. The original is <code>e.nativeEvent</code> — here a <b>PointerEvent</b>.', 'lam')), 'r64'),
    en: 'The event object, measured in Chromium. React calls your handler with a SyntheticEvent — its cross-browser wrapper around the native event, with the API you know. The click logged type click, target button, and a native PointerEvent. onChange fired on every keystroke: h, then h i — e dot target dot value is how you read what the user typed. Enter arrived as e dot key.' },
  { t: 'One listener at the root — 1000 buttons, counted', body: two(cmp(['Where (CDP getEventListeners)', '"click" listeners'], [
      [`each of the ${NG.soNut} buttons`, `1 — an <b>empty</b> <code>${NG.onclickTrenNut}</code> (${NG.clickTrenCacNut} in total)`],
      ['<code>document</code>', `<b>${NG.document.click}</b> — ${NG.clickDocument.join(' + ')} · ${NG.document.tongListener} listeners for all event types`],
      ['<code>&lt;html&gt;</code>, <code>&lt;body&gt;</code>', `${NG.html.click}, ${NG.body.click}`],
    ], { hl: [1] }), D(
      box('Your handlers are not on the buttons', 'React listens once at the root (here <code>document</code>), catches the click as it bubbles up, finds the component that was clicked and calls its <code>onClick</code>. Clicking button 42 printed <b>' + NG.sauBam42 + '</b>.', 'xanh'),
      box('…but the buttons are not empty either', 'React sets a no-op <code>onclick</code> on every element with <code>onClick</code> — a fix for iOS Safari, which won\'t bubble clicks from non-interactive elements otherwise.', 'cam'))) +
    path([{ t: 'click on <button>', s: 'native event' }, { t: 'bubbles up the DOM', s: 'button → … → html' }, { t: 'document listener', s: 'React\'s, one for all', on: true }, { t: 'your onClick', s: 'setChon(42)' }], { h: 140, fs: 19 }),
    en: 'One listener at the root, counted with Chrome’s DevTools protocol on a page of a thousand buttons. Your handlers are not attached to the buttons: React listens once at the document — two click listeners, capture and bubble — catches the click as it bubbles up, finds the component and calls its onClick. Each button does carry one empty onclick function: React sets it as a fix for iOS Safari. Not a thousand handlers — a thousand no-ops and one dispatcher.' },
  { t: 'preventDefault: stop the browser\'s default — measured', body: two(D(tsx(`function handleSubmit(e) {
  e.preventDefault();   // stop the full-page reload
  // …your own submit: call an API, update state…
}
<form onSubmit={handleSubmit}> … </form>`, { sm: true, hl: [2] }) +
      tn([`before: ${FT.truoc[0].replace('http://127.0.0.1:19332', 'localhost:3000')}`, `        ${FT.truoc[1]}`, '— form 1 (no preventDefault): type "x", Enter —', `after:  ${FT.sau[0].replace('http://127.0.0.1:19332', 'localhost:3000')}`, `        ${FT.sau[1]}`, `        navigation type: ${FT.sau[2]}`].join('\n'), { fs: 13, wrap: 56, title: 'real browser, next start' })),
      D(B('form-truoc', { vp: 640, h: 330, w: 450, url: 'localhost:3000/form-tai', mark: [[24, 98, 592, 48, ''], [24, 24, 330, 28, '']] }),
        box('"The page blinked and my state reset"', 'The browser did a full reload: the URL gained <code>?q=x</code>, <code>dem</code> went <b>3 → 0</b>. Always <code>e.preventDefault()</code> in <code>onSubmit</code>.', 'do2')), 'r64'),
    en: 'preventDefault stops the browser’s default action — a form submit reloads the page, a link navigates. Measured: the counter was three. Typing x into the form without preventDefault and pressing Enter made the browser do a full reload: the URL gained question mark q equals x, the counter went back to zero, and the navigation type was navigate. That is the classic “the page blinked and my state reset” bug.' },
  { t: 'Submit on the form, not the button — measured', body: cmp(['Press Enter in…', 'Handlers that ran', 'Lesson'], [
      ['a form with <code>onSubmit</code> + <code>preventDefault</code>', '<code>onSubmit</code>', 'the normal path'],
      ['a form whose <code>&lt;button&gt;</code> has only <code>onClick</code>', '<b>button <code>onClick</code></b>, then <code>onSubmit</code>', 'Enter "clicks" the default submit button'],
      ['an input + button with <b>no form</b>', '<b>nothing</b>', 'no form ⇒ no implicit submission'],
    ]) + tn(`dem = 3 · đã chạy: [${FT.truoc[1].split('[')[1]}`, { fs: 16, title: 'what ran, in order — Enter in form 2, form 3, then the formless input' }) + two(
      box('Precisely', 'Enter in a form triggers <b>implicit submission</b>, which fires a click on the form\'s default submit button — so a submit button\'s <code>onClick</code> does run on Enter. It stops working the moment the button becomes <code>type="button"</code> or leaves the form.', 'lam'),
      box('So put the logic in onSubmit', '<code>onSubmit</code> on the <code>&lt;form&gt;</code> catches every path: Enter, the button, <code>form.requestSubmit()</code>.', 'xanh')),
    en: 'Submit on the form, not the button — measured. Enter in a normal form ran onSubmit. Enter in a form whose button only had onClick ran the button’s onClick first, then onSubmit: Enter triggers implicit submission, which clicks the default submit button. Enter in an input with no form ran nothing. So the precise rule: a submit button’s onClick happens to fire on Enter, but breaks as soon as the button becomes type button or leaves the form. Put the logic in onSubmit.' },
  { t: 'How React handlers differ from HTML handlers', body: icards([
      ['code', '1 · A function, not a string', `${c('onClick={handleClick}')} passes the function; ${c('onClick={handleClick()}')} calls it during render.`],
      ['tree', '2 · One listener at the root', 'Handlers are dispatched from the root — 1000 rows do not mean 1000 handlers.'],
      ['box', '3 · The event object is React\'s own', `A SyntheticEvent with the DOM API; ${c('e.nativeEvent')} gives the original.`],
      ['lock', '4 · preventDefault still works', `${c('return false')} does nothing: measured, the link still navigated to ${c(SK[0])}.`],
    ], 2),
    en: 'How React handlers differ from HTML handlers. One: a function, not a string. Two: one listener at the root. Three: the event object is React’s own SyntheticEvent, with e dot nativeEvent for the original. Four: preventDefault still works, but return false does nothing — measured, a link whose handler returned false still navigated to hash da di.' },
  { t: 'The IME trap — Enter while composing', body: two(D(tn(IME.nhat.map((s, i) => `${i + 1}. ${s}`).join('\n'), { fs: 14, wrap: 60, title: 'Chromium · Input.imeSetComposition("việ"), Enter, commit "việt", Enter' }),
      box('Measured', 'While the IME was still composing <b>việ</b>, Enter reached <code>onKeyDown</code> with <code>isComposing=true</code>. A naive "submit on Enter" fires right there and eats the unfinished word.', 'do2')),
      D(tsx(`function onKeyDown(e) {
  if (e.nativeEvent.isComposing) return;  // IME guard
  if (e.key === 'Enter') submit();
}`, { hl: [2] }), box('A real incident', 'cuongthai.com learned this in its message composer and feed: Vietnamese, Japanese and Chinese typists lost words. The guard is now standard for every keyboard handler.', 'cam'))),
    en: 'The IME trap. When you type Vietnamese, Japanese or Chinese, an input method composes characters before committing them, and Enter during composition means “confirm this character”, not “send”. Measured in Chromium: while composing v i e with hook, Enter reached onKeyDown with isComposing true. A naive submit-on-Enter fires right there. Guard every keyboard handler: if e dot nativeEvent dot isComposing, return. cuongthai.com learned this in its message composer.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Event handler', 'a function you pass to an event prop like onClick'), kw('Pass vs call', 'onClick={fn} passes; onClick={fn()} calls during render'),
      kw('Arrow wrapper', '() => fn(arg) — pass an argument without calling early'), kw('SyntheticEvent', 'React\'s cross-browser wrapper around the native event'),
      kw('e.target', 'the DOM element that fired the event (.value for inputs)'), kw('Event delegation', 'one listener at the root dispatches to every handler'),
      kw('preventDefault', 'cancel the browser\'s default (reload, navigate)'), kw('Implicit submission', 'Enter in a form clicks its default submit button'),
      kw('isComposing', 'true while an IME is still composing a character'),
    ].join('')}</div>`,
    en: 'Key terms: event handler; pass versus call; arrow wrapper; SyntheticEvent; e dot target; event delegation; preventDefault; implicit submission; and isComposing.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add an ${c('onClick')} that logs the event; read ${c('e.type')}, ${c('e.target')}, ${c('e.nativeEvent')}`,
      `Make the classic mistake ${c('onClick={handleClick()}')} — watch it run at load — then fix it two ways`,
      `Add ${c('onChange')} to an input and read ${c('e.target.value')} on every keystroke`,
      `Build a form; remove ${c('preventDefault')} once to see the reload, then guard Enter with ${c('isComposing')}`,
    ]), box('Keep these', `<ul><li>Pass the function; wrap in an arrow for arguments</li><li>Read input with <code>e.target.value</code></li><li><code>e.preventDefault()</code> in <code>onSubmit</code>, logic on the form</li><li>Guard keyboard handlers with <code>isComposing</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: log the event object; make the classic mistake and fix it two ways; read e dot target dot value on every keystroke; and build a form, removing preventDefault once to see the reload, then guard Enter with isComposing. Keep: pass the function, wrap in an arrow for arguments, preventDefault in onSubmit with the logic on the form, and guard keyboard handlers with isComposing.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Events & controlled forms', bai: '4.1' }, S);
