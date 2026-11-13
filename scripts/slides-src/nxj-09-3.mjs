/*DU_LIEU*/
const DU_LIEU = {
 "n9-3:file:src/app/ghep/ChartThuong.tsx": "// KHÔNG có 'use client' — một component \"trung lập\"\nexport default function ChartThuong() {\n  console.log('[ChartThuong] render · van-tay-chart-93', typeof window === 'undefined' ? '· ở MÁY CHỦ' : '· ở TRÌNH DUYỆT');\n  return <p id=\"chart\">📊 ChartThuong (không chỉ thị)</p>;\n}\n",
 "n9-3:file:src/app/ghep/VoClient.tsx": "'use client';\nimport { useState } from 'react';\nimport ChartThuong from './ChartThuong';   // import từ tệp client ⇒ ChartThuong thành mã CLIENT\n\nexport default function VoClient() {\n  const [n, setN] = useState(0);\n  return (\n    <div className=\"rounded border p-2\">\n      <button id=\"vo\" onClick={() => setN(n + 1)}>VoClient: {n}</button>\n      <ChartThuong />\n    </div>\n  );\n}\n",
 "n9-3:file:src/app/ghep/DuLieuServer.tsx": "import { readFile } from 'node:fs/promises';\n\nexport default async function DuLieuServer() {\n  const ds: { id: number; ten: string }[] = JSON.parse(await readFile(process.cwd() + '/src/data/khoa-hoc.json', 'utf8'));\n  console.log('[DuLieuServer] render · van-tay-dulieu-93 · đọc', ds.length, 'khoá');\n  return <ul id=\"ds\">{ds.map((k) => <li key={k.id}>{k.ten}</li>)}</ul>;\n}\n",
 "n9-3:file:src/app/ghep/GioMayChu.tsx": "export default function GioMayChu() {\n  return <p id=\"gio\">⏱ máy chủ render lúc {new Date().toISOString().slice(11, 19)} · van-tay-gio-93</p>;\n}\n",
 "n9-3:file:src/app/ghep/Tabs.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function Tabs({ children, ben }: { children: React.ReactNode; ben: React.ReactNode }) {\n  const [open, setOpen] = useState(true);\n  return (\n    <div className=\"space-y-1 rounded border p-2\">\n      <button id=\"tab\" onClick={() => setOpen(!open)}>{open ? 'Đóng tab' : 'Mở tab'}</button>\n      {open && <div id=\"khe\">{children}</div>}\n      <div id=\"ben\">{ben}</div>\n    </div>\n  );\n}\n",
 "n9-3:file:src/app/ghep/page.tsx": "import VoClient from './VoClient';\nimport Tabs from './Tabs';\nimport DuLieuServer from './DuLieuServer';\nimport GioMayChu from './GioMayChu';\n\nexport const dynamic = 'force-dynamic';\n\nexport default function TrangGhep() {\n  return (\n    <main className=\"space-y-2 p-4 font-sans\">\n      <VoClient />\n      <Tabs ben={<GioMayChu />}>\n        <DuLieuServer />\n      </Tabs>\n    </main>\n  );\n}\n",
 "n9-3:trang": "$ find src/app/ghep -type f | sort\nsrc/app/ghep/ChartThuong.tsx\nsrc/app/ghep/DuLieuServer.tsx\nsrc/app/ghep/GioMayChu.tsx\nsrc/app/ghep/page.tsx\nsrc/app/ghep/Tabs.tsx\nsrc/app/ghep/VoClient.tsx\n$ npm run build\n✓ Compiled successfully in 1975ms\nRoute (app)\n├ ƒ /ghep\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ for v in chart dulieu gio; do printf '%-7s trong .next/static: ' $v; grep -rl \"van-tay-$v-93\" .next/static | wc -l | tr -d ' '; done\nchart   trong .next/static: 1\ndulieu  trong .next/static: 0\ngio     trong .next/static: 0",
 "n9-3:mo": "$ curl -s localhost:19382/ghep | grep -o '<div id=\"khe\">.*van-tay-gio-93</p>' | sed 's#<!-- -->##g'\n<div id=\"khe\"><ul id=\"ds\"><li>React</li><li>Next.js</li><li>Node.js</li></ul></div><div id=\"ben\"><p id=\"gio\">⏱ máy chủ render lúc 13:32:56 · van-tay-gio-93</p>",
 "n9-3:log": "$ npx next start   (log máy chủ: 1 lần curl + 1 lần Chromium mở /ghep rồi bấm Đóng/Mở tab 4 lần)\n[ChartThuong] render · van-tay-chart-93 · ở MÁY CHỦ\n[DuLieuServer] render · van-tay-dulieu-93 · đọc 3 khoá\n[ChartThuong] render · van-tay-chart-93 · ở MÁY CHỦ\n[DuLieuServer] render · van-tay-dulieu-93 · đọc 3 khoá",
 "n9-3:dung": "",
 "n9-3:file:src/app/bay-import/Vo.tsx": "'use client';\nimport DuLieuServer from '../ghep/DuLieuServer';   // import THẲNG một Server Component (async + fs) vào tệp client\n\nexport default function Vo() {\n  return <DuLieuServer />;\n}\n",
 "n9-3:file:src/app/bay-import/page.tsx": "import Vo from './Vo';\n\nexport default function Trang() {\n  return <Vo />;\n}\n",
 "n9-3:bayimport": "$ npm run build   (tệp client import thẳng DuLieuServer: async + fs)\n-----\nFATAL: An unexpected Turbopack error occurred. A panic log has been written to /Users/admin/.rtq-nxj/tmp/next-panic-b7f55a63701043fb791fbb0a4c0f91cf.log.\n-----\nError [TurbopackInternalError]: Failed to write app endpoint /bay-import/page\nCaused by:\n- the chunking context (unknown) does not support external modules (request: node:fs/promises)\nDebug info:\n- Execution of get_all_written_entrypoints_with_issues_operation failed\n- Execution of EntrypointsOperation::new failed\n- Execution of all_entrypoints_write_to_disk_operation failed\n- Execution of output_assets_operation failed\n- Execution of <AppEndpoint as Endpoint>::output failed",
 "n9-3:file:src/app/bay-so/BiMat.tsx": "import 'server-only';   // gài chốt: tệp này chỉ được dùng ở máy chủ\n\nexport default function BiMat() {\n  return <p>khoá: {process.env.KHOA_BI_MAT?.length} ký tự</p>;\n}\n",
 "n9-3:file:src/app/bay-so/Vo.tsx": "'use client';\nimport BiMat from './BiMat';\n\nexport default function Vo() {\n  return <BiMat />;\n}\n",
 "n9-3:file:src/app/bay-so/page.tsx": "import Vo from './Vo';\n\nexport default function Trang() {\n  return <Vo />;\n}\n",
 "n9-3:bayso": "$ npm run build   (tệp client import tệp có import 'server-only')\nError: Turbopack build failed with 2 errors:\n./src/app/bay-so/BiMat.tsx:1:1\nError: You're importing a module that depends on \"server-only\" into a React Client Component module. This API is only available in Server Components but one of its parents is marked with \"use client\", so this module is also a Client Component.\n> 1 | import 'server-only';   // gài chốt: tệp này chỉ được dùng ở máy chủ\n    | ^^^^^^^^^^^^^^^^^^^^^\n  2 |\n  3 | export default function BiMat() {\n  4 |   return <p>khoá: {process.env.KHOA_BI_MAT?.length} ký tự</p>;\nEcmascript file had an error\nImport traces:\n  Client Component Browser:\n    ./src/app/bay-so/BiMat.tsx [Client Component Browser]",
 "n9-3:file:src/app/chep/Tabs.tsx": "// Tabs.tsx — Client: giữ state tab đang mở\n'use client';\nexport default function Tabs({ children }) {\n  const [open, setOpen] = useState(true);\n  return open ? <div>{children}</div> : null;\n}\n",
 "n9-3:file:src/app/chep/ServerData.tsx": "export default async function ServerData() {\n  return <p>Dữ liệu từ máy chủ</p>;\n}\n",
 "n9-3:file:src/app/chep/page.tsx": "import Tabs from './Tabs';\nimport ServerData from './ServerData';\n\n// page.tsx — Server: fetch, rồi lồng một Server Component BÊN TRONG Tabs client\nexport default async function Page() {\n  return (\n    <Tabs>\n      <ServerData />      // render trên server, truyền vào làm children\n    </Tabs>\n  );\n}\n",
 "n9-3:chep": "$ npx tsc --noEmit   (chép NGUYÊN đoạn mã Tabs + page của bài)\nsrc/app/chep/Tabs.tsx:3: error TS7031: Binding element 'children' implicitly has an 'any' type.\nsrc/app/chep/Tabs.tsx:4: error TS2304: Cannot find name 'useState'.\n$ npm run build\nsrc/app/chep/Tabs.tsx(3,32): error TS7031: Binding element 'children' implicitly has an 'any' type.\nsrc/app/chep/Tabs.tsx(4,27): error TS2304: Cannot find name 'useState'.\n$ npm run build   (thêm import useState + kiểu children — page giữ NGUYÊN)\n✓ Compiled successfully in 257ms\n├ ○ /chep",
 "n9-3:chepmo": "$ curl -s localhost:19382/chep | grep -o '<div><p>Dữ liệu từ máy chủ</p>[^<]*</div>' | sed 's#<!-- -->##g'\n<div><p>Dữ liệu từ máy chủ</p>      // render trên server, truyền vào làm children</div>\n$ npx eslint src/app/chep/page.tsx 2>&1 | grep -E 'error|problem' | sed 's#.*/c9/##'\n  8:21  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes\n✖ 1 problem (1 error, 0 warnings)",
 "n9-3:chepdung": "",
 "anh-nxj-9-3:ghep-0": {
  "url": "http://127.0.0.1:19382/ghep",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#vo": [
    25,
    25,
    81,
    24
   ],
   "#chart": [
    25,
    49,
    590,
    24
   ],
   "#tab": [
    25,
    99,
    67,
    24
   ],
   "#khe": [
    25,
    127,
    590,
    72
   ],
   "#ben": [
    25,
    203,
    590,
    24
   ]
  },
  "console": [
   {
    "kieu": "log",
    "chu": "[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT"
   }
  ]
 },
 "anh-nxj-9-3:ghep-dong": {
  "url": "http://127.0.0.1:19382/ghep",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#vo": [
    25,
    25,
    77,
    24
   ],
   "#chart": [
    25,
    49,
    590,
    24
   ],
   "#tab": [
    25,
    99,
    52,
    24
   ],
   "#khe": null,
   "#ben": [
    25,
    127,
    590,
    24
   ]
  },
  "console": [
   {
    "kieu": "log",
    "chu": "[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT"
   },
   {
    "kieu": "log",
    "chu": "[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT"
   }
  ]
 },
 "anh-nxj-9-3:ghep": {
  "url": "http://127.0.0.1:19382/ghep",
  "vp": [
   640,
   260
  ],
  "rect": {
   "#vo": [
    25,
    25,
    77,
    24
   ],
   "#chart": [
    25,
    49,
    590,
    24
   ],
   "#tab": [
    25,
    99,
    67,
    24
   ],
   "#khe": [
    25,
    127,
    590,
    72
   ],
   "#ben": [
    25,
    203,
    590,
    24
   ]
  },
  "mang": [
   {
    "url": "http://127.0.0.1:19382/ghep",
    "ma": 200,
    "loai": "document",
    "kt": 7635
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/chunks/1pm-fvhw53mxi.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15338
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/chunks/1zubnxkicks1l.js",
    "ma": 200,
    "loai": "script",
    "kt": 943
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19382/_next/static/media/77814b00d5ca94a4-s.21jp631_3pja2.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 16540
   }
  ],
  "console": [
   {
    "kieu": "log",
    "chu": "[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT"
   },
   {
    "kieu": "log",
    "chu": "[ChartThuong] render · van-tay-chart-93 · ở TRÌNH DUYỆT"
   }
  ],
  "ketQua": {
   "sauBam": "ReactNext.jsNode.js",
   "reqMoi": "0 request mới sau 4 lần bấm tab",
   "gio": "⏱ máy chủ render lúc 13:33:05 · van-tay-gio-93"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, three, steps, kw, c, cmp, br, cay, tiers } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-09-3', code: 'NXJ 9.3', title: 'The boundary: how the two kinds compose', sub: 'Chapter 9 · Lesson 9.3' };
const O = (k) => { const v = DU_LIEU[`n9-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-9-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-09-3', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
// mã THẬT, chỉ bỏ chú thích cuối dòng (tiếng Việt) cho vừa slide
const goc = (src) => src.trim().split('\n').map((l) => l.replace(/\s+\/\/ .*$/, '')).join('\n');
const G = AN('ghep');
if (G.ketQua.reqMoi !== '0 request mới sau 4 lần bấm tab' || G.ketQua.sauBam !== 'ReactNext.jsNode.js' || G.console.length !== 2 || !G.console.every((m) => m.chu.includes('ChartThuong') && m.chu.includes('TRÌNH DUYỆT'))) throw new Error('số đo ghep 9.3 đổi');
for (const [k, s] of [['trang', 'chart   trong .next/static: 1'], ['trang', 'dulieu  trong .next/static: 0'], ['trang', 'gio     trong .next/static: 0'], ['trang', 'ƒ /ghep'],
  ['bayimport', 'does not support external modules (request: node:fs/promises)'], ['bayso', 'You\'re importing a module that depends on "server-only" into a React Client Component module'],
  ['chep', 'TS2304: Cannot find name \'useState\''], ['chep', 'TS7031'], ['chepmo', '// render trên server, truyền vào làm children</div>'], ['chepmo', 'react/jsx-no-comment-textnodes']])
  if (!O(k).includes(s)) throw new Error(`số đo 9.3 đổi: ${k} thiếu "${s}"`);
const LOG = O('log').split('\n').filter((l) => l.startsWith('['));
if (LOG.filter((l) => l.includes('DuLieuServer')).length !== 2) throw new Error('log 9.3 đổi');

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.3', t: 'The boundary:<br>how the two kinds compose', sub: 'Imports carry the boundary down; children and props let server output pass through it. Measured, including the errors you get',
    en: 'Lesson nine point three: the boundary — how Server and Client Components compose. Imports carry the boundary down; children and props let server output pass through it. We measure both, including the errors you get.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Measured: a component <b>imported</b> by a client file becomes client code — directive or not</li>
    <li>Measured: importing a server-only component into a client file breaks the build — and how <code>server-only</code> makes the error readable</li>
    <li>The slot pattern: pass a Server Component as <code>children</code> (or any prop) — it stays on the server</li>
    <li>Measured: toggling the client shell never calls the server again</li>
    <li>Two pitfalls: the lesson's own snippet, and the client wrapper around a whole page</li></ul>`,
    en: 'Five takeaways: a component imported by a client file becomes client code; importing a server-only component into a client file breaks the build, and server-only makes the error readable; the slot pattern with children or any prop; toggling the client shell never calls the server; and two pitfalls.' },
  { t: 'Measured: the boundary travels through imports', body: two(tsx(goc(O('file:src/app/ghep/VoClient.tsx')).replace('onClick={() => setN(n + 1)}>', 'onClick={() => setN(n + 1)}>\n          '), { sm: true, hl: [1, 3] }),
      tsx(goc(O('file:src/app/ghep/ChartThuong.tsx')).split('\n').slice(1).join('\n').replace("van-tay-chart-93', ", "van-tay-chart-93',\n    ").replace(" ? '· ở MÁY CHỦ'", "\n      ? '· ở MÁY CHỦ'").replace('return <p id="chart">', 'return <p id="chart">\n    '), { sm: true, hl: [2, 3, 4] }), '') +
      two(D(tn(lay('trang', /^chart/), { fs: 16, title: 'grep its string in the browser files (real)' }),
        tn(G.console.map((m) => m.chu).join('\n'), { fs: 14, wrap: 52, title: 'Chromium console (real)' })),
        box('No directive, still client code', '<code>ChartThuong</code> has no <code>\'use client\'</code>. Imported by <code>VoClient</code>, it joined the client bundle and renders in the browser (here twice: hydration, then after a click on VoClient).', 'lam'), ''),
    en: 'Measured: the boundary travels through imports. ChartThuong has no directive. VoClient, a client file, imports it. Its string is now in one browser file, and the browser console shows it rendering in the browser — twice: once at hydration, once after a click on VoClient. Imported by a client file, a component is client code, directive or not.' },
  { t: 'Measured: a client file imports server-only code', body: two(D(tsx(goc(O('file:src/app/bay-import/Vo.tsx')), { sm: true, hl: [2] }),
      tn(lay('bayimport', /FATAL|TurbopackInternalError|chunking context/).replace(/A panic log has been written to .*$/m, 'A panic log has been written to …'), { fs: 14, wrap: 58, title: 'npm run build — DuLieuServer uses async + fs (real)' })),
      D(tsx(goc(O('file:src/app/bay-so/BiMat.tsx')).split('\n').slice(0, 1).join('\n') + '\n…', { sm: true, hl: [1] }),
        tn(lay('bayso', /You're importing a module that depends on "server-only"/), { fs: 14, wrap: 58, title: "npm run build — with import 'server-only' (real)" }),
        box('Make the mistake readable', 'Without a guard the build crashes deep inside the bundler. One line — <code>import \'server-only\'</code> — at the top of server-only files turns it into a clear message naming the file.', 'xanh')), ''),
    en: 'Measured: importing a component that needs the server into a client file. DuLieuServer reads a file. The build does not give a friendly message: the bundler crashes, saying it cannot put node fs promises into a browser chunk. Now add one line, import server-only, to a server-only file: the same mistake gives a clear message naming the file and saying a parent is marked use client.' },
  { t: 'The slot pattern: pass server output as children', body: two(tsx(goc(O('file:src/app/ghep/Tabs.tsx')).replace('{ children, ben }: { children: React.ReactNode; ben: React.ReactNode }', '{ children, ben }: {\n  children: React.ReactNode; ben: React.ReactNode;\n}').replace('onClick={() => setOpen(!open)}>', 'onClick={() => setOpen(!open)}>\n        '), { sm: true, hl: [7, 12, 13] }),
      D(tsx(goc(O('file:src/app/ghep/page.tsx')).split('\n').slice(5).join('\n'), { sm: true, hl: [7, 8, 9] }),
        box('Why this is allowed', 'The client file never imports <code>DuLieuServer</code>. The <b>page</b> (server) creates the element, the server renders it, and Tabs receives the finished <b>output</b> in a slot — <code>children</code>, or any prop like <code>ben</code>.', 'lam')), ''),
    en: 'The slot pattern. Tabs is a client component holding open-or-closed state; it renders children and a second slot prop called ben. The page — a Server Component — puts DuLieuServer inside Tabs and GioMayChu in the ben prop. The client file never imports them: the server renders them, and Tabs receives the finished output.' },
  { t: 'Measured: the slotted content stays on the server', body: two(D(tn(lay('trang', /trong \.next\/static/), { fs: 17, title: 'grep each component in the browser files (real)' }),
      tn(lay('mo', /khe/).replace(/<\/li><li>/g, '</li>\n<li>'), { fs: 14, wrap: 60, title: 'curl /ghep — inside Tabs, in the HTML (real)' })),
      D(B('ghep-0', { vp: 640, h: 260, w: 520, url: 'localhost:3000/ghep', mark: [[25, 127, 590, 72, ''], [25, 203, 590, 24, '']] }),
        box('Server stays server', 'Orange boxes: <code>children</code> and <code>ben</code>. DuLieuServer and GioMayChu: <b>0</b> files in <code>.next/static</code>, yet their output sits inside the client Tabs — in the HTML and on screen.', 'xanh')), ''),
    en: 'Measured: the slotted content stays on the server. ChartThuong, imported by a client file, is in the browser files; DuLieuServer and GioMayChu, passed as slots, are in none. Yet their output — the course list and the server time — sits inside the client Tabs, in the HTML and on screen.' },
  { t: 'Measured: the shell toggles without the server', body: two(D(B('ghep-dong', { vp: 640, h: 260, w: 520, url: 'after clicking "Đóng tab"' }),
      box('4 × Đóng / Mở tab', `Content back on screen: <b>${G.ketQua.sauBam.replace('ReactNext.jsNode.js', 'React · Next.js · Node.js')}</b> — <b>${G.ketQua.reqMoi.replace(' request mới sau 4 lần bấm tab', '')}</b> new requests.`, 'xanh')),
      D(tn(`$ server log — 1 × curl + 1 × Chromium (then 4 tab clicks)\n` + LOG.join('\n'), { fs: 14, wrap: 60, title: 'next start (real)' }),
        box('Why', 'The server output was delivered once, as part of the RSC payload. Opening and closing is pure client state: React keeps the slotted output and shows it again — DuLieuServer does not run again (2 page loads ⇒ 2 lines).', 'lam')), ''),
    en: 'Measured: the client shell works on its own. We closed and opened the tab four times: the list came back each time, and there were zero new requests. The server log shows DuLieuServer ran exactly twice — once per page load — never per click. Its output arrived once in the RSC payload; toggling is pure client state.' },
  { t: 'Three ways the two kinds can meet', body: cmp(['Direction', 'Allowed?', 'What happens'], [
      ['Server → renders → Client', '✓ normal', 'a server page uses <code>&lt;Counter /&gt;</code>; the client part ships its JS'],
      ['Client → <b>imports</b> → component', '⚠ becomes client', 'no directive needed — it joins the bundle (ChartThuong: 1 file). Needs the server (fs, DB, secret)? ⇒ build breaks'],
      ['Client → <b>children / prop</b> → Server', '✓ the escape hatch', 'the parent (server) composes it; the client receives rendered output (DuLieuServer: 0 files)'],
    ], { hl: [2] }) + box('The import rule is one-way', 'A client file cannot pull server code into the browser. It can only <b>receive</b> what a server parent already rendered.', 'lam'),
    en: 'Three ways the two kinds meet. A server component rendering a client one: normal. A client file importing a component: it becomes client code — and if it needs the server, the build breaks. A client component receiving a server component through children or a prop: allowed — the escape hatch. The import rule is one way.' },
  { t: 'A Server Component inside a Client Component', body: steps([
      '<b>A client file cannot import a server-only file</b> — the import would drag server code into the bundle (measured: the build crashes)',
      '<b>But it can receive one as <code>children</code></b> — <code>&lt;Tabs&gt;&lt;DuLieuServer /&gt;&lt;/Tabs&gt;</code>, composed in a server parent; it arrives already rendered',
      '<b>Props work the same way</b> — <code>&lt;Tabs ben={&lt;GioMayChu /&gt;}&gt;</code>: any prop slot can take a rendered server element',
      '<b>So the interactive shell wraps server content</b> — the tab bar is client, the panel is server. Neither gives up what it is good at',
    ]),
    en: 'Keeping a Server Component inside a Client Component. A client file cannot import a server-only file. But it can receive one as children, composed in a server parent and delivered already rendered. Any prop works the same way — our ben prop. So the interactive shell wraps server content: the tab bar is client, the panel is server.' },
  { t: "Pitfall measured in the lesson's own snippet", body: tsx(O('file:src/app/chep/page.tsx').trim().split('\n').slice(4).join('\n'), { sm: true, hl: [4] }) +
      two(D(tsx(O('file:src/app/chep/Tabs.tsx').trim(), { sm: true, hl: [3, 4] }),
        tn(lay('chep', /^src\/app\/chep\/Tabs\.tsx:\d/), { fs: 14, wrap: 48, title: 'npx tsc --noEmit — copied as-is (real)' })),
      D(tn(lay('chepmo', /render trên server/).replace(/<!-- -->/g, '') + '\n' + lay('chepmo', /jsx-no-comment/), { fs: 14, wrap: 64, title: 'after adding the import: curl · eslint (real)' }),
        box('Two fixes', 'Import <code>useState</code> and type <code>children</code>. And inside JSX, <code>// …</code> between tags is <b>text</b>: it shows up on the page. Write <code>{/* … */}</code>.', 'do2')), 'r46'),
    en: 'A pitfall we measured in this lesson\'s own snippet. Copied as-is, TypeScript reports two errors: useState is never imported, and children has an implicit any type — and next build fails on them. Fix those, and the page renders the double-slash comment as text inside the tab. Only ESLint flags it. Inside JSX, comments go in curly braces.' },
  { t: 'Pitfall: a client wrapper around the whole page', body: two(D(cay({ t: "layout.tsx + 'use client'", s: 'to add one onClick', mau: '#c2410c' }, [
      { t: 'page (DB query)', s: '✗ breaks (fs/DB)', mau: '#b91c1c' }, { t: 'markdown lib', s: '→ bundle', mau: '#c2410c' }, { t: 'chart', s: '→ bundle', mau: '#c2410c' }], { w: 540, h: 230 }),
      '<div class="cap">illustration — what everything it imports turns into</div>'),
      D(box('Wrong', 'Mark the layout-shaped component client to get one <code>onClick</code>: every child it <b>imports</b> becomes client code — the DB query fails to build, the markdown parser ships, the bundle balloons.', 'do2'),
        box('Right', 'Keep the shell client but make it render <code>{children}</code>, and compose the server content in the parent. Push <code>\'use client\'</code> down — often to a single button or input (9.5 measures it).', 'xanh')), ''),
    en: 'The pitfall: a client component that exists only to add one onClick, but wraps the whole page. Every child it imports becomes client code: a database query no longer builds, the markdown parser ships to users. The fix is the composition rule: keep the shell client, make it render children, and compose the server content in the parent. Push use client down — often to a single button.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Composition boundary', 'how server and client components nest'), kw('Inherited through imports', 'a component imported by a client file is client code'),
      kw('One-way import', 'a client file cannot pull server-only code into the bundle'), kw('Children pattern', 'pass a Server Component as children of a Client Component'),
      kw('Slot via props', 'any prop can carry rendered server output'), kw("import 'server-only'", 'a guard that turns the mistake into a clear build error'),
      kw('Client island', 'an interactive piece inside a mostly-server page'), kw('Server stays server', 'a server child passed as children still renders on the server'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: composition boundary; inherited through imports; one-way import; the children pattern; slots via props; import server-only; client island; and server stays server.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Import a plain component into a ${c("'use client'")} file; grep ${c('.next/static')} for it`,
      `Import a component that reads ${c('fs')} into a client file and build. Then add ${c("import 'server-only'")} and build again`,
      `Build ${c('<Tabs>')} with ${c('children')} + one slot prop; pass Server Components into both`,
      'Toggle the tabs and count requests in DevTools Network',
    ]), box('Keep these', `<ul><li>Imports carry the boundary: imported by client ⇒ client</li><li>Server-only code cannot be imported by a client file</li><li>children / props: server output passes through</li><li>Guard server files with <code>server-only</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: import a plain component into a client file and grep for it; import a component that reads fs into a client file and build, then add import server-only and build again; build Tabs with children and a slot prop and pass Server Components into both; toggle the tabs and count requests. Keep: imports carry the boundary; server-only code cannot be imported by a client file; children and props let server output through; guard server files with server-only.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Server Components vs Client Components', bai: '9.3' }, S);
