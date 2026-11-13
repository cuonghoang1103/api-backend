/*DU_LIEU*/
const DU_LIEU = {
 "n10-2:api": "$ curl -s 127.0.0.1:19385/gia\n{\"gia\":100,\"luc\":\"21:56:51.530\"}",
 "n10-2:file:app/gia/page.jsx": "// app/gia/page.jsx — GIỐNG HỆT ở cả hai dự án: trang động (đọc searchParams) + một fetch KHÔNG tuỳ chọn\nexport default async function Gia({ searchParams }) {\n  const q = (await searchParams).q ?? '-';            // đọc request ⇒ trang động\n  const res = await fetch('http://127.0.0.1:19385/gia');\n  const d = await res.json();\n  return <p id=\"gia\">giá {d.gia} · API trả lúc {d.luc} · q={q}</p>;\n}\n",
 "n10-2:v14": "$ npx next --version\nNext.js v14.2.35\n$ npm run build\n ✓ Compiled successfully\n└ ƒ /gia                                 142 B          87.4 kB\nƒ  (Dynamic)  server-rendered on demand\n$ curl -s 'localhost:19387/gia?q=1' | grep -o '<p id=\"gia\">[^/]*' | sed 's/<!-- -->//g; s/<p id=\"gia\">//'\ngiá 100 · API trả lúc 21:51:51.653 · q=1<\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo\n{\"gia\":250}\n$ curl -s 'localhost:19387/gia?q=2' | grep -o '<p id=\"gia\">[^/]*' | sed 's/<!-- -->//g; s/<p id=\"gia\">//'\ngiá 100 · API trả lúc 21:51:51.653 · q=2<\n$ curl -s 'localhost:19387/gia?q=3' | grep -o '<p id=\"gia\">[^/]*' | sed 's/<!-- -->//g; s/<p id=\"gia\">//'\ngiá 100 · API trả lúc 21:51:51.653 · q=3<\n$ curl -s 127.0.0.1:19385/dem; echo\n{\"/gia\":1}\n$ ls .next/cache/fetch-cache | wc -l | sed 's/^ */tệp trong .next\\/cache\\/fetch-cache: /'\ntệp trong .next/cache/fetch-cache: 1",
 "n10-2:v16": "$ npx next --version\nNext.js v16.4.6\n$ diff ../c10-14/app/gia/page.jsx src/app/gia/page.jsx && echo 'page.jsx: giống hệt từng byte'\npage.jsx: giống hệt từng byte\n$ npm run build\n✓ Compiled successfully in 2.6s\n├ ƒ /gia\nƒ  (Dynamic)  server-rendered on demand\n$ curl -s 'localhost:19386/gia?q=1' | grep -o '<p id=\"gia\">[^/]*' | sed 's/<!-- -->//g; s/<p id=\"gia\">//'\ngiá 100 · API trả lúc 21:52:03.393 · q=1<\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo\n{\"gia\":250}\n$ curl -s 'localhost:19386/gia?q=2' | grep -o '<p id=\"gia\">[^/]*' | sed 's/<!-- -->//g; s/<p id=\"gia\">//'\ngiá 250 · API trả lúc 21:52:03.444 · q=2<\n$ curl -s 'localhost:19386/gia?q=3' | grep -o '<p id=\"gia\">[^/]*' | sed 's/<!-- -->//g; s/<p id=\"gia\">//'\ngiá 250 · API trả lúc 21:52:03.468 · q=3<\n$ curl -s 127.0.0.1:19385/dem; echo\n{\"/gia\":3}",
 "n10-2:file:src/app/gia-tinh/page.tsx": "// trang KHÔNG đọc gì từ request + fetch không tuỳ chọn (Next 16.4.6)\nexport default async function GiaTinh() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?trang=tinh')).json();\n  return <p id=\"gia\">giá {d.gia} · API trả lúc {d.luc}</p>;\n}\n",
 "n10-2:file:src/app/tc/force/page.tsx": "import { connection } from 'next/server';\n// trang động + fetch force-cache: lưu kết quả, dùng lại qua MỌI request\nexport default async function Force() {\n  await connection();\n  const d = await (await fetch('http://127.0.0.1:19385/gia?tc=force', { cache: 'force-cache' })).json();\n  return <p id=\"gia\">giá {d.gia}</p>;\n}\n",
 "n10-2:file:src/app/tc/no-store/page.tsx": "// KHÔNG có connection(): chỉ một fetch no-store\nexport default async function NoStore() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?tc=no-store', { cache: 'no-store' })).json();\n  return <p id=\"gia\">giá {d.gia}</p>;\n}\n",
 "n10-2:tinh": "$ npm run build\n├ ƒ /gia\n├ ○ /gia-tinh\n├ ƒ /tc/force\n├ ƒ /tc/no-store\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ curl -s 127.0.0.1:19385/dem; echo\n{\"/gia?trang=tinh\":1,\"/nguoi-dung?qua=axios\":1,\"/nguoi-dung?qua=cache\":1,\"/nguoi-dung?qua=fetch\":1}\n$ node -e \"for (const f of require('fs').readdirSync('.next/cache/fetch-cache')) { const j = JSON.parse(require('fs').readFileSync('.next/cache/fetch-cache/' + f)); console.log(j.data.url, '· revalidate', j.revalidate, 'giây') }\"\nhttp://127.0.0.1:19385/nguoi-dung?qua=fetch · revalidate 31536000 giây\nhttp://127.0.0.1:19385/gia?trang=tinh · revalidate 31536000 giây\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo\n{\"gia\":250}\n$ for p in gia-tinh tc/force tc/no-store; do curl -s localhost:19386/$p | sed 's/<!-- -->//g' | grep -o '<p id=\"gia\">[^·<]*' | sed \"s#<p id=\\\"gia\\\">#/$p lần 1: #\"; done\n/gia-tinh lần 1: giá 100 \n/tc/force lần 1: giá 250\n/tc/no-store lần 1: giá 250\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=300'; echo\n{\"gia\":300}\n$ for p in gia-tinh tc/force tc/no-store; do for i in 2 3; do curl -s localhost:19386/$p | sed 's/<!-- -->//g' | grep -o '<p id=\"gia\">[^·<]*' | sed \"s#<p id=\\\"gia\\\">#/$p lần $i: #\"; done; done\n/gia-tinh lần 2: giá 100 \n/gia-tinh lần 3: giá 100 \n/tc/force lần 2: giá 250\n/tc/force lần 3: giá 250\n/tc/no-store lần 2: giá 300\n/tc/no-store lần 3: giá 300\n$ curl -s 127.0.0.1:19385/dem; echo\n{\"/gia?trang=tinh\":1,\"/nguoi-dung?qua=axios\":1,\"/nguoi-dung?qua=cache\":1,\"/nguoi-dung?qua=fetch\":1,\"/gia?tc=force\":1,\"/gia?tc=no-store\":3}\n$ curl -s -D - -o /dev/null localhost:19386/gia-tinh | grep -iE 'x-nextjs-cache|cache-control'\nx-nextjs-cache: HIT\nCache-Control: s-maxage=31536000",
 "n10-2:file:src/app/rc/a/page.tsx": "import Link from 'next/link';\nimport { connection } from 'next/server';\n// trang A: động, đọc giá MỚI NHẤT mỗi lần máy chủ render nó\nexport default async function A() {\n  await connection();\n  const d = await (await fetch('http://127.0.0.1:19385/gia?rc=a')).json();\n  return (\n    <div className=\"p-4 font-sans text-3xl\">\n      <p id=\"gia\">trang A · giá {d.gia}</p>\n      <Link id=\"sang-b\" href=\"/rc/b\" className=\"text-blue-600 underline\">sang trang B</Link>\n    </div>\n  );\n}\n",
 "n10-2:file:src/app/rc/b/page.tsx": "import Link from 'next/link';\nexport default function B() {\n  return (\n    <div className=\"p-4 font-sans text-3xl\">\n      <p>trang B</p>\n      <Link id=\"ve-a\" href=\"/rc/a\" className=\"text-blue-600 underline\">về trang A (Link)</Link>\n    </div>\n  );\n}\n",
 "n10-2:rc": "$ npm run build\n├ ƒ /rc/a\n├ ○ /rc/b",
 "n10-2:dung": "",
 "n10-2:file:app/gia-tinh/page.jsx": "// Next 14.2.35 — trang KHÔNG đọc request + fetch không tuỳ chọn\nexport default async function GiaTinh() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?trang=tinh14')).json();\n  return <p id=\"gia\">giá {d.gia} · API trả lúc {d.luc}</p>;\n}\n",
 "n10-2:file:app/tc/force/page.jsx": "// Next 14.2.35 — trang động (searchParams) + force-cache\nexport default async function Force({ searchParams }) {\n  await searchParams;\n  const d = await (await fetch('http://127.0.0.1:19385/gia?tc=force14', { cache: 'force-cache' })).json();\n  return <p id=\"gia\">giá {d.gia}</p>;\n}\n",
 "n10-2:file:app/tc/no-store/page.jsx": "// Next 14.2.35 — chỉ một fetch no-store\nexport default async function NoStore() {\n  const d = await (await fetch('http://127.0.0.1:19385/gia?tc=no-store14', { cache: 'no-store' })).json();\n  return <p id=\"gia\">giá {d.gia}</p>;\n}\n",
 "n10-2:v14b": "$ npm run build   (Next.js 14.2.35)\n├ ○ /gia-tinh                            153 B          87.4 kB\n├ ƒ /tc/force                            153 B          87.4 kB\n└ ƒ /tc/no-store                         153 B          87.4 kB\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ curl -s 127.0.0.1:19385/dem; echo\n{\"/gia?trang=tinh14\":1}\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=250'; echo\n{\"gia\":250}\n$ for p in gia-tinh tc/force tc/no-store; do curl -s localhost:19387/$p | sed 's/<!-- -->//g' | grep -o '<p id=\"gia\">[^·<]*' | sed \"s#<p id=\\\"gia\\\">#/$p lần 1: #\"; done\n/gia-tinh lần 1: giá 100 \n/tc/force lần 1: giá 250\n/tc/no-store lần 1: giá 250\n$ curl -s -XPOST '127.0.0.1:19385/gia?v=300'; echo\n{\"gia\":300}\n$ for p in gia-tinh tc/force tc/no-store; do for i in 2 3; do curl -s localhost:19387/$p | sed 's/<!-- -->//g' | grep -o '<p id=\"gia\">[^·<]*' | sed \"s#<p id=\\\"gia\\\">#/$p lần $i: #\"; done; done\n/gia-tinh lần 2: giá 100 \n/gia-tinh lần 3: giá 100 \n/tc/force lần 2: giá 250\n/tc/force lần 3: giá 250\n/tc/no-store lần 2: giá 300\n/tc/no-store lần 3: giá 300\n$ curl -s 127.0.0.1:19385/dem; echo\n{\"/gia?trang=tinh14\":1,\"/gia?tc=force14\":1,\"/gia?tc=no-store14\":3}",
 "anh-nxj-10-2:rc-mo": {
  "url": "http://127.0.0.1:19386/rc/a",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-10-2:rc-link": {
  "url": "http://127.0.0.1:19386/rc/a",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-10-2:rc-back": {
  "url": "http://127.0.0.1:19386/rc/a",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-10-2:rc-f5": {
  "url": "http://127.0.0.1:19386/rc/a",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19386/rc/a",
    "ma": 200,
    "loai": "document",
    "kt": 7697
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/158ib7ziyxck8.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14804
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/3zt_16xndew4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 7862
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/09d76vczcraem.js",
    "ma": 200,
    "loai": "script",
    "kt": 164368
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19386/rc/b?_rsc=dLurfUL0zkQOJ5IP",
    "ma": 200,
    "loai": "fetch",
    "kt": 481
   },
   {
    "url": "http://127.0.0.1:19386/rc/b?_rsc=MOoW5dz23PL14Tsd",
    "ma": 200,
    "loai": "fetch",
    "kt": 3862
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 7968
   },
   {
    "url": "http://127.0.0.1:19386/rc/a?_rsc=HzM552oWuDBuQaD-",
    "ma": 200,
    "loai": "fetch",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19385/dem",
    "ma": 200,
    "loai": "fetch",
    "kt": 15
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/158ib7ziyxck8.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14804
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/09d76vczcraem.js",
    "ma": 200,
    "loai": "script",
    "kt": 164368
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19386/rc/a",
    "ma": 200,
    "loai": "document",
    "kt": 7697
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/chunks/3zt_16xndew4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 7862
   },
   {
    "url": "http://127.0.0.1:19386/_next/static/media/f58031ded4338640-s.390ncx5urfkfu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19386/rc/b?_rsc=dLurfUL0zkQOJ5IP",
    "ma": 200,
    "loai": "fetch",
    "kt": 481
   },
   {
    "url": "http://127.0.0.1:19386/rc/b?_rsc=MOoW5dz23PL14Tsd",
    "ma": 200,
    "loai": "fetch",
    "kt": 3862
   },
   {
    "url": "http://127.0.0.1:19385/dem",
    "ma": 200,
    "loai": "fetch",
    "kt": 15
   }
  ],
  "console": [],
  "ketQua": {
   "1-mo": "trang A · giá 100",
   "2-link": "/rc/a · trang A · giá 250",
   "3-back": "/rc/a · trang A · giá 250",
   "4-dem-truoc-f5": "{\"/gia?rc=a\":2}",
   "5-f5": "trang A · giá 300",
   "6-dem": "{\"/gia?rc=a\":3}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, icards, tiers } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-10-2', code: 'NXJ 10.2', title: 'Caching, honestly (it depends on your version)', sub: 'Chapter 10 · Lesson 10.2' };
const O = (k) => { const v = DU_LIEU[`n10-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-10-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-10-2', ten, o);
const F = (p) => O(`file:${p}`).trim();
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const doan = (k, dau, n = 0) => { const ls = O(k).split('\n'); const ii = ls.map((l, i) => (l.startsWith('$ ') && l.includes(dau) ? i : -1)).filter((i) => i >= 0); const i = ii[n]; if (i === undefined) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const gia = (k, q) => doan(k, `gia?q=${q}`)[0].replace(/<$/, '');
const dem = (k, n = 0) => JSON.parse(doan(k, '/dem', n)[0]);

// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const V14 = O('v14'), V16 = O('v16');
const R14 = [1, 2, 3].map((q) => gia('v14', q)), R16 = [1, 2, 3].map((q) => gia('v16', q));
const H14 = dem('v14')['/gia'], H16 = dem('v16')['/gia'];
if (!V14.includes('Next.js v14.2.35') || !V16.includes('Next.js v16.4.6') || !V16.includes('giống hệt từng byte')) throw new Error('phiên bản 10.2 đổi');
if (!R14.every((r) => r.startsWith('giá 100')) || !R16[1].startsWith('giá 250') || H14 !== 1 || H16 !== 3) throw new Error('số đo 14 vs 16 đổi');
const L1 = doan('tinh', 'lần 1: #'), L23 = doan('tinh', 'for i in 2 3');
const lan = (p) => [...L1, ...L23].filter((l) => l.startsWith(`/${p} `)).map((l) => l.split(': ')[1].trim());
const TINH = lan('gia-tinh'), FORCE = lan('tc/force'), NOS = lan('tc/no-store');
const HT = dem('tinh', 1);
const FC = doan('tinh', 'fetch-cache').filter((l) => l.includes('gia?trang=tinh'))[0];
const HDR = doan('tinh', 'x-nextjs-cache');
const BUILD = O('tinh').split('\n').filter((l) => /^[├└○ƒ]/.test(l) && /gia|tc|Static|Dynamic/.test(l));
if (TINH.join() !== 'giá 100,giá 100,giá 100' || FORCE.join() !== 'giá 250,giá 250,giá 250' || NOS.join() !== 'giá 250,giá 300,giá 300') throw new Error('số đo ba tuỳ chọn đổi');
if (HT['/gia?tc=force'] !== 1 || HT['/gia?tc=no-store'] !== 3 || HT['/gia?trang=tinh'] !== 1 || !/revalidate 31536000/.test(FC) || !HDR.join().includes('HIT')) throw new Error('số đo tĩnh 10.2 đổi');
if (!BUILD.some((l) => /ƒ \/tc\/no-store/.test(l))) throw new Error('no-store không thành ƒ');
const L1b = doan('v14b', 'lần 1: #'), L23b = doan('v14b', 'for i in 2 3');
const lan14 = (p) => [...L1b, ...L23b].filter((l) => l.startsWith(`/${p} `)).map((l) => l.split(': ')[1].trim());
const H14b = dem('v14b', 1);
if (lan14('gia-tinh').join() !== TINH.join() || lan14('tc/force').join() !== FORCE.join() || lan14('tc/no-store').join() !== NOS.join() || H14b['/gia?tc=force14'] !== 1 || H14b['/gia?tc=no-store14'] !== 3 || H14b['/gia?trang=tinh14'] !== 1) throw new Error('số đo 14 ba tuỳ chọn đổi');
const RC = AN('rc-f5').ketQua;
if (RC['1-mo'] !== 'trang A · giá 100' || !RC['2-link'].endsWith('giá 250') || !RC['3-back'].endsWith('giá 250') || RC['5-f5'] !== 'trang A · giá 300' || RC['6-dem'] !== '{"/gia?rc=a":3}') throw new Error('số đo Router Cache đổi');

const ketQua = (R) => R.map((r, i) => `request ${i + 1}: ${r.replace(/ · API trả lúc [\d:.]+/, '')}`).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.2', t: 'Caching, honestly:<br>it depends on your version', sub: 'The same file, run on Next.js 14.2.35 and 16.4.6, gives different answers. Measured: the four caches, and how to pin the behaviour down',
    en: 'Lesson ten point two: caching, honestly. The same file run on Next.js fourteen and sixteen gives different answers. We measure it, then measure the four caches and how to pin the behaviour down so you never have to guess.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Measured: one file, Next.js 14 vs 16 — the default for <code>fetch</code> flipped</li>
    <li>Say it explicitly: <code>force-cache</code>, <code>no-store</code>, <code>next.revalidate</code> — what each did, request by request</li>
    <li>"Not cached by default" ≠ "always fresh": a static page bakes its fetch at build time</li>
    <li>Request memoization vs the Data Cache: one render vs every request</li>
    <li>The four layers — and the browser's Router Cache showing an old price on Back</li></ul>`,
    en: 'Five takeaways: measured, one file on Next.js fourteen versus sixteen — the fetch default flipped; how to say it explicitly with force-cache, no-store and revalidate; why not cached by default does not mean always fresh; request memoization versus the Data Cache; and the four layers, including the browser Router Cache showing an old price on Back.' },
  { t: 'One file, two versions: the default flipped', body: tsx(goc(F('app/gia/page.jsx')).split('\n').filter((l) => !l.startsWith('//')).join('\n'), { sm: true, hl: [3] }) +
    two(D(tn('$ npx next --version\nNext.js v14.2.35\n# source → 250 after request 1\n' + ketQua(R14) + `\nAPI hits: ${H14} · fetch-cache: 1 file`, { fs: 16, title: 'Next.js 14.2.35 (real)' }),
        box('14: cached by default', 'A fetch with no options behaved like <code>force-cache</code>: stored, reused for every request. The source changed — the page did not.', 'do2')),
      D(tn('$ npx next --version\nNext.js v16.4.6\n# source → 250 after request 1\n' + ketQua(R16) + `\nAPI hits: ${H16}`, { fs: 16, title: 'Next.js 16.4.6 (real)' }),
        box('15+: not cached by default', 'The same bytes (<code>diff</code>: identical) now fetch on every request of this dynamic page: always the latest price.', 'xanh')), ''),
    en: 'One file, two versions. This page is dynamic because it reads searchParams, and its fetch has no options. On Next.js fourteen point two point thirty-five: three requests, the price at the source changed after the first — the page kept showing one hundred, and the API was hit once. On sixteen point four point six, the same bytes: the API was hit three times and the page shows two hundred fifty. The default flipped.' },
  { t: 'So: never rely on the default — say it', body: two(tsx(`// cache this result and reuse it
await fetch(url, { cache: 'force-cache' });

// never cache — fetch fresh on every request
await fetch(url, { cache: 'no-store' });

// cache, but treat it as stale after 60 s (10.3)
await fetch(url, { next: { revalidate: 60 } });`, { sm: true }),
      cmp(['Option', 'Means', 'Good for'], [
        ['<code>force-cache</code>', 'store, reuse across requests', 'data that changes on deploy'],
        ['<code>no-store</code>', 'fetch every time; route becomes ƒ', 'per-user, live data'],
        ['<code>next.revalidate: N</code>', 'reuse, refresh after N s', 'mostly static (10.3)'],
        ['(nothing)', '<b>depends on your version</b>', '— avoid'],
      ], { hl: [3] }), '') +
    box('This project does exactly that', 'cuongthai.com\'s frontend runs <b>Next.js 14.2.35</b> (where the default caches) and every server <code>fetch</code> in <code>app/courses</code>, <code>app/blog</code>, <code>app/download</code>… states <code>next: { revalidate: … }</code> or <code>cache: \'no-store\'</code> explicitly. Upgrading to 15+ will not silently change them.', 'lam'),
    en: 'So never rely on the default — say it. force-cache stores and reuses across requests; no-store fetches every time and makes the route dynamic; next revalidate reuses, then refreshes after N seconds. Nothing at all means it depends on your version. This project\'s own frontend runs Next fourteen and states the option on every server fetch, so an upgrade will not silently change them.' },
  { t: 'Measured on 16.4.6: three options, request by request', body: two(D(tsx(goc(F('src/app/tc/force/page.tsx')).split('\n').filter((l) => !l.startsWith('//')).slice(2, 6).join('\n').replace("'http://127.0.0.1:19385/gia?tc=force'", 'url').replace('fetch(url, {', 'fetch(url,\n    {'), { sm: true, hl: [3, 4] }),
      tsx(goc(F('src/app/tc/no-store/page.tsx')).split('\n').filter((l) => !l.startsWith('//')).slice(0, 3).join('\n').replace("'http://127.0.0.1:19385/gia?tc=no-store'", 'url').replace('fetch(url, {', 'fetch(url,\n    {'), { sm: true, hl: [2, 3] }),
      tn(BUILD.filter((l) => /tinh|tc/.test(l)).join('\n'), { fs: 15, title: 'npm run build (real)' })),
    D(cmp(['Page', 'req 1', 'req 2*', 'req 3*', 'API hits'], [
      ['<code>/gia-tinh</code> bare, static', TINH[0], TINH[1], TINH[2], `${HT['/gia?trang=tinh']} (build)`],
      ['<code>/tc/force</code>', FORCE[0], FORCE[1], FORCE[2], `${HT['/gia?tc=force']}`],
      ['<code>/tc/no-store</code>', NOS[0], NOS[1], NOS[2], `${HT['/gia?tc=no-store']}`],
    ], { hl: [1] }), '<div class="cap">* the source changed to 300 after request 1 · Next.js 14.2.35: identical numbers</div>',
      box('Read the table', '<code>force-cache</code>: one call, then the stored answer — even after the source changed. <code>no-store</code>: every request asks the source, and it made the route <b>ƒ</b> on its own.', 'lam')), ''),
    en: 'Measured on sixteen point four point six: three pages, the price is two hundred fifty for the first request, then the source changes to three hundred. force-cache: one call, then the stored answer — still two fifty. no-store: three calls, three hundred — and it made the route dynamic on its own. The static page with no options stayed at one hundred, the value from build time.' },
  { t: '"Not cached by default" ≠ "always fresh"', body: two(D(tsx(goc(F('src/app/gia-tinh/page.tsx')).split('\n').filter((l) => !l.startsWith('//')).join('\n'), { sm: true, hl: [2] }),
      tn(`$ (build) API hit during npm run build: ${HT['/gia?trang=tinh']}\n$ cat .next/cache/fetch-cache/…\n${FC}\n$ curl -D - localhost:3000/gia-tinh\n${HDR.join('\n')}`, { fs: 15, title: 'build + cache files + headers (real)' })),
    D(box('Where the answer now lives', '<ul><li><b>Full Route Cache</b>: the HTML, made at build — <code>x-nextjs-cache: HIT</code></li><li><b>Data Cache</b>: the fetch result, <code>revalidate</code> 1 year</li><li><b>The API</b>: asked once — by the build</li></ul>', 'lam'), box('What "15+ does not cache" really means', '<b>Dynamic</b> page: a bare fetch runs every time. <b>Static</b> page: it runs at build and is frozen into the page — until you redeploy or revalidate (10.3).', 'do2')), ''),
    en: 'Not cached by default does not mean always fresh. This static page has a bare fetch. The API was called once, during the build. The fetch result sits in the Data Cache folder with revalidate thirty-one million five hundred thirty-six thousand seconds — one year — and the HTML is served with x-nextjs-cache HIT. In a dynamic page a bare fetch runs every time; in a static page it is frozen at build time until you redeploy or revalidate.' },
  { t: 'Request memoization vs the Data Cache', body: cmp(['', 'Request memoization', 'Data Cache'], [
      ['Lives', 'during <b>one</b> render (one request)', 'on the server, across requests and deploys'],
      ['Turned on by', 'automatic for identical <code>fetch</code> GETs', '<code>force-cache</code> / <code>revalidate</code> (or a static page)'],
      ['Turned off by', 'cannot be turned off', '<code>no-store</code>, revalidating'],
      ['Measured', '10.1: layout + 2 cards ⇒ 1 call per request (2 requests ⇒ 2)', `force-cache: 3 requests ⇒ ${HT['/gia?tc=force']} call`],
      ['Not covered', '<code>axios</code>, Prisma ⇒ React <code>cache()</code>', 'same — use <code>unstable_cache</code> / tags (10.3)'],
    ], { hl: [3] }) + box('Why it matters', 'Memoization lets every component fetch what it needs without prop drilling — it saves calls <i>inside</i> one request. It never makes data stale. The Data Cache is the one that can serve yesterday\'s price.', 'lam'),
    en: 'Request memoization versus the Data Cache. Memoization lives for one render: identical fetch GETs inside one request become one call — in lesson ten point one, two requests gave two calls. The Data Cache lives on the server across requests: force-cache gave one call for three requests. Memoization never makes data stale; the Data Cache is the one that can serve yesterday\'s price.' },
  { t: 'The four caches, from the user outwards', body: tiers([
      ['eye', '4 · Router Cache (browser)', 'RSC payloads of pages you visited, per tab — Back/Forward reuse them'],
      ['layers', '3 · Full Route Cache (server)', 'HTML + RSC of static routes, made at build — x-nextjs-cache: HIT'],
      ['db', '2 · Data Cache (server)', 'stored fetch results — force-cache, revalidate, static pages'],
      ['clock', '1 · Request memoization (server)', 'identical fetches inside one render — automatic'],
    ]) + box('Debugging rule', 'When the screen shows an old value, ask <b>which layer</b> holds the copy — then clear <i>that</i> one. The next slide catches layer 4 in the act.', 'lam'),
    en: 'The four caches, from the user outwards. Four: the Router Cache in the browser holds the payloads of pages you visited, and Back and Forward reuse them. Three: the Full Route Cache, HTML of static routes made at build. Two: the Data Cache, stored fetch results. One: request memoization inside one render. When the screen shows an old value, ask which layer holds the copy.' },
  { t: 'Measured in Chromium: the Router Cache on Back', body: two(D(cmp(['Step', 'Source price', 'Screen'], [
      ['open <code>/rc/a</code> (dynamic)', '100', RC['1-mo'].replace('trang A · ', '')],
      ['→ B · source 250 · <b>Link</b> to A', '250', RC['2-link'].split(' · ').pop()],
      ['→ B · source 300 · <b>Back</b>', '300', `<b style="color:#b91c1c">${RC['3-back'].split(' · ').pop()}</b>`],
      ['reload (F5)', '300', RC['5-f5'].replace('trang A · ', '')],
    ], { hl: [2] }), box('API hits', `Link ⇒ the server rendered A again (a dynamic page is not reused on Link in 15+). Back ⇒ <b>no request</b>: the browser showed its stored copy. Total: ${JSON.parse(RC['6-dem'])['/gia?rc=a']} calls for 4 visits.`, 'lam')),
    D(B('rc-back', { vp: 640, h: 110, w: 480, url: 'after Back — source says 300' }), B('rc-f5', { vp: 640, h: 110, w: 480, url: 'after reload (F5)' })), ''),
    en: 'Measured in Chromium: the Router Cache. Open page A: one hundred. Go to B, change the source to two fifty, click the Link back to A: two fifty — the server rendered it again. Go to B, change the source to three hundred, press the browser Back button: still two fifty, and no request reached the server — the browser reused its stored copy. Reload: three hundred.' },
  { t: 'Pitfall: correct on the server, stale on the screen', body: two(steps([
      'You update a record. You call <code>revalidatePath(\'/list\')</code> — the <b>server</b> caches are cleared',
      'The screen still shows the old row: the <b>Router Cache</b> in the browser kept the old payload',
      'People go look at the database — which is correct',
      'Fix: mutate in a <b>Server Action</b> — its <code>revalidatePath</code> also refreshes the client. From a Client Component: <code>router.refresh()</code> (Chapter 12)',
    ]), D(B('rc-back', { vp: 640, h: 110, w: 520, url: 'Back: the old copy (source = 300)' }),
      box('Know the layer before you blame the DB', 'Server right, screen wrong ⇒ layer 4. Both wrong ⇒ layer 2/3 (10.3, 10.5).', 'do2')), ''),
    en: 'The pitfall: correct on the server, stale on the screen. You update a record and call revalidatePath — the server caches are cleared — but the screen still shows the old row, because the browser Router Cache kept the old payload. People go look at the database, which is correct. The fix: mutate in a Server Action, whose revalidatePath also refreshes the client, or call router refresh from a Client Component — chapter twelve.' },
  { t: 'Cheat sheet — measured on both versions', body: cmp(['You wrote', 'Next.js 14.2.35', 'Next.js 16.4.6'], [
      ['<code>fetch(url)</code> in a dynamic page', `<b>cached</b> — ${H14} call / 3 requests`, `<b>not cached</b> — ${H16} calls / 3 requests`],
      ['<code>fetch(url)</code> in a static page', `baked at build (${H14b['/gia?trang=tinh14']} call, at build)`, `baked at build (${HT['/gia?trang=tinh']} call, revalidate 1 year)`],
      ['<code>{ cache: \'force-cache\' }</code>', `cached — ${H14b['/gia?tc=force14']} call / 3`, `cached — ${HT['/gia?tc=force']} call / 3`],
      ['<code>{ cache: \'no-store\' }</code>', `fresh — ${H14b['/gia?tc=no-store14']} calls / 3, route ƒ`, `fresh — ${HT['/gia?tc=no-store']} calls / 3, route ƒ`],
    ], { hl: [0] }) + box('Only one row changed between versions', 'The first row. That is the whole "version trap" — and stating <code>cache</code> / <code>revalidate</code> on every fetch makes it disappear. Memoization (10.1) and <code>revalidate: N</code> (10.3) are the same idea on both.', 'lam'),
    en: 'The cheat sheet, measured on both versions. A bare fetch in a dynamic page: cached on fourteen — one call for three requests — and not cached on sixteen — three calls. In a static page: baked at build on both. force-cache: one call for three requests on both. no-store: three calls and a dynamic route on both. Only the first row changed — state the option on every fetch and the version trap disappears.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Data Cache', 'stored fetch results on the server, across requests'), kw('Request memoization', 'identical fetches in one render become one call'),
      kw('Full Route Cache', 'HTML + RSC of static routes, made at build'), kw('Router Cache', 'the browser\'s copies of visited pages (Back/Forward)'),
      kw('force-cache', 'opt in: store and reuse'), kw('no-store', 'opt out: fetch every time, route dynamic'),
      kw('Version-dependent default', '14 caches a bare fetch, 15+ does not'), kw('x-nextjs-cache', 'response header: HIT / MISS / STALE'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Data Cache; request memoization; Full Route Cache; Router Cache; force-cache; no-store; the version-dependent default; and the x-nextjs-cache header.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Check your version: ${c('npx next --version')}. Find every bare ${c('fetch(url)')} in a Server Component`,
      `Build a dynamic page with a bare fetch; change the source between two requests — did it change?`,
      `Add ${c("cache: 'force-cache'")}, then ${c("cache: 'no-store'")}: count API hits; read the ○/ƒ table`,
      `Visit A → B, change the source, press Back: which value? Then reload`,
    ]), box('Keep these', `<ul><li>The bare-fetch default flipped (14 → 15)</li><li>Always state the option</li><li>Static page ⇒ the fetch is baked at build</li><li>Memoization: one request · Data Cache: all</li><li>Old value? Find the layer first</li></ul>`, 'lam'), ''),
    en: 'Your turn: check your version and find every bare fetch in your Server Components; build a dynamic page with a bare fetch and change the source between two requests; add force-cache, then no-store, and count API hits; then visit A, go to B, change the source and press Back. Keep: the bare-fetch default flipped, so always state the option; a static page bakes its fetch at build; memoization is one request, the Data Cache is all of them; and for an old value, find the layer first.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Data fetching, caching and revalidating', bai: '10.2' }, S);
