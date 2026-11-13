/**
 * nxj-00-1 — Next.js · Section 0 · Lesson 0.1 "About this course & the map of the whole course" (deck video + web, 13/11/2026).
 * Bài web: nextjs-0-1-gioi-thieu. Output THẬT (scratchpad/nxj/demo/n0-1.txt · Next.js 16.4.6 · Node 22.23.3 · Chromium/Playwright):
 * trang có chữ dựng ở máy chủ + nút đếm 'use client': curl thấy <h1>, <p>, <button>Đã bấm: 0 lần</button> trong HTML; bấm 2 lần — bật JS ⇒ "2 lần",
 * TẮT JS ⇒ vẫn "0 lần" (HTML có, chưa hydrate). cuongthai.com: <h1 class="landing-hero-title">Learn it. có trong HTML (126.878 byte) nhưng TẮT JS
 * thì một màn tải che hết; bật JS tải 62 tệp script = 2.858.921 byte (chưa nén).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-1:file:src/app/dem.tsx": "'use client';\nimport { useState } from 'react';\n\nexport default function Dem() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>Đã bấm: {n} lần</button>;\n}\n",
 "n0-1:file:src/app/page.tsx": "import Dem from './dem';\n\nexport default function Page() {\n  return (\n    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>\n      <h1>Bài 0.1 — HTML dựng ở máy chủ</h1>\n      <p>Đoạn chữ này có sẵn trong HTML.</p>\n      <Dem />\n    </main>\n  );\n}\n",
 "n0-1:tao": "$ npm run build 2>&1 | tail -7\nRoute (app)\n┌ ○ /\n└ ○ /_not-found\n\n\n○  (Static)  prerendered as static content",
 "n0-1:chay": "$ curl -s localhost:19305/ | grep -o '<h1>.*</button>' | sed 's/<!-- -->//g'\n<h1>Bài 0.1 — HTML dựng ở máy chủ</h1><p>Đoạn chữ này có sẵn trong HTML.</p><button>Đã bấm: 0 lần</button>",
 "n0-1:dung": "",
 "n0-1:ct": "$ curl -s https://cuongthai.com/ | grep -o '<h1[^>]*>[^<]*'\n<h1 class=\"landing-hero-title\">Learn it.\n$ curl -s https://cuongthai.com/ | wc -c\n  126878"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, icards, cmp, box, two, steps, kw, c, vsd, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-00-1', code: 'NXJ 0.1', title: 'About this course & the map of the whole course', sub: 'Section 0 · Lesson 0.1' };
const O = (k) => { const v = DU_LIEU[`n0-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-00-1', ten, { vp: 640, ...o });

/** Bản đồ 5 giai đoạn × 20 chương (lưới thẻ). */
const banDo = () => {
  const GD = [
    ['1 · React foundations', '#087ea4', [[1, 'JSX & render'], [2, 'Components & props'], [3, 'State & re-render'], [4, 'Events & forms']]],
    ['2 · Thinking in React', '#0f766e', [[5, 'useEffect'], [6, 'Hooks toolbox'], [7, 'Lists, keys, perf']]],
    ['3 · Next.js App Router', '#0070f3', [[8, 'App Router'], [9, 'Server vs Client'], [10, 'Fetch & cache'], [11, 'Advanced routing'], [12, 'Server Actions']]],
    ['4 · A real app', '#7c3aed', [[13, 'Tailwind & theme'], [14, 'State: client/server'], [15, 'Auth & middleware'], [16, 'Forms & upload']]],
    ['5 · Production', '#e0590b', [[17, 'Rendering & SEO'], [18, 'Performance'], [19, 'Testing'], [20, 'Build & deploy']]],
  ];
  const W = 1110, cw = (W - 4 * 14) / 5;
  let s = `<svg viewBox="0 0 ${W} 420" width="${W}" height="420" font-family="Arial">`;
  GD.forEach(([ten, mau, ch], i) => {
    const x = i * (cw + 14);
    s += `<rect x="${x}" y="0" width="${cw}" height="56" rx="10" fill="${mau}"/><text x="${x + cw / 2}" y="35" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">${ten}</text>`;
    ch.forEach(([n, t], k) => {
      const y = 70 + k * 68;
      s += `<rect x="${x}" y="${y}" width="${cw}" height="58" rx="10" fill="${mau}14" stroke="${mau}" stroke-width="2"/>`;
      s += `<text x="${x + 14}" y="${y + 37}" font-size="22" font-weight="800" fill="${mau}">${n}</text><text x="${x + 46}" y="${y + 36}" font-size="16" font-weight="700" fill="#262626">${t}</text>`;
    });
    if (i < 4) s += `<text x="${x + cw + 1}" y="34" font-size="16" font-weight="800" fill="#94a3b8">›</text>`;
  });
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.1', t: 'About this course<br>&amp; the map of the whole course', sub: 'From zero to production: what you will build, why React exists, and five stages in the right order',
    en: 'Lesson zero point one: what this course is, what you will build, why React exists at all, and the map of the whole course — five stages, twenty chapters, in the right order.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What this course does that most tutorials do not</li>
    <li>What you will be able to build by the end</li>
    <li>Why React was invented, and what it replaced</li>
    <li>Server-rendered HTML vs an interactive page — seen in a real browser</li>
    <li>The map: 5 stages, 20 chapters, and why the order matters</li></ul>`,
    en: 'Five takeaways: how this course differs from most tutorials; what you will build; why React exists; server-rendered HTML versus an interactive page, seen in a real browser; and the map of five stages and twenty chapters.' },
  { t: 'Most tutorials stop at 5% of the job', body: cmp(['', 'A typical tutorial', 'This course'], [
      ['Fetching data', '"Use useEffect to fetch."', 'why it runs twice in dev, races itself, leaks on unmount — and why a Server Component needs no effect'],
      ['Rendering', '"Next.js has SSR, it is faster."', 'what REALLY runs on the server vs the browser; why <code>\'use client\'</code> is a boundary, not a file flag'],
      ['Deploying', '"Click deploy on Vercel."', 'a standalone build in Docker — and why this site once showed an endless spinner after a rebuild'],
    ], { hl: [1] }) + box('The other 95%', 'Whether your app survives real users and a real deploy. Every chapter ends with: what does this look like in an app that is actually running — cuongthai.com, outages included?', 'lam'),
    en: 'Most tutorials stop at useState and a to-do list — about five percent of the job. This course spends its time on the other ninety five: why a fetch in an effect runs twice and races itself; what really runs on the server; why use client is a boundary; and how a real deploy works, including this site\'s own outages.' },
  { t: 'What you will be able to build', body: icards([
      ['layers', 'A multi-page App Router app', 'nested layouts, loading and error states, dynamic routes'],
      ['server', 'Server-rendered, still interactive', 'fast first paint and real SEO, hydrated in the browser'],
      ['db', 'Data with cache and revalidate', 'and writes with Server Actions — no hand-written API route'],
      ['lock', 'Auth, forms, uploads', 'cookies and middleware, validated forms, files to object storage'],
      ['box', 'A themed Tailwind design system', 'accessible and fast — shipped in Docker to your own server'],
      ['gauge', 'Measured, tested, deployed', 'bundle analysis, Playwright tests, a build you trust'],
    ], 2),
    en: 'What you will build: a multi-page App Router app with nested layouts and loading and error states; pages rendered on the server yet interactive; data with cache and revalidate, and writes with Server Actions; auth, validated forms and uploads; a themed Tailwind design system; and a measured, tested build shipped in Docker to your own server.' },
  { t: 'Why does React exist? What did it replace?', body: vsd(`<ul><li>2000s: the page HTML and its data kept in sync <b>by hand</b> — jQuery or raw DOM calls</li><li>Hundreds of moving parts ⇒ someone forgets one spot</li><li>The screen drifts away from the data; bugs multiply</li><li>Tools: jQuery, Backbone, AngularJS 1 — "keep it in sync yourself"</li></ul>`,
      `<ul><li>Facebook, 2011: <b>describe</b> what the UI should look like for the current data</li><li>React updates the DOM for you</li><li>Open-sourced May 2013</li><li>Next.js (first npm release Oct 2016) then wraps React with a server, routing and a build</li></ul>`,
      '✗ Before: patch the DOM by hand', '✓ React: UI = f(data)'),
    en: 'Why React exists. In the two thousands, a page\'s data and its HTML were kept in sync by hand with jQuery or raw DOM calls; with hundreds of moving parts, someone forgets a spot and the screen drifts from the data. React, from Facebook in two thousand eleven, flipped it: describe the UI for the current data and React updates the DOM. Next.js, first released in October two thousand sixteen, then wraps React with a server, routing and a build.' },
  { t: 'Server-rendered HTML vs an interactive page — in a real browser', body: two(
      `<div><div class="cap" style="font-weight:700;color:#1f8a3b">JavaScript ON — clicked twice ⇒ 2</div>${B('dem-js', { url: 'localhost:19305 · JS on', h: 190, w: 540, mark: [[36, 150, 108, 29, '']] })}</div>`,
      `<div><div class="cap" style="font-weight:700;color:#c0392b">JavaScript OFF — clicked twice ⇒ still 0</div>${B('dem-tat-js', { url: 'localhost:19305 · JS off', h: 190, w: 540, mark: [[36, 150, 108, 29, '']] })}</div>`) +
    tn(O('chay'), { fs: 14, wrap: 110 }) +
    box('Hydration', 'The server sent HTML with the text AND the button. The browser then attaches the click handler — that step is hydration. Without JavaScript the button is only a drawing.', 'lam'),
    en: 'Server-rendered HTML versus an interactive page, in a real browser. The curl shows the heading, the paragraph and the button already in the HTML. Clicked twice with JavaScript on: two. With JavaScript off: still zero — the button is there, but nobody attached its click handler. Attaching it in the browser is called hydration.' },
  { t: 'Practice preview: what does cuongthai.com render on the server?', body: two(
      `<div><div class="cap" style="font-weight:700">JavaScript ON</div>${B('ct-js', { url: 'https://cuongthai.com', vp: 1280, h: 580, w: 500 })}</div>`,
      `<div><div class="cap" style="font-weight:700">JavaScript OFF — a splash covers the page</div>${B('ct-tat-js', { url: 'https://cuongthai.com · JS off', vp: 1280, h: 580, w: 500 })}</div>`) +
    two(tn(O('ct'), { fs: 14, wrap: 60 }), meter([['HTML (with the headline)', 126878, '#1f8a3b'], ['JavaScript, 62 files', 2858921, '#111827']], { don: 'B', nhan: 220, w: 520, log: true }), ''),
    en: 'A preview of the practice task, on this very site. The headline Learn it is in the HTML — curl finds it in the hundred twenty six kilobytes. But with JavaScript off, a splash screen covers everything, and with JavaScript on the browser downloads sixty two script files, almost three megabytes uncompressed. Server rendered does not automatically mean visible without JavaScript — chapters nine and eighteen are about these trade-offs.' },
  { t: 'Where you actually use this at work', body: icards([
      ['flag', 'The job market', '"React developer" and "Next.js" are among the most-requested frontend skills'],
      ['layers', 'What you build', 'dashboards, social apps, e-commerce, admin panels, marketing sites, SaaS'],
      ['loop', 'It transfers', 'React Native uses the same components and hooks: web and phone'],
      ['eye', 'This very site', 'cuongthai.com is a Next.js + React frontend — the course is a tour of it'],
    ], 2), to: true,
    en: 'Where you use this at work: the job market asks for React and Next.js; you build dashboards, shops, admin panels and SaaS; it transfers to mobile through React Native; and this very site is a Next.js frontend, so the course doubles as a tour of it.' },
  { t: 'The map — 5 stages, 20 chapters', body: banDo() +
    box('Do not skip ahead', 'Chapter 9 needs Chapter 3 (state &amp; re-render); Chapter 12 needs Chapter 5 (effects).', 'cam'),
    en: 'The map: five stages, twenty chapters. React foundations, chapters one to four; thinking in React with hooks, five to seven; the Next.js App Router, eight to twelve; a real app, thirteen to sixteen; and production, seventeen to twenty. Each stage assumes the one before: chapter nine is unreadable without chapter three, and chapter twelve needs chapter five.' },
  { t: 'Trap: starting with Next.js before you know React', body: vsd(`<ul><li>A stale closure, a missing key, an effect re-running, state copied from a prop</li><li>…all read like framework quirks</li><li>You learn workarounds, not causes</li></ul>`,
      `<ul><li>Seven chapters of React with no framework in the way</li><li>Already know React? Skim, and check you can answer each chapter's traps</li><li>Then the rest of the course becomes cheap</li></ul>`,
      '✗ Next.js first', '✓ React first (Chapters 1–7)'),
    en: 'The trap: starting with Next.js because the tutorial you found did. Almost every first-week bug is a React bug in a Next.js hat — a stale closure, a missing key, an effect re-running — and without the React model underneath they read like framework quirks, so you learn workarounds instead of causes. That is why seven chapters of React come first.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('SPA', 'React alone in the browser; the server sends near-empty HTML'), kw('SSR', 'the page is rendered to HTML on the server'),
      kw('Hydration', 'the browser attaches handlers to server HTML'), kw('Server Component', 'runs only on the server, ships no JavaScript of its own'),
      kw('App Router', 'routing under app/ — what this course teaches'), kw('Bundle', 'the JavaScript sent to the browser — keep it small'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: SPA, React alone in the browser; SSR, HTML rendered on the server; hydration, the browser attaching handlers to that HTML; a Server Component, which runs only on the server; the App Router; and the bundle, the JavaScript sent to the browser.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Open cuongthai.com: guess what is server-rendered and what is interactive — then ${c('curl')} it to check`,
      'From memory, place the 20 chapters in 5 stages; compare with the map',
      'Write your one-line goal for the course, somewhere visible',
    ]), box('Keep these', `<ul><li>The other 95%: what runs where, why effects misbehave, real deploys</li><li>Examples from a real production app</li><li>5 stages, in order</li><li>The bar: explain why each page renders the way it does</li></ul>`, 'lam'), ''),
    en: 'Your turn: open cuongthai.com, guess what is server-rendered and what is interactive, then check with curl; place the twenty chapters into five stages from memory; and write your one-line goal. Keep: this course is the other ninety five percent; examples come from a real production app; five stages in order; and the bar is explaining why each page renders the way it does.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.1' }, S);
