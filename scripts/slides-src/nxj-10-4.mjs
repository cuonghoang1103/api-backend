/*DU_LIEU*/
const DU_LIEU = {
 "n10-4:file:luong.mjs": "// luong.mjs <url> [chuỗi…] — đọc HTML theo từng MẨU khi máy chủ gửi (streaming), in mốc mili giây từ lúc gửi request + mẩu đó có những chuỗi nào\nconst [url, ...tim] = process.argv.slice(2);\nconst t0 = performance.now();\nconst res = await fetch(url);\nconst dec = new TextDecoder();\nlet i = 0;\nfor await (const manh of res.body) {\n  const s = dec.decode(manh, { stream: true });\n  const co = tim.filter((x) => s.includes(x));\n  console.log(`+${String(Math.round(performance.now() - t0)).padStart(4)} ms · mẩu ${++i} · ${String(manh.length).padStart(5)} B${co.length ? ' · có: ' + co.join(', ') : ''}`);\n}\n",
 "n10-4:api": "",
 "n10-4:file:src/app/st/du-lieu.tsx": "// hai \"nguồn\": tiêu đề nhanh (20 ms), biểu đồ doanh thu chậm (900 ms) — API giả của lab\nconst lay = async (p: string) => (await fetch('http://127.0.0.1:19385' + p, { cache: 'no-store' })).json();\n\nexport async function Header() {\n  const u = await lay('/nguoi-dung?ms=20');\n  return <h1 className=\"text-2xl font-bold\">Xin chào {u.ten} — TIEU-DE</h1>;\n}\n\nexport async function SlowRevenueChart() {\n  const tk = await lay('/thong-ke?ms=900');\n  return <p className=\"text-xl\">📈 Doanh thu: {tk.binhLuan} đơn — BIEU-DO</p>;\n}\n\nexport function Spinner() {\n  return <p className=\"text-xl text-gray-500\">⏳ đang tải biểu đồ… DANG-TAI</p>;\n}\n",
 "n10-4:file:src/app/st/khong/page.tsx": "// 1) KHÔNG ranh giới nào: chờ cả hai rồi mới gửi\nimport { connection } from 'next/server';\nimport { Header, SlowRevenueChart } from '../du-lieu';\n\nexport default async function Khong() {\n  await connection();\n  return (\n    <main className=\"p-4 font-sans\">\n      <Header />\n      <SlowRevenueChart />\n    </main>\n  );\n}\n",
 "n10-4:file:src/app/st/ca-trang/page.tsx": "// 2) cả trang sau MỘT ranh giới: loading.tsx bên cạnh\nimport { connection } from 'next/server';\nimport { Header, SlowRevenueChart } from '../du-lieu';\n\nexport default async function CaTrang() {\n  await connection();\n  return (\n    <main className=\"p-4 font-sans\">\n      <Header />\n      <SlowRevenueChart />\n    </main>\n  );\n}\n",
 "n10-4:file:src/app/st/ca-trang/loading.tsx": "export default function Loading() {\n  return <p className=\"p-4 font-sans text-xl text-gray-500\">⏳ khung xương cả trang… LOADING</p>;\n}\n",
 "n10-4:file:src/app/st/mot-manh/page.tsx": "// 3) chỉ bọc phần chậm trong <Suspense>\nimport { Suspense } from 'react';\nimport { connection } from 'next/server';\nimport { Header, SlowRevenueChart, Spinner } from '../du-lieu';\n\nexport default async function MotManh() {\n  await connection();\n  return (\n    <main className=\"p-4 font-sans\">\n      <Header />\n      <Suspense fallback={<Spinner />}>\n        <SlowRevenueChart />\n      </Suspense>\n    </main>\n  );\n}\n",
 "n10-4:file:src/app/st/bai/page.tsx": "// đoạn mã của bài, CHÉP NGUYÊN phần JSX (chỉ thêm import + connection)\nimport { Suspense } from 'react';\nimport { connection } from 'next/server';\nimport { Header, SlowRevenueChart, Spinner } from '../du-lieu';\n\nexport default async function Page() {\n  await connection();\n  return (\n    <>\n      <Header />                         // instant\n      <Suspense fallback={<Spinner />}>\n        <SlowRevenueChart />             // streams in later\n      </Suspense>\n    </>\n  );\n}\n",
 "n10-4:trang": "$ npm run build\n✓ Compiled successfully in 952ms\n├ ƒ /st/bai\n├ ƒ /st/ca-trang\n├ ƒ /st/khong\n├ ƒ /st/mot-manh\nƒ  (Dynamic)  server-rendered on demand\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n10-4:do": "$ node luong.mjs localhost:3000/st/khong TIEU-DE BIEU-DO      # 1) không ranh giới\n+ 939 ms · mẩu 1 ·  1674 B · có: TIEU-DE, BIEU-DO\n+ 939 ms · mẩu 2 ·  5801 B · có: TIEU-DE, BIEU-DO\n+ 940 ms · mẩu 3 ·    14 B\n$ node luong.mjs localhost:3000/st/ca-trang LOADING TIEU-DE BIEU-DO   # 2) loading.tsx cho cả trang\n+  35 ms · mẩu 1 ·  1822 B · có: LOADING\n+  35 ms · mẩu 2 ·  5847 B · có: LOADING\n+  52 ms · mẩu 3 ·   160 B · có: TIEU-DE\n+  52 ms · mẩu 4 ·   329 B · có: TIEU-DE\n+ 934 ms · mẩu 5 ·   156 B · có: BIEU-DO\n+ 935 ms · mẩu 6 ·   997 B · có: BIEU-DO\n+ 935 ms · mẩu 7 ·    14 B\n$ node luong.mjs localhost:3000/st/mot-manh TIEU-DE DANG-TAI BIEU-DO   # 3) Suspense quanh phần chậm\n+  55 ms · mẩu 1 ·  1798 B · có: TIEU-DE, DANG-TAI\n+  55 ms · mẩu 2 ·  5861 B · có: TIEU-DE, DANG-TAI\n+ 933 ms · mẩu 3 ·   156 B · có: BIEU-DO\n+ 934 ms · mẩu 4 ·   964 B · có: BIEU-DO\n+ 934 ms · mẩu 5 ·    14 B\n$ for p in khong ca-trang mot-manh; do curl -s -o /dev/null -w \"/st/$p · byte đầu %{time_starttransfer} s · xong %{time_total} s\\n\" localhost:19386/st/$p; done\n/st/khong · byte đầu 0.908886 s · xong 0.908969 s\n/st/ca-trang · byte đầu 0.006802 s · xong 0.909074 s\n/st/mot-manh · byte đầu 0.031993 s · xong 0.908968 s",
 "n10-4:manh": "$ curl localhost:3000/st/mot-manh   (giải phẫu mẩu cuối — nội dung đến trong thẻ ẩn rồi được tráo vào)\n<div hidden id=\"S:0\"><p class=\"text-xl\">📈 Doanh thu: 15 đơn — BIEU-DO</p></div><script>$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b\n$ curl -s localhost:19386/st/mot-manh | grep -o '\\$RC(\"B:0\",\"S:0\")' | head -1\n$RC(\"B:0\",\"S:0\")\n$ curl -s localhost:19386/st/mot-manh | grep -o '<!--\\$?--><template id=\"B:0\"></template>.\\{0,70\\}' | sed 's/<!-- -->//g' | head -1\n<!--$?--><template id=\"B:0\"></template><p class=\"text-xl text-gray-500\">⏳ đang tải biểu đồ… DANG-TAI</p><!--/",
 "n10-4:chu": "$ curl -s localhost:19386/st/bai | sed 's/<!-- -->//g' | grep -o '</h1>[^<]*' | head -2\n</h1>                         // instant\n$ curl -s localhost:19386/st/bai | grep -o '<template id=\"P:1\"></template>[^<]*' | head -1\n<template id=\"P:1\"></template>             // streams in later\n$ npx eslint src/app/st/bai/page.tsx 2>&1 | grep -E 'jsx-no-comment|problem' | head -3\n  10:17  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes\n  12:29  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes\n✖ 2 problems (2 errors, 0 warnings)",
 "n10-4:file:src/app/st/canh-nhau/page.tsx": "// hai mảnh ANH EM: mỗi mảnh tự lấy dữ liệu, mỗi mảnh một Suspense\nimport { Suspense } from 'react';\nimport { connection } from 'next/server';\n\nconst lay = async (p: string) => (await fetch('http://127.0.0.1:19385' + p, { cache: 'no-store' })).json();\nasync function BaiViet() { const d = await lay('/bai-viet?ms=600&o=canh'); return <p>📝 {d.length} bài viết — MANH-A</p>; }\nasync function ThongKe() { const d = await lay('/thong-ke?ms=600&o=canh'); return <p>📊 {d.binhLuan} bình luận — MANH-B</p>; }\n\nexport default async function CanhNhau() {\n  await connection();\n  return (\n    <main className=\"p-4 font-sans\">\n      <Suspense fallback={<p>…</p>}><BaiViet /></Suspense>\n      <Suspense fallback={<p>…</p>}><ThongKe /></Suspense>\n    </main>\n  );\n}\n",
 "n10-4:file:src/app/st/long-nhau/page.tsx": "// mảnh B nằm TRONG mảnh A: B chỉ bắt đầu sau khi A đã có dữ liệu\nimport { Suspense } from 'react';\nimport { connection } from 'next/server';\n\nconst lay = async (p: string) => (await fetch('http://127.0.0.1:19385' + p, { cache: 'no-store' })).json();\nasync function ThongKe() { const d = await lay('/thong-ke?ms=600&o=long'); return <p>📊 {d.binhLuan} bình luận — MANH-B</p>; }\nasync function BaiViet() {\n  const d = await lay('/bai-viet?ms=600&o=long');\n  return (\n    <section>\n      <p>📝 {d.length} bài viết — MANH-A</p>\n      <Suspense fallback={<p>…</p>}><ThongKe /></Suspense>\n    </section>\n  );\n}\n\nexport default async function LongNhau() {\n  await connection();\n  return (\n    <main className=\"p-4 font-sans\">\n      <Suspense fallback={<p>…</p>}><BaiViet /></Suspense>\n    </main>\n  );\n}\n",
 "n10-4:long": "$ node luong.mjs http://localhost:19386/st/canh-nhau MANH-A MANH-B\n+  36 ms · mẩu 1 ·  1713 B\n+  36 ms · mẩu 2 ·  5759 B\n+ 634 ms · mẩu 3 ·   123 B · có: MANH-A\n+ 636 ms · mẩu 4 ·   941 B · có: MANH-A\n+ 636 ms · mẩu 5 ·   125 B · có: MANH-B\n+ 636 ms · mẩu 6 ·   114 B · có: MANH-B\n+ 636 ms · mẩu 7 ·    14 B\n$ node luong.mjs http://localhost:19386/st/long-nhau MANH-A MANH-B\n+  35 ms · mẩu 1 ·  1655 B\n+  35 ms · mẩu 2 ·  5658 B\n+ 632 ms · mẩu 3 ·   264 B · có: MANH-A\n+ 633 ms · mẩu 4 ·  1018 B · có: MANH-A\n+1236 ms · mẩu 5 ·   125 B · có: MANH-B\n+1236 ms · mẩu 6 ·   114 B · có: MANH-B\n+1236 ms · mẩu 7 ·    14 B\n$ (log API giả — hai lần vừa đo)\n  [api] 22:21:44.423 GET /bai-viet?ms=600&o=canh\n  [api] 22:21:44.423 GET /thong-ke?ms=600&o=canh\n  [api] 22:21:45.147 GET /bai-viet?ms=600&o=long\n  [api] 22:21:45.749 GET /thong-ke?ms=600&o=long",
 "n10-4:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, gantt } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-10-4', code: 'NXJ 10.4', title: 'Streaming: loading.tsx, Suspense and the waterfall', sub: 'Chapter 10 · Lesson 10.4' };
const O = (k) => { const v = DU_LIEU[`n10-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-10-4', ten, o);
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const manh = (k, dau) => doan(k, dau).map((l) => { const m = /^\+\s*(\d+) ms · mẩu (\d+) · \s*(\d+) B(?: · có: (.*))?$/.exec(l); if (!m) throw new Error('dòng lạ ' + l); return { ms: +m[1], so: +m[2], b: +m[3], co: m[4] ? m[4].split(', ') : [] }; });
const luc = (ds, chu) => { const x = ds.find((m) => m.co.includes(chu)); if (!x) throw new Error('không có ' + chu); return x.ms; };

// ── số đo (chặn)
const KH = manh('do', 'st/khong'), CT = manh('do', 'st/ca-trang'), MM = manh('do', 'st/mot-manh');
const CN = manh('long', 'canh-nhau'), LN = manh('long', 'long-nhau');
const CURL = doan('do', 'time_starttransfer');
const cu = (p) => { const l = CURL.find((x) => x.startsWith(`/st/${p} `)); const m = /byte đầu ([\d.]+) s · xong ([\d.]+) s/.exec(l); return [Math.round(+m[1] * 1000), Math.round(+m[2] * 1000)]; };
const [KH0, KH1] = cu('khong'), [CT0, CT1] = cu('ca-trang'), [MM0, MM1] = cu('mot-manh');
if (KH[0].ms < 850 || luc(CT, 'LOADING') > 100 || luc(MM, 'TIEU-DE') > 100 || luc(MM, 'BIEU-DO') < 850 || KH0 < 850 || CT0 > 50 || MM0 > 100) throw new Error('số đo streaming 10.4 đổi');
if (luc(CN, 'MANH-B') > 700 || luc(LN, 'MANH-B') < 1150) throw new Error('số đo thác nước component đổi');
if (!O('chu').includes('// instant') || !O('chu').includes('// streams in later') || !O('chu').includes('jsx-no-comment-textnodes')) throw new Error('số đo chú thích JSX đổi');
const LOGL = doan('long', 'log API').map((l) => l.trim());
const HIDDEN = doan('manh', 'mẩu cuối')[0];
const TPL = doan('manh', 'template id')[0];
const dong = (ds) => ds.map((m) => `+${String(m.ms).padStart(4)} ms  #${m.so} ${String(m.b).padStart(5)} B${m.co.length ? '  ' + m.co.join(', ') : ''}`).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.4', t: 'Streaming: loading.tsx,<br>Suspense and the waterfall', sub: 'Do not make the whole page wait for the slowest query. Measured chunk by chunk: what arrives, when, and what the user actually sees',
    en: 'Lesson ten point four: streaming. Do not make the whole page wait for the slowest query. We read the HTML chunk by chunk as the server sends it: what arrives, when, and what the user actually sees.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The problem, measured: one slow query and the first byte waits for it</li>
    <li><code>loading.tsx</code> — an instant skeleton for the whole route segment</li>
    <li><code>&lt;Suspense&gt;</code> — stream one slow piece, show the rest now</li>
    <li>How streaming is written into the HTML — and what users without JavaScript see</li>
    <li>Waterfalls between components: siblings vs nested boundaries — plus a bug in the lesson's code</li></ul>`,
    en: 'Five takeaways: the problem, measured — one slow query holds the first byte; loading dot tsx, an instant skeleton for a whole segment; Suspense, streaming one slow piece; how streaming is written into the HTML and what users without JavaScript see; and waterfalls between components, plus a bug in the lesson\'s own code.' },
  { t: 'The problem: the first byte waits for the slowest query', body: two(D(tsx(bo(F('src/app/st/du-lieu.tsx')).split('\n').filter((l) => /lay\('|function|return/.test(l)).slice(0, 7).join('\n').replace("(await fetch('http://127.0.0.1:19385' + p, { cache: 'no-store' })).json()", 'fetchJson(p)').replace(/ className="[^"]*"/g, ''), { sm: true }),
      tsx(bo(F('src/app/st/khong/page.tsx')).split('\n').slice(3).join('\n').replace(/ className="[^"]*"/g, ''), { sm: true, hl: [5, 6] })),
    D(tn('$ node luong.mjs localhost:3000/st/khong TIEU-DE BIEU-DO\n' + dong(KH), { fs: 15, title: 'chunks as they arrive (real)' }),
      box('Nothing for 0.9 s', `Header needs 20 ms, the chart 900 ms. With no boundary the server sends <b>nothing</b> until both are done: first byte at <b>${KH0} ms</b> (curl), the whole page in one go. The 20 ms header waited for the 900 ms chart.`, 'do2')), 'r64'),
    en: 'The problem. The header needs twenty milliseconds of data, the revenue chart nine hundred. With no boundary, the server sends nothing until both are done: we read the HTML chunk by chunk, and the first chunk arrives at about nine hundred forty milliseconds, carrying everything. The twenty millisecond header waited for the chart.' },
  { t: 'Lever 1 · loading.tsx: a skeleton for the whole segment', body: two(D(tsx(bo(F('src/app/st/ca-trang/loading.tsx')).replace('">⏳', '">\n    ⏳'), { sm: true, hl: [2, 3] }),
      tn('$ node luong.mjs …/st/ca-trang LOADING TIEU-DE BIEU-DO\n' + dong(CT), { fs: 15, title: 'chunks (real)' })),
    D(B('ca-trang-300', { vp: 640, h: 90, w: 520, url: 'at 300 ms — what the user sees' }), B('ca-trang', { vp: 640, h: 90, w: 520, url: `after ${luc(CT, 'BIEU-DO')} ms — all at once` }),
      box('Instant — but coarse', `The skeleton arrives at <b>${luc(CT, 'LOADING')} ms</b>. The header\'s data is already in the stream at ${luc(CT, 'TIEU-DE')} ms — yet at 300 ms the screen shows <b>only the skeleton</b>: the whole segment is one boundary, so it swaps in at once, at ${luc(CT, 'BIEU-DO')} ms.`, 'cam')), 'r46'),
    en: 'Lever one: loading dot tsx next to the page. Next.js wraps the page in a Suspense boundary and sends the skeleton immediately — at thirty-five milliseconds. Notice: the header\'s data is already in the stream at fifty-two milliseconds, yet a screenshot at three hundred shows only the skeleton. The whole segment is one boundary, so it swaps in all at once at nine hundred thirty-four.' },
  { t: 'Lever 2 · <Suspense> around the slow piece only', body: two(D(tsx(bo(F('src/app/st/mot-manh/page.tsx')).split('\n').slice(4).join('\n'), { sm: true, hl: [6, 7, 8] }),
      tn('$ node luong.mjs …/st/mot-manh TIEU-DE DANG-TAI BIEU-DO\n' + dong(MM), { fs: 15, title: 'chunks (real)' })),
    D(B('mot-manh-300', { vp: 640, h: 70, w: 520, url: 'at 300 ms — header + fallback' }), B('mot-manh', { vp: 640, h: 70, w: 520, url: `after ${luc(MM, 'BIEU-DO')} ms — the chart streamed in` }),
      box('The rest shows now', `First chunk at <b>${luc(MM, 'TIEU-DE')} ms</b> already has the header <i>and</i> the spinner. The chart streams in at ${luc(MM, 'BIEU-DO')} ms — same total, much earlier first paint.`, 'xanh')), ''),
    en: 'Lever two: wrap only the slow component in Suspense with a fallback. The first chunk, at fifty-five milliseconds, already carries the header and the spinner; the chart streams into place at about nine hundred thirty. The total time is the same — the first paint is much earlier.' },
  { t: 'Side by side: first byte, first content, done', body: gantt([
      ['no boundary — first byte', 0, KH0, '#b91c1c', `${KH0} ms: everything at once`],
      ['loading.tsx — skeleton', 0, Math.max(CT0, 8), '#c2410c', `${CT0} ms`], ['loading.tsx — header visible', 0, luc(CT, 'BIEU-DO'), '#fdba74', `${luc(CT, 'BIEU-DO')} ms`],
      ['Suspense — header + spinner', 0, Math.max(MM0, 8), '#1f8a3b', `${MM0} ms`], ['Suspense — chart', 0, luc(MM, 'BIEU-DO'), '#86efac', `${luc(MM, 'BIEU-DO')} ms`],
    ], { w: 1110, rh: 50, nhan: 330, buoc: 100, max: 1000 }) +
    two(box('Same total', `All three finish at about <b>${KH1} ms</b> — streaming does not make the query faster.`, 'lam'),
      box('Different first paint', 'What changes is <b>when the user sees something useful</b>. Measure time to first contentful paint, not total load time.', 'xanh'), ''),
    en: 'Side by side. All three pages finish at about nine hundred milliseconds — streaming does not make the query faster. What changes is when the user sees something useful: nothing for nine hundred milliseconds; a skeleton at seven milliseconds but the header only at the end; or the header with a spinner at thirty milliseconds. Measure the first useful paint, not the total.' },
  { t: 'How streaming is written into the HTML', body: tn('# chunk 1 — the fallback, marked with an empty template:\n' + TPL + '\n# last chunk — the real content, hidden, then a tiny script swaps it in:\n' + HIDDEN + '\n…$RC("B:0","S:0")', { fs: 15, title: 'curl /st/mot-manh (real)' }) +
    two(steps([
      'The shell + <code>&lt;template id="B:0"&gt;</code> + the fallback go out first',
      'The connection stays open while the slow component awaits',
      'Its HTML arrives later inside <code>&lt;div hidden id="S:0"&gt;</code>',
      'Inline script <code>$RC("B:0","S:0")</code> moves it over the fallback',
    ]), box('One HTTP response', 'No extra request, no client fetch: it is the <b>same</b> response, still streaming. That is why <code>curl</code> sees everything — and why the swap needs JavaScript.', 'lam'), ''),
    en: 'How streaming is written into the HTML. The first chunk carries the shell, an empty template marked B zero, and the fallback. The connection stays open. The real content arrives later inside a hidden div marked S zero, followed by a tiny inline script, R C, that moves it over the fallback. It is one HTTP response, still streaming — no extra request.' },
  { t: 'Pitfall: JavaScript off ⇒ the fallback stays forever', body: two(D(B('mot-manh-tat-js', { vp: 640, h: 70, w: 540, url: 'JavaScript OFF — /st/mot-manh, fully loaded' }),
      box('Measured', 'With JavaScript disabled, the page loaded completely — and still shows <b>"đang tải biểu đồ…"</b>. The chart <i>is</i> in the HTML (hidden), but the swap script never runs.', 'do2')),
    D(cmp(['Client', 'Sees the streamed part?'], [
      ['normal browser', '✓ swapped in by <code>$RC</code>'],
      ['JS disabled / blocked', '✗ fallback forever'],
      ['curl, a text scraper', '✓ the text is in the HTML (hidden div)'],
    ]), box('So', 'Content that must be visible without JavaScript — the main article of a page — should not sit behind a Suspense boundary. Stream the extras: charts, recommendations, comments.', 'lam')), ''),
    en: 'A pitfall: with JavaScript turned off, the fully loaded page still shows the spinner. The chart is in the HTML, hidden, but the swap script never runs. A text scraper still finds the words. So content that must be visible without JavaScript — the main article — should not sit behind a Suspense boundary; stream the extras.' },
  { t: 'The lesson\'s own code, run as written', body: two(D(tsx(F('src/app/st/bai/page.tsx').split('\n').slice(5).join('\n'), { sm: true, hl: [5, 7] })),
    D(B('bai', { vp: 640, h: 80, w: 520, url: 'localhost:3000/st/bai' }),
      box('// inside JSX is text', 'Between tags, both <code>//</code> lines are <b>text</b>: they show on the page (the second streams in with the chart). <code>tsc</code> and <code>next build</code> stay green; only ESLint says so. <b>Fix:</b> <code>{/* instant */}</code>.', 'do2')), '') +
    tn('$ curl -s …/st/bai\n' + doan('chu', '</h1>').join('\n') + '\n' + doan('chu', 'template id="P:1"').join('\n') + '\n$ npx eslint page.tsx\n' + doan('chu', 'eslint').map((l) => l.replace(/\s+react\/jsx-no-comment-textnodes$/, '  (jsx-no-comment-textnodes)')).join('\n'), { fs: 14, title: 'curl + eslint (real)' }),
    en: 'The lesson\'s own code, run as written. Between JSX tags, double-slash instant and double-slash streams in later are text, not comments — both appear on the page, the second one streaming in with the chart. tsc and next build stay green; only ESLint complains. Write the comment inside braces instead.' },
  { t: 'Waterfalls between components: siblings vs nested', body: two(D(tsx(bo(F('src/app/st/canh-nhau/page.tsx')).split('\n').slice(-6).join('\n'), { sm: true, hl: [3, 4] }),
      tsx(bo(F('src/app/st/long-nhau/page.tsx')).split('\n').slice(5, 12).join('\n'), { sm: true, hl: [2, 6] })),
    D(gantt([
      ['siblings: A', 0, luc(CN, 'MANH-A'), '#1f8a3b', `${luc(CN, 'MANH-A')} ms`], ['siblings: B', 0, luc(CN, 'MANH-B'), '#1f8a3b', `${luc(CN, 'MANH-B')} ms`],
      ['nested: A', 0, luc(LN, 'MANH-A'), '#c2410c', `${luc(LN, 'MANH-A')} ms`], ['nested: B (inside A)', luc(LN, 'MANH-A'), luc(LN, 'MANH-B'), '#b91c1c', `${luc(LN, 'MANH-B')} ms`],
    ], { w: 540, nhan: 180, rh: 38, fs: 15, buoc: 300, max: 1300 }),
      tn(LOGL.join('\n'), { fs: 14, title: 'API log (real) — when each query started' }),
      box('Independent — unless nested', 'Siblings start together: both ~600 ms. B <i>inside</i> A starts after A\'s data: ~1.2 s. Start independent work together (10.1).', 'lam')), ''),
    en: 'Waterfalls also happen between components. Two sibling boundaries, each fetching for six hundred milliseconds: the API log shows both queries starting at the same millisecond, and both pieces arrive at about six hundred thirty. Put B inside A, and B only starts after A has its data: one point two seconds. Same lesson as ten point one — start independent work together.' },
  { t: 'Where to put the boundaries', body: steps([
      '<b>The shell goes out first</b> — header, nav, layout: everything that does not wait on data, in milliseconds',
      '<b>One slow widget ⇒ one <code>&lt;Suspense&gt;</code></b> around just that widget, with a fallback the same size (no layout jump)',
      '<b><code>loading.tsx</code> is a boundary for the whole segment</b> — good for navigation between pages, too coarse when one widget is slow',
      '<b>Independent widgets ⇒ sibling boundaries</b>, not nested: three widgets, three arrival times, nothing waits for the slowest',
      '<b>Must-see content</b> (the article, the price) stays outside boundaries — it should not depend on JavaScript',
    ]),
    en: 'Where to put the boundaries. The shell goes out first. One slow widget gets one Suspense around just that widget, with a fallback of the same size. loading dot tsx is a boundary for the whole segment — good for navigation, too coarse for one slow widget. Independent widgets get sibling boundaries, not nested ones. And must-see content stays outside boundaries.' },
  { t: 'Cheat sheet', body: cmp(['Page', 'First byte', 'User sees first', 'Done'], [
      ['no boundary', `${KH0} ms`, 'everything, at once', `${KH1} ms`],
      ['<code>loading.tsx</code>', `${CT0} ms`, 'the skeleton (header only at the end)', `${CT1} ms`],
      ['<code>&lt;Suspense&gt;</code> around the chart', `${MM0} ms`, 'header + spinner', `${MM1} ms`],
      ['two sibling boundaries (600 ms each)', '—', 'both at ~' + luc(CN, 'MANH-B') + ' ms', '—'],
      ['nested boundaries (600 ms each)', '—', `A ${luc(LN, 'MANH-A')} ms, B ${luc(LN, 'MANH-B')} ms`, '—'],
    ], { hl: [2] }),
    en: 'The cheat sheet: no boundary — first byte at nine hundred milliseconds; loading dot tsx — a skeleton in seven milliseconds but the header only at the end; Suspense around the chart — the header and a spinner in thirty milliseconds. Sibling boundaries arrive together; nested ones add up.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Streaming', 'one response, sent in pieces as they become ready'), kw('loading.tsx', 'a Suspense boundary for the whole route segment'),
      kw('Suspense', 'a boundary: show the fallback until its children are ready'), kw('Fallback', 'what shows meanwhile (spinner, skeleton)'),
      kw('Shell', 'the part of the page that does not wait for data'), kw('$RC / hidden div', 'how the streamed HTML is swapped in — needs JS'),
      kw('Waterfall', 'work that starts only after other work finished'), kw('First contentful paint', 'when the user first sees something useful'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: streaming; loading dot tsx; Suspense; fallback; shell; the hidden div and the swap script; waterfall; and first contentful paint.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Make one fast and one slow (≥ 800 ms) async component; render both with no boundary; time it with ${c('curl -w "%{time_starttransfer}"')}`,
      `Add ${c('loading.tsx')}; then move the slow one into ${c('<Suspense>')}: compare first byte and what shows at 300 ms`,
      `Turn JavaScript off: which text stays on screen?`,
      `Nest one boundary inside another, then make them siblings: time both`,
    ]), box('Keep these', `<ul><li>Streaming changes <b>first paint</b>, not total time</li><li><code>loading.tsx</code> = whole segment · <code>Suspense</code> = one piece</li><li>Siblings in parallel, nested in series</li><li>Must-see content outside boundaries</li><li><code>//</code> between JSX tags is text</li></ul>`, 'lam'), ''),
    en: 'Your turn: make one fast and one slow component, render both with no boundary and time the first byte; add loading dot tsx, then move the slow one into Suspense and compare; turn JavaScript off; and nest one boundary inside another, then make them siblings. Keep: streaming changes first paint, not total time; loading is the whole segment, Suspense one piece; siblings run in parallel, nested in series; must-see content stays outside boundaries.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Data fetching, caching and revalidating', bai: '10.4' }, S);
