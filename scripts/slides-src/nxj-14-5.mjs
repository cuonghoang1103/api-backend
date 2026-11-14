/*DU_LIEU*/
const DU_LIEU = {
 "n14-5:file:src/app/loc/sp/page.tsx": "'use client';\n// app/loc/sp/page.tsx — đọc bộ lọc bằng useSearchParams, KHÔNG bọc Suspense\nimport { useSearchParams } from 'next/navigation';\n\nexport default function Trang() {\n  const loai = useSearchParams().get('loai') ?? 'tat-ca';\n  return <p className=\"p-4\">Bộ lọc: {loai}</p>;\n}\n",
 "n14-5:sp": "$ npm run build 2>&1 | grep -E 'Compiled|useSearchParams|suspense|Error occurred|Export encountered' | head -5\n✓ Compiled successfully in 4.7s\n⨯ useSearchParams() should be wrapped in a suspense boundary at page \"/loc/sp\". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout\nError occurred prerendering page \"/loc/sp\". Read more: https://nextjs.org/docs/messages/prerender-error\nExport encountered an error on /loc/sp/page: /loc/sp, exiting the build.",
 "n14-5:file:src/app/loc/du-lieu.ts": "// app/loc/du-lieu.ts — dữ liệu tĩnh cho ba trang bộ lọc\nexport const BAI = [\n  { t: 'Học Next.js', loai: 'next' }, { t: 'App Router', loai: 'next' }, { t: 'Server Component', loai: 'next' },\n  { t: 'revalidate', loai: 'cache' }, { t: 'staleTime', loai: 'cache' },\n];\nexport const LOAI = ['tat-ca', 'next', 'cache'] as const;\nexport const loc = (l: string) => BAI.filter((b) => l === 'tat-ca' || b.loai === l);\n",
 "n14-5:file:src/app/loc/state/page.tsx": "'use client';\n// app/loc/state/page.tsx — bộ lọc trong useState\nimport { useState } from 'react';\nimport { LOAI, loc } from '../du-lieu';\n\nexport default function Trang() {\n  const [loai, setLoai] = useState('tat-ca');\n  return (\n    <main className=\"p-4 text-lg\">\n      {LOAI.map((l) => <button key={l} id={`b-${l}`} onClick={() => setLoai(l)} className={`mr-2 rounded border px-2 ${l === loai ? 'bg-black text-white' : ''}`}>{l}</button>)}\n      <p id=\"tt\">Bộ lọc: {loai} · {loc(loai).length} bài</p>\n    </main>\n  );\n}\n",
 "n14-5:file:src/app/loc/url/page.tsx": "// app/loc/url/page.tsx — bộ lọc trong URL: Server Component đọc searchParams, <Link> đổi URL\nimport Link from 'next/link';\nimport { LOAI, loc } from '../du-lieu';\n\nexport default async function Trang({ searchParams }: PageProps<'/loc/url'>) {\n  const q = await searchParams;\n  const loai = typeof q.loai === 'string' ? q.loai : 'tat-ca';\n  return (\n    <main className=\"p-4 text-lg\">\n      {LOAI.map((l) => <Link key={l} id={`b-${l}`} href={`?loai=${l}`} className={`mr-2 rounded border px-2 ${l === loai ? 'bg-black text-white' : ''}`}>{l}</Link>)}\n      <p id=\"tt\">Bộ lọc: {loai} · {loc(loai).length} bài</p>\n    </main>\n  );\n}\n",
 "n14-5:file:src/app/loc/thay/page.tsx": "'use client';\n// app/loc/thay/page.tsx — CHÉP khuôn frontend/src/app/feed/page.tsx:75-87: useState khởi tạo từ window.location + history.replaceState\nimport { useState } from 'react';\nimport { LOAI, loc } from '../du-lieu';\n\nexport default function Trang() {\n  const [loai, setLoai] = useState(() =>\n    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('loai') ?? 'tat-ca' : 'tat-ca',\n  );\n  const doi = (l: string) => {\n    setLoai(l);\n    const url = new URL(window.location.href);\n    url.searchParams.set('loai', l);\n    window.history.replaceState({}, '', url.toString());\n  };\n  return (\n    <main className=\"p-4 text-lg\">\n      {LOAI.map((l) => <button key={l} id={`b-${l}`} onClick={() => doi(l)} className={`mr-2 rounded border px-2 ${l === loai ? 'bg-black text-white' : ''}`}>{l}</button>)}\n      <p id=\"tt\">Bộ lọc: {loai} · {loc(loai).length} bài</p>\n    </main>\n  );\n}\n",
 "n14-5:file:src/app/go/len/page.tsx": "'use client';\n// app/go/len/page.tsx — state của ô gõ ĐẨY LÊN trang ⇒ danh sách cạnh nó render lại theo từng phím\nimport { useState } from 'react';\n\nfunction DanhSach() { console.log('render DanhSach'); return <ul>{Array.from({ length: 3 }, (_, i) => <li key={i}>dòng {i + 1}</li>)}</ul>; }\nfunction O({ v, doi }: { v: string; doi: (s: string) => void }) { return <input id=\"o\" value={v} onChange={(e) => doi(e.target.value)} className=\"border px-2\" />; }\n\nexport default function Trang() {\n  const [v, setV] = useState('');\n  return <main className=\"p-4 text-lg\"><O v={v} doi={setV} /><DanhSach /></main>;\n}\n",
 "n14-5:file:src/app/go/cuc-bo/page.tsx": "'use client';\n// app/go/cuc-bo/page.tsx — state nằm NGAY trong ô gõ (cục bộ)\nimport { useState } from 'react';\n\nfunction DanhSach() { console.log('render DanhSach'); return <ul>{Array.from({ length: 3 }, (_, i) => <li key={i}>dòng {i + 1}</li>)}</ul>; }\nfunction O() { const [v, setV] = useState(''); return <input id=\"o\" value={v} onChange={(e) => setV(e.target.value)} className=\"border px-2\" />; }\n\nexport default function Trang() {\n  return <main className=\"p-4 text-lg\"><O /><DanhSach /></main>;\n}\n",
 "n14-5:loc": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/loc/|/go/'\n✓ Compiled successfully in 3.5s\n├ ○ /go/cuc-bo\n├ ○ /go/len\n├ ○ /loc/state\n├ ○ /loc/thay\n└ ƒ /loc/url\n$ Chromium: chọn \"cache\" · F5 · nút Back · mở đúng URL đó trong một trình duyệt khác\n/loc/state\n    1 chọn cache           /loc/state · Bộ lọc: cache · 2 bài\n    2 F5                   /loc/state · Bộ lọc: tat-ca · 5 bài\n    3 Back                 /loc/url?tu=truoc · Bộ lọc: tat-ca · 5 bài\n/loc/url\n    1 chọn cache           /loc/url?loai=cache · Bộ lọc: cache · 2 bài\n    2 F5                   /loc/url?loai=cache · Bộ lọc: cache · 2 bài\n    3 Back                 /loc/url · Bộ lọc: tat-ca · 5 bài\n/loc/thay\n    1 chọn cache           /loc/thay?loai=cache · Bộ lọc: cache · 2 bài\n    2 F5                   /loc/thay?loai=cache · Bộ lọc: cache · 2 bài\n    3 Back                 /loc/url?tu=truoc · Bộ lọc: tat-ca · 5 bài\n$ Chromium: mở thẳng /loc/thay?loai=cache (link được chia sẻ) — console\nmàn hình: /loc/thay?loai=cache · Bộ lọc: cache · 2 bài\n1 lỗi console\n   Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]= for the full message or use the non-minified dev environment for full errors and additio\n$ curl -s '127.0.0.1:19398/loc/thay?loai=cache' | grep -oE 'id=\"tt\">[^/]*' | sed -E 's/<!-- -->//g; s/id=\"tt\">//; s/<$//' | sed 's/^/HTML máy chủ: /'\nHTML máy chủ: Bộ lọc: tat-ca · 5 bài\n$ Chromium: gõ 5 phím vào ô — đếm \"render DanhSach\"\n/go/len     · render DanhSach: 6 lần (1 lần đầu + theo phím)\n/go/cuc-bo  · render DanhSach: 1 lần (1 lần đầu + theo phím)",
 "n14-5:kho": "$ for p in \"useState\" \"createContext\" \"from 'zustand'\" \"@tanstack/react-query\" \"useSearchParams\"; do printf '%-24s %s tệp\\n' \"$p\" \"$(grep -rl \"$p\" src | wc -l | tr -d ' ')\"; done\nuseState                 1139 tệp\ncreateContext            12 tệp\nfrom 'zustand'           32 tệp\n@tanstack/react-query    323 tệp\nuseSearchParams          118 tệp\n$ sed -n '75,87p' src/app/feed/page.tsx\n  const [feedFilter, setFeedFilter] = useState<FeedFilter>(() =>\n    typeof window !== 'undefined' ? parseFeedFilterFromUrl(window.location.search) : 'all',\n  );\n  const onFeedFilterChange = useCallback((next: FeedFilter) => {\n    setFeedFilter(next);\n    // Sync URL. `all` strips the param so the URL stays clean.\n    const url = new URL(window.location.href);\n    if (next === 'all') url.searchParams.delete(FEED_FILTER_URL_PARAM);\n    else url.searchParams.set(FEED_FILTER_URL_PARAM, next);\n    window.history.replaceState({}, '', url.toString());\n    // Reset feed pagination so the user sees a fresh list per tab.\n    useSocialStore.setState({ posts: [], cursor: null, hasNextPage: true });\n  }, []);",
 "anh-nxj-14-5:state-chon": {
  "url": "http://127.0.0.1:19398/loc/state",
  "vp": [
   560,
   140
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-5:state": {
  "url": "http://127.0.0.1:19398/loc/url?tu=truoc",
  "vp": [
   560,
   140
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "1 chọn cache": "/loc/state · Bộ lọc: cache · 2 bài",
   "2 F5": "/loc/state · Bộ lọc: tat-ca · 5 bài",
   "3 Back": "/loc/url?tu=truoc · Bộ lọc: tat-ca · 5 bài"
  }
 },
 "anh-nxj-14-5:url-chon": {
  "url": "http://127.0.0.1:19398/loc/url?loai=cache",
  "vp": [
   560,
   140
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-5:url": {
  "url": "http://127.0.0.1:19398/loc/url?tu=truoc",
  "vp": [
   560,
   140
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "1 chọn cache": "/loc/url?loai=cache · Bộ lọc: cache · 2 bài",
   "2 F5": "/loc/url?loai=cache · Bộ lọc: cache · 2 bài",
   "3 Back": "/loc/url · Bộ lọc: tat-ca · 5 bài"
  }
 },
 "anh-nxj-14-5:thay-chon": {
  "url": "http://127.0.0.1:19398/loc/thay?loai=cache",
  "vp": [
   560,
   140
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-5:thay": {
  "url": "http://127.0.0.1:19398/loc/url?tu=truoc",
  "vp": [
   560,
   140
  ],
  "rect": {},
  "console": [
   {
    "kieu": "pageerror",
    "chu": "Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ],
  "ketQua": {
   "1 chọn cache": "/loc/thay?loai=cache · Bộ lọc: cache · 2 bài",
   "2 F5": "/loc/thay?loai=cache · Bộ lọc: cache · 2 bài",
   "3 Back": "/loc/url?tu=truoc · Bộ lọc: tat-ca · 5 bài"
  }
 },
 "anh-nxj-14-5:thay-mo": {
  "url": "http://127.0.0.1:19398/loc/thay?loai=cache",
  "vp": [
   560,
   140
  ],
  "rect": {},
  "console": [
   {
    "kieu": "pageerror",
    "chu": "Minified React error #418; visit https://react.dev/errors/418?args[]=text&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ],
  "ketQua": {
   "tt": "/loc/thay?loai=cache · Bộ lọc: cache · 2 bài"
  }
 },
 "anh-nxj-14-5:go-len": {
  "url": "http://127.0.0.1:19398/go/len",
  "vp": [
   520,
   160
  ],
  "rect": {},
  "console": [
   {
    "kieu": "log",
    "chu": "render DanhSach"
   },
   {
    "kieu": "log",
    "chu": "render DanhSach"
   },
   {
    "kieu": "log",
    "chu": "render DanhSach"
   },
   {
    "kieu": "log",
    "chu": "render DanhSach"
   },
   {
    "kieu": "log",
    "chu": "render DanhSach"
   },
   {
    "kieu": "log",
    "chu": "render DanhSach"
   }
  ]
 },
 "anh-nxj-14-5:go-cuc-bo": {
  "url": "http://127.0.0.1:19398/go/cuc-bo",
  "vp": [
   520,
   160
  ],
  "rect": {},
  "console": [
   {
    "kieu": "log",
    "chu": "render DanhSach"
   }
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-14-5', code: 'NXJ 14.5', title: 'Choosing the right tool for each piece of state', sub: 'Chapter 14 · Lesson 14.5' };
const O = (k) => { const v = DU_LIEU[`n14-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-14-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-14-5', ten, { vp: 560, ...o });
const en = (s) => String(s).replace('Bộ lọc', 'filter').replace(/ bài/g, ' posts');

// ── số đo (n14-5 · Next.js 16.4.6 · React 19.3.0 · Chromium)
const SP = doan('sp', 'npm run build'), ROUTES = doan('loc', 'npm run build'), GO = doan('loc', 'gõ 5 phím');
const HY = doan('loc', 'mở thẳng'), HTML = doan('loc', "curl -s '127.0.0.1:19398/loc/thay");
const KQ = (k) => A(k).ketQua;
const KHO = O('kho');
const nGo = (k) => Number(GO.find((l) => l.includes(k)).match(/: (\d+) lần/)[1]);
if (!/useSearchParams\(\) should be wrapped in a suspense boundary/.test(SP.join('\n'))) throw new Error('sp đổi');
if (!/tat-ca/.test(KQ('state')['2 F5']) || !/loai=cache · Bộ lọc: cache/.test(KQ('url')['2 F5']) || !/^\/loc\/url · Bộ lọc: tat-ca/.test(KQ('url')['3 Back']) || !/loai=cache · Bộ lọc: cache/.test(KQ('thay')['2 F5']) || !/tu=truoc/.test(KQ('thay')['3 Back'])) throw new Error('lọc đổi');
if (!/1 lỗi console/.test(HY.join()) || !/#418/.test(HY.join()) || !/tat-ca/.test(HTML[0])) throw new Error('hydrate đổi');
if (nGo('len') !== 6 || nGo('cuc-bo') !== 1) throw new Error('gõ đổi');

const fnOf = (p, ten) => { const L = bo(F(p)).split('\n'); return L.filter((l) => l.includes(`function ${ten}`)).join('\n'); };
const URLP = bo(F('src/app/loc/url/page.tsx')).split('\n').filter((l) => /searchParams|const loai|href=\{`\?loai/.test(l)).map((l) => l.trim().replace(/ className=\{[^}]*\}\}/, '').replace(/\{LOAI\.map\(\(l\) => /, '').replace(/\)\}$/, '')).join('\n');
const THAY = bo(F('src/app/loc/thay/page.tsx')).split('\n'); const THAY2 = THAY.slice(THAY.findIndex((l) => l.includes('useState(() =>')), THAY.findIndex((l) => l.includes('replaceState')) + 2).join('\n').replace(/^ {2}/gm, '').replace("typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('loai') ?? 'tat-ca' : 'tat-ca',", "typeof window !== 'undefined'\n    ? new URLSearchParams(window.location.search).get('loai') ?? 'tat-ca'\n    : 'tat-ca',");
const LEN = `function DanhSach() {
  console.log('render DanhSach');
  return <ul>{/* 3 rows */}</ul>;
}
export default function Trang() {        // state LIFTED to the page
  const [v, setV] = useState('');
  return <main><O v={v} doi={setV} /><DanhSach /></main>;
}`;
const CUCBO = `function O() {                           // state LOCAL to the input
  const [v, setV] = useState('');
  return <input value={v} onChange={(e) => setV(e.target.value)} />;
}
export default function Trang() {
  return <main><O /><DanhSach /></main>;
}`;
if (!F('src/app/go/len/page.tsx').includes("<O v={v} doi={setV} /><DanhSach />") || !F('src/app/go/cuc-bo/page.tsx').includes('<O /><DanhSach />')) throw new Error('mã gõ đổi');
const URLC = `export default async function Trang(
  { searchParams }: PageProps<'/loc/url'>,
) {
  const q = await searchParams;
  const loai = typeof q.loai === 'string' ? q.loai : 'tat-ca';
  // …
  <Link href={\`?loai=\${l}\`}>{l}</Link>   // a NEW history entry
}`;
if (!F('src/app/loc/url/page.tsx').includes('href={`?loai=${l}`}')) throw new Error('mã url đổi');
const tl = (k) => Object.entries(KQ(k)).map(([m, v]) => [m.replace(/^\d /, '').replace('chọn cache', 'pick "cache"'), en(v)]);

export const S = [
  { cover: true, nhan: 'Chapter 14 · Lesson 14.5', t: 'Choosing the right tool<br>for each piece of state', sub: 'Local first, measured in renders; the URL as state, measured with F5, Back and a shared link — and what cuongthai.com does with each kind',
    en: 'Lesson fourteen point five: choosing the right tool for each piece of state. Local first, measured in renders; the URL as state, measured with F5, Back and a shared link; and what cuongthai.com does with each kind.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A decision table: what the state is ⇒ which tool</li>
    <li>Keep state local: lifting it cost ${nGo('len') - 1} extra renders for 5 keystrokes</li>
    <li>The URL as state: F5, Back and a shared link, measured three ways</li>
    <li><code>useSearchParams</code> stops the build without a Suspense boundary</li>
    <li>cuongthai.com, piece by piece — and two rules</li></ul>`,
    en: 'Five takeaways: a decision table; keep state local, measured in renders; the URL as state, measured with F5, Back and a shared link; useSearchParams and the build; and cuongthai.com piece by piece, with two rules.' },
  { t: 'A decision guide you can apply on every screen', body: cmp(['The state is…', 'Tool', 'Lesson'], [
      ['used by one component', '<b>useState</b>, right there', '—'],
      ['shared by two siblings', 'lift to the parent', '—'],
      ['a filter, tab, page number', '<b>the URL</b> (search params)', '14.5'],
      ['the page\'s initial data', '<b>Server Component</b>', '10.1'],
      ['server data that changes while you watch', '<b>TanStack Query</b>', '14.3–14.4'],
      ['client UI shared far apart, changing often', '<b>Zustand</b> (with selectors)', '14.2'],
      ['app-wide, slow: theme, language', '<b>Context</b>', '6'],
    ]) + box('Start at the top and stop as soon as it works', 'Each step down is a cost for the next reader, not a promotion.', 'xanh'),
    en: 'A decision guide. Used by one component: useState right there. Shared by siblings: lift it. A filter or a page: the URL. Initial page data: a Server Component. Server data that changes while you watch: TanStack Query. Client UI shared far apart: Zustand. Slow app-wide values: Context. Start at the top and stop as soon as it works.' },
  { t: 'Keep state local — measured in renders', body: two(D(tsx(LEN, { sm: true, hl: [6, 7] }), tsx(CUCBO, { sm: true, hl: [2] })),
    D(tn(['# Chromium · type "hello" (5 keys) · count "render DanhSach"', ...GO.map((l) => l.replace('lần (1 lần đầu + theo phím)', '(1 first + per key)'))].join('\n'), { fs: 14, wrap: 50, title: 'Chromium (real)' }),
      B('go-len', { url: 'localhost:3000/go/len · after typing', h: 110, w: 420 }),
      box('Read it', `Lifted to the page, the input\'s state re-renders its sibling on every key: <b>${nGo('len')}</b> renders. Kept inside the input: <b>${nGo('cuc-bo')}</b>. Lift only when a real second consumer appears.`, 'xanh')), ''),
    en: 'Keep state local. Lift an input\'s state to the page, and its sibling list re-renders on every key: six renders for five keystrokes. Keep it inside the input: one. Lift state only when a real second consumer appears.' },
  { t: 'The URL as state: F5, Back, and a shared link', body: two(D(tsx(URLC, { sm: true, hl: [4, 5, 7] }), B('url-chon', { url: 'localhost:3000/loc/url?loai=cache', h: 90, w: 470 })),
    D(cmp(['After…', 'useState', 'the URL (Link)'], tl('state').map(([m, v], i) => [m, v, tl('url')[i][1]])),
      box('Measured', '<code>useState</code>: lost on F5, nothing to share. The URL: survives F5, Back undoes the filter, the link reproduces the view.', 'xanh')), ''),
    en: 'The URL as state. A filter in useState dies on F5, and nobody can be sent the filtered view. In the URL, it survives F5, the Back button returns to the previous filter, and the link reproduces the view anywhere. The page reads searchParams on the server.' },
  { t: 'Half-way: useState + replaceState (the cuongthai.com feed pattern)', body: two(D(tsx(THAY2, { sm: true, hl: [1, 3, 10] }), tn(['# Chromium', ...tl('thay').map(([m, v]) => `${m.padEnd(13)} ${v}`), '# open /loc/thay?loai=cache directly (a shared link)', ...HY.map((l) => en(l.replace('màn hình', 'screen').replace('lỗi console', 'console error')).slice(0, 120)), HTML[0].replace('HTML máy chủ', 'server HTML').replace('Bộ lọc', 'filter').replace(' bài', ' posts')].join('\n'), { fs: 11, wrap: 64, title: 'Chromium + curl (real)' })),
    D(box('Measured', 'F5 keeps it. <b>Back</b> skips every filter and leaves the page (<code>replaceState</code>). A shared link: the server HTML says <code>tat-ca</code>, the first client render <code>cache</code> ⇒ React error <b>#418</b>.', 'do2'),
      box('Fix', 'Read the filter from <code>searchParams</code> (server) or <code>useSearchParams</code> inside Suspense, and change it with <code>router.push</code>/<code>&lt;Link&gt;</code>.', 'xanh')), ''),
    en: 'The half-way pattern: useState initialised from window dot location, kept in sync with replaceState. F5 keeps it; but Back skips every filter and leaves the page; and a shared link causes a hydration error, React error four eighteen, because the server rendered the default. Read the filter from search params and change it with a Link or router dot push.' },
  { t: 'useSearchParams needs a Suspense boundary', body: two(D(tsx(bo(F('src/app/loc/sp/page.tsx')).replace("'use client';\n", '').replace(/^\/\/ .*\n/m, ''), { sm: true }), tn(['$ npm run build', ...SP].join('\n'), { fs: 13, wrap: 60, title: 'next build (real)' })),
    D(box('Read it', 'A static page cannot know the query string at build time. A client component that reads it with <code>useSearchParams</code> must sit inside <code>&lt;Suspense&gt;</code>, so the build can prerender the rest and the part that needs the URL renders in the browser.', 'do2'),
      box('Two fixes', '<b>1</b> wrap it: <code>&lt;Suspense&gt;&lt;Filter /&gt;&lt;/Suspense&gt;</code> · <b>2</b> read <code>searchParams</code> in the Server Component page — the route becomes dynamic: ' + ROUTES.find((l) => /\/loc\/url/.test(l)).trim() + '.', 'xanh')), ''),
    en: 'useSearchParams needs a Suspense boundary. Without one, next build stops: a static page cannot know the query string. Wrap the client part in Suspense, or read searchParams in the Server Component page, which makes the route dynamic.' },
  { t: 'cuongthai.com, piece by piece', body: two(D(tn(KHO.split('\n').slice(0, 6).join('\n').replace(/tệp/g, 'files'), { fs: 14, wrap: 50, title: 'frontend/src (real)' })),
    D(cmp(['Kind of state', 'What it uses'], [
        ['initial page content', 'Server Components'], ['server data on the client', 'TanStack Query (323 files)'], ['auth', 'Zustand + persist (<code>auth-storage</code>)'],
        ['theme, language', 'Context (2 providers)'], ['feed tab / filter', 'useState + <code>replaceState</code>'], ['feed posts', 'a Zustand store (<code>useSocialStore</code>)'],
      ]), box('Read it', 'Four tools, matched to most kinds. Two places break this lesson\'s rules: posts (server data) in a client store, and a filter half in the URL (previous slide).', 'lam')), ''),
    en: 'cuongthai.com, piece by piece: Server Components for initial content; TanStack Query in three hundred twenty-three files; auth in a persisted Zustand store; theme and language in Context; the feed filter in useState mirrored with replaceState; and feed posts, which are server data, in a Zustand store.' },
  { t: 'Two rules that prevent most messes', body: icards([
      ['db', '1 · Server data is a cache', 'Give it a cache tool — a Server Component or TanStack Query — never a client store or Context as if it were UI state (14.1).'],
      ['box', '2 · As local as it can be', 'Lift only when a second consumer appears. Global-by-default is how apps become impossible to reason about.'],
      ['link', 'Shareable ⇒ the URL', 'If a user would send it, bookmark it or expect Back to undo it, it belongs in the query string.'],
      ['check', 'One line per feature', 'Write which tool holds each piece, and why — before the code.'],
    ], 2),
    en: 'Two rules that prevent most messes: server data is a cache, so give it a cache tool, never a client store; and keep state as local as it can be. Plus: if a user would share it, bookmark it, or expect Back to undo it, it belongs in the URL.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Local state', 'one component owns it'), kw('Lifting state', 'move it to the parent'), kw('URL state', 'search params'), kw('searchParams', 'read on the server ⇒ ƒ'),
      kw('useSearchParams', 'needs Suspense'), kw('replaceState', 'rewrites history — Back skips'), kw('Hydration mismatch', 'server HTML ≠ first client render'), kw('Decision guide', 'kind of state ⇒ tool'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: local state; lifting state; URL state; searchParams; useSearchParams; replaceState; hydration mismatch; and the decision guide.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `List every piece of state on one page; write the tool next to each`,
      `Lift an input's state; count renders; move it back`,
      `Move a filter into the URL; test F5, Back and a copied link`,
      `Read it with ${c('useSearchParams')}; build; add ${c('<Suspense>')}`,
    ]), box('Keep these', `<ul><li>Smallest tool that fits</li><li>Server data ⇒ a cache tool</li><li>Shareable ⇒ the URL</li><li>push, not replace, for filters</li><li>useSearchParams ⇒ Suspense</li></ul>`, 'lam'), ''),
    en: 'Your turn: label every piece of state on a page with its tool; lift an input\'s state and count renders; move a filter into the URL and test F5, Back and a copied link; then read it with useSearchParams and add Suspense. Keep: the smallest tool that fits.' },
];
export const slides = lamDeck({ chuong: 'Chapter 14 — State management: client and server state', bai: '14.5' }, S);
