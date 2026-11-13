/**
 * nxj-00-2 — Next.js · Section 0 · Lesson 0.2 "React vs Next.js: what each one is" (deck video + web, 13/11/2026).
 * Bài web: nextjs-0-2-react-vs-nextjs. Output THẬT (scratchpad/nxj/demo/n0-2.txt · Next.js 16.4.6 · React 19.3.0 · Node 22.23.3):
 * thư viện = BẠN gọi: node + renderToString(React.createElement('h1', …)) ⇒ <h1>Xin chào</h1>. Framework = NÓ gọi bạn: đặt src/app/blog/page.tsx ⇒
 * bảng route có /blog. Bẫy Pages Router trên 16.4.6: getServerSideProps trong app/ ⇒ build LỖI '"getServerSideProps" is not supported in app/';
 * next/router trong app/ ⇒ build LỖI "NextRouter was not mounted" (web cũ nói "bị lờ đi" — SAI với 16.4.6).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-2:thu-vien": "$ node -e \"…React.createElement('h1', null, 'Xin chào') → renderToString…\"\n<h1>Xin chào</h1>",
 "n0-2:file:src/app/blog/page.tsx": "'use client';\nimport { useRouter } from 'next/router';\n\nexport default function Blog() {\n  const router = useRouter();\n  return <h1>Đang ở: {router.pathname}</h1>;\n}\n",
 "n0-2:khung": "$ npm run build 2>&1 | grep -A6 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n└ ○ /blog\n\n\n○  (Static)  prerendered as static content",
 "n0-2:gssp": "$ npm run build 2>&1 | tail -14\n> Build error occurred\nError: Turbopack build failed with 1 error:\n./src/app/blog/page.tsx:1:23\nError: \"getServerSideProps\" is not supported in app/. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching\n> 1 | export async function getServerSideProps() {\n    |                       ^^^^^^^^^^^^^^^^^^\n  2 |   return { props: { tieuDe: 'Từ getServerSideProps' } };\n  3 | }\n  4 |\n\nEcmascript file had an error\n\n\n    at ignore-listed frames",
 "n0-2:router": "$ npm run build 2>&1 | tail -14\nError occurred prerendering page \"/blog\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted\n    at <unknown> (src/app/blog/page.tsx:5:18)\n  3 |\n  4 | export default function Blog() {\n> 5 |   const router = useRouter();\n    |                  ^\n  6 |   return <h1>Đang ở: {router.pathname}</h1>;\n  7 | }\n  8 | {\n  digest: '230069296'\n}\nExport encountered an error on /blog/page: /blog, exiting the build.\n⨯ Next.js build worker exited with code: 1 and signal: null"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, tree, icards, cmp, box, two, steps, kw, c, seq, tiers } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-00-2', code: 'NXJ 0.2', title: 'React vs Next.js: what each one is', sub: 'Section 0 · Lesson 0.2' };
const O = (k) => { const v = DU_LIEU[`n0-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

const lichSu = () => {
  const W = 1110, y = 112, ds = [
    ['2011', 'Jordan Walke', 'builds "FaxJS" inside Facebook', '#087ea4'], ['May 2013', 'React open-sourced', 'JSConf US', '#087ea4'],
    ['Oct 2013', 'Pete Hunt, JSConf EU', '"Rethinking best practices"', '#087ea4'], ['25 Oct 2016', 'Next.js 1.0', 'Guillermo Rauch · ZEIT (now Vercel)', '#111827'],
    ['2022–2023', 'App Router + RSC', 'Next 13 → stable in 13.4', '#0070f3'],
  ];
  const x0 = 120, dx = (W - 240) / (ds.length - 1);
  let s = `<svg viewBox="0 0 ${W} 240" width="${W}" height="240" font-family="Arial"><line x1="40" y1="${y}" x2="${W - 40}" y2="${y}" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>`;
  ds.forEach(([d, t, sub, m], i) => {
    const x = x0 + i * dx, tren = i % 2 === 0, ty = tren ? y - 88 : y + 58;
    s += `<circle cx="${x}" cy="${y}" r="13" fill="${m}"/><line x1="${x}" y1="${tren ? y - 14 : y + 14}" x2="${x}" y2="${tren ? y - 36 : y + 36}" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x}" y="${ty}" text-anchor="middle" font-size="17" fill="#64748b" font-weight="700">${d}</text><text x="${x}" y="${ty + 23}" text-anchor="middle" font-size="19" fill="${m}" font-weight="800">${t}</text><text x="${x}" y="${ty + 44}" text-anchor="middle" font-size="15" fill="#334155">${sub}</text>`;
  });
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.2', t: 'React vs Next.js:<br>what each one is', sub: 'A library you call, a framework that calls you — measured, not just said',
    en: 'Lesson zero point two: React versus Next.js — not competitors. React is a library you call; Next.js is a framework that calls you. We will show the difference with real commands, not just words.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Library vs framework: who calls whom — shown with real commands</li>
    <li>Who built each one, and why (dates checked)</li>
    <li>What React does — and deliberately leaves to you</li>
    <li>The five things Next.js adds on top</li>
    <li>App Router vs Pages Router — and what Next.js 16 does with old code</li>
    <li>How cuongthai.com is put together</li></ul>`,
    en: 'Six takeaways: library versus framework with real commands; who built each and why; what React does and leaves to you; the five things Next.js adds; App Router versus Pages Router and what Next sixteen does with old code; and how this site is put together.' },
  { t: 'A library you call, a framework that calls you', body: two(
      `<div><div class="cap" style="font-weight:700;color:#087ea4">React — YOU call it (a plain function)</div>${tn(O('thu-vien'), { fs: 14, wrap: 52 })}</div>`,
      `<div><div class="cap" style="font-weight:700;color:#111827">Next.js — IT calls you (put a file in place)</div>${tree(['src/app/', '  page.tsx        // "/"', '*  blog/', '*    page.tsx      // "/blog" — no router config'], { fs: 17 })}${tn(O('khung'), { fs: 14 })}</div>`) +
    box('The engine and the car', 'React is the engine that turns data into UI. Next.js is the car built around it: router, server, build system, deploy story — the parts React deliberately leaves empty.', 'lam'),
    en: 'A library you call, a framework that calls you. On the left, React called directly from Node: renderToString turns an h1 into HTML — React is just functions. On the right, you never call Next: you put a page dot tsx in an app slash blog folder, and the build table shows a slash blog route. React is the engine; Next is the car around it.' },
  { t: 'Who built them, and why', body: lichSu() + two(
      box('React — Facebook, 2011 → open source 2013', 'Jordan Walke built "FaxJS" to tame Facebook\'s UI (News Feed, ads). Mixing markup into JavaScript looked wrong — until Pete Hunt argued a component (markup + logic together) is the right unit.', 'lam'),
      box('Next.js — 2016, ZEIT (now Vercel)', 'Every team was re-inventing routing, server rendering and bundling around React. Guillermo Rauch packaged those decisions into one framework; App Router + React Server Components came in 2022–23.', 'xanh')),
    en: 'Who built them. React: Jordan Walke built FaxJS inside Facebook in twenty eleven to tame its UI; open-sourced in May twenty thirteen; Pete Hunt\'s JSConf EU talk argued that a component, markup plus logic, is the right unit. Next.js: first released on the twenty fifth of October twenty sixteen by Guillermo Rauch at ZEIT, now Vercel, to package routing, server rendering and bundling; App Router and React Server Components arrived in twenty twenty two to twenty three.' },
  { t: 'What React does — and what it deliberately leaves to you', body: cmp(['', 'React DOES', 'React does NOT'], [
      ['Building blocks', 'components, JSX, props, state, hooks', 'routing: which URL shows which page'],
      ['Updating the screen', 'the reconciler computes the minimal DOM update', 'rendering on a server'],
      ['Data', 'state you hold in components', 'conventions for fetching and caching data'],
      ['Shipping', '—', 'a build system, or how you deploy'],
    ]) + box('On its own, React runs only in the browser', 'Server sends near-empty HTML → browser downloads a JavaScript bundle → only then does the page appear (an SPA). Lesson 0.8 measured it: 379 bytes of HTML, an empty root.', 'cam'),
    en: 'What React does: components, JSX, props, state, hooks, and a reconciler that computes the minimal DOM update. What it deliberately does not do: routing, server rendering, data-fetching conventions, a build system, deployment. On its own it runs only in the browser — the SPA we measured in the start-here lesson.' },
  { t: 'What Next.js adds — five things', body: icards([
      ['map', '1 · File-system routing', '<code>app/blog/page.tsx</code> becomes <code>/blog</code> — no router config'],
      ['server', '2 · Server rendering by default', 'complete HTML first: fast first paint, real SEO'],
      ['layers', '3 · Server Components', 'most UI never ships to the browser; can read the DB directly'],
      ['db', '4 · Data & mutations', 'cached fetch, Server Actions for writes — no separate API layer'],
      ['box', '5 · Build & optimisation', 'bundling, code splitting, images and fonts, a production build'],
      ['check', 'Still React', 'a component is still a component — Next changes WHERE and WHEN it runs'],
    ], 2),
    en: 'What Next.js adds: file-system routing; server rendering by default; Server Components, so most UI never ships to the browser; data fetching with cache and Server Actions for writes; and a build with bundling, code splitting, image and font optimisation. Everything you learn about React stays true — Next changes where and when it runs, not what a component is.' },
  { t: 'App Router (app/) vs Pages Router (pages/)', body: cmp(['', 'App Router — this course', 'Pages Router — the old one'], [
      ['Folder', '<code>app/</code>', '<code>pages/</code>'],
      ['Getting data', 'async Server Components, <code>fetch</code>', '<code>getServerSideProps</code>, <code>getStaticProps</code>'],
      ['Navigation hooks', "<code>next/navigation</code>", "<code>next/router</code>"],
      ['Shared UI', 'nested <code>layout.tsx</code>', '<code>_app.tsx</code>, <code>_document.tsx</code>'],
      ['API', 'Route Handlers (<code>route.ts</code>)', '<code>pages/api/</code>'],
    ], { hl: [1, 2] }) + box('Check the tutorial before you trust it', 'Look at the date and the imports: <code>next/router</code> or <code>getServerSideProps</code> means it was written for the Pages Router (mostly before 2023).', 'cam'),
    en: 'Two routers live in one framework. The App Router, under the app folder, is what this course and cuongthai.com use: async Server Components for data, next slash navigation, nested layouts, route handlers. The Pages Router, under pages, uses getServerSideProps, next slash router, underscore app, and pages slash api. Check a tutorial\'s date and imports before trusting it.' },
  { t: 'Trap: Pages Router code inside app/ — what Next.js 16 really does', body: two(tn(O('gssp').split('\n').slice(0, 8).join('\n'), { fs: 13, wrap: 64 }), tn(O('router').split('\n').slice(0, 7).join('\n'), { fs: 13, wrap: 64 })) +
    two(box('getServerSideProps in app/', 'Next.js 16.4.6 refuses to build: <b>"getServerSideProps" is not supported in app/</b>. (Older advice says it is silently ignored — not on this version.)', 'do2'),
      box('next/router in app/', 'The build fails while pre-rendering /blog: <b>NextRouter was not mounted</b>. Use <code>next/navigation</code> instead (Chapter 8).', 'do2')) +
    box('The habit', 'Read the full message — both errors name the problem and link to the docs. Mixed-up tutorials still cost you time, but the build tells you where.', 'lam'),
    en: 'The trap, run for real on Next sixteen point four point six. getServerSideProps in an app page: the build stops with getServerSideProps is not supported in app. Older advice says it is silently ignored — not on this version. next slash router in an app page: the build fails while pre-rendering slash blog, NextRouter was not mounted. Read the whole message; both name the problem and link to the docs.' },
  { t: 'How cuongthai.com is put together', body: tiers([
      ['eye', 'Browser', 'your phone or laptop', '#64748b'],
      ['shield', 'nginx', 'TLS, compression, routes /api to the backend', '#1f8a3b'],
      ['layers', 'frontend/ — Next.js App Router', 'renders pages: some on the server, some in the browser', '#111827'],
      ['server', 'Node.js + Express API (project root)', 'auth, business logic, uploads', '#0070f3'],
      ['db', 'PostgreSQL (Prisma) · Cloudflare R2', 'data and files', '#7c3aed'],
    ], { th: 62, gap: 18 }) + box('Chapters 8–20 are a guided tour of frontend/', 'You will see why each page renders the way it does — and the outages that taught us.', 'lam'),
    en: 'How this site is put together: the browser talks to nginx; nginx sends pages to the frontend folder, a Next.js App Router app, and API calls to a separate Node and Express backend at the project root, which owns the database through Prisma and files on Cloudflare R2. Chapters eight to twenty are a guided tour of that frontend folder.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Library', 'code you call; you keep the structure'), kw('Framework', 'calls your code; owns routing, build, server'),
      kw('Reconciler', 'computes the minimal DOM update'), kw('App Router', 'routing under app/ + Server Components'),
      kw('Pages Router', 'the older pages/ system'), kw('next/navigation', 'App Router hooks — not next/router'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: library and framework, the reconciler, the App Router and the older Pages Router, and next slash navigation, the hooks you use instead of next slash router.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'List three things React does and three it leaves open',
      `Find any Next.js tutorial: App or Pages Router? Look for ${c('next/navigation')} vs ${c('next/router')}, ${c('getServerSideProps')}`,
      'One line: library vs framework — then place React and Next.js',
      `Optional: put ${c('getServerSideProps')} in an app/ page and read the build error`,
    ]), box('Keep these', `<ul><li>React = library (you call it)</li><li>Next.js = framework (it calls you)</li><li>Next changes where/when, not what</li><li>This course = App Router</li></ul>`, 'lam'), ''),
    en: 'Your turn: list what React does and leaves open; classify a random tutorial by its imports; write library versus framework in one line; and optionally put getServerSideProps in an app page and read the build error. Keep: React is a library you call, Next is a framework that calls you, Next changes where and when code runs, and this course is the App Router.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.2' }, S);
