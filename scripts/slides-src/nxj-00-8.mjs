/**
 * nxj-00-8 — Next.js · Section 0 · Start here (1/2) "What Next.js is, and why it is worth your time" (deck video + web, 13/11/2026).
 * Bài web: nextjs-0-0-bat-dau-1. Output THẬT (scratchpad/nxj/demo/n0-8.txt · Next.js 16.4.6 · Vite 8.3.8 · Node 22.23.3, Mac):
 * cùng một giỏ hàng dựng hai cách — React một mình (Vite, SPA) vs Next.js. curl: SPA trả 379 byte HTML, <div id="root"></div> rỗng;
 * Next trả 7.228 byte HTML có sẵn tiêu đề + 3 món + tổng 1.360.000 đ. Tắt JavaScript (Playwright): SPA trắng, Next đủ giỏ hàng.
 * JavaScript tải về (Playwright, chưa nén): SPA 1 tệp 220.005 B; Next 5 tệp 457.070 B. npm: next 1.0.0 = 2016-10-25 … 16.4.6 = 2026-11-09;
 * lượt tải tuần 05–11/11/2026: next 91.355.769, react 252.219.874. cuongthai.com: x-powered-by: Next.js, vary: RSC…, x-nextjs-cache: HIT.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-8:file:src/App.tsx": "const MON = [\n  { ten: 'Bàn phím cơ', gia: 890000 },\n  { ten: 'Chuột không dây', gia: 350000 },\n  { ten: 'Lót chuột', gia: 120000 },\n];\n\nexport default function App() {\n  const tong = MON.reduce((s, m) => s + m.gia, 0);\n  return (\n    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>\n      <h1>Giỏ hàng của An</h1>\n      <ul>\n        {MON.map((m) => <li key={m.ten}>{m.ten} — {m.gia.toLocaleString('vi-VN')} đ</li>)}\n      </ul>\n      <p>Tổng: <b>{tong.toLocaleString('vi-VN')} đ</b></p>\n    </main>\n  );\n}\n",
 "n0-8:spa-tao": "$ npm create vite@latest spa -- --template react-ts --no-interactive\n\n> npx\n> 'cva' spa --template react-ts --no-interactive\n\n\ncreate-vite v9.3.4\n\n│\n◇  Scaffolding project in /Users/admin/.rtq-nxj/lab/spa...\n│\n└  Done. Now run:\n\n  cd spa\n  npm install\n  npm run dev\n\nnpm warn exec The following package was not found and will be installed: create-vite@9.3.4\n$ npm install --no-audit --no-fund\n\nadded 28 packages in 10s\n$ npm run build\n\n> spa@0.0.0 build\n> tsc -b && vite build\n\nvite v8.3.8 building client environment for production...\ntransforming...\n✓ 15 modules transformed.\nrendering chunks...\ncomputing gzip size...\ndist/index.html                  0.37 kB │ gzip:  0.26 kB\ndist/assets/index-C5OXsyV8.js  220.00 kB │ gzip: 68.89 kB\n\n✓ built in 73ms",
 "n0-8:file:src/app/page.tsx": "const MON = [\n  { ten: 'Bàn phím cơ', gia: 890000 },\n  { ten: 'Chuột không dây', gia: 350000 },\n  { ten: 'Lót chuột', gia: 120000 },\n];\n\nexport default function Page() {\n  const tong = MON.reduce((s, m) => s + m.gia, 0);\n  return (\n    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>\n      <h1>Giỏ hàng của An</h1>\n      <ul>\n        {MON.map((m) => <li key={m.ten}>{m.ten} — {m.gia.toLocaleString('vi-VN')} đ</li>)}\n      </ul>\n      <p>Tổng: <b>{tong.toLocaleString('vi-VN')} đ</b></p>\n    </main>\n  );\n}\n",
 "n0-8:next-tao": "$ npm run build\n\n> my-app@0.1.0 build\n> next build\n\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 1053ms\n\n  Creating an optimized production build ...\n✓ Compiled successfully in 1948ms\n  Running TypeScript ...\n  Finished TypeScript in 935ms ...\n  Collecting page data using 5 workers ...\n  Generating static pages using 5 workers (0/4) ...\n  Generating static pages using 5 workers (1/4) \n  Generating static pages using 5 workers (2/4) \n  Generating static pages using 5 workers (3/4) \n✓ Generating static pages using 5 workers (4/4) in 263ms\n  Finalizing page optimization ...\n\nRoute (app)\n┌ ○ /\n└ ○ /_not-found\n\n\n○  (Static)  prerendered as static content",
 "n0-8:chay": "",
 "n0-8:seo": "$ curl -s localhost:19301/          # React một mình (Vite, SPA)\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>spa</title>\n    <script type=\"module\" crossorigin src=\"/assets/index-C5OXsyV8.js\"></script>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>\n$ curl -s localhost:19300/ | grep -o '<h1>.*</p>'   # Next.js\n<h1>Giỏ hàng của An</h1><ul><li>Bàn phím cơ — 890.000 đ</li><li>Chuột không dây — 350.000 đ</li><li>Lót chuột — 120.000 đ</li></ul><p>Tổng: <b>1.360.000 đ</b></p>",
 "n0-8:kichthuoc": "$ curl -s localhost:19301/ | wc -c ; curl -s localhost:19300/ | wc -c\n     379\n    7228",
 "n0-8:lich-su": "$ npm view next time --json | grep -E '\"(1\\.0\\.0|9\\.0\\.0|13\\.0\\.0|13\\.4\\.0|15\\.0\\.0|16\\.0\\.0|16\\.4\\.6)\"'\n  \"1.0.0\": \"2016-10-25T15:11:17.819Z\",\n  \"9.0.0\": \"2019-07-08T06:52:28.593Z\",\n  \"13.0.0\": \"2022-10-25T17:31:20.550Z\",\n  \"13.4.0\": \"2023-05-04T16:47:51.733Z\",\n  \"15.0.0\": \"2024-10-21T18:22:34.996Z\",\n  \"16.0.0\": \"2025-10-22T00:12:16.323Z\",\n  \"16.4.6\": \"2026-11-09T20:33:38.821Z\",\n$ npm view next version; npm view react version\n16.4.6\n19.3.1\n$ curl -s https://api.npmjs.org/downloads/point/last-week/next; echo; curl -s https://api.npmjs.org/downloads/point/last-week/react; echo\n{\"downloads\":91355769,\"start\":\"2026-11-05\",\"end\":\"2026-11-11\",\"package\":\"next\"}\n{\"downloads\":252219874,\"start\":\"2026-11-05\",\"end\":\"2026-11-11\",\"package\":\"react\"}",
 "n0-8:site": "$ curl -sI https://cuongthai.com/ | grep -iE '^(x-powered-by|x-nextjs-cache|vary: RSC)'\nx-powered-by: Next.js\nvary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding\nx-nextjs-cache: HIT\n$ curl -s https://cuongthai.com/ | grep -o '/_next/static/chunks/[^\"]*' | head -3\n/_next/static/chunks/webpack-f59aea0bce86c253.js\n/_next/static/chunks/fd9d1056-250704da4e021f2b.js\n/_next/static/chunks/396464d2-3e1d1a49ed228d8a.js",
 "n0-8:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, js, tn, br, icards, cmp, box, two, steps, kw, c, seq, hub, meter, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-00-8', code: 'NXJ 0.8', title: 'Start here (1/2) — What Next.js is, and why it is worth your time', sub: 'Section 0 · Start here (1/2)' };
const O = (k) => { const v = DU_LIEU[`n0-8:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-00-8', ten, { vp: 640, ...o });

/** Dòng thời gian (mốc lấy từ `npm view next time` — trừ React 2013, mốc công khai của chính React). */
const dongTG = () => {
  const W = 1110, y = 120, ds = [
    ['May 2013', 'React open-sourced', '(JSConf US)', '#087ea4'], ['25 Oct 2016', 'next 1.0.0', 'on npm', '#111827'], ['25 Oct 2022', 'next 13.0.0', 'App Router (beta)', '#111827'],
    ['4 May 2023', 'next 13.4.0', 'App Router stable', '#0070f3'], ['21 Oct 2024', 'next 15.0.0', 'fetch not cached', '#111827'], ['22 Oct 2025', 'next 16.0.0', 'Turbopack default', '#111827'],
    ['9 Nov 2026', 'next 16.4.6', 'this course', '#e0590b'],
  ];
  const x0 = 110, dx = (W - 220) / (ds.length - 1);
  let s = `<svg viewBox="0 0 ${W} 250" width="${W}" height="250" font-family="Arial"><line x1="30" y1="${y}" x2="${W - 30}" y2="${y}" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>`;
  ds.forEach(([d, t, sub, m], i) => {
    const x = x0 + i * dx, tren = i % 2 === 0;
    s += `<circle cx="${x}" cy="${y}" r="13" fill="${m}"/><line x1="${x}" y1="${tren ? y - 14 : y + 14}" x2="${x}" y2="${tren ? y - 40 : y + 40}" stroke="${m}" stroke-width="2.5"/>`;
    const ty = tren ? y - 92 : y + 62;
    s += `<text x="${x}" y="${ty}" text-anchor="middle" font-size="17" fill="#64748b" font-weight="700">${d}</text>`;
    s += `<text x="${x}" y="${ty + 23}" text-anchor="middle" font-size="19" fill="${m}" font-weight="800">${t}</text>`;
    s += `<text x="${x}" y="${ty + 44}" text-anchor="middle" font-size="16" fill="#334155">${sub}</text>`;
  });
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (1/2)', t: 'What Next.js is,<br>and why it is worth your time', sub: 'One picture before any code: the problem, the pieces, a checked history, and a reason to finish the course',
    en: 'Start here, part one. Before any code, one picture: what problem Next.js solves, the pieces it adds on top of React, a short history checked against npm, and why it is worth your time.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The hard part of a web app: keeping the screen in sync with the data</li>
    <li>Why React alone is not enough — measured with <code>curl</code> and a browser</li>
    <li>The five pieces Next.js adds, and where each lives in this course</li>
    <li>A short history, checked against the npm registry</li>
    <li>Library vs framework — the most common confusion</li>
    <li>Why it is worth your time — and proof this site runs on it</li></ul>`,
    en: 'Six takeaways: the sync problem; why React alone is not enough, measured; the five pieces Next adds; a history checked against npm; library versus framework; and why it is worth your time, with proof that this very site runs on Next.' },
  { t: 'The hard part: keeping the screen in sync with the data', body: vsd(js(`// old way: change data, then patch EVERY place
cart.push(item);
$('#badge').text(cart.length);
$('#list').append(makeLi(item));
// forgot one: #total shows the old sum`, { sm: true, hl: [5] }),
    tsx(`// React: describe the UI for the current data
function Cart({ items }) {
  const total = items.reduce((s, m) => s + m.price, 0);
  return (
    <>
      <Badge count={items.length} />
      <List items={items} />
      <Total value={total} />
    </>
  );
}`, { sm: true, hl: [2] }), '✗ Imperative — find and patch', '✓ Declarative — UI = f(data)') +
    box('React (Facebook 2011 → open-sourced May 2013)', 'You change the data; React works out which parts of the page to update. Three places can never disagree again, because all three are drawn from the same data.', 'lam'),
    en: 'The hard part of a web app is keeping the screen in sync with the data. The old way: change the data, then find and patch every place by hand — and on a busy page you forget one. React flips it: you describe the UI for the current data, and React updates the page. Built at Facebook in 2011, open-sourced in May 2013.' },
  { t: 'React alone runs in the browser — the server sends an empty page', body: seq(['Browser', 'Server (Vite build)'], [
      [0, 1, 'GET /'], [1, 0, '379 bytes of HTML — root is EMPTY', '#c0392b'],
      [0, 1, 'GET /assets/index-….js'], [1, 0, '220 KB of JavaScript', '#2563eb'], [0, 0, 'run the JS → build the page → now you see it', '#1f8a3b']], { w: 1110, rh: 32, fs: 16, top: 52 }) +
    two(tn((() => { const l = O('seo').split('\n'); return [l[0].replace(/ +#.*/, ''), '…', l[8], l[10], l[11], l[12], '…'].join('\n'); })(), { fs: 14, wrap: 70 }),
      box('SPA — single-page application', 'The HTML is a shell: nothing appears until the JavaScript has downloaded and run.', 'do2'), 'r64'),
    en: 'React alone runs entirely in the browser. This is the real curl output of a Vite React app: three hundred seventy nine bytes of HTML, and the body is one empty div called root. The browser must download two hundred twenty kilobytes of JavaScript and run it before anything appears. That is a single page application, an SPA.' },
  { t: 'What a search engine sees: JavaScript OFF, same shopping cart', body: two(
      `<div><div class="cap" style="font-weight:700;color:#c0392b">React alone (Vite SPA) — blank</div>${B('spa-tat-js', { url: 'localhost:19301 · JS off', h: 250, w: 540 })}</div>`,
      `<div><div class="cap" style="font-weight:700;color:#1f8a3b">Next.js — the cart is already in the HTML</div>${B('next-tat-js', { url: 'localhost:19300 · JS off', h: 250, w: 540, mark: [[34, 56, 290, 158, "in the HTML already"]] })}</div>`) +
    tn(O('seo').split('\n').slice(15).join('\n'), { fs: 15 }),
    en: 'The same cart, built twice, opened with JavaScript turned off — roughly what some crawlers and link previews see. The SPA is blank. The Next.js page shows the heading, three items and the total, because the server rendered the HTML: the real curl output below has every item in it.' },
  { t: 'Honest numbers: the content arrives early — the JavaScript still comes', body: meter([
      ['HTML — Vite SPA', 379, '#c0392b', 'empty root'], ['HTML — Next.js', 7228, '#1f8a3b', 'cart inside'],
      ['JavaScript — Vite SPA', 220005, '#c0392b', '1 file'], ['JavaScript — Next.js', 457070, '#111827', '5 files'],
    ], { don: 'bytes', log: true, nhan: 300 }) +
    two(box('Next.js wins the FIRST paint', 'The HTML already holds the content, so the user (and a crawler) sees the cart before any JavaScript runs.', 'xanh'),
      box('…but it still ships React', 'Uncompressed, measured in a real browser: 457 KB in 5 files to make the page interactive (hydration). Chapters 9 and 18 cut this down.', 'cam')),
    en: 'Honest numbers from the real browser. The Next.js HTML is seven thousand bytes because the cart is inside it; the SPA HTML is three hundred seventy nine bytes. But Next.js still downloads JavaScript — four hundred fifty seven kilobytes in five files, uncompressed, versus two hundred twenty for Vite — to make the page interactive. Next wins the first paint, not the byte count; chapters nine and eighteen are about cutting that JavaScript down.' },
  { t: 'Next.js wraps React with five pieces — one per stage of this course', body: hub('Next.js\n(React inside)', [
      ['code', 'React: components, state, hooks', 'Chapters 1–7'], ['map', 'Routing by folders', 'Chapter 8 (+11)'],
      ['server', 'Rendering on the server', 'Chapter 9'], ['db', 'Data & mutations', 'Chapters 10–12'],
      ['box', 'Build & deploy', 'Chapters 17–20'], ['layers', 'Real app: style, auth', 'Chapters 13–16'],
    ], { h: 360 }),
    en: 'Next.js wraps React with a server, folder-based routing and a build system. Each piece is a stage of the course: React itself in chapters one to seven, routing in chapter eight, server rendering in chapter nine, data and mutations in ten to twelve, a real app with styling, state and auth in thirteen to sixteen, and build and deploy in seventeen to twenty.' },
  { t: 'A short history — checked against the npm registry', body: dongTG() + two(tn(O('lich-su').split('\n').slice(0, 8).join('\n'), { fs: 14, wrap: 70 }),
    box('Next.js is from 2016, not 2015', 'ZEIT (renamed Vercel in 2020) was founded in 2015; the first <code>next</code> release on npm is 1.0.0 on 25 October 2016.', 'lam'), 'r64'),
    en: 'A short history, checked against npm itself. React was open-sourced in May 2013. Next.js one point oh landed on npm on the twenty fifth of October two thousand sixteen — the company, ZEIT, now Vercel, dates from twenty fifteen. Next thirteen brought the App Router in October twenty twenty two, stable from thirteen point four in May twenty twenty three. Next fifteen came in October twenty twenty four, Next sixteen in October twenty twenty five, and this course runs on sixteen point four point six.' },
  { t: 'Library vs framework — the most common confusion', body: cmp(['', 'React', 'Next.js'], [
      ['What it is', 'a <b>library</b> — code you call', 'a <b>framework</b> — it calls your code'],
      ['Answers', '"for this data, what does the UI look like?"', 'routing, server, data, build, deploy'],
      ['Who decides the structure', 'you (and every team re-invents it)', 'the framework: <code>app/blog/page.tsx</code> = <code>/blog</code>'],
      ['Runs', 'in the browser (or wherever you render it)', 'on the server AND in the browser'],
      ['Your React knowledge', '—', 'still 100% true inside Next.js'],
    ], { hl: [4] }) +
    box('Not competitors', '"React or Next.js?" is the wrong question. Every component, prop, state and hook you write in Next.js is React. Next.js changes WHERE and WHEN it runs, not WHAT it is.', 'xanh'),
    en: 'Library versus framework. React is a library: code you call to answer one question, what the UI looks like for this data. Next.js is a framework: it sets the structure and calls your code — put a file in the right folder and it becomes a route. They are not competitors: everything you write in Next.js is still React; Next only changes where and when it runs.' },
  { t: 'Why it is worth your time', body: meter([['next — downloads last week', 91355769, '#111827'], ['react — downloads last week', 252219874, '#087ea4']], { don: '', nhan: 300, w: 1110 }) +
    `<div class="cap">npm registry, one week: 5–11 Nov 2026 (api.npmjs.org/downloads/point/last-week)</div>` + icards([
      ['flag', 'Jobs', 'React and Next.js are among the most-requested frontend skills'],
      ['layers', 'Reach', 'dashboards, shops, admin panels, SaaS — anything with a screen'],
      ['loop', 'Transfer', 'the same React powers React Native for phones'],
      ['eye', 'Real', 'cuongthai.com itself is a Next.js App Router app'],
    ], 2), to: true, giua: true,
    en: 'Why it is worth your time. Last week npm served ninety one million downloads of next and two hundred fifty two million of react. Jobs: they are among the most requested frontend skills. Reach: dashboards, shops, admin panels, anything with a screen. Transfer: the same React powers React Native. And it is real: this very site runs on it.' },
  { t: 'This very site, cuongthai.com, is a Next.js app', body: two(B('cuongthai', { url: 'https://cuongthai.com', vp: 1280, h: 720, w: 560 }),
      tn(O('site').split('\n').slice(0, 6).join('\n') + '\n…', { fs: 13, wrap: 46 }), 'r64') +
    box('The course is a guided tour of it', 'Chapters 8–20 walk through how its pages render — including the outages and the fixes.', 'lam'),
    en: 'And this very site is a Next.js app. Ask the server with curl: x powered by Next.js; vary contains RSC, the trace of React Server Components; x nextjs cache says the page came from the cache; and the JavaScript lives under underscore next static. Chapters eight to twenty are a guided tour of how it renders, including the outages.' },
  { t: 'What "done" looks like — and the key terms', body: two(steps([
      'End of Stage 1 (Ch. 1–7): you build and reason about React components',
      'End of the course: you open a real App Router codebase and say WHY each page renders the way it does',
      'You need the mental model, not memorised APIs',
    ]), `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('React', 'turns data into UI'), kw('Next.js', 'a framework around React'), kw('Library vs framework', 'you call it vs it calls you'),
      kw('App Router', 'routing under app/'), kw('SSR', 'HTML rendered on the server'), kw('SEO', 'content a search engine can read'),
    ].join('')}</div>`, ''),
    en: 'What done looks like: by the end of stage one you build and reason about React components; by the end of the course you open a real App Router codebase and say why each page renders the way it does. You need the mental model, not memorised APIs. Key terms: React, Next.js, library versus framework, App Router, SSR and SEO.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'One sentence each: what React does, what Next.js adds',
      'Open a web app you use daily: one thing that must render on the server, one that must be interactive',
      `Optional: ${c('curl')} any site — is the content in the HTML?`,
      'Write down your reason for this course, somewhere visible',
    ]), box('Keep these', `<ul><li>React: data → UI, in sync</li><li>React alone = an empty HTML page</li><li>Next.js: routing, server, data, build</li><li>Mental model over memorised APIs</li></ul>`, 'lam'), ''),
    en: 'Your turn: one sentence each for React and Next.js; pick a web app you use and point to one thing that must render on the server and one that must be interactive; optionally curl a site and see whether the content is in the HTML; and write down your reason for this course. Keep: React keeps UI in sync with data; React alone sends an empty page; Next adds routing, server, data and build; aim for the mental model.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: 'Start here 1' }, S);
