/*DU_LIEU*/
const DU_LIEU = {
 "n18-3:file:src/app/js/code.ts": "// app/js/code.ts — the snippet every page colours\nexport const SNIPPET = 'const total = items.reduce((s, x) => s + x, 0);';\n",
 "n18-3:file:src/app/js/goc/page.tsx": "// app/js/goc/page.tsx — baseline: plain text, no library\nimport { SNIPPET } from '../code';\nexport default function Page() {\n  return <pre>{SNIPPET}</pre>;\n}\n",
 "n18-3:file:src/app/js/server/page.tsx": "// app/js/server/page.tsx — a SERVER Component that uses highlight.js\nimport hljs from 'highlight.js';\nimport { SNIPPET } from '../code';\nexport default function Page() {\n  return <pre dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(SNIPPET).value }} />;\n}\n",
 "n18-3:file:src/app/js/client/Hl.tsx": "'use client';\n// app/js/client/Hl.tsx — the same work in a CLIENT Component\nimport hljs from 'highlight.js';\nimport { SNIPPET } from '../code';\nexport default function Hl() {\n  return <pre dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(SNIPPET).value }} />;\n}\n",
 "n18-3:file:src/app/js/client/page.tsx": "// app/js/client/page.tsx — renders the client version\nimport Hl from './Hl';\nexport default function Page() {\n  return <Hl />;\n}\n",
 "n18-3:file:src/app/js/dynamic/Nut.tsx": "'use client';\n// app/js/dynamic/Nut.tsx — load the highlighter only when the user asks for it\nimport { useState } from 'react';\nimport dynamic from 'next/dynamic';\nconst Hl = dynamic(() => import('../client/Hl'), { loading: () => <p>Loading highlighter…</p> });\nexport default function Nut() {\n  const [show, setShow] = useState(false);\n  return <>{show ? <Hl /> : <button id=\"nut\" onClick={() => setShow(true)}>Colour the code</button>}</>;\n}\n",
 "n18-3:file:src/app/js/dynamic/page.tsx": "// app/js/dynamic/page.tsx\nimport Nut from './Nut';\nexport default function Page() {\n  return <Nut />;\n}\n",
 "n18-3:file:src/app/js/lodash/Go.tsx": "'use client';\n// app/js/lodash/Go.tsx — one function from lodash, imported from the package root\nimport { debounce } from 'lodash';\nexport default function Go() {\n  return <input onChange={debounce((e) => console.log(e.target.value), 300)} />;\n}\n",
 "n18-3:file:src/app/js/lodash/page.tsx": "import Go from './Go';\nexport default function Page() { return <Go />; }\n",
 "n18-3:file:src/app/js/lodash-le/Go.tsx": "'use client';\n// app/js/lodash-le/Go.tsx — the same function, imported from its own module path\nimport debounce from 'lodash/debounce';\nexport default function Go() {\n  return <input onChange={debounce((e) => console.log(e.target.value), 300)} />;\n}\n",
 "n18-3:file:src/app/js/lodash-le/page.tsx": "import Go from './Go';\nexport default function Page() { return <Go />; }\n",
 "n18-3:file:src/app/js/icon/Ic.tsx": "'use client';\n// app/js/icon/Ic.tsx — ONE icon from an icon pack with 1,700+ icons\nimport { Heart } from 'lucide-react';\nexport default function Ic() {\n  return <button><Heart size={16} /> Like</button>;\n}\n",
 "n18-3:file:src/app/js/icon/page.tsx": "import Ic from './Ic';\nexport default function Page() { return <Ic />; }\n",
 "n18-3:file:src/app/js/link/page.tsx": "// app/js/link/page.tsx — a page that only LINKS to /js/client\nimport Link from 'next/link';\nexport default function Page() {\n  return <Link href=\"/js/client\">Open the coloured code</Link>;\n}\n",
 "n18-3:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/js/|rror' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 2.3s\n○ /js/client\n○ /js/dynamic\n○ /js/dynamic-ngay\n○ /js/goc\n○ /js/icon\n○ /js/link\n○ /js/link-off\n○ /js/lodash\n○ /js/lodash-all\n○ /js/lodash-le\n○ /js/server\n$ node -e \"…route-bundle-stats.json…\"   # JS per route, uncompressed · gzip\n/js/goc         446 KB · gzip 132 KB\n/js/server      446 KB · gzip 132 KB\n/js/lodash      449 KB · gzip 133 KB\n/js/lodash-le   449 KB · gzip 133 KB\n/js/icon        450 KB · gzip 134 KB\n/js/dynamic-ngay   451 KB · gzip 134 KB\n/js/dynamic     452 KB · gzip 134 KB\n/js/link        454 KB · gzip 135 KB\n/js/link-off    454 KB · gzip 135 KB\n/js/lodash-all   515 KB · gzip 157 KB\n/js/client     1391 KB · gzip 434 KB\n$ ls node_modules/lucide-react/dist/esm/icons/*.mjs | wc -l | sed 's/^ */lucide-react: số tệp icon = /'\nlucide-react: số tệp icon = 2359\n$ grep -n -A2 \"lodash: {\" node_modules/next/dist/server/config.js\n962:        lodash: {\n963-            transform: 'lodash/{{member}}'\n964-        }",
 "n18-3:file:src/app/js/lodash-all/Go.tsx": "'use client';\n// app/js/lodash-all/Go.tsx — the classic: import the whole namespace, use one function\nimport _ from 'lodash';\nexport default function Go() {\n  return <input onChange={_.debounce((e) => console.log(e.target.value), 300)} />;\n}\n",
 "n18-3:file:src/app/js/lodash-all/page.tsx": "import Go from './Go';\nexport default function Page() { return <Go />; }\n",
 "n18-3:file:src/app/js/link-off/page.tsx": "// app/js/link-off/page.tsx — the same link, with prefetch turned off\nimport Link from 'next/link';\nexport default function Page() {\n  return <Link href=\"/js/client\" prefetch={false}>Open the coloured code</Link>;\n}\n",
 "n18-3:file:src/app/Theme.tsx": "'use client';\n// app/Theme.tsx — a \"small\" theme helper that imports the highlighter, placed in the ROOT layout\nimport hljs from 'highlight.js';\nexport default function Theme() {\n  return <span hidden data-langs={hljs.listLanguages().length} />;\n}\n",
 "n18-3:layout": "$ grep -n \"Theme\" src/app/layout.tsx\n4:import Theme from \"./Theme\";\n27:      <body className=\"min-h-full flex flex-col\"><Theme />{children}</body>\n$ npm run build 2>&1 | grep -E 'Compiled|rror' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 1025ms\n$ node -e \"const fs=require('fs'),z=require('zlib');for(const r of require('./.next/diagnostics/route-bundle-stats.json').filter(r=>['/','/js/goc','/js/server','/js/icon'].includes(r.route))){const g=r.firstLoadChunkPaths.reduce((s,p)=>s+z.gzipSync(fs.readFileSync(p)).length,0);console.log(r.route.padEnd(13),(r.firstLoadUncompressedJsBytes/1024).toFixed(0).padStart(5)+' KB','· gzip '+(g/1024).toFixed(0).padStart(3)+' KB')}\"\n/              1407 KB · gzip 439 KB\n/js/icon       1395 KB · gzip 435 KB\n/js/goc        1391 KB · gzip 434 KB\n/js/server     1391 KB · gzip 434 KB",
 "n18-3:kho": "$ grep -n \"lottie_light\\|299KB\\|164KB\" next.config.js | head -4\n76:  // ĐẦY ĐỦ: 299KB đã minify (đo trên chunk dc112a36….js của bản dựng thật).\n77:  // Bản `lottie_light` là 164KB — rẻ hơn 135KB cho cùng một con robot.\n92:      'lottie-web': require.resolve('lottie-web/build/player/lottie_light.js'),\n$ grep -c \"optimizePackageImports\" next.config.js | sed 's/^/optimizePackageImports tự khai: /'\noptimizePackageImports tự khai: 0\n$ grep -c '\"lodash\"' package.json | sed 's/^/lodash trong package.json: /'\nlodash trong package.json: 0\n$ grep -rln \"next/dynamic\" src | wc -l | sed 's/^ */tệp dùng next\\/dynamic: /'\ntệp dùng next/dynamic: 42",
 "n18-3:dung": "",
 "n18-3:file:src/app/js/dynamic-ngay/Ngay.tsx": "'use client';\n// app/js/dynamic-ngay/Ngay.tsx — next/dynamic, but rendered on first paint anyway\nimport dynamic from 'next/dynamic';\nconst Hl = dynamic(() => import('../client/Hl'));\nexport default function Ngay() {\n  return <Hl />;\n}\n",
 "n18-3:file:src/app/js/dynamic-ngay/page.tsx": "import Ngay from './Ngay';\nexport default function Page() { return <Ngay />; }\n",
 "anh-nxj-18-3:goc": {
  "url": "http://localhost:19328/js/goc",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19328/js/goc",
    "ma": 200,
    "loai": "document",
    "kt": 7415
   },
   {
    "url": "http://localhost:19328/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19328/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1n-ijsq-2h6c8.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/31oh5ebdnfz0n.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "goc ⇒": "JS 6 files · 134 KB over the wire · 446 KB unpacked · big chunk (>500 KB): no"
  }
 },
 "anh-nxj-18-3:server": {
  "url": "http://localhost:19328/js/server",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19328/js/server",
    "ma": 200,
    "loai": "document",
    "kt": 8046
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19328/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19328/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1n-ijsq-2h6c8.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/31oh5ebdnfz0n.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "server ⇒": "JS 6 files · 134 KB over the wire · 446 KB unpacked · big chunk (>500 KB): no"
  }
 },
 "anh-nxj-18-3:client": {
  "url": "http://localhost:19328/js/client",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19328/js/client",
    "ma": 200,
    "loai": "document",
    "kt": 7851
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19328/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19328/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1n-ijsq-2h6c8.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/31oh5ebdnfz0n.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/20r04owryv6fw.js",
    "ma": 200,
    "loai": "script",
    "kt": 967684
   }
  ],
  "console": [],
  "ketQua": {
   "client ⇒": "JS 7 files · 436 KB over the wire · 1,391 KB unpacked · big chunk (>500 KB): YES"
  }
 },
 "anh-nxj-18-3:dynamic-truoc": {
  "url": "http://localhost:19328/js/dynamic",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-18-3:dynamic": {
  "url": "http://localhost:19328/js/dynamic",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19328/js/dynamic",
    "ma": 200,
    "loai": "document",
    "kt": 7614
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19328/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19328/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1n-ijsq-2h6c8.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3xm-8gz9yypxl.js",
    "ma": 200,
    "loai": "script",
    "kt": 5248
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/31oh5ebdnfz0n.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0eogrsdpbxudq.js",
    "ma": 200,
    "loai": "script",
    "kt": 149
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/20r04owryv6fw.js",
    "ma": 200,
    "loai": "script",
    "kt": 967684
   }
  ],
  "console": [],
  "ketQua": {
   "dynamic ⇒ at load": "JS 7 files · 136 KB over the wire · 452 KB unpacked · big chunk (>500 KB): no",
   "dynamic ⇒ click": "after the click: 2 new JS file(s) · 302 KB over the wire · 945 KB unpacked"
  }
 },
 "anh-nxj-18-3:link": {
  "url": "http://localhost:19328/js/link",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19328/js/link",
    "ma": 200,
    "loai": "document",
    "kt": 7670
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19328/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19328/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1n-ijsq-2h6c8.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3zt_16xndew4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 7862
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/31oh5ebdnfz0n.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19328/js/client?_rsc=uif-_Nd6W1Kb3JAa",
    "ma": 200,
    "loai": "fetch",
    "kt": 486
   },
   {
    "url": "http://localhost:19328/js/client?_rsc=Vwoz1EG7qK2CzQKJ",
    "ma": 200,
    "loai": "fetch",
    "kt": 3667
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/20r04owryv6fw.js",
    "ma": 200,
    "loai": "script",
    "kt": 967684
   }
  ],
  "console": [],
  "ketQua": {
   "link ⇒ 3 s after load (link in view)": "JS 8 files · 439 KB over the wire · 1,399 KB unpacked · big chunk (>500 KB): YES"
  }
 },
 "anh-nxj-18-3:link-off": {
  "url": "http://localhost:19328/js/link-off",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19328/js/link-off",
    "ma": 200,
    "loai": "document",
    "kt": 7697
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19328/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19328/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1n-ijsq-2h6c8.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3zt_16xndew4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 7862
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/31oh5ebdnfz0n.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "link-off ⇒ 3 s after load (prefetch={false})": "JS 7 files · 137 KB over the wire · 454 KB unpacked · big chunk (>500 KB): no"
  }
 },
 "anh-nxj-18-3:dynamic-ngay": {
  "url": "http://localhost:19328/js/dynamic-ngay",
  "vp": [
   640,
   240
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19328/js/dynamic-ngay",
    "ma": 200,
    "loai": "document",
    "kt": 8059
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19328/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19328/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1n-ijsq-2h6c8.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/056bcmyvho0g6.js",
    "ma": 200,
    "loai": "script",
    "kt": 5033
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/0eogrsdpbxudq.js",
    "ma": 200,
    "loai": "script",
    "kt": 149
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/31oh5ebdnfz0n.js",
    "ma": 200,
    "loai": "script",
    "kt": 164364
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/1aqukoyloqto2.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19328/_next/static/chunks/20r04owryv6fw.js",
    "ma": 200,
    "loai": "script",
    "kt": 967684
   }
  ],
  "console": [],
  "ketQua": {
   "dynamic-ngay ⇒ at load (rendered immediately)": "JS 9 files · 438 KB over the wire · 1,397 KB unpacked · big chunk (>500 KB): YES"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n18-3 · lab c18 · Next.js 16.4.6 · next build → .next/diagnostics/route-bundle-stats.json · next start 19328 · Chromium Resource Timing)
export const deck = { key: 'nxj-18-3', code: 'NXJ 18.3', title: 'Shipping less JavaScript', sub: 'Chapter 18 · Lesson 18.3' };
const O = (k) => { const v = DU_LIEU[`n18-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-18-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const kq = (k) => Object.values(AN(k).ketQua);
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const so = (s, re) => +s.match(re)[1].replace(/,/g, '');
const STATS = doan('lab', 'route-bundle-stats.json…');
const KB = (r) => so(STATS.find((l) => l.startsWith(r + ' ')), /(\d+) KB ·/);
const GZ = (r) => so(STATS.find((l) => l.startsWith(r + ' ')), /gzip\s+(\d+) KB/);
const LAYOUT = doan('layout', 'node -e');
const KBL = (r) => so(LAYOUT.find((l) => l.startsWith(r + ' ')), /(\d+) KB ·/);
const DYN = kq('dynamic'), NGAY = kq('dynamic-ngay')[0], LINK = kq('link')[0], OFF = kq('link-off')[0];
const W_ = (s) => so(s, /· ([\d,]+) KB over the wire/), U_ = (s) => so(s, /· ([\d,]+) KB unpacked/);
const ICONS = so(doan('lab', 'lucide-react/dist/esm/icons')[0], /= (\d+)/);
const MODI = doan('lab', 'lodash: {');
const KHO = O('kho').split('\n');
const F = (p) => O(`file:src/app/js/${p}`);
if (!/import hljs from 'highlight.js'/.test(F('server/page.tsx')) || !/dynamic\(\(\) => import\('\.\.\/client\/Hl'\)/.test(F('dynamic/Nut.tsx')) || !/import _ from 'lodash'/.test(F('lodash-all/Go.tsx'))) throw new Error('mã lab đổi');
const H_SV = "// app/js/server/page.tsx — Server Component\nimport hljs from 'highlight.js';\nexport default function Page() {\n  return <pre dangerouslySetInnerHTML={{\n    __html: hljs.highlightAuto(SNIPPET).value }} />;\n}";
const H_CL = "'use client';\n// app/js/client/Hl.tsx — the SAME work, client\nimport hljs from 'highlight.js';\nexport default function Hl() { /* same */ }";
const H_DY = "'use client';\n// app/js/dynamic/Nut.tsx\nimport dynamic from 'next/dynamic';\nconst Hl = dynamic(\n  () => import('../client/Hl'),\n  { loading: () => <p>Loading…</p> });\nexport default function Nut() {\n  const [show, setShow] = useState(false);\n  return show ? <Hl /> :\n    <button onClick={() => setShow(true)}>\n      Colour the code</button>;\n}";
const H_LO = "import _ from 'lodash';               // /js/lodash-all\nimport { debounce } from 'lodash';    // /js/lodash\nimport debounce from 'lodash/debounce'; // /js/lodash-le\nimport { Heart } from 'lucide-react'; // /js/icon";
const H_LY = "// app/layout.tsx — ROOT layout: every route renders it\nimport Theme from './Theme';   // 'use client' + highlight.js\n…\n<body><Theme />{children}</body>";

export const S = [
  { cover: true, nhan: 'Chapter 18 · Lesson 18.3', t: 'Shipping less<br>JavaScript', sub: 'One highlighter, five places to put it — server, client, on demand, in the root layout — and what each one costs every visitor',
    en: 'Lesson eighteen point three: shipping less JavaScript. One code highlighter, put in five different places: on the server, on the client, on demand, in the root layout, and behind a link. And what each one costs every visitor.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Server Component: the highlighter costs <b>+0 KB</b> — client: <b>+${KB('/js/client') - KB('/js/goc')} KB</b></li>
    <li><code>next/dynamic</code> + a click: ${KB('/js/dynamic')} KB at load, the rest only when asked</li>
    <li>A <code>&lt;Link&gt;</code> in view <b>prefetches</b> the target’s JavaScript</li>
    <li>One import in the root layout: <b>every</b> route ${KB('/js/goc')} → ${KBL('/js/goc')} KB</li>
    <li><code>import _ from 'lodash'</code> +${KB('/js/lodash-all') - KB('/js/lodash')} KB; named imports are rewritten for you</li></ul>`,
    en: `Five takeaways. In a Server Component, the highlighter costs zero kilobytes; on the client, about ${KB('/js/client') - KB('/js/goc')}. Dynamic import plus a click keeps it out of the first load. A link in view prefetches the target. One import in the root layout makes every route heavy. And the way you import a library matters.` },
  { t: 'Three tools — you have met the biggest one', body: icards([
      ['server', '1 · Keep it on the server', 'A Server Component sends HTML only. Its imports never reach the browser (Chapter 9).'],
      ['plug', '2 · Load heavy parts on demand', '<code>next/dynamic</code>: a separate chunk, fetched when the component first renders.'],
      ['merge', '3 · Split by route (automatic)', 'Each route gets its own chunks — but watch shared imports, and <code>&lt;Link&gt;</code> prefetch.'],
    ], 3) + box('Measured with the build’s own numbers', 'Every size in this lesson is <code>firstLoadUncompressedJsBytes</code> from <code>.next/diagnostics/route-bundle-stats.json</code> (18.1), plus Resource Timing in a real browser.', 'lam'),
    en: 'Three tools. Keep components on the server: their imports never reach the browser. Load heavy parts on demand with next dynamic. And route splitting, which is automatic, as long as you watch shared imports and link prefetch.' },
  { t: `Tool 1: same work on the server = +0 KB`, to: true, body: two(D(tsx(H_SV, { hl: [2] }), tsx(H_CL, { hl: [1, 3] })),
    D(meter([['/js/goc (no library)', KB('/js/goc'), '#64748b'], ['/js/server (highlight.js)', KB('/js/server'), '#16a34a'], ['/js/client (highlight.js)', KB('/js/client'), '#dc2626']], { don: 'KB JS', w: 440, nhan: 230, fs: 15 }),
      tn(STATS.filter((l) => /^\/js\/(goc|server|client) /.test(l)).join('\n'), { fs: 14, wrap: 50, title: 'route-bundle-stats.json (real)' }),
      box('Why', `The server runs <code>highlight.js</code> and sends coloured HTML. On the client, the browser must download and run it: +${KB('/js/client') - KB('/js/goc')} KB (+${GZ('/js/client') - GZ('/js/goc')} KB gzip).`, 'lam')), 'r46'),
    en: `Tool one, measured. The same highlighting, on the server: the route is ${KB('/js/server')} kilobytes, exactly like the page with no library. On the client: ${KB('/js/client')}. The server sends coloured HTML; the client has to download highlight.js itself.` },
  { t: 'Tool 2: next/dynamic — only when asked', body: two(D(tsx(H_DY, { hl: [5, 9] })),
    D(meter([['/js/client (static import)', KB('/js/client'), '#dc2626'], ['/js/dynamic at load', KB('/js/dynamic'), '#16a34a'], ['… after the click (unpacked)', U_(DYN[1]), '#0070f3']], { don: 'KB JS', w: 380, nhan: 220, fs: 15 }),
      tn([`behind a click · at load ⇒ ${DYN[0].replace(' · big chunk (>500 KB): no', '')}`, DYN[1], `rendered at once · at load ⇒ ${NGAY.replace(' · big chunk (>500 KB): YES', '')}`].join('\n'), { fs: 13, wrap: 50, title: 'Chromium · Resource Timing (real)' }),
      box('Only if the render is conditional', `Rendered on first paint anyway (<code>/js/dynamic-ngay</code>): route-bundle-stats says ${KB('/js/dynamic-ngay')} KB, but the browser downloaded ${U_(NGAY)} KB at load. Put it behind a click, a tab or a modal — and measure in the browser too.`, 'do2')), 'r46'),
    en: `Tool two: next dynamic. The highlighter now lives in its own chunk. At load the page ships ${KB('/js/dynamic')} kilobytes; after the click, two new files arrive, about ${U_(DYN[1])} kilobytes unpacked. Rendered immediately instead, the browser still downloads it all at load: ${U_(NGAY)} kilobytes.` },
  { t: 'Tool 3: route splitting — and what Link prefetches', body: two(D(tn([`/js/link     ⇒ ${LINK}`, `/js/link-off ⇒ ${OFF}`].join('\n'), { fs: 13, wrap: 60, title: '3 s after load, nothing clicked (real)' }),
      tsx("// app/js/link/page.tsx\n<Link href=\"/js/client\">Open the coloured code</Link>\n\n// app/js/link-off/page.tsx\n<Link href=\"/js/client\" prefetch={false}>…</Link>", { hl: [2, 5] })),
    D(meter([['/js/link · Link in view', W_(LINK), '#ea580c'], ['/js/link-off · prefetch={false}', W_(OFF), '#16a34a']], { don: 'KB over the wire', w: 420, nhan: 240, fs: 15 }),
      box('You pay for the page you are on…', 'Visiting <code>/js/link</code> does not need <code>/js/client</code>’s code — its own route is small.', 'lam'),
      box('…plus what Link prefetches', 'In production, a <code>&lt;Link&gt;</code> that scrolls into view prefetches the target — here the 945 KB highlighter, with no click. Great for speed, costly on mobile data: use <code>prefetch={false}</code> for rarely-used heavy pages.', 'do2')), 'r46'),
    en: `Tool three: route splitting. A page that only links to the client page is small by itself. But three seconds after load, with nothing clicked, the browser had downloaded ${W_(LINK)} kilobytes: Link prefetched the target, including the big highlighter. With prefetch false: ${W_(OFF)}.` },
  { t: `The shared-import trap: every route ${KB('/js/goc')} → ${KBL('/js/goc')} KB`, body: two(D(tsx(H_LY, { hl: [2, 4] }), tn(['$ npm run build   # with <Theme /> in the root layout', ...LAYOUT].join('\n'), { fs: 14, wrap: 56, title: 'route-bundle-stats.json after (real)' })),
    D(meter([['/js/goc · before', KB('/js/goc'), '#16a34a'], ['/js/goc · after', KBL('/js/goc'), '#dc2626'], ['/js/server · before', KB('/js/server'), '#16a34a'], ['/js/server · after', KBL('/js/server'), '#dc2626'], ['/js/icon · before', KB('/js/icon'), '#16a34a'], ['/js/icon · after', KBL('/js/icon'), '#dc2626']], { don: 'KB JS', w: 440, nhan: 200, fs: 15 }),
      box('One misplaced import, the whole site', 'The root layout is part of every route, so a client component there ships with every page — even pages that never use it. Nothing warns you; the build is green.', 'do2')), 'r46'),
    en: `The shared-import trap. A small theme helper that imports the highlighter, placed in the root layout. Every route grew from about ${KB('/js/goc')} to ${KBL('/js/goc')} kilobytes, even pages that never colour code. The build stays green.` },
  { t: 'How you import a library matters', body: two(D(tsx(H_LO, { sm: true }), tn([...STATS.filter((l) => /^\/js\/(lodash|lodash-le|lodash-all|icon|goc) /.test(l)), `lucide-react: ${ICONS} icon modules in the package`].join('\n'), { fs: 14, wrap: 56, title: 'route-bundle-stats.json (real)' })),
    D(meter([['import _ from lodash', KB('/js/lodash-all'), '#dc2626'], ['import { debounce } from lodash', KB('/js/lodash'), '#16a34a'], ['lodash/debounce', KB('/js/lodash-le'), '#16a34a'], ['{ Heart } from lucide-react', KB('/js/icon'), '#16a34a']], { don: 'KB JS', w: 400, nhan: 260, fs: 15 }),
      box('Next.js already rewrites some imports', `<code>{ debounce } from 'lodash'</code> is rewritten to <code>lodash/debounce</code> (built-in <code>modularizeImports</code>); lucide-react, date-fns, @mui… are in <code>optimizePackageImports</code>. One icon out of ${K_(ICONS)}: +${KB('/js/icon') - KB('/js/goc')} KB.`, 'lam'),
      box('The namespace import cannot be helped', `<code>import _ from 'lodash'</code> pulls the whole library: +${KB('/js/lodash-all') - KB('/js/lodash')} KB for one function.`, 'do2')), 'r46'),
    en: `How you import matters. A named import of debounce, or its own module path: the same small size, because Next.js rewrites lodash named imports for you. One icon from lucide-react costs a few kilobytes. But import underscore from lodash pulls the whole library: plus ${KB('/js/lodash-all') - KB('/js/lodash')} kilobytes for one function.` },
  { t: 'cuongthai.com: the same lessons in a real config', body: two(D(tn(KHO.join('\n'), { fs: 14, wrap: 64, title: 'frontend/ (real)' })),
    D(box('A swap measured in production', '<code>lottie-react</code> pulls the full <code>lottie-web</code> player: 299 KB minified. The config aliases it to <code>lottie_light</code> (164 KB) — 135 KB less for the same robot animation, measured on a real build chunk.', 'lam'),
      box('On demand, 42 times', '42 files use <code>next/dynamic</code> — editors, charts, the 3D playground. And no <code>lodash</code> dependency at all.', 'lam')), 'r64'),
    en: 'cuongthai.com applies the same ideas. Its config swaps the full Lottie player, two hundred ninety-nine kilobytes, for the light build, one hundred sixty-four: a saving measured on a real chunk. Forty-two files use next dynamic. And there is no lodash dependency.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['📱', 'A cheap phone on 3G', ['every KB of JS = download + parse + run', 'a 945 KB library to colour one line']],
      neu: ['❓', 'What if a teammate adds one import to the layout?', [`every route ${KB('/js/goc')} → ${KBL('/js/goc')} KB`, 'build green, no warning — only the numbers show it']],
      xau: ['🕵️', 'More code, more doors', ['every npm package you ship is code you trust', 'a compromised dependency runs in every visitor’s browser']],
      phong: ['🛡️', 'Budget + review the diff in KB', ['route-bundle-stats.json in CI, fail on growth', 'keep libraries on the server when you can']],
    }),
    en: 'Real life: a cheap phone on 3G must download, parse and run every kilobyte. What if a teammate adds one import to the root layout? Every route grows, with no warning. And every package you ship runs in every visitor’s browser: a compromised dependency reaches all of them. Set a budget and keep libraries on the server.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Bundle', 'the JS a route ships'), kw('Server Component', '+0 KB for its imports'), kw('next/dynamic', 'a separate chunk, on demand'), kw('Code splitting', 'chunks per route / per component'),
      kw('Prefetch', 'Link downloads the target early'), kw('Shared import', 'root layout = every route'), kw('Tree shaking', 'drop unused exports (ESM)'), kw('modularizeImports', 'named import → module path'),
      kw('optimizePackageImports', 'icon packs, date-fns…'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the bundle; Server Component; next dynamic; code splitting; prefetch; the shared import; tree shaking; modularizeImports; and optimizePackageImports.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Colour a snippet with ${c('highlight.js')} in a Server Component, then in a client one; compare ${c('route-bundle-stats.json')}`,
      `Wrap the client one in ${c('next/dynamic')} behind a button; watch Network on click`,
      `Add a ${c('<Link>')} to it; reload and wait 3 s; then try ${c('prefetch={false}')}`,
      `Put the client component in the root layout once — measure every route — and take it out`,
    ]), box('Keep these', `<ul><li>Server first: +0 KB</li><li>dynamic only behind a condition</li><li>Link prefetch downloads the target</li><li>Nothing heavy in the root layout</li></ul>`, 'lam'), ''),
    en: 'Your turn: colour a snippet in a Server Component and in a client one and compare sizes; put the client one behind a button with next dynamic; add a link to it and watch prefetch; and try the root layout trap once.' },
];
function K_(n) { return n.toLocaleString('en-US'); }
export const slides = lamDeck({ chuong: 'Chapter 18 — Performance: images, JavaScript and fonts', bai: '18.3' }, S);
