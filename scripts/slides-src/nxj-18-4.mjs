/*DU_LIEU*/
const DU_LIEU = {
 "n18-4:file:src/app/font/latin/page.tsx": "// app/font/latin/page.tsx — next/font/google, subsets: ['latin'] only, Vietnamese text\nimport { Inter } from 'next/font/google';\nconst inter = Inter({ subsets: ['latin'] });\nexport default function Page() {\n  return <main className={inter.className} style={{ padding: 16, fontSize: 28 }}><h1>Học Next.js — chữ tiếng Việt: ạ ế ữ ộ</h1><p>Plain Latin text: The quick brown fox.</p></main>;\n}\n",
 "n18-4:file:src/app/font/vi/page.tsx": "// app/font/vi/page.tsx — the same, with subsets: ['latin', 'vietnamese']\nimport { Inter } from 'next/font/google';\nconst inter = Inter({ subsets: ['latin', 'vietnamese'] });\nexport default function Page() {\n  return <main className={inter.className} style={{ padding: 16, fontSize: 28 }}><h1>Học Next.js — chữ tiếng Việt: ạ ế ữ ộ</h1><p>Plain Latin text: The quick brown fox.</p></main>;\n}\n",
 "n18-4:file:src/app/font/import/import.css": "/* app/font/import/import.css — the \"classic\" way: a CSS @import of Google Fonts */\n@import url('https://fonts.googleapis.com/css2?family=Lora&display=swap');\n.lora { font-family: 'Lora', serif; }\n",
 "n18-4:file:src/app/font/import/page.tsx": "// app/font/import/page.tsx — uses the @import stylesheet\nimport './import.css';\nexport default function Page() {\n  return <main className=\"lora\" style={{ padding: 16, fontSize: 28 }}><h1>Học Next.js — a page whose font comes from @import</h1></main>;\n}\n",
 "n18-4:file:src/app/font/lora/page.tsx": "// app/font/lora/page.tsx — the same font through next/font/google\nimport { Lora } from 'next/font/google';\nconst lora = Lora({ subsets: ['latin', 'vietnamese'] });\nexport default function Page() {\n  return <main className={lora.className} style={{ padding: 16, fontSize: 28 }}><h1>Học Next.js — a page whose font comes from next/font</h1></main>;\n}\n",
 "n18-4:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/font/|rror|arn' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 2.9s\n○ /font/import\n○ /font/latin\n○ /font/lora\n○ /font/vi\n$ ls .next/static/media/*.woff2 | wc -l | sed 's/^ */tệp .woff2 tự lưu trong .next\\/static\\/media: /'\ntệp .woff2 tự lưu trong .next/static/media: 26\n$ grep -o \"@font-face{[^}]*}\" .next/static/chunks/*.css | grep \"Inter Fallback\"   # the fallback face next/font generates\n@font-face{font-family:Inter Fallback;src:local(Arial);ascent-override:90.44%;descent-override:22.52%;line-gap-override:0.0%;size-adjust:107.12%}\n$ cat .next/static/chunks/*.css | grep -o \"@font-face{font-family:Inter;[^}]*}\" | grep -o \"font-display:[a-z]*\" | sort | uniq -c\n  14 font-display:swap\n$ cat .next/static/chunks/*.css | grep -o '@import \"[^\"]*\"' | head -2\n@import \"https://fonts.googleapis.com/css2?family=Lora&display=swap\"\n$ for p in latin vi; do echo \"/font/$p: $(curl -s http://127.0.0.1:19329/font/$p | grep -o '<link rel=\\\"preload\\\" href=\\\"[^\\\"]*woff2\\\"' | wc -l | tr -d ' ') <link rel=preload> woff2\"; done\n/font/latin: 3 <link rel=preload> woff2\n/font/vi: 4 <link rel=preload> woff2",
 "n18-4:offline": "$ https_proxy=http://127.0.0.1:9 npm run build   # the build machine cannot reach Google Fonts\n  There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap\n  > Build error occurred",
 "n18-4:public": "$ npm run build 2>&1 | grep -E 'Compiled|rror' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 1919ms\n$ curl -s --retry 20 --retry-connrefused --retry-delay 1 -o /dev/null -w 'dev   /favicon.ico %{http_code}\\n' http://127.0.0.1:19330/favicon.ico; curl -s -o /dev/null -w 'start /file.svg %{http_code}\\n' http://127.0.0.1:19329/file.svg\ndev   /favicon.ico 200\nstart /file.svg 200\n$ cp logo.svg public/logo-moi.svg   # a NEW file, added while both servers run\npublic/logo-moi.svg\n$ curl -s -o /dev/null -w 'next start → /logo-moi.svg %{http_code}\\n' http://127.0.0.1:19329/logo-moi.svg; curl -s -o /dev/null -w 'next dev   → /logo-moi.svg %{http_code}\\n' http://127.0.0.1:19330/logo-moi.svg\nnext start → /logo-moi.svg 404\nnext dev   → /logo-moi.svg 200\n$ # restart next start, ask again\nnext start (restarted) → /logo-moi.svg 200",
 "n18-4:kho": "$ sed -n 7,11p src/app/layout.tsx\n// Self-hosted fonts via @fontsource (npm) instead of next/font/google.\n// The Google-Fonts build-time fetch (fonts.gstatic.com) was flaky from\n// the VPS and repeatedly failed the deploy (\"Failed to fetch Poppins from\n// Google Fonts\"). @fontsource ships the woff2 in node_modules, so the\n// build is fully offline. We import the per-WEIGHT css (not the\n$ grep -c \"@fontsource\" src/app/layout.tsx | sed 's/^/import @fontsource trong layout.tsx: /'\nimport @fontsource trong layout.tsx: 17\n$ grep -c \"from 'next/font\" src/app/layout.tsx | sed 's/^/import từ next\\/font trong layout.tsx: /'\nimport từ next/font trong layout.tsx: 0",
 "n18-4:dung": "",
 "anh-nxj-18-4:latin": {
  "url": "http://localhost:19329/font/latin",
  "vp": [
   900,
   200
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19329/font/latin",
    "ma": 200,
    "loai": "document",
    "kt": 8226
   },
   {
    "url": "http://localhost:19329/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/31wp16o_jao2_.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 2007
   },
   {
    "url": "http://localhost:19329/_next/static/media/07c7676b89ed2778-s.p.2bn3s6zvc0dyp.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 48432
   },
   {
    "url": "http://localhost:19329/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19329/_next/static/media/45462fd7b7c12654-s.0k62hbripvv8p.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 10280
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "latin ⇒": "requests to Google: 0 · woff2 files: 4 (localhost:19329) · loaded: Inter [vietnamese], Inter [other], Inter Fallback [other]"
  }
 },
 "anh-nxj-18-4:vi": {
  "url": "http://localhost:19329/font/vi",
  "vp": [
   900,
   200
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19329/font/vi",
    "ma": 200,
    "loai": "document",
    "kt": 8479
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19329/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/3gxzxo3wtm_0t.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 2009
   },
   {
    "url": "http://localhost:19329/_next/static/media/07c7676b89ed2778-s.p.2bn3s6zvc0dyp.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 48432
   },
   {
    "url": "http://localhost:19329/_next/static/media/45462fd7b7c12654-s.p.0k62hbripvv8p.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 10280
   },
   {
    "url": "http://localhost:19329/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "vi ⇒": "requests to Google: 0 · woff2 files: 4 (localhost:19329) · loaded: Inter [vietnamese], Inter [other]"
  }
 },
 "anh-nxj-18-4:import": {
  "url": "http://localhost:19329/font/import",
  "vp": [
   900,
   200
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19329/font/import",
    "ma": 200,
    "loai": "document",
    "kt": 7819
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/1tt_p3pgl3ca0.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 100
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "https://fonts.googleapis.com/css2?family=Lora&display=swap",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 4795
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19329/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19329/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuxJOkq18ndeYxZ2JTg.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 5244
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq18ndeYxZ0.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 21188
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "import ⇒ slow 4G": "first text painted (FCP) at 832 ms · requests to Google: 1 (Google CSS done at 716 ms)",
   "import ⇒ chain (ms)": "HTML 165 · page CSS 415 · Google CSS 716 · FCP 832 ms"
  }
 },
 "anh-nxj-18-4:lora": {
  "url": "http://localhost:19329/font/lora",
  "vp": [
   900,
   200
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19329/font/lora",
    "ma": 200,
    "loai": "document",
    "kt": 8361
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0b2nsxu3cjo1u.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14602
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/2wru-oc2tc8qp.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 4041
   },
   {
    "url": "http://localhost:19329/_next/static/media/80aaaae4466959af-s.p.15gdzqknx46iu.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 8908
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19329/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19329/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19329/_next/static/media/c3d9c74ef0d9c07b-s.p.23aeddxv5enbo.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 37792
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19329/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "lora ⇒ slow 4G": "first text painted (FCP) at 540 ms · requests to Google: 0",
   "lora ⇒ chain (ms)": "HTML 165 · page CSS 423 · FCP 540 ms"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n18-4 · lab c18 · Next.js 16.4.6 · next start 19329 / next dev 19330 · Chromium · CDP slow 4G 150 ms / 1.6 Mbps)
export const deck = { key: 'nxj-18-4', code: 'NXJ 18.4', title: 'Fonts and static assets', sub: 'Chapter 18 · Lesson 18.4' };
const O = (k) => { const v = DU_LIEU[`n18-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-18-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const kq = (k) => Object.values(AN(k).ketQua)[0];
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const so = (s, re) => +s.match(re)[1].replace(/,/g, '');
const WOFF = so(doan('lab', '.woff2 | wc -l')[0], /: (\d+)/);
const FALLBACK = doan('lab', 'Inter Fallback')[0];
const SWAP = doan('lab', 'font-display')[0].trim();
const IMPORT = doan('lab', "@import")[0];
const PRE = doan('lab', 'for p in latin vi');
const LATIN = kq('latin'), VI = kq('vi');
const IMP = kq('import'), LORA = kq('lora');
const FCP = (s) => so(s, /FCP\) at ([\d,]+) ms/);
const GOOG = (k) => AN(k).mang.filter((e) => /fonts\.(googleapis|gstatic)\.com/.test(e.url));
const OFF = O('offline').split('\n');
const PUB = O('public').split('\n').filter((l) => !l.startsWith('$ npm run build') && !/Compiled/.test(l));
const KHO = O('kho').split('\n');
if (!/subsets: \['latin'\] \}/.test(O('file:src/app/font/latin/page.tsx')) || !/@import url\('https:\/\/fonts\.googleapis\.com/.test(O('file:src/app/font/import/import.css'))) throw new Error('mã lab đổi');
const H_NF = "// app/font/latin/page.tsx\nimport { Inter } from 'next/font/google';\nconst inter = Inter({ subsets: ['latin'] });\n\nexport default function Page() {\n  return <main className={inter.className}>\n    <h1>Học Next.js — chữ tiếng Việt: ạ ế ữ ộ</h1>\n  </main>;\n}";
const H_IM = "/* app/font/import/import.css — the “classic” way */\n@import url('https://fonts.googleapis.com/css2\n        ?family=Lora&display=swap');\n.lora { font-family: 'Lora', serif; }\n\n// app/font/lora/page.tsx — the same font, next/font\nconst lora = Lora({ subsets: ['latin', 'vietnamese'] });";

export const S = [
  { cover: true, nhan: 'Chapter 18 · Lesson 18.4', t: 'Fonts and<br>static assets', sub: 'What next/font really does at build time, what “subsets” really controls, why a CSS @import delays the first text — and the public/ folder that freezes at start',
    en: 'Lesson eighteen point four: fonts and static assets. What next font really does at build time, what subsets really controls, why a CSS import delays the first text, and the public folder that freezes when the server starts.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>next/font</code> downloads fonts <b>at build</b>: ${WOFF} <code>.woff2</code> served from your site, <b>0</b> requests to Google</li>
    <li>It writes a size-matched fallback (<code>size-adjust</code>) and <code>font-display: swap</code></li>
    <li><code>subsets</code> decides what is <b>preloaded</b>, not what can render</li>
    <li>A CSS <code>@import</code> of Google Fonts: first text at <b>${FCP(IMP).toLocaleString('en-US')} ms</b> vs ${FCP(LORA)} ms on slow 4G</li>
    <li>A new file in <code>public/</code>: <b>404</b> on <code>next start</code> until restart (dev serves it)</li></ul>`,
    en: `Five takeaways. next font downloads fonts at build time: ${WOFF} files served from your own site, zero requests to Google. It writes a size-matched fallback and font display swap. Subsets decides what is preloaded. A CSS import delays the first text. And public is frozen when next start starts.` },
  { t: 'Four ways a font hurts a page', body: icards([
      ['link', 'A third-party request', 'Every visitor’s browser asks Google’s servers — DNS, TLS, a round trip — and tells them who visited.'],
      ['layers', 'Text that jumps', 'Fallback font first, real font later, with different widths ⇒ the text reflows (CLS, 17.5).'],
      ['clock', 'A late start', 'A CSS <code>@import</code> is discovered only after its stylesheet arrives.'],
      ['server', 'A build that depends on the internet', '<code>next/font/google</code> fetches at <b>build</b> time — the build machine must reach Google.'],
    ], 2),
    en: 'Four ways a font hurts a page. A third-party request from every visitor. Text that jumps when the real font arrives. A late start when the font is behind a CSS import. And, with next font, a build that depends on reaching Google.' },
  { t: 'next/font: fetched at build, served by you', to: true, body: two(D(tsx(H_NF, { hl: [2, 3, 6] })),
    D(tn([`$ ls .next/static/media/*.woff2 | wc -l`, `${WOFF}`, `/font/latin ⇒ ${LATIN}`].join('\n'), { fs: 13, wrap: 54, title: 'build + Chromium (real)' }),
      box('No Google at runtime', 'The build downloaded the font files into <code>.next/static/media</code>; the page loads them from <b>your</b> domain. Zero requests to fonts.googleapis.com or fonts.gstatic.com — faster (no extra connection) and private.', 'lam')), 'r46'),
    en: `next font: fetched at build time, served by you. The build downloaded ${WOFF} font files into the media folder. In the browser: zero requests to Google; the woff2 files come from your own domain. Faster, and private.` },
  { t: 'The fallback that does not jump', body: two(D(tn(['$ grep "@font-face{font-family:Inter Fallback" .next/static/chunks/*.css', FALLBACK.replace(/;/g, ';\n  '), '$ grep -o "font-display:[a-z]*" … | uniq -c', SWAP].join('\n'), { fs: 14, wrap: 58, title: 'the CSS next/font generated (real)' })),
    D(box('Size-matched fallback', '<code>Inter Fallback</code> is Arial, stretched with <code>size-adjust</code> and the ascent/descent of Inter. Text drawn in Arial first takes almost the same space, so the swap barely moves anything.', 'lam'),
      box('font-display: swap', 'Text is readable immediately in the fallback, then swaps to Inter when it arrives — no invisible text.', 'lam')), 'r64'),
    en: 'The fallback that does not jump. next font writes an Inter Fallback face: Arial, stretched with size adjust and Inter’s ascent and descent, so the swap barely moves the text. And every Inter face uses font display swap: readable immediately.' },
  { t: '“subsets” controls preload, not glyphs', to: true, body: two(D(tn([`subsets: ['latin']              ⇒ ${LATIN}`, `subsets: ['latin', 'vietnamese'] ⇒ ${VI}`, ...PRE].join('\n'), { fs: 13, wrap: 60, title: 'Chromium + HTML (real)' })),
    D(box('Vietnamese still renders in Inter', 'Even with <code>[\'latin\']</code>, the generated CSS declares every subset with its own <code>unicode-range</code>; the browser fetched the Vietnamese file on demand when it met “ạ ế ữ ộ”.', 'lam'),
      box('What subsets really does', 'It decides which files get a <code>&lt;link rel="preload"&gt;</code> in the HTML (here 3 vs 4). Vietnamese site? Add <code>\'vietnamese\'</code> so its file starts early — not because it would otherwise break.', 'do2')), 'r46'),
    en: 'Subsets controls preload, not glyphs. With latin only, the Vietnamese letters still rendered in Inter: the CSS declares every subset with its own unicode range, and the browser fetched the Vietnamese file on demand. Subsets decides which files are preloaded: three versus four.' },
  { t: `CSS @import: the first text waits for Google`, body: two(D(tsx(H_IM, { hl: [2, 3, 7], sm: true }), tn([`$ grep -o '@import "…"' .next/static/chunks/*.css`, IMPORT].join('\n'), { fs: 13, wrap: 60, title: 'kept as-is in the built CSS (real)' })),
    D(meter([['@import of Google Fonts', FCP(IMP), '#dc2626'], ['next/font (same font)', FCP(LORA), '#16a34a']], { don: 'ms (FCP)', w: 380, nhan: 220, fs: 15 }),
      tn([`import ⇒ ${IMP}`, `lora   ⇒ ${LORA}`, ...GOOG('import').map((e) => `  ${e.url.slice(0, 50)}…`)].join('\n'), { fs: 12, wrap: 56, title: 'slow 4G, Chromium (real)' }),
      box('Why', 'The page CSS must arrive, then the browser discovers the <code>@import</code>, then asks Google for another stylesheet, then the font files. Nothing paints until the CSS chain is done.', 'do2')), 'r46'),
    en: `A CSS import: the first text waits for Google. On slow 4G, the page whose font comes from a CSS import painted its first text at ${FCP(IMP).toLocaleString('en-US')} milliseconds, right after Google’s stylesheet arrived. The same font through next font: ${FCP(LORA)}.` },
  { t: 'The catch: the build needs Google', to: true, body: two(D(tn(OFF.join('\n'), { fs: 14, wrap: 60, title: 'build machine without access to Google Fonts (real)' })),
    D(box('A real deploy failure', 'cuongthai.com’s VPS could not reliably reach Google Fonts, and the deploy kept failing with “Failed to fetch Poppins from Google Fonts”. The fix in its <code>layout.tsx</code>: <b>@fontsource</b> — the woff2 files ship inside <code>node_modules</code>, the build is fully offline.', 'do2'),
      box('Other offline options', '<code>next/font/local</code> with font files committed to the repo — same fallback metrics, no network at build.', 'lam')), 'r64'),
    en: 'The catch: next font google needs Google at build time. With the network blocked, the build fails. This is exactly what happened on cuongthai.com’s server: deploys failed fetching Poppins. The fix: fontsource, fonts inside node modules, or next font local.' },
  { t: 'public/: served at the root — and frozen at start', body: two(D(tn(PUB.join('\n'), { fs: 14, wrap: 60, title: 'next start :3000 and next dev :3001 (real)' })),
    D(box('next start reads public/ once', 'A file added after <code>next start</code> began is <b>404</b> — even though it is on disk — until you restart. <code>next dev</code> watches the folder and serves it at once.', 'do2'),
      box('cuongthai.com, 30/07/2026', 'The 3D playground hung on its loading screen with no error: its JS bundles in <code>public/</code> had new names, and the running server answered <b>404</b>. Production was fine (every deploy is a new container).', 'lam')), 'r64'),
    en: 'The public folder is served at the root. But next start reads it once: a file added after it started is a four oh four, even though it is on disk, until you restart. next dev serves it at once. That is the bug that froze cuongthai.com’s 3D playground on its loading screen.' },
  { t: 'cuongthai.com: fonts without next/font', body: two(D(tn(KHO.join('\n'), { fs: 14, wrap: 66, title: 'frontend/src/app/layout.tsx (real)' })),
    D(box('A trade-off, documented in the code', '17 <code>@fontsource</code> imports, 0 imports from <code>next/font</code>. The build no longer depends on Google; the price is writing your own fallback metrics if you want zero shift.', 'lam'),
      box('Per-weight CSS, on purpose', 'The comment explains it: the per-weight files keep <code>unicode-range</code>, so Vietnamese renders and only the needed subset downloads — the same mechanism you saw with <code>subsets</code>.', 'lam')), 'r64'),
    en: 'cuongthai.com loads its fonts with fontsource: seventeen imports, none from next font. The build no longer needs Google. The comment in the layout explains why each weight file is used: it keeps unicode ranges, so Vietnamese renders and only the needed subset downloads.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['📱', 'Text appears, then jumps', ['a fallback font, then the real one', 'size-adjust keeps the line where it was']],
      neu: ['❓', 'What if the build server cannot reach Google?', ['next/font/google: “Build error occurred”', 'cuongthai.com moved to @fontsource']],
      xau: ['🕵️', 'Third-party fonts leak visitors', ['every page view tells a third party who visited', 'a hijacked CDN stylesheet can inject CSS']],
      phong: ['🛡️', 'Self-host and restart', ['next/font or @fontsource: same-origin fonts', 'changed public/? restart next start']],
    }),
    en: 'Real life: text appears, then jumps when the real font arrives; size adjust keeps it in place. What if the build server cannot reach Google? The build fails. Third-party fonts tell another company who visited, and a hijacked stylesheet could inject CSS. Self-host fonts, and restart after changing public.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('next/font', 'fonts fetched at build, self-hosted'), kw('Fallback metrics', 'size-adjust, ascent/descent'), kw('font-display: swap', 'readable now, real font later'), kw('subsets', 'which files are preloaded'),
      kw('unicode-range', 'download a subset only when used'), kw('CSS @import', 'a late, chained request'), kw('@fontsource', 'fonts in node_modules'), kw('next/font/local', 'your own font files'),
      kw('public/', 'served at /, read at start'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: next font; fallback metrics; font display swap; subsets; unicode range; the CSS import; fontsource; next font local; and the public folder.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Load ${c('Inter')} with ${c('next/font/google')}; count requests to Google in Network`,
      `Find the ${c('Fallback')} face in ${c('.next/static/chunks/*.css')}; try ${c("subsets: ['latin']")} on Vietnamese text`,
      `Add a page with a CSS ${c('@import')} of Google Fonts; throttle to slow 4G; compare FCP`,
      `Add a file to ${c('public/')} while ${c('next start')} runs; request it; restart`,
    ]), box('Keep these', `<ul><li>Self-host fonts (next/font or @fontsource)</li><li>subsets = preload</li><li>No CSS @import for fonts</li><li>public/ changed ⇒ restart next start</li></ul>`, 'lam'), ''),
    en: 'Your turn: load Inter with next font and count requests to Google; find the fallback face; try a latin-only subset on Vietnamese text; compare a CSS import on slow 4G; and add a file to public while next start runs.' },
];
export const slides = lamDeck({ chuong: 'Chapter 18 — Performance: images, JavaScript and fonts', bai: '18.4' }, S);
