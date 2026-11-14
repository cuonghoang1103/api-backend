/*DU_LIEU*/
const DU_LIEU = {
 "n18-5:file:src/app/do/it/page.tsx": "// app/do/it/page.tsx — no library at all\nexport default function Page() {\n  return <pre>const total = items.reduce((s, x) =&gt; s + x, 0);</pre>;\n}\n",
 "n18-5:file:src/app/do/nhieu/Hl.tsx": "'use client';\n// app/do/nhieu/Hl.tsx — the whole highlight.js (every language)\nimport hljs from 'highlight.js';\nexport default function Hl() {\n  return <pre dangerouslySetInnerHTML={{ __html: hljs.highlight('const total = 1;', { language: 'javascript' }).value }} />;\n}\n",
 "n18-5:file:src/app/do/nhieu/page.tsx": "import Hl from './Hl';\nexport default function Page() { return <Hl />; }\n",
 "n18-5:file:src/app/do/core/Hl.tsx": "'use client';\n// app/do/core/Hl.tsx — ONE change: the core + the one language we use\nimport hljs from 'highlight.js/lib/core';\nimport javascript from 'highlight.js/lib/languages/javascript';\nhljs.registerLanguage('javascript', javascript);\nexport default function Hl() {\n  return <pre dangerouslySetInnerHTML={{ __html: hljs.highlight('const total = 1;', { language: 'javascript' }).value }} />;\n}\n",
 "n18-5:file:src/app/do/core/page.tsx": "import Hl from './Hl';\nexport default function Page() { return <Hl />; }\n",
 "n18-5:file:src/app/api/vitals/route.ts": "// app/api/vitals/route.ts — receives real-user metrics (field data) and logs them\nexport async function POST(req: Request) {\n  const m = await req.json();\n  console.log(`[vitals] ${m.page} ${m.name} ${m.value} (${m.rating})`);\n  return new Response(null, { status: 204 });\n}\n",
 "n18-5:file:src/app/do/Vitals.tsx": "'use client';\n// app/do/Vitals.tsx — send every Web Vital of a real visit home\nimport { useReportWebVitals } from 'next/web-vitals';\nexport default function Vitals() {\n  useReportWebVitals((m) => {\n    const body = JSON.stringify({ page: location.pathname, name: m.name, value: Math.round(m.value * 1000) / 1000, rating: m.rating });\n    navigator.sendBeacon('/api/vitals', new Blob([body], { type: 'application/json' }));\n  });\n  return null;\n}\n",
 "n18-5:file:src/app/do/blog/Like.tsx": "'use client';\n// app/do/blog/Like.tsx — one button (gives the page an interaction to measure)\nimport { useState } from 'react';\nexport default function Like() {\n  const [n, setN] = useState(0);\n  return <button id=\"like\" className=\"rounded border px-3\" onClick={() => setN(n + 1)}>♥ {n}</button>;\n}\n",
 "n18-5:file:src/app/do/blog/page.tsx": "// app/do/blog/page.tsx — the fixed blog post: next/image + sizes, a small client button, real-user metrics\nimport Image from 'next/image';\nimport Like from './Like';\nimport Vitals from '../Vitals';\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      <Vitals />\n      <h1 className=\"text-2xl font-bold\">A weekend in Da Lat</h1>\n      <Image src=\"/dalat.jpg\" alt=\"Da Lat\" width={4000} height={3000} sizes=\"(max-width: 672px) 100vw, 672px\" preload style={{ width: '100%', height: 'auto' }} />\n      <p>Photo resized by next/image.</p>\n      <Like />\n    </main>\n  );\n}\n",
 "n18-5:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/do/|rror' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 2.2s\n○ /do/blog\n○ /do/core\n○ /do/it\n○ /do/nhieu\n$ node -e \"…route-bundle-stats.json…\"\n/do/it       446 KB · gzip 132 KB\n/do/blog     472 KB · gzip 141 KB\n/do/core     472 KB · gzip 142 KB\n/do/nhieu   1391 KB · gzip 433 KB\n$ for p in it nhieu core; do curl -s localhost:3000/do/$p | grep -o '<script' | wc -l; done\n/do/it: 9 thẻ <script> trong HTML\n/do/nhieu: 11 thẻ <script> trong HTML\n/do/core: 11 thẻ <script> trong HTML",
 "n18-5:do": "$ for i in 1 2 3; do npx lighthouse http://localhost:3000/do/blog --only-categories=performance; done\nlần 1: Performance 96/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.7 s · TBT 60 ms · CLS 0.065 \nlần 2: Performance 97/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.5 s · TBT 30 ms · CLS 0.065 \nlần 3: Performance 98/100 (mobile, Lighthouse 12.8.2) FCP 0.8 s · LCP 2.4 s · TBT 30 ms · CLS 0 ",
 "n18-5:analyze": "$ curl -s --retry 20 --retry-connrefused --retry-delay 1 -o /dev/null -w 'next analyze → http://localhost:19333 %{http_code}\\n' http://localhost:19333/\nnext analyze → http://localhost:19333 200",
 "n18-5:vitals": "$ tail -f <next start log> | grep '[vitals]'   # what the visits sent home\n[vitals] /do/blog LCP 1388 (good)\n[vitals] /do/blog INP 48 (good)\n[vitals] /do/blog LCP 24 (good)\n[vitals] /do/blog INP 48 (good)\n[vitals] /do/blog CLS 0.065 (good)\n$ node p75.mjs   # count + 75th percentile per metric (how Google summarises field data)\nFCP    13 visits · p75 80\nTTFB   13 visits · p75 5.2\nCLS     9 visits · p75 0\nLCP     9 visits · p75 52\nINP     1 visits · p75 48",
 "n18-5:kho": "$ grep -rln \"useReportWebVitals\" src | wc -l | sed 's/^ */tệp gọi useReportWebVitals: /'\ntệp gọi useReportWebVitals: 0\n$ curl -s https://cuongthai.com/courses/nextjs | grep -o '<script[^>]*src=\"[^\"]*\"' …   # count tags, then fetch each one\nthẻ <script> trong HTML: 78 (có src: 44)\nJS tải về (đã nén theo Accept-Encoding): 757 KB",
 "n18-5:dung": "",
 "anh-nxj-18-5:analyze": {
  "url": "http://localhost:19333/",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "console": [
   {
    "kieu": "pageerror",
    "chu": "Minified React error #467; visit https://react.dev/errors/467 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   },
   {
    "kieu": "pageerror",
    "chu": "Minified React error #467; visit https://react.dev/errors/467 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   },
   {
    "kieu": "pageerror",
    "chu": "Minified React error #467; visit https://react.dev/errors/467 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ]
 },
 "anh-nxj-18-5:analyze-ds": {
  "url": "http://localhost:19333/",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "console": [
   {
    "kieu": "pageerror",
    "chu": "Minified React error #467; visit https://react.dev/errors/467 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   },
   {
    "kieu": "pageerror",
    "chu": "Minified React error #467; visit https://react.dev/errors/467 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   },
   {
    "kieu": "pageerror",
    "chu": "Minified React error #467; visit https://react.dev/errors/467 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ]
 },
 "anh-nxj-18-5:nhanh-lanh": {
  "url": "http://localhost:19331/do/blog",
  "vp": [
   412,
   823
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "your laptop · cold ⇒": "LCP 152 ms · load 139 ms · downloaded 249 KB · 0/12 files from cache"
  }
 },
 "anh-nxj-18-5:nhanh-am": {
  "url": "http://localhost:19331/do/blog",
  "vp": [
   412,
   823
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "your laptop · warm (2nd visit) ⇒": "LCP 16 ms · load 20 ms · downloaded 1 KB · 10/12 files from cache"
  }
 },
 "anh-nxj-18-5:cham-lanh": {
  "url": "http://localhost:19331/do/blog",
  "vp": [
   412,
   823
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "slow 4G + 4× CPU · cold ⇒": "LCP 1,384 ms · load 1,673 ms · downloaded 249 KB · 0/12 files from cache"
  }
 },
 "anh-nxj-18-5:cham-am": {
  "url": "http://localhost:19331/do/blog",
  "vp": [
   412,
   823
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "slow 4G + 4× CPU · warm ⇒": "LCP 196 ms · load 236 ms · downloaded 1 KB · 10/12 files from cache"
  }
 },
 "anh-nxj-18-5:vitals": {
  "url": "http://localhost:19331/do/blog",
  "vp": [
   412,
   823
  ],
  "rect": {},
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n18-5 · lab c18 · Next.js 16.4.6 · next start 19331 · next analyze 19333 · Lighthouse 12.8.2 ×3 · Chromium 412×823 DPR 2, CDP 4G chậm + CPU 4×)
export const deck = { key: 'nxj-18-5', code: 'NXJ 18.5', title: 'Measuring, honestly', sub: 'Chapter 18 · Lesson 18.5' };
const O = (k) => { const v = DU_LIEU[`n18-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-18-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const kq = (k) => Object.values(AN(k).ketQua)[0];
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const so = (s, re) => +s.match(re)[1].replace(/,/g, '');
const STATS = doan('lab', 'route-bundle-stats.json…');
const KB = (r) => so(STATS.find((l) => l.startsWith(r + ' ')), /(\d+) KB ·/);
const TAG = doan('lab', "grep -o '<script' | wc -l");
const TG = (p) => so(TAG.find((l) => l.startsWith(`/do/${p}:`)), /: (\d+) thẻ/);
const LH = doan('do', 'for i in 1 2 3');
const DIEM = LH.map((l) => so(l, /Performance (\d+)/));
const VIT = doan('vitals', "tail -f"), P75 = doan('vitals', 'p75.mjs');
const KHO = O('kho').split('\n');
const NL = kq('nhanh-lanh'), NA = kq('nhanh-am'), CL = kq('cham-lanh'), CA = kq('cham-am');
const LCP = (s) => so(s, /LCP ([\d,]+) ms/), DL = (s) => so(s, /downloaded ([\d,]+) KB/);
if (!/highlight\.js\/lib\/core/.test(O('file:src/app/do/core/Hl.tsx')) || !/useReportWebVitals/.test(O('file:src/app/do/Vitals.tsx'))) throw new Error('mã lab đổi');
const H_DIFF = "// app/do/nhieu/Hl.tsx — before\nimport hljs from 'highlight.js';\n\n// app/do/core/Hl.tsx — ONE change\nimport hljs from 'highlight.js/lib/core';\nimport javascript from\n  'highlight.js/lib/languages/javascript';\nhljs.registerLanguage('javascript', javascript);";
const H_VIT = "'use client';\n// app/do/Vitals.tsx — field data from real visits\nimport { useReportWebVitals } from 'next/web-vitals';\nexport default function Vitals() {\n  useReportWebVitals((m) => navigator.sendBeacon('/api/vitals',\n    JSON.stringify({ name: m.name, value: m.value })));\n  return null;\n}";
const K_ = (n) => n.toLocaleString('en-US');

export const S = [
  { cover: true, nhan: 'Chapter 18 · Lesson 18.5', t: 'Measuring,<br>honestly', sub: 'The analyzer, one change measured, why script tags lie, why Lighthouse wobbles, why your laptop lies — and how to hear from real users',
    en: 'Lesson eighteen point five: measuring, honestly. The bundle analyzer, one change measured, why counting script tags lies, why Lighthouse wobbles, why your own laptop lies, and how to hear from real users.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>next analyze</code> (Next.js 16): the treemap shows <b>highlight.js/languages</b> filling the page</li>
    <li>Change one import: <b>${K_(KB('/do/nhieu'))} → ${KB('/do/core')} KB</b> — same <b>${TG('nhieu')}</b> script tags</li>
    <li>Lighthouse, same page, three runs: <b>${DIEM.join(' · ')}</b></li>
    <li>Your warm laptop: LCP <b>${LCP(NA)} ms</b>; a cold phone on slow 4G: <b>${K_(LCP(CL))} ms</b></li>
    <li><code>useReportWebVitals</code>: numbers from real visits, summarised at the 75th percentile</li></ul>`,
    en: `Five takeaways. The bundle analyzer shows what fills a page. Change one import and the route drops from ${K_(KB('/do/nhieu'))} to ${KB('/do/core')} kilobytes, with the same number of script tags. Lighthouse wobbles between runs. Your warm laptop says ${LCP(NA)} milliseconds; a cold phone, ${K_(LCP(CL))}. And real users report through useReportWebVitals.` },
  { t: 'Four instruments — know what each one measures', body: icards([
      ['count', 'The build’s numbers', '<code>route-bundle-stats.json</code>: JS per route, comparable across commits (18.1).'],
      ['search', 'The analyzer', '<code>next analyze</code>: a treemap of <b>what</b> is inside a route.'],
      ['gauge', 'Lighthouse', 'A lab score on a simulated phone — a <b>comparison</b> tool, not a verdict.'],
      ['pulse', 'Field data', 'What real visitors experienced: <code>useReportWebVitals</code>, Search Console (CrUX).'],
    ], 2),
    en: 'Four instruments, each measuring something different. The build’s numbers: JavaScript per route. The analyzer: what is inside. Lighthouse: a lab score on a simulated phone, good for comparisons. And field data: what real visitors experienced.' },
  { t: 'The analyzer: what fills /do/nhieu', body: two(D(br('nxj-18-5', 'analyze', { url: 'localhost:19333 · next analyze', vp: 1280, h: 700, w: 640 })),
    D(box('One library, 190 languages', 'The treemap: <b>highlight.js/lib/languages</b> — mathematica.js, isbl.js, gml.js… — to colour one line of JavaScript. You see it in one picture; a grep would not tell you.', 'do2'),
      box('Next.js 16: built in', '<code>next analyze</code> (Turbopack only; <code>-o</code> writes files to <code>.next/diagnostics/analyze</code>). <code>@next/bundle-analyzer</code> is the older plugin for webpack builds.', 'lam'),
      box('Compare like with like', 'Its size (710 KB) is counted differently from route-bundle-stats: compare a tool with itself.', 'lam')), 'r64'),
    en: 'The analyzer. Next.js sixteen has it built in: next analyze. The treemap of the route shows highlight.js languages filling most of the page, a hundred and ninety languages to colour one line. One picture tells you what a grep would not.' },
  { t: 'Change ONE thing, rebuild, compare', body: two(D(tsx(H_DIFF, { hl: [5, 6, 7, 8] })),
    D(meter([['/do/it (no library)', KB('/do/it'), '#64748b'], ['/do/nhieu (all of highlight.js)', KB('/do/nhieu'), '#dc2626'], ['/do/core (core + javascript)', KB('/do/core'), '#16a34a']], { don: 'KB JS', w: 420, nhan: 250, fs: 15 }),
      tn(STATS.join('\n'), { fs: 14, wrap: 50, title: 'route-bundle-stats.json (real)' }),
      box('Write the numbers in the commit', `“highlight.js: core + javascript only — /do: ${K_(KB('/do/nhieu'))} → ${KB('/do/core')} KB”. Next month, that line explains itself.`, 'lam')), 'r46'),
    en: `Change one thing, rebuild, compare. Import the core of highlight.js and register only JavaScript. The route drops from ${K_(KB('/do/nhieu'))} to ${KB('/do/core')} kilobytes. Put those numbers in the commit message.` },
  { t: 'Why counting &lt;script&gt; tags lies', to: true, body: two(D(tn(TAG.join('\n'), { fs: 15, wrap: 50, title: 'the HTML of each page (real)' }),
      meter([['/do/it', KB('/do/it'), '#64748b'], ['/do/nhieu', KB('/do/nhieu'), '#dc2626'], ['/do/core', KB('/do/core'), '#16a34a']], { don: 'KB JS', w: 420, nhan: 140, fs: 15 })),
    D(box('Same tags, three times the code', `<code>/do/nhieu</code> and <code>/do/core</code> both have ${TG('nhieu')} <code>&lt;script&gt;</code> tags — ${K_(KB('/do/nhieu'))} KB vs ${KB('/do/core')} KB. A tag is a pointer, not a size.`, 'do2'),
      box('cuongthai.com, measured', `The course page: <b>${so(KHO.find((l) => l.includes('trong HTML:')), /HTML: (\d+)/)}</b> <code>&lt;script&gt;</code> tags (${so(KHO.find((l) => l.includes('trong HTML:')), /có src: (\d+)/)} with a <code>src</code>) — and <b>${so(KHO.find((l) => l.includes('JS tải về')), /: (\d+) KB/)} KB</b> of JavaScript downloaded behind them (compressed). Count bytes, not tags.`, 'lam')), 'r46'),
    en: `Why counting script tags lies. Both pages have ${TG('nhieu')} script tags, but one ships ${K_(KB('/do/nhieu'))} kilobytes and the other ${KB('/do/core')}. A tag is a pointer, not a size. On cuongthai.com the course page has seventy-eight tags; what matters is the seven hundred and fifty-seven kilobytes behind them.` },
  { t: `Lighthouse wobbles: ${DIEM.join(' · ')}`, body: two(D(tn(LH.join('\n'), { fs: 13, wrap: 60, title: 'same page, same machine, three runs (real)' }),
      meter(DIEM.map((d, i) => [`run ${i + 1}`, d, '#16a34a']), { don: '/ 100', w: 420, nhan: 120, fs: 15 })),
    D(box('Run it several times', 'Same code, same machine, three runs: three scores, and CLS appeared in two runs out of three. Take the median of 3–5 runs before you believe a change.', 'lam'),
      box('Before vs after this chapter', `The 18.1 blog post (camera photo + all of highlight.js) scored 51–53/100 on the same machine (lesson 18.1). The fixed post here: ${Math.min(...DIEM)}–${Math.max(...DIEM)}. That comparison is what Lighthouse is for.`, 'do2')), 'r64'),
    en: `Lighthouse wobbles. The same page, three runs: ${DIEM.join(', ')}, and a layout shift appeared in two of the three. Take the median of several runs. Then compare: the blog post of lesson eighteen point one scored about fifty-one to fifty-three; the fixed one, ${Math.min(...DIEM)} to ${Math.max(...DIEM)}.` },
  { t: 'Your machine is not the test', body: two(D(meter([['your laptop · warm (2nd visit)', LCP(NA), '#16a34a'], ['your laptop · cold', LCP(NL), '#0070f3'], ['phone (4G + 4× CPU) · warm', LCP(CA), '#ea580c'], ['phone (4G + 4× CPU) · cold', LCP(CL), '#dc2626']], { don: 'ms LCP', w: 440, nhan: 270, fs: 15 }),
      tn([`laptop · warm ⇒ ${NA}`, `laptop · cold ⇒ ${NL}`, `phone  · warm ⇒ ${CA}`, `phone  · cold ⇒ ${CL}`].join('\n'), { fs: 12, wrap: 64, title: 'Chromium, same page (real)' })),
    D(box(`${Math.round(LCP(CL) / LCP(NA))}× apart`, `You reload a page you already visited: the files come from cache (${DL(NA)} KB downloaded). A first-time visitor on a phone downloads ${DL(CL)} KB on a slow line with a slow CPU.`, 'do2'),
      box('Test as a stranger', 'Incognito, “Disable cache”, network throttling (slow 4G) and CPU throttling (4×) — at least before every release.', 'lam')), 'r46'),
    en: `Your machine is not the test. The same page: on your laptop, second visit, LCP ${LCP(NA)} milliseconds. A first-time visitor on a slow phone: ${K_(LCP(CL))}. That is about ${Math.round(LCP(CL) / LCP(NA))} times apart. Test as a stranger: incognito, cache off, throttled.` },
  { t: 'Field data: hear from real visits', body: two(D(tsx(H_VIT, { hl: [3, 5] }), tn(VIT.join('\n'), { fs: 13, wrap: 56, title: 'next start log — what visits sent home (real)' })),
    D(tn(P75.join('\n'), { fs: 15, wrap: 50, title: 'count + 75th percentile per metric (real)' }),
      box('Why the 75th percentile', 'Google’s field data (CrUX) reports the value 75% of visits beat. One fast visit (yours) or one terrible one cannot move it much — it describes most real users.', 'lam'),
      box('These visits were mixed', 'Lighthouse runs, warm and cold, fast and throttled — exactly why one number from one visit means little.', 'do2')), 'r46'),
    en: 'Field data. A tiny client component calls useReportWebVitals and sends each metric home with sendBeacon. Our test visits reported LCP, FCP, CLS, TTFB and INP. Summarise them at the seventy-fifth percentile, like Google does: one fast visit cannot fool it.' },
  { t: 'cuongthai.com: lab yes, field not yet', body: two(D(tn(KHO.join('\n'), { fs: 13, wrap: 64, title: 'frontend/ + cuongthai.com (real)' })),
    D(box('No field data of its own', '<code>useReportWebVitals</code> is called nowhere (17.5): the site cannot see its own users’ LCP/INP — only Google Search Console can.', 'do2'),
      box('The lesson already in this chapter', 'Judge weight by bytes, not by tags; compare builds with the build’s numbers; and measure the real thing with the tool that measures it.', 'lam')), 'r64'),
    en: 'cuongthai.com: lab measurements, yes; field data, not yet. useReportWebVitals is not called anywhere, so the site cannot see its own users’ numbers. And its course page shows why you judge weight by bytes, not by tags.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['📱', '“It is fast on my machine”', ['you reload a warm page on fibre', `a stranger’s phone: ${K_(LCP(CL))} ms vs your ${LCP(NA)} ms`]],
      neu: ['❓', 'What if you trust one Lighthouse run?', [`${DIEM.join(' / ')} on the same code`, 'you “fix” noise and break real things']],
      xau: ['🕵️', 'Field data is an input', ['the /api/vitals endpoint accepts anything', 'bots can flood it or fake “good” numbers']],
      phong: ['🛡️', 'Median, cold, validated', ['3–5 runs, median; cold + throttled', 'rate-limit + validate the vitals endpoint']],
    }),
    en: 'Real life: it is fast on my machine, because you reload a warm page. What if you trust one Lighthouse run? You chase noise. And field data is an input: anyone can post to your vitals endpoint, flood it, or fake good numbers. Use medians, test cold, and validate the endpoint.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('next analyze', 'treemap of a route (Turbopack)'), kw('Lab data', 'one machine, simulated phone'), kw('Field data', 'real visits (CrUX, useReportWebVitals)'), kw('p75', 'the value 75% of visits beat'),
      kw('Median of runs', 'tame the wobble'), kw('Cold vs warm', 'first visit vs cached'), kw('Throttling', 'slow 4G + 4× CPU'), kw('useReportWebVitals', 'send metrics home'),
      kw('Script tag ≠ size', 'a pointer, not bytes'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: next analyze; lab data; field data; the seventy-fifth percentile; the median of runs; cold versus warm; throttling; useReportWebVitals; and a script tag is not a size.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `${c('next analyze')} on your app; find the biggest box in your heaviest route`,
      'Change ONE import; rebuild; write both numbers in the commit message',
      'Run Lighthouse 3 times; take the median. Then cold + throttled vs warm',
      `Add ${c('useReportWebVitals')} + a small ${c('/api/vitals')} route; read p75`,
    ]), box('Keep these', `<ul><li>Bytes, not tags</li><li>One change, then compare</li><li>Median of several runs</li><li>Test cold + throttled; listen to the field</li></ul>`, 'lam'), ''),
    en: 'Your turn: run next analyze and find the biggest box; change one import and record both numbers; run Lighthouse three times and take the median; compare cold and throttled with warm; and add useReportWebVitals with a small endpoint.' },
];
export const slides = lamDeck({ chuong: 'Chapter 18 — Performance: images, JavaScript and fonts', bai: '18.5' }, S);
